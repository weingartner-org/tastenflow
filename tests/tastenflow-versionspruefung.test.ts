// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buendelName,
  eigenesBuendel,
  sollNeuLaden,
  starteVersionsPruefung,
} from "@/lib/typing/versionsPruefung";

function setzeSichtbar(zustand: "visible" | "hidden") {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => zustand });
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("Versionsprüfung: Bausteine", () => {
  it("liest den Bündelnamen aus Pfad und Adresse", () => {
    expect(buendelName("/assets/index-OuP5V1j1.js")).toBe("index-OuP5V1j1.js");
    expect(buendelName("https://tastenflow.org/assets/index-U3-PmYXm.js")).toBe("index-U3-PmYXm.js");
    expect(buendelName("index-CfI_8-kv.js")).toBe("index-CfI_8-kv.js");
    expect(buendelName("/assets/vendor-BtKbdSUN.js")).toBeNull();
    expect(buendelName(null)).toBeNull();
  });

  it("lädt nur bei anderem Bündel und höchstens einmal je Ziel", () => {
    expect(sollNeuLaden("index-A.js", "index-A.js", null)).toBe(false);
    expect(sollNeuLaden("index-A.js", "index-B.js", null)).toBe(true);
    expect(sollNeuLaden("index-A.js", "index-B.js", "index-B.js")).toBe(false); // keine Schleife
    expect(sollNeuLaden("index-A.js", "index-C.js", "index-B.js")).toBe(true);
    expect(sollNeuLaden(null, "index-B.js", null)).toBe(false); // Entwicklung
    expect(sollNeuLaden("index-A.js", null, null)).toBe(false); // offline
  });
});

describe("Versionsprüfung: wann neu geladen wird", () => {
  let jetzt = 0;
  beforeEach(() => {
    vi.useFakeTimers();
    jetzt = 1_000_000;
    sessionStorage.clear();
    document.head.innerHTML = '<script type="module" src="/assets/index-ALT11111.js"></script>';
    setzeSichtbar("visible");
  });
  afterEach(() => {
    vi.useRealTimers();
    document.head.innerHTML = "";
  });

  const starte = (live: string | null, neuLaden: () => void) =>
    starteVersionsPruefung({
      holeLiveBuendel: async () => live,
      neuLaden,
      jetzt: () => jetzt,
      pruefAbstandMs: 60_000,
      ruheMs: 180_000,
    });

  const vergeht = async (ms: number) => {
    jetzt += ms;
    await vi.advanceTimersByTimeAsync(ms);
  };

  it("erkennt das eigene Bündel aus der Seite", () => {
    expect(eigenesBuendel()).toBe("index-ALT11111.js");
  });

  it("gleicher Stand: lädt nie neu", async () => {
    const neu = vi.fn();
    const stop = starte("index-ALT11111.js", neu);
    await vergeht(30 * 60_000);
    expect(neu).not.toHaveBeenCalled();
    stop();
  });

  it("Fenster im Hintergrund: lädt sofort neu", async () => {
    setzeSichtbar("hidden");
    const neu = vi.fn();
    const stop = starte("index-NEU22222.js", neu);
    await vergeht(0);
    expect(neu).toHaveBeenCalledTimes(1);
    stop();
  });

  it("wer tippt, wird nicht herausgerissen - erst nach drei ruhigen Minuten", async () => {
    const neu = vi.fn();
    const stop = starte("index-NEU22222.js", neu);
    // 10 Minuten lang alle 20 s eine Taste
    for (let i = 0; i < 30; i++) {
      await vergeht(20_000);
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "f" }));
    }
    expect(neu).not.toHaveBeenCalled();
    await vergeht(179_000);
    expect(neu).not.toHaveBeenCalled();
    await vergeht(2_000);
    expect(neu).toHaveBeenCalledTimes(1);
    stop();
  });

  it("geht das Fenster in den Hintergrund, lädt es dann neu", async () => {
    const neu = vi.fn();
    const stop = starte("index-NEU22222.js", neu);
    await vergeht(10_000);
    expect(neu).not.toHaveBeenCalled();
    setzeSichtbar("hidden");
    expect(neu).toHaveBeenCalledTimes(1);
    stop();
  });

  it("kein Hin und Her: dasselbe Ziel wird je Tab nur einmal angesteuert", async () => {
    sessionStorage.setItem("tf-neu-geladen-fuer", "index-NEU22222.js");
    setzeSichtbar("hidden");
    const neu = vi.fn();
    const stop = starte("index-NEU22222.js", neu);
    await vergeht(30 * 60_000);
    expect(neu).not.toHaveBeenCalled();
    stop();
  });

  it("ohne eigenes Bündel (Entwicklung) passiert nichts", async () => {
    document.head.innerHTML = '<script type="module" src="/src/main.tsx"></script>';
    const neu = vi.fn();
    const hole = vi.fn(async () => "index-NEU22222.js");
    const stop = starteVersionsPruefung({ holeLiveBuendel: hole, neuLaden: neu });
    await vergeht(60 * 60_000);
    expect(hole).not.toHaveBeenCalled();
    expect(neu).not.toHaveBeenCalled();
    stop();
  });
});
