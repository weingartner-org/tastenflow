/**
 * Korpus nur für Lernweg "cs", mittlere Sprossen 18-44 (⇧ bis ¨) - Altersstufe ERWACHSENE
 * (CS-T6, 09.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` §4
 * Etappe T; Befund `BEFUND-2026-10-09-CS-T6-ERWACHSENE-MITTE.md`). Vorgehen nach CS-T3
 * (Erwachsene früh) und CS-T4 (gleiche Sprossen, Kinder), Form nach PL-T6.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß", „die texte sollen einen bezug zum land und
 * sprache haben" und „denke wie die menschen in den jeweiligen ländern". ALLES NEU
 * AUF TSCHECHISCH VERFASST - keine Text-Datei einer anderen Sprache als Inhalt
 * geöffnet, nichts übersetzt, kein Tatoeba-Satz (darum auch kein `herkunft`).
 *
 * ZEICHENSATZ (`introOrder("cs")`, auf `cs` UND `cs-qwerty` dieselbe Folge):
 *   18 ⇧ · 19 . · 20 , · 21 ? (`punktNachShift`, weglassbar) ·
 *   22-36 í p c h á r z b y ž š ř č é ý · 37 ˇ (Totaste: ď ť ň, grosse Č Š Ř Ž …) ·
 *   38 g · 39 ú · 40 x · 41 ´ (Totaste: ó, grosse Á É Í Ú …) · 42 w · 43 q · 44 ¨.
 * Die Sprosse jeder Zeile rechnet der Wächter aus (`fitText`, mindestens ⇧),
 * `minTier` rechnet `minTierFor(text, "cs")`, nicht die Hand. Sortiert nach Sprosse.
 *
 * ★ ERWACHSENE UND ⇧ (D-2, `nurKleinschrift`): Erwachsene bekommen vor ⇧ KEINE
 * Zeile mit Grossbuchstaben - die Auto-Grossschreibung der Kinder gibt es für sie
 * nicht. Jede Zeile hier beginnt gross, kommt also frühestens an ⇧ (18) an. Darum
 * trägt diese Charge (anders als CS-T4) sieben eigene ⇧-Zeilen nur aus den
 * Buchstaben bis `u` („Matěj, kde je sklad?"): an 18-21 üben Erwachsene so ⇧ . , ?
 * mit Wörtern, die sie schon kennen. `. , ?` haben keine eigene Sprosse (weglassbar).
 * Grosse Akzentbuchstaben: Č Š Ř Ž erst an 37, Á É Í Ú erst an 41 (`grossAkzentSpaet`).
 *
 * FORM: Satzanfang gross, Namen und Orte gross, jede Zeile endet mit Punkt oder
 * Fragezeichen; Komma bei Anrede und zwischen Sätzen. Kein `! " : ; - '` und keine
 * Ziffern (kommen ab 45) - Beträge und Zeiten als Wörter („o pět set", „ve dvanáct").
 *
 * GESCHLECHT der tippenden Person: keine Vergangenheit und kein hartes Adjektiv mit
 * „jsem/jsi", kein „rád/ráda", keine Ehe-Rolle (manžel, manželka); 1. Person nur im
 * Präsens/Futur oder in der Mehrzahl („Hypotéku splácíme …", „Družstevní byt jsme
 * převedli …"). Vergangenheit nur bei benannten Personen oder Dingen.
 *
 * ERWACHSENENALLTAG: Arbeit (směna, porada, výplata, výpověď, přesčasy, agentura,
 * úřad práce, rekvalifikace) · Ämter (datová schránka, ČSSZ, finanční úřad, daň z
 * nemovitostí, občanka, pas, Portál občana, bankovní identita) · Wohnen (nájem, kauce,
 * zálohy, vyúčtování, SVJ, družstevní byt, hypotéka, kotlíkové dotace) · Gesundheit
 * (zdravotní pojišťovna, neschopenka, nemocenská, zubař, pohotovost, odběr krve) ·
 * Familie (rodičovská, školka, zápis, babička hlídá) · Reisen und Verkehr (dálniční
 * známka, Lítačka, kolona, Chorvatsko, Polsko) · Erblindung ohne Etikett (hlasový
 * výstup, bílá hůl, vodicí pes, zvukový signál) · Migration sachlich (Olena, Taras, Thanh).
 * Keine Feiertage.
 *
 * ORTE aus allen vierzehn Kraje, Böhmen UND Mähren/Schlesien (Wächter zählt):
 * Praha (nájmy, Lítačka) · Středočeský (Kladno, Kolín, Poděbrady) · Jihočeský
 * (Budějovice, Šumava, Třeboňsko) · Plzeňský (Plzeň, Klatovy) · Karlovarský
 * (Sokolovsko, Chebsko) · Ústecký (Žatec, Ústí) · Liberecký (Turnov) ·
 * Královéhradecký (Krkonoše) · Pardubický (Pardubice) · Vysočina (Humpolec) ·
 * Jihomoravský (Brno, Mikulov, Pasohlávky, jižní Morava) · Olomoucký (Haná,
 * Prostějov) · Zlínský (Luhačovice, Otrokovice) · Moravskoslezský (Ostrava,
 * Kopřivnice, Třinec, Těšínsko, Beskydy).
 *
 * Sperrliste `sperrlisteCs.ts`: kein Wort aus Kern ODER Wortbasis.
 * Wächter: `tests/tastenflow-texte-cs-erwachsene-mitte.test.ts`. Nur anhängen -
 * Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_CS_WEG_MITTE_ERWACHSENE: CorpusItem[] = [
  // Sprosse 18 (`⇧`)
  { text: "Ivana je online od osmi.", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "Matěj, kde je sklad?", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "Kde se sejdeme, u kina?", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "Matěj je na směně do deseti.", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "Klient je tu, Moniko, odemkni.", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "Tak jo, Ivano, v sedm dole.", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "Do Mikulova nejede ani linka.", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  // Sprosse 22 (`í`)
  { text: "V dílně dnes nikdo není.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Vedení se sejde online v deset.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Domluvíme se mailem.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Jíme v jídelně u skladu.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Tak nevím, uvidíme.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Nikdo neví, kolik to stojí.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Nevíme, kdo to odeslal.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Kominík je tu od devíti.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Jídelní lístek visí venku.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Kolik lidí se sejde?", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // Sprosse 23 (`p`)
  { text: "V pondělí se vidíme v sedm.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Jsme spolu deset let.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Pondělní mítink povede Ivana.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Pokladna je u vstupu.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Pokutu dostal Milan.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Plat se letos nemění.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Do pondělí je volno.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Po směně jsme ospalí.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "V Polsku se tankuje levněji.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Dopoledne jsme doma, odpoledne venku.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // Sprosse 24 (`c`)
  { text: "Cestou nakoupíme ovoce.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "V lednici nic není.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Ceník se mění od ledna.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Klientce se omluvíme.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Otec je v nemocnici.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Policie stojí u mostu.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na konci měsíce se uvidí.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Ve skladu se svítí celou noc.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // Sprosse 25 (`h`)
  { text: "V koloně stojíme hodinu.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Hospoda je hned vedle kostela.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Hotel je kousek od stanice.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Hlavní vchod je vlevo.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Nikdo nechce nedělní směnu.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Nemohli jsme se dovolat.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Pomalu, venku je mlha.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Ve vchodu nesvítí světlo.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Stěhujeme se do Kolína.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // Sprosse 26 (`á`)
  { text: "Na uhlí se u nás netopí.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Nájem stoupl o pět set.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Dálnice je dnes ucpaná.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "V pátek se dělá jen do dvou.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Káva je dnes na mně.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Nákup udělá Kamil.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na návsi stojí lípa.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Táta dnes hlídá děti.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "V poledne slunce pálí, pijte vodu.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na náměstí se sejdeme v pět.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // Sprosse 27 (`r`)
  { text: "Práce je hodně, lidí málo.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Porada se odkládá na pondělí.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na recepci se ptejte.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Auto je v opravně.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Ranní směna je od pěti do dvou.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Termín se posouvá.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Pan doktor má dovolenou.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Faktura je po splatnosti.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Dcera pracuje v nemocnici.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na hranicích s Polskem se nekontroluje.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Jirka chodí do práce s vodicím psem.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // Sprosse 28 (`z`)
  { text: "Rodina se schází v neděli u stolu.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Zálohu zaplatíme do pátku.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Trávu sekáme dvakrát za měsíc.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Ivanu zastupuje Milan.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na zájezd se platí záloha.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Zima je letos krátká.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Nezaměstnanost na Ostravsku klesá.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na zítra hlásí mráz.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Parkování je tu zdarma.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Do vozíku se dává mince.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Zelí si nakládáme doma.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Zítra máme poradu v devět.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Sousedi pod námi zase vrtají.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na dálnici u Humpolce se zase opravuje.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Jízdenka je v aplikaci.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na dovolenou jezdíme do Chorvatska.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Ozvete se do pátku?", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // Sprosse 29 (`b`)
  { text: "Obec staví chodník.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na oběd se chodí ve dvanáct.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Obchod u nás zavírá v sedm.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Bolí mě záda.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Bez receptu to nedostanete.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Banka otevírá v devět.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Olena dělá zdravotní sestru v Brně.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Z Brna je to do Vídně kousek.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Platí se kartou nebo hotově?", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // Sprosse 30 (`y`)
  { text: "Ve strojírně se dělá na směny.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Obecní rozhlas hlásí odstávku vody.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Hledáme byt dva plus jedna.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Syn studuje v Brně.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Dostaneme dva dny volna.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Z Kladna do Prahy jezdí autobusy.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Ve sklepě máme brambory na zimu.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Děti jsou o víkendu u táty.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Ceny v obchodech zase vzrostly.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "V Otrokovicích se vyrábějí pneumatiky.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "V Plzni se staví tramvaje i trolejbusy.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // Sprosse 31 (`ž`)
  { text: "Pronájem nám prodloužili o rok.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Zboží dorazí zítra.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Lyže jsou ve sklepě.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Družstvo hledá traktoristu.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Myslíme, že to stihneme.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Směnu si můžeme vyměnit.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na pohovor si vezměte životopis.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Do Klatov dojíždíme za prací.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Mamce voláme každou neděli.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Bramboráky se smaží na sádle.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Na Chebsku se dojíždí za prací do Německa.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Kdo slouží v neděli?", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // Sprosse 32 (`š`)
  { text: "Balík je na poště.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Pošleme to datovkou.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na kašel pomáhá med.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Naše firma má sídlo v Kolíně.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Pracovní smlouvu podepíšeme v pondělí.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na Těšínsku se mluví po našimu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Praze jsou nájmy nejdražší.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Do školky se zapisuje v květnu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Tchyně bydlí ve vedlejší vesnici.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Krkonoších leží sníh i v dubnu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Prostějově se šijí obleky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kde je tu nejbližší bankomat?", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 33 (`ř`)
  { text: "Půlka lidí je doma s chřipkou.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Podáme žádost o příspěvek.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Zkušební doba je tři měsíce.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Kopřivnici se vyrábějí nákladní auta.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Třinci se vaří ocel.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Budvar se vaří v Budějovicích.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "K zubaři se objednáváme půl roku dopředu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Družstevní byt jsme převedli do osobního vlastnictví.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na chatě se topí dřevem.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Popelnice se vyváží ve středu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Zápis do první třídy je v dubnu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Dědovi je osmdesát a pořád řídí.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Svatbu chystáme na září.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Z Prahy do Ostravy je to vlakem přes tři hodiny.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Beskydech se dobře chodí po hřebenech.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Vepřo knedlo zelo je nedělní klasika.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kulajda se vaří s houbami a vejcem.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Heslo do banky nikomu neříkáme.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Zprávu z banky si raději ověřte telefonem.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 34 (`č`)
  { text: "Noční směna končí v šest.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "U nás v obci jsou dobrovolní hasiči.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Přesčasy se proplácejí.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Pardubicích je letiště a chemička.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na Vysočině se pěstují brambory.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Občanka mi končí v březnu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na pohotovosti se čeká dlouho.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Schůze společenství vlastníků je ve čtvrtek.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na zahrádce rostou rajčata.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Babička hlídá vnoučata ve středu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Dálniční známku kupujeme na internetu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na odběr krve se chodí nalačno.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Chlebíčky na oslavu objednáváme v lahůdkách.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Pavla si nechává maily předčítat.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Thanh pracuje jako tlumočnice.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Bankovní identitou se přihlásíme do portálu občana.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 35 (`é`)
  { text: "Cyklostezka vede podél Moravy.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Lítačka platí v celé Praze.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na Sokolovsku se těžilo hnědé uhlí.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na Hané se mluví hanácky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Rozhodnutí přišlo do datové schránky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Neschopenku posílá lékař elektronicky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Nemocenská se platí od patnáctého dne.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na rodičovské je letos táta.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Zubař nebere nové pacienty.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Nájem platíme vždy do pátého.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Hypotéku splácíme ještě dvacet let.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Tlak si měříme každé ráno.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Lékárna má otevřeno do šesti.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Poděbradech se léčí srdce.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 36 (`ý`)
  { text: "Výplata chodí patnáctého.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Z domova pracujeme dvakrát týdně.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Luhačovicích se léčí dýchací cesty.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na brněnském výstavišti je veletrh.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Nový pas se vyřizuje měsíc.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Praktický lékař ordinuje jen dopoledne.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kauce je ve výši dvou nájmů.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Výtah je zase mimo provoz.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Tříděný odpad nosíme do kontejnerů.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na chalupu jezdíme každý víkend.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Podle turistických značek se nedá zabloudit.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Výplata dorazila o den dřív.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Výcvik s bílou holí vede Tyfloservis.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na výměnu kotle jsou kotlíkové dotace.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 37 (`ˇ`)
  { text: "Na podzim se na Třeboňsku vylovují rybníky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Životopis posíláme mailem.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Šéfová je dnes na služební cestě.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Řidiči kamionů mají povinnou pauzu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Čekáme na schválení dovolené.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Výpověď se podává písemně.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Žatci se pěstuje chmel.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na jižní Moravě se pije víno, v Čechách pivo.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Žádost o důchod se podává na ČSSZ i online.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Pojišťovna proplatí brýle jen částečně.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kartičku pojišťovny nosíme v peněžence.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Proti klíšťatům se očkujeme na jaře.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Školka bere děti od tří let.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na Šumavě jsou nejlepší borůvky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Pošťák nosí důchod až domů.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Letos šetříme na kuchyň.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Odpověď pošlou datovkou.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Poplatek zaplaťte převodem.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Vraťte klíče na vrátnici.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Sousedi staví zeď.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Daň z nemovitostí se platí do konce května.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Doktor teď nebere telefon.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 38 (`g`)
  { text: "Dobrou chuť, kolegové.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V týmu je nová kolegyně z Ukrajiny.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "V Turnově se brousí granáty.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Zálohy na energie se zase zvedly.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Doktorka nás posílá na rentgen.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na Ostravsku se vyhlašuje smogová situace.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Přes agenturu pracuje Taras.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Syn se hlásí na gymnázium.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Auto parkujeme v garáži.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Hygiena kontroluje kuchyně.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Gratulujeme k narozeninám.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 39 (`ú`)
  { text: "Daňové přiznání nám dělá účetní.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na úřadu práce máme schůzku v úterý.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na finančním úřadě je fronta.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Vyúčtování přišlo, máme přeplatek.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Semafor u úřadu má zvukový signál.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Výplatu posílají na účet.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na úklid schodů se střídáme.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Pracovní úraz se hlásí hned.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na auto bereme úvěr.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Spořicí účet má lepší úrok.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 40 (`x`)
  { text: "Dluhová poradna pomáhá i s exekucí.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Domů vezmeme taxík.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Text smlouvy si přečtěte.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Data jsou v Excelu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Čekáme maximálně hodinu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Ve skladu dělá Milan na expedici.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Exekuce se dá řešit splátkami.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 41 (`´`)
  { text: "Účetní chce faktury do pátku.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Úřad práce nabízí rekvalifikaci.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Recept máme v mobilu jako kód.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Úřední dopisy si Hana nechává posílat elektronicky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Do Ústí dojíždí Pavla vlakem.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Úterní porada odpadá.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Účtenku si schovejte.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kód od vchodu se mění.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na balkóně sušíme prádlo.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 42 (`w`)
  { text: "Formulář je na webu úřadu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Dokument posíláme ve Wordu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Hotel má wellness.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // Sprosse 43 (`q`)
  { text: "Aqualand Moravia je v Pasohlávkách.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
];
