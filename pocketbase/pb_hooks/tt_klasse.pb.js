/// <reference path="../pb_data/types.d.ts" />
//
// Klassen umstellen - ROUTEN und die Pflicht zum Klassencode (10.09.2026)
// ========================================================================
// Die Logik steht in `tt_klasse_lib.pb.js` (Begründung dort: `routerAdd`-
// Handler sehen den Kopf ihrer eigenen Datei nicht).
//
// Verträge (alle POST, Header Authorization: Bearer <tt_teachers-Token>):
//   /api/tt/kind-verschieben     { pupilId, zielCode }
//        → 200 { ok, pupilId, zielCode, zielName, mathecoach, mitgewandert }
//        → 401 nicht als Lehrkraft angemeldet
//        → 403 das Kind gehört nicht zu einer Klasse dieser Lehrkraft
//        → 400 kein Code / dieselbe Klasse / Zielklasse voll
//        → 404 Zielklasse unbekannt
//        → 409 Name in der Zielklasse schon vergeben
//   /api/tt/klassencode-aendern  { classCode, neuerCode, name? }
//        → 200 { ok, code, name }
//
// ⚠️ NIE eine Route auf "/" - das ist in PocketBase ein Alles-Fänger
// ([[reference_pocketbase_wurzelroute_falle]]).
//
// ── Klassenname nur JE KONTO eindeutig (20.09.2026, Testerin Punkt 1) ─────────
// Johannes' Testklasse: er legte eine Klasse „Test" an, und der Server wies
// sie ab, weil es „Test" schon gab - allerdings nicht bei ihm. GEMESSEN
// (20.09.2026): eine echte Namensprüfung gab es davor GAR NICHT, weder
// global noch je Konto - der einzige global eindeutige Wert an `tt_classes`
// ist `idx_tt_class_code` (unten in `setup.mjs`, Feld `code`). Was ihn wirklich
// traf: die Oberfläche schlägt den Klassencode AUS DEM NAMEN vor
// (`klassencodeVorschlag` in `src/lib/lernwerkstatt/klassencode.ts`, „Test" →
// „TEST"), und GENAU DIESER Code ist global eindeutig - eine andere Lehrkraft
// hatte „TEST" längst belegt. Der Klassencode BLEIBT global eindeutig (er ist
// der Anmelde-Schlüssel der Kinder); wer ihn selbst abändert, umgeht die
// Kollision ohnehin. Was jetzt NEU dazukommt, ist die von Johannes gewünschte
// Prüfung JE KONTO: dieselbe Lehrkraft bekommt eine klare Meldung, wenn sie
// denselben Namen zweimal vergibt (unten in der `onRecordCreateRequest` UND
// der `onRecordUpdateRequest` für `tt_classes`) - zwei verschiedene
// Lehrkräfte dürfen beide „Test" heissen.
//
// ── Nachbesserung 20.09.2026: der eigentliche Schmerz war noch offen ───────
// Johannes' Satz dazu, wörtlich: „Das Programm kann ja eine Nummer vergeben
// und damit arbeiten." Die Namenssperre oben löst NUR, dass er selbst nicht
// zweimal „Test" anlegt - sein eigentliches Anliegen (eine Klasse „Test"
// anlegen können, obwohl „TEST" als CODE anderswo vergeben ist) sass beim
// KLASSENCODE-VORSCHLAG, nicht beim Namen. Das steht jetzt im CLIENT
// (`pbBackend.createClass`, `account.ts createClass`): weicht der Vorschlag
// selbst aus ("TEST" → "TEST2" …), wenn die Lehrkraft ihn nicht selbst
// verändert hat (`codeSelbst === false`). Die Absage, falls wirklich nichts
// mehr frei ist ODER der Code SELBST getippt war, nennt jetzt ausdrücklich
// den Klassencode UND sagt, dass der Klassenname bleiben darf - vorher liess
// sich das leicht als „der Name ist vergeben" lesen.
//
// Deploy: beide Dateien nach pb_hooks/ + setup.mjs (Regeln) → „Update LMS
// (komplett)".

routerAdd("POST", "/api/tt/kind-verschieben", (e) => {
  return require(`${__hooks}/tt_klasse_lib.pb.js`).kindVerschieben(e);
});

routerAdd("POST", "/api/tt/klassencode-aendern", (e) => {
  return require(`${__hooks}/tt_klasse_lib.pb.js`).klassencodeAendern(e);
});

// --- Der Klassencode ist Pflicht (Wunsch Johannes, 10.09.2026) --------------
// Die Oberfläche erzeugt keinen Code mehr von selbst; ohne Code gibt es keine
// Anmeldung für die Kinder. Die Regel in setup.mjs verlangt schon einen nicht
// leeren Code - hier wird zusätzlich ein Code aus lauter Leerzeichen
// abgewiesen, den die Regel durchliesse.
// ⚠️ Bewusst NUR „nicht leer" und keine Zeichenregel: Bestehende Codes bleiben
// unverändert (Entscheidung Johannes), und der Sicherheits-Prüflauf
// (`verify-security.mjs`) legt Klassen mit eigenen Codes an. Die Zeichenregel
// prüft der Client beim Anlegen und die Route beim Ändern.
// Die Logik steht INLINE: auch ein Record-Hook sieht den Dateikopf nicht.
onRecordCreateRequest((e) => {
  const code = String(e.record.getString("code") || "").trim();
  if (!code) {
    throw new BadRequestError(
      "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.",
    );
  }

  // ── Klassenname nur JE KONTO eindeutig (20.09.2026) - Begründung oben im
  // Dateikopf. Die Prüfung selbst steht in `tt_klasse_lib.pb.js`
  // (`nameSchonVergeben`, per `require` - ein Record-Hook sieht auch mit
  // `require` nur, was die andere Datei EXPORTIERT, das reicht hier) - dort
  // ist sie mit einer nachgebauten App getestet
  // (`tests/tastenflow-klassenname-je-konto.test.ts`), ohne echten Server.
  const name = String(e.record.getString("name") || "").trim();
  const besitzer = String(e.record.getString("teacherUid") || "").trim();
  if (require(`${__hooks}/tt_klasse_lib.pb.js`).nameSchonVergeben(e.app, besitzer, name)) {
    throw new BadRequestError(
      "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.",
    );
  }

  e.next();
}, "tt_classes");

// ── Klassenname beim UMBENENNEN ebenso nur JE KONTO eindeutig ───────────────
// (20.09.2026, Nachbesserung Punkt 4 - der offene Punkt aus der ersten
// Fassung). Deckt den direkten Weg ab (`pb.collection("tt_classes").update(id,
// { name })`, wie ihn `pbBackend.updateClass` ohne Code-Wechsel geht); der
// ANDERE Weg, der Name UND Code zusammen ändert
// (`/api/tt/klassencode-aendern`), schreibt per `tx.save()` direkt und sieht
// diesen Wächter nie - dieselbe Prüfung steht darum zusätzlich in
// `aendereKlassencode` (`tt_klasse_lib.pb.js`).
//
// ⚠️ Nur geprüft, wenn sich der Name WIRKLICH ändert (`original()` dagegen
// gehalten): Vor dieser Regel gab es GAR KEINE Namensprüfung (siehe oben) -
// eine Lehrkraft könnte also längst zwei gleichnamige Klassen haben. Ohne
// diese Bedingung bliebe eine solche Klasse für JEDE künftige Änderung
// gesperrt, auch für eine, die den Namen gar nicht anfasst (Einstellungen,
// Programme …) - das wäre kein Schutz, sondern ein neuer Fehler.
onRecordUpdateRequest((e) => {
  const name = String(e.record.getString("name") || "").trim();
  let vorher = name;
  try {
    vorher = String(e.record.original().getString("name") || "").trim();
  } catch (_) {
    vorher = name;
  }
  if (name === vorher) {
    e.next();
    return;
  }
  const besitzer = String(e.record.getString("teacherUid") || "").trim();
  if (
    require(`${__hooks}/tt_klasse_lib.pb.js`).nameSchonVergeben(e.app, besitzer, name, e.record.id)
  ) {
    throw new BadRequestError(
      "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.",
    );
  }
  e.next();
}, "tt_classes");
