/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ DIE FELDER DER KLASSE - EIN BAUTEIL FÜR ZWEI STELLEN (11.09.2026, Nacht)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, wörtlich: *„Alles was im Bereich ‚Einstellungen der Klasse'
 * vorkommt muss beim Erstellen einer neuen Klasse abgefragt werden … Lass uns
 * den Bereich neue Klasse anlegen zum Ausklappen machen und erst wenn alles
 * ausgefüllt ist kann man Klasse erstellen."*
 *
 * Dieselben Felder stehen damit an ZWEI Stellen:
 *  • im Kasten „Einstellungen der Klasse" (`TastenflowReiter.tsx`) - jede Wahl
 *    wird sofort gespeichert;
 *  • im Abschnitt „Neue Klasse anlegen" (`KlasseUndKinder.tsx`) - die Wahl
 *    bleibt im Formular, bis „Klasse anlegen" sie in EINEM Aufruf mitschickt.
 *
 * ⚠️ Darum ein Bauteil und keine Kopie
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]): Bedienelemente,
 * Wertebereiche (Schulstufe 1-13 und „Erwachsen", Sprachen, Startpunkte) und
 * die Sätze daneben kommen von hier. Was sich unterscheidet, reicht die Stelle
 * herein - was beim Wählen geschieht (`on…`), wie das Feld heisst („der Klasse
 * 3b" / „der neuen Klasse") und ob eine Angabe Pflicht ist.
 *
 * ★ EN6a (19.09.2026): englisch über den Provider (`useBedienSprache`), Deutsch
 * Zeichen für Zeichen wie vorher. ⚠️ `bezug` kommt vom Aufrufer - in der
 * englischen Bedienung OHNE Präposition: *class 3b* / *the new class* (die
 * Feldnamen setzen „for …" / „in …" selbst davor).
 */
import { htmlLang } from "./htmlLang";
import { GezieltKlassenZeile } from "./GezieltLehrkraft";
import type { Gezielt } from "@/lib/typing/gezielt";
import { useId } from "react";
import type React from "react";
import { Tipp } from "@/components/Tipp";
import {
  uebungsSpracheImWeg,
  uebungsSprachenImWeg,
  VORGABE_STUFE,
  langLabel,
  stufeLabel,
  type Lang,
} from "@/lib/typing";
import {
  SCHULSTUFEN_WAHL,
  SCHULSTUFE_ERWACHSEN,
  klassenStufe,
  schulstufeText,
  schulstufeLabelEn,
  schulstufeLabelFr,
  schulstufeLabelEs,
  schulstufeLabelIt,
  schulstufeLabelPl,
  schulstufeLabelTr,
  schulstufeLabelCs,
  schuljahrStartjahr,
} from "@/lib/typing/klassenEinstellungen";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
// ★ O-IT (02.10.2026): die Startpunkte über `startPunkte` - italienisch beschriftet (letters.ts bleibt unberührt).
import { startPunkte } from "@/lib/typing/startpunkteIt";
import type { Lernweg } from "@/lib/typing/lernweg";
import type { EnglischVariante } from "@/lib/typing/schreibweise";
import { MONATE_JE_SPRACHE, SCHULJAHR_BEGINN_VORGABE } from "@/lib/typing/schuljahrBeginn";

/**
 * ★ EN6a (19.09.2026): die Texte der Felder in beiden Bedienungssprachen -
 * Deutsch wortgleich wie vorher. Glossar §3.4/§3.15: Schulstufe ⇒ *Year
 * group*, angezeigt als ALTER (*Age 12-13*, `schulstufeLabelEn`); Textstufe ⇒
 * *text age group* (*Ages 11-15*); Startniveau der Klasse ⇒ *Starting point
 * for the class*; Klassenmatch erlauben ⇒ *Allow Class Match*. Die Lehrkraft
 * liest plain *you* (§1.5).
 */
/** ★ E11a: „Parcours : ordre …" - ohne einen neuen Ternär auf „en". */
const LERNWEG_LABEL_FR: Record<Lernweg, string> = {
  de: "allemand",
  en: "anglais",
  fr: "français",
  es: "espagnol",
  // G2a: die Namen der neuen Wege sind echte Werte (wie „espagnol").
  it: "italien",
  pl: "polonais",
  tr: "turc",
  cs: "tchèque",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "bulgare",
  el: "grec",
  hu: "hongrois",
  nl: "néerlandais",
  pt: "portugais (Portugal)",
  br: "portugais (Brésil)",
  ro: "roumain",
  sv: "suédois",
  uk: "ukrainien",
};

/** ★ ES-O (27.09.2026): die Namen der Lernwege spanisch (klein, im Satz). */
const LERNWEG_LABEL_ES: Record<Lernweg, string> = {
  de: "alemán",
  en: "inglés",
  fr: "francés",
  es: "español",
  // G2a: die Namen der neuen Wege sind echte Werte.
  it: "italiano",
  pl: "polaco",
  tr: "turco",
  cs: "checo",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "búlgaro",
  el: "griego",
  hu: "húngaro",
  nl: "neerlandés",
  pt: "portugués (Portugal)",
  br: "portugués (Brasil)",
  ro: "rumano",
  sv: "sueco",
  uk: "ucraniano",
};

/** ★ O-IT (02.10.2026): die Namen der Lernwege italienisch (klein, im Satz). */
const LERNWEG_LABEL_IT: Record<Lernweg, string> = {
  de: "tedesco",
  en: "inglese",
  fr: "francese",
  es: "spagnolo",
  it: "italiano",
  pl: "polacco",
  tr: "turco",
  cs: "ceco",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "bulgaro",
  el: "greco",
  hu: "ungherese",
  nl: "olandese",
  pt: "portoghese (Portogallo)",
  br: "portoghese (Brasile)",
  ro: "rumeno",
  sv: "svedese",
  uk: "ucraino",
};

/**
 * ★ O-PL (02.10.2026): die Namen der Lernwege polnisch - weiblich, nach
 * „kolejność" („Kurs: kolejność polska").
 */
const LERNWEG_LABEL_PL: Record<Lernweg, string> = {
  de: "niemiecka",
  en: "angielska",
  fr: "francuska",
  es: "hiszpańska",
  it: "włoska",
  pl: "polska",
  tr: "turecka",
  cs: "czeska",
  // ★ G2-NEUN (25.10.2026): echte Werte (weiblich, nach „kolejność").
  bg: "bułgarska",
  el: "grecka",
  hu: "węgierska",
  nl: "niderlandzka",
  pt: "portugalska",
  br: "brazylijska",
  ro: "rumuńska",
  sv: "szwedzka",
  uk: "ukraińska",
};

/**
 * ★ O-TR (02.10.2026): die Namen der Lernwege türkisch - Sprachname gross vor
 * "tuş sırası" ("Kurs: Türkçe tuş sırası"), ohne Endung.
 */
const LERNWEG_LABEL_TR: Record<Lernweg, string> = {
  de: "Almanca",
  en: "İngilizce",
  fr: "Fransızca",
  es: "İspanyolca",
  it: "İtalyanca",
  pl: "Lehçe",
  tr: "Türkçe",
  cs: "Çekçe",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "Bulgarca",
  el: "Yunanca",
  hu: "Macarca",
  nl: "Felemenkçe",
  pt: "Portekizce (Portekiz)",
  br: "Portekizce (Brezilya)",
  ro: "Rumence",
  sv: "İsveççe",
  uk: "Ukraynaca",
};

/**
 * ★ O-CS (03.10.2026): die Namen der Lernwege tschechisch - Adjektiv sächlich
 * vor „pořadí kláves" („Kurz: české pořadí kláves").
 */
const LERNWEG_LABEL_CS: Record<Lernweg, string> = {
  de: "německé",
  en: "anglické",
  fr: "francouzské",
  es: "španělské",
  it: "italské",
  pl: "polské",
  tr: "turecké",
  cs: "české",
  // ★ G2-NEUN (25.10.2026): echte Werte (sächlich, vor „pořadí kláves").
  bg: "bulharské",
  el: "řecké",
  hu: "maďarské",
  nl: "nizozemské",
  pt: "portugalské",
  br: "brazilské",
  ro: "rumunské",
  sv: "švédské",
  uk: "ukrajinské",
};

// ★ SPRACHEN-9 (29.10.2026): die Lehrgang-Beschriftung der neun Bedienungen über Tabellen wie LERNWEG_LABEL_CS - vorher
// standen dort Englisch-oder-Deutsch-Weichen (Weichen-Zähler), die jeden anderen Weg „deutsch“ nannten.
/** Adjektiv je Weg (männlich, vor „ред“). */
const LERNWEG_LABEL_BG: Record<Lernweg, string> = {
  de: "немски",
  en: "английски",
  fr: "френски",
  es: "испански",
  it: "италиански",
  pl: "полски",
  tr: "турски",
  cs: "чешки",
  bg: "български",
  el: "гръцки",
  hu: "унгарски",
  nl: "нидерландски",
  pt: "португалски",
  br: "бразилски",
  ro: "румънски",
  sv: "шведски",
  uk: "украински",
};
/** Adjektiv je Weg (mit -e, vor „volgorde“). */
const LERNWEG_LABEL_NL: Record<Lernweg, string> = {
  de: "Duitse",
  en: "Engelse",
  fr: "Franse",
  es: "Spaanse",
  it: "Italiaanse",
  pl: "Poolse",
  tr: "Turkse",
  cs: "Tsjechische",
  bg: "Bulgaarse",
  el: "Griekse",
  hu: "Hongaarse",
  nl: "Nederlandse",
  pt: "Portugese",
  br: "Braziliaanse",
  ro: "Roemeense",
  sv: "Zweedse",
  uk: "Oekraïense",
};
/** Adjektiv je Weg (weiblich, nach „ordem“). */
const LERNWEG_LABEL_PT: Record<Lernweg, string> = {
  de: "alemã",
  en: "inglesa",
  fr: "francesa",
  es: "espanhola",
  it: "italiana",
  pl: "polaca",
  tr: "turca",
  cs: "checa",
  bg: "búlgara",
  el: "grega",
  hu: "húngara",
  nl: "neerlandesa",
  pt: "portuguesa",
  br: "brasileira",
  ro: "romena",
  sv: "sueca",
  uk: "ucraniana",
};
/** Adjektiv je Weg (nach „ordinea“). */
const LERNWEG_LABEL_RO: Record<Lernweg, string> = {
  de: "germană",
  en: "engleză",
  fr: "franceză",
  es: "spaniolă",
  it: "italiană",
  pl: "poloneză",
  tr: "turcă",
  cs: "cehă",
  bg: "bulgară",
  el: "greacă",
  hu: "maghiară",
  nl: "neerlandeză",
  pt: "portugheză",
  br: "braziliană",
  ro: "română",
  sv: "suedeză",
  uk: "ucraineană",
};
/** Adjektiv je Weg (vor „ordning“). */
const LERNWEG_LABEL_SV: Record<Lernweg, string> = {
  de: "tysk",
  en: "engelsk",
  fr: "fransk",
  es: "spansk",
  it: "italiensk",
  pl: "polsk",
  tr: "turkisk",
  cs: "tjeckisk",
  bg: "bulgarisk",
  el: "grekisk",
  hu: "ungersk",
  nl: "nederländsk",
  pt: "portugisisk",
  br: "brasiliansk",
  ro: "rumänsk",
  sv: "svensk",
  uk: "ukrainsk",
};
/** Adjektiv je Weg (männlich, vor „порядок“). */
const LERNWEG_LABEL_UK: Record<Lernweg, string> = {
  de: "німецький",
  en: "англійський",
  fr: "французький",
  es: "іспанський",
  it: "італійський",
  pl: "польський",
  tr: "турецький",
  cs: "чеський",
  bg: "болгарський",
  el: "грецький",
  hu: "угорський",
  nl: "нідерландський",
  pt: "португальський",
  br: "бразильський",
  ro: "румунський",
  sv: "шведський",
  uk: "український",
};

const FELDER_TEXTE = texte({
  de: {
    schulstufe: "Schulstufe",
    schulstufeName: (bezug: string) => `Schulstufe ${bezug}`,
    bitteWaehlen: "Bitte wählen",
    nichtGesetzt: "nicht gesetzt",
    hinweisPflicht: "Pflicht - daraus kommen die Textsorten für Tastenflow.",
    hinweisVorgabe: (vorgabe: string) => `Vorgabe: ${vorgabe} - tragen Sie die Schulstufe ein.`,
    hinweisErwachsen: (label: string) =>
      `Textsorten für Erwachsene (${label}) - zählt nicht weiter.`,
    hinweisAlter: (label: string) =>
      `Textsorten für das Alter ${label} - wächst mit jedem Schuljahr.`,
    hinweisRegel:
      " Die Schulstufe bestimmt die Textsorten für ALLE Kinder dieser Klasse. Die App merkt " +
      "sich das Schuljahr des Eintrags und zählt jedes Jahr eine Stufe weiter - Sie müssen " +
      `nichts nachstellen. „Erwachsen" zählt nicht weiter.`,
    hinweisPflichtZusatz: " Beim Anlegen ist die Schulstufe Pflicht.",
    hinweisNichtGesetzt: (vorgabe: string) =>
      ` „Nicht gesetzt" heisst: Es gilt die Vorgabe ${vorgabe}.`,
    sprache: "Sprache",
    spracheName: (bezug: string) => `Sprache ${bezug}`,
    spracheHinweis: "Die Sprache der Übungswörter und -texte für die Kinder dieser Klasse.",
    sperreAufhebenHinweis:
      "Sperre aufheben: Die Kinder dieser Klasse können die Sprache wieder selbst wählen.",
    sperrenHinweis:
      "Sprache sperren: Die Kinder dieser Klasse können sie nicht mehr selbst ändern.",
    sperreAufhebenName: (bezug: string) => `Sprach-Sperre ${bezug} aufheben`,
    sperrenName: (bezug: string) => `Sprache ${bezug} sperren`,
    startniveau: "Startniveau der Klasse",
    startniveauName: (bezug: string) => `Startniveau für alle Kinder ${bezug}`,
    klassenmatchHinweis:
      "Die Kinder können einander zu einem 5-Minuten-Match einladen. Platzierungen werden nicht gespeichert - in der Zeile eines Kindes steht nur, wie oft es mitgemacht hat.",
    klassenmatchErlauben: "Klassenmatch erlauben",
    // ★ Zeilenende mit Enter (23.09.2026, Anlass: eine 3. Klasse HAS, die für
    // die Büroarbeit lernt).
    zeilenEndeEnter: "Zeilenende mit Enter",
    zeilenEndeEnterHinweis:
      "Jede Zeile wird mit der Eingabetaste (Enter) abgeschlossen - wie beim Schreiben im Büro. Gilt für alle Übungen dieser Klasse, auch Tippchallenge und Klassenmatch.",
    /*
     * ★ E8 (24.09.2026, Bauplan englischer Lehrgang §7): der LERNWEG der
     * Klasse - anders als Sprache und Startniveau keine Einstellung, die man
     * hier ändert (er ist beim ersten Fortschritt eines Kindes fest, §2.2),
     * sondern nur eine Auskunft.
     */
    lernwegLabel: (lernweg: Lernweg) =>
      `Lehrgang: ${lernweg === "en" ? "englische" : "deutsche"} Reihenfolge`,
    lernwegHinweis:
      "Die Reihenfolge, in der die Tasten eingeführt werden. Gilt für Kinder, die dieser Klasse SPÄTER beitreten - bei einem Kind, das schon übt, ändert sich nie etwas.",
    /*
     * ★ E9 (24.09.2026, Bauplan §8.2): Schreibweise - anders als der Lernweg
     * eine EINSTELLUNG, die jederzeit wechseln darf (an ihr hängt keine
     * Taste). Nur sichtbar, wenn die Übungssprache der Klasse Englisch ist.
     */
    schreibweise: "Schreibweise",
    schreibweiseName: (bezug: string) => `Schreibweise ${bezug}`,
    schreibweiseHinweis:
      "Britisch oder amerikanisch - gilt für die Übungstexte der Kinder dieser Klasse. „Automatisch“ richtet sich nach der Sprache ihres Geräts.",
    schreibweiseAuto: "Automatisch",
    schreibweiseGb: "Britisch",
    schreibweiseUs: "Amerikanisch",
    // ★ D2 (28.09.2026): der Beginn des Schuljahres.
    schuljahrBeginn: "Beginn des Schuljahres",
    schuljahrBeginnName: (bezug: string) => `Beginn des Schuljahres ${bezug}`,
    schuljahrBeginnHinweis:
      "Der Monat, an dessen Erstem das Schuljahr dieser Klasse beginnt. Ab dann zählen „Schuljahr“ in der Statistik und die Schulstufe eine Stufe weiter. In Österreich, Deutschland und der Schweiz: August.",
  },
  en: {
    schulstufe: "Year group",
    schulstufeName: (bezug: string) => `Year group for ${bezug}`,
    bitteWaehlen: "Please choose",
    nichtGesetzt: "not set",
    hinweisPflicht: "Required - it decides which kinds of text Tastenflow uses.",
    hinweisVorgabe: (vorgabe: string) =>
      `Default: ${vorgabe} - please enter the year group.`,
    hinweisErwachsen: (label: string) => `Texts for adults (${label}) - does not move up.`,
    hinweisAlter: (label: string) => `Texts for ${label} - moves up every school year.`,
    hinweisRegel:
      " The year group decides the kinds of text for ALL pupils in this class. The app " +
      "remembers the school year in which you entered it and moves up one year group every " +
      "year - you don't need to change anything. “Adults” does not move up.",
    hinweisPflichtZusatz: " The year group is required when you create a class.",
    hinweisNichtGesetzt: (vorgabe: string) => ` “Not set” means: the default ${vorgabe} applies.`,
    sprache: "Language",
    spracheName: (bezug: string) => `Language for ${bezug}`,
    // ★ Gemeint ist die ÜBUNGSSPRACHE (Glossar §3.4) - was die Klasse tippt
    //   und hört, nicht die Bedienung (sonst suchte eine Lehrkraft hier die
    //   Sprache der Schalter). Das Deutsche sagte bis 19.09. „angezeigt" und
    //   ist seither ebenso genau.
    spracheHinweis: "The language of the practice words and texts for the pupils in this class.",
    sperreAufhebenHinweis:
      "Unlock: the pupils in this class can choose the language themselves again.",
    sperrenHinweis:
      "Lock the language: the pupils in this class can no longer change it themselves.",
    sperreAufhebenName: (bezug: string) => `Unlock the language for ${bezug}`,
    sperrenName: (bezug: string) => `Lock the language for ${bezug}`,
    startniveau: "Starting point for the class",
    startniveauName: (bezug: string) => `Starting point for all pupils in ${bezug}`,
    // ★ Seit E9 zählt die aufgeklappte Zeile, wie oft ein Kind mitgespielt
    //   hat - gespeichert wird aber keine Platzierung (so auch das Handbuch,
    //   Kapitel 2.4). Das Deutsche sagte bis 19.09. „keine Statistik".
    klassenmatchHinweis:
      "Pupils can invite each other to a 5-minute match. Placings are not saved - a pupil's row only shows how often they took part.",
    klassenmatchErlauben: "Allow Class Match",
    // ★ Finish each line with Enter (23.09.2026).
    zeilenEndeEnter: "Finish each line with Enter",
    zeilenEndeEnterHinweis:
      "Every line is finished with the Enter key - just like typing in an office. Applies to all practice in this class, including the Typing Challenge and Class Match.",
    lernwegLabel: (lernweg: Lernweg) => `Course: ${lernweg === "en" ? "English" : "German"} order`,
    lernwegHinweis:
      "The order in which the keys are introduced. Applies to pupils who join this class LATER - it never changes for a pupil who is already practising.",
    // ★ E9 (24.09.2026, Bauplan §8.2/§8.3): geschrieben in britischem
    // Englisch - die UI-Überlagerung (`bedienSprache/texte.ts`) macht daraus
    // bei amerikanischer Schreibweise automatisch „Practise" → „Practice"
    // usw.; „British"/„American" bleiben Eigennamen der Auswahl selbst.
    schreibweise: "Spelling",
    schreibweiseName: (bezug: string) => `Spelling for ${bezug}`,
    schreibweiseHinweis:
      "British or American - applies to the practice texts for pupils in this class. “Automatic” follows the language of their device.",
    schreibweiseAuto: "Automatic",
    schreibweiseGb: "British",
    schreibweiseUs: "American",
    schuljahrBeginn: "Start of the school year",
    schuljahrBeginnName: (bezug: string) => `Start of the school year for ${bezug}`,
    schuljahrBeginnHinweis:
      "The month on whose 1st the school year of this class begins. From then on, “School year” in the statistics starts again and the year group moves up by one. In the UK and the US: August.",
  },
  // ★ E11a: durchgehend „vous" - dieser Bereich gehört zur Klasseneinstellung
  // (F9). lernwegLabel über eine Tabelle statt eines neuen Ternärs, damit der
  // Weichen-Zähler nicht steigt.
  fr: {
    schulstufe: "Niveau scolaire",
    schulstufeName: (bezug: string) => `Niveau scolaire ${bezug}`,
    bitteWaehlen: "Merci de choisir",
    nichtGesetzt: "non réglé",
    hinweisPflicht: "Obligatoire - il détermine les types de texte dans Tastenflow.",
    hinweisVorgabe: (vorgabe: string) => `Par défaut : ${vorgabe} - indiquez le niveau scolaire.`,
    hinweisErwachsen: (label: string) => `Types de texte pour adultes (${label}) - n'avance pas.`,
    hinweisAlter: (label: string) => `Types de texte pour la tranche d'âge ${label} - avance à chaque année scolaire.`,
    hinweisRegel:
      " Le niveau scolaire détermine les types de texte pour TOUS les élèves de cette classe. " +
      "L'application retient l'année scolaire de la saisie et passe au niveau suivant chaque année - vous " +
      'n\'avez rien à faire. "Adultes" n\'avance pas.',
    hinweisPflichtZusatz: " Le niveau scolaire est obligatoire à la création.",
    hinweisNichtGesetzt: (vorgabe: string) => ` "Non réglé" signifie : la valeur par défaut ${vorgabe} s'applique.`,
    sprache: "Langue",
    spracheName: (bezug: string) => `Langue ${bezug}`,
    spracheHinweis: "La langue des mots et textes d'exercice pour les élèves de cette classe.",
    sperreAufhebenHinweis:
      "Déverrouiller : les élèves de cette classe peuvent à nouveau choisir la langue eux-mêmes.",
    sperrenHinweis:
      "Verrouiller la langue : les élèves de cette classe ne peuvent plus la changer eux-mêmes.",
    sperreAufhebenName: (bezug: string) => `Déverrouiller la langue ${bezug}`,
    sperrenName: (bezug: string) => `Verrouiller la langue ${bezug}`,
    startniveau: "Niveau de départ de la classe",
    startniveauName: (bezug: string) => `Niveau de départ pour tous les élèves ${bezug}`,
    klassenmatchHinweis:
      "Les élèves peuvent s'inviter mutuellement à un match de 5 minutes. Les classements ne sont pas enregistrés - la ligne d'un élève indique seulement combien de fois il a participé.",
    klassenmatchErlauben: "Autoriser le Match de la classe",
    zeilenEndeEnter: "Fin de ligne avec Entrée",
    zeilenEndeEnterHinweis:
      "Chaque ligne se termine avec la touche Entrée - comme en écrivant au bureau. S'applique à tous les exercices de cette classe, y compris le Défi et le Match de la classe.",
    lernwegLabel: (lernweg: Lernweg) => `Parcours : ordre ${LERNWEG_LABEL_FR[lernweg]}`,
    lernwegHinweis:
      "L'ordre dans lequel les touches sont introduites. S'applique aux élèves qui rejoignent cette classe PLUS TARD - rien ne change jamais pour un élève qui s'exerce déjà.",
    schreibweise: "Orthographe",
    schreibweiseName: (bezug: string) => `Orthographe ${bezug}`,
    schreibweiseHinweis:
      'Britannique ou américaine - s\'applique aux textes d\'exercice des élèves de cette classe. "Automatique" suit la langue de leur appareil.',
    schreibweiseAuto: "Automatique",
    schreibweiseGb: "Britannique",
    schreibweiseUs: "Américaine",
    schuljahrBeginn: "Début de l'année scolaire",
    schuljahrBeginnName: (bezug: string) => `Début de l'année scolaire ${bezug}`,
    schuljahrBeginnHinweis:
      'Le mois dont le 1er marque le début de l\'année scolaire de cette classe. À partir de là, "Année scolaire" repart à zéro dans les statistiques et le niveau scolaire avance d\'un cran. En France, en Belgique, en Suisse et au Canada : aout.',
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft - usted.
  es: {
    schulstufe: "Curso",
    schulstufeName: (bezug: string) => `Curso ${bezug}`,
    bitteWaehlen: "Elija, por favor",
    nichtGesetzt: "sin fijar",
    hinweisPflicht: "Obligatorio - determina los tipos de texto en Tastenflow.",
    hinweisVorgabe: (vorgabe: string) => `Predeterminado: ${vorgabe} - indique el curso.`,
    hinweisErwachsen: (label: string) => `Tipos de texto para personas adultas (${label}) - no avanza.`,
    hinweisAlter: (label: string) => `Tipos de texto para la edad ${label} - avanza con cada curso escolar.`,
    hinweisRegel:
      " El curso determina los tipos de texto de TODO el alumnado de esta clase. " +
      "La aplicación guarda el curso escolar en que se indicó y pasa al curso siguiente cada año - usted " +
      'no tiene que hacer nada. "Personas adultas" no avanza.',
    hinweisPflichtZusatz: " El curso es obligatorio al crear la clase.",
    hinweisNichtGesetzt: (vorgabe: string) => ` "Sin fijar" significa: vale el valor predeterminado ${vorgabe}.`,
    sprache: "Idioma",
    spracheName: (bezug: string) => `Idioma ${bezug}`,
    spracheHinweis: "El idioma de las palabras y los textos de práctica del alumnado de esta clase.",
    sperreAufhebenHinweis:
      "Desbloquear: el alumnado de esta clase puede volver a elegir el idioma por su cuenta.",
    sperrenHinweis:
      "Bloquear el idioma: el alumnado de esta clase ya no puede cambiarlo por su cuenta.",
    sperreAufhebenName: (bezug: string) => `Desbloquear el idioma ${bezug}`,
    sperrenName: (bezug: string) => `Bloquear el idioma ${bezug}`,
    startniveau: "Nivel de partida de la clase",
    startniveauName: (bezug: string) => `Nivel de partida para todo el alumnado ${bezug}`,
    klassenmatchHinweis:
      "El alumnado puede invitarse a una competición de 5 minutos. Las clasificaciones no se guardan - la fila de cada estudiante solo indica cuántas veces participó.",
    klassenmatchErlauben: "Permitir la Competición de la clase",
    zeilenEndeEnter: "Final de línea con Intro",
    zeilenEndeEnterHinweis:
      "Cada línea termina con la tecla Intro - como en los ejercicios clásicos de mecanografía (copia línea a línea). Se aplica a todos los ejercicios de esta clase, también al Reto y a la Competición de la clase.",
    lernwegLabel: (lernweg: Lernweg) => `Recorrido: orden ${LERNWEG_LABEL_ES[lernweg]}`,
    lernwegHinweis:
      "El orden en que se introducen las teclas. Se aplica a quienes se incorporen a esta clase MÁS TARDE - para quien ya practica no cambia nunca nada.",
    schreibweise: "Ortografía",
    schreibweiseName: (bezug: string) => `Ortografía ${bezug}`,
    schreibweiseHinweis:
      'Británica o estadounidense - se aplica a los textos de práctica del alumnado de esta clase. "Automática" sigue el idioma de su dispositivo.',
    schreibweiseAuto: "Automática",
    schreibweiseGb: "Británica",
    schreibweiseUs: "Estadounidense",
    schuljahrBeginn: "Inicio del curso escolar",
    schuljahrBeginnName: (bezug: string) => `Inicio del curso escolar ${bezug}`,
    schuljahrBeginnHinweis:
      'El mes en cuyo día 1 empieza el curso escolar de esta clase. Desde entonces, "Curso escolar" empieza de nuevo en las estadísticas y el curso avanza uno. Cono Sur y Perú: febrero; Centroamérica y Colombia (calendario A): enero; México, España y Ecuador (Sierra): agosto; Ecuador (Costa): abril.',
  },
  // ★ O-IT (02.10.2026): Lehrkraft neutral; „classe frequentata", „punto di
  // partenza", „Gara di classe", „Sfida" (Glossar §2.3, §2.6).
  it: {
    schulstufe: "Classe frequentata",
    schulstufeName: (bezug: string) => `Classe frequentata ${bezug}`,
    bitteWaehlen: "Scegliere, per favore",
    nichtGesetzt: "non impostata",
    hinweisPflicht: "Obbligatorio - decide i tipi di testo in Tastenflow.",
    hinweisVorgabe: (vorgabe: string) => `Predefinito: ${vorgabe} - indicare la classe frequentata.`,
    hinweisErwachsen: (label: string) => `Tipi di testo per persone adulte (${label}) - non avanza.`,
    hinweisAlter: (label: string) => `Tipi di testo per l'età ${label} - avanza a ogni anno scolastico.`,
    hinweisRegel:
      " La classe frequentata decide i tipi di testo di TUTTI gli alunni di questa classe. " +
      "Il programma salva l'anno scolastico in cui è stata indicata e passa alla classe successiva ogni anno - " +
      `non serve fare niente. "Persone adulte" non avanza.`,
    hinweisPflichtZusatz: " La classe frequentata è obbligatoria quando si crea la classe.",
    hinweisNichtGesetzt: (vorgabe: string) => ` "Non impostata" significa: vale il valore predefinito ${vorgabe}.`,
    sprache: "Lingua",
    spracheName: (bezug: string) => `Lingua ${bezug}`,
    spracheHinweis: "La lingua delle parole e dei testi di esercizio degli alunni di questa classe.",
    sperreAufhebenHinweis:
      "Sbloccare: gli alunni di questa classe possono di nuovo scegliere la lingua da soli.",
    sperrenHinweis:
      "Bloccare la lingua: gli alunni di questa classe non possono più cambiarla da soli.",
    sperreAufhebenName: (bezug: string) => `Sbloccare la lingua ${bezug}`,
    sperrenName: (bezug: string) => `Bloccare la lingua ${bezug}`,
    startniveau: "Punto di partenza della classe",
    startniveauName: (bezug: string) => `Punto di partenza per tutti gli alunni ${bezug}`,
    klassenmatchHinweis:
      "Gli alunni possono invitarsi a una gara di 5 minuti. Le classifiche non vengono salvate - la riga di ogni persona indica solo quante volte ha partecipato.",
    klassenmatchErlauben: "Permettere la Gara di classe",
    zeilenEndeEnter: "Fine della riga con Invio",
    zeilenEndeEnterHinweis:
      "Ogni riga finisce con il tasto Invio - come negli esercizi classici di dattilografia (copia riga per riga). Vale per tutti gli esercizi di questa classe, anche per la Sfida e la Gara di classe.",
    lernwegLabel: (lernweg: Lernweg) => `Percorso: ordine ${LERNWEG_LABEL_IT[lernweg]}`,
    lernwegHinweis:
      "L'ordine in cui arrivano i tasti. Vale per chi entra in questa classe PIÙ TARDI - per chi si esercita già non cambia mai niente.",
    schreibweise: "Ortografia",
    schreibweiseName: (bezug: string) => `Ortografia ${bezug}`,
    schreibweiseHinweis:
      `Britannica o statunitense - vale per i testi di esercizio degli alunni di questa classe. "Automatica" segue la lingua del dispositivo.`,
    schreibweiseAuto: "Automatica",
    schreibweiseGb: "Britannica",
    schreibweiseUs: "Statunitense",
    schuljahrBeginn: "Inizio dell'anno scolastico",
    schuljahrBeginnName: (bezug: string) => `Inizio dell'anno scolastico ${bezug}`,
    schuljahrBeginnHinweis:
      `Il mese nel cui primo giorno inizia l'anno scolastico di questa classe. Da quel momento "Anno scolastico" ricomincia nelle statistiche e la classe frequentata avanza di uno. In Italia: settembre; nel Canton Ticino: agosto.`,
  },
  // ★ O-PL (02.10.2026): Lehrkraft - Knöpfe im Imperativ, Beschreibungen
  // unpersönlich (Glossar Regel 1); „Klasa" für die Schulstufe (§2.6, nie
  // „rocznik"/„poziom"), „język tekstów" (§2.5), „punkt startowy" (§2.2),
  // „Wyścig klasowy", „Wyzwanie" (§2.3). ⚠️ `bezug` erwartet hier den GENITIV
  // ohne Präposition („klasy 3b", „nowej klasy") - die Feldnamen lauten dann
  // „Język tekstów klasy 3b".
  pl: {
    schulstufe: "Klasa",
    schulstufeName: (bezug: string) => `Klasa, do której chodzą uczniowie ${bezug}`,
    bitteWaehlen: "Wybierz",
    nichtGesetzt: "nieustawiona",
    hinweisPflicht: "Obowiązkowe - od tego zależą rodzaje tekstów w programie Tastenflow.",
    hinweisVorgabe: (vorgabe: string) => `Domyślnie: ${vorgabe} - wybierz klasę.`,
    hinweisErwachsen: (label: string) => `Teksty dla osób dorosłych (${label}) - bez zmian z roku na rok.`,
    hinweisAlter: (label: string) => `Teksty dla: ${label} - zmieniają się z każdym rokiem szkolnym.`,
    hinweisRegel:
      " Klasa decyduje o rodzajach tekstów dla WSZYSTKICH uczniów tej klasy. Program zapamiętuje " +
      "rok szkolny wpisu i co roku przechodzi o klasę wyżej - nie trzeba nic zmieniać. " +
      "„Osoby dorosłe” zostają bez zmian.",
    hinweisPflichtZusatz: " Przy tworzeniu klasy pole „Klasa” jest obowiązkowe.",
    hinweisNichtGesetzt: (vorgabe: string) =>
      ` „Nieustawiona” oznacza: obowiązuje wartość domyślna - ${vorgabe}.`,
    sprache: "Język tekstów",
    spracheName: (bezug: string) => `Język tekstów ${bezug}`,
    spracheHinweis: "Język słów i tekstów do ćwiczeń dla uczniów tej klasy.",
    sperreAufhebenHinweis:
      "Odblokuj: uczniowie tej klasy mogą znowu samodzielnie wybierać język.",
    sperrenHinweis:
      "Zablokuj język: uczniowie tej klasy nie mogą go już samodzielnie zmieniać.",
    sperreAufhebenName: (bezug: string) => `Odblokuj język tekstów ${bezug}`,
    sperrenName: (bezug: string) => `Zablokuj język tekstów ${bezug}`,
    startniveau: "Punkt startowy klasy",
    startniveauName: (bezug: string) => `Punkt startowy dla wszystkich uczniów ${bezug}`,
    klassenmatchHinweis:
      "Uczniowie mogą zapraszać się nawzajem do 5-minutowego wyścigu. Miejsca nie są zapisywane - w wierszu każdej osoby widać tylko liczbę udziałów.",
    klassenmatchErlauben: "Zezwól na Wyścig klasowy",
    zeilenEndeEnter: "Koniec wiersza klawiszem Enter",
    zeilenEndeEnterHinweis:
      "Każdy wiersz kończy się klawiszem Enter - jak przy pisaniu w biurze. Dotyczy wszystkich ćwiczeń tej klasy, także Wyzwania i Wyścigu klasowego.",
    lernwegLabel: (lernweg: Lernweg) => `Kurs: kolejność ${LERNWEG_LABEL_PL[lernweg]}`,
    lernwegHinweis:
      "Kolejność, w jakiej pojawiają się klawisze. Dotyczy osób, które dołączą do tej klasy PÓŹNIEJ - u osób, które już ćwiczą, nic się nie zmienia.",
    schreibweise: "Pisownia",
    schreibweiseName: (bezug: string) => `Pisownia ${bezug}`,
    schreibweiseHinweis:
      "Brytyjska albo amerykańska - dotyczy tekstów do ćwiczeń uczniów tej klasy. „Automatycznie” zależy od języka ich urządzenia.",
    schreibweiseAuto: "Automatycznie",
    schreibweiseGb: "Brytyjska",
    schreibweiseUs: "Amerykańska",
    schuljahrBeginn: "Początek roku szkolnego",
    schuljahrBeginnName: (bezug: string) => `Początek roku szkolnego ${bezug}`,
    schuljahrBeginnHinweis:
      "Miesiąc, którego pierwszego dnia zaczyna się rok szkolny tej klasy. Od tego dnia „Rok szkolny” w statystykach liczy się od nowa, a klasa przechodzi o jedną wyżej. W Polsce: wrzesień (rok szkolny zaczyna się 1 września).",
  },
  // ★ O-TR (02.10.2026): Lehrkraft siz mit -(y)In, nie -InIz (Glossar Regel 1);
  // Knöpfe und Schalter als blosser Stamm; "sınıf düzeyi" (§2.6), "metinlerin
  // dili" (§2.5), "başlangıç noktası" (§2.2), "Yarışma", "Sınıf Maçı" (§2.3).
  // ⚠️ `bezug` kommt vom Aufrufer im Nominativ ("yeni sınıf") - er steht darum
  // immer in Klammern, nie mit Endung (Regel 6): "Sınıf düzeyi (yeni sınıf)".
  tr: {
    schulstufe: "Sınıf düzeyi",
    schulstufeName: (bezug: string) => `Sınıf düzeyi (${bezug})`,
    bitteWaehlen: "Seçin",
    nichtGesetzt: "belirlenmedi",
    hinweisPflicht: "Zorunlu - Tastenflow metin türlerini buna göre seçer.",
    hinweisVorgabe: (vorgabe: string) => `Varsayılan: ${vorgabe} - sınıf düzeyini girin.`,
    hinweisErwachsen: (label: string) => `Yetişkinler için metin türleri (${label}) - her yıl artmaz.`,
    hinweisAlter: (label: string) => `Metin türleri: ${label} - her öğretim yılıyla birlikte büyür.`,
    hinweisRegel:
      " Sınıf düzeyi, bu sınıftaki BÜTÜN öğrencilerin metin türlerini belirler. Program girişin " +
      "yapıldığı öğretim yılını hatırlar ve her yıl bir düzey ilerler - sizin bir şey değiştirmeniz " +
      `gerekmez. "Yetişkin" ilerlemez.`,
    hinweisPflichtZusatz: " Sınıf oluştururken sınıf düzeyi zorunludur.",
    hinweisNichtGesetzt: (vorgabe: string) => ` "Belirlenmedi" şu demek: varsayılan geçerlidir - ${vorgabe}.`,
    sprache: "Metinlerin dili",
    spracheName: (bezug: string) => `Metinlerin dili (${bezug})`,
    spracheHinweis: "Bu sınıftaki öğrencilerin alıştırma kelimelerinin ve metinlerinin dili.",
    sperreAufhebenHinweis:
      "Kilidi kaldırın: bu sınıftaki öğrenciler dili yeniden kendileri seçebilir.",
    sperrenHinweis:
      "Dili kilitleyin: bu sınıftaki öğrenciler dili artık kendileri değiştiremez.",
    sperreAufhebenName: (bezug: string) => `Dil kilidini kaldır (${bezug})`,
    sperrenName: (bezug: string) => `Dili kilitle (${bezug})`,
    startniveau: "Sınıfın başlangıç noktası",
    startniveauName: (bezug: string) => `Bütün öğrenciler için başlangıç noktası (${bezug})`,
    klassenmatchHinweis:
      "Öğrenciler birbirlerini 5 dakikalık bir maça davet edebilir. Sıralamalar kaydedilmez - bir öğrencinin satırında yalnızca kaç kez katıldığı görünür.",
    klassenmatchErlauben: "Sınıf Maçı oynanabilir",
    zeilenEndeEnter: "Satır sonunda Enter",
    zeilenEndeEnterHinweis:
      "Her satır Enter tuşuyla bitirilir - büroda yazarken olduğu gibi. Bu sınıfın bütün alıştırmaları için geçerlidir; Yarışma ve Sınıf Maçı da dahil.",
    lernwegLabel: (lernweg: Lernweg) => `Kurs: ${LERNWEG_LABEL_TR[lernweg]} tuş sırası`,
    lernwegHinweis:
      "Tuşların hangi sırayla geldiği. Bu sınıfa SONRADAN katılan öğrenciler için geçerlidir - zaten çalışan bir öğrencide hiçbir şey değişmez.",
    schreibweise: "Yazım",
    schreibweiseName: (bezug: string) => `Yazım (${bezug})`,
    schreibweiseHinweis:
      `İngiliz ya da Amerikan yazımı - bu sınıftaki öğrencilerin alıştırma metinleri için geçerlidir. "Otomatik" seçeneği cihazlarının diline göre belirlenir.`,
    schreibweiseAuto: "Otomatik",
    schreibweiseGb: "İngiliz",
    schreibweiseUs: "Amerikan",
    schuljahrBeginn: "Öğretim yılının başlangıcı",
    schuljahrBeginnName: (bezug: string) => `Öğretim yılının başlangıcı (${bezug})`,
    schuljahrBeginnHinweis:
      `Bu sınıfın öğretim yılının başladığı ay (ayın ilk günü). O günden itibaren istatistiklerdeki "Öğretim yılı" yeniden başlar ve sınıf düzeyi bir artar. Türkiye'de: Eylül.`,
  },
  // ★ O-CS (03.10.2026): Lehrkraft vy-Mehrzahl (Glossar Regel 1), Knöpfe und
  // Schalter im Infinitiv; „ročník" für die Schulstufe (§2.6, §4 Falle 3: nie
  // „třída"), „jazyk textů" (§2.5), „výchozí bod" (§2.2), „Třídní závod",
  // „Výzva" (§2.3). Kinder als „žáci" (Mehrzahl) oder „osoba" (Regel 2), nie
  // Vergangenheit über ein Kind. ⚠️ `bezug` erwartet hier den GENITIV ohne
  // Präposition („třídy 3b", „nové třídy") - die Feldnamen lauten dann
  // „Jazyk textů třídy 3b".
  cs: {
    schulstufe: "Ročník",
    schulstufeName: (bezug: string) => `Ročník ${bezug}`,
    bitteWaehlen: "Vyberte",
    nichtGesetzt: "nenastaveno",
    hinweisPflicht: "Povinné - podle toho Tastenflow vybírá druhy textů.",
    hinweisVorgabe: (vorgabe: string) => `Výchozí: ${vorgabe} - zadejte ročník.`,
    hinweisErwachsen: (label: string) => `Texty pro dospělé (${label}) - nemění se z roku na rok.`,
    hinweisAlter: (label: string) => `Texty pro věk: ${label} - rostou s každým školním rokem.`,
    hinweisRegel:
      " Ročník určuje druhy textů pro VŠECHNY žáky této třídy. Aplikace si pamatuje školní rok " +
      "zápisu a každý rok posune ročník o jeden výš - nemusíte nic měnit. Dospělí zůstávají beze " +
      "změny.",
    hinweisPflichtZusatz: " Při vytváření třídy je ročník povinný.",
    hinweisNichtGesetzt: (vorgabe: string) => ` Nenastaveno znamená: platí výchozí hodnota - ${vorgabe}.`,
    sprache: "Jazyk textů",
    spracheName: (bezug: string) => `Jazyk textů ${bezug}`,
    spracheHinweis: "Jazyk slov a textů na cvičení pro žáky této třídy.",
    sperreAufhebenHinweis:
      "Odemknout: žáci této třídy si mohou jazyk znovu vybírat sami.",
    sperrenHinweis:
      "Zamknout jazyk: žáci této třídy si ho už nemohou sami změnit.",
    sperreAufhebenName: (bezug: string) => `Odemknout jazyk textů ${bezug}`,
    sperrenName: (bezug: string) => `Zamknout jazyk textů ${bezug}`,
    startniveau: "Výchozí bod třídy",
    startniveauName: (bezug: string) => `Výchozí bod pro všechny žáky ${bezug}`,
    klassenmatchHinweis:
      "Žáci se mohou navzájem pozvat na pětiminutový závod. Pořadí se neukládá - v řádku každé osoby je vidět jen počet účastí.",
    klassenmatchErlauben: "Povolit Třídní závod",
    zeilenEndeEnter: "Konec řádku klávesou Enter",
    zeilenEndeEnterHinweis:
      "Každý řádek se ukončuje klávesou Enter - jako při psaní v kanceláři. Platí pro všechna cvičení této třídy, i pro Výzvu a Třídní závod.",
    lernwegLabel: (lernweg: Lernweg) => `Kurz: ${LERNWEG_LABEL_CS[lernweg]} pořadí kláves`,
    lernwegHinweis:
      "Pořadí, v jakém přicházejí klávesy. Platí pro ty, kdo do této třídy přibudou POZDĚJI - u osob, které už cvičí, se nic nemění.",
    schreibweise: "Pravopis",
    schreibweiseName: (bezug: string) => `Pravopis ${bezug}`,
    schreibweiseHinweis:
      "Britský nebo americký - platí pro texty na cvičení žáků této třídy. Automaticky se řídí jazykem jejich zařízení.",
    schreibweiseAuto: "Automaticky",
    schreibweiseGb: "Britský",
    schreibweiseUs: "Americký",
    schuljahrBeginn: "Začátek školního roku",
    schuljahrBeginnName: (bezug: string) => `Začátek školního roku ${bezug}`,
    schuljahrBeginnHinweis:
      "Měsíc, jehož prvním dnem začíná školní rok této třídy. Od tohoto dne se školní rok ve statistice počítá znovu a ročník se posune o jeden výš. V Česku: září (školní rok začíná 1. září).",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      schulstufe: "Клас в училище",
      schulstufeName: (bezug: string) => `Клас в училище за ${bezug}`,
      bitteWaehlen: "Изберете",
      nichtGesetzt: "не е зададено",
      hinweisPflicht: "Задължително - от него зависят видовете текстове в Tastenflow.",
      hinweisVorgabe: (vorgabe: string) =>
        `По подразбиране: ${vorgabe} - въведете класа в училище.`,
      hinweisErwachsen: (label: string) => `Текстове за възрастни (${label}) - не се променя с годините.`,
      hinweisAlter: (label: string) => `Текстове за възраст ${label} - расте с всяка учебна година.`,
      hinweisRegel:
        " Класът в училище определя видовете текстове за ВСИЧКИ ученици в този клас. Програмата " +
        "запомня учебната година на записа и всяка година брои един клас нагоре - не е нужно " +
        "да променяте нищо. „Възрастни“ не се променя.",
      hinweisPflichtZusatz: " При създаване на клас полето „Клас в училище“ е задължително.",
      hinweisNichtGesetzt: (vorgabe: string) => ` „Не е зададено“ означава: важи стойността по подразбиране ${vorgabe}.`,
      sprache: "Език",
      spracheName: (bezug: string) => `Език за ${bezug}`,
      spracheHinweis: "Езикът на думите и текстовете за упражнение за учениците в този клас.",
      sperreAufhebenHinweis:
        "Отключване: учениците в този клас отново могат сами да избират езика.",
      sperrenHinweis:
        "Заключване на езика: учениците в този клас вече не могат сами да го сменят.",
      sperreAufhebenName: (bezug: string) => `Отключи езика за ${bezug}`,
      sperrenName: (bezug: string) => `Заключи езика за ${bezug}`,
      startniveau: "Начална точка на класа",
      startniveauName: (bezug: string) => `Начална точка за всички ученици в ${bezug}`,
      klassenmatchHinweis:
        "Учениците могат да се канят един друг на петминутно състезание. Местата не се записват - в реда на ученика се вижда само броят на участията.",
      klassenmatchErlauben: "Разреши Състезание в класа",
      zeilenEndeEnter: "Край на реда с Enter",
      zeilenEndeEnterHinweis:
        "Всеки ред завършва с клавиша Enter - както при писане в офис. Важи за всички упражнения в този клас, включително Предизвикателство и Състезание в класа.",
      lernwegLabel: (lernweg: Lernweg) =>
        `Курс: ${LERNWEG_LABEL_BG[lernweg]} ред на клавишите`,
      lernwegHinweis:
        "Редът, в който се въвеждат клавишите. Важи за ученици, които се присъединят към този клас ПО-КЪСНО - за ученик, който вече се упражнява, нищо не се променя.",
      schreibweise: "Правопис",
      schreibweiseName: (bezug: string) => `Правопис за ${bezug}`,
      schreibweiseHinweis:
        "Британски или американски - важи за текстовете за упражнение на учениците в този клас. „Автоматично“ следва езика на устройството им.",
      schreibweiseAuto: "Автоматично",
      schreibweiseGb: "Британски",
      schreibweiseUs: "Американски",
      schuljahrBeginn: "Начало на учебната година",
      schuljahrBeginnName: (bezug: string) => `Начало на учебната година за ${bezug}`,
      schuljahrBeginnHinweis:
        "Месецът, на чийто първи ден започва учебната година на този клас. Оттогава „Учебна година“ в статистиката започва отначало, а класът в училище се вдига с едно. В България учебната година започва през септември.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      // ⚠️ `bezug` erwartet hier den GENITIV mit Artikel („του τμήματος 3b", „του νέου τμήματος").
      // Lehrkraft: εσείς (Glossar Regel 1); Schulstufe = τάξη, Klasse = τμήμα (§4 Falle 1).
      schulstufe: "Τάξη",
      schulstufeName: (bezug: string) => `Τάξη ${bezug}`,
      bitteWaehlen: "Επιλέξτε",
      nichtGesetzt: "δεν έχει οριστεί",
      hinweisPflicht: "Υποχρεωτικό - από αυτό προκύπτουν τα είδη κειμένων για το Tastenflow.",
      hinweisVorgabe: (vorgabe: string) => `Προεπιλογή: ${vorgabe} - συμπληρώστε την τάξη.`,
      hinweisErwachsen: (label: string) => `Κείμενα για ενήλικες (${label}) - δεν ανεβαίνει.`,
      hinweisAlter: (label: string) => `Κείμενα για ηλικίες ${label} - ανεβαίνει με κάθε σχολικό έτος.`,
      hinweisRegel:
        " Η τάξη ορίζει τα είδη κειμένων για ΟΛΑ τα παιδιά αυτού του τμήματος. Το πρόγραμμα " +
        "θυμάται το σχολικό έτος της καταχώρισης και ανεβαίνει κάθε χρόνο μία τάξη - δεν χρειάζεται " +
        "να αλλάξετε τίποτα. Η επιλογή «Ενήλικες» δεν ανεβαίνει.",
      hinweisPflichtZusatz: " Κατά τη δημιουργία τμήματος η τάξη είναι υποχρεωτική.",
      hinweisNichtGesetzt: (vorgabe: string) => ` «Δεν έχει οριστεί» σημαίνει: ισχύει η προεπιλογή ${vorgabe}.`,
      sprache: "Γλώσσα των κειμένων",
      spracheName: (bezug: string) => `Γλώσσα των κειμένων ${bezug}`,
      spracheHinweis: "Η γλώσσα των λέξεων και των κειμένων εξάσκησης για τα παιδιά αυτού του τμήματος.",
      sperreAufhebenHinweis:
        "Ξεκλείδωμα: τα παιδιά αυτού του τμήματος μπορούν πάλι να διαλέγουν μόνα τους τη γλώσσα.",
      sperrenHinweis:
        "Κλείδωμα γλώσσας: τα παιδιά αυτού του τμήματος δεν μπορούν πια να την αλλάξουν μόνα τους.",
      sperreAufhebenName: (bezug: string) => `Ξεκλείδωμα γλώσσας ${bezug}`,
      sperrenName: (bezug: string) => `Κλείδωμα γλώσσας ${bezug}`,
      startniveau: "Σημείο εκκίνησης του τμήματος",
      startniveauName: (bezug: string) => `Σημείο εκκίνησης για όλα τα παιδιά ${bezug}`,
      klassenmatchHinweis:
        "Τα παιδιά μπορούν να προσκαλούν το ένα το άλλο σε Αγώνα τμήματος 5 λεπτών. Οι θέσεις δεν αποθηκεύονται - στη γραμμή κάθε παιδιού φαίνεται μόνο πόσες φορές πήρε μέρος.",
      klassenmatchErlauben: "Επιτρέπεται ο Αγώνας τμήματος",
      zeilenEndeEnter: "Τέλος γραμμής με Enter",
      zeilenEndeEnterHinweis:
        "Κάθε γραμμή τελειώνει με το πλήκτρο Enter - όπως όταν γράφουμε σε γραφείο. Ισχύει για όλες τις ασκήσεις αυτού του τμήματος, και για την Πρόκληση και τον Αγώνα τμήματος.",
      // Name der Sprache groß und ungebeugt nach „για τα" (Glossar Regel 9); „σειρά" nie allein (§4 Falle 14).
      lernwegLabel: (lernweg: Lernweg) =>
        `Πρόγραμμα: η σειρά των πλήκτρων για τα ${
          ({
            de: "Γερμανικά",
            en: "Αγγλικά",
            fr: "Γαλλικά",
            es: "Ισπανικά",
            it: "Ιταλικά",
            pl: "Πολωνικά",
            tr: "Τουρκικά",
            cs: "Τσεχικά",
            bg: "Βουλγαρικά",
            el: "Ελληνικά",
            hu: "Ουγγρικά",
            nl: "Ολλανδικά",
            pt: "Πορτογαλικά (Πορτογαλίας)",
            br: "Πορτογαλικά (Βραζιλίας)",
            ro: "Ρουμανικά",
            sv: "Σουηδικά",
            uk: "Ουκρανικά",
          } as Record<Lernweg, string>)[lernweg]
        }`,
      lernwegHinweis:
        "Η σειρά με την οποία έρχονται τα πλήκτρα. Ισχύει για τα παιδιά που μπαίνουν σε αυτό το τμήμα ΑΡΓΟΤΕΡΑ - για ένα παιδί που ήδη κάνει εξάσκηση δεν αλλάζει ποτέ τίποτα.",
      schreibweise: "Ορθογραφία",
      schreibweiseName: (bezug: string) => `Ορθογραφία ${bezug}`,
      schreibweiseHinweis:
        "Βρετανική ή αμερικανική - ισχύει για τα κείμενα εξάσκησης των παιδιών αυτού του τμήματος. Η επιλογή «Αυτόματα» ακολουθεί τη γλώσσα της συσκευής τους.",
      schreibweiseAuto: "Αυτόματα",
      schreibweiseGb: "Βρετανική",
      schreibweiseUs: "Αμερικανική",
      schuljahrBeginn: "Αρχή του σχολικού έτους",
      schuljahrBeginnName: (bezug: string) => `Αρχή του σχολικού έτους ${bezug}`,
      schuljahrBeginnHinweis:
        "Ο μήνας στην 1η του οποίου ξεκινά το σχολικό έτος αυτού του τμήματος. Από τότε το «Σχολικό έτος» στα στατιστικά ξεκινά από την αρχή και η τάξη ανεβαίνει κατά μία. Στην Ελλάδα και στην Κύπρο: Σεπτέμβριος.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      // Lehrkraft-Bereich: ohne Anrede, sonst höfliche Befehlsform ohne „Ön" (Glossar hu Regel 1).
      // Schulstufe = évfolyam, nie osztály (§4 Falle 2). Platzhalter ${bezug} nur in Klammern (Regel 12).
      schulstufe: "Évfolyam",
      schulstufeName: (bezug: string) => `Évfolyam (${bezug})`,
      bitteWaehlen: "Kérjük, válasszon",
      nichtGesetzt: "nincs megadva",
      hinweisPflicht: "Kötelező - ebből adódnak a Tastenflow szövegfajtái.",
      hinweisVorgabe: (vorgabe: string) =>
        `Alapértelmezés: ${vorgabe} - adja meg az évfolyamot.`,
      hinweisErwachsen: (label: string) => `Szövegfajták felnőtteknek (${label}) - nem lép tovább.`,
      hinweisAlter: (label: string) => `Szövegfajták ehhez az életkorhoz: ${label} - minden tanévben eggyel tovább lép.`,
      hinweisRegel:
        " Az évfolyam az osztály ÖSSZES tanulójának szövegfajtáit meghatározza. A program " +
        "megjegyzi a bejegyzés tanévét, és minden évben egy évfolyammal tovább lép - semmit " +
        "nem kell utánaállítani. A „Felnőttek” nem lép tovább.",
      hinweisPflichtZusatz: " Létrehozáskor az évfolyam megadása kötelező.",
      hinweisNichtGesetzt: (vorgabe: string) => ` A „nincs megadva” jelentése: az alapértelmezés érvényes (${vorgabe}).`,
      sprache: "Nyelv",
      spracheName: (bezug: string) => `Nyelv (${bezug})`,
      spracheHinweis: "Az osztály tanulóinak gyakorló szavai és szövegei ezen a nyelven jelennek meg.",
      sperreAufhebenHinweis:
        "Zárolás feloldása: az osztály tanulói újra maguk választhatják ki a nyelvet.",
      sperrenHinweis:
        "Nyelv zárolása: az osztály tanulói már nem változtathatják meg maguk.",
      sperreAufhebenName: (bezug: string) => `Nyelvi zárolás feloldása (${bezug})`,
      sperrenName: (bezug: string) => `Nyelv zárolása (${bezug})`,
      startniveau: "Az osztály kiindulópontja",
      startniveauName: (bezug: string) => `Kiindulópont az osztály összes tanulójának (${bezug})`,
      klassenmatchHinweis:
        "A tanulók meghívhatják egymást egy ötperces Osztályversenyre. A helyezéseket a program nem menti - a tanuló sorában csak az áll, hányszor vett részt.",
      klassenmatchErlauben: "Osztályverseny engedélyezése",
      zeilenEndeEnter: "Sor vége az Enter billentyűvel",
      zeilenEndeEnterHinweis:
        "Minden sort az Enter billentyű zár le - mint az irodai gépelésnél. Az osztály minden gyakorlatára érvényes, a Kihívásra és az Osztályversenyre is.",
      // Statt des en-Ternärs (nur en/de) eine vollständige Tabelle über alle Lernwege - sonst stünde beim Weg „hu" „német".
      lernwegLabel: (lernweg: Lernweg) =>
        `Tanfolyam: ${
          ({
            de: "német",
            en: "angol",
            fr: "francia",
            es: "spanyol",
            it: "olasz",
            pl: "lengyel",
            tr: "török",
            cs: "cseh",
            bg: "bolgár",
            el: "görög",
            hu: "magyar",
            nl: "holland",
            pt: "portugál",
            br: "brazíliai portugál",
            ro: "román",
            sv: "svéd",
            uk: "ukrán",
          } satisfies Record<Lernweg, string>)[lernweg]
        } sorrend`,
      lernwegHinweis:
        "A billentyűk bevezetésének sorrendje. Azokra a tanulókra érvényes, akik KÉSŐBB csatlakoznak az osztályhoz - annál a tanulónál, aki már gyakorol, soha semmi nem változik.",
      schreibweise: "Helyesírás",
      schreibweiseName: (bezug: string) => `Helyesírás (${bezug})`,
      schreibweiseHinweis:
        "Brit vagy amerikai - az osztály tanulóinak angol gyakorló szövegeire érvényes. Az „Automatikus” az eszközük nyelvéhez igazodik.",
      schreibweiseAuto: "Automatikus",
      schreibweiseGb: "Brit",
      schreibweiseUs: "Amerikai",
      schuljahrBeginn: "A tanév kezdete",
      schuljahrBeginnName: (bezug: string) => `A tanév kezdete (${bezug})`,
      schuljahrBeginnHinweis:
        "Az a hónap, amelynek első napján az osztály tanéve kezdődik. Ettől kezdve a statisztika „Tanév” nézete újraindul, és az évfolyam eggyel tovább lép. Magyarországon: szeptember.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      schulstufe: "Leerjaar",
      schulstufeName: (bezug: string) => `Leerjaar voor ${bezug}`,
      bitteWaehlen: "Maak een keuze",
      nichtGesetzt: "niet ingesteld",
      hinweisPflicht: "Verplicht - daaruit volgen de soorten tekst voor Tastenflow.",
      hinweisVorgabe: (vorgabe: string) =>
        `Standaard: ${vorgabe} - vul het leerjaar in.`,
      hinweisErwachsen: (label: string) => `Teksten voor volwassenen (${label}) - telt niet verder.`,
      hinweisAlter: (label: string) => `Teksten voor ${label} - groeit elk schooljaar mee.`,
      hinweisRegel:
        " Het leerjaar bepaalt de soorten tekst voor ALLE leerlingen van deze klas. De app " +
        "onthoudt het schooljaar waarin je het hebt ingevuld en telt elk jaar een leerjaar " +
        "verder - je hoeft niets bij te stellen. \"Volwassenen\" telt niet verder.",
      hinweisPflichtZusatz: " Bij het aanmaken van een klas is het leerjaar verplicht.",
      hinweisNichtGesetzt: (vorgabe: string) => ` "Niet ingesteld" betekent: de standaardwaarde ${vorgabe} geldt.`,
      sprache: "Taal",
      spracheName: (bezug: string) => `Taal voor ${bezug}`,
      spracheHinweis: "De taal van de oefenwoorden en -teksten voor de leerlingen van deze klas.",
      sperreAufhebenHinweis:
        "Slot opheffen: de leerlingen van deze klas kunnen de taal weer zelf kiezen.",
      sperrenHinweis:
        "Taal op slot zetten: de leerlingen van deze klas kunnen de taal niet meer zelf veranderen.",
      sperreAufhebenName: (bezug: string) => `Taalslot voor ${bezug} opheffen`,
      sperrenName: (bezug: string) => `Taal voor ${bezug} op slot zetten`,
      startniveau: "Startpunt van de klas",
      startniveauName: (bezug: string) => `Startpunt voor alle leerlingen van ${bezug}`,
      klassenmatchHinweis:
        "De leerlingen kunnen elkaar uitnodigen voor een wedstrijd van 5 minuten. Plaatsen worden niet bewaard - in de regel van een leerling staat alleen hoe vaak die heeft meegedaan.",
      klassenmatchErlauben: "Klassenwedstrijd toestaan",
      zeilenEndeEnter: "Regel afsluiten met Enter",
      zeilenEndeEnterHinweis:
        "Elke regel wordt afgesloten met de Enter-toets - zoals bij het typen op kantoor. Geldt voor alle oefeningen van deze klas, ook voor de Uitdaging en de klassenwedstrijd.",
      lernwegLabel: (lernweg: Lernweg) => `Leerroute: ${LERNWEG_LABEL_NL[lernweg]} volgorde`,
      lernwegHinweis:
        "De volgorde waarin de toetsen worden geïntroduceerd. Geldt voor leerlingen die LATER bij deze klas komen - bij een leerling die al oefent, verandert er nooit iets.",
      schreibweise: "Spelling",
      schreibweiseName: (bezug: string) => `Spelling voor ${bezug}`,
      schreibweiseHinweis:
        "Brits of Amerikaans - geldt voor de oefenteksten van de leerlingen van deze klas. \"Automatisch\" volgt de taal van hun apparaat.",
      schreibweiseAuto: "Automatisch",
      schreibweiseGb: "Brits",
      schreibweiseUs: "Amerikaans",
      schuljahrBeginn: "Begin van het schooljaar",
      schuljahrBeginnName: (bezug: string) => `Begin van het schooljaar voor ${bezug}`,
      schuljahrBeginnHinweis:
        "De maand waarin het schooljaar van deze klas begint, op de eerste dag van die maand. Vanaf dan begint \"Schooljaar\" in de statistiek opnieuw en gaat het leerjaar een stap verder. In Nederland: augustus, in Vlaanderen: september.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      schulstufe: "Ano de escolaridade",
      schulstufeName: (bezug: string) => `Ano de escolaridade para ${bezug}`,
      bitteWaehlen: "Escolher",
      nichtGesetzt: "não definido",
      hinweisPflicht: "Obrigatório - determina os tipos de texto que o Tastenflow usa.",
      hinweisVorgabe: (vorgabe: string) =>
        `Predefinição: ${vorgabe} - indique o ano de escolaridade.`,
      hinweisErwachsen: (label: string) => `Textos para pessoas adultas (${label}) - não avança.`,
      hinweisAlter: (label: string) => `Textos para ${label} - avança a cada ano letivo.`,
      hinweisRegel:
        " O ano de escolaridade determina os tipos de texto para TODAS as pessoas desta turma. A aplicação " +
        "memoriza o ano letivo em que foi introduzido e avança um ano de escolaridade todos os " +
        "anos - não é preciso alterar nada. \"Pessoas adultas\" não avança.",
      hinweisPflichtZusatz: " Ao criar a turma, o ano de escolaridade é obrigatório.",
      hinweisNichtGesetzt: (vorgabe: string) => ` "Não definido" significa: aplica-se a predefinição ${vorgabe}.`,
      sprache: "Língua",
      spracheName: (bezug: string) => `Língua para ${bezug}`,
      spracheHinweis: "A língua das palavras e dos textos de prática para as pessoas desta turma.",
      sperreAufhebenHinweis:
        "Desbloquear: as pessoas desta turma voltam a poder escolher a língua.",
      sperrenHinweis:
        "Bloquear a língua: as pessoas desta turma deixam de a poder alterar.",
      sperreAufhebenName: (bezug: string) => `Desbloquear a língua para ${bezug}`,
      sperrenName: (bezug: string) => `Bloquear a língua para ${bezug}`,
      startniveau: "Ponto de partida da turma",
      startniveauName: (bezug: string) => `Ponto de partida para todas as pessoas de ${bezug}`,
      klassenmatchHinweis:
        "As pessoas da turma podem convidar-se umas às outras para uma corrida de 5 minutos. As classificações não são guardadas - a linha de cada pessoa mostra apenas quantas vezes participou.",
      klassenmatchErlauben: "Permitir a Corrida da turma",
      zeilenEndeEnter: "Fim de linha com Enter",
      zeilenEndeEnterHinweis:
        "Cada linha termina com a tecla Enter - como ao escrever num escritório. Aplica-se a todos os exercícios desta turma, incluindo o Desafio e a Corrida da turma.",
      // Alle Lernwege genannt (die englische Fassung kennt nur en/de) - Adjektiv f. zu „ordem".
      lernwegLabel: (lernweg: Lernweg) =>
        `Curso: ordem ${
          ({
            de: "alemã",
            en: "inglesa",
            fr: "francesa",
            es: "espanhola",
            it: "italiana",
            pl: "polaca",
            tr: "turca",
            cs: "checa",
            bg: "búlgara",
            el: "grega",
            hu: "húngara",
            nl: "neerlandesa",
            pt: "portuguesa (Portugal)",
            br: "portuguesa (Brasil)",
            ro: "romena",
            sv: "sueca",
            uk: "ucraniana",
          } as Record<Lernweg, string>)[lernweg]
        }`,
      lernwegHinweis:
        "A ordem em que as teclas são introduzidas. Aplica-se às pessoas que entram nesta turma MAIS TARDE - para quem já está a praticar, nada muda.",
      schreibweise: "Ortografia",
      schreibweiseName: (bezug: string) => `Ortografia para ${bezug}`,
      schreibweiseHinweis:
        "Britânica ou americana - aplica-se aos textos de prática das pessoas desta turma. \"Automática\" segue a língua do dispositivo de cada pessoa.",
      schreibweiseAuto: "Automática",
      schreibweiseGb: "Britânica",
      schreibweiseUs: "Americana",
      schuljahrBeginn: "Início do ano letivo",
      schuljahrBeginnName: (bezug: string) => `Início do ano letivo para ${bezug}`,
      schuljahrBeginnHinweis:
        "O mês em cujo dia 1 começa o ano letivo desta turma. A partir daí, o \"Ano letivo\" nas estatísticas recomeça e o ano de escolaridade avança um. Em Portugal: setembro.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      schulstufe: "Ano escolar",
      schulstufeName: (bezug: string) => `Ano escolar: ${bezug}`,
      bitteWaehlen: "Selecione",
      nichtGesetzt: "não definido",
      hinweisPflicht: "Obrigatório - define os tipos de texto que o Tastenflow usa.",
      hinweisVorgabe: (vorgabe: string) => `Padrão: ${vorgabe} - informe o ano escolar.`,
      hinweisErwachsen: (label: string) => `Textos para pessoas adultas (${label}) - não avança.`,
      hinweisAlter: (label: string) => `Textos para ${label} - avança a cada ano letivo.`,
      hinweisRegel:
        " O ano escolar define os tipos de texto para TODAS as pessoas desta turma. O aplicativo " +
        "guarda o ano letivo em que ele foi informado e avança um ano escolar a cada ano - você não " +
        `precisa ajustar nada. "Pessoas adultas" não avança.`,
      hinweisPflichtZusatz: " Ao criar a turma, o ano escolar é obrigatório.",
      hinweisNichtGesetzt: (vorgabe: string) => ` "Não definido" significa: vale o padrão ${vorgabe}.`,
      sprache: "Idioma",
      spracheName: (bezug: string) => `Idioma: ${bezug}`,
      spracheHinweis: "O idioma das palavras e dos textos de prática para as pessoas desta turma.",
      sperreAufhebenHinweis:
        "Desbloquear: as pessoas desta turma voltam a poder escolher o idioma.",
      sperrenHinweis:
        "Bloquear o idioma: as pessoas desta turma não podem mais mudá-lo.",
      sperreAufhebenName: (bezug: string) => `Desbloquear o idioma: ${bezug}`,
      sperrenName: (bezug: string) => `Bloquear o idioma: ${bezug}`,
      startniveau: "Ponto de partida da turma",
      startniveauName: (bezug: string) => `Ponto de partida para todas as pessoas: ${bezug}`,
      klassenmatchHinweis:
        "As pessoas da turma podem convidar umas às outras para uma competição de 5 minutos. As posições não são salvas - a linha de cada pessoa mostra só quantas vezes ela participou.",
      klassenmatchErlauben: "Permitir a Competição da turma",
      zeilenEndeEnter: "Fim de linha com Enter",
      zeilenEndeEnterHinweis:
        "Cada linha termina com a tecla Enter - como ao digitar num escritório. Vale para todos os exercícios desta turma, também para o Desafio e a Competição da turma.",
      lernwegLabel: (lernweg: Lernweg) => `Curso: ordem ${LERNWEG_LABEL_PT[lernweg]}`,
      lernwegHinweis:
        "A ordem em que as teclas são apresentadas. Vale para quem entrar nesta turma MAIS TARDE - para quem já está praticando, nada muda.",
      schreibweise: "Ortografia",
      schreibweiseName: (bezug: string) => `Ortografia: ${bezug}`,
      schreibweiseHinweis:
        "Britânica ou americana - vale para os textos de prática das pessoas desta turma. Automática segue o idioma do dispositivo de cada pessoa.",
      schreibweiseAuto: "Automática",
      schreibweiseGb: "Britânica",
      schreibweiseUs: "Americana",
      schuljahrBeginn: "Início do ano letivo",
      schuljahrBeginnName: (bezug: string) => `Início do ano letivo: ${bezug}`,
      schuljahrBeginnHinweis:
        "O mês em cujo primeiro dia começa o ano letivo desta turma. A partir daí, Ano letivo recomeça nas estatísticas e o ano escolar avança um. No Brasil: fevereiro.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      schulstufe: "Anul de studiu",
      schulstufeName: (bezug: string) => `Anul de studiu pentru clasa ${bezug}`,
      bitteWaehlen: "Alegeți",
      nichtGesetzt: "nesetat",
      hinweisPflicht: "Obligatoriu - de aici vin tipurile de texte pentru Tastenflow.",
      hinweisVorgabe: (vorgabe: string) =>
        `Valoare implicită: ${vorgabe} - introduceți anul de studiu.`,
      hinweisErwachsen: (label: string) => `Texte pentru adulți (${label}) - nu mai crește.`,
      hinweisAlter: (label: string) => `Texte pentru vârsta ${label} - crește cu fiecare an școlar.`,
      hinweisRegel:
        " Anul de studiu stabilește tipurile de texte pentru TOȚI elevii acestei clase. Aplicația " +
        "ține minte anul școlar în care l-ați introdus și numără în fiecare an o treaptă mai departe - " +
        "nu trebuie să reglați nimic. „Adulți” nu mai crește.",
      hinweisPflichtZusatz: " La crearea clasei, anul de studiu este obligatoriu.",
      hinweisNichtGesetzt: (vorgabe: string) =>
        ` „Nesetat” înseamnă: se aplică valoarea implicită ${vorgabe}.`,
      sprache: "Limba",
      spracheName: (bezug: string) => `Limba pentru clasa ${bezug}`,
      // Limba TEXTELOR de exersat (Glosar §2.5), nu limba interfeței.
      spracheHinweis: "Limba cuvintelor și textelor de exersat pentru elevii acestei clase.",
      sperreAufhebenHinweis:
        "Deblocați limba: elevii acestei clase pot alege din nou singuri limba.",
      sperrenHinweis:
        "Blocați limba: elevii acestei clase nu o mai pot schimba singuri.",
      sperreAufhebenName: (bezug: string) => `Deblocați limba pentru clasa ${bezug}`,
      sperrenName: (bezug: string) => `Blocați limba pentru clasa ${bezug}`,
      startniveau: "Punctul de plecare al clasei",
      startniveauName: (bezug: string) => `Punctul de plecare pentru toți elevii din clasa ${bezug}`,
      klassenmatchHinweis:
        "Elevii se pot invita unii pe alții la o întrecere de cinci minute. Clasamentele nu se salvează - în rândul unei persoane apare doar de câte ori a participat.",
      klassenmatchErlauben: "Permiteți Întrecerea clasei",
      zeilenEndeEnter: "Sfârșit de rând cu tasta Enter",
      zeilenEndeEnterHinweis:
        "Fiecare rând se încheie cu tasta Enter - ca la scrisul de birou. Se aplică tuturor exercițiilor acestei clase, inclusiv Provocării și Întrecerii clasei.",
      lernwegLabel: (lernweg: Lernweg) => `Curs: ordinea ${LERNWEG_LABEL_RO[lernweg]}`,
      lernwegHinweis:
        "Ordinea în care sunt introduse tastele. Se aplică elevilor care intră în această clasă MAI TÂRZIU - pentru o persoană care exersează deja nu se schimbă niciodată nimic.",
      schreibweise: "Ortografie",
      schreibweiseName: (bezug: string) => `Ortografia pentru clasa ${bezug}`,
      schreibweiseHinweis:
        "Britanică sau americană - se aplică textelor de exersat ale elevilor acestei clase. „Automat” se orientează după limba dispozitivului lor.",
      schreibweiseAuto: "Automat",
      schreibweiseGb: "Britanică",
      schreibweiseUs: "Americană",
      schuljahrBeginn: "Începutul anului școlar",
      schuljahrBeginnName: (bezug: string) => `Începutul anului școlar pentru clasa ${bezug}`,
      schuljahrBeginnHinweis:
        "Luna în a cărei primă zi începe anul școlar al acestei clase. De atunci, „Anul școlar” din statistică începe din nou, iar anul de studiu crește cu o treaptă. În România și în Republica Moldova: septembrie.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      schulstufe: "Årskurs",
      schulstufeName: (bezug: string) => `Årskurs för ${bezug}`,
      bitteWaehlen: "Välj",
      nichtGesetzt: "inte angiven",
      hinweisPflicht: "Obligatoriskt - årskursen avgör vilka texttyper Tastenflow använder.",
      hinweisVorgabe: (vorgabe: string) =>
        `Standard: ${vorgabe} - fyll i årskursen.`,
      hinweisErwachsen: (label: string) => `Texter för vuxna (${label}) - flyttas inte upp.`,
      hinweisAlter: (label: string) => `Texter för ${label} - flyttas upp varje läsår.`,
      hinweisRegel:
        " Årskursen avgör texttyperna för alla elever i klassen. Appen kommer ihåg " +
        "läsåret då du fyllde i den och flyttar upp en årskurs varje år - du behöver " +
        "inte ändra något. Vuxna flyttas inte upp.",
      hinweisPflichtZusatz: " Årskursen är obligatorisk när du skapar en klass.",
      hinweisNichtGesetzt: (vorgabe: string) => ` Inte angiven betyder: standardvärdet ${vorgabe} gäller.`,
      sprache: "Språk",
      spracheName: (bezug: string) => `Språk för ${bezug}`,
      spracheHinweis: "Språket för övningsorden och övningstexterna för eleverna i klassen.",
      sperreAufhebenHinweis:
        "Lås upp: eleverna i klassen kan själva välja språk igen.",
      sperrenHinweis:
        "Lås språket: eleverna i klassen kan inte längre ändra det själva.",
      sperreAufhebenName: (bezug: string) => `Lås upp språket för ${bezug}`,
      sperrenName: (bezug: string) => `Lås språket för ${bezug}`,
      startniveau: "Startpunkt för klassen",
      startniveauName: (bezug: string) => `Startpunkt för alla elever i ${bezug}`,
      klassenmatchHinweis:
        "Eleverna kan bjuda in varandra till en klasstävling på 5 minuter. Placeringar sparas inte - i en elevs rad står bara hur ofta eleven har varit med.",
      klassenmatchErlauben: "Tillåt Klasstävlingen",
      zeilenEndeEnter: "Radslut med Retur",
      zeilenEndeEnterHinweis:
        "Varje rad avslutas med Retur - som när man skriver på ett kontor. Gäller alla övningar i klassen, även Utmaningen och Klasstävlingen.",
      lernwegLabel: (lernweg: Lernweg) =>
        `Kurs: ${LERNWEG_LABEL_SV[lernweg]} ordning`,
      lernwegHinweis:
        "Ordningen som tangenterna introduceras i. Gäller elever som går med i klassen senare - för en elev som redan övar ändras ingenting.",
      schreibweise: "Stavning",
      schreibweiseName: (bezug: string) => `Stavning för ${bezug}`,
      schreibweiseHinweis:
        "Brittisk eller amerikansk - gäller övningstexterna för eleverna i klassen. Automatiskt följer språket på elevernas enheter.",
      schreibweiseAuto: "Automatiskt",
      schreibweiseGb: "Brittisk",
      schreibweiseUs: "Amerikansk",
      schuljahrBeginn: "Läsårets början",
      schuljahrBeginnName: (bezug: string) => `Läsårets början för ${bezug}`,
      schuljahrBeginnHinweis:
        "Månaden på vars första dag klassens läsår börjar. Från och med då börjar Läsår i statistiken om, och årskursen flyttas upp ett steg. I Sverige och Finland: augusti.",
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      schulstufe: "Рік навчання",
      schulstufeName: (bezug: string) => `Рік навчання для класу ${bezug}`,
      bitteWaehlen: "Виберіть",
      nichtGesetzt: "не вказано",
      hinweisPflicht: "Обов'язково - від цього залежать види текстів у Tastenflow.",
      hinweisVorgabe: (vorgabe: string) => `Типово: ${vorgabe} - укажіть рік навчання.`,
      hinweisErwachsen: (label: string) => `Тексти для дорослих (${label}) - з роками не змінюється.`,
      hinweisAlter: (label: string) => `Тексти для віку ${label} - зростає з кожним навчальним роком.`,
      hinweisRegel:
        " Рік навчання визначає види текстів для ВСІХ дітей цього класу. Програма запам'ятовує " +
        "навчальний рік, у якому його вказано, і щороку додає один рік - вам нічого не треба " +
        "змінювати. «Дорослі» не змінюється.",
      hinweisPflichtZusatz: " Під час створення класу рік навчання обов'язковий.",
      hinweisNichtGesetzt: (vorgabe: string) => ` «Не вказано» означає: діє типове значення ${vorgabe}.`,
      sprache: "Мова",
      spracheName: (bezug: string) => `Мова для класу ${bezug}`,
      spracheHinweis: "Мова слів і текстів для вправ дітей цього класу.",
      sperreAufhebenHinweis:
        "Зняти блокування: діти цього класу знову можуть самі вибирати мову.",
      sperrenHinweis:
        "Заблокувати мову: діти цього класу більше не можуть самі її змінювати.",
      sperreAufhebenName: (bezug: string) => `Зняти блокування мови для класу ${bezug}`,
      sperrenName: (bezug: string) => `Заблокувати мову для класу ${bezug}`,
      startniveau: "Точка старту класу",
      startniveauName: (bezug: string) => `Точка старту для всіх дітей класу ${bezug}`,
      klassenmatchHinweis:
        "Діти можуть запрошувати одне одного на 5-хвилинні Перегони класу. Місця не зберігаються - у рядку дитини видно лише, скільки разів вона брала участь.",
      klassenmatchErlauben: "Дозволити Перегони класу",
      zeilenEndeEnter: "Кінець рядка - клавішею Enter",
      zeilenEndeEnterHinweis:
        "Кожен рядок завершується клавішею Enter - як під час друку в офісі. Діє для всіх вправ цього класу, також для Виклику й Перегонів класу.",
      lernwegLabel: (lernweg: Lernweg) =>
        `Курс: ${LERNWEG_LABEL_UK[lernweg]} порядок клавіш`,
      lernwegHinweis:
        "Порядок, у якому з'являються клавіші. Діє для дітей, які приєднаються до цього класу ПІЗНІШЕ - для дитини, яка вже тренується, нічого не змінюється.",
      schreibweise: "Правопис",
      schreibweiseName: (bezug: string) => `Правопис для класу ${bezug}`,
      schreibweiseHinweis:
        "Британський або американський - діє для текстів вправ дітей цього класу. «Автоматично» залежить від мови їхнього пристрою.",
      schreibweiseAuto: "Автоматично",
      schreibweiseGb: "Британський",
      schreibweiseUs: "Американський",
      schuljahrBeginn: "Початок навчального року",
      schuljahrBeginnName: (bezug: string) => `Початок навчального року для класу ${bezug}`,
      schuljahrBeginnHinweis:
        "Місяць, з першого числа якого починається навчальний рік цього класу. Відтоді «Навчальний рік» у статистиці починається знову, а рік навчання збільшується на один. В Україні: вересень.",
    },
});

/**
 * Ein beschriftetes Feld.
 *
 * ★ Seit 11.09.2026 (Nacht) HIER statt in `TastenflowReiter.tsx` - dieselbe
 * Hülle trägt jetzt auch das Anlege-Formular der Verwaltung.
 *
 * ★★ E12 (19.09.2026, Mouseover-/Schlank-Durchgang): Bis dahin hängte dieser
 * Baustein selbst einen `hinweis` als DAUERHAFTEN Absatz unter das Feld -
 * genau die Bauart, die Johannes abgeschafft haben wollte: *„halte die Seite
 * jetzt extrem schlank und mach keine dauerhaften Erklärungen unter den
 * Schaltern, das geht mit Mouseover"*. Der Hinweis hängt seither an der
 * KONTROLLE selbst (`Tipp` am `<select>`, siehe die drei Felder unten) - `Feld`
 * bringt nur noch die Beschriftung mit.
 */
export function Feld({
  id,
  beschriftung,
  breit = false,
  children,
}: {
  id?: string;
  beschriftung: string;
  /**
   * ★ 23.09.2026: eine ganze Zeile für sich. Der Platzhalter des Startniveaus
   * („Choose a starting point - most pupils are at “First letters + capitals”")
   * war neben Schulstufe und Sprache abgeschnitten - ein Auswahlfeld bricht
   * nicht um, es schneidet ab.
   */
  breit?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={breit ? "min-w-[11rem] flex-1 basis-full" : "min-w-[11rem] flex-1"}>
      <span className="field-label" id={id}>
        {beschriftung}
      </span>
      {children}
    </div>
  );
}

/** Was die Felder zeigen. */
export interface KlassenFelderWerte {
  /** Die HEUTIGE Schulstufe (`aktuelleSchulstufe`) - `null` = keine. */
  schulstufe: number | null;
  lang: Lang;
  langLocked: boolean;
  klassenmatchAus: boolean;
  /** ★ Zeilenende mit Enter (23.09.2026) - siehe TypingClass.zeilenEndeEnter. */
  zeilenEndeEnter: boolean;
  /**
   * ★ E9 (24.09.2026, Bauplan §8.2): die Schreibweise der Klasse - `""` heisst
   * „automatisch" (keine Vorgabe, `tt_classes.schreibweise` leer). Optional:
   * fehlt sie, zeigt das Bauteil das Feld gar nicht (siehe `onSchreibweise`).
   */
  schreibweise?: EnglischVariante | "";
  /**
   * ★ D2 (28.09.2026): der Beginn des Schuljahres (Monat 1-12). Optional wie
   * `schreibweise`: fehlt `onSchuljahrBeginn`, zeigt das Bauteil das Feld nicht.
   */
  schuljahrBeginn?: number;
  /**
   * ★ Gezielt üben (13.11.2026): was an der Klasse gespeichert ist. Optional wie `schreibweise`: fehlt
   * `onGezielt`, zeigt das Bauteil die Zeile nicht.
   */
  gezielt?: Gezielt | null;
}

export function KlassenEinstellungsFelder({
  bezug,
  werte,
  jetztMs,
  pflicht = false,
  startniveau,
  schulstufeRef,
  startniveauRef,
  onSchulstufe,
  onSprache,
  onSperre,
  onStartniveau,
  onKlassenmatch,
  onZeilenEnde,
  onSchreibweise,
  onSchuljahrBeginn,
  onGezielt,
}: {
  /** „der Klasse 3b" oder „der neuen Klasse" - steht in jedem Feldnamen. */
  bezug: string;
  werte: KlassenFelderWerte;
  jetztMs: number;
  /**
   * Beim ANLEGEN sind Schulstufe und Startniveau Pflicht: kein „nicht gesetzt",
   * sondern ein „Bitte wählen", das als nicht ausgefüllt zählt.
   */
  pflicht?: boolean;
  startniveau: {
    /**
     * ★ E1 (24.09.2026): der Lernweg der Klasse - die Startniveaus sind
     * ANZAHLEN und gelten nur in ihm (Bauplan englischer Lehrgang §2.4).
     */
    lernweg: Lernweg;
    /** Wert des Auswahlfelds - `""` zeigt den Platzhalter. */
    wert: string;
    platzhalter: string;
    /** Sichtbarer Satz unter dem Feld. */
    hinweis: string;
    /** Ausführlicher Satz für Sprachausgaben. */
    srHinweis: string;
  };
  schulstufeRef?: React.Ref<HTMLSelectElement>;
  startniveauRef?: React.Ref<HTMLSelectElement>;
  /** `0` = „nicht gesetzt" bzw. beim Anlegen „Bitte wählen". */
  onSchulstufe: (stufe: number) => void;
  onSprache: (lang: Lang) => void;
  onSperre: (gesperrt: boolean) => void;
  /** `0` = beim Anlegen zurück auf „Bitte wählen". */
  onStartniveau: (units: number) => void;
  onKlassenmatch: (erlaubt: boolean) => void;
  /** ★ Zeilenende mit Enter (23.09.2026) - `true` = Pflicht für alle Kinder. */
  onZeilenEnde: (an: boolean) => void;
  /**
   * ★ E9 (24.09.2026): fehlt dieser Handler, zeigt das Bauteil das
   * Schreibweise-Feld gar nicht - so bleiben Aufrufer, die es (noch) nicht
   * anbinden, unverändert.
   */
  onSchreibweise?: (variante: EnglischVariante | "") => void;
  /**
   * ★ D2 (28.09.2026): der Beginn des Schuljahres - fehlt der Handler, zeigt
   * das Bauteil das Feld nicht (Aufrufer ohne ihn bleiben unverändert).
   */
  onSchuljahrBeginn?: (monat: number) => void;
  /** ★ Gezielt üben (13.11.2026): fehlt der Handler, zeigt das Bauteil die Zeile nicht. `null` = ausschalten. */
  onGezielt?: (g: Gezielt | null) => void;
}) {
  const klassenmatchId = useId();
  const zeilenEndeId = useId();
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` (Muster aus E11a-2/-3) - FELDER_TEXTE kennt „fr" bereits seit
  // E11a; confirmed Tastenflow-only (E11a-3 §6, nicht in GEMEINSAM.md).
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = FELDER_TEXTE[sprache];
  const stufe = werte.schulstufe;
  const textstufe = klassenStufe(
    { schulstufe: stufe ?? undefined, schulstufeSchuljahr: schuljahrStartjahr(jetztMs) },
    jetztMs,
  );
  const starts = startPunkte(sprache, startniveau.lernweg);
  const vorgabe = stufeLabel(VORGABE_STUFE, sprache);

  /*
    ★★ E12 (19.09.2026): EIN Hinweis statt zweier - bis dahin stand hier ein
    kurzer, immer sichtbarer Satz (dieser Text) UND daneben ein zweiter,
    ausführlicherer nur für Sprachausgaben (`sr-only`). Beide erklärten
    dieselbe Sache verschieden ausführlich; jetzt trägt EINER die volle
    Bedeutung und hängt am Feld selbst (`Tipp`), nicht mehr als Absatz auf der
    Seite.
  */
  const schulstufeHinweis =
    (stufe === null
      ? pflicht
        ? t.hinweisPflicht
        : t.hinweisVorgabe(vorgabe)
      : stufe === SCHULSTUFE_ERWACHSEN
        ? t.hinweisErwachsen(stufeLabel("erwachsen", sprache))
        : t.hinweisAlter(stufeLabel(textstufe, sprache))) +
    t.hinweisRegel +
    (pflicht ? t.hinweisPflichtZusatz : t.hinweisNichtGesetzt(vorgabe));

  return (
    // ★ E11a-4 (26.09.2026): `<div lang>` statt `<>` - trägt jetzt „fr", wenn
    // die Bedienung französisch ist (mehrere Geschwister-Elemente brauchen
    // eine gemeinsame Wurzel für das Attribut).
    <div lang={htmlLang(sprache)}>
      <div className="flex flex-wrap items-start gap-3">
        {/*
          ════════════════════════════════════════════════════════════════════
          ★★★ SCHULSTUFE statt Textstufe (B9)
          ════════════════════════════════════════════════════════════════════
          Die Lehrkraft weiss ohne Nachdenken, in welcher Schulstufe ihre
          Klasse ist; „11-15 Jahre" ist schon eine Übersetzung. Die App
          übersetzt sie selbst - und zählt jedes Schuljahr eine Stufe weiter
          (Rechnung in `klassenEinstellungen.ts`). ★ Seit 11.09.2026 (Nacht)
          auch „Erwachsen" (Johannes) - zählt nicht weiter.
        */}
        <Feld beschriftung={t.schulstufe}>
          {/* ★ E12, Browser-Messung (700 px): das erste Feld der Zeile steht
              ganz links - „rechts" (Vorgabe) lief über den Fensterrand. */}
          <Tipp text={schulstufeHinweis} ausrichtung="links">
            {(hinweisId) => (
              <select
                ref={schulstufeRef}
                className="field-input feld-schlank"
                value={stufe === null ? "" : String(stufe)}
                aria-label={t.schulstufeName(bezug)}
                aria-describedby={hinweisId}
                aria-required={pflicht || undefined}
                onChange={(e) => onSchulstufe(e.target.value === "" ? 0 : Number(e.target.value))}
              >
                <option value="">{pflicht ? t.bitteWaehlen : t.nichtGesetzt}</option>
                {SCHULSTUFEN_WAHL.map((s) => (
                  <option key={s.wert} value={String(s.wert)}>
                    {/* ★ E11a-4 (26.09.2026): dritte Fassung statt der alten
                        `=== "en"`-Weiche (Falle 30) - sonst bekäme „fr" hier
                        still den deutschen Schulstufen-Namen (`s.label`). */}
                    {sprache === "en"
                      ? schulstufeLabelEn(s.wert)
                      : sprache === "fr"
                        ? schulstufeLabelFr(s.wert)
                        : sprache === "es"
                          ? schulstufeLabelEs(s.wert)
                          : sprache === "it"
                            ? schulstufeLabelIt(s.wert)
                            : sprache === "pl"
                              ? schulstufeLabelPl(s.wert) // ★ O-PL
                              : sprache === "tr"
                                ? schulstufeLabelTr(s.wert) // ★ O-TR
                                : sprache === "cs"
                                  ? schulstufeLabelCs(s.wert) // ★ O-CS
                                  : sprache === "de"
                                    ? s.label
                                    : schulstufeText(s.wert, sprache) /* ★ SPRACHEN-9 (30.10.2026): die neun, sonst deutscher Name */}
                  </option>
                ))}
              </select>
            )}
          </Tipp>
        </Feld>

        {/* ★ Sprache und Sperre - gebaut wie bisher je Kind, jetzt für alle. */}
        <Feld beschriftung={t.sprache}>
          <div className="flex items-center gap-1">
            {/* ★ K2 (19.09.2026): war die einzige der vier Zeilen-Kontrollen
                ohne eigenen Hinweis - Schulstufe und Startniveau daneben
                hatten schon einen, die Sperre gleich rechts auch. */}
            <Tipp text={t.spracheHinweis}>
              {(hinweisId) => (
                <select
                  className="field-input feld-schlank"
                  value={uebungsSpracheImWeg(werte.lang, startniveau.lernweg)}
                  aria-label={t.spracheName(bezug)}
                  aria-describedby={hinweisId}
                  onChange={(e) => onSprache(e.target.value as Lang)}
                >
                  {/* ★ E11c (26.09.2026): „Français" nur für eine Klasse auf
                      dem Weg „fr" (oder eine, deren Sprache schon „fr" ist) -
                      Französisch gibt es nur auf Weg „fr" (Bauplan F15), und
                      ein Wert ohne Option stünde sonst unsichtbar im Feld. */}
                  {/* ★ ES-O (27.09.2026): ebenso „Español" für eine Klasse auf dem Weg „es". */}
                  {/* ★★★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M2/M3): auf Weg
                      „fr"/„es" NUR die Sprache des Weges - bis hierher stand
                      dort auch „Deutsch"/„English" zur Wahl, und eine Klasse
                      auf Weg „es" mit Übungssprache Deutsch bekam deutsche
                      Texte auf der spanischen Reihenfolge. Auf Weg „de"/„en"
                      wie bisher Deutsch und Englisch. Ein gespeicherter Wert,
                      der nicht zum Weg passt, wird als die Sprache des Weges
                      gezeigt (`uebungsSpracheImWeg`) - so gilt er auch. */}
                  {uebungsSprachenImWeg(startniveau.lernweg).map((l) => (
                    <option key={l} value={l}>
                      {langLabel(l, sprache)}
                    </option>
                  ))}
                </select>
              )}
            </Tipp>
            <Tipp
              text={
                werte.langLocked ? t.sperreAufhebenHinweis : t.sperrenHinweis
              }
              /*
                ⚠️ „rechts", nicht „links" - im Browser gemessen (11.09.2026,
                `npm run pruefstand:seitenbreite`): Links angedockt lief die
                320 px breite Klipphülle bei einem 700 px breiten Fenster bis
                721 px und machte die Seite 21 px breiter. Rechts angedockt
                läuft sie nach innen.
              */
              ausrichtung="rechts"
            >
              {(hinweisId) => (
                <button
                  type="button"
                  aria-pressed={werte.langLocked}
                  aria-label={
                    werte.langLocked ? t.sperreAufhebenName(bezug) : t.sperrenName(bezug)
                  }
                  aria-describedby={hinweisId}
                  className={
                    (werte.langLocked ? "btn-primary" : "btn-secondary") +
                    // ⚠️ `leading-5`: `text-base` allein machte den Knopf 36 px
                    // hoch und damit 2 px höher als alles daneben.
                    " btn-toggle btn-umriss px-1.5 text-base leading-5"
                  }
                  onClick={() => onSperre(!werte.langLocked)}
                >
                  <span aria-hidden="true">{werte.langLocked ? "🔒" : "🔓"}</span>
                </button>
              )}
            </Tipp>
          </div>
        </Feld>

        {/*
          ★★★ D2 (28.09.2026): BEGINN DES SCHULJAHRES - der Monat, an dessen
          Erstem das Schuljahr der Klasse beginnt (Cono Sur Februar,
          Mittelamerika Januar, DACH August). Vorgabe beim Anlegen aus dem
          Land der Lehrkraft (`schuljahrBeginn.ts`); eine Klasse ohne Wert
          zeigt August - so rechnet sie auch.
        */}
        {onSchuljahrBeginn && (
          <Feld beschriftung={t.schuljahrBeginn}>
            <Tipp text={t.schuljahrBeginnHinweis}>
              {(hinweisId) => (
                <select
                  className="field-input feld-schlank"
                  value={String(werte.schuljahrBeginn ?? SCHULJAHR_BEGINN_VORGABE)}
                  aria-label={t.schuljahrBeginnName(bezug)}
                  aria-describedby={hinweisId}
                  onChange={(e) => onSchuljahrBeginn(Number(e.target.value))}
                >
                  {MONATE_JE_SPRACHE[sprache].map((monat, i) => (
                    <option key={monat} value={String(i + 1)}>
                      {monat}
                    </option>
                  ))}
                </select>
              )}
            </Tipp>
          </Feld>
        )}

        {/*
          ★★★ E9 (24.09.2026, Bauplan §8.2): SCHREIBWEISE - nur bei
          englischer Übungssprache sichtbar, anders als der Lernweg (§8.1)
          jederzeit änderbar (keine Taste hängt an ihr). Nur, wenn der
          Aufrufer `onSchreibweise` mitgibt (siehe die Doku dort).
          ★ FREIGABE 25.09.2026: nicht mehr an den Probe-Schalter gebunden -
          sichtbar, wenn die BEDIENUNG englisch ist ODER die Klasse englisch
          übt (`werte.lang === "en"`). Eine deutsche Bedienung mit deutscher
          Klasse sieht dieses Feld nie.
        */}
        {(sprache === "en" || werte.lang === "en") && onSchreibweise && (
          <Feld beschriftung={t.schreibweise}>
            <Tipp text={t.schreibweiseHinweis}>
              {(hinweisId) => (
                <select
                  className="field-input feld-schlank"
                  value={werte.schreibweise ?? ""}
                  aria-label={t.schreibweiseName(bezug)}
                  aria-describedby={hinweisId}
                  onChange={(e) =>
                    onSchreibweise(e.target.value as EnglischVariante | "")
                  }
                >
                  <option value="">{t.schreibweiseAuto}</option>
                  <option value="gb">{t.schreibweiseGb}</option>
                  <option value="us">{t.schreibweiseUs}</option>
                </select>
              )}
            </Tipp>
          </Feld>
        )}

        {/*
          ★★★ STARTNIVEAU DER KLASSE. Seit 11.09.2026 (Nacht) eine gespeicherte
          Vorgabe (Johannes: „Startniveau als Vorgabe an der Klasse speichern")
          - sie gilt auch für Kinder, die später beitreten. Die Rechnung steht
          in `startpunktMitKlasse` (`klassenEinstellungen.ts`).
        */}
        <Feld beschriftung={t.startniveau} breit>
          {/* ★ E12: EIN Hinweis (`hinweis` + `srHinweis` zusammengeführt) statt
              eines sichtbaren Absatzes plus eines zweiten, nur für
              Sprachausgaben - siehe die Begründung an `schulstufeHinweis`. */}
          <Tipp text={`${startniveau.hinweis} ${startniveau.srHinweis}`}>
            {(hinweisId) => (
              <select
                ref={startniveauRef}
                className="field-input feld-schlank"
                value={startniveau.wert}
                aria-label={t.startniveauName(bezug)}
                aria-describedby={hinweisId}
                aria-required={pflicht || undefined}
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (pflicht) onStartniveau(0);
                    return;
                  }
                  onStartniveau(Number(e.target.value));
                }}
              >
                <option value="">{startniveau.platzhalter}</option>
                {starts.map((sp) => (
                  <option key={sp.key} value={sp.units}>
                    {sp.label}
                  </option>
                ))}
              </select>
            )}
          </Tipp>
        </Feld>
      </div>

      {/*
        ★★ E8 (24.09.2026, Bauplan englischer Lehrgang §7): der Lernweg der
        Klasse als reine AUSKUNFT, kein Bedienelement - er wird beim ersten
        Fortschritt eines Kindes fest (§2.2) und ändert sich hier nie.
        ★ FREIGABE 25.09.2026: nicht mehr an den Probe-Schalter gebunden -
        sichtbar, wenn die BEDIENUNG englisch ist oder die Klasse schon auf
        dem englischen Weg steht. Eine deutsche Bedienung mit einer Klasse auf
        Weg „de" soll nie einen zweiten Lehrgang erwähnt sehen.
        ★ E11a-4 (26.09.2026): auf „fr" geweitet (`!== "de"` statt `=== "en"`,
        beidseitig) - `lernwegLabel` kennt „fr" über `LERNWEG_LABEL_FR`
        bereits als echte Tabelle, nicht als weitere Ternäre.
      */}
      {(sprache !== "de" || startniveau.lernweg !== "de") && (
        <p className="m-0 text-sm text-ink">
          <Tipp text={t.lernwegHinweis} ausrichtung="links">
            {(hinweisId) => (
              // ★ `tabIndex={0}`: ohne Maus muss dieselbe Auskunft über den
              // Tab-Weg erreichbar sein (R4) - eine reine Auskunft ohne
              // Bedienelement stünde sonst nur dem Mauszeiger offen.
              <span tabIndex={0} aria-describedby={hinweisId}>
                {t.lernwegLabel(startniveau.lernweg)}
              </span>
            )}
          </Tipp>
        </p>
      )}

      {/*
        ★ F8 (E6): Das Klassenmatch je Klasse abschalten. Es hat KEINE
        Statistik - der Satz sagt das ausdrücklich, damit niemand sie sucht.
        Der Wert am Server heisst „aus": Ein neues Bool-Feld ist immer `false`,
        und die Vorgabe soll „erlaubt" sein.

        ★ E12: der Satz hing bis dahin als eigener Absatz unter dem Kästchen -
        jetzt an ihm selbst (`Tipp`). Kästchen und Beschriftung stehen dafür
        als GESCHWISTER (`htmlFor`/`id`), nicht mehr das Kästchen IM `<label>`
        verschachtelt: Ein `Tipp` dort bricht `getByLabelText`, auch wenn nur
        das Kästchen selbst umschlossen wird - jsdoms `element.labels` findet
        die verschachtelte Kontrolle dann nicht mehr (gemessen 19.09.2026).
      */}
      <div className="flex items-center gap-2 text-sm text-ink">
        {/* ★ E12, Browser-Messung (19.09.2026, 700 px): Das Kästchen steht
            GANZ LINKS in seiner Zeile - `ausrichtung="rechts"` (die Vorgabe)
            liess den Hinweis nach LINKS über den Fensterrand hinauslaufen und
            dort abgeschnitten stehen. „links" läuft nach rechts auf, in den
            freien Platz der Zeile hinein. */}
        <Tipp text={t.klassenmatchHinweis} ausrichtung="links">
          {(hinweisId) => (
            <span className="flex items-center gap-2">
              <input
                id={klassenmatchId}
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={!werte.klassenmatchAus}
                aria-describedby={hinweisId}
                onChange={(e) => onKlassenmatch(e.target.checked)}
              />
              <label htmlFor={klassenmatchId}>{t.klassenmatchErlauben}</label>
            </span>
          )}
        </Tipp>
      </div>

      {/*
        ★ Zeilenende mit Enter (23.09.2026) - gleiche Bauart wie das
        Klassenmatch-Kästchen darüber (Kästchen und Beschriftung als
        Geschwister, Hinweis per `Tipp`). Anders als dort ist das Feld hier
        POSITIV benannt und angehakt bedeutet an: kein „Aus"-Dreh nötig.
      */}
      <div className="flex items-center gap-2 text-sm text-ink">
        <Tipp text={t.zeilenEndeEnterHinweis} ausrichtung="links">
          {(hinweisId) => (
            <span className="flex items-center gap-2">
              <input
                id={zeilenEndeId}
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={werte.zeilenEndeEnter}
                aria-describedby={hinweisId}
                onChange={(e) => onZeilenEnde(e.target.checked)}
              />
              <label htmlFor={zeilenEndeId}>{t.zeilenEndeEnter}</label>
            </span>
          )}
        </Tipp>
      </div>
      {/* ★ Gezielt üben (13.11.2026, Bauplan §5): eine Zeile für alle Kinder der Klasse. */}
      {onGezielt && <GezieltKlassenZeile wert={werte.gezielt ?? null} onSpeichern={onGezielt} />}
    </div>
  );
}
