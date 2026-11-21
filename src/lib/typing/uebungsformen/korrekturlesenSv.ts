/**
 * ★ D-LERNDATEN (25.10.2026): DIE KORREKTURLESE-FÄLLE des Weges „sv" (Schwedisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/sv/tf-fest-sv.json`, Schlüssel `unsinnSaetze` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja, unter zwei Bedingungen: Die Punkte 1 und 5 aus §5 müssen technisch geklärt werden, und ein Mensch mit Schwedisch als Erstsprache sollte das Ganze gegenlesen.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `korrekturlesenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Schwedisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * In jedem Satz steht ein falsches, echtes Wort (`falsch`), das im Satz offensichtlich nicht stimmt; `richtig` ist das gemeinte.
 * Ob der Unterschied für eine Sprachausgabe HÖRBAR ist (Johannes 02.09.2026), prüft erst ein Lautschlüssel je Sprache (F8, offen).
 *
 * Verteiler: `korrekturlesen.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?schwedisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-sv.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_SV: readonly Korrekturfall[] = [
  { satz: "Vi bor i ett stort mus.", falsch: "mus", richtig: "hus" },
  { satz: "På vintern faller det mycket sjö.", falsch: "sjö", richtig: "snö" },
  { satz: "Vi åker bår till Åland.", falsch: "bår", richtig: "båt" },
  { satz: "Jag borstar tärnorna varje kväll.", falsch: "tärnorna", richtig: "tänderna" },
  { satz: "Lucia bär en krona med lus.", falsch: "lus", richtig: "ljus" },
  { satz: "Korna ger oss mjöl.", falsch: "mjöl", richtig: "mjölk" },
  { satz: "Fisken simmar i vantet.", falsch: "vantet", richtig: "vattnet" },
  { satz: "Hunden viftar på svampen.", falsch: "svampen", richtig: "svansen" },
  { satz: "Vi plockar lejon i skogen.", falsch: "lejon", richtig: "lingon" },
  { satz: "Ekorren äter en kotlett.", falsch: "kotlett", richtig: "kotte" },
  { satz: "Jag äter en bula till fikat.", falsch: "bula", richtig: "bulle" },
  { satz: "Pappa åker tå till jobbet.", falsch: "tå", richtig: "tåg" },
  { satz: "På sommaren badar vi i havren.", falsch: "havren", richtig: "havet" },
  { satz: "Munnen lyser på natten.", falsch: "Munnen", richtig: "Månen" },
  { satz: "Jag skriver med en panna.", falsch: "panna", richtig: "penna" },
  { satz: "Läraren skriver på tallen.", falsch: "tallen", richtig: "tavlan" },
  { satz: "Jag läser en bock innan jag somnar.", falsch: "bock", richtig: "bok" },
  { satz: "Hästen äter hök.", falsch: "hök", richtig: "hö" },
  { satz: "Fåglarna bygger en bod i trädet.", falsch: "bod", richtig: "bo" },
  { satz: "Renen drar sladden över snön.", falsch: "sladden", richtig: "släden" },
  { satz: "Snögubben har en mormor som näsa.", falsch: "mormor", richtig: "morot" },
  { satz: "Kungen har en kråka på huvudet.", falsch: "kråka", richtig: "krona" },
  { satz: "Vi sjunger en säng för mormor.", falsch: "säng", richtig: "sång" },
  { satz: "Tomaten kommer på julafton.", falsch: "Tomaten", richtig: "Tomten" },
  { satz: "Vi pyntar grannen till jul.", falsch: "grannen", richtig: "granen" },
  { satz: "Lillebror tappade en tant.", falsch: "tant", richtig: "tand" },
  { satz: "Vi grillar kor på stranden.", falsch: "kor", richtig: "korv" },
  { satz: "Kocken rör i gruvan.", falsch: "gruvan", richtig: "grytan" },
  { satz: "Barnen äter gröt ur en skola.", falsch: "skola", richtig: "skål" },
  { satz: "Fiskaren fiskar med ett spöke.", falsch: "spöke", richtig: "spö" },
  { satz: "Lisa har fått en ny cirkel och cyklar till skolan.", falsch: "cirkel", richtig: "cykel" },
  { satz: "Jag dricker saft ur ett gas.", falsch: "gas", richtig: "glas" },
  { satz: "Det är kallt, så jag tar på mig mossan.", falsch: "mossan", richtig: "mössan" },
  { satz: "Vi tar hästen upp till femte våningen.", falsch: "hästen", richtig: "hissen" },
  { satz: "Jag tvättar haren med schampo.", falsch: "haren", richtig: "håret" },
  { satz: "Jag äter soppa med en skida.", falsch: "skida", richtig: "sked" },
  { satz: "Vi sitter på stolpen och äter middag.", falsch: "stolpen", richtig: "stolen" },
];
