/**
 * EINE Kachel-Bauart für Kennzahlen (E7, Schriftgrössen-Umbau 11.09.2026).
 *
 * Vorher standen vier eigene Bauarten mit vier verschiedenen Schriftgrössen
 * nebeneinander: `PupilStatsPanel` (`text-lg`/`text-xs`), `SchreibprobeErgebnis`
 * (`text-4xl`), die Abschlusskarte in `TypingSession` (`text-2xl`) und
 * `LevelTrend` (eigene Kartenform). Jemand, der schlecht sieht, muss die
 * Schrift so weit vergrössern, dass die kleinste Beschriftung noch lesbar
 * bleibt - dann sprengt die grösste Kachel den Bildschirm. Diese Datei stellt
 * darum GENAU ZWEI Bauarten bereit, beide in derselben Spanne (Beschriftung
 * `text-sm` = 14 px, Wert `text-xl` = 20 px):
 *
 *  • {@link Kennzahl} - eine ZEILE (Beschriftung links, Wert rechts), für
 *    Listen wie „Werte im Überblick" (`PupilStatsPanel`).
 *  • {@link KennzahlKachel} - eine KARTE (Beschriftung oben, Wert darunter),
 *    für die auffälligen Zahlen ganz oben - Schreibproben-Ergebnis, Tippchallenge.
 *
 * Beide bauen ihre Braillezeilen-Zeile aus `<dt>`/`<dd>`: Für eine Sprachausgabe
 * kommt immer erst die Beschriftung, dann der Wert - „Beschriftung: Wert" in
 * EINER Zeile, kein zweiter Umweg über einen versteckten Text.
 */
import { Erklaert } from "./Erklaert";

/** Eine ZEILE: Beschriftung links, Wert rechts (Listen, z. B. „Werte im Überblick"). */
export function Kennzahl({
  label,
  value,
  hilfe,
}: {
  label: string;
  value: string;
  /** Mouseover-Erklärung an der Beschriftung. */
  hilfe?: string;
}) {
  return (
    <div
      role="listitem"
      className="flex items-baseline justify-between gap-3 border-b border-hairline/60 py-1 text-sm last:border-b-0"
    >
      <dt className="m-0 text-ink-muted">
        {hilfe ? <Erklaert hilfe={hilfe}>{label}</Erklaert> : label}
      </dt>
      <dd className="m-0 font-semibold tabular-nums text-ink">{value}</dd>
    </div>
  );
}

/** Eine KARTE: Beschriftung oben, grösserer Wert darunter (auffällige Einzelzahlen). */
export function KennzahlKachel({
  was,
  wert,
  einheit,
  hilfe,
  ausrichtung,
}: {
  was: string;
  wert: string;
  einheit?: string;
  /** Der Mouseover-Hinweis zum Begriff. */
  hilfe: string;
  ausrichtung?: "links" | "rechts";
}) {
  return (
    <div className="flex-1 rounded-2xl bg-surface-sunken px-4 py-3 text-center">
      <dt className="m-0 text-sm text-ink-soft">
        <Erklaert hilfe={hilfe} ausrichtung={ausrichtung}>
          {was}
        </Erklaert>
      </dt>
      <dd className="m-0 mt-0.5 text-xl font-semibold tabular-nums leading-none text-ink">
        {wert}
        {einheit ? <span className="ml-1 text-sm font-medium text-ink-soft">{einheit}</span> : null}
      </dd>
    </div>
  );
}
