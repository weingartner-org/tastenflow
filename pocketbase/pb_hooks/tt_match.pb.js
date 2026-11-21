/// <reference path="../pb_data/types.d.ts" />
//
// Das KLASSENMATCH am Server (11.09.2026, Etappe E6)
// ==================================================
// Johannes (Umbauplan §1 F): Ein Kind lädt seine Klasse zu einem Match ein,
// alle schreiben fünf Minuten auf ihrem eigenen Tastenniveau, ein Ranking läuft
// mit. „Es gibt keine Statistik; Lehrer wissen nicht, wer wie oft ein Match
// macht."
//
// Die Regeln stehen in `setup.mjs` (Kinder derselben Klasse lesen; schreiben
// nur die eigene Zeile bzw. der Gastgeber sein Match; KEINE Lehrkraft-Regel).
// Diese Datei ist das, was Regeln nicht können:
//
//   1. WAS DER SERVER SETZT. `hostName`, `status`, `dauerMin`, `createdMs`,
//      `startMs` und `endeMs` kommen NIE aus dem Browser. Ein Kind, das sich
//      eine Stunde Spielzeit oder einen fremden Namen einträgt, bekommt sie
//      überschrieben.
//   2. DIE GRENZE. Kein Match, wo die Lehrkraft es abgeschaltet hat
//      (`tt_classes.klassenmatchAus`). ⚠️ Bis 15.09.2026 gab es zusätzlich
//      „höchstens zwei offene Matches je Klasse" (F9) - Johannes wollte keine
//      feste Zahl mehr (*„ich möchte dass mehr wie 2 match parallel laufen
//      können"*), die Prüfung ist ganz weg.
//   3. DIE ÜBERGÄNGE. einladung → countdown → laeuft → fertig/abgebrochen. Alles
//      andere wird abgewiesen; ein Match lässt sich nicht zurückdrehen.
//   4. DAS AUFRÄUMEN. Ein Lauf je Minute: abgelaufene Matches schliessen,
//      unbeantwortete Einladungen abbrechen, alles eine Stunde nach dem Ende
//      löschen. **Was gelöscht ist, kann niemand auswerten** - das ist F10,
//      kein Nebeneffekt. Bleibt nur je Kind die TEILNAHME (`tt_match_verlauf`,
//      seit 14.11.2026 ohne Platz, Zahlen und Hilfsmittel - siehe Schritt 3).
//
// ── ⚠️ DIE UHR LÄUFT HIER NICHT ────────────────────────────────────────────
// Der Cron läuft einmal je Minute und ist damit für ein Fünf-Minuten-Spiel viel
// zu langsam. Das ist Absicht: Das ENDE rechnet jeder Client selbst aus
// `startMs`/`endeMs` (dieselben zwei Zahlen bei allen, also dasselbe Ende), und
// der Gastgeber setzt `status` auf `fertig`. Der Cron ist nur das Netz für den
// Fall, dass niemand mehr da ist, der es täte.
//
// Deploy: Datei nach pb_hooks/ + Neustart → »Update LMS (komplett)«. Rein
// additiv zum Schema, das `setup.mjs` ohnehin mitbringt.
// Siehe [[reference_pocketbase_hook_scope]].

// Die Zahlen stehen zusätzlich im Client (`lib/typing/klassenmatch.ts`). Wer
// eine davon ändert, ändert BEIDE - der Client zeichnet damit die Uhr, der
// Server setzt damit die Zeiten.
//
// ★★★★★ GEMESSEN AM LIVE-SERVER, 11.09.2026, 17:51 (Sarahs erster Klick):
//   ReferenceError: MATCH_DAUER_MIN is not defined at pb.js:72
// Ein `onRecordCreateRequest`-Handler sieht NICHTS aus dem Dateikopf - keine
// Konstante, keine Funktion ([[reference_pocketbase_hook_scope]], dritter
// Fallstrick). Die Notiz war hier nur für `cronAdd` beachtet. Darum liegt
// alles, was mehr als ein Handler braucht, in `tt_match_lib.pb.js`, und JEDER
// Handler holt es sich selbst per `require` - genau wie `tt_klasse.pb.js`.
// Der Wächter `tests/pocketbase-hook-scope.test.ts` hält das für alle Hooks.

// --- Anlegen: der Server schreibt, was ihm gehört ---------------------------
onRecordCreateRequest((e) => {
  const L = require(`${__hooks}/tt_match_lib.pb.js`);
  let kind = null;
  let vonSuperuser = false;
  try {
    const auth = e.auth;
    if (auth && auth.collection().name === "_superusers") vonSuperuser = true;
    else if (auth && auth.collection().name === "tt_pupils") kind = auth;
  } catch (_) {
    kind = null;
  }
  if (vonSuperuser) {
    e.next();
    return;
  }
  // Ohne Kind-Anmeldung kommt hier ohnehin niemand durch (create-Regel), aber
  // fail-closed ist billiger als eine Annahme.
  if (!kind) throw new BadRequestError("Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.");

  const code = String(kind.getString("classCode") || "").trim();
  if (!code) throw new BadRequestError("Ein Klassenmatch gibt es nur in einer Klasse.");

  // --- Hat die Lehrkraft das Match abgeschaltet? (F8) -----------------------
  // ⚠️ Fail-OPEN, und das ist eine Entscheidung: Lässt sich die Klasse nicht
  // lesen, gilt „erlaubt". Die Vorgabe des Feldes ist „erlaubt" (es heisst
  // darum „Aus" und nicht „Erlaubt"), und eine kaputte Abfrage darf einem Kind
  // nicht das Spiel nehmen. Wer es wirklich abgeschaltet hat, dessen Klasse
  // ist lesbar - sonst hätte sie den Schalter nie bekommen.
  try {
    const klasse = e.app.findFirstRecordByFilter("tt_classes", "code = {:c}", { c: code });
    if (klasse && klasse.getBool("klassenmatchAus")) {
      throw new BadRequestError(
        "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.",
      );
    }
  } catch (err) {
    if (err instanceof BadRequestError) throw err;
    e.app.logger().warn("[tt-match] Klasse nicht lesbar", "klasse", code, "error", String(err));
  }

  // ⚠️ Bis 15.09.2026 stand hier „höchstens zwei offene Matches je Klasse"
  // (F9). Johannes wollte keine feste Zahl mehr - die Prüfung ist ersatzlos
  // weg, siehe Dateikopf.

  // --- Ein Kind, ein Match (02.10.2026) -------------------------------------
  // Wer schon Gastgeber eines offenen Matches ist oder in einem dabei ist,
  // legt kein zweites an. Begründung in `tt_match_lib.pb.js` (`einKindEinMatch`).
  const sperre = L.einKindEinMatch(e.app, kind.id, code, "");
  if (sperre) throw new BadRequestError(sperre);

  // --- Was der Server setzt ------------------------------------------------
  e.record.set("classCode", code);
  e.record.set("hostUid", kind.id);
  // ★ Der NAME kommt aus dem Kind-Datensatz, nicht aus dem Rumpf: Sonst könnte
  // ein Kind eine Einladung im Namen eines anderen ausschreiben - und alle
  // anderen sähen „Sarah lädt dich ein", obwohl Sarah nichts getan hat.
  e.record.set("hostName", String(kind.getString("name") || ""));
  e.record.set("status", "einladung");
  e.record.set("startMs", 0);
  e.record.set("endeMs", 0);
  e.record.set("dauerMin", L.MATCH_DAUER_MIN);
  e.record.set("createdMs", Date.now());
  e.next();
}, "tt_matches");

// --- Ändern: nur erlaubte Übergänge, Zeiten vom Server -----------------------
onRecordUpdateRequest((e) => {
  const L = require(`${__hooks}/tt_match_lib.pb.js`);
  let vonSuperuser = false;
  try {
    vonSuperuser = !!e.auth && e.auth.collection().name === "_superusers";
  } catch (_) {
    vonSuperuser = false;
  }
  if (vonSuperuser) {
    e.next();
    return;
  }

  // Der gespeicherte Stand - der Update ist noch nicht geschrieben. Lässt er
  // sich nicht lesen, wird ABGEWIESEN: lieber verweigern als ungeprüft ändern.
  const alt = e.app.findRecordById("tt_matches", e.record.id);
  const vorher = String(alt.getString("status") || "einladung");
  const nachher = String(e.record.getString("status") || "");

  if (nachher !== vorher) {
    const erlaubt = L.UEBERGAENGE[vorher] || [];
    if (erlaubt.indexOf(nachher) < 0) {
      throw new BadRequestError("Dieses Klassenmatch lässt sich so nicht ändern.");
    }
  }

  // ★★★ DIE ZEITEN SETZT DER SERVER, und zwar GENAU EINMAL: beim Übergang nach
  // `countdown`. Alle Geräte rechnen danach von derselben Zahl - ein Countdown,
  // den jedes für sich hochzählte, liefe je nach Netzweg um Sekunden
  // auseinander, und zwar zwischen Kindern, die nebeneinander sitzen.
  if (nachher === "countdown" && vorher === "einladung") {
    const dauerMin = alt.getFloat("dauerMin") > 0 ? alt.getFloat("dauerMin") : L.MATCH_DAUER_MIN;
    const start = Date.now() + L.COUNTDOWN_MS;
    e.record.set("startMs", start);
    e.record.set("endeMs", start + Math.round(dauerMin * 60 * 1000));
    e.record.set("dauerMin", dauerMin);
  } else {
    // In jedem anderen Fall bleiben die Zeiten, wie sie sind - ein Kind soll
    // sich weder mehr Zeit geben noch das Ende der anderen vorziehen können.
    e.record.set("startMs", alt.getFloat("startMs"));
    e.record.set("endeMs", alt.getFloat("endeMs"));
    e.record.set("dauerMin", alt.getFloat("dauerMin"));
  }
  // Identität und Anlegezeit gehören dem Server, immer.
  e.record.set("classCode", alt.getString("classCode"));
  e.record.set("hostUid", alt.getString("hostUid"));
  e.record.set("hostName", alt.getString("hostName"));
  e.record.set("createdMs", alt.getFloat("createdMs"));
  e.next();
}, "tt_matches");

// --- Stand-Zeilen: Name vom Server, Match muss es geben ----------------------
// Die Regeln dazu (`standVomServer`, `matchMussEsGeben`) samt Begründung stehen
// in `tt_match_lib.pb.js` - ein Handler sieht keine Funktion aus dieser Datei.
// ★ 02.10.2026: dazu „Ein Kind, ein Match" (`standSperre`) - wer NEU auf
// `dabei`/`schreibt` geht, darf in keinem anderen offenen Match stecken.
onRecordCreateRequest((e) => {
  const L = require(`${__hooks}/tt_match_lib.pb.js`);
  if (L.standVomServer(e)) return;
  L.matchMussEsGeben(e);
  L.standSperre(e, false);
  e.next();
}, "tt_match_stand");
onRecordUpdateRequest((e) => {
  const L = require(`${__hooks}/tt_match_lib.pb.js`);
  if (L.standVomServer(e)) return;
  L.standSperre(e, true);
  e.next();
}, "tt_match_stand");

// --- Aufräumen: jede Minute -------------------------------------------------
cronAdd("tt_match_aufraeumen", "* * * * *", () => {
  // ⚠️ [[reference_pocketbase_hook_scope]] - cronAdd sieht NICHTS aus dem
  // Datei-Kopf. Die Zahlen stehen darum hier noch einmal.
  /*
    ★★★ EINE MINUTE, NICHT MEHR ZEHN (15.09.2026) - und trotzdem nicht die
    dreissig Sekunden, die der CLIENT für sich selbst benutzt
    ({@link MATCH_EINLADUNG_FRIST_MS} in `klassenmatch.ts`): Dieser Cron tickt
    nur einmal je Minute (`"* * * * *"`), eine kleinere Zahl hier würde also
    nichts genauer treffen. Der eigentliche Weg ist die Gastgeberin oder der
    Gastgeber selbst - ihr Gerät sagt eine Einladung, der niemand gefolgt ist,
    schon nach 30 Sekunden ab (`useKlassenmatch`, Absatz (f)). Dieser Cron ist
    nur das NETZ für den Fall, dass die Seite inzwischen geschlossen wurde und
    niemand mehr da ist, der absagen könnte.
  */
  const EINLADUNG_FRIST = 60 * 1000;
  // Einladung, der schon Kinder gefolgt sind: erst nach zehn Minuten (s. unten).
  const EINLADUNG_MIT_KINDERN_FRIST = 10 * 60 * 1000;
  const AUFRAEUMEN_NACH = 60 * 60 * 1000;
  const jetzt = Date.now();
  const L = require(`${__hooks}/tt_match_lib.pb.js`);

  // 1) Einladungen, aus denen nichts geworden ist (nach spätestens einer Minute -
  //    das Netz unter dem Client, siehe oben).
  try {
    const alt = $app.findRecordsByFilter(
      "tt_matches",
      "status = 'einladung' && createdMs > 0 && createdMs < {:frist}",
      "",
      200,
      0,
      { frist: jetzt - EINLADUNG_FRIST },
    );
    for (const rec of alt) {
      /*
        ★★ 02.10.2026: Nur eine Einladung, der NIEMAND gefolgt ist, endet nach
        einer Minute - so sagt es dieser Absatz seit jeher, getan hat der Cron
        es für JEDE Einladung (auch mit fünf Kindern im Wartefenster). Seit die
        Gastgeberin vor dem Start auf Unentschiedene warten kann („Trotzdem
        starten?" - „Warten"), wäre das Match dabei verloren gegangen. Mit
        Mitspielenden gilt darum {@link EINLADUNG_MIT_KINDERN_FRIST}: nur noch
        das Netz für eine geschlossene Seite.
      */
      if (rec.getFloat("createdMs") > jetzt - EINLADUNG_MIT_KINDERN_FRIST) {
        let mitKindern = false;
        try {
          const staende = $app.findRecordsByFilter(
            "tt_match_stand",
            "matchId = {:m} && pupilUid != {:host}",
            "",
            200,
            0,
            { m: rec.id, host: rec.getString("hostUid") },
          );
          // ⚠️ Nur wer WARTET (`dabei`/`schreibt`) - nicht `L.nimmtTeil`: Das
          // zählt auch `fertig`, also ein Kind, das im Wartefenster „Doch
          // nicht" gedrückt hat. Dessen Einladung blieb sonst zehn Minuten
          // stehen, obwohl niemand mehr wartet (gemessen am Wegwerf-Server,
          // 02.10.2026). Dieselbe Regel wie `kannStarten` im Client.
          for (const s of staende) {
            const st = String(s.getString("status") || "");
            if (st === "dabei" || st === "schreibt") mitKindern = true;
          }
        } catch (err) {
          $app.logger().warn("[tt-match] Stände nicht lesbar", "id", rec.id, "error", String(err));
        }
        if (mitKindern) continue;
      }
      rec.set("status", "abgebrochen");
      try {
        $app.save(rec);
      } catch (err) {
        $app.logger().warn("[tt-match] Einladung nicht abbrechbar", "id", rec.id, "error", String(err));
      }
    }
  } catch (err) {
    $app.logger().warn("[tt-match] Einladungen nicht lesbar", "error", String(err));
  }

  // 2) Matches, deren Zeit um ist (das Netz - normalerweise war der Gastgeber
  //    schneller, siehe Dateikopf).
  try {
    const vorbei = $app.findRecordsByFilter(
      "tt_matches",
      "(status = 'countdown' || status = 'laeuft') && endeMs > 0 && endeMs < {:jetzt}",
      "",
      200,
      0,
      { jetzt: jetzt },
    );
    for (const rec of vorbei) {
      rec.set("status", "fertig");
      try {
        $app.save(rec);
      } catch (err) {
        $app.logger().warn("[tt-match] Match nicht schliessbar", "id", rec.id, "error", String(err));
      }
    }
  } catch (err) {
    $app.logger().warn("[tt-match] Laufende Matches nicht lesbar", "error", String(err));
  }

  // 3) Löschen, eine Stunde nach dem Ende (F10). ZUERST eine dauerhafte Zeile
  //    je Kind in `tt_match_verlauf` - seit 14.11.2026 NUR NOCH DIE TEILNAHME
  //    (Johannes: „wie viele Matches gespielt wurden ... und welcher Schüler
  //    wie viele Matches spielt, aber nicht, wer gewonnen hat"): Match,
  //    Klasse, Kind, Zeit, Zahl der Mitspielenden und ob das Kind bis zum
  //    Ende gespielt hat. Kein Platz, keine Zeichen, keine Fehler, kein Tempo,
  //    kein Hilfsmittel. Ohne jede Client-Regel (setup.mjs); die Lehrkraft
  //    sieht nur die Anzahl (`tt_match_anzahl_lib.pb.js`). Erst DANACH die
  //    Stand-Zeilen und das Match selbst löschen - sonst bliebe eine Zeile
  //    ohne ihr Match stehen, und niemand fände sie je wieder.
  try {
    const weg = $app.findRecordsByFilter(
      "tt_matches",
      "(status = 'fertig' || status = 'abgebrochen') && createdMs > 0 && createdMs < {:frist}",
      "",
      200,
      0,
      { frist: jetzt - AUFRAEUMEN_NACH },
    );
    const A = require(`${__hooks}/tt_match_anzahl_lib.pb.js`);
    for (const rec of weg) {
      try {
        const staende = $app.findRecordsByFilter(
          "tt_match_stand",
          "matchId = {:m}",
          "",
          200,
          0,
          { m: rec.id },
        );

        // ★★★ 02.10.2026: `eingeladen`/`abgelehnt` sind KEINE Teilnahme - sie
        // kommen nicht in den Verlauf (sonst stünde dort je Kind, bei dem nur
        // das Fenster aufging, eine Null-Zeile, und `anzahl` zählte es mit).
        // Gelöscht werden unten trotzdem ALLE Zeilen des Matches.
        const teilnehmer = staende.filter((s) => L.nimmtTeil(s));
        const startMs = rec.getFloat("startMs");
        const endeMs = rec.getFloat("endeMs");

        for (const s of teilnehmer) {
          try {
            // Die Spielstand-Zahlen werden NUR hier gelesen, um „durchgespielt"
            // zu entscheiden - gespeichert wird allein das Ergebnis.
            const updatedMs = s.getFloat("updatedMs");
            const bisWann = endeMs > 0 ? Math.min(updatedMs, endeMs) : updatedMs;
            const durchgespielt = A.istDurchgespielt({
              startMs: startMs,
              endeMs: endeMs,
              verstrichenMs: Math.max(0, bisWann - startMs),
              zeichen: s.getFloat("zeichen"),
            });
            const verlauf = new Record($app.findCollectionByNameOrId("tt_match_verlauf"));
            verlauf.set("matchId", rec.id);
            verlauf.set("classCode", rec.getString("classCode"));
            verlauf.set("pupilUid", s.getString("pupilUid"));
            verlauf.set("durchgespielt", durchgespielt);
            verlauf.set("anzahl", teilnehmer.length);
            verlauf.set("startMs", startMs);
            verlauf.set("endeMs", endeMs);
            verlauf.set("createdMs", jetzt);
            $app.save(verlauf);
          } catch (err) {
            // Eine Zeile, die sich nicht festhalten lässt, darf das Aufräumen
            // nicht aufhalten - sie ist Statistik, kein Spielstand.
            $app.logger().warn("[tt-match] Verlauf nicht schreibbar", "stand", s.id, "error", String(err));
          }
        }

        for (const s of staende) $app.delete(s);
        $app.delete(rec);
      } catch (err) {
        $app.logger().warn("[tt-match] Aufräumen fehlgeschlagen", "id", rec.id, "error", String(err));
      }
    }
  } catch (err) {
    $app.logger().warn("[tt-match] Alte Matches nicht lesbar", "error", String(err));
  }
});
