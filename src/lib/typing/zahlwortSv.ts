/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ZAHLWORT IN SCHWEDISCH - Einhängepunkt.
 *
 * ★ O-INHALT-SV (29.10.2026): geschrieben nach Glossar `GLOSSAR-sv.md` (Zahlwörter): noll · ett · två · tre · fyra · fem · sex · sju ·
 * åtta · nio · tio · elva · tolv · tretton · fjorton · femton · sexton · sjutton · arton · nitton · tjugo · trettio · fyrtio · femtio ·
 * sextio · sjuttio · åttio · nittio · hundra · tusen · miljon. **Zusammengeschrieben** (tjugoett, hundratjugo, tvåtusen); unter einer
 * Million ein Wort, „en miljon" getrennt. Zählform „ett" („tjugoett", „hundraett"). Vor „hundra" und „tusen" steht bei EINEM Hundert
 * bzw. Tausend kein „ett" („hundra", „tusen", „tusenhundra") - so schreibt es ein Kind; „etthundra"/„ettusen" (Schecks) nicht.
 * Verteiler: `uebungsformen/zahlendiktat.ts` (`ZAHLWORT_GERUEST`). `zahlwort(n, "sv")` wirft weiter absichtlich.
 * Wächter: `tests/tastenflow-zahlwort-pt-br-sv.test.ts`.
 * ⚠️ Gegen das Sprachwissen des Baus gelesen (Glossar: „vor dem Bau mit SAOL abgleichen"), nicht von einer Person mit Schwedisch
 * als Erstsprache.
 */

export const MAX_ZAHL_SV = 1_000_000;

const BIS_19 = [
  "noll", "ett", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio",
  "tio", "elva", "tolv", "tretton", "fjorton", "femton", "sexton", "sjutton", "arton", "nitton",
];
const ZEHNER = ["", "", "tjugo", "trettio", "fyrtio", "femtio", "sextio", "sjuttio", "åttio", "nittio"];

/** 1 bis 999, ein Wort. */
function bis999(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  let wort = h === 0 ? "" : h === 1 ? "hundra" : `${BIS_19[h]}hundra`;
  if (rest > 0) wort += rest < 20 ? BIS_19[rest] : `${ZEHNER[Math.floor(rest / 10)]}${rest % 10 > 0 ? BIS_19[rest % 10] : ""}`;
  return wort;
}

/** Zusammensetzen: drei gleiche Mitlaute werden zu zwei („ett" + „tusen" ⇒ „tjugoettusen", wie „ettusen"). */
function fuege(a: string, b: string): string {
  return a.length >= 2 && a[a.length - 1] === a[a.length - 2] && b[0] === a[a.length - 1] ? a + b.slice(1) : a + b;
}

/** Das schwedische Zahlwort von 0 bis 1.000.000. */
export function zahlwortSv(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_SV) throw new RangeError(`zahlwortSv nur für 0 bis ${MAX_ZAHL_SV}, nicht ${n}`);
  if (n === 0) return "noll";
  if (n === MAX_ZAHL_SV) return "en miljon";
  const tausend = Math.floor(n / 1000);
  const rest = n % 1000;
  const kopf = tausend === 0 ? "" : tausend === 1 ? "tusen" : fuege(bis999(tausend), "tusen");
  return kopf + (rest > 0 ? bis999(rest) : "");
}

/** Ein Zahlwort je Zahl (0 bis 1.000.000) in Schwedisch. */
export const ZAHLWORT_SV: ((n: number) => string) | null = zahlwortSv;
