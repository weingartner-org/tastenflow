/**
 * ★★★ EIN STRICH JE MINUTE, DIE ZEIT DANEBEN.
 *
 * Johannes 10.09.2026: *„die anzeige macht probleme, es sind unzählige
 * vertikale striche - es soll für jede minute ein strich voll werden und die
 * zeit daneben stehen, nicht striche und zeit auf zwei zeilen aufteilen"*.
 *
 * Vorher zeigte die Session einen Strich je ZEILE des Textes - und ein Text
 * ist auf 30 Minuten Vorrat gebaut. Gemessen an der Klasse MSWEIN am
 * 10.09.2026: geschafft wurden 17 bis 43 Zeilen, gezeichnet wurden alle. Die
 * Uhr stand dazu im Kopf der Karte, die Striche eine Zeile tiefer.
 *
 * Gezählt wird die GEWÄHRTE Zeit, also nach Abzug der Vorlesezeit - dieselbe
 * Rechnung wie die Uhr daneben (`restMs`), sonst liefen Strich und Zahl
 * auseinander. Der laufende Strich füllt sich von unten.
 *
 * ⚠️⚠️⚠️ `aria-hidden`, und das ist der Kern: Der Zeitstand ändert sich jede
 * Sekunde; stünde er in einem Live-Bereich, verdrängte er die Braillezeile im
 * Sekundentakt für je vier Sekunden
 * ([[reference_live_region_ist_braille_blitzmeldung]]). Gehört und erfragt wird
 * die Zeit über die drei Wege im Kopf von `SchreibprobeLauf.tsx`.
 *
 * ── Warum eine eigene Datei (11.09.2026) ────────────────────────────────────
 * Das Klassenmatch braucht über dem Feld genau dasselbe (F12). Eine Kopie wäre
 * die zweite Fassung einer Anzeige, deren ganze Begründung an einer Messung
 * hängt - wer die eine repariert, hätte die andere nicht einmal gesehen
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]). Sie stand bis
 * dahin in `SchreibprobeLauf.tsx:171`.
 */
import { mmss } from "@/lib/typing";
import { Tipp } from "@/components/Tipp";
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";

/**
 * ★ EN5 (19.09.2026): der eine Satz dieser Leiste in beiden Sprachen.
 * ★ EN1 (19.09.2026): Er steht nicht mehr als natives `title`, sondern im
 * `Tipp` - Hausregel „Hinweise gross und sofort, nie `title`" (10.09.2026).
 * Beide Sprachen gleich gebaut; die Leiste bleibt als Ganzes `aria-hidden`
 * (der Hinweis ist für Sehende mit Zeiger, gelesen wird die Zeit anderswo).
 * ★ E11a-4 (26.09.2026): fr ergänzt - die Leiste steht auch im Klassenmatch
 * (`KlassenmatchLauf.tsx`), das jetzt `spracheGewaehlt` liest. Kein `texte()`
 * hier - das erwartet Tabellen-Werte (`Record<string, …>`), nicht einen
 * einzelnen Satz.
 */
const STRICH_JE_MINUTE: Record<BedienSprache, string> = {
  de: "Ein Strich je Minute.",
  en: "One bar per minute.",
  fr: "Un trait par minute.",
  es: "Una raya por minuto.",
  it: "Un trattino per minuto.",
  pl: "Jedna kreska na minutę.", // ★ O-PL (02.10.2026)
  tr: "Her dakika için bir çizgi.", // ★ O-TR (02.10.2026)
  cs: "Jedna čára za každou minutu.", // ★ O-CS (03.10.2026): „čára", nie „čárka" (= Komma, Glossar §4 Falle 2)
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "Една черта за всяка минута.",
  el: "Μία μπάρα για κάθε λεπτό.",
  hu: "Percenként egy vonás.",
  nl: "Eén streepje per minuut.",
  pt: "Um traço por minuto.",
  br: "Um traço por minuto.",
  ro: "O liniuță pentru fiecare minut.",
  sv: "Ett streck per minut.",
  uk: "Одна риска на кожну хвилину.",
};

export function MinutenLeiste({
  gesamtMs,
  restMs: rest,
}: {
  gesamtMs: number;
  restMs: number;
}) {
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` - diese Leiste hat keinen eigenen Sprach-Kontext, sie fragt den
  // Provider direkt (auch aus `SchreibprobeLauf.tsx`, E13a: dort bleibt der
  // Rest der Seite unverändert englisch, dieser eine `aria-hidden`-Tipp zeigt
  // jetzt auch dort schon Französisch mit).
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const minuten = Math.max(1, Math.ceil(gesamtMs / 60_000));
  const verbrauchtMin = Math.min(gesamtMs, Math.max(0, gesamtMs - rest)) / 60_000;
  return (
    // ★ EN1: Der `Tipp` umschliesst die GANZE Leiste (Striche UND Uhr), nicht
    // nur die Striche - so bleiben beide Kinder derselben Reihe, und der
    // Hinweis erscheint über der Leiste, wo auch immer der Zeiger steht.
    // `min-w-0`: Die Hülle darf schrumpfen, damit die Striche bei schmalem
    // Fenster weiter umbrechen (`.tt-ticks` ist `flex-wrap`).
    <Tipp text={STRICH_JE_MINUTE[sprache]} ausrichtung="links" className="min-w-0">
      {() => (
    <span aria-hidden className="flex min-w-0 items-center gap-3">
      <span className="tt-ticks">
        {Array.from({ length: minuten }, (_, i) => {
          const anteil = Math.min(1, Math.max(0, verbrauchtMin - i));
          const laeuft = anteil > 0 && anteil < 1;
          return (
            <span
              key={i}
              className={
                "tt-tick" + (anteil >= 1 ? " tt-tick--on" : "") + (laeuft ? " tt-tick--laeuft" : "")
              }
            >
              {laeuft ? (
                <span className="tt-tick-fuellung" style={{ height: `${Math.round(anteil * 100)}%` }} />
              ) : null}
            </span>
          );
        })}
      </span>
      {/* ★ E7 (11.09.2026): `text-xl` statt `text-2xl`. */}
      <span className="shrink-0 whitespace-nowrap font-mono text-xl font-semibold tabular-nums leading-none text-ink">
        {mmss(rest)}
      </span>
    </span>
      )}
    </Tipp>
  );
}
