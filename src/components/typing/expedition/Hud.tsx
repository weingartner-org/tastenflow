/**
 * HUD-Mini-Reisekarte (Bauplan §2 „Hud.tsx", E7): die schmale Kopfzeile zeigt neben dem
 * Zonennamen, wo auf der Reise vom Morgen in die Nacht der Pinguin gerade steht — ein
 * Punkt je Zone (Farbe = Tageszeit), der aktuelle hervorgehoben, erledigte gefüllt.
 * Rein visuell (aria-hidden): den Fortschritt sagt das Tagebuch an (§7).
 */
import type { TimeOfDay } from "@/lib/typing/expedition/course";
import { Hinweisflaeche } from "../Zeigerhinweis";

/** Punkt-Farbe je Tageszeit — derselbe Morgen→Nacht-Bogen wie die Letterbox (§4.5). */
const TIME_DOT: Record<TimeOfDay, string> = {
  morning: "#7fb2dd",
  golden: "#f2b45a",
  dark: "#5a5680",
  twilight: "#9b7fc0",
  evening: "#e0965f",
  night: "#3a5a90",
};

export interface HudZone {
  name: string;
  timeOfDay: TimeOfDay;
  state: "done" | "current" | "todo";
}

export interface HudProps {
  zones: readonly HudZone[];
  index: number;
  total: number;
}

export function Hud({ zones, index, total }: HudProps) {
  return (
    <span className="px-hud__map" aria-hidden="true">
      <span className="px-hud__step">Zone {Math.min(index + 1, total)}/{total}</span>
      <span className="px-hud__dots">
        {/* ★ N15c: Hinweisflaeche statt `title` - der Punkt ist kein
           Tabstopp, der Hinweis muss also nur gross und sofort bei der Maus
           erscheinen, nicht beim Fokus. */}
        {zones.map((z, i) => (
          <Hinweisflaeche key={i} hilfe={z.name}>
            <span
              className={`px-hud__dot px-hud__dot--${z.state}`}
              style={{ ["--dot" as string]: TIME_DOT[z.timeOfDay] }}
            />
          </Hinweisflaeche>
        ))}
      </span>
    </span>
  );
}
