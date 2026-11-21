/**
 * WÄCHTER über den LAUF des Klassenmatchs - das, was ein Kind mit Blindheit
 * davon hat (11.09.2026, Etappe E6).
 *
 * ── Warum genau diese fünf Prüfungen ────────────────────────────────────────
 * Das Klassenmatch bringt zum ersten Mal eine Anzeige mit, die sich **jede
 * Sekunde ändert, während jemand schreibt**: Plätze, Kugeln, Uhr. Genau daran
 * ist die Braillezeile in diesem Projekt schon zweimal zerbrochen
 * ([[reference_live_region_ist_braille_blitzmeldung]]: jede Live-Meldung
 * verdrängt die Zeile vier Sekunden lang, und auf diese Zeile wird gerade
 * abgeschrieben).
 *
 *  1. Das Ranking ist `aria-hidden` - der ganze Bereich, nicht nur einzelne
 *     Zeilen.
 *  2. Beim TIPPEN geht nichts in den Live-Bereich dieses Bauteils.
 *  3. Der Vorspann `P2 3:45 ` steht wirklich im Feldwert - acht Zellen, links
 *     vom Text, ohne einen Tastendruck lesbar.
 *  4. Alt + X antwortet - über den Live-Bereich, auf ausdrückliche Nachfrage.
 *  5. Am Ende steht der Pokal als WORT da, und der Fokus steht auf der
 *     Überschrift.
 *
 * WOHIN ER SICH BEWEGT, WENN ES SCHLECHTER WIRD: Prüfung 2 zählt die
 * Live-Bereiche des Bauteils und verlangt, dass sie beim Tippen LEER bleiben -
 * wer eine Ansage „Platz 2!" einbaut, wird rot, auch wenn sie noch so gut
 * gemeint ist.
 *
 * ⚠️ TÖNE UND STIMME AUS - jsdom hat weder Web-Audio noch Sprachausgabe.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

// `speakUi` wird ersetzt, damit „Du hast das Klassenmatch verlassen." beobachtbar
// ist (der Rest des Moduls bleibt echt - `useVoice` brauchen die Bauteile).
vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn() };
});

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(),
  playUnlockFanfare: vi.fn(),
  playKeySound: vi.fn(),
  playKeyTick: vi.fn(),
  playErrorSound: vi.fn(),
  playLineSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { KlassenmatchLauf } from "@/components/typing/KlassenmatchLauf";
import { KlassenmatchLobby } from "@/components/typing/KlassenmatchLobby";
import { MATCH_DAUER_MS, type Match, type MatchStand } from "@/lib/typing/klassenmatch";
import { speakUi } from "@/lib/typing/voice";
import { emptyProgress } from "@/lib/typing/progress";
import type { TypingAccount } from "@/lib/typing/account";

const KIND: TypingAccount = {
  id: "franz",
  role: "schueler",
  name: "Franz",
  classCode: "K1",
  createdAt: 1,
};

function match(over: Partial<Match> = {}): Match {
  const start = Date.now() - 75_000;
  return {
    id: "m1",
    classCode: "K1",
    hostUid: "sarah",
    hostName: "Sarah",
    status: "laeuft",
    startMs: start,
    endeMs: start + MATCH_DAUER_MS,
    dauerMin: 5,
    createdMs: start - 20_000,
    ...over,
  };
}

function stand(over: Partial<MatchStand> = {}): MatchStand {
  return {
    id: "s",
    matchId: "m1",
    classCode: "K1",
    pupilUid: "sarah",
    name: "Sarah",
    status: "schreibt",
    zeichen: 300,
    fehler: 2,
    apm: 150,
    wert: 0,
    updatedMs: Date.now(),
    ...over,
  };
}

function baue(over: Partial<React.ComponentProps<typeof KlassenmatchLauf>> = {}) {
  return render(
    <KlassenmatchLauf
      match={match()}
      staende={[
        stand(),
        stand({ id: "s2", pupilUid: "mia", name: "Mia", zeichen: 200, apm: 100 }),
        stand({ id: "s3", pupilUid: "ben", name: "Ben", zeichen: 100, apm: 50 }),
      ]}
      account={KIND}
      stufe="kids"
      lang="de"
      loadFn={async () => emptyProgress()}
      saveFn={vi.fn()}
      onTask={vi.fn()}
      onStand={vi.fn()}
      onFertig={vi.fn()}
      onWeiter={vi.fn()}
      onVerlassen={vi.fn()}
      {...over}
    />,
  );
}

afterEach(cleanup);

describe("(a) Das Ranking unter dem Feld (F11)", () => {
  it("★★★ steht vollständig hinter `aria-hidden`", async () => {
    const { container } = baue();
    await screen.findByRole("textbox");
    // Alle Namen der Mitspieler stehen im Baum …
    const zeilen = container.querySelectorAll("[aria-hidden] *");
    expect(zeilen.length).toBeGreaterThan(0);
    // … aber KEINER davon ist für eine Sprachausgabe erreichbar: Jedes
    // Vorkommen von „Mia" liegt unter einem `aria-hidden`.
    const treffer = Array.from(container.querySelectorAll("*")).filter(
      (el) => el.children.length === 0 && el.textContent?.trim() === "Mia",
    );
    expect(treffer.length).toBeGreaterThan(0);
    for (const el of treffer) {
      expect(el.closest("[aria-hidden]"), "„Mia“ steht ohne aria-hidden").not.toBeNull();
    }
  });

  it("zeigt die Plätze in der Reihenfolge der Leistung - Platz 1 oben", async () => {
    const { container } = baue();
    await screen.findByRole("textbox");
    // Die Reihenfolge macht `order` (siehe KlassenmatchRanking.tsx): Die Knoten
    // bleiben stehen, damit beim Platzwechsel kein Fokus mitwandert.
    const mitOrder = Array.from(container.querySelectorAll<HTMLElement>("[style*='order']"));
    expect(mitOrder.length).toBeGreaterThanOrEqual(4);
  });

  it("ersetzt die Bildschirm-Tastatur, statt sie zu verdoppeln", async () => {
    baue();
    await screen.findByRole("textbox");
    // Der Schalter „Tastatur anzeigen" wäre ein Schalter für etwas, das gar
    // nicht da ist (R-A3).
    expect(screen.queryByRole("button", { name: /Tastatur/i })).toBeNull();
  });
});

describe("(b) ⚠️ Beim Tippen meldet NICHTS", () => {
  it("★★★ lässt den eigenen Live-Bereich leer, während geschrieben wird", async () => {
    const { container } = baue();
    const feld = await screen.findByRole("textbox");
    const eigener = container.querySelector("[data-match-live]");
    expect(eigener, "der Live-Bereich des Matches fehlt").not.toBeNull();

    // Ein paar Anschläge - genau die Lage, in der die Zeile gelesen wird.
    for (const taste of ["f", "j", "f", "d", "k"]) {
      fireEvent.keyDown(feld, { key: taste });
    }
    await new Promise((r) => setTimeout(r, 60));

    // ⚠️ Geprüft wird NUR der Bereich dieses Bauteils. Was `TypingSession` bei
    // „Buchstabieren an" meldet, ist die eine erlaubte Ausnahme
    // (TypingSession.tsx:965-1032) und gehört nicht hierher.
    expect(
      (eigener!.textContent ?? "").trim(),
      `Der Match-Live-Bereich meldet beim Tippen: „${eigener!.textContent}"`,
    ).toBe("");
  });

  it("★★★ gibt dem Ranking und der Uhr GAR KEINEN Live-Bereich", async () => {
    const { container } = baue();
    await screen.findByRole("textbox");
    // Jeder `aria-live`-Bereich unter einem `aria-hidden` wäre ein Widerspruch
    // in sich - und jeder im Ranking eine Blitzmeldung je Platzwechsel.
    for (const b of Array.from(container.querySelectorAll("[aria-hidden] [aria-live]"))) {
      expect.fail(`Live-Bereich im aria-hidden-Teil: „${b.textContent}"`);
    }
  });
});

describe("(c) Der Vorspann im Feld (F14)", () => {
  it("★★★ steht als acht Zellen VOR dem Text - „P…“ und die Zeit", async () => {
    const feld = (await screen.findByRole("textbox", undefined, {
      container: baue().container,
    })) as HTMLTextAreaElement;
    const wert = feld.value;
    expect(wert.startsWith("P")).toBe(true);
    // Acht Zellen: „P3 3:44 " - Platz, Leerzeichen, m:ss, Leerzeichen.
    expect(wert.slice(0, 8)).toMatch(/^P\d+ \d+:\d\d ?$/);
    expect(wert.slice(0, 8).length).toBe(8);
    // Und danach kommt wirklich der Text, nicht noch eine Auskunft.
    expect(wert.length).toBeGreaterThan(8);
  });
});

describe("(d) Alt + X - die einzige Meldung (F14)", () => {
  it("★ antwortet mit Platz, Zeit und den ersten drei", async () => {
    const { container } = baue();
    await screen.findByRole("textbox");
    fireEvent.keyDown(window, { altKey: true, code: "KeyX", key: "x" });
    await waitFor(() => {
      const texte = Array.from(container.querySelectorAll("[aria-live]"))
        .map((b) => b.textContent ?? "")
        .join(" ");
      expect(texte).toMatch(/Platz \d+ von \d+/);
      expect(texte).toMatch(/1\. /);
    });
  });

  it("antwortet NICHT, wenn das Match vorbei ist - dann steht die Liste ohnehin da", async () => {
    const vorbei = match({ startMs: Date.now() - MATCH_DAUER_MS - 5000 });
    vorbei.endeMs = vorbei.startMs + MATCH_DAUER_MS;
    const { container } = baue({ match: vorbei });
    await screen.findByRole("heading", { name: /Klassenmatch ist vorbei/i });
    fireEvent.keyDown(window, { altKey: true, code: "KeyX", key: "x" });
    await new Promise((r) => setTimeout(r, 60));
    const texte = Array.from(container.querySelectorAll("[aria-live]"))
      .map((b) => b.textContent ?? "")
      .join(" ")
      .trim();
    expect(texte).toBe("");
  });
});

describe("(e) Das Ende: die Platzierungsliste (F13)", () => {
  const vorbei = () => {
    const m = match({ startMs: Date.now() - MATCH_DAUER_MS - 5000 });
    m.endeMs = m.startMs + MATCH_DAUER_MS;
    return m;
  };

  it("★★★ nennt den Pokal als WORT, nicht nur als Zeichen", async () => {
    // ★ Seit 18.11.2026 steht nur die obere Hälfte da - mit sechs Kindern
    // sind es drei, also alle drei Ehrenplätze.
    baue({
      match: vorbei(),
      staende: [
        stand(),
        stand({ id: "s2", pupilUid: "mia", name: "Mia", zeichen: 200, apm: 100 }),
        stand({ id: "s3", pupilUid: "ben", name: "Ben", zeichen: 100, apm: 50 }),
        stand({ id: "s4", pupilUid: "lea", name: "Lea", zeichen: 90, apm: 45 }),
        stand({ id: "s5", pupilUid: "tom", name: "Tom", zeichen: 80, apm: 40 }),
      ],
    });
    await screen.findByRole("heading", { name: /Klassenmatch ist vorbei/i });
    // Ein Pokal, den nur sieht, wer Formen sieht, ist kein Platz 1.
    expect(screen.getByText("Pokal")).toBeTruthy();
    expect(screen.getByText("Silber")).toBeTruthy();
    expect(screen.getByText("Bronze")).toBeTruthy();
  });

  it("★ setzt den Fokus auf die Überschrift", async () => {
    baue({ match: vorbei() });
    const titel = await screen.findByRole("heading", { name: /Klassenmatch ist vorbei/i });
    await waitFor(() => expect(document.activeElement).toBe(titel));
  });

  it("★ schreibt NICHTS gegen ein Kind - kein „letzter Platz“", async () => {
    const { container } = baue({ match: vorbei() });
    await screen.findByRole("heading", { name: /Klassenmatch ist vorbei/i });
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/letzt/i);
    expect(text).not.toMatch(/verloren/i);
    expect(text).not.toMatch(/schlecht/i);
    // ★ Seit 18.11.2026 (Johannes): ab 4 Kindern steht nur die obere Hälfte
    // da - der vierte Platz steht gar nicht mehr in der Liste.
    expect(text).not.toMatch(/4\./);
  });

  it("★ meldet sich fertig - und gibt die Zahlen weiter, nicht einen Rang", async () => {
    const onFertig = vi.fn();
    baue({ match: vorbei(), onFertig });
    await waitFor(() => expect(onFertig).toHaveBeenCalledTimes(1));
    const werte = onFertig.mock.calls[0][0];
    expect(typeof werte.zeichen).toBe("number");
    expect(typeof werte.apm).toBe("number");
    // ★ F10: Kein Rang, kein Platz, nichts, was eine Statistik werden könnte.
    expect(Object.keys(werte).sort()).toEqual(["apm", "fehler", "wartezeitMs", "wert", "zeichen"]);
  });

  /**
   * ★★★★★ DIE ANGEFANGENE ZEILE GEHÖRT AUCH IN DIE EIGENE ANZEIGE (Befund
   * 16.09.2026, Klasse MSLASZ): Johannes: *„alle haben beim ergebnis Paula
   * als erste gereiht gehabt nur Paula nicht, bei ihr stand [ein anderes
   * Kind] am ersten platz"*.
   *
   * `beenden` (oben) rechnet die beim Zeitablauf ANGEFANGENE, nicht mehr
   * fertig getippte Zeile in die Meldung an den Server ein (`onFertig`) - für
   * jedes ANDERE Gerät zählt sie also. Die eigene Zeile in der Rangliste
   * (`eigen` im Bauteil-Kopf) las aber weiter direkt aus `summe.current`, und
   * genau dorthin schrieb die angefangene Zeile nie etwas. Ein Match endet so
   * gut wie nie exakt auf einer Zeilengrenze - der Normalfall trifft also
   * jedes Match.
   */
  it("★★★★★ die beim Zeitablauf angefangene Zeile zählt auch im eigenen Ergebnis", async () => {
    const onFertig = vi.fn();
    const start = Date.now();
    const { container } = baue({
      match: match({ startMs: start, endeMs: start + 2200 }),
      // Eine einzige Mitspielerin mit einem winzigen, aber echten Wert - ein
      // paar echte Anschläge der angefangenen Zeile müssen genügen, um sie
      // zu überholen.
      staende: [stand({ id: "s2", pupilUid: "mia", name: "Mia", zeichen: 1, fehler: 0, apm: 1 })],
      onFertig,
    });
    const feld = await screen.findByRole("textbox");
    // Die ersten zwei ECHTEN Zeichen der laufenden Zeile - hinter dem
    // achtstelligen Braille-Vorspann (`P… …:..`), aus dem Feld gelesen, nie
    // erraten (der Vorrat besteht am Anfang nur aus „f“ und „j“, siehe
    // `INITIAL_LETTERS`, aber welches zuerst kommt, entscheidet der
    // Generator).
    const praxis = (feld as HTMLTextAreaElement).value.slice(8);
    const echteZeichen = Array.from(praxis)
      .filter((z) => z !== " ")
      .slice(0, 2);
    expect(echteZeichen.length).toBe(2);
    for (const taste of echteZeichen) fireEvent.keyDown(feld, { key: taste });

    // Die Zeit läuft ab, MITTEN in der Zeile - kein Sonderfall, der Alltag.
    await screen.findByRole("heading", { name: /Klassenmatch ist vorbei/i }, { timeout: 5000 });

    // Der Server bekam die angefangene Zeile - das allein ist noch nicht der
    // Fund (das war schon vor der Behebung so).
    await waitFor(() => expect(onFertig).toHaveBeenCalledTimes(1));
    expect(onFertig.mock.calls[0][0].zeichen).toBeGreaterThanOrEqual(2);

    // Der Fund: Genau diese zwei Zeichen fehlten der EIGENEN Anzeige - „Franz“
    // stand darum hinter Mias fast leerem Ergebnis statt davor.
    const zeilen = Array.from(container.querySelectorAll("li"));
    const eigene = zeilen.find((z) => /Franz/.test(z.textContent ?? ""));
    expect(eigene?.textContent ?? "").toMatch(/^1\./);
  });

  /**
   * ★★★ FÜNF MINUTEN DANEBENSITZEN SIND KEINE RUNDE (Befund des Prüfers,
   * 11.09.2026, im Browser an einem frischen Konto gemessen).
   *
   * Bis dahin lief die Rundenend-Regel bei JEDEM Zeitablauf - auch ohne einen
   * einzigen Anschlag. Gemessen: `letters` leer, `rounds` 0, keine Ereignisse -
   * und trotzdem war danach die Einheit „d" freigeschaltet. F7 sagt „wie eine
   * normale Runde", und eine normale Runde endet erst, wenn sie getippt wurde.
   *
   * WOHIN ER SICH BEWEGT, WENN ES SCHLECHTER WIRD: Wer die Bedingung wieder
   * herausnimmt, schaltet einem Kind eine Taste frei, die es nie berührt hat -
   * und der Wächter wird rot.
   */
  it("★★★ speichert NICHTS, wenn kein einziger Anschlag kam (F7)", async () => {
    const saveFn = vi.fn();
    const onFertig = vi.fn();
    baue({ match: vorbei(), saveFn, onFertig });
    // Das Spiel endet wie immer …
    await waitFor(() => expect(onFertig).toHaveBeenCalledTimes(1));
    await screen.findByRole("heading", { name: /Klassenmatch ist vorbei/i });
    // … der Lernstand bleibt unangetastet.
    expect(saveFn).not.toHaveBeenCalled();
  });

  it("führt mit „Weiter üben“ zurück", async () => {
    const onWeiter = vi.fn();
    baue({ match: vorbei(), onWeiter });
    const knopf = await screen.findByRole("button", { name: /Weiter üben/i });
    fireEvent.click(knopf);
    expect(onWeiter).toHaveBeenCalled();
  });

  it("führt auch mit Escape zurück (Hausregel)", async () => {
    const onWeiter = vi.fn();
    baue({ match: vorbei(), onWeiter });
    await screen.findByRole("heading", { name: /Klassenmatch ist vorbei/i });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onWeiter).toHaveBeenCalled();
  });
});

describe("(f) Der Countdown (F5)", () => {
  it("zeigt die Sekunden und nennt, wer dabei ist - ohne Tippfeld", async () => {
    const start = Date.now() + 6_000;
    baue({ match: match({ status: "countdown", startMs: start, endeMs: start + MATCH_DAUER_MS }) });
    expect(await screen.findByText(/Es geht los in \d+ Sekunden?\./)).toBeTruthy();
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});

/*
 * ★★★★★ „WIE KANN ICH DAS MATCH WÄHREND EINEM DURCHGANG ABBRECHEN?"
 * (Johannes, 11.09.2026 abends: „esc mit fragefenster, willst du wirklich
 * abbrechen?")
 *
 * Geprüft wird, was ein Kind mit Blindheit davon hat: Escape öffnet ein
 * Fenster, dessen erster Knopf „Weiterschreiben" ist (ein versehentliches
 * Escape + Enter wirft niemanden hinaus), Escape im Fenster führt zurück in die
 * Zeile, und solange das Fenster offen ist, landet kein Anschlag im Feld.
 *
 * WOHIN ER SICH BEWEGT, WENN ES SCHLECHTER WIRD: Wer den Fokus auf „Verlassen"
 * setzt, wer das Fenster weglässt oder wer beim Verlassen die Freischalt-Regel
 * laufen lässt, wird hier rot.
 */
describe("(g) Verlassen während des Matchs", () => {
  const fenster = () => screen.findByRole("dialog", { name: "Klassenmatch verlassen?" });

  it("★★★★★ Escape öffnet das Fragefenster - der Fokus steht auf „Weiterschreiben“", async () => {
    baue();
    const feld = await screen.findByRole("textbox");
    fireEvent.keyDown(feld, { key: "Escape" });
    const dialog = await fenster();
    expect(dialog.textContent).toMatch(/Die anderen schreiben weiter/);
    await waitFor(() =>
      expect(document.activeElement).toBe(within(dialog).getByRole("button", { name: "Weiterschreiben" })),
    );
  });

  it("★★★★ Escape im Fenster heisst „Weiterschreiben“ - zurück in die Zeile, nichts beendet", async () => {
    const onVerlassen = vi.fn();
    const onFertig = vi.fn();
    baue({ onVerlassen, onFertig });
    const feld = await screen.findByRole("textbox");
    fireEvent.keyDown(feld, { key: "Escape" });
    await fenster();
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("textbox")));
    expect(onVerlassen).not.toHaveBeenCalled();
    expect(onFertig).not.toHaveBeenCalled();
  });

  it("★★★★ der seitenweite Escape-Weg zieht den Fokus NICHT aus dem Fenster", async () => {
    // Nachgebaut wie `zurueckInsProgramm` in TippenTrainerPage: Escape am
    // Dokument holt die Eingabezeile.
    const { focusPracticeField } = await import("@/lib/typing/focusField");
    const seite = (e: KeyboardEvent) => {
      if (e.key === "Escape") focusPracticeField();
    };
    document.addEventListener("keydown", seite);
    try {
      baue();
      const feld = await screen.findByRole("textbox");
      fireEvent.keyDown(feld, { key: "Escape" });
      const dialog = await fenster();
      await new Promise((r) => setTimeout(r, 60));
      expect(document.activeElement).toBe(within(dialog).getByRole("button", { name: "Weiterschreiben" }));
    } finally {
      document.removeEventListener("keydown", seite);
    }
  });

  it("★★★★ solange das Fenster offen ist: kein Anschlag im Feld, und Alt + X schweigt", async () => {
    const { container } = baue();
    const feld = await screen.findByRole("textbox");
    fireEvent.keyDown(feld, { key: "Escape" });
    const dialog = await fenster();
    const knopf = within(dialog).getByRole("button", { name: "Weiterschreiben" });
    await waitFor(() => expect(document.activeElement).toBe(knopf));
    fireEvent.keyDown(knopf, { key: "f" });
    fireEvent.keyDown(window, { altKey: true, code: "KeyX", key: "x" });
    await new Promise((r) => setTimeout(r, 60));
    expect(document.activeElement).toBe(knopf);
    expect((container.querySelector("[data-match-live]")?.textContent ?? "").trim()).toBe("");
  });

  it("★★★★ der Knopf „Verlassen“ im Kopf öffnet dasselbe Fenster (Tablet ohne Escape)", async () => {
    baue();
    await screen.findByRole("textbox");
    fireEvent.click(screen.getByRole("button", { name: "Verlassen" }));
    expect(await fenster()).toBeTruthy();
  });

  it("★★★★★ „Verlassen“ meldet die BISHERIGEN Zahlen, speichert die Anschläge und schaltet nichts frei", async () => {
    const onVerlassen = vi.fn();
    const onFertig = vi.fn();
    const saveFn = vi.fn();
    const geladen = emptyProgress();
    baue({ onVerlassen, onFertig, saveFn, loadFn: async () => geladen });
    const feld = await screen.findByRole("textbox");
    for (const taste of ["f", "j", "f", "d", "k"]) fireEvent.keyDown(feld, { key: taste });
    fireEvent.keyDown(feld, { key: "Escape" });
    const dialog = await fenster();
    fireEvent.click(within(dialog).getByRole("button", { name: "Verlassen" }));

    await waitFor(() => expect(onVerlassen).toHaveBeenCalledTimes(1));
    const werte = onVerlassen.mock.calls[0][0];
    expect(Object.keys(werte).sort()).toEqual(["apm", "fehler", "wartezeitMs", "wert", "zeichen"]);
    expect(werte.zeichen + werte.fehler).toBeGreaterThan(0);
    // Kein Ende des Spiels: keine Platzierungsliste, kein „fertig" fürs Match.
    expect(onFertig).not.toHaveBeenCalled();
    expect(screen.queryByRole("heading", { name: /Klassenmatch ist vorbei/i })).toBeNull();
    // Die Anschläge gehen in den Lernstand - aber ohne Freischalt-Entscheidung.
    expect(saveFn).toHaveBeenCalledTimes(1);
    const gespeichert = saveFn.mock.calls[0][0];
    expect(Object.keys(gespeichert.letters ?? {}).length).toBeGreaterThan(0);
    expect(gespeichert.introduced).toEqual(geladen.introduced);
    expect(gespeichert.introducedAt).toEqual(geladen.introducedAt);
    expect(vi.mocked(speakUi)).toHaveBeenCalledWith("Du hast das Klassenmatch verlassen.");
  });

  it("★★★★ im Countdown: Escape und der Knopf im Wartefenster fragen ebenfalls", async () => {
    const onVerlassen = vi.fn();
    const start = Date.now() + 8_000;
    baue({
      onVerlassen,
      match: match({ status: "countdown", startMs: start, endeMs: start + MATCH_DAUER_MS }),
    });
    await screen.findByText(/Es geht los in \d+ Sekunden?\./);
    fireEvent.keyDown(window, { key: "Escape" });
    let dialog = await fenster();
    fireEvent.click(within(dialog).getByRole("button", { name: "Weiterschreiben" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    fireEvent.click(screen.getByRole("button", { name: "Verlassen" }));
    dialog = await fenster();
    fireEvent.click(within(dialog).getByRole("button", { name: "Verlassen" }));
    await waitFor(() => expect(onVerlassen).toHaveBeenCalledTimes(1));
    expect(onVerlassen.mock.calls[0][0]).toEqual({ zeichen: 0, fehler: 0, apm: 0, wert: 0, wartezeitMs: 0 });
  });
});

describe("(h) In der Einladungsphase bleibt Escape, wie es war", () => {
  it("★★★ Escape sagt ab bzw. steigt aus - ohne Rückfrage", async () => {
    const onAbbrechen = vi.fn();
    render(
      <KlassenmatchLobby
        match={match({ status: "einladung", startMs: 0, endeMs: 0 })}
        staende={[]}
        binGastgeber={false}
        imCountdown={false}
        restMs={0}
        kannStarten={false}
        onStarten={vi.fn()}
        onAbbrechen={onAbbrechen}
      />,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onAbbrechen).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
