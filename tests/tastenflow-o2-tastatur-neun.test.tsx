/**
 * ★★★ WÄCHTER O2-TASTATUR (30.10.2026): Tasten finden, Fenster, Stand-Zeile, Totasten-Texte, Landes-Tastatur, Tastatur-Namen und
 * Zahlendiktat in den neun Sprachen (bg el hu nl pt br ro sv uk). Bis hierher fielen alle diese Stellen auf Englisch.
 */
import { afterEach, describe, expect, it } from "vitest";
import { findenAuftrag, findenAuftragKurz, findenGefunden, nennungKurz, type FindenZiel } from "@/lib/typing/findenRunde";
import { STAND_TEXTE } from "@/components/typing/StandZeile";
import { FENSTER_TEXTE_NEUN } from "@/components/typing/tastenErkundenTexteNeun";
import {
  feststelltasteHinweisText,
  polnischerBuchstabeHinweis,
  totasteAnsage,
  totasteName,
  totasteWartetText,
  umschaltVorTildeText,
} from "@/lib/typing/totastenTexte";
import { TASTATUR_DES_LANDES, tastaturDesLandes } from "@/lib/typing/landesTastatur";
import { LAYOUTS, layoutTexte, setLayout } from "@/lib/typing/layouts";
import { layoutTexteIn } from "@/lib/typing/tastaturTexteIt";
import { ALLE_SPRACHEN, GERUEST_SPRACHEN } from "@/lib/typing/sprachRegister";
import { tasteMitId } from "@/lib/computer/tastenNamen";
import { zahlendiktat } from "@/lib/typing/uebungsformen/zahlendiktat";
import { zahlwortEl } from "@/lib/typing/zahlwortEl";
import { erkenneTastatur } from "@/lib/typing/tastaturErkennung";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import { LERNWEGE, type Lernweg } from "@/lib/typing/lernweg";
import type { Lang } from "@/lib/typing/account";

afterEach(() => setLayout("de"));

const STRICH = /[–—]/;
const MAUS = /\b(click|klick|mouse|maus)\b/i;

describe("★★★ Tasten finden", () => {
  const punkt: FindenZiel = { art: "zeichen", zeichen: "." };
  const zwei: FindenZiel = { art: "zeichen", zeichen: "5" };
  const buchstabe: FindenZiel = { art: "zeichen", zeichen: "a" };
  const tab: FindenZiel = { art: "sonder", taste: tasteMitId("tabulator", "windows")! };

  it.each(GERUEST_SPRACHEN)("%s: kein Satz ist der englische, keiner endet mit einer Ziffer und Punkt", (s) => {
    for (const z of [punkt, zwei, buchstabe, tab]) {
      for (const satz of [findenAuftrag(z, "windows", s), findenAuftragKurz(z, "windows", s), findenGefunden(z, "windows", s)]) {
        expect(satz).not.toBe("");
        expect(satz).not.toMatch(/\b(Find|Found|With|Press)\b/);
        expect(satz).not.toMatch(/\d\.$/);
        expect(satz).not.toMatch(STRICH);
        expect(satz).not.toBe(findenAuftrag(z, "windows", "en"));
      }
    }
    // Der Name des Zeichens steht drin, in der Sprache - nie das englische „full stop".
    expect(nennungKurz(punkt, "akkusativ", "windows", s)).not.toContain("full stop");
  });

  it("die Veränderer-Taste im Auftrag: sv Skift, el Alt Gr", () => {
    setLayout("sv");
    expect(findenAuftrag({ art: "zeichen", zeichen: "!", mod: "shift" }, "windows", "sv")).toContain("Skift");
    expect(findenAuftrag({ art: "zeichen", zeichen: "@", mod: "altgr" }, "windows", "el")).toContain("Alt Gr");
  });

  it("Ukrainisch beugt das Kopfwort: Auftrag im Akkusativ, Nennung im Nominativ", () => {
    expect(nennungKurz(buchstabe, "akkusativ", "windows", "uk")).toContain("літеру");
    expect(nennungKurz(buchstabe, "nominativ", "windows", "uk")).toContain("літера");
  });
});

describe("★ Fenster und Stand-Zeile", () => {
  it.each(GERUEST_SPRACHEN)("%s: Fenster-Texte vollständig, Name nach Glossar, Hausregeln", (s) => {
    const t = FENSTER_TEXTE_NEUN[s];
    for (const [k, w] of Object.entries(t)) {
      if (typeof w !== "string") continue;
      expect(w.trim(), k).not.toBe("");
      expect(w, k).not.toMatch(STRICH);
      expect(w, k).not.toMatch(MAUS);
    }
    expect(t.begruessung).toContain(t.erkunden);
    expect(t.begruessung).toContain(t.ausstieg);
    expect(t.zuFinden).toContain("Alt + 4");
    expect(t.zuAlle).toContain("Alt + 5");
    expect(t.tasteVon(3, 20).join("")).toContain("3");
    expect(t.tasteVon(3, 20).join("")).toContain("20");
  });

  it.each(GERUEST_SPRACHEN)("%s: Stand-Zeile eigen, die Taste beim Namen der Sprache", (s) => {
    const t = STAND_TEXTE[s];
    const en = STAND_TEXTE.en;
    for (const k of ["stufeTipp", "naechsteTasteTipp", "naechsteTaste", "alleGelernt", "spielenTipp", "matchTipp", "klassenmatch"] as const) {
      expect(t[k], k).not.toBe(en[k]);
      expect(t[k], k).not.toMatch(STRICH);
    }
    expect(t.naechsteTasteName("a")).toContain(t.naechsteTaste);
    expect(t.naechsteTasteName(".")).not.toContain("full stop");
    expect(t.matchTipp).toContain(t.klassenmatch);
  });
});

describe("★ Totasten-Texte", () => {
  it.each(GERUEST_SPRACHEN)("%s", (s) => {
    expect(feststelltasteHinweisText(s)).not.toBe(feststelltasteHinweisText("en"));
    expect(umschaltVorTildeText(s)).not.toBe(umschaltVorTildeText("en"));
    expect(totasteWartetText(null, s)).not.toBe(totasteWartetText(null, "en"));
    expect(totasteWartetText("^", s)).not.toBe(totasteWartetText("^", "en"));
    expect(totasteWartetText("΄", s)).not.toContain("waiting");
    expect(totasteWartetText("~", s)).not.toContain("waiting");
    for (const tot of ["^", "¨", "`", "¸", "ˇ", "΄", "΅", "˘", "˝", "˛", "˙", "´"]) expect(totasteName(tot, s), tot).toBeTruthy();
    expect(totasteAnsage({ zeichen: "ά", tot: "΄", dann: "α" }, s)).not.toContain("then");
    expect(totasteAnsage({ zeichen: "ά", tot: "΄", dann: "α" }, s)).toContain(totasteName("΄", s)!);
  });

  it("Griechisch nennt die Totaste τόνος; der Hinweis zum AltGr-Buchstaben steht in der Sprache", () => {
    expect(totasteName("΄", "el")).toBe("τόνος");
    expect(totasteWartetText("΄", "el")).toContain("τόνος");
    setLayout("pl");
    expect(polnischerBuchstabeHinweis("sv", "ą", "a")).toContain("Bokstaven");
  });
});

describe("★ Landes-Tastatur und Namen der Tastaturen", () => {
  it("jede der 17 Bedienungen kennt alle 17 Sprachen, und jede Zeile ist eigen", () => {
    const sprachen = ALLE_SPRACHEN as readonly Lang[];
    for (const b of sprachen) {
      expect(Object.keys(TASTATUR_DES_LANDES[b]).sort()).toEqual([...sprachen].sort());
      for (const w of sprachen) expect(tastaturDesLandes(b, w), `${b}/${w}`).toBeTruthy();
    }
    for (const b of GERUEST_SPRACHEN) {
      expect(new Set(Object.values(TASTATUR_DES_LANDES[b])).size).toBe(17);
      expect(tastaturDesLandes(b, "fr")).not.toBe(tastaturDesLandes("en", "fr"));
    }
    expect(() => tastaturDesLandes("bg", "xx" as Lang)).toThrow();
  });

  it("Stichproben der Formen für den Satz in der Einrichtung", () => {
    expect(tastaturDesLandes("el", "fr")).toBe("γαλλικά");
    expect(tastaturDesLandes("ro", "fr")).toBe("franceze");
    expect(tastaturDesLandes("pt", "pl")).toBe("polacos");
    expect(tastaturDesLandes("br", "pl")).toBe("poloneses");
    expect(tastaturDesLandes("sv", "de")).toBe("tyska");
  });

  it.each(GERUEST_SPRACHEN)("%s: layoutTexte liefert dieselben Namen wie layoutTexteIn, nie die englischen", (s) => {
    for (const l of LAYOUTS) expect(layoutTexte(l, s)).toEqual(layoutTexteIn(l, s));
    const pt = LAYOUTS.find((l) => l.id === "bg")!;
    if (s !== "bg") expect(layoutTexte(pt, s).label).not.toBe(pt.en.label);
  });

  it("die acht alten Bedienungen bleiben, wie sie waren: Französisch weiter aus seiner Tabelle, it ohne Verteiler weiter Englisch", () => {
    const de = LAYOUTS.find((l) => l.id === "de")!;
    expect(layoutTexte(de, "de").label).toBe(de.label);
    expect(layoutTexte(de, "en")).toEqual(de.en);
    expect(layoutTexte(de, "it")).toEqual(de.en);
  });
});

describe("★ Tastatur-Erkennung: die 15 Tastaturen, die erkennbar sind, werden erkannt (nichts zu bauen, nur belegt)", () => {
  const code = (r: number, i: number) =>
    [
      ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal"],
      ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"],
      ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backslash"],
      ["IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash"],
    ][r][i];
  it.each(["bg", "bg-schreibm", "bg-phon", "bg-phon-trad", "el", "el-319", "hu", "hu-101", "nl-dutch", "pt", "br-abnt2", "ro", "sv", "ua", "ua-std"])("%s", (id) => {
    const l = LAYOUTS.find((x) => x.id === id)!;
    const karte = new Map<string, string>();
    l.rows.forEach((reihe, r) => {
      // ANSI ohne Taste neben dem linken Shift: die erste Taste der unteren Reihe ist z (Taste KeyZ).
      const versatz = r === 3 && reihe.keys.length === 10 ? 1 : 0;
      reihe.keys.forEach((k, i) => karte.set(code(r, i + versatz), k));
    });
    expect(erkenneTastatur(karte)).toEqual({ art: "app", id });
  });
});

describe("★★★ Zahlendiktat", () => {
  const ctx = (lang: Lang, lernweg: Lernweg, bedienung: Lang, zufallWert: number): FormKontext =>
    ({
      lang,
      lernweg,
      bedienung,
      introduced: [...LERNWEGE[lernweg].letterOrder, ..."0123456789.,"],
      shift: true,
      oneHand: false,
      stufe: "teens",
      count: 10,
      zufall: (() => {
        let x = zufallWert;
        return () => {
          x = (x * 9301 + 49297) % 233280;
          return x / 233280;
        };
      })(),
    }) as unknown as FormKontext;

  it("Griechisch nimmt beide Formen an, auch in Zusammensetzungen; die Auflösung bleibt die Schulform", () => {
    const f = zahlendiktat.fragen!;
    const alle = new Map<string, string[]>();
    for (let seed = 1; seed < 40; seed++) {
      for (const a of f(ctx("el", "el", "el", seed))) if (a.antworten.length > 1) alle.set(a.antworten[0], [...a.antworten]);
    }
    expect(alle.size).toBeGreaterThan(0);
    for (const [schule, antworten] of alle) {
      expect(schule).toMatch(/επτά|οκτώ|εννέα/);
      expect(antworten[1]).toMatch(/εφτά|οχτώ|εννιά/);
      expect(antworten).toHaveLength(2);
    }
    expect(zahlwortEl(17)).toBe("δεκαεπτά");
  });

  it.each(GERUEST_SPRACHEN)("%s: die Rahmensätze sind die eigenen; nach der Zahl am Satzende kein Punkt", (s) => {
    const k = ctx(s, s, s, 7);
    expect(zahlendiktat.ankuendigung(k)).not.toContain("number dictation");
    const fragen = zahlendiktat.fragen!(k);
    expect(fragen.length).toBeGreaterThan(0);
    for (const a of fragen) {
      expect(a.frage).not.toMatch(/\b(Type it)\b/);
      expect(a.frage).not.toMatch(/\d\.$/);
      expect(a.frage).not.toMatch(STRICH);
    }
  });
});
