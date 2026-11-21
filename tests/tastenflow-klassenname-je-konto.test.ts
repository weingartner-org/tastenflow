/**
 * ★★★★★ WÄCHTER: Klassenname nur JE KONTO eindeutig, nicht global
 * (20.09.2026, Auftrag Testerin Punkt 1).
 *
 * Johannes, wörtlich: „Ich habe mir eine Testklasse angelegt. Der Name 'Test'
 * war bereits vergeben. Allerdings nicht von mir. […] Für meinen Account
 * sollte es eindeutig sein, aber wenn jemand in Berlin seine Klasse genauso
 * nennt, juckt mich das ja nicht."
 *
 * ── Was gemessen wurde, bevor etwas geändert wurde ──────────────────────────
 * Eine echte Namensprüfung gab es davor GAR NICHT - weder global noch je
 * Konto: `pocketbase/setup.mjs` trägt an `tt_classes` nur EINEN eindeutigen
 * Index, `idx_tt_class_code` auf das Feld `code`; kein Hook und keines der
 * drei Backends (`pbBackend.ts`, `backend.ts`, `account.ts`) verglich den
 * NAMEN zweier Klassen. Was Johannes wirklich traf: Die Oberfläche schlägt
 * den Klassencode AUS DEM NAMEN vor (`klassencodeVorschlag`, „Test" → „TEST"),
 * und GENAU DIESER Code ist global eindeutig - eine andere Lehrkraft hatte
 * „TEST" längst belegt.
 *
 * Der Klassencode BLEIBT global eindeutig (er ist der Anmelde-Schlüssel der
 * Kinder, `idx_tt_class_code` unverändert). NEU ist die von Johannes
 * gewünschte Prüfung: derselbe NAME zweimal bei DERSELBEN Lehrkraft bekommt
 * eine klare Meldung; zwei verschiedene Lehrkräfte dürfen beide „Test" heissen.
 *
 * Zwei Ebenen, die einander nicht kennen ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]):
 *  1. Der lokale/Offline-Pfad `account.ts` (`createClass`) - hier direkt
 *     geprüft, ohne Server.
 *  2. Der Server-Hook `tt_klasse_lib.pb.js` (`nameSchonVergeben`) - geladen
 *     wie goja es täte (Muster `tests/tastenflow-kind-verschieben.test.ts`),
 *     mit einer nachgebauten App statt eines echten PocketBase.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, beforeEach } from "vitest";
import { ClientResponseError } from "pocketbase";
import { createClass, registerTeacher, updateClass } from "../src/lib/typing";
import { PocketBaseTypingBackend } from "@/lib/typing/pbBackend";
import { naechsterKlassencodeVersuch } from "@/lib/lernwerkstatt/klassencode";

beforeEach(() => {
  localStorage.clear();
});

describe("account.ts (lokaler/Offline-Pfad) — Klassenname nur je Konto eindeutig", () => {
  it("zwei VERSCHIEDENE Lehrkräfte dürfen beide 'Test' heissen", () => {
    const berlin = registerTeacher("Frau Berlin", "berlin@schule.de", "geheim1");
    const wien = registerTeacher("Herr Wien", "wien@schule.at", "geheim1");
    if (!berlin.ok || !wien.ok) throw new Error("Konten konnten nicht angelegt werden");

    const a = createClass(berlin.value.id, "Test", "BERLIN1");
    const b = createClass(wien.value.id, "Test", "WIEN1");

    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
    if (a.ok && b.ok) {
      expect(a.value.name).toBe("Test");
      expect(b.value.name).toBe("Test");
      // Der Klassencode bleibt der Schlüssel und unterscheidet die beiden.
      expect(a.value.code).not.toBe(b.value.code);
    }
  });

  it("DIESELBE Lehrkraft bekommt beim zweiten 'Test' eine klare Meldung, nichts wird angelegt", () => {
    const johannes = registerTeacher("Johannes", "johannes@schule.at", "geheim1");
    if (!johannes.ok) throw new Error("Konto konnte nicht angelegt werden");

    const erste = createClass(johannes.value.id, "Test", "TEST1");
    expect(erste.ok).toBe(true);

    const zweite = createClass(johannes.value.id, "Test", "TEST2");
    expect(zweite).toEqual({
      ok: false,
      error: "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.",
    });
  });

  it("der Vergleich ignoriert Gross-/Kleinschreibung (dieselbe Bauart wie bei Kindernamen)", () => {
    const t = registerTeacher("Frau Klein", "klein@schule.at", "geheim1");
    if (!t.ok) throw new Error("Konto konnte nicht angelegt werden");
    createClass(t.value.id, "Test", "T1");
    const r = createClass(t.value.id, "TEST", "T2");
    expect(r.ok).toBe(false);
  });

  it("ein anderer Klassenname bei derselben Lehrkraft geht weiterhin durch", () => {
    const t = registerTeacher("Frau Klein", "klein@schule.at", "geheim1");
    if (!t.ok) throw new Error("Konto konnte nicht angelegt werden");
    createClass(t.value.id, "Test", "T1");
    const r = createClass(t.value.id, "Test 2", "T2");
    expect(r.ok).toBe(true);
  });
});

/**
 * ★★★★★ NACHBESSERUNG 20.09.2026 - der eigentliche Schmerz: Johannes' Satz
 * wörtlich „Das Programm kann ja eine Nummer vergeben und damit arbeiten."
 * Die Namenssperre oben löst nur SEIN eigenes Doppelt-Anlegen - sein
 * ursprüngliches Anliegen (eine Klasse „Test" anlegen können, obwohl „TEST"
 * als CODE einer FREMDEN Lehrkraft gehört) sass beim Codevorschlag. Getestet
 * am lokalen/Offline-Pfad (`account.ts`), wo die Kollision ohne Mock
 * entsteht: zwei Lehrkräfte, eine hat "TEST" schon.
 */
describe("account.ts — der Codevorschlag weicht einer Kollision selbst aus", () => {
  it("Vorschlag (codeAutoVorschlag=true): 'TEST' belegt ⇒ 'TEST2' wird genommen, der Name bleibt 'Test'", () => {
    const fremd = registerTeacher("Frau Fremd", "fremd@schule.de", "geheim1");
    const johannes = registerTeacher("Johannes", "johannes2@schule.at", "geheim1");
    if (!fremd.ok || !johannes.ok) throw new Error("Konten konnten nicht angelegt werden");
    // Eine fremde Lehrkraft belegt den Code, den der Namensvorschlag träfe.
    const belegt = createClass(fremd.value.id, "Fremde Klasse", "TEST");
    expect(belegt.ok).toBe(true);

    const r = createClass(johannes.value.id, "Test", "TEST", undefined, true);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.name).toBe("Test"); // der NAME bleibt unangetastet
      expect(r.value.code).toBe("TEST2"); // nur der Code weicht aus
    }
  });

  it("selbst getippter Code (codeAutoVorschlag NICHT gesetzt): 'TEST' belegt ⇒ klare Absage, KEIN Ausweichen", () => {
    const fremd = registerTeacher("Frau Fremd", "fremd2@schule.de", "geheim1");
    const johannes = registerTeacher("Johannes", "johannes3@schule.at", "geheim1");
    if (!fremd.ok || !johannes.ok) throw new Error("Konten konnten nicht angelegt werden");
    createClass(fremd.value.id, "Fremde Klasse", "TEST");

    const r = createClass(johannes.value.id, "Test", "TEST"); // codeAutoVorschlag weggelassen
    expect(r).toEqual({
      ok: false,
      error:
        "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).",
    });
  });

  it("mehrere Kollisionen hintereinander: 'TEST', 'TEST2' UND 'TEST3' belegt ⇒ 'TEST4'", () => {
    const a = registerTeacher("A", "a@schule.de", "geheim1");
    const b = registerTeacher("Johannes", "johannes4@schule.at", "geheim1");
    if (!a.ok || !b.ok) throw new Error("Konten konnten nicht angelegt werden");
    createClass(a.value.id, "X1", "TEST");
    createClass(a.value.id, "X2", "TEST2");
    createClass(a.value.id, "X3", "TEST3");

    const r = createClass(b.value.id, "Test", "TEST", undefined, true);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.code).toBe("TEST4");
  });
});

describe("naechsterKlassencodeVersuch (klassencode.ts) - reine Funktion", () => {
  it("hängt die Zahl an", () => {
    expect(naechsterKlassencodeVersuch("TEST", 2)).toBe("TEST2");
    expect(naechsterKlassencodeVersuch("TEST", 3)).toBe("TEST3");
  });

  it("kürzt die BASIS vorne, wenn 12 Zeichen (KLASSENCODE_MAX) sonst überschritten würden", () => {
    // 12 Zeichen Basis + "2" wären 13 - die Zahl bleibt, die Basis verliert
    // ihr ERSTES Zeichen.
    const basis = "ABCDEFGHIJKL"; // 12 Zeichen
    const ergebnis = naechsterKlassencodeVersuch(basis, 2);
    expect(ergebnis).toBe("BCDEFGHIJKL2");
    expect(ergebnis.length).toBe(12);
  });
});

/**
 * ★★★★★ NACHBESSERUNG 20.09.2026 (offener Punkt 4 aus der ersten Fassung):
 * Umbenennen prüft jetzt genauso wie das Anlegen.
 */
describe("account.ts updateClass — Umbenennen prüft den Namen ebenso je Konto", () => {
  it("Umbenennen auf einen bei DERSELBEN Lehrkraft schon belegten Namen wird abgewiesen", () => {
    const t = registerTeacher("Frau Um", "um@schule.at", "geheim1");
    if (!t.ok) throw new Error("Konto konnte nicht angelegt werden");
    createClass(t.value.id, "3a", "C3A");
    const zweite = createClass(t.value.id, "3b", "C3B");
    if (!zweite.ok) throw new Error("Klasse konnte nicht angelegt werden");

    const r = updateClass("C3B", t.value.id, { name: "3a" });
    expect(r).toEqual({
      ok: false,
      error: "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.",
    });
  });

  it("Umbenennen auf den EIGENEN, unveränderten Namen geht durch", () => {
    const t = registerTeacher("Frau Um", "um2@schule.at", "geheim1");
    if (!t.ok) throw new Error("Konto konnte nicht angelegt werden");
    createClass(t.value.id, "3a", "C3A2");

    const r = updateClass("C3A2", t.value.id, { name: "3a", code: "C3A2NEU" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.name).toBe("3a");
  });

  it("derselbe Name bei einer ANDEREN Lehrkraft bleibt beim Umbenennen unberührt", () => {
    const t1 = registerTeacher("Frau Eins", "eins@schule.at", "geheim1");
    const t2 = registerTeacher("Frau Zwei", "zwei@schule.at", "geheim1");
    if (!t1.ok || !t2.ok) throw new Error("Konten konnten nicht angelegt werden");
    createClass(t1.value.id, "3a", "T1A");
    const eigene = createClass(t2.value.id, "3b", "T2B");
    if (!eigene.ok) throw new Error("Klasse konnte nicht angelegt werden");

    const r = updateClass("T2B", t2.value.id, { name: "3a" });
    expect(r.ok).toBe(true);
  });
});

// ── Der Server-Hook, wie goja ihn lädt (Muster tastenflow-kind-verschieben) ──

interface Lib {
  nameSchonVergeben: (
    app: unknown,
    teacherUid: string,
    name: string,
    ausgenommenId?: string,
  ) => boolean;
}

const WURZEL = resolve(__dirname, "..");
const HOOKS_DIR = resolve(WURZEL, "pocketbase/pb_hooks");

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
  const code = readFileSync(resolve(WURZEL, "pocketbase/pb_hooks/tt_klasse_lib.pb.js"), "utf8");
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

type Zeile = { id: string; teacherUid: string; name: string };

/** Eine nachgebaute App, die nur `findRecordsByFilter` auf `tt_classes` kennt. */
function baueApp(klassen: Zeile[]) {
  return {
    findRecordsByFilter(
      s: string,
      filter: string,
      _sort: string,
      _limit: number,
      _offset: number,
      params: Record<string, unknown>,
    ) {
      if (s !== "tt_classes") throw new Error(`no such table: ${s}`);
      const m = filter.match(/^teacherUid = \{:(\w+)\}$/);
      if (!m) throw new Error(`Filter nicht verstanden: ${filter}`);
      const gesucht = String(params[m[1]]);
      return klassen
        .filter((k) => k.teacherUid === gesucht)
        .map((k) => ({
          id: k.id,
          getString: (f: string) => (f === "name" ? k.name : f === "teacherUid" ? k.teacherUid : ""),
        }));
    },
  };
}

describe("tt_klasse_lib.pb.js (Server-Hook) — nameSchonVergeben", () => {
  const bestand: Zeile[] = [
    { id: "k1", teacherUid: "t-berlin", name: "Test" },
    { id: "k2", teacherUid: "t-wien", name: "3a" },
  ];

  it("derselbe Name bei einer ANDEREN Lehrkraft ist frei", () => {
    const app = baueApp(bestand);
    expect(lib.nameSchonVergeben(app, "t-wien", "Test")).toBe(false);
  });

  it("derselbe Name bei DERSELBEN Lehrkraft ist vergeben", () => {
    const app = baueApp(bestand);
    expect(lib.nameSchonVergeben(app, "t-berlin", "Test")).toBe(true);
    expect(lib.nameSchonVergeben(app, "t-berlin", "test")).toBe(true); // ohne Gross-/Kleinschreibung
  });

  it("ohne Namen oder ohne Eigentümer:in wird nichts geprüft", () => {
    const app = baueApp(bestand);
    expect(lib.nameSchonVergeben(app, "t-berlin", "")).toBe(false);
    expect(lib.nameSchonVergeben(app, "", "Test")).toBe(false);
  });

  /*
    ★ Nachbesserung 20.09.2026 (Punkt 4): `ausgenommenId` fürs Umbenennen -
    die eigene Klasse zählt nicht als Doppelung ihres eigenen Namens.
  */
  it("mit ausgenommenId: die EIGENE Klasse zählt nicht als Doppelung", () => {
    const app = baueApp(bestand);
    // k1 heisst schon "Test" bei t-berlin - sich selbst umzubenennen (auf
    // denselben Namen) ist keine Doppelung.
    expect(lib.nameSchonVergeben(app, "t-berlin", "Test", "k1")).toBe(false);
  });

  it("mit ausgenommenId einer ANDEREN Klasse bleibt die Doppelung bestehen", () => {
    // t-berlin hat noch eine ZWEITE Klasse ("Andere", k3) - die auf "Test"
    // umzubenennen träfe k1, die eigentliche "Test"-Klasse desselben Kontos.
    const zweiKlassen = [...bestand, { id: "k3", teacherUid: "t-berlin", name: "Andere" }];
    const app2 = baueApp(zweiKlassen);
    expect(lib.nameSchonVergeben(app2, "t-berlin", "Test", "k3")).toBe(true);
  });
});

/**
 * ★★★★★ Nachbesserung 20.09.2026 (Punkt 4): der ANDERE Weg, der den Namen
 * ändern kann - `/api/tt/klassencode-aendern` (`aendereKlassencode`) - schreibt
 * per `tx.save()` direkt und sieht den `onRecordUpdateRequest`-Wächter nie.
 * Dieselbe je-Konto-Prüfung steht darum zusätzlich DORT.
 */
describe("tt_klasse_lib.pb.js — aendereKlassencode prüft den Namen mit", () => {
  interface LibMitAendern extends Lib {
    aendereKlassencode: (
      app: unknown,
      lehrkraftId: string,
      alt: unknown,
      neu: unknown,
      name?: unknown,
    ) => { status: number; antwort: Record<string, unknown> };
  }
  const libMitAendern = lib as unknown as LibMitAendern;

  type KlasseZeile = { id: string; code: string; name: string; teacherUid: string };

  /**
   * Vollständig genug für `aendereKlassencode`: `findFirstRecordByFilter` +
   * `findRecordsByFilter` fürs Vorprüfen, dazu `findRecordById` + `save` +
   * `runInTransaction` fürs eigentliche Schreiben (das läuft auch dann, wenn
   * NUR der Name geändert wird - `codeNeu` bleibt hier immer `false`, die
   * beiden Testfälle ändern nur den Namen, nicht den Code).
   */
  function baueKlassenApp(klassen: KlasseZeile[]) {
    const db = new Map(klassen.map((k) => [k.id, { ...k }]));
    const zeile = (rec: KlasseZeile) => ({
      id: rec.id,
      getString: (f: string) => (rec as unknown as Record<string, string>)[f] ?? "",
      set: (f: string, v: unknown) => {
        (rec as unknown as Record<string, unknown>)[f] = v;
      },
    });
    const app = {
      findFirstRecordByFilter(s: string, filter: string, params: Record<string, unknown>) {
        if (s !== "tt_classes") throw new Error("keine Klasse gefunden");
        if (!/^code = \{:c\}$/.test(filter)) throw new Error(`Filter nicht verstanden: ${filter}`);
        const rec = [...db.values()].find((x) => x.code === String(params.c));
        if (!rec) throw new Error("keine Klasse gefunden");
        return zeile(rec);
      },
      findRecordsByFilter(
        s: string,
        filter: string,
        _sort: string,
        _limit: number,
        _offset: number,
        params: Record<string, unknown>,
      ) {
        if (s !== "tt_classes" || !/^teacherUid = \{:t\}$/.test(filter)) return [];
        return [...db.values()].filter((k) => k.teacherUid === String(params.t)).map(zeile);
      },
      findRecordById(s: string, id: string) {
        if (s !== "tt_classes") throw new Error("no such table");
        const rec = db.get(id);
        if (!rec) throw new Error("sql: no rows in result set");
        return zeile(rec);
      },
      save(_z: unknown) {
        /* Testfälle prüfen nur Status/Meldung, nicht den Bestand danach. */
      },
      runInTransaction(fn: (tx: unknown) => void) {
        fn(app);
      },
      logger: () => ({ error: () => {} }),
    };
    return app;
  }

  it("Name (ohne Codewechsel) bei DERSELBEN Lehrkraft schon vergeben ⇒ Absage", () => {
    const app = baueKlassenApp([
      { id: "k1", code: "3B", name: "3b", teacherUid: "t-berger" },
      { id: "k2", code: "4A", name: "4a", teacherUid: "t-berger" },
    ]);
    const r = libMitAendern.aendereKlassencode(app, "t-berger", "3B", "3B", "4a");
    expect(r.status).toBe(400);
    expect(r.antwort.error).toBe(
      "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.",
    );
  });

  it("Name auf den EIGENEN (unveränderten) Namen ⇒ geht durch", () => {
    const app = baueKlassenApp([{ id: "k1", code: "3B", name: "3b", teacherUid: "t-berger" }]);
    const r = libMitAendern.aendereKlassencode(app, "t-berger", "3B", "3B", "3b");
    expect(r.status).toBe(200);
  });
});

// ── pbBackend.createClass zeigt die Hook-Meldung wörtlich (Muster
// tastenflow-klassen-kinder-grenze-meldung.test.ts) ─────────────────────────

function backendMit(pb: unknown): PocketBaseTypingBackend {
  const b = Object.create(PocketBaseTypingBackend.prototype) as PocketBaseTypingBackend;
  (b as unknown as { pb: unknown }).pb = pb;
  return b;
}

describe("pbBackend.createClass — die Namens-Meldung des Hooks kommt wörtlich an", () => {
  it("die Meldung von `nameSchonVergeben` (kein `validation_not_unique`-Feld) wird durchgereicht", async () => {
    const NAMENS_MELDUNG =
      "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.";
    const pb = {
      collection() {
        return {
          async create() {
            throw new ClientResponseError({
              status: 400,
              response: { message: NAMENS_MELDUNG, data: {} },
            });
          },
        };
      },
    };
    const r = await backendMit(pb).createClass("t1", "Test", "TEST2");
    expect(r).toEqual({ ok: false, error: NAMENS_MELDUNG });
  });
});

/**
 * ★★★★★ Nachbesserung 20.09.2026 (Punkt 2, die Entscheidung "erneuter
 * Versuch statt Vorab-Route"): der Server meldet den ersten Versuch
 * ("TEST") als `validation_not_unique` am Feld `code`; mit
 * `codeAutoVorschlag=true` versucht `createClass` selbst den nächsten
 * ("TEST2") - hier ohne Kollision, also Erfolg, OHNE dass die Lehrkraft
 * je eine Absage sieht.
 */
describe("pbBackend.createClass — der Codevorschlag weicht am Server selbst aus", () => {
  it("Versuch 1 ('TEST') kollidiert, Versuch 2 ('TEST2') klappt - kein Fehler an die Lehrkraft", async () => {
    const versuchteCodes: string[] = [];
    const pb = {
      collection() {
        return {
          async create(body: { code: string }) {
            versuchteCodes.push(body.code);
            if (body.code === "TEST") {
              throw new ClientResponseError({
                status: 400,
                response: {
                  message: "Failed to create record.",
                  data: { code: { code: "validation_not_unique", message: "Value must be unique." } },
                },
              });
            }
            return { id: "neu", code: body.code, name: "Test" } as unknown as Record<string, unknown>;
          },
        };
      },
    };
    const r = await backendMit(pb).createClass("t1", "Test", "TEST", undefined, true);
    expect(versuchteCodes).toEqual(["TEST", "TEST2"]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.code).toBe("TEST2");
  });

  it("ohne codeAutoVorschlag bleibt es beim EINEN Versuch - die klare Klassencode-Absage", async () => {
    const versuchteCodes: string[] = [];
    const pb = {
      collection() {
        return {
          async create(body: { code: string }) {
            versuchteCodes.push(body.code);
            throw new ClientResponseError({
              status: 400,
              response: {
                message: "Failed to create record.",
                data: { code: { code: "validation_not_unique", message: "Value must be unique." } },
              },
            });
          },
        };
      },
    };
    const r = await backendMit(pb).createClass("t1", "Test", "TEST"); // kein 5. Argument
    expect(versuchteCodes).toEqual(["TEST"]); // KEIN zweiter Versuch
    expect(r).toEqual({
      ok: false,
      error:
        "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).",
    });
  });
});
