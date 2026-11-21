/// <reference path="../pb_data/types.d.ts" />
//
// Feld-Schutz für tt_pupils (Server-seitig) — Sicherheits-Fix SEC/K12
// -------------------------------------------------------------------
// Problem (Tiefentest 10.07., in [[project_zehnfinger_trainer]] / Testhandbuch
// §6.2): Die update-Regel von `tt_pupils` erlaubt einem KIND, den EIGENEN
// Datensatz zu ändern, solange es die unveränderte `teacherUid` mitschickt —
// ohne einzuschränken, WELCHE Felder. Ein technisch versiertes Kind konnte so
// per direktem PATCH Lehrkraft-Felder setzen (Sprach-Sperre aufheben, Tempo,
// Wochenziel, Einhand-Regel, Ziel-Reset, Stufe der Kompetenz …). Das Frontend
// sperrt diese Felder nur optisch (disabled) — der Server tat es NICHT.
//
// Fix (fail-closed): Bei einem SELBST-Update eines Kindes (Auth = tt_pupils und
// die eigene Datensatz-ID) werden alle Lehrkraft-/Identitäts-Felder zwingend auf
// den in der Datenbank GESPEICHERTEN Wert zurückgesetzt — egal, was im Body
// stand. Legitime Selbst-Einstellungen des Kindes bleiben unberührt:
//   • stufe      (Textstufe/Alter — Kind wählt sie selbst)
//   • lang       (Inhaltssprache — ABER nur, wenn die Lehrkraft sie NICHT
//                 gesperrt hat; bei langLocked=true wird lang zurückgesetzt)
//   • toolProfile (Hilfsmittel-Profil in „im Griff" — Kind wählt selbst)
//   • zeichenabstand („Zeichenabstand groß (CVI)", 19.09.2026) - JEDES Kind,
//                 auch eines einer Klasse; geprüft wird nur der WERT (1-4)
//   • bedienSprache (Sprache der Knöpfe) - jedes Kind; nur der WERT wird geprüft
//   • zeitzone   (D2, 28.09.2026: Zeitzone des Geräts für die Uhrzeiten in
//                 Mails) - jedes Konto; nur die FORM wird geprüft
//   • noTimePressure („Zeit lassen") — ABER nur bei Konten OHNE Lehrkraft
//                 (selfManaged); Kinder einer Klasse bekommen den Schalter von
//                 ihrer Lehrkraft, genau wie „Einhand schreiben"
//   • oneHand, gezielt (13.11.2026), Wochenziel, geburtsjahr, startUnits - ebenfalls NUR bei Konten
//                 ohne Lehrkraft (Johannes 19.09.2026: „Selbstlernende sollen
//                 sich alles einstellen können")
//   • Passwort   (eigener Passwortwechsel; Auth-Felder fasst der Guard nicht an)
//
// Lehrkräfte (Auth = tt_teachers, über die Klassen-/manageRule) und Superuser
// laufen NICHT in diesen Zweig — für sie ändert sich nichts.
//
// ★ EINE AUSNAHME davon (E1, 24.09.2026): der LERNWEG (`lernweg`, ganz unten)
// ist für ALLE ausser Superusern nur schreibbar, solange er leer ist - seit
// W2b (28.09.2026) mit einer Ausnahme: die Lehrkraft DIESER Klasse stellt ihn
// je Kind um. Siehe dort.
//
// Deploy: Datei nach pb_hooks/ + `systemctl restart pocketbase`. Rein additiv,
// keine Schema-Änderung. Siehe [[reference_pocketbase_hook_scope]].

onRecordUpdateRequest((e) => {
  // Nur eingeloggte Kinder, die IHREN eigenen Datensatz ändern, sind betroffen.
  let isPupilSelf = false;
  try {
    const auth = e.auth;
    isPupilSelf =
      !!auth &&
      auth.collection().name === "tt_pupils" &&
      auth.id === e.record.id;
  } catch (_) {
    isPupilSelf = false;
  }

  if (isPupilSelf) {
    // Gespeicherten Stand frisch aus der DB laden (noch die alten Werte, da der
    // Update erst nach diesem Hook geschrieben wird). Schlägt das fehl, wird der
    // Schreibvorgang ABGEWIESEN — lieber verweigern als ungeprüft speichern.
    const stored = e.app.findRecordById("tt_pupils", e.record.id);

    // Felder, die ein Kind NIE über den eigenen Datensatz setzen darf:
    //  – Identität/Zuordnung: teacherUid, classCode, name, createdAtMs,
    //                          selfManaged, lastSeenAtMs, inactiveNoticeAtMs
    //  – Auth-Identität:      email, emailVisibility, verified
    //  - Lehrkraft-Steuerung: tempo, goal* (alte Felder), goalResetWeek,
    //                          goalExcusedWeeks, langLocked, skillLevel
    // Was ein Konto OHNE Lehrkraft selbst setzen darf (oneHand, Wochenziel,
    // Zeit lassen, Geburtsjahr, Startpunkt), steht NICHT hier, sondern weiter
    // unten mit der Ausnahme `selfManaged`. Stünde es hier, setzte diese
    // Liste es zuerst zurück, und die Ausnahme dort liefe ins Leere - genau
    // das war beim Zeichenabstand bis 19.09.2026 der Fall (siehe dort).
    const LOCKED = [
      "teacherUid",
      "classCode",
      "name",
      "createdAtMs",
      "email",
      "emailVisibility",
      "verified",
      // Klartext-Spiegel des echten Passworts (14.09.2026, `setup.mjs`) -
      // schreibt NUR `addPupil`/`resetPupilPassword` serverseitig, nie ein
      // Selbst-Update. Sonst könnte ein Kind sich per PATCH einen falschen
      // Text eintragen, den die Lehrkraft später als sein Passwort ausdruckt.
      "passwordPlain",
      // Kontakt-E-Mail (14.09.2026) - wohin das eigene Passwort per Mail
      // geht, entscheidet NUR die Lehrkraft. Ohne diese Sperre könnte ein
      // Kind seine Kontakt-Adresse per PATCH auf eine beliebige fremde
      // umbiegen, die es selbst kontrolliert (z. B. eine zweite eigene
      // Adresse ausserhalb der Kenntnis der Erziehungsberechtigten) - und
      // bekäme dann bei der nächsten Zurücksetzung sein eigenes neues
      // Passwort dorthin zugeschickt, ohne dass die Lehrkraft das gewählt hat.
      "contactEmail",
      "tempo",
      "goalMinutes",
      "goalUnits",
      // `goalWeeks`, `goalCatchUp` und `wochenzielVerlauf` stehen seit
      // 19.09.2026 NICHT mehr hier, sondern unten bei der Ausnahme
      // `selfManaged` („Wochenziel") - für Kinder einer Klasse bleiben sie
      // genauso gesperrt wie bisher.
      //
      // „Überfällige zurücksetzen" und „Wochenziel erlassen" bleiben
      // Werkzeuge der Lehrkraft (für ein krankes Kind, für Ferien) - auch
      // bei Konten ohne Lehrkraft gibt es dafür keine Bedienung.
      "goalResetWeek",
      "goalExcusedWeeks",
      // `oneHand` („Einhand schreiben") steht seit 19.09.2026 unten bei der
      // Ausnahme `selfManaged` - wie „Zeit lassen".
      //
      // `zeichenabstand` („Zeichenabstand groß (CVI)") steht seit 19.09.2026
      // gar nicht mehr hier - JEDES Kind stellt ihn selbst ein, geprüft wird
      // unten nur der Wert.
      "langLocked",
      "skillLevel",
      // Selbstlernende (09.08.2026): Die Konto-ART und die Zeitrechnung, an der
      // Wochenbericht und Löschfrist hängen, schreibt NUR der Server. Sonst
      // könnte ein Konto sich zum Selbstlerner erklären (und damit aus der
      // Klasse schreiben) oder seine eigene Löschung endlos hinausschieben.
      "selfManaged",
      "lastSeenAtMs",
      "inactiveNoticeAtMs",
      "lastReportWeek",
      // Lektions-Freigaben (07.09.2026). Welche Lektionen für dieses Kind
      // abweichend von seiner Klasse offen oder zu sind, entscheidet die
      // Lehrkraft — sonst wäre die Einstellung wertlos: Die updateRule lässt
      // ein Kind seinen eigenen Datensatz schreiben, es könnte sich also jede
      // zurückgehaltene Lektion selbst aufsperren.
      //
      // ⚠️ KEINE Ausnahme für `selfManaged` (anders als bei geburtsjahr oder
      // noTimePressure). Ein Konto ohne Lehrkraft hat auch keine Klasse und
      // damit nichts, wovon es abweichen könnte — bei ihm ist das Feld immer
      // leer, und leer heißt „alles offen" (`lektionsfreigabe.lektionOffen`).
      "lessonLocks",
      // ★ Plus (23.09.2026): die Beschlüsse der Lehrkraft - eigene Schulstufe
      // und Einstufungen je Übung. Stünde es nicht hier, stellte sich ein Kind
      // per PATCH jede Übung auf „sitzt" oder wählte sich aus der Schulstufe
      // seiner Klasse heraus. KEINE Ausnahme für `selfManaged`: Wer ohne
      // Lehrkraft lernt, wählt seine Stufe in Plus ohnehin frei und hat
      // niemanden, der für ihn beschliesst.
      "plusBeschluss",
      // ★ 25.09.2026: die eigene Schulstufe in Tastenflow - wie `plusBeschluss`
      // ein Beschluss der Lehrkraft. Ohne diese Zeile wählte sich ein Kind per
      // PATCH aus der Schulstufe seiner Klasse heraus.
      "schulstufe",
      "schulstufeSchuljahr",
      // ★★★ „Vorlesen bei Prüfungen erlaubt" (10.09.2026, ersetzt den
      // Zeitzuschlag). Wer vorgelesen bekommt, entscheidet die Lehrkraft - sie
      // kennt das Kind. Stünde es hier nicht, könnte sich jedes Kind vor einer
      // Tippchallenge selbst Wartezeit gutschreiben lassen; die updateRule lässt
      // es ja seinen eigenen Datensatz schreiben.
      // KEINE Ausnahme für `selfManaged`: Ein Konto ohne Lehrkraft hat auch
      // keine Klasse und schreibt darum nie eine Tippchallenge.
      "vorlesenPruefung",
      // ★ GEPRÜFT UND BEWUSST NICHT HIER (19.09.2026, `lib/spendenbanner.ts`):
      // `spendenAufrufAm`/`spendenAufrufMeilenstein`. Ein Kind EINER Klasse
      // bekommt den Spendenbanner nie (siehe `SpendenBanner.tsx` - es kriegt
      // dafür nie eine `kontoId`/`stundenGesamt` gereicht), darum ist dieses
      // Feld bei ihm ohne jede Wirkung, egal ob gesperrt oder nicht. Ein
      // SELBSTLERNENDES Konto ohne Lehrkraft dagegen MUSS es selbst schreiben
      // dürfen - es quittiert sein eigenes Popup, und es gibt niemanden
      // sonst, der das für dieses Konto täte.
      //
      // ★ EBENSO GEPRÜFT UND BEWUSST NICHT HIER (Z4, 19.09.2026,
      // `src/lib/typing/rundgang.ts`): `rundgaengeGesehen`. Die Liste sagt nur,
      // welche Rundgänge beim ersten Betreten DIESEM Konto schon gezeigt
      // wurden - das Kind schreibt sie für sich selbst, sobald es einen
      // gesehen hat (auch ein Kind EINER Klasse, sonst käme der Rundgang auf
      // jedem neuen Gerät wieder). Mehr als „Rundgang zeigen oder nicht" hängt
      // an ihr nicht; gesperrt würde sie jeden Rundgang endlos wiederholen.
      //
      // ★ EBENSO GEPRÜFT UND BEWUSST NICHT HIER (19.09.2026,
      // `src/lib/spendeBestaetigt.ts`): `gespendetAm`. Die Begründung ist
      // dieselbe wie bei `spendenAufrufAm` oben: Ein Kind EINER Klasse bekommt
      // den Spendenbanner nie, das Feld ist bei ihm ohne jede Wirkung. Ein
      // SELBSTLERNENDES Konto kommt nach seiner Spende selbst auf die
      // Dankesseite zurück und muss sein eigenes Konto dort als „hat
      // gespendet" merken können - es gibt niemanden sonst, der das für es
      // täte. Mehr als „Spendenbanner zeigen oder nicht" hängt nicht daran.
    ];
    for (let i = 0; i < LOCKED.length; i++) {
      e.record.set(LOCKED[i], stored.get(LOCKED[i]));
    }

    // Sprache darf das Kind nur wechseln, solange die Lehrkraft sie nicht
    // gesperrt hat (langLocked). Bei Sperre auf den gespeicherten Wert zurück.
    if (stored.get("langLocked")) {
      e.record.set("lang", stored.get("lang"));
    }

    // ★ Die Sprache der BEDIENUNG (EN9, 19.09.2026) darf das Kind selbst
    // setzen - sie steht darum NICHT in LOCKED: Es schaltet die Knöpfe um,
    // nicht die Übungsinhalte (die sperrt `langLocked` oben weiter). Daran
    // hängt nur, in welcher Sprache Mails an dieses Konto gehen
    // (tt_mail_texte_lib.pb.js). Geprüft wird nur der WERT: "", "de" oder
    // "en" - alles andere bleibt beim gespeicherten.
    // ★ E2a (25.09.2026, Gerüst französischer Lehrgang): "fr" dazu - reine
    // Wertfreigabe, kein Schema-Umbau (setup.mjs: freier Text).
    // ★ ES-M (27.09.2026): "es" dazu - als Liste IM Handler (ein Handler
    // sieht den Kopf seiner Datei nicht, tests/pocketbase-hook-scope.test.ts).
    // ★ G2b-2 (02.10.2026): "it", "pl", "tr", "cs" dazu - sonst setzte der Wächter
    // die Wahl eines Kindes in der neuen Sprache still auf den alten Wert zurück.
    // ★ G2-NEUN (25.10.2026): dazu die neun Sprachen des Gerüsts.
    const BEDIEN_SPRACHEN = ["", "de", "en", "fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];
    const bs = String(e.record.getString("bedienSprache") || "");
    if (BEDIEN_SPRACHEN.indexOf(bs) < 0) {
      e.record.set("bedienSprache", stored.get("bedienSprache"));
    }

    // ★ D2 (28.09.2026): die Zeitzone des Geräts (`zeitzone`, IANA-Name wie
    // „America/Mexico_City") - danach richten sich die Uhrzeiten in Mails an
    // dieses Konto (`tt_zeitzone_lib.pb.js`). Wie `bedienSprache` NICHT
    // gesperrt: Es ist die Zone des Kontos selbst. Geprüft wird nur die FORM
    // (dieselbe wie `istZeitzonenName` in `src/lib/typing/zeitzone.ts`);
    // alles andere bleibt beim gespeicherten Wert. Leer ist erlaubt.
    const zz = String(e.record.getString("zeitzone") || "");
    if (zz !== "" && (zz.length > 64 || !/^[A-Za-z_]+(\/[A-Za-z0-9_+-]+){0,2}$/.test(zz))) {
      e.record.set("zeitzone", stored.get("zeitzone"));
    }

    // „Zeit lassen" (14.08.2026): Wer eine Lehrkraft hat, bekommt den Schalter
    // von ihr (wie oneHand) — nur selbstlernende Konten ohne Klasse stellen ihn
    // selbst um. Sonst auf den gespeicherten Wert zurück.
    if (!stored.get("selfManaged")) {
      e.record.set("noTimePressure", stored.get("noTimePressure"));
    }

    // ★★★ „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026) - seit 19.09.2026
    // darf JEDES Kind ihn selbst setzen, auch eines einer Klasse. Johannes,
    // wörtlich: *„die CVI-Einstellungen kann sich jedes Kind immer auch selbst
    // in den Einstellungen einstellen, aber auch die Lehrkraft, Kinder dürfen
    // es ändern wie sie möchten"*. Die Lehrkraft stellt ihn weiter in „Meine
    // Klassen" um - wer zuletzt stellt, gilt.
    //
    // ⚠️ BEFUND beim Umbau: Bis dahin stand `zeichenabstand` in der
    // LOCKED-Liste oben UND hatte hier eine Ausnahme für `selfManaged`. Die
    // Liste setzte das Feld aber schon VOR der Ausnahme auf den gespeicherten
    // Wert zurück - die Ausnahme erlaubte also nichts. Auch selbstlernende
    // Konten konnten den Zeichenabstand am Server nie selbst setzen; ihr
    // Zahnrad zeigte die Wahl, bis zum nächsten Laden.
    //
    // Geprüft wird nur der WERT, wie bei `bedienSprache`: 1 (aus), 2, 3, 4
    // oder 5 („einfach", 22.09.2026 - Verdunkelung und Zeilenschaltung
    // bleiben, nur die Zeichen rücken nicht auseinander) - alles andere
    // bleibt beim gespeicherten.
    const za = Number(e.record.get("zeichenabstand"));
    if (za !== 1 && za !== 2 && za !== 3 && za !== 4 && za !== 5) {
      e.record.set("zeichenabstand", stored.get("zeichenabstand"));
    }

    // ★ „Einhand schreiben" (19.09.2026, Johannes: *„Selbstlernende sollen
    // sich alles einstellen können"*): dieselbe Regel wie „Zeit lassen" - in
    // einer Klasse setzt ihn die Lehrkraft, ein Konto ohne Lehrkraft stellt
    // ihn selbst um. Stand bis dahin in LOCKED, ohne Ausnahme.
    if (!stored.get("selfManaged")) {
      e.record.set("oneHand", stored.get("oneHand"));
    }

    // ★ „Gezielt üben" (13.11.2026): dieselbe Regel wie „Einhand schreiben" - in
    // einer Klasse stellt es die Lehrkraft ein (sie schreibt über ihre Klassen-
    // Regel, nicht über diesen Zweig), ein Konto ohne Lehrkraft (selfManaged)
    // stellt es selbst. Sonst auf den gespeicherten Wert zurück.
    if (!stored.get("selfManaged")) {
      e.record.set("gezielt", stored.get("gezielt"));
    }

    // ★ Das WOCHENZIEL (19.09.2026, derselbe Auftrag): ein Konto ohne
    // Lehrkraft setzt sein Wochenziel selbst (`setWochenziel` in
    // `pbBackend.ts` schreibt die drei Felder zusammen). In einer Klasse
    // bleibt es bei der Lehrkraft - sonst könnte sich ein Kind per PATCH sein
    // eigenes Wochenziel setzen. Stand bis dahin in LOCKED, ohne Ausnahme.
    // Der Verlauf ist ein JSON-Feld; was ein Konto ohne Lehrkraft dort
    // hineinschreibt, betrifft nur sein eigenes Wochenziel, und die Rechnung
    // (`kindWochenzielAusFeldern`) verwirft jeden ungültigen Abschnitt.
    if (!stored.get("selfManaged")) {
      e.record.set("wochenzielVerlauf", stored.get("wochenzielVerlauf"));
      e.record.set("goalWeeks", stored.get("goalWeeks"));
      e.record.set("goalCatchUp", stored.get("goalCatchUp"));
    }

    // Geburtsjahr (15.08.2026): dieselbe Regel wie „Zeit lassen". Es steuert die
    // Textstufe (`account.stufeFuer`) und ist damit eine Lehrkraft-Angabe, keine
    // Selbst-Einstellung; ein Kind einer Klasse könnte sich sonst per PATCH ein
    // Alter geben, das seine Lehrkraft nicht gewählt hat. Konten OHNE Lehrkraft
    // (selfManaged) dürfen es selbst setzen — dort gibt es niemanden sonst.
    if (!stored.get("selfManaged")) {
      e.record.set("geburtsjahr", stored.get("geburtsjahr"));
    }

    // Vorkenntnisse „Womit anfangen?" (01.09.2026): dieselbe Regel wie „Zeit
    // lassen" und das Geburtsjahr - und aus demselben Grund. Der Startpunkt
    // sagt, welche Tasten von Anfang an frei sind; in einer Klasse ist das
    // eine Angabe der Lehrkraft, und ein Kind könnte sich sonst per PATCH
    // Tasten geben, die sie nicht gewählt hat. Konten OHNE Lehrkraft
    // (selfManaged) dürfen es selbst setzen - dort gibt es niemanden sonst.
    //
    // ⚠️ `startUnits` stand bis dahin in der harten LOCKED-Liste, ohne diese
    // Ausnahme. Ein selbstlernendes Konto konnte seinen Startpunkt also auch
    // nachträglich nicht mehr ändern - es gab niemanden, der es gedurft
    // hätte. Genau die Lücke, die Johannes am 01.09. gemeldet hat.
    //
    // ★★★ 04.09.2026: `startUnitsAt` gehört UNTRENNBAR dazu. Der Zeitstempel
    // macht aus dem Wert einen BESCHLUSS, und nur ein Beschluss stuft zurück
    // (`letters.startpunktAnwenden`). Bliebe er hier ungeschützt, könnte ein
    // Kind einer Klasse per PATCH einen frischen Beschluss vortäuschen - und
    // sich damit über den Startpunkt seiner Lehrkraft hinwegsetzen. Ein Feld
    // zu schützen und sein Gegenstück zu vergessen, ist die Lücke, die
    // niemandem auffällt, bis sie jemand benutzt.
    if (!stored.get("selfManaged")) {
      e.record.set("startUnits", stored.get("startUnits"));
      e.record.set("startUnitsAt", stored.get("startUnitsAt"));
    }

    // ★★ „Bereit für die Tippchallenge" (10.09.2026). Das Kind DARF dieses
    // Feld schreiben - sein Gerät meldet, dass es den Plan der angesetzten
    // Challenge kennt. Darum steht es NICHT in LOCKED. Aber:
    //  • Die ZEIT setzt der Server. Die Lehrkraft liest „bereit" als „vor
    //    höchstens zwei Minuten gemeldet"; mit der Uhr des Geräts entschiede
    //    eine falsch gestellte Schuluhr darüber, ob ein Kind bereit aussieht.
    //  • Gespeichert wird nur eine Kennung (höchstens 40 Zeichen) und die Zeit -
    //    nichts, was das Kind sonst hineinschreibt.
    // Nur wenn sich der Wert GEÄNDERT hat: Eine andere Selbst-Einstellung
    // (Sprache, Stufe) darf nicht nebenbei als Lebenszeichen gelten.
    // JSON-Feld: nur über getString + JSON.parse ([[reference_pocketbase_hook_scope]]).
    try {
      const neuRoh = e.record.getString("probeBereit");
      if (neuRoh !== stored.getString("probeBereit")) {
        let o = null;
        try {
          o = JSON.parse(String(neuRoh));
        } catch (_) {
          o = null;
        }
        const id =
          o && typeof o === "object" && !Array.isArray(o)
            ? String(o.probeId || "").slice(0, 40)
            : "";
        e.record.set("probeBereit", id ? { probeId: id, ms: Date.now() } : null);
      }
    } catch (_) {
      e.record.set("probeBereit", stored.get("probeBereit"));
    }
  }

  // ★★★ DER LERNWEG (E1, 24.09.2026 - `apps/tastenflow/BAUPLAN-2026-09-24-
  // ENGLISCHER-LEHRGANG.md` §2.2). In welcher Reihenfolge die Tasten kommen
  // („de" oder „en"), wird beim ersten Fortschritt EINMAL festgelegt und
  // springt danach nie mehr um - sonst verlöre ein Kind freigeschaltete
  // Tasten, und jede gespeicherte Anzahl (`startUnits`) hiesse auf einmal
  // etwas anderes. Darum hier am Server erzwungen, nicht nur im Browser:
  //  • Steht schon ein Weg drin, bleibt er - für JEDEN ausser Superusern
  //    und (★ W2b, 28.09.2026) der Lehrkraft DIESER Klasse, die ihn je Kind
  //    umstellt (gemischte Klassen). Die Klasse selbst gibt ihren Weg weiter
  //    nur NEUEN Kindern; das Kind stellt ihn nach dem ersten Start nie um.
  //  • Ist das Feld leer, darf es gesetzt werden - aber nur auf "de", "en",
  //    "fr" (E2a) oder "es" (ES-M); alles andere bleibt leer (= „de").
  // Ausserhalb des Kind-Zweigs oben, weil die Regel für alle gilt. Der
  // gespeicherte Stand wird darum hier eigens geladen (fail-closed wie oben).
  let vonSuperuser = false;
  try {
    vonSuperuser = !!e.auth && e.auth.collection().name === "_superusers";
  } catch (_) {
    vonSuperuser = false;
  }
  if (!vonSuperuser) {
    const vorher = e.app.findRecordById("tt_pupils", e.record.id);
    const alt = String(vorher.getString("lernweg") || "");
    const neu = String(e.record.getString("lernweg") || "");
    // ★ E2a (25.09.2026, Gerüst französischer Lehrgang): "fr" dazu.
    // ★ ES-M (27.09.2026): "es" dazu - Liste im Handler (siehe oben).
    // ★ G2b-2 (02.10.2026): "it", "pl", "tr", "cs" dazu (sonst würde der Weg eines
    // Kindes der neuen Sprache am Server auf leer = „de" zurückgesetzt).
    // ★ G2-NEUN (25.10.2026): dazu die neun Wege des Gerüsts.
    const LERNWEGE = ["", "de", "en", "fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];

    // ★★★ W2b (28.09.2026, Weg je Kind - Johannes: gemischte Klassen): Die
    // LEHRKRAFT DIESER KLASSE darf einen schon gesetzten Weg umstellen - auf
    // einen gültigen, nie auf leer. Das Kind selbst nie (es läuft oben in
    // `isPupilSelf` und kommt hier nicht durch, weil es keine Lehrkraft ist),
    // eine fremde Lehrkraft nie. Geprüft wird HIER noch einmal, nicht nur in
    // der updateRule: gegen den GESPEICHERTEN Klassencode, Eigentümerin der
    // Klasse (`tt_classes`) oder Co-Lehrkraft (`tt_class_teachers`).
    // Fail-closed: Jeder Fehler beim Nachsehen heisst „keine Lehrkraft der
    // Klasse", der Weg bleibt. Der Fortschritt wird hier NICHT angefasst - den
    // parkt das Kind beim nächsten Öffnen (`src/lib/typing/wegWechsel.ts`).
    let lehrkraftDerKlasse = false;
    if (alt !== "" && neu !== "" && neu !== alt && LERNWEGE.indexOf(neu) >= 0) {
      try {
        const auth = e.auth;
        const code = String(vorher.getString("classCode") || "");
        if (auth && auth.collection().name === "tt_teachers" && code !== "") {
          try {
            e.app.findFirstRecordByFilter("tt_classes", "code = {:c} && teacherUid = {:t}", {
              c: code,
              t: auth.id,
            });
            lehrkraftDerKlasse = true;
          } catch (_) {
            e.app.findFirstRecordByFilter(
              "tt_class_teachers",
              "classCode = {:c} && teacherUid = {:t}",
              { c: code, t: auth.id },
            );
            lehrkraftDerKlasse = true;
          }
        }
      } catch (_) {
        lehrkraftDerKlasse = false;
      }
    }

    if (!lehrkraftDerKlasse && (alt !== "" || LERNWEGE.indexOf(neu) < 0)) {
      e.record.set("lernweg", alt);
    }
  }

  e.next();
}, "tt_pupils");
