/**
 * ★★★ G3c-VERTEILER (25.10.2026): WAS EINE SPRACHE FÜR „TASTEN ERKUNDEN" UND DIE TASTENNAMEN LIEFERT - die Form, die
 * `tastenErklaerung.ts` von jeder der neun Gerüst-Sprachen (bg, el, hu, nl, pt, br, ro, sv, uk) liest.
 *
 * Für de, en, fr, es, it, pl, tr, cs stehen die Teile einzeln in `tastenErklaerung<Xx>.ts` und der Verteiler wählt sie über eine
 * Kette je Stelle aus (`cs ? … : tr ? … : …`). Für die neun Gerüst-Sprachen gilt stattdessen EIN Objekt je Sprache
 * (`TASTEN_SATZ_<XX>` in `tastenErklaerung<Xx>.ts`) - so füllt ein Sprach-Agent nur seine Datei und fasst den Verteiler nicht an.
 * Die Felder sind genau die Teile, die `tastenErklaerungCs.ts` exportiert und der Verteiler braucht; ihre Form ist die englische.
 *
 * Nur Typen - keine Laufzeit.
 */
import type { Plattform } from "../computer/model";
import type { LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";
import type { AKZENTE_EN } from "./tastenErklaerungEn";

/** Die festen Wörter des Erkundens - Form wie `ERKUNDEN_WOERTER_EN`, aber mit `string` statt englischer Literale. */
export interface ErkundenWoerter {
  readonly kombination: string;
  readonly kombiUnbekannt: string;
  readonly mit: string;
  readonly akzentTaste: string;
  readonly unbekannt: string;
  readonly taste: (key: string) => string;
}

export interface TastenErklaerungSatz {
  /** Erklärung einer Wörterbuch-Taste (Tab, Enter, Pfeile …) - Vorbild `sondertasteCs`. */
  sondertaste(id: string, plattform: Plattform, layout: LayoutId): TastenErklaerung | null;
  /** Erklärung einer Taste nach `KeyboardEvent.key` (F-Tasten, Num, Totaste …) - Vorbild `nachKeyCs`. */
  nachKey(key: string, plattform: Plattform, layout: LayoutId): TastenErklaerung | null;
  /** Kurznamen der Tasten („Tab", „Entf") je Wörterbuch-ID - Vorbild `TASTE_KURZ_CS`. */
  tasteKurz: Readonly<Record<string, string>>;
  /** Satz- und Sonderzeichen: Name und was sie tun - Vorbild `ZEICHEN_CS`. */
  zeichen: Readonly<Record<string, { name?: string; was: readonly string[] }>>;
  /** Der Name eines Zeichens („Punkt") - Vorbild `zeichenNameCs`. */
  zeichenName(ch: string): string;
  /** Die Akzent-Totasten - Vorbild `AKZENTE_CS`. */
  akzente: typeof AKZENTE_EN;
  /**
   * Die Wörter von „Tasten erkunden" („Tastenkombination", „Mit" …) - Vorbild `ERKUNDEN_WOERTER_CS`.
   * O2-TASTATUR (29.10.2026): als `string` geweitet - `typeof ERKUNDEN_WOERTER_EN` trug wegen `as const` die englischen
   * Wörter als Typ, jede Sprache brauchte darum den Umweg `as unknown as`.
   */
  erkundenWoerter: ErkundenWoerter;
  /** Eigene Tastenflow-Kombinationen je Plattform - Vorbild `EIGENE_KOMBINATIONEN_CS`. */
  eigeneKombinationen: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>>;
  /** Was eine Kombination tut, nach der Kennung der Wirkung (`null` = fällt weg, nie Deutsch) - Vorbild `wirkungCs`. */
  wirkung(id: string, plattform: Plattform): string | null;
  /** Die Orte der Wirkungen („In Word") je Modul - Vorbild `ORT_CS`. */
  ort: Readonly<Record<string, string>>;
  /** „A, B und C" in der Sprache - Vorbild `aufzaehlungCs`. */
  aufzaehlung(teile: readonly string[]): string;
  /** Der Aufdruck einer Zeichentaste gross (tr: „i" ⇒ „İ"; meist `toLocaleUpperCase` der Sprache). */
  aufdruckGross(key: string): string;
}
