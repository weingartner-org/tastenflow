/**
 * ════════════════════════════════════════════════════════════════════════════
 * EIN GEMEINSAMES SPRACHMODUL FÜR DIE STIMME (Bauplan 2026-11-06 §1b)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Bis 06.11.2026 stellte jede App ihre deutsche Stimme selbst ein
 * (`braille/voice.ts`, `plus/stimme.ts`, `klangpunkte/audio.ts`, die Sims).
 * Dieses Modul nimmt eine Sprache und liefert
 *  - die BCP-47-Kennung für `SpeechSynthesisUtterance.lang` und `lang="…"`,
 *  - die passende Stimme aus `speechSynthesis.getVoices()` (oder `null`).
 *
 * ★ Die Kennungen sind die von Tastenflow (`typing/vorlesen.ts` `SPRACH_TAG`).
 *   Abgeschrieben statt importiert, weil `typing/vorlesen.ts` die ganze
 *   Tastenflow-Sprachausgabe in jede App zöge; der Wächter
 *   `tests/stimme-fuer.test.ts` prüft, dass beide Listen gleich bleiben.
 *   ⚠️ `br` ist pt-BR, NICHT Bretonisch (Befund 31.10.2026).
 * ★ Deutsch liefert genau das, was die Apps heute wählen: `de-DE`, und für Plus
 *   `de-AT` (`plus/stimme.ts:90`) - Wächter `tests/stimme-fuer.test.ts`.
 * ★ Fehlt eine Stimme der Sprache, liefert `stimmeFuer` `null` - NIE eine
 *   deutsche oder englische Ersatzstimme. Wer vorliest, sagt dann ehrlich,
 *   dass es keine Stimme gibt (Bauplan §1d, „Hören wie ein Profi").
 *
 * Im Griff wird NICHT umgestellt (Bauplan §1b).
 */
import type { Lang } from "@/lib/typing/account";

/** Gleich wie `SPRACH_TAG` in `typing/vorlesen.ts` (Wächter). */
export const SPRACH_KENNUNG: Readonly<Record<Lang, string>> = {
  de: "de-DE", en: "en-GB", fr: "fr-FR", es: "es-ES", it: "it-IT", pl: "pl-PL",
  tr: "tr-TR", cs: "cs-CZ", bg: "bg-BG", el: "el-GR", hu: "hu-HU", nl: "nl-NL",
  pt: "pt-PT", br: "pt-BR", ro: "ro-RO", sv: "sv-SE", uk: "uk-UA",
};

/** Wer fragt - nur Plus spricht heute österreichisch. */
export type StimmenApp = "allgemein" | "plus";

/** BCP-47-Kennung der Sprache, z. B. `fr-FR`, `pt-BR`. */
export function sprachKennung(sprache: Lang, app: StimmenApp = "allgemein"): string {
  if (sprache === "de" && app === "plus") return "de-AT";
  return SPRACH_KENNUNG[sprache];
}

/** Stimmen, die nur Spass machen (macOS) - nie von selbst gewählt. */
const SPASS_STIMME =
  /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|organ|pipe organ|superstar|trinoids|whisper|wobble|zarvox|monster|fl(ü|ue)stern|glocken|orgel|seifenblasen|spa(ß|ss)vogel|gute neuigkeiten|schlechte neuigkeiten)/i;

function norm(tag: string): string {
  return tag.replace("_", "-").toLowerCase();
}

/**
 * Die Stimme für eine Sprache, in dieser Reihenfolge:
 * 1. genau die Kennung (`pt-BR` ⇒ eine pt-BR-Stimme),
 * 2. dieselbe Sprache, andere Region (`pt-PT` für `pt-BR` nur, wenn es nichts anderes gibt) -
 *    ⚠️ außer bei `br`/`pt`: die zwei werden nie vertauscht (Tastenflow `regionalOderAlle`),
 * 3. sonst `null`.
 * Innerhalb einer Stufe: keine Spass-Stimmen, dann die Standardstimme, dann die erste.
 */
export function stimmeFuer(
  sprache: Lang,
  stimmen: readonly SpeechSynthesisVoice[],
  app: StimmenApp = "allgemein",
  /** Plus-Region (`es-MX`, `fr-BE` ...): ersetzt die Kennung der Sprache; der Rückfall bleibt "irgendeine Stimme der Sprache". */
  kennungRegion?: string,
): SpeechSynthesisVoice | null {
  const kennung = norm(kennungRegion ?? sprachKennung(sprache, app));
  const grund = kennung.slice(0, 2);
  const waehle = (liste: readonly SpeechSynthesisVoice[]) => {
    if (!liste.length) return null;
    const normal = liste.filter((v) => !SPASS_STIMME.test(v.name.trim()));
    return normal.find((v) => v.default) ?? normal[0] ?? liste[0];
  };
  const genau = waehle(stimmen.filter((v) => norm(v.lang) === kennung));
  if (genau) return genau;
  if (sprache === "br" || sprache === "pt") return null;
  // Deutsch: wie bisher jede de-Stimme (de-AT, de-CH ...), bevor gar keine.
  return waehle(stimmen.filter((v) => norm(v.lang).slice(0, 2) === grund));
}

/** Stimme und Kennung auf eine Äusserung setzen. Ohne Stimme trägt `lang` die Kennung. */
export function setzeStimme(
  u: SpeechSynthesisUtterance,
  sprache: Lang,
  stimmen: readonly SpeechSynthesisVoice[],
  app: StimmenApp = "allgemein",
): boolean {
  const v = stimmeFuer(sprache, stimmen, app);
  if (v) {
    u.voice = v;
    u.lang = v.lang;
    return true;
  }
  u.lang = sprachKennung(sprache, app);
  return false;
}
