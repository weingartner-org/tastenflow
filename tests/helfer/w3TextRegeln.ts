/**
 * Die Regeln für JEDE Textzeile der Tippchallenge-Bänke und Serien auf den Wegen „bg", „el", „uk" (W3, 30.10.2026) - eine Stelle für
 * den Prüfer `scripts/pruefe-schreibproben.mts`, die Wächter `tests/tastenflow-reto-{bg,el,uk}.test.ts` und `-serien-…`.
 *
 * Quelle: die Tastaturen selbst (`layouts.ts`), die Glossare, die Prüfberichte der Charge 1. Eine Zeile gilt nur, wenn JEDES Zeichen auf
 * ALLEN Tastaturen des Weges einen Griff hat. Gemessen daraus:
 *  · bg: kein `ѝ` und kein `€` (fehlen auf bg-schreibm), kein `_` (fehlt auf bg), kein `'`, keine typografischen Zeichen.
 *  · uk: kein `'` und kein `₴` (fehlen auf ua-std) - Wörter mit Apostroph kommen darum in den Bänken nicht vor; kein ы э ё ъ.
 *  · el: Tonos über die Totaste; das Fragezeichen des Griechischen ist `;`, das lateinische `?` fehlt auf el-319.
 * Lateinische Buchstaben haben auf keiner dieser Tastaturen einen Griff - auch nicht im Niveau „code".
 */
import { layoutById, type KeyboardLayout, type LayoutId } from "../../src/lib/typing/layouts";
import { KOMBIZEICHEN_EL } from "../../src/lib/typing/totasten";
import { istKernGesperrtBg } from "../../src/lib/typing/sperrlisteBg";
import { istKernGesperrtEl } from "../../src/lib/typing/sperrlisteEl";
import { istKernGesperrtUk } from "../../src/lib/typing/sperrlisteUk";

export type W3Weg = "bg" | "el" | "uk";
export const W3_WEGE: readonly W3Weg[] = ["bg", "el", "uk"];

export const W3_TASTATUREN: Readonly<Record<W3Weg, readonly LayoutId[]>> = {
  bg: ["bg", "bg-schreibm", "bg-phon", "bg-phon-trad"],
  el: ["el", "el-220", "el-319"],
  uk: ["ua", "ua-std"],
};

const KERN: Readonly<Record<W3Weg, (w: string) => boolean>> = { bg: istKernGesperrtBg, el: istKernGesperrtEl, uk: istKernGesperrtUk };

/** Griff ohne Totaste: Reihen, Zugang, oder Umschalt auf der Taste des Kleinbuchstabens. */
function griff(l: KeyboardLayout, c: string): boolean {
  if (l.missing.includes(c) || (l.grossFehlt ?? []).includes(c)) return false;
  const zugang = l.access[c];
  if (zugang) return !zugang.dead;
  if (l.rows.some((r) => r.keys.includes(c))) return true;
  const klein = c.toLowerCase();
  return klein !== c && l.rows.some((r) => r.keys.includes(klein));
}

/** Griff samt griechischer Totaste (Tonos, Dialytika): die Totaste UND der Grundbuchstabe müssen da sein, auch für die Grossform. */
export function w3Tippbar(l: KeyboardLayout, c: string): boolean {
  if (c === " " || griff(l, c)) return true;
  const klein = c.toLowerCase();
  const k = KOMBIZEICHEN_EL.find((x) => x.zeichen === klein);
  if (!k) return false;
  const tot = l.access[k.tot];
  return !!tot?.dead && griff(l, k.dann);
}

/** Jedes Zeichen der Zeile, das auf einer Tastatur des Weges keinen Griff hat. */
export function w3TastaturBefunde(zeile: string, weg: W3Weg): string[] {
  const out: string[] = [];
  for (const c of new Set(zeile)) {
    for (const id of W3_TASTATUREN[weg]) {
      if (!w3Tippbar(layoutById(id), c)) out.push(`„${c}" fehlt auf der Tastatur ${id}`);
    }
  }
  return out;
}

const FREMD: Readonly<Record<W3Weg, RegExp>> = {
  bg: /[ыэёѝЫЭЁЍіїєґІЇЄҐ]/u,
  uk: /[ыэёъЫЭЁЪ]/u,
  el: /[А-Яа-яЁё]/u,
};
const LATEIN = /[A-Za-z]/;
const WORT_RAND = /[\s,.;:!?"()«»=+/%*\-_№§$€]+/u;

/** Alle Verstösse einer Zeile gegen die Regeln des Weges (leer = in Ordnung). `istCode`: nur Schrift und Griffe, keine Satzzeichen-Regeln. */
export function w3ZeilenFehler(zeile: string, weg: W3Weg, istCode = false): string[] {
  const f: string[] = [];
  if (LATEIN.test(zeile)) f.push("lateinischer Buchstabe - auf dieser Tastatur nicht tippbar");
  const fremd = FREMD[weg].exec(zeile);
  if (fremd) f.push(`„${fremd[0]}" gehört nicht in diesen Weg`);
  if (zeile.normalize("NFC") !== zeile) f.push("nicht NFC");
  if (!istCode) {
    if (/\s[,.?!:;]/u.test(zeile)) f.push("Leerzeichen vor einem Satzzeichen");
    if (/^\s*-\s/u.test(zeile)) f.push("Dialogstrich am Zeilenanfang (wörtliche Rede steht in Anführung)");
    if (weg === "el" && zeile.includes("?")) f.push("griechisches Fragezeichen ist `;`");
    if (weg === "el" && /ς(?=\p{L})/u.test(zeile)) f.push("ς mitten im Wort");
  }
  if (weg === "el" && /(?<=\p{L})σ(?!\p{L})/u.test(zeile) && !istCode) f.push("σ am Wortende (ς)");
  for (const w of zeile.split(WORT_RAND)) if (w && KERN[weg](w)) f.push(`Sperrwort „${w}"`);
  return f;
}

/** Griechisch: der Vorrat des Niveaus plus die Kombizeichen, deren Totaste und Grundbuchstabe drinstehen; die Totasten selbst sind kein Zeichen. */
export function elVorrat(basis: ReadonlySet<string>): Set<string> {
  const out = new Set(basis);
  for (const k of KOMBIZEICHEN_EL) if (basis.has(k.tot) && basis.has(k.dann)) out.add(k.zeichen);
  for (const t of ["΄", "¨", "΅"]) out.delete(t);
  return out;
}
