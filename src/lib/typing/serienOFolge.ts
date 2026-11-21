/**
 * SERIEN FUER DIE SPROSSE 17 der NEUEN Buchstabenfolge (Charge O1, 21.08.2026).
 *
 * ── WARUM ES DIESE DATEI GIBT ─────────────────────────────────────────────
 *
 * Die Einfuehrungsreihenfolge `LETTER_ORDER` (letters.ts) ist nach deutscher
 * Buchstabenhaeufigkeit gebaut. Das `o` stand darin auf Platz 19 - im Deutschen
 * traegt es nur 2,5 Prozent. Im Englischen sind es 7,5 Prozent, und an ihm
 * haengen to, of, on, not, no, for, one. Vor zwanzig Tasten konnte das
 * Englische darum fast nichts Vernuenftiges sagen. Charge O1 zieht das `o`
 * direkt hinter das `h`.
 *
 * Der Preis dieser Verschiebung ist genau EINE Stelle: das `c` rutscht von
 * Einheit 17 auf 18. Acht Serien, die bisher bei 17 aufgingen, oeffnen danach
 * erst bei 18 und fallen damit unter dem Regal-Punkt 17 heraus - zusammen zehn
 * Serien-Plaetze (de/kids 1 · de/teens 4 · de/erwachsen 2 · en/kids 1 ·
 * en/teens 1 · en/erwachsen 1). Diese Datei schreibt den Ersatz, BEVOR die
 * Reihenfolge sich bewegt (Johannes' Weiche 4: erst schreiben, dann
 * aussortieren). Die acht betroffenen Altserien bleiben unangetastet - ihnen
 * das `c` auszutreiben hiesse im Deutschen: kein nicht, kein ich, kein sich,
 * kein auch, kein Nacht/Licht, kein sch- und kein ch-Wort.
 *
 * ── DAS BUDGET DIESER DATEI (am Objekt gemessen, nicht geschaetzt) ────────
 *
 * Nach dem Umbau steht an der Sprosse 17 der Satz
 *
 *     f j d k s l a ö e n i r t   ⇧   h o u
 *
 * also SECHZEHN Buchstaben: **a d e f h i j k l n o r s t u ö**. Gesperrt und
 * damit die eigentliche Arbeit: **b c g m p q v w x y z ä ü ß**.
 *
 * Was gegenueber der alten Sprosse 17 NEU ist (dort stand c statt o):
 * *oder, ohne, oft, sofort, also, dort, Ort, rot, Hof, Ofen, Sohn, Ton, Not,
 * Los, Foto, Telefon, Otter, Order, Rost, Stroh, Tor, hoeher* - und im
 * Englischen (siehe `serienOFolgeEn.ts`) das ganze Grundgeruest *to, of, on,
 * not, no, for, one, out, our, into, do, so, or, other*.
 *
 * Was FEHLT und jede Zeile formt - Loch fuer Loch, jedes beim Schreiben
 * aufgelaufen:
 *
 *  • **kein c** - also kein *nicht*, kein *ich*, kein *sich*, kein *auch*,
 *    kein *doch*, kein *noch*, kein *schon*, kein *nach*, kein *durch*, kein
 *    *Nacht/Licht/Loch/Buch/Tuch*, kein sch- und kein ch-Wort ueberhaupt.
 *    Verneint wird mit *nie, kein, keiner, niemand, ohne, es fehlt*. Fuer
 *    *auch* gibt es KEINEN Ersatz - *ebenso* und *ebenfalls* tragen beide ein
 *    b -, also faellt es weg; den Gegensatz traegt ein Doppelpunkt oder ein
 *    schlichtes *nur:*.
 *  • **kein g** - und damit **kein einziges ge-Partizip**: das Perfekt gibt es
 *    in dieser Datei nicht. Vergangenheit laeuft ueber das Praeteritum
 *    (*fand, stand, hielt, hielten, rief, lief, fiel, las, trat, traf, sank,
 *    trank, tat, kannte, nannte, rannte, lud, liess*) oder ueber das Praesens.
 *    Ebenso gesperrt: *sagt, fragt, legt, liegt, Tag, lange, ruhig, jung*.
 *  • **kein m** - kein *im/am/mit/dem/einem/man/Name*, und vor allem: der
 *    Dativ *dem* fehlt. Orte stehen darum feminin (*an der Halle, in der
 *    Rinne, auf der Insel*) oder im Akkusativ (*auf den Hof, in den Keller*);
 *    der Dativ Plural *den* ist frei (*in den Ferien, auf den Knien*).
 *    Ebenso: **keine Masseinheit** - Meter, Million, Minute, Kilo tragen alle
 *    ein m. Darum steht in dieser Datei KEINE Wissens-Serie: unterhalb von
 *    Einheit 20 laesst sich nichts messen, und ein Sachtext ohne Groessen-
 *    ordnung waere eine Behauptung. Erzaehlt wird.
 *  • **kein w** - kein *war/waren*, kein *wir/was/wie/wo/wenn/weil*, kein
 *    *wieder*, kein *etwas*, kein *Wasser*, kein *Wind*, kein *Wetter*. Von
 *    *sein* existiert keine Vergangenheit; erzaehlt wird im Praesens.
 *  • **kein b** - kein *aber*, kein *haben* (und damit kein Perfekt auch von
 *    dieser Seite), kein *bei/bis/beide*, kein *bleibt*, kein *hebt*, kein
 *    *oben*, kein *neben* (Ersatz: *nahe, an, hinter*), kein *ebenso*, kein
 *    *halb*, kein *Buch*, kein *Boot* (Ersatz: *der Kahn*).
 *  • **kein p, v, z** - kein *Platz/Punkt/Kopf/Treppe*, kein *von/vor/viel*,
 *    kein *zu* (und damit keine einzige um-zu-Fuegung), kein *Zeit* (Ersatz:
 *    *die Frist, die Stunde, seit Jahren*), kein *zwei/zehn/zwoelf*.
 *  • **keine Umlaute ausser oe** - `ä ü` fehlen, `ö` ist frei. Also *hoert,
 *    oeffnet, hoeher, stoert, loest* ja; *haelt, faellt, laeuft, fuer, Tuer,
 *    frueh* nein. Die dritte Person Singular von halten/fallen/laufen ist
 *    damit gesperrt - Ersatz sind der Plural (*sie halten*), das Praeteritum
 *    (*hielt, fiel, lief*) oder ein anderes Verb (*sinkt, tritt, rennt*).
 *  • ZAHLWOERTER: frei sind *eins, drei, neun, elf, null, hundert, tausend*.
 *    Gesperrt: zwei, vier, fuenf, sechs, sieben, acht, zehn, zwoelf. Wo eine
 *    Menge noetig ist, steht *alle, keiner, ein Teil, eine Reihe*.
 *
 * TUEREN gibt es in dieser Datei nicht (*Tuer* traegt ein ue): es stehen
 * *das Tor*, *die Luke*, *die Klinke*, *die Kante*.
 *
 * ── FORM UND RECHTE ───────────────────────────────────────────────────────
 *
 * Alle Serien sind SELBST VERFASST (Bauplan 27.07. §10) - reale Texte, auch
 * gemeinfreie, halten sich nicht an eine Buchstaben-Freischaltung. Vier
 * Etappen zu zwoelf Zeilen, jede Zeile EIN Satz und hoechstens 85 Zeichen,
 * woertliche Rede OHNE Anfuehrungszeichen (Entscheidung Johannes 28.07.),
 * keine Ziffern, Satzzeichen nur . , - ? ! : ; und nur der einfache
 * Bindestrich ([[feedback_nur_bindestrich]]).
 *
 * Der Massstab je Stufe ist der bekannte: `kids` warm und klar, Tiere und
 * Alltag erlaubt; `teens` ernst genommen, trocken, echte kleine Einsaetze,
 * kein Maskottchen; `erwachsen` erwachsen und nie belehrend, keine Moral im
 * Schlusssatz.
 */
import type { Serie } from "./serie";

/** Herkunft aller Serien dieser Datei (selbst verfasst, keine Fremdrechte). */
const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
} as const;

// ───────────────────────────────────────────────────────────────────────────
// kids · Tiergeschichte. Ein Ton an der Halle, eine Ente in der Rinne, eine
// Leiter, die eine Stufe zu kurz ist. Ohne „fällt" (ä) sinkt hier alles.
// ───────────────────────────────────────────────────────────────────────────
const DIE_ENTE_IN_DER_RINNE: Serie = {
  slug: "die-ente-in-der-rinne",
  titel: "Die Ente in der Rinne",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ida hört einen Ton an der Halle.",
        "Der Ton ist fein und hell.",
        "Rudi rennt heran und hört ihn.",
        "Erst denkt Ida an ein Rad.",
        "Dann denkt sie an ein Kind.",
        "Der Ton hört nie auf.",
        "Ida und Rudi stehen still.",
        "Sie hören: der Ton sinkt und ruht dann.",
        "Rudi tastet die Rinne an der Halle.",
        "Die Rinne ist alt und rostet.",
        "In der Rinne knistert es.",
        "Dann steht da eine Feder, hell und fein.",
      ],
    },
    {
      lines: [
        "Ida holt die Leiter aus der Halle.",
        "Rudi stellt sie an die Kante.",
        "Ida und Rudi halten die Leiter fest.",
        "Ida steht auf der dritten Stufe.",
        "Sie sieht in die Rinne hinein.",
        "Da steht eine Ente.",
        "Die Ente ist nass und still.",
        "Eine Feder an ihrer Seite ist rot.",
        "Ida ruft: Da ist eine Ente!",
        "Rudi holt die Lehrerin heran.",
        "Die Lehrerin sieht in die Rinne.",
        "Sie ist klar: Die Ente kann da allein nie heraus.",
      ],
    },
    {
      lines: [
        "Die Leiter endet unter der Rinne.",
        "Ida holt ein Seil aus der Halle.",
        "Rudi holt ein Laken.",
        "Sie halten das Laken unter die Rinne.",
        "Die Lehrerin steht auf der Leiter.",
        "Sie fasst die Ente sanft an.",
        "Die Ente flattert und tritt.",
        "Sie ist klein und stark.",
        "Ida und Rudi halten das Laken still.",
        "Die Lehrerin hat die Ente in der Hand.",
        "Dann kantet die Leiter an der Rinne.",
        "Die Ente ist frei - und die Leiter sinkt.",
      ],
    },
    {
      lines: [
        "Die Lehrerin landet auf den Knien.",
        "Die Ente rollt in das Laken.",
        "Alle drei stehen erst still.",
        "Dann fasst Ida das Laken an.",
        "Die Ente ist heil, nur eine Feder ist lose.",
        "Rudi holt eine Kiste und Stroh.",
        "In der Kiste ist die Ente sofort still.",
        "Sie stellen die Kiste an den Fluss.",
        "Ida öffnet die Kiste an der Furt.",
        "Die Ente tritt heraus und steht.",
        "Dann trudelt sie in den Fluss hinein.",
        "Rudi nennt die Stelle seit dieser Stunde Enten-Furt.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Alltag. Ein rotes Fahrrad ist fort, eine Linie in der Erde führt
// hinter die Halle. Kein „nicht", kein „mit" - erzählt wird an Dingen.
// ───────────────────────────────────────────────────────────────────────────
const DAS_ROTE_FAHRRAD: Serie = {
  slug: "das-rote-fahrrad",
  titel: "Das rote Fahrrad",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Selin stellt das rote Fahrrad an die Halle.",
        "Sie hakt das Rad an den Halter.",
        "Dann rennt sie in die Halle hinein.",
        "Die Stunde dauert und dauert.",
        "Dann ist der Halter leer.",
        "Das rote Fahrrad ist fort.",
        "Selin steht still.",
        "Theo hört es und rennt heran.",
        "Er sieht den Halter an.",
        "Da ist eine Linie in der Erde.",
        "Die Linie hört erst hinter der Halle auf.",
        "Selin und Theo sehen einander an.",
      ],
    },
    {
      lines: [
        "Hinter der Halle steht eine Tonne.",
        "Nahe der Tonne ist Stroh.",
        "Die Linie endet an der Tonne.",
        "Theo öffnet die Tonne.",
        "In der Tonne ist nur Stroh.",
        "Und ein Reifen, rot und leer.",
        "Selin kennt den Reifen.",
        "Es ist ihr Reifen.",
        "Nur: das Rad ist fort.",
        "Theo fasst in das Stroh hinein.",
        "Er findet eine Karte, nass und alt.",
        "Auf der Karte steht ein Ort: Rote Insel.",
      ],
    },
    {
      lines: [
        "Die Rote Insel ist keine Insel.",
        "Alle nennen die Halde an der Allee so.",
        "Selin und Theo rennen die Allee hinunter.",
        "Sie stehen an der Halde und hören.",
        "Da ist ein Ton, hell und hart.",
        "Es ist Eisen an Eisen.",
        "Hinter einer Tanne steht ein Alter.",
        "Er hat eine Rolle Draht in der Hand.",
        "An der Tanne steht das rote Fahrrad.",
        "Der Reifen fehlt, der Sattel ist lose.",
        "Selin ruft: Das ist unser Rad!",
        "Der Alte sieht sofort auf.",
      ],
    },
    {
      lines: [
        "Der Alte redet erst nie.",
        "Dann nennt er den Fund an der Tonne.",
        "Er fand das Rad ohne Reifen an der Allee.",
        "Er sortiert Eisen, seit Jahren, an der Halde.",
        "Ein rotes Rad ohne Reifen ist Eisen, denkt er.",
        "Selin nennt den Halter an der Halle.",
        "Sie nennt den Titel auf der Latte.",
        "Der Alte hört still.",
        "Dann hakt er den Sattel tief und rollt das Rad heran.",
        "Er hat drei Reifen in einer Kiste.",
        "Einer ist rot.",
        "Theo hat eine Idee: eine Kanne Tee in der Halle.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens · Ein Riss in einem Ruder, eine Stunde vor dem Start, und die Frage,
// ob ein Fund allein einem selbst hilft oder allen.
// ───────────────────────────────────────────────────────────────────────────
const DAS_RUDER: Serie = {
  slug: "das-ruder",
  titel: "Das Ruder",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Nora holt das Ruder aus der Halle.",
        "Der Start ist in einer Stunde.",
        "Sie testet die Naht, die Kante, die Nut.",
        "An der dritten Latte findet sie den Riss.",
        "Der Riss ist fein und dunkel.",
        "Er endet erst an der Nut.",
        "Nora fasst das Ruder an.",
        "Ein Ruder unter Last hat keinen Riss.",
        "Das ist die erste Order der Trainerin.",
        "Nora denkt an die Frist.",
        "Sie denkt an die Liste an der Halle.",
        "Ihr Titel steht dort auf der dritten Reihe.",
      ],
    },
    {
      lines: [
        "Nora rennt in die Halle.",
        "Die Trainerin ist fort, das Telefon ist tot.",
        "Es ist keiner da.",
        "Nora stellt das Ruder an den Halter.",
        "Dann sieht sie den Halter an.",
        "Der Halter ist alt und lose.",
        "Die Ruder stehen dort ohne Halt.",
        "Drei Ruder stehen an der Kante der Latte.",
        "Nora fasst eines an: da ist ein Riss.",
        "Sie fasst das andere an: der Riss ist da.",
        "Es ist nie ihr Ruder allein.",
        "Es sind alle.",
      ],
    },
    {
      lines: [
        "Nora hat die Order in der Hand.",
        "Sie kann still sein und starten.",
        "Ein Ruder aus der Reihe ist heil.",
        "Sie kann es an ihre Stelle stellen.",
        "Dann startet sie, und keiner sieht den Riss.",
        "Oder sie nennt die Risse - dann startet keiner.",
        "Es ist eine Frist, es ist eine Stunde.",
        "Nora steht an der Halle.",
        "Sie sieht das Ufer, den Kanal, die Reihe der Ruder.",
        "Sie denkt an die dritte Latte.",
        "Unter Last ist ein Riss keine Linie.",
        "Er ist ein Ende.",
      ],
    },
    {
      lines: [
        "Die Trainerin ist erst in der dritten Stunde da.",
        "Nora nennt die Risse: drei, an drei Rudern.",
        "Die Trainerin hört still.",
        "Dann ist der Start fort.",
        "Keiner ruft, keiner dankt.",
        "Ein Teil der Reihe redet leise.",
        "Nora hört jedes Detail.",
        "Sie stellt ihr Ruder an den Haken.",
        "Die Trainerin ordnet einen neuen Halter an.",
        "Sie ordnet eine Liste an: jedes Ruder, jede Naht.",
        "Nora steht als Erste auf der Liste.",
        "Ihr Start ist fort, ihr Ruder ist heil.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens · Ein altes Telefon in einer leeren Diele ruft in dunklen Stunden.
// Die Auflösung ist kein Trick, sondern ein Haken in einem Kasten.
// ───────────────────────────────────────────────────────────────────────────
const DER_ANRUFER: Serie = {
  slug: "der-anrufer",
  titel: "Der Anrufer",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "mystery",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "In der Diele der Tante steht ein altes Telefon.",
        "Es ist rot und hat eine Rolle statt Tasten.",
        "Seit Jahren ruft es nie.",
        "Dann, in einer dunklen Stunde, ruft es.",
        "Lina steht in der Diele.",
        "Der Hörer ist kalt.",
        "Sie hört einen Ton, tief und fern.",
        "Der Ton hat kein Ende.",
        "Dann ist der Draht still.",
        "Lina hakt den Hörer ein.",
        "Sofort ruft das Telefon erneut.",
        "Und erneut ist da nur der Ton.",
      ],
    },
    {
      lines: [
        "Lina ruft Nadir an.",
        "Nadir kennt jeden alten Draht des Hauses.",
        "Er steht in der Diele und hört den Ton.",
        "Der Ton ist keine Sirene.",
        "Er ist ein Tasten-Ton, sehr alt.",
        "Nadir tastet den Draht an der Diele.",
        "Der Draht rollt unter die Diele.",
        "Er endet an einer Luke.",
        "Hinter der Luke sind Stufen in den Keller.",
        "Der Keller ist seit Jahren dunkel.",
        "Nadir öffnet die Luke.",
        "Unten ist der Ton lauter.",
      ],
    },
    {
      lines: [
        "Lina holt eine Laterne aus der Kiste.",
        "Die Stufen in den Keller sind nass.",
        "Unten ist eine Halle aus Stein.",
        "An der Kante steht ein Kasten.",
        "Der Kasten ist alt und rostet.",
        "Der Draht hakt in ihn hinein.",
        "Nadir öffnet den Kasten.",
        "Da ist eine Rolle, eine Feder, ein Haken.",
        "Und ein Detail: der Haken ist heraus.",
        "Ist der Haken heraus, ruft das Telefon.",
        "Lina fasst den Haken an.",
        "Da hört sie hinter der Halle einen Tritt.",
      ],
    },
    {
      lines: [
        "Nadir steht still.",
        "Erst denkt Lina an eine Ratte.",
        "Ein Tritt ist keine Ratte.",
        "Hinter der Halle ist eine Luke in der Erde.",
        "In der Luke steht ein Alter, sehr still.",
        "Er hat ein Laken, eine Kiste, Stroh.",
        "Er ist es, der in jeder dunklen Stunde an den Haken tritt.",
        "Er kennt das Telefon nie.",
        "Lina redet leise: Hier ist es kalt.",
        "Der Alte nennt seinen Titel nie.",
        "Er ist seit Jahren ohne Adresse.",
        "Lina holt das Laken der Tante und eine Kanne Tee.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens · Elf Lose in einem Hut, drei freie Stellen - und ein Fund, der die
// Erste, die ihn macht, selbst am wenigsten kostet.
// ───────────────────────────────────────────────────────────────────────────
const DAS_LOS: Serie = {
  slug: "das-los",
  titel: "Das Los",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Drei Stellen sind frei, elf Kinder sind in der Klasse.",
        "Der Lehrer stellt einen Hut auf die Latte.",
        "In den Hut fallen elf Lose.",
        "Jedes Los ist ein Streifen aus einer Liste.",
        "Elif faltet ihres fein.",
        "Der Lehrer dreht den Hut.",
        "Dann tastet er hinein.",
        "Er holt drei Lose heraus.",
        "Er liest: Toni, Elif, Halil.",
        "Elif hört ihren Titel und ist still.",
        "Toni ruft, Halil ruft.",
        "Elif sieht in den Hut hinein.",
      ],
    },
    {
      lines: [
        "Der Hut ist nie leer.",
        "Da sind die anderen Lose.",
        "Elif holt eines heraus.",
        "Es ist fein - keine Falte, keine Linie.",
        "Ein anderes ist hart und starr.",
        "Elif faltet es auf.",
        "In der Falte ist eine Linie, rot.",
        "Sie faltet ein drittes auf: keine Linie.",
        "Ein Los hat eine Linie, das andere nie.",
        "Elif ordnet alle Lose auf der Latte.",
        "Drei Lose sind hart und starr.",
        "Und in allen dreien ist die rote Linie.",
      ],
    },
    {
      lines: [
        "Elif steht allein in der Klasse.",
        "Ihr Los ist fein und ohne Linie.",
        "Ihre Stelle ist also fair.",
        "Toni und Halil - ihre Lose sind starr.",
        "Elif kennt Toni seit den ersten Ferien.",
        "Sie kennt Halil erst seit einer Frist.",
        "Nennt sie den Fund, ist die Fahrt fort.",
        "Nennt sie ihn nie, startet die Fahrt in einer Frist.",
        "Sie sieht den Hut an.",
        "Der Hut ist alt und rot.",
        "Elif holt alle Lose in ihre Hand.",
        "Dann steht der Lehrer in der Halle.",
      ],
    },
    {
      lines: [
        "Elif hat die Lose in der Hand.",
        "Der Lehrer sieht sie an.",
        "Er nennt keine Order.",
        "Elif redet: Drei Lose sind starr, die anderen nie.",
        "Der Lehrer ist erst still.",
        "Dann redet er: Der Hut ist alt.",
        "Elif hört den Ton und kennt ihn.",
        "Es ist ein Ton ohne Fakt.",
        "Sie stellt die Lose auf die Latte, in einer Reihe.",
        "Jeder in der Klasse kann sie sehen.",
        "Elif nennt es nie erneut.",
        "Die Reihe der Lose redet allein.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// erwachsen · Eine Kantine an einer Halle, eine Kanne Tee und ein Teller, den
// keiner holt. Kein Fahrplan (p) - die Order steht auf einer Latte.
// ───────────────────────────────────────────────────────────────────────────
const DIE_KANTINE: Serie = {
  slug: "die-kantine",
  titel: "Die Kantine",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Roland öffnet die Kantine in der dritten Stunde.",
        "Er stellt den Herd an und dreht die Kanne auf.",
        "Aus der Halle hört er die Laster.",
        "Es sind die alten Fahrer, es ist die alte Order.",
        "Dann tritt Ilse herein.",
        "Ilse ist auf der Linie in den Norden.",
        "Sie tritt seit Jahren in dieser Stunde herein.",
        "Sie isst Kartoffeln und Nudeln, sonst nie.",
        "Sie redet leise, sie dankt, sie tritt hinaus.",
        "Roland stellt ihren Teller ohne Order hin.",
        "In dieser Stunde ist die Kantine still.",
        "Dann, in einer dunklen Stunde, tritt Ilse nie herein.",
      ],
    },
    {
      lines: [
        "Roland stellt den Teller in die Lade.",
        "Er denkt an einen Fehler in der Order.",
        "In der dritten Stunde ist der Teller kalt.",
        "Er stellt ihn in die Tonne.",
        "Erneut in einer dunklen Stunde: keine Ilse.",
        "Erneut ein Teller in der Tonne.",
        "Roland kennt hier alle Fahrer.",
        "Er nennt ihre Linien, ihre Laster, ihre Stunden.",
        "Keiner sieht Ilse in dieser Stunde.",
        "Ein Fahrer nennt eine neue Order aus der Halle.",
        "Eine Linie ist fort, eine andere ist neu.",
        "Roland hört den Titel der neuen Linie und ist still.",
      ],
    },
    {
      lines: [
        "Die neue Linie hat an der Kantine keinen Halt.",
        "Es ist keine Order des Fahrers.",
        "Es ist eine Order der Halle.",
        "Roland stellt den Herd aus.",
        "In der leeren Kantine ist der Ton anders.",
        "Er hört den Rost in der Rinne.",
        "Er hört den Draht, der an die Halle hakt.",
        "Er ordnet die Teller, die Kannen, die Karten.",
        "Dann steht er allein an der Kasse.",
        "Ilse ist eine Fahrerin aus einer Reihe.",
        "Nur: der Teller ist keine Reihe.",
        "Roland holt eine alte Kanne aus der Lade.",
      ],
    },
    {
      lines: [
        "Er tut Tee in die Kanne und dreht sie fest.",
        "Er stellt Nudeln in eine Dose, Kartoffeln in eine andere.",
        "Dann rennt er in die Halle.",
        "In der Halle stehen die Laden der Fahrer.",
        "Ilses Lade ist offen und leer.",
        "Roland stellt die Kanne und die Dosen hinein.",
        "Er faltet eine Karte: Die Linie hat hier keinen Halt.",
        "Er notiert: Die Kantine ist offen, seit Jahren.",
        "Er hakt die Lade fest und ist fort.",
        "Erst in einer anderen Frist steht Roland erneut in der Halle.",
        "In der Lade steht die Kanne, leer und rein.",
        "Und eine Karte: Der Tee ist stark.",
      ],
    },
  ],
};


// ───────────────────────────────────────────────────────────────────────────
// teens · Eine alte Halde, eine Linie aus Eisen und eine Kluft, die auf
// keiner Liste steht. Ohne „oben" (b) steht hier alles „auf der Höhe".
// ───────────────────────────────────────────────────────────────────────────
const DIE_HALDE: Serie = {
  slug: "die-halde",
  titel: "Die Halde",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Hinter der Allee steht die Halde.",
        "Die Halde ist alt und hat keinen Titel.",
        "Alle nennen sie nur so: die Halde.",
        "Steine, Sand, Eisen, Rost.",
        "Doris rennt die erste Stufe hinauf.",
        "Salih hakt seine Hand in die Kante.",
        "Auf der Höhe ist die Erde hart und offen.",
        "Eine Linie aus Eisen leitet in die Halde hinein.",
        "Es ist eine alte Rinne, tief in den Stein.",
        "Doris fasst das Eisen an: es ist kalt.",
        "Sie tritt darauf.",
        "Da sinkt die Erde unter ihr.",
      ],
    },
    {
      lines: [
        "Doris sinkt in eine Kluft.",
        "Sie sinkt fast drei Ellen tief.",
        "Dann hakt ihr Stiefel an einer Latte.",
        "Sie steht still, in dunkler Luft.",
        "Auf der Höhe ruft Salih.",
        "Doris ruft ihn heran.",
        "Ihre Hand findet Stein, Sand, Eisen.",
        "Kein Ende, kein Halt darunter.",
        "Salih steht an der Kante.",
        "Er sieht nur Erde und einen Riss.",
        "Er ruft: Halt still!",
        "Dann rennt er die Halde hinunter.",
      ],
    },
    {
      lines: [
        "Salih hat kein Telefon.",
        "Er rennt an die Allee.",
        "Dort steht das Haus an der Kehre.",
        "Er tritt an das Tor.",
        "Eine Alte öffnet.",
        "Salih redet, hastet, ruft.",
        "Die Alte ruft den Notruf an.",
        "Es dauert, dann sind sie da.",
        "Salih leitet sie die Halde hinauf.",
        "Auf der Höhe ist es still.",
        "Er ruft: Doris!",
        "Erst hört er nur den Sand.",
      ],
    },
    {
      lines: [
        "Dann ist da ein Ton, sehr fein.",
        "Doris steht in der Kluft, ihre Hand an der Latte.",
        "Ein Seil sinkt in die Kluft hinein.",
        "Doris fasst das Seil an.",
        "Ihre Hand ist kalt und starr.",
        "Dann ist sie auf der Höhe.",
        "Ihre Knie sind rot, ihr Stiefel ist heil.",
        "Der Retter nennt die Kluft alt und tief.",
        "Er nennt sie: eine Sohle, die keiner listet.",
        "Salih sieht die Linie aus Eisen an.",
        "Sie leitet in die Halde, tief in den Stein.",
        "Und keiner an der Allee kennt sie.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens · Eine Insel in der Furt, ein Kahn und eine Flut, die nie ansagt.
// Der Ausweg ist Handwerk, keine Rettung von aussen.
// ───────────────────────────────────────────────────────────────────────────
const DIE_INSEL: Serie = {
  slug: "die-insel-in-der-furt",
  titel: "Die Insel in der Furt",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "natur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Die Insel in der Furt ist klein und leer.",
        "Nur Sand, drei Tannen, eine alte Latte.",
        "Tarik und Elin stellen den Kahn an das Ufer.",
        "Sie haken die Leine an eine Tanne.",
        "Der Fluss steht tief, die Furt ist hart.",
        "Sie stellen eine Kanne in den Sand.",
        "Elin liest, Tarik rollt die Leine auf.",
        "In der dritten Stunde ist der Fluss anders.",
        "Er ist lauter und dunkler.",
        "Der Sand an der Furt ist fort.",
        "Tarik steht auf und sieht den Kahn an.",
        "Die Leine ist fest, die Tanne ist fest - nur der Sand nie.",
      ],
    },
    {
      lines: [
        "Der Fluss steht höher.",
        "Er rollt Erde und Latten heran.",
        "Elin fasst die Leine an.",
        "Der Kahn dreht und hakt.",
        "Eine Latte trifft ihn an der Seite.",
        "Da ist ein Riss, fein und tief.",
        "In den Kahn tritt der Fluss.",
        "Elin ruft: Los, heraus!",
        "Tarik holt die Kanne und die Karte.",
        "Der Kahn sinkt an der Leine.",
        "Dann ist er unter der Flut.",
        "Die Insel ist eine Insel ohne Kahn.",
      ],
    },
    {
      lines: [
        "Elin ordnet die Fakten, laut und still.",
        "Die Furt ist tief, die Flut ist stark.",
        "Der Fluss ist kalt.",
        "Drei Tannen stehen auf der Insel.",
        "Eine Latte, eine Leine, eine Kanne.",
        "Tarik sieht an das andere Ufer.",
        "Dort steht ein Halter aus Eisen.",
        "Alte Fahrer haken dort ihre Leinen ein.",
        "Elin holt die Leine aus der Tanne.",
        "Sie hat drei Ellen und ein Ende.",
        "Ein Seil ist keine Furt.",
        "Nur: ein Seil ist ein Halt.",
      ],
    },
    {
      lines: [
        "Tarik hakt die Leine an die erste Tanne.",
        "Elin knotet ein Ende an die Latte.",
        "Die Latte trudelt in die Furt hinein.",
        "Der Fluss holt sie und dreht sie.",
        "Dann hakt die Latte an den Halter.",
        "Elin holt die Leine an, hart und still.",
        "Sie ist fest.",
        "Tarik tritt in die Flut.",
        "Der Fluss ist an seinen Knien, dann an seiner Hand.",
        "Er hat die Leine in der Faust.",
        "Er landet, dann leitet er Elin heran.",
        "Hinter ihr ist die Insel: drei Tannen, keine Latte, kein Kahn.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// erwachsen · Ein Hafen, ein alter Kahn ohne Herrn und eine Order, die keine
// Hand ist. Kein Wasser (w), keine Pumpe (p) - die Flut steht in der Luke.
// ───────────────────────────────────────────────────────────────────────────
const DER_KAHN: Serie = {
  slug: "der-kahn",
  titel: "Der Kahn",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Astrid hat den Hafen an der Insel in Order.",
        "Neun Leinen, neun Halter, eine Liste.",
        "Der alte Kahn steht an der dritten Latte.",
        "Er ist rot und rostet, seit Jahren.",
        "Sein Herr ist alt und selten da.",
        "In einer dunklen Stunde steht der Kahn tief.",
        "Astrid tritt auf den Kahn: er sinkt unter ihr.",
        "In der Luke steht die Flut.",
        "Sie ruft den Herrn an: kein Ton.",
        "Sie ruft erneut: kein Ton.",
        "Der Kahn hat drei Leinen an drei Haltern.",
        "Sinkt er, holt er die Reihe hinunter.",
      ],
    },
    {
      lines: [
        "Astrid holt die Liste aus der Halle.",
        "Die Order des Hafens ist klar: jeder Kahn hat einen Herrn.",
        "Ist der Herr fort, hat der Kahn keine Stelle.",
        "Nur: die Order ist keine Hand.",
        "Astrid holt eine Kanne und leert die Luke.",
        "Sie leert, sie leert, sie leert.",
        "Die Flut in der Luke sinkt eine Elle.",
        "Dann steht sie erneut.",
        "Der Riss ist unter der Flut.",
        "Sie findet ihn nie.",
        "Ihre Hand ist kalt, ihre Knie sind nass.",
        "In der dritten Stunde steht der Kahn fast unter der Flut.",
      ],
    },
    {
      lines: [
        "Astrid steht an der dritten Latte.",
        "Sie hat ein Eisen in der Hand.",
        "Drei Leinen halten den Kahn.",
        "Drei Leinen halten die Reihe an den Kahn.",
        "Es ist eine Order, ein Eisen, ein Tritt.",
        "Sinkt der Kahn allein, ist er fort.",
        "Sinkt er an der Reihe, ist alles fort.",
        "Astrid kennt den Herrn seit Jahren.",
        "Sie kennt seinen Titel, seine Hand, seine Stunden.",
        "Sie kennt den Kahn.",
        "Dann stellt sie das Eisen an die erste Leine.",
        "Sie hakt es ein und tritt.",
      ],
    },
    {
      lines: [
        "Die erste Leine löst und rollt in die Flut.",
        "Die andere ist starr und hart.",
        "Astrid dreht das Eisen.",
        "Dann ist die andere fort.",
        "Der Kahn dreht in die Furt hinein.",
        "Er dreht, er sinkt, er steht dann still.",
        "Er sinkt in der Furt, tief und ohne Ton.",
        "Die Reihe hinter ihr steht heil.",
        "Astrid notiert die Stunde, die Order, das Eisen.",
        "Erst in einer anderen Frist ruft der Herr an.",
        "Er nennt keine Order und keinen Fehler.",
        "Er nennt nur eine Frist: Er holt den Kahn heraus.",
      ],
    },
  ],
};

/** Die deutschen Serien der Charge O1 (Sprosse 17 der neuen Folge). */
export const SERIEN_O_FOLGE: Serie[] = [
  DIE_ENTE_IN_DER_RINNE,
  DAS_ROTE_FAHRRAD,
  DAS_RUDER,
  DER_ANRUFER,
  DAS_LOS,
  DIE_KANTINE,
  DIE_HALDE,
  DIE_INSEL,
  DER_KAHN,
];
