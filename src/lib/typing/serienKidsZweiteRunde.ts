/**
 * ZWEITE KINDER-RUNDE (Charge K2, 22.08.2026) - Nachschub fuer die deutsche
 * `kids`-Buecherei an den fruehen Sprossen 13, 17 und 20.
 *
 * ── DER BEFUND, DER DIESE DATEI AUSLOEST ──────────────────────────────────
 *
 * Gemessen mit `npx tsx scripts/_dreistufen.mts` (Abschnitt 4, Regal an den
 * Punkten 13/17/20/22/26/31/99), Stand 21.08.2026:
 *
 *     de/kids    [ 2,  5,  9, 18, 21, 35, 35]
 *     de/teens   [ 4, 10, 23, 26, 31, 50, 50]
 *
 * Vor dem vollen Alphabet ist das Kinder-Regal also nur halb so tief wie das
 * der Jugendlichen - und am groessten ist der Abstand genau dort, wo die
 * meisten Kinder wirklich stehen: bei 17 gelernten Einheiten (5 gegen 10) und
 * bei 20 (9 gegen 23). Die Charge I1 hat 2026 im August die teens-Treppe
 * gebaut und dabei sieben geerbte Kinderserien aus dem teens-Regal genommen;
 * die kids-Seite hat seither nichts Eigenes dazubekommen. Diese Datei holt das
 * nach: **zwoelf** Serien, ausschliesslich `stufen: ["kids"]`, verteilt
 * 2 / 5 / 5 auf die Sprossen 13 / 17 / 20.
 *
 * Warum der Schwerpunkt auf 17 und 20 liegt: an der Sprosse 13 ist der Abstand
 * zu teens klein (2 gegen 4) und der Tastensatz so eng, dass jede weitere
 * Serie fast dieselben zweihundert Woerter benutzen muesste - dort waeren mehr
 * Serien vor allem mehr vom Gleichen. An 17 und 20 dagegen ist Deutsch schon
 * eine erzaehlbare Sprache, und dort fehlt am meisten.
 *
 * ── DAS BUDGET JE SPROSSE (gemessen, nicht zitiert) ───────────────────────
 *
 * Die Einfuehrungsreihenfolge hat sich am 21.08. geaendert (Charge O1: das `o`
 * steht jetzt direkt hinter dem `h`). Die Saetze unten sind deshalb frisch an
 * `INTRO_ORDER`/`SHIFT_UNIT` gemessen - `npx tsx scripts/_k2check.mts --budget`
 * druckt sie jederzeit neu:
 *
 *     n=13   frei: a d e f i j k l n r s t ö            (13 Buchstaben + ⇧)
 *     n=17   frei: + h o u                              (16 Buchstaben)
 *     n=20   frei: + c g m                              (19 Buchstaben)
 *
 * **n=13** - das schmalste Budget des ganzen Bestands. Gesperrt sind
 * `b c g h m o p q u v w x y z ä ü ß`, und damit:
 *  • **kein h** - kein *hat, hier, Haus, Hand, sehen, gehen, stehen, fehlen,
 *    hoch, ihm, ihn, ihr, Lehrer, Nacht(auch c), Jahr*. Es gibt in dieser
 *    Sprosse KEINE erwachsene Bezugsperson: Lehrer, Lehrerin, Hausdienst,
 *    Mutter, Vater, Oma, Frau, Mann tragen alle ein gesperrtes Zeichen. Beide
 *    13er-Serien spielen deshalb unter Kindern.
 *  • **kein u** - kein *und*, kein *auf/aus*, kein *nur*, kein *nun*, kein
 *    *unter*, kein *Stunde*, kein *Freund*. Verbunden wird mit Komma-Reihen,
 *    mit *dann*, *denn*, *als*, *dass* (alle vier frei) oder gar nicht.
 *  • **kein o** - kein *so, oder, ohne, oft, dort, rot, Tor, Foto, Ton*.
 *  • **kein m** - kein *im/am/mit/dem/einem/man/Name*; der Dativ Singular
 *    maskulin/neutrum existiert nicht. Orte stehen feminin (*an der Tafel, in
 *    der Klasse, an der Linde*), im Akkusativ (*in die Diele*) oder im Dativ
 *    Plural (*in den Ferien, an den Sesseln*).
 *  • **kein g** - kein ge-Partizip, kein *Tag, lang, liegt, legt, sagt, fertig,
 *    Anfang, Finger, eng*. Erzaehlt wird im Praesens; die Vergangenheit
 *    liefern *fand, fiel, sank, stand, trat, traf, las, kannte, nannte,
 *    rannte*.
 *  • **kein c** - kein *nicht, ich, auch, doch, noch, Tisch(!), Jacke(!),
 *    nicken(!)*, kein sch- und kein ch-Wort. Verneint wird mit *kein* und
 *    *nie*; ein Klassenraum hat hier Sessel, keine Tische.
 *  • **kein b w z v p ä ü ß** - kein *aber/haben/bleibt*, kein *war/wir/was/
 *    wie/wo*, kein *zu/Zeit/jetzt/sitzt/setzt*, kein *von/vor/viel*, kein
 *    *Papier/Platz/Lappen*, keine Umlaute ausser `ö`.
 *  ZEITWOERTER an dieser Sprosse: es gibt genau *die Frist*, *seit*, *erst*,
 *  *dann*, *stets*, *selten* - und *die Ferien*. Mehr nicht.
 *  ZAHLWOERTER: *drei, neun, elf* (und *eins*, *tausend*). Gesperrt: zwei,
 *  vier, fuenf, sechs, sieben, acht, zehn, hundert.
 *
 * **n=17** (+ h o u) - der Satz, auf den schon `serienOFolge.ts` getextet ist;
 * dessen Dateikopf ist die ausfuehrliche Merkliste. Kurz: jetzt gibt es *und,
 * auf, aus, unter, hinter, heraus, hat, hier, so, oft, ohne, oder, also,
 * sofort, dort, rot, Haus, Hand, Uhr, Stunde, Hof, Ofen, Ton, Not, Los, Foto,
 * Telefon, Luft, Laterne, Laken, Stroh, Ohren*. Weiterhin gesperrt sind
 * `b c g m p q v w x y z ä ü ß`, und beim Schreiben DIESER sieben Serien sind
 * zusaetzlich zu den in `serienOFolge.ts` notierten Loechern aufgelaufen:
 *  • **kein sich** (c) - also KEIN einziges reflexives Verb. Kein *setzt sich,
 *    rührt sich, stellt sich, freut sich*. Ersatz: *rastet, lehnt, steht,
 *    tritt, ist still*.
 *  • **hält, fällt, läuft, trägt** sind ueber das `ä` gesperrt, `halten`
 *    (Plural), `hielt` und `halt!` dagegen frei. Wo eine dritte Person
 *    noetig war, steht *fasst, hakt, dreht, tut, holt*.
 *  • **kein Schritt, keine Schere, keine Treppe, kein Tisch, kein Buch, kein
 *    Blatt, kein Mund, kein Auge, kein Arm, kein Kopf** - der Koerper ist auf
 *    *Hand, Nase, Ohren, Haut, Stirn, Ferse, Knie* zusammengeschrumpft, das
 *    Klassenzimmer auf *Tafel, Kreide, Heft, Seite, Note, Laterne, Kiste*.
 *    Schritte sind *Tritte*, Treppenstufen sind *Stufen*.
 *  • **lacht, riecht, sucht, braucht, liegt, legt, sagt, fragt, geht** fehlen
 *    allesamt. Geredet wird mit *redet, ruft, nennt, fordert, hört*; gesucht
 *    wird durch *tastet, findet, teilt, öffnet*.
 *  • Neutrum und Maskulinum haben KEINEN Dativ Singular (*dem/einem*). Darum
 *    steht in diesen Serien nie *auf dem Hof* und nie *in dem Stall*, sondern
 *    *auf der Tenne*, *an der Furt*, *in den Ferien*, *auf den Hof*. (Und
 *    *Stallungen* traegt ein g - der Stall bleibt Singular und Nominativ.)
 *
 * **n=20** (+ c g m) - hier wird Deutsch zum ersten Mal fast normal: *ich,
 * nicht, sich, auch, noch, schon, doch, nach, durch, Nacht, Licht, macht,
 * sucht, sagt, legt, geht, gegen, gleich, genug, mit, im, am, man, dem, einem,
 * Morgen, Milch, Mond, Schule, schnell, schön, Schnee, Schatten, Storch,
 * Fuchs, Grille, Garten, Garage*. Gesperrt bleiben `b p q v w x y z ä ü ß`:
 *  • **kein w** - kein *war/wir/was/wie/wo/wenn/weil/werden*, kein *Wasser,
 *    Wald, Wind, Winter(!), Weg, wieder, etwas*. Der Winter heisst hier
 *    *Schnee, Frost, Eis, Kälte*(nein, ä!) - also *Schnee, Frost, Eis*.
 *  • **kein b** - kein *aber, haben, bleibt, bei, bis, beide, oben, neben,
 *    Abend, Baum, Brot, Ball*. Ohne *haben* und ohne *war* gibt es weiterhin
 *    kein Perfekt: es laeuft alles im Praesens oder Praeteritum.
 *  • **kein p** - und damit **kein *spielen*, kein *Spiel*, kein *Spass***,
 *    die drei naheliegendsten Kinderwoerter ueberhaupt. Gespielt wird nicht,
 *    es wird *gerannt, gesammelt, geklettert, geholfen, gesungen, gemalt*.
 *  • **kein z, v, ä, ü, ß** - kein *zu* (und damit keine um-zu-Fuegung), kein
 *    *Zeit/Katze/Herz/ganz/tanzen*, kein *von/vor/viel/vier*, kein *für/Tür/
 *    früh/hält/läuft/Stück/groß/Straße*.
 *  ZAHLWOERTER ab hier: *eins, drei, acht, neun, elf, hundert, tausend,
 *  Million*. Gesperrt bleiben zwei, vier, fuenf, sechs, sieben, zehn, zwoelf.
 *
 * ── ENTSCHEIDUNGEN DIESER CHARGE (selbst getroffen, damit sie nachlesbar sind)
 *
 *  1. VERTEILUNG 2/5/5 statt 2/5/4 - zwoelf Serien, weil an der Sprosse 20 der
 *     Abstand zu teens mit 9 : 23 am groessten ist.
 *  2. KEINE Wissens-Serie. Unterhalb von n=20 fehlt jede Masseinheit (Meter,
 *     Minute, Million tragen ein m), und ab n=20 fehlen *Prozent* und *Zeit*.
 *     Ein Sachtext ohne Groessenordnung waere eine Behauptung; erzaehlt wird.
 *     Damit tragen alle zwoelf `kind: "geschichte"`.
 *  3. NUR `kids`. Keine dieser Serien traegt zusaetzlich `teens` oder
 *     `erwachsen` - genau das Erben war der Befund der Charge I1.
 *  4. NEUNUNDZWANZIG NAMEN, KEINE WIEDERHOLUNG aus dem Bestand: Nele, Elias,
 *     Frieda, Talia, Dilan, Sina, Aslan, Neda, Rafael, Onur, Nora, Alina,
 *     Latif, Toni, Jonas, Naila, Kaan, Anton, Fadila, Mila, Emil, Hasan,
 *     Greta, Malik, Marlene, Cem, Ronja, Timo, Selma (dazu das Fohlen Hela).
 *     Ida/Rudi/Theo/Selin (serienOFolge) und Elif/Tarik (serienFrueh) kommen
 *     bewusst NICHT noch einmal vor. An den Sprossen 13 und 17 ist die
 *     Namenswahl selbst budgetiert: Namen mit b/c/g/m/p/v/w/z/ä/ü sind dort
 *     unschreibbar (kein Ben, kein Mia, kein Bilal, kein Jacob).
 *  5. ZWOELF THEMEN, jedes hoechstens zweimal: schule, alltag, tiere, natur,
 *     ferien, freundschaft, winter, mystery. Keine dritte Enten-Geschichte.
 *
 * ── FORM UND RECHTE ───────────────────────────────────────────────────────
 *
 * Alle zwoelf Serien sind SELBST VERFASST (Bauplan 27.07. §10) - reale Texte,
 * auch gemeinfreie, halten sich nicht an eine Buchstaben-Freischaltung. Vier
 * Etappen zu zwoelf Zeilen, jede Zeile EIN Satz und hoechstens 85 Zeichen,
 * woertliche Rede OHNE Anfuehrungszeichen (Entscheidung Johannes 28.07.),
 * keine Ziffern, Satzzeichen nur . , - ? ! : ; und nur der einfache
 * Bindestrich ([[feedback_nur_bindestrich]]). Jede Etappe endet mit einem Zug
 * zum Weiterlesen; im Schlusssatz steht keine Moral.
 *
 * Geprueft mit `npx tsx scripts/_k2check.mts` (Sprosse, minTier, Zeilenlaenge,
 * Zeichensatz je Serie).
 */
import type { Serie } from "./serie";

/** Herkunft aller Serien dieser Datei (selbst verfasst, keine Fremdrechte). */
const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SPROSSE 13 · zwei Serien · nur a d e f i j k l n r s t ö
// ═══════════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────────
// kids · Schule. Jeden Morgen steht eine neue Kreide-Linie an der Tafel. Ohne
// „sehen" (h) tastet und erkennt man hier; ohne „Tisch" (c) sitzt die Klasse
// an Sesseln, und ohne „Tag" (g) misst die Frist die Zeit.
// ───────────────────────────────────────────────────────────────────────────
const DIE_KREIDE_AN_DER_TAFEL: Serie = {
  slug: "die-kreide-an-der-tafel",
  titel: "Die Kreide an der Tafel",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 1,
  topic: "schule",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Nele ist als Erste in der Klasse.",
        "An der Tafel ist eine feine Linie.",
        "Die Linie ist Kreide, ein sanfter Faden.",
        "Nele tastet sie an: Die Kreide ist kalt.",
        "Dann tritt Elias ein.",
        "Elias nennt die Linie einen Ast.",
        "Nele nennt sie eine Rinne.",
        "Kein Kind in der Klasse kennt die Linie.",
        "Elias tritt an die Tafel.",
        "Nele tritt an seine Seite: Elias, nein!",
        "Die Linie darf da sein, findet Nele.",
        "Als die Klasse leer ist, ist an der Tafel eine andere Linie.",
      ],
    },
    {
      lines: [
        "Erst sind es drei Linien.",
        "Dann sind es elf.",
        "Die Linien treffen einander an einer Stelle.",
        "Nele nennt die Stelle eine Insel.",
        "Elias findet, es ist ein Kran.",
        "Seit dieser Frist ist Nele stets als Erste in der Klasse.",
        "Sie rastet an der Kante des Fensters.",
        "Nele erkennt kein Kind an der Tafel.",
        "Dann ist an der Tafel eine andere feine Linie.",
        "Nele erkennt es nie.",
        "Sie rastet still, die Klasse ist leer.",
        "Erst da klirrt die Kreide-Kiste.",
      ],
    },
    {
      lines: [
        "Nele tritt an die Kiste.",
        "An der Kiste rastet ein kleines Kind.",
        "Es ist Frieda, das leiseste Kind in der Klasse.",
        "Frieda ist starr, die Kreide klirrt an der Diele.",
        "Nele fasst die Kreide, sie ist still.",
        "Frieda redet leise: Es ist alles fein.",
        "Nele ist still, dann nennt sie es fein.",
        "Frieda ist seit den Ferien stets als Erste in der Klasse.",
        "Erst da redet Frieda: Die Linien sind eine Insel.",
        "Die Insel ist an einer Stelle leer.",
        "Frieda findet allein kein Ende.",
        "Nele fasst die andere Kreide an.",
      ],
    },
    {
      lines: [
        "Nele fasst die Kreide, Frieda leitet die Linie.",
        "Als Erstes ist die Insel da.",
        "Dann treten Elias, Talia, Dilan ein.",
        "Keiner redet, alle fassen eine Kreide.",
        "Elias leitet einen Kran an den Rand.",
        "Talia leitet einen Stern an die Kante.",
        "Dilan leitet einen Delfin in die Rinne.",
        "Die Tafel ist dann keine Tafel: Sie ist eine Insel.",
        "Frieda rastet an der Diele, still.",
        "Nele nennt Frieda die Erste in der Klasse.",
        "Als die Klasse startet, streift keiner die Tafel an.",
        "Die Insel ist seit dieser Frist da, in der Kante der Tafel.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Alltag. Ein Fest an der Linde, eine Kette aus gefalteten Karten, in
// der eine Stelle leer ist. Ohne „fehlt" (h) reisst hier ein Riss die Kette.
// ───────────────────────────────────────────────────────────────────────────
const DAS_FEST_AN_DER_LINDE: Serie = {
  slug: "das-fest-an-der-linde",
  titel: "Das Fest an der Linde",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 1,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "An der Linde ist ein Fest.",
        "Alle Kinder falten Karten.",
        "In jeder Karte ist ein Stern.",
        "Sina faltet die Karten fein.",
        "Aslan fasst den Faden.",
        "Der Faden leitet die Karten in eine Kette.",
        "Die Kette ist elf Karten stark.",
        "Neda leitet die Kette an die Linde.",
        "Die Kette sinkt in den Klee.",
        "Sina, Aslan, Neda fassen an.",
        "Die Kette ist dann an der Linde, fest.",
        "Erst da erkennt Sina: In der Kette ist ein Riss.",
      ],
    },
    {
      lines: [
        "In der Kette ist eine Stelle leer.",
        "An dieser Stelle ist die Karte Rafaels.",
        "Rafael ist erst seit den Ferien in der Klasse.",
        "Er kennt selten ein Kind.",
        "Sina eilt in die Diele.",
        "Da ist keine Karte.",
        "Neda tastet den Sand an der Linde.",
        "Da ist es nass, da ist keine Karte.",
        "Aslan rennt an den See.",
        "Da sind Kies, Erde, Farne.",
        "Aslan findet keine Karte.",
        "Dann rennt Rafael an der Linde in die Ferne.",
      ],
    },
    {
      lines: [
        "Sina rennt in die Ferne.",
        "Rafael rastet an einer alten Latte.",
        "An seiner Seite ist die Karte.",
        "Die Karte ist in drei Teilen.",
        "Rafael redet leise: Alle Kinder kennen einander.",
        "Sina rastet an seine Seite in den Klee.",
        "Sie faltet die drei Teile.",
        "Die drei Teile sind stets ein Stern.",
        "Sina redet: Deine Stelle in der Kette ist leer.",
        "Rafael ist starr.",
        "Dann fasst er die drei Teile.",
        "Erst da klirrt es an der Linde: Die Kette sinkt.",
      ],
    },
    {
      lines: [
        "Die Kette rastet in den Klee.",
        "Alle Karten sind da, keine ist in Teilen.",
        "Neda fasst den Faden an.",
        "Aslan leitet die Kette in die Linde.",
        "Sina faltet Rafaels Stern.",
        "Sie leitet einen Faden in die drei Teile.",
        "Rafael leitet seinen Stern an die leere Stelle.",
        "Die Kette ist dann elf Karten stark.",
        "Die Kette ist an der Linde, sie flattert.",
        "Alle Kinder rasten in den Klee.",
        "Rafael rastet an Sinas Seite.",
        "Sina nennt die Kette elf Sterne, Rafael nennt sie anders.",
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SPROSSE 17 · fuenf Serien · a d e f h i j k l n o r s t u ö
// ═══════════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────────
// kids · Tiere. Ein Ton in der Höhe, eine Luke unter den Latten, ein junger
// Uhu. Ohne „hält" (ä) fassen und halten hier immer mehrere.
// ───────────────────────────────────────────────────────────────────────────
const DER_UHU_HINTER_DER_LUKE: Serie = {
  slug: "der-uhu-hinter-der-luke",
  titel: "Der Uhu hinter der Luke",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Onur hört einen Ton in der Höhe.",
        "Der Ton ist tief und rau.",
        "Er hört ihn erst, als alle still sind.",
        "Nora liest auf der Stufe.",
        "Onur ruft: Hörst du das?",
        "Nora hört nur den Fluss.",
        "Dann ist es still, und der Ton steht in der Luft.",
        "In der Höhe ist eine Luke.",
        "Die Luke ist alt, ihre Latten sind lose.",
        "Onur stellt die Leiter an das Haus.",
        "Nora fasst die Leiter fest an.",
        "Onur öffnet die Luke, und der Ton ist nah.",
      ],
    },
    {
      lines: [
        "In der Luke ist es dunkel.",
        "Onur tastet die Latten an.",
        "Da knistert es an der Seite.",
        "Onur ruht auf der Leiter.",
        "Dann sieht er alles: Stroh, Federn, Erde.",
        "Auf den Latten steht ein Tier.",
        "Es ist klein und rund, seine Federn sind hell.",
        "Onur nennt es Uhu.",
        "Nora ruft: Ist es allein?",
        "Onur sieht in die Höhe: Kein anderes Tier ist da.",
        "Der kleine Uhu tritt auf der Latte hin und her.",
        "Dann tritt der Uhu an die Kante der Luke.",
      ],
    },
    {
      lines: [
        "Nora ruft: Er tritt heraus!",
        "Onur fasst die Luke, nie das Tier.",
        "Der Uhu steht auf der Kante der Luke.",
        "Er tritt hin, er tritt her.",
        "Nora holt ein Laken.",
        "Nora fasst das Laken unter der Luke.",
        "Der Uhu tritt und sinkt.",
        "Er landet in der Falte des Lakens.",
        "Onur eilt die Leiter herunter.",
        "Der Uhu ist heil, seine Federn sind nass.",
        "Nora holt eine Kiste, Onur holt Stroh.",
        "In der Kiste ruht der Uhu - dann hören sie den anderen Ton.",
      ],
    },
    {
      lines: [
        "Der andere Ton ist tief und laut.",
        "Er steht in der Luft, an der Nordkante des Hauses.",
        "Onur sieht in die Höhe.",
        "Auf der Rinne des Hauses steht ein Uhu.",
        "Es ist ein alter Uhu, stark und still.",
        "Onur stellt die Kiste in den Hof.",
        "Er öffnet sie und tritt fort.",
        "Der kleine Uhu tritt heraus.",
        "Der alte Uhu sinkt herunter, ohne einen Ton.",
        "Onur und Nora stehen still an der Diele.",
        "Dann sind alle Uhus in der Höhe, und der Hof ist leer.",
        "Onur und Nora halten die Luke seit dieser Stunde offen.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Natur. Der Efeu an der Nordseite soll fort; in einer Falte des
// Steins ruht eine Kröte. Ohne „sich" (c) steht hier keiner still, er IST es.
// ───────────────────────────────────────────────────────────────────────────
const DER_EFEU_AN_DER_NORDSEITE: Serie = {
  slug: "der-efeu-an-der-nordseite",
  titel: "Der Efeu an der Nordseite",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "natur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "An der Nordseite des Hauses steht ein alter Efeu.",
        "Er ist dunkel, seine Ranken halten die Rinne fest.",
        "Alina steht oft an dieser Seite.",
        "Dort ist es kalt und still.",
        "Latif holt eine Leiter.",
        "Der Hausdienst redet klar: Ende der Stunde ist der Efeu unten.",
        "Alina ist dann still.",
        "Sie tritt in den Efeu hinein.",
        "Die Ranken sind kalt und hart.",
        "Alina tastet die Ranken.",
        "Da hört Alina einen Laut, tief und leise.",
        "Alina fasst eine Ranke, und der Laut ist ihr nah.",
      ],
    },
    {
      lines: [
        "Alina teilt die Ranken.",
        "Dahinter ist die Nordseite: Stein, Sand, alte Erde.",
        "In einer Falte des Steins ist eine kleine Höhle.",
        "In der Höhle ist es nass und kalt.",
        "Alina tastet die Falte aus.",
        "Da tritt es ihr an die Hand.",
        "Alina ruft laut: Latif!",
        "Latif rennt heran.",
        "In der Höhle steht eine Kröte.",
        "Sie ist dunkel und still, ihre Haut ist rau.",
        "Latif redet leise: Sie ruht hier seit Jahren.",
        "Der Hausdienst tritt in den Hof, in der Hand ein Eisen.",
      ],
    },
    {
      lines: [
        "Alina steht in den Ranken und tritt nie fort.",
        "Latif ruft: Halt!",
        "Der Hausdienst steht still.",
        "Latif redet: In der Nordseite ist eine Kröte.",
        "Der Hausdienst tritt heran und sieht in die Falte.",
        "Er sieht nur Erde.",
        "Alina teilt die Ranken erneut.",
        "Dann sieht er sie: dunkel, alt, still.",
        "Er redet: Es ist eine Order, sie steht in der Liste.",
        "Alina fordert: Nur diese Falte, der Rest ist fort.",
        "Der Hausdienst ist still, und keiner redet.",
        "Dann holt er sein Telefon.",
      ],
    },
    {
      lines: [
        "Der Hausdienst redet in das Telefon.",
        "Alina hört nur eins: Erde, Stein, Kröte.",
        "Dann nennt er eine andere Order.",
        "Er trennt den Efeu, nur nie an dieser Falte.",
        "Latif fasst die Ranken auf der anderen Seite.",
        "Alina holt drei Steine.",
        "Sie stellt die Steine an die Falte.",
        "Die Falte ist dann keine Falte: Sie ist ein Tor.",
        "Der Efeu ist unten, die Nordseite ist hell.",
        "Nur an einer Stelle steht der Efeu, dunkel und still.",
        "Die Kröte ruht dort.",
        "Alina tritt oft an die Steine, und selten hört sie den Laut.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Schule. Hinter der Aula ein Flur, in ihm Kisten mit alten Hörnern
// und Flöten. Ohne „Licht" (c) leuchtet hier eine Laterne, nichts sonst.
// ───────────────────────────────────────────────────────────────────────────
const DER_FLUR_HINTER_DER_AULA: Serie = {
  slug: "der-flur-hinter-der-aula",
  titel: "Der Flur hinter der Aula",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "schule",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Hinter der Aula ist ein Flur.",
        "Der Flur ist alt und dunkel.",
        "Ein Tor leitet in ihn hinein.",
        "Das Tor ist seit Jahren fest.",
        "Toni lehnt oft an dieses Tor.",
        "Sie hört Töne, tief und leise.",
        "Jonas hört sie nie.",
        "Naila hört sie oft.",
        "Die drei stehen still, und die Töne halten an.",
        "Toni tastet die Klinke an.",
        "Die Klinke dreht, und der Rost rieselt herunter.",
        "Dann steht das Tor offen, nur eine Handkante.",
      ],
    },
    {
      lines: [
        "Der Flur ist dunkel, die Luft ist alt.",
        "Toni tritt hinein.",
        "Unter ihr knistert Sand.",
        "Jonas holt eine Laterne.",
        "Die Laterne ist hell.",
        "An der linken Seite stehen Kisten.",
        "Naila öffnet die erste Kiste.",
        "In ihr ruht eine Flöte.",
        "Sie ist alt, ihr Eisen ist dunkel.",
        "In der anderen Kiste sind Hörner.",
        "Toni fasst ein Horn an.",
        "Toni holt Luft, und der Flur hallt.",
      ],
    },
    {
      lines: [
        "Der Ton steht in der Luft.",
        "Jonas fasst ein anderes Horn.",
        "Naila findet eine dritte Kiste.",
        "In ihr sind Hefte, alt und lose.",
        "Auf ihren Seiten stehen Noten.",
        "Naila kennt die Noten nie.",
        "Toni liest die erste Reihe.",
        "Sie holt Luft: Der erste Ton ist rein.",
        "Jonas holt Luft, sein Ton ist tiefer.",
        "Naila fasst das Heft und liest den Takt.",
        "Die drei stehen still und halten die Töne.",
        "Dann steht die Lehrerin hinter ihnen.",
      ],
    },
    {
      lines: [
        "Die Lehrerin ist still.",
        "Sie hört, ohne einen Laut.",
        "Dann redet sie: Diese Hefte sind alt.",
        "Toni fasst das Horn fester.",
        "Die Lehrerin redet: In der Aula ist eine Stunde frei.",
        "Sie fordert: Toni, Jonas, Naila - eine Stunde, drei Lieder.",
        "Die drei lernen die Noten, Reihe auf Reihe.",
        "Der Flur ist ihr Ort.",
        "Dann steht die Aula offen.",
        "Toni holt Luft, und der erste Ton steht.",
        "Die Aula ist still, hundert Kinder hören.",
        "Das Tor hinter der Aula ist seit dieser Stunde nie fest.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Ferien. Ein Hof an der Au, ein Fohlen, das nie herantritt. Ohne
// Dativ Singular (dem/einem) steht hier alles auf der Tenne, nie auf dem Hof.
// ───────────────────────────────────────────────────────────────────────────
const DER_FERIENHOF: Serie = {
  slug: "der-ferienhof",
  titel: "Der Ferienhof",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "ferien",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Sina und Kaan reisen in den Ferien auf den Ferienhof.",
        "Der Hof steht an einer Au.",
        "Die Tante holt sie an der Haltestelle.",
        "Der Hof hat einen Stall, eine Tenne, eine Furt.",
        "Der Stall ist laut, dort stehen die Tiere.",
        "Da ist ein Fohlen.",
        "Es ist dunkel, an der Stirn ist es hell.",
        "Die Tante nennt es Hela.",
        "Hela tritt nie heran.",
        "Sina fasst Hafer in die Hand.",
        "Hela steht fern, ohne einen Laut.",
        "Dann dreht Hela und ist fort.",
      ],
    },
    {
      lines: [
        "Die Sonne ist auf, der Hof ist laut.",
        "Kaan holt Stroh, Sina holt Hafer.",
        "Sie stellen den Hafer an das Tor der Tenne.",
        "Dann rasten sie an der Tenne.",
        "Sie sind still, eine Stunde ohne einen Laut.",
        "Hela steht an der Furt.",
        "Sie hört und tritt nie heran.",
        "Dann sinkt die Sonne.",
        "Kaan ist es leid, er steht auf.",
        "Da tut Hela drei Tritte heran.",
        "Sina ist starr, ohne einen Laut.",
        "Hela tritt an den Hafer - und dreht dann fort.",
      ],
    },
    {
      lines: [
        "In der anderen Stunde tut Hela elf Tritte.",
        "Sina öffnet die Hand.",
        "In ihr ist Hafer.",
        "Hela steht nah, ihre Nase ist dunkel und nass.",
        "Sie tastet die Hand an.",
        "Dann frisst sie.",
        "Sina ist still, sie hört nur den Hafer.",
        "Kaan steht an der Tenne, ohne einen Tritt.",
        "Dann ist der Hafer fort.",
        "Hela dreht und tritt an die Furt.",
        "Sina steht auf, ihre Hand ist leer.",
        "Erst da hört sie den Herrn des Hofes: Er ruft laut.",
      ],
    },
    {
      lines: [
        "Der Herr des Hofes steht an der Furt.",
        "Er ruft: Das Tor an der Furt steht offen!",
        "Hinter der Furt ist die Ausfahrt.",
        "Sina rennt, Kaan rennt.",
        "Hela steht in der Furt, das Land ist nass.",
        "Sina öffnet die Hand: Sie ist leer.",
        "Hela hört, ihre Ohren drehen.",
        "Sina tritt drei Tritte in den Hof.",
        "Hela tritt heran, Tritt auf Tritt.",
        "Kaan dreht den Haken, das Tor ist dann fest.",
        "Hela steht auf der Tenne, und Sina lehnt an ihr.",
        "Seit dieser Stunde tritt Hela heran, sofort, ohne Hafer.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Freundschaft. Zwei Höfe, eine Lattenreihe, ein Tor mit Rost. Ohne
// „Nachbar" (c und b) heisst es hier: an der einen Seite, an der anderen.
// ───────────────────────────────────────────────────────────────────────────
const DER_ROST_AN_DER_KLINKE: Serie = {
  slug: "der-rost-an-der-klinke",
  titel: "Der Rost an der Klinke",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "freundschaft",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Eine alte Lattenreihe teilt den Hof.",
        "An der einen Seite ist Anton, an der anderen Fadila.",
        "In der Reihe ist ein Tor.",
        "Das Tor ist alt, an der Klinke ist Rost.",
        "Anton fasst die Klinke.",
        "Sie dreht nie.",
        "Auf der anderen Seite fasst Fadila.",
        "Fadila hört nur den Rost.",
        "Anton ruft: Halte fest!",
        "Fadila fasst fest.",
        "Sie halten und drehen, ohne Ende.",
        "Dann tut es einen Laut - und die Klinke ist in Antons Hand.",
      ],
    },
    {
      lines: [
        "Die Klinke ist lose, das Tor ist fest.",
        "Anton steht still, in seiner Hand das Eisen.",
        "Fadila ruft: Ist es hin?",
        "Anton redet nie.",
        "Er lehnt an der Latte.",
        "Dann redet Fadila: In der Latte ist eine Luke.",
        "Anton findet sie, klein und rund.",
        "Er sieht in sie hinein.",
        "Auf der anderen Seite steht Fadila.",
        "Sie stehen und reden, Stunde auf Stunde.",
        "Fadila nennt ihren Hund, Anton nennt seine Ente.",
        "Erst als die Sonne sinkt, tritt Fadila fort.",
      ],
    },
    {
      lines: [
        "In der anderen Stunde holt Anton Öl.",
        "Er tut es auf den Rost.",
        "Fadila holt eine Feile.",
        "Sie feilt den Rost an ihrer Seite.",
        "Anton tut Öl, Fadila feilt.",
        "Sie tun es, und die Sonne dreht.",
        "Der Rost rieselt in den Sand.",
        "Anton stellt die Klinke an das Eisen.",
        "Die Klinke steht lose, ohne Halt.",
        "Fadila redet: Ein Faden ist der Halt.",
        "Anton dreht einen Faden in das Eisen.",
        "Dann dreht er - und in der Latte tut es einen Laut.",
      ],
    },
    {
      lines: [
        "Das Tor öffnet eine Handkante.",
        "Dann steht es offen.",
        "Anton tritt hinein, Fadila tritt heran.",
        "Sie stehen still.",
        "Dann tut Fadila drei Tritte in Antons Hof.",
        "Da steht die Ente.",
        "Die Ente flattert auf.",
        "Fadilas Hund rennt hinterher.",
        "Anton ruft, Fadila ruft.",
        "Der Hund steht dann still, die Ente ist auf der Rinne.",
        "Anton und Fadila rasten an der Latte, unter der Sonne.",
        "Das Tor steht seit dieser Stunde offen, ohne Klinke.",
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SPROSSE 20 · fuenf Serien · a c d e f g h i j k l m n o r s t u ö
// ═══════════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────────
// kids · Tiere. Ein Fuchs mit einem Ring aus Metall am Hals, eine umgekippte
// Tonne, eine Helferin. Ohne „Spur" und „Faehrte" (p, ae) sind es Tritte.
// ───────────────────────────────────────────────────────────────────────────
const DER_FUCHS_AN_DER_GARAGE: Serie = {
  slug: "der-fuchs-an-der-garage",
  titel: "Der Fuchs an der Garage",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Hinter der Garage steht die Tonne.",
        "In der Nacht macht es dort einen Laut.",
        "Mila hört ihn als Erste.",
        "Am Morgen liegt die Tonne im Gras.",
        "Emil sagt: Es ist ein Marder.",
        "Mila sagt: Ein Marder ist es nicht.",
        "Im Schlamm sind Tritte, klein und rund.",
        "Sie sind nicht die Tritte eines Hundes.",
        "Emil holt die Mutter.",
        "Die Mutter sieht das Loch in der Hecke.",
        "Sie sagt: Da kommt es durch.",
        "In der Nacht stehen Mila und Emil am Fenster.",
      ],
    },
    {
      lines: [
        "Das Licht im Hof ist aus.",
        "Der Mond steht hinter dem Schornstein.",
        "Lange kommt nichts.",
        "Dann macht es einen Laut an der Hecke.",
        "Da kommt es durch das Loch.",
        "Es ist ein Fuchs.",
        "Sein Fell ist dunkel und nass.",
        "Er kommt an die Tonne.",
        "Er hinkt, und er kommt nur langsam an.",
        "Mila sieht genau hin: Um seinen Hals ist ein Ring.",
        "Der Ring ist aus Metall und fest.",
        "Emil rennt in das Haus, doch der Fuchs ist schon fort.",
      ],
    },
    {
      lines: [
        "Am Morgen ruft die Mutter die Tierhilfe an.",
        "Am Mittag kommt eine Helferin.",
        "Sie hat eine Kiste und ein Tuch.",
        "Sie legt die Kiste an das Loch in der Hecke.",
        "In der Kiste ist Fleisch.",
        "Dann gehen alle in das Haus.",
        "Mila und Emil stehen am Fenster, die Helferin steht am Tor.",
        "Die Sonne sinkt, und der Hof ist dunkel.",
        "Es dauert lange.",
        "Dann kommt der Fuchs, langsam und still.",
        "Er hinkt an die Kiste.",
        "Er tritt hinein, und die Kiste macht einen harten Laut.",
      ],
    },
    {
      lines: [
        "Der Fuchs ist in der Kiste.",
        "Er ist still, er macht keinen Laut.",
        "Die Helferin holt die Kiste in ihr Auto.",
        "Sie sagt: Am Nachmittag ist der Ring fort.",
        "Mila und Emil stehen im Hof und sehen dem Auto nach.",
        "Am anderen Morgen kommt das Auto in den Hof.",
        "Der Fuchs ist in der Kiste, sein Hals ist frei.",
        "Die Helferin stellt die Kiste an die Hecke.",
        "Sie macht sie auf und geht fort.",
        "Der Fuchs kommt heraus, langsam.",
        "Er sieht Mila an, lange.",
        "Dann ist er in der Hecke, und im Gras liegt der Ring aus Metall.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Natur. Ein Ton im Schulgarten, der immer an einer anderen Stelle
// steht. Wer einen Tritt macht, hat verloren - erzaehlt wird das Stillstehen.
// ───────────────────────────────────────────────────────────────────────────
const DIE_GRILLE_IM_GRAS: Serie = {
  slug: "die-grille-im-gras",
  titel: "Die Grille im Gras",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "natur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Im Garten der Schule singt es.",
        "Der Ton ist hell und schnell.",
        "Hasan hört ihn am Morgen.",
        "Greta hört ihn auch.",
        "Sie gehen in das Gras.",
        "Dann ist es still.",
        "Sie stehen still, und der Ton kommt an eine andere Stelle.",
        "Hasan geht dorthin.",
        "Dann ist es dort still, und im Gras hinter ihm singt es.",
        "Greta lacht.",
        "Sie sagt: Das Tier ist schneller als du.",
        "Hasan sagt: Morgen finde ich es.",
      ],
    },
    {
      lines: [
        "Am Morgen kommt Hasan als Erster in die Schule.",
        "Der Garten ist nass, und das Gras ist kalt.",
        "Hasan hört nichts.",
        "Er stellt sich an den Rand und ist still.",
        "Er ist so still, dass er die Halme hört.",
        "Dann singt es, klein und nah.",
        "Hasan macht einen Tritt.",
        "Sofort ist es still.",
        "Er lernt es so: Ein Tritt, und der Ton ist fort.",
        "Also macht er keinen Tritt mehr.",
        "Er steht lange, und die Sonne kommt an die Hecke.",
        "Dann singt es an seinem Knie.",
      ],
    },
    {
      lines: [
        "Hasan sieht nur Gras.",
        "Er dreht sich nicht.",
        "Er sucht mit den Augen, nicht mit der Hand.",
        "Die Halme stehen still.",
        "Dann kommt der Ton, und ein Halm dreht sich.",
        "Da ist es.",
        "Die Grille ist dunkel und kleiner als sein Daumen.",
        "Sie hockt am Halm, dicht am Grund.",
        "Sie ist so dunkel, dass Hasan sie fast nicht sieht.",
        "Dann singt sie.",
        "Der Ton kommt aus ihr, und Hasan sieht es genau.",
        "Hinter ihm ruft Greta, und die Grille ist fort.",
      ],
    },
    {
      lines: [
        "Greta sagt: Hast du es?",
        "Hasan sagt nichts, denn die Grille ist fort.",
        "Dann findet er den Halm noch einmal.",
        "Er legt einen kleinen Stein an den Grund.",
        "Greta stellt sich an seine Seite und ist still.",
        "Sie stehen lange.",
        "Dann singt es, und Greta sieht die Grille auch.",
        "Am Mittag holen sie die Klasse.",
        "Elf Kinder stehen im Gras und machen keinen Tritt.",
        "Die Lehrerin steht am Rand.",
        "Dann singt die Grille, und niemand macht einen Tritt.",
        "Der Stein liegt heute noch im Gras.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Winter. Ein roter Handschuh auf einer Latte, kleine Tritte im
// Schnee. Ohne „Winter" und „warm" (w) traegt hier der Schnee die Kaelte.
// ───────────────────────────────────────────────────────────────────────────
const DER_HANDSCHUH_IM_SCHNEE: Serie = {
  slug: "der-handschuh-im-schnee",
  titel: "Der Handschuh im Schnee",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "winter",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "In der Nacht kommt Schnee.",
        "Am Morgen ist der Hof still und hell.",
        "Malik geht als Erster durch den Schnee.",
        "An der Latte am Tor liegt ein Handschuh.",
        "Er ist rot und klein.",
        "Malik nimmt ihn in die Hand.",
        "Er ist nass und kalt.",
        "Marlene kommt an das Tor.",
        "Sie sagt: Der ist nicht aus unserer Klasse.",
        "Malik legt ihn auf die Latte.",
        "Am Mittag ist er noch dort.",
        "Am anderen Morgen liegt er im Schnee, und um ihn sind kleine Tritte.",
      ],
    },
    {
      lines: [
        "Die Tritte sind kleiner als seine.",
        "Sie kommen aus der Hecke und gehen an das Tor.",
        "Dann gehen sie fort, an den Kanal.",
        "Marlene sagt: Da kommt jemand und sucht ihn.",
        "Malik nimmt den Handschuh.",
        "Sie gehen den Tritten nach.",
        "Am Kanal ist der Schnee hart.",
        "Dort hören die Tritte auf.",
        "Marlene sieht in den Kanal.",
        "Das Eis ist dunkel und dick.",
        "Auf dem Eis ist eine dunkle Linie.",
        "Malik ruft laut, und hinter der Hecke macht es einen Laut.",
      ],
    },
    {
      lines: [
        "Hinter der Hecke steht ein kleines Kind.",
        "Es hat einen roten Mantel.",
        "An einer Hand ist kein Handschuh.",
        "Das Kind sagt nichts.",
        "Marlene hockt sich in den Schnee.",
        "Sie sagt: Ist das deiner?",
        "Das Kind sieht den Handschuh an und macht einen Tritt heran.",
        "Dann nimmt es ihn.",
        "Es sagt: Ich hatte ihn am Tor.",
        "Malik sagt: Er lag dort drei Tage.",
        "Das Kind lacht.",
        "Dann rennt es fort, und im Schnee liegt der andere Handschuh.",
      ],
    },
    {
      lines: [
        "Der andere Handschuh ist auch rot.",
        "Malik holt ihn aus dem Schnee.",
        "Marlene ruft dem Kind nach.",
        "Doch es ist schon in der Hecke.",
        "Sie gehen den kleinen Tritten nach, an den Kanal und in eine Gasse.",
        "Dort steht ein Haus mit einem roten Tor.",
        "Am Tor steht das Kind, und an seiner Hand ist die Mutter.",
        "Malik holt den Handschuh heraus.",
        "Die Mutter lacht und sagt: Der ist seit Sonntag fort.",
        "Das Kind nimmt ihn, und dann ist keine Hand mehr kalt.",
        "Malik und Marlene gehen durch den Schnee nach Hause.",
        "An der Latte am Tor liegt seit dieser Nacht nichts mehr.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Alltag. Ein altes Karussell am Kanal, ein Griff im Schlamm, ein
// alter Herr, der es als Kind noch drehen sah. Ohne „Holz" und „Farbe"
// (z, b) ist alles hier aus Metall.
// ───────────────────────────────────────────────────────────────────────────
const DAS_KARUSSELL_AM_KANAL: Serie = {
  slug: "das-karussell-am-kanal",
  titel: "Das Karussell am Kanal",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Am Kanal steht ein altes Karussell.",
        "Es ist klein, und es hat nur drei Tiere.",
        "Ein Storch, ein Fuchs, ein Reh.",
        "Das Metall ist dunkel und rostet.",
        "Cem dreht an dem Reh.",
        "Nichts geht.",
        "Ronja sucht an der Seite.",
        "Dort ist ein Loch im Metall.",
        "Sie sagt: Hier gehört ein Griff hinein.",
        "Der Griff ist fort.",
        "Cem sucht im Gras, Ronja sucht in der Hecke.",
        "Dann kommt ein alter Herr an den Kanal.",
      ],
    },
    {
      lines: [
        "Der Herr steht lange am Karussell.",
        "Er sagt: Es dreht seit Jahren nicht.",
        "Cem sagt: Der Griff ist nicht da.",
        "Der Herr sagt: Er ist nicht fort, er ist unten.",
        "Er sieht in den Kanal.",
        "Am Grund ist Schlamm, dunkel und dick.",
        "Er sagt: Da liegt er, schon lange.",
        "Ronja legt sich an den Rand und sieht hinunter.",
        "Sie sieht nichts als Schlamm.",
        "Cem holt einen langen Ast.",
        "Er sucht mit dem Ast im Schlamm.",
        "Dann macht es unten einen harten Laut.",
      ],
    },
    {
      lines: [
        "Cem dreht den Ast.",
        "Da ist Metall.",
        "Ronja holt eine Leine.",
        "Sie macht einen Haken an die Leine.",
        "Cem legt die Leine in den Kanal.",
        "Der Haken sinkt in den Schlamm.",
        "Cem dreht die Leine, und der Haken fasst.",
        "Ronja hilft, und die Leine kommt hoch.",
        "An dem Haken ist Schlamm und Metall.",
        "Der Herr lacht laut.",
        "Cem holt den Schlamm mit der Hand fort.",
        "Es ist der Griff - doch sein Ende ist gerissen.",
      ],
    },
    {
      lines: [
        "Der Herr sieht das Ende an.",
        "Er sagt: Am Kanal ist eine Halle mit einem Ofen.",
        "Sie gehen dorthin.",
        "In der Halle ist es hell und laut.",
        "Der Ofen ist an, und das Metall ist rot.",
        "Ein Herr mit einer Maske macht das Ende fest.",
        "Es dauert eine Stunde.",
        "Dann ist der Griff heil.",
        "Am Kanal legt Cem ihn in das Loch.",
        "Er dreht - und das Karussell dreht mit.",
        "Ronja steht auf dem Storch, und Cem dreht.",
        "Der alte Herr steht am Rand und sieht dem Storch nach.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Mystery. Ein langer Schatten an der Gartenmauer, eine dunkle Feder,
// ein Nest auf dem Schornstein. Ohne „wie" (w) gibt es keinen Vergleich -
// beschrieben wird mit Reihungen.
// ───────────────────────────────────────────────────────────────────────────
const DER_SCHATTEN_IM_GARTEN: Serie = {
  slug: "der-schatten-im-garten",
  titel: "Der Schatten im Garten",
  kind: "geschichte",
  stufen: ["kids"],
  minTier: 2,
  topic: "mystery",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "In der Nacht ist im Garten ein Schatten.",
        "Er ist lang und dunkel.",
        "Er kommt an die Mauer und geht dann fort.",
        "Timo sieht ihn als Erster.",
        "Er ruft Selma.",
        "Selma steht am Fenster und sieht nichts.",
        "Dann kommt der Schatten noch einmal.",
        "Er ist schmal und hat einen langen Hals.",
        "Selma sagt: Das ist kein Ast.",
        "Timo macht das Licht an, und der Schatten ist fort.",
        "Im Garten ist nichts als Gras.",
        "Doch an der Mauer liegt eine Feder, dunkel und lang.",
      ],
    },
    {
      lines: [
        "Am Morgen holt Timo die Feder.",
        "Sie ist dunkel, an einer Seite hell.",
        "Selma sagt: Die ist nicht aus dem Garten.",
        "In der Schule sieht die Lehrerin sie an.",
        "Sie sagt: Ein Storch.",
        "Timo sagt: Hier ist kein Storch.",
        "Die Lehrerin lacht und sagt: Dann sucht ihn.",
        "Am Mittag gehen Timo und Selma durch den Garten.",
        "Sie sehen an der Mauer, in der Hecke, im Gras.",
        "Sie finden nichts.",
        "Dann sieht Selma in die Höhe.",
        "Auf dem Schornstein der alten Halle steht ein Nest.",
      ],
    },
    {
      lines: [
        "Das Nest ist alt und hoch.",
        "Es ist aus Ranken und Halmen.",
        "Timo und Selma stehen still.",
        "Sie stehen dort eine Stunde.",
        "Dann kommt es aus der Luft.",
        "Ein Storch, dunkel und hell, mit einem langen Hals.",
        "Er landet am Nest und macht einen harten Laut.",
        "Selma hört den Laut, hart und schnell.",
        "Timo sagt: Der Schatten in der Nacht - das ist er.",
        "Der Storch dreht den Hals.",
        "Dann steht er still, dunkel am Himmel.",
        "Im Nest macht es einen anderen Laut, klein und hell.",
      ],
    },
    {
      lines: [
        "Im Nest ist noch ein Storch.",
        "Er ist klein, und sein Federkleid ist hell.",
        "Timo holt die Klasse.",
        "Elf Kinder stehen an der Halle und sehen in die Höhe.",
        "Die Lehrerin holt ein Fernrohr.",
        "Jedes Kind sieht einmal hindurch.",
        "Selma sieht nach allen anderen.",
        "Der kleine Storch dreht den Hals und sieht auf sie hinunter.",
        "Am Ende der Stunde gehen alle in die Schule.",
        "Timo legt die Feder auf das Fenster der Klasse.",
        "In der Nacht kommt der Schatten noch einmal an die Mauer.",
        "Timo macht kein Licht mehr an.",
      ],
    },
  ],
};

/** Die deutschen Kinder-Serien der Charge K2 (Sprossen 13, 17 und 20). */
export const SERIEN_KIDS_ZWEITE_RUNDE: Serie[] = [
  // Sprosse 13
  DIE_KREIDE_AN_DER_TAFEL,
  DAS_FEST_AN_DER_LINDE,
  // Sprosse 17
  DER_UHU_HINTER_DER_LUKE,
  DER_EFEU_AN_DER_NORDSEITE,
  DER_FLUR_HINTER_DER_AULA,
  DER_FERIENHOF,
  DER_ROST_AN_DER_KLINKE,
  // Sprosse 20
  DER_FUCHS_AN_DER_GARAGE,
  DIE_GRILLE_IM_GRAS,
  DER_HANDSCHUH_IM_SCHNEE,
  DAS_KARUSSELL_AM_KANAL,
  DER_SCHATTEN_IM_GARTEN,
];
