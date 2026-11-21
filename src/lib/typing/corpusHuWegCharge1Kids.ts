/**
 * Korpus des Weges „hu" (Ungarisch), Charge 1 - Kinder (K-HU, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
 *
 * Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/hu.jsonl` (je Altersgruppe 30 Sätze und 10 Absätze, neu in der
 * Sprache verfasst, `quelle: "eigen"`), geprüft von einem zweiten Prüfer (`PRUEFBERICHT-hu.md`: freigabefähig).
 * Der Text ist unverändert übernommen. Zuordnung: `alter` ⇒ `stufen`, `thema` ⇒ `topic`, `weg` ⇒ `nurWeg`; die Kennung
 * der Quelle steht als Kommentar hinter jeder Zeile.
 *  · Absätze (`art: "absatz"`) sind an den Satzgrenzen in ihre Sätze geteilt (`<id>.1`, `<id>.2` …): Korpus-Zeilen sind einzelne
 *    Übungszeilen (die längste der acht Wege davor hat 130 Zeichen), mehrsätzige Geschichten sind Serien. Kein Wort geändert.
 *  · Selbst verfasst ⇒ ohne `herkunft` (wie die Chargen von it/pl/tr/cs; `herkunft` ist für ÜBERNOMMENE Texte).
 *  · `minTier` = `minTierFor(text, "hu")` nach der eigenen Lern-Folge des Weges (`lernweg.ts`, F4), Bezugstastatur `hu`.
 * Wächter: `tests/tastenflow-texte-hu-charge1.test.ts`. Nur HINTEN anhängen (Anker, `corpusHu.ts`).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_HU_WEG_CHARGE1_KIDS: CorpusItem[] = [
  { text: "Reggel Lili villamossal megy iskolába, és az ablakból nézi a Dunát.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-001
  { text: "A szünetben Bence és Zsófi közösen rajzolnak egy nagy hajót a füzetbe.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-002
  { text: "Szegeden a nagymamám kertjében egy sün lakik a bokor alatt.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "állatok" }, // hu-c1-003
  { text: "Debrecenben Máté és a tesója versenyt futnak a parkban a nagy fák között.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "játék" }, // hu-c1-004
  { text: "A kutyánk, Bodri, mindig az ajtónál vár, amikor hazaérek.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "állatok" }, // hu-c1-005
  { text: "Pécsen Hanna az osztályával a Mecsekbe kirándul, és ő viszi a térképet.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-006
  { text: "Dorka vak gyerek, és az ujjaival gyorsan olvassa a pontírásos mesekönyvet.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-007
  { text: "Sopronban Levente és a nagypapája vasárnap együtt sütnek kenyeret.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "család" }, // hu-c1-008
  { text: "Csíkszeredán Botond a barátaival szánkózik a havas domboldalon.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "játék" }, // hu-c1-009
  { text: "Ma este palacsintát sütünk, és mindenki maga tölti meg lekvárral.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "étel" }, // hu-c1-010
  { text: "Balatonfüreden délelőtt úszunk, aztán lángost eszünk a parton.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "nyár" }, // hu-c1-011
  { text: "Gergő kitalált egy új társasjátékot, és a szabályokat is ő írta le.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "játék" }, // hu-c1-012
  { text: "Szabadkán Réka magyar tagozatra jár, és az iskolai kórusban is énekel.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-013
  { text: "Áron kerekesszékkel jár, és a kosárcsapatban ő szerzi a legtöbb pontot.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "sport" }, // hu-c1-014
  { text: "Egerben a nagynénénk vár minket, és együtt megyünk fel a várba.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "család" }, // hu-c1-015
  { text: "A gólya visszajött a fészkére, és a kémény tetején kelepel.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "állatok" }, // hu-c1-016
  { text: "Komáromban Emese a parton biciklizik, és figyeli a hajókat a Dunán.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "játék" }, // hu-c1-017
  { text: "Ezen a héten én öntözöm a virágokat az osztályban, mert én vagyok a virágfelelős.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-018
  { text: "Kecskeméten a piacon barackot veszünk, és otthon lekvárt főzünk belőle.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "étel" }, // hu-c1-019
  { text: "Apa gombot varr a kabátomra, anya pedig megjavítja a biciklimet.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "család" }, // hu-c1-020
  { text: "A Városligetben Noémi korcsolyázni tanul, és már nem fogja a korlátot.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "játék" }, // hu-c1-021
  { text: "Győrben a könyvtárban Csenge maga választ ki három új könyvet.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-022
  { text: "Zoli gyengénlátó diák, és a tableten ügyesen felnagyítja a betűket.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-023
  { text: "Ősszel Villány mellett segítünk a nagyszüleinknek szüretelni a szőlőben.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "család" }, // hu-c1-024
  { text: "Nyíregyházán Ábel minden reggel megeteti a nyulát, mielőtt iskolába megy.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "állatok" }, // hu-c1-025
  { text: "Esős napokon sakkozunk, és a húgom ma először nyert ellenem.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "játék" }, // hu-c1-026
  { text: "Kolozsváron Zsombor a matekversenyre készül, és sokat gyakorol.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-027
  { text: "Miskolcon Lili hétfőn és csütörtökön úszni jár az uszodába.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "sport" }, // hu-c1-028
  { text: "A pogácsa tésztáját én gyúrom, a testvérem pedig kiszaggatja.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "étel" }, // hu-c1-029
  { text: "Zsófi kinyitotta az ajtót, és ezt kiáltotta: \"Ma én viszem a labdát!\"", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-030
  { text: "Bálint vak, és ugyanabba az osztályba jár, mint én.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-031.1
  { text: "A laptopja felolvassa neki a szöveget, ő pedig tíz ujjal gépel.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-031.2
  { text: "A szünetben együtt focizunk egy csörgős labdával.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-031.3
  { text: "Ma ő tanított meg arra, hogyan találjam meg a betűket csukott szemmel is.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-031.4
  { text: "Farsangkor Mohácson jártunk a busójáráson.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "ünnep" }, // hu-c1-032.1
  { text: "A busók faragott maszkban és bundában vonultak az utcán, és nagy zajt csaptak.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "ünnep" }, // hu-c1-032.2
  { text: "Én is kipróbáltam egy kereplőt.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "ünnep" }, // hu-c1-032.3
  { text: "Otthon papírból saját maszkot készítettem, és a húgommal felváltva viseltük.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "ünnep" }, // hu-c1-032.4
  { text: "A Hortobágyon sétáltunk a nagy pusztán.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "állatok" }, // hu-c1-033.1
  { text: "Láttunk gólyát, sok birkát és egy régi gémeskutat.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "állatok" }, // hu-c1-033.2
  { text: "A túravezető megmutatta, hogyan működik a kút.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "állatok" }, // hu-c1-033.3
  { text: "Én húztam fel a vödröt, és nagyon nehéz volt, de végül sikerült.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "állatok" }, // hu-c1-033.4
  { text: "Székelyudvarhelyen lakik a mamám.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "étel" }, // hu-c1-034.1
  { text: "Amikor nála vagyunk, együtt sütünk fánkot.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "étel" }, // hu-c1-034.2
  { text: "Én szaggatom ki a tésztát, a tesóm pedig figyeli, hogy meg ne égjen.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "étel" }, // hu-c1-034.3
  { text: "A végén porcukrot szórunk rá, és melegen esszük meg baracklekvárral.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "étel" }, // hu-c1-034.4
  { text: "Pénteken az osztállyal hajóztunk a Dunán.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-035.1
  { text: "Láttuk a hidakat és a Parlamentet is.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-035.2
  { text: "Kata megszámolta, hány híd alatt haladtunk el, Ádám pedig lerajzolta a legszebbet.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-035.3
  { text: "Este mindenki elmesélte otthon, mit látott a fedélzetről.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-035.4
  { text: "A szomszédunk, Eszter néni, vak, és van egy vakvezető kutyája, Mázli.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "állatok" }, // hu-c1-036.1
  { text: "Amikor Mázli dolgozik, nem szabad megsimogatni.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "állatok" }, // hu-c1-036.2
  { text: "Ezt Eszter néni magyarázta el nekem.", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "hu", topic: "állatok" }, // hu-c1-036.3
  { text: "Délután viszont játszhatok vele a kertben, és ilyenkor vidáman ugrál körülöttem.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "állatok" }, // hu-c1-036.4
  { text: "Zentán a Tisza partján van a kedvenc helyünk.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "sport" }, // hu-c1-037.1
  { text: "Nyáron ott tanultam meg kajakozni.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "sport" }, // hu-c1-037.2
  { text: "Az első napon kétszer is a vízbe estem, de az edző csak nevetett, és segített visszaülni.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "sport" }, // hu-c1-037.3
  { text: "Most már egyedül is evezek a part mentén.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "sport" }, // hu-c1-037.4
  { text: "Kőszegen három napot töltöttünk az erdei iskolában.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-038.1
  { text: "Éjjel csillagokat néztünk, nappal madárhangokat tanultunk.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-038.2
  { text: "Én ismertem fel elsőként a harkályt.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-038.3
  { text: "Hazafelé a buszon szinte mindenki aludt, csak a tanító mesélt halkan.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-038.4
  { text: "Az új osztálytársunk, Petra, siket.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-039.1
  { text: "Jelnyelven beszél, és az órákon egy jeltolmács is segít neki.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-039.2
  { text: "Tőle tanultuk meg, hogyan kell jelelni azt, hogy szia, köszönöm és szünet.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-039.3
  { text: "Most már a folyosón is tudunk beszélgetni.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-039.4
  { text: "Hollókőn jártunk a családdal.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "kirándulás" }, // hu-c1-040.1
  { text: "A kis faluban régi parasztházak állnak, a domb tetején pedig egy vár.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "kirándulás" }, // hu-c1-040.2
  { text: "Felmásztam a várig, és fentről láttam az egész völgyet.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "hu", topic: "kirándulás" }, // hu-c1-040.3
  { text: "Lent egy kézműves boltban egy kis ajándékot vettem anyának.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "hu", topic: "kirándulás" }, // hu-c1-040.4
];
