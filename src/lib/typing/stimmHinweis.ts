/**
 * ★★ W2b Punkt 5 = S6 aus dem Windows-Befund §3.5 (28.09.2026): der Hinweis
 * „Keine … Stimme installiert" (`VoiceInstallHelp`) erschien NUR, wenn das
 * Vorlesen VOR dem Sprachwechsel schon an war (`changeLang` in
 * `TippenTrainerPage`). Wer die Sprache zuerst wählt und das Vorlesen DANACH
 * einschaltet - in der Einrichtung (Schritt „Ton"), im Zahnrad oder mit dem
 * Vorlese-Knopf -, bekam keinen Hinweis, und der spanische Text kam mit der
 * deutschen Standardstimme (gemessen: `voice=null, lang=es-ES`).
 *
 * Die Regel, rein: Beim Übergang „Vorlesen aus ⇒ an" wird für die
 * Übungssprache nachgesehen - gibt es eine Stimme, wird sie gewählt (wie beim
 * Sprachwechsel), sofern nicht schon eine passende gewählt ist; gibt es keine,
 * aber überhaupt Stimmen, kommt der Hinweis. Ohne Stimmen gar keine (die Liste
 * lädt in manchen Browsern erst später - dann wüsste niemand, ob wirklich eine
 * fehlt). Deutsch braucht nichts (die Vorgabe „automatisch" ist deutsch).
 */
import { stimmKuerzel } from "./stimmKuerzel";

export type StimmFolge = { art: "stimme"; uri: string } | { art: "hinweis" } | null;

export function stimmeBeimEinschalten(opts: {
  warAn: boolean;
  istAn: boolean;
  /** Die Übungssprache („de", „en", „fr", „es"). */
  lang: string;
  /** Die im Zahnrad gewählte Stimme (voiceURI) - leer = automatisch. */
  gewaehlt: string;
  /** Sprache der gewählten Stimme, falls es sie auf dem Gerät gibt. */
  gewaehltSprache: string | null;
  /** Die beste Stimme für die Übungssprache (`firstVoiceURIForLang`). */
  stimmeFuerSprache: string | null;
  /** Gibt es überhaupt Stimmen auf dem Gerät? */
  stimmenDa: boolean;
}): StimmFolge {
  if (opts.warAn || !opts.istAn) return null;
  // ★ F58 (29.10.2026): das Kürzel der Stimmen („br" ⇒ „pt") - sonst passte eine gewählte brasilianische Stimme nie zum Weg „br".
  const p = stimmKuerzel(opts.lang);
  if (p === "de") return null;
  const gewaehltPasst =
    !!opts.gewaehlt && (opts.gewaehltSprache ?? "").toLowerCase().slice(0, 2) === p;
  if (gewaehltPasst) return null;
  if (opts.stimmeFuerSprache) return { art: "stimme", uri: opts.stimmeFuerSprache };
  return opts.stimmenDa ? { art: "hinweis" } : null;
}
