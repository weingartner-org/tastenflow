/**
 * Korpus des Weges „nl" (Niederländisch), Charge 1 - Jugendliche (K-NL, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
 *
 * Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/nl.jsonl` (je Altersgruppe 30 Sätze und 10 Absätze, neu in der
 * Sprache verfasst, `quelle: "eigen"`), geprüft von einem zweiten Prüfer (`PRUEFBERICHT-nl.md`: freigabefähig).
 * Der Text ist unverändert übernommen. Zuordnung: `alter` ⇒ `stufen`, `thema` ⇒ `topic`, `weg` ⇒ `nurWeg`; die Kennung
 * der Quelle steht als Kommentar hinter jeder Zeile.
 *  · Absätze (`art: "absatz"`) sind an den Satzgrenzen in ihre Sätze geteilt (`<id>.1`, `<id>.2` …): Korpus-Zeilen sind einzelne
 *    Übungszeilen (die längste der acht Wege davor hat 130 Zeichen), mehrsätzige Geschichten sind Serien. Kein Wort geändert.
 *  · Selbst verfasst ⇒ ohne `herkunft` (wie die Chargen von it/pl/tr/cs; `herkunft` ist für ÜBERNOMMENE Texte).
 *  · `minTier` = `minTierFor(text, "nl")` nach der eigenen Lern-Folge des Weges (`lernweg.ts`, F4), Bezugstastatur `nl-intl`.
 * Wächter: `tests/tastenflow-texte-nl-charge1.test.ts`. Nur HINTEN anhängen (Anker, `corpusNl.ts`).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_NL_WEG_CHARGE1_TEENS: CorpusItem[] = [
  { text: "Tristan Bangma is slechtziend en won in Parijs drie keer goud op de tandem.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, paralympics, beperking" }, // nl-c1-041
  { text: "Joachim Gérard won in 2021 het rolstoeltennistoernooi van Wimbledon.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "nl", topic: "sport, paralympics, beperking" }, // nl-c1-042
  { text: "Bij goalball draagt iedereen een afgeplakte skibril en zit er een bel in de bal.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, beperking" }, // nl-c1-043
  { text: "Op de Oude Kwaremont wacht Seppe al uren op de renners van de Ronde.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, wielrennen" }, // nl-c1-044
  { text: "Na de les oefent Lieke gitaar tot haar vingertoppen pijn doen.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "muziek" }, // nl-c1-045
  { text: "Voor het vak techniek programmeert Yusuf een kleine robot die lijnen volgt.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "nl", topic: "techniek, school" }, // nl-c1-046
  { text: "Op de dijk bij Zierikzee praten Lisa en Omar over de stijgende zeespiegel.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "klimaat, water" }, // nl-c1-047
  { text: "Mijn beste vriendin is verhuisd, maar we bellen nog elke zondagavond.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "vriendschap" }, // nl-c1-048
  { text: "Met de trein reist Joost van Leeuwarden naar Maastricht om zijn neef op te zoeken.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "reizen, trein, familie" }, // nl-c1-049
  { text: "Nina telt de dagen af tot ze in augustus met haar broer naar Pukkelpop mag.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "muziek, festival" }, // nl-c1-050
  { text: "Op zaterdag werkt Thijs in de supermarkt en spaart hij voor een nieuwe laptop.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "werk, geld" }, // nl-c1-051
  { text: "In de regio Eindhoven bouwen bedrijven machines waarmee piepkleine chips worden gemaakt.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "techniek" }, // nl-c1-052
  { text: "In Paramaribo spreekt Kenny Nederlands op school en Sranantongo met zijn vrienden.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "nl", topic: "talen, vriendschap" }, // nl-c1-053
  { text: "Op Bonaire is Papiaments de taal die je het meest op straat hoort.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "talen" }, // nl-c1-054
  { text: "Sven is blind en leest zijn berichten op een brailleleesregel.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "beperking, techniek" }, // nl-c1-055
  { text: "Fatima speelt rolstoelbasketbal en traint drie avonden per week in Leuven.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, beperking" }, // nl-c1-056
  { text: "Na het festival ruimen vrijwilligers samen bergen afval op het terrein op.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "milieu, festival" }, // nl-c1-057
  { text: "Mirthe zit op de havo in Winschoten en fietst elke dag twaalf kilometer naar school.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "school, fiets" }, // nl-c1-058
  { text: "In het eerste jaar secundair in Geel heeft Arne ineens een heleboel leerkrachten.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "school" }, // nl-c1-059
  { text: "Op woensdagmiddag speelt Kai online een toernooi met vrienden uit heel Vlaanderen.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "games, vriendschap" }, // nl-c1-060
  { text: "De Oosterscheldekering gaat bij storm dicht, maar laat normaal het getij door.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "klimaat, techniek" }, // nl-c1-061
  { text: "Het Fries is in Friesland sinds 1956 een officiële bestuurstaal naast het Nederlands.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "nl", topic: "talen" }, // nl-c1-062
  { text: "Wubbo Ockels was in 1985 de eerste Nederlander in de ruimte.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "nl", topic: "ruimtevaart, wetenschap" }, // nl-c1-063
  { text: "Frank De Winne was in 2009 commandant van het internationale ruimtestation.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "nl", topic: "ruimtevaart, wetenschap" }, // nl-c1-064
  { text: "De laatste Elfstedentocht werd in 1997 verreden, en Wessel hoopt er ooit zelf één mee te maken.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "nl", topic: "sport, schaatsen" }, // nl-c1-065
  { text: "Zoë schrijft haar eigen nummers en zet ze na het eten online.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "nl", topic: "muziek" }, // nl-c1-066
  { text: "Romy is doof en maakt met haar vriendinnen grapjes in gebarentaal.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "nl", topic: "vriendschap, beperking" }, // nl-c1-067
  { text: "Diede de Groot won in 2021 de Golden Slam in het rolstoeltennis.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "nl", topic: "sport, paralympics, beperking" }, // nl-c1-068
  { text: "Peter Genyn uit Brasschaat won in Rio twee keer goud in zijn racerolstoel.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "nl", topic: "sport, paralympics, beperking" }, // nl-c1-069
  { text: "In het Nationaal Park Hoge Kempen wandelt Jana met haar klas over de heide.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "natuur, school" }, // nl-c1-070
  { text: "Elke donderdag traint Milan met zijn goalballteam in een sporthal in Hasselt.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, beperking" }, // nl-c1-071.1
  { text: "Hij is slechtziend, maar op het veld maakt dat niet uit, want iedereen draagt een bril waar je niet door kunt kijken.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, beperking" }, // nl-c1-071.2
  { text: "Het is doodstil in de zaal, zodat de spelers de bel in de bal horen.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, beperking" }, // nl-c1-071.3
  { text: "Na de training eten ze samen frietjes.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, beperking" }, // nl-c1-071.4
  { text: "Ryan woont op Saba, waar de meeste mensen Engels spreken.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "nl", topic: "talen, natuur" }, // nl-c1-072.1
  { text: "Op school leert hij ook Nederlands.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "talen, natuur" }, // nl-c1-072.2
  { text: "Na school klimt hij met vrienden een stuk de berg op.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "talen, natuur" }, // nl-c1-072.3
  { text: "Boven waait het hard en zie je rondom alleen maar zee.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "talen, natuur" }, // nl-c1-072.4
  { text: "Voor een werkstuk interviewt Noa haar overgrootmoeder in Zierikzee.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "geschiedenis, klimaat, familie" }, // nl-c1-073.1
  { text: "Die was een klein meisje toen het water in 1953 over de dijken kwam.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "nl", topic: "geschiedenis, klimaat, familie" }, // nl-c1-073.2
  { text: "Noa schrijft alles op en zoekt daarna uit hoe de Deltawerken het land nu beschermen.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "geschiedenis, klimaat, familie" }, // nl-c1-073.3
  { text: "Ze weet nu al dat ze later iets met water wil doen.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "geschiedenis, klimaat, familie" }, // nl-c1-073.4
  { text: "Elk voorjaar staat de halve straat in Oudenaarde langs het parcours van de Ronde van Vlaanderen.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, wielrennen" }, // nl-c1-074.1
  { text: "Ella en haar vrienden maken een groot spandoek voor hun favoriete renster.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, wielrennen" }, // nl-c1-074.2
  { text: "Als het peloton voorbijraast, duurt het maar een paar seconden.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, wielrennen" }, // nl-c1-074.3
  { text: "Toch praten ze er de hele week over.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, wielrennen" }, // nl-c1-074.4
  { text: "Voor zijn maatschappelijke stage helpt Ilyas in een repaircafé in Helmond.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "nl", topic: "techniek, milieu" }, // nl-c1-075.1
  { text: "Mensen brengen kapotte lampen, broodroosters en fietsen binnen.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "techniek, milieu" }, // nl-c1-075.2
  { text: "Ilyas leert solderen van een gepensioneerde technicus, en zij leert van hem hoe je een app bijwerkt.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "nl", topic: "techniek, milieu" }, // nl-c1-075.3
  { text: "Aan het eind van de middag werken zes apparaten weer.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "techniek, milieu" }, // nl-c1-075.4
  { text: "Toon en Jamal kennen elkaar al sinds de kleuterklas in Diksmuide.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "vriendschap, fiets" }, // nl-c1-076.1
  { text: "Nu gaan ze naar verschillende scholen, maar op woensdagmiddag fietsen ze samen langs de IJzer.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "vriendschap, fiets" }, // nl-c1-076.2
  { text: "Ze praten over muziek, over school en over het meisje van de jeugdbeweging dat ze allebei leuk vinden.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "vriendschap, fiets" }, // nl-c1-076.3
  { text: "De oude platbodems varen zo dicht langs elkaar dat je bang wordt dat ze botsen.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, zeilen" }, // nl-c1-077.2
  { text: "Sietske zeilt zelf al in een klein bootje en wil later ook meevaren.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, zeilen" }, // nl-c1-077.3
  { text: "Haar oom zegt dat ze dan eerst alle knopen moet kennen.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "sport, zeilen" }, // nl-c1-077.4
  { text: "Iris is slechtziend en zit in de derde klas van het vwo in Zwolle.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "beperking, techniek, school" }, // nl-c1-078.1
  { text: "Op haar laptop staat een programma dat alles vergroot, en met sneltoetsen werkt ze sneller dan de meeste klasgenoten.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "beperking, techniek, school" }, // nl-c1-078.2
  { text: "Toen de school een nieuwe website kreeg, mocht zij testen of alles goed werkte.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "beperking, techniek, school" }, // nl-c1-078.3
  { text: "Ze vond elf fouten.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "beperking, techniek, school" }, // nl-c1-078.4
  { text: "Met de jeugdraad van Lommel zet Febe zich in voor een autovrije schoolstraat.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "milieu, inspraak" }, // nl-c1-079.1
  { text: "Een week lang tellen ze elke ochtend hoe vaak er een auto langs de school rijdt.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "milieu, inspraak" }, // nl-c1-079.2
  { text: "Het zijn er veel meer dan iedereen dacht.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "milieu, inspraak" }, // nl-c1-079.3
  { text: "De burgemeester luistert en belooft een proef van een maand.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "milieu, inspraak" }, // nl-c1-079.4
  { text: "Kiara woont in Paramaribo en doet mee aan een schrijfwedstrijd voor jongeren.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "schrijven, familie, talen" }, // nl-c1-080.1
  { text: "Haar verhaal gaat over haar oma, die elke ochtend vroeg naar de markt gaat.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "schrijven, familie, talen" }, // nl-c1-080.2
  { text: "Kiara schrijft in het Nederlands, maar laat haar oma af en toe iets in het Sranantongo zeggen.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "nl", topic: "schrijven, familie, talen" }, // nl-c1-080.3
  { text: "De jury vindt dat juist mooi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "nl", topic: "schrijven, familie, talen" }, // nl-c1-080.4
];
