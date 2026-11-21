/**
 * ★ G3c-VERTEILER (25.10.2026): DIE WURZEL-VORLAGE DES WEGES „hu" (Ungarisch) - woher die Wörter kommen, zum Abschreiben. Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `radiciIt.ts` (mit `beleg`) und `korenyCs.ts`: drei Altersstufen, Themen mit Paaren `<Hinweis> - <Wort>`. Die Feldnamen sind
 * die von `radiciIt.ts` (`indizio`, `parola`, `origine`, `beleg`) - genau die Schlüssel der Quelle, iCloud
 * `sprachen-2026-10-25/tf-fest-neu/hu/tf-fest-hu.json`: `wurzeln` (`{ kids, teens, erwachsen }`) und `wurzelKategorien` (die Themen).
 * `raetsel` dort ist KEINE Wurzel-Zeile (Rezept D „Befund raetsel") und gehört nicht hierher.
 *
 * Zeilenregeln (Wächter: `tests/tastenflow-lerndaten-hu.test.ts`, Vorbild `tastenflow-vorlage-koreny-cs`): höchstens 40 Zeichen,
 * genau ein ` - `, `parola` ein Einzelwort, klein, nicht im Hinweis; kein Wort doppelt; keine Sperrwörter (`sperrlisteHu.ts`); nur Zeichen
 * aller Tastaturen des Weges. Mengen: der Wächter misst die eigene Grösse (cs/it verlangen 80 je Stufe, die neuen Daten haben weniger).
 *
 * ★ D-LERNDATEN (25.10.2026): gefüllt aus `tf-fest-hu.json` (`wurzeln`, `wurzelKategorien`), geprüft im `PRUEFBERICHT.md`
 * desselben Ordners. Paare je Stufe: Kinder 75, Jugend 75, Erwachsene 75 (Ziel wie cs/it: 80 - der
 * Wächter führt die gelieferte Menge als benannte Mindestzahl). Die Themen-Namen auf Deutsch und Englisch (`titelJe`) sind in
 * D-LERNDATEN übersetzt (die übrigen Bedienungen lesen das Englische). `raetsel` (240 Zeilen) ist NICHT eingehängt - es hat im
 * Code keinen Platz (Rezept D, Erkenntnis 3; Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * Wächter: `tests/tastenflow-lerndaten-hu.test.ts`.
 *
 * Verteiler: `vorlagen.ts` (`GERUEST_WURZELN`, Art `"wortherkunft"`; Gruppe in `EigenerTextQuelle.tsx`). Solange {@link WURZEL_THEMEN_HU}
 * leer ist, gibt es KEINE Vorlage (weder „Eigene Übung" noch Tippchallenge); mit dem ersten Thema erscheint sie für Weg UND Übungssprache „hu".
 *
 * ⚠️ DATENBLATT: nur `import type`, kein Code-Import.
 */

export type WurzelStufeHu = "kids" | "teens" | "erwachsen";

/** Woher ein Wort kommt - GESCHLOSSENE Liste (gemessen in `tf-fest-hu.json`, 25.10.2026); nur für die Lehrkraft, wird nicht abgetippt. */
export type WurzelOrigineHu = "bolgár" | "finnugor" | "germán" | "görög" | "iráni" | "latin" | "német" | "német mintára" | "oszmán-török" | "szerb-horvát" | "szláv" | "török" | "ugor" | "uráli";

export interface WurzelPaarHu {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  indizio: string;
  /** Das Wort selbst - ein Einzelwort, klein. */
  parola: string;
  origine: WurzelOrigineHu;
  /** Wo die Herkunft nachgelesen wurde (Quelle aus `tf-fest`, z. B. eine Wiktionary-Seite). */
  beleg: string;
}

export interface WurzelThemaHu {
  id: string;
  titel: string;
  paare: WurzelPaarHu[];
}

/** Die Themen (aus `wurzelKategorien`): `titel` in Ungarisch, `titelJe` der Name in den Bedienungssprachen (fehlt einer: englisch, sonst `titel`). */
export const WURZEL_THEMEN_HU: readonly { id: string; titel: string; titelJe?: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> }[] = [
  { id: "osi", titel: "Ősi szavaink az uráli időkből", titelJe: { de: "Alte Wörter aus uralischer Zeit", en: "Ancient words from Uralic times" } },
  { id: "kelet", titel: "Régi török és iráni szavak", titelJe: { de: "Alte türkische und iranische Wörter", en: "Old Turkic and Iranian words" } },
  { id: "szlav", titel: "Szláv szomszédaink szavai", titelJe: { de: "Wörter unserer slawischen Nachbarn", en: "Words from our Slavic neighbours" } },
  { id: "nemet", titel: "Német eredetű szavak", titelJe: { de: "Wörter deutscher Herkunft", en: "Words of German origin" } },
  { id: "gorog", titel: "Görög és latin gyökerek", titelJe: { de: "Griechische und lateinische Wurzeln", en: "Greek and Latin roots" } },
];

/** Die Paare je Stufe und Thema. */
export const WURZELN_HU: Record<WurzelStufeHu, WurzelThemaHu[]> = {
  kids: [
    {
      id: "osi",
      titel: "Ősi szavaink az uráli időkből",
      paare: [
        { indizio: "ezzel fogod a ceruzát", parola: "kéz", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/kéz#Hungarian" },
        { indizio: "iszod, ha szomjas vagy", parola: "víz", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/víz#Hungarian" },
        { indizio: "úszik a Balatonban", parola: "hal", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/hal#Hungarian" },
        { indizio: "ezzel látsz", parola: "szem", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/szem#Hungarian" },
        { indizio: "ezen hordod a sapkát", parola: "fej", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/fej#Hungarian" },
        { indizio: "dobog a mellkasodban", parola: "szív", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/szív#Hungarian" },
        { indizio: "kemény darab a patakparton", parola: "kő", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/kő#Hungarian" },
        { indizio: "az erdőben nő, ágai vannak", parola: "fa", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/fa#Hungarian" },
        { indizio: "ebben laksz", parola: "ház", origine: "finnugor", beleg: "https://en.wiktionary.org/wiki/ház#Hungarian" },
        { indizio: "a méhek édes kincse", parola: "méz", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/méz#Hungarian" },
        { indizio: "télen befagy a tavon", parola: "jég", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/jég#Hungarian" },
        { indizio: "hosszú fülű, répát rágcsál", parola: "nyúl", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/nyúl#Hungarian" },
        { indizio: "a macska kergeti", parola: "egér", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/egér#Hungarian" },
        { indizio: "a leghidegebb évszak", parola: "tél", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/tél#Hungarian" },
        { indizio: "apró rovar, bolyban él", parola: "hangya", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/hangya#Hungarian" },
      ],
    },
    {
      id: "kelet",
      titel: "Régi török és iráni szavak",
      paare: [
        { indizio: "kerek gyümölcs, lehet piros vagy zöld", parola: "alma", origine: "török", beleg: "https://en.wiktionary.org/wiki/alma#Hungarian" },
        { indizio: "kemény héjú, a mókus is szereti", parola: "dió", origine: "török", beleg: "https://en.wiktionary.org/wiki/dió#Hungarian" },
        { indizio: "fürtökben terem, bor lesz belőle", parola: "szőlő", origine: "török", beleg: "https://en.wiktionary.org/wiki/szőlő#Hungarian" },
        { indizio: "ebből őrlik a kenyérlisztet", parola: "búza", origine: "török", beleg: "https://en.wiktionary.org/wiki/búza#Hungarian" },
        { indizio: "a tehén kicsinye", parola: "borjú", origine: "török", beleg: "https://en.wiktionary.org/wiki/borjú#Hungarian" },
        { indizio: "kotkodácsol az udvaron", parola: "tyúk", origine: "török", beleg: "https://en.wiktionary.org/wiki/tyúk#Hungarian" },
        { indizio: "fehér, morzsás tejtermék", parola: "túró", origine: "török", beleg: "https://en.wiktionary.org/wiki/túró#Hungarian" },
        { indizio: "púpos sivatagi állat", parola: "teve", origine: "török", beleg: "https://en.wiktionary.org/wiki/teve#Hungarian" },
        { indizio: "az állatok királya", parola: "oroszlán", origine: "török", beleg: "https://en.wiktionary.org/wiki/oroszlán#Hungarian" },
        { indizio: "sós vizű, hatalmas víz", parola: "tenger", origine: "török", beleg: "https://en.wiktionary.org/wiki/tenger#Hungarian" },
        { indizio: "megmutatja az arcodat", parola: "tükör", origine: "török", beleg: "https://en.wiktionary.org/wiki/tükör#Hungarian" },
        { indizio: "viaszból van, lángja világít", parola: "gyertya", origine: "török", beleg: "https://en.wiktionary.org/wiki/gyertya#Hungarian" },
        { indizio: "ezen mész be az udvarra", parola: "kapu", origine: "török", beleg: "https://en.wiktionary.org/wiki/kapu#Hungarian" },
        { indizio: "a felnőttek reggeli itala", parola: "kávé", origine: "oszmán-török", beleg: "https://en.wiktionary.org/wiki/kávé#Hungarian" },
        { indizio: "otthoni lábbeli", parola: "papucs", origine: "oszmán-török", beleg: "https://en.wiktionary.org/wiki/papucs#Hungarian" },
      ],
    },
    {
      id: "szlav",
      titel: "Szláv szomszédaink szavai",
      paare: [
        { indizio: "ennél eszünk", parola: "asztal", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/asztal#Hungarian" },
        { indizio: "nyávog és dorombol", parola: "macska", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/macska#Hungarian" },
        { indizio: "barna bundás, télen alszik", parola: "medve", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/medve#Hungarian" },
        { indizio: "a városi tereken totyog", parola: "galamb", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/galamb#Hungarian" },
        { indizio: "kis barna madár, csiripel", parola: "veréb", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/veréb#Hungarian" },
        { indizio: "narancssárga zöldség", parola: "répa", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/répa#Hungarian" },
        { indizio: "lila gyümölcs, lekvár is lesz belőle", parola: "szilva", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/szilva#Hungarian" },
        { indizio: "apró fekete mag a bejgliben", parola: "mák", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/mák#Hungarian" },
        { indizio: "délben esszük", parola: "ebéd", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/ebéd#Hungarian" },
        { indizio: "este esszük", parola: "vacsora", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/vacsora#Hungarian" },
        { indizio: "koronát visel", parola: "király", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/király#Hungarian" },
        { indizio: "ezzel nyitod a zárat", parola: "kulcs", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/kulcs#Hungarian" },
        { indizio: "kis folyóvíz", parola: "patak", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/patak#Hungarian" },
        { indizio: "nyolc lábú, hálót sző", parola: "pók", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/pók#Hungarian" },
        { indizio: "piros fűszer és zöldség", parola: "paprika", origine: "szerb-horvát", beleg: "https://en.wiktionary.org/wiki/paprika#Hungarian" },
      ],
    },
    {
      id: "nemet",
      titel: "Német eredetű szavak",
      paare: [
        { indizio: "hajlított péksütemény", parola: "kifli", origine: "német", beleg: "https://en.wiktionary.org/wiki/kifli#Hungarian" },
        { indizio: "sós, hurkos péksütemény", parola: "perec", origine: "német", beleg: "https://en.wiktionary.org/wiki/perec#Hungarian" },
        { indizio: "füstölt felvágott a reggelihez", parola: "sonka", origine: "német", beleg: "https://en.wiktionary.org/wiki/sonka#Hungarian" },
        { indizio: "más néven burgonya", parola: "krumpli", origine: "német", beleg: "https://en.wiktionary.org/wiki/krumpli#Hungarian" },
        { indizio: "zenére mozgunk", parola: "tánc", origine: "német", beleg: "https://en.wiktionary.org/wiki/tánc#Hungarian" },
        { indizio: "kenyeret süt", parola: "pék", origine: "német", beleg: "https://en.wiktionary.org/wiki/pék#Hungarian" },
        { indizio: "piros fürtös bogyó", parola: "ribizli", origine: "német", beleg: "https://en.wiktionary.org/wiki/ribizli#Hungarian" },
        { indizio: "a pörkölt mellé szaggatott tészta", parola: "nokedli", origine: "német", beleg: "https://en.wiktionary.org/wiki/nokedli#Hungarian" },
        { indizio: "nyári fürdőhely", parola: "strand", origine: "német", beleg: "https://en.wiktionary.org/wiki/strand#Hungarian" },
        { indizio: "jelmezes téli mulatság", parola: "farsang", origine: "német", beleg: "https://en.wiktionary.org/wiki/farsang#Hungarian" },
        { indizio: "farsangi kerek, sült tészta", parola: "fánk", origine: "német", beleg: "https://en.wiktionary.org/wiki/fánk#Hungarian" },
        { indizio: "ettől lesz édes a tea", parola: "cukor", origine: "német", beleg: "https://en.wiktionary.org/wiki/cukor#Hungarian" },
        { indizio: "erre írsz", parola: "papír", origine: "német", beleg: "https://en.wiktionary.org/wiki/papír#Hungarian" },
        { indizio: "más néven kerékpár", parola: "bicikli", origine: "német", beleg: "https://en.wiktionary.org/wiki/bicikli#Hungarian" },
        { indizio: "négy keréken gurul az úton", parola: "autó", origine: "német", beleg: "https://en.wiktionary.org/wiki/autó#Hungarian" },
      ],
    },
    {
      id: "gorog",
      titel: "Görög és latin gyökerek",
      paare: [
        { indizio: "ide jársz tanulni", parola: "iskola", origine: "latin", beleg: "https://en.wiktionary.org/wiki/iskola#Hungarian" },
        { indizio: "erre ír a tanító", parola: "tábla", origine: "latin", beleg: "https://en.wiktionary.org/wiki/tábla#Hungarian" },
        { indizio: "ezzel írunk a táblára", parola: "kréta", origine: "latin", beleg: "https://en.wiktionary.org/wiki/kréta#Hungarian" },
        { indizio: "a töltőtoll festéke", parola: "tinta", origine: "latin", beleg: "https://en.wiktionary.org/wiki/tinta#Hungarian" },
        { indizio: "nagy szájú folyami hüllő", parola: "krokodil", origine: "görög", beleg: "https://en.wiktionary.org/wiki/krokodil#Hungarian" },
        { indizio: "óriás ősi hüllő", parola: "dinoszaurusz", origine: "görög", beleg: "https://en.wiktionary.org/wiki/dinoszaurusz#Hungarian" },
        { indizio: "ormányos óriás", parola: "elefánt", origine: "görög", beleg: "https://en.wiktionary.org/wiki/elefánt#Hungarian" },
        { indizio: "égi küldött a mesékben", parola: "angyal", origine: "görög", beleg: "https://en.wiktionary.org/wiki/angyal#Hungarian" },
        { indizio: "itt szól a harang", parola: "templom", origine: "latin", beleg: "https://en.wiktionary.org/wiki/templom#Hungarian" },
        { indizio: "régi kincseket mutat be", parola: "múzeum", origine: "latin", beleg: "https://en.wiktionary.org/wiki/múzeum#Hungarian" },
        { indizio: "tüskés, illatos virág", parola: "rózsa", origine: "latin", beleg: "https://en.wiktionary.org/wiki/rózsa#Hungarian" },
        { indizio: "savanyú sárga gyümölcs", parola: "citrom", origine: "latin", beleg: "https://en.wiktionary.org/wiki/citrom#Hungarian" },
        { indizio: "meleg országok fája", parola: "pálma", origine: "latin", beleg: "https://en.wiktionary.org/wiki/pálma#Hungarian" },
        { indizio: "más szóval bolygó", parola: "planéta", origine: "görög", beleg: "https://en.wiktionary.org/wiki/planéta#Hungarian" },
        { indizio: "az apró dolgokat felnagyítja", parola: "mikroszkóp", origine: "görög", beleg: "https://en.wiktionary.org/wiki/mikroszkóp#Hungarian" },
      ],
    },
  ],
  teens: [
    {
      id: "osi",
      titel: "Ősi szavaink az uráli időkből",
      paare: [
        { indizio: "íjjal lövik ki", parola: "nyíl", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/nyíl#Hungarian" },
        { indizio: "ezzel lövik ki a nyilat", parola: "íj", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/íj#Hungarian" },
        { indizio: "a nyár után jön", parola: "ősz", origine: "finnugor", beleg: "https://en.wiktionary.org/wiki/ősz#Hungarian" },
        { indizio: "más néven liba", parola: "lúd", origine: "finnugor", beleg: "https://en.wiktionary.org/wiki/lúd#Hungarian" },
        { indizio: "sírásnál folyik", parola: "könny", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/könny#Hungarian" },
        { indizio: "piros, az erekben folyik", parola: "vér", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/vér#Hungarian" },
        { indizio: "a szádban van, és beszélsz is vele", parola: "nyelv", origine: "finnugor", beleg: "https://en.wiktionary.org/wiki/nyelv#Hungarian" },
        { indizio: "ezzel hallasz", parola: "fül", origine: "finnugor", beleg: "https://en.wiktionary.org/wiki/fül#Hungarian" },
        { indizio: "a madarak otthona", parola: "fészek", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/fészek#Hungarian" },
        { indizio: "kenyérre kened", parola: "vaj", origine: "finnugor", beleg: "https://en.wiktionary.org/wiki/vaj#Hungarian" },
        { indizio: "vörös bundás ragadozó", parola: "róka", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/róka#Hungarian" },
        { indizio: "színes, virágról virágra repülő rovar", parola: "lepke", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/lepke#Hungarian" },
        { indizio: "lábatlan hüllő", parola: "kígyó", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/kígyó#Hungarian" },
        { indizio: "álló víz, mint a Balaton", parola: "tó", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/tó#Hungarian" },
        { indizio: "éjjel világít az égen", parola: "hold", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/hold#Hungarian" },
      ],
    },
    {
      id: "kelet",
      titel: "Régi török és iráni szavak",
      paare: [
        { indizio: "gabona, sör is készül belőle", parola: "árpa", origine: "török", beleg: "https://en.wiktionary.org/wiki/árpa#Hungarian" },
        { indizio: "zöld szemek hüvelyben", parola: "borsó", origine: "török", beleg: "https://en.wiktionary.org/wiki/borsó#Hungarian" },
        { indizio: "igás állat, régen szekeret húzott", parola: "ökör", origine: "török", beleg: "https://en.wiktionary.org/wiki/ökör#Hungarian" },
        { indizio: "a tehén párja", parola: "bika", origine: "török", beleg: "https://en.wiktionary.org/wiki/bika#Hungarian" },
        { indizio: "kempingben ebben alszol", parola: "sátor", origine: "török", beleg: "https://en.wiktionary.org/wiki/sátor#Hungarian" },
        { indizio: "ebben ringatják a babát", parola: "bölcső", origine: "török", beleg: "https://en.wiktionary.org/wiki/bölcső#Hungarian" },
        { indizio: "az ábécé egy jele", parola: "betű", origine: "török", beleg: "https://en.wiktionary.org/wiki/betű#Hungarian" },
        { indizio: "a csúcsa felé keskenyedő gyümölcs", parola: "körte", origine: "török", beleg: "https://en.wiktionary.org/wiki/körte#Hungarian" },
        { indizio: "a sör keserű növénye", parola: "komló", origine: "török", beleg: "https://en.wiktionary.org/wiki/komló#Hungarian" },
        { indizio: "csíp, ha megérinted", parola: "csalán", origine: "török", beleg: "https://en.wiktionary.org/wiki/csalán#Hungarian" },
        { indizio: "a strandon ebből építesz várat", parola: "homok", origine: "török", beleg: "https://en.wiktionary.org/wiki/homok#Hungarian" },
        { indizio: "az ujjadon hordod", parola: "gyűrű", origine: "török", beleg: "https://en.wiktionary.org/wiki/gyűrű#Hungarian" },
        { indizio: "a nadrágodon van, ebbe teszed a kulcsot", parola: "zseb", origine: "oszmán-török", beleg: "https://en.wiktionary.org/wiki/zseb#Hungarian" },
        { indizio: "a tehén adja", parola: "tej", origine: "iráni", beleg: "https://en.wiktionary.org/wiki/tej#Hungarian" },
        { indizio: "tízszer száz", parola: "ezer", origine: "iráni", beleg: "https://en.wiktionary.org/wiki/ezer#Hungarian" },
      ],
    },
    {
      id: "szlav",
      titel: "Szláv szomszédaink szavai",
      paare: [
        { indizio: "a hét közepe", parola: "szerda", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/szerda#Hungarian" },
        { indizio: "a hét negyedik napja", parola: "csütörtök", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/csütörtök#Hungarian" },
        { indizio: "a hétvége előtti utolsó iskolanap", parola: "péntek", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/péntek#Hungarian" },
        { indizio: "szülők és gyerekek együtt", parola: "család", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/család#Hungarian" },
        { indizio: "akivel szívesen töltöd az idődet", parola: "barát", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/barát#Hungarian" },
        { indizio: "patkót és vasat kalapál", parola: "kovács", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/kovács#Hungarian" },
        { indizio: "derékon hordott, lenge ruhadarab", parola: "szoknya", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/szoknya#Hungarian" },
        { indizio: "zöld zöldség, savanyúság is lesz belőle", parola: "uborka", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/uborka#Hungarian" },
        { indizio: "hegyes fogú ragadozó hal", parola: "csuka", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/csuka#Hungarian" },
        { indizio: "ollós vízi állat", parola: "rák", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/rák#Hungarian" },
        { indizio: "esőben nő az erdőben, kalapja van", parola: "gomba", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/gomba#Hungarian" },
        { indizio: "piros bogyós gyümölcs", parola: "málna", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/málna#Hungarian" },
        { indizio: "nyári gyümölcs, lehet görög vagy sárga", parola: "dinnye", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/dinnye#Hungarian" },
        { indizio: "fonott, édes kenyér", parola: "kalács", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/kalács#Hungarian" },
        { indizio: "a gyermeked gyermeke", parola: "unoka", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/unoka#Hungarian" },
      ],
    },
    {
      id: "nemet",
      titel: "Német eredetű szavak",
      paare: [
        { indizio: "ahova el akarsz jutni", parola: "cél", origine: "német", beleg: "https://en.wiktionary.org/wiki/cél#Hungarian" },
        { indizio: "nagy zaj", parola: "lárma", origine: "német", beleg: "https://en.wiktionary.org/wiki/lárma#Hungarian" },
        { indizio: "ébresztőóra", parola: "vekker", origine: "német", beleg: "https://en.wiktionary.org/wiki/vekker#Hungarian" },
        { indizio: "kis papírdarab jegyzetnek", parola: "cetli", origine: "német", beleg: "https://en.wiktionary.org/wiki/cetli#Hungarian" },
        { indizio: "fehér, rózsás zöldség", parola: "karfiol", origine: "német", beleg: "https://en.wiktionary.org/wiki/karfiol#Hungarian" },
        { indizio: "a testvéred férje", parola: "sógor", origine: "germán", beleg: "https://en.wiktionary.org/wiki/sógor#Hungarian" },
        { indizio: "a város lakója", parola: "polgár", origine: "német", beleg: "https://en.wiktionary.org/wiki/polgár#Hungarian" },
        { indizio: "uralkodói család tagja", parola: "herceg", origine: "német", beleg: "https://en.wiktionary.org/wiki/herceg#Hungarian" },
        { indizio: "nemesi rang", parola: "gróf", origine: "német", beleg: "https://en.wiktionary.org/wiki/gróf#Hungarian" },
        { indizio: "a lovag fém öltözete", parola: "páncél", origine: "német", beleg: "https://en.wiktionary.org/wiki/páncél#Hungarian" },
        { indizio: "megízlel", parola: "kóstol", origine: "német", beleg: "https://en.wiktionary.org/wiki/kóstol#Hungarian" },
        { indizio: "befont haj", parola: "copf", origine: "német", beleg: "https://en.wiktionary.org/wiki/copf#Hungarian" },
        { indizio: "a ház falából kiálló kis terasz", parola: "erkély", origine: "német", beleg: "https://en.wiktionary.org/wiki/erkély#Hungarian" },
        { indizio: "ezen száll fel a füst", parola: "kémény", origine: "német", beleg: "https://en.wiktionary.org/wiki/kémény#Hungarian" },
        { indizio: "zöld levelekből készült főzelék", parola: "spenót", origine: "német", beleg: "https://en.wiktionary.org/wiki/spenót#Hungarian" },
      ],
    },
    {
      id: "gorog",
      titel: "Görög és latin gyökerek",
      paare: [
        { indizio: "otthoni feladat", parola: "lecke", origine: "latin", beleg: "https://en.wiktionary.org/wiki/lecke#Hungarian" },
        { indizio: "érettségit adó középiskola", parola: "gimnázium", origine: "görög", beleg: "https://en.wiktionary.org/wiki/gimnázium#Hungarian" },
        { indizio: "a számok tudománya", parola: "matematika", origine: "görög", beleg: "https://en.wiktionary.org/wiki/matematika#Hungarian" },
        { indizio: "az élet tudománya", parola: "biológia", origine: "görög", beleg: "https://en.wiktionary.org/wiki/biológia#Hungarian" },
        { indizio: "az alakzatok tudománya", parola: "geometria", origine: "görög", beleg: "https://en.wiktionary.org/wiki/geometria#Hungarian" },
        { indizio: "énekkar", parola: "kórus", origine: "görög", beleg: "https://en.wiktionary.org/wiki/kórus#Hungarian" },
        { indizio: "tudósok testülete", parola: "akadémia", origine: "görög", beleg: "https://en.wiktionary.org/wiki/akadémia#Hungarian" },
        { indizio: "orvos más szóval", parola: "doktor", origine: "latin", beleg: "https://en.wiktionary.org/wiki/doktor#Hungarian" },
        { indizio: "egyetemi tanár", parola: "professzor", origine: "latin", beleg: "https://en.wiktionary.org/wiki/professzor#Hungarian" },
        { indizio: "diákotthon", parola: "kollégium", origine: "latin", beleg: "https://en.wiktionary.org/wiki/kollégium#Hungarian" },
        { indizio: "összhang", parola: "harmónia", origine: "görög", beleg: "https://en.wiktionary.org/wiki/harmónia#Hungarian" },
        { indizio: "sípos templomi hangszer", parola: "orgona", origine: "görög", beleg: "https://en.wiktionary.org/wiki/orgona#Hungarian" },
        { indizio: "húros népi hangszer", parola: "citera", origine: "latin", beleg: "https://en.wiktionary.org/wiki/citera#Hungarian" },
        { indizio: "magához vonzza a vasat", parola: "mágnes", origine: "görög", beleg: "https://en.wiktionary.org/wiki/mágnes#Hungarian" },
        { indizio: "munkavégző képesség", parola: "energia", origine: "görög", beleg: "https://en.wiktionary.org/wiki/energia#Hungarian" },
      ],
    },
  ],
  erwachsen: [
    {
      id: "osi",
      titel: "Ősi szavaink az uráli időkből",
      paare: [
        { indizio: "a csont belsejében van", parola: "velő", origine: "finnugor", beleg: "https://en.wiktionary.org/wiki/velő#Hungarian" },
        { indizio: "az izmot a csonthoz köti", parola: "ín", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/ín#Hungarian" },
        { indizio: "a test legnagyobb mirigye", parola: "máj", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/máj#Hungarian" },
        { indizio: "a máj termeli, keserű", parola: "epe", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/epe#Hungarian" },
        { indizio: "a kar hajlata", parola: "könyök", origine: "finnugor", beleg: "https://en.wiktionary.org/wiki/könyök#Hungarian" },
        { indizio: "a fiad felesége", parola: "meny", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/meny#Hungarian" },
        { indizio: "a lányod férje", parola: "vő", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/vő#Hungarian" },
        { indizio: "régen élt felmenő", parola: "ős", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/ős#Hungarian" },
        { indizio: "a ló hátára teszik", parola: "nyereg", origine: "ugor", beleg: "https://en.wiktionary.org/wiki/nyereg#Hungarian" },
        { indizio: "sárga nemesfém", parola: "arany", origine: "ugor", beleg: "https://en.wiktionary.org/wiki/arany#Hungarian" },
        { indizio: "szürke fém, rozsdásodik", parola: "vas", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/vas#Hungarian" },
        { indizio: "puha fém, forrasztanak vele", parola: "ón", origine: "uráli", beleg: "https://en.wiktionary.org/wiki/ón#Hungarian" },
        { indizio: "örökzöld tűlevelű fa", parola: "fenyő", origine: "finnugor", beleg: "https://en.wiktionary.org/wiki/fenyő#Hungarian" },
        { indizio: "a növényt a földben tartja", parola: "gyökér", origine: "ugor", beleg: "https://en.wiktionary.org/wiki/gyökér#Hungarian" },
        { indizio: "hosszú lábú, nagy vonuló madár", parola: "daru", origine: "finnugor", beleg: "https://en.wiktionary.org/wiki/daru#Hungarian" },
      ],
    },
    {
      id: "kelet",
      titel: "Régi török és iráni szavak",
      paare: [
        { indizio: "a földet szántja", parola: "eke", origine: "török", beleg: "https://en.wiktionary.org/wiki/eke#Hungarian" },
        { indizio: "félhold alakú aratóeszköz", parola: "sarló", origine: "török", beleg: "https://en.wiktionary.org/wiki/sarló#Hungarian" },
        { indizio: "látta, mi történt, és elmondja", parola: "tanú", origine: "török", beleg: "https://en.wiktionary.org/wiki/tanú#Hungarian" },
        { indizio: "nem fél", parola: "bátor", origine: "török", beleg: "https://en.wiktionary.org/wiki/bátor#Hungarian" },
        { indizio: "tüskés cserje fanyar kék terméssel", parola: "kökény", origine: "török", beleg: "https://en.wiktionary.org/wiki/kökény#Hungarian" },
        { indizio: "a juh szőre", parola: "gyapjú", origine: "török", beleg: "https://en.wiktionary.org/wiki/gyapjú#Hungarian" },
        { indizio: "a juhnyáj hím állata", parola: "kos", origine: "török", beleg: "https://en.wiktionary.org/wiki/kos#Hungarian" },
        { indizio: "nagy csapat, régen katonák tömege", parola: "sereg", origine: "török", beleg: "https://en.wiktionary.org/wiki/sereg#Hungarian" },
        { indizio: "jutalmat érő teljesítmény", parola: "érdem", origine: "török", beleg: "https://en.wiktionary.org/wiki/érdem#Hungarian" },
        { indizio: "alma, körte, szilva közös neve", parola: "gyümölcs", origine: "török", beleg: "https://en.wiktionary.org/wiki/gyümölcs#Hungarian" },
        { indizio: "a láb hajlata", parola: "térd", origine: "török", beleg: "https://en.wiktionary.org/wiki/térd#Hungarian" },
        { indizio: "kényelmes heverő", parola: "dívány", origine: "oszmán-török", beleg: "https://en.wiktionary.org/wiki/dívány#Hungarian" },
        { indizio: "hosszú, fonott szíjú ostor", parola: "korbács", origine: "oszmán-török", beleg: "https://en.wiktionary.org/wiki/korbács#Hungarian" },
        { indizio: "a szivar és a cigaretta növénye", parola: "dohány", origine: "oszmán-török", beleg: "https://en.wiktionary.org/wiki/dohány#Hungarian" },
        { indizio: "nagy piac, sok árussal", parola: "vásár", origine: "iráni", beleg: "https://en.wiktionary.org/wiki/vásár#Hungarian" },
      ],
    },
    {
      id: "szlav",
      titel: "Szláv szomszédaink szavai",
      paare: [
        { indizio: "az eke nyoma a földben", parola: "barázda", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/barázda#Hungarian" },
        { indizio: "hosszú pengéjű fűvágó eszköz", parola: "kasza", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/kasza#Hungarian" },
        { indizio: "fogas kerti eszköz a lomb összegyűjtésére", parola: "gereblye", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/gereblye#Hungarian" },
        { indizio: "szántás után a rögöket töri", parola: "borona", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/borona#Hungarian" },
        { indizio: "valami, amit el kell intézni", parola: "dolog", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/dolog#Hungarian" },
        { indizio: "sokba kerül", parola: "drága", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/drága#Hungarian" },
        { indizio: "nem piszkos", parola: "tiszta", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/tiszta#Hungarian" },
        { indizio: "fátlan alföldi síkság", parola: "puszta", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/puszta#Hungarian" },
        { indizio: "a templomban tisztelt személy", parola: "szent", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/szent#Hungarian" },
        { indizio: "két egymást metsző vonal jele", parola: "kereszt", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/kereszt#Hungarian" },
        { indizio: "ezzel fizetünk", parola: "pénz", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/pénz#Hungarian" },
        { indizio: "sült hús", parola: "pecsenye", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/pecsenye#Hungarian" },
        { indizio: "nem vér szerinti szülő", parola: "mostoha", origine: "bolgár", beleg: "https://en.wiktionary.org/wiki/mostoha#Hungarian" },
        { indizio: "fogantyús edény vízhordásra", parola: "vödör", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/vödör#Hungarian" },
        { indizio: "füstölt, zsíros disznóhús", parola: "szalonna", origine: "szláv", beleg: "https://en.wiktionary.org/wiki/szalonna#Hungarian" },
      ],
    },
    {
      id: "nemet",
      titel: "Német eredetű szavak",
      paare: [
        { indizio: "régi kézműves szövetség", parola: "céh", origine: "német", beleg: "https://en.wiktionary.org/wiki/céh#Hungarian" },
        { indizio: "régi bolt kiakasztott jelvénye", parola: "cégér", origine: "német", beleg: "https://en.wiktionary.org/wiki/cégér#Hungarian" },
        { indizio: "a katonák régi fizetése", parola: "zsold", origine: "német", beleg: "https://en.wiktionary.org/wiki/zsold#Hungarian" },
        { indizio: "régi szóval kereskedő", parola: "kalmár", origine: "német", beleg: "https://en.wiktionary.org/wiki/kalmár#Hungarian" },
        { indizio: "a város vezetője", parola: "polgármester", origine: "német mintára", beleg: "https://en.wiktionary.org/wiki/polgármester#Hungarian" },
        { indizio: "habarcs a falazáshoz", parola: "malter", origine: "német", beleg: "https://en.wiktionary.org/wiki/malter#Hungarian" },
        { indizio: "régi konyhai tűzhely", parola: "sparhelt", origine: "német", beleg: "https://en.wiktionary.org/wiki/sparhelt#Hungarian" },
        { indizio: "éléskamra", parola: "spájz", origine: "német", beleg: "https://en.wiktionary.org/wiki/spájz#Hungarian" },
        { indizio: "háttámla nélküli konyhai szék", parola: "hokedli", origine: "német", beleg: "https://en.wiktionary.org/wiki/hokedli#Hungarian" },
        { indizio: "magas építmény a templomon", parola: "torony", origine: "német", beleg: "https://en.wiktionary.org/wiki/torony#Hungarian" },
        { indizio: "kerek péksütemény", parola: "zsemle", origine: "német", beleg: "https://en.wiktionary.org/wiki/zsemle#Hungarian" },
        { indizio: "hathúros hangszer", parola: "gitár", origine: "német", beleg: "https://en.wiktionary.org/wiki/gitár#Hungarian" },
        { indizio: "az űrbe repül", parola: "rakéta", origine: "német", beleg: "https://en.wiktionary.org/wiki/rakéta#Hungarian" },
        { indizio: "távolról beszélsz vele", parola: "telefon", origine: "német", beleg: "https://en.wiktionary.org/wiki/telefon#Hungarian" },
        { indizio: "kis csók", parola: "puszi", origine: "német", beleg: "https://en.wiktionary.org/wiki/puszi#Hungarian" },
      ],
    },
    {
      id: "gorog",
      titel: "Görög és latin gyökerek",
      paare: [
        { indizio: "a nép uralma", parola: "demokrácia", origine: "görög", beleg: "https://en.wiktionary.org/wiki/demokrácia#Hungarian" },
        { indizio: "a bölcsesség szeretete", parola: "filozófia", origine: "görög", beleg: "https://en.wiktionary.org/wiki/filozófia#Hungarian" },
        { indizio: "az élőlények és környezetük tudománya", parola: "ökológia", origine: "görög", beleg: "https://en.wiktionary.org/wiki/ökológia#Hungarian" },
        { indizio: "tanító, nevelő", parola: "pedagógus", origine: "görög", beleg: "https://en.wiktionary.org/wiki/pedagógus#Hungarian" },
        { indizio: "zenekari mű több tételben", parola: "szimfónia", origine: "görög", beleg: "https://en.wiktionary.org/wiki/szimfónia#Hungarian" },
        { indizio: "régi naptár", parola: "kalendárium", origine: "latin", beleg: "https://en.wiktionary.org/wiki/kalendárium#Hungarian" },
        { indizio: "az egyetem vezetője", parola: "rektor", origine: "latin", beleg: "https://en.wiktionary.org/wiki/rektor#Hungarian" },
        { indizio: "nyilvános vitatér", parola: "fórum", origine: "latin", beleg: "https://en.wiktionary.org/wiki/fórum#Hungarian" },
        { indizio: "vékony, ropogós lap a sütemény alá", parola: "ostya", origine: "latin", beleg: "https://en.wiktionary.org/wiki/ostya#Hungarian" },
        { indizio: "templomi énekvezető", parola: "kántor", origine: "latin", beleg: "https://en.wiktionary.org/wiki/kántor#Hungarian" },
        { indizio: "Jézus tanítványa", parola: "apostol", origine: "görög", beleg: "https://en.wiktionary.org/wiki/apostol#Hungarian" },
        { indizio: "fehér, illatos virág", parola: "liliom", origine: "latin", beleg: "https://en.wiktionary.org/wiki/liliom#Hungarian" },
        { indizio: "égetett agyagból készül", parola: "tégla", origine: "latin", beleg: "https://en.wiktionary.org/wiki/tégla#Hungarian" },
        { indizio: "földrész", parola: "kontinens", origine: "latin", beleg: "https://en.wiktionary.org/wiki/kontinens#Hungarian" },
        { indizio: "szakmai testület, például orvosi", parola: "kamara", origine: "latin", beleg: "https://en.wiktionary.org/wiki/kamara#Hungarian" },
      ],
    },
  ],
};

/** Der Name der Tippchallenge-Dateien je Bedienungssprache, mit `{i}` und `{n}` („Bulgarian word origins, alphabetical: file {i} of {n}"). */
export const WURZEL_CHALLENGE_TITEL_HU: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> = {
  de: "Herkunft ungarischer Wörter, alphabetisch: Datei {i} von {n}",
  en: "Hungarian word origins, alphabetical: file {i} of {n}",
};

/** Die Zeile eines Paares: zuerst der Hinweis, dann das Wort. */
export function wurzelZeileHu(x: { indizio: string; parola: string }): string {
  return `${x.indizio} - ${x.parola}`;
}

/** Dieselben Wörter, alphabetisch nach dem Hinweis (Sortierung „hu-HU") - für die Tippchallenge, wie `KORENY_ABECEDNE`. */
export const WURZELN_HU_ALPHABETISCH: Record<WurzelStufeHu, string[]> = Object.fromEntries(
  (Object.keys(WURZELN_HU) as WurzelStufeHu[]).map((stufe) => [
    stufe,
    WURZELN_HU[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indizio.localeCompare(b.indizio, "hu-HU"))
      .map(wurzelZeileHu),
  ]),
) as Record<WurzelStufeHu, string[]>;
