/**
 * ★ G3c-VERTEILER (25.10.2026): DIE WURZEL-VORLAGE DES WEGES „ro" (Rumänisch) - woher die Wörter kommen, zum Abschreiben. Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `radiciIt.ts` (mit `beleg`) und `korenyCs.ts`: drei Altersstufen, Themen mit Paaren `<Hinweis> - <Wort>`. Die Feldnamen sind
 * die von `radiciIt.ts` (`indizio`, `parola`, `origine`, `beleg`) - genau die Schlüssel der Quelle, iCloud
 * `sprachen-2026-10-25/tf-fest-neu/ro/tf-fest-ro.json`: `wurzeln` (`{ kids, teens, erwachsen }`) und `wurzelKategorien` (die Themen).
 * `raetsel` dort ist KEINE Wurzel-Zeile (Rezept D „Befund raetsel") und gehört nicht hierher.
 *
 * Zeilenregeln (Wächter: `tests/tastenflow-lerndaten-ro.test.ts`, Vorbild `tastenflow-vorlage-koreny-cs`): höchstens 40 Zeichen,
 * genau ein ` - `, `parola` ein Einzelwort, klein, nicht im Hinweis; kein Wort doppelt; keine Sperrwörter (`sperrlisteRo.ts`); nur Zeichen
 * aller Tastaturen des Weges. Mengen: der Wächter misst die eigene Grösse (cs/it verlangen 80 je Stufe, die neuen Daten haben weniger).
 *
 * ★ D-LERNDATEN (25.10.2026): gefüllt aus `tf-fest-ro.json` (`wurzeln`, `wurzelKategorien`), geprüft im `PRUEFBERICHT.md`
 * desselben Ordners. Paare je Stufe: Kinder 63, Jugend 62, Erwachsene 63 (Ziel wie cs/it: 80 - der
 * Wächter führt die gelieferte Menge als benannte Mindestzahl). Die Themen-Namen auf Deutsch und Englisch (`titelJe`) sind in
 * D-LERNDATEN übersetzt (die übrigen Bedienungen lesen das Englische). `raetsel` (240 Zeilen) ist NICHT eingehängt - es hat im
 * Code keinen Platz (Rezept D, Erkenntnis 3; Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * Wächter: `tests/tastenflow-lerndaten-ro.test.ts`.
 *
 * Verteiler: `vorlagen.ts` (`GERUEST_WURZELN`, Art `"wortherkunft"`; Gruppe in `EigenerTextQuelle.tsx`). Solange {@link WURZEL_THEMEN_RO}
 * leer ist, gibt es KEINE Vorlage (weder „Eigene Übung" noch Tippchallenge); mit dem ersten Thema erscheint sie für Weg UND Übungssprache „ro".
 *
 * ⚠️ DATENBLATT: nur `import type`, kein Code-Import.
 */

export type WurzelStufeRo = "kids" | "teens" | "erwachsen";

/** Woher ein Wort kommt - GESCHLOSSENE Liste (gemessen in `tf-fest-ro.json`, 25.10.2026); nur für die Lehrkraft, wird nicht abgetippt. */
export type WurzelOrigineRo = "franceză" | "germană" | "latină" | "maghiară" | "slavă" | "turcă";

export interface WurzelPaarRo {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  indizio: string;
  /** Das Wort selbst - ein Einzelwort, klein. */
  parola: string;
  origine: WurzelOrigineRo;
  /** Wo die Herkunft nachgelesen wurde (Quelle aus `tf-fest`, z. B. eine Wiktionary-Seite). */
  beleg: string;
}

export interface WurzelThemaRo {
  id: string;
  titel: string;
  paare: WurzelPaarRo[];
}

/** Die Themen (aus `wurzelKategorien`): `titel` in Rumänisch, `titelJe` der Name in den Bedienungssprachen (fehlt einer: englisch, sonst `titel`). */
export const WURZEL_THEMEN_RO: readonly { id: string; titel: string; titelJe?: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> }[] = [
  { id: "latina", titel: "Cuvinte moștenite din latină", titelJe: { de: "Aus dem Lateinischen ererbte Wörter", en: "Words inherited from Latin" } },
  { id: "slava", titel: "Cuvinte venite din slavă", titelJe: { de: "Wörter aus dem Slawischen", en: "Words from Slavic" } },
  { id: "turca", titel: "Cuvinte venite din turcă", titelJe: { de: "Wörter aus dem Türkischen", en: "Words from Turkish" } },
  { id: "franceza", titel: "Cuvinte venite din franceză", titelJe: { de: "Wörter aus dem Französischen", en: "Words from French" } },
  { id: "maghiara-germana", titel: "Cuvinte din maghiară și germană", titelJe: { de: "Wörter aus dem Ungarischen und Deutschen", en: "Words from Hungarian and German" } },
];

/** Die Paare je Stufe und Thema. */
export const WURZELN_RO: Record<WurzelStufeRo, WurzelThemaRo[]> = {
  kids: [
    {
      id: "latina",
      titel: "Cuvinte moștenite din latină",
      paare: [
        { indizio: "o bei când îți este sete", parola: "apă", origine: "latină", beleg: "https://en.wiktionary.org/wiki/apă#Romanian" },
        { indizio: "o mănânci cu ciorba, la orice masă", parola: "pâine", origine: "latină", beleg: "https://en.wiktionary.org/wiki/pâine#Romanian" },
        { indizio: "luminează cerul noaptea", parola: "lună", origine: "latină", beleg: "https://en.wiktionary.org/wiki/lună#Romanian" },
        { indizio: "ne încălzește ziua", parola: "soare", origine: "latină", beleg: "https://en.wiktionary.org/wiki/soare#Romanian" },
        { indizio: "prietenul care latră", parola: "câine", origine: "latină", beleg: "https://en.wiktionary.org/wiki/câine#Romanian" },
        { indizio: "animalul care nechează", parola: "cal", origine: "latină", beleg: "https://en.wiktionary.org/wiki/cal#Romanian" },
        { indizio: "cu ei vezi lumea", parola: "ochi", origine: "latină", beleg: "https://en.wiktionary.org/wiki/ochi#Romanian" },
        { indizio: "îl bei dimineața, alb și cald", parola: "lapte", origine: "latină", beleg: "https://en.wiktionary.org/wiki/lapte#Romanian" },
        { indizio: "băiatul cu aceiași părinți ca tine", parola: "frate", origine: "latină", beleg: "https://en.wiktionary.org/wiki/frate#Romanian" },
        { indizio: "e albastru când e senin", parola: "cer", origine: "latină", beleg: "https://en.wiktionary.org/wiki/cer#Romanian" },
        { indizio: "arde în sobă", parola: "foc", origine: "latină", beleg: "https://en.wiktionary.org/wiki/foc#Romanian" },
        { indizio: "îl simți când bate", parola: "vânt", origine: "latină", beleg: "https://en.wiktionary.org/wiki/vânt#Romanian" },
        { indizio: "se învârte sub bicicletă sau căruță", parola: "roată", origine: "latină", beleg: "https://en.wiktionary.org/wiki/roată#Romanian" },
        { indizio: "o citești seara", parola: "carte", origine: "latină", beleg: "https://en.wiktionary.org/wiki/carte#Romanian" },
        { indizio: "are cinci degete", parola: "mână", origine: "latină", beleg: "https://en.wiktionary.org/wiki/mână#Romanian" },
      ],
    },
    {
      id: "slava",
      titel: "Cuvinte venite din slavă",
      paare: [
        { indizio: "cel cu care te joci și împarți secrete", parola: "prieten", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/prieten#Romanian" },
        { indizio: "arată ora", parola: "ceas", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/ceas#Romanian" },
        { indizio: "din ea se fac sticle și ferestre", parola: "sticlă", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/sticlă#Romanian" },
        { indizio: "acolo cresc flori și legume", parola: "grădină", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/grădină#Romanian" },
        { indizio: "sună în turnul bisericii", parola: "clopot", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/clopot#Romanian" },
        { indizio: "cu ea sapi în grădină", parola: "lopată", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/lopată#Romanian" },
        { indizio: "sare din copac în copac și adună alune", parola: "veveriță", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/veveriță#Romanian" },
        { indizio: "merge înapoi și are clești", parola: "rac", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/rac#Romanian" },
        { indizio: "e mai mic decât muntele", parola: "deal", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/deal#Romanian" },
        { indizio: "perete gros de piatră", parola: "zid", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/zid#Romanian" },
        { indizio: "pâine rotundă, împletită", parola: "colac", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/colac#Romanian" },
        { indizio: "se pune pe papanași", parola: "smântână", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/smântână#Romanian" },
      ],
    },
    {
      id: "turca",
      titel: "Cuvinte venite din turcă",
      paare: [
        { indizio: "supă acrișoară", parola: "ciorbă", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/ciorbă#Romanian" },
        { indizio: "încălțăminte de casă", parola: "papuc", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/papuc#Romanian" },
        { indizio: "în ea păstrezi jucăriile", parola: "cutie", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/cutie#Romanian" },
        { indizio: "în el ții hainele", parola: "dulap", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/dulap#Romanian" },
        { indizio: "e deasupra capului, în cameră", parola: "tavan", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/tavan#Romanian" },
        { indizio: "cu el aprinzi lumânarea", parola: "chibrit", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/chibrit#Romanian" },
        { indizio: "lapte acru și gros", parola: "iaurt", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/iaurt#Romanian" },
        { indizio: "prăjitură cu nucă și sirop", parola: "baclava", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/baclava#Romanian" },
        { indizio: "păzește oile", parola: "cioban", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/cioban#Romanian" },
        { indizio: "se întinde pe pat", parola: "cearșaf", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/cearșaf#Romanian" },
        { indizio: "bilă de carne tocată, prăjită", parola: "chiftea", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/chiftea#Romanian" },
        { indizio: "floare de primăvară, ca un pahar", parola: "lalea", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/lalea#Romanian" },
      ],
    },
    {
      id: "franceza",
      titel: "Cuvinte venite din franceză",
      paare: [
        { indizio: "dulciuri învelite în hârtie", parola: "bomboană", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/bomboană#Romanian" },
        { indizio: "are două roți și pedale", parola: "bicicletă", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/bicicletă#Romanian" },
        { indizio: "zboară cu pasagerii", parola: "avion", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/avion#Romanian" },
        { indizio: "merge pe șine", parola: "tren", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/tren#Romanian" },
        { indizio: "acolo dorm mașinile", parola: "garaj", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/garaj#Romanian" },
        { indizio: "nisip lângă mare", parola: "plajă", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/plajă#Romanian" },
        { indizio: "în ea se pun hainele când pleci în vacanță", parola: "valiză", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/valiză#Romanian" },
        { indizio: "haină pentru picioare, cu două crăcii", parola: "pantalon", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/pantalon#Romanian" },
        { indizio: "scaun moale cu brațe", parola: "fotoliu", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/fotoliu#Romanian" },
        { indizio: "pe el vezi filme", parola: "ecran", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/ecran#Romanian" },
        { indizio: "masa la care scrii", parola: "birou", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/birou#Romanian" },
        { indizio: "conduce mașina", parola: "șofer", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/șofer#Romanian" },
      ],
    },
    {
      id: "maghiara-germana",
      titel: "Cuvinte din maghiară și germană",
      paare: [
        { indizio: "mai mare decât un sat", parola: "oraș", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/oraș#Romanian" },
        { indizio: "ce îți trece prin minte", parola: "gând", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/gând#Romanian" },
        { indizio: "fața cuiva, în poze și povești", parola: "chip", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/chip#Romanian" },
        { indizio: "granița dintre două locuri", parola: "hotar", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/hotar#Romanian" },
        { indizio: "cel care te primește în casă", parola: "gazdă", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/gazdă#Romanian" },
        { indizio: "om priceput la o meserie", parola: "meșter", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/meșter#Romanian" },
        { indizio: "legumă din care se fac piureul și cartofii prăjiți", parola: "cartof", origine: "germană", beleg: "https://en.wiktionary.org/wiki/cartof#Romanian" },
        { indizio: "carne pane, crocantă", parola: "șnițel", origine: "germană", beleg: "https://en.wiktionary.org/wiki/șnițel#Romanian" },
        { indizio: "geantă de spate pentru excursii", parola: "rucsac", origine: "germană", beleg: "https://en.wiktionary.org/wiki/rucsac#Romanian" },
        { indizio: "piscină în aer liber, vara", parola: "ștrand", origine: "germană", beleg: "https://en.wiktionary.org/wiki/ștrand#Romanian" },
        { indizio: "se înșurubează cu șurubelnița", parola: "șurub", origine: "germană", beleg: "https://en.wiktionary.org/wiki/șurub#Romanian" },
        { indizio: "face găuri în perete", parola: "bormașină", origine: "germană", beleg: "https://en.wiktionary.org/wiki/bormașină#Romanian" },
      ],
    },
  ],
  teens: [
    {
      id: "latina",
      titel: "Cuvinte moștenite din latină",
      paare: [
        { indizio: "bate în piept", parola: "inimă", origine: "latină", beleg: "https://en.wiktionary.org/wiki/inimă#Romanian" },
        { indizio: "tot ce există în jurul nostru", parola: "lume", origine: "latină", beleg: "https://en.wiktionary.org/wiki/lume#Romanian" },
        { indizio: "planeta noastră, sau solul de sub picioare", parola: "pământ", origine: "latină", beleg: "https://en.wiktionary.org/wiki/pământ#Romanian" },
        { indizio: "îl fredonezi când ești vesel", parola: "cântec", origine: "latină", beleg: "https://en.wiktionary.org/wiki/cântec#Romanian" },
        { indizio: "persoană adultă, opusul bărbatului", parola: "femeie", origine: "latină", beleg: "https://en.wiktionary.org/wiki/femeie#Romanian" },
        { indizio: "conducătorul unui imperiu", parola: "împărat", origine: "latină", beleg: "https://en.wiktionary.org/wiki/împărat#Romanian" },
        { indizio: "curge prin vene", parola: "sânge", origine: "latină", beleg: "https://en.wiktionary.org/wiki/sânge#Romanian" },
        { indizio: "mâna are cinci", parola: "deget", origine: "latină", beleg: "https://en.wiktionary.org/wiki/deget#Romanian" },
        { indizio: "cu ea auzi", parola: "ureche", origine: "latină", beleg: "https://en.wiktionary.org/wiki/ureche#Romanian" },
        { indizio: "culoarea ierbii", parola: "verde", origine: "latină", beleg: "https://en.wiktionary.org/wiki/verde#Romanian" },
        { indizio: "opusul lui cald", parola: "rece", origine: "latină", beleg: "https://en.wiktionary.org/wiki/rece#Romanian" },
        { indizio: "aduce ploaia pe cer", parola: "nor", origine: "latină", beleg: "https://en.wiktionary.org/wiki/nor#Romanian" },
        { indizio: "strălucește pe cerul nopții", parola: "stea", origine: "latină", beleg: "https://en.wiktionary.org/wiki/stea#Romanian" },
        { indizio: "îl spui sau îl scrii", parola: "cuvânt", origine: "latină", beleg: "https://en.wiktionary.org/wiki/cuvânt#Romanian" },
      ],
    },
    {
      id: "slava",
      titel: "Cuvinte venite din slavă",
      paare: [
        { indizio: "sentimentul dintre doi îndrăgostiți", parola: "dragoste", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/dragoste#Romanian" },
        { indizio: "vocea cuiva", parola: "glas", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/glas#Romanian" },
        { indizio: "afară e frumoasă sau urâtă", parola: "vreme", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/vreme#Romanian" },
        { indizio: "corpul omului", parola: "trup", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/trup#Romanian" },
        { indizio: "opusul păcii", parola: "război", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/război#Romanian" },
        { indizio: "opusul lui gras", parola: "slab", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/slab#Romanian" },
        { indizio: "are mulți bani", parola: "bogat", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/bogat#Romanian" },
        { indizio: "cel mai înalt punct al muntelui", parola: "vârf", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/vârf#Romanian" },
        { indizio: "ține sârmele de curent", parola: "stâlp", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/stâlp#Romanian" },
        { indizio: "unealtă cu care se ară pământul", parola: "plug", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/plug#Romanian" },
        { indizio: "unealtă cu care se cosește iarba", parola: "coasă", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/coasă#Romanian" },
        { indizio: "animal mic care sapă tuneluri", parola: "cârtiță", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/cârtiță#Romanian" },
      ],
    },
    {
      id: "turca",
      titel: "Cuvinte venite din turcă",
      paare: [
        { indizio: "băutură caldă care te trezește dimineața", parola: "cafea", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/cafea#Romanian" },
        { indizio: "oaspete venit în vizită", parola: "musafir", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/musafir#Romanian" },
        { indizio: "sticla ferestrei", parola: "geam", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/geam#Romanian" },
        { indizio: "pânză care acoperă fereastra", parola: "perdea", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/perdea#Romanian" },
        { indizio: "cu el se cântărește", parola: "cântar", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/cântar#Romanian" },
        { indizio: "vas mare în care se fierbe", parola: "cazan", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/cazan#Romanian" },
        { indizio: "dovleac mare", parola: "bostan", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/bostan#Romanian" },
        { indizio: "legume proaspete din piață", parola: "zarzavat", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/zarzavat#Romanian" },
        { indizio: "opusul lui curat", parola: "murdar", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/murdar#Romanian" },
        { indizio: "cel care cară bagaje grele", parola: "hamal", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/hamal#Romanian" },
        { indizio: "pe ea se coace prăjitura", parola: "tavă", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/tavă#Romanian" },
        { indizio: "floare parfumată de primăvară, cu ciorchine", parola: "zambilă", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/zambilă#Romanian" },
      ],
    },
    {
      id: "franceza",
      titel: "Cuvinte venite din franceză",
      paare: [
        { indizio: "aici mănânci și plătești nota", parola: "restaurant", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/restaurant#Romanian" },
        { indizio: "lista cu feluri de mâncare", parola: "meniu", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/meniu#Romanian" },
        { indizio: "valizele cu care călătorești", parola: "bagaj", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/bagaj#Romanian" },
        { indizio: "miros plăcut dintr-o sticluță", parola: "parfum", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/parfum#Romanian" },
        { indizio: "haină ușoară pentru partea de sus", parola: "bluză", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/bluză#Romanian" },
        { indizio: "vehicul cu patru roți", parola: "mașină", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/mașină#Romanian" },
        { indizio: "stradă mare și lată", parola: "bulevard", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/bulevard#Romanian" },
        { indizio: "parte a unui oraș", parola: "cartier", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/cartier#Romanian" },
        { indizio: "loc în gară unde aștepți trenul", parola: "peron", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/peron#Romanian" },
        { indizio: "îl cumperi ca să intri la film", parola: "bilet", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/bilet#Romanian" },
        { indizio: "flori legate împreună", parola: "buchet", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/buchet#Romanian" },
        { indizio: "culoare pentru buze", parola: "ruj", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/ruj#Romanian" },
      ],
    },
    {
      id: "maghiara-germana",
      titel: "Cuvinte din maghiară și germană",
      paare: [
        { indizio: "familia largă, rudele", parola: "neam", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/neam#Romanian" },
        { indizio: "taxa plătită la graniță", parola: "vamă", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/vamă#Romanian" },
        { indizio: "lucrurile vândute în magazin", parola: "marfă", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/marfă#Romanian" },
        { indizio: "din toate, din plin", parola: "belșug", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/belșug#Romanian" },
        { indizio: "suferință mare", parola: "chin", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/chin#Romanian" },
        { indizio: "movilă mică de pământ", parola: "dâmb", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/dâmb#Romanian" },
        { indizio: "îl bagi în priză", parola: "ștecher", origine: "germană", beleg: "https://en.wiktionary.org/wiki/ștecher#Romanian" },
        { indizio: "pe ea merge trenul", parola: "șină", origine: "germană", beleg: "https://en.wiktionary.org/wiki/șină#Romanian" },
        { indizio: "cântec la modă", parola: "șlagăr", origine: "germană", beleg: "https://en.wiktionary.org/wiki/șlagăr#Romanian" },
        { indizio: "servește la masă în restaurant", parola: "chelner", origine: "germană", beleg: "https://en.wiktionary.org/wiki/chelner#Romanian" },
        { indizio: "cârnăciori fierți, cu muștar", parola: "crenvurșt", origine: "germană", beleg: "https://en.wiktionary.org/wiki/crenvurșt#Romanian" },
        { indizio: "prăjitură cu mere, rulată", parola: "ștrudel", origine: "germană", beleg: "https://en.wiktionary.org/wiki/ștrudel#Romanian" },
      ],
    },
  ],
  erwachsen: [
    {
      id: "latina",
      titel: "Cuvinte moștenite din latină",
      paare: [
        { indizio: "regulă votată de parlament", parola: "lege", origine: "latină", beleg: "https://en.wiktionary.org/wiki/lege#Romanian" },
        { indizio: "formula de adresare pentru un bărbat", parola: "domn", origine: "latină", beleg: "https://en.wiktionary.org/wiki/domn#Romanian" },
        { indizio: "om în vârstă", parola: "bătrân", origine: "latină", beleg: "https://en.wiktionary.org/wiki/bătrân#Romanian" },
        { indizio: "opusul războiului", parola: "pace", origine: "latină", beleg: "https://en.wiktionary.org/wiki/pace#Romanian" },
        { indizio: "conducătorul unui regat", parola: "rege", origine: "latină", beleg: "https://en.wiktionary.org/wiki/rege#Romanian" },
        { indizio: "îl scrii pe formular, primul rând", parola: "nume", origine: "latină", beleg: "https://en.wiktionary.org/wiki/nume#Romanian" },
        { indizio: "ceasul îl măsoară", parola: "timp", origine: "latină", beleg: "https://en.wiktionary.org/wiki/timp#Romanian" },
        { indizio: "prin ea intră lumina în casă", parola: "fereastră", origine: "latină", beleg: "https://en.wiktionary.org/wiki/fereastră#Romanian" },
        { indizio: "opusul lui nou", parola: "vechi", origine: "latină", beleg: "https://en.wiktionary.org/wiki/vechi#Romanian" },
        { indizio: "așezare la țară, cu case și ulițe", parola: "sat", origine: "latină", beleg: "https://en.wiktionary.org/wiki/sat#Romanian" },
        { indizio: "zi de bucurie și odihnă", parola: "sărbătoare", origine: "latină", beleg: "https://en.wiktionary.org/wiki/sărbătoare#Romanian" },
        { indizio: "patria, statul", parola: "țară", origine: "latină", beleg: "https://en.wiktionary.org/wiki/țară#Romanian" },
        { indizio: "fortăreață cu ziduri", parola: "cetate", origine: "latină", beleg: "https://en.wiktionary.org/wiki/cetate#Romanian" },
        { indizio: "musafir, invitat", parola: "oaspete", origine: "latină", beleg: "https://en.wiktionary.org/wiki/oaspete#Romanian" },
        { indizio: "cel care locuiește lângă tine", parola: "vecin", origine: "latină", beleg: "https://en.wiktionary.org/wiki/vecin#Romanian" },
      ],
    },
    {
      id: "slava",
      titel: "Cuvinte venite din slavă",
      paare: [
        { indizio: "speranță", parola: "nădejde", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/nădejde#Romanian" },
        { indizio: "lucrul de fiecare zi, pentru salariu", parola: "muncă", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/muncă#Romanian" },
        { indizio: "care durează mereu", parola: "veșnic", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/veșnic#Romanian" },
        { indizio: "tristețe adâncă", parola: "jale", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/jale#Romanian" },
        { indizio: "cameră sub casă pentru provizii", parola: "pivniță", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/pivniță#Romanian" },
        { indizio: "soție, în graiul popular", parola: "nevastă", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/nevastă#Romanian" },
        { indizio: "secret", parola: "taină", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/taină#Romanian" },
        { indizio: "compasiune", parola: "milă", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/milă#Romanian" },
        { indizio: "ciur des pentru cernut făina", parola: "sită", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/sită#Romanian" },
        { indizio: "tradiție, deprindere", parola: "obicei", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/obicei#Romanian" },
        { indizio: "locul unde apa iese din pământ", parola: "izvor", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/izvor#Romanian" },
        { indizio: "pragul ușii, prima treaptă", parola: "prag", origine: "slavă", beleg: "https://en.wiktionary.org/wiki/prag#Romanian" },
      ],
    },
    {
      id: "turca",
      titel: "Cuvinte venite din turcă",
      paare: [
        { indizio: "căsuță mică unde se vând ziare și flori", parola: "chioșc", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/chioșc#Romanian" },
        { indizio: "pridvor, terasă la o casă veche", parola: "cerdac", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/cerdac#Romanian" },
        { indizio: "batic purtat pe cap", parola: "basma", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/basma#Romanian" },
        { indizio: "cartier sărac de la marginea orașului", parola: "mahala", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/mahala#Romanian" },
        { indizio: "fântână cu robinet la drum", parola: "cișmea", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/cișmea#Romanian" },
        { indizio: "cărămidă din lut nears și paie", parola: "chirpici", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/chirpici#Romanian" },
        { indizio: "meșter care face acoperișuri din lemn", parola: "dulgher", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/dulgher#Romanian" },
        { indizio: "vas mic pentru fiert cafeaua", parola: "ibric", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/ibric#Romanian" },
        { indizio: "pavaj din piatră", parola: "caldarâm", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/caldarâm#Romanian" },
        { indizio: "masa din magazin la care se plătește", parola: "tejghea", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/tejghea#Romanian" },
        { indizio: "cumpărătură foarte ieftină", parola: "chilipir", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/chilipir#Romanian" },
        { indizio: "lemn tăiat pentru construcții", parola: "cherestea", origine: "turcă", beleg: "https://en.wiktionary.org/wiki/cherestea#Romanian" },
      ],
    },
    {
      id: "franceza",
      titel: "Cuvinte venite din franceză",
      paare: [
        { indizio: "lipsa unui loc de muncă", parola: "șomaj", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/șomaj#Romanian" },
        { indizio: "partea străzii pentru pietoni", parola: "trotuar", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/trotuar#Romanian" },
        { indizio: "fereastra unde ești servit la instituție", parola: "ghișeu", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/ghișeu#Romanian" },
        { indizio: "haină lungă și subțire de primăvară", parola: "pardesiu", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/pardesiu#Romanian" },
        { indizio: "acoperă becul veiozei", parola: "abajur", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/abajur#Romanian" },
        { indizio: "costum de damă cu sacou și fustă", parola: "taior", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/taior#Romanian" },
        { indizio: "mapă cu acte", parola: "dosar", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/dosar#Romanian" },
        { indizio: "lift", parola: "ascensor", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/ascensor#Romanian" },
        { indizio: "plată pentru un serviciu lunar sau anual", parola: "abonament", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/abonament#Romanian" },
        { indizio: "cel care conduce o afacere proprie", parola: "antreprenor", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/antreprenor#Romanian" },
        { indizio: "locul unde se lasă hainele la teatru", parola: "garderobă", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/garderobă#Romanian" },
        { indizio: "reprezentanța unei țări în străinătate", parola: "ambasadă", origine: "franceză", beleg: "https://en.wiktionary.org/wiki/ambasadă#Romanian" },
      ],
    },
    {
      id: "maghiara-germana",
      titel: "Cuvinte din maghiară și germană",
      paare: [
        { indizio: "încuie poarta", parola: "lacăt", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/lacăt#Romanian" },
        { indizio: "cinste după o vânzare reușită", parola: "aldămaș", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/aldămaș#Romanian" },
        { indizio: "adăpost, locuință", parola: "sălaș", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/sălaș#Romanian" },
        { indizio: "vas mare de lemn, cu toartă", parola: "hârdău", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/hârdău#Romanian" },
        { indizio: "cel care garantează pentru altul", parola: "chezaș", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/chezaș#Romanian" },
        { indizio: "șiret, care înșală", parola: "viclean", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/viclean#Romanian" },
        { indizio: "sfoară subțire", parola: "șnur", origine: "germană", beleg: "https://en.wiktionary.org/wiki/șnur#Romanian" },
        { indizio: "barjă trasă pe fluviu", parola: "șlep", origine: "germană", beleg: "https://en.wiktionary.org/wiki/șlep#Romanian" },
        { indizio: "lumina aparatului foto", parola: "bliț", origine: "germană", beleg: "https://en.wiktionary.org/wiki/bliț#Romanian" },
        { indizio: "inel de metal pus sub piuliță", parola: "șaibă", origine: "germană", beleg: "https://en.wiktionary.org/wiki/șaibă#Romanian" },
        { indizio: "a promite", parola: "făgădui", origine: "maghiară", beleg: "https://en.wiktionary.org/wiki/făgădui#Romanian" },
        { indizio: "frumos, plăcut, în vorbirea ardelenilor", parola: "fain", origine: "germană", beleg: "https://en.wiktionary.org/wiki/fain#Romanian" },
      ],
    },
  ],
};

/** Der Name der Tippchallenge-Dateien je Bedienungssprache, mit `{i}` und `{n}` („Bulgarian word origins, alphabetical: file {i} of {n}"). */
export const WURZEL_CHALLENGE_TITEL_RO: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> = {
  de: "Herkunft rumänischer Wörter, alphabetisch: Datei {i} von {n}",
  en: "Romanian word origins, alphabetical: file {i} of {n}",
};

/** Die Zeile eines Paares: zuerst der Hinweis, dann das Wort. */
export function wurzelZeileRo(x: { indizio: string; parola: string }): string {
  return `${x.indizio} - ${x.parola}`;
}

/** Dieselben Wörter, alphabetisch nach dem Hinweis (Sortierung „ro-RO") - für die Tippchallenge, wie `KORENY_ABECEDNE`. */
export const WURZELN_RO_ALPHABETISCH: Record<WurzelStufeRo, string[]> = Object.fromEntries(
  (Object.keys(WURZELN_RO) as WurzelStufeRo[]).map((stufe) => [
    stufe,
    WURZELN_RO[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indizio.localeCompare(b.indizio, "ro-RO"))
      .map(wurzelZeileRo),
  ]),
) as Record<WurzelStufeRo, string[]>;
