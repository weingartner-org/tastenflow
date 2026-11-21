/**
 * Inhalt der fortlaufenden Texte (Textwelt „Ebene 2", TW-E3) — die konkreten
 * Geschichten-/Wissens-Serien + die Auswahl-Helfer der Bücherei „Geschichten &
 * Wissen". Das TYP-Modell steht in serie.ts, der Fortschritt (strikt linear, jede
 * Etappe genau einmal) im No-Repeat-Ledger (ledger.ts, `storyProgress`).
 *
 * TW-E3 liefert EINE Pilot-Serie (T2, 6 Etappen) zum End-to-End-Test der Engine.
 * Die Masse (TW-E10–E12) legt hier nur weitere `Serie`-Einträge an — additiv, das
 * Datenmodell und die Bücherei bleiben unverändert.
 *
 * Quellen-/Rechte-Regel (Bauplan §10): Die frühe Erstleser-Ebene (T0–T2) wird
 * SELBST verfasst — reale (auch gemeinfreie) Texte respektieren die
 * Buchstaben-Freischaltung nicht. Diese Pilot-Serie ist daher ein eigenes,
 * bewusst wortschatz-begrenztes Werk (nur T2-Zeichen: die Grundreihe + `e n i r t`
 * + `h o u c g m b w`; also OHNE p q v x y z ä ü ß und ohne Ziffern/Sonderzeichen).
 * Satzzeichen sind erlaubt (sie werden bis T4 beim Servieren weggelassen und
 * heben den `minTier` nicht — siehe tiers.ts/minTierFor). Kein fremdes Material,
 * keine Rechte-Pflichten.
 */
import type { Lang, Stufe } from "./account";
import { contentStufenFor } from "./account";
import { fitText, korpusFuer, fitsKeys, hatGrossbuchstaben, nurKleinschrift, passtLernweg, type Herkunft } from "./corpus";
import { SHIFT_UNIT, ensureIntroduced } from "./letters";
import { isStoryDone, storyStateFor } from "./ledger";
import type { TypingProgress } from "./progress";
import type { Serie } from "./serie";
import type { Lernweg } from "./lernweg";
import { kleinFuer } from "./sprachRegister";
import { serieEtappeCount, serieLines } from "./serie";
// ★★★ 28.09.2026: Die Serien-Listen kommen aus den SPRACHPAKETEN
// (`sprachpakete.ts`); ihre Reihenfolge in `SERIEN` legt `SERIEN_FOLGE` fest.
import { ALLE_SPRACHPAKETE, beiSprachpaket, fehlZugriff, sprachDaten, sprachpaketGeladen, sprachpaketeGeladen } from "./sprachpakete";

/**
 * Pilot-Serie „Filo und Mira" — eine sanfte Erstleser-Geschichte (T2) über einen
 * kleinen Hund und eine Maus, die einem verirrten Reh nach Hause helfen. Sechs
 * Etappen à 12 Zeilen, jede endet mit einem Zug zum Weiterschreiben. Bewusst
 * altersgerecht und nicht grausam (Bauplan §10). Wortschatz strikt auf T2-Zeichen
 * begrenzt (siehe Datei-Kopf) — der Test `typing-textwelt-serien` erzwingt das.
 */
const FILO_UND_MIRA: Serie = {
  slug: "filo-und-mira",
  titel: "Filo und Mira",
  kind: "geschichte",
  stufen: ["kids"], // I1b 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "tiere",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Filo ist ein kleiner Hund.",
        "Mira ist eine kleine Maus.",
        "Filo wohnt an einem See.",
        "Mira wohnt in einem Baum.",
        "Der Baum steht mitten im Wald.",
        "An einem Tag rennt Filo los.",
        "Er sucht etwas Feines.",
        "Da sieht er die kleine Maus.",
        "Hallo, ruft Filo laut.",
        "Mira lacht und rennt her.",
        "Kommst du mit, fragt sie.",
        "Und so rennen die beiden los.",
      ],
    },
    {
      lines: [
        "Die beiden laufen durch den Wald.",
        "Da wird es dunkel.",
        "Ein starker Wind kommt auf.",
        "Filo hat ein bisschen Furcht.",
        "Halt dich an mir fest, ruft Mira.",
        "Der Wind rauscht in dem Laub.",
        "Filo und Mira suchen ein Loch.",
        "Sie finden es unter dem Laub.",
        "Dort ist es warm und still.",
        "Sie hocken dicht beieinander.",
        "Bald schlummert der kleine Hund.",
        "Was der Morgen wohl bringt?",
      ],
    },
    {
      lines: [
        "Am Morgen ist der Wind fort.",
        "Die Sonne scheint warm herab.",
        "Filo hört ein leises Weinen.",
        "Hinter dem Laub hockt ein Reh.",
        "Es ist klein und ist allein.",
        "Bist du allein hier, fragt Mira.",
        "Das Reh nickt und ist traurig.",
        "Ich finde den Weg nicht mehr.",
        "Wir helfen dir, sagt Filo.",
        "Mira klettert weit nach oben.",
        "Sie schaut in die Ferne.",
        "Kommt mit, ich sehe den Weg!",
      ],
    },
    {
      lines: [
        "Das Reh freut sich riesig.",
        "Es rennt nun hinter Mira her.",
        "Der Weg geht durch hohes Gras.",
        "Bald kommen sie an einen Bach.",
        "Der Bach ist breit und tief.",
        "Wie kommen wir da ans andere Land?",
        "Filo sieht einen dicken Ast.",
        "Er schiebt ihn in den Bach.",
        "Nun liegt der Ast wie ein Steg.",
        "Das Reh traut sich als Erstes.",
        "Dann folgen Mira und Filo.",
        "Sie haben es fast geschafft!",
      ],
    },
    {
      lines: [
        "Hinter dem Bach wird es hell.",
        "Da liegt eine weite Lichtung.",
        "Das Reh bleibt erstaunt stehen.",
        "Ich kenne diesen Ort, ruft es.",
        "Hier hinten wohnt meine Mutter.",
        "Es rennt froh durch das Gras.",
        "Da steht ein starkes Reh und ruft.",
        "Es ist die Mutter, die es sucht!",
        "Sie reibt ihr Kind sehr sanft.",
        "Habt Dank, sagt sie, habt Dank!",
        "Filo und Mira freuen sich mit.",
        "Doch ihr Tag ist noch nicht aus.",
      ],
    },
    {
      lines: [
        "Filo und Mira laufen weiter.",
        "Der Weg wird ihnen nun bekannt.",
        "Da ist der See und da ist der Baum!",
        "Filo rennt froh an sein Ufer.",
        "Mira klettert in ihren Baum.",
        "Wie war der Tag, denkt Filo.",
        "Er war lang und er war schön.",
        "Wir haben dem Reh geholfen.",
        "Und wir sind nun gute Freunde.",
        "Mira ruft aus ihrem Baum herab.",
        "Bis morgen, lieber Filo!",
        "Und Filo bellt: Bis morgen, Mira!",
      ],
    },
  ],
};

/**
 * Erstleser-Serie „Anna und das Boot" (T2, TW-E10) — ein ruhiges Abenteuer: Anna
 * und Tom finden am See ein altes Boot, rudern hinaus, erleben einen kurzen Wind
 * und kommen sicher zurück. Vier Etappen à 12 Zeilen, sanft und nicht grausam.
 * Selbst verfasst, Wortschatz strikt auf T2-Zeichen (§10).
 */
const ANNA_UND_DAS_BOOT: Serie = {
  slug: "anna-und-das-boot",
  titel: "Anna und das Boot",
  kind: "geschichte",
  stufen: ["kids"], // I1b 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "abenteuer",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Anna und Tom gehen an den See.",
        "Die Sonne scheint warm und hell.",
        "Am Ufer liegt ein altes Boot.",
        "Das Boot ist rot und schon alt.",
        "Komm, wir schauen es uns an!",
        "Anna schaut in das Boot hinein.",
        "Es ist trocken und noch heil.",
        "Nur ein wenig Laub liegt darin.",
        "Tom holt die Ruder aus dem Gras.",
        "Wollen wir hinaus auf den See?",
        "Anna nickt und lacht dabei.",
        "Das wird ein schöner Tag!",
      ],
    },
    {
      lines: [
        "Anna und Tom steigen ins Boot.",
        "Tom rudert los, sehr sanft.",
        "Das Boot gleitet durch das Wasser.",
        "Kleine Wellen schaukeln das Boot.",
        "Anna schaut ins klare Wasser.",
        "Da schwimmt ein bunter Fisch!",
        "Sieh nur, ruft Anna sehr froh.",
        "Der Fisch ist schnell wieder fort.",
        "Am Himmel fliegt eine Ente.",
        "Sie landet nah an dem Boot.",
        "Tom macht eine kleine Rast.",
        "Wie weit rudern sie wohl hinaus?",
      ],
    },
    {
      lines: [
        "Auf einmal wird der Wind stark.",
        "Die Wellen werden immer höher.",
        "Das Boot schaukelt nun sehr wild.",
        "Anna klammert sich am Rand fest.",
        "Hab keine Angst, ruft Tom laut.",
        "Wir rudern schnell an das Ufer.",
        "Tom nimmt beide Ruder in die Hand.",
        "Anna hilft ihm, so gut sie kann.",
        // R2: „immer nah" verlangt den Komparativ „näher"; das ä ist im
        // T2-Zeichensatz dieser Serie gesperrt, darum ohne Steigerung gefasst.
        "Das Boot kommt dem Ufer nun sehr nah.",
        "Nur noch ein wenig, dann sind wir da!",
        "Endlich fasst Anna den Steg.",
        // R4 (Prüfbericht §6.2): Der Cliffhanger fragte, ob sie es bis ans Ufer
        // schaffen - eine Zeile NACH der Rettung. Die neue Frage bleibt offen,
        // bis die nächste Etappe sie beantwortet („Das Boot legt … sicher an.").
        // Kein großes I im Zeichensatz dieser Serie, darum „Kommt …".
        "Kommt das Boot nun sicher an?",
      ],
    },
    {
      lines: [
        // R2: das Verb war verrutscht („anlegen", nicht „ist … an").
        "Das Boot legt am Ufer sicher an.",
        "Anna und Tom steigen heraus.",
        "Der Wind wird langsam wieder ruhig.",
        "Die Sonne kommt neu heraus.",
        "Das war aufregend, sagt Tom!",
        "Anna nickt: Und schön war es auch.",
        "Sie holen das Boot an das Land.",
        "Dann ruhen sie sich im Gras aus.",
        "Der See liegt nun still und klar.",
        "Wir kommen bald wieder her!",
        "Anna und Tom sind gute Freunde.",
        "Was sie wohl morgen erleben?",
      ],
    },
  ],
};

/**
 * Abenteuer-Serie „Die Schatzkarte" (T3, TW-E11) — eine spannende, warmherzige
 * Geschichte für fortgeschrittene Tipper:innen (ganzes Alphabet): Lena und Ben
 * finden auf Opas Dachboden eine alte Schatzkarte und folgen ihr in den Wald. Der
 * „Schatz" ist am Ende eine Kiste mit Opas Kindheits-Erinnerungen — nicht Gold.
 * Fünf Etappen à 12 Zeilen, mit Cliffhangern; altersgerecht, nicht grausam.
 * Selbst verfasst (§10). Volles Alphabet (T3), keine Ziffern/Sonderzeichen.
 */
const DIE_SCHATZKARTE: Serie = {
  slug: "die-schatzkarte",
  titel: "Die Schatzkarte",
  kind: "geschichte",
  stufen: ["kids"], // I1b 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 3,
  topic: "abenteuer",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Lena und Ben sind bei Opa zu Besuch.",
        "Draußen regnet es den ganzen Tag.",
        "Dürfen wir auf den Dachboden?, fragt Lena.",
        "Opa nickt: Aber seid vorsichtig!",
        "Oben ist es staubig und dunkel.",
        "Überall stehen alte Kisten herum.",
        "Ben entdeckt eine kleine Flasche.",
        "In der Flasche steckt ein Zettel.",
        "Vorsichtig ziehen sie ihn heraus.",
        "Es ist eine alte, vergilbte Karte.",
        "Ein rotes Kreuz markiert eine Stelle.",
        "Was, wenn hier ein Schatz versteckt ist?",
      ],
    },
    {
      lines: [
        "Die Karte zeigt Opas alten Garten.",
        "Lena erkennt den großen Apfelbaum.",
        "Vom Baum führt ein Pfad zum Zaun.",
        "Dahinter liegt der kleine Wald.",
        "Wir müssen dem Pfad genau folgen.",
        "Am nächsten Morgen scheint die Sonne.",
        "Die Kinder packen einen Rucksack.",
        "Brote, Äpfel und eine Flasche Saft.",
        "Leise schleichen sie aus dem Haus.",
        "Opa soll noch nichts davon wissen.",
        "Der Wald ist frisch und still.",
        "Wohin führt der geheime Pfad bloß?",
      ],
    },
    {
      lines: [
        "Der Pfad schlängelt sich durch Farne.",
        "Vögel zwitschern hoch in den Zweigen.",
        "Bald teilt sich der Weg in zwei.",
        "Welche Richtung ist die richtige?",
        "Lena schaut noch einmal auf die Karte.",
        "Nach dem Bach nach links, liest sie vor.",
        "Sie hören schon das Wasser rauschen.",
        "Über den Bach führt ein schmaler Steg.",
        "Ben balanciert vorsichtig hinüber.",
        "Plötzlich knackt ein Ast ganz laut.",
        "Die Kinder bleiben erschrocken stehen.",
        "Wer oder was war das im Gebüsch?",
      ],
    },
    {
      lines: [
        "Aus dem Gebüsch springt ein Reh.",
        "Puh, nur ein Reh!, lacht Ben erleichtert.",
        "Das Reh schaut kurz und hüpft davon.",
        "Die beiden atmen tief durch.",
        "Vor ihnen liegt eine kleine Lichtung.",
        "In der Mitte steht ein alter Baumstumpf.",
        "Genau hier zeigt die Karte das Kreuz!",
        "Sie graben mit den Händen im Moos.",
        "Ihre Finger stoßen auf etwas Hartes.",
        "Es ist eine kleine, rostige Kiste.",
        "Das Herz klopft ihnen bis zum Hals.",
        "Was mag wohl darin verborgen sein?",
      ],
    },
    {
      lines: [
        "Behutsam öffnen sie den Deckel.",
        "Doch es glänzt kein Gold darin.",
        "In der Kiste liegen alte Fotos.",
        "Sie zeigen einen kleinen Jungen.",
        "Der Junge sieht aus wie Opa als Kind!",
        "Dazwischen steckt ein kurzer Brief.",
        "Für den, der dies findet, steht darauf.",
        "Bewahre die schönen Erinnerungen gut.",
        "Die Kinder rennen zurück zu Opa.",
        "Opas Augen werden feucht vor Freude.",
        "Das war mein Versteck als Kind!, ruft er.",
        "Der schönste Schatz ist eine Erinnerung.",
      ],
    },
  ],
};

/**
 * Wissens-Serie „Der Weg des Wassers" (T3, TW-E12) — der Wasserkreislauf in vier
 * zusammenhängenden Kapiteln (Wasser überall → Verdunstung/Wolken → Regen/Schnee
 * → Flüsse/Meer/Kreislauf), interessant und kohärent erzählt statt isolierter
 * Fakten (`kind: "wissen-serie"`, 💡). Jede Zeile ist elementar und unstrittig wahr
 * (Faktencheck-Gate, [[feedback_aussagen_dreifach_pruefen]]). Selbst formuliert
 * (§10). Volles Alphabet (T3), keine Ziffern.
 */
const DER_WEG_DES_WASSERS: Serie = {
  slug: "der-weg-des-wassers",
  titel: "Der Weg des Wassers",
  kind: "wissen-serie",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Wasser gibt es fast überall auf der Welt.",
        "Die großen Meere sind randvoll davon.",
        "Auch Flüsse und Seen führen Wasser.",
        "Sogar in den Wolken ist Wasser.",
        "Pflanzen und Tiere brauchen es zum Leben.",
        "Auch dein Körper besteht viel aus Wasser.",
        "Ohne Wasser könnte nichts wachsen.",
        "Wasser kann flüssig sein, wie im See.",
        "Es kann fest werden, als Eis und Schnee.",
        "Und es kann als Dampf in die Luft steigen.",
        "Wasser ist also ständig in Bewegung.",
        "Aber wie kommt das Wasser in die Wolken?",
      ],
    },
    {
      lines: [
        "Die Sonne scheint warm auf das Meer.",
        "Dabei wird das Wasser oben ganz warm.",
        "Ein Teil wird zu unsichtbarem Dampf.",
        "Diesen Vorgang nennt man Verdunstung.",
        "Der warme Dampf steigt langsam nach oben.",
        "Hoch oben in der Luft ist es kalt.",
        "Dort wird der Dampf wieder zu Tröpfchen.",
        "Ganz viele Tröpfchen bilden eine Wolke.",
        "Wolken sind also aus Wasser gemacht.",
        "Der Wind schiebt die Wolken über das Land.",
        "Immer mehr Tröpfchen sammeln sich an.",
        "Was passiert, wenn die Wolke zu schwer wird?",
      ],
    },
    {
      lines: [
        "Wird eine Wolke schwer, so fällt Regen.",
        "Die Tröpfchen sind dann zu groß geworden.",
        "Sie fallen als Regen auf die Erde herab.",
        "Ist es sehr kalt, fällt Schnee statt Regen.",
        "Der Regen macht die Wiesen und Felder nass.",
        "Pflanzen saugen das Wasser mit den Wurzeln.",
        "So können Bäume und Blumen wachsen.",
        "Ein Teil des Regens sickert in den Boden.",
        "Tief unten sammelt sich das Grundwasser.",
        "Daraus gewinnen wir unser Trinkwasser.",
        "Ein anderer Teil fließt oben wieder ab.",
        "Wohin fließt dieses Wasser wohl?",
      ],
    },
    {
      lines: [
        "Das Wasser fließt in viele kleine Bäche.",
        "Viele Bäche werden zu einem Fluss.",
        "Der Fluss fließt weiter und wird breit.",
        "Am Ende mündet er ins große Meer.",
        "Und im Meer beginnt alles von vorn.",
        "Die Sonne wärmt das Wasser wieder auf.",
        "Erneut steigt Dampf in die Höhe.",
        "Wieder bilden sich Wolken am Himmel.",
        "Und wieder fällt irgendwo Regen herab.",
        "Dieser ewige Weg heißt Wasserkreislauf.",
        "Das Wasser geht also niemals verloren.",
        "Es wandert nur immer wieder im Kreis.",
      ],
    },
  ],
};

/**
 * Wissens-Serie „Ein Jahr im Wald" (T3, TW-E12-Nachlage) — die vier Jahreszeiten
 * im Wald in vier Kapiteln (Frühling → Sommer → Herbst → Winter), als
 * zusammenhängende Naturbeobachtung erzählt. Jede Zeile ist elementar und
 * unstrittig wahr. Selbst formuliert (§10). Volles Alphabet (T3), keine Ziffern.
 */
const EIN_JAHR_IM_WALD: Serie = {
  slug: "ein-jahr-im-wald",
  titel: "Ein Jahr im Wald",
  kind: "wissen-serie",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Im Frühling erwacht der Wald aus dem Schlaf.",
        "Die Tage werden wieder länger und wärmer.",
        "An den Zweigen sprießen grüne Knospen.",
        "Bald tragen die Bäume ein frisches Kleid.",
        "Überall blühen die ersten bunten Blumen.",
        "Die Vögel kehren aus dem Süden zurück.",
        "Sie bauen ihre Nester in den Ästen.",
        "Bald piepsen darin hungrige Junge.",
        "Der Fuchs führt seine Welpen aus dem Bau.",
        "Bienen summen von Blüte zu Blüte.",
        "Der ganze Wald ist voller neuem Leben.",
        "Doch was bringt der warme Sommer?",
      ],
    },
    {
      lines: [
        "Im Sommer steht der Wald in sattem Grün.",
        "Die Sonne scheint warm durch die Blätter.",
        "Am Boden ist es kühl und schattig.",
        "Süße Beeren reifen an den Sträuchern.",
        "Rehe suchen im Dickicht Schutz vor der Hitze.",
        "Am Bach trinken die durstigen Tiere.",
        "Schmetterlinge tanzen über die Lichtung.",
        "Der Specht klopft an einen morschen Stamm.",
        "Nachts rufen die Käuze im Dunkeln.",
        "Ein Gewitter bringt kühlen, frischen Regen.",
        "Danach duftet der ganze Wald würzig.",
        "Doch bald färben sich die ersten Blätter.",
      ],
    },
    {
      lines: [
        "Im Herbst wird der Wald bunt und golden.",
        "Die Blätter leuchten rot, gelb und braun.",
        "Ein kühler Wind weht durch die Kronen.",
        "Bald segeln die Blätter sanft zu Boden.",
        "Eichhörnchen sammeln fleißig ihre Nüsse.",
        "Sie verstecken Vorräte für den Winter.",
        "Der Igel frisst sich rund und dick.",
        "Pilze wachsen im feuchten, weichen Moos.",
        "Zugvögel sammeln sich zu großen Schwärmen.",
        "Gemeinsam fliegen sie in den warmen Süden.",
        "Es wird still und langsam kälter.",
        "Wie überstehen die Tiere den Winter?",
      ],
    },
    {
      lines: [
        "Im Winter ruht der Wald unter dem Schnee.",
        "Die Bäume sind nun kahl und still.",
        "Eine weiße Decke liegt über dem Boden.",
        "Der Igel hält tief im Laub seinen Schlaf.",
        "Manche Tiere halten einen langen Winterschlaf.",
        "Andere suchen im Schnee nach Futter.",
        "Rehe knabbern an Rinde und Zweigen.",
        "Vögel picken Körner an einer Futterstelle.",
        // R4 (Prüfbericht §6.1): „ihrem Bau" hing an den Vögeln der Zeile davor.
        // Der Bau bekommt seinen Bewohner.
        "Im Bau der Füchse ist es warm und geschützt.",
        "Tief unter der Erde warten die Wurzeln.",
        "Sie träumen schon vom nächsten Frühling.",
        "Und bald beginnt das Jahr von vorn.",
      ],
    },
  ],
};


/**
 * Erstleser-Serie „Bruno backt Brot" (Textwelt, wiederholbare Charge §9) — eine
 * warmherzige T2-Geschichte über einen kleinen Igel, der Brot backt und es mit
 * den Waldtieren teilt; als sein Ofen kalt wird, helfen ihm die Freunde. Fünf
 * Etappen à 12 Zeilen, jede mit Zug zum Weiterlesen, nicht grausam (§10). Selbst
 * verfasst; Wortschatz strikt auf T2-Zeichen begrenzt (Grundreihe + `e n i r t`
 * + `h o u c g m b w`; OHNE p q v x y z ä ü ß). `typing-textwelt-serien` erzwingt
 * die Grenze (deklarierter == berechneter minTier).
 */
const BRUNO_BACKT_BROT: Serie = {
  slug: "bruno-backt-brot",
  titel: "Bruno backt Brot",
  kind: "geschichte",
  stufen: ["kids"], // I1b 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "freundschaft",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Bruno ist ein kleiner Igel.",
        "Er wohnt am Rand des Waldes.",
        "Bruno backt am liebsten Brot.",
        "Am Morgen macht er einen Teig.",
        "Er nimmt Mehl und klares Wasser.",
        "Dann knetet er lange und fest.",
        "Der Teig wird weich und rund.",
        "Bruno legt ihn in eine Form.",
        "Im warmen Ofen wird das Brot braun.",
        "Es duftet weit durch den Wald.",
        "Wer riecht den feinen Duft schon?",
        "Bruno lacht und wartet ab.",
      ],
    },
    {
      lines: [
        "Als Erstes kommt die kleine Maus.",
        "Sie hat den Duft gerochen.",
        "Guten Morgen, ruft sie froh.",
        "Riecht es hier nicht fein?",
        "Bruno nickt und macht das Tor auf.",
        "Komm herein, sagt er leise.",
        "Bald kommt auch der braune Hase.",
        "Dann kommt ein Rotkehlchen her.",
        "Alle warten an dem Tisch.",
        "Bruno teilt sein warmes Brot.",
        "Jeder bekommt ein gutes Teil.",
        "Wie gut das allen schmeckt!",
      ],
    },
    {
      lines: [
        "An dem neuen Tag regnet es sehr.",
        "Ein kalter Wind fegt durch den Wald.",
        "Brunos Ofen wird kalt und leer.",
        "Kein Brot, kein Duft, kein Feuer.",
        "Bruno ist traurig und still.",
        "Da tönt es leise an dem Tor.",
        "Es sind die Tiere aus dem Wald.",
        "Wir helfen dir, rufen sie.",
        "Die Maus bringt trockenes Reisig.",
        "Der Hase bringt einen Sack Mehl.",
        "Das Rotkehlchen singt ein Lied.",
        "So wird es warm im kleinen Haus.",
      ],
    },
    {
      lines: [
        "Nun backen alle miteinander.",
        "Bruno macht wieder einen Teig.",
        "Die Maus hilft und knetet mit.",
        "Der Hase holt das klare Wasser.",
        "Das Feuer knistert hell und warm.",
        "Bald wird das Brot wieder braun.",
        "Es duftet durch das kleine Haus.",
        "Alle Tiere lachen und singen.",
        "Bruno ist nicht mehr traurig.",
        "Geteiltes Brot schmeckt am besten.",
        "Das findet der kleine Igel auch.",
        "So endet ein schöner Tag.",
      ],
    },
    {
      lines: [
        "Am Morgen wacht Bruno froh auf.",
        "Die Sonne scheint in sein Haus.",
        "Er denkt an seine guten Freunde.",
        "Ohne sie ist Backen halb so schön.",
        "Bruno macht schnell einen Teig.",
        "Er backt ein richtig dickes Brot.",
        "Dann bringt er es in den Wald.",
        "Er ruft die Tiere alle her.",
        "Kommt, es gibt frisches Brot!",
        "Alle rennen froh herbei.",
        "Gemeinsam schmeckt es am besten.",
        "So haben sie es gern im Wald.",
      ],
    },
  ],
};

/**
 * Wissens-Serie „Das Leben der Bienen" (Textwelt, wiederholbare Charge §9,
 * `kind: "wissen-serie"` 💡) — vier zusammenhängende Kapitel: Körper der Biene,
 * das Volk mit Königin und Aufgaben, Nektar und Honig, Bestäubung und der
 * Schwänzeltanz. Jede Zeile ist elementar und unstrittig wahr (Faktencheck-Gate,
 * [[feedback_aussagen_dreifach_pruefen]]; die tragenden Aussagen — Biene hat sechs
 * Beine und vier Flügel; der Tanz zeigt Richtung und Weg zur Nahrung — wurden gegen
 * Fachquellen geprüft, siehe §11). Selbst formuliert (§10). Volles Alphabet (T3),
 * keine Ziffern. Vier Kapitel à 12 Zeilen.
 */
const DAS_LEBEN_DER_BIENEN: Serie = {
  slug: "das-leben-der-bienen",
  titel: "Das Leben der Bienen",
  kind: "wissen-serie",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Die Biene ist ein kleines Insekt.",
        "Sie hat sechs Beine und vier Flügel.",
        "Ihr Körper ist gelb und schwarz.",
        "Bienen können sehr gut fliegen.",
        "Am Kopf hat die Biene zwei Fühler.",
        "Mit den Fühlern riecht und tastet sie.",
        "Bienen leben nicht allein.",
        "Viele Bienen wohnen zusammen.",
        "Ihr Zuhause nennt man einen Stock.",
        "In einem Stock leben viele tausend Bienen.",
        "So ein Volk hält fest zusammen.",
        "Jede Biene hat ihre Aufgabe.",
      ],
    },
    {
      lines: [
        "In jedem Stock lebt eine Königin.",
        "Sie ist die Mutter aller Bienen.",
        "Die Königin legt sehr viele Eier.",
        "Aus den Eiern werden neue Bienen.",
        "Die meisten Bienen sind Arbeiterinnen.",
        "Sie sammeln Futter und bauen.",
        "Andere Bienen pflegen die Eier.",
        "Wieder andere halten den Stock sauber.",
        "Die Männchen heißen Drohnen.",
        "Alle Bienen arbeiten für das Volk.",
        "Keine Biene lebt nur für sich.",
        "So bleibt das ganze Volk gesund.",
      ],
    },
    {
      lines: [
        "Bienen fliegen von Blüte zu Blüte.",
        "Dort finden sie süßen Nektar.",
        "Nektar ist ein süßer Saft.",
        "Die Biene saugt ihn mit dem Rüssel.",
        "Sie trägt den Nektar in den Stock.",
        "Dort machen die Bienen daraus Honig.",
        "Den Honig lagern sie in Waben.",
        "Waben sind aus feinem Wachs.",
        "Jede Wabe hat sechs Ecken.",
        "Im Winter ist der Honig ihr Vorrat.",
        "So haben die Bienen immer Futter.",
        "Auch der Mensch mag den süßen Honig.",
      ],
    },
    {
      lines: [
        "Bienen sind für die Natur sehr wichtig.",
        "An jeder Blüte bleibt Blütenstaub kleben.",
        "Diesen Staub nennt man auch Pollen.",
        "Die Biene trägt ihn zur nächsten Blüte.",
        "So werden die Blüten bestäubt.",
        "Erst dann können Früchte wachsen.",
        "Viele Pflanzen brauchen die Bienen.",
        "Findet eine Biene viele Blüten, tanzt sie.",
        "Mit dem Tanz zeigt sie den Weg.",
        "Die anderen Bienen folgen dem Tanz.",
        "Dann fliegen alle zu den Blüten.",
        "So hilft eine Biene der ganzen Welt.",
      ],
    },
  ],
};


/**
 * Abenteuer-Serie „Das Licht in der Höhle" (Textwelt, wiederholbare Charge §9) —
 * eine spannende T3-Geschichte mit Cliffhangern: Jaro und Lena entdecken eine
 * Höhle voller leuchtender Kristalle, verlaufen sich und werden von der
 * freundlichen Fledermaus Fips wieder hinausgeführt. Fünf Etappen à 12 Zeilen,
 * jede endet mit Zug zum Weiterlesen; wunderbar statt grausam (§10, selbst
 * verfasst). Volles Alphabet (T3), keine Ziffern. `typing-textwelt-serien`
 * erzwingt deklarierter == berechneter minTier.
 */
const DAS_LICHT_IN_DER_HOEHLE: Serie = {
  slug: "das-licht-in-der-hoehle",
  titel: "Das Licht in der Höhle",
  kind: "geschichte",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "abenteuer",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Jaro und Lena wandern durch den Wald.",
        "Der Weg führt steil den Berg hinauf.",
        "Plötzlich sehen sie einen dunklen Spalt.",
        "Hinter dem Spalt liegt eine Höhle.",
        "Wollen wir hineingehen, fragt Jaro.",
        "Lena nickt, doch ihr Herz klopft schnell.",
        "Vorsichtig treten sie in das Dunkel.",
        "Die Luft ist kühl und ganz still.",
        "Ihre Schritte hallen von den Wänden.",
        "Nur ein schmaler Lichtstrahl fällt herein.",
        "Was mag wohl tiefer in der Höhle sein?",
        "Mutig gehen die beiden weiter.",
      ],
    },
    {
      lines: [
        "Der Gang wird enger und dunkler.",
        "Lena tastet sich an der Wand entlang.",
        "Da schimmert vor ihnen ein sanftes Licht.",
        "Sie folgen dem seltsamen Schein.",
        "Der Gang öffnet sich zu einem Saal.",
        "An den Wänden glitzern viele Kristalle.",
        "Sie leuchten blau und grün und rot.",
        "Wie schön, flüstert Lena ganz leise.",
        "Der ganze Saal funkelt wie ein Traum.",
        "Jaro traut seinen Augen kaum.",
        "Doch dann hören sie ein leises Flattern.",
        "Etwas bewegt sich über ihren Köpfen.",
      ],
    },
    {
      lines: [
        "Erschrocken bleiben die beiden stehen.",
        "Aus dem Dunkel kommt ein kleiner Schatten.",
        "Es ist eine Fledermaus mit weichen Flügeln.",
        "Habt keine Angst, piepst sie freundlich.",
        "Ich heiße Fips und wohne hier im Berg.",
        "Die Kinder staunen über das kleine Tier.",
        "Eine Fledermaus, die sprechen kann!",
        "Fips flattert dicht vor ihnen her.",
        "Ihr habt euch sicher verlaufen, sagt sie.",
        "Kommt, ich zeige euch den Weg hinaus.",
        // R4 (Prüfbericht §6.4): Fips ist eine Fledermaus, keine Maus - die
        // Kurzform macht aus ihr ein anderes Tier (Zeile davor: „Eine
        // Fledermaus, die sprechen kann!").
        "Dankbar folgen Jaro und Lena der Fledermaus.",
        "Doch der Rückweg ist weit und dunkel.",
      ],
    },
    {
      lines: [
        "Fips fliegt sicher durch die engen Gänge.",
        "Ihre feinen Ohren hören jeden Laut.",
        "So findet sie den Weg auch im Dunkeln.",
        "An einer Kreuzung hält sie kurz inne.",
        "Hier müsst ihr nach links gehen, sagt sie.",
        "Bald spüren die Kinder frische Luft.",
        "Vor ihnen wird es langsam wieder heller.",
        "Am Ende des Ganges liegt der Ausgang.",
        "Die Sonne blendet sie für einen Moment.",
        "Geschafft, ruft Jaro ganz erleichtert.",
        "Lena umarmt die kleine Fledermaus sanft.",
        "Habt Dank, du hast uns den Weg gezeigt.",
      ],
    },
    {
      lines: [
        "Draußen singen die Vögel im Wald.",
        "Fips blinzelt im hellen Tageslicht.",
        "Ich muss zurück in mein Dunkel, sagt sie.",
        "Doch ihr dürft mich gern wieder besuchen.",
        "Die Kinder versprechen es ihr ganz fest.",
        "Wir bringen dir das nächste Mal Obst.",
        "Fips freut sich und flattert leise davon.",
        "Langsam steigen die beiden den Berg hinab.",
        "Die Taschen sind leer, das Herz ist voll.",
        "Was für ein Abenteuer, sagt Lena froh.",
        "Und niemand wird uns das je glauben.",
        "Lachend laufen sie nach Hause zurück.",
      ],
    },
  ],
};

/**
 * Wissens-Serie „Vom Korn zum Brot" (Textwelt, wiederholbare Charge §9,
 * `kind: "wissen-serie"` 💡) — vier zusammenhängende Kapitel: Getreide auf dem
 * Feld, Ernte & Mühle, Teig & Hefe, Ofen & Brot. Jede Zeile ist elementar und
 * unstrittig wahr (Faktencheck-Gate, [[feedback_aussagen_dreifach_pruefen]];
 * die tragenden Schritte — Mähdrescher trennt Korn vom Stroh, die Mühle mahlt
 * Mehl, Hefe bildet Gasblasen und lässt den Teig aufgehen — gegen Fachquellen
 * geprüft, siehe §11). Selbst formuliert (§10). Volles Alphabet (T3), keine
 * Ziffern. Vier Kapitel à 12 Zeilen.
 */
const VOM_KORN_ZUM_BROT: Serie = {
  slug: "vom-korn-zum-brot",
  titel: "Vom Korn zum Brot",
  kind: "wissen-serie",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Unser Brot beginnt auf dem Feld.",
        "Dort wächst das Getreide in der Sonne.",
        "Weizen und Roggen sind solche Getreide.",
        "Aus einem Korn wächst ein hoher Halm.",
        "Ganz oben sitzt die volle Ähre.",
        "In der Ähre stecken viele Körner.",
        "Regen und Sonne lassen die Körner reifen.",
        "Im Sommer wird das Feld golden gelb.",
        "Dann sind die Körner hart und reif.",
        "Nun kann die Ernte beginnen.",
        "Der Bauer hat lange darauf gewartet.",
        "Bald holt er die Körner vom Feld.",
      ],
    },
    {
      lines: [
        "Zur Ernte fährt ein großer Mähdrescher.",
        "Diese Maschine schneidet die Halme ab.",
        "Zugleich trennt sie die Körner heraus.",
        "Das Stroh bleibt auf dem Feld liegen.",
        "Die Körner kommen in einen Wagen.",
        "Von dort fahren sie zur Mühle.",
        "In der Mühle mahlen schwere Steine.",
        "Sie zerreiben die Körner ganz fein.",
        "So entsteht aus den Körnern Mehl.",
        "Das Mehl ist weich und weiß wie Staub.",
        "Nun kann der Bäcker es gebrauchen.",
        "Aus Mehl wird bald ein frisches Brot.",
      ],
    },
    {
      lines: [
        "Der Bäcker braucht Mehl, Wasser und Salz.",
        "Auch etwas Hefe gehört dazu.",
        "Er mischt alles in einer großen Schüssel.",
        "Dann knetet er den Teig sehr lange.",
        "Der Teig wird glatt und weich.",
        "Nun muss der Teig eine Weile ruhen.",
        "Die Hefe macht den Teig langsam größer.",
        "Er geht auf und wird schön locker.",
        "Kleine Blasen bilden sich in dem Teig.",
        "Danach formt der Bäcker die Laibe.",
        "Er legt sie auf ein großes Blech.",
        "Jetzt fehlt nur noch die Hitze.",
      ],
    },
    {
      lines: [
        "Der Ofen ist schon richtig heiß.",
        "Der Bäcker schiebt die Laibe hinein.",
        "In der Hitze bäckt der Teig langsam.",
        "Seine Kruste wird braun und knusprig.",
        "Ein guter Duft strömt durch die Backstube.",
        "Die Hitze macht das Brot fest und gar.",
        "Nach einer Weile ist das Brot fertig.",
        "Der Bäcker holt es aus dem heißen Ofen.",
        "Vorsichtig, denn es ist noch sehr heiß.",
        "Am Morgen liegt es frisch im Laden.",
        "Vom Korn bis zum Brot war es ein weiter Weg.",
        "Nun schmeckt uns jede Scheibe doppelt gut.",
      ],
    },
  ],
};

/**
 * Alle Serien der Bücherei (append-only; TW-E10–E12 + Nachlagen §9 hängen hier
 * weitere an). Die Reihenfolge bestimmt die Anzeige in der Bücherei.
 */

/**
 * Erstleser-Serie „Der rote Hut" (Textwelt, wiederholbare Charge §9) — eine
 * warmherzige T2-Geschichte: Der Wind trägt Mias roten Hut davon, Hase, Reh und
 * Eichhorn helfen ihr suchen und holen ihn aus dem Baum; am Ende ein kleines Fest.
 * Vier Etappen à 12 Zeilen, Zug zum Weiterlesen, nicht grausam (§10, selbst
 * verfasst). Wortschatz strikt T2 (ohne p q v x y z ä ü ß).
 */
const DER_ROTE_HUT: Serie = {
  slug: "der-rote-hut",
  titel: "Der rote Hut",
  kind: "geschichte",
  stufen: ["kids"], // I1b 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "tiere",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Mia hat einen roten Hut.",
        "Den Hut mag sie sehr gern.",
        "Heute weht ein starker Wind.",
        "Da hebt der Wind ihr den Hut hoch.",
        "Er wirbelt hoch in die Luft.",
        "Mia rennt so schnell sie kann.",
        "Doch der Hut fliegt immer weiter.",
        "Bald ist er hinter dem Wald fort.",
        "Mia bleibt stehen und ist traurig.",
        "Wo ist nur mein schöner Hut?",
        "Sie sucht und sucht im weiten Wald.",
        "Doch der Hut ist nicht mehr da.",
      ],
    },
    {
      lines: [
        "Da kommt ein kleiner Hase daher.",
        "Was ist los, fragt er Mia leise.",
        "Ich finde meinen Hut nicht mehr.",
        "Der Hase denkt einen Moment nach.",
        "Ich helfe dir beim Suchen, sagt er.",
        "So laufen die beiden durch den Wald.",
        "Sie schauen hinter jeden Baum.",
        "Sie schauen unter jeden Strauch.",
        "Doch der rote Hut ist nicht da.",
        "Da hören sie ein leises Rascheln.",
        "Etwas bewegt sich in dem Laub.",
        "Wer mag da wohl im Laub sein?",
      ],
    },
    {
      lines: [
        "Es ist ein kleines braunes Reh.",
        "Hast du etwas Rotes gesehen?",
        "Das Reh nickt und deutet nach oben.",
        "Dort oben in dem hohen Baum!",
        "Mia schaut nach oben und lacht.",
        "Da ist ihr Hut hoch im Baum.",
        "Doch der Baum ist sehr hoch.",
        "Wie kommt der Hut nur herunter?",
        "Da klettert ein Eichhorn den Stamm hoch.",
        "Es holt den Hut mit den Krallen.",
        "Langsam bringt es ihn nach unten.",
        "Mia freut sich riesig und lacht.",
      ],
    },
    {
      lines: [
        "Danke, ruft Mia allen Tieren.",
        "Ohne euch bliebe er dort oben.",
        "Der Hase und das Reh sind froh.",
        "Auch das Eichhorn macht ein Rad.",
        "Nun hat Mia den Hut wieder auf.",
        "Sie fasst ihn nun mit der Hand fest.",
        "Kommt, wir feiern das im Wald.",
        "Mia holt ihr Brot aus der Tasche.",
        "Sie teilt es mit den guten Freunden.",
        "Alle hocken im weichen Moos.",
        "So wird aus dem Tag im Wind ein Fest.",
        "Und Mia denkt noch lange daran.",
      ],
    },
  ],
};

/**
 * Wissens-Serie „Tag und Nacht" (Textwelt, wiederholbare Charge §9,
 * `kind: "wissen-serie"` 💡) — vier zusammenhängende Kapitel: der Wechsel von Tag
 * und Nacht, warum (die Erde dreht sich), die Sonne bleibt an ihrem Ort, Mond &
 * Sterne. Jede Zeile ist elementar und unstrittig wahr (Faktencheck-Gate,
 * [[feedback_aussagen_dreifach_pruefen]]): Erde = Kugel, dreht sich in etwa
 * vierundzwanzig Stunden einmal um sich selbst; die sonnenzugewandte Seite hat
 * Tag; der Mond hat kein eigenes Licht, sondern wirft das Sonnenlicht zurück;
 * Sterne sind ferne Sonnen, die das Tageslicht überdeckt (Schulwissen). Selbst
 * formuliert (§10). Volles Alphabet (T3), keine Ziffern. Vier Kapitel à 12 Zeilen.
 */
const TAG_UND_NACHT: Serie = {
  slug: "tag-und-nacht",
  titel: "Tag und Nacht",
  kind: "wissen-serie",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "weltall",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Jeden Tag geht die Sonne auf.",
        "Am Morgen wird es langsam hell.",
        "Am Abend geht die Sonne unter.",
        "Dann wird es draußen wieder dunkel.",
        "So wechseln sich Tag und Nacht ab.",
        "Doch warum ist das eigentlich so?",
        "Die Erde ist eine riesige Kugel.",
        "Auf ihr leben wir alle zusammen.",
        "Die Erde dreht sich ganz langsam.",
        "Sie dreht sich um sich selbst.",
        "Diese Drehung merken wir gar nicht.",
        "Und doch bringt sie den Tag und die Nacht.",
      ],
    },
    {
      lines: [
        "Die Sonne steht weit weg im All.",
        "Sie leuchtet hell und wärmt uns.",
        // „Immer nur eine Seite" las sich wie eine feste Nachtseite (Prüfbericht
        // 27.07., Teil 1.2); „Gerade jetzt" macht daraus die Momentaufnahme, die
        // die folgenden Zeilen dann auflösen.
        "Gerade jetzt schaut nur eine Seite der Erde zur Sonne.",
        "Auf dieser Seite ist heller Tag.",
        "Die andere Seite liegt im Schatten.",
        "Dort ist zur gleichen Zeit Nacht.",
        "Weil die Erde sich dreht, ändert sich das.",
        "Langsam dreht sich unser Ort zum Licht.",
        "So beginnt bei uns der neue Morgen.",
        "Später dreht er sich wieder ins Dunkel.",
        "Für eine ganze Drehung braucht die Erde einen Tag.",
        "Das sind etwa vierundzwanzig Stunden.",
      ],
    },
    {
      lines: [
        "Von der Erde aus gesehen wandert die Sonne.",
        "Doch dabei steht sie selbst ganz still.",
        "Nur die Erde dreht sich vor ihr.",
        "Darum sieht es aus, als ziehe die Sonne.",
        "Am Morgen scheint sie von der einen Seite.",
        "Am Abend sinkt sie auf der anderen.",
        "In Wahrheit drehen wir uns mit der Erde.",
        "Das ist ein kleines Wunder der Natur.",
        "Auch der Mond leuchtet in der Nacht.",
        "Doch der Mond hat kein eigenes Licht.",
        "Er wirft nur das Licht der Sonne zurück.",
        "Darum sehen wir ihn hell am Himmel.",
      ],
    },
    {
      lines: [
        "Manchmal ist er rund wie ein Teller.",
        "Manchmal ist von ihm nur ein Streifen da.",
        "Neben dem Mond stehen viele Sterne.",
        "Sterne sind ferne Sonnen, sehr weit weg.",
        "Am Tag sehen wir sie nicht.",
        "Das helle Sonnenlicht deckt sie zu.",
        "Erst in der dunklen Nacht treten sie hervor.",
        "So hat jede Zeit ihren eigenen Reiz.",
        "Der Tag ist hell und voller Leben.",
        "Die Nacht ist still und ruhig.",
        "Beide gehören fest zusammen.",
        "Und morgen geht die Sonne wieder auf.",
      ],
    },
  ],
};


/**
 * Erstleser-Serie „Ben findet ein Ei" (Textwelt, wiederholbare Charge §9) — eine
 * warmherzige T2-Geschichte: Ben findet ein Ei im Wald, hält es warm, ein kleines
 * Entenkind schlüpft, und er bringt es zur echten Entenmama am Teich zurück.
 * Vier Etappen à 12 Zeilen, Zug zum Weiterlesen, nicht grausam (§10, selbst
 * verfasst). Wortschatz strikt T2 (ohne p q v x y z ä ü ß).
 */
const BEN_FINDET_EIN_EI: Serie = {
  slug: "ben-findet-ein-ei",
  titel: "Ben findet ein Ei",
  kind: "geschichte",
  stufen: ["kids"], // I1b 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "tiere",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Ben geht am Morgen in den Wald.",
        "Er sucht schöne Steine im Moos.",
        "Da liegt im Gras ein kleines Ei.",
        "Es ist hell und sehr glatt.",
        "Wo kommt das kleine Ei nur her?",
        "Ben schaut sich um, doch da ist niemand.",
        "Fast will er das Ei in die Hand nehmen.",
        "Dann denkt er an das, was Frau Ada sagt:",
        "Ein Ei im Wald bleibt liegen, wo es liegt.",
        "Die Eltern sind meist nicht weit weg.",
        "Ben merkt sich den Ort und holt Hilfe.",
        "Was wohl aus dem Ei einmal wird?",
      ],
    },
    {
      lines: [
        "Frau Ada kennt sich mit Tieren gut aus.",
        "Sie geht mit Ben noch einmal in den Wald.",
        "Leise bleiben beide hinter einem Baum.",
        "Jeden Tag schauen sie einmal nach dem Ei.",
        "Sie reden dabei immer leise.",
        "Werd nur schön gesund, sagt Ben.",
        "So gehen einige Tage ins Land.",
        "Da hört Ben ein feines Ticken.",
        "Das Ei bewegt sich hin und her.",
        "Ein feiner Riss geht durch die Schale.",
        "Ben schaut mit offenem Mund hin.",
        "Was kommt da wohl heraus?",
      ],
    },
    {
      lines: [
        // R4 (Prüfbericht §6.3): Frau Ada verschwand nach Etappe 2 spurlos und
        // Ben versorgte das Küken allein - damit brach die Geschichte ihre
        // eigene Regel („Ein Ei im Wald bleibt liegen"). Sie bleibt nun dabei.
        "Frau Ada und Ben sehen die Schale aufbrechen.",
        "Ein kleiner Schnabel schaut heraus.",
        "Dann kommt ein kleines nasses Tier heraus.",
        "Es ist ein kleines Entenkind.",
        "Leise ruft das kleine Tier nach Ben.",
        "Ben lacht und freut sich sehr.",
        "Hallo, kleine Ente, sagt er sanft.",
        "Die Ente sieht Ben mit runden Augen an.",
        "Sie denkt wohl, er sei die Mama.",
        "Frau Ada gibt ihr Wasser und etwas Korn.",
        "Die kleine Ente trinkt und frisst.",
        "Bald watschelt sie ihm hinterher.",
      ],
    },
    {
      lines: [
        "Doch Ben denkt an die echte Mama.",
        "Die Ente gehört an den nahen Teich.",
        "Am Ufer sucht Ben lange nach ihr.",
        "Da schwimmt eine Ente mit Kindern.",
        "Sie ruft nach ihrem kleinen Kind.",
        "Ben bringt das Entlein ans Wasser.",
        // R2: „nach der Mama schwimmen" ist keine deutsche Fügung; „der Mama
        // nachschwimmen" schon. Das z aus „zur Mama" fehlt dieser Serie.
        "Es schwimmt froh der Mama nach.",
        "Die Entenmama freut sich sehr.",
        "Ben winkt dem kleinen Tier noch nach.",
        "Leb wohl, kleine Ente, ruft er.",
        "Ein wenig traurig, doch auch froh.",
        "So ein Tag bleibt lange in Erinnerung.",
      ],
    },
  ],
};

/**
 * Wissens-Serie „Die Ameisen" (Textwelt, wiederholbare Charge §9,
 * `kind: "wissen-serie"` 💡) — vier zusammenhängende Kapitel: Körper der Ameise,
 * der Ameisenbau & die Aufgaben, wie sich Ameisen über Duftspuren verständigen,
 * ihr Nutzen im Wald. Jede Zeile ist elementar und unstrittig wahr (Faktencheck-
 * Gate, [[feedback_aussagen_dreifach_pruefen]]; tragende Aussagen gegen Fachquellen
 * geprüft, siehe §11): Insekt mit sechs Beinen, zwei Fühlern, Körper in drei Teilen;
 * trägt ein Vielfaches des eigenen Gewichts; legt eine Duftspur, der die anderen
 * folgen; der Specht frisst Ameisen. Selbst formuliert (§10). Volles Alphabet (T3),
 * keine Ziffern. Vier Kapitel à 12 Zeilen.
 */
const DIE_AMEISEN: Serie = {
  slug: "die-ameisen",
  titel: "Die Ameisen",
  kind: "wissen-serie",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Die Ameise ist ein winziges Insekt.",
        "Sie hat sechs Beine und zwei Fühler.",
        "Ihr Körper ist in drei Teile geteilt.",
        "Ameisen sind sehr klein, aber stark.",
        "Eine Ameise trägt viel mehr als sich selbst.",
        "Am Kopf hat sie kräftige Kiefer.",
        "Damit packt und trägt sie ihre Last.",
        "Ameisen leben niemals ganz allein.",
        "Sie wohnen in einem großen Volk.",
        "Ein Volk hat oft viele tausend Tiere.",
        "Ihr Nest nennt man einen Bau.",
        "Viele Bauten sehen aus wie ein Hügel.",
      ],
    },
    {
      lines: [
        "Der Hügel ist aus Nadeln und Erde.",
        "Tief darin liegen viele kleine Gänge.",
        "In dem Bau ist es warm und sicher.",
        "Jede Ameise hat eine feste Aufgabe.",
        "Die meisten sind fleißige Arbeiterinnen.",
        "Sie suchen Futter und bauen am Nest.",
        "Andere pflegen die kleinen Larven.",
        "In der Mitte lebt eine Königin.",
        "Sie legt die Eier für das ganze Volk.",
        "Aus den Eiern werden neue Ameisen.",
        "So bleibt das Volk immer lebendig.",
        "Ameisen helfen sich stets gegenseitig.",
      ],
    },
    {
      lines: [
        "Findet eine Ameise viel Futter, holt sie Hilfe.",
        "Auf dem Weg legt sie eine Duftspur.",
        "Die anderen folgen dieser feinen Spur.",
        "So finden viele Ameisen den gleichen Weg.",
        "Mit den Fühlern riechen und tasten sie.",
        "Über den Duft sprechen die Tiere miteinander.",
        "Gemeinsam tragen sie schwere Beute heim.",
        "Ein Körnchen wird von vielen bewegt.",
        "Auch im Wald sind Ameisen sehr nützlich.",
        "Sie räumen totes Holz und Reste weg.",
        "Dabei lockern sie ganz nebenbei die Erde.",
        "Viele Tiere fressen gern die Ameisen.",
      ],
    },
    {
      lines: [
        "Der Specht hackt sie aus dem morschen Holz.",
        "Ein Ameisenbau ist ein reges Treiben.",
        "Von früh bis spät wird dort geschuftet.",
        "Niemand ruht sich lange faul aus.",
        "Und doch klappt alles wie von selbst.",
        "Denn jede Ameise tut ihren Teil.",
        "So schafft das kleine Volk sehr viel.",
        "Wer genau hinsieht, kann lange staunen.",
        "Ein Ameisenhügel steckt voller Leben.",
        "Man sollte ihn niemals zerstören.",
        "Die Tiere sind wichtig für den Wald.",
        "Darum lassen wir sie ruhig arbeiten.",
      ],
    },
  ],
};


/**
 * Abenteuer-Serie „Das Geheimnis im alten Turm" (Textwelt, wiederholbare Charge
 * §9) — eine warme T3-Entdeckungsgeschichte mit Cliffhangern: Jana und Milo
 * erkunden einen alten Turm, finden eine Spieldose und alte Briefe und lernen die
 * kluge Eule kennen, die dort wohnt und die Geschichte des Turms erzählt. Vier
 * Etappen à 12 Zeilen, Zug zum Weiterlesen, nicht grausam (§10, selbst verfasst).
 * Volles Alphabet (T3), keine Ziffern. `typing-textwelt-serien` erzwingt die Grenze.
 */
const DAS_GEHEIMNIS_IM_ALTEN_TURM: Serie = {
  slug: "das-geheimnis-im-alten-turm",
  titel: "Das Geheimnis im alten Turm",
  kind: "geschichte",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "abenteuer",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Am Rand des Dorfes steht ein alter Turm.",
        "Seit vielen Jahren geht dort niemand hin.",
        "Jana und Milo sind furchtbar neugierig.",
        "Was mag sich hinter der Tür verbergen?",
        "Eines Tages fassen sie sich ein Herz.",
        "Die schwere Tür knarrt beim Öffnen laut.",
        "Drinnen ist es dämmrig und ganz kühl.",
        "Staub tanzt in einem schmalen Lichtstrahl.",
        "Vor ihnen führt eine Wendeltreppe empor.",
        "Vorsichtig steigen die beiden nach oben.",
        "Jede Stufe ächzt unter ihren Schuhen.",
        "Was erwartet sie wohl ganz oben?",
      ],
    },
    {
      lines: [
        "Nach vielen Stufen sind sie außer Atem.",
        "Oben liegt eine kleine runde Kammer.",
        "Durch ein Fenster fällt weiches Licht.",
        "An den Wänden hängen alte Bilder.",
        "In der Ecke steht eine staubige Truhe.",
        "Milo hebt langsam den schweren Deckel.",
        "Darin liegt eine kunstvolle Spieldose.",
        "Daneben ruht ein Bündel alter Briefe.",
        "Plötzlich raschelt es über ihren Köpfen.",
        "Erschrocken schauen die beiden nach oben.",
        "Auf einem Balken sitzt eine große Eule.",
        "Sie blickt die Kinder mit runden Augen an.",
      ],
    },
    {
      lines: [
        "Habt keine Furcht, ich wohne nur hier.",
        "Die Kinder staunen über die kluge Eule.",
        "Dieser Turm hat eine schöne Geschichte.",
        "Hier lebte einst ein freundlicher Musiker.",
        "Er spielte für das ganze Dorf zum Tanz.",
        "Die Spieldose war sein liebstes Stück.",
        "Milo dreht behutsam den kleinen Schlüssel.",
        "Da erklingt eine zarte, alte Weise.",
        "Die Töne schweben durch die stille Kammer.",
        "Jana schließt für einen Moment die Augen.",
        "Es ist, als lebe der Turm wieder auf.",
        "Als die Musik endet, ist es ganz still.",
      ],
    },
    {
      lines: [
        "Wir sollten den Turm nicht vergessen.",
        "Die Kinder wischen den Staub von der Truhe.",
        "Von nun an kommen sie oft hierher.",
        "Sie bringen der Eule manchmal etwas mit.",
        "Und immer dreht Milo die Spieldose auf.",
        "So wird der alte Turm ein Ort voll Leben.",
        "Ihr Geheimnis teilen sie mit niemandem.",
        "Doch die Eule hütet es treu mit ihnen.",
        "Manchmal hört man abends leise Musik.",
        "Dann lächeln die Leute unten im Dorf.",
        "Denn sie ahnen, wer dort oben spielt.",
        "Und der Turm steht nie mehr ganz allein.",
      ],
    },
  ],
};

/**
 * Wissens-Serie „Die Spinne" (Textwelt, wiederholbare Charge §9,
 * `kind: "wissen-serie"` 💡) — vier zusammenhängende Kapitel: was eine Spinne ist,
 * ihr Faden & das Netz, wie sie Beute fängt, ihr Nutzen. Jede Zeile ist elementar
 * und unstrittig wahr (Faktencheck-Gate, [[feedback_aussagen_dreifach_pruefen]];
 * tragende Aussagen gegen Fachquellen geprüft, siehe §11): kein Insekt, sondern
 * Spinnentier mit ACHT Beinen und Körper aus zwei Teilen; sie stellt Seide selbst
 * her; klebrige Netzfäden fangen die Beute, die sie in Seide einwickelt; nicht
 * jede Spinne baut ein Netz. Selbst formuliert (§10). Volles Alphabet (T3), keine
 * Ziffern. Vier Kapitel à 12 Zeilen.
 */
const DIE_SPINNE: Serie = {
  slug: "die-spinne",
  titel: "Die Spinne",
  kind: "wissen-serie",
  stufen: ["kids"], // I1 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Die Spinne ist kein Insekt.",
        "Sie ist ein echtes Spinnentier.",
        "Eine Spinne hat acht Beine.",
        "Ein Insekt hat dagegen nur sechs.",
        "Daran erkennt man die Spinne gut.",
        "Ihr Körper hat nur zwei Teile.",
        "Viele Spinnen haben mehrere Augen.",
        "Trotzdem sehen die meisten eher schlecht.",
        "Dafür spüren sie feinste Bewegungen.",
        "Spinnen gibt es fast überall auf der Welt.",
        "Manche sind winzig, andere recht groß.",
        "Doch fast alle sind für uns harmlos.",
      ],
    },
    {
      lines: [
        "Das Besondere an der Spinne ist ihr Faden.",
        "Sie stellt den Faden selbst im Körper her.",
        "Aus feinen Öffnungen zieht sie die Seide.",
        "Der Faden ist dünn, aber sehr reißfest.",
        "Viele Spinnen weben daraus ein Netz.",
        "Geduldig spannen sie Faden um Faden.",
        "So entsteht ein feines, rundes Netz.",
        "Ein Teil der Fäden ist richtig klebrig.",
        "Daran bleibt die Beute hängen.",
        "Die Spinne selbst kennt die trockenen Wege.",
        "Darum klebt sie im eigenen Netz nicht fest.",
        "Morgens glitzert das Netz oft im Tau.",
      ],
    },
    {
      lines: [
        "Die Spinne wartet geduldig am Rand.",
        "Fliegt eine Mücke ins Netz, zappelt sie.",
        "Das Zappeln lässt die Fäden zittern.",
        "So merkt die Spinne, dass etwas da ist.",
        "Blitzschnell eilt sie zur Beute.",
        "Sie wickelt die Mücke fest in Seide ein.",
        "Nun kann das Insekt nicht mehr fort.",
        "Später verspeist die Spinne ihre Beute in Ruhe.",
        "Nicht jede Spinne baut sich ein Netz.",
        "Manche jagen und lauern am Boden.",
        "Sie springen ihre Beute einfach an.",
        "Auch das ist ein kluger, alter Trick.",
      ],
    },
    {
      lines: [
        "Spinnen fressen sehr viele Insekten.",
        "Vor allem Fliegen und Mücken gehen ins Netz.",
        "Ohne Spinnen gäbe es viel mehr davon.",
        "Darum sind Spinnen für uns nützlich.",
        "Auch im Garten leisten sie gute Arbeit.",
        "Man muss vor ihnen keine Angst haben.",
        "Die meisten fliehen lieber vor uns.",
        "Findest du ein Netz, schau es dir genau an.",
        "Aber lass die Spinne ruhig gewähren.",
        "Sie tut dir nichts und ist sehr fleißig.",
        "Ein Spinnennetz ist ein kleines Wunder.",
        "So viel Kunst steckt in dem feinen Tier.",
      ],
    },
  ],
};


/**
 * Erstleser-Serie „Der kleine Schneemann" (Textwelt, wiederholbare Charge §9) —
 * warmherzige T2-Winter-Geschichte: Timo baut mit Freunden einen Schneemann und
 * dann einer frierenden Meise ein Dach mit Futter; am Morgen ist der Vogel wohlauf.
 * Vier Etappen à 12 Zeilen, nicht grausam (§10, selbst verfasst). Wortschatz T2.
 */
const DER_KLEINE_SCHNEEMANN: Serie = {
  slug: "der-kleine-schneemann",
  titel: "Der kleine Schneemann",
  kind: "geschichte",
  stufen: ["kids"], // I1 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "winter",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Im Winter kommt dicker Schnee.",
        "Timo rennt froh in den Schnee.",
        "Der Hof ist nun tief und still.",
        "Komm, wir bauen einen Schneemann!",
        "Timo ruft seine Freunde herbei.",
        "Sie rollen drei dicke Kugeln aus Schnee.",
        "Die kleinste kommt hoch nach oben.",
        "Der Schneemann hat nun eine feine Form.",
        "Doch es fehlen noch die Augen.",
        "Was macht man da wohl? Timo denkt nach.",
        "Bald hat er eine gute Idee.",
        "Kommt mit ins Haus, ruft er den andern.",
      ],
    },
    {
      lines: [
        "Timo holt harte Kohlen aus dem Korb.",
        "Die Kohlen werden nun die Augen.",
        "Eine Möhre steckt als Nase mitten drin.",
        "Aus Steinen macht er einen Mund.",
        "Der Schneemann lacht nun breit und froh.",
        "Ein alter Hut kommt oben auf ihn drauf.",
        "Um den Hals legt Timo einen Schal.",
        "Nun sieht er richtig fein aus.",
        "Die Kinder laufen froh um ihn herum.",
        "Wie schön unser Schneemann ist!",
        "Sie freuen sich und lachen laut.",
        "Doch was ist das? Wer ruft da so?",
      ],
    },
    {
      lines: [
        "Auf dem Ast hockt eine kleine Meise.",
        "Sie friert und macht sich klein.",
        "Der Meise ist es so richtig kalt.",
        "Das arme Tier tut Timo sehr leid.",
        "Wir sollten ihr schnell helfen!",
        "Die Kinder holen kleine Reiser.",
        "Daraus bauen sie ein kleines Dach.",
        "Sie stellen es neben den Schneemann.",
        "Dann streuen sie Krumen und Korn.",
        "Die Meise kommt und frisst sich satt.",
        "Unter dem Dach ist sie nun sicher.",
        "Leise singt sie den Kindern ein Lied.",
      ],
    },
    {
      lines: [
        "Am Abend gehen alle ins warme Haus.",
        "Der Schneemann steht wach im Mondlicht.",
        // R2: man ruht UNTER einem Dach, nicht in ihm (Z. davor: „Unter dem
        // Dach ist sie nun sicher.").
        "Die Meise ruht unter ihrem kleinen Dach.",
        "Der Mond scheint hell auf den weiten Hof.",
        "Alles liegt still und tief im Schnee.",
        "Am Morgen rennt Timo als Erster raus.",
        "Der Schneemann lacht noch immer breit.",
        "Auf seinem Hut hockt froh die Meise.",
        "Sie hat die kalte Nacht heil geschafft.",
        "Timo freut sich und streut noch mehr Korn.",
        "So hilft ein Schneemann sogar den Tieren.",
        "Und Timo hat einen neuen Freund im Hof.",
      ],
    },
  ],
};

/**
 * Wissens-Serie „Vom Ei zum Schmetterling" (💡, wiederholbare Charge §9) — vier
 * Kapitel: Ei & Raupe, Verpuppung, Schlüpfen, Leben & Kreislauf. Elementar wahr
 * (Faktencheck-Gate, [[feedback_aussagen_dreifach_pruefen]], gegen Fachquellen geprüft,
 * §11): vier Formen Ei→Raupe→Puppe→Falter; Raupe frisst & häutet sich; in der Puppe
 * baut sich der Körper um; der Falter pumpt Saft in die weichen Flügel und trocknet
 * sie; er trinkt Nektar mit dem Rüssel und trägt Pollen. Selbst formuliert (§10), T3.
 */
const VOM_EI_ZUM_SCHMETTERLING: Serie = {
  slug: "vom-ei-zum-schmetterling",
  titel: "Vom Ei zum Schmetterling",
  kind: "wissen-serie",
    // S3: Grundschul-Sachkunde - Johannes 29.07.: »Regenwurm und Maikaefer
  // kann auch fuer 11-Jaehrige schon peinlich sein.« Bleibt bei kids.
stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Der Schmetterling ist ein zartes Tier.",
        "Doch am Anfang sieht er ganz anders aus.",
        "Alles beginnt mit einem winzigen Ei.",
        "Ein Falter legt es an ein grünes Blatt.",
        "Oft klebt es fest an der Unterseite.",
        "Nach einigen Tagen tut sich etwas.",
        "Aus dem Ei schlüpft eine kleine Raupe.",
        "Die Raupe hat nur einen großen Hunger.",
        "Tag und Nacht frisst sie an dem Blatt.",
        "So wird sie schnell dicker und länger.",
        "Wird ihre Haut zu eng, streift sie sie ab.",
        "Darunter wartet schon eine neue Haut.",
      ],
    },
    {
      lines: [
        "Nach einer Weile hört die Raupe auf.",
        "Sie sucht sich einen sicheren Ort.",
        "An einem Zweig hängt sie sich fest.",
        "Dann verwandelt sie sich in eine Puppe.",
        "Um sich herum bildet sie eine feste Hülle.",
        "Von außen wirkt die Puppe ganz still.",
        "Doch in ihrem Inneren tut sich sehr viel.",
        "Der ganze Körper baut sich völlig um.",
        "Aus der Raupe wird nun ein Falter.",
        "Das dauert oft viele Tage oder Wochen.",
        "Endlich platzt die Hülle langsam auf.",
        "Vorsichtig kriecht der Falter heraus.",
      ],
    },
    {
      lines: [
        "Am Anfang sind die Flügel klein und weich.",
        "Er pumpt Saft in die zarten Flügel.",
        "Langsam werden sie groß und fest.",
        "Der Falter wartet, bis sie trocken sind.",
        "Dann schlägt er zum ersten Mal die Flügel.",
        "Ganz sanft hebt er sich in die Luft.",
        "Nun kann der Schmetterling endlich fliegen.",
        "Er sucht die schönsten Blüten im Garten.",
        "Mit einem langen Rüssel trinkt er Nektar.",
        "Von Blüte zu Blüte trägt er den Pollen.",
        "So hilft er den Pflanzen ganz nebenbei.",
        "Ein Schmetterling lebt oft nur kurze Zeit.",
      ],
    },
    {
      lines: [
        "Doch er nutzt jeden sonnigen Tag.",
        "Bald sucht ein Weibchen ein gutes Blatt.",
        "Dort legt es seine eigenen kleinen Eier.",
        "Und alles beginnt von vorne mit dem Ei.",
        "Vier Formen hat der Falter also gehabt.",
        "Erst das Ei, dann die hungrige Raupe.",
        "Dann die stille Puppe an dem Zweig.",
        "Und zuletzt der Falter in der Luft.",
        "Diese Reise nennt man Verwandlung.",
        "Sie ist ein kleines Wunder der Natur.",
        "Wer eine Raupe sieht, denke daran.",
        "In ihr steckt schon ein bunter Falter.",
      ],
    },
  ],
};


/**
 * Erstleser-Serie „Lena und der kleine Fisch" (Textwelt, wiederholbare Charge §9) —
 * eine warmherzige T2-Geschichte: Lena rettet einen im Schlamm gestrandeten Fisch
 * zurück ins tiefe Wasser und besucht ihn fortan jeden Tag. Vier Etappen à 12
 * Zeilen, Zug zum Weiterlesen, nicht grausam (§10, selbst verfasst). Wortschatz T2.
 */
const LENA_UND_DER_KLEINE_FISCH: Serie = {
  slug: "lena-und-der-kleine-fisch",
  titel: "Lena und der kleine Fisch",
  kind: "geschichte",
  stufen: ["kids"], // I1b 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "tiere",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Lena geht am Morgen an den Teich.",
        "Die Sonne scheint warm auf das Wasser.",
        "Am Ufer wachsen hohe Halme.",
        "Lena hockt sich ins weiche Gras.",
        "Da sieht sie im Schlamm etwas Helles.",
        "Es schimmert und bewegt sich schwach.",
        "Lena schaut nun sehr genau nach.",
        "Es ist ein kleiner silberner Fisch.",
        "Er liegt im Schlamm und braucht Wasser.",
        "Der Teich ist hier fast trocken.",
        "Dem armen Fisch geht es sehr schlecht.",
        "Schnell, ich will dir helfen!",
      ],
    },
    {
      lines: [
        "Lena nimmt den Fisch sehr sanft hoch.",
        "Er ist glatt und nass in ihrer Hand.",
        "Halt durch, kleiner Fisch, sagt sie.",
        "Sie eilt an den tiefen Teil des Teichs.",
        "Dort ist das Wasser klar und tief.",
        "Sanft gibt sie den Fisch ins Wasser.",
        "Erst liegt er still und wartet ab.",
        "Lena schaut nur gebannt hin.",
        "Dann bewegt der Fisch die Flossen.",
        "Er dreht sich und schwimmt langsam los.",
        "Lena lacht und ist so froh.",
        "Schwimm nur, kleiner Fisch, schwimm!",
      ],
    },
    {
      lines: [
        "Der Fisch wird schnell wieder munter.",
        "Er saust durch das klare Wasser.",
        "Bald kommen andere Fische her.",
        "Sie umkreisen den kleinen Fisch.",
        "Es sieht aus, als ob sie ihn kennen.",
        "Sind das wohl seine Freunde?",
        "Der kleine Fisch schwimmt in die Mitte.",
        "Nun ist er nicht mehr so allein.",
        "Lena schaut dem Treiben lange nach.",
        "Wie gut, dass ich hier war, denkt sie.",
        "Ohne mich ginge es ihm sehr schlecht.",
        "So ein kleiner Fisch macht richtig Freude.",
      ],
    },
    {
      lines: [
        "Am andern Tag kommt Lena wieder her.",
        "Futter aus dem Laden hat sie dabei.",
        "Die Fische kommen sofort ans Ufer.",
        "Auch der kleine Fisch ist wieder da.",
        "Er kennt Lena wohl schon richtig gut.",
        "Sie streut ein wenig ins klare Wasser.",
        "Die Fische kommen froh herbei.",
        "Lena kommt nun jeden Tag hierher.",
        "Der Teich ist ihr liebster Ort.",
        "Der kleine Fisch ist nun ihr Freund.",
        "Manchmal winkt sie ihm sogar leise.",
        "Und er schnellt froh hoch aus dem Nass.",
      ],
    },
  ],
};

/**
 * Wissens-Serie „Der Regenwurm" (Textwelt, wiederholbare Charge §9,
 * `kind: "wissen-serie"` 💡) — vier Kapitel: Körper & Sinne, wie er den Boden
 * bearbeitet, sein Leben (Regen, Sonne, Feinde, Regenerations-Irrglaube), sein
 * Nutzen. Elementar wahr (Faktencheck-Gate, [[feedback_aussagen_dreifach_pruefen]],
 * gegen Fachquellen geprüft, §11): keine Beine/keine Augen, aber licht- und
 * feuchtigkeitsempfindliche Zellen; geringelter Körper mit Borsten; frisst sich
 * durch die Erde und macht daraus humusreiche Erde, die Gänge lüften den Boden;
 * durchtrennt entstehen NICHT zwei Würmer (nur der Kopfteil kann nachwachsen).
 * Selbst formuliert (§10). Volles Alphabet (T3), keine Ziffern. Vier Kapitel à 12.
 */
const DER_REGENWURM: Serie = {
  slug: "der-regenwurm",
  titel: "Der Regenwurm",
  kind: "wissen-serie",
    // S3: Grundschul-Sachkunde - Johannes 29.07.: »Regenwurm und Maikaefer
  // kann auch fuer 11-Jaehrige schon peinlich sein.« Bleibt bei kids.
stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Der Regenwurm lebt tief in der Erde.",
        "Sein Körper ist lang, dünn und weich.",
        "Er hat keine Beine und keine Augen.",
        "Trotzdem findet er gut seinen Weg.",
        "Der Wurm fühlt jede kleine Wärme.",
        "Auch Licht und Nässe spürt er genau.",
        "Sein Körper hat sehr viele Ringe.",
        "An den Ringen sitzen winzige Borsten.",
        "Mit ihnen hält er sich in der Erde fest.",
        "So schiebt er sich durch den Boden vor.",
        "Der Regenwurm gräbt lange Gänge.",
        "Dabei frisst er sich durch die Erde.",
      ],
    },
    {
      lines: [
        "Er frisst alte Blätter und Reste.",
        "Diese Reste zersetzt er in seinem Bauch.",
        "Hinten kommt lockere gute Erde heraus.",
        "Diese Erde nennt man wertvollen Humus.",
        "In ihr wachsen die Pflanzen besonders gut.",
        "Darum ist der Wurm ein guter Helfer.",
        "Seine Gänge lassen Luft in den Boden.",
        "Auch das Wasser fließt darin nach unten.",
        "So bleibt die Erde locker und gesund.",
        "Ein Garten voller Würmer ist ein guter Garten.",
        "Bei Regen kommt der Wurm oft nach oben.",
        "Dann kriecht er über den nassen Boden.",
      ],
    },
    {
      lines: [
        "Auf dem feuchten Weg trocknet er nicht aus.",
        "So wandert er sicher ein Stück weiter.",
        "Doch die Sonne mag der Wurm gar nicht.",
        "Sein feiner Körper trocknet schnell aus.",
        "Darum ist er lieber nachts unterwegs.",
        "Am Tag bleibt er tief unten im Kühlen.",
        "Viele Tiere fressen den Regenwurm gern.",
        "Ein Vogel zieht ihn aus dem Boden.",
        "Auch der Maulwurf jagt tief nach ihm.",
        "Verliert der Wurm sein Hinterteil, wächst es nach.",
        "Doch ganz durchtrennt stirbt auch der Wurm.",
        "Zwei Würmer werden daraus also nicht.",
      ],
    },
    {
      lines: [
        "Das ist nur ein alter Irrglaube.",
        "Der Regenwurm ist wichtig für uns alle.",
        "Ohne ihn wäre der Boden hart und tot.",
        "Er arbeitet still und ganz im Verborgenen.",
        "Kaum jemand sieht ihm bei der Arbeit zu.",
        "Und doch tut er der Erde jeden Tag gut.",
        "Wer im Garten gräbt, findet ihn bald.",
        "Leg ihn dann sanft zurück in die Erde.",
        "Denn dort gehört der fleißige Wurm hin.",
        "So dankst du ihm für seine gute Arbeit.",
        "Ein kleiner Wurm, und doch so nützlich.",
        "Nun weißt du, was er alles kann.",
      ],
    },
  ],
};


/**
 * Erstleser-Serie „Lisas Laterne" (Textwelt, wiederholbare Charge §9) — eine warme
 * T2-Herbst-Geschichte: Lisa zieht mit ihrer selbst gebastelten Laterne durch den
 * Ort; unterwegs beruhigen die Kinder einen erschrockenen Igel, indem sie die
 * Laternen höher heben. Vier Etappen à 12 Zeilen, nicht grausam (§10, selbst
 * verfasst). Wortschatz strikt T2 (ohne p q v x y z ä ü ß).
 */
const LISAS_LATERNE: Serie = {
  slug: "lisas-laterne",
  titel: "Lisas Laterne",
  kind: "geschichte",
  stufen: ["kids"], // I1 16.08.: teens abgegeben (Ersatz in serienTeensFrueh.ts)
  minTier: 2,
  topic: "herbst",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Heute ist ein besonderer Abend.",
        "Am Abend gehen alle mit Laternen los.",
        "Lisa hat eine schöne Laterne gebastelt.",
        "Sie ist rund und leuchtet warm.",
        "Ein kleines Licht brennt darin.",
        "Es wird nun langsam dunkel im Ort.",
        "Lisa nimmt ihre Laterne in die Hand.",
        "Mit der Mutter geht sie auf den Weg.",
        "Am Tor warten schon die Freunde.",
        "Alle tragen eine bunte Laterne.",
        "Sie leuchten rot und gelb und blau.",
        "Nun geht der lange Weg endlich los.",
      ],
    },
    {
      lines: [
        "Die Kinder gehen langsam durch den Ort.",
        "Sie singen ein helles Laternenlied.",
        "Ihre Laternen leuchten in der Nacht.",
        "Ein warmer Schein liegt auf dem Weg.",
        "Die Sterne blinken hoch am Himmel.",
        "Es riecht nach Herbst und nach Rauch.",
        "Lisa nimmt ihre Laterne fest in die Hand.",
        "Guck, wie schön meine leuchtet!",
        "Ihre kleine Schwester staunt und lacht.",
        "Der Mond schaut freundlich auf sie herab.",
        "So ein Abend ist wie ein Traum.",
        "Doch welcher Laut kommt da aus dem Gras?",
      ],
    },
    {
      lines: [
        "Am Wegrand hockt ein kleiner Igel.",
        "Er hat den Weg im Dunkeln nicht gefunden.",
        "Das Licht der Laternen macht ihm Angst.",
        "Er macht sich klein und rund wie ein Ball.",
        "Hab keine Angst, sagt Lisa leise.",
        "Sie hockt sich sanft neben das Tier.",
        "Wir tun dir gar nichts, kleiner Igel.",
        "Die Kinder heben die Laternen hoch.",
        "So blendet das Licht ihn nicht mehr.",
        "Langsam rollt der Igel sich wieder auf.",
        "Er schnauft in die frische Nachtluft.",
        "Dann eilt er ruhig ins hohe Gras.",
      ],
    },
    {
      lines: [
        "Die Kinder freuen sich alle sehr.",
        "Der kleine Igel ist nun wieder sicher.",
        "Sie gehen leise weiter durch die Nacht.",
        "Bald ist der schöne Weg fast am Ende.",
        "Am Ende wartet ein warmer Tee.",
        "Es gibt auch frisches Brot mit Honig.",
        "Alle sind froh und ein wenig matt.",
        "Lisa denkt noch an den Igel im Gras.",
        "Ich bin froh, dass es ihm gut geht.",
        "Dann macht sie ihr Licht sanft aus.",
        "Was war das ein schöner Abend!",
        "Bald darauf ruht Lisa tief und fest.",
      ],
    },
  ],
};

/**
 * Wissens-Serie „Der Marienkäfer" (Textwelt, wiederholbare Charge §9,
 * `kind: "wissen-serie"` 💡) — vier Kapitel: Aussehen & Körper, Nutzen im Garten,
 * die Larve & das rote Warnkleid, Winter & Frühling. Elementar wahr (Faktencheck-
 * Gate, [[feedback_aussagen_dreifach_pruefen]], gegen Fachquellen geprüft, §11): ein
 * Käfer mit sechs Beinen; die harten Flügeldecken schützen die zarten Flugflügel;
 * Käfer UND Larve fressen Blattläuse; das Rot ist ein Warnzeichen (er schmeckt
 * schlecht, Feinde meiden ihn); er überwintert unter Laub und kommt im Frühling
 * hervor. Selbst formuliert (§10). Volles Alphabet (T3), keine Ziffern. Vier Kapitel.
 */
const DER_MARIENKAEFER: Serie = {
  slug: "der-marienkaefer",
  titel: "Der Marienkäfer",
  kind: "wissen-serie",
    // S3: Grundschul-Sachkunde - Johannes 29.07.: »Regenwurm und Maikaefer
  // kann auch fuer 11-Jaehrige schon peinlich sein.« Bleibt bei kids.
stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Der Marienkäfer ist ein kleiner Käfer.",
        "Fast jedes Kind kennt ihn gut.",
        "Sein Rücken ist rund wie eine Kuppel.",
        "Meistens leuchtet er kräftig rot.",
        "Darauf sitzen viele schwarze Punkte.",
        "Manche Käfer sind auch gelb.",
        "Wie jedes Insekt hat er sechs Beine.",
        "Am Kopf trägt er zwei kleine Fühler.",
        "Der harte Rücken schützt seine Flügel.",
        "Er klappt ihn auf, wenn er fliegt.",
        "Darunter liegen zarte, dünne Flügel.",
        "Damit schwirrt er von Ort zu Ort.",
      ],
    },
    {
      lines: [
        "Der Marienkäfer ist ein guter Freund.",
        "Vor allem im Garten hilft er uns sehr.",
        "Am liebsten frisst er Blattläuse.",
        "Diese kleinen Tiere schaden den Pflanzen.",
        "Ein Käfer vertilgt sehr viele davon.",
        "So bleiben die Pflanzen stark und gesund.",
        "Darum freut sich jeder über den Käfer.",
        "Auch die Kinder eines Käfers helfen mit.",
        "Sie sehen aber ganz anders aus.",
        "Die Larve ist länglich und dunkel.",
        "Man erkennt sie kaum als Marienkäfer.",
        "Doch auch sie frisst schon viele Läuse.",
      ],
    },
    {
      lines: [
        "Erst später wird aus ihr ein Käfer.",
        "Der fertige Käfer trägt sein rotes Kleid.",
        "Die roten Farben sind ein Zeichen.",
        "Sie sagen den Feinden: Lass mich in Ruhe!",
        "Denn der Käfer schmeckt gar nicht gut.",
        "So lassen viele Vögel ihn in Frieden.",
        "Im Herbst sucht der Käfer ein Versteck.",
        "Er kriecht unter Laub oder in eine Ritze.",
        "Dort ruht er den ganzen Winter über.",
        "Erst im Frühling kommt er wieder hervor.",
        "Dann krabbelt er ins warme Licht.",
        "Bald sitzt er auf einem grünen Blatt.",
      ],
    },
    {
      lines: [
        "Kinder freuen sich, wenn er sie besucht.",
        "Krabbelt er über deine Hand, halt still.",
        "Er kitzelt dich mit seinen feinen Beinen.",
        "Nach einer Weile fliegt er wieder fort.",
        "In vielen Ländern gilt er als Glück.",
        "Darum mag ihn fast jeder Mensch gern.",
        "Man sollte ihm niemals wehtun.",
        "Setz ihn behutsam auf ein Blatt zurück.",
        "Dort findet er sein Futter ganz von selbst.",
        "Ein kleiner Käfer, rot und fein.",
        "Und dabei so ein guter Helfer.",
        "Nun kennst du den Marienkäfer gut.",
      ],
    },
  ],
};

/**
 * Die Serien, die im Code selbst stehen (Deutsch, die ersten Pilot-Serien) -
 * sie sind immer da, unabhängig von den Sprachpaketen.
 */
const SERIEN_IM_CODE: readonly Serie[] = [
  FILO_UND_MIRA,
  ANNA_UND_DAS_BOOT,
  DIE_SCHATZKARTE,
  BRUNO_BACKT_BROT,
  DER_ROTE_HUT,
  BEN_FINDET_EIN_EI,
  DAS_LICHT_IN_DER_HOEHLE,
  DAS_GEHEIMNIS_IM_ALTEN_TURM,
  DER_KLEINE_SCHNEEMANN,
  LENA_UND_DER_KLEINE_FISCH,
  LISAS_LATERNE,
  DER_WEG_DES_WASSERS,
  EIN_JAHR_IM_WALD,
  DAS_LEBEN_DER_BIENEN,
  VOM_KORN_ZUM_BROT,
  TAG_UND_NACHT,
  DIE_AMEISEN,
  DIE_SPINNE,
  VOM_EI_ZUM_SCHMETTERLING,
  DER_REGENWURM,
  DER_MARIENKAEFER,
];

/**
 * ★★★ DIE REIHENFOLGE DER SERIEN AUS DEN SPRACHPAKETEN (28.09.2026).
 *
 * Bis dahin stand hier `export const SERIEN = [...im Code, ...SERIEN_JUGEND_ERWACHSEN,
 * ...SERIEN_EN, …]` über statisch importierte Dateien. Seit jede Sprache ihr
 * eigenes Paket ist, bringt das Paket seine Listen unter ihrem NAMEN mit, und
 * diese Tabelle legt fest, an welcher Stelle jede in `SERIEN` steht - genau
 * die Reihenfolge von vorher (Golden-Test `tests/sprachpakete-golden.test.ts`).
 * Fehlt ein Paket, fehlen nur seine Zeilen; die Reihenfolge der anderen bleibt.
 *
 * ⚠️ Eine NEUE Serien-Liste: in ihr Sprachpaket (`sprachpaketXx.ts`) UND hier
 *    HINTEN anhängen. Vergessen: Der Wächter `tests/sprachpakete-inhalt.test.ts`
 *    wird rot, und bis dahin hängt `baueSerien` sie hinten an (nie verloren).
 */
export const SERIEN_FOLGE: readonly (readonly [Lang, string])[] = [
  // TN-E5/TN-E6: erste Serien für 13–15 auf Augenhöhe und die ERSTEN
  // deutschen Erwachsenen-Serien (die Bücherei war dort bis dahin leer).
  ["de", "SERIEN_JUGEND_ERWACHSEN"],
  // Englische Pilot-Serien (append-only angehaengt; ueber `lang` getrennt).
  ["en", "SERIEN_EN"],
  // TN-E7: zweite englische Welle — erstmals KURATIERT (NASA/Simple-Wikipedia/
  // StoryWeaver/VOA), Lizenz je Quelle am Objekt geprüft.
  ["en", "SERIEN_EN2"],
  // 29.07.: die FRÜHE Treppe. Bis dahin lag keine einzige Serie unter Tier 2 —
  // die Bücherei ging erst bei 21 Buchstaben + ⇧ auf. Diese sieben Serien
  // öffnen sie ab 13 Einheiten, in zwei Fassungen (Kinder / Jugendliche +
  // Erwachsene), weil die Ränder im Bestand nichts erben. Siehe serienFrueh.ts.
  ["de", "SERIEN_FRUEH"],
  // 29.07.: Nachschub für Erwachsene auf vollem Alphabet — die Bücherei hatte
  // dort nur 12 Etappen, also 12 Leserunden, bevor das Angebot versiegt.
  ["de", "SERIEN_ERWACHSEN"],
  // AG-E5 29.07.: erste Serien GEZIELT für 13–15 (vorher genau eine). Darunter
  // „Was ein Quadratmeter Boden leistet" als Muster für den Maßstab: derselbe
  // Gegenstand wie „Der Regenwurm" (7–9), aber auf Augenhöhe behandelt.
  ["de", "SERIEN_JUGEND2"],
  // 30.07.: erste Serien GEZIELT für 10–12 (vorher NULL). Wichtiger als die
  // Zahl ist die Treppe: Vor dem vollen Alphabet sah ein Kind mit 11 genau 13
  // Serien — und alle 13 waren wörtlich die der 7- bis 9-Jährigen. Siehe
  // serienMittel.ts.
  ["de", "SERIEN_MITTEL"],
  // 07.08.: die Treppe für den LEHRGANGS-Weg. Die frühe Treppe oben ist auf
  // die INTRO_ORDER getextet — der Lehrgang bringt das n erst als letzten
  // Buchstaben (Lektion 16), also war dort bis 31 Einheiten NICHTS lesbar.
  // Diese sechs Serien kommen ohne n aus und öffnen ab Lehrgangs-Lektion 9.
  // Siehe serienLehrgangFrueh.ts.
  ["de", "SERIEN_LEHRGANG_FRUEH"],
  // 16.08. (Charge I1): die dritte frühe Treppe — erstmals AUSSCHLIESSLICH für
  // 11-15. Bis dahin waren sieben der zehn teens-Serien vor dem vollen
  // Alphabet mit `kids` geteilt (Filo und Mira, Bruno backt Brot, Lisas
  // Laterne …). Diese sechs eigenen Serien öffnen bei 13/16/18/20 Einheiten
  // und machen das Wegnehmen der Kinderserien überhaupt erst möglich.
  // Siehe serienTeensFrueh.ts.
  ["de", "SERIEN_TEENS_FRUEH"],
  // 16.08. (Charge I1c): die vierte frühe Treppe - erstmals AUSSCHLIESSLICH für
  // Erwachsene. Die Zelle war mit elf Serien die dünnste deutsche, und an den
  // frühen Sprossen standen genau drei (1, 2, 3, 3, 5, 11, 11 über die
  // Regal-Punkte). Diese sechs eigenen Serien öffnen bei 13/17/20/22/26/31
  // Einheiten, darunter zwei Wissens-Serien und ein Sechs-Etappen-Bogen.
  // Siehe serienErwachsenFrueh.ts.
  ["de", "SERIEN_ERWACHSEN_FRUEH"],
  // 21.08. (Charge I2): die erste ENGLISCHE Treppe. Die sieben vorhandenen
  // englischen Serien oeffneten alle spaet (eine bei 22, zwei bei 29, vier bei
  // 30) - wer auf Englisch lernte, sah bis 22 gelernte Einheiten nichts in der
  // Buecherei, waehrend auf Deutsch dort 24 Serien standen. Diese Serien sind
  // gezielt fuer je EINE Stufe geschrieben und oeffnen ab 15 Einheiten. Warum
  // erst ab 15 und nicht ab 13: bei dreizehn Einheiten fehlt das h und damit
  // das englische "the" - siehe den Dateikopf von serienEnFrueh.ts.
  ["en", "SERIEN_EN_FRUEH"],
  // 21.08. (Charge I2b): drei eigene KINDER-Serien als Ersatz fuer die drei
  // englischen Wissens-Serien, die kids, teens und erwachsen zugleich trugen
  // (Water and Weather - A Trip Through Space - How Animals Sleep). Ohne
  // diesen Ersatz waere das kids-Regal beim Freigeben von 13 auf 10 Serien
  // gefallen; die drei oeffnen bei 21/24/29 Einheiten und bedienen dieselben
  // Faecher. Siehe serienEnKidsErsatz.ts.
  ["en", "SERIEN_EN_KIDS_ERSATZ"],
  // 21.08. (Charge O1): Ersatz fuer die Sprosse 17. Das `o` rueckt in der
  // Einfuehrungsreihenfolge direkt hinter das `h`; dadurch rutscht das `c` von
  // Einheit 17 auf 18, und acht Altserien oeffnen eine Sprosse spaeter. Diese
  // Serien sind auf den NEUEN Satz der Sprosse 17 getextet (a d e f h i j k l
  // n o r s t u oe) und fuellen die zehn Regal-Plaetze, die sonst am Punkt 17
  // fehlten. Siehe serienOFolge.ts.
  ["de", "SERIEN_O_FOLGE"],
  // 21.08. (Charge O1): die englische Haelfte desselben Ersatzes. Das `o`
  // haengt im Englischen an to, of, on, not, no, one, for - erst mit ihm wird
  // eine fruehe englische Sprosse ueberhaupt Englisch. Siehe serienOFolgeEn.ts.
  ["en", "SERIEN_O_FOLGE_EN"],
  // 21.08. (Charge E16): die Sprosse 16 war NEU und LEER. Sie ist erst durch
  // den Umbau von O1 entstanden - das `o` steht seither direkt hinter dem `h`,
  // und damit gibt es einen Tastenstand `f j d k s l a oe e n i r t h o`, den
  // es vorher nicht gab. Sie ist strikt leichter als die Sprosse 15, auf der
  // I2 schon geschrieben hat: derselbe Satz plus das `o` und damit plus to,
  // of, on, no, not, one, old, road, door, floor, north. Sechs Serien, je
  // zwei fuer kids, teens und erwachsen, jede fuer genau EINE Stufe.
  // Siehe serienEnSprosse16.ts.
  ["en", "SERIEN_EN_SPROSSE16"],
  // I4 28.08.: Die englische Bücherei holt auf. Gemessen stand an der Sprosse 17
  // eine einzige englische Serie für Erwachsene gegen acht deutsche. Sechs neue
  // Serien für Jugendliche und Erwachsene, alle bei 17 offen.
  ["en", "SERIEN_EN_I4_SPROSSE17_ERWACHSEN"],
  // I4 28.08., zweite Hälfte derselben Sprosse: sechs Serien für Kinder und
  // Jugendliche. Das englische Kinderregal hatte bei 17 Tasten fünf Serien, das
  // deutsche zwölf.
  ["en", "SERIEN_EN_I4_SPROSSE17_KINDER"],
  // I4 28.08., die Sprosse darüber: sieben Serien, die vom `m`, `c` und `g` leben -
  // erst hier gibt es auf Englisch die Verlaufsform und den Rückbezug auf Personen.
  ["en", "SERIEN_EN_I4_SPROSSE20"],
  // I4 28.08.: Sprosse 22 bringt `b` und `w` - und damit zum ersten Mal auf
  // Englisch `was/were`, `but` und `because`.
  ["en", "SERIEN_EN_I4_SPROSSE22"],
  // I4 28.08.: Sprosse 25 (die 26 ist fürs Englische nicht erreichbar, dort steht
  // das `ä`). Mit `z v p` kommt endlich `have` dazu; das `y` fehlt weiter.
  ["en", "SERIEN_EN_I4_SPROSSE26"],
  // I4 28.08.: das volle Alphabet (Sprosse 30 - die 31 fügt nur das `ß` hinzu).
  // Drei belegte Wissens-Serien und eine Erwachsenen-Geschichte; die einzigen
  // Serien der Charge, die `y`, `x` und `q` benutzen dürfen.
  ["en", "SERIEN_EN_I4_VOLL"],
  // 22.08. (Charge K2): die zweite KINDER-Runde. Das deutsche kids-Regal war
  // vor dem vollen Alphabet nur halb so tief wie das der Jugendlichen (2, 5, 9
  // gegen 4, 10, 23 an den Punkten 13/17/20) - seit die Charge I1 die sieben
  // geerbten Kinderserien aus dem teens-Regal genommen hat, ist auf der
  // kids-Seite nichts Eigenes nachgewachsen. Diese zwoelf Serien tragen
  // ausschliesslich `kids` und oeffnen bei 13/17/20, mit dem Schwerpunkt auf
  // 17 und 20, wo der Abstand am groessten war. Siehe serienKidsZweiteRunde.ts.
  ["de", "SERIEN_KIDS_ZWEITE_RUNDE"],
  // 22.08. (Charge E2-DE): die zweite ERWACHSENEN-Runde, deutsch. Nach K2 war
  // de/erwachsen die duennste deutsche Zelle der Buecherei: 2, 4, 8, 9, 12, 19,
  // 19 ueber die Regal-Punkte 13/17/20/22/26/31/99, gegen 4, 12, 21, 30, 33,
  // 47, 47 bei kids und 4, 10, 23, 26, 31, 50, 50 bei teens. Die erzaehlenden
  // Serien tragen ausschliesslich `erwachsen` (die eigene Zelle ist der Zweck),
  // die Wissens-Serien duerfen `teens` mittragen. Siehe
  // serienErwachsenRunde2.ts.
  ["de", "SERIEN_ERWACHSEN_RUNDE2"],
  // 29.08. (Charge B1): die ERSTE Charge aus einer gemeinfreien Fremdquelle.
  // Dreizehn Nacherzählungen nach James Baldwin, »Fifty Famous Stories Retold«
  // (1896), für en/teens - dort fehlten 13 Geschichten auf das Ziel von 40.
  // Grundlage: Sensorik/QUELLEN-2026-08-29-TASTENFLOW-FREIE-TEXTE.md. Alle
  // dreizehn stehen auf minTier 3 (historische Eigennamen brauchen das ganze
  // Alphabet) - Bauplan §10 sieht genau das vor: übernommene Stoffe leben auf
  // hohen Tiers, die frühe Erstleser-Ebene bleibt selbst verfasst. Was aus den
  // fünfzig NICHT übernommen wurde und warum, steht im Kopf der Datei.
  ["en", "SERIEN_EN_BALDWIN"],
  // 29.08. (Charge W1): 36 englische WISSENS-Serien - 13 kids, 11 teens,
  // 12 erwachsen. Damit steht jede englische Zelle bei den geforderten 20.
  // ★★ ALLE 36 öffnen bei 25 Einheiten (ohne `y x q`). Das ist der Unterschied
  // zur Baldwin-Charge: Wissenstexte haben keine direkte Rede, also fehlt auch
  // kein »you«. Was das an Wortschatz kostet und wodurch es ersetzt wird, steht
  // im Kopf von serienEnWissenKids.ts.
  ["en", "SERIEN_EN_WISSEN_KIDS"],
  ["en", "SERIEN_EN_WISSEN_TEENS"],
  ["en", "SERIEN_EN_WISSEN_ERWACHSEN"],
  // 29.08. (Charge W2): 26 DEUTSCHE Wissens-Serien - 9 kids, 3 teens,
  // 14 erwachsen. Damit steht auch das deutsche Wissens-Regal in allen drei
  // Stufen bei 20; de/erwachsen war mit sechs die dünnste Zelle der Bücherei.
  // ★★ ALLE 26 öffnen bei 27 Einheiten. Für Deutsch ist 25 zu hart: dort
  // fehlen auch `ä` und `ü`, also für, über, müssen, zurück, Länge, Wärme.
  // Auf 27 fehlen nur `x y q` und das `ß`. Begründung und Ersatzformen im
  // Kopf von serienDeWissenKids.ts.
  ["de", "SERIEN_DE_WISSEN_KIDS"],
  ["de", "SERIEN_DE_WISSEN_TEENS"],
  ["de", "SERIEN_DE_WISSEN_ERWACHSEN"],
  // 29.08. (Charge G1): 16 englische KINDER-Geschichten nach dem African
  // Storybook (CC BY 3.0/4.0, über Storybooks Canada). Nacherzählt, nicht
  // übersetzt - die Originale sind Bilderbuchtexte von 200 bis 860 Wörtern.
  // ★ »The Song That Sakima Made« handelt von einem Jungen, der sein Augen-
  // licht verloren hat; der abwertende Satz des Originals steht dort NICHT.
  // Was sonst entschärft wurde und warum, steht im Kopf der Datei.
  ["en", "SERIEN_EN_KIDS_ASB"],
  // 29.08. (Charge G2): 10 deutsche Geschichten - 4 kids nach dem African
  // Storybook (CC BY 3.0/4.0), 6 teens nach Johann Peter Hebel, »Schatzkästlein
  // des rheinischen Hausfreundes« (1811, gemeinfrei). Hebel ist in heutige
  // Sprache gebracht: das Original schreibt Irrthum, Thür, seyn - nichts
  // davon wäre lesbar, und einiges nicht einmal tippbar.
  // Alle zehn öffnen bei 27 Einheiten.
  ["de", "SERIEN_DE_GESCHICHTEN"],
  ["de", "SERIEN_DE_ERWACHSEN_G3"],
  ["en", "SERIEN_EN_ERWACHSEN_E1"],
  // E4 (Bauplan §6.2 Punkt 2, §10 Zeile E4, noch LEER): die frühen Serien-
  // Anfänge NUR für Lernweg „en" - jede Serie trägt `lang: "en"` UND
  // `nurWeg: "en"`, siehe serienEnWegFrueh.ts.
  ["en", "SERIEN_EN_WEG_FRUEH"],
  // ★ E8a (25./26.09.2026, Bauplan §6 Auftrag Punkt 2): die frühen Serien
  // für Lernweg „fr" - jede Serie trägt `lang: "fr"` UND `nurWeg: "fr"`,
  // siehe serienFrWegFrueh.ts. `serienForStufe` filtert schon länger über
  // `lang`/`nurWeg` (keine binäre Weiche wie bei `corpusItemsFor` - Falle 1
  // betrifft nur den Korpus, siehe corpus.ts).
  ["fr", "SERIEN_FR_WEG_FRUEH"],
  // ★ E9-kids (26.09.2026): Sprossen 25-34 für Lernweg „fr", siehe serienFrMitte.ts.
  ["fr", "SERIEN_FR_MITTE"],
  // ★ E9-ende-kids (26.09.2026): ab der Punkt-Sprosse, siehe serienFrEnde.ts.
  ["fr", "SERIEN_FR_ENDE"],
  // ★ Zusatz-Serien (26.09.2026): quer über den ganzen Lernweg „fr",
  // siehe serienFrZusatz.ts (Kinder zuerst).
  ["fr", "SERIEN_FR_ZUSATZ"],
  // ★ ES-S (27.09.2026): erste Charge Fortsetzungsgeschichten für Lernweg
  // „es" (Kinder, Jugend, Erwachsene), siehe serienEs.ts.
  ["es", "SERIEN_ES"],
  // ★ IT-S (03.10.2026): Fortsetzungsgeschichten für Lernweg „it" (Kinder, Jugend, Erwachsene), siehe serienIt.ts.
  ["it", "SERIEN_IT"],
  // ★ PL-S (09.10.2026): Fortsetzungsgeschichten für Lernweg „pl" (Kinder, Jugend, Erwachsene), siehe serienPl.ts.
  ["pl", "SERIEN_PL"],
  // ★ CS-S (09.10.2026): Fortsetzungsgeschichten für Lernweg „cs" (Kinder, Jugend, Erwachsene), siehe serienCs.ts.
  ["cs", "SERIEN_CS"],
  // ★ TR-S (09.10.2026): Fortsetzungsgeschichten für Lernweg „tr" (Kinder, Jugend, Erwachsene), siehe serienTr.ts.
  ["tr", "SERIEN_TR"],
  // ★ G3c-VERTEILER (25.10.2026): die Serien-Listen der neun Gerüst-Wege (`serien<Xx>.ts`, heute leer) - ihr Platz steht schon fest, hinten.
  ["bg", "SERIEN_BG"],
  ["el", "SERIEN_EL"],
  ["hu", "SERIEN_HU"],
  ["nl", "SERIEN_NL"],
  ["pt", "SERIEN_PT"],
  ["br", "SERIEN_BR"],
  ["ro", "SERIEN_RO"],
  ["sv", "SERIEN_SV"],
  ["uk", "SERIEN_UK"],
];

function baueSerien(): Serie[] {
  const out: Serie[] = [...SERIEN_IM_CODE];
  const bekannt = new Set<string>();
  for (const [lang, name] of SERIEN_FOLGE) {
    bekannt.add(`${lang}|${name}`);
    const liste = sprachDaten(lang)?.serien[name];
    if (liste) out.push(...liste);
  }
  // Eine Liste, die ein Paket bringt, die aber (noch) nicht in SERIEN_FOLGE
  // steht: hinten anhängen statt still verlieren (der Wächter meldet sie).
  for (const lang of ALLE_SPRACHPAKETE) {
    const daten = sprachDaten(lang);
    if (!daten) continue;
    for (const [name, liste] of Object.entries(daten.serien)) {
      if (!bekannt.has(`${lang}|${name}`)) out.push(...liste);
    }
  }
  return out;
}

/**
 * Alle Serien der geladenen Sprachpakete, in fester Reihenfolge
 * (`SERIEN_FOLGE`). `export let`: lebendige Bindung - wer `SERIEN` liest,
 * bekommt immer den aktuellen Stand. ⚠️ Nie auf oberster Ebene eines Moduls
 * kopieren (siehe `CORPUS` in corpus.ts).
 */
export let SERIEN: readonly Serie[] = baueSerien();

beiSprachpaket(() => {
  SERIEN = baueSerien();
});

/** Eine Serie über ihren stabilen `slug`. */
export function serieBySlug(slug: string): Serie | undefined {
  const serie = SERIEN.find((s) => s.slug === slug);
  // ★ 28.09.2026: Nicht gefunden, solange nicht alle Sprachpakete da sind -
  // dann kann die Serie in einem noch nicht geladenen stehen (ein Kind, das
  // früher in einer anderen Sprache gelesen hat). Das ist ein Fehlzugriff:
  // nachladen, statt sie still aus Statistik und Bücherei fallen zu lassen.
  if (!serie && !sprachpaketeGeladen(ALLE_SPRACHPAKETE)) fehlZugriff("alle", `serieBySlug(${slug})`);
  return serie;
}

/**
 * ★ 28.09.2026: Sind alle Serien, die dieser Fortschritt nennt, mit den
 * geladenen Sprachpaketen auffindbar? Wenn nicht, braucht eine Anzeige über
 * den Fortschritt (Statistik) alle Pakete - `SprachpaketTor` fragt das.
 * Liest nur, meldet keinen Fehlzugriff.
 */
export function serienDesFortschrittsBekannt(progress: Pick<TypingProgress, "storyProgress" | "lastPlace">): boolean {
  const slugs = [...Object.keys(progress.storyProgress ?? {}), progress.lastPlace?.serieSlug].filter(
    (s): s is string => !!s,
  );
  return slugs.every((slug) => SERIEN.some((s) => s.slug === slug));
}

/**
 * Serien für eine Altersstufe (age-appropriate; unabhängig vom Können) UND die
 * gewählte Sprache.
 *
 * ★ E4a (24.09.2026, Bauplan §6.2/§10): `lernweg` ist seither Pflicht - kein
 * stiller Rückfall (wie `ensureIntroduced`/`corpusItemsFor`, Bauplan §2.3).
 * Ein TS-Parameter mit Vorgabewert darf keinem Pflicht-Parameter vorangehen,
 * darum verlangt diese Funktion jetzt AUCH `lang` ausdrücklich - jeder
 * Aufrufer nennt beides. Filtert Serien mit gesetztem `Serie.nurWeg` auf den
 * eigenen Weg; eine Serie ohne das Feld gilt weiter auf BEIDEN Wegen (jede
 * heutige Serie).
 */
export function serienForStufe(stufe: Stufe, lang: Lang, lernweg: Lernweg): Serie[] {
  // S1: Die Serien tragen noch die alten Etiketten (a/b/c/erwachsen), die
  // Konto-Stufe ist neu (kids/teens) — contentStufenFor übersetzt.
  const etiketten = contentStufenFor(stufe);
  if (!sprachpaketGeladen(lang)) fehlZugriff(lang, "serienForStufe"); // ★ 28.09.2026, sprachpakete.ts
  return SERIEN.filter(
    (s) =>
      (s.lang ?? "de") === lang &&
      etiketten.some((e) => s.stufen.includes(e)) &&
      passtLernweg(s.nurWeg, lernweg),
  );
}

/**
 * Der freigeschaltete Zeichensatz (Kleinbuchstaben + gelernte Satz-/Sonderzeichen/
 * Ziffern) aus dem adaptiven Lernstand `introduced` — genau das Format, das
 * `fitsKeys`/`fitText` erwarten. Die Umschalt-Einheit `⇧` zählt nicht als Zeichen
 * (Großschreibung ist ohnehin immer tippbar). Grundlage des präzisen Serien-Gates.
 */
export function allowedFromIntroduced(
  introduced: string[] | undefined,
  /** ★ E1 (24.09.2026): der Lernweg des Kindes. */
  lernweg: Lernweg,
): Set<string> {
  const set = new Set<string>();
  for (const u of ensureIntroduced(introduced, lernweg)) {
    if (u === SHIFT_UNIT) continue;
    set.add(kleinFuer(u, lernweg)); // G2b-1: wie `fitText` - in der Sprache des Weges
  }
  return set;
}

/**
 * Kann eine Person JEDE Zeile der Serie mit ihren freigeschalteten Tasten tippen?
 * Bewusst PRÄZISE über die tatsächlichen Tasten (nicht nur über das grobe Tier):
 * `introduced` schaltet die Buchstaben einzeln in der Häufigkeitsreihenfolge frei,
 * ein „Tier 2 erreicht" heißt also NICHT, dass schon alle T2-Buchstaben dran sind.
 * Ungelernte Satzzeichen werden beim Servieren weggelassen (`fitText`) und blocken
 * daher nicht.
 */
export function serieTypeable(
  serie: Serie,
  allowed: Set<string>,
  lernweg?: Lernweg,
  /** ★ D-2: nur Kleinschrift (Erwachsene vor ⇧, `nurKleinschrift`) - fehlt es, „nein". */
  klein = false,
): boolean {
  // ★ E8b Block 1b: `s.nurWeg` gewinnt (wie `computeSerieMinTier`) - eine
  // Serie nur für Weg „fr" wird auch hier gegen dessen harte Bindestrich-Regel
  // geprüft, ganz gleich, welchen Weg das Kind sonst geht.
  const effektiverWeg = serie.nurWeg ?? lernweg;
  if (klein) {
    // ★ D-2: jede Zeile tippbar UND ohne Grossbuchstaben, so wie sie serviert würde.
    return serieLines(serie).every((line) => {
      const f = fitText(line, allowed, effektiverWeg);
      return f !== null && !hatGrossbuchstaben(f);
    });
  }
  return serieLines(serie).every((line) => fitsKeys(line, allowed, effektiverWeg));
}

/**
 * Serien, die eine Person JETZT lesen kann: passende Altersstufe UND jede Zeile
 * mit den schon gelernten Tasten tippbar.
 *
 * ★ E4a: `lernweg` Pflicht, siehe {@link serienForStufe}.
 */
export function unlockedSerien(
  allowed: Set<string>,
  stufe: Stufe,
  lang: Lang,
  lernweg: Lernweg,
  /** ★ D-2 (28.09.2026): Umschalttaste gelernt? Fehlt es, gilt „ja" (unverändert). */
  umschalt = true,
): Serie[] {
  const klein = nurKleinschrift(stufe, umschalt);
  return serienForStufe(stufe, lang, lernweg).filter((s) => serieTypeable(s, allowed, lernweg, klein));
}

/**
 * Serien der richtigen Altersstufe, die das Können noch NICHT hergibt („kannst du
 * bald lesen"). Nur für den freundlichen Vorschau-Hinweis in der Bücherei.
 *
 * ★ E4a: `lernweg` Pflicht, siehe {@link serienForStufe}.
 */
export function lockedSerien(
  allowed: Set<string>,
  stufe: Stufe,
  lang: Lang,
  lernweg: Lernweg,
  /** ★ D-2: wie {@link unlockedSerien}. */
  umschalt = true,
): Serie[] {
  const klein = nurKleinschrift(stufe, umschalt);
  return serienForStufe(stufe, lang, lernweg).filter((s) => !serieTypeable(s, allowed, lernweg, klein));
}

/** Status einer Serie im Spielstand (für die Bücherei-Karte). */
export type SerieStatus = "neu" | "offen" | "fertig";

export function serieStatus(progress: TypingProgress, slug: string): SerieStatus {
  if (isStoryDone(progress.storyProgress, slug)) return "fertig";
  const st = storyStateFor(progress.storyProgress, slug);
  return st.etappe > 0 ? "offen" : "neu";
}

/**
 * Die erste UNGESEHENE, aber bereits BEGONNENE und noch nicht fertige Serie
 * (freigeschaltet + passende Stufe) — Grundlage für das Einweb-Angebot „Weiter mit
 * deiner Geschichte?" in „Mein Training" (Bauplan §3.4). `undefined`, wenn keine
 * Serie offen ist (dann wird nichts angeboten).
 */
export function firstOpenSerie(
  progress: TypingProgress,
  allowed: Set<string>,
  stufe: Stufe,
  lang: Lang,
  lernweg: Lernweg,
  /** ★ D-2: wie {@link unlockedSerien}. */
  umschalt = true,
): Serie | undefined {
  return unlockedSerien(allowed, stufe, lang, lernweg, umschalt).find(
    (s) => serieStatus(progress, s.slug) === "offen",
  );
}

/**
 * Die NÄCHSTE fällige Geschichte — Grundlage für den angekündigten Hauptweg
 * „Jetzt kommt eine Geschichte: …" nach jeder Runde und jeder Lektion
 * (Wunsch Johannes 28.07.2026).
 *
 * Reihenfolge bewusst: **erst zu Ende lesen, was begonnen ist**, dann die erste
 * noch ungelesene. So bleibt der Faden einer Geschichte erhalten, statt dass
 * jemand fünf Anfänge sammelt — und wer immer bestätigt, kommt nacheinander
 * durch die GANZE Bücherei seiner Altersstufe. `undefined` heißt: entweder ist
 * noch keine Geschichte tippbar (zu wenige Tasten) oder alle sind schon gelesen.
 */
export function nextSerieFor(
  progress: TypingProgress,
  allowed: Set<string>,
  stufe: Stufe,
  lang: Lang,
  lernweg: Lernweg,
  /** ★ D-2: wie {@link unlockedSerien}. */
  umschalt = true,
): Serie | undefined {
  const offen = unlockedSerien(allowed, stufe, lang, lernweg, umschalt);
  return (
    offen.find((s) => serieStatus(progress, s.slug) === "offen") ??
    offen.find((s) => serieStatus(progress, s.slug) === "neu")
  );
}

/**
 * Bei welcher Etappe (0-basiert) eine Serie geöffnet werden soll:
 *  • fertig + Wunsch „nochmal" ⇒ 0 (der Aufrufer setzt zusätzlich `resetStory`),
 *  • sonst die nächste fällige Etappe (Resume), geklammert auf den gültigen Bereich.
 */
export function startEtappeFor(progress: TypingProgress, serie: Serie): number {
  const total = serieEtappeCount(serie);
  if (isStoryDone(progress.storyProgress, serie.slug)) return 0;
  const st = storyStateFor(progress.storyProgress, serie.slug);
  return Math.max(0, Math.min(total - 1, st.etappe));
}

/**
 * Bei welcher ZEILE (0-basiert) die fällige Etappe geöffnet werden soll — der
 * zeilengenaue Teil des Resume (21.07.): Wer bei Zeile 5 von 12 aufhört, macht
 * dort weiter statt wieder bei Zeile 1.
 *
 * 0, wenn nichts gemerkt ist, die Serie fertig ist oder der gemerkte Stand hinter
 * dem Ende der Etappe läge (dann ist die Etappe ohnehin gleich zu Ende — lieber
 * sauber von vorn als eine leere Runde).
 */
export function startLineFor(progress: TypingProgress, serie: Serie): number {
  if (isStoryDone(progress.storyProgress, serie.slug)) return 0;
  const st = storyStateFor(progress.storyProgress, serie.slug);
  const idx = startEtappeFor(progress, serie);
  const lines = serie.etappen[idx]?.lines.length ?? 0;
  const line = Math.max(0, st.line ?? 0);
  return line >= lines ? 0 : line;
}

/**
 * Welche Serie die Bücherei ganz oben als „Weiter: …" anbietet (21.07.). Zuerst
 * die ZULETZT GEÖFFNETE (`lastPlace.serieSlug`) — auch wenn davon noch keine
 * Etappe fertig ist, denn genau dann steckt das Kind mittendrin. Ist die weg,
 * fertig oder (noch) nicht freigeschaltet, fällt es auf die erste angefangene
 * Serie zurück. `undefined`, wenn nichts offen ist — dann zeigt die Bücherei
 * einfach ihre Liste.
 */
export function resumeSerie(
  progress: TypingProgress,
  allowed: Set<string>,
  stufe: Stufe,
  lang: Lang,
  lernweg: Lernweg,
  /** ★ D-2: wie {@link unlockedSerien}. */
  umschalt = true,
): Serie | undefined {
  const slug = progress.lastPlace?.serieSlug;
  if (slug) {
    const s = unlockedSerien(allowed, stufe, lang, lernweg, umschalt).find((x) => x.slug === slug);
    if (s && serieStatus(progress, s.slug) !== "fertig") return s;
  }
  return firstOpenSerie(progress, allowed, stufe, lang, lernweg, umschalt);
}

/** Überblick über den Bücherei-Fortschritt eines Kindes (für die Statistik). */
export interface SerienOverview {
  /** Die Serie, in der das Kind gerade steckt (Resume-Stand) — falls es eine gibt. */
  aktuell?: {
    serie: Serie;
    /** 1-basiert zum Anzeigen. */
    etappe: number;
    total: number;
    /** 0-basiert (nächste Zeile); 0 = am Etappen-Anfang. */
    line: number;
    lines: number;
  };
  /** Komplett durchgelesene Serien. */
  fertig: Serie[];
  /** Wie viele Serien überhaupt schon angefasst wurden. */
  begonnen: number;
}

/**
 * Bücherei-Fortschritt eines Kindes für die STATISTIK (Lehrkraft UND Schüler-
 * Selbstsicht, 21.07.). Bewusst nur aus `storyProgress`/`lastPlace` abgeleitet —
 * ohne Tastenstand und Altersstufe —, damit die Auswertung überall dieselbe ist
 * und keine noch gesperrte Serie ausblendet, die das Kind schon gelesen hat.
 *
 * Anders als {@link resumeSerie} (das die BÜCHEREI bedient und deshalb auf
 * freigeschaltete Serien filtert) beschreibt das hier nur den Stand.
 */
export function serienOverview(progress: TypingProgress): SerienOverview {
  const sp = progress.storyProgress ?? {};
  const slugs = Object.keys(sp);
  const fertig = slugs
    .filter((s) => isStoryDone(sp, s))
    .map((s) => serieBySlug(s))
    .filter((s): s is Serie => !!s);

  // „Liest gerade": die zuletzt geöffnete Serie, sonst die erste angefangene.
  const kandidaten = [progress.lastPlace?.serieSlug, ...slugs].filter(
    (s): s is string => !!s,
  );
  let aktuell: SerienOverview["aktuell"];
  for (const slug of kandidaten) {
    const serie = serieBySlug(slug);
    if (!serie || isStoryDone(sp, slug)) continue;
    const idx = startEtappeFor(progress, serie);
    aktuell = {
      serie,
      etappe: idx + 1,
      total: serieEtappeCount(serie),
      line: startLineFor(progress, serie),
      lines: serie.etappen[idx]?.lines.length ?? 0,
    };
    break;
  }
  return { aktuell, fertig, begonnen: slugs.length };
}

/**
 * Rechte-Prüfung einer Herkunft (§10, hart): Quelle+Lizenz Pflicht; ND-Lizenzen
 * sind ausgeschlossen (wir MÜSSEN in Tippzeilen zerlegen); CC-BY/CC-BY-SA
 * verlangen die Namensnennung (`autor`). Für die Pipeline-Gates (TW-E5+).
 */
export function validateHerkunft(h: Herkunft): string[] {
  const problems: string[] = [];
  if (!h.quelle) problems.push("quelle fehlt");
  if (!h.lizenz) problems.push("lizenz fehlt");
  const l = h.lizenz.toLowerCase();
  if (/(^|[^a-z])nd([^a-z]|$)|no.?deriv|keine bearbeitung/.test(l))
    problems.push("ND-Lizenz ausgeschlossen (Text muss in Zeilen zerlegt werden)");
  if (/cc.?\s*-?\s*by/.test(l) && !h.autor)
    problems.push("CC-BY/CC-BY-SA verlangt Namensnennung (autor fehlt)");
  return problems;
}

/**
 * Alle Herkünfte der Bücherei-Serien, entdoppelt (für den „Quellen & Dank"-Bereich,
 * §10 CC-Namensnennung). Sortiert: eigene Werke zuletzt, sonst nach Quelle. Serien
 * ohne `herkunft` werden übersprungen. Grundlage, sobald CC-/gemeinfreie Serien
 * dazukommen (TW-E10–E12); heute liefert es die selbst verfasste Pilot-Serie.
 */
export function collectHerkunft(sprachen?: readonly Lang[]): Herkunft[] {
  // ★ 28.09.2026 (Johannes: „nur die Sprachen des Kindes"): Mit `sprachen`
  // nennt „Quellen & Dank" nur die Herkunft der Serien und Zeilen, die dieses
  // Kind bekommen kann (Weg + Englisch, `sprachPaketeFuer`). Ohne Angabe: alle
  // Sprachen (Handbuch, Admin). Bis dahin fehlten die Korpus-Zeilen von fr und
  // es hier GANZ - nur CORPUS und CORPUS_EN wurden gelesen.
  const noetig = sprachen ?? ALLE_SPRACHPAKETE;
  if (!sprachpaketeGeladen(noetig)) {
    if (sprachen) for (const l of sprachen) { if (!sprachpaketGeladen(l)) fehlZugriff(l, "collectHerkunft"); }
    else fehlZugriff("alle", "collectHerkunft");
  }
  const byKey = new Map<string, Herkunft>();
  // Entdoppelt nach QUELLE+LIZENZ+AUTOR — bewusst OHNE `fundstelle`: seit TN-E4
  // trägt jede Korpus-Zeile ihre eigene Artikel-URL, „Quellen & Dank" würde
  // sonst mit Dutzenden Wikipedia-Links zulaufen. Für die CC-BY-Namensnennung
  // genügt Quelle + Lizenz + Autor; die genaue Fundstelle bleibt an der Zeile.
  const add = (h: Herkunft | undefined) => {
    if (!h) return;
    const key = `${h.quelle}|${h.lizenz}|${h.autor ?? ""}`;
    if (!byKey.has(key)) byKey.set(key, h);
  };
  for (const s of SERIEN) if (noetig.includes(s.lang ?? "de")) add(s.herkunft);
  // Auch das uebernommene Gemeingut aus dem KORPUS (Aesop, Mother Goose,
  // Shakespeare, Franklin ...) gehoert in "Quellen & Dank" (§10) - aus dem
  // Korpus JEDER genannten Sprache.
  for (const l of noetig) for (const it of korpusFuer(l, "collectHerkunft")) add(it.herkunft);
  const eigen = (h: Herkunft) => /eigenes werk|selbst/i.test(h.lizenz);
  return [...byKey.values()].sort((a, b) => {
    if (eigen(a) !== eigen(b)) return eigen(a) ? 1 : -1; // eigene Werke ans Ende
    return a.quelle.localeCompare(b.quelle, "de");
  });
}
