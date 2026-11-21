/**
 * ★★ BEDIENUNG UND INHALT IN DEN ÜBUNGSFORMEN (EN4, 18.09.2026).
 *
 * Eine Übungsform spricht zwei Sprachen, sobald die englische Bedienung an ist:
 *  · die BEDIENUNG - Ankündigung, Name, der Rahmen einer Frage („Schreib die
 *    Zahl: …", „Welches Wort fehlt?"), die Rückmeldungen. Sie folgt der
 *    Bedienungssprache (`lib/bedienSprache`).
 *  · den INHALT - Wörter, Sätze, Zahlwörter, Lösungen. Er folgt der
 *    Übungssprache (`ctx.lang`), denn das Kind tippt ihn.
 *
 * ★★★ OHNE BEDIENUNGSSPRACHE BLEIBT ALLES, WIE ES WAR. Bis EN4 entschied
 * `ctx.lang` (die Übungssprache) auch über die Sprache der Ankündigung: Ein
 * Kind mit englischer Übungssprache hörte „Now come …", in deutscher
 * Bedienung. Das bleibt so, wo niemand eine Bedienungssprache hereinreicht -
 * darum ist `sprache` im Kontext optional und fällt auf `lang` zurück
 * ({@link bedienSpracheVon}). In Tastenflow (aktiver Sprachbereich) setzt
 * `useUebungsform` sie.
 *
 * ★★ WENN BEIDE SPRACHEN IN EINEM SATZ STEHEN („Line two: Die Katze schläft
 * auf dem ... Ofen. Which word is missing?"), braucht der Bildschirm die
 * TEILE: Der deutsche Teil bekommt `lang="de"` (sonst liest eine englische
 * Sprachausgabe ihn mit englischer Aussprache) und wird mit der deutschen
 * Stimme gesprochen. Dafür liefert eine Frage neben dem fertigen Satz
 * (`frage`, unverändert) ihre Teile (`frageTeile`).
 *
 * ⚠️ Die Teile entstehen aus DEMSELBEN ganzen Satz der Texttabelle: Der
 * Inhalt wird beim Einsetzen mit zwei unsichtbaren Steuerzeichen umklammert
 * ({@link inhalt}) und danach an ihnen aufgetrennt ({@link inTeile}). So bleibt
 * jeder Eintrag der Tabelle ein ganzer Satz mit Platzhaltern (Wortstellung
 * gehört der Sprache), und der zusammengesetzte deutsche Satz ist Zeichen für
 * Zeichen der von vorher.
 */
import type { BedienSprache } from "../../bedienSprache/sprache";
import type { FormKontext } from "./typen";

/** Die Sprache, in der eine Form mit diesem Kontext ihre BEDIENUNG spricht. */
export function bedienSpracheVon(ctx: Pick<FormKontext, "lang" | "sprache">): BedienSprache {
  return ctx.sprache ?? ctx.lang;
}

/**
 * Ein Stück Text: Bedienung (ohne `inhalt`) oder Inhalt in der Übungssprache
 * (`inhalt: true`). Aneinandergehängt ergeben die Teile den ganzen Satz.
 */
export interface TextTeil {
  text: string;
  inhalt?: true;
  /** Hier beginnt eine eigene Äußerung - die Sprachausgabe macht davor eine kurze Pause. */
  pause?: true;
}

const AUF = "";
const ZU = "";

/**
 * Setzt einen Inhalt in einen Satz der Texttabelle ein - umklammert, damit
 * {@link inTeile} ihn wiederfindet. Nur für den Aufruf der Tabellenfunktion,
 * nie für die Anzeige.
 */
export function inhalt(text: string | number): string {
  return `${AUF}${text}${ZU}`;
}

/** Den umklammerten Satz in Teile zerlegen - leere Teile fallen weg. */
export function inTeile(satz: string): TextTeil[] {
  const teile: TextTeil[] = [];
  for (const stueck of satz.split(AUF)) {
    const [drin, danach] = stueck.includes(ZU) ? stueck.split(ZU) : [null, stueck];
    if (drin) teile.push({ text: drin, inhalt: true });
    if (danach) teile.push({ text: danach });
  }
  return teile;
}

/** Der ganze Satz aus seinen Teilen. */
export function ausTeilen(teile: readonly TextTeil[]): string {
  return teile.map((t) => t.text).join("");
}

/** Ein reiner Inhalt als Teile - die Frage eines Lückentexts, ein Fingername. */
export function nurInhalt(text: string): TextTeil[] {
  return [{ text, inhalt: true }];
}
