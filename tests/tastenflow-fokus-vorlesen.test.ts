/**
 * ★★★★★ WAS UNTER DEM FOKUS STEHT, WIRD VORGELESEN.
 *
 * Johannes am 03.09.2026 abends: *„wenn ich mit Vorlesen an durchs Menü tab,
 * dann wird kein Schalter und keine Erklärung vorgelesen."*
 *
 * Am Code nachgesehen: Es gab **überhaupt keine** Fokus-Ansage. Die eigene
 * Stimme sprach nur beim KLICKEN eines Schalters und beim Tippen. Wer sich mit
 * der Tabulatortaste bewegte, hörte nichts - und „Vorlesen" ist genau für die
 * Kinder gebaut, die keinen Screenreader haben und für die es der einzige
 * Kanal ist.
 *
 * ── WAS DIESE TESTS FESTHALTEN ────────────────────────────────────────────
 *
 * Den Satz selbst (Name, Zustand, Erklärung) und vor allem die drei Stellen,
 * an denen die Ansage SCHWEIGEN muss. Ein Wächter, der nur das Sprechen prüft,
 * wäre auch grün, wenn die Stimme dauernd redet - und Dauerfeuer über dem, was
 * ein Kind gerade tut, ist schlimmer als Stille.
 */
import { describe, expect, it } from "vitest";
import { fokusName, fokusZustand, fokusErklaerung, fokusSatz } from "@/lib/typing/fokusVorlesen";

function bau(html: string): HTMLElement {
  const h = document.createElement("div");
  h.innerHTML = html;
  document.body.append(h);
  return h.querySelector<HTMLElement>("[data-pruef]")!;
}

describe("Der Name - wie ihn auch ein Screenreader bildet", () => {
  it("nimmt aria-label vor allem anderen", () => {
    const el = bau(`<button data-pruef aria-label="Hilfe schließen">✕</button>`);
    expect(fokusName(el)).toBe("Hilfe schließen");
  });

  it("nimmt sonst die eigene Beschriftung", () => {
    const el = bau(`<button data-pruef>Finger-Farben: an</button>`);
    expect(fokusName(el)).toBe("Finger-Farben: an");
  });

  it("findet das zugehörige <label> eines Auswahlfeldes", () => {
    const el = bau(
      `<label for="tf-a">nur die nächste Taste</label><input data-pruef id="tf-a" type="radio" />`,
    );
    expect(fokusName(el)).toBe("nur die nächste Taste");
  });

  it("★ überspringt, was aria-hidden ist - wie ein Screenreader", () => {
    // Am Live-Stand gehört: „⌨️ Tastatur ausblenden" - die Stimme versuchte
    // das Symbol auszusprechen. Ein Screenreader überspringt es.
    const el = bau(
      `<button data-pruef><span aria-hidden="true">⌨️</span> Tastatur ausblenden</button>`,
    );
    expect(fokusName(el)).toBe("Tastatur ausblenden");
  });

  it("findet auch ein umschliessendes <label>", () => {
    const el = bau(`<label><input data-pruef type="radio" /><span>jede Taste</span></label>`);
    expect(fokusName(el)).toBe("jede Taste");
  });
});

describe("Der Zustand - was der Schalter gerade IST", () => {
  it("liest aria-pressed", () => {
    expect(fokusZustand(bau(`<button data-pruef aria-pressed="true">X</button>`))).toBe("an");
    expect(fokusZustand(bau(`<button data-pruef aria-pressed="false">X</button>`))).toBe("aus");
  });

  it("liest ein Auswahlfeld auch ohne aria", () => {
    const an = bau(`<input data-pruef type="radio" checked />`);
    expect(fokusZustand(an)).toBe("gewählt");
    expect(fokusZustand(bau(`<input data-pruef type="radio" />`))).toBe("nicht gewählt");
  });

  it("liest aufgeklappt/zugeklappt", () => {
    expect(fokusZustand(bau(`<button data-pruef aria-expanded="true">X</button>`))).toBe("aufgeklappt");
  });

  it("sagt nichts, wo es nichts zu sagen gibt", () => {
    expect(fokusZustand(bau(`<button data-pruef>Weiter</button>`))).toBe("");
  });
});

describe("Der ganze Satz", () => {
  it("Name, Zustand und Erklärung - genau in dieser Reihenfolge", () => {
    const el = bau(
      `<button data-pruef aria-pressed="true" title="Tasten in der Farbe des Fingers, der sie drückt.">Finger-Farben</button>`,
    );
    expect(fokusSatz(el)).toBe(
      "Finger-Farben, an. Tasten in der Farbe des Fingers, der sie drückt.",
    );
  });

  it("nimmt aria-describedby vor dem Titel", () => {
    const el = bau(
      `<p id="tf-grund">Im Kontrastmodus nicht verfügbar.</p>` +
        `<button data-pruef aria-describedby="tf-grund" title="Kurztext">Farben</button>`,
    );
    expect(fokusErklaerung(el)).toBe("Im Kontrastmodus nicht verfügbar.");
  });

  it("★ doppelt nichts, wenn der Titel wortgleich mit der Beschriftung ist", () => {
    const el = bau(`<button data-pruef title="Weiter">Weiter</button>`);
    expect(fokusSatz(el)).toBe("Weiter.");
  });

  it("★★ lässt die Erklärung weg, wenn sie im Namen schon steckt", () => {
    // Am Live-Stand gemessen (03.09.2026 abends): Beim Durchtabben kam
    // „Hilfe in einfacher Sprache (Alt + H). Hilfe (Alt + H)" - das Kürzel
    // zweimal. Beschriftung und Titel überschneiden sich bei den meisten
    // Schaltern fast vollständig.
    const el = bau(
      `<button data-pruef aria-label="Hilfe in einfacher Sprache (Alt + H)" title="Hilfe (Alt + H)">?</button>`,
    );
    expect(fokusSatz(el)).toBe("Hilfe in einfacher Sprache (Alt + H).");
  });

  it("★★ behält eine ECHTE Erklärung - die Gegenprobe", () => {
    // Ohne diesen Test wäre die Regel darüber auch grün, wenn jemand die
    // Erklärung generell weggelassen hätte.
    const el = bau(
      `<button data-pruef aria-label="Finger-Farben" title="Im Kontrastmodus nicht verfügbar.">F</button>`,
    );
    expect(fokusSatz(el)).toBe("Finger-Farben. Im Kontrastmodus nicht verfügbar.");
  });

  it("★ schweigt, wo es keinen Namen gibt", () => {
    // Ein Behälter mit tabindex für die Fokus-Rettung hat keinen Namen -
    // „. " vorzulesen wäre schlimmer als nichts.
    const el = bau(`<div data-pruef tabindex="-1"></div>`);
    expect(fokusSatz(el)).toBe("");
  });
});
