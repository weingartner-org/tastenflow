/**
 * FRÜHE Bücherei-Serien für den LEHRGANGS-Weg (07.08.2026) — die zweite Treppe.
 *
 * AUSGANGSBEFUND (gemessen mit `scripts/_lehrgangsluecke.mts`): Die frühe
 * Treppe vom 29./30.07. (`serienFrueh.ts`/`serienMittel.ts`) ist auf die
 * `INTRO_ORDER` von „Mein Training" getextet — dort kommt das `n` als elfte
 * Einheit. Der LEHRGANG führt das `n` aber erst in Lektion 16 („N und B") als
 * letzten Buchstaben ein. Folge: Wer den Lehrgang der Reihe nach geht, hatte
 * bis 31 Einheiten KEINE einzige tippbare Serie (jeder frühen Serie fehlte
 * genau das `n`, 164 Zeilen) — der seit dem 28.07. angekündigte
 * Geschichten-Hauptweg schwieg 15 Lektionen lang.
 *
 * DIE TREPPE (Öffnung gemessen an `introducedThroughLesson`, also dem Stand
 * eines reinen Lehrgangs-Gehers — je Stufe eine Kinder- und eine
 * Jugend/Erwachsenen-Fassung, nie 7–9 und 13–15 gemeinsam):
 *
 *   nach Lektion  9 „T und Z"  (17 Einh.)  Der graue Kater (a+b)   · Die letzte Kiste (c+erw.)
 *   nach Lektion 10 „W und O"  (19 Einh.)  Otto, der Otter (a+b)   · Das alte Hotel (c+erw.)
 *   nach Lektion 12 „M und V"  (23 Einh.)  Die Maus im Turm (a+b)  · Der Marmorsaal (c+erw.)
 *
 * Für „Mein Training"-Kinder sind die Serien schlicht zusätzlicher Vorrat —
 * das Bücherei-Tor prüft tastengenau (`serieTypeable`), dort öffnen sie, sobald
 * auch das `z` (INTRO_ORDER-Platz 23) gelernt ist. Ihr `minTier` ist darum 3
 * (das `z` liegt in T3), obwohl sie im Lehrgang sehr früh dran sind.
 *
 * WORTSCHATZ-GRENZEN des Lehrgangs — anders als bei `serienFrueh.ts`, jede am
 * Objekt geprüft (Prüfer der Charge: Buchstaben-Budget je Öffnungsstufe):
 *
 *  • 17 Einh. (`a d e f g h i j k l r s t u z ö`): OHNE n o m w c b p v —
 *    kein **und/ein/kein/nie/an/in/im/am/mit/ich/auch/nicht/dem/den**, kein
 *    sch-Wort (c!), kein **ab/bei/halb/selbst/treibt/hebt/gibt** (b!), kein
 *    **so/oft/dort/also/fort/holt** (o!). Es bleiben: der/die/das/des, er/sie/
 *    es/du/ihr, zu/auf/aus/seit/zur, da/hier/jetzt/heute/stets/fast/erst/
 *    zuerst/zuletzt/dazu/daher/heraus — und Verben wie ist/hat/sagt/fragt/
 *    geht/steht/sieht/liegt/legt/zieht/ruft/eilt/hilft/zeigt/greift/sitzt/
 *    strahlt/segelt/gleitet. Namen tragen die Sätze: Greta, Astrid, Edgar.
 *  • 19 Einh. (+ w o): jetzt wo/wer/was/wie/so/oft/dort/rot/wohl/wir/etwas,
 *    Wald/Wasser/Wiese/Wolke/Woge/Gold/Hotel/Koffer — weiter kein m c b p v n.
 *  • 23 Einh. (+ q p m v): jetzt mit/im/am/um/vom/zum/dem/immer/kommt/warm/
 *    kaum/viel/vor, Maus/Musik/Lampe/Museum/Marmor — weiter kein c n b x y.
 *
 * DIE VIER TEUERSTEN FALLEN dieser Charge (der Prüfer fing 22 Verstöße):
 *  1. JEDES deklinierte Adjektiv im DATIV endet auf -en („der alten Truhe") —
 *     also Akkusativ nehmen, das Adjektiv streichen oder prädikativ stellen.
 *  2. Plural-VERBEN enden alle auf -en — Subjekte im Singular halten oder
 *     verblose Zeilen bauen („Alle drei Igel: da, still, heil, gerettet.").
 *  3. b steckt in ab/bei/halb/selbst/aber/bald/hebt/gibt/treibt/Abend.
 *  4. Wörtliche Rede ohne ich (c!): Er-Form oder Imperativ ausweichen.
 *
 * RECHTE: alle sechs Serien sind selbst verfasst (auf dieser Buchstaben-Ebene
 * ist eigenes Werk der einzige Weg, Bauplan §10). Zeichensatz wie im Bestand:
 * keine Anführungszeichen, keine Ziffern, Satzzeichen nur . , - ? ! : ;
 */
import type { Serie } from "./serie";

/** Herkunft aller Serien dieser Datei (selbst verfasst, keine Fremdrechte). */
const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Öffnet nach Lehrgangs-Lektion 9 „Obere Reihe: T und Z" (17 Einheiten)
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Kinder-Fassung ab 17 Lehrgangs-Einheiten. Greta, Kater Ferdi und drei Igel —
 * kurze Hauptsätze, Rettung, gutes Ende. Ohne n/o/m/w/c/b geschrieben.
 */
const DER_GRAUE_KATER: Serie = {
  slug: "der-graue-kater",
  titel: "Der graue Kater",
  kind: "geschichte",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Greta hat das alte Zelt auf der Heide.",
        "Der graue Kater Ferdi ist stets da.",
        "Ferdi jagt Falter. Greta liest dazu Hefte.",
        "Jetzt ist es still. Greta sieht: Ferdi fehlt!",
        "Greta ruft laut: Ferdi! Ferdi!",
        "Sie eilt zu der Leiter. Die Leiter ist leer.",
        "Sie hetzt zu der Truhe. Da heult es leise.",
        "Greta zittert. Sie fragt: Ist da der Kater?",
        "Sie zieht die Truhe auf. Da ist der Kater!",
        "Ferdi hat da drei zarte Igel!",
        "Der erste Igel starrt. Der letzte Igel döst.",
        "Da klirrt es laut auf der Heide. Greta erstarrt.",
      ],
    },
    {
      lines: [
        "Auf der Heide steht die Ziege Frieda.",
        "Da liegt das Glas. Es hat Risse.",
        "Frieda sagt: Der Iltis ist da. Er stiehlt!",
        "Der Iltis stiehlt Eier. Er jagt auf der Heide.",
        "Greta sagt: Ferdi, halte du die Igel fest!",
        "Greta legt die Igel zart auf das Fell.",
        "Jeder Igel kauert still. Das ist klug.",
        "Da tritt der Iltis heraus. Er ist hurtig.",
        "Frieda tritt dazu. Sie ist riesig, sie ist stark.",
        "Der Iltis sieht Frieda. Er zittert. Er flieht!",
        "Greta strahlt. Frieda ist der Star des Tages!",
        // R4 (Prüfbericht §6.12): Bei drei Igeln IST „der letzte" der dritte -
        // die Zeile meldete ihn zugleich als anwesend und als fehlend.
        // „zweite" scheitert am w, das diese Serie noch nicht hat (Merksatz 5:
        // erst das Werkzeug fragen, dann formulieren). Darum ohne Ordnungszahl.
        "Da sieht Greta die Igel: Der dritte fehlt!",
      ],
    },
    {
      lines: [
        "Greta ruft: Der dritte Igel fehlt! Alle raus!",
        "Ferdi hat es raus: Er eilt zu der Uferstelle.",
        "Der See ist still. Da segelt die alte Tasse.",
        "Der dritte Igel sitzt auf der Tasse!",
        "Die Tasse segelt zu der Seetiefe. Igel, halte aus!",
        "Ferdi zagt erst: Er hasst ja die Flut.",
        "Da siegt das Herz. Ferdi krault zu der Tasse.",
        "Ferdi zieht die Tasse zu der Uferstelle.",
        "Greta hilft dazu. Sie zieht alle heraus.",
        "Alle drei Igel: da, still, heil, gerettet.",
        "Ferdi trieft. Ferdi friert. Er ist der Held!",
        "Der Tag geht zur Ruhe. Greta strahlt still.",
      ],
    },
  ],
};

/**
 * Jugend/Erwachsenen-Fassung ab 17 Lehrgangs-Einheiten. Eine Zustellerin, eine
 * Kiste ohne Adresse, eine vergessene Detektei — nüchtern erzählt, gleiche
 * Buchstaben-Grenzen. Wörtliche Rede in Er-Form (das „ich" braucht ein c).
 */
const DIE_LETZTE_KISTE: Serie = {
  slug: "die-letzte-kiste",
  titel: "Die letzte Kiste",
  kind: "geschichte",
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Astrid hat heute die letzte Fuhre des Tages.",
        "Jede Kiste hat ihre Adresse - fast jede.",
        "Die Adresse fehlt. Auf der Kiste steht: FRAGIL.",
        "Astrid dreht die Kiste zart. Da klirrt es leise.",
        "Astrid ruft die Leitstelle. Es tutet, es tutet, es tutet.",
        "Sie liest die Ladeliste. Die graue Kiste fehlt auf der Liste.",
        "Astrid zögert. Der Tag ist fast aus, die Halle ruft.",
        "Sie zurrt die Kiste fest. Zur Halle, jetzt.",
        "Der Lagerist Edgar sieht die Kiste. Er erstarrt.",
        "Edgar sagt leise: Diese Kiste ist alt. Sehr alt.",
        "Er zeigt auf die Seite der Kiste: da, die Jahreszahl.",
        "Astrid liest: Detektei Regula, Etage drei. Edgar ergraut.",
      ],
    },
    {
      lines: [
        "Die dritte Etage: alt, still, grau.",
        "Astrid steigt zuerst. Edgar zaudert, er geht dazu.",
        "Da ist die alte Glastafel der Detektei.",
        "Die Glastafel sagt es klar: Detektei Regula.",
        "Astrid zieht fest. Es geht auf: der alte Saal.",
        "Der Saal ist fast leer: das Regal, der Sessel, stille Luft.",
        "Auf der Regalzeile liegt die letzte Akte.",
        "Edgar sagt: Der Fall Adler, der letzte Fall der Detektei.",
        "Astrid zieht die graue Kiste zart auf.",
        "Da: die Karte, das Siegel, der glatte Kiesel.",
        "Die Karte zeigt: der See, die Halle, dazu das Kreuz.",
        "Edgar sagt es leise: Das Kreuz liegt hier. Auf dieser Etage!",
      ],
    },
    {
      lines: [
        "Astrid sieht auf die Karte, sie tastet jede Diele aus.",
        "Die letzte Diele ist zart erhöht. Da liegt es!",
        "Edgar zieht die Diele auf. Es rieselt grau.",
        "Da liegt die alte Kassette der Detektei.",
        "Astrid setzt das Siegel auf. Es rastet zart.",
        "Die Kassette geht auf: die letzte Seite des Falles.",
        "Astrid liest laut: Der Fall Adler ist gelöst.",
        "Es fehlte stets der Kiesel: Er ist der letzte Zeuge.",
        "Edgar strahlt: Der alte Fall! Gelöst! Hier!",
        "Die Kiste: Jahre auf der Reise, jetzt erst da.",
        "Astrid sagt: Die Akte geht jetzt zu der Justiz.",
        "Auf der Glastafel glitzert der alte Titel: Detektei Regula.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// Öffnet nach Lehrgangs-Lektion 10 „Obere Reihe: W und O" (19 Einheiten)
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Kinder-Fassung ab 19 Lehrgangs-Einheiten. Der vermeintliche Dieb am Fluss
 * plant in Wahrheit ein Fest — mit w und o gibt es endlich wo/wer/was/dort.
 */
const OTTO_DER_OTTER: Serie = {
  slug: "otto-der-otter",
  titel: "Otto, der Otter",
  kind: "geschichte",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Rosa ist oft dort, wo der Fluss still ist.",
        "Sie liest dort Hefte, sie wirft Kiesel weit.",
        "Heute fehlt ihr roter Stiefel. Er lag stets da!",
        "Rosa fragt die Forelle Klara: Wer stiehlt hier?",
        "Klara sagt: Frag Otto! Der Otter sortiert dort Zeug.",
        "Rosa folgt der Uferwiese. Da sitzt Otto.",
        "Da liegt alles: die Dose, das Seil, der rote Stiefel.",
        "Rosa ruft: Otto! Du stiehlst ja wie die Elster!",
        "Otto zagt still. Er zeigt zu der Uferwiese.",
        "Dort steht es fast fertig: das Otterfest!",
        "Otto sagt leise: Das Fest gilt der Uferwelt.",
        "Da tost es laut: Der Fluss holt weit aus. Die Flut!",
      ],
    },
    {
      lines: [
        "Die Woge rollt her, das Wasser steigt zur Wiese.",
        "Rosa ruft: Das Fest! Die Flut holt es fort!",
        "Otto tut, was der Otter so tut: Er gleitet los!",
        "Er holt die Dose, er holt das Seil aus der Flut.",
        "Klara hilft: Sie zieht das Seil zur Wurzel.",
        "Rosa greift zu. Sie zerrt aus aller Kraft.",
        "Der Stiefel! Er gleitet zur Flusstiefe fort!",
        "Otto jagt zu der Woge. Er ist hurtig wie je.",
        "Otto greift zu. Der rote Stiefel ist gerettet!",
        "Das Wasser gleitet zur Ruhe. Es wird wieder still.",
        "Alles ist gerettet: die Dose, das Seil, der Stiefel.",
        "Otto sagt: Das Fest steht. Jetzt fehlt jeder Gast!",
      ],
    },
    {
      lines: [
        "Rosa ruft es weit aus: Fest! Heute! Alle her!",
        "Die Forelle Klara sagt es jeder Welle weiter.",
        "Die Elster ruft es laut zu Wald, Wiese, Fluss.",
        "Da trottet der Igel her, da eilt die Ratte zu.",
        "Der Star tiriliert froh. Das Fest geht los!",
        "Otto teilt aus: der Keks hier, die Dattel dort.",
        "Rosa wirft Kiesel weit. Jeder Gast will es wie sie.",
        // R2: „ausgleiten" heißt ausrutschen - gemeint ist das Gleiten AUF der Woge.
        "Otto gleitet auf der Woge - der Star des Festes!",
        "Klara reitet die Welle - so weit wie je zuletzt.",
        "Die Wolke wird rot, der Fluss wird zu Gold.",
        "Jeder Gast sagt: Das war das Fest des Jahres!",
        "Rosa geht zur Ruhe. Ihr Stiefel glitzert wie Gold.",
      ],
    },
  ],
};

/**
 * Jugend/Erwachsenen-Fassung ab 19 Lehrgangs-Einheiten. Ein verschwundener
 * Gast, ein zurückgelassener Koffer, eine vergessene Heilquelle im Keller.
 */
const DAS_ALTE_HOTEL: Serie = {
  slug: "das-alte-hotel",
  titel: "Das alte Hotel",
  kind: "geschichte",
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Dora leitet das alte Hotel seit jeher.",
        "Das Haus ist still. Der letzte Gast reiste zeitig fort.",
        "Der Koffer des Gastes steht da - er wartet still.",
        "Dora zögert erst, holt dazu die Gastliste her.",
        "Zeile drei sagt: Rewald, Restaurator, Suite elf.",
        "Restaurator? Hier? Dora stutzt still.",
        "Der Koffer: alt, solide, arg fest gezurrt.",
        "Dora wartet erst. Der Gast kehrt gewiss wieder.",
        "Der zweite Tag geht aus. Der Gast fehlt weiter.",
        "Die Sorge siegt. Der alte Koffer geht auf.",
        "Da liegt: das Werkzeug, das Lot, dazu die alte Karte.",
        // R2: „zeigt" verlangt den Akkusativ („den Keller") - das n fehlt dieser
        // Öffnungsstufe. Darum als Aufzählung im Nominativ (nach Doppelpunkt mit
        // Satzfragment bleibt es klein).
        "Auf der Karte: das Hotel, der Keller, das rote Kreuz.",
      ],
    },
    {
      lines: [
        "Dora steigt zur Kellertiefe. Es ist kalt, still.",
        "Da steht das alte Fass, das Regal, der Krug.",
        "Die Kerze lodert leise. Dora folgt der Karte.",
        "Das rote Kreuz zeigt auf die tiefste Kellerseite.",
        "Dora tastet die kalte Seite aus. Da: der lose Ziegel!",
        "Der Ziegel gleitet heraus. Kalte Luft zieht her.",
        "Da liegt die alte Röhre. Es geht tief weiter.",
        "Dora wartet kurz. Etwas gurgelt leise - Wasser!",
        "Sie folgt der Röhre. Der Keller wird zur Grotte.",
        "Da rieselt es klar heraus: die alte Wasserader!",
        "Das Wasser ist klar wie Glas, kalt wie Eis.",
        "Da hallt es zu ihr her: Wer geht da? Wer ist da?",
      ],
    },
    {
      lines: [
        "Dora erstarrt. Da steht der Gast: Rewald.",
        "Rewald sagt: Diese Ader war das Ziel seit jeher.",
        "Das Hotel steht auf der Heilader der Altstadt.",
        "Er stellt das alte Wasserwerk gerade wieder her.",
        "Dazu das Werkzeug: Das Lot galt der Wassertiefe.",
        "Er war zwei Tage fort - er holte das letzte Teil.",
        "Dora hört still zu. Da wallt der Stolz herauf.",
        "Ihr Hotel steht auf der Heilader. Wer wusste es je?",
        "Rewald zeigt die Karte: der alte Kursaal, das Tor zur Grotte.",
        "Dora sagt: Wir zwei - das wird was, Herr Rewald!",
        "Die Kerze lodert heller. Die Grotte glitzert.",
        "Das alte Hotel wird wieder was: das Heilhaus der Stadt.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// Öffnet nach Lehrgangs-Lektion 12 „Untere Reihe: M und V" (23 Einheiten)
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Kinder-Fassung ab 23 Lehrgangs-Einheiten. Mia und Vogel Pit bringen die
 * stehende Turmuhr wieder zum Gehen — mit m endlich mit/im/am/um.
 */
const DIE_MAUS_IM_TURM: Serie = {
  slug: "die-maus-im-turm",
  titel: "Die Maus im Turm",
  kind: "geschichte",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Die Maus Mia haust im Uhrturm am Markt.",
        "Oft klettert sie zur Turmuhr empor.",
        "Die Uhr ist riesig: das Rad, die Walze, das Seil.",
        "Heute ist es seltsam still. Die Uhr steht!",
        "Der Markt wartet auf die Uhrmusik. Es kommt: Stille.",
        "Mia sagt: Da hilft wohl kaum wer - also: Mia!",
        "Sie klettert zum Uhrwerk empor. Alles steht still.",
        "Da klemmt es: Das Moos sitzt voll im Hauptrad.",
        "Da piepst es. Im Moos sitzt der zarte Vogel Pit.",
        "Pit piepst: Es war kalt. Das Moos war warm, so warm.",
        "Mia sagt: Warm, ja - die Turmuhr leidet dazu.",
        "Da rumpelt es tief im Werk. Jedes Rad zittert!",
      ],
    },
    {
      lines: [
        "Mia ruft: Raus mit dem Moos - das Werk will los!",
        "Pit hilft mit. Er zupft das Moos vom Hauptrad.",
        "Mia zerrt am Resthalm. Es rieselt grau heraus.",
        "Das erste Rad ist frei. Es dreht wieder mit!",
        "Da stutzt Mia: Die Walze steht weiter still.",
        "Das Seil! Es liegt lose um die alte Walze.",
        "Mia klettert zur Walze. Der Turm ist tief - egal!",
        "Sie zieht das Seil stramm. Pit klemmt es am Haltestift fest.",
        "Da greift Rad um Rad. Die Walze rollt wieder mit!",
        "Tief im Turm summt es wieder. Das Uhrwerk geht!",
        "Mia strahlt. Pit tiriliert laut vor Freude mit.",
        "Da poltert es tief im Turm. Wer kommt da empor?",
      ],
    },
    {
      lines: [
        "Es ist der alte Uhrmeister vom Markt: Herr Malz.",
        "Er kommt mit der Leiter, dem Werkzeug, der Lampe.",
        "Herr Malz stutzt: Die Turmuhr geht ja wie zuvor!",
        "Er testet Rad um Rad, Seil um Seil: alles gut.",
        "Da sieht er Mia - dazu Pit mit dem Resthalm.",
        "Herr Malz sagt: Aha! Da war wohl wer flott am Werk.",
        "Er teilt Kekse aus: je Retter der Keks. So gut!",
        "Herr Malz sagt: Der Turm hat jetzt zwei Meister mehr.",
        "Pit kriegt das Amt: Er meldet, was im Werk klemmt.",
        "Mia kriegt das Amt: Sie putzt die Uhr Rad um Rad.",
        "Am Mittag ruft die Turmuhr wieder laut zum Markt.",
        "Der Markt hört zu. Die Uhrmusik ist wieder da!",
      ],
    },
  ],
};

/**
 * Jugend/Erwachsenen-Fassung ab 23 Lehrgangs-Einheiten. Nachts verstellt
 * „etwas" die Statue im Marmorsaal — ein Museums-Rätsel mit ruhiger Auflösung.
 */
const DER_MARMORSAAL: Serie = {
  slug: "der-marmorsaal",
  titel: "Der Marmorsaal",
  kind: "geschichte",
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "kultur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Otto ist Aufseher im Museum der Stadt.",
        "Der Marmorsaal ist ihm das Herz des Hauses.",
        "Da steht die zarte Statue: die Dame mit der Rose.",
        "Immer wieder: Die Statue steht zeitig verstellt da.",
        "Mal weist sie zum Portal, mal weist sie zur Mauer.",
        "Otto testet alles: das Gitter, das Tor, die Kamera.",
        "Das Video zeigt: der leere Saal sowie tiefe Stille.",
        "Wer also war es? Otto will jetzt Klarheit.",
        "Er sagt es kaum wem: Heute harrt er im Saal aus.",
        "Es wird still. Das Haus ruht. Otto wartet mit matter Lampe.",
        "Die Zeit tropft leise. Es ist kalt im Marmorsaal.",
        "Da: Musik! Zarte Musik quillt aus der Mauer her!",
      ],
    },
    {
      lines: [
        "Otto erstarrt. Die Melodie ist alt, zart, seltsam vertraut.",
        "Er folgt der Musik zur Mauer. Da: das alte Gitter.",
        "Das Gitter sitzt vor der Heizröhre des Hauses.",
        "Die Musik quillt tief aus der Röhre empor.",
        "Otto holt die alte Hauskarte aus dem Pult.",
        "Die Röhre zieht vom Marmorsaal tief zum Depot im Keller.",
        "Das Depot ist seit jeher zu. Wer war je dort?",
        "Otto steigt zum Keller. Die Musik wird lauter, klarer.",
        "Da ist das Depot-Tor: alt, massiv, kaum je geölt.",
        "Das Tor steht heute auf. Otto stutzt: Wer war da?",
        "Er tritt zu. Da glimmt es matt: altes Metall.",
        "Im Depot steht er: der alte Musikautomat. Er spielt!",
      ],
    },
    {
      lines: [
        "Der Automat ist riesig: die Walze, die Stifte, das Rad.",
        "Die Walze dreht im Takt. Die Melodie perlt heraus.",
        // R2: „Automat" ist ein n-Deklinationswort („im Automaten") - das n
        // fehlt dieser Öffnungsstufe, darum in den Nominativ gedreht.
        "Der Automat hat das Zeitwerk: Es startet die Musik.",
        "Der Takt wummert zart. Die Mauer leitet es weiter.",
        "Im Marmorsaal zittert dazu das Podest der Statue.",
        "Takt um Takt gleitet die Statue etwas weiter mit.",
        "Da ist es also: Der Automat verstellt die Statue!",
        "Otto stellt das Zeitwerk still. Die Musik gleitet aus.",
        "Zeitig holt Otto das Museumsteam zum Depot.",
        "Das Team stutzt: Der alte Automat ist das wahre Juwel!",
        "Der Automat zieht um - direkt zum Marmorsaal.",
        "Er spielt dort Tag um Tag. Der Saal ist voll wie kaum je.",
      ],
    },
  ],
};

/**
 * Die sechs Serien der Lehrgangs-Treppe, in Öffnungs-Reihenfolge. Wird in
 * `serien.ts` HINTEN an die Registry angehängt (append-only).
 */
export const SERIEN_LEHRGANG_FRUEH: Serie[] = [
  DER_GRAUE_KATER,
  DIE_LETZTE_KISTE,
  OTTO_DER_OTTER,
  DAS_ALTE_HOTEL,
  DIE_MAUS_IM_TURM,
  DER_MARMORSAAL,
];
