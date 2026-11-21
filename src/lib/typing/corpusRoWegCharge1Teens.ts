/**
 * Korpus des Weges „ro" (Rumänisch), Charge 1 - Jugendliche (K-RO, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
 *
 * Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/ro.jsonl` (je Altersgruppe 30 Sätze und 10 Absätze, neu in der
 * Sprache verfasst, `quelle: "eigen"`), geprüft von einem zweiten Prüfer (`PRUEFBERICHT-ro.md`: freigabefähig).
 * Der Text ist unverändert übernommen. Zuordnung: `alter` ⇒ `stufen`, `thema` ⇒ `topic`, `weg` ⇒ `nurWeg`; die Kennung
 * der Quelle steht als Kommentar hinter jeder Zeile.
 *  · Absätze (`art: "absatz"`) sind an den Satzgrenzen in ihre Sätze geteilt (`<id>.1`, `<id>.2` …): Korpus-Zeilen sind einzelne
 *    Übungszeilen (die längste der acht Wege davor hat 130 Zeichen), mehrsätzige Geschichten sind Serien. Kein Wort geändert.
 *  · Selbst verfasst ⇒ ohne `herkunft` (wie die Chargen von it/pl/tr/cs; `herkunft` ist für ÜBERNOMMENE Texte).
 *  · `minTier` = `minTierFor(text, "ro")` nach der eigenen Lern-Folge des Weges (`lernweg.ts`, F4), Bezugstastatur `ro`.
 * Wächter: `tests/tastenflow-texte-ro-charge1.test.ts`. Nur HINTEN anhängen (Anker, `corpusRo.ts`).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_RO_WEG_CHARGE1_TEENS: CorpusItem[] = [
  { text: "Ion Basoc din Republica Moldova a câștigat argintul la judo, la Jocurile Paralimpice din 2024.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "ro", topic: "sport" }, // ro-c1-041
  { text: "La Cluj, formația noastră repetă în fiecare joi în garajul unui vecin.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "muzică" }, // ro-c1-042
  { text: "Am învățat să programez un mic joc în care un robot adună stele.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "tehnică" }, // ro-c1-043
  { text: "Sâmbătă am strâns gunoaiele de pe plaja din Mamaia, împreună cu alți voluntari.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "mediu" }, // ro-c1-044
  { text: "Cel mai bun prieten al meu locuiește acum departe de Craiova, dar vorbim zilnic prin apel video.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "prietenie" }, // ro-c1-045
  { text: "Din trenul de la Timișoara spre Reșița am văzut dealuri și păduri întinse.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-046
  { text: "Pe traseele din Munții Rodnei facem ture lungi cu bicicleta de munte.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "sport" }, // ro-c1-047
  { text: "Am vizitat Mănăstirea Voroneț și am privit mult timp picturile vechi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-048
  { text: "La Iași, liceul nostru are un club de dezbateri care se întâlnește marțea.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-049
  { text: "Sora mea din Bălți repară singură telefoane și vrea să studieze electronica.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "tehnică" }, // ro-c1-050
  { text: "Un cititor de ecran citește cu voce tare tot ce apare pe monitor.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "tehnică" }, // ro-c1-051
  { text: "La București am fost la primul meu concert în aer liber, cu prietenii.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "muzică" }, // ro-c1-052
  { text: "Echipa de handbal a liceului din Brașov se antrenează și în vacanțe.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "sport" }, // ro-c1-053
  { text: "La Orheiul Vechi am urcat pe stânci și am privit de sus valea Răutului.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "natură" }, // ro-c1-054
  { text: "Colega mea din Constanța vorbește acasă tătara și îmi spune în fiecare zi cuvinte noi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "prietenie" }, // ro-c1-055
  { text: "Încă nu știu ce meserie îmi aleg, dar îmi place să lucrez cu oamenii.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "meserii" }, // ro-c1-056
  { text: "Oleg Crețul a câștigat bronzul la judo, la Jocurile Paralimpice de la Paris.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "sport" }, // ro-c1-057
  { text: "Am mers cu vaporul pe Dunăre, la Porțile de Fier, și am fotografiat stâncile.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-058
  { text: "La Timișoara, clubul de robotică a construit un braț care sortează piese.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "tehnică" }, // ro-c1-059
  { text: "La Sighetu Marmației am învățat de la un meșter cum se sculptează lemnul.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-060
  { text: "Iarna, la Vatra Dornei, ne antrenăm la schi fond după ore.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "sport" }, // ro-c1-061
  { text: "Fratele meu din Bacău cântă la chitară și înregistrează piese în camera lui.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "muzică" }, // ro-c1-062
  { text: "În clasa noastră folosim doar sticle de apă reutilizabile, pe care le spălăm acasă.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "mediu" }, // ro-c1-063
  { text: "Am o prietenă din Cahul cu care schimb scrisori, pentru că ne vedem rar.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "prietenie" }, // ro-c1-064
  { text: "Prietenul meu comunică în limba semnelor, iar acum toată clasa știe câteva semne.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "prietenie" }, // ro-c1-065
  { text: "Am urcat cu telecabina în Bucegi și am văzut norii de deasupra văii.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-066
  { text: "La Sighișoara am mers pe străduțe vechi și am urcat în Turnul cu Ceas.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-067
  { text: "Îmi salvez temele în două locuri, ca să nu le pierd dacă se strică laptopul.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "tehnică" }, // ro-c1-068
  { text: "La Chișinău, corul școlii noastre a cântat la un concert de caritate.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "muzică" }, // ro-c1-069
  { text: "În Constanța am învățat să vâslesc la un club de caiac de lângă port.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "sport" }, // ro-c1-070
  { text: "Alex Bologa a câștigat medalia de aur la judo, la Jocurile Paralimpice de la Paris, în 2024.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "ro", topic: "sport" }, // ro-c1-071.1
  { text: "El concurează în categoria sportivilor cu deficiențe de vedere.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "sport" }, // ro-c1-071.2
  { text: "La sală, antrenorul nostru a pus finala pe ecran și a explicat fiecare mișcare.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "ro", topic: "sport" }, // ro-c1-071.3
  { text: "A doua zi, jumătate din clasă voia să facă judo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "sport" }, // ro-c1-071.4
  { text: "Camelia Ciripan a câștigat bronzul la tenis de masă, la Jocurile Paralimpice de la Paris, în 2024.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "ro", topic: "sport" }, // ro-c1-072.1
  { text: "La școala noastră avem și noi o masă de tenis și jucăm în fiecare pauză lungă.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "sport" }, // ro-c1-072.2
  { text: "Unii colegi joacă din scaunul rulant, alții în picioare, și toată lumea ține scorul cu atenție.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "sport" }, // ro-c1-072.3
  { text: "În Republica Moldova, clasa noastră a plantat copaci lângă un sat de pe malul Prutului.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "mediu" }, // ro-c1-073.1
  { text: "Am săpat gropi, am cărat apă și am pus câte un țăruș lângă fiecare copac tânăr.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "mediu" }, // ro-c1-073.2
  { text: "Peste câțiva ani, aici va crește o pădure mică.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "mediu" }, // ro-c1-073.3
  { text: "Am hotărât să revenim în fiecare primăvară.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "mediu" }, // ro-c1-073.4
  { text: "La București am participat la un concurs de aplicații.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "tehnică" }, // ro-c1-074.1
  { text: "Echipa noastră a făcut o aplicație care citește cu voce tare orarul autobuzelor.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "tehnică" }, // ro-c1-074.2
  { text: "Am testat aplicația împreună cu o colegă care folosește zilnic un cititor de ecran, iar ea ne dădea sfaturi foarte bune.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "tehnică" }, // ro-c1-074.3
  { text: "Nu am câștigat, dar aplicația funcționează.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "tehnică" }, // ro-c1-074.4
  { text: "Am petrecut vacanța de vară cu prietenii la Tulcea.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-075.1
  { text: "De acolo am luat vaporul spre Delta Dunării.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-075.2
  { text: "Am dormit la o pensiune, am mâncat ciorbă de pește și am vâslit dimineața devreme, când apa era ca o oglindă.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-075.3
  { text: "Telefonul a stat mai mult în rucsac.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-075.4
  { text: "La Horezu am vizitat un atelier de ceramică.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-076.1
  { text: "Meșterul ne lăsa pe rând să lucrăm la roata olarului.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-076.2
  { text: "Prima mea farfurie a ieșit strâmbă, a doua, ceva mai reușită.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-076.3
  { text: "Am pictat farfuria cu maro și verde, iar acum stă acasă pe raft, ca amintire.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-076.4
  { text: "Prietena mea din Lugoj vorbește acasă limba romani, iar eu vorbesc româna.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "prietenie" }, // ro-c1-077.1
  { text: "Ea mă învață cuvinte noi, iar eu o învăț să joace șah.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "prietenie" }, // ro-c1-077.2
  { text: "Vara aceasta vrem să mergem împreună cu bicicletele până în satul bunicilor ei.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "prietenie" }, // ro-c1-077.3
  { text: "La Baia Mare, liceul nostru are o trupă de rock.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "muzică" }, // ro-c1-078.1
  { text: "Eu cânt la tobe, iar sora mea la chitară bas.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "muzică" }, // ro-c1-078.2
  { text: "Repetăm în sala de festivități, după ore.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "muzică" }, // ro-c1-078.3
  { text: "Luna viitoare avem primul concert, chiar în fața liceului, iar afișele sunt desenate de noi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "muzică" }, // ro-c1-078.4
  { text: "Cu clasa am făcut o drumeție pe Rarău.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-079.1
  { text: "Am pornit la șapte dimineața, cu rucsacurile pline de sandvișuri.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-079.2
  { text: "Pe drum am învățat să citim harta și să ne orientăm fără telefon.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-079.3
  { text: "Sus, ceața a dispărut și am văzut munții până departe.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "călătorii" }, // ro-c1-079.4
  { text: "La Galați am făcut o zi de practică la spitalul din oraș.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "meserii" }, // ro-c1-080.1
  { text: "Am stat lângă o asistentă și am văzut câte lucruri face în timpul unei singure ture.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "meserii" }, // ro-c1-080.2
  { text: "Acum mă gândesc serios să devin asistent medical.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "meserii" }, // ro-c1-080.3
  { text: "Părinții mei îmi spun că pot alege singur ce vreau să fac.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "ro", topic: "meserii" }, // ro-c1-080.4
];
