/**
 * Korpus des Weges „hu" (Ungarisch), Charge 1 - Erwachsene (K-HU, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_HU_WEG_CHARGE1_ERWACHSENE: CorpusItem[] = [
  { text: "A kormányablakban gyorsan elintéztem a lakcímváltozást, mert előre foglaltam időpontot.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "ügyintézés" }, // hu-c1-081
  { text: "A megbeszélést áttettük csütörtökre, mert a kollégám gyereke beteg lett.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "munka" }, // hu-c1-082
  { text: "Szegeden albérletet keresek, lehetőleg a belvároshoz és a villamoshoz közel.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "lakás" }, // hu-c1-083
  { text: "A háziorvos azt tanácsolta, hogy naponta fél órát sétáljak a friss levegőn.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "egészség" }, // hu-c1-084
  { text: "Zalaegerszegen egy szoftvercégnél dolgozom, és hetente kétszer otthonról is dolgozhatok.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "munka" }, // hu-c1-085
  { text: "A kollégám, Ildikó, vak, és képernyőolvasóval ő ellenőrzi a cég honlapját.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "munka" }, // hu-c1-086
  { text: "Nagyváradon este színházba megyünk, előtte egy kis étteremben vacsorázunk.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "kultúra" }, // hu-c1-087
  { text: "Elindítottam a mosógépet, a bevásárlólistát pedig felírtam a hűtő ajtajára.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-088
  { text: "Tokajban egy családi pincészetben dolgozom, ősszel reggeltől estig szüretelünk.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "munka" }, // hu-c1-089
  { text: "A Múzeumok Éjszakáján éjfélig sétáltunk egyik kiállításról a másikra.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "kultúra" }, // hu-c1-090
  { text: "A gyógyszertárban kiváltottam a receptet, és megkérdeztem, mikor kell bevenni.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "egészség" }, // hu-c1-091
  { text: "Komáromban a hajógyár közelében lakunk, a párom ott dolgozik mérnökként.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "lakás" }, // hu-c1-092
  { text: "Az adóbevallást idén is az interneten fogadtam el, csak egy adatot kellett javítanom.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "ügyintézés" }, // hu-c1-093
  { text: "Pécsen egy régi gyárépületben voltunk koncerten, utána még sokáig beszélgettünk.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "kultúra" }, // hu-c1-094
  { text: "Édesapám kerekesszéket használ, ezért olyan lakást kerestünk, ahol van lift.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "lakás" }, // hu-c1-095
  { text: "Székesfehérváron egy gyárban dolgozom műszakban, ezért néha kedden van szabadnapom.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "munka" }, // hu-c1-096
  { text: "Nyíregyházán felújítottuk a fürdőszobát, és a csempét mi magunk raktuk le.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "lakás" }, // hu-c1-097
  { text: "Reggel a buszon olvasok, este pedig a kutyával sétálok egy nagyot a parkban.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-098
  { text: "Újvidéken dolgozom, de hétvégén hazajárok Topolyára a szüleimhez.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "munka" }, // hu-c1-099
  { text: "A fogorvosnál fél órát vártam, de legalább nem fájt a kezelés.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "egészség" }, // hu-c1-100
  { text: "A vásárcsarnokban paprikát, paradicsomot és friss kenyeret vettem a hétvégére.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-101
  { text: "A színházunkban havonta van audionarrációs előadás, ezeket a vak barátommal együtt nézzük.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "kultúra" }, // hu-c1-102
  { text: "Kecskeméten a hivatalban egy jeltolmács segített a siket ügyfélnek.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "ügyintézés" }, // hu-c1-103
  { text: "A projektet határidő előtt leadtuk, ezért a csapat pizzát rendelt ebédre.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "munka" }, // hu-c1-104
  { text: "Csíkszeredán télen nagyon hideg van, ezért reggel jégkaparóval kezdem a napot.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-105
  { text: "Az influenza elleni oltásra a háziorvosnál jelentkeztem, jövő héten kapom meg.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "egészség" }, // hu-c1-106
  { text: "Sopronban hétvégén a belvárosban sétálunk, és megnézzük a régi házakat.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-107
  { text: "A lakóközösség megszavazta, hogy a ház tetejére napkollektorokat szerelnek fel.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "lakás" }, // hu-c1-108
  { text: "Miskolcon a kollégám, Tamás, látássérült, és ő vezeti a vevőszolgálatot.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "munka" }, // hu-c1-109
  { text: "Az üzenetet elküldés előtt még egyszer átolvastam, és kijavítottam két elírást.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-110
  { text: "Szent István napján este a barátaimmal a Duna partján vártuk a tűzijátékot.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "ünnep" }, // hu-c1-111.1
  { text: "Budapesten 1927 óta hagyomány a tűzijáték ezen az ünnepen.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "hu", topic: "ünnep" }, // hu-c1-111.2
  { text: "Délután megkóstoltuk az új kenyeret is, mert ez az új kenyér ünnepe is.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "ünnep" }, // hu-c1-111.3
  { text: "Hazafelé a villamos tele volt, de senki sem sietett.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "ünnep" }, // hu-c1-111.4
  { text: "Gyulán dolgozom egy könyvelőirodában.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "munka" }, // hu-c1-112.1
  { text: "A kolléganőm, Erika, gyengénlátó, ezért nagy monitoron, erős nagyítással dolgozik.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "munka" }, // hu-c1-112.2
  { text: "A táblázatokban ő veszi észre a legtöbb hibát, mert sosem siet el egy sort sem.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "munka" }, // hu-c1-112.3
  { text: "Most ő tanítja be az új munkatársat.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "munka" }, // hu-c1-112.4
  { text: "Lejárt a személyi igazolványom, ezért időpontot foglaltam a kormányablakba.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "ügyintézés" }, // hu-c1-113.1
  { text: "Az ügyintéző kedves volt, lefényképezett, és tíz perc alatt végeztünk.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "ügyintézés" }, // hu-c1-113.2
  { text: "Addig egy ideiglenes igazolást kaptam.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "ügyintézés" }, // hu-c1-113.3
  { text: "Az új kártyáról értesítést kapok, amikor elkészül.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "ügyintézés" }, // hu-c1-113.4
  { text: "Kézdivásárhelyre költöztünk vissza, mert a munkámat innen is el tudom végezni.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "lakás" }, // hu-c1-114.1
  { text: "A lakás nagyobb, a kert mögött kezdődik az erdő.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "lakás" }, // hu-c1-114.2
  { text: "Reggelente a gyerekek gyalog mennek iskolába, én pedig a konyhaasztaltól csatlakozom a megbeszélésekhez.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "lakás" }, // hu-c1-114.3
  { text: "Ritkábban sietek, és ez jólesik.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "lakás" }, // hu-c1-114.4
  { text: "A rendelőben reggel hétkor már sokan vártak.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "egészség" }, // hu-c1-115.1
  { text: "Mivel lázas voltam, az asszisztens előre engedett.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "egészség" }, // hu-c1-115.2
  { text: "Az orvos meghallgatott, felírt egy gyógyszert, és azt mondta, három napig maradjak otthon.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "egészség" }, // hu-c1-115.3
  { text: "A papírokat a munkahelyemnek is elküldtem.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "egészség" }, // hu-c1-115.4
  { text: "Szombathelyen a könyvtárban helyi szerzők tartottak felolvasóestet.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "kultúra" }, // hu-c1-116.1
  { text: "Az egyik szerző vak, és a szövegét pontírásból olvasta fel.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "kultúra" }, // hu-c1-116.2
  { text: "Utána arról beszélt, hogyan ír számítógépen képernyőolvasóval.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "kultúra" }, // hu-c1-116.3
  { text: "A közönség sokat kérdezett, és a végén mindenki kapott egy füzetet a versekkel.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "kultúra" }, // hu-c1-116.4
  { text: "Kaposváron vettünk egy régi parasztházat.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "lakás" }, // hu-c1-117.1
  { text: "A tetőt szakember cserélte ki, de a falakat mi festettük le.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "lakás" }, // hu-c1-117.2
  { text: "A szomszédok kölcsönadták a létrát, és egy szombat délután mindenki segített.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "lakás" }, // hu-c1-117.3
  { text: "Este a kertben közösen vacsoráztunk, és megbeszéltük, mit ültetünk tavasszal.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "lakás" }, // hu-c1-117.4
  { text: "Szabadkán a piacon mindig ugyanannál az árusnál veszem a túrót.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-118.1
  { text: "Magyarul és szerbül is beszél, és mindig megkérdezi, hogy van a családom.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-118.2
  { text: "Szombaton friss kenyeret és paprikát is hoztam.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-118.3
  { text: "Otthon túrós csuszát főztem, és a gyerekek kétszer is szedtek belőle.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-118.4
  { text: "Herenden egy porcelánfestő műhelyben dolgozom.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "munka" }, // hu-c1-119.1
  { text: "Egy kis virágot akár egy órán át is festek, mert minden vonalnak pontosnak kell lennie.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "munka" }, // hu-c1-119.2
  { text: "A kezem már nem remeg, ha vékony ecsetet fogok.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "munka" }, // hu-c1-119.3
  { text: "Délutánonként a látogatóknak is megmutatom, hogyan készül egy minta.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "munka" }, // hu-c1-119.4
  { text: "Párkányban lakom, és Esztergomba járok dolgozni a hídon át.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-120.1
  { text: "Reggel biciklivel megyek, és a Duna fölött mindig megállok egy percre.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-120.2
  { text: "Ilyenkor a bazilikát nézem, ahogy felszáll róla a köd.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-120.3
  { text: "Munka után a pékségben veszek egy pogácsát, és hazatekerek.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "hu", topic: "hétköznap" }, // hu-c1-120.4
];
