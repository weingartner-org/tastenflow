/**
 * ★ G3c-VERTEILER (25.10.2026): DIE WURZEL-VORLAGE DES WEGES „sv" (Schwedisch) - woher die Wörter kommen, zum Abschreiben. Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `radiciIt.ts` (mit `beleg`) und `korenyCs.ts`: drei Altersstufen, Themen mit Paaren `<Hinweis> - <Wort>`. Die Feldnamen sind
 * die von `radiciIt.ts` (`indizio`, `parola`, `origine`, `beleg`) - genau die Schlüssel der Quelle, iCloud
 * `sprachen-2026-10-25/tf-fest-neu/sv/tf-fest-sv.json`: `wurzeln` (`{ kids, teens, erwachsen }`) und `wurzelKategorien` (die Themen).
 * `raetsel` dort ist KEINE Wurzel-Zeile (Rezept D „Befund raetsel") und gehört nicht hierher.
 *
 * Zeilenregeln (Wächter: `tests/tastenflow-lerndaten-sv.test.ts`, Vorbild `tastenflow-vorlage-koreny-cs`): höchstens 40 Zeichen,
 * genau ein ` - `, `parola` ein Einzelwort, klein, nicht im Hinweis; kein Wort doppelt; keine Sperrwörter (`sperrlisteSv.ts`); nur Zeichen
 * aller Tastaturen des Weges. Mengen: der Wächter misst die eigene Grösse (cs/it verlangen 80 je Stufe, die neuen Daten haben weniger).
 *
 * ★ D-LERNDATEN (25.10.2026): gefüllt aus `tf-fest-sv.json` (`wurzeln`, `wurzelKategorien`), geprüft im `PRUEFBERICHT.md`
 * desselben Ordners. Paare je Stufe: Kinder 63, Jugend 62, Erwachsene 58 (Ziel wie cs/it: 80 - der
 * Wächter führt die gelieferte Menge als benannte Mindestzahl). Die Themen-Namen auf Deutsch und Englisch (`titelJe`) sind in
 * D-LERNDATEN übersetzt (die übrigen Bedienungen lesen das Englische). `raetsel` (240 Zeilen) ist NICHT eingehängt - es hat im
 * Code keinen Platz (Rezept D, Erkenntnis 3; Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * Wächter: `tests/tastenflow-lerndaten-sv.test.ts`.
 *
 * Verteiler: `vorlagen.ts` (`GERUEST_WURZELN`, Art `"wortherkunft"`; Gruppe in `EigenerTextQuelle.tsx`). Solange {@link WURZEL_THEMEN_SV}
 * leer ist, gibt es KEINE Vorlage (weder „Eigene Übung" noch Tippchallenge); mit dem ersten Thema erscheint sie für Weg UND Übungssprache „sv".
 *
 * ⚠️ DATENBLATT: nur `import type`, kein Code-Import.
 */

export type WurzelStufeSv = "kids" | "teens" | "erwachsen";

/** Woher ein Wort kommt - GESCHLOSSENE Liste (gemessen in `tf-fest-sv.json`, 25.10.2026); nur für die Lehrkraft, wird nicht abgetippt. */
export type WurzelOrigineSv = "arabiska" | "australiskt urfolksspråk" | "engelska" | "finska" | "franska" | "grekiska" | "grönländska" | "hindi" | "inuitiska" | "japanska" | "kinesiska" | "latin" | "lågtyska" | "malajiska" | "nahuatl" | "ortnamn" | "persiska" | "samiska" | "svenska" | "swahili" | "taino" | "tonganska" | "tupi" | "turkiska" | "tyska";

export interface WurzelPaarSv {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  indizio: string;
  /** Das Wort selbst - ein Einzelwort, klein. */
  parola: string;
  origine: WurzelOrigineSv;
  /** Wo die Herkunft nachgelesen wurde (Quelle aus `tf-fest`, z. B. eine Wiktionary-Seite). */
  beleg: string;
}

export interface WurzelThemaSv {
  id: string;
  titel: string;
  paare: WurzelPaarSv[];
}

/** Die Themen (aus `wurzelKategorien`): `titel` in Schwedisch, `titelJe` der Name in den Bedienungssprachen (fehlt einer: englisch, sonst `titel`). */
export const WURZEL_THEMEN_SV: readonly { id: string; titel: string; titelJe?: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> }[] = [
  { id: "grekiska-latin", titel: "Grekiska och latinska rötter", titelJe: { de: "Griechische und lateinische Wurzeln", en: "Greek and Latin roots" } },
  { id: "lagtyska", titel: "Ord från lågtyskan och tyskan", titelJe: { de: "Wörter aus dem Niederdeutschen und Deutschen", en: "Words from Low German and German" } },
  { id: "franska", titel: "Ord från franskan", titelJe: { de: "Wörter aus dem Französischen", en: "Words from French" } },
  { id: "fjarran", titel: "Ord från engelskan och fjärran länder", titelJe: { de: "Wörter aus dem Englischen und aus fernen Ländern", en: "Words from English and faraway lands" } },
  { id: "norden", titel: "Ord från Norden ut i världen och från finskan och samiskan", titelJe: { de: "Wörter aus dem Norden in der Welt, aus dem Finnischen und Samischen", en: "Nordic words around the world, and words from Finnish and Sami" } },
];

/** Die Paare je Stufe und Thema. */
export const WURZELN_SV: Record<WurzelStufeSv, WurzelThemaSv[]> = {
  kids: [
    {
      id: "grekiska-latin",
      titel: "Grekiska och latinska rötter",
      paare: [
        { indizio: "du pratar med någon som är långt borta", parola: "telefon", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/telefon#Swedish" },
        { indizio: "jättestor ödla från förr", parola: "dinosaurie", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/dinosaurie#Swedish" },
        { indizio: "visar det som är mycket litet", parola: "mikroskop", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/mikroskop#Swedish" },
        { indizio: "figur med tre hörn", parola: "triangel", origine: "latin", beleg: "https://en.wiktionary.org/wiki/triangel#Swedish" },
        { indizio: "läran om berg, floder och länder", parola: "geografi", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/geografi#Swedish" },
        { indizio: "många böcker att låna", parola: "bibliotek", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/bibliotek#Swedish" },
        { indizio: "går runt solen", parola: "planet", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/planet#Swedish" },
        { indizio: "rund figur utan hörn", parola: "cirkel", origine: "latin", beleg: "https://en.wiktionary.org/wiki/cirkel#Swedish" },
        { indizio: "alla bokstäver från a till ö", parola: "alfabet", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/alfabet#Swedish" },
        { indizio: "stort grått djur med snabel", parola: "elefant", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/elefant#Swedish" },
        { indizio: "stor ödla i floden med vassa tänder", parola: "krokodil", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/krokodil#Swedish" },
        { indizio: "visar hur varmt det är", parola: "termometer", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/termometer#Swedish" },
        { indizio: "visar årets alla dagar", parola: "kalender", origine: "latin", beleg: "https://en.wiktionary.org/wiki/kalender#Swedish" },
        { indizio: "sextio sekunder", parola: "minut", origine: "latin", beleg: "https://en.wiktionary.org/wiki/minut#Swedish" },
        { indizio: "man spelar pjäser där", parola: "teater", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/teater#Swedish" },
      ],
    },
    {
      id: "lagtyska",
      titel: "Ord från lågtyskan och tyskan",
      paare: [
        { indizio: "där man lagar mat", parola: "kök", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/kök#Swedish" },
        { indizio: "man leker eller tävlar", parola: "spela", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/spela#Swedish" },
        { indizio: "känna hur något smakar", parola: "smaka", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/smaka#Swedish" },
        { indizio: "man tittar ut genom det", parola: "fönster", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/fönster#Swedish" },
        { indizio: "gör saften söt", parola: "socker", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/socker#Swedish" },
        { indizio: "peppar, kanel eller salt", parola: "krydda", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/krydda#Swedish" },
        { indizio: "ge pengar för det man köper", parola: "betala", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/betala#Swedish" },
        { indizio: "plagg för benen", parola: "byxa", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/byxa#Swedish" },
        { indizio: "kokta bär med socker", parola: "sylt", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/sylt#Swedish" },
        { indizio: "inte sjuk", parola: "frisk", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/frisk#Swedish" },
      ],
    },
    {
      id: "franska",
      titel: "Ord från franskan",
      paare: [
        { indizio: "man går på den bredvid gatan", parola: "trottoar", origine: "franska", beleg: "https://en.wiktionary.org/wiki/trottoar#Swedish" },
        { indizio: "skyddar mot regnet", parola: "paraply", origine: "franska", beleg: "https://en.wiktionary.org/wiki/paraply#Swedish" },
        { indizio: "möbel med lådor", parola: "byrå", origine: "franska", beleg: "https://en.wiktionary.org/wiki/byrå#Swedish" },
        { indizio: "stor mjuk stol med armstöd", parola: "fåtölj", origine: "franska", beleg: "https://en.wiktionary.org/wiki/fåtölj#Swedish" },
        { indizio: "där bilen står", parola: "garage", origine: "franska", beleg: "https://en.wiktionary.org/wiki/garage#Swedish" },
        { indizio: "där man äter ute", parola: "restaurang", origine: "franska", beleg: "https://en.wiktionary.org/wiki/restaurang#Swedish" },
        { indizio: "man tvättar sig under den", parola: "dusch", origine: "franska", beleg: "https://en.wiktionary.org/wiki/dusch#Swedish" },
        { indizio: "barn till din faster eller morbror", parola: "kusin", origine: "franska", beleg: "https://en.wiktionary.org/wiki/kusin#Swedish" },
        { indizio: "något sött efter maten", parola: "dessert", origine: "franska", beleg: "https://en.wiktionary.org/wiki/dessert#Swedish" },
        { indizio: "rum med handfat och toalettstol", parola: "toalett", origine: "franska", beleg: "https://en.wiktionary.org/wiki/toalett#Swedish" },
        { indizio: "papper för att åka buss eller tåg", parola: "biljett", origine: "franska", beleg: "https://en.wiktionary.org/wiki/biljett#Swedish" },
        { indizio: "man står i den och väntar", parola: "kö", origine: "franska", beleg: "https://en.wiktionary.org/wiki/kö#Swedish" },
        { indizio: "äter man till köttbullar och potatis", parola: "sås", origine: "franska", beleg: "https://en.wiktionary.org/wiki/sås#Swedish" },
        { indizio: "bord, stolar och soffa", parola: "möbel", origine: "franska", beleg: "https://en.wiktionary.org/wiki/möbel#Swedish" },
        { indizio: "söt godisbit", parola: "karamell", origine: "franska", beleg: "https://en.wiktionary.org/wiki/karamell#Swedish" },
      ],
    },
    {
      id: "fjarran",
      titel: "Ord från engelskan och fjärran länder",
      paare: [
        { indizio: "röd och saftig, i sallad", parola: "tomat", origine: "nahuatl", beleg: "https://en.wiktionary.org/wiki/tomat#Swedish" },
        { indizio: "söt och brun, gjord av kakao", parola: "choklad", origine: "nahuatl", beleg: "https://en.wiktionary.org/wiki/choklad#Swedish" },
        { indizio: "vuxna dricker det varmt på morgonen", parola: "kaffe", origine: "arabiska", beleg: "https://en.wiktionary.org/wiki/kaffe#Swedish" },
        { indizio: "varm dryck av torkade blad", parola: "te", origine: "kinesiska", beleg: "https://en.wiktionary.org/wiki/te#Swedish" },
        { indizio: "smal båt man paddlar", parola: "kanot", origine: "taino", beleg: "https://en.wiktionary.org/wiki/kanot#Swedish" },
        { indizio: "hoppar och har en ficka på magen", parola: "känguru", origine: "australiskt urfolksspråk", beleg: "https://en.wiktionary.org/wiki/känguru#Swedish" },
        { indizio: "kläder man sover i", parola: "pyjamas", origine: "persiska", beleg: "https://en.wiktionary.org/wiki/pyjamas#Swedish" },
        { indizio: "tvättar håret", parola: "schampo", origine: "hindi", beleg: "https://en.wiktionary.org/wiki/schampo#Swedish" },
        { indizio: "smal båt med ett hål att sitta i", parola: "kajak", origine: "inuitiska", beleg: "https://en.wiktionary.org/wiki/kajak#Swedish" },
        { indizio: "varm jacka med luva", parola: "anorak", origine: "grönländska", beleg: "https://en.wiktionary.org/wiki/anorak#Swedish" },
        { indizio: "syrlig mjölk i en burk", parola: "yoghurt", origine: "turkiska", beleg: "https://en.wiktionary.org/wiki/yoghurt#Swedish" },
        { indizio: "djur med mycket lång hals", parola: "giraff", origine: "arabiska", beleg: "https://en.wiktionary.org/wiki/giraff#Swedish" },
        { indizio: "blå byxor av tyg", parola: "jeans", origine: "engelska", beleg: "https://en.wiktionary.org/wiki/jeans#Swedish" },
        { indizio: "klistrig remsa", parola: "tejp", origine: "engelska", beleg: "https://en.wiktionary.org/wiki/tejp#Swedish" },
        { indizio: "små torra kakor", parola: "kex", origine: "engelska", beleg: "https://en.wiktionary.org/wiki/kex#Swedish" },
      ],
    },
    {
      id: "norden",
      titel: "Ord från Norden ut i världen och från finskan och samiskan",
      paare: [
        { indizio: "stort bord med mycket mat", parola: "smörgåsbord", origine: "svenska", beleg: "https://en.wiktionary.org/wiki/smorgasbord#English" },
        { indizio: "liten motorcykel med pedaler", parola: "moped", origine: "svenska", beleg: "https://en.wiktionary.org/wiki/moped#English" },
        { indizio: "inte för mycket och inte för lite", parola: "lagom", origine: "svenska", beleg: "https://en.wiktionary.org/wiki/lagom#English" },
        { indizio: "kall lax med dill", parola: "gravlax", origine: "svenska", beleg: "https://en.wiktionary.org/wiki/gravlax#English" },
        { indizio: "hitta vägen med karta och kompass", parola: "orientering", origine: "svenska", beleg: "https://en.wiktionary.org/wiki/orienteering#English" },
        { indizio: "paus med kaffe eller saft och bulle", parola: "fika", origine: "svenska", beleg: "https://en.wiktionary.org/wiki/fika#Swedish" },
        { indizio: "liten kälke att åka i backen", parola: "pulka", origine: "finska", beleg: "https://en.wiktionary.org/wiki/pulka#Swedish" },
        { indizio: "sång på samiskt sätt", parola: "jojk", origine: "samiska", beleg: "https://en.wiktionary.org/wiki/jojk#Swedish" },
      ],
    },
  ],
  teens: [
    {
      id: "grekiska-latin",
      titel: "Grekiska och latinska rötter",
      paare: [
        { indizio: "växterna gör socker med ljus", parola: "fotosyntes", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/fotosyntes#Swedish" },
        { indizio: "läran om naturen och miljön", parola: "ekologi", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/ekologi#Swedish" },
        { indizio: "folket bestämmer", parola: "demokrati", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/demokrati#Swedish" },
        { indizio: "läran om gamla fynd", parola: "arkeologi", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/arkeologi#Swedish" },
        { indizio: "ord som betyder samma sak", parola: "synonym", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/synonym#Swedish" },
        { indizio: "samtal mellan två", parola: "dialog", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/dialog#Swedish" },
        { indizio: "en kändis skriver sitt namn", parola: "autograf", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/autograf#Swedish" },
        { indizio: "utan namn", parola: "anonym", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/anonym#Swedish" },
        { indizio: "sjukdom som sprids snabbt", parola: "epidemi", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/epidemi#Swedish" },
        { indizio: "luften runt jorden", parola: "atmosfär", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/atmosfär#Swedish" },
        { indizio: "land utan kung", parola: "republik", origine: "latin", beleg: "https://en.wiktionary.org/wiki/republik#Swedish" },
        { indizio: "högskola med forskning", parola: "universitet", origine: "latin", beleg: "https://en.wiktionary.org/wiki/universitet#Swedish" },
        { indizio: "glaslåda med fiskar", parola: "akvarium", origine: "latin", beleg: "https://en.wiktionary.org/wiki/akvarium#Swedish" },
        { indizio: "spår av djur från urtiden i stenen", parola: "fossil", origine: "latin", beleg: "https://en.wiktionary.org/wiki/fossil#Swedish" },
        { indizio: "berg som sprutar lava", parola: "vulkan", origine: "latin", beleg: "https://en.wiktionary.org/wiki/vulkan#Swedish" },
      ],
    },
    {
      id: "lagtyska",
      titel: "Ord från lågtyskan och tyskan",
      paare: [
        { indizio: "ledare för en stad förr", parola: "borgmästare", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/borgmästare#Swedish" },
        { indizio: "där man lagar och bygger saker", parola: "verkstad", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/verkstad#Swedish" },
        { indizio: "förmågan att bestämma över andra", parola: "makt", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/makt#Swedish" },
        { indizio: "lärling som blivit klar med sin utbildning", parola: "gesäll", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/gesäll#Swedish" },
        { indizio: "syr kläder", parola: "skräddare", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/skräddare#Swedish" },
        { indizio: "ung ogift kvinna förr", parola: "jungfru", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/jungfru#Swedish" },
        { indizio: "talar alltid sanning", parola: "ärlig", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/ärlig#Swedish" },
        { indizio: "måste ha", parola: "behöva", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/behöva#Swedish" },
        { indizio: "vad ett ord vill säga", parola: "betyda", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/betyda#Swedish" },
      ],
    },
    {
      id: "franska",
      titel: "Ord från franskan",
      paare: [
        { indizio: "kör bilen åt någon annan", parola: "chaufför", origine: "franska", beleg: "https://en.wiktionary.org/wiki/chaufför#Swedish" },
        { indizio: "doftar gott på huden", parola: "parfym", origine: "franska", beleg: "https://en.wiktionary.org/wiki/parfym#Swedish" },
        { indizio: "hur högt något är", parola: "nivå", origine: "franska", beleg: "https://en.wiktionary.org/wiki/nivå#Swedish" },
        { indizio: "stort papper på väggen", parola: "affisch", origine: "franska", beleg: "https://en.wiktionary.org/wiki/affisch#Swedish" },
        { indizio: "liten väska för mynt", parola: "portmonnä", origine: "franska", beleg: "https://en.wiktionary.org/wiki/portmonnä#Swedish" },
        { indizio: "äggrätt i stekpannan", parola: "omelett", origine: "franska", beleg: "https://en.wiktionary.org/wiki/omelett#Swedish" },
        { indizio: "skåp för kläder", parola: "garderob", origine: "franska", beleg: "https://en.wiktionary.org/wiki/garderob#Swedish" },
        { indizio: "fint rum att ta emot gäster i", parola: "salong", origine: "franska", beleg: "https://en.wiktionary.org/wiki/salong#Swedish" },
        { indizio: "man lägger brevet i det", parola: "kuvert", origine: "franska", beleg: "https://en.wiktionary.org/wiki/kuvert#Swedish" },
        { indizio: "kavaj och byxor som hör ihop", parola: "kostym", origine: "franska", beleg: "https://en.wiktionary.org/wiki/kostym#Swedish" },
        { indizio: "hår under näsan", parola: "mustasch", origine: "franska", beleg: "https://en.wiktionary.org/wiki/mustasch#Swedish" },
        { indizio: "hur håret är klippt", parola: "frisyr", origine: "franska", beleg: "https://en.wiktionary.org/wiki/frisyr#Swedish" },
        { indizio: "skriver nyheter", parola: "journalist", origine: "franska", beleg: "https://en.wiktionary.org/wiki/journalist#Swedish" },
        { indizio: "lång artikel om en händelse", parola: "reportage", origine: "franska", beleg: "https://en.wiktionary.org/wiki/reportage#Swedish" },
        { indizio: "bil som kör sjuka till sjukhuset", parola: "ambulans", origine: "franska", beleg: "https://en.wiktionary.org/wiki/ambulans#Swedish" },
      ],
    },
    {
      id: "fjarran",
      titel: "Ord från engelskan och fjärran länder",
      paare: [
        { indizio: "jättevåg efter jordbävning", parola: "tsunami", origine: "japanska", beleg: "https://en.wiktionary.org/wiki/tsunami#Swedish" },
        { indizio: "sjunga till musik på en skärm", parola: "karaoke", origine: "japanska", beleg: "https://en.wiktionary.org/wiki/karaoke#Swedish" },
        { indizio: "japanska serietidningar", parola: "manga", origine: "japanska", beleg: "https://en.wiktionary.org/wiki/manga#Swedish" },
        { indizio: "liten bild i ett meddelande", parola: "emoji", origine: "japanska", beleg: "https://en.wiktionary.org/wiki/emoji#Swedish" },
        { indizio: "matematik med bokstäver", parola: "algebra", origine: "arabiska", beleg: "https://en.wiktionary.org/wiki/algebra#Swedish" },
        { indizio: "liten affär vid gatan", parola: "kiosk", origine: "turkiska", beleg: "https://en.wiktionary.org/wiki/kiosk#Swedish" },
        { indizio: "rödbrun apa i regnskogen", parola: "orangutang", origine: "malajiska", beleg: "https://en.wiktionary.org/wiki/orangutang#Swedish" },
        { indizio: "mycket kraftig storm", parola: "orkan", origine: "taino", beleg: "https://en.wiktionary.org/wiki/orkan#Swedish" },
        { indizio: "stort kattdjur i Sydamerika", parola: "jaguar", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/jaguar#Swedish" },
        { indizio: "bönor som man gör choklad av", parola: "kakao", origine: "nahuatl", beleg: "https://en.wiktionary.org/wiki/kakao#Swedish" },
        { indizio: "grön frukt med stor kärna", parola: "avokado", origine: "nahuatl", beleg: "https://en.wiktionary.org/wiki/avokado#Swedish" },
        { indizio: "resa för att se vilda djur", parola: "safari", origine: "swahili", beleg: "https://en.wiktionary.org/wiki/safari#Swedish" },
        { indizio: "program att lyssna på i mobilen", parola: "podd", origine: "engelska", beleg: "https://en.wiktionary.org/wiki/podd#Swedish" },
        { indizio: "skicka ett brev via nätet", parola: "mejla", origine: "engelska", beleg: "https://en.wiktionary.org/wiki/mejla#Swedish" },
        { indizio: "titta på film via nätet", parola: "streama", origine: "engelska", beleg: "https://en.wiktionary.org/wiki/streama#Swedish" },
      ],
    },
    {
      id: "norden",
      titel: "Ord från Norden ut i världen och från finskan och samiskan",
      paare: [
        { indizio: "person som granskar myndigheterna", parola: "ombudsman", origine: "svenska", beleg: "https://en.wiktionary.org/wiki/ombudsman#English" },
        { indizio: "tung sten, gammalt namn på ett mineral", parola: "tungsten", origine: "svenska", beleg: "https://en.wiktionary.org/wiki/tungsten#English" },
        { indizio: "grundämne med namn efter Stockholm", parola: "holmium", origine: "ortnamn", beleg: "https://en.wiktionary.org/wiki/holmium#English" },
        { indizio: "grundämne med namn efter byn Ytterby", parola: "yttrium", origine: "ortnamn", beleg: "https://en.wiktionary.org/wiki/yttrium#English" },
        { indizio: "inre styrka som inte ger upp", parola: "sisu", origine: "finska", beleg: "https://sv.wiktionary.org/wiki/sisu" },
        { indizio: "kall slätt utan träd i norr", parola: "tundra", origine: "samiska", beleg: "https://en.wiktionary.org/wiki/tundra#Swedish" },
        { indizio: "skidpjäxa, stövel för skidor", parola: "pjäxa", origine: "finska", beleg: "https://en.wiktionary.org/wiki/pjäxa#Swedish" },
        { indizio: "renens hona", parola: "vaja", origine: "samiska", beleg: "https://en.wiktionary.org/wiki/vaja#Swedish" },
      ],
    },
  ],
  erwachsen: [
    {
      id: "grekiska-latin",
      titel: "Grekiska och latinska rötter",
      paare: [
        { indizio: "kärlek till visdom", parola: "filosofi", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/filosofi#Swedish" },
        { indizio: "person som ger pengar för att hjälpa andra", parola: "filantrop", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/filantrop#Swedish" },
        { indizio: "läran om människan", parola: "antropologi", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/antropologi#Swedish" },
        { indizio: "några få har makten", parola: "oligarki", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/oligarki#Swedish" },
        { indizio: "en kung eller drottning styr", parola: "monarki", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/monarki#Swedish" },
        { indizio: "förvandling till en ny form", parola: "metamorfos", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/metamorfos#Swedish" },
        { indizio: "två arter lever tillsammans till nytta", parola: "symbios", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/symbios#Swedish" },
        { indizio: "läran om ordens ursprung", parola: "etymologi", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/etymologi#Swedish" },
        { indizio: "världsmedborgare", parola: "kosmopolit", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/kosmopolit#Swedish" },
        { indizio: "antagande som ska prövas", parola: "hypotes", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/hypotes#Swedish" },
        { indizio: "alla är överens", parola: "konsensus", origine: "latin", beleg: "https://en.wiktionary.org/wiki/konsensus#Swedish" },
        { indizio: "folket röstar om en fråga", parola: "referendum", origine: "latin", beleg: "https://en.wiktionary.org/wiki/referendum#Swedish" },
        { indizio: "rätt att stoppa ett beslut", parola: "veto", origine: "latin", beleg: "https://en.wiktionary.org/wiki/veto#Swedish" },
        { indizio: "bevis på att man var någon annanstans", parola: "alibi", origine: "latin", beleg: "https://en.wiktionary.org/wiki/alibi#Swedish" },
        { indizio: "svårt val mellan två dåliga saker", parola: "dilemma", origine: "grekiska", beleg: "https://en.wiktionary.org/wiki/dilemma#Swedish" },
      ],
    },
    {
      id: "lagtyska",
      titel: "Ord från lågtyskan och tyskan",
      paare: [
        { indizio: "kungens man som drev in skatt förr", parola: "fogde", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/fogde#Swedish" },
        { indizio: "resterna av ett förlist skepp", parola: "vrak", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/vrak#Swedish" },
        { indizio: "har nått vuxen ålder", parola: "myndig", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/myndig#Swedish" },
        { indizio: "ha för vana att göra något", parola: "bruka", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/bruka#Swedish" },
        { indizio: "oro och sorg", parola: "bekymmer", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/bekymmer#Swedish" },
        { indizio: "ge en order", parola: "befalla", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/befalla#Swedish" },
        { indizio: "börja", parola: "begynna", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/begynna#Swedish" },
        { indizio: "sköta, ta hand om", parola: "hantera", origine: "lågtyska", beleg: "https://en.wiktionary.org/wiki/hantera#Swedish" },
        { indizio: "storslagen och ståtlig", parola: "präktig", origine: "tyska", beleg: "https://en.wiktionary.org/wiki/präktig#Swedish" },
      ],
    },
    {
      id: "franska",
      titel: "Ord från franskan",
      paare: [
        { indizio: "för mycket regler och papper", parola: "byråkrati", origine: "franska", beleg: "https://en.wiktionary.org/wiki/byråkrati#Swedish" },
        { indizio: "skada som görs med flit", parola: "sabotage", origine: "franska", beleg: "https://en.wiktionary.org/wiki/sabotage#Swedish" },
        { indizio: "väg kantad av träd", parola: "allé", origine: "franska", beleg: "https://en.wiktionary.org/wiki/allé#Swedish" },
        { indizio: "konstnärens arbetsrum", parola: "ateljé", origine: "franska", beleg: "https://en.wiktionary.org/wiki/ateljé#Swedish" },
        { indizio: "persienn att dra ner för fönstret", parola: "jalusi", origine: "franska", beleg: "https://en.wiktionary.org/wiki/jalusi#Swedish" },
        { indizio: "hemlig plan", parola: "intrig", origine: "franska", beleg: "https://en.wiktionary.org/wiki/intrig#Swedish" },
        { indizio: "lite slarvig och obekymrad", parola: "nonchalant", origine: "franska", beleg: "https://en.wiktionary.org/wiki/nonchalant#Swedish" },
        { indizio: "gott rykte", parola: "renommé", origine: "franska", beleg: "https://en.wiktionary.org/wiki/renommé#Swedish" },
        { indizio: "ingång eller förrätt", parola: "entré", origine: "franska", beleg: "https://en.wiktionary.org/wiki/entré#Swedish" },
        { indizio: "strosa omkring i staden", parola: "flanera", origine: "franska", beleg: "https://en.wiktionary.org/wiki/flanera#Swedish" },
        { indizio: "hög byrå med många lådor", parola: "chiffonjé", origine: "franska", beleg: "https://en.wiktionary.org/wiki/chiffonjé#Swedish" },
        { indizio: "herre som följer en dam", parola: "kavaljer", origine: "franska", beleg: "https://en.wiktionary.org/wiki/kavaljer#Swedish" },
        { indizio: "lugn tur till fots", parola: "promenad", origine: "franska", beleg: "https://en.wiktionary.org/wiki/promenad#Swedish" },
        { indizio: "tala för en sak i rätten", parola: "plädera", origine: "franska", beleg: "https://en.wiktionary.org/wiki/plädera#Swedish" },
      ],
    },
    {
      id: "fjarran",
      titel: "Ord från engelskan och fjärran länder",
      paare: [
        { indizio: "något som man inte får tala om", parola: "tabu", origine: "tonganska", beleg: "https://en.wiktionary.org/wiki/tabu#Swedish" },
        { indizio: "vägra köpa eller delta", parola: "bojkott", origine: "engelska", beleg: "https://en.wiktionary.org/wiki/bojkott#Swedish" },
        { indizio: "punkten rakt ovanför huvudet", parola: "zenit", origine: "arabiska", beleg: "https://en.wiktionary.org/wiki/zenit#Swedish" },
        { indizio: "gammal konst att göra guld", parola: "alkemi", origine: "arabiska", beleg: "https://en.wiktionary.org/wiki/alkemi#Swedish" },
        { indizio: "förråd eller tidskrift", parola: "magasin", origine: "arabiska", beleg: "https://en.wiktionary.org/wiki/magasin#Swedish" },
        { indizio: "avgift för varor över gränsen", parola: "tariff", origine: "arabiska", beleg: "https://en.wiktionary.org/wiki/tariff#Swedish" },
        { indizio: "högsta befälet i flottan", parola: "amiral", origine: "arabiska", beleg: "https://en.wiktionary.org/wiki/amiral#Swedish" },
        { indizio: "marknad med många stånd", parola: "basar", origine: "persiska", beleg: "https://en.wiktionary.org/wiki/basar#Swedish" },
        { indizio: "rad av kameler som reser", parola: "karavan", origine: "persiska", beleg: "https://en.wiktionary.org/wiki/karavan#Swedish" },
        { indizio: "spel med kung och dam", parola: "schack", origine: "persiska", beleg: "https://en.wiktionary.org/wiki/schack#Swedish" },
        { indizio: "den underbara trädgården", parola: "paradis", origine: "persiska", beleg: "https://en.wiktionary.org/wiki/paradis#Swedish" },
        { indizio: "vårblomma från Holland", parola: "tulpan", origine: "turkiska", beleg: "https://en.wiktionary.org/wiki/tulpan#Swedish" },
        { indizio: "väntrum på ett hotell", parola: "lobby", origine: "engelska", beleg: "https://en.wiktionary.org/wiki/lobby#Swedish" },
        { indizio: "sista dagen för ett arbete", parola: "deadline", origine: "engelska", beleg: "https://en.wiktionary.org/wiki/deadline#Swedish" },
      ],
    },
    {
      id: "norden",
      titel: "Ord från Norden ut i världen och från finskan och samiskan",
      paare: [
        { indizio: "gul rotfrukt, kålrot", parola: "rotabagge", origine: "svenska", beleg: "https://en.wiktionary.org/wiki/rutabaga#English" },
        { indizio: "grundämne med namn efter Ytterby", parola: "erbium", origine: "ortnamn", beleg: "https://en.wiktionary.org/wiki/erbium#English" },
        { indizio: "ännu ett grundämne från Ytterby", parola: "terbium", origine: "ortnamn", beleg: "https://en.wiktionary.org/wiki/terbium#English" },
        { indizio: "grundämne vars namn börjar som byn Ytterby", parola: "ytterbium", origine: "ortnamn", beleg: "https://en.wiktionary.org/wiki/ytterbium#English" },
        { indizio: "släde som dras av en ren", parola: "ackja", origine: "samiska", beleg: "https://en.wiktionary.org/wiki/ackja#Swedish" },
        { indizio: "rad av renar som drar slädar efter varandra", parola: "rajd", origine: "samiska", beleg: "https://en.wiktionary.org/wiki/rajd#Swedish" },
      ],
    },
  ],
};

/** Der Name der Tippchallenge-Dateien je Bedienungssprache, mit `{i}` und `{n}` („Bulgarian word origins, alphabetical: file {i} of {n}"). */
export const WURZEL_CHALLENGE_TITEL_SV: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> = {
  de: "Herkunft schwedischer Wörter, alphabetisch: Datei {i} von {n}",
  en: "Swedish word origins, alphabetical: file {i} of {n}",
};

/** Die Zeile eines Paares: zuerst der Hinweis, dann das Wort. */
export function wurzelZeileSv(x: { indizio: string; parola: string }): string {
  return `${x.indizio} - ${x.parola}`;
}

/** Dieselben Wörter, alphabetisch nach dem Hinweis (Sortierung „sv-SE") - für die Tippchallenge, wie `KORENY_ABECEDNE`. */
export const WURZELN_SV_ALPHABETISCH: Record<WurzelStufeSv, string[]> = Object.fromEntries(
  (Object.keys(WURZELN_SV) as WurzelStufeSv[]).map((stufe) => [
    stufe,
    WURZELN_SV[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indizio.localeCompare(b.indizio, "sv-SE"))
      .map(wurzelZeileSv),
  ]),
) as Record<WurzelStufeSv, string[]>;
