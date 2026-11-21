/**
 * Wiederverwendbarer Kreisring mit einer Zahl in der Mitte: eine graue Spur,
 * darüber ein farbiger Bogen, der sich mit `frac` (0..1) füllt. Gemeinsame
 * Grundlage für die Spielstufe ([[PlayerLevelRing]]) UND die Wochenziel-Ringe
 * ([[WeeklyGoalRings]]) — damit beide GENAU gleich aussehen. Theme-sicher über
 * CSS-Variablen (alle Kontrastmodi). Siehe [[project_zehnfinger_trainer]].
 */

export interface RingGaugeProps {
  /** Füllgrad 0..1 (wird gekappt). */
  frac: number;
  /** Durchmesser in px. */
  size?: number;
  /** Inhalt in der Mitte (i. d. R. eine Zahl). */
  children: React.ReactNode;
}

export function RingGauge({ frac, size = 56, children }: RingGaugeProps) {
  const stroke = Math.max(4, Math.round(size * 0.11));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const f = Math.max(0, Math.min(1, frac));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Spur */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(var(--c-hairline))"
          strokeWidth={stroke}
        />
        {/* gefüllter Anteil — nur ab dem ersten Stück zeichnen, sonst setzt die
           runde Strichkappe schon bei 0 einen störenden Punkt. */}
        {f > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgb(var(--c-accent-solid))"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${(circ * f).toFixed(2)} ${circ.toFixed(2)}`}
            style={{ transition: "stroke-dasharray 500ms ease-out" }}
          />
        )}
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold leading-none text-ink"
        style={{ fontSize: Math.round(size * 0.42) }}
        aria-hidden="true"
      >
        {children}
      </span>
    </div>
  );
}
