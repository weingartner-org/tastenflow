/**
 * ★ PL-W (09.10.2026): „Korrekturlesen" auf Weg „pl" (*Korekta*) - in jedem Satz steht ein falsches, ECHTES polnisches
 * Wort, das man deutlich anders hört (Johannes 02.09.2026: der Fehler muss hörbar sein) und das im Satz offensichtlich
 * nicht stimmt. Neu auf Polnisch geschrieben, nicht übersetzt.
 *
 * ⚠️ Im Polnischen klingen einige Schreibungen GLEICH - ein Paar, das sich nur darin unterscheidet, ist für eine
 * Sprachausgabe unhörbar und wäre eine Aufgabe gegen das Kind: `ó`/`u` (*góra/gura*), `rz`/`ż` (*morze/może*), `ch`/`h`
 * (*hart/chart*), die Auslautverhärtung (*kod/kot*, *lud/lut*, *bób/bup*), `si`/`ś`, `ci`/`ć`, `zi`/`ź`, `ni`/`ń` vor
 * einem Vokal, und das `ę` am Wortende, das gesprochen meist wie `e` klingt (*idę/ide*). Der Wächter rechnet dafür einen
 * Lautschlüssel.
 *
 * ★ Hörbar sind dagegen die polnischen Buchstaben, die einen ANDEREN LAUT tragen: *ze/że* (z gegen ż), *ja/ją*, *sad/sąd*,
 * *paczki/pączki* (Nasal), *stal/stał* (l gegen ł = „u"), *piec/pięć*. Diese sechs Fälle üben genau das, was die Ogonki,
 * Kreski und Punkte ausmachen: ohne sie ist es ein anderes Wort.
 *
 * Kein Geschlecht der tippenden Person: 1. Person nur im Präsens, Vergangenheit nur in der 3. Person (*stał* über einen
 * Zug). Keine Feiertage, keine Religion. Nichts aus der Sperrliste (`sperrlistePl.ts`, Kern UND Wortbasis).
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_PL: readonly Korrekturfall[] = [
  { satz: "W lesie rosną wysokie drzwi.", falsch: "drzwi", richtig: "drzewa" },
  { satz: "Pies wesoło macha okonem.", falsch: "okonem", richtig: "ogonem" },
  { satz: "Zimą dzieci lepią bałwana ze śmiechu.", falsch: "śmiechu", richtig: "śniegu" },
  { satz: "Tata kroi chleb ostrym nosem.", falsch: "nosem", richtig: "nożem" },
  { satz: "W nocy na niebie świecą gwoździe.", falsch: "gwoździe", richtig: "gwiazdy" },
  { satz: "Kura co rano znosi jabłka.", falsch: "jabłka", richtig: "jajka" },
  { satz: "Rano czeszę włosy grzybem.", falsch: "grzybem", richtig: "grzebieniem" },
  { satz: "Ryby pływają w ręce.", falsch: "ręce", richtig: "rzece" },
  { satz: "Babcia piecze w piekarniku pyszne miasto.", falsch: "miasto", richtig: "ciasto" },
  { satz: "Wieczorem kładę się do łyżki.", falsch: "łyżki", richtig: "łóżka" },
  { satz: "Piszę w zeszycie ogórkiem.", falsch: "ogórkiem", richtig: "ołówkiem" },
  { satz: "Na głowę wkładam ciepłą łapkę.", falsch: "łapkę", richtig: "czapkę" },
  { satz: "Ania czyta ciekawą kaszkę.", falsch: "kaszkę", richtig: "książkę" },
  { satz: "Po deszczu na niebie widać teczkę.", falsch: "teczkę", richtig: "tęczę" },
  { satz: "Pszczoły zbierają nektar i robią słodki lód.", falsch: "lód", richtig: "miód" },
  { satz: "Pociąg jedzie po torbach.", falsch: "torbach", richtig: "torach" },
  { satz: "W Polsce wakacje szkolne są zimą.", falsch: "zimą", richtig: "latem" },
  { satz: "Tydzień ma siedem godzin.", falsch: "godzin", richtig: "dni" },
  { satz: "Rok ma dwanaście tygodni.", falsch: "tygodni", richtig: "miesięcy" },
  { satz: "Zapach kwiatów czujemy uszami.", falsch: "uszami", richtig: "nosem" },
  { satz: "Wiewiórka zbiera orzechy na zupę.", falsch: "zupę", richtig: "zimę" },
  { satz: "Na plaży budujemy zamek z pieska.", falsch: "pieska", richtig: "piasku" },
  { satz: "Rower ma dwa kolana.", falsch: "kolana", richtig: "koła" },
  { satz: "Zimą na zamarzniętym jeziorze jeździmy na łyżkach.", falsch: "łyżkach", richtig: "łyżwach" },
  { satz: "Słońce zachodzi rano.", falsch: "rano", richtig: "wieczorem" },
  { satz: "Na jabłoni rosną gruszki.", falsch: "gruszki", richtig: "jabłka" },
  { satz: "Kaczka pływa po stole.", falsch: "stole", richtig: "stawie" },
  { satz: "Pies śpi w swojej butelce.", falsch: "butelce", richtig: "budzie" },
  { satz: "Z mąki, jajek i mleka smażymy nalepki.", falsch: "nalepki", richtig: "naleśniki" },
  { satz: "Na stole stoi wazon z kwadratami.", falsch: "kwadratami", richtig: "kwiatami" },
  { satz: "Krowa je trawę na lekcji.", falsch: "lekcji", richtig: "łące" },
  { satz: "Kot ma cztery lampy.", falsch: "lampy", richtig: "łapy" },
  // --- Polskie litery: bez nich to inne słowo (i inny dźwięk) ---
  { satz: "Listonosz przynosi listy i pączki.", falsch: "pączki", richtig: "paczki" },
  { satz: "W sądzie rosną jabłonie i grusze.", falsch: "sądzie", richtig: "sadzie" },
  { satz: "Na peronie stal długi pociąg.", falsch: "stal", richtig: "stał" },
  { satz: "Mam nową książkę i czytam ja codziennie.", falsch: "ja", richtig: "ją" },
  { satz: "Wiem, ze jutro nie ma lekcji.", falsch: "ze", richtig: "że" },
  { satz: "Każda ręka ma piec palców.", falsch: "piec", richtig: "pięć" },
];
