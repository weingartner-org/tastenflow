/**
 * WÄCHTER: „Meine Klassen" öffnet die Klasse, die die Lehrkraft zuletzt offen
 * hatte - nicht die oberste der Liste.
 * ===========================================================================
 *
 * Johannes, 21.09.2026: *„wenn ich als Lehrer die Seite »Meine Klassen« öffne,
 * soll ich immer auf der stehen, die ich als letzte offen hatte, nicht die
 * oberste in der Liste."*
 *
 * ★★★ WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  · Die Seite öffnet wieder die erste Klasse der Liste - rot (Seitentest).
 *  · Eine Adresse mit `?klasse=` verliert gegen den Merker - rot.
 *  · Der Merker einer anderen Lehrkraft gilt für diese - rot.
 *  · Ein Merker auf eine gelöschte Klasse lässt die Seite leer - rot.
 *  · Ein gesperrter Speicher wirft - rot.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MeineKlassePage } from "@/features/public/MeineKlassePage";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import type { TypingAccount } from "@/lib/typing";
import { createClass, registerTeacher } from "@/lib/typing/account";
import {
  liesZuletztKlasse,
  merkeZuletztKlasse,
  waehleKlasse,
} from "@/lib/lernwerkstatt/zuletztKlasse";

/** Klassencodes gelten überall nur einmal - darum je Lehrkraft eigene. */
function lehrkraftMitZweiKlassen(name: string, mail: string, codes: [string, string] = ["1A", "2B"]) {
  const t = registerTeacher(name, mail, "geheim123");
  if (!t.ok) throw new Error(t.error);
  const erste = createClass(t.value.id, "1a", codes[0]);
  const zweite = createClass(t.value.id, "2b", codes[1]);
  if (!erste.ok || !zweite.ok) throw new Error("Klasse nicht angelegt");
  return { lehrkraft: t.value as TypingAccount, erste: erste.value, zweite: zweite.value };
}

function zeige(pfad = "/meine-klasse") {
  render(
    <MemoryRouter initialEntries={[pfad]}>
      <Routes>
        <Route path="/meine-klasse" element={<MeineKlassePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  // Die Seite zieht die gewählte Klasse per `history.replaceState` in die
  // Adresse nach (`?klasse=…`) - und die Adresse des jsdom-Fensters überlebt
  // den Test. Ohne diese Zeile erbte jeder Test die Klasse des vorigen.
  window.history.replaceState(null, "", "/");
  useTypingAuth.setState({ account: null });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useTypingAuth.setState({ account: null });
});

describe("waehleKlasse · Wahl vor Merker vor erster Klasse", () => {
  const liste = [{ code: "A" }, { code: "B" }, { code: "C" }];
  it("ohne alles: die erste", () => expect(waehleKlasse(liste, null, null)?.code).toBe("A"));
  it("der Merker schlägt die erste", () => expect(waehleKlasse(liste, null, "C")?.code).toBe("C"));
  it("die ausdrückliche Wahl schlägt den Merker", () =>
    expect(waehleKlasse(liste, "B", "C")?.code).toBe("B"));
  it("ein Code, den es nicht (mehr) gibt, wird übersprungen", () => {
    expect(waehleKlasse(liste, "X", "C")?.code).toBe("C");
    expect(waehleKlasse(liste, "X", "Y")?.code).toBe("A");
  });
  it("eine leere Liste gibt nichts zurück", () =>
    expect(waehleKlasse([], "A", "B")).toBeNull());
});

describe("Merker im Browser", () => {
  it("wird je Lehrkraft gehalten", () => {
    merkeZuletztKlasse("t1", "ABC");
    expect(liesZuletztKlasse("t1")).toBe("ABC");
    expect(liesZuletztKlasse("t2")).toBeNull();
  });
  it("ohne Kennung oder Code passiert nichts", () => {
    merkeZuletztKlasse(null, "ABC");
    merkeZuletztKlasse("t1", "");
    expect(liesZuletztKlasse(null)).toBeNull();
    expect(liesZuletztKlasse("t1")).toBeNull();
  });
  it("ein gesperrter Speicher wirft nicht", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("gesperrt");
    });
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("gesperrt");
    });
    expect(() => merkeZuletztKlasse("t1", "ABC")).not.toThrow();
    expect(liesZuletztKlasse("t1")).toBeNull();
  });
});

describe("Die Seite", () => {
  it("öffnet ohne Merker die erste Klasse und merkt sie sich", async () => {
    const { lehrkraft, erste } = lehrkraftMitZweiKlassen("Frau Berger", "berger@example.org");
    useTypingAuth.setState({ account: lehrkraft });
    zeige();
    await screen.findByRole("heading", { name: "1a" });
    await waitFor(() => expect(liesZuletztKlasse(lehrkraft.id)).toBe(erste.code));
  });

  it("öffnet die zuletzt geöffnete Klasse, nicht die oberste", async () => {
    const { lehrkraft, zweite } = lehrkraftMitZweiKlassen("Frau Berger", "berger@example.org");
    merkeZuletztKlasse(lehrkraft.id, zweite.code);
    useTypingAuth.setState({ account: lehrkraft });
    zeige();
    await screen.findByRole("heading", { name: "2b" });
    expect(screen.queryByRole("heading", { name: "1a" })).toBeNull();
  });

  it("eine Klasse aus der Adresse geht dem Merker vor", async () => {
    const { lehrkraft, erste, zweite } = lehrkraftMitZweiKlassen("Frau Berger", "berger@example.org");
    merkeZuletztKlasse(lehrkraft.id, zweite.code);
    useTypingAuth.setState({ account: lehrkraft });
    // Die Seite liest `window.location`, nicht den Router (siehe die Seite selbst).
    window.history.replaceState(null, "", `/meine-klasse?klasse=${erste.code}`);
    zeige();
    await screen.findByRole("heading", { name: "1a" });
  });

  it("der Merker einer anderen Lehrkraft gilt hier nicht", async () => {
    const eine = lehrkraftMitZweiKlassen("Frau Berger", "berger@example.org");
    const andere = lehrkraftMitZweiKlassen("Herr Adam", "adam@example.org", ["9A", "9B"]);
    merkeZuletztKlasse(eine.lehrkraft.id, eine.zweite.code);
    useTypingAuth.setState({ account: andere.lehrkraft });
    zeige();
    await screen.findByRole("heading", { name: "1a" });
  });

  it("ein Merker auf eine Klasse, die es nicht mehr gibt, fällt auf die erste zurück", async () => {
    const { lehrkraft } = lehrkraftMitZweiKlassen("Frau Berger", "berger@example.org");
    merkeZuletztKlasse(lehrkraft.id, "GELOESCHT");
    useTypingAuth.setState({ account: lehrkraft });
    zeige();
    await screen.findByRole("heading", { name: "1a" });
  });
});
