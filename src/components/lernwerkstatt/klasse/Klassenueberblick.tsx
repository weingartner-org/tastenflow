/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★ DER KLASSENÜBERBLICK - schlank, ÜBER der Tabelle (K3, 19.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 19.09.2026, mit Bildschirmfoto der alten Karte: *„ich mag den
 * Klassenüberblick und die Score-Leiste, ich hätte noch gerne ein
 * Liniendiagramm Schuljahr (Score der Klasse), das nicht über die ganze Seite
 * geht, und der Klassenüberblick soll auch das vergangene Monat
 * standardmäßig ausgewählt haben, Schuljahr gibt es auch; diese Übersicht
 * muss viel schlanker und einfacher werden"* · *„der Klassenüberblick wird
 * schlank und steht über der Tabelle"*.
 *
 * Bis dahin: eine zugeklappte Jahreskarte UNTER der Tabelle, mit Umschalter
 * „gegenüber Vorwoche | gegenüber Schuljahresbeginn", drei Zeilen mit ganzen
 * Sätzen, vier Topf-Zahlen und einer Fussnote. Jetzt, von oben nach unten:
 *
 *   Klassenüberblick  [Monat] [Schuljahr] │ [Nachricht an die Klasse]   ┌ Score der Klasse ┐
 *   Anschläge/Min ⌀ 142 ↗ +8 · Treffsicherheit ⌀ 94 % …                 │ im Schuljahr      │
 *   Score in der Klasse (Punktleiste)                                    └ (Linie)           ┘
 *
 * ★★ L1 (19.09.2026, Johannes): *„der Klassenüberblick ist nicht schön: der
 * Schalter ‚Nachricht an die Klasse' kann nach links neben Schuljahr - mit
 * einem Trennstrich und Abstand; dann kann das Diagramm weiter hinauf"*.
 * Seither ZWEI Spalten: links Kopfzeile (mit dem Knopf gleich hinter dem
 * Umschalter, getrennt durch eine Haarlinie), Kennzahlen und Punktleiste;
 * rechts das Liniendiagramm, oben bündig mit der Kopfzeile. Bei wenig Platz
 * rutscht das Diagramm darunter. Der ganze Block wird damit niedriger.
 *
 * ★ Jede Erklärung steht im Hinweis ihrer Zahl, nicht als Absatz auf der
 * Seite (Johannes 18.09.: *„mach keine dauerhaften Erklärungen unter den
 * Schaltern, das geht mit Mouseover"*). Für die Sprachausgabe steht derselbe
 * Satz unsichtbar an der Zahl - der Hinweis selbst ist dort stumm
 * (`Hinweisflaeche`), sonst hörte man ihn zweimal.
 *
 * Die Rechnung steht in `lib/typing/klassenueberblick.ts`.
 */
import { useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Tipp } from "@/components/Tipp";
import { Hinweisflaeche } from "@/components/typing/Zeigerhinweis";
import { Punktleiste } from "@/components/typing/Punktleiste";
import { TopfZahlen } from "@/components/typing/Jahreskarte";
import { ScoreVerlauf, tagMonat } from "@/components/typing/ScoreVerlauf";
import { mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import type { PupilData } from "@/components/typing/PupilStatsPanel";
import {
  UEBERBLICK_VORGABE,
  klassenKennzahlen,
  klassenScoreVerlauf,
  ueberblickZeitraum,
  type Kennzahl,
  type UeberblickArt,
} from "@/lib/typing/klassenueberblick";
import {
  SCORE_ERKLAERUNG_SIE,
  SCORE_ERKLAERUNG_SIE_EN,
  SCORE_ERKLAERUNG_VOUS_FR,
  SCORE_ERKLAERUNG_USTED_ES,
  SCORE_ERKLAERUNG_IT_INSEGNANTE,
  SCORE_ERKLAERUNG_PL_NAUCZYCIELE,
  SCORE_ERKLAERUNG_TR_OGRETMEN,
  SCORE_ERKLAERUNG_CS_VYUCUJICI,
} from "@/lib/typing/score";
import { itPrepTag } from "@/lib/typing/datum";
import { MIND_ZEICHEN_WERTUNG } from "@/lib/typing/schreibprobeWertung";
import {
  MINDESTZEILEN,
  PFEIL,
  veraenderungSatz,
  veraenderungWert,
  type Groesse,
  type Veraenderung,
} from "@/lib/typing/veraenderung";
import {
  WOCHENZIEL_GRENZE,
  kindWochenzielAusFeldern,
  prozentAnzeige,
  type GesperrteZeit,
} from "@/lib/typing/wochenziel";
import { istGeruestSprache, type GeruestSprache } from "@/lib/typing/sprachRegister";
import { KETTEN_NEUN } from "@/lib/typing/kettenNeun";
import {
  UEBERBLICK_SAETZE_NEUN,
  aufgabenSatzNeun,
  kennSatzNeun,
  leisteHilfeNeun,
  lernendeTextNeun,
  topfTextNeun,
} from "./klassenueberblickNeun";
import { monatBereichKompakt, schuljahrLabelTr, schuljahrLabelCs, vergleichsName } from "@/lib/typing/zeitraum";
import { schuljahrVon, topfLabel, verteilung } from "@/lib/typing/jahreskarte";
import { FilmKnopf } from "@/components/FilmKnopf";

/** Die Überschrift des Liniendiagramms. */
export const SCORE_VERLAUF_TITEL = "Score der Klasse im Schuljahr";
/** ★ EN6a: dieselbe Überschrift englisch (Glossar §3.15). */
export const SCORE_VERLAUF_TITEL_EN = "Class score across the school year";

/**
 * ★ Der Hinweis an der Überschrift des Liniendiagramms. Johannes: *„wir
 * brauchen beim Liniendiagramm ein Mouseover, das erklärt, dass es bei
 * Einführung von Umschalt, Zahlen, Sonderzeichen naturgemäß auch kurzzeitig
 * nach unten geht"*. Der erste Satz sagt, was ein Punkt ist, der zweite, warum
 * die Linie einbrechen darf - ohne ein Wort gegen die Klasse
 * ([[feedback_nie_gegen_das_kind]]).
 */
export const SCORE_VERLAUF_HILFE =
  // ★ L1 (19.09.2026): Die Linie läuft seither durch - der erste Satz sagt
  // darum, woran man eine Woche OHNE Wert erkennt (kein Punkt), statt von
  // einer Lücke zu sprechen, die es nicht mehr gibt.
  `Je Woche der Schnitt aller Kinder mit mindestens ${MINDESTZEILEN} Zeilen, als Punkt ` +
  `auf der Linie; eine Woche ohne Punkt hatte zu wenig Übung für einen Wert - dort ` +
  `verbindet die Linie nur. Wenn Umschalttaste ` +
  `(Großbuchstaben), Ziffern oder Sonderzeichen neu dazukommen, sinkt der ` +
  `Score naturgemäß für kurze Zeit, weil neue Tasten anfangs langsamer und ` +
  `unsicherer getippt werden - das ist zu erwarten und kein Grund zur Sorge.`;

/**
 * ★ EN6a (19.09.2026): derselbe Hinweis englisch. Glossar §3.5: Umschalttaste
 * ⇒ *Shift key*, Ziffern ⇒ *numbers*, Sonderzeichen ⇒ *symbols*.
 */
export const SCORE_VERLAUF_HILFE_EN =
  `For each week, the average of all pupils with at least ${MINDESTZEILEN} lines, shown as a ` +
  `dot on the line; a week without a dot had too little practice for a value - there the ` +
  `line only joins up. When the Shift key ` +
  `(capital letters), numbers or symbols are newly introduced, the score naturally ` +
  `dips for a while, because new keys are typed more slowly and less surely at first - ` +
  `that is to be expected and no cause for concern.`;

/** ★ E11a (25.09.2026): dieselbe Überschrift französisch. */
export const SCORE_VERLAUF_TITEL_FR = "Score de la classe sur l'année scolaire";

/** ★ E11a: derselbe Hinweis französisch. */
/** ★ ES-O (27.09.2026): Titel und Hinweis der Linie spanisch. */
export const SCORE_VERLAUF_TITEL_ES = "Puntuación de la clase en el curso escolar";
export const SCORE_VERLAUF_HILFE_ES =
  `Cada semana, la media de todo el alumnado que escribió al menos ${MINDESTZEILEN} líneas ` +
  `forma un punto de la línea; una semana sin punto no tuvo suficiente práctica para dar ` +
  `un valor - la línea une entonces los puntos vecinos. Cuando llegan por primera vez las ` +
  `mayúsculas (tecla Mayús), los números o los caracteres especiales, la puntuación baja ` +
  `un tiempo de forma natural, porque las teclas nuevas se escriben al principio más despacio ` +
  `y con menos seguridad - es normal, no hay por qué preocuparse.`;

/**
 * ★ O-IT (02.10.2026): Titel und Hinweis der Linie italienisch - „punteggio",
 * Tasten wie auf der italienischen Kappe („tasto Maiusc", Glossar §2.9).
 */
export const SCORE_VERLAUF_TITEL_IT = "Punteggio della classe nell'anno scolastico";
export const SCORE_VERLAUF_HILFE_IT =
  `Ogni settimana, la media di tutti gli alunni che hanno scritto almeno ${MINDESTZEILEN} righe ` +
  `forma un punto della linea; una settimana senza punto non ha avuto abbastanza esercizio per dare ` +
  `un valore - lì la linea unisce soltanto i punti vicini. Quando arrivano per la prima volta le ` +
  `maiuscole (tasto Maiusc), i numeri o i caratteri speciali, il punteggio scende per un po' in ` +
  `modo naturale, perché all'inizio i tasti nuovi si scrivono più lentamente e con meno sicurezza - ` +
  `è normale, non c'è da preoccuparsi.`;

/**
 * ★ O-PL (02.10.2026): Titel und Hinweis der Linie polnisch - „wynik",
 * Tasten wie auf der polnischen Kappe („klawisz Shift", Glossar §2.9); die
 * Zahl der Zeilen nach Doppelpunkt, damit nichts mitbeugen muss.
 */
export const SCORE_VERLAUF_TITEL_PL = "Wynik klasy w roku szkolnym";
export const SCORE_VERLAUF_HILFE_PL =
  `Każdy tydzień to punkt na linii: średnia wszystkich uczniów, którzy napisali co najmniej ` +
  `tyle wierszy: ${MINDESTZEILEN}. Tydzień bez punktu miał za mało ćwiczeń, żeby podać ` +
  `wartość - tam linia tylko łączy sąsiednie punkty. Gdy po raz pierwszy dochodzą wielkie ` +
  `litery (klawisz Shift), cyfry albo symbole, wynik na jakiś czas naturalnie spada, bo nowe ` +
  `klawisze pisze się na początku wolniej i mniej pewnie - to normalne i nie ma powodu do niepokoju.`;

/**
 * ★ O-TR (02.10.2026): Titel und Hinweis der Linie türkisch - "puan", Tasten wie
 * auf der Kappe ("Shift tuşu", Glossar §2.9); die Zahl der Zeilen ohne Endung.
 */
export const SCORE_VERLAUF_TITEL_TR = "Öğretim yılı boyunca sınıfın puanı";
export const SCORE_VERLAUF_HILFE_TR =
  `Her hafta, en az ${MINDESTZEILEN} satır yazan tüm öğrencilerin ortalaması çizgi üzerinde ` +
  `bir nokta olarak görünür; noktası olmayan bir haftada değer için yeterli alıştırma ` +
  `yapılmamıştır - orada çizgi yalnızca komşu noktaları birleştirir. Büyük harfler ` +
  `(Shift tuşu), rakamlar veya simgeler ilk kez eklendiğinde puan doğal olarak bir süre ` +
  `düşer, çünkü yeni tuşlar başta daha yavaş ve daha az emin yazılır - bu beklenen bir ` +
  `durumdur, endişelenmeye gerek yoktur.`;

/**
 * ★ O-CS (03.10.2026): Titel und Hinweis der Linie tschechisch - „skóre",
 * Tasten wie auf der Kappe mit Kopfwort („klávesa Shift", Glossar §2.9); die
 * Zahl der Zeilen mit allen vier Formen (§2.11).
 */
export const SCORE_VERLAUF_TITEL_CS = "Skóre třídy během školního roku";
export const SCORE_VERLAUF_HILFE_CS =
  `Každý týden je jeden bod na čáře: průměr všech žáků, kteří napsali aspoň ` +
  `${radkyCs(MINDESTZEILEN)}. Týden bez bodu neměl dost cvičení na hodnotu - čára ` +
  `tam jen spojuje sousední body. Když poprvé přibudou velká písmena (klávesa Shift), ` +
  `číslice nebo znaky, skóre na čas přirozeně klesne, protože nové klávesy se zpočátku ` +
  `píšou pomaleji a méně jistě - to je normální a není důvod k obavám.`;

export const SCORE_VERLAUF_HILFE_FR =
  `Chaque semaine, la moyenne de tous les élèves qui ont tapé au moins ${MINDESTZEILEN} lignes ` +
  `forme un point sur la ligne ; une semaine sans point n'avait pas assez d'exercice pour donner ` +
  `une valeur - la ligne relie alors simplement les points voisins. Quand les majuscules (touche ` +
  `Maj), les chiffres ou les caractères spéciaux arrivent pour la première fois, le ` +
  `score baisse naturellement pendant un moment, parce que les nouvelles touches sont d'abord ` +
  `tapées plus lentement et avec moins d'assurance - c'est normal, pas de quoi s'inquiéter.`;

/** Womit der Trend im Schuljahr verglichen wird - hinter „höher als in …". */
const SCHULJAHR_VERGLEICH = "den ersten Übungswochen des Schuljahres";
const SCHULJAHR_REGEL =
  "Je Kind die ersten 4 Übungswochen gegen die letzten 4 (bei weniger als " +
  "5 Übungswochen die erste gegen die letzte)";

/** „gemittelt über 1 Kind / 4 Kinder" (über + Akkusativ). */
function kinderWort(n: number): string {
  return n === 1 ? "1 Kind" : `${n} Kinder`;
}

function gross(satz: string): string {
  return satz.charAt(0).toUpperCase() + satz.slice(1);
}

/** „Der Anteil liegt 5 Prozentpunkte höher als in den 4 Wochen davor." */
function anteilSatz(v: Veraenderung, name: string): string {
  const zahl = Math.round(Math.abs(v.differenz));
  const einheit = zahl === 1 ? "Prozentpunkt" : "Prozentpunkte";
  if (v.richtung === "gleich")
    return `Der Anteil ist gegenüber ${name} praktisch gleich geblieben (${zahl} ${einheit} Unterschied).`;
  return `Der Anteil liegt ${zahl} ${einheit} ${v.richtung === "hoch" ? "höher" : "niedriger"} als in ${name}.`;
}

/** ★ EN6a: derselbe Satz englisch - *percentage points*, ohne Wertung (§3.2). */
function anteilSatzEn(v: Veraenderung, name: string): string {
  const zahl = Math.round(Math.abs(v.differenz));
  const einheit = zahl === 1 ? "percentage point" : "percentage points";
  if (v.richtung === "gleich")
    return `The share has stayed about the same compared with ${name} (a difference of ${zahl} ${einheit}).`;
  return `The share is ${zahl} ${einheit} ${v.richtung === "hoch" ? "higher" : "lower"} than in ${name}.`;
}

/** ★ E11a-3: derselbe Satz französisch. */
function anteilSatzFr(v: Veraenderung, name: string): string {
  const zahl = Math.round(Math.abs(v.differenz));
  const einheit = zahl === 1 ? "point de pourcentage" : "points de pourcentage";
  if (v.richtung === "gleich")
    return `La part est restée à peu près pareille par rapport à ${name} (différence de ${zahl} ${einheit}).`;
  return `La part est ${zahl} ${einheit} ${v.richtung === "hoch" ? "plus élevée" : "plus basse"} qu'en ${name}.`;
}

/** ★ ES-O (27.09.2026): derselbe Satz spanisch. */
function anteilSatzEs(v: Veraenderung, name: string): string {
  const zahl = Math.round(Math.abs(v.differenz));
  const einheit = zahl === 1 ? "punto porcentual" : "puntos porcentuales";
  if (v.richtung === "gleich")
    return `El porcentaje se ha mantenido más o menos igual respecto a ${name} (diferencia de ${zahl} ${einheit}).`;
  return `El porcentaje es ${zahl} ${einheit} ${v.richtung === "hoch" ? "más alto" : "más bajo"} que en ${name}.`;
}

/**
 * ★ O-IT (02.10.2026): derselbe Satz italienisch - der Name kommt MIT Artikel
 * („le 4 settimane precedenti", `zeitraum.ts`) hinter „in confronto con".
 */
function anteilSatzIt(v: Veraenderung, name: string): string {
  const zahl = Math.round(Math.abs(v.differenz));
  const einheit = zahl === 1 ? "punto percentuale" : "punti percentuali";
  if (v.richtung === "gleich")
    return `La quota è rimasta quasi uguale in confronto con ${name} (differenza di ${zahl} ${einheit}).`;
  return `La quota è più ${v.richtung === "hoch" ? "alta" : "bassa"} di ${zahl} ${einheit} in confronto con ${name}.`;
}

/**
 * ★ O-PL (02.10.2026): derselbe Satz polnisch - der Name kommt MIT „w"
 * („w poprzednich 4 tygodniach", `zeitraum.ts`) hinter „niż"/„jak";
 * Prozentpunkte mit allen vier Formen (Glossar §2.10a).
 */
function anteilSatzPl(v: Veraenderung, name: string): string {
  const zahl = Math.round(Math.abs(v.differenz));
  const pp = mehrzahl(zahl, "pl", {
    one: (z) => `${z} punkt procentowy`,
    few: (z) => `${z} punkty procentowe`,
    many: (z) => `${z} punktów procentowych`,
    other: (z) => `${z} punktu procentowego`,
  });
  if (v.richtung === "gleich") return `Odsetek jest prawie taki sam jak ${name} (różnica: ${pp}).`;
  return `Odsetek jest o ${pp} ${v.richtung === "hoch" ? "wyższy" : "niższy"} niż ${name}.`;
}

/** ★ O-PL: „1 osoba" · „3 osoby" · „5 osób" (Glossar Regel 2). */
function kinderPl(n: number): string {
  return mehrzahl(n, "pl", {
    one: (z) => `${z} osoba`,
    few: (z) => `${z} osoby`,
    many: (z) => `${z} osób`,
    other: (z) => `${z} osoby`,
  });
}

/**
 * ★ O-TR (02.10.2026): derselbe Satz türkisch - der Name kommt als blosses
 * Hauptwort ("önceki 4 hafta", `zeitraum.ts`) vor "ile", ohne Endung (Glossar
 * Regel 6); nach der Zahl Einzahl ("3 yüzde puan"); ohne Wertung.
 */
function anteilSatzTr(v: Veraenderung, name: string): string {
  const zahl = Math.round(Math.abs(v.differenz));
  if (v.richtung === "gleich")
    return `Oran, ${name} ile karşılaştırıldığında neredeyse aynı kaldı (fark: ${zahl} yüzde puan).`;
  return `Oran, ${name} ile karşılaştırıldığında ${zahl} yüzde puan daha ${v.richtung === "hoch" ? "yüksek" : "düşük"}.`;
}

/** ★ O-TR: "1 öğrenci" · "5 öğrenci" - nach der Zahl Einzahl (Glossar Regel 5). */
function kinderTr(n: number): string {
  return mehrzahl(n, "tr", { one: (z) => `${z} öğrenci`, other: (z) => `${z} öğrenci` });
}

/**
 * ★ O-CS (03.10.2026): derselbe Satz tschechisch - der Name trägt „v"/„ve" und
 * steht im 6. Fall („v předchozích 4 týdnech", `zeitraum.ts`) hinter „než"/
 * „jako"; Prozentpunkte mit allen vier Formen (Glossar §2.11), die Zahl hinter
 * einem Doppelpunkt; ohne Wertung (vyšší / nižší).
 */
function anteilSatzCs(v: Veraenderung, name: string): string {
  const zahl = Math.round(Math.abs(v.differenz));
  const pb = mehrzahl(zahl, "cs", {
    one: (z) => `${z} procentní bod`,
    few: (z) => `${z} procentní body`,
    many: (z) => `${z} procentního bodu`,
    other: (z) => `${z} procentních bodů`,
  });
  if (v.richtung === "gleich") return `Podíl je skoro stejný jako ${name} (rozdíl: ${pb}).`;
  return `Podíl je ${v.richtung === "hoch" ? "vyšší" : "nižší"} než ${name}, rozdíl: ${pb}.`;
}

/** ★ O-CS: „1 osoba" · „3 osoby" · „5 osob" (Glossar Regel 2). */
function osobyCs(n: number): string {
  return mehrzahl(n, "cs", {
    one: (z) => `${z} osoba`,
    few: (z) => `${z} osoby`,
    many: (z) => `${z} osoby`,
    other: (z) => `${z} osob`,
  });
}

/** ★ O-CS: „1 řádek" · „3 řádky" · „20 řádků" (Akkusativ = Nominativ, Glossar §2.11). */
function radkyCs(n: number): string {
  return mehrzahl(n, "cs", {
    one: (z) => `${z} řádek`,
    few: (z) => `${z} řádky`,
    many: (z) => `${z} řádku`,
    other: (z) => `${z} řádků`,
  });
}

/** ★ O-CS: „1 znak" · „3 znaky" · „200 znaků". */
function znakyCs(n: number): string {
  return mehrzahl(n, "cs", {
    one: (z) => `${z} znak`,
    few: (z) => `${z} znaky`,
    many: (z) => `${z} znaku`,
    other: (z) => `${z} znaků`,
  });
}

/** „↗ +8" - der kleine Trend neben der Zahl. */
function trendKurz(
  v: Veraenderung | null,
  groesse: Groesse,
  sprache: BedienSprache = "de",
): string | null {
  return v ? `${PFEIL[v.richtung]} ${veraenderungWert(v, groesse, sprache)}` : null;
}

/** „1 pupil" / „4 pupils". */
function kinderEn(n: number): string {
  return mehrzahl(n, "en", { one: (z) => `${z} pupil`, other: (z) => `${z} pupils` });
}

/** „1 élève" / „4 élèves". */
/** ★ ES-O: „3 estudiantes" / „1 estudiante". */
function kinderEs(n: number): string {
  return mehrzahl(n, "es", { one: (z) => `${z} estudiante`, other: (z) => `${z} estudiantes` });
}

/** ★ O-IT (02.10.2026): „1 persona" / „4 alunni" (Glossar Regel 2). */
function kinderIt(n: number): string {
  return n === 1 ? "1 persona" : `${n} alunni`;
}

function kinderFr(n: number): string {
  return mehrzahl(n, "fr", { one: (z) => `${z} élève`, other: (z) => `${z} élèves` });
}

// Учебна година „2026/2027" (Glossar §2.12), Schrägstrich wie bei cs
function schuljahrLabelBg(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}/${m[1].slice(0, 2)}${m[2]}` : label;
}

const SCORE_VERLAUF_TITEL_BG = "Резултат на класа през учебната година";
const SCORE_VERLAUF_HILFE_BG =
  `Всяка седмица е една точка на линията: средното за всички ученици, които са написали поне ` +
  `${mehrzahl(MINDESTZEILEN, "bg", { one: (z) => `${z} ред`, other: (z) => `${z} реда` })}. ` +
  `Седмица без точка не е имала достатъчно упражнения за стойност - линията там само свързва ` +
  `съседните точки. Когато за пръв път се добавят главни букви (клавиша Shift), цифри или ` +
  `символи, резултатът естествено спада за кратко, защото новите клавиши в началото се пишат ` +
  `по-бавно и по-несигурно - това е нормално и не е повод за безпокойство.`;

// Titel und Hinweis der Score-Linie griechisch (Glossar §2.6, Tasten nach Regel 11 mit Kopfwort „πλήκτρο").
const SCORE_VERLAUF_TITEL_EL = "Σκορ του τμήματος στη διάρκεια του σχολικού έτους";
const SCORE_VERLAUF_HILFE_EL =
  `Κάθε εβδομάδα είναι μία κουκκίδα στη γραμμή: ο μέσος όρος όλων των παιδιών που έγραψαν τουλάχιστον ` +
  `${mehrzahl(MINDESTZEILEN, "el", { one: (z) => `${z} γραμμή`, other: (z) => `${z} γραμμές` })}. ` +
  `Μια εβδομάδα χωρίς κουκκίδα δεν είχε αρκετή εξάσκηση για μια τιμή - εκεί η γραμμή απλώς ενώνει ` +
  `τις γειτονικές κουκκίδες. Όταν προστίθενται για πρώτη φορά κεφαλαία (πλήκτρο Shift), ψηφία ή σύμβολα, ` +
  `το σκορ πέφτει φυσικά για λίγο, επειδή τα νέα πλήκτρα γράφονται στην αρχή πιο αργά και με λιγότερη ` +
  `σιγουριά - αυτό είναι αναμενόμενο και δεν είναι λόγος ανησυχίας.`;

// Schuljahr griechisch „2026-2027" statt „2026/27" (Glossar §2.10: kein Schrägstrich, Sprachausgabe liest „κάθετος").
function schuljahrLabelEl(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}-${m[1].slice(0, 2)}${m[2]}` : label;
}

// Glossar-hu §2.12: Schuljahr mit zwei vollen Jahreszahlen und Schrägstrich (2026/2027)
function schuljahrLabelHu(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}/${m[1].slice(0, 2)}${m[2]}` : label;
}
const SCORE_VERLAUF_TITEL_HU = "Az osztály pontszáma a tanév során";
const SCORE_VERLAUF_HILFE_HU =
  `Minden hét egy pont a vonalon: azoknak a tanulóknak az átlaga, akik legalább ` +
  `${MINDESTZEILEN} sort gépeltek. A pont nélküli héten nem volt elég gyakorlás egy ` +
  `értékhez - ott a vonal csak a szomszédos pontokat köti össze. Amikor először jelennek ` +
  `meg a nagybetűk (Shift billentyű), a számjegyek vagy a szimbólumok, a pontszám egy ` +
  `ideig természetes módon csökken, mert az új billentyűk eleinte lassabban és ` +
  `bizonytalanabbul mennek - ez várható, nincs ok aggodalomra.`;

const SCORE_VERLAUF_TITEL_NL = "Score van de klas in het schooljaar";
const SCORE_VERLAUF_HILFE_NL =
  `Per week het gemiddelde van alle leerlingen met minstens ${MINDESTZEILEN} regels, als punt ` +
  `op de lijn; een week zonder punt had te weinig oefening voor een waarde - daar verbindt de ` +
  `lijn alleen de punten ernaast. Als Shift (hoofdletters), cijfers of speciale tekens voor het ` +
  `eerst erbij komen, daalt de score vanzelf even, omdat nieuwe toetsen in het begin langzamer ` +
  `en minder zeker worden getypt - dat is normaal en geen reden tot zorg.`;
// Glossar §2.10: "schooljaar 2026-2027", nie mit Schrägstrich.
function schuljahrLabelNl(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}-${m[1].slice(0, 2)}${m[2]}` : label;
}

// Glossar §2.12: Schuljahr ausgeschrieben, „ano letivo 2026/2027".
function schuljahrLabelPt(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}/${m[1].slice(0, 2)}${m[2]}` : label;
}

const SCORE_VERLAUF_TITEL_PT = "Pontuação da turma ao longo do ano letivo";
const SCORE_VERLAUF_HILFE_PT =
  `Para cada semana, um ponto na linha: a média de todas as pessoas com pelo menos ` +
  `${mehrzahl(MINDESTZEILEN, "pt", { one: (z) => `${z} linha`, other: (z) => `${z} linhas`, many: (z) => `${z} de linhas` })}. ` +
  `Uma semana sem ponto teve pouca prática para dar um valor - aí a linha apenas liga os pontos vizinhos. ` +
  `Quando aparecem pela primeira vez maiúsculas (tecla Shift), algarismos ou símbolos, a pontuação desce ` +
  `naturalmente durante pouco tempo, porque as teclas novas são escritas no início com menos velocidade ` +
  `e menos segurança - é normal e não há motivo para preocupação.`;

// „2026/27" wird „2026/2027"; ein Schuljahr im Kalenderjahr („2026", Glossar §2.6) bleibt, wie es ist.
function schuljahrLabelBr(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}/${m[1].slice(0, 2)}${m[2]}` : label;
}

const SCORE_VERLAUF_TITEL_BR = "Pontuação da turma ao longo do ano letivo";
const SCORE_VERLAUF_HILFE_BR =
  `A cada semana, um ponto na linha: a média de todas as pessoas que digitaram pelo menos ` +
  `${mehrzahl(MINDESTZEILEN, "br", { one: (z) => `${z} linha`, other: (z) => `${z} linhas` })}. ` +
  `Uma semana sem ponto teve pouca prática para dar um valor - ali a linha apenas liga os pontos vizinhos. ` +
  `Quando aparecem pela primeira vez letras maiúsculas (tecla Shift), algarismos ou símbolos, a pontuação ` +
  `cai naturalmente por pouco tempo, porque as teclas novas são digitadas no começo com menos velocidade ` +
  `e menos segurança - isso é normal e não é motivo de preocupação.`;

// Schuljahr rumänisch: 2026-2027 (Glossar §2.10), mit Bindestrich statt Schrägstrich.
function schuljahrLabelRo(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}-${m[1].slice(0, 2)}${m[2]}` : label;
}
function randuriRo(n: number): string {
  return mehrzahl(n, "ro", {
    one: (z) => `${z} rând`,
    few: (z) => `${z} rânduri`,
    other: (z) => `${z} de rânduri`,
  });
}
const SCORE_VERLAUF_TITEL_RO = "Scorul clasei în anul școlar";
const SCORE_VERLAUF_HILFE_RO =
  `Fiecare săptămână este un punct pe linie: media tuturor elevilor care au scris cel puțin ` +
  `${randuriRo(MINDESTZEILEN)}. O săptămână fără punct nu a avut destul exercițiu pentru o valoare - linia ` +
  `doar unește acolo punctele vecine. Când apar pentru prima dată litere mari (tasta Shift), ` +
  `cifre sau simboluri, scorul scade firesc pentru scurt timp, pentru că tastele noi se scriu la ` +
  `început mai încet și mai nesigur - este normal și nu este un motiv de îngrijorare.`;

// Linie „Score" schwedisch (Glossar §2.2 poäng, §2.9 tangenten Skift, §2.10 läsåret 2026/2027).
const SCORE_VERLAUF_TITEL_SV = "Klassens poäng under läsåret";
const SCORE_VERLAUF_HILFE_SV =
  `Varje vecka är en punkt på linjen: genomsnittet för alla elever som har skrivit minst ` +
  `${mehrzahl(MINDESTZEILEN, "sv", { one: (z) => `${z} rad`, other: (z) => `${z} rader` })}. ` +
  `En vecka utan punkt hade inte tillräckligt med övning för ett värde - där binder linjen bara ` +
  `ihop punkterna bredvid. När stora bokstäver (tangenten Skift), siffror eller tecken kommer ` +
  `till för första gången sjunker poängen naturligt en tid, eftersom nya tangenter först skrivs ` +
  `långsammare och mindre säkert - det är normalt och inget att oroa sig för.`;

function schuljahrLabelSv(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}/${m[1].slice(0, 2)}${m[2]}` : label;
}

// Glossar §2.10: Schuljahr voll ausgeschrieben, "2026/2027" statt "2026/27".
function schuljahrLabelUk(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}/${m[1].slice(0, 2)}${m[2]}` : label;
}

function radkyUk(n: number): string {
  return mehrzahl(n, "uk", {
    one: (z) => `${z} рядок`,
    few: (z) => `${z} рядки`,
    many: (z) => `${z} рядків`,
    other: (z) => `${z} рядка`,
  });
}

const SCORE_VERLAUF_TITEL_UK = "Бали класу протягом навчального року";
const SCORE_VERLAUF_HILFE_UK =
  `Кожен тиждень - одна точка на лінії: середнє всіх дітей, які надрукували щонайменше ` +
  `${radkyUk(MINDESTZEILEN)}. Для тижня без точки було замало тренувань, щоб визначити значення - ` +
  `лінія там лише з'єднує сусідні точки. Коли вперше з'являються великі літери (клавіша Shift), ` +
  `цифри або символи, бали на деякий час природно знижуються, бо нові клавіші спочатку ` +
  `друкуються повільніше й менш упевнено - це нормально й не є причиною для занепокоєння.`;

/**
 * ★★ EN6a (19.09.2026): die Texte des Überblicks in beiden Bedienungssprachen.
 * Deutsch Zeichen für Zeichen wie vorher (die Sätze stehen weiter an ihrer
 * alten Stelle unten und werden hier nur eingereiht); englisch nach dem
 * Glossar: *Class overview*, *Month* / *School year* (§3.15), *Keystrokes/min*,
 * *Accuracy*, *Weekly goals* (§3.2), *Scores across the class* (§3.8),
 * *independent work* / *indicator* (§3.8). „⌀" ist im Englischen kein Wort
 * (§3.2) - die Zahl heisst dort *avg 142*.
 */
const UEBERBLICK_TEXTE = texte({
  de: {
    titel: "Klassenüberblick",
    titelHilfe:
      "Wie sich die Klasse zuletzt entwickelt hat: Anschläge pro Minute, Treffsicherheit und Wochenziel-Erfüllung gegenüber dem Zeitraum davor, dazu der Score als Linie über die Zeit.",
    zeitraumGruppe: "Zeitraum des Klassenüberblicks",
    monat: "Monat",
    monatName: "Monat im Klassenüberblick",
    monatTipp: (bereich: string) =>
      `Monat: die letzten 4 Wochen, ${bereich} (Wochen ab Montag 8:00, ` +
      `die laufende zählt mit) - die kleinen Zahlen neben den Werten ` +
      `vergleichen mit den 4 Wochen davor.`,
    schuljahr: "Schuljahr",
    schuljahrName: "Schuljahr im Klassenüberblick",
    schuljahrTipp: (label: string, seit: string) =>
      `Schuljahr ${label}, seit ${seit} - die kleinen Zahlen ` +
      `neben den Werten vergleichen je Kind die ersten 4 Übungswochen mit den ` +
      `letzten 4 (bei weniger als 5 Übungswochen die erste mit der letzten).`,
    anschlaege: "Anschläge/Min",
    treffer: "Treffsicherheit",
    wochenaufgaben: "Wochenaufgaben",
    schnitt: (wert: number) => `⌀ ${wert}`,
    schnittProzent: (wert: number) => `⌀ ${wert} %`,
    eigenstaendigkeit: "Eigenständigkeits-Check",
    hinweise: (n: number) => `${n} ${n === 1 ? "Hinweis" : "Hinweise"}`,
    hinweiseSatz: (n: number) =>
      `${n === 1 ? "Ein Kind zeigt" : `${n} Kinder zeigen`} ` +
      `Hinweise im Eigenständigkeits-Check - die Einzelheiten stehen in der ` +
      `aufgeklappten Zeile des Kindes.`,
    scoreLeiste: "Score in der Klasse",
    punkte: " Punkte",
    punkteGesprochen: "Punkte",
    verlaufTitel: SCORE_VERLAUF_TITEL,
    verlaufHilfe: SCORE_VERLAUF_HILFE,
  },
  en: {
    titel: "Class overview",
    titelHilfe:
      "How the class has been getting on lately: keystrokes per minute, accuracy and weekly goals met compared with the period before, plus the score as a line over time.",
    zeitraumGruppe: "Period of the class overview",
    monat: "Month",
    monatName: "Month in the class overview",
    monatTipp: (bereich: string) =>
      `Month: the last 4 weeks, ${bereich} (weeks start at 8am on Monday; ` +
      `the current week counts too) - the small figures next to the values ` +
      `compare with the 4 weeks before.`,
    schuljahr: "School year",
    schuljahrName: "School year in the class overview",
    schuljahrTipp: (label: string, seit: string) =>
      `School year ${label}, since ${seit} - the small figures next to the values ` +
      `compare, for each pupil, the first 4 practice weeks with the last 4 (with ` +
      `fewer than 5 practice weeks, the first with the last).`,
    anschlaege: "Keystrokes/min",
    treffer: "Accuracy",
    wochenaufgaben: "Weekly goals",
    schnitt: (wert: number) => `avg ${wert}`,
    schnittProzent: (wert: number) => `avg ${wert}%`,
    eigenstaendigkeit: "Independent work check",
    hinweise: (n: number) => `${n} ${n === 1 ? "indicator" : "indicators"}`,
    hinweiseSatz: (n: number) =>
      `${n === 1 ? "One pupil shows" : `${n} pupils show`} indicators in the ` +
      `independent work check - the details are in the pupil's expanded row.`,
    scoreLeiste: "Scores across the class",
    punkte: " points",
    punkteGesprochen: "points",
    verlaufTitel: SCORE_VERLAUF_TITEL_EN,
    verlaufHilfe: SCORE_VERLAUF_HILFE_EN,
  },
  fr: {
    titel: "Aperçu de la classe",
    titelHilfe:
      "Comment la classe a évolué récemment : frappes par minute, précision et objectifs de la semaine atteints par rapport à la période précédente, plus le score sous forme de ligne dans le temps.",
    zeitraumGruppe: "Période de l'aperçu de la classe",
    monat: "Mois",
    monatName: "Mois dans l'aperçu de la classe",
    monatTipp: (bereich: string) =>
      `Mois : les 4 dernières semaines, ${bereich} (les semaines commencent le lundi à 8 h, ` +
      `la semaine en cours compte aussi) - les petits chiffres à côté des valeurs ` +
      `comparent avec les 4 semaines précédentes.`,
    schuljahr: "Année scolaire",
    schuljahrName: "Année scolaire dans l'aperçu de la classe",
    schuljahrTipp: (label: string, seit: string) =>
      `Année scolaire ${label}, depuis ${seit} - les petits chiffres à côté des valeurs ` +
      `comparent, pour chaque élève, les 4 premières semaines d'exercice avec les 4 ` +
      `dernières (avec moins de 5 semaines d'exercice, la première avec la dernière).`,
    anschlaege: "Frappes/min",
    treffer: "Précision",
    wochenaufgaben: "Objectifs de la semaine",
    schnitt: (wert: number) => `moy. ${wert}`,
    schnittProzent: (wert: number) => `moy. ${wert} %`,
    eigenstaendigkeit: "Vérification de l'autonomie",
    hinweise: (n: number) => `${n} ${n === 1 ? "signal" : "signaux"}`,
    hinweiseSatz: (n: number) =>
      `${n === 1 ? "Un élève montre" : `${n} élèves montrent`} ` +
      `des signaux dans la vérification de l'autonomie - les détails figurent dans la ` +
      `ligne dépliée de l'élève.`,
    scoreLeiste: "Scores dans la classe",
    punkte: " points",
    punkteGesprochen: "points",
    verlaufTitel: SCORE_VERLAUF_TITEL_FR,
    verlaufHilfe: SCORE_VERLAUF_HILFE_FR,
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft.
  es: {
    titel: "Resumen de la clase",
    titelHilfe:
      "Cómo ha evolucionado la clase últimamente: pulsaciones por minuto, precisión y objetivos semanales alcanzados frente al periodo anterior, además de la puntuación como línea en el tiempo.",
    zeitraumGruppe: "Periodo del resumen de la clase",
    monat: "Mes",
    monatName: "Mes en el resumen de la clase",
    monatTipp: (bereich: string) =>
      `Mes: las últimas 4 semanas, ${bereich} (las semanas empiezan el lunes a las 8, ` +
      `la semana en curso también cuenta) - las cifras pequeñas junto a los valores ` +
      `comparan con las 4 semanas anteriores.`,
    schuljahr: "Curso escolar",
    schuljahrName: "Curso escolar en el resumen de la clase",
    schuljahrTipp: (label: string, seit: string) =>
      `Curso escolar ${label}, desde el ${seit} - las cifras pequeñas junto a los valores ` +
      `comparan, para cada estudiante, las 4 primeras semanas de práctica con las 4 ` +
      `últimas (con menos de 5 semanas de práctica, la primera con la última).`,
    anschlaege: "Pulsaciones por minuto",
    treffer: "Precisión",
    wochenaufgaben: "Objetivos semanales",
    schnitt: (wert: number) => `media ${wert}`,
    schnittProzent: (wert: number) => `media ${wert} %`,
    eigenstaendigkeit: "Revisión de la autonomía",
    hinweise: (n: number) => `${n} ${n === 1 ? "señal" : "señales"}`,
    hinweiseSatz: (n: number) =>
      `${n === 1 ? "Una persona muestra" : `${n} personas muestran`} ` +
      `señales en la revisión de la autonomía - los detalles están en la ` +
      `fila desplegada de cada estudiante.`,
    scoreLeiste: "Puntuaciones en la clase",
    punkte: " puntos",
    punkteGesprochen: "puntos",
    verlaufTitel: SCORE_VERLAUF_TITEL_ES,
    verlaufHilfe: SCORE_VERLAUF_HILFE_ES,
  },
  // ★ O-IT (02.10.2026): „Panoramica della classe", „battute al minuto",
  // „obiettivi settimanali" (Glossar §2.6, Regel 6); Lehrkraft neutral.
  it: {
    titel: "Panoramica della classe",
    titelHilfe:
      "Come è andata la classe di recente: battute al minuto, precisione e obiettivi settimanali raggiunti in confronto con il periodo precedente, e il punteggio come linea nel tempo.",
    zeitraumGruppe: "Periodo della panoramica della classe",
    monat: "Mese",
    monatName: "Mese nella panoramica della classe",
    monatTipp: (bereich: string) =>
      `Mese: le ultime 4 settimane, ${bereich} (le settimane iniziano il lunedì alle 8:00, ` +
      `conta anche la settimana in corso) - i numeri piccoli accanto ai valori ` +
      `confrontano con le 4 settimane precedenti.`,
    schuljahr: "Anno scolastico",
    schuljahrName: "Anno scolastico nella panoramica della classe",
    schuljahrTipp: (label: string, seit: string) =>
      `Anno scolastico ${label}, ${itPrepTag("dal", parseInt(seit, 10))}${seit} - i numeri piccoli accanto ai valori ` +
      `confrontano, per ogni persona, le prime 4 settimane di esercizio con le ultime 4 ` +
      `(con meno di 5 settimane di esercizio, la prima con l'ultima).`,
    anschlaege: "Battute al minuto",
    treffer: "Precisione",
    wochenaufgaben: "Obiettivi settimanali",
    schnitt: (wert: number) => `media ${wert}`,
    schnittProzent: (wert: number) => `media ${wert}%`,
    eigenstaendigkeit: "Controllo del lavoro autonomo",
    hinweise: (n: number) => `${n} ${n === 1 ? "indizio" : "indizi"}`,
    hinweiseSatz: (n: number) =>
      `${n === 1 ? "Una persona mostra" : `${n} persone mostrano`} ` +
      `indizi nel controllo del lavoro autonomo - i dettagli sono nella ` +
      `riga aperta di ogni persona.`,
    scoreLeiste: "Punteggi nella classe",
    punkte: " punti",
    punkteGesprochen: "punti",
    verlaufTitel: SCORE_VERLAUF_TITEL_IT,
    verlaufHilfe: SCORE_VERLAUF_HILFE_IT,
  },
  // ★ O-PL (02.10.2026): „Przegląd klasy" (Glossar §2.6), Lehrkraft ty-Form
  // und unpersönlich; Zahl + Hauptwort mit vier Formen oder nach Doppelpunkt;
  // „pkt" statt „punkty/punktów", weil die Zahl davor wechselt.
  pl: {
    titel: "Przegląd klasy",
    titelHilfe:
      "Jak klasa radzi sobie ostatnio: uderzenia na minutę, dokładność i realizacja celów tygodniowych w porównaniu z poprzednim okresem, a do tego wynik jako linia w czasie.",
    zeitraumGruppe: "Okres przeglądu klasy",
    monat: "Miesiąc",
    monatName: "Miesiąc w przeglądzie klasy",
    monatTipp: (bereich: string) =>
      `Miesiąc: ostatnie 4 tygodnie, ${bereich} (tygodnie od poniedziałku, 8:00, ` +
      `bieżący też się liczy) - małe liczby obok wartości ` +
      `porównują z 4 tygodniami wcześniej.`,
    schuljahr: "Rok szkolny",
    schuljahrName: "Rok szkolny w przeglądzie klasy",
    schuljahrTipp: (label: string, seit: string) =>
      `Rok szkolny ${label}, od ${seit} - małe liczby obok wartości porównują ` +
      `dla każdej osoby pierwsze 4 tygodnie ćwiczeń z ostatnimi 4 ` +
      `(przy mniej niż 5 tygodniach ćwiczeń pierwszy z ostatnim).`,
    anschlaege: "Uderzenia/min",
    treffer: "Dokładność",
    wochenaufgaben: "Cele tygodniowe",
    schnitt: (wert: number) => `średnio ${wert}`,
    schnittProzent: (wert: number) => `średnio ${wert}%`,
    eigenstaendigkeit: "Sprawdzenie samodzielności",
    hinweise: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} wskazówka`,
        few: (z) => `${z} wskazówki`,
        many: (z) => `${z} wskazówek`,
        other: (z) => `${z} wskazówki`,
      }),
    hinweiseSatz: (n: number) =>
      `Osoby ze wskazówkami w sprawdzeniu samodzielności: ${n}. ` +
      `Szczegóły są w rozwiniętym wierszu każdej osoby.`,
    scoreLeiste: "Wyniki w klasie",
    punkte: " pkt",
    punkteGesprochen: "pkt",
    verlaufTitel: SCORE_VERLAUF_TITEL_PL,
    verlaufHilfe: SCORE_VERLAUF_HILFE_PL,
  },
  // ★ O-TR (02.10.2026): "Sınıfa genel bakış" (Glossar §2.6), Lehrkraft siz und
  // unpersönlich; "ortalama" statt "⌀", Prozent vor der Zahl, Uhrzeit ohne Endung.
  tr: {
    titel: "Sınıfa genel bakış",
    titelHilfe:
      "Sınıfın son zamanlardaki gelişimi: dakikada vuruş, doğruluk ve haftalık hedeflere ulaşma, bir önceki dönemle karşılaştırmalı; ayrıca zaman içinde çizgi olarak puan.",
    zeitraumGruppe: "Sınıfa genel bakış dönemi",
    monat: "Ay",
    monatName: "Sınıfa genel bakışta ay",
    monatTipp: (bereich: string) =>
      `Ay: son 4 hafta, ${bereich} (hafta başlangıcı: Pazartesi, 08:00; ` +
      `bu hafta da sayılır) - değerlerin yanındaki küçük sayılar ` +
      `önceki 4 hafta ile karşılaştırır.`,
    schuljahr: "Öğretim yılı",
    schuljahrName: "Sınıfa genel bakışta öğretim yılı",
    schuljahrTipp: (label: string, seit: string) =>
      `Öğretim yılı ${schuljahrLabelTr(label)}, başlangıç: ${seit} - değerlerin yanındaki küçük sayılar ` +
      `her öğrenci için ilk 4 alıştırma haftasını son 4 hafta ile karşılaştırır ` +
      `(5 haftadan az alıştırmada ilk haftayı son hafta ile).`,
    anschlaege: "Vuruş/dk",
    treffer: "Doğruluk",
    wochenaufgaben: "Haftalık hedefler",
    schnitt: (wert: number) => `ortalama ${wert}`,
    schnittProzent: (wert: number) => `ortalama %${wert}`,
    eigenstaendigkeit: "Bağımsız çalışma kontrolü",
    hinweise: (n: number) => `${n} ipucu`,
    hinweiseSatz: (n: number) =>
      `Bağımsız çalışma kontrolünde ipucu görülen öğrenci: ${n}. ` +
      `Ayrıntılar, her öğrencinin açılan satırındadır.`,
    scoreLeiste: "Sınıftaki puanlar",
    punkte: " puan",
    punkteGesprochen: "puan",
    verlaufTitel: SCORE_VERLAUF_TITEL_TR,
    verlaufHilfe: SCORE_VERLAUF_HILFE_TR,
  },
  // ★ O-CS (03.10.2026): „Přehled třídy" (Glossar §2.6), Lehrkraft vy und
  // „se"-Sätze; „průměr" statt „⌀", Prozent mit geschütztem Leerzeichen
  // (Regel 5); die Punkte als „/100" - gesprochen „ze 100", so muss nichts
  // mit der Zahl mitbeugen (§2.11).
  cs: {
    titel: "Přehled třídy",
    titelHilfe:
      "Jak se třídě v poslední době daří: úhozy za minutu, přesnost a plnění týdenních cílů ve srovnání s předchozím obdobím, k tomu skóre jako čára v čase.",
    zeitraumGruppe: "Období přehledu třídy",
    monat: "Měsíc",
    monatName: "Měsíc v přehledu třídy",
    monatTipp: (bereich: string) =>
      `Měsíc: poslední 4 týdny, ${bereich} (týdny od pondělí 8:00, ` +
      `i ten aktuální) - malá čísla vedle hodnot ` +
      `srovnávají se 4 týdny předtím.`,
    schuljahr: "Školní rok",
    schuljahrName: "Školní rok v přehledu třídy",
    schuljahrTipp: (label: string, seit: string) =>
      `Školní rok ${schuljahrLabelCs(label)}, od ${seit} - malá čísla vedle hodnot srovnávají ` +
      `u každé osoby první 4 týdny cvičení s posledními 4 ` +
      `(při méně než 5 týdnech cvičení první s posledním).`,
    anschlaege: "Úhozů/min",
    treffer: "Přesnost",
    wochenaufgaben: "Týdenní cíle",
    schnitt: (wert: number) => `průměr ${wert}`,
    schnittProzent: (wert: number) => `průměr ${wert}\u00A0%`,
    eigenstaendigkeit: "Kontrola samostatnosti",
    hinweise: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `${z} upozornění`,
        few: (z) => `${z} upozornění`,
        many: (z) => `${z} upozornění`,
        other: (z) => `${z} upozornění`,
      }),
    hinweiseSatz: (n: number) =>
      `Osoby s upozorněním v kontrole samostatnosti: ${n} ` +
      `(podrobnosti jsou v rozbaleném řádku každé osoby).`,
    scoreLeiste: "Skóre ve třídě",
    punkte: "/100",
    punkteGesprochen: "ze 100",
    verlaufTitel: SCORE_VERLAUF_TITEL_CS,
    verlaufHilfe: SCORE_VERLAUF_HILFE_CS,
  },
  bg: {
    titel: "Преглед на класа",
    titelHilfe:
      "Как се справя класът напоследък: знака в минута, точност и изпълнени седмични цели в сравнение с предходния период, а също резултатът като линия във времето.",
    zeitraumGruppe: "Период на прегледа на класа",
    monat: "Месец",
    monatName: "Месец в прегледа на класа",
    monatTipp: (bereich: string) =>
      `Месец: последните 4 седмици, ${bereich} (седмиците започват в понеделник в 8:00, ` +
      `текущата също се брои) - малките числа до стойностите ` +
      `сравняват с 4-те седмици преди това.`,
    schuljahr: "Учебна година",
    schuljahrName: "Учебна година в прегледа на класа",
    schuljahrTipp: (label: string, seit: string) =>
      `Учебна година ${schuljahrLabelBg(label)}, от ${seit} - малките числа до стойностите сравняват ` +
      `за всеки ученик първите 4 седмици с упражнения с последните 4 ` +
      `(при по-малко от 5 седмици с упражнения - първата с последната).`,
    anschlaege: "Знаци/мин",
    treffer: "Точност",
    wochenaufgaben: "Седмични цели",
    schnitt: (wert: number) => `средно ${wert}`,
    schnittProzent: (wert: number) => `средно ${wert}%`,
    eigenstaendigkeit: "Проверка за самостоятелност",
    hinweise: (n: number) =>
      mehrzahl(n, "bg", {
        one: (z) => `${z} указание`,
        other: (z) => `${z} указания`,
      }),
    hinweiseSatz: (n: number) =>
      `Ученици с указание в проверката за самостоятелност: ${n} ` +
      `(подробностите са в разгънатия ред на всеки ученик).`,
    scoreLeiste: "Резултати в класа",
    punkte: "/100",
    punkteGesprochen: "от 100",
    verlaufTitel: SCORE_VERLAUF_TITEL_BG,
    verlaufHilfe: SCORE_VERLAUF_HILFE_BG,
  },
  el: {
    titel: "Επισκόπηση τμήματος",
    titelHilfe:
      "Πώς εξελίχθηκε το τμήμα τον τελευταίο καιρό: πατήματα ανά λεπτό, ακρίβεια και εκπλήρωση των εβδομαδιαίων στόχων σε σύγκριση με το προηγούμενο διάστημα, και επιπλέον το σκορ ως γραμμή στον χρόνο.",
    zeitraumGruppe: "Χρονικό διάστημα της επισκόπησης τμήματος",
    monat: "Μήνας",
    monatName: "Μήνας στην επισκόπηση τμήματος",
    monatTipp: (bereich: string) =>
      `Μήνας: οι τελευταίες 4 εβδομάδες, ${bereich} (εβδομάδες από Δευτέρα 8:00, ` +
      `μαζί με την τρέχουσα) - οι μικροί αριθμοί δίπλα στις τιμές ` +
      `συγκρίνουν με τις 4 προηγούμενες εβδομάδες.`,
    schuljahr: "Σχολικό έτος",
    schuljahrName: "Σχολικό έτος στην επισκόπηση τμήματος",
    schuljahrTipp: (label: string, seit: string) =>
      `Σχολικό έτος ${schuljahrLabelEl(label)}, από ${seit} - οι μικροί αριθμοί δίπλα στις τιμές συγκρίνουν ` +
      `για κάθε παιδί τις πρώτες 4 εβδομάδες εξάσκησης με τις τελευταίες 4 ` +
      `(με λιγότερες από 5 εβδομάδες εξάσκησης, την πρώτη με την τελευταία).`,
    anschlaege: "Πατήματα/λεπτό",
    treffer: "Ακρίβεια",
    wochenaufgaben: "Εβδομαδιαίοι στόχοι",
    schnitt: (wert: number) => `μέσος όρος ${wert}`,
    schnittProzent: (wert: number) => `μέσος όρος ${wert}%`,
    eigenstaendigkeit: "Έλεγχος αυτονομίας",
    hinweise: (n: number) =>
      mehrzahl(n, "el", {
        one: (z) => `${z} ένδειξη`,
        other: (z) => `${z} ενδείξεις`,
      }),
    hinweiseSatz: (n: number) =>
      `Παιδιά με ενδείξεις στον έλεγχο αυτονομίας: ${n} ` +
      `(οι λεπτομέρειες είναι στην ανοιγμένη γραμμή κάθε παιδιού).`,
    scoreLeiste: "Σκορ στο τμήμα",
    punkte: "/100",
    punkteGesprochen: "από 100",
    verlaufTitel: SCORE_VERLAUF_TITEL_EL,
    verlaufHilfe: SCORE_VERLAUF_HILFE_EL,
  },
  hu: {
    titel: "Osztályáttekintés",
    titelHilfe:
      "Hogyan alakult az osztály az utóbbi időben: leütés/perc, pontosság és a heti célok teljesítése az előző időszakhoz képest, valamint a pontszám vonalként az idő függvényében.",
    zeitraumGruppe: "Az osztályáttekintés időszaka",
    monat: "Hónap",
    monatName: "Hónap az osztályáttekintésben",
    monatTipp: (bereich: string) =>
      `Hónap: az utolsó 4 hét, ${bereich} (a hetek hétfőn 8:00-kor kezdődnek, ` +
      `a folyamatban lévő is beleszámít) - az értékek melletti kis számok ` +
      `az azt megelőző 4 héttel vetnek össze.`,
    schuljahr: "Tanév",
    schuljahrName: "Tanév az osztályáttekintésben",
    schuljahrTipp: (label: string, seit: string) =>
      `Tanév: ${schuljahrLabelHu(label)}, kezdete: ${seit} - az értékek melletti kis számok ` +
      `minden tanulónál az első 4 gyakorlóhetet vetik össze az utolsó 4 héttel ` +
      `(ha nincs legalább 5 gyakorlóhét, az elsőt az utolsóval).`,
    anschlaege: "Leütés/perc",
    treffer: "Pontosság",
    wochenaufgaben: "Heti célok",
    schnitt: (wert: number) => `átlag: ${wert}`,
    schnittProzent: (wert: number) => `átlag: ${wert}%`,
    eigenstaendigkeit: "Önálló munka ellenőrzése",
    hinweise: (n: number) =>
      mehrzahl(n, "hu", {
        one: (z) => `${z} jelzés`,
        other: (z) => `${z} jelzés`,
      }),
    hinweiseSatz: (n: number) =>
      `Tanulók jelzéssel az önálló munka ellenőrzésében: ${n} ` +
      `(a részletek az egyes tanulók kinyitott sorában vannak).`,
    scoreLeiste: "Pontszám az osztályban",
    punkte: " pont",
    punkteGesprochen: "pont",
    verlaufTitel: SCORE_VERLAUF_TITEL_HU,
    verlaufHilfe: SCORE_VERLAUF_HILFE_HU,
  },
  nl: {
    titel: "Klasoverzicht",
    titelHilfe:
      "Hoe de klas zich de laatste tijd heeft ontwikkeld: aanslagen per minuut, nauwkeurigheid en gehaalde weekdoelen vergeleken met de periode daarvoor, plus de score als lijn door de tijd.",
    zeitraumGruppe: "Periode van het klasoverzicht",
    monat: "Maand",
    monatName: "Maand in het klasoverzicht",
    monatTipp: (bereich: string) =>
      `Maand: de laatste 4 weken, ${bereich} (weken beginnen op maandag om 8.00 uur, ` +
      `de lopende week telt mee) - de kleine getallen naast de waarden ` +
      `vergelijken met de 4 weken daarvoor.`,
    schuljahr: "Schooljaar",
    schuljahrName: "Schooljaar in het klasoverzicht",
    schuljahrTipp: (label: string, seit: string) =>
      `Schooljaar ${schuljahrLabelNl(label)}, sinds ${seit} - de kleine getallen naast de waarden ` +
      `vergelijken per leerling de eerste 4 oefenweken met de laatste 4 ` +
      `(bij minder dan 5 oefenweken de eerste met de laatste).`,
    anschlaege: "Aanslagen/min",
    treffer: "Nauwkeurigheid",
    wochenaufgaben: "Weekdoelen",
    schnitt: (wert: number) => `gemiddeld ${wert}`,
    schnittProzent: (wert: number) => `gemiddeld ${wert}%`,
    eigenstaendigkeit: "Controle op zelfstandig werk",
    hinweise: (n: number) =>
      mehrzahl(n, "nl", { one: (z) => `${z} aanwijzing`, other: (z) => `${z} aanwijzingen` }),
    hinweiseSatz: (n: number) =>
      mehrzahl(n, "nl", {
        one: (z) =>
          `Bij ${z} leerling zijn er aanwijzingen in de controle op zelfstandig werk - ` +
          `de details staan in de uitgeklapte regel van de leerling.`,
        other: (z) =>
          `Bij ${z} leerlingen zijn er aanwijzingen in de controle op zelfstandig werk - ` +
          `de details staan in de uitgeklapte regel van elke leerling.`,
      }),
    scoreLeiste: "Scores in de klas",
    punkte: "/100",
    punkteGesprochen: "van de 100",
    verlaufTitel: SCORE_VERLAUF_TITEL_NL,
    verlaufHilfe: SCORE_VERLAUF_HILFE_NL,
  },
  pt: {
    titel: "Visão geral da turma",
    titelHilfe:
      "Como a turma tem evoluído nos últimos tempos: toques por minuto, precisão e cumprimento dos objetivos semanais em comparação com o período anterior, além da pontuação como linha ao longo do tempo.",
    zeitraumGruppe: "Período da visão geral da turma",
    monat: "Mês",
    monatName: "Mês na visão geral da turma",
    monatTipp: (bereich: string) =>
      `Mês: as últimas 4 semanas, ${bereich} (semanas a partir de segunda-feira às 08:00, ` +
      `incluindo a atual) - os números pequenos ao lado dos valores ` +
      `comparam com as 4 semanas anteriores.`,
    schuljahr: "Ano letivo",
    schuljahrName: "Ano letivo na visão geral da turma",
    schuljahrTipp: (label: string, seit: string) =>
      `Ano letivo ${schuljahrLabelPt(label)}, desde ${seit} - os números pequenos ao lado dos valores comparam, ` +
      `para cada pessoa, as primeiras 4 semanas de prática com as últimas 4 ` +
      `(com menos de 5 semanas de prática, a primeira com a última).`,
    anschlaege: "Toques/min",
    treffer: "Precisão",
    wochenaufgaben: "Objetivos semanais",
    schnitt: (wert: number) => `média ${wert}`,
    schnittProzent: (wert: number) => `média ${wert}%`,
    eigenstaendigkeit: "Verificação do trabalho autónomo",
    hinweise: (n: number) =>
      mehrzahl(n, "pt", {
        one: (z) => `${z} indício`,
        other: (z) => `${z} indícios`,
        many: (z) => `${z} de indícios`,
      }),
    hinweiseSatz: (n: number) =>
      `Pessoas com indícios na verificação do trabalho autónomo: ${n} ` +
      `(os pormenores estão na linha expandida de cada pessoa).`,
    scoreLeiste: "Pontuação na turma",
    punkte: "/100",
    punkteGesprochen: "de 100",
    verlaufTitel: SCORE_VERLAUF_TITEL_PT,
    verlaufHilfe: SCORE_VERLAUF_HILFE_PT,
  },
  br: {
    titel: "Visão geral da turma",
    titelHilfe:
      "Como a turma tem evoluído: toques por minuto, precisão e metas semanais cumpridas em comparação com o período anterior, além da pontuação como linha ao longo do tempo.",
    zeitraumGruppe: "Período da visão geral da turma",
    monat: "Mês",
    monatName: "Mês na visão geral da turma",
    monatTipp: (bereich: string) =>
      `Mês: as últimas 4 semanas, ${bereich} (semanas a partir de segunda-feira às 8:00, ` +
      `incluindo a atual) - os números pequenos ao lado dos valores ` +
      `comparam com as 4 semanas anteriores.`,
    schuljahr: "Ano letivo",
    schuljahrName: "Ano letivo na visão geral da turma",
    schuljahrTipp: (label: string, seit: string) =>
      `Ano letivo ${schuljahrLabelBr(label)}, desde ${seit} - os números pequenos ao lado dos valores comparam, ` +
      `para cada pessoa, as 4 primeiras semanas de prática com as 4 últimas ` +
      `(com menos de 5 semanas de prática, a primeira com a última).`,
    anschlaege: "Toques/min",
    treffer: "Precisão",
    wochenaufgaben: "Metas semanais",
    schnitt: (wert: number) => `média ${wert}`,
    schnittProzent: (wert: number) => `média ${wert}%`,
    eigenstaendigkeit: "Verificação do trabalho autônomo",
    hinweise: (n: number) =>
      n === 0
        ? "Nenhum indício"
        : mehrzahl(n, "br", {
            one: (z) => `${z} indício`,
            other: (z) => `${z} indícios`,
          }),
    hinweiseSatz: (n: number) =>
      `Pessoas com indícios na verificação do trabalho autônomo: ${n} ` +
      `(os detalhes estão na linha expandida de cada pessoa).`,
    scoreLeiste: "Pontuação na turma",
    punkte: "/100",
    punkteGesprochen: "de 100",
    verlaufTitel: SCORE_VERLAUF_TITEL_BR,
    verlaufHilfe: SCORE_VERLAUF_HILFE_BR,
  },
  ro: {
    titel: "Prezentarea clasei",
    titelHilfe:
      "Cum a evoluat clasa în ultima vreme: caractere pe minut, precizie și îndeplinirea obiectivelor săptămânale față de perioada anterioară, plus scorul ca linie în timp.",
    zeitraumGruppe: "Perioada prezentării clasei",
    monat: "Lună",
    monatName: "Luna în prezentarea clasei",
    monatTipp: (bereich: string) =>
      `Lună: ultimele 4 săptămâni, ${bereich} (săptămâni începând de luni la ora 8:00, ` +
      `inclusiv cea în curs) - numerele mici de lângă valori ` +
      `compară cu cele 4 săptămâni dinainte.`,
    schuljahr: "An școlar",
    schuljahrName: "Anul școlar în prezentarea clasei",
    schuljahrTipp: (label: string, seit: string) =>
      `Anul școlar ${schuljahrLabelRo(label)}, de la ${seit} - numerele mici de lângă valori compară, ` +
      `pentru fiecare persoană, primele 4 săptămâni de exersare cu ultimele 4 ` +
      `(la mai puțin de 5 săptămâni de exersare, prima cu ultima).`,
    anschlaege: "car./min",
    treffer: "Precizie",
    wochenaufgaben: "Obiective săptămânale",
    schnitt: (wert: number) => `medie ${wert}`,
    schnittProzent: (wert: number) => `medie ${wert} %`,
    eigenstaendigkeit: "Verificarea lucrului independent",
    hinweise: (n: number) =>
      mehrzahl(n, "ro", {
        one: (z) => `${z} semnalare`,
        few: (z) => `${z} semnalări`,
        other: (z) => `${z} de semnalări`,
      }),
    hinweiseSatz: (n: number) =>
      `Persoane cu semnalări la verificarea lucrului independent: ${n} ` +
      `(detaliile sunt în rândul extins al fiecărei persoane).`,
    scoreLeiste: "Scorul în clasă",
    punkte: "/100",
    punkteGesprochen: "din 100",
    verlaufTitel: SCORE_VERLAUF_TITEL_RO,
    verlaufHilfe: SCORE_VERLAUF_HILFE_RO,
  },
  sv: {
    titel: "Klassöversikt",
    titelHilfe:
      "Hur det har gått för klassen den senaste tiden: anslag per minut, träffsäkerhet och uppnådda veckomål jämfört med perioden före, och dessutom poängen som en linje över tid.",
    zeitraumGruppe: "Period för klassöversikten",
    monat: "Månad",
    monatName: "Månad i klassöversikten",
    monatTipp: (bereich: string) =>
      `Månad: de senaste 4 veckorna, ${bereich} (veckor från måndag klockan 08:00, ` +
      `den pågående räknas med) - de små talen bredvid värdena ` +
      `jämför med de 4 veckorna före.`,
    schuljahr: "Läsår",
    schuljahrName: "Läsår i klassöversikten",
    schuljahrTipp: (label: string, seit: string) =>
      `Läsåret ${schuljahrLabelSv(label)}, sedan ${seit} - de små talen bredvid värdena jämför ` +
      `för varje elev de första 4 övningsveckorna med de senaste 4 ` +
      `(vid färre än 5 övningsveckor den första med den senaste).`,
    anschlaege: "Anslag/min",
    treffer: "Träffsäkerhet",
    wochenaufgaben: "Veckomål",
    schnitt: (wert: number) => `genomsnitt ${wert}`,
    schnittProzent: (wert: number) => `genomsnitt ${wert} %`,
    eigenstaendigkeit: "Kontroll av självständighet",
    hinweise: (n: number) =>
      mehrzahl(n, "sv", {
        one: (z) => `${z} notering`,
        other: (z) => `${z} noteringar`,
      }),
    hinweiseSatz: (n: number) =>
      `Elever med noteringar i kontrollen av självständighet: ${n} ` +
      `(detaljerna finns på varje elevs utfällda rad).`,
    scoreLeiste: "Poäng i klassen",
    punkte: " poäng",
    punkteGesprochen: "poäng",
    verlaufTitel: SCORE_VERLAUF_TITEL_SV,
    verlaufHilfe: SCORE_VERLAUF_HILFE_SV,
  },
  uk: {
    titel: "Огляд класу",
    titelHilfe:
      "Як клас просувався останнім часом: знаків за хвилину, точність і виконання тижневої мети порівняно з попереднім періодом, а також бали як лінія в часі.",
    zeitraumGruppe: "Період огляду класу",
    monat: "Місяць",
    monatName: "Місяць в огляді класу",
    monatTipp: (bereich: string) =>
      `Місяць: останні 4 тижні, ${bereich} (тижні від понеділка 8:00, ` +
      `поточний теж рахується) - малі числа біля значень ` +
      `порівнюють із 4 тижнями перед тим.`,
    schuljahr: "Навчальний рік",
    schuljahrName: "Навчальний рік в огляді класу",
    schuljahrTipp: (label: string, seit: string) =>
      `Навчальний рік ${schuljahrLabelUk(label)}, від ${seit} - малі числа біля значень порівнюють ` +
      `для кожної дитини перші 4 тижні тренувань з останніми 4 ` +
      `(якщо тижнів тренувань менше ніж 5 - перший з останнім).`,
    anschlaege: "Знаків/хв",
    treffer: "Точність",
    wochenaufgaben: "Тижнева мета",
    schnitt: (wert: number) => `середнє ${wert}`,
    schnittProzent: (wert: number) => `середнє ${wert}%`,
    eigenstaendigkeit: "Перевірка самостійності",
    hinweise: (n: number) =>
      mehrzahl(n, "uk", {
        one: (z) => `${z} підказка`,
        few: (z) => `${z} підказки`,
        many: (z) => `${z} підказок`,
        other: (z) => `${z} підказки`,
      }),
    hinweiseSatz: (n: number) =>
      `Діти з підказками в перевірці самостійності: ${n} ` +
      `(подробиці - у розгорнутому рядку кожної дитини).`,
    scoreLeiste: "Бали в класі",
    punkte: "/100",
    punkteGesprochen: "зі 100",
    verlaufTitel: SCORE_VERLAUF_TITEL_UK,
    verlaufHilfe: SCORE_VERLAUF_HILFE_UK,
  },
});

/**
 * Eine Zahl der Kennzahl-Zeile: Name, Wert, kleiner Trend - und der ganze
 * Satz als Hinweis (Maus) und unsichtbar daneben (Sprachausgabe).
 */
function Kennziffer({
  name,
  wert,
  trend,
  satz,
  ausrichtung = "links",
}: {
  name: string;
  wert: string;
  trend: string | null;
  satz: string;
  ausrichtung?: "links" | "rechts";
}) {
  return (
    <div className="flex items-baseline gap-1.5" data-kennziffer={name}>
      <dt className="text-ink-muted">{name}</dt>
      <dd className="m-0">
        <Hinweisflaeche hilfe={satz} ausrichtung={ausrichtung} className="inline-flex items-baseline gap-1.5">
          <span
            aria-hidden="true"
            className="font-semibold tabular-nums text-ink underline decoration-dotted underline-offset-4"
          >
            {wert}
          </span>
          {trend && (
            <span aria-hidden="true" className="tabular-nums text-ink-muted" data-trend="">
              {trend}
            </span>
          )}
          <span className="sr-only">{satz}</span>
        </Hinweisflaeche>
      </dd>
    </div>
  );
}

/** ★ O5 (30.10.2026): das Schuljahr in der Schreibweise der neun Sprachen - dieselben Funktionen wie in `UEBERBLICK_TEXTE`. */
const SCHULJAHR_LABEL_NEUN: Readonly<Record<GeruestSprache, (label: string) => string>> = {
  bg: schuljahrLabelBg,
  el: schuljahrLabelEl,
  hu: schuljahrLabelHu,
  nl: schuljahrLabelNl,
  pt: schuljahrLabelPt,
  br: schuljahrLabelBr,
  ro: schuljahrLabelRo,
  sv: schuljahrLabelSv,
  uk: schuljahrLabelUk,
};

export function Klassenueberblick({
  film,
  datas,
  gesperrt,
  kopfRechts,
  schuljahrBeginn,
}: {
  /** Die Kinder mit UNGEFILTERTEN Ereignissen - gefiltert wird in der Rechnung. */
  datas: readonly PupilData[];
  /** Die gesperrten Zeiten der Klasse - siehe `wochenziel.ts` „Eine Stunde sperren". */
  gesperrt: readonly GesperrteZeit[];
  /** Rechts in der Kopfzeile - „Nachricht an die Klasse". */
  kopfRechts?: ReactNode;
  /** Nummer eines Einführungsfilms (`filme.ts`) - der Knopf steht hinter der Überschrift. */
  film?: string;
  /**
   * ★ D2 (28.09.2026): der Beginn des Schuljahres der Klasse (Monat 1-12,
   * `schuljahrBeginnVon`) - ohne Angabe der 1. August wie bisher.
   */
  schuljahrBeginn?: number;
}) {
  const titelId = useId();
  const [art, setArt] = useState<UeberblickArt>(UEBERBLICK_VORGABE);
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const u = UEBERBLICK_TEXTE[sprache];
  const en = sprache === "en";
  const fr = sprache === "fr";
  // ★ ES-O (27.09.2026): ohne diesen Zweig fiel „es" hier überall still auf Deutsch.
  const es = sprache === "es";
  // ★ O-IT (02.10.2026): eigener Zweig, vor den anderen geprüft - de/en/fr/es unverändert.
  const it = sprache === "it";
  // ★ O-PL (02.10.2026): ebenso - vor allen anderen geprüft.
  const pl = sprache === "pl";
  // ★ O-TR (02.10.2026): ebenso - gleich hinter pl geprüft.
  const tr = sprache === "tr";
  // ★ O-CS (03.10.2026): ebenso - vor allen anderen geprüft.
  const cs = sprache === "cs";
  // ★ O5 (30.10.2026): die neun - eine Tabelle (`klassenueberblickNeun.ts`); vor allen Ketten geprüft, sonst fielen sie auf Deutsch.
  const neun = istGeruestSprache(sprache) ? sprache : null;

  /*
    ⚠️ Kinder, deren Stand NICHT gelesen werden konnte (`fehler`), stehen in
    keiner Zahl: Ihre leeren Ereignisse sind keine Messung, und die Seite
    sagt das schon in ihrem eigenen Warnkasten.
  */
  const kinder = useMemo(
    () =>
      datas
        .filter((d) => !d.fehler)
        .map((d) => ({
          name: d.pupil.name,
          events: d.events,
          ziel: kindWochenzielAusFeldern(d.pupil),
        })),
    [datas],
  );
  // `Date.now()` bewusst nicht in den Abhängigkeiten: Es ändert sich bei
  // jedem Bild; die Wochengrenze wandert ohnehin nur einmal in der Woche.
  const zahlen = useMemo(
    () => klassenKennzahlen(kinder, art, Date.now(), gesperrt, schuljahrBeginn),
    [kinder, art, gesperrt, schuljahrBeginn],
  );
  const verlauf = useMemo(
    () => klassenScoreVerlauf(kinder, Date.now(), schuljahrBeginn),
    [kinder, schuljahrBeginn],
  );

  /*
    ★ L1 (19.09.2026, im Browser gemessen bei 375 px): Bricht die Kopfzeile um,
    rutscht „Nachricht an die Klasse" in eine eigene Zeile - und der Trennstrich
    stünde allein am Ende der Zeile davor. Er wird dann UNSICHTBAR (nicht
    entfernt: `visibility` behält seinen Platz, sonst passte der Knopf wieder
    hinauf, der Strich käme zurück, und die Zeile spränge hin und her).
  */
  const umschalterRef = useRef<HTMLDivElement>(null);
  const knopfRef = useRef<HTMLDivElement>(null);
  const [strichSichtbar, setStrichSichtbar] = useState(true);
  useLayoutEffect(() => {
    const umschalter = umschalterRef.current;
    const knopf = knopfRef.current;
    if (!umschalter || !knopf) return;
    const pruefe = () => setStrichSichtbar(Math.abs(umschalter.offsetTop - knopf.offsetTop) < 4);
    pruefe();
    if (typeof ResizeObserver === "undefined") return;
    const beobachter = new ResizeObserver(pruefe);
    beobachter.observe(umschalter.parentElement ?? umschalter);
    return () => beobachter.disconnect();
  }, [kopfRechts, datas.length]);

  if (datas.length === 0) return null;

  const jetzt = Date.now();
  const sj = schuljahrVon(jetzt, schuljahrBeginn);
  const monatBereich = monatBereichKompakt(0, jetzt, WOCHENZIEL_GRENZE, sprache);
  const phrase =
    art === "monat" ? `in den letzten 4 Wochen (${monatBereich})` : `im Schuljahr ${sj.label}`;
  /** ★ EN6a: dieselbe Wendung englisch - sie steht mitten im Satz. */
  const phraseEn =
    art === "monat" ? `in the last 4 weeks (${monatBereich})` : `in the school year ${sj.label}`;
  /** ★ ES-O: dieselbe Wendung spanisch. */
  const phraseEs =
    art === "monat" ? `en las últimas 4 semanas (${monatBereich})` : `en el curso escolar ${sj.label}`;
  /** ★ O-IT: dieselbe Wendung italienisch. */
  const phraseIt =
    art === "monat" ? `nelle ultime 4 settimane (${monatBereich})` : `nell'anno scolastico ${sj.label}`;
  /** ★ O-PL: dieselbe Wendung polnisch (Miejscownik mit „w", wie `vergleichsName`). */
  const phrasePl =
    art === "monat" ? `w ostatnich 4 tygodniach (${monatBereich})` : `w roku szkolnym ${sj.label}`;
  /**
   * ★ O-TR: dieselbe Wendung türkisch - die Endung steht an "hafta"/"yıl", nie
   * am Bereich oder am Schuljahr (Glossar Regel 6); einmal als Satzanfang.
   */
  const phraseTr =
    art === "monat" ? `son 4 haftada (${monatBereich})` : `${schuljahrLabelTr(sj.label)} öğretim yılında`;
  const phraseTrAnfang =
    art === "monat" ? `Son 4 haftada (${monatBereich})` : `${schuljahrLabelTr(sj.label)} öğretim yılında`;
  /**
   * ★ O-CS: dieselbe Wendung tschechisch, mit „v"/„ve" im 6. Fall (wie
   * `vergleichsName`); einmal als Satzanfang.
   */
  const phraseCs =
    art === "monat"
      ? `v posledních 4 týdnech (${monatBereich})`
      : `ve školním roce ${schuljahrLabelCs(sj.label)}`;
  const phraseCsAnfang = phraseCs.charAt(0).toUpperCase() + phraseCs.slice(1);
  /** ★ E11a-3: dieselbe Wendung französisch. */
  const phraseFr =
    art === "monat"
      ? `au cours des 4 dernières semaines (${monatBereich})`
      : `dans l'année scolaire ${sj.label}`;
  /** ★ O5: dieselbe Wendung in den neun Sprachen. */
  const phraseNeun = !neun
    ? ""
    : art === "monat"
      ? UEBERBLICK_SAETZE_NEUN[neun].phraseMonat(monatBereich)
      : UEBERBLICK_SAETZE_NEUN[neun].phraseSchuljahr(SCHULJAHR_LABEL_NEUN[neun](sj.label));
  const vergleich =
    art === "monat"
      ? vergleichsName(ueberblickZeitraum("monat"), jetzt, sprache)
      : neun
        ? UEBERBLICK_SAETZE_NEUN[neun].vergleichSchuljahr
      : cs
        ? "v prvních týdnech cvičení školního roku"
      : pl
        ? "w pierwszych tygodniach ćwiczeń roku szkolnego"
      : tr
        ? "öğretim yılının ilk alıştırma haftaları"
      : it
        ? "le prime settimane di esercizio dell'anno scolastico"
        : fr
        ? "les premières semaines d'exercice de l'année scolaire"
        : es
          ? "las primeras semanas de práctica del curso escolar"
          : en
          ? "the first practice weeks of the school year"
          : SCHULJAHR_VERGLEICH;
  const alle = kinder.length;
  const nichtGeuebt =
    zahlen.ohneUebung.length > 0
      ? neun
        ? UEBERBLICK_SAETZE_NEUN[neun].ohneUebung(zahlen.ohneUebung.join(", "))
        : cs
        ? ` Bez cvičení: ${zahlen.ohneUebung.join(", ")}.`
        : pl
        ? ` Bez ćwiczeń: ${zahlen.ohneUebung.join(", ")}.`
        : tr
        ? ` Alıştırma yapmayan: ${zahlen.ohneUebung.join(", ")}.`
        : it
        ? ` Nessun esercizio per: ${zahlen.ohneUebung.join(", ")}.`
        : fr
        ? ` Ne se sont pas entrainés : ${zahlen.ohneUebung.join(", ")}.`
        : es
          ? ` No practicaron: ${zahlen.ohneUebung.join(", ")}.`
          : en
          ? ` Did not practise: ${zahlen.ohneUebung.join(", ")}.`
          : ` Nicht geübt: ${zahlen.ohneUebung.join(", ")}.`
      : "";

  /** ★ EN6a: der Satz zu Tempo bzw. Treffsicherheit, englisch. */
  const kennSatzEn = (k: Kennzahl, groesse: "tempo" | "treffer", wertText: string): string => {
    if (k.wert === null) return `No practice ${phraseEn} yet.`;
    const basis = `${wertText} on average ${phraseEn}, across ${k.gezaehlt} of ${kinderEn(alle)}.${nichtGeuebt}`;
    let trend: string;
    if (art === "monat") {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "en")} This compares ${
            k.verglichen === 1
              ? "the one pupil who"
              : `the ${k.verglichen} pupils who`
          } practised in both periods.`
        : `No pupil practised both in these 4 weeks and in the 4 weeks before - there is nothing to compare.`;
    } else {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "en")} For each pupil, the first 4 practice ` +
          `weeks against the last 4 (with fewer than 5 practice weeks, the first against the last), ` +
          `averaged over ${kinderEn(k.verglichen)}.`
        : `No pupil has two practice weeks with at least ${MINDESTZEILEN} lines in the school year yet - there is nothing to compare.`;
    }
    return `${basis} ${trend}`;
  };

  /** ★ E11a-3: der Satz zu Tempo bzw. Treffsicherheit, französisch. */
  const kennSatzFr = (k: Kennzahl, groesse: "tempo" | "treffer", wertText: string): string => {
    if (k.wert === null) return `Pas encore d'exercice ${phraseFr}.`;
    const basis = `${wertText} en moyenne ${phraseFr}, calculé sur ${k.gezaehlt} des ${kinderFr(alle)}.${nichtGeuebt}`;
    let trend: string;
    if (art === "monat") {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "fr")} Cela concerne ${
            k.verglichen === 1
              ? "l'unique élève qui"
              : `les ${k.verglichen} élèves qui`
          } ${k.verglichen === 1 ? "a" : "ont"} tapé pendant les deux périodes.`
        : `Aucun élève n'a tapé à la fois ces 4 semaines et les 4 semaines précédentes - il n'y a rien à comparer.`;
    } else {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "fr")} Pour chaque élève, les 4 premières ` +
          `semaines d'exercice comparées aux 4 dernières (avec moins de 5 semaines d'exercice, la première ` +
          `comparée à la dernière), en moyenne sur ${kinderFr(k.verglichen)}.`
        : `Aucun élève n'a encore deux semaines d'exercice avec au moins ${MINDESTZEILEN} lignes dans l'année scolaire - il n'y a rien à comparer.`;
    }
    return `${basis} ${trend}`;
  };

  /** ★ O-IT: der Satz zu Tempo bzw. Precisione, italienisch - „persona" statt Partizip-Mehrzahl. */
  const kennSatzIt = (k: Kennzahl, groesse: "tempo" | "treffer", wertText: string): string => {
    if (k.wert === null) return `Ancora nessun esercizio ${phraseIt}.`;
    const basis = `In media ${wertText} ${phraseIt}, su ${k.gezaehlt} di ${kinderIt(alle)}.${nichtGeuebt}`;
    let trend: string;
    if (art === "monat") {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "it")} ${
            k.verglichen === 1
              ? "Si confronta l'unica persona che si è esercitata"
              : `Si confrontano le ${k.verglichen} persone che si sono esercitate`
          } in entrambi i periodi.`
        : `Nessuna persona si è esercitata sia in queste 4 settimane sia nelle 4 precedenti - non c'è niente da confrontare.`;
    } else {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "it")} Per ogni persona, le prime 4 settimane ` +
          `di esercizio a confronto con le ultime 4 (con meno di 5 settimane di esercizio, la prima a confronto con l'ultima), ` +
          `in media su ${kinderIt(k.verglichen)}.`
        : `Nessuna persona ha ancora due settimane di esercizio con almeno ${MINDESTZEILEN} righe nell'anno scolastico - non c'è niente da confrontare.`;
    }
    return `${basis} ${trend}`;
  };

  /** ★ O-PL: der Satz zu Tempo bzw. Dokładność, polnisch - „osoby" statt einer Personenform mit Geschlecht. */
  const kennSatzPl = (k: Kennzahl, groesse: "tempo" | "treffer", wertText: string): string => {
    if (k.wert === null) return `Nie ma jeszcze ćwiczeń ${phrasePl}.`;
    const basis = `Średnio ${wertText} ${phrasePl}; liczone osoby: ${k.gezaehlt} z ${alle}.${nichtGeuebt}`;
    let trend: string;
    if (art === "monat") {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "pl")} Porównywane są osoby, ` +
          `które ćwiczyły w obu okresach (${k.verglichen}).`
        : `Nie ma osób, które ćwiczyły zarówno w tych 4 tygodniach, jak i w 4 poprzednich - nie ma czego porównać.`;
    } else {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "pl")} Dla każdej osoby pierwsze 4 tygodnie ` +
          `ćwiczeń w porównaniu z ostatnimi 4 (przy mniej niż 5 tygodniach ćwiczeń pierwszy w porównaniu z ostatnim); ` +
          `średnia z osób: ${k.verglichen}.`
        : `Nie ma jeszcze osoby z dwoma tygodniami ćwiczeń w roku szkolnym (minimum wierszy w tygodniu: ${MINDESTZEILEN}) - nie ma czego porównać.`;
    }
    return `${basis} ${trend}`;
  };

  /** ★ O-TR: der Satz zu Tempo bzw. Doğruluk, türkisch - Zahlen nur nach Doppelpunkt, ohne Endung. */
  const kennSatzTr = (k: Kennzahl, groesse: "tempo" | "treffer", wertText: string): string => {
    if (k.wert === null) return `${phraseTrAnfang} henüz alıştırma yapılmadı.`;
    const basis = `${phraseTrAnfang} ortalama ${wertText}; hesaba katılan öğrenci: ${k.gezaehlt}, toplam ${alle}.${nichtGeuebt}`;
    let trend: string;
    if (art === "monat") {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "tr")} Karşılaştırılan, ` +
          `iki dönemde de alıştırma yapan öğrenci: ${k.verglichen}.`
        : `Hem bu 4 haftada hem de önceki 4 haftada alıştırma yapan öğrenci yok - karşılaştırılacak bir şey yok.`;
    } else {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "tr")} Her öğrenci için ilk 4 alıştırma haftası ` +
          `son 4 hafta ile karşılaştırılır (5 haftadan az alıştırmada ilk hafta son hafta ile); ` +
          `ortalamaya giren öğrenci: ${k.verglichen}.`
        : `Öğretim yılında henüz iki alıştırma haftası olan öğrenci yok (haftada en az satır: ${MINDESTZEILEN}) - karşılaştırılacak bir şey yok.`;
    }
    return `${basis} ${trend}`;
  };

  /**
   * ★ O-CS: der Satz zu Tempo bzw. Přesnost, tschechisch - „osoby" statt einer
   * Personenform mit Geschlecht; Zahlen in Klammern oder vor einem Wort, kein
   * Satz endet auf einer Zahl mit Punkt (Glossar §4 Falle 4).
   */
  const kennSatzCs = (k: Kennzahl, groesse: "tempo" | "treffer", wertText: string): string => {
    if (k.wert === null) return `${phraseCsAnfang} se zatím necvičilo.`;
    const basis = `${phraseCsAnfang} v průměru: ${wertText} (započtené osoby: ${k.gezaehlt}/${alle}).${nichtGeuebt}`;
    let trend: string;
    if (art === "monat") {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "cs")} Srovnávají se osoby, ` +
          `které cvičily v obou obdobích (${k.verglichen}).`
        : `Žádná osoba necvičila zároveň v těchto 4 týdnech a ve 4 týdnech předtím - není s čím srovnávat.`;
    } else {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "cs")} U každé osoby se srovnávají první 4 týdny ` +
          `cvičení s posledními 4 (při méně než 5 týdnech cvičení první s posledním); ` +
          `průměr za ${osobyCs(k.verglichen)}.`
        : `Zatím žádná osoba nemá ve školním roce dva týdny cvičení (aspoň ${radkyCs(MINDESTZEILEN)} za týden) - není s čím srovnávat.`;
    }
    return `${basis} ${trend}`;
  };

  /** ★ ES-O: der Satz zu Tempo bzw. Treffsicherheit, spanisch. */
  const kennSatzEs = (k: Kennzahl, groesse: "tempo" | "treffer", wertText: string): string => {
    if (k.wert === null) return `Todavía no hay práctica ${phraseEs}.`;
    const basis = `${wertText} de media ${phraseEs}, calculado sobre ${k.gezaehlt} de ${kinderEs(alle)}.${nichtGeuebt}`;
    let trend: string;
    if (art === "monat") {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "es")} Se compara ${
            k.verglichen === 1
              ? "a la única persona que practicó"
              : `a las ${k.verglichen} personas que practicaron`
          } en los dos periodos.`
        : `Nadie practicó a la vez en estas 4 semanas y en las 4 anteriores - no hay nada que comparar.`;
    } else {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich, "es")} Para cada estudiante, las 4 primeras ` +
          `semanas de práctica frente a las 4 últimas (con menos de 5 semanas de práctica, la primera frente a la última), ` +
          `de media sobre ${kinderEs(k.verglichen)}.`
        : `Nadie tiene todavía dos semanas de práctica con al menos ${MINDESTZEILEN} líneas en el curso escolar - no hay nada que comparar.`;
    }
    return `${basis} ${trend}`;
  };

  /** Der Satz zu Tempo bzw. Treffsicherheit. */
  const kennSatz = (k: Kennzahl, groesse: "tempo" | "treffer", wertText: string): string => {
    if (neun) return kennSatzNeun(neun, { k, groesse, wertText, art, phrase: phraseNeun, vergleich, alle, nichtGeuebt });
    if (cs) return kennSatzCs(k, groesse, wertText);
    if (pl) return kennSatzPl(k, groesse, wertText);
    if (tr) return kennSatzTr(k, groesse, wertText);
    if (it) return kennSatzIt(k, groesse, wertText);
    if (fr) return kennSatzFr(k, groesse, wertText);
    if (es) return kennSatzEs(k, groesse, wertText);
    if (en) return kennSatzEn(k, groesse, wertText);
    if (k.wert === null) return `Noch keine Übung ${phrase}.`;
    const basis =
      `Im Schnitt ${wertText} ${phrase}, gemittelt über ${k.gezaehlt} von ${alle} ` +
      `${alle === 1 ? "Kind" : "Kindern"}.${nichtGeuebt}`;
    let trend: string;
    if (art === "monat") {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich)} Verglichen ${
            k.verglichen === 1
              ? "wird das eine Kind, das"
              : `werden die ${k.verglichen} Kinder, die`
          } in beiden Zeiträumen geübt ${k.verglichen === 1 ? "hat" : "haben"}.`
        : `Kein Kind hat in diesen und in den 4 Wochen davor geübt - es gibt nichts zu vergleichen.`;
    } else {
      trend = k.veraenderung
        ? `${veraenderungSatz(k.veraenderung, groesse, vergleich)} ${SCHULJAHR_REGEL}, gemittelt über ${kinderWort(k.verglichen)}.`
        : `Noch kein Kind hat zwei Übungswochen mit mindestens ${MINDESTZEILEN} Zeilen im Schuljahr - es gibt nichts zu vergleichen.`;
    }
    return `${basis} ${trend}`;
  };

  const tempoWert = zahlen.tempo.wert === null ? null : Math.round(zahlen.tempo.wert);
  const trefferWert = zahlen.treffer.wert === null ? null : Math.round(zahlen.treffer.wert);

  const a = zahlen.aufgaben;
  /** ★ EN6a: der Satz zu den Wochenzielen, englisch. */
  const aufgabenSatzEn = !a.aktiv
    ? "No weekly goal is set in this class."
    : a.anteil === null
      ? `No goal week has been completed ${phraseEn} yet - the current week only counts once it is over.`
      : `${prozentAnzeige(a.anteil, "en")} of the weekly goal minutes set ${phraseEn} were done - ` +
        `all pupils added together, completed goal weeks only. ` +
        (a.veraenderung
          ? art === "monat"
            ? anteilSatzEn(a.veraenderung, vergleich)
            : `${anteilSatzEn(a.veraenderung, "the first goal weeks of the school year")} The first 4 goal weeks against the last 4 (with fewer than 5, the first against the last).`
          : art === "monat"
            ? "There was no completed goal week in the 4 weeks before - there is nothing to compare."
            : "Only one completed goal week so far - a comparison needs two.");
  const aufgabenSatzDe = !a.aktiv
    ? "In dieser Klasse ist kein Wochenziel gesetzt."
    : a.anteil === null
      ? `${gross(phrase)} ist noch keine Ziel-Woche abgeschlossen - die laufende Woche zählt erst, wenn sie vorbei ist.`
      : `${prozentAnzeige(a.anteil)} der geforderten Wochenziel-Minuten ${phrase} geschafft - ` +
        `alle Kinder zusammengezählt, nur abgeschlossene Ziel-Wochen. ` +
        (a.veraenderung
          ? art === "monat"
            ? anteilSatz(a.veraenderung, vergleich)
            : `${anteilSatz(a.veraenderung, "den ersten Ziel-Wochen des Schuljahres")} Die ersten 4 Ziel-Wochen gegen die letzten 4 (bei weniger als 5 die erste gegen die letzte).`
          : art === "monat"
            ? "In den 4 Wochen davor gab es keine abgeschlossene Ziel-Woche - es gibt nichts zu vergleichen."
            : "Erst eine abgeschlossene Ziel-Woche - für einen Vergleich braucht es zwei.");
  /** ★ E11a-3: derselbe Satz zu den Wochenzielen, französisch. */
  const aufgabenSatzFr = !a.aktiv
    ? "Aucun objectif de la semaine n'est défini dans cette classe."
    : a.anteil === null
      ? `Aucune semaine à objectif n'est encore terminée ${phraseFr} - la semaine en cours ne compte que lorsqu'elle est finie.`
      : `${prozentAnzeige(a.anteil, "fr")} des minutes d'objectif demandées ${phraseFr} ont été faites - ` +
        `tous les élèves additionnés, seulement les semaines à objectif terminées. ` +
        (a.veraenderung
          ? art === "monat"
            ? anteilSatzFr(a.veraenderung, vergleich)
            : `${anteilSatzFr(a.veraenderung, "les premières semaines à objectif de l'année scolaire")} Les 4 premières semaines à objectif comparées aux 4 dernières (avec moins de 5, la première comparée à la dernière).`
          : art === "monat"
            ? "Il n'y a pas eu de semaine à objectif terminée dans les 4 semaines précédentes - il n'y a rien à comparer."
            : "Une seule semaine à objectif terminée pour l'instant - une comparaison en demande deux.");
  /** ★ ES-O: derselbe Satz zu den Wochenzielen, spanisch. */
  const aufgabenSatzEs = !a.aktiv
    ? "En esta clase no hay ningún objetivo semanal fijado."
    : a.anteil === null
      ? `Todavía no ha terminado ninguna semana del objetivo ${phraseEs} - la semana en curso solo cuenta cuando ha terminado.`
      : `Se cumplió el ${prozentAnzeige(a.anteil, "es")} de los minutos que pedía el objetivo ${phraseEs} - ` +
        `todo el alumnado sumado, solo semanas del objetivo terminadas. ` +
        (a.veraenderung
          ? art === "monat"
            ? anteilSatzEs(a.veraenderung, vergleich)
            : `${anteilSatzEs(a.veraenderung, "las primeras semanas del objetivo del curso escolar")} Las 4 primeras semanas del objetivo frente a las 4 últimas (con menos de 5, la primera frente a la última).`
          : art === "monat"
            ? "En las 4 semanas anteriores no hubo ninguna semana del objetivo terminada - no hay nada que comparar."
            : "Por ahora solo hay una semana del objetivo terminada - para comparar hacen falta dos.");
  /** ★ O-IT: derselbe Satz zu den Wochenzielen, italienisch. */
  const aufgabenSatzIt = !a.aktiv
    ? "In questa classe non è impostato nessun obiettivo settimanale."
    : a.anteil === null
      ? `Ancora nessuna settimana con obiettivo conclusa ${phraseIt} - la settimana in corso conta solo quando è finita.`
      : `Minuti dell'obiettivo svolti ${phraseIt}: ${prozentAnzeige(a.anteil, "it")} di quelli richiesti - ` +
        `tutti gli alunni insieme, solo settimane con obiettivo concluse. ` +
        (a.veraenderung
          ? art === "monat"
            ? anteilSatzIt(a.veraenderung, vergleich)
            : `${anteilSatzIt(a.veraenderung, "le prime settimane con obiettivo dell'anno scolastico")} Le prime 4 settimane con obiettivo a confronto con le ultime 4 (con meno di 5, la prima a confronto con l'ultima).`
          : art === "monat"
            ? "Nelle 4 settimane precedenti non c'è stata nessuna settimana con obiettivo conclusa - non c'è niente da confrontare."
            : "Per ora c'è una sola settimana con obiettivo conclusa - per un confronto ne servono due.");
  /** ★ O-PL: derselbe Satz zu den Wochenzielen, polnisch. */
  const aufgabenSatzPl = !a.aktiv
    ? "W tej klasie nie ustawiono celu tygodniowego."
    : a.anteil === null
      ? `Nie zakończono jeszcze żadnego tygodnia z celem ${phrasePl} - bieżący tydzień liczy się dopiero po jego końcu.`
      : `Wykonano ${prozentAnzeige(a.anteil, "pl")} wymaganych minut celu ${phrasePl} - ` +
        `wszyscy uczniowie razem, tylko zakończone tygodnie z celem. ` +
        (a.veraenderung
          ? art === "monat"
            ? anteilSatzPl(a.veraenderung, vergleich)
            : `${anteilSatzPl(a.veraenderung, "w pierwszych tygodniach z celem w roku szkolnym")} Pierwsze 4 tygodnie z celem w porównaniu z ostatnimi 4 (przy mniej niż 5 pierwszy w porównaniu z ostatnim).`
          : art === "monat"
            ? "W 4 poprzednich tygodniach nie było zakończonego tygodnia z celem - nie ma czego porównać."
            : "Na razie jest tylko jeden zakończony tydzień z celem - do porównania potrzeba dwóch.");
  /** ★ O-TR: derselbe Satz zu den Wochenzielen, türkisch. */
  const aufgabenSatzTr = !a.aktiv
    ? "Bu sınıfta haftalık hedef belirlenmedi."
    : a.anteil === null
      ? `${phraseTrAnfang} henüz tamamlanmış hedefli hafta yok - bu hafta ancak bittiğinde sayılır.`
      : `${phraseTrAnfang} istenen haftalık hedef dakikalarından tamamlanan: ${prozentAnzeige(a.anteil, "tr")} - ` +
        `tüm öğrenciler birlikte, yalnızca tamamlanmış hedefli haftalar. ` +
        (a.veraenderung
          ? art === "monat"
            ? anteilSatzTr(a.veraenderung, vergleich)
            : `${anteilSatzTr(a.veraenderung, "öğretim yılının ilk hedefli haftaları")} İlk 4 hedefli hafta son 4 ile karşılaştırılır (5 haftadan az ise ilk hafta son hafta ile).`
          : art === "monat"
            ? "Önceki 4 haftada tamamlanmış hedefli hafta yoktu - karşılaştırılacak bir şey yok."
            : "Şimdilik yalnızca bir tamamlanmış hedefli hafta var - karşılaştırma için iki hafta gerekir.");
  /** ★ O-CS: derselbe Satz zu den Wochenzielen, tschechisch. */
  const aufgabenSatzCs = !a.aktiv
    ? "V této třídě není nastavený žádný týdenní cíl."
    : a.anteil === null
      ? `${phraseCsAnfang} zatím neskončil žádný týden s cílem - aktuální týden se počítá, až skončí.`
      : `${phraseCsAnfang} splněno ${prozentAnzeige(a.anteil, "cs")} požadovaných minut týdenního cíle - ` +
        `všichni žáci dohromady, jen ukončené týdny s cílem. ` +
        (a.veraenderung
          ? art === "monat"
            ? anteilSatzCs(a.veraenderung, vergleich)
            : `${anteilSatzCs(a.veraenderung, "v prvních týdnech s cílem ve školním roce")} Srovnávají se první 4 týdny s cílem s posledními 4 (při méně než 5 první s posledním).`
          : art === "monat"
            ? "V předchozích 4 týdnech neskončil žádný týden s cílem - není s čím srovnávat."
            : "Zatím skončil jen jeden týden s cílem - ke srovnání jsou potřeba dva.");
  const aufgabenSatz = neun
    ? aufgabenSatzNeun(neun, { a, art, phrase: phraseNeun, vergleich, prozent: prozentAnzeige(a.anteil, neun) })
    : cs
    ? aufgabenSatzCs
    : pl
    ? aufgabenSatzPl
    : tr
    ? aufgabenSatzTr
    : it
    ? aufgabenSatzIt
    : fr ? aufgabenSatzFr : es ? aufgabenSatzEs : en ? aufgabenSatzEn : aufgabenSatzDe;

  const auffaellig = datas.filter((d) => !d.fehler && d.stats.suspicion.score > 6).length;

  // ── Score-Leiste: die vier Töpfe und die Zahl der Lernenden im Hinweis ──
  const toepfe = verteilung(zahlen.scores.map((p) => p.wert));
  const topfText = neun
    ? topfTextNeun(neun, toepfe)
    : cs
    ? toepfe.map((n, i) => `${topfLabel(i, "cs")}: ${osobyCs(n)}`).join(" · ")
    : pl
    ? toepfe.map((n, i) => `${topfLabel(i, "pl")}: ${kinderPl(n)}`).join(" · ")
    : tr
    ? toepfe.map((n, i) => `${topfLabel(i, "tr")}: ${kinderTr(n)}`).join(" · ")
    : it
    ? toepfe
        .map(
          (n, i) =>
            `${topfLabel(i, "it")}: ${mehrzahl(n, "it", { one: (z) => `${z} persona`, other: (z) => `${z} persone` })}`,
        )
        .join(" · ")
    : es
    ? toepfe
        .map(
          (n, i) =>
            `${topfLabel(i, "es")}: ${mehrzahl(n, "es", { one: (z) => `${z} persona`, other: (z) => `${z} personas` })}`,
        )
        .join(" · ")
    : fr
    ? toepfe
        .map(
          (n, i) =>
            `${topfLabel(i, "fr")}: ${mehrzahl(n, "fr", { one: (z) => `${z} personne`, other: (z) => `${z} personnes` })}`,
        )
        .join(" · ")
    : en
      ? toepfe
          .map(
            (n, i) =>
              `${topfLabel(i, "en")}: ${mehrzahl(n, "en", { one: (z) => `${z} person`, other: (z) => `${z} people` })}`,
          )
          .join(" · ")
      : toepfe
          .map((n, i) => `${topfLabel(i)}: ${n} ${n === 1 ? "Person" : "Personen"}`)
          .join(" · ");
  const lernendeText = neun
    ? lernendeTextNeun(neun, {
        alle,
        mindZeichen: MIND_ZEICHEN_WERTUNG,
        ohneScore: zahlen.ohneScore,
        ohneUebung: zahlen.ohneUebung,
      })
    : cs
    ? `${osobyCs(alle)}` +
      (zahlen.ohneScore.length > 0
        ? `; bez skóre (méně než ${znakyCs(MIND_ZEICHEN_WERTUNG)}): ${zahlen.ohneScore.join(", ")}`
        : "") +
      (zahlen.ohneUebung.length > 0 ? `; bez cvičení: ${zahlen.ohneUebung.join(", ")}` : "") +
      "."
    : pl
    ? `${kinderPl(alle)}` +
      (zahlen.ohneScore.length > 0
        ? `; bez wyniku, bo poniżej ${MIND_ZEICHEN_WERTUNG} znaków: ${zahlen.ohneScore.join(", ")}`
        : "") +
      (zahlen.ohneUebung.length > 0 ? `; bez ćwiczeń: ${zahlen.ohneUebung.join(", ")}` : "") +
      "."
    : tr
    ? `${kinderTr(alle)}` +
      (zahlen.ohneScore.length > 0
        ? `; puan yok (${MIND_ZEICHEN_WERTUNG} karakterden az): ${zahlen.ohneScore.join(", ")}`
        : "") +
      (zahlen.ohneUebung.length > 0 ? `; alıştırma yapmayan: ${zahlen.ohneUebung.join(", ")}` : "") +
      "."
    : it
    ? `${kinderIt(alle)}` +
      (zahlen.ohneScore.length > 0
        ? `; senza punteggio perché sotto i ${MIND_ZEICHEN_WERTUNG} caratteri: ${zahlen.ohneScore.join(", ")}`
        : "") +
      (zahlen.ohneUebung.length > 0 ? `; nessun esercizio: ${zahlen.ohneUebung.join(", ")}` : "") +
      "."
    : es
    ? `${kinderEs(alle)}` +
      (zahlen.ohneScore.length > 0
        ? `; sin puntuación porque tienen menos de ${MIND_ZEICHEN_WERTUNG} caracteres: ${zahlen.ohneScore.join(", ")}`
        : "") +
      (zahlen.ohneUebung.length > 0 ? `; no practicaron: ${zahlen.ohneUebung.join(", ")}` : "") +
      "."
    : fr
    ? `${kinderFr(alle)}` +
      (zahlen.ohneScore.length > 0
        ? `; pas de score, car moins de ${MIND_ZEICHEN_WERTUNG} caractères : ${zahlen.ohneScore.join(", ")}`
        : "") +
      (zahlen.ohneUebung.length > 0 ? `; ne se sont pas entrainés : ${zahlen.ohneUebung.join(", ")}` : "") +
      "."
    : en
      ? `${kinderEn(alle)}` +
        (zahlen.ohneScore.length > 0
          ? `; no score because fewer than ${MIND_ZEICHEN_WERTUNG} characters: ${zahlen.ohneScore.join(", ")}`
          : "") +
        (zahlen.ohneUebung.length > 0 ? `; did not practise: ${zahlen.ohneUebung.join(", ")}` : "") +
        "."
      : `${alle} ${alle === 1 ? "Lernende Person" : "Lernende"}` +
        (zahlen.ohneScore.length > 0
          ? `; kein Score, weil unter ${MIND_ZEICHEN_WERTUNG} Zeichen: ${zahlen.ohneScore.join(", ")}`
          : "") +
        (zahlen.ohneUebung.length > 0 ? `; nicht geübt: ${zahlen.ohneUebung.join(", ")}` : "") +
        ".";
  const leisteHilfe = neun
    ? leisteHilfeNeun(neun, phraseNeun, topfText, lernendeText)
    : cs
    ? `${SCORE_ERKLAERUNG_CS_VYUCUJICI} Jeden bod za každou osobu; počítá se cvičení ${phraseCs} ` +
      `(rozložení: ${topfText}). ${lernendeText}`
    : pl
    ? `${SCORE_ERKLAERUNG_PL_NAUCZYCIELE} Jeden punkt na osobę, policzony z ćwiczeń ${phrasePl}. ` +
      `Rozkład: ${topfText}. ${lernendeText}`
    : tr
    ? `${SCORE_ERKLAERUNG_TR_OGRETMEN} Her öğrenci için bir nokta; ${phraseTr} yapılan alıştırmalardan hesaplanır. ` +
      `Dağılım: ${topfText}. ${lernendeText}`
    : it
    ? `${SCORE_ERKLAERUNG_IT_INSEGNANTE} Un punto per persona, calcolato dall'esercizio ${phraseIt}. ` +
      `Distribuzione: ${topfText}. ${lernendeText}`
    : es
    ? `${SCORE_ERKLAERUNG_USTED_ES} Un punto por estudiante, calculado a partir de la práctica ${phraseEs}. ` +
      `Reparto: ${topfText}. ${lernendeText}`
    : fr
    ? `${SCORE_ERKLAERUNG_VOUS_FR} Un point par élève, calculé à partir de l'exercice ${phraseFr}. ` +
      `Répartition : ${topfText}. ${lernendeText}`
    : en
      ? `${SCORE_ERKLAERUNG_SIE_EN} One dot per pupil, worked out from practice ${phraseEn}. ` +
        `Spread: ${topfText}. ${lernendeText}`
      : `${SCORE_ERKLAERUNG_SIE} Ein Punkt je Kind, gerechnet aus dem Üben ${phrase}. ` +
        `Verteilung: ${topfText}. ${lernendeText}`;

  const schalter = (aktiv: boolean) =>
    (aktiv ? "btn-primary" : "btn-secondary") + " btn-toggle btn-umriss whitespace-nowrap text-sm";

  return (
    <section
      aria-labelledby={titelId}
      data-klassenueberblick=""
      /*
        ★★ L1 (19.09.2026): ZWEI Spalten statt drei Zeilen - links Kopf,
        Kennzahlen und Punktleiste, rechts das Liniendiagramm, oben bündig mit
        der Kopfzeile (Johannes: „dann kann das Diagramm weiter hinauf").
        `flex-wrap`: bei wenig Platz rutscht das Diagramm unter die linke
        Spalte, in ganzer Breite.
      */
      className="relative flex flex-wrap items-start gap-x-8 gap-y-3 rounded-xl border border-hairline bg-surface-sunken px-3 py-2"
    >
      <div className="min-w-0 flex-1 basis-80 space-y-2">
      {/*
        ★ `items-center`: Überschrift, Umschalter und „Nachricht an die Klasse"
        auf einer Mittelachse (Johannes 11.09.: „rechts auf gleiche Höhe").
        ★★ L1 (19.09.2026): Der Knopf steht seither GLEICH HINTER dem
        Umschalter, getrennt durch eine senkrechte Haarlinie mit Abstand -
        nicht mehr ganz rechts (Johannes: „kann nach links neben Schuljahr -
        mit einem Trennstrich und Abstand").
      */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 id={titelId} className="m-0 text-sm font-semibold text-ink">
          {/* ★ K2 (19.09.2026): einzige neue Überschrift von K3 ohne Hinweis -
              der Name bleibt sichtbar UND die Überschrift der Sektion
              (`aria-labelledby`); die Erklärung hängt nur zusätzlich am
              `Hinweiskasten` (mausseitig, `aria-hidden`), siehe `Zeigerhinweis.tsx`. */}
          <Hinweisflaeche hilfe={u.titelHilfe} ausrichtung="links">
            {u.titel}
          </Hinweisflaeche>
        </h3>
        {film && <FilmKnopf nr={film} />}
        <div
          ref={umschalterRef}
          role="group"
          aria-label={u.zeitraumGruppe}
          className="flex flex-wrap gap-1"
        >
          <Tipp ausrichtung="links" text={u.monatTipp(monatBereich)}>
            {(hinweisId) => (
              <button
                type="button"
                aria-pressed={art === "monat"}
                // ⚠️ Der Tabellenkopf darunter hat ebenfalls „Monat" und
                // „Schuljahr" - der Zusatz trennt sie für die Sprachausgabe.
                // Das sichtbare Wort steht vorn (WCAG 2.5.3).
                aria-label={u.monatName}
                aria-describedby={hinweisId}
                className={schalter(art === "monat")}
                onClick={() => setArt("monat")}
              >
                {u.monat}
              </button>
            )}
          </Tipp>
          <Tipp
            ausrichtung="links"
            text={
              // ⚠️ Kein Satzpunkt direkt hinter dem Datum - „01.08.." (Duden: der
              // Abkürzungspunkt verschluckt den Schlusspunkt).
              u.schuljahrTipp(sj.label, tagMonat(sj.vonMs, sprache))
            }
          >
            {(hinweisId) => (
              <button
                type="button"
                aria-pressed={art === "schuljahr"}
                aria-label={u.schuljahrName}
                aria-describedby={hinweisId}
                className={schalter(art === "schuljahr")}
                onClick={() => setArt("schuljahr")}
              >
                {u.schuljahr}
              </button>
            )}
          </Tipp>
        </div>
        {kopfRechts && (
          <>
            {/* ★ L1: der Trennstrich - eine Haarlinie, nur zum Sehen. */}
            <span
              aria-hidden="true"
              data-trennstrich=""
              className={"mx-1 h-6 w-px self-center bg-hairline" + (strichSichtbar ? "" : " invisible")}
            />
            <div ref={knopfRef}>{kopfRechts}</div>
          </>
        )}
      </div>

      {/*
        ★ EINE Zeile Kennzahlen - der ganze Satz steckt im Hinweis der Zahl.
        Farbe trägt keine Aussage: der Pfeil unterscheidet an der Richtung,
        nicht am Farbton ([[feedback_nie_gegen_das_kind]], WCAG 1.4.1).
      */}
      <dl className="m-0 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm">
        <Kennziffer
          name={u.anschlaege}
          wert={tempoWert === null ? "-" : u.schnitt(tempoWert)}
          trend={tempoWert === null ? null : trendKurz(zahlen.tempo.veraenderung, "tempo", sprache)}
          satz={kennSatz(
            zahlen.tempo,
            "tempo",
            neun
              ? `${tempoWert ?? 0} ${KETTEN_NEUN[neun].einheit("tempo", tempoWert ?? 0)}`
              : cs
              ? mehrzahl(tempoWert ?? 0, "cs", {
                  one: (z) => `${z} úhoz za minutu`,
                  few: (z) => `${z} úhozy za minutu`,
                  many: (z) => `${z} úhozu za minutu`,
                  other: (z) => `${z} úhozů za minutu`,
                })
              : pl
              ? mehrzahl(tempoWert ?? 0, "pl", {
                  one: (z) => `${z} uderzenie na minutę`,
                  few: (z) => `${z} uderzenia na minutę`,
                  many: (z) => `${z} uderzeń na minutę`,
                  other: (z) => `${z} uderzenia na minutę`,
                })
              : tr
              ? `dakikada ${tempoWert} vuruş`
              : it
              ? `${tempoWert} battute al minuto`
              : fr
              ? `${tempoWert} frappes par minute`
              : es
                ? `${tempoWert} pulsaciones por minuto`
                : en
                ? `${tempoWert} keystrokes per minute`
                : `${tempoWert} Anschläge je Minute`,
          )}
        />
        <Kennziffer
          name={u.treffer}
          wert={trefferWert === null ? "-" : u.schnittProzent(trefferWert)}
          trend={
            trefferWert === null ? null : trendKurz(zahlen.treffer.veraenderung, "treffer", sprache)
          }
          satz={kennSatz(
            zahlen.treffer,
            "treffer",
            neun
              ? UEBERBLICK_SAETZE_NEUN[neun].treffer(prozentAnzeige((trefferWert ?? 0) / 100, neun))
              : cs
              ? `přesnost ${trefferWert}\u00A0%`
              : pl
              ? `${trefferWert}% dokładności`
              : tr
              ? `%${trefferWert} doğruluk`
              : it
              ? `${trefferWert}% di precisione`
              : fr
              ? `${trefferWert} % de précision`
              : es
                ? `${trefferWert} % de precisión`
                : en
                ? `${trefferWert}% accuracy`
                : `${trefferWert} % Treffsicherheit`,
          )}
        />
        <Kennziffer
          name={u.wochenaufgaben}
          wert={a.aktiv ? prozentAnzeige(a.anteil, sprache) : "-"}
          trend={trendKurz(a.veraenderung, "treffer", sprache)}
          satz={aufgabenSatz}
        />
        {auffaellig > 0 && (
          <Kennziffer
            name={u.eigenstaendigkeit}
            wert={u.hinweise(auffaellig)}
            trend={null}
            ausrichtung="rechts"
            satz={u.hinweiseSatz(auffaellig)}
          />
        )}
      </dl>

      {/*
        Die Leiste steht seit L1 (19.09.2026) in der linken Spalte, unter den
        Kennzahlen; die Linie rechts daneben - sie geht nicht über die ganze
        Seite (Johannes), höchstens 28rem.
      */}
        {zahlen.scores.length > 0 && (
          <div className="min-w-[14rem]">
            <Punktleiste
              titel={u.scoreLeiste}
              hilfe={leisteHilfe}
              personen={zahlen.scores}
              einheit={u.punkte}
              einheitGesprochen={u.punkteGesprochen}
              /*
                ★★ Die vier Töpfe und die Zahl der Lernenden stehen seit K3
                nicht mehr als eigene Zeilen da, sondern im Hinweis der
                Überschrift - und hier, unsichtbar, für die Sprachausgabe: Wer
                die Leiste nicht sehen kann, bekäme den Überblick („wie steht
                die Klasse") sonst erst nach so vielen Pfeiltasten-Anschlägen,
                wie die Klasse Köpfe hat (Johannes 01.09.: gleichwertig).
              */
              zusammenfassung={
                <div className="sr-only">
                  <TopfZahlen toepfe={toepfe} gesamt={zahlen.scores.length} />
                  <span>{lernendeText}</span>
                </div>
              }
            />
          </div>
        )}
      </div>
      {verlauf.length > 0 && (
        <div className="w-full max-w-[28rem] shrink-0 lg:w-[28rem]">
          <ScoreVerlauf
            wochen={verlauf}
            titel={u.verlaufTitel}
            hilfe={u.verlaufHilfe}
            schuljahrLabel={sj.label}
          />
        </div>
      )}
    </section>
  );
}
