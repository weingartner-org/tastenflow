/**
 * ZIFFERN- UND SONDERZEICHEN-PORTFOLIO (Charge I3, 21.08.2026) — deutsch.
 *
 * Bauplan `Sensorik/BAUPLAN-2026-08-14-TASTENFLOW-DREI-STUFEN-UND-INHALT.md`
 * §5 I3. Der gemessene Anlass: Der deutsche Bestand hatte 105 Zeilen mit
 * Ziffern (4470 Anschläge), aber nur 10,8 Prozent Ziffern JE ZEILE — für ein
 * echtes Ziffern-Training viel zu wortlastig. Nach dem Oversampling-Prinzip
 * (wer Ziffern lernen soll, muss sie überdurchschnittlich oft tippen) liegt
 * jede Zeile hier bei **20 bis 35 Prozent Ziffern-Anteil**, gemessen, nicht
 * geschätzt.
 *
 * ── Zeichensatz ────────────────────────────────────────────────────────────
 * Alles hier ist **T5** (Ziffern sind die letzte Tastenstufe). Anders als
 * `corpusZahlen.ts`, das sich freiwillig auf den Basis-Zeichensatz beschränkt,
 * nutzt diese Datei den vollen T5-Satz: Ziffern plus `( ) " + * / = % @ € §`
 * und die T4-Satzzeichen. Jedes verwendete Zeichen steht in `SYMBOL_ORDER`
 * bzw. `DIGIT_ORDER` (letters.ts) — sonst wäre `minTierFor` null und die Zeile
 * unservierbar. Nur der einfache Bindestrich `-`, nie – oder — (Braillezeile).
 *
 * ── Wahrhaftigkeit (Johannes' härteste Vorgabe) ────────────────────────────
 *  • **Kaufmännische Zeilen sind Rechen-SZENEN, keine Preisbehauptungen.**
 *    „3 Hefte zu je 2,40 Euro kosten 7,20 Euro." behauptet nichts über den
 *    Heftpreis der Welt, sondern rechnet vor. Jede Summe ist nachgerechnet.
 *  • **Wissens-Zahlen sind doppelt belegt**, die beiden Fundstellen stehen als
 *    Kommentar unmittelbar über der Zeile.
 *  • **Mail- und Web-Adressen zeigen auf niemanden**: nur `example.org`,
 *    `beispiel.de` und die Projekt-Adresse.
 *
 * ── Stufen ─────────────────────────────────────────────────────────────────
 * `teens` und `erwachsen` — `kids` bleibt außen vor (Bauplan-Vorgabe: Ziffern
 * sind die letzte Tastenstufe, die Jüngsten kommen dort erst spät an).
 *
 * ⚠️ Nach dem Einpflegen: `npx tsx scripts/erzeuge-korpus-anker.mts` (siehe
 * `corpusAnker.ts`) — sonst wird `tests/typing-ledger-anker.test.ts` rot.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

/** Die beiden oberen Stufen. Ziffern sind für die Jüngsten zu spät dran. */
const OBEN: Stufe[] = ["teens", "erwachsen"];

/* ══════════════════════════════════════════════════════════════════════════
 * WELLE 1 — kaufmännisch und mathematisch
 * ════════════════════════════════════════════════════════════════════════ */

/** Preise, Rechnungen, Rabatte, Bons, Datum und Uhrzeit, Ziffernblöcke. */
const KAUFMAENNISCH: CorpusItem[] = [
  // — Stückzahl mal Einzelpreis (jede Summe nachgerechnet) —
  { text: "Bon 4711: 3 Hefte zu je 2,40 Euro kosten 7,20 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4712: 4 Ordner zu je 3,50 Euro kosten 14,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4713: 6 Stifte zu je 1,25 Euro kosten 7,50 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4714: 12 Marken zu je 0,80 Euro kosten 9,60 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4715: 5 Kisten zu je 12,60 Euro kosten 63,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4716: 8 Becher zu je 2,75 Euro kosten 22,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4717: 9 Meter zu je 4,20 Euro kosten 37,80 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4718: 7 Karten zu je 6,50 Euro kosten 45,50 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4719: 15 Nägel zu je 1,40 Euro kosten 21,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4720: 24 Rollen zu je 0,95 Euro kosten 22,80 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4721: 11 Gläser zu je 3,30 Euro kosten 36,30 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 4722: 2 Lampen zu je 18,50 Euro kosten 37,00 Euro.", kind: "rechnung", stufen: OBEN },

  // — Zwei Posten auf einem Bon —
  { text: "Bon 51: 3 * 1,80 plus 2 * 4,50 ergibt 14,40 Euro genau.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 52: 4 * 2,20 plus 3 * 1,60 ergibt 13,60 Euro genau.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 53: 6 * 0,75 plus 2 * 3,25 ergibt 11,00 Euro genau.", kind: "rechnung", stufen: OBEN },
  { text: "Bon 54: 5 * 2,40 plus 4 * 1,75 ergibt 19,00 Euro genau.", kind: "rechnung", stufen: OBEN },

  // — Rabatt in Prozent —
  { text: "20 % Rabatt auf 85,00 Euro sind 17,00 Euro, zu zahlen 68,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "25 % Rabatt auf 120,00 Euro sind 30,00 Euro, es bleiben 90,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "10 % Rabatt auf 47,50 Euro sind 4,75 Euro, zu zahlen 42,75 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "15 % Rabatt auf 60,00 Euro sind 9,00 Euro, es bleiben 51,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "30 % Rabatt auf 250,00 Euro sind 75,00 Euro, zu zahlen 175,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "5 % Rabatt auf 140,00 Euro sind 7,00 Euro, es bleiben 133,00 Euro.", kind: "rechnung", stufen: OBEN },

  // — Umsatzsteuer: 20 Prozent ist der österreichische Normalsatz —
  // Beleg 1: BMF Österreich, Umsatzsteuer, Normalsteuersatz 20 %.
  // Beleg 2: WKO Steuerinformation, Umsatzsteuersätze Österreich 20/13/10 %.
  { text: "Netto 250,00 plus 20 % Steuer ergibt brutto 300,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Netto 480,00 plus 20 % Steuer ergibt brutto 576,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Netto 135,00 plus 20 % Steuer ergibt brutto 162,00 Euro.", kind: "rechnung", stufen: OBEN },

  // — Rückgeld —
  { text: "Von 50,00 bleiben nach 32,60 noch 17,40 Euro Rückgeld.", kind: "rechnung", stufen: OBEN },
  { text: "Von 100,00 bleiben nach 73,45 noch 26,55 Euro Rückgeld.", kind: "rechnung", stufen: OBEN },
  { text: "Von 20,00 bleiben nach 14,80 noch 5,20 Euro Rückgeld.", kind: "rechnung", stufen: OBEN },

  // — Summen und Raten —
  { text: "Die Posten 3,60 und 4,90 und 2,50 Euro ergeben 11,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Die Posten 12,30 und 37,70 ergeben zusammen 50,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "Die Posten 45,90 und 54,10 Euro ergeben zusammen 100,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "720,00 Euro in 12 Raten sind je Monat 60,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "1350,00 Euro in 15 Raten sind je Monat 90,00 Euro.", kind: "rechnung", stufen: OBEN },
  { text: "1440,00 Euro in 24 Raten sind je Monat 60,00 Euro.", kind: "rechnung", stufen: OBEN },

  // — Datum und Uhrzeit —
  { text: "Der Termin am 14.03.2026 dauert von 09:15 bis 11:45 Uhr.", kind: "satz", stufen: OBEN },
  { text: "Die Frist am 30.09.2026 endet um 12:00 Uhr mittags.", kind: "satz", stufen: OBEN },
  { text: "Der Zug um 07:42 Uhr trifft am 05.11.2026 um 13:08 Uhr ein.", kind: "satz", stufen: OBEN },
  { text: "Die Rechnung vom 02.04.2026 ist bis 16.05.2026 zu begleichen.", kind: "satz", stufen: OBEN },
  { text: "Von 08:30 bis 16:15 sind es 7 Stunden 45 Minuten genau.", kind: "rechnung", stufen: OBEN },
  { text: "Von 06:20 bis 09:05 sind es 2 Stunden 45 Minuten genau.", kind: "rechnung", stufen: OBEN },

  // — Ziffernblöcke nach IBAN-Art (erfundene Übungsblöcke, keine echte IBAN) —
  { text: "Übe den Ziffernblock 4711 0815 2306 9004 in einem Zug.", kind: "satz", stufen: OBEN },
  { text: "Übe den Ziffernblock 5320 7761 4098 2215 ohne Pause.", kind: "satz", stufen: OBEN },
  { text: "Die Kundennummer 3049 8172 6650 steht oben auf dem Blatt.", kind: "satz", stufen: OBEN },
  { text: "Die Bestellnummer 27-4830-19 gehört zum Auftrag 6612.", kind: "satz", stufen: OBEN },
  { text: "Der Beleg 2026/0417 gehört zur Sammelmappe 88-03 im Regal.", kind: "satz", stufen: OBEN },
];

/** Zahlenfolgen, Gleichungen, Klammern, „Welche Zahl fehlt?". */
const MATHEMATIK: CorpusItem[] = [
  // — Gleichungen mit Probe (jede nachgerechnet) —
  { text: "17 * 23 = 391 und 391 / 17 = 23, die Probe stimmt genau.", kind: "rechnung", stufen: OBEN },
  { text: "144 / 12 = 12 und 12 * 12 = 144, ein sauberes Quadrat.", kind: "rechnung", stufen: OBEN },
  { text: "8 * 125 = 1000 und 1000 / 8 = 125, das passt auf Anhieb.", kind: "rechnung", stufen: OBEN },
  { text: "100 - 37 = 63 und 63 + 37 = 100, das ist die Gegenprobe.", kind: "rechnung", stufen: OBEN },
  { text: "12 * 7 = 84, 84 / 7 = 12 und 84 / 12 = 7 stimmen.", kind: "rechnung", stufen: OBEN },
  { text: "9 * 9 = 81 und 81 + 19 = 100, ein runder Abschluss.", kind: "rechnung", stufen: OBEN },
  { text: "45 + 55 = 100, und rückwärts gilt 100 - 55 = 45 genau.", kind: "rechnung", stufen: OBEN },
  { text: "1001 = 7 * 11 * 13, und 143 = 11 * 13 steckt mit darin.", kind: "rechnung", stufen: OBEN },
  { text: "96 / 3 = 32, 96 / 4 = 24 und 96 / 6 = 16 gehen glatt auf.", kind: "rechnung", stufen: OBEN },
  { text: "1000 / 4 = 250, und 1000 - 250 = 750 bleiben als Rest.", kind: "rechnung", stufen: OBEN },
  { text: "6 * 7 = 42, 7 * 8 = 56 und 8 * 9 = 72 sind drei Nachbarn.", kind: "rechnung", stufen: OBEN },
  { text: "36 + 64 = 100, ebenso 25 + 75 und genauso gut 48 + 52.", kind: "rechnung", stufen: OBEN },
  { text: "0,5 + 0,25 = 0,75 und 0,75 + 0,25 = 1,0 ergibt ein Ganzes.", kind: "rechnung", stufen: OBEN },
  { text: "3 * 3 * 3 * 3 = 81 und 81 * 3 = 243, so wächst es rasch.", kind: "rechnung", stufen: OBEN },
  { text: "17 + 28 = 45, 45 + 28 = 73 und 73 + 28 = 101 in Schritten.", kind: "rechnung", stufen: OBEN },

  // — Klammern —
  { text: "(12 + 8) * 4 = 80, ohne Klammer wäre 12 + 8 * 4 = 44.", kind: "rechnung", stufen: OBEN },
  { text: "(30 - 6) / 4 = 6, ohne Klammer wäre 30 - 6 / 4 = 28,5.", kind: "rechnung", stufen: OBEN },
  { text: "(5 + 5) * (5 + 5) = 100, aber 5 + 5 * 5 + 5 = 35 daneben.", kind: "rechnung", stufen: OBEN },
  { text: "2 * (14 + 6) = 40, und 2 * 14 + 6 = 34 ist etwas anderes.", kind: "rechnung", stufen: OBEN },

  // — Zahlenfolgen —
  { text: "Zähle in Siebenerschritten: 7, 14, 21, 28, 35, 42 und 49.", kind: "rechnung", stufen: OBEN },
  { text: "Zähle in Neunerschritten: 9, 18, 27, 36, 45, 54, 63, 72.", kind: "rechnung", stufen: OBEN },
  { text: "Zähle in Sechserschritten: 6, 12, 18, 24, 30, 36 und 42.", kind: "rechnung", stufen: OBEN },
  { text: "Quadratzahlen sind 1, 4, 9, 16, 25, 36, 49 und dann 64.", kind: "rechnung", stufen: OBEN },
  { text: "Dreieckszahlen: 1, 3, 6, 10, 15, 21, 28, 36 und dann 45.", kind: "rechnung", stufen: OBEN },
  { text: "Die Reihe 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 und 89 heißt Fibonacci.", kind: "rechnung", stufen: OBEN },
  { text: "Die Zehnerpotenzen 10, 100, 1000 und 10000 wachsen rasant.", kind: "rechnung", stufen: OBEN },
  { text: "Halbiere 512 viermal: 256, dann 128, dann 64 und dann 32.", kind: "rechnung", stufen: OBEN },
  { text: "Die Reihe 2, 4, 8, 16, 32, 64 und 128 verdoppelt sich stets.", kind: "rechnung", stufen: OBEN },
  { text: "Primzahlen unter 30: 2, 3, 5, 7, 11, 13, 17, 19, 23 und 29.", kind: "rechnung", stufen: OBEN },

  // — Welche Zahl fehlt? (Regel jeweils geprüft) —
  { text: "Welche Zahl fehlt in 11, 22, 33, 44, ?, 66 - es ist die 55.", kind: "rechnung", stufen: OBEN },
  { text: "Welche Zahl fehlt in 5, 10, 20, 40, ?, 160 - es ist die 80.", kind: "rechnung", stufen: OBEN },
  { text: "Welche Zahl fehlt in 100, 90, 81, 73, ?, 60 - es ist die 66.", kind: "rechnung", stufen: OBEN },
  { text: "Welche Zahl fehlt in 1, 4, 9, 16, ?, 36, 49, 64 - die 25.", kind: "rechnung", stufen: OBEN },
  { text: "Welche Zahl fehlt in 3, 6, 12, 24, ?, 96, 192 - die 48.", kind: "rechnung", stufen: OBEN },
  { text: "Welche Zahl fehlt in 81, 72, 63, 54, ?, 36 - es ist die 45.", kind: "rechnung", stufen: OBEN },

  // — Runden, Anteile, Prozent —
  { text: "Runde 3847 auf Hunderter zu 3800 und auf Tausender zu 4000.", kind: "rechnung", stufen: OBEN },
  { text: "Runde 12549 auf Hunderter zu 12500 und auf Tausender zu 13000.", kind: "rechnung", stufen: OBEN },
  { text: "1 % von 4500 sind 45 und 10 % von 4500 sind glatte 450.", kind: "rechnung", stufen: OBEN },
  { text: "50 % von 86 sind 43, und 25 % von 86 sind genau 21,5.", kind: "rechnung", stufen: OBEN },
  { text: "1 bis 10 addiert sind 55, 1 bis 20 addiert sind 210.", kind: "rechnung", stufen: OBEN },
];


/* ══════════════════════════════════════════════════════════════════════════
 * WELLE 2 — Geografie, Biologie/Natur, Alltag digital
 *
 * ★ WAHRHAFTIGKEIT: Jede Wissens-Zahl unten ist an ZWEI unabhängigen Stellen
 * geprüft; die beiden Fundstellen stehen als Kommentar über der Gruppe. Wo
 * eine Zahl in der Literatur STRITTIG ist (Donaulänge 2857 gegen 2888 km,
 * Amazonaslänge, Tiefe des Marianengrabens 10 935 gegen 10 994 m, Einwohner-
 * zahlen mit Stichtag), steht sie hier GAR NICHT — lieber eine Lücke als eine
 * Zahl, die ein Kind auswendig lernt und die dann falsch ist.
 *
 * Der zweite Baustein dieser Wellen sind UMRECHNUNGEN und abgeleitete
 * Rechnungen (1 km = 1000 m, Puls je Minute → je Tag). Die sind per
 * Definition wahr, maschinell nachrechenbar — und sie tragen die Ziffern-
 * Dichte, die reine Faktensätze im Deutschen nicht hergeben: „Der
 * Großglockner ist 3798 Meter hoch." kommt auf 13 % Ziffern, gefordert sind
 * 20 bis 35.
 * ════════════════════════════════════════════════════════════════════════ */

/** Höhen, Längen, Entfernungen, Maße, Temperaturen. */
const GEOGRAFIE: CorpusItem[] = [
  // Gipfelhöhen — Beleg 1: en.wikipedia.org/wiki/Grossglockner (3798 m),
  // /wiki/Zugspitze (2962 m), /wiki/Mount_Everest (8849 m).
  // Beleg 2: campwerk.co.uk (Großglockner 3798 m), size-explorer.com
  // (Zugspitze 2962 m), snopes.com Faktencheck Everest/Marianengraben (8849 m).
  { text: "Gipfel in m: Everest 8849, Glockner 3798, Zugspitze 2962.", kind: "wissen", stufen: OBEN },
  { text: "8849 m Everest minus 3798 m Glockner sind 5051 m Abstand.", kind: "wissen", stufen: OBEN },
  { text: "3798 minus 2962 sind 836 m: Glockner über Zugspitze.", kind: "wissen", stufen: OBEN },

  // Nil — Beleg 1: de.wikipedia.org, Liste der längsten Flüsse der Erde
  // (Nil 6650 km). Beleg 2: memphistours.com, Die längsten Flüsse der Welt.
  { text: "Der Nil misst 6650 km, das sind 6650000 m in Zahlen.", kind: "wissen", stufen: OBEN },

  // Erdmaße — Beleg 1: sternenforscher.de (Durchmesser 12742 km, Pol 12714 km,
  // Äquator 12756 km). Beleg 2: superprof.de bzw. rhetos.de (Umfang 40075 km).
  { text: "Erdumfang 40075 km, Durchmesser 12742 km, Pol 12714 km.", kind: "wissen", stufen: OBEN },
  { text: "Äquator 12756 km, Pol zu Pol 12714 km, Umfang 40075 km.", kind: "wissen", stufen: OBEN },
  { text: "40075 km durch 360 Grad sind rund 111 km je Grad.", kind: "wissen", stufen: OBEN },

  // Mond und Sonne — Beleg 1: de.wikipedia.org/wiki/Monddurchmesser
  // (mittlere Entfernung 384400 km). Beleg 2: astronews.com (149,6 Mio km zur
  // Sonne), kreis-journal.de (384400 km).
  //
  // ★ Zur Lichtlaufzeit (Chef-Abnahme I3, Fund 2): Die populären Quellen nennen
  // gerundet „8 Minuten 20 Sekunden". Die Zeile nennt statt dessen den Wert, der
  // sich AUS IHREN EIGENEN ZAHLEN ergibt — 149600000 km geteilt durch die
  // Lichtgeschwindigkeit 299792,458 km/s sind 499,01 s, also 8 Minuten und
  // 19,01 Sekunden. Mit der exakt definierten Astronomischen Einheit
  // (149597870,7 km) kommen 499,005 s heraus, ebenfalls 8:19. Beide Lesarten
  // runden auf 19 Sekunden, mit einem halben Sekunden Abstand zur Grenze.
  // Ein Kind, das diese Zeile nachrechnet, bekommt genau das, was dort steht -
  // und das ist in einem Tippprogramm mehr wert als der gerundete Merksatz.
  { text: "Mond 384400 km weit weg, Sonne rund 149600000 km.", kind: "wissen", stufen: OBEN },
  { text: "Sonnenlicht braucht 8 Minuten 19 Sekunden für 149600000 km.", kind: "wissen", stufen: OBEN },

  // Österreich — Beleg 1: austria.info, Österreich für Schülerinnen
  // (83879 km2). Beleg 2: laenderdaten.info, Österreich Länderdaten.
  { text: "Österreich misst 83879 km2, also 83879000000 Quadratmeter.", kind: "wissen", stufen: OBEN },

  // Bodensee — Beleg 1: de.wikipedia.org/wiki/Bodensee (251 m tiefste Stelle,
  // 536 km2). Beleg 2: ferienunterkunft-bodensee.de, Bodensee-Daten.
  { text: "Bodensee: 251 m tief, 536 km2 groß, 53600 Hektar Fläche.", kind: "wissen", stufen: OBEN },

  // Schall und Licht — Beleg 1: de.wikipedia.org/wiki/Schallgeschwindigkeit
  // (343 m/s bei 20 Grad). Beleg 2: abi-physik.de, Schall- und
  // Lichtgeschwindigkeit (299792458 m/s), akustikform.ch (343 m/s).
  { text: "343 m/s Schall sind 20580 m je Minute und 1234800 je Stunde.", kind: "wissen", stufen: OBEN },
  { text: "Licht macht 299792458 m je Sekunde, Schall nur 343 m.", kind: "wissen", stufen: OBEN },

  // Umrechnungen (per Definition wahr, kein Beleg nötig)
  { text: "1 km sind 1000 m, 1 m sind 100 cm und 1 cm sind 10 mm.", kind: "rechnung", stufen: OBEN },
  { text: "1 km2 sind 1000000 m2, und 1 Hektar sind 10000 m2 genau.", kind: "rechnung", stufen: OBEN },
  { text: "1 Tonne sind 1000 kg, 1 kg sind 1000 g, 1 g sind 1000 mg.", kind: "rechnung", stufen: OBEN },
  { text: "1 Meile sind 1609,344 m, 1 Zoll 2,54 cm, 1 Fuß 0,3048 m.", kind: "rechnung", stufen: OBEN },
  { text: "1 Seemeile sind 1852 m, also 10 Seemeilen 18520 m.", kind: "rechnung", stufen: OBEN },
  { text: "1 Liter sind 1000 ml, 1 ml ist 1 cm3, 1 m3 sind 1000 Liter.", kind: "rechnung", stufen: OBEN },
  { text: "1 Stunde sind 3600 Sekunden, 1 Tag sind 86400 Sekunden.", kind: "rechnung", stufen: OBEN },
  { text: "365 Tage sind 8760 Stunden, 366 Tage sind 8784 Stunden.", kind: "rechnung", stufen: OBEN },
  { text: "Ein Jahr hat 365 Tage, 8760 Stunden und 525600 Minuten.", kind: "rechnung", stufen: OBEN },
];

/** Herzschläge, Atemzüge, Geschwindigkeiten, Maße aus der Natur. */
const BIOLOGIE: CorpusItem[] = [
  // Menschlicher Körper — Beleg 1: my.clevelandclinic.org, Bones (206 Knochen),
  // hopkinsmedicine.org, Vital Signs (37 Grad, 12 bis 20 Atemzüge, Puls 60 bis
  // 100). Beleg 2: kenhub.com, Bones of the human body (206; Hand 27, Fuß 26,
  // 24 Rippen, 32 bleibende und 20 Milchzähne), ummhealth.org (Vital Signs).
  { text: "Knochen 206, Zähne 32, Rippen 24, Hand 27, Fuß 26, Herz 4.", kind: "wissen", stufen: OBEN },
  { text: "1 Woche: 7 Tage, 168 Stunden, 10080 Minuten, 604800 Sekunden.", kind: "rechnung", stufen: OBEN },
  { text: "4 Wochen sind 28 Tage, 672 Stunden und 40320 Minuten.", kind: "rechnung", stufen: OBEN },
  { text: "37 °C = 98,6 °F, 0 °C = 32 °F und 100 °C = 212 °F genau.", kind: "rechnung", stufen: OBEN },

  // Puls — Beleg 1: dinoanimals.com, Heart rates of animals (Elefant 30,
  // Kolibri 1260). Beleg 2: visualcapitalist.com, Resting Heart Rates of 15
  // Animals; my.clevelandclinic.org, Heart Rate (Mensch 60 bis 100).
  { text: "Ruhepuls Mensch 60 bis 100, Elefant 30, Kolibri 1260.", kind: "wissen", stufen: OBEN },
  { text: "Puls 60 je Minute: 3600 je Stunde, 86400 an einem Tag.", kind: "rechnung", stufen: OBEN },
  { text: "Puls 80 je Minute: 4800 je Stunde und 115200 an einem Tag.", kind: "rechnung", stufen: OBEN },
  { text: "Puls 100 je Minute: 6000 je Stunde, 144000 an einem Tag.", kind: "rechnung", stufen: OBEN },
  { text: "Elefant 30 je Minute: 1800 je Stunde, 43200 am Tag.", kind: "rechnung", stufen: OBEN },
  { text: "Kolibri 1260 je Minute sind 75600 je Stunde, 1814400 am Tag.", kind: "rechnung", stufen: OBEN },

  // Atmung
  { text: "12 bis 20 Atemzüge je Minute, 17280 bis 28800 am Tag.", kind: "rechnung", stufen: OBEN },

  // Tempo — Beleg 1: en.wikipedia.org/wiki/Fastest_animals (Gepard 100 bis
  // 120 km/h, Wanderfalke über 300 km/h im Sturzflug). Beleg 2: wwf.org.uk,
  // Record breaking animals; ifaw.org, 20 of the fastest animals on Earth.
  { text: "Gepard 120 km/h sind 120000 m in 60 Minuten, 2000 je Minute.", kind: "wissen", stufen: OBEN },
  { text: "Wanderfalke 300 km/h sind 300000 m in 60 Minuten, 5000 je Minute.", kind: "wissen", stufen: OBEN },

  // Blauwal — Beleg 1: discoverwildlife.com, Blue whale guide (24 bis 30 m).
  // Beleg 2: a-z-animals.com, Blue Whale Lifespan (100 bis 150 Tonnen).
  { text: "Blauwal bis 30 m und 150 t, das sind 150000 kg Gewicht.", kind: "wissen", stufen: OBEN },
  { text: "Blauwal 30 m sind 3000 cm, 30000 mm und 0,03 Kilometer.", kind: "rechnung", stufen: OBEN },

  // Kaiserpinguin — Beleg 1: wwf.org.uk, Top 10 facts about Emperor penguins
  // (über 500 m Tauchtiefe). Beleg 2: worldatlas.com, Emperor Penguin Facts.
  { text: "Kaiserpinguin über 500 m tief: 50000 cm und 500000 mm.", kind: "wissen", stufen: OBEN },

  // Bienenvolk — Beleg 1: honestbeeltd.com, colony up to 50000 in summer.
  // Beleg 2: WWF/Imkerei-Angaben zur Sommerstärke eines Volkes (bis 50000).
  { text: "Bienenvolk bis 50000 Tiere, 10 Völker sind 500000 Bienen.", kind: "rechnung", stufen: OBEN },

  // Höchster Baum — Beleg 1: en.wikipedia.org/wiki/Hyperion_(tree).
  // Beleg 2: guinnessworldrecords.com, Tallest tree living. Beide über 115 m.
  { text: "Höchster Baum über 115 m: 11500 cm, 115000 mm, 0,115 km.", kind: "wissen", stufen: OBEN },

  // Wasser und Blut (Umrechnungen)
  { text: "Rund 5 Liter Blut sind 5000 ml, 50 dl und 0,005 m3.", kind: "rechnung", stufen: OBEN },
  { text: "1 l Wasser wiegt 1 kg, 1000 l wiegen 1000 kg, 1 m3 auch.", kind: "rechnung", stufen: OBEN },
  { text: "Ein Tag: 24 Stunden, 1440 Minuten, 86400 Sekunden.", kind: "rechnung", stufen: OBEN },
];

/**
 * Alltag digital: Mail- und Web-Adressen, Zeitstempel, Speichergrößen,
 * Paragrafen. Alle Adressen sind erfundene Beispiel-Adressen (`example.org`,
 * `beispiel.de`) oder Standard-Netzadressen — keine zeigt auf eine reale
 * Person oder Firma.
 */
const DIGITAL: CorpusItem[] = [
  { text: "Melde dich unter kurs2026@example.org bis 15.09.2026 um 12:00.", kind: "satz", stufen: OBEN },
  { text: "Antwort an gruppe07@example.org bis 30.10.2026, 17:30 Uhr.", kind: "satz", stufen: OBEN },
  { text: "Schreibe an team2026@example.org bis 14.11.2026 um 09:00.", kind: "satz", stufen: OBEN },
  { text: "Die Abgabe an heft2026@beispiel.de endet am 08.12.2026.", kind: "satz", stufen: OBEN },
  { text: "Öffne beispiel.de/2026/08/21/blatt-12 und dann Seite 47.", kind: "satz", stufen: OBEN },
  { text: "Öffne beispiel.de/2026/09/17/blatt-8 und lies Punkt 45.", kind: "satz", stufen: OBEN },
  // ★ Der 03.10.2026 ist ein Samstag: ISO-Woche 40, Wochentag 6 (nachgerechnet
  // mit `date -j` und mit `datetime.isocalendar`). Hier stand bis zur
  // Chef-Abnahme „Tag 2" - das wäre der 29.09.2026 gewesen. Ein Wochentag ist
  // maschinell prüfbar und beim Lesen praktisch unsichtbar; genau darum prüft
  // ihn seit I3-N der Zahlen-Wächter (scripts/_zahlenwaechter.mts).
  { text: "beispiel.de/2026/10/03/blatt-12 gehört zu Woche 40, Tag 6.", kind: "satz", stufen: OBEN },
  { text: "Der Zeitstempel 2026-08-21 14:07:33 steht in jeder Zeile.", kind: "satz", stufen: OBEN },
  { text: "Sichere die Datei 2026-08-21-notizen.txt vor 18:00 Uhr ab.", kind: "satz", stufen: OBEN },
  { text: "Notiere: 2026-08-21, 09:45, Raum 214, Platz 17, Reihe 3.", kind: "satz", stufen: OBEN },
  { text: "Der Beleg 2026/0912 liegt in Ordner 14, Fach 3, Reihe 8.", kind: "satz", stufen: OBEN },
  { text: "Kennung AB-2026-0417, Prüfziffer 83, Fach 12, Reihe 5.", kind: "satz", stufen: OBEN },
  { text: "§ 12 Absatz 3, § 14 Absatz 2, § 16 Absatz 5, § 18 Absatz 4.", kind: "satz", stufen: OBEN },
  { text: "§ 13 Absatz 2, § 15 Absatz 4, § 17 Absatz 6, § 19 Absatz 8.", kind: "satz", stufen: OBEN },
  { text: "Übe die Zeile: Version 3.14 vom 07.03.2026, Ausgabe 3.15.", kind: "satz", stufen: OBEN },
  // Netzadressen: 127.0.0.1 und 192.168.x.x sind reservierte Standardbereiche
  // (RFC 1122 bzw. RFC 1918) und zeigen auf keinen fremden Rechner.
  { text: "Die Adresse 192.168.0.15 gehört zum Netz 192.168.0.0 dazu.", kind: "wissen", stufen: OBEN },
  { text: "127.0.0.1 heißt localhost, 255.255.255.0 ist eine Netzmaske.", kind: "wissen", stufen: OBEN },
  { text: "1024 Byte sind 1 kB, 1024 kB sind 1 MB, 1024 MB sind 1 GB.", kind: "rechnung", stufen: OBEN },
  { text: "8 Bit sind 1 Byte, 1024 Byte sind 1 kB, 1048576 Byte 1 MB.", kind: "rechnung", stufen: OBEN },
  { text: "1 TB sind 1024 GB, 1 GB sind 1024 MB, 1 MB sind 1024 kB.", kind: "rechnung", stufen: OBEN },
  { text: "Die Datei wiegt 2048 kB, also genau 2 MB oder 2097152 Byte.", kind: "rechnung", stufen: OBEN },
  { text: "87 % belegt: 435 von 500 GB, 65 GB frei, 13 % sind Rest.", kind: "rechnung", stufen: OBEN },
  { text: "350 Dateien: 120 Bilder, 180 Texte, 50 Töne, 0 Filme.", kind: "rechnung", stufen: OBEN },
];

/** Charge I3 (deutsch): alle vier Themenfelder der Welle 1 und 2. */
export const ZIFFERN_CORPUS: CorpusItem[] = [
  ...KAUFMAENNISCH,
  ...MATHEMATIK,
  ...GEOGRAFIE,
  ...BIOLOGIE,
  ...DIGITAL,
];
