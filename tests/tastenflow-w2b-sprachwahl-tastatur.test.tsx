/**
 * ★★★ W2b Punkt 2 (28.09.2026): DIE TASTATUR-RÜCKFRAGE BEIM ERSTEN START.
 *
 * Johannes: *„Achtung diese Sprache ist nur mit der passenden Tastatur ....
 * möglich. Verwendet dieses Kind eine .... Tastatur? (Ja) (Nein) : bei nein
 * springt es wieder auf die ursprüngliche sprache zurück"* - auch bei der
 * eigenen Wahl beim ersten Start; erkannt und passend ⇒ keine Frage.
 *
 *  1. Die Entscheidung (`tastaturBeimSprachwechsel`), rein.
 *  2. Die echte Übungsseite: Sprachwähler › „Français" ⇒ Frage; „Nein" lässt
 *     Deutsch stehen, Fokus zurück auf den Sprachwähler; „Ja" stellt Tastatur
 *     UND Sprache um.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speak: vi.fn() };
});

import { tastaturBeimSprachwechsel } from "../src/lib/typing/sprachwahlTastatur";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { TastenflowSprachBereich } from "../src/features/public/TastenflowSprachBereich";
import { AnnounceProvider } from "../src/lib/a11y";
import { LEHRGANG_PROBE_MERKER_FR } from "../src/lib/typing/lernweg";
import { activeLayoutId, setLayout, setzeLayoutPlattform } from "../src/lib/typing/layouts";
import { erkennungZuruecksetzen } from "../src/components/typing/useTastaturErkennung";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";

describe("1 · tastaturBeimSprachwechsel - wann gefragt wird", () => {
  const grund = { wegFest: false, eingestellt: "de" as const, erkannt: null, vorschlag: "fr" as const };
  it("★★★ Weg fr, deutsche Tastatur eingestellt, nichts erkannt ⇒ Frage mit der Vorwahl des Landes", () => {
    expect(tastaturBeimSprachwechsel({ ...grund, neuerWeg: "fr" })).toEqual({
      art: "frage",
      weg: "fr",
      layout: "fr",
    });
    expect(tastaturBeimSprachwechsel({ ...grund, neuerWeg: "es", vorschlag: "latam" })).toEqual({
      art: "frage",
      weg: "es",
      layout: "latam",
    });
  });
  it("★★★ erkannt und passend ⇒ keine Frage, die erkannte Tastatur wird eingestellt", () => {
    expect(
      tastaturBeimSprachwechsel({ ...grund, neuerWeg: "fr", erkannt: { art: "app", id: "be" } }),
    ).toEqual({ art: "ohneFrage", layout: "be" });
  });
  it("erkannt, aber NICHT passend (deutsche Tastatur) ⇒ trotzdem die Frage", () => {
    expect(
      tastaturBeimSprachwechsel({ ...grund, neuerWeg: "fr", erkannt: { art: "app", id: "de" } }).art,
    ).toBe("frage");
    expect(
      tastaturBeimSprachwechsel({ ...grund, neuerWeg: "fr", erkannt: { art: "fremd", name: "bepo" } }).art,
    ).toBe("frage");
  });
  it("die eingestellte passt schon ⇒ keine Frage, nichts umgestellt", () => {
    expect(tastaturBeimSprachwechsel({ ...grund, neuerWeg: "fr", eingestellt: "ch-fr" })).toEqual({
      art: "ohneFrage",
    });
  });
  it("Weg ohne Landestastaturen (de, en) ⇒ keine Frage", () => {
    expect(tastaturBeimSprachwechsel({ ...grund, neuerWeg: "en", eingestellt: "fr" })).toEqual({ art: "ohneFrage" });
    expect(tastaturBeimSprachwechsel({ ...grund, neuerWeg: "de", eingestellt: "es" })).toEqual({ art: "ohneFrage" });
  });
  it("★ der Weg steht schon fest ⇒ die Sprache wechselt nur die Knöpfe, keine Frage", () => {
    expect(tastaturBeimSprachwechsel({ ...grund, wegFest: true, neuerWeg: "fr" })).toEqual({ art: "ohneFrage" });
  });
  it("Vorwahl ausserhalb des Weges ⇒ die erste Tastatur des Weges", () => {
    const e = tastaturBeimSprachwechsel({ ...grund, neuerWeg: "fr", vorschlag: "us" });
    expect(e.art === "frage" && e.layout).toBe("fr");
  });
});

describe("2 · die Übungsseite: Sprachwähler › Français", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "1");
    einrichtungFertigMerken();
    erkennungZuruecksetzen();
    setzeLayoutPlattform("windows");
    setLayout("de");
  });
  afterEach(() => {
    cleanup();
    erkennungZuruecksetzen();
    setzeLayoutPlattform(null);
    setLayout("de");
    localStorage.clear();
  });

  function zeigeUebungsseite() {
    window.history.replaceState(null, "", "/programme/tastenflow");
    return render(
      <AnnounceProvider>
        <MemoryRouter initialEntries={["/programme/tastenflow"]}>
          <TastenflowSprachBereich>
            <TippenTrainerPage />
          </TastenflowSprachBereich>
        </MemoryRouter>
      </AnnounceProvider>,
    );
  }

  async function waehleFranzoesisch(user: ReturnType<typeof userEvent.setup>) {
    const knopf = await screen.findByRole("button", { name: /^Sprache - Language - Langue/ });
    await user.click(knopf);
    await user.click(within(screen.getByRole("listbox")).getByText("Français"));
    return knopf;
  }

  it("★★★ „Non\" ⇒ Deutsch bleibt, Tastatur bleibt, Fokus zurück auf den Sprachwähler", async () => {
    const user = userEvent.setup();
    zeigeUebungsseite();
    const knopf = await waehleFranzoesisch(user);
    const dialog = await screen.findByRole("dialog");
    // Der Fokus steht IM Fenster (auf dem Fragetext) - der Sprachwähler holt
    // ihn nicht nachträglich heraus (siehe die zwei Takte in der Seite).
    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(screen.getByTestId("tastatur-rueckfrage-text")).toHaveFocus();
    expect(dialog.textContent).toContain(
      "Attention : le parcours en français n'est possible qu'avec le clavier adapté.",
    );
    expect(dialog.textContent).toContain(
      "Utilises-tu un clavier français (France, Belgique, Suisse ou Canada) ?",
    );
    await user.click(within(dialog).getByRole("button", { name: "Non" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(localStorage.getItem("tastenflow-bedienung")).not.toBe("fr");
    expect(activeLayoutId()).toBe("de");
    expect(knopf).toHaveFocus();
  }, 60_000);

  it("★★★ „Oui\" ⇒ französische Tastatur UND französische Bedienung", async () => {
    const user = userEvent.setup();
    zeigeUebungsseite();
    await waehleFranzoesisch(user);
    const dialog = await screen.findByRole("dialog");
    await act(async () => {
      await user.click(within(dialog).getByRole("button", { name: "Oui" }));
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(activeLayoutId()).toBe("fr");
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("fr");
  }, 60_000);

  it("die eingestellte Tastatur passt schon (Belgien) ⇒ keine Frage, die Sprache wechselt sofort", async () => {
    setLayout("be");
    const user = userEvent.setup();
    zeigeUebungsseite();
    await waehleFranzoesisch(user);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(activeLayoutId()).toBe("be");
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("fr");
  }, 60_000);
});
