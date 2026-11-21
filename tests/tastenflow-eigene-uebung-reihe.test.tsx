/**
 * WÄCHTER über die REIHE der „Eigenen Übungen" (Z1, 19.09.2026).
 *
 * Johannes wörtlich: „Prüfe, ob wirklich alle Schüler einer Klasse ein Popup
 * bekommen mit der letzten Übung, die ein Lehrer gestartet hat, egal wann der
 * Schüler Tastenflow startet. Wenn der Lehrer in der Zwischenzeit schon eine
 * neue Übung gestartet hat, dann kommt zuerst die alte und dann die neue."
 *
 * Vorher (gemessen am Code): EIN Zeiger je Klasse, ein neuer Start ERSETZTE
 * ihn - wer die alte Übung nicht geschrieben hatte, bekam sie nie. Der Merker
 * für das Fenster lag am GERÄT (ein Wert für alle Konten). Und der Lauf
 * meldete die Zeile doppelt gezählt (1, 3, 6 …).
 *
 * Vier Teile:
 *  (a) die reinen Regeln der Reihe (`eigeneUebungReihe.ts`),
 *  (b) das lokale Backend (anhängen, beenden, alter Zeiger, höchstens 20),
 *  (c) der ganze Weg des Kindes - `useEigeneUebung` + Fenster-Haken über das
 *      lokale Backend, Realtime nachgebaut (lokal gibt es keins),
 *  (d) die Zeile, die `EigeneUebungLauf` meldet.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, renderHook, waitFor } from "@testing-library/react";
import type { TypingAccount, TypingClass } from "@/lib/typing/account";

const { hoerer, sitzung } = vi.hoisted(() => ({
  hoerer: new Map<string, Set<(cls: TypingClass) => void>>(),
  sitzung: { props: null as null | Record<string, unknown> },
}));

/**
 * Das ECHTE lokale Backend - nur `beobachteKlasse` ist nachgebaut, damit ein
 * Start der Lehrkraft das Gerät eines Kindes wie am Server sofort erreicht
 * (`melde`). Lokal ist `beobachteKlasse` mit Absicht ohne Wirkung.
 */
vi.mock("@/lib/typing/backend", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/backend")>();
  return {
    ...echt,
    typingBackend: () => {
      const b = echt.typingBackend();
      return new Proxy(b, {
        get(ziel, name, empf) {
          if (name === "beobachteKlasse") {
            return (code: string, cb: (cls: TypingClass) => void) => {
              const menge = hoerer.get(code) ?? new Set();
              menge.add(cb);
              hoerer.set(code, menge);
              return () => menge.delete(cb);
            };
          }
          const v = Reflect.get(ziel, name, empf);
          return typeof v === "function" ? v.bind(ziel) : v;
        },
      });
    },
  };
});

/** (d) `TypingSession` als Attrappe - sie merkt sich nur ihre Props. */
vi.mock("@/components/typing/TypingSession", () => ({
  TypingSession: (props: Record<string, unknown>) => {
    sitzung.props = props;
    return null;
  },
}));

import { addPupil, createClass, registerTeacher } from "@/lib/typing/account";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import {
  EIGENE_UEBUNGEN_HOECHSTENS,
  eigeneUebungKurzstand,
  eigeneUebungReihe,
  eigeneUebungenAusRoh,
  fertigeKinder,
  naechsteOffeneUebung,
  reiheMitNeuer,
  reiheOhne,
  vonAllenFertig,
  type EigeneUebungEintrag,
} from "@/lib/typing/eigeneUebungReihe";
import { useEigeneUebung, type EigeneUebungStand } from "@/lib/typing/useEigeneUebung";
import { useEigeneUebungAnkuendigung } from "@/lib/typing/useEigeneUebungAnkuendigung";
import { EigeneUebungLauf } from "@/components/typing/EigeneUebungLauf";
import type { KeyEvent } from "@/lib/typing/letters";

beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
  hoerer.clear();
  sitzung.props = null;
});
afterEach(() => localStorage.clear());

// ── Helfer ──────────────────────────────────────────────────────────────────

/** Der Schlüssel des lokalen Backends (`account.ts`, `KEY`). */
const LOKALER_SPEICHER = "tippen-trainer:store:v1";

function eintrag(textId: string, gestartetAm = 1): EigeneUebungEintrag {
  return { textId, dateiname: `${textId}.txt`, gestartetAm, von: "t1" };
}

function klasseMitKindern(...namen: string[]) {
  const t = registerTeacher("Frau Reihe", `reihe-${Math.random()}@example.org`, "geheim1");
  if (!t.ok) throw new Error("Lehrkraft nicht angelegt");
  const c = createClass(t.value.id, "Reihe-Klasse");
  if (!c.ok) throw new Error("Klasse nicht angelegt");
  const kinder = namen.map((n) => {
    const p = addPupil(c.value.code, n, "pw12");
    if (!p.ok) throw new Error(`${n} nicht angelegt`);
    return p.value;
  });
  return { teacher: t.value, cls: c.value, kinder };
}

/** Die Lehrkraft startet eine Übung mit `zeilen` Zeilen - wie der Kasten. */
async function starte(cls: TypingClass, teacherId: string, name: string, zeilen: number) {
  const textId = await typingBackend().speichereEigenenText(
    cls.code,
    teacherId,
    `${name}.txt`,
    Array.from({ length: zeilen }, (_, i) => `${name} Zeile ${i + 1}`),
  );
  if (!textId) throw new Error("Text nicht gespeichert");
  const neu = await typingBackend().starteEigeneUebung(cls.code, teacherId, {
    textId,
    dateiname: `${name}.txt`,
  });
  if (!neu) throw new Error("nicht gestartet");
  return textId;
}

/** Realtime: der Server meldet die geänderte Klasse an alle Geräte. */
async function melde(code: string) {
  const cls = await typingBackend().getClass(code);
  if (!cls) throw new Error("Klasse fehlt");
  act(() => {
    for (const cb of hoerer.get(code) ?? []) cb(cls);
  });
}

/** Ein Kind an EINEM Gerät: Übung + Fenster, genau wie `TippenTrainerPage`. */
function useKind(konto: TypingAccount, gesperrt = false) {
  const stand = useEigeneUebung(konto);
  const dran = stand.geladen && stand.dran;
  const fenster = useEigeneUebungAnkuendigung({
    dran,
    zeiger: stand.zeiger,
    gesperrt,
    angekuendigt: stand.angekuendigt,
    merkeBestaetigt: stand.bestaetigeAnkuendigung,
  });
  return { stand, dran, fenster };
}

function oeffne(konto: TypingAccount, gesperrt = false) {
  return renderHook(({ gesperrt: g }: { gesperrt: boolean }) => useKind(konto, g), {
    initialProps: { gesperrt },
  });
}
type Kind = ReturnType<typeof oeffne>;

/** Fenster mit „Weiter" bestätigen. */
function weiter(k: Kind) {
  expect(k.result.current.fenster.zeigen).toBe(true);
  act(() => k.result.current.fenster.bestaetigen());
  expect(k.result.current.fenster.zeigen).toBe(false);
}

/** `von` bis `bis` Zeilen schreiben (nur Zeilen, keine Abschluss-Karte). */
async function schreibeZeilen(k: Kind, von: number, bis: number) {
  await waitFor(() => expect(k.result.current.stand.text).not.toBeNull());
  for (let z = von; z <= bis; z++) {
    act(() =>
      k.result.current.stand.meldeFortschritt({
        zeile: z,
        anschlaege: [{ char: "a", correct: true, ms: 100 }],
      }),
    );
  }
}

/** Die Abschluss-Karte schliessen („Weiter üben") - erst jetzt geht es weiter. */
function karteSchliessen(k: Kind) {
  const zeile = k.result.current.stand.text?.zeilen.length ?? 0;
  act(() => k.result.current.stand.meldeFortschritt({ zeile, anschlaege: [], fertig: true }));
}

async function geladen(k: Kind) {
  await waitFor(() => expect(k.result.current.stand.geladen).toBe(true));
}

// ── (a) die reinen Regeln ──────────────────────────────────────────────────────

describe("(a) die Regeln der Reihe (eigeneUebungReihe.ts)", () => {
  it("★★★ faules Umziehen: leere Reihe + alter Zeiger = Reihe mit einem Eintrag", () => {
    const reihe = eigeneUebungReihe({
      teacherId: "t1",
      settings: { eigeneUebung: { textId: "alt", dateiname: "alt.txt", angelegtMs: 5 } },
    });
    expect(reihe).toEqual([{ textId: "alt", dateiname: "alt.txt", gestartetAm: 5, von: "t1" }]);
  });

  it("eine nicht leere Reihe gilt allein - der alte Zeiger wird dann nicht mehr gelesen", () => {
    const reihe = eigeneUebungReihe({
      eigeneUebungen: [eintrag("neu")],
      settings: { eigeneUebung: { textId: "alt", dateiname: "alt.txt", angelegtMs: 5 } },
    });
    expect(reihe.map((e) => e.textId)).toEqual(["neu"]);
  });

  it("wehrhaft: kaputte Einträge fallen weg, eine doppelte textId zählt einmal", () => {
    const reihe = eigeneUebungenAusRoh([
      null,
      { textId: "" },
      { textId: "a", dateiname: "a.txt", gestartetAm: "7", von: "t1" },
      { textId: "a", dateiname: "doppelt.txt" },
      "Unsinn",
      { textId: "b" },
    ]);
    expect(reihe).toEqual([
      { textId: "a", dateiname: "a.txt", gestartetAm: 7, von: "t1" },
      { textId: "b", dateiname: "", gestartetAm: 0, von: "" },
    ]);
    expect(eigeneUebungenAusRoh("kaputt")).toEqual([]);
  });

  it("★★★ anhängen: HINTEN, älteste zuerst; dieselbe Übung zweimal ändert nichts", () => {
    const reihe = reiheMitNeuer(reiheMitNeuer([], eintrag("eins")), eintrag("zwei"));
    expect(reihe.map((e) => e.textId)).toEqual(["eins", "zwei"]);
    expect(reiheMitNeuer(reihe, eintrag("eins")).map((e) => e.textId)).toEqual(["eins", "zwei"]);
  });

  it("★★★ höchstens 20: die älteste fällt - oder zuerst die älteste, die ALLE Kinder fertig haben", () => {
    let reihe: EigeneUebungEintrag[] = [];
    for (let i = 1; i <= EIGENE_UEBUNGEN_HOECHSTENS; i++) reihe = reiheMitNeuer(reihe, eintrag(`u${i}`));
    expect(reihe).toHaveLength(20);
    const ohneWissen = reiheMitNeuer(reihe, eintrag("u21"));
    expect(ohneWissen).toHaveLength(20);
    expect(ohneWissen[0].textId).toBe("u2");
    expect(ohneWissen[19].textId).toBe("u21");
    // u5 haben alle fertig - DIE fällt, u1 (noch offen für jemanden) bleibt.
    const mitWissen = reiheMitNeuer(reihe, eintrag("u21"), ["u5", "u9"]);
    expect(mitWissen.map((e) => e.textId)).not.toContain("u5");
    expect(mitWissen.map((e) => e.textId)).toContain("u1");
    expect(mitWissen.map((e) => e.textId)).toContain("u9");
  });

  it("beenden nimmt genau diese Übung heraus", () => {
    expect(reiheOhne([eintrag("a"), eintrag("b")], "a").map((e) => e.textId)).toEqual(["b"]);
  });

  it("★★★ dran ist die ÄLTESTE, die dieses Kind noch nicht fertig hat", () => {
    const reihe = [eintrag("a"), eintrag("b"), eintrag("c")];
    expect(naechsteOffeneUebung(reihe, null)?.textId).toBe("a");
    expect(
      naechsteOffeneUebung(reihe, { customTextProgress: { a: { zeile: 3, fertig: true } } })?.textId,
    ).toBe("b");
    // Mittendrin (Zeile 2, nicht fertig) ist nicht fertig.
    expect(naechsteOffeneUebung(reihe, { customTextProgress: { a: { zeile: 2 } } })?.textId).toBe("a");
    expect(
      naechsteOffeneUebung(reihe, {
        customTextProgress: { a: { zeile: 1, fertig: true }, b: { zeile: 1, fertig: true }, c: { zeile: 1, fertig: true } },
      }),
    ).toBeNull();
  });

  it("„n von m Kindern fertig“ und „von allen fertig“", () => {
    const f = [
      { customTextProgress: { a: { zeile: 2, fertig: true } } },
      { customTextProgress: { a: { zeile: 1 } } },
      {},
    ];
    expect(fertigeKinder("a", f)).toEqual({ fertig: 1, gesamt: 3 });
    expect(vonAllenFertig([eintrag("a")], f)).toEqual([]);
    expect(vonAllenFertig([eintrag("a")], [f[0]])).toEqual(["a"]);
    expect(vonAllenFertig([eintrag("a")], [])).toEqual([]);
  });

  it("Kurzstand neben dem Schalter", () => {
    expect(eigeneUebungKurzstand({})).toBe("nicht zugewiesen");
    expect(eigeneUebungKurzstand({ eigeneUebungen: [eintrag("a")] })).toBe("zugewiesen: a.txt");
    expect(eigeneUebungKurzstand({ eigeneUebungen: [eintrag("a"), eintrag("b")] })).toBe(
      "2 zugewiesen, der Reihe nach",
    );
  });
});

// ── (b) das lokale Backend ──────────────────────────────────────────────────────

describe("(b) das Backend: anhängen statt ersetzen", () => {
  it("★★★★★ zwei Starts nacheinander - BEIDE stehen in der Reihe, älteste zuerst", async () => {
    const { teacher, cls } = klasseMitKindern("Mia");
    const eins = await starte(cls, teacher.id, "eins", 2);
    const zwei = await starte(cls, teacher.id, "zwei", 2);
    const reihe = eigeneUebungReihe(await typingBackend().getClass(cls.code));
    expect(reihe.map((e) => e.textId)).toEqual([eins, zwei]);
    expect(reihe[0].von).toBe(teacher.id);
    expect(reihe[0].gestartetAm).toBeGreaterThan(0);
  });

  it("★★★ der alte Zeiger wird beim nächsten Start ZUR Reihe - und geleert", async () => {
    const { teacher, cls } = klasseMitKindern("Mia");
    // Eine Klasse von vor dem Umbau: nur der alte Zeiger (direkt in den
    // lokalen Speicher geschrieben - einen Weg dafür gibt es nicht mehr).
    const blob = JSON.parse(localStorage.getItem(LOKALER_SPEICHER)!);
    blob.classes[cls.code].settings = {
      eigeneUebung: { textId: "alt", dateiname: "alt.txt", angelegtMs: 3 },
    };
    localStorage.setItem(LOKALER_SPEICHER, JSON.stringify(blob));
    expect(eigeneUebungReihe(await typingBackend().getClass(cls.code)).map((e) => e.textId)).toEqual([
      "alt",
    ]);

    const neu = await starte(cls, teacher.id, "neu", 1);
    const nachher = await typingBackend().getClass(cls.code);
    expect(eigeneUebungReihe(nachher).map((e) => e.textId)).toEqual(["alt", neu]);
    expect((nachher?.settings as { eigeneUebung?: unknown } | null)?.eigeneUebung).toBeUndefined();
  });

  it("beenden nimmt nur diese eine heraus", async () => {
    const { teacher, cls } = klasseMitKindern("Mia");
    const eins = await starte(cls, teacher.id, "eins", 1);
    const zwei = await starte(cls, teacher.id, "zwei", 1);
    const neu = await typingBackend().beendeEigeneUebung(cls.code, teacher.id, eins);
    expect(eigeneUebungReihe(neu).map((e) => e.textId)).toEqual([zwei]);
  });

  it("★ höchstens 20 auch am Backend - der 21. Start schiebt den ältesten hinaus", async () => {
    const { teacher, cls } = klasseMitKindern("Mia");
    const ids: string[] = [];
    for (let i = 1; i <= 21; i++) ids.push(await starte(cls, teacher.id, `u${i}`, 1));
    const reihe = eigeneUebungReihe(await typingBackend().getClass(cls.code));
    expect(reihe).toHaveLength(20);
    expect(reihe[0].textId).toBe(ids[1]);
    expect(reihe[19].textId).toBe(ids[20]);
  });
});

// ── (c) der Weg des Kindes ──────────────────────────────────────────────────────

describe("(c) jedes Kind bekommt jede Übung, der Reihe nach, jede mit Fenster", () => {
  it("★★★★★ ein Kind, das keine gemacht hat: erst #1 mit Fenster, dann #2 mit Fenster", async () => {
    const { teacher, cls, kinder } = klasseMitKindern("Mia");
    const eins = await starte(cls, teacher.id, "eins", 2);
    const zwei = await starte(cls, teacher.id, "zwei", 3);

    // Mia öffnet Tastenflow erst jetzt - „egal wann".
    const mia = oeffne(kinder[0]);
    await geladen(mia);
    expect(mia.result.current.stand.zeiger?.textId).toBe(eins);
    weiter(mia);
    await schreibeZeilen(mia, 1, 2);
    // Letzte Zeile geschrieben: am Server fertig, die Abschluss-Karte steht noch.
    await waitFor(async () =>
      expect((await typingBackend().getProgress(kinder[0].id)).customTextProgress?.[eins]?.fertig).toBe(true),
    );
    expect(mia.result.current.stand.zeiger?.textId).toBe(eins);
    expect(mia.result.current.dran).toBe(true);

    karteSchliessen(mia);
    // Jetzt die NEUE - wieder mit Fenster.
    await waitFor(() => expect(mia.result.current.stand.zeiger?.textId).toBe(zwei));
    expect(mia.result.current.fenster.zeigen).toBe(true);
    weiter(mia);
    await schreibeZeilen(mia, 1, 3);
    karteSchliessen(mia);
    await waitFor(() => expect(mia.result.current.dran).toBe(false));
    expect(mia.result.current.fenster.zeigen).toBe(false);
  });

  it("★★★ ein Kind, das #1 schon fertig hat, bekommt #2", async () => {
    const { teacher, cls, kinder } = klasseMitKindern("Ben");
    const eins = await starte(cls, teacher.id, "eins", 1);
    const ben1 = oeffne(kinder[0]);
    await geladen(ben1);
    weiter(ben1);
    await schreibeZeilen(ben1, 1, 1);
    karteSchliessen(ben1);
    await waitFor(() => expect(ben1.result.current.dran).toBe(false));
    ben1.unmount();

    const zwei = await starte(cls, teacher.id, "zwei", 1);
    const ben2 = oeffne(kinder[0]);
    await geladen(ben2);
    expect(ben2.result.current.stand.zeiger?.textId).toBe(zwei);
    expect(ben2.result.current.fenster.zeigen).toBe(true);
    void eins;
  });

  it("★★★★★ Realtime: startet die Lehrkraft #2, während das Kind in #1 schreibt, kommt #2 DANACH", async () => {
    const { teacher, cls, kinder } = klasseMitKindern("Mia");
    const eins = await starte(cls, teacher.id, "eins", 2);
    const mia = oeffne(kinder[0]);
    await geladen(mia);
    weiter(mia);
    await schreibeZeilen(mia, 1, 1);

    const zwei = await starte(cls, teacher.id, "zwei", 1);
    await melde(cls.code);
    // Mia bleibt in #1 - kein Fenster mitten in der Übung.
    expect(mia.result.current.stand.zeiger?.textId).toBe(eins);
    expect(mia.result.current.fenster.zeigen).toBe(false);

    await schreibeZeilen(mia, 2, 2);
    karteSchliessen(mia);
    await waitFor(() => expect(mia.result.current.stand.zeiger?.textId).toBe(zwei));
    expect(mia.result.current.fenster.zeigen).toBe(true);
  });

  it("★★★ ein Kind, das erst SPÄTER in die Klasse kommt, bekommt die laufenden auch - der Reihe nach", async () => {
    const { teacher, cls } = klasseMitKindern("Mia");
    const eins = await starte(cls, teacher.id, "eins", 1);
    const zwei = await starte(cls, teacher.id, "zwei", 1);
    const neu = addPupil(cls.code, "Lena", "pw12");
    if (!neu.ok) throw new Error("Lena nicht angelegt");

    const lena = oeffne(neu.value);
    await geladen(lena);
    expect(lena.result.current.stand.zeiger?.textId).toBe(eins);
    weiter(lena);
    await schreibeZeilen(lena, 1, 1);
    karteSchliessen(lena);
    await waitFor(() => expect(lena.result.current.stand.zeiger?.textId).toBe(zwei));
    expect(lena.result.current.fenster.zeigen).toBe(true);
  });

  it("★★★ „Beenden“ von #1: wer #1 nicht angefangen hat, bekommt sofort #2 - wer mittendrin ist, schreibt #1 fertig", async () => {
    const { teacher, cls, kinder } = klasseMitKindern("Mia", "Ben");
    const eins = await starte(cls, teacher.id, "eins", 2);
    const zwei = await starte(cls, teacher.id, "zwei", 1);

    // Mia ist mitten in #1 (Fenster bestätigt, eine Zeile geschrieben).
    const mia = oeffne(kinder[0]);
    await geladen(mia);
    weiter(mia);
    await schreibeZeilen(mia, 1, 1);
    // Ben hat das Fenster von #1 vor sich, aber noch nicht bestätigt.
    const ben = oeffne(kinder[1]);
    await geladen(ben);
    expect(ben.result.current.stand.zeiger?.textId).toBe(eins);
    expect(ben.result.current.fenster.zeigen).toBe(true);

    await typingBackend().beendeEigeneUebung(cls.code, teacher.id, eins);
    await melde(cls.code);

    // Ben: #1 ist weg, #2 kommt - mit eigenem Fenster.
    await waitFor(() => expect(ben.result.current.stand.zeiger?.textId).toBe(zwei));
    expect(ben.result.current.fenster.zeigen).toBe(true);
    // Mia: darf #1 fertig schreiben, danach kommt #2.
    expect(mia.result.current.stand.zeiger?.textId).toBe(eins);
    expect(mia.result.current.fenster.zeigen).toBe(false);
    await schreibeZeilen(mia, 2, 2);
    karteSchliessen(mia);
    await waitFor(() => expect(mia.result.current.stand.zeiger?.textId).toBe(zwei));
    expect(mia.result.current.fenster.zeigen).toBe(true);

    // Öffnet Mia später neu, ist #1 nicht mehr da (nicht festgehalten über
    // die Sitzung hinaus).
    mia.unmount();
    const miaSpaeter = oeffne(kinder[0]);
    await geladen(miaSpaeter);
    expect(miaSpaeter.result.current.stand.zeiger?.textId).toBe(zwei);
  });

  it("★★★★★ Klassen-Rechner: Mia bestätigt, Ben meldet sich am SELBEN Gerät an - Ben bekommt das Fenster trotzdem", async () => {
    const { teacher, cls, kinder } = klasseMitKindern("Mia", "Ben");
    await starte(cls, teacher.id, "eins", 2);
    const mia = oeffne(kinder[0]);
    await geladen(mia);
    weiter(mia);
    await waitFor(async () =>
      expect(
        Object.values((await typingBackend().getProgress(kinder[0].id)).customTextProgress ?? {})[0]
          ?.angekuendigt,
      ).toBe(true),
    );
    mia.unmount();
    // Dasselbe `localStorage` - bis Z1 stand der Merker genau dort, EINER für alle.
    const ben = oeffne(kinder[1]);
    await geladen(ben);
    expect(ben.result.current.fenster.zeigen).toBe(true);
  });

  it("★★★ zweites Gerät: schon bestätigt → kein zweites Fenster, und die Übung geht an der Zeile weiter (nie übersprungen)", async () => {
    const { teacher, cls, kinder } = klasseMitKindern("Mia");
    const eins = await starte(cls, teacher.id, "eins", 3);
    const geraetA = oeffne(kinder[0]);
    await geladen(geraetA);
    weiter(geraetA);
    await schreibeZeilen(geraetA, 1, 1);
    await waitFor(async () =>
      expect((await typingBackend().getProgress(kinder[0].id)).customTextProgress?.[eins]?.zeile).toBe(1),
    );
    geraetA.unmount();

    localStorage.removeItem("tt_merkfenster"); // ein anderes Gerät kennt nichts davon
    const geraetB = oeffne(kinder[0]);
    await geladen(geraetB);
    expect(geraetB.result.current.dran).toBe(true);
    expect(geraetB.result.current.stand.zeiger?.textId).toBe(eins);
    expect(geraetB.result.current.fenster.zeigen).toBe(false);
    expect(geraetB.result.current.stand.startZeile).toBe(1);
  });

  it("★★★ wartet, solange eine Tippchallenge oder ein Klassenmatch läuft - auch zwischen #1 und #2", async () => {
    const { teacher, cls, kinder } = klasseMitKindern("Mia");
    await starte(cls, teacher.id, "eins", 1);
    const zwei = await starte(cls, teacher.id, "zwei", 1);
    const mia = oeffne(kinder[0]);
    await geladen(mia);
    weiter(mia);
    await schreibeZeilen(mia, 1, 1);
    // Die Challenge beginnt, während die Abschluss-Karte steht.
    mia.rerender({ gesperrt: true });
    karteSchliessen(mia);
    await waitFor(() => expect(mia.result.current.stand.zeiger?.textId).toBe(zwei));
    expect(mia.result.current.fenster.zeigen).toBe(false);
    mia.rerender({ gesperrt: false });
    expect(mia.result.current.fenster.zeigen).toBe(true);
  });

  it("★★★ ein Text, der sich nicht lesen lässt, hält die Reihe nicht auf - er wird für diese Sitzung übersprungen, nicht als fertig gemerkt", async () => {
    const { teacher, cls, kinder } = klasseMitKindern("Mia");
    // Eine Übung, deren Textzeile es nicht (mehr) gibt - so sieht es für ein
    // Kind aus, wenn der Klassencode geändert wurde (`tt_eigene_texte` zieht
    // nicht mit, siehe `useEigeneUebung.ts`).
    await typingBackend().starteEigeneUebung(cls.code, teacher.id, {
      textId: "gibt-es-nicht",
      dateiname: "weg.txt",
    });
    const zwei = await starte(cls, teacher.id, "zwei", 1);
    const mia = oeffne(kinder[0]);
    await geladen(mia);
    expect(mia.result.current.stand.zeiger?.textId).toBe("gibt-es-nicht");
    // Einmal nachgefragt, dann weiter zur nächsten - mit ihrem Fenster.
    await waitFor(() => expect(mia.result.current.stand.zeiger?.textId).toBe(zwei), {
      timeout: 5000,
    });
    expect(mia.result.current.fenster.zeigen).toBe(true);
    const p = await typingBackend().getProgress(kinder[0].id);
    expect(p.customTextProgress?.["gibt-es-nicht"]?.fertig).toBeUndefined();
  });

  it("★★★★★ frisch lesen: was das normale Training inzwischen gespeichert hat, überschreibt die Übung NICHT", async () => {
    const { teacher, cls, kinder } = klasseMitKindern("Mia");
    const mia = oeffne(kinder[0]);
    await geladen(mia);
    expect(mia.result.current.dran).toBe(false);

    // Mia übt normal - das Training speichert selbst (hier: Taste „q" gelernt).
    const p = await typingBackend().getProgress(kinder[0].id);
    await typingBackend().saveProgress(kinder[0].id, {
      ...p,
      introduced: [...(p.introduced ?? []), "q"],
      letters: { ...(p.letters ?? {}), q: { hits: 7, errors: 0, ms: 700 } as never },
    });

    // Jetzt startet die Lehrkraft - per Realtime mitten in die Sitzung.
    await starte(cls, teacher.id, "eins", 2);
    await melde(cls.code);
    await waitFor(() => expect(mia.result.current.dran).toBe(true));
    weiter(mia);
    await schreibeZeilen(mia, 1, 1);

    await waitFor(async () => {
      const nachher = await typingBackend().getProgress(kinder[0].id);
      expect(nachher.letters?.a?.hits).toBe(1);
      expect(nachher.letters?.q?.hits).toBe(7);
      expect(nachher.introduced).toContain("q");
    });
  });
});

// ── (d) die gemeldete Zeile ──────────────────────────────────────────────────────

describe("(d) EigeneUebungLauf meldet die Zeile NICHT doppelt gezählt", () => {
  it("★★★ drei Zeilen ab 0 melden 1, 2, 3 - auch wenn startZeile nach jeder Zeile mitwächst", () => {
    const gemeldet: number[] = [];
    const stand = (startZeile: number): EigeneUebungStand => ({
      zeiger: eintrag("t1"),
      dran: true,
      geladen: true,
      text: { dateiname: "t1.txt", zeilen: ["a", "b", "c", "d"] },
      startZeile,
      unlocked: new Set(),
      shiftLearned: false,
      angekuendigt: true,
      bestaetigeAnkuendigung: () => {},
      meldeFortschritt: ({ zeile }) => gemeldet.push(zeile),
    });
    const konto: TypingAccount = { id: "k", role: "schueler", name: "K", classCode: "X", createdAt: 1 };
    const { rerender } = render(
      <EigeneUebungLauf stand={stand(0)} account={konto} stufe="b" onTask={() => {}} />,
    );
    const onLetters = () => sitzung.props!.onLetters as (e: KeyEvent[]) => void;
    for (let z = 1; z <= 3; z++) {
      onLetters()([]);
      // Der Haken hat die gemeldete Zeile gespeichert - `startZeile` wächst
      // mit (genau so kam es vor Z1 zu 1, 3, 6).
      rerender(
        <EigeneUebungLauf stand={stand(gemeldet.at(-1)!)} account={konto} stufe="b" onTask={() => {}} />,
      );
    }
    expect(gemeldet).toEqual([1, 2, 3]);
    expect(sitzung.props!.initialQi).toBe(0);
  });
});
