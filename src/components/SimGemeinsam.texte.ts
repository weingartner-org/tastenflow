/**
 * Feste Texte der gemeinsamen Sim-Bausteine in 17 Sprachen (Bauplan 2026-11-06 §1d):
 * `SimNichtBarrierefrei` (Satz und „Warum?"), `SimEinfuehrung` (Rundgang-Kasten und
 * Knopf) und `SimHelp` (Hilfe-Knopf; Titel und Inhalt kommen von den Seiten).
 * `de` ist der Bestand, Byte für Byte. Außerhalb der öffentlichen Seiten ist die
 * Sprache über `useSimSprache()` immer Deutsch. Wörter für „Hilfe" wie in
 * `PublicHilfe.tsx`.
 */
import { simTexte } from "@/lib/simSprache";

const de = {
  satz: "Diese Simulation ist für sehende Menschen gebaut und nicht barrierefrei.",
  warum: "Warum?",
  einfuehrung: {
    knopf: "Einführung",
    name: "Einführung",
    zaehler: (nr: number, von: number) => `Einführung ${nr}/${von}`,
    ueberspringen: "Überspringen",
    weiter: "Weiter",
    fertig: "Fertig",
    geschafft: "Geschafft.",
  },
  hilfe: {
    knopf: "Hilfe",
    tipp: "Hilfe (Alt + H)",
  },
};

export type SimGemeinsamTexte = typeof de;

type Einf = SimGemeinsamTexte["einfuehrung"];

const einf = (
  wort: string,
  ueberspringen: string,
  weiter: string,
  fertig: string,
  geschafft: string,
): Einf => ({
  knopf: wort,
  name: wort,
  zaehler: (nr, von) => `${wort} ${nr}/${von}`,
  ueberspringen,
  weiter,
  fertig,
  geschafft,
});

export const SIM_GEMEINSAM_TEXTE = simTexte<SimGemeinsamTexte>({
  de,
  en: {
    satz: "This simulation is built for sighted people and is not accessible.",
    warum: "Why?",
    einfuehrung: einf("Introduction", "Skip", "Next", "Done", "Well done."),
    hilfe: { knopf: "Help", tipp: "Help (Alt + H)" },
  },
  fr: {
    satz: "Cette simulation est conçue pour des personnes voyantes et n'est pas accessible.",
    warum: "Pourquoi ?",
    einfuehrung: einf("Introduction", "Passer", "Suivant", "Terminer", "Réussi."),
    hilfe: { knopf: "Aide", tipp: "Aide (Alt + H)" },
  },
  es: {
    satz: "Esta simulación está pensada para personas que ven y no es accesible.",
    warum: "¿Por qué?",
    einfuehrung: einf("Introducción", "Omitir", "Siguiente", "Terminar", "Hecho."),
    hilfe: { knopf: "Ayuda", tipp: "Ayuda (Alt + H)" },
  },
  it: {
    satz: "Questa simulazione è pensata per persone vedenti e non è accessibile.",
    warum: "Perché?",
    einfuehrung: einf("Introduzione", "Salta", "Avanti", "Fine", "Fatto."),
    hilfe: { knopf: "Aiuto", tipp: "Aiuto (Alt + H)" },
  },
  pl: {
    satz: "Ta symulacja jest zbudowana dla osób widzących i nie jest dostępna.",
    warum: "Dlaczego?",
    einfuehrung: einf("Wprowadzenie", "Pomiń", "Dalej", "Gotowe", "Udało się."),
    hilfe: { knopf: "Pomoc", tipp: "Pomoc (Alt + H)" },
  },
  tr: {
    satz: "Bu simülasyon gören insanlar için hazırlanmıştır ve erişilebilir değildir.",
    warum: "Neden?",
    einfuehrung: einf("Tanıtım", "Atla", "İleri", "Bitti", "Başardınız."),
    hilfe: { knopf: "Yardım", tipp: "Yardım (Alt + H)" },
  },
  cs: {
    satz: "Tato simulace je vytvořena pro vidoucí lidi a není přístupná.",
    warum: "Proč?",
    einfuehrung: einf("Úvod", "Přeskočit", "Dále", "Hotovo", "Splněno."),
    hilfe: { knopf: "Nápověda", tipp: "Nápověda (Alt + H)" },
  },
  bg: {
    satz: "Тази симулация е направена за хора, които виждат, и не е достъпна.",
    warum: "Защо?",
    einfuehrung: einf("Въведение", "Пропускане", "Напред", "Готово", "Успяхте."),
    hilfe: { knopf: "Помощ", tipp: "Помощ (Alt + H)" },
  },
  el: {
    satz: "Αυτή η προσομοίωση έχει φτιαχτεί για ανθρώπους που βλέπουν και δεν είναι προσβάσιμη.",
    warum: "Γιατί;",
    einfuehrung: einf("Εισαγωγή", "Παράλειψη", "Επόμενο", "Τέλος", "Τα καταφέρατε."),
    hilfe: { knopf: "Βοήθεια", tipp: "Βοήθεια (Alt + H)" },
  },
  hu: {
    satz: "Ez a szimuláció látó embereknek készült, és nem akadálymentes.",
    warum: "Miért?",
    einfuehrung: einf("Bevezető", "Kihagyás", "Tovább", "Kész", "Sikerült."),
    hilfe: { knopf: "Súgó", tipp: "Súgó (Alt + H)" },
  },
  nl: {
    satz: "Deze simulatie is gemaakt voor mensen die kunnen zien en is niet toegankelijk.",
    warum: "Waarom?",
    einfuehrung: einf("Introductie", "Overslaan", "Volgende", "Klaar", "Gelukt."),
    hilfe: { knopf: "Help", tipp: "Help (Alt + H)" },
  },
  pt: {
    satz: "Esta simulação foi feita para pessoas que veem e não é acessível.",
    warum: "Porquê?",
    einfuehrung: einf("Introdução", "Saltar", "Seguinte", "Concluir", "Conseguido."),
    hilfe: { knopf: "Ajuda", tipp: "Ajuda (Alt + H)" },
  },
  br: {
    satz: "Esta simulação foi feita para pessoas que enxergam e não é acessível.",
    warum: "Por quê?",
    einfuehrung: einf("Introdução", "Pular", "Próximo", "Concluir", "Conseguiu."),
    hilfe: { knopf: "Ajuda", tipp: "Ajuda (Alt + H)" },
  },
  ro: {
    satz: "Această simulare este făcută pentru persoane care văd și nu este accesibilă.",
    warum: "De ce?",
    einfuehrung: einf("Introducere", "Treceți peste", "Înainte", "Gata", "Reușit."),
    hilfe: { knopf: "Ajutor", tipp: "Ajutor (Alt + H)" },
  },
  sv: {
    satz: "Den här simuleringen är gjord för seende människor och är inte tillgänglighetsanpassad.",
    warum: "Varför?",
    einfuehrung: einf("Introduktion", "Hoppa över", "Nästa", "Klar", "Det gick bra."),
    hilfe: { knopf: "Hjälp", tipp: "Hjälp (Alt + H)" },
  },
  uk: {
    satz: "Ця симуляція створена для людей, які бачать, і не є доступною.",
    warum: "Чому?",
    einfuehrung: einf("Вступ", "Пропустити", "Далі", "Готово", "Вдалося."),
    hilfe: { knopf: "Довідка", tipp: "Довідка (Alt + H)" },
  },
});
