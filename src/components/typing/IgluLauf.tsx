/**
 * Das IGLU-RATEN - Testerin Galgenmännchen (22.10.2026), als Polar-Spiel gebaut.
 *
 * Ein Wort ist versteckt, das Kind tippt Buchstaben. Ein Treffer deckt sie im
 * Wort auf; ein Buchstabe, der nicht im Wort steckt, legt einen Schneeblock am
 * Iglu des Pinguins (acht Blöcke). Steht der Iglu, nennt die App das Wort und
 * es geht weiter - ein „Verloren" gibt es nicht (siehe `iglu.ts`).
 *
 * ★★★ Die Grafik trägt nie die Aufgabe: Der Iglu ist `aria-hidden` und eine
 * Dreingabe für Sehende. Alles, was zählt, steht in Text - im Feld-Label (die
 * Braillezeile zeigt es unmittelbar vor dem Feld: das Wort mit Lücken `_ a _`),
 * in der Ansage und in der Statuszeile.
 *
 * ★ Die Statuszeile ist die einzige Live-Region und meldet nur das Ergebnis
 * eines Buchstabens (ein kurzer Satz) - nicht die ganze Zeile bei jedem
 * Anschlag. Dazu spricht die App mit ihrer eigenen Stimme (`speakUi` prüft den
 * Vorlesen-Schalter; „Ton aus" ist der Normalfall, dann bleiben Label, Status
 * und Liste die Antwort).
 *
 * Eingabe: ein Buchstabe, sofort gewertet, kein Bestätigen. Enter bei leerem
 * Feld sagt den Stand noch einmal; nach dem Wortende geht Enter zum nächsten
 * Wort. Fokus-Führung (R1-R6): nach jeder Eingabe ausdrücklich ins Feld
 * (`setTimeout(0)`), ESC ebenfalls, nichts ist je `disabled`.
 */
import { feinesLangAttribut } from "@/lib/typing/schreibweise";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  notePracticeActivity,
  speakUi,
  takePracticeDelta,
  type Lang,
  type TaskEvent,
} from "@/lib/typing";
import {
  IGLU_BLOECKE,
  IGLU_WOERTER,
  igluBuchstabe,
  igluFeldbeschriftung,
  igluGeloest,
  igluGeschenkt,
  igluMaske,
  rateBuchstabe,
  waehleIgluwort,
  type IgluUrteil,
} from "@/lib/typing/uebungsformen/iglu";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import { ausTeilen, inTeile, inhalt, type TextTeil } from "@/lib/typing/uebungsformen/bedienung";
import { formName } from "@/lib/typing/uebungsformen/namen";
import { texte } from "@/lib/bedienSprache";
import { laufweiteFeld, laufweiteText, type ZeichenabstandFaktor } from "@/lib/typing/zeichenabstand";
import { playSuccessSound } from "@/lib/typing/sound";
import { TeileText, sprechStuecke, useNacheinanderSprechen, useWortspielSprache } from "./wortspielSprache";
import { CviAbdunkeln } from "./CviAbdunkeln";

/** Die Texte des Iglu-Ratens in allen Bedienungssprachen. Zahlen stehen hinter Doppelpunkt (keine Mehrzahlformen). */
export const IGLU_TEXTE = texte({
  de: {
    wortVon: (nr: number, gesamt: number) => `Wort ${nr} von ${gesamt}`,
    blockVon: (n: number, max: number) => `Block ${n} von ${max}`,
    buchstabenImWort: (n: number) => `Buchstaben im Wort: ${n}`,
    luecke: "Lücke",
    treffer: (b: string) => `Ja, ${b} ist dabei.`,
    daneben: (b: string, n: number, max: number) => `Kein ${b} im Wort. Schneeblock ${n} von ${max}.`,
    schon: (b: string) => `${b} hattest du schon.`,
    keinBuchstabe: "Das ist kein Buchstabe - tipp einen Buchstaben.",
    offen: (offen: number) => `Offene Lücken: ${offen}.`,
    geloest: (wort: string) => `Geschafft! Das Wort heißt ${wort}.`,
    igluFertig: (wort: string) => `Der Iglu steht. Das Wort war ${wort}.`,
    weiter: "Enter für das nächste Wort.",
    schonGetippt: "Schon getippt:",
    dein: "Dein Buchstabe",
    standSagen: "Stand sagen",
    naechstes: "Nächstes Wort",
    fertig: "Fertig",
    zurueck: "Zurück zum Üben",
  },
  en: {
    wortVon: (nr: number, gesamt: number) => `Word ${nr} of ${gesamt}`,
    blockVon: (n: number, max: number) => `Block ${n} of ${max}`,
    buchstabenImWort: (n: number) => `Letters in the word: ${n}`,
    luecke: "gap",
    treffer: (b: string) => `Yes, there's a ${b}.`,
    daneben: (b: string, n: number, max: number) => `No ${b} in the word. Snow block ${n} of ${max}.`,
    schon: (b: string) => `You've already tried ${b}.`,
    keinBuchstabe: "That's not a letter - type a letter.",
    offen: (offen: number) => `Open gaps: ${offen}.`,
    geloest: (wort: string) => `Well done! The word is ${wort}.`,
    igluFertig: (wort: string) => `The igloo is built. The word was ${wort}.`,
    weiter: "Press Enter for the next word.",
    schonGetippt: "Already typed:",
    dein: "Your letter",
    standSagen: "Say where we are",
    naechstes: "Next word",
    fertig: "Done",
    zurueck: "Back to practice",
  },
  fr: {
    wortVon: (nr: number, gesamt: number) => `Mot ${nr} sur ${gesamt}`,
    blockVon: (n: number, max: number) => `Bloc ${n} sur ${max}`,
    buchstabenImWort: (n: number) => `Lettres dans le mot : ${n}`,
    luecke: "trou",
    treffer: (b: string) => `Oui, il y a un ${b}.`,
    daneben: (b: string, n: number, max: number) => `Pas de ${b} dans le mot. Bloc de neige ${n} sur ${max}.`,
    schon: (b: string) => `Tu as déjà essayé ${b}.`,
    keinBuchstabe: "Ce n'est pas une lettre - tape une lettre.",
    offen: (offen: number) => `Trous restants : ${offen}.`,
    geloest: (wort: string) => `Bravo ! Le mot est ${wort}.`,
    igluFertig: (wort: string) => `L'igloo est construit. Le mot était ${wort}.`,
    weiter: "Appuie sur Entrée pour le mot suivant.",
    schonGetippt: "Déjà tapées :",
    dein: "Ta lettre",
    standSagen: "Dire où on en est",
    naechstes: "Mot suivant",
    fertig: "Terminé",
    zurueck: "Retour à l'exercice",
  },
  es: {
    wortVon: (nr: number, gesamt: number) => `Palabra ${nr} de ${gesamt}`,
    blockVon: (n: number, max: number) => `Bloque ${n} de ${max}`,
    buchstabenImWort: (n: number) => `Letras de la palabra: ${n}`,
    luecke: "hueco",
    treffer: (b: string) => `Sí, hay una ${b}.`,
    daneben: (b: string, n: number, max: number) => `No hay ${b} en la palabra. Bloque de nieve ${n} de ${max}.`,
    schon: (b: string) => `Ya habías probado ${b}.`,
    keinBuchstabe: "Eso no es una letra - escribe una letra.",
    offen: (offen: number) => `Huecos que faltan: ${offen}.`,
    geloest: (wort: string) => `¡Muy bien! La palabra es ${wort}.`,
    igluFertig: (wort: string) => `El iglú está construido. La palabra era ${wort}.`,
    weiter: "Pulsa Intro para la palabra siguiente.",
    schonGetippt: "Ya escritas:",
    dein: "Tu letra",
    standSagen: "Decir cómo vamos",
    naechstes: "Palabra siguiente",
    fertig: "Terminado",
    zurueck: "Volver a practicar",
  },
  it: {
    wortVon: (nr: number, gesamt: number) => `Parola ${nr} di ${gesamt}`,
    blockVon: (n: number, max: number) => `Blocco ${n} di ${max}`,
    buchstabenImWort: (n: number) => `Lettere nella parola: ${n}`,
    luecke: "spazio vuoto",
    treffer: (b: string) => `Sì, c'è ${b}.`,
    daneben: (b: string, n: number, max: number) => `Nessuna ${b} nella parola. Blocco di neve ${n} di ${max}.`,
    schon: (b: string) => `Hai già provato ${b}.`,
    keinBuchstabe: "Non è una lettera - scrivi una lettera.",
    offen: (offen: number) => `Spazi vuoti rimasti: ${offen}.`,
    geloest: (wort: string) => `Bravo! La parola è ${wort}.`,
    igluFertig: (wort: string) => `L'igloo è costruito. La parola era ${wort}.`,
    weiter: "Premi Invio per la parola successiva.",
    schonGetippt: "Già scritte:",
    dein: "La tua lettera",
    standSagen: "Dire a che punto siamo",
    naechstes: "Parola successiva",
    fertig: "Fatto",
    zurueck: "Torna all'esercizio",
  },
  pl: {
    wortVon: (nr: number, gesamt: number) => `Słowo: ${nr} z ${gesamt}`,
    blockVon: (n: number, max: number) => `Blok: ${n} z ${max}`,
    buchstabenImWort: (n: number) => `Liczba liter w słowie: ${n}`,
    luecke: "luka",
    treffer: (b: string) => `Tak, jest ${b}.`,
    daneben: (b: string, n: number, max: number) => `Nie ma ${b} w słowie. Blok śniegu: ${n} z ${max}.`,
    schon: (b: string) => `${b} już było.`,
    keinBuchstabe: "To nie jest litera - napisz literę.",
    offen: (offen: number) => `Pozostałe luki: ${offen}.`,
    geloest: (wort: string) => `Brawo! To słowo: ${wort}.`,
    igluFertig: (wort: string) => `Igloo stoi. To było słowo: ${wort}.`,
    weiter: "Naciśnij Enter, żeby przejść do następnego słowa.",
    schonGetippt: "Już napisane:",
    dein: "Twoja litera",
    standSagen: "Powiedz, jak stoimy",
    naechstes: "Następne słowo",
    fertig: "Gotowe",
    zurueck: "Wróć do ćwiczeń",
  },
  tr: {
    wortVon: (nr: number, gesamt: number) => `Kelime: ${nr} / ${gesamt}`,
    blockVon: (n: number, max: number) => `Blok: ${n} / ${max}`,
    buchstabenImWort: (n: number) => `Kelimedeki harf sayısı: ${n}`,
    luecke: "boşluk",
    treffer: (b: string) => `Evet, ${b} var.`,
    daneben: (b: string, n: number, max: number) => `Kelimede ${b} yok. Kar bloğu: ${n} / ${max}.`,
    schon: (b: string) => `${b} harfini zaten denedin.`,
    keinBuchstabe: "Bu bir harf değil - bir harf yaz.",
    offen: (offen: number) => `Kalan boşluk: ${offen}.`,
    geloest: (wort: string) => `Aferin! Kelime: ${wort}.`,
    igluFertig: (wort: string) => `İglu tamam. Kelime: ${wort}.`,
    weiter: "Sonraki kelime için Enter tuşuna bas.",
    schonGetippt: "Yazılanlar:",
    dein: "Harfin",
    standSagen: "Durumu söyle",
    naechstes: "Sonraki kelime",
    fertig: "Bitti",
    zurueck: "Alıştırmaya dön",
  },
  cs: {
    wortVon: (nr: number, gesamt: number) => `Slovo: ${nr}/${gesamt}`,
    blockVon: (n: number, max: number) => `Blok: ${n}/${max}`,
    buchstabenImWort: (n: number) => `Počet písmen ve slově: ${n}`,
    luecke: "mezera",
    treffer: (b: string) => `Ano, ${b} tam je.`,
    daneben: (b: string, n: number, max: number) => `Ve slově není ${b}. Sněhový blok: ${n}/${max}.`,
    schon: (b: string) => `${b} už bylo.`,
    keinBuchstabe: "To není písmeno - napiš písmeno.",
    offen: (offen: number) => `Zbývající mezery: ${offen}.`,
    geloest: (wort: string) => `Výborně! Slovo je ${wort}.`,
    igluFertig: (wort: string) => `Iglú stojí. Slovo bylo ${wort}.`,
    weiter: "Stiskni Enter pro další slovo.",
    schonGetippt: "Už napsáno:",
    dein: "Tvoje písmeno",
    standSagen: "Řekni, jak jsme na tom",
    naechstes: "Další slovo",
    fertig: "Hotovo",
    zurueck: "Zpět ke cvičení",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      wortVon: (nr: number, gesamt: number) => `Дума ${nr}/${gesamt}`,
      blockVon: (n: number, max: number) => `Блок ${n}/${max}`,
      buchstabenImWort: (n: number) => `Букви в думата: ${n}`,
      luecke: "празно",
      treffer: (b: string) => `Да, има ${b}.`,
      // Zahl nicht vor dem Satzpunkt am Ende (Ordnungszahl-Falle).
      daneben: (b: string, n: number, max: number) => `Няма ${b} в думата. Снежен блок ${n} от ${max} е на мястото си.`,
      schon: (b: string) => `Вече опита ${b}.`,
      keinBuchstabe: "Това не е буква - напиши буква.",
      offen: (offen: number) => `Остават празни места: ${offen}`,
      geloest: (wort: string) => `Браво! Думата е ${wort}.`,
      igluFertig: (wort: string) => `Иглуто е готово. Думата беше ${wort}.`,
      weiter: "Натисни Enter за следващата дума.",
      schonGetippt: "Вече написани:",
      dein: "Твоята буква",
      standSagen: "Кажи докъде сме",
      naechstes: "Следваща дума",
      fertig: "Готово",
      zurueck: "Обратно към упражненията",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      wortVon: (nr: number, gesamt: number) => `Λέξη ${nr} από ${gesamt}`,
      blockVon: (n: number, max: number) => `Χιονότουβλο ${n} από ${max}`,
      buchstabenImWort: (n: number) => `Γράμματα στη λέξη: ${n}`,
      // nicht „κενό" - das ist für Kinder das Leerzeichen (Glossar §2.2).
      luecke: "λείπει",
      treffer: (b: string) => `Ναι, το ${b} υπάρχει στη λέξη.`,
      daneben: (b: string, n: number, max: number) => `Δεν υπάρχει ${b} στη λέξη. Χιονότουβλο ${n} από ${max}.`,
      schon: (b: string) => `Το ${b} το δοκίμασες ήδη.`,
      keinBuchstabe: "Αυτό δεν είναι γράμμα - γράψε ένα γράμμα.",
      offen: (offen: number) => `Γράμματα που λείπουν: ${offen}.`,
      geloest: (wort: string) => `Τα κατάφερες! Η λέξη είναι: ${wort}.`,
      igluFertig: (wort: string) => `Το ιγκλού είναι έτοιμο. Η λέξη ήταν: ${wort}.`,
      weiter: "Πάτησε Enter για την επόμενη λέξη.",
      schonGetippt: "Ήδη γραμμένα:",
      dein: "Το γράμμα σου",
      standSagen: "Πού βρισκόμαστε",
      naechstes: "Επόμενη λέξη",
      fertig: "Τέλος",
      zurueck: "Πίσω στην εξάσκηση",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      wortVon: (nr: number, gesamt: number) => `Szó: ${nr}/${gesamt}`,
      blockVon: (n: number, max: number) => `Hótömb: ${n}/${max}`,
      buchstabenImWort: (n: number) => `Betűk a szóban: ${n}`,
      luecke: "üres hely",
      treffer: (b: string) => `Igen, van benne: ${b}.`,
      daneben: (b: string, n: number, max: number) => `Nincs a szóban: ${b}. Hótömb: ${n}/${max}`,
      schon: (b: string) => `Ezt már próbáltad: ${b}.`,
      keinBuchstabe: "Ez nem betű - írj be egy betűt.",
      offen: (offen: number) => `Üres helyek: ${offen}`,
      geloest: (wort: string) => `Sikerült! A szó: ${wort}.`,
      igluFertig: (wort: string) => `Kész az iglu. A szó ez volt: ${wort}.`,
      weiter: "Nyomd meg az Enter billentyűt a következő szóhoz.",
      schonGetippt: "Már beírtad:",
      dein: "A betűd",
      standSagen: "Állás bemondása",
      naechstes: "Következő szó",
      fertig: "Kész",
      zurueck: "Vissza a gyakorláshoz",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      wortVon: (nr: number, gesamt: number) => `Woord ${nr} van ${gesamt}`,
      blockVon: (n: number, max: number) => `Blok ${n} van ${max}`,
      buchstabenImWort: (n: number) => `Letters in het woord: ${n}`,
      luecke: "leeg",
      treffer: (b: string) => `Ja, er zit een ${b} in.`,
      daneben: (b: string, n: number, max: number) => `Geen ${b} in het woord. Sneeuwblok ${n} van ${max}.`,
      schon: (b: string) => `${b} heb je al geprobeerd.`,
      keinBuchstabe: "Dat is geen letter - typ een letter.",
      offen: (offen: number) => `Open plekken: ${offen}.`,
      geloest: (wort: string) => `Gelukt! Het woord is ${wort}.`,
      igluFertig: (wort: string) => `De iglo staat. Het woord was ${wort}.`,
      weiter: "Druk op Enter voor het volgende woord.",
      schonGetippt: "Al getypt:",
      dein: "Jouw letter",
      standSagen: "Stand voorlezen",
      naechstes: "Volgend woord",
      fertig: "Klaar",
      zurueck: "Terug naar het oefenen",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      wortVon: (nr: number, gesamt: number) => `Palavra ${nr} de ${gesamt}`,
      blockVon: (n: number, max: number) => `Bloco ${n} de ${max}`,
      buchstabenImWort: (n: number) => `Letras na palavra: ${n}`,
      luecke: "lacuna",
      treffer: (b: string) => `Sim, a palavra tem ${b}.`,
      daneben: (b: string, n: number, max: number) => `A palavra não tem ${b}. Bloco de neve ${n} de ${max}.`,
      schon: (b: string) => `Já tentaste ${b}.`,
      keinBuchstabe: "Isso não é uma letra - escreve uma letra.",
      offen: (offen: number) => `Lacunas por preencher: ${offen}.`,
      geloest: (wort: string) => `Conseguiste! A palavra é ${wort}.`,
      igluFertig: (wort: string) => `O iglu está construído. A palavra era ${wort}.`,
      weiter: "Prime Enter para a palavra seguinte.",
      schonGetippt: "Já escritas:",
      dein: "A tua letra",
      standSagen: "Dizer o ponto da situação",
      naechstes: "Palavra seguinte",
      fertig: "Concluído",
      zurueck: "Voltar a praticar",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      wortVon: (nr: number, gesamt: number) => `Palavra ${nr} de ${gesamt}`,
      blockVon: (n: number, max: number) => `Bloco ${n} de ${max}`,
      buchstabenImWort: (n: number) => `Letras na palavra: ${n}`,
      luecke: "lacuna",
      treffer: (b: string) => `Sim, tem ${b}.`,
      daneben: (b: string, n: number, max: number) => `Não tem ${b} na palavra. Bloco de neve ${n} de ${max}.`,
      schon: (b: string) => `Você já tentou ${b}.`,
      keinBuchstabe: "Isso não é uma letra - digite uma letra.",
      offen: (offen: number) => `Lacunas abertas: ${offen}.`,
      geloest: (wort: string) => `Muito bem! A palavra é ${wort}.`,
      igluFertig: (wort: string) => `O iglu está construído. A palavra era ${wort}.`,
      weiter: "Pressione Enter para a próxima palavra.",
      schonGetippt: "Já digitadas:",
      dein: "Sua letra",
      standSagen: "Dizer a situação",
      naechstes: "Próxima palavra",
      fertig: "Concluir",
      zurueck: "Voltar a praticar",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      wortVon: (nr: number, gesamt: number) => `Cuvântul ${nr}/${gesamt}`,
      blockVon: (n: number, max: number) => `Blocul ${n}/${max}`,
      buchstabenImWort: (n: number) => `Litere în cuvânt: ${n}`,
      luecke: "gol",
      treffer: (b: string) => `Da, ${b} apare în cuvânt.`,
      // Live-Zeile endet nicht auf „Zahl." (Ordnungszahl-Falle) - darum ohne Punkt.
      daneben: (b: string, n: number, max: number) => `${b} nu apare în cuvânt. Blocuri de zăpadă: ${n}/${max}`,
      schon: (b: string) => `Ai încercat deja ${b}.`,
      keinBuchstabe: "Aceasta nu este o literă - scrie o literă.",
      offen: (offen: number) => `Goluri rămase: ${offen}`,
      geloest: (wort: string) => `Ai reușit! Cuvântul este ${wort}.`,
      igluFertig: (wort: string) => `Igluul este gata. Cuvântul era ${wort}.`,
      weiter: "Apasă tasta Enter pentru cuvântul următor.",
      schonGetippt: "Deja scrise:",
      dein: "Litera ta",
      standSagen: "Unde am ajuns",
      naechstes: "Cuvântul următor",
      fertig: "Gata",
      zurueck: "Înapoi la exersare",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      wortVon: (nr: number, gesamt: number) => `Ord ${nr}/${gesamt}`,
      blockVon: (n: number, max: number) => `Block ${n}/${max}`,
      buchstabenImWort: (n: number) => `Bokstäver i ordet: ${n}`,
      luecke: "lucka",
      treffer: (b: string) => `Ja, ${b} finns med.`,
      daneben: (b: string, n: number, max: number) => `Inget ${b} i ordet. Snöblock ${n} av ${max}.`,
      schon: (b: string) => `${b} har du redan provat.`,
      keinBuchstabe: "Det är ingen bokstav - skriv en bokstav.",
      offen: (offen: number) => `Öppna luckor: ${offen}.`,
      geloest: (wort: string) => `Bra jobbat! Ordet är ${wort}.`,
      igluFertig: (wort: string) => `Igloon är byggd. Ordet var ${wort}.`,
      weiter: "Tryck på Retur för nästa ord.",
      schonGetippt: "Redan skrivet:",
      dein: "Din bokstav",
      standSagen: "Läs upp läget",
      naechstes: "Nästa ord",
      fertig: "Klar",
      zurueck: "Tillbaka till övningen",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      wortVon: (nr: number, gesamt: number) => `Слово ${nr}/${gesamt}`,
      blockVon: (n: number, max: number) => `Блок ${n}/${max}`,
      buchstabenImWort: (n: number) => `Літер у слові: ${n}`,
      // „пропуск" klingt nach Leerzeichen (Glossar §2.2) - darum „порожньо".
      luecke: "порожньо",
      treffer: (b: string) => `Так, літера ${b} є.`,
      // Zahl nicht vor dem Satzpunkt am Ende (Ordnungszahl-Falle).
      daneben: (b: string, n: number, max: number) => `Літери ${b} у слові немає. Снігові блоки: ${n}/${max}`,
      schon: (b: string) => `Літера ${b} вже була.`,
      keinBuchstabe: "Це не літера - надрукуй літеру.",
      offen: (offen: number) => `Порожні місця: ${offen}`,
      geloest: (wort: string) => `Чудово! Слово: ${wort}.`,
      igluFertig: (wort: string) => `Іглу готове. Слово: ${wort}.`,
      weiter: "Натисни Enter - наступне слово.",
      schonGetippt: "Уже надруковано:",
      dein: "Твоя літера",
      standSagen: "Промовити стан",
      naechstes: "Наступне слово",
      fertig: "Готово",
      zurueck: "Назад до тренування",
    },
});

/** Die acht Blöcke des Iglus (4 + 3 + 1), von unten nach oben - Position im SVG (viewBox 88 x 62). */
const BLOCK_ZELLEN: ReadonlyArray<{ x: number; y: number }> = [
  { x: 0, y: 44 }, { x: 22, y: 44 }, { x: 44, y: 44 }, { x: 66, y: 44 },
  { x: 11, y: 26 }, { x: 33, y: 26 }, { x: 55, y: 26 },
  { x: 33, y: 8 },
];

/** Der Iglu als Dreingabe für Sehende - gelegte Blöcke gefüllt, kommende als Umriss. */
function IgluBild({ bloecke }: { bloecke: number }) {
  return (
    <svg viewBox="-2 6 92 56" className="h-24 w-32 text-ink" aria-hidden="true" focusable="false">
      {BLOCK_ZELLEN.map((z, i) => (
        <rect
          key={i}
          x={z.x}
          y={z.y}
          width={20}
          height={16}
          rx={5}
          strokeWidth={2}
          className={i < bloecke ? "fill-sky-100 stroke-sky-700" : "fill-none stroke-current [stroke-dasharray:5_4]"}
        />
      ))}
    </svg>
  );
}

type Phase = "raten" | "geloest" | "fertig";

export function IgluLauf({
  ctx,
  ankuendigung,
  contextId,
  onAufgabeFertig,
  lang = "de",
  zeichenabstand = 1,
  onFertig,
  onAbbruch,
}: {
  ctx: FormKontext;
  ankuendigung: string;
  /** Kennung für die Telemetrie - wie `contextId` in der Übungssitzung. */
  contextId: string;
  /** Jeder getippte Buchstabe zählt als Aufgabe - sonst ginge Übezeit verloren (siehe Buchstabensalat). */
  onAufgabeFertig?: (e: Omit<TaskEvent, "ts">) => void;
  lang?: Lang;
  zeichenabstand?: ZeichenabstandFaktor;
  onFertig: () => void;
  onAbbruch: () => void;
}) {
  const [gehabt, setGehabt] = useState<string[]>([]);
  const [wort, setWort] = useState<string | null>(() => waehleIgluwort(ctx, []));
  const [nr, setNr] = useState(1);
  const startGeraten = useMemo(() => (wort ? igluGeschenkt(wort, ctx) : []), [wort, ctx]);
  const [geraten, setGeraten] = useState<string[]>(startGeraten);
  const [bloecke, setBloecke] = useState(0);
  const [phase, setPhase] = useState<Phase>("raten");
  // Der Spielstand zusätzlich synchron: Zwei Anschläge dicht hintereinander (oder ein eingefügter
  // Block) dürfen nicht auf dem Stand vor dem ersten rechnen.
  const stand = useRef({ geraten: startGeraten, bloecke: 0, phase: "raten" as Phase });
  const setzeStand = useCallback((g: string[], b: number, p: Phase) => {
    stand.current = { geraten: g, bloecke: b, phase: p };
    setGeraten(g);
    setBloecke(b);
    setPhase(p);
  }, []);
  const [status, setStatus] = useState<TextTeil[]>([]);
  const feldRef = useRef<HTMLInputElement>(null);
  const karteRef = useRef<HTMLDivElement>(null);
  const feldId = useId();
  const beginnRef = useRef(Date.now());

  const { ui, gemischt, bereichAktiv } = useWortspielSprache(lang);
  const t = IGLU_TEXTE[ui];
  const sprichTeile = useNacheinanderSprechen();
  const inhaltLang = bereichAktiv ? feinesLangAttribut(lang) : undefined;

  const insFeld = useCallback(() => {
    window.setTimeout(() => feldRef.current?.focus(), 0);
  }, []);

  const sage = useCallback(
    (teile: TextTeil[]) => {
      if (gemischt || teile.some((x) => x.pause)) sprichTeile(sprechStuecke(teile, ui, lang));
      else speakUi(ausTeilen(teile));
    },
    [gemischt, sprichTeile, ui, lang],
  );

  /** Das Wort mit Lücken zum Sprechen: erratene Buchstaben mit Komma, Lücken als Wort. */
  const maskeSprechen = useCallback(
    (w: string, g: string[]) =>
      igluMaske(w, g, lang)
        .map((c) => (c === null ? t.luecke : inhalt(c)))
        .join(", ") + ".",
    [lang, t],
  );

  /**
   * Das Wort mit Lücken, dann die Zahl der offenen Lücken - als eigene Äußerung, damit zwischen dem
   * letzten Buchstaben und „Offene Lücken" eine Pause liegt (Testerin, 25.10.2026: „S. Offene
   * Lücken" lief als Abkürzung ineinander).
   */
  const standSatz = useCallback(
    (w: string, g: string[]): TextTeil[] => [
      ...inTeile(maskeSprechen(w, g)),
      { text: " " },
      { text: t.offen(igluMaske(w, g, lang).filter((c) => c === null).length), pause: true },
    ],
    [t, maskeSprechen, lang],
  );

  /** Beim Start jedes Wortes: Ankündigung (nur beim ersten), Wortlänge, Stand. */
  useEffect(() => {
    if (!wort) return;
    const teile: TextTeil[] = [
      ...(nr === 1 ? [{ text: `${ankuendigung} ` }] : []),
      { text: `${t.wortVon(nr, IGLU_WOERTER)}. ${t.buchstabenImWort([...wort].length)}. ` },
      ...standSatz(wort, startGeraten),
    ];
    setStatus(standSatz(wort, startGeraten));
    sage(teile);
    insFeld();
    // Nur beim Wortwechsel - nicht bei jedem Neuzeichnen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wort]);

  const melde = useCallback(
    (urteil: IgluUrteil) => {
      const jetzt = Date.now();
      onAufgabeFertig?.({
        lesson: contextId,
        chars: 1,
        errors: urteil.art === "daneben" ? 1 : 0,
        ms: Math.max(0, jetzt - beginnRef.current),
        activeMs: Math.round(takePracticeDelta(jetzt)),
        lang,
      });
      beginnRef.current = jetzt;
    },
    [onAufgabeFertig, contextId, lang],
  );

  const naechstesWort = useCallback(() => {
    if (nr >= IGLU_WOERTER) {
      onFertig();
      return;
    }
    const neu = [...gehabt, ...(wort ? [wort] : [])];
    const naechstes = waehleIgluwort(ctx, neu);
    if (!naechstes) {
      onFertig();
      return;
    }
    setGehabt(neu);
    setNr(nr + 1);
    setzeStand(igluGeschenkt(naechstes, ctx), 0, "raten");
    setWort(naechstes);
  }, [nr, gehabt, wort, ctx, onFertig, setzeStand]);

  const rate = useCallback(
    (roh: string) => {
      if (!wort) return;
      notePracticeActivity();
      const { geraten: g, bloecke: n0, phase: ph } = stand.current;
      if (ph !== "raten") {
        // Nach dem Wortende ist jeder Buchstabe eine Erinnerung an „Enter", keine Eingabe.
        sage(inTeile(t.weiter));
        return;
      }
      const urteil = rateBuchstabe(wort, g, roh, lang);
      let satz: TextTeil[];
      switch (urteil.art) {
        case "kein-buchstabe":
          satz = [{ text: t.keinBuchstabe }];
          break;
        case "schon":
          satz = inTeile(t.schon(inhalt(urteil.buchstabe)));
          break;
        case "treffer": {
          const neu = [...g, urteil.buchstabe];
          playSuccessSound();
          if (igluGeloest(wort, neu, lang)) {
            setzeStand(neu, n0, "geloest");
            satz = inTeile(`${t.geloest(inhalt(wort))} ${t.weiter}`);
          } else {
            setzeStand(neu, n0, "raten");
            satz = [...inTeile(t.treffer(inhalt(urteil.buchstabe))), { text: " " }, ...standSatz(wort, neu)];
          }
          break;
        }
        case "daneben": {
          const neu = [...g, urteil.buchstabe];
          const n = n0 + 1;
          if (n >= IGLU_BLOECKE) {
            setzeStand(neu, n, "fertig");
            satz = inTeile(`${t.daneben(inhalt(urteil.buchstabe), n, IGLU_BLOECKE)} ${t.igluFertig(inhalt(wort))} ${t.weiter}`);
          } else {
            setzeStand(neu, n, "raten");
            satz = [
              ...inTeile(t.daneben(inhalt(urteil.buchstabe), n, IGLU_BLOECKE)),
              { text: " " },
              ...standSatz(wort, neu),
            ];
          }
          break;
        }
      }
      setStatus(satz);
      sage(satz);
      if (urteil.art !== "kein-buchstabe") melde(urteil);
    },
    [wort, lang, t, sage, standSatz, melde, setzeStand],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        insFeld();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [insFeld]);

  if (!wort) return null;

  const beendet = phase !== "raten";
  const offen = igluMaske(wort, geraten, lang);
  const sichtbar = beendet ? [...wort] : offen.map((c) => c ?? "_");
  const getippt = geraten;
  const letzteRunde = nr >= IGLU_WOERTER;

  return (
    <div ref={karteRef} className="card space-y-4 p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-ink">{formName("iglu", ui)}</h2>
        <p className="text-base text-ink">
          {t.wortVon(nr, IGLU_WOERTER)} - {t.blockVon(bloecke, IGLU_BLOECKE)}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <IgluBild bloecke={bloecke} />
        {/* Das Wort mit Lücken für Sehende. Für die Sprachausgabe steht der Stand im Feld-Label und in
            der Statuszeile - hier wäre es eine zweite Lesung. */}
        <p
          lang={inhaltLang}
          aria-hidden="true"
          className="font-mono text-2xl font-medium tracking-widest text-ink"
          style={laufweiteText(zeichenabstand)}
        >
          {sichtbar.join(" ")}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-base text-ink" aria-hidden="true">
          {t.dein}
        </p>
        {/* Label = Wort mit Lücken plus vier Leerzellen: Die Braillezeile zeigt es unmittelbar vor dem Feld. */}
        <label
          htmlFor={feldId}
          lang={inhaltLang}
          className="block font-mono text-base tracking-wider text-ink"
          style={laufweiteText(zeichenabstand)}
        >
          {igluFeldbeschriftung(wort, beendet ? [...wort].map((c) => igluBuchstabe(c, lang)) : geraten, lang)}
        </label>
        <input
          ref={feldRef}
          id={feldId}
          lang={inhaltLang}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-xl text-ink"
          style={laufweiteFeld(zeichenabstand)}
          value=""
          onChange={(e) => {
            // Ein Buchstabe, sofort gewertet; das Feld bleibt leer.
            // Auch ein eingefügter Block zählt - Zeichen für Zeichen, in der Reihenfolge.
            for (const zeichen of [...e.target.value]) rate(zeichen);
            insFeld();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (beendet) naechstesWort();
              else sage(standSatz(wort, geraten));
            }
          }}
        />
      </div>

      <p aria-live="polite" className="min-h-[1.5rem] text-base text-ink">
        <TeileText teile={status} lang={lang} gemischt={gemischt} />
      </p>

      <div>
        <h3 className="text-base text-ink">{t.schonGetippt}</h3>
        <p lang={inhaltLang} className="mt-1 text-base text-ink" style={laufweiteText(zeichenabstand)}>
          {getippt.join(" ")}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {beendet && !letzteRunde && (
          <button type="button" className="btn-primary" onClick={naechstesWort}>
            {t.naechstes}
          </button>
        )}
        {!beendet && (
          <button type="button" className="btn-secondary" onClick={() => sage(standSatz(wort, geraten))}>
            {t.standSagen}
          </button>
        )}
        <button type="button" className={beendet && letzteRunde ? "btn-primary" : "btn-secondary"} onClick={onFertig}>
          {t.fertig}
        </button>
        <button type="button" className="btn-secondary" onClick={onAbbruch}>
          {t.zurueck}
        </button>
      </div>

      <CviAbdunkeln aktiv={zeichenabstand > 1} zielRef={karteRef} />
    </div>
  );
}
