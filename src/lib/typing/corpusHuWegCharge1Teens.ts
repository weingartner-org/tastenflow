/**
 * Korpus des Weges „hu" (Ungarisch), Charge 1 - Jugendliche (K-HU, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_HU_WEG_CHARGE1_TEENS: CorpusItem[] = [
  { text: "Konkoly Zsófia Párizsban két aranyérmet nyert úszásban a paralimpián.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "paralimpia" }, // hu-c1-041
  { text: "Szabó Nikolett vak cselgáncsozó, aki kétszer is világbajnok lett.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "paralimpia" }, // hu-c1-042
  { text: "Kiss Péter Pál parakenuban nyert aranyérmet a párizsi paralimpián.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "paralimpia" }, // hu-c1-043
  { text: "Bence a szobájában rapszöveget ír, a barátja pedig zenei alapot készít hozzá.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "zene" }, // hu-c1-044
  { text: "Marosvásárhelyen Anna hetente táncházba jár, és már a csárdást is tudja.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "zene" }, // hu-c1-045
  { text: "Levi programozni tanul, és írt egy kis játékot, amelyet billentyűzettel lehet irányítani.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "technika" }, // hu-c1-046
  { text: "Szegeden a diákok egy szombat délelőtt szemetet szedtek a Tisza partján.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "környezet" }, // hu-c1-047
  { text: "Ha vitatkozunk, Dóri megvárja, hogy lehiggadjak, és csak utána beszélünk.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "barátság" }, // hu-c1-048
  { text: "Vonattal mentünk Tatára, és a tó körül biciklivel tettünk egy nagy kört.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "utazás" }, // hu-c1-049
  { text: "A felvételi előtt Kristóf minden nap egy órát gyakorolt a matekfeladatokkal.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-050
  { text: "Dunaszerdahelyen Márk a focicsapat védője, és egyetlen edzést sem hagy ki.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "sport" }, // hu-c1-051
  { text: "Nóra látássérült, és a telefonján képernyőolvasóval chatel a barátaival.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "technika" }, // hu-c1-052
  { text: "A Fertő partján madarakat számoltunk, és mindent a telefonba jegyeztünk.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "környezet" }, // hu-c1-053
  { text: "Gitározni tanulok, és a nyári szünetben a barátaimmal zenekart alapítunk.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "zene" }, // hu-c1-054
  { text: "A Bükkben háromnapos túrán voltunk, és sátorban aludtunk az erdő szélén.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "utazás" }, // hu-c1-055
  { text: "Szabadkán a gimnazisták magyarul és szerbül is írnak cikket az iskolaújságba.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-056
  { text: "A szelektív gyűjtést mi szerveztük meg a suliban, és a büfé is csatlakozott.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "környezet" }, // hu-c1-057
  { text: "A metrónál Gergő segített egy idős néninek felvinni a bőröndöt a lépcsőn.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "utazás" }, // hu-c1-058
  { text: "Pécsen a zeneiskola udvarán koncertet adtunk, és a szüleink is eljöttek.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "zene" }, // hu-c1-059
  { text: "Pap Bianka a párizsi paralimpián hátúszásban nyert aranyérmet.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "paralimpia" }, // hu-c1-060
  { text: "Tomi kerekesszékkel közlekedik, és ő nyerte meg az évfolyam pingpongbajnokságát.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "sport" }, // hu-c1-061
  { text: "Tiszafüreden kenuval eveztünk a tavon a nádasok között, és egy gémet is láttunk.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "természet" }, // hu-c1-062
  { text: "A robotunk elsőre nekiment a falnak, de a harmadik próbára már kikerülte.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "technika" }, // hu-c1-063
  { text: "Kolozsvári barátnőmmel minden este hangüzenetben meséljük el a napunkat.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "barátság" }, // hu-c1-064
  { text: "Vízilabdaedzés után olyan éhes vagyok, hogy két tányér levest is megeszem.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "sport" }, // hu-c1-065
  { text: "Veszprémben önkéntes voltam egy fesztiválon, és én osztottam a karszalagokat.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "zene" }, // hu-c1-066
  { text: "Lillának diszlexiája van, ezért a hosszú szövegeket meghallgatja, aztán jegyzetel.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-067
  { text: "Békéscsabán a nyári táborban fafaragást tanultunk, és én egy kanalat készítettem.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "szabadidő" }, // hu-c1-068
  { text: "A nővérem most érettségizik, ezért halkan gyakorlok a gitáron, amíg ő tanul.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-069
  { text: "Komáromban átsétáltunk a Duna fölötti hídon, és fagyit ettünk a túlsó parton.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "utazás" }, // hu-c1-070
  { text: "Pálos Péter asztaliteniszező, és értelmi fogyatékossággal élő sportolók között versenyez.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "paralimpia" }, // hu-c1-071.1
  { text: "A londoni és a tokiói paralimpián is aranyérmet nyert.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "paralimpia" }, // hu-c1-071.2
  { text: "Az edzőnk szerint az asztaliteniszben a sok ismétlés a legfontosabb.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "paralimpia" }, // hu-c1-071.3
  { text: "Ma délután mi is kipróbáljuk a fonák ütést.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "paralimpia" }, // hu-c1-071.4
  { text: "Sepsiszentgyörgyön a gimnáziumban projektnap volt.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-072.1
  { text: "A mi csoportunk podcastot készített a város kerékpárútjairól.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "iskola" }, // hu-c1-072.2
  { text: "Én kérdeztem meg a polgármesteri hivatal egyik munkatársát, a többiek vágták és szerkesztették a hangot.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-072.3
  { text: "Jövő héten az iskolarádió is leadja.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "iskola" }, // hu-c1-072.4
  { text: "Szombaton vonattal indultunk a Keletiből Miskolcra.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "utazás" }, // hu-c1-073.1
  { text: "A jegyet a telefonon vettük meg, és ablak melletti helyet foglaltunk.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "utazás" }, // hu-c1-073.2
  { text: "Útközben kártyáztunk, zenét hallgattunk, és megbeszéltük, hova megyünk először.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "utazás" }, // hu-c1-073.3
  { text: "A barlangfürdő nyert.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "utazás" }, // hu-c1-073.4
  { text: "Az osztályunk egy hónapig mérte, mennyi ételt dobunk ki a menzán.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "környezet" }, // hu-c1-074.1
  { text: "Az eredményt grafikonon mutattuk be az igazgatónak.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "környezet" }, // hu-c1-074.2
  { text: "Azóta kisebb adagot is lehet kérni, és aki még éhes, mehet repetáért.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "környezet" }, // hu-c1-074.3
  { text: "Már most kevesebb étel kerül a kukába.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "környezet" }, // hu-c1-074.4
  { text: "Magyarkanizsán a nagybátyám citerázik, és nyáron megtanított néhány dallamra.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "zene" }, // hu-c1-075.1
  { text: "Eleinte fájt az ujjam a húroktól, de nem adtam fel.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "zene" }, // hu-c1-075.2
  { text: "Most a barátaimmal kipróbáljuk, hogyan szól a citera elektronikus alappal.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "zene" }, // hu-c1-075.3
  { text: "Furcsa, de nagyon jól hangzik.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "zene" }, // hu-c1-075.4
  { text: "Hanna gyengénlátó, és a tableten mindig nagyított betűvel olvas.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "technika" }, // hu-c1-076.1
  { text: "A fizikadolgozatot is így írta meg, ugyanannyi idő alatt, mint mi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "technika" }, // hu-c1-076.2
  { text: "Ha új alkalmazást tölt le, először kipróbálja benne a nagyítást.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "technika" }, // hu-c1-076.3
  { text: "Ha nem működik, ír a fejlesztőknek, és már többször válaszoltak is neki.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "technika" }, // hu-c1-076.4
  { text: "Siófokon nyári diákmunkát vállaltam a strandon egy kölcsönzőben.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "munka" }, // hu-c1-077.1
  { text: "Én adtam ki a deszkákat és a mentőmellényeket.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "munka" }, // hu-c1-077.2
  { text: "Mindenkinek elmondtam, hogy viharjelzésnél azonnal ki kell jönni a partra.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "munka" }, // hu-c1-077.3
  { text: "A fizetésem egy részét félreteszem egy új biciklire.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "munka" }, // hu-c1-077.4
  { text: "Rimaszombatban lakik a legjobb barátom, Dávid.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "barátság" }, // hu-c1-078.1
  { text: "Évente csak kétszer találkozunk, de minden héten beszélünk.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "barátság" }, // hu-c1-078.2
  { text: "Legutóbb közösen terveztük meg a nyári biciklitúrát Gömörben.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "barátság" }, // hu-c1-078.3
  { text: "A térképet ő rajzolta, én pedig kiszámoltam, hány kilométert kell naponta tekerni.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "barátság" }, // hu-c1-078.4
  { text: "Debrecenben nyílt napon voltunk egy technikumban.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "pályaválasztás" }, // hu-c1-079.1
  { text: "Megnéztük a robotkarokat, és kipróbáltuk a 3D nyomtatót is.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "hu", topic: "pályaválasztás" }, // hu-c1-079.2
  { text: "Zsófi azt mondta, ő biztosan villamosmérnök lesz.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "pályaválasztás" }, // hu-c1-079.3
  { text: "Én még nem tudom, mi szeretnék lenni, de a programozás nagyon tetszett.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "pályaválasztás" }, // hu-c1-079.4
  { text: "Esztergomban a kajakos csapattal a Dunán edzünk.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "sport" }, // hu-c1-080.1
  { text: "Reggel hatkor kezdünk, amikor még ködös a víz.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "sport" }, // hu-c1-080.2
  { text: "Az edzőnk szerint a technika fontosabb, mint az erő.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "hu", topic: "sport" }, // hu-c1-080.3
  { text: "Ezért először lassan evezünk, és csak a végén gyorsítunk.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "hu", topic: "sport" }, // hu-c1-080.4
];
