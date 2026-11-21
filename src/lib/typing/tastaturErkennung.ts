/**
 * ★★★ DIE APP ERKENNT DIE TASTATUR SELBST (W2b, 28.09.2026).
 *
 * Johannes (Windows-Befund 27.09.2026, §3.8 Entscheidung 1): *„Die App soll
 * die Tastatur selbst erkennen und umstellen."* Gemessen in Edge 154 und
 * Chrome 153 (Befund §3.7): `navigator.keyboard.getLayoutMap()` meldet die
 * aktive Windows-Belegung sofort und live; Totasten kommen als ihr Zeichen
 * (`^ ´ ¨ ¸`); alle elf App-Tastaturen sind daran eindeutig zu unterscheiden
 * (UK und Irland sind gleich und gelten beide als „uk").
 *
 * ── DIE REGEL (§3.7, W3C-Tastencodes) ───────────────────────────────────────
 *   KeyQ = „b"                 ⇒ BÉPO (nicht in der App)
 *   KeyA = „q" (AZERTY)        ⇒ Digit1 = „à" AFNOR (nicht in der App),
 *                                 Digit6 = „§" be, Digit6 = „-" fr
 *   KeyY = „z" (QWERTZ)        ⇒ Semicolon = „é" ch-fr, „ö" + Minus „ß" de,
 *                                 Minus „'" ch; Semicolon = „ł" + Quote „ą":
 *                                 Polski (214) / Mac „Polish" (F3-pl, nicht in der App)
 *   sonst                      ⇒ Semicolon = „ò" + Quote „à": it (Windows 141/142,
 *                                 F3-it, nicht zu trennen);
 *                                 Semicolon = „ñ": Backquote „º" es, „|" latam;
 *                                 Backquote „/" ca-csa, „#" ca-fr (KBDCA),
 *                                 „°" Kanada-Legacy (nicht in der App);
 *                                 Backslash „#" uk; sonst us
 *
 * ⚠️ Zwei Schärfungen gegenüber der Tabelle, damit ein FREMDES Layout nicht als
 *    eines der App durchgeht (die Tabelle kennt nur die gemessenen): „us" und
 *    „uk" verlangen zusätzlich Semicolon „;" (Italienisch, Türkisch F/Q …
 *    wären sonst „us"), „ch-fr" verlangt zusätzlich Quote „à" (Ungarisch hat
 *    auf Semicolon ebenfalls „é"). Alles, was nicht passt, heisst „unbekannt".
 *
 * ★★★ F3-pl (02.10.2026, R1 §7): POLNISCH.
 *  · „Polski (214)" (Windows, Schreibmaschinen-Belegung) und der Mac „Polish" sind EINDEUTIG erkennbar
 *    (`Semicolon` = „ł" und `Quote` = „ą" - auf Windows 214 UND Mac „Polish" gleich; `KeyY` = „z" führt in
 *    den QWERTZ-Zweig) und sind KEIN Lernweg-Layout: das Ergebnis ist `{ art: "fremd", name: "pl-214" }`.
 *    Die Einrichtung soll daraus später „Bitte Polski (programisty) einstellen" machen (nur der
 *    Datenpunkt ist hier; die Oberfläche kommt mit der Einrichtungs-Etappe).
 *  · „Polski (programisty)" (Windows) und Mac „Polish - Pro" haben die Grundebene der US-Tastatur und sind
 *    per `getLayoutMap` NICHT von `us` zu trennen (die neun Buchstaben liegen auf AltGr/Option, die
 *    `getLayoutMap` nicht kennt): sie gelten hier als `{ app, us }`. Auf Weg „pl" ist `us` darum nie
 *    „fertig erkannt" - die Vorwahl heisst `pl` (`vorschlagLayout("pl", …)`, Browsersprache), bestätigt wird
 *    am Anschlag AltGr + A ({@link bestaetigtPolnischProgrammierer}; die Probe-Taste der Einrichtung ist
 *    eine spätere Etappe).
 *
 * ★★★ F3-tr (02.10.2026, R1 §6): TÜRKISCH.
 *  · „Türkçe Q" (Windows; deutsche und Schweizer Hardware mit eingeschaltetem „Türkçe Q" meldet dieselbe
 *    Belegung nach `code`): `Semicolon` = „ş" ⇒ `{ app, tr-q }`. „ş" liegt in keiner anderen App-Tastatur auf
 *    dieser Taste; wenn `BracketLeft` bekannt ist, muss sie „ğ" sein (sonst eine fremde Belegung mit „ş").
 *  · „Türkçe F" (Windows): `KeyA` = „u" (kommt sonst nirgends vor) UND (`Quote` = „ş" ODER `KeyQ` = „f") ⇒
 *    `{ app, tr-f }`. Entschieden VOR der Prüfung von `KeyA`/`KeyY`: auf F ist `KeyY` = „d", eine Taste, die ein Kind
 *    erst spät tippt - die Tastendruck-Erkennung (Firefox, Safari) würde sonst nie fertig.
 *  · ⚠️ `KeyI` taugt NICHT als Kennung (auch nicht `Quote` auf Q): mit Feststelltaste meldet `KeyI` „I", und
 *    `toLowerCase()` macht daraus „i" statt „ı"; `Quote` meldet „İ", das `toLowerCase()` in ZWEI Zeichen
 *    zerlegt. „ş", „ğ", „u", „f" sind sicher (`"Ş".toLowerCase()` = „ş").
 *  · Mac „Turkish" (Apple-eigener F-Entwurf: `KeyA` = „u", aber `BracketLeft` = „;") ist keine App-Tastatur:
 *    `{ fremd, unbekannt }` (der Mac wird ohnehin nicht erkannt, siehe unten). Mac „Turkish-QWERTY" (US-Grundebene
 *    mit Option) hat die Grundebene von `us` und ist von dort nicht zu trennen - nie `tr-q`.
 *  · `tr-f` wird erkannt und gemeldet, ist aber kein Lernweg-Layout von Weg „tr" (nur Q, `TUERKISCHE_WEG_LAYOUT_IDS`):
 *    der Vorschlag sagt einem F-Kind später „dein Weg braucht eine andere Tastatur".
 *
 * ★★★ F3-cs (02.10.2026, R1 §6): TSCHECHISCH.
 *  · `Digit2` = „ě" kommt in keiner der sechzehn bisherigen App-Belegungen vor (die Ziffernreihe trägt dort `2` oder
 *    `é`); sie kennzeichnet die tschechischen Tastaturen - auf Windows „Čeština" / „Čeština (QWERTY)" und Mac „Czech" /
 *    „Czech - QWERTY" gleich (gemessen). Zwischen den beiden entscheidet `KeyY`: „z" ⇒ `cs` (QWERTZ, die Norm), „y" ⇒
 *    `cs-qwerty`. Ohne `KeyY`: noch zu wenig gesehen (`null`); mit einem anderen Zeichen: eine fremde Belegung. Ist
 *    `Semicolon` bekannt, muss sie „ů" sein (sonst fremd). Entschieden VOR der Prüfung von `KeyA`/`KeyY`, damit die
 *    Tastendruck-Erkennung (Firefox, Safari) schon nach „ě" und „z"/„y" fertig ist, ohne `KeyA` zu brauchen.
 *  · Die Feststelltaste ändert an `getLayoutMap` nichts (W3C-Entwurf: die Karte meldet die Zeichen „ohne Modifikator");
 *    ob Edge und Chrome das auf der tschechischen Zahlenreihe so halten, ist NICHT gemessen (Messliste). Unschädlich:
 *    `k()` kleinschreibt, ein „Ě" auf `Digit2` ergäbe dasselbe „ě"; der `TastenSammler` nimmt einen Anschlag mit
 *    Feststell an (kein Umschalt) ebenso auf.
 *  · „Czech Programmers" (Windows KBDCZ2) hat die Grundebene der US-Tastatur (`Backquote` = „`", `Semicolon` = „;", die
 *    tschechischen Buchstaben liegen auf AltGr + Zifferntaste, die `getLayoutMap` nicht kennt): sie ist NICHT von `us`
 *    zu trennen und gilt hier als `{ app, us }`. Sie ist kein Lernweg-Layout - das Kind bekommt auf Weg „cs" die
 *    Tastatur-Frage und den Hinweistext, nicht eine stille Erkennung.
 *
 * ── WAS DARAUS WIRD ─────────────────────────────────────────────────────────
 * Nur ein VORSCHLAG (Befund §3.7: „erkennen, vorschlagen, änderbar"): Die App
 * stellt NIE still um, was jemand gewählt hat. Auf einem Schul-PC kann die
 * Belegung von der angeschlossenen Tastatur abweichen.
 *
 * ── WO ES NICHT GEHT ────────────────────────────────────────────────────────
 *  · `getLayoutMap` gibt es nur in Chromium (Edge, Chrome, Opera) und nur auf
 *    der Hauptseite, nicht in einem iframe - jeder Zugriff in try/catch.
 *  · Firefox/Safari: dieselbe Regel aus den ersten echten Tastendrücken
 *    (`event.code` + `event.key`, ohne Umschalt/AltGr) - {@link TastenSammler}.
 *    Sie entscheidet erst, wenn die nötigen Tasten gedrückt wurden (AZERTY
 *    braucht z. B. die 6, Kanada die Taste links der 1) - vorher: nichts.
 *    Seit 28.09.2026 NUR auf sicher Windows ({@link tastenErkennungMoeglich}).
 *  · ⚠️ Mac: NICHT erkannt. Die Regel ist an WINDOWS-Belegungen gemessen; die
 *    Mac-Belegungen weichen ab (Französisch Mac hat auf der 6 ein „§" wie
 *    Belgien Windows - die Regel schlüge „Belgien" vor). Ungemessen gelassen,
 *    nicht geraten (Leitfaden Falle 6/44) - offen im Befund W2b.
 */
import { GRIECHISCHES_FRAGEZEICHEN, type LayoutId } from "./layouts";

/** Alles, was eine Belegung liefern kann - `KeyboardLayoutMap` ODER eine eigene `Map`. */
export interface BelegungLesbar {
  get(code: string): string | undefined;
}

/** Was die Erkennung sagt. `null` heisst: noch zu wenig gesehen, nichts vorschlagen. */
export type TastaturErkannt =
  | { art: "app"; id: LayoutId }
  | { art: "fremd"; name: "bepo" | "afnor" | "kanada-legacy" | "pl-214" | "ro-legacy" | "unbekannt" };

/**
 * Die Regel aus dem Windows-Befund §3.7 - rein, testbar. Fehlt eine Taste, die
 * die Entscheidung braucht, ist das Ergebnis `null` (nie geraten).
 */
export function erkenneTastatur(b: BelegungLesbar): TastaturErkannt | null {
  const roh = (code: string) => b.get(code);
  const k = (code: string) => {
    const w = roh(code);
    return w === undefined ? undefined : w.toLowerCase();
  };
  const q = k("KeyQ");
  const a = k("KeyA");
  const y = k("KeyY");
  if (q === "b") return { art: "fremd", name: "bepo" };

  // ★★★ G3b (25.10.2026): die nicht-lateinischen Belegungen (Kyrillisch, Griechisch) - VOR allen lateinischen Prüfungen:
  // ihre Buchstabentasten tragen kein a-z, jede lateinische Regel unten hiesse sonst „unbekannt" (siehe Kopf).
  const nichtLatein = erkenneNichtLatein(k);
  if (nichtLatein !== undefined) return nichtLatein;

  // ★★★ G3b (25.10.2026): die neuen LATEINISCHEN Belegungen - VOR Türkisch, Tschechisch und den Regeln über KeyA/KeyY, an
  // Tasten, die in keiner bisherigen Belegung so vorkommen (Wächter je Sprache: keine bisherige wird eine neue, und umgekehrt).
  // Ungarisch (Rezept F3.3 d, Bauplan H9): BracketLeft = „ő" (in keiner anderen Belegung) - ist Quote bekannt, muss es „á" sein
  // (Semicolon „é" teilt Ungarisch mit ch-fr, daran wird NICHT entschieden). KeyY „z" ⇒ hu (QWERTZ), „y" ⇒ hu-101; ohne KeyY
  // noch zu wenig gesehen. Gemessen in Edge (beide).
  if (k("BracketLeft") === "ő") {
    const quoteHu = k("Quote");
    if (quoteHu !== undefined && quoteHu !== "á") return { art: "fremd", name: "unbekannt" };
    if (y === "z") return { art: "app", id: "hu" };
    if (y === "y") return { art: "app", id: "hu-101" };
    return y === undefined ? null : { art: "fremd", name: "unbekannt" };
  }
  // Niederländisch, Windows „Dutch" (Nebenweg): Semicolon = „+" (in keiner anderen Belegung) und links der 1 „@". US-International
  // (Bezug NL) hat die Grundebene der US-Tastatur und ist per `getLayoutMap` NICHT von `us` zu trennen (wie Polnisch programisty) -
  // die Bestätigung am Anschlag ist {@link bestaetigtUsInternational}.
  if (k("Semicolon") === "+") {
    const bqNl = roh("Backquote");
    if (bqNl === "@") return { art: "app", id: "nl-dutch" };
    return bqNl === undefined ? null : { art: "fremd", name: "unbekannt" };
  }
  // Portugiesisch (Bauplan I22): Semicolon = „ç" (in keiner bisherigen Belegung). Links der 1 „\" ⇒ Portugal (dann muss Quote,
  // wenn bekannt, „º" sein), „'" ⇒ Brasilien ABNT2. Ohne die Taste links der 1: Quote „º" ⇒ Portugal; sonst noch zu wenig gesehen
  // (die Tilde-Totaste auf Quote meldet in Firefox kein Zeichen). Ungemessen im Browser (nur Windows-Tabelle).
  if (k("Semicolon") === "ç") {
    const bqPt = roh("Backquote");
    const quotePt = k("Quote");
    if (bqPt === "\\") return quotePt === undefined || quotePt === "º" ? { art: "app", id: "pt" } : { art: "fremd", name: "unbekannt" };
    if (bqPt === "'") return { art: "app", id: "br-abnt2" };
    if (bqPt !== undefined) return { art: "fremd", name: "unbekannt" };
    return quotePt === "º" ? { art: "app", id: "pt" } : null;
  }
  // Rumänisch (Bauplan R21): Standard - Semicolon „ș" (Komma, U+0219) und Quote „ț" (U+021B). Legacy - Semicolon „ş" (CEDILLE,
  // U+015F wie Türkisch!) mit Quote „ţ" oder BracketLeft „ă": KEIN Lernweg-Layout, gemeldet als `ro-legacy` (die Einrichtung
  // bietet die Umstellung an). ⚠️ VOR Türkisch: dort führte „ş" auf Semicolon ohne BracketLeft sonst zu `tr-q`. Programmers hat die
  // US-Grundebene (nicht trennbar, gilt als `us`). Ungemessen im Browser.
  if (k("Semicolon") === "ș") {
    const quoteRo = k("Quote");
    if (quoteRo !== undefined && quoteRo !== "ț") return { art: "fremd", name: "unbekannt" };
    return y === "y" || y === undefined ? { art: "app", id: "ro" } : { art: "fremd", name: "unbekannt" };
  }
  if (k("Semicolon") === "ş" && (k("Quote") === "ţ" || k("BracketLeft") === "ă")) return { art: "fremd", name: "ro-legacy" };
  // Schwedisch/Finnisch: Semicolon „ö" UND KeyY „y" (Deutsch und Schweiz haben ö auf Semicolon, aber z auf KeyY); ist BracketLeft
  // bekannt, muss sie „å" sein, Quote „ä". Windows „Swedish" und „Finnish" sind nicht zu trennen (gleiche Belegung) ⇒ beide `sv`.
  if (k("Semicolon") === "ö" && y === "y") {
    const klammerSv = k("BracketLeft");
    const quoteSv = k("Quote");
    if ((klammerSv !== undefined && klammerSv !== "å") || (quoteSv !== undefined && quoteSv !== "ä")) return { art: "fremd", name: "unbekannt" };
    return { art: "app", id: "sv" };
  }
  // ★★★ G3b (25.10.2026): LATEINISCHE NEUE - Einfügestelle

  // ★★★ F3-tr: Türkisch - VOR der Prüfung von `KeyA`/`KeyY` (siehe Kopf). Beide Kennungen kommen in keiner der
  // vierzehn bisherigen Belegungen vor (Test: `tastenflow-tastaturen-tr.test.ts`).
  const semiTr = k("Semicolon");
  if (semiTr === "ş") {
    const klammer = k("BracketLeft");
    return klammer === undefined || klammer === "ğ" ? { art: "app", id: "tr-q" } : { art: "fremd", name: "unbekannt" };
  }
  if (a === "u") {
    const quoteTr = k("Quote");
    // Der Apple-eigene F-Entwurf (Mac „Turkish") hat dieselbe Grundreihe, aber `BracketLeft` = „;" (Windows F: „q"):
    // ist `BracketLeft` bekannt und nicht „q", ist es eine fremde Belegung.
    const klammerF = k("BracketLeft");
    if (klammerF !== undefined && klammerF !== "q") return { art: "fremd", name: "unbekannt" };
    if (quoteTr === "ş" || q === "f") return { art: "app", id: "tr-f" };
    // `KeyA` = „u", aber weder `Quote` noch `KeyQ` gesehen: noch zu wenig - nichts vorschlagen. Eine der beiden
    // gesehen und keine passt: eine fremde Belegung.
    return quoteTr === undefined && q === undefined ? null : { art: "fremd", name: "unbekannt" };
  }

  // ★★★ F3-cs: Tschechisch - ebenfalls VOR `KeyA`/`KeyY` (siehe Kopf). Die Zahlenreihe trägt Buchstaben: `Digit2` = „ě".
  if (k("Digit2") === "ě") {
    const semiCs = k("Semicolon");
    if (semiCs !== undefined && semiCs !== "ů") return { art: "fremd", name: "unbekannt" };
    if (y === "z") return { art: "app", id: "cs" };
    if (y === "y") return { art: "app", id: "cs-qwerty" };
    return y === undefined ? null : { art: "fremd", name: "unbekannt" };
  }

  if (a === undefined || y === undefined) return null;

  // AZERTY (Frankreich, Belgien, AFNOR)
  if (a === "q") {
    const eins = k("Digit1");
    if (eins === "à") return { art: "fremd", name: "afnor" };
    const sechs = k("Digit6");
    if (sechs === undefined) return null;
    if (sechs === "§") return { art: "app", id: "be" };
    if (sechs === "-") return { art: "app", id: "fr" };
    return { art: "fremd", name: "unbekannt" };
  }

  // QWERTZ (Deutschland/Österreich, Schweiz deutsch und französisch)
  if (y === "z") {
    const semi = k("Semicolon");
    const minus = k("Minus");
    if (semi === undefined) return null;
    if (semi === "é") {
      const quote = k("Quote");
      if (quote === undefined) return null;
      return quote === "à" ? { art: "app", id: "ch-fr" } : { art: "fremd", name: "unbekannt" };
    }
    // ★ F3-pl: Polski (214) und Mac „Polish": `KeyY` = „z", `Semicolon` = „ł" (auf keiner anderen Belegung
    // der App die Grundebene), dazu `Quote` = „ą" (Windows 214 und Mac „Polish" gleich). Ohne `Quote`: noch
    // zu wenig gesehen; mit einer anderen `Quote`: eine fremde Belegung. Kein Lernweg-Layout - nur der Name.
    if (semi === "ł") {
      const quote = k("Quote");
      if (quote === undefined) return null;
      return quote === "ą" ? { art: "fremd", name: "pl-214" } : { art: "fremd", name: "unbekannt" };
    }
    if (minus === undefined) return null;
    if (semi === "ö" && minus === "ß") return { art: "app", id: "de" };
    if (semi === "ö" && minus === "'") return { art: "app", id: "ch" };
    return { art: "fremd", name: "unbekannt" };
  }

  // QWERTY (Spanien, Lateinamerika, Kanada zweimal, USA, Grossbritannien)
  const semi = k("Semicolon");
  if (semi === undefined) return null;
  // ★★★ F3-it (02.10.2026, R1 §5): Italienisch (Windows 141 und 142, Grundebene gleich - die zwei sind
  // NICHT zu trennen, beide ⇒ „it"). `Semicolon` = „ò" kommt in keiner der elf anderen Belegungen vor;
  // dazu `Quote` = „à" (wie bei ch-fr), damit keine fremde Belegung mit „ò" durchgeht. Fehlt `Quote`:
  // noch zu wenig gesehen. Mac „Italiano - Pro" und „Italiano" (QZERTY) werden nicht erkannt (Mac: gar
  // nicht, siehe Kopf); die QZERTY hätte an `KeyW` = „z" erkennbar sein können.
  if (semi === "ò") {
    const quote = k("Quote");
    if (quote === undefined) return null;
    return quote === "à" ? { art: "app", id: "it" } : { art: "fremd", name: "unbekannt" };
  }
  const bq = roh("Backquote");
  if (semi === "ñ") {
    if (bq === undefined) return null;
    if (bq === "º") return { art: "app", id: "es" };
    if (bq === "|") return { art: "app", id: "latam" };
    return { art: "fremd", name: "unbekannt" };
  }
  if (bq === undefined) return null;
  if (bq === "/") return { art: "app", id: "ca-csa" };
  if (bq === "#") return { art: "app", id: "ca-fr" };
  if (bq === "°") return { art: "fremd", name: "kanada-legacy" };
  const bs = roh("Backslash");
  if (bs === undefined) return null;
  if (semi !== ";") return { art: "fremd", name: "unbekannt" };
  if (bs === "#") return { art: "app", id: "uk" };
  if (bs === "\\") return { art: "app", id: "us" };
  return { art: "fremd", name: "unbekannt" };
}

/**
 * ★★★ G3b (25.10.2026): Kyrillisch und Griechisch. `undefined` heisst: keine dieser Belegungen (die lateinischen Regeln
 * entscheiden); `null`: eine davon, aber noch zu wenig gesehen; sonst das Ergebnis. Die Kennungen (Grundebene, ohne
 * Umschalt) stehen in der Windows-Tabelle vom 25.10.2026 und sind in Edge 156 GEMESSEN (bg, el), siehe Kopf.
 */
function erkenneNichtLatein(k: (code: string) => string | undefined): TastaturErkannt | null | undefined {
  const a = k("KeyA");
  const q = k("KeyQ");
  const w = k("KeyW");
  const bq = k("Backquote");
  const bs = k("Backslash");
  // Bulgarisch BDS und Schreibmaschine: KeyA = „ь" (kommt in keiner anderen Belegung vor). Dazwischen entscheiden die Taste
  // links der 1 („(" BDS, „`" Schreibmaschine) oder die Taste am Ende der Grundreihe („„" BDS, „(" Schreibmaschine).
  if (a === "ь") {
    if (q !== undefined && q !== ",") return { art: "fremd", name: "unbekannt" };
    if (bq === "(" || bs === "„") return { art: "app", id: "bg" };
    if (bq === "`" || bs === "(") return { art: "app", id: "bg-schreibm" };
    return bq === undefined && bs === undefined ? null : { art: "fremd", name: "unbekannt" };
  }
  // Bulgarisch phonetisch: KeyA = kyrillisches „а"; neu: KeyQ „ч", KeyW „ш", links der 1 „ю"; traditionell: KeyQ „я",
  // KeyW „в", links der 1 „ч". Eine andere kyrillische Belegung mit „а" auf A (Serbisch, Mazedonisch …) ⇒ fremd.
  if (a === "а") {
    if (q === "ч" || w === "ш" || bq === "ю") return { art: "app", id: "bg-phon" };
    if (q === "я" || w === "в" || bq === "ч") return { art: "app", id: "bg-phon-trad" };
    return q === undefined && w === undefined && bq === undefined ? null : { art: "fremd", name: "unbekannt" };
  }
  // Griechisch: KeyA = „α". Zwischen den drei entscheidet KeyQ (408 „;" U+003B, 220 „;" U+037E, 319 „·"); ohne KeyQ die Taste
  // rechts der 0 („-" nur auf 408) oder die Taste rechts neben ΄ („’" nur auf 319). Gemessen in Edge (KeyQ auf 220 = U+037E).
  if (a === "α") {
    if (q === ";") return { art: "app", id: "el" };
    if (q === GRIECHISCHES_FRAGEZEICHEN) return { art: "app", id: "el-220" };
    if (q === "·") return { art: "app", id: "el-319" };
    if (q !== undefined) return { art: "fremd", name: "unbekannt" };
    const minus = k("Minus");
    const quote = k("Quote");
    if (minus === "-") return { art: "app", id: "el" };
    if (quote === "’") return { art: "app", id: "el-319" };
    if (minus === "'" && quote === "¨") return { art: "app", id: "el-220" };
    return null;
  }
  // Ukrainisch: KeyA = „ф" (auch Russisch). Entscheidend ist KeyS: „і" ⇒ Ukrainisch, „ы" ⇒ Russisch (keine App-Tastatur, nie ein
  // ukrainischer Vorschlag - Bauplan U22); ohne KeyS bestätigen Quote „є" oder BracketRight „ї" (Russisch: э, ъ). Zwischen
  // Enhanced und Standard entscheidet NUR die Taste links der 1 („'" bzw. „ё"); ohne sie noch zu wenig gesehen. Ungemessen.
  if (a === "ф") {
    const s = k("KeyS");
    const quoteUk = k("Quote");
    const rechtsUk = k("BracketRight");
    const ukrainisch = s === "і" || (s === undefined && (quoteUk === "є" || rechtsUk === "ї"));
    if (!ukrainisch) return s === undefined && quoteUk === undefined && rechtsUk === undefined ? null : { art: "fremd", name: "unbekannt" };
    if (bq === "'") return { art: "app", id: "ua" };
    if (bq === "ё") return { art: "app", id: "ua-std" };
    return bq === undefined ? null : { art: "fremd", name: "unbekannt" };
  }
  return undefined;
}

/**
 * ★ Firefox/Safari: die Belegung aus echten Tastendrücken sammeln. Nur
 * Anschläge OHNE Umschalt/AltGr/Strg/Befehl (dann ist `key` die Grundebene,
 * wie in `getLayoutMap`), nur einzelne Zeichen - eine Totaste meldet `"Dead"`
 * ohne ihr Zeichen und zählt darum nicht.
 */
export class TastenSammler implements BelegungLesbar {
  private readonly belegung = new Map<string, string>();

  /** Einen Anschlag aufnehmen. `true`, wenn er etwas Neues beigetragen hat. */
  nimm(e: {
    code?: string;
    key?: string;
    shiftKey?: boolean;
    altKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    repeat?: boolean;
  }): boolean {
    if (!e.code || !e.key || e.repeat) return false;
    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return false;
    if ([...e.key].length !== 1) return false;
    if (this.belegung.get(e.code) === e.key) return false;
    this.belegung.set(e.code, e.key);
    return true;
  }

  get(code: string): string | undefined {
    return this.belegung.get(code);
  }
}

/** Die Minimalform von `navigator.keyboard`, die hier gebraucht wird. */
interface KeyboardApi {
  getLayoutMap(): Promise<BelegungLesbar>;
}

/**
 * Die Belegung des Systems über `navigator.keyboard.getLayoutMap()` - oder
 * `null`, wo es sie nicht gibt (Firefox, Safari, iframe, Fehler). Wirft nie.
 */
export async function leseSystemBelegung(): Promise<BelegungLesbar | null> {
  try {
    if (typeof window === "undefined" || typeof navigator === "undefined") return null;
    // Nur auf der Hauptseite (Befund §3.7) - in einem iframe verweigert Chromium.
    if (window.self !== window.top) return null;
    const kb = (navigator as Navigator & { keyboard?: Partial<KeyboardApi> }).keyboard;
    if (!kb || typeof kb.getLayoutMap !== "function") return null;
    return await kb.getLayoutMap();
  } catch {
    return null;
  }
}

/**
 * Ist die Erkennung auf dieser Plattform verlässlich? Nur mit den gemessenen
 * WINDOWS-Belegungen (siehe Kopf „Wo es nicht geht"). Linux/ChromeOS folgen
 * bei den Grundebenen denselben Normen und laufen mit - aber nur über
 * `getLayoutMap`, nicht aus Tastendrücken ({@link tastenErkennungMoeglich}).
 */
export function erkennungMoeglich(plattform: "windows" | "mac"): boolean {
  return plattform !== "mac";
}

/**
 * ★ Darf die Erkennung aus TASTENDRÜCKEN laufen ({@link TastenSammler})?
 * Nur, wenn das Gerät SICHER Windows ist (28.09.2026,
 * `BEFUND-2026-09-28-VORSCHLAG-FOKUS.md`).
 *
 * `erkennungMoeglich` schliesst nur den Mac aus - alles andere gilt dort als
 * „windows" (`layoutPlattform`), also auch ein Chromebook, Linux, Android mit
 * angesteckter Tastatur. Für `getLayoutMap` ist das in Ordnung (das System
 * meldet seine Belegung selbst). Die Regel aus Tastendrücken dagegen ist nur
 * an WINDOWS-Belegungen gemessen, und sie entscheidet MITTEN im Tippen - dort
 * wird nicht geraten. Kennt der Browser `userAgentData`, gilt dessen
 * Plattform; sonst die Zeichenkette „Windows" in der Browserkennung.
 */
export function tastenErkennungMoeglich(ua: string, uaDataPlattform?: string): boolean {
  if (uaDataPlattform) return uaDataPlattform === "Windows";
  return /\bWindows\b/.test(ua) && !/Windows Phone/.test(ua);
}

/**
 * ★★★ F3-pl (02.10.2026, R1 §7.4): Beleg, dass die eingestellte Belegung „Polski (programisty)" (Windows)
 * oder „Polish - Pro" (Mac) ist - der Anschlag AltGr + A (Mac: Option + A) ergibt „ą" auf der Taste `KeyA`.
 * `getLayoutMap` sieht nur die Grundebene und kann sie nicht von `us` trennen (Kopf der Datei); dieser
 * eine Anschlag kann es. Eine REINE Funktion: sie liest nur `code` und `key`, nicht die Zusatztasten -
 * wer „ą" auf `KeyA` erzeugt, hat die Programmierer-Belegung (auf „Polski (214)" liegt „ą" auf `Quote`,
 * auf US erzeugt AltGr + A ein „a" oder - am Mac - ein „å"). Auch „Ą" (mit Umschalt) belegt es.
 * Die Einrichtung ruft sie später an der Probe-Taste („Drücke AltGr und A") auf; hier ist nur der Wächter.
 */
export function bestaetigtPolnischProgrammierer(e: { code?: string; key?: string }): boolean {
  return e.code === "KeyA" && (e.key === "ą" || e.key === "Ą");
}

/**
 * ★★★ G3b (25.10.2026, Bauplan nl N9): Beleg, dass die eingestellte Belegung „United States-International" ist (Weg „nl", Bezug
 * Niederlande) und nicht die gewöhnliche US-Tastatur - `getLayoutMap` kann sie nicht trennen (gleiche Grundebene). Der Anschlag auf
 * die Taste rechts neben ; (`Quote`) meldet auf US-International eine Totaste (`key` = „Dead"), auf US ein „'". Eine REINE Funktion
 * wie {@link bestaetigtPolnischProgrammierer}: `true` heisst US-International, `false` US, `null` ein anderer Anschlag. Ungemessen
 * in Chrome/Firefox (Edge: Quote ⇒ Dead, gemessen).
 */
export function bestaetigtUsInternational(e: { code?: string; key?: string }): boolean | null {
  if (e.code !== "Quote") return null;
  if (e.key === "Dead") return true;
  if (e.key === "'" || e.key === "\"") return false;
  return null;
}
