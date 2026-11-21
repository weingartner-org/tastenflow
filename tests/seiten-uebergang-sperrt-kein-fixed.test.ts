/**
 * ════════════════════════════════════════════════════════════════════════════
 * DER SEITEN-ÜBERGANG DARF `position: fixed` NICHT EINSPERREN
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 04.09.2026: *„mach die fixierte kopfleiste gleich mit."*
 *
 * ── Der Befund ────────────────────────────────────────────────────────────
 * `.page-transition` umschliesst in `App.tsx` den gesamten `<Outlet>`, also
 * jede Route der Plattform. Die Klasse trug bis zum 04.09. `animation: page-in
 * 200ms ease-out both`. Das `both` schliesst `forwards` ein - nach den 200 ms
 * bleibt der Endzustand der Animation stehen, und der lautet `transform:
 * translateY(0)`.
 *
 * `translateY(0)` sieht aus wie nichts. Für den Browser ist es aber ein
 * `transform` ungleich `none`, und ein solches Element wird zum **umgebenden
 * Block** für alles, was darunter `position: fixed` ist. Aus „am Bildschirm
 * fixiert" wird damit still „am Dokument fixiert" - es scrollt weg.
 *
 * Gemessen auf `/programme/bild-beschreiben`: bei `scrollY = 80` stand der
 * Melden-Knopf bei `getBoundingClientRect().y = -63.75`, also genau `16 - 80`.
 *
 * ── Warum das ein WÄCHTER braucht und keine Sichtprüfung ──────────────────
 * Der Fehler sieht aus wie ein Layout-Zufall: „die Leiste scrollt halt mit".
 * Niemand sucht dahinter eine CSS-Zeile in einer ganz anderen Datei, und ein
 * `fixed`, das nicht fixiert, wirft keine Meldung und keinen roten Test. Genau
 * so hat er monatelang gehalten. Wer `both` zurückschreibt - etwa weil ihm ein
 * Aufblitzen auffällt -, soll hier anstossen und die Begründung lesen.
 *
 * ⚠️ Was dieser Wächter NICHT kann: Er misst am Quelltext, nicht im Browser.
 * jsdom rechnet keine Animationen aus, ein echter Beweis ist nur eine Messung
 * im Browser ([[feedback_gruener_waechter_beweist_was]]). Er hält deshalb
 * genau die eine Zeile fest, an der es hing - mehr behauptet er nicht.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(WURZEL, "src", "index.css"), "utf8");

/** Der Rumpf der `.page-transition`-Regel - ohne die Kommentare davor. */
function regelRumpf(): string {
  const treffer = css.match(/^\.page-transition\s*\{([^}]*)\}/m);
    expect(treffer, "Die Regel .page-transition steht nicht mehr in index.css").toBeTruthy();
  return (treffer as RegExpMatchArray)[1];
}

describe("Der Seiten-Übergang sperrt kein position: fixed ein", () => {
  it("hält den Endzustand der Animation NICHT fest", () => {
    const rumpf = regelRumpf();
    // `forwards` und `both` halten beide den Endzustand - und der Endzustand
    // ist ein `transform`. Beides ist hier verboten.
    expect(rumpf).not.toMatch(/\bforwards\b/);
    expect(rumpf).not.toMatch(/\bboth\b/);
  });

  it("benutzt `backwards` - das Aufblitzen bleibt verhindert", () => {
    // Nicht nur „kein both": Ohne jede Angabe wäre der Schutz gegen ein
    // Aufblitzen vor dem ersten Einzelbild weg. Gemeint ist genau `backwards`.
    expect(regelRumpf()).toMatch(/\bbackwards\b/);
  });

  it("animiert weiterhin `page-in` - die Regel wurde nicht einfach entfernt", () => {
    // Gegenprobe: Wer die Animation ganz herausnimmt, macht die zwei Prüfungen
    // oben grün und die Seiten-Übergänge kaputt.
    expect(regelRumpf()).toMatch(/\bpage-in\b/);
    expect(css).toMatch(/@keyframes\s+page-in\s*\{/);
  });

  it("kein anderer Vorfahre aller Routen bringt ein eigenes `transform` mit", () => {
    // `.page-transition` ist der EINZIGE Wrapper um den <Outlet> (App.tsx).
    // Kommt dort ein zweiter dazu, der ein transform/filter/perspective trägt,
    // ist der Fehler zurück - ohne dass eine der Prüfungen oben es merkt.
    const app = readFileSync(join(WURZEL, "src", "App.tsx"), "utf8");
    const wrapper = app.match(/<div key=\{location\.key\} className="([^"]*)">/);
    expect(wrapper, "Der Wrapper um den <Outlet> sieht anders aus als erwartet").toBeTruthy();
    expect((wrapper as RegExpMatchArray)[1].trim()).toBe("page-transition");
  });
});
