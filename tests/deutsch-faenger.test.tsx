/**
 * ★★★ Der Deutsch-Fänger selbst wird geprüft (EN0, 18.09.2026) -
 * `tests/helfer/deutschFaenger.ts`.
 *
 * Jede folgende Etappe der englischen Bedienung stützt ihren Bereich auf
 * diesen Helfer. Ein Fänger, der still weniger liest als gedacht, liesse jede
 * dieser Etappen grün aussehen. Darum hier zweierlei:
 *
 *  1. An kleinen, von Hand gebauten Bäumen: was er findet (Text, jedes
 *     geprüfte Attribut, Knopf-`value`), was er ausnimmt (`lang="de"`, der
 *     Sprachschalter, Skripte) - und dass `<html lang="de">` NICHT alles
 *     ausnimmt.
 *  2. ★★★ DIE GEGENPROBE an einem echten Bauteil: dieselbe Kopfzeile in der
 *     englischen Bedienung ohne Fund, in der deutschen mit VIELEN.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppKopfzeile } from "../src/components/AppKopfzeile";
import {
  DEUTSCHE_WOERTER,
  deutscheWoerter,
  findeDeutsch,
  pruefeText,
} from "./helfer/deutschFaenger";

afterEach(() => {
  cleanup();
  document.documentElement.setAttribute("lang", "de");
});

/** Einen Baum aus HTML bauen und in `<body>` hängen. */
function baum(html: string): HTMLElement {
  const wurzel = document.createElement("div");
  wurzel.innerHTML = html;
  document.body.appendChild(wurzel);
  return wurzel;
}

describe("1 · was er findet und was er ausnimmt", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("findet Umlaute, ß und Wörter der Liste - und kein Englisch", () => {
    expect(deutscheWoerter("Schließen")).toEqual(["Schließen"]);
    expect(deutscheWoerter("Wochenziel speichern")).toEqual(["Wochenziel", "speichern"]);
    expect(deutscheWoerter("Save the weekly goal for the whole class")).toEqual([]);
    // Wörter, die es auch im Englischen gibt, stehen mit Absicht nicht in der Liste.
    for (const w of ["die", "hell", "also", "finger", "tempo", "kind", "gut", "spiel", "code"])
      expect(DEUTSCHE_WOERTER.has(w), w).toBe(false);
  });

  it("liest Text und jedes geprüfte Attribut, auch den value eines Eingabe-Knopfs", () => {
    const w = baum(`
      <p>Settings</p>
      <button>Speichern</button>
      <button aria-label="Einstellungen öffnen">⚙</button>
      <div aria-description="Wird sofort gespeichert"></div>
      <span role="button" aria-roledescription="Schalter">x</span>
      <input placeholder="Dein Name" />
      <img alt="Tastatur mit Fingerfarben" />
      <a title="Zur Startseite" href="/">Home</a>
      <input type="submit" value="Abbrechen" />
      <div role="slider" aria-valuetext="drei Minuten"></div>
    `);
    const funde = findeDeutsch(w);
    const quellen = funde.map((f) => f.split(":")[0]);
    expect(quellen).toEqual(
      expect.arrayContaining([
        "Text <button>",
        "aria-label <button>",
        "aria-description <div>",
        "aria-roledescription <span>",
        "placeholder <input>",
        "alt <img>",
        "title <a>",
        "value <input>",
        "aria-valuetext <div>",
      ]),
    );
    expect(funde.some((f) => f.includes("Settings"))).toBe(false);
    expect(funde.some((f) => f.includes("Home"))).toBe(false);
  });

  it("nimmt aus: alles in lang=\"de\" (auch tief darunter), Skripte und den Sprachschalter", () => {
    const w = baum(`
      <div lang="de"><p>Die Übungszeile bleibt deutsch</p><span title="Zeile">x</span></div>
      <div lang="de-AT"><p>Österreichisch</p></div>
      <script>const x = "Schließen";</script>
      <button lang="de" aria-label="DE - Deutsch">DE</button>
      <span role="tooltip">Deutsch - switch to German</span>
      <p lang="en">Line 1 of 7</p>
    `);
    expect(findeDeutsch(w)).toEqual([]);
  });

  it("★ <html lang=\"de\"> nimmt NICHT alles aus - sonst fände er in der deutschen Bedienung nichts", () => {
    document.documentElement.setAttribute("lang", "de");
    const w = baum(`<button>Abmelden</button>`);
    expect(findeDeutsch(w)).toHaveLength(1);
  });

  it("jede Fundstelle nur einmal, mit Quelle, Text und Wörtern", () => {
    const w = baum(`<p>Neue Nachricht</p><p>Neue Nachricht</p>`);
    expect(findeDeutsch(w)).toEqual(['Text <p>: „Neue Nachricht" [Neue, Nachricht]']);
  });

  it("pruefeText - für Gesprochenes, das nicht im DOM steht", () => {
    expect(pruefeText("gesprochen", "Vorlesen aus.")).toBe('gesprochen: „Vorlesen aus." [Vorlesen, aus]');
    expect(pruefeText("gesprochen", "Reading aloud off.")).toBeNull();
    expect(pruefeText("gesprochen", "   ")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 2 · Die Gegenprobe an einem echten Bauteil
// ---------------------------------------------------------------------------

const JANO = { id: "u1", name: "Jano", classCode: "5A3" };

function zeigeKopfzeile(sprache: "de" | "en") {
  return render(
    <MemoryRouter>
      <AppKopfzeile
        titel="Tastenflow"
        onHilfe={() => {}}
        onKurztasten={() => {}}
        account={JANO}
        onAbmelden={() => {}}
        onStatistik={() => {}}
        onEinstellungen={() => {}}
        onVorlesen={() => {}}
        vorlesenAn={false}
        klasseHref="/meine-klasse?app=tippen"
        bedienSprache={sprache}
        sprachSchalter={{ sprache, onWechsel: () => {} }}
      />
    </MemoryRouter>,
  );
}

describe("2 · ★★★ GEGENPROBE: dieselbe Kopfzeile in beiden Sprachen", () => {
  /**
   * ★ K1 (19.09.2026): Die Mouseover-Hinweise hängen nicht mehr in der
   * Kopfzeile, sondern per Portal unter `<body>` - im Bauteil steht nur ihre
   * Marke. Die runden Knöpfe tragen ihr englisches Wort NUR im Hinweis; ohne
   * diesen Weg über die Marken fände die Gegenprobe kein „Help" mehr. Genau
   * so läse `findeDeutsch` still keinen Hinweis mehr - darum folgt es den
   * Marken jetzt ebenfalls (`tests/helfer/deutschFaenger.ts`).
   */
  const mitHinweisen = (c: HTMLElement) =>
    [
      c.textContent ?? "",
      ...[...c.querySelectorAll("[data-hinweis-anker]")].map(
        (m) => document.getElementById(m.getAttribute("data-hinweis-anker") ?? "")?.textContent ?? "",
      ),
    ].join(" ");

  it("englisch: kein Fund", () => {
    const { container } = zeigeKopfzeile("en");
    expect(mitHinweisen(container)).toMatch(/Help|Settings|Read aloud/);
    expect(findeDeutsch(container)).toEqual([]);
  });

  it("★ K1: der Fänger liest die Hinweise unter <body> mit - deutsch findet er „Hilfe“ aus dem Hinweis", () => {
    const { container } = zeigeKopfzeile("de");
    // Der Text steht NICHT im Bauteil, nur im Kasten unter <body> ...
    expect(container.textContent ?? "").not.toMatch(/Hilfe \(Alt \+ H\)/);
    // ... und der Fänger findet ihn trotzdem.
    expect(findeDeutsch(container).some((f) => /Hilfe \(Alt \+ H\)/.test(f))).toBe(true);
  });

  it("deutsch: viele Funde - der Fänger liest wirklich", () => {
    const { container } = zeigeKopfzeile("de");
    const funde = findeDeutsch(container);
    console.info(`[Deutsch-Fänger] Kopfzeile DE: ${funde.length} Funde`);
    expect(funde.length, funde.join("\n")).toBeGreaterThanOrEqual(8);
  });
});
