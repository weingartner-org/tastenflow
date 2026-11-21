/**
 * FRÜHE Bücherei-Serien (29.07.2026) — die Treppe, damit die Bücherei nicht erst
 * bei 21 Buchstaben aufgeht.
 *
 * AUSGANGSBEFUND (gemessen 28./29.07. mit `scripts/_serbestand.mts`): Von 26
 * deutschen Serien lag KEINE unter Tier 2, und `serieTypeable` verlangt, dass
 * JEDE Zeile passt. Ergebnis: vor **22 Einheiten** (21 Buchstaben + ⇧) war die
 * Bücherei komplett leer — für 13–15 gab es vor dem vollen Alphabet genau EINE
 * Serie, für Erwachsene KEINE. Seit dem 28.07. kündigt die App nach jeder Runde
 * und jeder Lektion eine Geschichte an; für Anfänger lief das Angebot ins Leere.
 *
 * DIE TREPPE (statt einer Klippe bei 22). Maßgeblich ist NICHT das grobe Tier,
 * sondern die Stelle in `INTRO_ORDER`, ab der jede Zeile tippbar ist —
 * `scripts/_seroeffnung.mts` misst sie je Serie:
 *
 *   n=13  Das Nest in der Tanne (7–9/10–12)   ·  Die Terrasse (13–15/Erwachsene)
 *   n=16  Der Hund an der Tankstelle          ·  —
 *   n=17  —                                   ·  Die Nachtschicht
 *   n=18  Der Igel in der Nacht               ·  —
 *   n=20  —                                   ·  Der Garten hinter dem Haus
 *   n=22  Nuri hört mehr                      ·  —
 *
 * n=13 ist zugleich die Landmarke „Erste Buchstaben + Großschreibung" aus
 * `startPoints()` — wer dort einsteigt (oder von der Lehrkraft dort eingesetzt
 * wird), hat vom ersten Moment an etwas zu lesen. ZWEI Fassungen je Stufe, weil
 * die Ränder (7–9 und Erwachsene) im Bestand nichts erben: eine kindgerechte und
 * eine erwachsen gerahmte Treppe mit demselben Tastensatz.
 *
 * WORTSCHATZ-GRENZEN, die Zeit kosten, wenn man sie nicht kennt (jede am Objekt
 * geprüft, nicht geraten). ★ ACHTUNG: Charge O1 (21.08.2026) hat das `o` in
 * `LETTER_ORDER` direkt hinter das `h` gezogen. Die Sprossen-Tafel lautet
 * seither **n=13 · ⇧ · +h(15) · +o(16) · +u(17) · +c(18) · +g(19) · +m(20) ·
 * +b(21) · +w(22)**; die Zahlen unten sind darauf nachgezogen. Die Serien
 * dieser Datei öffnen jetzt bei **13/17/19/22** (Kinder-Fassungen) und
 * **13/18/20** (Jugend/Erwachsene) — vorher 13/16/18/22 und 13/17/20:
 *
 *  • n=13 (`a d e f i j k l n r s t ö`): kein **und**, kein **nicht**, kein
 *    **ich**, kein **mit**, kein **dem/einem/im/am** (der ganze Dativ Singular
 *    maskulin/neutrum fehlt), kein **ihm/ihr/ihre**, kein
 *    **haben/sehen/gehen/kommen/sagen/machen/sitzen** — und KEIN Zeitwort
 *    (Tag, Jahr, Stunde, Abend, Morgen sind alle gesperrt; es bleiben *seit*,
 *    *erst*, *dann*, *stets*, *selten*, *nie*). Verbindungen laufen über
 *    Komma-Reihen oder ein Sammelwort („die Kinder"), Verneinung nur über
 *    *kein/nie*, Erzählzeit Präsens oder Präteritum (fand, lief, rief, fiel,
 *    sank, las, trat, stand, schlief).
 *  • n=17 (+ h o u): jetzt **und, auf, aus, hat, hier, sehr, sieht, steht,
 *    ruft, laut, Haus, Hund, Hand, Uhr, Stunde, Freund, heute, neu, Feuer** —
 *    und seit Charge O1 mit dem vorgezogenen `o` auch **so, oft, ohne, oder,
 *    also, sofort, dort, Ort, rot, Hof, Ofen, Sohn, Ton, Not, Los, Foto,
 *    Telefon**. Weiterhin kein **sich** (braucht c), kein **noch/schon/doch**
 *    (alle drei brauchen c) und kein **Frau** (braucht w).
 *  • n=19 (+ c g): endlich **ich, nicht, auch, nach, durch, sich, Nacht, Licht,
 *    noch, schon, doch, geht, sagt, gut, Tag, Regen, Gras, Angst, Geschichte**
 *    — noch immer kein m b w, also kein *im/am/mit/man* und kein *kommt/macht*.
 *  • n=20 (+ m): **im, am, mit, man, kommt, macht, Morgen, Sommer, immer,
 *    Familie, Kollegin** — aber kein **zu**, kein
 *    **haben/arbeiten/aber/Nachbar** (b) und kein **wir/was/wie/wo** (w).
 *
 * STOLPERSTEINE, die beim Schreiben mehrfach zugeschlagen haben:
 *  • **sitzen/setzen/jetzt/Katze** brauchen `z` — also erst ab T3. Ersatz:
 *    *rastet, lehnt, ruht, nun*.
 *  • **heißt/Straße/groß** brauchen `ß`. „heisst" wäre auf einer deutschen
 *    Tastatur schlicht falsch geschrieben → Namensgebung über *nennt*.
 *  • Umlaut-Plurale (Bäume, Käfer, Räder) sind bis T3 gesperrt — Singular
 *    schreiben oder ein anderes Wort nehmen.
 *
 * RECHTE: alle sieben Serien sind selbst verfasst. Reale Texte — auch
 * gemeinfreie — halten sich nicht an eine Buchstaben-Freischaltung; auf dieser
 * Ebene ist eigenes Werk der einzige Weg (Bauplan §10).
 *
 * ZEICHENSATZ wie im Bestand: keine Anführungszeichen (wörtliche Rede ohne —
 * Entscheidung Johannes 28.07.), keine Ziffern, Satzzeichen nur . , - ? ! : ;
 */
import type { Serie } from "./serie";

/** Herkunft aller Serien dieser Datei (selbst verfasst, keine Fremdrechte). */
const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Treppe für 7–9 und 10–12
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Stufe 1 der Kinder-Treppe und die ERSTE Geschichte der Bücherei überhaupt —
 * offen ab 13 Einheiten. Bewusst kurze Hauptsätze: mit diesem Zeichensatz gibt
 * das Deutsche weder „und" noch „nicht" her.
 */
const DAS_NEST_IN_DER_TANNE: Serie = {
  slug: "das-nest-in-der-tanne",
  titel: "Das Nest in der Tanne",
  kind: "geschichte",
  stufen: ["kids"], // I1 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 1,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Elif rastet an einer alten Tanne.",
        "Da landet eine Feder in den Klee.",
        "Die Feder ist klein, fein, fast seiden.",
        "Elif fasst sie sanft an.",
        // R2: „eine Feder dieser Art" (Genitiv), nicht „in dieser Art".
        "Sie kennt keine Feder dieser Art.",
        "Elif eilt in die Diele.",
        "Tarik rastet an der Kiste.",
        "Kennt Tarik diese Feder?",
        "Tarik kennt fast jede Feder.",
        "Das ist ein Star!",
        "Ein Star nistet in alten Tannen.",
        "Elif denkt an die alte Tanne.",
      ],
    },
    {
      lines: [
        "Die Kinder rennen an die alte Tanne.",
        "Die Rinde ist alt, der Ast ist steil.",
        "Elif tastet leise an der Rinde.",
        "Nadia findet einen Faden in der Erde.",
        "Der Faden ist ein Teil des Nestes.",
        "Da ist ein Nest, tief in den Farnen.",
        "Das Nest fiel in die Farne.",
        "Darin sind drei kleine Eier.",
        "Alle drei sind kalt.",
        "Elif fasst keines an.",
        "Kein Ei kann in den Farnen reifen.",
        "Die Kinder denken an eine Leiter.",
      ],
    },
    {
      lines: [
        "In der Diele ist eine alte Leiter.",
        "Sie ist stark, sie ist standfest.",
        "Tarik stellt die Leiter an die Tanne.",
        "Nadia stellt einen Stein an die Leiter.",
        "Elif klettert. Sie klettert flink.",
        "Nadia stellt das Nest in eine Kiste an der Leine.",
        "Elif fasst die Leine, dann das Nest.",
        "Sie stellt das Nest in den Ast.",
        "Es ist fest. Kein Ei kann fallen.",
        "Elif klettert leise an der Leiter.",
        "Die Kinder rasten in den Farnen.",
        "Kennt der Star sein Nest?",
      ],
    },
    {
      lines: [
        "Elif, Tarik, Nadia rasten in der Ferne.",
        "Alle drei sind still.",
        "Da: ein Star an der Tanne!",
        "Er landet an der Rinde.",
        "Er kreist. Dann sinkt er in das Nest.",
        "Er kennt sein Nest!",
        "Alle drei Eier sind da.",
        "Elif teilt einen Keks. Alle essen.",
        "Da ist es still, da ist es fein.",
        "Drei Eier, ein Nest, eine alte Tanne.",
        "Elif faltet die Feder in eine Karte.",
        "Ein feines Andenken an die alte Tanne.",
      ],
    },
  ],
};

/** Stufe 2 der Kinder-Treppe — offen ab 16 Einheiten (h und u sind dazu). */
const DER_HUND_AN_DER_TANKSTELLE: Serie = {
  slug: "der-hund-an-der-tankstelle",
  titel: "Der Hund an der Tankstelle",
  kind: "geschichte",
  stufen: ["kids"], // I1 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Heute steht ein Hund an der Tankstelle.",
        "Er ist nass und er friert.",
        "Elif sieht ihn als Erste.",
        "Der Hund steht still und rennt nie.",
        "Er hat eine Leine und keinen Halter.",
        "Tarik trifft Elif an der Tankstelle.",
        "Der Hund ist sehr still.",
        "Elif fasst die Leine sanft an.",
        "Der Hund traut ihr.",
        "Er lehnt an ihrer Seite.",
        "Ist er alleine hier?",
        "Elif und Tarik denken an eine Adresse.",
      ],
    },
    {
      lines: [
        "An der Leine ist eine Karte.",
        "Die Karte ist alt und die Tinte ist nass.",
        "Tarik faltet sie sanft aus.",
        "Darauf steht: Falkenhaus.",
        "Elif kennt kein Falkenhaus.",
        "Tarik hat eine Idee: Das ist hinter den Tannen.",
        "Sie starten und der Hund rennt an ihrer Seite.",
        "Der Feldrand ist nass und die Luft ist kalt.",
        "Die Farne sind hier hart und nass.",
        // R4 (Prüfbericht §6.5): „heult nie" stand elf Zeilen vor „Der Hund
        // heult und rennt hinein.". „fast nie" macht das Heulen zur Ausnahme,
        // die es erzählerisch sein soll - und die Zeile wird einsätzig.
        "Der Hund ist still und heult fast nie.",
        "Sie eilen eine Stunde.",
        "Dann steht da ein Haus.",
      ],
    },
    {
      lines: [
        "Das Haus ist alt, die Fenster sind dunkel.",
        "An einer Tafel steht Falkenhaus.",
        "Elif ruft laut.",
        "Keiner tritt heraus.",
        "Der Hund heult und rennt hinein.",
        "Tarik und Elif eilen dahinter.",
        "In der Diele ist es dunkel und still.",
        "Da unten an der Leiter ist Astrid.",
        "Astrid ist alt und ihre Hand friert.",
        "Sie kann heute nie alleine aufstehen.",
        "Elif hilft ihr. Tarik eilt heraus.",
        "Er rennt und ruft laut an der Tankstelle.",
      ],
    },
    {
      lines: [
        "Rania, die Leiterin der Tankstelle, eilt herein.",
        "Sie ruft Hilfe. Sie kennt Astrid seit Jahren.",
        "Astrid lehnt an einer Kiste und sie trinkt Tee.",
        "Sie ist satt. Sie friert nie.",
        "Der Hund ruht an ihren Fersen.",
        "Astrid nennt ihn Falke.",
        "Falke rennt und Falke findet Hilfe.",
        "Elif tastet an Falkes Fell.",
        "Falke ist alt und Falke ist treu.",
        "Elif teilt Kekse. Alle essen.",
        "Astrid dankt und sie ist still.",
        "Ein kalter Start, ein feines Ende.",
      ],
    },
  ],
};

/** Stufe 3 der Kinder-Treppe — offen ab 18 Einheiten (c und g sind dazu). */
const DER_IGEL_IN_DER_NACHT: Serie = {
  slug: "der-igel-in-der-nacht",
  titel: "Der Igel in der Nacht",
  kind: "geschichte",
  stufen: ["kids"], // I1 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Heute schlafen die Kinder in einer Ecke des Gartens.",
        "Es ist Sanels erste Nacht in einer Decke.",
        "Nadia stellt eine Laterne in das Gras.",
        "Das Licht ist klein und sehr sanft.",
        "Es regnet nicht. Die Luft riecht nass.",
        "Elif liest eine Geschichte laut.",
        "Sanel lacht, dann ist er still.",
        "In den Farnen raschelt es.",
        "Sanel fasst Nadias Hand.",
        "Ist da einer?",
        "Nein, sagt Nadia. Da ist kein Kind.",
        "Das Rascheln kann alles sein.",
      ],
    },
    {
      lines: [
        "Nadia sagt: Ich gehe da hin.",
        "Sie geht in die Farne, sehr leise.",
        "Das Gras ist nass, die Erde ist kalt.",
        "Da, hinter den Farnen, ist ein Klang.",
        "Es ist ein Schnaufen, dicht an der Erde.",
        "Nadia senkt die Laterne.",
        "Da ist ein Igel.",
        "Er ist klein und er ist richtig rund.",
        "Er sieht die Kinder nicht gerne.",
        "Er rennt nicht. Er rastet und er lauscht.",
        "Nadia ruft leise: Ein Igel!",
        "Sanel kennt den Klang nun.",
      ],
    },
    {
      lines: [
        "Ein Igel isst gerne Insekten.",
        "Elif findet eine flache Schale.",
        "Sie stellt sie in das Gras, dicht an die Farne.",
        "Nadia leert eine Kanne in die Schale.",
        "In die Schale kann kein Igel fallen: Sie ist flach.",
        "Ein Igel trinkt gerne. Er trinkt hier.",
        "Sanel ist still an der Decke.",
        "Der Igel geht an die Schale.",
        "Er trinkt lange.",
        "Dann geht er in die Farne.",
        "Er ist gegangen. Alle sind still.",
        "Das ist eine gute Nacht, sagt Sanel.",
      ],
    },
    {
      lines: [
        "Es ist gegen elf.",
        "Die Laterne ist fast leer.",
        "Das Rascheln ist nun keine Gefahr.",
        "Sanel hat keine Angst.",
        "Ich kenne den Igel nun, sagt er.",
        "Nadia lacht: Der Igel kennt dich auch.",
        "Elif liest den Schluss ihrer Geschichte.",
        "Dann ist die Laterne aus.",
        "In der Nacht raschelt es lange.",
        "Es ist der Igel. Es ist nichts anderes.",
        "Alle drei schlafen dicht an dicht.",
        // R2: Präteritum in einer Präsens-Etappe. Das Präsens „schläft ein"
        // scheitert am ä (in dieser Serie gesperrt), das Perfekt trägt es.
        "Sanel ist als Erster eingeschlafen.",
      ],
    },
  ],
};

/**
 * Stufe 4 der Kinder-Treppe — frühes T2, offen ab 22 Einheiten. Erzählt von
 * einem Kind, das nicht sieht, ohne es zu einer Lektion zu machen: Nuris
 * Können ist geübt, nicht magisch (kein „Superhören"), und der Langstock ist
 * Werkzeug, nicht Thema.
 */
const NURI_HOERT_MEHR: Serie = {
  slug: "nuri-hoert-mehr",
  titel: "Nuri hört mehr",
  kind: "geschichte",
  stufen: ["kids"], // I1b 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "sinne",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Nuri geht mit der Klasse in den Wald.",
        "Die Kinder haben Brot und Wasser in ihren Taschen.",
        "Nuri hat einen Langstock. Er tastet damit den Weg.",
        "Nuri sieht nichts. Er hört genauer als die anderen.",
        "Das ist kein Wunder. Er hat es gelernt.",
        "Die Lehrerin, Frau Ilic, geht hinten mit.",
        "Ein Weg geht am Bach entlang.",
        "Der Bach ist laut und kalt.",
        "Nuri bleibt stehen und horcht.",
        "Hier gabelt sich der Weg, sagt er.",
        "Die anderen Kinder sehen keine Gabel.",
        "Aber Nuri hat recht: Da geht ein Weg in den Wald.",
      ],
    },
    {
      lines: [
        "Am Mittag rasten alle an einer Bank.",
        "Die Sonne steht hoch, der Wind kommt.",
        "Nuri hört den Wind, lange ehe er da ist.",
        "Es riecht nach Regen.",
        "Frau Ilic ruft: Wir gehen weiter!",
        "Da fehlt eine Tasche.",
        "Sanels Tasche ist nicht an der Bank.",
        "Darin sind sein Heft und sein Brot.",
        "Alle Kinder suchen. Keiner findet sie.",
        "Sanel wird still.",
        "Nuri sagt: Ich horche einmal.",
        "Alle Kinder sind still, wirklich still.",
      ],
    },
    {
      lines: [
        "Nuri steht in der Mitte und horcht.",
        "Der Bach rauscht unten im Tal.",
        "Der Wind geht durch das Gras.",
        "Dann kommt ein anderer Klang: ein leises Klirren.",
        "Es kommt nicht aus dem Wald. Es kommt aus dem Gras.",
        "Nuri geht dahin, sehr langsam.",
        "Nuri tastet mit dem Langstock den Rand des Weges ab.",
        "Dann trifft er etwas Weiches.",
        "Da liegt die Tasche in einem Busch.",
        "Das Klirren kam aus einer Dose in der Tasche.",
        "Sanel rennt hin und lacht laut.",
        "Nuri lacht auch. Er sagt: Der Wald redet immer.",
      ],
    },
    {
      lines: [
        "Am Nachmittag gehen alle wieder los.",
        "Nuri geht nicht hinten. Er geht neben Frau Ilic.",
        "Sanel geht auf der anderen Seite.",
        "Sag mal, fragt Sanel, wie machst du das?",
        "Nuri sagt: Ich horche. Und ich merke mir alles.",
        "Der Bach klingt hier anders als da hinten.",
        "Und der Weg klingt hart, dann weich, dann hart.",
        "Sanel bleibt stehen. Er horcht auch einmal.",
        "Er hört den Bach. Er hört den Wind.",
        "Aber er hört nicht, wo der Weg hart wird.",
        "Das kommt, sagt Nuri. Man braucht Wochen.",
        "Die Klasse geht heim. Nuri geht mitten unter allen.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// Treppe für 13–15 und Erwachsene
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Die erwachsen gerahmte Schwester von „Das Nest in der Tanne" — offen ab
 * 13 Einheiten und damit die erste Serie überhaupt, die Erwachsene erreicht,
 * bevor das ganze Alphabet sitzt.
 */
const DIE_TERRASSE: Serie = {
  slug: "die-terrasse",
  titel: "Die Terrasse",
  kind: "geschichte",
  stufen: ["teens", "erwachsen"],
  minTier: 1,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Astrid ist Kellnerin an einer Terrasse an der See.",
        "Sie kennt fast alle, die da rasten.",
        "Sie kennt die Tassen, die Teller, alle Tafeln der Terrasse.",
        "Ein Star rastet stets an den Tellern.",
        "Erst seit den Ferien rastet da Idris.",
        "Idris ist alt, Idris ist still.",
        "Er rastet stets an der Tafel an der Seite.",
        "Er liest. Er redet nie.",
        "Astrid stellt einen Tee an seine Seite.",
        "Idris dankt leise.",
        "Dann faltet er eine Karte.",
        "Er faltet, faltet, faltet. Da ist ein Stern.",
      ],
    },
    {
      lines: [
        "In den Ferien rasten Kinder an allen Tafeln.",
        "Astrid trifft, teilt, eilt.",
        "Erst dann ist es still.",
        "Die Tafel an der Seite ist leer.",
        "An der Tafel ist ein feiner Stern.",
        "Astrid fasst den Stern sanft an.",
        "Er ist klein. Die Karte darin ist alt.",
        "Astrid stellt den Stern an die Kasse.",
        "Dann eilt sie an die Teller.",
        "Der Star landet an der Kanne.",
        "Astrid teilt einen Keks. Der Star frisst.",
        // R4 (Prüfbericht §6.6): Aus EINEM Stern wurden in der nächsten Etappe
        // unerzählt elf. Diese Zeile erzählt den Sprung.
        "An allen Tafeln findet Astrid Sterne.",
      ],
    },
    {
      lines: [
        "An der Kasse sind elf Sterne.",
        "Alle sind alte Karten.",
        "Astrid fasst einen an.",
        "Sie faltet den Stern in eine Karte.",
        "Da sind Lettern in Tinte.",
        "Klein, an einer Kante: Dank, Astrid.",
        "Astrid ist still.",
        "Sie faltet den Stern, Kante in Kante.",
        "Er ist dann fast der alte Stern.",
        "Astrid stellt den Stern an die anderen.",
        "Sie denkt an Idris.",
        "Er redet nie. Er faltet.",
      ],
    },
    {
      lines: [
        "Astrid trifft Idris an der Tafel an der Seite.",
        "Sie stellt eine Kanne Tee an seine Seite.",
        "Dann rastet sie. Sie rastet selten.",
        "Idris stellt eine leere Karte an die Kante der Tafel.",
        "Astrid fasst sie an.",
        "Idris faltet. Astrid faltet.",
        "Erst ist es ein Rand. Dann sind es Kanten.",
        "Dann ist da ein Stern.",
        "Er ist klein. Er ist ein erster Stern.",
        "Idris dankt still.",
        "Astrid stellt den Stern an seine Tafel.",
        "Es ist der erste, den sie faltet.",
      ],
    },
  ],
};

/** Stufe 2 der Erwachsenen-Treppe — offen ab 17 Einheiten (h, u, c sind dazu). */
const DIE_NACHTSCHICHT: Serie = {
  slug: "die-nachtschicht",
  titel: "Die Nachtschicht",
  kind: "geschichte",
  stufen: ["teens", "erwachsen"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ich stehe in der Kantine des Rasthauses.",
        "Das Rasthaus steht allein in der Nacht.",
        "Die Schicht startet nach elf.",
        "Ich schalte die Lichter an. Ich richte die Teller.",
        "In der Kanne ist frischer Kaffee.",
        "Erst ist es still: kein Laster, kein Kunde.",
        "Ich lese die Karten und ich richte die Kasse.",
        "Nach eins tritt eine Fahrerin herein.",
        "Sie ist stets da nach eins. Alle nennen sie Selin.",
        "Selin trinkt Kaffee. Sie isst Kuchen.",
        "Sie redet selten. Sie ist still und echt.",
        "Dann tritt sie hinaus in die Nacht.",
      ],
    },
    {
      lines: [
        "Nach eins ist die Nacht dicht.",
        "Ich kenne jeden Klick in dieser Kantine.",
        "Die Uhr an der Kasse tickt.",
        "Die Lichter surren leise.",
        "Ich schneide Salat.",
        "Ich denke an nichts und an alles.",
        "Da tritt Rania herein. Sie hat Dienst an der Kasse.",
        "Sie sucht Kaffee. Sie findet die Kanne leer.",
        "Ich reiche ihr eine Tasse.",
        "Sie lacht leise. Sie dankt.",
        "Die Nacht dehnt sich.",
        "Dann tritt keiner herein. Rania und ich sind allein.",
      ],
    },
    {
      lines: [
        "Eine Nacht danach: Es ist nach eins.",
        "Selin ist nicht da.",
        "Ich richte den Kaffee. Ich stelle den Kuchen an die Kante.",
        "Die Uhr tickt. Es ist nach drei.",
        "Kein Laster, keine Selin.",
        "Ich denke an ihren Laster.",
        "Die Nacht ist nass. Die Fahrt ist heikel.",
        "Rania sieht in die Nacht hinaus.",
        "Sie kennt Selin auch.",
        "Ich schalte alle Lichter an.",
        "Kein Laster steht auf der Rast.",
        "Ich richte eine Tasse und ich lasse sie stehen.",
      ],
    },
    {
      lines: [
        "Erst nach der Schicht tritt Selin herein.",
        "Sie ist nass und sie ist still.",
        "Ihr Laster hatte einen Schaden.",
        "Sie stand acht Stunden in der Nacht.",
        "Kein Ruf, kein Licht, nichts.",
        "Ich reiche ihr die Kanne.",
        "Der Kaffee ist alt. Er ist kalt.",
        "Selin trinkt ihn und sie lacht.",
        "Er ist der feinste Kaffee dieser Nacht.",
        "Ich schneide Kuchen. Rania reicht einen Teller.",
        "Alle drei stehen an der Kasse und essen.",
        "Die Schicht ist aus. Die Nacht ist es nicht.",
      ],
    },
  ],
};

/** Stufe 3 der Erwachsenen-Treppe — offen ab 20 Einheiten (m und o sind dazu). */
const DER_GARTEN_HINTER_DEM_HAUS: Serie = {
  slug: "der-garten-hinter-dem-haus",
  titel: "Der Garten hinter dem Haus",
  kind: "geschichte",
  stufen: ["teens", "erwachsen"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Hinter dem Haus ist ein Garten.",
        "Er ist alt und niemand geht mehr dorthin.",
        "Das Gras steht hoch, die Erde ist hart.",
        "In der Ecke rostet eine Harke.",
        // R4 (Prüfbericht §6.7): Selin und Renate wohnten beide „im dritten
        // Stock" - die Pointe „eine Chefin im dritten Stock" meint Renate.
        // Selin zieht ins Erdgeschoss (kein z/v im Zeichensatz dieser Serie).
        "Selin ist seit einem Monat Mieterin im Erdgeschoss.",
        "Sie sieht den Garten oft am Morgen.",
        "An einem Sonntag nimmt sie die Harke.",
        "Sie harkt eine Ecke frei.",
        "Es ist nicht mehr als drei Schritt.",
        "Doch die Erde darunter ist dunkel und gut.",
        "Karim sieht das alles am Fenster im ersten Stock.",
        "Er sagt nichts. Er sieht nur hin.",
      ],
    },
    {
      lines: [
        "Am Samstag danach ist Selin schon am Mittag im Garten.",
        "Sie hat einen Karton mit Kresse und Salat.",
        "Die Sonne steht hoch und der Hof ist still.",
        "Karim kommt mit einer Kanne herunter. Er sagt nur: Da.",
        "Selin lacht. Sie dankt ihm.",
        "Sie harken das Gras, sie hacken die Erde.",
        "Nach einer Stunde ist die Ecke drei Meter lang.",
        "Im dritten Stock macht jemand ein Fenster auf.",
        "Es ist Renate. Sie ist hier, seit das Haus steht.",
        "Sie ruft: Die Kresse kommt nach hinten!",
        "Dort kommt am Nachmittag die meiste Sonne hin.",
        "Selin und Karim sehen nach hinten. Renate hat recht.",
      ],
    },
    {
      lines: [
        "Renate kommt nicht mehr in den Hof herunter.",
        "Sie ist am Fenster, jeden Morgen und jeden Nachmittag.",
        "Sie kennt jeden Meter dieser Erde.",
        "Die Kamille dort hat schon Renates Mutter gesteckt.",
        "Karim macht ein Foto und sendet es Renate.",
        "Renate ruft an: Die Tomaten stehen nicht richtig.",
        "Sie sagt: Tomaten mögen Sonne. Nasse Tomaten faulen schnell.",
        "Karim macht ein Dach aus einer alten Folie.",
        "Selin lacht: Der Garten hat eine Chefin im dritten Stock.",
        "Renate lacht auch. Sie ruft: Ich sehe alles!",
        "Im Juli sind die Tomaten rot.",
        "Es ist der erste Garten in diesem Haus seit langem.",
      ],
    },
    {
      lines: [
        "Am ersten Sonntag im August essen alle im Hof.",
        "Selin holt einen Tisch aus der Diele.",
        "Karim holt drei Sessel.",
        "Renate kommt herunter. Es dauert lange.",
        "Karim geht an ihrer Seite, sehr langsam.",
        "Es ist ihr erster Tag im Hof seit Jahren.",
        "Auf dem Tisch stehen Tomaten, Salat und Kresse.",
        "Nichts kommt aus einem Laden.",
        "Renate isst und sie redet nicht.",
        "Dann sagt sie: Hier stand schon der Garten meiner Mutter.",
        "Selin holt eine Kanne und sie sagt nichts.",
        "Im Sommer danach macht noch eine Familie mit.",
      ],
    },
  ],
};

export const SERIEN_FRUEH: readonly Serie[] = [
  DAS_NEST_IN_DER_TANNE,
  DER_HUND_AN_DER_TANKSTELLE,
  DER_IGEL_IN_DER_NACHT,
  NURI_HOERT_MEHR,
  DIE_TERRASSE,
  DIE_NACHTSCHICHT,
  DER_GARTEN_HINTER_DEM_HAUS,
];
