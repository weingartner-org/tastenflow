/**
 * Korpus des Weges „nl" (Niederländisch), Charge 1 - Kinder (K-NL, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_NL_WEG_CHARGE1_KIDS: CorpusItem[] = [
  { text: "Sanne fietst elke ochtend met haar broer langs het water naar school in Sneek.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, fiets" }, // nl-c1-001
  { text: "In het vierde leerjaar in Poperinge geeft Lotte vandaag de vissen in de klas eten.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, dieren" }, // nl-c1-002
  { text: "Onze kat slaapt het liefst op de warme vensterbank in de zon.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "dieren" }, // nl-c1-003
  { text: "Bij de boerderij in Drenthe ziet Daan een schaap met twee lammetjes.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "dieren, boerderij" }, // nl-c1-004
  { text: "Mila zoekt met haar opa naar kikkers in een ven in de Kempen.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "natuur, familie" }, // nl-c1-005
  { text: "Op zondag bakt papa pannenkoeken en roert Emma zelf het beslag.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "familie, eten" }, // nl-c1-006
  { text: "Op een wadexcursie in Groningen ziet Yara in de verte zeehonden liggen.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "nl", topic: "natuur, dieren" }, // nl-c1-007
  { text: "Bij het ontbijt kiest Noah voor een boterham met hagelslag.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "eten" }, // nl-c1-008
  { text: "Oma bakt een vlaai met kersen en Senne mag zelf het deeg uitrollen.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "eten, familie" }, // nl-c1-009
  { text: "Op de speelplaats in Mol spelen we pakkertje tot de bel weer gaat.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "spel, school" }, // nl-c1-010
  { text: "Op het strand bij Vlissingen bouwt Fenna een dijk tegen de golven.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "spel, strand" }, // nl-c1-011
  { text: "Noor is blind en leest haar boek met haar vingers, in braille.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "beperking, lezen" }, // nl-c1-012
  { text: "Vanaf de Vaalserberg kijkt Bram uit over drie landen tegelijk.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "natuur, uitstap" }, // nl-c1-013
  { text: "Ons konijn heet Dribbel en eet het liefst een stukje wortel.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "dieren" }, // nl-c1-014
  { text: "In de tram in Brussel hoort Amira Frans en Nederlands door elkaar.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "talen, stad" }, // nl-c1-015
  { text: "In de polder bij Emmeloord is het land zo vlak als een tafel.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "natuur, polder" }, // nl-c1-016
  { text: "Mats gebruikt een rolstoel en wint bijna elk potje dammen in de klas.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "beperking, spel" }, // nl-c1-017
  { text: "Bij de bakker in Geraardsbergen koopt Ruben helemaal zelf een brood.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "zelfstandig, eten" }, // nl-c1-018
  { text: "Op de Veluwe zien Ilse en haar vader een groep wilde zwijnen.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "natuur, dieren" }, // nl-c1-019
  { text: "Het heeft gevroren, dus Jesse doet zijn dikste sjaal om en zet een muts op.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "winter" }, // nl-c1-020
  { text: "Bij de Maas in Maaseik ziet Hanne een reiger op één poot staan.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "nl", topic: "natuur, dieren" }, // nl-c1-021
  { text: "In de bibliotheek leent Sem drie boeken over sterren en planeten.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, lezen" }, // nl-c1-022
  { text: "Lina snijdt zelf de komkommer voor de salade van vanavond.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "eten, zelfstandig" }, // nl-c1-023
  { text: "In Groningen loopt Bo op 11 november met een lampion langs de deuren.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "nl", topic: "feest (Sint-Maarten)" }, // nl-c1-024
  { text: "Op de Kemmelberg fietst Jens zo hard dat zijn benen trillen.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "fiets, natuur" }, // nl-c1-025
  { text: "In de klas van Ayoub, die slechthorend is, draagt de juf een kleine microfoon.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "nl", topic: "beperking, school" }, // nl-c1-026
  { text: "In Eindhoven bouwt Lars met zijn zus een robot die zelf kan rijden.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "techniek, spel" }, // nl-c1-027
  { text: "We leggen samen een puzzel van duizend stukjes op de keukentafel.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "spel, familie" }, // nl-c1-028
  { text: "Met de fiets volgen Wout en zijn moeder de knooppunten door de Kempen.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "fiets, familie" }, // nl-c1-029
  { text: "Met de boot gaat Femke naar Texel om daar bij haar tante te logeren.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "nl", topic: "familie, reizen" }, // nl-c1-030
  { text: "Het heeft een week lang gevroren.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "winter, ijs" }, // nl-c1-031.1
  { text: "In Grou staat het halve dorp op het ijs.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "winter, ijs" }, // nl-c1-031.2
  { text: "Jelle bindt zelf zijn schaatsen onder en zijn zus helpt hem overeind als hij valt.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "winter, ijs" }, // nl-c1-031.3
  { text: "Na een uur drinken ze warme chocolademelk bij een kraampje langs de baan.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "winter, ijs" }, // nl-c1-031.4
  { text: "Vandaag gaat het vierde leerjaar uit Ieper op uitstap naar zee.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, zee" }, // nl-c1-032.1
  { text: "Die ochtend hebben de kinderen zelf hun boterhammen gesmeerd.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, zee" }, // nl-c1-032.2
  { text: "Op het strand bij Nieuwpoort zoeken ze schelpen en vangen ze krabben in een emmer.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, zee" }, // nl-c1-032.3
  { text: "Voor ze naar huis gaan, zetten ze alle krabben voorzichtig terug in het water.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, zee" }, // nl-c1-032.4
  { text: "Fien is slechtziend.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "beperking, school, sport" }, // nl-c1-033.1
  { text: "Op haar tablet maakt ze de letters heel groot, en soms leest de computer de tekst hardop voor.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "beperking, school, sport" }, // nl-c1-033.2
  { text: "Bij sport op school speelt ze met een bal waar een belletje in zit.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "beperking, school, sport" }, // nl-c1-033.3
  { text: "Zo hoort ze precies waar de bal naartoe rolt.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "beperking, school, sport" }, // nl-c1-033.4
  { text: "Met de klas fietsen we naar een hunebed in Drenthe.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, geschiedenis" }, // nl-c1-034.1
  { text: "De grootste steen is hoger dan Tim zelf.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, geschiedenis" }, // nl-c1-034.2
  { text: "De meester vertelt dat mensen de stenen heel lang geleden hebben neergelegd.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, geschiedenis" }, // nl-c1-034.3
  { text: "Tim vraagt hoe dat lukte zonder kraan.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, geschiedenis" }, // nl-c1-034.4
  { text: "Niemand weet het precies, en daar praten we de hele terugweg over.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, geschiedenis" }, // nl-c1-034.5
  { text: "Op zondag komt de hele familie bij opa en oma in Tongeren.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "familie, eten" }, // nl-c1-035.1
  { text: "Elias dekt de tafel en zijn nichtje vouwt de servetten.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "familie, eten" }, // nl-c1-035.2
  { text: "Opa heeft vlaai met abrikozen gebakken.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "familie, eten" }, // nl-c1-035.3
  { text: "Na het eten spelen de kinderen in de tuin verstoppertje tot het donker wordt.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "familie, eten" }, // nl-c1-035.4
  { text: "Op een stormachtige dag kijkt Isa met haar opa naar de grote kering in de Oosterschelde.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "natuur, water" }, // nl-c1-036.1
  { text: "Opa legt uit dat de schuiven dicht kunnen als het water te hoog komt.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "natuur, water" }, // nl-c1-036.2
  { text: "Isa voelt de wind aan haar jas trekken.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "natuur, water" }, // nl-c1-036.3
  { text: "Ze maakt een foto voor haar spreekbeurt over water.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "natuur, water" }, // nl-c1-036.4
  { text: "In Vlaanderen komt de Sint in de nacht van 5 op 6 december langs.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "nl", topic: "feest (Sinterklaas)" }, // nl-c1-037.1
  { text: "Lore zet haar schoen bij de kachel, met een wortel voor het paard.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "feest (Sinterklaas)" }, // nl-c1-037.2
  { text: "De volgende ochtend vindt ze er een boek en een zakje speculoos in.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "feest (Sinterklaas)" }, // nl-c1-037.3
  { text: "Haar kleine broer wilde de hele nacht opblijven, maar hij viel als eerste in slaap.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "feest (Sinterklaas)" }, // nl-c1-037.4
  { text: "Wij wonen in Delfzijl en hebben een hond die Kees heet.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "dieren, zelfstandig" }, // nl-c1-038.1
  { text: "Elke middag na school laat ik hem zelf uit, ook als het regent.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "dieren, zelfstandig" }, // nl-c1-038.2
  { text: "Kees springt in alle plassen en wordt daarna in de gang drooggewreven met een oude handdoek.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "dieren, zelfstandig" }, // nl-c1-038.3
  { text: "Dat vindt hij het allerleukste van de dag.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "dieren, zelfstandig" }, // nl-c1-038.4
  { text: "Kobe woont in Brussel en gaat naar een Nederlandstalige school.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "talen, school, familie" }, // nl-c1-039.1
  { text: "Thuis spreekt hij Frans met zijn papa en Nederlands met zijn mama.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "talen, school, familie" }, // nl-c1-039.2
  { text: "Op de speelplaats wisselt hij soms midden in een zin van taal.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "talen, school, familie" }, // nl-c1-039.3
  { text: "Zijn vrienden lachen dan, want zij doen precies hetzelfde.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "talen, school, familie" }, // nl-c1-039.4
  { text: "Achter de school in Dronten ligt een moestuin.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, natuur, eten" }, // nl-c1-040.1
  { text: "Dewi zaait samen met haar klas radijsjes en sla.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, natuur, eten" }, // nl-c1-040.2
  { text: "Elke week meten ze hoe hoog alles al is.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, natuur, eten" }, // nl-c1-040.3
  { text: "Als de radijsjes klaar zijn, oogsten ze die zelf en maken ze er in de klas een salade van.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "nl", topic: "school, natuur, eten" }, // nl-c1-040.4
];
