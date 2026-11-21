/**
 * Welche System-Stimmen das Auswahlfeld „Stimme" anbietet (17.10.2026).
 *
 * Herausgezogen aus `TypingSettings.tsx`: Seit es das Menü unter dem
 * Lautsprecher-Schalter gibt (`AkustikMenue.tsx`), stehen zwei Auswahlfelder
 * für dieselbe Stimme im Programm. EINE Liste für beide - zwei Fassungen
 * wären die Doppelung, die einander nicht kennt: Die eine bietet nach dem
 * nächsten Nachbessern eine Stimme an, die die andere versteckt.
 *
 * Nur Stimmen in den Sprachen, die das Programm wirklich vorliest. Das
 * Betriebssystem meldet über die Web-Speech-API Dutzende weiterer Sprachen
 * (Schwedisch, Hebräisch, Malaiisch …), die beim Üben nie gebraucht werden
 * und das Auswahlfeld nur zumüllen. Die aktuell gewählte Stimme bleibt
 * sicherheitshalber immer enthalten.
 *
 * ★ ES-M2 (27.09.2026): dazu die Übungssprachen des Weges - auf Weg „es" bot
 * das Feld nur „Anna (de-DE) | Samantha (en-US)" an, wer wählte, bekam eine
 * deutsche Stimme für spanischen Text. Auf Weg „de"/„en" ändert sich nichts.
 *
 * ★ Mehrsprachige Stimmen fehlen ganz - auch eine schon gewählte (sie spricht
 *   ohnehin nicht mehr, siehe `istMehrsprachigeStimme` in `voice.ts`; das
 *   Feld zeigt dann „automatisch", und das stimmt).
 */
import { LANGS, hauptspracheDesWeges, uebungsSprachenImWeg, type Lang } from "./account";
import type { Lernweg } from "./lernweg";
import { istMehrsprachigeStimme } from "./voice";
import { stimmKuerzel } from "./stimmKuerzel";

export function stimmenZurAuswahl(
  stimmen: readonly SpeechSynthesisVoice[],
  gewaehlteUri: string,
  lang: Lang,
  lernweg: Lernweg,
): SpeechSynthesisVoice[] {
  // ★ F58 (29.10.2026): als Kürzel der STIMMEN („br" ⇒ „pt") - sonst bot das Feld auf Weg „br" keine brasilianische Stimme an.
  // Für jede andere Sprache ist das Kürzel ihr eigener Anfang (byte-gleich zu vorher).
  const appLangs = new Set<string>([...LANGS, ...uebungsSprachenImWeg(lernweg), lang].map(stimmKuerzel));
  const hauptsprache = hauptspracheDesWeges(lernweg);
  const vorneSprache = stimmKuerzel(hauptsprache ?? (LANGS.includes(lang) ? "de" : lang));
  const relevant = stimmen.filter(
    (v) =>
      !istMehrsprachigeStimme(v) &&
      (appLangs.has(v.lang.toLowerCase().slice(0, 2)) || v.voiceURI === gewaehlteUri),
  );
  // Stimmen der Hauptsprache zuerst (die Buchstaben-/Fingernamen sind deutsch),
  // dann alphabetisch - damit die brauchbaren oben im Auswahlfeld stehen.
  return [...relevant].sort((a, b) => {
    const ad = a.lang.toLowerCase().startsWith(vorneSprache) ? 0 : 1;
    const bd = b.lang.toLowerCase().startsWith(vorneSprache) ? 0 : 1;
    if (ad !== bd) return ad - bd;
    return a.name.localeCompare(b.name, "de");
  });
}
