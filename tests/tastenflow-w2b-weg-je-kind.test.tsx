/**
 * ★★★ W2b (28.09.2026): DER LERNWEG JE KIND - die Lehrkraft stellt ihn um.
 *
 * Johannes (27.09.2026): gemischte Klassen („2 verschiedene Erstsprachen in
 * einer Klasse"). Geprüft wird:
 *  1. `fortschrittImWeg` - ein Wechsel PARKT den Stand, nichts geht verloren,
 *     zurückwechseln holt ihn unverändert zurück.
 *  2. Der Server-Wächter `tt_pupils_field_guard.pb.js` AUSGEFÜHRT: nur die
 *     Lehrkraft DIESER Klasse (Eigentümerin oder Co) stellt einen gesetzten
 *     Weg um - nie das Kind, nie eine fremde Lehrkraft, nie auf leer.
 *  3. Die Tippchallenge in der gemischten Klasse (`textWegFuerKind`).
 *  4. Das Feld in „Einstellungen für …" mit Rückfrage (Ja/Nein, Fokus).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import { emptyProgress, type TypingProgress } from "@/lib/typing/progress";
import { fortschrittImWeg, geparkteWege, wegGewechselt } from "@/lib/typing/wegWechsel";
import { textWegFuerKind } from "@/lib/typing/schreibprobe";
import { introducedUpTo } from "@/lib/typing/letters";
import {
  addPupil,
  createClass,
  getAccount,
  listPupils,
  registerTeacher,
  setLernweg,
  setLernwegDurchLehrkraft,
} from "@/lib/typing/account";
import { LEHRGANG_PROBE_MERKER_ES } from "@/lib/typing/lernweg";
import { angeboteneWege } from "@/components/typing/WegJeKind";
import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import type { TypingAccount } from "@/lib/typing";

// ── 1 · Der Fortschritt: parken, nie löschen ─────────────────────────────────

function geuebt(weg: "de" | "en" | "fr" | "es" | undefined, extra: Partial<TypingProgress> = {}): TypingProgress {
  return {
    ...emptyProgress(),
    xp: 420,
    introduced: introducedUpTo(20, weg ?? "de"),
    lessons: { "de-1": { stars: 3, best: 90, runs: 2 } as never },
    letters: { f: { hits: 50, misses: 2 } as never },
    rounds: [{ ts: 1, acc: 0.97, cpm: 120, stars: 3, level: 5 }],
    level: 5,
    badges: { erste: 1 },
    customTextProgress: { t1: { zeile: 4 } },
    startAngewandt: 8,
    startAngewandtAm: 1000,
    ...(weg ? { lernweg: weg } : {}),
    ...extra,
  };
}

describe("1 · fortschrittImWeg - ein Wechsel parkt, nichts geht verloren", () => {
  it("derselbe Weg: Byte für Byte unverändert (auch ein Altstand ohne Kopie auf „de\")", () => {
    const p = geuebt("fr");
    expect(fortschrittImWeg(p, "fr")).toBe(p);
    const alt = geuebt(undefined);
    expect(fortschrittImWeg(alt, "de")).toBe(alt);
  });

  it("noch nichts geübt: nur die Kopie des Weges, kein Parkplatz", () => {
    const leer = { ...emptyProgress(), introduced: ["f", "j"] };
    const neu = fortschrittImWeg(leer, "fr");
    expect(neu.lernweg).toBe("fr");
    expect(neu.introduced).toEqual(["f", "j"]);
    expect(neu.wegStaende).toBeUndefined();
  });

  it("★★★ de → fr: der deutsche Stand liegt vollständig unter „de\", fr beginnt frisch", () => {
    const p = geuebt(undefined); // Altstand vor E1 - geübt, ohne Kopie ⇒ „de"
    const fr = fortschrittImWeg(p, "fr", { startUnits: 8, startUnitsAt: 1000 });
    expect(wegGewechselt(p, fr)).toBe(true);
    expect(fr.lernweg).toBe("fr");
    expect(fr.introduced).toBeUndefined(); // frisch - der Startpunkt kommt beim Laden
    expect(fr.lessons).toEqual({});
    expect(fr.rounds).toBeUndefined();
    // Was mit dem Kind mitgeht:
    expect(fr.xp).toBe(420);
    expect(fr.badges).toEqual({ erste: 1 });
    expect(fr.customTextProgress).toEqual({ t1: { zeile: 4 } });
    // Geparkt - jedes Feld des alten Standes, samt Wegkennung:
    const { wegStaende, ...ohne } = p;
    void wegStaende;
    expect(fr.wegStaende?.de).toEqual({ ...ohne, lernweg: "de" });
    expect(geparkteWege(fr)).toEqual(["de"]);
  });

  it("★★★ fr → de zurück: der deutsche Stand kommt unverändert wieder, fr wird geparkt", () => {
    const p = geuebt("de");
    const fr = fortschrittImWeg(p, "fr", { startUnits: 8, startUnitsAt: 1000 });
    const frGeuebt: TypingProgress = { ...fr, xp: 500, introduced: introducedUpTo(12, "fr"), level: 3 };
    const zurueck = fortschrittImWeg(frGeuebt, "de", { startUnits: 8, startUnitsAt: 1000 });
    expect(zurueck.lernweg).toBe("de");
    expect(zurueck.introduced).toEqual(p.introduced);
    expect(zurueck.lessons).toEqual(p.lessons);
    expect(zurueck.letters).toEqual(p.letters);
    expect(zurueck.level).toBe(5);
    expect(zurueck.xp).toBe(500); // die XP von heute, nicht die von damals
    expect(zurueck.wegStaende?.fr?.introduced).toEqual(introducedUpTo(12, "fr"));
    expect(zurueck.wegStaende?.de).toBeUndefined(); // liegt jetzt obenauf, nicht doppelt
  });

  it("zurückgeholt: ein inzwischen neuer Startpunkt stuft den Stand NICHT zurück (Vermerk = heutiger Beschluss)", () => {
    const p = geuebt("de");
    const fr = fortschrittImWeg(p, "fr", { startUnits: 8, startUnitsAt: 1000 });
    const zurueck = fortschrittImWeg({ ...fr, xp: 1 }, "de", { startUnits: 3, startUnitsAt: 5000 });
    expect(zurueck.startAngewandt).toBe(3);
    expect(zurueck.startAngewandtAm).toBe(5000);
  });

  it("drei Wege hintereinander: jeder Stand bleibt einzeln erhalten", () => {
    const de = geuebt("de");
    const en = fortschrittImWeg(de, "en");
    const enGeuebt = { ...en, introduced: introducedUpTo(15, "en"), rounds: [{ ts: 2, acc: 1, cpm: 90, stars: 2, level: 2 }] };
    const fr = fortschrittImWeg(enGeuebt, "fr");
    expect(geparkteWege(fr).sort()).toEqual(["de", "en"]);
    expect(fr.wegStaende?.en?.introduced).toEqual(introducedUpTo(15, "en"));
    expect(fr.wegStaende?.de?.introduced).toEqual(de.introduced);
  });
});

// ── 2 · Der Server-Wächter ──────────────────────────────────────────────────

function ladeWaechter() {
  const quelle = readFileSync(
    resolve(__dirname, "../pocketbase/pb_hooks/tt_pupils_field_guard.pb.js"),
    "utf8",
  );
  const angemeldet: ((e: unknown) => void)[] = [];
  new Function("onRecordUpdateRequest", quelle)((h: (e: unknown) => void) => angemeldet.push(h));
  return angemeldet[0];
}

type Felder = Record<string, unknown>;
function datensatz(id: string, felder: Felder) {
  const f = { ...felder };
  return {
    id,
    felder: f,
    get: (k: string) => f[k],
    getString: (k: string) => (f[k] == null ? "" : String(f[k])),
    set: (k: string, v: unknown) => {
      f[k] = v;
    },
  };
}

/** Wer schreibt, und welche Klassen-Zeilen der Server für ihn findet. */
function update(
  auth: { id: string; name: string },
  gespeichert: Felder,
  body: Felder,
  findet: { eigentuemer?: boolean; co?: boolean } = {},
): Felder {
  const handler = ladeWaechter();
  const stored = datensatz("k1", gespeichert);
  const record = datensatz("k1", { ...gespeichert, ...body });
  const gefragt: string[] = [];
  handler({
    auth: { id: auth.id, collection: () => ({ name: auth.name }) },
    record,
    app: {
      findRecordById: () => stored,
      findFirstRecordByFilter: (sammlung: string, filter: string, p: Record<string, string>) => {
        gefragt.push(`${sammlung}:${p.c}:${p.t}`);
        expect(filter).toContain("{:c}");
        if (sammlung === "tt_classes" && findet.eigentuemer) return {};
        if (sammlung === "tt_class_teachers" && findet.co) return {};
        throw new Error("sql: no rows in result set");
      },
    },
    next: () => undefined,
  });
  // Gefragt wird IMMER nach dem gespeicherten Klassencode und der eigenen Kennung.
  for (const g of gefragt) expect(g.endsWith(`:${gespeichert.classCode}:${auth.id}`)).toBe(true);
  return record.felder;
}

const LEHRKRAFT = { id: "t1", name: "tt_teachers" };
const KIND = { id: "k1", name: "tt_pupils" };
const GRUND: Felder = { teacherUid: "t1", classCode: "3B", name: "Mia", selfManaged: false, lernweg: "de" };

describe("2 · tt_pupils_field_guard: die Lehrkraft der Klasse stellt den Weg um", () => {
  it("★★★ Eigentümerin der Klasse: de → fr, fr → es, es → de", () => {
    expect(update(LEHRKRAFT, GRUND, { lernweg: "fr" }, { eigentuemer: true }).lernweg).toBe("fr");
    expect(update(LEHRKRAFT, { ...GRUND, lernweg: "fr" }, { lernweg: "es" }, { eigentuemer: true }).lernweg).toBe("es");
    expect(update(LEHRKRAFT, { ...GRUND, lernweg: "es" }, { lernweg: "de" }, { eigentuemer: true }).lernweg).toBe("de");
  });
  it("Co-Lehrkraft der Klasse ebenso", () => {
    expect(update(LEHRKRAFT, GRUND, { lernweg: "en" }, { co: true }).lernweg).toBe("en");
  });
  it("★★★ eine FREMDE Lehrkraft nie", () => {
    expect(update({ id: "t9", name: "tt_teachers" }, GRUND, { lernweg: "fr" }).lernweg).toBe("de");
  });
  it("★★★ das Kind selbst nie - auch nicht mit dem richtigen Klassencode", () => {
    expect(update(KIND, GRUND, { lernweg: "fr" }, { eigentuemer: true, co: true }).lernweg).toBe("de");
  });
  it("nie auf leer, nie auf Unsinn", () => {
    expect(update(LEHRKRAFT, GRUND, { lernweg: "" }, { eigentuemer: true }).lernweg).toBe("de");
    // ★ G2b-2: „tr" ist seit dem Gerüst ein gültiger Weg (der Wächter nimmt ihn an) - Unsinn ist „xx".
    expect(update(LEHRKRAFT, GRUND, { lernweg: "xx" }, { eigentuemer: true }).lernweg).toBe("de");
    expect(update(LEHRKRAFT, GRUND, { lernweg: "tr" }, { eigentuemer: true }).lernweg).toBe("tr");
  });
  it("ein Kind ohne Klasse (Selbstlernende): keine Lehrkraft, der Weg bleibt", () => {
    const selbst = { ...GRUND, classCode: "", teacherUid: "", selfManaged: true };
    expect(update(LEHRKRAFT, selbst, { lernweg: "fr" }, { eigentuemer: true }).lernweg).toBe("de");
  });
  it("Gegenprobe: ein leerer Weg darf wie bisher einmal gesetzt werden (erster Fortschritt)", () => {
    expect(update(KIND, { ...GRUND, lernweg: "" }, { lernweg: "fr" }).lernweg).toBe("fr");
  });
  it("fail-closed: wirft das Nachsehen selbst, bleibt der Weg", () => {
    const handler = ladeWaechter();
    const stored = datensatz("k1", GRUND);
    const record = datensatz("k1", { ...GRUND, lernweg: "fr" });
    handler({
      auth: { id: "t1", collection: () => ({ name: "tt_teachers" }) },
      record,
      app: { findRecordById: () => stored }, // kein findFirstRecordByFilter
      next: () => undefined,
    });
    expect(record.felder.lernweg).toBe("de");
  });
});

describe("2b · der Mock (lokaler Speicher) folgt derselben Regel", () => {
  beforeEach(() => localStorage.clear());
  it("das Kind schreibt einmal, die Lehrkraft stellt danach um", () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Mia", "pw1234");
    if (!p.ok) throw new Error(p.error);
    const id = listPupils(c.value.code)[0].id;
    setLernweg(id, "de");
    setLernweg(id, "en");
    expect(getAccount(id)!.lernweg).toBe("de");
    setLernwegDurchLehrkraft(id, "fr");
    expect(getAccount(id)!.lernweg).toBe("fr");
  });
});

// ── 3 · Die Tippchallenge in der gemischten Klasse ─────────────────────────

describe("3 · textWegFuerKind - wer welchen Challenge-Text schreibt", () => {
  it("Kinder auf dem Weg der Klasse: der Text des Plans, wie bisher", () => {
    for (const w of ["de", "en", "fr", "es"] as const) expect(textWegFuerKind(w, w, "satz")).toBe(w);
  });
  it("★★★ ein Kind auf Weg fr in einer Klasse auf de: dasselbe Niveau aus der französischen Bank - nie Deutsch", () => {
    expect(textWegFuerKind("de", "fr", "satz")).toBe("fr");
    expect(textWegFuerKind("de", "es", "start")).toBe("es");
    expect(textWegFuerKind("fr", "de", "gross")).toBe("de");
  });
  it("„eigen\" (die Datei der Lehrkraft) gilt für alle", () => {
    expect(textWegFuerKind("de", "fr", "eigen")).toBe("de");
  });
  it("ohne Plan: der Plan-Weg (nichts zu tun)", () => {
    expect(textWegFuerKind("de", "fr", null)).toBe("de");
  });
});

describe("3b · die nächste Startstelle rechnet nur aus Kindern desselben Weges", () => {
  it("SchreibprobeKasten filtert die Enden nach dem Weg der Klasse", () => {
    const quelle = readFileSync(
      resolve(__dirname, "../src/components/lernwerkstatt/klasse/SchreibprobeKasten.tsx"),
      "utf8",
    );
    expect(quelle).toContain("alleEnden(proben, klassenWeg)");
    expect(quelle).toContain("alleEnden({ ...proben, ...frisch }, klassenWeg)");
    expect(quelle).not.toMatch(/alleEnden\(proben\)/);
  });
  it("SchreibprobeLauf schreibt den Weg des TEXTES ins Ergebnis", () => {
    const quelle = readFileSync(resolve(__dirname, "../src/components/typing/SchreibprobeLauf.tsx"), "utf8");
    expect(quelle).not.toContain("lernweg: lernwegVon(plan),");
    expect(quelle.match(/lernweg: probenWeg,/g)?.length).toBe(2);
  });
});

describe("3c · das Kind führt den Wechsel beim Öffnen aus", () => {
  it("TippenTrainerPage parkt über fortschrittImWeg (nur mit Weg am Konto) und speichert sofort", () => {
    const quelle = readFileSync(resolve(__dirname, "../src/features/public/TippenTrainerPage.tsx"), "utf8");
    // ★ S1 (28.09.2026): mit dem KONTO (ohne Klassen-Vorgabe) - danach gilt
    // der Startpunkt über `startpunktImWeg`, erst dann die Klasse.
    expect(quelle).toMatch(/istLernweg\(account\.lernweg\)\s*\?\s*fortschrittImWeg\(p, weg, account\)/);
    expect(quelle).toMatch(/mitKlassenVorrang\(startpunktImWeg\(account, pMitWeg\), klasse\)/);
    expect(quelle).toMatch(/if \(gewechselt\) \{\s*await typingBackend\(\)\s*\.saveProgress\(account\.id, pMitWeg\)/);
  });
});

// ── 4 · Das Feld in „Einstellungen für …" ───────────────────────────────────

describe("4 · WegJeKind - Auswahl mit Rückfrage", () => {
  it("Spanisch nur mit dem Schalter - oder wenn das Kind schon dort steht", () => {
    expect(angeboteneWege("de", false)).toEqual(["de", "en", "fr"]);
    expect(angeboteneWege("de", true)).toEqual(["de", "en", "fr", "es"]);
    expect(angeboteneWege("es", false)).toEqual(["de", "en", "fr", "es"]);
  });

  let kinder: TypingAccount[];
  beforeEach(() => {
    localStorage.clear();
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Mia", "pw1234");
    if (!p.ok) throw new Error(p.error);
    setLernweg(listPupils(c.value.code)[0].id, "de");
    kinder = listPupils(c.value.code);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    try {
      localStorage.removeItem(LEHRGANG_PROBE_MERKER_ES);
    } catch {
      /* egal */
    }
  });

  async function klappeAuf() {
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Einstellungen und Auswertung von Mia/i }));
    });
    fireEvent.click(screen.getByText(/^Einstellungen für Mia\b/));
  }

  it("★★★ Französisch: Tastatur-Frage; „Nein\" lässt Deutsch stehen und gibt den Fokus ans Feld zurück", async () => {
    await klappeAuf();
    const feld = screen.getByLabelText("Lehrgang von Mia") as HTMLSelectElement;
    expect(feld.value).toBe("de");
    // ★ 28.09.2026 (Freigabe fr/es): Der spanische Schalter ist default AN -
    // „Spanisch" steht darum ohne Merker mit in der Auswahl (bis dahin
    // `["de", "en", "fr"]`; die Regel selbst prüft `angeboteneWege` oben).
    // ★ 10.10.2026 (Freigabe it/pl/tr/cs): dito - die vier neuen stehen ohne Merker mit drin.
    // ★ 06.11.2026 (Freigabe der neun): dito - bg, el, hu, nl, pt, br, ro, sv, uk stehen ohne Merker mit drin.
    expect([...feld.options].map((o) => o.value)).toEqual([
      "de", "en", "fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk",
    ]);
    feld.focus();
    await act(async () => {
      fireEvent.change(feld, { target: { value: "fr" } });
    });
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("Achtung: Französisch ist nur mit der passenden Tastatur möglich.");
    expect(dialog.textContent).toContain(
      "Verwendet Mia eine französische Tastatur (Frankreich, Belgien, Schweiz oder Kanada)?",
    );
    expect(dialog.textContent).toContain("Der bisherige Stand bleibt gespeichert");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Nein" }));
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(getAccount(kinder[0].id)!.lernweg).toBe("de");
    const nachher = screen.getByLabelText("Lehrgang von Mia") as HTMLSelectElement;
    expect(nachher.value).toBe("de");
    expect(document.activeElement).toBe(nachher);
  }, 30_000);

  it("★★★ „Ja\" stellt um - am Konto, im Feld und in der Statuszeile", async () => {
    await klappeAuf();
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Lehrgang von Mia"), { target: { value: "fr" } });
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Ja" }));
    });
    expect(getAccount(kinder[0].id)!.lernweg).toBe("fr");
    expect((screen.getByLabelText("Lehrgang von Mia") as HTMLSelectElement).value).toBe("fr");
    expect(await screen.findByText(/Mia lernt jetzt im Lehrgang Französisch/)).toBeTruthy();
  }, 30_000);

  it("Englisch (keine Landestastatur): „Jetzt umstellen?\" statt der Tastatur-Frage; Escape = Nein", async () => {
    await klappeAuf();
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Lehrgang von Mia"), { target: { value: "en" } });
    });
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("Jetzt umstellen?");
    expect(dialog.textContent).not.toContain("Tastatur möglich");
    await act(async () => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(getAccount(kinder[0].id)!.lernweg).toBe("de");
  }, 30_000);
});
