/**
 * ★★★ DIE BEDIENUNGSSPRACHE - Erkennung und Speicher (12.09.2026, für alle
 * seit 19.09.2026).
 *
 * Johannes 12.09.: *„du erkennst die systemsprache und schaltest automatisch
 * um. Oben in der kopfzeile wäre ein kleiner schalter"*. Bauplan:
 * `apps/tastenflow/BAUPLAN-2026-09-12-ENGLISCHE-BEDIENUNG-PROBESTUECK.md`.
 * Johannes 19.09.: *„schau nach, welche Systemsprache ein User verwendet, und
 * stelle beim ersten Mal dann die Sprache dementsprechend ein, alles andere
 * wie Deutsch wird automatisch Englisch"* - seitdem gibt es keinen
 * Probe-Schalter mehr, der Sprachschalter steht für jeden.
 *
 * ⚠️ EIGENER NAME, NICHT `lang`. `Lang` (`lib/typing/account.ts`) ist die
 * ÜBUNGSSPRACHE - was das Kind tippt und was die Stimme vorliest. Die
 * Bedienungssprache sagt nur, wie Schalter, Hinweise und Menüs heissen. Zwei
 * verschiedene Fragen; ein gemeinsamer Name hätte sie beim ersten Nachbessern
 * vermischt.
 *
 * ★★★ WELCHE SPRACHE BEIM START GILT (`anfangsSprache`):
 *  1. die gemerkte Wahl (Schalter, `&bedienung=` oder eine frühere Erkennung),
 *  2. sonst - wenn das Gerät Tastenflow schon kennt - Deutsch,
 *  3. sonst die Erkennung aus der Sprachliste des Browsers.
 * Was 2. oder 3. ergibt, merkt sich der Provider sofort; ab dann ist es Nr. 1
 * und bleibt stabil, auch wenn später jemand die Systemsprache umstellt.
 *
 * ⚠️⚠️ WARUM NR. 2: Ein Kind, das schon mit Tastenflow übt und zufällig einen
 * englisch eingestellten Browser hat, darf nicht eines Morgens eine englische
 * App vor sich haben - bis 19.09. war die Bedienung für alle deutsch, und
 * genau diese Geräte hätten sonst umgeschaltet. Nur ein wirklich neues Gerät
 * wird erkannt. Woran ein bekanntes Gerät zu erkennen ist:
 * {@link geraetKenntTastenflow}.
 *
 * ⚠️ `tests/setup.ts` setzt die Sprachliste von jsdom auf Deutsch - jsdom
 * meldet von sich aus `["en-US"]`, und rund 1.700 deutsche Test-Abfragen
 * kippten sonst auf einmal.
 */

/**
 * Die Sprache der Bedienung. Bis 25.09.2026 nur zwei - Johannes 12.09.: „nur
 * englisch und deutsch".
 *
 * ★ E2a (25.09.2026, Gerüst französischer Lehrgang): „fr" dazu - NUR der Typ.
 * Bis E2b lieferte {@link erkenneBedienSprache} bewusst NIE „fr" - `texte()`
 * (`bedienSprache/texte.ts`) kannte nur `{de, en}`, ein echtes
 * `bedienSprache === "fr"` liesse dort jede Oberfläche auf `undefined`
 * zugreifen.
 *
 * ★★ E2b (25.09.2026, Sprachwähler D9/§9.3): „fr" ist jetzt WIRKLICH
 * erreichbar - aber NUR hinter dem Probe-Schalter des französischen
 * Lehrgangs ({@link franzoesischLehrgangProbeAn}, `lib/typing/lernweg.ts`).
 * Das geht erst jetzt gefahrlos, weil `texte()` seit E2b eine OPTIONALE
 * dritte Tabelle kennt und ohne sie auf Englisch zurückfällt statt auf
 * `undefined` (`bedienSprache/texte.ts`). Trotzdem bleibt
 * {@link useBedienSprache} (`BedienSpracheProvider.tsx`) für die ~90
 * bestehenden Aufrufstellen bei {@link AktiveBedienSprache} („de"/„en") -
 * die WIRKLICHE Auswahl trägt dort das neue Feld `spracheGewaehlt`. Siehe
 * {@link oberflaechenSprache}.
 *
 * ★ ES-F2 (27.09.2026, Gerüst spanischer Lehrgang): „es" dazu - VIERWERTIG
 * jetzt. Weil {@link AktiveBedienSprache} seit E11a-5 eine reine
 * Namens-Gleichung dieses Typs ist, reicht {@link oberflaechenSprache} „es"
 * genauso durch wie „fr" - jede der ~90 Aufrufstellen von
 * {@link useBedienSprache} bekommt darum mit diesem Gerüst wirklich einen
 * `es`-Fall (bis ES-O vorerst Englisch, siehe `BEFUND-2026-09-27-ES-F2-GERUEST.md`;
 * seit ES-O spanisch, siehe `BEFUND-2026-09-27-ES-O-OBERFLAECHE.md`).
 * Erreichbar ist „es" trotzdem NUR hinter {@link spanischLehrgangProbeAn}
 * (`lib/typing/lernweg.ts`) - siehe {@link erkenneBedienSprache},
 * {@link adressWahlLesen}.
 */
export type BedienSprache = "de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs" | "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk";

/**
 * ★★★★★ E11a-5 (26.09.2026, Johannes, Bauplan F18 entschieden: *„natürlich
 * muss jemand, der Französisch verwendet, auch alles in Französisch
 * bekommen - Anleitung, Spendenaufruf, Impressum …"*): EINGESCHALTET. Seitdem
 * ist dieser Typ dasselbe wie {@link BedienSprache} - „fr" kommt bei jedem
 * Aufrufer von `useBedienSprache().sprache` an. Der Name bleibt, weil ihn
 * rund 50 Stellen tragen; neue Stellen schreiben `BedienSprache`.
 * `BEFUND-2026-09-26-E11A5-ALLES-FRANZOESISCH.md` nennt, was dafür umgebaut
 * wurde (gemeinsame Teile, Hilfen, Spendenaufruf, Handbücher, Expedition).
 *
 * Die Geschichte davor (E2b bis E11a-4): Die Bedienungssprache, die praktisch
 * die GANZE App noch kannte - `texte()`
 * fällt für „fr" zwar seit E2b auf Englisch zurück (nie auf `undefined`,
 * siehe {@link BedienSprache}), aber die ~90 Aufrufstellen von
 * {@link useBedienSprache} (`BedienSpracheProvider.tsx`) tippen ihren
 * Parameter weiterhin lokal als `"en" | "de"`. Ein Wechsel ihres Typs ist
 * NICHT Teil von E2b - jede davon würde für „fr" sonst STILL eine neue Form
 * derselben Falle bauen, vor der der Weichen-Zähler warnt (Bauplan §2.3).
 *
 * Darum bleibt {@link useBedienSprache}s Feld `sprache` bei diesem engen Typ
 * - immer auf {@link oberflaechenSprache} abgebildet, auch wenn die WIRKLICHE
 * Auswahl „fr" ist. Wer die wirkliche Auswahl braucht (der Sprachwähler
 * selbst), liest `spracheGewaehlt` ({@link BedienSprache}, `BedienSpracheProvider.tsx`).
 *
 * `BedienSprache` bleibt die umfassende, DREIWERTIGE Fassung für das
 * Lernweg-Gerüst (`lib/typing/lernweg.ts`), die Server-Wächter und - seit
 * E2b - den Sprachwähler und die Erkennung selbst.
 */
export type AktiveBedienSprache = BedienSprache;

/**
 * ★★★★★ E11a-5 (26.09.2026): DER EINZEILER IST GEBAUT - „fr" bleibt „fr".
 * Gemessen vor dem Einschalten (Probe wie in E11a-2 bis E11a-4): 22
 * `tsc`-Fehler in 10 Quelldateien; nach dem Umbau 0. Dazu jede Stelle, die
 * `tsc` NICHT sieht (`sprache === "en" ? … : Deutsch`, Falle 20/30), einzeln
 * gelesen - der Befund führt die Liste. Die Funktion bleibt als Naht stehen:
 * Soll eine vierte Sprache erst später sichtbar werden, bildet sie sie hier
 * vorübergehend ab, ohne eine einzige Aufrufstelle anzufassen.
 *
 * Die Geschichte davor:
 * ★★★ E2b (25.09.2026, Bauplan D9/§9.3): DIE OBERFLÄCHEN-SICHERE SPRACHE -
 * bildet die dreiwertige {@link BedienSprache} auf die zwei Werte ab, die
 * `texte()` und praktisch die ganze App bis E11 wirklich kennen. „de" bleibt
 * „de", „en" UND „fr" werden „en" (die Oberfläche fällt für „fr" auf
 * Englisch zurück, nie auf leer - `bedienSprache/texte.ts`).
 *
 * ★ WOZU EINE EIGENE FUNKTION STATT EINER WEICHE AN JEDER STELLE: Genau DAS
 * verhindert, dass sich die 222 Ternär-Weichen auf „en" vermehren (Bauplan
 * §2.3 Punkt 3/4, Auftrag E2b Punkt 3, gezählt von
 * `tests/tastenflow-sprach-weichen.test.ts`) - jede der ~90 Aufrufstellen von
 * {@link useBedienSprache}, die eine reale dritte Sprache noch nicht kennt,
 * bekommt über den Provider weiterhin GENAU „de"/„en" (siehe
 * {@link AktiveBedienSprache}) und muss nichts Neues wissen. Nur der Provider
 * selbst und der neue Sprachwähler (`AppKopfzeile.tsx`) rufen diese Funktion
 * auf.
 */
export function oberflaechenSprache(bs: BedienSprache): AktiveBedienSprache {
  return bs;
}

/**
 * Die gemerkte Sprache der Bedienung - vom Schalter in der Kopfzeile, von
 * `&bedienung=` oder von der Erkennung beim allerersten Besuch.
 */
export const BEDIENUNG_SCHLUESSEL = "tastenflow-bedienung";

/**
 * Die Sprachliste des Browsers wird DER REIHE NACH gelesen; die erste Sprache,
 * die Deutsch oder Englisch ist, entscheidet. Kommt keine der beiden vor, gilt
 * Englisch. Johannes 19.09.2026: *„erste und zweite und wenn da auch dritte
 * Sprache - und wenn Deutsch vor Englisch kommt, mach Deutsch"* und *„alles
 * andere wie Deutsch wird automatisch Englisch"*.
 *
 * Eine türkischsprachige Familie in Wien mit `["tr", "de"]` bekommt also
 * Deutsch, `["tr", "en", "de"]` Englisch, eine französische ohne beide
 * Englisch.
 *
 * ★ Leere Liste ⇒ Deutsch: Wer nichts meldet (gesperrter Browser, alte Umgebung),
 * bekommt die Sprache, in der die App gebaut und geprüft ist.
 *
 * `^de` mit Grenze statt `startsWith("de")`: Ein Code wie „del" ist nicht
 * Deutsch - und „enm" (Mittelenglisch) entsprechend nicht Englisch.
 *
 * ★ E2b (25.09.2026, Sprachwähler D9/§9.3): erkennt „fr-*" jetzt WIRKLICH -
 * aber NUR mit `franzoesischAn` (Vorgabe `false`, also unverändert: eine
 * französische Sprachliste ergibt dann wie bisher „en", Fallback). Ohne den
 * Schalter würde ein wirkliches `bedienSprache === "fr"` jede
 * Oberflächenstelle riskieren, die noch von {@link AktiveBedienSprache}
 * ausgeht - siehe {@link BedienSprache}.
 *
 * @param franzoesischAn ist der Probe-Schalter des französischen Lehrgangs an
 *   ({@link franzoesischLehrgangProbeAn})? Nur dann liefert eine `fr-*`-Sprache
 *   wirklich „fr" - sonst fällt sie wie jede andere nicht-deutsche,
 *   nicht-englische Sprache auf „en".
 * @param spanischAn ★ ES-F2: derselbe Gedanke für „es" - ist der Probe-Schalter
 *   des spanischen Lehrgangs an ({@link spanischLehrgangProbeAn})? Nur dann
 *   liefert eine `es-*`-Sprache wirklich „es".
 */
export function erkenneBedienSprache(
  sprachen: readonly string[],
  franzoesischAn = false,
  spanischAn = false,
): BedienSprache {
  if (sprachen.length === 0) return "de";
  for (const s of sprachen) {
    const code = s.trim();
    if (/^de(?:[-_]|$)/i.test(code)) return "de";
    if (franzoesischAn && /^fr(?:[-_]|$)/i.test(code)) return "fr";
    if (spanischAn && /^es(?:[-_]|$)/i.test(code)) return "es";
    if (/^en(?:[-_]|$)/i.test(code)) return "en";
  }
  return "en";
}

// ⚠️ Jeder Zugriff auf `localStorage` in `try/catch`: Safari im privaten Modus
// und Browser mit gesperrten Websitedaten werfen schon beim Zugriff.
function lies(schluessel: string): string | null {
  try {
    return window.localStorage.getItem(schluessel);
  } catch {
    return null;
  }
}

function schreib(schluessel: string, wert: string): void {
  try {
    window.localStorage.setItem(schluessel, wert);
  } catch {
    /* Speicher gesperrt - dann gilt die Wahl eben nur bis zum Neuladen. */
  }
}

/**
 * Die gemerkte Sprache, oder `null`, wenn auf diesem Gerät noch keine
 * feststeht. ★ Bleibt BEWUSST eng (nur „de"/„en") - `aktuelleBedienSprache()`
 * (das Backend) soll nie „fr" liefern, bis E11 echte Texte bringt. Die
 * WIRKLICHE, dreiwertige Speicherung liest {@link gespeicherteWahlRoh}.
 */
export function gespeicherteWahl(): AktiveBedienSprache | null {
  const w = lies(BEDIENUNG_SCHLUESSEL);
  return w === "de" || w === "en" ? w : null;
}

/**
 * ★ E2b (25.09.2026): wie {@link gespeicherteWahl}, erkennt aber zusätzlich
 * eine gemerkte „fr"-Wahl. Für den Provider-Rohzustand
 * (`BedienSpracheProvider.tsx`, `spracheGewaehlt`) und den Sprachwähler -
 * NICHT für `aktuelleBedienSprache()` (siehe dort).
 */
export function gespeicherteWahlRoh(): BedienSprache | null {
  const w = lies(BEDIENUNG_SCHLUESSEL);
  // ★ G2-NEUN (25.10.2026): auch eine gemerkte Wahl einer der neun Sprachen des Gerüsts - ob sie GILT, entscheidet
  // der Provider (`nurWennAn`: nur mit dem Schalter der Sprache).
  return w === "de" || w === "en" || w === "fr" || w === "es" || w === "it" || w === "pl" || w === "tr" || w === "cs" ||
    (GERUEST_SPRACHEN_BEDIENUNG as readonly string[]).includes(w ?? "")
    ? (w as BedienSprache)
    : null;
}

/** ★ G2-NEUN (25.10.2026): die neun Sprachen des Gerüsts (Vorgabe AUS, je ein Schalter). */
export const GERUEST_SPRACHEN_BEDIENUNG = ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"] as const;

/**
 * Die vier neuen Sprachen (10.10.2026 freigegeben) - welche ihr Lehrgangsschalter anbietet.
 * ★ G2-NEUN (25.10.2026): dazu die neun des Gerüsts - ohne ihren Schalter (Vorgabe aus) erreicht sie nichts.
 */
export type NeueSprachenAn = Partial<Record<"it" | "pl" | "tr" | "cs" | (typeof GERUEST_SPRACHEN_BEDIENUNG)[number], boolean>>;

/**
 * Die Einstiegsadressen der vier neuen Sprachen (`/it` …), wie `/fr` und `/es`.
 * ★ G2-NEUN: dazu die neun des Gerüsts (`/pt-br` ⇒ „br"); sie wählen NUR mit dem Schalter der Sprache.
 */
const NEUE_ADRESSEN: Readonly<Record<keyof NeueSprachenAn, RegExp>> = {
  it: /^\/it\/?$/i,
  pl: /^\/pl\/?$/i,
  tr: /^\/tr\/?$/i,
  cs: /^\/cs\/?$/i,
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

const NEUE_SPRACHEN = ["it", "pl", "tr", "cs", ...GERUEST_SPRACHEN_BEDIENUNG] as const;

export function wahlMerken(sprache: BedienSprache): void {
  schreib(BEDIENUNG_SCHLUESSEL, sprache);
}

/** Der Adress-Zusatz, der die Bedienungssprache direkt wählt (`?bedienung=en`). */
export const WAHL_PARAMETER = "bedienung";

/**
 * `?bedienung=en` (oder `=de`) wählt die Sprache über die Adresse und merkt
 * sie - als hätte jemand den Schalter gedrückt.
 *
 * ★ Wozu (12.09.2026): Der NVDA-Prüfstand fährt eine Windows-VM mit deutscher
 * Sprachliste und frischem Browser-Profil - ohne diesen Zusatz käme er nie in
 * die englische Bedienung. Und Johannes kann Englisch am deutschen Mac mit
 * einem Link öffnen, ohne erst den Schalter zu suchen.
 *
 * ★ E2b (25.09.2026): `?bedienung=fr` wirkt jetzt - aber NUR mit
 * `franzoesischAn` (Vorgabe `false`, unverändert): ohne den Schalter bleibt
 * `?bedienung=fr` wirkungslos (`null`), genau wie bisher.
 *
 * ★ ES-F2 (27.09.2026): `?bedienung=es` wirkt genauso - aber NUR mit
 * `spanischAn` (Vorgabe `false`).
 *
 * ★ 27.09.2026 (Johannes: „ja", wie `/fr` am 26.09.): die spanische
 * Einstiegsadresse `/es` wählt jetzt ebenso wie `/fr` - NUR mit `spanischAn`,
 * genau wie `?bedienung=es` oben (`SPANISCHE_ADRESSE`,
 * `SPANISCHE_EINSTIEGSADRESSE` in `lib/typing/lernweg.ts`).
 */
export function adressWahlLesen(
  suche?: string,
  pfad?: string,
  franzoesischAn = false,
  spanischAn = false,
  neueAn: NeueSprachenAn = {},
): BedienSprache | null {
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
  const wert = new URLSearchParams(s).get(WAHL_PARAMETER);
  if (wert === "de" || wert === "en") {
    wahlMerken(wert);
    return wert;
  }
  if (franzoesischAn && wert === "fr") {
    wahlMerken("fr");
    return "fr";
  }
  if (spanischAn && wert === "es") {
    wahlMerken("es");
    return "es";
  }
  // ★ 10.10.2026: `?bedienung=it|pl|tr|cs` - wie fr/es NUR mit dem Schalter der Sprache.
  for (const k of NEUE_SPRACHEN) {
    if (neueAn[k] && wert === k) {
      wahlMerken(k);
      return k;
    }
  }
  // ★ Die englische Einstiegsadresse `/en` (23.09.2026) wählt Englisch wie der
  // Schalter: Wer einem englischen Link folgt - aus einem Forum, von einem
  // Plakat -, will die englische Bedienung, auch auf einem Gerät, das
  // Tastenflow schon auf Deutsch kennt. `?bedienung=` geht vor.
  if (ENGLISCHE_ADRESSE.test(p ?? "")) {
    wahlMerken("en");
    return "en";
  }
  // ★ E11c (26.09.2026): die französische Einstiegsadresse `/fr` - wie `/en`,
  // aber NUR mit `franzoesischAn`, genau wie `?bedienung=fr` oben. Solange
  // der französische Lehrgang hinter seinem Schalter steht (Bauplan F16),
  // bietet der Sprachwähler „Français" nur mit ihm an; eine Adresse, die ohne
  // ihn französisch schaltete, wäre ein zweiter Weg an ihm vorbei - und ein
  // Kind, das dort zu üben begänne, bekäme französische Knöpfe auf dem Weg
  // „de", und der Weg ist nach dem ersten Fortschritt FEST (D2).
  // ★ 26.09.2026 (Johannes, „Möglichkeit 1"): `/fr` schaltet den Lehrgang
  // selbst an (`franzoesischLehrgangProbeAn` liest den Pfad) - darum ist
  // `franzoesischAn` hier auf `/fr` immer wahr, ausser bei `=0`.
  if (franzoesischAn && FRANZOESISCHE_ADRESSE.test(p ?? "")) {
    wahlMerken("fr");
    return "fr";
  }
  // ★ 27.09.2026 (Johannes, wie „Möglichkeit 1" bei Französisch): die
  // spanische Einstiegsadresse `/es` - wie `/fr`, aber NUR mit `spanischAn`.
  // `spanischLehrgangProbeAn` liest den Pfad selbst - darum ist `spanischAn`
  // hier auf `/es` immer wahr, ausser bei `=0`.
  if (spanischAn && SPANISCHE_ADRESSE.test(p ?? "")) {
    wahlMerken("es");
    return "es";
  }
  // ★ 10.10.2026: `/it`, `/pl`, `/tr`, `/cs` - wie `/es`, NUR mit dem Schalter der Sprache
  // (die Lehrgangsschalter lesen den Pfad selbst; ein `=0` in der Adresse geht vor).
  for (const k of NEUE_SPRACHEN) {
    if (neueAn[k] && NEUE_ADRESSEN[k].test(p ?? "")) {
      wahlMerken(k);
      return k;
    }
  }
  return null;
}

/** `/en` und `/en/` - die englische Einstiegsadresse von Tastenflow. */
const ENGLISCHE_ADRESSE = /^\/en\/?$/i;

/** `/fr` und `/fr/` - die französische Einstiegsadresse (E11c). */
const FRANZOESISCHE_ADRESSE = /^\/fr\/?$/i;

/** `/es` und `/es/` - die spanische Einstiegsadresse (scharf seit 27.09.2026). */
const SPANISCHE_ADRESSE = /^\/es\/?$/i;

/** Die Sprachliste des Browsers - oder leer, wo es keine gibt. */
export function browserSprachen(): readonly string[] {
  try {
    const n = window.navigator;
    if (n.languages && n.languages.length) return n.languages;
    return n.language ? [n.language] : [];
  } catch {
    return [];
  }
}

/**
 * ★★★ D1 (28.09.2026, Entscheidung Johannes Nr. 15): WO SPANISCH MIT KOMMA
 * UND WO MIT PUNKT SCHREIBT. Das Land kommt aus der Browsersprache: die
 * erste spanische Sprache der Liste entscheidet - mit Land („es-MX",
 * „es-AR", auch die Region „es-419") gilt die Schreibweise dieses Landes,
 * wie sie CLDR (`Intl.NumberFormat`) führt; ein blosses „es" oder gar keine
 * spanische Sprache heisst: ohne Land, also das Komma (Spanien, „es-ES").
 *
 * Die Quelle ist CLDR, nicht eine Liste im Code - gemessen am 28.09.2026
 * (ICU 78.3/CLDR 48): Punkt in MX GT HN SV NI PA DO PR US PE CU und in der
 * Region 419; Komma in AR CO CL UY PY BO EC VE CR und in Spanien. Peru und
 * Kuba schreiben laut CLDR den Punkt - anders als in der Vorlage des
 * Auftrags, die CLDR ausdrücklich als Quelle nannte.
 *
 * Rein: liest nichts selbst (die Liste kommt herein, siehe `browserSprachen`).
 */
export function esZahlGebietAus(sprachen: readonly string[]): string {
  for (const roh of sprachen) {
    const s = roh.trim();
    if (!/^es(?:[-_]|$)/i.test(s)) continue;
    const land = /^es[-_]([a-z]{2}|\d{3})(?:[-_]|$)/i.exec(s);
    if (!land) return "es-ES";
    const tag = `es-${land[1].toUpperCase()}`;
    try {
      return Intl.NumberFormat.supportedLocalesOf([tag]).length ? tag : "es-ES";
    } catch {
      return "es-ES";
    }
  }
  return "es-ES";
}

/** Das Dezimalzeichen eines Gebiets („es-MX" → „.", „es-AR" → „,"), laut CLDR. */
export function dezimalzeichen(gebiet: string): "," | "." {
  try {
    const teil = new Intl.NumberFormat(gebiet).formatToParts(1.5).find((t) => t.type === "decimal");
    return teil?.value === "." ? "." : ",";
  } catch {
    return ",";
  }
}

/**
 * ★★★ Die Merker eines Geräts, das Tastenflow schon kennt - Schlüssel im
 * Browser-Speicher, die nur entstehen, wenn hier schon jemand Tastenflow
 * benutzt hat (Stand 19.09.2026, im Code nachgezählt):
 *
 *  · `tippen-…`          ALLES, was Tastenflow selbst merkt: die erledigte
 *                        Einrichtung (`tippen-einrichtung`, `lib/typing/
 *                        einrichtung.ts`), der Übungsstand eines Gastes
 *                        (`tippen-trainer:v1`, `progress.ts`), Stimme,
 *                        Tastatur, Ton, Anzeige, Zeichenabstand, Podcast
 *                        gesehen … Die Einrichtung ALLEIN reicht nicht: Wer
 *                        mit Konto schon geübt hat, bekommt sie nie zu sehen
 *                        (`hatSchonGeuebt`) - der Merker fehlt dann.
 *  · `tastenflow:…` / `tastenflow-…`   ★ darunter der verlässlichste:
 *                        `tastenflow:topf:bilanz` - geschrieben nach JEDER
 *                        fertigen Übungszeile, mit und ohne Konto, seit
 *                        29.08.2026 (`topfVerbuchen` in `TippenTrainerPage`).
 *                        Dazu Tippchallenge-Stand, Klassenmatch, Neuigkeiten -
 *                        ausser der Wahl selbst ({@link BEDIENUNG_SCHLUESSEL})
 *                        und ausser dem Schalter des englischen Lehrgangs
 *                        (`tastenflow-englisch-lehrgang`, `LEHRGANG_PROBE_
 *                        MERKER` in `lib/typing/lernweg.ts`, ★ FREIGABE
 *                        25.09.2026): wie die Bedienungswahl ist das eine
 *                        blosse EINSTELLUNG, kein Beleg, dass hier je geübt
 *                        wurde - sonst würde schon ein blosser Not-Aus-Link
 *                        (`?englisch-lehrgang=0`) ein Gerät fälschlich als
 *                        „kennt Tastenflow" zählen.
 *  · `tt_pb_auth`        eine ANMELDUNG in der Lernwerkstatt (Tastenflow,
 *                        Punktgenau, Klangpunkte, Mathecoach teilen ihn) -
 *                        wer hier angemeldet ist, gehört zu einer Klasse oder
 *                        hat ein Konto, also zur deutschsprachigen Plattform.
 *  · `tt_merkfenster`    ein Merkfenster wurde gezeigt (`merkfenster.ts`).
 *  · `sensorik:tippen:…` die Fingerfarben (`lib/typing/a11y.ts`).
 *  · `px-journey-visited` die Expedition (`ExpeditionJourney.tsx`).
 *
 * ★ Warum ein Blick über ALLE Schlüssel statt einer Liste einzelner Namen:
 * Ein Merker, der später dazukommt, zählt von selbst mit - eine feste Liste
 * vergässe ihn, und ein Gerät kippte dann doch um. Zu früh zählt dabei
 * nichts: Gelesen wird beim ersten Zeichnen des Providers in `Root`, bevor
 * irgendein Teil von Tastenflow etwas schreiben konnte.
 *
 * Gesperrter Speicher ⇒ `false`: Dann lässt sich ohnehin nichts merken, und
 * die Erkennung liefert bei jedem Besuch dasselbe.
 */
export function geraetKenntTastenflow(): boolean {
  try {
    const speicher = window.localStorage;
    for (let i = 0; i < speicher.length; i++) {
      const k = speicher.key(i);
      if (k && istTastenflowMerker(k)) return true;
    }
  } catch {
    return false;
  }
  return false;
}

/** ★ G2-NEUN: die Merker der neun Schalter des Gerüsts (Literal - dieses Modul bleibt ohne Abhängigkeit). */
const GERUEST_MERKER: readonly string[] = [
  "tastenflow-bulgarisch-lehrgang",
  "tastenflow-griechisch-lehrgang",
  "tastenflow-ungarisch-lehrgang",
  "tastenflow-niederlaendisch-lehrgang",
  "tastenflow-portugiesisch-lehrgang",
  "tastenflow-brasilianisch-lehrgang",
  "tastenflow-rumaenisch-lehrgang",
  "tastenflow-schwedisch-lehrgang",
  "tastenflow-ukrainisch-lehrgang",
];

/** Ist dieser Schlüssel ein Merker von {@link geraetKenntTastenflow}? */
export function istTastenflowMerker(schluessel: string): boolean {
  if (schluessel === BEDIENUNG_SCHLUESSEL) return false;
  // ★ FREIGABE 25.09.2026: derselbe Grund wie bei `BEDIENUNG_SCHLUESSEL` -
  // der Merker heisst zwar `tastenflow-…`, ist aber selbst nur eine
  // EINSTELLUNG (siehe Kopf-Doku), kein Beleg für „hier wurde schon geübt".
  // Literal statt Import: dieses Modul bleibt bewusst ohne jede Abhängigkeit
  // (siehe Kopf) - der Name muss zu `LEHRGANG_PROBE_MERKER` in
  // `lib/typing/lernweg.ts` passen, ein Wächter dafür steht in
  // `tests/tastenflow-lernweg.test.ts`.
  if (schluessel === "tastenflow-englisch-lehrgang") return false;
  // ★ E2a (25.09.2026): derselbe Grund wie beim englischen Probe-Schalter -
  // `LEHRGANG_PROBE_MERKER_FR` in `lib/typing/lernweg.ts`, Wächter ebenda.
  if (schluessel === "tastenflow-franzoesisch-lehrgang") return false;
  // ★ ES-F2 (27.09.2026): derselbe Grund wie beim französischen Probe-
  // Schalter - `LEHRGANG_PROBE_MERKER_ES` in `lib/typing/lernweg.ts`.
  if (schluessel === "tastenflow-spanisch-lehrgang") return false;
  // ★ G2a (02.10.2026): dasselbe für die Schalter der vier neuen Lehrgänge
  // (`NEUE_LEHRGANG_SCHALTER` in `lib/typing/lehrgangSchalter.ts`, Wächter in
  // `tests/tastenflow-sprachen-vollstaendig.test.ts`).
  if (
    schluessel === "tastenflow-italienisch-lehrgang" ||
    schluessel === "tastenflow-polnisch-lehrgang" ||
    schluessel === "tastenflow-tuerkisch-lehrgang" ||
    schluessel === "tastenflow-tschechisch-lehrgang"
  )
    return false;
  // ★ G2-NEUN (25.10.2026): ebenso die neun Schalter des Gerüsts (`GERUEST_LEHRGANG_SCHALTER` in
  // `lib/typing/lehrgangSchalter.ts`, Wächter in `tests/tastenflow-g2neun-schalter.test.ts`).
  if (GERUEST_MERKER.includes(schluessel)) return false;
  return (
    schluessel.startsWith("tippen-") ||
    schluessel.startsWith("tastenflow:") ||
    schluessel.startsWith("tastenflow-") ||
    schluessel.startsWith("sensorik:tippen:") ||
    schluessel === "tt_pb_auth" ||
    schluessel === "tt_merkfenster" ||
    schluessel === "px-journey-visited"
  );
}

/**
 * Mit welcher Sprache die App startet - die Reihenfolge aus dem Kopf dieser
 * Datei. Rein, ohne Browser prüfbar.
 *
 * ★ E2b (25.09.2026): `gespeichert` und der Rückgabetyp sind jetzt
 * {@link BedienSprache} (können „fr" sein) - `franzoesischAn` steuert nur die
 * ERKENNUNG aus der Browser-Sprachliste ({@link erkenneBedienSprache}). Eine
 * bereits gespeicherte Wahl gewinnt immer, unabhängig vom Schalter (Regel 1,
 * wie beim Lernweg) - wer den Schalter später wieder abschaltet, verliert
 * seine gemerkte Sprache nicht rückwirkend.
 */
export function anfangsSprache(opts: {
  gespeichert: BedienSprache | null;
  bekanntesGeraet: boolean;
  sprachen: readonly string[];
  franzoesischAn?: boolean;
  /** ★ ES-F2: derselbe Gedanke wie `franzoesischAn`, für „es". */
  spanischAn?: boolean;
}): BedienSprache {
  if (opts.gespeichert) return opts.gespeichert;
  if (opts.bekanntesGeraet) return "de";
  return erkenneBedienSprache(opts.sprachen, opts.franzoesischAn, opts.spanischAn);
}

/**
 * ★ Die Bedienungssprache, die gerade gilt - ohne React und OHNE Nebenwirkung
 * (EN9, 19.09.2026). Für das Backend von Tastenflow: Es legt ein neues Konto
 * mit dieser Sprache an und gleicht sie nach der Anmeldung ab, damit die Mails
 * an das Konto in ihr kommen (`pbBackend.ts`).
 *
 * Dieselbe Reihenfolge wie beim Start des Providers ({@link anfangsSprache});
 * der hat seine Wahl bis dahin längst gemerkt, darum liefern beide dasselbe.
 *
 * ★ E2b (25.09.2026): liefert BEWUSST weiter nie „fr" - `franzoesischAn`
 * bleibt hier unausgefüllt (Vorgabe `false`), und {@link gespeicherteWahl}
 * (eng) statt {@link gespeicherteWahlRoh} wird gelesen. Das Backend
 * (`pbBackend.ts`) trägt „fr" erst ab E11 an ein Konto - vorher wäre es ein
 * Feld, das der Server nicht auswertet (Befund E2a §2 „bewusst gelassen").
 * {@link oberflaechenSprache} ist hier nur ein Sicherheitsnetz (liefert ohne
 * `franzoesischAn` ohnehin nie „fr" zurück).
 */
export function aktuelleBedienSprache(): AktiveBedienSprache {
  return oberflaechenSprache(
    anfangsSprache({
      gespeichert: gespeicherteWahl(),
      bekanntesGeraet: geraetKenntTastenflow(),
      sprachen: browserSprachen(),
    }),
  );
}

/**
 * ★★ E11c (26.09.2026): DIE SPRACHE FÜR DAS FELD `bedienSprache` AM KONTO -
 * wie {@link aktuelleBedienSprache}, erkennt aber eine gemerkte „fr"-Wahl
 * ({@link gespeicherteWahlRoh}). Danach richten sich die Mails an das Konto
 * (`pocketbase/pb_hooks/tt_mail_texte_lib.pb.js` kennt seit E11c „fr").
 *
 * Warum eine EIGENE Funktion statt `aktuelleBedienSprache` zu weiten: Die
 * wird auch für die ÜBUNGSSPRACHE eines neuen Kontos gelesen (`lang` in
 * `pbBackend.registerSelf`) - die bleibt, wie sie war (Französisch gibt es
 * nur auf Weg „fr", Bauplan F15). Ohne diese Funktion schrieb der Abgleich
 * nach jeder Anmeldung „de" über ein französisches Konto (gemerkte „fr"-Wahl
 * ⇒ `gespeicherteWahl()` leer ⇒ bekanntes Gerät ⇒ „de"), und jede Mail kam
 * deutsch.
 *
 * Die ERKENNUNG aus der Browser-Sprachliste bleibt ohne Schalter - ein
 * `fr-*`-Browser liefert hier also nie „fr", solange nicht jemand „Français"
 * gewählt hat (was nur mit dem Schalter geht, Bauplan F16).
 */
export function kontoBedienSprache(): BedienSprache {
  return oberflaechenSprache(
    anfangsSprache({
      gespeichert: gespeicherteWahlRoh(),
      bekanntesGeraet: geraetKenntTastenflow(),
      sprachen: browserSprachen(),
    }),
  );
}
