/**
 * Korpus des Weges „nl" (Niederländisch), Charge 1 - Erwachsene (K-NL, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_NL_WEG_CHARGE1_ERWACHSENE: CorpusItem[] = [
  { text: "Om een afspraak bij de gemeente Emmen te maken, logt Hanneke in met haar DigiD.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "overheid" }, // nl-c1-081
  { text: "Ann uit Turnhout meldt zich met itsme aan om online een attest aan te vragen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "overheid" }, // nl-c1-082
  { text: "Na het bezoek aan de huisarts in Kortrijk krijgt Bart een deel terug van zijn mutualiteit.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "gezondheid, overheid" }, // nl-c1-083
  { text: "In november vergelijkt Marloes in Lelystad de zorgverzekeraars voor volgend jaar.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "nl", topic: "gezondheid, geld" }, // nl-c1-084
  { text: "Mijn collega werkt vier dagen per week en haalt op vrijdag de kinderen van school.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, gezin" }, // nl-c1-085
  { text: "De huurwoning in Leeuwarden heeft een kleine tuin en een schuur voor de fietsen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen" }, // nl-c1-086
  { text: "Na een lange werkdag wandelt Kristof nog een halfuur door het Zoniënwoud.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "nl", topic: "gezondheid, natuur" }, // nl-c1-087
  { text: "Op zondag bezoekt Wim met een vriend een museum over de Romeinen in Tongeren.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "cultuur" }, // nl-c1-088
  { text: "Mijn collega Ruud is blind en leest zijn mails met een schermlezer.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, beperking" }, // nl-c1-089
  { text: "Op de markt in Middelburg koopt Saskia verse vis en een bos bloemen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "alledag" }, // nl-c1-090
  { text: "In een café in Gouda betaalt Mo € 4,50 voor koffie met een verse stroopwafel.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "nl", topic: "alledag, eten" }, // nl-c1-091
  { text: "Op de markt in Lokeren kost een kilo peren vandaag € 2,80.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "nl", topic: "alledag" }, // nl-c1-092
  { text: "In de haven van Urk helpt Gert op zaterdag mee met het opruimen van zwerfafval.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "alledag, milieu" }, // nl-c1-093
  { text: "De trein naar Hasselt heeft vertraging, dus Sofie belt even haar teamleider.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, reizen" }, // nl-c1-094
  { text: "Kenny van Weeghel won zowel in Athene als in Rio goud op de 400 meter.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "nl", topic: "sport, paralympics, beperking" }, // nl-c1-095
  { text: "Marieke gebruikt een rolstoel en werkt als jurist bij een verzekeraar in Genk.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, beperking" }, // nl-c1-096
  { text: "Na lang zoeken vinden Jonas en Elif een rijwoning met een tuintje in Roeselare.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen" }, // nl-c1-097
  { text: "Bij de apotheek in Venlo vraagt Ineke of ze haar medicijnen kan laten bezorgen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "gezondheid" }, // nl-c1-098
  { text: "In de bibliotheek van Assen leest een schrijfster voor uit haar nieuwe roman.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "cultuur" }, // nl-c1-099
  { text: "Priya werkt als ingenieur bij een chipbedrijf in de regio Eindhoven.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "nl", topic: "werk, techniek" }, // nl-c1-100
  { text: "Door de aardbevingen na de gaswinning hebben veel huizen in Groningen schade.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen, nieuws" }, // nl-c1-101
  { text: "Op dinsdag werkt Ellen thuis en vergadert ze via de laptop met haar team.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk" }, // nl-c1-102
  { text: "In Brussel staan de straatnamen op de borden in het Nederlands en het Frans.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "talen, stad" }, // nl-c1-103
  { text: "Voor een nieuwe bril maakt Youssef eerst een afspraak voor een oogmeting.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "nl", topic: "gezondheid" }, // nl-c1-104
  { text: "De Ommegang van Mechelen staat bij de UNESCO op de lijst van immaterieel erfgoed.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "cultuur, erfgoed" }, // nl-c1-105
  { text: "Op een vrije dag kijkt Henk in Nationaal Park Lauwersmeer naar overvliegende ganzen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "natuur" }, // nl-c1-106
  { text: "Als vrijwilliger leest Gerda elke week de krant voor aan haar buurman.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "vrijwilligerswerk" }, // nl-c1-107
  { text: "Wie vanuit Paramaribo het binnenland in reist, ziet al snel niets dan bos.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "natuur, reizen" }, // nl-c1-108
  { text: "Op Bonaire betaal je met de Amerikaanse dollar en niet met de euro.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "geld, alledag" }, // nl-c1-109
  { text: "In het voorjaar maken Leen en haar vriendin een lange fietstocht door Haspengouw.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "vrije tijd, fiets" }, // nl-c1-110
  { text: "Sinds een paar maanden werkt Joyce als wijkverpleegkundige in het zuidoosten van Drenthe.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "nl", topic: "werk, zorg" }, // nl-c1-111.1
  { text: "Ze rijdt elke dag langs boerderijen en kleine dorpen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, zorg" }, // nl-c1-111.2
  { text: "Sommige cliënten wonen kilometers van de dichtstbijzijnde winkel.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "nl", topic: "werk, zorg" }, // nl-c1-111.3
  { text: "Ze helpt met wondverzorging, maar heeft ook altijd even tijd voor koffie en een praatje.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, zorg" }, // nl-c1-111.4
  { text: "Na de verhuizing naar Lier geeft Sarah haar nieuwe adres door aan de gemeente.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "overheid, wonen" }, // nl-c1-112.1
  { text: "Ze meldt zich online aan met itsme en kiest een moment voor een afspraak aan het loket.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "overheid, wonen" }, // nl-c1-112.2
  { text: "Daar neemt ze haar identiteitskaart mee.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "overheid, wonen" }, // nl-c1-112.3
  { text: "De medewerker is vriendelijk, en na tien minuten staat ze alweer buiten.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "overheid, wonen" }, // nl-c1-112.4
  { text: "Sinds vorig jaar werkt Tom bij de klantenservice van een energiebedrijf in Groningen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, beperking, techniek" }, // nl-c1-113.1
  { text: "Tom is blind en gebruikt een schermlezer en een brailleleesregel.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, beperking, techniek" }, // nl-c1-113.2
  { text: "Klanten merken er aan de telefoon niets van.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, beperking, techniek" }, // nl-c1-113.3
  { text: "Zijn teamleider zegt dat hij de meeste vragen in één keer oplost.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "nl", topic: "werk, beperking, techniek" }, // nl-c1-113.4
  { text: "In het dorp in de Westhoek waar Griet woont, zijn de afstanden groot en rijden er weinig bussen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen, mobiliteit" }, // nl-c1-114.1
  { text: "Daarom deelt ze met drie buren een elektrische auto.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen, mobiliteit" }, // nl-c1-114.2
  { text: "In een gedeelde agenda zien ze wie de auto wanneer nodig heeft.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen, mobiliteit" }, // nl-c1-114.3
  { text: "Het spaart geld en zorgt voor meer contact in de straat.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen, mobiliteit" }, // nl-c1-114.4
  { text: "Na haar knieoperatie oefent Fatma twee keer per week bij de fysiotherapeut in Heerlen.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "nl", topic: "gezondheid" }, // nl-c1-115.1
  { text: "De oefeningen zijn zwaar, maar ze merkt dat het beter gaat.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "gezondheid" }, // nl-c1-115.2
  { text: "Thuis doet ze elke ochtend voor het ontbijt haar rekoefeningen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "gezondheid" }, // nl-c1-115.3
  { text: "Over een maand wil ze weer gaan wandelen in het Heuvelland.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "gezondheid" }, // nl-c1-115.4
  { text: "Eléonor Sana verloor als baby haar zicht en werd later een sterke skiester.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "nl", topic: "sport, paralympics, beperking" }, // nl-c1-116.1
  { text: "In 2018 won ze brons in de afdaling, met haar zus Chloé als gids.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "nl", topic: "sport, paralympics, beperking" }, // nl-c1-116.2
  { text: "Ze was de eerste Belgische vrouw met een medaille op de Paralympische Winterspelen.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "nl", topic: "sport, paralympics, beperking" }, // nl-c1-116.3
  { text: "In Rotterdam deelt Sander een appartement met twee anderen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen, eten" }, // nl-c1-117.1
  { text: "De huur is hoog, dus ze delen alles: de keuken, de wasmachine en soms ook het eten.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen, eten" }, // nl-c1-117.2
  { text: "Op vrijdag kookt een van hen voor de hele groep.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen, eten" }, // nl-c1-117.3
  { text: "Deze week is het stamppot met boerenkool en een rookworst.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "wonen, eten" }, // nl-c1-117.4
  { text: "Op zondagochtend gaat Jamila met haar dochter naar een voorstelling in een cultuurcentrum in Brussel.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "cultuur, talen" }, // nl-c1-118.1
  { text: "Het stuk wordt in het Nederlands gespeeld, met Franse boventitels.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "cultuur, talen" }, // nl-c1-118.2
  { text: "Na afloop drinken ze iets op een terras en praten ze over wat ze het mooiste vonden.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "cultuur, talen" }, // nl-c1-118.3
  { text: "Op maandag belt Dirk de huisarts in Pelt, omdat zijn hoest maar niet overgaat.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "gezondheid" }, // nl-c1-119.1
  { text: "Hij kan nog dezelfde dag terecht.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "gezondheid" }, // nl-c1-119.2
  { text: "De dokter luistert naar zijn longen en schrijft een siroop voor.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "gezondheid" }, // nl-c1-119.3
  { text: "Thuis kijkt Dirk in de app van zijn mutualiteit hoeveel hij terugkrijgt.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "gezondheid" }, // nl-c1-119.4
  { text: "Esther is leerkracht op Bonaire.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, onderwijs, talen" }, // nl-c1-120.1
  { text: "In haar klas spreken de meeste kinderen thuis Papiaments.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, onderwijs, talen" }, // nl-c1-120.2
  { text: "Esther wisselt daarom vaak tussen Papiaments en Nederlands, zodat iedereen kan volgen.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, onderwijs, talen" }, // nl-c1-120.3
  { text: "Na school gaat ze graag zwemmen in zee.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "nl", topic: "werk, onderwijs, talen" }, // nl-c1-120.4
];
