/// <reference path="../pb_data/types.d.ts" />
//
// Die Zeitzone der Lehrkraft in den Mails (D2, 28.09.2026)
// ==========================================================================
// Die Mails von Tastenflow (Wochenbericht, Tippchallenge) nannten Uhrzeiten
// bis D2 in WIENER Zeit - in Mexiko-Stadt stand „8:00", gemeint war 0:00
// Ortszeit. Seit D2 merkt die App die Zeitzone des Geräts am Konto
// (`tt_teachers.zeitzone`, `tt_pupils.zeitzone`, IANA-Name wie
// „America/Mexico_City"), und diese Datei rechnet einen echten Zeitpunkt in
// die Wanduhr DIESER Zone um.
//
// ── Warum eine eigene Tabelle statt `Intl`/`toLocaleString` ─────────────────
// goja (die JS-Laufzeit von PocketBase) hat KEIN `Intl` und keine
// Zeitzonen-Datenbank: `toLocaleString("es-MX", { timeZone: … })` liefert
// dort die Server-Uhr (UTC) oder wirft (siehe `tt_wochenziel_lib.pb.js`,
// Dateikopf: „die hat goja nicht"). Darum hier - wie dort für Wien - reine
// UTC-Arithmetik: je Zone der Normal-Versatz und, wo es eine gibt, die
// Sommerzeit-REGEL (EU, USA/Kanada, Kuba, Chile, Australien Süd-Ost,
// Neuseeland). Stand der Regeln: September 2026 (Mexiko ohne Sommerzeit seit
// 2022, Paraguay fest UTC-3 seit Oktober 2024).
//
// ── Unbekannte Zone ─────────────────────────────────────────────────────────
// Steht eine Zone nicht in der Tabelle (oder hat das Konto keine), gilt
// WIEN wie bisher - und die Mail sagt dazu, dass es mitteleuropäische Zeit ist
// (`lokal: false`). Eine erfundene Uhrzeit wäre schlimmer als eine richtig
// benannte fremde.
//
// Export nur im require()-Kontext ([[reference_pocketbase_hook_scope]]) -
// beim Auto-Laden als Hook gibt es kein `module`. Jeder Handler holt die
// Datei INNERHALB seines Rückrufs per require().

var MINUTE_MS_ZZ = 60000;
var STUNDE_MS_ZZ = 3600000;

// Sommerzeit-Regeln. `s`/`e`: [Monat 0-11, n-ter Sonntag (1-4, -1 = letzter,
// 100 + T = erster Sonntag am oder nach dem T., wie „Sun>=2" in tzdata),
// Stunde]. Ohne `utc` ist die Stunde LOKAL (Beginn: Normalzeit, Ende:
// Sommerzeit), mit `utc` UTC. `sued`: Sommerzeit über den Jahreswechsel.
var REGELN_ZZ = {
  eu: { s: [2, -1, 1], e: [9, -1, 1], utc: true },
  us: { s: [2, 2, 2], e: [10, 1, 2] },
  cu: { s: [2, 2, 0], e: [10, 1, 1] },
  // Chile (tzdata „Rule Chile 2023 max": Sep Sun>=2 4:00u, Apr Sun>=2 3:00u)
  cl: { s: [8, 102, 4], e: [3, 102, 3], utc: true, sued: true },
  au: { s: [9, 1, 2], e: [3, 1, 3], sued: true },
  nz: { s: [8, -1, 2], e: [3, 1, 3], sued: true },
};

// Zone → [Normal-Versatz in Minuten, Regel oder ""].
var ZONEN_ZZ = {
  UTC: [0, ""],
  "Etc/UTC": [0, ""],
  "Etc/GMT": [0, ""],
  // Europa (EU-Regel, wo nichts anderes steht - siehe `zoneRegel`)
  "Europe/London": [0, "eu"],
  "Europe/Dublin": [0, "eu"],
  "Europe/Lisbon": [0, "eu"],
  "Atlantic/Canary": [0, "eu"],
  "Atlantic/Madeira": [0, "eu"],
  "Atlantic/Faroe": [0, "eu"],
  "Atlantic/Azores": [-60, "eu"],
  "Atlantic/Reykjavik": [0, ""],
  "Europe/Athens": [120, "eu"],
  "Europe/Helsinki": [120, "eu"],
  "Europe/Kiev": [120, "eu"],
  "Europe/Kyiv": [120, "eu"],
  "Europe/Riga": [120, "eu"],
  "Europe/Tallinn": [120, "eu"],
  "Europe/Vilnius": [120, "eu"],
  "Europe/Sofia": [120, "eu"],
  "Europe/Bucharest": [120, "eu"],
  "Europe/Chisinau": [120, "eu"],
  "Europe/Mariehamn": [120, "eu"],
  "Europe/Kaliningrad": [120, ""],
  "Europe/Moscow": [180, ""],
  "Europe/Minsk": [180, ""],
  "Europe/Istanbul": [180, ""],
  "Europe/Simferopol": [180, ""],
  "Europe/Volgograd": [180, ""],
  "Europe/Kirov": [180, ""],
  "Europe/Samara": [240, ""],
  "Europe/Astrakhan": [240, ""],
  "Europe/Saratov": [240, ""],
  "Europe/Ulyanovsk": [240, ""],
  // Amerika - Mexiko (seit 2022 ohne Sommerzeit, ausser an der US-Grenze)
  "America/Mexico_City": [-360, ""],
  "America/Monterrey": [-360, ""],
  "America/Merida": [-360, ""],
  "America/Chihuahua": [-360, ""],
  "America/Bahia_Banderas": [-360, ""],
  "America/Cancun": [-300, ""],
  "America/Mazatlan": [-420, ""],
  "America/Hermosillo": [-420, ""],
  "America/Tijuana": [-480, "us"],
  "America/Ciudad_Juarez": [-420, "us"],
  "America/Ojinaga": [-360, "us"],
  "America/Matamoros": [-360, "us"],
  // Mittelamerika und Karibik
  "America/Guatemala": [-360, ""],
  "America/Tegucigalpa": [-360, ""],
  "America/El_Salvador": [-360, ""],
  "America/Managua": [-360, ""],
  "America/Costa_Rica": [-360, ""],
  "America/Belize": [-360, ""],
  "America/Panama": [-300, ""],
  "America/Havana": [-300, "cu"],
  "America/Santo_Domingo": [-240, ""],
  "America/Puerto_Rico": [-240, ""],
  "America/Jamaica": [-300, ""],
  // Südamerika
  "America/Bogota": [-300, ""],
  "America/Lima": [-300, ""],
  "America/Guayaquil": [-300, ""],
  "Pacific/Galapagos": [-360, ""],
  "America/Caracas": [-240, ""],
  "America/La_Paz": [-240, ""],
  "America/Asuncion": [-180, ""],
  "America/Montevideo": [-180, ""],
  "America/Buenos_Aires": [-180, ""],
  "America/Sao_Paulo": [-180, ""],
  "America/Santiago": [-240, "cl"],
  "Pacific/Easter": [-360, "cl"],
  "America/Punta_Arenas": [-180, ""],
  // USA und Kanada
  "America/New_York": [-300, "us"],
  "America/Detroit": [-300, "us"],
  "America/Toronto": [-300, "us"],
  "America/Montreal": [-300, "us"],
  "America/Chicago": [-360, "us"],
  "America/Winnipeg": [-360, "us"],
  "America/Denver": [-420, "us"],
  "America/Edmonton": [-420, "us"],
  "America/Boise": [-420, "us"],
  "America/Phoenix": [-420, ""],
  "America/Los_Angeles": [-480, "us"],
  "America/Vancouver": [-480, "us"],
  "America/Anchorage": [-540, "us"],
  "America/Halifax": [-240, "us"],
  "America/St_Johns": [-210, "us"],
  "America/Regina": [-360, ""],
  "Pacific/Honolulu": [-600, ""],
  // Afrika
  "Africa/Johannesburg": [120, ""],
  "Africa/Lagos": [60, ""],
  "Africa/Algiers": [60, ""],
  "Africa/Tunis": [60, ""],
  "Africa/Kinshasa": [60, ""],
  "Africa/Douala": [60, ""],
  "Africa/Nairobi": [180, ""],
  "Africa/Addis_Ababa": [180, ""],
  "Africa/Accra": [0, ""],
  "Africa/Abidjan": [0, ""],
  "Africa/Dakar": [0, ""],
  "Africa/Malabo": [60, ""],
  // Asien
  "Asia/Tokyo": [540, ""],
  "Asia/Seoul": [540, ""],
  "Asia/Shanghai": [480, ""],
  "Asia/Hong_Kong": [480, ""],
  "Asia/Taipei": [480, ""],
  "Asia/Singapore": [480, ""],
  "Asia/Manila": [480, ""],
  "Asia/Bangkok": [420, ""],
  "Asia/Jakarta": [420, ""],
  "Asia/Kolkata": [330, ""],
  "Asia/Calcutta": [330, ""],
  "Asia/Kathmandu": [345, ""],
  "Asia/Karachi": [300, ""],
  "Asia/Dubai": [240, ""],
  "Asia/Tehran": [210, ""],
  "Asia/Riyadh": [180, ""],
  "Asia/Qatar": [180, ""],
  // Ozeanien
  "Australia/Sydney": [600, "au"],
  "Australia/Melbourne": [600, "au"],
  "Australia/Canberra": [600, "au"],
  "Australia/Hobart": [600, "au"],
  "Australia/Adelaide": [570, "au"],
  "Australia/Broken_Hill": [570, "au"],
  "Australia/Brisbane": [600, ""],
  "Australia/Darwin": [570, ""],
  "Australia/Perth": [480, ""],
  "Pacific/Auckland": [720, "nz"],
};

/** Normal-Versatz und Regel einer Zone - `null`, wenn sie unbekannt ist. */
function zoneRegel(zone) {
  if (typeof zone !== "string" || !zone) return null;
  if (Object.prototype.hasOwnProperty.call(ZONEN_ZZ, zone)) {
    var z = ZONEN_ZZ[zone];
    return { std: z[0], regel: z[1] ? REGELN_ZZ[z[1]] : null };
  }
  // Ganze Familien, die sich eine Regel teilen.
  if (zone.indexOf("America/Argentina/") === 0) return { std: -180, regel: null };
  if (zone.indexOf("America/Indiana/") === 0 || zone.indexOf("America/Kentucky/") === 0)
    return { std: -300, regel: REGELN_ZZ.us };
  if (zone.indexOf("America/North_Dakota/") === 0) return { std: -360, regel: REGELN_ZZ.us };
  // Übrige EU-Hauptstädte: Mitteleuropäische Zeit mit EU-Regel (Wien, Berlin,
  // Zürich, Madrid, Paris, Rom, Brüssel, Luxemburg …). Die Ausnahmen stehen
  // oben ausdrücklich in der Tabelle.
  if (zone.indexOf("Europe/") === 0) return { std: 60, regel: REGELN_ZZ.eu };
  // „Etc/GMT+5" heisst UTC-5 (das Vorzeichen ist in dieser Familie umgedreht).
  var m = /^Etc\/GMT([+-])(\d{1,2})$/.exec(zone);
  if (m) return { std: (m[1] === "+" ? -1 : 1) * Number(m[2]) * 60, regel: null };
  return null;
}

/** Der n-te (1-4), letzte (-1) oder erste ab Tag T (100 + T) Sonntag eines Monats - der Kalendertag. */
function sonntagImMonatZZ(jahr, monat0, n) {
  if (n >= 100) {
    var abTag = n - 100;
    var wtAb = new Date(Date.UTC(jahr, monat0, abTag)).getUTCDay();
    return abTag + ((7 - wtAb) % 7);
  }
  if (n > 0) {
    var ersterWt = new Date(Date.UTC(jahr, monat0, 1)).getUTCDay(); // 0 = Sonntag
    var ersterSonntag = 1 + ((7 - ersterWt) % 7);
    return ersterSonntag + (n - 1) * 7;
  }
  var letzterTag = new Date(Date.UTC(jahr, monat0 + 1, 0)).getUTCDate();
  var wtLetzter = new Date(Date.UTC(jahr, monat0, letzterTag)).getUTCDay();
  return letzterTag - wtLetzter;
}

/** Ein Umstellzeitpunkt einer Regel als echter UTC-Zeitpunkt. */
function umstellungMs(jahr, punkt, utc, versatzMin) {
  var tag = sonntagImMonatZZ(jahr, punkt[0], punkt[1]);
  var naiv = Date.UTC(jahr, punkt[0], tag, punkt[2], 0, 0, 0);
  return utc ? naiv : naiv - versatzMin * MINUTE_MS_ZZ;
}

/**
 * Der UTC-Versatz einer Zone zu einem echten Zeitpunkt, in ms - `null`, wenn
 * die Zone unbekannt ist.
 */
function zonenVersatzMs(utcMs, zone) {
  var z = zoneRegel(zone);
  if (!z) return null;
  var std = z.std * MINUTE_MS_ZZ;
  var r = z.regel;
  if (!r) return std;
  var jahr = new Date(utcMs + std).getUTCFullYear();
  var beginn = umstellungMs(jahr, r.s, r.utc, z.std);
  var ende = umstellungMs(jahr, r.e, r.utc, z.std + 60);
  var sommer = r.sued ? utcMs >= beginn || utcMs < ende : utcMs >= beginn && utcMs < ende;
  return sommer ? std + STUNDE_MS_ZZ : std;
}

/**
 * Die Wanduhr-Felder eines echten Zeitpunkts in der Zone des Kontos (Montag =
 * Wochentag 0, wie `wienWanduhrFelder` in `tt_wochenziel_lib.pb.js`).
 * `lokal: false` heisst: Zone fehlt oder ist unbekannt - die Felder sind
 * WIENER Zeit, und die Mail sagt das dazu.
 */
function ortsFelder(utcMs, zone) {
  var versatz = zonenVersatzMs(utcMs, zone);
  var lokal = versatz !== null;
  if (!lokal) versatz = zonenVersatzMs(utcMs, "Europe/Vienna");
  var d = new Date(utcMs + versatz);
  return {
    jahr: d.getUTCFullYear(),
    monat0: d.getUTCMonth(),
    tag: d.getUTCDate(),
    stunde: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    wochentag: (d.getUTCDay() + 6) % 7,
    lokal: lokal,
  };
}

/**
 * Derselbe Zeitpunkt als NAIVER Wanduhr-Wert (mit UTC-Gettern gelesen zeigt
 * er die Ortszeit) - so erwartet ihn `schreibprobeMail` (`fmtZeit`).
 */
function ortsZeit(utcMs, zone) {
  var versatz = zonenVersatzMs(utcMs, zone);
  var lokal = versatz !== null;
  if (!lokal) versatz = zonenVersatzMs(utcMs, "Europe/Vienna");
  return { naivMs: utcMs + versatz, lokal: lokal };
}

/** Die gemerkte Zeitzone eines Kontos (`zeitzone`) - `""`, wenn keine. */
function zeitzoneVon(record) {
  try {
    if (!record) return "";
    var z = record.getString ? record.getString("zeitzone") : record.zeitzone;
    return typeof z === "string" ? z : "";
  } catch (_) {
    return "";
  }
}

if (typeof module !== "undefined") {
  module.exports = {
    zoneRegel: zoneRegel,
    zonenVersatzMs: zonenVersatzMs,
    ortsFelder: ortsFelder,
    ortsZeit: ortsZeit,
    zeitzoneVon: zeitzoneVon,
  };
}
