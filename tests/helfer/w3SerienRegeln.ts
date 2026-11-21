/**
 * Die Regeln der Serien auf den Wegen „pt", „br", „sv" (W3, 30.10.2026), Vorbild `csSerienRegeln.ts`, kleiner gefasst. Eine reine Funktion, ohne vitest: das
 * Arbeitswerkzeug und der Wächter `ptBrSvSerienWaechter.ts` benutzen dieselbe.
 */
import { computeSerieMinTier, validateSerie, type Serie } from "../../src/lib/typing/serie";
import { REGIONEN_PTBRSV, type SerieEntwurfPtBrSv } from "../../src/lib/typing/serienPtBrSvTyp";
import { w3SperrVoll, w3TastaturBefunde, w3ZeilenFehler, type W3Weg } from "./ptBrSvTextRegeln";

export type Stufe = "kids" | "teens" | "erwachsen";
export const ANZAHL_JE_STUFE = 12;
export const MIN_ZEILEN = 12;
export const MAX_ZEILEN = 16;
const MAX_WOERTER: Readonly<Record<Stufe, number>> = { kids: 16, teens: 20, erwachsen: 22 };
const MIN_WOERTER = 3;

/** Fehler einer einzelnen Zeile. */
export function zeilenFehlerSerie(z: string, weg: W3Weg, stufe: Stufe): string[] {
  const f = w3ZeilenFehler(z, weg);
  f.push(...w3TastaturBefunde(z, weg));
  for (const w of w3SperrVoll(z, weg)) f.push(`Sperrwort „${w}"`);
  if (!/^["«(]?\p{Lu}/u.test(z)) f.push("kein Grossbuchstabe am Anfang");
  if (!/[.?!]["»)]?$/u.test(z)) f.push("kein Satzschluss am Ende");
  // Ein Satz je Zeile; eine Redeeinleitung nach dem Zitat beginnt klein und zählt nicht.
  if (/[.?!]\s+["«]?\p{Lu}/u.test(z)) f.push("mehr als ein Satz");
  const woerter = z.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  if (woerter < MIN_WOERTER || woerter > MAX_WOERTER[stufe]) f.push(`${woerter} Wörter (erlaubt ${MIN_WOERTER}-${MAX_WOERTER[stufe]})`);
  if ((z.match(/"/g) ?? []).length % 2) f.push("Anführungszeichen ungerade");
  if ((z.match(/«/g) ?? []).length !== (z.match(/»/g) ?? []).length) f.push("« » ungleich");
  if (stufe === "kids" && /\d/.test(z)) f.push("Ziffer in einer Kinder-Serie (Zahlen ausschreiben)");
  if (/[%&/+*=_<>$#|\\@[\]{}€]/.test(z)) f.push("Sonderzeichen in einer Serie");
  return f;
}

/** Alle Fehler einer Charge einer Stufe - leere Liste = in Ordnung. */
export function chargenFehler<W extends W3Weg>(serien: readonly SerieEntwurfPtBrSv<W>[], weg: W, stufe: Stufe): string[] {
  const f: string[] = [];
  if (serien.length !== ANZAHL_JE_STUFE) f.push(`${serien.length} Serien statt ${ANZAHL_JE_STUFE}`);
  const slugs = new Set<string>();
  const titel = new Set<string>();
  const zeilen = new Map<string, string>();
  for (const s of serien) {
    const wo = s.slug;
    if (!s.slug.startsWith(`${weg}-${stufe}-1-`)) f.push(`${wo}: Slug-Vorsilbe`);
    if (slugs.has(s.slug)) f.push(`${wo}: Slug doppelt`);
    slugs.add(s.slug);
    if (titel.has(s.titel.toLowerCase())) f.push(`${wo}: Titel doppelt`);
    titel.add(s.titel.toLowerCase());
    if (s.stufen.length !== 1 || s.stufen[0] !== stufe) f.push(`${wo}: stufen`);
    if (s.lang !== weg || s.nurWeg !== weg) f.push(`${wo}: lang/nurWeg`);
    if (s.herkunft.quelle !== "Sensorik" || s.herkunft.lizenz !== "Eigenes Werk") f.push(`${wo}: herkunft`);
    if (!(REGIONEN_PTBRSV[weg] as readonly string[]).includes(s.land)) f.push(`${wo}: Region „${s.land}"`);
    if (s.etappen.length !== 2) f.push(`${wo}: ${s.etappen.length} Etappen statt 2`);
    const voll = s.etappen.flatMap((e) => e.lines).join(" ");
    for (const n of s.eigennamen) if (!voll.includes(n)) f.push(`${wo}: Name „${n}" kommt nicht vor`);
    s.etappen.forEach((e, i) => {
      if (e.lines.length < MIN_ZEILEN || e.lines.length > MAX_ZEILEN) f.push(`${wo}: Etappe ${i + 1} hat ${e.lines.length} Zeilen`);
      if (i < s.etappen.length - 1 && !/[?!]["»]?$/.test(e.lines[e.lines.length - 1])) f.push(`${wo}: Etappe ${i + 1} endet ohne ? oder !`);
      for (const z of e.lines) {
        for (const x of zeilenFehlerSerie(z, weg, stufe)) f.push(`${wo}: ${x}: ${z}`);
        const k = z.toLowerCase();
        const alt = zeilen.get(k);
        if (alt) f.push(`${wo}: Zeile auch in ${alt}: ${z}`);
        zeilen.set(k, wo);
      }
    });
    const v = validateSerie(s as unknown as Serie, weg);
    if (!v.ok) f.push(`${wo}: ${v.problems.join("; ")}`);
    if (computeSerieMinTier(s as unknown as Serie, weg) === null) f.push(`${wo}: nie freischaltbar`);
  }
  for (const r of REGIONEN_PTBRSV[weg]) {
    if (!serien.some((s) => s.land === r)) f.push(`Region ${r} fehlt`);
  }
  return f;
}
