/**
 * Bücherei-Serien GEZIELT FÜR 13–15 (AG-E5, 29.07.2026).
 *
 * ANLASS: Von 20 Serien, die 13-Jährige zu sehen bekamen, war genau EINE für
 * dieses Alter geschrieben (Die Martinswand); 14 waren aus dem 10–12-Topf
 * geerbt, vier davon mit ausdrücklich jungem Thema (Spinne, Schmetterling,
 * Regenwurm, Marienkäfer). Johannes, 29.07.: „Regenwurm und Maikäfer kann auch
 * für 11-Jährige schon peinlich sein."
 *
 * DER MASSSTAB (Johannes' eigenes Beispiel): Es ist NICHT das Thema, es ist die
 * Behandlung. „Der Regenwurm" ist als Gegenstand völlig in Ordnung — „Was ein
 * Quadratmeter Boden leistet" ist derselbe Gegenstand auf Augenhöhe. Genau
 * diese Serie steht darum hier, als Muster für alles Weitere: gleiche Sache,
 * anderer Zugriff (Zahlen, Verhältnisse, offene Fragen statt Tierporträt).
 *
 * TON (Weiche 1, Jugend-Profil): per Du, aber trocken. Kein Jubel, keine
 * Verkleinerungsformen, kein sprechendes Tier, keine Moral am Schluss. Die
 * Figuren sind so alt wie die Lesenden und werden ernst genommen.
 *
 * RECHTE:
 *  • Die beiden Geschichten sind selbst verfasst (kein Fremdrecht).
 *  • Die Wissens-Serie ist ebenfalls selbst FORMULIERT; die Zahlen darin sind
 *    an ZWEI unabhängigen Fachquellen gegengeprüft (Dreifach-Disziplin,
 *    Bauplan §4) — sie stehen in der `herkunft.fundstelle` der Serie:
 *      – waldwissen.net, „Bodenbiologie: Regenwurm & Co" (Waldboden): 1 g Boden
 *        ≈ 1 Teelöffel mit rund 100 Mio. Bakterienzellen, 60 km Pilzfäden,
 *        30.000 Einzellern, 1.000 Fadenwürmern; rund 120 Regenwürmer je m².
 *      – Bayerische Landesanstalt für Landwirtschaft (LfL), Regenwurm-Erhebung
 *        2010–2016 auf 159 Äckern: im Mittel rund 145 Regenwürmer je m², bei
 *        60 % der Äcker zwischen 60 und 220; unter 60 gilt als bedenklich;
 *        4,5 Arten je Fläche, 49 Arten in Deutschland nachgewiesen.
 *    Beide Quellen bestätigen dieselbe Größenordnung unabhängig voneinander.
 *    Deshalb nennen die Zeilen SPANNEN, keine Scheingenauigkeit — die Dichte
 *    hängt stark von Boden und Bewirtschaftung ab.
 *
 * ZEICHENSATZ wie im Bestand: wörtliche Rede ohne Anführungszeichen
 * (Entscheidung Johannes 28.07.), keine Ziffern in laufenden Zeilen unterhalb
 * T5 — Zahlen darum ausgeschrieben, wo sie früh lesbar sein sollen.
 */
import type { Serie } from "./serie";

const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
} as const;

/**
 * Muster-Serie für den Maßstab „gleicher Gegenstand, andere Behandlung":
 * derselbe Boden wie in „Der Regenwurm" (7–9), aber über Größenordnungen,
 * Verhältnisse und die Grenzen der Messung — nicht über ein einzelnes Tier.
 */
const QUADRATMETER_BODEN: Serie = {
  slug: "was-ein-quadratmeter-boden-leistet",
  titel: "Was ein Quadratmeter Boden leistet",
  kind: "wissen-serie",
  stufen: ["teens"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik (eigene Formulierung)",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
    fundstelle:
      "Zahlen gegengeprüft an waldwissen.net »Bodenbiologie: Regenwurm & Co« " +
      "und der LfL-Bayern-Regenwurmerhebung 2010-2016 (159 Äcker); abgerufen 2026-07-29",
  },
  etappen: [
    {
      lines: [
        "Stell dich auf einen Quadratmeter Wiese.",
        "Unter deinen Schuhen liegt kein toter Stoff.",
        "Dort arbeitet eine ganze Belegschaft.",
        "Sie hat keinen Feierabend und keinen Chef.",
        "Ein einziges Gramm Waldboden reicht schon.",
        "Das ist ungefähr ein Teelöffel.",
        "Darin stecken rund hundert Millionen Bakterien.",
        "Dazu kommen etwa sechzig Kilometer Pilzfäden.",
        "Sechzig Kilometer. In einem Teelöffel.",
        "Rechne das auf deinen Quadratmeter hoch.",
        "Die Zahl wird sinnlos groß.",
        "Genau das ist der Punkt.",
      ],
    },
    {
      lines: [
        "Die bekannteste Kraft dort unten ist der Regenwurm.",
        "Auf einem Quadratmeter leben oft hundert bis zweihundert.",
        "Auf bayerischen Äckern waren es im Mittel rund hundertfünfundvierzig.",
        "Gemessen wurde das über sechs Jahre auf hundertneunundfünfzig Feldern.",
        "Die Spanne ist dabei riesig.",
        "Manche Flächen tragen sechzig, andere zweihundertzwanzig.",
        "Unter sechzig gilt der Boden als bedenklich.",
        "Eine einzige Zahl wäre hier also gelogen.",
        "Boden ist nicht gleich Boden.",
        // R2: „messen" ist transitiv — der Wald misst nichts. Passiv trägt es.
        "Im Wald wird anders gemessen als auf dem Acker.",
        "Nass wird anders gemessen als trocken.",
        "Wer nur einen Wert nennt, verschweigt die Hälfte.",
      ],
    },
    {
      lines: [
        "Was leistet diese Belegschaft eigentlich?",
        "Sie zerlegt, was oben liegen bleibt.",
        "Laub, Wurzeln, Reste von allem.",
        "Ohne sie läge das Zeug einfach da.",
        "Der Wurm zieht es nach unten und frisst es.",
        "Was hinten herauskommt, ist besserer Boden.",
        "Seine Gänge sind dabei fast wichtiger als er selbst.",
        "Durch sie läuft Regen ab, statt oben zu stehen.",
        "Durch sie kommt Luft an die Wurzeln.",
        "Ein Boden ohne Gänge verschlämmt.",
        "Dann rutscht bei Starkregen die Erde weg.",
        "Und mit ihr das, was Pflanzen brauchen.",
      ],
    },
    {
      lines: [
        "Es gibt in Deutschland neunundvierzig Regenwurmarten.",
        "Auf einem einzelnen Acker findet man selten fünf.",
        "Das ist keine Kleinigkeit, sondern ein Befund.",
        "Wenig Arten heißt: Der Boden hält wenig aus.",
        "Fällt eine Art weg, springt keine andere ein.",
        "Vielfalt ist hier kein Schmuck, sondern Reserve.",
        "Was den Bestand drückt, ist bekannt.",
        "Pflug, Verdichtung durch schwere Maschinen, wenig Futter.",
        "Was ihn hebt, ist auch bekannt.",
        "Mulch, Ruhe, Wurzeln über den Winter.",
        "Der Boden erholt sich, aber langsam.",
        "Ein Quadratmeter braucht dafür Jahre, keine Wochen.",
      ],
    },
  ],
};

/**
 * Geschichte für 13–15 über Quellenkritik — ohne Zeigefinger: Die Hauptfigur
 * hat selbst mitgeteilt und merkt es erst hinterher.
 */
const DIE_ZWEITE_QUELLE: Serie = {
  slug: "die-zweite-quelle",
  titel: "Die zweite Quelle",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 3,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Der Screenshot kam um kurz nach acht.",
        "Jemand hatte ihn in die Klassengruppe geworfen.",
        "Ein Foto vom Aushang, ein roter Kreis darum.",
        "Schwimmhalle gesperrt, stand da. Bis auf Weiteres.",
        "Mira leitete ihn weiter, ohne nachzudenken.",
        "Drei Sekunden, zwei Gruppen, siebzig Leute.",
        "Um halb neun schrieb Jonas: Stimmt das überhaupt?",
        "Mira sah sich das Bild noch einmal an.",
        "Der Aushang war da. Der rote Kreis war da.",
        "Ein Datum war nirgends zu sehen.",
        "Sie wollte antworten: Klar stimmt das.",
        "Stattdessen tippte sie nichts.",
      ],
    },
    {
      lines: [
        "In der ersten Stunde ging es weiter.",
        "Jemand hatte gehört, es liege am Chlor.",
        "Jemand anderes wusste von einem Rohrbruch.",
        "Eine dritte Version handelte von Bauarbeiten.",
        "Alle drei bezogen sich auf dasselbe Bild.",
        // R2: Gründe werden genannt, nicht gesagt.
        "Das Bild selbst nannte keinen dieser Gründe.",
        "Mira fiel auf, wie schnell aus nichts etwas wird.",
        "Man muss nur oft genug weiterleiten.",
        "In der Pause suchte sie die Seite der Stadt.",
        "Sie brauchte dafür keine zwei Minuten.",
        "Die Halle war offen. Ganz normal.",
        "Der Aushang war vom März.",
      ],
    },
    {
      lines: [
        "Mira überlegte, ob sie es richtigstellen sollte.",
        "Es war unangenehm, weil sie selbst geteilt hatte.",
        "Sie hätte es einfach auslaufen lassen können.",
        "Gerüchte sterben von allein, meistens.",
        "Aber irgendwer würde umsonst hinfahren.",
        "Sie schrieb kurz und ohne Drumherum.",
        "Der Aushang ist alt, die Halle ist offen.",
        "Dann setzte sie den Link darunter.",
        "Zwei Leute reagierten mit einem Daumen.",
        "Einer schrieb: Hab ich mir fast gedacht.",
        "Niemand entschuldigte sich, sie selbst auch nicht.",
        "Das Gerücht war trotzdem tot.",
      ],
    },
    {
      lines: [
        "Am Nachmittag saß sie mit Jonas am Becken.",
        "Wie kommt man da eigentlich drauf, fragte sie.",
        "Auf die Idee, dass etwas nicht stimmt.",
        "Jonas zuckte mit den Schultern.",
        "Bei mir war es das fehlende Datum, sagte er.",
        "Ein Aushang ohne Datum ist kein Aushang.",
        "Mira dachte an ihre drei Sekunden am Morgen.",
        "Sie hatte das Bild gesehen, nicht gelesen.",
        "Das ist der ganze Unterschied, sagte sie.",
        "Seitdem macht sie es anders herum.",
        "Erst die Quelle, dann der Daumen.",
        "Es kostet zwei Minuten und spart den Rest.",
      ],
    },
  ],
};

/**
 * Geschichte für 13–15 über Üben, das nicht sofort funktioniert — der
 * Gegenstand, der diese Altersgruppe im Trainer selbst betrifft, ohne dass
 * die App ihnen auf die Schulter klopft.
 */
const DIE_LETZTEN_ZEHN_PROZENT: Serie = {
  slug: "die-letzten-zehn-prozent",
  titel: "Die letzten zehn Prozent",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 3,
  topic: "training",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Samuel hing seit zwei Wochen bei denselben Zahlen.",
        "Neunzig Prozent Treffsicherheit, keinen Punkt mehr.",
        "Am Anfang war jede Woche ein Sprung gewesen.",
        "Jetzt passierte gar nichts.",
        "Er übte nicht weniger als vorher.",
        "Er übte sogar mehr, aus Trotz.",
        "Genau das machte es schlimmer.",
        "Je schneller er wollte, desto mehr Fehler.",
        "Er kannte den Rat, langsamer zu tippen.",
        "Er fand ihn albern.",
        "Langsam war er ja schon gewesen.",
        "Dafür hatte er zwei Wochen gebraucht.",
      ],
    },
    {
      lines: [
        "Frau Aydin sah ihm eine Runde lang zu.",
        "Sie sagte lange nichts, was ihn nervte.",
        "Dann fragte sie: Welche Taste war das gerade?",
        "Samuel wusste es nicht.",
        "Sie ließ ihn dieselbe Runde noch einmal tippen.",
        "Diesmal sollte er die Fehler mitzählen.",
        "Nach der Runde hatte er sieben.",
        "Sechs davon waren dieselbe Bewegung.",
        "Der kleine Finger links, immer wieder.",
        "Er hatte zwei Wochen alles geübt.",
        "Und dabei genau nichts geübt.",
        "Das war unangenehm zu hören.",
      ],
    },
    {
      lines: [
        "Die nächsten Tage sahen langweilig aus.",
        "Immer dieselben vier Zeichen, in Gruppen.",
        "Keine Texte, keine Geschichten, kein Ergebnis.",
        "Seine Zahlen wurden erst einmal schlechter.",
        "Das steht so in keinem Ratgeber.",
        "Es fühlte sich nach Rückschritt an.",
        "Frau Aydin nannte es Umbau.",
        "Wer eine Bewegung ändert, wird kurz schlechter.",
        "Danach wird er besser, als er vorher war.",
        "Dazwischen liegt eine Woche, die niemand mag.",
        "Samuel hielt sie aus, weil sie angekündigt war.",
        "Genau darum ging es ihr wohl.",
      ],
    },
    {
      lines: [
        "In der dritten Woche kam der Sprung.",
        "Er kam nicht am Ende einer guten Runde.",
        "Er kam mitten in einem gewöhnlichen Text.",
        "Der kleine Finger saß einfach.",
        "Samuel merkte es erst zwei Zeilen später.",
        "Vierundneunzig Prozent, dann sechsundneunzig.",
        "Das ist wenig für zwei Wochen Arbeit.",
        "Es sind die letzten Prozent, die zählen.",
        "Sie kosten mehr als alle davor zusammen.",
        "Er hätte vorher nicht geglaubt, dass das normal ist.",
        "Heute erklärt er es den Jüngeren so:",
        "Der Umweg über langsam ist der kurze Weg.",
      ],
    },
  ],
};

export const SERIEN_JUGEND2: Serie[] = [
  QUADRATMETER_BODEN,
  DIE_ZWEITE_QUELLE,
  DIE_LETZTEN_ZEHN_PROZENT,
];
