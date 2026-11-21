/**
 * ★★★★★ WÄCHTER: DIE BITTE UM EINE ECHTE TASTATUR (20.09.2026).
 * ===========================================================================
 * Auftrag Johannes, wörtlich: *„kannst du erkennen ob ein mobiles gerät
 * tastenflow öffnet und eine meldung ausgeben, bitte eine tastatur
 * anschließen, sonst versuchen menschen am touchbildschirm des iPads zu
 * schreiben?"* Der Hintergrund steht schon in
 * `src/features/legal/Barrierefreiheit.tsx`: „an Tablet und Smartphone wird
 * eine Tastatur angeschlossen" - nur sagte die Oberfläche das bisher nirgends.
 *
 * ★ WAS HIER GEPRÜFT WIRD, UND WAS NICHT: Die reine Erkennung (`moeglicher-
 * weiseOhneTastatur`, `istEchteTastatureingabe`, `geraeteHinweis.ts`) OHNE
 * Browser, und die BEDIENUNG am Bauteil (`TippenTrainerPage`) - kommt auf
 * einem grob zeigenden, berührenden Gerät, bleibt auf dem Rechner aus,
 * verschwindet beim ersten echten Tastendruck und kommt dann nicht wieder,
 * sperrt nichts. Das Aussehen und der Fokus im Detail gehören - wie bei den
 * übrigen Merkfenstern - in den Prüfstand mit echtem Browser.
 *
 * ★★★ WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  · Ein gewöhnlicher Rechner (feiner Zeiger) bekommt den Hinweis - rot.
 *  · Ein Anschlag der Bildschirmtastatur (`key: "Unidentified"`, kein `code`)
 *    schliesst den Hinweis - rot (er dürfte nur auf einen ECHTEN Anschlag
 *    reagieren, siehe „Der beste Beweis" unten).
 *  · Nach einem echten Anschlag kommt der Hinweis bei einem Neuaufbau der
 *    Seite auf demselben Gerät wieder - rot (Merker in `merkfenster.ts`).
 *  · Das Tippfeld wird während des Hinweises `disabled` oder unerreichbar -
 *    rot: die Bitte darf niemanden aussperren.
 *  · Die Behebung (`moeglicherweiseOhneTastatur` immer `true`, oder die
 *    UND-Verknüpfung durch ein ODER ersetzt) lässt der Rechner-Test rot
 *    werden - das ist die GEGENPROBE für die Erkennung selbst.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TippenTrainerPage } from "@/features/public/TippenTrainerPage";
import { BedienSpracheProvider } from "@/lib/bedienSprache";
import { einrichtungFertigMerken } from "@/lib/typing/einrichtung";
import { introGesehenMerken } from "@/components/typing/IntroPodcast";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { useRundgangWunsch } from "@/lib/typing/rundgang";
import {
  istEchteTastatureingabe,
  merkeTastaturHinweisGesehen,
  moeglicherweiseOhneTastatur,
  tastaturHinweisFenster,
  tastaturHinweisGesehen,
} from "@/lib/typing";
import { ohneBildschirmTastatur } from "./_typing-probelauf";

// ---------------------------------------------------------------------------
// Helfer
// ---------------------------------------------------------------------------

/**
 * Täuscht ein Gerät vor: `grob` steht für `matchMedia("(pointer: coarse)")`,
 * `beruehrungspunkte` für `navigator.maxTouchPoints`. Gibt die Rückstell-
 * Funktion zurück (echtes `matchMedia`, echte Punktzahl).
 */
function alsGeraet(grob: boolean, beruehrungspunkte: number): () => void {
  const echtesMatchMedia = window.matchMedia;
  const echtePunkte = Object.getOwnPropertyDescriptor(navigator, "maxTouchPoints");
  window.matchMedia = ((query: string) => ({
    matches: query === "(pointer: coarse)" ? grob : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  Object.defineProperty(navigator, "maxTouchPoints", {
    value: beruehrungspunkte,
    configurable: true,
  });
  return () => {
    window.matchMedia = echtesMatchMedia;
    if (echtePunkte) Object.defineProperty(navigator, "maxTouchPoints", echtePunkte);
  };
}

function zeigeUeben() {
  return render(
    <BedienSpracheProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<TippenTrainerPage />} />
        </Routes>
      </MemoryRouter>
    </BedienSpracheProvider>,
  );
}

const tippfeld = () =>
  document.querySelector<HTMLTextAreaElement>('[data-typing-field="practice"]');

let rueckstellen: () => void = () => {};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  einrichtungFertigMerken();
  introGesehenMerken();
  ohneBildschirmTastatur();
  useTypingAuth.setState({ account: null }); // Gast - kein Konto nötig
  useRundgangWunsch.setState({ wunsch: null });
  rueckstellen = alsGeraet(false, 0); // Vorgabe: gewöhnlicher Rechner
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  rueckstellen();
  useTypingAuth.setState({ account: null });
  useRundgangWunsch.setState({ wunsch: null });
  document.body.style.overflow = "";
});

// ---------------------------------------------------------------------------
// 1 · Die reine Erkennung, ohne Browser
// ---------------------------------------------------------------------------

describe("moeglicherweiseOhneTastatur: beide Signale müssen zutreffen", () => {
  it("Rechner mit Maus (fein, keine Berührung): kein Hinweis", () => {
    rueckstellen = alsGeraet(false, 0);
    expect(moeglicherweiseOhneTastatur()).toBe(false);
  });

  it("Tablet (grob UND Berührung): der Hinweis darf erwogen werden", () => {
    rueckstellen = alsGeraet(true, 5);
    expect(moeglicherweiseOhneTastatur()).toBe(true);
  });

  it("nur EIN Signal genügt nicht - GEGENPROBE für die UND-Verknüpfung", () => {
    // Grob, aber keine Berührungspunkte gemeldet (z. B. ein grober Zeiger ohne
    // Touch) - allein reicht das nicht.
    rueckstellen = alsGeraet(true, 0);
    expect(moeglicherweiseOhneTastatur()).toBe(false);
    // Berührungspunkte, aber ein feiner Zeiger (Notebook mit Touchscreen UND
    // Maus/Trackpad als Haupt-Zeigegerät) - allein reicht auch das nicht.
    rueckstellen = alsGeraet(false, 5);
    expect(moeglicherweiseOhneTastatur()).toBe(false);
  });

  it("kein Fenster (SSR/Testgerenne ohne matchMedia): keine Behauptung", () => {
    const echtesMatchMedia = window.matchMedia;
    // @ts-expect-error - genau der fehlende Fall wird geprüft
    delete window.matchMedia;
    expect(moeglicherweiseOhneTastatur()).toBe(false);
    window.matchMedia = echtesMatchMedia;
  });
});

describe("istEchteTastatureingabe: der beste Beweis kommt vom Tippen selbst", () => {
  it("eine echte Taste trägt `code` UND ein `key`, das nicht „Unidentified“ ist", () => {
    expect(
      istEchteTastatureingabe({ code: "KeyA", key: "a" } as KeyboardEvent),
    ).toBe(true);
    expect(
      istEchteTastatureingabe({ code: "Space", key: " " } as KeyboardEvent),
    ).toBe(true);
  });

  it("die Bildschirmtastatur von iOS/Android liefert das meist NICHT", () => {
    // iOS: `key` fehlt oder heisst „Unidentified“, `code` ist leer.
    expect(
      istEchteTastatureingabe({ code: "", key: "Unidentified" } as KeyboardEvent),
    ).toBe(false);
    expect(
      istEchteTastatureingabe({ code: "", key: "a" } as KeyboardEvent),
    ).toBe(false);
    expect(
      istEchteTastatureingabe({ code: "KeyA", key: "Unidentified" } as KeyboardEvent),
    ).toBe(false);
  });
});

describe("Der Wortlaut, in beiden Bedienungssprachen", () => {
  it("bittet, behauptet aber nie, es fehle eine Tastatur", () => {
    const du = tastaturHinweisFenster("du", "de");
    expect(du.titel).toBe("Tastatur anschließen?");
    const text = du.absaetze.join(" ");
    expect(text).not.toMatch(/keine Tastatur|fehlt/i);
    expect(text).toContain("Zehnfingersystem");
    // Sie: nur an der Anrede, derselbe Inhalt.
    const sie = tastaturHinweisFenster("Sie", "de");
    expect(sie.absaetze.join(" ")).toContain("kann trotzdem weiter geübt werden");
    expect(sie.absaetze.join(" ")).not.toMatch(/\bdu\b|\bdein/i);
  });

  it("Englisch", () => {
    const en = tastaturHinweisFenster("du", "en");
    expect(en.titel).toBe("Connect a keyboard?");
    expect(en.absaetze.join(" ")).toContain("ten-finger typing");
  });

  it("sperrt nichts - der Text sagt „kannst trotzdem üben“, nie ein Verbot", () => {
    const text = tastaturHinweisFenster("du", "de").absaetze.join(" ");
    expect(text).toContain("kannst du trotzdem weiter üben");
  });
});

// ---------------------------------------------------------------------------
// 2 · Am Bauteil: die Übungsseite
// ---------------------------------------------------------------------------

describe("Auf der Übungsseite", () => {
  it("gewöhnlicher Rechner: der Hinweis kommt nie", async () => {
    rueckstellen = alsGeraet(false, 0);
    zeigeUeben();
    await waitFor(() => expect(tippfeld()).toBeTruthy());
    // Etwas Zeit für den Effekt, der ihn öffnen würde - er tut es nicht.
    await act(async () => {});
    expect(screen.queryByRole("dialog", { name: /Tastatur anschließen/ })).toBeNull();
  });

  it("Tablet ohne erkennbare Tastatur: der Hinweis kommt, EINMAL, und sperrt nichts", async () => {
    rueckstellen = alsGeraet(true, 5);
    zeigeUeben();
    const dialog = await screen.findByRole(
      "dialog",
      { name: "Tastatur anschließen?" },
      { timeout: 3000 },
    );
    expect(dialog.textContent).toContain("Zehnfingersystem");
    // ★ Sperrt nichts: das Tippfeld steht weiter da und ist nicht `disabled`.
    const feld = tippfeld();
    expect(feld).toBeTruthy();
    expect(feld).not.toBeDisabled();
    // Gemerkt, sobald gezeigt - ein zweiter Aufbau auf diesem Gerät zeigt es
    // nicht wieder (siehe der eigene Testfall unten).
    expect(tastaturHinweisGesehen()).toBe(true);
    // Wegklicken funktioniert („Verstanden“, dasselbe Muster wie die Lesezeile).
    fireEvent.click(screen.getByRole("button", { name: "Verstanden" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: /Tastatur anschließen/ })).toBeNull(),
    );
    // Der Fokus geht zurück ins Tippfeld (Hausregel: Schliessen ⇒ Eingabezeile).
    await waitFor(() => expect(document.activeElement).toBe(tippfeld()));
  });

  it("ein echter Tastendruck lässt ihn verschwinden - und er kommt auf diesem Gerät nicht wieder", async () => {
    rueckstellen = alsGeraet(true, 5);
    zeigeUeben();
    await screen.findByRole("dialog", { name: "Tastatur anschließen?" }, { timeout: 3000 });

    // Ein echter Anschlag (echtes `code`, `key` ≠ „Unidentified“) irgendwo auf
    // der Seite - nicht zwingend im Tippfeld: Die Frage „gibt es eine
    // Tastatur?" ist mit JEDEM solchen Anschlag beantwortet.
    fireEvent.keyDown(document, { key: "a", code: "KeyA" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: /Tastatur anschließen/ })).toBeNull(),
    );
    expect(tastaturHinweisGesehen()).toBe(true);

    // Neu aufgebaut (z. B. Seite neu geladen) - auf demselben Gerät kommt er
    // nicht wieder, weil der Merker jetzt gesetzt ist.
    cleanup();
    zeigeUeben();
    await waitFor(() => expect(tippfeld()).toBeTruthy());
    await act(async () => {});
    expect(screen.queryByRole("dialog", { name: /Tastatur anschließen/ })).toBeNull();
  });

  it("ein Anschlag der BILDSCHIRMTASTATUR (kein echtes `code`/`key`) schliesst ihn NICHT", async () => {
    rueckstellen = alsGeraet(true, 5);
    zeigeUeben();
    await screen.findByRole("dialog", { name: "Tastatur anschließen?" }, { timeout: 3000 });

    // Genau das Bild, das iOS/Android für einen Tipp auf die
    // Bildschirmtastatur liefern (siehe `geraeteHinweis.ts`).
    fireEvent.keyDown(document, { key: "Unidentified", code: "" });
    // Kurz abwarten, damit ein fälschlich schliessender Hinweis auch Zeit hätte.
    await act(async () => {});
    expect(screen.getByRole("dialog", { name: "Tastatur anschließen?" })).toBeTruthy();

    // Danach kommt ein ECHTER Anschlag - jetzt schliesst er.
    fireEvent.keyDown(document, { key: "b", code: "KeyB" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: /Tastatur anschließen/ })).toBeNull(),
    );
  });

  it("schon gesehen (z. B. weggeklickt) - kommt auch auf demselben Tablet nicht wieder", async () => {
    rueckstellen = alsGeraet(true, 5);
    merkeTastaturHinweisGesehen();
    zeigeUeben();
    await waitFor(() => expect(tippfeld()).toBeTruthy());
    await act(async () => {});
    expect(screen.queryByRole("dialog", { name: /Tastatur anschließen/ })).toBeNull();
  });
});
