/**
 * ★★★ GEN-HAUPTSPRACHE (29.10.2026): die Paar-Prüfung der Lektions-Wächter der neun neuen Wege (bg el hu nl pt br ro sv uk).
 * Vorbild: `halbesPaar` in `tests/tastenflow-lektionen-cs.test.ts` - hier mit den Paaren des WEGES (`paareGemeinsam`, lernweg.ts):
 * Klammern ( ) [ ] { } auf jedem Weg, dazu „ “ (bg), „ ” (ro), « » (el, pt). `"` ist EINE Taste für beide Seiten: ungerade Anzahl
 * = halbes Paar. Und W-NL1 (Bauplan nl N3): auf `nl-intl` sind `'` und `"` Totasten - davor ein Selbstlaut (bzw. `c`) wird ein
 * Akzentbuchstabe, die Zeile wäre so nicht tippbar.
 */
import { introducedThroughLesson, lektionenFuer } from "../../src/lib/typing/curriculum";
import { generateRound } from "../../src/lib/typing/generator";
import { setLayout, type LayoutId } from "../../src/lib/typing/layouts";
import { lernwegDef, type Lernweg } from "../../src/lib/typing/lernweg";

/** Trägt die Zeile ein halbes Paar (eine offene oder überzählige Klammer/Anführung des Weges, oder ungerade viele `"`)? */
export function halbesPaar(zeile: string, paare: Readonly<Record<string, string>>): boolean {
  const zu = new Map(Object.entries(paare).map(([a, b]) => [b, a]));
  const stapel: string[] = [];
  for (const c of zeile) {
    if (c in paare) stapel.push(c);
    else if (zu.has(c)) {
      if (stapel.pop() !== zu.get(c)) return true;
    }
  }
  return stapel.length !== 0 || (zeile.match(/"/g)?.length ?? 0) % 2 === 1;
}

/** W-NL1: `'` oder `"` direkt vor einem Selbstlaut (oder `'` vor `c`) - auf nl-intl ein Akzentbuchstabe statt zwei Zeichen. */
export function verletztWNl1(zeile: string): boolean {
  return /["'][aeiouyAEIOUY]|'[cC]/.test(zeile);
}

/** Alle Übungszeilen aller Lektionen eines Weges auf einer Tastatur (drei Altersstufen, `durchlaeufe` Runden zu je 10). */
export function lektionsZeilen(weg: Lernweg, tastatur: LayoutId, durchlaeufe = 3): { id: string; stufe: string; text: string }[] {
  setLayout(tastatur);
  const aus: { id: string; stufe: string; text: string }[] = [];
  let stand: string[] | undefined;
  for (const l of lektionenFuer(weg)) {
    stand = introducedThroughLesson(stand, l.id, weg);
    for (const stufe of ["kids", "teens", "erwachsen"] as const)
      for (let k = 0; k < durchlaeufe; k++)
        for (const z of generateRound(l.id, { lernweg: weg, lang: weg, introduced: stand, stufe, count: 10 }))
          aus.push({ id: l.id, stufe, text: z.text });
  }
  return aus;
}

/** Die Zeilen mit halbem Paar (nach den Paaren des Weges), als lesbare Funde. */
export function halbePaareIn(weg: Lernweg, tastatur: LayoutId, durchlaeufe = 3): string[] {
  const paare = lernwegDef(weg).paareGemeinsam ?? {};
  return lektionsZeilen(weg, tastatur, durchlaeufe)
    .filter((z) => halbesPaar(z.text, paare))
    .map((z) => `${z.id}/${z.stufe}: „${z.text}"`);
}
