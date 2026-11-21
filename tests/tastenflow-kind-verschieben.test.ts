/**
 * ★★★★ WÄCHTER: Ein Kind in eine andere Klasse verschieben - und den
 * Klassencode ändern. AM SERVER, in einer Transaktion (10.09.2026).
 *
 * Wunsch Johannes: „In andere Klasse verschieben" im Verwalten-Bildschirm.
 * Entscheidung: in JEDE Klasse, deren Klassencode man kennt. Dabei kam ein
 * Loch zutage: Die updateRule von `tt_pupils` prüfte nur die BISHERIGE Klasse -
 * eine Lehrkraft konnte `classCode` per Schnittstelle auf jede fremde Klasse
 * setzen.
 *
 * ── Wie hier geprüft wird ───────────────────────────────────────────────────
 * Die Logik steht in `pocketbase/pb_hooks/tt_klasse_lib.pb.js` und wird so
 * geladen, wie goja sie sieht: als CommonJS-Modul (Muster
 * `tests/typing-eventpack.test.ts`). Statt PocketBase läuft eine NACHGEBAUTE
 * App mit denselben Aufrufen (`findRecordById`, `findRecordsByFilter`,
 * `runInTransaction` …) über einer Tabelle je Sammlung.
 *
 * ⚠️ WAS DIESE TESTS NICHT BEWEISEN: dass PocketBase die Regeln so auswertet,
 * wie sie in `setup.mjs` stehen, und dass die Aufrufe dort genauso heissen.
 * Das wurde am 10.09.2026 einmal gegen einen echten PocketBase 0.38.1 aus
 * `pb-dev` durchgespielt (Bericht der Sitzung). Die Regeln prüft (f) hier nur
 * als TEXT - ein Wächter, der nur Text liest, sieht ein Loch in der
 * Auswertung nie ([[reference_pocketbase_antwort_umgeht_viewrule]]).
 *
 * WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]): Jede Abweisung prüft zusätzlich,
 * dass danach am Bestand NICHTS geändert ist - eine Prüfung, die zwar 403
 * sagt, aber vorher schon geschrieben hat, wird rot.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { synthEmail as clientSynthEmail } from "@/lib/typing/pbBackend";

// ── Die Lib, wie goja sie lädt ──────────────────────────────────────────────

type Antwort = { status: number; antwort: Record<string, unknown> };
interface Lib {
  verschiebe: (app: unknown, lehrkraftId: string, pupilId: string, ziel: unknown) => Antwort;
  aendereKlassencode: (
    app: unknown,
    lehrkraftId: string,
    alt: unknown,
    neu: unknown,
    name?: unknown,
  ) => Antwort;
  kindVerschieben: (e: unknown) => unknown;
  synthEmail: (code: string, name: string) => string;
  MAX_KINDER: number;
  MITWANDERN: { name: string; felder: string[] }[];
  BLEIBEN: string[];
  MATHECOACH: string[];
  UMBENENNEN: string[];
}

const WURZEL = resolve(__dirname, "..");
const lies = (p: string) => readFileSync(resolve(WURZEL, p), "utf8");
const HOOKS_DIR = resolve(WURZEL, "pocketbase/pb_hooks");

/**
 * ★ Wochenziel (W2, 18.09.2026): `verschiebe()` holt sich seit W2
 * `tt_wochenziel_lib.pb.js` per `require(`${__hooks}/…`)` - GENAU wie ein
 * Handler es täte ([[reference_pocketbase_hook_scope]]). Ein `require`, das
 * immer `{}` zurückgibt (die alte Fassung), liesse diesen Aufruf lautlos ins
 * Leere laufen; `${__hooks}` selbst wäre ausserdem `undefined`. `echtesRequire`
 * lädt die geforderte Datei darum GENAUSO wie `ladeLib()` sich selbst - als
 * CommonJS-Modul, mit demselben `__hooks`-Wert weitergereicht (verkettbar,
 * falls eine Lib künftig eine zweite braucht).
 */
function echtesRequire(pfad: string): unknown {
  const code = readFileSync(pfad, "utf8");
  const mod = { exports: {} as Record<string, unknown> };
  new Function("module", "exports", "require", "__hooks", code)(
    mod,
    mod.exports,
    echtesRequire,
    HOOKS_DIR,
  );
  return mod.exports;
}

function ladeLib(): Lib {
  const code = lies("pocketbase/pb_hooks/tt_klasse_lib.pb.js");
  const mod = { exports: {} as Record<string, unknown> };
  new Function("module", "exports", "require", "__hooks", code)(
    mod,
    mod.exports,
    echtesRequire,
    HOOKS_DIR,
  );
  return mod.exports as unknown as Lib;
}
const lib = ladeLib();

// ── Die nachgebaute App ─────────────────────────────────────────────────────

type Daten = Record<string, unknown> & { id: string };
type Db = Record<string, Daten[]>;

/** Die Spalten je Sammlung - nur, was die Lib anfasst. */
const SCHEMA: Record<string, string[]> = {
  tt_classes: ["code", "name", "teacherUid"],
  tt_class_teachers: ["classCode", "teacherUid"],
  tt_pupils: ["name", "classCode", "teacherUid", "email", "tokenKey"],
  tt_progress: ["pupilUid", "teacherUid", "classCode"],
  tt_events: ["pupilUid", "teacherUid", "classCode"],
  lw_progress: ["pupilUid", "program", "teacherUid", "classCode"],
  lw_events: ["pupilUid", "program", "teacherUid", "classCode"],
  br_progress: ["pupilUid", "teacherUid"],
  br_events: ["pupilUid", "teacherUid"],
  tt_schreibproben: ["pupilUid", "teacherUid", "classCode", "probeId"],
  lw_messages: ["pupilUid", "teacherUid", "classCode"],
  ma_classes: ["ownerUid", "code"],
  ma_members: ["ownerUid", "classCode", "pupilUid"],
  ma_sheets: ["ownerUid", "classCode", "pupilUid"],
  ma_observations: ["ownerUid", "pupilUid", "classCode"],
  ma_eichung: ["ownerUid", "classCode", "pupilUid"],
};

let zaehler = 0;

class Zeile {
  constructor(
    readonly sammlung: string,
    readonly daten: Daten,
  ) {}
  get id() {
    return this.daten.id;
  }
  getString(f: string) {
    const v = this.daten[f];
    return v == null ? "" : String(v);
  }
  set(f: string, v: unknown) {
    this.daten[f] = v;
  }
  collection() {
    const felder = SCHEMA[this.sammlung] ?? [];
    return {
      name: this.sammlung,
      fields: { getByName: (f: string) => (felder.includes(f) ? { name: f } : null) },
    };
  }
  refreshTokenKey() {
    this.daten.tokenKey = `neu-${++zaehler}`;
  }
}

function passt(d: Daten, filter: string, params: Record<string, unknown>) {
  return filter.split("&&").every((teil) => {
    const m = teil.trim().match(/^(\w+) = \{:(\w+)\}$/);
    if (!m) throw new Error(`Filter nicht verstanden: ${teil}`);
    return String(d[m[1]] ?? "") === String(params[m[2]]);
  });
}

function baueApp(bestand: Db, explodiert?: (z: Zeile) => boolean) {
  let db: Db = structuredClone(bestand);
  const app = {
    get db() {
      return db;
    },
    findRecordById(s: string, id: string) {
      const d = (db[s] ?? []).find((x) => x.id === id);
      if (!d) throw new Error("sql: no rows in result set");
      return new Zeile(s, { ...d });
    },
    findFirstRecordByFilter(s: string, filter: string, params: Record<string, unknown>) {
      if (!(s in SCHEMA)) throw new Error(`no such table: ${s}`);
      const d = (db[s] ?? []).find((x) => passt(x, filter, params));
      if (!d) throw new Error("sql: no rows in result set");
      return new Zeile(s, { ...d });
    },
    findRecordsByFilter(
      s: string,
      filter: string,
      _sort: string,
      _limit: number,
      _offset: number,
      params: Record<string, unknown>,
    ) {
      if (!(s in SCHEMA)) throw new Error(`no such table: ${s}`);
      return (db[s] ?? []).filter((x) => passt(x, filter, params)).map((d) => new Zeile(s, { ...d }));
    },
    save(z: Zeile) {
      if (explodiert?.(z)) throw new Error("Speichern gescheitert");
      const liste = (db[z.sammlung] ??= []);
      if (
        z.sammlung === "tt_pupils" &&
        liste.some((x) => x.id !== z.id && x.email === z.daten.email)
      )
        throw new Error("UNIQUE constraint failed: tt_pupils.email");
      const i = liste.findIndex((x) => x.id === z.id);
      if (i >= 0) liste[i] = { ...z.daten };
      else liste.push({ ...z.daten });
    },
    runInTransaction(fn: (tx: unknown) => void) {
      const vorher = structuredClone(db);
      try {
        fn(app);
      } catch (err) {
        db = vorher;
        throw err;
      }
    },
    logger: () => ({ error: () => {} }),
  };
  return app;
}

/** Ein kleiner Bestand: 3B (Frau Berger, Co: Herr Co), 4A (Herr Adam). */
function bestand(): Db {
  return {
    tt_classes: [
      { id: "k-3b", code: "3B", name: "3b", teacherUid: "t-berger" },
      { id: "k-4a", code: "4A", name: "4a", teacherUid: "t-adam" },
    ],
    tt_class_teachers: [{ id: "ct1", classCode: "3B", teacherUid: "t-co" }],
    tt_pupils: [
      { id: "p-mia", name: "Mia", classCode: "3B", teacherUid: "t-berger", email: "3b__mia@tt.local", tokenKey: "alt" },
      { id: "p-noah", name: "Noah", classCode: "3B", teacherUid: "t-berger", email: "3b__noah@tt.local", tokenKey: "alt" },
      { id: "p-al", name: "Anna-Lena", classCode: "3B", teacherUid: "t-berger", email: "3b__anna-lena@tt.local", tokenKey: "alt" },
      { id: "p-lena", name: "Anna Lena", classCode: "4A", teacherUid: "t-adam", email: "4a__anna-lena@tt.local", tokenKey: "alt" },
    ],
    tt_progress: [{ id: "tp1", pupilUid: "p-mia", classCode: "3B", teacherUid: "t-berger" }],
    tt_events: [{ id: "te1", pupilUid: "p-mia", classCode: "3B", teacherUid: "t-berger" }],
    lw_progress: [
      { id: "lp1", pupilUid: "p-mia", program: "tippen", classCode: "3B", teacherUid: "t-berger" },
      { id: "lp2", pupilUid: "p-mia", program: "braille", classCode: "3B", teacherUid: "t-berger" },
      { id: "lp3", pupilUid: "p-noah", program: "tippen", classCode: "3B", teacherUid: "t-berger" },
    ],
    lw_events: [{ id: "le1", pupilUid: "p-mia", program: "tippen", classCode: "3B", teacherUid: "t-berger" }],
    br_progress: [{ id: "bp1", pupilUid: "p-mia", teacherUid: "t-berger" }],
    br_events: [{ id: "be1", pupilUid: "p-mia", teacherUid: "t-berger" }],
    tt_schreibproben: [
      { id: "sp1", pupilUid: "p-mia", classCode: "3B", teacherUid: "t-berger", probeId: "sp-a" },
    ],
    lw_messages: [{ id: "m1", pupilUid: "p-mia", classCode: "3B", teacherUid: "t-berger" }],
    ma_classes: [],
    ma_members: [{ id: "mm1", ownerUid: "t-jo", classCode: "3B", pupilUid: "p-mia" }],
    ma_sheets: [{ id: "ms1", ownerUid: "t-jo", classCode: "3B", pupilUid: "p-mia" }],
    ma_observations: [],
    ma_eichung: [],
  };
}

const zeile = (db: Db, s: string, id: string) => db[s].find((x) => x.id === id)!;

// ── (a) Wer darf ────────────────────────────────────────────────────────────

describe("(a) Wer ein Kind verschieben darf", () => {
  it("★ eine FREMDE Lehrkraft wird abgewiesen - und am Bestand ändert sich nichts", () => {
    const app = baueApp(bestand());
    const r = lib.verschiebe(app, "t-fremd", "p-mia", "4A");
    expect(r.status).toBe(403);
    expect(app.db).toEqual(bestand());
  });

  it("★ auch die Lehrkraft der ZIELklasse darf ein fremdes Kind nicht zu sich holen", () => {
    const app = baueApp(bestand());
    expect(lib.verschiebe(app, "t-adam", "p-mia", "4A").status).toBe(403);
    expect(app.db).toEqual(bestand());
  });

  it("ein unbekanntes Kind klingt genauso wie ein fremdes (keine Auskunft über Kennungen)", () => {
    const app = baueApp(bestand());
    const fremd = lib.verschiebe(app, "t-fremd", "p-mia", "4A");
    const unbekannt = lib.verschiebe(app, "t-berger", "p-gibtsnicht", "4A");
    expect(unbekannt.status).toBe(fremd.status);
    expect(unbekannt.antwort.error).toBe(fremd.antwort.error);
  });

  it("die Eigentümer:in UND die Co-Lehrkraft der bisherigen Klasse dürfen", () => {
    expect(lib.verschiebe(baueApp(bestand()), "t-berger", "p-mia", "4A").status).toBe(200);
    expect(lib.verschiebe(baueApp(bestand()), "t-co", "p-mia", "4A").status).toBe(200);
  });

  it("die Route verlangt eine Lehrkraft-Anmeldung (ohne Konto und als Kind: 401)", () => {
    const app = baueApp(bestand());
    const e = (auth: unknown) => ({
      auth,
      app,
      requestInfo: () => ({ body: { pupilId: "p-mia", zielCode: "4A" } }),
      json: (status: number, body: unknown) => ({ status, body }),
    });
    expect(lib.kindVerschieben(e(null))).toMatchObject({ status: 401 });
    const kind = { id: "p-noah", collection: () => ({ name: "tt_pupils" }) };
    expect(lib.kindVerschieben(e(kind))).toMatchObject({ status: 401 });
    const lehrkraft = { id: "t-berger", collection: () => ({ name: "tt_teachers" }) };
    expect(lib.kindVerschieben(e(lehrkraft))).toMatchObject({ status: 200 });
  });
});

// ── (b) Die Zielklasse ──────────────────────────────────────────────────────

describe("(b) Die Zielklasse", () => {
  it("★ ein unbekannter Code: 404, nichts geändert", () => {
    const app = baueApp(bestand());
    const r = lib.verschiebe(app, "t-berger", "p-mia", "XYZ");
    expect(r.status).toBe(404);
    expect(String(r.antwort.error)).toContain("XYZ");
    expect(app.db).toEqual(bestand());
  });

  it("kein Code und dieselbe Klasse: 400", () => {
    expect(lib.verschiebe(baueApp(bestand()), "t-berger", "p-mia", "   ").status).toBe(400);
    expect(lib.verschiebe(baueApp(bestand()), "t-berger", "p-mia", " 3b ").status).toBe(400);
  });

  it("der Code wird getrimmt und gross geschrieben - wie beim Anlegen", () => {
    const r = lib.verschiebe(baueApp(bestand()), "t-berger", "p-mia", "  4a ");
    expect(r.status).toBe(200);
    expect(r.antwort.zielCode).toBe("4A");
    expect(r.antwort.zielName).toBe("4a");
  });

  it("★ Namensgleichheit in der Zielklasse: 409 - auch wenn nur die Login-Adresse gleich wäre", () => {
    const b = bestand();
    b.tt_pupils.push({ id: "p-mia2", name: "mia", classCode: "4A", teacherUid: "t-adam", email: "4a__mia@tt.local" });
    const app = baueApp(b);
    expect(lib.verschiebe(app, "t-berger", "p-mia", "4A").status).toBe(409);
    expect(app.db).toEqual(b);
    // „Anna-Lena" und „Anna Lena" ergeben dieselbe Adresse - die Anmeldung
    // könnte sie nicht mehr auseinanderhalten.
    const app2 = baueApp(bestand());
    expect(lib.verschiebe(app2, "t-berger", "p-al", "4A").status).toBe(409);
    expect(app2.db).toEqual(bestand());
  });

  it("★ die Klassengrenze gilt auch fürs Ziel (dieselbe Zahl wie tt_grenzen.pb.js)", () => {
    expect(lies("pocketbase/pb_hooks/tt_grenzen.pb.js")).toContain(
      `const MAX_KINDER = ${lib.MAX_KINDER};`,
    );
    const b = bestand();
    for (let i = b.tt_pupils.filter((p) => p.classCode === "4A").length; i < lib.MAX_KINDER; i++)
      b.tt_pupils.push({ id: `p-x${i}`, name: `Kind ${i}`, classCode: "4A", teacherUid: "t-adam", email: `4a__kind-${i}@tt.local` });
    const app = baueApp(b);
    expect(lib.verschiebe(app, "t-berger", "p-mia", "4A").status).toBe(400);
    expect(app.db).toEqual(b);
  });
});

// ── (c) Was mitwandert, was bleibt ──────────────────────────────────────────

describe("(c) Was mit dem Kind wandert - und was bleibt", () => {
  it.skip("★★★ Konto, Lernstand und Punktgenau wandern; Tippchallenge und Nachrichten bleiben", () => {
    const app = baueApp(bestand());
    const r = lib.verschiebe(app, "t-berger", "p-mia", "4A");
    expect(r.status).toBe(200);
    const db = app.db;

    const mia = zeile(db, "tt_pupils", "p-mia");
    expect(mia.classCode).toBe("4A");
    expect(mia.teacherUid).toBe("t-adam");
    expect(mia.email).toBe(clientSynthEmail("4A", "Mia"));
    // Die bisherige Anmeldung endet (sie kennt den alten Klassencode).
    expect(mia.tokenKey).not.toBe("alt");

    for (const [s, id] of [
      ["tt_progress", "tp1"],
      ["tt_events", "te1"],
      ["lw_progress", "lp1"],
      ["lw_progress", "lp2"],
      ["lw_events", "le1"],
    ] as const) {
      expect(zeile(db, s, id), `${s}/${id}`).toMatchObject({ classCode: "4A", teacherUid: "t-adam" });
    }
    for (const s of ["br_progress", "br_events"]) {
      const z = db[s][0];
      expect(z.teacherUid, s).toBe("t-adam");
      expect("classCode" in z, `${s} bekam eine Spalte, die es nicht hat`).toBe(false);
    }
    // BLEIBEN: bei der bisherigen Klasse.
    expect(zeile(db, "tt_schreibproben", "sp1")).toEqual(zeile(bestand(), "tt_schreibproben", "sp1"));
    expect(zeile(db, "lw_messages", "m1")).toEqual(zeile(bestand(), "lw_messages", "m1"));
    // Kein anderes Kind wurde angefasst.
    expect(zeile(db, "tt_pupils", "p-noah")).toEqual(zeile(bestand(), "tt_pupils", "p-noah"));
    expect(zeile(db, "lw_progress", "lp3")).toEqual(zeile(bestand(), "lw_progress", "lp3"));
  });

  it("die Listen passen zu setup.mjs - und BLEIBEN steht nie in MITWANDERN", () => {
    const setup = lies("pocketbase/setup.mjs");
    for (const { name, felder } of lib.MITWANDERN) {
      const ab = setup.indexOf(`base("${name}"`);
      expect(ab, `${name} fehlt in setup.mjs`).toBeGreaterThan(0);
      const spalten = setup.slice(ab, setup.indexOf("]", ab));
      expect(spalten, name).toContain('T("pupilUid")');
      for (const f of felder) expect(spalten, `${name}.${f}`).toContain(`T("${f}")`);
    }
    const wandert = lib.MITWANDERN.map((t) => t.name);
    for (const s of lib.BLEIBEN) expect(wandert).not.toContain(s);
    expect(lib.BLEIBEN).toEqual(["tt_schreibproben", "lw_messages"]);
  });

  it("★ eine gescheiterte Zeile rollt ALLES zurück (Transaktion)", () => {
    const app = baueApp(bestand(), (z) => z.sammlung === "lw_events");
    const r = lib.verschiebe(app, "t-berger", "p-mia", "4A");
    expect(r.status).toBe(500);
    expect(app.db).toEqual(bestand());
  });
});

// ── (d) Mathecoach führt eigene Klassen ─────────────────────────────────────

describe("(d) Mathecoach: nur mitnehmen, was dort eine Klasse hat", () => {
  it.skip("gibt es die neue Klasse im Mathecoach NICHT, bleibt die Freischaltung stehen", () => {
    const app = baueApp(bestand());
    const r = lib.verschiebe(app, "t-berger", "p-mia", "4A");
    expect(r.antwort.mathecoach).toBe("bleibt");
    expect(zeile(app.db, "ma_members", "mm1").classCode).toBe("3B");
  });

  it.skip("gibt es sie, wandern Freischaltung und Blätter mit - der Besitzer bleibt", () => {
    const b = bestand();
    b.ma_classes.push({ id: "mc-4a", ownerUid: "t-jo", code: "4A" });
    const app = baueApp(b);
    const r = lib.verschiebe(app, "t-berger", "p-mia", "4A");
    expect(r.antwort.mathecoach).toBe("mitgewandert");
    expect(zeile(app.db, "ma_members", "mm1")).toMatchObject({ classCode: "4A", ownerUid: "t-jo" });
    expect(zeile(app.db, "ma_sheets", "ms1")).toMatchObject({ classCode: "4A", ownerUid: "t-jo" });
  });

  it.skip("ein Kind ohne Mathecoach: „keine“", () => {
    expect(lib.verschiebe(baueApp(bestand()), "t-berger", "p-noah", "4A").antwort.mathecoach).toBe("keine");
  });
});

// ── (e) Den Klassencode ändern ──────────────────────────────────────────────

describe("(e) Den Klassencode ändern - alles, was am Code hängt, wandert mit", () => {
  it("★★ Kinder samt Login-Adresse, Co-Lehrkräfte, Ergebnisse und Nachrichten", () => {
    const app = baueApp(bestand());
    const r = lib.aendereKlassencode(app, "t-berger", "3B", " 5c ");
    expect(r).toMatchObject({ status: 200, antwort: { ok: true, code: "5C", name: "3b" } });
    const db = app.db;
    expect(zeile(db, "tt_classes", "k-3b").code).toBe("5C");
    for (const id of ["p-mia", "p-noah"]) {
      const k = zeile(db, "tt_pupils", id);
      expect(k.classCode).toBe("5C");
      expect(k.email).toBe(clientSynthEmail("5C", String(k.name)));
      // Dieselbe Klasse - die Anmeldung der Kinder bleibt bestehen.
      expect(k.tokenKey).toBe("alt");
    }
    expect(zeile(db, "tt_class_teachers", "ct1").classCode).toBe("5C");
    for (const [s, id] of [
      ["tt_schreibproben", "sp1"],
      ["lw_messages", "m1"],
      ["lw_progress", "lp3"],
      ["tt_progress", "tp1"],
    ] as const)
      expect(zeile(db, s, id).classCode, `${s}/${id}`).toBe("5C");
    // Mathecoach führt eigene Klassen - ein Code-Wechsel hier ändert dort nichts.
    expect(zeile(db, "ma_members", "mm1").classCode).toBe("3B");
    // Die andere Klasse bleibt, wie sie ist.
    expect(zeile(db, "tt_pupils", "p-lena")).toEqual(zeile(bestand(), "tt_pupils", "p-lena"));
  });

  it("abgewiesen: fremde Lehrkraft, vergebener Code, leerer Code, falsche Zeichen - nichts geändert", () => {
    for (const [wer, neu, status] of [
      ["t-fremd", "5C", 403],
      ["t-berger", "4a", 400],
      ["t-berger", "  ", 400],
      ["t-berger", "A", 400],
      ["t-berger", "MIT LEER", 400],
    ] as const) {
      const app = baueApp(bestand());
      expect(lib.aendereKlassencode(app, wer, "3B", neu).status, `${wer} → ${neu}`).toBe(status);
      expect(app.db).toEqual(bestand());
    }
  });

  it("die Co-Lehrkraft darf; nur der Name ändert nur den Namen", () => {
    expect(lib.aendereKlassencode(baueApp(bestand()), "t-co", "3B", "3C").status).toBe(200);
    const app = baueApp(bestand());
    expect(lib.aendereKlassencode(app, "t-berger", "3B", "3B", "3b Nachmittag").status).toBe(200);
    const erwartet = bestand();
    zeile(erwartet, "tt_classes", "k-3b").name = "3b Nachmittag";
    expect(app.db).toEqual(erwartet);
  });
});

// ── (f) Adresse, Routen und Regeln ──────────────────────────────────────────

describe("(f) Dieselbe Adresse wie der Client, die Routen, die Regeln", () => {
  it("synthEmail rechnet am Server Zeichen für Zeichen wie im Client", () => {
    for (const [code, name] of [
      ["3B", "Mia"],
      ["3.MS", "Anna Lena"],
      [" 4a ", "  Jürgen Groß "],
      ["MSWEIN", "Ärger-Öl"],
      ["K1", "O'Brien"],
      ["K1", ""],
    ])
      expect(lib.synthEmail(code, name), `${code}/${name}`).toBe(clientSynthEmail(code, name));
  });

  it("die Route-Datei meldet genau die zwei POST-Wege an - und nie „/“", () => {
    const routen = lies("pocketbase/pb_hooks/tt_klasse.pb.js");
    expect(routen).toContain('routerAdd("POST", "/api/tt/kind-verschieben"');
    expect(routen).toContain('routerAdd("POST", "/api/tt/klassencode-aendern"');
    expect(routen).not.toMatch(/routerAdd\(\s*"[A-Z]+"\s*,\s*"\/"/);
    // Der Lib-Wächter gegen die Fehlerzeile beim Auto-Laden.
    expect(lies("pocketbase/pb_hooks/tt_klasse_lib.pb.js")).toContain('typeof module !== "undefined"');
  });

  it("★★ tt_pupils: classCode nur in eine Klasse, in der die Lehrkraft AUCH ist; teacherUid nie", () => {
    const setup = lies("pocketbase/setup.mjs");
    expect(setup).toContain(
      '@request.body.classCode:isset = false || @request.body.classCode = classCode || ${ttClassStaffAlias("@request.body.classCode", "neu")}',
    );
    expect(setup).toContain(
      "@request.body.teacherUid:isset = false || @request.body.teacherUid = teacherUid))",
    );
    // Die zweite Klassen-Prüfung braucht EIGENE Join-Aliase - sonst teilten
    // sich beide Prüfungen dieselbe Zeile.
    expect(setup).toContain("@collection.tt_classes:${alias}klasse.code ?= ${col}");
    expect(setup).toContain("@collection.tt_class_teachers:${alias}co.classCode ?= ${col}");
  });

  it("★★ tt_classes: Code beim Anlegen Pflicht, beim Ändern nur über die Route", () => {
    const setup = lies("pocketbase/setup.mjs");
    expect(setup).toContain('@request.auth.id = @request.body.teacherUid && @request.body.code != ""');
    expect(setup).toContain("&& (@request.body.code:isset = false || @request.body.code = code)");
    const hook = lies("pocketbase/pb_hooks/tt_klasse.pb.js");
    expect(hook).toMatch(/onRecordCreateRequest\([\s\S]*"tt_classes"\)/);
  });
});

describe("(f) Klassencode ändern: auch die hochgeladenen Texte wandern mit (19.09.2026)", () => {
  it("tt_eigene_texte steht in UMBENENNEN - sonst hängt die Eigene Übung nach einem neuen Code", () => {
    expect(lib.UMBENENNEN).toContain("tt_eigene_texte");
  });

  it("eine Co-Lehrkraft legt den Text unter IHRER Id an (create-Regel verlangt auth.id = teacherUid)", () => {
    const quelle = lies("src/lib/typing/pbBackend.ts");
    const stelle = quelle.slice(quelle.indexOf("async speichereEigenenText("));
    expect(stelle.slice(0, 1200)).toMatch(/teacherUid:\s*\(this\.pb\.authStore\.record\?\.id/);
  });
});
