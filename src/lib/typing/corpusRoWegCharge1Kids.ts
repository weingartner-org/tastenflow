/**
 * Korpus des Weges „ro" (Rumänisch), Charge 1 - Kinder (K-RO, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_RO_WEG_CHARGE1_KIDS: CorpusItem[] = [
  { text: "Azi la școală am învățat să scriem cuvinte cu ă, î, â, ș și ț.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-001
  { text: "În pauză, colegii mei din București joacă șotron în curtea școlii.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-002
  { text: "Fac plăcinte cu brânză împreună cu bunica, la Orhei, în fiecare duminică.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "familie" }, // ro-c1-003
  { text: "La Cluj, sora mea are grijă singură de pisica noastră albă.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "animale" }, // ro-c1-004
  { text: "Vara mergem la mare, la Constanța, și construim castele de nisip.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "natură" }, // ro-c1-005
  { text: "Colega mea din Craiova citește în Braille și îmi arată literele.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-006
  { text: "La Timișoara, după ore, ne jucăm cu mingea în parcul de lângă școală.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-007
  { text: "În Maramureș cade multă zăpadă, iar noi facem un iglu în fața casei.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "anotimpuri" }, // ro-c1-008
  { text: "Iarna, la Suceava, ne dăm cu sania pe dealul din spatele blocului.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "anotimpuri" }, // ro-c1-009
  { text: "La Iași, fac singură papanași, iar tata mă ajută doar la tigaie.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "mâncare" }, // ro-c1-010
  { text: "La Chișinău, școala a început pe 1 septembrie, iar eu am un ghiozdan nou.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "ro", topic: "școală" }, // ro-c1-011
  { text: "Câinele nostru știe să aducă mingea și să stea cuminte la ușă.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "animale" }, // ro-c1-012
  { text: "În rezervația Codrii am auzit o ciocănitoare care bătea în trunchiul unui stejar.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "natură" }, // ro-c1-013
  { text: "Când plouă la Lugoj, jucăm șah sau construim un oraș din piese colorate.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-014
  { text: "La Ploiești, bunicul și cu mine mâncăm covrigi calzi dimineața.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "mâncare" }, // ro-c1-015
  { text: "Prietenul meu din Brașov folosește un scaun rulant și joacă baschet.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "sport" }, // ro-c1-016
  { text: "În Delta Dunării am mers cu barca și am văzut nuferi albi pe apă.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "natură" }, // ro-c1-017
  { text: "La Timișoara, bunica îmi spune povești în germană și în română.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "familie" }, // ro-c1-018
  { text: "La Târgu Jiu, vecinii mei și cu mine am făcut o echipă de fotbal.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-019
  { text: "La Baia Mare, merg singur la bibliotecă și împrumut cărți cu povești.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-020
  { text: "Pe Rarău am văzut o veveriță roșcată care ascundea alune.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "animale" }, // ro-c1-021
  { text: "La Bacău, învățătoarea ne citește în fiecare vineri o poveste nouă.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-022
  { text: "În parcul din Vaslui, merg singur cu bicicleta până la locul de joacă.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-023
  { text: "Fratele meu are un aparat auditiv și cântă la tobe în formația școlii.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "muzică" }, // ro-c1-024
  { text: "Îmi fac singur ghiozdanul seara, ca să nu uit caietul de matematică.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-025
  { text: "La Soroca, mătușa mea gătește zeamă, iar eu tai mărunt leușteanul.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "mâncare" }, // ro-c1-026
  { text: "La Pitești avem un acvariu cu șase pești portocalii și o scoică.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "animale" }, // ro-c1-027
  { text: "În Munții Apuseni am vizitat cu familia o peșteră rece și întunecoasă.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "natură" }, // ro-c1-028
  { text: "La Ungheni, de 1 martie, îi dau doamnei învățătoare un mărțișor alb cu roșu.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "ro", topic: "sărbători" }, // ro-c1-029
  { text: "Toamna, la Vișeu de Sus, adunăm frunze galbene și facem din ele o coroană.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "anotimpuri" }, // ro-c1-030
  { text: "La 1 martie, în Republica Moldova și în România, copiii dăruiesc mărțișoare.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "ro", topic: "sărbători" }, // ro-c1-031.1
  { text: "Un mărțișor are un șnur alb și roșu.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "sărbători" }, // ro-c1-031.2
  { text: "Din 2017, acest obicei se află pe lista UNESCO.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "ro", topic: "sărbători" }, // ro-c1-031.3
  { text: "Anul acesta am făcut singură douăzeci și cinci de mărțișoare pentru toată clasa.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "sărbători" }, // ro-c1-031.4
  { text: "Vara trecută am fost în Delta Dunării, lângă Tulcea.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "natură" }, // ro-c1-032.1
  { text: "Am stat cu toții în barca ghidului și am privit apa liniștită.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "natură" }, // ro-c1-032.2
  { text: "Ghidul ne cerea să vorbim încet.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "natură" }, // ro-c1-032.3
  { text: "Am văzut pești care săreau din apă și o vidră care înota repede.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "natură" }, // ro-c1-032.4
  { text: "Seara am desenat totul în caiet.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "natură" }, // ro-c1-032.5
  { text: "În clasa noastră din Sibiu învață și o fată cu deficiențe de vedere.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-033.1
  { text: "Ea scrie pe laptop cu toate cele zece degete și ascultă cu un cititor de ecran ce a scris.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-033.2
  { text: "La ora de română, ea termină prima dictarea.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-033.3
  { text: "Tot ea îmi arată mereu unde sunt tastele noi.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-033.4
  { text: "Duminică am gătit cu tata, la Craiova.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "mâncare" }, // ro-c1-034.1
  { text: "Eu am spălat orezul și am tocat ceapa.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "mâncare" }, // ro-c1-034.2
  { text: "Tata a pregătit foile de varză.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "mâncare" }, // ro-c1-034.3
  { text: "Împreună am făcut sarmale pentru toată familia.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "mâncare" }, // ro-c1-034.4
  { text: "Au ieșit cam patruzeci de bucăți, iar bunica a cerut încă o porție.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "mâncare" }, // ro-c1-034.5
  { text: "În vacanța de iarnă am fost la bunici, în Maramureș.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "familie" }, // ro-c1-035.1
  { text: "Satul lor are case de lemn și porți mari, sculptate.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "familie" }, // ro-c1-035.2
  { text: "În fiecare dimineață îmi puneam căciula și ieșeam la săniuș cu verii mei.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "familie" }, // ro-c1-035.3
  { text: "Seara mâncam mămăligă cu brânză lângă sobă.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "familie" }, // ro-c1-035.4
  { text: "La Timișoara, în fiecare sâmbătă, mă întâlnesc cu prietenii pe terenul de fotbal.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-036.1
  { text: "Unul dintre noi vorbește maghiara acasă, altul sârba, iar toți vorbim româna când jucăm.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-036.2
  { text: "Facem echipe amestecate și schimbăm portarul după fiecare gol.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-036.3
  { text: "Locuiesc la Chișinău, în blocul cu nouă etaje de lângă parc.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "familie" }, // ro-c1-037.1
  { text: "Fratele meu mai mic și cu mine udăm în fiecare seară florile de pe balcon.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "familie" }, // ro-c1-037.2
  { text: "Mama lucrează până târziu, așa că pregătim singuri cina: ceai, pâine prăjită și ouă ochiuri.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "familie" }, // ro-c1-037.3
  { text: "Școala mea din Gura Humorului are o grădină.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-038.1
  { text: "Fiecare clasă are un strat al ei.", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "ro", topic: "școală" }, // ro-c1-038.2
  { text: "Noi am plantat roșii, morcovi și gălbenele.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-038.3
  { text: "Ca grădina să fie udată și în vacanță, am scris singuri un orar și îl ținem lipit pe ușa clasei.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "școală" }, // ro-c1-038.4
  { text: "Vărul meu din Piatra Neamț folosește un scaun rulant.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-039.1
  { text: "Vara mergem împreună pe malul lacului și ne întrecem: eu pe role, el cu scaunul.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-039.2
  { text: "De obicei câștigă el, pentru că are brațe foarte puternice.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-039.3
  { text: "Apoi ne împărțim o înghețată la umbră.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "joacă" }, // ro-c1-039.4
  { text: "Clasa noastră din București are un proiect despre animale.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "animale" }, // ro-c1-040.1
  { text: "Eu am ales aricii.", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "ro", topic: "animale" }, // ro-c1-040.2
  { text: "Am căutat informații la bibliotecă și am făcut un afiș cu desene.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "animale" }, // ro-c1-040.3
  { text: "Apoi am prezentat afișul colegilor, iar ei au pus atât de multe întrebări încât am continuat și în pauză.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "ro", topic: "animale" }, // ro-c1-040.4
];
