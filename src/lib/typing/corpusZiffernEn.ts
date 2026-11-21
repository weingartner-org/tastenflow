/**
 * ZIFFERN- UND SONDERZEICHEN-PORTFOLIO (Charge I3, 21.08.2026) — englisch.
 *
 * Das englische Gegenstück zu `corpusZiffern.ts`; Bauplan
 * `Sensorik/BAUPLAN-2026-08-14-TASTENFLOW-DREI-STUFEN-UND-INHALT.md` §5 I3.
 * Ausgangslage: 73 englische Zeilen mit Ziffern (2156 Anschläge), Ziffern-
 * Anteil je Zeile 22,5 Prozent. Jede Zeile hier liegt bei **20 bis 35 Prozent**
 * — gemessen, nicht geschätzt.
 *
 * ── Zeichensatz: was hier ANDERS ist als im Deutschen ──────────────────────
 * Kein `€`, kein `§`, kein `°`. Nicht aus Vorsicht, sondern aus einer
 * Messung: `layouts.ts` führt diese drei bei US (`€ § °`) und UK (`§ °`) unter
 * `missing` und hat KEINE Ersatzschreibung dafür. Ein englischer Lernender an
 * einer US- oder UK-Tastatur bekäme die Taste nie freigeschaltet — die Zeile
 * wäre für ihn dauerhaft unservierbar. Geld steht darum als Wort (`pounds`),
 * Temperatur als Wort (`degrees`). Benutzt werden `( ) " + - * / = % @ #`
 * und der Punkt als Dezimaltrennzeichen.
 *
 * Ebenfalls anders: **kein Apostroph**. `tests/typing-english.test.ts` würde
 * jede Apostroph-Zeile erst ab der '-Taste servieren, und `_twlint` (Regel 4)
 * meldet sie; der Bestand ist seit TN-E13 apostrophfrei und bleibt es.
 * Britische Leitvarietät: `metre`, `kilometre`, `litre`, `colour`.
 * Erstes Zeichen jeder Zeile ist Großbuchstabe oder Ziffer (Regel aus
 * `typing-english.test.ts`).
 *
 * ── Wahrhaftigkeit ─────────────────────────────────────────────────────────
 * Wie im Deutschen: kaufmännische Zeilen sind erkennbare Rechen-SZENEN, jede
 * Summe nachgerechnet; Wissens-Zahlen doppelt belegt mit Fundstelle als
 * Kommentar; Adressen zeigen nur auf `example.org` und reservierte Netze.
 *
 * ⚠️ Nach dem Einpflegen: `npx tsx scripts/erzeuge-korpus-anker.mts`.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

/** Die beiden oberen Stufen. Ziffern sind für die Jüngsten zu spät dran. */
const OBEN: Stufe[] = ["teens", "erwachsen"];

/* ══════════════════════════════════════════════════════════════════════════
 * WELLE 3 — kaufmännisch und mathematisch
 * ════════════════════════════════════════════════════════════════════════ */

/** Prices, receipts, discounts, tax, change, instalments, dates, blocks. */
const COMMERCE: CorpusItem[] = [
  // — Quantity times unit price (every total recomputed) —
  { text: "Receipt 8201: 3 books at 2.40 pounds cost 7.20 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8202: 5 folders at 3.60 pounds cost 18.00 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8203: 7 pens at 1.30 pounds cost 9.10 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8204: 4 boxes at 12.50 pounds cost 50.00 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8205: 9 cups at 2.25 pounds cost 20.25 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8206: 6 maps at 4.75 pounds cost 28.50 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8207: 12 stamps at 0.85 pounds cost 10.20 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8208: 15 nails at 1.20 pounds cost 18.00 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8209: 8 plates at 3.75 pounds cost 30.00 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8210: 11 tiles at 2.60 pounds cost 28.60 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8211: 20 cards at 0.95 pounds cost 19.00 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Receipt 8212: 2 lamps at 17.50 pounds cost 35.00 pounds.", kind: "rechnung", stufen: OBEN },

  // — Two lines on one till slip —
  { text: "Till 61: 3 * 1.60 plus 2 * 4.20 comes to 13.20 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Till 62: 5 * 2.20 plus 3 * 1.40 comes to 15.20 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Till 63: 4 * 0.85 plus 2 * 3.30 comes to 10.00 pounds.", kind: "rechnung", stufen: OBEN },
  { text: "Till 64: 6 * 1.75 plus 5 * 2.10 comes to 21.00 pounds.", kind: "rechnung", stufen: OBEN },

  // — Discounts —
  { text: "20 % off 95.00 pounds saves 19.00, so you pay 76.00.", kind: "rechnung", stufen: OBEN },
  { text: "25 % off 160.00 pounds saves 40.00, so you pay 120.00.", kind: "rechnung", stufen: OBEN },
  { text: "10 % off 62.50 pounds saves 6.25, so you pay 56.25.", kind: "rechnung", stufen: OBEN },
  { text: "15 % off 80.00 pounds saves 12.00, so you pay 68.00.", kind: "rechnung", stufen: OBEN },
  { text: "30 % off 210.00 pounds saves 63.00, so you pay 147.00.", kind: "rechnung", stufen: OBEN },
  { text: "5 % off 180.00 pounds saves 9.00, so you pay 171.00.", kind: "rechnung", stufen: OBEN },

  // — Tax added on a net figure (a worked example, not a tax-rate claim) —
  { text: "Net 200.00 plus 20 % tax comes to 240.00 pounds in all.", kind: "rechnung", stufen: OBEN },
  { text: "Net 350.00 plus 20 % tax comes to 420.00 pounds in all.", kind: "rechnung", stufen: OBEN },
  { text: "Net 145.00 plus 20 % tax comes to 174.00 pounds in all.", kind: "rechnung", stufen: OBEN },

  // — Change —
  { text: "From 60.00 after 41.35 you get 18.65 pounds in change.", kind: "rechnung", stufen: OBEN },
  { text: "From 100.00 after 68.20 you get 31.80 pounds in change.", kind: "rechnung", stufen: OBEN },
  { text: "From 25.00 after 19.45 you get 5.55 pounds in change.", kind: "rechnung", stufen: OBEN },

  // — Sums and instalments —
  { text: "Items 4.60 and 5.90 and 3.50 come to 14.00 pounds in all.", kind: "rechnung", stufen: OBEN },
  { text: "Items 22.40 and 27.60 come to 50.00 pounds in all.", kind: "rechnung", stufen: OBEN },
  { text: "Items 61.25 and 38.75 come to 100.00 pounds in all.", kind: "rechnung", stufen: OBEN },
  { text: "840.00 pounds in 12 instalments is 70.00 a month.", kind: "rechnung", stufen: OBEN },
  { text: "1560.00 pounds in 15 instalments is 104.00 a month.", kind: "rechnung", stufen: OBEN },
  { text: "2400.00 pounds in 24 instalments is 100.00 a month.", kind: "rechnung", stufen: OBEN },

  // — Dates and times —
  { text: "The meeting on 2026-03-14 runs from 09:15 to 11:45.", kind: "satz", stufen: OBEN },
  { text: "The deadline on 2026-09-30 ends at 12:00 sharp, no later.", kind: "satz", stufen: OBEN },
  { text: "Train 07:42 arrives on 2026-11-05 at 13:08, platform 4.", kind: "satz", stufen: OBEN },
  { text: "Invoice 2026-04-02 must be paid by 2026-05-16 at latest.", kind: "satz", stufen: OBEN },
  { text: "From 08:30 to 16:15 makes 7 hours 45 minutes exactly.", kind: "rechnung", stufen: OBEN },
  { text: "From 06:20 to 09:05 makes 2 hours 45 minutes exactly.", kind: "rechnung", stufen: OBEN },

  // — Digit blocks in the shape of an account number (invented practice runs) —
  { text: "Type the block 4711 0815 2306 9004 in one smooth run.", kind: "satz", stufen: OBEN },
  { text: "Type the block 6142 3097 5588 2014 without a pause.", kind: "satz", stufen: OBEN },
  { text: "Customer number 3049 8172 6650 sits at the top right.", kind: "satz", stufen: OBEN },
  { text: "Order number 31-5720-48 belongs to job 7704 in file 6.", kind: "satz", stufen: OBEN },
  { text: "Voucher 2026/0518 belongs to folder 92-07 on shelf 3.", kind: "satz", stufen: OBEN },
];

/** Equations, brackets, number runs, missing numbers, rounding, percents. */
const MATHS: CorpusItem[] = [
  // — Equations with a check —
  { text: "13 * 17 = 221 and 221 / 13 = 17, so the check works.", kind: "rechnung", stufen: OBEN },
  { text: "169 / 13 = 13 and 13 * 13 = 169, a tidy little square.", kind: "rechnung", stufen: OBEN },
  { text: "8 * 250 = 2000 and 2000 / 8 = 250, right on the nose.", kind: "rechnung", stufen: OBEN },
  { text: "100 - 43 = 57 and 57 + 43 = 100, that is the check.", kind: "rechnung", stufen: OBEN },
  { text: "14 * 6 = 84, 84 / 6 = 14 and 84 / 14 = 6 all hold up.", kind: "rechnung", stufen: OBEN },
  { text: "11 * 11 = 121 and 121 - 21 = 100, a round finish.", kind: "rechnung", stufen: OBEN },
  { text: "37 + 63 = 100, and backwards 100 - 63 = 37 holds too.", kind: "rechnung", stufen: OBEN },
  { text: "999 = 3 * 3 * 3 * 37, and 27 * 37 = 999 as well.", kind: "rechnung", stufen: OBEN },
  { text: "72 / 3 = 24, 72 / 4 = 18 and 72 / 6 = 12 all come out.", kind: "rechnung", stufen: OBEN },
  { text: "2000 / 4 = 500, and 2000 - 500 = 1500 is all that is left.", kind: "rechnung", stufen: OBEN },
  { text: "5 * 6 = 30, 6 * 7 = 42 and 7 * 8 = 56 are neighbours.", kind: "rechnung", stufen: OBEN },
  { text: "49 + 51 = 100, so are 28 + 72 and just as well 35 + 65.", kind: "rechnung", stufen: OBEN },
  { text: "0.5 + 0.125 = 0.625 and then 0.625 + 0.375 = 1.0 makes one.", kind: "rechnung", stufen: OBEN },
  { text: "4 * 4 * 4 * 4 = 256 and 256 * 4 = 1024, growing fast.", kind: "rechnung", stufen: OBEN },
  { text: "19 + 26 = 45, 45 + 26 = 71 and 71 + 26 = 97 in steps.", kind: "rechnung", stufen: OBEN },

  // — Brackets —
  { text: "(15 + 5) * 3 = 60, without brackets 15 + 5 * 3 = 30.", kind: "rechnung", stufen: OBEN },
  { text: "(40 - 8) / 4 = 8, without brackets 40 - 8 / 4 = 38.", kind: "rechnung", stufen: OBEN },
  { text: "(6 + 6) * (6 + 6) = 144, but 6 + 6 * 6 + 6 = 48 nearby.", kind: "rechnung", stufen: OBEN },
  { text: "3 * (18 + 2) = 60, and 3 * 18 + 2 = 56 is another thing.", kind: "rechnung", stufen: OBEN },

  // — Number runs —
  { text: "Count in eights: 8, 16, 24, 32, 40, 48, 56 and then 64.", kind: "rechnung", stufen: OBEN },
  { text: "Count in elevens: 11, 22, 33, 44, 55, 66, 77 and 88.", kind: "rechnung", stufen: OBEN },
  { text: "Count in twelves: 12, 24, 36, 48, 60, 72, 84 and 96.", kind: "rechnung", stufen: OBEN },
  { text: "Square numbers run 1, 4, 9, 16, 25, 36, 49 and then 64.", kind: "rechnung", stufen: OBEN },
  { text: "Cube numbers run 1, 8, 27, 64, 125, 216 and then 343.", kind: "rechnung", stufen: OBEN },
  { text: "Triangle numbers: 1, 3, 6, 10, 15, 21, 28, 36 and 45.", kind: "rechnung", stufen: OBEN },
  { text: "The run 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 and 89 is Fibonacci.", kind: "rechnung", stufen: OBEN },
  { text: "Powers of ten: 10, 100, 1000 and 10000 grow very fast.", kind: "rechnung", stufen: OBEN },
  { text: "Halve 640 four times: 320, then 160, then 80 and 40.", kind: "rechnung", stufen: OBEN },
  { text: "The run 3, 6, 12, 24, 48, 96 and 192 doubles each time.", kind: "rechnung", stufen: OBEN },
  { text: "Primes under 40 are 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37.", kind: "rechnung", stufen: OBEN },

  // — Which number is missing? —
  { text: "Which number is missing in 13, 26, 39, ?, 65, 78 - it is 52.", kind: "rechnung", stufen: OBEN },
  { text: "Which number is missing in 6, 12, 24, ?, 96, 192 - it is 48.", kind: "rechnung", stufen: OBEN },
  { text: "Which number is missing in 1, 4, 9, 16, ?, 36, 49, 64 - it is 25.", kind: "rechnung", stufen: OBEN },
  { text: "Which number is missing in 90, 80, 71, 63, ?, 50 - it is 56.", kind: "rechnung", stufen: OBEN },
  { text: "Which number is missing in 7, 14, 28, 56, ?, 224 - it is 112.", kind: "rechnung", stufen: OBEN },

  // — Rounding, parts, percents —
  { text: "Round 5372 to hundreds gives 5400 and to thousands 5000.", kind: "rechnung", stufen: OBEN },
  { text: "Round 18649 to hundreds gives 18600 and to thousands 19000.", kind: "rechnung", stufen: OBEN },
  { text: "1 % of 5600 is 56 and 10 % of 5600 is a round 560.", kind: "rechnung", stufen: OBEN },
  { text: "50 % of 94 is 47, and 25 % of 94 is exactly 23.5.", kind: "rechnung", stufen: OBEN },
  { text: "1 to 12 added up is 78, 1 to 30 added up is 465.", kind: "rechnung", stufen: OBEN },
];


/* ══════════════════════════════════════════════════════════════════════════
 * WELLE 4 — Geografie, Biologie/Natur, Alltag digital
 *
 * ★ Dieselbe Wahrhaftigkeits-Regel wie im Deutschen: jede Wissens-Zahl an ZWEI
 * unabhängigen Stellen geprüft, beide Fundstellen als Kommentar über der
 * Gruppe; strittige Zahlen (Donau, Amazonas, Marianengraben, Einwohnerzahlen)
 * kommen gar nicht vor. Die Belege sind dieselben wie in `corpusZiffern.ts` —
 * die Zeilen sind KEINE Übersetzungen, aber sie stehen auf denselben Quellen.
 * ════════════════════════════════════════════════════════════════════════ */

/** Heights, lengths, distances, measures, conversions. */
const GEOGRAPHY: CorpusItem[] = [
  // Peaks - source 1: en.wikipedia.org (Grossglockner 3798 m, Zugspitze
  // 2962 m, Mount Everest 8849 m). Source 2: campwerk.co.uk, size-explorer.com,
  // snopes.com fact check on Everest and the Mariana Trench.
  { text: "Peaks in m: Everest 8849, Glockner 3798, Zugspitze 2962.", kind: "wissen", stufen: OBEN },
  { text: "8849 metres minus 3798 metres leaves 5051 metres between.", kind: "wissen", stufen: OBEN },
  { text: "3798 minus 2962 leaves 836 metres between two peaks.", kind: "wissen", stufen: OBEN },

  // Nile - source 1: de.wikipedia.org, list of the longest rivers (6650 km).
  // Source 2: memphistours.com, the longest rivers in the world.
  { text: "The Nile runs 6650 km, which is 6650000 metres in full.", kind: "wissen", stufen: OBEN },

  // Earth - source 1: sternenforscher.de (12742 km across, 12714 km pole to
  // pole, 12756 km at the equator). Source 2: superprof.de, rhetos.de (40075 km).
  { text: "Earth: 40075 km round, 12742 km across, 12714 km pole to pole.", kind: "wissen", stufen: OBEN },
  { text: "Equator 12756 km, pole to pole 12714 km, round 40075 km.", kind: "wissen", stufen: OBEN },
  { text: "40075 km over 360 degrees is about 111 km a degree.", kind: "wissen", stufen: OBEN },

  // Moon and Sun - source 1: de.wikipedia.org (mean distance 384400 km).
  // Source 2: astronews.com (149,6 million km to the Sun).
  //
  // ★ On the light travel time (Chef-Abnahme I3, Fund 2): the popular sources
  // round to "8 minutes 20 seconds". This line states the value that follows
  // from its OWN numbers instead - 149600000 km over 299792.458 km/s is
  // 499.01 s, that is 8 minutes 19.01 seconds. With the exactly defined
  // astronomical unit (149597870.7 km) it comes to 499.005 s, again 8:19.
  // See the German counterpart for the full reasoning.
  { text: "The Moon sits 384400 km off, the Sun about 149600000 km.", kind: "wissen", stufen: OBEN },
  { text: "Sunlight takes 8 minutes 19 seconds to cross 149600000 km.", kind: "wissen", stufen: OBEN },

  // Austria - source 1: austria.info. Source 2: laenderdaten.info (83879 km2).
  { text: "Austria covers 83879 km2, which is 83879000000 square metres.", kind: "wissen", stufen: OBEN },

  // Lake Constance - source 1: de.wikipedia.org (251 m, 536 km2).
  // Source 2: ferienunterkunft-bodensee.de, lake data.
  { text: "Lake Constance: 251 m deep, 536 km2, 53600 hectares.", kind: "wissen", stufen: OBEN },

  // Sound and light - source 1: de.wikipedia.org (343 m/s at 20 degrees).
  // Source 2: abi-physik.de (299792458 m/s), akustikform.ch (343 m/s).
  { text: "343 m a second of sound is 20580 m a minute, 1234800 an hour.", kind: "wissen", stufen: OBEN },
  { text: "Light runs 299792458 m a second, sound only 343 m.", kind: "wissen", stufen: OBEN },

  // Conversions (true by definition)
  { text: "1 km is 1000 m, 1 m is 100 cm and 1 cm is 10 mm exactly.", kind: "rechnung", stufen: OBEN },
  { text: "1 km2 is 1000000 m2, and 1 hectare is 10000 m2 exactly.", kind: "rechnung", stufen: OBEN },
  { text: "1 tonne is 1000 kg, 1 kg is 1000 g, 1 g is 1000 mg flat.", kind: "rechnung", stufen: OBEN },
  { text: "1 mile is 1609.344 m, 1 inch 2.54 cm, 1 foot 0.3048 m.", kind: "rechnung", stufen: OBEN },
  { text: "1 yard is 0.9144 m, that is 3 feet or 36 inches, 91.44 cm.", kind: "rechnung", stufen: OBEN },
  { text: "1 nautical mile is 1852 m, so 10 of them are 18520 m.", kind: "rechnung", stufen: OBEN },
  { text: "1 litre is 1000 ml, 1 ml is 1 cm3, 1 m3 is 1000 litres.", kind: "rechnung", stufen: OBEN },
  { text: "1 hour is 3600 seconds and 1 day is 86400 seconds flat.", kind: "rechnung", stufen: OBEN },
  { text: "365 days is 8760 hours, 366 days is 8784 hours exactly.", kind: "rechnung", stufen: OBEN },
];

/** Heartbeats, breaths, speeds, sizes from nature. */
const BIOLOGY: CorpusItem[] = [
  // Human body - source 1: my.clevelandclinic.org (206 bones, pulse 60 to 100),
  // hopkinsmedicine.org (12 to 20 breaths, 37 degrees). Source 2: kenhub.com
  // (206 bones, 27 in a hand, 26 in a foot, 24 ribs, 32 teeth), ummhealth.org.
  { text: "Bones 206, teeth 32, ribs 24, hand 27, foot 26, heart 4.", kind: "wissen", stufen: OBEN },
  { text: "Resting pulse 60 to 100, elephant 30, hummingbird 1260.", kind: "wissen", stufen: OBEN },
  { text: "Pulse 60 a minute is 3600 an hour and 86400 in one day.", kind: "rechnung", stufen: OBEN },
  { text: "Pulse 80 a minute is 4800 an hour and 115200 in one day.", kind: "rechnung", stufen: OBEN },
  { text: "Pulse 100 a minute is 6000 an hour and 144000 in a day.", kind: "rechnung", stufen: OBEN },
  { text: "Elephant 30 a minute: 1800 an hour, 43200 in one day.", kind: "rechnung", stufen: OBEN },
  { text: "Hummingbird 1260 a minute: 75600 an hour, 1814400 a day.", kind: "rechnung", stufen: OBEN },
  { text: "12 to 20 breaths a minute makes 17280 to 28800 in a day.", kind: "rechnung", stufen: OBEN },

  // Speed - source 1: en.wikipedia.org, Fastest animals (cheetah 100 to
  // 120 km/h, peregrine falcon over 300 km/h in a dive). Source 2: wwf.org.uk,
  // Record breaking animals; ifaw.org, fastest animals on Earth.
  { text: "A cheetah at 120 km/h covers 120000 m in 60 minutes.", kind: "wissen", stufen: OBEN },
  { text: "A peregrine at 300 km/h covers 300000 m in 60 minutes.", kind: "wissen", stufen: OBEN },

  // Blue whale - source 1: discoverwildlife.com, blue whale guide (24 to 30 m).
  // Source 2: a-z-animals.com (100 to 150 tonnes).
  { text: "A blue whale reaches 30 m and 150 tonnes, so 150000 kg.", kind: "wissen", stufen: OBEN },
  { text: "30 metres is 3000 cm, 30000 mm and 0.03 of a kilometre.", kind: "rechnung", stufen: OBEN },

  // Emperor penguin - source 1: wwf.org.uk, top 10 facts (past 500 m).
  // Source 2: worldatlas.com, emperor penguin facts.
  { text: "Penguins dive past 500 m: 50000 cm and 500000 mm down.", kind: "wissen", stufen: OBEN },

  // Bee colony - source 1: honestbeeltd.com (up to 50000 in summer).
  // Source 2: standard beekeeping figures for a colony in high summer.
  { text: "A bee colony holds 50000 in summer, so 10 hold 500000.", kind: "rechnung", stufen: OBEN },

  // Tallest tree - source 1: en.wikipedia.org, Hyperion (tree).
  // Source 2: guinnessworldrecords.com, tallest living tree. Both past 115 m.
  { text: "The tallest tree tops 115 m: 11500 cm and 115000 mm.", kind: "wissen", stufen: OBEN },

  // Temperature and volume (conversions)
  { text: "37 degrees Celsius is 98.6 Fahrenheit, 100 turns 212.", kind: "rechnung", stufen: OBEN },
  { text: "0 Celsius is 32 Fahrenheit, 20 is 68, 40 is 104 exactly.", kind: "rechnung", stufen: OBEN },
  { text: "About 5 litres of blood is 5000 ml, 50 dl, 0.005 m3.", kind: "rechnung", stufen: OBEN },
  { text: "1 litre of water is 1 kg, 1000 litres 1000 kg, 1 m3 too.", kind: "rechnung", stufen: OBEN },
  { text: "One day holds 24 hours, 1440 minutes and 86400 seconds.", kind: "rechnung", stufen: OBEN },
  { text: "One week: 7 days, 168 hours, 10080 minutes, 604800 seconds.", kind: "rechnung", stufen: OBEN },
];

/**
 * Everyday digital life. Every address is an invented example address
 * (`example.org`) or a reserved network range - none points at a real person
 * or firm.
 */
const DIGITAL_EN: CorpusItem[] = [
  { text: "Sign up at course2026@example.org before 2026-09-15 at 12:00.", kind: "satz", stufen: OBEN },
  { text: "Reply to group07@example.org before 2026-10-30 at 17:30.", kind: "satz", stufen: OBEN },
  { text: "Write to team2026@example.org before 2026-11-14 at 09:00.", kind: "satz", stufen: OBEN },
  { text: "Hand in to work2026@example.org closes on 2026-12-08.", kind: "satz", stufen: OBEN },
  { text: "Open example.org/2026/08/21/sheet-12 and read page 47.", kind: "satz", stufen: OBEN },
  { text: "Open example.org/2026/09/17/sheet-8 and read point 45.", kind: "satz", stufen: OBEN },
  // ★ 2026-10-03 is a Saturday: ISO week 40, weekday 6. "day 2" stood here
  // until the Chef-Abnahme - that would have been 2026-09-29.
  { text: "Page example.org/2026/10/03/sheet-12 sits in week 40, day 6.", kind: "satz", stufen: OBEN },
  { text: "The stamp 2026-08-21 14:07:33 heads every single line.", kind: "satz", stufen: OBEN },
  { text: "Save the file 2026-08-21-notes.txt before 18:00 tonight.", kind: "satz", stufen: OBEN },
  { text: "Note down 2026-08-21, 09:45, room 214, seat 17, row 3.", kind: "satz", stufen: OBEN },
  { text: "Voucher 2026/0912 sits in folder 14, drawer 3, row 8.", kind: "satz", stufen: OBEN },
  { text: "Tag AB-2026-0417, check digit 83, drawer 12, row 5 here.", kind: "satz", stufen: OBEN },
  { text: "Type the line: version 3.14 of 2026-03-07, then 3.15.", kind: "satz", stufen: OBEN },
  // 127.0.0.1 and 192.168.x.x are reserved ranges (RFC 1122, RFC 1918).
  { text: "Address 192.168.0.15 belongs to the net 192.168.0.0 here.", kind: "wissen", stufen: OBEN },
  { text: "127.0.0.1 means localhost, 255.255.255.0 is a net mask.", kind: "wissen", stufen: OBEN },
  { text: "1024 bytes is 1 kB, 1024 kB is 1 MB, 1024 MB is 1 GB.", kind: "rechnung", stufen: OBEN },
  { text: "8 bits is 1 byte, 1024 bytes is 1 kB, 1048576 bytes 1 MB.", kind: "rechnung", stufen: OBEN },
  { text: "1 TB is 1024 GB, 1 GB is 1024 MB, 1 MB is 1024 kB flat.", kind: "rechnung", stufen: OBEN },
  { text: "The file weighs 2048 kB, so 2 MB or 2097152 bytes flat.", kind: "rechnung", stufen: OBEN },
  { text: "87 % full: 435 of 500 GB used, 65 GB free, 13 % left.", kind: "rechnung", stufen: OBEN },
  { text: "350 files: 120 pictures, 180 texts, 50 sounds, 0 films.", kind: "rechnung", stufen: OBEN },
];

/** Charge I3 (englisch): Welle 3 und 4. */
export const ZIFFERN_EN_CORPUS: CorpusItem[] = [
  ...COMMERCE,
  ...MATHS,
  ...GEOGRAPHY,
  ...BIOLOGY,
  ...DIGITAL_EN,
];
