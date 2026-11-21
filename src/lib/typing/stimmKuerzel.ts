/**
 * ★★★ F58 (29.10.2026): unter welchem SPRACHKÜRZEL die Stimmen einer Sprache stehen - `voice.lang` beginnt mit ihm („pt-BR", „uk-UA").
 *
 * Bis hierher nahmen vier Stellen einfach die ersten zwei Buchstaben der Programm-Sprache (`firstVoiceURIForLang`, `stimmeBeimEinschalten`,
 * `stimmenZurAuswahl`, gemessen 29.10.2026). Für jede Sprache ausser einer stimmt das: der Weg „br" (Portugiesisch Brasilien) hat
 * Stimmen mit `lang` „pt-BR" - „br" fand KEINE davon. Folge wäre gewesen: auf einem Gerät mit brasilianischer Stimme der Hinweis
 * „keine Stimme installiert", im Auswahlfeld keine einzige brasilianische Stimme, und beim Sprachwechsel keine Stimme gewählt.
 *
 * Die Ausnahme steht hier EINMAL. Wächter: `tests/tastenflow-f58-vorlesen-neun.test.ts` verlangt für jede Sprache
 * `stimmKuerzel(lang) === SPRACH_TAG[lang].slice(0, 2)` - eine neue Sprache mit eigenem Kürzel fällt dort auf.
 *
 * Rein, ohne Abhängigkeiten (auch `stimmHinweis.ts` liest es).
 */
const AUSNAHMEN: Readonly<Record<string, string>> = { br: "pt" };

/** Die REGION, die eine Sprache unter den Stimmen ihres Kürzels bevorzugt (Portugal gegen Brasilien), sonst `null`. */
const REGION: Readonly<Record<string, string>> = { pt: "pt-pt", br: "pt-br" };

/** Das Sprachkürzel der Stimmen einer Programm-Sprache („br" ⇒ „pt", „uk" ⇒ „uk", „de-AT" ⇒ „de"). */
export function stimmKuerzel(lang: string): string {
  const l = lang.toLowerCase();
  return AUSNAHMEN[l] ?? l.slice(0, 2);
}

/** Die bevorzugte Region (`pt` ⇒ „pt-pt", `br` ⇒ „pt-br"), sonst `null` - als Anfang von `voice.lang`, klein, mit Bindestrich. */
export function stimmRegion(lang: string): string | null {
  return REGION[lang.toLowerCase()] ?? null;
}

/** Hat eine Stimme mit diesem `voice.lang` die Region? („pt_BR" und „pt-BR" gelten gleich.) */
export function stimmeInRegion(voiceLang: string, region: string): boolean {
  return voiceLang.toLowerCase().replace("_", "-").startsWith(region);
}
