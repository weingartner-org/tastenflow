/**
 * ★★★★★ WÄCHTER: WER STELLT WAS SELBST EIN? (19.09.2026)
 *
 * Johannes, wörtlich, in drei Schritten:
 *
 *   „die CVI-Einstellungen kann sich jedes Kind immer auch selbst in den
 *    Einstellungen einstellen, aber auch die Lehrkraft, Kinder dürfen es
 *    ändern wie sie möchten, natürlich auch Selbstlernende und welche ohne
 *    Account"
 *
 *   „Selbstlernende sollen sich alles einstellen können, Startstufe, Alter,
 *    CVI, Sprache, … alles"
 *
 *   „auch Leute ohne Anmeldung"
 *
 * Daraus die Regel:
 *   • „Zeichenabstand groß (CVI)" (`zeichenabstand`) stellt JEDE Person selbst
 *     ein - auch ein Kind einer Klasse. Die Lehrkraft weiter je Kind; wer
 *     zuletzt stellt, gilt.
 *   • Alles andere, was eine Lehrkraft je Kind einstellt (Einhand, Zeit
 *     lassen, Startpunkt, Geburtsjahr/Textstufe, Wochenziel), stellt jede
 *     Person OHNE Lehrkraft selbst ein - ein Konto ohne Lehrkraft am Server,
 *     Gäste und Lehrkräfte, die selbst üben, auf dem Gerät. Das Wochenziel
 *     gibt es nur mit Kind-Konto (es braucht die gespeicherten Übungszeilen).
 *   • Ein Kind einer Klasse sieht ausser dem Zeichenabstand keins davon.
 *
 * Vier Teile:
 *  1. DER SERVER-WÄCHTER (`tt_pupils_field_guard.pb.js`) - nicht als
 *     Text-Suche, sondern AUSGEFÜHRT: Die Datei wird geladen, wie PocketBase
 *     sie lädt, und ihr Handler bekommt ein nachgebautes Selbst-Update.
 *     ⚠️ Der Anlass: Bis 19.09.2026 stand `zeichenabstand` in der
 *     LOCKED-Liste UND hatte eine Ausnahme für Selbstlernende - die Liste
 *     setzte das Feld aber VOR der Ausnahme zurück. Eine Text-Suche („gibt es
 *     die Ausnahme?") war grün; ausgeführt hätte der Wächter gezeigt, dass
 *     nie jemand den Zeichenabstand selbst setzen konnte.
 *  2. DER SCHREIBWEG des Kindes (`pbBackend.ts`): die unveränderte
 *     `teacherUid` im Body, sonst weist die updateRule still ab.
 *  3. DIE SEITE mit echtem Konto im Anmeldezustand, für alle vier Kontoarten
 *     - welche Felder im Zahnrad stehen und wohin eine Wahl geht.
 *  4. Die Mouse-over-Hinweise: Kind und Lehrkraft lesen, dass es beide dürfen.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { typingBackend } from "../src/lib/typing/backend";
import { useDeviceEinhand } from "../src/lib/typing/einhand";
import { PocketBaseTypingBackend } from "../src/lib/typing/pbBackend";

// ── 1 · Der Server-Wächter, ausgeführt ─────────────────────────────────────

type Felder = Record<string, unknown>;

/** Ein Datensatz, wie ihn der Handler sieht: `get`/`set`/`getString`. */
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
  };
}

/**
 * Lädt die Hook-Datei wie PocketBase: als Programm, in dem
 * `onRecordUpdateRequest` den Handler anmeldet. Nichts aus dem Test ist im
 * Handler sichtbar ausser dem, was PocketBase ihm auch gibt (`e`).
 */
function ladeWaechter() {
  const quelle = readFileSync(
    resolve(__dirname, "../pocketbase/pb_hooks/tt_pupils_field_guard.pb.js"),
    "utf8",
  );
  const angemeldet: { handler: (e: unknown) => void; sammlung: string }[] = [];
  new Function("onRecordUpdateRequest", quelle)(
    (handler: (e: unknown) => void, sammlung: string) => angemeldet.push({ handler, sammlung }),
  );
  expect(angemeldet.length, "genau ein Handler").toBe(1);
  expect(angemeldet[0].sammlung).toBe("tt_pupils");
  return angemeldet[0].handler;
}

/** Ein Kind schreibt seinen EIGENEN Datensatz - was bleibt davon übrig? */
function selbstUpdate(gespeichert: Felder, body: Felder, authSammlung = "tt_pupils"): Felder {
  const handler = ladeWaechter();
  const stored = datensatz("k1", gespeichert);
  const record = datensatz("k1", { ...gespeichert, ...body });
  let weiter = false;
  handler({
    auth: { id: authSammlung === "tt_pupils" ? "k1" : "t1", collection: () => ({ name: authSammlung }) },
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
  teacherUid: "",
  classCode: "",
  name: "Mira",
  selfManaged: true,
  zeichenabstand: 1,
  oneHand: false,
  noTimePressure: false,
  wochenzielVerlauf: [],
  goalWeeks: [],
  goalCatchUp: false,
  goalExcusedWeeks: [],
  goalResetWeek: "",
  geburtsjahr: 0,
  startUnits: 0,
  startUnitsAt: 0,
  lang: "de",
  langLocked: false,
  bedienSprache: "",
  vorlesenPruefung: false,
  lessonLocks: [],
  probeBereit: null,
};
const SELBSTLERNEND_GESPEICHERT: Felder = { ...GRUND };
const KLASSENKIND_GESPEICHERT: Felder = {
  ...GRUND,
  teacherUid: "t1",
  classCode: "5A3",
  name: "Jano",
  selfManaged: false,
};

/** Was ein Konto ohne Lehrkraft selbst setzen darf - und ein Kind einer Klasse nicht. */
const NUR_OHNE_LEHRKRAFT: Felder = {
  oneHand: true,
  noTimePressure: true,
  wochenzielVerlauf: [{ ab: "2026-W40", minuten: 30 }],
  goalWeeks: ["2026-W40"],
  goalCatchUp: true,
  geburtsjahr: 2014,
  startUnits: 12,
  startUnitsAt: 1_758_000_000_000,
};

/** Was niemand über seinen eigenen Datensatz setzt - auch nicht ohne Lehrkraft. */
const NIE_SELBST: Felder = {
  vorlesenPruefung: true,
  lessonLocks: ["l3"],
  goalExcusedWeeks: ["2026-W39"],
  goalResetWeek: "2026-W39",
  langLocked: true,
  selfManaged: false,
  teacherUid: "fremd",
  classCode: "XYZ",
};

describe("1 · Der Server-Wächter, ausgeführt", () => {
  it("★★★★★ ein Kind EINER KLASSE setzt seinen Zeichenabstand selbst (3 kommt an)", () => {
    // Johannes: „die CVI-Einstellungen kann sich jedes Kind immer auch selbst
    // in den Einstellungen einstellen".
    expect(selbstUpdate(KLASSENKIND_GESPEICHERT, { zeichenabstand: 3 }).zeichenabstand).toBe(3);
  });

  it("★★★★ nur der WERT wird geprüft: 9, 0, -1 und Text bleiben beim gespeicherten", () => {
    for (const falsch of [9, 0, -1, 2.5, "abc", null]) {
      expect(
        selbstUpdate({ ...KLASSENKIND_GESPEICHERT, zeichenabstand: 2 }, { zeichenabstand: falsch })
          .zeichenabstand,
        `Wert ${String(falsch)}`,
      ).toBe(2);
    }
  });

  it("★★★★★ ein selbstlernendes Konto setzt ihn auch - vorher lief seine Ausnahme ins Leere", () => {
    expect(selbstUpdate(SELBSTLERNEND_GESPEICHERT, { zeichenabstand: 4 }).zeichenabstand).toBe(4);
  });

  it("★★★★★ ein Konto OHNE Lehrkraft setzt alles andere selbst: Einhand, Zeit lassen, Wochenziel, Geburtsjahr, Startpunkt", () => {
    const nachher = selbstUpdate(SELBSTLERNEND_GESPEICHERT, NUR_OHNE_LEHRKRAFT);
    for (const [feld, wert] of Object.entries(NUR_OHNE_LEHRKRAFT))
      expect(nachher[feld], feld).toEqual(wert);
  });

  it("★★★★ die Gegenprobe: ein Kind EINER KLASSE setzt davon nichts selbst - das bleibt bei der Lehrkraft", () => {
    // Ohne diesen Fall wäre der Test darüber auch grün, wenn der Wächter
    // gar nichts mehr schützte.
    const nachher = selbstUpdate(KLASSENKIND_GESPEICHERT, NUR_OHNE_LEHRKRAFT);
    for (const feld of Object.keys(NUR_OHNE_LEHRKRAFT))
      expect(nachher[feld], feld).toEqual(KLASSENKIND_GESPEICHERT[feld]);
  });

  it("★★★ was eine Klasse braucht (Vorlesen bei Prüfungen, Lektions-Freigaben, Erlassen, Zurücksetzen) setzt niemand selbst", () => {
    for (const gespeichert of [SELBSTLERNEND_GESPEICHERT, KLASSENKIND_GESPEICHERT]) {
      const nachher = selbstUpdate(gespeichert, NIE_SELBST);
      for (const feld of Object.keys(NIE_SELBST))
        expect(nachher[feld], `${String(gespeichert.name)}: ${feld}`).toEqual(gespeichert[feld]);
    }
  });

  it("★★ die Lehrkraft läuft nicht durch den Wächter - ihr Zeichenabstand und ihr Einhand kommen an", () => {
    const nachher = selbstUpdate(
      KLASSENKIND_GESPEICHERT,
      { zeichenabstand: 3, oneHand: true },
      "tt_teachers",
    );
    expect(nachher.zeichenabstand).toBe(3);
    expect(nachher.oneHand).toBe(true);
  });

  it("★★★ `zeichenabstand` steht nicht mehr in der LOCKED-Liste (sonst liefe jede Ausnahme ins Leere)", () => {
    const waechter = readFileSync(
      resolve(__dirname, "../pocketbase/pb_hooks/tt_pupils_field_guard.pb.js"),
      "utf8",
    );
    const locked = waechter.slice(waechter.indexOf("const LOCKED = ["), waechter.indexOf("];"));
    expect(locked.length, "Gegenprobe: die LOCKED-Liste wurde gefunden").toBeGreaterThan(100);
    for (const feld of ["zeichenabstand", "oneHand", "wochenzielVerlauf", "goalWeeks", "goalCatchUp"])
      expect(locked, feld).not.toMatch(new RegExp(`^\\s*"${feld}",`, "m"));
  });
});

// ── 2 · Der Schreibweg des Kindes ───────────────────────────────────────────

describe("2 · pbBackend: die updateRule verlangt die unveränderte teacherUid", () => {
  function mitAngemeldet(record: Record<string, unknown>) {
    const b = new PocketBaseTypingBackend();
    const update = vi.fn(async (id: string, body: Record<string, unknown>) => ({
      id,
      collectionName: "tt_pupils",
      name: "Jano",
      ...body,
    }));
    (b as unknown as { pb: unknown }).pb = {
      authStore: { record, isValid: true },
      collection: () => ({ update }),
    };
    return { b, update };
  }

  it("★★★★★ das Kind selbst: `zeichenabstand` geht MIT `teacherUid` (ohne sie: stilles 404)", async () => {
    const { b, update } = mitAngemeldet({ collectionName: "tt_pupils", id: "k1", teacherUid: "t1" });
    const konto = await b.setZeichenabstand("k1", 3);
    expect(update).toHaveBeenCalledWith("k1", { zeichenabstand: 3, teacherUid: "t1" });
    expect(konto?.zeichenabstand).toBe(3);
  });

  it("★★★ ein Konto ohne Lehrkraft: Einhand und Zeit lassen gehen denselben Weg", async () => {
    const { b, update } = mitAngemeldet({ collectionName: "tt_pupils", id: "k2", teacherUid: "" });
    await b.setOneHand("k2", true);
    await b.setNoTimePressure("k2", true);
    expect(update).toHaveBeenCalledWith("k2", { oneHand: true, teacherUid: "" });
    expect(update).toHaveBeenCalledWith("k2", { noTimePressure: true, teacherUid: "" });
  });

  it("★★ die Lehrkraft für ein Kind: OHNE teacherUid (für sie gilt die andere Regel-Hälfte)", async () => {
    const { b, update } = mitAngemeldet({ collectionName: "tt_teachers", id: "t1" });
    await b.setZeichenabstand("k1", 2);
    expect(update).toHaveBeenCalledWith("k1", { zeichenabstand: 2 });
  });
});

// ── 3 · Die Seite, für alle vier Kontoarten ─────────────────────────────────

const LEHRKRAFT = {
  id: "t-heike",
  role: "lehrkraft" as const,
  name: "Heike",
  email: "heike@example.org",
  createdAt: 1,
};
const KLASSENKIND = {
  id: "p-jano",
  role: "schueler" as const,
  name: "Jano",
  classCode: "5A3",
  createdAt: 1,
};
const SELBSTLERNEND = {
  id: "p-frei",
  role: "schueler" as const,
  name: "Mira",
  selfManaged: true,
  createdAt: 1,
};

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
  localStorage.clear();
  useDeviceEinhand.setState({ on: false });
  einrichtungFertigMerken();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function zeigeZahnradFuer(konto: unknown) {
  useTypingAuth.setState({ account: konto as never });
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: /Mein Training/i });
  fireEvent.click(screen.getByRole("button", { name: /Einstellungen/i }));
  await screen.findByRole("dialog");
}

const feld = (name: string) => document.querySelector(`[aria-label="${name}"]`);
const knopf = (muster: RegExp) =>
  (Array.from(document.querySelectorAll("button")).find((b) =>
    muster.test(b.textContent ?? ""),
  ) as HTMLButtonElement | undefined) ?? null;
const zeichenabstandFeld = () =>
  screen.queryByRole("combobox", { name: "Zeichenabstand groß (CVI)" }) as HTMLSelectElement | null;

describe("3 · Die Seite: wer sieht was im Zahnrad?", () => {
  it("★★★★★ Kind einer Klasse: sieht das Auswahlfeld, und seine Wahl geht an den Server", async () => {
    const setZeichenabstand = vi
      .spyOn(typingBackend(), "setZeichenabstand")
      .mockResolvedValue({ ...KLASSENKIND, zeichenabstand: 3 } as never);
    await zeigeZahnradFuer(KLASSENKIND);
    const auswahl = zeichenabstandFeld();
    expect(auswahl, "das Kind einer Klasse bekommt ein FELD, keinen Satz").toBeTruthy();
    expect(document.body.textContent).not.toMatch(/deine Lehrkraft hat das eingestellt/);
    fireEvent.change(auswahl!, { target: { value: "3" } });
    expect(setZeichenabstand).toHaveBeenCalledWith("p-jano", 3);
    await waitFor(() => expect(useTypingAuth.getState().account?.zeichenabstand).toBe(3));
  });

  it("★★★★ Kind einer Klasse - die Gegenprobe: ausser dem Zeichenabstand nichts davon", async () => {
    await zeigeZahnradFuer(KLASSENKIND);
    expect(feld("Startpunkt im Lernstoff"), "Startpunkt").toBeNull();
    expect(feld("Geburtsjahr"), "Geburtsjahr").toBeNull();
    expect(feld("Textstufe (Alter)"), "Textstufe").toBeNull();
    expect(knopf(/Einhand schreiben/), "Einhand").toBeNull();
    expect(feld("Minuten pro Woche"), "Wochenziel").toBeNull();
    expect(knopf(/Zeit lassen:/)!.disabled, "Zeit lassen bleibt bei der Lehrkraft").toBe(true);
  });

  it("★★★★★ selbstlernendes Konto: jedes Feld steht da - Startpunkt, Alter, Sprache, CVI, Einhand, Zeit lassen, Wochenziel", async () => {
    await zeigeZahnradFuer(SELBSTLERNEND);
    await waitFor(() => expect(feld("Startpunkt im Lernstoff")).toBeTruthy());
    expect(feld("Textstufe (Alter)"), "Textstufe").toBeTruthy();
    expect(feld("Geburtsjahr"), "Geburtsjahr").toBeTruthy();
    expect(feld("Sprache der Texte"), "Sprache").toBeTruthy();
    expect(zeichenabstandFeld(), "Zeichenabstand").toBeTruthy();
    expect(knopf(/Einhand schreiben/), "Einhand").toBeTruthy();
    expect(knopf(/Zeit lassen:/)!.disabled).toBe(false);
    expect(feld("Minuten pro Woche"), "Wochenziel").toBeTruthy();
    expect(knopf(/Verpasste Minuten der vergangenen Wochen nachholen/), "Nachholen").toBeTruthy();
  });

  it("★★★★ selbstlernendes Konto: Einhand und Wochenziel gehen an sein Konto", async () => {
    const setOneHand = vi
      .spyOn(typingBackend(), "setOneHand")
      .mockResolvedValue({ ...SELBSTLERNEND, oneHand: true } as never);
    const setWochenziel = vi.spyOn(typingBackend(), "setWochenziel").mockResolvedValue(null);
    await zeigeZahnradFuer(SELBSTLERNEND);
    fireEvent.click(knopf(/Einhand schreiben: aus/)!);
    expect(setOneHand).toHaveBeenCalledWith("p-frei", true);
    fireEvent.change(feld("Minuten pro Woche")!, { target: { value: "30" } });
    expect(setWochenziel).toHaveBeenCalledWith("p-frei", {
      minuten: 30,
      wochen: [],
      nachholen: false,
    });
    fireEvent.click(knopf(/nachholen: aus/)!);
    expect(setWochenziel).toHaveBeenLastCalledWith("p-frei", {
      minuten: 0,
      wochen: [],
      nachholen: true,
    });
  });

  for (const [wer, konto] of [
    ["Gast ohne Anmeldung", null],
    ["Lehrkraft, die selbst übt", LEHRKRAFT],
  ] as const) {
    it(`★★★★ ${wer}: CVI, Einhand, Zeit lassen, Startpunkt, Alter - das Gerät merkt sich Einhand`, async () => {
      const setOneHand = vi.spyOn(typingBackend(), "setOneHand");
      await zeigeZahnradFuer(konto);
      await waitFor(() => expect(feld("Startpunkt im Lernstoff")).toBeTruthy());
      expect(zeichenabstandFeld(), "Zeichenabstand").toBeTruthy();
      expect(feld("Geburtsjahr"), "Geburtsjahr").toBeTruthy();
      expect(feld("Textstufe (Alter)"), "Textstufe").toBeTruthy();
      expect(knopf(/Zeit lassen:/)!.disabled).toBe(false);
      // Das Wochenziel braucht ein Kind-Konto - hier gibt es keins.
      expect(feld("Minuten pro Woche"), "kein Wochenziel ohne Kind-Konto").toBeNull();

      const einhand = knopf(/Einhand schreiben: aus/);
      expect(einhand, "Einhand").toBeTruthy();
      expect(einhand!.getAttribute("aria-pressed")).toBe("false");
      fireEvent.click(einhand!);
      expect(useDeviceEinhand.getState().on).toBe(true);
      expect(localStorage.getItem("tippen-einhand")).toBe("1");
      expect(setOneHand, "nicht in tt_pupils - dort gibt es keinen Datensatz").not.toHaveBeenCalled();
      await waitFor(() =>
        expect(knopf(/Einhand schreiben: an/)!.getAttribute("aria-pressed")).toBe("true"),
      );
    });
  }
});

// ── 4 · Die Hinweise ─────────────────────────────────────────────────────────

describe("4 · Die Mouse-over-Hinweise sagen, dass Kind UND Lehrkraft es dürfen", () => {
  it("★★★★ das Kind liest im Zahnrad, dass es den Abstand selbst umstellt", async () => {
    await zeigeZahnradFuer(KLASSENKIND);
    const hinweis = document.getElementById(zeichenabstandFeld()!.getAttribute("aria-describedby")!)!;
    expect(hinweis.textContent).toContain("Du kannst ihn hier jederzeit selbst umstellen");
    expect(hinweis.textContent).toContain("kann ihn auch deine Lehrkraft einstellen");
    // Der Satz vom Gleiten bleibt.
    expect(hinweis.textContent).toContain("Die Übungszeile gleitet dabei im eigenen Schreibtakt");
  });

  it("★★★★ die Lehrkraft liest am Auswahlfeld des Kindes, dass das Kind es selbst ändern kann (de und en)", () => {
    const quelle = readFileSync(
      resolve(__dirname, "../src/components/lernwerkstatt/klasse/TastenflowReiter.tsx"),
      "utf8",
    );
    const de = /abstandTipp: `([^`]*)`/.exec(quelle)?.[1] ?? "";
    expect(de).toContain("Das Kind kann den Abstand auch selbst in seinen Einstellungen");
    expect(de).toContain("und Sie jederzeit wieder hier");
    expect(de).toContain("Die Übungszeile gleitet dabei im Schreibtakt des Kindes");
    const en = quelle.match(/"More space between EVERY character[^"]*"/)?.[0] ?? "";
    expect(en).toContain("The pupil can also change the spacing in their own settings");
    expect(en).toContain("The practice line glides to the next character");
  });
});
