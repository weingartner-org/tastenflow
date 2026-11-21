/// <reference path="../pb_data/types.d.ts" />
//
// Klassenmatch - Konstanten und Regeln, die MEHRERE Handler brauchen (11.09.2026)
// ==============================================================================
// ★★★★★ WARUM EINE EIGENE DATEI: Ein PocketBase-Handler (`onRecordCreateRequest`,
// `onRecordUpdateRequest`, `routerAdd`, `cronAdd`) läuft in einem eigenen
// Gültigkeitsbereich und sieht NICHTS aus dem Kopf seiner Datei - keine
// Konstante, keine Funktion ([[reference_pocketbase_hook_scope]]). Gemessen am
// Live-Server am 11.09.2026, 17:51: `ReferenceError: MATCH_DAUER_MIN is not
// defined` beim ersten echten Klick auf „Klassenmatch". Jeder Handler holt sich
// diese Datei darum selbst: `const L = require(`${__hooks}/tt_match_lib.pb.js`)`.
// Innerhalb DIESER Datei dürfen sich die Funktionen gegenseitig sehen -
// `require` wertet sie als Ganzes aus.
//
// ⚠️ Der Name muss auf `.pb.js` enden, sonst kopiert der Deploy-Glob sie nicht.
// ⚠️ `module` gibt es nur beim `require`; beim Auto-Laden als Hook ist es
//    undefined - darum der Guard ganz unten.

/** Dauer eines Matches in Minuten (Johannes: „Das Klassenmatch geht immer 5 min"). */
const MATCH_DAUER_MIN = 5;
/** Countdown vor dem Start - der Server setzt damit die Zeiten. */
const COUNTDOWN_MS = 10 * 1000;

/** Erlaubte Übergänge - alles andere wird abgewiesen. */
const UEBERGAENGE = {
  einladung: ["countdown", "abgebrochen"],
  countdown: ["laeuft", "fertig", "abgebrochen"],
  laeuft: ["fertig", "abgebrochen"],
  fertig: [],
  abgebrochen: [],
};

// --- Stand-Zeilen: die Zeit UND DER NAME gehören dem Server -----------------
// Die ZAHLEN darf das Kind schreiben: Die Regeln in `setup.mjs` lassen es nur
// SEINE Zeile in SEINER Klasse schreiben, und der Spielstand ist kein Ergebnis
// - er wird nirgends gespeichert und nach einer Stunde gelöscht. Wer sich hier
// eine hohe Zahl einträgt, gewinnt ein Spiel, das niemand aufschreibt.
//
// ★★★ DER NAME IST DIE AUSNAHME (Befund des Prüfers, 11.09.2026). Er stand
// bis dahin frei im Rumpf - und er ist das ERSTE Feld dieser Plattform, das
// ein Kind schreibt und ANDERE Kinder zu sehen bekommen (Ranking, Wartefenster,
// Platzierungsliste, Alt + X). Frei geschrieben hiesse: Ein Kind kann in der
// Liste seiner Klasse unter dem Namen eines anderen stehen oder dort etwas
// hinschreiben, was kein Kind über sich lesen soll
// ([[feedback_nie_gegen_das_kind]]) - und beides sähe die ganze Klasse.
// Darum kommt er aus dem Konto-Datensatz, genau wie `hostName` beim Match und
// genau wie `name` in `tt_pupils_field_guard.pb.js`.
function standVomServer(e) {
  let kind = null;
  try {
    const auth = e.auth;
    if (auth && auth.collection().name === "_superusers") {
      e.next();
      return true;
    }
    if (auth && auth.collection().name === "tt_pupils") kind = auth;
  } catch (_) {
    kind = null;
  }
  e.record.set("updatedMs", Date.now());
  // Ohne Kind-Anmeldung kommt hier ohnehin niemand durch (die Regeln), aber
  // fail-closed ist billiger als eine Annahme: kein Konto, kein Name.
  e.record.set("name", kind ? String(kind.getString("name") || "") : "");
  return false;
}

// ★★★ ZU JEDER STAND-ZEILE MUSS ES DAS MATCH GEBEN (Befund des Prüfers,
// 11.09.2026; Entscheidung Johannes/Fable am selben Tag).
//
// Die createRule prüft `pupilUid` und `classCode`, aber nicht `matchId`. Ein
// Kind konnte darum Zeilen zu frei erfundenen Match-Kennungen anlegen: sichtbar
// für niemanden (gelesen wird immer nach `matchId` gefiltert), aber auch vom
// Cron nie wieder gelöscht - der räumt Stand-Zeilen ausschliesslich über IHR
// Match ab. Der eindeutige Index (`matchId`, `pupilUid`) begrenzt eine Zeile je
// Kennung, nicht die Zahl der Kennungen. Das ist reines Wachstum in einer
// Datenbank, die niemand mehr aufräumen kann.
//
// ⚠️ DER PREIS: eine Abfrage je ANLEGEN. Das ist der richtige Handel - angelegt
// wird eine Zeile einmal je Kind und Match (danach wird sie nur noch
// fortgeschrieben, und der Update-Haken fragt nichts). Bei 30 Kindern sind das
// 30 Abfragen für ein ganzes Fünf-Minuten-Spiel.
//
// ⚠️ Und hier gilt FAIL-CLOSED, anders als bei der Klasse weiter oben: Dort
// nähme ein Lesefehler einem Kind das Spiel weg. Hier ist eine Zeile ohne ihr
// Match ohnehin wertlos - sie zeigt niemandem etwas an und bleibt für immer
// liegen. Im Zweifel also abweisen; das Kind versucht es im nächsten Takt
// wieder.
function matchMussEsGeben(e) {
  let kind = null;
  try {
    const auth = e.auth;
    if (auth && auth.collection().name === "tt_pupils") kind = auth;
  } catch (_) {
    kind = null;
  }
  if (!kind) return; // ohne Kind kommt hier niemand durch (createRule)

  const matchId = String(e.record.getString("matchId") || "").trim();
  if (!matchId) throw new BadRequestError("Zu dieser Zeile gibt es kein Klassenmatch.");

  let match = null;
  try {
    match = e.app.findRecordById("tt_matches", matchId);
  } catch (err) {
    match = null;
  }
  if (!match) throw new BadRequestError("Dieses Klassenmatch gibt es nicht (mehr).");

  // Das Match muss zur Klasse DIESES Kindes gehören - sonst schriebe ein Kind
  // in ein Spiel einer fremden Klasse hinein.
  const meine = String(kind.getString("classCode") || "");
  if (String(match.getString("classCode") || "") !== meine) {
    throw new BadRequestError("Dieses Klassenmatch gehört zu einer anderen Klasse.");
  }

  // Und es muss noch offen sein: In ein fertiges oder abgesagtes Match tritt
  // niemand mehr ein.
  const status = String(match.getString("status") || "");
  if (status === "fertig" || status === "abgebrochen") {
    throw new BadRequestError("Dieses Klassenmatch ist schon vorbei.");
  }
}

// --- EIN KIND, EIN MATCH (02.10.2026) ---------------------------------------
// Klasse CSS6, 02.10.2026, 10:18-10:19: Matti legte zwei Matches im Abstand von
// 13 Sekunden an, Stephan, Arne und Matti steckten in zwei Matches zugleich.
// Johannes: mehrere Matches je Klasse bleiben erlaubt (grosse Klassen) - aber
// EIN Kind steckt in höchstens EINEM offenen Match, als Gastgeber oder mit
// einer Zeile auf `dabei`/`schreibt`.
//
// ★★★ Der Client prüft dasselbe (`useKlassenmatch`), aber er weiss es nur,
// solange `meinMatchId` steht - nach einem Neuladen nicht mehr. Das NETZ ist
// darum hier. Die Sätze stehen wortgleich in `lib/typing/klassenmatch.ts`
// (`MATCH_SPERRE_*`, ein Wächter vergleicht) und sind in
// `serverMeldungen.ts` übersetzt.
//
// ⚠️ FAIL-OPEN bei einem Lesefehler (wie bei `klassenmatchAus`): Eine
// kaputte Abfrage darf einem Kind nicht das Spiel nehmen. Eine leere Liste ist
// kein Lesefehler - `findRecordsByFilter` meldet dann einfach nichts.
const SPERRE_GASTGEBER =
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.";
const SPERRE_DABEI =
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.";

/** Offen = Einladung, oder Countdown/Lauf, dessen Ende noch nicht vorbei ist. */
function offenAmServer(match, jetzt) {
  const status = String(match.getString("status") || "");
  if (status === "einladung") return true;
  if (status !== "countdown" && status !== "laeuft") return false;
  const ende = match.getFloat("endeMs");
  return !(ende > 0) || ende > jetzt;
}

// Leer heisst „frei", sonst der Satz, mit dem abgewiesen wird.
// `ausserMatchId`: das Match, um das es gerade geht (beim Beitreten).
function einKindEinMatch(app, kindId, classCode, ausserMatchId) {
  const jetzt = Date.now();
  // 1) Gastgeber eines anderen offenen Matches?
  let gehostet = [];
  try {
    gehostet = app.findRecordsByFilter(
      "tt_matches",
      "classCode = {:c} && hostUid = {:k} && (status = 'einladung' || status = 'countdown' || status = 'laeuft')",
      "",
      50,
      0,
      { c: classCode, k: kindId },
    );
  } catch (err) {
    gehostet = [];
  }
  for (const m of gehostet) {
    if (m.id === ausserMatchId || !offenAmServer(m, jetzt)) continue;
    // Wer sein eigenes Match mittendrin verlassen hat (eigene Zeile `fertig`,
    // `mittendrinVerlassen` im Client), ist frei - die anderen spielen weiter.
    let eigene = null;
    try {
      eigene = app.findFirstRecordByFilter(
        "tt_match_stand",
        "matchId = {:m} && pupilUid = {:k}",
        { m: m.id, k: kindId },
      );
    } catch (err) {
      eigene = null;
    }
    if (eigene && String(eigene.getString("status") || "") === "fertig") continue;
    return SPERRE_GASTGEBER;
  }
  // 2) In einem anderen offenen Match dabei?
  let zeilen = [];
  try {
    zeilen = app.findRecordsByFilter(
      "tt_match_stand",
      "classCode = {:c} && pupilUid = {:k} && (status = 'dabei' || status = 'schreibt')",
      "",
      50,
      0,
      { c: classCode, k: kindId },
    );
  } catch (err) {
    zeilen = [];
  }
  for (const z of zeilen) {
    const mid = String(z.getString("matchId") || "");
    if (!mid || mid === ausserMatchId) continue;
    let m = null;
    try {
      m = app.findRecordById("tt_matches", mid);
    } catch (err) {
      m = null;
    }
    if (m && offenAmServer(m, jetzt)) return SPERRE_DABEI;
  }
  return "";
}

// Eine Stand-Zeile, die NEU auf `dabei`/`schreibt` geht, prüft die Sperre.
// `eingeladen` und `abgelehnt` sind keine Teilnahme und gehen immer durch;
// das Fortschreiben derselben Teilnahme (alle drei Sekunden `schreibt`) kostet
// keine einzige Abfrage.
function standSperre(e, alsAenderung) {
  let kind = null;
  try {
    const auth = e.auth;
    if (auth && auth.collection().name === "tt_pupils") kind = auth;
  } catch (_) {
    kind = null;
  }
  if (!kind) return;
  const neu = String(e.record.getString("status") || "");
  if (neu !== "dabei" && neu !== "schreibt") return;
  if (alsAenderung) {
    let vorher = "";
    try {
      vorher = String(e.record.original().getString("status") || "");
    } catch (_) {
      try {
        vorher = String(e.app.findRecordById("tt_match_stand", e.record.id).getString("status") || "");
      } catch (err) {
        vorher = "";
      }
    }
    if (vorher === "dabei" || vorher === "schreibt") return;
  }
  const satz = einKindEinMatch(
    e.app,
    kind.id,
    String(kind.getString("classCode") || ""),
    String(e.record.getString("matchId") || ""),
  );
  if (satz) throw new BadRequestError(satz);
}

// Nimmt diese Stand-Zeile am Match teil? `eingeladen`/`abgelehnt` nicht -
// sie dürfen NIRGENDS als Teilnahme zählen (Verlauf, Anzahl je Kind).
function nimmtTeil(stand) {
  const status = String(stand.getString("status") || "");
  return status !== "eingeladen" && status !== "abgelehnt";
}


if (typeof module !== "undefined") {
  module.exports = {
    MATCH_DAUER_MIN: MATCH_DAUER_MIN,
    COUNTDOWN_MS: COUNTDOWN_MS,
    UEBERGAENGE: UEBERGAENGE,
    standVomServer: standVomServer,
    matchMussEsGeben: matchMussEsGeben,
    SPERRE_GASTGEBER: SPERRE_GASTGEBER,
    SPERRE_DABEI: SPERRE_DABEI,
    einKindEinMatch: einKindEinMatch,
    standSperre: standSperre,
    nimmtTeil: nimmtTeil,
  };
}
