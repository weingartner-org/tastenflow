/**
 * ★★★★★ WÄCHTER M4, Teil Plan (27.09.2026): Der Défi einer „fr"-Klasse
 * speichert seinen WEG und die GRUNDREIHE der Tastatur, an der die Lehrkraft
 * startet - die Kinder laden die Bank aus dem Plan.
 *
 * Der Nebenbefund dahinter: `SchreibprobeKasten` schrieb nur `lernweg: "en"`.
 * Ein Défi einer fr-Klasse kam ohne Weg in den Plan, `lernwegVon(plan)` las
 * „de", und die Kinder bekamen den DEUTSCHEN Text. Die bisherigen Tests
 * ersetzten `setzeSchreibprobe` durch eine Attrappe, die den Plan wegwarf.
 *
 * Gegenprobe: eine „de"-Klasse auf derselben Schweizer Tastatur schreibt
 * weder Weg noch Grundreihe (Golden „de", der Plan bleibt Byte für Byte).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { TypingAccount, TypingClass } from "@/lib/typing/account";
import { SchreibprobeKasten } from "@/components/lernwerkstatt/klasse/SchreibprobeKasten";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";

const gesetzt: Array<{ plan: Record<string, unknown> }> = [];

vi.mock("@/lib/typing/backend", () => ({
  typingBackend: () => ({
    setzeSchreibprobe: async (c: string, t: string, plan: Record<string, unknown>) => {
      gesetzt.push({ plan });
      return { code: c, name: "4a", teacherId: t, createdAt: 0 } as TypingClass;
    },
    leseKlassenProben: async () => ({}),
    beobachteKinder: () => () => {},
    listPupils: async () => [],
    listeMeineTexte: async () => [],
    leseMeinenText: async () => null,
  }),
}));

const KINDER = [{ id: "k1", role: "schueler", name: "Léa", createdAt: 0 }] as TypingAccount[];

function klasse(lernweg?: "fr"): TypingClass {
  return { code: "4a", name: "4a", teacherId: "t1", createdAt: 0, ...(lernweg ? { lernweg } : {}) } as TypingClass;
}

async function starte(cls: TypingClass, tastatur: LayoutId): Promise<{ plan: Record<string, unknown>; optionen: string[] }> {
  setLayout(tastatur);
  render(<SchreibprobeKasten cls={cls} pupils={KINDER} onClassChange={vi.fn()} />);
  const auswahl = await waitFor(() => screen.getByLabelText("Tastaturniveau") as HTMLSelectElement);
  const optionen = [...auswahl.options].map((o) => o.textContent ?? "");
  fireEvent.click(screen.getByRole("button", { name: "Jetzt starten" }));
  await waitFor(() => expect(gesetzt.length).toBe(1));
  return { plan: gesetzt[0].plan, optionen };
}

beforeEach(() => {
  gesetzt.length = 0;
  vi.stubGlobal("confirm", () => true);
});
afterEach(() => {
  cleanup();
  setLayout("de");
});

describe("★★★★★ M4: der Plan eines fr-Défi trägt Weg und Grundreihe", () => {
  it("ch-fr: lernweg fr, grundreihe ch - und das Formular nennt a … é", async () => {
    const { plan, optionen } = await starte(klasse("fr"), "ch-fr");
    expect(plan.lernweg).toBe("fr");
    expect(plan.grundreihe).toBe("ch");
    expect(optionen[0]).toContain("a é");
    expect(optionen[0]).not.toContain("q m");
  });

  it("ca-csa: lernweg fr, grundreihe ca", async () => {
    const { plan } = await starte(klasse("fr"), "ca-csa");
    expect(plan.lernweg).toBe("fr");
    expect(plan.grundreihe).toBe("ca");
  });

  it("fr (AZERTY): lernweg fr, KEINE grundreihe - das Formular nennt q m", async () => {
    const { plan, optionen } = await starte(klasse("fr"), "fr");
    expect(plan.lernweg).toBe("fr");
    expect("grundreihe" in plan).toBe(false);
    expect(optionen[0]).toContain("q m");
  });

  it("Gegenprobe: eine de-Klasse auf ch-fr schreibt weder Weg noch Grundreihe", async () => {
    const { plan } = await starte(klasse(), "ch-fr");
    expect("lernweg" in plan).toBe(false);
    expect("grundreihe" in plan).toBe(false);
  });
});
