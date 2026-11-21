/**
 * Übungsform „Iglu-Raten" - Testerin Galgenmännchen, freundlich gebaut.
 *
 * Herkunft: Testerin schlug am 22.10.2026 spontan „Galgenmännchen" als
 * Spielidee vor; Johannes hat entschieden, dass nur dieses Spiel gebaut wird.
 *
 * ★★★ Das MOTIV ist eine Entscheidung (dem Bericht beigelegt): ein Galgen
 * passt nicht zu Kindern und nicht zu Tastenflow. Die Welt der App ist die
 * Polar-Expedition - also baut hier ein Pinguin an einem Iglu. Jeder Buchstabe,
 * der NICHT im Wort steckt, legt einen Schneeblock (acht Blöcke). Sind alle
 * gelegt, steht der Iglu - dann nennt die App das Wort und es geht mit einem
 * neuen weiter. Es gibt kein „Verloren": Ein Wort, das nicht erraten wurde,
 * ist ein Wort, das die App gleich verrät, und das Spiel läuft weiter.
 *
 * Das Spiel hat einen EIGENEN Bildschirm (`IgluLauf.tsx`): Das Kind tippt
 * einzelne Buchstaben und sieht (hört) das Wort mit Lücken - die gewohnte
 * Tippzeile (ein Text, ein Ergebnis) passt darauf nicht. Diese Datei liefert
 * Wortwahl, Prüfung und Ansagetexte; sie ist reine Rechnung.
 *
 * ★★★ Nie gegen ein Kind: Ein falscher Buchstabe ist eine Auskunft („Kein b
 * im Wort"), keine Wertung. „Schon getippt" kostet nichts. Ein Zeichen, das
 * kein Buchstabe ist, bekommt eine Antwort (ein Tastendruck ohne Antwort ist
 * eine kaputte Tastatur), zählt aber nicht als Fehlversuch.
 *
 * ★ Die Wörter kommen aus `wortpool` - derselben Quelle wie Spiegelwörter und
 * Pyramide: nur Buchstaben, die das Kind schon freigeschaltet hat, also kann
 * es jeden Buchstaben des Wortes auch tippen. Für Kinder (kids) sind die Wörter
 * kürzer und der erste Buchstabe steht schon da.
 */
import type { Lang } from "../account";
import { texte } from "../../bedienSprache/texte";
import { bedienSpracheVon } from "./bedienung";
import { FORM_NAMEN } from "./namen";
import { wortpool } from "./hilfen";
import { kleinFuer } from "../sprachRegister";
import type { FormKontext, Uebungsform } from "./typen";

/** Wie viele Schneeblöcke der Iglu hat - so viele Fehlversuche trägt ein Wort. */
export const IGLU_BLOECKE = 8;

/** Wie viele Wörter eine Runde hat, wenn das Kind nicht vorher „Fertig" sagt. */
export const IGLU_WOERTER = 5;

const MIN_LAENGE = 4;
const MAX_LAENGE_KIDS = 6;
const MAX_LAENGE = 8;

/** Mindestens so viele Wörter müssen tippbar sein, sonst wird das Spiel noch nicht angeboten. */
const MIN_VORRAT = 6;

function istKind(ctx: Pick<FormKontext, "stufe">): boolean {
  return ctx.stufe === "kids" || ctx.stufe === "a";
}

/** Die Wörter, die dieses Kind mit diesem Tastenstand raten kann. */
export function igluVorrat(ctx: FormKontext): string[] {
  return wortpool(ctx, MIN_LAENGE, istKind(ctx) ? MAX_LAENGE_KIDS : MAX_LAENGE);
}

/**
 * Das nächste Wort - zufällig, nie eines aus `schonGehabt`. Sind alle durch,
 * darf sich der Vorrat wiederholen (ein Kind mit wenigen Tasten hat nur wenige
 * Wörter). `null`, wenn der Tastenstand gar kein Wort hergibt.
 */
export function waehleIgluwort(ctx: FormKontext, schonGehabt: readonly string[] = []): string | null {
  const vorrat = igluVorrat(ctx);
  if (vorrat.length === 0) return null;
  const frisch = vorrat.filter((w) => !schonGehabt.includes(w));
  const quelle = frisch.length > 0 ? frisch : vorrat;
  return quelle[Math.min(quelle.length - 1, Math.floor(ctx.zufall() * quelle.length))];
}

/** Ein Buchstabe, so wie er verglichen wird (türkisches İ/I beachtet). */
export function igluBuchstabe(zeichen: string, lang: Lang): string {
  return kleinFuer(zeichen, lang);
}

/** Der Buchstaben des Wortes, die ein Kind von Anfang an sieht (nur bei Kindern: der erste). */
export function igluGeschenkt(wort: string, ctx: Pick<FormKontext, "stufe" | "lang">): string[] {
  return istKind(ctx) ? [igluBuchstabe([...wort][0], ctx.lang)] : [];
}

export type IgluUrteil =
  | { art: "treffer"; buchstabe: string; anzahl: number }
  | { art: "daneben"; buchstabe: string }
  | { art: "schon"; buchstabe: string }
  | { art: "kein-buchstabe" };

/**
 * Was ein getipptes Zeichen bedeutet. Auskunft, nie Wertung; nur „daneben"
 * baut einen Block (das entscheidet der Aufrufer).
 */
export function rateBuchstabe(
  wort: string,
  geraten: readonly string[],
  eingabe: string,
  lang: Lang,
): IgluUrteil {
  const zeichen = [...eingabe.trim()].pop();
  if (!zeichen || !/\p{L}/u.test(zeichen)) return { art: "kein-buchstabe" };
  const b = igluBuchstabe(zeichen, lang);
  if (geraten.includes(b)) return { art: "schon", buchstabe: b };
  const anzahl = [...wort].filter((c) => igluBuchstabe(c, lang) === b).length;
  return anzahl > 0 ? { art: "treffer", buchstabe: b, anzahl } : { art: "daneben", buchstabe: b };
}

/** Das Wort mit Lücken: erratene Buchstaben, sonst `null`. */
export function igluMaske(wort: string, geraten: readonly string[], lang: Lang): (string | null)[] {
  return [...wort].map((c) => (geraten.includes(igluBuchstabe(c, lang)) ? c : null));
}

export function igluGeloest(wort: string, geraten: readonly string[], lang: Lang): boolean {
  return igluMaske(wort, geraten, lang).every((c) => c !== null);
}

/**
 * Die BESCHRIFTUNG des Eingabefeldes: das Wort mit Lücken (`_`), dann vier
 * Leerzellen - dieselbe Bauart wie beim Buchstabensalat: Die Braillezeile
 * zeigt die Beschriftung unmittelbar vor dem Feldinhalt, der Stand steht also
 * immer dort, wo die Finger sind. Geschützte Leerzeichen, damit es vier bleiben.
 */
export function igluFeldbeschriftung(wort: string, geraten: readonly string[], lang: Lang, abstand = 4): string {
  const maske = igluMaske(wort, geraten, lang).map((c) => c ?? "_");
  return maske.join(" ") + " ".repeat(abstand);
}

/** Bedienung (EN4) - die Ankündigung auf dem Weg ins Spiel. */
const TEXTE = texte({
  de: {
    ankuendigung:
      "Jetzt kommt das Iglu-Raten. Ein Wort ist versteckt. Tipp einen Buchstaben nach dem anderen - jeder Buchstabe, der nicht im Wort steckt, legt einen Schneeblock für den Iglu.",
  },
  en: {
    ankuendigung:
      "Now for igloo guessing. A word is hidden. Type one letter at a time - every letter that is not in the word lays a snow block for the igloo.",
  },
  fr: {
    ankuendigung:
      "Voici l'igloo à deviner. Un mot est caché. Tape une lettre après l'autre - chaque lettre absente du mot pose un bloc de neige pour l'igloo.",
  },
  es: {
    ankuendigung:
      "Ahora toca adivinar con el iglú. Hay una palabra escondida. Escribe una letra tras otra - cada letra que no está en la palabra coloca un bloque de nieve para el iglú.",
  },
  it: {
    ankuendigung:
      "Ora tocca all'igloo da indovinare. C'è una parola nascosta. Scrivi una lettera dopo l'altra - ogni lettera che non è nella parola mette un blocco di neve per l'igloo.",
  },
  pl: {
    ankuendigung:
      "Teraz kolej na: Igloo ze słowem. Słowo jest ukryte. Pisz literę po literze - każda litera, której nie ma w słowie, kładzie jeden blok śniegu na igloo.",
  },
  tr: {
    ankuendigung:
      "Sırada: İglu kelimesi. Bir kelime saklı. Harfleri tek tek yaz - kelimede olmayan her harf iglu için bir kar bloğu koyar.",
  },
  cs: {
    ankuendigung:
      "Teď: slovo v iglú. Jedno slovo je schované. Piš písmena po jednom - každé písmeno, které ve slově není, položí jeden sněhový blok na iglú.",
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: "Сега: познай думата за иглуто. Една дума е скрита. Пиши по една буква - всяка буква, която я няма в думата, слага леден блок на иглуто.",
  },
  el: {
    ankuendigung: "Τώρα: μάντεψε τη λέξη για το ιγκλού. Μια λέξη είναι κρυμμένη. Γράφε ένα γράμμα κάθε φορά - κάθε γράμμα που δεν υπάρχει στη λέξη βάζει ένα τούβλο χιονιού στο ιγκλού.",
  },
  hu: {
    ankuendigung: "Most: iglus találós. Egy szó el van rejtve. Írj be egyszerre egy betűt - minden betű, amely nincs a szóban, egy hótéglát rak az igluhoz.",
  },
  nl: {
    ankuendigung: "Nu: iglo raden. Er is een woord verstopt. Typ telkens één letter - elke letter die niet in het woord zit, legt een sneeuwblok voor de iglo.",
  },
  pt: {
    ankuendigung: "Agora: adivinha do iglu. Há uma palavra escondida. Escreve uma letra de cada vez - cada letra que não está na palavra põe um bloco de neve no iglu.",
  },
  br: {
    ankuendigung: "Agora: adivinhação do iglu. Tem uma palavra escondida. Digite uma letra por vez - cada letra que não está na palavra coloca um bloco de neve no iglu.",
  },
  ro: {
    ankuendigung: "Acum: ghicitoarea iglului. Un cuvânt e ascuns. Scrie câte o literă - fiecare literă care nu e în cuvânt pune un bloc de zăpadă la iglu.",
  },
  sv: {
    ankuendigung: "Nu: gissa ordet till igloon. Ett ord är gömt. Skriv en bokstav i taget - varje bokstav som inte finns i ordet lägger ett snöblock till igloon.",
  },
  uk: {
    ankuendigung: "Далі: слово в іглу. Одне слово сховане. Друкуй по одній літері - кожна літера, якої немає в слові, кладе сніжний блок для іглу.",
  },
});

export const iglu: Uebungsform = {
  id: "iglu",
  name: FORM_NAMEN.de.iglu,
  ankuendigung: (ctx) => TEXTE[bedienSpracheVon(ctx)].ankuendigung,
  taugt: (ctx) => igluVorrat(ctx).length >= MIN_VORRAT,
  eigenerBildschirm: "iglu",
};
