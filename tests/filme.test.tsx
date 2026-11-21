// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { FILME, dauerText, filmDateien, filmVon } from "@/lib/filme";
import { FilmKnopf, FilmeListe } from "@/components/FilmKnopf";

describe("Einführungsfilme", () => {
  it("jede Nummer und jede Datei kommt nur einmal vor", () => {
    expect(new Set(FILME.map((f) => f.nr)).size).toBe(FILME.length);
    expect(new Set(FILME.map((f) => f.datei)).size).toBe(FILME.length);
  });

  it("Dauer als m:ss", () => {
    expect(dauerText(66)).toBe("1:06");
  });

  it("unbekannte Nummer zeigt keinen Knopf", () => {
    const { container } = render(<FilmKnopf nr="Z-99" />);
    expect(container.innerHTML).toBe("");
    cleanup();
  });

  it("Knopf öffnet den Dialog: Untertitel-Spur, kein autoplay, Fokus zurück bei Escape", () => {
    render(<FilmKnopf nr="T-L02" />);
    const knopf = screen.getByRole("button", { name: /Film ansehen \(\d+:\d\d\)/ });
    knopf.focus();
    fireEvent.click(knopf);
    const dialog = screen.getByRole("dialog");
    const video = dialog.querySelector("video")!;
    expect(video).toBeTruthy();
    expect(video.hasAttribute("controls")).toBe(true);
    expect(video.getAttribute("preload")).toBe("none");
    expect(video.querySelector('track[kind="captions"]')).toBeTruthy();
    expect(document.querySelector("[autoplay]")).toBeNull();
    expect(screen.getByRole("button", { name: "Nur anhören" })).toBeTruthy();
    expect(screen.getByText("Was im Film gesagt wird")).toBeTruthy();
    fireEvent.keyDown(document.activeElement ?? dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(knopf);
    cleanup();
  });

  it("Liste zeigt nur Filme der App", () => {
    render(<FilmeListe app="lexami" />);
    expect(screen.getAllByRole("button").length).toBe(FILME.filter((f) => f.app === "lexami").length);
    cleanup();
  });
});

describe("Zielgruppe (17.11.2026)", () => {
  it("die Hilfe der Übungsseite (Kinder) zeigt keine Lehrkraft-Filme", async () => {
    const { filmeDerApp, filmFuer } = await import("@/lib/filme");
    const fuerKinder = filmeDerApp("tastenflow", "lernende");
    expect(fuerKinder.length).toBeGreaterThan(0);
    expect(fuerKinder.every((f) => filmFuer(f) === "lernende")).toBe(true);
    expect(filmeDerApp("tastenflow", "lehrkraft").some((f) => f.nr === "T-L02")).toBe(true);
  });

  it("Dateien liegen unter /filme/", () => {
    expect(filmDateien(FILME[0]).mp4.startsWith("/filme/")).toBe(true);
  });

  it("jede im Code eingehängte Nummer steht in filme.ts", () => {
    const alle: string[] = [];
    const geh = (d: string) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) geh(p);
        else if (p.endsWith(".tsx")) alle.push(...[...readFileSync(p, "utf8").matchAll(/<FilmKnopf (?:[^>]*?)nr="([A-Z]-[LS]\d+[ab]?)"/g)].map((m) => m[1]));
      }
    };
    geh("src");
    expect(alle.length).toBeGreaterThan(10);
    for (const nr of alle) expect(filmVon(nr), nr).toBeTruthy();
  });
});
