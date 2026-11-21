/**
 * FRÜHE Bücherei-Serien GEZIELT FÜR ERWACHSENE (Charge I1c, 16.08.2026) - die
 * vierte Treppe, und die erste, die ausschließlich der obersten Stufe gehört.
 *
 * ANLASS (gemessen mit `scripts/_seroeffnung.mts`, nicht geschätzt): Nach I1 und
 * I1b war `erwachsen` die dünnste deutsche Zelle der Bücherei - elf Serien, und
 * davon standen an den frühen Sprossen genau drei (Die Terrasse n=13, Die
 * Nachtschicht n=17, Der Garten hinter dem Haus n=20). Das Regal las sich über
 * die Punkte 13/17/20/22/26/31/99 als 1, 2, 3, 3, 5, 11, 11: Wer als
 * Erwachsener mit dreizehn Tasten einsteigt, hatte EINE Geschichte, danach lange
 * nichts. Alle elf teilte er außerdem mit der mittleren Stufe; für ihn allein
 * geschrieben war keine einzige.
 *
 * DIE TREPPE, die diese Datei nachlegt (jede Zeile gemessen, `minTier`
 * deklariert == berechnet):
 *
 *   n=13  Der Laden   (Geschichte, 4 Etappen)
 *   n=18  Der Tunnel  (Geschichte, 4 Etappen)          - vor Charge O1: 17
 *   n=20  Der Sturm   (Geschichte, 4 Etappen)
 *   n=22  Der Kalk    (Wissens-Serie, 4 Etappen)
 *   n=26  Das Papier  (Wissens-Serie, 4 Etappen)
 *   n=31  Die Wand    (Geschichte, 6 Etappen - der lange Bogen)
 *
 * ★ ACHTUNG: Charge O1 (21.08.2026) hat das `o` in `LETTER_ORDER` direkt
 * hinter das `h` gezogen. Die Sprossen-Tafel lautet seither **n=13 · ⇧ ·
 * +h(15) · +o(16) · +u(17) · +c(18) · +g(19) · +m(20) · +b(21) · +w(22)**;
 * die Buchstaben-Listen unten sind darauf nachgezogen. »Der Tunnel« rutschte
 * dadurch von 17 auf 18; den Platz an der Sprosse 17 nehmen jetzt »Die
 * Kantine« und »Der Kahn« ein (`serienOFolge.ts`).
 *
 * DER MASSSTAB (Johannes): erwachsen und ernst, nie belehrend, keine
 * Verniedlichung, kein Maskottchen, kein sprechendes Tier. Themen mit
 * Lebensnähe - Arbeit, Wohnen, Wetter, Technik, Geschichte, Natur. Vorbilder im
 * Bestand: „Die Nachtschicht", „Der zweite Schlüssel", „Die Bank am Fluss" und
 * die Sachreihe „Wie das Wasser in die Leitung kommt". Daraus abgeleitet:
 * erwachsene Figuren mit einem echten Einsatz (eine Kasse, eine Nachtsperre, ein
 * Hof ohne Strom, eine Frist), Cliffhanger am Etappen-Ende, keine Moral im
 * Schlusssatz - und in den Wissens-Serien ein Kreislauf, Größenordnungen und
 * eine Grenze statt einer Aufzählung.
 *
 * WORTSCHATZ-GRENZEN - die eigentliche Arbeit unterhalb T3 (Regel 13: dort ist
 * der TASTENSATZ die Arbeit, nicht die Handlung). Die Grenzen aus
 * `serienFrueh.ts` und `serienTeensFrueh.ts` gelten unverändert; was beim
 * Schreiben DIESER Charge zusätzlich aufgelaufen ist, steht hier - jedes am
 * Objekt geprüft:
 *
 *  • n=13 `a d e f i j k l n r s t ö` - zusätzlich zu den bekannten Löchern
 *    (kein *und*, kein *nicht*, kein *ich*, kein *mit*, kein *dem/einem/im/am*,
 *    kein Zeitwort): **kein Handelswort** - *kaufen, Kunde, Preis, Geld, zahlen*
 *    brauchen alle u/p/g/z. Ein Laden lässt sich trotzdem erzählen, wenn man ihn
 *    über die KASSE, die KISTEN und die KARTEI zeigt. **Kein *Name*** (m) -
 *    Figuren werden genannt, nie benannt; **kein *Leute*** (u) - es bleiben
 *    *alle, die Alten, die Kinder, jeder, keiner*. Modalverben: nur *kann* und
 *    *darf*.
 *  • n=16/17 (+ o, dann + u) - mit dem `o` kommen *so, oft, ohne, oder, also,
 *    sofort, dort, Ort, rot, Hof, Ofen, Sohn, Ton, Not, Los, Foto, Telefon*,
 *    mit dem `u` dann *und, auf, aus, unter, Uhr, Stunde, Luft, Haus, Flur,
 *    Kunde*. ABER: das `c` fehlt noch, also **kein *ich*, kein *nicht*, kein
 *    *sich*, kein *auch*, kein *nach*, kein *durch*, kein *noch*, kein
 *    *schon*, kein *doch*, kein *Nacht/Licht*** und kein einziges sch- oder
 *    ch-Wort; `g` fehlt, also **kein *sagt/fragt/legt/liegt*, kein *Tag*,
 *    kein *lange* und kein ge-Partizip**; `m` fehlt, also **kein *Meter*, kein
 *    *mehr*, kein *im/am/mit/dem***; `b` fehlt, also **kein *bis*, kein *bei*,
 *    kein *aber*, kein *sieben***; `z` fehlt, also **kein *zu*, kein *kurz*,
 *    kein *letzte***. Reden läuft über *nennt, ruft, redet*, Fragen stehen als
 *    direkte Frage im Text.
 *  • n=18/19 (+ c, dann + g) - jetzt *ich, nicht, auch, nach, durch, sich,
 *    noch, schon, doch, Nacht, Licht, Kantine, Leuchte, Fachleute*, und mit
 *    dem g *sagt, fragt, legt, liegt, Tag, lange* und das ge-Partizip.
 *  • n=20 (+ m) - *im, am, mit, man, Morgen, Monat, Signal, Strom, Motor,
 *    Generator, Milch*. Damit wird Technik überhaupt erst erzählbar. Gesperrt
 *    bleiben **b w z v p**: kein *bis/bei/aber/haben/Arbeit/Nachbar*, **kein
 *    *Wasser*, kein *Wind*, kein *Wetter*** (in einer Sturmnacht!), **kein
 *    *Oktober* und kein *oben***, kein *zu/Zeit/ganz/Holz/setzt*, kein
 *    *von/vor/viel*, kein *Platz/Prozent*. Ersatzwege: *Regen* und *nass*
 *    statt *Wasser*, *Orkan* statt *Wind*, *das Haus an der Kehre* statt
 *    *Nachbar*, *doch/dennoch* statt *aber*, *niemand* statt *keiner von
 *    uns*.
 *  • n=22 (+ b w) - *aber, haben, Arbeit, wir, was, wie, wieder, Wasser, Wand,
 *    warm, wenig*. Gesperrt bleiben **z v p ä ü ß**: **kein *zu*** (also keine
 *    einzige *um-zu*-Fügung und kein *zur*), kein *von/vor/viel/voll*, kein
 *    *Prozent*, kein *Putz*, kein *Salz*, kein *Holz*, kein *Zement*, kein
 *    *Wärme*, kein *heiß*, kein *über*. In einer Sachreihe heißt das: Zahlen nur
 *    als *hundert, tausend, Million, drei, sechs, acht, neun, elf*, Wärme als
 *    *es wird sehr warm, es kocht, es raucht*.
 *  • n=26 (+ z v p ä) - fast alles. Es fehlen **ü x y q ß**, und das trifft
 *    genau die Dienstwörter: **kein *für*, kein *über*, kein *müssen*, kein
 *    *zurück*, kein *natürlich*, kein *Tür*, kein *Stück*, kein *früher***, dazu
 *    **kein *groß*, kein *heißt*, kein *weiß*, kein *Straße*, kein *Zylinder***
 *    und **kein *fünf* und kein *dreißig***. Ersatz: *je* statt *für*, *mehr
 *    als* statt *über*, *man nennt es* statt *heißt*, *Trommel* statt
 *    *Zylinder* - und jede Zahl so gewählt, dass sie ohne die Fünf auskommt.
 *
 * RECHTE: alle sechs Serien sind SELBST VERFASST. Reale Texte - auch
 * gemeinfreie - halten sich nicht an eine Buchstaben-Freischaltung; auf dieser
 * Ebene ist eigenes Werk der einzige Weg (Bauplan 27.07. §10). Die Fakten der
 * beiden Wissens-Serien sind je an zwei unabhängigen Stellen gegengeprüft; die
 * Belege stehen am Objekt in `herkunft.fundstelle` und im Kommentar darüber.
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
// n=13 - die früheste Sprosse. Ein kleiner Laden gegen einen neuen Markt an der
// Stadtkante. Ohne u/g/m/o/p/z gibt der Zeichensatz kein einziges Handelswort
// her (kein kaufen, kein Preis, kein Geld) - erzählt wird darum über die Kasse,
// die Kisten und die alte Kartei. Genau die Kartei ist am Ende der Vorsprung.
// ───────────────────────────────────────────────────────────────────────────────
const DER_LADEN: Serie = {
  slug: "der-laden",
  titel: "Der Laden",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 1,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Rita leitet einen kleinen Laden in einer alten Stadt.",
        "Der Laden ist klein, die Fliesen sind alt, die Kasse ist steif.",
        "In den Kisten sind Reis, Salat, Eier, Senf, Kekse.",
        "Rita kennt alle, die eintreten.",
        "Sie kennt jede Kiste, jede Latte, jede Delle in der Lade.",
        "An der Kasse ist eine Kartei, alt, in feinen Lettern.",
        "Darin ist eine Karte je Adresse.",
        "Rita liest diese Karten selten. Sie kennt sie.",
        "An der Kante der Stadt startet ein anderer Laden.",
        "Er ist keine Diele. Er ist ein Saal.",
        "Seit dieser Frist ist es an der Kasse still.",
        "Rita rastet an der Lade. Sie denkt an das Ende.",
      ],
    },
    {
      lines: [
        "Erst testet Rita alles.",
        "Sie stellt die Kisten anders. Sie faltet feine Karten in die Latten.",
        "Ein Laster liefert Salat. Er endet in der Kiste.",
        "Alle reisen an die Kante der Stadt.",
        "Rita rastet an der Lade. Dann öffnet sie die Kartei.",
        "Sie liest jede Karte. Es sind alte Karten.",
        "Sie liest, sie listet, sie erkennt eines:",
        "Fast alle in dieser Kartei sind alt.",
        "Sie treten selten ein. Sie treten nie in einen Saal.",
        "Diese Adressen sind fern: Feld, Tal, Insel.",
        "Rita denkt still.",
        "Dann faltet sie eine leere Karte. Darin ist eine Idee.",
      ],
    },
    {
      lines: [
        "Rita stellt drei Kisten an die Seite.",
        "In jeder ist Reis, Salat, Kaffee, Tee.",
        "Sie faltet eine Karte darin: Der Laden ist da.",
        "Elif fand seit den Ferien keine Stelle.",
        "Rita stellt Elif ein.",
        "Elif kennt jede Adresse in dieser Ferne.",
        "Erst tastet Elif die Karten. Dann eilt sie.",
        "Die erste Kiste landet an einer Diele in Feld drei.",
        "Elif tritt an die Diele. Sie tastet an der Tafel.",
        "Keiner öffnet.",
        "Elif rastet an der Diele. Es ist still.",
        "Sie stellt die Kiste an die Diele. Dann reist sie.",
      ],
    },
    {
      lines: [
        "Erst sendet Elias eine Karte an den Laden.",
        "Die Lettern sind steil. Die Tinte ist alt.",
        "Darin ist eine Linie: Danke, Rita.",
        "Elias fiel an einer Leiter. Seit dieser Frist reist er nie.",
        "Er kennt keine Adresse, die liefert.",
        "Rita listet alle, die selten eintreten.",
        "Erst sind es elf Adressen, dann sind es fast alle.",
        "Elif eilt, seit sie die Stelle fand.",
        "Der Saal an der Kante liefert keine Kiste in die Ferne.",
        "Er kennt keine Kartei. Er kennt keine Adresse.",
        "Der Laden ist klein. Die Kartei ist es nie.",
        "Rita faltet eine leere Karte. Elif nennt die erste Adresse.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=18 (vor Charge O1: 17) - Nachtsperre in einem alten Eisenbahntunnel.
// Geschrieben mit dem Satz der alten Sprosse 17: kein g (also kein sagt, kein
// Tag, kein Partizip), kein m (kein Meter, kein mehr), kein o (kein noch, kein
// vor), kein b (kein bis, kein bei), kein z (kein zu, kein letzte). Der
// Einsatz ist die Frage, die eine Technikerin nach drei Uhr beantworten muss -
// und die nichts kostet, solange man Ja sagt.
// ───────────────────────────────────────────────────────────────────────────────
const DER_TUNNEL: Serie = {
  slug: "der-tunnel",
  titel: "Der Tunnel",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Aisha ist Technikerin. Sie hat Nachtdienst.",
        "Der Tunnel ist alt und er ist tief.",
        "Erst nach eins ist die Strecke frei.",
        "Dann ruht der Fahrdienst, dann darf sie hinein.",
        "Aisha und Ferhat treten in den Schacht.",
        "Ihre Leuchten schneiden Streifen in die Luft.",
        "Es riecht nach Kalk und nach kalter Erde.",
        "Der Fels ist still. Die Schienen sind es auch.",
        "Aisha kennt jede Kante dieser Strecke.",
        "Sie sucht Risse. Sie sucht nasse Stellen.",
        "Nach einer Stunde findet sie eine.",
        "An der Decke, drei Schritt hinter der achten Nische, ist es nass.",
      ],
    },
    {
      lines: [
        "Ferhat schaut hinauf. Die Stelle ist dunkel und feucht.",
        "Er sieht darin nichts.",
        "Es rinnt hier stets etliches. Ferhat kennt den Tunnel seit Jahren.",
        "Aisha tastet den Kalk an der Decke.",
        "Der Kalk ist hell und frisch.",
        "Frischer Kalk hat eine Ursache.",
        "Sie sucht die Akte in ihrer Tasche.",
        "Die Akte kennt diese Stelle nicht.",
        "Erst in der Kantine findet sie eine alte Akte.",
        "Darin steht die Stelle. Sie ist unterstrichen.",
        "Danach endet die Akte. Nichts steht darunter.",
        "Es ist nach drei. Die erste Fahrt naht.",
      ],
    },
    {
      lines: [
        "Aisha rechnet: eine Stunde, dann ist die Nacht aus.",
        "Ferhat trinkt Kaffee. Er ist still.",
        "Dann redet er klar: Steht der Tunnel, dann steht alles.",
        "Er hat recht. Auf dieser Strecke fahren hunderte Fahrten.",
        "Aisha schaut hinauf. Der Kalk ist frisch.",
        "Sie streicht die Kante. Es rinnt nach.",
        "Sie kennt keine Ursache. Und das ist es.",
        "Sie ruft die Schichtleiterin an.",
        "Sarah hat Dienst in der Leitstelle.",
        "Aisha nennt die Stelle. Sie nennt den frischen Kalk.",
        "Sarah hört sich alles an. Dann redet sie.",
        "Ist die Strecke sicher?",
      ],
    },
    {
      lines: [
        "Aisha ist still. Der Tunnel ist es auch.",
        "Ein Ja ist einfach. Ein Ja dauert keine Sekunde.",
        "Sie kann es nicht.",
        "Sie redet klar: Ich sichere diese Strecke nicht.",
        "Sarah dankt. Die erste Fahrt endet in der Stadt.",
        "Der Fahrdienst leitet alles anders.",
        "Ferhat redet nicht auf der Fahrt in die Kantine.",
        "Erst an der Tasse redet er: Ich hatte anders entschieden.",
        "Danach dauert es sechs Nachtschichten.",
        "Fachleute schneiden den Kalk und den Fels auf.",
        "Hinter der nassen Stelle findet sich ein Riss.",
        "Er ist tief. Aisha ist erleichtert und sie ist es nicht.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=20 - eine Sturmnacht auf einem kleinen Hof. Der Zeichensatz hat weder w noch
// b: kein Wasser, kein Wind, kein Wetter, kein aber, kein Nachbar, kein bis.
// Der Sturm heißt darum Orkan, der Regen heißt Regen, und der Mann von nebenan
// ist der Karl mit dem Haus an der Kehre. Erzählt wird, was ein Stromausfall auf
// einem Milchhof wirklich bedeutet: eine Frist in Stunden.
// ───────────────────────────────────────────────────────────────────────────────
const DER_STURM: Serie = {
  slug: "der-sturm",
  titel: "Der Sturm",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "natur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Der Orkan kommt an einem Montag nach Allerheiligen.",
        "Ilka hört ihn schon am Nachmittag in den Fichten.",
        "Sie hat einen kleinen Hof mit acht Tieren im Stall.",
        "Am Morgen und am Nachmittag melkt sie.",
        "Die Milch kommt in einen Tank, den ein Motor kalt macht.",
        "Der Motor kennt nur eines: Strom.",
        "Um sechs schmettert der Orkan das Tor gegen die Mauer.",
        "Der Regen kommt so dicht, dass der Hof im Nichts steht.",
        "Ilka macht den Stall dicht und sie geht in die Kammer.",
        "Sie kocht Tee. Das Licht flackert einmal.",
        "Dann flackert es noch einmal.",
        "Dann ist es dunkel, und der Motor am Tank ist still.",
      ],
    },
    {
      lines: [
        "Ilka telefoniert. Die Leitung ist tot.",
        "Erst hoch am Hang findet sie ein Signal.",
        "Sie erreicht den Notdienst nach elf Minuten.",
        "Eine Stimme nennt keine Stunde und nennt kein Datum.",
        "Im Tal ist nirgends Strom.",
        "Am Morgen geht Ilka die Strecke hinunter.",
        "Drei Fichten des Hanges sind auf die Strecke gefallen.",
        "Die Kehre danach ist nur noch Erde und Ast.",
        "Kein Monteur kommt so in den Ort.",
        "Ilka geht in den Stall und melkt in Kannen.",
        "Sie hat acht Tiere und sie hat einen Tank ohne Strom.",
        "Nach einer Nacht ohne Strom ist die Milch nichts mehr.",
      ],
    },
    {
      lines: [
        "Karl hat das Haus an der Kehre, seit er in Rente ist.",
        "Er kommt am Morgen in einem Mantel und in Stiefeln.",
        "Er hört Ilka an und dann geht er in die Remise.",
        "In der Remise steht ein Traktor aus einem alten Jahr.",
        "Dahinter steht ein Generator unter einer alten Decke.",
        "Karl schaltet die Kette des Traktors auf den Generator.",
        "Er kennt die Maschine, denn er hatte sie einst gekauft.",
        "Sie stand seit acht Jahren dort im Dunkeln.",
        "Ilka holt Diesel in einer Kanne aus dem Stall.",
        "Karl dreht den Anlasser. Der Motor hustet.",
        "Er dreht noch einmal. Nichts.",
        "Er dreht ein drittes Mal, und der Motor macht keinen Ton.",
      ],
    },
    {
      lines: [
        "Karl geht nicht in den Ort und er sucht keinen Rat.",
        "Er nimmt den Filter des Diesels aus dem Motor.",
        "Der Filter ist eine dunkle Masse.",
        "Acht Jahre in der Remise sind acht Jahre.",
        "Ilka geht in den Ort und findet in der Halle einen Filter.",
        "Sie kommt heim, denn die Kehre ist am Rand frei.",
        "Karl macht den Filter neu und dreht den Anlasser.",
        "Der Motor kommt und er dröhnt in der Remise.",
        "Der Motor am Tank dreht. Das Licht im Stall geht an.",
        "Am dritten Tag kommt der Strom in den Ort.",
        "Karl stellt den Generator dann nicht mehr in die Remise.",
        "Er stellt ihn in den Stall, und eine Kanne Diesel steht dort.",
      ],
    },
  ],
};

/**
 * Sachtext für Erwachsene: der Kalkkreislauf - der einzige Baustoff, der am Ende
 * wieder das ist, was er am Anfang war.
 *
 * JEDE Sachaussage doppelt belegt (Bauplan §5 I1, Dreifach-Prüf-Regel):
 *  • Brennen des Kalksteins ab etwa neunhundert bis tausend Grad, dabei entweicht
 *    Kohlenstoffdioxid: Wikipedia „Technischer Kalkkreislauf" UND chemie-schule.de
 *    („In Industrieöfen wird der Kalkstein auf Temperaturen über 900 °C erhitzt").
 *  • Löschen unter starker Wärmeentwicklung und Volumenvergrößerung: Wikipedia
 *    „Technischer Kalkkreislauf" UND Verband Naturkalk („Kalkkreislauf").
 *  • Erhärten durch Aufnahme desselben Gases aus der Luft, „kann jahrelang
 *    dauern": beide oben genannten Quellen.
 *  • Kalkstein als marines Sedimentgestein; Dachsteinkalk aus Riff und Lagune der
 *    Obertrias, rund zweihundert Millionen Jahre alt: Wikipedia „Dachsteinkalk"
 *    UND Salzburgwiki „Dachsteinkalk".
 *  • Frischer Kalk ist stark alkalisch (pH etwa zwölf bis dreizehn) und hemmt
 *    damit Schimmel: nurkalk.de („Alkalität") UND einhornwerke.de
 *    („Schimmelhemmender Putz").
 *  • Kalkmörtel als Hauptbaustoff der Römer, Bauten stehen seit rund zwei
 *    Jahrtausenden: antikewelt.de UND baustoffwissen.de.
 *
 * Bewusst NICHT übernommen: Formulierungen. Der Text ist eigene Verdichtung.
 * Der Zeichensatz bei n=22 gibt weder „Prozent" noch „Zement" noch „Wärme" her -
 * die Zahlen stehen darum als runde Marken, die Wärme als das, was man sieht.
 */
const DER_KALK: Serie = {
  slug: "der-kalk",
  titel: "Der Kalk",
  kind: "wissen-serie",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "technik",
  herkunft: {
    quelle:
      "Eigene Verdichtung nach Wikipedia (Technischer Kalkkreislauf, Dachsteinkalk) und Fachquellen des Kalkgewerbes",
    lizenz: "CC-BY-SA 4.0 (Ableitung; Danksagungs-Bereich)",
    autor:
      "Sensorik-Lernplattform; Grundlagen: Wikipedia-Autorinnen und -Autoren, Verband Naturkalk",
    fundstelle:
      "https://de.wikipedia.org/wiki/Technischer_Kalkkreislauf und https://www.verband-naturkalk.de/kalkkreislauf/ und https://de.wikipedia.org/wiki/Dachsteinkalk und https://www.nurkalk.de/glossar/alkalitaet (alle abgerufen 2026-08-16)",
  },
  etappen: [
    {
      lines: [
        "Kalkstein ist einer der ruhigsten Steine, die es gibt.",
        "Und sein Anfang ist einer der lautesten.",
        "Er stammt aus dem Meer.",
        "In warmen, seichten Meeren wachsen Riffe und Muscheln.",
        "Die Schalen sinken, wenn das Leben darin endet.",
        "Nach Jahrmillionen wird aus dem Schlamm am Grund ein Stein.",
        "Der Dachstein ist so ein Stein.",
        "Sein Kalk lag in der Trias in einer Lagune hinter einem Riff.",
        "Das ist mehr als hundert Millionen Jahre her.",
        "Wer heute hinauf geht, geht auf einem alten Meeresgrund.",
        "Manche Schichten des Gesteins sind dicht an Muscheln.",
        "Und alles daran wartet darauf, dass es jemand brennt.",
      ],
    },
    {
      lines: [
        "Kalk brennen kann man seit den ersten festen Mauern.",
        "Man schichtet den Stein in einen Ofen und feuert darunter.",
        "Es braucht mehr als neunhundert Grad, und es braucht Stunden.",
        "Bei dieser Glut geht dem Stein ein Gas aus.",
        "Es ist dasselbe Gas, das in jeder Luft steckt.",
        "Was im Ofen bleibt, ist leichter als das, was hineinkam.",
        "Man nennt es gebrannten Kalk.",
        "Er sieht harmlos aus: hell, staubig, ruhig.",
        "Er ist es nicht.",
        "Gebrannter Kalk hat Hunger auf Wasser.",
        "Wer ihn in der offenen Hand hat, hat einen Fehler gemacht.",
        "Denn dann kommt der Schritt, der alles entscheidet.",
      ],
    },
    {
      lines: [
        "Der Schritt hat einen Namen: löschen.",
        "Man gibt den gebrannten Kalk in Wasser.",
        "Und dann wartet man nicht lang.",
        "Der Kalk saugt das Wasser, und der Kessel wird sehr warm.",
        "Es kocht, es raucht, es steigt auf.",
        "Der Stein hat sein Gas gegen Wasser getauscht.",
        "Was im Kessel bleibt, nennen die Handwerker Löschkalk.",
        "Er kommt in eine Grube und er bleibt darin liegen.",
        "Ein Jahr ist gut, drei Jahre sind besser.",
        "Danach ist er weich wie Butter und ohne jedes Korn.",
        "Aus Löschkalk, Sand und Wasser wird Mörtel.",
        "Und der Mörtel geht diesen Weg nun wieder retour.",
      ],
    },
    {
      lines: [
        "Ein Mörtel aus Kalk trocknet nicht einfach fest.",
        "Er holt sich das Gas wieder, das im Ofen entkommen ist.",
        "Er holt es aus der Luft, Tag um Tag, durch die Wand.",
        "Dabei wird er, Korn um Korn, wieder Kalkstein.",
        "Man nennt es abbinden, und es hat kein Ende an einem Tag.",
        "Eine dicke Mauer arbeitet daran Jahre lang.",
        "Die Römer haben so gebaut, in Rom und an der Donau.",
        "Das Kolosseum hat es hinter sich; es steht.",
        "Frischer Kalk an der Wand ist scharf wie eine Lauge.",
        "Schimmel hat es darauf schwer, denn er mag es milder.",
        "Am Ende dieses Kreises steht wieder der Anfang.",
        "Ein Stein aus dem Meer, ein Feuer, ein Kessel, eine Wand.",
      ],
    },
  ],
};

/**
 * Sachtext für Erwachsene: Papier - von der Hand geschöpft bis in eine Maschine,
 * die schneller läuft, als ein Auto in der Stadt fahren darf.
 *
 * JEDE Sachaussage doppelt belegt:
 *  • Erfindung in China, Cai Lun, vor fast zweitausend Jahren (im Jahr 105), aus
 *    Bast, Hadern und alten Netzen: planet-wissen.de UND scinexx.de („Papier und
 *    Druck aus China").
 *  • Weg nach Europa: Papiermacherei in Bagdad um 795/800, in Spanien um 1100:
 *    planet-wissen.de UND zwischenbetrachtung.de.
 *  • Papiermaschine, Patent Louis-Nicolas Robert 1799; Arbeitsbreite etwa zwölf
 *    Meter, Länge mehr als hundert Meter, bis 2000 m/min: Wikipedia
 *    „Papiermaschine" UND papierundtechnik.de.
 *  • Feststoffgehalt am Stoffauflauf rund ein Prozent (also neunundneunzig
 *    Prozent Wasser), nach der Siebpartie rund ein Viertel: Wikipedia
 *    „Papiermaschine" UND papier-machen.de („Siebpartie").
 *  • Eine Faser hält etwa sieben Durchgänge aus: recyclehero.de UND
 *    papiermachtschule.at.
 *  • Sammlung in Österreich rund sechsundsiebzig Prozent, rund siebzig Kilo je
 *    Kopf und Jahr: twosides.info (Austria) UND containerdienst24.at.
 *
 * Der Zeichensatz bei n=26 kennt kein ü, kein ß, kein x, kein y - also kein
 * „für", kein „über", kein „groß", kein „heißt", kein „Zylinder" und keine Fünf
 * in irgendeiner Zahl. Alle Zahlen sind darum so gewählt, dass sie ohne die Fünf
 * auskommen.
 */
const DAS_PAPIER: Serie = {
  slug: "das-papier",
  titel: "Das Papier",
  kind: "wissen-serie",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: {
    quelle:
      "Eigene Verdichtung nach Wikipedia (Papiermaschine) und Fachquellen der Papierwirtschaft",
    lizenz: "CC-BY-SA 4.0 (Ableitung; Danksagungs-Bereich)",
    autor:
      "Sensorik-Lernplattform; Grundlagen: Wikipedia-Autorinnen und -Autoren, Papier macht Schule, Two Sides Austria",
    fundstelle:
      "https://de.wikipedia.org/wiki/Papiermaschine und https://www.papierundtechnik.de/papiertechnik/die-papiermaschine/ und https://www.planet-wissen.de/kultur/asien/china_weltmacht_im_umbruch/pwieporzellanpapierschiesspulverradwasstammtnichtauschina100.html und https://at.twosides.info/fsrecycling (alle abgerufen 2026-08-16)",
  },
  etappen: [
    {
      lines: [
        "Papier ist ein Stoff, den fast jeder täglich in der Hand hat.",
        "Ein Blatt davon ist ein Vlies aus winzigen Fasern.",
        "Die Fasern haken ineinander, sobald das Wasser weg ist.",
        "Mehr Geheimnis steckt nicht darin.",
        "In China hat man das vor fast zweitausend Jahren erkannt.",
        "Ein Mann am Hof, Cai Lun, hat das Verfahren aufgeschrieben.",
        "Er nahm Bast, alte Hadern und kaputte Netze.",
        "Das alles wurde zerstampft und in Wasser gelegt.",
        "Aus dem Brei hat man die Fasern mit einem Sieb geschöpft.",
        "Auf dem Sieb blieb ein nasses Vlies liegen.",
        "Gepresst und getrocknet war es ein Bogen.",
        "Genau dieser Handgriff arbeitet heute noch in jeder Fabrik.",
      ],
    },
    {
      lines: [
        "Der Weg nach Europa hat Jahrhunderte gedauert.",
        "In Bagdad stand eine Papiermacherei um achthundert.",
        "In Spanien kam die erste um elfhundert dazu.",
        "In Mitteleuropa arbeitete man erst im späten Mittelalter damit.",
        "Der Rohstoff war lange nicht das Holz, sondern der Lumpen.",
        "Alte Wäsche, alte Segel, alte Seile: alles kam in den Trog.",
        "Es gab Leute, die zogen nur wegen der Hadern von Haus zu Haus.",
        "Als das Lesen zunahm, reichten die Lumpen nicht mehr.",
        "Erst dann kam das Holz an die Reihe.",
        "Man kocht und mahlt es, damit die Fasern frei werden.",
        "Was dabei entsteht, nennt man Zellstoff.",
        "Und dann kam eine Maschine, die alles andere verschob.",
      ],
    },
    {
      lines: [
        "Der Franzose Robert bekam das Patent im Jahr siebzehnhundertneunundneunzig.",
        "Seine Idee war ein Sieb ohne Anfang und ohne Ende.",
        "Es lief als Band im Kreis, und der Brei lief darauf mit.",
        "Aus dem Schöpfen von Hand wurde ein Strom.",
        "Eine heutige Maschine ist mehr als hundert Meter lang.",
        "Ihre Bahn kann zwölf Meter breit sein.",
        "Am Anfang kommt der Brei aus einem Spalt auf das Sieb.",
        "Er ist dann noch zu rund neunundneunzig Prozent Wasser.",
        "Am Ende des Siebes ist immer noch drei Viertel Wasser darin.",
        "Walzen pressen, dann trocknen warme Trommeln den Rest.",
        "Die fertige Bahn rennt mit zweitausend Metern in der Minute.",
        "Das ist schneller, als ein Auto in der Stadt fahren darf.",
      ],
    },
    {
      lines: [
        "Papier ist der Werkstoff, der am ehesten im Kreis geht.",
        "Altpapier wird in Wasser wieder ein Brei.",
        "Man holt die Farbe heraus und siebt den Schmutz ab.",
        "Dann beginnt dasselbe Vlies noch einmal.",
        "Aber eine Faser hält das nicht ewig aus.",
        "Nach etwa sieben Durchgängen ist sie zu kurz.",
        "Sie geht dann im Sieb verloren oder wird zum Schlamm.",
        "Darum braucht der Kreis immer wieder frische Fasern.",
        "In Österreich kommen rund sechsundsiebzig Prozent in die Sammlung.",
        "Das sind etwa siebzig Kilo je Kopf und Jahr.",
        "Jeder Bogen darin ist ein Vlies aus Fasern, die haken.",
        "Und jede dieser Fasern stand einmal als Baum im Wald.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=31 - der lange Bogen dieser Charge: SECHS Etappen auf vollem Alphabet (das
// Modell erlaubt vier bis sechs). Eine Tischlerin richtet ein leeres Lokal her,
// findet unter dem Anstrich ein Wandbild und steht zwischen ihrer eigenen Frist,
// dem Hausherrn und dem Denkmalamt. Kein Museum am Ende, kein Triumph - ein
// Kompromiss, mit dem sie arbeiten kann.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_WAND: Serie = {
  slug: "die-wand",
  titel: "Die Wand",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Das Lokal steht seit neun Jahren leer, und das sieht man ihm an.",
        "Vesna hat es trotzdem genommen, weil die Miete niedrig ist.",
        "Sie ist Tischlerin und braucht endlich eine eigene Werkstatt.",
        "Im Vertrag steht ein Datum, an dem die erste Miete zu zahlen ist.",
        "Bis dahin sind es elf Wochen, und elf Wochen sind knapp.",
        "Der Boden ist gut, die Leitungen sind es nicht.",
        "Also fängt sie mit den Wänden an, weil dort der Strom liegt.",
        "Der alte Anstrich blättert schon von allein herunter.",
        "Sie schlägt ihn mit einem breiten Spachtel ab, Bahn für Bahn.",
        "Unter dem letzten Kalk kommt etwas heraus, das nicht weiß ist.",
        "Es ist ein Rot, ein tiefes, gebranntes Rot.",
        "Vesna legt den Spachtel weg und macht das große Licht an.",
      ],
    },
    {
      lines: [
        "In dieser Nacht arbeitet sie nur noch mit der Hand.",
        "Sie nimmt einen weichen Pinsel und einen Schwamm.",
        "Zuerst wird aus dem Rot ein Feld, dann ein Bogen.",
        "Dann kommt eine Hand heraus, die einen Hobel hält.",
        "Am Morgen steht ein halber Mann an der Wand ihrer Werkstatt.",
        "Er trägt eine Schürze und schaut nach links aus dem Bild.",
        "Vesna sitzt auf einer Kiste und schaut ihn eine Stunde lang an.",
        "Dann ruft sie nicht den Hausherrn an, sondern die Frau von oben.",
        "Frau Wiesinger ist vierundachtzig und wohnt hier seit ihrer Geburt.",
        "Sie kommt herunter, sieht die Wand und setzt sich sofort hin.",
        "In der unteren Ecke steht ein Name in dünnen Buchstaben.",
        "Frau Wiesinger liest ihn laut vor: Rudolf Halm.",
      ],
    },
    {
      lines: [
        "Am Montag ruft Vesna im Amt an, weil sie es für richtig hält.",
        "Zwei Wochen später steht Frau Kern vom Denkmalamt in der Werkstatt.",
        "Sie hat eine Lampe dabei, die das Licht flach über die Wand wirft.",
        "So sieht man jede Kante des alten Putzes.",
        "Das Bild ist in den Putz hinein gemalt, nicht darauf.",
        "Frau Kern nennt eine Jahreszahl aus der Zeit zwischen den Kriegen.",
        "Solche Bilder in kleinen Lokalen sind fast alle verloren, sagt sie.",
        "Dann sagt sie den Satz, der alles ändert.",
        "Ab jetzt darf hier nichts mehr abgeschlagen werden.",
        "Vesna denkt an ihre elf Wochen, von denen sechs weg sind.",
        "Am selben Abend klingelt das Telefon.",
        "Der Hausherr hat vom Amt gehört, und er ist nicht erfreut.",
      ],
    },
    {
      lines: [
        "Herr Prohaska kommt am nächsten Tag und bleibt an der Tür stehen.",
        "Er rechnet laut: ein Gutachten, eine Auflage, ein Jahr Verzug.",
        "Er sagt, er habe das Haus geerbt und nicht gesucht.",
        "Er sagt auch, er habe niemals von einem Bild gewusst.",
        "Vesna glaubt ihm das, und genau das macht es schwer.",
        "Er stellt sie vor eine einfache Rechnung.",
        "Entweder verschwindet die Sache, oder der Vertrag verschwindet.",
        "Sie fragt ihn, ob er sich das Bild wenigstens ansehen will.",
        "Er sieht es lange an und sagt danach kein Wort dazu.",
        "An der Tür dreht er sich um und nennt ihr eine Frist.",
        "Zwei Wochen, sagt er, dann will er eine Antwort.",
        "Vesna bleibt allein in einer Werkstatt ohne einen einzigen Auftrag.",
      ],
    },
    {
      lines: [
        "Sie sucht nach Rudolf Halm, weil ihr sonst nichts einfällt.",
        "Im Stadtarchiv findet sie ihn in einem Verzeichnis der Gewerbe.",
        "Er war Anstreicher, gemeldet in der Gasse hinter dem Haus.",
        "Keine Ausbildung als Maler, kein Verein, keine Ausstellung.",
        "Frau Wiesinger erinnert sich an ihn, als wäre es gestern.",
        "Er hat unten gemalt, wenn seine Arbeit oben fertig war.",
        "Meine Mutter hat ihm dafür das Essen hingestellt, sagt sie.",
        "Dann kam der Krieg, und danach hat ihn niemand mehr gesehen.",
        "Vesna macht Fotos von der Wand und schreibt alles auf.",
        "Sie schickt es an Frau Kern, ohne eine Bitte darunter.",
        "Drei Tage später ruft Frau Kern an und redet schnell.",
        "Es gibt einen Weg, sagt sie, aber er gefällt Ihnen nur halb.",
      ],
    },
    {
      lines: [
        "Der Weg besteht aus zwei Teilen, und beide tun ein wenig weh.",
        "Der größere Teil des Bildes wird vermessen und fotografiert.",
        "Dann bekommt er eine Trennschicht und darüber wieder Putz.",
        "Er bleibt an der Wand, nur eben unsichtbar, für später.",
        "Der Mann mit dem Hobel dagegen wird gefestigt und bleibt offen.",
        "Das Amt zahlt die Fachfirma, der Hausherr zahlt nichts.",
        "Herr Prohaska hört sich das an und unterschreibt am Ende doch.",
        "Die Werkstatt macht mit drei Monaten Verspätung auf.",
        "Der Mann an der Wand hängt jetzt über der Hobelbank.",
        "Kunden fragen manchmal, wer das gemalt hat, und bekommen den Namen.",
        "Frau Wiesinger kommt an jedem ersten Freitag im Monat herunter.",
        "Sie sagt nie etwas dazu, sie setzt sich nur eine Weile hin.",
      ],
    },
  ],
};

/** I1c-Serien (append-only an SERIEN gehängt). */
export const SERIEN_ERWACHSEN_FRUEH: readonly Serie[] = [
  DER_LADEN,
  DER_TUNNEL,
  DER_STURM,
  DER_KALK,
  DAS_PAPIER,
  DIE_WAND,
];
