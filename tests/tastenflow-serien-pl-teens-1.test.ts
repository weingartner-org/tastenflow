/**
 * ★★★ Wächter PL-S Jugend (09.10.2026): die ersten POLNISCHEN Serien für Jugendliche (13-17), Charge 1
 * (`src/lib/typing/serienPlTeens1.ts`), eingehängt über `serienPl.ts` → `SERIEN_PL` → `SERIEN`.
 * Befund: `BEFUND-2026-10-09-PL-SERIEN-1.md`.
 *
 * Aufbau wie die italienischen Serien-Wächter (`tastenflow-serien-it-teens-1.test.ts`, `-it-kids-1.test.ts`); die
 * polnischen Regeln kommen aus dem gemeinsamen Helfer `helfer/plSerienRegeln.ts` (der auch die Kinder- und die
 * Erwachsenen-Charge prüft). Geprüft wird:
 *  1. Form jeder Zeile (Zeichen, ein Satz, 4-18 Wörter, `zeilenFehler`, Zahlformat polnisch) und jeder Serie (20 Serien,
 *     19 mit 2 Etappen und genau eine mit 3, 14-16 Zeilen je Etappe, offenes Ende, Slug, Titel, Eigennamen);
 *     mindestens 12 Serien ohne Ziffern.
 *  2. Inhalt: keine Anrede Pan/Pani/Państwo, kein Geschlecht der tippenden Person, keine Feiertage, keine Religion, keine
 *     Politik, kein Etikett für Menschen mit Behinderung; Sprache als Faden in mindestens 10 Serien.
 *  3. Regionen: alle 16 Woiwodschaften mindestens einmal, keine mehr als zweimal.
 *  4. Wortschatz: kein Inhaltswort in mehr als 8 Zeilen, Sperrliste (Kern + Wortbasis), jedes Wort in der Wortbasis, als
 *     Eigenname der Serie oder in `VON_HAND_BELEGT`; jeder Ogonek-Zwilling gelesen (`ZWILLING_GELESEN`).
 *  5. Keine Kopie, kein Paar, nichts fast gleich - untereinander (0,5), gegen den polnischen Korpus und die anderen
 *     pl-Serien (0,5) und gegen alle anderen Texte (0,6).
 *  6. Weg „pl": `validateSerie`, `minTier` gerechnet == eingetragen, Öffnungs-Einheit gemessen (`OEFFNET`), jede Zeile
 *     kommt vollständig, keine servierte Fassung verliert ein Wort, eine Ziffern-Zeile kommt nie halb, gekürzt kein
 *     Grosswort mitten im Satz, das kein Eigenname der Serie ist.
 *  7. Eingehängt: genau einmal in `SERIEN_PL` und `SERIEN`; frei nur für Jugendliche auf Weg „pl".
 *
 * Jede Regel hat eine GEGENPROBE - ein Wächter, der nie anschlägt, beweist nichts.
 */
import { afterEach, describe, expect, it } from "vitest";
import { SERIEN_PL_TEENS_1 } from "../src/lib/typing/serienPlTeens1";
import type { SerieEntwurfPl } from "../src/lib/typing/serienPlTyp";
import { SERIEN_PL } from "../src/lib/typing/serienPl";
import { SERIEN, allowedFromIntroduced, unlockedSerien } from "../src/lib/typing/serien";
import { computeSerieMinTier, validateSerie, type Serie } from "../src/lib/typing/serie";
import { fitText } from "../src/lib/typing/corpus";
import { CORPUS_PL as PL_ROH } from "../src/lib/typing/corpusPl";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { bausteinKey } from "../src/lib/typing/ledger";
import {
  ANREDE,
  BASIS,
  WOIWODSCHAFTEN_PL,
  allowedAt,
  alleFremdenZeilen,
  anderePlZeilen,
  etikettIn,
  fastGleich,
  fastGleichUntereinander,
  fastGleichVoll,
  feiertagIn,
  formFehler,
  fremdeGrosswoerter,
  gekuerztFehler,
  geschlechtFehler,
  gesperrtPl,
  kopienGegen,
  namenVon,
  oeffnetEinheit,
  ohneSatzzeichen,
  ordnung,
  paare,
  politikIn,
  proWoiwodschaft,
  pruefWoerter,
  serienFormFehler,
  ungeprueft,
  volleSprosse,
  ersteSprosse,
  zeilenVon,
  zuHaeufig,
  zwillingWoerter,
  type FormRegel,
} from "./helfer/plSerienRegeln";

afterEach(() => setLayout("de"));

const S = SERIEN_PL_TEENS_1;
const VORSILBE = "pl-teens-1-";
const ZEILEN = S.flatMap(zeilenVon);
const EIGENE_SLUGS = new Set(S.map((s) => s.slug));
const NAMEN_ALLE = new Set(S.flatMap((s) => [...namenVon(s)]));

/**
 * Erlaubte Zeichen: polnische Buchstaben (q v x eingeschlossen), Leerzeichen, `. , ; : ? ! "`, Ziffern, `%` und `'` (nur im
 * Wort, `zeilenFehler`). Bewusst NICHT: `-` (vor seiner Sprosse fiele er weg und zerrisse ein Wort oder einen Einschub),
 * Klammern, `€` (die Serien spielen in Polen), typografische Zeichen.
 */
const ERLAUBT = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 .,;:?!"'%]+$/u;
const FORM: FormRegel = { erlaubt: ERLAUBT, minWoerter: 4, maxWoerter: 18 };

/** Zahlformat polnisch (GLOSSAR-pl §1 Nr. 5, §2.10): Uhrzeit 7:15, 15%, „20 zł" nach der Zahl, keine Ordnungszahl mit Punkt. */
export function zahlFehler(z: string): string[] {
  const p: string[] = [];
  if (/\d\.\d/.test(z)) p.push("Punkt zwischen Ziffern (Dezimalkomma, Uhrzeit mit Doppelpunkt, kein Tausenderpunkt)");
  if (/\d\.\s+\p{Ll}/u.test(z)) p.push("Ordnungszahl mit Punkt");
  if (/\d\s+%/.test(z) || /%\d/.test(z)) p.push("Prozent: 15% ohne Leerzeichen");
  if (/\dzł/.test(z) || /zł\s*\d/.test(z)) p.push("Betrag: „20 zł“ - Zahl, Leerzeichen, zł");
  if (/\d:\d(?!\d)/.test(z) || /\b\d{3,}:\d/.test(z)) p.push("Uhrzeit oder Spielstand verstümmelt");
  if (/\d\s\d{3}\b/.test(z) && !/\d{2}\s\d{3}\b/.test(z)) p.push("vierstellige Zahl mit Leerzeichen (erst ab fünf Stellen)");
  return p;
}

/** Alle Probleme EINER Zeile in ihrer Serie (leer = in Ordnung). */
export function zeilenProbleme(z: string, namen: ReadonlySet<string>): string[] {
  const p = [...formFehler(z, FORM), ...zahlFehler(z)];
  for (const w of pruefWoerter(z)) if (gesperrtPl(w)) p.push(`Sperrwort ${w}`);
  for (const w of fremdeGrosswoerter(z, namen)) p.push(`gross mitten im Satz, kein Eigenname der Serie: ${w}`);
  if (ANREDE.test(z)) p.push("Anrede Pan/Pani/Państwo");
  if (geschlechtFehler(z)) p.push("Geschlecht der tippenden Person");
  if (feiertagIn(z)) p.push("Feiertag oder Religion");
  if (politikIn(z)) p.push("Politik");
  if (etikettIn(z)) p.push("Etikett statt Person zuerst");
  return p;
}

/** Serien mit Ziffern. */
const mitZiffern = (serien: readonly SerieEntwurfPl[]) => serien.filter((s) => /\d/.test(zeilenVon(s).join(" "))).length;

/**
 * Serien, in denen die Sprache selbst Thema ist (Gwara, Regionalwort, Rechtschreibung, Anglizismus, Nachbarsprache) -
 * von Hand geführt, der Wächter prüft nur, dass die Liste stimmt und reicht.
 */
const SPRACHE_ALS_FADEN = [
  "mechaniczka-z-parku-maszyn", // żużel = Name des Belags, kewlar
  "gwara-z-poznanskiego-fyrtla", // gwara poznańska: pyra, fyrtel, szczun, tytka, ancug, sznytka
  "robot-szuka-krasnali", // zdebugować, bug = robak
  "chrzaszcz-po-drugiej-stronie-mostu", // szumiące głoski, łamańce, Szczebrzeszyn
  "o-jak-osmoklasistka", // ó/u, rz/ż, ch/h; dywan im Ukrainischen
  "czujnik-na-parapecie", // wyjść na pole (Kraków) gegen na dwór
  "skok-z-malinki", // gwara cieszyńska, po naszymu, dej pozór
  "pierniki-pachna-pieprzem", // piernik von pierny = pieprzny
  "trolejbus-ktory-mowi", // Abkürzung „ul" und der Bienenstock
  "noc-nad-polonina", // połonina, zakapior
  "batalony-nad-biebrza", // mowa prosta, „po prostu"
  "keja-kambuz-i-szanty", // keja, kambuz, fał, szot aus dem Niederländischen
  "angielka-migawka-i-kluska", // angielka, migawka, krańcówka; kajzerka, weka
  "piosenka-w-trzech-jezykach", // szolka, mniejszość niemiecka, po śląsku
].map((r) => VORSILBE + r);

/** Die Einheit, an der jede Serie öffnet (jede Zeile wird serviert, ggf. gekürzt) - GEMESSEN, Tastatur `pl`, Weg „pl". */
const OEFFNET: Record<string, string> = {
  "pl-teens-1-mechaniczka-z-parku-maszyn": "0",
  "pl-teens-1-gwara-z-poznanskiego-fyrtla": "q",
  "pl-teens-1-robot-szuka-krasnali": "ź",
  "pl-teens-1-granit-w-sokolikach": "ź",
  "pl-teens-1-kajakiem-po-warcie": "ź",
  "pl-teens-1-chrzaszcz-po-drugiej-stronie-mostu": "ź",
  "pl-teens-1-o-jak-osmoklasistka": "ź",
  "pl-teens-1-mazurek-z-nutka-jazzu": "q",
  "pl-teens-1-czujnik-na-parapecie": "%",
  "pl-teens-1-skok-z-malinki": "q",
  "pl-teens-1-foki-z-helu": "ź",
  "pl-teens-1-pierniki-pachna-pieprzem": "q",
  "pl-teens-1-trolejbus-ktory-mowi": "ź",
  "pl-teens-1-noc-nad-polonina": "q",
  "pl-teens-1-batalony-nad-biebrza": "q",
  "pl-teens-1-lato-w-jaskini-raj": "ń",
  "pl-teens-1-keja-kambuz-i-szanty": "ź",
  "pl-teens-1-turniej-na-plazy": "0",
  "pl-teens-1-angielka-migawka-i-kluska": "q",
  "pl-teens-1-piosenka-w-trzech-jezykach": "q",
};

/**
 * Wörter, die weder in der Wortbasis (Wortschatz + jede pl-Korpuszeile) noch unter den Eigennamen der Serie stehen:
 * Form (klein) ⇒ Grundform und Form. Für Polnisch gibt es auf diesem Rechner kein Wörterbuch (Falle 61) - jede Zeile hier
 * ist gelesen.
 */
const VON_HAND_BELEGT: Record<string, string> = {
  "niedzielne": "niedzielny, Akk. Pl. nmo (niedzielne popołudnia)",
  "osiedlem": "osiedle, Instr. Sg.",
  "motocykli": "motocykl, Gen. Pl.",
  "toru": "tor, Gen. Sg.",
  "trybunie": "trybuna, Lok. Sg.",
  "maszyn": "maszyna, Gen. Pl. (park maszyn)",
  "mechanicy": "mechanik, Nom. Pl. mo",
  "szykują": "szykować, 3. Pl. Präs.",
  "juniorów": "junior, Gen. Pl.",
  "obsłużenia": "obsłużenie, Gen. Sg. (Verbalnomen)",
  "mechaników": "mechanik, Gen. Pl.",
  "rozkręci": "rozkręcić, 3. Sg. Fut. pf.",
  "gaźnik": "gaźnik, Akk. Sg.",
  "niedowierzaniem": "niedowierzanie, Instr. Sg.",
  "ściereczce": "ściereczka, Lok. Sg.",
  "kiwa": "kiwać, 3. Sg. Präs.",
  "metanolem": "metanol, Instr. Sg.",
  "spalonymi": "spalony, Part. Pass. Instr. Pl.",
  "oponami": "opona, Instr. Pl.",
  "zakłada": "zakładać, 3. Sg. Präs.",
  "kewlar": "kewlar, Akk. Sg. (Żużel-Jargon: Lederkombi des Fahrers, im Text erklärt)",
  "kombinezon": "kombinezon, Akk. Sg.",
  "żużlowca": "żużlowiec, Gen. Sg.",
  "żużlu": "żużel, Lok. Sg.",
  "wzrusza": "wzruszać (ramionami), 3. Sg. Präs.",
  "spalonego": "spalony, Part. Pass. Gen. Sg. m.",
  "wysypywano": "wysypywać, unpersönliche -no-Form",
  "stukiem": "stuk, Instr. Sg.",
  "rozkłada": "rozkładać (ręce), 3. Sg. Präs.",
  "zapłonem": "zapłon, Instr. Sg.",
  "stetoskop": "stetoskop, Akk. Sg.",
  "taśmę": "taśma, Akk. Sg. (Startband)",
  "ogłaszają": "ogłaszać, 3. Pl. Präs.",
  "zwycięzców": "zwycięzca, Gen. Pl.",
  "pyra": "pyra, Nom. Sg. (gwara poznańska: ziemniak, im Text erklärt)",
  "fyrtel": "fyrtel, Nom. Sg. (gwara poznańska: dzielnica, im Text erklärt)",
  "szczunie": "szczun, Vok. Sg. (gwara poznańska: chłopak, dzieciak)",
  "ustawia": "ustawiać, 3. Sg. Präs.",
  "włącza": "włączać, 3. Sg. Präs.",
  "milknie": "milknąć, 3. Sg. Präs.",
  "kołnierzyk": "kołnierzyk, Akk. Sg.",
  "parska": "parskać (śmiechem), 3. Sg. Präs.",
  "fyrtlu": "fyrtel, Lok. Sg. (gwara poznańska)",
  "tytce": "tytka, Lok. Sg. (gwara poznańska: torebka)",
  "pyr": "pyra, Gen. Pl. (gwara poznańska)",
  "kejtrze": "kejter, Lok. Sg. (gwara poznańska: pies, kundel)",
  "podwórka": "podwórko, Gen. Sg.",
  "ancugu": "ancug, Lok. Sg. (gwara poznańska: garnitur, aus dem Deutschen)",
  "odsłuchuje": "odsłuchiwać, 3. Sg. Präs.",
  "nagrywał": "nagrywać, 3. Sg. Prät. m. (Subjekt: telefon)",
  "cukiernicą": "cukiernica, Instr. Sg.",
  "spisuje": "spisywać, 3. Sg. Präs.",
  "ancug": "ancug, Nom. Sg. (gwara poznańska, als Wort genannt)",
  "zacina": "zacinać się, 3. Sg. Präs.",
  "osobną": "osobny, Akk. Sg. f.",
  "słowniczek": "słowniczek, Akk. Sg.",
  "przykładami": "przykład, Instr. Pl.",
  "ławki": "ławka, Gen. Sg.",
  "wyraźną": "wyraźny, Akk. Sg. f.",
  "dykcję": "dykcja, Akk. Sg.",
  "gwary": "gwara, Gen. Sg.",
  "dopowiada": "dopowiadać, 3. Sg. Präs.",
  "sznytka": "sznytka, Nom. Sg. (gwara poznańska: kromka, aus dem Deutschen)",
  "kromka": "kromka, Nom. Sg.",
  "objaśnia": "objaśniać, 3. Sg. Präs.",
  "mikrofonu": "mikrofon, Gen. Sg.",
  "butem": "but, Instr. Sg.",
  "jury": "jury, n., undekliniert",
  "góralach": "góral, Lok. Pl.",
  "szepcze": "szeptać, 3. Sg. Präs.",
  "usłyszą": "usłyszeć, 3. Pl. Fut. pf.",
  "figurek": "figurka, Gen. Pl.",
  "rozsianych": "rozsiany, Part. Pass. Gen. Pl.",
  "mapą": "mapa, Instr. Sg.",
  "spacerach": "spacer, Lok. Pl.",
  "robotów": "robot, Gen. Pl.",
  "krasnalach": "krasnal, Lok. Pl.",
  "zatrzymywać": "zatrzymywać się, Inf.",
  "figurce": "figurka, Lok. Sg.",
  "silniki": "silnik, Akk. Pl.",
  "akumulator": "akumulator, Akk. Sg.",
  "setek": "setka, Gen. Pl.",
  "fotografuje": "fotografować, 3. Sg. Präs.",
  "krasnala": "krasnal, Akk./Gen. Sg.",
  "barierce": "barierka, Lok. Sg.",
  "zdebugować": "zdebugować, Inf. pf. (Anglizismus, im Text erklärt)",
  "jabłkach": "jabłko, Lok. Pl.",
  "zawodami": "zawody, Instr. Pl.",
  "krasnalu": "krasnal, Lok. Sg.",
  "drgnie": "drgnąć, 3. Sg. Fut. pf. (ani drgnie)",
  "krawężniku": "krawężnik, Lok. Sg.",
  "czapce": "czapka, Lok. Sg.",
  "przechodnie": "przechodzień, Nom. Pl.",
  "odwracają": "odwracać, 3. Pl. Präs.",
  "fotografują": "fotografować, 3. Pl. Präs.",
  "kosze": "kosz, Akk. Pl.",
  "hydranty": "hydrant, Akk. Pl.",
  "czapką": "czapka, Instr. Sg.",
  "krasnalem": "krasnal, Instr. Sg.",
  "termos": "termos, Akk. Sg.",
  "złapane": "złapany, Part. Pass. Nom. Pl. nmo",
  "przejechanie": "przejechanie, Akk. Sg. (Verbalnomen)",
  "makietami": "makieta, Instr. Pl.",
  "makietę": "makieta, Akk. Sg.",
  "notują": "notować, 3. Pl. Präs.",
  "tabletach": "tablet, Lok. Pl.",
  "szepczą": "szeptać, 3. Pl. Präs.",
  "makiecie": "makieta, Lok. Sg.",
  "dioda": "dioda, Nom. Sg.",
  "miga": "migać, 3. Sg. Präs.",
  "sędziami": "sędzia, Instr. Pl.",
  "granitowe": "granitowy, Nom. Pl. nmo",
  "wspinaczom": "wspinacz, Dat. Pl.",
  "wspinał": "wspinać się, 3. Sg. Prät. m. (Subjekt: tata)",
  "trampkach": "trampek, Lok. Pl.",
  "szesnastoletnia": "szesnastoletni, Nom. Sg. f.",
  "sezonów": "sezon, Gen. Pl.",
  "spadania": "spadanie, Gen. Sg.",
  "uprzedza": "uprzedzać, 3. Sg. Präs.",
  "uprząż": "uprząż, Akk. Sg.",
  "karabinki": "karabinek, Akk. Pl.",
  "węzła": "węzeł, Gen. Sg.",
  "ósemki": "ósemka, Gen. Sg. (węzeł ósemka)",
  "wygodnymi": "wygodny, Instr. Pl.",
  "chwytami": "chwyt, Instr. Pl.",
  "nazajutrz": "nazajutrz, Adverb",
  "asekurować": "asekurować, Inf.",
  "karabinek": "karabinek, Akk. Sg.",
  "spuszcza": "spuszczać, 3. Sg. Präs. (nie spuszcza oczu)",
  "woreczka": "woreczek, Gen. Sg.",
  "magnezją": "magnezja, Instr. Sg.",
  "wyciera": "wycierać, 3. Sg. Präs.",
  "zauważa": "zauważać, 3. Sg. Präs.",
  "malutką": "malutki, Akk. Sg. f.",
  "krawądkę": "krawądka, Akk. Sg. (Kletterwort: schmale Leiste)",
  "wąską": "wąski, Akk. Sg. f.",
  "zapałka": "zapałka, Nom. Sg.",
  "dosięga": "dosięgać, 3. Sg. Präs.",
  "solidnego": "solidny, Gen. Sg. m.",
  "chwytu": "chwyt, Gen. Sg.",
  "pokonuje": "pokonywać, 3. Sg. Präs.",
  "wspinaczy": "wspinacz, Gen. Pl.",
  "sąsiednią": "sąsiedni, Akk. Sg. f.",
  "wyjmuje": "wyjmować, 3. Sg. Präs.",
  "opisami": "opis, Instr. Pl.",
  "dopisał": "dopisać, 3. Sg. Prät. m. (Subjekt: ktoś)",
  "bulwaru": "bulwar, Gen. Sg.",
  "kajakarzy": "kajakarz, Akk. Pl. mo",
  "trenerka": "trenerka, Nom. Sg.",
  "zaczepia": "zaczepiać, 3. Sg. Präs.",
  "próbny": "próbny, Akk. Sg. m. unbelebt",
  "hangarze": "hangar, Lok. Sg.",
  "oparciem": "oparcie, Instr. Sg.",
  "szerszym": "szeroki, Komparativ Instr. Sg. n.",
  "siedziskiem": "siedzisko, Instr. Sg.",
  "przesiada": "przesiadać się, 3. Sg. Präs.",
  "kołysze": "kołysać się, 3. Sg. Präs.",
  "parakajakarstwo": "parakajakarstwo, Nom. Sg. (Parakanu)",
  "paralimpijska": "paralimpijski, Nom. Sg. f. (Schreibung des Polski Komitet Paralimpijski)",
  "treningi": "trening, Akk. Pl.",
  "treningów": "trening, Gen. Pl.",
  "regatowym": "regatowy, Lok. Sg. m.",
  "statywie": "statyw, Lok. Sg.",
  "kajaków": "kajak, Gen. Pl.",
  "dystansu": "dystans, Gen. Sg.",
  "trenerki": "trenerka, Gen. Sg.",
  "równym": "równy, Lok. Sg. m.",
  "zwalnia": "zwalniać, 3. Sg. Präs.",
  "przyspiesza": "przyspieszać, 3. Sg. Präs.",
  "metrach": "metr, Lok. Pl.",
  "rywala": "rywal, Akk. Sg.",
  "dopłynął": "dopłynąć, 3. Sg. Prät. m. (Subjekt: Kacper)",
  "dobiegnie": "dobiec, 3. Sg. Fut. pf.",
  "pomostu": "pomost, Gen. Sg.",
  "partnerskiej": "partnerski, Gen. Sg. f.",
  "partnerką": "partnerka, Instr. Sg.",
  "szumiących": "szumiący, Gen. Pl. (głoski szumiące)",
  "głosek": "głoska, Gen. Pl.",
  "wzdycha": "wzdychać, 3. Sg. Präs.",
  "zrozpaczona": "zrozpaczony, Nom. Sg. f. (über Lena, 3. Person)",
  "recytuje": "recytować, 3. Sg. Präs.",
  "chrząszczu": "chrząszcz, Lok. Sg.",
  "trzcinie": "trzcina, Lok. Sg.",
  "kichnięcie": "kichnięcie, Nom. Sg.",
  "wybucha": "wybuchać (śmiechem), 3. Sg. Präs.",
  "rodzajniki": "rodzajnik, Akk. Pl.",
  "obiecuje": "obiecywać, 3. Sg. Präs.",
  "semestru": "semestr, Gen. Sg.",
  "łamańców": "łamaniec (językowy), Gen. Pl.",
  "wylosować": "wylosować, Inf. pf.",
  "mikrofony": "mikrofon, Nom. Pl.",
  "karteczkami": "karteczka, Instr. Pl.",
  "losuje": "losować, 3. Sg. Präs.",
  "łamaniec": "łamaniec (językowy), Akk. Sg.",
  "rybaku": "rybak, Lok. Sg.",
  "wersie": "wers, Lok. Sg.",
  "plącze": "plątać się, 3. Sg. Präs.",
  "karteczkę": "karteczka, Akk. Sg.",
  "kartkach": "kartka, Lok. Pl.",
  "kopertą": "koperta, Instr. Sg.",
  "rozstrzygnie": "rozstrzygnąć, 3. Sg. Fut. pf.",
  "chrząszczem": "chrząszcz, Instr. Sg.",
  "rybakiem": "rybak, Instr. Sg.",
  "warszawskiej": "warszawski, Lok. Sg. f.",
  "dyktandami": "dyktando, Instr. Pl.",
  "falami": "fala, Instr. Pl.",
  "kolorowej": "kolorowy, Lok. Sg. f.",
  "karteczce": "karteczka, Lok. Sg.",
  "przykleja": "przyklejać, 3. Sg. Präs.",
  "ukraińskiego": "ukraiński (język), Gen. Sg. m.",
  "próbnym": "próbny, Lok. Sg. m.",
  "postanawia": "postanawiać, 3. Sg. Präs.",
  "podróżniku": "podróżnik, Lok. Sg.",
  "mieszkańca": "mieszkaniec, Gen. Sg.",
  "karteczki": "karteczka, Gen. Sg.",
  "ogrody": "ogród, Nom. Pl.",
  "drżącymi": "drżący, Instr. Pl.",
  "zupełnej": "zupełny, Lok. Sg. f.",
  "widnieje": "widnieć, 3. Sg. Präs.",
  "piszczy": "piszczeć, 3. Sg. Präs.",
  "odwraca": "odwracać się, 3. Sg. Präs.",
  "marginesie": "margines, Lok. Sg.",
  "zapisano": "zapisać, unpersönliche -no-Form",
  "hmura": "Fehlschreibung von chmura - als Gegenstand genannt, in Anführung",
  "wersjach": "wersja, Lok. Pl.",
  "lewych": "lewy, Lok. Pl.",
  "pułapki": "pułapka, Nom. Pl.",
  "prawych": "prawy, Lok. Pl.",
  "ukraińskie": "ukraiński, Nom. Pl. nmo",
  "dopisują": "dopisywać, 3. Pl. Präs.",
  "haseł": "hasło, Gen. Pl.",
  "przybijają": "przybijać (piątkę), 3. Pl. Präs.",
  "salą": "sala, Instr. Sg.",
  "blednie": "blednąć, 3. Sg. Präs.",
  "dworku": "dworek, Lok. Sg.",
  "zabierała": "zabierać, 3. Sg. Prät. f. (Subjekt: babcia)",
  "mazurki": "mazurek, Akk. Pl.",
  "nokturny": "nokturn, Akk. Pl.",
  "jazzowych": "jazzowy, Gen. Pl.",
  "pianistów": "pianista, Gen. Pl.",
  "zwycięzca": "zwycięzca, Nom. Sg.",
  "recital": "recital, Akk. Sg.",
  "mazurek": "mazurek, Akk. Sg.",
  "konkursem": "konkurs, Instr. Sg.",
  "obraża": "obrażać się, 3. Sg. Präs.",
  "jazzową": "jazzowy, Instr. Sg. f.",
  "koncertowej": "koncertowy, Lok. Sg. f.",
  "zasiada": "zasiadać, 3. Sg. Präs.",
  "jurorów": "juror, Gen. Pl.",
  "etiudę": "etiuda, Akk. Sg.",
  "nuta": "nuta, Nom. Sg. (nuta po nucie)",
  "nucie": "nuta, Lok. Sg.",
  "utworu": "utwór, Gen. Sg.",
  "pauzę": "pauza, Akk. Sg.",
  "jazzowe": "jazzowy, Nom. Pl. nmo",
  "akordy": "akord, Nom. Pl.",
  "notować": "notować, Inf.",
  "klaskać": "klaskać, Inf.",
  "jurorzy": "juror, Nom. Pl. mo",
  "naradzają": "naradzać się, 3. Pl. Präs.",
  "ściska": "ściskać, 3. Sg. Präs.",
  "przewodnicząca": "przewodnicząca, Nom. Sg. f. (substantiviert)",
  "kartką": "kartka, Instr. Sg.",
  "bezbłędna": "bezbłędny, Nom. Sg. f.",
  "etiuda": "etiuda, Nom. Sg.",
  "szczyptą": "szczypta, Instr. Sg.",
  "zasłonę": "zasłona, Akk. Sg.",
  "smog": "smog, Nom. Sg.",
  "bezwietrzne": "bezwietrzny, Akk. Pl. nmo",
  "osiada": "osiadać, 3. Sg. Präs.",
  "czujnik": "czujnik, Nom./Akk. Sg.",
  "pyłu": "pył, Gen. Sg.",
  "rozgląda": "rozglądać się, 3. Sg. Präs.",
  "krakowskiego": "krakowski, Gen. Sg. m.",
  "wiatraczka": "wiatraczek, Gen. Sg.",
  "montują": "montować, 3. Pl. Präs.",
  "arkusza": "arkusz, Gen. Sg.",
  "cichnie": "cichnąć, 3. Sg. Präs.",
  "przekroczona": "przekroczony, Part. Pass. Nom. Sg. f.",
  "pomiarowej": "pomiarowy, Gen. Sg. f.",
  "zamkniętych": "zamknięty, Part. Pass. Lok./Instr. Pl.",
  "oknach": "okno, Lok. Pl.",
  "czujnika": "czujnik, Gen. Sg.",
  "wyświetlać": "wyświetlać, Inf.",
  "zadbają": "zadbać, 3. Pl. Fut. pf.",
  "zerkają": "zerkać, 3. Pl. Präs.",
  "kolorową": "kolorowy, Akk. Sg. f.",
  "buźkę": "buźka, Akk. Sg.",
  "dołączają": "dołączać, 3. Pl. Präs.",
  "odkrywa": "odkrywać, 3. Sg. Präs.",
  "nastolatkowie": "nastolatek, Nom. Pl. mo",
  "pukają": "pukać, 3. Pl. Präs.",
  "furtką": "furtka, Instr. Sg.",
  "ulotką": "ulotka, Instr. Sg.",
  "czujnikiem": "czujnik, Instr. Sg.",
  "czternastoletnia": "czternastoletni, Nom. Sg. f.",
  "skocznię": "skocznia, Akk. Sg.",
  "oświetloną": "oświetlony, Part. Pass. Akk. Sg. f.",
  "drabinie": "drabina, Lok. Sg.",
  "godo": "godać, 3. Sg. Präs. (gwara cieszyńska/śląska: mówi)",
  "naszymu": "po naszymu, gwara cieszyńska: in unserer Mundart",
  "cieszyńską": "cieszyński, Instr. Sg. f.",
  "skokiem": "skok, Instr. Sg.",
  "zawołanie": "zawołanie, Akk. Sg.",
  "dej": "dać, Imperativ 2. Sg. in der Mundart (dej pozór = uważaj, im Text erklärt)",
  "pozór": "pozór, Akk. Sg. (gwara: dej pozór = uważaj)",
  "skoczni": "skocznia, Gen. Sg.",
  "odbędą": "odbyć się, 3. Pl. Fut. pf.",
  "młodzików": "młodzik, Gen. Pl. (Altersklasse im Sport)",
  "nagra": "nagrać, 3. Sg. Fut. pf.",
  "skocznią": "skocznia, Instr. Sg.",
  "belce": "belka (startowa), Lok. Sg.",
  "startowej": "startowy, Lok. Sg. f.",
  "opada": "opadać, 3. Sg. Präs.",
  "startują": "startować, 3. Pl. Präs.",
  "wybicie": "wybicie, Nom. Sg. (Absprung)",
  "telemarku": "telemark, Lok. Sg. (Landung beim Skispringen)",
  "rozstawia": "rozstawiać, 3. Sg. Präs.",
  "zeskokiem": "zeskok, Instr. Sg. (Aufsprunghang)",
  "gogle": "gogle, Akk. Pl.",
  "chorągiewką": "chorągiewka, Instr. Sg.",
  "najazdu": "najazd, Gen. Sg. (Anlaufspur)",
  "układają": "układać się, 3. Pl. Präs.",
  "młodzieżową": "młodzieżowy, Akk. Sg. f.",
  "kadrę": "kadra, Akk. Sg.",
  "głaskał": "głaskać, l-Form 3. Sg. m. im Futur (będzie głaskał, Subjekt: Oliwer)",
  "szczotkę": "szczotka, Akk. Sg.",
  "baseny": "basen, Akk. Pl.",
  "biologię": "biologia, Akk. Sg.",
  "plażach": "plaża, Lok. Pl.",
  "podchodzą": "podchodzić, 3. Pl. Präs.",
  "odpoczywającej": "odpoczywający, Gen. Sg. f.",
  "stresuje": "stresować się, 3. Sg. Präs.",
  "apteczką": "apteczka, Instr. Sg.",
  "fokę": "foka, Akk. Sg.",
  "odsunęli": "odsunąć się, 3. Pl. Prät. mo (żeby odsunęli się, Subjekt: wszyscy)",
  "ostrzegawczą": "ostrzegawczy, Akk. Sg. f.",
  "palikami": "palik, Instr. Pl.",
  "płetwie": "płetwa, Lok. Sg.",
  "noszach": "nosze, Lok. Pl.",
  "opatruje": "opatrywać, 3. Sg. Präs.",
  "foczkę": "foczka, Akk. Sg.",
  "foczka": "foczka, Nom. Sg.",
  "oznajmia": "oznajmiać, 3. Sg. Präs.",
  "wypuszczeniu": "wypuszczenie, Lok. Sg.",
  "podopieczną": "podopieczna, Instr. Sg. f. (substantiviert)",
  "pokazach": "pokaz, Lok. Pl.",
  "wypieku": "wypiek, Gen. Sg.",
  "piekł": "piec, 3. Sg. Prät. m. (Subjekt: Oskar)",
  "tostami": "tost, Instr. Pl.",
  "mistrzyni": "mistrzyni, Nom. Sg.",
  "piernikarska": "piernikarski, Nom. Sg. f.",
  "pierny": "pierny, altpolnisch: pieprzny - als Wort genannt",
  "pieprzny": "pieprzny, Nom. Sg. m. - als Wort genannt",
  "dodawano": "dodawać, unpersönliche -no-Form",
  "przyprawy": "przyprawa, Akk. Pl.",
  "drewnianą": "drewniany, Akk. Sg. f.",
  "wciskać": "wciskać, Inf.",
  "wycieczek": "wycieczka, Gen. Pl.",
  "przedszkolaków": "przedszkolak, Gen. Pl.",
  "przedszkolaki": "przedszkolak, Nom. Pl. (übliche Form)",
  "wołają": "wołać, 3. Pl. Präs.",
  "autokaru": "autokar, Gen. Sg.",
  "poprowadzi": "poprowadzić, 3. Sg. Fut. pf.",
  "pokazu": "pokaz, Gen. Sg.",
  "zjawia": "zjawiać się, 3. Sg. Präs.",
  "przewodniczką": "przewodniczka, Instr. Sg.",
  "przewodniczka": "przewodniczka, Nom. Sg.",
  "kiwają": "kiwać, 3. Pl. Präs.",
  "wałkować": "wałkować, Inf.",
  "wyciska": "wyciskać, 3. Sg. Präs.",
  "bucha": "buchać, 3. Sg. Präs.",
  "blacha": "blacha, Nom. Sg.",
  "zwęglonych": "zwęglony, Gen. Pl.",
  "nastawić": "nastawić, Inf. pf.",
  "minutnik": "minutnik, Akk. Sg.",
  "przyprawach": "przyprawa, Lok. Pl.",
  "przekłada": "przekładać, 3. Sg. Präs. (übersetzen)",
  "chłodni": "chłodnia, Lok. Sg.",
  "porcja": "porcja, Nom. Sg.",
  "autokar": "autokar, Nom. Sg.",
  "informatycznym": "informatyczny, Lok. Sg. n.",
  "trolejbusem": "trolejbus, Instr. Sg.",
  "trolejbusach": "trolejbus, Lok. Pl.",
  "zakręty": "zakręt, Akk. Pl.",
  "nasłuchuje": "nasłuchiwać, 3. Sg. Präs.",
  "hakaton": "hakaton, Akk. Sg. (aus engl. hackathon, im Text erklärt)",
  "całonocny": "całonocny, Akk. Sg. m. unbelebt",
  "dwójką": "dwójka, Instr. Sg.",
  "zapowie": "zapowiedzieć, 3. Sg. Fut. pf.",
  "położenia": "położenie, Gen. Sg.",
  "ekrany": "ekran, Akk. Pl.",
  "testuje": "testować, 3. Sg. Präs.",
  "syntezatora": "syntezator (mowy), Gen. Sg.",
  "organizatorzy": "organizator, Nom. Pl. mo",
  "zaglądają": "zaglądać, 3. Pl. Präs.",
  "ciekawością": "ciekawość, Instr. Sg.",
  "pokazem": "pokaz, Instr. Sg.",
  "monitorze": "monitor, Lok. Sg.",
  "brajlowskim": "brajlowski, Lok. Sg. m. (monitor brajlowski = Braillezeile)",
  "ucina": "ucinać, 3. Sg. Präs.",
  "dopisuje": "dopisywać, 3. Sg. Präs.",
  "rozkładzie": "rozkład (jazdy), Lok. Sg.",
  "pokazie": "pokaz, Lok. Sg.",
  "podłącza": "podłączać, 3. Sg. Präs.",
  "głośnika": "głośnik, Gen. Sg.",
  "nagraną": "nagrany, Part. Pass. Akk. Sg. f.",
  "dopytują": "dopytywać, 3. Pl. Präs.",
  "jurorek": "jurorka, Gen. Pl.",
  "spółce": "spółka, Lok. Sg.",
  "autobusach": "autobus, Lok. Pl.",
  "jurorka": "jurorka, Nom. Sg.",
  "wizytówkę": "wizytówka, Akk. Sg.",
  "lunetę": "luneta, Akk. Sg.",
  "połoninę": "połonina, Akk. Sg.",
  "połonina": "połonina, Nom. Sg. (Bergwiese in den Bieszczady, im Text erklärt)",
  "grzbietach": "grzbiet, Lok. Pl.",
  "pasterzy": "pasterz, Gen. Pl.",
  "wypasali": "wypasać, 3. Pl. Prät. mo (Subjekt: pasterze)",
  "wiekami": "wiek, Instr. Pl. (przed wiekami)",
  "czołówkami": "czołówka, Instr. Pl. (Stirnlampe)",
  "głowach": "głowa, Lok. Pl.",
  "kocem": "koc, Instr. Sg.",
  "latarki": "latarka, Akk. Pl.",
  "przyzwyczaiły": "przyzwyczaić się, 3. Pl. Prät. nmo (Subjekt: oczy)",
  "smuga": "smuga, Nom. Sg.",
  "przelatuje": "przelatywać, 3. Sg. Präs.",
  "zielonkawa": "zielonkawy, Nom. Sg. f.",
  "roju": "rój, Gen. Sg.",
  "meteory": "meteor, Nom. Pl.",
  "drobinki": "drobinka, Nom. Pl.",
  "spalają": "spalać się, 3. Pl. Präs.",
  "atmosferze": "atmosfera, Lok. Sg.",
  "kocu": "koc, Lok. Sg.",
  "meteorze": "meteor, Lok. Sg.",
  "wyskakuje": "wyskakiwać, 3. Sg. Präs.",
  "legendę": "legenda, Akk. Sg.",
  "bieszczadzkich": "bieszczadzki, Lok. Pl.",
  "zakapiorach": "zakapior, Lok. Pl. (Bieszczady: Einzelgänger, im Text erklärt)",
  "samotnikach": "samotnik, Lok. Pl.",
  "chatach": "chata, Lok. Pl.",
  "zejściu": "zejście, Lok. Sg.",
  "migające": "migający, Akk. Sg. n.",
  "światełko": "światełko, Akk./Nom. Sg.",
  "bacówka": "bacówka, Nom. Sg.",
  "przysuwa": "przysuwać się, 3. Sg. Präs.",
  "okularze": "okular, Lok. Sg. (Okular der Luneta)",
  "latarką": "latarka, Instr. Sg.",
  "bacówce": "bacówka, Lok. Sg.",
  "zjeżdżają": "zjeżdżać, 3. Pl. Präs.",
  "miłośnicy": "miłośnik, Nom. Pl. mo",
  "podglądać": "podglądać, Inf.",
  "bagnach": "bagno, Lok. Pl.",
  "biologicznych": "biologiczny, Lok. Pl.",
  "liczeniu": "liczenie, Lok. Sg.",
  "rozlewiskach": "rozlewisko, Lok. Pl.",
  "rodowita": "rodowity, Nom. Sg. f.",
  "mieszkanka": "mieszkanka, Nom. Sg.",
  "łacińskie": "łaciński, Akk. Pl. nmo",
  "czapli": "czapla, Gen. Sg.",
  "bociana": "bocian, Gen. Sg.",
  "podśmiewa": "podśmiewać się, 3. Sg. Präs.",
  "lornetkę": "lornetka, Akk. Sg.",
  "lornetkami": "lornetka, Instr. Pl.",
  "notesem": "notes, Instr. Sg.",
  "batalony": "batalion, Nom. Pl. (Vogel: Kampfläufer)",
  "kolorowymi": "kolorowy, Instr. Pl.",
  "kołnierzami": "kołnierz, Instr. Pl.",
  "trzcin": "trzcina, Gen. Pl.",
  "wieżą": "wieża, Instr. Sg.",
  "nasłuchiwał": "nasłuchiwać, 3. Sg. Prät. m. (Subjekt: łoś)",
  "nagłych": "nagły, Gen. Pl.",
  "łosiem": "łoś, Instr. Sg.",
  "łosiątko": "łosiątko, Nom. Sg.",
  "szturchnąć": "szturchnąć, Inf. pf.",
  "groblę": "grobla, Akk. Sg.",
  "olszynach": "olszyna, Lok. Pl.",
  "rozmazana": "rozmazany, Nom. Sg. f.",
  "trzciny": "trzcina, Gen. Sg.",
  "pociesza": "pocieszać, 3. Sg. Präs.",
  "obserwator": "obserwator, Nom. Sg.",
  "przekazują": "przekazywać, 3. Pl. Präs.",
  "pracownikowi": "pracownik, Dat. Sg.",
  "kolumnie": "kolumna, Lok. Sg.",
  "rybitwę": "rybitwa, Akk. Sg.",
  "białoczelną": "białoczelny, Akk. Sg. f. (rybitwa białoczelna)",
  "szkic": "szkic, Akk. Sg.",
  "kolanie": "kolano, Lok. Sg.",
  "przyciszonym": "przyciszony, Instr. Sg. m.",
  "rybitwa": "rybitwa, Nom. Sg.",
  "rozlewisko": "rozlewisko, Akk. Sg.",
  "sfotografować": "sfotografować, Inf. pf.",
  "ruin": "ruina, Gen. Pl.",
  "skamieniałości": "skamieniałość, Gen. Pl.",
  "biletowej": "biletowy, Lok. Sg. f.",
  "nacieków": "naciek, Gen. Pl.",
  "stalaktytów": "stalaktyt, Gen. Pl.",
  "stalagmitów": "stalagmit, Gen. Pl.",
  "przewodnicy": "przewodnik, Nom. Pl. mo",
  "grupom": "grupa, Dat. Pl.",
  "neandertalczykach": "neandertalczyk, Lok. Pl.",
  "bywali": "bywać, 3. Pl. Prät. mo (Subjekt: neandertalczycy)",
  "ciekawostki": "ciekawostka, Akk. Pl.",
  "bezgłośnie": "bezgłośnie, Adverb",
  "najładniejsze": "ładny, Superlativ Nom. Pl. nmo",
  "stalagmity": "stalagmit, Nom. Pl.",
  "zgasną": "zgasnąć, 3. Pl. Fut. pf.",
  "chichocze": "chichotać, 3. Sg. Präs.",
  "włączy": "włączyć się, 3. Sg. Fut. pf.",
  "oświetlenie": "oświetlenie, Nom. Sg.",
  "neandertalczycy": "neandertalczyk, Nom. Pl. mo",
  "latarek": "latarka, Gen. Pl.",
  "stropu": "strop, Gen. Sg.",
  "kroplą": "kropla, Instr. Sg.",
  "stalaktyt": "stalaktyt, Nom. Sg.",
  "cieńszy": "cienki, Komparativ Nom. Sg. m.",
  "awaryjne": "awaryjny, Nom. Sg. n.",
  "proszą": "prosić, 3. Pl. Präs.",
  "wydziału": "wydział, Gen. Sg.",
  "geologii": "geologia, Gen. Sg.",
  "licealistów": "licealista, Gen. Pl.",
  "motywacyjny": "motywacyjny, Akk. Sg. m. unbelebt (list motywacyjny)",
  "sterem": "ster, Instr. Sg.",
  "gitarą": "gitara, Instr. Sg.",
  "przystani": "przystań, Lok. Sg.",
  "siedemnastolatka": "siedemnastolatka, Nom. Sg.",
  "sterniczką": "sterniczka, Instr. Sg.",
  "łódce": "łódka, Lok. Sg.",
  "żeglarze": "żeglarz, Nom. Pl. mo",
  "nabrzeże": "nabrzeże, Nom. Sg.",
  "keja": "keja, Nom. Sg. (Seglerwort: Steg, im Text erklärt)",
  "jachcie": "jacht, Lok. Sg.",
  "kambuz": "kambuz, Nom. Sg. (Seglerwort: Kombüse, im Text erklärt)",
  "podnoszenia": "podnoszenie, Gen. Sg.",
  "żagla": "żagiel, Gen. Sg.",
  "fał": "fał, Nom. Sg. (Seglerwort: Fall, im Text erklärt)",
  "polszczyzny": "polszczyzna, Gen. Sg.",
  "flamastrem": "flamaster, Instr. Sg.",
  "żeglarzy": "żeglarz, Gen. Pl.",
  "akordów": "akord, Gen. Pl.",
  "szant": "szanta, Gen. Pl.",
  "instruktorzy": "instruktor, Nom. Pl. mo",
  "regaty": "regaty, Akk. Pl. (Pluraletantum)",
  "załóg": "załoga, Gen. Pl.",
  "startem": "start, Instr. Sg.",
  "odwołają": "odwołać, 3. Pl. Fut. pf.",
  "wypłyną": "wypłynąć, 3. Pl. Fut. pf.",
  "sprawdzają": "sprawdzać, 3. Pl. Präs.",
  "bokiem": "bok, Instr. Sg. (adverbial: bokiem)",
  "zmniejszonych": "zmniejszony, Part. Pass. Lok. Pl.",
  "żaglach": "żagiel, Lok. Pl.",
  "sterze": "ster, Lok. Sg.",
  "szoty": "szot, Akk. Pl. (Seglerwort: Schot, im Text erklärt)",
  "żagli": "żagiel, Gen. Pl.",
  "luzuje": "luzować, 3. Sg. Präs.",
  "szot": "szot, Akk. Sg.",
  "komendy": "komenda, Akk. Pl.",
  "wzmaga": "wzmagać się, 3. Sg. Präs.",
  "przechyla": "przechylać się, 3. Sg. Präs.",
  "wychyla": "wychylać się, 3. Sg. Präs.",
  "wyrównać": "wyrównać, Inf. pf.",
  "chlapie": "chlapać, 3. Sg. Präs.",
  "wyprzedzają": "wyprzedzać, 3. Pl. Präs.",
  "steruje": "sterować, 3. Sg. Präs.",
  "hangaru": "hangar, Gen. Sg.",
  "gwizdkiem": "gwizdek, Instr. Sg.",
  "stoperem": "stoper, Instr. Sg.",
  "załoganta": "załogant, Gen. Sg.",
  "plażową": "plażowy, Akk. Sg. f.",
  "wypożyczalni": "wypożyczalnia, Lok. Sg.",
  "leżaków": "leżak, Gen. Pl.",
  "partnerka": "partnerka, Nom. Sg.",
  "boiska": "boisko, Gen. Sg.",
  "juniorskich": "juniorski, Gen. Pl.",
  "budce": "budka, Lok. Sg.",
  "konkursy": "konkurs, Akk. Pl.",
  "budowanie": "budowanie, Akk. Sg.",
  "zamków": "zamek, Gen. Pl.",
  "dowiaduje": "dowiadywać się, 3. Sg. Präs.",
  "locie": "lot, Lok. Sg.",
  "siatkę": "siatka, Akk. Sg. (umgangssprachlich: Volleyball)",
  "budki": "budka, Akk. Pl.",
  "zgraną": "zgrany, Akk. Sg. f.",
  "sygnałów": "sygnał, Gen. Pl.",
  "partnerowi": "partner, Dat. Sg.",
  "zgłaszają": "zgłaszać się, 3. Pl. Präs.",
  "wpisowe": "wpisowe, Nom. Sg. n. (substantiviert)",
  "tygodniówki": "tygodniówka, Gen. Sg.",
  "półfinale": "półfinał, Lok. Sg.",
  "zagrywkę": "zagrywka, Akk. Sg.",
  "secie": "set, Lok. Sg.",
  "sygnały": "sygnał, Akk. Pl.",
  "skandują": "skandować, 3. Pl. Präs.",
  "zagrywki": "zagrywka, Gen. Sg.",
  "siatką": "siatka, Instr. Sg.",
  "końcową": "końcowy, Akk. Sg. f.",
  "piętnastoletni": "piętnastoletni, Nom. Sg. m.",
  "boksy": "boks, Akk. Pl.",
  "sunię": "sunia, Akk. Sg.",
  "postawione": "postawiony, Part. Pass. Akk. Sg. n.",
  "operatorki": "operatorka, Gen. Sg.",
  "angielki": "angielka, Akk. Pl. (Łódź: längliches Brötchen, im Text erklärt)",
  "angielka": "angielka, Nom. Sg. (Łódź: Brötchen)",
  "podłużna": "podłużny, Nom. Sg. f.",
  "migawkę": "migawka, Akk. Sg. (Łódź: Monatskarte, im Text erklärt)",
  "krańcówki": "krańcówka, Gen. Sg. (Łódź: Endhaltestelle)",
  "notuje": "notować, 3. Sg. Präs.",
  "nakręcić": "nakręcić (film), Inf. pf.",
  "zakochuje": "zakochiwać się, 3. Sg. Präs.",
  "omijają": "omijać, 3. Pl. Präs.",
  "filmuje": "filmować, 3. Sg. Präs.",
  "łódzkie": "łódzki, Akk. Pl. nmo",
  "powiadomień": "powiadomienie, Gen. Pl.",
  "udostępnił": "udostępnić, 3. Sg. Prät. m. (Subjekt: ktoś)",
  "reklama": "reklama, Nom. Sg.",
  "angielek": "angielka, Gen. Pl.",
  "łódzkich": "łódzki, Lok. Pl.",
  "kajzerka": "kajzerka, Nom. Sg.",
  "weka": "weka, Nom. Sg. (regional: längliches Brot)",
  "dzwonią": "dzwonić, 3. Pl. Präs.",
  "wybierze": "wybrać, 3. Sg. Fut. pf.",
  "wjeździe": "wjazd, Lok. Sg.",
  "gwarę": "gwara, Akk. Sg.",
  "autorskiej": "autorski, Gen. Sg. f.",
  "finał": "finał, Nom. Sg.",
  "opolskim": "opolski, Lok. Sg. m.",
  "amfiteatrze": "amfiteatr, Lok. Sg.",
  "basową": "basowy, Akk. Sg. f.",
  "zgłaszać": "zgłaszać się, Inf.",
  "refrenie": "refren, Lok. Sg.",
  "babcine": "babciny, Akk. Pl. nmo",
  "szolka": "szolka, Nom. Sg. (gwara śląska: filiżanka, aus dem Deutschen)",
  "zgłoszeń": "zgłoszenie, Gen. Pl.",
  "zaproszeniem": "zaproszenie, Instr. Sg.",
  "półfinału": "półfinał, Gen. Sg.",
  "ociera": "ocierać, 3. Sg. Präs.",
  "szolką": "szolka, Instr. Sg. (gwara śląska)",
  "rowerami": "rower, Instr. Pl.",
  "miękko": "miękko, Adverb",
  "zwrotki": "zwrotka, Gen. Sg.",
  "refren": "refren, Akk. Sg.",
  "klaszcze": "klaskać, 3. Sg. Präs.",
  "rytmu": "rytm, Gen. Sg.",
  "finalistów": "finalista, Gen. Pl.",
  "tysiącami": "tysiąc, Instr. Pl.",
  "gwarowych": "gwarowy, Gen. Pl.",
};

/** Ogonek-Zwillinge (die Form ohne Ogonek ist hier gemeint): Wort ⇒ warum. */
const ZWILLING_GELESEN: Record<string, string> = {
  "rozpoznaje": "3. Sg. (Hania rozpoznaje), nicht 1. Sg. rozpoznaję",
  "dawna": "od dawna (feste Wendung), nicht dawną",
  "chce": "3. Sg. (Hania, Klara nie chce), nicht chcę",
  "pracuje": "3. Sg. (Hania, jurorka pracuje), nicht pracuję",
  "pisze": "3. Sg. (Zbyszek, Maja, Bruno pisze), nicht piszę",
  "ze": "Präposition ze (ze spalonego, ze sobą, ze słuchu), nicht że",
  "zostaje": "3. Sg. (zostaje kilka minut, melodia zostaje), nicht zostaję",
  "nagle": "Adverb nagle, nicht Adjektiv nagłe",
  "szkole": "Lok. Sg. (w szkole), nicht Akk. szkołę",
  "mowie": "Lok. Sg. von mowa (o mowie), nicht mówię",
  "klasa": "Nom. Sg. (klasa zwycięzców, cała klasa), nicht klasą",
  "zawsze": "Adverb zawsze",
  "znajduje": "3. Sg. (nie znajduje, znajduje miejsce), nicht znajduję",
  "mama": "Nom. Sg. (Mama wyjaśnia, mama prowadzi), nicht mamą",
  "papierowa": "Nom. Sg. f. (to papierowa torebka), nicht papierową",
  "maja": "Name Maja (Subjekt), nicht mają",
  "planuje": "3. Sg. (drużyna planuje), nicht planuję",
  "potrzebuje": "3. Sg. (program, ktoś potrzebuje), nicht potrzebuję",
  "babcia": "Nom. Sg. (Subjekt), nicht babcią",
  "zatrzymuje": "3. Sg. (robot, łoś, Julia zatrzymuje się), nicht zatrzymuję",
  "zielona": "Nom. Sg. f. (zielona rzecz, zielona buźka), nicht zieloną",
  "staje": "3. Sg. (robot, Kasia staje), nicht staję",
  "prawdziwa": "Nom. Sg. f. (prawdziwa awaria, nazwa), nicht prawdziwą",
  "tata": "Nom. Sg. (Subjekt), nicht tatą",
  "gra": "3. Sg. von grać, nicht Instr. grą",
  "skale": "Lok. Sg. (na skale), nicht Akk. skalę",
  "pierwsza": "Nom. Sg. f. (pierwsza droga, rodzina), nicht pierwszą",
  "droga": "Nom. Sg. (droga jest krótka), nicht drogą",
  "spiesz": "Imperativ (nie spiesz się); beide Schreibungen sind korrekt, gemeint ist die ohne ś",
  "noga": "Nom. Sg. (noga się trzyma), nicht nogą",
  "proponuje": "3. Sg. (trenerka, Leon, Kasia proponuje), nicht proponuję",
  "wydaje": "3. Sg. (ci się wydaje, dom wydaje się), nicht wydaję",
  "dyscyplina": "Nom. Sg. (Apposition: dyscyplina paralimpijska), nicht dyscypliną",
  "trenuje": "3. Sg. (Kacper, Kasia trenuje), nicht trenuję",
  "pojawia": "3. Sg. (pojawia się komentarz, gwiazd), nicht pojawią",
  "czuje": "3. Sg. (Kacper, Staś, Julia czuje), nicht czuję",
  "sama": "Nom. Sg. f. (sama próbuje, odpowiada, opowiada; ta sama), nicht samą",
  "grupa": "Nom. Sg. (Subjekt), nicht grupą",
  "obiecuje": "3. Sg. (Lena, Wojtek obiecuje), nicht obiecuję",
  "lekcje": "Akk. Pl. (w zamian za lekcje), nicht lekcję",
  "nauczycielka": "Nom. Sg. (Subjekt), nicht nauczycielką",
  "kanapa": "Nom. Sg. (to po polsku kanapa), nicht kanapą",
  "prace": "Akk. Pl. (sprawdzone prace), nicht pracę",
  "uwaga": "Nom. Sg. (jest uwaga), nicht uwagą",
  "rysuje": "3. Sg. (Kuba rysuje), nicht rysuję",
  "blednie": "3. Sg. von blednąć (wird blass), nicht Adverb błędnie",
  "wola": "Name Żelazowa Wola, nicht wolą oder woła",
  "te": "Nom./Akk. Pl. (te koncerty, takie jak te, te wyrazy), nicht tę",
  "przygotowuje": "3. Sg. (Staś przygotowuje), nicht przygotowuję",
  "dziewczyna": "Nom. Sg. (Subjekt), nicht dziewczyną",
  "wykonuje": "3. Sg. (dziewczyna, Adam wykonuje), nicht wykonuję",
  "nic": "Pronomen nic, nicht nić (Faden)",
  "ta": "Nom. Sg. f. (ta sama, a ta ociera), nicht tą",
  "przestaje": "3. Sg. (przestaje notować, żartować), nicht przestaję",
  "ida": "Name Ida (Subjekt), nicht idą",
  "czerwona": "Nom. Sg. f. (czerwona buźka), nicht czerwoną",
  "dostaje": "3. Sg. (szkoła, Oliwer, Oskar dostaje), nicht dostaję",
  "najlepsza": "Nom. Sg. f. (odległość, najlepsza; najlepsza reklama), nicht najlepszą",
  "kobieta": "Nom. Sg. (Subjekt), nicht kobietą",
  "myje": "3. Sg. (Oliwer myje), nicht myję",
  "opiekunka": "Nom. Sg. (Subjekt), nicht opiekunką",
  "studiuje": "3. Sg. (Amelia studiuje), nicht studiuję",
  "chora": "Nom. Sg. f. (foka jest chora), nicht chorą",
  "zadanie": "zadanie (Aufgabe), nicht żądanie (Forderung)",
  "pokaz": "Akk./Nom. Sg. von pokaz, nicht Imperativ pokaż",
  "blacha": "Nom. Sg. (leży blacha, druga blacha), nicht blachą",
  "piec": "Infinitiv piec (backen: jak piernika nie piec), nicht pięć",
  "jedna": "Nom. Sg. f. (jedna nazwa, porcja, z jurorek), nicht jedną",
  "druga": "Nom. Sg. f. (druga niemiecka, blacha, rodzina), nicht drugą",
  "plac": "Name Plac Litewski, nicht płac",
  "zajmuje": "3. Sg. (Bartosz zajmuje się, drużyna zajmuje), nicht zajmuję",
  "interesuje": "3. Sg. (Zuza interesuje się), nicht interesuję",
  "ciocia": "Nom. Sg. (Subjekt), nicht ciocią",
  "owce": "Akk. Pl. (wypasali owce), nicht owcę",
  "jasna": "Nom. Sg. f. (jasna smuga), nicht jasną",
  "gwiazda": "Nom. Sg. (była spadająca gwiazda), nicht gwiazdą",
  "mieli": "3. Pl. Prät. von mieć (mieli mieszkać), nicht mięli (von miąć)",
  "dala": "z dala (feste Wendung), nicht dała",
  "stara": "Nom. Sg. f. (stara bacówka), nicht starą",
  "pusta": "Nom. Sg. f. (pusta bacówka, plaża jest pusta), nicht pustą",
  "rude": "Nom. Sg. n. (rude łosiątko), nicht rudę (Erz)",
  "matka": "Nom. Sg. (Subjekt), nicht matką",
  "sprzedaje": "3. Sg. (Julia sprzedaje), nicht sprzedaję",
  "woda": "Nom. Sg. (Subjekt), nicht wodą",
  "kapie": "3. Sg. von kapać (tropft), nicht kąpie (badet)",
  "trasa": "Nom. Sg. (Subjekt), nicht trasą",
  "burza": "Nom. Sg. (Subjekt), nicht burzą",
  "przyjmuje": "3. Sg. (Bartosz przyjmuje), nicht przyjmuję",
  "przyznaje": "3. Sg. (Bartosz przyznaje), nicht przyznaję",
  "denerwuje": "3. Sg. (Bartosz, Klara denerwuje się), nicht denerwuję",
  "kupuje": "3. Sg. (Bruno kupuje), nicht kupuję",
  "los": "los (Schicksal), nicht łoś",
  "spieszy": "3. Sg. (nikt się nie spieszy); beide Schreibungen korrekt, gemeint ist die ohne ś",
  "taka": "Nom. Sg. f. (taka bułka), nicht taką",
  "rodzina": "Nom. Sg. (Subjekt), nicht rodziną",
  "trzecia": "Nom. Sg. f. (a trzecia to), nicht trzecią",
  "tablice": "Nom. Pl. (tablice mają), nicht tablicę",
  "niemiecka": "Nom. Sg. f. (druga niemiecka), nicht niemiecką",
  "kolega": "Nom. Sg. (Subjekt), nicht kolegą",
  "daje": "3. Sg. (Daniel daje), nicht daję",
};

// ── 1 · Form ──────────────────────────────────────────────────────────────

describe("1 · Form jeder Zeile und jeder Serie", () => {
  it("jede Zeile besteht die Form-, Zahl- und Inhaltsregeln", () => {
    const fehler = S.flatMap((s) => zeilenVon(s).flatMap((z) => zeilenProbleme(z, namenVon(s)).map((f) => `${s.slug}: ${f} - ${z}`)));
    expect(fehler, fehler.slice(0, 30).join("\n")).toEqual([]);
  });

  it("20 Serien für Jugendliche, 19 mit 2 Etappen und genau eine mit 3, je Etappe 14-16 Zeilen, offenes Ende, Eigennamen kommen vor", () => {
    expect(S.length).toBe(20);
    expect(S.filter((s) => s.etappen.length === 3).length).toBe(1);
    expect(S.filter((s) => s.etappen.length === 2).length).toBe(19);
    const fehler = S.flatMap((s) => serienFormFehler(s, "teens", 14, 16));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Slugs eindeutig mit Vorsilbe pl-teens-1-, minTier eingetragen, Titel ohne fremde Zeichen", () => {
    expect(new Set(S.map((s) => s.slug)).size).toBe(S.length);
    for (const s of S) {
      expect(s.slug.startsWith(VORSILBE), s.slug).toBe(true);
      expect(s.minTier, s.slug).toBeDefined();
      expect(/^[\p{L} ,]+$/u.test(s.titel), s.titel).toBe(true);
    }
  });

  it("mindestens 12 der 20 Serien ohne Ziffern (sie öffnen früh)", () => {
    expect(S.length - mitZiffern(S)).toBeGreaterThanOrEqual(12);
  });

  it("Sprache als Faden: mindestens 10 Serien, jede Angabe ist eine Serie dieser Charge", () => {
    expect(SPRACHE_ALS_FADEN.length).toBeGreaterThanOrEqual(10);
    for (const slug of SPRACHE_ALS_FADEN) expect(EIGENE_SLUGS.has(slug), slug).toBe(true);
  });
});

describe("Gegenproben zur Form", () => {
  const leer = new Set<string>();
  it("gute Zeilen sind grün", () => {
    expect(zeilenProbleme("\"Startujemy o 7:15!\" mówi trener Marek.", new Set(["marek"]))).toEqual([]);
    expect(zeilenProbleme("Bilet do kina kosztuje 25 zł, a rabat wynosi 15%.", leer)).toEqual([]);
    expect(zeilenProbleme("Ola czyta książkę pismem Braille'a.", new Set(["ola", "braille'a"]))).toEqual([]);
  });

  it.each([
    ["Ola jedzie do Bielska-Białej pociągiem.", "Bindestrich"],
    ["Ola (kapitanka) prowadzi drużynę.", "Zeichen ausserhalb"],
    ["Bilet kosztuje dziś 5 € w kasie.", "Zeichen ausserhalb"],
    ["Ola mówi „cześć” do całej klasy.", "Zeichen"],
    ["Czy Ola idzie dziś na trening ?", "Leerzeichen vor"],
    ["Najważniejsze to: spokój i woda.", "to“"],
    ["Ola gra dobrze.", "3 Wörter"],
    ["Ola gra w siatkówkę w klubie w Rzeszowie od trzech lat i trenuje cztery razy w tygodniu po południu z siostrą.", "21 Wörter"],
    ["Ola gra w siatkę. Potem idzie do domu.", "mehr als ein Satz"],
    ["ola gra w siatkę w klubie.", "kein Grossbuchstabe"],
    ["Ola gra w siatkę w klubie", "kein Satzschluss"],
    ["\"Szybciej! woła trener do Oli.", "ungerade"],
    ["Rabat 20 % dziś dla wszystkich.", "Prozent"],
    ["Trening zaczyna się o 8.00 przy hali.", "Punkt zwischen Ziffern"],
    ["Ola zajmuje 2. miejsce w turnieju.", "Ordnungszahl"],
    ["Bilet kosztuje 20zł w kasie kina.", "Betrag"],
    ["Bilet kosztuje zł 20 w kasie kina.", "Betrag"],
    ["Kasia czeka na Olę przed szkołą.", "kein Eigenname der Serie: Olę"],
    ["Ten film jest naprawdę zajebisty.", "Sperrwort"],
    ["Wujek Oli jest gruby i wesoły.", "Sperrwort gruby"],
  ])("rot: %s", (zeile, erwartet) => {
    expect(zeilenProbleme(zeile, new Set(["ola", "oli"])).join(" | ")).toContain(erwartet);
  });

  it("rot: Serie mit 13 Zeilen, mit 1 Etappe, ohne offenes Ende, mit fremdem Eigennamen; zu viele Ziffern-Serien", () => {
    const basis = (): SerieEntwurfPl => JSON.parse(JSON.stringify(S[1]));
    const a = basis();
    a.etappen[0].lines = a.etappen[0].lines.slice(0, 13);
    expect(serienFormFehler(a, "teens", 14, 16).join(" ")).toContain("13 Zeilen");
    const b = basis();
    b.etappen = b.etappen.slice(0, 1);
    expect(serienFormFehler(b, "teens", 14, 16).join(" ")).toContain("1 Etappen");
    const c = basis();
    c.etappen[0].lines[c.etappen[0].lines.length - 1] = "Igor wraca do domu i odrabia lekcje.";
    expect(serienFormFehler(c, "teens", 14, 16).join(" ")).toContain("endet ohne");
    const d = { ...basis(), eigennamen: [...basis().eigennamen, "Gniezno"] };
    expect(serienFormFehler(d, "teens", 14, 16).join(" ")).toContain("Eigenname Gniezno");
    const e = { ...basis(), stufen: ["kids"] as SerieEntwurfPl["stufen"] };
    expect(serienFormFehler(e, "teens", 14, 16).join(" ")).toContain("stufen");
    const ziffer = { ...basis(), etappen: [{ lines: ["Trening jest o 7:15 rano."] }] };
    expect(mitZiffern(Array.from({ length: 9 }, () => ziffer))).toBe(9);
  });
});

// ── 2 · Inhalt ────────────────────────────────────────────────────────────

describe("2 · Inhalt: Anrede, Geschlecht, Feiertage, Politik, Person zuerst", () => {
  it("keine Zeile trägt Anrede, Geschlecht der tippenden Person, Feiertag, Religion, Politik oder ein Etikett", () => {
    const fehler = ZEILEN.filter((z) => ANREDE.test(z) || geschlechtFehler(z) || feiertagIn(z) || politikIn(z) || etikettIn(z));
    expect(fehler).toEqual([]);
  });

  it.each([
    ["Proszę pani, gdzie jest sala gimnastyczna?", ANREDE.test.bind(ANREDE)],
    ["\"Wygraliśmy 3:2!\" krzyczy kapitan drużyny.", geschlechtFehler],
    ["\"Byłam wczoraj na koncercie!\" mówi Ola.", geschlechtFehler],
    ["\"Jesteś gotowa na egzamin?\" pyta Kuba.", geschlechtFehler],
    ["\"Chciałbym zagrać w finale!\" mówi Kuba.", geschlechtFehler],
    ["W Wigilię cała rodzina siedzi przy stole.", feiertagIn],
    ["Po lekcjach Ola idzie do kościoła.", feiertagIn],
    ["W niedzielę są wybory do sejmu.", politikIn],
    ["Niewidomy Kuba czyta książkę na lekcji.", etikettIn],
  ])("rot: %s", (zeile, regel) => {
    expect((regel as (z: string) => boolean)(zeile)).toBe(true);
  });

  it("grün: 3. Person in der Vergangenheit, Instrumental auf -łem, die Woiwodschaft świętokrzyskie", () => {
    expect(geschlechtFehler("Kacper dopłynął trzeci, a Ula wszystko nagrała.")).toBe(false);
    expect(geschlechtFehler("Hania pisze hasłem do zeszytu.")).toBe(false);
    expect(feiertagIn("Julia mieszka w województwie świętokrzyskim.")).toBe(false);
  });
});

// ── 3 · Regionen ──────────────────────────────────────────────────────────

describe("3 · alle 16 Woiwodschaften", () => {
  it("jede Woiwodschaft mindestens einmal, keine mehr als zweimal", () => {
    const m = proWoiwodschaft(S);
    expect(m.size).toBe(16);
    const fehler = [...m].filter(([, n]) => n < 1 || n > 2).map(([w, n]) => `${w}: ${n}`);
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: eine Woiwodschaft dreimal, eine fehlt", () => {
    const verschoben = S.map((s, i) => (i < 3 ? { ...s, land: "opolskie" as const } : s));
    const m = proWoiwodschaft(verschoben);
    expect([...m].some(([, n]) => n > 2)).toBe(true);
    expect([...m].some(([, n]) => n < 1)).toBe(true);
    expect(WOIWODSCHAFTEN_PL.length).toBe(16);
  });
});

// ── 4 · Wortschatz ────────────────────────────────────────────────────────

describe("4 · Wortschatz", () => {
  it("kein Inhaltswort in mehr als 8 Zeilen der Charge (Eigennamen ausgenommen)", () => {
    expect(zuHaeufig(ZEILEN, NAMEN_ALLE)).toEqual([]);
  });

  it("Gegenprobe: ein Wort in 9 Zeilen wird gemeldet, in 8 nicht; ein Name und ein Funktionswort nie", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `Kuba ma rower numer ${i} i jest bardzo szczęśliwy.`);
    expect(zuHaeufig(neun, new Set())).toContain('"rower": 9 Zeilen');
    expect(zuHaeufig(neun.slice(0, 8), new Set()).some((x) => x.includes("rower"))).toBe(false);
    expect(zuHaeufig(neun, new Set()).some((x) => x.includes('"kuba"'))).toBe(true);
    expect(zuHaeufig(neun, new Set(["kuba"])).some((x) => x.includes('"kuba"'))).toBe(false);
    expect(zuHaeufig(neun, new Set()).some((x) => x.includes('"jest"') || x.includes('"i"'))).toBe(false);
  });

  it("kein Wort der Sperrliste (Kern und Wortbasis)", () => {
    expect(ZEILEN.flatMap((z) => pruefWoerter(z).filter((w) => gesperrtPl(w)))).toEqual([]);
  });

  it("jedes Wort steht in der Wortbasis, unter den Eigennamen der Serie oder in VON_HAND_BELEGT", () => {
    const fehlt = S.flatMap((s) => ungeprueft(zeilenVon(s), VON_HAND_BELEGT, namenVon(s)).map((w) => `${s.slug}: ${w}`));
    expect(fehlt, fehlt.slice(0, 40).join("\n")).toEqual([]);
  });

  it("VON_HAND_BELEGT trägt nur gebrauchte Wörter, die nicht in der Wortbasis stehen, jede mit Begründung", () => {
    const benutzt = new Set(ZEILEN.flatMap(pruefWoerter));
    const fehler = Object.entries(VON_HAND_BELEGT).filter(([w, b]) => !benutzt.has(w) || BASIS.has(w) || b.trim().length < 4).map(([w]) => w);
    expect(fehler).toEqual([]);
  });

  it("jeder Ogonek-Zwilling ist gelesen - die Liste ist genau die gebrauchte", () => {
    expect([...zwillingWoerter(ZEILEN)].sort()).toEqual(Object.keys(ZWILLING_GELESEN).sort());
    for (const [w, b] of Object.entries(ZWILLING_GELESEN)) expect(b.trim().length, w).toBeGreaterThan(3);
  });

  it("Gegenprobe: ein unbelegtes Wort, ein Sperrwort und ein Zwilling werden gefunden", () => {
    expect(ungeprueft(["Hania kupuje xyzowy rower."], {}, new Set(["hania"]))).toEqual(["xyzowy"]);
    expect(ungeprueft(["Hania kupuje xyzowy rower."], { xyzowy: "Probe" }, new Set(["hania"]))).toEqual([]);
    expect(gesperrtPl("cholera")).toBe(true);
    expect(gesperrtPl("kurczak")).toBe(false);
    expect(zwillingWoerter(["Ola mowi, ze idzie do kina."]).has("ze")).toBe(true);
  });
});

// ── 5 · Kopien, Paare, fast gleich ────────────────────────────────────────

describe("5 · keine Kopie, kein Paar, nichts fast gleich", () => {
  const ANDERE_PL = anderePlZeilen(EIGENE_SLUGS);
  const FREMD = alleFremdenZeilen(EIGENE_SLUGS);

  it("keine Zeile doppelt - auch nicht ohne Satzzeichen oder nach dem Ledger-Schlüssel", () => {
    const text = ZEILEN.map(ohneSatzzeichen);
    const key = ZEILEN.map((z) => bausteinKey("satz", z));
    expect(text.length - new Set(text).size).toBe(0);
    expect(key.length - new Set(key).size).toBe(0);
  });

  it("keine Kopie eines polnischen Korpus- oder Serientextes und keines Textes einer anderen Sprache oder Bank", () => {
    expect(kopienGegen(ZEILEN, [...ANDERE_PL, ...FREMD])).toEqual([]);
  });

  it("keine Paare - untereinander und gegen jede andere pl-Zeile", () => {
    expect(paare(ZEILEN, ANDERE_PL)).toEqual([]);
  });

  it("nichts fast gleich: untereinander und gegen pl ab 0,5, gegen alles andere ab 0,6", () => {
    const f = [...fastGleichUntereinander(ZEILEN, 0.5), ...fastGleich(ZEILEN, ANDERE_PL, 0.5), ...fastGleich(ZEILEN, FREMD, 0.6)];
    expect(f, f.slice(0, 20).join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie mit anderen Satzzeichen, Paar, fast gleich - und der Präfix-Filter findet dasselbe wie der volle Vergleich", () => {
    const k = PL_ROH[100].text;
    expect(kopienGegen([k.replace(/[.!?]$/, "!")], [k]).length).toBe(1);
    expect(paare(["On jedzie rowerem do szkoły w Lesznie.", "Ona jedzie rowerem do szkoły w Lesznie."]).length).toBe(1);
    expect(fastGleichUntereinander(["Hania naprawia motocykl w parku maszyn.", "Olek naprawia motocykl w parku maszyn."], 0.5).length).toBe(1);
    // Stichprobe: 20 eigene Zeilen gegen 800 Korpuszeilen und gegen dieselben 20 mit je einem getauschten Wort (Treffer
    // sind damit sicher da); der Präfix-Filter muss bei jeder Grenze genau die Paare des vollen Vergleichs finden.
    const probe = ZEILEN.slice(0, 20);
    const verwandt = probe.map((z) => z.replace(/^(\S+\s+\S+)/, "$1 ponownie"));
    const gegen = [...ANDERE_PL.slice(0, 800), ...verwandt];
    for (const g of [0.3, 0.5, 0.6]) expect(fastGleich(probe, gegen, g).sort()).toEqual(fastGleichVoll(probe, gegen, g).sort());
    expect(fastGleichVoll(probe, gegen, 0.5).length).toBeGreaterThanOrEqual(20);
  });
});

// ── 6 · Weg „pl" ──────────────────────────────────────────────────────────

/** Die Wörter einer Fassung, Satzzeichen am Rand weg - eine servierte Fassung darf kein Wort verlieren oder ändern. */
const wortFolge = (t: string) =>
  t
    .split(/\s+/)
    .map((w) => w.replace(/^[.,?!":;()]+|[.,?!":;()]+$/g, ""))
    .filter(Boolean)
    .join(" ");
/** Fassungen einer Zeile zwischen erster und voller Sprosse, die ein Wort verlieren oder ändern. */
function verstuemmelt(z: string): string[] {
  const b = ersteSprosse(z);
  const v = volleSprosse(z);
  if (b === null || v === null) return [`nie vollständig: ${z}`];
  const out: string[] = [];
  for (let n = b; n < v; n++) {
    const f = fitText(z, allowedAt(n), "pl");
    if (f !== null && wortFolge(f) !== wortFolge(z)) out.push(`n=${n}: ${f}`);
  }
  return out;
}

describe("6 · Weg pl: minTier, Sprossen, gekürzte Fassungen", () => {
  it("jede Serie besteht validateSerie(s, \"pl\") - minTier eingetragen == gerechnet", () => {
    for (const s of S) {
      const { ok, problems } = validateSerie(s as unknown as Serie, "pl");
      expect(ok, `${s.slug}: ${problems.join("; ")}`).toBe(true);
      expect(s.minTier).toBe(computeSerieMinTier(s as unknown as Serie, "pl"));
    }
  });

  it("Gegenprobe: ein falsch eingetragenes minTier und eine Zeile mit „ä\" werden abgelehnt", () => {
    const s = S[0] as unknown as Serie;
    expect(validateSerie({ ...s, minTier: (((s.minTier as number) + 1) % 6) as Serie["minTier"] }, "pl").ok).toBe(false);
    const fremd: Serie = { ...s, etappen: [{ lines: ["Hania jedzie do Mädchenschule w Lesznie.", ...s.etappen[0].lines.slice(1)] }, s.etappen[1]] };
    expect(computeSerieMinTier(fremd, "pl")).toBeNull();
  });

  it("jede Serie öffnet an der gemessenen Einheit (OEFFNET)", () => {
    const gemessen = Object.fromEntries(S.map((s) => [s.slug, oeffnetEinheit(s)]));
    expect(gemessen).toEqual(OEFFNET);
  });

  it("jede Zeile kommt vollständig, und keine servierte Fassung verliert oder ändert ein Wort", () => {
    const f = ZEILEN.flatMap(verstuemmelt);
    expect(f, f.slice(0, 10).join("\n")).toEqual([]);
  });

  it("eine Ziffern-Zeile kommt nie halb: erste Sprosse == volle Sprosse, davor liefert fitText null", () => {
    const fehler: string[] = [];
    for (const z of ZEILEN.filter((x) => /\d/.test(x))) {
      const v = volleSprosse(z);
      if (v === null || ersteSprosse(z) !== v) fehler.push(z);
      else if (fitText(z, allowedAt(v - 1), "pl") !== null) fehler.push(`halb: ${z}`);
    }
    expect(fehler).toEqual([]);
    expect(ZEILEN.filter((x) => /\d/.test(x)).length).toBeGreaterThan(0);
  });

  it("gekürzt serviert steht kein Grosswort mitten im Satz, das kein Eigenname der Serie ist", () => {
    const f = S.flatMap((s) => zeilenVon(s).flatMap((z) => gekuerztFehler(z, namenVon(s)).map((x) => `${s.slug}: ${x} - ${z}`)));
    expect(f).toEqual([]);
  });

  it("Gegenprobe: Rede hinten wird gekürzt zum Grosswort, ein Bindestrich verstümmelt, eine Fragezeile kommt vorher gekürzt", () => {
    expect(gekuerztFehler("Trener woła do drużyny: \"Szybciej!\"", new Set()).length).toBeGreaterThan(0);
    expect(gekuerztFehler("\"Szybciej!\" woła trener Marek.", new Set(["marek"]))).toEqual([]);
    expect(verstuemmelt("Ola pije coca-colę na plaży w Sopocie.").length).toBeGreaterThan(0);
    const frage = "Czy Ola idzie jutro na trening?";
    expect(ersteSprosse(frage)!).toBeLessThan(volleSprosse(frage)!);
    expect(ordnung()[(volleSprosse("Trening jest o 7:15 rano.") ?? 0) - 1]).toBe("7");
  });
});

// ── 7 · eingehängt ────────────────────────────────────────────────────────

describe("7 · eingehängt: SERIEN_PL und SERIEN, frei nur für Jugendliche auf Weg pl", () => {
  it("jede Serie steht genau einmal in SERIEN_PL und in SERIEN, mit lang pl", () => {
    for (const s of S) {
      expect(SERIEN_PL.filter((t) => t.slug === s.slug).length, s.slug).toBe(1);
      const inSerien = SERIEN.filter((t) => t.slug === s.slug);
      expect(inSerien.length, s.slug).toBe(1);
      expect(inSerien[0].lang).toBe("pl");
    }
  });

  it("mit allen Einheiten des Weges sind alle 20 für Jugendliche frei - für Kinder, Erwachsene und auf Weg it keine", () => {
    setLayout("pl");
    const alle = allowedFromIntroduced(introOrder("pl"), "pl");
    const teens = new Set(unlockedSerien(alle, "teens", "pl", "pl").map((s) => s.slug));
    for (const s of S) expect(teens.has(s.slug), s.slug).toBe(true);
    for (const stufe of ["kids", "erwachsen"] as const) {
      const frei = new Set(unlockedSerien(alle, stufe, "pl", "pl").map((s) => s.slug));
      expect(S.filter((s) => frei.has(s.slug)).map((s) => s.slug), stufe).toEqual([]);
    }
    const it_ = new Set(unlockedSerien(alle, "teens", "pl", "it").map((s) => s.slug));
    expect(S.filter((s) => it_.has(s.slug))).toEqual([]);
  });

  it("Gegenprobe: mit der Grundreihe allein ist keine dieser Serien frei", () => {
    setLayout("pl");
    const wenig = allowedFromIntroduced(introOrder("pl").slice(0, 8), "pl");
    const frei = unlockedSerien(wenig, "teens", "pl", "pl").map((s) => s.slug);
    expect(S.filter((s) => frei.includes(s.slug))).toEqual([]);
  });
});
