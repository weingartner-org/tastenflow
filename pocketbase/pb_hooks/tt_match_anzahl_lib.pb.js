/// <reference path="../pb_data/types.d.ts" />
//
// Klassenmatch-Anzahl für die Lehrkraft (E9, 19.09.2026)
// ==========================================================================
// Johannes, 18.09.2026: „Klassenmatch-Anzahl ja" - die Lehrkraft soll sehen,
// WIE OFT jedes Kind je Woche ein Klassenmatch gespielt hat: nur die Anzahl,
// „Übungszeiten (mit Klassenmatch-Anzahl, kein Ranking)". Das dreht die
// Entscheidung vom 11./14.09. (`tt_match.pb.js`-Dateikopf: „Es gibt keine
// Statistik; Lehrer wissen nicht, wer wie oft ein Match macht") NUR für
// diesen einen Punkt um - wer wie GUT ein Kind war (Platzierung, `apm`,
// `wert`, Name eines anderen Kindes) bleibt der Lehrkraft weiterhin
// unzugänglich. `tt_match_verlauf` selbst bekommt darum KEINE Regeländerung
// (setup.mjs: list/view/create/update/del bleiben `null`, für jeden Client,
// auch die Lehrkraft) - diese Route ist der einzige Weg heraus, und sie
// gibt nie mehr als eine Zahl je Kind und Woche preis.
//
// ★★★ NACHTRAG 21.09.2026 - „DURCHGESPIELT" STATT „TEILGENOMMEN"
// Johannes: „wer wie viele Klassenmatch BEENDET hat, also wirklich
// durchgespielt hat (abgebrochene zählen nicht)". Bis dahin zählte jede Zeile
// in `tt_match_verlauf` - und die schreibt der Aufräum-Cron auch für
// abgesagte Matches und für Kinder, die mittendrin ausgestiegen sind (gemessen
// am Live-Stand: 133 Zeilen, davon die meisten aus abgesagten Einladungen mit
// `startMs = 0` und `verstrichenMs` = einem Zeitstempel statt einer Dauer).
// Was zählt, entscheidet {@link istDurchgespielt} - EINE Regel für „Meine
// Klassen" UND den Wochenbericht des Admins (`admin_wochenbericht_lib.pb.js`
// holt sich sie hierher).
//
// ★★★★★ NACHTRAG 14.11.2026 - NUR NOCH DIE TEILNAHME
// Johannes: „Ich möchte schon wissen, wie viele Matches gespielt wurden, für
// die Statistik, und welcher Schüler wie viele Matches spielt, aber nicht, wer
// gewonnen hat." Seitdem trägt eine Zeile in `tt_match_verlauf` nur noch
// Match, Klasse, Kind, Zeit, Zahl der Mitspielenden und `durchgespielt` - kein
// Platz, keine Zeichen, keine Fehler, kein Tempo, kein Hilfsmittel. Die Regel
// {@link istDurchgespielt} rechnet darum der Aufräum-Cron in `tt_match.pb.js`
// EINMAL aus den Spielständen, BEVOR er sie löscht, und schreibt nur das
// Ergebnis. Gezählt wird hier nur noch `durchgespielt === true`.
//
// ── Vertrag ──────────────────────────────────────────────────────────────
// GET /api/tt/klassenmatch-anzahl?klasse=<code>
//   200 { kinder: { [pupilUid]: { [wochenKey]: anzahl } } }
//   400 kein/leerer Klassencode
//   401 keine angemeldete Lehrkraft
//   403 die Klasse gehört einer anderen Lehrkraft (oder es gibt sie nicht -
//       beides klingt absichtlich gleich, siehe `verschiebe()` in
//       tt_klasse_lib.pb.js: ein Unterschied wäre eine Auskunft darüber,
//       welche Klassencodes es gibt)
//
// ── Berechtigung ─────────────────────────────────────────────────────────
// Eigentümer:in ODER Co-Lehrkraft - dieselbe Regel wie überall
// (`istStaff` in tt_klasse_lib.pb.js, `mayManage` in tt_coteacher_lib.pb.js).
// Hier noch einmal LOKAL nachgebaut, aus demselben Grund wie dort: ein
// `require` über Dateigrenzen gehört nie an den Kopf einer auto-geladenen
// Datei ([[reference_pocketbase_hook_scope]]), und diese kleine Prüfung
// lohnt keine gemeinsame dritte Datei.
//
// ── Wochenschlüssel ──────────────────────────────────────────────────────
// `isoWochenKey` aus tt_wochenziel_lib.pb.js (Montag 08:00 in der Zone der
// abrufenden Lehrkraft, ohne: Wien - Z1, 28.09.2026) - dieselbe
// Grenze wie überall im Wochenziel/Wochenbericht UND wie `uebungsperioden.ts`
// im Client (`WOCHENZIEL_GRENZE`) - nur so landet ein Match in derselben
// Woche, die die Lehrkraft in „Übungszeiten" sieht.
//
// Deploy: diese Datei + tt_match_anzahl.pb.js nach pb_hooks/ → „Update LMS
// (komplett)". Rein lesend, kein Schema-Zusatz, keine Regeländerung.
//
// Getestet OHNE Server in tests/tastenflow-klassenmatch-anzahl.test.ts -
// Muster wie tests/tastenflow-kind-verschieben.test.ts (nachgebaute App).

/** Eigentümer:in ODER Co-Lehrkraft der Klasse - wie `istStaff`/`mayManage`. */
function istEigeneKlasse(app, classCode, ownerId, teacherId) {
  if (!teacherId) return false;
  if (ownerId && teacherId === ownerId) return true;
  try {
    return !!app.findFirstRecordByFilter(
      "tt_class_teachers",
      "classCode = {:c} && teacherUid = {:t}",
      { c: classCode, t: teacherId },
    );
  } catch (_) {
    return false;
  }
}

/**
 * Wie viel einer Match-Dauer fehlen darf, damit ein Kind noch als „bis zum
 * Ende dabei" gilt. Gemessen an echten Matches: Wer bis zum Schluss schreibt,
 * hat `verstrichenMs` = 300000 oder knapp darunter (298121, 298413 - der
 * letzte Takt der Meldung kommt ein, zwei Sekunden vor der Endzeit). Wer
 * ausgestiegen ist, steht deutlich darunter.
 */
var DURCHGESPIELT_TOLERANZ_MS = 15000;

/**
 * ★ Hat dieses Kind dieses Klassenmatch WIRKLICH DURCHGESPIELT?
 * `z` sind die Werte EINES Kindes aus dem Spielstand, wie der Aufräum-Cron
 * (`tt_match.pb.js`) sie vor dem Löschen kennt (`startMs`, `endeMs`,
 * `verstrichenMs`, `zeichen`). Gespeichert wird nur das Ergebnis
 * (`tt_match_verlauf.durchgespielt`), nie die Zahlen selbst.
 * Durchgespielt ist ein Kind nur, wenn ALLES stimmt:
 *  - das Match hat wirklich begonnen (`startMs > 0`, `endeMs > startMs`) -
 *    eine abgesagte Einladung hat beides 0,
 *  - das Kind war bis zum Ende dabei (`verstrichenMs` mindestens die Dauer
 *    abzüglich {@link DURCHGESPIELT_TOLERANZ_MS}) - wer aussteigt, schreibt
 *    seine letzte Zeile früher,
 *  - das Kind hat etwas geschrieben (`zeichen > 0`) - nur dabeigesessen zählt
 *    nicht als gespielt.
 * Wer gewonnen hat, spielt keine Rolle - und wird seit 14.11.2026 nicht mehr gespeichert.
 */
function istDurchgespielt(z) {
  var zeile = z || {};
  var start = Number(zeile.startMs);
  var ende = Number(zeile.endeMs);
  var verstrichen = Number(zeile.verstrichenMs);
  var zeichen = Number(zeile.zeichen);
  if (!isFinite(start) || !isFinite(ende) || !isFinite(verstrichen) || !isFinite(zeichen)) return false;
  if (start <= 0 || ende <= start) return false;
  if (zeichen <= 0) return false;
  return verstrichen >= ende - start - DURCHGESPIELT_TOLERANZ_MS;
}

/** Zählt diese gespeicherte Zeile? Nur `durchgespielt` und ein gültiges Spielende. */
function zaehltMit(z) {
  var ende = Number(z.endeMs);
  return z.durchgespielt === true && isFinite(ende) && ende > 0;
}

/**
 * REINE Funktion: aus den `tt_match_verlauf`-Zeilen EINER Klasse (schon
 * gefiltert, aussen gelesen) die Anzahl DURCHGESPIELTER Klassenmatches je Kind
 * und Woche zählen. `zeilen` = [{ pupilUid, endeMs, durchgespielt }, …],
 * `isoWochenKey` = die Funktion aus tt_wochenziel_lib.pb.js
 * (mitgegeben, damit diese Funktion ohne PocketBase und ohne
 * Zeitzonen-Rechnung selbst prüfbar bleibt).
 *
 * ★ EINE ZEILE JE FERTIGEM MATCH UND KIND (nicht je Platzierung) - genau das
 * schreibt der Aufräum-Cron in `tt_match.pb.js`. Die Woche ist die des
 * SPIELENDES (`endeMs`), nicht die des Aufräumens eine Stunde später - ein
 * Match kurz vor Montag 08:00 zählt darum in die Woche, in der es gespielt
 * wurde.
 */
function zaehleKlassenmatches(zeilen, isoWochenKey) {
  var kinder = {};
  var liste = zeilen || [];
  for (var i = 0; i < liste.length; i++) {
    var z = liste[i] || {};
    var pupilUid = String(z.pupilUid || "").trim();
    if (!pupilUid || !zaehltMit(z)) continue;
    var woche = isoWochenKey(Number(z.endeMs));
    if (!kinder[pupilUid]) kinder[pupilUid] = {};
    kinder[pupilUid][woche] = (kinder[pupilUid][woche] || 0) + 1;
  }
  return kinder;
}

/**
 * REINE Funktion für den Wochenbericht des Admins: wie viele Klassenmatches
 * wurden im Zeitraum [vonMs, bisMs) DURCHGESPIELT? Ein Match zählt einmal,
 * sobald mindestens ein Kind es durchgespielt hat; `teilnahmen` sind die
 * durchgespielten Kind-Zeilen, `klassen` die Klassen, in denen gespielt wurde.
 * Die Zeit ist das Spielende (`endeMs`).
 */
function zaehleMatchesImZeitraum(zeilen, vonMs, bisMs) {
  var matches = {};
  var klassen = {};
  var teilnahmen = 0;
  var liste = zeilen || [];
  for (var i = 0; i < liste.length; i++) {
    var z = liste[i] || {};
    if (!zaehltMit(z)) continue;
    var ende = Number(z.endeMs);
    if (!(ende >= vonMs && ende < bisMs)) continue;
    teilnahmen++;
    matches[String(z.matchId || "") || "?" + i] = true;
    if (z.classCode) klassen[String(z.classCode)] = true;
  }
  return {
    matches: Object.keys(matches).length,
    teilnahmen: teilnahmen,
    klassen: Object.keys(klassen).length,
  };
}

/** Route-Handler `GET /api/tt/klassenmatch-anzahl?klasse=<code>`. */
function klassenmatchAnzahlHandler(e) {
  var auth = e.auth;
  var authColl = "";
  try {
    authColl = auth ? auth.collection().name : "";
  } catch (_) {
    authColl = "";
  }
  if (!auth || authColl !== "tt_teachers") {
    return e.json(401, { error: "Bitte als Lehrkraft anmelden." });
  }

  var query = {};
  try {
    query = e.requestInfo().query || {};
  } catch (_) {
    query = {};
  }
  var classCode = String(query.klasse || "").trim().toUpperCase();
  if (!classCode) return e.json(400, { error: "Kein Klassencode übermittelt." });

  var klasse = null;
  try {
    klasse = e.app.findFirstRecordByFilter("tt_classes", "code = {:c}", { c: classCode });
  } catch (_) {
    klasse = null;
  }
  // Nicht gefunden und nicht erlaubt klingen GLEICH - ein Unterschied wäre
  // eine Auskunft darüber, welche Klassencodes es gibt.
  var nichtIhre = "Diese Klasse gehört einer anderen Lehrkraft.";
  if (!klasse) return e.json(403, { error: nichtIhre });
  var ownerId = klasse.getString("teacherUid");
  if (!istEigeneKlasse(e.app, classCode, ownerId, auth.id)) {
    return e.json(403, { error: nichtIhre });
  }

  var zeilen = [];
  try {
    var recs = e.app.findRecordsByFilter(
      "tt_match_verlauf",
      "classCode = {:c}",
      "",
      0,
      0,
      { c: classCode },
    );
    zeilen = recs.map(function (r) {
      return {
        pupilUid: r.getString("pupilUid"),
        endeMs: r.getFloat("endeMs"),
        durchgespielt: r.getBool("durchgespielt"),
      };
    });
  } catch (err) {
    e.app
      .logger()
      .warn("[tt-match-anzahl] Verlauf nicht lesbar", "klasse", classCode, "error", String(err));
    zeilen = [];
  }

  var wz = require(`${__hooks}/tt_wochenziel_lib.pb.js`);
  // ★ Z1 (28.09.2026): die Woche in der Zone der LEHRKRAFT, die abruft
  // (`tt_teachers.zeitzone`, ohne: Wien) - ihr Browser legt die Schlüssel neben
  // seine eigenen Wochen („Übungszeiten", Montag 08:00 Ortszeit).
  var zone = require(`${__hooks}/tt_zeitzone_lib.pb.js`).zeitzoneVon(auth);
  var kinder = zaehleKlassenmatches(zeilen, function (ms) {
    return wz.isoWochenKey(ms, zone);
  });
  return e.json(200, { kinder: kinder });
}

// Export nur im require()-Kontext; beim Auto-Laden als Hook gibt es kein
// `module` (Muster wie jede andere `*_lib.pb.js` im Haus).
if (typeof module !== "undefined") {
  module.exports = {
    istEigeneKlasse: istEigeneKlasse,
    istDurchgespielt: istDurchgespielt,
    zaehleKlassenmatches: zaehleKlassenmatches,
    zaehleMatchesImZeitraum: zaehleMatchesImZeitraum,
    klassenmatchAnzahlHandler: klassenmatchAnzahlHandler,
  };
}
