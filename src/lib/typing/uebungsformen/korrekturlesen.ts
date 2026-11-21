/**
 * Übungsform „Korrekturlesen" - in einem Satz stimmt ein Wort nicht.
 *
 *   „Wir wohnen in einem großen Maus."   →  Haus
 *
 * Herkunft: Vorschlag vom 02.09.2026, von Johannes ausgewählt
 * (`VORSCHLAG-2026-09-02-NEUE-UEBUNGSFORMEN.md`, Nr. 6).
 *
 * ★★★★ Warum sie die wichtigste der neuen Formen ist: Es ist die einzige, in
 * der ein Kind einen Text PRÜFT statt ihn zu erzeugen. Für ein Kind mit
 * Blindheit ist Korrekturlesen mit Sprachausgabe eine erlernbare Technik - und
 * eine, die in der Schule ständig verlangt und nie unterrichtet wird.
 *
 * ★★★★★ DIE ENTSCHEIDUNG, DIE ALLES TRÄGT (Johannes, 02.09.2026 - genau die
 * Falle, auf die der Vorschlag hingewiesen hatte): **Der Fehler muss HÖRBAR
 * sein.** Vertauschte Buchstaben („Haus" → „Huas") klingen bei Sprachausgabe
 * praktisch gleich; ein Kind mit Blindheit hätte keine Chance und würde am
 * Ende glauben, es liege an ihm. Deshalb ist der Fehler hier IMMER ein
 * anderes, echtes Wort - eines, das man deutlich anders hört und das im Satz
 * offensichtlich nicht stimmt.
 *
 * ⇒ Daraus folgt, dass diese Form KURATIERT ist und nicht erzeugt wird. Ein
 * Automat, der Buchstaben vertauscht, würde genau die unhörbaren Fehler bauen,
 * die wir ausschließen wollen. Jedes Paar unten ist von Hand gesetzt: hörbar
 * verschieden UND im Satz unmöglich.
 *
 * ⚠️ Getippt wird nur das RICHTIGE WORT, nicht der ganze Satz - dieselbe
 * Entscheidung wie bei „Was fehlt hier?" und aus demselben Grund (siehe dort).
 */
import { fitText } from "../corpus";
import type { FormKontext, RaetselAufgabe, Uebungsform } from "./typen";
import { MINDEST_AUFGABEN, mischen, tastenstand } from "./hilfen";
import { wandleSchreibweise } from "../schreibweise";
import { texte } from "../../bedienSprache/texte";
import { ausTeilen, bedienSpracheVon, inTeile, inhalt } from "./bedienung";
import { FORM_NAMEN } from "./namen";
import { KORREKTUR_FR } from "./korrekturlesenFr";
import { KORREKTUR_ES } from "./korrekturlesenEs";
import { KORREKTUR_IT } from "./korrekturlesenIt";
import { KORREKTUR_PL } from "./korrekturlesenPl";
import { KORREKTUR_CS } from "./korrekturlesenCs";
import { KORREKTUR_TR } from "./korrekturlesenTr";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Wege haben je eine eigene, noch leere Datei (`korrekturlesen<Xx>.ts`).
import { KORREKTUR_BG } from "./korrekturlesenBg";
import { KORREKTUR_EL } from "./korrekturlesenEl";
import { KORREKTUR_HU } from "./korrekturlesenHu";
import { KORREKTUR_NL } from "./korrekturlesenNl";
import { KORREKTUR_PT } from "./korrekturlesenPt";
import { KORREKTUR_BR } from "./korrekturlesenBr";
import { KORREKTUR_RO } from "./korrekturlesenRo";
import { KORREKTUR_SV } from "./korrekturlesenSv";
import { KORREKTUR_UK } from "./korrekturlesenUk";
import { eigenOderEn } from "../geruestRueckfall";

/**
 * Ein Satz mit einem falschen Wort.
 *
 * `satz` enthält bereits das FALSCHE Wort - so, wie das Kind es zu lesen
 * bekommt. `falsch` und `richtig` stehen daneben, damit die Auflösung beide
 * nennen kann und ein Wächter prüfen kann, dass sie sich wirklich hörbar
 * unterscheiden.
 */
export interface Korrekturfall {
  satz: string;
  falsch: string;
  richtig: string;
}

export const KORREKTUR_DE: readonly Korrekturfall[] = [
  { satz: "Wir wohnen in einem großen Maus.", falsch: "Maus", richtig: "Haus" },
  { satz: "Mitten im Zimmer steht ein runder Fisch.", falsch: "Fisch", richtig: "Tisch" },
  { satz: "Im Wald wachsen viele hohe Räume.", falsch: "Räume", richtig: "Bäume" },
  { satz: "Ich gieße die Blumen mit einer Tanne.", falsch: "Tanne", richtig: "Kanne" },
  { satz: "Am Himmel scheint die warme Tonne.", falsch: "Tonne", richtig: "Sonne" },
  { satz: "Ihre Mütze ist aus dicker Wolke.", falsch: "Wolke", richtig: "Wolle" },
  { satz: "Um den Garten steht eine hohe Bauer.", falsch: "Bauer", richtig: "Mauer" },
  { satz: "Die Katze fängt gern eine Haus.", falsch: "Haus", richtig: "Maus" },
  { satz: "Der Vogel baut sein Nest aus kleinen Zeigen.", falsch: "Zeigen", richtig: "Zweigen" },
  { satz: "Wir fahren mit dem Rad zur Schere.", falsch: "Schere", richtig: "Schule" },
  { satz: "Im Winter fällt weißer Klee.", falsch: "Klee", richtig: "Schnee" },
  { satz: "Die Biene sammelt süßen König.", falsch: "König", richtig: "Honig" },
  { satz: "Am Morgen klingelt der Becher.", falsch: "Becher", richtig: "Wecker" },
  { satz: "Wir essen die Suppe mit einem Koffer.", falsch: "Koffer", richtig: "Löffel" },
  { satz: "Der Bäcker backt frisches Rot.", falsch: "Rot", richtig: "Brot" },
  { satz: "Die Kinder spielen auf dem Hof mit einem Wall.", falsch: "Wall", richtig: "Ball" },
  { satz: "Nach dem Blitz hört man den Sommer.", falsch: "Sommer", richtig: "Donner" },
  { satz: "Zum Sehen braucht man die Ohren.", falsch: "Ohren", richtig: "Augen" },
  { satz: "Der Winter ist kalt und der Sommer ist alt.", falsch: "alt", richtig: "warm" },
  { satz: "Ein Jahr hat zwölf Wochen.", falsch: "Wochen", richtig: "Monate" },
  { satz: "Eine Woche hat sieben Stunden.", falsch: "Stunden", richtig: "Tage" },
  { satz: "Im Bett decken wir uns mit einer Bäcke zu.", falsch: "Bäcke", richtig: "Decke" },
  { satz: "Das Kind trinkt Milch aus einem Blas.", falsch: "Blas", richtig: "Glas" },
  { satz: "Auf dem Feld steht reifer Kern.", falsch: "Kern", richtig: "Weizen" },
];

export const KORREKTUR_EN: readonly Korrekturfall[] = [
  { satz: "We live in a big mouse.", falsch: "mouse", richtig: "house" },
  { satz: "We eat our dinner at the fable.", falsch: "fable", richtig: "table" },
  { satz: "Bees make sweet money.", falsch: "money", richtig: "honey" },
  { satz: "The children play with a wall in the yard.", falsch: "wall", richtig: "ball" },
  { satz: "In winter I wear a warm goat.", falsch: "goat", richtig: "coat" },
  { satz: "She wears a red cat on her head.", falsch: "cat", richtig: "hat" },
  { satz: "I eat my soup with a moon.", falsch: "moon", richtig: "spoon" },
  { satz: "We take the rain to school every morning.", falsch: "rain", richtig: "train" },
  { satz: "Please turn on the night when it gets dark.", falsch: "night", richtig: "light" },
  { satz: "I put butter on my thread.", falsch: "thread", richtig: "bread" },
  { satz: "She sits on a wooden hair.", falsch: "hair", richtig: "chair" },
  { satz: "The ball rolled across the door.", falsch: "door", richtig: "floor" },
  { satz: "The farmer keeps twenty ship on the hill.", falsch: "ship", richtig: "sheep" },
  { satz: "In summer we swim in the cold cake.", falsch: "cake", richtig: "lake" },
  { satz: "I drink my tea from a small cap.", falsch: "cap", richtig: "cup" },
  { satz: "We got fresh water from the deep bell.", falsch: "bell", richtig: "well" },
  { satz: "My father drives a big star to work.", falsch: "star", richtig: "car" },
  { satz: "A bird is sitting in the tall three.", falsch: "three", richtig: "tree" },
  { satz: "He plays the guitar in a school hand.", falsch: "hand", richtig: "band" },
  { satz: "In the story the dragon guards a pile of cold.", falsch: "cold", richtig: "gold" },
  { satz: "My mother likes to book dinner for us.", falsch: "book", richtig: "cook" },
  { satz: "The dog wags its nail when it is happy.", falsch: "nail", richtig: "tail" },
  { satz: "I read a good cook before I go to bed.", falsch: "cook", richtig: "book" },
  { satz: "Please hammer the tail into the wall.", falsch: "tail", richtig: "nail" },
];

/** So viele Aufgaben höchstens. */
const MAX_AUFGABEN = 8;

/**
 * ★ E10b (25.09.2026, Bauplan französischer Lehrgang §2.3 Punkt 4): eine
 * Tabelle statt der Zwei-Wege-Ternäre (nur „en" oder sonst Deutsch) - die
 * Ternäre gab für „fr" still den deutschen Vorrat zurück. ★ E10b-2
 * (26.09.2026): „fr" hat jetzt eigenen, auf Französisch geschriebenen Inhalt
 * (eigene Datei `…Fr.ts`).
 */
// ★ ES-W (27.09.2026): „es" hat eigene Fälle (`korrekturlesenEs.ts`).
const KORREKTUR_JE_SPRACHE: Record<FormKontext["lang"], readonly Korrekturfall[]> = {
  de: KORREKTUR_DE,
  en: KORREKTUR_EN,
  fr: KORREKTUR_FR,
  es: KORREKTUR_ES,
  // ★ IT-W (03.10.2026): „it" hat eigene Fälle (`korrekturlesenIt.ts`) - vorher das Englische.
  it: KORREKTUR_IT,
  // ★ PL-W (09.10.2026): „pl" hat eigene Fälle (`korrekturlesenPl.ts`) - vorher das Englische.
  pl: KORREKTUR_PL,
  // ★ TR-W (09.10.2026): „tr" hat eigene Fälle (`korrekturlesenTr.ts`) - vorher das Englische.
  tr: KORREKTUR_TR,
  // ★ CS-W (09.10.2026): „cs" hat eigene Fälle (`korrekturlesenCs.ts`) - vorher das Englische.
  cs: KORREKTUR_CS,
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  // ★ G3c-VERTEILER (25.10.2026): jede liest schon ihre eigene Datei (`korrekturlesen<Xx>.ts`) - leer ⇒ der englische Wert (`geruestRueckfall.ts`).
  bg: eigenOderEn(KORREKTUR_BG, KORREKTUR_EN),
  el: eigenOderEn(KORREKTUR_EL, KORREKTUR_EN),
  hu: eigenOderEn(KORREKTUR_HU, KORREKTUR_EN),
  nl: eigenOderEn(KORREKTUR_NL, KORREKTUR_EN),
  pt: eigenOderEn(KORREKTUR_PT, KORREKTUR_EN),
  br: eigenOderEn(KORREKTUR_BR, KORREKTUR_EN),
  ro: eigenOderEn(KORREKTUR_RO, KORREKTUR_EN),
  sv: eigenOderEn(KORREKTUR_SV, KORREKTUR_EN),
  uk: eigenOderEn(KORREKTUR_UK, KORREKTUR_EN),
};

function quelle(lang: FormKontext["lang"]): readonly Korrekturfall[] {
  return KORREKTUR_JE_SPRACHE[lang];
}

/**
 * Die Fälle, die mit diesem Tastenstand taugen.
 *
 * Geprüft wird das RICHTIGE Wort - nur das muss ein Kind schreiben können. Der
 * Satz darf Tasten enthalten, die noch nicht dran waren: Er wird gelesen und
 * gehört, nicht getippt.
 */
export function faelleFuer(ctx: FormKontext): Korrekturfall[] {
  const allowed = tastenstand(ctx);
  // ★ E10: Schreibweise VOR der Tastenprüfung - Satz, falsches und richtiges
  // Wort kommen aus derselben Fassung, sonst passt die Auflösung nicht mehr
  // zum gezeigten Satz.
  const varianteAn = ctx.lang === "en" && ctx.variante === "us";
  return quelle(ctx.lang)
    .map((f) =>
      varianteAn
        ? {
            satz: wandleSchreibweise(f.satz, "us"),
            falsch: wandleSchreibweise(f.falsch, "us"),
            richtig: wandleSchreibweise(f.richtig, "us"),
          }
        : f,
    )
    // ★ ES-W (27.09.2026): mit dem Weg - auf „es" ist „papá" tippbar, sobald
    // `´` und `a` gelernt sind (Totaste); ohne Weg fiele jeder Akzent-Fall
    // still heraus. Für „de"/„en" byte-gleich, für „fr" ebenso (die richtigen
    // Wörter tragen kein ê/â/ï, Wächter wortspiele-fr).
    .filter((f) => fitText(f.richtig, allowed, ctx.lernweg) === f.richtig);
}

/**
 * Bedienung (EN4) - Deutsch wortgleich wie vorher. Satz, falsches und
 * richtiges Wort sind INHALT (Übungssprache) - eingesetzt über `inhalt`.
 */
const TEXTE = texte({
  de: {
    ankuendigung: `Jetzt kommt Korrekturlesen. Ein Wort im Satz stimmt nicht - schreib das richtige.`,
    frage: (satz: string) => `Hier stimmt ein Wort nicht: ${satz} Wie heißt es richtig?`,
    aufloesung: (falsch: string, richtig: string) => `Nicht „${falsch}", sondern „${richtig}".`,
  },
  en: {
    ankuendigung: `Now for some proofreading. One word in the sentence is wrong - type the right one.`,
    frage: (satz: string) => `One word here is wrong: ${satz} What should it be?`,
    aufloesung: (falsch: string, richtig: string) => `Not “${falsch}” but “${richtig}”.`,
  },
  // ★ E11a-5 (26.09.2026): Französisch neu geschrieben. Gerade Anführungszeichen
  // wie in `TippenHilfe.fr.tsx` (Braillezeile); gewöhnliches Leerzeichen vor
  // „:" und „?" wie im übrigen französischen Code (Bauplan F8).
  fr: {
    ankuendigung: `Voici un exercice de relecture. Un mot de la phrase ne va pas - écris le bon mot.`,
    frage: (satz: string) => `Un mot ne va pas ici : ${satz} Quel est le bon mot ?`,
    aufloesung: (falsch: string, richtig: string) => `Pas "${falsch}", mais "${richtig}".`,
  },
  es: {
    ankuendigung: `Aquí tienes un ejercicio de corrección. Una palabra de la frase no encaja - escribe la palabra correcta.`,
    frage: (satz: string) => `Aquí una palabra no encaja: ${satz} ¿Cuál es la palabra correcta?`,
    aufloesung: (falsch: string, richtig: string) => `No "${falsch}", sino "${richtig}".`,
  },
  it: {
    ankuendigung: `Ora tocca alla rilettura. Una parola della frase non va - scrivi quella giusta.`,
    frage: (satz: string) => `Qui una parola non va: ${satz} Qual è la parola giusta?`,
    aufloesung: (falsch: string, richtig: string) => `Non "${falsch}", ma "${richtig}".`,
  },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: {
    ankuendigung: `Teraz kolej na: Korekta. Jedno słowo w zdaniu nie pasuje - napisz właściwe.`,
    frage: (satz: string) => `Tu jedno słowo nie pasuje: ${satz} Jakie jest właściwe słowo?`,
    aufloesung: (falsch: string, richtig: string) => `Nie „${falsch}”, tylko „${richtig}”.`,
  },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: {
    ankuendigung: `Sırada: Okuyup düzelt. Cümlede bir kelime uymuyor - doğrusunu yaz.`,
    frage: (satz: string) => `Burada bir kelime uymuyor: ${satz} Doğrusu hangisi?`,
    aufloesung: (falsch: string, richtig: string) => `"${falsch}" değil, "${richtig}".`,
  },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  // Die Auflösung ohne Anführungszeichen - sie ist eine Ansage (Glossar Regel 7).
  cs: {
    ankuendigung: `Teď: korektura. Jedno slovo ve větě nesedí - napiš to správné.`,
    frage: (satz: string) => `Tady jedno slovo nesedí: ${satz} Jak to má být správně?`,
    aufloesung: (falsch: string, richtig: string) => `Ne ${falsch}, ale ${richtig}.`,
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: "Сега: коректура. Една дума в изречението е грешна - напиши правилната.",
    frage: (satz: string) => `Тук една дума е грешна: ${satz} Коя е правилната?`,
    aufloesung: (falsch: string, richtig: string) => `Не „${falsch}“, а „${richtig}“.`,
  },
  el: {
    ankuendigung: "Τώρα: διόρθωση κειμένου. Μια λέξη στην πρόταση είναι λάθος - γράψε τη σωστή.",
    frage: (satz: string) => `Εδώ μια λέξη είναι λάθος: ${satz} Ποια είναι η σωστή;`,
    aufloesung: (falsch: string, richtig: string) => `Όχι «${falsch}» αλλά «${richtig}».`,
  },
  hu: {
    ankuendigung: "Most: korrektúra. A mondatban egy szó hibás - írd be a helyeset.",
    frage: (satz: string) => `Itt egy szó hibás: ${satz} Mi a helyes?`,
    aufloesung: (falsch: string, richtig: string) => `Nem „${falsch}”, hanem „${richtig}”.`,
  },
  nl: {
    ankuendigung: "Nu: nakijken. Eén woord in de zin is fout - typ het goede woord.",
    frage: (satz: string) => `Hier is één woord fout: ${satz} Wat moet het zijn?`,
    aufloesung: (falsch: string, richtig: string) => `Niet ‘${falsch}’ maar ‘${richtig}’.`,
  },
  pt: {
    ankuendigung: "Agora: revisão. Uma palavra da frase está errada - escreve a certa.",
    frage: (satz: string) => `Aqui há uma palavra errada: ${satz} Qual é a certa?`,
    aufloesung: (falsch: string, richtig: string) => `Não é «${falsch}», é «${richtig}».`,
  },
  br: {
    ankuendigung: "Agora: revisão de texto. Uma palavra da frase está errada - digite a certa.",
    frage: (satz: string) => `Aqui tem uma palavra errada: ${satz} Qual é a certa?`,
    aufloesung: (falsch: string, richtig: string) => `Não é “${falsch}”, é “${richtig}”.`,
  },
  ro: {
    ankuendigung: "Acum: corectură. Un cuvânt din propoziție e greșit - scrie-l pe cel corect.",
    frage: (satz: string) => `Aici un cuvânt e greșit: ${satz} Care e cel corect?`,
    aufloesung: (falsch: string, richtig: string) => `Nu „${falsch}”, ci „${richtig}”.`,
  },
  sv: {
    ankuendigung: "Nu: korrekturläsning. Ett ord i meningen är fel - skriv det rätta.",
    frage: (satz: string) => `Här är ett ord fel: ${satz} Vad ska det vara?`,
    aufloesung: (falsch: string, richtig: string) => `Inte ”${falsch}” utan ”${richtig}”.`,
  },
  uk: {
    ankuendigung: "Далі: коректура. Одне слово в реченні неправильне - надрукуй правильне.",
    frage: (satz: string) => `Тут одне слово неправильне: ${satz} Яке правильне?`,
    aufloesung: (falsch: string, richtig: string) => `Не «${falsch}», а «${richtig}».`,
  },
});

function ankuendigung(ctx: FormKontext): string {
  return TEXTE[bedienSpracheVon(ctx)].ankuendigung;
}

function taugt(ctx: FormKontext): boolean {
  return faelleFuer(ctx).length >= MINDEST_AUFGABEN;
}

function fragen(ctx: FormKontext): RaetselAufgabe[] {
  const t = TEXTE[bedienSpracheVon(ctx)];
  const pool = mischen(faelleFuer(ctx), ctx.zufall);
  const anzahl = Math.max(1, Math.min(MAX_AUFGABEN, ctx.count, pool.length));
  return pool.slice(0, anzahl).map((f) => {
    const frageTeile = inTeile(t.frage(inhalt(f.satz)));
    const aufloesungTeile = inTeile(t.aufloesung(inhalt(f.falsch), inhalt(f.richtig)));
    return {
      frage: ausTeilen(frageTeile),
      frageTeile,
      antworten: [f.richtig],
      aufloesung: ausTeilen(aufloesungTeile),
      aufloesungTeile,
    };
  });
}

export const korrekturlesen: Uebungsform = {
  id: "korrekturlesen",
  name: FORM_NAMEN.de.korrekturlesen,
  ankuendigung,
  taugt,
  eigenerBildschirm: "raetsel",
  // Das richtige Wort steht im Satz an der Stelle eines Nomens - es gehört so
  // geschrieben, wie es dort stünde. Die Umschalttaste zählt also mit.
  grossKleinZaehlt: true,
  fragen,
};
