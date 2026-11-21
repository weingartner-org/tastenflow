/**
 * ★ GEZIELT ÜBEN (13.11.2026): die Zeile zu Alt + 2 für die Kürzel-Liste (Alt + T), die Hilfe (Alt + H) und die
 * Handbücher - EINE Quelle, 17 Sprachen. Bewusst eine eigene kleine Datei ohne Laufzeit-Abhängigkeiten: Die Handbuch-
 * Skripte (Node) lesen `kuerzelListe.ts` und dürfen darüber nicht die Oberfläche nachladen.
 *
 * ★ Warum Alt + 2: Alt + A und Alt + Q sind plattformweit vergeben (`lib/shortcuts.ts`: „Zur Angabe", „Lösung"), alle
 * Buchstaben in Tastenflow ebenso (Stand 11.09.2026: der letzte freie war M). Frei war nur die Zahlenreihe: 1 und 2;
 * die 2 steht neben den Tasten-Kürzeln Alt + 3, 4 und 5.
 */
import type { BedienSprache } from "../bedienSprache/sprache";

export const GEZIELT_KUERZEL: Readonly<Record<BedienSprache, string>> = {
  de: "Gezielt üben: Tasten wählen, die in den Runden besonders oft vorkommen (Kind einer Klasse: sagt die Tasten der Lehrkraft an)",
  en: "Targeted practice: choose keys that appear especially often in the rounds (child in a class: announces the keys the teacher set)",
  fr: "Entrainement ciblé : choisir les touches qui reviennent surtout dans les séries (enfant d'une classe : annonce les touches réglées par l'enseignant)",
  es: "Práctica dirigida: elegir las teclas que más aparecen en las rondas (alumno de una clase: anuncia las teclas del docente)",
  it: "Esercizio mirato: scegliere i tasti che compaiono soprattutto nelle serie (bambino di una classe: annuncia i tasti dell'insegnante)",
  pl: "Ćwiczenie celowane: wybór klawiszy, które szczególnie często pojawiają się w rundach (dziecko w klasie: odczytuje klawisze ustawione przez nauczyciela)",
  tr: "Hedefli çalışma: turlarda özellikle sık çıkacak tuşları seç (sınıftaki çocuk: öğretmenin ayarladığı tuşları seslendirir)",
  cs: "Cílené procvičování: výběr kláves, které se v kolech objevují zvlášť často (dítě ve třídě: přečte klávesy nastavené pro třídu)",
  bg: "Целенасочено упражнение: избор на клавиши, които се срещат особено често в кръговете (дете в клас: съобщава клавишите, зададени от учителя)",
  el: "Στοχευμένη εξάσκηση: επιλογή πλήκτρων που εμφανίζονται ιδιαίτερα συχνά στους γύρους (παιδί σε τάξη: ανακοινώνει τα πλήκτρα του εκπαιδευτικού)",
  hu: "Célzott gyakorlás: azok a billentyűk választhatók, amelyek különösen gyakran szerepelnek a körökben (osztályba járó gyerek: bemondja a tanár által beállított billentyűket)",
  nl: "Gericht oefenen: toetsen kiezen die extra vaak in de rondes voorkomen (kind in een klas: noemt de toetsen die de leerkracht heeft ingesteld)",
  pt: "Treino dirigido: escolher as teclas que aparecem mais vezes nas rondas (criança numa turma: anuncia as teclas definidas pelo professor)",
  br: "Treino direcionado: escolher as teclas que aparecem com mais frequência nas rodadas (criança em uma turma: anuncia as teclas definidas por quem dá aula)",
  ro: "Exercițiu țintit: alegerea tastelor care apar mai des în runde (copil dintr-o clasă: anunță tastele setate de profesor)",
  sv: "Riktad övning: välj tangenter som förekommer extra ofta i omgångarna (barn i en klass: säger vilka tangenter läraren har ställt in)",
  uk: "Цілеспрямована вправа: вибір клавіш, які особливо часто трапляються в раундах (дитина в класі: озвучує клавіші, задані вчителем)",
};
