/**
 * ★★★★★ WÄCHTER: Die Klasse hat Vorrang (B9/B11, Umbau 11.09.2026).
 *
 * Johannes: *„Jede Klasse hat also nur eine Textstufe … Auch oben für die ganze
 * Klasse kann man die Sprache einstellen und ob man sie sperrt."*
 *
 * Gehört ein Konto einer Klasse an, gelten Textstufe, Sprache und Sperre der
 * KLASSE - gerechnet beim Laden (`useTypingAuth`), nicht in das Kind kopiert.
 * Das ist die EINE Stelle, an der das geschieht; alle Leser (`stufeFuer`,
 * Generator, Zahnrad, Einrichtung, Kopfzeile) holen das Konto von dort.
 *
 * Geprüft wird:
 *   1. `mitKlassenVorrang` selbst - die Rechnung, ohne Oberfläche;
 *   2. der Speicher: ein Klassenkind bekommt die Werte der Klasse nachgezogen;
 *   3. ein Ladefehler nimmt NICHTS weg;
 *   4. ein selbstlernendes Konto bleibt unberührt;
 *   5. die Einrichtung eines Klassenkindes hat keinen Schritt „alter".
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  mitKlassenVorrang,
  useTypingAuth,
  vergissGeladeneKlasse,
} from "@/components/typing/useTypingAuth";
import { einrichtungSchritte } from "@/lib/typing/einrichtung";
import type { TypingAccount, TypingClass } from "@/lib/typing";
import * as backendModul from "@/lib/typing/backend";

const lies = (pfad: string) => readFileSync(resolve(__dirname, "..", pfad), "utf-8");

const KLASSE: TypingClass = {
  code: "3B",
  name: "3b",
  teacherId: "t1",
  schulstufe: 7,
  schulstufeSchuljahr: new Date().getFullYear(),
  lang: "en",
  langLocked: true,
  createdAt: 0,
};

const KLASSENKIND: TypingAccount = {
  id: "p1",
  role: "schueler",
  name: "Mia",
  classCode: "3B",
  // Was am Konto steht - und was ab jetzt NICHT mehr gelesen wird.
  stufe: "kids",
  geburtsjahr: 2018,
  lang: "de",
  langLocked: false,
  createdAt: 0,
};

const SELBSTLERNEND: TypingAccount = {
  id: "s1",
  role: "schueler",
  name: "Jana",
  selfManaged: true,
  stufe: "kids",
  geburtsjahr: 2018,
  lang: "de",
  createdAt: 0,
};

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  // ⚠️ Der Merker der zuletzt geladenen Klasse ist ein Modul-Wert - ohne dies
  // sähe der zweite Fall die Klasse des ersten.
  vergissGeladeneKlasse();
});
afterEach(() => {
  useTypingAuth.setState({ account: null });
});

describe("★★★ mitKlassenVorrang - die Rechnung", () => {
  it("setzt Textstufe aus der Schulstufe, Sprache und Sperre der Klasse", () => {
    const k = mitKlassenVorrang(KLASSENKIND, KLASSE);
    // 7. Schulstufe ⇒ 13 Jahre ⇒ teens, obwohl am Konto „kids" steht.
    expect(k.stufe).toBe("teens");
    expect(k.lang).toBe("en");
    expect(k.langLocked).toBe(true);
  });

  it("nimmt dem Klassenkind sein Geburtsjahr - sonst gewänne es über stufeFuer", () => {
    expect(mitKlassenVorrang(KLASSENKIND, KLASSE).geburtsjahr).toBeUndefined();
  });

  it("ohne Klasse bleibt das Konto, wie es kam - ein Ladefehler nimmt nichts weg", () => {
    expect(mitKlassenVorrang(KLASSENKIND, null)).toBe(KLASSENKIND);
  });

  it("ohne Schulstufe gilt die Vorgabe teens, die Sprache des Kindes bleibt", () => {
    const ohne: TypingClass = { ...KLASSE, schulstufe: undefined, lang: undefined };
    const k = mitKlassenVorrang(KLASSENKIND, ohne);
    expect(k.stufe).toBe("teens");
    expect(k.lang).toBe("de");
  });

  // ★ Zeilenende mit Enter (23.09.2026): die Klasse entscheidet, nicht das Kind.
  it("übernimmt zeilenEndeEnter von der Klasse (an)", () => {
    const mitEnter: TypingClass = { ...KLASSE, zeilenEndeEnter: true };
    expect(mitKlassenVorrang(KLASSENKIND, mitEnter).zeilenEndeEnter).toBe(true);
  });

  it("übernimmt zeilenEndeEnter von der Klasse (aus, die Vorgabe)", () => {
    expect(mitKlassenVorrang(KLASSENKIND, KLASSE).zeilenEndeEnter).toBe(false);
  });
});

describe("★★★ useTypingAuth - die EINE Stelle, an der es geschieht", () => {
  it("ein Klassenkind bekommt die Werte der Klasse nachgezogen", async () => {
    const getClass = vi.fn().mockResolvedValue(KLASSE);
    vi.spyOn(backendModul, "typingBackend").mockReturnValue({
      getClass,
    } as unknown as ReturnType<typeof backendModul.typingBackend>);

    useTypingAuth.getState().login(KLASSENKIND);
    await vi.waitFor(() => {
      expect(useTypingAuth.getState().account?.stufe).toBe("teens");
    });
    const acc = useTypingAuth.getState().account!;
    expect(acc.lang).toBe("en");
    expect(acc.langLocked).toBe(true);
    expect(acc.geburtsjahr).toBeUndefined();
    expect(getClass).toHaveBeenCalledWith("3B");
  });

  it("scheitert das Laden, bleibt das Konto unverändert - nie etwas wegnehmen", async () => {
    vi.spyOn(backendModul, "typingBackend").mockReturnValue({
      getClass: vi.fn().mockRejectedValue(new Error("kein Netz")),
    } as unknown as ReturnType<typeof backendModul.typingBackend>);

    useTypingAuth.getState().login(KLASSENKIND);
    await new Promise((r) => setTimeout(r, 10));
    const acc = useTypingAuth.getState().account!;
    expect(acc.stufe).toBe("kids");
    expect(acc.lang).toBe("de");
    expect(acc.geburtsjahr).toBe(2018);
  });

  it("ein selbstlernendes Konto wird gar nicht erst gefragt", async () => {
    const getClass = vi.fn();
    vi.spyOn(backendModul, "typingBackend").mockReturnValue({
      getClass,
    } as unknown as ReturnType<typeof backendModul.typingBackend>);

    useTypingAuth.getState().login(SELBSTLERNEND);
    await new Promise((r) => setTimeout(r, 10));
    const acc = useTypingAuth.getState().account!;
    expect(acc.stufe).toBe("kids");
    expect(acc.geburtsjahr).toBe(2018);
    expect(getClass).not.toHaveBeenCalled();
  });
});

describe("★★★ B11/§2.3 - die Einrichtung eines Klassenkindes hat keinen Altersschritt", () => {
  it(`„alter" fällt für ein Klassenkind ganz weg`, () => {
    const mit = einrichtungSchritte({ klassenkind: true, mitStartpunkt: false });
    expect(mit).not.toContain("alter");
    // Der erste Schritt bleibt „willkommen", der Rest der Folge steht.
    expect(mit[0]).toBe("willkommen");
    expect(mit).toContain("tastatur");
  });

  it("wer zu keiner Klasse gehört, bekommt ihn weiterhin", () => {
    expect(einrichtungSchritte({ mitStartpunkt: true })).toContain("alter");
  });

  it(`ein Klassenkind mit gesperrter Sprache hat auch keinen Schritt „sprache"`, () => {
    const s = einrichtungSchritte({ klassenkind: true, langLocked: true });
    expect(s).not.toContain("alter");
    expect(s).not.toContain("sprache");
  });
});

describe("★ Zeilenende mit Enter (23.09.2026) - der Server-Wächter", () => {
  it("das Feld steht in setup.mjs, additiv (Bool)", () => {
    expect(lies("pocketbase/setup.mjs")).toContain('B("zeilenEndeEnter")');
  });
});
