/**
 * Bücherei-Nachschub für ERWACHSENE auf vollem Alphabet (29.07.2026).
 *
 * ANLASS (gemessen, nicht geschätzt): Die Erwachsenen-Bücherei hatte drei Serien
 * = **12 Etappen** Lesestoff. Seit dem 28.07. kündigt die App nach JEDER Runde
 * eine Geschichte an — wer immer bestätigt, ist damit nach zwölf Runden durch
 * die ganze Bücherei, danach kommt nie wieder ein Angebot. Zusammen mit der
 * frühen Treppe aus `serienFrueh.ts` (drei weitere Serien für c + erwachsen)
 * verdoppelt diese Datei den Bestand noch einmal.
 *
 * Zwei Sorten, wie im Bestand:
 *  • eine **Wissens-Serie** (Sachtext, jede Zahl doppelt belegt — Quellen unten
 *    an der Serie),
 *  • eine **Erzählung** (eigenes Werk, keine Fremdrechte).
 *
 * ZEICHENSATZ wie im Bestand: keine Anführungszeichen (wörtliche Rede ohne —
 * Entscheidung Johannes 28.07.), **keine Ziffern** (ausgeschrieben), Satzzeichen
 * nur . , - ? ! : ;
 */
import type { Serie } from "./serie";

/**
 * Sachtext für Erwachsene. Jede Zahl stammt aus zwei unabhängigen Quellen:
 * dem österreichischen Landwirtschafts-/Umweltministerium (BMLUK) für die
 * Versorgungszahlen und der Wikipedia für die Wiener Hochquellenleitung; die
 * Druck-Faustregel („zehn Meter ≈ ein bar") ist zusätzlich physikalisch geprüft
 * (hydrostatischer Druck einer Wassersäule von zehn Metern ≈ 0,98 bar).
 *
 * Bewusst NICHT übernommen: Formulierungen. Der Text ist eigene Verdichtung,
 * die Quellen liefern die Fakten (Bauplan §4/§10).
 */
const WIE_DAS_WASSER_IN_DIE_LEITUNG_KOMMT: Serie = {
  slug: "wie-das-wasser-in-die-leitung-kommt",
  titel: "Wie das Wasser in die Leitung kommt",
  kind: "wissen-serie",
    // S3: Sachkunde auf Augenhoehe (Trinkwasser in Oesterreich) - gehoert auch
  // den 11- bis 15-Jaehrigen.
stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: {
    quelle: "Eigene Verdichtung nach BMLUK (Wasserversorgung in Österreich) und Wikipedia",
    lizenz: "CC-BY-SA 4.0 (Ableitung; Danksagungs-Bereich)",
    autor: "Sensorik-Lernplattform; Grundlagen: BMLUK, Wikipedia-Autorinnen und -Autoren",
    fundstelle:
      "https://www.bmluk.gv.at/themen/wasser/nutzung-wasser/wasserversorgung/versorgung.html und https://de.wikipedia.org/wiki/I._Wiener_Hochquellenleitung (abgerufen 2026-07-29)",
  },
  etappen: [
    {
      lines: [
        "Österreich zählt zu den wasserreichsten Ländern Europas.",
        "Das Trinkwasser stammt hier fast zur Gänze aus dem Boden.",
        "Etwa die Hälfte kommt aus Grundwasserbrunnen, der Rest aus Quellen.",
        "Flusswasser spielt für die Trinkwasserversorgung praktisch keine Rolle.",
        "Rund dreiundneunzig Prozent hängen an einer öffentlichen Leitung.",
        "Die übrigen sieben Prozent schöpfen aus einem eigenen Hausbrunnen.",
        "Etwa fünftausendfünfhundert Wasserversorger teilen sich die Arbeit.",
        "Viele davon sind winzig: eine Gemeinde, eine Quelle, ein Behälter.",
        "Das Rohrnetz ist zusammen fast achtzigtausend Kilometer lang.",
        "Das ist fast zweimal der Umfang der Erde.",
        "Und doch merkt man davon nichts, solange alles läuft.",
        "Genau darum lohnt ein Blick auf den Weg des Wassers.",
      ],
    },
    {
      lines: [
        "Am Anfang steht Regen, der im Boden versickert.",
        "Sand und Kies wirken dabei wie ein langsamer Filter.",
        "Je länger das Wasser unterwegs ist, desto sauberer wird es.",
        "In einem Brunnen wird es wieder heraufgeholt.",
        "Eine Quelle nimmt einem die Arbeit ab: Dort tritt es von selbst aus.",
        "Wien bekam seine erste Hochquellenleitung im Jahr achtzehnhundertdreiundsiebzig.",
        "Sie war bei der Eröffnung gut fünfundneunzig Kilometer lang.",
        "Das Wasser fließt allein durch das Gefälle in die Stadt.",
        "Die Hauptleitung braucht dafür bis heute keine einzige Pumpe.",
        "Unterwegs überquert es dreißig Aquädukte und andere Talübergänge.",
        "Was vor mehr als hundertfünfzig Jahren gebaut wurde, trägt noch.",
        "Der Rest des Landes arbeitet nach demselben Grundgedanken.",
      ],
    },
    {
      lines: [
        "Damit aus dem Hahn etwas kommt, braucht es Druck.",
        "Den macht in den meisten Netzen die Schwerkraft.",
        "Dafür steht das Wasser in einem Hochbehälter über dem Ort.",
        // R2: ausgeschrieben ist die Druckeinheit ein Substantiv - „das Bar".
        "Je zehn Meter Höhenunterschied ergeben etwa ein Bar Druck.",
        "Ein Behälter dreißig Meter über dem Haus liefert also rund drei Bar.",
        "Pumpen laufen dann nur, um den Behälter wieder zu füllen.",
        "Wer höher wohnt als der Behälter, braucht eine eigene Druckanlage.",
        "Der Behälter gleicht auch die Stunden des Tages aus.",
        "Nachts füllt er sich, morgens leeren ihn alle Duschen zugleich.",
        "Und er hält einen Vorrat für den Ernstfall bereit.",
        "Brennt es, zieht die Feuerwehr aus demselben Netz.",
        "Ein Wasserturm ist nichts anderes: ein Hochbehälter auf Stelzen.",
      ],
    },
    {
      lines: [
        "Vom Behälter läuft das Wasser in immer feinere Rohre.",
        "Am Hausanschluss sitzen ein Schieber und ein Zähler.",
        "Der Zähler misst, was durchgeht, nicht, was jemand trinkt.",
        "Denn getrunken wird erstaunlich wenig davon.",
        "Nur etwa drei Prozent gehen ins Glas und in den Kochtopf.",
        "Ein Viertel spült die Toilette hinunter.",
        "Rund ein Fünftel geht in Dusche und Wanne.",
        "Alles davon hat Trinkwasserqualität, auch das für die Toilette.",
        "Das klingt nach Verschwendung und ist doch die einfachste Lösung.",
        "Ein zweites Netz für schlechteres Wasser müsste neu gebaut werden.",
        "Am Ende zählt eine Frage: Ist das Wasser am Hahn geprüft und rein?",
        "Wer das nächste Mal ein Glas füllt, hat all das hinter sich.",
      ],
    },
  ],
};

/** Ruhige Gegenwarts-Erzählung für Erwachsene — eigenes Werk. */
const DER_ZWEITE_SCHLUESSEL: Serie = {
  slug: "der-zweite-schluessel",
  titel: "Der zweite Schlüssel",
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
        "Die Wohnung war günstig, weil sie im vierten Stock ohne Lift liegt.",
        "Ich zog an einem Samstag im März ein.",
        "Die Vormieterin hatte alles besenrein hinterlassen.",
        "Nur in der obersten Küchenlade lag noch etwas.",
        "Ein Schlüssel, alt, aus Messing, mit einem Bart wie eine Zinne.",
        "Kein Zettel, kein Name, nichts.",
        "Ich probierte ihn an der Wohnungstür. Er passte nicht.",
        "Ich probierte ihn am Keller. Auch nicht.",
        "Am Briefkasten war er zu groß.",
        "Ich legte ihn zurück in die Lade und vergaß ihn.",
        "Drei Monate später fiel er mir beim Suchen wieder in die Hand.",
        "Seitdem ließ er mich nicht mehr los.",
      ],
    },
    {
      lines: [
        "Die Hausverwaltung wusste nichts von einem zweiten Schlüssel.",
        "Die Vormieterin war nach Kanada gezogen, Adresse unbekannt.",
        "Also fragte ich mich durch das Haus.",
        "Herr Bilic im Parterre wohnt hier seit vierzig Jahren.",
        "Er sah den Schlüssel an und drehte ihn zweimal um.",
        "So einen hatten wir alle, sagte er. Für die Waschküche.",
        "Nur: Die Waschküche gibt es seit zwei Jahrzehnten nicht mehr.",
        "Dort stehen heute die Fahrräder.",
        "Und das Schloss?",
        "Er zuckte mit den Schultern. Ausgetauscht, vermutlich.",
        // R4 (Prüfbericht §6.10): Die „Kartons im Keller" tauchten erst in der
        // Schluss-Etappe als Schrift-Vergleich auf, ohne je eingeführt zu sein.
        "Trotzdem ging ich hinunter, vorbei an beschrifteten Kartons, und probierte es.",
        "Der Schlüssel drehte sich nicht einmal halb.",
      ],
    },
    {
      lines: [
        "Im August kam die Hitze und mit ihr die Langeweile.",
        "Ich fing an, das Haus zu lesen wie ein Buch.",
        "Jede Tür, jede Klappe, jedes vergessene Schloss.",
        "Der Dachboden hatte ein neues Schloss.",
        "Der Fahrradraum hatte ein Zahlenschloss.",
        "Die Klappe zum Lichtschacht war verrostet und viel zu klein.",
        "Dann sah ich die niedrige Tür neben der Treppe zum Hof.",
        "Ich war zweihundert Mal daran vorbeigegangen.",
        "Sie ist so niedrig, dass man sich bücken muss.",
        "Der Schlüssel ging hinein, als wäre er nie woanders gewesen.",
        "Er drehte sich einmal, zweimal, dann sprang die Tür auf.",
        "Dahinter war es dunkel und roch nach Erde und Öl.",
      ],
    },
    {
      lines: [
        "Ein Raum, keine drei Schritte tief, mit einer Lampe an einer Schnur.",
        "An der Wand hing Werkzeug, ordentlich nach Größe sortiert.",
        "Hobel, Zangen, ein Satz Stechbeitel mit hölzernen Griffen.",
        "Alles geölt, alles ohne Rost, alles seit Jahren unberührt.",
        "Auf der Werkbank lag ein Zettel, mit Bleistift beschrieben.",
        "Wer das hier findet, kann es brauchen. Bitte nicht wegwerfen.",
        "Kein Name. Dieselbe Schrift wie auf den Kartons im Keller.",
        "Ich holte Herrn Bilic herunter. Er wurde ganz still.",
        // R4 (Prüfbericht §6.11): „zwei Stockwerke über" dem vierten Stock
        // ergäbe einen sechsten - in einem Haus ohne Lift, in dem eine Frau bis
        // ins hohe Alter wohnte. Zwei Stockwerke darunter geht auf.
        "Das war Frau Haslinger, sagte er. Zwei Stockwerke unter dir.",
        "Sie hat hier bis ins hohe Alter Möbel wieder gerade gerückt.",
        "Seitdem hängt der Zettel bei mir über der Werkbank.",
        "Und die Tür neben der Treppe steht offen, wenn jemand etwas braucht.",
      ],
    },
  ],
};

export const SERIEN_ERWACHSEN: readonly Serie[] = [
  WIE_DAS_WASSER_IN_DIE_LEITUNG_KOMMT,
  DER_ZWEITE_SCHLUESSEL,
];
