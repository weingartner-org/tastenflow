/**
 * Übungsform „Zahlendiktat" - Zahl hören, Ziffern schreiben. Und umgekehrt.
 *
 *   „Schreib die Zahl: dreiundvierzig."  →  43
 *   „Schreib das Zahlwort: 43."          →  dreiundvierzig
 *
 * Herkunft: Vorschlag vom 02.09.2026, von Johannes ausgewählt
 * (`VORSCHLAG-2026-09-02-NEUE-UEBUNGSFORMEN.md`, Nr. 3).
 *
 * ★★★ Warum die Form eine echte Lücke füllt: Die Ziffernreihe ist die am
 * schlechtesten geübte Reihe des ganzen Lehrgangs. In Übungstexten kommen
 * Ziffern kaum vor - in jedem Formular, jeder Adresse und jeder Rechnung
 * dagegen ständig. Wer nur Sätze abschreibt, tippt Ziffern nie.
 *
 * ★★★ Und der zweite Übungswert steckt in der Sprache: 43 heißt
 * „dreiundvierzig" - erst der Einer, dann der Zehner, genau umgekehrt zur
 * Schreibweise. Beide Richtungen zu üben ist genau die Arbeit, die diese
 * Umkehrung sitzen lässt. Die Zahlwörter selbst stehen in `zahlwort.ts`, nicht
 * hier: Sie sind keine Eigenschaft dieser Form.
 *
 * ⚠️ Läuft über den Rätsel-Bildschirm (Frage hören, Antwort tippen), denn die
 * Lösung darf nicht dastehen. Die Antworten sind KURZ - höchstens ein Zahlwort
 * -, deshalb ist die fehlende Zeichen-für-Zeichen-Rückmeldung hier kein
 * Problem; genau daran war das Würfeldiktat gescheitert.
 */
import { fitText } from "../corpus";
import { zahlwort, zahlwortCs, zahlwortEs, zahlwortFr, zahlwortIt, zahlwortPl, zahlwortTr } from "../zahlwort";
import type { Lang } from "../account";
import type { FormKontext, RaetselAufgabe, Uebungsform } from "./typen";
import { tastenstand, ziffernFrei } from "./hilfen";
import { texte } from "../../bedienSprache/texte";
import { ausTeilen, bedienSpracheVon, inTeile, inhalt } from "./bedienung";
import { FORM_NAMEN } from "./namen";
// ★ G3c-VERTEILER (25.10.2026): die Zahlwörter der neun Gerüst-Wege (`zahlwort<Xx>.ts`, heute `null` ⇒ kein Zahlendiktat, nie Deutsch).
import { ZAHLWORT_BG } from "../zahlwortBg";
import { ZAHLWORT_EL } from "../zahlwortEl";
import { ZAHLWORT_HU } from "../zahlwortHu";
import { ZAHLWORT_NL } from "../zahlwortNl";
import { ZAHLWORT_PT } from "../zahlwortPt";
import { ZAHLWORT_BR } from "../zahlwortBr";
import { ZAHLWORT_RO } from "../zahlwortRo";
import { ZAHLWORT_SV } from "../zahlwortSv";
import { ZAHLWORT_UK } from "../zahlwortUk";
import { istGeruestSprache, type GeruestSprache } from "../sprachRegister";

const ZAHLWORT_GERUEST: Readonly<Record<GeruestSprache, ((n: number) => string) | null>> = {
  bg: ZAHLWORT_BG,
  el: ZAHLWORT_EL,
  hu: ZAHLWORT_HU,
  nl: ZAHLWORT_NL,
  pt: ZAHLWORT_PT,
  br: ZAHLWORT_BR,
  ro: ZAHLWORT_RO,
  sv: ZAHLWORT_SV,
  uk: ZAHLWORT_UK,
};

/** Das Zahlwort eines Gerüst-Weges - `null`, solange er keines hat (oder die Sprache keine Gerüst-Sprache ist). */
function geruestZahlwort(lang: Lang): ((n: number) => string) | null {
  return istGeruestSprache(lang) ? ZAHLWORT_GERUEST[lang] : null;
}

/** Aus welchem Bereich gewürfelt wird - zweistellig ist der Kern der Übung. */
const VON = 10;
const BIS = 99;

/** So viele Aufgaben höchstens, auch wenn die Runde länger wäre. */
const MAX_AUFGABEN = 10;

/**
 * Sind alle zehn Ziffern frei? Ohne sie ist die eine Richtung nicht tippbar.
 * Lebt seit dem 11.09.2026 in `hilfen.ts` (auch „Was fehlt hier?" fragt das);
 * hier weiter exportiert, weil die Wächter es von hier kennen.
 */
export { ziffernFrei };

/**
 * ★ E10a (25.09.2026, Bauplan §8.1 „Zahlendiktat nutzt diese Funktion mit
 * der Variante des Kindes"): das Zahlwort in der ÜBUNGSSPRACHE des Kindes -
 * für „fr" über {@link zahlwortFr} mit der Landesvariante
 * (`ctx.franzVariante`, aus der Geräte-/Klassen-Erkennung von E2b,
 * `franzVariante.ts`; ohne gesetzten Wert gilt „fr-FR", dieselbe Vorgabe wie
 * bei `ctx.variante`/Englisch). NIE `zahlwort(n, ctx.lang)` direkt mit „fr"
 * aufrufen - die Funktion kennt „fr" absichtlich nicht (Bauplan §2.3 Punkt 4:
 * „fr" fällt nie still auf „de").
 */
/**
 * ★ G2b-2 (02.10.2026): die Sprachen, für die es Zahlwörter gibt. Jede andere (it, pl, tr, cs, bis
 * ihre Zahlwörter geschrieben sind) bekommt KEIN Zahlendiktat - die Form bietet sich nicht an und
 * baut keine Aufgaben, statt deutsche Zahlwörter zu zeigen (Falle 19; `zahlwort` wirft dort).
 */
// ★ F8-it (02.10.2026): „it" dazu - `zahlwortIt` (bis 1.000.000, Akzent in `tré`, Elision vor uno/otto) ist geschrieben.
// ★ F8-pl (03.10.2026): „pl" dazu - `zahlwortPl` (bis 1.000.000, getrennt geschrieben, `tysiąc/tysiące/tysięcy`) ist geschrieben.
// ★ F8-tr (03.10.2026): „tr" dazu - `zahlwortTr` (bis 1.000.000, getrennt geschrieben, `bin`/`yüz` ohne `bir`).
// ★ F8-cs (03.10.2026): „cs" dazu - `zahlwortCs` (bis 1.000.000, getrennt geschrieben, Zählform). Die Rahmensätze der Form
// (`TEXTE` unten) kommen mit der Oberfläche (Etappe O-cs).
const ZAHLWORT_SPRACHEN: readonly Lang[] = ["de", "en", "fr", "es", "it", "pl", "tr", "cs"];

function hatZahlwoerter(ctx: FormKontext): boolean {
  // ★ G3c-VERTEILER (25.10.2026): ein Gerüst-Weg bietet sich an, sobald seine Datei ein Zahlwort hat.
  return ZAHLWORT_SPRACHEN.includes(ctx.lang) || geruestZahlwort(ctx.lang) !== null;
}

/**
 * ★ O2-TASTATUR (30.10.2026): die Zweitformen, die in der griechischen Schule beide gelten (Glossar §2.10): εφτά neben επτά, οχτώ neben
 * οκτώ, εννιά neben εννέα - auch in den Zusammensetzungen („δεκαεφτά", „είκοσι οχτώ"). Das Zahlwort selbst bleibt die Schulform
 * (`zahlwortEl`, sie steht in der Auflösung); angenommen werden beide. Eine Zahl hat höchstens eine dieser Stellen.
 */
const ZWEITFORM_EL: readonly (readonly [string, string])[] = [["επτά", "εφτά"], ["οκτώ", "οχτώ"], ["εννέα", "εννιά"]];

function antwortenFuerWort(wort: string, lang: Lang): string[] {
  if (lang !== "el") return [wort];
  const antworten = [wort];
  for (const [schule, zweit] of ZWEITFORM_EL) if (wort.includes(schule)) antworten.push(wort.replace(schule, zweit));
  return antworten;
}

function zahlwortFuerKind(n: number, ctx: FormKontext): string {
  // ★ G3c-VERTEILER (25.10.2026): ein Gerüst-Weg mit eigenem Zahlwort (heute keiner).
  const geruest = geruestZahlwort(ctx.lang);
  if (geruest) return geruest(n);
  if (ctx.lang === "fr") return zahlwortFr(n, ctx.franzVariante ?? "fr-FR");
  // ★★★★★ ES-P7a-Behebung (M6): „es" bekommt jetzt sein eigenes Zahlwort
  // (RAE-Regeln, `zahlwortEs`) statt still ins Deutsche zu fallen - dieselbe
  // Absicherung, die „fr" seit E10a hat.
  if (ctx.lang === "es") return zahlwortEs(n);
  // ★ F8-it: Italienisch ebenso - `zahlwort(n, "it")` wirft absichtlich (Falle 50).
  if (ctx.lang === "it") return zahlwortIt(n);
  // ★ F8-pl: Polnisch ebenso - `zahlwort(n, "pl")` wirft absichtlich (Falle 50).
  if (ctx.lang === "pl") return zahlwortPl(n);
  // ★ F8-tr (03.10.2026): Türkisch ebenso - `zahlwort(n, "tr")` wirft absichtlich (Falle 50).
  if (ctx.lang === "tr") return zahlwortTr(n);
  // ★ F8-cs: Tschechisch ebenso - `zahlwort(n, "cs")` wirft absichtlich.
  if (ctx.lang === "cs") return zahlwortCs(n);
  return zahlwort(n, ctx.lang);
}

/**
 * Ist das Zahlwort dieser Zahl mit dem Tastenstand schreibbar?
 *
 * Wichtig, weil deutsche Zahlwörter Umlaute tragen („fünf", „dreißig") und
 * französische Zahlwörter Akzente und einen Bindestrich („soixante-et-onze")
 * - ein Kind ohne die nötige Taste könnte das Wort gar nicht schreiben, und
 * eine Aufgabe, die niemand lösen kann, ist keine Übung, sondern eine
 * Sackgasse.
 */
function wortSchreibbar(n: number, ctx: FormKontext): boolean {
  const wort = zahlwortFuerKind(n, ctx);
  // ★★★★★ ES-P7a-Behebung (M6): `ctx.lernweg` mitgeben - sonst gälte ein
  // Totasten-Buchstabe (das „é" in „dieciséis"/„veintiséis") als nicht
  // schreibbar, selbst wenn ´ UND e längst gelernt sind (dieselbe Fehlerklasse
  // wie M2, hier an einer weiteren Stelle).
  return fitText(wort, tastenstand(ctx), ctx.lernweg) === wort;
}

/**
 * Bedienung (EN4) - Deutsch wortgleich wie vorher. Die Zahlwörter sind
 * INHALT (Übungssprache, `zahlwort(n, ctx.lang)`): Der Rahmen folgt der
 * Bedienung, das eingesetzte Zahlwort nicht (`inhalt`, siehe `bedienung.ts`).
 *
 * ★ „Schreib das Zahlwort: 43." - hier ist auch die ZAHL Inhalt: Gesprochen
 * wird sie in der Übungssprache („dreiundvierzig"), und genau dieses Wort
 * schreibt das Kind. Eine englische Stimme sagte „forty-three".
 */
const TEXTE = texte({
  de: {
    ankuendigung: `Jetzt kommt ein Zahlendiktat. Mal schreibst du die Ziffern, mal das Wort.`,
    zifferFrage: (wort: string) => `Schreib die Zahl: ${wort}.`,
    wortFrage: (zahl: string) => `Schreib das Zahlwort: ${zahl}.`,
    aufloesung: (zahl: number, wort: string) => `${zahl} heißt ${wort}.`,
  },
  en: {
    ankuendigung: `Now for a number dictation. Sometimes you type the digits, sometimes the word.`,
    zifferFrage: (wort: string) => `Type it in digits: ${wort}.`,
    wortFrage: (zahl: string) => `Type it as a word: ${zahl}.`,
    aufloesung: (zahl: number, wort: string) => `${zahl} in words is ${wort}.`,
  },
  // ★ E11a-5 (26.09.2026): Französisch neu geschrieben. „en chiffres" / „en
  // lettres" sind die Wörter der Schule für die zwei Richtungen.
  fr: {
    ankuendigung: `Voici une dictée de nombres. Parfois tu écris les chiffres, parfois le mot.`,
    zifferFrage: (wort: string) => `Écris le nombre en chiffres : ${wort}.`,
    wortFrage: (zahl: string) => `Écris le nombre en lettres : ${zahl}.`,
    aufloesung: (zahl: number, wort: string) => `${zahl} s'écrit ${wort}.`,
  },
  es: {
    ankuendigung: `Aquí tienes un dictado de números. A veces escribes las cifras, a veces la palabra.`,
    zifferFrage: (wort: string) => `Escribe el número con cifras: ${wort}.`,
    wortFrage: (zahl: string) => `Escribe el número con letras: ${zahl}.`,
    aufloesung: (zahl: number, wort: string) => `${zahl} se escribe ${wort}.`,
  },
  it: {
    ankuendigung: `Ora tocca al dettato di numeri. A volte scrivi le cifre, a volte la parola.`,
    zifferFrage: (wort: string) => `Scrivi il numero in cifre: ${wort}.`,
    wortFrage: (zahl: string) => `Scrivi il numero in lettere: ${zahl}.`,
    aufloesung: (zahl: number, wort: string) => `${zahl} si scrive ${wort}.`,
  },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: {
    ankuendigung: `Teraz kolej na: Dyktando liczb. Raz piszesz cyfry, raz słowo.`,
    zifferFrage: (wort: string) => `Napisz liczbę cyframi: ${wort}.`,
    wortFrage: (zahl: string) => `Napisz liczbę słowami: ${zahl}.`,
    aufloesung: (zahl: number, wort: string) => `${zahl} słownie: ${wort}.`,
  },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: {
    ankuendigung: `Sırada: Sayı dikte. Bazen rakamları, bazen sayının yazılışını yazarsın.`,
    zifferFrage: (wort: string) => `Sayıyı rakamla yaz: ${wort}.`,
    wortFrage: (zahl: string) => `Sayıyı yazıyla yaz: ${zahl}.`,
    aufloesung: (zahl: number, wort: string) => `${zahl} yazıyla: ${wort}.`,
  },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  // Nach der Zahl am Satzende kein Punkt - sonst liest die Sprachausgabe eine Ordnungszahl
  // (Glossar §4 Falle 4).
  cs: {
    ankuendigung: `Teď: diktát čísel. Někdy napíšeš číslice, někdy slovo.`,
    zifferFrage: (wort: string) => `Napiš číslo číslicemi: ${wort}.`,
    wortFrage: (zahl: string) => `Napiš číslo slovy: ${zahl}`,
    aufloesung: (zahl: number, wort: string) => `${zahl} se píše ${wort}.`,
  },
  // ★ O2-TASTATUR (30.10.2026): die neun Sprachen. Der Name der Form wie `FORM_NAMEN`. Nach der Zahl am Satzende kein Punkt - sonst läse
  // die Sprachausgabe eine Ordnungszahl (Vorbild cs). Ohne Muttersprachler-Lesung.
  bg: {
    ankuendigung: `Сега: диктовка на числа. Понякога пишеш цифрите, понякога думата.`,
    zifferFrage: (wort: string) => `Напиши числото с цифри: ${wort}.`,
    wortFrage: (zahl: string) => `Напиши числото с думи: ${zahl}`,
    aufloesung: (zahl: number, wort: string) => `${zahl} се пише ${wort}.`,
  },
  el: {
    ankuendigung: `Τώρα: υπαγόρευση αριθμών. Μερικές φορές γράφεις τα ψηφία, μερικές φορές τη λέξη.`,
    zifferFrage: (wort: string) => `Γράψε τον αριθμό με ψηφία: ${wort}.`,
    wortFrage: (zahl: string) => `Γράψε τον αριθμό με λέξεις: ${zahl}`,
    aufloesung: (zahl: number, wort: string) => `${zahl} γράφεται ${wort}.`,
  },
  hu: {
    ankuendigung: `Most: számtollbamondás. Néha a számjegyeket írod, néha a szót.`,
    zifferFrage: (wort: string) => `Írd le a számot számjegyekkel: ${wort}.`,
    wortFrage: (zahl: string) => `Írd le a számot betűkkel: ${zahl}`,
    aufloesung: (zahl: number, wort: string) => `${zahl} betűkkel: ${wort}.`,
  },
  nl: {
    ankuendigung: `Nu: getallendictee. Soms typ je de cijfers, soms het woord.`,
    zifferFrage: (wort: string) => `Typ het getal in cijfers: ${wort}.`,
    wortFrage: (zahl: string) => `Typ het getal in letters: ${zahl}`,
    aufloesung: (zahl: number, wort: string) => `${zahl} schrijf je als ${wort}.`,
  },
  pt: {
    ankuendigung: `Agora: ditado de números. Umas vezes escreves os algarismos, outras vezes a palavra.`,
    zifferFrage: (wort: string) => `Escreve o número em algarismos: ${wort}.`,
    wortFrage: (zahl: string) => `Escreve o número por extenso: ${zahl}`,
    aufloesung: (zahl: number, wort: string) => `${zahl} escreve-se ${wort}.`,
  },
  br: {
    ankuendigung: `Agora: ditado de números. Às vezes você digita os algarismos, às vezes a palavra.`,
    zifferFrage: (wort: string) => `Digite o número em algarismos: ${wort}.`,
    wortFrage: (zahl: string) => `Digite o número por extenso: ${zahl}`,
    aufloesung: (zahl: number, wort: string) => `${zahl} se escreve ${wort}.`,
  },
  ro: {
    ankuendigung: `Acum: dictare de numere. Uneori scrii cifrele, alteori cuvântul.`,
    zifferFrage: (wort: string) => `Scrie numărul cu cifre: ${wort}.`,
    wortFrage: (zahl: string) => `Scrie numărul cu litere: ${zahl}`,
    aufloesung: (zahl: number, wort: string) => `${zahl} se scrie ${wort}.`,
  },
  sv: {
    ankuendigung: `Nu: sifferdiktamen. Ibland skriver du siffrorna, ibland ordet.`,
    zifferFrage: (wort: string) => `Skriv talet med siffror: ${wort}.`,
    wortFrage: (zahl: string) => `Skriv talet med bokstäver: ${zahl}`,
    aufloesung: (zahl: number, wort: string) => `${zahl} skrivs ${wort}.`,
  },
  uk: {
    ankuendigung: `Зараз: диктант чисел. Іноді друкуєш цифри, іноді слово.`,
    zifferFrage: (wort: string) => `Надрукуй число цифрами: ${wort}.`,
    wortFrage: (zahl: string) => `Надрукуй число словами: ${zahl}`,
    aufloesung: (zahl: number, wort: string) => `${zahl} пишеться ${wort}.`,
  },
});

function ankuendigung(ctx: FormKontext): string {
  return TEXTE[bedienSpracheVon(ctx)].ankuendigung;
}

/**
 * ★★★★ DIE ZIFFERN SIND DIE SCHRANKE (Testerin, 04.09.2026).
 *
 * Testerin nach ihrem Test mit Schülern: *„Das Zahlendiktat kam bereits nach
 * Grundreihe + e. Das ist zu früh, dafür braucht man alle Buchstaben und
 * Ziffern."*
 *
 * ★★★ Der Befund dahinter ist schärfer als die Meldung. Die alte Regel liess
 * die Form zu, sobald EINE der beiden Richtungen für EINE einzige Zahl ging.
 * Nach Grundreihe + e (`f j d k s l a ö e`) ist das genau eine Zahl:
 * **elf**. Gemessen über den ganzen Lehrgang:
 *
 * |  Einheiten | Vorrat                | Aufgaben in einer Runde von 12 |
 * |-----------:|-----------------------|--------------------------------|
 * |          9 | f j d k s l a ö e     | **1** - „Schreib das Zahlwort: 11." |
 * |         14 | + n i r t ⇧           | **1** - immer noch nur „elf"   |
 * |         31 | alle Buchstaben       | 10, nur eine Richtung          |
 * |         48 | + Ziffern             | 10, beide Richtungen           |
 *
 * Die Runde fragt zwölf Aufgaben an und bekommt eine - immer dieselbe. Das
 * ist keine Übung, das ist eine Schleife. Und für ein Kind sieht es aus wie
 * ein Programmfehler, nicht wie ein zu früh geöffnetes Angebot.
 *
 * ⇒ Die Form braucht die **Ziffern**. Erst mit ihnen gibt es beide
 * Richtungen, und genau deren Wechsel ist der Übungswert (43 heisst
 * „dreiundvierzig" - erst der Einer, dann der Zehner). Ohne Ziffern bleibt
 * nur die halbe Form, und die kam zu früh.
 *
 * ⚠️ Die Zahl der lösbaren Aufgaben ist damit nicht mehr im Code geprüft,
 * sondern im Wächter (`tests/tastenflow-zahlendiktat-schranke.test.ts`): Er
 * geht den ganzen Lehrgang ab und verlangt an JEDER Stelle, an der die Form
 * angeboten wird, eine Runde mit genug verschiedenen Aufgaben. Eine Prüfung
 * im Code wäre hier nie ausgeschlagen (mit freien Ziffern ist jede der 90
 * Zahlen schreibbar) - ein Wächter, der nicht anschlagen kann, beweist nichts.
 */
function taugt(ctx: FormKontext): boolean {
  return hatZahlwoerter(ctx) && ziffernFrei(ctx);
}

function fragen(ctx: FormKontext): RaetselAufgabe[] {
  if (!hatZahlwoerter(ctx)) return [];
  const t = TEXTE[bedienSpracheVon(ctx)];
  const anzahl = Math.max(1, Math.min(MAX_AUFGABEN, ctx.count));
  const ziffern = ziffernFrei(ctx);
  const aufgaben: RaetselAufgabe[] = [];
  const gehabt = new Set<number>();

  // Reichlich Anläufe: Nicht jede Zahl ist mit jedem Tastenstand schreibbar.
  for (let versuch = 0; versuch < 400 && aufgaben.length < anzahl; versuch += 1) {
    const n = VON + Math.floor(ctx.zufall() * (BIS - VON + 1));
    if (gehabt.has(n)) continue;
    const wort = zahlwortFuerKind(n, ctx);
    const wortGeht = wortSchreibbar(n, ctx);

    // Richtung wechseln, damit beide vorkommen - und die nehmen, die geht.
    const zifferRichtung = ziffern && (!wortGeht || aufgaben.length % 2 === 0);

    if (zifferRichtung) {
      gehabt.add(n);
      const frageTeile = inTeile(t.zifferFrage(inhalt(wort)));
      aufgaben.push({
        frage: ausTeilen(frageTeile),
        frageTeile,
        antworten: [String(n)],
      });
    } else if (wortGeht) {
      gehabt.add(n);
      const frageTeile = inTeile(t.wortFrage(inhalt(n)));
      const aufloesungTeile = inTeile(t.aufloesung(n, inhalt(wort)));
      aufgaben.push({
        frage: ausTeilen(frageTeile),
        frageTeile,
        antworten: antwortenFuerWort(wort, ctx.lang),
        aufloesung: ausTeilen(aufloesungTeile),
        aufloesungTeile,
      });
    }
  }
  return aufgaben;
}

export const zahlendiktat: Uebungsform = {
  id: "zahlendiktat",
  name: FORM_NAMEN.de.zahlendiktat,
  ankuendigung,
  taugt,
  eigenerBildschirm: "raetsel",
  // Ein Zahlwort schreibt man klein - aber wer „Dreiundvierzig" tippt, hat die
  // Aufgabe gelöst und nur den Satzanfang im Kopf gehabt. Hier zählt die
  // Zahl, nicht die Schreibung.
  grossKleinZaehlt: false,
  fragen,
};
