/**
 * ★★★★ WÄCHTER: Die Ansage nennt die STELLE - und die Tonhöhe ist nur Zugabe.
 *
 * Johannes am 02.09.2026: *„Kannst du bei den Fehlern die Stimme hoch machen,
 * dass du buchstabierst und die vertauschten Buchstaben hoch sprichst?"*
 *
 * ★★★★★ Die Regel, die dieser Wächter festhält: **Wer die Tonhöhe nicht hört,
 * versteht den Satz trotzdem vollständig.** Systemstimmen setzen `pitch`
 * unterschiedlich stark um; auf manchen ist 1.5 kaum wahrnehmbar. Trüge die
 * Tonhöhe die Information, hätte ausgerechnet ein Kind mit einer schwachen
 * Stimme keine Chance - und würde den Fehler bei sich suchen. Deshalb prüft
 * der erste Test, dass der reine TEXT ohne jede Tonhöhe alles sagt.
 */
import { describe, expect, it } from "vitest";
import {
  FEHLER_PITCH,
  fehlerAnsage,
  fehlerSatz,
  findeFehlerstelle,
  istVertauschung,
  stellenName,
} from "@/lib/typing/fehlerstelle";

describe(`Die Fundstelle`, () => {
  it(`findet die erste abweichende Stelle`, () => {
    expect(findeFehlerstelle("Huas", "Haus")).toEqual({
      stelle: 2,
      getippt: "u",
      richtig: "a",
    });
  });

  it(`zaehlt ab eins - so wie ein Kind zaehlt`, () => {
    expect(findeFehlerstelle("Xaus", "Haus")?.stelle).toBe(1);
  });

  it(`meldet eine fehlende Stelle, wenn die Eingabe zu kurz ist`, () => {
    const f = findeFehlerstelle("Hau", "Haus");
    expect(f).toEqual({ stelle: 4, getippt: "", richtig: "s" });
  });

  it(`meldet eine ueberzaehlige Stelle, wenn die Eingabe zu lang ist`, () => {
    const f = findeFehlerstelle("Hause", "Haus");
    expect(f).toEqual({ stelle: 5, getippt: "e", richtig: "" });
  });

  it(`richtige Eingaben haben keine Stelle`, () => {
    expect(findeFehlerstelle("Haus", "Haus")).toBeNull();
    expect(findeFehlerstelle("  Haus  ", "Haus")).toBeNull();
  });

  it(`★★★★ eine VERTAUSCHUNG kommt durch - genau um sie ging es`, () => {
    expect(findeFehlerstelle("Huas", "Haus")).toEqual({
      stelle: 2,
      getippt: "u",
      richtig: "a",
    });
    expect(istVertauschung([..."Huas"], [..."Haus"])).toBe(true);
  });

  it(`★★★★ ein ganz anderes Wort bekommt KEINE Stelle - obwohl es auch zwei Unterschiede sind`, () => {
    // „Baum" gegen „Haus" hat genau so viele abweichende Zeichen wie eine
    // Vertauschung. Eine Grenze, die nur zaehlt, koennte beides nicht
    // auseinanderhalten - und wuerde hier eine Stelle nennen, die nichts
    // erklaert. Das Kind suchte dann am falschen Buchstaben.
    expect(findeFehlerstelle("Baum", "Haus")).toBeNull();
    expect(istVertauschung([..."Baum"], [..."Haus"])).toBe(false);
  });

  it(`eine leere Eingabe bekommt auch keine`, () => {
    expect(findeFehlerstelle("", "Haus")).toBeNull();
    expect(findeFehlerstelle("   ", "Haus")).toBeNull();
  });

  it(`Umlaute zaehlen als EIN Zeichen`, () => {
    expect(findeFehlerstelle("Bacher", "Bächer")).toEqual({
      stelle: 2,
      getippt: "a",
      richtig: "ä",
    });
  });
});

describe(`★★★★★ Die Ansage traegt ohne Tonhoehe`, () => {
  const f = { stelle: 3, getippt: "u", richtig: "a" };

  it(`der reine TEXT nennt Stelle, Getipptes und Richtiges`, () => {
    const satz = fehlerSatz(f, "de");
    expect(satz).toContain("Dritter Buchstabe");
    expect(satz).toContain("u");
    expect(satz).toContain("Richtig wäre");
    expect(satz).toContain("a");
  });

  it(`★★★★★ nur die EINZELN gesprochenen Buchstaben tragen eine Tonhoehe`, () => {
    // Eine Aeusserung hat genau eine Tonhoehe. Ein ganzer Satz mit erhoehtem
    // Pitch waere Gequietsche und wuerde nichts hervorheben.
    const stuecke = fehlerAnsage(f, "de");
    for (const s of stuecke) {
      if (s.pitch === undefined) continue;
      expect(s.pitch, `„${s.text}"`).toBe(FEHLER_PITCH);
      expect([...s.text], `„${s.text}" ist mehr als ein Zeichen`).toHaveLength(1);
    }
  });

  it(`genau zwei Stuecke sind hervorgehoben - das Getippte und das Richtige`, () => {
    const hoch = fehlerAnsage(f, "de").filter((s) => s.pitch !== undefined);
    expect(hoch.map((s) => s.text)).toEqual(["u", "a"]);
  });

  it(`fehlt ein Zeichen, sagt die Ansage das in Worten statt es hoch zu sprechen`, () => {
    const stuecke = fehlerAnsage({ stelle: 4, getippt: "", richtig: "s" }, "de");
    expect(stuecke.some((s) => s.text.includes("fehlt"))).toBe(true);
    expect(stuecke.filter((s) => s.pitch !== undefined).map((s) => s.text)).toEqual(["s"]);
  });

  it(`englisch sagt dasselbe`, () => {
    const satz = fehlerSatz(f, "en");
    expect(satz).toContain("Third letter");
    expect(satz).toContain("It should be");
  });

  it(`ab der elften Stelle wird gezaehlt statt benannt`, () => {
    expect(stellenName(3, "de")).toBe("Dritter Buchstabe");
    expect(stellenName(14, "de")).toBe("Buchstabe 14");
    expect(stellenName(14, "en")).toBe("Letter 14");
  });

  it(`⚠️ die Ansage bewertet nicht - kein „falsch", kein „leider"`, () => {
    for (const lang of ["de", "en"] as const) {
      const satz = fehlerSatz(f, lang).toLowerCase();
      for (const wort of ["falsch", "leider", "wrong", "sorry"])
        expect(satz.includes(wort), `„${wort}" in „${satz}"`).toBe(false);
    }
  });
});
