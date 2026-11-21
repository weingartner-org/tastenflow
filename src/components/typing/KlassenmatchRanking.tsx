/**
 * ★★★★★ DAS RANKING UNTER DEM FELD (F11, 11.09.2026).
 *
 * Johannes: *„Während des Matchs unter dem Eingabefeld (statt Tastatur): je
 * Teilnehmer eine Zeile - Platz · Name · Strich mit Kugel, die nach rechts
 * wandert; Grundlage ist der Score (Fehlgriff wirft 5 Zeichen zurück); Platz 1
 * immer oben, Liste sortiert sich um; wenn die erste Kugel rechts ist, sind die
 * 5 Minuten um."*
 *
 * ── ⚠️⚠️⚠️ DER GANZE BEREICH IST `aria-hidden` - das ist der Kern ───────────
 * Er ändert sich alle drei Sekunden und bei jedem Platzwechsel. Stünde davon
 * auch nur eine Zeile in einer Live-Region, verdrängte sie die Braillezeile für
 * je vier Sekunden ([[reference_live_region_ist_braille_blitzmeldung]]) - und
 * auf genau diese Zeile schreibt das Kind gerade ab. **Es gibt hier keine
 * Ansage bei Platzwechsel, nie.** Wer den Stand wissen will, fragt mit Alt + X
 * (`KlassenmatchLauf`), und der eigene Platz steht links im Feld selbst
 * (`matchZeitstand`). Dieselbe Entscheidung wie bei der `MinutenLeiste`.
 *
 * ── Warum die Zeilen im DOM NICHT die Plätze tauschen ───────────────────────
 * Die Reihenfolge im Bild macht `order` (Flexbox), nicht die Reihenfolge der
 * Knoten: Jede Zeile bleibt an ihrer Stelle im Baum, nur ihre Position im
 * Kasten ändert sich. Damit bewegt der Browser beim Platzwechsel keinen
 * einzigen Knoten - und was sich nicht bewegt, kann auch keinen Fokus
 * mitnehmen. (Der Fokus steht im Tippfeld und soll dort bleiben.)
 *
 * ── Im Kontrastmodus zählt die FORM, nicht die Farbe ────────────────────────
 * Der Windows-Kontrastmodus ersetzt jede Farbe durch vier Systemfarben - es
 * gibt dort keine dritte Farbe (`UEBERGABE-2026-09-09-ABEND-DER-
 * KONTRASTMODUS.md`, §3). Die eigene Zeile ist darum **fett** und trägt einen
 * Rahmen; die Kugel ist ein gefüllter Kreis mit Umriss. Alle Farben kommen aus
 * den Haus-Tokens (`text-ink`, `bg-accent`, `border-hairline`), kein Hex-Wert.
 */
import { kugelPositionen, type RanglistenEintrag } from "@/lib/typing";

export interface KlassenmatchRankingProps {
  /** Die fertige Rangfolge (Platz 1 zuerst) - gerechnet in `rangliste()`. */
  liste: readonly RanglistenEintrag[];
  /** Die eigene Konto-Kennung - die eigene Zeile wird hervorgehoben. */
  eigeneUid: string;
  /** Wie lange schon geschrieben wird (ms). */
  verstrichenMs: number;
  /** Wie lange das Match dauert (ms) - aus `endeMs - startMs` des Servers. */
  dauerMs: number;
}

export function KlassenmatchRanking({
  liste,
  eigeneUid,
  verstrichenMs,
  dauerMs,
}: KlassenmatchRankingProps) {
  const positionen = kugelPositionen(liste, verstrichenMs, dauerMs);
  /*
    ★ Die Knoten stehen in einer FESTEN Reihenfolge (nach Konto-Kennung), die
    sich nie ändert - siehe Dateikopf. Den Platz macht `order`.
  */
  const stabil = liste
    .map((e, i) => ({ e, pos: positionen[i] }))
    .sort((a, b) => a.e.stand.pupilUid.localeCompare(b.e.stand.pupilUid));

  return (
    <div aria-hidden className="flex flex-col gap-1.5 px-1 py-2">
      {stabil.map(({ e, pos }) => {
        const eigen = e.stand.pupilUid === eigeneUid;
        return (
          <div
            key={e.stand.pupilUid}
            style={{ order: e.platz }}
            className={
              "flex items-center gap-3 rounded-xl px-2 py-1 text-lg " +
              (eigen ? "border border-hairline bg-surface-sunken font-semibold text-ink" : "text-ink")
            }
          >
            <span className="w-10 shrink-0 text-right tabular-nums">{e.platz}.</span>
            <span className="w-32 shrink-0 truncate sm:w-40">{e.stand.name}</span>
            {/* Der Strich mit der Kugel. `min-w-0` + `flex-1`: Er nimmt, was
                übrig ist, und drängt den Namen nie aus dem Kasten. */}
            <span className="relative h-3 min-w-0 flex-1">
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-hairline" />
              <span
                className={
                  "absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border " +
                  (eigen ? "border-ink bg-accent" : "border-hairline bg-ink")
                }
                style={{
                  left: `${Math.round(pos * 1000) / 10}%`,
                  // Sanft, nicht ruckartig: Die Kugel wandert in derselben Zeit,
                  // in der der nächste Stand ohnehin unterwegs ist.
                  transition: "left 600ms linear",
                }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}
