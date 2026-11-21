/**
 * Korpus des Weges „sv" (Schwedisch), Charge 1 - Jugendliche (K-SV, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_SV_WEG_CHARGE1_TEENS: CorpusItem[] = [
  { text: "Efter träningen i Umeå sitter laget kvar i omklädningsrummet och pratar om matchen.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Sport" }, // sv-c1-041
  { text: "Elle lär sig samiska på distans och har lektion via datorn två gånger i veckan.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Minderheiten" }, // sv-c1-042
  { text: "Jonatan har praktiserat på ett vattenkraftverk vid Luleälven och vill bli elektriker.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Berufswahl" }, // sv-c1-043
  { text: "Med nattåget söderut från Kiruna hinner Malin lyssna på en hel ljudbok.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Reisen" }, // sv-c1-044
  { text: "Hugo i Östersund programmerar ett spel där en ren ska hitta hem över fjället.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "sv", topic: "Technik" }, // sv-c1-045
  { text: "När isen har lagt sig på älven i Haparanda åker gänget långfärdsskridskor.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "sv", topic: "Freundschaft" }, // sv-c1-046
  { text: "Moa i Sundsvall spelar in en podd med sin bästa vän om ny musik från Norrland.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-047
  { text: "Ovanför polcirkeln går solen inte ner mitt i sommaren.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-048.1
  { text: "För Linnea i Gällivare betyder det att fotbollsträningen ibland håller på till sent på kvällen.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-048.2
  { text: "Ingen tänker på klockan.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-048.3
  { text: "Först när hon kommer hem och ser att lillebror redan sover förstår hon hur sent det har blivit.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-048.4
  { text: "Vindkraftverken på berget ovanför byn i Jämtland syns från Alvas fönster.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-049.1
  { text: "I samhällskunskapen ska hon skriva om energi, så hon intervjuar en tekniker som jobbar där.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-049.2
  { text: "Teknikern berättar hur man klättrar upp i tornet och vad som händer när det blåser för mycket.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-049.3
  { text: "Alva spelar in allt med mobilen.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-049.4
  { text: "Inför gymnasievalet i Västerås jämför Samir naturvetenskapsprogrammet med teknikprogrammet.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Berufswahl" }, // sv-c1-050
  { text: "Ida spelar rullstolsbasket i Örebro och tränar tre kvällar i veckan.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Sport" }, // sv-c1-051
  { text: "På lägret i Värmland lagar vi maten på stormkök, eftersom det är eldningsförbud.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-052
  { text: "Vårt skolband i Uppsala repar varje torsdag och ska spela på skolavslutningen i juni.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-053
  { text: "Klassen i Nyköping städar stranden och sorterar plasten i olika säckar.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-054
  { text: "Wilma använder skärmläsare och lyssnar på läxan med hörlurar i biblioteket i Falun.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-055
  { text: "Tre kompisar från Mora cyklar runt Siljan på sommarlovet och tältar varje natt.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Reisen" }, // sv-c1-056
  { text: "Teknikklubben på en skola i Stockholm bygger en robot som kan sortera skräp.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Technik" }, // sv-c1-057.1
  { text: "Den känner igen burkar, papper och plast med hjälp av en kamera.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Technik" }, // sv-c1-057.2
  { text: "Ibland tar den fel och lägger ett äpple bland burkarna.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Technik" }, // sv-c1-057.3
  { text: "Då skrattar alla, skriver om koden och testar igen.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Technik" }, // sv-c1-057.4
  { text: "Bea i Uppsala gör musik i sitt rum med en gammal dator och ett billigt keyboard.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-058.1
  { text: "Hon spelar in sin egen röst, lägger till trummor och delar låten med kompisarna.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-058.2
  { text: "En av dem skriver text till refrängen.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-058.3
  { text: "Nu har de tre låtar och vill spela dem live på skolans vårfest.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-058.4
  { text: "På färjan till Visby pluggar Leo inför provet, men mest tittar han ut över havet.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Reisen" }, // sv-c1-059
  { text: "I Malmö startar Yasmin en grupp som lagar cyklar gratis åt grannarna.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Freundschaft" }, // sv-c1-060
  { text: "Efter skolan i Linköping kodar Elias en app som påminner om när bussen går.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Technik" }, // sv-c1-061
  { text: "Klassen i Karlskrona mäter vattnets temperatur i Östersjön varje vecka i ett år.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-062
  { text: "Nora i Halmstad tävlar i vindsurfing och kollar vindprognosen varje morgon.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Sport" }, // sv-c1-063
  { text: "Teo använder rullstol och åker med sina kompisar på konsert i Göteborg.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Freundschaft" }, // sv-c1-064
  { text: "Under praktikveckan i Jönköping får Alice jobba på en verkstad som lagar bussar.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Berufswahl" }, // sv-c1-065
  { text: "På Öland cyklar Ali och hans kusiner längs stranden ända bort till fyren.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Reisen" }, // sv-c1-066
  { text: "Selma och Amina i Borås har en gemensam spellista som de fyller på varje dag.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-067.1
  { text: "Den ena lägger till en låt på morgonen, och den andra svarar med en låt på kvällen.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-067.2
  { text: "Ibland säger låtarna mer än ett meddelande.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-067.3
  { text: "När Amina flyttade till Kalmar blev spellistan ännu viktigare.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Musik" }, // sv-c1-067.4
  { text: "Vid kusten i Bohuslän hittar ungdomarna i miljöklubben mycket plast mellan klipporna.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-068.1
  { text: "De räknar allt de plockar upp och skickar listan till kommunen.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-068.2
  { text: "Mest hittar de korkar och snören.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-068.3
  { text: "Kommunen lovar att sätta upp fler soptunnor vid badplatsen, och klubben ska kontrollera om det hjälper.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-068.4
  { text: "I Jakobstad tränar Fredrik fotboll i ett lag där alla pratar både svenska och finska.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Sport" }, // sv-c1-069
  { text: "Mikaela pendlar med buss från Ekenäs och gör läxorna på vägen.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Alltag" }, // sv-c1-070
  { text: "Under sommaren jobbar Oliver på en fiskebåt i den åländska skärgården.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Berufswahl" }, // sv-c1-071
  { text: "Den 6 november firar skolan i Åbo Svenska dagen med sång och tal.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "sv", topic: "Feste" }, // sv-c1-072
  { text: "Ronja har nedsatt syn och använder punktskrift när hon skriver prov i Borgå.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Schule" }, // sv-c1-073
  { text: "Elevrådet i en skola i Helsingfors vill att matsalen ska servera fler vegetariska luncher.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Umwelt" }, // sv-c1-074
  { text: "I Kristinestad bygger Juho och Saga en fågelholk som de sätter upp i skogsdungen vid skolan.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Natur" }, // sv-c1-075
  { text: "Linus bor i Mariehamn och har en kusin i Tammerfors.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Minderheiten" }, // sv-c1-076.1
  { text: "På Åland är svenska det enda officiella språket, men kusinen går i en finskspråkig skola.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Minderheiten" }, // sv-c1-076.2
  { text: "När de ses på sommaren pratar de en blandning av båda språken.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Minderheiten" }, // sv-c1-076.3
  { text: "Ibland byter de mitt i en mening och skrattar åt det.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Minderheiten" }, // sv-c1-076.4
  { text: "Klassen från Vasa åker tåg till Helsingfors för att besöka en teknikmässa.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Reisen" }, // sv-c1-077.1
  { text: "Resan tar flera timmar, så de spelar kort och delar matsäck.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Reisen" }, // sv-c1-077.2
  { text: "På mässan provar Ella ett headset och flyger över en stad som bara finns i datorn.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Reisen" }, // sv-c1-077.3
  { text: "På midsommarafton är hela släkten samlad vid stugan i Österbotten.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-078.1
  { text: "Först bastar alla, och sedan tänder morbror en brasa på stranden.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-078.2
  { text: "Jonna och hennes kusiner sitter vid elden och pratar tills fåglarna börjar sjunga.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-078.3
  { text: "Ingen har bråttom att gå och lägga sig.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-078.4
  { text: "Vid Paralympics 2026 tog Ebba Årsjö guld i störtlopp, superkombination och storslalom.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "sv", topic: "Paralympics" }, // sv-c1-079
  { text: "Zebastian Modin åker längdskidor i klassen för idrottare med synnedsättning.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Paralympics" }, // sv-c1-080.1
  { text: "Vid Paralympics 2026 åkte han tillsammans med sin ledsagare Emil Talsi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "sv", topic: "Paralympics" }, // sv-c1-080.2
  { text: "De tog två bronsmedaljer i klassisk stil, en i sprint och en på tio kilometer.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Paralympics" }, // sv-c1-080.3
  { text: "En åkare och en ledsagare måste kunna lita helt på varandra i spåret.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "sv", topic: "Paralympics" }, // sv-c1-080.4
];
