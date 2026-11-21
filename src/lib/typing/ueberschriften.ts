/**
 * ★ ÜBERSCHRIFTEN-SPRUNG der Vorlese-Stimme - Alt + G, „Gliederung"
 * (Johannes 30.08.2026: „bau die Überschriften-Sprungtaste für die
 * Vorlese-Stimme").
 *
 * Screenreader springen mit „H" von Überschrift zu Überschrift - die
 * App-eigene Vorlese-Stimme konnte das nicht, und ein Kind mit Sehrest, das
 * die App-Stimme statt eines Screenreaders nutzt, hatte keinen Weg, sich die
 * Gliederung einer Ansicht zu erschließen. Alt + G springt zur nächsten
 * sichtbaren Überschrift (zyklisch: nach der letzten wieder zur ersten),
 * setzt den FOKUS dorthin und liest sie vor.
 *
 * ⇒ Seit 11.09.2026 (Umbauplan P9a) wohnt der DOM-Kern in
 * `lib/arbeitsblatt/ueberschriftSprung.ts` - geteilt mit Mathecoach, das
 * dieselbe Taste ohne eigene Sprachausgabe braucht. Diese Datei ruft ihn nur
 * noch mit `speakUi` als Melder auf; das Verhalten für Tastenflow ist
 * UNVERÄNDERT (h1-h4 war hier gemeint, der Kern nimmt jetzt h1-h6 - in
 * Tastenflow kommen h5/h6 bisher nicht vor, das ändert nichts).
 *
 * - Der Fokus wandert WIRKLICH (tabindex="-1" + focus): Braillezeile und
 *   echte Screenreader stehen danach an derselben Stelle wie die Stimme -
 *   keine zwei Wahrheiten. Von der Überschrift aus geht es mit Tab zum
 *   nächsten Bedienelement des Abschnitts.
 * - `speakUi` prüft selbst, ob Vorlesen an ist - ohne Stimme ist Alt + G
 *   trotzdem nützlich: Es ist dann ein reiner Gliederungs-Sprung.
 */
import { speakUi } from "./voice";
import {
  ueberschriftSpringen as kernSpringen,
  zugaenglicherText,
} from "@/lib/arbeitsblatt/ueberschriftSprung";

export { zugaenglicherText };

/** Vorwärts, zyklisch, mit der Vorlese-Stimme als Melder - wie bisher. */
export function ueberschriftSpringen(): void {
  kernSpringen({ melden: speakUi });
}
