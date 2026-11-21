/**
 * Der aufklappbare EINSTELLUNGS-Bereich von „Tastenflow".
 *
 * Vorher standen Texte, Sprache, Ton und Vorlesen als lange Schalterzeile immer
 * offen über dem Tippfeld — mit jeder neuen Einstellung wurde sie unübersichtlicher
 * (Wunsch Johannes 28.07.2026: „ein kleines Zahnrad zum Ein- und Ausklappen, der
 * Abschnitt selbst darf dann größer und strukturierter sein").
 *
 * Jetzt: klar benannte Gruppen unter eigenen Überschriften —
 *   1. Was übst du? (Mein Training / Geschichten / Wortspiele — seit 22.08.2026, ohne „Lektionen" seit E7, 19.09.2026)
 *   2. Texte     (für welches Alter, welche Sprache)
 *   3. Tastatur  (welche Tastatur liegt vor + Startpunkt ohne Anmeldung)
 *   4. Tempo     („Zeit lassen" — zählt Geschwindigkeit überhaupt mit?)
 *   5. Spiel     (Belohnungs-Spiel — nur in der Jugend-Tonlage, siehe unten)
 *   6. Ton       (Töne, Tipp-Klick)
 *   7. Vorlesen  (Selbst-Vorlesen samt Umfang, Tempo, Stimme)
 *
 * Aufgeklappt wird über das Zahnrad in der KOPFZEILE (Alt + O); der Zustand
 * wird im Browser gemerkt. Bis zum 22.08.2026 saß das Zahnrad in einer eigenen
 * grauen Leiste über der Übungskarte (A11yBar) — sie ist mit der Charge
 * „SCHLANK" ersatzlos entfallen, damit so wenig wie möglich vom Üben ablenkt.
 * Die Übungsart, die dort links stand, ist als erste Gruppe hierher gewandert.
 * Siehe [[project_zehnfinger_trainer]].
 */
import { htmlLang } from "./htmlLang";
import { GezieltZeile } from "./GezieltZeile";
import type { Gezielt } from "@/lib/typing/gezielt";
import { tastaturDesLandes } from "@/lib/typing/landesTastatur";
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { useId, useState } from "react";
import {
  BELOHNUNGSSPIELE,
  BELOHNUNGSSPIEL_LABELS_JE_SPRACHE,
  BelohnungsSpiel,
  uebungsSprachenImWeg,
  hauptspracheDesWeges,
  Lang,
  STUFEN,
  Stufe,
  TRAINER_MODES,
  ansage,
  ansageBelohnungsspiel,
  ansageGewaehlt,
  ansageSchalter,
  ansageStart,
  ansageTastatur,
  bedienCopy,
  trainerModeAnsage,
  TRAINER_MODE_LABELS,
  TrainerMode,
  geburtsjahrAusText,
  isKeyTickOn,
  isSoundMuted,
  langLabel,
  primeSpeech,
  setBelohnungsSpiel,
  setKeyTickOn,
  setLayout,
  setSoundMuted,
  skinForStufe,
  stufeLabel,
  useGrosseTastatur,
  useTypingA11y,
  TIPP_ZOOM_STUFEN,
  speak,
  useAvailableVoices,
  useVoice,
  ZEICHENABSTAND_FAKTOREN,
  ZEICHENABSTAND_LABELS_JE_SPRACHE,
  type ZeichenabstandFaktor,
  aktuelleWocheKey,
  naechsteWocheKey,
  wochenStartFuerSchluessel,
  zielFuerWoche,
  type ZielAbschnitt,
} from "@/lib/typing";
import { useContrast } from "@/lib/contrast";
import {
  KLAENGE,
  MELODIEN,
  klangName,
  melodieName,
  melodieProbe,
  melodieUmschalten,
  melodieZufallName,
  useMelodie,
  type KlangWahl,
} from "@/lib/typing/melodie";
import { mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { wahlTexte } from "@/lib/typing/wahltaste";
// ★ O-TR (02.10.2026): klein schreiben mit dem Gebietsschema (i/İ, ı/I), nie `toLowerCase()`.
import { kleinFuer } from "@/lib/typing/sprachRegister";
import { farbenGesperrt } from "./KeyboardPanel";
import { stimmenZurAuswahl } from "@/lib/typing/stimmenAuswahl";
import { useBedienStimme } from "./useBedienStimme";
import { SCHRIFT_T, SchriftWahl } from "./SchriftWahl";
import { useBelohnungsSpiel } from "./useBelohnungsSpiel";
import { tastaturenFuerWeg, tastaturPasstZumWeg } from "@/lib/typing/wegTastaturen";
import { useKeyboardLayout } from "./useKeyboardLayout";
import { Hinweisflaeche } from "./Zeigerhinweis";
import { Tipp } from "@/components/Tipp";
import type { Lernweg } from "@/lib/typing/lernweg";
// ★ O-IT (02.10.2026): Tastatur-Namen über `layoutTexteIn` - italienisch beschriftet (layouts.ts bleibt unberührt).
import { layoutTexteIn } from "@/lib/typing/tastaturTexteIt";
// ★ O-IT (02.10.2026): die Startpunkte über `startPunkte` - italienisch beschriftet (letters.ts bleibt unberührt).
import { startPunkte } from "@/lib/typing/startpunkteIt";
import { franzoesischLehrgangProbeAn, italienischLehrgangProbeAn, polnischLehrgangProbeAn, spanischLehrgangProbeAn, tschechischLehrgangProbeAn, tuerkischLehrgangProbeAn } from "@/lib/typing/lernweg";
import { geruestLehrgangProben } from "@/lib/typing/lehrgangSchalter";

/** ★ ES-O (27.09.2026): das Gebiet fürs kurze Datum des nächsten Montags (Deutsch schreibt es selbst). */
const MONTAG_GEBIET: Record<Exclude<BedienSprache, "de">, string> = {
  en: "en-GB",
  fr: "fr-FR",
  es: "es-ES",
  // G2a: echte Gebietsschemata (wie `GEBIET`), kein Rückfall.
  it: "it-IT",
  pl: "pl-PL",
  tr: "tr-TR",
  cs: "cs-CZ",
  // ★ G2-NEUN (25.10.2026): echte Gebiete, kein Rückfall.
  bg: "bg-BG",
  el: "el-GR",
  hu: "hu-HU",
  nl: "nl-NL",
  pt: "pt-PT",
  br: "pt-BR",
  ro: "ro-RO",
  sv: "sv-SE",
  uk: "uk-UA",
};

/**
 * ★★ DIE TEXTE DES ZAHNRADS - beide Sprachen nebeneinander (EN2, 19.09.2026).
 *
 * Die deutsche Spalte ist WORTGLEICH mit dem, was vorher im JSX stand -
 * in deutscher Bedienung ändert sich kein Zeichen. Englisch: britisch, Glossar
 * `GLOSSAR-ENGLISCH.md` (§3.4 Einstellungen, §3.10 Vorlesen). Ein Kind liest
 * diese Gruppen: kurz, freundlich, „you".
 *
 * ⚠️ Sätze, die JSX mit `<strong>` teilt, stehen als TEILE da (der fette Name
 * kommt aus eigenem Schlüssel) - die Wortstellung legt trotzdem jede Sprache
 * selbst fest, und die Textknoten der deutschen Fassung bleiben dieselben.
 */
export const T = texte({
  de: {
    uebungsartTitel: "Was übst du?",
    uebungsart: "Übungsart",
    modusAdaptiv: TRAINER_MODE_LABELS.adaptiv,
    modusBuecherei: TRAINER_MODE_LABELS.buecherei,
    modusWortspiele: TRAINER_MODE_LABELS.wortspiele,
    satzAdaptiv: " übt genau die Tasten, die noch wackeln.",
    satzBuecherei: " sind ganze Texte, Etappe für Etappe.",
    satzWortspiele: (k: string) => [" ist ein Regal - nimm dir heraus, was du magst. Reihum auch mit ", k, "."],
    texteTitel: "Texte",
    klassenStufeRest: " - deine Lehrkraft hat sie für die ganze Klasse eingestellt.",
    textstufeHinweis: (fortschritt: string) =>
      `Für welches Alter die Wörter und Texte passen. Gilt ab der nächsten Runde - ${fortschritt} und Lernstand bleiben.`,
    textstufeName: "Textstufe (Alter)",
    geburtsjahr: "Geburtsjahr",
    geburtsjahrHinweis:
      "Nur die Jahreszahl. Ist sie angegeben und keine Stufe von Hand gewählt, wächst die Textstufe von selbst mit. Eine selbst gewählte Stufe gilt weiter.",
    geburtsjahrBeispiel: "z. B. 2016",
    sprache: "Sprache",
    spracheGesperrt: "Die Lehrkraft hat die Sprache für dich festgelegt.",
    spracheHinweis: "Sprache der Übungswörter und -texte. Gilt ab der nächsten Runde.",
    // ★ D1 Nr. 18 (28.09.2026): auf Weg „fr"/„es" die Hauptsprache und Englisch.
    spracheHaupt: (name: string) =>
      `Die Sprache dieses Lehrgangs: ${name}. Englisch kannst du zusätzlich üben - die Tasten kommen trotzdem in der Reihenfolge dieses Lehrgangs.`,
    spracheName: "Sprache der Texte",
    tastaturTitel: "Tastatur",
    meineTastatur: "Meine Tastatur",
    tastaturHinweis:
      "Danach richten sich die Bildschirm-Tastatur, die Finger-Ansagen und welche Zeichen geübt werden.",
    // ★ D1 Nr. 7 (28.09.2026): Weg fr/es lehrt die Tastatur seines Landes.
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Dieser Lehrgang lehrt die Tastatur seines Landes - darum stehen nur ${tastaturDesLandes("de", weg)} Tastaturen zur Wahl. Die eingestellte Tastatur „${name}" passt nicht dazu.`,
    tastaturName: "Tastatur-Layout",
    anfangen: "Womit anfangen?",
    anfangenHinweis:
      "Wer schon tippen kann, muss nicht bei F und J beginnen - und wer zu hoch eingestiegen ist, stellt einfach wieder zurück. Gilt sofort für „Mein Training“; Statistik und Abzeichen bleiben.",
    anfangenName: "Startpunkt im Lernstoff",
    tempoTitel: "Tempo",
    zeitLassen: (an: boolean) => (an ? "Zeit lassen: an" : "Zeit lassen: aus"),
    zeitLassenTitel:
      "Kein Zeitfenster im Spiel, kein Tempo-Ziel bei den Sternen. Nur die Sorgfalt zählt.",
    zeitLassenSelbst:
      "Mit „Zeit lassen“ zählt nirgends mehr die Geschwindigkeit: Das Spiel läuft ohne Uhr, die Sterne kommen allein von der Sorgfalt, und die Übezeit zählt auch bei langen Pausen weiter.",
    zeitLassenVonLehrkraftAn:
      "Deine Lehrkraft hat „Zeit lassen“ für dich eingeschaltet: Nirgends zählt die Geschwindigkeit - nur, wie sorgfältig du tippst.",
    zeitLassenVonLehrkraftAus:
      "„Zeit lassen“ stellt deine Lehrkraft ein. Dann zählt nirgends mehr die Geschwindigkeit, sondern nur die Sorgfalt.",
    abstandTitel: "Zeichenabstand (CVI)",
    abstandName: "Zeichenabstand groß (CVI)",
    // ★ 19.09.2026 (Johannes: „die CVI-Einstellungen kann sich jedes Kind immer
    //   auch selbst in den Einstellungen einstellen, aber auch die Lehrkraft"):
    //   der letzte Satz sagt, dass das Kind ihn selbst umstellt - und dass in
    //   einer Klasse auch die Lehrkraft es kann. Der Satz vom Gleiten bleibt.
    abstandHinweis:
      "Größerer Abstand zwischen JEDEM Zeichen beim Abschreiben - für Kinder mit zerebraler Sehbehinderung (CVI), bei denen eng stehende Zeichen ineinanderlaufen. Beim Schreiben wird alles außer dem Feld abgedunkelt, in dem gerade geschrieben wird (Übungszeile oder Spielfeld); nach 5 Sekunden ohne Tippen wird es wieder hell. Die Übungszeile gleitet dabei im eigenen Schreibtakt zum nächsten Zeichen, statt zu springen. Bricht eine mehrzeilige Frage in den Rätsel-Übungen um, bleibt zusätzlich nur eine Zeile hell (die „Lesezeile“) - mit Pfeil ab und Pfeil auf wechselt man zwischen den Zeilen. „Einfach“ lässt die Zeichen in ihrem gewohnten Abstand stehen und schaltet nur die Verdunkelung, das Gleiten der Zeile und die Lesezeile ein. Du kannst ihn hier jederzeit selbst umstellen, so oft du willst. Gehörst du zu einer Klasse, kann ihn auch deine Lehrkraft einstellen - es gilt, was zuletzt gewählt wurde.",
    // ★ „Einhand schreiben" (19.09.2026, Johannes: „Selbstlernende sollen sich
    //   alles einstellen können" - „auch Leute ohne Anmeldung").
    einhand: (an: boolean) => `Einhand schreiben: ${an ? "an" : "aus"}`,
    einhandHinweis:
      "Für alle, die mit einer Hand tippen: Großbuchstaben und Sonderzeichen gelten dann mit jeder Umschalttaste - nicht nur mit der der anderen Hand.",
    // ★ „Mein Wochenziel" (19.09.2026) - nur für ein Konto ohne Lehrkraft.
    wochenzielTitel: "Mein Wochenziel",
    wochenzielName: "Minuten pro Woche",
    wochenzielHinweis:
      "So viele Minuten willst du pro Woche üben. Die Woche beginnt am Montag um 8 Uhr. Ein neues Ziel gilt ab dem nächsten Montag - die laufende Woche behält ihr Ziel. Deinen Stand zeigt der Ring unter dem Übungsfeld.",
    keinWochenziel: "kein Wochenziel",
    wochenzielMinuten: (n: number) => `${n} Minuten`,
    wochenzielAnstehend: (datum: string, minuten: number) =>
      minuten > 0
        ? `Ab Montag, ${datum}, 8:00 Uhr: ${minuten} Minuten pro Woche - diese Woche bleibt es beim bisherigen Ziel.`
        : `Ab Montag, ${datum}, 8:00 Uhr: kein Wochenziel mehr - diese Woche bleibt es beim bisherigen Ziel.`,
    nachholen: (an: boolean) =>
      `Verpasste Minuten der vergangenen Wochen nachholen: ${an ? "an" : "aus"}`,
    nachholenHinweis:
      "Übst du mehr als dein Wochenziel, füllen die zusätzlichen Minuten offene Wochenziele früherer Wochen auf - die älteste zuerst.",
    anzeigeTitel: "Anzeige",
    fingerFarben: (an: boolean) => `Finger-Farben: ${an ? "an" : "aus"}`,
    fingerFarbenTitel: "Tasten in der Farbe des Fingers, der sie drückt.",
    leerzeichen: (an: boolean) => `Leerzeichen anzeigen: ${an ? "an" : "aus"}`,
    leerzeichenTitel: "Leerzeichen in der Übungszeile als ␣ zeigen. Aus: eine Lücke.",
    // ★ 25.09.2026: „Große Tastatur" - siehe lib/typing/grosseTastatur.ts.
    grosseTastatur: (an: boolean) => `Große Tastatur (mit Ziffernblock): ${an ? "an" : "aus"}`,
    grosseTastaturHinweis:
      "Zeigt neben der üblichen Bildschirm-Tastatur auch den Ziffernblock - und, wenn genug Platz ist, die Einfüge-, Pos1-, Bild-, Ende- und Pfeiltasten. Schaltet sich von selbst ein, sobald eine Taste aus dem Ziffernblock gedrückt wird. Einmal hier von Hand ausgeschaltet, bleibt sie aus, bis du sie hier wieder anschaltest.",
    grosseTastaturAnsage: (an: boolean) => `Große Tastatur ${an ? "an" : "aus"}.`,
    groesse: "Größe des Übungsfeldes",
    kleiner: "Übungsfeld kleiner",
    groesser: "Übungsfeld größer",
    groesseName: (p: number) => `Übungsfeld ${p} Prozent`,
    groesseZahl: (p: number) => [p, " %"],
    groesseHinweis:
      "Geht auch beim Üben: Alt und Plus, Alt und Minus. Vergrößert nur das Übungsfeld - für die ganze Seite gibt es Strg und Plus.",
    spielTitel: "Belohnungs-Spiel",
    nachNeuerTaste: "Nach einer neuen Taste",
    spielHinweis:
      "Ob dir nach einer freigeschalteten Taste ein kurzes Spiel angeboten wird. Zur Wahl stehen: Keins - das ist die Vorgabe; oder das Eisschollen-Spiel, die Polar-Expedition mit dem Pinguin. Freiwillig; die Taste hast du ohnehin. Gilt für dieses Gerät.",
    spielName: "Belohnungs-Spiel nach einer neuen Taste",
    spielSatz1: "Vorgabe ist ",
    spielSatz2: ": Die neue Taste gehört dir ohnehin, sie wird gefeiert, und danach geht es weiter. Das ",
    spielSatz3: " ist die Polar-Expedition mit dem Pinguin - freiwillig, und es zählt nicht als Übezeit.",
    tonTitel: "Ton",
    ton: (aus: boolean) => (aus ? "Ton aus" : "Ton an"),
    // ★ K2 (19.09.2026): war ohne Hinweis, anders als „Tipp-Klick" direkt daneben.
    tonHinweis: "Schaltet alle Klänge des Programms ein oder aus - Belohnungen, Fehlertöne und den Klick beim Tippen.",
    klickName: "Tasten-Klickton",
    klick: "Tipp-Klick",
    klickTitel: "Leiser Klick bei jedem richtigen Anschlag",
    // ★ 15.10.2026: Melodie beim Tippen (`lib/typing/melodie.ts`, Alt + 6).
    melodie: "Melodie beim Tippen",
    melodieHinweis: "Übt einen gleichmäßigen Tipprhythmus und macht Spaß - wer gleichmäßig tippt, wird auch bei schwächeren Tasten flüssiger. Jede richtige Taste spielt den nächsten Ton eines Liedes. Wer gleichmäßig tippt, bekommt eine Band dazu. Mit Vorlesen kommt die Melodie nur auf dem rechten Ohr. Kürzel: Alt + 6, Klang wechseln mit Alt + 7 und Alt + 8.",
    melodieKlang: "Klang",
    melodieLied: "Lied",
    vorlesenTitel: "Vorlesen",
    vorlesen: (an: boolean) => (an ? "Vorlesen an" : "Vorlesen aus"),
    vorlesenTitelAttr:
      "Die App liest vor (für Lernende ohne Screenreader). Bei aktivem Screenreader besser aus lassen.",
    strg: "Strg",
    strgSatz: " macht sofort still - an jeder Stelle, auch mitten im Satz. Die nächste Ansage spricht wieder.",
    wasGelesen: "Was vorgelesen wird (Mehrfachauswahl)",
    liest: "liest:",
    woerter: "Wörter",
    woerterTitel: "Jedes Wort am Wortanfang vorlesen.",
    saetze: "Sätze",
    saetzeTitel: "Am Zeilenanfang die ganze Zeile als Satz vorlesen.",
    buchstabieren: "Buchstabieren",
    buchstabierenAnsage: (an: boolean) => `Buchstabieren ${an ? "an" : "aus"}.`,
    buchstabierenTitel:
      "Nach jedem Anschlag die nächste Taste ansagen - für alle, die nur hören. Bei „Vorlesen aus“ sagt es der Screenreader: am Zeilenanfang den ganzen Satz, am Wortanfang das Wort, dann die Tasten. Mit Braillezeile: aus, dann bleibt die Zeile beim Tippen ruhig.",
    sprechTempo: "Tempo",
    sprechTempoName: "Sprechtempo",
    langsam: "langsam",
    normal: "normal",
    schnell: "schnell",
    sehrSchnell: "sehr schnell",
    stimme: "Stimme",
    stimmeHinweis:
      "Welche auf diesem Gerät installierte Stimme vorliest - für den Übungstext genauso wie für die Rückmeldungen. Automatisch sucht selbst eine passende Stimme. Ist eine Stimme zu leise oder klingt sie bei ä/ö/ü undeutlich, hier eine andere wählen.",
    automatisch: "automatisch",
    kontoTitel: "Mein Konto",
    zugangsdaten: "Meine Zugangsdaten",
    kontoBestaetigt:
      "E-Mail-Adresse oder Passwort ändern - und das Konto löschen, wenn du es nicht mehr brauchst.",
    kontoUnbestaetigt:
      "⚠️ Deine E-Mail-Adresse ist noch nicht bestätigt - bis dahin kommt kein Wochenbericht. Hier kannst du den Link neu anfordern oder die Adresse ändern.",
    einrichtungTitel: "Einführung & Einrichtung",
    einrichtungNeu: " Einrichtung neu starten",
    einrichtungTitelAttr:
      "Führt dich Schritt für Schritt durch Alter, Sprache, Tastatur, Ton und Vorlesen (Alt + R)",
    einrichtungSatz:
      "Schritt für Schritt durch alle Einstellungen - mit dem Einführungs-Podcast am Ende. Auch mit Alt + R. Den Podcast allein gibt es über „Einführung\".",
  },
  fr: {
    uebungsartTitel: "Qu'est-ce que tu exerces ?",
    uebungsart: "Type d'exercice",
    modusAdaptiv: "Mon entrainement",
    modusBuecherei: "Histoires",
    modusWortspiele: "Jeux de lettres",
    satzAdaptiv: " exerce exactement les touches encore instables.",
    satzBuecherei: " sont des textes entiers, étape par étape.",
    satzWortspiele: (k: string) => [
      " est une étagère - prends ce qui te plait. Tu peux aussi passer de l'un à l'autre avec ",
      k,
      ".",
    ],
    texteTitel: "Textes",
    klassenStufeRest: " - ton enseignant ou ton enseignante l'a réglé pour toute la classe.",
    textstufeHinweis: (fortschritt: string) =>
      `Pour quel âge les mots et les textes conviennent. S'applique à partir de la prochaine série - ${fortschritt.toLowerCase()} et progrès restent.`,
    textstufeName: "Niveau des textes (âge)",
    geburtsjahr: "Année de naissance",
    geburtsjahrHinweis:
      "Seulement l'année. Si elle est indiquée et qu'aucun niveau n'est choisi à la main, le niveau des textes avance de lui-même. Un niveau choisi à la main reste valable.",
    geburtsjahrBeispiel: "par ex. 2016",
    sprache: "Langue",
    spracheGesperrt: "Ton enseignant ou ton enseignante a fixé la langue pour toi.",
    spracheHinweis: "Langue des mots et textes d'exercice. S'applique à partir de la prochaine série.",
    spracheHaupt: (name: string) =>
      `La langue de ce parcours : ${name}. Tu peux aussi t'entrainer en anglais - les touches arrivent quand même dans l'ordre de ce parcours.`,
    spracheName: "Langue des textes",
    tastaturTitel: "Clavier",
    meineTastatur: "Mon clavier",
    tastaturHinweis:
      "Le clavier à l'écran, les annonces de doigts et les caractères exercés en dépendent.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Ce parcours enseigne le clavier de son pays : seuls les claviers ${tastaturDesLandes("fr", weg)} sont proposés. Le clavier réglé (${name}) ne correspond pas.`,
    tastaturName: "Disposition du clavier",
    anfangen: "Par où commencer ?",
    anfangenHinweis:
      "Qui sait déjà taper n'a pas besoin de commencer par F et J - et qui a commencé trop haut peut revenir en arrière. S'applique tout de suite à \"Mon entrainement\" ; statistiques et badges restent.",
    anfangenName: "Point de départ dans le parcours",
    tempoTitel: "Vitesse",
    zeitLassen: (an: boolean) => (an ? "Prendre son temps : activé" : "Prendre son temps : désactivé"),
    zeitLassenTitel:
      "Pas de minuterie dans le jeu, pas d'objectif de vitesse pour les étoiles. Seul le soin compte.",
    zeitLassenSelbst:
      "Avec \"Prendre son temps\", la vitesse ne compte plus nulle part : le jeu tourne sans horloge, les étoiles viennent seulement du soin apporté, et le temps d'exercice continue même en cas de longues pauses.",
    zeitLassenVonLehrkraftAn:
      "Ton enseignant ou ton enseignante a activé \"Prendre son temps\" pour toi : la vitesse ne compte nulle part - seulement le soin que tu mets à taper.",
    zeitLassenVonLehrkraftAus:
      "\"Prendre son temps\" est réglé par ton enseignant ou ton enseignante. Une fois activé, la vitesse ne compte plus nulle part, seulement le soin.",
    abstandTitel: "Espacement des caractères (CVI)",
    abstandName: "Grand espacement des caractères (CVI)",
    abstandHinweis:
      "Espacement plus grand entre CHAQUE caractère en recopiant - pour les élèves avec une déficience visuelle cérébrale (CVI), chez qui des caractères rapprochés se confondent. Pendant que tu tapes, tout est assombri sauf le champ où tu tapes (ligne d'exercice ou aire de jeu) ; après 5 secondes sans frappe, tout redevient clair. La ligne d'exercice glisse alors à ton propre rythme de frappe vers le caractère suivant, au lieu de sauter. Si une question à plusieurs lignes des exercices-énigmes passe à la ligne, seule une ligne reste claire (la \"ligne de lecture\") - flèche bas et flèche haut permettent de changer de ligne. \"Simple\" laisse les caractères à leur espacement habituel et n'active que l'assombrissement, le glissement de la ligne et la ligne de lecture. Tu peux le changer ici toi-même à tout moment, aussi souvent que tu veux. Si tu appartiens à une classe, ton enseignant ou ton enseignante peut aussi le régler - c'est le dernier choix qui compte.",
    einhand: (an: boolean) => `Écrire d'une seule main : ${an ? "activé" : "désactivé"}`,
    einhandHinweis:
      "Pour qui tape d'une seule main : les majuscules et les caractères spéciaux fonctionnent alors avec n'importe quelle touche Majuscule - pas seulement celle de l'autre main.",
    wochenzielTitel: "Mon objectif de la semaine",
    wochenzielName: "Minutes par semaine",
    wochenzielHinweis:
      "Le nombre de minutes que tu veux t'exercer par semaine. La semaine commence le lundi à 8 h. Un nouvel objectif s'applique à partir du lundi suivant - la semaine en cours garde son objectif actuel. L'anneau sous le champ d'exercice montre où tu en es.",
    keinWochenziel: "pas d'objectif de la semaine",
    wochenzielMinuten: (n: number) => `${n} minutes`,
    wochenzielAnstehend: (datum: string, minuten: number) =>
      minuten > 0
        ? `À partir du lundi ${datum}, 8 h : ${minuten} minutes par semaine - cette semaine garde l'objectif actuel.`
        : `À partir du lundi ${datum}, 8 h : plus d'objectif de la semaine - cette semaine garde l'objectif actuel.`,
    nachholen: (an: boolean) =>
      `Rattraper les minutes manquées des semaines précédentes : ${an ? "activé" : "désactivé"}`,
    nachholenHinweis:
      "Si tu t'exerces plus que ton objectif de la semaine, les minutes en plus comblent les objectifs non atteints des semaines précédentes - la plus ancienne en premier.",
    anzeigeTitel: "Affichage",
    fingerFarben: (an: boolean) => `Couleurs des doigts : ${an ? "activé" : "désactivé"}`,
    fingerFarbenTitel: "Les touches prennent la couleur du doigt qui doit les taper.",
    leerzeichen: (an: boolean) => `Afficher les espaces: ${an ? "activé" : "désactivé"}`,
    leerzeichenTitel: "Montrer les espaces de la ligne comme ␣. Désactivé : un blanc.",
    grosseTastatur: (an: boolean) => `Grand clavier (avec pavé numérique) : ${an ? "activé" : "désactivé"}`,
    grosseTastaturHinweis:
      "Affiche, en plus du clavier à l'écran habituel, le pavé numérique - et, si la place suffit, les touches Inser, Origine, Page, Fin et flèches. S'active tout seul dès qu'une touche du pavé numérique est pressée. Une fois désactivé ici à la main, il le reste jusqu'à ce que tu le réactives ici.",
    grosseTastaturAnsage: (an: boolean) => `Grand clavier ${an ? "activé" : "désactivé"}.`,
    groesse: "Taille du champ d'exercice",
    kleiner: "Champ d'exercice plus petit",
    groesser: "Champ d'exercice plus grand",
    groesseName: (p: number) => `Champ d'exercice ${p} pour cent`,
    groesseZahl: (p: number) => [p, " %"],
    groesseHinweis:
      "Fonctionne aussi en s'exerçant : Alt et Plus, Alt et Moins. Agrandit seulement le champ d'exercice - pour toute la page, il y a Ctrl et Plus.",
    spielTitel: "Jeu de récompense",
    nachNeuerTaste: "Après une nouvelle touche",
    spielHinweis:
      "Choisis si un court jeu t'est proposé quand tu débloques une touche. Au choix : Aucun - c'est le réglage par défaut ; ou le jeu de la banquise, l'Expédition polaire avec le manchot. Facultatif ; la touche est à toi de toute façon. S'applique à cet appareil.",
    spielName: "Jeu de récompense après une nouvelle touche",
    spielSatz1: "Par défaut : ",
    spielSatz2: " : la nouvelle touche est à toi de toute façon, elle est fêtée, puis ça continue. ",
    spielSatz3: " est l'Expédition polaire avec le manchot - facultatif, et ça ne compte pas comme temps d'exercice.",
    tonTitel: "Son",
    ton: (aus: boolean) => (aus ? "Son désactivé" : "Son activé"),
    tonHinweis: "Active ou désactive tous les sons du programme - récompenses, sons d'erreur et le clic en tapant.",
    klickName: "Clic des touches",
    klick: "Clic de frappe",
    klickTitel: "Clic discret à chaque frappe correcte",
    melodie: "Mélodie en tapant",
    melodieHinweis: "Pour t'entrainer à un rythme de frappe régulier, et pour le plaisir - qui tape régulièrement devient plus fluide aussi sur les touches plus faibles. Chaque bonne touche joue la note suivante d'une chanson. Si tu tapes de façon régulière, un groupe joue avec toi. Avec la lecture à voix haute, la mélodie est seulement dans l'oreille droite. Raccourci : Alt + 6, changer de son avec Alt + 7 et Alt + 8.",
    melodieKlang: "Son",
    melodieLied: "Chanson",
    vorlesenTitel: "Lecture à voix haute",
    vorlesen: (an: boolean) => (an ? "Lecture à voix haute activée" : "Lecture à voix haute désactivée"),
    vorlesenTitelAttr:
      "L'application lit à voix haute (pour les élèves sans lecteur d'écran). Avec un lecteur d'écran actif, mieux vaut le laisser désactivé.",
    strg: "Ctrl",
    strgSatz: " fait taire immédiatement - à tout moment, même en pleine phrase. L'annonce suivante est lue normalement.",
    wasGelesen: "Ce qui est lu (choix multiple)",
    liest: "lit :",
    woerter: "Mots",
    woerterTitel: "Lire chaque mot à voix haute au début du mot.",
    saetze: "Phrases",
    saetzeTitel: "Lire toute la ligne comme une phrase au début de la ligne.",
    buchstabieren: "Épeler",
    buchstabierenAnsage: (an: boolean) => `Épeler ${an ? "activé" : "désactivé"}.`,
    buchstabierenTitel:
      "Annoncer la touche suivante après chaque frappe - pour qui n'écoute que le son. Avec \"Lire à voix haute\" désactivé, c'est le lecteur d'écran qui le fait : la phrase entière au début de la ligne, le mot au début du mot, puis les touches. Avec une plage braille : laisse-le désactivé, la ligne reste alors immobile pendant la frappe.",
    sprechTempo: "Vitesse",
    sprechTempoName: "Vitesse de la voix",
    langsam: "lente",
    normal: "normale",
    schnell: "rapide",
    sehrSchnell: "très rapide",
    stimme: "Voix",
    stimmeHinweis:
      "Quelle voix installée sur cet appareil fait la lecture - pour le texte d'exercice comme pour les retours. La recherche automatique trouve elle-même une voix adaptée. Si une voix est trop faible ou peu claire sur é/è/ê, choisis-en une autre ici.",
    automatisch: "automatique",
    kontoTitel: "Mon compte",
    zugangsdaten: "Mes identifiants",
    kontoBestaetigt:
      "Changer l'adresse e-mail ou le mot de passe - et supprimer le compte si tu n'en as plus besoin.",
    kontoUnbestaetigt:
      "⚠️ Ton adresse e-mail n'est pas encore confirmée - aucun bilan hebdomadaire ne sera envoyé avant. Tu peux redemander le lien ici ou changer l'adresse.",
    einrichtungTitel: "Introduction et configuration",
    einrichtungNeu: " Recommencer la configuration",
    einrichtungTitelAttr:
      "Te guide pas à pas à travers l'âge, la langue, le clavier, le son et la lecture à voix haute (Alt + R)",
    einrichtungSatz:
      "Pas à pas à travers tous les réglages - avec le podcast d'introduction à la fin. Aussi avec Alt + R. Le podcast seul est disponible sous \"Introduction\".",
  },
  // ★ ES-O (27.09.2026): tú (Kinder und Selbstlernende, Bauplan S9); die
  // Namen der Übungsarten wie in den Ansagen (`vorlesen.ts`, ES-F8).
  es: {
    uebungsartTitel: "¿Qué practicas?",
    uebungsart: "Tipo de ejercicio",
    modusAdaptiv: "Mi entrenamiento",
    modusBuecherei: "Cuentos",
    modusWortspiele: "Juegos de palabras",
    satzAdaptiv: " practica justo las teclas que todavía no te salen seguras.",
    satzBuecherei: " son textos enteros, paso a paso.",
    satzWortspiele: (k: string) => [
      " es una estantería - toma lo que te guste. También puedes cambiar de uno a otro con ",
      k,
      ".",
    ],
    texteTitel: "Textos",
    klassenStufeRest: " - lo ha elegido tu docente para toda la clase.",
    textstufeHinweis: (fortschritt: string) =>
      `Para qué edad son adecuadas las palabras y los textos. Vale a partir de la próxima serie - ${fortschritt.toLowerCase()} y el progreso se mantienen.`,
    textstufeName: "Nivel de los textos (edad)",
    geburtsjahr: "Año de nacimiento",
    geburtsjahrHinweis:
      "Solo el año. Si lo indicas y no eliges un nivel a mano, el nivel de los textos crece contigo. Un nivel elegido a mano se mantiene.",
    geburtsjahrBeispiel: "p. ej. 2016",
    sprache: "Idioma",
    spracheGesperrt: "Tu docente ha fijado el idioma para ti.",
    spracheHinweis: "Idioma de las palabras y los textos de práctica. Vale a partir de la próxima serie.",
    spracheHaupt: (name: string) =>
      `El idioma de este recorrido: ${name}. También puedes practicar en inglés - las teclas llegan igualmente en el orden de este recorrido.`,
    spracheName: "Idioma de los textos",
    tastaturTitel: "Teclado",
    meineTastatur: "Mi teclado",
    tastaturHinweis:
      "De él dependen el teclado en pantalla, los avisos de los dedos y los caracteres que practicas.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Este recorrido enseña el teclado de su país: por eso solo se ofrecen teclados ${tastaturDesLandes("es", weg)}. El teclado elegido, "${name}", no corresponde.`,
    tastaturName: "Distribución del teclado",
    anfangen: "¿Por dónde empiezo?",
    anfangenHinweis:
      "Quien ya sabe escribir no tiene que empezar por F y J - y quien empezó demasiado arriba puede volver atrás. Vale enseguida para \"Mi entrenamiento\"; las estadísticas y las insignias se mantienen.",
    anfangenName: "Punto de partida en el recorrido",
    tempoTitel: "Ritmo",
    zeitLassen: (an: boolean) => (an ? "Tomarse tiempo: activado" : "Tomarse tiempo: desactivado"),
    zeitLassenTitel:
      "Sin reloj en el juego y sin meta de velocidad para las estrellas. Solo cuenta el cuidado.",
    zeitLassenSelbst:
      "Con \"Tomarse tiempo\" la velocidad no cuenta en ninguna parte: el juego va sin reloj, las estrellas vienen solo del cuidado, y el tiempo de práctica sigue contando aunque hagas pausas largas.",
    zeitLassenVonLehrkraftAn:
      "Tu docente ha activado \"Tomarse tiempo\" para ti: la velocidad no cuenta en ninguna parte, solo el cuidado con que escribes.",
    zeitLassenVonLehrkraftAus:
      "\"Tomarse tiempo\" lo decide tu docente. Si está activado, la velocidad no cuenta en ninguna parte, solo el cuidado.",
    abstandTitel: "Espacio entre caracteres (CVI)",
    abstandName: "Espacio grande entre caracteres (CVI)",
    abstandHinweis:
      "Más espacio entre CADA carácter al copiar - para estudiantes con discapacidad visual cerebral (CVI), a quienes los caracteres muy juntos se les mezclan. Mientras escribes, todo se oscurece salvo el campo donde escribes (línea de práctica o zona de juego); tras 5 segundos sin pulsar ninguna tecla, todo vuelve a verse claro. La línea de práctica se desliza entonces a tu propio ritmo hasta el siguiente carácter, en lugar de saltar. Si una pregunta de varias líneas de los ejercicios de adivinanzas ocupa más de una línea, solo queda clara una línea (la \"línea de lectura\") - con flecha abajo y flecha arriba cambias de línea. \"Sencillo\" deja los caracteres a su distancia normal y solo activa el oscurecimiento, el deslizamiento de la línea y la línea de lectura. Puedes cambiarlo aquí cuando quieras y tantas veces como quieras. Si perteneces a una clase, también tu docente puede ajustarlo - vale la última elección.",
    einhand: (an: boolean) => `Escribir con una mano: ${an ? "activado" : "desactivado"}`,
    einhandHinweis:
      "Para quien escribe con una sola mano: las mayúsculas y los caracteres especiales funcionan entonces con cualquier tecla Mayús, no solo con la de la otra mano.",
    wochenzielTitel: "Mi objetivo semanal",
    wochenzielName: "Minutos por semana",
    wochenzielHinweis:
      "Cuántos minutos quieres practicar cada semana. La semana empieza el lunes a las 8. Un objetivo nuevo vale a partir del lunes siguiente - la semana en curso conserva su objetivo. El anillo debajo del campo de práctica muestra cómo vas.",
    keinWochenziel: "sin objetivo semanal",
    wochenzielMinuten: (n: number) => `${n} minutos`,
    wochenzielAnstehend: (datum: string, minuten: number) =>
      minuten > 0
        ? `A partir del lunes ${datum}, a las 8: ${minuten} minutos por semana - esta semana conserva el objetivo actual.`
        : `A partir del lunes ${datum}, a las 8: sin objetivo semanal - esta semana conserva el objetivo actual.`,
    nachholen: (an: boolean) =>
      `Recuperar los minutos que faltaron en semanas anteriores: ${an ? "activado" : "desactivado"}`,
    nachholenHinweis:
      "Si practicas más que tu objetivo semanal, los minutos de más completan los objetivos no alcanzados de semanas anteriores - primero el más antiguo.",
    anzeigeTitel: "Pantalla",
    fingerFarben: (an: boolean) => `Colores de los dedos: ${an ? "activado" : "desactivado"}`,
    fingerFarbenTitel: "Las teclas toman el color del dedo que debe pulsarlas.",
    leerzeichen: (an: boolean) => `Mostrar espacios: ${an ? "activado" : "desactivado"}`,
    leerzeichenTitel: "Mostrar los espacios de la línea como ␣. Desactivado: un hueco.",
    grosseTastatur: (an: boolean) => `Teclado grande (con teclado numérico): ${an ? "activado" : "desactivado"}`,
    grosseTastaturHinweis:
      "Muestra, además del teclado en pantalla de siempre, el teclado numérico - y, si hay sitio, las teclas Insert, Inicio, Re Pág, Av Pág, Fin y las flechas. Se activa solo en cuanto se pulsa una tecla del teclado numérico. Si lo desactivas aquí a mano, sigue desactivado hasta que lo vuelvas a activar aquí.",
    grosseTastaturAnsage: (an: boolean) => `Teclado grande ${an ? "activado" : "desactivado"}.`,
    groesse: "Tamaño del campo de práctica",
    kleiner: "Campo de práctica más pequeño",
    groesser: "Campo de práctica más grande",
    groesseName: (p: number) => `Campo de práctica al ${p} por ciento`,
    groesseZahl: (p: number) => [p, " %"],
    groesseHinweis:
      "También funciona mientras practicas: Alt y Más, Alt y Menos. Solo agranda el campo de práctica - para toda la página está Ctrl y Más.",
    spielTitel: "Juego de recompensa",
    nachNeuerTaste: "Después de una tecla nueva",
    spielHinweis:
      "Elige si se te ofrece un juego corto cuando desbloqueas una tecla. A elegir: Ninguno - es lo predeterminado; o el Juego de la Banquisa, la Expedición polar con el pingüino. Es opcional; la tecla es tuya de todas formas. Vale para este dispositivo.",
    spielName: "Juego de recompensa después de una tecla nueva",
    spielSatz1: "Lo predeterminado es ",
    spielSatz2: ": la tecla nueva es tuya de todas formas, se celebra y después se sigue. ",
    spielSatz3: " es la Expedición polar con el pingüino - opcional, y no cuenta como tiempo de práctica.",
    tonTitel: "Sonido",
    ton: (aus: boolean) => (aus ? "Sonido desactivado" : "Sonido activado"),
    tonHinweis: "Activa o desactiva todos los sonidos del programa - recompensas, sonidos de error y el clic al escribir.",
    klickName: "Clic de las teclas",
    klick: "Clic de tecla",
    klickTitel: "Un clic suave con cada pulsación correcta",
    melodie: "Melodía al escribir",
    melodieHinweis: "Para practicar un ritmo de escritura regular y divertirte: quien escribe con regularidad también es más fluido en las teclas más flojas. Cada tecla correcta toca la nota siguiente de una canción. Si escribes con ritmo regular, una banda toca contigo. Con la lectura en voz alta, la melodía suena solo en el oído derecho. Atajo: Alt + 6, cambiar el sonido con Alt + 7 y Alt + 8.",
    melodieKlang: "Sonido",
    melodieLied: "Canción",
    vorlesenTitel: "Lectura en voz alta",
    vorlesen: (an: boolean) => (an ? "Lectura en voz alta activada" : "Lectura en voz alta desactivada"),
    vorlesenTitelAttr:
      "La aplicación lee en voz alta (para estudiantes sin lector de pantalla). Con un lector de pantalla activo, es mejor dejarla desactivada.",
    strg: "Ctrl",
    strgSatz: " hace callar al instante - en cualquier momento, también a mitad de frase. El siguiente aviso se lee con normalidad.",
    wasGelesen: "Qué se lee (se puede elegir más de una cosa)",
    liest: "lee:",
    woerter: "Palabras",
    woerterTitel: "Leer cada palabra en voz alta al empezar la palabra.",
    saetze: "Frases",
    saetzeTitel: "Leer toda la línea como una frase al empezar la línea.",
    buchstabieren: "Deletrear",
    buchstabierenAnsage: (an: boolean) => `Deletrear ${an ? "activado" : "desactivado"}.`,
    buchstabierenTitel:
      "Anunciar la tecla siguiente después de cada pulsación - para quien solo escucha. Con \"Leer en voz alta\" desactivado, lo hace el lector de pantalla: la frase entera al empezar la línea, la palabra al empezar la palabra y luego las teclas. Con una línea braille: déjalo desactivado, así la línea se queda quieta mientras escribes.",
    sprechTempo: "Velocidad",
    sprechTempoName: "Velocidad de la voz",
    langsam: "lenta",
    normal: "normal",
    schnell: "rápida",
    sehrSchnell: "muy rápida",
    stimme: "Voz",
    stimmeHinweis:
      "Qué voz instalada en este dispositivo lee en voz alta - tanto el texto de práctica como los comentarios. La búsqueda automática encuentra sola una voz adecuada. Si una voz suena muy baja o poco clara con á, é o ñ, elige otra aquí.",
    automatisch: "automática",
    kontoTitel: "Mi cuenta",
    zugangsdaten: "Mis datos de acceso",
    kontoBestaetigt:
      "Cambiar el correo electrónico o la contraseña - y eliminar la cuenta si ya no la necesitas.",
    kontoUnbestaetigt:
      "⚠️ Tu correo electrónico todavía no está confirmado - hasta entonces no se envía ningún resumen semanal. Aquí puedes pedir el enlace otra vez o cambiar la dirección.",
    einrichtungTitel: "Introducción y configuración inicial",
    einrichtungNeu: " Volver a hacer la configuración inicial",
    einrichtungTitelAttr:
      "Te guía paso a paso por la edad, el idioma, el teclado, el sonido y la lectura en voz alta (Alt + R)",
    einrichtungSatz:
      "Paso a paso por todos los ajustes - con el podcast de introducción al final. También con Alt + R. El podcast solo está en \"Introducción\".",
  },
  // ★ O-IT (02.10.2026): das Zahnrad liest das Kind - „tu"; „l'insegnante" (Regel 2);
  // „Con calma", „Tasto per tasto" (Glossar §5 Nr. 11); „Suono: sì/no" (§2.8);
  // „Ctrl: silenzio immediato" (§2.8); „lettore di schermo", „display braille".
  it: {
    uebungsartTitel: "Che cosa eserciti?",
    uebungsart: "Tipo di esercizio",
    modusAdaptiv: "Il mio allenamento",
    modusBuecherei: "Storie",
    modusWortspiele: "Giochi di parole",
    satzAdaptiv: " esercita proprio i tasti che non ti vengono ancora sicuri.",
    satzBuecherei: " sono testi interi, passo per passo.",
    satzWortspiele: (k: string) => [
      " è uno scaffale - prendi quello che ti piace. Puoi anche passare dall'uno all'altro con ",
      k,
      ".",
    ],
    texteTitel: "Testi",
    klassenStufeRest: " - l'ha scelto l'insegnante per tutta la classe.",
    textstufeHinweis: (fortschritt: string) =>
      `Per quale età sono adatte le parole e i testi. Vale dal prossimo giro - ${fortschritt.toLowerCase()} e progressi restano.`,
    textstufeName: "Testi adatti a (età)",
    geburtsjahr: "Anno di nascita",
    geburtsjahrHinweis:
      "Solo l'anno. Se lo indichi e non scegli un livello a mano, il livello dei testi cresce con te. Un livello scelto a mano resta.",
    geburtsjahrBeispiel: "ad es. 2016",
    sprache: "Lingua",
    spracheGesperrt: "L'insegnante ha fissato la lingua per te.",
    spracheHinweis: "Lingua delle parole e dei testi di esercizio. Vale dal prossimo giro.",
    spracheHaupt: (name: string) =>
      `La lingua di questo percorso: ${name}. Puoi esercitarti anche in inglese - i tasti arrivano comunque nell'ordine di questo percorso.`,
    spracheName: "Lingua dei testi",
    tastaturTitel: "Tastiera",
    meineTastatur: "La mia tastiera",
    tastaturHinweis:
      "Da qui dipendono la tastiera sullo schermo, i suggerimenti per le dita e i caratteri che eserciti.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Questo percorso insegna la tastiera del suo paese: per questo ci sono solo tastiere ${tastaturDesLandes("it", weg)}. La tastiera scelta, "${name}", non corrisponde.`,
    tastaturName: "Disposizione dei tasti",
    anfangen: "Da dove vuoi iniziare?",
    anfangenHinweis:
      `Chi sa già scrivere non deve iniziare da F e J - e chi è partito troppo avanti può tornare indietro. Vale subito per "Il mio allenamento"; statistiche e medaglie restano.`,
    anfangenName: "Punto di partenza nel percorso",
    tempoTitel: "Ritmo",
    zeitLassen: (an: boolean) => (an ? "Con calma: sì" : "Con calma: no"),
    zeitLassenTitel:
      "Nessun cronometro nel gioco e nessun obiettivo di velocità per le stelle. Conta solo la cura.",
    zeitLassenSelbst:
      `Con "Con calma" la velocità non conta da nessuna parte: il gioco va senza cronometro, le stelle vengono solo dalla cura, e il tempo di esercizio continua a contare anche se fai pause lunghe.`,
    zeitLassenVonLehrkraftAn:
      `L'insegnante ha attivato "Con calma" per te: la velocità non conta da nessuna parte, solo la cura con cui scrivi.`,
    zeitLassenVonLehrkraftAus:
      `"Con calma" lo decide l'insegnante. Se è attivo, la velocità non conta da nessuna parte, solo la cura.`,
    abstandTitel: "Spaziatura (CVI)",
    abstandName: "Spaziatura ampia (CVI)",
    abstandHinweis:
      `Più spazio tra OGNI carattere quando ricopi - per chi ha una disabilità visiva di origine cerebrale (CVI), quando i caratteri troppo vicini si confondono. Mentre scrivi, tutto si scurisce tranne il campo in cui scrivi (riga di esercizio o zona di gioco); dopo 5 secondi senza premere nessun tasto, tutto torna chiaro. La riga di esercizio scorre poi al tuo ritmo fino al carattere successivo, invece di saltare. Se una domanda di più righe degli indovinelli occupa più di una riga, resta chiara una sola riga (la "riga di lettura") - con freccia giù e freccia su cambi riga. "Semplice" lascia i caratteri alla distanza normale e attiva solo lo scurimento, lo scorrimento della riga e la riga di lettura. Puoi cambiarlo qui quando vuoi e tutte le volte che vuoi. Se fai parte di una classe, può regolarlo anche l'insegnante - vale l'ultima scelta.`,
    einhand: (an: boolean) => `Scrivere con una mano: ${an ? "sì" : "no"}`,
    einhandHinweis:
      "Per chi scrive con una mano sola: le maiuscole e i caratteri speciali funzionano allora con qualsiasi tasto Maiusc, non solo con quello dell'altra mano.",
    wochenzielTitel: "Il mio obiettivo settimanale",
    wochenzielName: "Minuti alla settimana",
    wochenzielHinweis:
      "Quanti minuti vuoi esercitarti ogni settimana. La settimana inizia il lunedì alle 8:00. Un obiettivo nuovo vale dal lunedì successivo - la settimana in corso tiene il suo obiettivo. L'anello sotto il campo di scrittura mostra come stai andando.",
    keinWochenziel: "nessun obiettivo settimanale",
    wochenzielMinuten: (n: number) => `${n} minuti`,
    wochenzielAnstehend: (datum: string, minuten: number) =>
      minuten > 0
        ? `Da lunedì ${datum}, alle 8:00: ${minuten} minuti alla settimana - questa settimana tiene l'obiettivo attuale.`
        : `Da lunedì ${datum}, alle 8:00: nessun obiettivo settimanale - questa settimana tiene l'obiettivo attuale.`,
    nachholen: (an: boolean) =>
      `Recuperare i minuti mancanti delle settimane precedenti: ${an ? "sì" : "no"}`,
    nachholenHinweis:
      "Se ti eserciti più del tuo obiettivo settimanale, i minuti in più completano gli obiettivi non raggiunti delle settimane precedenti - prima il più vecchio.",
    anzeigeTitel: "Schermo",
    fingerFarben: (an: boolean) => `Colori delle dita: ${an ? "sì" : "no"}`,
    fingerFarbenTitel: "I tasti prendono il colore del dito che deve premerli.",
    leerzeichen: (an: boolean) => `Mostra gli spazi: ${an ? "sì" : "no"}`,
    leerzeichenTitel: "Mostra gli spazi della riga come ␣. No: uno spazio vuoto.",
    grosseTastatur: (an: boolean) => `Tastiera grande (con tastierino numerico): ${an ? "sì" : "no"}`,
    grosseTastaturHinweis:
      "Mostra, oltre alla solita tastiera sullo schermo, il tastierino numerico - e, se c'è posto, i tasti Ins, Home, PgSu, PgGiù, Fine e le frecce. Si attiva da sola appena si preme un tasto del tastierino numerico. Se la disattivi qui a mano, resta disattivata finché non la riattivi qui.",
    grosseTastaturAnsage: (an: boolean) => `Tastiera grande ${an ? "attivata" : "disattivata"}.`,
    groesse: "Dimensione del campo di scrittura",
    kleiner: "Campo di scrittura più piccolo",
    groesser: "Campo di scrittura più grande",
    groesseName: (p: number) => `Campo di scrittura al ${p} per cento`,
    groesseZahl: (p: number) => [p, "%"],
    groesseHinweis:
      "Funziona anche mentre ti eserciti: Alt e Più, Alt e Meno. Ingrandisce solo il campo di scrittura - per tutta la pagina c'è Ctrl e Più.",
    spielTitel: "Gioco premio",
    nachNeuerTaste: "Dopo un tasto nuovo",
    spielHinweis:
      "Scegli se ti viene proposto un breve gioco quando sblocchi un tasto. Puoi scegliere: Nessuno - è l'impostazione predefinita; oppure il Gioco dei lastroni, la Spedizione polare con il pinguino. È facoltativo; il tasto è tuo comunque. Vale per questo dispositivo.",
    spielName: "Gioco premio dopo un tasto nuovo",
    spielSatz1: "L'impostazione predefinita è ",
    spielSatz2: ": il tasto nuovo è tuo comunque, si festeggia e poi si continua. ",
    spielSatz3: " è la Spedizione polare con il pinguino - facoltativa, e non conta come tempo di esercizio.",
    tonTitel: "Suono",
    ton: (aus: boolean) => (aus ? "Suono: no" : "Suono: sì"),
    tonHinweis: "Attiva o disattiva tutti i suoni del programma - ricompense, suoni di errore e il clic mentre scrivi.",
    klickName: "Clic dei tasti",
    klick: "Clic dei tasti",
    klickTitel: "Un clic leggero a ogni battuta giusta",
    melodie: "Melodia mentre scrivi",
    melodieHinweis: "Per esercitare un ritmo di scrittura regolare e divertirti: chi scrive in modo regolare diventa più scorrevole anche sui tasti più deboli. Ogni tasto giusto suona la nota seguente di una canzone. Se scrivi a ritmo regolare, una band suona con te. Con la lettura ad alta voce, la melodia suona solo nell'orecchio destro. Scorciatoia: Alt + 6, cambiare suono con Alt + 7 e Alt + 8.",
    melodieKlang: "Suono",
    melodieLied: "Canzone",
    vorlesenTitel: "Lettura ad alta voce",
    vorlesen: (an: boolean) => (an ? "Lettura ad alta voce: sì" : "Lettura ad alta voce: no"),
    vorlesenTitelAttr:
      "Il programma legge ad alta voce (per chi non usa un lettore di schermo). Con un lettore di schermo attivo è meglio lasciarla disattivata.",
    strg: "Ctrl",
    strgSatz: ": silenzio immediato - in qualsiasi momento, anche a metà frase. Il messaggio successivo viene letto normalmente.",
    wasGelesen: "Che cosa viene letto (si può scegliere più di una cosa)",
    liest: "legge:",
    woerter: "Parole",
    woerterTitel: "Leggere ogni parola ad alta voce all'inizio della parola.",
    saetze: "Frasi",
    saetzeTitel: "Leggere tutta la riga come una frase all'inizio della riga.",
    buchstabieren: "Tasto per tasto",
    buchstabierenAnsage: (an: boolean) => `Tasto per tasto ${an ? "attivato" : "disattivato"}.`,
    buchstabierenTitel:
      `Annunciare il prossimo tasto dopo ogni battuta - per chi ascolta soltanto. Con "Lettura ad alta voce" disattivata, lo fa il lettore di schermo: la frase intera all'inizio della riga, la parola all'inizio della parola e poi i tasti. Con un display braille: lascialo disattivato, così il display resta fermo mentre scrivi.`,
    sprechTempo: "Velocità",
    sprechTempoName: "Velocità della voce",
    langsam: "lenta",
    normal: "normale",
    schnell: "veloce",
    sehrSchnell: "molto veloce",
    stimme: "Voce",
    stimmeHinweis:
      "Quale voce installata su questo dispositivo legge ad alta voce - sia il testo di esercizio sia i messaggi. La ricerca automatica trova da sola una voce adatta. Se una voce suona molto bassa o poco chiara con à, è o ò, scegline un'altra qui.",
    automatisch: "automatica",
    kontoTitel: "Il mio account",
    zugangsdaten: "I miei dati di accesso",
    kontoBestaetigt:
      "Cambiare l'indirizzo email o la password - ed eliminare l'account se non ti serve più.",
    kontoUnbestaetigt:
      "⚠️ Il tuo indirizzo email non è ancora confermato - fino ad allora non arriva nessun resoconto settimanale. Qui puoi chiedere di nuovo il link o cambiare l'indirizzo.",
    einrichtungTitel: "Introduzione e configurazione iniziale",
    einrichtungNeu: " Rifare la configurazione iniziale",
    einrichtungTitelAttr:
      "Ti guida passo per passo tra età, lingua, tastiera, suono e lettura ad alta voce (Alt + R)",
    einrichtungSatz:
      `Passo per passo tra tutte le impostazioni - con il podcast di introduzione alla fine. Anche con Alt + R. Il podcast è solo in "Introduzione".`,
  },
  en: {
    uebungsartTitel: "What are you practising?",
    uebungsart: "Practice type",
    modusAdaptiv: "My training",
    modusBuecherei: "Stories",
    modusWortspiele: "Word games",
    satzAdaptiv: " practises exactly the keys that are still wobbly.",
    satzBuecherei: " are whole texts, one stage at a time.",
    satzWortspiele: (k: string) => [" is a shelf - pick whatever you like. You can also switch between them with ", k, "."],
    texteTitel: "Texts",
    klassenStufeRest: " - your teacher has set this for the whole class.",
    textstufeHinweis: (fortschritt: string) =>
      `The age the words and texts are meant for. Applies from the next round - your ${fortschritt.toLowerCase()} and progress stay as they are.`,
    textstufeName: "Text age group",
    geburtsjahr: "Year of birth",
    geburtsjahrHinweis:
      "Just the year. If it is filled in and nobody has picked an age group by hand, the texts grow up with you. An age group picked by hand stays as it is.",
    geburtsjahrBeispiel: "e.g. 2016",
    sprache: "Language",
    spracheGesperrt: "Your teacher has set the language for you.",
    spracheHinweis: "The language of the words and texts you practise. Applies from the next round.",
    spracheHaupt: (name: string) =>
      `The language of this course: ${name}. You can also practise English - the keys still come in this course's order.`,
    spracheName: "Language of the texts",
    tastaturTitel: "Keyboard",
    meineTastatur: "My keyboard",
    tastaturHinweis:
      "The on-screen keyboard, the spoken finger hints and the characters you practise all follow this.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `This course teaches the keyboard of its country, so only ${tastaturDesLandes("en", weg)} keyboards are offered. The keyboard currently set, “${name}”, does not match.`,
    tastaturName: "Keyboard layout",
    anfangen: "Where to start",
    anfangenHinweis:
      "If you can already type, you don't have to start with F and J - and if you started too high, just set it back. Applies straight away to “My training”; your statistics and badges stay.",
    anfangenName: "Starting point in the course",
    tempoTitel: "Speed",
    zeitLassen: (an: boolean) => (an ? "Take your time: on" : "Take your time: off"),
    zeitLassenTitel:
      "No time limit in the game, no speed goal for the stars. Only how carefully you type counts.",
    zeitLassenSelbst:
      "With “Take your time”, speed doesn't count anywhere: the game runs without a clock, the stars come from care alone, and your practice time keeps counting even during long pauses.",
    zeitLassenVonLehrkraftAn:
      "Your teacher has turned on “Take your time” for you: speed doesn't count anywhere - only how carefully you type.",
    zeitLassenVonLehrkraftAus:
      "Your teacher sets “Take your time”. When it's on, speed doesn't count anywhere - only how carefully you type.",
    abstandTitel: "Letter spacing (CVI)",
    abstandName: "Wide letter spacing (CVI)",
    abstandHinweis:
      "More space between EVERY character while you copy the text - for children with cerebral visual impairment (CVI), for whom characters that stand close together run into each other. While you type, everything except the field you are typing in (the practice line or the game area) is dimmed; after 5 seconds without typing it turns bright again. The practice line glides to the next character at your own typing pace instead of jumping. When a multi-line question in the puzzle exercises wraps over several lines, only one line stays bright as well (the “reading line”) - the Down and Up arrow keys move between the lines. “Simple” leaves the characters at their usual spacing and only switches on the dimming, the gliding line and the reading line. You can change it here yourself at any time, as often as you like. If you're in a class, your teacher can set it too - whichever was chosen last applies.",
    einhand: (an: boolean) => `One-handed typing: ${an ? "on" : "off"}`,
    einhandHinweis:
      "For everyone who types with one hand: capital letters and symbols then count with either Shift key - not only the one on the other hand.",
    wochenzielTitel: "My weekly goal",
    wochenzielName: "Minutes per week",
    wochenzielHinweis:
      "How many minutes you want to practise each week. The week starts on Monday at 8am. A new goal applies from next Monday - the current week keeps its goal. The ring below the typing field shows how far you've got.",
    keinWochenziel: "no weekly goal",
    wochenzielMinuten: (n: number) => `${n} minutes`,
    wochenzielAnstehend: (datum: string, minuten: number) =>
      minuten > 0
        ? `From Monday ${datum}, 8am: ${minuten} minutes a week - this week keeps the goal you had.`
        : `From Monday ${datum}, 8am: no weekly goal - this week keeps the goal you had.`,
    nachholen: (an: boolean) =>
      `Catch up on missed minutes from previous weeks: ${an ? "on" : "off"}`,
    nachholenHinweis:
      "If you practise more than your weekly goal, the extra minutes fill up unmet goals from earlier weeks - the oldest first.",
    anzeigeTitel: "Display",
    fingerFarben: (an: boolean) => `Finger colours: ${an ? "on" : "off"}`,
    fingerFarbenTitel: "Keys in the colour of the finger that presses them.",
    leerzeichen: (an: boolean) => `Show spaces: ${an ? "on" : "off"}`,
    leerzeichenTitel: "Show spaces in the practice line as ␣. Off: a gap.",
    grosseTastatur: (an: boolean) => `Large keyboard (with number pad): ${an ? "on" : "off"}`,
    grosseTastaturHinweis:
      "Shows the number pad next to the usual on-screen keyboard - and, if there's enough room, the Insert, Home, Page, End and arrow keys. Switches on by itself as soon as you press a number-pad key. Once you turn it off here yourself, it stays off until you turn it on here again.",
    grosseTastaturAnsage: (an: boolean) => `Large keyboard ${an ? "on" : "off"}.`,
    groesse: "Size of the typing field",
    kleiner: "Make the typing field smaller",
    groesser: "Make the typing field bigger",
    groesseName: (p: number) => `Typing field ${p} percent`,
    groesseZahl: (p: number) => [p, "%"],
    groesseHinweis:
      "Also works while you practise: Alt and plus, Alt and minus. This only enlarges the typing field - for the whole page, use Ctrl and plus.",
    spielTitel: "Reward game",
    nachNeuerTaste: "After a new key",
    spielHinweis:
      "Whether you're offered a short game after you unlock a key. You can choose: None - that's the default; or the Ice Floe game, the Polar Expedition with the penguin. It's up to you; the key is yours anyway. Applies to this device.",
    spielName: "Reward game after a new key",
    spielSatz1: "The default is ",
    spielSatz2: ": the new key is yours anyway, it gets celebrated, and then you carry on. The ",
    spielSatz3: " is the Polar Expedition with the penguin - it's up to you, and it doesn't count as practice time.",
    tonTitel: "Sound",
    ton: (aus: boolean) => (aus ? "Sound off" : "Sound on"),
    tonHinweis: "Turns all of the app's sounds on or off - rewards, error tones, and the typing click.",
    klickName: "Key click sound",
    klick: "Key click",
    klickTitel: "A soft click for every correct keystroke",
    melodie: "Melody while typing",
    melodieHinweis: "Practises a steady typing rhythm and is meant to be fun - steady typists also get smoother on their weaker keys. Every correct key plays the next note of a tune. Type at a steady pace and a band joins in. With reading aloud on, the melody plays only in your right ear. Shortcut: Alt + 6, change the sound with Alt + 7 and Alt + 8.",
    melodieKlang: "Sound",
    melodieLied: "Tune",
    vorlesenTitel: "Read aloud",
    vorlesen: (an: boolean) => (an ? "Read aloud: on" : "Read aloud: off"),
    vorlesenTitelAttr:
      "The app reads aloud (for learners who don't use a screen reader). If a screen reader is running, it's best to leave this off.",
    strg: "Ctrl",
    strgSatz: " silences the voice instantly - anywhere, even in the middle of a sentence. The next announcement speaks again.",
    wasGelesen: "What is read aloud (you can choose more than one)",
    liest: "reads:",
    woerter: "Words",
    woerterTitel: "Read each word as you start it.",
    saetze: "Sentences",
    saetzeTitel: "Read the whole line as a sentence when you start it.",
    buchstabieren: "Spell out",
    buchstabierenAnsage: (an: boolean) => `Spell out: ${an ? "on" : "off"}.`,
    buchstabierenTitel:
      "After each keystroke, announce the next key - for everyone who only listens. With read aloud off, your screen reader says it: the whole sentence at the start of a line, the word at the start of a word, then the keys. With a braille display: off, so the line stays still while you type.",
    // Nicht „Speed" - so heisst schon die Gruppe „Tempo" (Zeit lassen) weiter oben.
    sprechTempo: "Speech rate",
    sprechTempoName: "Speech rate",
    langsam: "slow",
    normal: "normal",
    schnell: "fast",
    sehrSchnell: "very fast",
    stimme: "Voice",
    stimmeHinweis:
      "Which voice installed on this device reads aloud - for the practice text as well as the feedback. “Automatic” finds a suitable voice by itself. If a voice is too quiet or sounds unclear on ä, ö and ü, choose a different one here.",
    automatisch: "automatic",
    kontoTitel: "My account",
    zugangsdaten: "My login details",
    kontoBestaetigt:
      "Change your email address or password - and delete the account when you no longer need it.",
    kontoUnbestaetigt:
      "⚠️ Your email address isn't confirmed yet - until it is, no weekly report is sent. Here you can ask for a new link or change the address.",
    // ★ In der englischen Bedienung gibt es keine Einführung (der Podcast ist
    //   deutsch und bleibt weg, Johannes 12.09.2026) - die Gruppe heisst nur
    //   nach dem, was darin steht.
    einrichtungTitel: "Setup",
    einrichtungNeu: " Start the setup again",
    einrichtungTitelAttr:
      "Takes you step by step through age, language, keyboard, sound and reading aloud (Alt + R)",
    einrichtungSatz: "Step by step through all the settings. Also with Alt + R.",
  },
  // ★ O-PL (02.10.2026): das Zahnrad liest das Kind - „ty"; die Lehrkraft nur
  // unpersönlich („ustawiono w klasie", Regel 1/2); Glossar §2.2 „Mój trening",
  // „Bez pośpiechu", „Klawisz po klawiszu"; §2.8 „Dźwięk: włączony / wyłączony",
  // „Ctrl: natychmiastowa cisza", „Duże odstępy (CVI)", „klawiatura ekranowa",
  // „kolory palców", „pole pisania", „czytnik ekranu", „monitor brajlowski";
  // §2.9 „Układ klawiatury", „Moja klawiatura". Schalter-Zustand sächlich
  // („włączone"), ausser wo ein Nomen das Geschlecht vorgibt (dźwięk, klawiatura).
  // Wie Englisch ohne Podcast-Einführung (`mitPodcast` nur für „de").
  pl: {
    uebungsartTitel: "Co ćwiczysz?",
    uebungsart: "Rodzaj ćwiczenia",
    modusAdaptiv: "Mój trening",
    modusBuecherei: "Opowiadania",
    modusWortspiele: "Gry słowne",
    satzAdaptiv: " ćwiczy dokładnie te klawisze, które są jeszcze niepewne.",
    satzBuecherei: " to całe teksty, etap po etapie.",
    satzWortspiele: (k: string) => [
      " to półka - weź z niej to, co lubisz. Między ćwiczeniami przechodzisz też skrótem ",
      k,
      ".",
    ],
    texteTitel: "Teksty",
    klassenStufeRest: " - tak ustawiono dla całej klasy.",
    textstufeHinweis: (fortschritt: string) =>
      `Dla jakiego wieku są słowa i teksty. Obowiązuje od następnej rundy - ${fortschritt.toLowerCase()} i postępy zostają.`,
    textstufeName: "Teksty dla (wiek)",
    geburtsjahr: "Rok urodzenia",
    geburtsjahrHinweis:
      "Tylko rok. Jeśli jest podany, a poziom tekstów nie jest wybrany ręcznie, teksty rosną razem z tobą. Poziom wybrany ręcznie zostaje.",
    geburtsjahrBeispiel: "np. 2016",
    sprache: "Język",
    spracheGesperrt: "Język tekstów został ustalony w klasie.",
    spracheHinweis: "Język słów i tekstów do ćwiczeń. Obowiązuje od następnej rundy.",
    spracheHaupt: (name: string) =>
      `Język tego kursu: ${name}. Możesz też ćwiczyć po angielsku - klawisze i tak pojawiają się w kolejności tego kursu.`,
    spracheName: "Język tekstów",
    tastaturTitel: "Klawiatura",
    meineTastatur: "Moja klawiatura",
    tastaturHinweis:
      "Od tego zależą klawiatura ekranowa, podpowiedzi dla palców i znaki, które ćwiczysz.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Ten kurs uczy klawiatury swojego kraju, dlatego do wyboru są tylko klawiatury ${tastaturDesLandes("pl", weg)}. Ustawiona klawiatura („${name}”) do niego nie pasuje.`,
    tastaturName: "Układ klawiatury",
    anfangen: "Od czego chcesz zacząć?",
    anfangenHinweis:
      "Kto już umie pisać, nie musi zaczynać od F i J - a kto zaczął za wysoko, może po prostu wrócić niżej. Działa od razu w części „Mój trening”; statystyki i odznaki zostają.",
    anfangenName: "Punkt startowy w kursie",
    tempoTitel: "Tempo",
    zeitLassen: (an: boolean) => (an ? "Bez pośpiechu: włączone" : "Bez pośpiechu: wyłączone"),
    zeitLassenTitel:
      "Bez limitu czasu w grze i bez wymaganego tempa przy gwiazdkach. Liczy się tylko staranność.",
    zeitLassenSelbst:
      "Z ustawieniem „Bez pośpiechu” tempo nigdzie się nie liczy: gra działa bez zegara, gwiazdki daje sama staranność, a czas ćwiczeń liczy się dalej także przy długich przerwach.",
    zeitLassenVonLehrkraftAn:
      "W klasie włączono dla ciebie „Bez pośpiechu”: tempo nigdzie się nie liczy - tylko to, jak starannie piszesz.",
    zeitLassenVonLehrkraftAus:
      "„Bez pośpiechu” ustawia się w klasie. Gdy jest włączone, tempo nigdzie się nie liczy - tylko staranność.",
    abstandTitel: "Odstępy (CVI)",
    abstandName: "Duże odstępy (CVI)",
    abstandHinweis:
      "Więcej miejsca między KAŻDYM znakiem przy przepisywaniu - dla dzieci z mózgowymi zaburzeniami widzenia (CVI), którym znaki stojące blisko siebie zlewają się. Podczas pisania wszystko poza polem, w którym właśnie piszesz (wierszem ćwiczenia albo polem gry), jest przyciemnione; po 5 sekundach bez pisania znów robi się jasno. Wiersz ćwiczenia przesuwa się przy tym w twoim rytmie do następnego znaku, zamiast skakać. Gdy wielowierszowe pytanie w zagadkach zajmuje kilka wierszy, jasny zostaje tylko jeden wiersz („wiersz do czytania”) - strzałką w dół i strzałką w górę przechodzisz między wierszami. „Pojedyncze” zostawia znaki w zwykłym odstępie i włącza tylko przyciemnianie, przesuwanie wiersza i wiersz do czytania. Możesz to tutaj zmieniać w każdej chwili, tak często, jak chcesz. Jeśli należysz do klasy, może to ustawić także nauczyciel lub nauczycielka - obowiązuje ostatni wybór.",
    einhand: (an: boolean) => `Pisanie jedną ręką: ${an ? "włączone" : "wyłączone"}`,
    einhandHinweis:
      "Dla osób, które piszą jedną ręką: wielkie litery i symbole działają wtedy z każdym klawiszem Shift - nie tylko z tym po stronie drugiej ręki.",
    wochenzielTitel: "Mój cel tygodniowy",
    wochenzielName: "Minuty w tygodniu",
    wochenzielHinweis:
      "Ile minut chcesz ćwiczyć w każdym tygodniu. Tydzień zaczyna się w poniedziałek o 8:00. Nowy cel obowiązuje od następnego poniedziałku - bieżący tydzień zachowuje swój cel. Twój stan pokazuje krąg pod polem pisania.",
    keinWochenziel: "bez celu tygodniowego",
    wochenzielMinuten: (n: number) => minutyPl(n),
    wochenzielAnstehend: (datum: string, minuten: number) =>
      minuten > 0
        ? `Od poniedziałku ${datum}, 8:00: ${minutyPl(minuten)} tygodniowo - w tym tygodniu zostaje dotychczasowy cel.`
        : `Od poniedziałku ${datum}, 8:00: bez celu tygodniowego - w tym tygodniu zostaje dotychczasowy cel.`,
    nachholen: (an: boolean) =>
      `Nadrabianie brakujących minut z poprzednich tygodni: ${an ? "włączone" : "wyłączone"}`,
    nachholenHinweis:
      "Gdy ćwiczysz więcej, niż wynosi cel tygodniowy, dodatkowe minuty uzupełniają nieosiągnięte cele z wcześniejszych tygodni - najpierw najstarszy.",
    anzeigeTitel: "Wyświetlanie",
    fingerFarben: (an: boolean) => `Kolory palców: ${an ? "włączone" : "wyłączone"}`,
    fingerFarbenTitel: "Klawisze w kolorze palca, który je naciska.",
    leerzeichen: (an: boolean) => `Pokazuj spacje: ${an ? "włączone" : "wyłączone"}`,
    leerzeichenTitel: "Spacje w linii jako ␣. Wyłączone: przerwa.",
    grosseTastatur: (an: boolean) =>
      `Duża klawiatura (z klawiaturą numeryczną): ${an ? "włączona" : "wyłączona"}`,
    grosseTastaturHinweis:
      "Obok zwykłej klawiatury ekranowej pokazuje też klawiaturę numeryczną - a jeśli jest miejsce, także klawisze Insert, Home, Page Up, Page Down, End i strzałki. Włącza się sama, gdy tylko zostanie naciśnięty klawisz z klawiatury numerycznej. Wyłączona tutaj ręcznie zostaje wyłączona, dopóki nie włączysz jej tu z powrotem.",
    grosseTastaturAnsage: (an: boolean) => `Duża klawiatura ${an ? "włączona" : "wyłączona"}.`,
    groesse: "Rozmiar pola pisania",
    kleiner: "Mniejsze pole pisania",
    groesser: "Większe pole pisania",
    groesseName: (p: number) => `Pole pisania: ${p}%`,
    groesseZahl: (p: number) => [p, "%"],
    groesseHinweis:
      "Działa też podczas ćwiczenia: Alt i plus, Alt i minus. Powiększa tylko pole pisania - całą stronę powiększa Ctrl i plus.",
    spielTitel: "Gra w nagrodę",
    nachNeuerTaste: "Po nowym klawiszu",
    spielHinweis:
      "Czy po odblokowaniu klawisza dostajesz propozycję krótkiej gry. Do wyboru: Brak - to ustawienie domyślne; albo Skoki po krach, czyli Wyprawa polarna z pingwinem. Dobrowolnie; klawisz i tak jest twój. Dotyczy tego urządzenia.",
    spielName: "Gra w nagrodę po nowym klawiszu",
    spielSatz1: "Ustawienie domyślne: ",
    spielSatz2: " - nowy klawisz i tak jest twój, jest świętowany, a potem ćwiczysz dalej. ",
    spielSatz3: " to Wyprawa polarna z pingwinem - dobrowolna, i nie liczy się do czasu ćwiczeń.",
    tonTitel: "Dźwięk",
    ton: (aus: boolean) => (aus ? "Dźwięk: wyłączony" : "Dźwięk: włączony"),
    tonHinweis: "Włącza albo wyłącza wszystkie dźwięki programu - nagrody, dźwięki błędów i stukot przy pisaniu.",
    klickName: "Stukot klawiszy",
    klick: "Stukot klawiszy",
    klickTitel: "Cichy stukot przy każdym poprawnym uderzeniu",
    melodie: "Melodia podczas pisania",
    melodieHinweis: "Ćwiczy równy rytm pisania i ma być zabawą - kto pisze równo, jest płynniejszy także na słabszych klawiszach. Każdy dobry klawisz gra następną nutę piosenki. Gdy piszesz równo, dołącza zespół. Z czytaniem na głos melodia gra tylko w prawym uchu. Skrót: Alt + 6, zmiana dźwięku: Alt + 7 i Alt + 8.",
    melodieKlang: "Dźwięk",
    melodieLied: "Piosenka",
    vorlesenTitel: "Czytanie na głos",
    vorlesen: (an: boolean) => (an ? "Czytanie na głos: włączone" : "Czytanie na głos: wyłączone"),
    vorlesenTitelAttr:
      "Program czyta na głos (dla osób, które nie używają czytnika ekranu). Przy włączonym czytniku ekranu lepiej to wyłączyć.",
    strg: "Ctrl",
    strgSatz: ": natychmiastowa cisza - w każdej chwili, nawet w środku zdania. Następny komunikat jest znów czytany.",
    wasGelesen: "Co jest czytane (można wybrać kilka rzeczy)",
    liest: "czyta:",
    woerter: "Słowa",
    woerterTitel: "Czytaj każde słowo na jego początku.",
    saetze: "Zdania",
    saetzeTitel: "Na początku wiersza czytaj cały wiersz jako zdanie.",
    buchstabieren: "Klawisz po klawiszu",
    buchstabierenAnsage: (an: boolean) => `Klawisz po klawiszu: ${an ? "włączone" : "wyłączone"}.`,
    buchstabierenTitel:
      "Po każdym uderzeniu zapowiada następny klawisz - dla osób, które tylko słuchają. Gdy czytanie na głos jest wyłączone, robi to czytnik ekranu: na początku wiersza całe zdanie, na początku słowa słowo, potem klawisze. Z monitorem brajlowskim: wyłącz, wtedy wiersz na monitorze stoi w miejscu podczas pisania.",
    sprechTempo: "Tempo mowy",
    sprechTempoName: "Tempo mowy",
    langsam: "wolno",
    normal: "normalnie",
    schnell: "szybko",
    sehrSchnell: "bardzo szybko",
    stimme: "Głos",
    stimmeHinweis:
      "Który głos zainstalowany na tym urządzeniu czyta na głos - tekst do ćwiczeń i komunikaty. „Automatycznie” samo wybiera pasujący głos. Jeśli głos jest za cichy albo niewyraźnie czyta ą, ę czy ł, wybierz tu inny.",
    automatisch: "automatycznie",
    kontoTitel: "Moje konto",
    zugangsdaten: "Moje dane logowania",
    kontoBestaetigt:
      "Zmień adres e-mail albo hasło - i usuń konto, gdy nie będzie już potrzebne.",
    kontoUnbestaetigt:
      "⚠️ Twój adres e-mail nie jest jeszcze potwierdzony - do tego czasu nie przychodzi podsumowanie tygodnia. Tutaj możesz poprosić o nowy link albo zmienić adres.",
    einrichtungTitel: "Konfiguracja",
    einrichtungNeu: " Uruchom konfigurację ponownie",
    einrichtungTitelAttr:
      "Prowadzi krok po kroku przez wiek, język, klawiaturę, dźwięk i czytanie na głos (Alt + R)",
    einrichtungSatz: "Krok po kroku przez wszystkie ustawienia. Także skrótem Alt + R.",
  },
  // ★ O-TR (02.10.2026): das Zahnrad liest das Kind - "sen" (Glossar Regel 1);
  // Glossar §2.2 "Antrenmanım", "Acele yok", "Harf harf", "henüz oturmamış
  // tuşlar"; §2.8 "Ses efektleri: açık / kapalı", "Sesli okuma", "okuma sesi",
  // "konuşma hızı", "Ctrl: hemen sustur", "Geniş harf aralığı (CVI)", "ekran
  // klavyesi", "parmak renkleri", "yazma alanı", "ekran okuyucu", "Braille
  // ekran"; §2.9 "Klavye düzeni"; §2.10 "Hafta başlangıcı: Pazartesi, 08:00".
  // Keine Endung an Zahl, Datum, Tastenname (Regel 6), Prozent vor der Zahl
  // ("%120", Regel 5); klein schreiben mit `kleinFuer(text, "tr")` (Regel 9).
  // "boşluk" nur für die Leertaste - der Abstand heisst "aralık" (§4 Nr. 8).
  tr: {
    uebungsartTitel: "Ne çalışıyorsun?",
    uebungsart: "Alıştırma türü",
    modusAdaptiv: "Antrenmanım",
    modusBuecherei: "Öyküler",
    modusWortspiele: "Kelime oyunları",
    satzAdaptiv: " tam olarak henüz oturmamış tuşları çalıştırır.",
    satzBuecherei: " bölüm bölüm bütün metinlerdir.",
    satzWortspiele: (k: string) => [
      " bir raftır - beğendiğini al. Alıştırmalar arasında sırayla ",
      k,
      " ile de geçebilirsin.",
    ],
    texteTitel: "Metinler",
    klassenStufeRest: " - bütün sınıf için böyle ayarlandı.",
    textstufeHinweis: (fortschritt: string) =>
      `Kelimelerin ve metinlerin hangi yaşa uygun olduğu. Bir sonraki turdan itibaren geçerlidir - ${kleinFuer(fortschritt, "tr")} ve ilerleme korunur.`,
    textstufeName: "Metinler (yaş)",
    geburtsjahr: "Doğum yılı",
    geburtsjahrHinweis:
      "Yalnızca yıl. Girilmişse ve metin düzeyi elle seçilmemişse, metinler seninle birlikte büyür. Elle seçilen düzey olduğu gibi kalır.",
    geburtsjahrBeispiel: "örn. 2016",
    sprache: "Dil",
    spracheGesperrt: "Metinlerin dili sınıfta belirlendi.",
    spracheHinweis: "Alıştırma kelimelerinin ve metinlerinin dili. Bir sonraki turdan itibaren geçerlidir.",
    spracheHaupt: (name: string) =>
      `Bu kursun dili: ${name}. İstersen İngilizce de çalışabilirsin - tuşlar yine bu kursun sırasıyla gelir.`,
    spracheName: "Metinlerin dili",
    tastaturTitel: "Klavye",
    meineTastatur: "Klavyem",
    tastaturHinweis:
      "Ekran klavyesi, parmak ipuçları ve çalıştığın işaretler buna göre belirlenir.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Bu kurs kendi ülkesinin klavyesini öğretir; bu yüzden yalnızca ${tastaturDesLandes("tr", weg)} klavyeler seçilebilir. Ayarlı klavye ("${name}") bu kursa uymuyor.`,
    tastaturName: "Klavye düzeni",
    anfangen: "Nereden başlamak istersin?",
    anfangenHinweis:
      `Zaten yazabilen biri F ve J tuşlarından başlamak zorunda değil - fazla yüksekten başlayan da kolayca geri dönebilir. "Antrenmanım" bölümünde hemen geçerli olur; istatistikler ve rozetler korunur.`,
    anfangenName: "Kurstaki başlangıç noktası",
    tempoTitel: "Hız",
    zeitLassen: (an: boolean) => (an ? "Acele yok: açık" : "Acele yok: kapalı"),
    zeitLassenTitel:
      "Oyunda süre sınırı yok, yıldızlarda istenen hız yok. Yalnızca özen sayılır.",
    zeitLassenSelbst:
      `"Acele yok" açıkken hız hiçbir yerde sayılmaz: oyun saatsiz çalışır, yıldızları yalnızca özen getirir ve çalışma süresi uzun aralarda da sayılmaya devam eder.`,
    zeitLassenVonLehrkraftAn:
      `Öğretmenin senin için "Acele yok" seçeneğini açtı: hız hiçbir yerde sayılmaz - yalnızca ne kadar özenle yazdığın.`,
    zeitLassenVonLehrkraftAus:
      `"Acele yok" sınıfta ayarlanır. Açıkken hız hiçbir yerde sayılmaz - yalnızca özen.`,
    abstandTitel: "Harf aralığı (CVI)",
    abstandName: "Geniş harf aralığı (CVI)",
    abstandHinweis:
      `Yazarken HER karakterin arasında daha geniş aralık - serebral görme bozukluğu (CVI) olan ve yan yana duran harfleri iç içe gören çocuklar için. Yazarken, o an yazdığın alanın (alıştırma satırı ya da oyun alanı) dışındaki her şey karartılır; 5 saniye yazmazsan her şey yeniden aydınlanır. Alıştırma satırı bu sırada senin hızınla bir sonraki karaktere kayar, zıplamaz. Bulmacalarda çok satırlı bir soru birkaç satır kaplıyorsa yalnızca bir satır aydınlık kalır ("okuma satırı") - aşağı ok ve yukarı ok tuşlarıyla satırlar arasında geçersin. "tek kat" karakterleri normal aralıkta bırakır ve yalnızca karartmayı, satırın kaymasını ve okuma satırını açar. Bunu burada istediğin zaman, istediğin kadar sık değiştirebilirsin. Bir sınıftaysan öğretmenin de ayarlayabilir - en son yapılan seçim geçerlidir.`,
    einhand: (an: boolean) => `Tek elle yazma: ${an ? "açık" : "kapalı"}`,
    einhandHinweis:
      "Tek elle yazanlar için: büyük harfler ve simgeler o zaman iki Shift tuşuyla da çalışır - yalnızca diğer elin tarafındakiyle değil.",
    wochenzielTitel: "Haftalık hedefim",
    wochenzielName: "Haftada dakika",
    wochenzielHinweis:
      "Her hafta kaç dakika çalışmak istediğin. Hafta başlangıcı: Pazartesi, 08:00. Yeni hedef bir sonraki pazartesiden itibaren geçerlidir - bu hafta kendi hedefini korur. Durumunu yazma alanının altındaki halka gösterir.",
    keinWochenziel: "haftalık hedef yok",
    wochenzielMinuten: (n: number) => `${n} dakika`,
    wochenzielAnstehend: (datum: string, minuten: number) =>
      minuten > 0
        ? `Başlangıç: ${datum} Pazartesi, 08:00 - haftada ${minuten} dakika. Bu hafta önceki hedef geçerli.`
        : `Başlangıç: ${datum} Pazartesi, 08:00 - haftalık hedef yok. Bu hafta önceki hedef geçerli.`,
    nachholen: (an: boolean) =>
      `Önceki haftalardan eksik dakikaları telafi et: ${an ? "açık" : "kapalı"}`,
    nachholenHinweis:
      "Haftalık hedeften fazla çalıştığında, fazla dakikalar önceki haftaların ulaşılmamış hedeflerini tamamlar - önce en eskisini.",
    anzeigeTitel: "Görünüm",
    fingerFarben: (an: boolean) => `Parmak renkleri: ${an ? "açık" : "kapalı"}`,
    fingerFarbenTitel: "Tuşlar, onlara basan parmağın renginde.",
    leerzeichen: (an: boolean) => `Boşlukları göster: ${an ? "açık" : "kapalı"}`,
    leerzeichenTitel: "Satırdaki boşlukları ␣ olarak göster. Kapalı: boşluk.",
    grosseTastatur: (an: boolean) => `Büyük klavye (numaratörlü): ${an ? "açık" : "kapalı"}`,
    grosseTastaturHinweis:
      "Normal ekran klavyesinin yanında numaratörü de gösterir - yer varsa Insert, Home, Page Up, Page Down, End ve ok tuşlarını da. Numaratörden bir tuşa basıldığı anda kendiliğinden açılır. Burada elle kapatılırsa, burada yeniden açılana kadar kapalı kalır.",
    grosseTastaturAnsage: (an: boolean) => `Büyük klavye ${an ? "açık" : "kapalı"}.`,
    groesse: "Yazma alanının boyutu",
    kleiner: "Yazma alanını küçült",
    groesser: "Yazma alanını büyüt",
    groesseName: (p: number) => `Yazma alanı: %${p}`,
    groesseZahl: (p: number) => ["%", p],
    groesseHinweis:
      "Alıştırma sırasında da çalışır: Alt ve artı, Alt ve eksi. Yalnızca yazma alanını büyütür - bütün sayfayı Ctrl ve artı büyütür.",
    spielTitel: "Ödül oyunu",
    nachNeuerTaste: "Yeni tuştan sonra",
    spielHinweis:
      "Bir tuşun kilidi açıldıktan sonra sana kısa bir oyun önerilip önerilmeyeceği. Seçenekler: Yok - varsayılan budur; ya da Buz Kütlesi Oyunu, yani penguenle Kutup Keşfi. İsteğe bağlı; tuş zaten senin. Bu cihaz için geçerlidir.",
    spielName: "Yeni tuştan sonra ödül oyunu",
    spielSatz1: "Varsayılan: ",
    spielSatz2: " - yeni tuş zaten senin; kutlanır ve sonra çalışmaya devam edersin. ",
    spielSatz3: ": penguenle Kutup Keşfi - isteğe bağlı ve çalışma süresine sayılmaz.",
    tonTitel: "Ses efektleri",
    ton: (aus: boolean) => (aus ? "Ses efektleri: kapalı" : "Ses efektleri: açık"),
    tonHinweis: "Programın bütün ses efektlerini açar ya da kapatır - ödüller, hata sesleri ve yazarken tuş sesi.",
    klickName: "Tuş sesi",
    klick: "Tuş sesi",
    klickTitel: "Her doğru vuruşta hafif bir tık sesi",
    melodie: "Yazarken melodi",
    melodieHinweis: "Düzenli yazma ritmini çalıştırır ve eğlencelidir - düzenli yazan, zayıf tuşlarda da akıcı olur. Her doğru tuş bir şarkının sonraki notasını çalar. Düzenli yazarsan bir grup sana eşlik eder. Sesli okuma açıksa melodi yalnızca sağ kulakta çalar. Kısayol: Alt + 6, sesi değiştirmek için Alt + 7 ve Alt + 8.",
    melodieKlang: "Ses",
    melodieLied: "Şarkı",
    vorlesenTitel: "Sesli okuma",
    vorlesen: (an: boolean) => (an ? "Sesli okuma: açık" : "Sesli okuma: kapalı"),
    vorlesenTitelAttr:
      "Program sesli okur (ekran okuyucu kullanmayanlar için). Ekran okuyucu açıksa bunu kapatmak daha iyidir.",
    strg: "Ctrl",
    strgSatz: ": hemen sustur - her zaman, cümlenin ortasında bile. Sonraki duyuru yine okunur.",
    wasGelesen: "Neler okunur (birden fazla seçilebilir)",
    liest: "okur:",
    woerter: "Kelimeler",
    woerterTitel: "Her kelime, başlarken okunur.",
    saetze: "Cümleler",
    saetzeTitel: "Satır başında bütün satır cümle olarak okunur.",
    buchstabieren: "Harf harf",
    buchstabierenAnsage: (an: boolean) => `Harf harf: ${an ? "açık" : "kapalı"}.`,
    buchstabierenTitel:
      "Her vuruştan sonra sıradaki tuşu söyler - yalnızca dinleyerek çalışanlar için. Sesli okuma kapalıysa bunu ekran okuyucu yapar: satır başında bütün cümle, kelime başında kelime, sonra tuşlar. Braille ekranla: kapat; o zaman yazarken Braille ekrandaki satır yerinde durur.",
    sprechTempo: "Konuşma hızı",
    sprechTempoName: "Konuşma hızı",
    langsam: "yavaş",
    normal: "normal",
    schnell: "hızlı",
    sehrSchnell: "çok hızlı",
    stimme: "Okuma sesi",
    stimmeHinweis:
      `Bu cihazda yüklü olan hangi sesin okuyacağı - alıştırma metni ve mesajlar. "otomatik" seçeneği uygun sesi kendisi seçer. Ses çok alçaksa ya da ı, ğ, ş harflerini anlaşılmaz okuyorsa burada başka bir ses seç.`,
    automatisch: "otomatik",
    kontoTitel: "Hesabım",
    zugangsdaten: "Giriş bilgilerim",
    kontoBestaetigt:
      "E-posta adresini ya da şifreni değiştir - ve artık gerekmediğinde hesabı sil.",
    kontoUnbestaetigt:
      "⚠️ E-posta adresin henüz onaylanmadı - o zamana kadar haftalık özet gelmez. Burada yeni bir onay bağlantısı isteyebilir ya da adresi değiştirebilirsin.",
    einrichtungTitel: "Kurulum",
    einrichtungNeu: " Kurulumu yeniden başlat",
    einrichtungTitelAttr:
      "Yaş, dil, klavye, ses efektleri ve sesli okuma adımlarından adım adım geçirir (Alt + R)",
    einrichtungSatz: "Bütün ayarlardan adım adım geçer. Alt + R ile de açılır.",
  },
  // ★ O-CS (03.10.2026): das Zahnrad liest das Kind - „ty" (Glossar Regel 1);
  // Glossar §2.2 „Můj trénink", „V klidu", „Klávesa po klávese", „nejisté
  // klávesy"; §2.8 „Zvuk: zapnuto / vypnuto", „Předčítání", „hlas", „rychlost
  // řeči", „Ctrl: okamžité ztišení", „Větší mezery mezi znaky (CVI)",
  // „klávesnice na obrazovce", „barvy prstů", „pole pro psaní", „odečítač
  // obrazovky", „braillský řádek"; §2.9 „Rozložení klávesnice"; §2.10 „Týden
  // začíná v pondělí v 8:00". Ohne Geschlecht (Regel 2: nie „Tvoje vyučující
  // zapnul", nie „jsi jistý"); „cíl" nur für das Wochenziel; „95 %" mit
  // geschütztem Leerzeichen; klein schreiben mit `kleinFuer(text, "cs")`.
  cs: {
    uebungsartTitel: "Co cvičíš?",
    uebungsart: "Druh cvičení",
    modusAdaptiv: "Můj trénink",
    modusBuecherei: "Příběhy",
    modusWortspiele: "Slovní hry",
    satzAdaptiv: " procvičuje přesně ty klávesy, které jsou ještě nejisté.",
    satzBuecherei: " jsou celé texty, díl po dílu.",
    satzWortspiele: (k: string) => [
      " jsou jako police - vezmi si, co tě baví. Mezi cvičeními se dá postupně přepínat i zkratkou ",
      k,
      ".",
    ],
    texteTitel: "Texty",
    klassenStufeRest: " - nastavení platí pro celou třídu.",
    textstufeHinweis: (fortschritt: string) =>
      `Pro jaký věk se hodí slova a texty. Platí od příštího kola - ${kleinFuer(fortschritt, "cs")} a pokrok zůstávají.`,
    textstufeName: "Texty pro věk",
    geburtsjahr: "Rok narození",
    geburtsjahrHinweis:
      "Jen letopočet. Když je zadaný a úroveň textů není vybraná ručně, texty rostou s tebou samy. Ručně vybraná úroveň platí dál.",
    geburtsjahrBeispiel: "např. 2016",
    sprache: "Jazyk",
    spracheGesperrt: "Jazyk textů je nastavený pro celou třídu.",
    spracheHinweis: "Jazyk slov a textů na cvičení. Platí od příštího kola.",
    spracheHaupt: (name: string) =>
      `Jazyk tohoto kurzu: ${name}. Navíc můžeš cvičit i angličtinu - klávesy ale přicházejí v pořadí tohoto kurzu.`,
    spracheName: "Jazyk textů",
    tastaturTitel: "Klávesnice",
    meineTastatur: "Moje klávesnice",
    tastaturHinweis:
      "Podle ní se řídí klávesnice na obrazovce, hlášení prstů a znaky, které se cvičí. Na české klávesnici jsou na číselné řadě písmena ě š č ř ž ý á í é - číslice napíšeš s klávesou Shift.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Tento kurz učí klávesnici své země, proto jsou na výběr jen ${tastaturDesLandes("cs", weg)} klávesnice. Nastavená klávesnice (${name}) k němu nepasuje.`,
    tastaturName: "Rozložení klávesnice",
    anfangen: "Odkud začneš?",
    anfangenHinweis:
      "Kdo už umí psát, nemusí začínat u F a J - a když je výchozí bod moc vysoko, dá se prostě vrátit zpátky. Platí hned pro Můj trénink; statistika a odznaky zůstávají.",
    anfangenName: "Výchozí bod v kurzu",
    tempoTitel: "Rychlost",
    zeitLassen: (an: boolean) => (an ? "V klidu: zapnuto" : "V klidu: vypnuto"),
    zeitLassenTitel:
      "Ve hře žádný časový limit, u hvězdiček žádná požadovaná rychlost. Počítá se jen pečlivost.",
    zeitLassenSelbst:
      "S volbou V klidu se rychlost nikde nepočítá: hra běží bez hodin, hvězdičky jsou jen za pečlivost a čas procvičování se počítá dál i při dlouhých pauzách.",
    zeitLassenVonLehrkraftAn:
      "Ve tvé třídě je pro tebe zapnutá volba V klidu: rychlost se nikde nepočítá - jen to, jak pečlivě píšeš.",
    zeitLassenVonLehrkraftAus:
      "Volba V klidu se nastavuje ve třídě. Když je zapnutá, rychlost se nikde nepočítá - jen pečlivost.",
    abstandTitel: "Mezery mezi znaky (CVI)",
    abstandName: "Větší mezery mezi znaky (CVI)",
    abstandHinweis:
      "Větší mezera mezi KAŽDÝM znakem při opisování - pro děti s cerebrálním zrakovým postižením (CVI), kterým se blízko stojící znaky slévají. Při psaní se ztmaví všechno kromě pole, do kterého se právě píše (řádek na cvičení nebo hrací pole); po 5 sekundách bez psaní se zase rozsvítí. Řádek na cvičení přitom v tvém tempu psaní plynule klouže k dalšímu znaku, místo aby skákal. Když se víceřádková otázka v hádankách zalomí, zůstane navíc světlý jen jeden řádek (čtecí řádek) - šipkou dolů a šipkou nahoru se mezi řádky přepíná. Volba „jednoduché“ nechá znaky v obvyklé vzdálenosti a zapne jen ztmavení, klouzání řádku a čtecí řádek. Tady si to můžeš kdykoli přepnout, jak často chceš. Když patříš do třídy, může to nastavit i vyučující - platí, co bylo vybráno naposledy.",
    einhand: (an: boolean) => `Psaní jednou rukou: ${an ? "zapnuto" : "vypnuto"}`,
    einhandHinweis:
      "Pro všechny, kdo píšou jednou rukou: velká písmena a speciální znaky pak platí s kteroukoli klávesou Shift - nejen s tou na straně druhé ruky.",
    wochenzielTitel: "Můj týdenní cíl",
    wochenzielName: "Minuty za týden",
    wochenzielHinweis:
      "Kolik minut chceš cvičit každý týden. Týden začíná v pondělí v 8:00. Nový cíl platí od příštího pondělí - běžící týden si nechá svůj cíl. Jak na tom jsi, ukazuje kruh pod polem pro psaní.",
    keinWochenziel: "žádný týdenní cíl",
    wochenzielMinuten: (n: number) => minutyCs(n),
    wochenzielAnstehend: (datum: string, minuten: number) =>
      minuten > 0
        ? `Od pondělí ${datum} v 8:00: týdně ${minuten} min - tento týden platí dosavadní cíl.`
        : `Od pondělí ${datum} v 8:00: žádný týdenní cíl - tento týden platí dosavadní cíl.`,
    nachholen: (an: boolean) =>
      `Dohnat minuty z minulých týdnů: ${an ? "zapnuto" : "vypnuto"}`,
    nachholenHinweis:
      "Když cvičíš víc, než je tvůj týdenní cíl, doplní minuty navíc nesplněné cíle z dřívějších týdnů - nejdřív ten nejstarší.",
    anzeigeTitel: "Zobrazení",
    fingerFarben: (an: boolean) => `Barvy prstů: ${an ? "zapnuto" : "vypnuto"}`,
    fingerFarbenTitel: "Klávesy v barvě prstu, který je stiskne.",
    leerzeichen: (an: boolean) => `Zobrazit mezery: ${an ? "zapnuto" : "vypnuto"}`,
    leerzeichenTitel: "Mezery v řádku jako ␣. Vypnuto: mezera.",
    grosseTastatur: (an: boolean) => `Velká klávesnice (s numerickou klávesnicí): ${an ? "zapnuto" : "vypnuto"}`,
    grosseTastaturHinweis:
      "Vedle obvyklé klávesnice na obrazovce ukáže i numerickou klávesnici - a když je dost místa, také klávesy Insert, Home, Page Up, Page Down, End a šipky. Zapne se sama, jakmile se stiskne klávesa z numerické klávesnice. Když ji tu ručně vypneš, zůstane vypnutá, dokud ji tu zase nezapneš.",
    grosseTastaturAnsage: (an: boolean) => `Velká klávesnice: ${an ? "zapnuto" : "vypnuto"}.`,
    groesse: "Velikost pole pro psaní",
    kleiner: "Zmenšit pole pro psaní",
    groesser: "Zvětšit pole pro psaní",
    groesseName: (p: number) => `Pole pro psaní: ${p}\u00a0%`,
    groesseZahl: (p: number) => [p, "\u00a0%"],
    groesseHinweis:
      "Funguje i při cvičení: Alt a plus, Alt a minus. Zvětší jen pole pro psaní - celou stránku zvětší Ctrl a plus.",
    spielTitel: "Odměnová hra",
    nachNeuerTaste: "Po nové klávese",
    spielHinweis:
      "Jestli ti po odemčení klávesy nabídneme krátkou hru. Na výběr je: žádná - to je výchozí nastavení; nebo Ledové kry, Polární výprava s tučňákem. Dobrovolné; klávesa je tvoje tak jako tak. Platí pro toto zařízení.",
    spielName: "Odměnová hra po nové klávese",
    spielSatz1: "Výchozí nastavení: ",
    spielSatz2: " - nová klávesa je tvoje tak jako tak, oslaví se a pak se cvičí dál. Hra ",
    spielSatz3: " je Polární výprava s tučňákem - dobrovolná a nepočítá se do času procvičování.",
    tonTitel: "Zvuk",
    ton: (aus: boolean) => (aus ? "Zvuk: vypnuto" : "Zvuk: zapnuto"),
    tonHinweis: "Zapne nebo vypne všechny zvuky programu - odměny, zvuky při chybě a cvakání při psaní.",
    klickName: "Cvakání kláves",
    klick: "Cvakání kláves",
    klickTitel: "Tiché cvaknutí při každém správném úhozu",
    melodie: "Melodie při psaní",
    melodieHinweis: "Cvičí rovnoměrný rytmus psaní a má být zábava - kdo píše rovnoměrně, je plynulejší i na slabších klávesách. Každá správná klávesa zahraje další tón písničky. Když píšeš pravidelně, přidá se kapela. S předčítáním hraje melodie jen v pravém uchu. Zkratka: Alt + 6, změna zvuku: Alt + 7 a Alt + 8.",
    melodieKlang: "Zvuk",
    melodieLied: "Písnička",
    vorlesenTitel: "Předčítání",
    vorlesen: (an: boolean) => (an ? "Předčítání: zapnuto" : "Předčítání: vypnuto"),
    vorlesenTitelAttr:
      "Aplikace předčítá (pro ty, kdo nepoužívají odečítač obrazovky). Se zapnutým odečítačem obrazovky je lepší ho vypnout.",
    strg: "Ctrl",
    strgSatz: ": okamžité ztišení - kdykoli, i uprostřed věty. Další hlášení zase zazní.",
    wasGelesen: "Co se předčítá (lze vybrat víc možností)",
    liest: "čte:",
    woerter: "Slova",
    woerterTitel: "Každé slovo přečíst na jeho začátku.",
    saetze: "Věty",
    saetzeTitel: "Na začátku řádku přečíst celý řádek jako větu.",
    buchstabieren: "Klávesa po klávese",
    buchstabierenAnsage: (an: boolean) => `Klávesa po klávese: ${an ? "zapnuto" : "vypnuto"}.`,
    buchstabierenTitel:
      "Po každém úhozu ohlásit další klávesu - pro všechny, kdo jen poslouchají. Když je Předčítání vypnuté, říká to odečítač obrazovky: na začátku řádku celou větu, na začátku slova slovo, potom klávesy. S braillským řádkem: vypnout, pak řádek při psaní zůstane v klidu.",
    sprechTempo: "Rychlost řeči",
    sprechTempoName: "Rychlost řeči",
    langsam: "pomalu",
    normal: "normálně",
    schnell: "rychle",
    sehrSchnell: "velmi rychle",
    stimme: "Hlas",
    stimmeHinweis:
      "Který hlas nainstalovaný v tomto zařízení předčítá - text na cvičení i hlášení. Možnost automaticky vybere vhodný hlas sama. Když je hlas moc tichý nebo nezřetelně vyslovuje ě, ř nebo ů, vyber tady jiný.",
    automatisch: "automaticky",
    kontoTitel: "Můj účet",
    zugangsdaten: "Moje přihlašovací údaje",
    kontoBestaetigt:
      "Změnit e-mailovou adresu nebo heslo - a odstranit účet, když ho už nepotřebuješ.",
    kontoUnbestaetigt:
      "⚠️ Tvoje e-mailová adresa ještě není potvrzená - do té doby nepřijde týdenní přehled. Tady si můžeš vyžádat nový potvrzovací odkaz nebo adresu změnit.",
    einrichtungTitel: "Úvodní nastavení",
    einrichtungNeu: " Spustit úvodní nastavení znovu",
    einrichtungTitelAttr:
      "Provede tě krok za krokem věkem, jazykem, klávesnicí, zvukem a předčítáním (Alt + R)",
    einrichtungSatz: "Krok za krokem všemi nastaveními. Také klávesami Alt + R.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      uebungsartTitel: "Какво упражняваш?",
      uebungsart: "Вид упражнение",
      modusAdaptiv: "Моята тренировка",
      modusBuecherei: "Истории",
      modusWortspiele: "Игри с думи",
      satzAdaptiv: " упражнява точно клавишите, които още са несигурни.",
      satzBuecherei: " са цели текстове, част по част.",
      satzWortspiele: (k: string) => [" е рафт - вземи си каквото ти харесва. Можеш да превключваш между тях и с ", k, "."],
      texteTitel: "Текстове",
      klassenStufeRest: " - това е настроено от учителя за целия клас.",
      textstufeHinweis: (fortschritt: string) =>
        `За каква възраст са думите и текстовете. Важи от следващия кръг - „${fortschritt}“ и напредъкът по клавишите остават същите.`,
      textstufeName: "Текстове за възраст",
      geburtsjahr: "Година на раждане",
      geburtsjahrHinweis:
        "Само годината. Ако е попълнена и никой не е избрал възраст ръчно, текстовете растат заедно с теб. Ръчно избраната възраст остава.",
      geburtsjahrBeispiel: "напр. 2016",
      sprache: "Език",
      spracheGesperrt: "Езикът е определен за теб от учителя.",
      spracheHinweis: "Езикът на думите и текстовете, с които се упражняваш. Важи от следващия кръг.",
      spracheHaupt: (name: string) =>
        `Езикът на този курс: ${name}. Можеш да се упражняваш и на английски - клавишите пак идват в реда на този курс.`,
      spracheName: "Език на текстовете",
      tastaturTitel: "Клавиатура",
      meineTastatur: "Моята клавиатура",
      tastaturHinweis:
        "Според нея се настройват екранната клавиатура, съобщенията за пръстите и знаците, които упражняваш.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Този курс учи клавиатурата на своята страна - затова за избор има само ${tastaturDesLandes("bg", weg)} клавиатури. Настроената клавиатура „${name}“ не подхожда.`,
      tastaturName: "Клавиатурна подредба",
      anfangen: "Откъде започваш?",
      anfangenHinweis:
        "Ако вече можеш да пишеш, не е нужно да започваш от първите два клавиша - а ако началото е твърде високо, просто го върни назад. Важи веднага за „Моята тренировка“ - статистиката и значките остават.",
      anfangenName: "Начална точка в курса",
      tempoTitel: "Скорост",
      zeitLassen: (an: boolean) => (an ? "Спокойно: вкл." : "Спокойно: изкл."),
      zeitLassenTitel:
        "Без ограничение на времето в играта, без цел за скорост при звездичките. Брои се само колко внимателно пишеш.",
      zeitLassenSelbst:
        "При „Спокойно“ скоростта не се брои никъде: играта е без часовник, звездичките идват само от внимателното писане, а времето за упражнения се брои и при дълги паузи.",
      zeitLassenVonLehrkraftAn:
        "„Спокойно“ е включено за теб от учителя: скоростта не се брои никъде - само колко внимателно пишеш.",
      zeitLassenVonLehrkraftAus:
        "„Спокойно“ се настройва от учителя. Тогава скоростта не се брои никъде, а само колко внимателно пишеш.",
      abstandTitel: "Разстояние между знаците (CVI)",
      abstandName: "По-голямо разстояние между знаците (CVI)",
      abstandHinweis:
        "Повече място между ВСЕКИ два знака при преписване - за деца с церебрално зрително увреждане (CVI), при които близко стоящите знаци се сливат. Докато пишеш, всичко освен полето, в което пишеш (реда за упражнение или полето на играта), потъмнява - след 5 секунди без писане отново става светло. Редът за упражнение се придвижва плавно към следващия знак с твоето темпо на писане, вместо да скача. Когато въпрос в упражненията със загадки заеме няколко реда, светъл остава само един ред („Ред за четене“) - със стрелка надолу и стрелка нагоре се минава между редовете. „Единично“ оставя знаците на обичайното им разстояние и включва само потъмняването, плавното придвижване на реда и реда за четене. Можеш да го промениш тук по всяко време, колкото пъти искаш. Ако си в клас, може да го настрои и учителят - важи това, което е избрано последно.",
      einhand: (an: boolean) => `Писане с една ръка: ${an ? "вкл." : "изкл."}`,
      einhandHinweis:
        "За всички, които пишат с една ръка: главните букви и символите тогава важат с всеки от двата клавиша Shift - не само с този на другата ръка.",
      wochenzielTitel: "Моята седмична цел",
      wochenzielName: "Минути на седмица",
      wochenzielHinweis:
        "Колко минути искаш да се упражняваш всяка седмица. Седмицата започва в понеделник в 8:00. Новата цел важи от следващия понеделник - текущата седмица запазва целта си. Състоянието ти показва кръгът под полето за писане.",
      keinWochenziel: "без седмична цел",
      wochenzielMinuten: (n: number) => mehrzahl(n, "bg", { one: (z) => `${z} минута`, other: (z) => `${z} минути` }),
      wochenzielAnstehend: (datum: string, minuten: number) =>
        minuten > 0
          ? `От понеделник, ${datum}, в 8:00: ${mehrzahl(minuten, "bg", { one: (z) => `${z} минута`, other: (z) => `${z} минути` })} на седмица - тази седмица остава досегашната цел.`
          : `От понеделник, ${datum}, в 8:00: без седмична цел - тази седмица остава досегашната цел.`,
      nachholen: (an: boolean) =>
        `Наваксай минутите от минали седмици: ${an ? "вкл." : "изкл."}`,
      nachholenHinweis:
        "Ако се упражняваш повече от седмичната си цел, допълнителните минути попълват неизпълнените цели от по-ранни седмици - първо най-старата.",
      anzeigeTitel: "Изглед",
      fingerFarben: (an: boolean) => `Цветове на пръстите: ${an ? "вкл." : "изкл."}`,
      fingerFarbenTitel: "Клавишите в цвета на пръста, който ги натиска.",
      leerzeichen: (an: boolean) => `Показвай интервалите: ${an ? "вкл." : "изкл."}`,
      leerzeichenTitel: "Интервалите в реда като ␣. Изкл.: празно място.",
      grosseTastatur: (an: boolean) => `Голяма клавиатура (с цифров блок): ${an ? "вкл." : "изкл."}`,
      grosseTastaturHinweis:
        "Показва до обичайната екранна клавиатура и цифровия блок - а ако има достатъчно място, и клавишите Insert, Home, Page Up, Page Down, End и стрелките. Включва се сама, щом натиснеш клавиш от цифровия блок. Ако я изключиш тук ръчно, остава изключена, докато не я включиш тук отново.",
      grosseTastaturAnsage: (an: boolean) => `Голяма клавиатура: ${an ? "включена" : "изключена"}.`,
      groesse: "Размер на полето за писане",
      kleiner: "По-малко поле за писане",
      groesser: "По-голямо поле за писане",
      groesseName: (p: number) => `Поле за писане: ${p}%`,
      groesseZahl: (p: number) => [p, "%"],
      groesseHinweis:
        "Работи и докато се упражняваш: Alt и плюс, Alt и минус. Увеличава само полето за писане - за цялата страница има Ctrl и плюс.",
      spielTitel: "Игра за награда",
      nachNeuerTaste: "След нов клавиш",
      spielHinweis:
        "Дали след отключен клавиш ще ти бъде предложена кратка игра. Можеш да избираш: Без игра - това е по подразбиране, или Ледени късове - Полярната експедиция с пингвина. По желание - клавишът и без това е твой. Важи за това устройство.",
      spielName: "Игра за награда след нов клавиш",
      spielSatz1: "По подразбиране е ",
      spielSatz2: ": новият клавиш и без това е твой, празнува се и после продължаваш. Играта ",
      spielSatz3: " е Полярната експедиция с пингвина - по желание, и не се брои като време за упражнения.",
      tonTitel: "Звук",
      ton: (aus: boolean) => (aus ? "Звук: изкл." : "Звук: вкл."),
      tonHinweis: "Включва или изключва всички звуци на програмата - награди, звуци при грешка и тракането при писане.",
      klickName: "Звук при натискане на клавиш",
      klick: "Тракане на клавишите",
      klickTitel: "Тихо тракане при всеки правилно натиснат клавиш",
      melodie: "Мелодия при писане",
      melodieHinweis: "Упражнява равномерен ритъм на писане и е забавно - който пише равномерно, пише по-плавно и по-слабите клавиши. Всеки правилен клавиш свири следващия тон от песен. При равномерно писане се включва и цяла музикална група. При четене на глас мелодията звучи само в дясното ухо. Клавишна комбинация: Alt + 6, смяна на звука с Alt + 7 и Alt + 8.",
      melodieKlang: "Звук",
      melodieLied: "Песен",
      vorlesenTitel: "Четене на глас",
      vorlesen: (an: boolean) => (an ? "Четене на глас: вкл." : "Четене на глас: изкл."),
      vorlesenTitelAttr:
        "Програмата чете на глас (за тези, които учат без екранен четец). Ако работи екранен четец, по-добре го остави изключено.",
      strg: "Ctrl",
      strgSatz: " спира гласа веднага - навсякъде, дори по средата на изречението. Следващото съобщение отново се чува.",
      wasGelesen: "Какво се чете на глас (може повече от едно)",
      liest: "чете:",
      woerter: "Думи",
      woerterTitel: "Всяка дума се чете, когато започнеш да я пишеш.",
      saetze: "Изречения",
      saetzeTitel: "В началото на реда целият ред се чете като изречение.",
      buchstabieren: "Клавиш по клавиш",
      buchstabierenAnsage: (an: boolean) => `Клавиш по клавиш: ${an ? "включено" : "изключено"}.`,
      buchstabierenTitel:
        "След всеки натиснат клавиш се казва следващият - за всички, които само слушат. При изключено четене на глас го казва екранният четец: в началото на реда цялото изречение, в началото на думата думата, после клавишите. С брайлов дисплей: изключено, тогава редът остава спокоен, докато пишеш.",
      sprechTempo: "Скорост на говора",
      sprechTempoName: "Скорост на говора",
      langsam: "бавно",
      normal: "нормално",
      schnell: "бързо",
      sehrSchnell: "много бързо",
      stimme: "Глас",
      stimmeHinweis:
        "Кой от инсталираните на това устройство гласове чете - както текста за упражнение, така и съобщенията. „Автоматично“ избира подходящ глас. Ако гласът е твърде тих или звучи неясно, избери друг тук.",
      automatisch: "автоматично",
      kontoTitel: "Моят акаунт",
      zugangsdaten: "Моите данни за вход",
      kontoBestaetigt:
        "Промени имейл адреса или паролата - и изтрий акаунта, когато вече не ти трябва.",
      kontoUnbestaetigt:
        "⚠️ Имейл адресът ти още не е потвърден - дотогава не се изпраща седмичен отчет. Тук можеш да поискаш нова връзка или да промениш адреса.",
      einrichtungTitel: "Първоначална настройка",
      einrichtungNeu: " Започни настройката отначало",
      einrichtungTitelAttr:
        "Превежда те стъпка по стъпка през възраст, език, клавиатура, звук и четене на глас (Alt + R)",
      einrichtungSatz: "Стъпка по стъпка през всички настройки. И с Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      uebungsartTitel: "Τι εξασκείς;",
      uebungsart: "Είδος άσκησης",
      modusAdaptiv: "Η εξάσκησή μου",
      modusBuecherei: "Ιστορίες",
      modusWortspiele: "Παιχνίδια λέξεων",
      satzAdaptiv: " εξασκεί ακριβώς τα πλήκτρα που είναι ακόμα αβέβαια.",
      satzBuecherei: " είναι ολόκληρα κείμενα, μέρος μέρος.",
      satzWortspiele: (k: string) => [" είναι ένα ράφι - διάλεξε ό,τι σου αρέσει. Μπορείς επίσης να αλλάζεις από το ένα στο άλλο με ", k, "."],
      texteTitel: "Κείμενα",
      klassenStufeRest: " - την έχουν ορίσει οι εκπαιδευτικοί σου για όλο το τμήμα.",
      textstufeHinweis: (fortschritt: string) =>
        `Για ποια ηλικία είναι οι λέξεις και τα κείμενα. Ισχύει από τον επόμενο γύρο. Δεν αλλάζουν: ${fortschritt} και πρόοδος μάθησης.`,
      textstufeName: "Κείμενα για ηλικίες",
      geburtsjahr: "Έτος γέννησης",
      geburtsjahrHinweis:
        "Μόνο το έτος. Αν είναι συμπληρωμένο και δεν έχει επιλεγεί ηλικία με το χέρι, τα κείμενα μεγαλώνουν μαζί σου. Μια ηλικία που επιλέχθηκε με το χέρι μένει όπως είναι.",
      geburtsjahrBeispiel: "π.χ. 2016",
      sprache: "Γλώσσα",
      spracheGesperrt: "Οι εκπαιδευτικοί σου έχουν ορίσει τη γλώσσα για σένα.",
      spracheHinweis: "Η γλώσσα των λέξεων και των κειμένων εξάσκησης. Ισχύει από τον επόμενο γύρο.",
      spracheHaupt: (name: string) =>
        `Η γλώσσα αυτής της διαδρομής μάθησης: ${name}. Μπορείς να εξασκηθείς και στα Αγγλικά - τα πλήκτρα έρχονται όμως με τη σειρά αυτής της διαδρομής.`,
      spracheName: "Γλώσσα των κειμένων",
      tastaturTitel: "Πληκτρολόγιο",
      meineTastatur: "Το πληκτρολόγιό μου",
      tastaturHinweis:
        "Από αυτό εξαρτώνται το πληκτρολόγιο οθόνης, οι οδηγίες για τα δάχτυλα και οι χαρακτήρες που εξασκείς.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Αυτή η διαδρομή μάθησης διδάσκει το πληκτρολόγιο της χώρας της, έτσι προσφέρονται μόνο ${tastaturDesLandes("el", weg)} πληκτρολόγια. Το πληκτρολόγιο που έχει οριστεί, «${name}», δεν ταιριάζει.`,
      tastaturName: "Διάταξη πληκτρολογίου",
      anfangen: "Από πού ξεκινάς;",
      anfangenHinweis:
        "Αν ξέρεις ήδη να γράφεις, δεν χρειάζεται να ξεκινήσεις από το Φ και το Ξ - και αν ξεκίνησες πολύ ψηλά, απλώς γύρισέ το πίσω. Ισχύει αμέσως για την «Η εξάσκησή μου». Τα στατιστικά και τα μετάλλια μένουν.",
      anfangenName: "Σημείο εκκίνησης στην ύλη",
      tempoTitel: "Ταχύτητα",
      zeitLassen: (an: boolean) => (an ? "Με την ησυχία σου: ενεργό" : "Με την ησυχία σου: ανενεργό"),
      zeitLassenTitel:
        "Χωρίς όριο χρόνου στο παιχνίδι, χωρίς στόχο ταχύτητας για τα αστέρια. Μετράει μόνο η προσοχή.",
      zeitLassenSelbst:
        "Με το «Με την ησυχία σου» η ταχύτητα δεν μετράει πουθενά: το παιχνίδι τρέχει χωρίς ρολόι, τα αστέρια έρχονται μόνο από την προσοχή, και ο χρόνος εξάσκησης συνεχίζει να μετράει και στις μεγάλες παύσεις.",
      zeitLassenVonLehrkraftAn:
        "Οι εκπαιδευτικοί σου ενεργοποίησαν για σένα το «Με την ησυχία σου»: η ταχύτητα δεν μετράει πουθενά - μόνο πόσο προσεκτικά γράφεις.",
      zeitLassenVonLehrkraftAus:
        "Το «Με την ησυχία σου» το ορίζουν οι εκπαιδευτικοί σου. Όταν είναι ενεργό, η ταχύτητα δεν μετράει πουθενά - μόνο πόσο προσεκτικά γράφεις.",
      abstandTitel: "Απόσταση γραμμάτων (CVI)",
      abstandName: "Μεγαλύτερη απόσταση γραμμάτων (CVI)",
      abstandHinweis:
        "Περισσότερος χώρος ανάμεσα σε ΚΑΘΕ χαρακτήρα όταν αντιγράφεις το κείμενο - για παιδιά με εγκεφαλική οπτική αναπηρία (CVI), για τα οποία οι χαρακτήρες που είναι κοντά ο ένας στον άλλο μπερδεύονται. Όσο γράφεις, σκουραίνουν όλα εκτός από το πεδίο όπου γράφεις (τη γραμμή εξάσκησης ή τον χώρο του παιχνιδιού). Μετά από 5 δευτερόλεπτα χωρίς πάτημα φωτίζονται πάλι. Η γραμμή εξάσκησης γλιστρά στον επόμενο χαρακτήρα με τον δικό σου ρυθμό γραφής, αντί να πηδά. Αν μια ερώτηση με πολλές γραμμές στις ασκήσεις-γρίφους αλλάζει γραμμή, μένει επιπλέον φωτεινή μόνο μία γραμμή (η «γραμμή ανάγνωσης») - με το Κάτω βέλος και το Επάνω βέλος πηγαίνεις από γραμμή σε γραμμή. Η επιλογή «Απλή» αφήνει τους χαρακτήρες στη συνηθισμένη τους απόσταση και ενεργοποιεί μόνο το σκούρεμα, το γλίστρημα της γραμμής και τη γραμμή ανάγνωσης. Μπορείς να την αλλάξεις εδώ μόνο σου όποτε θέλεις, όσες φορές θέλεις. Αν ανήκεις σε τμήμα, μπορούν να την ορίσουν και οι εκπαιδευτικοί σου - ισχύει ό,τι επιλέχθηκε τελευταίο.",
      einhand: (an: boolean) => `Γραφή με ένα χέρι: ${an ? "ενεργή" : "ανενεργή"}`,
      einhandHinweis:
        "Για όλους όσοι γράφουν με ένα χέρι: τα κεφαλαία και τα σύμβολα μετράνε τότε με οποιοδήποτε Shift - όχι μόνο με αυτό του άλλου χεριού.",
      wochenzielTitel: "Ο εβδομαδιαίος στόχος μου",
      wochenzielName: "Λεπτά την εβδομάδα",
      wochenzielHinweis:
        "Πόσα λεπτά θέλεις να εξασκείσαι κάθε εβδομάδα. Η εβδομάδα ξεκινά τη Δευτέρα στις 8:00. Ένας νέος στόχος ισχύει από την επόμενη Δευτέρα - η τρέχουσα εβδομάδα κρατά τον στόχο της. Πόσο έχεις προχωρήσει, το δείχνει ο κύκλος κάτω από το πεδίο γραφής.",
      keinWochenziel: "χωρίς εβδομαδιαίο στόχο",
      wochenzielMinuten: (n: number) => mehrzahl(n, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` }),
      wochenzielAnstehend: (datum: string, minuten: number) =>
        minuten > 0
          ? `Από τη Δευτέρα ${datum}, 8:00: ${mehrzahl(minuten, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` })} την εβδομάδα - αυτή η εβδομάδα κρατά τον στόχο που είχε.`
          : `Από τη Δευτέρα ${datum}, 8:00: χωρίς εβδομαδιαίο στόχο - αυτή η εβδομάδα κρατά τον στόχο που είχε.`,
      nachholen: (an: boolean) =>
        `Αναπλήρωση λεπτών από προηγούμενες εβδομάδες: ${an ? "ενεργή" : "ανενεργή"}`,
      nachholenHinweis:
        "Αν εξασκείσαι περισσότερο από τον εβδομαδιαίο στόχο σου, τα επιπλέον λεπτά συμπληρώνουν ανοιχτούς στόχους παλαιότερων εβδομάδων - πρώτα τον παλαιότερο.",
      anzeigeTitel: "Εμφάνιση",
      fingerFarben: (an: boolean) => `Χρώματα δαχτύλων: ${an ? "ενεργά" : "ανενεργά"}`,
      fingerFarbenTitel: "Τα πλήκτρα στο χρώμα του δαχτύλου που τα πατά.",
      leerzeichen: (an: boolean) => `Εμφάνιση κενών: ${an ? "ενεργή" : "ανενεργή"}`,
      leerzeichenTitel: "Τα κενά της γραμμής ως ␣. Ανενεργή: απλό κενό.",
      grosseTastatur: (an: boolean) => `Μεγάλο πληκτρολόγιο (με αριθμητικό πληκτρολόγιο): ${an ? "ενεργό" : "ανενεργό"}`,
      grosseTastaturHinweis:
        "Δείχνει δίπλα στο συνηθισμένο πληκτρολόγιο οθόνης και το αριθμητικό πληκτρολόγιο - και, αν υπάρχει αρκετός χώρος, τα πλήκτρα Insert, Home, Page Up, Page Down, End και τα πλήκτρα βέλους. Ενεργοποιείται μόνο του μόλις πατηθεί ένα πλήκτρο του αριθμητικού πληκτρολογίου. Αν το απενεργοποιήσεις εδώ, μένει ανενεργό μέχρι να το ενεργοποιήσεις ξανά εδώ.",
      grosseTastaturAnsage: (an: boolean) => `Μεγάλο πληκτρολόγιο ${an ? "ενεργό" : "ανενεργό"}.`,
      groesse: "Μέγεθος πεδίου γραφής",
      kleiner: "Μικρότερο πεδίο γραφής",
      groesser: "Μεγαλύτερο πεδίο γραφής",
      groesseName: (p: number) => `Πεδίο γραφής ${p} τοις εκατό`,
      groesseZahl: (p: number) => [p, "%"],
      groesseHinweis:
        "Λειτουργεί και την ώρα της εξάσκησης: Alt και συν, Alt και πλην. Μεγαλώνει μόνο το πεδίο γραφής - για όλη τη σελίδα υπάρχει το Ctrl και συν.",
      spielTitel: "Παιχνίδι-επιβράβευση",
      nachNeuerTaste: "Μετά από νέο πλήκτρο",
      spielHinweis:
        "Αν μετά από ένα πλήκτρο που ξεκλείδωσες σου προτείνεται ένα σύντομο παιχνίδι. Μπορείς να διαλέξεις: Κανένα - αυτή είναι η προεπιλογή. Ή τα Παγοκομμάτια, την Πολική εξερεύνηση με τον πιγκουίνο. Είναι προαιρετικό - το πλήκτρο είναι έτσι κι αλλιώς δικό σου. Ισχύει για αυτή τη συσκευή.",
      spielName: "Παιχνίδι-επιβράβευση μετά από νέο πλήκτρο",
      spielSatz1: "Η προεπιλογή είναι ",
      spielSatz2: ": το νέο πλήκτρο είναι έτσι κι αλλιώς δικό σου, το γιορτάζουμε, και μετά συνεχίζεις. Το παιχνίδι ",
      spielSatz3: " είναι η Πολική εξερεύνηση με τον πιγκουίνο - είναι προαιρετικό και δεν μετράει ως χρόνος εξάσκησης.",
      tonTitel: "Ήχος",
      ton: (aus: boolean) => (aus ? "Ήχος: ανενεργός" : "Ήχος: ενεργός"),
      tonHinweis: "Ενεργοποιεί ή απενεργοποιεί όλους τους ήχους του προγράμματος - επιβραβεύσεις, ήχους λάθους και τον ήχο των πλήκτρων.",
      klickName: "Ήχος πλήκτρων",
      klick: "Ήχος πατήματος",
      klickTitel: "Ένας απαλός ήχος σε κάθε σωστό πάτημα",
      melodie: "Μελωδία την ώρα της γραφής",
      melodieHinweis: "Εξασκεί έναν σταθερό ρυθμό γραφής και είναι διασκεδαστικό - με σταθερό ρυθμό γίνονται πιο άνετα και τα πιο δύσκολα πλήκτρα. Κάθε σωστό πλήκτρο παίζει την επόμενη νότα ενός τραγουδιού. Αν γράφεις με σταθερό ρυθμό, έρχεται και μια μπάντα. Με την Εκφώνηση ενεργή, η μελωδία ακούγεται μόνο στο δεξί αυτί. Συντόμευση: Alt + 6, αλλαγή ήχου με Alt + 7 και Alt + 8.",
      melodieKlang: "Ήχος",
      melodieLied: "Τραγούδι",
      vorlesenTitel: "Εκφώνηση",
      vorlesen: (an: boolean) => (an ? "Εκφώνηση: ενεργή" : "Εκφώνηση: ανενεργή"),
      vorlesenTitelAttr:
        "Το πρόγραμμα διαβάζει δυνατά (για όσους δεν χρησιμοποιούν αναγνώστη οθόνης). Αν λειτουργεί αναγνώστης οθόνης, καλύτερα άφησέ την ανενεργή.",
      strg: "Ctrl",
      strgSatz: " σταματά αμέσως τη φωνή - παντού, ακόμα και στη μέση μιας πρότασης. Η επόμενη ανακοίνωση ακούγεται ξανά κανονικά.",
      wasGelesen: "Τι διαβάζεται (μπορείς να επιλέξεις περισσότερα από ένα)",
      liest: "διαβάζει:",
      woerter: "Λέξεις",
      woerterTitel: "Διαβάζει κάθε λέξη μόλις την αρχίζεις.",
      saetze: "Προτάσεις",
      saetzeTitel: "Στην αρχή της γραμμής διαβάζει όλη τη γραμμή ως πρόταση.",
      buchstabieren: "Πλήκτρο πλήκτρο",
      buchstabierenAnsage: (an: boolean) => `Πλήκτρο πλήκτρο: ${an ? "ενεργό" : "ανενεργό"}.`,
      buchstabierenTitel:
        "Μετά από κάθε πάτημα ανακοινώνει το επόμενο πλήκτρο - για όλους όσοι μόνο ακούν. Με την Εκφώνηση ανενεργή το λέει ο αναγνώστης οθόνης: στην αρχή της γραμμής όλη την πρόταση, στην αρχή της λέξης τη λέξη, μετά τα πλήκτρα. Με οθόνη braille: ανενεργό, για να μένει ήσυχη η γραμμή όσο γράφεις.",
      // Nicht „Ταχύτητα" - so heißt schon die Gruppe weiter oben (Με την ησυχία σου).
      sprechTempo: "Ρυθμός ομιλίας",
      sprechTempoName: "Ρυθμός ομιλίας",
      langsam: "αργός",
      normal: "κανονικός",
      schnell: "γρήγορος",
      sehrSchnell: "πολύ γρήγορος",
      stimme: "Φωνή",
      stimmeHinweis:
        "Ποια φωνή εγκατεστημένη σε αυτή τη συσκευή διαβάζει - για το κείμενο εξάσκησης όπως και για τα μηνύματα. Η επιλογή «αυτόματα» βρίσκει μόνη της μια κατάλληλη φωνή. Αν μια φωνή είναι πολύ σιγανή ή δεν ακούγεται καθαρά στα γράμματα με τόνο, διάλεξε εδώ άλλη.",
      automatisch: "αυτόματα",
      kontoTitel: "Ο λογαριασμός μου",
      zugangsdaten: "Τα στοιχεία σύνδεσής μου",
      kontoBestaetigt:
        "Αλλαγή διεύθυνσης e-mail ή κωδικού πρόσβασης - και διαγραφή του λογαριασμού, όταν δεν τον χρειάζεσαι πια.",
      kontoUnbestaetigt:
        "⚠️ Η διεύθυνση e-mail σου δεν έχει επιβεβαιωθεί ακόμα - μέχρι τότε δεν έρχεται εβδομαδιαία αναφορά. Εδώ μπορείς να ζητήσεις νέο σύνδεσμο ή να αλλάξεις τη διεύθυνση.",
      // Wie en: kein griechischer Einführungs-Podcast - die Gruppe heißt nur nach dem, was darin steht.
      einrichtungTitel: "Αρχικές ρυθμίσεις",
      einrichtungNeu: " Αρχικές ρυθμίσεις ξανά από την αρχή",
      einrichtungTitelAttr:
        "Σε οδηγεί βήμα βήμα σε ηλικία, γλώσσα, πληκτρολόγιο, ήχο και εκφώνηση (Alt + R)",
      einrichtungSatz: "Βήμα βήμα σε όλες τις ρυθμίσεις. Και με Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      uebungsartTitel: "Mit gyakorolsz?",
      uebungsart: "Gyakorlattípus",
      modusAdaptiv: "Saját gyakorlás",
      modusBuecherei: "Történetek",
      modusWortspiele: "Szójátékok",
      satzAdaptiv: " pontosan azokat a billentyűket gyakoroltatja, amelyek még bizonytalanok.",
      satzBuecherei: " egész szövegek, részről részre.",
      satzWortspiele: (k: string) => [" egy polc - vedd le róla, amit szeretsz. Sorban váltani is lehet: ", k, "."],
      texteTitel: "Szövegek",
      klassenStufeRest: " - ezt a tanárod állította be az egész osztálynak.",
      // ${fortschritt} ohne Artikel und ohne Endung (Glossar hu Regel 12).
      textstufeHinweis: (fortschritt: string) =>
        `Milyen életkorhoz illenek a szavak és a szövegek. A következő körtől érvényes; változatlan marad: ${fortschritt}, és a haladásod is.`,
      textstufeName: "Szövegek életkora",
      geburtsjahr: "Születési év",
      geburtsjahrHinweis:
        "Csak az évszám. Ha meg van adva, és senki nem választott kézzel életkort, a szövegek veled együtt nőnek. A kézzel választott életkor érvényes marad.",
      geburtsjahrBeispiel: "pl. 2016",
      sprache: "Nyelv",
      spracheGesperrt: "A nyelvet a tanárod rögzítette neked.",
      spracheHinweis: "A gyakorló szavak és szövegek nyelve. A következő körtől érvényes.",
      spracheHaupt: (name: string) =>
        `Ennek a tanfolyamnak a nyelve: ${name}. Angolul is gyakorolhatsz - a billentyűk akkor is ennek a tanfolyamnak a sorrendjében jönnek.`,
      spracheName: "A szövegek nyelve",
      tastaturTitel: "Billentyűzet",
      meineTastatur: "A billentyűzetem",
      tastaturHinweis:
        "Ehhez igazodik a képernyő-billentyűzet, az ujjakra vonatkozó bemondások, és az, hogy milyen jeleket gyakorolsz.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Ez a tanfolyam a saját országa billentyűzetét tanítja - ezért csak ${tastaturDesLandes("hu", weg)} billentyűzetek közül választhatsz. A beállított billentyűzet („${name}”) nem illik hozzá.`,
      tastaturName: "Billentyűzetkiosztás",
      anfangen: "Honnan kezded?",
      anfangenHinweis:
        "Aki már tud gépelni, annak nem kell az F és a J billentyűnél kezdenie - aki pedig túl magasan kezdett, egyszerűen visszaállítja. A „Saját gyakorlás” részre azonnal érvényes; a statisztika és a jelvények megmaradnak.",
      anfangenName: "Kiindulópont a tananyagban",
      tempoTitel: "Sebesség",
      zeitLassen: (an: boolean) => (an ? "Nyugodtan: be" : "Nyugodtan: ki"),
      zeitLassenTitel:
        "Nincs időkorlát a játékban, nincs sebességcél a csillagoknál. Csak a gondosság számít.",
      zeitLassenSelbst:
        "A „Nyugodtan” beállítással sehol sem számít a sebesség: a játék óra nélkül megy, a csillagok csak a gondosságért járnak, és a gyakorlási idő hosszú szünetekben is tovább számol.",
      zeitLassenVonLehrkraftAn:
        "A tanárod bekapcsolta neked a „Nyugodtan” beállítást: sehol sem számít a sebesség - csak az, hogy milyen gondosan gépelsz.",
      zeitLassenVonLehrkraftAus:
        "A „Nyugodtan” beállítást a tanárod kapcsolja be. Ha be van kapcsolva, sehol sem számít a sebesség - csak az, hogy milyen gondosan gépelsz.",
      abstandTitel: "Betűköz (CVI)",
      abstandName: "Nagyobb betűköz (CVI)",
      abstandHinweis:
        "Nagyobb köz MINDEN karakter között másoláskor - a cerebrális látássérüléssel (CVI) élő gyerekeknek, akiknél a szorosan álló karakterek összefolynak. Gépelés közben minden elsötétül, kivéve azt a mezőt, amelyben éppen gépelsz (gyakorlósor vagy játéktér); 5 másodperc gépelés nélkül újra világos lesz. A gyakorlósor közben a gépelésed ütemében siklik a következő karakterhez, nem ugrik. Ha a rejtvényes gyakorlatokban egy többsoros kérdés több sorba tördelődik, emellett csak egy sor marad világos (az „Olvasósor”) - a le nyíl és a fel nyíl billentyűvel lehet a sorok között váltani. Az „egyszeres” a karaktereket a megszokott közzel hagyja, és csak az elsötétítést, a sor siklását és az Olvasósort kapcsolja be. Itt bármikor magad is átállíthatod, ahányszor csak akarod. Ha egy osztályhoz tartozol, a tanárod is beállíthatja - az érvényes, amit utoljára választottak.",
      einhand: (an: boolean) => `Gépelés egy kézzel: ${an ? "be" : "ki"}`,
      einhandHinweis:
        "Mindenkinek, aki egy kézzel gépel: a nagybetűk és a különleges jelek ilyenkor bármelyik Shift billentyűvel érvényesek - nem csak a másik kéz oldalán lévővel.",
      wochenzielTitel: "Heti célom",
      wochenzielName: "Perc hetente",
      wochenzielHinweis:
        "Ennyi percet szeretnél hetente gyakorolni. A hét hétfőn 8:00-kor kezdődik. Az új cél a következő hétfőtől érvényes - a folyamatban lévő hét megtartja a célját. Az állásodat a gépelési mező alatti kör mutatja.",
      keinWochenziel: "nincs heti cél",
      wochenzielMinuten: (n: number) => `${n} perc`,
      // ${datum} in Klammern - keine selbst gebildete Endung am Datum (Glossar hu §4 Falle 7).
      wochenzielAnstehend: (datum: string, minuten: number) =>
        minuten > 0
          ? `A következő hétfőtől (${datum}, 8:00): heti ${minuten} perc - ezen a héten a korábbi cél marad.`
          : `A következő hétfőtől (${datum}, 8:00): nincs heti cél - ezen a héten a korábbi cél marad.`,
      nachholen: (an: boolean) =>
        `Elmaradt percek pótlása az előző hetekről: ${an ? "be" : "ki"}`,
      nachholenHinweis:
        "Ha többet gyakorolsz a heti célodnál, a többletpercek a korábbi hetek nyitott céljait töltik fel - a legrégebbit először.",
      anzeigeTitel: "Megjelenítés",
      fingerFarben: (an: boolean) => `Ujjszínek: ${an ? "be" : "ki"}`,
      fingerFarbenTitel: "A billentyűk annak az ujjnak a színében, amelyik lenyomja őket.",
      leerzeichen: (an: boolean) => `Szóközök mutatása: ${an ? "be" : "ki"}`,
      leerzeichenTitel: "A sor szóközei ␣ jellel. Ki: üres hely.",
      grosseTastatur: (an: boolean) => `Nagy billentyűzet (numerikus billentyűzettel): ${an ? "be" : "ki"}`,
      grosseTastaturHinweis:
        "A szokásos képernyő-billentyűzet mellett a numerikus billentyűzetet is mutatja - és ha van elég hely, az Insert, Home, Page Up, Page Down, End és a nyílbillentyűket is. Magától bekapcsol, amint a numerikus billentyűzet egyik billentyűjét megnyomod. Ha itt kézzel kikapcsolod, kikapcsolva marad, amíg itt újra be nem kapcsolod.",
      grosseTastaturAnsage: (an: boolean) => `Nagy billentyűzet: ${an ? "be" : "ki"}.`,
      groesse: "A gépelési mező mérete",
      kleiner: "Gépelési mező kisebbre",
      groesser: "Gépelési mező nagyobbra",
      groesseName: (p: number) => `Gépelési mező: ${p}%`,
      groesseZahl: (p: number) => [p, "%"],
      groesseHinweis:
        "Gyakorlás közben is működik: Alt és plusz, Alt és mínusz. Csak a gépelési mezőt nagyítja - az egész oldalhoz a Ctrl és plusz való.",
      spielTitel: "Jutalomjáték",
      nachNeuerTaste: "Új billentyű után",
      spielHinweis:
        "Felajánljon-e a program egy rövid játékot egy billentyű feloldása után. Választható: Nincs - ez az alapbeállítás; vagy a Jégtáblák játék, a Sarki expedíció a pingvinnel. Önkéntes; a billentyű így is a tiéd. Erre az eszközre érvényes.",
      spielName: "Jutalomjáték új billentyű után",
      spielSatz1: "Az alapbeállítás: ",
      spielSatz2: " - az új billentyű így is a tiéd, megünnepeljük, aztán folytatod. A ",
      spielSatz3: " a Sarki expedíció a pingvinnel - önkéntes, és nem számít bele a gyakorlási időbe.",
      tonTitel: "Hang",
      ton: (aus: boolean) => (aus ? "Hang ki" : "Hang be"),
      tonHinweis: "A program összes hangját be- vagy kikapcsolja - a jutalmakat, a hibahangokat és a gépelési kattanást.",
      klickName: "Billentyűkattanás hangja",
      klick: "Billentyűkattogás",
      klickTitel: "Halk kattanás minden helyes leütésnél",
      melodie: "Dallam gépelés közben",
      melodieHinweis: "Egyenletes gépelési ritmust gyakoroltat, és szórakoztató - aki egyenletesen gépel, a gyengébb billentyűknél is folyékonyabb lesz. Minden helyes billentyű egy dal következő hangját szólaltatja meg. Aki egyenletesen gépel, egy zenekart is kap hozzá. Felolvasás mellett a dallam csak a jobb fülben szól. Billentyűparancs: Alt + 6, a hangzás váltása: Alt + 7 és Alt + 8.",
      melodieKlang: "Hangzás",
      melodieLied: "Dal",
      vorlesenTitel: "Felolvasás",
      vorlesen: (an: boolean) => (an ? "Felolvasás: be" : "Felolvasás: ki"),
      vorlesenTitelAttr:
        "A program felolvas (azoknak, akik nem használnak képernyőolvasót). Ha fut a képernyőolvasó, jobb kikapcsolva hagyni.",
      strg: "Ctrl",
      strgSatz: " azonnal elhallgattatja a hangot - bárhol, akár mondat közben is. A következő bemondás újra megszólal.",
      wasGelesen: "Mit olvasson fel (több is választható)",
      liest: "felolvas:",
      woerter: "Szavak",
      woerterTitel: "Minden szót felolvas, amikor elkezded.",
      saetze: "Mondatok",
      saetzeTitel: "A sor elején az egész sort mondatként felolvassa.",
      buchstabieren: "Billentyűnként",
      buchstabierenAnsage: (an: boolean) => `Billentyűnként: ${an ? "be" : "ki"}.`,
      buchstabierenTitel:
        "Minden leütés után bemondja a következő billentyűt - mindenkinek, aki csak hallás alapján gépel. Ha a Felolvasás ki van kapcsolva, a képernyőolvasó mondja: a sor elején az egész mondatot, a szó elején a szót, aztán a billentyűket. Braille-kijelzővel: ki, így a sor gépelés közben nyugton marad.",
      // Nicht „Sebesség" - so heisst schon die Gruppe „Nyugodtan" weiter oben (Glossar hu §4 Falle 9: Tempó = Sprechtempo).
      sprechTempo: "Beszédtempó",
      sprechTempoName: "Beszédtempó",
      langsam: "lassú",
      normal: "normál",
      schnell: "gyors",
      sehrSchnell: "nagyon gyors",
      stimme: "Hang",
      stimmeHinweis:
        "Melyik, ezen az eszközön telepített hang olvasson fel - a gyakorló szöveghez ugyanúgy, mint a visszajelzésekhez. Az „Automatikus” magától keres megfelelő hangot. Ha egy hang túl halk, vagy az ö, ő, ü, ű betűknél nem szól tisztán, válassz itt másikat.",
      automatisch: "automatikus",
      kontoTitel: "Saját fiók",
      zugangsdaten: "Belépési adataim",
      kontoBestaetigt:
        "Az e-mail-cím vagy a jelszó módosítása - és a fiók törlése, ha már nincs rá szükséged.",
      kontoUnbestaetigt:
        "⚠️ Az e-mail-címed még nincs megerősítve - addig nem érkezik heti összesítő. Itt új hivatkozást kérhetsz, vagy megváltoztathatod a címet.",
      // Wie en: kein ungarischer Einführungs-Podcast - die Gruppe heisst nach dem, was darin steht.
      einrichtungTitel: "Első beállítás",
      einrichtungNeu: " Első beállítás újra",
      einrichtungTitelAttr:
        "Lépésről lépésre végigvezet az életkoron, a nyelven, a billentyűzeten, a hangon és a felolvasáson (Alt + R)",
      einrichtungSatz: "Lépésről lépésre az összes beállításon át. Az Alt + R billentyűparanccsal is.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      uebungsartTitel: "Wat oefen je?",
      uebungsart: "Soort oefening",
      modusAdaptiv: "Mijn training",
      modusBuecherei: "Verhalen",
      modusWortspiele: "Woordspelletjes",
      satzAdaptiv: " oefent precies de toetsen die nog onzeker zijn.",
      satzBuecherei: " zijn hele teksten, deel voor deel.",
      satzWortspiele: (k: string) => [" is een plank vol spelletjes - kies wat je leuk vindt. Je kunt ook wisselen met ", k, "."],
      texteTitel: "Teksten",
      klassenStufeRest: " - je leerkracht heeft dit voor de hele klas ingesteld.",
      textstufeHinweis: (fortschritt: string) =>
        `Voor welke leeftijd de woorden en teksten bedoeld zijn. Geldt vanaf de volgende ronde - je ${fortschritt.toLowerCase()} en je voortgang blijven zoals ze zijn.`,
      textstufeName: "Teksten voor (leeftijd)",
      geburtsjahr: "Geboortejaar",
      geburtsjahrHinweis:
        "Alleen het jaartal. Staat het er en heeft niemand zelf een leeftijd gekozen, dan groeien de teksten vanzelf met je mee. Een zelf gekozen leeftijd blijft gelden.",
      geburtsjahrBeispiel: "bijvoorbeeld 2016",
      sprache: "Taal",
      spracheGesperrt: "Je leerkracht heeft de taal voor je vastgelegd.",
      spracheHinweis: "De taal van de woorden en teksten die je oefent. Geldt vanaf de volgende ronde.",
      spracheHaupt: (name: string) =>
        `De taal van deze cursus: ${name}. Je kunt daarnaast ook Engels oefenen - de toetsen komen toch in de volgorde van deze cursus.`,
      spracheName: "Taal van de teksten",
      tastaturTitel: "Toetsenbord",
      meineTastatur: "Mijn toetsenbord",
      tastaturHinweis:
        "Het schermtoetsenbord, de vingeraanwijzingen en welke tekens je oefent, hangen hiervan af.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Deze cursus leert het toetsenbord van zijn land - daarom kun je alleen kiezen uit ${tastaturDesLandes("nl", weg)} toetsenborden. Het ingestelde toetsenbord "${name}" past daar niet bij.`,
      tastaturName: "Toetsenbordindeling",
      anfangen: "Waar wil je beginnen?",
      anfangenHinweis:
        "Kun je al typen, dan hoef je niet bij F en J te beginnen - en ben je te hoog ingestapt, zet het dan gewoon terug. Geldt meteen voor \"Mijn training\"; je statistiek en je medailles blijven.",
      anfangenName: "Startpunt in de leerstof",
      tempoTitel: "Snelheid",
      zeitLassen: (an: boolean) => (an ? "Snelheid telt niet: aan" : "Snelheid telt niet: uit"),
      zeitLassenTitel:
        "Geen tijdslimiet in het spel, geen snelheidsdoel bij de sterren. Alleen zorgvuldigheid telt.",
      zeitLassenSelbst:
        "Met \"Snelheid telt niet\" telt de snelheid nergens meer: het spel loopt zonder klok, de sterren komen alleen van je zorgvuldigheid, en je oefentijd telt ook bij lange pauzes door.",
      zeitLassenVonLehrkraftAn:
        "Je leerkracht heeft \"Snelheid telt niet\" voor je aangezet: de snelheid telt nergens - alleen hoe zorgvuldig je typt.",
      zeitLassenVonLehrkraftAus:
        "\"Snelheid telt niet\" stelt je leerkracht in. Staat het aan, dan telt de snelheid nergens meer - alleen hoe zorgvuldig je typt.",
      abstandTitel: "Letterafstand (CVI)",
      abstandName: "Brede letterafstand (CVI)",
      abstandHinweis:
        "Meer ruimte tussen ELK teken bij het overtypen - voor kinderen met CVI (cerebrale visuele inperking), bij wie tekens die dicht op elkaar staan in elkaar overlopen. Tijdens het typen wordt alles donkerder behalve het veld waarin je typt (de oefenregel of het speelveld); na 5 seconden zonder typen wordt het weer licht. De oefenregel glijdt daarbij in je eigen typtempo naar het volgende teken, in plaats van te springen. Loopt een vraag in de raadseloefeningen over meerdere regels door, dan blijft daarnaast maar één regel licht (de \"leesstrook\") - met pijl omlaag en pijl omhoog ga je van regel naar regel. \"Normaal\" laat de tekens op hun gewone afstand staan en zet alleen het donker maken, het glijden van de regel en de leesstrook aan. Je kunt dit hier altijd zelf veranderen, zo vaak je wilt. Hoor je bij een klas, dan kan ook je leerkracht het instellen - wat het laatst is gekozen, geldt.",
      einhand: (an: boolean) => `Met één hand typen: ${an ? "aan" : "uit"}`,
      einhandHinweis:
        "Voor iedereen die met één hand typt: hoofdletters en speciale tekens gelden dan met elke Shift-toets - niet alleen met die van de andere hand.",
      wochenzielTitel: "Mijn weekdoel",
      wochenzielName: "Minuten per week",
      wochenzielHinweis:
        "Zoveel minuten wil je per week oefenen. De week begint op maandag om 8.00 uur. Een nieuw doel geldt vanaf de volgende maandag - de lopende week houdt haar doel. Je stand zie je aan de ring onder het typveld.",
      keinWochenziel: "geen weekdoel",
      wochenzielMinuten: (n: number) => `${n} ${n === 1 ? "minuut" : "minuten"}`,
      wochenzielAnstehend: (datum: string, minuten: number) =>
        minuten > 0
          ? `Vanaf maandag ${datum}, 8.00 uur: ${minuten} ${minuten === 1 ? "minuut" : "minuten"} per week - deze week blijft het vorige doel gelden.`
          : `Vanaf maandag ${datum}, 8.00 uur: geen weekdoel meer - deze week blijft het vorige doel gelden.`,
      nachholen: (an: boolean) =>
        `Gemiste minuten van vorige weken inhalen: ${an ? "aan" : "uit"}`,
      nachholenHinweis:
        "Oefen je meer dan je weekdoel, dan vullen de extra minuten open weekdoelen van eerdere weken aan - de oudste eerst.",
      anzeigeTitel: "Weergave",
      fingerFarben: (an: boolean) => `Vingerkleuren: ${an ? "aan" : "uit"}`,
      fingerFarbenTitel: "Toetsen in de kleur van de vinger die ze indrukt.",
      leerzeichen: (an: boolean) => `Spaties tonen: ${an ? "aan" : "uit"}`,
      leerzeichenTitel: "Spaties in de oefenregel als ␣. Uit: een open plek.",
      grosseTastatur: (an: boolean) => `Groot toetsenbord (met numeriek toetsenblok): ${an ? "aan" : "uit"}`,
      grosseTastaturHinweis:
        "Toont naast het gewone schermtoetsenbord ook het numerieke toetsenblok - en als er genoeg plaats is, ook de toetsen Insert, Home, Page Up, Page Down, End en de pijltoetsen. Gaat vanzelf aan zodra je een toets van het numerieke toetsenblok indrukt. Zet je het hier zelf uit, dan blijft het uit tot je het hier weer aanzet.",
      grosseTastaturAnsage: (an: boolean) => `Groot toetsenbord ${an ? "aan" : "uit"}.`,
      groesse: "Grootte van het typveld",
      kleiner: "Typveld kleiner",
      groesser: "Typveld groter",
      groesseName: (p: number) => `Typveld ${p} procent`,
      groesseZahl: (p: number) => [p, "%"],
      groesseHinweis:
        "Werkt ook tijdens het oefenen: Alt en plus, Alt en min. Vergroot alleen het typveld - voor de hele pagina gebruik je Ctrl en plus.",
      spielTitel: "Beloningsspel",
      nachNeuerTaste: "Na een nieuwe toets",
      spielHinweis:
        "Of je na een vrijgespeelde toets een kort spel krijgt aangeboden. Je kunt kiezen: Geen - dat is de standaard; of het IJsschotsenspel, de Poolexpeditie met de pinguïn. Het mag, het hoeft niet; de toets heb je toch al. Geldt voor dit apparaat.",
      spielName: "Beloningsspel na een nieuwe toets",
      spielSatz1: "Standaard is ",
      spielSatz2: ": de nieuwe toets is toch al van jou, hij wordt gevierd, en daarna ga je verder. Het ",
      spielSatz3: " is de Poolexpeditie met de pinguïn - het mag, het hoeft niet, en het telt niet als oefentijd.",
      tonTitel: "Geluid",
      ton: (aus: boolean) => (aus ? "Geluid uit" : "Geluid aan"),
      tonHinweis: "Zet alle geluiden van de app aan of uit - beloningen, de toon bij een verkeerde toets en de klik bij het typen.",
      klickName: "Klikgeluid van de toetsen",
      klick: "Toetsklik",
      klickTitel: "Een zachte klik bij elke goede aanslag",
      melodie: "Melodie bij het typen",
      melodieHinweis: "Oefent een gelijkmatig typritme en is leuk - wie gelijkmatig typt, wordt ook op onzekere toetsen vlotter. Elke goede toets speelt de volgende noot van een liedje. Typ je gelijkmatig, dan speelt er een band mee. Met Voorlezen klinkt de melodie alleen in je rechteroor. Sneltoets: Alt + 6, klank wisselen met Alt + 7 en Alt + 8.",
      melodieKlang: "Klank",
      melodieLied: "Liedje",
      vorlesenTitel: "Voorlezen",
      vorlesen: (an: boolean) => (an ? "Voorlezen: aan" : "Voorlezen: uit"),
      vorlesenTitelAttr:
        "De app leest voor (voor iedereen die geen schermlezer gebruikt). Gebruik je een schermlezer, laat het dan beter uit.",
      strg: "Ctrl",
      strgSatz: " maakt de stem meteen stil - overal, ook midden in een zin. De volgende melding spreekt weer.",
      wasGelesen: "Wat wordt voorgelezen (je kunt meer dan één kiezen)",
      liest: "leest:",
      woerter: "Woorden",
      woerterTitel: "Elk woord voorlezen als je eraan begint.",
      saetze: "Zinnen",
      saetzeTitel: "Aan het begin van de regel de hele regel als zin voorlezen.",
      buchstabieren: "Toets voor toets",
      buchstabierenAnsage: (an: boolean) => `Toets voor toets: ${an ? "aan" : "uit"}.`,
      buchstabierenTitel:
        "Na elke aanslag de volgende toets noemen - voor iedereen die alleen luistert. Staat Voorlezen uit, dan zegt je schermlezer het: aan het begin van de regel de hele zin, aan het begin van een woord het woord, daarna de toetsen. Met een brailleleesregel: uit, dan blijft de regel stil tijdens het typen.",
      sprechTempo: "Spreeksnelheid",
      sprechTempoName: "Spreeksnelheid",
      langsam: "langzaam",
      normal: "normaal",
      schnell: "snel",
      sehrSchnell: "heel snel",
      stimme: "Stem",
      stimmeHinweis:
        "Welke stem op dit apparaat voorleest - voor de oefentekst en ook voor de reacties. \"Automatisch\" zoekt zelf een passende stem. Is een stem te zacht of klinkt ze onduidelijk bij é, ë of ij, kies hier dan een andere.",
      automatisch: "automatisch",
      kontoTitel: "Mijn account",
      zugangsdaten: "Mijn inloggegevens",
      kontoBestaetigt:
        "Je e-mailadres of wachtwoord wijzigen - en je account verwijderen als je het niet meer nodig hebt.",
      kontoUnbestaetigt:
        "⚠️ Je e-mailadres is nog niet bevestigd - tot dan komt er geen weekverslag. Hier kun je een nieuwe link aanvragen of het adres wijzigen.",
      // Wie in "en": in der niederländischen Bedienung gibt es keinen Einführungs-Podcast.
      einrichtungTitel: "Eerste stappen",
      einrichtungNeu: " Eerste stappen opnieuw doorlopen",
      einrichtungTitelAttr:
        "Neemt je stap voor stap mee langs leeftijd, taal, toetsenbord, geluid en voorlezen (Alt + R)",
      einrichtungSatz: "Stap voor stap door alle instellingen. Ook met Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      uebungsartTitel: "O que estás a praticar?",
      uebungsart: "Tipo de exercício",
      modusAdaptiv: "O meu treino",
      modusBuecherei: "Histórias",
      modusWortspiele: "Jogos de palavras",
      satzAdaptiv: " pratica exatamente as teclas que ainda estão em consolidação.",
      satzBuecherei: " são textos inteiros, parte a parte.",
      satzWortspiele: (k: string) => [" é uma estante - escolhe o que te apetecer. Também podes passar de um para outro com ", k, "."],
      texteTitel: "Textos",
      klassenStufeRest: " - foi definido para toda a turma.",
      textstufeHinweis: (fortschritt: string) =>
        `Para que idade servem as palavras e os textos. Aplica-se a partir da próxima ronda - "${fortschritt}" e o teu progresso ficam como estão.`,
      textstufeName: "Textos para (idade)",
      geburtsjahr: "Ano de nascimento",
      geburtsjahrHinweis:
        "Só o ano. Se estiver preenchido e ninguém tiver escolhido uma idade à mão, os textos crescem contigo. Uma idade escolhida à mão fica como está.",
      geburtsjahrBeispiel: "p. ex. 2016",
      sprache: "Língua",
      spracheGesperrt: "A língua foi definida para ti na tua turma.",
      spracheHinweis: "A língua das palavras e dos textos que praticas. Aplica-se a partir da próxima ronda.",
      spracheHaupt: (name: string) =>
        `A língua deste curso: ${name}. Também podes praticar inglês - as teclas continuam a vir pela ordem deste curso.`,
      spracheName: "Língua dos textos",
      tastaturTitel: "Teclado",
      meineTastatur: "O meu teclado",
      tastaturHinweis:
        "O teclado no ecrã, os dedos ditos em voz alta e os carateres que praticas seguem esta escolha.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Este curso ensina o teclado do seu país - por isso só aparecem teclados ${tastaturDesLandes("pt", weg)}. O teclado definido, "${name}", não corresponde.`,
      tastaturName: "Esquema do teclado",
      anfangen: "Por onde queres começar?",
      anfangenHinweis:
        "Quem já sabe escrever não precisa de começar no F e no J - e quem começou alto demais volta simplesmente atrás. Aplica-se logo a \"O meu treino\"; as estatísticas e as medalhas ficam.",
      anfangenName: "Ponto de partida no curso",
      tempoTitel: "Velocidade",
      zeitLassen: (an: boolean) => (an ? "Com calma: ligado" : "Com calma: desligado"),
      zeitLassenTitel:
        "Sem limite de tempo no jogo, sem meta de velocidade nas estrelas. Só conta o cuidado com que escreves.",
      zeitLassenSelbst:
        "Com \"Com calma\", a velocidade não conta em lado nenhum: o jogo corre sem relógio, as estrelas vêm só do cuidado, e o tempo de prática continua a contar mesmo durante pausas longas.",
      zeitLassenVonLehrkraftAn:
        "Na tua turma, \"Com calma\" foi ligado para ti: a velocidade não conta em lado nenhum - só o cuidado com que escreves.",
      zeitLassenVonLehrkraftAus:
        "\"Com calma\" é definido na tua turma. Quando está ligado, a velocidade não conta em lado nenhum - só o cuidado com que escreves.",
      abstandTitel: "Espaçamento (CVI)",
      abstandName: "Espaçamento largo (CVI)",
      abstandHinweis:
        "Mais espaço entre CADA caráter enquanto copias o texto - para crianças com deficiência visual cerebral (CVI), para quem os carateres muito juntos se misturam. Enquanto escreves, tudo fica escurecido exceto o campo em que estás a escrever (a linha de prática ou a área do jogo); depois de 5 segundos sem escrever, volta a ficar claro. A linha de prática desliza para o caráter seguinte ao teu próprio ritmo, em vez de saltar. Quando uma pergunta de várias linhas nos exercícios de enigmas ocupa mais do que uma linha, fica clara apenas uma linha (a \"linha de leitura\") - com as teclas seta para baixo e seta para cima passas de uma linha para a outra. \"Simples\" deixa os carateres no espaçamento habitual e liga apenas o escurecimento, o deslizar da linha e a linha de leitura. Podes alterar isto aqui quando quiseres, as vezes que quiseres. Se fizeres parte de uma turma, também pode ser definido na turma - vale o que foi escolhido por último.",
      einhand: (an: boolean) => `Escrever com uma mão: ${an ? "ligado" : "desligado"}`,
      einhandHinweis:
        "Para quem escreve com uma mão: as maiúsculas e os símbolos contam com qualquer tecla Shift - não só com a da outra mão.",
      wochenzielTitel: "O meu objetivo semanal",
      wochenzielName: "Minutos por semana",
      wochenzielHinweis:
        "Quantos minutos queres praticar por semana. A semana começa à segunda-feira, às 08:00. Um novo objetivo aplica-se a partir da segunda-feira seguinte - a semana em curso mantém o seu objetivo. O anel por baixo do campo de escrita mostra como vais.",
      keinWochenziel: "sem objetivo semanal",
      wochenzielMinuten: (n: number) => `${n} minutos`,
      wochenzielAnstehend: (datum: string, minuten: number) =>
        minuten > 0
          ? `A partir de segunda-feira, ${datum}, às 08:00: ${minuten} minutos por semana - esta semana mantém o objetivo anterior.`
          : `A partir de segunda-feira, ${datum}, às 08:00: sem objetivo semanal - esta semana mantém o objetivo anterior.`,
      nachholen: (an: boolean) =>
        `Recuperar os minutos das semanas anteriores: ${an ? "ligado" : "desligado"}`,
      nachholenHinweis:
        "Se praticares mais do que o teu objetivo semanal, os minutos a mais completam objetivos ainda por cumprir de semanas anteriores - a mais antiga primeiro.",
      anzeigeTitel: "Visualização",
      fingerFarben: (an: boolean) => `Cores dos dedos: ${an ? "ligado" : "desligado"}`,
      fingerFarbenTitel: "As teclas na cor do dedo que as prime.",
      leerzeichen: (an: boolean) => `Mostrar espaços: ${an ? "ligado" : "desligado"}`,
      leerzeichenTitel: "Os espaços da linha como ␣. Desligado: um espaço vazio.",
      grosseTastatur: (an: boolean) => `Teclado grande (com bloco numérico): ${an ? "ligado" : "desligado"}`,
      grosseTastaturHinweis:
        "Mostra o bloco numérico ao lado do teclado no ecrã habitual - e, se houver espaço suficiente, as teclas Insert, Home, Page Up, Page Down, End e as teclas de seta. Liga-se sozinho assim que é premida uma tecla do bloco numérico. Se o desligares aqui à mão, fica desligado até o voltares a ligar aqui.",
      grosseTastaturAnsage: (an: boolean) => `Teclado grande ${an ? "ligado" : "desligado"}.`,
      groesse: "Tamanho do campo de escrita",
      kleiner: "Reduzir o campo de escrita",
      groesser: "Ampliar o campo de escrita",
      groesseName: (p: number) => `Campo de escrita ${p} por cento`,
      groesseZahl: (p: number) => [p, "%"],
      groesseHinweis:
        "Também funciona durante a prática: Alt e mais, Alt e menos. Só amplia o campo de escrita - para a página inteira, usa Ctrl e mais.",
      spielTitel: "Jogo-prémio",
      nachNeuerTaste: "Depois de uma tecla nova",
      spielHinweis:
        "Se te é proposto um jogo curto depois de desbloqueares uma tecla. Podes escolher: Nenhum - é a predefinição; ou o jogo Blocos de gelo, a Expedição polar com o pinguim. É opcional; a tecla já é tua de qualquer forma. Aplica-se a este dispositivo.",
      spielName: "Jogo-prémio depois de uma tecla nova",
      spielSatz1: "A predefinição é ",
      spielSatz2: ": a tecla nova já é tua, é celebrada, e depois continuas. O jogo ",
      spielSatz3: " é a Expedição polar com o pinguim - é opcional e não conta como tempo de prática.",
      tonTitel: "Som",
      ton: (aus: boolean) => (aus ? "Som desligado" : "Som ligado"),
      tonHinweis: "Liga ou desliga todos os sons do programa - recompensas, sons de tecla errada e o som das teclas.",
      klickName: "Som de clique das teclas",
      klick: "Som das teclas",
      klickTitel: "Um clique suave a cada toque certo",
      melodie: "Melodia ao escrever",
      melodieHinweis: "Treina um ritmo de escrita regular e é para ser divertido - quem escreve com ritmo regular fica também mais fluente nas teclas mais difíceis. Cada tecla certa toca a nota seguinte de uma canção. Escreve a um ritmo regular e junta-se uma banda. Com a leitura em voz alta ligada, a melodia toca só no ouvido direito. Atalho: Alt + 6, mudar o som com Alt + 7 e Alt + 8.",
      melodieKlang: "Som",
      melodieLied: "Canção",
      vorlesenTitel: "Leitura em voz alta",
      vorlesen: (an: boolean) => (an ? "Leitura em voz alta: ligada" : "Leitura em voz alta: desligada"),
      vorlesenTitelAttr:
        "A aplicação lê em voz alta (para quem não usa leitor de ecrã). Com um leitor de ecrã a funcionar, é melhor deixá-la desligada.",
      strg: "Ctrl",
      strgSatz: " faz silêncio de imediato - em qualquer lugar, mesmo a meio de uma frase. O anúncio seguinte volta a falar.",
      wasGelesen: "O que é lido (podes escolher várias opções)",
      liest: "lê:",
      woerter: "Palavras",
      woerterTitel: "Ler cada palavra quando a começas.",
      saetze: "Frases",
      saetzeTitel: "Ler a linha inteira como frase quando a começas.",
      buchstabieren: "Tecla a tecla",
      buchstabierenAnsage: (an: boolean) => `Tecla a tecla: ${an ? "ligado" : "desligado"}.`,
      buchstabierenTitel:
        "Depois de cada toque, diz a tecla seguinte - para quem só ouve. Com a leitura em voz alta desligada, quem o diz é o leitor de ecrã: no início da linha a frase inteira, no início da palavra a palavra, depois as teclas. Com linha braille: desligado, assim a linha fica parada enquanto escreves.",
      sprechTempo: "Velocidade da voz",
      sprechTempoName: "Velocidade da voz",
      langsam: "lenta",
      normal: "normal",
      schnell: "rápida",
      sehrSchnell: "muito rápida",
      stimme: "Voz",
      stimmeHinweis:
        "Que voz instalada neste dispositivo lê em voz alta - tanto o texto de prática como as mensagens. \"Automática\" encontra sozinha uma voz adequada. Se uma voz estiver baixa demais ou soar pouco clara nas letras com acento, escolhe aqui outra.",
      automatisch: "automática",
      kontoTitel: "A minha conta",
      zugangsdaten: "Os meus dados de acesso",
      kontoBestaetigt:
        "Alterar o endereço de e-mail ou a palavra-passe - e eliminar a conta quando já não precisares dela.",
      kontoUnbestaetigt:
        "⚠️ O teu endereço de e-mail ainda não está confirmado - até lá, não chega nenhum resumo semanal. Aqui podes pedir uma nova ligação ou alterar o endereço.",
      einrichtungTitel: "Configuração inicial",
      einrichtungNeu: " Recomeçar a configuração inicial",
      einrichtungTitelAttr:
        "Leva-te passo a passo pela idade, língua, teclado, som e leitura em voz alta (Alt + R)",
      einrichtungSatz: "Passo a passo por todas as definições. Também com Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      uebungsartTitel: "O que você está praticando?",
      uebungsart: "Tipo de prática",
      modusAdaptiv: "Meu treino",
      modusBuecherei: "Histórias",
      modusWortspiele: "Jogos de palavras",
      satzAdaptiv: " pratica exatamente as teclas que ainda estão inseguras.",
      satzBuecherei: " são textos inteiros, parte por parte.",
      satzWortspiele: (k: string) => [" é uma estante - escolha o que você quiser. Você também pode passar de um para outro com ", k, "."],
      texteTitel: "Textos",
      klassenStufeRest: " - quem dá aula definiu isso para a turma inteira.",
      textstufeHinweis: (fortschritt: string) =>
        `Para qual idade as palavras e os textos são pensados. Vale a partir da próxima rodada - ${fortschritt} e o seu progresso continuam como estão.`,
      textstufeName: "Textos para (idade)",
      geburtsjahr: "Ano de nascimento",
      geburtsjahrHinweis:
        "Só o ano. Se ele estiver preenchido e ninguém tiver escolhido uma faixa de idade à mão, os textos crescem junto com você. Uma faixa escolhida à mão continua valendo.",
      geburtsjahrBeispiel: "ex.: 2016",
      sprache: "Idioma",
      spracheGesperrt: "Quem dá aula definiu o idioma para você.",
      spracheHinweis: "O idioma das palavras e dos textos de prática. Vale a partir da próxima rodada.",
      spracheHaupt: (name: string) =>
        `O idioma deste curso: ${name}. Você também pode praticar inglês - as teclas continuam vindo na ordem deste curso.`,
      spracheName: "Idioma dos textos",
      tastaturTitel: "Teclado",
      meineTastatur: "Meu teclado",
      tastaturHinweis:
        "O teclado na tela, os avisos falados dos dedos e os caracteres que você pratica seguem esta escolha.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Este curso ensina o teclado do seu país - por isso só aparecem teclados ${tastaturDesLandes("br", weg)}. O teclado configurado agora, "${name}", não combina com ele.`,
      tastaturName: "Layout do teclado",
      anfangen: "Por onde você quer começar?",
      anfangenHinweis:
        "Quem já sabe digitar não precisa começar pelo F e pelo J - e quem começou num ponto alto demais simplesmente volta. Vale na hora para Meu treino; as estatísticas e as medalhas continuam.",
      anfangenName: "Ponto de partida no curso",
      tempoTitel: "Velocidade",
      zeitLassen: (an: boolean) => (an ? "Com calma: ligado" : "Com calma: desligado"),
      zeitLassenTitel:
        "Sem limite de tempo no jogo, sem meta de velocidade nas estrelas. Só conta o cuidado ao digitar.",
      zeitLassenSelbst:
        `Com a opção "Com calma", a velocidade não conta em lugar nenhum: o jogo roda sem relógio, as estrelas vêm só do cuidado, e o tempo de prática continua contando mesmo em pausas longas.`,
      zeitLassenVonLehrkraftAn:
        `Quem dá aula para você ligou a opção "Com calma": a velocidade não conta em lugar nenhum - só o cuidado ao digitar.`,
      zeitLassenVonLehrkraftAus:
        `A opção "Com calma" é definida por quem dá aula para você. Quando ela está ligada, a velocidade não conta em lugar nenhum - só o cuidado ao digitar.`,
      abstandTitel: "Espaço entre letras (DVC)",
      abstandName: "Espaço maior entre letras (DVC)",
      abstandHinweis:
        `Mais espaço entre CADA caractere ao copiar o texto - para crianças com deficiência visual cortical (DVC), para quem caracteres muito próximos se misturam. Enquanto você digita, tudo fica escurecido, menos o campo em que você está digitando (a linha de prática ou a área do jogo); depois de 5 segundos sem digitar, tudo fica claro de novo. A linha de prática desliza até o próximo caractere no seu próprio ritmo, em vez de pular. Quando uma pergunta de várias linhas nos exercícios de charadas quebra a linha, além disso só uma linha fica clara (a "Linha de leitura") - com a seta para baixo e a seta para cima você passa de uma linha para outra. "Simples" deixa os caracteres no espaçamento de sempre e só liga o escurecimento, o deslizar da linha e a Linha de leitura. Você pode mudar isso aqui quando quiser, quantas vezes quiser. Se você faz parte de uma turma, quem dá aula também pode definir isso - vale o que foi escolhido por último.`,
      einhand: (an: boolean) => `Digitar com uma mão: ${an ? "ligado" : "desligado"}`,
      einhandHinweis:
        "Para quem digita com uma mão: letras maiúsculas e símbolos valem com qualquer tecla Shift - não só com a da outra mão.",
      wochenzielTitel: "Minha meta semanal",
      wochenzielName: "Minutos por semana",
      wochenzielHinweis:
        "Quantos minutos por semana você quer praticar. A semana começa na segunda-feira às 8h. Uma meta nova vale a partir da próxima segunda-feira - a semana atual mantém a sua meta. O círculo abaixo do campo de digitação mostra onde você está.",
      keinWochenziel: "sem meta semanal",
      wochenzielMinuten: (n: number) => `${n} ${n === 1 ? "minuto" : "minutos"}`,
      wochenzielAnstehend: (datum: string, minuten: number) =>
        minuten > 0
          ? `A partir de segunda-feira, ${datum}, às 8h: ${minuten} minutos por semana - nesta semana continua a meta de antes.`
          : `A partir de segunda-feira, ${datum}, às 8h: sem meta semanal - nesta semana continua a meta de antes.`,
      nachholen: (an: boolean) =>
        `Recuperar os minutos das semanas anteriores: ${an ? "ligado" : "desligado"}`,
      nachholenHinweis:
        "Se você praticar mais do que a sua meta semanal, os minutos extras completam metas não cumpridas de semanas anteriores - a mais antiga primeiro.",
      anzeigeTitel: "Exibição",
      fingerFarben: (an: boolean) => `Cores dos dedos: ${an ? "ligadas" : "desligadas"}`,
      fingerFarbenTitel: "Teclas na cor do dedo que as pressiona.",
      leerzeichen: (an: boolean) => `Mostrar espaços: ${an ? "ligado" : "desligado"}`,
      leerzeichenTitel: "Os espaços da linha como ␣. Desligado: um espaço vazio.",
      grosseTastatur: (an: boolean) => `Teclado grande (com teclado numérico): ${an ? "ligado" : "desligado"}`,
      grosseTastaturHinweis:
        "Mostra o teclado numérico ao lado do teclado na tela de sempre - e, se houver espaço, as teclas Insert, Home, Page Up, Page Down, End e as teclas de seta. Liga automaticamente assim que você pressiona uma tecla do teclado numérico. Se você desligar aqui, ele fica desligado até você ligar de novo aqui.",
      grosseTastaturAnsage: (an: boolean) => `Teclado grande ${an ? "ligado" : "desligado"}.`,
      groesse: "Tamanho do campo de digitação",
      kleiner: "Diminuir o campo de digitação",
      groesser: "Aumentar o campo de digitação",
      groesseName: (p: number) => `Campo de digitação ${p} por cento`,
      groesseZahl: (p: number) => [p, "%"],
      groesseHinweis:
        "Funciona também durante a prática: Alt e mais, Alt e menos. Isso só aumenta o campo de digitação - para a página inteira, use Ctrl e mais.",
      spielTitel: "Jogo de recompensa",
      nachNeuerTaste: "Depois de uma tecla nova",
      spielHinweis:
        "Se você recebe a oferta de um jogo curto depois de desbloquear uma tecla. Você pode escolher: Nenhum - é o padrão; ou Placas de gelo, a Expedição polar com o pinguim. É opcional; a tecla já é sua de qualquer jeito. Vale para este dispositivo.",
      spielName: "Jogo de recompensa depois de uma tecla nova",
      spielSatz1: "O padrão é ",
      spielSatz2: ": a tecla nova já é sua de qualquer jeito, ela é comemorada e depois você continua. O jogo ",
      spielSatz3: " é a Expedição polar com o pinguim - é opcional e não conta como tempo de prática.",
      tonTitel: "Som",
      ton: (aus: boolean) => (aus ? "Som desligado" : "Som ligado"),
      tonHinweis: "Liga ou desliga todos os sons do programa - recompensas, sons de erro e o clique ao digitar.",
      klickName: "Som de clique das teclas",
      klick: "Clique das teclas",
      klickTitel: "Um clique suave a cada toque certo",
      melodie: "Melodia ao digitar",
      melodieHinweis: "Treina um ritmo de digitação regular e é divertido - quem digita num ritmo regular fica mais fluente também nas teclas mais difíceis. Cada tecla certa toca a próxima nota de uma música. Digite num ritmo regular, e uma banda entra junto. Com a leitura em voz alta ligada, a melodia toca só no ouvido direito. Atalho: Alt + 6; para mudar o som, Alt + 7 e Alt + 8.",
      melodieKlang: "Som",
      melodieLied: "Música",
      vorlesenTitel: "Leitura em voz alta",
      vorlesen: (an: boolean) => (an ? "Leitura em voz alta: ligada" : "Leitura em voz alta: desligada"),
      vorlesenTitelAttr:
        "O aplicativo lê em voz alta (para quem não usa leitor de tela). Com um leitor de tela ativo, é melhor deixar desligada.",
      strg: "Ctrl",
      strgSatz: " silencia a voz na hora - em qualquer lugar, até no meio de uma frase. O próximo aviso volta a falar.",
      wasGelesen: "O que é lido em voz alta (você pode escolher mais de um)",
      liest: "lê:",
      woerter: "Palavras",
      woerterTitel: "Ler cada palavra quando você começa a digitá-la.",
      saetze: "Frases",
      saetzeTitel: "Ler a linha inteira como frase quando você começa a digitá-la.",
      buchstabieren: "Tecla por tecla",
      buchstabierenAnsage: (an: boolean) => `Tecla por tecla: ${an ? "ligado" : "desligado"}.`,
      buchstabierenTitel:
        "Depois de cada toque, anuncia a próxima tecla - para quem só ouve. Com a leitura em voz alta desligada, quem fala é o leitor de tela: no começo da linha a frase inteira, no começo da palavra a palavra, depois as teclas. Com linha braille: desligado, assim a linha fica parada enquanto você digita.",
      sprechTempo: "Velocidade da fala",
      sprechTempoName: "Velocidade da fala",
      langsam: "lenta",
      normal: "normal",
      schnell: "rápida",
      sehrSchnell: "muito rápida",
      stimme: "Voz",
      stimmeHinweis:
        "Qual voz instalada neste dispositivo faz a leitura - tanto do texto de prática quanto das respostas. Automática procura automaticamente uma voz adequada. Se uma voz estiver baixa demais ou soar pouco clara em ã, õ e ç, escolha outra aqui.",
      automatisch: "automática",
      kontoTitel: "Minha conta",
      zugangsdaten: "Meus dados de acesso",
      kontoBestaetigt:
        "Mudar o endereço de e-mail ou a senha - e excluir a conta quando você não precisar mais dela.",
      kontoUnbestaetigt:
        "⚠️ O seu endereço de e-mail ainda não foi confirmado - até lá, não chega nenhum resumo semanal. Aqui você pode pedir um novo link ou mudar o endereço.",
      einrichtungTitel: "Configuração inicial",
      einrichtungNeu: " Refazer a configuração inicial",
      einrichtungTitelAttr:
        "Leva você passo a passo por idade, idioma, teclado, som e leitura em voz alta (Alt + R)",
      einrichtungSatz: "Passo a passo por todas as configurações. Também com Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      uebungsartTitel: "Ce exersezi?",
      uebungsart: "Tip de exercițiu",
      modusAdaptiv: "Antrenamentul meu",
      modusBuecherei: "Povești",
      modusWortspiele: "Jocuri cu cuvinte",
      satzAdaptiv: " exersează exact tastele care sunt încă nesigure.",
      satzBuecherei: " sunt texte întregi, parte cu parte.",
      satzWortspiele: (k: string) => [" este un raft - alege ce îți place. Poți trece de la unul la altul și cu ", k, "."],
      texteTitel: "Texte",
      klassenStufeRest: " - cadrul didactic a stabilit-o pentru toată clasa.",
      textstufeHinweis: (fortschritt: string) =>
        `Pentru ce vârstă sunt potrivite cuvintele și textele. Se aplică de la runda următoare - ${fortschritt} și progresul tău rămân cum sunt.`,
      textstufeName: "Texte pentru vârsta",
      geburtsjahr: "Anul nașterii",
      geburtsjahrHinweis:
        "Doar anul. Dacă este completat și nimeni nu a ales de mână o treaptă de vârstă, textele cresc odată cu tine. O treaptă aleasă de mână rămâne cum este.",
      geburtsjahrBeispiel: "de ex. 2016",
      sprache: "Limba",
      spracheGesperrt: "Cadrul didactic a stabilit limba pentru tine.",
      spracheHinweis: "Limba cuvintelor și textelor pe care le exersezi. Se aplică de la runda următoare.",
      spracheHaupt: (name: string) =>
        `Limba acestui curs: ${name}. Poți exersa în plus și engleza - tastele vin totuși în ordinea acestui curs.`,
      spracheName: "Limba textelor",
      tastaturTitel: "Tastatură",
      meineTastatur: "Tastatura mea",
      tastaturHinweis:
        "După asta se potrivesc tastatura de pe ecran, anunțurile pentru degete și caracterele pe care le exersezi.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Acest curs predă tastatura țării sale - de aceea sunt oferite doar tastaturi ${tastaturDesLandes("ro", weg)}. Tastatura setată acum, „${name}”, nu se potrivește.`,
      tastaturName: "Aspect tastatură",
      anfangen: "De unde începi?",
      anfangenHinweis:
        "Dacă știi deja să scrii, nu trebuie să începi cu F și J - iar dacă ai început prea sus, pur și simplu muți înapoi. Se aplică imediat pentru „Antrenamentul meu”; statistica și medaliile rămân.",
      anfangenName: "Punctul de plecare în curs",
      tempoTitel: "Viteză",
      zeitLassen: (an: boolean) => (an ? "În ritmul tău: pornit" : "În ritmul tău: oprit"),
      zeitLassenTitel:
        "Fără limită de timp în joc, fără țintă de viteză la stele. Contează doar grija cu care scrii.",
      zeitLassenSelbst:
        "Cu „În ritmul tău”, viteza nu mai contează nicăieri: jocul merge fără ceas, stelele vin doar din grija cu care scrii, iar timpul de exersare se socotește în continuare și în pauze lungi.",
      zeitLassenVonLehrkraftAn:
        "Cadrul didactic a pornit pentru tine „În ritmul tău”: viteza nu contează nicăieri - doar grija cu care scrii.",
      zeitLassenVonLehrkraftAus:
        "„În ritmul tău” îl setează cadrul didactic. Când e pornit, viteza nu mai contează nicăieri - doar grija cu care scrii.",
      abstandTitel: "Spațiere între caractere (CVI)",
      abstandName: "Spațiere mare între caractere (CVI)",
      abstandHinweis:
        "Spațiu mai mare între FIECARE caracter când copiezi textul - pentru copiii cu deficiență de vedere de origine cerebrală (CVI), pentru care caracterele apropiate se contopesc. În timp ce scrii, se întunecă tot în afară de câmpul în care scrii acum (rândul de exersare sau terenul de joc); după 5 secunde fără scris, se luminează din nou. Rândul de exersare alunecă atunci lin, în ritmul tău de scris, la caracterul următor, în loc să sară. Când o întrebare pe mai multe rânduri din exercițiile-ghicitoare trece pe rândul următor, rămâne luminos în plus doar un rând (rândul de citire) - cu tastele săgeată în jos și săgeată în sus treci de la un rând la altul. „Simplă” lasă caracterele la spațierea lor obișnuită și pornește doar întunecarea, alunecarea rândului și rândul de citire. O poți schimba tu aici oricând, de câte ori vrei. Dacă faci parte dintr-o clasă, o poate seta și cadrul didactic - contează ce s-a ales ultima dată.",
      einhand: (an: boolean) => `Scriere cu o mână: ${an ? "pornită" : "oprită"}`,
      einhandHinweis:
        "Pentru toți cei care scriu cu o mână: literele mari și semnele speciale merg atunci cu oricare tastă Shift - nu doar cu cea de la cealaltă mână.",
      wochenzielTitel: "Obiectivul meu săptămânal",
      wochenzielName: "Minute pe săptămână",
      wochenzielHinweis:
        "Câte minute vrei să exersezi în fiecare săptămână. Săptămâna începe luni la ora 8:00. Un obiectiv nou se aplică de lunea următoare - săptămâna în curs își păstrează obiectivul. Cât ai realizat arată inelul de sub câmpul de scriere.",
      keinWochenziel: "fără obiectiv săptămânal",
      wochenzielMinuten: (n: number) =>
        mehrzahl(n, "ro", {
          one: (z) => `${z} minut`,
          few: (z) => `${z} minute`,
          other: (z) => `${z} de minute`,
        }),
      wochenzielAnstehend: (datum: string, minuten: number) =>
        minuten > 0
          ? `De luni, ${datum}, ora 8:00: ${mehrzahl(minuten, "ro", {
              one: (z) => `${z} minut`,
              few: (z) => `${z} minute`,
              other: (z) => `${z} de minute`,
            })} pe săptămână - săptămâna aceasta rămâne obiectivul de până acum.`
          : `De luni, ${datum}, ora 8:00: fără obiectiv săptămânal - săptămâna aceasta rămâne obiectivul de până acum.`,
      nachholen: (an: boolean) =>
        `Recuperați minutele din săptămânile trecute: ${an ? "pornit" : "oprit"}`,
      nachholenHinweis:
        "Dacă exersezi mai mult decât obiectivul săptămânal, minutele în plus completează obiectivele încă deschise din săptămânile de dinainte - întâi pe cea mai veche.",
      anzeigeTitel: "Afișare",
      fingerFarben: (an: boolean) => `Culorile degetelor: ${an ? "pornite" : "oprite"}`,
      fingerFarbenTitel: "Tastele în culoarea degetului care le apasă.",
      leerzeichen: (an: boolean) => `Arată spațiile: ${an ? "pornit" : "oprit"}`,
      leerzeichenTitel: "Spațiile din rând ca ␣. Oprit: un gol.",
      grosseTastatur: (an: boolean) => `Tastatură mare (cu tastatura numerică): ${an ? "pornită" : "oprită"}`,
      grosseTastaturHinweis:
        "Arată lângă tastatura obișnuită de pe ecran și tastatura numerică - iar dacă e destul loc, și tastele Insert, Home, Page Up, Page Down, End și săgețile. Pornește singură imediat ce se apasă o tastă din tastatura numerică. Dacă o oprești aici de mână, rămâne oprită până o pornești din nou aici.",
      grosseTastaturAnsage: (an: boolean) => `Tastatură mare ${an ? "pornită" : "oprită"}.`,
      groesse: "Dimensiunea câmpului de scriere",
      kleiner: "Micșorați câmpul de scriere",
      groesser: "Măriți câmpul de scriere",
      groesseName: (p: number) => `Câmpul de scriere ${p} la sută`,
      groesseZahl: (p: number) => [p, " %"],
      groesseHinweis:
        "Merge și în timp ce exersezi: Alt și plus, Alt și minus. Mărește doar câmpul de scriere - pentru toată pagina folosește Ctrl și plus.",
      spielTitel: "Joc-recompensă",
      nachNeuerTaste: "După o tastă nouă",
      spielHinweis:
        "Dacă după o tastă deblocată ți se oferă un joc scurt. Poți alege: Niciunul - aceasta este varianta implicită; sau jocul Sloiuri de gheață, Expediția polară cu pinguinul. Este opțional; tasta e oricum a ta. Se aplică pe acest dispozitiv.",
      spielName: "Joc-recompensă după o tastă nouă",
      spielSatz1: "Varianta implicită este ",
      spielSatz2: ": tasta nouă e oricum a ta, este sărbătorită, apoi mergi mai departe. Jocul ",
      spielSatz3: " este Expediția polară cu pinguinul - opțional, și nu se socotește ca timp de exersare.",
      tonTitel: "Sunet",
      ton: (aus: boolean) => (aus ? "Sunet oprit" : "Sunet pornit"),
      tonHinweis: "Pornește sau oprește toate sunetele aplicației - recompensele, sunetele de greșeală și clicul tastelor.",
      klickName: "Sunetul tastelor",
      klick: "Clicul tastelor",
      klickTitel: "Un clic încet la fiecare apăsare corectă",
      melodie: "Melodie la scriere",
      melodieHinweis: "Te ajută să exersezi un ritm de scris egal și e distractivă - cine scrie într-un ritm egal devine mai fluent și la tastele mai slabe. Fiecare tastă corectă cântă nota următoare dintr-un cântec. Cine ține ritmul primește și o formație care cântă alături. Cu citirea cu voce tare pornită, melodia se aude doar în urechea dreaptă. Comandă rapidă: Alt + 6, sunetul se schimbă cu Alt + 7 și Alt + 8.",
      melodieKlang: "Sunet",
      melodieLied: "Cântec",
      vorlesenTitel: "Citire cu voce tare",
      vorlesen: (an: boolean) => (an ? "Citire cu voce tare: pornită" : "Citire cu voce tare: oprită"),
      vorlesenTitelAttr:
        "Aplicația citește cu voce tare (pentru cei care nu folosesc un cititor de ecran). Dacă un cititor de ecran este pornit, e mai bine s-o lași oprită.",
      strg: "Ctrl",
      strgSatz: " oprește imediat vocea - oriunde, chiar și în mijlocul unei propoziții. Următorul anunț se aude din nou.",
      wasGelesen: "Ce se citește (poți alege mai multe)",
      liest: "citește:",
      woerter: "Cuvinte",
      woerterTitel: "Citește fiecare cuvânt când îl începi.",
      saetze: "Propoziții",
      saetzeTitel: "Citește tot rândul ca propoziție când îl începi.",
      buchstabieren: "Tastă cu tastă",
      buchstabierenAnsage: (an: boolean) => `Tastă cu tastă: ${an ? "pornit" : "oprit"}.`,
      buchstabierenTitel:
        "După fiecare apăsare se anunță tasta următoare - pentru toți cei care doar ascultă. Cu citirea cu voce tare oprită, o spune cititorul de ecran: la începutul rândului toată propoziția, la începutul cuvântului cuvântul, apoi tastele. Cu afișaj braille: oprit, atunci rândul rămâne liniștit în timp ce scrii.",
      // Nu „Viteză” - așa se numește deja grupul „Viteză” (În ritmul tău) de mai sus.
      sprechTempo: "Viteza vocii",
      sprechTempoName: "Viteza vocii",
      langsam: "lent",
      normal: "normal",
      schnell: "rapid",
      sehrSchnell: "foarte rapid",
      stimme: "Voce",
      stimmeHinweis:
        "Ce voce instalată pe acest dispozitiv citește - pentru textul de exersat la fel ca pentru mesaje. „Automat” caută singur o voce potrivită. Dacă o voce e prea încet sau se aude neclar la ă, â, î, ș și ț, alege aici alta.",
      automatisch: "automat",
      kontoTitel: "Contul meu",
      zugangsdaten: "Datele mele de conectare",
      kontoBestaetigt:
        "Schimbă adresa de e-mail sau parola - și șterge contul când nu mai ai nevoie de el.",
      kontoUnbestaetigt:
        "⚠️ Adresa ta de e-mail nu este încă confirmată - până atunci nu vine niciun raport săptămânal. Aici poți cere un link nou sau poți schimba adresa.",
      // Ca la en: în interfața română nu există introducere (podcastul e în germană).
      einrichtungTitel: "Configurare",
      einrichtungNeu: " Reluați configurarea",
      einrichtungTitelAttr:
        "Te conduce pas cu pas prin vârstă, limbă, tastatură, sunet și citire cu voce tare (Alt + R)",
      einrichtungSatz: "Pas cu pas prin toate setările. Și cu Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      uebungsartTitel: "Vad övar du?",
      uebungsart: "Övningsform",
      modusAdaptiv: "Min träning",
      modusBuecherei: "Berättelser",
      modusWortspiele: "Ordlekar",
      satzAdaptiv: " övar precis de tangenter som fortfarande är osäkra.",
      satzBuecherei: " är hela texter, en del i taget.",
      satzWortspiele: (k: string) => [" är en hylla - ta det du gillar. Du kan också växla mellan dem med ", k, "."],
      texteTitel: "Texter",
      klassenStufeRest: " - din lärare har ställt in det för hela klassen.",
      textstufeHinweis: (fortschritt: string) =>
        `Vilken ålder orden och texterna passar för. Gäller från nästa omgång - ${fortschritt} och framstegen finns kvar.`,
      textstufeName: "Texter för ålder",
      geburtsjahr: "Födelseår",
      geburtsjahrHinweis:
        "Bara årtalet. Om det är ifyllt och ingen ålder har valts för hand, växer texterna med dig. En ålder som har valts för hand fortsätter att gälla.",
      geburtsjahrBeispiel: "till exempel 2016",
      sprache: "Språk",
      spracheGesperrt: "Din lärare har bestämt språket åt dig.",
      spracheHinweis: "Språket för orden och texterna som du övar med. Gäller från nästa omgång.",
      spracheHaupt: (name: string) =>
        `Språket i den här kursen: ${name}. Du kan också öva engelska - tangenterna kommer ändå i den här kursens ordning.`,
      spracheName: "Språk för texterna",
      tastaturTitel: "Tangentbord",
      meineTastatur: "Mitt tangentbord",
      tastaturHinweis:
        "Skärmtangentbordet, fingertipsen som läses upp och vilka tecken du övar rättar sig efter detta.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Den här kursen lär ut tangentbordet i sitt land - därför går det bara att välja ${tastaturDesLandes("sv", weg)} tangentbord. Det inställda tangentbordet, ${name}, passar inte till kursen.`,
      tastaturName: "Tangentbordslayout",
      anfangen: "Var vill du börja?",
      anfangenHinweis:
        "Den som redan kan skriva behöver inte börja med F och J - och den som har börjat för högt ställer bara tillbaka. Gäller direkt för Min träning; statistik och märken finns kvar.",
      anfangenName: "Startpunkt i kursen",
      tempoTitel: "Hastighet",
      zeitLassen: (an: boolean) => (an ? "I lugn och ro: på" : "I lugn och ro: av"),
      zeitLassenTitel:
        "Ingen tidsgräns i spelet, inget hastighetsmål för stjärnorna. Bara hur noga du skriver räknas.",
      zeitLassenSelbst:
        "Med I lugn och ro räknas hastigheten ingenstans: spelet går utan klocka, stjärnorna kommer bara av hur noga du skriver, och övningstiden fortsätter att räknas även under långa pauser.",
      zeitLassenVonLehrkraftAn:
        "Din lärare har slagit på I lugn och ro åt dig: hastigheten räknas ingenstans - bara hur noga du skriver.",
      zeitLassenVonLehrkraftAus:
        "I lugn och ro ställs in av din lärare. När det är på räknas hastigheten ingenstans - bara hur noga du skriver.",
      abstandTitel: "Avstånd mellan tecknen (CVI)",
      abstandName: "Större avstånd mellan tecknen (CVI)",
      abstandHinweis:
        "Större avstånd mellan varje enskilt tecken när du skriver av - för barn med cerebral synnedsättning (CVI), där tecken som står tätt flyter ihop. Medan du skriver blir allt utom fältet du skriver i (övningsraden eller spelfältet) mörkare; efter 5 sekunder utan att du skriver blir det ljust igen. Övningsraden glider då till nästa tecken i din egen skrivtakt i stället för att hoppa. Om en fråga i gåtövningarna bryts över flera rader, förblir dessutom bara en rad ljus (läsraden) - med Nedåtpil och Uppåtpil byter du mellan raderna. Enkelt låter tecknen stå med sitt vanliga avstånd och slår bara på mörkläggningen, den glidande raden och läsraden. Du kan själv ändra det här när som helst, så ofta du vill. Om du hör till en klass kan din lärare också ställa in det - det som valdes senast gäller.",
      einhand: (an: boolean) => `Skriva med en hand: ${an ? "på" : "av"}`,
      einhandHinweis:
        "För alla som skriver med en hand: stora bokstäver och specialtecken gäller då med vilken Skift som helst - inte bara med den på andra handen.",
      wochenzielTitel: "Mitt veckomål",
      wochenzielName: "Minuter per vecka",
      wochenzielHinweis:
        "Så många minuter vill du öva per vecka. Veckan börjar på måndag klockan 08:00. Ett nytt mål gäller från nästa måndag - den pågående veckan behåller sitt mål. Ringen under skrivfältet visar hur långt du har kommit.",
      keinWochenziel: "inget veckomål",
      wochenzielMinuten: (n: number) =>
        mehrzahl(n, "sv", { one: (z) => `${z} minut`, other: (z) => `${z} minuter` }),
      wochenzielAnstehend: (datum: string, minuten: number) =>
        minuten > 0
          ? `Från måndag ${datum} klockan 08:00: ${mehrzahl(minuten, "sv", { one: (z) => `${z} minut`, other: (z) => `${z} minuter` })} per vecka - den här veckan gäller det tidigare målet.`
          : `Från måndag ${datum} klockan 08:00: inget veckomål - den här veckan gäller det tidigare målet.`,
      nachholen: (an: boolean) =>
        `Ta igen minuter från tidigare veckor: ${an ? "på" : "av"}`,
      nachholenHinweis:
        "Om du övar mer än ditt veckomål fyller de extra minuterna upp mål som inte har nåtts under tidigare veckor - den äldsta veckan först.",
      anzeigeTitel: "Visning",
      fingerFarben: (an: boolean) => `Fingerfärger: ${an ? "på" : "av"}`,
      fingerFarbenTitel: "Tangenterna i färgen för det finger som trycker på dem.",
      leerzeichen: (an: boolean) => `Visa mellanslag: ${an ? "på" : "av"}`,
      leerzeichenTitel: "Mellanslag i raden som ␣. Av: ett tomrum.",
      grosseTastatur: (an: boolean) => `Stort tangentbord (med numeriskt tangentbord): ${an ? "på" : "av"}`,
      grosseTastaturHinweis:
        "Visar det numeriska tangentbordet bredvid det vanliga skärmtangentbordet - och, om det finns plats, tangenterna Insert, Home, Page Up, Page Down, End och piltangenterna. Slås på av sig självt så fort du trycker på en tangent på det numeriska tangentbordet. Om du själv stänger av det här förblir det avstängt tills du slår på det här igen.",
      grosseTastaturAnsage: (an: boolean) => `Stort tangentbord ${an ? "på" : "av"}.`,
      groesse: "Skrivfältets storlek",
      kleiner: "Mindre skrivfält",
      groesser: "Större skrivfält",
      groesseName: (p: number) => `Skrivfält ${p} procent`,
      groesseZahl: (p: number) => [p, " %"],
      groesseHinweis:
        "Fungerar också medan du övar: Alt och plus, Alt och minus. Förstorar bara skrivfältet - för hela sidan finns Ctrl och plus.",
      spielTitel: "Belöningsspel",
      nachNeuerTaste: "Efter en ny tangent",
      spielHinweis:
        "Om du får ett kort spel efter att du har låst upp en tangent. Du kan välja: Inget - det är standard; eller Isflaken, Polarexpeditionen med pingvinen. Helt frivilligt; tangenten är din ändå. Gäller den här enheten.",
      spielName: "Belöningsspel efter en ny tangent",
      spielSatz1: "Standard är ",
      spielSatz2: ": den nya tangenten är din ändå, den firas, och sedan fortsätter du. ",
      spielSatz3: " är Polarexpeditionen med pingvinen - helt frivilligt, och det räknas inte som övningstid.",
      tonTitel: "Ljud",
      ton: (aus: boolean) => (aus ? "Ljud av" : "Ljud på"),
      tonHinweis: "Slår på eller av alla ljud i programmet - belöningar, ljud vid felslag och klicket när du skriver.",
      klickName: "Klickljud för tangenterna",
      klick: "Tangentklick",
      klickTitel: "Ett svagt klick vid varje rätt anslag",
      melodie: "Melodi när du skriver",
      melodieHinweis: "Övar en jämn skrivrytm och ska vara roligt - den som skriver jämnt blir också smidigare på de osäkra tangenterna. Varje rätt tangent spelar nästa ton i en låt. Den som skriver i jämn takt får ett band till det. Med uppläsning på hörs melodin bara i höger öra. Kortkommando: Alt + 6, byt ljud med Alt + 7 och Alt + 8.",
      melodieKlang: "Ljud",
      melodieLied: "Låt",
      vorlesenTitel: "Uppläsning",
      vorlesen: (an: boolean) => (an ? "Uppläsning: på" : "Uppläsning: av"),
      vorlesenTitelAttr:
        "Appen läser upp (för den som inte använder någon skärmläsare). Om en skärmläsare är igång är det bäst att låta uppläsningen vara av.",
      strg: "Ctrl",
      strgSatz: " tystar rösten direkt - var som helst, även mitt i en mening. Nästa meddelande hörs igen.",
      wasGelesen: "Vad som läses upp (du kan välja flera)",
      liest: "läser upp:",
      woerter: "Ord",
      woerterTitel: "Läs upp varje ord när du börjar på det.",
      saetze: "Meningar",
      saetzeTitel: "Läs upp hela raden som en mening när du börjar på den.",
      buchstabieren: "Tangent för tangent",
      buchstabierenAnsage: (an: boolean) => `Tangent för tangent: ${an ? "på" : "av"}.`,
      buchstabierenTitel:
        "Efter varje anslag läses nästa tangent upp - för alla som bara lyssnar. Med uppläsning av säger skärmläsaren det: hela meningen i början av en rad, ordet i början av ett ord, sedan tangenterna. Med punktskriftsdisplay: av, så står raden still medan du skriver.",
      sprechTempo: "Talhastighet",
      sprechTempoName: "Talhastighet",
      langsam: "långsam",
      normal: "normal",
      schnell: "snabb",
      sehrSchnell: "mycket snabb",
      stimme: "Röst",
      stimmeHinweis:
        "Vilken röst som är installerad på den här enheten som läser upp - för övningstexten lika väl som för återkopplingen. Automatiskt letar själv upp en passande röst. Om en röst är för tyst eller låter otydlig på å, ä och ö, välj en annan här.",
      automatisch: "automatiskt",
      kontoTitel: "Mitt konto",
      zugangsdaten: "Mina inloggningsuppgifter",
      kontoBestaetigt:
        "Ändra e-postadress eller lösenord - och ta bort kontot när du inte behöver det längre.",
      kontoUnbestaetigt:
        "⚠️ Din e-postadress är inte bekräftad än - fram till dess skickas ingen veckorapport. Här kan du begära en ny länk eller ändra adressen.",
      einrichtungTitel: "Kom igång",
      einrichtungNeu: " Gå igenom Kom igång igen",
      einrichtungTitelAttr:
        "Tar dig steg för steg genom ålder, språk, tangentbord, ljud och uppläsning (Alt + R)",
      einrichtungSatz: "Steg för steg genom alla inställningar. Också med Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      uebungsartTitel: "Що ти тренуєш?",
      uebungsart: "Вид вправи",
      modusAdaptiv: "Моє тренування",
      modusBuecherei: "Історії",
      modusWortspiele: "Ігри зі словами",
      satzAdaptiv: " тренує саме ті клавіші, які ще непевні.",
      satzBuecherei: " - це цілі тексти, частина за частиною.",
      satzWortspiele: (k: string) => [" - це полиця: бери, що подобається. Перемикатися між ними можна також клавішами ", k, "."],
      texteTitel: "Тексти",
      klassenStufeRest: " - її для всього класу визначає педагог.",
      textstufeHinweis: (fortschritt: string) =>
        `Для якого віку підходять слова й тексти. Діє з наступного раунду - розділ «${fortschritt}» і стан навчання не змінюються.`,
      textstufeName: "Тексти для віку",
      geburtsjahr: "Рік народження",
      geburtsjahrHinweis:
        "Лише рік. Якщо його вказано і вік текстів не вибрано вручну, тексти дорослішають разом із тобою. Вік, вибраний вручну, залишається.",
      geburtsjahrBeispiel: "напр. 2016",
      sprache: "Мова",
      spracheGesperrt: "Мову для тебе визначає педагог.",
      spracheHinweis: "Мова слів і текстів для вправ. Діє з наступного раунду.",
      spracheHaupt: (name: string) =>
        `Мова цього курсу: ${name}. Додатково можна тренувати англійську - клавіші все одно з'являються в порядку цього курсу.`,
      spracheName: "Мова текстів",
      tastaturTitel: "Клавіатура",
      meineTastatur: "Моя клавіатура",
      tastaturHinweis:
        "Від цього залежать екранна клавіатура, підказки про пальці й символи, які ти тренуєш.",
      // tastaturDesLandes kennt "uk" noch nicht (Typ der Bedienung) - der Chef ergänzt die Tabelle.
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Цей курс навчає розкладки своєї країни, тому на вибір є лише такі розкладки: ${tastaturDesLandes("uk", weg)}. Вибрана зараз розкладка «${name}» до нього не підходить.`,
      tastaturName: "Розкладка клавіатури",
      anfangen: "З чого почати?",
      anfangenHinweis:
        "Якщо ти вже вмієш друкувати, не треба починати з А і О - а якщо почато надто високо, просто повернися назад. Діє одразу для «Моє тренування»; статистика й медалі залишаються.",
      anfangenName: "Точка старту в навчанні",
      tempoTitel: "Швидкість",
      zeitLassen: (an: boolean) => (an ? "Швидкість не важлива: увімкнено" : "Швидкість не важлива: вимкнено"),
      zeitLassenTitel:
        "У грі немає обмеження часу, для зірок немає цілі швидкості. Важить лише уважність.",
      zeitLassenSelbst:
        "Коли ввімкнено «Швидкість не важлива», швидкість ніде не враховується: гра йде без годинника, зірки залежать лише від уважності, а час тренування рахується далі навіть під час довгих пауз.",
      zeitLassenVonLehrkraftAn:
        "Для тебе ввімкнено «Швидкість не важлива»: швидкість ніде не враховується - лише те, наскільки уважно ти друкуєш.",
      zeitLassenVonLehrkraftAus:
        "«Швидкість не важлива» вмикає педагог. Тоді швидкість ніде не враховується - лише те, наскільки уважно ти друкуєш.",
      abstandTitel: "Інтервали між знаками (CVI)",
      abstandName: "Широкі інтервали (CVI)",
      abstandHinweis:
        "Більше місця між КОЖНИМ знаком, коли ти переписуєш текст, - для дітей з церебральним порушенням зору (CVI), у яких близько розташовані знаки зливаються. Під час друку затемнюється все, крім поля, у якому саме друкують (рядок вправи або ігрове поле); через 5 секунд без друку все знову стає світлим. Рядок вправи при цьому плавно рухається до наступного знака в ритмі твого друку, а не стрибає. Якщо багаторядкове запитання у вправах-загадках переноситься на кілька рядків, світлим залишається лише один рядок (рядок читання) - стрілками вниз і вгору можна переходити між рядками. «Звичайний» залишає знаки на звичній відстані й вмикає лише затемнення, плавний рух рядка і рядок читання. Ти можеш будь-коли змінити це тут, скільки завгодно разів. Якщо ти в класі, це може налаштувати і твій педагог - діє те, що вибрано останнім.",
      einhand: (an: boolean) => `Друк однією рукою: ${an ? "увімкнено" : "вимкнено"}`,
      einhandHinweis:
        "Для всіх, хто друкує однією рукою: великі літери й символи тоді приймаються з будь-якою клавішею Shift - а не лише з тією, що під іншою рукою.",
      wochenzielTitel: "Моя тижнева мета",
      wochenzielName: "Хвилин на тиждень",
      wochenzielHinweis:
        "Скільки хвилин на тиждень ти хочеш тренуватися. Тиждень починається в понеділок о 8:00. Нова мета діє з наступного понеділка - поточний тиждень зберігає свою мету. Твій стан показує коло під полем для друку.",
      keinWochenziel: "без тижневої мети",
      wochenzielMinuten: (n: number) =>
        mehrzahl(n, "uk", {
          one: (z) => `${z} хвилина`,
          few: (z) => `${z} хвилини`,
          many: (z) => `${z} хвилин`,
          other: (z) => `${z} хвилини`,
        }),
      wochenzielAnstehend: (datum: string, minuten: number) =>
        minuten > 0
          ? `Від ${datum} (понеділок, 8:00): ${mehrzahl(minuten, "uk", {
              one: (z) => `${z} хвилина`,
              few: (z) => `${z} хвилини`,
              many: (z) => `${z} хвилин`,
              other: (z) => `${z} хвилини`,
            })} на тиждень - цього тижня діє попередня мета.`
          : `Від ${datum} (понеділок, 8:00): без тижневої мети - цього тижня діє попередня мета.`,
      nachholen: (an: boolean) =>
        `Надолужити хвилини попередніх тижнів: ${an ? "увімкнено" : "вимкнено"}`,
      nachholenHinweis:
        "Якщо ти тренуєшся більше за тижневу мету, додаткові хвилини заповнюють попередні тижні, де мету ще не досягнуто, - спочатку найстаріший.",
      anzeigeTitel: "Вигляд",
      fingerFarben: (an: boolean) => `Кольори пальців: ${an ? "увімкнено" : "вимкнено"}`,
      fingerFarbenTitel: "Клавіші в кольорі пальця, який їх натискає.",
      leerzeichen: (an: boolean) => `Показувати пробіли: ${an ? "увімкнено" : "вимкнено"}`,
      leerzeichenTitel: "Пробіли в рядку як ␣. Вимкнено: порожнє місце.",
      grosseTastatur: (an: boolean) => `Велика клавіатура (з цифровим блоком): ${an ? "увімкнено" : "вимкнено"}`,
      grosseTastaturHinweis:
        "Показує поруч зі звичайною екранною клавіатурою ще й цифровий блок - а якщо досить місця, також клавіші Insert, Home, Page Up, Page Down, End і стрілки. Вмикається сама, щойно ти натиснеш клавішу цифрового блоку. Якщо ти вимкнеш її тут вручну, вона залишиться вимкненою, доки ти знову не ввімкнеш її тут.",
      grosseTastaturAnsage: (an: boolean) => `Велика клавіатура: ${an ? "увімкнено" : "вимкнено"}.`,
      groesse: "Розмір поля для друку",
      kleiner: "Зменшити поле для друку",
      groesser: "Збільшити поле для друку",
      groesseName: (p: number) => `Поле для друку: ${p}%`,
      groesseZahl: (p: number) => [p, "%"],
      groesseHinweis:
        "Працює і під час тренування: Alt і плюс, Alt і мінус. Збільшує лише поле для друку - для всієї сторінки є Ctrl і плюс.",
      spielTitel: "Гра-нагорода",
      nachNeuerTaste: "Після нової клавіші",
      spielHinweis:
        "Чи пропонувати тобі коротку гру після того, як відкрито нову клавішу. На вибір: Без гри - так налаштовано типово; або Крижини, Полярна експедиція з пінгвіном. Це за бажанням; клавіша і так твоя. Діє на цьому пристрої.",
      spielName: "Гра-нагорода після нової клавіші",
      spielSatz1: "Типово вибрано ",
      spielSatz2: ": нова клавіша і так твоя, її святкують, а потім ти тренуєшся далі. ",
      spielSatz3: " - це Полярна експедиція з пінгвіном: за бажанням, і вона не зараховується як час тренування.",
      tonTitel: "Звук",
      ton: (aus: boolean) => (aus ? "Звук: вимкнено" : "Звук: увімкнено"),
      tonHinweis: "Вмикає або вимикає всі звуки програми - нагороди, звуки помилок і клацання під час друку.",
      klickName: "Звук клацання клавіш",
      klick: "Клацання клавіш",
      klickTitel: "Тихе клацання при кожному правильному натисканні",
      melodie: "Мелодія під час друку",
      melodieHinweis: "Тренує рівномірний ритм друку і має приносити задоволення - хто друкує рівномірно, друкує впевненіше і на слабших клавішах. Кожна правильна клавіша грає наступну ноту пісні. Хто тримає рівний ритм, отримує ще й цілий гурт. Якщо ввімкнено читання вголос, мелодія звучить лише в правому вусі. Сполучення клавіш: Alt + 6, змінити звук - Alt + 7 і Alt + 8.",
      melodieKlang: "Звук",
      melodieLied: "Пісня",
      vorlesenTitel: "Читання вголос",
      vorlesen: (an: boolean) => (an ? "Читання вголос: увімкнено" : "Читання вголос: вимкнено"),
      vorlesenTitelAttr:
        "Програма читає вголос (для тих, хто не користується читачем екрана). Якщо працює читач екрана, краще залиш це вимкненим.",
      strg: "Ctrl",
      strgSatz: " миттєво вимикає голос - будь-де, навіть посеред речення. Наступне повідомлення знову звучить.",
      wasGelesen: "Що читати вголос (можна вибрати кілька)",
      liest: "читає:",
      woerter: "Слова",
      woerterTitel: "Читати кожне слово, коли ти його починаєш.",
      saetze: "Речення",
      saetzeTitel: "Читати весь рядок як речення, коли ти його починаєш.",
      buchstabieren: "Клавіша за клавішею",
      buchstabierenAnsage: (an: boolean) => `Клавіша за клавішею: ${an ? "увімкнено" : "вимкнено"}.`,
      buchstabierenTitel:
        "Після кожного натискання промовляти наступну клавішу - для всіх, хто лише слухає. Якщо читання вголос вимкнено, це промовляє читач екрана: на початку рядка все речення, на початку слова - слово, далі клавіші. З брайлівським дисплеєм: вимкнено, тоді рядок під час друку залишається спокійним.",
      sprechTempo: "Темп мовлення",
      sprechTempoName: "Темп мовлення",
      langsam: "повільно",
      normal: "звичайно",
      schnell: "швидко",
      sehrSchnell: "дуже швидко",
      stimme: "Голос",
      stimmeHinweis:
        "Який установлений на цьому пристрої голос читає вголос - і текст вправи, і відповіді. «Автоматично» сам шукає відповідний голос. Якщо голос надто тихий або нечітко вимовляє і, ї, є, вибери тут інший.",
      automatisch: "автоматично",
      kontoTitel: "Мій обліковий запис",
      zugangsdaten: "Мої дані для входу",
      kontoBestaetigt:
        "Змінити адресу електронної пошти або пароль - і видалити обліковий запис, якщо він тобі більше не потрібен.",
      kontoUnbestaetigt:
        "⚠️ Твою адресу електронної пошти ще не підтверджено - доти тижневий звіт не надсилається. Тут можна попросити нове посилання або змінити адресу.",
      einrichtungTitel: "Початкове налаштування",
      einrichtungNeu: " Почати налаштування знову",
      einrichtungTitelAttr:
        "Крок за кроком проводить через вік, мову, клавіатуру, звук і читання вголос (Alt + R)",
      einrichtungSatz: "Крок за кроком через усі налаштування. Також клавішами Alt + R.",
    },
});

/**
 * ★ O-PL (02.10.2026): „1 minuta · 2 minuty · 5 minut · 1,5 minuty" (Glossar
 * §2.10a) - alle vier Formen, über `mehrzahl` (Intl.PluralRules pl-PL).
 */
function minutyPl(n: number): string {
  return mehrzahl(n, "pl", {
    one: (z) => `${z} minuta`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minut`,
    other: (z) => `${z} minuty`,
  });
}

/**
 * ★ O-CS (03.10.2026): „1 minuta · 2 minuty · 5 minut · 1,5 minuty" (Glossar
 * §2.11) - alle vier Formen, über `mehrzahl` (Intl.PluralRules cs-CZ).
 */
function minutyCs(n: number): string {
  return mehrzahl(n, "cs", {
    one: (z) => `${z} minuta`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minuty`,
    other: (z) => `${z} minut`,
  });
}

const SELECT =
  "rounded-lg border border-hairline bg-surface-raised px-2 py-1.5 text-sm text-ink disabled:opacity-60";

/** Eine benannte Einstellungs-Gruppe (Überschrift + Inhalt). */
function Group({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      role="group"
      aria-labelledby={id}
      // `break-inside-avoid` + `mb-3`: Die Gruppen stehen in SPALTEN (siehe
      // Container) - keine Gruppe darf beim Spaltenumbruch zerrissen werden.
      className="mb-3 break-inside-avoid rounded-xl border border-hairline bg-surface p-3"
    >
      <h3
        id={id}
        className="m-0 mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted"
      >
        <span aria-hidden="true">{icon} </span>
        {title}
      </h3>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">{children}</div>
    </section>
  );
}

/** Beschriftung + Bedienelement, damit die Zeilen auch umgebrochen lesbar bleiben. */
/**
 * Eine beschriftete Einstellung mit ERKLÄRUNG.
 *
 * ★ Die Erklärung hängt an ZWEI Stellen, und das ist Absicht (Befund S6,
 * 22.08.2026): Für einen Screenreader ist ein `title` unsichtbar, denn
 * `title` an einem `<label>` gehört nicht zur Namens- oder
 * Beschreibungs-Rechnung des Bedienelements darin, und jedes Bedienelement
 * hier trägt ohnehin ein eigenes `aria-label`. Genau die Zielgruppe hörte die
 * Erklärung also nie. Darum steht sie zusätzlich als sr-only-Text im Baum und
 * wird per `aria-describedby` an das Bedienelement gehängt — Sprachausgabe
 * und Braillezeile bekommen sie nach dem Namen, das Bild bleibt unverändert.
 *
 * ★ N15c: die Maus-Auskunft hängt seither an `Hinweisflaeche` (groß, sofort)
 * statt am nativen `title` (langsam, winzig, unsichtbar für die Tastatur) -
 * und zwar an der BESCHRIFTUNG, nicht am ganzen `<label>`: Ein `Tipp` darf laut
 * Hausregel nicht in ein `<label>`, aber `Hinweisflaeche` ist kein Tabstopp
 * und stört die Klick-Weiterleitung an das Bedienelement nicht.
 */
function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  const hintId = useId();
  const bedienelement =
    hint && isValidElement(children)
      ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
          "aria-describedby": hintId,
        })
      : children;
  return (
    <label className="flex flex-col gap-1 text-sm text-ink-soft">
      {hint ? (
        <Hinweisflaeche hilfe={hint}>
          <span>{label}</span>
        </Hinweisflaeche>
      ) : (
        <span>{label}</span>
      )}
      {bedienelement}
      {hint ? (
        <span id={hintId} className="sr-only">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

/** Die Minuten, die „Mein Wochenziel" anbietet (0 = kein Wochenziel). */
const WOCHENZIEL_MINUTEN = [0, 10, 15, 20, 30, 45, 60, 90, 120, 180] as const;

/**
 * ★ „MEIN WOCHENZIEL" (19.09.2026) - das Wochenziel, das ein Konto OHNE
 * Lehrkraft sich selbst setzt. Johannes: *„Selbstlernende sollen sich alles
 * einstellen können"*.
 *
 * Dieselbe Rechnung wie beim Wochenziel, das eine Lehrkraft setzt
 * (`wochenziel.ts`): Ein neues Ziel gilt ab dem NÄCHSTEN Montag 8:00, die
 * laufende Woche behält ihres (`zielAendern`, im Backend). Darum zeigt das
 * Auswahlfeld das Ziel der NÄCHSTEN Woche - das ist, was eine Wahl ändert -,
 * und ein Satz darunter sagt, wann es beginnt, solange es noch aussteht.
 *
 * Anders als beim `GoalEditor` der Lehrkraft (Speichern-Knopf und Rückfrage)
 * wirkt jede Wahl sofort, wie jedes andere Feld im Zahnrad; der Tipp und der
 * Satz darunter erklären den Montag. Ziel-Kalenderwochen, „Überfällige
 * zurücksetzen" und „Wochenziel erlassen" bleiben Werkzeuge der Lehrkraft.
 */
function MeinWochenziel({
  ziel,
  onChange,
  t,
  sprache,
  sprich,
  sprichGewaehlt,
}: {
  ziel: { verlauf: readonly ZielAbschnitt[]; nachholen: boolean };
  onChange: (ziel: { minuten: number; nachholen: boolean }) => void;
  t: (typeof T)["de"];
  sprache: BedienSprache;
  sprich: (satz: string) => void;
  sprichGewaehlt: (was: string) => void;
}) {
  const jetzt = Date.now();
  const naechste = naechsteWocheKey(jetzt);
  const minutenNaechste = zielFuerWoche(ziel.verlauf, naechste);
  const minutenJetzt = zielFuerWoche(ziel.verlauf, aktuelleWocheKey(jetzt));
  const angebot: number[] = WOCHENZIEL_MINUTEN.includes(
    minutenNaechste as (typeof WOCHENZIEL_MINUTEN)[number],
  )
    ? [...WOCHENZIEL_MINUTEN]
    : [...WOCHENZIEL_MINUTEN, minutenNaechste].sort((a, b) => a - b);
  const bezeichnung = (n: number) => (n > 0 ? t.wochenzielMinuten(n) : t.keinWochenziel);
  const montagMs = wochenStartFuerSchluessel(naechste);
  // ★ E11a-4 (26.09.2026): dritte Fassung statt der alten `=== "en"`-Weiche
  // (Falle 30) - sonst bekäme „fr" hier das deutsche Zahlenformat statt
  // eines eigenen (Glossar §9.1: Datum, hier kurz wie beim Englischen).
  const montag =
    montagMs === undefined
      ? ""
      : sprache === "de"
        ? `${String(new Date(montagMs).getDate()).padStart(2, "0")}.${String(new Date(montagMs).getMonth() + 1).padStart(2, "0")}.`
        : // ★ ES-O: Tabelle statt Weiche - „es" bekam hier sonst das deutsche Format.
          new Date(montagMs).toLocaleDateString(MONTAG_GEBIET[sprache], { day: "numeric", month: "short" });
  return (
    <>
      <Field label={t.wochenzielName} hint={t.wochenzielHinweis}>
        <select
          className={SELECT}
          value={String(minutenNaechste)}
          onChange={(e) => {
            const minuten = Number(e.target.value);
            onChange({ minuten, nachholen: ziel.nachholen });
            sprichGewaehlt(bezeichnung(minuten));
          }}
          aria-label={t.wochenzielName}
        >
          {angebot.map((n) => (
            <option key={n} value={n}>
              {bezeichnung(n)}
            </option>
          ))}
        </select>
      </Field>
      <Tipp text={t.nachholenHinweis}>
        {(hinweisId) => (
          <button
            type="button"
            aria-pressed={ziel.nachholen}
            className={(ziel.nachholen ? "btn-primary" : "btn-secondary") + " btn-toggle"}
            onClick={() => {
              const next = !ziel.nachholen;
              onChange({ minuten: minutenNaechste, nachholen: next });
              sprich(t.nachholen(next) + ".");
            }}
            aria-describedby={hinweisId}
          >
            {t.nachholen(ziel.nachholen)}
          </button>
        )}
      </Tipp>
      {minutenNaechste !== minutenJetzt && (
        <p className="m-0 basis-full text-sm text-ink-muted">
          {t.wochenzielAnstehend(montag, minutenNaechste)}
        </p>
      )}
    </>
  );
}

export interface TypingSettingsProps {
  /**
   * ÜBUNGSART — „Mein Training" / „Geschichten" / „Wortspiele" (22.08.2026; „Lektionen" ist seit E7, 19.09.2026, entfallen).
   * Sie stand bis dahin in der grauen Leiste über der Übungskarte; die Leiste
   * ist entfallen (Charge „SCHLANK"). Fehlen `mode`/`onModeChange`, wird gerade
   * nicht geübt (Statistik, Anmeldung) — dann fehlt die Gruppe.
   */
  mode?: TrainerMode;
  onModeChange?: (m: TrainerMode) => void;
  /** Kürzel-Anzeige für das Reihum-Schalten der Übungsart. */
  modeKuerzel?: string;
  /** Textstufe (Alter) — bei Lernenden am Konto, sonst lokal. */
  stufe: Stufe;
  /**
   * ★★★ B11 (11.09.2026): OHNE den Rückruf gibt es kein Auswahlfeld, sondern
   * einen Satz - für Kinder einer Klasse. Ihre Textstufe kommt seit dem Umbau
   * aus der SCHULSTUFE der Klasse (`klassenEinstellungen.ts`); ein Feld, das
   * ein Kind verstellen kann und das beim nächsten Start wieder auf dem Wert
   * der Klasse steht, wäre ein Schalter ohne Wirkung.
   *
   * ⚠️ Kein `disabled` und kein ausgegrautes Feld (Hausregel R10) - es steht
   * gar kein Bedienelement da, dafür die Auskunft, wer es eingestellt hat.
   */
  onStufeChange?: (s: Stufe) => void;
  /**
   * Geburtsjahr. Ohne den Rückruf fehlt das Feld — Kinder MIT
   * Lehrkraft bekommen es von ihr, genau wie „Zeit lassen" (der Server-Guard
   * tt_pupils_field_guard erzwingt dasselbe).
   */
  geburtsjahr?: number;
  onGeburtsjahrChange?: (jahr: number | undefined) => void;
  /** Sprache der Texte. */
  lang: Lang;
  onLangChange: (l: Lang) => void;
  /** Die Lehrkraft hat die Sprache festgelegt (dann gesperrt). */
  langLocked?: boolean;
  /**
   * Startpunkt OHNE Anmeldung: mit wie vielen Einheiten „Mein Training" beginnt.
   * `undefined` = nicht anbieten (angemeldete Lernende bekommen ihn von der
   * Lehrkraft, siehe Klassen-Verwaltung).
   */
  startUnits?: number;
  onStartUnitsChange?: (units: number) => void;
  /**
   * ★ E1 (24.09.2026): der Lernweg der Person - die Startpunkte sind
   * ANZAHLEN und gelten nur in ihm (Bauplan englischer Lehrgang §2.4).
   */
  lernweg: Lernweg;
  /**
   * „Einrichtung neu starten" — führt noch einmal durch Alter, Sprache,
   * Tastatur, Startpunkt und Ton (Alt + R). Der Knopf steht hier, weil hier
   * gesucht wird, wer etwas umstellen will; das Kürzel allein finden nur die,
   * die die Kürzel-Liste kennen. Fehlt der Callback, fehlt der Knopf.
   */
  onEinrichtungNeu?: () => void;
  /**
   * „Zeit lassen" — für diese Person zählt das Tempo nirgends (Spiel, Sterne,
   * Leistungsstufe, Übezeit-Uhr; siehe lib/typing/noTimePressure.ts).
   */
  zeitLassen?: boolean;
  /**
   * Umschalten erlaubt? Fehlt der Callback, gehört der Schalter der Lehrkraft
   * (Kinder einer Klasse) — dann steht hier nur, wie es gerade eingestellt ist.
   */
  onZeitLassenChange?: (on: boolean) => void;
  /**
   * „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026): 1 = aus, 2 = doppelt,
   * 3 = dreifach, 4 = vierfach - grösserer Abstand zwischen JEDEM Zeichen
   * beim Abschreiben, für Kinder mit zerebraler Sehbehinderung (CVI).
   */
  zeichenabstand?: ZeichenabstandFaktor;
  /**
   * ★ Seit 19.09.2026 bekommt JEDE Person diesen Rückruf - auch ein Kind einer
   * Klasse (Johannes: *„Kinder dürfen es ändern wie sie möchten"*). Fehlt er
   * (Tests, andere Einbettungen), fehlt die Gruppe. Den Satz „deine Lehrkraft
   * hat das eingestellt" statt eines Feldes gibt es nicht mehr.
   */
  onZeichenabstandChange?: (faktor: ZeichenabstandFaktor) => void;
  /**
   * „Einhand schreiben" (19.09.2026): Umschalt-Gegenhand-Regel aus. In einer
   * Klasse setzt es die Lehrkraft - dann fehlt der Rückruf und mit ihm der
   * Schalter; alle anderen (Konto ohne Lehrkraft, Gäste, Lehrkräfte, die
   * selbst üben) legen es hier selbst um.
   */
  einhand?: boolean;
  onEinhandChange?: (on: boolean) => void;
  /**
   * ★ „Gezielt üben" (13.11.2026): die Zeile in der Gruppe „Was übst du?". Fehlt der Wert, gibt es die Zeile nicht
   * (andere Einbettungen, Tests). `vonLehrkraft`: nur lesen, kein Knopf (Kind einer Klasse).
   */
  gezielt?: {
    wirksam: Gezielt | null;
    vonLehrkraft: boolean;
    onWaehlen: () => void;
    onAus: () => void;
  };
  /**
   * „Mein Wochenziel" (19.09.2026) - nur für ein Konto OHNE Lehrkraft (in
   * einer Klasse setzt es die Lehrkraft). Der Verlauf kommt aus
   * `kindWochenzielAusFeldern`; ein neues Ziel gilt wie überall erst ab dem
   * nächsten Montag (`zielAendern`). Fehlt eins von beiden, fehlt die Gruppe.
   */
  wochenziel?: { verlauf: readonly ZielAbschnitt[]; nachholen: boolean };
  onWochenzielChange?: (ziel: { minuten: number; nachholen: boolean }) => void;
  /**
   * Der Knopf „🎧 Einführung" (IntroPodcastKnopf) — er stand bis 09.08.2026
   * dauerhaft im Seitenkopf, obwohl die Karte beim ersten Start ohnehin von
   * selbst kommt (Wunsch Johannes: „muss nicht immer angezeigt werden"). Jetzt
   * sitzt er hier, in derselben Gruppe wie die Einrichtung — dort sucht, wer
   * ihn später noch einmal braucht. Als Slot übergeben, damit dieser Bereich
   * nichts über Podcast-Folgen wissen muss.
   */
  einfuehrung?: ReactNode;
  /**
   * Selbstlernendes Konto (ohne Klasse)? Dann erscheint hier die Gruppe „Mein
   * Konto" mit dem Weg zu den Zugangsdaten — E-Mail ändern gehört dorthin, wo
   * man Einstellungen sucht (Wunsch Johannes 09.08.). Klassen-Kinder sehen sie
   * nicht: Ihren Zugang verwaltet die Lehrkraft.
   */
  selbstlernend?: boolean;
  /** Adresse schon per Link bestätigt? Sonst steht hier ein Hinweis. */
  adresseBestaetigt?: boolean;
}

export function TypingSettings({
  mode,
  onModeChange,
  modeKuerzel = "Alt + B",
  stufe,
  onStufeChange,
  geburtsjahr,
  onGeburtsjahrChange,
  lang,
  onLangChange,
  langLocked,
  startUnits,
  onStartUnitsChange,
  lernweg,
  onEinrichtungNeu,
  zeitLassen = false,
  onZeitLassenChange,
  zeichenabstand = 1,
  onZeichenabstandChange,
  einhand = false,
  onEinhandChange,
  gezielt,
  wochenziel,
  onWochenzielChange,
  einfuehrung,
  selbstlernend,
  adresseBestaetigt,
}: TypingSettingsProps) {
  const layout = useKeyboardLayout();
  const belohnungsSpiel = useBelohnungsSpiel();
  // ★ EN2: Bedienungssprache (ohne Provider immer „de") und ihre Stimme.
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` - T kennt „fr" bereits seit E11a. ⚠️ AUSSER `layoutTexte()`
  // (Tastatur-Namen): `layouts.ts` steht auf der Nicht-anfassen-Liste dieser
  // Etappe (E9a-2/E9-kids arbeiten dort) - die Tastatur-Namen bleiben darum
  // vorerst englisch für „fr" (`layoutSprache` unten, wie in Einrichtung.tsx).
  const { spracheGewaehlt: sprache } = useBedienSprache();
  // ★ E11a-5 (26.09.2026): aufgehoben - `layoutTexte()` kennt jetzt „fr"
  // (`LAYOUT_TEXTE_FR` in `layouts.ts`); die Tastatur-Namen sind französisch.
  const layoutSprache = sprache;
  // ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): am Mac nennen die
  //   Hinweise „Wahl und Plus" bzw. „(Wahl + R)" - `wahlTexte`, ohne Mac dieselbe Tabelle.
  const t = wahlTexte(T[sprache], sprache);
  const stimme = useBedienStimme();
  const modusName: Record<TrainerMode, string> = {
    adaptiv: t.modusAdaptiv,
    buecherei: t.modusBuecherei,
    wortspiele: t.modusWortspiele,
  };
  /**
   * ★ K2 (19.09.2026): derselbe Satz, den der Absatz unter den drei
   * Schaltern trägt (siehe unten) - nur je Schalter aufgeteilt, für seinen
   * eigenen Hinweis. Kein neuer Wortlaut, keine zweite Quelle
   * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
   */
  const modusHinweis: Record<TrainerMode, string> = {
    adaptiv: `${modusName.adaptiv}${t.satzAdaptiv}`,
    buecherei: `${modusName.buecherei}${t.satzBuecherei}`,
    wortspiele: `${modusName.wortspiele}${t.satzWortspiele(modeKuerzel).join("")}`,
  };
  // ★ ES-O (27.09.2026): Tabellen statt der Weiche `=== "en" ? … : "fr" ? …`
  // (die lieferte für „es" still Deutsch, Falle 30).
  const abstandLabels = ZEICHENABSTAND_LABELS_JE_SPRACHE[sprache];
  const spielLabels = BELOHNUNGSSPIEL_LABELS_JE_SPRACHE[sprache];
  const layoutText = layoutTexteIn(layout, layoutSprache);
  // Die Wahl gibt es NUR in der Jugend-Tonlage (11-15): Kinder spielen immer die
  // Expedition, Erwachsene bekommen gar keine Belohnungs-Runde angeboten - für
  // beide wäre der Schalter eine Einstellung ohne Wirkung (Bauplan §0b.4).
  const darfSpielWaehlen = skinForStufe(stufe) === "jugend";
  const voiceEnabled = useVoice((s) => s.enabled);
  const setVoice = useVoice((s) => s.setEnabled);
  const rate = useVoice((s) => s.rate);
  const setRate = useVoice((s) => s.setRate);
  const readWords = useVoice((s) => s.readWords);
  const readSentences = useVoice((s) => s.readSentences);
  const setReadWords = useVoice((s) => s.setReadWords);
  const setReadSentences = useVoice((s) => s.setReadSentences);
  const voiceURI = useVoice((s) => s.voiceURI);
  const setVoiceURI = useVoice((s) => s.setVoiceURI);
  const voices = useAvailableVoices();

  // Anzeige: Geräte-Einstellungen, siehe Gruppe „Anzeige".
  const fingerFarben = useTypingA11y((s) => s.fingerFarben);
  const setFingerFarben = useTypingA11y((s) => s.setFingerFarben);
  const leerzeichenZeigen = useTypingA11y((s) => s.leerzeichenZeigen);
  const setLeerzeichenZeigen = useTypingA11y((s) => s.setLeerzeichenZeigen);
  const grosseTastatur = useGrosseTastatur((s) => s.aktiv);
  const setGrosseTastatur = useGrosseTastatur((s) => s.setAktiv);
  const tastenAnsage = useTypingA11y((s) => s.tastenAnsage);
  const setTastenAnsage = useTypingA11y((s) => s.setTastenAnsage);
  // Finger-Farben sind nur in Hell/Dunkel sinnvoll - die Kontrast-Modi leben
  // von garantierten Kontrastpaaren (gleiche Regel wie in TypingSession).
  const kontrast = useContrast((s) => s.mode);
  const colorsAllowed = kontrast === "hell" || kontrast === "dunkel";
  const farbenGrundId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const zoom = useTypingA11y((s) => s.zoom);
  const zoomIn = useTypingA11y((s) => s.zoomIn);
  const zoomOut = useTypingA11y((s) => s.zoomOut);
  const atMinZoom = zoom <= TIPP_ZOOM_STUFEN[0];
  const atMaxZoom = zoom >= TIPP_ZOOM_STUFEN[TIPP_ZOOM_STUFEN.length - 1];

  const [muted, setMuted] = useState(() => isSoundMuted());
  const [tick, setTick] = useState(() => isKeyTickOn());
  const [jahrText, setJahrText] = useState(geburtsjahr ? String(geburtsjahr) : "");
  // ★★★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M2): die Übungssprachen, die auf
  // diesem Weg möglich sind. Auf Weg „es" stand hier „Alemán" gewählt (der
  // Wert „es" hatte keine Option), zurück zu Spanisch ging es nicht mehr.
  const uebungsSprachen = uebungsSprachenImWeg(lernweg);
  const spracheGebunden = uebungsSprachen.length <= 1;
  // ★ D1 Nr. 18 (28.09.2026): Weg „fr"/„es" bieten die Hauptsprache UND
  // Englisch an (vorher: nur die eine, `spracheGebunden`); der Hinweis sagt,
  // dass die Reihenfolge der Tasten die des Lehrgangs bleibt.
  const hauptsprache = hauptspracheDesWeges(lernweg);
  // ★ D1 Nr. 7: die Tastaturen, die dieser Weg anbietet - die eingestellte
  // bleibt sichtbar in der Liste, auch wenn sie nicht zum Weg passt.
  const tastaturFremd = !tastaturPasstZumWeg(layout.id, lernweg);
  const tastaturAngebot = [
    ...tastaturenFuerWeg(lernweg, franzoesischLehrgangProbeAn(), spanischLehrgangProbeAn(), {
      it: italienischLehrgangProbeAn(),
      pl: polnischLehrgangProbeAn(),
      tr: tuerkischLehrgangProbeAn(),
      cs: tschechischLehrgangProbeAn(),
      // ★★★ G3b (25.10.2026): die Schalter der neun Gerüst-Sprachen (ihre Tastaturen nur mit dem eigenen Schalter).
      ...geruestLehrgangProben(),
    }),
    ...(tastaturFremd ? [layout] : []),
  ];

  // Nur Stimmen in den Sprachen, die das Programm wirklich vorliest - die Regel
  // steht in `stimmenAuswahl.ts` und gilt genauso für das Menü unter dem
  // Lautsprecher-Schalter (17.10.2026).
  const sortedVoices = stimmenZurAuswahl(voices, voiceURI, lang, lernweg);

  /*
   * ★★★★★ „Buchstabieren" steht IMMER da - auch bei „Vorlesen aus"
   * (Julian Iriogbe, obvita St. Gallen, 23.09.2026: *„Ich habe vergeblich die
   * Funktion ‚Buchstabieren' gesucht, weil ich … mit Alt+V zunächst das
   * Vorlesen ausgeschaltet hatte."*). Genau dort braucht man ihn: Bei
   * „Vorlesen aus" ist er der EINZIGE Weg, mit dem Screenreader allein etwas
   * beim Tippen zu hören. Bis heute stand er nur im Block „Vorlesen an".
   */
  const buchstabierenSchalter = (
    <Tipp text={t.buchstabierenTitel}>
      {(hinweisId) => (
        <button
          type="button"
          aria-pressed={tastenAnsage === "naechste"}
          className={
            (tastenAnsage === "naechste" ? "btn-primary" : "btn-secondary") +
            " btn-toggle"
          }
          onClick={() => {
            const an = tastenAnsage !== "naechste";
            setTastenAnsage(an ? "naechste" : "aus");
            stimme.sprich(t.buchstabierenAnsage(an));
          }}
          aria-describedby={hinweisId}
        >
          {t.buchstabieren}
        </button>
      )}
    </Tipp>
  );

  const starts = startPunkte(sprache, lernweg);

  return (
    // ★ 30.08.2026 (Johannes: „die Aufteilung schaut völlig unfertig aus"):
    //   SPALTEN statt Raster. Das Zwei-Spalten-Raster richtete jede Zeile an
    //   der höchsten Gruppe aus - daneben klafften Löcher. `columns` füllt
    //   erst die linke, dann die rechte Spalte lückenlos auf; das ist zugleich
    //   die Tab- und Vorlese-Reihenfolge (erst links hinunter, dann rechts).
    <div className="sm:columns-2 sm:gap-3" lang={htmlLang(sprache)}>
      {/* 1. Was übst du? — die Übungsart (22.08.2026, Charge „SCHLANK").
             Sie steht ZUERST: Es ist die einzige Einstellung, die sofort
             etwas anderes auf den Bildschirm bringt.

             ★ Warum aria-pressed-Knöpfe und KEINE radiogroup: Eine
             `radiogroup` verlangt Pfeiltasten-Steuerung mit wanderndem
             Tabstopp - genau die Bedienung, an der ein Kind mit Screenreader
             hier scheitert (dieselbe Begründung wie beim Konto-Menü, das
             bewusst kein `role="menu"` ist). Drei ganz normale Schalter
             melden „gedrückt" bzw. „nicht gedrückt", jeder ist mit Tab
             erreichbar, und die Braillezeile zeigt den Zustand mit. */}
      {((mode !== undefined && onModeChange !== undefined) ||
        (startUnits !== undefined && onStartUnitsChange) ||
        gezielt) && (
        <Group id="tt-set-uebungsart" icon="🎯" title={t.uebungsartTitel}>
          {mode !== undefined && onModeChange !== undefined && (
          <>
          <div className="flex flex-wrap gap-1" role="group" aria-label={t.uebungsart}>
            {TRAINER_MODES.map((m) => (
              <Tipp key={m} text={modusHinweis[m]}>
                {(hinweisId) => (
                  <button
                    type="button"
                    aria-pressed={mode === m}
                    aria-keyshortcuts="Alt+B"
                    aria-describedby={hinweisId}
                    onClick={() => {
                      // Zustands-Ansage nur fürs Vorlesen — Screenreader melden den
                      // aria-pressed-Wechsel selbst.
                      if (mode !== m) stimme.sprich(trainerModeAnsage(m, stimme.lang()));
                      onModeChange(m);
                    }}
                    className={(mode === m ? "btn-primary" : "btn-secondary") + " btn-toggle"}
                  >
                    {m === "buecherei" ? <span aria-hidden="true">📖 </span> : null}
                    {modusName[m]}
                  </button>
                )}
              </Tipp>
            ))}
          </div>
          {/*
            ⚠️ Dieser Satz zählt die Bereiche auf - er MUSS mitwachsen, wenn
            `TRAINER_MODES` einen dazubekommt. Beim vierten Bereich
            („Wortspiele", 02.09.2026) stand er einen Deploy lang mit drei
            Bereichen da, während vier Knöpfe darüber lagen: zwei Stellen, die
            dasselbe wissen, und eine wusste es nicht.
          */}
          <p className="m-0 basis-full text-sm text-ink-muted">
            <strong>{t.modusAdaptiv}</strong>{t.satzAdaptiv}{" "}
            <strong>{t.modusBuecherei}</strong>{t.satzBuecherei}{" "}
            <strong>{t.modusWortspiele}</strong>
            {t.satzWortspiele(modeKuerzel)}
          </p>
          </>
          )}
          {/* ★ 13.11.2026 (Johannes): „Womit anfangen" gehört zu „Was übst du?",
              nicht zur Tastatur - stand bis dahin in der Gruppe „Tastatur". */}
          {startUnits !== undefined && onStartUnitsChange && (
            <Field label={t.anfangen} hint={t.anfangenHinweis}>
              <select
                className={SELECT}
                value={String(startUnits)}
                onChange={(e) => {
                  const units = Number(e.target.value);
                  onStartUnitsChange(units);
                  const chosen = starts.find((s) => s.units === units);
                  if (chosen) stimme.sprich(ansageStart(chosen.label, stimme.lang()));
                }}
                aria-label={t.anfangenName}
              >
                {starts.map((s) => (
                  <option key={s.key} value={s.units}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {/* ★ GEZIELT ÜBEN (13.11.2026): eine Zeile, die Auswahl selbst steht im Dialog `GezieltDialog`. */}
          {gezielt && (
            <GezieltZeile
              wirksam={gezielt.wirksam}
              vonLehrkraft={gezielt.vonLehrkraft}
              onWaehlen={gezielt.onWaehlen}
              onAus={gezielt.onAus}
              farben={fingerFarben && colorsAllowed}
            />
          )}
        </Group>
      )}

      {/* 2. Texte — Alter und Sprache der Übungstexte */}
      <Group id="tt-set-texte" icon="📖" title={t.texteTitel}>
        {/*
          ★★★ B11 (11.09.2026): Für ein Kind einer Klasse steht hier ein SATZ
          statt eines Auswahlfeldes - die Textstufe kommt aus der Schulstufe der
          Klasse. Der Satz sagt, was gilt und wer es eingestellt hat; ein
          ausgegrautes Feld sagte nur „geht nicht" (Hausregel R10).
        */}
        {!onStufeChange ? (
          <p className="m-0 text-sm text-ink-muted">
            {/* ⚠️ KEIN zweiter Doppelpunkt: `textstufeLabel` bringt schon einen
                mit („Texte passend für:") - im Browser gemessen stand dort
                „Texte passend für:: 11-15 Jahre". */}
            <strong className="text-ink">{bedienCopy(stufe, sprache).textstufeLabel}</strong>{" "}
            {stufeLabel(stufe, sprache)}
            {t.klassenStufeRest}
          </p>
        ) : (
        <Field
          label={bedienCopy(stufe, sprache).textstufeLabel}
          hint={t.textstufeHinweis(bedienCopy(stufe, sprache).progressLabel)}
        >
          <select
            className={SELECT}
            value={stufe}
            onChange={(e) => {
              const s = e.target.value as Stufe;
              onStufeChange(s);
              // ★ 31.08.2026 (Vollaudit, Zensus Nr 44): Die vier Auswahlfelder
              // dieser Gruppe sind vom selben Bautyp - „Tastatur" und
              // „Startpunkt" sagen ihre Wahl seit jeher an, „Textstufe" und
              // „Sprache" nicht. Ein Kind änderte damit die Grundlage aller
              // Übungstexte, ohne eine Silbe zurückzubekommen. Derselbe
              // zweisprachige Satz, den die Einrichtung für die Sprachwahl
              // schon benutzt (Einrichtung.tsx:341) - kein neuer Wortlaut.
              stimme.sprich(ansageGewaehlt(stufeLabel(s, sprache), stimme.lang()));
            }}
            aria-label={t.textstufeName}
          >
            {STUFEN.map((s) => (
              <option key={s} value={s}>
                {stufeLabel(s, sprache)}
              </option>
            ))}
          </select>
        </Field>
        )}
          {/* ★ 30.08.2026: „(freiwillig)" ist weg - das Jahr gehört seither zu
              jeder Anmeldung. Hier steht es trotzdem als Feld und nicht als
              Pflicht: Dieser Bereich ändert ein Konto, das es schon gibt, und
              Gäste ohne Konto stellen damit nur dieses Gerät ein.
              ⚠️ Die Auswahl „Textstufe (Alter)" darüber BLEIBT (Johannes
              30.08.: „wer sie nachträglich in einstellungen ändert hat sie eben
              so geändert wie er das möchte"). Sie ist keine zweite Wahrheit
              neben dem Jahr, sondern der ausdrückliche Eingriff, den das
              Vorrangmodell in `stufeFuer` vorsieht - anders als die vier
              Schalter in der Einrichtung, die am selben Tag weggefallen sind:
              Dort standen sie NEBEN dem Jahr, in derselben Frage, und nahmen
              ihm still die Wirkung. */}
        {onGeburtsjahrChange && (
          <Field label={t.geburtsjahr} hint={t.geburtsjahrHinweis}>
            <input
              className={SELECT}
              inputMode="numeric"
              value={jahrText}
              placeholder={t.geburtsjahrBeispiel}
              aria-label={t.geburtsjahr}
              onChange={(e) => {
                const roh = e.target.value;
                setJahrText(roh);
                onGeburtsjahrChange(geburtsjahrAusText(roh));
              }}
            />
          </Field>
        )}
        <Field
          label={t.sprache}
          hint={
            langLocked
              ? t.spracheGesperrt
              : hauptsprache
                ? t.spracheHaupt(langLabel(hauptsprache, sprache))
                : t.spracheHinweis
          }
        >
          <select
            value={lang}
            onChange={(e) => {
              // ★★★ Der Riegel, der `disabled` ersetzt (Bauart §3). Die Liste
              // ist gesteuert: Weil `value` an `lang` hängt, holt React einen
              // Wert, der hier nicht durchkommt, sofort wieder zurück.
              if (langLocked || spracheGebunden) return;
              const l = e.target.value as Lang;
              onLangChange(l);
              // ★ 31.08.2026 (Vollaudit, Zensus Nr 46): wortgleich mit der
              // Einrichtung (Einrichtung.tsx:341). Dieselbe Wahl sagte dort
              // sehr wohl an - nur im Zahnrad nicht. Die Ansage kommt in der
              // Vorlese-Sprache; wer auf Englisch stellt, hört „English
              // selected.", wer auf Deutsch stellt, „Deutsch gewählt."
              stimme.sprich(ansageGewaehlt(langLabel(l, sprache), stimme.lang()));
            }}
            aria-label={t.spracheName}
            // ★★★ `aria-disabled` UND NICHT `disabled` (Bauart §3) - und hier
            // bringt es mehr als nur die Fokus-Sicherheit: Eine ausgeschaltete
            // Liste ist gar kein Tabstopp. Ein Kind, das mit der Tabtaste durch
            // die Einstellungen geht, käme nie an ihr vorbei und erführe nie,
            // dass es die Sprache GIBT - geschweige denn, warum sie feststeht.
            // So hört es „Sprache der Texte, nicht verfügbar", und der Hinweis
            // daneben sagt: „Die Lehrkraft hat die Sprache für dich festgelegt."
            // ★ ES-M2: auf Weg „fr"/„es" ebenso - die Sprache gehört zum
            // Lehrgang, der Hinweis daneben sagt es.
            aria-disabled={langLocked || spracheGebunden || undefined}
            className={SELECT + (langLocked || spracheGebunden ? " opacity-60" : "")}
          >
            {uebungsSprachen.map((l) => (
              <option key={l} value={l}>
                {langLabel(l, sprache)}
              </option>
            ))}
          </select>
        </Field>
      </Group>

      {/* 3. Tastatur — welche Tastatur liegt vor, und (ohne Konto) wo es losgeht */}
      <Group id="tt-set-tastatur" icon="⌨️" title={t.tastaturTitel}>
        {/* ★ D1 Nr. 7 (28.09.2026): auf Weg „fr"/„es" nur die Tastaturen seines
            Landes. Passt die eingestellte nicht, steht sie trotzdem in der Liste
            (sonst zeigte das Feld still eine andere) - und der Hinweis sagt es. */}
        <Field
          label={t.meineTastatur}
          hint={
            tastaturFremd && hauptsprache
              ? t.tastaturNichtImWeg(hauptsprache, layoutTexteIn(layout, layoutSprache).label)
              : t.tastaturHinweis
          }
        >
          <select
            className={SELECT}
            value={layout.id}
            onChange={(e) => {
              setLayout(e.target.value);
              const chosen = tastaturAngebot.find(
                (l) => l.id === e.target.value,
              );
              if (chosen)
                stimme.sprich(ansageTastatur(layoutTexteIn(chosen, layoutSprache).kurz, stimme.lang()));
            }}
            aria-label={t.tastaturName}
          >
            {/* ★ E11a-5: Tastatur-Namen in der Sprache der Bedienung (bis
                dahin für „fr" englisch mit eigenem `lang`). */}
            {tastaturAngebot.map((l) => (
              <option key={l.id} value={l.id}>
                {layoutTexteIn(l, layoutSprache).label}
              </option>
            ))}
          </select>
        </Field>
        {/* ★ „Einhand schreiben" (19.09.2026) - hier, weil es die Umschalttasten
               betrifft. Nur mit Rückruf: In einer Klasse setzt es die
               Lehrkraft, dann steht hier nichts (R10, nichts wird `disabled`). */}
        {onEinhandChange && (
          <Tipp text={t.einhandHinweis}>
            {(hinweisId) => (
              <button
                type="button"
                aria-pressed={einhand}
                className={(einhand ? "btn-primary" : "btn-secondary") + " btn-toggle"}
                onClick={() => {
                  const next = !einhand;
                  onEinhandChange(next);
                  stimme.sprich(ansageSchalter("einhandAn", "einhandAus", next, stimme.lang()));
                }}
                aria-describedby={hinweisId}
              >
                <span aria-hidden="true">✋</span> {t.einhand(einhand)}
              </button>
            )}
          </Tipp>
        )}
        {layoutText.hinweis && (
          <p className="m-0 basis-full text-sm text-ink-muted">{layoutText.hinweis}</p>
        )}
      </Group>

      {/* 4. Tempo — „Zeit lassen" (14.08.2026) */}
      <Group id="tt-set-tempo" icon="🐢" title={t.tempoTitel}>
        <Tipp text={t.zeitLassenTitel}>
          {(hinweisId) => (
            <button
              type="button"
              aria-pressed={zeitLassen}
              // disabled-ok: Dieser Knopf ist gesperrt, WEIL die Lehrkraft „Zeit
              // lassen" für dieses Kind führt - nicht, weil gerade etwas läuft. Er
              // ist damit von der ersten bis zur letzten Sekunde kein Tabstopp und
              // kann den Fokus nicht unter sich wegziehen (das ist genau der Fall,
              // gegen den R5 geschrieben ist). Ein `aria-disabled`-Knopf, der
              // niemals etwas tun kann, wäre hier ein leeres Versprechen im
              // Tab-Weg.
              disabled={!onZeitLassenChange}
              className={(zeitLassen ? "btn-primary" : "btn-secondary") + " btn-toggle"}
              onClick={() => {
                if (!onZeitLassenChange) return;
                const next = !zeitLassen;
                onZeitLassenChange(next);
                stimme.sprich(ansageSchalter("zeitLassenAn", "zeitLassenAus", next, stimme.lang()));
              }}
              aria-describedby={hinweisId}
            >
              <span aria-hidden="true">🐢</span>{" "}
              {t.zeitLassen(zeitLassen)}
            </button>
          )}
        </Tipp>
        <p className="m-0 basis-full text-sm text-ink-muted">
          {onZeitLassenChange
            ? t.zeitLassenSelbst
            : zeitLassen
              ? t.zeitLassenVonLehrkraftAn
              : t.zeitLassenVonLehrkraftAus}
        </p>
      </Group>

      {/* 4a. Mein Wochenziel (19.09.2026, Johannes: „Selbstlernende sollen
             sich alles einstellen können") - nur für ein Konto ohne
             Lehrkraft; in einer Klasse setzt es die Lehrkraft. */}
      {wochenziel && onWochenzielChange && (
        <Group id="tt-set-wochenziel" icon="🗓" title={t.wochenzielTitel}>
          <MeinWochenziel
            ziel={wochenziel}
            onChange={onWochenzielChange}
            t={t}
            sprache={sprache}
            sprich={(satz) => stimme.sprich(satz)}
            sprichGewaehlt={(was) => stimme.sprich(ansageGewaehlt(was, stimme.lang()))}
          />
        </Group>
      )}

      {/* 4c. Zeichenabstand (CVI) - E11, 18./19.09.2026. Dieselbe Bauart wie
             „Zeit lassen" direkt darüber, nur mit VIER Werten statt zwei -
             darum ein Auswahlfeld statt eines Schalters.
             ★ Seit 19.09.2026 für JEDE Person, auch ein Kind einer Klasse
             (Johannes: „die CVI-Einstellungen kann sich jedes Kind immer auch
             selbst in den Einstellungen einstellen"). Der Satz „deine
             Lehrkraft hat das eingestellt" statt des Feldes ist damit weg;
             fehlt der Rückruf (Tests, andere Einbettungen), fehlt die Gruppe. */}
      {onZeichenabstandChange && (
        <Group id="tt-set-zeichenabstand" icon="↔" title={t.abstandTitel}>
          <Field label={t.abstandName} hint={t.abstandHinweis}>
            <select
              className={SELECT}
              value={String(zeichenabstand)}
              onChange={(e) => {
                const faktor = Number(e.target.value) as ZeichenabstandFaktor;
                onZeichenabstandChange(faktor);
                stimme.sprich(ansageGewaehlt(abstandLabels[faktor], stimme.lang()));
              }}
              aria-label={t.abstandName}
            >
              {ZEICHENABSTAND_FAKTOREN.map((f) => (
                <option key={f} value={f}>
                  {abstandLabels[f]}
                </option>
              ))}
            </select>
          </Field>
        </Group>
      )}

      {/* 4b. Anzeige — was während des Tippens zu sehen ist (25.08.2026).
             Beide Werte sind GERÄTE-Einstellungen (wie die Tastatur): Sie
             beschreiben den Arbeitsplatz und den Bildschirm davor, nicht das
             Kind. Darum liegen sie in `useTypingA11y` (localStorage) und nicht
             im Konto. */}
      <Group id="tt-set-anzeige" icon="👁" title={t.anzeigeTitel}>
        {/* ★ 09.09.2026 (Johannes): Der Schalter „Anzeige-Zeile beim Tippen
            ausblenden" ist GESTRICHEN - samt Funktion. Die Zeile über dem
            Übungsfeld bleibt immer stehen: „dann springt kein Fokus und man
            sieht, wie lange man schon geübt hat." */}

        {/* Finger-Farben - stand bis 25.08.2026 als Häkchen unter der Tastatur.
            ★ R5 gilt hier weiter: In den Kontrast-Modi wird der Schalter NICHT
            gesperrt (`aria-disabled` statt `disabled`), die Begründung hängt
            über `aria-describedby` fest an `farbenGrundId` (nicht an `Tipp`s
            eigener Id) - das war schon vor N15c die Auskunft für die
            Sprachausgabe, ein natives `title` kam nie bei ihr an. `Tipp`
            ersetzt hier nur den Maus-/Fokus-Kasten, ohne die bestehende
            `aria-describedby`-Kette zu verändern (siehe
            `tests/typing-fokusziele.test.tsx`, Nr 8). */}
        <div className="flex flex-col gap-1">
          <Tipp text={colorsAllowed ? t.fingerFarbenTitel : farbenGesperrt(sprache)}>
            {(hinweisId) => (
              <button
                type="button"
                aria-pressed={fingerFarben}
                aria-disabled={!colorsAllowed}
                /* ★ K2 (19.09.2026): war ohne `aria-describedby` im
                   ERLAUBTEN Fall - der `Tipp`-Kasten stand nur mausseitig
                   da. Jetzt IMMER verbunden; gesperrt zusätzlich mit dem
                   Grund (`farbenGrundId`), unverändert an der eigenen Stelle. */
                aria-describedby={colorsAllowed ? hinweisId : `${hinweisId} ${farbenGrundId}`}
                className={
                  (fingerFarben && colorsAllowed ? "btn-primary" : "btn-secondary") +
                  " btn-toggle self-start aria-disabled:opacity-40"
                }
                onClick={() => {
                  if (!colorsAllowed) {
                    stimme.sprich(farbenGesperrt(sprache));
                    return;
                  }
                  const v = !fingerFarben;
                  setFingerFarben(v);
                  stimme.sprich(ansageSchalter("fingerFarbenAn", "fingerFarbenAus", v, stimme.lang()));
                }}
              >
                {t.fingerFarben(fingerFarben)}
              </button>
            )}
          </Tipp>
          {!colorsAllowed && (
            <p id={farbenGrundId} className="m-0 text-sm text-ink-muted">
              {farbenGesperrt(sprache)}
            </p>
          )}
        </div>

        {/* ★ Leerzeichen als „␣" oder als Lücke (Johannes 13.11.2026) - jedes
            Kind stellt es selbst ein, Geräte-Einstellung wie die Finger-Farben. */}
        <Tipp text={t.leerzeichenTitel}>
          {(hinweisId) => (
            <button
              type="button"
              aria-pressed={leerzeichenZeigen}
              aria-describedby={hinweisId}
              className={(leerzeichenZeigen ? "btn-primary" : "btn-secondary") + " btn-toggle self-start"}
              onClick={() => {
                const v = !leerzeichenZeigen;
                setLeerzeichenZeigen(v);
                stimme.sprich(t.leerzeichen(v));
              }}
            >
              {t.leerzeichen(leerzeichenZeigen)}
            </button>
          )}
        </Tipp>

        {/* ★ 12.11.2026 stand hier der Schalter „Geschriebenes ausblenden".
           Seit 13.11.2026 (Johannes) stellt das ein zweiter Punkt unter der
           Übungszeile ein - links vom Schreibzeiger-Punkt, ganz links = aus
           (`AusblendAnfasser` in TypingSession.tsx). */}

        {/*
          ★★★ Der Ansage-Schalter steht seit dem 03.09.2026 abends NICHT mehr
          hier, sondern in der Vorlese-Reihe unter dem Namen „Buchstabieren"
          (Johannes: „lass das Wort Buchstabieren, aber setze die Funktion vom
          alten Buchstaben dahinter"). Er gehört zu dem, was gelesen wird - und
          nicht zur Anzeige.
        */}
        {/* Die Größe des Übungsfeldes stand bis 25.08.2026 als „A- 100 % A+"
            in einer Leiste ÜBER dem Feld - eine Einmal-Einstellung auf dem
            besten Platz der Seite. Die Kürzel Alt + Plus / Alt + Minus gelten
            unverändert und wirken auch beim Üben. */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2" role="group" aria-label={t.groesse}>
            <span className="text-sm text-ink-soft">{t.groesse}</span>
            {/* ★ §3 / R5: NICHTS wird `disabled` - ein Knopf, der sich unter
                dem Fokus sperrt, wirft den Fokus auf `body`. An der Grenze
                sagt er, warum nichts passiert.
                ★ K2 (19.09.2026): beide Knöpfe waren ohne Hinweis - der
                Absatz darunter (`t.groesseHinweis`) bleibt stehen (er nennt
                auch die WEITERE Tastenkombination Strg+Plus für die ganze
                Seite), der Hinweis am Knopf trägt denselben Satz für die
                Maus/den Fokus. */}
            <Tipp text={t.groesseHinweis}>
              {(hinweisId) => (
                <button
                  type="button"
                  className="btn-secondary btn-toggle aria-disabled:opacity-40"
                  aria-disabled={atMinZoom}
                  aria-label={t.kleiner}
                  aria-describedby={hinweisId}
                  onClick={() => {
                    if (atMinZoom) {
                      stimme.sprich(ansage("kleinsteGroesse", stimme.lang()));
                      return;
                    }
                    zoomOut();
                  }}
                >
                  A-
                </button>
              )}
            </Tipp>
            <span
              className="w-14 text-center text-sm font-medium text-ink"
              aria-live="polite"
              aria-label={t.groesseName(Math.round(zoom * 100))}
            >
              {t.groesseZahl(Math.round(zoom * 100))}
            </span>
            <Tipp text={t.groesseHinweis}>
              {(hinweisId) => (
                <button
                  type="button"
                  className="btn-secondary btn-toggle aria-disabled:opacity-40"
                  aria-disabled={atMaxZoom}
                  aria-label={t.groesser}
                  aria-describedby={hinweisId}
                  onClick={() => {
                    if (atMaxZoom) {
                      stimme.sprich(ansage("groessteGroesse", stimme.lang()));
                      return;
                    }
                    zoomIn();
                  }}
                >
                  A+
                </button>
              )}
            </Tipp>
          </div>
          <p className="m-0 text-sm text-ink-muted">{t.groesseHinweis}</p>
        </div>

        {/* ★ „Große Tastatur (mit Ziffernblock)" (25.09.2026) - schaltet sich
            von selbst ein, sobald der Ziffernblock-Horcher eine Numpad-Taste
            sieht (`lib/typing/grosseTastatur.ts`); hier lässt sie sich auch
            von Hand umschalten. Eine bewusste Wahl schlägt danach die
            Automatik (siehe dort). Bewusst als LETZTES Kind dieser Gruppe
            (nach Finger-Farben und der Übungsfeld-Größe) - ein Test greift
            deren Knöpfe über einen festen Index ab
            (`tests/tastenflow-englisch-einstellungen.test.tsx`), den ein neuer
            Knopf DAVOR verschoben hätte. */}
        <Tipp text={t.grosseTastaturHinweis}>
          {(hinweisId) => (
            <button
              type="button"
              aria-pressed={grosseTastatur}
              className={(grosseTastatur ? "btn-primary" : "btn-secondary") + " btn-toggle self-start"}
              onClick={() => {
                const next = !grosseTastatur;
                setGrosseTastatur(next);
                stimme.sprich(t.grosseTastaturAnsage(next));
              }}
              aria-describedby={hinweisId}
            >
              <span aria-hidden="true">⌨️</span> {t.grosseTastatur(grosseTastatur)}
            </button>
          )}
        </Tipp>
      </Group>

      {/* 4e. Schrift (09.10.2026, Wunsch ein Kollege): Schrift der Übungszeile,
             mit Vorschau je Schrift - siehe SchriftWahl.tsx. Eigene Gruppe
             NACH „Anzeige", damit deren Knopf-Reihenfolge bleibt. */}
      <Group id="tt-set-schrift" icon="🔤" title={SCHRIFT_T[sprache].titel}>
        <SchriftWahl />
      </Group>

      {/* 5. Spiel — kommt nach einer neuen Taste ein Spiel? (15.08.2026;
             seit 22.08. nur noch „Keins" oder das Eisschollen-Spiel — der
             Tipp-Sprint ist entfallen, er wiederholte bloß die Wackel-Tasten,
             die „Mein Training" ohnehin bevorzugt übt.)
             Geräte-Einstellung wie die Tastatur: Sie beschreibt die Laune am
             Arbeitsplatz, nicht das Kind — darum kein Konto-Feld. */}
      {darfSpielWaehlen && (
        <Group id="tt-set-spiel" icon="🎮" title={t.spielTitel}>
          <Field label={t.nachNeuerTaste} hint={t.spielHinweis}>
            <select
              className={SELECT}
              value={belohnungsSpiel}
              onChange={(e) => {
                const wahl = e.target.value as BelohnungsSpiel;
                setBelohnungsSpiel(wahl);
                // Die Ansage nennt dasselbe Wort wie das Auswahlfeld, damit
                // Bild, Ohr und Braillezeile nicht auseinanderlaufen.
                stimme.sprich(
                  wahl === "keins"
                    ? ansage("belohnungKeins", stimme.lang())
                    : ansageBelohnungsspiel(spielLabels[wahl], stimme.lang()),
                );
              }}
              aria-label={t.spielName}
            >
              {BELOHNUNGSSPIELE.map((s) => (
                <option key={s} value={s}>
                  {spielLabels[s]}
                </option>
              ))}
            </select>
          </Field>
          <p className="m-0 basis-full text-sm text-ink-muted">
            {t.spielSatz1}
            <strong>{spielLabels.keins}</strong>
            {t.spielSatz2}
            <strong>{spielLabels.expedition}</strong>
            {t.spielSatz3}
          </p>
        </Group>
      )}

      {/* 6. Ton */}
      <Group id="tt-set-ton" icon="🔊" title={t.tonTitel}>
        <Tipp text={t.tonHinweis}>
          {(hinweisId) => (
            <button
              type="button"
              aria-pressed={!muted}
              aria-describedby={hinweisId}
              className={(muted ? "btn-secondary" : "btn-primary") + " btn-toggle"}
              onClick={() => {
                const v = !muted;
                setMuted(v);
                setSoundMuted(v);
                stimme.sprich(ansageSchalter("tonAus", "tonAn", v, stimme.lang()));
              }}
            >
              <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>{" "}
              {t.ton(muted)}
            </button>
          )}
        </Tipp>
        <Tipp text={t.klickTitel}>
          {(hinweisId) => (
            <button
              type="button"
              aria-pressed={tick}
              aria-label={t.klickName}
              aria-describedby={hinweisId}
              className={(tick ? "btn-primary" : "btn-secondary") + " btn-toggle"}
              onClick={() => {
                const v = !tick;
                setTick(v);
                setKeyTickOn(v);
                stimme.sprich(ansageSchalter("tippKlickAn", "tippKlickAus", v, stimme.lang()));
              }}
            >
              {t.klick}
            </button>
          )}
        </Tipp>
        <MelodieEinstellung
          texte={t}
          sprache={sprache as Lang}
          sprich={(text) => stimme.sprich(text)}
          tonAus={() => setMuted(isSoundMuted())}
        />
      </Group>

      {/* 7. Vorlesen (Self-Voicing) */}
      <Group id="tt-set-vorlesen" icon="🗣" title={t.vorlesenTitel}>
        <Tipp text={t.vorlesenTitelAttr}>
          {(hinweisId) => (
            <button
              type="button"
              aria-pressed={voiceEnabled}
              className={(voiceEnabled ? "btn-primary" : "btn-secondary") + " btn-toggle"}
              onClick={() => {
                const next = !voiceEnabled;
                setVoice(next);
                // ★ Nr 28 der Fokusziele (22.08.2026): Der Fokus BLEIBT auf dem
                // Knopf (R3) - unter ihm erscheinen bzw. verschwinden aber FÜNF
                // Bedienelemente (Buchstaben, Wörter, Sätze, Sprechtempo, Stimme).
                // Wer nicht sieht, merkte davon bisher nichts: Der Tab-Weg hinter
                // dem Knopf änderte sich stumm. Die Ansage nennt sie jetzt.
                if (next)
                  stimme.sprich(ansage("vorlesenAnMitFeldern", stimme.lang()));
                // Schalter ist schon aus — die Abschalt-Ansage muss trotzdem
                // hörbar sein, sonst gibt es kein Feedback ohne Screenreader.
                else stimme.sprichImmer(ansage("vorlesenAus", stimme.lang()));
              }}
              aria-describedby={hinweisId}
            >
              <span aria-hidden="true">🗣</span>{" "}
              {t.vorlesen(voiceEnabled)}
            </button>
          )}
        </Tipp>
        {/*
          ★★★ Der Stumm-Weg gehört SICHTBAR neben den Schalter (Johannes,
          04.09.2026: „egal an welcher Stelle gelesen wird, mit Strg muss es
          sofort leise werden"). Es ist die Geste jedes Screenreaders - wer sie
          nicht kennt, sitzt jede Ansage ab. Der Zuhörer selbst sitzt im
          Vorlese-Modul (`lib/typing/voice.ts`), nicht hier.
        */}
        {voiceEnabled && (
          <p className="m-0 basis-full text-sm text-ink-muted">
            <strong>{t.strg}</strong>
            {t.strgSatz}
          </p>
        )}
        {voiceEnabled && (
          <>
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label={t.wasGelesen}
            >
              <span className="text-sm text-ink-muted">{t.liest}</span>
              {/*
                ★★★ „Buchstaben" ist am 03.09.2026 abends in den Schalter
                „Nächste Taste ansagen" GEWANDERT (Johannes: „Buchstaben und
                den neuen Schalter zusammenführen").

                Beide sagten dasselbe: welches Zeichen als Nächstes dran ist -
                nur auf verschiedenen Wegen. „Buchstaben" über die eigene
                Stimme, der neue Schalter über den Live-Bereich für den
                Screenreader. Zwei Schalter für einen Wunsch sind zwei
                Gelegenheiten, das Falsche einzustellen: Wer „Buchstaben"
                anhatte und den neuen aus, hörte je nach Screenreader mal
                etwas und mal nichts.

                Jetzt entscheidet EIN Schalter, und der WEG richtet sich
                danach, was läuft: Vorlesen an ⇒ die eigene Stimme, Vorlesen
                aus ⇒ der Live-Bereich. Er steht oben in der Gruppe „Anzeige".
              */}
              <Tipp text={t.woerterTitel}>
                {(hinweisId) => (
                  <button
                    type="button"
                    aria-pressed={readWords}
                    className={(readWords ? "btn-primary" : "btn-secondary") + " btn-toggle"}
                    onClick={() => {
                      const v = !readWords;
                      setReadWords(v);
                      stimme.sprich(ansageSchalter("woerterAn", "woerterAus", v, stimme.lang()));
                    }}
                    aria-describedby={hinweisId}
                  >
                    {t.woerter}
                  </button>
                )}
              </Tipp>
              <Tipp text={t.saetzeTitel}>
                {(hinweisId) => (
                  <button
                    type="button"
                    aria-pressed={readSentences}
                    className={(readSentences ? "btn-primary" : "btn-secondary") + " btn-toggle"}
                    onClick={() => {
                      const v = !readSentences;
                      setReadSentences(v);
                      stimme.sprich(ansageSchalter("saetzeAn", "saetzeAus", v, stimme.lang()));
                    }}
                    aria-describedby={hinweisId}
                  >
                    {t.saetze}
                  </button>
                )}
              </Tipp>
              {/*
                ★★★★★ „BUCHSTABIEREN" - EIN Schalter für die Tasten-Ansage
                (03.09.2026 abends).

                Johannes: *„die Buchstabieren-Funktion ist nicht notwendig,
                weil wenn Wörter aktiviert sind, dann werden ja eh Wörter
                gesprochen und dann buchstabiert - also lass das Wort
                Buchstabieren, aber setze die Funktion vom alten Buchstaben
                dahinter."*

                Er hat recht: Seit die App nach jedem Anschlag die NÄCHSTE
                Taste ansagt, hört ein Kind beim Durchtippen eines Wortes
                dessen Buchstaben ohnehin nacheinander. Das alte
                Wort-dann-buchstabieren („Saal: großes S, a, a, l", Wunsch aus
                Marburg vom 28.08.) sagte damit dasselbe ein zweites Mal.

                Aus drei Schaltern („Buchstaben", „Buchstabieren", „Nächste
                Taste ansagen") ist damit EINER geworden. Der WEG richtet sich
                danach, was läuft: Vorlesen an ⇒ die eigene Stimme, Vorlesen
                aus ⇒ der Live-Bereich für den Screenreader.

                ★★★★★ SEIT 09.09.2026 IST DAS AUCH DER SCHALTER FÜR DIE
                BRAILLEZEILE. Alles, was beim Tippen in den Live-Bereich geht,
                zeigen NVDA und JAWS als Blitzmeldung auf der Zeile - sie
                verdrängt die Übungszeile (Befund der Kinder, siehe
                `announceBeimTippen` in TypingSession). Darum gilt: „aus" ⇒
                die App schreibt beim Tippen GAR NICHTS mehr für den
                Screenreader (keine nächste Taste, kein „Falsch", kein
                „Geschafft."), die Zeile bleibt ruhig; „an" ⇒ alles wie
                bisher, für alle, die nur hören. Die frühere Ausnahme
                („Übungssilben werden auch bei ‚aus' angesagt") ist damit weg.
              */}
              {buchstabierenSchalter}
            </div>
            <Field label={t.sprechTempo}>
              <select
                className={SELECT}
                value={String(rate)}
                onChange={(e) => {
                  setRate(Number(e.target.value));
                  // Sofort hörbar machen — kurze Probe im neuen Tempo
                  // (gleiches Muster wie bei Punktgenau).
                  primeSpeech();
                  speak(ansage("tempoProbe"));
                }}
                aria-label={t.sprechTempoName}
              >
                <option value="0.7">{t.langsam}</option>
                <option value="1">{t.normal}</option>
                <option value="1.3">{t.schnell}</option>
                <option value="1.7">{t.sehrSchnell}</option>
              </select>
            </Field>
            <Field label={t.stimme} hint={t.stimmeHinweis}>
              <select
                id="tt-voice"
                className={SELECT + " max-w-[13rem]"}
                value={voiceURI}
                onChange={(e) => {
                  setVoiceURI(e.target.value);
                  // Neue Stimme sofort vorstellen — nicht erst beim nächsten Wort.
                  primeSpeech();
                  speak(ansage("stimmeProbe"));
                }}
              >
                <option value="">{t.automatisch}</option>
                {sortedVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}
        {!voiceEnabled && buchstabierenSchalter}
      </Group>

      {/* 8. Mein Konto — nur für Konten ohne Klasse (09.08.2026) */}
      {selbstlernend && (
        <Group id="tt-set-konto" icon="🙋" title={t.kontoTitel}>
          <a className="btn-secondary btn-toggle" href="/lernwerkstatt/konto">
            {t.zugangsdaten}
          </a>
          <p className="m-0 basis-full text-sm text-ink-muted">
            {adresseBestaetigt ? t.kontoBestaetigt : t.kontoUnbestaetigt}
          </p>
        </Group>
      )}

      {/* 9. Einführung & Einrichtung — der geführte Weg durch genau diese
             Einstellungen, dazu der Podcast zum Nachhören (seit 09.08.2026
             hier statt dauerhaft im Seitenkopf). */}
      {(onEinrichtungNeu || einfuehrung) && (
        <Group id="tt-set-einrichtung" icon="🧭" title={t.einrichtungTitel}>
          {onEinrichtungNeu && (
            <Tipp text={t.einrichtungTitelAttr}>
              {(hinweisId) => (
                <button
                  type="button"
                  className="btn-secondary btn-toggle"
                  onClick={onEinrichtungNeu}
                  aria-keyshortcuts="Alt+R"
                  aria-describedby={hinweisId}
                >
                  <span aria-hidden="true">🧭</span>
                  {t.einrichtungNeu}
                </button>
              )}
            </Tipp>
          )}
          {einfuehrung}
          <p className="m-0 basis-full text-sm text-ink-muted">{t.einrichtungSatz}</p>
        </Group>
      )}
    </div>
  );
}

/**
 * ★ MELODIE BEIM TIPPEN (15.10.2026) - Schalter, Klang und Lied.
 *
 * Derselbe Weg wie Alt + 6 (`melodieUmschalten`): Einschalten schaltet auch
 * den Ton ein, ein kurzes Motiv bestätigt hörbar. Klang und Lied spielen beim
 * Wählen eine Hörprobe - der erste Ton synchron aus der Geste.
 *
 * Fokus (R3): Der Fokus bleibt auf dem Knopf; die zwei Auswahlfelder stehen
 * direkt dahinter im Tab-Weg und sind nie `disabled`.
 */
function MelodieEinstellung({
  texte,
  sprache,
  sprich,
  tonAus,
}: {
  texte: { melodie: string; melodieHinweis: string; melodieKlang: string; melodieLied: string };
  sprache: Lang;
  sprich: (text: string) => void;
  /** Der Ton-Knopf daneben muss erfahren, dass Einschalten ihn mit eingeschaltet hat. */
  tonAus: () => void;
}) {
  const an = useMelodie((s) => s.an);
  const klang = useMelodie((s) => s.klang);
  const lied = useMelodie((s) => s.melodie);
  const setKlang = useMelodie((s) => s.setKlang);
  const setLied = useMelodie((s) => s.setMelodie);
  const lieder = [...MELODIEN].sort((a, b) =>
    melodieName(a, sprache).localeCompare(melodieName(b, sprache), sprache),
  );
  const probeLied = () => (lied === "zufall" ? (lieder[0]?.id ?? "") : lied);
  return (
    <>
      <Tipp text={texte.melodieHinweis}>
        {(hinweisId) => (
          <button
            type="button"
            aria-pressed={an}
            aria-describedby={hinweisId}
            className={(an ? "btn-primary" : "btn-secondary") + " btn-toggle"}
            onClick={() => {
              const jetzt = melodieUmschalten();
              tonAus();
              sprich(ansage(jetzt ? "melodieAn" : "melodieAus", sprache));
            }}
          >
            <span aria-hidden="true">🎵</span> {texte.melodie}
          </button>
        )}
      </Tipp>
      {an && (
        <div className="flex basis-full flex-wrap gap-3">
          <Field label={texte.melodieKlang}>
            <select
              className={SELECT}
              value={klang}
              onChange={(e) => {
                const wahl = e.target.value as KlangWahl;
                setKlang(wahl);
                melodieProbe(wahl, probeLied());
              }}
            >
              {(["zufall", ...KLAENGE] as KlangWahl[]).map((k) => (
                <option key={k} value={k}>
                  {klangName(k, sprache)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={texte.melodieLied}>
            <select
              className={SELECT}
              value={lied}
              onChange={(e) => {
                const wahl = e.target.value;
                setLied(wahl);
                if (wahl !== "zufall") melodieProbe(klang, wahl);
              }}
            >
              <option value="zufall">{melodieZufallName(sprache)}</option>
              {lieder.map((m) => (
                <option key={m.id} value={m.id}>
                  {melodieName(m, sprache)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}
    </>
  );
}
