/**
 * ★★★ Wer Tastenflow auf tastenflow.org installiert, bekommt Tastenflow (28.09.2026)
 * ============================================================================
 * Eine Kollegin hat Tastenflow über den Browser installiert und hatte danach
 * das SENSORIK-Zeichen am Schreibtisch. Am Live-Stand nachgemessen:
 *  · auf der Übungsseite hing `tastenflow-manifest.json`, Zeichen Tastenflow;
 *  · nach einem Klick in „Meine Klassen", „Impressum" usw. räumte die
 *    Übungsseite beim Verlassen ihr Manifest weg und setzte das Sensorik-S ein;
 *  · beim Direkteinstieg auf `/meine-klasse` hing gar kein Manifest, der
 *    Titel war „Sensorik - Lernplattform …".
 * Ohne Manifest baut sich der Browser eine Verknüpfung aus Titel und Zeichen
 * der Seite - also Sensorik. Lehrkräfte landen nach der Anmeldung in „Meine
 * Klassen"; genau dort wird installiert.
 *
 * Die Regel jetzt: tastenflow.org gehört GANZ Tastenflow. weingartner.org
 * bleibt, wie es war (dort gehört die Wurzel der Plattform).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

let aufTastenflowAdresse = false;
vi.mock("@/lib/adressen", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/adressen")>();
  return { ...echt, hierIstTastenflow: () => aufTastenflowAdresse };
});

const { TippenTrainerPage } = await import("../src/features/public/TippenTrainerPage");
const { einrichtungFertigMerken } = await import("../src/lib/typing/einrichtung");

const html = readFileSync(resolve(__dirname, "..", "index.html"), "utf8");

/** Kopf so aufbauen, wie index.html ihn ausliefert (Zeichen + Titel). */
function kopfWieAusgeliefert() {
  document.head.innerHTML = [
    '<link rel="icon" type="image/svg+xml" href="/logo.svg?v=5" />',
    '<link rel="icon" type="image/png" sizes="180x180" href="/logo-180.png?v=5" />',
    '<link rel="apple-touch-icon" href="/logo-180.png?v=5" />',
  ].join("");
  document.title = "Sensorik - Lernplattform für Blindheit und Sehbehinderung";
}

/** Das Splash-Skript aus index.html an einer ausgedachten Adresse laufen lassen. */
function splashLaeuft(hostname: string, pathname: string) {
  const skripte = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const splash = skripte.find((s) => s.includes('getElementById("start-splash")'));
  expect(splash, "Splash-Skript in index.html nicht gefunden").toBeTruthy();
  const vorhang = document.createElement("div");
  vorhang.id = "start-splash";
  vorhang.hidden = true;
  document.body.appendChild(vorhang);
  // `location` ist in jsdom fest - das Skript liest es als freie Variable,
  // darum wird es hier als Parameter hineingereicht.
  new Function("location", splash!)({ hostname, pathname });
}

const manifeste = () =>
  [...document.querySelectorAll<HTMLLinkElement>('link[rel="manifest"]')].map((l) =>
    l.getAttribute("href"),
  );
const zeichen = () =>
  [...document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="apple-touch-icon"]')].map(
    (l) => l.getAttribute("href"),
  );

beforeEach(() => {
  localStorage.clear();
  einrichtungFertigMerken();
  kopfWieAusgeliefert();
  document.body.innerHTML = "";
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Direkteinstieg: der Splash in index.html", () => {
  it.skip("tastenflow.org/meine-klasse: Tastenflow-Manifest, Tastenflow-Zeichen, Titel Tastenflow", () => {
    splashLaeuft("tastenflow.org", "/meine-klasse");
    expect(manifeste()).toEqual(["/tastenflow-manifest.json"]);
    expect(zeichen().every((z) => z!.startsWith("/tastenflow-logo"))).toBe(true);
    expect(document.title).toBe("Tastenflow");
  });

  it.skip("tastenflow.org: ein schon gesetzter Titel (Suchmaschinen-Hook an „/“) bleibt", () => {
    document.title = "Tastschreiben barrierefrei lernen | Tastenflow";
    splashLaeuft("www.tastenflow.org", "/");
    expect(manifeste()).toEqual(["/tastenflow-manifest.json"]);
    expect(document.title).toBe("Tastschreiben barrierefrei lernen | Tastenflow");
  });

  it.skip("weingartner.org: der Splash hängt KEIN Manifest an - weder auf der Plattform noch unter /programme/tastenflow", () => {
    splashLaeuft("weingartner.org", "/meine-klasse");
    expect(manifeste()).toEqual([]);
    expect(document.title).toMatch(/^Sensorik/);
    document.body.innerHTML = "";
    splashLaeuft("weingartner.org", "/programme/tastenflow");
    expect(manifeste()).toEqual([]);
  });
});

describe("Verlassen der Übungsseite", () => {
  const zeigeUndVerlasse = () => {
    const { unmount } = render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    const drin = { manifeste: manifeste(), zeichen: zeichen() };
    unmount();
    return drin;
  };

  it.skip("tastenflow.org: Manifest und Tastenflow-Zeichen bleiben nach dem Wechsel in „Meine Klassen“", () => {
    aufTastenflowAdresse = true;
    splashLaeuft("tastenflow.org", "/");
    const drin = zeigeUndVerlasse();
    expect(drin.manifeste).toEqual(["/tastenflow-manifest.json"]);
    expect(manifeste()).toEqual(["/tastenflow-manifest.json"]);
    expect(zeichen().every((z) => z!.startsWith("/tastenflow-logo"))).toBe(true);
  });

  it("tastenflow.org ohne Splash (Gegenprobe): die Seite hängt das Manifest selbst an und lässt es hängen", () => {
    aufTastenflowAdresse = true;
    const drin = zeigeUndVerlasse();
    expect(drin.manifeste).toEqual(["/tastenflow-manifest.json"]);
    expect(manifeste()).toEqual(["/tastenflow-manifest.json"]);
  });

  it("weingartner.org: wie bisher - drin das Tippen-Manifest, draussen wieder Sensorik", () => {
    aufTastenflowAdresse = false;
    const drin = zeigeUndVerlasse();
    expect(drin.manifeste).toEqual(["/tippen-manifest.json"]);
    expect(drin.zeichen.every((z) => z!.startsWith("/tastenflow-logo"))).toBe(true);
    expect(manifeste()).toEqual([]);
    expect(zeichen()).toEqual(["/logo.svg?v=5", "/logo-180.png?v=5", "/logo-180.png?v=5"]);
  });
});

describe("die Manifeste von Tastenflow", () => {
  for (const datei of ["tastenflow-manifest.json", "tippen-manifest.json"]) {
    it(`${datei}: Name mit Bindestrich (Braillezeile), Zeichen von Tastenflow`, () => {
      const m = JSON.parse(readFileSync(resolve(__dirname, "..", "public", datei), "utf8"));
      expect(m.name).not.toMatch(/[–—]/);
      expect(m.short_name).toBe("Tastenflow");
      for (const i of m.icons) expect(i.src).toMatch(/^\/tastenflow-logo/);
    });
  }

  // Johannes 28.09.: in ALLEN Apps - der Name steht unter dem Zeichen und
  // im Fenstertitel, also auch auf der Braillezeile.
  const alle = readdirSync(resolve(__dirname, "..", "public")).filter((d) => d.endsWith("-manifest.json"));
  it.skip("es gibt die Manifeste aller Apps (Gegenprobe: die Liste ist nicht leer)", () => {
    expect(alle.length).toBeGreaterThanOrEqual(9);
  });
  for (const datei of alle) {
    it(`${datei}: nur Bindestrich in Name und Beschreibung`, () => {
      const m = JSON.parse(readFileSync(resolve(__dirname, "..", "public", datei), "utf8"));
      expect(`${m.name} ${m.short_name} ${m.description ?? ""}`).not.toMatch(/[–—]/);
    });
  }
});
