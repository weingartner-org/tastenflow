/**
 * ★★★★ WÄCHTER: Klassenmatch-Anzahl für die Lehrkraft (E9, 19.09.2026).
 *
 * Johannes, 18.09.2026: „Klassenmatch-Anzahl ja" - die Lehrkraft sieht, WIE
 * OFT jedes Kind je Woche ein Klassenmatch gespielt hat: NUR die Anzahl,
 * kein Ranking, keine Platzierung. Das dreht F10 (`tt_match.pb.js`-Dateikopf:
 * „Es gibt keine Statistik dazu") nur für DIESEN einen Punkt um -
 * `tt_match_verlauf` selbst bekommt KEINE Regeländerung (bleibt für jeden
 * Client unlesbar, auch die Lehrkraft) und diese Route ist der einzige Weg
 * heraus, geprüft in drei Schichten:
 *
 *  (a) `zaehleKlassenmatches` - reine Gruppierung, inklusive der
 *      Wochen-Grenze Montag 07:59/08:00 Wien.
 *  (b) `istEigeneKlasse` - dieselbe Eigentümer:in-ODER-Co-Lehrkraft-Prüfung
 *      wie überall im Haus (`istStaff`/`mayManage`).
 *  (c) `klassenmatchAnzahlHandler` - der ganze Weg über eine NACHGEBAUTE App
 *      (Muster `tests/tastenflow-kind-verschieben.test.ts`): 401/400/403/200,
 *      und dass die Antwort NIE mehr als Kennung+Woche+Zahl trägt.
 *  (d) `PocketBaseTypingBackend.klassenmatchAnzahl` - der Client-Teil: Pfad
 *      und Query stimmen, eine echte Antwort geht unverändert durch, und
 *      JEDER Fehler (Netz, Berechtigung, kaputte Antwort) meldet `null`
 *      („unbekannt") statt abzustürzen (Muster
 *      `tests/typing-klassenmatch-netzaussetzer.test.tsx`, `backendOhneNetz`).
 *      ★ M3 (19.09.2026): bis dahin `{}` - seit „Übungszeiten" auch die
 *      Summe nennt, wäre das bei einem Fehler „an keinem Klassenmatch
 *      teilgenommen" für jedes Kind gewesen. Eine leere, aber ECHTE Antwort
 *      bleibt `{}`.
 *
 * ⚠️ WAS DIESER WÄCHTER NICHT BEWEIST: dass PocketBase `e.auth`/`e.json`/
 * `e.requestInfo()` genau so füllt. Das ist an früherer Stelle im Haus schon
 * einmal schiefgegangen ([[reference_pocketbase_antwort_umgeht_viewrule]]) -
 * die echte Route braucht nach dem Deploy einen Live-Beweis (Superuser +
 * Impersonation, wie bei jedem neuen Hook seit dem 11.09.2026).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PocketBaseTypingBackend } from "@/lib/typing/pbBackend";

// ── Die Lib, wie goja sie lädt (Muster tests/tastenflow-kind-verschieben.test.ts) ──

/**
 * Eine Zeile aus `tt_match_verlauf`, soweit die Zählregel sie liest - seit
 * 14.11.2026 nur noch die Teilnahme (kein Platz, keine Zeichen, kein Tempo).
 */
interface VerlaufsZeile {
  matchId: string;
  classCode: string;
  pupilUid: string;
  startMs: number;
  endeMs: number;
  durchgespielt: boolean;
}
/** Die Werte EINES Kindes im Spielstand, aus denen der Cron `durchgespielt` rechnet. */
interface Lauf {
  pupilUid: string;
  startMs: number;
  endeMs: number;
  verstrichenMs: number;
  zeichen: number;
}
const MATCH_MS = 5 * 60_000;
/** Ein Kind, das ein Match bis zum Ende gespielt hat - Ende bei `endeMs`. */
function spiel(pupilUid: string, endeMs: number, extra: Partial<VerlaufsZeile> = {}) {
  return {
    matchId: `m-${endeMs}`,
    pupilUid,
    startMs: endeMs - MATCH_MS,
    endeMs,
    durchgespielt: true,
    ...extra,
  };
}
/** Der Spielstand eines Kindes, das bis zum Ende geschrieben hat. */
function lauf(pupilUid: string, endeMs: number, extra: Partial<Lauf> = {}) {
  return {
    pupilUid,
    startMs: endeMs - MATCH_MS,
    endeMs,
    verstrichenMs: MATCH_MS,
    zeichen: 500,
    ...extra,
  };
}

interface Antwort {
  status: number;
  body: Record<string, unknown>;
}
interface Lib {
  istEigeneKlasse: (
    app: unknown,
    classCode: string,
    ownerId: string,
    teacherId: string,
  ) => boolean;
  istDurchgespielt: (lauf: Partial<Lauf>) => boolean;
  zaehleKlassenmatches: (
    zeilen: Partial<VerlaufsZeile>[],
    isoWochenKey: (ms: number) => string,
  ) => Record<string, Record<string, number>>;
  zaehleMatchesImZeitraum: (
    zeilen: Partial<VerlaufsZeile>[],
    vonMs: number,
    bisMs: number,
  ) => { matches: number; teilnahmen: number; klassen: number };
  klassenmatchAnzahlHandler: (e: unknown) => Antwort;
}

const WURZEL = resolve(__dirname, "..");
const lies = (p: string) => readFileSync(resolve(WURZEL, p), "utf8");
const HOOKS_DIR = resolve(WURZEL, "pocketbase/pb_hooks");

/**
 * Lädt eine `.pb.js`-Datei GENAU wie goja sie sähe: als CommonJS-Modul, mit
 * einem echten `require`, das eine weitere Hook-Datei ebenso lädt (verkettbar -
 * hier braucht die Lib `tt_wochenziel_lib.pb.js`).
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
  const code = lies("pocketbase/pb_hooks/tt_match_anzahl_lib.pb.js");
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

/** Dieselbe Funktion, isoliert geladen - für die Wochen-Grenze in (a). */
const wz = echtesRequire(resolve(HOOKS_DIR, "tt_wochenziel_lib.pb.js")) as {
  isoWochenKey: (ms: number) => string;
  wochenStartMs: (ms: number) => number;
};

// ── (a) zaehleKlassenmatches - reine Gruppierung ────────────────────────────

describe("(a) zaehleKlassenmatches - Anzahl je Kind und Woche", () => {
  it("zählt nichts bei leerer Liste", () => {
    expect(lib.zaehleKlassenmatches([], wz.isoWochenKey)).toEqual({});
  });

  it("zählt mehrere Zeilen desselben Kindes in derselben Woche zusammen", () => {
    const montag = wz.wochenStartMs(Date.now());
    const zeilen = [
      spiel("kind-a", montag + 60_000),
      spiel("kind-a", montag + 2 * 60_000),
    ];
    const out = lib.zaehleKlassenmatches(zeilen, wz.isoWochenKey);
    const woche = wz.isoWochenKey(montag);
    expect(out).toEqual({ "kind-a": { [woche]: 2 } });
  });

  it("trennt verschiedene Kinder UND verschiedene Wochen", () => {
    const montag = wz.wochenStartMs(Date.now());
    const naechsteWoche = wz.wochenStartMs(montag + 8 * 24 * 3600_000);
    const zeilen = [
      spiel("kind-a", montag + 60_000),
      spiel("kind-b", montag + 60_000),
      spiel("kind-a", naechsteWoche + 60_000),
    ];
    const out = lib.zaehleKlassenmatches(zeilen, wz.isoWochenKey);
    const w1 = wz.isoWochenKey(montag);
    const w2 = wz.isoWochenKey(naechsteWoche);
    expect(out).toEqual({
      "kind-a": { [w1]: 1, [w2]: 1 },
      "kind-b": { [w1]: 1 },
    });
  });

  it("★★★★★ Montag 07:59 gehört noch der alten Woche, 08:00 der neuen", () => {
    const montag = wz.wochenStartMs(Date.now());
    const zeilen = [
      spiel("kind-a", montag - 60_000), // 07:59
      spiel("kind-a", montag), // 08:00 - die Grenze selbst
    ];
    const out = lib.zaehleKlassenmatches(zeilen, wz.isoWochenKey);
    const alteWoche = wz.isoWochenKey(montag - 60_000);
    const neueWoche = wz.isoWochenKey(montag);
    expect(alteWoche).not.toBe(neueWoche);
    expect(out).toEqual({
      "kind-a": { [alteWoche]: 1, [neueWoche]: 1 },
    });
  });

  it("überspringt Zeilen ohne Kind oder ohne gültige Zeit", () => {
    const montag = wz.wochenStartMs(Date.now());
    const zeilen = [
      spiel("", montag),
      spiel("kind-a", 0),
      spiel("kind-a", Number.NaN),
      spiel("kind-a", montag + 1000),
    ];
    const out = lib.zaehleKlassenmatches(
      zeilen as Partial<VerlaufsZeile>[],
      wz.isoWochenKey,
    );
    expect(out).toEqual({ "kind-a": { [wz.isoWochenKey(montag)]: 1 } });
  });
});

// ── (a2) istDurchgespielt - was zählt (Johannes, 21.09.2026) ────────────────

describe("(a2) istDurchgespielt - nur bis zum Ende gespielte Klassenmatches zählen", () => {
  const ende = Date.UTC(2026, 8, 15, 10, 0, 0);

  it("ein Kind, das bis zum Ende schrieb, hat durchgespielt", () => {
    expect(lib.istDurchgespielt(lauf("k", ende))).toBe(true);
  });

  it("★★★★★ gemessene echte Werte: 298121 und 298413 von 300000 ms zählen noch", () => {
    // Am Live-Stand (21.09.2026) endet die letzte Meldung eines Kindes, das bis
    // zum Schluss dabei war, ein, zwei Sekunden vor der Endzeit - nicht auf die
    // Millisekunde. Eine Regel „genau 300000" zählte gerade die Spielenden nicht.
    expect(lib.istDurchgespielt(lauf("k", ende, { verstrichenMs: 298_121 }))).toBe(true);
    expect(lib.istDurchgespielt(lauf("k", ende, { verstrichenMs: 298_413 }))).toBe(true);
  });

  it("★★★★★ eine abgesagte Einladung zählt nicht (startMs und endeMs sind 0)", () => {
    // So stehen sie am Live-Stand: verstrichenMs ist dort ein ZEITSTEMPEL
    // (1789840752383), keine Dauer - nur die Prüfung auf `startMs > 0` hält sie draussen.
    expect(
      lib.istDurchgespielt({
        pupilUid: "k",
        startMs: 0,
        endeMs: 0,
        verstrichenMs: 1_789_840_752_383,
        zeichen: 0,
      }),
    ).toBe(false);
  });

  it("wer mittendrin ausgestiegen ist, hat nicht durchgespielt", () => {
    expect(lib.istDurchgespielt(lauf("k", ende, { verstrichenMs: 120_000 }))).toBe(false);
    expect(lib.istDurchgespielt(lauf("k", ende, { verstrichenMs: 0, zeichen: 0 }))).toBe(false);
  });

  it("die Toleranz ist genau 15 Sekunden - eine Sekunde weniger zählt nicht mehr", () => {
    expect(lib.istDurchgespielt(lauf("k", ende, { verstrichenMs: MATCH_MS - 15_000 }))).toBe(true);
    expect(lib.istDurchgespielt(lauf("k", ende, { verstrichenMs: MATCH_MS - 15_001 }))).toBe(false);
  });

  it("wer dabeisass, aber nichts schrieb, hat nicht gespielt", () => {
    expect(lib.istDurchgespielt(lauf("k", ende, { zeichen: 0 }))).toBe(false);
  });

  it("die Platzierung spielt keine Rolle - auch der Letzte hat durchgespielt", () => {
    expect(lib.istDurchgespielt({ ...lauf("k", ende), platz: 9, wert: 0.1 } as never)).toBe(true);
  });

  it("kaputte oder fehlende Zahlen zählen nie", () => {
    expect(lib.istDurchgespielt({})).toBe(false);
    expect(lib.istDurchgespielt(lauf("k", ende, { verstrichenMs: Number.NaN }))).toBe(false);
    expect(lib.istDurchgespielt(undefined as never)).toBe(false);
  });

  it("zaehleKlassenmatches zählt nur gespeicherte Zeilen mit `durchgespielt`", () => {
    const zeilen = [
      spiel("kind-a", ende), // durchgespielt
      spiel("kind-a", ende + 600_000, { durchgespielt: false }), // ausgestiegen
      { pupilUid: "kind-a", startMs: 0, endeMs: 0, durchgespielt: false }, // abgesagt
      spiel("kind-b", ende, { durchgespielt: false }), // nur dabeigesessen
      // ★ eine ALTE Zeile mit den rohen Zahlen, aber ohne `durchgespielt`, zählt nie
      { pupilUid: "kind-c", startMs: ende - MATCH_MS, endeMs: ende, verstrichenMs: MATCH_MS, zeichen: 500 },
    ];
    const out = lib.zaehleKlassenmatches(zeilen, wz.isoWochenKey);
    expect(out).toEqual({ "kind-a": { [wz.isoWochenKey(ende)]: 1 } });
  });

  it("die Woche ist die des SPIELENDES, nicht die des Aufräumens", () => {
    const montag = wz.wochenStartMs(ende);
    // Sonntag 23:58 gespielt; die Zeile entsteht erst eine Stunde später
    // (`createdMs` in der nächsten Woche) - sie gehört in die alte Woche.
    const z = { ...spiel("kind-a", montag - 2 * 60_000), createdMs: montag + 58 * 60_000 };
    const out = lib.zaehleKlassenmatches([z], wz.isoWochenKey);
    expect(out).toEqual({ "kind-a": { [wz.isoWochenKey(montag - 2 * 60_000)]: 1 } });
  });
});

// ── (a3) zaehleMatchesImZeitraum - für den Wochenbericht des Admins ─────────

describe("(a3) zaehleMatchesImZeitraum - Matches, Teilnahmen, Klassen", () => {
  const von = Date.UTC(2026, 8, 14, 0, 0, 0);
  const bis = von + 7 * 24 * 3600_000;

  it("ein Match mit drei durchgespielten Kindern ist EIN Match und drei Teilnahmen", () => {
    const e = von + 3600_000;
    const zeilen = ["a", "b", "c"].map((k) => ({
      ...spiel(k, e),
      matchId: "m1",
      classCode: "K1",
    }));
    expect(lib.zaehleMatchesImZeitraum(zeilen, von, bis)).toEqual({
      matches: 1,
      teilnahmen: 3,
      klassen: 1,
    });
  });

  it("zählt nur den Zeitraum: Beginn eingeschlossen, Ende ausgeschlossen", () => {
    const zeilen = [
      { ...spiel("a", von), matchId: "vorher-grenze", classCode: "K1" }, // genau am Beginn: zählt
      { ...spiel("a", von - 1), matchId: "davor", classCode: "K1" },
      { ...spiel("a", bis), matchId: "danach-grenze", classCode: "K1" }, // genau am Ende: nicht
      { ...spiel("a", bis - 1), matchId: "letzte", classCode: "K2" },
    ];
    expect(lib.zaehleMatchesImZeitraum(zeilen, von, bis)).toEqual({
      matches: 2,
      teilnahmen: 2,
      klassen: 2,
    });
  });

  it("★★★★★ ein Match, das niemand durchgespielt hat, zählt gar nicht", () => {
    const e = von + 3600_000;
    const zeilen = [
      { ...spiel("a", e, { durchgespielt: false }), matchId: "m1", classCode: "K1" },
      { ...spiel("b", e, { durchgespielt: false }), matchId: "m1", classCode: "K1" },
      { pupilUid: "c", matchId: "m2", classCode: "K1", startMs: 0, endeMs: 0, durchgespielt: false },
    ];
    expect(lib.zaehleMatchesImZeitraum(zeilen, von, bis)).toEqual({
      matches: 0,
      teilnahmen: 0,
      klassen: 0,
    });
  });

  it("ein Match zählt, sobald EIN Kind es durchgespielt hat - die anderen nicht als Teilnahme", () => {
    const e = von + 3600_000;
    const zeilen = [
      { ...spiel("a", e), matchId: "m1", classCode: "K1" },
      { ...spiel("b", e, { durchgespielt: false }), matchId: "m1", classCode: "K1" },
    ];
    expect(lib.zaehleMatchesImZeitraum(zeilen, von, bis)).toEqual({
      matches: 1,
      teilnahmen: 1,
      klassen: 1,
    });
  });

  it("leere Liste: alles null", () => {
    expect(lib.zaehleMatchesImZeitraum([], von, bis)).toEqual({ matches: 0, teilnahmen: 0, klassen: 0 });
  });
});

// ── (b) istEigeneKlasse - Eigentümer:in ODER Co-Lehrkraft ───────────────────

/** Eine winzige nachgebaute App - nur, was `istEigeneKlasse` braucht. */
function baueMiniApp(coLehrkraefte: { classCode: string; teacherUid: string }[]) {
  return {
    findFirstRecordByFilter(_col: string, _filter: string, params: Record<string, unknown>) {
      const treffer = coLehrkraefte.find(
        (c) => c.classCode === params.c && c.teacherUid === params.t,
      );
      if (!treffer) throw new Error("sql: no rows in result set");
      return treffer;
    },
  };
}

describe("(b) istEigeneKlasse - dieselbe Regel wie istStaff/mayManage", () => {
  it("die Eigentümer:in selbst darf immer", () => {
    const app = baueMiniApp([]);
    expect(lib.istEigeneKlasse(app, "ABC", "lehrkraft-1", "lehrkraft-1")).toBe(true);
  });

  it("eine eingetragene Co-Lehrkraft darf", () => {
    const app = baueMiniApp([{ classCode: "ABC", teacherUid: "lehrkraft-2" }]);
    expect(lib.istEigeneKlasse(app, "ABC", "lehrkraft-1", "lehrkraft-2")).toBe(true);
  });

  it("weder Eigentümer:in noch Co-Lehrkraft darf nicht", () => {
    const app = baueMiniApp([{ classCode: "ABC", teacherUid: "lehrkraft-2" }]);
    expect(lib.istEigeneKlasse(app, "ABC", "lehrkraft-1", "lehrkraft-3")).toBe(false);
  });

  it("ohne teacherId (fail-closed) darf niemand", () => {
    const app = baueMiniApp([]);
    expect(lib.istEigeneKlasse(app, "ABC", "lehrkraft-1", "")).toBe(false);
  });
});

// ── (c) klassenmatchAnzahlHandler - der ganze Weg ───────────────────────────

interface Zeile {
  daten: Record<string, unknown>;
  getString(f: string): string;
  getFloat(f: string): number;
  getBool(f: string): boolean;
}
function zeile(daten: Record<string, unknown>): Zeile {
  return {
    daten,
    getString: (f) => String(daten[f] ?? ""),
    getFloat: (f) => Number(daten[f] ?? 0),
    getBool: (f) => daten[f] === true,
  };
}

function passtEinfach(d: Record<string, unknown>, filter: string, params: Record<string, unknown>) {
  return filter.split("&&").every((teil) => {
    const m = teil.trim().match(/^(\w+) = \{:(\w+)\}$/);
    if (!m) throw new Error(`Filter nicht verstanden: ${teil}`);
    return String(d[m[1]] ?? "") === String(params[m[2]]);
  });
}

/** Eine nachgebaute App über zwei Tabellen: `tt_classes`, `tt_match_verlauf`. */
function baueApp(db: {
  tt_classes: Record<string, unknown>[];
  tt_class_teachers: Record<string, unknown>[];
  tt_match_verlauf: Record<string, unknown>[];
}) {
  return {
    findFirstRecordByFilter(col: string, filter: string, params: Record<string, unknown>) {
      const tabelle = (db as Record<string, Record<string, unknown>[]>)[col] ?? [];
      const treffer = tabelle.find((d) => passtEinfach(d, filter, params));
      if (!treffer) throw new Error("sql: no rows in result set");
      return zeile(treffer);
    },
    findRecordsByFilter(
      col: string,
      filter: string,
      _sort: string,
      _limit: number,
      _offset: number,
      params: Record<string, unknown>,
    ) {
      const tabelle = (db as Record<string, Record<string, unknown>[]>)[col] ?? [];
      return tabelle.filter((d) => passtEinfach(d, filter, params)).map(zeile);
    },
    logger() {
      return { warn: () => {}, error: () => {}, info: () => {} };
    },
  };
}

/** Ein `e` mit angemeldeter Lehrkraft und einer GET-Query. */
function baueE(
  app: unknown,
  auth: { id: string; collection: string } | null,
  query: Record<string, string>,
) {
  const antworten: Antwort[] = [];
  return {
    auth: auth
      ? { id: auth.id, collection: () => ({ name: auth.collection }) }
      : null,
    app,
    requestInfo: () => ({ query }),
    json(status: number, body: Record<string, unknown>) {
      const a = { status, body };
      antworten.push(a);
      return a;
    },
    _antworten: antworten,
  };
}

const KLASSE_A = { code: "ABC123", teacherUid: "lehrkraft-1" };
const KLASSE_B = { code: "XYZ789", teacherUid: "lehrkraft-9" };

describe("(c) klassenmatchAnzahlHandler - 401/400/403/200", () => {
  it("401 ohne angemeldete Lehrkraft", () => {
    const app = baueApp({ tt_classes: [KLASSE_A], tt_class_teachers: [], tt_match_verlauf: [] });
    const e = baueE(app, null, { klasse: KLASSE_A.code });
    const r = lib.klassenmatchAnzahlHandler(e) as Antwort;
    expect(r.status).toBe(401);
  });

  it("401 wenn ein KIND (nicht die Lehrkraft) angemeldet ist", () => {
    const app = baueApp({ tt_classes: [KLASSE_A], tt_class_teachers: [], tt_match_verlauf: [] });
    const e = baueE(app, { id: "kind-1", collection: "tt_pupils" }, { klasse: KLASSE_A.code });
    const r = lib.klassenmatchAnzahlHandler(e) as Antwort;
    expect(r.status).toBe(401);
  });

  it("400 ohne Klassencode", () => {
    const app = baueApp({ tt_classes: [KLASSE_A], tt_class_teachers: [], tt_match_verlauf: [] });
    const e = baueE(app, { id: "lehrkraft-1", collection: "tt_teachers" }, {});
    const r = lib.klassenmatchAnzahlHandler(e) as Antwort;
    expect(r.status).toBe(400);
  });

  it("403 bei einer unbekannten Klasse", () => {
    const app = baueApp({ tt_classes: [KLASSE_A], tt_class_teachers: [], tt_match_verlauf: [] });
    const e = baueE(app, { id: "lehrkraft-1", collection: "tt_teachers" }, { klasse: "NIRGENDS" });
    const r = lib.klassenmatchAnzahlHandler(e) as Antwort;
    expect(r.status).toBe(403);
  });

  it("403 bei einer fremden Klasse (weder Eigentümer:in noch Co-Lehrkraft)", () => {
    const app = baueApp({
      tt_classes: [KLASSE_A, KLASSE_B],
      tt_class_teachers: [],
      tt_match_verlauf: [],
    });
    const e = baueE(app, { id: "lehrkraft-1", collection: "tt_teachers" }, { klasse: KLASSE_B.code });
    const r = lib.klassenmatchAnzahlHandler(e) as Antwort;
    expect(r.status).toBe(403);
  });

  it("200 für die Eigentümer:in - und zählt NUR die eigene Klasse", () => {
    const montag = wz.wochenStartMs(Date.now());
    const app = baueApp({
      tt_classes: [KLASSE_A, KLASSE_B],
      tt_class_teachers: [],
      tt_match_verlauf: [
        // zwei Zeilen der eigenen Klasse, ein Kind
        { classCode: KLASSE_A.code, ...spiel("kind-a", montag + 1000) },
        { classCode: KLASSE_A.code, ...spiel("kind-a", montag + 2000) },
        // eine Zeile derselben Klasse, anderes Kind
        { classCode: KLASSE_A.code, ...spiel("kind-b", montag + 3000) },
        // eine Zeile einer FREMDEN Klasse - darf nicht auftauchen
        { classCode: KLASSE_B.code, ...spiel("kind-fremd", montag + 4000) },
      ],
    });
    const e = baueE(app, { id: "lehrkraft-1", collection: "tt_teachers" }, { klasse: KLASSE_A.code });
    const r = lib.klassenmatchAnzahlHandler(e) as Antwort;
    expect(r.status).toBe(200);
    const woche = wz.isoWochenKey(montag);
    expect(r.body).toEqual({
      kinder: {
        "kind-a": { [woche]: 2 },
        "kind-b": { [woche]: 1 },
      },
    });
    // ★★★★★ Nie mehr als Kennung+Woche+Zahl - keine Platzierung, keine Zeit,
    // kein Name, keine fremde Klasse.
    const json = JSON.stringify(r.body);
    expect(json).not.toContain("kind-fremd");
    for (const verboten of ["platz", "apm", "wert", "hostUid", "toolProfile", "fehler"]) {
      expect(json.toLowerCase()).not.toContain(verboten.toLowerCase());
    }
  });

  it("200 für eine eingetragene Co-Lehrkraft derselben Klasse", () => {
    const app = baueApp({
      tt_classes: [KLASSE_A],
      tt_class_teachers: [{ classCode: KLASSE_A.code, teacherUid: "lehrkraft-2" }],
      tt_match_verlauf: [],
    });
    const e = baueE(app, { id: "lehrkraft-2", collection: "tt_teachers" }, { klasse: KLASSE_A.code });
    const r = lib.klassenmatchAnzahlHandler(e) as Antwort;
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ kinder: {} });
  });

  it("200 mit leerem Ergebnis, wenn die Klasse noch nie ein Match verzeichnet hat", () => {
    const app = baueApp({ tt_classes: [KLASSE_A], tt_class_teachers: [], tt_match_verlauf: [] });
    const e = baueE(app, { id: "lehrkraft-1", collection: "tt_teachers" }, { klasse: KLASSE_A.code });
    const r = lib.klassenmatchAnzahlHandler(e) as Antwort;
    expect(r).toEqual({ status: 200, body: { kinder: {} } });
  });
});

// ── (d) PocketBaseTypingBackend.klassenmatchAnzahl - der Client-Teil ────────

/**
 * Das echte `PocketBaseTypingBackend`, nur mit einem `pb`-Ersatz statt des
 * Servers - Muster `backendOhneNetz` in
 * `tests/typing-klassenmatch-netzaussetzer.test.tsx`.
 */
function backendMitPb(send: (path: string, opts: unknown) => Promise<unknown>): PocketBaseTypingBackend {
  const b = Object.create(PocketBaseTypingBackend.prototype) as PocketBaseTypingBackend;
  (b as unknown as { pb: unknown }).pb = { send };
  return b;
}

describe("(d) PocketBaseTypingBackend.klassenmatchAnzahl - Fehler -> null, Erfolg unverändert", () => {
  it("ruft GET auf genau dem vereinbarten Pfad samt Query auf", async () => {
    const aufrufe: { path: string; opts: unknown }[] = [];
    const backend = backendMitPb(async (path, opts) => {
      aufrufe.push({ path, opts });
      return { kinder: {} };
    });
    await backend.klassenmatchAnzahl("3B");
    expect(aufrufe).toEqual([
      { path: "/api/tt/klassenmatch-anzahl?klasse=3B", opts: { method: "GET" } },
    ]);
  });

  it("reicht eine echte Antwort UNVERÄNDERT durch", async () => {
    const backend = backendMitPb(async () => ({
      kinder: { "kind-a": { "2026-W38": 2 }, "kind-b": { "2026-W38": 1 } },
    }));
    expect(await backend.klassenmatchAnzahl("3B")).toEqual({
      "kind-a": { "2026-W38": 2 },
      "kind-b": { "2026-W38": 1 },
    });
  });

  it("★ M3: eine leere, aber ECHTE Antwort bleibt `{}` - das ist eine wirkliche Null", async () => {
    const backend = backendMitPb(async () => ({ kinder: {} }));
    expect(await backend.klassenmatchAnzahl("3B")).toEqual({});
  });

  it("meldet null bei einem Netzfehler (Schul-WLAN)", async () => {
    const backend = backendMitPb(async () => {
      throw new TypeError("Failed to fetch");
    });
    expect(await backend.klassenmatchAnzahl("3B")).toBeNull();
  });

  it("meldet null bei 403 (keine Berechtigung - fremde Klasse)", async () => {
    const backend = backendMitPb(async () => {
      throw new Error("403: Diese Klasse gehört einer anderen Lehrkraft.");
    });
    expect(await backend.klassenmatchAnzahl("3B")).toBeNull();
  });

  it("meldet null bei einer kaputten Antwort ohne `kinder`-Feld", async () => {
    const backend = backendMitPb(async () => ({ irgendwas: true }));
    expect(await backend.klassenmatchAnzahl("3B")).toBeNull();
  });
});

// ── (e) LehrerHilfe.tsx - der Klassenmatch-Absatz sagt nicht mehr „keine Statistik“ ──

describe("(e) LehrerHilfe.tsx - die Entscheidung vom 18.09. steht jetzt da", () => {
  const hilfe = () => lies("src/components/typing/LehrerHilfe.tsx");

  it('sagt nicht mehr „Es gibt keine Statistik dazu"', () => {
    expect(hilfe()).not.toContain("Es gibt keine Statistik dazu");
    expect(hilfe()).not.toContain("Sie sehen nicht, wer wie oft spielt");
  });

  it('nennt „Übungszeiten" und „je Woche" im Klassenmatch-Absatz - kurz, ohne Platzierung', () => {
    const h = hilfe();
    const start = h.indexOf("Klassenmatch erlauben");
    expect(start).toBeGreaterThan(0);
    const absatz = h.slice(start, h.indexOf("</li>", start));
    expect(absatz).toContain("Übungszeiten");
    expect(absatz).toContain("je Woche");
    // Die Anzahl ja, aber KEIN Ranking - „keine Platzierung" ist eine
    // Verneinung, keine Rangliste-Ankündigung.
    expect(absatz).toContain("keine Platzierung");
    expect(absatz).not.toMatch(/Rangliste|Platz \d/);
  });
});
