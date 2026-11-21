/**
 * ★★★★★ WÄCHTER: TASTENFLOW LÄDT NUR DIE SPRACHE DES KINDES - UND ÜBT ERST
 * DANACH (28.09.2026).
 *
 * Johannes: *„nur die sprache vom kind laden! und englische texte kommen
 * immer mit. in jeder sprache"*. Die bestehenden Tests laufen mit allen
 * Paketen (`tests/sprachpakete-vorgeladen.ts`); DIESE Datei vergisst sie vor
 * jedem Fall und prüft den echten Weg eines frischen Besuchs:
 *
 *  (a) Weg „es" lädt genau es + en (die Aufrufe der Lader gezählt).
 *  (b) Die Übung steht erst, wenn die Pakete da sind - davor nur die ruhige
 *      Statusanzeige; danach steht der Fokus im Übungsfeld.
 *  (c) Scheitert das Laden: ein Satz und „Neu laden", keine Übung.
 *  (d) Die Lehrkraft stellt ein Kind von es auf de um: de wird nachgeladen.
 *  (f) Eine gemischte Klasse bei der Lehrkraft: die Statistik eines Kindes,
 *      das in einer anderen Sprache gelesen hat, holt die fehlenden Pakete.
 *  Dazu: kein Fehlzugriff (`fehlZugriffe()` leer) - kein Durchgang, den kein
 *  Tor abdeckt.
 *  (e) das Ledger steht in `tests/sprachpakete-golden.test.ts`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { TastenflowSprachBereich } from "../src/features/public/TastenflowSprachBereich";
import { AnnounceProvider } from "../src/lib/a11y";
import { BedienSpracheProvider } from "../src/lib/bedienSprache";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { LEHRGANG_PROBE_MERKER_ES } from "../src/lib/typing/lernweg";
import {
  addPupil,
  createClass,
  getAccount,
  listPupils,
  registerTeacher,
  setLernwegDurchLehrkraft,
} from "../src/lib/typing/account";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { SprachpaketTor } from "../src/components/typing/SprachpaketTor";
import { PupilStatsPanel } from "../src/components/typing/PupilStatsPanel";
import { emptyProgress } from "../src/lib/typing/progress";
import { computePupilStats } from "../src/lib/typing/account";
import { corpusItemsFor } from "../src/lib/typing/corpus";
import {
  ALLE_SPRACHPAKETE,
  _echterSprachpaketLader,
  _sprachpaketLaderErsetzen,
  _sprachpaketeVergessen,
  _sprachpaketeWiederEinsetzen,
  fehlZugriffe,
  fehlZugriffeLeeren,
  sprachpaketGeladen,
  type SprachDaten,
} from "@/lib/typing/sprachpakete";
import { SPRACHPAKET_FR } from "@/lib/typing/sprachpaketFr";
import type { Lang } from "@/lib/typing/account";

// ── Aufbau ───────────────────────────────────────────────────────────────────

let vorher: Map<Lang, SprachDaten>;
let zurueck: () => void;
/** Wie oft jede Sprache angefordert wurde. */
let geladen: Record<Lang, number>;

function zaehlendeLader(ersatz: Partial<Record<Lang, () => Promise<SprachDaten | undefined>>> = {}) {
  zurueck?.();
  const lader = Object.fromEntries(
    ALLE_SPRACHPAKETE.map((l) => [
      l,
      () => {
        geladen[l]++;
        return (ersatz[l] ?? _echterSprachpaketLader(l))();
      },
    ]),
  );
  zurueck = _sprachpaketLaderErsetzen(lader);
}

beforeEach(() => {
  geladen = { de: 0, en: 0, fr: 0, es: 0, it: 0, pl: 0, tr: 0, cs: 0, bg: 0, el: 0, hu: 0, nl: 0, pt: 0, br: 0, ro: 0, sv: 0, uk: 0 };
  vorher = _sprachpaketeVergessen();
  zaehlendeLader();
  fehlZugriffeLeeren();
});

afterEach(() => {
  cleanup();
  zurueck();
  _sprachpaketeWiederEinsetzen(vorher);
  fehlZugriffeLeeren();
  localStorage.clear();
  useTypingAuth.setState({ account: null } as never);
  vi.restoreAllMocks();
});

function spanischerGast() {
  localStorage.setItem("tastenflow-bedienung", "es");
  localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "1");
  einrichtungFertigMerken();
}

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

const uebungsfeld = () => document.querySelector<HTMLTextAreaElement>('textarea[data-typing-field="practice"]');

/** Ein Versprechen, das der Test selbst einlöst. */
function aufgeschoben<T>() {
  let einloesen!: (v: T) => void;
  let ablehnen!: (e: unknown) => void;
  const p = new Promise<T>((a, b) => {
    einloesen = a;
    ablehnen = b;
  });
  return { p, einloesen, ablehnen };
}

// ── (a) + (b) ────────────────────────────────────────────────────────────────

describe("(a) Weg „es“ lädt genau es + en", () => {
  it("die Übungsseite eines spanischen Gastes: es und en je einmal, de und fr nie", async () => {
    spanischerGast();
    zeigeUebungsseite();
    await waitFor(() => expect(uebungsfeld()).not.toBeNull(), { timeout: 10_000 });
    expect(geladen).toEqual({ de: 0, en: 1, fr: 0, es: 1, it: 0, pl: 0, tr: 0, cs: 0, bg: 0, el: 0, hu: 0, nl: 0, pt: 0, br: 0, ro: 0, sv: 0, uk: 0 });
    expect(sprachpaketGeladen("de")).toBe(false);
    expect(sprachpaketGeladen("fr")).toBe(false);
    expect(fehlZugriffe(), "ein Durchgang ohne Tor griff auf eine fehlende Sprache").toEqual([]);
  });
});

describe("(b) die Übung steht erst, wenn die Pakete da sind", () => {
  it("vorher die ruhige Statusanzeige, danach das Übungsfeld - mit dem Fokus darin", async () => {
    spanischerGast();
    const es = aufgeschoben<SprachDaten | undefined>();
    zaehlendeLader({ es: () => es.p });
    zeigeUebungsseite();

    const status = await screen.findByText("Cargando …");
    expect(status.closest('[role="status"]')).not.toBeNull();
    // Noch KEINE Übung - und niemand hat auf den Spanisch-Korpus gegriffen.
    expect(uebungsfeld()).toBeNull();
    expect(fehlZugriffe()).toEqual([]);
    // Das Warten nimmt niemandem den Fokus.
    expect(status.contains(document.activeElement)).toBe(false);

    await act(async () => {
      es.einloesen(await _echterSprachpaketLader("es")());
    });
    await waitFor(() => expect(uebungsfeld()).not.toBeNull(), { timeout: 10_000 });
    expect(screen.queryByText("Cargando …")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(uebungsfeld()), { timeout: 5_000 });
    expect(fehlZugriffe()).toEqual([]);
  });

  it("★★ GEGENPROBE: ohne Tor griffe der Spanisch-Korpus ins Leere (und das würde gemeldet)", () => {
    // Genau das verhindert das Tor: vor dem Laden ist der Korpus leer.
    const zeilen = corpusItemsFor({ lang: "es", stufe: "kids", allowed: new Set("asdfjklñ".split("")), lernweg: "es" } as never);
    expect(zeilen).toEqual([]);
    expect(fehlZugriffe().map((f) => f.sprache)).toContain("es");
  });
});

// ── (c) ──────────────────────────────────────────────────────────────────────

describe("(c) scheitert das Laden (Netz weg)", () => {
  it("ein Satz und „Neu laden“, keine Übung aus einer anderen Sprache", async () => {
    spanischerGast();
    zaehlendeLader({ es: () => Promise.reject(new Error("Netz weg")) });
    zeigeUebungsseite();
    const satz = await screen.findByText(/No se pudieron cargar los textos de práctica/, undefined, {
      timeout: 10_000,
    });
    expect(screen.getByRole("button", { name: "Volver a cargar" })).toBeTruthy();
    expect(uebungsfeld()).toBeNull();
    // Der Satz bekommt den Fokus (die Sprachausgabe liest ihn), wie bei einer Seite.
    await waitFor(() => expect(document.activeElement).toBe(satz));
    expect(sprachpaketGeladen("de")).toBe(false);
  });

  it("auch wenn Vite den Fehler abfängt und nichts liefert (`undefined`)", async () => {
    spanischerGast();
    zaehlendeLader({ es: () => Promise.resolve(undefined) });
    zeigeUebungsseite();
    expect(await screen.findByRole("button", { name: "Volver a cargar" }, { timeout: 10_000 })).toBeTruthy();
    expect(uebungsfeld()).toBeNull();
  });
});

// ── (d) ──────────────────────────────────────────────────────────────────────

describe("(d) die Lehrkraft stellt ein Kind von es auf de um", () => {
  it("das deutsche Paket kommt nach, danach wieder das Übungsfeld", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error("Lehrkraft");
    const c = createClass(t.value.id, "3b", "3B");
    if (!c.ok) throw new Error("Klasse");
    addPupil(c.value.code, "Mia", "pw1234");
    const id = listPupils(c.value.code)[0].id;
    setLernwegDurchLehrkraft(id, "es");
    localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "1");
    einrichtungFertigMerken();
    useTypingAuth.setState({ account: getAccount(id) } as never);

    zeigeUebungsseite();
    await waitFor(() => expect(uebungsfeld()).not.toBeNull(), { timeout: 10_000 });
    expect(geladen).toEqual({ de: 0, en: 1, fr: 0, es: 1, it: 0, pl: 0, tr: 0, cs: 0, bg: 0, el: 0, hu: 0, nl: 0, pt: 0, br: 0, ro: 0, sv: 0, uk: 0 });
    act(() => uebungsfeld()!.focus());
    // Die Anforderung vom Seitenstart ist längst abgelaufen (focusField.ts, 5 s).
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 60_000);

    setLernwegDurchLehrkraft(id, "de");
    act(() => {
      useTypingAuth.setState({ account: getAccount(id) } as never);
    });
    await waitFor(() => expect(sprachpaketGeladen("de")).toBe(true), { timeout: 10_000 });
    await waitFor(() => expect(uebungsfeld()).not.toBeNull(), { timeout: 10_000 });
    expect(geladen).toEqual({ de: 1, en: 1, fr: 0, es: 1, it: 0, pl: 0, tr: 0, cs: 0, bg: 0, el: 0, hu: 0, nl: 0, pt: 0, br: 0, ro: 0, sv: 0, uk: 0 });
    // Der Fokus stand im Übungsfeld, das dem Warten weichen musste - er kommt
    // ins neue Übungsfeld zurück, nicht auf <body>.
    await waitFor(() => expect(document.activeElement).toBe(uebungsfeld()), { timeout: 5_000 });
    expect(fehlZugriffe()).toEqual([]);
  });
});

// ── (f) ──────────────────────────────────────────────────────────────────────

describe("(f) gemischte Klasse: die Statistik eines Kindes", () => {
  function panel(progress = emptyProgress()) {
    const pupil = { id: "k1", name: "Mia", role: "pupil", lernweg: "es", lang: "es", stufe: "kids" } as never;
    return (
      <BedienSpracheProvider>
        <PupilStatsPanel
          data={{ pupil, progress, events: [], stats: computePupilStats([]) }}
          selfView={false}
        />
      </BedienSpracheProvider>
    );
  }

  it("liest das Kind nur Serien geladener Sprachen: kein Nachladen", async () => {
    vorher.get("es") && _sprachpaketeWiederEinsetzen(new Map([["es", vorher.get("es")!]]));
    render(panel());
    await waitFor(() => expect(screen.queryByText(/Wird geladen|Cargando/)).toBeNull());
    expect(geladen).toEqual({ de: 0, en: 0, fr: 0, es: 0, it: 0, pl: 0, tr: 0, cs: 0, bg: 0, el: 0, hu: 0, nl: 0, pt: 0, br: 0, ro: 0, sv: 0, uk: 0 });
  });

  it("★★★ nennt sein Fortschritt eine Serie aus einem fehlenden Paket: alle Pakete kommen", async () => {
    const frSlug = Object.values(SPRACHPAKET_FR.serien).flat()[0].slug;
    const progress = { ...emptyProgress(), storyProgress: { [frSlug]: { etappe: 1 } } } as never;
    render(panel(progress));
    // Erst die Warteanzeige - die Statistik zeigt sich nicht halb.
    expect(screen.getByText("Wird geladen …")).toBeTruthy();
    await waitFor(() => expect(sprachpaketGeladen("fr")).toBe(true), { timeout: 10_000 });
    await waitFor(() => expect(screen.queryByText(/Wird geladen/)).toBeNull());
    expect(geladen.fr).toBe(1);
    // Das Tor hat es gelöst, nicht erst das Netz (ein Fehlzugriff hiesse: die
    // Statistik war einen Augenblick ohne die gelesene Geschichte zu sehen).
    expect(fehlZugriffe()).toEqual([]);
  });
});

// ── der Baustein selbst ──────────────────────────────────────────────────────

describe("SprachpaketTor", () => {
  function zeige(knoten: ReactNode) {
    return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
  }

  it("ist das Paket schon da, gibt es kein Warten", () => {
    _sprachpaketeWiederEinsetzen(new Map([["en", vorher.get("en")!]]));
    zeige(
      <SprachpaketTor sprachen={["en"]}>
        <p>Inhalt</p>
      </SprachpaketTor>,
    );
    expect(screen.getByText("Inhalt")).toBeTruthy();
    expect(geladen.en).toBe(0);
  });

  it("★ nach einem Warten: war der Fokus weg, führt `fokusNachWarten` ihn weiter - sonst nicht", async () => {
    const fokus = vi.fn();
    zeige(
      <>
        <button type="button">draussen</button>
        <SprachpaketTor sprachen={["fr"]} fokusNachWarten={fokus}>
          <p>Inhalt</p>
        </SprachpaketTor>
      </>,
    );
    (document.activeElement as HTMLElement | null)?.blur();
    await screen.findByText("Inhalt");
    expect(fokus).toHaveBeenCalledTimes(1);

    // Steht der Fokus woanders (etwa im offenen Zahnrad-Fenster), bleibt er dort.
    cleanup();
    _sprachpaketeVergessen(["fr"]);
    const fokus2 = vi.fn();
    zeige(
      <>
        <button type="button">draussen</button>
        <SprachpaketTor sprachen={["fr"]} fokusNachWarten={fokus2}>
          <p>Inhalt</p>
        </SprachpaketTor>
      </>,
    );
    act(() => screen.getByRole("button", { name: "draussen" }).focus());
    await screen.findByText("Inhalt");
    expect(fokus2).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "draussen" }));
  });

  it("wechselt der Bedarf (Weg es → de), wartet es nur auf das Neue", async () => {
    const { rerender } = zeige(
      <SprachpaketTor sprachen={["es", "en"]}>
        <p>Inhalt</p>
      </SprachpaketTor>,
    );
    await screen.findByText("Inhalt");
    rerender(
      <BedienSpracheProvider>
        <SprachpaketTor sprachen={["de", "en"]}>
          <p>Inhalt</p>
        </SprachpaketTor>
      </BedienSpracheProvider>,
    );
    expect(screen.getByText("Wird geladen …")).toBeTruthy();
    await screen.findByText("Inhalt");
    expect(geladen).toEqual({ de: 1, en: 1, fr: 0, es: 1, it: 0, pl: 0, tr: 0, cs: 0, bg: 0, el: 0, hu: 0, nl: 0, pt: 0, br: 0, ro: 0, sv: 0, uk: 0 });
  });
});
