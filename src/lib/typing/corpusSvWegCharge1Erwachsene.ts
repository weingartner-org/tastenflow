/**
 * Korpus des Weges „sv" (Schwedisch), Charge 1 - Erwachsene (K-SV, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_SV_WEG_CHARGE1_ERWACHSENE: CorpusItem[] = [
  { text: "Distriktssköterskan i Arjeplog kör långt mellan patienterna och planerar rutten noga.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-081
  { text: "Efter flytten till Luleå söker Daniel förskoleplats åt sin dotter.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Behörden" }, // sv-c1-082
  { text: "På sågverket i Ångermanland har Petra arbetat som underhållstekniker i flera år.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-083
  { text: "Maria har en synnedsättning och leder kommunens arbete med tillgänglighet i Östersund.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-084
  { text: "Renskötaren Anders kollar väderappen innan han kör ut till hjorden på fjället.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-085
  { text: "Kvällskursen i svenska för invandrare i Skellefteå har elever från tolv länder.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "sv", topic: "Svenska för invandrare" }, // sv-c1-086
  { text: "Vi hyr en stuga vid älven i Härjedalen och fiskar varje kväll i en vecka.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Alltag" }, // sv-c1-087
  { text: "Lena går med i en bokcirkel i Kalix som läser en ny roman varje månad.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Kultur" }, // sv-c1-088
  { text: "Johanna och Ali har köpt ett gammalt hus i en by utanför Umeå.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-089.1
  { text: "Taket måste läggas om och köket är från sjuttiotalet.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-089.2
  { text: "De gör mycket av arbetet själva och lär sig av filmer på nätet.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-089.3
  { text: "Grannen kommer ofta förbi med kaffe och goda råd, och ibland med en stege.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-089.4
  { text: "När Göran i Pajala behöver träffa en läkare börjar han ofta med ett videosamtal.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-090.1
  { text: "Det sparar en resa på många mil.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-090.2
  { text: "Sjuksköterskan har lärt honom att mäta blodtrycket hemma och skicka in värdena.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-090.3
  { text: "Om något ser konstigt ut får han komma in samma vecka.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-090.4
  { text: "Karin skickar in sin ansökan om bygglov för altanen digitalt till kommunen i Enköping.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Behörden" }, // sv-c1-091
  { text: "På vårdcentralen i Västerås frågar Hassan om han kan få tolk vid nästa besök.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-092
  { text: "Två kollegor i Örebro delar på en tjänst och lämnar över arbetet varje onsdag.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-093
  { text: "Johan använder rullstol och åker pendeltåg till jobbet i Stockholm varje dag.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Alltag" }, // sv-c1-094
  { text: "I Uppsala har en kör med nyanlända och svenskfödda övat ett helt år inför konserten.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Kultur" }, // sv-c1-095
  { text: "Kerstin har just gått i pension och lär sig spela fiol på en kurs i Rättvik.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Kultur" }, // sv-c1-096
  { text: "Hyresgästerna i huset i Södertälje träffas för att prata om den nya tvättstugan.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-097
  { text: "Den 6 juni är Sveriges nationaldag och en ledig dag för de flesta.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "sv", topic: "Feste" }, // sv-c1-098.1
  { text: "Rana firar dagen i Karlstad med sina barn och sin granne.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-098.2
  { text: "Hon har bott i Sverige i sex år och blev svensk medborgare i våras.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-098.3
  { text: "De tar med en filt till parken, lyssnar på musik och äter glass vid älven.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Feste" }, // sv-c1-098.4
  { text: "Amira jobbar som busschaufför i Stockholm och börjar sitt pass tidigt på morgonen.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-099.1
  { text: "Hon tycker om lugnet innan staden vaknar.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-099.2
  { text: "De första resenärerna är ofta samma personer varje dag: en bagare, två sjuksköterskor och en student som alltid sitter längst bak och läser.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-099.3
  { text: "Efter en lång sjukskrivning börjar Tomas i Norrtälje arbeta igen, först på halvtid.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-100.1
  { text: "Chefen och han har gjort en plan tillsammans.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-100.2
  { text: "Varje fredag pratar de om hur veckan har gått.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-100.3
  { text: "Tomas märker att promenaden på lunchen gör stor skillnad, så nu går han ut även när det regnar.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-100.4
  { text: "I Helsingborg byter Linda jobb och blir lärare i matematik på högstadiet.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-101
  { text: "Hyran i den nya lägenheten i Norrköping är högre, men den ligger nära jobbet.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-102
  { text: "På Gotland driver Erik och Sanna ett litet bageri som bakar bröd av lokalt mjöl.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-103
  { text: "Adam använder teckenspråk och arbetar som snickare på ett byggföretag i Växjö.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-104
  { text: "Mohammed i Kristianstad ansöker om föräldrapenning för att vara hemma med sin son.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "sv", topic: "Behörden" }, // sv-c1-105
  { text: "På en liten teater i Malmö spelas en ny pjäs som skådespelarna har skrivit tillsammans.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Kultur" }, // sv-c1-106
  { text: "Vi har en odlingslott i Lund och skördar mer potatis än vi hinner äta.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Alltag" }, // sv-c1-107
  { text: "Varje tisdag och torsdag läser Nadia svenska för invandrare i Jönköping.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Svenska för invandrare" }, // sv-c1-108.1
  { text: "Hon har arbetat som sjuksköterska i sitt hemland och vill jobba med samma sak här.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Svenska för invandrare" }, // sv-c1-108.2
  { text: "Läraren ger klassen ord från vården att öva på.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "sv", topic: "Svenska för invandrare" }, // sv-c1-108.3
  { text: "Nadia skriver in dem i en app och repeterar på bussen hem.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Svenska för invandrare" }, // sv-c1-108.4
  { text: "Visby på Gotland är ett världsarv.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-109.1
  { text: "Jens bor i ett gammalt hus i stadens centrum och vill byta fönster i köket.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-109.2
  { text: "Innan han beställer något ringer han kommunen och frågar vilka regler som gäller.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-109.3
  { text: "Handläggaren skickar en länk med information och erbjuder ett möte på plats.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-109.4
  { text: "Mikael pendlar mellan Kyrkslätt och Helsingfors och jobbar hemma på fredagar.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-110
  { text: "I Mariehamn jobbar Jessica på ett rederi och planerar fartygens turlistor inför vintern.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-111
  { text: "Fredrik har nedsatt syn och jobbar som programmerare på ett företag i Åbo.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-112
  { text: "Annika bokar tid på hälsostationen i Vasa via nätet.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Gesundheit" }, // sv-c1-113
  { text: "Vi har köpt en sommarstuga i skärgården utanför Ekenäs och renoverar bastun.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Wohnen" }, // sv-c1-114
  { text: "Pensionärsföreningen i Jakobstad ordnar en kurs i hur man använder bankens app.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Alltag" }, // sv-c1-115
  { text: "I Borgå håller en granne loppis i sitt garage varje lördag i maj.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Kultur" }, // sv-c1-116
  { text: "Kristina jobbar på ett servicekontor i Helsingfors där kunderna talar både svenska och finska.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-117.1
  { text: "Hon byter språk många gånger om dagen utan att tänka på det.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-117.2
  { text: "Ibland kommer någon som bara talar engelska, och då byter hon igen.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-117.3
  { text: "Kollegorna kallar henne skämtsamt för kontorets egen tolk.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "sv", topic: "Arbeit" }, // sv-c1-117.4
  { text: "Familjen har flyttat till Kimitoön och ska välja daghem åt sin yngsta.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Familie" }, // sv-c1-118.1
  { text: "De besöker tre ställen på en vecka och ställer samma frågor överallt.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Familie" }, // sv-c1-118.2
  { text: "Pappan antecknar svaren och mamman tar bilder.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Familie" }, // sv-c1-118.3
  { text: "Till slut är det fyraåringen själv som avgör, för på ett av ställena finns en stor sandlåda och en kanin.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Familie" }, // sv-c1-118.4
  { text: "Musikerna i en liten jazzgrupp på Åland repeterar i en gammal lada nära havet.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Kultur" }, // sv-c1-119.1
  { text: "Två av dem är pensionärer, en är sjuksköterska och en går fortfarande i gymnasiet.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Kultur" }, // sv-c1-119.2
  { text: "På hösten spelar de på ett äldreboende i Mariehamn.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Kultur" }, // sv-c1-119.3
  { text: "Publiken sjunger med i varenda låt.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "sv", topic: "Kultur" }, // sv-c1-119.4
  { text: "Det svenska laget i rullstolscurling tog brons vid Paralympics 2026.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "sv", topic: "Paralympics" }, // sv-c1-120
];
