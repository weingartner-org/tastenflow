/**
 * ★★★ E1 (24.09.2026): DER LERNWEG - die Regeln rund um das neue Feld.
 *
 * Bauplan: `BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md` §2.2. Was hier geprüft
 * wird (der Wächter „Weg de bleibt Byte für Byte" steht eigens in
 * `tastenflow-lernweg-de-unveraendert.test.ts`):
 *
 *  1. `bestimmeLernweg` - die ganze Entscheidung in EINER reinen Funktion.
 *  2. Der Probe-Schalter `?englisch-lehrgang=1` / `=0` und der Gast-Speicher.
 *  3. Der Server-Wächter `tt_pupils_field_guard.pb.js` - AUSGEFÜHRT, nicht
 *     als Text-Suche: `lernweg` ist nur schreibbar, solange er leer ist, für
 *     alle ausser Superusern.
 *  4. Die Selbstanmeldung `tt_pupils_selfsignup.pb.js` nimmt nur "de"/"en".
 *  5. Die Klasse gibt ihren Weg nur NEUEN Kindern - nie einem bestehenden.
 *  6. Eine Anzahl (`startUnits`) gilt nur im eigenen Weg.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  GAST_SCHLUESSEL,
  LERNWEGE,
  LEHRGANG_PROBE_MERKER,
  LEHRGANG_PROBE_MERKER_ES,
  LEHRGANG_PROBE_MERKER_FR,
  bestimmeLernweg,
  englischLehrgangProbeAn,
  fortschrittsLernweg,
  gastLernwegLesen,
  gastLernwegMerken,
  lernwegAus,
  lernwegBeimAnlegen,
  lernwegVon,
} from "../src/lib/typing/lernweg";
import {
  addPupil,
  createClass,
  getAccount,
  getClass,
  getProgress,
  registerTeacher,
  setClassEinstellungen,
  setLernweg,
} from "../src/lib/typing/account";
import { startpunktMitKlasse } from "../src/lib/typing/klassenEinstellungen";
import { planAusEinstellungen } from "../src/lib/typing/schreibprobe";
import { INTRO_ORDER } from "../src/lib/typing/letters";
import { istTastenflowMerker } from "../src/lib/bedienSprache/sprache";
import { nurGeruestAus } from "./helfer/sprachwahl";

beforeEach(() => localStorage.clear());

// ── 1 · Die Entscheidung ────────────────────────────────────────────────────

describe("1 · bestimmeLernweg - eine reine Funktion für die ganze Regel", () => {
  it("ohne Probe-Schalter: immer de - auch bei englischer Bedienung", () => {
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "en", lehrgangProbeAn: false })).toBe("de");
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "de", lehrgangProbeAn: false })).toBe("de");
    expect(bestimmeLernweg({ gespeichert: undefined, bedienSprache: "en", lehrgangProbeAn: false })).toBe(
      "de",
    );
  });

  it("mit Probe-Schalter und nichts gespeichert: die Bedienung entscheidet", () => {
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "en", lehrgangProbeAn: true })).toBe("en");
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "de", lehrgangProbeAn: true })).toBe("de");
  });

  it("ein gespeicherter Weg gewinnt IMMER - mit und ohne Probe-Schalter", () => {
    for (const lehrgangProbeAn of [true, false])
      for (const bedienSprache of ["de", "en"] as const) {
        expect(bestimmeLernweg({ gespeichert: "en", bedienSprache, lehrgangProbeAn })).toBe("en");
        expect(bestimmeLernweg({ gespeichert: "de", bedienSprache, lehrgangProbeAn })).toBe("de");
      }
  });

  it("★★★ Umschalten der Bedienung NACH dem Festlegen ändert nichts (D2)", () => {
    // Erster Start: englische Bedienung, Probe an ⇒ „en" - und fest.
    const fest = bestimmeLernweg({ gespeichert: null, bedienSprache: "en", lehrgangProbeAn: true });
    expect(fest).toBe("en");
    // Später auf Deutsch umgeschaltet: der gespeicherte Weg bleibt.
    expect(bestimmeLernweg({ gespeichert: fest, bedienSprache: "de", lehrgangProbeAn: true })).toBe("en");
    // Umgekehrt genauso.
    expect(bestimmeLernweg({ gespeichert: "de", bedienSprache: "en", lehrgangProbeAn: true })).toBe("de");
  });

  it("die Übungssprache fragt die Regel gar nicht (D1: deutsche Bedienung + Englisch üben ⇒ de)", () => {
    expect(bestimmeLernweg.length).toBe(1);
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "de", lehrgangProbeAn: true })).toBe("de");
  });

  it("ein ungültiger gespeicherter Wert zählt nicht als gespeichert", () => {
    expect(
      bestimmeLernweg({ gespeichert: "xx" as never, bedienSprache: "en", lehrgangProbeAn: false }),
    ).toBe("de");
  });
});

describe("1b · lernwegVon / lernwegAus - fehlend heisst de", () => {
  it("Bestandskonten ohne Feld sind de; nur de/en/fr zählen", () => {
    expect(lernwegVon(undefined)).toBe("de");
    expect(lernwegVon(null)).toBe("de");
    expect(lernwegVon({})).toBe("de");
    expect(lernwegVon({ lernweg: "" })).toBe("de");
    // ★ G2a (02.10.2026, G1c §3 Nr. 2): ein Wert, der da ist und KEIN Lernweg
    // ist, fällt nicht mehr still auf „de" - er wirft (Falle 50). Fehlend/leer
    // bleibt „de" (Bestand).
    expect(() => lernwegVon({ lernweg: "xx" })).toThrow(/Unbekannter Lernweg/);
    expect(lernwegVon({ lernweg: "en" })).toBe("en");
  });

  it("★ E2a (25.09.2026, Gerüst französischer Lehrgang): fr ist jetzt ein gültiger Weg", () => {
    expect(lernwegVon({ lernweg: "fr" })).toBe("fr");
    expect(lernwegAus({ lernweg: "fr" }, { lernweg: "de" })).toBe("fr");
  });

  it("das Konto gewinnt vor der Kopie im Fortschritt", () => {
    expect(lernwegAus({ lernweg: "en" }, { lernweg: "de" })).toBe("en");
    expect(lernwegAus({ lernweg: "de" }, { lernweg: "en" })).toBe("de");
    expect(lernwegAus({}, { lernweg: "en" })).toBe("en");
    expect(lernwegAus(null, null)).toBe("de");
  });

  it("★ E2 (24.09.2026): der Eintrag en ist jetzt die ECHTE englische Reihenfolge, keine Kopie mehr", () => {
    // Die volle Prüfung der englischen Reihenfolge (Fassung A2, Bauplan §3.3a)
    // steht eigens in `tastenflow-lernweg-en-reihenfolge.test.ts`; hier nur die
    // Grundsatzfrage: „de" bleibt unverändert, „en" ist wirklich etwas anderes.
    expect(LERNWEGE.en.introOrder).not.toEqual(LERNWEGE.de.introOrder);
    expect(LERNWEGE.de.introOrder).toBe(INTRO_ORDER);
  });
});

// ── 2 · Probe-Schalter und Gast-Speicher ────────────────────────────────────

describe("2 · der Schalter ?englisch-lehrgang=1/=0 und der Gast-Speicher", () => {
  // ★ FREIGABE 25.09.2026: Die echte Grundeinstellung ist „an" - die Suite
  // sieht hier trotzdem „aus", weil `tests/setup.ts` für die ganze (auf „aus"
  // geschriebene) Bestandssuite einen Vorbeleger setzt (Merker = "0"). Der
  // wirkliche Grundzustand ohne diesen Vorbeleger steht in
  // `tests/tastenflow-englisch-lehrgang-freigabe.test.ts`.
  it("ohne Adresse: aus (Vorbeleger aus tests/setup.ts)", () => {
    expect(englischLehrgangProbeAn("")).toBe(false);
  });

  it("=1 schaltet an, danach gilt es auch ohne Adresse; =0 schaltet aus UND merkt das (Not-Aus)", () => {
    expect(englischLehrgangProbeAn("?englisch-lehrgang=1")).toBe(true);
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER)).toBe("1");
    expect(englischLehrgangProbeAn("")).toBe(true);
    expect(englischLehrgangProbeAn("?englisch-lehrgang=0")).toBe(false);
    // ★ Anders als bis 24.09.: „=0" LÖSCHT den Merker nicht mehr, sondern
    // SETZT ihn auf "0" - sonst wäre ein Not-Aus ohne Wirkung, sobald ohne
    // Adresse weitergeblättert wird (die Grundeinstellung ist ja „an").
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER)).toBe("0");
    expect(englischLehrgangProbeAn("")).toBe(false);
  });

  it("gesperrter Speicher: kein Absturz - die Grundeinstellung (an) gilt einfach ungespeichert weiter", () => {
    const echt = window.localStorage;
    const kaputt = {
      getItem: () => {
        throw new Error("gesperrt");
      },
      setItem: () => {
        throw new Error("gesperrt");
      },
      removeItem: () => {
        throw new Error("gesperrt");
      },
    };
    Object.defineProperty(window, "localStorage", { value: kaputt, configurable: true });
    try {
      expect(englischLehrgangProbeAn("")).toBe(true);
      expect(gastLernwegLesen()).toBeNull();
      expect(() => gastLernwegMerken("en")).not.toThrow();
    } finally {
      Object.defineProperty(window, "localStorage", { value: echt, configurable: true });
    }
  });

  it("der Gast-Weg wird EINMAL gemerkt und nie überschrieben", () => {
    expect(gastLernwegLesen()).toBeNull();
    gastLernwegMerken("en");
    expect(localStorage.getItem(GAST_SCHLUESSEL)).toBe("en");
    gastLernwegMerken("de");
    expect(gastLernwegLesen()).toBe("en");
  });

  // ★ 28.09.2026 (Freigabe fr/es): „ohne Probe" heisst jetzt ALLE DREI
  // Lehrgänge im Not-Aus - der englische ist es über den Vorbeleger aus
  // tests/setup.ts, Französisch und Spanisch sind seit der Freigabe default an.
  // ★ 10.10.2026 (Freigabe it/pl/tr/cs): auch die vier neuen im Not-Aus.
  it("Selbstanmeldung ohne Probe: Weg de, nichts wird mitgegeben (Feld bleibt leer)", () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "0");
    localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "0");
    for (const m of [
      "tastenflow-italienisch-lehrgang",
      "tastenflow-polnisch-lehrgang",
      "tastenflow-tuerkisch-lehrgang",
      "tastenflow-tschechisch-lehrgang",
    ])
      localStorage.setItem(m, "0");
    // ★ 06.11.2026 (Freigabe der neun): auch die neun des Gerüts im Not-Aus.
    nurGeruestAus();
    expect(lernwegBeimAnlegen("en")).toEqual({ lernweg: "de", mitgeben: undefined });
    expect(lernwegBeimAnlegen("de")).toEqual({ lernweg: "de", mitgeben: undefined });
  });

  // ★ 28.09.2026 (Freigabe fr/es): Mit fr/es in der Grundeinstellung (an) wird
  // der Weg auch bei englischem Not-Aus gleich beim Anlegen fest - „de" bei
  // deutscher oder englischer Bedienung. Das ist dasselbe, was seit dem
  // 25.09.2026 ohnehin jede Selbstanmeldung ohne englischen Not-Aus tut
  // (`tastenflow-englisch-lehrgang-freigabe.test.tsx`).
  it("★ Selbstanmeldung mit fr/es in der Grundeinstellung: Weg de wird mitgegeben, fr/es-Bedienung bekommt ihren Weg", () => {
    expect(lernwegBeimAnlegen("en")).toEqual({ lernweg: "de", mitgeben: "de" });
    expect(lernwegBeimAnlegen("de")).toEqual({ lernweg: "de", mitgeben: "de" });
    expect(lernwegBeimAnlegen("fr")).toEqual({ lernweg: "fr", mitgeben: "fr" });
    expect(lernwegBeimAnlegen("es")).toEqual({ lernweg: "es", mitgeben: "es" });
  });

  it("Selbstanmeldung mit Probe und englischer Bedienung: en, und er wird beim Anlegen fest", () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER, "1");
    expect(lernwegBeimAnlegen("en")).toEqual({ lernweg: "en", mitgeben: "en" });
    expect(lernwegBeimAnlegen("de")).toEqual({ lernweg: "de", mitgeben: "de" });
  });

  it("ein Gast mit festem Weg bringt ihn mit - auch ohne Probe", () => {
    gastLernwegMerken("en");
    expect(lernwegBeimAnlegen("de")).toEqual({ lernweg: "en", mitgeben: "en" });
  });

  it("★ FREIGABE 25.09.2026: der Merker zählt NICHT als „Gerät kennt Tastenflow\" (bedienSprache/sprache.ts)", () => {
    // ⚠️ `istTastenflowMerker` prüft sonst jeden Schlüssel, der mit
    // „tastenflow-" beginnt - ohne diese Ausnahme würde ein blosser
    // Not-Aus-Link (`?englisch-lehrgang=0`) ein frisches Gerät fälschlich als
    // „kennt Tastenflow schon" zählen, und die Spracherkennung schlüge auf
    // Deutsch um, obwohl noch nie geübt wurde.
    expect(istTastenflowMerker(LEHRGANG_PROBE_MERKER)).toBe(false);
  });
});

// ── 3 · Der Server-Wächter, ausgeführt ─────────────────────────────────────

type Felder = Record<string, unknown>;

/** Ein Datensatz, wie ihn ein Handler sieht: `get`/`set`/`getString`/`getBool`. */
function datensatz(id: string, felder: Felder) {
  const f: Felder = { ...felder };
  return {
    id,
    felder: f,
    get: (k: string) => f[k],
    set: (k: string, v: unknown) => {
      f[k] = v;
    },
    getString: (k: string) => {
      const v = f[k];
      return v == null ? "" : typeof v === "string" ? v : JSON.stringify(v);
    },
    getBool: (k: string) => !!f[k],
    getInt: (k: string) => Number(f[k] ?? 0),
  };
}

function ladeWaechter() {
  const quelle = readFileSync(
    resolve(__dirname, "../pocketbase/pb_hooks/tt_pupils_field_guard.pb.js"),
    "utf8",
  );
  const angemeldet: ((e: unknown) => void)[] = [];
  new Function("onRecordUpdateRequest", quelle)((h: (e: unknown) => void) => angemeldet.push(h));
  expect(angemeldet).toHaveLength(1);
  return angemeldet[0];
}

/** Wer schreibt: das Kind selbst, eine Lehrkraft oder ein Superuser. */
type Wer = "kind" | "lehrkraft" | "superuser";
const AUTH: Record<Wer, { id: string; collection: () => { name: string } }> = {
  kind: { id: "k1", collection: () => ({ name: "tt_pupils" }) },
  lehrkraft: { id: "t1", collection: () => ({ name: "tt_teachers" }) },
  superuser: { id: "s1", collection: () => ({ name: "_superusers" }) },
};

function update(wer: Wer, gespeichert: Felder, body: Felder): Felder {
  const handler = ladeWaechter();
  const stored = datensatz("k1", gespeichert);
  const record = datensatz("k1", { ...gespeichert, ...body });
  let weiter = false;
  handler({
    auth: AUTH[wer],
    record,
    app: { findRecordById: () => stored },
    next: () => {
      weiter = true;
    },
  });
  expect(weiter, "der Handler reicht weiter (e.next)").toBe(true);
  return record.felder;
}

const GRUND: Felder = {
  teacherUid: "t1",
  classCode: "3B",
  name: "Mia",
  selfManaged: false,
  lang: "de",
  zeichenabstand: 1,
  lernweg: "",
};

describe("3 · tt_pupils_field_guard: der Lernweg ist EINMAL schreibbar", () => {
  it("leer ⇒ das Kind selbst darf ihn setzen (erster Fortschritt)", () => {
    expect(update("kind", GRUND, { lernweg: "en" }).lernweg).toBe("en");
    expect(update("kind", GRUND, { lernweg: "de" }).lernweg).toBe("de");
  });

  // ★ W2b (28.09.2026): Seit Johannes' Auftrag „Weg je Kind" darf die
  // Lehrkraft DIESER Klasse einen gesetzten Weg umstellen - der Server schlägt
  // dafür `tt_classes`/`tt_class_teachers` nach. Dieses Doppel kennt kein
  // Nachschlagen (`findFirstRecordByFilter` fehlt), also findet es keine
  // Lehrkraft der Klasse: fail-closed, der Weg bleibt. Die neue Regel samt
  // Gegenproben steht in `tests/tastenflow-w2b-weg-je-kind.test.tsx`.
  it("★★★ gesetzt ⇒ niemand ausser Superusern ändert ihn - Kind UND Lehrkraft, die der Server nicht als Lehrkraft der Klasse findet", () => {
    for (const wer of ["kind", "lehrkraft"] as const) {
      expect(update(wer, { ...GRUND, lernweg: "en" }, { lernweg: "de" }).lernweg, wer).toBe("en");
      expect(update(wer, { ...GRUND, lernweg: "de" }, { lernweg: "en" }).lernweg, wer).toBe("de");
      expect(update(wer, { ...GRUND, lernweg: "en" }, { lernweg: "" }).lernweg, wer).toBe("en");
    }
  });

  it("ein Superuser darf ihn ändern (Reparatur von Hand)", () => {
    expect(update("superuser", { ...GRUND, lernweg: "en" }, { lernweg: "de" }).lernweg).toBe("de");
  });

  it("nur de/en/fr - Unsinn bleibt leer", () => {
    expect(update("lehrkraft", GRUND, { lernweg: "x".repeat(50) }).lernweg).toBe("");
  });

  it("★ E2a (25.09.2026, Gerüst französischer Lehrgang): fr wird jetzt angenommen", () => {
    expect(update("kind", GRUND, { lernweg: "fr" }).lernweg).toBe("fr");
    expect(update("kind", { ...GRUND, lernweg: "fr" }, { lernweg: "de" }).lernweg).toBe("fr");
  });

  it("ein anderes Selbst-Update lässt den Weg in Ruhe (Gegenprobe: Zeichenabstand geht weiter)", () => {
    const aus = update("kind", { ...GRUND, lernweg: "en" }, { zeichenabstand: 3 });
    expect(aus.lernweg).toBe("en");
    expect(aus.zeichenabstand).toBe(3);
  });

  it("die Lehrkraft darf einen LEEREN Weg setzen (z. B. Nachtrag)", () => {
    expect(update("lehrkraft", GRUND, { lernweg: "en" }).lernweg).toBe("en");
  });
});

// ── 4 · Die Selbstanmeldung ────────────────────────────────────────────────

function ladeAnmeldung() {
  const quelle = readFileSync(
    resolve(__dirname, "../pocketbase/pb_hooks/tt_pupils_selfsignup.pb.js"),
    "utf8",
  );
  const anlegen: ((e: unknown) => void)[] = [];
  new Function("onRecordCreateRequest", "onRecordAuthRequest", "BadRequestError", "$app", quelle)(
    (h: (e: unknown) => void) => anlegen.push(h),
    () => {},
    class extends Error {},
    { logger: () => ({ info: () => {}, warn: () => {} }) },
  );
  expect(anlegen).toHaveLength(1);
  return anlegen[0];
}

function anlegen(wer: "selbst" | "lehrkraft" | "superuser", felder: Felder): Felder {
  const handler = ladeAnmeldung();
  const record = datensatz("neu", felder);
  let weiter = false;
  handler({
    auth:
      wer === "selbst" ? null : wer === "lehrkraft" ? AUTH.lehrkraft : AUTH.superuser,
    record,
    requestInfo: () => ({ body: { password: "geheim-genug", startUnits: 0 } }),
    next: () => {
      weiter = true;
    },
  });
  expect(weiter).toBe(true);
  return record.felder;
}

const SELBST: Felder = {
  selfManaged: true,
  classCode: "",
  teacherUid: "",
  email: "mia@example.org",
  name: "Mia",
};

describe("4 · tt_pupils_selfsignup: nimmt den Lernweg beim Anlegen an - de/en/fr", () => {
  it("Selbstanmeldung: en bleibt en, de bleibt de", () => {
    expect(anlegen("selbst", { ...SELBST, lernweg: "en" }).lernweg).toBe("en");
    expect(anlegen("selbst", { ...SELBST, lernweg: "de" }).lernweg).toBe("de");
  });

  it("fehlt er oder ist er Unsinn, bleibt er LEER (= de, beim ersten Fortschritt noch festlegbar)", () => {
    expect(anlegen("selbst", { ...SELBST }).lernweg).toBe("");
    expect(anlegen("selbst", { ...SELBST, lernweg: "xx" }).lernweg).toBe("");
  });

  it("★ E2a (25.09.2026, Gerüst französischer Lehrgang): fr wird jetzt angenommen", () => {
    expect(anlegen("selbst", { ...SELBST, lernweg: "fr" }).lernweg).toBe("fr");
  });

  it("eine Lehrkraft legt ein Kind mit dem Weg der Klasse an - geprüft wird auch hier", () => {
    expect(anlegen("lehrkraft", { name: "Ben", lernweg: "en" }).lernweg).toBe("en");
    expect(anlegen("lehrkraft", { name: "Ben", lernweg: "xx" }).lernweg).toBe("");
  });
});

// ── 5 · Die Klasse gibt ihren Weg nur NEUEN Kindern ────────────────────────

function baueKlasse() {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  return { teacherId: t.value.id, code: c.value.code };
}

describe("5 · Klassen-Weg: Vorgabe für neue Kinder, nie für bestehende", () => {
  it("★★★ den Weg der Klasse umstellen ändert KEIN bestehendes Kind", () => {
    const { teacherId, code } = baueKlasse();
    const alt = addPupil(code, "Anna", "pw1234");
    if (!alt.ok) throw new Error(alt.error);
    expect(lernwegVon(getAccount(alt.value.id))).toBe("de");

    setClassEinstellungen(code, teacherId, { lernweg: "en" });
    expect(getClass(code)?.lernweg).toBe("en");
    // Das bestehende Kind: unverändert, Konto UND Fortschritt.
    expect(getAccount(alt.value.id)?.lernweg).toBeUndefined();
    expect(lernwegVon(getProgress(alt.value.id))).toBe("de");

    // Ein NEUES Kind erbt den Weg - samt Kopie im Fortschritt, wenn es mit
    // Vorkenntnissen startet.
    const neu = addPupil(code, "Ben", "pw1234", undefined, undefined, 8);
    if (!neu.ok) throw new Error(neu.error);
    expect(getAccount(neu.value.id)?.lernweg).toBe("en");
    expect(getProgress(neu.value.id).lernweg).toBe("en");
    expect(getProgress(neu.value.id).introduced).toHaveLength(8);
  });

  it("eine Klasse ohne Weg gibt nichts weiter - das neue Kind hat kein Feld (= de)", () => {
    const { code } = baueKlasse();
    const k = addPupil(code, "Mia", "pw1234", undefined, undefined, 8);
    if (!k.ok) throw new Error(k.error);
    expect(getAccount(k.value.id)).not.toHaveProperty("lernweg");
    expect(getProgress(k.value.id)).not.toHaveProperty("lernweg");
  });

  it("createClass nimmt den Weg gleich beim Anlegen (nur en wird eingetragen)", () => {
    const t = registerTeacher("Herr Kaya", "kaya@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const en = createClass(t.value.id, "4a", "4A", { lernweg: "en" });
    const de = createClass(t.value.id, "4b", "4B", { lernweg: "de" });
    if (!en.ok || !de.ok) throw new Error("Klasse");
    expect(getClass("4A")?.lernweg).toBe("en");
    expect(getClass("4B")).not.toHaveProperty("lernweg");
  });

  it("setLernweg am Konto ist EINMAL schreibbar - wie am Server", () => {
    const { code } = baueKlasse();
    const k = addPupil(code, "Tom", "pw1234");
    if (!k.ok) throw new Error(k.error);
    expect(setLernweg(k.value.id, "en")?.lernweg).toBe("en");
    expect(setLernweg(k.value.id, "de")?.lernweg).toBe("en");
    expect(getAccount(k.value.id)?.lernweg).toBe("en");
  });
});

// ── 6 · Eine Anzahl gilt nur im eigenen Weg ────────────────────────────────

describe("6 · startUnits ist eine Anzahl im Weg (Bauplan §2.4)", () => {
  it("die Vorgabe der Klasse gilt nur für Kinder auf DEMSELBEN Weg", () => {
    const klasse = { startUnits: 22, startUnitsAt: 100 };
    expect(startpunktMitKlasse({ startUnits: 2 }, klasse).startUnits).toBe(22);
    expect(
      startpunktMitKlasse({ startUnits: 2, lernweg: "en" }, { ...klasse, lernweg: "en" }).startUnits,
    ).toBe(22);
    // Gemischte Klasse: die Zahl hiesse für das Kind etwas anderes.
    expect(startpunktMitKlasse({ startUnits: 2, lernweg: "en" }, klasse).startUnits).toBe(2);
    expect(startpunktMitKlasse({ startUnits: 2 }, { ...klasse, lernweg: "en" }).startUnits).toBe(2);
  });

  it("der Plan der Tippchallenge: ein gültiger Weg wird gelesen, Unsinn ist de", () => {
    const basis = { id: "p1", niveau: "satz", startMs: 1000, dauerMin: 10, textNr: 0 };
    expect(planAusEinstellungen({ schreibprobe: { ...basis, lernweg: "en" } })?.lernweg).toBe("en");
    // ★ E2a (25.09.2026, Gerüst französischer Lehrgang): fr wird jetzt gelesen (Bauplan-Wächter „fr fällt nie still auf de").
    expect(planAusEinstellungen({ schreibprobe: { ...basis, lernweg: "fr" } })?.lernweg).toBe("fr");
    expect(planAusEinstellungen({ schreibprobe: { ...basis, lernweg: "xx" } })).not.toHaveProperty(
      "lernweg",
    );
    expect(planAusEinstellungen({ schreibprobe: basis })).not.toHaveProperty("lernweg");
  });
});

// ── 7 · Bestand ────────────────────────────────────────────────────────────

describe("7 · Bestand: wer schon geübt hat, bleibt auf de (§2.2)", () => {
  it("ein Fortschritt mit Übung, aber ohne Weg, gilt als festgelegt: de", () => {
    expect(fortschrittsLernweg({}, true)).toBe("de");
    expect(fortschrittsLernweg(undefined, true)).toBe("de");
    // Mit Probe und englischer Bedienung bleibt es dabei - gespeichert gewinnt.
    expect(
      bestimmeLernweg({
        gespeichert: fortschrittsLernweg({}, true),
        bedienSprache: "en",
        lehrgangProbeAn: true,
      }),
    ).toBe("de");
  });

  it("ein frischer Fortschritt ohne Übung legt noch nichts fest", () => {
    expect(fortschrittsLernweg({}, false)).toBeNull();
    expect(
      bestimmeLernweg({
        gespeichert: fortschrittsLernweg({}, false),
        bedienSprache: "en",
        lehrgangProbeAn: true,
      }),
    ).toBe("en");
  });

  it("die Kopie im Fortschritt gewinnt vor der Übungs-Regel", () => {
    expect(fortschrittsLernweg({ lernweg: "en" }, true)).toBe("en");
    expect(fortschrittsLernweg({ lernweg: "en" }, false)).toBe("en");
  });
});
