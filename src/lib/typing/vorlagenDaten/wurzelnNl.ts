/**
 * ★ G3c-VERTEILER (25.10.2026): DIE WURZEL-VORLAGE DES WEGES „nl" (Niederländisch) - woher die Wörter kommen, zum Abschreiben. Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `radiciIt.ts` (mit `beleg`) und `korenyCs.ts`: drei Altersstufen, Themen mit Paaren `<Hinweis> - <Wort>`. Die Feldnamen sind
 * die von `radiciIt.ts` (`indizio`, `parola`, `origine`, `beleg`) - genau die Schlüssel der Quelle, iCloud
 * `sprachen-2026-10-25/tf-fest-neu/nl/tf-fest-nl.json`: `wurzeln` (`{ kids, teens, erwachsen }`) und `wurzelKategorien` (die Themen).
 * `raetsel` dort ist KEINE Wurzel-Zeile (Rezept D „Befund raetsel") und gehört nicht hierher.
 *
 * Zeilenregeln (Wächter: `tests/tastenflow-lerndaten-nl.test.ts`, Vorbild `tastenflow-vorlage-koreny-cs`): höchstens 40 Zeichen,
 * genau ein ` - `, `parola` ein Einzelwort, klein, nicht im Hinweis; kein Wort doppelt; keine Sperrwörter (`sperrlisteNl.ts`); nur Zeichen
 * aller Tastaturen des Weges. Mengen: der Wächter misst die eigene Grösse (cs/it verlangen 80 je Stufe, die neuen Daten haben weniger).
 *
 * ★ D-LERNDATEN (25.10.2026): gefüllt aus `tf-fest-nl.json` (`wurzeln`, `wurzelKategorien`), geprüft im `PRUEFBERICHT.md`
 * desselben Ordners. Paare je Stufe: Kinder 80, Jugend 80, Erwachsene 80 (Ziel wie cs/it: 80 - der
 * Wächter führt die gelieferte Menge als benannte Mindestzahl). Die Themen-Namen auf Deutsch und Englisch (`titelJe`) sind in
 * D-LERNDATEN übersetzt (die übrigen Bedienungen lesen das Englische). `raetsel` (240 Zeilen) ist NICHT eingehängt - es hat im
 * Code keinen Platz (Rezept D, Erkenntnis 3; Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * Wächter: `tests/tastenflow-lerndaten-nl.test.ts`.
 *
 * Verteiler: `vorlagen.ts` (`GERUEST_WURZELN`, Art `"wortherkunft"`; Gruppe in `EigenerTextQuelle.tsx`). Solange {@link WURZEL_THEMEN_NL}
 * leer ist, gibt es KEINE Vorlage (weder „Eigene Übung" noch Tippchallenge); mit dem ersten Thema erscheint sie für Weg UND Übungssprache „nl".
 *
 * ⚠️ DATENBLATT: nur `import type`, kein Code-Import.
 */

export type WurzelStufeNl = "kids" | "teens" | "erwachsen";

/** Woher ein Wort kommt - GESCHLOSSENE Liste (gemessen in `tf-fest-nl.json`, 25.10.2026); nur für die Lehrkraft, wird nicht abgetippt. */
export type WurzelOrigineNl = "Arabisch" | "Engels" | "Frans" | "Grieks" | "Guugu Yimithirr" | "Hindi" | "Inuktitut" | "Japans" | "Jiddisch" | "Latijn" | "Maleis" | "Nahuatl" | "Nederlands" | "Perzisch" | "Swahili" | "Tsjechisch" | "Tupi" | "Turks";

export interface WurzelPaarNl {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  indizio: string;
  /** Das Wort selbst - ein Einzelwort, klein. */
  parola: string;
  origine: WurzelOrigineNl;
  /** Wo die Herkunft nachgelesen wurde (Quelle aus `tf-fest`, z. B. eine Wiktionary-Seite). */
  beleg: string;
}

export interface WurzelThemaNl {
  id: string;
  titel: string;
  paare: WurzelPaarNl[];
}

/** Die Themen (aus `wurzelKategorien`): `titel` in Niederländisch, `titelJe` der Name in den Bedienungssprachen (fehlt einer: englisch, sonst `titel`). */
export const WURZEL_THEMEN_NL: readonly { id: string; titel: string; titelJe?: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> }[] = [
  { id: "grieks-latijn", titel: "Griekse en Latijnse wortels", titelJe: { de: "Griechische und lateinische Wurzeln", en: "Greek and Latin roots" } },
  { id: "frans", titel: "Woorden uit het Frans", titelJe: { de: "Wörter aus dem Französischen", en: "Words from French" } },
  { id: "engels", titel: "Woorden uit het Engels", titelJe: { de: "Wörter aus dem Englischen", en: "Words from English" } },
  { id: "ver-weg", titel: "Woorden van ver weg", titelJe: { de: "Wörter von weit her", en: "Words from far away" } },
  { id: "wereld", titel: "Nederlandse woorden in de wereld", titelJe: { de: "Niederländische Wörter in der Welt", en: "Dutch words around the world" } },
];

/** Die Paare je Stufe und Thema. */
export const WURZELN_NL: Record<WurzelStufeNl, WurzelThemaNl[]> = {
  kids: [
    {
      id: "grieks-latijn",
      titel: "Griekse en Latijnse wortels",
      paare: [
        { indizio: "je praat met iemand die ver weg is", parola: "telefoon", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/telefoon#Dutch" },
        { indizio: "reuzenhagedis van heel lang geleden", parola: "dinosaurus", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/dinosaurus#Dutch" },
        { indizio: "maakt heel kleine dingen groot", parola: "microscoop", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/microscoop#Dutch" },
        { indizio: "alle letters op een rij", parola: "alfabet", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/alfabet#Dutch" },
        { indizio: "draait om de zon, net als de aarde", parola: "planeet", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/planeet#Dutch" },
        { indizio: "boek vol landkaarten", parola: "atlas", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/atlas#Dutch" },
        { indizio: "veel muzikanten die samen spelen", parola: "orkest", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/orkest#Dutch" },
        { indizio: "reist met een raket naar de ruimte", parola: "astronaut", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/astronaut#Dutch" },
        { indizio: "gebouw waar je boeken leent", parola: "bibliotheek", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/bibliotheek#Dutch" },
        { indizio: "plaatje uit je camera", parola: "foto", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/foto#Dutch" },
        { indizio: "meubel waaraan je eet", parola: "tafel", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/tafel#Dutch" },
        { indizio: "wand van stenen", parola: "muur", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/muur#Dutch" },
        { indizio: "raam, vooral in Vlaanderen", parola: "venster", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/venster#Dutch" },
        { indizio: "geel en gemaakt van melk", parola: "kaas", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/kaas#Dutch" },
        { indizio: "weg tussen de huizen", parola: "straat", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/straat#Dutch" },
        { indizio: "ruimte onder het huis", parola: "kelder", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/kelder#Dutch" },
        { indizio: "kamer waar je kookt", parola: "keuken", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/keuken#Dutch" },
        { indizio: "je schrijft ermee met inkt", parola: "pen", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/pen#Dutch" },
        { indizio: "daar leer je lezen en schrijven", parola: "school", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/school#Dutch" },
        { indizio: "lijst met alle dagen van het jaar", parola: "kalender", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/kalender#Dutch" },
      ],
    },
    {
      id: "frans",
      titel: "Woorden uit het Frans",
      paare: [
        { indizio: "pakje dat je krijgt op je verjaardag", parola: "cadeau", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/cadeau#Dutch" },
        { indizio: "houdt je droog als het regent", parola: "paraplu", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/paraplu#Dutch" },
        { indizio: "bovenkant van een kamer", parola: "plafond", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/plafond#Dutch" },
        { indizio: "ander woord voor wc", parola: "toilet", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/toilet#Dutch" },
        { indizio: "tasje voor je geld", parola: "portemonnee", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/portemonnee#Dutch" },
        { indizio: "stoep naast de straat", parola: "trottoir", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/trottoir#Dutch" },
        { indizio: "huisje voor de auto", parola: "garage", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/garage#Dutch" },
        { indizio: "toetje na het eten", parola: "dessert", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/dessert#Dutch" },
        { indizio: "broodje in de vorm van een halve maan", parola: "croissant", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/croissant#Dutch" },
        { indizio: "daar ga je uit eten", parola: "restaurant", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/restaurant#Dutch" },
        { indizio: "gevuld met lucht, vliegt zo weg", parola: "ballon", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/ballon#Dutch" },
        { indizio: "tafel waaraan je huiswerk maakt", parola: "bureau", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/bureau#Dutch" },
        { indizio: "lijst met gerechten", parola: "menu", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/menu#Dutch" },
        { indizio: "verdieping van een gebouw", parola: "etage", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/etage#Dutch" },
        { indizio: "dank je, zo zeg je het vaak in Vlaanderen", parola: "merci", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/merci#Dutch" },
      ],
    },
    {
      id: "engels",
      titel: "Woorden uit het Engels",
      paare: [
        { indizio: "rekent en speelt filmpjes af", parola: "computer", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/computer#Dutch" },
        { indizio: "zo zeg je dat het je spijt", parola: "sorry", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/sorry#Dutch" },
        { indizio: "heel tof", parola: "cool", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/cool#Dutch" },
        { indizio: "spel op de computer", parola: "game", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/game#Dutch" },
        { indizio: "iets wat je graag doet in je vrije tijd", parola: "hobby", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/hobby#Dutch" },
        { indizio: "spelers die samen spelen", parola: "team", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/team#Dutch" },
        { indizio: "zaterdag en zondag", parola: "weekend", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/weekend#Dutch" },
        { indizio: "twee sneetjes brood met beleg", parola: "sandwich", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/sandwich#Dutch" },
        { indizio: "maïs die knalt als je hem verhit", parola: "popcorn", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/popcorn#Dutch" },
        { indizio: "pas geboren kindje", parola: "baby", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/baby#Dutch" },
        { indizio: "stukjes die je in elkaar legt", parola: "puzzel", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/puzzel#Dutch" },
        { indizio: "grappige artiest in het circus", parola: "clown", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/clown#Dutch" },
        { indizio: "voetbal, zwemmen of tennis", parola: "sport", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/sport#Dutch" },
        { indizio: "plank met wieltjes", parola: "skateboard", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/skateboard#Dutch" },
        { indizio: "dunne krokante schijfjes aardappel", parola: "chips", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/chips#Dutch" },
      ],
    },
    {
      id: "ver-weg",
      titel: "Woorden van ver weg",
      paare: [
        { indizio: "zoet en bruin, gemaakt van cacao", parola: "chocolade", origine: "Nahuatl", beleg: "https://en.wiktionary.org/wiki/chocolade#Dutch" },
        { indizio: "rode vrucht voor in de soep", parola: "tomaat", origine: "Nahuatl", beleg: "https://en.wiktionary.org/wiki/tomaat#Dutch" },
        { indizio: "bonen waar chocolade van komt", parola: "cacao", origine: "Nahuatl", beleg: "https://en.wiktionary.org/wiki/cacao#Dutch" },
        { indizio: "vrucht met een kroon van bladeren", parola: "ananas", origine: "Tupi", beleg: "https://en.wiktionary.org/wiki/ananas#Dutch" },
        { indizio: "springt en heeft een buidel", parola: "kangoeroe", origine: "Guugu Yimithirr", beleg: "https://en.wiktionary.org/wiki/kangoeroe#Dutch" },
        { indizio: "rode aap uit het regenwoud, mens van het bos", parola: "orang-oetan", origine: "Maleis", beleg: "https://en.wiktionary.org/wiki/orang-oetan#Dutch" },
        { indizio: "maakt je thee en limonade zoet", parola: "suiker", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/suiker#Dutch" },
        { indizio: "zure melk uit een bakje", parola: "yoghurt", origine: "Turks", beleg: "https://en.wiktionary.org/wiki/yoghurt#Dutch" },
        { indizio: "die trek je aan om te gaan slapen", parola: "pyjama", origine: "Perzisch", beleg: "https://en.wiktionary.org/wiki/pyjama#Dutch" },
        { indizio: "machine die zelf werk doet", parola: "robot", origine: "Tsjechisch", beleg: "https://en.wiktionary.org/wiki/robot#Dutch" },
        { indizio: "huis van sneeuw", parola: "iglo", origine: "Inuktitut", beleg: "https://en.wiktionary.org/wiki/iglo#Dutch" },
        { indizio: "smalle boot met een dek", parola: "kajak", origine: "Inuktitut", beleg: "https://en.wiktionary.org/wiki/kajak#Dutch" },
        { indizio: "sport waarbij je de ander op de mat werpt", parola: "judo", origine: "Japans", beleg: "https://en.wiktionary.org/wiki/judo#Dutch" },
        { indizio: "dier met een heel lange nek", parola: "giraf", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/giraf#Dutch" },
        { indizio: "zacht kussen op je bed", parola: "matras", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/matras#Dutch" },
      ],
    },
    {
      id: "wereld",
      titel: "Nederlandse woorden in de wereld",
      paare: [
        { indizio: "zoet hapje, in Amerika een cookie", parola: "koekje", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/cookie#English" },
        { indizio: "chef, in het Engels boss", parola: "baas", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/boss#English" },
        { indizio: "je glijdt ermee door de sneeuw, in het Engels sleigh", parola: "slee", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/sleigh#English" },
        { indizio: "brengt cadeautjes, in Amerika Santa Claus", parola: "Sinterklaas", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/Santa%20Claus#English" },
        { indizio: "luxe boot, in het Engels yacht", parola: "jacht", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/yacht#English" },
        { indizio: "trapje voor het huis, in New York stoop", parola: "stoep", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/stoop#English" },
        { indizio: "salade van kool, in het Engels coleslaw", parola: "koolsla", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/coleslaw#English" },
        { indizio: "glijdt over het ijs, in het Engels skate", parola: "schaats", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/skate#English" },
        { indizio: "koek met ruitjes, in het Engels waffle", parola: "wafel", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/waffle#English" },
        { indizio: "maakt het eten in een restaurant, in Japan kokku", parola: "kok", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/%E3%82%B3%E3%83%83%E3%82%AF#Japanese" },
        { indizio: "drijvende ijsklomp, in het Engels iceberg", parola: "ijsberg", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/iceberg#English" },
        { indizio: "baas op een boot, in het Engels skipper", parola: "schipper", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/skipper#English" },
        { indizio: "rek voor een schilderij, in het Engels easel", parola: "ezel", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/easel#English" },
        { indizio: "geest, in het Engels spook", parola: "spook", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/spook#English" },
        { indizio: "gummetje, in Japan gomu", parola: "gom", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/%E3%82%B4%E3%83%A0#Japanese" },
      ],
    },
  ],
  teens: [
    {
      id: "grieks-latijn",
      titel: "Griekse en Latijnse wortels",
      paare: [
        { indizio: "planten maken suiker met licht", parola: "fotosynthese", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/fotosynthese#Dutch" },
        { indizio: "leer van planten, dieren en hun omgeving", parola: "ecologie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/ecologie#Dutch" },
        { indizio: "het volk heeft de macht", parola: "democratie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/democratie#Dutch" },
        { indizio: "onderzoek naar resten van vroeger", parola: "archeologie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/archeologie#Dutch" },
        { indizio: "woord met dezelfde betekenis", parola: "synoniem", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/synoniem#Dutch" },
        { indizio: "leer van het leven", parola: "biologie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/biologie#Dutch" },
        { indizio: "aardrijkskunde", parola: "geografie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/geografie#Dutch" },
        { indizio: "meet de temperatuur", parola: "thermometer", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/thermometer#Dutch" },
        { indizio: "laag lucht rond de aarde", parola: "atmosfeer", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/atmosfeer#Dutch" },
        { indizio: "maakt je stem luider", parola: "microfoon", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/microfoon#Dutch" },
        { indizio: "bak met water voor vissen", parola: "aquarium", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/aquarium#Dutch" },
        { indizio: "handgeklap na een optreden", parola: "applaus", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/applaus#Dutch" },
        { indizio: "toets aan het eind van het jaar", parola: "examen", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/examen#Dutch" },
        { indizio: "Limburg of Zeeland, bijvoorbeeld", parola: "provincie", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/provincie#Dutch" },
        { indizio: "instelling voor wetenschappelijk onderwijs, zoals in Leuven", parola: "universiteit", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/universiteit#Dutch" },
        { indizio: "maakt je ziek of je computer kapot", parola: "virus", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/virus#Dutch" },
        { indizio: "filmpje, letterlijk: ik zie", parola: "video", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/video#Dutch" },
        { indizio: "geluid, letterlijk: ik hoor", parola: "audio", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/audio#Dutch" },
        { indizio: "boekje met je afspraken", parola: "agenda", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/agenda#Dutch" },
        { indizio: "dag, maand en jaar", parola: "datum", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/datum#Dutch" },
      ],
    },
    {
      id: "frans",
      titel: "Woorden uit het Frans",
      paare: [
        { indizio: "rijdt voor zijn werk een bus of een auto", parola: "chauffeur", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/chauffeur#Dutch" },
        { indizio: "koffers en tassen voor de reis", parola: "bagage", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/bagage#Dutch" },
        { indizio: "aandenken aan je vakantie", parola: "souvenir", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/souvenir#Dutch" },
        { indizio: "hoogte of moeilijkheidsgraad", parola: "niveau", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/niveau#Dutch" },
        { indizio: "hoe je je voelt, je stemming", parola: "humeur", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/humeur#Dutch" },
        { indizio: "spannende belevenis", parola: "avontuur", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/avontuur#Dutch" },
        { indizio: "je gunt een ander iets niet", parola: "jaloers", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/jaloers#Dutch" },
        { indizio: "lol en vreugde", parola: "plezier", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/plezier#Dutch" },
        { indizio: "speldje voor het prikbord", parola: "punaise", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/punaise#Dutch" },
        { indizio: "afspraakje", parola: "rendez-vous", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/rendez-vous#Dutch" },
        { indizio: "groot voertuig voor goederen, in Vlaanderen", parola: "camion", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/camion#Dutch" },
        { indizio: "leuk, in Vlaanderen", parola: "plezant", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/plezant#Dutch" },
        { indizio: "vervelend, in Vlaanderen", parola: "ambetant", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/ambetant#Dutch" },
        { indizio: "bij iemand blijven slapen", parola: "logeren", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/logeren#Dutch" },
        { indizio: "plek voor je jas in een zaal", parola: "garderobe", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/garderobe#Dutch" },
      ],
    },
    {
      id: "engels",
      titel: "Woorden uit het Engels",
      paare: [
        { indizio: "foto van jezelf", parola: "selfie", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/selfie#Dutch" },
        { indizio: "radioprogramma om te downloaden", parola: "podcast", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/podcast#Dutch" },
        { indizio: "uiterste datum om iets in te leveren", parola: "deadline", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/deadline#Dutch" },
        { indizio: "nieuwe versie van een app", parola: "update", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/update#Dutch" },
        { indizio: "woord met een hekje ervoor", parola: "hashtag", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/hashtag#Dutch" },
        { indizio: "sportschoen", parola: "sneaker", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/sneaker#Dutch" },
        { indizio: "live video bekijken via internet", parola: "streamen", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/streamen#Dutch" },
        { indizio: "spelletjes spelen op de computer", parola: "gamen", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/gamen#Dutch" },
        { indizio: "lekker relaxen met vrienden", parola: "chillen", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/chillen#Dutch" },
        { indizio: "bestand binnenhalen van internet", parola: "downloaden", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/downloaden#Dutch" },
        { indizio: "lijst met je favoriete nummers", parola: "playlist", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/playlist#Dutch" },
        { indizio: "iemand met veel volgers online", parola: "influencer", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/influencer#Dutch" },
        { indizio: "telefoon met apps", parola: "smartphone", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/smartphone#Dutch" },
        { indizio: "draagbare computer", parola: "laptop", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/laptop#Dutch" },
        { indizio: "verbonden met internet", parola: "online", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/online#Dutch" },
      ],
    },
    {
      id: "ver-weg",
      titel: "Woorden van ver weg",
      paare: [
        { indizio: "lang en bezorgd nadenken", parola: "piekeren", origine: "Maleis", beleg: "https://en.wiktionary.org/wiki/piekeren#Dutch" },
        { indizio: "durfal, iemand met lef", parola: "branie", origine: "Maleis", beleg: "https://en.wiktionary.org/wiki/branie#Dutch" },
        { indizio: "banaan, zoals ze in Indonesië zeggen", parola: "pisang", origine: "Maleis", beleg: "https://en.wiktionary.org/wiki/pisang#Dutch" },
        { indizio: "pittige saus van rode pepers", parola: "sambal", origine: "Maleis", beleg: "https://en.wiktionary.org/wiki/sambal#Dutch" },
        { indizio: "kleine winkel met Aziatische producten", parola: "toko", origine: "Maleis", beleg: "https://en.wiktionary.org/wiki/toko#Dutch" },
        { indizio: "rekenen met letters", parola: "algebra", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/algebra#Dutch" },
        { indizio: "stof waar je T-shirt van gemaakt is", parola: "katoen", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/katoen#Dutch" },
        { indizio: "opslagplaats voor goederen", parola: "magazijn", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/magazijn#Dutch" },
        { indizio: "kraampje met kranten en snoep", parola: "kiosk", origine: "Turks", beleg: "https://en.wiktionary.org/wiki/kiosk#Dutch" },
        { indizio: "bloem uit de Bollenstreek", parola: "tulp", origine: "Turks", beleg: "https://en.wiktionary.org/wiki/tulp#Dutch" },
        { indizio: "enorme golf na een zeebeving", parola: "tsunami", origine: "Japans", beleg: "https://en.wiktionary.org/wiki/tsunami#Dutch" },
        { indizio: "strip uit Japan", parola: "manga", origine: "Japans", beleg: "https://en.wiktionary.org/wiki/manga#Dutch" },
        { indizio: "plaatje in je berichtje", parola: "emoji", origine: "Japans", beleg: "https://en.wiktionary.org/wiki/emoji#Dutch" },
        { indizio: "geluk, zoals ze in Amsterdam zeggen", parola: "mazzel", origine: "Jiddisch", beleg: "https://en.wiktionary.org/wiki/mazzel#Dutch" },
        { indizio: "lange doek om je nek", parola: "sjaal", origine: "Perzisch", beleg: "https://en.wiktionary.org/wiki/sjaal#Dutch" },
      ],
    },
    {
      id: "wereld",
      titel: "Nederlandse woorden in de wereld",
      paare: [
        { indizio: "werkplek, in Indonesië kantor", parola: "kantoor", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/kantor#Indonesian" },
        { indizio: "je droogt je ermee af, in Indonesië handuk", parola: "handdoek", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/handuk#Indonesian" },
        { indizio: "houdt eten koud, in Indonesië kulkas", parola: "koelkast", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/kulkas#Indonesian" },
        { indizio: "filmzaal, in Indonesië bioskop", parola: "bioscoop", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/bioskop#Indonesian" },
        { indizio: "doorzichtig materiaal, in Japan garasu", parola: "glas", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/%E3%82%AC%E3%83%A9%E3%82%B9#Japanese" },
        { indizio: "pompt water of lucht, in Japan ponpu", parola: "pomp", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/%E3%83%9D%E3%83%B3%E3%83%97#Japanese" },
        { indizio: "dun metaal, in Japan buriki", parola: "blik", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/%E3%83%96%E3%83%AA%E3%82%AD#Japanese" },
        { indizio: "zeeman, in het Russisch matros", parola: "matroos", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/%D0%BC%D0%B0%D1%82%D1%80%D0%BE%D1%81#Russian" },
        { indizio: "plek voor schepen, in het Russisch gavan", parola: "haven", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/%D0%B3%D0%B0%D0%B2%D0%B0%D0%BD%D1%8C#Russian" },
        { indizio: "kleine boot, in het Engels sloop", parola: "sloep", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/sloop#English" },
        { indizio: "schilderij van de natuur, in het Engels landscape", parola: "landschap", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/landscape#English" },
        { indizio: "snelle tekening, in het Engels sketch", parola: "schets", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/sketch#English" },
        { indizio: "hendeltje waar je aan trekt, in het Engels trigger", parola: "trekker", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/trigger#English" },
        { indizio: "zout water voor augurken, in het Engels pickle", parola: "pekel", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/pickle#English" },
        { indizio: "vloer van een schip, in het Engels deck", parola: "dek", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/deck#English" },
      ],
    },
  ],
  erwachsen: [
    {
      id: "grieks-latijn",
      titel: "Griekse en Latijnse wortels",
      paare: [
        { indizio: "liefde voor wijsheid", parola: "filosofie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/filosofie#Dutch" },
        { indizio: "studie van de mens", parola: "antropologie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/antropologie#Dutch" },
        { indizio: "macht van een kleine groep", parola: "oligarchie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/oligarchie#Dutch" },
        { indizio: "staat met een koning", parola: "monarchie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/monarchie#Dutch" },
        { indizio: "verandering van gedaante", parola: "metamorfose", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/metamorfose#Dutch" },
        { indizio: "samenleven met voordeel voor beide", parola: "symbiose", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/symbiose#Dutch" },
        { indizio: "inleven in een ander", parola: "empathie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/empathie#Dutch" },
        { indizio: "veronderstelling die je nog moet toetsen", parola: "hypothese", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/hypothese#Dutch" },
        { indizio: "zelfbestuur, zelfstandigheid", parola: "autonomie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/autonomie#Dutch" },
        { indizio: "volgorde in de tijd", parola: "chronologie", origine: "Grieks", beleg: "https://en.wiktionary.org/wiki/chronologie#Dutch" },
        { indizio: "algemene overeenstemming", parola: "consensus", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/consensus#Dutch" },
        { indizio: "volksraadpleging", parola: "referendum", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/referendum#Dutch" },
        { indizio: "overzicht van je loopbaan", parola: "curriculum", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/curriculum#Dutch" },
        { indizio: "bewijs dat je ergens anders was", parola: "alibi", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/alibi#Dutch" },
        { indizio: "minimaal aantal aanwezigen om te stemmen", parola: "quorum", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/quorum#Dutch" },
        { indizio: "geld van de overheid voor een plan", parola: "subsidie", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/subsidie#Dutch" },
        { indizio: "lid van de regering, letterlijk: dienaar", parola: "minister", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/minister#Dutch" },
        { indizio: "verdedigt je voor de rechter", parola: "advocaat", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/advocaat#Dutch" },
        { indizio: "loon dat je maandelijks krijgt", parola: "salaris", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/salaris#Dutch" },
        { indizio: "maakt aktes op en bewaart testamenten", parola: "notaris", origine: "Latijn", beleg: "https://en.wiktionary.org/wiki/notaris#Dutch" },
      ],
    },
    {
      id: "frans",
      titel: "Woorden uit het Frans",
      paare: [
        { indizio: "gemakkelijke leunstoel", parola: "fauteuil", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/fauteuil#Dutch" },
        { indizio: "beleidsterrein van een minister", parola: "portefeuille", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/portefeuille#Dutch" },
        { indizio: "volksvertegenwoordiging", parola: "parlement", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/parlement#Dutch" },
        { indizio: "natuurlijke omgeving", parola: "milieu", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/milieu#Dutch" },
        { indizio: "vaste gewoonte, sleur", parola: "routine", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/routine#Dutch" },
        { indizio: "opzettelijk iets laten mislukken", parola: "sabotage", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/sabotage#Dutch" },
        { indizio: "overdreven trots op je eigen land", parola: "chauvinisme", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/chauvinisme#Dutch" },
        { indizio: "bloeitijd van kunst na de middeleeuwen", parola: "renaissance", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/renaissance#Dutch" },
        { indizio: "heldere soep van vlees of groente", parola: "bouillon", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/bouillon#Dutch" },
        { indizio: "ziekenfonds in Vlaanderen", parola: "mutualiteit", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/mutualiteit#Dutch" },
        { indizio: "frietkraam in Vlaanderen", parola: "frituur", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/frituur#Dutch" },
        { indizio: "gebakken eieren in de koekenpan", parola: "omelet", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/omelet#Dutch" },
        { indizio: "verbonden en klaar om te helpen", parola: "solidair", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/solidair#Dutch" },
        { indizio: "regels voor goede omgangsvormen", parola: "etiquette", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/etiquette#Dutch" },
        { indizio: "kleine groep die bovenaan staat", parola: "elite", origine: "Frans", beleg: "https://en.wiktionary.org/wiki/elite#Dutch" },
      ],
    },
    {
      id: "engels",
      titel: "Woorden uit het Engels",
      paare: [
        { indizio: "leidinggevende in een bedrijf", parola: "manager", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/manager#Dutch" },
        { indizio: "overleg op het werk", parola: "meeting", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/meeting#Dutch" },
        { indizio: "reactie op je werk", parola: "feedback", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/feedback#Dutch" },
        { indizio: "uitgeput door te veel stress", parola: "burn-out", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/burn-out#Dutch" },
        { indizio: "werkt zelfstandig voor opdrachtgevers", parola: "freelancer", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/freelancer#Dutch" },
        { indizio: "spanning en druk", parola: "stress", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/stress#Dutch" },
        { indizio: "vraaggesprek", parola: "interview", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/interview#Dutch" },
        { indizio: "bedrag dat je mag uitgeven", parola: "budget", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/budget#Dutch" },
        { indizio: "samen ideeën verzinnen", parola: "brainstormen", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/brainstormen#Dutch" },
        { indizio: "een auto huren voor lange tijd", parola: "leasen", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/leasen#Dutch" },
        { indizio: "jong en nieuw bedrijf", parola: "start-up", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/start-up#Dutch" },
        { indizio: "periode waarin iedereen thuis moest blijven", parola: "lockdown", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/lockdown#Dutch" },
        { indizio: "afval opnieuw gebruiken", parola: "recyclen", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/recyclen#Dutch" },
        { indizio: "korte cursus waarin je zelf aan de slag gaat", parola: "workshop", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/workshop#Dutch" },
        { indizio: "beïnvloeden van politici voor een belang", parola: "lobby", origine: "Engels", beleg: "https://en.wiktionary.org/wiki/lobby#Dutch" },
      ],
    },
    {
      id: "ver-weg",
      titel: "Woorden van ver weg",
      paare: [
        { indizio: "blindelings tekeergaan", parola: "amok", origine: "Maleis", beleg: "https://en.wiktionary.org/wiki/amok#Dutch" },
        { indizio: "ruziemaken, kibbelen", parola: "bakkeleien", origine: "Maleis", beleg: "https://en.wiktionary.org/wiki/bakkeleien#Dutch" },
        { indizio: "tevreden en op je gemak", parola: "senang", origine: "Maleis", beleg: "https://en.wiktionary.org/wiki/senang#Dutch" },
        { indizio: "vastgestelde prijs", parola: "tarief", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/tarief#Dutch" },
        { indizio: "hoogste rang bij de marine", parola: "admiraal", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/admiraal#Dutch" },
        { indizio: "voorraad wapens", parola: "arsenaal", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/arsenal#English" },
        { indizio: "nis voor een bed", parola: "alkoof", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/alkoof#Dutch" },
        { indizio: "bijnaam van Amsterdam", parola: "Mokum", origine: "Jiddisch", beleg: "https://en.wiktionary.org/wiki/Mokum#Dutch" },
        { indizio: "gevangenis, in de volkstaal", parola: "bajes", origine: "Jiddisch", beleg: "https://en.wiktionary.org/wiki/bajes#Dutch" },
        { indizio: "stelen, in de volkstaal", parola: "jatten", origine: "Jiddisch", beleg: "https://en.wiktionary.org/wiki/jatten#Dutch" },
        { indizio: "rijke en machtige zakenman", parola: "tycoon", origine: "Japans", beleg: "https://en.wiktionary.org/wiki/tycoon#Dutch" },
        { indizio: "lang gewaad met wijde mouwen", parola: "kimono", origine: "Japans", beleg: "https://en.wiktionary.org/wiki/kimono#Dutch" },
        { indizio: "huis zonder bovenverdieping", parola: "bungalow", origine: "Hindi", beleg: "https://en.wiktionary.org/wiki/bungalow#Dutch" },
        { indizio: "reis om wilde dieren te bekijken", parola: "safari", origine: "Swahili", beleg: "https://en.wiktionary.org/wiki/safari#Dutch" },
        { indizio: "zwarte drank van gebrande bonen", parola: "koffie", origine: "Arabisch", beleg: "https://en.wiktionary.org/wiki/koffie#Dutch" },
      ],
    },
    {
      id: "wereld",
      titel: "Nederlandse woorden in de wereld",
      paare: [
        { indizio: "brede laan, van het oude woord bolwerk", parola: "boulevard", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/boulevard#French" },
        { indizio: "linkerkant van een schip, in het Frans bâbord", parola: "bakboord", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/b%C3%A2bord#French" },
        { indizio: "varen op zee, in het Engels cruise", parola: "kruisen", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/cruise#English" },
        { indizio: "lading, in het Engels freight", parola: "vracht", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/freight#English" },
        { indizio: "val voor eenden, in het Engels decoy", parola: "eendenkooi", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/decoy#English" },
        { indizio: "draaikolk, in het Engels maelstrom", parola: "maalstroom", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/maelstrom#English" },
        { indizio: "oude zilveren munt, in het Engels dollar", parola: "daalder", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/dollar#English" },
        { indizio: "zware straf op zee, in het Engels keelhaul", parola: "kielhalen", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/keelhaul#English" },
        { indizio: "opstand, in het Engels uproar", parola: "oproer", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/uproar#English" },
        { indizio: "tekening in metaal bijten, in het Engels etch", parola: "etsen", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/etch#English" },
        { indizio: "iets stiekem over de grens brengen, in het Engels smuggle", parola: "smokkelen", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/smuggle#English" },
        { indizio: "voorkant van een schip, in het Engels bow", parola: "boeg", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/bow#English" },
        { indizio: "muziekinstrument met pijpen; in Japan is orugoru een speeldoos", parola: "orgel", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/%E3%82%AA%E3%83%AB%E3%82%B4%E3%83%BC%E3%83%AB#Japanese" },
        { indizio: "zonnescherm op een schip; in het Russisch is zontik een paraplu", parola: "zonnedek", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/%D0%B7%D0%BE%D0%BD%D1%82%D0%B8%D0%BA#Russian" },
        { indizio: "zwerver, in het Engels landlouper", parola: "landloper", origine: "Nederlands", beleg: "https://en.wiktionary.org/wiki/landlouper#English" },
      ],
    },
  ],
};

/** Der Name der Tippchallenge-Dateien je Bedienungssprache, mit `{i}` und `{n}` („Bulgarian word origins, alphabetical: file {i} of {n}"). */
export const WURZEL_CHALLENGE_TITEL_NL: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> = {
  de: "Herkunft niederländischer Wörter, alphabetisch: Datei {i} von {n}",
  en: "Dutch word origins, alphabetical: file {i} of {n}",
};

/** Die Zeile eines Paares: zuerst der Hinweis, dann das Wort. */
export function wurzelZeileNl(x: { indizio: string; parola: string }): string {
  return `${x.indizio} - ${x.parola}`;
}

/** Dieselben Wörter, alphabetisch nach dem Hinweis (Sortierung „nl-NL") - für die Tippchallenge, wie `KORENY_ABECEDNE`. */
export const WURZELN_NL_ALPHABETISCH: Record<WurzelStufeNl, string[]> = Object.fromEntries(
  (Object.keys(WURZELN_NL) as WurzelStufeNl[]).map((stufe) => [
    stufe,
    WURZELN_NL[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indizio.localeCompare(b.indizio, "nl-NL"))
      .map(wurzelZeileNl),
  ]),
) as Record<WurzelStufeNl, string[]>;
