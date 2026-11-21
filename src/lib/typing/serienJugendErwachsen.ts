/**
 * DEUTSCHE Serien für die bis dahin unversorgten Altersstufen (TN-E5 + TN-E6,
 * Bauplan `Sensorik/BAUPLAN-2026-07-27-TASTENFLOW-TEXT-NACHSCHUB.md` §7).
 *
 * Ausgangslage laut Prüfbericht 27.07.: Von 21 deutschen Bücherei-Serien war
 * KEINE für Erwachsene (die Bücherei war dort schlicht leer), und die drei
 * c-Serien waren für 10–12-Jährige geschrieben (sprechende Eule, sprechende
 * Fledermaus). Diese Datei liefert beides nach:
 *
 *  • TN-E5 (13–15): „Die Martinswand" (Tiroler Sage, modern + entschärft
 *    nacherzählt) und „Die Nachricht auf Seite zwölf" (Gegenwarts-Mystery,
 *    Ich-Perspektive, selbst verfasst).
 *  • TN-E6 (Erwachsene): zwei Sachtext-Serien („Wie eine E-Mail reist",
 *    „Kaffee: von der Kirsche in die Tasse", aus Wikipedia verdichtet, jede
 *    Sachaussage doppelt belegt) und die ruhige Erzählung „Die Bank am Fluss".
 *
 * Rechte (§4/§10): gemeinfreie Vorlage nur als STOFF — die Nacherzählung ist
 * eigenes Werk; CC-BY-SA-Quellen mit Namensnennung; Herkunft je Serie erfasst.
 * Zeichensatz wie im Bestand: keine Anführungszeichen (wörtliche Rede ohne),
 * Ziffern ausgeschrieben, Satzzeichen nur . , - ? ! : ;
 */
import type { Serie } from "./serie";


/** Sagen-Stoff, modern und entschärft nacherzählt (Vorlage gemeinfrei). */
const DIE_MARTINSWAND: Serie = {
  slug: "die-martinswand",
  titel: "Die Martinswand",
  kind: "geschichte",
  stufen: ["teens"],
  minTier: 3,
  topic: "sage",
  herkunft: {
    quelle: "Nach der Tiroler Sage von Kaiser Maximilian in der Martinswand",
    lizenz: "Vorlage gemeinfrei; Nacherzählung: eigenes Werk (modern, in eigenen Worten)",
    autor: "Sensorik-Lernplattform; Textgrundlage: Joseph Carl Maurer, Die Martinswand in Tirol, Die Gartenlaube 1887, Heft 52, S. 872-873",
    fundstelle: "https://de.wikisource.org/wiki/Die_Martinswand_in_Tirol (abgerufen 2026-07-27)",
  },
  etappen: [
    {
      lines: [
        "Hoch über dem Inntal in Tirol ragt eine graue Felswand in den Himmel.",
        "Die Leute nennen sie die Martinswand, und sie ist steiler als jeder Turm.",
        "Vor mehr als fünfhundert Jahren lebte der junge Fürst Maximilian.",
        "Später nannten ihn alle Kaiser Max, doch damals war er kaum erwachsen.",
        "Nichts liebte er mehr als die Jagd in den Bergen rund um Innsbruck.",
        "An einem klaren Morgen folgte er einer Gämse die Hänge hinauf.",
        "Seine Begleiter blieben zurück, denn ihnen war der Fels zu steil.",
        "Wartet hier, rief Max, ich bin vor dem Abend wieder bei euch.",
        "Die Gämse sprang von Band zu Band, und Max kletterte ihr nach.",
        "Er achtete nur auf das Tier und nicht auf den Weg unter seinen Füßen.",
        "Als er endlich innehielt, stand er auf einem schmalen Felsvorsprung.",
        "Er blickte zurück und erschrak: Der Weg hinter ihm war verschwunden.",
      ],
    },
    {
      lines: [
        "Vor Max fiel die Wand senkrecht ab, unter ihm gähnte das leere Tal.",
        "Kein Vorsprung führte weiter, kein Band, keine Rinne, kein Halt.",
        "Er rief um Hilfe, doch der Wind riss ihm die Worte vom Mund.",
        "Tief unten glänzte der Inn wie ein dünner silberner Faden.",
        "Die Sonne sank, und mit den Schatten kroch die Kälte den Fels herauf.",
        "Max drückte sich an den Stein und wartete zitternd auf den Morgen.",
        "Im Tal suchten seine Begleiter unterdessen jeden Pfad ab.",
        "Erst am nächsten Tag entdeckte ein Hirte den Punkt in der Wand.",
        "Dort oben bewegt sich etwas, rief er, dort oben ist ein Mensch!",
        "Bald standen die Leute von Zirl am Fuß der Wand und starrten hinauf.",
        "Das ist der junge Fürst, sagte ein Jäger leise, ich kenne seinen Mantel.",
        "Doch wie sollte je ein Mensch dort hinaufkommen?",
      ],
    },
    {
      lines: [
        "Die besten Kletterer aus dem Tal versuchten den Aufstieg.",
        "Einer nach dem anderen kehrte um: Die Wand ließ niemanden hinauf.",
        "Man band Seile zusammen und ließ sie von oben über den Grat hinab.",
        "Doch die Seile waren zu kurz, und der Fels hing weit über.",
        "Zwei Tage und zwei Nächte saß Max nun schon auf dem Vorsprung.",
        "Hunger und Durst quälten ihn, und seine Hände zitterten vor Kälte.",
        "Im Tal wurde es still, dann begann die Glocke von Zirl zu läuten.",
        "Der Priester trat mit seinen Leuten an den Fuß der Wand.",
        "Von dort unten sprach er den letzten Segen für den Fürsten.",
        "Max hörte die Glocke und begriff: Sie hielten ihn für verloren.",
        "Er schloss die Augen und dachte an alles, was er noch vorhatte.",
        "Da knirschte neben ihm ein Schritt auf dem Stein.",
      ],
    },
    {
      lines: [
        "Neben Max stand auf einmal ein Junge in einfacher Bauernkleidung.",
        "Niemand hatte ihn kommen sehen, kein Ruf hatte ihn angekündigt.",
        "Komm mit, sagte der Junge ruhig, ich kenne einen Weg durch die Wand.",
        "Max starrte ihn an: Woher kommst du? Hier gibt es doch keinen Weg.",
        "Der Junge lächelte nur und deutete auf eine schmale Felsrinne.",
        "Sie war die ganze Zeit da gewesen, und keiner hatte sie bemerkt.",
        "Schritt für Schritt führte der Junge den Fürsten durch den Fels.",
        "Setz den Fuß genau dorthin, wo ich ihn setze, sagte er nur.",
        "Max fragte nicht mehr, er kletterte und zählte seine Atemzüge.",
        "Nach einer langen Stunde wurde der Hang endlich flacher.",
        "Grüne Matten tauchten auf, und unten jubelten die Menschen.",
        "Max drehte sich zu seinem Retter um - doch da war niemand mehr.",
      ],
    },
    {
      lines: [
        "Der Junge blieb verschwunden, so gründlich man auch nach ihm suchte.",
        "Kein Hof im Tal vermisste einen Sohn, kein Hirte kannte sein Gesicht.",
        "Die Leute von Zirl erzählten bald, ein Engel habe den Fürsten gerettet.",
        // R2: indirekte Rede im Konjunktiv - die Zeile davor macht es vor
        // („ein Engel habe den Fürsten gerettet").
        "Andere meinten, es sei ein Jägerbursche gewesen, der keinen Dank wollte.",
        "Was stimmt, weiß bis heute niemand, und genau das ist das Rätsel.",
        "Max aber vergaß den schmalen Vorsprung in der Wand nie.",
        "Er ließ die Stelle zu einer Grotte erweitern und ein Kreuz aufstellen.",
        "Hoch über dem Tal erinnert es bis heute an die zwei langen Nächte.",
        "Aus dem jungen Fürsten wurde später wirklich Kaiser Max.",
        "Er regierte über viele Länder und erlebte viele Abenteuer.",
        "Doch wenn er von der Martinswand sprach, wurde er still.",
        "Wer dort hinaufschaut, versteht auch heute noch, warum.",
      ],
    },
  ],
};

/** Gegenwarts-Mystery in Ich-Perspektive — Ton 13+, selbst verfasst. */
const DIE_NACHRICHT_AUF_SEITE_ZWOELF: Serie = {
  slug: "die-nachricht-auf-seite-zwoelf",
  titel: "Die Nachricht auf Seite zwölf",
  kind: "geschichte",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "mystery",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Seit drei Wochen wohne ich in dieser Stadt, und noch immer verlaufe ich mich.",
        "Meine Mutter hat hier eine Stelle als Ärztin angetreten, deshalb der Umzug.",
        "Mein Vater packt zu Hause noch Kisten aus, ich suche lieber die Bücherei.",
        "Ich heiße übrigens Ayla, und ich lese lieber, als dass ich rede.",
        "Im Regal ganz hinten finde ich einen alten Roman mit blauem Einband.",
        "Auf Seite zwölf steht mit Bleistift etwas am Rand geschrieben.",
        "Ich halte den Atem an und lese die Zeile gleich zweimal.",
        "Du, die das zufällig findest: Der Brunnen am Markt hütet den Anfang.",
        "Darunter steht nur noch ein einzelnes Wort: Bitte.",
        "Ich klappe das Buch zu und schaue mich um, aber niemand beachtet mich.",
        "Am Ausgang treffe ich Jonas aus meiner Klasse, den einzigen, den ich kenne.",
        "Ich zeige ihm die Seite, und er sagt sofort: Das sehen wir uns an.",
      ],
    },
    {
      lines: [
        "Am nächsten Nachmittag stehen wir zu zweit am Brunnen auf dem Marktplatz.",
        "Das Wasser plätschert, Tauben spazieren herum, nichts wirkt geheimnisvoll.",
        "Wir gehen den Rand ab, Stein für Stein, und fühlen uns ziemlich albern.",
        "Dann entdeckt Jonas eine Metallplatte mit eingravierten Buchstaben.",
        "Für die, die suchen: Zählt die Bögen der alten Brücke, steht darauf.",
        "Die alte Brücke kenne ich, sie liegt gleich hinter dem Rathaus.",
        "Wir zählen ihre Bögen: Es sind sieben, daran gibt es keinen Zweifel.",
        "Unter dem siebten Bogen führt ein heller Uferweg entlang.",
        "In der Mauer steckt lose ein Ziegel, dahinter liegt eine Blechdose.",
        "Meine Hände zittern ein bisschen, als ich den Deckel öffne.",
        "Darin liegt ein Foto von einer Baustelle und eine alte Karte der Stadt.",
        "Und auf der Rückseite des Fotos steht: Fragt in der Bücherei nach Elly.",
      ],
    },
    {
      lines: [
        "Frau Halilovic von der Ausleihe mustert uns über ihre Brille hinweg.",
        "Elly, wiederholt sie langsam, diesen Namen habe ich lange nicht gehört.",
        "Sie führt uns zu einer Vitrine mit alten Fotos aus der Stadt.",
        "Auf einem Bild steht eine junge Frau im Bauhelm vor der alten Brücke.",
        "Das ist Elly Duarte, sagt sie, die Ingenieurin, die die Brücke gebaut hat.",
        "Ich lege unser Foto daneben: Es zeigt genau dieselbe Baustelle.",
        "Frau Halilovic wird ganz still und setzt sich erst einmal hin.",
        "Diese Spur hat Elly vor über zwanzig Jahren gelegt, erzählt sie dann.",
        "Für ihre Enkelin, doch die Familie zog weg, und niemand suchte je danach.",
        "Jonas fragt das, was ich gerade denke: Lebt Elly denn noch?",
        "Frau Halilovic lächelt und greift zum Telefon.",
        "Eine Stunde später stehen wir vor einem Haus mit einem wilden Garten.",
      ],
    },
    {
      lines: [
        "Elly Duarte ist vierundachtzig und trägt eine Brille an einer Kette.",
        "Sie hört uns zu, ohne uns ein einziges Mal zu unterbrechen.",
        "Dann holt sie eine Schachtel voller Pläne und vergilbter Zeichnungen.",
        "Als Kind wollte ich Brücken bauen, und alle fanden das unpassend, sagt sie.",
        "Ich habe es trotzdem gemacht, und die Brücke steht heute noch.",
        "Die Spur habe ich für meine Enkelin gelegt, damit sie die Stadt entdeckt.",
        "Aber ihr zwei seid genauso gute Finder, findet ihr nicht?",
        "Ich frage sie, ob die Spur denn nun hier zu Ende ist.",
        "Elly beugt sich vor, und ihre Augen funkeln wie die eines Teenagers.",
        "Der letzte Hinweis, sagt sie, wartet seit zwanzig Jahren auf seine Finder.",
        "Er liegt dort, wo die Stadt ihr Gedächtnis aufbewahrt.",
        "Jonas und ich schauen uns an: Wo bewahrt eine Stadt ihr Gedächtnis auf?",
      ],
    },
    {
      lines: [
        "Wir raten den ganzen Heimweg lang: das Rathaus, der Turm, das Museum?",
        "Dann fällt es mir ein: das Stadtarchiv im Keller der Bücherei.",
        "Frau Halilovic schließt uns den Raum am nächsten Morgen auf.",
        "Zwischen zwei Regalen hängt ein Bild der fertigen Brücke.",
        "Dahinter klebt ein flacher Umschlag, seit Jahren unberührt.",
        "Darin liegt Ellys Notizbuch aus dem Jahr des Brückenbaus.",
        "Auf der ersten Seite steht: Für die, die nach mir kommen.",
        "Die Zeitung schreibt später eine ganze Seite über unsere Suche.",
        "Elly sitzt bei der Übergabe in der ersten Reihe und strahlt.",
        "Das Notizbuch bekommt einen Platz in der Vitrine, neben ihrem Foto.",
        "Ich verlaufe mich übrigens immer noch, aber es macht mir nichts mehr aus.",
        "Eine Stadt gehört dir, sobald du eine ihrer Geschichten kennst.",
      ],
    },
  ],
};

/**
 * Sachtext-Serie: der Weg einer Nachricht durchs Netz.
 *
 * 29.07.: zusätzlich für **13–15** freigegeben. Der Bestand hatte an dieser
 * Stelle eine gemessene Lücke — `c ∩ erwachsen` war **0**, die Stufe 13–15 erbte
 * ausschließlich von 10–12 (elf der vierzehn geerbten Serien handeln von
 * Regenwurm, Marienkäfer, Ameise, Biene). Ein reiner Sachtext über E-Mail-Technik
 * ist für Jugendliche altersgerecht; die Freigabe kostet keine einzige neue
 * Zeile. Ledger-sicher: `stufen` geht nicht in die `bausteinId` ein, und Serien
 * laufen ohnehin über `storyProgress` statt über das Bitset.
 * „Die Bank am Fluss" bleibt bewusst außen vor (Büro und Mittagspause sind
 * erwachsen gerahmt).
 */
const WIE_EINE_E_MAIL_REIST: Serie = {
  slug: "wie-eine-e-mail-reist",
  titel: "Wie eine E-Mail reist",
  kind: "wissen-serie",
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: {
    quelle: "Eigene Verdichtung nach Wikipedia (Artikel E-Mail u. a.)",
    lizenz: "CC-BY-SA 4.0 (Ableitung; Danksagungs-Bereich)",
    autor: "Sensorik-Lernplattform; Grundlage: Wikipedia-Autorinnen und -Autoren",
    fundstelle: "https://de.wikipedia.org/wiki/E-Mail (abgerufen 2026-07-27)",
  },
  etappen: [
    {
      lines: [
        "Eine E-Mail wirkt alltäglich, doch ihre Reise ist erstaunlich weit.",
        "Alles beginnt mit einer Adresse, die aus zwei Teilen besteht.",
        "Vor dem At-Zeichen steht der Name des Postfachs.",
        "Dahinter folgt die Domain, also die Anschrift des zuständigen Anbieters.",
        "Dieses Muster ist älter, als viele denken.",
        "Die erste Mail von Rechner zu Rechner gab es Anfang der Siebzigerjahre.",
        "Der Entwickler Ray Tomlinson wählte damals das At-Zeichen als Trenner.",
        "Es wurde kaum genutzt und tauchte in keinem Nutzernamen auf: perfekt.",
        "Bis heute trennt es den Namen von dem Ort, an den die Post gehen soll.",
        "Wer auf Senden drückt, übergibt die Mail zunächst dem eigenen Anbieter.",
        "Dessen Server nimmt sie an wie ein Postamt den Brief.",
        "Doch woher weiß er, wohin die Reise gehen soll?",
      ],
    },
    {
      lines: [
        "Der Server liest die Domain hinter dem At-Zeichen der Empfängerin.",
        "Dann fragt er das weltweite Adressverzeichnis des Internets.",
        "Dieses Verzeichnis übersetzt Namen in die Adressen von Rechnern.",
        "Ein eigener Eintrag verrät, welcher Server die Post einer Domain annimmt.",
        "Nun kennt der Absende-Server sein Ziel und baut die Verbindung auf.",
        "Die Mail selbst reist dabei nicht als ein großes Stück.",
        "Sie wird in viele kleine Datenpakete zerlegt.",
        "Jedes Paket trägt Absender, Ziel und eine laufende Nummer.",
        "Router lesen das Ziel und reichen jedes Paket weiter.",
        "Dabei dürfen die Pakete durchaus verschiedene Wege nehmen.",
        "Am Ziel werden sie anhand der Nummern wieder zusammengesetzt.",
        "Aber wie überqueren die Pakete eigentlich einen Ozean?",
      ],
    },
    {
      lines: [
        "Zwischen den Kontinenten reist fast der gesamte Datenverkehr durch Kabel.",
        "Sie liegen auf dem Meeresboden, teils in mehreren tausend Metern Tiefe.",
        "Funk und Satellit spielen daneben nur eine kleine Nebenrolle.",
        "In den Kabeln stecken Glasfasern, jede so dünn wie ein Haar.",
        "Die Daten reisen darin als winzige Lichtblitze.",
        "So überquert ein Paket den Atlantik in Sekundenbruchteilen.",
        "Verlegt und repariert werden die Kabel von Spezialschiffen.",
        "Reißt ein Kabel, heben Roboter es vom Grund, und Fachleute verschweißen es.",
        "Für unsere Mail bleibt von alldem nichts zu spüren.",
        "Sie springt von Station zu Station, quer durch Länder und Meere.",
        "Nach kurzer Zeit meldet sich der Zielserver: Ich bin zuständig.",
        "Was geschieht nun mit der angekommenen Post?",
      ],
    },
    {
      lines: [
        "Der Zielserver prüft die Adresse und nimmt die Mail entgegen.",
        "Unterwegs war sie in aller Regel verschlüsselt.",
        "Diese Transportverschlüsselung ist heute der übliche Standard.",
        "Vor der Zustellung schaut noch ein Wächter auf die Mail: der Spamfilter.",
        "Er sortiert unerwünschte Massenpost in einen eigenen Ordner.",
        "Alles andere landet im Postfach der Empfängerin.",
        "Ihr Gerät holt die Mail von dort ab, ob Handy oder Rechner.",
        "Erst in diesem Moment wird aus den Paketen wieder lesbarer Text.",
        "Die ganze Reise dauerte nur wenige Sekunden.",
        "Ein Brief wäre für dieselbe Strecke tagelang unterwegs.",
        "Beim nächsten Klick auf Senden lohnt ein kurzer Gedanke daran.",
        "Unter dem Meer blitzt dann wieder ein wenig Licht.",
      ],
    },
  ],
};

/**
 * Sachtext-Serie: von der Kaffeekirsche zur Tasse.
 * 29.07. ebenfalls für **13–15** freigegeben — Begründung siehe
 * {@link WIE_EINE_E_MAIL_REIST}. Warenkunde von der Pflanze bis zur Röstung ist
 * Schulstoff, kein Erwachsenen-Thema.
 */
const KAFFEE_VON_DER_KIRSCHE_IN_DIE_TASSE: Serie = {
  slug: "kaffee-von-der-kirsche-in-die-tasse",
  titel: "Kaffee: von der Kirsche in die Tasse",
  kind: "wissen-serie",
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: {
    quelle: "Eigene Verdichtung nach Wikipedia (Artikel Kaffee u. a.)",
    lizenz: "CC-BY-SA 4.0 (Ableitung; Danksagungs-Bereich)",
    autor: "Sensorik-Lernplattform; Grundlage: Wikipedia-Autorinnen und -Autoren",
    fundstelle: "https://de.wikipedia.org/wiki/Kaffee (abgerufen 2026-07-27)",
  },
  etappen: [
    {
      lines: [
        "Kaffee wächst als Strauch in den warmen Ländern rund um den Äquator.",
        "Man spricht vom Kaffeegürtel, der sich einmal um die Erde zieht.",
        "Die beiden wichtigsten Arten heißen Arabica und Robusta.",
        "Zusammen liefern sie fast den gesamten Kaffee der Welt.",
        "Arabica gedeiht am besten im kühleren Hochland.",
        "Eine junge Pflanze braucht Geduld: Erst nach drei bis vier Jahren trägt sie.",
        "Ihre Blüten sind weiß und duften nach Jasmin.",
        "Aus den Blüten werden rote Früchte, die Kaffeekirschen.",
        "In jeder Kirsche stecken meist zwei Samen: die Kaffeebohnen.",
        "Die Heimat des Arabica liegt im Hochland von Äthiopien.",
        "Eine Legende erzählt dort von einem Hirten und seinen munteren Ziegen.",
        "Doch wie kommen die Bohnen aus der Kirsche heraus?",
      ],
    },
    {
      lines: [
        "Kaffeekirschen werden nicht alle zur gleichen Zeit reif.",
        "An einem Zweig hängen reife und unreife Früchte nebeneinander.",
        "Für gute Qualität wird darum vielerorts von Hand gepflückt.",
        "Die Pflückerinnen kehren alle paar Tage zu denselben Sträuchern zurück.",
        "Nach der Ernte müssen die Bohnen aus dem Fruchtfleisch heraus.",
        "Bei der trockenen Aufbereitung trocknen die Kirschen in der Sonne.",
        "Bei der gewaschenen Aufbereitung löst Wasser das Fruchtfleisch ab.",
        "Beide Wege prägen den späteren Geschmack auf eigene Art.",
        "Übrig bleibt der Rohkaffee mit blassgrünen Bohnen.",
        "In Säcke verpackt reist er per Schiff um die halbe Welt.",
        "Noch schmeckt er nach wenig und riecht kaum nach Kaffee.",
        "Was verwandelt die grüne Bohne in das dunkle Gold?",
      ],
    },
    {
      lines: [
        "Die Verwandlung geschieht in der Rösterei.",
        "Dort werden die Bohnen auf rund zweihundert Grad erhitzt.",
        "Sie verlieren Wasser, werden größer und knacken hörbar.",
        "Fachleute nennen diesen Moment den ersten Crack.",
        "Aus hellen Bohnen werden goldbraune bis dunkle.",
        "Dabei entstehen viele hundert verschiedene Aromastoffe.",
        "Je länger die Röstung dauert, desto kräftiger wird der Geschmack.",
        "Helle Röstungen schmecken feiner und oft ein wenig fruchtig.",
        "Danach kühlen die Bohnen rasch ab, damit das Aroma erhalten bleibt.",
        "Frisch gemahlen entfalten sie ihren vollen Duft.",
        "Nun fehlt eigentlich nur noch heißes Wasser.",
        "Aber warum macht uns das Getränk überhaupt wach?",
      ],
    },
    {
      lines: [
        "Heißes Wasser löst Aroma und Koffein aus dem Kaffeemehl.",
        "Koffein wirkt anregend: Es vertreibt für eine Weile die Müdigkeit.",
        "Wer das nicht möchte, greift zu entkoffeiniertem Kaffee.",
        "Rund um das Getränk ist eine eigene Kultur gewachsen.",
        "In Wien gehört das Kaffeehaus seit Jahrhunderten zur Stadt.",
        "Man sitzt am Marmortisch, liest Zeitung und bleibt, solange man will.",
        "Die Wiener Kaffeehauskultur gilt als immaterielles Kulturerbe.",
        "So steht es im österreichischen Verzeichnis der UNESCO-Kommission.",
        "Für viele Länder der Tropen ist Kaffee ein wichtiges Exportgut.",
        "Vom Strauch bis zur Tasse haben viele Hände mitgearbeitet.",
        "Die nächste Tasse erzählt also eine ziemlich lange Geschichte.",
        "Sie beginnt an einem Hang in den Tropen und endet bei uns am Tisch.",
      ],
    },
  ],
};

/** Ruhige Erzählung für Erwachsene — kein Kinderbuch-Ton. */
const DIE_BANK_AM_FLUSS: Serie = {
  slug: "die-bank-am-fluss",
  titel: "Die Bank am Fluss",
  kind: "geschichte",
    // S3: nuechterne Erzaehlung ohne Kinderbuch-Ton - sie gehoert auch den
  // 11- bis 15-Jaehrigen (Ersatz fuer die drei abgegebenen Sachkunde-Reihen).
stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Seit dem Frühjahr esse ich mittags auf der Bank am Fluss.",
        "Der Weg dorthin dauert vom Büro aus genau sieben Minuten.",
        "Anfangs kam ich her, um dem Drucker im Flur zu entgehen.",
        "Inzwischen komme ich wegen des Wassers und der Ruhe.",
        "Der Fluss hat es nicht eilig, und das färbt ab.",
        "Mit der Zeit lernte ich die anderen Stammgäste kennen.",
        "Der Mann mit dem grauen Hund grüßt immer zuerst.",
        "Die Läuferin mit dem roten Stirnband grüßt nie, sie nickt nur.",
        "Zwei Alte teilen sich jeden Tag eine Zeitung und tauschen die Teile.",
        "Niemand redet viel, und gerade das ist angenehm.",
        "Neben der Bank wächst ein Rosenstock, der erstaunlich gepflegt aussieht.",
        "Irgendjemand kümmert sich darum, nur wer?",
      ],
    },
    {
      lines: [
        "Im Sommer riecht der Fluss nach Sonne und ein wenig nach Schlamm.",
        "Die Bank steht dann im Schatten einer alten Linde.",
        "Ich beobachte die Ausflugsboote und zähle die winkenden Hände.",
        "Es winken übrigens fast nur Menschen, die selbst im Boot sitzen.",
        "An einem Dienstag lag ein Buch auf der Bank, sorgfältig eingebunden.",
        "Ein Zettel steckte darin: Zu verschenken, gern weiterlegen.",
        "Ich nahm es mit, las es in einer Woche und legte es zurück.",
        "Seither wandern immer wieder Bücher über diese Bank.",
        "Der Mann mit dem Hund behauptet, die Läuferin habe damit angefangen.",
        "Die Läuferin nickte nur, als ich sie danach fragte.",
        "Der Rosenstock blühte den ganzen August in einem satten Rot.",
        "Und noch immer wusste ich nicht, wer ihn goss.",
      ],
    },
    {
      lines: [
        "Im Oktober trieb buntes Laub wie eine kleine Flotte auf dem Wasser.",
        "Die Zeitungsleser rückten enger zusammen und froren würdevoll.",
        "Eines Mittags war die Bank frisch gestrichen, dunkelgrün und tadellos.",
        "Kein Schild, kein Hinweis, nur der leise Geruch von Farbe.",
        "Die Stadt war es nicht, sagte der Mann mit dem Hund bestimmt.",
        "Er hatte bei der Verwaltung angerufen, aus reiner Neugier.",
        "Dort wusste niemand von einem Anstrich an unserem Ufer.",
        "Nun hatten wir also einen stillen Wohltäter mit Pinsel.",
        // R4 (Prüfbericht §6.13): Die nächste Zeile las vom „Becher" - abgestellt
        // war aber nur eine Thermoskanne.
        "Die Läuferin stellte eine Thermoskanne mit Tee und Becher auf die Lehne.",
        "Für alle, stand auf dem Becher, bitte zurückstellen.",
        "So wurde die Bank langsam zu einem kleinen Gemeinwesen.",
        "Nur das Rätsel mit den Rosen blieb weiter ungelöst.",
      ],
    },
    {
      lines: [
        "Im Winter kam ich seltener, aber ich kam.",
        "Der Fluss dampfte an kalten Morgen wie eine Suppe.",
        "Kurz vor Weihnachten traf ich schließlich die Antwort auf meine Frage.",
        "Eine Frau in Arbeitsjacke schnitt den Rosenstock fachkundig zurück.",
        "Sie stellte sich vor: Ich bin Ruza, ich war hier früher Gärtnerin.",
        "Die Bank habe sie vor vielen Jahren selbst aufgestellt, erzählte sie.",
        "Der Rosenstock stammt noch aus ihrem ersten Lehrjahr.",
        "Jetzt bin ich in Rente, sagte sie, aber Rosen kennen keinen Ruhestand.",
        "Ich bedankte mich für den schönsten Mittagsplatz der Stadt.",
        "Sie winkte ab: Der Platz gehört dem Fluss, ich schneide nur nach.",
        "Im Frühjahr sitzt sie nun manchmal neben uns auf der Bank.",
        "Der Fluss hat es weiter nicht eilig, und wir haben es auch nicht mehr.",
      ],
    },
  ],
};

/** TN-E5/TN-E6-Serien (append-only an SERIEN gehängt). */
export const SERIEN_JUGEND_ERWACHSEN: readonly Serie[] = [
  DIE_MARTINSWAND,
  DIE_NACHRICHT_AUF_SEITE_ZWOELF,
  WIE_EINE_E_MAIL_REIST,
  KAFFEE_VON_DER_KIRSCHE_IN_DIE_TASSE,
  DIE_BANK_AM_FLUSS,
];
