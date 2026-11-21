/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ALPHABET DES WEGES „el" (Griechisch) für die Alphabetreihen - gefüllt (★ O-INHALT-EL, 29.10.2026).
 *
 * Was hinein gehört (Vorbild `ALPHABET_ORDER_CS` in `alphabetreihen.ts`): die Buchstaben in der Reihenfolge, in der die Sprache
 * SORTIERT (mit `Intl.Collator("el-GR")` messen), klein; Mehrzeichen-Buchstaben als ein Eintrag, wo die Schule sie als einen
 * Buchstaben lehrt (cs: `ch`). Buchstaben, die wie ihr Grundbuchstabe sortieren, gehören nicht in die Reihe.
 * Quelle: Recherche der Sprache (iCloud `recherche-el/`), nicht in `tf-fest`.
 * Verteiler: `uebungsformen/alphabetreihen.ts` (`ALPHABET_ORDER_BY_LERNWEG`). Wächter: `tests/tastenflow-wortspiele-el.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „el" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/**
 * Die 24 Buchstaben des griechischen Alphabets, so wie sie SORTIEREN (gemessen 29.10.2026, Node: `Intl.Collator("el")` ordnet
 * α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω). Das Schluss-Sigma ς fehlt mit Absicht: `Intl.Collator("el", { sensitivity:
 * "base" })` sortiert es wie σ (Vergleich 0) - es ist die Endform des σ, kein eigener Buchstabe. Die Buchstaben mit Tonos ebenso.
 */
export const ALPHABET_ORDER_EL: string[] = [
  "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω",
];
