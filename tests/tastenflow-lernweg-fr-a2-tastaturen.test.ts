/**
 * Fassung A2 (25.09.2026) auf allen französischen Tastaturen: keine Einheit
 * doppelt, und die auf Schweiz-Französisch/Kanada verdrängten AZERTY-Grundtasten
 * „q m" kommen nach „h" (E5-Befund §8.2). Auf fr/be bleibt die AZERTY-Folge.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";

afterEach(() => setLayout("de"));

describe("Fassung A2 je Tastatur", () => {
  it.each(["fr", "be", "ch-fr", "ca-csa", "ca-fr"] as LayoutId[])("%s: keine Einheit doppelt", (l) => {
    setLayout(l);
    const o = introOrder("fr");
    expect(o.filter((u, i) => o.indexOf(u) !== i)).toEqual([]);
  });

  it("fr: Grundreihe f j d k s l q m (Anker zuerst), dann e t n u i a o r", () => {
    setLayout("fr");
    expect(introOrder("fr").slice(0, 16).join(" ")).toBe("f j d k s l q m e t n u i a o r");
  });

  // ★ S1 (Mechanik-Prüfung fr, 26.09.2026): E5 §8.2 misst für Schweiz/Kanada
  // NUR „q" nach „h" - „m" gehört direkt nach „p" (vorher kamen beide nach h).
  it.each(["ch-fr", "ca-csa", "ca-fr"] as LayoutId[])("%s: m direkt nach p, q direkt nach h", (l) => {
    setLayout(l);
    const o = introOrder("fr");
    expect(o[o.indexOf("p") + 1]).toBe("m");
    expect(o[o.indexOf("h") + 1]).toBe("q");
    expect(o.filter((u) => u === "a")).toHaveLength(1);
    expect(o.filter((u) => u === "m")).toHaveLength(1);
  });

  // ★ S2 (26.09.2026): Kanada - der Apostroph ist Umschalt + Komma, er kommt
  // darum direkt nach der Umschalttaste, nicht vor ihr.
  it.each(["ca-csa", "ca-fr"] as LayoutId[])("%s: Apostroph direkt nach ⇧", (l) => {
    setLayout(l);
    const o = introOrder("fr");
    expect(o[o.indexOf("⇧") + 1]).toBe("'");
  });

  it.each(["fr", "be", "ch-fr"] as LayoutId[])("%s: Apostroph ohne Umschalt - bleibt vor ⇧", (l) => {
    setLayout(l);
    const o = introOrder("fr");
    expect(o.indexOf("'")).toBeLessThan(o.indexOf("⇧"));
  });

  it("ch-fr: é steht in der Grundreihe und kommt später nicht noch einmal", () => {
    setLayout("ch-fr");
    const o = introOrder("fr");
    expect(o[7]).toBe("é");
    expect(o.lastIndexOf("é")).toBe(7);
  });
});
