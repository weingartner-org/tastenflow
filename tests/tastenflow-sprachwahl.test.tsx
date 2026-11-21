/**
 * ★★★ E2b (25.09.2026, Bauplan D9/§9.3): DER SPRACHWÄHLER in der gemeinsamen
 * `AppKopfzeile`.
 *
 * Bauplan: `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §9.3. Befund:
 * `BEFUND-2026-09-25-E2A-GERUEST.md` §5.
 *
 * SCHNAPPSCHUSS (Auftrag E2b, Gate 1): der DOM-Ausschnitt des Sprachschalters
 * VOR dieser Änderung, aufgenommen aus `HEAD` (`d1cc0dcd`, vor E2b) mit
 * genau demselben Render wie unten - siehe `tests/__snapshots__/
 * tastenflow-sprachwahl.test.tsx.snap`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppKopfzeile } from "../src/components/AppKopfzeile";
import type { BedienSprache } from "../src/lib/bedienSprache";

afterEach(() => {
  cleanup();
});

const JANO = { id: "u1", name: "Jano", classCode: "5A3" };

function zeigeKopfzeile(props: {
  sprache: BedienSprache;
  onWechsel?: (neu: BedienSprache) => void;
  sprachen?: readonly BedienSprache[];
}) {
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
        bedienSprache={props.sprache}
        sprachSchalter={{ sprache: props.sprache, onWechsel: props.onWechsel ?? (() => {}) }}
        sprachen={props.sprachen}
      />
    </MemoryRouter>,
  );
}

/**
 * `useId()` zählt über die GANZE Kopfzeile hoch - ein neuer Haken irgendwo
 * davor (hier: `useAufklapper()` für den Sprachwähler, IMMER aufgerufen,
 * Regel der Haken) verschiebt die Nummer nachfolgender Ids, OHNE dass sich
 * am sichtbaren/hörbaren Verhalten etwas ändert. Der Schnappschuss normiert
 * darum `tipp-r<Zahl>` auf eine feste Marke - alles andere (Reihenfolge der
 * Attribute, Klassen, Text, `lang`) bleibt roh und damit wirklich Byte für
 * Byte vergleichbar.
 */
function ohneUseIdZahl(html: string): string {
  // `useId()` liefert keine reine Zahl, sondern eine Basis-32-Kennung
  // (`r9`, `ra`, `r1a` …) - darum `[0-9a-z]+`, nicht `\d+`.
  return html.replace(/tipp-r[0-9a-z]+/g, "tipp-rX");
}

describe("★ Gate 1: ohne die Eigenschaft `sprachen` bleibt die Kopfzeile, wie sie war", () => {
  it("der Sprachschalter-Ausschnitt ist BYTE FÜR BYTE identisch zum Schnappschuss vor E2b", () => {
    const { container } = zeigeKopfzeile({ sprache: "de" });
    const knopf = container.querySelector("[data-sprachschalter]");
    expect(ohneUseIdZahl(knopf?.outerHTML ?? "")).toMatchSnapshot();
  });

  it("kein `role=\"listbox\"`, keine Weltkugel - der alte Zwei-Wege-Umschalter", () => {
    zeigeKopfzeile({ sprache: "de" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("mit genau zwei Sprachen (die Vorgabe des Providers ohne den Schalter) - derselbe alte Umschalter", () => {
    zeigeKopfzeile({ sprache: "de", sprachen: ["de", "en"] });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });
});

describe("★ Gate 2: mit `sprachen` (drei Werte) - der neue Sprachwähler", () => {
  it("zeigt drei Sprachen mit `aria-label=\"Sprache - Language - Langue\"`", async () => {
    const user = userEvent.setup();
    zeigeKopfzeile({ sprache: "de", sprachen: ["de", "en", "fr"] });
    const knopf = screen.getByRole("button", { name: "Sprache - Language - Langue" });
    expect(knopf).toBeInTheDocument();
    await user.click(knopf);
    const liste = screen.getByRole("listbox", { name: "Sprache - Language - Langue" });
    const eintraege = within(liste).getAllByRole("option");
    expect(eintraege).toHaveLength(3);
    expect(within(liste).getByText("Deutsch")).toBeInTheDocument();
    expect(within(liste).getByText("English")).toBeInTheDocument();
    expect(within(liste).getByText("Français")).toBeInTheDocument();
  });

  it("jede Sprache trägt ihr eigenes `lang`-Attribut", async () => {
    const user = userEvent.setup();
    zeigeKopfzeile({ sprache: "de", sprachen: ["de", "en", "fr"] });
    await user.click(screen.getByRole("button", { name: "Sprache - Language - Langue" }));
    expect(screen.getByText("Deutsch").closest("[lang]")).toHaveAttribute("lang", "de");
    expect(screen.getByText("English").closest("[lang]")).toHaveAttribute("lang", "en");
    expect(screen.getByText("Français").closest("[lang]")).toHaveAttribute("lang", "fr");
  });

  it("Enter/Leertaste öffnet, Pfeile wählen, Escape schliesst und gibt den Fokus an den Knopf zurück", async () => {
    const user = userEvent.setup();
    zeigeKopfzeile({ sprache: "de", sprachen: ["de", "en", "fr"] });
    const knopf = screen.getByRole("button", { name: "Sprache - Language - Langue" });
    knopf.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    // Frisch geöffnet: Fokus auf dem ersten Eintrag (Tastatur-Bedienung).
    const eintraege = screen.getAllByRole("option");
    expect(eintraege[0]).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(eintraege[1]).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(eintraege[2]).toHaveFocus();
    // Rundlauf: von der letzten zurück zur ersten.
    await user.keyboard("{ArrowDown}");
    expect(eintraege[0]).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(eintraege[2]).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(knopf).toHaveFocus();
  });

  it("öffnet auf der GEWÄHLTEN Sprache, nicht auf der ersten (Listbox-Muster, Chat-Abnahme 25.09.)", async () => {
    const user = userEvent.setup();
    zeigeKopfzeile({ sprache: "en", sprachen: ["de", "en", "fr"] });
    screen.getByRole("button", { name: "Sprache - Language - Langue" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("option", { name: /English/ })).toHaveFocus();
  });

  it("Leertaste öffnet ebenfalls (Enter/Leertaste öffnet, Auftrag Punkt 1)", async () => {
    const user = userEvent.setup();
    zeigeKopfzeile({ sprache: "de", sprachen: ["de", "en", "fr"] });
    screen.getByRole("button", { name: "Sprache - Language - Langue" }).focus();
    await user.keyboard(" ");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("Wahl von FR speichert und schaltet - Fokus zurück auf den Knopf", async () => {
    const user = userEvent.setup();
    const onWechsel = vi.fn();
    zeigeKopfzeile({ sprache: "de", sprachen: ["de", "en", "fr"], onWechsel });
    const knopf = screen.getByRole("button", { name: "Sprache - Language - Langue" });
    await user.click(knopf);
    await user.click(screen.getByText("Français"));
    expect(onWechsel).toHaveBeenCalledWith("fr");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(knopf).toHaveFocus();
  });

  it("die aktive Sprache trägt `aria-selected=\"true\"` und ihr Kürzel steht am Knopf", async () => {
    const user = userEvent.setup();
    zeigeKopfzeile({ sprache: "fr", sprachen: ["de", "en", "fr"] });
    expect(screen.getByText("FR")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sprache - Language - Langue" }));
    expect(screen.getByText("Français").closest('[role="option"]')).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Deutsch").closest('[role="option"]')).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("der Tipp ist ebenfalls dreisprachig (derselbe Text wie das aria-label)", async () => {
    zeigeKopfzeile({ sprache: "de", sprachen: ["de", "en", "fr"] });
    const knopf = screen.getByRole("button", { name: "Sprache - Language - Langue" });
    const beschreibungId = knopf.getAttribute("aria-describedby");
    expect(beschreibungId).toBeTruthy();
    await act(async () => {
      knopf.focus();
    });
    const beschreibung = document.getElementById(beschreibungId!);
    expect(beschreibung?.textContent).toBe("Sprache - Language - Langue");
  });
});

describe("★ Gate 3: ohne den französischen Schalter ist FR nicht erreichbar", () => {
  it("mit nur zwei Sprachen bietet die Liste (gäbe es sie) nie FR an - hier: gar keine Liste", () => {
    zeigeKopfzeile({ sprache: "de", sprachen: ["de", "en"] });
    expect(screen.queryByText("Français")).toBeNull();
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
