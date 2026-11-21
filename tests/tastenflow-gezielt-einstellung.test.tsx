/**
 * ★★★ WÄCHTER: GEZIELT ÜBEN - Einstellungszeile, Vorrang der Klasse, Schutz am Server (Etappe B, 13.11.2026).
 *
 *   (a) Die Zeile im Zahnrad hat vier Zustände: aus (mit „Tasten wählen …"), an (Kästchen + „viel · bis ich es
 *       ausschalte"), Kind einer Klasse (nur lesend, kein Knopf) und „nicht eingebettet" (gar keine Zeile).
 *   (b) In englischer Bedienung steht dort kein deutsches Wort (Deutsch-Fänger, mit Gegenprobe in der deutschen).
 *   (c) `mitKlassenVorrang`: das Feld am Kind gilt vor der Klasse - auch `{zeichen: []}` als „aus für dieses Kind" -,
 *       Abgelaufenes zählt nicht, ein Konto ohne Klasse bleibt unberührt.
 *   (d) Der Server-Wächter `tt_pupils_field_guard.pb.js`: ein Kind einer Klasse kann `gezielt` NICHT selbst ändern, ein
 *       selbstlernendes Konto und die Lehrkraft schon. Der Hook wird hier wirklich ausgeführt (Attrappe der PocketBase-Welt).
 *   (e) Schema: `gezielt` steht als JSON-Feld an `tt_pupils` UND `tt_classes`.
 *   (f) Alt + 2 steht in der Kürzel-Liste (alle 17 Sprachen) - und Alt + A / Alt + Q bleiben plattformweit frei von Tastenflow.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speak: vi.fn() };
});

import { TypingSettings } from "../src/components/typing/TypingSettings";
import { mitKlassenVorrang } from "../src/components/typing/useTypingAuth";
import { BedienSpracheProvider } from "../src/lib/bedienSprache";
import { AnnounceProvider } from "../src/lib/a11y";
import { setLayout } from "../src/lib/typing/layouts";
import { speakUi } from "../src/lib/typing";
import type { TypingAccount, TypingClass } from "../src/lib/typing";
import { gezieltFuerKind, type Gezielt } from "../src/lib/typing/gezielt";
import { KUERZEL_LISTE } from "../src/lib/typing/kuerzelListe";
import { GEZIELT_TEXTE } from "../src/lib/typing/gezieltTexte";
import { ALLE_SPRACHEN } from "../src/lib/typing/sprachRegister";
import { findeDeutsch } from "./helfer/deutschFaenger";

const lies = (pfad: string) => readFileSync(resolve(__dirname, "..", pfad), "utf-8");

beforeEach(() => {
  localStorage.clear();
  setLayout("de");
  vi.mocked(speakUi).mockClear();
});
afterEach(() => cleanup());

const VIEL: Gezielt = { zeichen: ["ö", "ä", "ß", "?"], anteil: "viel", bis: null };

function zahnrad(gezielt?: { wirksam: Gezielt | null; vonLehrkraft: boolean; onWaehlen?: () => void; onAus?: () => void }, extra?: ReactNode) {
  const onWaehlen = gezielt?.onWaehlen ?? vi.fn();
  const onAus = gezielt?.onAus ?? vi.fn();
  render(
    <AnnounceProvider>
      <MemoryRouter>
        <BedienSpracheProvider>
          <TypingSettings
            lernweg="de"
            mode="adaptiv"
            onModeChange={() => {}}
            stufe="teens"
            lang="de"
            onLangChange={() => {}}
            gezielt={gezielt ? { wirksam: gezielt.wirksam, vonLehrkraft: gezielt.vonLehrkraft, onWaehlen, onAus } : undefined}
          />
          {extra}
        </BedienSpracheProvider>
      </MemoryRouter>
    </AnnounceProvider>,
  );
  return { onWaehlen, onAus };
}
const gruppe = () => document.getElementById("tt-set-uebungsart")!.closest("section")!;

describe("(a) die Zeile im Zahnrad", () => {
  it("aus: „Aus - alle Tasten wie im Lehrgang“, Schalter nicht gedrückt, „Tasten wählen …“", () => {
    const { onWaehlen } = zahnrad({ wirksam: null, vonLehrkraft: false });
    const g = within(gruppe());
    expect(g.getByText("Aus - alle Tasten wie im Lehrgang")).toBeTruthy();
    const schalter = g.getByRole("button", { name: /Gezielt üben: aus/ });
    expect(schalter.getAttribute("aria-pressed")).toBe("false");
    // Aus → an öffnet die Auswahl (an gibt es nur mit Tasten) - nichts ist `disabled`.
    fireEvent.click(schalter);
    expect(onWaehlen).toHaveBeenCalledTimes(1);
    fireEvent.click(g.getByRole("button", { name: "Tasten wählen …" }));
    expect(onWaehlen).toHaveBeenCalledTimes(2);
    expect(gruppe().querySelectorAll("[disabled]")).toHaveLength(0);
  });

  it("an: Kästchen mit Namen, „viel · bis ich es ausschalte“; der Schalter schaltet ab und sagt es", () => {
    const { onAus } = zahnrad({ wirksam: VIEL, vonLehrkraft: false });
    const g = within(gruppe());
    const schalter = g.getByRole("button", { name: /Gezielt üben: an/ });
    expect(schalter.getAttribute("aria-pressed")).toBe("true");
    expect(g.getAllByRole("listitem").map((l) => l.textContent)).toEqual(["ö", "ä", "ß", "?"]);
    // Die Kästchen tragen den ausgeschriebenen Namen (Braillezeile/Sprachausgabe), nicht nur das Zeichen.
    expect(g.getByLabelText("Fragezeichen")).toBeTruthy();
    expect(g.getByText("viel · bis ich es ausschalte")).toBeTruthy();
    expect(g.getByRole("button", { name: "Tasten wählen …" })).toBeTruthy();
    fireEvent.click(schalter);
    expect(onAus).toHaveBeenCalledTimes(1);
    expect(vi.mocked(speakUi).mock.calls.map((c) => String(c[0]))).toContain("Gezielt üben ist aus.");
  });

  it("die Zusammenfassung: ein wenig · nur heute / nur diese · bis <Datum>", () => {
    const d = new Date();
    const heute = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    zahnrad({ wirksam: { zeichen: ["ö"], anteil: "wenig", bis: heute }, vonLehrkraft: false });
    expect(within(gruppe()).getByText("ein wenig · nur heute")).toBeTruthy();
    cleanup();
    const spaeter = new Date(d.getFullYear() + 1, 10, 20);
    const bis = `${spaeter.getFullYear()}-11-20`;
    zahnrad({ wirksam: { zeichen: ["ö"], anteil: "nur", bis }, vonLehrkraft: false });
    expect(within(gruppe()).getByText(/^nur diese · bis .*20/)).toBeTruthy();
  });

  it("Kind einer Klasse: nur lesend - „von deiner Lehrkraft eingestellt“, kein Knopf in der Zeile", () => {
    zahnrad({ wirksam: VIEL, vonLehrkraft: true });
    const zeile = gruppe().querySelector('[data-gezielt-zeile="lehrkraft"]') as HTMLElement;
    expect(zeile).toBeTruthy();
    expect(within(zeile).getByText("von deiner Lehrkraft eingestellt")).toBeTruthy();
    expect(within(zeile).queryAllByRole("button")).toHaveLength(0);
    expect(within(zeile).getAllByRole("listitem")).toHaveLength(4);
    // Die Lehrkraft stellt für die Klasse ein - „bis ich es ausschalte" wäre die falsche Person.
    expect(zeile.textContent).not.toContain("bis ich es ausschalte");
  });

  it("Kind einer Klasse ohne Einstellung der Lehrkraft: gar keine Zeile", () => {
    zahnrad({ wirksam: null, vonLehrkraft: true });
    expect(gruppe().querySelector("[data-gezielt-zeile]")).toBeNull();
  });

  it("ohne die Eigenschaft (andere Einbettungen) gibt es die Zeile nicht", () => {
    zahnrad(undefined);
    expect(gruppe().querySelector("[data-gezielt-zeile]")).toBeNull();
    expect(screen.queryByText("Tasten wählen …")).toBeNull();
  });
});

describe("(b) englische Bedienung: kein deutsches Wort", () => {
  function en() {
    localStorage.setItem("tastenflow-bedienung", "en");
  }
  it("Zeile aus, an, von der Lehrkraft - alles englisch", () => {
    en();
    for (const g of [
      { wirksam: null, vonLehrkraft: false },
      { wirksam: VIEL, vonLehrkraft: false },
      { wirksam: VIEL, vonLehrkraft: true },
    ]) {
      zahnrad(g);
      const zeile = gruppe().querySelector("[data-gezielt-zeile]") as HTMLElement;
      expect(zeile.textContent).toMatch(/Targeted practice|Off - all keys as in the course/);
      const funde = findeDeutsch(zeile).filter((f) => ![...f.replace(/.*\[|\]$/g, "")].every((c) => [...c].length === 1));
      expect(funde, `${JSON.stringify(g)} -> ${zeile.textContent}`).toEqual([]);
      cleanup();
    }
  });

  it("Gegenprobe: in der DEUTSCHEN Bedienung findet derselbe Fänger Deutsch", () => {
    zahnrad({ wirksam: null, vonLehrkraft: false });
    const zeile = gruppe().querySelector("[data-gezielt-zeile]") as HTMLElement;
    expect(findeDeutsch(zeile).length).toBeGreaterThan(0);
  });

  it("alle 17 Sprachen tragen jeden Schlüssel - und keiner ist der deutsche Satz (ausser de)", () => {
    const schluessel = Object.keys(GEZIELT_TEXTE.de);
    const deutsch = GEZIELT_TEXTE.de as unknown as Record<string, unknown>;
    for (const sprache of ALLE_SPRACHEN) {
      const t = GEZIELT_TEXTE[sprache] as unknown as Record<string, unknown>;
      for (const k of schluessel) {
        expect(t[k], `${sprache}.${k}`).toBeTruthy();
        if (sprache === "de") continue;
        const a = typeof t[k] === "function" ? (t[k] as (...x: unknown[]) => string)("x", 8) : String(t[k]);
        const d = typeof deutsch[k] === "function" ? (deutsch[k] as (...x: unknown[]) => string)("x", 8) : String(deutsch[k]);
        // Reine Zeichen-Angaben wie „Alt" gibt es hier nicht: gleich bleibt höchstens ein Kürzel.
        if (a === d) expect(["verstanden"].includes(k), `${sprache}.${k} ist deutsch: ${a}`).toBe(false);
      }
    }
  });

  it("Hausregeln: nur Bindestrich (kein – oder —), keine Mausvokabeln in pl/tr", () => {
    for (const sprache of ALLE_SPRACHEN) {
      const t = GEZIELT_TEXTE[sprache] as unknown as Record<string, unknown>;
      for (const [k, v] of Object.entries(t)) {
        const text = typeof v === "function" ? (v as (...x: unknown[]) => string)("x", 8) : String(v);
        expect(text, `${sprache}.${k}`).not.toMatch(/[–—]/);
        if (sprache === "pl") expect(text, `pl.${k}`).not.toMatch(/klikn|kliknij|myszk/i);
        if (sprache === "tr") expect(text, `tr.${k}`).not.toMatch(/tıkla|fare|mouse/i);
      }
    }
  });
});

describe("(c) Vorrang: Kind vor Klasse", () => {
  const KLASSE: TypingClass = {
    code: "3B",
    name: "3b",
    teacherId: "t1",
    createdAt: 0,
    gezielt: { zeichen: ["ü"], anteil: "wenig", bis: null },
  };
  const KIND: TypingAccount = { id: "p1", role: "schueler", name: "Mia", classCode: "3B", createdAt: 0 };

  it("das Kind hat nichts gesetzt: es gilt die Klasse", () => {
    expect(mitKlassenVorrang(KIND, KLASSE).gezielt).toEqual({ zeichen: ["ü"], anteil: "wenig", bis: null });
    expect(mitKlassenVorrang({ ...KIND, gezielt: null }, KLASSE).gezielt?.zeichen).toEqual(["ü"]);
  });

  it("das Kind hat etwas gesetzt: das Feld am Kind schlägt die Klasse", () => {
    const eigen: Gezielt = { zeichen: ["ß", "ö"], anteil: "nur", bis: null };
    expect(mitKlassenVorrang({ ...KIND, gezielt: eigen }, KLASSE).gezielt).toEqual(eigen);
  });

  it("★ `{zeichen: []}` am Kind heisst „aus für dieses Kind“, auch wenn die Klasse etwas eingestellt hat", () => {
    const aus: Gezielt = { zeichen: [], anteil: "viel", bis: null };
    expect(mitKlassenVorrang({ ...KIND, gezielt: aus }, KLASSE).gezielt).toBeNull();
  });

  it("Abgelaufenes zählt nicht: die Klasse bis gestern gilt nicht mehr, das Kind bis gestern gibt an die Klasse zurück", () => {
    const gestern = new Date(Date.now() - 86_400_000 * 2);
    const bis = `${gestern.getFullYear()}-${String(gestern.getMonth() + 1).padStart(2, "0")}-${String(gestern.getDate()).padStart(2, "0")}`;
    expect(mitKlassenVorrang(KIND, { ...KLASSE, gezielt: { ...KLASSE.gezielt!, bis } }).gezielt).toBeNull();
    const abgelaufenesKind: Gezielt = { zeichen: ["x"], anteil: "viel", bis };
    expect(mitKlassenVorrang({ ...KIND, gezielt: abgelaufenesKind }, KLASSE).gezielt?.zeichen).toEqual(["ü"]);
    expect(gezieltFuerKind(abgelaufenesKind, null, new Date())).toBeNull();
  });

  it("Gegenprobe: ein Konto OHNE Klasse (selbstlernend) bleibt unberührt - sein eigenes Feld gilt", () => {
    const selbst: TypingAccount = { ...KIND, classCode: undefined, selfManaged: true, gezielt: VIEL };
    expect(mitKlassenVorrang(selbst, null).gezielt).toEqual(VIEL);
  });
});

describe("(d) der Server-Wächter tt_pupils_field_guard.pb.js - ausgeführt, nicht nur gelesen", () => {
  type Fach = Record<string, unknown>;
  function datensatz(id: string, felder: Fach) {
    const f: Fach = { ...felder };
    return {
      id,
      get: (k: string) => f[k],
      getString: (k: string) => (f[k] === undefined || f[k] === null ? "" : typeof f[k] === "string" ? (f[k] as string) : JSON.stringify(f[k])),
      set: (k: string, v: unknown) => {
        f[k] = v;
      },
      felder: f,
    };
  }
  /** Den Hook laden und gegen einen Selbst-/Lehrkraft-Zugriff laufen lassen. */
  function laufe(opts: { auth: "kind" | "lehrkraft"; selfManaged: boolean; neu: unknown }) {
    let handler: ((e: unknown) => void) | undefined;
    const quelle = lies("pocketbase/pb_hooks/tt_pupils_field_guard.pb.js");
    new Function("onRecordUpdateRequest", quelle)((fn: (e: unknown) => void) => {
      handler = fn;
    });
    const alt = { zeichen: ["a"], anteil: "viel", bis: null };
    const stored = datensatz("p1", { selfManaged: opts.selfManaged, gezielt: alt, lernweg: "", classCode: "3B" });
    const neu = datensatz("p1", { selfManaged: opts.selfManaged, gezielt: opts.neu, lernweg: "", classCode: "3B", zeichenabstand: 1 });
    const e = {
      auth: { id: opts.auth === "kind" ? "p1" : "t1", collection: () => ({ name: opts.auth === "kind" ? "tt_pupils" : "tt_teachers" }) },
      record: neu,
      app: { findRecordById: () => stored, findFirstRecordByFilter: () => { throw new Error("nein"); } },
      next: vi.fn(),
    };
    handler!(e);
    expect(e.next).toHaveBeenCalled();
    return { gespeichert: neu.felder.gezielt, alt };
  }
  const NEU = { zeichen: ["ö", "ä"], anteil: "nur", bis: null };

  it("★ Kind einer Klasse (nicht selfManaged): sein Versuch, `gezielt` zu ändern, wird auf den gespeicherten Wert zurückgesetzt", () => {
    const r = laufe({ auth: "kind", selfManaged: false, neu: NEU });
    expect(r.gespeichert).toEqual(r.alt);
  });

  it("selbstlernendes Konto (selfManaged): die Änderung bleibt", () => {
    const r = laufe({ auth: "kind", selfManaged: true, neu: NEU });
    expect(r.gespeichert).toEqual(NEU);
  });

  it("die Lehrkraft schreibt es über ihren Weg (Klassen-Regel, kein Feld-Wächter-Zweig): die Änderung bleibt", () => {
    const r = laufe({ auth: "lehrkraft", selfManaged: false, neu: NEU });
    expect(r.gespeichert).toEqual(NEU);
  });
});

describe("(e) Schema", () => {
  const setup = lies("pocketbase/setup.mjs");
  const feld = '{ name: "gezielt", type: "json", maxSize: 2000 }';
  it("`gezielt` ist ein JSON-Feld an tt_pupils UND tt_classes", () => {
    const pupils = setup.slice(setup.indexOf('name: "tt_pupils"'));
    const bisNaechste = pupils.slice(0, pupils.indexOf("\n  },\n") > 0 ? pupils.indexOf("\n  },\n") : 40000);
    expect(bisNaechste).toContain(feld);
    const klassen = setup.split("\n").find((z) => z.includes('base("tt_classes"'))!;
    expect(klassen).toContain(feld);
  });
});

describe("(f) Kürzel Alt + 2", () => {
  it("steht in der Liste jeder der 17 Sprachen - genau einmal", () => {
    for (const sprache of ALLE_SPRACHEN) {
      const l = KUERZEL_LISTE[sprache];
      const alle = [...l.kurztastenVorher, ...l.kurztastenNachher].map(([k]) => k);
      expect(alle.filter((k) => k === "Alt + 2"), sprache).toHaveLength(1);
    }
  });

  it("Alt + A und Alt + Q bleiben plattformweit reserviert: Tastenflow belegt sie nicht", () => {
    const seite = lies("src/features/public/TippenTrainerPage.tsx");
    expect(seite).not.toMatch(/case "KeyA":/);
    expect(seite).not.toMatch(/case "KeyQ":/);
    expect(seite).toMatch(/case "Digit2":/);
  });
});

describe("(g) auf der Übungsseite: Alt + 2, Schildchen, Kind einer Klasse", () => {
  async function seite(konto: TypingAccount | null) {
    const { einrichtungFertigMerken } = await import("../src/lib/typing/einrichtung");
    const { useTypingAuth } = await import("../src/components/typing/useTypingAuth");
    const { TippenTrainerPage } = await import("../src/features/public/TippenTrainerPage");
    Element.prototype.scrollIntoView = () => {};
    einrichtungFertigMerken();
    useTypingAuth.setState({ account: konto });
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    await screen.findByRole("heading", { name: /Mein Training/i });
  }

  it("Gast: Alt + 2 öffnet den Dialog, Escape schliesst ihn", async () => {
    await seite(null);
    fireEvent.keyDown(document.body, { code: "Digit2", key: "2", altKey: true });
    const dlg = await screen.findByRole("dialog", { name: "Gezielt üben - Tasten wählen" });
    expect(dlg).toBeTruthy();
    fireEvent.keyDown(screen.getByLabelText("Taste drücken"), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Gezielt üben - Tasten wählen" })).toBeNull());
  });

  it("Gast: Wahl im Dialog → das Gerät merkt sie → das Schildchen „Gezielt: ö“ steht in der Stand-Zeile", async () => {
    await seite(null);
    fireEvent.keyDown(document.body, { code: "Digit2", key: "2", altKey: true });
    await screen.findByRole("dialog", { name: "Gezielt üben - Tasten wählen" });
    fireEvent.keyDown(screen.getByLabelText("Taste drücken"), { key: "ö" });
    fireEvent.click(screen.getByRole("button", { name: "Fertig" }));
    expect(JSON.parse(localStorage.getItem("tippen-gezielt") ?? "null")?.zeichen).toEqual(["ö"]);
    await waitFor(() => expect(document.querySelector("[data-gezielt-schild]")).not.toBeNull());
    const schild = document.querySelector("[data-gezielt-schild]") as HTMLElement;
    expect(schild.textContent).toContain("Gezielt:");
    expect(within(schild).getByRole("button", { name: "Ändern" })).toBeTruthy();
  });

  it("★ Kind einer Klasse: Alt + 2 öffnet KEINEN Dialog, sondern sagt die Tasten der Lehrkraft an; das Schildchen hat kein „Ändern“", async () => {
    const kind: TypingAccount = {
      id: "p-jano",
      role: "schueler",
      name: "Jano",
      classCode: "5A3",
      stufe: "b",
      createdAt: 1,
      gezielt: { zeichen: ["ö", "?"], anteil: "viel", bis: null },
    } as TypingAccount;
    await seite(kind);
    fireEvent.keyDown(document.body, { code: "Digit2", key: "2", altKey: true });
    expect(screen.queryByRole("dialog", { name: "Gezielt üben - Tasten wählen" })).toBeNull();
    const gesagt = vi.mocked(speakUi).mock.calls.map((c) => String(c[0]));
    expect(gesagt.some((s) => s.startsWith("Deine Lehrkraft hat diese Tasten eingestellt: "))).toBe(true);
    expect(gesagt.join(" | ")).toContain("Fragezeichen");
    await waitFor(() => expect(document.querySelector("[data-gezielt-schild]")).not.toBeNull());
    expect(within(document.querySelector("[data-gezielt-schild]") as HTMLElement).queryByRole("button")).toBeNull();
  });
});

describe("(h) vorgezogene Taste: einmal vorgestellt, ohne Feier und ohne Speichern", () => {
  it("Hinweis + Ansage beim ersten Mal, nie wieder; nichts wird freigeschaltet oder gespeichert", async () => {
    const { useGezieltSteuerung } = await import("../src/components/typing/useGezieltSteuerung");
    let steuerung!: ReturnType<typeof useGezieltSteuerung>;
    function Harness() {
      steuerung = useGezieltSteuerung({
        account: null,
        istKlassenkind: false,
        lernweg: "de",
        einhand: false,
        update: () => {},
      });
      return <div>{steuerung.knoten}</div>;
    }
    render(<Harness />);
    expect(document.querySelector("[data-gezielt-vorgezogen]")).toBeNull();
    steuerung.onVorgezogen(["ö"]);
    await waitFor(() => expect(document.querySelector("[data-gezielt-vorgezogen]")).not.toBeNull());
    const hinweis = document.querySelector("[data-gezielt-vorgezogen]") as HTMLElement;
    expect(hinweis.textContent).toContain("Vorgezogen: eine Taste aus einem späteren Teil des Lehrgangs");
    expect(hinweis.textContent).toContain("kein Abzeichen");
    // Keine Feier: keine Freischalt-Karte (Dialog), kein „Gratulation“.
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(hinweis.textContent).not.toMatch(/Gratulation|freigeschaltet/);
    expect(vi.mocked(speakUi).mock.calls.some((c) => String(c[0]).startsWith("Vorgezogen:"))).toBe(true);
    // Am Konto/Fortschritt nichts verändert: nur der Merker „vorgestellt" liegt im Gerätespeicher.
    expect(JSON.parse(localStorage.getItem("tippen-gezielt-vorgestellt") ?? "{}")).toEqual({ geraet: ["ö"] });
    fireEvent.click(screen.getByRole("button", { name: "Verstanden" }));
    expect(document.querySelector("[data-gezielt-vorgezogen]")).toBeNull();
    // Zweites Mal: nichts mehr.
    vi.mocked(speakUi).mockClear();
    steuerung.onVorgezogen(["ö"]);
    await new Promise((r) => setTimeout(r, 30));
    expect(document.querySelector("[data-gezielt-vorgezogen]")).toBeNull();
    expect(vi.mocked(speakUi)).not.toHaveBeenCalled();
    // Ein anderes vorgezogenes Zeichen wird wieder vorgestellt.
    steuerung.onVorgezogen(["ö", "ß"]);
    await waitFor(() => expect(document.querySelector("[data-gezielt-vorgezogen]")).not.toBeNull());
    expect(JSON.parse(localStorage.getItem("tippen-gezielt-vorgestellt") ?? "{}")).toEqual({ geraet: ["ö", "ß"] });
  });
});
