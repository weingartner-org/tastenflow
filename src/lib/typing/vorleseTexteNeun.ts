/**
 * ★★★ F58 (29.10.2026): DIE ANSAGEN DER SPRACHAUSGABE für die neun Wege bg, el, hu, nl, pt, br, ro, sv, uk - EINE Schnittstelle, je
 * Sprache eine Datei (`vorleseTexte<Xx>.ts`), damit eine Sprache ihre Sätze ändert, ohne die anderen anzufassen.
 *
 * Vorher (G2-NEUN) standen in `vorlesen.ts` für die neun überall die ENGLISCHEN Sätze (Marke `RÜCKFALL-EN (G2-NEUN)`) - und an einer Stelle
 * sogar der DEUTSCHE: `ansageUmschaltSeite` hatte keinen Rückfall und endete im deutschen Satz („Fast! … braucht die linke Umschalttaste",
 * Falle 30, gemessen 29.10.2026). `vorlesen.ts` fragt jetzt zuerst hier.
 *
 * Regeln (aus den Glossaren §1 und der Hausregel): Kinder werden geduzt (ro: tu auch für Erwachsene, Entscheidung Johannes 29.10.); kurze
 * Sätze für Stimme UND Braillezeile; nur Bindestrich `-`; nie eine Zahl mit Punkt am Satz- oder Ansage-Ende (sie würde zur Ordnungszahl -
 * im Ungarischen ist „7." immer „hetedik"); ohne Geschlecht des Kindes; Tastennamen wie auf der Kappe (Glossar §2.9).
 */
import type { AnsageSchluessel } from "./vorlesen";
import type { GeruestSprache } from "./sprachRegister";
import { VORLESE_TEXTE_BG } from "./vorleseTexteBg";
import { VORLESE_TEXTE_EL } from "./vorleseTexteEl";
import { VORLESE_TEXTE_HU } from "./vorleseTexteHu";
import { VORLESE_TEXTE_NL } from "./vorleseTexteNl";
import { VORLESE_TEXTE_PT } from "./vorleseTextePt";
import { VORLESE_TEXTE_BR } from "./vorleseTexteBr";
import { VORLESE_TEXTE_RO } from "./vorleseTexteRo";
import { VORLESE_TEXTE_SV } from "./vorleseTexteSv";
import { VORLESE_TEXTE_UK } from "./vorleseTexteUk";

/** Was eine der neun Sprachen für die Sprachausgabe liefert. Jede Funktion gibt den GANZEN Satz zurück, wie `vorlesen.ts` ihn spricht. */
export interface VorleseTexteNeun {
  /** Die festen Sätze, dieselben Schlüssel wie `ANSAGEN.de`/`ANSAGEN.cs` in `vorlesen.ts`. */
  ansagen: Record<AnsageSchluessel, string>;
  /** „Schritt 2 von 5. Sprache." - nie „5." vor dem Titel (Ordnungszahl): Doppelpunkt oder Schrägstrich wie cs „Krok 2/5: …". */
  schritt: (nummer: number, gesamt: number, titel: string) => string;
  /** „Tastatur: Österreich." */
  tastatur: (kurz: string) => string;
  /** „Startpunkt: Grundstellung." */
  start: (label: string) => string;
  /** „Angemeldet als Mira." - Name nach Doppelpunkt, nie gebeugt. */
  angemeldet: (name: string) => string;
  /** „Belohnungs-Spiel: Eisschollen." */
  belohnungsspiel: (label: string) => string;
  /**
   * „Zeile 3 von 12, noch 9 Zeilen." (art „zeile") bzw. „Aufgabe 3 von 12, noch 9 Aufgaben." (art „aufgabe"); ist nichts mehr übrig:
   * „…, letzte Zeile." / „…, letzte Aufgabe.". KOMMA hinter der Gesamtzahl, nie ein Punkt direkt hinter einer Zahl. Mehrzahl nach den
   * Regeln der Sprache (`mehrzahl` aus `bedienSprache/texte.ts`).
   */
  stand: (aktuell: number, gesamt: number, art: "zeile" | "aufgabe") => string;
  /** Der Kopf von „Übezeit: 12 Minuten" - `zeit` kommt fertig formatiert. */
  uebezeit: (zeit: string) => string;
  /** Vorspann der Abschluss-Ansage, mit Leerzeichen am Ende: sober „Aufstieg: nächste Übungsstufe. ", sonst „Aufstieg! Du wirst immer besser. ". */
  aufstieg: (sober: boolean) => string;
  /**
   * „ Neue Abzeichen: Schnellzug, Eule und 2 weitere!" - mit führendem Leerzeichen; `gesamt` = Zahl aller neuen Abzeichen (1 ⇒ Einzahl),
   * `rest` = wie viele nicht genannt sind (0 ⇒ kein Schwanz), `ende` = „." oder „!".
   */
  neueAbzeichen: (namen: readonly string[], gesamt: number, rest: number, ende: string) => string;
  /** „ Treffsicherheit 95 %, 120 Anschläge pro Minute." - mit führendem Leerzeichen; `treffsicherheit` kommt fertig („95 %"). */
  werte: (treffsicherheit: string, tempo: number) => string;
  /** „Fast! Das große A braucht die linke Umschalttaste, nicht die andere und nicht die Feststelltaste." */
  umschaltSeite: (zeichenName: string, seiteLinks: boolean) => string;
}

/** Je Sprache ihre Texte. `tsc` verlangt jede der neun. */
export const VORLESE_TEXTE_NEUN: Readonly<Record<GeruestSprache, VorleseTexteNeun>> = {
  bg: VORLESE_TEXTE_BG,
  el: VORLESE_TEXTE_EL,
  hu: VORLESE_TEXTE_HU,
  nl: VORLESE_TEXTE_NL,
  pt: VORLESE_TEXTE_PT,
  br: VORLESE_TEXTE_BR,
  ro: VORLESE_TEXTE_RO,
  sv: VORLESE_TEXTE_SV,
  uk: VORLESE_TEXTE_UK,
};
