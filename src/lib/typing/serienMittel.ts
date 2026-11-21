/**
 * Bücherei-Serien GEZIELT FÜR 10–12 (30.07.2026) — die zweite Hälfte von
 * »zu kindlich für die Älteren«.
 *
 * ANLASS (gemessen mit `scripts/_zehnzwoelf.mts`, aktiver Korpus): Von den 26
 * Serien, die ein Kind mit 11 zu sehen bekam, war **keine einzige** für dieses
 * Alter geschrieben. Schlimmer war die Treppe: Vor dem vollen Alphabet gab es
 * für 10–12 genau **13 Serien — und alle 13 waren wörtlich die der 7- bis
 * 9-Jährigen**:
 *
 *     n=13  Das Nest in der Tanne        (auch 7–9)
 *     n=16  Der Hund an der Tankstelle   (auch 7–9; heute n=17)
 *     n=18  Der Igel in der Nacht        (auch 7–9; heute n=19)
 *     n=22  neun weitere                 (alle neun auch 7–9)
 *
 * 13–15 hat seit dem 29.07. eine eigene Treppe (Die Terrasse n=13, Die
 * Nachtschicht n=17 — heute n=18 —, Der Garten hinter dem Haus n=20). Die
 * „heute"-Zahlen sind die nach Charge O1, siehe unten. 10–12 fiel damals in
 * den Kinder-Topf und ging leer aus. Diese Datei schließt genau diese Lücke.
 *
 * DER MASSSTAB (Johannes): »Nicht ins Gegenteil kippen. Ein 11-Jähriger ist
 * kein Jugendlicher. Nicht kindlich heißt nicht nüchtern, sondern ERNST
 * GENOMMEN.« Darum: Figuren im Alter der Lesenden, echte kleine Einsätze
 * (recht behalten, etwas allein reparieren, einen Fehler zugeben), keine
 * Verkleinerungsformen, kein sprechendes Tier, keine Moral am Schluss — aber
 * auch keine Kühle. Die Wissens-Serie ist der Gegenbeweis zum »Regenwurm«:
 * derselbe Zugriff wie bei 13–15, nur eine Stufe früher gefasst.
 *
 * WORTSCHATZ-GRENZEN — die eigentliche Arbeit. Maßgeblich ist NICHT das grobe
 * Tier, sondern die Stelle in `INTRO_ORDER`, ab der jede Zeile tippbar ist.
 * Gemessen mit `scripts/_seroeffnung.mts <slug> <ziel-n>`, nicht geschätzt.
 * ★ ACHTUNG: Charge O1 (21.08.2026) hat das `o` direkt hinter das `h` gezogen;
 * die Sprossen-Tafel lautet seither **n=13 · ⇧ · +h(15) · +o(16) · +u(17) ·
 * +c(18) · +g(19) · +m(20) · +b(21) · +w(22)**. Die vier Serien dieser Datei
 * öffnen darum jetzt bei **13/18/20/20** (vorher 13/17/20/20):
 *
 *  • n=13 `a d e f i j k l n r s t ö` — wie in `serienFrueh.ts` beschrieben:
 *    kein *und*, kein *nicht*, kein *ich*, kein Zeitwort. Zusätzlich hier
 *    aufgelaufen: **kein o** (also kein *oder*, *Note*, *Foto*), kein *fällt*
 *    (ä) — Präteritum *fiel* nutzen — und **kein Redeverb**, auch kein *ruft*
 *    (u kommt erst bei 17). Zweifel und Widerspruch laufen darum über
 *    Handlung, nicht über Rede.
 *  • n=16/17 (+ o, dann + u) — die Zwischenstufe, die es vor O1 so nicht gab:
 *    mit dem `o` kommen *so, oft, ohne, oder, also, sofort, dort, Ort, Note,
 *    Foto, Telefon*, mit dem `u` dann *und, auf, aus, ruft, Uhr, Stunde, Luft*.
 *    Weiterhin kein c, g, m, b, w.
 *  • n=18 (+ c) — endlich *ich, nicht, sich, auch, nach, durch, noch, schon,
 *    doch, Nacht, Licht, lacht, sucht, Ursache*. Aber **kein g** (*lange,
 *    sagt, geht, Regal, richtig, Aufgabe* gesperrt) und **kein m** (*stimmt,
 *    um, immer*).
 *  • n=20 (+ g m) — *im, am, mit, man, kommt, Morgen, sagt, geht, lange*.
 *    Weiterhin gesperrt: **b** (*aber, halb, haben, doppelt, selbst,
 *    sieben*), **w** (*wir, was, wie, wo, Wand*) und **z** (*zu, zwei, zehn,
 *    kurz, trotzdem*). Ersatz: *dennoch* statt *trotzdem*, *in der Mitte*
 *    statt *halb*, *der Fels* statt *die Wand*.
 *
 * ZAHLWÖRTER, die vor n=21 überhaupt gehen: eins, drei, sechs, acht, neun,
 * elf, null, hundert, tausend. Gesperrt sind zwei, vier, fünf, sieben, zehn,
 * zwölf, zwanzig — deshalb stehen in der Wissens-Serie Größenordnungen und
 * keine krummen Werte.
 *
 * RECHTE: alle vier Serien sind selbst verfasst. Reale Texte halten sich nicht
 * an eine Buchstaben-Freischaltung; auf dieser Ebene ist eigenes Werk der
 * einzige Weg (Bauplan §10).
 *
 * ZEICHENSATZ wie im Bestand: wörtliche Rede ohne Anführungszeichen
 * (Entscheidung Johannes 28.07.), keine Ziffern, Satzzeichen nur . , - ? ! : ;
 */
import type { Serie } from "./serie";

/** Herkunft aller Serien dieser Datei (selbst verfasst, keine Fremdrechte). */
const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// n=13 — die früheste Sprosse. Thema: der eigenen Beobachtung trauen, auch
// wenn zwei andere sie wegwischen. Ohne Redeverben (siehe Kopf) trägt die
// Handlung den Widerspruch: Nils klettert selbst nach und findet nichts.
// ───────────────────────────────────────────────────────────────────────────────
const DER_RISS: Serie = {
  slug: "der-riss",
  titel: "Der Riss",
  kind: "geschichte",
  stufen: ["kids", "teens"],
  minTier: 1,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Die Leiter in der Diele ist alt.",
        "Sie ist steil. Sie ist stark.",
        "Ilka klettert leise nieder.",
        "Da knistert die dritte Latte.",
        "Ilka rastet. Sie tastet die Latte.",
        "Da ist ein Riss. Er ist fein.",
        "Ilka klettert nieder.",
        "Nils rastet an einer Kiste.",
        "Ilka nennt den Riss.",
        "Nils kennt die Leiter seit den Ferien.",
        "Er klettert. Er klettert flink.",
        "Nils findet keinen Riss.",
      ],
    },
    {
      lines: [
        // R2: Präteritum in einer Präsens-Etappe (auch Z. „tritt nieder",
        // „sinkt", „findet" weiter unten).
        "Ilka tritt an die Leiter.",
        "Sie findet die dritte Latte.",
        "Der Riss ist tief in der Latte.",
        "Ilka faltet eine Karte.",
        "Sie stellt die Karte in den Riss.",
        "Die Karte sinkt. Sie sinkt tief.",
        "Ein feiner Riss ist selten tief.",
        "Dieser Riss ist tief.",
        "Ilka eilt. Sie findet Nils.",
        "Nils tastet die Latte, dann die Karte.",
        "Er ist still.",
        // R2: „nie in dieser Art" ist keine deutsche Fügung; der Genitiv trägt.
        "Nils kennt keinen Riss dieser Art.",
      ],
    },
    {
      lines: [
        "Tarek eilt in die Diele.",
        "Alle Kisten der Klasse sind da.",
        "In den Kisten sind Steine.",
        "Tarek stellt eine Kiste an die Leiter.",
        "Er tritt an die dritte Latte.",
        "Ilka rennt. Ilka fasst die Kiste.",
        "Sie stellt die Kiste in den Sand.",
        "Nils nennt Tarek den Riss.",
        "Tarek tastet die Latte.",
        "Die Latte knistert.",
        "Tarek tritt nieder.",
        "Alle drei rasten.",
      ],
    },
    {
      lines: [
        "Alle drei stellen die Kisten in den Sand.",
        "Tarek tritt an die dritte Latte.",
        "Er tritt fest. Die Latte knistert.",
        // R2: „fällt" scheitert am gesperrten ä, darum „sinkt" statt Präteritum.
        "Dann sinkt die Latte in den Sand.",
        "Der Riss teilt die Latte.",
        "Ilka findet den Riss erst.",
        "Nils findet eine Latte in der Kiste.",
        "Tarek stellt sie in die Leiter.",
        "Ilka tritt an die Latte. Sie ist fest.",
        "Alle drei klettern.",
        "Die Leiter ist stark, sie ist standfest.",
        "Ilka tastet stets die dritte Latte.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n≈17 — etwas allein in Ordnung bringen. Kein Erwachsener hilft, und der
// Schluss ist eine Erkenntnis, kein Lob: eine stehende Uhr ist selten hin.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_UHR_STEHT_STILL: Serie = {
  slug: "die-uhr-steht-still",
  titel: "Die Uhr steht still",
  kind: "geschichte",
  stufen: ["kids", "teens"],
  minTier: 2,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "In einer alten Kiste findet Ilka eine Uhr.",
        "Die Uhr ist aus Stahl und sehr alt.",
        "Sie ist still. Sie tickt nicht.",
        "Ilka hat sie in der Hand.",
        "Kein Ticken, kein Laut, nichts.",
        "Sie dreht die Uhr.",
        "Hinten ist ein Rand aus Stahl.",
        "Der Rand hat drei feine Rillen.",
        "Ilka findet eine feine Nadel.",
        "Der Rand dreht sich. Er dreht sich leise.",
        "Dann ist die Uhr auf.",
        "Innen sind Stahl, Federn und feiner Sand.",
      ],
    },
    {
      lines: [
        "Der Sand steckt in allen Rillen.",
        "Ilka fasst eine sehr feine Feder.",
        "Sie streift den Sand aus den Rillen.",
        "Das dauert eine Stunde.",
        "Nils richtet das Licht.",
        "Das Licht steht still.",
        "Ilka fasst nichts an, sie streift nur.",
        "Jede Rille dauert. Ilka hat die Ruhe.",
        "Nach einer Stunde ist der Sand heraus.",
        "Ilka dreht die Uhr auf.",
        "Nichts. Die Uhr ist still.",
        "Nils sieht Ilka an. Ilka sieht die Uhr an.",
      ],
    },
    {
      lines: [
        "Ilka sucht die Ursache.",
        "Sie dreht die Uhr in das Licht.",
        "Eine feine Feder ist aus ihrer Rille.",
        "Nils tastet sie an. Sie ist nicht fest.",
        "Ilka fasst die Nadel.",
        "Sie streift die Feder in die Rille.",
        "Die Feder rastet ein.",
        "Ilka dreht sie erneut auf.",
        "Erst nichts. Dann ein Ticken.",
        "Ein feines, stilles Ticken.",
        "Die Uhr tickt.",
        "Nils lacht laut.",
      ],
    },
    {
      lines: [
        "Die Uhr tickt eine Stunde.",
        // R4 (Prüfbericht §6.8): Auf die erste folgte „eine dritte" - die zweite
        // fehlte, weil „zweite" am gesperrten z scheitert. Statt zu zählen,
        // trägt die Dauer nun der Rhythmus (kein g/o/m/z/w in dieser Serie).
        "Sie tickt und tickt und tickt.",
        "Ilka stellt die Uhr auf die Truhe.",
        "Sie hat nichts erneuert.",
        // R2: beiden Zeilen fehlte das Partizip; sie waren nur als Paar lesbar.
        // Jede Übungszeile steht für sich, darum zwei ganze Sätze (ohne g/o/m/z,
        // die dieser Serie fehlen).
        "Sie hat nur den Sand aus den Rillen entfernt.",
        "Und nun steckt eine Feder darin.",
        "Die Uhr ist nicht neu.",
        "Sie ist alt, sie ist fein, sie tickt.",
        "Nils sieht auf die Uhr.",
        // R4 (Prüfbericht §6.9): Die eben reparierte Uhr war zwei Zeilen später
        // wieder „kalt und still" - das widerspricht „sie tickt" direkt davor.
        // Die Lehre der Schlusszeilen bleibt unberührt.
        "Ilka fasst sie an. Sie tickt in ihrer Hand.",
        "Eine Uhr, die still steht, ist selten hin.",
        "Sie hat nur Sand in den Rillen.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n≈20 — erste Ich-Erzählung der Stufe (das `ich` kommt erst mit dem c). Thema:
// einen Fehler nicht sofort zugeben und merken, dass das Schweigen schwerer
// wiegt als der Schaden. Bewusst OHNE Strafe und ohne Lehrsatz am Schluss.
// ───────────────────────────────────────────────────────────────────────────────
const TAGS_DARAUF: Serie = {
  slug: "tags-darauf",
  titel: "Tags darauf",
  kind: "geschichte",
  stufen: ["kids", "teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ich sollte nichts anfassen.",
        "Das ist die eine Regel hier.",
        "Auf der Truhe steht eine Schale aus Ton.",
        "Sie ist alt. Sie ist nicht meine.",
        "Ich fasse sie an. Nur einmal, sehr sacht.",
        "Die Schale ist kalt und leicht.",
        "Dann rutscht sie.",
        "Sie fiel auf die Diele.",
        "Ein heller Laut, dann nichts.",
        "Die Schale hat einen Riss.",
        "Der Riss geht durch den Rand.",
        "Ich stelle sie hin, den Riss nach hinten.",
      ],
    },
    {
      lines: [
        "Niemand sieht es.",
        "Ich sage nichts.",
        "Ich denke, das findet niemand.",
        "Die Stunden gehen.",
        "Ich esse nichts. Ich lese nichts.",
        "Ich sehe nur auf die Truhe.",
        "Die Schale steht da, still, den Riss nach hinten.",
        "Erst da merke ich es.",
        "Es ist nicht die Schale.",
        "Es ist die Stille darum.",
        "Ich gehe in den Flur.",
        "Dann gehe ich in die Kammer.",
      ],
    },
    {
      lines: [
        "Ich liege. Ich schlafe nicht.",
        "Ich denke an die Schale auf der Truhe.",
        "Ich denke an den Riss im Rand.",
        "Der Riss ist fein. Er ist klein.",
        "Dennoch ist er da.",
        "Ich stehe auf.",
        "Ich gehe hinaus in den Flur.",
        "Die Schale steht auf der Truhe.",
        "Ich drehe sie.",
        "Der Riss sieht mich an.",
        "Ich stelle sie so hin.",
        "Dann schlafe ich. Nicht gut, doch ich schlafe.",
      ],
    },
    {
      lines: [
        "Tags darauf steht die Schale so da.",
        "Der Riss ist nicht mehr hinten.",
        "Selma sieht ihn gleich.",
        "Sie fragt nichts.",
        "Sie sieht mich an.",
        "Ich sage es. Alles.",
        "Es dauert nicht lange.",
        "Dann ist es heraus.",
        "Selma nickt.",
        "Sie sagt, die Schale ist nicht das Harte.",
        "Das Harte sind die Stunden dahinter.",
        "Ich nicke. Ich hatte sie gerade hinter mir.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n≈20, Wissens-Serie — der Gegenbeweis zum »Regenwurm«: ein Sachthema auf
// Augenhöhe, mit Größenordnungen, einer Rechnung zum Selbstnachmachen und
// einer Grenze am Schluss. Alle Zahlen doppelt geprüft (siehe `herkunft`).
// ───────────────────────────────────────────────────────────────────────────────
const DAS_ECHO: Serie = {
  slug: "das-echo",
  titel: "Das Echo",
  kind: "wissen-serie",
  stufen: ["kids", "teens"],
  minTier: 2,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
    // Zahlen an zwei unabhängigen Stellen gegengeprüft (Dreifach-Disziplin):
    //  – Schallgeschwindigkeit in Luft: 343 m/s bei 20 °C, 331 m/s bei 0 °C
    //    (PTB Braunschweig; Tipler/Mosca, Physik). Darum »gut dreihundert
    //    Meter« als SPANNE statt eines krummen Einzelwerts.
    //  – Lichtgeschwindigkeit 299 792 458 m/s (SI-Definition) ⇒ Verhältnis zu
    //    343 m/s rund 874 000 ⇒ »fast eine Million Mal schneller«.
    //  – Donner: 1000 m ÷ 343 m/s = 2,9 s ⇒ »drei Sekunden sind ein
    //    Kilometer«; neun Sekunden ⇒ 3,09 km ⇒ »gut drei Kilometer«.
    //  – Fledermäuse rufen rund 20 bis 200 kHz; menschliches Hören endet bei
    //    etwa 20 kHz (Deutsche Fledermauswarte; Schnitzler/Kalko, BioScience)
    //    ⇒ »so hoch, dass kein Mensch ihn hört«.
    // Guillemets » « statt deutscher Anführungszeichen — Regel 9.
    fundstelle:
      "Physikalische Grundwerte (Schall- und Lichtgeschwindigkeit, Echoortung), " +
      "an zwei unabhängigen Fachquellen je Wert gegengeprüft.",
  },
  etappen: [
    {
      lines: [
        "Ein Ruf geht durch die Luft.",
        "Er ist nicht schnell.",
        "Er macht gut dreihundert Meter in einer Sekunde.",
        "Das Licht dagegen ist fast eine Million Mal schneller.",
        "Darum siehst du einen Schlag, ehe du ihn hörst.",
        "Genau das macht man in einer Nacht mit Donner.",
        "Du siehst den Schlag. Dann rechnest du.",
        "Drei Sekunden sind ein Kilometer.",
        "Neun Sekunden sind gut drei Kilometer.",
        "Das ist kein Trick. Das ist nur Rechnen.",
        "Der Schlag und der Donner sind eins.",
        "Nur der Donner ist langsam.",
      ],
    },
    {
      lines: [
        "Rufst du an einem Fels, hörst du dich noch einmal.",
        "Der Ruf geht hin.",
        "Der Fels nimmt ihn nicht auf. Er sendet ihn.",
        "So kommt dein Ruf noch einmal an.",
        "Er hat dann die Strecke hin und die Strecke her.",
        "Darum dauert es.",
        "Ist der Fels nah, holt das Echo den Ruf ein.",
        "Dann hörst du nur einen Laut.",
        "Ist der Fels fern, hörst du dich klar noch einmal.",
        "Ein Echo hat also Raum nötig.",
        "In einer engen Kammer hörst du keines.",
        "In einer Halle aus Stein hörst du oft eines.",
      ],
    },
    {
      lines: [
        "Nicht nur Menschen rechnen so.",
        "Eine Fledermaus ruft in die Nacht.",
        "Ihr Ruf ist so hoch, dass kein Mensch ihn hört.",
        "Der Ruf trifft einen Falter.",
        "Er kommt an. Die Fledermaus hört ihn.",
        "Aus der Dauer liest sie die Strecke.",
        "Aus der Richtung liest sie die Stelle.",
        "Sie sieht also mit den Ohren.",
        "Das nennt man Echoortung.",
        "Ein Schiff macht es genauso.",
        "Es sendet einen Laut nach unten.",
        "Aus der Dauer rechnet es die Tiefe.",
      ],
    },
    {
      lines: [
        "Du kannst es allein nachrechnen.",
        "Nimm eine Uhr mit Sekunden.",
        "Steh fern an einer Halle aus Stein.",
        "Ruf einmal, hell und hart.",
        "Rechne die Sekunden, ehe das Echo kommt.",
        "Eine Sekunde sind gut dreihundert Meter.",
        "Der Ruf ging hin und her.",
        "Also liegt die Halle in der Mitte der Strecke.",
        "Das ist Rechnen mit den Ohren.",
        "Es geht nicht immer.",
        "Ist es still und der Fels hart, geht es gut.",
        "Ist es laut, geht der Ruf in allem anderen unter.",
      ],
    },
  ],
};

/** Serien, die gezielt für 10–12 geschrieben sind (30.07.2026). */
export const SERIEN_MITTEL: readonly Serie[] = [
  DER_RISS,
  DIE_UHR_STEHT_STILL,
  TAGS_DARAUF,
  DAS_ECHO,
];
