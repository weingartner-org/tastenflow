/**
 * DEUTSCHE WISSENS-SERIEN FÜR KINDER - Charge W2, 29.08.2026.
 * Neun Serien, Stufe `kids`, alle auf **Sprosse 27**.
 *
 * Gezählt am 29.08.: `de/kids` hatte elf Wissens-Serien, das Ziel sind zwanzig.
 *
 * ── WARUM SPROSSE 27 UND NICHT 25 ─────────────────────────────────────────
 *
 * Bei den englischen Serien ist 25 der gute Wert (ohne `y x q`). Für Deutsch
 * ist er es nicht: auf 25 fehlen auch `ä` und `ü`, und damit **für, über,
 * müssen, zurück, natürlich, Länge, Wärme, Stück, prüfen, Gefühl**. Ein
 * Sachtext ohne diese Wörter wird gequält, und gequälte Sprache ist für ein
 * Kind schlechter als eine Sprosse später.
 *
 * Auf **27** fehlen nur `x`, `y`, `q` und das `ß`. Der Bestand lag vorher fast
 * durchweg auf 31 - der Gewinn ist also echt.
 *
 * ⚠️ **Was auf 27 wegfällt**, an diesen neun gemessen:
 * *groß, heiß, weiß, Fuß, Straße, fließen, außen, draußen, schließen, heißt,
 * beißen, gießen, Größe, süß, Maß* (alle mit `ß`) · *Text, exakt, Praxis*
 * (`x`) · *System, Typ, Symbol, Physik* (`y`) · *Quelle, Quadrat, quer*
 * (`q`).
 * Ersatz, der sich bewährt hat: *gewaltig / weit* statt groß · *sehr warm /
 * glühend* statt heiß · *hell* statt weiß · *strömen / rinnen* statt fließen ·
 * *nennt man* statt heißt · *der Weg* statt Straße · *Ursprung* statt Quelle ·
 * *Ordnung / Anlage* statt System.
 *
 * ⚠️ **`ss` ist kein Ersatz für `ß`.** *gross* und *heiss* wären schlicht
 * falsch geschrieben; die Regel »echte Umlaute« gilt auch hier. Wo ein Wort
 * ein `ß` braucht, wird es ersetzt, nicht verstümmelt. *muss, dass, Fluss,
 * Schloss* haben nach der heutigen Rechtschreibung ohnehin `ss` und sind frei.
 */
import type { Serie } from "./serie";

const EIGEN_SACH = {
  quelle: "Sensorik (Sachwissen selbst formuliert, an Fachquellen geprüft)",
  lizenz: "Eigenes Werk",
  autor: "Sensorik-Lernplattform",
} as const;

// ───────────────────────────────────────────────────────────────────────────
const DER_SCHATTEN: Serie = {
  slug: "de-w2-der-schatten",
  titel: "Der Schatten",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Ein Schatten ist kein Ding. Ein Schatten ist ein Ort.",
        "Es ist der Ort, an dem das Licht nicht angekommen ist.",
        "Licht bewegt sich in geraden Linien durch die Luft.",
        "Es biegt nicht um eine Wand herum und nicht um eine Hand.",
        "Halte eine Hand vor eine Lampe. Die Hand hält das Licht auf.",
        "Hinter der Hand bleibt ein Raum ohne Licht.",
        "Dieser Raum ist der Schatten, und er hat die Form der Hand.",
        "Er ist immer ein wenig breiter als die Hand selbst.",
        "Licht geht von einer Lampe nach allen Seiten auseinander.",
        "Die Linien, die an der Hand vorbei laufen, laufen weiter auseinander.",
        "Halte die Hand nahe an die Wand: der Schatten ist klein und scharf.",
        "Ziehe sie zur Lampe hin: der Schatten wird immer breiter.",
      ],
    },
    {
      lines: [
        "An der Hand hat sich dabei nichts verändert.",
        "Nur der Abstand hat sich verändert.",
        "Schau dir den Rand eines Schattens an der Wand genau an.",
        "Es ist keine harte Linie. Es gibt auch einen weichen Saum.",
        "Eine Lampe ist ja kein einzelner Punkt.",
        "Sie ist eine kleine Flache, und das Licht kommt von überall darauf.",
        "Ein Teil des Lichtes wird aufgehalten, ein Teil kommt vorbei.",
        "Die dunkle Mitte ist der Ort, wo alles Licht aufgehalten wird.",
        "Der weiche Saum ist der Ort, wo noch etwas Licht ankommt.",
        "Eine kleine Lampe weit weg macht einen harten, sauberen Rand.",
        "Eine breite Lampe nah dran macht einen weiten weichen Saum.",
        "Bei bedecktem Himmel ist der ganze Himmel die Lampe.",
      ],
    },
    {
      lines: [
        "Dann sind die Schatten so weich, dass wir sie kaum sehen.",
        "In der klaren Sonne hat der Schatten eines Blattes einen scharfen Rand.",
        "Die Sonne wandert am Himmel vom Morgen bis zum Abend.",
        "Also wandert auch der Schatten eines Pfostens, und er dreht sich dabei.",
        "Am Mittag steht die Sonne an diesem Tag am höchsten.",
        "In diesem Moment ist der Schatten am kürzesten.",
        "Am Morgen und am Abend steht die Sonne tief.",
        "Dann kommt das Licht schräg an, und der Schatten ist lang.",
        "Menschen haben daran über Tausende von Jahren die Stunde abgelesen.",
        "Eine Sonnenuhr ist ein Stab und ein paar Marken auf einer Platte.",
        "Der Stab muss dabei schräg stehen, und er muss nach Norden zeigen.",
        "Dann wandert der Schatten in gleichen Schritten durch die Stunden.",
      ],
    },
    {
      lines: [
        "Steck einen Stock in den Boden und mach jede Stunde eine Marke.",
        "Die Marken werden nicht gleich weit auseinander liegen.",
        "Das liegt daran, dass der Stock gerade steht und nicht schräg.",
        "Der weiteste Schatten, in dem wir je stehen, kommt vom Mond.",
        "Manchmal schiebt sich der Mond zwischen die Erde und die Sonne.",
        "Sein Schatten fällt dann auf den Boden und wandert darüber hinweg.",
        "In der dunklen Mitte dieses Schattens ist die Sonne verdeckt.",
        "Dieser Streifen ist schmal, und er wandert schnell über das Land.",
        "Rundherum liegt der weiche Saum, wo ein Teil der Sonne noch zu sehen ist.",
        "Auch die Erde wirft einen Schatten hinaus in den Raum.",
        "Wenn der Mond in ihn hinein wandert, wird er dunkel und rot.",
        "Ein Schatten bleibt dabei immer der Ort, wo kein Licht ankam.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DER_IGEL_IM_WINTER: Serie = {
  slug: "de-w2-der-igel-im-winter",
  titel: "Der Igel im Winter",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Ein Igel frisst Käfer, Larven, Schnecken und Regenwürmer.",
        "Im Winter gibt es davon fast nichts zu finden.",
        "Der Boden ist hart, und die Insekten sind verschwunden.",
        "Ein Tier, das nichts findet, hat nur wenige Auswege.",
        "Vögel ziehen weg. Ein Igel kann das nicht.",
        "Er ist langsam und er hat kurze Beine.",
        "Also macht er etwas anderes: er hält Winterschlaf.",
        "Das ist mehr als nur ein langer Schlaf.",
        "Im Winterschlaf wird der ganze Körper heruntergefahren.",
        "Die Temperatur im Inneren sinkt weit ab.",
        "Sie liegt dann nur noch wenige Grad über der Luft im Nest.",
        "Das Herz schlägt nicht mehr hundertmal in der Minute.",
      ],
    },
    {
      lines: [
        "Es schlägt nur noch wenige Male, und es macht lange Pausen.",
        "Auch das Atmen wird selten und flach.",
        "Der ganze Verbrauch sinkt auf einen kleinen Rest.",
        "Genau darum geht es: der Igel spart.",
        "Er lebt den ganzen Winter von dem, was er im Herbst gefressen hat.",
        "Deshalb ist der Herbst für einen Igel die wichtigste Zeit.",
        "Er muss sich eine Schicht Fett anfressen, sonst reicht es nicht.",
        "Ein Igel, der im Herbst zu leicht ist, überlebt den Winter nicht.",
        "Darum sammelt er im Oktober und im November alles, was er findet.",
        "Danach sucht er sich einen Ort, an dem er sicher liegen kann.",
        "Ein Haufen aus Laub und Ästen ist genau richtig.",
        "Er baut sich darin ein Nest aus Blättern und Gras.",
      ],
    },
    {
      lines: [
        "Das Nest hält die Kälte ab, so wie eine dicke Decke.",
        "Zwischen den Blättern steht Luft, und Luft leitet Kälte schlecht.",
        "Dann rollt er sich zu einer Kugel zusammen und wird ganz still.",
        "So liegt er von November bis in den März hinein.",
        "Er wacht in dieser Zeit einige Male auf, ganz von selbst.",
        "Das Aufwachen kostet ihn sehr viel von seinem Vorrat.",
        "Der Körper muss dabei erst wieder auf Temperatur kommen.",
        "Ein einziges Aufwachen kostet so viel wie viele Tage Schlaf.",
        "Deshalb ist es schlecht, einen Igel im Winter zu stören.",
        "Wer einen Laubhaufen umschichtet, kann ein Nest zerstören.",
        "Ein Igel, den man im Winter aufweckt, verliert einen Teil des Vorrats.",
        "Am besten lässt man Laubhaufen im Garten einfach liegen.",
      ],
    },
    {
      lines: [
        "Die Stacheln sind das andere, was jeder an einem Igel kennt.",
        "Ein Igel trägt mehrere tausend davon auf dem Rücken.",
        "Ein Stachel ist ein umgebautes Haar, hohl und hart.",
        "Unter der Haut liegt ein Muskel, der alle Stacheln aufrichten kann.",
        "Bei Gefahr rollt sich das Tier zusammen wie eine Kugel.",
        "Kopf, Beine und Bauch liegen dann geschützt in der Mitte.",
        "Zu sehen ist dann nur noch ein Ball voller Spitzen.",
        "Gegen einen Fuchs ist das eine gute Antwort.",
        "Gegen ein Auto ist es leider gar keine Antwort.",
        "Der Igel bleibt liegen, statt wegzulaufen, und das wird ihm zum Verhängnis.",
        "Wer im Frühjahr einen wachen Igel sieht, hat einen Überlebenden vor sich.",
        "Der Winter hat ihn ein Drittel seines Gewichtes gekostet.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DIE_KARTOFFEL: Serie = {
  slug: "de-w2-die-kartoffel",
  titel: "Die Kartoffel",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Eine Kartoffel wächst unter der Erde, und das ist ungewöhnlich.",
        "Die meisten Pflanzen tragen ihre Vorräte über dem Boden.",
        "Viele Menschen halten die Kartoffel darum für eine Wurzel.",
        "Das ist sie aber nicht. Sie ist ein dicker Trieb.",
        "Ein Trieb, der unter der Erde wächst und sich vollsaugt.",
        "Man erkennt das an den Augen auf ihrer Schale.",
        "Jedes Auge ist eine Knospe, aus der ein Trieb kommen kann.",
        "Eine Wurzel hat keine Knospen. Ein Trieb hat welche.",
        "Die Pflanze legt darin an, was sie aus dem Licht gebaut hat.",
        "Über dem Boden stehen die Blätter und arbeiten den ganzen Sommer.",
        "Sie bauen aus Luft, Wasser und Licht einen Zucker auf.",
        "Der Zucker wandert nach unten und wird dort zu Stärke.",
      ],
    },
    {
      lines: [
        "Stärke ist ein Vorrat, den die Pflanze später wieder aufbrauchen kann.",
        "Sie legt ihn an, damit im nächsten Jahr etwas Neues wachsen kann.",
        "Genau diesen Vorrat holen wir aus dem Boden.",
        "Die Kartoffel kommt ursprünglich aus den Anden in Amerika.",
        "Dort wird sie seit sehr langer Zeit angebaut.",
        "Nach Europa kam sie erst vor einigen hundert Jahren.",
        "Am Anfang wollte hier niemand sie essen.",
        "Man kannte die Pflanze nicht und traute ihr nicht.",
        "Manche pflanzten sie nur als Zierde in den Garten.",
        "Erst als es Hunger gab, wurde sie ein Nahrungsmittel.",
        "Sie hat einen Vorteil, den Getreide nicht hat.",
        "Sie liefert auf demselben Boden mehr Nahrung als Korn.",
      ],
    },
    {
      lines: [
        "Gepflanzt wird sie nicht mit einem Samen, sondern mit sich selbst.",
        "Man legt eine ganze Kartoffel in den Boden.",
        "Aus ihren Augen wachsen Triebe nach oben ans Licht.",
        "Die alte Kartoffel gibt dabei ihren Vorrat an die Triebe ab.",
        "Am Ende ist sie leer und schrumpelig, und die Pflanze steht.",
        "Unter der Erde bilden sich dann viele neue Knollen.",
        "Aus einer gelegten Kartoffel werden oft mehr als zehn.",
        "Im Sommer blüht die Pflanze hell oder violett.",
        "Nach der Blüte wachsen kleine grüne Kugeln daran.",
        "Diese Kugeln sehen aus wie Tomaten, und sie sind giftig.",
        "Auch die Blätter und die Triebe sind giftig.",
        "Nur die Knolle unter der Erde ist ein Nahrungsmittel.",
      ],
    },
    {
      lines: [
        "Eine Kartoffel muss dunkel liegen, sonst wird sie grün.",
        "Grün wird sie da, wo Licht auf die Schale gefallen ist.",
        "Die grüne Farbe selbst ist nicht das Schlimme daran.",
        "Zusammen mit ihr bildet die Knolle einen giftigen Stoff.",
        "Darum werden grüne Stellen weggeschnitten.",
        "Auch lange Triebe an einer alten Kartoffel schneidet man weg.",
        "Am besten liegt sie kühl, dunkel und luftig.",
        "Im Kühlschrank wird ihre Stärke allerdings zu Zucker.",
        "Dann schmeckt sie nach Zucker und wird beim Braten zu dunkel.",
        "Ein kühler Keller ist besser als der Kühlschrank.",
        "Beim Kochen nimmt die Stärke Wasser auf und wird dick.",
        "Deshalb wird eine harte Knolle im Topf weich und mehlig.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DIE_KERZE: Serie = {
  slug: "de-w2-die-kerze",
  titel: "Die Kerze",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "alltag",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Eine Kerze sieht sehr einfach aus: Wachs und ein Docht.",
        "Was dabei wirklich geschieht, ist erstaunlich fein geordnet.",
        "Zuerst eine Frage, die viele falsch beantworten.",
        "Was brennt an einer Kerze eigentlich?",
        "Der Docht brennt nicht, jedenfalls nicht als Erstes.",
        "Das feste Wachs brennt auch nicht.",
        "Es brennt nur Wachs, das zu Dampf geworden ist.",
        "Die Flamme brennt also in der Luft über dem Docht.",
        "Ganz am Anfang zündet man den Docht selbst an.",
        "Seine Hitze bringt das Wachs rundherum zum Schmelzen.",
        "In der Mitte der Kerze bildet sich eine kleine Mulde.",
        "In dieser Mulde steht flüssiges Wachs.",
      ],
    },
    {
      lines: [
        "Jetzt beginnt der Teil, der das Ganze am Laufen hält.",
        "Der Docht ist ein Geflecht aus vielen dünnen Fäden.",
        "Zwischen den Fäden bleiben feine Kanäle offen.",
        "In solchen Kanälen steigt eine Flüssigkeit von allein nach oben.",
        "Man kann das an einem Tuch sehen, das in Wasser hängt.",
        "Das Wasser klettert im Tuch nach oben, obwohl niemand drückt.",
        "Genauso klettert flüssiges Wachs im Docht nach oben.",
        "Oben ist es sehr warm, und dort wird das Wachs zu Dampf.",
        "Dieser Dampf mischt sich mit der Luft und verbrennt.",
        "Die Hitze der Flamme schmilzt weiteres Wachs nach.",
        "Das steigt wieder im Docht auf und wird wieder zu Dampf.",
        "So hält sich die Kerze selbst am Leben, bis nichts mehr da ist.",
      ],
    },
    {
      lines: [
        "Sieh dir die Flamme einmal ganz genau an.",
        "Sie ist nicht überall gleich, sondern hat Zonen.",
        "Ganz unten am Docht sitzt ein kleiner dunkler Kern.",
        "Dort ist der Wachsdampf noch kaum mit Luft vermischt.",
        "Ohne Luft kann er nicht brennen, also bleibt es dort dunkel.",
        "Darüber liegt der weite gelbe Teil, den wir als Flamme kennen.",
        "Das Gelb kommt von winzigen glühenden Teilchen aus Kohlenstoff.",
        "Sie leuchten, weil sie sehr warm sind, so wie glühendes Eisen.",
        "Am Rand ist die Flamme fast unsichtbar und blau.",
        "Dort kommt die meiste Luft an, und dort ist es am wärmsten.",
        "Wer eine Kerze ausbläst, sieht einen dünnen Rauchfaden.",
        "Das ist Wachsdampf, der keine Flamme mehr gefunden hat.",
      ],
    },
    {
      lines: [
        "Man kann diesen Faden sogar wieder anzünden.",
        "Halte ein Streichholz in den Rauch, kurz über den Docht.",
        "Die Flamme springt am Rauch entlang nach unten zurück.",
        "Das ist der beste Beweis: es ist der Dampf, der brennt.",
        "Eine Kerze braucht Luft, sonst geht sie aus.",
        "Stülpt man ein Glas darüber, brennt sie noch kurz weiter.",
        "Dann verbraucht sie den Teil der Luft, den sie zum Brennen braucht.",
        "Sie wird kleiner und erlischt, obwohl noch Wachs da ist.",
        "Eine Kerze braucht auch Ruhe in der Luft um sie herum.",
        "Im Zug flackert sie, weil der Dampf immer wieder weggerissen wird.",
        "Vor langer Zeit waren Kerzen aus Talg und rochen streng.",
        "Wachs von Bienen war teuer und blieb den Kirchen vorbehalten.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DAS_OHR: Serie = {
  slug: "de-w2-das-ohr",
  titel: "Das Ohr",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "sinne",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Ein Ton entsteht immer da, wo sich etwas hin und her bewegt.",
        "Eine Saite, ein Trommelfell, ein Blatt aus Rohr, unsere Stimme.",
        "Das bewegte Ding drückt die Luft vor sich zusammen.",
        "Dann schwingt es zurück, und die Luft wird dort dünner.",
        "So laufen Zonen aus dichter und dünner Luft davon.",
        "Diese Zonen wandern durch den Raum bis zu unserem Ohr.",
        "Die Luft selbst wandert dabei nicht mit.",
        "Sie schaukelt nur an ihrem Platz hin und her.",
        "Was wandert, ist das Muster aus Druck und Nachlassen.",
        "Wie oft die Zonen ankommen, bestimmt die Höhe des Tones.",
        "Wie stark der Druck ist, bestimmt, wie laut er ist.",
        "Das Ohr hat drei Teile, und jeder hat eine eigene Aufgabe.",
      ],
    },
    {
      lines: [
        "Der äussere Teil ist das, was wir anfassen können.",
        "Er ist eine Schale mit Falten und Kanten darin.",
        "Die Schale sammelt den Schall und lenkt ihn in den Gang.",
        "Die Falten tun aber noch etwas anderes.",
        "Schall von oben wird beim Eintreten anders geformt als Schall von unten.",
        "Das Gehirn liest diese Formung und erkennt, ob etwas oben war.",
        "Darum kann man auch mit einem Ohr noch oben und unten trennen.",
        "Der Gang endet an einer straff gespannten Haut.",
        "Das ist das Trommelfell, und es bewegt sich mit der Luft.",
        "Es bewegt sich dabei weniger weit als ein Haar dick ist.",
        "Ab hier ist der Schall nicht mehr in der Luft unterwegs.",
        "Jetzt geht er durch feste Knochen weiter.",
      ],
    },
    {
      lines: [
        "Der mittlere Teil ist ein kleiner Raum hinter dem Trommelfell.",
        "Darin sitzen die drei kleinsten Knochen unseres Körpers.",
        "Sie tragen die Namen Hammer, Amboss und Steigbügel.",
        "Der Hammer liegt am Trommelfell und nimmt dessen Bewegung auf.",
        "Er gibt sie an den Amboss weiter, der Amboss an den Steigbügel.",
        "Der Steigbügel drückt auf ein kleines Fenster zum inneren Teil.",
        "Hinter diesem Fenster ist keine Luft, sondern Flüssigkeit.",
        "Schall, der von Luft in Flüssigkeit übergeht, verliert fast seine ganze Kraft.",
        "Die drei Knochen sind dazu da, diesen Verlust zu verhindern.",
        "Das Trommelfell ist breit, das Fenster ist klein.",
        "Dieselbe Kraft auf einer kleineren Fläche drückt stärker.",
        "So kommt der Schall drüben an, ohne verloren zu gehen.",
      ],
    },
    {
      lines: [
        "Der innere Teil ist ein Schlauch, gewunden wie ein Schneckenhaus.",
        "Er ist mit Flüssigkeit gefüllt und trägt eine lange dünne Haut.",
        "Diese Haut ist am einen Ende schmal und steif.",
        "Am anderen Ende ist sie breit und locker.",
        "Ein hoher Ton bringt vor allem das steife Ende zum Schwingen.",
        "Ein tiefer Ton reicht weiter hinein und bewegt das lockere Ende.",
        "So wird die Höhe eines Tones in einen Ort in der Schnecke verwandelt.",
        "Auf der Haut stehen Reihen von Zellen mit feinen Härchen.",
        "Bewegt sich die Haut, werden die Härchen umgebogen.",
        "Ein umgebogenes Härchen öffnet ein Tor und löst ein Nervensignal aus.",
        "Von dort läuft das Signal als Muster in der Zeit zum Gehirn.",
        "Luft, Knochen, Flüssigkeit, Härchen, Nerv: fünf Übergaben, und wir hören.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DER_REGENBOGEN: Serie = {
  slug: "de-w2-der-regenbogen",
  titel: "Der Regenbogen",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Ein Regenbogen braucht zwei Dinge im selben Moment.",
        "Er braucht Regen in der Luft und Sonne hinter diesem Regen.",
        "Das ist der ganze Trick, und er ist kein kleiner.",
        "Das Licht der Sonne ist nämlich gar nicht eine Sache.",
        "Es ist ein ganzer Satz von Farben, von Rot bis Blau.",
        "Unser Auge legt sie zusammen und nennt das Ergebnis hell.",
        "Wenn Licht von Luft in Wasser geht, wird es abgelenkt.",
        "Es wird abgelenkt, weil es dort langsamer unterwegs ist.",
        "Im Wasser kommt es langsamer voran als in freier Luft.",
        "Diese Änderung im Tempo dreht den Strahl ein wenig.",
        "Und jetzt kommt der Punkt, auf den alles hinausläuft.",
        "Jede Farbe wird um einen etwas anderen Winkel abgelenkt.",
      ],
    },
    {
      lines: [
        "Rot wird von allen Farben am wenigsten abgelenkt.",
        "Blau wird am stärksten abgelenkt, der Rest liegt dazwischen.",
        "Ein Strahl, der hell hineingeht, kommt also aufgefächert heraus.",
        "Ein Regentropfen ist eine kleine Kugel aus klarem Wasser.",
        "Das Sonnenlicht tritt vorne ein und wird abgelenkt.",
        "Es läuft weiter bis zur hinteren Wand des Tropfens.",
        "Dort kehrt es um und kommt vorne wieder heraus.",
        "Beim Austritt wird es ein zweites Mal abgelenkt.",
        "Jeder Tropfen schickt das Licht also als Fächer zurück.",
        "Der Fächer geht zur Sonne hin zurück, nicht von ihr weg.",
        "Darum steht ein Regenbogen immer hinter uns, wenn wir ihn sehen.",
        "Die Sonne muss im Rücken stehen, sonst gibt es keinen.",
      ],
    },
    {
      lines: [
        "Ein einzelner Tropfen macht noch keinen Bogen, den wir sehen.",
        "Ein Regenbogen ist die Arbeit von vielen tausend Tropfen.",
        "Jeder Tropfen schickt genau eine Farbe zu unserem Standort.",
        "Tropfen weit oben schicken uns ihr Rot.",
        "Tropfen weiter unten schicken uns ihr Blau.",
        "Alle zusammen bauen daraus das Band aus Farben.",
        "Deshalb liegt Rot immer oben am Rand des Bogens.",
        "Blau liegt an der Innenseite des Bandes.",
        "Der Bogen ist rund, weil der Winkel überall derselbe ist.",
        "Jeder Tropfen in diesem Winkel schickt uns sein Licht.",
        "Vom Boden aus sehen wir nur einen Teil des Ringes.",
        "Von einem hohen Ort aus kann er wie ein voller Kreis aussehen.",
      ],
    },
    {
      lines: [
        "Zwei Menschen sehen nie denselben Regenbogen.",
        "Das Licht, das bei einer Person ankommt, kommt von bestimmten Tropfen.",
        "Eine Person einen Schritt weiter bekommt Licht von anderen Tropfen.",
        "Jeder hat also seinen eigenen Bogen vor sich.",
        "Darum kann man einen Regenbogen auch nie erreichen.",
        "Geht man auf ihn zu, wechseln die Tropfen, die uns bedienen.",
        "Der Bogen wandert mit und hält denselben Abstand.",
        "Manchmal steht ein zweiter, blasser Bogen um den ersten herum.",
        "In diesem Bogen ist das Licht zweimal im Tropfen umgekehrt.",
        "Die zusätzliche Kehre dreht die Reihe der Farben um.",
        "Ein Gartenschlauch in der Sonne macht einen kleinen Bogen.",
        "Man stellt sich mit der Sonne im Rücken und dem Nebel davor.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DAS_SALZ_IM_WINTER: Serie = {
  slug: "de-w2-das-salz-im-winter",
  titel: "Das Salz im Winter",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "winter",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Wenn es glatt ist, wird auf den Wegen Salz gestreut.",
        "Danach wird das Eis nass und verschwindet nach und nach.",
        "Das Salz macht dabei nicht warm. Es macht etwas anderes.",
        "Wasser wird bei null Grad zu Eis. Das kennt jedes Kind.",
        "Genauer gesagt ist null Grad ein Punkt des Gleichgewichts.",
        "Dort werden gleich viele Teilchen fest wie wieder flüssig.",
        "Ist es kälter, werden mehr fest, und das Wasser wird zu Eis.",
        "Ist es wärmer, werden mehr flüssig, und das Eis schmilzt.",
        "Auf Eis liegt immer eine hauchdünne Schicht flüssiges Wasser.",
        "In diese Schicht löst sich das gestreute Salz.",
        "Jetzt ist die Schicht kein reines Wasser mehr.",
        "Zwischen den Wasserteilchen sitzen nun auch Salzteilchen.",
      ],
    },
    {
      lines: [
        "Für die Teilchen im Eis wird es dadurch schwerer.",
        "Ein Wasserteilchen, das sich anlagern will, findet weniger Platz.",
        "Die Salzteilchen sind im Weg und passen nicht ins Eis hinein.",
        "Also lagern sich weniger Teilchen an als vorher.",
        "In die andere Richtung ändert sich fast nichts.",
        "Aus dem Eis lösen sich weiter genauso viele Teilchen.",
        "Damit ist das Gleichgewicht gestört, und das Eis verliert.",
        "Es schmilzt, obwohl es genauso kalt ist wie vorher.",
        "Der Punkt, an dem Eis entsteht, ist nach unten gerutscht.",
        "Mit Salz wird Wasser erst bei einigen Grad unter null fest.",
        "Deshalb bleibt der Weg frei, obwohl es friert.",
        "Je mehr Salz, desto tiefer rutscht dieser Punkt.",
      ],
    },
    {
      lines: [
        "Ganz beliebig weit geht das aber nicht.",
        "Irgendwann kann sich kein Salz mehr im Wasser lösen.",
        "Bei etwa einundzwanzig Grad unter null ist Schluss.",
        "Darunter hilft gewöhnliches Streusalz nicht mehr.",
        "Dann wird stattdessen Splitt oder Sand gestreut.",
        "Der macht das Eis nicht weg. Er gibt nur Halt darauf.",
        "Das Schmelzen kostet übrigens Wärme, und die kommt von rundherum.",
        "Darum wird ein Weg beim Streuen zuerst noch kälter.",
        "Dasselbe nutzt man beim Speiseeis in einer Kurbelmaschine.",
        "Salz im Eis rundherum bringt es weit unter null.",
        "Erst dadurch kann die Masse in der Mitte gefrieren.",
        "Ein und derselbe Vorgang macht Wege frei und Eis fest.",
      ],
    },
    {
      lines: [
        "Salz hat aber auch Nachteile, und die sind erheblich.",
        "Salzwasser lässt Eisen viel schneller rosten.",
        "Autos leiden im Winter darunter, und Brücken auch.",
        "Am Rand der Wege sammelt sich das Salz im Boden.",
        "Für Bäume und Sträucher ist das schlecht.",
        "Ein Baum zieht Wasser aus dem Boden in seine Wurzeln.",
        "Ist der Boden zu salzig, gelingt ihm das schlechter.",
        "Er steht im Nassen und leidet trotzdem Durst.",
        "Auch die Pfoten von Hunden werden davon wund.",
        "Darum ist Salz in vielen Orten nur noch dort erlaubt, wo es sein muss.",
        "Auf Gehwegen wird oft nur Splitt gestreut.",
        "Der wird im Frühjahr zusammengekehrt und wieder benutzt.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DIE_MILCH: Serie = {
  slug: "de-w2-die-milch",
  titel: "Die Milch",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "alltag",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Milch ist eine Nahrung, die ein Tier für sein Junges macht.",
        "Eine Kuh gibt nur dann Milch, wenn sie ein Kalb bekommen hat.",
        "Das ist der Grund, warum ein Hof immer Kälber braucht.",
        "Milch sieht aus wie eine einfache helle Flüssigkeit.",
        "Unter einem starken Glas sieht man etwas anderes.",
        "In ihr schwimmen unzählige winzige Kugeln aus Fett.",
        "Diese Kugeln machen die Milch hell und undurchsichtig.",
        "Licht kann nicht gerade hindurch, es wird an ihnen abgelenkt.",
        "Darum ist Milch hell, obwohl Wasser und Fett klar sind.",
        "Dazu sind Zucker und Nährstoffe darin gelöst.",
        "Den Zucker der Milch nennt man Milchzucker.",
        "Und es sind Kalk und Salze darin, für die Knochen des Kalbes.",
      ],
    },
    {
      lines: [
        "Frisch aus dem Euter ist Milch etwa körperwarm.",
        "In dieser Wärme wachsen kleine Lebewesen sehr schnell.",
        "Darum wird die Milch gleich nach dem Melken gekühlt.",
        "Ein Tankwagen holt sie kalt vom Hof ab.",
        "In der Molkerei wird sie dann kurz stark erhitzt.",
        "Dabei sterben fast alle Lebewesen darin ab.",
        "Diesen Vorgang nennt man nach einem Forscher aus Frankreich.",
        "Kurz erhitzte Milch hält sich einige Tage im Kalten.",
        "Wird sie länger und wärmer behandelt, hält sie viele Monate.",
        "Dann schmeckt sie aber ein wenig anders, etwas nach Kochen.",
        "Beides ist Milch, und beides ist in Ordnung.",
        "Der Unterschied liegt nur in Zeit und Temperatur.",
      ],
    },
    {
      lines: [
        "Früher stand Milch in einer Kanne, und der Rahm stieg nach oben.",
        "Fett ist leichter als Wasser, also sammelt es sich oben.",
        "Am nächsten Morgen konnte man den Rahm abschöpfen.",
        "Heute wird das Fett in der Molkerei abgetrennt.",
        "Dann wird genau so viel wieder zugegeben, wie draufsteht.",
        "Damit der Rahm nicht mehr aufsteigt, wird die Milch gepresst.",
        "Sie wird mit hohem Druck durch winzige Löcher gedrückt.",
        "Dabei zerplatzen die Fettkugeln in noch viel kleinere.",
        "So kleine Kugeln steigen nicht mehr nach oben.",
        "Darum bildet sich in einer Packung kein Rahm mehr.",
        "Aus dem abgetrennten Rahm wird Butter oder Obers.",
        "Nichts davon geht verloren.",
      ],
    },
    {
      lines: [
        "Nicht alle Menschen können Milchzucker gut verdauen.",
        "Als Kind hat fast jeder das Werkzeug dafür im Darm.",
        "Bei vielen Erwachsenen baut der Körper es wieder ab.",
        "Das ist keine Krankheit, sondern der ältere Zustand.",
        "In Gegenden mit langer Viehhaltung blieb das Werkzeug erhalten.",
        "Dort trinken auch Erwachsene ohne Beschwerden Milch.",
        "In anderen Gegenden ist das seltener.",
        "Für sie gibt es Milch, in der der Zucker vorher gespalten wird.",
        "Sie schmeckt etwas anders, weil gespaltener Zucker kräftiger wirkt.",
        "Aus Milch wird auch Joghurt, Topfen und Käse.",
        "Dabei arbeiten kleine Lebewesen, die man absichtlich zusetzt.",
        "Sie machen aus dem Milchzucker eine Säure, und die Milch wird dick.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DER_APFELBAUM_IM_JAHR: Serie = {
  slug: "de-w2-der-apfelbaum-im-jahr",
  titel: "Der Apfelbaum im Jahr",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Ein Apfelbaum tut in jedem Monat etwas anderes.",
        "Im Winter sieht er aus, als würde er nichts tun.",
        "Das stimmt nicht. Er wartet, und das ist eine Leistung.",
        "Seine Knospen sind seit dem Sommer davor schon fertig.",
        "In jeder Knospe liegt zusammengefaltet eine ganze Blüte.",
        "Sie ist in harte Schuppen gepackt, gegen Frost und Wind.",
        "Der Baum darf im Winter auf keinen Fall austreiben.",
        "Ein früher warmer Tag könnte ihn dazu verleiten.",
        "Darum zählt er nicht die warmen Tage, sondern die kalten.",
        "Erst nach genügend Kälte darf die Knospe überhaupt reagieren.",
        "Diese Sperre nennt man die Winterruhe.",
        "Ohne einen richtigen Winter blüht ein Apfelbaum schlecht.",
      ],
    },
    {
      lines: [
        "Im Frühjahr wird es warm, und die Sperre ist gefallen.",
        "Jetzt beginnt der Baum, Wasser aus den Wurzeln zu ziehen.",
        "Die Knospen schwellen an und werden weich.",
        "Dann brechen sie auf, und die Blüten falten sich auseinander.",
        "Ein Baum kann viele tausend Blüten tragen.",
        "Jede Blüte hat einen Punkt in der Mitte und Blätter rundherum.",
        "Am Rand sitzen Beutel mit gelbem Staub.",
        "Dieser Staub muss zu einer anderen Blüte kommen.",
        "Ein Apfelbaum kann sich nämlich nicht selbst befruchten.",
        "Der Staub eines Baumes wirkt bei ihm selbst nicht.",
        "Deshalb steht in einem Garten selten nur ein Apfelbaum.",
        "Es braucht mindestens einen zweiten, und er muss passen.",
      ],
    },
    {
      lines: [
        "Den Staub tragen vor allem Bienen von Blüte zu Blüte.",
        "Sie kommen nicht wegen des Staubes, sondern wegen des Nektars.",
        "Der Nektar ist eine Belohnung tief unten in der Blüte.",
        "Beim Trinken streift die Biene den Staub ab und nimmt neuen mit.",
        "Ohne Insekten gäbe es fast keine Äpfel.",
        "Nach der Befruchtung fallen die Blütenblätter ab.",
        "Der Punkt in der Mitte beginnt anzuschwellen.",
        "Aus ihm wird über den Sommer der Apfel.",
        "Der Baum kann aber nicht alle Blüten zu Äpfeln machen.",
        "Im Juni wirft er darum einen Teil der kleinen Früchte ab.",
        "Das sieht nach einem Verlust aus und ist eine Auswahl.",
        "Er behält die, die er auch versorgen kann.",
      ],
    },
    {
      lines: [
        "Im Sommer wächst der Apfel und wird schwer.",
        "Die Blätter bauen Zucker und schicken ihn in die Frucht.",
        "Der Apfel legt zuerst Stärke an, nicht Zucker.",
        "Stärke schmeckt nach nichts, darum ist ein junger Apfel fade.",
        "Erst zum Herbst hin wird die Stärke wieder zu Zucker.",
        "Deshalb wird ein Apfel am Baum von Woche zu Woche besser.",
        "Auch die Farbe kommt spät, und sie kommt vom Licht.",
        "Die Seite zur Sonne wird rot, die andere bleibt hell.",
        "Ist der Apfel reif, löst sich der Stiel leicht vom Zweig.",
        "Man dreht ihn an und hebt ihn an, statt zu zerren.",
        "Danach zieht der Baum das Gute aus den Blättern zurück.",
        "Die Blätter fallen, und die Knospen für nächstes Jahr sind fertig.",
      ],
    },
  ],
};

/** Neun deutsche Wissens-Serien der Charge W2 fuer de/kids, alle auf Sprosse 27. */
export const SERIEN_DE_WISSEN_KIDS: Serie[] = [
  DER_SCHATTEN,
  DER_IGEL_IM_WINTER,
  DIE_KARTOFFEL,
  DIE_KERZE,
  DAS_OHR,
  DER_REGENBOGEN,
  DAS_SALZ_IM_WINTER,
  DIE_MILCH,
  DER_APFELBAUM_IM_JAHR,
];
