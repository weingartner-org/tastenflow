import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addPupil,
  createClass,
  getAccount,
  getClass,
  listPupils,
  registerTeacher,
  setKlassenWochenziel,
  setWochenziel,
  sperreAufheben,
  stundeSperren,
} from "@/lib/typing/account";
import {
  UMSTELLUNG_WOCHE,
  aktuelleWocheKey,
  kindWochenzielAusFeldern,
  naechsteWocheKey,
  zielFuerWoche,
} from "@/lib/typing/wochenziel";
import { PocketBaseTypingBackend } from "@/lib/typing/pbBackend";

/**
 * ★★★★★ Wochenziel NEU (W2, 18.09.2026) - die DATEN-Schicht, `Sensorik/apps/
 * tastenflow/BAUPLAN-2026-09-18-MEINE-KLASSEN-UMBAU.md` §„W · Wochenziel neu"
 * und `ENTWURF-2026-09-18-MEINE-KLASSEN-UMBAU.md` §7f/§7g. Die reine Logik
 * (`wochenziel.ts`) ist W1 und dort schon geprüft
 * (`tests/typing-wochenziel-neu.test.ts`) - hier geht es NUR um die vier
 * Backend-Methoden und `addPupil`, gegen den lokalen Mock (localStorage).
 *
 * Der Server-Zwilling der Montag-08:00-Rechnung steht eigens in
 * `tests/tastenflow-wochenziel-server-zwilling.test.ts`.
 */

/** Ein fester Zeitpunkt weit NACH {@link UMSTELLUNG_WOCHE} („2026-W38") -
 *  sonst wäre der lazy umgerechnete Alt-Abschnitt selbst noch „zukünftig"
 *  und die Prüfung „bleibt nach einer Änderung erhalten" bewiese nichts. */
const JETZT = new Date(2026, 9, 5, 10, 0, 0).getTime(); // 05.10.2026, 10:00

function lehrkraft() {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  return t.value;
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(JETZT);
});
afterEach(() => {
  vi.useRealTimers();
});

describe("★★★★★ setWochenziel - EIN Kind", () => {
  it("gilt ab der NÄCHSTEN Woche - die laufende Woche behält ihr bisheriges Ziel", () => {
    const t = lehrkraft();
    const c = createClass(t.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Mia", "pw1234");
    if (!p.ok) throw new Error(p.error);
    // Ein erster Wechsel, damit die laufende Woche schon ein ECHTES (nicht
    // nur lazy umgerechnetes) Ziel trägt, das der zweite Wechsel stehen
    // lassen muss.
    setWochenziel(p.value.id, { minuten: 30, wochen: [], nachholen: false });
    // Acht Kalendertage weiter - IMMER in der nächsten Ziel-Woche, nie in der
    // übernächsten (eine Woche ist genau sieben Tage lang).
    vi.setSystemTime(JETZT + 8 * 86_400_000);

    const vorher = kindWochenzielAusFeldern(getAccount(p.value.id)!);
    const zielVorher = zielFuerWoche(vorher.verlauf, aktuelleWocheKey(Date.now()));
    expect(zielVorher).toBe(30); // der erste Wechsel gilt jetzt als laufende Woche

    const nach = setWochenziel(p.value.id, { minuten: 90, wochen: [], nachholen: false });
    expect(nach).not.toBeNull();
    const verlauf = nach!.wochenzielVerlauf ?? [];
    expect(zielFuerWoche(verlauf, aktuelleWocheKey(Date.now()))).toBe(zielVorher);
    expect(zielFuerWoche(verlauf, naechsteWocheKey(Date.now()))).toBe(90);
    expect(nach!.goalWeeks).toEqual([]);
    expect(nach!.goalCatchUp).toBe(false);
    // Aus dem Speicher gelesen dasselbe Bild - kein Unterschied Rückgabe/Speicher.
    expect(getAccount(p.value.id)!.wochenzielVerlauf).toEqual(verlauf);
  });

  it("ein Kind ohne echten Verlauf (nur goalMinutes × goalUnits) behält seinen KW-38-Abschnitt nach der Änderung", () => {
    const t = lehrkraft();
    const c = createClass(t.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Ben", "pw1234");
    if (!p.ok) throw new Error(p.error);
    // Ein Kind aus der Zeit VOR W1/W2: nur die alten Felder gesetzt (wie es
    // das inzwischen entfernte `setGoal` bis W2 immer tat), noch kein
    // `wochenzielVerlauf`. Von Hand geschrieben, wie ein Bestandsstand von
    // vor dem Umbau (dieselbe Bauart wie `typing-stufen-migration.test.ts`).
    const roh = JSON.parse(localStorage.getItem("tippen-trainer:store:v1")!);
    roh.accounts[p.value.id].goalMinutes = 15;
    roh.accounts[p.value.id].goalUnits = 3;
    localStorage.setItem("tippen-trainer:store:v1", JSON.stringify(roh));

    const konto = getAccount(p.value.id)!;
    expect(konto.wochenzielVerlauf ?? []).toEqual([]); // noch nicht umgestellt
    const lazyMinuten = (konto.goalMinutes ?? 0) * (konto.goalUnits ?? 0);
    expect(lazyMinuten).toBeGreaterThan(0);

    const nach = setWochenziel(p.value.id, { minuten: 45, wochen: [], nachholen: true });
    const verlauf = nach!.wochenzielVerlauf!;
    // Der umgerechnete Alt-Abschnitt (ab UMSTELLUNG_WOCHE) ist noch da …
    expect(zielFuerWoche(verlauf, UMSTELLUNG_WOCHE)).toBe(lazyMinuten);
    // … und die neue Änderung greift ab der nächsten Woche.
    expect(zielFuerWoche(verlauf, naechsteWocheKey(Date.now()))).toBe(45);
    expect(nach!.goalCatchUp).toBe(true);
  });

  it("ein unbekanntes Konto liefert null", () => {
    expect(setWochenziel("nichts-da", { minuten: 30, wochen: [], nachholen: false })).toBeNull();
  });
});

describe("★★★★★ setKlassenWochenziel - „Für die Klasse einstellen\"", () => {
  it("merkt die Vorgabe an der Klasse UND schreibt sie jedem Kind", () => {
    const t = lehrkraft();
    const c = createClass(t.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    for (const name of ["Anna", "Ben", "Carla"]) addPupil("3B", name, "pw1234");

    const r = setKlassenWochenziel("3B", {
      minuten: 60,
      wochen: ["2026-W40"],
      nachholen: true,
    });
    expect(r).toEqual({ ok: 3, fehler: [] });

    const cls = getClass("3B")!;
    expect(cls.wochenzielVorgabe).toEqual({
      minuten: 60,
      wochen: ["2026-W40"],
      nachholen: true,
      am: Date.now(),
    });

    for (const kind of listPupils("3B")) {
      const verlauf = kindWochenzielAusFeldern(kind).verlauf;
      expect(zielFuerWoche(verlauf, naechsteWocheKey(Date.now()))).toBe(60);
      expect(kind.goalWeeks).toEqual(["2026-W40"]);
      expect(kind.goalCatchUp).toBe(true);
    }
  });

  it("eine unbekannte Klasse meldet 0 Erfolge, ohne zu werfen", () => {
    expect(setKlassenWochenziel("NIRGENDS", { minuten: 30, wochen: [], nachholen: false })).toEqual({
      ok: 0,
      fehler: [],
    });
  });

  it("ein Kind, das NACH der Klassen-Vorgabe beitritt, bekommt sie ab der nächsten Woche - Wochen und Nachholen inklusive", () => {
    const t = lehrkraft();
    const c = createClass(t.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    setKlassenWochenziel("3B", { minuten: 60, wochen: ["2026-W40"], nachholen: true });

    const neu = addPupil("3B", "Dora", "pw1234");
    if (!neu.ok) throw new Error(neu.error);
    const konto = getAccount(neu.value.id)!;
    expect(konto.goalWeeks).toEqual(["2026-W40"]);
    expect(konto.goalCatchUp).toBe(true);
    const verlauf = konto.wochenzielVerlauf ?? [];
    // Die vergangenen (und die laufende) Woche zählen NICHT …
    expect(zielFuerWoche(verlauf, aktuelleWocheKey(Date.now()))).toBe(0);
    // … erst die nächste Woche trägt die Vorgabe.
    expect(zielFuerWoche(verlauf, naechsteWocheKey(Date.now()))).toBe(60);
  });

  it("eine Klasse OHNE Vorgabe lässt ein neues Kind unverändert (wie vor W2)", () => {
    const t = lehrkraft();
    const c = createClass(t.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Elias", "pw1234");
    if (!p.ok) throw new Error(p.error);
    expect(getAccount(p.value.id)!.wochenzielVerlauf ?? []).toEqual([]);
  });
});

describe("★★★★★ „Eine Stunde sperren\"", () => {
  it("legt einen 60-Minuten-Zeitraum an", () => {
    const t = lehrkraft();
    createClass(t.id, "3b", "3B");
    const cls = stundeSperren("3B");
    expect(cls?.gesperrteZeiten).toEqual([{ abMs: JETZT, bisMs: JETZT + 60 * 60_000 }]);
  });

  it("läuft schon eine Sperre, bleibt die Klasse UNVERÄNDERT (kein zweiter, überlappender Zeitraum)", () => {
    const t = lehrkraft();
    createClass(t.id, "3b", "3B");
    stundeSperren("3B");
    vi.setSystemTime(JETZT + 10 * 60_000); // zehn Minuten später, die Sperre läuft noch
    const nochmal = stundeSperren("3B");
    expect(nochmal?.gesperrteZeiten).toEqual([{ abMs: JETZT, bisMs: JETZT + 60 * 60_000 }]);
  });

  it("sperreAufheben beendet eine laufende Sperre sofort (bisMs = jetzt)", () => {
    const t = lehrkraft();
    createClass(t.id, "3b", "3B");
    stundeSperren("3B");
    vi.setSystemTime(JETZT + 10 * 60_000);
    const aufgehoben = sperreAufheben("3B");
    expect(aufgehoben?.gesperrteZeiten).toEqual([{ abMs: JETZT, bisMs: JETZT + 10 * 60_000 }]);
  });

  it("sperreAufheben OHNE laufende Sperre ändert nichts", () => {
    const t = lehrkraft();
    createClass(t.id, "3b", "3B");
    const ergebnis = sperreAufheben("3B");
    expect(ergebnis?.gesperrteZeiten ?? []).toEqual([]);
  });

  it("entsorgt Zeiträume älter als 400 Tage beim nächsten Sperren", () => {
    const t = lehrkraft();
    createClass(t.id, "3b", "3B");
    const VOR_401_TAGEN = JETZT - 401 * 86_400_000;
    vi.setSystemTime(VOR_401_TAGEN);
    stundeSperren("3B");
    vi.setSystemTime(VOR_401_TAGEN + 60_000);
    sperreAufheben("3B"); // der Zeitraum endet jetzt weit in der Vergangenheit
    vi.setSystemTime(JETZT);
    const cls = stundeSperren("3B"); // eine neue Sperre - der alte Zeitraum muss weg sein
    expect(cls?.gesperrteZeiten).toEqual([{ abMs: JETZT, bisMs: JETZT + 60 * 60_000 }]);
  });

  it("eine unbekannte Klasse liefert null, für beide Wege", () => {
    expect(stundeSperren("NIRGENDS")).toBeNull();
    expect(sperreAufheben("NIRGENDS")).toBeNull();
  });
});

describe("★★★★★ Garbage-JSON wird vertragen (PocketBase-Zwilling, `pbBackend.ts`)", () => {
  it("mapPupil: ein kaputtes wochenzielVerlauf wird zu []", async () => {
    const be = new PocketBaseTypingBackend();
    (be as unknown as { pb: unknown }).pb = {
      filter: (s: string) => s,
      collection: () => ({
        getFullList: async () => [
          {
            id: "p1",
            name: "Mia",
            classCode: "3B",
            teacherUid: "t1",
            wochenzielVerlauf: "kaputt", // kein Array
            createdAtMs: 1,
          },
        ],
      }),
    };
    const [mia] = await be.listPupils("3B");
    expect(mia.wochenzielVerlauf).toEqual([]);
  });

  it("mapClass: kaputtes wochenzielVorgabe wird zu undefined, kaputte gesperrteZeiten-Einträge fallen einzeln weg", async () => {
    const be = new PocketBaseTypingBackend();
    (be as unknown as { pb: unknown }).pb = {
      filter: (s: string) => s,
      collection: () => ({
        getFirstListItem: async () => ({
          id: "c1",
          code: "3B",
          name: "3b",
          teacherUid: "t1",
          createdAtMs: 1,
          wochenzielVorgabe: { wochen: ["2026-W40"] }, // ohne `minuten` - ungültig
          gesperrteZeiten: [{ abMs: 1 }, "kaputt", null, { abMs: 1, bisMs: 2 }],
        }),
      }),
    };
    const cls = await be.getClass("3B");
    expect(cls?.wochenzielVorgabe).toBeUndefined();
    expect(cls?.gesperrteZeiten).toEqual([{ abMs: 1, bisMs: 2 }]);
  });

  it("mapClass: ein gültiges wochenzielVorgabe kommt vollständig durch", async () => {
    const be = new PocketBaseTypingBackend();
    (be as unknown as { pb: unknown }).pb = {
      filter: (s: string) => s,
      collection: () => ({
        getFirstListItem: async () => ({
          id: "c1",
          code: "3B",
          name: "3b",
          teacherUid: "t1",
          createdAtMs: 1,
          wochenzielVorgabe: { minuten: 60, wochen: ["2026-W40"], nachholen: true, am: 123 },
          gesperrteZeiten: [{ abMs: 1, bisMs: 2 }],
        }),
      }),
    };
    const cls = await be.getClass("3B");
    expect(cls?.wochenzielVorgabe).toEqual({
      minuten: 60,
      wochen: ["2026-W40"],
      nachholen: true,
      am: 123,
    });
    expect(cls?.gesperrteZeiten).toEqual([{ abMs: 1, bisMs: 2 }]);
  });
});
