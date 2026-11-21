/**
 * Korpus des Weges „sv" (Schwedisch), Charge 1 - Kinder (K-SV, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
 *
 * Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/sv.jsonl` (je Altersgruppe 30 Sätze und 10 Absätze, neu in der
 * Sprache verfasst, `quelle: "eigen"`), geprüft von einem zweiten Prüfer (`PRUEFBERICHT-sv.md`: freigabefähig).
 * Der Text ist unverändert übernommen. Zuordnung: `alter` ⇒ `stufen`, `thema` ⇒ `topic`, `weg` ⇒ `nurWeg`; die Kennung
 * der Quelle steht als Kommentar hinter jeder Zeile.
 *  · Absätze (`art: "absatz"`) sind an den Satzgrenzen in ihre Sätze geteilt (`<id>.1`, `<id>.2` …): Korpus-Zeilen sind einzelne
 *    Übungszeilen (die längste der acht Wege davor hat 130 Zeichen), mehrsätzige Geschichten sind Serien. Kein Wort geändert.
 *  · Selbst verfasst ⇒ ohne `herkunft` (wie die Chargen von it/pl/tr/cs; `herkunft` ist für ÜBERNOMMENE Texte).
 *  · `minTier` = `minTierFor(text, "sv")` nach der eigenen Lern-Folge des Weges (`lernweg.ts`, F4), Bezugstastatur `sv`.
 * Wächter: `tests/tastenflow-texte-sv-charge1.test.ts`. Nur HINTEN anhängen (Anker, `corpusSv.ts`).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_SV_WEG_CHARGE1_KIDS: CorpusItem[] = [
  { text: "På väg till skolan i Umeå ser Elsa en älg vid skogskanten.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Tiere" }, // sv-c1-001
  { text: "På vintern är det mörkt på morgonen i Kiruna, så Nils tänder cykellampan.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Alltag" }, // sv-c1-002
  { text: "Inga och hennes morfar matar renarna med lav en kall dag i januari.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Tiere" }, // sv-c1-003
  { text: "Vår klass i Luleå åker skridskor på isen bakom skolan varje fredag.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Sport" }, // sv-c1-004
  { text: "Liam i Östersund bygger en snögubbe med en morot som näsa.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-005
  { text: "Ida och pappa plockar hjortron på myren i Västerbotten och fyller en hel hink.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-006
  { text: "Amir går i fyran i Skellefteå och läser sagor på punktskrift varje kväll.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-007
  { text: "På skolgården i Sundsvall spelar vi innebandy tills det ringer in.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-008
  { text: "I januari går Saga och hennes storebror ut i trädgården efter middagen.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-009.1
  { text: "Himlen över Jokkmokk är full av gröna ljus som rör sig långsamt.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Natur" }, // sv-c1-009.2
  { text: "Saga lägger sig på rygg i snön och tittar upp.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-009.3
  { text: "Hon tycker att ljuset ser ut som ett stort grönt draperi som någon drar fram och tillbaka.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-009.4
  { text: "Den 6 februari firar samerna sin nationaldag.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "sv", topic: "Feste" }, // sv-c1-010.1
  { text: "I klassen i Gällivare har eleverna hängt upp den samiska flaggan och bakat bullar.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-010.2
  { text: "Nils berättar om sin farmor som pratar samiska hemma.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-010.3
  { text: "Efteråt ritar alla en egen flagga och sätter upp den på väggen i klassrummet.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-010.4
  { text: "Alva och Omar räknar fåglar vid en sjö utanför Uppsala och skriver ner varje art.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Tiere" }, // sv-c1-011
  { text: "I Dalarna åker Hugo längdskidor med sin mormor på söndagarna.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Familie" }, // sv-c1-012
  { text: "I köket hemma i Västerås bakar Wilma kanelbullar och mäter själv upp mjölet.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Essen" }, // sv-c1-013
  { text: "På utflykten till Mälaren har Leo glömt matsäcken, så Noor delar med sig.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-014
  { text: "Elias använder rullstol och är målvakt i klassens fotbollslag i Örebro.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Sport" }, // sv-c1-015
  { text: "Ronja i Karlstad har en katt som gärna lägger sig i hennes skolväska.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Tiere" }, // sv-c1-016
  { text: "I biblioteket i Falun lånar Ebbe tre böcker om rymden och en om hästar.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-017
  { text: "Klass fyra från Stockholm åker tunnelbana till ett museum.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-018.1
  { text: "Varje elev har en egen uppgift.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Schule" }, // sv-c1-018.2
  { text: "Selma tar bilder, Ali skriver ner vad guiden säger och Theo håller koll på tiden.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-018.3
  { text: "När de kommer tillbaka till skolan gör de en liten utställning i korridoren för de andra klasserna.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-018.4
  { text: "På rasten i Eskilstuna leker eleverna kurragömma bakom skolan.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-019.1
  { text: "Maja räknar högt till trettio med ögonen stängda.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Spiel" }, // sv-c1-019.2
  { text: "Sedan letar hon bakom buskarna, under trappan och vid cykelstället.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-019.3
  { text: "Till sist hittar hon alla utom Noah, som har klättrat upp i ett träd och skrattar så att löven darrar.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-019.4
  { text: "Familjen Berg tältar en natt i skogen i Värmland.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-020.1
  { text: "De vet att alla får vara i naturen och plocka bär, så länge man tar hänsyn.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-020.2
  { text: "Därför tar de med sig allt skräp hem och låter blommorna stå kvar.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-020.3
  { text: "Lisa skriver i sin dagbok att man inte ska störa och inte förstöra.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-020.4
  { text: "Vera hälsar på sin moster på Gotland och matar lammen på gården.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Tiere" }, // sv-c1-021
  { text: "I Göteborg cyklar Ahmed själv till skolan för första gången i dag.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-022
  { text: "Selma och hennes lillasyster bygger en koja av grenar i skogen i Småland.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-023
  { text: "På Öland letar Oskar efter snäckor på stranden och lägger dem i en burk.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-024
  { text: "Klassen i Malmö planterar tomater i stora lådor på skolans tak.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Schule" }, // sv-c1-025
  { text: "Noah har en hörselnedsättning och spelar trummor i skolbandet i Jönköping.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-026
  { text: "Farfar visar Ella hur man rensar ogräs i grönsakslandet i Halland, och sedan gör hon det själv.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Familie" }, // sv-c1-027
  { text: "I Kalmar tävlar barnen om vem som kan hoppa längst på skolgården.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-028
  { text: "I matsalen på skolan i Lund står det fiskgratäng på menyn.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Essen" }, // sv-c1-029.1
  { text: "Yusuf tar lite potatis, mycket sallad och en bit fisk.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Essen" }, // sv-c1-029.2
  { text: "Han smakar och nickar.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Essen" }, // sv-c1-029.3
  { text: "Det var godare än han trodde.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Essen" }, // sv-c1-029.4
  { text: "Efter maten hjälper han till att torka av borden, för i dag är det hans tur.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Essen" }, // sv-c1-029.5
  { text: "Ella och hennes pappa står med kikare på klipporna i Bohuslän.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Tiere" }, // sv-c1-030.1
  { text: "Långt ute på en sten ligger tre sälar och solar sig.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Tiere" }, // sv-c1-030.2
  { text: "En av dem lyfter huvudet och tittar mot land.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Tiere" }, // sv-c1-030.3
  { text: "Ella står helt still, för hon vill inte skrämma dem.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Tiere" }, // sv-c1-030.4
  { text: "Sedan ritar hon sälarna i sitt anteckningsblock.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Tiere" }, // sv-c1-030.5
  { text: "Ville bor på en ö på Åland och åker färja till skolan varje morgon.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-031
  { text: "I Vasa åker Emma och hennes kusin pulka i backen bakom huset.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-032
  { text: "Tove i Borgå har en hund som heter Pärla och som älskar att bada.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Tiere" }, // sv-c1-033
  { text: "Kasper i Jakobstad hjälper sin morfar att laga fisknäten nere vid båthuset.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Familie" }, // sv-c1-034
  { text: "I Helsingfors tar Oliver spårvagnen till simhallen helt själv.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Sport" }, // sv-c1-035
  { text: "Klassen i Ekenäs plockar blåbär i skogen och bakar en paj tillsammans.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Essen" }, // sv-c1-036
  { text: "Sara har nedsatt syn och läser text i stor stil på surfplattan i skolan i Åbo.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-037
  { text: "På Åland har midsommarstängerna olika form i olika kommuner.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Feste" }, // sv-c1-038.1
  { text: "I år får Ebba och hennes kompisar hjälpa till att binda kransar av löv och blommor.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-038.2
  { text: "De arbetar hela förmiddagen.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-038.3
  { text: "När stången står på plats tittar Ebba upp och ser sin egen krans högt där uppe.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-038.4
  { text: "Det har snöat hela natten i Närpes.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Schule" }, // sv-c1-039.1
  { text: "På rasten bygger eleverna i trean en lång tunnel i snövallen.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-039.2
  { text: "Aino kryper först och Mohammed sist.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-039.3
  { text: "När det ringer in är alla vita av snö från topp till tå, men ingen vill gå in.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Schule" }, // sv-c1-039.4
  { text: "Varje fredag spelar familjen Lindholm i Pargas ett brädspel efter middagen.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-040.1
  { text: "Det är lillebror Max som bestämmer vilket spel det blir.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-040.2
  { text: "Mamma förlorar nästan alltid, men hon skrattar mest av alla.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "sv", topic: "Spiel" }, // sv-c1-040.3
  { text: "I kväll vinner Max för första gången, och han bjuder alla på saft.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "sv", topic: "Spiel" }, // sv-c1-040.4
];
