/**
 * ★★★ DIE SPANISCHE LANDESVARIANTE (★ ES-F7, 27.09.2026).
 *
 * Bauplan: `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md`, §1.2 Vorgabe S2 -
 * „zwei Varianten: `es-ES` (Spanien) und `es-419` (Lateinamerika); erkannt
 * aus Browser-Sprache und Tastatur, je Klasse umstellbar". Grund: „Wortschatz,
 * `vosotros`, Zahl-/Währungsschreibung unterscheiden sich; die Rechtschreibung
 * nicht" - anders als beim Französischen (vier Werte) reichen hier ZWEI.
 *
 * ★★★ DASSELBE MUSTER WIE `franzVariante.ts` (dort ausführlich begründet, mit
 * VIER Werten statt zwei) - eine Grundform (`es-ES`) und eine dünne
 * Überlagerung (`es-419`), keine Taste hängt an der Variante. EIGENE, kleine
 * `lies`/`schreib`-Helfer statt eines gemeinsamen Speicher-Helfers - dasselbe
 * Muster steht schon unabhängig in mehreren Dateien dieses Baums.
 *
 * Die erste WIRKUNG: {@link wandleFormatoNumerico} - die Zahlenschreibung
 * (Dezimal-/Tausendertrennzeichen) nach CLDR `es-419` (Punkt als Dezimal-,
 * Komma als Tausendertrennzeichen) gegen die Grundform `es-ES` (Komma
 * Dezimal-, Punkt Tausendertrennzeichen, Bauplan §5.3: „Spanien 12,5 %,
 * 20 €, 1.200"). Wortschatz/`vosotros` sind Sache der TEXT-Chargen (ES-T,
 * „mit Ort" - Bauplan §5.3), keine algorithmische Umwandlung: ein „vosotros"
 * lässt sich nicht automatisch in ein `es-419`-Wort verwandeln, ohne den Satz
 * neu zu bauen.
 */
import { browserSprachen, dezimalzeichen, esZahlGebietAus } from "../bedienSprache/sprache";
import { spanischLehrgangProbeAn } from "./lernweg";
import { activeLayoutId, type LayoutId } from "./layouts";

/** Die zwei Varianten des Spanischen (Bauplan §1.2 S2) - Spanien ist die Grundform. */
export type EsVariante = "es-ES" | "es-419";

export function istEsVariante(x: unknown): x is EsVariante {
  return x === "es-ES" || x === "es-419";
}

/** Die gemerkte Wahl (Schalter der Bedienung, oder eine Klasse, die sie festlegt). */
export const ES_VARIANTE_SCHLUESSEL = "tastenflow-es-variante";

// ⚠️ Jeder Zugriff auf `localStorage` in `try/catch` (wie `franzVariante.ts`
// und `bedienSprache/sprache.ts`): Safari im privaten Modus und Browser mit
// gesperrten Websitedaten werfen schon beim Zugriff.
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
export function gespeicherteEsVariante(): EsVariante | null {
  const w = lies(ES_VARIANTE_SCHLUESSEL);
  return istEsVariante(w) ? w : null;
}

export function esVarianteMerken(variante: EsVariante): void {
  schreib(ES_VARIANTE_SCHLUESSEL, variante);
}

/**
 * §1.2 S2: die erste `es-*`-Sprache der Liste entscheidet - `es-ES` (oder ein
 * blosses `es`) ⇒ Spanien, die Grundform; JEDE andere spanische Sprache
 * (`es-419`, `es-MX`, `es-AR`, `es-CO` …) ⇒ Lateinamerika. Dieselbe
 * Zweiteilung wie `vorschlagLayout("es", …)` (`layouts.ts`) - kommt in der
 * ganzen Liste kein Spanisch vor, gilt ebenfalls Spanien.
 */
export function erkenneEsVarianteAusSprachen(sprachen: readonly string[]): EsVariante {
  for (const s of sprachen) {
    const code = s.trim();
    if (!/^es(?:[-_]|$)/i.test(code)) continue;
    // Blosses „es" (ohne Land) ⇒ Spanien, wie oben beschrieben - bis 27.09.
    // schlug es hier still auf Lateinamerika durch (Fund ES-H).
    return /^es(?:[-_]es\b|$)/i.test(code) ? "es-ES" : "es-419";
  }
  return "es-ES";
}

/**
 * ★ Wie `erkenneFranzVarianteAusLayout`: die TASTATUR als Hinweis, zwischen
 * Klasse und Browser - ein Kind, das schon eine Tastatur gewählt hat, hat
 * damit mehr über sein Land gesagt als sein Browser (oft Werkseinstellung
 * auf Schulcomputern). `vorschlagLayout` (`layouts.ts`) macht dieselbe
 * Zuordnung in die andere Richtung.
 */
export function erkenneEsVarianteAusLayout(
  layout: LayoutId | null | undefined,
): EsVariante | null {
  if (layout === "latam") return "es-419";
  if (layout === "es") return "es-ES";
  return null;
}

/**
 * ★★★ DIE ENTSCHEIDUNG - die ganze Regel an EINER Stelle: gespeicherte Wahl >
 * Klasse > TASTATUR > Browser. Rein: liest nichts, schreibt nichts.
 */
export function bestimmeEsVariante(opts: {
  gespeichert: EsVariante | null | undefined;
  klassenVorgabe?: EsVariante | null | undefined;
  layout?: LayoutId | null | undefined;
  sprachen: readonly string[];
}): EsVariante {
  if (istEsVariante(opts.gespeichert)) return opts.gespeichert;
  if (istEsVariante(opts.klassenVorgabe)) return opts.klassenVorgabe;
  const ausLayout = erkenneEsVarianteAusLayout(opts.layout);
  if (ausLayout) return ausLayout;
  return erkenneEsVarianteAusSprachen(opts.sprachen);
}

/**
 * Die Landesvariante, die gerade gilt - ohne React, wie `franzVariante()`.
 * Dasselbe Tor: ohne den Probe-Schalter des spanischen Lehrgangs bleibt es
 * UNBEDINGT bei „es-ES" (die Grundform) - eine gemerkte Wahl, eine
 * Klassen-Vorgabe oder eine lateinamerikanische Tastatur/Browsersprache
 * werden dann gar nicht erst gelesen.
 *
 * @param klassenVorgabe die Einstellung der Klasse (künftiges Feld), sofern
 *   das Kind einer Klasse angehört und sie eine Vorgabe trägt.
 *   `null`/`undefined`/leer heisst „automatisch".
 */
export function esVariante(klassenVorgabe?: EsVariante | null | undefined): EsVariante {
  if (!spanischLehrgangProbeAn()) return "es-ES";
  return bestimmeEsVariante({
    gespeichert: gespeicherteEsVariante(),
    klassenVorgabe,
    layout: activeLayoutId(),
    sprachen: browserSprachen(),
  });
}

// ── Die Zahlenformat-Umwandlung (Bauplan §5.3) ──────────────────────────────

/**
 * ★★★ Ein GRUPPIERTES Zahlwort in der Grundform (`es-ES`, wie jeder
 * Übungstext gespeichert ist): Tausendertrennzeichen `.`, Dezimaltrennzeichen
 * `,` - „1.200,50", „12,5", „1.200". Für `es-419` (CLDR-Konvention:
 * Dezimalpunkt, Komma als Tausendertrennzeichen) werden GENAU diese beiden
 * Zeichen vertauscht, NUR innerhalb einer erkannten Zahl - ein gewöhnliches
 * Komma zwischen zwei Wörtern („Sí, claro.") ist keine Zahl und bleibt
 * unberührt.
 *
 * Reihenfolge wie bei `wandleTypografie` (Bauplan-Leitfaden Falle 33): läuft
 * NACH `fitText` und NACH der Ledger-Kennung (`wandleVariante`, corpus.ts) -
 * ein Wechsel der Variante ändert nie, was ein Kind schon getippt hat, und
 * die Ledger-Kennung bleibt immer gegen die `es-ES`-Grundform gebildet.
 *
 * Nur der ZIFFERNBLOCK selbst wird umgestellt: `1.200,50` → ein
 * Tausendergruppen-Muster (eine bis drei Ziffern, dann `.` + genau drei
 * Ziffern, beliebig oft) gefolgt von optional `,` + Nachkommastellen.
 */
const ES_GRUPPENZAHL = /\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+,\d+/g;

function zuEs419(treffer: string): string {
  return treffer.includes(".")
    ? treffer.replace(/\./g, "\u0001").replace(",", ".").replace(/\u0001/g, ",")
    : treffer.replace(",", ".");
}

export function wandleFormatoNumerico(text: string, ziel: EsVariante | string): string {
  // ★ D1 (28.09.2026, Entscheidung Johannes Nr. 15): `ziel` ist ein GEBIET
  // („es-MX", „es-AR", „es-419", „es-ES") - umgestellt wird nur, wo CLDR den
  // Dezimalpunkt führt. „es-419" bleibt wie bisher (CLDR: Punkt), „es-ES"
  // ebenso (Komma, die Grundform). Neu: ein Land mit Komma (Argentinien,
  // Kolumbien, Chile …) bleibt in der Grundform, statt pauschal wie ganz
  // Lateinamerika den Punkt zu bekommen.
  if (dezimalzeichen(ziel) !== ".") return text; // Komma: schon in der Grundform
  return text.replace(ES_GRUPPENZAHL, zuEs419);
}

/**
 * ★★★ D1 (28.09.2026, Entscheidung Johannes Nr. 15): das Gebiet, nach dem
 * erzeugte spanische Übungszeilen ihre Zahlen schreiben - DIESELBE Regel wie
 * die Oberfläche (`zahl(n, "es")`, bedienSprache/texte.ts): das Land der
 * Browsersprache, ohne Land das Komma. Bis hierher schrieb jede `es-419`-
 * Variante den Punkt, auch in Argentinien oder Kolumbien (dort gilt das
 * Komma), und die Oberfläche schrieb immer nach Spanien.
 */
export function esZahlGebiet(): string {
  return esZahlGebietAus(browserSprachen());
}
