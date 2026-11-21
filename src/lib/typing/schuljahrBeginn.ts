/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ DER BEGINN DES SCHULJAHRES - JE KLASSE (D2, 28.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Bis hierher begann das Schuljahr für JEDE Klasse fest am 1. August
 * (`jahreskarte.ts`, F14). Für Lateinamerika stimmt das nicht: Im Cono Sur
 * beginnt es im Februar/März, in Mittelamerika im Januar/Februar, in Ecuador
 * (Costa) im Mai. Eine Klasse in Buenos Aires hätte ihr Schuljahr mitten im
 * Unterricht gewechselt, und ihre Schulstufe wäre im August statt im März
 * weitergezählt worden.
 *
 * ── Was hier steht ────────────────────────────────────────────────────────
 *  • der MONAT, in dem das Schuljahr beginnt (1 = Januar … 12 = Dezember) -
 *    gerechnet wird immer ab dem ERSTEN dieses Monats, 00:00 Ortszeit;
 *  • die Vorgabe je Land (aus der Region des Browsers der Lehrkraft);
 *  • die Monatsnamen in den vier Bedienungssprachen (für das Auswahlfeld).
 *
 * ── Gespeichert ───────────────────────────────────────────────────────────
 * In `tt_classes.settings.schuljahrBeginn` (JSON, KEINE Schema-Änderung, siehe
 * `TypingClass.settings`). Fehlt der Wert - jede Klasse, die vor D2 angelegt
 * wurde -, gilt der 1. August wie bisher. Byte für Byte.
 *
 * ── Die Vorgabe je Land ───────────────────────────────────────────────────
 * Gewählt ist der Monat, dessen Erster sicher in den grossen Ferien VOR dem
 * ersten Schultag liegt - die Grenze soll nie mitten in den Unterricht
 * fallen. Recherchiert am 27./28.09.2026 (Quellen im Befund
 * `BEFUND-2026-09-28-D2-SCHULJAHR-ZEITZONE.md`, §1):
 *
 *   AR 25.02. (Primaria) / 02.03.   ⇒ Februar
 *   CL 04.03.                        ⇒ Februar
 *   UY 02.03.                        ⇒ Februar
 *   PY 23.02.                        ⇒ Februar
 *   PE 16.03.                        ⇒ Februar
 *   BO 02.02.                        ⇒ Februar (Erster = Ferien)
 *   BR (Februar)                     ⇒ Februar
 *   GT 02.02. · HN 02.02. · SV 02.02. · NI 26.01.  ⇒ Januar
 *   CR 23.02. · PA 02.03.            ⇒ Februar
 *   CO Kalender A: Ende Januar       ⇒ Januar (Kalender B: August - von Hand)
 *   EC Sierra 01.09. / Costa 04.05.  ⇒ August (Costa: April - von Hand, die
 *                                      Region verrät das Land, nicht den Landesteil)
 *   MX 31.08. · DO 24.08. · VE 14.09. · CU 01.09. · PR 06.08. ⇒ August
 *   ES 07.-15.09.                    ⇒ August
 *   AU · NZ · ZA (Ende Januar/Februar) ⇒ Januar
 *   alle übrigen (DACH, Frankreich, Belgien, Kanada, UK, USA …) ⇒ August
 */

/** Die Vorgabe, wenn nichts anderes bekannt ist: August - wie seit F14. */
export const SCHULJAHR_BEGINN_VORGABE = 8;

/** Ist `wert` ein gültiger Monat 1-12? */
export function istSchuljahrBeginn(wert: unknown): wert is number {
  return typeof wert === "number" && Number.isInteger(wert) && wert >= 1 && wert <= 12;
}

/** Ein roher Wert als Monat 1-12 - alles Ungültige wird zur Vorgabe (August). */
export function schuljahrBeginnOderVorgabe(wert: unknown): number {
  return istSchuljahrBeginn(wert) ? wert : SCHULJAHR_BEGINN_VORGABE;
}

/**
 * Der Beginn des Schuljahres einer Klasse (1-12). Gelesen aus
 * `settings.schuljahrBeginn`; ohne Wert der 1. August.
 */
export function schuljahrBeginnVon(
  cls: { settings?: { schuljahrBeginn?: unknown } | null } | null | undefined,
): number {
  return schuljahrBeginnOderVorgabe(cls?.settings?.schuljahrBeginn);
}

/** Die Vorgabe je Land (ISO 3166-1 alpha-2, gross) - nur die Abweichungen von August. */
const BEGINN_JE_LAND: Readonly<Record<string, number>> = {
  // Cono Sur, Anden, Brasilien
  AR: 2,
  CL: 2,
  UY: 2,
  PY: 2,
  PE: 2,
  BO: 2,
  BR: 2,
  // Mittelamerika
  GT: 1,
  HN: 1,
  SV: 1,
  NI: 1,
  CR: 2,
  PA: 2,
  // Kolumbien - Kalender A (öffentliche Schulen, fast überall)
  CO: 1,
  // Südhalbkugel, englischsprachig
  AU: 1,
  NZ: 1,
  ZA: 1,
};

/** Der Beginn des Schuljahres, der in einem Land üblich ist. Unbekannt ⇒ August. */
export function schuljahrBeginnFuerLand(land: string | null | undefined): number {
  if (!land) return SCHULJAHR_BEGINN_VORGABE;
  return BEGINN_JE_LAND[land.toUpperCase()] ?? SCHULJAHR_BEGINN_VORGABE;
}

/**
 * Wenige Zeitzonen, die ein Land eindeutig verraten - nur für den Fall, dass
 * die Sprach-Einstellung des Browsers KEINE Region trägt (nur „es", nicht
 * „es-AR"). Bewusst nur die Länder mit abweichender Vorgabe.
 */
const LAND_JE_ZEITZONE: Readonly<Record<string, string>> = {
  "America/Santiago": "CL",
  "America/Punta_Arenas": "CL",
  "Pacific/Easter": "CL",
  "America/Montevideo": "UY",
  "America/Asuncion": "PY",
  "America/Lima": "PE",
  "America/La_Paz": "BO",
  "America/Sao_Paulo": "BR",
  "America/Guatemala": "GT",
  "America/Tegucigalpa": "HN",
  "America/El_Salvador": "SV",
  "America/Managua": "NI",
  "America/Costa_Rica": "CR",
  "America/Panama": "PA",
  "America/Bogota": "CO",
  "Pacific/Auckland": "NZ",
  "Africa/Johannesburg": "ZA",
};

/**
 * Das Land aus Sprach-Kennungen („es-AR", „de-AT") und - ersatzweise - aus
 * der Zeitzone. `null`, wenn keines erkennbar ist.
 */
export function landAusGeraet(
  sprachen: readonly string[] | null | undefined,
  zeitzone: string | null | undefined,
): string | null {
  for (const s of sprachen ?? []) {
    // „es-419" (Lateinamerika allgemein) ist keine Region eines Landes.
    const m = /^[a-z]{2,3}(?:-[A-Za-z]{4})?-([A-Za-z]{2})\b/.exec(String(s));
    if (m) return m[1].toUpperCase();
  }
  if (zeitzone) {
    if (zeitzone.startsWith("America/Argentina/") || zeitzone === "America/Buenos_Aires")
      return "AR";
    if (zeitzone.startsWith("Australia/")) return "AU";
    if (LAND_JE_ZEITZONE[zeitzone]) return LAND_JE_ZEITZONE[zeitzone];
  }
  return null;
}

/**
 * Die Vorgabe für eine NEUE Klasse - aus dem Gerät der Lehrkraft.
 * Ohne Browser (Test, Server) ⇒ August.
 */
export function schuljahrBeginnVorgabeDesGeraets(): number {
  try {
    const sprachen =
      typeof navigator !== "undefined"
        ? navigator.languages?.length
          ? navigator.languages
          : navigator.language
            ? [navigator.language]
            : []
        : [];
    let zone: string | null = null;
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
    } catch {
      zone = null;
    }
    return schuljahrBeginnFuerLand(landAusGeraet(sprachen, zone));
  } catch {
    return SCHULJAHR_BEGINN_VORGABE;
  }
}

/** Die Monatsnamen für das Auswahlfeld „Beginn des Schuljahres". */
const MONATE_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export const MONATE_JE_SPRACHE = {
  de: [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ],
  en: MONATE_EN,
  fr: [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "aout", "septembre", "octobre", "novembre", "décembre",
  ],
  es: [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ],
  // ★ O-IT (02.10.2026): klein wie alle Monate im Italienischen (Glossar Regel 9).
  it: [
    "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
    "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
  ],
  // ★ O-PL (02.10.2026): klein und im Nominativ (Glossar Regel 10, §2.10) -
  // sie stehen allein im Auswahlfeld; im Datum gilt der Genitiv aus Intl.
  pl: [
    "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
    "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień",
  ],
  // ★ O-TR (02.10.2026): gross wie `Intl` "tr-TR" sie schreibt (Glossar §2.10).
  tr: [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ],
  // ★ O-CS (03.10.2026): klein und im Nominativ (Glossar Regel 9, §2.10) - sie
  // stehen allein im Auswahlfeld; im Datum gilt der Genitiv aus Intl („1. září").
  cs: [
    "leden", "únor", "březen", "duben", "květen", "červen",
    "červenec", "srpen", "září", "říjen", "listopad", "prosinec",
  ],
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: [
    "януари", "февруари", "март", "април", "май", "юни",
    "юли", "август", "септември", "октомври", "ноември", "декември",
  ],
  el: [
    "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος",
    "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος",
  ],
  hu: [
    "január", "február", "március", "április", "május", "június",
    "július", "augusztus", "szeptember", "október", "november", "december",
  ],
  nl: [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
  ],
  pt: [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ],
  br: [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ],
  ro: [
    "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
    "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
  ],
  sv: [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december",
  ],
  uk: [
    "січень", "лютий", "березень", "квітень", "травень", "червень",
    "липень", "серпень", "вересень", "жовтень", "листопад", "грудень",
  ],
} as const;
