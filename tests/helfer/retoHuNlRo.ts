/**
 * ★★★ W3 (30.10.2026): die Regeln der Tippchallenge-Bänke der Wege „hu", „nl", „ro" - EINMAL für alle drei.
 * Vorbild: `tests/helfer/csTextRegeln.ts` und die cs-Teile von `scripts/pruefe-schreibproben.mts`. Der Prüfer und die Wächter
 * `tests/tastenflow-reto-{hu,nl,ro}.test.ts` benutzen dieselben Funktionen. Befund: `BEFUND-2026-10-30-W3-HU-NL-RO.md`.
 *
 *  · Griff: jede Zeile ist mit den Einheiten des Niveaus auf JEDER Tastatur des Weges ungekürzt tippbar (`fitText`, je `setLayout`).
 *  · Zeichensatz des Weges: hu `á é í ó ö ő ú ü ű` (nie `õ û`), nl `ë ï é`, ro `ă â î ș ț` mit Komma (nie Cedille `ş ţ`, nie `ã`).
 *  · ro: Anführung nur `„ ”`, das gerade `"` hat auf `ro` keinen eigenen Griff im Lehrgang.
 *  · nl: W-NL1 - `'` und `"` nie direkt vor einem Selbstlaut (auf `nl-intl` Totasten: es entstünde ein Akzentbuchstabe), `'` auch nie vor `c`.
 *  · Sperrliste: Kern der Sprache, in Code auch die Teile von `snake_case`/`camelCase`.
 *  · Form: kein Leerzeichen vor Satzzeichen, kein Dialogstrich am Anfang, nie doppelte oder Rand-Leerzeichen.
 */
import { allowedFromIntroduced } from "../../src/lib/typing/serien";
import { fitText } from "../../src/lib/typing/corpus";
import { setLayout, TASTATUREN_DER_SPRACHE, type LayoutId } from "../../src/lib/typing/layouts";
import { niveauDef, type ProbenNiveau } from "../../src/lib/typing/schreibprobe";
import { istKernGesperrtHu } from "../../src/lib/typing/sperrlisteHu";
import { istKernGesperrtNl } from "../../src/lib/typing/sperrlisteNl";
import { istKernGesperrtRo } from "../../src/lib/typing/sperrlisteRo";

export const RETO_WEGE = ["hu", "nl", "ro"] as const;
export type RetoWeg = (typeof RETO_WEGE)[number];
export const istRetoWeg = (w: string): w is RetoWeg => (RETO_WEGE as readonly string[]).includes(w);

const SPERRE: Record<RetoWeg, (w: string) => boolean> = { hu: istKernGesperrtHu, nl: istKernGesperrtNl, ro: istKernGesperrtRo };

/** Buchstaben des Weges ausserhalb von a-z (klein und gross). */
export const AKZENTE: Record<RetoWeg, string> = {
  hu: "áéíóöőúüűÁÉÍÓÖŐÚÜŰ",
  nl: "ëïéËÏÉ",
  ro: "ăâîșțĂÂÎȘȚ",
};
/** Satz- und Sonderzeichen, die eine Zeile des Weges überhaupt tragen darf (je Niveau schränkt der Vorrat weiter ein). */
const SONDER: Record<RetoWeg, string> = {
  hu: ".,?!-;:\"'()%/+=_*&<>$@#[]{}|\\€",
  nl: ".,?!-;:\"'()%/+=_*&<>$@#[]{}|\\€",
  ro: ".,-?!:„”;'()%/+=_*&$@#^<>[]\\€",
};

/** Ziffer + Punkt am Zeilenende oder vor einem neuen Satz (Falle „Zeile 2 von 12." ⇒ „zwölfte"). */
export const ZAHL_AM_SATZENDE = /\d\.(?:["”]?$|["”]?\s+["„(]?\p{Lu})/u;

const WORTTRENNER = /[\s,.;:!?"„”()]+/;

/** W-NL1 (Bauplan nl N3, wie `tests/helfer/paareNeueWege.ts`). */
export function verletztWNl1(zeile: string): boolean {
  return /["'][aeiouyAEIOUY]|'[cC]/.test(zeile);
}

const zugelassen = (weg: RetoWeg, c: string): boolean =>
  /[A-Za-z0-9 ]/.test(c) || AKZENTE[weg].includes(c) || SONDER[weg].includes(c);

/** Die Zeichen-Fehler einer Zeile (für Prosa UND Code). */
export function zeichenFehler(weg: RetoWeg, zeile: string): string[] {
  const f: string[] = [];
  for (const c of new Set(zeile)) {
    if (zugelassen(weg, c)) continue;
    if ((c === "ş" || c === "ţ" || c === "Ş" || c === "Ţ") && weg === "ro") f.push(`„${c}" mit Cedille - nur ș ț mit Komma`);
    else if ((c === "õ" || c === "û") && weg === "hu") f.push(`„${c}" - im Ungarischen nur ő und ű`);
    else f.push(`Zeichen „${c}" (U+${c.codePointAt(0)!.toString(16).toUpperCase()}) gehört nicht zum Weg ${weg}`);
  }
  if (weg === "nl" && verletztWNl1(zeile)) f.push("W-NL1: ' oder \" direkt vor einem Selbstlaut (auf nl-intl eine Totaste)");
  return f;
}

/** Die gemeinsame Zeilenregel für Prosa (und für den Text eines Code-Kommentars). */
export function zeilenFehler(weg: RetoWeg, zeile: string): string[] {
  const f = zeichenFehler(weg, zeile);
  if (/^\s*-\s/.test(zeile)) f.push("Dialogstrich am Zeilenanfang");
  if (/\s[,.?!:;]/.test(zeile)) f.push("Leerzeichen vor einem Satzzeichen");
  if (/\s{2,}/.test(zeile) || zeile !== zeile.trim()) f.push("doppelte oder umgebende Leerzeichen");
  for (const w of zeile.split(WORTTRENNER)) if (w && SPERRE[weg](w)) f.push(`Sperrwort „${w}"`);
  if (ZAHL_AM_SATZENDE.test(zeile)) f.push("Satz endet auf Ziffer und Punkt (die Stimme läse eine Ordnungszahl: danach muss noch ein Wort kommen)");
  return f;
}

/** In Code auch die Teile von `snake_case` und `camelCase`. */
export function sperrTrefferCode(weg: RetoWeg, zeile: string): string[] {
  const out: string[] = [];
  for (const w of zeile.match(/[\p{L}_']+/gu) ?? []) {
    for (const teil of w.split(/_|(?=[A-Z])/)) {
      const t = teil.replace(/^'+|'+$/g, "");
      if (t && SPERRE[weg](t)) out.push(t);
    }
  }
  return out;
}

const ERLAUBT_CACHE = new Map<string, Set<string>>();
function erlaubtAuf(weg: RetoWeg, niveau: ProbenNiveau, id: LayoutId): Set<string> {
  const k = `${weg}/${niveau}/${id}`;
  let s = ERLAUBT_CACHE.get(k);
  if (!s) {
    setLayout(id);
    s = allowedFromIntroduced([...(niveauDef(niveau, weg)?.einheiten ?? [])], weg);
    ERLAUBT_CACHE.set(k, s);
  }
  return s;
}

/** Die Tastaturen des Weges. */
export const tastaturenDes = (weg: RetoWeg): LayoutId[] => [...TASTATUREN_DER_SPRACHE[weg]];

/**
 * ★ Auf welchen Tastaturen des Weges ist die Zeile mit den Einheiten des Niveaus NICHT ungekürzt tippbar? (`fitText` streicht ungelernte
 * Satzzeichen oder sagt `null`: beides heisst, die Zeile käme so nicht beim Kind an.)
 */
export function griffFehler(weg: RetoWeg, niveau: ProbenNiveau, zeile: string): string[] {
  const rumpf = zeile.trim();
  const f: string[] = [];
  for (const id of tastaturenDes(weg)) {
    const erlaubt = erlaubtAuf(weg, niveau, id);
    setLayout(id);
    if (fitText(rumpf, erlaubt, weg) !== rumpf) f.push(`auf ${id} nicht ungekürzt tippbar`);
  }
  setLayout("de");
  return f;
}

/** Text eines Kommentars in Code. */
export function codeKommentar(zeile: string): string | null {
  const m = /^ *(?:#|\/\/|--) ?(.*)$/.exec(zeile);
  return m ? m[1].trim() : null;
}

/** Alle Befunde einer Bank-Zeile. */
export function retoZeilenBefunde(weg: RetoWeg, niveau: ProbenNiveau, zeile: string): string[] {
  const code = niveau === "code";
  const f = [...griffFehler(weg, niveau, zeile)];
  if (code) {
    f.push(...zeichenFehler(weg, zeile));
    const k = codeKommentar(zeile);
    if (k) for (const was of zeilenFehler(weg, k)) f.push(`Kommentar: ${was}`);
    for (const w of sperrTrefferCode(weg, zeile)) f.push(`Sperrwort „${w}"`);
  } else {
    f.push(...zeilenFehler(weg, zeile));
  }
  return f;
}
