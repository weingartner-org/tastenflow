/**
 * DEUTSCHE GESCHICHTEN FÜR ERWACHSENE - Charge G3, 29.08.2026.
 * Sechzehn Serien, Stufe `erwachsen`, alle auf **Sprosse 27**.
 *
 * Gezählt am 29.08.: `de/erwachsen` hatte 24 Geschichten, das Ziel sind vierzig.
 * Damit ist das letzte deutsche Regal voll.
 *
 * ── WARUM ÜBERNOMMENE TEXTE UND KEINE EIGENEN ─────────────────────────────
 *
 * Der Befund, der die Quellenrecherche ausgelöst hat (`QUELLEN-2026-08-29-
 * TASTENFLOW-FREIE-TEXTE.md` §1): Von 173 Serien trugen **161 die Herkunft
 * »Sensorik«** - die Textwelt war fast vollständig Eigenproduktion. Alle 24
 * bestehenden Erwachsenen-Geschichten gehörten dazu. Diese Charge bringt
 * deshalb ausschließlich **freie Fremdtexte**: vier Autoren, vier Tonlagen.
 *
 * | Autor | gestorben | Stücke | Ton |
 * |---|---|---|---|
 * | Johann Peter Hebel | 1826 | 8 | Kalendergeschichte: Witz, Schicksal, Menschenkenntnis |
 * | Heinrich von Kleist | 1811 | 3 | Anekdote und Unheimliches, scharf geschnitten |
 * | Franz Kafka | 1924 | 3 | Parabel, Innensicht, Traumlogik |
 * | Adalbert Stifter | 1868 | 2 | ruhige Naturprosa, österreichisch |
 *
 * Alle vier sind gemeinfrei. Es sind **Nacherzählungen**, keine Abschriften:
 * Bauplan §10 erlaubt das Glätten alter Schreibweisen ausdrücklich, und die
 * Sprosse erzwingt es ohnehin - Hebel schreibt *Irrthum, seyn, giebt*, Kleist
 * schreibt Sätze über zwei Druckseiten. Jede Zeile ist neu gesetzt.
 *
 * ── ⚠️ WIE DIE QUELLEN GEPRÜFT WURDEN (und warum das nötig war) ───────────
 *
 * **Jede einzelne Quelle wurde abgerufen und der Autor am Text bestätigt.**
 * Das klingt nach Umstand und hat vier Fehlgriffe verhindert:
 * - „Unverhofftes Wiedersehen" auf Wikisource ist **nicht** Hebel, sondern ein
 *   Artikel der Gartenlaube von 1870. Hebels Falun-Geschichte steht unter der
 *   alten Schreibung **„Unverhoftes Wiedersehen"** (ein f).
 * - „Die Großmutter" ist ein Gartenlaube-Text über ein Gemälde, nicht die
 *   Erzählung von Ebner-Eschenbach.
 * - „Der gute Mond" ist ein Gedicht ohne Autor aus den Fliegenden Blättern.
 * - „Krambambuli" ist ein Trinklied von 1745, nicht die Hundegeschichte.
 * Wer aus dem Gedächtnis nacherzählt, merkt keinen dieser vier Fälle.
 * ⇒ **Regel für jede künftige Charge: die Quelle abrufen, den Autor am Text
 * prüfen, erst dann schreiben.** [[feedback_zusammenfassung_ist_kein_beleg]]
 *
 * **Bewusst NICHT aufgenommen:** Hebels „Der Husar in Neisse". Darin ertränkt
 * ein Soldat ein Mädchen im Brunnen. Für ein Tippprogramm ist das zu hart -
 * auch für Erwachsene, die die Zeile Zeichen für Zeichen abschreiben müssen.
 *
 * ── SPROSSE 27 ────────────────────────────────────────────────────────────
 *
 * Wie bei den deutschen Wissens-Serien: ohne `x`, `y`, `q` und ohne `ß`.
 * ⚠️ `ss` ist kein Ersatz für `ß` - wo ein Wort ein `ß` braucht, wird das WORT
 * ersetzt, nicht verstümmelt. Was diese Charge gekostet hat: *groß, heiß, weiß,
 * Fuß, Straße, schließen, ließ, saß, aß, hieß, vergaß, Großvater, Maß, draußen,
 * Stoß, Schweiß*. Ersatz, der getragen hat: *gewaltig / weit* statt groß · *sehr
 * warm* statt heiß · *nannte sich / trug den Namen* statt hieß · *hatte Platz
 * genommen* statt saß · *nahm den ersten Bissen* statt aß · *sperren / zumachen*
 * statt schließen · *der Vater meines Vaters* statt Großvater · *vor dem Haus*
 * statt draußen · *dachte nicht mehr daran* statt vergaß.
 * ⚠️⚠️ **Eigennamen sperren härter als alles andere** - sie lassen sich nicht
 * umschreiben. Stifters Knabe heißt im Original **Felix**; das `x` gibt es auf
 * Sprosse 27 nicht. Er wird deshalb durchgehend *der Knabe*, *der Bub*, *der
 * Sohn* genannt. Ebenso fiel Kleists *quer* (`q`) - dort steht jetzt *durch den
 * Raum bis hin zum Ofen*. Beides steht hier, damit die nächste Charge es nicht
 * neu herausfinden muss.
 * ⚠️ Auch die TITEL sind auf 27 gehalten, obwohl nur die Zeilen getippt werden -
 * ein Titel mit `ß` steht sonst in der Bücherei neben Zeilen, die keines haben.
 * Deshalb „Der Reiter im Dorf bei Jena" statt Kleists „Anekdote aus dem letzten
 * preußischen Kriege" und „Der Kaiser und die Obstfrau" statt Hebels „Kayser".
 */
import type { Serie } from "./serie";

const HEBEL = {
  quelle: "Johann Peter Hebel, Schatzkästlein des rheinischen Hausfreundes (1811), Nacherzählung",
  lizenz: "gemeinfrei",
  autor: "Johann Peter Hebel (Original); Nacherzählung: Sensorik-Lernplattform",
  fundstelle: "de.wikisource.org, abgerufen 29.08.2026",
} as const;

const KLEIST = {
  quelle: "Heinrich von Kleist, Berliner Abendblätter (1810/11), Nacherzählung",
  lizenz: "gemeinfrei",
  autor: "Heinrich von Kleist (Original); Nacherzählung: Sensorik-Lernplattform",
  fundstelle: "de.wikisource.org, abgerufen 29.08.2026",
} as const;

const KAFKA = {
  quelle: "Franz Kafka, kurze Prosa (1912-1921), Nacherzählung",
  lizenz: "gemeinfrei",
  autor: "Franz Kafka (Original); Nacherzählung: Sensorik-Lernplattform",
  fundstelle: "de.wikisource.org, abgerufen 29.08.2026",
} as const;

const STIFTER = {
  quelle: "Adalbert Stifter, Bunte Steine (1853) und Studien, Nacherzählung",
  lizenz: "gemeinfrei",
  autor: "Adalbert Stifter (Original); Nacherzählung: Sensorik-Lernplattform",
  fundstelle: "gutenberg.org (eBook 29553 und 7068), abgerufen 29.08.2026",
} as const;

// ─────────────────────────────────────────────────────────── Hebel 1 von 8 ──
const DAS_WIEDERSEHEN_IN_FALUN: Serie = {
  slug: "de-g3-das-wiedersehen-in-falun",
  titel: "Das Wiedersehen in Falun",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "arbeit",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "In Falun in Schweden lebte vor langer Zeit ein Bergmann.",
        "Er war jung, und er hatte eine Braut im selben Ort.",
        "Am Abend vor der Hochzeit sahen die beiden sich noch.",
        "Er sagte zu ihr: Morgen sind wir ein Paar.",
        "Die Braut hatte ihm ein schwarzes Halstuch genäht.",
        "Das sollte er zur Hochzeit tragen, so war es geplant.",
        "Am Morgen ging der Bergmann in die Grube hinunter.",
        "Er kam an diesem Tag nicht wieder herauf.",
        "Er kam auch am nächsten Tag nicht und nicht am dritten.",
        "Die Braut wartete am Rand der Grube und rief hinab.",
        "Aus dem Berg kam keine Antwort, nur kühle Luft.",
        "Am Abend führte man sie nach Hause.",
      ],
    },
    {
      lines: [
        "Die Jahre gingen, und die Braut wurde nicht mehr jung.",
        "Sie legte das schwarze Halstuch in eine Lade.",
        "Sie nahm es manchmal heraus und hielt es in der Hand.",
        "In Falun wurde weiter Erz aus dem Berg geholt.",
        "Kriege kamen und gingen, Könige kamen und gingen.",
        "Ganze Städte brannten ab und wurden neu gebaut.",
        "Im Ort kannte bald niemand mehr den Namen des Bergmanns.",
        "Nur die alte Frau kannte ihn und nannte ihn nie.",
        "Sie hatte niemanden geheiratet in all der Zeit.",
        "Sie ging langsam, und ihr Haar war hell geworden.",
        "Wer sie sah, hielt sie für eine stille alte Frau.",
        "Niemand ahnte, worauf sie im Grunde noch wartete.",
      ],
    },
    {
      lines: [
        "Nach fünfzig Jahren gruben Bergleute einen alten Schacht auf.",
        "Tief unten lag ein Mensch in einem eisernen Wasser.",
        "Das Wasser hatte ihn erhalten wie an seinem letzten Tag.",
        "Sein Gesicht war jung, seine Hände waren jung.",
        "Man trug ihn herauf und legte ihn ans Licht.",
        "Die Bergleute standen um ihn her und kannten ihn nicht.",
        "Man rief die ältesten Leute des Ortes herbei.",
        "Auch sie sahen ihn an und schüttelten die Köpfe.",
        "Da kam die alte Frau langsam über den Hof.",
        "Sie sah den jungen Mann an und wurde ganz ruhig.",
        "Sie sagte: Das ist mein Bräutigam, und ich habe gewartet.",
        "Dann kniete sie neben ihm nieder und hielt seine Hand.",
      ],
    },
    {
      lines: [
        "Die Menschen um sie her wurden still und traten zurück.",
        "Die alte Frau erzählte, wie es damals gewesen war.",
        "Sie nannte den Tag und die Stunde und das Wetter.",
        "Sie sagte: Er ging hinunter und kam nicht herauf.",
        "Nun ist er heraufgekommen, und ich bin alt geworden.",
        "Sie holte das schwarze Halstuch aus der Lade.",
        "Sie legte es ihm um, wie es zur Hochzeit gedacht war.",
        "Man bettete den Bergmann und trug ihn zur Kirche.",
        "Die alte Frau ging hinter ihm her wie eine Braut.",
        "Am Grab sagte sie: Schlaf nun, du hast lange gelegen.",
        "Ich komme bald nach, und dann warte ich nicht mehr.",
        "So endete eine Verlobung nach fünfzig Jahren.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────── Hebel 2 von 8 ──
const DER_JUNGE_MANN_AUS_LONDON: Serie = {
  slug: "de-g3-der-junge-mann-aus-london",
  titel: "Der junge Mann aus London",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "abenteuer",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "Ein junger Mann fuhr mit der Kutsche nach London.",
        "Dort wohnte sein Schwager, den er besuchen wollte.",
        "Es war dunkel, als er in der Stadt ankam.",
        "Er fand das Haus des Schwagers nicht mehr.",
        "Ein Mann von der Kutsche bot ihm ein Bett an.",
        "Er nahm das Angebot an und war froh darüber.",
        "In der Nacht wachte er auf und fand keine Ruhe.",
        "Er zog den Rock des Mannes an und ging vor die Tür.",
        "Er wollte nur ein wenig Luft und einen Blick.",
        "In den fremden Gassen verlor er den Weg.",
        "Er stürzte im Dunkeln und schlug sich die Stirn auf.",
        "Am Rand einer Mauer schlief er endlich ein.",
      ],
    },
    {
      lines: [
        "Der Mann von der Kutsche fand am Morgen das Bett leer.",
        "Er dachte: Man hat ihn auf ein Schiff gebracht.",
        "Damals holte man in London Männer für die Flotte.",
        "Der Mann lief hinaus, um dem Gast zu helfen.",
        "Auf der Gasse wurde er selbst gepackt und fortgeführt.",
        "So waren am Morgen beide nicht mehr im Haus.",
        "In der Nähe fand man Blut auf den Steinen.",
        "Man fand ein Messer und einen fremden Beutel.",
        "Der junge Mann lag daneben und hatte den Rock an.",
        "Der Beutel gehörte dem Mann von der Kutsche.",
        "Man weckte ihn und führte ihn vor den Richter.",
        "Er erzählte alles, und niemand glaubte ihm ein Wort.",
      ],
    },
    {
      lines: [
        "Das Gericht sprach schnell und ohne langes Fragen.",
        "Man führte ihn hinaus, wie es damals Brauch war.",
        "Auf dem Weg kamen seine Schwester und ihr Mann vorbei.",
        "Sie sahen ihn und erkannten ihn im selben Blick.",
        "Der Schwager rief laut und lief zu den Leuten.",
        "Er brachte den jungen Mann noch am selben Tag fort.",
        "In einer stillen Kammer kam der Gerettete zu sich.",
        "Er lag lange und war schwach und sagte wenig.",
        "Als er gehen konnte, wollte er nicht bleiben.",
        "Er hatte Furcht, man hole ihn ein zweites Mal.",
        "Er fuhr über das Meer und ging nach Amerika.",
        "Dort suchte er Arbeit und nannte seinen Namen selten.",
      ],
    },
    {
      lines: [
        "In Philadelphia stand er eines Tages am Hafen.",
        "Vor ihm ging ein Mann, den er zu kennen glaubte.",
        "Es war der Mann von der Kutsche aus London.",
        "Die beiden sahen sich an und wurden erst zornig.",
        "Der eine sagte: Du hast mich um mein Leben gebracht.",
        "Der andere sagte: Und du mich um meine Freiheit.",
        "Dann standen sie und wussten nicht weiter.",
        "Am Ende gingen sie zusammen in ein Wirtshaus.",
        "Sie erzählten sich alles der Reihe nach.",
        "Bei jedem Satz wurde die Sache klarer und milder.",
        "Am Ende lachten beide über die alte Verwirrung.",
        "Sie blieben Freunde, so weit von zu Hause.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────── Hebel 3 von 8 ──
const DER_SILBERNE_LOEFFEL: Serie = {
  slug: "de-g3-der-silberne-loeffel",
  titel: "Der silberne Löffel",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "In einem Wirtshaus in Wien war eine lange Tafel gedeckt.",
        "Viele Gäste hatten dort Platz genommen.",
        "Es gab Suppe, und vor jedem lag ein silberner Löffel.",
        "Ein Offizier hatte den Platz an der Ecke bekommen.",
        "Ihm gegenüber hatte ein Mann im grünen Rock Platz.",
        "Der Offizier sah ihn an, ohne dass es auffiel.",
        "Er sah, wie der Mann den Löffel in die Tasche schob.",
        "Der Mann tat es ruhig und sah dabei zur Decke.",
        "Der Offizier sagte kein Wort und rührte sich nicht.",
        "Er nahm nun selbst den eigenen Löffel in die Hand.",
        "Er wischte ihn ab und schob ihn in den Rock.",
        "Dabei sah er den Wirt an, der in der Nähe stand.",
      ],
    },
    {
      lines: [
        "Der Wirt hatte alles gesehen und wurde blass.",
        "Ein Offizier nimmt Löffel, dachte er, das gibt Ärger.",
        "Er ging näher und blieb hinter dem Stuhl stehen.",
        "Er hustete leise und wartete auf ein Zeichen.",
        "Der Offizier tat, als merke er gar nichts.",
        "Er sprach mit dem Nachbarn über das Wetter.",
        "Der Wirt trat unruhig von einem Bein auf das andere.",
        "Am Ende beugte er sich hinunter und sprach ihn an.",
        "Er sagte leise: Der Herr hat etwas in der Tasche.",
        "Der Offizier sagte: Das ist wohl richtig, ja.",
        "Der Wirt sagte: Es ist ein Löffel aus dem Haus.",
        "Der Offizier sagte: Auch das ist richtig, ganz recht.",
      ],
    },
    {
      lines: [
        "Nun standen die Gäste auf und wurden aufmerksam.",
        "Der Offizier legte den Löffel auf den Tisch.",
        "Er sagte: Ich habe nur ein Kunststück gezeigt.",
        "Wer will, kann es auch, und einer hier kann es schon.",
        "Er sah dabei den Mann im grünen Rock nicht an.",
        "Der Mann im grünen Rock wurde rot bis an die Ohren.",
        "Er griff in die Tasche und holte den Löffel hervor.",
        "Er legte ihn hin und sagte: Dasselbe Kunststück.",
        "Die Gäste lachten, und der Wirt lachte am lautesten.",
        "Er zählte seine Löffel und hatte alle beisammen.",
        "Der Mann im grünen Rock ging bald darauf hinaus.",
        "Er kam in dieses Wirtshaus nicht wieder.",
      ],
    },
    {
      lines: [
        "Der Offizier blieb am Tisch und trank in Ruhe aus.",
        "Ein Gast fragte ihn, warum er nicht gerufen habe.",
        "Er sagte: Ein Ruf hätte den Mann ins Loch gebracht.",
        "Ein Löffel ist ein Löffel, und ein Leben ist mehr.",
        "So hat er ihn zurückgelegt und ist frei geblieben.",
        "Der Gast sagte: Und wenn er ihn behalten hätte?",
        "Der Offizier sagte: Dann hätte ich ihn genannt.",
        "Aber ich habe ihm zuerst den leichten Weg gelassen.",
        "Der Wirt brachte dem Offizier noch einen Krug.",
        "Er stellte ihn hin und wollte kein Geld dafür.",
        "Der Offizier zahlte trotzdem und ging seiner Wege.",
        "In Wien erzählte man die Sache noch lange.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────── Hebel 4 von 8 ──
const DER_FREMDE_HERR: Serie = {
  slug: "de-g3-der-fremde-herr",
  titel: "Der fremde Herr",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "In Brassenheim war Jahrmarkt, und alles war unterwegs.",
        "Buden standen in einer Reihe bis zum Brunnen.",
        "Ein fremder Herr kam an und stieg im Gasthof ab.",
        "Er trug einen feinen Rock und einen Hut mit Feder.",
        "Er redete laut und wollte immer das Beste haben.",
        "Die Leute im Haus wurden aufmerksam und leiser.",
        "Man dachte: Das ist wohl ein Herr von weit her.",
        "Der Wirt selbst trug ihm die Teller herbei.",
        "Der fremde Herr sprach über Pferde und über Reisen.",
        "Er kannte Städte, die keiner am Tisch kannte.",
        "Er nannte Namen, und alle nickten dazu.",
        "Niemand fragte nach, und das gefiel ihm gut.",
      ],
    },
    {
      lines: [
        "Am Nebentisch nahm ein alter Handwerker Platz.",
        "Er hörte eine Weile zu und sagte nichts.",
        "Ihm fiel auf, wie der Fremde die Hände hielt.",
        "Die Finger waren dünn und an den Kuppen hart.",
        "So werden Finger, die lange die Nadel führen.",
        "Der Alte sah auch, wie der Fremde die Naht prüfte.",
        "Ein Herr prüft keine Naht, ein Schneider tut es.",
        "Der Alte sagte noch immer nichts und trank.",
        "Der Fremde bestellte Wein und wurde lauter.",
        "Er sprach von einem Gut, das ihm gehören sollte.",
        "Bei jedem Satz sah er kurz zur Tür hinüber.",
        "Wer nichts zu fürchten hat, sieht nicht zur Tür.",
      ],
    },
    {
      lines: [
        "Am Abend kam ein Bote aus dem Nachbarort herein.",
        "Er suchte einen Schneider, der Arbeit liegen hatte.",
        "Der fremde Herr wurde still und sah in den Krug.",
        "Der alte Handwerker sagte: Hier ist wohl einer.",
        "Alle Köpfe drehten sich zu dem feinen Rock.",
        "Der Fremde stand auf und wollte zur Tür hinaus.",
        "Der Wirt trat ihm in den Weg und hielt ihn nicht.",
        "Er sagte nur: Der Herr hat noch nicht gezahlt.",
        "Da griff der Fremde in die Tasche und wurde rot.",
        "Er hatte weniger Geld als Rock am Leib.",
        "Der alte Handwerker legte das Fehlende hin.",
        "Er sagte: Man soll niemanden vor Leuten stellen.",
      ],
    },
    {
      lines: [
        "Der Fremde ging hinaus und kam bald wieder herein.",
        "Er hatte den Hut mit der Feder in der Hand.",
        "Er setzte sich an den Tisch des Alten und schwieg.",
        "Dann sagte er: Ich bin Schneider und komme aus dem Tal.",
        "Ich wollte einmal sehen, wie es dem Feinen ergeht.",
        "Der Alte sagte: Nun hast du es gesehen, und wie war es?",
        "Der Schneider sagte: Es war unruhig von Anfang an.",
        "Man muss immer aufpassen, was man gerade sein soll.",
        "Der Alte sagte: Das ist die ganze Lehre daraus.",
        "Man soll nie mehr scheinen wollen, als man ist.",
        "Am nächsten Morgen nahm der Schneider die Arbeit an.",
        "Er blieb im Ort und wurde ein geachteter Mann.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────── Hebel 5 von 8 ──
const DER_KAISER_UND_DIE_OBSTFRAU: Serie = {
  slug: "de-g3-der-kaiser-und-die-obstfrau",
  titel: "Der Kaiser und die Obstfrau",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "kultur",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "In Brienne stand vor der Schule eine Obstfrau.",
        "Sie hatte einen Korb mit Äpfeln und Birnen.",
        "Die Kinder der Schule kamen in der Pause herüber.",
        "Ein Knabe kam oft und hatte selten Geld.",
        "Er war klein, ernst und sprach wenig mit den anderen.",
        "Die Obstfrau gab ihm dennoch, was er brauchte.",
        "Sie schrieb mit Kreide an ein Brett, was er nahm.",
        "Der Knabe sagte jedes Mal: Ich zahle es zurück.",
        "Die Obstfrau sagte: Das eilt nicht, iss nur.",
        "Die Striche wurden mehr, und keiner zählte sie.",
        "Im Sommer ging der Knabe fort auf eine andere Schule.",
        "Die Obstfrau wischte das Brett ab und dachte nicht mehr daran.",
      ],
    },
    {
      lines: [
        "Es gingen Jahre ins Land, und vieles wurde anders.",
        "Aus dem Knaben wurde ein Offizier, dann mehr.",
        "Am Ende trug er die Krone und war Kaiser.",
        "Sein Name stand in allen Zeitungen des Landes.",
        "In Brienne erzählte man: Der war doch bei uns.",
        "Die Obstfrau war alt geworden und hatte wenig.",
        "Ihr Korb war leichter als früher und oft leer.",
        "Sie hatte denselben Platz vor der Schule behalten.",
        "Die Kinder kannten sie und nannten sie die Alte.",
        "Von dem Knaben von damals sprach sie nie.",
        "Sie hätte auch nicht gewusst, wie sie es tun sollte.",
        "Der Winter kam, und der Korb wurde noch leichter.",
      ],
    },
    {
      lines: [
        "Eines Tages hielt ein Wagen vor der Schule.",
        "Ein Herr stieg aus und fragte nach der Obstfrau.",
        "Man zeigte auf die alte Frau mit dem Korb.",
        "Der Herr trat zu ihr und nannte einen alten Namen.",
        "Er sagte: Der Kaiser hat mich zu Ihnen geschickt.",
        "Die Obstfrau verstand ihn zuerst gar nicht.",
        "Der Herr sagte: Es geht um Äpfel und um Kreide.",
        "Da fiel ihr das Brett von damals wieder ein.",
        "Sie sagte: Das war doch nichts, das ist lange her.",
        "Der Herr sagte: Er hat es sich anders gemerkt.",
        "Er legte einen Beutel in ihre alte Hand.",
        "Darin war mehr, als der Korb je getragen hatte.",
      ],
    },
    {
      lines: [
        "Die Obstfrau stand und wusste nicht, wohin sehen.",
        "Sie sagte: So viel war es niemals, bei Weitem nicht.",
        "Der Herr sagte: Es sind nicht nur die Äpfel.",
        "Es ist auch das Warten, und das war das Teuerste.",
        "Die Frau setzte sich auf die Stufe und schwieg.",
        "Die Kinder standen im Kreis und sahen zu.",
        "Am Abend erzählte sie es ihrer Nachbarin.",
        "Die Nachbarin sagte: Nun hast du dein Auskommen.",
        "Die Obstfrau sagte: Ich behalte den Platz trotzdem.",
        "Sie kam am nächsten Morgen wieder mit dem Korb.",
        "Sie gab nun manchem Kind, ohne etwas anzuschreiben.",
        "So kam der alte Handel wieder in Gang.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────── Hebel 6 von 8 ──
const DER_GEDULDIGE_MANN: Serie = {
  slug: "de-g3-der-geduldige-mann",
  titel: "Der geduldige Mann",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "Ein Mann kam am Nachmittag müde nach Hause.",
        "Er hatte Hunger und dachte an ein Butterbrot.",
        "Am liebsten mit Schnittlauch, oder etwas vom Rauchfleisch.",
        "In der Küche stand ein Kästlein, und es war zu.",
        "Den Schlüssel dazu hatte seine Frau in der Tasche.",
        "Die Frau war bei einer Freundin auf Besuch.",
        "Im Haus war sie der Meister, in der Küche ganz.",
        "Der Mann setzte sich hin und wartete eine Weile.",
        "Er sah aus dem Fenster und trommelte auf den Tisch.",
        "Dann rief er die Magd und schickte sie hinüber.",
        "Sie sollte sagen: Der Herr wartet auf den Schlüssel.",
        "Die Magd ging und kam nach einer Weile zurück.",
      ],
    },
    {
      lines: [
        "Sie sagte: Die Frau kommt gleich, er soll warten.",
        "Der Mann wartete und sah wieder aus dem Fenster.",
        "Nach einer Weile schickte er den Knecht hinüber.",
        "Der Knecht kam zurück mit demselben Bescheid.",
        "Die Frau kommt gleich, er soll ein wenig warten.",
        "Der Mann stand auf und ging durch die Stube.",
        "Der Hunger wuchs, und die Geduld wurde knapper.",
        "Er schickte die Magd ein zweites Mal hinüber.",
        "Sie kam zurück und sagte wieder dasselbe.",
        "Da blieb der Mann in der Küche stehen.",
        "Er sah das Kästlein an und prüfte es mit den Augen.",
        "Es hatte vier Beine und zwei Griffe an der Seite.",
      ],
    },
    {
      lines: [
        "Er rief den Knecht und sagte: Fass mit an.",
        "Die beiden hoben das Kästlein von der Bank.",
        "Es war schwer, aber zu zweit ging es gut.",
        "Sie trugen es aus dem Haus und über den Hof.",
        "Die Leute auf der Gasse blieben stehen und sahen zu.",
        "Ein Nachbar fragte: Wohin denn mit dem Kasten?",
        "Der Mann sagte: Zu meiner Frau, sie hat den Schlüssel.",
        "Sie trugen es bis vor das Haus der Freundin.",
        "Dort setzten sie es ab und klopften an.",
        "Die Freundin machte auf und rief nach hinten.",
        "Die Frau kam heraus und sah das Kästlein stehen.",
        "Sie sah ihren Mann an und fand kein Wort.",
      ],
    },
    {
      lines: [
        "Der Mann sagte ruhig: Sei so gut und sperr mir auf.",
        "Ich hätte gern etwas zum Abendessen, sonst halte ich es nicht aus.",
        "Die Frau sah das Kästlein an und dann den Mann.",
        "Dann fing sie an zu lachen, und alle lachten mit.",
        "Sie nahm den Schlüssel und sperrte auf.",
        "Sie schnitt ihm ein Stück Brot herunter.",
        "Dazu legte sie etwas vom Rauchfleisch auf den Teller.",
        "Der Mann nahm im Stehen den ersten Bissen.",
        "Dann trugen die beiden Männer das Kästlein zurück.",
        "Die Frau ging neben ihnen her und lachte noch immer.",
        "Von dem Tag an lag der Schlüssel offen in der Küche.",
        "Und der Mann musste nie wieder so weit tragen.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────── Hebel 7 von 8 ──
const DIE_ANTWORT_DES_SCHREIBERS: Serie = {
  slug: "de-g3-die-antwort-des-schreibers",
  titel: "Die Antwort des Schreibers",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "arbeit",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "Moses Mendelssohn war Schreiber bei einem Kaufmann.",
        "Er war jüdischer Religion und lebte in Berlin.",
        "Sein Herr war reich, aber kein kluger Kopf.",
        "Mendelssohn führte ihm die Bücher und die Rechnungen.",
        "Er arbeitete oft lange über einer schweren Zahl.",
        "Dabei war er ein frommer und ein weiser Mann.",
        "Gelehrte Leute kamen zu ihm und hörten ihm zu.",
        "Sie achteten ihn, und das war auch recht so.",
        "Man soll den Kopf nicht wegen des Bartes verachten.",
        "Der Bart wächst, der Kopf denkt, das ist zweierlei.",
        "Mendelssohn war zufrieden mit dem, was er hatte.",
        "Er sprach nie schlecht über seinen Herrn.",
      ],
    },
    {
      lines: [
        "Eines Tages kam ein Freund zu ihm in die Kammer.",
        "Mendelssohn stand über einer schweren Rechnung.",
        "Die Arbeit ging ihm an diesem Tag schwer von der Hand.",
        "Der Freund sah ihm eine Weile über die Schulter.",
        "Dann sagte er: Es ist doch schade um dich.",
        "Du dienst einem Mann um das tägliche Brot.",
        "Er kann dir das Wasser nicht reichen, das sieht jeder.",
        "Du bist am kleinen Finger klüger als er am ganzen Leib.",
        "Ein anderer hätte die Feder hinter den Ofen geworfen.",
        "Er wäre zornig hinausgegangen und hätte gekündigt.",
        "Mendelssohn aber rührte das Tintenfass nicht an.",
        "Er steckte die Feder hinter das Ohr und sah auf.",
      ],
    },
    {
      lines: [
        "Er sagte ruhig: Es ist gut, wie es gerade ist.",
        "Die Vorsehung hat es klug eingerichtet, denke ich.",
        "So kann mein Herr von meiner Arbeit Nutzen haben.",
        "Und ich habe davon mein Auskommen und meine Ruhe.",
        "Wäre ich der Herr und er der Schreiber im Haus,",
        "dann könnte ich ihn nicht brauchen, keinen Tag.",
        "Der Freund schwieg und wusste nichts zu sagen.",
        "Er hatte an den Rang gedacht und nicht an die Sache.",
        "Mendelssohn nahm die Feder wieder in die Hand.",
        "Er rechnete weiter, als wäre nichts gewesen.",
        "Der Freund blieb noch eine Weile und ging dann.",
        "Auf dem Heimweg dachte er über die Antwort nach.",
      ],
    },
    {
      lines: [
        "Am Abend erzählte der Freund die Sache weiter.",
        "Andere hörten sie und gaben sie ebenfalls weiter.",
        "So kam sie bis zu den Gelehrten der Stadt.",
        "Einer sagte: Das ist mehr wert als ein ganzes Buch.",
        "Ein anderer sagte: Er hat den Neid gar nicht nötig.",
        "Wer seinen Platz kennt, steht darauf ganz ruhig.",
        "Mendelssohn hörte davon und sagte wenig dazu.",
        "Er meinte nur: Man hat mich richtig verstanden.",
        "Der Kaufmann erfuhr die Sache erst viel später.",
        "Er wurde nicht klüger davon, aber freundlicher.",
        "Er erhöhte den Lohn und fragte öfter um Rat.",
        "So hatten beide etwas von dem einen Gespräch.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────── Hebel 8 von 8 ──
const DIE_DREI_DIEBE: Serie = {
  slug: "de-g3-die-drei-diebe",
  titel: "Die drei Diebe",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "abenteuer",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "Der Leser mag nicht alles für wahr halten.",
        "Es waren drei Diebe im Land, und alle kannten sie.",
        "Der eine nannte sich Zundel-Heiner und war laut.",
        "Der zweite war sein Bruder, der Zundel-Frieder.",
        "Der dritte war der rote Dieter aus dem Tal.",
        "Die drei trafen sich am Abend hinter der Hecke.",
        "Sie hatten Hunger und wenig Geld in der Tasche.",
        "Einer sagte: Beim Bauern hängt ein Schwein im Rauch.",
        "Ein anderer sagte: Dann holen wir es uns heute.",
        "Der dritte sagte: Und wer trägt es nach Hause?",
        "Darüber wurde es still, und alle dachten nach.",
        "Am Ende gingen sie zusammen über den Acker.",
      ],
    },
    {
      lines: [
        "Der rote Dieter stieg durch das Fenster hinein.",
        "Er nahm das Schwein vom Haken und gab es hinaus.",
        "Die beiden Brüder trugen es in den Wald.",
        "Dort legten sie es hin und beratschlagten.",
        "Der Heiner sagte: Wir teilen morgen bei Tag.",
        "Der Frieder sagte: Heute Nacht wacht einer dabei.",
        "Der Dieter sagte: Gut, dann wache ich zuerst.",
        "Die Brüder legten sich hin und taten, als schliefen sie.",
        "In Wahrheit hielten beide die Augen halb offen.",
        "Sie hatten vor, den Dieter zu betrügen.",
        "Der Dieter merkte es und tat, als merke er nichts.",
        "Er hielt die Wache und sah in das Feuer.",
      ],
    },
    {
      lines: [
        "Gegen Mitternacht standen die Brüder leise auf.",
        "Sie nahmen das Schwein und trugen es fort.",
        "Der Dieter sah ihnen nach und blieb ruhig.",
        "Er wartete, bis die beiden weit genug waren.",
        "Dann ging er auf einem kürzeren Weg voraus.",
        "Er kannte den Wald besser als die beiden.",
        "Er legte sich hinter einen Strauch und wartete.",
        "Als die Brüder kamen, war das Schwein schwer.",
        "Sie setzten es ab und ruhten sich ein wenig aus.",
        "In diesem Augenblick nahm der Dieter es weg.",
        "Er trug es fort, und die Brüder merkten nichts.",
        "Als sie es merkten, war die Nacht halb vorbei.",
      ],
    },
    {
      lines: [
        "Die Brüder suchten und schimpften und fanden nichts.",
        "Der Dieter hatte das Fleisch längst im Keller.",
        "Am Morgen kam der Bauer und zählte im Rauch.",
        "Ihm fehlte ein Schwein, und er ging zum Amt.",
        "Man suchte drei Tage und fand die Spuren.",
        "Die Spuren gingen im Kreis und dann zum Keller.",
        "So fand man das Fleisch und kurz darauf die drei.",
        "Der Dieter sagte: Ich habe es nur bewacht.",
        "Die Brüder sagten: Er hat es uns weggenommen.",
        "Der Richter hörte zu und schrieb alles auf.",
        "Am Ende bekamen alle drei dasselbe Urteil.",
        "Der Bauer bekam sein Fleisch, und das war das Beste.",
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────── Kleist 1 von 3 ──
const DAS_BETTELWEIB_VON_LOCARNO: Serie = {
  slug: "de-g3-das-bettelweib-von-locarno",
  titel: "Das Bettelweib von Locarno",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "mystery",
  herkunft: KLEIST,
  etappen: [
    {
      lines: [
        "Bei Locarno stand am Berg ein altes Schloss.",
        "Es gehörte einem Marchese, der oft auf die Jagd ging.",
        "Eines Tages kam eine alte Frau an das Tor.",
        "Sie war krank und bat um ein Dach für die Nacht.",
        "Die Frau des Marchese hatte Mitleid mit ihr.",
        "Sie gab ihr in einer Kammer ein Lager aus Stroh.",
        "Die alte Frau legte sich hin und war still.",
        "Am Abend kam der Marchese von der Jagd zurück.",
        "Er ging in die Kammer, um sein Gewehr abzustellen.",
        "Er sah die Frau am Boden liegen und wurde zornig.",
        "Er rief ihr zu: Steh auf und geh hinter den Ofen.",
        "Die Frau stand mühsam auf und ging hinüber.",
      ],
    },
    {
      lines: [
        "Auf dem Weg glitt sie aus und stürzte hin.",
        "Sie schlug mit dem Kopf auf und blieb liegen.",
        "Man trug sie hinter den Ofen, wie befohlen war.",
        "Sie richtete sich noch einmal auf und sank zurück.",
        "In derselben Nacht ist sie dort gestorben.",
        "Man trug sie fort und begrub sie am Berg.",
        "Der Marchese sprach nicht mehr über den Abend.",
        "Es gingen Jahre hin, und das Haus wurde stiller.",
        "Der Krieg kam ins Land, und das Geld wurde knapp.",
        "Der Marchese wollte das Schloss verkaufen.",
        "Er richtete die Kammer für Gäste her.",
        "Ein Ritter kam und wollte das Haus ansehen.",
      ],
    },
    {
      lines: [
        "Der Ritter bekam die Kammer für die Nacht.",
        "Um Mitternacht kam er blass und verstört herunter.",
        "Er sagte: In der Kammer geht jemand umher.",
        "Es klang, als stehe jemand vom Stroh auf.",
        "Dann ging es durch den Raum bis hin zum Ofen.",
        "Dort legte es sich hin, und alles war still.",
        "Der Ritter reiste am Morgen ab und kaufte nichts.",
        "Der Marchese wollte es selbst nicht glauben.",
        "Er ging in der nächsten Nacht mit einem Licht hinauf.",
        "Er hörte dasselbe und sah dabei niemanden.",
        "Am dritten Abend nahm er seine Frau mit.",
        "Auch sie hörte die Schritte und wurde bleich.",
      ],
    },
    {
      lines: [
        "Sie nahmen in der vierten Nacht den Hund mit.",
        "Der Hund legte sich zuerst ruhig neben das Bett.",
        "Um Mitternacht stand er auf und stellte die Ohren.",
        "Er ging rückwärts bis in die hinterste Ecke.",
        "Dort blieb er stehen und knurrte in den leeren Raum.",
        "Die Frau des Marchese hielt es nicht länger aus.",
        "Sie fuhr noch in derselben Nacht in die Stadt.",
        "Der Marchese blieb allein im alten Haus zurück.",
        "Was in dieser Nacht geschah, hat niemand gesehen.",
        "Am Morgen brannte das Schloss von innen heraus.",
        "Man fand später seine Knochen in der Ecke.",
        "Es war die Ecke, in die er die Frau geschickt hatte.",
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────── Kleist 2 von 3 ──
const DER_REITER_IM_DORF_BEI_JENA: Serie = {
  slug: "de-g3-der-reiter-im-dorf-bei-jena",
  titel: "Der Reiter im Dorf bei Jena",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "mut",
  herkunft: KLEIST,
  etappen: [
    {
      lines: [
        "In einem Dorf bei Jena erzählte ein Wirt eine Geschichte.",
        "Es war nach der Schlacht, und alles war in Bewegung.",
        "Ein einzelner Reiter kam langsam die Gasse herauf.",
        "Er hielt vor dem Wirtshaus und stieg ab.",
        "Er band das Pferd an und trat in die Stube.",
        "Er sagte: Wirt, einen Branntwein, aber rasch.",
        "Der Wirt schenkte ein und sah aus dem Fenster.",
        "Vor dem Haus stand der Staub schon in der Luft.",
        "Der Wirt sagte: Der Feind ist im Anmarsch.",
        "Der Reiter sagte: Das kann wohl sein, noch einen.",
        "Er trank aus und stellte das Glas ruhig hin.",
        "Er sah sich in der Stube um wie ein Gast am Sonntag.",
      ],
    },
    {
      lines: [
        "Der Wirt sagte: Herr, es wird ernst, reiten Sie.",
        "Der Reiter sagte: Ich habe noch nicht bezahlt.",
        "Er zog den Beutel und zählte das Geld ab.",
        "Vor dem Dorf fielen die ersten Schüsse.",
        "Die Fenster klirrten, und der Wirt duckte sich.",
        "Der Reiter sagte: Habt Ihr Feuer für die Pfeife?",
        "Der Wirt brachte ein Licht mit zitternder Hand.",
        "Der Reiter zündete die Pfeife an und zog daran.",
        "Er sagte: Der Tabak ist gut, das muss man lassen.",
        "Dann setzte er den Hut auf und ging hinaus.",
        "Er stieg auf und nahm die Zügel kurz.",
        "Er ritt dem Dorfrand entgegen, dem Lärm nach.",
      ],
    },
    {
      lines: [
        "Am Ausgang des Dorfes kamen drei Reiter heran.",
        "Es waren drei Jäger aus dem Heer des Feindes.",
        "Sie sahen ihn allein und ritten auf ihn zu.",
        "Der Wirt sah es vom Fenster aus und rief laut.",
        "Er dachte: Nun ist es um den Mann geschehen.",
        "Der Reiter zog den Säbel und wartete ab.",
        "Der erste kam heran, und der Reiter parierte.",
        "Im selben Schlag warf er ihn aus dem Sattel.",
        "Der zweite kam von der Seite und fiel ebenso.",
        "Der dritte drehte ab und wurde eingeholt.",
        "Auch er lag kurz darauf neben seinem Pferd.",
        "Der Reiter hielt an und sah sich in Ruhe um.",
      ],
    },
    {
      lines: [
        "Er nahm die drei Pferde am Zügel zusammen.",
        "Dann ritt er damit im Schritt aus dem Dorf.",
        "Er sah sich nicht ein einziges Mal um.",
        "Der Wirt stand in der Tür und fand kein Wort.",
        "Später sagte er: Ich habe viel gesehen im Krieg.",
        "Aber so einen Menschen habe ich nie gesehen.",
        "Er war mutig und dabei völlig ohne Eile.",
        "Er hat bezahlt, als wäre nichts im Gange.",
        "Er hat sich Feuer geben lassen wie am Sonntag.",
        "Und dann hat er drei Mann vom Pferd geholt.",
        "Die Leute im Dorf erzählten es lange weiter.",
        "Den Namen des Reiters hat niemand erfahren.",
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────── Kleist 3 von 3 ──
const DIE_ANMUT_UND_DER_SPIEGEL: Serie = {
  slug: "de-g3-die-anmut-und-der-spiegel",
  titel: "Die Anmut und der Spiegel",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "kultur",
  herkunft: KLEIST,
  etappen: [
    {
      lines: [
        "Im Winter traf ich in einem Garten einen Tänzer.",
        "Er war der erste Tänzer an der Oper der Stadt.",
        "Ich hatte ihn schon mehrmals im Theater gesehen.",
        "Nun sah ich ihn vor einer Bude mit Puppen stehen.",
        "Es war ein kleines Theater für einfache Leute.",
        "Ich fragte ihn, was ihn denn daran halte.",
        "Er sagte: Von diesen Puppen kann man viel lernen.",
        "Ich lachte und hielt es für einen Scherz.",
        "Er sagte: Es ist mein voller Ernst, hören Sie.",
        "Eine Puppe kann anmutiger sein als ein Mensch.",
        "Ich fragte: Wie soll das denn möglich sein?",
        "Er sagte: Weil eine Puppe sich nie selbst betrachtet.",
      ],
    },
    {
      lines: [
        "Er sagte: Der Mann an den Fäden führt nur einen Punkt.",
        "Alles andere folgt von selbst und ohne Absicht.",
        "Die Glieder hängen und schwingen, wie sie müssen.",
        "Kein Glied will schöner sein als das andere.",
        "Deshalb ist an keiner Stelle etwas zu viel.",
        "Beim Menschen aber tritt das Bewusstsein dazu.",
        "Er denkt an seinen Arm, und der Arm wird steif.",
        "Er denkt an den Blick, und der Blick wird leer.",
        "Die Anmut geht fort, sobald man sie sucht.",
        "Ich hörte zu und wollte ihm noch nicht folgen.",
        "Er sagte: Ich erzähle Ihnen drei kleine Sachen.",
        "Danach verstehen Sie es besser als jetzt.",
      ],
    },
    {
      lines: [
        "Ein junger Mann von sechzehn Jahren war sehr anmutig.",
        "Er trocknete sich nach dem Bad das Bein ab.",
        "Dabei sah er sich in einem hohen Spiegel.",
        "Er sagte: So steht auch der Knabe aus Marmor.",
        "Ich sagte: Das habe ich eben auch gesehen.",
        "Nun wollte er es noch einmal vorführen.",
        "Er hob das Bein und sah dabei in den Spiegel.",
        "Es gelang ihm nicht, und er wurde unsicher.",
        "Er wiederholte es und wurde immer steifer.",
        "Von dem Tag an war die Anmut fort, für immer.",
        "Er wurde ein tüchtiger Mann, aber nicht mehr das.",
        "So teuer ist ein einziger Blick in den Spiegel.",
      ],
    },
    {
      lines: [
        "Die zweite Sache war ein Fechtboden im Norden.",
        "Dort hielt man einen Bären an einem Pfahl.",
        "Ein guter Fechter trat gegen den Bären an.",
        "Er führte den ersten Hieb auf die Brust des Tieres.",
        "Der Bär hob die Tatze und wehrte ihn ab.",
        "Der Fechter machte eine Finte und täuschte an.",
        "Der Bär rührte sich nicht und sah ihn nur an.",
        "Keine Finte brachte ihn ein einziges Mal aus der Ruhe.",
        "Der Fechter wurde unruhig und traf gar nichts mehr.",
        "Der Tänzer sagte: Das Tier denkt nicht über sich nach.",
        "Darum trifft es immer, und wir treffen daneben.",
        "Er sagte: Die Anmut kehrt erst am Ende zurück.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────── Kafka 1 von 3 ──
const VOR_DEM_GESETZ: Serie = {
  slug: "de-g3-vor-dem-gesetz",
  titel: "Vor dem Gesetz",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "kultur",
  herkunft: KAFKA,
  etappen: [
    {
      lines: [
        "Vor dem Gesetz steht ein Türhüter und wartet.",
        "Zu ihm kommt ein Mann vom Land und bittet um Eintritt.",
        "Der Türhüter sagt: Jetzt kann ich dich nicht einlassen.",
        "Der Mann fragt: Also später einmal, vielleicht?",
        "Der Türhüter sagt: Es ist möglich, jetzt aber nicht.",
        "Das Tor zum Gesetz steht offen wie immer.",
        "Der Mann beugt sich vor und sieht hindurch.",
        "Der Türhüter lacht und tritt zur Seite.",
        "Er sagt: Geh nur hinein, wenn es dich lockt.",
        "Aber wisse: Ich bin nur der unterste von vielen.",
        "Von Saal zu Saal steht einer, und jeder ist stärker.",
        "Den dritten kann ich selbst nicht mehr ansehen.",
      ],
    },
    {
      lines: [
        "Der Mann hatte mit solchen Reden nicht gerechnet.",
        "Er dachte: Das Gesetz soll allen offen stehen.",
        "Nun sieht er den Türhüter genauer an.",
        "Er sieht den Pelzmantel und die dünne Nase.",
        "Er nimmt sich vor, lieber zu warten als zu wagen.",
        "Der Türhüter gibt ihm einen Schemel zum Sitzen.",
        "Er setzt ihn seitlich neben das offene Tor.",
        "Dort bleibt der Mann sitzen, Tage und Jahre.",
        "Er versucht es oft und bittet immer wieder.",
        "Der Türhüter hört ihn an und fragt ihn vieles.",
        "Am Ende sagt er stets: Ich kann dich nicht einlassen.",
        "Der Mann bleibt und rückt den Schemel näher.",
      ],
    },
    {
      lines: [
        "Der Mann hat manches mitgebracht für die Reise.",
        "Er gibt alles hin, um den Türhüter zu bewegen.",
        "Der Türhüter nimmt es und sagt jedes Mal dazu:",
        "Ich nehme es nur, damit du nichts versäumt hast.",
        "Der Mann sieht viele Jahre lang nur diesen einen Mann.",
        "Die anderen Türhüter kennt er nur vom Hören.",
        "Er vergisst die Welt und wird alt am Tor.",
        "Er wird ein Kind und redet mit den Flöhen im Pelz.",
        "Seine Augen werden schwach, und er sieht wenig.",
        "Doch nun bemerkt er einen Schein aus dem Tor.",
        "Der Schein kommt aus dem Inneren des Gesetzes.",
        "Er bricht durch das Dunkel und geht nicht aus.",
      ],
    },
    {
      lines: [
        "Der Mann hat nicht mehr lange, und er ahnt es.",
        "In seinem Kopf sammeln sich alle Fragen zu einer.",
        "Er winkt den Türhüter heran, denn er kann nicht rufen.",
        "Der Türhüter beugt sich tief zu ihm hinunter.",
        "Er sagt: Du bist unersättlich, was willst du noch?",
        "Der Mann fragt: Alle streben doch nach dem Gesetz.",
        "Wie kommt es, dass in all den Jahren niemand kam?",
        "Der Türhüter sieht, dass der Mann zu Ende geht.",
        "Er ruft ihm ins Ohr, damit er es noch hört:",
        "Hier konnte niemand sonst Einlass bekommen.",
        "Dieser Eingang war nur für dich bestimmt.",
        "Ich gehe jetzt und mache ihn zu.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────── Kafka 2 von 3 ──
const DER_PLOETZLICHE_SPAZIERGANG: Serie = {
  slug: "de-g3-der-ploetzliche-spaziergang",
  titel: "Der plötzliche Spaziergang",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: KAFKA,
  etappen: [
    {
      lines: [
        "Am Abend scheint alles entschieden zu sein.",
        "Man bleibt zu Hause, so hat man es sich gesagt.",
        "Man hat den Hausrock an und sitzt am Tisch.",
        "Das Licht brennt, und das Essen ist vorbei.",
        "Man hat eine Arbeit vor sich oder ein Spiel.",
        "Danach geht man schlafen, so ist es gewohnt.",
        "Vor dem Fenster ist das Wetter unfreundlich.",
        "Es macht das Zuhausebleiben selbstverständlich.",
        "Man hat lange still am Tisch gesessen.",
        "Ein Aufbruch würde alle im Haus verwundern.",
        "Das Treppenhaus ist dunkel, das Haustor ist zu.",
        "Es gibt keinen Grund, jetzt noch hinauszugehen.",
      ],
    },
    {
      lines: [
        "Und dennoch steht man auf, ohne einen Grund.",
        "Ein Unbehagen kommt und hebt einen vom Stuhl.",
        "Man wechselt den Rock und ist plötzlich fertig.",
        "Man erklärt, man müsse nun leider fortgehen.",
        "Der Abschied ist kurz, und dann tut man es auch.",
        "Die Tür fällt zu, mehr oder weniger laut.",
        "Danach glaubt man, Ärger im Haus gelassen zu haben.",
        "Man steht auf der Gasse und ist erstaunt.",
        "Die Glieder antworten auf die neue Freiheit.",
        "Sie bewegen sich leichter als sonst am Abend.",
        "Man merkt: In diesem einen Entschluss steckt viel.",
        "Alle Kraft zu entscheiden hat sich hier gesammelt.",
      ],
    },
    {
      lines: [
        "Man erkennt mit ungewohnter Deutlichkeit:",
        "Man hat mehr Kraft, als das Bedürfnis verlangt.",
        "Man kann eine schnelle Veränderung bewirken.",
        "Und man kann sie auch aushalten, ohne Schaden.",
        "So läuft man die langen Gassen hinunter.",
        "Die Häuser stehen dunkel und ohne Anteil.",
        "Für diesen Abend ist man aus der Familie getreten.",
        "Sie rückt in die Ferne und wird undeutlich.",
        "Man selbst wird fest und dunkel gegen die Luft.",
        "Man schlägt sich im Gehen an die Schenkel.",
        "Man erhebt sich zu der eigenen wahren Gestalt.",
        "Alles daran fühlt sich richtig an, ohne Beweis.",
      ],
    },
    {
      lines: [
        "Noch stärker wird das Ganze auf eine Art:",
        "Man sucht zu dieser späten Stunde einen Freund auf.",
        "Man will nachsehen, wie es ihm gerade geht.",
        "Man klingelt und hört Schritte hinter der Tür.",
        "Der Freund macht auf und ist erst verwundert.",
        "Er fragt: Um diese Zeit, ist etwas geschehen?",
        "Man sagt: Nichts, ich war ohnehin unterwegs.",
        "Der Freund lässt einen ein und stellt Wasser auf.",
        "Man sitzt in einer fremden Stube und schweigt.",
        "Vor dem Fenster geht der Wind über das Dach.",
        "Es ist derselbe Abend, den man verlassen hat.",
        "Und doch ist es ein ganz anderer Abend geworden.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────── Kafka 3 von 3 ──
const DER_KUEBELREITER: Serie = {
  slug: "de-g3-der-kuebelreiter",
  titel: "Der Kübelreiter",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "winter",
  herkunft: KAFKA,
  etappen: [
    {
      lines: [
        "Die Kohle ist alle, und der Kübel ist leer.",
        "Die Schaufel hat keinen Sinn mehr in der Hand.",
        "Der Ofen atmet Kälte in die kleine Stube.",
        "Das Zimmer ist voll Frost bis in die Ecken.",
        "Vor dem Fenster steht der Himmel wie ein Schild.",
        "Er ist hart und hell gegen den, der Hilfe sucht.",
        "Ich muss Kohle haben, sonst halte ich es nicht aus.",
        "Ich darf nicht einfach hingehen und bitten.",
        "Der Händler kennt mich und kennt meine Lage.",
        "Ich muss ihm zeigen, dass ich am Ende bin.",
        "Also nehme ich den Kübel und gehe hinaus.",
        "Der Kübel ist so leicht, dass er mich trägt.",
      ],
    },
    {
      lines: [
        "Ich reite auf dem Kübel durch die Gassen.",
        "Er hebt sich und schwebt über den Türen.",
        "Wo Menschen gehen, komme ich darüber hinweg.",
        "Vor dem Gewölbe des Händlers halte ich an.",
        "Ich schwebe in der Höhe des ersten Stockes.",
        "Ich rufe hinunter mit einer dünnen Stimme.",
        "Ich rufe: Kohlenhändler, gib mir etwas Kohle.",
        "Mein Kübel ist leer, und ich kann darauf reiten.",
        "Ich zahle es dir, sobald ich es vermag.",
        "Unten sitzt der Händler an seinem Tisch.",
        "Er hebt den Kopf und sagt: Es ruft jemand.",
        "Ich kenne die Stimme, sagt er, ein alter Kunde.",
      ],
    },
    {
      lines: [
        "Die Frau des Händlers steht auf und geht hinaus.",
        "Sie sagt: Ich sehe nach, wer da gerufen hat.",
        "Sie tritt vor die Tür und sieht in die Höhe.",
        "Ich rufe hinunter: Ich bin es, hier oben.",
        "Die Frau sagt: Ich sehe niemanden auf der Gasse.",
        "Ihr Mann ruft aus dem Gewölbe: Es ist niemand da.",
        "Ich rufe: Es ist die kleinste Bitte von allen.",
        "Eine Schaufel voll, und ich fahre wieder heim.",
        "Die Frau bindet ihre Schürze auf und hält sie.",
        "Sie schwenkt die Schürze langsam durch die Luft.",
        "Der Wind von der Schürze hebt den Kübel an.",
        "Ich steige höher, ohne dass ich es will.",
      ],
    },
    {
      lines: [
        "Ich rufe noch einmal, aber die Stimme trägt nicht.",
        "Die Frau geht zurück in das warme Gewölbe.",
        "Sie sagt zu ihrem Mann: Es war wirklich niemand.",
        "Der Kübel steigt und wird immer leichter.",
        "Die Dächer bleiben unter mir zurück.",
        "Die Gassen werden schmal und dann zu Linien.",
        "Ich sehe den Rauch aus vielen Rohren aufsteigen.",
        "Jeder dieser Fäden kommt aus einem warmen Raum.",
        "Ich habe keinen, und mein Kübel trägt mich fort.",
        "Vor mir liegen die Berge des Eises im Licht.",
        "Ich steige zu ihnen auf und werde nicht mehr gesehen.",
        "So bin ich verloren gegangen, mit Kübel und allem.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────── Stifter 1 von 2 ──
const DER_STEIN_VOR_DEM_HAUS: Serie = {
  slug: "de-g3-der-stein-vor-dem-haus",
  titel: "Der Stein vor dem Haus",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "natur",
  herkunft: STIFTER,
  etappen: [
    {
      lines: [
        "Vor dem Haus meines Vaters liegt ein alter Stein.",
        "Er hat acht Ecken und ist lang wie eine Bank.",
        "Er ist aus Granit und liegt dort seit langem.",
        "Niemand im Ort kann sagen, wer ihn hingelegt hat.",
        "Als Kind habe ich oft auf diesem Stein gesessen.",
        "Ich sah den Leuten zu, die vorbeigingen.",
        "Ich hörte die Wagen und das Vieh am Morgen.",
        "Der Stein war im Sommer warm und im Winter kalt.",
        "Er war der beste Platz, den ich damals kannte.",
        "Manchmal kam ein Mann mit einem Fass vorbei.",
        "Er verkaufte Wagenschmiere im ganzen Tal.",
        "Die Leute nannten ihn nur den alten Andreas.",
      ],
    },
    {
      lines: [
        "Andreas setzte sich neben mich auf den Stein.",
        "Er redete mit mir, wie man mit Kindern redet.",
        "Eines Tages nahm er den Pinsel aus dem Fass.",
        "Er strich mir die Schmiere über die Beine.",
        "Er lachte dabei und meinte es gar nicht böse.",
        "Ich lachte mit und fand es sehr gelungen.",
        "Dann lief ich in das Haus und in die Stube.",
        "Der Boden war am Morgen frisch gescheuert worden.",
        "Ich lief darüber, und dunkle Spuren blieben.",
        "Meine Mutter kam und sah den ganzen Boden.",
        "Sie war zornig, wie ich sie selten erlebt hatte.",
        "Sie schalt mich und hielt mich am Arm fest.",
      ],
    },
    {
      lines: [
        "Da kam der Vater meines Vaters aus der Kammer.",
        "Er sagte nichts gegen die Mutter, kein Wort.",
        "Er nahm mich bei der Hand und ging mit mir hinaus.",
        "Er holte Wasser und wusch mir die Beine ab.",
        "Er tat es langsam und ohne ein einziges Wort.",
        "Dann sagte er: Wir gehen ein Stück, du und ich.",
        "Wir gingen den Weg hinauf, aus dem Ort hinaus.",
        "Der Wald begann, und die Luft wurde kühler.",
        "Ich hielt seine Hand und war wieder ruhig.",
        "Er zeigte mir die Bäume und nannte ihre Namen.",
        "Dann blieb er bei drei alten Föhren stehen.",
        "Er sagte: Von diesen Bäumen kann ich erzählen.",
      ],
    },
    {
      lines: [
        "Er erzählte von einer Krankheit vor langer Zeit.",
        "Sie kam über das Land und nahm ganze Höfe fort.",
        "In einem Haus im Wald blieben zwei Kinder allein.",
        "Sie hatten nichts mehr und niemanden mehr.",
        "Sie gingen in den Wald und blieben dort.",
        "Sie lebten von Beeren und von Wasser.",
        "Sie bauten sich ein Dach aus Zweigen und Moos.",
        "Ein Jäger fand sie, als die Krankheit vorbei war.",
        "Er brachte sie hinunter in das nächste Dorf.",
        "Dort wuchsen sie auf, und der Hof wurde wieder bewohnt.",
        "Mein Begleiter sagte: Das war an dieser Stelle.",
        "Wir gingen heim, und ich sah den Wald anders an.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────── Stifter 2 von 2 ──
const DAS_DORF_AUF_DER_HEIDE: Serie = {
  slug: "de-g3-das-dorf-auf-der-heide",
  titel: "Das Dorf auf der Heide",
  kind: "geschichte",
  lang: "de",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "natur",
  herkunft: STIFTER,
  etappen: [
    {
      lines: [
        "Weit im Land liegt eine weite, magere Heide.",
        "Dort wächst Heidekraut und wenig anderes.",
        "Der Boden ist hart, und der Wind geht immer.",
        "Am Rand der Heide stand ein einzelnes Haus.",
        "Darin lebten arme Leute mit ihren Kindern.",
        "Der älteste Knabe war ein stiller, wacher Bub.",
        "Er hütete das Vieh und war viel allein.",
        "Er kannte jeden Hügel und jeden Strauch.",
        "Er kannte die Wolken und ihre Formen am Himmel.",
        "Wenn er lag, baute er sich ganze Länder.",
        "Er gab ihnen Namen und Wege und Städte.",
        "Am Abend kam er heim und sagte davon nichts.",
      ],
    },
    {
      lines: [
        "Seine Mutter war still und arbeitete den Tag.",
        "Sein Vater sprach wenig und half auf fremden Feldern.",
        "Die Mutter seiner Mutter lebte mit im Haus.",
        "Sie kannte die alten Bücher und las daraus vor.",
        "Der Knabe hörte ihr zu und behielt jedes Wort.",
        "Er fragte nach Ländern, die darin genannt waren.",
        "Die alte Frau sagte: Die liegen weit von hier.",
        "Der Knabe sagte: Dann gehe ich einmal dorthin.",
        "Die alte Frau lachte und glaubte es nicht.",
        "Sie sagte: Vorher lernst du das Lesen richtig.",
        "Von da an lernte er, sooft es Licht gab.",
        "Mit zehn Jahren konnte er mehr als alle im Ort.",
      ],
    },
    {
      lines: [
        "Eines Morgens nahm er ein Bündel und ging fort.",
        "Er wollte lernen und die Länder wirklich sehen.",
        "Die Eltern gaben ihm ein Brot und ihren Segen.",
        "Er ging über die Heide und sah sich einmal um.",
        "Dann war das Haus hinter dem Hügel verschwunden.",
        "Es vergingen viele Jahre ohne eine Nachricht.",
        "Auf der Heide blieb alles, wie es gewesen war.",
        "Der Wind ging, und das Kraut blühte im Sommer.",
        "Die alte Frau starb, und man begrub sie am Rand.",
        "Die Eltern wurden alt und redeten von dem Sohn.",
        "Sie sagten: Er wird wohl in einer Stadt sein.",
        "Mehr wussten sie nicht, und mehr sagten sie nicht.",
      ],
    },
    {
      lines: [
        "Dann kam ein Mann über die Heide gegangen.",
        "Er trug gute Kleider und einen ruhigen Blick.",
        "Er blieb vor dem alten Haus am Rand stehen.",
        "Die Mutter kam heraus und erkannte ihn nicht.",
        "Er sagte nur ein Wort, und da erkannte sie ihn.",
        "Der Sohn war zurück, und er blieb auch da.",
        "Er hatte gelernt und wollte es weitergeben.",
        "Er baute ein Haus aus Stein mitten auf der Heide.",
        "Andere bauten daneben, und es wurde ein Dorf.",
        "Er half den Leuten mit Rat und mit Rechnung.",
        "Er las den Kindern vor, wie man ihm vorgelesen hatte.",
        "So wurde die magere Heide ein bewohnter Ort.",
      ],
    },
  ],
};

export const SERIEN_DE_ERWACHSEN_G3: readonly Serie[] = [
  DAS_WIEDERSEHEN_IN_FALUN,
  DER_JUNGE_MANN_AUS_LONDON,
  DER_SILBERNE_LOEFFEL,
  DER_FREMDE_HERR,
  DER_KAISER_UND_DIE_OBSTFRAU,
  DER_GEDULDIGE_MANN,
  DIE_ANTWORT_DES_SCHREIBERS,
  DIE_DREI_DIEBE,
  DAS_BETTELWEIB_VON_LOCARNO,
  DER_REITER_IM_DORF_BEI_JENA,
  DIE_ANMUT_UND_DER_SPIEGEL,
  VOR_DEM_GESETZ,
  DER_PLOETZLICHE_SPAZIERGANG,
  DER_KUEBELREITER,
  DER_STEIN_VOR_DEM_HAUS,
  DAS_DORF_AUF_DER_HEIDE,
];
