/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ DIE REGEL „STRG MACHT STILL" - einmal für alle drei Vorlese-Motoren
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 04.09.2026: *„egal an welcher Stelle gelesen wird, mit Strg muss es
 * sofort leise werden"* - und danach: *„mach das auch für die anderen Apps."*
 *
 * `lib/stummTaste.ts` ist die eine Stelle, an der steht, WANN still gemacht
 * wird. Was „still" heisst, sagt jeder Motor selbst (Tastenflow, Punktgenau /
 * Klangpunkte, »im Griff«) - dass er den Zuhörer wirklich anhängt, prüft je ein
 * eigener Wächter.
 *
 * ── Was hier festgenagelt wird ─────────────────────────────────────────────
 *
 *  1. Strg allein macht still - die Geste jedes Screenreaders.
 *  2. ⚠️ **AltGr ist Strg + Alt.** Für `@` (AltGr + Q) meldet Windows beide.
 *     Wer diese Ausnahme streicht, nimmt Kindern die Ansage genau der Zeichen,
 *     die sie gerade lernen - in drei Programmen gleichzeitig. Das ist die
 *     Zeile, die beim „Aufräumen" fällt, und der Grund, warum die Regel nur
 *     einmal existiert.
 *  3. Eine gehaltene Taste macht einmal still, nicht dauernd.
 *  4. Capture: Der Zuhörer läuft VOR den Tastenwegen der Bildschirme, damit
 *     eine Ansage, die danach kommt („Tasten erkunden" sagt „Strg" an), nicht
 *     von ihrem eigenen Auslöser abgeschnitten wird.
 */
import { afterEach, describe, it, expect, vi } from "vitest";
import { ALTGR_STRG_FENSTER_MS, installStummTaste } from "@/lib/stummTaste";

/** Eine Taste, so wie der Browser sie meldet. */
function taste(init: KeyboardEventInit): void {
  document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));
}

/** Ein frisch angehängter Zuhörer samt Zähler. */
function zuhoerer() {
  const still = vi.fn();
  installStummTaste(still);
  return still;
}

describe("stummTaste - wann still gemacht wird", () => {
  it("★ Strg allein", () => {
    const still = zuhoerer();
    taste({ key: "Control", ctrlKey: true });
    expect(still).toHaveBeenCalledTimes(1);
  });

  it("★ eine Strg-Kombination (Strg + C)", () => {
    const still = zuhoerer();
    taste({ key: "c", ctrlKey: true });
    expect(still).toHaveBeenCalledTimes(1);
  });

  it("★★★★★ NICHT bei AltGr (Strg + Alt) - das @ eines deutschen Layouts", () => {
    const still = zuhoerer();
    taste({ key: "@", ctrlKey: true, altKey: true });
    taste({ key: "Alt", ctrlKey: true, altKey: true }); // AltGr meldet sich so
    expect(still).not.toHaveBeenCalled();
  });

  it("nicht bei gewöhnlichen Tasten und anderen Sondertasten", () => {
    const still = zuhoerer();
    taste({ key: "f" });
    taste({ key: "Shift", shiftKey: true });
    taste({ key: "Alt", altKey: true });
    taste({ key: "Meta", metaKey: true });
    expect(still).not.toHaveBeenCalled();
  });

  it("★ gehaltene Taste: einmal still ist still", () => {
    const still = zuhoerer();
    taste({ key: "Control", ctrlKey: true });
    taste({ key: "Control", ctrlKey: true, repeat: true });
    taste({ key: "Control", ctrlKey: true, repeat: true });
    expect(still).toHaveBeenCalledTimes(1);
  });

  it("★ CAPTURE: der Zuhörer läuft vor den Tastenwegen der Bildschirme", () => {
    /*
      Ein Bildschirm, der Strg für sich behält (`stopPropagation` in der
      Blasen-Phase), darf das Stummschalten nicht verhindern - sonst hinge es
      davon ab, wo gerade der Fokus steht. Umgekehrt gilt: Wer NACH uns etwas
      sagt, spricht nach dem Abbruch und wird nicht selbst abgeschnitten.
    */
    const reihenfolge: string[] = [];
    const bildschirm = (e: Event) => {
      reihenfolge.push("bildschirm");
      e.stopPropagation();
    };
    document.addEventListener("keydown", bildschirm);
    installStummTaste(() => reihenfolge.push("still"));
    taste({ key: "Control", ctrlKey: true });
    document.removeEventListener("keydown", bildschirm);
    expect(reihenfolge).toEqual(["still", "bildschirm"]);
  });
});

/*
  ★★★★ 28.10.2026, gemessen am Windows-PC (Edge, echte Tastendrücke): AltGr
  schickt 0,1-0,2 ms VOR AltRight ein eigenes keydown Control/ControlLeft - ohne
  altKey. Bis dahin machte darum JEDES AltGr still (@ € { [ ...).
*/
describe("stummTaste - das Strg, das AltGr vorausschickt", () => {
  afterEach(() => vi.useRealTimers());

  it("★★★★★ AltGr so, wie Windows es schickt (Strg links, gleich danach AltRight): NICHT still", () => {
    vi.useFakeTimers();
    const still = zuhoerer();
    taste({ key: "Control", code: "ControlLeft", ctrlKey: true });
    taste({ key: "AltGraph", code: "AltRight", ctrlKey: true, altKey: true });
    vi.advanceTimersByTime(ALTGR_STRG_FENSTER_MS * 3);
    expect(still).not.toHaveBeenCalled();
  });

  it("★ Strg links allein: still - nach der kurzen Wartezeit", () => {
    vi.useFakeTimers();
    const still = zuhoerer();
    taste({ key: "Control", code: "ControlLeft", ctrlKey: true });
    expect(still).not.toHaveBeenCalled();
    vi.advanceTimersByTime(ALTGR_STRG_FENSTER_MS);
    expect(still).toHaveBeenCalledTimes(1);
  });

  it("★ Strg rechts allein: sofort still (dort gibt es kein Doppel)", () => {
    const still = zuhoerer();
    taste({ key: "Control", code: "ControlRight", ctrlKey: true });
    expect(still).toHaveBeenCalledTimes(1);
  });

  it("★ Strg links + C: die Kombination macht sofort still", () => {
    vi.useFakeTimers();
    const still = zuhoerer();
    taste({ key: "Control", code: "ControlLeft", ctrlKey: true });
    taste({ key: "c", code: "KeyC", ctrlKey: true });
    expect(still).toHaveBeenCalled();
  });

  it("Gegenprobe: die Wartezeit ist kurz (unter 50 ms) - Strg bleibt eine sofortige Geste", () => {
    expect(ALTGR_STRG_FENSTER_MS).toBeGreaterThan(0);
    expect(ALTGR_STRG_FENSTER_MS).toBeLessThan(50);
  });
});
