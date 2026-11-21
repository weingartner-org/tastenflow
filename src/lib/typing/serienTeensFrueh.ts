/**
 * FRÜHE Bücherei-Serien GEZIELT FÜR 11-15 (Charge I1, 16.08.2026) — die dritte
 * Treppe, und die erste, die ausschließlich der mittleren Stufe gehört.
 *
 * ANLASS (Bauplan 14.08. §7, Befund (a) der Charge S3): Von den zehn Serien,
 * die `teens` vor dem vollen Alphabet zu sehen bekam, waren SIEBEN mit `kids`
 * geteilt und drei eigene (Die Terrasse n=13 · Die Nachtschicht n=17 · Der
 * Garten hinter dem Haus n=20). Wer mit 13 einsteigt, fand also im Regal
 * überwiegend das, was auch die Achtjährigen lesen — Filo und Mira, Bruno backt
 * Brot, Lisas Laterne. Die Ratsche in `tests/typing-altersgrenze.test.ts` hält
 * beides fest: die Zahl der geerbten Kinderserien (Ziel 0) und die Zahl der
 * eigenen frühen teens-Serien (nur steigend). Wegnehmen ging erst, NACHDEM hier
 * Ersatz stand (Johannes' Weiche 4: erst schreiben, dann aussortieren).
 *
 * DIE TREPPE (gemessen mit `scripts/_seroeffnung.mts`, nicht geschätzt).
 * ★ ACHTUNG: Charge O1 (21.08.2026) hat das `o` direkt hinter das `h` gezogen;
 * die Sprossen-Tafel lautet seither **n=13 · ⇧ · +h(15) · +o(16) · +u(17) ·
 * +c(18) · +g(19) · +m(20) · +b(21) · +w(22)**. Die Zahlen hier sind die NACH
 * dem Umbau, in Klammern der Stand davor:
 *
 *   n=13  Die Frist            (Geschichte)     ·  Die Antenne   (Geschichte)
 *   n=17  Die neunte Stufe     (Geschichte)                             (16)
 *   n=19  Die Halle in der Nacht (Geschichte)                           (18)
 *   n=20  Der Schlaf           (Wissens-Serie)  ·  Der Mond      (Wissens-Serie)
 *
 * Die acht Serien der Charge I1b öffnen heute bei 18/18/20/20/20/22/22/22 —
 * »Die Kette« und »Der Strudel« standen vor O1 bei 17.
 *
 * DER MASSSTAB (Johannes, 30.07. und 14.08.): »11- bis 15-Jährige wollen ernst
 * genommen werden — du, aber trocken. Die BEHANDLUNG zählt, nicht das Thema.
 * Nicht ins Erwachsene kippen.« Vorbilder im Bestand: »Der Riss«, »Die Uhr steht
 * still«, »Das Echo«, »Was ein Quadratmeter Boden leistet«. Daraus abgeleitet:
 * Figuren im Alter der Lesenden, echte kleine Einsätze (eine Frist, ein fremdes
 * Heft, eine Entscheidung ohne Zuschauer), Cliffhanger am Etappen-Ende, keine
 * Moral im Schlusssatz — und in den Wissens-Serien Größenordnungen, eine
 * Rechnung zum Selbstnachmachen und eine Grenze. Keine Verniedlichung, kein
 * Maskottchen, kein sprechendes Tier.
 *
 * WORTSCHATZ-GRENZEN — die eigentliche Arbeit (Regel 13: unterhalb T3 ist der
 * TASTENSATZ die Arbeit, nicht die Handlung). Die Grenzen aus `serienFrueh.ts`
 * und `serienMittel.ts` gelten unverändert; was beim Schreiben DIESER Charge
 * zusätzlich aufgelaufen ist, steht hier — jedes am Objekt geprüft:
 *
 *  • n=13 `a d e f i j k l n r s t ö` — zusätzlich zu den bekannten Löchern
 *    (kein *und*, kein *nicht*, kein *ich*, kein *mit*, kein Zeitwort, kein
 *    Redeverb): **kein *Satz*** (z!) — Ersatz *Fakt, Teil, Stelle, Linie*;
 *    **kein *ihn/ihm/ihr*** (h), also läuft jeder Rückbezug über das Nomen oder
 *    *den/die/das*; **kein *dauert*, kein *neu*, kein *erneut*, kein *auf/aus*
 *    (u); **kein *fort*, kein *sofort* (o). Modalverben gibt es genau zwei:
 *    *kann* und *darf*. Von *sein* existiert keine Vergangenheit (*war* braucht
 *    w) — erzählt wird im Präsens, das Präteritum liefern *fiel, lief, rief,
 *    las, fand, stand, trat, traf, sank, tat, kannte, nannte, rannte*.
 *  • n=16 (+ h o) — die Sprosse, die es vor Charge O1 gar nicht gab: mit dem
 *    `o` kommen *so, oft, ohne, oder, also, sofort, dort, Ort, rot, Hof, Ofen,
 *    Sohn, Ton, Not, Los, Foto, Telefon* — noch OHNE *und/auf/aus* (u).
 *  • n=17 (+ u) — jetzt *und, auf, aus, unter, hinter, heraus, hat, hatte,
 *    steht, sieht, hört, ruft, Haus, Hand, Uhr, Stunde, Heft, Truhe, Flur*.
 *    ABER: das `c` fehlt noch, und damit **jedes sch-Wort** (*Schule, Schritt,
 *    schnell, schön*), **jedes -cht-Wort** (*nicht, nichts, Nacht, Licht,
 *    lacht, sucht*), *sich, auch, durch, noch, schon, doch* — und **kein
 *    *reicht*, kein *legt*, kein *fragt*, kein *sagt*** (g kommt erst mit 19).
 *    Redeverben sind hier genau *nennt, ruft, redet*.
 *  • n=18/19 (+ c, dann + g) — endlich *ich, nicht, sich, auch, nach, durch,
 *    noch, schon, doch, Nacht, Licht, Schule*, und mit dem g *Gang, Gesicht,
 *    gleich, endlich, genau, sagt, legt*. Weiterhin gesperrt: **m b w z** —
 *    also kein *im/am/mit/man/dem/einem*, kein *aber/haben/Abend*, kein
 *    *wir/was/wie/wo* und kein *zu*. Ohne *haben* und ohne *war* bleibt für
 *    die Vergangenheit nur das Präteritum — oder, wie hier, die Ich-Erzählung
 *    im Präsens.
 *  • n=20 (+ m) — *im, am, mit, man, kommt, macht, Morgen, Monat, Mond, Meter,
 *    Kilometer, Million, Minute*. Damit werden Sachtexte überhaupt erst
 *    möglich (vorher fehlt jede Maßeinheit).
 *    Gesperrt bleiben **b w z v p ä ü ß**: kein *aber/halb/Abend*, kein
 *    *wir/wie/wenn/weil*, kein *zu/zwei/zehn/Zeit/Herz/kurz*, kein *Prozent/
 *    Punkt/Kopf*, kein *hält/länger/Nächte/früh/Küste/Stück*. Ersatzwege, die
 *    sich bewährt haben: *hemmt* statt *hält auf*, *fester* statt *länger*,
 *    *Dauer/Frist* statt *Zeit*, Bedingung durch Inversion (»Lernst du und
 *    schläfst du danach, …«) statt *wenn*.
 *
 * ZAHLWÖRTER vor n=21: eins, drei, sechs (ab 18), acht (ab 18), neun, elf,
 * hundert, tausend, Million (ab 20). Gesperrt bleiben zwei, vier, fünf, sieben,
 * zehn, zwölf, zwanzig — darum stehen in den Wissens-Serien Größenordnungen
 * und runde Marken statt krummer Einzelwerte.
 *
 * RECHTE: alle sechs Serien sind SELBST VERFASST. Reale Texte — auch
 * gemeinfreie — halten sich nicht an eine Buchstaben-Freischaltung; auf dieser
 * Ebene ist eigenes Werk der einzige Weg (Bauplan 27.07. §10). Die Fakten der
 * beiden Wissens-Serien sind je an zwei unabhängigen Stellen gegengeprüft; die
 * Belege stehen am Objekt in `herkunft.fundstelle`.
 *
 * ZEICHENSATZ wie im Bestand: wörtliche Rede OHNE Anführungszeichen
 * (Entscheidung Johannes 28.07.), keine Ziffern, Satzzeichen nur . , - ? ! : ;
 * und nur der einfache Bindestrich (Braillezeile, [[feedback_nur_bindestrich]]).
 */
import type { Serie } from "./serie";

/** Herkunft der erzählenden Serien dieser Datei (selbst verfasst, keine Fremdrechte). */
const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// n=13 — die früheste Sprosse, erste von zwei. Thema: eine Frist, eine leere
// Datei und die Frage, was von einer Arbeit übrig bleibt, wenn die Technik sie
// nicht mehr hergibt. Ohne Redeverben (siehe Kopf) trägt die Handlung alles;
// die Wendung ist kein Rettungs-Trick, sondern die eigene Vorarbeit.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_FRIST: Serie = {
  slug: "die-frist",
  titel: "Die Frist",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 1,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Nadia tastet Lettern in eine Datei.",
        "Ein Referat: drei Teile, ein Titel, eine Liste.",
        "Die Frist ist fast da.",
        "Seit den Ferien liest sie, listet sie, testet sie.",
        "Die Datei kennt jeden Fakt, den Nadia kennt.",
        "Sie stellt den Titel an die erste Seite.",
        "Dann rastet sie.",
        "Sie isst, sie trinkt, sie liest keine Seite.",
        "Erst dann startet sie die Datei.",
        "Der Titel ist da.",
        "Die drei Teile sind leer.",
        "Alles leer: kein Fakt, kein Detail, keine Liste.",
      ],
    },
    {
      lines: [
        "Nadia testet alles: die Datei, die Kartei, die Liste.",
        "Da ist kein Fakt. Da ist keine Seite.",
        "Die Frist rennt. Nadia rastet an der Diele.",
        "Sie denkt an die Klasse, an den Titel, an den Stress.",
        "Sie denkt: fair ist das nie.",
        "Dann trifft sie Lars in der Kantine.",
        "Lars kennt Dateien. Lars kennt Daten.",
        "Er listet die Reste. Er findet drei.",
        "Alle drei sind leer.",
        "Lars nennt es klar: da rettet keiner einen Rest.",
        "Nadia dankt. Dann ist sie allein.",
        "Da denkt Nadia an die alte Kiste in der Diele.",
      ],
    },
    {
      lines: [
        "In der Kiste sind Karten, Stifte, alte Test-Seiten.",
        "Nadia kniet an der Kiste.",
        "Sie fand jeden Fakt erst in Karten, dann in der Datei.",
        "Die Karten sind da: elf Stellen, Lettern in Tinte.",
        "Nadia liest jede Karte.",
        "Erst ist sie still, dann ist sie flink.",
        "Sie tastet den ersten Teil in eine leere Datei.",
        "Der erste Teil ist da.",
        "Dann der andere Teil.",
        "Die Karten enden an der elften Stelle.",
        "Der dritte Teil ist in keiner Karte.",
        "Nadia liest die elfte Karte. Sie ist leer.",
      ],
    },
    {
      lines: [
        "Der dritte Teil ist das Ende des Referats.",
        "Kein Fakt, keine Liste, nie eine Karte.",
        "Nadia kennt den Teil. Sie las alles darin.",
        "Sie tastet den Teil, Fakt an Fakt.",
        "Es ist elf. Dann ist es eins.",
        "Die Datei ist da. Nadia sendet sie.",
        "In der Klasse liest Nadia das Referat.",
        "Drei Teile, ein Titel, keine Liste.",
        "Die Klasse ist still.",
        "Lars nennt es klar: das ist es.",
        "Nadia denkt an die elf Karten in der Kiste.",
        "Seit dieser Frist tastet Nadia alles in drei Dateien.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=13, zweite Sprosse. Gegenwarts-Mystery: ein alter Sendemast am Stadtrand,
// eine Kiste voller Karteikarten und eine Adresse, die noch stimmt. Die
// Auflösung ist keine Sensation, sondern ein Mensch — genau das ist der Ton,
// den 11- bis 15-Jährige ernst nehmen.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_ANTENNE: Serie = {
  slug: "die-antenne",
  titel: "Die Antenne",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 1,
  topic: "mystery",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "An der Kante der Stadt ist ein Feld.",
        "Darin ist ein alter Sender.",
        "Der Sender ist eine Antenne, steil, alt, still.",
        "Sie sendet nie.",
        "Faris kennt das Feld seit den Ferien.",
        "Er tritt an die Leiter der Antenne.",
        "Die Leiter ist kalt. Die Latten sind fest.",
        "Faris klettert. Die Latten knistern.",
        "An der Antenne ist eine Kiste.",
        "Die Kiste ist alt. Sie ist nass.",
        "Faris fasst sie an. Sie ist alles andere als leer.",
        "Da sind Karten. Elf Karten, alle in Tinte.",
      ],
    },
    {
      lines: [
        "Faris trifft Elsa in der Kantine der Klasse.",
        "Elsa listet alle Karten.",
        "Es ist eine Kartei: Daten, Titel, feine Linien.",
        "Jede Karte nennt eine Adresse in der Stadt.",
        "Elf Karten, elf Adressen.",
        "Eine Adresse ist die Adresse eines Ladens.",
        "Der Laden ist an der Kante des Feldes.",
        "Elsa kennt den Laden. Er ist seit den Ferien leer.",
        "Die Karte nennt einen Titel: Elektrikerin.",
        "Faris liest die Lettern erst leise, dann klar.",
        "An der Kante der Karte ist ein Detail: ein Stern.",
        "Elsa faltet die Karte. Darin ist ein feiner Faden.",
      ],
    },
    {
      lines: [
        "Elsa, Faris: sie eilen in die Stadt.",
        "Der Laden ist klein. Das Fenster ist leer.",
        "Innen ist es leer, still, kalt.",
        "Elsa tritt an die Klinke. Sie ist fest.",
        "An der Kante des Fensters ist eine Kartei.",
        "Es sind die Karten der Kiste, Letter an Letter.",
        "Ein Detail an der Kante: ein Stern in Eisen.",
        "Faris fasst den Stern an. Er ist klein, fein, kalt.",
        "Dann ist da ein Klirren.",
        "In der Seite des Ladens ist eine Tafel. Sie ist frei.",
        "Elsa tritt an die Tafel. Faris rastet.",
        "Da tritt Renate an die Tafel.",
      ],
    },
    {
      lines: [
        "Renate ist alt. Renate ist die Elektrikerin.",
        "Sie leitete den Sender an dieser Stelle.",
        "Elf Adressen, elf Antennen, alle an einer Linie.",
        "Renate liest die Karten. Sie kennt jede Letter.",
        "Sie nennt Daten, Titel, Stellen.",
        "Faris stellt die Kiste an die Tafel.",
        "Renate dankt still.",
        "Dann eilen alle drei in das Feld.",
        "Renate klettert erst, dann Elsa, dann Faris.",
        "In der Antenne ist es kalt, klar, still.",
        "Da ist alles klein: die Stadt, das Feld, die Laternen.",
        "Elf Antennen, elf Linien - Renate nennt jede.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=17 (vor Charge O1: 16) — Mystery mit einer Entscheidung darin: Darf man ein fremdes Heft lesen,
// nur weil man es gefunden hat? Die Geschichte beantwortet das nicht mit einer
// Regel, sondern damit, was Hanna danach tut.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_NEUNTE_STUFE: Serie = {
  slug: "die-neunte-stufe",
  titel: "Die neunte Stufe",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "mystery",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Hanna kennt jede Stufe des Hauses.",
        "Die dritte ist laut. Die neunte ist still.",
        "Heute ist die neunte Stufe laut.",
        "Hanna tritt darauf. Sie tritt erneut.",
        "Da ist Luft unter der Stufe.",
        "Hanna kniet. Sie tastet die Kante.",
        "Die Stufe ist frei an einer Seite.",
        "Lukas ist in der Halle. Hanna ruft.",
        "Lukas sieht die Stufe. Er sieht Hanna an.",
        "Sie streifen die Kante frei.",
        "Dann ist die Stufe heraus.",
        "Darunter ist ein Heft.",
      ],
    },
    {
      lines: [
        "Das Heft ist alt. Die Seiten sind hart.",
        "In Tinte: Titel, Stunden, Fahrten.",
        "Lettern, sehr fein, sehr klein.",
        "Hanna liest die erste Seite.",
        "Sie hat es in der Hand. Sie ist still.",
        "Lukas sieht sie an.",
        "Ein Heft unter einer Stufe ist kein Heft in einer Truhe.",
        "Hanna denkt: das ist keine leere Seite.",
        "Es sind die Stunden einer anderen.",
        "Sie stellt das Heft in die Stufe.",
        "Dann steht sie in der Halle und tut keinen Tritt.",
        "Erst eine Stunde darauf hat sie das Heft erneut in der Hand.",
      ],
    },
    {
      lines: [
        "Hanna liest. Lukas liest.",
        "Die Lettern sind eine Fahrt: Stadt, Insel, See.",
        "Es sind Jahre in Tinte.",
        "Die neunte Seite nennt dieses Haus.",
        "Sie nennt die Halle, den Flur, die Stufen.",
        "Sie nennt die neunte Stufe.",
        "Darunter, in Tinte: hier liest keiner.",
        "Lukas ist still. Hanna hört ihre Uhr.",
        "Die Seite darauf ist leer.",
        "Alle Seiten darauf sind leer.",
        "Das Heft endet an der neunten Seite.",
        "An der Kante der Seite steht eine Adresse.",
      ],
    },
    {
      lines: [
        "Die Adresse ist in dieser Stadt.",
        "Hanna und Lukas eilen dahin.",
        "Es ist ein Haus, sehr klein, sehr alt.",
        "Eine Rentnerin steht an der Kante des Hauses.",
        "Alle nennen sie Ruth.",
        "Ruth sieht das Heft. Ihre Hand ruht in der Luft.",
        "Ruth stand als Kind in dieser Halle.",
        "Sie ist es, die das Heft in die Stufe stellte.",
        "Hanna stellt das Heft in ihre Hand.",
        "Ruth liest die erste Seite. Dann ist sie leise.",
        "Sie nennt Stunden, Fahrten, Titel - alle aus den Jahren hier.",
        "Seit dieser Stunde ist die neunte Stufe nur eine Stufe.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=19 (vor Charge O1: 18) — die erste Ich-Erzählung dieser Treppe (das `ich`
// kommt mit dem c).
// Thema: etwas herausfinden, das einen anderen Menschen bloßstellen könnte, und
// es NICHT weitererzählen. Bewusst ohne Lehrsatz und ohne Dank am Schluss.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_HALLE_IN_DER_NACHT: Serie = {
  slug: "die-halle-in-der-nacht",
  titel: "Die Halle in der Nacht",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ich helfe in der Halle der Schule.",
        "Ich stelle die Kisten hin, ich schalte die Lichter aus.",
        "Dann ist die Halle dunkel und still.",
        "Ich gehe durch den Gang hinaus.",
        "Erst danach sehe ich es.",
        "In der Halle ist Licht.",
        "Nicht hell. Nur eine feine Linie Licht an der Kante.",
        "Ich schaltete alles aus. Ich schaltete es sicher aus.",
        "Ich stehe drei Sekunden still.",
        "Das Licht ist da.",
        "Ich gehe hinein. Die Halle ist leer.",
        "Ich schalte es aus. In der Nacht darauf ist es an.",
      ],
    },
    {
      lines: [
        "Ich sage es keiner Lehrerin.",
        "Ich sage es auch keiner Freundin.",
        "Es ist nur Licht. Nur ein Licht in einer Halle.",
        "Und ich denke jede Stunde daran.",
        "Die Nacht darauf gehe ich erneut hinein.",
        "Der Gang ist kalt. Ich taste die Kante der Latten.",
        "Ich schalte kein Licht an.",
        "In der Halle ist es hell an einer Seite.",
        "Ich stehe still. Ich lausche.",
        "Erst ist da nichts.",
        "Dann ist da ein Laut: hart, gleich, gleich, gleich.",
        "Es sind Schritte.",
      ],
    },
    {
      lines: [
        "Ich gehe drei Tritte, dann stehe ich.",
        "Die Schritte laufen. Sie halten an. Sie laufen.",
        "Ich lege die Hand an die Kante.",
        "Da rennt ein Kind in der Halle.",
        "Es rennt eine Runde, dann eine Runde, dann eine.",
        "Es ist Judith.",
        "Judith ist in einer anderen Klasse.",
        "Sie rennt allein. Kein Trainer, keine Klasse, keine Uhr.",
        "Ich stehe hinter der Kante. Ich sage nichts.",
        "Judith rennt, steht still, rennt.",
        "Ihre Schritte sind gleich. Alle gleich.",
        "Nach einer Stunde schaltet sie das Licht aus.",
      ],
    },
    {
      lines: [
        "Ich lasse den Gang frei. Judith geht hinaus.",
        "Ich sehe ihr Gesicht nicht.",
        "Erst in der Schule sehe ich es.",
        "Judith ist in der ersten Reihe. Sie ist still.",
        "Ich lese die Kurs-Liste. Judith ist an keiner Stelle.",
        "Ein Kurs ist teuer.",
        "Ich rechne nach.",
        "Ich sage gar nichts.",
        "Die Nacht darauf gehe ich in die Halle.",
        "Ich schalte das Licht an. Ich lasse es an.",
        "Ich stelle die Kisten hinter die Kante des Ganges.",
        "Seit dieser Nacht rennt Judith, und ich liste ihre Runden.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=20, Wissens-Serie — ein Sachthema, das genau diese Stufe betrifft und das
// meist als Erziehungsfrage serviert wird. Hier steht es als Rechnung: Zahlen,
// eine innere Uhr, eine Gegenrechnung zum Selbstnachmachen. Alle Werte an zwei
// unabhängigen Stellen gegengeprüft (siehe `herkunft`).
// ───────────────────────────────────────────────────────────────────────────────
const DER_SCHLAF: Serie = {
  slug: "der-schlaf",
  titel: "Der Schlaf",
  kind: "wissen-serie",
  stufen: ["teens"],
  minTier: 2,
  topic: "koerper",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
    // Jede Aussage an zwei unabhängigen Stellen gegengeprüft (Dreifach-Disziplin):
    //  - Schlafbedarf 13-18 Jahre: 8-10 Stunden je Nacht (Empfehlung der
    //    schlafmedizinischen Fachgesellschaften; gleichlautend bei RKI und den
    //    Krankenkassen-Fachportalen). Darum »gut acht Stunden« als untere Marke
    //    und »neun sind für die meisten richtiger« statt eines Einzelwerts;
    //    »zehn« ist auf dieser Tastenstufe ohnehin nicht schreibbar (z).
    //  - Jüngere Kinder brauchen mehr (Grundschulalter rund 9-11 Stunden).
    //  - Melatonin wird bei Dunkelheit ausgeschüttet, helles Licht am Tagesende
    //    verzögert die Ausschüttung (Chronobiologie; schlafmedizinische
    //    Übersichtsarbeiten zu Melatonin und innerer Uhr).
    //  - In der Jugend setzt die Melatonin-Ausschüttung später ein, die innere
    //    Uhr verschiebt sich nach hinten (Chronobiologie-Fachberichte;
    //    kinderärztliche Übersicht »Wenn die innere Uhr nachgeht«).
    //  - Schlaf festigt Gelerntes, auch Bewegungsabläufe
    //    (Gedächtniskonsolidierung im Schlaf).
    //  - Koffein wirkt über Stunden, nicht Minuten (Halbwertszeit rund fünf
    //    Stunden) - darum die Aussage zum Nachmittag.
    // Guillemets » « statt deutscher Anführungszeichen - Regel 9.
    fundstelle:
      "Schlafmedizinische Empfehlungen zur Schlafdauer im Jugendalter, " +
      "Chronobiologie der inneren Uhr und Melatonin-Ausschüttung; je Aussage " +
      "an zwei unabhängigen Fachquellen gegengeprüft.",
  },
  etappen: [
    {
      lines: [
        "Schlaf ist keine Faulheit.",
        "Im Schlaf ist das Hirn nicht aus.",
        "Es ordnet, es filtert, es festigt.",
        "Alles, das du in der Schule lernst, ist erst locker.",
        "Im Schlaf ordnet das Hirn es ein.",
        "Darum ist eine Nacht mehr als eine Runde Nichtstun.",
        "Lernst du und schlafst du danach, steht das Gelernte fester.",
        "Das ist gemessen, nicht geraten.",
        "Auch die Muskeln lernen in der Nacht.",
        "Ein Griff, den du am Tag hundertmal machst, ist am Morgen sicherer.",
        "Nicht durch mehr Training. Durch Schlaf.",
        "Die Frage ist also nicht das Lernen. Die Frage ist die Dauer.",
      ],
    },
    {
      lines: [
        "Ein Mensch mit elf Jahren hat gut acht Stunden Schlaf nötig.",
        "Die meisten kommen mit neun Stunden richtiger hin als mit acht.",
        "Ein Kind in der Grundschule hat mehr nötig.",
        "Die meisten in einer Klasse kommen nicht auf acht.",
        "Nach einer Nacht merkst du fast nichts.",
        "Nach einer Reihe solcher Tage merkst du es genau.",
        "Der Rest, der fehlt, sammelt sich an.",
        "Er meldet sich als Fehler, als Trödeln, als schlechte Laune.",
        "Am Ende ist es selten das Lernen. Es ist der Schlaf.",
        "Rechne es einmal nach.",
        "Der Unterricht startet um acht. Rechne dein Aufstehen.",
        "Rechne dann acht Stunden nach hinten: da liegt dein Ende des Tages.",
      ],
    },
    {
      lines: [
        "Im Menschen tickt eine innere Uhr.",
        "Sie steckt im Hirn.",
        "Sie richtet sich nach Licht und Dunkel.",
        "Im Dunkel steigt ein Hormon: Melatonin.",
        "Es meldet dem Menschen: der Tag ist aus.",
        "Helles Licht am Ende des Tages hemmt das Hormon.",
        "Ein heller Schirm ist helles Licht.",
        "Darum rutscht der Schlaf nach hinten.",
        "In den Jahren nach elf rutscht die innere Uhr allein nach hinten.",
        "Das ist keine Faulheit, das ist Chemie.",
        "Der Schlaf rutscht, der Unterricht rutscht nicht.",
        "Genau da liegt der Streit: die innere Uhr geht nach, die Schule nicht.",
      ],
    },
    {
      lines: [
        "Drei Dinge helfen, und alle drei sind schlicht.",
        "Erstens: gleiche Stunden.",
        "Steh jeden Morgen um die gleiche Stunde auf, auch nach Ferien.",
        "Die innere Uhr richtet sich nach dem, das jeden Tag gleich ist.",
        "Danach: Dunkel.",
        "Eine Stunde ohne hellen Schirm hilft dem Hormon.",
        "Als Drittes: Koffein.",
        "Koffein steckt in Kaffee, in Tee, in dunkler Limonade.",
        "Es steckt Stunden im Menschen, nicht Minuten.",
        "Koffein am Nachmittag ist in der Nacht immer noch da.",
        "Nichts daran ist ein Trick.",
        "Es ist Rechnen: acht Stunden, gleiche Uhr, dunkles Ende des Tages.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=20, Wissens-Serie — der Mond als Mechanik, nicht als Stimmung: Entfernung,
// gebundener Gleichlauf, Gezeiten, und die Rechnung dahinter, dass er sich
// entfernt. Alle Zahlen an zwei unabhängigen Stellen gegengeprüft.
// ───────────────────────────────────────────────────────────────────────────────
const DER_MOND: Serie = {
  slug: "der-mond",
  titel: "Der Mond",
  kind: "wissen-serie",
  stufen: ["teens"],
  minTier: 2,
  topic: "weltall",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
    // Zahlen und Aussagen je an zwei unabhängigen Stellen gegengeprüft:
    //  - Mittlere Entfernung Erde-Mond: 384 400 km (astronomische
    //    Standardangabe) ⇒ »gut dreihunderttausend Kilometer«. »Vierhundert«
    //    ist auf dieser Tastenstufe nicht schreibbar (v).
    //  - Laufzeit eines Funksignals: 384 400 km ÷ 299 792 458 m/s = 1,28 s
    //    ⇒ »rund eine Sekunde«.
    //  - Gebundene Rotation: Umlauf 27,32 Tage = Eigendrehung ⇒ stets dieselbe
    //    Seite zur Erde. »Rund ein Monat« statt der krummen Zahl (z gesperrt).
    //  - Der Mond leuchtet nicht selbst, er wirft Sonnenlicht zurück.
    //  - Gezeiten: an den meisten Küsten zweimal täglich Flut, auch auf der
    //    mondabgewandten Seite (gemeinsame Bewegung von Erde und Mond um den
    //    gemeinsamen Schwerpunkt).
    //  - Gezeitenreibung bremst die Erddrehung, der Mond entfernt sich um rund
    //    3,8 cm im Jahr, mit Laser gemessen ⇒ »gut drei Meter in hundert Jahren«.
    //  - Der Mond hat keine Atmosphäre; die Fußspuren der Apollo-Landungen sind
    //    darum bis heute unversehrt (Aufnahmen des Lunar Reconnaissance Orbiter).
    fundstelle:
      "Astronomische Standardwerte zu Erde und Mond (Entfernung, gebundene " +
      "Rotation, Gezeiten, Gezeitenreibung und Laser-Entfernungsmessung); " +
      "je Wert an zwei unabhängigen Fachquellen gegengeprüft.",
  },
  etappen: [
    {
      lines: [
        "Der Mond leuchtet nicht.",
        "Er hat kein eigenes Licht.",
        "Alles, das dir hell erscheint, ist Licht der Sonne.",
        "Der Mond schickt es nur her.",
        "Darum ist er in einer Nacht rund, in einer anderen eine Sichel.",
        "Es ist stets der gleiche Mond, nur ein anderer Teil im Licht.",
        "Der Mond ist nicht nah.",
        "Im Mittel sind es gut dreihunderttausend Kilometer.",
        "Ein Signal des Menschen erreicht ihn erst nach rund einer Sekunde.",
        "Ein Ruf im Funk kommt also nie sofort an.",
        "Es ist nur eine Sekunde, und dennoch hörst du sie.",
        "Nichts im Kreis der Erde ist so nah. Und nichts ist so anders.",
      ],
    },
    {
      lines: [
        "Du siehst stets die gleiche Seite des Mondes.",
        "Die andere Seite sieht kein Mensch, der auf der Erde steht.",
        "Das hat einen Grund, und der Grund ist eine Drehung.",
        "Der Mond dreht sich.",
        "Er dreht sich genau einmal in der Frist, in der er die Erde umrundet.",
        "Eine Runde dauert rund einen Monat.",
        "Genau so lange dauert auch seine Drehung.",
        "Darum sieht er uns stets mit dem gleichen Gesicht an.",
        "Die Erde hat seine Drehung im Lauf langer Fristen in diesen Takt geholt.",
        "Das Gleiche macht der Mond mit der Erde.",
        "Er greift nach dem Meer.",
        "Und die Erde merkt es - jeden Tag, an jedem Strand.",
      ],
    },
    {
      lines: [
        "Das Meer steigt und sinkt.",
        "Es steigt, es sinkt, es steigt, es sinkt: so geht ein Tag.",
        "Der Grund ist der Mond.",
        "Er holt das Meer auf der Seite an, die ihm nahe steht.",
        "Auf der anderen Seite der Erde steigt es genauso.",
        "Das ist der Teil, der die meisten stört.",
        "Der Grund ist die Runde, die Erde und Mond gemeinsam machen.",
        "Die Erde dreht sich in einem Tag einmal durch.",
        "Darum erreicht jeder Strand die hohe Stelle nicht nur einmal.",
        "Am Meer richtet sich alles danach: Schiffe, Hafen, Fischer.",
        "Ein Kalender des Meeres ist immer auch ein Kalender des Mondes.",
        "Und der Mond nimmt sich einen Lohn.",
      ],
    },
    {
      lines: [
        "Die Flut schleift an der Erde.",
        "Sie hemmt die Drehung der Erde, sehr langsam.",
        "Ein Tag der Erde ist heute langsamer als in alter Frist.",
        "Der Mond entfernt sich - das ist sein Lohn.",
        "Man hat es gemessen, mit Licht.",
        "Es sind gut drei Meter in hundert Jahren.",
        "Das ist fast nichts. In langen Fristen ist es alles.",
        "Menschen sind auf dem Mond gelandet.",
        "Der Mond hat keine Luft.",
        "Darum steht dort kein Halm, kein Regen, kein Laut.",
        "Und darum stehen die Tritte dieser Menschen dort immer noch.",
        "Kein Regen nimmt sie fort. Nur ein Einschlag könnte es.",
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
 * ZWEITE RUNDE (Charge I1b, 16.08.2026) — acht weitere Serien, damit die
 * RESTLICHEN geerbten Kinderserien die teens-Bücherei verlassen können.
 *
 * ANLASS: I1 hat sechs Serien geschrieben und genau sechs Kinderserien
 * abgegeben — mehr ließ der Regal-Boden nicht zu. `teens` sah danach immer noch
 * acht Titel, die für Siebenjährige geschrieben sind (Filo und Mira, Anna und
 * das Boot, Die Schatzkarte, Bruno backt Brot, Der rote Hut, Ben findet ein Ei,
 * Lena und der kleine Fisch, Nuri hört mehr). Sieben davon öffnen bei n=22, der
 * achte bei n=31.
 *
 * DIE RECHNUNG, die die Öffnungspunkte DIESER acht bestimmt hat (gemessen mit
 * `scripts/_dreistufen.mts`, nicht geschätzt): Nimmt man die sieben n=22-Titel
 * weg, fällt das teens-Regal bei n≤22 von 20 auf 13 — der Boden liegt bei 20.
 * Es braucht also MINDESTENS sieben neue Serien, die bei höchstens 22 Einheiten
 * aufgehen; acht lassen den Punkt sogar wachsen. Zwei Punkte können in dieser
 * Charge nicht wachsen, und das ist Arithmetik, keine Nachlässigkeit: n≤13
 * nicht, weil hier bewusst die MITTLEREN Sprossen bedient werden (13 hat I1
 * geräumt), und n≤31/99 nicht, weil acht Serien hereinkommen und acht
 * hinausgehen.
 *
 * DIE TREPPE dieser Charge:
 *
 *   n=17  Die Kette (Geschichte)   ·  Der Strudel (Geschichte)
 *   n=20  Das Mikrofon (Geschichte) · Der Fund im Moor (Geschichte)
 *         Das Foto (Geschichte)
 *   n=22  Der Schall (Wissen) · Der Wind (Wissen) · Der Stein (Wissen)
 *
 * WORTSCHATZ-GRENZEN, die in DIESER Charge neu aufgelaufen sind (jede am Objekt
 * geprüft; die Grenzen aus dem Kopf dieser Datei gelten unverändert weiter):
 *
 *  • **`v` fehlt bis n=24 — in ALLEN acht Serien.** Damit fällt nicht nur
 *    *von/vor/viel/vier/voll* weg, sondern die ganze Vorsilbe **ver-**:
 *    kein *versteht, verliert, versucht, vergisst, verkauft*. Ersatzwege:
 *    *kennt, findet nicht mehr, sucht, denkt nach*.
 *  • **`p` fehlt bis n=25**: kein *spricht, springt, spielt, Probe, Gruppe,
 *    Kopf, Platz, Prozent, Papier, Sport*. Redeverben bleiben *redet, nennt,
 *    ruft, sagt* (letzteres erst ab n=18).
 *  • **`z` fehlt bis n=23**: kein *zu* — und damit keine einzige
 *    *um-zu*-Fügung; ferner kein *jetzt, Zeit, ganz, kurz, Satz, sitzt, zeigt,
 *    Gesetz, erzählt, Katze, Blitz, Hitze, heizt*. Bei Gewittern hilft
 *    *das helle Licht* statt *Blitz*, bei Wärme *warm/Glut* statt *Hitze*.
 *  • **n=17 (`a c d e f h i j k l n r s t u ö`)** ist die härteste Sprosse
 *    dieser Charge: `c` bringt *ich, nicht, sich, auch, durch, Nacht, Licht,
 *    Schule*, aber `g` fehlt noch — also **kein *Tag***, kein *geht/sagt/gut/
 *    gegen/genau/lang*, und **kein ge-Partizip**: erzählt wird im Präteritum
 *    (*durchtrennte, stellte, fand, trat, rief*). `m` fehlt ebenfalls, also
 *    kein *mir/mich/mein/man/im/am/mit/dem*, kein *Meter/Kilometer*, kein
 *    *Mensch* (Ersatz: *Kind, Leute, keiner*) und kein *Telefon* (`o`).
 *  • **n=20** bringt `g m o`, aber weiterhin kein `b w`: kein *aber, haben,
 *    Probe, schreibt, schiebt, Kabel* und kein *wir/was/wie/wenn/weil/wird*.
 *    Der Gegensatz läuft über *doch*, die Bedingung über Inversion.
 *  • **n=22** bringt `b w` — damit erst werden Sachtexte rund: *Wasser, Wand,
 *    Welle, Wind, warm, wandert, wachsen, Bewegung, bleibt, braucht*. Gesperrt
 *    bleiben *ä ü ß*: kein *hält, lässt, trägt, fährt, älter, später, größer,
 *    heißt, Straße, für, über*. Ersatz: *bleibt fest, nimmt mit, kehrt um,
 *    Alter in Jahren, nennt man, gegen/nach*.
 *
 * ZAHLEN in den drei Wissens-Serien: schreibbar sind *eins, drei, sechs, acht,
 * neun, elf, hundert, dreihundert, sechstausend, tausend, Million, Milliarde* —
 * NICHT *zwei, vier, fünf, sieben, zehn, zwölf, zwanzig* (z/v/ü). Alle Werte
 * sind darum als runde Marken gewählt, die WAHR bleiben („mehr als hundert
 * Kilometer in der Stunde" für die Orkan-Grenze bei 118), nicht als
 * zurechtgebogene Einzelwerte.
 *
 * RECHTE: alle acht Serien sind SELBST VERFASST; die Fakten der drei
 * Wissens-Serien sind je an zwei unabhängigen Fachquellen gegengeprüft, die
 * Belege stehen am Objekt in `herkunft`.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ───────────────────────────────────────────────────────────────────────────────
// n=18 (vor Charge O1: 17), erste von zwei. Ein Rad ist weg, und der Erzähler hat einen Namen im
// Kopf, bevor er einen Fakt hat. Die Geschichte nimmt ihm den Verdacht nicht ab
// und gibt ihm auch keine Vergebung — sie lässt ihn nur die Reihenfolge lernen.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_KETTE: Serie = {
  slug: "die-kette",
  titel: "Die Kette",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ich fahre in die Schule, seit die Klasse in der Stadt ist.",
        "Die Strecke dauert fast eine Stunde.",
        "Das Rad ist alt. Die Kette ist neu.",
        "Ich lasse das Rad an der Kante der Halle.",
        "Eine feste Kette sichert es an der Leiter.",
        "Nach der Schule stehe ich in der Halle.",
        "Die Leiter ist da. Die Kette ist da.",
        "Die Kette ist durchtrennt.",
        "Das Rad fehlt.",
        "Ich suche jede Ecke, jeden Flur, jede Diele.",
        "Kein Rad, kein Fahrer, kein Laut.",
        "Dann tritt Nils aus der Halle. In der Hand hat er eine Kette.",
      ],
    },
    {
      lines: [
        "Die Kette in seiner Hand ist fein und hell.",
        "Ich rufe. Nils steht still.",
        "Er redet nicht. Er sieht die Latten an.",
        "In der Klasse rede ich laut.",
        "Ich nenne Nils. Ich nenne die Kette in seiner Hand.",
        "Die Klasse hört. Die Klasse nickt.",
        "Nils redet auch heute nicht.",
        "Er stellt sein Heft auf den Tisch und liest.",
        "Danach ist die Kantine still. Alle sehen ihn an.",
        "Ich denke an die Kette in seiner Hand.",
        "Das ist kein Fakt. Das ist ein Detail.",
        "In dieser Nacht schlafe ich schlecht.",
      ],
    },
    {
      lines: [
        "Nach der Schule suche ich erneut.",
        "Ich kenne jede Ecke dieses Hauses.",
        "Hinter der Halle ist eine Ausfahrt.",
        "Die Ausfahrt ist frei. Sie ist stets frei.",
        "Da steht das Rad.",
        "Es steht an der Kante, hinter einer Latte.",
        "An der Diele ist ein Strich in Kreide.",
        "Die Aufsicht tritt heraus. Sie kennt das Rad.",
        "Das Rad stand in der Ausfahrt der Feuerleiter.",
        "Sie durchtrennte die Kette und stellte das Rad hinter die Halle.",
        "Die durchtrennte Kette fand danach ein Kind.",
        "Das Kind ist Nils.",
      ],
    },
    {
      lines: [
        "In der Klasse stehe ich auf und rede erneut.",
        "Ich nenne die Ausfahrt. Ich nenne die Aufsicht.",
        "Ich nenne die Kette, die Nils fand.",
        "In der Klasse redet keiner.",
        "Nils sieht auf. Er redet nicht.",
        "Er darf; er hat ein Recht darauf.",
        "Nach der Stunde tritt er an den Tisch.",
        "Er reicht die durchtrennte Kette.",
        "Ich fasse sie an. Sie ist kalt und hart.",
        "Nils redet erst hinter der Halle.",
        "Er nennt eine Stelle in der Stadt: da flickt einer Ketten.",
        "Seit dieser Fahrt suche ich erst den Fakt und rede danach.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=18 (vor Charge O1: 17), zweite Sprosse. Eine Rettung, die genau so abläuft, wie sie ablaufen
// soll: nicht hinterher, sondern rufen und reichen. Die Regel steht in Etappe 1
// und wird in Etappe 3 gebraucht — kein Heldenmut, sondern eine Reihenfolge.
// ───────────────────────────────────────────────────────────────────────────────
const DER_STRUDEL: Serie = {
  slug: "der-strudel",
  titel: "Der Strudel",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "natur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Kira lernt seit den Ferien in einer Klasse: Retten und Helfen.",
        "Der Trainer nennt eine Reihe: erst rufen, dann reichen, nie hinein.",
        "Kira kennt die Reihe. Sie kennt jeden Teil.",
        "In den Ferien ist Kira an der Furt des Flusses.",
        "Der Fluss ist flach. Er ist klar und kalt.",
        "Hinter der Furt steht ein Fels.",
        "Dahinter dreht der Fluss. Da ist ein Strudel.",
        "Eine Tafel steht an der Kante: die Stelle ist heikel.",
        "Ilias kennt die Tafel nicht.",
        "Ilias ist neu in der Schule. Er ist elf.",
        "Er tritt in den Fluss. Er lacht.",
        "Dann steht Ilias nicht. Der Fluss dreht ihn.",
      ],
    },
    {
      lines: [
        "Der Strudel fasst Ilias. Er dreht ihn.",
        "Ilias sinkt. Er tritt und tritt.",
        "Er ruft nicht. Er kann nicht rufen.",
        "Kira steht an der Furt. Sie sieht es.",
        "Kira tritt an den Rand des Flusses.",
        "Dann steht sie still. Erst rufen.",
        "Sie ruft laut. Der Ruf trifft keinen.",
        "An der Furt ist keiner nah. Nur Kira, nur Ilias.",
        "Kira sucht: eine Latte, ein Ast, eine Kette.",
        "An der Tafel lehnt eine Latte. Sie ist fest.",
        "Kira fasst die Latte. Sie tritt an die Kante.",
        "Ilias sinkt erneut. Der Strudel dreht ihn.",
      ],
    },
    {
      lines: [
        "Kira kniet an der Kante. Sie hat die Latte in der Hand.",
        "Sie reicht die Latte hinaus.",
        "Die Latte reicht nicht heran.",
        "Kira kriecht auf die Kante hinaus.",
        "Der Stein unter ihr ist nass und kalt.",
        "Sie reicht erneut. Die Latte trifft eine Hand.",
        "Ilias fasst die Latte. Er fasst sie fest.",
        "Kira tritt fest an den Stein und lehnt sich nach hinten.",
        "Die Latte dreht sich. Der Fluss hilft nicht.",
        "Erst ist es hart. Dann ist Ilias an der Kante.",
        "Kira fasst seine Hand, dann seine Schulter.",
        "Ilias ruht auf den Steinen und hustet.",
      ],
    },
    {
      lines: [
        "Ilias hustet. Dann redet er nicht.",
        "Kira hilft Ilias auf. Sie stehen an der Furt.",
        "Sie stehen, und sie sind still.",
        "Dann laufen sie. Erst Schritt an Schritt, dann schnell.",
        "In der Stadt trifft Kira die Eltern des Kindes.",
        "Die Eltern fahren Ilias in die Klinik.",
        "Ilias ist heil. In der Klinik findet keiner einen Schaden.",
        "Kira redet erst danach.",
        "Sie nennt den Kurs. Sie nennt die Reihe.",
        "Der Trainer hört es. Er nickt und redet nicht.",
        "An der Furt steht die Tafel heute nicht allein.",
        "Seit dieser Stunde lehnt an der Tafel stets eine feste Latte.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=20 — jemand, der nicht auf der Fläche steht, sondern am Regler. Die
// Geschichte handelt von einem Fehler, den man nicht findet, und von den drei
// Sekunden, in denen er dann doch zuschlägt.
// ───────────────────────────────────────────────────────────────────────────────
const DAS_MIKROFON: Serie = {
  slug: "das-mikrofon",
  titel: "Das Mikrofon",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Sina singt nicht. Sina macht den Ton.",
        "Der Chor der Schule singt in der Halle.",
        "Sina hat den Tisch mit der Anlage.",
        "Darauf stehen drei Regler und ein kleines Licht.",
        "Ihre Hand kennt jeden Regler.",
        "Am Montag ist der Durchlauf.",
        "Alles steht: die Leitung, der Strom, die Mikrofone.",
        "Das erste Mikrofon ist gut. Das andere auch.",
        "Das dritte knistert.",
        "Sina dreht den Regler. Das Knistern ist noch da.",
        "Sie sucht den Fehler in der Leitung. Sie findet ihn nicht.",
        "Am Freitag ist das Fest.",
      ],
    },
    {
      lines: [
        "Sina kommt in die Halle, als es noch dunkel ist.",
        "Sie schaltet die Anlage an. Ein Summen kommt aus dem Chor-Ort.",
        "Das dritte Mikrofon knistert erneut.",
        "Sina tauscht die Leitung. Nichts.",
        "Sie tauscht das Mikrofon. Nichts.",
        "Sie kniet unter dem Tisch und sucht die Dose.",
        "Die Dose an der Halle ist locker.",
        "Sina denkt: der Strom ist nicht ihre Sache.",
        "Sie meldet es der Technikerin der Schule.",
        "Die Technikerin hat am Freitag Dienst in einer anderen Schule.",
        "Sie sagt: nimm im Notfall das erste Mikrofon.",
        "Sina merkt sich diesen Rat.",
      ],
    },
    {
      lines: [
        "Der Freitag kommt. Die Halle ist licht und laut.",
        "Eltern, Kinder, Lehrerinnen: alle Reihen sind dicht.",
        "Sina steht hinter dem Tisch. Ihre Hand ist kalt.",
        "Der Chor kommt herein. Das erste Lied ist gut.",
        "Das andere Lied auch.",
        "Im dritten Lied singt Talin allein.",
        "Talin tritt an das dritte Mikrofon.",
        "Sie singt. Und das Mikrofon ist aus.",
        "In der Halle hört man nichts.",
        "Talin singt noch immer. Ihr Gesicht ist ruhig.",
        "Sina hat drei Sekunden.",
        "Ihre Hand geht an den ersten Regler.",
      ],
    },
    {
      lines: [
        "Sina dreht das erste Mikrofon auf.",
        "Sie richtet die Hand in die Luft und deutet.",
        "Talin sieht es. Talin macht drei Schritte.",
        "Sie singt in das erste Mikrofon hinein.",
        "Der Ton steht. Das Lied ist da.",
        "In der Halle klatschen alle.",
        "Talin sucht Sina hinter dem Tisch.",
        "Sie nickt einmal. Mehr nicht.",
        "Nach dem Fest kommt die Leiterin der Schule.",
        "Sie nennt den Chor, die Lehrerin und Sina.",
        "Am Montag findet die Technikerin die lockere Dose.",
        "Seit diesem Fest steht das erste Mikrofon stets an der Kante.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=20 — ein Fund, der nichts erklärt, weil zwei Leute ihn hochgehoben haben.
// Kein alter Mensch löst hier etwas auf; der Verlust ist der Schluss. Bewusst
// so gebaut, damit die Reihe nicht dasselbe Muster wiederholt wie die Antenne.
// ───────────────────────────────────────────────────────────────────────────────
const DER_FUND_IM_MOOR: Serie = {
  slug: "der-fund-im-moor",
  titel: "Der Fund im Moor",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "mystery",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Hinter der Stadt liegt ein Moor.",
        "Ein Steg geht darin hinein.",
        "Ilka und Kaan gehen im Sommer auf den Steg hinaus.",
        "Das Moor ist nass und still. Es riecht nach Erde.",
        "An einer Stelle hat man Torf gestochen.",
        "In der Kante dieser Stelle steckt ein dunkles Ding.",
        "Kaan kniet und streicht die Erde darum frei.",
        "Es ist Leder. Es ist alt.",
        "Es ist ein Schuh.",
        "Der Schuh ist dunkel. Die Naht ist noch dicht.",
        "Ilka denkt an das Museum in der Stadt.",
        "Kaan hat den Schuh schon in der Hand.",
      ],
    },
    {
      lines: [
        "Ilka sagt: nicht anfassen.",
        "Kaan lacht. Ein Schuh ist doch nur ein Schuh.",
        "Sie nehmen ihn mit.",
        "Auf dem Steg redet keiner.",
        "In der Stadt legen sie den Schuh auf den Tisch.",
        "Ilka ruft im Museum an.",
        "Am Telefon meldet sich eine Forscherin.",
        "Sie hört. Dann ist sie still.",
        "Dann fragt sie nach der Stelle.",
        "Kaan kennt die Stelle nicht mehr genau.",
        "Der Steg hat keine Nummer. Das Moor hat keine Namen.",
        "Ilka sieht Kaan an. Und Kaan sieht in den Schuh.",
      ],
    },
    {
      lines: [
        "Am Montag kommt die Forscherin. Sie nennt sich Anke.",
        "Sie fasst den Schuh nicht sofort an.",
        "Erst sieht sie ihn lange an.",
        "Dann redet sie.",
        "Der Schuh ist alt. Nicht hundert Jahre. Mehr.",
        "Im Moor rostet nichts. Im Moor fault nichts.",
        "Leder, Haar, Faden: alles ruht dort.",
        "Die Erde ist sauer und fast ohne Luft.",
        "Anke fragt erneut nach der Stelle.",
        "Ilka nennt den Steg, den Sommer und die Stunde.",
        "Anke nickt langsam. Das ist nicht genug.",
        "Sie sagt: ohne die Stelle ist der Schuh nur ein Schuh.",
      ],
    },
    {
      lines: [
        "Am anderen Morgen fahren alle drei in das Moor.",
        "Ilka sucht den Steg. Der Steg sieht an jeder Stelle gleich aus.",
        "Kaan sucht die Kante. Der Regen hat sie glatt gemacht.",
        "Sie finden drei Stellen. Keine ist die richtige.",
        "Anke legt an einer Stelle einen Rahmen aus.",
        "Sie sucht mit einer Kelle. Sie findet Torf, Torf und Torf.",
        "Dann sagt sie: hier ist es nicht.",
        "Im Museum steht der Schuh danach in einem Kasten.",
        "Auf der Karte darunter steht ein Ort und ein Monat.",
        "Die Stelle fehlt. Sie fehlt nun immer.",
        "Kaan kommt oft in das Museum und steht lange am Kasten.",
        "Ilka kommt nicht mit. Ilka geht in das Moor.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=20 — das Thema, das 11- bis 15-Jährige heute wirklich trifft. Kein
// Lehrsatz, keine Aufklärungsstunde: der Erzähler tut lange gar nichts, und
// genau das ist der Punkt. Der Schluss löst nichts auf — er hält nur fest, wer
// trotzdem jeden Morgen kommt.
// ───────────────────────────────────────────────────────────────────────────────
const DAS_FOTO: Serie = {
  slug: "das-foto",
  titel: "Das Foto",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "In der Kantine strauchelt Ida.",
        "Ihr Teller landet an der Diele.",
        "Salat, Nudeln, Milch: alles liegt darum herum.",
        "Ida ist elf. Sie ist neu in der Schule.",
        "Sie steht auf. Ihr Gesicht ist rot.",
        "Neun oder mehr Kinder lachen.",
        "Einer hat eine Kamera in der Hand.",
        "Es ist ein Telefon, und es macht ein Foto.",
        "Am Nachmittag ist das Foto in der Klasse.",
        "Es ist auch in der Klasse darunter.",
        "Am Morgen darauf kennt es die Schule.",
        "Ich kenne es auch. Es liegt auf meinem Telefon.",
      ],
    },
    {
      lines: [
        "Ich sehe das Foto genau einmal an.",
        "Dann sehe ich es noch einmal an.",
        "Ida steht darin schief. Ihre Hand ist in der Luft.",
        "Das Foto ist nicht lustig. Es ist nur nah.",
        "In der Klasse macht es die Runde.",
        "Einer schickt es an einen Kurs in der Stadt.",
        "Ida kommt am Montag nicht in die Schule.",
        "Am Dienstag kommt sie.",
        "Sie geht durch den Gang und sieht keinen an.",
        "Ich denke: ich mache doch nichts.",
        "Ich schicke es nicht. Ich lache nicht.",
        "Und das Foto liegt noch immer auf meinem Telefon.",
      ],
    },
    {
      lines: [
        "Am Nachmittag ist es still in der Klassen-Runde.",
        "Keiner schickt mehr. Alle sind satt.",
        "Ich stehe an der Kante des Tisches.",
        "Ich lösche das Foto.",
        "Es ist danach nicht mehr auf meinem Telefon.",
        "Es ist danach genau so oft in der Schule.",
        "Löschen ist nichts. Löschen hilft keinem.",
        "Am Morgen darauf stehe ich in der Kantine.",
        "Ida holt einen Teller.",
        "Ich stelle mich hinter sie an.",
        "Ich rede nicht. Sie redet nicht.",
        "Ich gehe mit ihr an den Tisch am Fenster.",
      ],
    },
    {
      lines: [
        "Am Donnerstag kommt die Lehrerin in die Klasse.",
        "Sie legt kein Foto auf den Tisch.",
        "Sie fragt nach dem Foto, ohne einen Namen.",
        "Keiner meldet sich. Keiner sagt einen Namen.",
        "Sie nennt das Recht am eigenen Foto.",
        "Danach ist die Stunde normal.",
        "Ida ist noch immer in der Klasse.",
        "Am Freitag redet sie in der Kantine drei Sekunden.",
        "Sie fragt nach dem Kurs am Nachmittag.",
        "Ich nenne ihn ihr.",
        "Das Foto ist noch da. Ich kenne die Stelle nicht mehr.",
        "Ida kommt dennoch jeden Morgen in die Schule.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=22, Wissens-Serie — Schall als Mechanik: eine Bewegung, eine Rechnung, eine
// Grenze. Der Schluss ist bewusst kein Appell, sondern ein Rechenweg (das Ohr
// rechnet in Jahren). Alle Werte an zwei unabhängigen Stellen gegengeprüft.
// ───────────────────────────────────────────────────────────────────────────────
const DER_SCHALL: Serie = {
  slug: "der-schall",
  titel: "Der Schall",
  kind: "wissen-serie",
  stufen: ["teens"],
  minTier: 2,
  topic: "sinne",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
    // Jede Aussage an zwei unabhängigen Stellen gegengeprüft (Dreifach-Disziplin):
    //  - Schallgeschwindigkeit in Luft bei 20 Grad: 343 m/s (akustische
    //    Standardangabe; gleichlautend in meteorologischen und akustischen
    //    Nachschlagewerken) ⇒ »gut dreihundert Meter in einer Sekunde«.
    //  - Gewitter-Faustregel: Sekunden zwischen Licht und Donner durch drei =
    //    Entfernung in Kilometern; 3 s × 343 m/s = 1029 m ⇒ »rund ein Kilometer«.
    //    Der Wortlaut meidet »Blitz« - das z ist auf dieser Stufe gesperrt.
    //  - Wasser rund 1480 m/s ⇒ »mehr als dreimal so schnell« (Faktor 4,3);
    //    Stahl rund 5900 m/s ⇒ »fast sechstausend Meter in einer Sekunde«.
    //  - Ursache ist die STEIFIGKEIT des Stoffes, nicht allein seine Dichte -
    //    darum »je fester der Stoff«, nicht »je dichter«.
    //  - Im Vakuum gibt es keinen Schall (kein Trägerstoff).
    //  - Echoortung der Fledermaus über Ultraschall; menschlicher Hörbereich
    //    rund 20 Hz bis 20 kHz, die obere Grenze sinkt mit den Jahren.
    //  - Haarsinneszellen im Innenohr wachsen beim Menschen nicht nach; ein
    //    Lärmschaden bleibt darum dauerhaft (HNO-/arbeitsmedizinische Quellen).
    fundstelle:
      "Akustische Standardwerte zur Schallgeschwindigkeit in Luft, Wasser und " +
      "Stahl, Gewitter-Faustregel, Echoortung und Ultraschall sowie " +
      "HNO-Fachauskunft zu Haarsinneszellen und Lärmschwerhörigkeit; je " +
      "Aussage an zwei unabhängigen Fachquellen gegengeprüft.",
  },
  etappen: [
    {
      lines: [
        "Schall ist kein Ding. Schall ist eine Bewegung.",
        "Ein Ton schiebt die Luft an.",
        "Die Luft daneben bekommt diesen Schub.",
        "So wandert eine Welle durch den Raum.",
        "Nichts fliegt dabei mit. Nur der Schub wandert.",
        "Darum ist es im Weltall still.",
        "Dort ist keine Luft, und ohne Luft ist kein Schall.",
        "In Luft macht der Schall gut dreihundert Meter in einer Sekunde.",
        "Das ist schnell. Licht ist Millionen Male schneller.",
        "Darum siehst du ein Gewitter, und erst danach hörst du es.",
        "Erst das helle Licht am Himmel, dann der Donner.",
        "Der Donner sagt dir dabei mehr, als du denkst.",
      ],
    },
    {
      lines: [
        "Der Donner sagt dir, wie fern das Gewitter steht.",
        "Rechne die Sekunden nach dem hellen Licht.",
        "Drei Sekunden sind rund ein Kilometer.",
        "Neun Sekunden sind also rund drei Kilometer.",
        "Werden die Sekunden weniger, kommt das Gewitter heran.",
        "Der Schall braucht einen Stoff. In Luft ist er am langsamsten.",
        "In Wasser ist er mehr als dreimal so schnell.",
        "In Stahl sind es fast sechstausend Meter in einer Sekunde.",
        "Je fester der Stoff, desto schneller der Schall.",
        "Lege das Ohr an eine Schiene: der Schlag kommt eher an als durch Luft.",
        "An einer harten Wand kehrt der Schall um. Das ist das Echo.",
        "Aus einem Echo macht ein Tier eine Karte.",
      ],
    },
    {
      lines: [
        "Die Fledermaus jagt in der Nacht.",
        "Sie sieht wenig. Sie hört ihr Bild.",
        "Sie ruft, und der Ruf ist sehr hoch.",
        "So hoch, dass kein Mensch ihn hört.",
        "Diesen hohen Schall nennt man Ultraschall.",
        "Der Ruf trifft einen Baum, eine Wand, ein Insekt.",
        "Das Echo kommt herein. Die Fledermaus rechnet seine Dauer.",
        "Aus der Dauer wird die Ferne. Aus dem Echo wird das Bild.",
        "Ein Mensch hört tiefe und hohe Laute, doch nicht alle.",
        "Sehr hohe Laute hört ein Kind noch, ein alter Mensch nicht mehr.",
        "Das ist normal. Das Gehör wandert mit den Jahren.",
        "Und es wandert schneller, wenn du es nicht schonst.",
      ],
    },
    {
      lines: [
        "Im Ohr liegt eine Schnecke aus Knochen.",
        "Darin stehen feine Sinneshaare.",
        "Sie wandeln den Schall in ein Signal.",
        "Ohne sie hörst du nichts.",
        "Sehr lauter Schall knickt diese Haare um.",
        "Einmal ist es nur ein Summen im Ohr, und es geht wieder.",
        "Immer wieder ist es ein Schaden, und der geht nicht.",
        "Denn diese Haare wachsen nie nach.",
        "Ein Riss in der Haut heilt. Ein Sinneshaar heilt nicht.",
        "Darum ist eine ruhige Stunde mehr als nichts.",
        "Dreh die Musik herunter. Das Ohr rechnet in Jahren, nicht in Stunden.",
        "Schall ist nur bewegte Luft. Am Ende bewegt er dich.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=22, Wissens-Serie — Wind als Folge, nicht als Laune: Sonne, Druck,
// Bewegung. Mit einer Größenordnung je Etappe und einer Grenze am Schluss
// (ein Windrad darf dem Wind nie alles nehmen). Zahlen zweifach belegt.
// ───────────────────────────────────────────────────────────────────────────────
const DER_WIND: Serie = {
  slug: "der-wind",
  titel: "Der Wind",
  kind: "wissen-serie",
  stufen: ["teens"],
  minTier: 2,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
    // Jede Aussage an zwei unabhängigen Stellen gegengeprüft:
    //  - Wind entsteht aus Luftdruck-Unterschieden, die die Sonne durch
    //    ungleiche Erwärmung von Land und Wasser erzeugt; die Luft strömt vom
    //    hohen zum tiefen Druck (meteorologische Lehrtexte + Wetterlexika).
    //  - Seewind am Tag (Luft vom Meer zum Land), Landwind in der Nacht -
    //    Umkehr, weil Land schneller auskühlt als Wasser.
    //  - Beaufort-Skala: Stufe 12 = Orkan ab 118 km/h (WMO-Definition,
    //    gleichlautend beim Deutschen Wetterdienst) ⇒ »mehr als hundert
    //    Kilometer in der Stunde« (»hundertachtzehn« ist auf dieser Stufe
    //    nicht schreibbar - z).
    //  - Blattspitzen moderner Windräder: rund 250-300 km/h ⇒ »rund
    //    dreihundert Kilometer in der Stunde«.
    //  - Betz: eine Windkraftanlage kann dem Wind nie die ganze Energie
    //    nehmen (theoretische Grenze rund 59 Prozent), weil die Luft hinter
    //    dem Rotor weiterströmen muss.
    //  - Ablenkung durch die Erddrehung (Corioliseffekt) und der Strahlstrom
    //    (Jetstream) in großer Höhe, der Flüge nach Osten beschleunigt.
    fundstelle:
      "Meteorologische Standarddarstellungen zu Windentstehung, Land- und " +
      "Seewind, Beaufort-Skala (DWD) sowie technische Angaben zu " +
      "Blattspitzen-Geschwindigkeit und der Leistungsgrenze nach Betz; je " +
      "Wert an zwei unabhängigen Fachquellen gegengeprüft.",
  },
  etappen: [
    {
      lines: [
        "Wind ist Luft, die wandert.",
        "Sie wandert nie ohne Grund.",
        "Der Grund ist die Sonne.",
        "Die Sonne macht den Boden warm.",
        "Sie macht ihn nicht an allen Stellen gleich warm.",
        "Sand wird schnell warm. Wasser bleibt lange kalt.",
        "Warme Luft ist leicht. Sie steigt.",
        "Am Boden fehlt sie dann. Dort wird der Druck kleiner.",
        "Daneben, wo es kalt ist, bleibt der Druck hoch.",
        "Luft geht immer dahin, wo der Druck kleiner ist.",
        "Dieses Wandern der Luft ist der Wind.",
        "Ohne Sonne gibt es keinen Wind.",
      ],
    },
    {
      lines: [
        "Am Meer siehst du das an einem warmen Tag.",
        "Der Strand wird schnell warm, das Meer nicht.",
        "Am Nachmittag geht der Wind also in das Land herein.",
        "Das nennt man Seewind.",
        "In der Nacht kehrt es sich um.",
        "Das Land wird schnell kalt, das Meer bleibt warm.",
        "Nun geht die Luft in das Meer hinaus: das ist der Landwind.",
        "Fischer kennen das seit Jahrhunderten.",
        "Wie stark der Wind ist, sagt eine alte Skala.",
        "Ein Seemann namens Beaufort hat sie aufgestellt.",
        "Sie hat Stufen. Die höchste Stufe ist der Orkan.",
        "Ein Orkan macht mehr als hundert Kilometer in der Stunde.",
      ],
    },
    {
      lines: [
        "Wind nimmt Sand mit.",
        "Er schleift damit den Fels. Das dauert lange und es hört nie auf.",
        "Er nimmt auch feuchte Luft mit, und daraus wird Regen.",
        "Ohne Wind bliebe der Regen am Meer.",
        "Ein Schiff mit Segel nimmt den Wind als Kraft.",
        "Ein Windrad macht das Gleiche.",
        "Sein Rotor hat meist drei Arme.",
        "Der Rotor dreht sich langsam. Sein Ende dreht sich schnell.",
        "Am Ende des Arms sind es rund dreihundert Kilometer in der Stunde.",
        "Aus dieser Bewegung wird Strom.",
        "Ein Windrad nimmt dem Wind dabei nie alles.",
        "Ein Rest muss bleiben, sonst steht die Luft dahinter still.",
      ],
    },
    {
      lines: [
        "Der Wind geht nicht geradeaus.",
        "Die Erde dreht sich unter ihm.",
        "Darum macht der Wind einen Bogen.",
        "Hoch am Himmel gibt es einen schmalen Strom aus Luft.",
        "Man nennt ihn Strahlstrom.",
        "Er ist schnell. Ein Flieger nach Osten ist mit ihm schneller.",
        "Der Wind ordnet also den Himmel und den Boden.",
        "Am Boden merkst du ihn erst, wenn er stark wird.",
        "Ein Sturm knickt einen Baum, hebt ein Dach, wirft ein Rad um.",
        "Dann hilft nur ein Haus. Kein Baum, kein Steg, kein Rad.",
        "Der Wind ist nichts als Luft mit einem Grund.",
        "Der Grund steht am Himmel: die Sonne.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=22, Wissens-Serie — ein Stein als Uhr. Drei Sorten, ein Kreislauf, und der
// Satz, der die Reihe trägt: die unterste Schicht kam als erste. Alle Angaben
// an zwei unabhängigen Stellen gegengeprüft.
// ───────────────────────────────────────────────────────────────────────────────
const DER_STEIN: Serie = {
  slug: "der-stein",
  titel: "Der Stein",
  kind: "wissen-serie",
  stufen: ["teens"],
  minTier: 2,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
    // Jede Aussage an zwei unabhängigen Stellen gegengeprüft:
    //  - Sedimentgestein: Sand/Schlamm lagert sich in Schichten ab, wird durch
    //    das Gewicht darüber verdichtet und durch ausfallende Minerale (u. a.
    //    Kalk) verkittet ⇒ Sandstein; Vorgang über Millionen Jahre (Diagenese).
    //  - Kalkstein entsteht großteils aus Schalen und Skeletten von Meerestieren
    //    (Muscheln, Korallen) - biogenes Sediment.
    //  - Lagerungsgesetz (Steno, 1669): bei ungestörter Lagerung ist die untere
    //    Schicht die ältere; Gebirgsbildung kann die Folge verstellen oder
    //    umkehren. Die Jahreszahl steht nicht im Text - z ist gesperrt.
    //  - Magmatische Gesteine: langsame Abkühlung in der Tiefe ⇒ grobe Körner
    //    (Granit), schnelle Abkühlung an der Oberfläche ⇒ feine Körner (Basalt).
    //  - Metamorphose: Kalkstein wird unter Druck und großer Hitze zu Marmor,
    //    Sandstein zu einem sehr harten Gestein.
    //  - Kreislauf der Gesteine: Erosion durch Regen, Frost und Wind, erneute
    //    Ablagerung, Versenkung und Aufschmelzung.
    fundstelle:
      "Geologische Standarddarstellungen zur Entstehung von Sand- und " +
      "Kalkstein, zum Lagerungsgesetz nach Steno, zur Korngröße von Granit " +
      "und Basalt, zur Umwandlung in Marmor und zum Kreislauf der Gesteine; " +
      "je Aussage an zwei unabhängigen Fachquellen gegengeprüft.",
  },
  etappen: [
    {
      lines: [
        "Nimm einen Stein in die Hand.",
        "Er ist alt. Sein Alter rechnet man in Millionen Jahren.",
        "Sand am Meer ist der Anfang einer Sorte.",
        "Fluss und Meer legen den Sand in Schichten ab.",
        "Auf die erste Schicht kommt eine neue.",
        "Millionen Jahre lang wird der Sand darunter dicht.",
        "Wasser bringt Kalk herein, und der Kalk bindet die Körner.",
        "Aus dem Sand wird Sandstein.",
        "Kalkstein hat einen anderen Anfang.",
        "Er kommt aus dem Meer, aus Schalen und aus Korallen.",
        "Muscheln und Korallen bauen Kalk. Sie sterben. Der Kalk bleibt.",
        "Aus Millionen Schalen wird ein Berg.",
      ],
    },
    {
      lines: [
        "Wer eine Wand aus Schichten sieht, kann in ihr lesen.",
        "Die unterste Schicht kam als erste. Die oberste kam am Ende.",
        "Das klingt einfach. Es ist der Anfang einer Wissenschaft.",
        "Ein Forscher namens Steno hat es als erster niedergeschrieben.",
        "Seither liest man die Erde als ein Buch.",
        "Jede Schicht ist eine Seite. Jede Seite hat ein Alter.",
        "Ist die Ordnung heil, ist die Sache klar.",
        "Doch die Erde bleibt selten still.",
        "Berge schieben die Schichten hoch. Manchmal kehren sie sich um.",
        "Dann liegt die alte Seite oben.",
        "Ein Forscher merkt das an den Resten darin.",
        "Denn in den Schichten liegen Reste: Muscheln, Blatt, Knochen.",
      ],
    },
    {
      lines: [
        "Nicht jeder Stein kommt aus Schichten.",
        "Tief unter dir liegt Fels in Glut.",
        "Man nennt ihn Magma.",
        "Wird das Magma tief unten langsam kalt, hat es lange Frist.",
        "In dieser Frist wachsen darin Kristalle.",
        "Man sieht sie mit dem Auge: helle und dunkle Körner.",
        "Dieser Stein ist Granit.",
        "Kommt das Magma dagegen an die Luft, wird es schnell kalt.",
        "Dann bleibt keine Frist. Die Körner bleiben sehr klein.",
        "Dieser Stein ist Basalt. Er ist dunkel und dicht.",
        "Ein Blick auf die Körner sagt dir, wo der Stein hart wurde.",
        "Grobe Körner: tief unten. Feine Körner: oben an der Luft.",
      ],
    },
    {
      lines: [
        "Es gibt eine dritte Sorte.",
        "Sie war schon Stein und wurde noch einmal Stein.",
        "Kalkstein kann tief in die Erde geraten.",
        "Dort liegt Druck darauf, und dort ist Glut.",
        "Der Kalkstein bleibt fest, doch er ordnet sich neu.",
        "Aus Kalkstein wird Marmor.",
        "Aus Sandstein wird auf dem gleichen Weg ein sehr harter Stein.",
        "Und dann geht es weiter: Regen, Frost und Wind holen den Fels herunter.",
        "Aus dem Fels wird Sand. Aus dem Sand wird Sandstein.",
        "Aus Sandstein wird unter Druck und Glut ein anderer Stein.",
        "Und tief unten wird er noch einmal Magma.",
        "Der Stein in deiner Hand ist nicht am Ende. Er ist an einer Stelle.",
      ],
    },
  ],
};

/**
 * Serien, die GEZIELT für 11-15 geschrieben sind und VOR dem vollen Alphabet
 * öffnen (Chargen I1 und I1b, 16.08.2026). Reihenfolge = Öffnungspunkt.
 */
export const SERIEN_TEENS_FRUEH: readonly Serie[] = [
  DIE_FRIST,
  DIE_ANTENNE,
  DIE_NEUNTE_STUFE,
  DIE_KETTE,
  DER_STRUDEL,
  DIE_HALLE_IN_DER_NACHT,
  DER_SCHLAF,
  DER_MOND,
  DAS_MIKROFON,
  DER_FUND_IM_MOOR,
  DAS_FOTO,
  DER_SCHALL,
  DER_WIND,
  DER_STEIN,
];
