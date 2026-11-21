/**
 * ★ Testerin 04.11.2026: „Entf" wurde als „Entfach" gesprochen. Die STIMME sagt
 * nur noch „Entfernen-Taste"; Schirm und Braillezeile behalten „Entf".
 */
import { describe, expect, it } from "vitest";
import { ansageFuer, zeileFuer, erklaereSondertaste } from "@/lib/typing/tastenErklaerung";

describe("Entf-Taste: Stimme und Schirm", () => {
  const t = erklaereSondertaste({ key: "Delete", code: "Delete" } as never, "windows" as never);
  it("die Stimme nennt nicht die Abkürzung", () => {
    expect(t).not.toBeNull();
    const a = ansageFuer(t!);
    expect(a.startsWith("Entfernen-Taste")).toBe(true);
    expect(a).not.toMatch(/\bEntf\b/);
  });
  it("Gegenprobe: der Schirm behält Entf", () => {
    expect(zeileFuer(t!).startsWith("Entf - Entfernen-Taste")).toBe(true);
  });
  it("Gegenprobe: andere Tasten behalten ihre Abkürzung in der Ansage", () => {
    const tab = erklaereSondertaste({ key: "Tab", code: "Tab" } as never, "windows" as never);
    expect(ansageFuer(tab!).startsWith("Tab,")).toBe(true);
  });
});
