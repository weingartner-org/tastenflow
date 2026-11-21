/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★ DAS LINIENDIAGRAMM „SCORE DER KLASSE IM SCHULJAHR" (K3, 19.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„ich hätte noch gerne ein Liniendiagramm Schuljahr (Score der
 * Klasse), das nicht über die ganze Seite geht"* · *„wir brauchen beim
 * Liniendiagramm ein Mouseover, das erklärt, dass es bei Einführung von
 * Umschalt, Zahlen, Sonderzeichen naturgemäß auch kurzzeitig nach unten
 * geht"*.
 *
 * Eine Linie, 2 px, runde Ecken; drei zurückhaltende Gitterlinien mit ihren
 * Zahlen; an der Zeitachse nur die Monate. Eine Woche ohne Wert ist KEINE
 * Null (die Daten: `klassenScoreVerlauf`).
 *
 * ★★ L1 (19.09.2026, Johannes): *„das Diagramm muss viel feiner aufgelöst
 * werden und darf nicht unterbrochen sein, du kannst das mindestens nach
 * Wochen auflösen, wenn auch nur Monate dastehen"*. Seither:
 *  · JEDE Woche (Montag 08:00, `WOCHENZIEL_GRENZE`) hat ihren Platz auf der
 *    Zeitachse - auch eine ohne Wert, damit der Abstand die Zeit zeigt;
 *  · die Linie läuft DURCH - von Woche mit Wert zu Woche mit Wert, über eine
 *    Woche ohne genug Übung hinweg (vorher brach sie dort ab, und im Bild vom
 *    19.09. stand zwischen Aug. und Sep. eine Lücke);
 *  · damit das ehrlich bleibt, trägt JEDE Woche mit Wert einen kleinen Punkt
 *    (`data-score-punkt`): Wo kein Punkt ist, verbindet die Linie nur. Die
 *    Tabelle für die Sprachausgabe nennt jede Woche, auch „kein Wert".
 *
 * ── ⚠️ LEHRKRÄFTE MIT BLINDHEIT ───────────────────────────────────────────
 * Das Bild ist `role="img"` mit einer kurzen Zusammenfassung (erste, letzte,
 * höchste Woche). Die VOLLEN Zahlen stehen gleich danach in einer
 * unsichtbaren Tabelle (Woche · Score · Kinder) - eine Linie, deren Werte man
 * nur sehen kann, wäre für sie kein Überblick, sondern ein Loch.
 *
 * ── Tastatur und Maus zeigen dasselbe ──────────────────────────────────────
 * EIN Tab-Halt für das ganze Diagramm (wie die Punktleiste). Innen gehen die
 * Pfeiltasten von Woche zu Woche, Pos1/Ende an die Enden; die Maus findet die
 * nächste Woche mit Wert, ohne die dünne Linie treffen zu müssen. Beide zeigen
 * die Markierung und den Hinweis „Woche ab 14.09.: Score 64 (11 Kinder)".
 *
 * ── Farben nur aus den Kürzeln des Hauses ──────────────────────────────────
 * Linie und Gitter zeichnen mit `currentColor` - im Windows-Kontrastmodus
 * erzwingt das System die Textfarbe (`CanvasText`), die Linie bleibt also
 * sichtbar; das Gitter tritt dort als `GrayText` zurück. Punkte und
 * Markierung sind RÄNDER, keine Flächen: Hintergründe setzt der
 * Kontrastmodus auf die Grundfarbe, Ränder zeichnet er
 * (UEBERGABE-2026-09-09-ABEND-DER-KONTRASTMODUS.md). Kein `title`.
 */
import { useId, useMemo, useState } from "react";
import type { ScoreWoche } from "@/lib/typing/klassenueberblick";
import { mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { Erklaert } from "./Erklaert";
import { itPrepTag } from "@/lib/typing/datum";
import { schuljahrLabelCs } from "@/lib/typing/zeitraum";

/** ★ O-IT (02.10.2026): „del 14 set" / „dell'8 set" - der Tag steht vorn im Datum. */
function delIt(tag: string): string {
  return `${itPrepTag("del", parseInt(tag, 10))}${tag}`;
}

const MONATE = [
  "Jän.",
  "Feb.",
  "März",
  "Apr.",
  "Mai",
  "Juni",
  "Juli",
  "Aug.",
  "Sep.",
  "Okt.",
  "Nov.",
  "Dez.",
];

/** ★ EN6a (19.09.2026): die Monate britisch kurz, wie `en-GB` sie schreibt („Sept"). */
const MONATE_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

/**
 * ★ E11a-5 (26.09.2026): die Monate französisch kurz, wie `fr-FR` sie schreibt
 * („sept.") - für die Achse und für „semaine du 14 sept.".
 */
const MONATE_FR = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "aout",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

/** ★ ES-O (27.09.2026): die Monatsnamen spanisch, kurz (es-ES), klein wie im Spanischen. */
const MONATE_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];

/** ★ O-IT (02.10.2026): die Monatsnamen italienisch, kurz (it-IT), klein. */
const MONATE_IT = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];

/** ★ O-PL (02.10.2026): die Monatsnamen polnisch, kurz (pl-PL), klein. */
const MONATE_PL = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];

/** ★ O-TR (02.10.2026): die Monatsnamen türkisch, kurz und gross wie Intl tr-TR ("14 Eyl", Glossar §2.10). */
const MONATE_TR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

/**
 * ★ O-CS (03.10.2026): die Monatsnamen tschechisch für die ACHSE, kurz und klein
 * wie Intl cs-CZ (Nominativ, allein stehend). Mit einem Tag davor nie - dort
 * steht das Datum in Ziffern („14. 9.", {@link tagMonat}).
 */
const MONATE_CS = ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"];

/** ★ E11a-5: die Monatsnamen der Achse je Sprache - Tabelle statt Weiche (Falle 30). */
const MONATE_JE_SPRACHE: Record<BedienSprache, readonly string[]> = {
  de: MONATE,
  en: MONATE_EN,
  fr: MONATE_FR,
  es: MONATE_ES,
  it: MONATE_IT,
  pl: MONATE_PL, // ★ O-PL (02.10.2026)
  tr: MONATE_TR, // ★ O-TR (02.10.2026)
  cs: MONATE_CS, // ★ O-CS (03.10.2026)
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: // Kurzformen wie Intl „bg-BG" (month: "short"), klein.
  ["яну", "фев", "март", "апр", "май", "юни", "юли", "авг", "сеп", "окт", "ное", "дек"],
  el: // wie Intl „el" mit { month: "short" } (gemessen 29.10.2026), groß (Glossar Regel 9)
  ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαΐ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"],
  hu: // Intl „hu-HU" month:"short", klein (Glossar Regel 9).
  ["jan.", "febr.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec."],
  nl: // Glossar §2.10: eigene Tabelle mit Punkt (Intl „month: short" liefert ohne Punkt); „mei" ohne Punkt.
  ["jan.", "feb.", "mrt.", "apr.", "mei", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."],
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  br: // pt-BR kurz und klein wie Intl („set."), ohne Punkt wie es/it - steht als „14 set" hinter dem Tag.
  ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  ro: ["ian.", "feb.", "mar.", "apr.", "mai", "iun.", "iul.", "aug.", "sept.", "oct.", "nov.", "dec."],
  sv: ["jan", "feb", "mars", "apr", "maj", "juni", "juli", "aug", "sep", "okt", "nov", "dec"],
  uk: // Kurzformen wie Intl „uk-UA" (stand-alone, month: "short"), klein und ohne Punkt (Glossar Regel 7).
  ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"],
};

/** „14.09." - von Hand, damit keine Sprachdatei einen zweiten Punkt anhängt. */
export function tagMonat(ms: number, sprache: BedienSprache = "de"): string {
  const d = new Date(ms);
  // ★ O-CS (03.10.2026): „14. 9." (Intl cs-CZ, Glossar §2.10) - ein Monatsname
  // hinter dem Tag müsste im Genitiv stehen; Ziffern brauchen keinen Fall.
  if (sprache === "cs") return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });
  // ★ EN6a: englisch „14 Sept" (Glossar §1.2). ★ E11a-5: französisch „14 sept.".
  if (sprache !== "de") return `${d.getDate()} ${MONATE_JE_SPRACHE[sprache][d.getMonth()]}`;
  const zwei = (n: number) => String(n).padStart(2, "0");
  return `${zwei(d.getDate())}.${zwei(d.getMonth() + 1)}.`;
}

/**
 * ★ EN6a (19.09.2026): die Sätze des Diagramms in beiden Bedienungssprachen -
 * Deutsch wortgleich wie vorher. Kind ⇒ *pupil* (Glossar §3.8); „Woche ab
 * 14.09." ⇒ *Week of 14 Sept* (§3.2).
 */
const VERLAUF_TEXTE = texte({
  de: {
    wochenSatz: (tag: string, wert: number | null, kinder: number) =>
      `Woche ab ${tag}: Score ${wert} (${kinder} ${kinder === 1 ? "Kind" : "Kinder"})`,
    eineWoche: (titel: string, sj: string, satz: string) =>
      `Liniendiagramm: ${titel} ${sj}. ${satz}. ` + `Die Werte stehen in der Tabelle danach.`,
    vieleWochen: (
      titel: string,
      sj: string,
      n: number,
      erste: string,
      ersteWert: number | null,
      letzte: string,
      letzteWert: number | null,
      hoechste: string,
      hoechsteWert: number | null,
    ) =>
      `Liniendiagramm: ${titel} ${sj}, ${n} Wochen. ` +
      `Erste Woche ab ${erste}: ${ersteWert}, ` +
      `zuletzt Woche ab ${letzte}: ${letzteWert}, ` +
      `am höchsten Woche ab ${hoechste}: ${hoechsteWert}. ` +
      `Mit den Pfeiltasten von Woche zu Woche; alle Werte stehen in der Tabelle danach.`,
    caption: (titel: string, sj: string) => [titel, " ", sj, ", je Woche"],
    woche: "Woche",
    score: "Score",
    kinder: "Kinder",
    ab: (tag: string) => ["ab ", tag],
    keinWert: "kein Wert",
  },
  en: {
    wochenSatz: (tag: string, wert: number | null, kinder: number) =>
      `Week of ${tag}: score ${wert} (${kinder} ${kinder === 1 ? "pupil" : "pupils"})`,
    eineWoche: (titel: string, sj: string, satz: string) =>
      `Line chart: ${titel} ${sj}. ${satz}. The value is also in the table that follows.`,
    vieleWochen: (
      titel: string,
      sj: string,
      n: number,
      erste: string,
      ersteWert: number | null,
      letzte: string,
      letzteWert: number | null,
      hoechste: string,
      hoechsteWert: number | null,
    ) =>
      `Line chart: ${titel} ${sj}, ${n} weeks. ` +
      `First: week of ${erste}, score ${ersteWert}. ` +
      `Latest: week of ${letzte}, score ${letzteWert}. ` +
      `Highest: week of ${hoechste}, score ${hoechsteWert}. ` +
      `Use the arrow keys to go from week to week; all the values are in the table that follows.`,
    caption: (titel: string, sj: string) => [titel, " ", sj, ", per week"],
    woche: "Week",
    score: "Score",
    kinder: "Pupils",
    ab: (tag: string) => ["from ", tag],
    keinWert: "no value",
  },
  fr: {
    wochenSatz: (tag: string, wert: number | null, kinder: number) =>
      `Semaine du ${tag} : score ${wert} (${kinder} ${kinder === 1 ? "élève" : "élèves"})`,
    eineWoche: (titel: string, sj: string, satz: string) =>
      `Graphique en ligne : ${titel} ${sj}. ${satz}. ` + `La valeur figure aussi dans le tableau qui suit.`,
    vieleWochen: (
      titel: string,
      sj: string,
      n: number,
      erste: string,
      ersteWert: number | null,
      letzte: string,
      letzteWert: number | null,
      hoechste: string,
      hoechsteWert: number | null,
    ) =>
      `Graphique en ligne : ${titel} ${sj}, ${n} semaines. ` +
      `Première semaine, du ${erste} : ${ersteWert} ; ` +
      `dernière, du ${letzte} : ${letzteWert} ; ` +
      `la plus haute, du ${hoechste} : ${hoechsteWert}. ` +
      `Les flèches passent d'une semaine à l'autre ; toutes les valeurs figurent dans le tableau qui suit.`,
    caption: (titel: string, sj: string) => [titel, " ", sj, ", par semaine"],
    woche: "Semaine",
    score: "Score",
    kinder: "Élèves",
    ab: (tag: string) => ["à partir du ", tag],
    keinWert: "aucune valeur",
  },
  // ★ ES-O (27.09.2026): liest die Lehrkraft (Klassenüberblick) - ohne Anrede.
  es: {
    wochenSatz: (tag: string, wert: number | null, kinder: number) =>
      `Semana del ${tag}: puntuación ${wert} (${kinder} ${kinder === 1 ? "estudiante" : "estudiantes"})`,
    eineWoche: (titel: string, sj: string, satz: string) =>
      `Gráfico de líneas: ${titel} ${sj}. ${satz}. ` + `El valor también está en la tabla que sigue.`,
    vieleWochen: (
      titel: string,
      sj: string,
      n: number,
      erste: string,
      ersteWert: number | null,
      letzte: string,
      letzteWert: number | null,
      hoechste: string,
      hoechsteWert: number | null,
    ) =>
      `Gráfico de líneas: ${titel} ${sj}, ${n} semanas. ` +
      `Primera semana, del ${erste}: ${ersteWert}; ` +
      `última, del ${letzte}: ${letzteWert}; ` +
      `la más alta, del ${hoechste}: ${hoechsteWert}. ` +
      `Las flechas pasan de una semana a otra; todos los valores están en la tabla que sigue.`,
    caption: (titel: string, sj: string) => [titel, " ", sj, ", por semanas"],
    woche: "Semana",
    score: "Puntuación",
    kinder: "Estudiantes",
    ab: (tag: string) => ["a partir del ", tag],
    keinWert: "sin valor",
  },
  // ★ O-IT (02.10.2026): „Settimana del 14 set" (Glossar §2.6), „alunni" (Regel 2).
  it: {
    wochenSatz: (tag: string, wert: number | null, kinder: number) =>
      `Settimana ${delIt(tag)}: punteggio ${wert} (${kinder === 1 ? "1 persona" : `${kinder} alunni`})`,
    eineWoche: (titel: string, sj: string, satz: string) =>
      `Grafico a linee: ${titel} ${sj}. ${satz}. ` + `Il valore è anche nella tabella che segue.`,
    vieleWochen: (
      titel: string,
      sj: string,
      n: number,
      erste: string,
      ersteWert: number | null,
      letzte: string,
      letzteWert: number | null,
      hoechste: string,
      hoechsteWert: number | null,
    ) =>
      `Grafico a linee: ${titel} ${sj}, ${n} settimane. ` +
      `Prima settimana, ${delIt(erste)}: ${ersteWert}; ` +
      `ultima, ${delIt(letzte)}: ${letzteWert}; ` +
      `la più alta, ${delIt(hoechste)}: ${hoechsteWert}. ` +
      `Le frecce passano da una settimana all'altra; tutti i valori sono nella tabella che segue.`,
    caption: (titel: string, sj: string) => [titel, " ", sj, ", per settimana"],
    woche: "Settimana",
    score: "Punteggio",
    kinder: "Alunni",
    ab: (tag: string) => [itPrepTag("dal", parseInt(tag, 10)), tag],
    keinWert: "nessun valore",
  },
  // ★ O-PL (02.10.2026): „Tydzień od 14 wrz" (Glossar §2.6), Personen als
  // „osoba" mit vier Formen in Klammern (Nominativ, §2.10a), Zahl der Wochen
  // nach Doppelpunkt.
  pl: {
    wochenSatz: (tag: string, wert: number | null, kinder: number) =>
      `Tydzień od ${tag}: wynik ${wert} (${mehrzahl(kinder, "pl", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osób`,
        other: (z) => `${z} osoby`,
      })})`,
    eineWoche: (titel: string, sj: string, satz: string) =>
      `Wykres liniowy: ${titel} ${sj}. ${satz}. ` + `Wartość jest też w tabeli poniżej.`,
    vieleWochen: (
      titel: string,
      sj: string,
      n: number,
      erste: string,
      ersteWert: number | null,
      letzte: string,
      letzteWert: number | null,
      hoechste: string,
      hoechsteWert: number | null,
    ) =>
      `Wykres liniowy: ${titel} ${sj}, tygodnie: ${n}. ` +
      `Pierwszy tydzień, od ${erste}: ${ersteWert}; ` +
      `ostatni, od ${letzte}: ${letzteWert}; ` +
      `z najwyższym wynikiem, od ${hoechste}: ${hoechsteWert}. ` +
      `Strzałki przechodzą z tygodnia na tydzień; wszystkie wartości są w tabeli poniżej.`,
    caption: (titel: string, sj: string) => [titel, " ", sj, ", według tygodni"],
    woche: "Tydzień",
    score: "Wynik",
    kinder: "Uczniowie",
    ab: (tag: string) => ["od ", tag],
    keinWert: "brak wartości",
  },
  // ★ O-TR (02.10.2026): nur die Lehrkraft (Klassenüberblick) - siz mit -In.
  // "14 Eyl haftası" (Endung an "hafta", nie an der Zahl, Glossar Regel 6),
  // nach der Zahl Einzahl ("11 öğrenci", "12 hafta").
  tr: {
    wochenSatz: (tag: string, wert: number | null, kinder: number) =>
      `${tag} haftası: puan ${wert} (${kinder} öğrenci)`,
    eineWoche: (titel: string, sj: string, satz: string) =>
      `Çizgi grafik: ${titel} ${sj}. ${satz}. ` + `Değer aşağıdaki tabloda da var.`,
    vieleWochen: (
      titel: string,
      sj: string,
      n: number,
      erste: string,
      ersteWert: number | null,
      letzte: string,
      letzteWert: number | null,
      hoechste: string,
      hoechsteWert: number | null,
    ) =>
      `Çizgi grafik: ${titel} ${sj}, ${n} hafta. ` +
      `İlk hafta: ${erste} haftası, puan ${ersteWert}. ` +
      `Son hafta: ${letzte} haftası, puan ${letzteWert}. ` +
      `En yüksek: ${hoechste} haftası, puan ${hoechsteWert}. ` +
      `Ok tuşlarıyla haftadan haftaya geçin; tüm değerler aşağıdaki tabloda.`,
    caption: (titel: string, sj: string) => [titel, " ", sj, ", haftalık"],
    woche: "Hafta",
    score: "Puan",
    kinder: "Öğrenciler",
    ab: (tag: string) => [tag, " haftası"],
    keinWert: "değer yok",
  },
  // ★ O-CS (03.10.2026): nur die Lehrkraft (Klassenüberblick) - vy. „Týden od
  // 14. 9." (Glossar §2.6, ohne Wochennummer), Personen als „osoba" mit allen
  // vier Formen (§2.11), Schuljahr „2025/2026" (`schuljahrLabelCs`). Kein Satz
  // endet auf einer Zahl oder einem Datum mit Punkt (Glossar §4 Falle 4) - die
  // Werte stehen nach Doppelpunkt, getrennt durch Strichpunkte.
  cs: {
    wochenSatz: (tag: string, wert: number | null, kinder: number) =>
      `Týden od ${tag}: skóre ${wert} (${mehrzahl(kinder, "cs", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osoby`,
        other: (z) => `${z} osob`,
      })})`,
    eineWoche: (titel: string, sj: string, satz: string) =>
      `Spojnicový graf: ${titel} ${schuljahrLabelCs(sj)} - ${satz}. ` + `Hodnota je i v tabulce níže.`,
    vieleWochen: (
      titel: string,
      sj: string,
      n: number,
      erste: string,
      ersteWert: number | null,
      letzte: string,
      letzteWert: number | null,
      hoechste: string,
      hoechsteWert: number | null,
    ) =>
      `Spojnicový graf: ${titel} ${schuljahrLabelCs(sj)}, celkem ${mehrzahl(n, "cs", {
        one: (z) => `${z} týden`,
        few: (z) => `${z} týdny`,
        many: (z) => `${z} týdne`,
        other: (z) => `${z} týdnů`,
      })}. ` +
      `První týden od ${erste}: skóre ${ersteWert}; ` +
      `poslední týden od ${letzte}: skóre ${letzteWert}; ` +
      `nejvyšší skóre ${hoechsteWert} v týdnu od ${hoechste}; ` +
      `šipkami přejdete z týdne na týden, všechny hodnoty jsou v tabulce níže.`,
    caption: (titel: string, sj: string) => [titel, " ", schuljahrLabelCs(sj), ", po týdnech"],
    woche: "Týden",
    score: "Skóre",
    kinder: "Žáci",
    ab: (tag: string) => ["od ", tag],
    keinWert: "bez hodnoty",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      wochenSatz: (tag: string, wert: number | null, kinder: number) =>
        `Седмицата от ${tag}: резултат ${wert} (${kinder} ${kinder === 1 ? "ученик" : "ученици"})`,
      eineWoche: (titel: string, sj: string, satz: string) =>
        `Линейна диаграма: ${titel} ${sj}. ${satz}. Стойността е и в таблицата след нея.`,
      vieleWochen: (
        titel: string,
        sj: string,
        n: number,
        erste: string,
        ersteWert: number | null,
        letzte: string,
        letzteWert: number | null,
        hoechste: string,
        hoechsteWert: number | null,
      ) =>
        `Линейна диаграма: ${titel} ${sj}, седмици: ${n}. ` +
        `Първа: седмицата от ${erste}, резултат ${ersteWert}. ` +
        `Последна: седмицата от ${letzte}, резултат ${letzteWert}. ` +
        `Най-висок: седмицата от ${hoechste}, резултат ${hoechsteWert}. ` +
        `Със стрелките от седмица на седмица - всички стойности са в таблицата след нея.`,
      caption: (titel: string, sj: string) => [titel, " ", sj, ", по седмици"],
      woche: "Седмица",
      score: "Резултат",
      kinder: "Ученици",
      ab: (tag: string) => ["от ", tag],
      keinWert: "няма стойност",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      wochenSatz: (tag: string, wert: number | null, kinder: number) =>
        `Εβδομάδα από ${tag}: σκορ ${wert} (${kinder} ${kinder === 1 ? "παιδί" : "παιδιά"})`,
      eineWoche: (titel: string, sj: string, satz: string) =>
        `Γράφημα γραμμών: ${titel} ${sj}. ${satz}. Η τιμή υπάρχει και στον πίνακα που ακολουθεί.`,
      vieleWochen: (
        titel: string,
        sj: string,
        n: number,
        erste: string,
        ersteWert: number | null,
        letzte: string,
        letzteWert: number | null,
        hoechste: string,
        hoechsteWert: number | null,
      ) =>
        `Γράφημα γραμμών: ${titel} ${sj}, εβδομάδες: ${n}. ` +
        `Πρώτη: εβδομάδα από ${erste}, σκορ ${ersteWert}. ` +
        `Πιο πρόσφατη: εβδομάδα από ${letzte}, σκορ ${letzteWert}. ` +
        `Υψηλότερη: εβδομάδα από ${hoechste}, σκορ ${hoechsteWert}. ` +
        `Με τα πλήκτρα βέλους μετακινείστε από εβδομάδα σε εβδομάδα. Όλες οι τιμές βρίσκονται στον πίνακα που ακολουθεί.`,
      caption: (titel: string, sj: string) => [titel, " ", sj, ", ανά εβδομάδα"],
      woche: "Εβδομάδα",
      score: "Σκορ",
      kinder: "Παιδιά",
      ab: (tag: string) => ["από ", tag],
      keinWert: "χωρίς τιμή",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      wochenSatz: (tag: string, wert: number | null, kinder: number) =>
        `Hét kezdete: ${tag}, pontszám: ${wert} (${kinder} tanuló)`,
      eineWoche: (titel: string, sj: string, satz: string) =>
        `Vonaldiagram: ${titel} ${sj}. ${satz}. ` + `Az érték a következő táblázatban is szerepel.`,
      vieleWochen: (
        titel: string,
        sj: string,
        n: number,
        erste: string,
        ersteWert: number | null,
        letzte: string,
        letzteWert: number | null,
        hoechste: string,
        hoechsteWert: number | null,
      ) =>
        `Vonaldiagram: ${titel} ${sj}, ${n} hét. ` +
        `Első hét: pontszám ${ersteWert}, kezdete ${erste}. ` +
        `Utolsó hét: pontszám ${letzteWert}, kezdete ${letzte}. ` +
        `Legmagasabb: pontszám ${hoechsteWert}, a hét kezdete ${hoechste}. ` +
        `A nyílbillentyűkkel hétről hétre lehet lépni; minden érték a következő táblázatban szerepel.`,
      caption: (titel: string, sj: string) => [titel, " ", sj, ", hetente"],
      woche: "Hét",
      score: "Pontszám",
      kinder: "Tanulók",
      ab: (tag: string) => ["kezdete: ", tag],
      keinWert: "nincs érték",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      wochenSatz: (tag: string, wert: number | null, kinder: number) =>
        `Week van ${tag}: score ${wert} (${mehrzahl(kinder, "nl", { one: (z) => `${z} leerling`, other: (z) => `${z} leerlingen` })})`,
      eineWoche: (titel: string, sj: string, satz: string) =>
        `Lijndiagram: ${titel} ${sj}. ${satz}. De waarde staat ook in de tabel hierna.`,
      vieleWochen: (
        titel: string,
        sj: string,
        n: number,
        erste: string,
        ersteWert: number | null,
        letzte: string,
        letzteWert: number | null,
        hoechste: string,
        hoechsteWert: number | null,
      ) =>
        `Lijndiagram: ${titel} ${sj}, ${n} weken. ` +
        `Eerste: week van ${erste}, score ${ersteWert}. ` +
        `Laatste: week van ${letzte}, score ${letzteWert}. ` +
        `Hoogste: week van ${hoechste}, score ${hoechsteWert}. ` +
        `Met de pijltoetsen van week naar week; alle waarden staan in de tabel hierna.`,
      caption: (titel: string, sj: string) => [titel, " ", sj, ", per week"],
      woche: "Week",
      score: "Score",
      kinder: "Leerlingen",
      ab: (tag: string) => ["vanaf ", tag],
      keinWert: "geen waarde",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      wochenSatz: (tag: string, wert: number | null, kinder: number) =>
        `Semana de ${tag}: pontuação ${wert} (${kinder} ${kinder === 1 ? "estudante" : "estudantes"})`,
      eineWoche: (titel: string, sj: string, satz: string) =>
        `Gráfico de linhas: ${titel} ${sj}. ${satz}. O valor também está na tabela a seguir.`,
      vieleWochen: (
        titel: string,
        sj: string,
        n: number,
        erste: string,
        ersteWert: number | null,
        letzte: string,
        letzteWert: number | null,
        hoechste: string,
        hoechsteWert: number | null,
      ) =>
        `Gráfico de linhas: ${titel} ${sj}, ${n} semanas. ` +
        `Primeira: semana de ${erste}, pontuação ${ersteWert}. ` +
        `Mais recente: semana de ${letzte}, pontuação ${letzteWert}. ` +
        `Mais alta: semana de ${hoechste}, pontuação ${hoechsteWert}. ` +
        `Use as teclas de seta para passar de semana em semana; todos os valores estão na tabela a seguir.`,
      caption: (titel: string, sj: string) => [titel, " ", sj, ", por semana"],
      woche: "Semana",
      score: "Pontuação",
      kinder: "Estudantes",
      ab: (tag: string) => ["a partir de ", tag],
      keinWert: "sem valor",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      wochenSatz: (tag: string, wert: number | null, kinder: number) =>
        `Semana de ${tag}: pontuação ${wert} (${kinder} ${kinder === 1 ? "estudante" : "estudantes"})`,
      eineWoche: (titel: string, sj: string, satz: string) =>
        `Gráfico de linhas: ${titel} ${sj}. ${satz}. O valor também está na tabela a seguir.`,
      vieleWochen: (
        titel: string,
        sj: string,
        n: number,
        erste: string,
        ersteWert: number | null,
        letzte: string,
        letzteWert: number | null,
        hoechste: string,
        hoechsteWert: number | null,
      ) =>
        `Gráfico de linhas: ${titel} ${sj}, ${n} semanas. ` +
        `Primeira: semana de ${erste}, pontuação ${ersteWert}. ` +
        `Última: semana de ${letzte}, pontuação ${letzteWert}. ` +
        `Mais alta: semana de ${hoechste}, pontuação ${hoechsteWert}. ` +
        `Use as teclas de seta para ir de semana em semana; todos os valores estão na tabela a seguir.`,
      caption: (titel: string, sj: string) => [titel, " ", sj, ", por semana"],
      woche: "Semana",
      score: "Pontuação",
      kinder: "Estudantes",
      ab: (tag: string) => ["a partir de ", tag],
      keinWert: "sem valor",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      wochenSatz: (tag: string, wert: number | null, kinder: number) =>
        `Săptămâna începând cu ${tag}: scor ${wert} (elevi: ${kinder})`,
      eineWoche: (titel: string, sj: string, satz: string) =>
        `Grafic liniar: ${titel} ${sj}. ${satz}. Valoarea apare și în tabelul de mai jos.`,
      vieleWochen: (
        titel: string,
        sj: string,
        n: number,
        erste: string,
        ersteWert: number | null,
        letzte: string,
        letzteWert: number | null,
        hoechste: string,
        hoechsteWert: number | null,
      ) =>
        `Grafic liniar: ${titel} ${sj}, săptămâni: ${n}. ` +
        `Prima: săptămâna începând cu ${erste}, scor ${ersteWert}. ` +
        `Ultima: săptămâna începând cu ${letzte}, scor ${letzteWert}. ` +
        `Cel mai mare: săptămâna începând cu ${hoechste}, scor ${hoechsteWert}. ` +
        `Cu săgețile treceți de la o săptămână la alta; toate valorile sunt în tabelul de mai jos.`,
      caption: (titel: string, sj: string) => [titel, " ", sj, ", pe săptămână"],
      woche: "Săptămâna",
      score: "Scor",
      kinder: "Elevi",
      ab: (tag: string) => ["de la ", tag],
      keinWert: "fără valoare",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      wochenSatz: (tag: string, wert: number | null, kinder: number) =>
        `Veckan från ${tag}: poäng ${wert} (${kinder} ${kinder === 1 ? "elev" : "elever"})`,
      eineWoche: (titel: string, sj: string, satz: string) =>
        `Linjediagram: ${titel} ${sj}. ${satz}. Värdet står också i tabellen efter diagrammet.`,
      vieleWochen: (
        titel: string,
        sj: string,
        n: number,
        erste: string,
        ersteWert: number | null,
        letzte: string,
        letzteWert: number | null,
        hoechste: string,
        hoechsteWert: number | null,
      ) =>
        `Linjediagram: ${titel} ${sj}, ${n} veckor. ` +
        `Först: veckan från ${erste}, poäng ${ersteWert}. ` +
        `Senast: veckan från ${letzte}, poäng ${letzteWert}. ` +
        `Högst: veckan från ${hoechste}, poäng ${hoechsteWert}. ` +
        `Gå från vecka till vecka med piltangenterna; alla värden står i tabellen efter diagrammet.`,
      caption: (titel: string, sj: string) => [titel, " ", sj, ", per vecka"],
      woche: "Vecka",
      score: "Poäng",
      kinder: "Elever",
      ab: (tag: string) => ["från ", tag],
      keinWert: "inget värde",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      wochenSatz: (tag: string, wert: number | null, kinder: number) =>
        `Тиждень з ${tag}: бали ${wert} (${mehrzahl(kinder, "uk", {
          one: (z) => `${z} дитина`,
          few: (z) => `${z} дитини`,
          many: (z) => `${z} дітей`,
          other: (z) => `${z} дитини`,
        })})`,
      eineWoche: (titel: string, sj: string, satz: string) =>
        `Лінійний графік: ${titel} ${sj}. ${satz}. Значення є також у таблиці після нього.`,
      vieleWochen: (
        titel: string,
        sj: string,
        n: number,
        erste: string,
        ersteWert: number | null,
        letzte: string,
        letzteWert: number | null,
        hoechste: string,
        hoechsteWert: number | null,
      ) =>
        `Лінійний графік: ${titel} ${sj}, тижнів: ${n}. ` +
        `Перший: бали ${ersteWert}, тиждень з ${erste}. ` +
        `Останній: бали ${letzteWert}, тиждень з ${letzte}. ` +
        `Найвищі: бали ${hoechsteWert}, тиждень з ${hoechste}. ` +
        `Клавішами зі стрілками можна переходити від тижня до тижня; усі значення є в таблиці після графіка.`,
      caption: (titel: string, sj: string) => [titel, " ", sj, ", за тижнями"],
      woche: "Тиждень",
      score: "Бали",
      kinder: "Діти",
      ab: (tag: string) => ["з ", tag],
      keinWert: "немає значення",
    },
});

/** Der Satz am Punkt - „Woche ab 14.09.: Score 64 (11 Kinder)". */
export function wochenSatz(w: ScoreWoche, sprache: BedienSprache = "de"): string {
  return VERLAUF_TEXTE[sprache].wochenSatz(tagMonat(w.startMs, sprache), w.wert, w.kinder);
}

/**
 * Die Enden der Hochachse: der Bereich der Daten, auf 10 gerundet, mit Luft
 * und mindestens 20 Punkten breit - sonst sähe ein Schritt von 2 Punkten aus
 * wie ein Sturz. Nie unter 0, nie über 100.
 */
function hochachse(werte: readonly number[]): { lo: number; hi: number } {
  let lo = Math.max(0, Math.floor((Math.min(...werte) - 5) / 10) * 10);
  let hi = Math.min(100, Math.ceil((Math.max(...werte) + 5) / 10) * 10);
  while (hi - lo < 20) {
    if (lo > 0) lo -= 10;
    else hi += 10;
  }
  return { lo, hi };
}

export function ScoreVerlauf({
  wochen,
  titel,
  hilfe,
  schuljahrLabel,
}: {
  wochen: readonly ScoreWoche[];
  titel: string;
  /** Die Erklärung an der Überschrift (Mouseover, `Erklaert`). */
  hilfe: string;
  /** „2026/27" - für die Zusammenfassung und die Tabelle. */
  schuljahrLabel: string;
}) {
  const titelId = useId();
  const [aktiv, setAktiv] = useState<number | null>(null);
  const [imFokus, setImFokus] = useState(false);
  const { sprache } = useBedienSprache();
  const t = VERLAUF_TEXTE[sprache];

  const mitWert = useMemo(
    () => wochen.map((w, i) => (w.wert === null ? -1 : i)).filter((i) => i >= 0),
    [wochen],
  );
  const achse = useMemo(
    () => (mitWert.length ? hochachse(mitWert.map((i) => wochen[i].wert as number)) : null),
    [wochen, mitWert],
  );

  if (!achse || mitWert.length === 0) return null;
  const { lo, hi } = achse;
  const n = wochen.length;
  const x = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
  const y = (wert: number) => (1 - (wert - lo) / (hi - lo)) * 100;

  /*
    ★★ L1 (19.09.2026): EINE durchgehende Linie von Woche mit Wert zu Woche mit
    Wert - eine Woche ohne Wert unterbricht sie nicht mehr (Johannes: „darf
    nicht unterbrochen sein"). Die Woche behält trotzdem ihren Platz auf der
    Zeitachse (`x(i)` zählt JEDE Woche), die Linie springt also nicht,
    sondern verbindet über die Zeit hinweg.
  */
  const d = mitWert
    .map((i, k) => `${k === 0 ? "M" : "L"}${x(i).toFixed(2)} ${y(wochen[i].wert as number).toFixed(2)}`)
    .join(" ");

  // Monatsnamen an der Zeitachse: an der ersten Woche eines neuen Monats
  // (gezählt am Donnerstag der Woche, wie bei Kalenderwochen). Zu dicht
  // aufeinander folgende Namen fallen weg - der spätere gewinnt, er markiert
  // den echten Monatsbeginn.
  const monatVon = (ms: number) => {
    const t = new Date(ms);
    t.setDate(t.getDate() + 3);
    return t.getMonth();
  };
  const marken: { i: number; name: string }[] = [];
  wochen.forEach((w, i) => {
    const m = monatVon(w.startMs);
    if (i === 0 || m !== monatVon(wochen[i - 1].startMs)) {
      const vorige = marken[marken.length - 1];
      if (vorige && x(i) - x(vorige.i) < 14) marken.pop();
      marken.push({ i, name: MONATE_JE_SPRACHE[sprache][m] });
    }
  });

  const werte = mitWert.map((i) => wochen[i]);
  const erste = werte[0];
  const letzte = werte[werte.length - 1];
  const hoechste = werte.reduce((a, b) => ((b.wert as number) > (a.wert as number) ? b : a));
  const zusammenfassung =
    werte.length === 1
      ? t.eineWoche(titel, schuljahrLabel, wochenSatz(erste, sprache))
      : t.vieleWochen(
          titel,
          schuljahrLabel,
          n,
          tagMonat(erste.startMs, sprache),
          erste.wert,
          tagMonat(letzte.startMs, sprache),
          letzte.wert,
          tagMonat(hoechste.startMs, sprache),
          hoechste.wert,
        );

  const zeige = aktiv !== null ? wochen[aktiv] : undefined;

  /** Die nächste Woche MIT Wert in Richtung `schritt` - oder dieselbe. */
  function nachbar(von: number, schritt: 1 | -1): number {
    const pos = mitWert.indexOf(von);
    const neu = pos + schritt;
    return mitWert[Math.max(0, Math.min(mitWert.length - 1, neu))];
  }

  function beiTaste(e: React.KeyboardEvent) {
    const i = aktiv ?? mitWert[mitWert.length - 1];
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        setAktiv(nachbar(i, 1));
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        setAktiv(nachbar(i, -1));
        break;
      case "Home":
        e.preventDefault();
        setAktiv(mitWert[0]);
        break;
      case "End":
        e.preventDefault();
        setAktiv(mitWert[mitWert.length - 1]);
        break;
      case "Escape":
        // Der Hinweis geht weg (WCAG 1.4.13) - die Taste läuft weiter, die
        // Seite behält ihre eigene Escape-Regel.
        setAktiv(null);
        break;
      default:
        break;
    }
  }

  /** Die Maus sucht die nächste Woche MIT Wert - nie muss sie die Linie treffen. */
  function beiZeiger(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    if (r.width <= 0) return;
    const anteil = ((e.clientX - r.left) / r.width) * 100;
    let beste = mitWert[0];
    for (const i of mitWert) if (Math.abs(x(i) - anteil) < Math.abs(x(beste) - anteil)) beste = i;
    setAktiv(beste);
  }

  const gitter = [hi, (lo + hi) / 2, lo];

  return (
    <section aria-labelledby={titelId} className="relative w-full min-w-0 max-w-[28rem] space-y-1">
      <h4 id={titelId} className="m-0 text-sm font-semibold text-ink">
        <Erklaert hilfe={hilfe}>{titel}</Erklaert>
      </h4>
      <div
        role="img"
        tabIndex={0}
        aria-label={zusammenfassung}
        onKeyDown={beiTaste}
        onFocus={() => {
          setImFokus(true);
          if (aktiv === null) setAktiv(mitWert[mitWert.length - 1]);
        }}
        onBlur={() => {
          setImFokus(false);
          setAktiv(null);
        }}
        className="relative h-36 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {/* Die Zeichenfläche - links Platz für die Zahlen, unten für die Monate. */}
        <div
          className="absolute bottom-6 left-8 right-3 top-3"
          onPointerMove={beiZeiger}
          onPointerLeave={() => {
            if (!imFokus) setAktiv(null);
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
            focusable="false"
          >
            {gitter.map((g) => (
              <line
                key={g}
                x1="0"
                x2="100"
                y1={y(g)}
                y2={y(g)}
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className="text-hairline forced-colors:text-[GrayText]"
              />
            ))}
            {zeige && (
              <line
                x1={x(aktiv!)}
                x2={x(aktiv!)}
                y1="0"
                y2="100"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className="text-ink-muted forced-colors:text-[GrayText]"
              />
            )}
            <path
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="text-accent forced-colors:text-[CanvasText]"
              data-score-linie=""
            />
          </svg>

          {/* Die Zahlen am Gitter - Text trägt die Textfarbe, nie die der Linie. */}
          {gitter.map((g) => (
            <span
              key={g}
              aria-hidden="true"
              style={{ top: `${y(g)}%` }}
              className="absolute right-full mr-1.5 -translate-y-1/2 text-sm tabular-nums leading-none text-ink-muted"
            >
              {Math.round(g)}
            </span>
          ))}

          {/* Die Monate - linksbündig an ihrer ersten Woche, am rechten Rand rechtsbündig. */}
          {marken.map((m) => (
            <span
              key={m.i}
              aria-hidden="true"
              style={{ left: `${x(m.i)}%` }}
              className={
                "absolute top-full mt-1.5 whitespace-nowrap text-sm leading-none text-ink-muted " +
                (x(m.i) > 85 ? "-translate-x-full" : "")
              }
            >
              {m.name}
            </span>
          ))}

          {/*
            ★ L1: ein kleiner Punkt an JEDER Woche mit Wert - so sieht man, wo
            gemessen wurde und wo die Linie nur verbindet. Ein RAND, keine
            Fläche (Kontrastmodus, siehe Kopf dieser Datei).
          */}
          {mitWert.map((i) => (
            <span
              key={i}
              aria-hidden="true"
              data-score-punkt=""
              style={{ left: `${x(i)}%`, top: `${y(wochen[i].wert as number)}%` }}
              className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-accent"
            />
          ))}

          {zeige && zeige.wert !== null && (
            <>
              <span
                aria-hidden="true"
                data-score-markierung=""
                style={{ left: `${x(aktiv!)}%`, top: `${y(zeige.wert)}%` }}
                className="absolute box-content h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-accent bg-accent shadow-[0_0_0_2px_rgb(var(--c-surface-sunken))]"
              />
              {/*
                Der Hinweis in der Hausgestalt (gross, sofort) - über dem Punkt,
                am Rand bündig statt mittig, damit er nicht aus dem Bild ragt.
                `aria-hidden`: Die Sprachausgabe bekommt denselben Satz aus der
                Ansage unten, die Braillezeile aus der Tabelle.
              */}
              <span
                aria-hidden="true"
                data-score-hinweis=""
                style={{
                  left: `${x(aktiv!)}%`,
                  bottom: `calc(${100 - y(zeige.wert)}% + 12px)`,
                  transform:
                    x(aktiv!) < 20
                      ? "translateX(-12px)"
                      : x(aktiv!) > 80
                        ? "translateX(calc(-100% + 12px))"
                        : "translateX(-50%)",
                }}
                className="pointer-events-none absolute z-[45] w-max whitespace-nowrap rounded-lg border border-hairline bg-surface-raised px-3 py-2 text-sm text-ink shadow-lg"
              >
                {wochenSatz(zeige, sprache)}
              </span>
            </>
          )}
        </div>
      </div>

      {/*
        ★ Die vollen Zahlen für Sprachausgabe und Braillezeile - jede Woche
        der Linie, auch die Lücken („kein Wert"), damit die Reihe nicht
        springt. `sr-only` ist `absolute` - der Abschnitt ist `relative`, sonst
        ragte die Tabelle an der Seite vorbei (Befund 12.09.2026).
        ⚠️ Das `sr-only` sitzt an einer HÜLLE, nicht an der Tabelle: Eine
        Tabelle hält sich weder an `width: 1px` noch an `overflow: hidden`
        (beides gilt nicht für Tabellen-Boxen) - bei 375 px machte sie die
        Seite 398 px breit (gemessen im Browser, K3).
      */}
      <div className="sr-only">
        <table>
          <caption>{t.caption(titel, schuljahrLabel)}</caption>
          <thead>
            <tr>
              <th scope="col">{t.woche}</th>
              <th scope="col">{t.score}</th>
              <th scope="col">{t.kinder}</th>
            </tr>
          </thead>
          <tbody>
            {wochen.map((w) => (
              <tr key={w.startMs}>
                <th scope="row">{t.ab(tagMonat(w.startMs, sprache))}</th>
                <td>{w.wert === null ? t.keinWert : w.wert}</td>
                <td>{w.kinder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <span className="sr-only" aria-live="polite">
        {imFokus && zeige ? wochenSatz(zeige, sprache) : ""}
      </span>
    </section>
  );
}
