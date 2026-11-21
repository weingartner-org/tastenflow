/**
 * DEUTSCHE WISSENS-SERIEN FÜR JUGENDLICHE - Charge W2, 29.08.2026.
 * Drei Serien, Stufe `teens`, alle auf **Sprosse 27**.
 *
 * `de/teens` hatte siebzehn Wissens-Serien, das Ziel sind zwanzig.
 * Warum 27 und nicht 25, und was auf 27 wegfällt: siehe Kopf von
 * `serienDeWissenKids.ts`.
 */
import type { Serie } from "./serie";

const EIGEN_SACH = {
  quelle: "Sensorik (Sachwissen selbst formuliert, an Fachquellen geprüft)",
  lizenz: "Eigenes Werk",
  autor: "Sensorik-Lernplattform",
} as const;

// ───────────────────────────────────────────────────────────────────────────
const DAS_FAHRRAD: Serie = {
  slug: "de-w2-das-fahrrad",
  titel: "Das Fahrrad",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["teens"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Ein Fahrrad ist die sparsamste Art, sich fortzubewegen.",
        "Kein Tier und keine Maschine kommt mit so wenig Kraft so weit.",
        "Der Grund dafür liegt an zwei Stellen.",
        "Erstens rollt ein Rad, statt zu schieben oder zu treten.",
        "Beim Gehen hebt ein Mensch bei jedem Schritt sein Gewicht an.",
        "Beim Rollen bleibt das Gewicht auf gleicher Höhe.",
        "Zweitens sitzt der Mensch, und das Rad trägt ihn.",
        "Die Beine müssen nur noch treten und nichts mehr tragen.",
        "Dazu kommt, dass die Reibung sehr klein gehalten wird.",
        "In der Nabe laufen die Kugeln in einem harten Ring.",
        "Eine Kugel rollt und schleift nicht, und das kostet fast nichts.",
        "Die Kette überträgt die Kraft mit sehr geringem Verlust.",
      ],
    },
    {
      lines: [
        "Die Gänge sind der zweite wichtige Gedanke am Fahrrad.",
        "Ein Mensch tritt am besten in einem bestimmten Takt.",
        "Zu langsam treten kostet Kraft in den Knien.",
        "Zu schnell treten kostet Luft und ermüdet.",
        "Am Berg möchte man langsamer fahren und gleich schnell treten.",
        "Genau das leisten die Gänge.",
        "Vorne sitzt ein Blatt mit Zähnen, hinten ein Kranz mit Zähnen.",
        "Die Kette verbindet beide und überträgt jede Umdrehung.",
        "Hat das Blatt vorne doppelt so viele Zähne wie hinten,",
        "Dann dreht sich das Hinterrad bei einer Kurbeldrehung zweimal.",
        "Ein kleines Blatt vorne und ein weiter Kranz hinten macht es leicht.",
        "Der Weg pro Tritt wird kürzer, die Kraft dafür geringer.",
      ],
    },
    {
      lines: [
        "Kraft mal Weg bleibt dabei immer gleich.",
        "Ein Gang schenkt nichts. Er teilt die Arbeit anders ein.",
        "Man fährt den Berg nicht leichter hinauf, sondern langsamer.",
        "Die geleistete Arbeit ist am Gipfel dieselbe.",
        "Das Erstaunlichste am Fahrrad ist aber das Gleichgewicht.",
        "Ein stehendes Rad fällt um. Ein fahrendes bleibt stehen.",
        "Lange hat man geglaubt, das läge am Kreisel im Rad.",
        "Ein drehendes Rad wehrt sich gegen das Kippen, das stimmt.",
        "Ein Versuchsrad ohne diesen Kreiseleffekt fährt aber trotzdem.",
        "Die Hauptsache ist etwas anderes, und es ist einfacher.",
        "Wenn das Rad nach links kippt, dreht die Lenkung nach links.",
        "Dadurch fährt das Rad eine Kurve unter den Schwerpunkt zurück.",
      ],
    },
    {
      lines: [
        "Diese Lenkbewegung geschieht von allein, ohne unser Zutun.",
        "Sie kommt daher, wie die Gabel schräg steht.",
        "Der Punkt, an dem das Vorderrad aufsteht, liegt hinter der Lenkachse.",
        "Dieser Nachlauf zieht das Rad in die Kippe hinein.",
        "So fängt sich das Fahrrad selbst, viele Male in jeder Sekunde.",
        "Wer fährt, korrigiert nur noch das, was übrig bleibt.",
        "Darum kann man freihändig fahren, aber nicht freihändig stehen.",
        "Beim Bremsen ist noch etwas zu wissen.",
        "Die vordere Bremse bremst stärker als die hintere.",
        "Beim Bremsen wandert das Gewicht nach vorn auf das Vorderrad.",
        "Ein belastetes Rad hält besser, ein entlastetes rutscht.",
        "Darum bremst man vorne kräftig und hinten dazu.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DIE_BRILLE: Serie = {
  slug: "de-w2-die-brille",
  titel: "Die Brille",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["teens"],
  minTier: 3,
  topic: "sinne",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Um scharf zu sehen, muss das Licht an einer Stelle zusammenlaufen.",
        "Diese Stelle muss genau auf der hinteren Wand im Auge liegen.",
        "Dort sitzen die Zellen, die das Licht aufnehmen.",
        "Liegt der Punkt davor oder dahinter, wird das Bild unscharf.",
        "Zwei Teile im Auge bündeln das Licht.",
        "Den Hauptteil leistet die klare Haut ganz vorne.",
        "Sie allein bündelt das Licht schon sehr stark.",
        "Dahinter sitzt die Linse, und sie kann sich verformen.",
        "Ein Muskelring um die Linse spannt oder entspannt sie.",
        "So kann das Auge nah und fern nacheinander scharf stellen.",
        "Bei manchen Menschen passt der Punkt nicht auf die Wand.",
        "Das ist keine Krankheit, sondern eine Frage der Abmessung.",
      ],
    },
    {
      lines: [
        "Ist der Augapfel etwas zu lang, liegt der Punkt davor.",
        "Weit entferntes wird dann unscharf, nahes bleibt scharf.",
        "Man nennt das Kurzsichtigkeit.",
        "Ist der Augapfel etwas zu kurz, liegt der Punkt dahinter.",
        "Dann strengt sich der Muskel an, um es auszugleichen.",
        "Das gelingt lange Zeit, und es ermüdet.",
        "Eine Brille verschiebt den Punkt an die richtige Stelle.",
        "Sie tut das mit einem Glas, das das Licht ablenkt.",
        "Ein Glas, das in der Mitte dünner ist, spreizt das Licht.",
        "Dadurch wandert der Punkt nach hinten, auf die Wand.",
        "Das ist die Brille bei Kurzsichtigkeit.",
        "Ein Glas, das in der Mitte dicker ist, bündelt stärker.",
      ],
    },
    {
      lines: [
        "Dadurch wandert der Punkt nach vorn, wieder auf die Wand.",
        "Das ist die Brille bei Weitsichtigkeit.",
        "Die Stärke eines Glases wird in einer eigenen Einheit angegeben.",
        "Ein Minus davor bedeutet spreizen, ein Plus bündeln.",
        "Es gibt noch einen dritten Fall, und der ist häufig.",
        "Die Haut vorne am Auge ist nicht überall gleich gewölbt.",
        "In einer Richtung ist sie stärker gekrümmt als in der anderen.",
        "Dann gibt es nicht einen Punkt, sondern zwei Linien.",
        "Senkrechtes und waagrechtes wird verschieden scharf gesehen.",
        "Ein Glas dagegen ist selbst in eine Richtung stärker geschliffen.",
        "Deshalb hat eine solche Brille eine Achse, die stimmen muss.",
        "Verdreht man das Glas, wird es schlechter statt besser.",
      ],
    },
    {
      lines: [
        "Ab etwa vierzig Jahren wird die Linse im Auge steifer.",
        "Der Muskel kann sie dann nicht mehr so stark verformen.",
        "Nahes wird unscharf, obwohl in der Ferne alles stimmt.",
        "Das trifft fast jeden Menschen, unabhängig von allem anderen.",
        "Dagegen hilft ein Glas zum Lesen, oder ein geteiltes Glas.",
        "In einem geteilten Glas ist unten ein anderer Bereich eingearbeitet.",
        "Man schaut zum Lesen nach unten und in die Ferne geradeaus.",
        "Eine Brille kann sehr viel, und sie kann nicht alles.",
        "Sie hilft, wenn das Licht am falschen Ort zusammenläuft.",
        "Sie hilft nicht, wenn die aufnehmenden Zellen selbst geschädigt sind.",
        "Dann braucht es andere Hilfen: Kontrast, Licht, ein Lesegerät.",
        "Oder den Weg über das Ohr und über die Finger.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DER_KOMPASS: Serie = {
  slug: "de-w2-der-kompass",
  titel: "Der Kompass",
  kind: "wissen-serie",
  lang: "de",
  stufen: ["teens"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Ein Kompass ist ein kleiner Magnet auf einer feinen Spitze.",
        "Lässt man ihn in Ruhe, dreht er sich, bis ein Ende nach Norden zeigt.",
        "Er tut das auf einem Schiff, im Wald und in einem dunklen Raum.",
        "Der Grund liegt tief unter unseren Füssen.",
        "Die Erde hat einen Kern aus glühendem Eisen.",
        "Ein Teil davon ist flüssig und bewegt sich langsam.",
        "Bewegtes Eisen führt einen elektrischen Strom mit sich.",
        "Und ein elektrischer Strom baut um sich ein Magnetfeld auf.",
        "Also wirkt die ganze Erde wie ein schwacher Magnet.",
        "Das Feld tritt nahe dem einen Pol aus und beim anderen ein.",
        "Ein kleiner drehbarer Magnet legt sich in dieses Feld hinein.",
        "Er hat gar keine Wahl. Das tun Magnete.",
      ],
    },
    {
      lines: [
        "Hier kommt das Erste, was viele überrascht.",
        "Der magnetische Pol liegt nicht am wahren Pol der Erde.",
        "Der wahre Pol ist dort, wo die Drehachse austritt.",
        "Der magnetische Pol liegt einige hundert Kilometer daneben.",
        "Ein Kompass zeigt also fast nach Norden, aber nicht genau.",
        "Der Unterschied hat einen Namen: die Missweisung.",
        "Sie ist nicht in jedem Land gleich.",
        "Auf einer Seekarte steht die örtliche Missweisung aufgedruckt.",
        "Ein Seemann liest den Kompass ab und rechnet sie heraus.",
        "Der magnetische Pol wandert ausserdem von Jahr zu Jahr.",
        "Er ist in einem Menschenleben hunderte Kilometer gewandert.",
        "Deshalb müssen die Karten immer wieder erneuert werden.",
      ],
    },
    {
      lines: [
        "Das Zweite ist noch merkwürdiger: das Feld kippt um.",
        "In langen Abständen tauschen Norden und Süden die Plätze.",
        "Das Gestein am Meeresboden hat davon ein Protokoll geführt.",
        "In flüssigem Gestein schwimmen kleine Körner aus Eisen.",
        "Beim Erkalten legen sie sich in die Richtung des Feldes.",
        "Ist das Gestein hart, ist die Richtung darin festgehalten.",
        "Neuer Meeresboden entsteht an langen Spalten unter dem Ozean.",
        "Er wandert von der Spalte aus nach beiden Seiten weg.",
        "Also trägt der Boden Streifen aus Gestein verschiedenen Alters.",
        "Manche Streifen weisen in die eine Richtung, manche in die andere.",
        "Liest man das Muster ab, kann man die Umkehrungen zählen.",
        "Das war einer der Beweise, dass der Meeresboden auseinander wächst.",
      ],
    },
    {
      lines: [
        "Der Kompass kam vor mehr als tausend Jahren in China auf.",
        "Die erste Form war ein Löffel aus Magneteisen auf einer Platte.",
        "Magneteisen ist ein Gestein, das von sich aus magnetisch ist.",
        "Der Löffel drehte sich auf der Platte, bis er zur Ruhe kam.",
        "Später strich man eine Nadel daran und legte sie auf Wasser.",
        "In dieser Form kam er auf die Schiffe der Handelswege.",
        "Vorher hatte ein Seemann fern der Küste nur Sonne und Sterne.",
        "Unter einer geschlossenen Wolkendecke blieb ihm nichts.",
        "Der Kompass hat der Überfahrt einen Teil ihres Schreckens genommen.",
        "Auf einem Schiff aus Eisen verbiegt der Rumpf das Feld.",
        "Darum wird ein Kompass an Bord mit kleinen Magneten berichtigt.",
        "Diese Arbeit nennt man das Kompensieren.",
      ],
    },
  ],
};

/** Drei deutsche Wissens-Serien der Charge W2 fuer de/teens, alle auf Sprosse 27. */
export const SERIEN_DE_WISSEN_TEENS: Serie[] = [DAS_FAHRRAD, DIE_BRILLE, DER_KOMPASS];
