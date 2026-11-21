/**
 * ★★★ DIE FRANZÖSISCHE LANDESVARIANTE (★ E2b, 25.09.2026, Gerüst).
 *
 * Bauplan: `apps/tastenflow/BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md`,
 * §10.1 - Vorgabe F3. Auftrag E2b Punkt 4.
 *
 * ★★★ VIER WERTE STATT ZWEI, SONST DASSELBE MUSTER WIE `schreibweise.ts`
 * (britisch/amerikanisch): eine Grundform (Frankreich) und drei dünne
 * Überlagerungen (Belgien, Schweiz, Kanada) - keine Taste hängt an der
 * Variante, nur Wörter, Zahlwörter und Leerzeichen (§10.1). Diese Datei
 * VERALLGEMEINERT die Form von `schreibweise.ts` (Typ, `istX`, Speicher-
 * Schlüssel, `gespeicherteX`/`xMerken`, reine `bestimmeX`, lebendige
 * `xVariante()`) - EIGENE, kleine `lies`/`schreib`-Helfer statt einer
 * gemeinsamen Funktion: Dasselbe Muster steht schon so, unabhängig
 * voneinander, in acht Dateien dieses Baums (`uebezeitTopf.ts`,
 * `merkfenster.ts`, `sprache.ts` …) - eine neunte Kopie trägt kein Risiko für
 * GB/US, ein gemeinsamer Helfer HIER hätte `schreibweise.ts` selbst anfassen
 * müssen (Golden-Test „en" darf nicht wackeln, Auftrag E2b).
 *
 * ★ E9a (26.09.2026, Bauplan §1.2 F8, §10.1): die erste WIRKUNG - siehe
 * {@link wandleTypografie}. Zahlwörter (`zahlwortFr`) und die
 * Lehrkraft-Oberfläche kennen die Variante weiterhin nicht (E12).
 */
import { browserSprachen } from "../bedienSprache/sprache";
import { franzoesischLehrgangProbeAn } from "./lernweg";
import { activeLayoutId, type LayoutId } from "./layouts";

/** Die vier Landesvarianten des Französischen (Bauplan §10.1) - Frankreich ist die Grundform. */
export type FranzVariante = "fr-FR" | "fr-BE" | "fr-CH" | "fr-CA";

export function istFranzVariante(x: unknown): x is FranzVariante {
  return x === "fr-FR" || x === "fr-BE" || x === "fr-CH" || x === "fr-CA";
}

/** Die gemerkte Wahl (Schalter der Bedienung, oder eine Klasse, die sie festlegt). */
export const FRANZ_VARIANTE_SCHLUESSEL = "tastenflow-franz-variante";

// ⚠️ Jeder Zugriff auf `localStorage` in `try/catch` (wie `bedienSprache/sprache.ts`
// und `schreibweise.ts`): Safari im privaten Modus und Browser mit gesperrten
// Websitedaten werfen schon beim Zugriff.
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

/** Die gemerkte Landesvariante, oder `null`, wenn auf diesem Gerät noch keine feststeht. */
export function gespeicherteFranzVariante(): FranzVariante | null {
  const w = lies(FRANZ_VARIANTE_SCHLUESSEL);
  return istFranzVariante(w) ? w : null;
}

export function franzVarianteMerken(variante: FranzVariante): void {
  schreib(FRANZ_VARIANTE_SCHLUESSEL, variante);
}

/**
 * §10.1: die erste `fr-*`-Sprache der Liste entscheidet - `fr-BE` ⇒ Belgien,
 * `fr-CH` ⇒ Schweiz-Überlagerung, `fr-CA` ⇒ Kanada, jedes andere `fr-*`
 * (oder ein blosses `fr`) ⇒ Frankreich, die Grundform. Kommt in der ganzen
 * Liste kein Französisch vor (oder ist sie leer), gilt ebenfalls Frankreich.
 *
 * ★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.4, Johannes
 * Entscheidung 5): `fr-LU` ⇒ FRANKREICH, nicht mehr Schweiz. In Luxemburg
 * zählt man wie in Frankreich (soixante-dix, quatre-vingts, quatre-vingt-dix)
 * - die Schweiz-Überlagerung brachte Kindern dort „huitante" bei. Eine eigene
 * Variante braucht es nicht (Johannes: „wenn dort ohnehin wie in Frankreich
 * gezählt wird"). Die TASTATUR bleibt die schweizerische (`ch-fr`, siehe
 * `vorschlagLayout`) - nur die Wörter folgen Frankreich.
 *
 * Dieselbe Reihenfolge wie {@link erkenneVarianteAusSprachen} („schreibweise.ts"):
 * nicht die erste Sprache der Liste überhaupt, sondern die erste FRANZÖSISCHE
 * entscheidet.
 */
export function erkenneFranzVarianteAusSprachen(sprachen: readonly string[]): FranzVariante {
  for (const s of sprachen) {
    const code = s.trim();
    if (/^fr[-_]be(?:[-_]|$)/i.test(code)) return "fr-BE";
    if (/^fr[-_]ch(?:[-_]|$)/i.test(code)) return "fr-CH";
    // ★ W1: Luxemburg zählt wie Frankreich (siehe oben).
    if (/^fr[-_]lu(?:[-_]|$)/i.test(code)) return "fr-FR";
    if (/^fr[-_]ca(?:[-_]|$)/i.test(code)) return "fr-CA";
    if (/^fr(?:[-_]|$)/i.test(code)) return "fr-FR";
  }
  return "fr-FR";
}

/**
 * ★ E10d (26.09.2026, Bauplan §3/§10.1, Auftrag Punkt 2): die TASTATUR als
 * Hinweis - zwischen Klassen-Vorgabe und Browsersprache. Ein Kind, das schon
 * eine französische Tastatur GEWÄHLT hat, hat damit mehr über sein Land
 * gesagt als sein Browser (der auf einem Schulcomputer oft auf Werkseinstellung
 * steht, siehe `vorschlagLayout` in `layouts.ts`, dieselbe Beobachtung für die
 * Tastatur-VORWAHL).
 *
 * `ca-csa`/`ca-fr` ⇒ Kanada, `ch-fr` ⇒ Schweiz - und laut Kopf-Doku dieser
 * Datei (§10.1: „fr-LU teilt sich die Schweiz-Überlagerung, keine eigene
 * vierte Form") gilt das GENAUSO für Luxemburg: Luxemburg benutzt laut
 * Bauplan §3.1 („Luxemburg = ch-fr") dieselbe Tastatur wie die Romandie, und
 * dessen Browsersprache (`fr-LU`) landet in {@link erkenneFranzVarianteAusSprachen}
 * schon auf „fr-CH" - keine dritte Fallunterscheidung nötig. `be` ⇒ Belgien.
 * Die reine AZERTY-Grundtastatur `fr` ist KEIN Hinweis (sie gilt auch in
 * Afrika, siehe Bauplan §3.1) - dort entscheidet weiter die Browsersprache,
 * genau wie jede nicht-französische Tastatur.
 */
export function erkenneFranzVarianteAusLayout(
  layout: LayoutId | null | undefined,
): FranzVariante | null {
  if (layout === "ca-csa" || layout === "ca-fr") return "fr-CA";
  if (layout === "ch-fr") return "fr-CH";
  if (layout === "be") return "fr-BE";
  return null;
}

/**
 * ★ W1 (27.09.2026): Deutet die Sprachliste des Browsers auf Luxemburg?
 * `fr-LU`, `de-LU`, `lb`/`lb-LU` - die Landessprachen dort. Nur ein Hinweis
 * wie jede Browsersprache; die gemerkte Wahl und die Klasse gehen vor.
 */
export function istLuxemburg(sprachen: readonly string[]): boolean {
  return sprachen.some((s) => /^(?:(?:fr|de|lb|en)[-_]lu|lb)(?:[-_]|$)/i.test(s.trim()));
}

/**
 * ★★★ DIE ENTSCHEIDUNG - die ganze Regel an EINER Stelle (§10.1): gespeicherte
 * Wahl > Klasse > TASTATUR (E10d) > Browser. Rein: liest nichts, schreibt
 * nichts.
 */
export function bestimmeFranzVariante(opts: {
  gespeichert: FranzVariante | null | undefined;
  klassenVorgabe?: FranzVariante | null | undefined;
  /**
   * ★ E10d: das gewählte Tastatur-Layout des Geräts (`activeLayoutId()`,
   * `layouts.ts`) - optional, fehlt es (Alt-Aufrufer/Tests), verhält sich die
   * Funktion wie vor E10d (Browser direkt nach der Klasse).
   */
  layout?: LayoutId | null | undefined;
  sprachen: readonly string[];
}): FranzVariante {
  if (istFranzVariante(opts.gespeichert)) return opts.gespeichert;
  if (istFranzVariante(opts.klassenVorgabe)) return opts.klassenVorgabe;
  // ★ W1 (27.09.2026, BEFUND §3.4, Entscheidung 5): Die Tastatur
  // „Schweiz/Luxemburg" sagt nicht, WELCHES der beiden Länder - der Browser
  // eines Geräts in Luxemburg schon. Dann gilt Frankreich (Zahlwörter wie in
  // Frankreich, kein „huitante"), obwohl die Tastatur schweizerisch ist.
  if (opts.layout === "ch-fr" && istLuxemburg(opts.sprachen)) return "fr-FR";
  const ausLayout = erkenneFranzVarianteAusLayout(opts.layout);
  if (ausLayout) return ausLayout;
  return erkenneFranzVarianteAusSprachen(opts.sprachen);
}

/**
 * Die Landesvariante, die gerade gilt - ohne React, wie `englischVariante()`.
 * Dasselbe TOR wie dort: ohne den Probe-Schalter des französischen Lehrgangs
 * bleibt es UNBEDINGT bei „fr-FR" (die Grundform) - eine gemerkte Wahl, eine
 * Klassen-Vorgabe oder ein belgischer/schweizerischer/kanadischer Browser
 * werden dann gar nicht erst gelesen.
 *
 * @param klassenVorgabe die Einstellung der Klasse (künftiges Feld, wie
 *   `tt_classes.schreibweise`), sofern das Kind einer Klasse angehört und sie
 *   eine Vorgabe trägt. `null`/`undefined`/leer heisst „automatisch".
 */
export function franzVariante(
  klassenVorgabe?: FranzVariante | null | undefined,
): FranzVariante {
  if (!franzoesischLehrgangProbeAn()) return "fr-FR";
  return bestimmeFranzVariante({
    gespeichert: gespeicherteFranzVariante(),
    klassenVorgabe,
    // ★ E10d: die Tastatur, die auf diesem Gerät gewählt ist - Stufe zwischen
    // Klasse und Browser (siehe `bestimmeFranzVariante`).
    layout: activeLayoutId(),
    sprachen: browserSprachen(),
  });
}

// ── Die Typografie-Umwandlung (§1.2 F8) ──────────────────────────────────────

/**
 * ★★★ E9a (26.09.2026, Bauplan §1.2 F8, §10.1): Das Leerzeichen vor
 * `; ! ?` (und, anders als bei den anderen dreien, NICHT vor `:`) - Kanada
 * schreibt es ohne, Frankreich/Belgien/Schweiz mit. Die Übungstexte des Weges
 * „fr" werden darum EINHEITLICH in der Form FR/BE/CH gespeichert (Leerzeichen
 * vor allen vieren, wie ein normaler Schulbuch-Satz) - diese Funktion ist die
 * einzige Stelle, die für Kanada davon abweicht.
 *
 * Nur ein GEWÖHNLICHES Leerzeichen wird entfernt (F8: „das geschützte
 * Leerzeichen ist nicht tippbar") - genau eins, denn `fitText` liefert nie
 * mehr als eines hintereinander (`out.replace(/\s+/g, " ")`). Ohne
 * Rückblick auf ein Vorgängerzeichen, damit zwei Satzzeichen kurz
 * hintereinander („dit-il ; ne bouge pas ?") beide ihr Leerzeichen verlieren.
 */
const KANADA_OHNE_LEERZEICHEN_VOR = / ([;!?])/g;

/**
 * ★★★ WENDET DIE LANDES-TYPOGRAFIE AUF EINEN ÜBUNGSTEXT AN (Bauplan §1.2 F8) -
 * dieselbe „letzte Servierstufe" wie {@link wandleSchreibweise} in
 * `schreibweise.ts`: NACH `fitText`, NACH der Ledger-Kennung. Ein Wechsel der
 * Landesvariante verändert darum nie, was ein Kind schon getippt hat, und die
 * Ledger-Kennung selbst bleibt immer gegen die FR/BE/CH-Grundform gebildet.
 *
 * ⚠️ Reihenfolge wichtig (Bauplan §15/Leitfaden §3 Nr. 33): läuft NACH
 * `fitText`, darum sieht diese Funktion nur noch Satzzeichen, die wirklich im
 * servierten Text stehen - ein noch nicht gelerntes `; ! ?` hat `fitText`
 * (`STRIPPABLE_PUNCT`) längst zusammen mit seinem Leerzeichen zu einem
 * einzigen Leerzeichen eingedampft und am Zeilenende getrimmt („Tu viens ?"
 * wird früh zu „Tu viens", nie zu „Tu viens "/„Tu viens?") - für Kanada gibt
 * es an der Stelle dann nichts mehr zu entfernen, kein Sonderfall nötig.
 */
export function wandleTypografie(text: string, variante: FranzVariante): string {
  if (variante !== "fr-CA") return text; // FR/BE/CH: schon in der Grundform
  return text.replace(KANADA_OHNE_LEERZEICHEN_VOR, "$1");
}
