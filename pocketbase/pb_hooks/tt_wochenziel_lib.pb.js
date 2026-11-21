/// <reference path="../pb_data/types.d.ts" />
//
// Wochenziel NEU - Montag 08:00 WIEN, nachgerechnet AM SERVER (W2, 18.09.2026)
// ==========================================================================
// ★ Z1 (28.09.2026): seit heute Montag 08:00 in der ZONE DES KONTOS, ohne
// Zone weiter Wien - siehe Abschnitt „Z1" gleich unter `wienOffsetMs`.
// Der Server läuft in UTC — `Date.now()` und `new Date(...)` kennen dort keine
// andere Zeitzone. Das clientseitige Wochenziel
// (`src/lib/typing/wochenziel.ts`, `WOCHENZIEL_GRENZE` = Montag 08:00 LOKAL)
// rechnet dagegen mit der Zeitzone des GERÄTS — für ein Kind oder eine
// Lehrkraft in Österreich ist das Europe/Vienna. Damit ein Wochen-Bericht
// oder ein serverseitiger Umzug (`tt_klasse_lib.pb.js`, kind-verschieben)
// dieselbe Woche trifft wie die App im Browser, bildet diese Datei die
// Wiener Wanduhr selbst nach — rein in UTC-Arithmetik, ohne Zeitzonen-
// Datenbank (die hat goja nicht).
//
// ── Die EU-Sommerzeit-Regel (fest, gilt für 2026/2027 ohne Ausnahme) ────────
// CEST (UTC+2) vom letzten Sonntag im März, 01:00 UTC, bis zum letzten
// Sonntag im Oktober, 01:00 UTC — davor/danach CET (UTC+1). Dieselbe Regel
// gilt EU-weit, nicht nur für Österreich; eine echte Zeitzonen-Datenbank
// bräuchte es nur für Jahre, in denen die EU die Regel selbst änderte — das
// ist bis mindestens 2027 nicht der Fall.
//
// ── Warum nicht einfach `wochenrhythmus.ts`/`goals.ts` wiederverwenden ─────
// Beide rechnen mit `new Date(...)` und dessen LOKALEN Gettern/Settern — am
// Server (UTC) käme dieselbe Rechnung auf UTC-Mitternacht/-Montag heraus,
// nicht auf Wien. Ein Test kann das im Node-Prozess mit
// `process.env.TZ = "Europe/Vienna"` verstecken (dann rechnet auch `new
// Date` lokal in Wien, siehe tests/tastenflow-wochenziel-server-zwilling.
// test.ts) — die echte PocketBase-Instanz auf dem Server tut das NICHT.
//
// ── Der Rückweg von der „naiven" Wanduhr zu echter UTC ─────────────────────
// `montagWanduhrMs` rechnet mit einem WERT, der — mit UTC-Gettern gelesen —
// die Wiener Kalenderfelder zeigt, selbst aber kein echter Zeitpunkt ist
// („naiv"). Für einen ECHTEN Zeitpunkt (wie ihn {@link wochenStartMs}
// zurückgibt) muss der WIENER VERSATZ dieses Montags abgezogen werden — nicht
// unbedingt derselbe wie der von `utcMs`, wenn zwischen beiden eine
// Umstellung liegt. Ein Montag 08:00 liegt aber IMMER weit (> 24 Std.) von
// jedem EU-Umstellzeitpunkt entfernt (die Umstellung selbst liegt sonntags
// zwischen 01:00 und 03:00 Wiener Zeit) — die Näherung mit dem Versatz von
// `utcMs` reicht darum, um die richtige Seite der Umstellung zu treffen; ein
// zweiter Blick auf den so gefundenen Montag macht die Antwort exakt.
//
// Getestet gegen die TypeScript-Fassung (dieselbe Woche, derselbe ISO-
// Schlüssel, für viele Zeitpunkte inkl. Montag 07:59/08:00/08:01, beide DST-
// Wechselwochen 2026/2027, Jahreswechsel-Woche) in
// tests/tastenflow-wochenziel-server-zwilling.test.ts — Muster wie
// tests/typing-eventpack.test.ts (die Ereignis-Packung, `tt_events_pack_lib`).
//
// Export nur im require()-Kontext ([[reference_pocketbase_hook_scope]]) —
// beim Auto-Laden als Hook gibt es kein `module`. JEDER Handler, der das
// braucht, holt es sich per `require(`${__hooks}/tt_wochenziel_lib.pb.js`)`
// INNERHALB seines eigenen Rückrufs (siehe `tt_klasse_lib.pb.js`,
// `verschiebe()`) — nie am Kopf einer Datei, die PocketBase auto-lädt.

const STUNDE_MS = 3600000;
const TAG_MS = 86400000;

/** Der letzte Sonntag eines Monats, 01:00 UTC — der EU-Umstellzeitpunkt. */
function letzterSonntagUtcMs(jahr, monat0) {
  // monat0 ist 0-basiert wie bei Date.UTC; Tag 0 des Folgemonats ist der
  // letzte Tag DIESES Monats (dieselbe Technik wie anderswo im Haus).
  const letzterTag = new Date(Date.UTC(jahr, monat0 + 1, 0)).getUTCDate();
  const wochentagDesLetztenTages = new Date(Date.UTC(jahr, monat0, letzterTag)).getUTCDay();
  const tag = letzterTag - wochentagDesLetztenTages; // getUTCDay(): 0 = Sonntag
  return Date.UTC(jahr, monat0, tag, 1, 0, 0, 0);
}

/**
 * Der UTC-Versatz Wiens zu einem Zeitpunkt: 2 Std. Sommerzeit, 1 Std.
 * Winterzeit (EU-Regel, siehe Dateikopf).
 */
function wienOffsetMs(utcMs) {
  const jahr = new Date(utcMs).getUTCFullYear();
  const beginnSommerzeit = letzterSonntagUtcMs(jahr, 2); // März
  const endeSommerzeit = letzterSonntagUtcMs(jahr, 9); // Oktober
  return utcMs >= beginnSommerzeit && utcMs < endeSommerzeit ? 2 * STUNDE_MS : 1 * STUNDE_MS;
}

// ════════════════════════════════════════════════════════════════════════
// Z1 (28.09.2026): DIE WOCHENGRENZE IN DER ZEITZONE DES KONTOS
// ════════════════════════════════════════════════════════════════════════
// Die App rechnet Montag 08:00 in der Ortszeit des GERÄTS (`wochenStart` in
// `wochenrhythmus.ts` mit `new Date(...).setHours(...)`, die Grenze ist
// `WOCHENZIEL_GRENZE` in `wochenziel.ts`). Bis Z1 rechnete diese Datei immer
// WIEN - für eine Klasse in Mexiko-Stadt lag die Grenze am Server bei Montag
// 01:00 bzw. 00:00 Ortszeit statt 08:00: Minuten vom Montagmorgen landeten in
// der falschen Woche, Mail und App zeigten verschiedene Zahlen.
//
// Seit D2 kennt der Server die Zone jedes Kontos (`tt_pupils.zeitzone`,
// `tt_teachers.zeitzone`, IANA) und rechnet sie ohne `Intl` um
// (`tt_zeitzone_lib.pb.js`). Jede Funktion dieser Datei, die eine Woche,
// einen Tag oder ein Datum bestimmt, nimmt darum als LETZTES, freiwilliges
// Argument `zone`.
//
// ── Welche Zone wo gilt (die Regel: die Zone des Geräts, auf dem die App
//    dieselbe Zahl zeigt) ─────────────────────────────────────────────────
//  · Klassen-Wochenbericht (`tt_weekly_report.pb.js`): die Zone der LEHRKRAFT,
//    für die ganze Klasse. Die Mail ist das Gegenstück zu „Meine Klassen",
//    und das rechnet der Browser der Lehrkraft in SEINER Ortszeit - auch die
//    Wochen der Kinder. Eine Tabelle, eine Woche: „KW 39" hiesse sonst je
//    Zeile einen anderen Zeitraum.
//  · Klassenmatch-Zähler (`tt_match_anzahl_lib.pb.js`): die Zone der
//    Lehrkraft, die abruft - ihr Browser legt die Schlüssel neben seine
//    eigenen Wochen („Übungszeiten").
//  · Neues Wochenziel beim Verschieben (`tt_klasse_lib.pb.js`): die Zone des
//    KINDES - „ab 2026-W40" wird auf seinem Gerät gelesen und gezählt.
//
// ── Europa bleibt Byte für Byte ─────────────────────────────────────────────
// Keine Zone, „Europe/Vienna", jede UNBEKANNTE Zone und jede Zone mit genau
// Wiens Uhr (MEZ + EU-Sommerzeit: Berlin, Zürich, Rom, Paris …) gehen durch
// DENSELBEN Rechenweg wie vor Z1 ({@link istWienerUhr}) - nicht durch einen
// gleichwertigen, sondern durch denselben Code. Nachgewiesen über jeden
// Montag 2026-2028 in tests/tastenflow-wochengrenze-zone.test.ts.

/** Die Zonen-Bibliothek - erst beim ersten Bedarf geholt (Hook-Scope: nie am Dateikopf). */
var zonenLibWz = null;
function zonenLibFuerWoche() {
  if (!zonenLibWz) zonenLibWz = require(`${__hooks}/tt_zeitzone_lib.pb.js`);
  return zonenLibWz;
}

/**
 * Rechnet `zone` mit WIENS Uhr? - leer, „Europe/Vienna", unbekannt (dann gilt
 * Wien wie bisher) oder eine Zone mit genau Wiens Normalzeit und Regel.
 */
function istWienerUhr(zone) {
  if (!zone || zone === "Europe/Vienna") return true;
  var zz = zonenLibFuerWoche();
  var r = zz.zoneRegel(zone);
  if (!r) return true;
  var wien = zz.zoneRegel("Europe/Vienna");
  return r.std === wien.std && r.regel === wien.regel;
}

/** Der UTC-Versatz von `zone` zu einem echten Zeitpunkt - Wiener Uhr über {@link wienOffsetMs}. */
function versatzMs(utcMs, zone) {
  if (istWienerUhr(zone)) return wienOffsetMs(utcMs);
  return zonenLibFuerWoche().zonenVersatzMs(utcMs, zone);
}

/**
 * Montag 08:00 als NAIVER Wanduhr-Wert (siehe Dateikopf) der Woche, die
 * `wanduhrMs` enthält — dieselbe Grenze wie `WOCHENZIEL_GRENZE` in
 * `wochenziel.ts` (Montag = Wochentag 0, 08:00).
 */
function montagWanduhrMs(wanduhrMs) {
  const d = new Date(wanduhrMs);
  let kandidat = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 8, 0, 0, 0);
  const wochentag = new Date(kandidat).getUTCDay(); // 0 = So … 6 = Sa
  const zurueckZumMontag = (wochentag + 6) % 7; // Montag selbst = 0 Schritte
  kandidat -= zurueckZumMontag * TAG_MS;
  if (kandidat > wanduhrMs) kandidat -= 7 * TAG_MS;
  return kandidat;
}

/**
 * Montag 08:00 Wien der Ziel-Woche von `utcMs`, als ECHTER UTC-Zeitpunkt
 * („wann in Weltzeit war/ist das wirklich?") — das Server-Gegenstück zu
 * `wochenStart(utcMs, WOCHENZIEL_GRENZE)` in `wochenziel.ts`. Rückwirkend
 * wie voraus schauend gültig: Ein `utcMs` mitten in einer Ziel-Woche liefert
 * deren Montag, nicht den nächsten.
 */
function wochenStartMs(utcMs, zone) {
  if (istWienerUhr(zone)) {
    const naeherung = wienOffsetMs(utcMs);
    const montagNaiv = montagWanduhrMs(utcMs + naeherung);
    return montagNaiv - wienOffsetMs(montagNaiv - naeherung);
  }
  // Z1: Montag 08:00 in `zone` - der Versatz an `utcMs` ist exakt (er gilt
  // GENAU dort), der Rückweg über {@link echterZeitpunktAusNaiv}.
  return echterZeitpunktAusNaiv(montagWanduhrMs(utcMs + versatzMs(utcMs, zone)), zone);
}

/** „2026-W39" aus einem NAIVEN Wanduhr-Zeitpunkt — Donnerstag-Regel wie `isoWeekKey` in `goals.ts`, nur mit UTC- statt lokalen Gettern/Settern. */
function isoWochenKeyAusNaiv(naivMs) {
  const d = new Date(naivMs);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const jahresanfang = Date.UTC(d.getUTCFullYear(), 0, 4);
  const kw =
    1 +
    Math.round(
      ((d.getTime() - jahresanfang) / TAG_MS -
        3 +
        ((new Date(jahresanfang).getUTCDay() + 6) % 7)) /
        7,
    );
  const kwText = kw < 10 ? "0" + kw : "" + kw;
  return d.getUTCFullYear() + "-W" + kwText;
}

/** Der ISO-Wochenschlüssel der Ziel-Woche von `utcMs` (Montag 08:00 in `zone`, ohne: Wien). */
function isoWochenKey(utcMs, zone) {
  const naiverMontag = montagWanduhrMs(utcMs + versatzMs(utcMs, zone));
  return isoWochenKeyAusNaiv(naiverMontag);
}

/**
 * Der ISO-Wochenschlüssel der FOLGENDEN Ziel-Woche nach `utcMs` — das
 * Server-Gegenstück zu `naechsteWocheKey` in `wochenziel.ts` (dort: „ab
 * kommender Woche", Johannes' Regel für jede Zieländerung).
 */
function naechsteWocheKey(utcMs, zone) {
  const naiverMontag = montagWanduhrMs(utcMs + versatzMs(utcMs, zone));
  const d = new Date(naiverMontag);
  const naiveFolgewoche = Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate() + 7,
    8,
    0,
    0,
    0,
  );
  return isoWochenKeyAusNaiv(naiveFolgewoche);
}

// ════════════════════════════════════════════════════════════════════════
// W5: DER SERVER-ZWILLING DER GANZEN WOCHENZIEL-AUSWERTUNG (Wochenbericht-Mail)
// ════════════════════════════════════════════════════════════════════════
// Bis hierher rechnete diese Datei nur den MONTAG selbst nach. Der
// Wochenbericht (`tt_weekly_report.pb.js`) braucht mehr: dieselben Zahlen wie
// `wochenzielVerlauf`/`kindWochenzielAusFeldern`/`erfuellungProzent` aus
// `src/lib/typing/wochenziel.ts` - sonst sagt die Mail etwas anderes, als die
// Lehrkraft in „Meine Klassen" sieht ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
//
// ── Warum kein zweiter Blick auf `wochenrhythmus.ts`/`goals.ts` nötig ist ──
// `buildDayPractice` (Client) sortiert jedes Ereignis über `uebungstagSchluessel`
// in einen ECHTEN Zeitpunkt ein - lokale Mitternacht, oder (nur am Montag) den
// Grenz-Zeitpunkt 08:00 selbst. Die anschliessende Wochensumme
// (`minutenDerWoche`) vergleicht diese Zeitpunkte dann nur noch stumpf gegen
// die Wochengrenzen - sie ruft `wochenStartFuerTag` NICHT auf. Der Zwilling
// muss darum nur „echter Zeitpunkt der Wiener Mitternacht/08:00-Grenze"
// nachbauen, nicht die ganze Rhythmus-Maschine aus `wochenrhythmus.ts`.
//
// ── Wiener Wanduhr ⇄ echter Zeitpunkt, EIN Verfahren für alles ─────────────
// `wienWanduhrFelder` liest die Wiener Kalenderfelder eines echten Zeitpunkts
// (dieselbe Näherung wie oben: Offset bei `utcMs` selbst - der ist nie mehr
// als zwei Stunden von der Wahrheit entfernt). `wienWanduhrZuEchtemMs` geht
// den Weg zurück: aus Wiener Kalenderfeldern den echten Zeitpunkt, mit
// GENAU DEMSELBEN Verfeinerungs-Trick wie `wochenStartMs` oben (den Offset ein
// zweites Mal an der SCHÄTZUNG selbst nachschlagen) - nur diesmal ohne einen
// von aussen mitgebrachten „Näherungs"-Offset, damit die Funktion für JEDEN
// Zielpunkt richtig bleibt, auch Monate von der aufrufenden Stelle entfernt
// (Wochen-für-Woche-Verschiebung über ein ganzes Schuljahr, siehe
// `wochenStartVerschobenMs`). Geprüft in
// tests/tastenflow-wochenziel-server-zwilling.test.ts gegen Tausende Punkte
// 2026-2028, DST-Wochen inklusive.

/** Ziel-Änderungs-Marker - keine Übung, siehe `account.ts` (`GOAL_CHANGE_LESSON`). */
var GOAL_CHANGE_LESSON = "__goal__";

/** Pause, ab der eine neue Sitzung beginnt - wie `goals.ts` (`SESSION_BREAK_MS`). */
var SESSION_BREAK_MS = 30 * 60000;

/** Stichwoche des Minuten-Umbaus - wie `wochenziel.ts` (`UMSTELLUNG_WOCHE`). */
var UMSTELLUNG_WOCHE = "2026-W38";

/**
 * Der echte Zeitpunkt zu einem NAIVEN Wanduhr-Wert (siehe Dateikopf) - ohne
 * einen von aussen mitgebrachten Näherungs-Offset. `naivMs` liegt nie mehr als
 * zwei Stunden vom echten Zeitpunkt entfernt (das ist der grösstmögliche
 * Wiener UTC-Versatz) - der Offset AN `naivMs` selbst ist darum schon eine
 * ausreichend gute erste Schätzung, um damit den ECHTEN Offset ein zweites Mal
 * nachzuschlagen und zu übernehmen.
 */
function echterZeitpunktAusNaiv(naivMs, zone) {
  if (istWienerUhr(zone)) {
    var schaetzung = wienOffsetMs(naivMs);
    return naivMs - wienOffsetMs(naivMs - schaetzung);
  }
  // ── Z1: jede andere Zone ─────────────────────────────────────────────────
  // Die Wiener Näherung oben lebt davon, dass Wiens Umstellung sonntags um
  // 02:00/03:00 liegt - weit weg von jeder Uhrzeit, die hier gerechnet wird.
  // Chile und Kuba stellen um MITTERNACHT um: Sonntag 00:00 gibt es dort am
  // Umstelltag nicht (Lücke) bzw. zweimal (doppelte Stunde) - genau die Zeit,
  // die `uebungstagSchluesselMs` für jeden Tag braucht. Darum hier die
  // vollständige Fallunterscheidung, mit derselben Antwort wie `new Date(j, m,
  // t, h, min)` im Browser (ECMAScript, „compatible"):
  //  · eindeutig: der eine Zeitpunkt,
  //  · doppelt: der FRÜHERE (vor der Rückstellung),
  //  · Lücke: mit dem Versatz VOR der Umstellung gerechnet - landet danach
  //    (aus „Sonntag 00:00" wird 01:00 Sommerzeit).
  // Der echte Zeitpunkt liegt höchstens 14 Std. von `naivMs` entfernt, und
  // zwei Umstellungen liegen Monate auseinander: Die Versätze einen Tag davor
  // und danach sind die einzigen, die in Frage kommen.
  var vorher = versatzMs(naivMs - TAG_MS, zone);
  var nachher = versatzMs(naivMs + TAG_MS, zone);
  var tVorher = naivMs - vorher;
  if (vorher === nachher) return tVorher;
  var tNachher = naivMs - nachher;
  var passtVorher = versatzMs(tVorher, zone) === vorher;
  var passtNachher = versatzMs(tNachher, zone) === nachher;
  if (passtVorher && passtNachher) return Math.min(tVorher, tNachher);
  if (passtNachher) return tNachher;
  return tVorher;
}

/**
 * Die Kalenderfelder eines echten Zeitpunkts (Montag = Wochentag 0) - in
 * `zone`, ohne (oder unbekannt): WIEN. Der Name stammt aus der Zeit vor Z1.
 */
function wienWanduhrFelder(utcMs, zone) {
  var naiv = utcMs + versatzMs(utcMs, zone);
  var d = new Date(naiv);
  return {
    jahr: d.getUTCFullYear(),
    monat0: d.getUTCMonth(),
    tag: d.getUTCDate(),
    stunde: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    wochentag: (d.getUTCDay() + 6) % 7,
  };
}

/** Kalenderfelder in `zone` (ohne: Wien) → echter Zeitpunkt (Kehrfunktion zu {@link wienWanduhrFelder}). */
function wienWanduhrZuEchtemMs(jahr, monat0, tag, stunde, minute, zone) {
  var naiv = Date.UTC(jahr, monat0, tag, stunde, minute, 0, 0);
  return echterZeitpunktAusNaiv(naiv, zone);
}

/**
 * Der Übungstag-Schlüssel eines Ereignis-Zeitpunkts - das Server-Gegenstück zu
 * `uebungstagSchluessel(ts, WOCHENZIEL_GRENZE)` in `wochenrhythmus.ts`: Wiener
 * Mitternacht des Tages, AUSSER am Montag ab 08:00 - dort der Grenz-Zeitpunkt
 * selbst (die zweite Hälfte des Montags gehört schon der NEUEN Woche).
 */
function uebungstagSchluesselMs(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  var mitternachtMs = wienWanduhrZuEchtemMs(f.jahr, f.monat0, f.tag, 0, 0, zone);
  if (f.wochentag !== 0) return mitternachtMs;
  var grenzeMs = wienWanduhrZuEchtemMs(f.jahr, f.monat0, f.tag, 8, 0, zone);
  return utcMs >= grenzeMs ? grenzeMs : mitternachtMs;
}

/**
 * Ein bekannter Montag-08:00-Wochenanfang um `wochenVersatz` Wochen verschoben
 * - das Server-Gegenstück zu `wocheVerschieben`+`setDate` in `wochenziel.ts`:
 * Kalendertage in der WIENER Wanduhr zählen (DST-sicher), nicht Millisekunden.
 */
function wochenStartVerschobenMs(startMs, wochenVersatz, zone) {
  var f = wienWanduhrFelder(startMs, zone);
  return wienWanduhrZuEchtemMs(f.jahr, f.monat0, f.tag + wochenVersatz * 7, f.stunde, f.minute, zone);
}

/** Stichtag der reinen Tippzeit - wie `goals.ts` (`ACTIVE_TIME_SINCE_MS`), 7. Juli 2026, 00:00 WIEN. */
var ACTIVE_TIME_SINCE_MS_UTC = wienWanduhrZuEchtemMs(2026, 6, 7, 0, 0);

/**
 * Z1: derselbe Stichtag in `zone` - `goals.ts` rechnet ihn mit `new Date(2026,
 * 6, 7)` in der Ortszeit des Geräts. Wiener Uhr: die Konstante oben, unverändert.
 */
function aktivSeitMs(zone) {
  return istWienerUhr(zone) ? ACTIVE_TIME_SINCE_MS_UTC : wienWanduhrZuEchtemMs(2026, 6, 7, 0, 0, zone);
}

/**
 * Übezeit je Übungstag (Objekt `{ "<echterZeitpunkt>": Minuten }`) - das
 * Server-Gegenstück zu `buildDayPractice` aus `goals.ts`. Bewusst ein PLAINES
 * Objekt statt einer `Map` (kein Präzedenzfall dafür in den bestehenden Hooks)
 * - die Schlüssel sind Zeitpunkte als Text, `minutenDerWoche`/`tageInWoche`
 * lesen sie über `Number(k)` zurück.
 */
function buildDayPractice(events, zone) {
  var out = {};
  var aktivSeit = aktivSeitMs(zone);
  function addMinuten(ms, minuten) {
    var k = String(uebungstagSchluesselMs(ms, zone));
    out[k] = (out[k] || 0) + minuten;
  }
  var ev = (events || [])
    .filter(function (e) {
      return e && e.ts > 0 && e.lesson !== GOAL_CHANGE_LESSON;
    })
    .slice()
    .sort(function (a, b) {
      return a.ts - b.ts;
    });
  var bucket = [];
  var startMs = 0;
  var endMs = 0;
  function flush() {
    if (bucket.length === 0) return;
    if (startMs < aktivSeit) {
      var span = (endMs - startMs) / 60000;
      addMinuten(startMs, span);
    } else {
      for (var i = 0; i < bucket.length; i++) {
        var e = bucket[i];
        var aktiv = Math.max(0, typeof e.activeMs === "number" ? e.activeMs : e.ms || 0);
        addMinuten(e.ts, aktiv / 60000);
      }
    }
    bucket = [];
  }
  for (var j = 0; j < ev.length; j++) {
    var e2 = ev[j];
    var lineStart = e2.ts - Math.max(0, e2.ms || 0);
    if (bucket.length === 0) {
      startMs = lineStart;
      endMs = e2.ts;
    } else if (e2.ts - endMs > SESSION_BREAK_MS) {
      flush();
      startMs = lineStart;
      endMs = e2.ts;
    } else {
      endMs = Math.max(endMs, e2.ts);
    }
    bucket.push(e2);
  }
  flush();
  return out;
}

/** Summe der Übezeit-Minuten einer Woche [`start`, `start`+7 Tage). */
function minutenDerWoche(dayPractice, start, zone) {
  var ende = wochenStartVerschobenMs(start, 1, zone);
  var summe = 0;
  for (var k in dayPractice) {
    if (!Object.prototype.hasOwnProperty.call(dayPractice, k)) continue;
    var tag = Number(k);
    if (tag >= start && tag < ende) summe += dayPractice[k];
  }
  return summe;
}

/** Anzahl der Übungstage einer Woche [`start`, `start`+7 Tage). */
function tageInWoche(dayPractice, start, zone) {
  var ende = wochenStartVerschobenMs(start, 1, zone);
  var n = 0;
  for (var k in dayPractice) {
    if (!Object.prototype.hasOwnProperty.call(dayPractice, k)) continue;
    var tag = Number(k);
    if (tag >= start && tag < ende) n++;
  }
  return n;
}

/** Alle Wochenanfänge (Montag 08:00 in `zone`, ohne: Wien) von der Woche um `vonMs` bis (inklusive) der um `bisMs`. */
function wochenAnfaengeZwischen(vonMs, bisMs, zone) {
  var out = [];
  var ende = wochenStartMs(bisMs, zone);
  var start = wochenStartMs(vonMs, zone);
  for (var i = 0; i < 100000 && start <= ende; i++) {
    out.push(start);
    start = wochenStartVerschobenMs(start, 1, zone);
  }
  return out;
}

/** Gültiger Zielabschnitt? - wie `istGueltigerZielAbschnitt` in `wochenziel.ts`. */
function istGueltigerZielAbschnitt(x) {
  if (!x || typeof x !== "object") return false;
  return (
    typeof x.ab === "string" &&
    /^\d{4}-W\d{2}$/.test(x.ab) &&
    typeof x.minuten === "number" &&
    isFinite(x.minuten) &&
    x.minuten >= 0
  );
}

/**
 * Das Wochenziel eines Kindes aus seinen Rohfeldern - der Server-Zwilling zu
 * `kindWochenzielAusFeldern` in `wochenziel.ts` (GENAU dieselbe verlustfreie
 * Lazy-Umrechnung `goalMinutes × goalUnits` ab {@link UMSTELLUNG_WOCHE}).
 *
 * `p` sind die schon entpackten Felder - JSON-Felder (`wochenzielVerlauf`,
 * `goalWeeks`, `goalExcusedWeeks`) müssen VOR dem Aufruf über die
 * String()→JSON.parse-Brücke gelesen sein (Hook-Scope-Fallstrick, siehe
 * Dateikopf von `tt_weekly_report.pb.js`) - diese Funktion selbst fasst kein
 * PocketBase-Feld an.
 */
function kindWochenziel(p) {
  p = p || {};
  var verlauf = [];
  if (Array.isArray(p.wochenzielVerlauf) && p.wochenzielVerlauf.length > 0) {
    verlauf = p.wochenzielVerlauf
      .filter(istGueltigerZielAbschnitt)
      .map(function (a) {
        return { ab: a.ab, minuten: Math.round(a.minuten) };
      })
      .sort(function (a, b) {
        return a.ab < b.ab ? -1 : a.ab > b.ab ? 1 : 0;
      });
  }
  if (verlauf.length === 0) {
    var goalMinutes = p.goalMinutes || 0;
    var goalUnits = p.goalUnits || 0;
    if (goalMinutes > 0 && goalUnits > 0) {
      verlauf = [{ ab: UMSTELLUNG_WOCHE, minuten: goalMinutes * goalUnits }];
    }
  }
  return {
    verlauf: verlauf,
    wochen: Array.isArray(p.goalWeeks) ? p.goalWeeks : [],
    nachholen: !!p.goalCatchUp,
    erlasseneWochen: Array.isArray(p.goalExcusedWeeks) ? p.goalExcusedWeeks : [],
    zurueckgesetztAb: p.goalResetWeek,
  };
}

/** Das Minuten-Ziel, das in `wocheKey` gilt - wie `zielFuerWoche` in `wochenziel.ts`. */
function zielFuerWoche(verlauf, wocheKey) {
  var bester = null;
  for (var i = 0; i < verlauf.length; i++) {
    var a = verlauf[i];
    if (a.ab <= wocheKey && (!bester || a.ab > bester.ab)) bester = a;
  }
  return bester ? bester.minuten : 0;
}

/** Ist `woche` eine gewählte Ziel-Woche? Leer = jede Woche - wie `istZielwoche`. */
function istZielwoche(woche, gewaehlteWochen) {
  return !gewaehlteWochen || gewaehlteWochen.length === 0 || gewaehlteWochen.indexOf(woche) !== -1;
}

/** Liegt `ts` in einem gesperrten Zeitraum? - wie `inGesperrterZeit` in `wochenziel.ts`. */
function inGesperrterZeit(ts, gesperrt) {
  if (!gesperrt) return false;
  for (var i = 0; i < gesperrt.length; i++) {
    var z = gesperrt[i];
    if (z && ts >= z.abMs && ts < z.bisMs) return true;
  }
  return false;
}

/** Überschuss füllt die älteste offene Ziel-Woche zuerst - wie `wendeNachholenAn` (mutiert in place). */
function wendeNachholenAn(wochen) {
  var offeneSchlange = [];
  for (var i = 0; i < wochen.length; i++) {
    var w = wochen[i];
    var ueberschuss = w.ziel > 0 ? Math.max(0, w.geuebt - w.ziel) : w.geuebt;
    while (ueberschuss > 0 && offeneSchlange.length > 0) {
      var alt = offeneSchlange[0];
      var fuellung = Math.min(ueberschuss, alt.offen);
      alt.erfuellt += fuellung;
      alt.offen -= fuellung;
      ueberschuss -= fuellung;
      if (alt.offen <= 0) offeneSchlange.shift();
    }
    if (w.ziel > 0 && w.offen > 0) offeneSchlange.push(w);
  }
}

/**
 * Der Wochen-Bericht EINES Kindes über [`vonMs`, `bisMs`] - der Server-
 * Zwilling zu `wochenzielVerlauf` in `wochenziel.ts`. `ziel` ist das Ergebnis
 * von {@link kindWochenziel}, `gesperrt` die Sperr-Zeiträume der Klasse
 * (`tt_classes.gesperrteZeiten`, schon per String()→JSON.parse gelesen).
 */
function wochenErgebnisse(events, ziel, vonMs, bisMs, gesperrt, zone) {
  gesperrt = gesperrt || [];
  var gefiltert = (events || []).filter(function (e) {
    return e && !inGesperrterZeit(e.ts, gesperrt);
  });
  var dayPractice = buildDayPractice(gefiltert, zone);
  var erlasseneWochen = {};
  (ziel.erlasseneWochen || []).forEach(function (w) {
    erlasseneWochen[w] = true;
  });
  var zurueckgesetztAb = ziel.zurueckgesetztAb;
  var anfaenge = wochenAnfaengeZwischen(vonMs, bisMs, zone);
  var ergebnisse = anfaenge.map(function (startMs) {
    var woche = isoWochenKey(startMs, zone);
    var geuebt = minutenDerWoche(dayPractice, startMs, zone);
    var erlassen = !!erlasseneWochen[woche];
    var vorReset = !!zurueckgesetztAb && woche < zurueckgesetztAb;
    var gewaehlt = istZielwoche(woche, ziel.wochen);
    var effektivesZiel = zielFuerWoche(ziel.verlauf, woche);
    var zielwoche = gewaehlt && !vorReset && !erlassen && effektivesZiel > 0;
    var zielMin = zielwoche ? effektivesZiel : 0;
    var erfuellt = Math.min(geuebt, zielMin);
    var offen = Math.max(0, zielMin - erfuellt);
    return {
      woche: woche,
      startMs: startMs,
      ziel: zielMin,
      geuebt: geuebt,
      erfuellt: erfuellt,
      offen: offen,
      erlassen: erlassen,
      zielwoche: zielwoche,
    };
  });
  if (ziel.nachholen) wendeNachholenAn(ergebnisse);
  return ergebnisse;
}

/** Erfüllung in Prozent (Anteil 0..1, unverrundet) - wie `erfuellungProzent` in `wochenziel.ts`. */
function erfuellungProzent(wochen, vonWoche, bisWoche) {
  var soll = 0;
  var erf = 0;
  for (var i = 0; i < wochen.length; i++) {
    var w = wochen[i];
    if (vonWoche && w.woche < vonWoche) continue;
    if (bisWoche && w.woche > bisWoche) continue;
    if (w.ziel <= 0) continue;
    soll += w.ziel;
    erf += w.erfuellt;
  }
  return soll > 0 ? erf / soll : null;
}

/** ISO-Wochenschlüssel → Montag 08:00 in `zone`, ohne: Wien (echter Zeitpunkt) - wie `wochenStartFuerSchluessel`. */
function wochenStartFuerSchluessel(key, zone) {
  var m = /^(\d{4})-W(\d{2})$/.exec(String(key || ""));
  if (!m) return undefined;
  var jahr = Number(m[1]);
  var woche = Number(m[2]);
  var jan4Wochentag = (new Date(Date.UTC(jahr, 0, 4)).getUTCDay() + 6) % 7; // Mo=0
  var tag = 4 - jan4Wochentag + (woche - 1) * 7;
  return wienWanduhrZuEchtemMs(jahr, 0, tag, 8, 0, zone);
}

/**
 * Der VOLLE Wochen-Bericht eines Kindes, vom ersten Abschnitt seines
 * Zielverlaufs bis einschliesslich der laufenden Woche um `jetztMs` - wie
 * `wochenzielGeschichte` in `wochenziel.ts`. `[]` bei leerem Verlauf.
 */
function wochenGeschichte(events, ziel, jetztMs, gesperrt, mindestens, zone) {
  if (!ziel || !ziel.verlauf || ziel.verlauf.length === 0) return [];
  var abschnittsMs = [];
  for (var i = 0; i < ziel.verlauf.length; i++) {
    var ms = wochenStartFuerSchluessel(ziel.verlauf[i].ab, zone);
    if (typeof ms === "number") abschnittsMs.push(ms);
  }
  var laufendeWoche = wochenStartMs(jetztMs, zone);
  var von = abschnittsMs.length > 0 ? Math.min.apply(null, abschnittsMs) : laufendeWoche;
  var bis = laufendeWoche;
  if (typeof mindestens === "number") {
    von = Math.min(von, mindestens);
    bis = Math.max(bis, mindestens);
  }
  return wochenErgebnisse(events, ziel, von, bis, gesperrt, zone);
}

/**
 * Das Schuljahr (wie `schuljahrVon` in `jahreskarte.ts`), das `jetztMs`
 * enthält - der Erste eines Monats, 00:00 Wien, liegt nie in der Stunde einer
 * EU-Umstellung (die liegt immer an einem Sonntag Ende März/Oktober, 02:00/
 * 03:00), darum mit `wienWanduhrZuEchtemMs` exakt.
 *
 * ★ D2 (28.09.2026): `beginnMonat` (1-12) ist der Beginn des Schuljahres der
 * Klasse (`tt_classes.settings.schuljahrBeginn`, `schuljahrBeginn.ts`). Ohne
 * gültige Angabe August wie bis D2 - Byte für Byte.
 */
function schuljahrGrenzenMs(jetztMs, beginnMonat, zone) {
  var f = wienWanduhrFelder(jetztMs, zone);
  var gueltig =
    typeof beginnMonat === "number" && Math.floor(beginnMonat) === beginnMonat &&
    beginnMonat >= 1 && beginnMonat <= 12;
  var SCHULJAHR_START_MONAT = gueltig ? beginnMonat - 1 : 7; // Vorgabe August, wie jahreskarte.ts
  var jahr = f.monat0 >= SCHULJAHR_START_MONAT ? f.jahr : f.jahr - 1;
  var von = wienWanduhrZuEchtemMs(jahr, SCHULJAHR_START_MONAT, 1, 0, 0, zone);
  var bisEnde = wienWanduhrZuEchtemMs(jahr + 1, SCHULJAHR_START_MONAT, 1, 0, 0, zone);
  return { vonMs: von, bisMs: bisEnde - 1 };
}

/** Überlappte gesperrte Zeit (Klasse) mit [`vonMs`, `bisMs`) - Überlappungen selbst zusammengelegt. */
function ueberlappteGesperrteZeitMs(gesperrt, vonMs, bisMs) {
  var intervalle = [];
  for (var i = 0; i < (gesperrt || []).length; i++) {
    var z = gesperrt[i];
    if (!z || typeof z.abMs !== "number" || typeof z.bisMs !== "number") continue;
    var a = Math.max(z.abMs, vonMs);
    var b = Math.min(z.bisMs, bisMs);
    if (b > a) intervalle.push([a, b]);
  }
  intervalle.sort(function (x, y) {
    return x[0] - y[0];
  });
  var summe = 0;
  var offenA = null;
  var offenB = null;
  for (var j = 0; j < intervalle.length; j++) {
    var iv = intervalle[j];
    if (offenA === null) {
      offenA = iv[0];
      offenB = iv[1];
    } else if (iv[0] <= offenB) {
      offenB = Math.max(offenB, iv[1]);
    } else {
      summe += offenB - offenA;
      offenA = iv[0];
      offenB = iv[1];
    }
  }
  if (offenA !== null) summe += offenB - offenA;
  return summe;
}

// ── Wochenbericht-Mail: reine Text-/HTML-Bausteine (ohne $app, testbar) ────

/** Escaping für Text, der in HTML landet - wie überall im Haus. */
function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pad2Text(n) {
  return n < 10 ? "0" + n : "" + n;
}

/** „19.09." aus einem echten Zeitpunkt, Kalendertag in `zone` (ohne: WIEN). */
function fmtTagMonat(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return pad2Text(f.tag) + "." + pad2Text(f.monat0 + 1) + ".";
}

/** Die Kalenderwochen-Nummer aus einem ISO-Schlüssel „2026-W38" → 38. */
function wochenNummerAusSchluessel(key) {
  return Number(String(key).slice(-2));
}

/** „1 Stunde" / „1,5 Stunden" / „3 Stunden" aus einer Millisekunden-Dauer. */
function formatStunden(ms) {
  var stunden = Math.round((ms / 3600000) * 10) / 10;
  var ganz = Math.round(stunden);
  var text = Math.abs(stunden - ganz) < 1e-9 ? String(ganz) : String(stunden).replace(".", ",");
  return (Math.abs(stunden - 1) < 1e-9 ? text + " Stunde" : text + " Stunden");
}

/**
 * Die Wochenziel-Zelle einer Zeile: „45 von 60 Min." (+ „ ✓" bei erreicht),
 * „erlassen", „keine Zielwoche" oder „kein Ziel" - nie ein rotes Kreuz
 * (Johannes: nichts gegen ein Kind).
 */
function wochenzielZellenText(zeile) {
  if (!zeile.hatZiel) return "kein Ziel";
  if (zeile.erlassen) return "erlassen";
  if (!zeile.zielwoche) return "keine Zielwoche";
  var basis = Math.round(zeile.erfuelltMin) + " von " + Math.round(zeile.zielMin) + " Min.";
  return zeile.offenMin <= 0 ? basis + " ✓" : basis;
}

/** Die Schuljahr-Zelle: „87 %" oder „-" ohne eine einzige abgeschlossene Ziel-Woche. */
function schuljahrZellenText(anteil) {
  return anteil === null || anteil === undefined ? "-" : Math.round(anteil * 100) + " %";
}

/** Die Nachholen-Zelle: „15 Min. offen", sonst leer (kein Nachholen oder nichts offen). */
function nachholenZellenText(zeile) {
  var min = zeile.nachholenOffenMin;
  if (min === null || min === undefined || !(min > 0)) return "";
  return Math.round(min) + " Min. offen";
}

/**
 * Der fertige Wochenbericht - REINE Funktion (kein `$app`), darum ohne
 * PocketBase testbar UND für die Beispiel-Mail wiederverwendbar.
 *
 * `daten.zeilen[i]`: { name, geuebtMin, tage, treffsicherheit (Text|null),
 * stufe (Text|null), hatZiel, zielwoche, erlassen, zielMin, erfuelltMin,
 * offenMin, schuljahrAnteil (0..1|null), nachholenOffenMin (Min.|null) }.
 *
 * ★ EN9 (19.09.2026): `sprache` - "en" liefert dieselbe Mail englisch
 * ({@link berichtHtmlEn}, gleich darunter); alles andere (auch weggelassen)
 * die deutsche, Zeichen für Zeichen wie vor EN9. Die Sprache ist die der
 * LEHRKRAFT (`tt_teachers.bedienSprache`, siehe `tt_weekly_report.pb.js`).
 */
// ── D2 (28.09.2026): Anfang und Ende der Woche auf der Wanduhr der Lehrkraft ─
// `daten.ortVon`/`daten.ortBis` kommen aus `tt_zeitzone_lib.pb.js`
// (`ortsFelder`): Kalenderfelder in der Zeitzone der Lehrkraft, `lokal:
// false` = keine (bekannte) Zone, die Felder sind Wiener Zeit und die Mail
// sagt es dazu. FEHLEN sie (Aufrufer vor D2), steht der Satz genau wie vorher.
// ★ Z1 (28.09.2026): Seit Z1 wandert auch die GRENZE selbst - `daten.zeitzone`
// (die Zone der Lehrkraft) bestimmt Wochenende, KW und Datum; in Mexiko-Stadt
// steht darum „Montag, 8:00" wie in Wien. Ohne Zone Wien, Byte für Byte.

var WOCHENTAGE_DE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

/** „8:00" - Stunde ohne führende Null (wie bisher im deutschen Satz). */
function uhrDeOderEs(f) {
  return f.stunde + ":" + pad2Text(f.minute);
}

/** „8am", „12am", „7:30pm" - wie die englische Mail schon „8am" schrieb. */
function uhrEn(f) {
  var h = f.stunde % 12 === 0 ? 12 : f.stunde % 12;
  return h + (f.minute ? ":" + pad2Text(f.minute) : "") + (f.stunde < 12 ? "am" : "pm");
}

/** „8 h", „5 h 30" (Bauplan §9.1). */
function uhrFr(f) {
  return f.stunde + " h" + (f.minute ? " " + pad2Text(f.minute) : "");
}

/** Der Zusatz, wenn die Zeit NICHT die der Lehrkraft ist - in jeder Sprache. */
function zonenZusatz(f, sprache) {
  if (!f || f.lokal) return "";
  if (sprache === "en") return " (Central European Time)";
  if (sprache === "fr") return " (heure d'Europe centrale)";
  if (sprache === "es") return " (hora de Europa central)";
  if (sprache === "it") return " (ora dell'Europa centrale)";
  if (sprache === "pl") return " (czas środkowoeuropejski)";
  // ★ O-TR (02.10.2026): Glossar §2.11 - die Türkei hat ganzjährig UTC+3; der
  // Zusatz steht nur, wenn die Zeit NICHT die der Lehrkraft ist (Wiener Zeit).
  if (sprache === "tr") return " (Orta Avrupa saati)";
  // ★ O-CS (03.10.2026): Tschechien hat dieselbe Zone wie Wien - der Zusatz
  // steht nur, wenn der Server die Zone der Lehrkraft nicht kennt.
  if (sprache === "cs") return " (středoevropský čas)";
  return " (mitteleuropäische Zeit)";
}

function berichtHtml(daten, sprache) {
  // ★ O4 (30.10.2026): die neun - Aufbau in tt_mail_neun_lib.pb.js; die Rechnungen werden hereingereicht.
  if (["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"].indexOf(String(sprache || "")) >= 0) {
    return require(`${__hooks}/tt_mail_neun_lib.pb.js`).bericht(daten, sprache, {
      wochenStartVerschobenMs: wochenStartVerschobenMs,
      wienWanduhrFelder: wienWanduhrFelder,
    });
  }
  if (sprache === "en") return berichtHtmlEn(daten);
  // ★ E11c (26.09.2026): Französisch - {@link berichtHtmlFr}.
  if (sprache === "fr") return berichtHtmlFr(daten);
  // ★ ES-M (27.09.2026): Spanisch - {@link berichtHtmlEs}.
  if (sprache === "es") return berichtHtmlEs(daten);
  // ★ O-IT (02.10.2026): Italienisch - {@link berichtHtmlIt}.
  if (sprache === "it") return berichtHtmlIt(daten);
  // ★ O-PL (02.10.2026): Polnisch - {@link berichtHtmlPl}.
  if (sprache === "pl") return berichtHtmlPl(daten);
  // ★ O-TR (02.10.2026): Türkisch - {@link berichtHtmlTr}.
  if (sprache === "tr") return berichtHtmlTr(daten);
  // ★ O-CS (03.10.2026): Tschechisch - {@link berichtHtmlCs}.
  if (sprache === "cs") return berichtHtmlCs(daten);
  var klasse = daten.klasse;
  var wocheStartMsWert = daten.wocheStartMs;
  // Z1: die Woche in der Zone der Lehrkraft (`daten.zeitzone`, ohne: Wien).
  var zone = daten.zeitzone;
  var wocheEndeMsWert = wochenStartVerschobenMs(wocheStartMsWert, 1, zone);
  var wocheKey = isoWochenKey(wocheStartMsWert, zone);
  var zeilen = daten.zeilen || [];

  var subject = "Wochenbericht Tastenflow - " + klasse + " (KW " + wochenNummerAusSchluessel(wocheKey) + ")";

  var aktiv = 0;
  var minutenSumme = 0;
  var zielwochenGesamt = 0;
  var zielwochenErreicht = 0;
  var zeilenHtml = "";
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    var geuebtGerundet = Math.round(z.geuebtMin);
    if (geuebtGerundet > 0 || z.tage > 0) {
      aktiv++;
      minutenSumme += geuebtGerundet;
    }
    if (z.zielwoche) {
      zielwochenGesamt++;
      if (z.offenMin <= 0) zielwochenErreicht++;
    }
    zeilenHtml +=
      "<tr>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(z.name) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + geuebtGerundet + " Min.</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + (z.tage || 0) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.treffsicherheit || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.stufe || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(wochenzielZellenText(z)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(schuljahrZellenText(z.schuljahrAnteil)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(nachholenZellenText(z)) + "</td>" +
      "</tr>";
  }

  var v = daten.ortVon;
  var b = daten.ortBis;
  var intro =
    v && b
      ? "<p>Wochenbericht für Ihre Klasse <b>" + escHtml(klasse) + "</b>, Woche von " +
        WOCHENTAGE_DE[v.wochentag] + ", " + pad2Text(v.tag) + "." + pad2Text(v.monat0 + 1) + "., " +
        uhrDeOderEs(v) + " Uhr bis " +
        WOCHENTAGE_DE[b.wochentag] + ", " + pad2Text(b.tag) + "." + pad2Text(b.monat0 + 1) + "., " +
        uhrDeOderEs(b) + " Uhr" + zonenZusatz(v, "de") + ".</p>"
      : "<p>Wochenbericht für Ihre Klasse <b>" + escHtml(klasse) + "</b>, Woche von Montag, " +
        fmtTagMonat(wocheStartMsWert, zone) + ", 8:00 Uhr bis Montag, " + fmtTagMonat(wocheEndeMsWert, zone) + ", 8:00 Uhr.</p>";

  // ★ Einzahl/Mehrzahl (Abnahme 18.09.2026): „1 von 4 Kindern HAT es
  // erreicht", „1 Minute"; ohne ein einziges Kind mit Zielwoche fällt der
  // zweite Satz weg (sonst stünde da „0 von 0 Kindern …").
  var zusammenfassung =
    aktiv + " von " + zeilen.length + " Kindern " + (aktiv === 1 ? "hat" : "haben") +
    " geübt, zusammen " + minutenSumme + (minutenSumme === 1 ? " Minute." : " Minuten.");
  if (zielwochenGesamt > 0) {
    zusammenfassung +=
      " " + zielwochenErreicht + " von " + zielwochenGesamt + " Kindern mit Wochenziel " +
      (zielwochenErreicht === 1 ? "hat" : "haben") + " es erreicht.";
  }
  if (daten.gesperrtMs > 0) {
    zusammenfassung +=
      " In dieser Woche war " + formatStunden(daten.gesperrtMs) +
      " gesperrt - Übung darin zählt nicht fürs Wochenziel.";
  }

  var linkZeile = daten.klassenLink
    ? '<p><a href="' + escHtml(daten.klassenLink) + '">Zur Klasse ' + escHtml(klasse) + "</a></p>"
    : "";

  var html =
    intro +
    "<p>" + zusammenfassung + "</p>" +
    '<table style="border-collapse:collapse;font-size:14px">' +
    '<thead><tr style="text-align:left">' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Name</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Geübt</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Tage</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Treffsicherheit</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Stufe</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Wochenziel</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Schuljahr</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Nachholen</th>' +
    "</tr></thead><tbody>" + zeilenHtml + "</tbody></table>" +
    linkZeile +
    (daten.fussHtml || "");

  return { subject: subject, html: html };
}

// ── EN9 (19.09.2026): DIESELBE MAIL ENGLISCH ─────────────────────────────────
// Für Lehrkräfte mit `bedienSprache = "en"` (sie haben Tastenflow mit dem
// Probe-Schalter auf Englisch umgestellt). Gleicher Aufbau, gleiche Spalten,
// gleiche Zahlen - nur die Wörter nach dem Glossar (`GLOSSAR-ENGLISCH.md`):
// Kinder ⇒ *pupils*, Wochenziel ⇒ *weekly goal*, erlassen ⇒ *excused*,
// Nachholen ⇒ *catch up*, gesperrt ⇒ *paused* (nie *locked* - geübt wird ja
// weiter), Leistungsstufe ⇒ *difficulty level*, KW ⇒ *Week 38, w/c 14 Sept*
// (Briten kennen keine Wochennummern allein).
// ⚠️ Kein `Intl`/`toLocaleDateString`: goja hat keine Sprachdaten. Die
// Monatsnamen stehen darum hier, in der Form, die `Intl` mit `en-GB` in der
// App schreibt (`weekLabelEn` in `goals.ts`: „14 Sept", „14 Jun").

var MONATE_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
var MONATE_EN_KURZ = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
var WOCHENTAGE_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** „Monday 14 September" aus einem echten Zeitpunkt, WIENER Kalendertag (Glossar §1.2). */
function datumEn(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return WOCHENTAGE_EN[f.wochentag] + " " + f.tag + " " + MONATE_EN[f.monat0];
}

/** „14 Sept" - die Kurzform, wie die App sie schreibt. */
function kurzDatumEn(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return f.tag + " " + MONATE_EN_KURZ[f.monat0];
}

/** „1 hour" / „1.5 hours" / „3 hours". */
function formatStundenEn(ms) {
  var stunden = Math.round((ms / 3600000) * 10) / 10;
  var ganz = Math.round(stunden);
  var text = Math.abs(stunden - ganz) < 1e-9 ? String(ganz) : String(stunden);
  return Math.abs(stunden - 1) < 1e-9 ? text + " hour" : text + " hours";
}

/** Die Wochenziel-Zelle englisch: „45 of 60 min" (+ „ ✓"), „excused", „not a goal week", „no goal". */
function wochenzielZellenTextEn(zeile) {
  if (!zeile.hatZiel) return "no goal";
  if (zeile.erlassen) return "excused";
  if (!zeile.zielwoche) return "not a goal week";
  var basis = Math.round(zeile.erfuelltMin) + " of " + Math.round(zeile.zielMin) + " min";
  return zeile.offenMin <= 0 ? basis + " ✓" : basis;
}

/** Die Schuljahr-Zelle englisch: „87%" (ohne Leerzeichen, Glossar §1.2) oder „-". */
function schuljahrZellenTextEn(anteil) {
  return anteil === null || anteil === undefined ? "-" : Math.round(anteil * 100) + "%";
}

/** Die Nachholen-Zelle englisch: „15 min to catch up", sonst leer. */
function nachholenZellenTextEn(zeile) {
  var min = zeile.nachholenOffenMin;
  if (min === null || min === undefined || !(min > 0)) return "";
  return Math.round(min) + " min to catch up";
}

/** Der Wochenbericht englisch - dieselbe reine Funktion, derselbe Aufbau wie {@link berichtHtml}. */
function berichtHtmlEn(daten) {
  var klasse = daten.klasse;
  var wocheStartMsWert = daten.wocheStartMs;
  // Z1: die Woche in der Zone der Lehrkraft (`daten.zeitzone`, ohne: Wien).
  var zone = daten.zeitzone;
  var wocheEndeMsWert = wochenStartVerschobenMs(wocheStartMsWert, 1, zone);
  var wocheKey = isoWochenKey(wocheStartMsWert, zone);
  var zeilen = daten.zeilen || [];

  var subject =
    "Tastenflow weekly report - " + klasse +
    " (Week " + wochenNummerAusSchluessel(wocheKey) + ", w/c " + kurzDatumEn(wocheStartMsWert, zone) + ")";

  var aktiv = 0;
  var minutenSumme = 0;
  var zielwochenGesamt = 0;
  var zielwochenErreicht = 0;
  var zeilenHtml = "";
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    var geuebtGerundet = Math.round(z.geuebtMin);
    if (geuebtGerundet > 0 || z.tage > 0) {
      aktiv++;
      minutenSumme += geuebtGerundet;
    }
    if (z.zielwoche) {
      zielwochenGesamt++;
      if (z.offenMin <= 0) zielwochenErreicht++;
    }
    zeilenHtml +=
      "<tr>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(z.name) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + geuebtGerundet + " min</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + (z.tage || 0) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.treffsicherheit || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.stufe || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(wochenzielZellenTextEn(z)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(schuljahrZellenTextEn(z.schuljahrAnteil)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(nachholenZellenTextEn(z)) + "</td>" +
      "</tr>";
  }

  var v = daten.ortVon;
  var b = daten.ortBis;
  var intro =
    v && b
      ? "<p>Weekly report for your class <b>" + escHtml(klasse) + "</b>: the week from " +
        uhrEn(v) + " on " + WOCHENTAGE_EN[v.wochentag] + " " + v.tag + " " + MONATE_EN[v.monat0] +
        " to " + uhrEn(b) + " on " + WOCHENTAGE_EN[b.wochentag] + " " + b.tag + " " + MONATE_EN[b.monat0] +
        zonenZusatz(v, "en") + ".</p>"
      : "<p>Weekly report for your class <b>" + escHtml(klasse) + "</b>: the week from 8am on " +
        datumEn(wocheStartMsWert, zone) + " to 8am on " + datumEn(wocheEndeMsWert, zone) + ".</p>";

  // Einzahl/Mehrzahl wie im Deutschen: „1 of 1 pupil", „1 minute"; ohne ein
  // einziges Kind mit Zielwoche fällt der zweite Satz weg.
  var zusammenfassung =
    aktiv + " of " + zeilen.length + (zeilen.length === 1 ? " pupil" : " pupils") +
    " practised, " + minutenSumme + (minutenSumme === 1 ? " minute" : " minutes") + " in total.";
  if (zielwochenGesamt > 0) {
    zusammenfassung +=
      " " + zielwochenErreicht + " of " + zielwochenGesamt +
      (zielwochenGesamt === 1 ? " pupil" : " pupils") + " with a weekly goal reached it.";
  }
  if (daten.gesperrtMs > 0) {
    zusammenfassung +=
      " The weekly goal was paused for " + formatStundenEn(daten.gesperrtMs) +
      " this week - practice during the pause doesn't count towards the weekly goal.";
  }

  var linkZeile = daten.klassenLink
    ? '<p><a href="' + escHtml(daten.klassenLink) + '">Go to class ' + escHtml(klasse) + "</a></p>"
    : "";

  // ★ `lang="en"` um die ganze Mail: Das Mailprogramm einer Lehrkraft kann
  // deutsch eingestellt sein - eine Sprachausgabe läse die Sätze sonst mit
  // deutscher Stimme.
  var html =
    '<div lang="en">' +
    intro +
    "<p>" + zusammenfassung + "</p>" +
    '<table style="border-collapse:collapse;font-size:14px">' +
    '<thead><tr style="text-align:left">' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Name</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Practised</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Days</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Accuracy</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Difficulty level</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Weekly goal</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">School year</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Catch-up</th>' +
    "</tr></thead><tbody>" + zeilenHtml + "</tbody></table>" +
    linkZeile +
    (daten.fussHtml || "") +
    "</div>";

  return { subject: subject, html: html };
}

// ── E11c (26.09.2026): DIESELBE MAIL FRANZÖSISCH ─────────────────────────────
// Für Lehrkräfte mit `bedienSprache = "fr"`. Gleicher Aufbau, gleiche Spalten,
// gleiche Zahlen; die Wörter wie in der französischen Oberfläche (Bauplan
// französischer Lehrgang §9.2 und E11a-5): Wochenziel ⇒ *objectif de la
// semaine*, erlassen ⇒ *dispensée* (die Woche), Zielwoche ⇒ *semaine à
// objectif*, gesperrte Stunde ⇒ *verrouillée*, Nachholen ⇒ *à rattraper*.
// „vous", Zahlen mit Komma, „%" mit Leerzeichen, Zeit „8 h" (§9.1). Keine
// Kalenderwoche allein - in Frankreich, Belgien und Kanada zählt man sie im
// Alltag nicht; der Montag sagt dasselbe.
// ⚠️ Die Sätze umgehen „s'est entrainé/entrainée" (Geschlecht unbekannt, kein
//    Point médian): « Entrainement : 3 élèves sur 5 ».

var MONATE_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "décembre",
];
var MONATE_FR_KURZ = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "aout", "sept.", "oct.", "nov.", "déc.",
];
var WOCHENTAGE_FR = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/** „lundi 14 septembre" aus einem echten Zeitpunkt, WIENER Kalendertag. */
function datumFr(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return WOCHENTAGE_FR[f.wochentag] + " " + f.tag + " " + MONATE_FR[f.monat0];
}

/** „14 sept." - die Kurzform, wie die französische Oberfläche sie schreibt. */
function kurzDatumFr(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return f.tag + " " + MONATE_FR_KURZ[f.monat0];
}

/** „1 heure" / „1,5 heure" / „3 heures" - französisch ist alles unter 2 Einzahl. */
function formatStundenFr(ms) {
  var stunden = Math.round((ms / 3600000) * 10) / 10;
  var ganz = Math.round(stunden);
  var text = Math.abs(stunden - ganz) < 1e-9 ? String(ganz) : String(stunden).replace(".", ",");
  return stunden < 2 ? text + " heure" : text + " heures";
}

/** „élève" oder „élèves" - 0 und 1 sind französisch Einzahl. */
function eleveFr(n) {
  return n < 2 ? " élève" : " élèves";
}

/** Die Wochenziel-Zelle französisch: „45 sur 60 min" (+ „ ✓"), „dispensée", „pas une semaine à objectif", „pas d'objectif". */
function wochenzielZellenTextFr(zeile) {
  if (!zeile.hatZiel) return "pas d'objectif";
  if (zeile.erlassen) return "dispensée";
  if (!zeile.zielwoche) return "pas une semaine à objectif";
  var basis = Math.round(zeile.erfuelltMin) + " sur " + Math.round(zeile.zielMin) + " min";
  return zeile.offenMin <= 0 ? basis + " ✓" : basis;
}

/** Die Schuljahr-Zelle französisch: „87 %" oder „-". */
function schuljahrZellenTextFr(anteil) {
  return anteil === null || anteil === undefined ? "-" : Math.round(anteil * 100) + " %";
}

/** Die Nachholen-Zelle französisch: „15 min à rattraper", sonst leer. */
function nachholenZellenTextFr(zeile) {
  var min = zeile.nachholenOffenMin;
  if (min === null || min === undefined || !(min > 0)) return "";
  return Math.round(min) + " min à rattraper";
}

/** Der Wochenbericht französisch - dieselbe reine Funktion, derselbe Aufbau wie {@link berichtHtml}. */
function berichtHtmlFr(daten) {
  var klasse = daten.klasse;
  var wocheStartMsWert = daten.wocheStartMs;
  // Z1: die Woche in der Zone der Lehrkraft (`daten.zeitzone`, ohne: Wien).
  var zone = daten.zeitzone;
  var wocheEndeMsWert = wochenStartVerschobenMs(wocheStartMsWert, 1, zone);
  var zeilen = daten.zeilen || [];

  var subject =
    "Bilan hebdomadaire Tastenflow - " + klasse + " (semaine du " + kurzDatumFr(wocheStartMsWert, zone) + ")";

  var aktiv = 0;
  var minutenSumme = 0;
  var zielwochenGesamt = 0;
  var zielwochenErreicht = 0;
  var zeilenHtml = "";
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    var geuebtGerundet = Math.round(z.geuebtMin);
    if (geuebtGerundet > 0 || z.tage > 0) {
      aktiv++;
      minutenSumme += geuebtGerundet;
    }
    if (z.zielwoche) {
      zielwochenGesamt++;
      if (z.offenMin <= 0) zielwochenErreicht++;
    }
    zeilenHtml +=
      "<tr>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(z.name) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + geuebtGerundet + " min</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + (z.tage || 0) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.treffsicherheit || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.stufe || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(wochenzielZellenTextFr(z)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(schuljahrZellenTextFr(z.schuljahrAnteil)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(nachholenZellenTextFr(z)) + "</td>" +
      "</tr>";
  }

  var v = daten.ortVon;
  var b = daten.ortBis;
  var intro =
    v && b
      ? "<p>Bilan hebdomadaire de votre classe <b>" + escHtml(klasse) + "</b> : la semaine du " +
        WOCHENTAGE_FR[v.wochentag] + " " + v.tag + " " + MONATE_FR[v.monat0] + ", " + uhrFr(v) + ", au " +
        WOCHENTAGE_FR[b.wochentag] + " " + b.tag + " " + MONATE_FR[b.monat0] + ", " + uhrFr(b) +
        zonenZusatz(v, "fr") + ".</p>"
      : "<p>Bilan hebdomadaire de votre classe <b>" + escHtml(klasse) + "</b> : la semaine du " +
        datumFr(wocheStartMsWert, zone) + ", 8 h, au " + datumFr(wocheEndeMsWert, zone) + ", 8 h.</p>";

  var zusammenfassung =
    "Entrainement : " + aktiv + eleveFr(aktiv) + " sur " + zeilen.length + ", " +
    minutenSumme + (minutenSumme < 2 ? " minute" : " minutes") + " au total.";
  if (zielwochenGesamt > 0) {
    zusammenfassung +=
      " Objectif de la semaine atteint : " + zielwochenErreicht + eleveFr(zielwochenErreicht) +
      " sur " + zielwochenGesamt + ".";
  }
  if (daten.gesperrtMs > 0) {
    var dauerFr = formatStundenFr(daten.gesperrtMs);
    zusammenfassung +=
      " Cette semaine, " + dauerFr +
      (/heures$/.test(dauerFr) ? " étaient verrouillées" : " était verrouillée") +
      " - l'entrainement pendant ce temps ne compte pas pour l'objectif de la semaine.";
  }

  var linkZeile = daten.klassenLink
    ? '<p><a href="' + escHtml(daten.klassenLink) + '">Aller à la classe ' + escHtml(klasse) + "</a></p>"
    : "";

  var html =
    '<div lang="fr">' +
    intro +
    "<p>" + zusammenfassung + "</p>" +
    '<table style="border-collapse:collapse;font-size:14px">' +
    '<thead><tr style="text-align:left">' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Nom</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Temps d\'exercice</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Jours</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Précision</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Niveau</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Objectif de la semaine</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Année scolaire</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">À rattraper</th>' +
    "</tr></thead><tbody>" + zeilenHtml + "</tbody></table>" +
    linkZeile +
    (daten.fussHtml || "") +
    "</div>";

  return { subject: subject, html: html };
}

// ── ES-M (27.09.2026): DIESELBE MAIL SPANISCH ───────────────────────────────
// Für Lehrkräfte mit `bedienSprache = "es"`. Gleicher Aufbau, gleiche Spalten,
// gleiche Zahlen; die Wörter wie in der spanischen Oberfläche (Befund ES-O §2,
// `WeeklyGoalStats.tsx`): Wochenziel ⇒ *objetivo semanal*, erlassen ⇒
// *eximida* (die Woche), keine Zielwoche ⇒ *no es semana del objetivo*,
// Nachholen ⇒ *por recuperar*, gesperrte Stunde ⇒ *bloqueada*, Schuljahr ⇒
// *curso escolar*, Übezeit ⇒ *tiempo de práctica*. „usted", Zeit „8:00",
// „%" mit Leerzeichen, Dezimalpunkt (RAE/ASALE 2010). Keine Kalenderwoche
// allein - der Montag sagt dasselbe, in Spanien wie in Amerika.
// Kinder heissen *estudiantes* (ohne Geschlecht, Bauplan S10).
// NEU GESCHRIEBEN, nicht übersetzt.

var MONATE_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
var WOCHENTAGE_ES = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

/** „lunes 14 de septiembre" aus einem echten Zeitpunkt, WIENER Kalendertag. */
function datumEs(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return WOCHENTAGE_ES[f.wochentag] + " " + f.tag + " de " + MONATE_ES[f.monat0];
}

/** „14 de septiembre" - ohne Wochentag, für den Betreff. */
function kurzDatumEs(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return f.tag + " de " + MONATE_ES[f.monat0];
}

/** „1 hora" / „1.5 horas" / „3 horas" - spanisch ist nur genau 1 Einzahl. */
function formatStundenEs(ms) {
  var stunden = Math.round((ms / 3600000) * 10) / 10;
  var ganz = Math.round(stunden);
  var text = Math.abs(stunden - ganz) < 1e-9 ? String(ganz) : String(stunden);
  return Math.abs(stunden - 1) < 1e-9 ? text + " hora" : text + " horas";
}

/** Die Wochenziel-Zelle spanisch: „45 de 60 min" (+ „ ✓"), „eximida", „no es semana del objetivo", „sin objetivo". */
function wochenzielZellenTextEs(zeile) {
  if (!zeile.hatZiel) return "sin objetivo";
  if (zeile.erlassen) return "eximida";
  if (!zeile.zielwoche) return "no es semana del objetivo";
  var basis = Math.round(zeile.erfuelltMin) + " de " + Math.round(zeile.zielMin) + " min";
  return zeile.offenMin <= 0 ? basis + " ✓" : basis;
}

/** Die Schuljahr-Zelle spanisch: „87 %" oder „-". */
function schuljahrZellenTextEs(anteil) {
  return anteil === null || anteil === undefined ? "-" : Math.round(anteil * 100) + " %";
}

/** Die Nachholen-Zelle spanisch: „15 min por recuperar", sonst leer. */
function nachholenZellenTextEs(zeile) {
  var min = zeile.nachholenOffenMin;
  if (min === null || min === undefined || !(min > 0)) return "";
  return Math.round(min) + " min por recuperar";
}

/** Der Wochenbericht spanisch - dieselbe reine Funktion, derselbe Aufbau wie {@link berichtHtml}. */
function berichtHtmlEs(daten) {
  var klasse = daten.klasse;
  var wocheStartMsWert = daten.wocheStartMs;
  // Z1: die Woche in der Zone der Lehrkraft (`daten.zeitzone`, ohne: Wien).
  var zone = daten.zeitzone;
  var wocheEndeMsWert = wochenStartVerschobenMs(wocheStartMsWert, 1, zone);
  var zeilen = daten.zeilen || [];

  var subject =
    "Resumen semanal de Tastenflow - " + klasse + " (semana del " + kurzDatumEs(wocheStartMsWert, zone) + ")";

  var aktiv = 0;
  var minutenSumme = 0;
  var zielwochenGesamt = 0;
  var zielwochenErreicht = 0;
  var zeilenHtml = "";
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    var geuebtGerundet = Math.round(z.geuebtMin);
    if (geuebtGerundet > 0 || z.tage > 0) {
      aktiv++;
      minutenSumme += geuebtGerundet;
    }
    if (z.zielwoche) {
      zielwochenGesamt++;
      if (z.offenMin <= 0) zielwochenErreicht++;
    }
    zeilenHtml +=
      "<tr>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(z.name) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + geuebtGerundet + " min</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + (z.tage || 0) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.treffsicherheit || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.stufe || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(wochenzielZellenTextEs(z)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(schuljahrZellenTextEs(z.schuljahrAnteil)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(nachholenZellenTextEs(z)) + "</td>" +
      "</tr>";
  }

  var v = daten.ortVon;
  var b = daten.ortBis;
  var intro =
    v && b
      ? "<p>Resumen semanal de su clase <b>" + escHtml(klasse) + "</b>: del " +
        // ★ D2 (28.09.2026): auf der Wanduhr der Lehrkraft - der Zusatz nur,
        // wenn sie keine (bekannte) Zone hat.
        WOCHENTAGE_ES[v.wochentag] + " " + v.tag + " de " + MONATE_ES[v.monat0] + ", " + uhrDeOderEs(v) +
        ", al " +
        WOCHENTAGE_ES[b.wochentag] + " " + b.tag + " de " + MONATE_ES[b.monat0] + ", " + uhrDeOderEs(b) +
        zonenZusatz(v, "es") + ".</p>"
      : "<p>Resumen semanal de su clase <b>" + escHtml(klasse) + "</b>: del " +
        // ★ ES-TF2: 8:00 ist Wiener Zeit (`wienWanduhrFelder`) - darum mit Zeitzone.
        datumEs(wocheStartMsWert, zone) + ", 8:00, al " + datumEs(wocheEndeMsWert, zone) + ", 8:00 (hora de Europa central).</p>";

  var zusammenfassung =
    "Estudiantes que practicaron: " + aktiv + " de " + zeilen.length + " - " +
    minutenSumme + (minutenSumme === 1 ? " minuto" : " minutos") + " en total.";
  if (zielwochenGesamt > 0) {
    zusammenfassung += " Objetivo semanal alcanzado: " + zielwochenErreicht + " de " + zielwochenGesamt + ".";
  }
  if (daten.gesperrtMs > 0) {
    var dauerEs = formatStundenEs(daten.gesperrtMs);
    zusammenfassung +=
      " Esta semana hubo " + dauerEs + (/horas$/.test(dauerEs) ? " bloqueadas" : " bloqueada") +
      " - lo practicado en ese tiempo no cuenta para el objetivo semanal.";
  }

  var linkZeile = daten.klassenLink
    ? '<p><a href="' + escHtml(daten.klassenLink) + '">Ir a la clase ' + escHtml(klasse) + "</a></p>"
    : "";

  var html =
    '<div lang="es">' +
    intro +
    "<p>" + zusammenfassung + "</p>" +
    '<table style="border-collapse:collapse;font-size:14px">' +
    '<thead><tr style="text-align:left">' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Nombre</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Tiempo de práctica</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Días</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Precisión</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Nivel</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Objetivo semanal</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Curso escolar</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Por recuperar</th>' +
    "</tr></thead><tbody>" + zeilenHtml + "</tbody></table>" +
    linkZeile +
    (daten.fussHtml || "") +
    "</div>";

  return { subject: subject, html: html };
}

// ── O-IT (02.10.2026): DIESELBE MAIL ITALIENISCH ───────────────────────────
// Für Lehrkräfte mit `bedienSprache = "it"`. Gleicher Aufbau, gleiche Spalten,
// gleiche Zahlen; die Wörter wie in der italienischen Oberfläche (Glossar
// `recherche-italienisch-2026-10-02/GLOSSAR-it.md` §2.6, `WeeklyGoalStats.tsx`):
// Wochenziel ⇒ *obiettivo settimanale*, erlassen ⇒ *esonerata*, keine
// Zielwoche ⇒ *non è una settimana con obiettivo*, Nachholen ⇒ *da
// recuperare*, gesperrte Stunde ⇒ *obiettivo sospeso*, Schuljahr ⇒ *anno
// scolastico*, Übezeit ⇒ *tempo di esercizio*. Neutral ohne „Lei" (Regel 1),
// Zeit „8:00", „95%" ohne Leerzeichen, Dezimalkomma (Regel 5). Keine
// Kalenderwoche allein - „la settimana del 14 settembre". NEU GESCHRIEBEN.

var MONATE_IT = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];
var WOCHENTAGE_IT = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];

/** „lunedì 14 settembre" aus einem echten Zeitpunkt, WIENER Kalendertag (bzw. der Zone). */
function datumIt(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return WOCHENTAGE_IT[f.wochentag] + " " + f.tag + " " + MONATE_IT[f.monat0];
}

/** „del 14 settembre" / „dell'8 settembre" - für den Betreff (Elision vor 1, 8, 11). */
function kurzDatumIt(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  var vor = f.tag === 1 || f.tag === 8 || f.tag === 11 ? "dell'" : "del ";
  return vor + f.tag + " " + MONATE_IT[f.monat0];
}

/** „1 ora" / „1,5 ore" / „3 ore" - italienisch ist nur genau 1 Einzahl, Dezimalkomma. */
function formatStundenIt(ms) {
  var stunden = Math.round((ms / 3600000) * 10) / 10;
  var ganz = Math.round(stunden);
  var text = Math.abs(stunden - ganz) < 1e-9 ? String(ganz) : String(stunden).replace(".", ",");
  return Math.abs(stunden - 1) < 1e-9 ? text + " ora" : text + " ore";
}

/** Die Wochenziel-Zelle italienisch: „45 di 60 min" (+ „ ✓"), „esonerata", „non è una settimana con obiettivo", „senza obiettivo". */
function wochenzielZellenTextIt(zeile) {
  if (!zeile.hatZiel) return "senza obiettivo";
  if (zeile.erlassen) return "esonerata";
  if (!zeile.zielwoche) return "non è una settimana con obiettivo";
  var basis = Math.round(zeile.erfuelltMin) + " di " + Math.round(zeile.zielMin) + " min";
  return zeile.offenMin <= 0 ? basis + " ✓" : basis;
}

/** Die Schuljahr-Zelle italienisch: „87%" oder „-". */
function schuljahrZellenTextIt(anteil) {
  return anteil === null || anteil === undefined ? "-" : Math.round(anteil * 100) + "%";
}

/** Die Nachholen-Zelle italienisch: „15 min da recuperare", sonst leer. */
function nachholenZellenTextIt(zeile) {
  var min = zeile.nachholenOffenMin;
  if (min === null || min === undefined || !(min > 0)) return "";
  return Math.round(min) + " min da recuperare";
}

/** Der Wochenbericht italienisch - dieselbe reine Funktion, derselbe Aufbau wie {@link berichtHtml}. */
function berichtHtmlIt(daten) {
  var klasse = daten.klasse;
  var wocheStartMsWert = daten.wocheStartMs;
  // Z1: die Woche in der Zone der Lehrkraft (`daten.zeitzone`, ohne: Wien).
  var zone = daten.zeitzone;
  var wocheEndeMsWert = wochenStartVerschobenMs(wocheStartMsWert, 1, zone);
  var zeilen = daten.zeilen || [];

  var subject =
    "Resoconto settimanale di Tastenflow - " + klasse + " (settimana " + kurzDatumIt(wocheStartMsWert, zone) + ")";

  var aktiv = 0;
  var minutenSumme = 0;
  var zielwochenGesamt = 0;
  var zielwochenErreicht = 0;
  var zeilenHtml = "";
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    var geuebtGerundet = Math.round(z.geuebtMin);
    if (geuebtGerundet > 0 || z.tage > 0) {
      aktiv++;
      minutenSumme += geuebtGerundet;
    }
    if (z.zielwoche) {
      zielwochenGesamt++;
      if (z.offenMin <= 0) zielwochenErreicht++;
    }
    zeilenHtml +=
      "<tr>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(z.name) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + geuebtGerundet + " min</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + (z.tage || 0) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.treffsicherheit || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.stufe || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(wochenzielZellenTextIt(z)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(schuljahrZellenTextIt(z.schuljahrAnteil)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(nachholenZellenTextIt(z)) + "</td>" +
      "</tr>";
  }

  var v = daten.ortVon;
  var b = daten.ortBis;
  var intro =
    v && b
      ? "<p>Resoconto settimanale della classe <b>" + escHtml(klasse) + "</b>: da " +
        // ★ D2-Muster: auf der Wanduhr der Lehrkraft - der Zusatz nur, wenn sie
        // keine (bekannte) Zone hat.
        WOCHENTAGE_IT[v.wochentag] + " " + v.tag + " " + MONATE_IT[v.monat0] + " alle " + uhrDeOderEs(v) +
        " a " +
        WOCHENTAGE_IT[b.wochentag] + " " + b.tag + " " + MONATE_IT[b.monat0] + " alle " + uhrDeOderEs(b) +
        zonenZusatz(v, "it") + ".</p>"
      : "<p>Resoconto settimanale della classe <b>" + escHtml(klasse) + "</b>: da " +
        datumIt(wocheStartMsWert, zone) + " alle 8:00 a " + datumIt(wocheEndeMsWert, zone) +
        " alle 8:00 (ora dell'Europa centrale).</p>";

  var zusammenfassung =
    "Esercizio fatto da " + aktiv + " su " + zeilen.length + " - " +
    minutenSumme + (minutenSumme === 1 ? " minuto" : " minuti") + " in totale.";
  if (zielwochenGesamt > 0) {
    zusammenfassung += " Obiettivo settimanale raggiunto: " + zielwochenErreicht + " su " + zielwochenGesamt + ".";
  }
  if (daten.gesperrtMs > 0) {
    zusammenfassung +=
      " Questa settimana l'obiettivo è stato sospeso per " + formatStundenIt(daten.gesperrtMs) +
      " - l'esercizio di quel tempo non conta per l'obiettivo settimanale.";
  }

  var linkZeile = daten.klassenLink
    ? '<p><a href="' + escHtml(daten.klassenLink) + '">Vai alla classe ' + escHtml(klasse) + "</a></p>"
    : "";

  var html =
    '<div lang="it">' +
    intro +
    "<p>" + zusammenfassung + "</p>" +
    '<table style="border-collapse:collapse;font-size:14px">' +
    '<thead><tr style="text-align:left">' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Nome</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Tempo di esercizio</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Giorni</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Precisione</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Livello</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Obiettivo settimanale</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Anno scolastico</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Da recuperare</th>' +
    "</tr></thead><tbody>" + zeilenHtml + "</tbody></table>" +
    linkZeile +
    (daten.fussHtml || "") +
    "</div>";

  return { subject: subject, html: html };
}

// ── O-PL (02.10.2026): DIESELBE MAIL POLNISCH ──────────────────────────────
// Für Lehrkräfte mit `bedienSprache = "pl"`. Gleicher Aufbau, gleiche Spalten,
// gleiche Zahlen; die Wörter nach dem Glossar `recherche-polnisch-2026-10-02/
// GLOSSAR-pl.md` §2.6: Wochenbericht ⇒ *podsumowanie tygodnia*, Wochenziel ⇒
// *cel tygodniowy*, erlassen ⇒ *tydzień zwolniony*, Nachholen ⇒ *do
// nadrobienia*, gesperrte Stunde ⇒ *cel wstrzymany*, Schuljahr ⇒ *rok
// szkolny*, Übezeit ⇒ *czas ćwiczeń*. Nie „Pan/Pani" (Regel 1), kein
// Geschlecht (Regel 2: Sätze über die Sache, Zahlen nach Doppelpunkt).
// Datum mit dem Monat im GENITIV („14 września", §2.10), Wochentag nach
// Präposition aus der eigenen Tabelle {@link WOCHENTAG_AM_PL} (nie Intl -
// goja hat keine Sprachdaten, und Intl kennt nur den Nominativ). „95%" ohne
// Leerzeichen, Dezimalkomma (Regel 5), Zeit „8:00". Keine Kalenderwoche als
// Nummer - „tydzień 14-20 września". NEU GESCHRIEBEN.

/** Die Monate im Genitiv - so stehen sie in jedem Datum („21 września"). */
var MONATE_PL_GEN = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
];
/** Die Wochentage im Nominativ, klein (Regel 10) - Montag zuerst wie `wochentag`. */
var WOCHENTAGE_PL = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"];
/**
 * „am Montag" - Präposition + Akkusativ, VON HAND (Glossar §2.10): „we wtorek"
 * (nicht „w wtorek"), „w środę", „w sobotę", „w niedzielę".
 */
var WOCHENTAG_AM_PL = [
  "w poniedziałek", "we wtorek", "w środę", "w czwartek", "w piątek", "w sobotę", "w niedzielę",
];

/**
 * Die polnische Mehrzahl-Kategorie wie `Intl.PluralRules("pl-PL")` (gemessen,
 * Glossar §2.10a): 1 one · 2-4, 22-24 … few (nicht 12-14) · 0, 5-21, 25 … many ·
 * Bruchzahl other. Von Hand, weil goja kein Intl hat.
 */
function plKategorie(n) {
  if (n !== Math.floor(n)) return "other";
  if (n === 1) return "one";
  var m10 = n % 10;
  var m100 = n % 100;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "few";
  return "many";
}

/** „poniedziałek, 14 września" aus einem echten Zeitpunkt, Kalendertag in der Zone (ohne: Wien). */
function datumPl(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return WOCHENTAGE_PL[f.wochentag] + ", " + f.tag + " " + MONATE_PL_GEN[f.monat0];
}

/**
 * „14-20 września" / „28 września - 4 października" - die Woche vom Montag bis
 * zum Sonntag (Ende minus ein Tag), für Betreff und Kopf.
 */
function wocheSpannePl(startMs, endeMs, zone) {
  var a = wienWanduhrFelder(startMs, zone);
  var b = wienWanduhrFelder(endeMs - 24 * 3600000, zone);
  if (a.monat0 === b.monat0) return a.tag + "-" + b.tag + " " + MONATE_PL_GEN[b.monat0];
  return a.tag + " " + MONATE_PL_GEN[a.monat0] + " - " + b.tag + " " + MONATE_PL_GEN[b.monat0];
}

/**
 * „przez 1 godzinę" · „przez 2 godziny" · „przez 5 godzin" · „przez 1,5 godziny" -
 * nach „przez" steht der Akkusativ: die Einzahl ändert die Form (Glossar §2.10a,
 * alle vier Formen).
 */
function formatStundenPl(ms) {
  var stunden = Math.round((ms / 3600000) * 10) / 10;
  var k = plKategorie(stunden);
  var text = String(stunden).replace(".", ",");
  if (k === "one") return text + " godzinę";
  if (k === "few") return text + " godziny";
  if (k === "many") return text + " godzin";
  return text + " godziny";
}

/** Die Wochenziel-Zelle polnisch: „45 z 60 min" (+ „ ✓"), „tydzień zwolniony", „tydzień bez celu", „bez celu". */
function wochenzielZellenTextPl(zeile) {
  if (!zeile.hatZiel) return "bez celu";
  if (zeile.erlassen) return "tydzień zwolniony";
  if (!zeile.zielwoche) return "tydzień bez celu";
  var basis = Math.round(zeile.erfuelltMin) + " z " + Math.round(zeile.zielMin) + " min";
  return zeile.offenMin <= 0 ? basis + " ✓" : basis;
}

/** Die Schuljahr-Zelle polnisch: „87%" oder „-". */
function schuljahrZellenTextPl(anteil) {
  return anteil === null || anteil === undefined ? "-" : Math.round(anteil * 100) + "%";
}

/** Die Nachholen-Zelle polnisch: „15 min do nadrobienia", sonst leer. */
function nachholenZellenTextPl(zeile) {
  var min = zeile.nachholenOffenMin;
  if (min === null || min === undefined || !(min > 0)) return "";
  return Math.round(min) + " min do nadrobienia";
}

/** Der Wochenbericht polnisch - dieselbe reine Funktion, derselbe Aufbau wie {@link berichtHtml}. */
function berichtHtmlPl(daten) {
  var klasse = daten.klasse;
  var wocheStartMsWert = daten.wocheStartMs;
  // Z1: die Woche in der Zone der Lehrkraft (`daten.zeitzone`, ohne: Wien).
  var zone = daten.zeitzone;
  var wocheEndeMsWert = wochenStartVerschobenMs(wocheStartMsWert, 1, zone);
  var zeilen = daten.zeilen || [];
  var spanne = wocheSpannePl(wocheStartMsWert, wocheEndeMsWert, zone);

  var subject = "Podsumowanie tygodnia w programie Tastenflow - " + klasse + " (tydzień " + spanne + ")";

  var aktiv = 0;
  var minutenSumme = 0;
  var zielwochenGesamt = 0;
  var zielwochenErreicht = 0;
  var zeilenHtml = "";
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    var geuebtGerundet = Math.round(z.geuebtMin);
    if (geuebtGerundet > 0 || z.tage > 0) {
      aktiv++;
      minutenSumme += geuebtGerundet;
    }
    if (z.zielwoche) {
      zielwochenGesamt++;
      if (z.offenMin <= 0) zielwochenErreicht++;
    }
    zeilenHtml +=
      "<tr>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(z.name) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + geuebtGerundet + " min</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + (z.tage || 0) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.treffsicherheit || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.stufe || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(wochenzielZellenTextPl(z)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(schuljahrZellenTextPl(z.schuljahrAnteil)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(nachholenZellenTextPl(z)) + "</td>" +
      "</tr>";
  }

  var v = daten.ortVon;
  var b = daten.ortBis;
  // Die Zeit nach einem Doppelpunkt und das Datum mit dem Monat im Genitiv -
  // so bleibt nichts in einer gebeugten Stelle (Regel 11). Der Wochentag mit
  // Präposition kommt aus WOCHENTAG_AM_PL.
  var intro =
    v && b
      ? "<p>Podsumowanie tygodnia dla klasy <b>" + escHtml(klasse) + "</b>. Okres: " +
        WOCHENTAGE_PL[v.wochentag] + ", " + v.tag + " " + MONATE_PL_GEN[v.monat0] + ", " + uhrDeOderEs(v) +
        " - " +
        WOCHENTAGE_PL[b.wochentag] + ", " + b.tag + " " + MONATE_PL_GEN[b.monat0] + ", " + uhrDeOderEs(b) +
        zonenZusatz(v, "pl") + ". Tydzień zaczyna się " + WOCHENTAG_AM_PL[v.wochentag] + " o " +
        uhrDeOderEs(v) + ".</p>"
      : "<p>Podsumowanie tygodnia dla klasy <b>" + escHtml(klasse) + "</b>. Okres: " +
        datumPl(wocheStartMsWert, zone) + ", 8:00 - " + datumPl(wocheEndeMsWert, zone) +
        ", 8:00 (czas środkowoeuropejski). Tydzień zaczyna się " + WOCHENTAG_AM_PL[0] + " o 8:00.</p>";

  // Zahlen nach Doppelpunkt - ohne Verb, das ein Geschlecht trüge („ćwiczyło/ćwiczyła").
  var zusammenfassung =
    "Osoby z ćwiczeniami w tym tygodniu: " + aktiv + " z " + zeilen.length + ". " +
    "Łączny czas ćwiczeń: " + minutenSumme + " min.";
  if (zielwochenGesamt > 0) {
    zusammenfassung += " Cel tygodniowy osiągnięty: " + zielwochenErreicht + " z " + zielwochenGesamt + ".";
  }
  if (daten.gesperrtMs > 0) {
    zusammenfassung +=
      " W tym tygodniu cel był wstrzymany przez " + formatStundenPl(daten.gesperrtMs) +
      " - ćwiczenia z tego czasu nie liczą się do celu tygodniowego.";
  }

  var linkZeile = daten.klassenLink
    ? '<p><a href="' + escHtml(daten.klassenLink) + '">Przejdź do klasy ' + escHtml(klasse) + "</a></p>"
    : "";

  var html =
    '<div lang="pl">' +
    intro +
    "<p>" + zusammenfassung + "</p>" +
    '<table style="border-collapse:collapse;font-size:14px">' +
    '<thead><tr style="text-align:left">' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Imię</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Czas ćwiczeń</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Dni</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Dokładność</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Poziom</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Cel tygodniowy</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Rok szkolny</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Do nadrobienia</th>' +
    "</tr></thead><tbody>" + zeilenHtml + "</tbody></table>" +
    linkZeile +
    (daten.fussHtml || "") +
    "</div>";

  return { subject: subject, html: html };
}

// ── O-TR (02.10.2026): DIESELBE MAIL TÜRKISCH ──────────────────────────────
// Für Lehrkräfte mit `bedienSprache = "tr"`. Gleicher Aufbau, gleiche Spalten,
// gleiche Zahlen; die Wörter nach dem Glossar `recherche-tuerkisch-2026-10-02/
// GLOSSAR-tr.md` §2.6/§2.10: Wochenbericht ⇒ *haftalık rapor*, Wochenziel ⇒
// *haftalık hedef*, erlassen ⇒ *muaf*, Nachholen ⇒ *Telafi*, gesperrte Stunde
// ⇒ *hedef durduruldu*, Schuljahr ⇒ *öğretim yılı*, Leistungsstufe ⇒ *zorluk
// seviyesi*, Übezeit ⇒ *çalışma süresi*. siz, kein Ausrufezeichen (Regel 1).
// ★★ KEINE Endung an Klasse, Zahl, Datum oder Uhrzeit (Regel 6): sie stehen
// nach einem Doppelpunkt („Sınıf: 5A", „Hafta başlangıcı: Pazartesi, 08:00")
// oder vor einem festen Wort („14-20 Eylül haftası", „1,5 saat boyunca").
// Nach einer Zahl Einzahl („12 öğrenci"). Datum „14 Eylül Pazartesi"
// (Wochentag NACH dem Datum, Monat gross), Uhrzeit „08:00" mit Null, Dauer
// „3 sa. 36 dk.", „%95" (Zeichen VOR der Zahl), Dezimalkomma. Eigene
// Tabellen statt Intl (goja hat keine Sprachdaten). Keine Kalenderwoche als
// Nummer. Zeitzone: die Türkei hat ganzjährig UTC+3 - der Satz nennt die Zeit
// der Lehrkraft (`daten.ortVon`/`ortBis`), und nur wenn der Server ihre Zone
// NICHT kennt, steht Wiener Zeit mit „(Orta Avrupa saati)" da. NEU GESCHRIEBEN.

/** Die Monate türkisch, gross wie in jedem bestimmten Datum (Glossar Regel 9). */
var MONATE_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
/** Die Wochentage türkisch - Montag zuerst wie `wochentag`. */
var WOCHENTAGE_TR = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

/** „08:00" - Stunde MIT führender Null (Glossar §2.10, wie `Intl` „tr-TR"). */
function uhrTr(f) {
  return pad2Text(f.stunde) + ":" + pad2Text(f.minute);
}

/** „14 Eylül Pazartesi" aus einem echten Zeitpunkt, Kalendertag in der Zone (ohne: Wien). */
function datumTr(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return f.tag + " " + MONATE_TR[f.monat0] + " " + WOCHENTAGE_TR[f.wochentag];
}

/** „14-20 Eylül" / „28 Eylül - 4 Ekim" - Montag bis Sonntag (Ende minus ein Tag). */
function wocheSpanneTr(startMs, endeMs, zone) {
  var a = wienWanduhrFelder(startMs, zone);
  var b = wienWanduhrFelder(endeMs - 24 * 3600000, zone);
  if (a.monat0 === b.monat0) return a.tag + "-" + b.tag + " " + MONATE_TR[b.monat0];
  return a.tag + " " + MONATE_TR[a.monat0] + " - " + b.tag + " " + MONATE_TR[b.monat0];
}

/** „25 dk." · „3 sa." · „3 sa. 36 dk." (Glossar §2.10). */
function dauerTr(minuten) {
  var m = Math.round(minuten);
  if (m < 60) return m + " dk.";
  var rest = m % 60;
  return Math.floor(m / 60) + " sa." + (rest ? " " + rest + " dk." : "");
}

/** „1 saat" · „1,5 saat" - nach der Zahl die Einzahl (Regel 5), Dezimalkomma. */
function formatStundenTr(ms) {
  var stunden = Math.round((ms / 3600000) * 10) / 10;
  return String(stunden).replace(".", ",") + " saat";
}

/** Die Wochenziel-Zelle türkisch: „45 dk. (hedef: 60 dk.)" (+ „ ✓"), „muaf", „hedefsiz hafta", „hedef yok". */
function wochenzielZellenTextTr(zeile) {
  if (!zeile.hatZiel) return "hedef yok";
  if (zeile.erlassen) return "muaf";
  if (!zeile.zielwoche) return "hedefsiz hafta";
  var basis = Math.round(zeile.erfuelltMin) + " dk. (hedef: " + Math.round(zeile.zielMin) + " dk.)";
  return zeile.offenMin <= 0 ? basis + " ✓" : basis;
}

/** Die Schuljahr-Zelle türkisch: „%87" (Zeichen VOR der Zahl) oder „-". */
function schuljahrZellenTextTr(anteil) {
  return anteil === null || anteil === undefined ? "-" : "%" + Math.round(anteil * 100);
}

/** Die Nachholen-Zelle türkisch: „Telafi: 15 dk.", sonst leer. */
function nachholenZellenTextTr(zeile) {
  var min = zeile.nachholenOffenMin;
  if (min === null || min === undefined || !(min > 0)) return "";
  return "Telafi: " + Math.round(min) + " dk.";
}

/** Der Wochenbericht türkisch - dieselbe reine Funktion, derselbe Aufbau wie {@link berichtHtml}. */
function berichtHtmlTr(daten) {
  var klasse = daten.klasse;
  var wocheStartMsWert = daten.wocheStartMs;
  // Z1: die Woche in der Zone der Lehrkraft (`daten.zeitzone`, ohne: Wien).
  var zone = daten.zeitzone;
  var wocheEndeMsWert = wochenStartVerschobenMs(wocheStartMsWert, 1, zone);
  var zeilen = daten.zeilen || [];
  var spanne = wocheSpanneTr(wocheStartMsWert, wocheEndeMsWert, zone);

  var subject = "Tastenflow haftalık raporu - " + klasse + " (" + spanne + " haftası)";

  var aktiv = 0;
  var minutenSumme = 0;
  var zielwochenGesamt = 0;
  var zielwochenErreicht = 0;
  var zeilenHtml = "";
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    var geuebtGerundet = Math.round(z.geuebtMin);
    if (geuebtGerundet > 0 || z.tage > 0) {
      aktiv++;
      minutenSumme += geuebtGerundet;
    }
    if (z.zielwoche) {
      zielwochenGesamt++;
      if (z.offenMin <= 0) zielwochenErreicht++;
    }
    zeilenHtml +=
      "<tr>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(z.name) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + geuebtGerundet + " dk.</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + (z.tage || 0) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.treffsicherheit || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.stufe || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(wochenzielZellenTextTr(z)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(schuljahrZellenTextTr(z.schuljahrAnteil)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(nachholenZellenTextTr(z)) + "</td>" +
      "</tr>";
  }

  var v = daten.ortVon;
  var b = daten.ortBis;
  // Klasse, Datum und Uhrzeit nach einem Doppelpunkt - so hängt an keinem
  // eingesetzten Wert eine Endung (Regel 6).
  var intro =
    v && b
      ? "<p>Sınıf: <b>" + escHtml(klasse) + "</b>. Rapor dönemi: " +
        v.tag + " " + MONATE_TR[v.monat0] + " " + WOCHENTAGE_TR[v.wochentag] + ", " + uhrTr(v) +
        " - " +
        b.tag + " " + MONATE_TR[b.monat0] + " " + WOCHENTAGE_TR[b.wochentag] + ", " + uhrTr(b) +
        zonenZusatz(v, "tr") + ". Hafta başlangıcı: " + WOCHENTAGE_TR[v.wochentag] + ", " +
        uhrTr(v) + ".</p>"
      : "<p>Sınıf: <b>" + escHtml(klasse) + "</b>. Rapor dönemi: " +
        datumTr(wocheStartMsWert, zone) + ", 08:00 - " + datumTr(wocheEndeMsWert, zone) +
        ", 08:00 (Orta Avrupa saati). Hafta başlangıcı: " + WOCHENTAGE_TR[0] + ", 08:00.</p>";

  // Zahlen nach Doppelpunkt, „toplam" statt „12 öğrenciden 9'u" (Regel 6).
  var zusammenfassung =
    "Bu hafta çalışan öğrenci: " + aktiv + ", toplam " + zeilen.length + ". " +
    // `dauerTr` endet schon auf „dk." bzw. „sa." - kein zweiter Punkt.
    "Toplam çalışma süresi: " + dauerTr(minutenSumme);
  if (zielwochenGesamt > 0) {
    zusammenfassung += " Haftalık hedefe ulaşan öğrenci: " + zielwochenErreicht + ", toplam " + zielwochenGesamt + ".";
  }
  if (daten.gesperrtMs > 0) {
    zusammenfassung +=
      " Bu hafta hedef " + formatStundenTr(daten.gesperrtMs) + " boyunca durduruldu - " +
      "bu sürede yapılan çalışmalar haftalık hedefe sayılmaz.";
  }

  var linkZeile = daten.klassenLink
    ? '<p><a href="' + escHtml(daten.klassenLink) + '">Sınıfa git: ' + escHtml(klasse) + "</a></p>"
    : "";

  var html =
    '<div lang="tr">' +
    intro +
    "<p>" + zusammenfassung + "</p>" +
    '<table style="border-collapse:collapse;font-size:14px">' +
    '<thead><tr style="text-align:left">' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Ad</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Çalışma süresi</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Gün</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Doğruluk</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Zorluk seviyesi</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Haftalık hedef</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Öğretim yılı</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Telafi</th>' +
    "</tr></thead><tbody>" + zeilenHtml + "</tbody></table>" +
    linkZeile +
    (daten.fussHtml || "") +
    "</div>";

  return { subject: subject, html: html };
}

// ── O-CS (03.10.2026): DIESELBE MAIL TSCHECHISCH ───────────────────────────
// Für Lehrkräfte mit `bedienSprache = "cs"`. Gleicher Aufbau, gleiche Spalten,
// gleiche Zahlen; die Wörter nach dem Glossar `recherche-tschechisch-2026-10-02/
// GLOSSAR-cs.md` §2.6/§2.10: Wochenbericht ⇒ *týdenní přehled*, Wochenziel ⇒
// *týdenní cíl*, erlassen ⇒ *prominuto*, Nachholen ⇒ *k dohnání*, gesperrte
// Stunde ⇒ *cíl pozastaven*, Schuljahr ⇒ *školní rok*, Leistungsstufe ⇒
// *úroveň obtížnosti*, Übezeit ⇒ *čas cvičení*. vy in der Mehrzahlform, kein
// Ausrufezeichen, keine Vergangenheit, die ein Geschlecht verrät (Regeln 1, 2).
// ★★ Klasse mit Kopfwort („pro třídu 5A"), Zahlen nach einem Doppelpunkt,
// kein Satz endet mit Zahl und Punkt (Falle 4) - die Zeilen stehen darum ohne
// Schlusspunkt untereinander. „z"/„ze" vor einer Zahl über {@link zZeCs}
// (Regel 13), Mehrzahl mit allen vier Formen über {@link csForm} (§2.11).
// Datum „pondělí 14. září" (Monat im GENITIV, von Hand - goja hat kein Intl),
// Uhrzeit „8:00", Dauer „3 h 36 min", „95 %" mit GESCHÜTZTEM Leerzeichen
// U+00A0 (Regel 5), Dezimalkomma. Keine Kalenderwoche als Nummer. Zeitzone:
// Ortszeit ohne Zusatz; kennt der Server die Zone nicht, Wiener Zeit mit
// „(středoevropský čas)". NEU GESCHRIEBEN.

/** Die Monate im GENITIV, klein - so stehen sie in jedem Datum („2. října", Glossar §4 Falle 7). */
var MONATE_CS_GEN = [
  "ledna", "února", "března", "dubna", "května", "června",
  "července", "srpna", "září", "října", "listopadu", "prosince",
];
/** Die Wochentage klein (Regel 9) - Montag zuerst wie `wochentag`. */
var WOCHENTAGE_CS = ["pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota", "neděle"];

/**
 * Die tschechische Mehrzahl-Kategorie wie `Intl.PluralRules("cs-CZ")`
 * (gemessen, Glossar §2.11): 1 one · 2-4 few · 0, 5+ (auch 21, 22) other ·
 * Bruchzahl many. Von Hand, weil goja kein Intl hat.
 */
function csKategorie(n) {
  if (n !== Math.floor(n)) return "many";
  if (n === 1) return "one";
  if (n >= 2 && n <= 4) return "few";
  return "other";
}

/** Eine Zahl mit der passenden der VIER Formen - `#` steht für die Zahl (Dezimalkomma). */
function csForm(n, one, few, many, other) {
  var k = csKategorie(n);
  var form = k === "one" ? one : k === "few" ? few : k === "many" ? many : other;
  return form.replace("#", String(n).replace(".", ","));
}

/**
 * „z" oder „ze" vor einer ganzen Zahl - wie `zZe` in `src/lib/bedienSprache/
 * predlozkyCs.ts` (Glossar Regel 13): „ze" vor 2, 3, 4, 6, 7, 12-14, 16, 17,
 * 20-49, 60-79, 100-499, 600-799 usw., sonst „z".
 */
function zZeCs(n) {
  var k = Math.floor(Math.abs(n));
  if (k >= 1000000) return Math.floor(k / 1000000) === 1 ? "z" : zZeCs(Math.floor(k / 1000000));
  if (k >= 1000) return Math.floor(k / 1000) === 1 ? "z" : zZeCs(Math.floor(k / 1000));
  if (k >= 100) return Math.floor(k / 100) === 1 ? "ze" : zZeCs(Math.floor(k / 100));
  if (k >= 20) {
    var zehner = Math.floor(k / 10);
    return zehner === 2 || zehner === 3 || zehner === 4 || zehner === 6 || zehner === 7 ? "ze" : "z";
  }
  return [2, 3, 4, 6, 7, 12, 13, 14, 16, 17].indexOf(k) >= 0 ? "ze" : "z";
}

/** „8:00" - Stunde ohne führende Null (gemessen `Intl` „cs-CZ", Glossar §2.10). */
function uhrCs(f) {
  return f.stunde + ":" + pad2Text(f.minute);
}

/** „pondělí 14. září" aus einem echten Zeitpunkt, Kalendertag in der Zone (ohne: Wien). */
function datumCs(utcMs, zone) {
  var f = wienWanduhrFelder(utcMs, zone);
  return WOCHENTAGE_CS[f.wochentag] + " " + f.tag + ". " + MONATE_CS_GEN[f.monat0];
}

/** „14.-20. září" / „28. září - 4. října" - Montag bis Sonntag (Ende minus ein Tag). */
function wocheSpanneCs(startMs, endeMs, zone) {
  var a = wienWanduhrFelder(startMs, zone);
  var b = wienWanduhrFelder(endeMs - 24 * 3600000, zone);
  if (a.monat0 === b.monat0) return a.tag + ".-" + b.tag + ". " + MONATE_CS_GEN[b.monat0];
  return a.tag + ". " + MONATE_CS_GEN[a.monat0] + " - " + b.tag + ". " + MONATE_CS_GEN[b.monat0];
}

/** „25 min" · „3 h" · „3 h 36 min" - Abkürzungen brauchen keine Mehrzahl (Glossar §2.10). */
function dauerCs(minuten) {
  var m = Math.round(minuten);
  if (m < 60) return m + " min";
  var rest = m % 60;
  return Math.floor(m / 60) + " h" + (rest ? " " + rest + " min" : "");
}

/**
 * „na 1 hodinu" · „na 2 hodiny" · „na 5 hodin" · „na 1,5 hodiny" - nach „na"
 * der Akkusativ, alle vier Formen (Glossar §2.11).
 */
function formatStundenCs(ms) {
  var stunden = Math.round((ms / 3600000) * 10) / 10;
  return csForm(stunden, "# hodinu", "# hodiny", "# hodiny", "# hodin");
}

/** Die Wochenziel-Zelle tschechisch: „45 min (cíl: 60 min)" (+ „ ✓"), „prominuto", „týden bez cíle", „bez cíle". */
function wochenzielZellenTextCs(zeile) {
  if (!zeile.hatZiel) return "bez cíle";
  if (zeile.erlassen) return "prominuto";
  if (!zeile.zielwoche) return "týden bez cíle";
  var basis = Math.round(zeile.erfuelltMin) + " min (cíl: " + Math.round(zeile.zielMin) + " min)";
  return zeile.offenMin <= 0 ? basis + " ✓" : basis;
}

/** Die Schuljahr-Zelle tschechisch: „87 %" (geschütztes Leerzeichen) oder „-". */
function schuljahrZellenTextCs(anteil) {
  return anteil === null || anteil === undefined ? "-" : Math.round(anteil * 100) + " %";
}

/** Die Nachholen-Zelle tschechisch: „15 min k dohnání", sonst leer (Glossar §2.6). */
function nachholenZellenTextCs(zeile) {
  var min = zeile.nachholenOffenMin;
  if (min === null || min === undefined || !(min > 0)) return "";
  return Math.round(min) + " min k dohnání";
}

/** Der Wochenbericht tschechisch - dieselbe reine Funktion, derselbe Aufbau wie {@link berichtHtml}. */
function berichtHtmlCs(daten) {
  var klasse = daten.klasse;
  var wocheStartMsWert = daten.wocheStartMs;
  // Z1: die Woche in der Zone der Lehrkraft (`daten.zeitzone`, ohne: Wien).
  var zone = daten.zeitzone;
  var wocheEndeMsWert = wochenStartVerschobenMs(wocheStartMsWert, 1, zone);
  var zeilen = daten.zeilen || [];
  var spanne = wocheSpanneCs(wocheStartMsWert, wocheEndeMsWert, zone);

  var subject = "Týdenní přehled z aplikace Tastenflow - třída " + klasse + " (" + spanne + ")";

  var aktiv = 0;
  var minutenSumme = 0;
  var zielwochenGesamt = 0;
  var zielwochenErreicht = 0;
  var zeilenHtml = "";
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    var geuebtGerundet = Math.round(z.geuebtMin);
    if (geuebtGerundet > 0 || z.tage > 0) {
      aktiv++;
      minutenSumme += geuebtGerundet;
    }
    if (z.zielwoche) {
      zielwochenGesamt++;
      if (z.offenMin <= 0) zielwochenErreicht++;
    }
    zeilenHtml +=
      "<tr>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(z.name) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + geuebtGerundet + " min</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + (z.tage || 0) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.treffsicherheit || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(z.stufe || "-") + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + escHtml(wochenzielZellenTextCs(z)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(schuljahrZellenTextCs(z.schuljahrAnteil)) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + escHtml(nachholenZellenTextCs(z)) + "</td>" +
      "</tr>";
  }

  var v = daten.ortVon;
  var b = daten.ortBis;
  // Klasse mit Kopfwort, Datum und Uhrzeit nach einem Doppelpunkt; die Zeilen
  // ohne Schlusspunkt, damit keine Uhrzeit als Ordnungszahl gelesen wird.
  var intro =
    v && b
      ? "<p>Týdenní přehled pro třídu <b>" + escHtml(klasse) + "</b><br>" +
        "Období: " +
        WOCHENTAGE_CS[v.wochentag] + " " + v.tag + ". " + MONATE_CS_GEN[v.monat0] + ", " + uhrCs(v) +
        " - " +
        WOCHENTAGE_CS[b.wochentag] + " " + b.tag + ". " + MONATE_CS_GEN[b.monat0] + ", " + uhrCs(b) +
        zonenZusatz(v, "cs") + "<br>" +
        "Začátek týdne: " + WOCHENTAGE_CS[v.wochentag] + ", " + uhrCs(v) + "</p>"
      : "<p>Týdenní přehled pro třídu <b>" + escHtml(klasse) + "</b><br>" +
        "Období: " + datumCs(wocheStartMsWert, zone) + ", 8:00 - " + datumCs(wocheEndeMsWert, zone) +
        ", 8:00 (středoevropský čas)<br>" +
        "Začátek týdne: " + WOCHENTAGE_CS[0] + ", 8:00</p>";

  // Zahlen nach Doppelpunkt, „9 ze 12" über zZeCs - ohne Verb, das ein
  // Geschlecht trüge (Regel 2).
  var zusammenfassung =
    "Žáci, kteří tento týden cvičili: " + aktiv + " " + zZeCs(zeilen.length) + " " + zeilen.length + "<br>" +
    "Celkový čas cvičení: " + dauerCs(minutenSumme);
  if (zielwochenGesamt > 0) {
    zusammenfassung +=
      "<br>Týdenní cíl splněn: " + zielwochenErreicht + " " + zZeCs(zielwochenGesamt) + " " +
      zielwochenGesamt + " (počítají se jen žáci s týdenním cílem)";
  }
  if (daten.gesperrtMs > 0) {
    zusammenfassung +=
      "<br>Tento týden byl cíl pozastaven na " + formatStundenCs(daten.gesperrtMs) +
      " - cvičení v této době se do týdenního cíle nepočítá.";
  }

  var linkZeile = daten.klassenLink
    ? '<p><a href="' + escHtml(daten.klassenLink) + '">Otevřít třídu ' + escHtml(klasse) + "</a></p>"
    : "";

  var html =
    '<div lang="cs">' +
    intro +
    "<p>" + zusammenfassung + "</p>" +
    '<table style="border-collapse:collapse;font-size:14px">' +
    '<thead><tr style="text-align:left">' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Jméno</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Čas cvičení</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Dny</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Přesnost</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Úroveň obtížnosti</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Týdenní cíl</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Školní rok</th>' +
    '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">K dohnání</th>' +
    "</tr></thead><tbody>" + zeilenHtml + "</tbody></table>" +
    linkZeile +
    (daten.fussHtml || "") +
    "</div>";

  return { subject: subject, html: html };
}

// Export nur im require()-Kontext; beim Auto-Laden durch PocketBase gibt es
// kein `module` (sonst „module is not defined"). Muster wie tt_events_pack_lib.
if (typeof module !== "undefined") {
  module.exports = {
    wienOffsetMs: wienOffsetMs,
    // Z1: die Zone des Kontos (siehe „Welche Zone wo gilt")
    istWienerUhr: istWienerUhr,
    versatzMs: versatzMs,
    wochenStartMs: wochenStartMs,
    isoWochenKey: isoWochenKey,
    naechsteWocheKey: naechsteWocheKey,
    // W5: der volle Wochenziel-Zwilling + die Wochenbericht-Mail
    wochenStartVerschobenMs: wochenStartVerschobenMs,
    uebungstagSchluesselMs: uebungstagSchluesselMs,
    ACTIVE_TIME_SINCE_MS_UTC: ACTIVE_TIME_SINCE_MS_UTC,
    UMSTELLUNG_WOCHE: UMSTELLUNG_WOCHE,
    buildDayPractice: buildDayPractice,
    minutenDerWoche: minutenDerWoche,
    tageInWoche: tageInWoche,
    wochenAnfaengeZwischen: wochenAnfaengeZwischen,
    kindWochenziel: kindWochenziel,
    zielFuerWoche: zielFuerWoche,
    istZielwoche: istZielwoche,
    inGesperrterZeit: inGesperrterZeit,
    wochenErgebnisse: wochenErgebnisse,
    erfuellungProzent: erfuellungProzent,
    wochenStartFuerSchluessel: wochenStartFuerSchluessel,
    wochenGeschichte: wochenGeschichte,
    schuljahrGrenzenMs: schuljahrGrenzenMs,
    ueberlappteGesperrteZeitMs: ueberlappteGesperrteZeitMs,
    berichtHtml: berichtHtml,
    wochenzielZellenText: wochenzielZellenText,
    schuljahrZellenText: schuljahrZellenText,
    nachholenZellenText: nachholenZellenText,
    formatStunden: formatStunden,
    fmtTagMonat: fmtTagMonat,
    wochenNummerAusSchluessel: wochenNummerAusSchluessel,
    escHtml: escHtml,
    // EN9: die englische Fassung und ihre Bausteine
    berichtHtmlEn: berichtHtmlEn,
    wochenzielZellenTextEn: wochenzielZellenTextEn,
    schuljahrZellenTextEn: schuljahrZellenTextEn,
    nachholenZellenTextEn: nachholenZellenTextEn,
    formatStundenEn: formatStundenEn,
    datumEn: datumEn,
    kurzDatumEn: kurzDatumEn,
    // E11c: die französische Fassung und ihre Bausteine
    berichtHtmlFr: berichtHtmlFr,
    wochenzielZellenTextFr: wochenzielZellenTextFr,
    schuljahrZellenTextFr: schuljahrZellenTextFr,
    nachholenZellenTextFr: nachholenZellenTextFr,
    formatStundenFr: formatStundenFr,
    datumFr: datumFr,
    kurzDatumFr: kurzDatumFr,
    // ES-M: die spanische Fassung und ihre Bausteine
    berichtHtmlEs: berichtHtmlEs,
    wochenzielZellenTextEs: wochenzielZellenTextEs,
    schuljahrZellenTextEs: schuljahrZellenTextEs,
    nachholenZellenTextEs: nachholenZellenTextEs,
    formatStundenEs: formatStundenEs,
    datumEs: datumEs,
    kurzDatumEs: kurzDatumEs,
    // O-IT: die italienische Fassung und ihre Bausteine
    berichtHtmlIt: berichtHtmlIt,
    wochenzielZellenTextIt: wochenzielZellenTextIt,
    schuljahrZellenTextIt: schuljahrZellenTextIt,
    nachholenZellenTextIt: nachholenZellenTextIt,
    formatStundenIt: formatStundenIt,
    datumIt: datumIt,
    kurzDatumIt: kurzDatumIt,
    // O-PL: die polnische Fassung und ihre Bausteine
    berichtHtmlPl: berichtHtmlPl,
    wochenzielZellenTextPl: wochenzielZellenTextPl,
    schuljahrZellenTextPl: schuljahrZellenTextPl,
    nachholenZellenTextPl: nachholenZellenTextPl,
    formatStundenPl: formatStundenPl,
    datumPl: datumPl,
    wocheSpannePl: wocheSpannePl,
    plKategorie: plKategorie,
    WOCHENTAG_AM_PL: WOCHENTAG_AM_PL,
    // O-TR: die türkische Fassung und ihre Bausteine
    berichtHtmlTr: berichtHtmlTr,
    wochenzielZellenTextTr: wochenzielZellenTextTr,
    schuljahrZellenTextTr: schuljahrZellenTextTr,
    nachholenZellenTextTr: nachholenZellenTextTr,
    formatStundenTr: formatStundenTr,
    dauerTr: dauerTr,
    datumTr: datumTr,
    uhrTr: uhrTr,
    wocheSpanneTr: wocheSpanneTr,
    // O-CS: die tschechische Fassung und ihre Bausteine
    berichtHtmlCs: berichtHtmlCs,
    wochenzielZellenTextCs: wochenzielZellenTextCs,
    schuljahrZellenTextCs: schuljahrZellenTextCs,
    nachholenZellenTextCs: nachholenZellenTextCs,
    formatStundenCs: formatStundenCs,
    dauerCs: dauerCs,
    datumCs: datumCs,
    uhrCs: uhrCs,
    wocheSpanneCs: wocheSpanneCs,
    csKategorie: csKategorie,
    csForm: csForm,
    zZeCs: zZeCs,
  };
}
