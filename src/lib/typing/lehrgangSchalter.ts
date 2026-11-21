/**
 * Die Schalter der Lehrgänge (englisch, französisch, spanisch, italienisch,
 * polnisch, türkisch, tschechisch) - aus
 * `lernweg.ts` herausgelöst (28.09.2026), Inhalt unverändert; `lernweg.ts`
 * reicht alles weiter, jeder bisherige Import gilt.
 *
 * WARUM EINE EIGENE DATEI: `TastenflowSprachBereich` hängt über JEDER Seite der
 * Plattform (`App.tsx`) und fragt diese Schalter. Aus `lernweg.ts` hätte er
 * `letters.ts` samt Tastaturen mitgezogen - in den gemeinsamen Kern, den jede
 * Seite lädt. Jede Änderung am Lehrgang hätte dann JEDE Seite jeder App neu
 * laden lassen (scripts/buendel-aufteilung.ts). Diese Datei importiert nichts.
 */
// ── Der Schalter für den englischen Lehrgang (seit 25.09.2026: Not-Aus) ─────
//
// ⚠️ Die Namen tragen bewusst „Lehrgang": `tests/tastenflow-sprache-fuer-alle
// .test.tsx` wacht darüber, dass vom ALTEN Probe-Schalter der Bedienung (bis
// 19.09.2026) nichts übrig bleibt, und sucht dafür nach dessen Namen. Dieser
// Schalter hier ist ein neuer - er darf nicht wie der alte heissen.

/**
 * Merker im Browser: `"0"` = der englische Lehrgang ist auf diesem Gerät
 * ausdrücklich ABGESCHALTET (Not-Aus). Jeder andere Wert (auch kein Eintrag)
 * heisst „an" - das ist seit 25.09.2026 die Grundeinstellung.
 */
export const LEHRGANG_PROBE_MERKER = "tastenflow-englisch-lehrgang";

/** Der Adress-Zusatz: `?englisch-lehrgang=0` schaltet aus, `=1` wieder an. */
export const LEHRGANG_PROBE_ADRESSE = "englisch-lehrgang";

/**
 * Ist der englische Lehrgang an? ★ SEIT 25.09.2026 GRUNDEINSTELLUNG AN
 * (Freigabe Johannes): ohne jede Einstellung liefert diese Funktion `true`.
 * `?englisch-lehrgang=0` schaltet ihn ausdrücklich AUS (Not-Aus) und merkt
 * das auf dem Gerät; `?englisch-lehrgang=1` schaltet ein zuvor gemerktes
 * Aus wieder an (dasselbe Muster wie `?bedienung=` in `lib/bedienSprache`).
 *
 * ⚠️ Jeder Zugriff auf `localStorage` in `try/catch` - Safari im privaten
 * Modus wirft schon beim Zugriff. Gesperrter Speicher ⇒ an (die
 * Grundeinstellung gilt dann einfach ungespeichert weiter).
 */
export function englischLehrgangProbeAn(suche?: string): boolean {
  let s = suche;
  if (s === undefined) {
    try {
      s = window.location.search;
    } catch {
      s = "";
    }
  }
  const wert = new URLSearchParams(s ?? "").get(LEHRGANG_PROBE_ADRESSE);
  try {
    if (wert === "1") window.localStorage.setItem(LEHRGANG_PROBE_MERKER, "1");
    else if (wert === "0") window.localStorage.setItem(LEHRGANG_PROBE_MERKER, "0");
  } catch {
    /* Speicher gesperrt - dann gilt nur die Adresse */
  }
  if (wert === "1") return true;
  if (wert === "0") return false;
  try {
    return window.localStorage.getItem(LEHRGANG_PROBE_MERKER) !== "0";
  } catch {
    return true;
  }
}

// ── Der Schalter für den französischen Lehrgang (E2a, 25.09.2026) ──────────
//
// ★ Anders gepolt als der englische Schalter oben: Der englische begann auch
// als Probe-Schalter (default AUS) und wurde erst nach der Freigabe (E10,
// 25.09.2026) auf „default AN, Not-Aus mit =0" umgestellt. Der französische
// Lehrgang hat noch KEINEN Inhalt (nur das Gerüst, E2a) - er bleibt darum
// vorerst „default AUS, Probe mit =1"; die Umstellung auf Not-Aus-Polung
// gehört zu E14 (Freigabe), genau wie beim englischen Weg.

/**
 * Merker im Browser: `"1"` = der französische Lehrgang ist auf diesem Gerät
 * ausdrücklich EINGESCHALTET (Probe). Jeder andere Wert (auch kein Eintrag)
 * heisst „aus" - das Gerüst ist unsichtbar, bis E14 es freigibt.
 * ★ Seit der Freigabe 28.09.2026 umgekehrt: nur `"0"` heisst „aus" (Not-Aus),
 * jeder andere Wert (auch kein Eintrag) „an".
 */
export const LEHRGANG_PROBE_MERKER_FR = "tastenflow-franzoesisch-lehrgang";

/** Die französische Einstiegsadresse `/fr` (und `/fr/`) - schaltet den Lehrgang an (26.09.2026). */
const FRANZOESISCHE_EINSTIEGSADRESSE = /^\/fr\/?$/i;

/** Der Adress-Zusatz: `?franzoesisch-lehrgang=1` schaltet an, `=0` wieder aus. */
export const LEHRGANG_PROBE_ADRESSE_FR = "franzoesisch-lehrgang";

/**
 * Ist der französische Lehrgang an? ★ Seit der Freigabe 28.09.2026 default AN
 * (Not-Aus-Polung wie Englisch; bis dahin „default AUS", siehe Kopf oben) -
 * `?franzoesisch-lehrgang=1` schaltet ihn ausdrücklich AN und merkt das auf
 * dem Gerät; `?franzoesisch-lehrgang=0` schaltet ein zuvor gemerktes An
 * wieder aus (Not-Aus, F16 im Bauplan).
 *
 * ⚠️ Jeder Zugriff auf `localStorage` in `try/catch` - Safari im privaten
 * Modus wirft schon beim Zugriff. Gesperrter Speicher ⇒ an (★ seit
 * 28.09.2026; die Grundeinstellung gilt dann einfach ungespeichert weiter).
 */
export function franzoesischLehrgangProbeAn(suche?: string, pfad?: string): boolean {
  let s = suche;
  let p = pfad;
  if (s === undefined || p === undefined) {
    try {
      if (s === undefined) s = window.location.search;
      if (p === undefined) p = window.location.pathname;
    } catch {
      s = s ?? "";
      p = p ?? "";
    }
  }
  let wert = new URLSearchParams(s ?? "").get(LEHRGANG_PROBE_ADRESSE_FR);
  // ★ 26.09.2026 (Johannes: „/fr darf öffentlich werden", „ja, bau
  // Möglichkeit 1"): Wer über die französische Einstiegsadresse `/fr` kommt,
  // bekommt den französischen Lehrgang - die Adresse wirkt wie
  // `?franzoesisch-lehrgang=1` und merkt es auf dem Gerät. Ein ausdrückliches
  // `=0` in derselben Adresse geht vor (Not-Aus).
  if (wert === null && FRANZOESISCHE_EINSTIEGSADRESSE.test(p ?? "")) wert = "1";
  try {
    if (wert === "1") window.localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "1");
    else if (wert === "0") window.localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "0");
  } catch {
    /* Speicher gesperrt - dann gilt nur die Adresse */
  }
  if (wert === "1") return true;
  if (wert === "0") return false;
  // ★★ 28.09.2026 FREIGABE (Johannes: „Spanisch ist noch nicht live" - dasselbe
  // galt für Französisch): Not-Aus-Polung wie beim Englischen seit E10 -
  // default AN, `?franzoesisch-lehrgang=0` schaltet auf dem Gerät aus.
  try {
    return window.localStorage.getItem(LEHRGANG_PROBE_MERKER_FR) !== "0";
  } catch {
    return true;
  }
}

// ── Der Schalter für den spanischen Lehrgang (ES-F2, 27.09.2026) ───────────
//
// ★ Genauso gepolt wie der französische Schalter bei seinem Gerüst (E2a):
// „default AUS, Probe mit =1" - der spanische Lehrgang hat noch KEINEN
// Inhalt. Die Umstellung auf Not-Aus-Polung (wie beim Englischen) gehört zu
// einer späteren Freigabe-Etappe, nicht zu ES-F2.

/**
 * Merker im Browser: `"1"` = der spanische Lehrgang ist auf diesem Gerät
 * ausdrücklich EINGESCHALTET (Probe). Jeder andere Wert (auch kein Eintrag)
 * heisst „aus" - das Gerüst ist unsichtbar, bis eine spätere Etappe es freigibt.
 * ★ Seit der Freigabe 28.09.2026 umgekehrt: nur `"0"` heisst „aus" (Not-Aus),
 * jeder andere Wert (auch kein Eintrag) „an".
 */
export const LEHRGANG_PROBE_MERKER_ES = "tastenflow-spanisch-lehrgang";

/**
 * Die spanische Einstiegsadresse `/es` (und `/es/`) - SCHARF seit 27.09.2026
 * (Johannes: „ja", wie `/fr` am 26.09.). Wie bei Französisch
 * ({@link franzoesischLehrgangProbeAn}) wertet {@link spanischLehrgangProbeAn}
 * diese Adresse jetzt AUS: wer über `/es` kommt, bekommt den spanischen
 * Lehrgang.
 */
export const SPANISCHE_EINSTIEGSADRESSE = /^\/es\/?$/i;

/** Der Adress-Zusatz: `?spanisch-lehrgang=1` schaltet an, `=0` wieder aus. */
export const LEHRGANG_PROBE_ADRESSE_ES = "spanisch-lehrgang";

/**
 * Ist der spanische Lehrgang an? ★ Seit der Freigabe 28.09.2026 default AN
 * (Not-Aus-Polung wie Englisch; bis dahin „default AUS", siehe Kopf oben) -
 * `?spanisch-lehrgang=1` schaltet ihn ausdrücklich AN und merkt das auf dem
 * Gerät; `?spanisch-lehrgang=0` schaltet ein zuvor gemerktes An wieder aus
 * (Not-Aus).
 *
 * ★ 27.09.2026 (Johannes: „/es darf öffentlich werden", wie `/fr"
 * „Möglichkeit 1"): Wer über die spanische Einstiegsadresse `/es` kommt,
 * bekommt den spanischen Lehrgang - die Adresse wirkt wie
 * `?spanisch-lehrgang=1` und merkt es auf dem Gerät. Ein ausdrückliches `=0`
 * in derselben Adresse geht vor (Not-Aus).
 *
 * ⚠️ Jeder Zugriff auf `localStorage` in `try/catch` - Safari im privaten
 * Modus wirft schon beim Zugriff. Gesperrter Speicher ⇒ an (★ seit
 * 28.09.2026; die Grundeinstellung gilt dann einfach ungespeichert weiter).
 */
export function spanischLehrgangProbeAn(suche?: string, pfad?: string): boolean {
  let s = suche;
  let p = pfad;
  if (s === undefined || p === undefined) {
    try {
      if (s === undefined) s = window.location.search;
      if (p === undefined) p = window.location.pathname;
    } catch {
      s = s ?? "";
      p = p ?? "";
    }
  }
  let wert = new URLSearchParams(s ?? "").get(LEHRGANG_PROBE_ADRESSE_ES);
  if (wert === null && SPANISCHE_EINSTIEGSADRESSE.test(p ?? "")) wert = "1";
  try {
    if (wert === "1") window.localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "1");
    else if (wert === "0") window.localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "0");
  } catch {
    /* Speicher gesperrt - dann gilt nur die Adresse */
  }
  if (wert === "1") return true;
  if (wert === "0") return false;
  // ★★ 28.09.2026 FREIGABE (Johannes: „Spanisch ist noch nicht live"):
  // Not-Aus-Polung wie beim Englischen - default AN, `?spanisch-lehrgang=0`
  // schaltet auf dem Gerät aus.
  try {
    return window.localStorage.getItem(LEHRGANG_PROBE_MERKER_ES) !== "0";
  } catch {
    return true;
  }
}

// ── Die Schalter der vier neuen Lehrgänge (G2a, 02.10.2026; Freigabe 10.10.2026) ──
//
// ★ Italienisch, Polnisch, Türkisch, Tschechisch: SEIT DER FREIGABE 10.10.2026
// (Johannes) Not-Aus-Polung wie Englisch, Französisch und Spanisch: default AN,
// `?<sprache>-lehrgang=0` schaltet auf dem Gerät aus (Merker "0"), `=1` schaltet
// ein gemerktes Aus wieder an. Jede Sprache mit EIGENEM Merker im Browser.
// Vorher (G2a) war es "default AUS, Probe mit =1".
//
// ★ Die Einstiegsadressen `/it`, `/pl`, `/tr`, `/cs` wirken wie `/fr` und `/es`:
// wer über sie kommt, bekommt den Lehrgang (wie `?<sprache>-lehrgang=1`, und
// merkt es auf dem Gerät); ein ausdrückliches `=0` in derselben Adresse geht vor.
//
// ⚠️ Jeder Merker zählt NICHT als „Gerät kennt Tastenflow" - er ist in
// `istTastenflowMerker` (`lib/bedienSprache/sprache.ts`) ausgenommen.

/** Die vier neuen Lehrgänge. */
export type NeuerLehrgang = "it" | "pl" | "tr" | "cs";

/** Adress-Zusatz und Merker je neuem Lehrgang. */
export const NEUE_LEHRGANG_SCHALTER: Readonly<Record<NeuerLehrgang, { adresse: string; merker: string }>> = {
  it: { adresse: "italienisch-lehrgang", merker: "tastenflow-italienisch-lehrgang" },
  pl: { adresse: "polnisch-lehrgang", merker: "tastenflow-polnisch-lehrgang" },
  tr: { adresse: "tuerkisch-lehrgang", merker: "tastenflow-tuerkisch-lehrgang" },
  cs: { adresse: "tschechisch-lehrgang", merker: "tastenflow-tschechisch-lehrgang" },
};

/** Die Einstiegsadressen der vier neuen Lehrgänge (`/it`, `/pl`, `/tr`, `/cs`, mit/ohne Schrägstrich). */
export const NEUE_EINSTIEGSADRESSEN: Readonly<Record<NeuerLehrgang, RegExp>> = {
  it: /^\/it\/?$/i,
  pl: /^\/pl\/?$/i,
  tr: /^\/tr\/?$/i,
  cs: /^\/cs\/?$/i,
};

export const LEHRGANG_PROBE_MERKER_IT = NEUE_LEHRGANG_SCHALTER.it.merker;
export const LEHRGANG_PROBE_MERKER_PL = NEUE_LEHRGANG_SCHALTER.pl.merker;
export const LEHRGANG_PROBE_MERKER_TR = NEUE_LEHRGANG_SCHALTER.tr.merker;
export const LEHRGANG_PROBE_MERKER_CS = NEUE_LEHRGANG_SCHALTER.cs.merker;
export const LEHRGANG_PROBE_ADRESSE_IT = NEUE_LEHRGANG_SCHALTER.it.adresse;
export const LEHRGANG_PROBE_ADRESSE_PL = NEUE_LEHRGANG_SCHALTER.pl.adresse;
export const LEHRGANG_PROBE_ADRESSE_TR = NEUE_LEHRGANG_SCHALTER.tr.adresse;
export const LEHRGANG_PROBE_ADRESSE_CS = NEUE_LEHRGANG_SCHALTER.cs.adresse;

/**
 * Ist der Lehrgang einer der vier neuen Sprachen an? ★ Seit 10.10.2026
 * default AN. `?<sprache>-lehrgang=0` schaltet ihn AUS und merkt das auf dem
 * Gerät (Merker `"0"`, Not-Aus); `=1` schaltet ein gemerktes Aus wieder an.
 * Ohne Adresse zählt der Merker: nur `"0"` heisst „aus".
 *
 * ⚠️ Jeder Zugriff auf `localStorage` in `try/catch` - Safari im privaten
 * Modus wirft schon beim Zugriff. Gesperrter Speicher ⇒ an.
 */
function neuerLehrgangProbeAn(lehrgang: NeuerLehrgang, suche?: string, pfad?: string): boolean {
  const { adresse, merker } = NEUE_LEHRGANG_SCHALTER[lehrgang];
  let s = suche;
  let p = pfad;
  if (s === undefined || p === undefined) {
    try {
      if (s === undefined) s = window.location.search;
      if (p === undefined) p = window.location.pathname;
    } catch {
      s = s ?? "";
      p = p ?? "";
    }
  }
  let wert = new URLSearchParams(s ?? "").get(adresse);
  // Einstiegsadresse (`/it` …) wirkt wie `=1`; ein ausdrückliches `=0` geht vor.
  if (wert === null && NEUE_EINSTIEGSADRESSEN[lehrgang].test(p ?? "")) wert = "1";
  try {
    if (wert === "1") window.localStorage.setItem(merker, "1");
    else if (wert === "0") window.localStorage.setItem(merker, "0");
  } catch {
    /* Speicher gesperrt - dann gilt nur die Adresse */
  }
  if (wert === "1") return true;
  if (wert === "0") return false;
  try {
    return window.localStorage.getItem(merker) !== "0";
  } catch {
    return true;
  }
}

/** Ist der italienische Lehrgang an? (`?italienisch-lehrgang=1`, Not-Aus `=0`; Vorgabe an) */
export function italienischLehrgangProbeAn(suche?: string, pfad?: string): boolean {
  return neuerLehrgangProbeAn("it", suche, pfad);
}

/** Ist der polnische Lehrgang an? (`?polnisch-lehrgang=1`, Not-Aus `=0`; Vorgabe an) */
export function polnischLehrgangProbeAn(suche?: string, pfad?: string): boolean {
  return neuerLehrgangProbeAn("pl", suche, pfad);
}

/** Ist der türkische Lehrgang an? (`?tuerkisch-lehrgang=1`, Not-Aus `=0`; Vorgabe an) */
export function tuerkischLehrgangProbeAn(suche?: string, pfad?: string): boolean {
  return neuerLehrgangProbeAn("tr", suche, pfad);
}

/** Ist der tschechische Lehrgang an? (`?tschechisch-lehrgang=1`, Not-Aus `=0`; Vorgabe an) */
export function tschechischLehrgangProbeAn(suche?: string, pfad?: string): boolean {
  return neuerLehrgangProbeAn("cs", suche, pfad);
}

/**
 * Die vier Schalter auf einmal - in der Form, die {@link bestimmeLernweg}
 * (`lernweg.ts`) als Felder annimmt: `bestimmeLernweg({ …, ...neueLehrgangProben() })`.
 */
export function neueLehrgangProben(suche?: string, pfad?: string): {
  italienischLehrgangProbeAn: boolean;
  polnischLehrgangProbeAn: boolean;
  tuerkischLehrgangProbeAn: boolean;
  tschechischLehrgangProbeAn: boolean;
  /** ★ G2-NEUN (25.10.2026), seit 06.11.2026 Vorgabe an: die neun Schalter des Gerüsts, siehe {@link geruestLehrgangProbeAn}. */
  geruestLehrgangAn: Record<GeruestLehrgang, boolean>;
} {
  return {
    italienischLehrgangProbeAn: italienischLehrgangProbeAn(suche, pfad),
    polnischLehrgangProbeAn: polnischLehrgangProbeAn(suche, pfad),
    tuerkischLehrgangProbeAn: tuerkischLehrgangProbeAn(suche, pfad),
    tschechischLehrgangProbeAn: tschechischLehrgangProbeAn(suche, pfad),
    geruestLehrgangAn: geruestLehrgangProben(suche, pfad),
  };
}

// ── Die Schalter der neun Lernwege des Gerüsts (G2-NEUN, 25.10.2026) ────────
//
// ★ Bulgarisch, Griechisch, Ungarisch, Niederländisch, Portugiesisch (Portugal),
// Portugiesisch (Brasilien), Rumänisch, Schwedisch, Ukrainisch: SEIT DER FREIGABE
// 06.11.2026 (Johannes) Not-Aus-Polung wie it/pl/tr/cs: default AN,
// `?<sprache>-lehrgang=0` schaltet auf dem Gerät aus (Merker "0"), `=1` schaltet
// ein gemerktes Aus wieder an. Vorher (G2-NEUN, 25.10.2026) war es "default AUS,
// Probe mit =1". Die Namen folgen den bestehenden Schaltern (deutscher
// Sprachname, `?tschechisch-lehrgang=…`), für Brasilien `?brasilianisch-lehrgang=…`.
//
// ★ Wie `/it` … `/cs` schaltet die Einstiegsadresse (`/bg` … `/pt-br`) den
// Lehrgang an (wie `?<sprache>-lehrgang=1`, und merkt es auf dem Gerät); ein
// ausdrückliches `=0` in derselben Adresse geht vor.
//
// ⚠️ Jeder Merker zählt NICHT als „Gerät kennt Tastenflow" - er ist in
// `istTastenflowMerker` (`lib/bedienSprache/sprache.ts`) ausgenommen.

/** Die neun Lehrgänge des Gerüsts (dieselben Kennungen wie die Lernwege). */
export type GeruestLehrgang = "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk";

/** Die neun Lehrgänge des Gerüsts als Liste (Reihenfolge wie im Sprachregister). */
export const GERUEST_LEHRGAENGE: readonly GeruestLehrgang[] = ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];

/** Adress-Zusatz und Merker je Lehrgang des Gerüsts. */
export const GERUEST_LEHRGANG_SCHALTER: Readonly<Record<GeruestLehrgang, { adresse: string; merker: string }>> = {
  bg: { adresse: "bulgarisch-lehrgang", merker: "tastenflow-bulgarisch-lehrgang" },
  el: { adresse: "griechisch-lehrgang", merker: "tastenflow-griechisch-lehrgang" },
  hu: { adresse: "ungarisch-lehrgang", merker: "tastenflow-ungarisch-lehrgang" },
  nl: { adresse: "niederlaendisch-lehrgang", merker: "tastenflow-niederlaendisch-lehrgang" },
  pt: { adresse: "portugiesisch-lehrgang", merker: "tastenflow-portugiesisch-lehrgang" },
  br: { adresse: "brasilianisch-lehrgang", merker: "tastenflow-brasilianisch-lehrgang" },
  ro: { adresse: "rumaenisch-lehrgang", merker: "tastenflow-rumaenisch-lehrgang" },
  sv: { adresse: "schwedisch-lehrgang", merker: "tastenflow-schwedisch-lehrgang" },
  uk: { adresse: "ukrainisch-lehrgang", merker: "tastenflow-ukrainisch-lehrgang" },
};

/**
 * Die Einstiegsadressen der neun (`/bg` …, mit/ohne Schrägstrich). Brasilien hat
 * `/pt-br` (intern „br"); `/br` ist KEINE Adresse (das wäre Bretonisch).
 */
export const GERUEST_EINSTIEGSADRESSEN: Readonly<Record<GeruestLehrgang, RegExp>> = {
  bg: /^\/bg\/?$/i,
  el: /^\/el\/?$/i,
  hu: /^\/hu\/?$/i,
  nl: /^\/nl\/?$/i,
  pt: /^\/pt\/?$/i,
  br: /^\/pt-br\/?$/i,
  ro: /^\/ro\/?$/i,
  sv: /^\/sv\/?$/i,
  uk: /^\/uk\/?$/i,
};

/** Die Pfade der neun Einstiegsadressen (klein, ohne Schrägstrich am Ende) - für Router und Bereichsart. */
export const GERUEST_EINSTIEGSPFADE: Readonly<Record<GeruestLehrgang, string>> = {
  bg: "/bg", el: "/el", hu: "/hu", nl: "/nl", pt: "/pt", br: "/pt-br", ro: "/ro", sv: "/sv", uk: "/uk",
};

/**
 * Ist der Lehrgang einer der neun Sprachen des Gerüsts an? ★ Seit 06.11.2026
 * default AN. `?<sprache>-lehrgang=0` schaltet ihn AUS und merkt das auf dem
 * Gerät (Merker `"0"`, Not-Aus); `=1` schaltet ein gemerktes Aus wieder an.
 * Die Einstiegsadresse (`/bg` …) wirkt wie `=1`; ein ausdrückliches `=0` geht vor.
 * Ohne Adresse zählt der Merker: nur `"0"` heisst „aus".
 *
 * ⚠️ Jeder Zugriff auf `localStorage` in `try/catch`. Gesperrter Speicher ⇒ an.
 */
export function geruestLehrgangProbeAn(lehrgang: GeruestLehrgang, suche?: string, pfad?: string): boolean {
  const { adresse, merker } = GERUEST_LEHRGANG_SCHALTER[lehrgang];
  let s = suche;
  let p = pfad;
  if (s === undefined || p === undefined) {
    try {
      if (s === undefined) s = window.location.search;
      if (p === undefined) p = window.location.pathname;
    } catch {
      s = s ?? "";
      p = p ?? "";
    }
  }
  let wert = new URLSearchParams(s ?? "").get(adresse);
  // Einstiegsadresse (`/bg` …) wirkt wie `=1`; ein ausdrückliches `=0` geht vor.
  if (wert === null && GERUEST_EINSTIEGSADRESSEN[lehrgang].test(p ?? "")) wert = "1";
  try {
    if (wert === "1") window.localStorage.setItem(merker, "1");
    else if (wert === "0") window.localStorage.setItem(merker, "0");
  } catch {
    /* Speicher gesperrt - dann gilt nur die Adresse */
  }
  if (wert === "1") return true;
  if (wert === "0") return false;
  try {
    return window.localStorage.getItem(merker) !== "0";
  } catch {
    return true;
  }
}

/** Die neun Schalter auf einmal (`{ bg: false, … }`). */
export function geruestLehrgangProben(suche?: string, pfad?: string): Record<GeruestLehrgang, boolean> {
  const aus = {} as Record<GeruestLehrgang, boolean>;
  for (const l of GERUEST_LEHRGAENGE) aus[l] = geruestLehrgangProbeAn(l, suche, pfad);
  return aus;
}
