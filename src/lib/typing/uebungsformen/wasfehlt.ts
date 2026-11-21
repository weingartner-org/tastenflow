/**
 * Übungsform „Was fehlt hier?" - zwei fast gleiche Zeilen vergleichen.
 *
 *   Zeile eins:  Die Katze schläft auf dem warmen Ofen.
 *   Zeile zwei:  Die Katze schläft auf dem ... Ofen.
 *                                            ↑ welches Wort fehlt?
 *
 * Herkunft: Vorschlag vom 02.09.2026, von Johannes ausgewählt
 * (`VORSCHLAG-2026-09-02-NEUE-UEBUNGSFORMEN.md`, Nr. 4 - *„kann ich mir nicht
 * vorstellen, brauch ich zum Testen"*).
 *
 * ★★★★ Warum diese Form auf diese Plattform gehört: Ein sehendes Kind findet
 * den Unterschied zwischen zwei Zeilen mit EINEM Blick. Wer die Zeile abtastet
 * oder hört, muss ihn erarbeiten - Wort für Wort, im Kopf behalten, vergleichen.
 * Genau diese Arbeit macht ein Mensch mit Blindheit später täglich: zwei
 * Textstellen abgleichen, ohne sie nebeneinander sehen zu können. Es ist keine
 * Zusatzübung, sondern eine Kernkompetenz - und sie wird sonst nirgends
 * unterrichtet.
 *
 * ★★★ Die Entwurfsentscheidung, die alles trägt: **Getippt wird nur das
 * FEHLENDE WORT**, nicht die ganze Zeile. Am Würfeldiktat haben wir gelernt,
 * was eine lange freie Eingabe ohne Zeichen-für-Zeichen-Rückmeldung anrichtet -
 * wer sich bei Zeichen 30 vertippt, erfährt es erst am Ende und schreibt alles
 * neu. Ein einzelnes Wort ist kurz genug, dass das nicht passiert. Die
 * Vergleichs-Arbeit bleibt trotzdem vollständig erhalten: Sie steckt im FINDEN,
 * nicht im Abschreiben.
 *
 * ⚠️ Dass die Lösung in Zeile eins steht, ist hier ABSICHT und kein Verstoß
 * gegen die Lückentext-Regel. Dort ist die Lücke eine Wissensfrage, hier eine
 * Vergleichsaufgabe: Wer das Wort abliest, hat genau das getan, was die Übung
 * verlangt.
 */
import { fitText, passtLernweg } from "../corpus";
import { contentStufenFor } from "../account";
import type { FormKontext, RaetselAufgabe, Uebungsform } from "./typen";
import { korpusQuelle, MINDEST_AUFGABEN, mischen, tastenstand, ziffernFrei } from "./hilfen";
import { wandleSchreibweise } from "../schreibweise";
import { texte } from "../../bedienSprache/texte";
import { ausTeilen, bedienSpracheVon, inTeile, inhalt } from "./bedienung";
import { FORM_NAMEN } from "./namen";

/** Kürzere Sätze taugen nicht: Bei vier Wörtern ist der Vergleich kein Vergleich. */
const MIN_WOERTER = 6;

/** Und zu lange Sätze überfordern das Behalten auf der Braillezeile. */
const MAX_WOERTER = 12;

/** Das fehlende Wort muss lang genug sein, um es überhaupt zu suchen. */
const MIN_WORTLAENGE = 4;

/** So viele Aufgaben höchstens. */
const MAX_AUFGABEN = 8;

/** Ein Satz, aus dem sich eine Aufgabe bauen lässt. */
interface Kandidat {
  satz: string;
  /** Index des Wortes, das in Zeile zwei fehlt. */
  stelle: number;
  woerter: string[];
}

/** Satzzeichen weg - gesucht wird das WORT, nicht seine Interpunktion. */
function nurWort(w: string): string {
  return w.replace(/[.,!?;:„"'»«]/g, "");
}

export function kandidaten(ctx: FormKontext): Kandidat[] {
  const allowed = tastenstand(ctx);
  // `CorpusItem.stufen` traegt den WEITEN Stufen-Typ (mit den Alt-Werten
  // a/b/c), `contentStufenFor` liefert den engen. Der Vergleich laeuft
  // deshalb ueber Zeichenketten - ein Cast wuerde nur verstecken, dass es
  // zwei Typen sind.
  const etiketten = new Set<string>(contentStufenFor(ctx.stufe));
  const out: Kandidat[] = [];
  /*
   * ★ Sätze mit Ziffern erst ab der Ziffernreihe (Johannes, 11.09.2026: „ja,
   * erst ab Ziffernreihe"). Getippt wird hier nie eine Ziffer - aber
   * VERGLICHEN: „56 geteilt durch 7 ist 8." steht in beiden Zeilen, und wer
   * die Ziffern noch nicht kennt, vergleicht Zeichen, die er nicht lesen
   * gelernt hat. Kostet wenige Sätze (gemessen ab Stand 5).
   */
  const ziffernErlaubt = ziffernFrei(ctx);

  // ★ Die Sprache entscheidet ueber den Korpus. Ohne das stuenden im
  // Englisch-Modus deutsche Saetze - gefunden am 02.09.2026 im Durchlauf
  // aller Formen, nicht von einem Test.
  for (const item of korpusQuelle(ctx.lang)) {
    if (!item.stufen.some((s) => etiketten.has(s))) continue;
    // ★ E6a (24.09.2026): nur der eigene Lernweg (wie `corpusItemsFor`) - sonst
    // bekäme ein Kind auf Weg „de" mit Übungssprache Englisch die frühen
    // Sätze des Weges „en" gezeigt (andere Sprossen, anderer Tastenstand).
    if (!passtLernweg(item.nurWeg, ctx.lernweg)) continue;
    // ★ E10: Schreibweise VOR dem Zerlegen in Wörter (wie `langersatz.ts`) -
    // Vergleichszeile UND das gesuchte Wort müssen aus derselben Fassung
    // kommen, sonst stimmt „Zeile eins" nicht mit der Antwort überein.
    const satzText =
      ctx.lang === "en" && ctx.variante === "us" ? wandleSchreibweise(item.text, "us") : item.text;
    if (!ziffernErlaubt && /\d/.test(satzText)) continue;
    const woerter = satzText.split(/\s+/).filter(Boolean);
    if (woerter.length < MIN_WOERTER || woerter.length > MAX_WOERTER) continue;

    // Ein Wort, das lang genug und mit diesem Tastenstand schreibbar ist -
    // und NICHT das erste (dort verrät die Großschreibung zu viel) und nicht
    // das letzte (dort hängt das Satzzeichen dran).
    for (let i = 1; i < woerter.length - 1; i += 1) {
      const wort = nurWort(woerter[i]);
      if (wort.length < MIN_WORTLAENGE) continue;
      /*
       * ★★★★★ DAS GESUCHTE WORT TRÄGT KEIN EIGENES SATZZEICHEN (11.09.2026).
       *
       * Gemessen im Prüfdurchgang über alle Wortspiele: 20 bis 137 der
       * Kandidaten je Tastenstand standen in der angezeigten Zeile mit einem
       * Satzzeichen am Wort - `Fische,` · `gewusst?` · `Spinnentier.` ·
       * `rückwärts:`. Angezeigt wurde `Fische,`, erwartet wurde `Fische`
       * (`nurWort` schneidet das Zeichen von der ANTWORT ab, nicht von der
       * Zeile). Ein Kind, das genau abschreibt, was es liest - und das IST
       * hier die Aufgabe -, bekam „Noch nicht" zu hören.
       *
       * Es ist dieselbe Sorte Fehler wie die Großschreibung, die noch nicht
       * dran war (Johannes, 11.09.2026): als falsch gewertet, was das Kind
       * richtig gemacht hat. Deshalb fällt so ein Wort jetzt aus der Auswahl,
       * statt die Wertung nachsichtiger zu machen: Beim Vergleichen soll
       * Gesehenes und Geschriebenes ZEICHENGLEICH sein - das ist der
       * Lehrgegenstand dieser Form.
       *
       * ⚠️ Ein Bindestrich MITTEN im Wort bleibt (`Eiffelturm-Spitze`): Er
       * steht in der Zeile UND in der Antwort, gehört also zum Wort. Genau
       * darum wird gegen `nurWort` verglichen und nicht gegen eine eigene
       * Zeichenliste.
       */
      if (woerter[i] !== wort) continue;
      // ★ E10b-2: mit dem Weg (siehe `langersatz.ts`) - für „de"/„en" byte-gleich.
      if (fitText(wort, allowed, ctx.lernweg) !== wort) continue;
      // Kommt das Wort mehrfach im Satz vor, ist nicht eindeutig, welches fehlt.
      if (woerter.filter((w) => nurWort(w) === wort).length !== 1) continue;
      out.push({ satz: satzText, stelle: i, woerter });
      break; // ein Kandidat je Satz reicht
    }
  }
  return out;
}

/**
 * Bedienung (EN4) - Deutsch wortgleich wie vorher. Die beiden Zeilen und das
 * fehlende Wort sind INHALT (Übungssprache) - eingesetzt über `inhalt`, damit
 * der Bildschirm sie in englischer Bedienung als Deutsch auszeichnen kann.
 */
const TEXTE = texte({
  de: {
    ankuendigung: `Jetzt kommen zwei fast gleiche Zeilen. In der zweiten fehlt ein Wort - schreib es.`,
    frage: (eins: string, zwei: string) => `Zeile eins: ${eins} Zeile zwei: ${zwei} Welches Wort fehlt?`,
    aufloesung: (fehlt: string) => `Es fehlt: ${fehlt}.`,
  },
  en: {
    ankuendigung: `Now for two lines that are almost the same. A word is missing from the second one - type it.`,
    frage: (eins: string, zwei: string) => `Line one: ${eins} Line two: ${zwei} Which word is missing?`,
    aufloesung: (fehlt: string) => `The missing word is ${fehlt}.`,
  },
  // ★ E11a-5 (26.09.2026): Französisch neu geschrieben (tu, kurz).
  fr: {
    ankuendigung: `Voici deux lignes presque pareilles. Dans la deuxième, il manque un mot - écris-le.`,
    frage: (eins: string, zwei: string) =>
      `Première ligne : ${eins} Deuxième ligne : ${zwei} Quel mot manque ?`,
    aufloesung: (fehlt: string) => `Il manque : ${fehlt}.`,
  },
  es: {
    ankuendigung: `Aquí tienes dos líneas casi iguales. En la segunda falta una palabra - escríbela.`,
    frage: (eins: string, zwei: string) =>
      `Primera línea: ${eins} Segunda línea: ${zwei} ¿Qué palabra falta?`,
    aufloesung: (fehlt: string) => `Falta: ${fehlt}.`,
  },
  it: {
    ankuendigung: `Ora tocca a due righe quasi uguali. Nella seconda manca una parola - scrivila.`,
    frage: (eins: string, zwei: string) => `Prima riga: ${eins} Seconda riga: ${zwei} Quale parola manca?`,
    aufloesung: (fehlt: string) => `Manca: ${fehlt}.`,
  },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: {
    ankuendigung: `Teraz kolej na: dwa prawie takie same wiersze. W drugim brakuje jednego słowa - napisz je.`,
    frage: (eins: string, zwei: string) => `Wiersz pierwszy: ${eins} Wiersz drugi: ${zwei} Którego słowa brakuje?`,
    aufloesung: (fehlt: string) => `Brakuje: ${fehlt}.`,
  },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: {
    ankuendigung: `Sırada: Ne eksik? İki satır neredeyse aynı. İkincisinde bir kelime eksik - onu yaz.`,
    frage: (eins: string, zwei: string) => `Birinci satır: ${eins} İkinci satır: ${zwei} Hangi kelime eksik?`,
    aufloesung: (fehlt: string) => `Eksik kelime: ${fehlt}.`,
  },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  cs: {
    ankuendigung: `Teď: co tu chybí? Dva skoro stejné řádky. Ve druhém chybí jedno slovo - napiš ho.`,
    frage: (eins: string, zwei: string) => `První řádek: ${eins} Druhý řádek: ${zwei} Které slovo chybí?`,
    aufloesung: (fehlt: string) => `Chybí: ${fehlt}.`,
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: "Сега: два почти еднакви реда. Във втория липсва една дума - напиши я.",
    frage: (eins: string, zwei: string) => `Първи ред: ${eins} Втори ред: ${zwei} Коя дума липсва?`,
    aufloesung: (fehlt: string) => `Липсва думата ${fehlt}.`,
  },
  el: {
    ankuendigung: "Τώρα: δύο σχεδόν ίδιες γραμμές. Στη δεύτερη λείπει μια λέξη - γράψ' τη.",
    frage: (eins: string, zwei: string) => `Πρώτη γραμμή: ${eins} Δεύτερη γραμμή: ${zwei} Ποια λέξη λείπει;`,
    aufloesung: (fehlt: string) => `Λείπει η λέξη ${fehlt}.`,
  },
  hu: {
    ankuendigung: "Most: két majdnem egyforma sor. A másodikból hiányzik egy szó - írd be.",
    frage: (eins: string, zwei: string) => `Első sor: ${eins} Második sor: ${zwei} Melyik szó hiányzik?`,
    aufloesung: (fehlt: string) => `A hiányzó szó: ${fehlt}.`,
  },
  nl: {
    ankuendigung: "Nu: twee regels die bijna hetzelfde zijn. In de tweede ontbreekt een woord - typ het.",
    frage: (eins: string, zwei: string) => `Regel één: ${eins} Regel twee: ${zwei} Welk woord ontbreekt?`,
    aufloesung: (fehlt: string) => `Het woord dat ontbreekt is ${fehlt}.`,
  },
  pt: {
    ankuendigung: "Agora: duas linhas quase iguais. Na segunda falta uma palavra - escreve-a.",
    frage: (eins: string, zwei: string) => `Linha um: ${eins} Linha dois: ${zwei} Que palavra falta?`,
    aufloesung: (fehlt: string) => `A palavra que falta é ${fehlt}.`,
  },
  br: {
    ankuendigung: "Agora: duas linhas quase iguais. Na segunda está faltando uma palavra - digite essa palavra.",
    frage: (eins: string, zwei: string) => `Linha um: ${eins} Linha dois: ${zwei} Que palavra está faltando?`,
    aufloesung: (fehlt: string) => `A palavra que falta é ${fehlt}.`,
  },
  ro: {
    ankuendigung: "Acum: două rânduri aproape la fel. În al doilea lipsește un cuvânt - scrie-l.",
    frage: (eins: string, zwei: string) => `Primul rând: ${eins} Al doilea rând: ${zwei} Ce cuvânt lipsește?`,
    aufloesung: (fehlt: string) => `Cuvântul care lipsește este ${fehlt}.`,
  },
  sv: {
    ankuendigung: "Nu: två rader som är nästan likadana. I den andra saknas ett ord - skriv det.",
    frage: (eins: string, zwei: string) => `Rad ett: ${eins} Rad två: ${zwei} Vilket ord saknas?`,
    aufloesung: (fehlt: string) => `Ordet som saknas är ${fehlt}.`,
  },
  uk: {
    ankuendigung: "Далі: два майже однакові рядки. У другому бракує одного слова - надрукуй його.",
    frage: (eins: string, zwei: string) => `Перший рядок: ${eins} Другий рядок: ${zwei} Якого слова бракує?`,
    aufloesung: (fehlt: string) => `Бракує слова ${fehlt}.`,
  },
});

function ankuendigung(ctx: FormKontext): string {
  return TEXTE[bedienSpracheVon(ctx)].ankuendigung;
}

function taugt(ctx: FormKontext): boolean {
  return kandidaten(ctx).length >= MINDEST_AUFGABEN;
}

function fragen(ctx: FormKontext): RaetselAufgabe[] {
  const t = TEXTE[bedienSpracheVon(ctx)];
  const pool = mischen(kandidaten(ctx), ctx.zufall);
  const anzahl = Math.max(1, Math.min(MAX_AUFGABEN, ctx.count, pool.length));
  return pool.slice(0, anzahl).map((k) => {
    const zweite = k.woerter.map((w, i) => (i === k.stelle ? "..." : w)).join(" ");
    // Das WORT AUS DER ZEILE, unverändert - `kandidaten` lässt nur Wörter zu,
    // die dort ohne eigenes Satzzeichen stehen (siehe dort). Hier noch einmal
    // zu schneiden hiesse, den Unterschied wieder zu verstecken, den die
    // Auswahl gerade ausgeschlossen hat.
    const fehlt = k.woerter[k.stelle];
    const frageTeile = inTeile(t.frage(inhalt(k.satz), inhalt(zweite)));
    const aufloesungTeile = inTeile(t.aufloesung(inhalt(fehlt)));
    return {
      frage: ausTeilen(frageTeile),
      frageTeile,
      antworten: [fehlt],
      aufloesung: ausTeilen(aufloesungTeile),
      aufloesungTeile,
    };
  });
}

export const wasfehlt: Uebungsform = {
  id: "wasfehlt",
  name: FORM_NAMEN.de.wasfehlt,
  ankuendigung,
  taugt,
  eigenerBildschirm: "raetsel",
  // Das fehlende Wort steht in Zeile eins - genau so, wie es dort steht, soll
  // es auch geschrieben werden. Das Abgleichen IST die Aufgabe.
  grossKleinZaehlt: true,
  fragen,
};
