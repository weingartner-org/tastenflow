/**
 * Probe-Schalter für die Sprachen der Apps (Bauplan 2026-11-06 §0 Nr. 4).
 * Bauart wie die Lehrgangs-Schalter von Tastenflow (`typing/lehrgangSchalter.ts`):
 * `?<name>=1` schaltet an und merkt es sich auf dem Gerät, `?<name>=0` schaltet
 * aus und merkt sich das ebenfalls (Not-Aus).
 *
 * ★★★ VORGABE AN seit 10.11.2026 (Johannes: „die app/Plattform selbst schaut
 * welche sprache im browser verwendet wird und automatisch umschalten, im
 * Zweifel englisch"). Ohne Wort in der Adresse und ohne gemerkten Not-Aus gilt
 * der Schalter als EIN.
 *
 * Die Schalter dieses Plans:
 *  - `sprachen-sims`        - /erleben, Sims, Hörbuch-Studio (§1c)
 *  - `klangpunkte-sprachen` - Klangpunkte (§3)
 *  - `punktgenau-sprachen`  - Punktgenau Welle 1 (§4)
 *  - `plus-sprachen`        - Plus (§5)
 */
export type ProbeSchalter = "sprachen-sims" | "klangpunkte-sprachen" | "punktgenau-sprachen" | "plus-sprachen";

const merker = (name: ProbeSchalter) => `probe-${name}`;

export function probeSchalterAn(name: ProbeSchalter, suche?: string): boolean {
  let s = suche;
  if (s === undefined) {
    try {
      s = window.location.search;
    } catch {
      s = "";
    }
  }
  const wert = new URLSearchParams(s ?? "").get(name);
  try {
    if (wert === "1") window.localStorage.setItem(merker(name), "1");
    else if (wert === "0") window.localStorage.setItem(merker(name), "0");
  } catch {
    /* Speicher gesperrt - dann gilt nur die Adresse */
  }
  if (wert === "1") return true;
  if (wert === "0") return false;
  try {
    return window.localStorage.getItem(merker(name)) !== "0";
  } catch {
    return true;
  }
}
