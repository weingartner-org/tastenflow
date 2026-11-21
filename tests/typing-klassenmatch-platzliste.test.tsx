/**
 * Tester (Kind, 13.11.2026): „ich hätte gerne ... dass ich in klassenmatch eine
 * Tastenkombination habe, wo ich sehen kann, wievielter Platz jemand ist."
 * Johannes 13.11.: bauen. ⇒ Alt + P (P wie Platzliste) sagt ALLE Plätze an -
 * Alt + X nennt nur den eigenen Platz und die ersten drei.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { KlassenmatchLauf } from "@/components/typing/KlassenmatchLauf";
import { MATCH_DAUER_MS, matchPlatzliste, rangliste, type Match, type MatchStand } from "@/lib/typing/klassenmatch";
import { emptyProgress } from "@/lib/typing/progress";
import type { TypingAccount } from "@/lib/typing/account";

const KIND = { id: "sarah", role: "schueler", name: "Sarah", classCode: "K1", createdAt: 1 } as unknown as TypingAccount;
const match = (over: Partial<Match> = {}): Match =>
  ({ id: "m1", classCode: "K1", hostUid: "lehrer", hostName: "Frau L", startMs: Date.now() - 75_000, endeMs: Date.now() - 75_000 + MATCH_DAUER_MS, dauerMin: 5, createdMs: Date.now() - 95_000, status: "laeuft", ...over }) as unknown as Match;
const stand = (over: Partial<MatchStand>): MatchStand =>
  ({ id: "s", matchId: "m1", classCode: "K1", pupilUid: "sarah", name: "Sarah", status: "schreibt", zeichen: 300, fehler: 2, apm: 150, wert: 0, updatedMs: Date.now(), ...over }) as MatchStand;
const STAENDE = [
  stand({}),
  stand({ id: "s2", pupilUid: "mia", name: "Mia", zeichen: 200, apm: 100 }),
  stand({ id: "s3", pupilUid: "ben", name: "Ben", zeichen: 100, apm: 50 }),
  stand({ id: "s4", pupilUid: "toprak", name: "Toprak", zeichen: 80, apm: 40 }),
  stand({ id: "s5", pupilUid: "lea", name: "Lea", zeichen: 60, apm: 30 }),
];

afterEach(cleanup);

describe("Platzliste (Tester 13.11.)", () => {
  it("nennt alle Plätze, nicht nur die ersten drei", () => {
    const t = matchPlatzliste(rangliste(STAENDE));
    expect(t).toBe("1. Sarah, 2. Mia, 3. Ben, 4. Toprak, 5. Lea.");
  });

  it("Alt + P sagt im laufenden Match die ganze Liste an", async () => {
    const { container } = render(
      <KlassenmatchLauf match={match()} staende={STAENDE} account={KIND} stufe="kids" lang="de"
        loadFn={async () => emptyProgress()} saveFn={vi.fn()} onTask={vi.fn()} onStand={vi.fn()}
        onFertig={vi.fn()} onWeiter={vi.fn()} onVerlassen={vi.fn()} />,
    );
    await screen.findByRole("textbox");
    fireEvent.keyDown(window, { altKey: true, code: "KeyP", key: "π" });
    await waitFor(() => {
      const texte = Array.from(container.querySelectorAll("[aria-live]")).map((b) => b.textContent ?? "").join(" ");
      // alle fünf, jeder mit seinem Platz - auch die, die Alt + X nicht nennt
      for (const n of ["Sarah", "Mia", "Ben", "Toprak", "Lea"]) expect(texte).toMatch(new RegExp(`[1-5]\\. ${n}`));
      expect(texte).toMatch(/5\. /);
    });
  });

  it("Alt + Umschalt + P bleibt Melden - die Platzliste antwortet dann nicht", async () => {
    const { container } = render(
      <KlassenmatchLauf match={match()} staende={STAENDE} account={KIND} stufe="kids" lang="de"
        loadFn={async () => emptyProgress()} saveFn={vi.fn()} onTask={vi.fn()} onStand={vi.fn()}
        onFertig={vi.fn()} onWeiter={vi.fn()} onVerlassen={vi.fn()} />,
    );
    await screen.findByRole("textbox");
    fireEvent.keyDown(window, { altKey: true, shiftKey: true, code: "KeyP", key: "P" });
    await new Promise((r) => setTimeout(r, 60));
    const texte = Array.from(container.querySelectorAll("[aria-live]")).map((b) => b.textContent ?? "").join(" ");
    expect(texte).not.toContain("5. Lea");
  });
});
