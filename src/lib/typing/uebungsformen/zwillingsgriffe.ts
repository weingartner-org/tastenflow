/**
 * Übungsform „Zwillingsgriffe" - dieselbe Handbewegung, immer wieder.
 *
 *   frf frf frf frf      ← der Griff allein
 *   Frost Frage Frucht   ← derselbe Griff in echten Wörtern
 *
 * Herkunft: Vorschlag vom 02.09.2026, von Johannes ausgewählt
 * (`VORSCHLAG-2026-09-02-NEUE-UEBUNGSFORMEN.md`, Nr. 2).
 *
 * ★★★ Der Unterschied zum Geläufigkeitsschreiben - und der Grund, warum es
 * beide gibt: Das Geläufigkeitsschreiben nimmt sich häufige BUCHSTABENFOLGEN
 * vor (`-ung`, `-keit`), also etwas Sprachliches. Diese Form nimmt sich
 * häufige BEWEGUNGEN vor: zwei Tasten, dieselbe Hand, hin und zurück. Das ist
 * die Übung aus jedem Schreibmaschinenkurs, und sie fehlte uns.
 *
 * ★★★ Woher die Form weiß, welche Hand eine Taste braucht: IMMER über
 * `fingerForChar` aus `fingers.ts` - dieselbe Stelle, die auch die
 * Bildschirm-Tastatur und die Finger-Ansage benutzen. Eine eigene Tabelle hier
 * wäre die zweite Stelle, die von der ersten nichts weiß, und genau daran ist
 * in diesem Projekt schon mehrfach etwas auseinandergelaufen
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ⚠️ Der Griff wird NICHT über die Finger-NAMEN erklärt („linker Zeigefinger
 * zu ..."). Das wäre eine zweite Ansage neben dem Fingerdiktat und würde die
 * Form in eine Wissensfrage verwandeln. Hier wird getippt, nicht benannt.
 */
import { fitText } from "../corpus";
import { kleinFuer } from "../sprachRegister";
import { fingerForChar } from "../fingers";
import type { RoundLine } from "../generator";
import type { FormKontext, FormRunde, Uebungsform } from "./typen";
import { mischen, tastenstand, wortquelle } from "./hilfen";
import { wandleSchreibweise } from "../schreibweise";
import { texte } from "../../bedienSprache/texte";
import { bedienSpracheVon } from "./bedienung";
import { FORM_NAMEN } from "./namen";

/** So oft steht der Griff in der reinen Griff-Zeile. */
const WIEDERHOLUNGEN = 6;

/** So viele echte Wörter je Wortzeile. */
const WOERTER_JE_ZEILE = 3;

/** Ein Griff braucht mindestens so viele echte Wörter, sonst taugt er nicht. */
const MIN_WOERTER = 5;

/** Ein Griff: zwei Tasten, dieselbe Hand. */
export interface Griff {
  /** Die zwei Buchstaben in der Reihenfolge, in der sie getippt werden. */
  folge: string;
  /** Echte Wörter, die genau diese Folge enthalten. */
  woerter: string[];
}

/** Liegen beide Zeichen auf derselben Hand? `null`, wenn eines unbekannt ist. */
export function gleicheHand(a: string, b: string): boolean | null {
  const fa = fingerForChar(a);
  const fb = fingerForChar(b);
  if (!fa || !fb) return null;
  return fa.hand === fb.hand;
}

/**
 * Alle Griffe, die mit diesem Tastenstand taugen - gefunden an echten Wörtern,
 * nicht an einer Liste.
 *
 * ★ Bewusst KEINE feste Griff-Liste: Welche Zweier-Folgen es gibt, hängt am
 * Tastenstand des Kindes, und der wächst. Eine Liste wäre am zweiten Tag zu
 * kurz oder böte Griffe an, die das Kind noch gar nicht tippen kann.
 */
export function griffeFuer(ctx: FormKontext): Griff[] {
  const allowed = tastenstand(ctx);
  const treffer = new Map<string, string[]>();

  for (const roh of wortquelle(ctx.lang)) {
    const wortGb = kleinFuer(roh, ctx.lang);
    // ★ E10: die Schreibweise VOR der Tasten-/Griff-Prüfung anwenden (wie
    // `wortpool` in `hilfen.ts`) - sonst würde ein Griff aus der britischen
    // Form gefunden, den das gezeigte amerikanische Wort gar nicht enthält
    // (oder umgekehrt fitText gegen die falsche Form prüfen).
    const wort =
      ctx.lang === "en" && ctx.variante === "us" ? wandleSchreibweise(wortGb, "us") : wortGb;
    if (wort.includes("ß") || wort.includes(" ") || wort.includes("-")) continue;
    if (fitText(wort, allowed) === null) continue;
    const gesehen = new Set<string>();
    for (let i = 0; i + 1 < wort.length; i += 1) {
      const folge = wort.slice(i, i + 2);
      if (gesehen.has(folge)) continue;
      gesehen.add(folge);
      if (folge[0] === folge[1]) continue; // „ll" ist kein Griff, sondern ein Schlag
      if (gleicheHand(folge[0], folge[1]) !== true) continue;
      if (fitText(folge, allowed) === null) continue;
      const liste = treffer.get(folge) ?? [];
      if (!liste.includes(wort)) liste.push(wort);
      treffer.set(folge, liste);
    }
  }

  return [...treffer.entries()]
    .filter(([, woerter]) => woerter.length >= MIN_WOERTER)
    .map(([folge, woerter]) => ({ folge, woerter }))
    // Feste Reihenfolge: derselbe Tastenstand ergibt dieselben Griffe, egal
    // auf welchem Gerät. Gemischt wird erst mit `ctx.zufall`.
    .sort((a, b) => (a.folge < b.folge ? -1 : 1));
}

/** Bedienung (EN4) - Deutsch wortgleich wie vorher. */
const TEXTE = texte({
  de: {
    ankuendigung: `Jetzt kommen Zwillingsgriffe. Dieselbe Bewegung immer wieder - erst allein, dann in echten Wörtern.`,
  },
  en: {
    ankuendigung: `Now for some twin moves. The same movement again and again - first on its own, then in real words.`,
  },
  // ★ E11a-5 (26.09.2026): Französisch aus der Funktion neu geschrieben (tu, kurz).
  fr: {
    ankuendigung: `Voici des gestes jumeaux. Le même geste encore et encore - d'abord seul, puis dans de vrais mots.`,
  },
  es: {
    ankuendigung: `Aquí tienes movimientos gemelos. El mismo movimiento una y otra vez - primero aislado, después en palabras de verdad.`,
  },
  it: {
    ankuendigung: `Ora tocca ai movimenti gemelli. Lo stesso movimento più e più volte - prima da solo, poi in parole vere.`,
  },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: {
    ankuendigung: `Teraz kolej na: Bliźniacze ruchy. Ten sam ruch raz za razem - najpierw osobno, potem w prawdziwych słowach.`,
  },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: {
    ankuendigung: `Sırada: İkiz hareketler. Aynı hareket tekrar tekrar - önce tek başına, sonra gerçek kelimelerde.`,
  },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  cs: {
    ankuendigung: `Teď: stejné pohyby. Pořád stejný pohyb - nejdřív samotný, pak ve skutečných slovech.`,
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: "Сега: еднакви движения. Едно и също движение отново и отново - първо само, после в истински думи.",
  },
  el: {
    ankuendigung: "Τώρα: δίδυμες κινήσεις. Η ίδια κίνηση ξανά και ξανά - πρώτα μόνη της, μετά μέσα σε αληθινές λέξεις.",
  },
  hu: {
    ankuendigung: "Most: ikermozdulatok. Ugyanaz a mozdulat újra és újra - először magában, aztán valódi szavakban.",
  },
  nl: {
    ankuendigung: "Nu: dezelfde bewegingen. Steeds dezelfde beweging - eerst los, dan in echte woorden.",
  },
  pt: {
    ankuendigung: "Agora: movimentos gémeos. O mesmo movimento uma e outra vez - primeiro sozinho, depois em palavras verdadeiras.",
  },
  br: {
    ankuendigung: "Agora: movimentos gêmeos. O mesmo movimento várias vezes - primeiro sozinho, depois em palavras de verdade.",
  },
  ro: {
    ankuendigung: "Acum: mișcări gemene. Aceeași mișcare iar și iar - întâi singură, apoi în cuvinte adevărate.",
  },
  sv: {
    ankuendigung: "Nu: samma rörelser. Samma rörelse om och om igen - först för sig, sedan i riktiga ord.",
  },
  uk: {
    ankuendigung: "Далі: однакові рухи. Той самий рух знову і знову - спочатку окремо, потім у справжніх словах.",
  },
});

function ankuendigung(ctx: FormKontext): string {
  return TEXTE[bedienSpracheVon(ctx)].ankuendigung;
}

function taugt(ctx: FormKontext): boolean {
  return griffeFuer(ctx).length > 0;
}

/** `fr` wird zu `frf frf frf …` - hin und zurück, das ist die Bewegung. */
export function griffZeile(folge: string, mal = WIEDERHOLUNGEN): string {
  const stueck = `${folge}${folge[0]}`;
  return Array.from({ length: mal }, () => stueck).join(" ");
}

function zeile(text: string): RoundLine {
  return { text, source: null, art: "woerter" };
}

function baue(ctx: FormKontext): FormRunde | null {
  const griffe = mischen(griffeFuer(ctx), ctx.zufall);
  if (griffe.length === 0) return null;

  const allowed = tastenstand(ctx);
  const zeilen: RoundLine[] = [];
  let i = 0;
  while (zeilen.length < ctx.count && i < griffe.length * 3) {
    const griff = griffe[i % griffe.length];
    i += 1;
    // Erst der Griff allein …
    const rein = fitText(griffZeile(griff.folge), allowed);
    if (rein === null) continue;
    zeilen.push(zeile(rein));
    if (zeilen.length >= ctx.count) break;
    // … dann derselbe Griff in echten Wörtern.
    const woerter = mischen(griff.woerter, ctx.zufall).slice(0, WOERTER_JE_ZEILE);
    const text = fitText(woerter.join(" "), allowed);
    if (text !== null) zeilen.push(zeile(text));
  }
  return zeilen.length > 0 ? { zeilen } : null;
}

export const zwillingsgriffe: Uebungsform = {
  id: "zwillingsgriffe",
  name: FORM_NAMEN.de.zwillingsgriffe,
  ankuendigung,
  taugt,
  baue,
};
