/**
 * ★★★ WÄCHTER: die sechs Wortspiele, die auf Weg „fr" bis E10b-2 leer waren
 * (Lückentext, Korrekturlesen, Hand-Schwerpunkte, Buchstabensalat, Der lange
 * Satz, Was fehlt hier?) und die Geläufigkeit - ihr französischer Inhalt
 * (26.09.2026, Bauplan französischer Lehrgang §8.1).
 *
 * Geprüft wird der INHALT nach den Hausregeln (Form, Tippbarkeit, kein Deutsch
 * und kein Englisch, hörbare Fehler beim Korrekturlesen) und eine ganze Runde
 * jeder Form an echten Haltestellen der französischen Reihenfolge - auf
 * AZERTY und auf der Schweizer Tastatur.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { CORPUS_FR, fitText } from "@/lib/typing/corpus";
import { isRealWord } from "@/lib/typing/lexicon";
import { WORDS_FR } from "@/lib/typing/wordsFr";
import { WORDS_FR_EXPEDITION } from "@/lib/typing/expedition/words";
import { fingerForChar } from "@/lib/typing/fingers";
import { UEBUNGSFORMEN, type FormKontext } from "@/lib/typing/uebungsformen";
import { RAETSEL_FR } from "@/lib/typing/uebungsformen/lueckentextFr";
import { KORREKTUR_FR } from "@/lib/typing/uebungsformen/korrekturlesenFr";
import { WORTKETTEN_FR } from "@/lib/typing/uebungsformen/wortkettenFr";
import { VERBINDUNGEN_FR } from "@/lib/typing/uebungsformen/gelaeufigkeitFr";
import { SALATWOERTER_FR } from "@/lib/typing/uebungsformen/buchstabensalatFr";
import { SALAT_ZIEL, pruefeSalatwort, salatVorrat, waehleSalatwort } from "@/lib/typing/uebungsformen/buchstabensalat";
import { SALAT_KEINE_WOERTER, SALAT_NAMEN } from "@/lib/typing/uebungsformen/salatNamen";

afterEach(() => setLayout("de"));

/**
 * Französische Wörter aus diesen Inhalten, die das Lexikon (`lexicon.ts`,
 * Fach „fr") noch NICHT kennt - von Hand geprüft (26.09.2026, Manulex bzw.
 * Wörterbuch), jedes ein gewöhnliches französisches Wort, das es zufällig
 * auch im Deutschen oder Englischen gibt. ⚠️ Sie gehören in `NACHTRAG_FR`
 * (sonst buchstabiert die Sprachausgabe „salé") - Befund E10b-2, offene Frage.
 */
const GEPRUEFT_FRANZOESISCH = [
  "salé", "touches", "braille", "rails", "saint", "beige", "beurres", "fours", "crosse", "peurs",
  "flotte", "short",
];

/** Der französische Wortschatz der App: Korpus „fr", WORDS_FR, Expedition, Lexikon. */
const FR_WOERTER = new Set<string>([
  ...WORDS_FR,
  ...WORDS_FR_EXPEDITION,
  ...GEPRUEFT_FRANZOESISCH,
  ...CORPUS_FR.flatMap((c) => c.text.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean)),
]);
/** Kennen Deutsch oder Englisch das Wort, Französisch aber nicht? */
function fremdesWort(wort: string): boolean {
  const w = wort.toLowerCase();
  if (w.length < 3 || FR_WOERTER.has(w) || isRealWord(w, "fr")) return false;
  return isRealWord(w, "de") || isRealWord(w, "en");
}
function fremdeWoerter(texte: readonly string[]): string[] {
  return [...new Set(texte.flatMap((t) => t.split(/[^\p{L}]+/u).filter(Boolean)).filter(fremdesWort))];
}

/** Buchstaben, die zwei Anschläge brauchen (Totaste) oder auf keiner Pflicht-Tastatur liegen. */
const ZWEI_ANSCHLAEGE = /[êâîôûëïüÿœæ]/i;

describe("★ Lückentext (Texte à trous)", () => {
  it("genug Rätsel, jedes mit genau einer Lücke und mindestens einer Lösung", () => {
    expect(RAETSEL_FR.length).toBeGreaterThanOrEqual(100);
    for (const r of RAETSEL_FR) {
      expect(r.satz.split("...").length - 1, r.satz).toBe(1);
      expect(r.loesungen.length, r.satz).toBeGreaterThan(0);
      expect(r.stufen.length, r.satz).toBeGreaterThan(0);
    }
  });

  it("jede Lösung ist mit einer Taste je Buchstabe tippbar - kein ê, ï, œ, kein É am Anfang", () => {
    const falsch = RAETSEL_FR.flatMap((r) => r.loesungen).filter((l) => ZWEI_ANSCHLAEGE.test(l) || /^[ÉÀÈ]/.test(l));
    expect(falsch).toEqual([]);
  });

  it("jeder Satz ist nur einmal da", () => {
    const saetze = RAETSEL_FR.map((r) => r.satz);
    expect(saetze.filter((s, i) => saetze.indexOf(s) !== i)).toEqual([]);
  });

  it("keine deutschen oder englischen Wörter", () => {
    expect(fremdeWoerter(RAETSEL_FR.flatMap((r) => [r.satz, ...r.loesungen]))).toEqual([]);
  });

  it("Gegenprobe: ein deutscher Satz fiele auf", () => {
    expect(fremdeWoerter(["Die Katze fängt gerne ..."]).length).toBeGreaterThan(0);
  });
});

describe("★ Korrekturlesen", () => {
  it("genug Fälle; das falsche Wort steht im Satz, das richtige ist ein anderes", () => {
    expect(KORREKTUR_FR.length).toBeGreaterThanOrEqual(20);
    for (const f of KORREKTUR_FR) {
      expect(f.satz.split(/[^\p{L}']+/u), f.satz).toContain(f.falsch);
      expect(f.falsch).not.toBe(f.richtig);
      expect(ZWEI_ANSCHLAEGE.test(f.richtig), f.richtig).toBe(false);
    }
  });

  it("der Fehler ist HÖRBAR: die ersten beiden Buchstaben unterscheiden sich, und kein bekanntes Gleichklang-Paar", () => {
    const GLEICHKLANG = [["mer", "mère"], ["lait", "laid"], ["verre", "vert"], ["cou", "coup"], ["pain", "pin"], ["sang", "cent"]];
    for (const f of KORREKTUR_FR) {
      expect(f.falsch.slice(0, 2), `${f.falsch}/${f.richtig}`).not.toBe(f.richtig.slice(0, 2));
      for (const [a, b] of GLEICHKLANG)
        expect([f.falsch, f.richtig].sort(), `${f.falsch}/${f.richtig}`).not.toEqual([a, b].sort());
    }
  });

  it("das falsche Wort ist ein echtes französisches Wort", () => {
    const unbekannt = KORREKTUR_FR.filter((f) => !FR_WOERTER.has(f.falsch) && !isRealWord(f.falsch, "fr")).map((f) => f.falsch);
    expect(unbekannt).toEqual([]);
  });

  it("keine deutschen oder englischen Wörter", () => {
    expect(fremdeWoerter(KORREKTUR_FR.flatMap((f) => [f.satz, f.richtig]))).toEqual([]);
  });
});

describe("★ Hand-Schwerpunkte: die Wortketten", () => {
  it("jede Kette hat mindestens zwölf Wörter, klein, ohne Doppelte, ohne Totasten-Buchstaben", () => {
    for (const k of WORTKETTEN_FR) {
      expect(k.woerter.length, k.thema).toBeGreaterThanOrEqual(12);
      expect(new Set(k.woerter).size, k.thema).toBe(k.woerter.length);
      for (const w of k.woerter) expect(w, k.thema).toMatch(/^[a-zéèàçù]+$/);
    }
  });

  for (const tastatur of ["fr", "ch-fr", "ca-csa"] as const) {
    it(`${tastatur}: für beide Hände je mindestens zwölf einhändige Wörter`, () => {
      setLayout(tastatur);
      const alle = [...new Set(WORTKETTEN_FR.flatMap((k) => k.woerter))];
      for (const hand of ["links", "rechts"] as const) {
        const einhaendig = alle.filter((w) => [...w].every((c) => fingerForChar(c)?.hand === hand));
        expect(einhaendig.length, `${tastatur} ${hand}: ${einhaendig.join(" ")}`).toBeGreaterThanOrEqual(12);
      }
    });
  }

  it("keine deutschen oder englischen Wörter", () => {
    expect(fremdeWoerter(WORTKETTEN_FR.flatMap((k) => k.woerter))).toEqual([]);
  });
});

describe("★ Geläufigkeit: die Verbindungen", () => {
  it("jedes Wort trägt seine Verbindung an der genannten Stelle", () => {
    const falsch: string[] = [];
    for (const v of VERBINDUNGEN_FR) {
      expect(v.woerter.length, v.folge).toBeGreaterThanOrEqual(6);
      for (const w of v.woerter) {
        const ok = v.stelle === "anfang" ? w.startsWith(v.folge) : v.stelle === "ende" ? w.endsWith(v.folge) : w.includes(v.folge);
        if (!ok) falsch.push(`${v.folge}/${v.stelle}: ${w}`);
        if (ZWEI_ANSCHLAEGE.test(w) || w !== w.toLowerCase()) falsch.push(`${v.folge}: ${w} (Form)`);
      }
    }
    expect(falsch).toEqual([]);
  });

  it("keine deutschen oder englischen Wörter", () => {
    expect(fremdeWoerter(VERBINDUNGEN_FR.flatMap((v) => v.woerter))).toEqual([]);
  });
});

describe("★ Buchstabensalat (Lettres mélangées)", () => {
  it(`jedes Quellwort gibt mindestens ${SALAT_ZIEL} echte Wörter her, keines trägt einen Akzent`, () => {
    expect(SALATWOERTER_FR.length).toBeGreaterThanOrEqual(40);
    for (const sw of SALATWOERTER_FR) {
      expect(sw.wort).toMatch(/^[a-z]+$/);
      expect(salatVorrat(sw.wort, "fr").length, sw.wort).toBeGreaterThanOrEqual(SALAT_ZIEL);
    }
  });

  it("kein Name und keine Abkürzung unter den Funden", () => {
    const funde = new Set(SALATWOERTER_FR.flatMap((sw) => salatVorrat(sw.wort, "fr")));
    for (const n of [...SALAT_NAMEN.fr, ...SALAT_KEINE_WOERTER.fr]) expect(funde.has(n), n).toBe(false);
  });

  it("die Prüfung einer Eingabe rechnet mit Akzenten (für „fr“ wird „é“ nicht gestrichen)", () => {
    // „tapis“: „pas“ zählt; „pâté“ hat Buchstaben, die nicht im Vorrat stehen.
    expect(pruefeSalatwort("pas", "tapis", [], "fr").ok).toBe(true);
    const r = pruefeSalatwort("été", "tapis", [], "fr");
    expect(r.ok).toBe(false);
    expect(r.ok ? "" : r.grund).toBe("nicht-im-vorrat");
  });
});

/* ── Eine ganze Runde je Form an Haltestellen der französischen Reihenfolge ─ */

function zufall(saat: number): () => number {
  let z = saat >>> 0;
  return () => {
    z = (z * 1664525 + 1013904223) >>> 0;
    return z / 4294967296;
  };
}

const SECHS = ["buchstabensalat", "lueckentext", "korrekturlesen", "handschwerpunkte", "langersatz", "wasfehlt"];

describe("★★★ Eine Runde je Form: nie ein Zeichen, das das Kind noch nicht hat", () => {
  for (const tastatur of ["fr", "ch-fr"] as LayoutId[]) {
    it(`${tastatur}: jede angebotene Form liefert Aufgaben, alles Getippte ist tippbar`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("fr");
      const fehler: string[] = [];
      const angeboten = new Set<string>();
      for (const bis of [12, 16, 19, 22, 25, 31, 45, 55, reihenfolge.length]) {
        const introduced = reihenfolge.slice(0, bis);
        const erlaubt = new Set(introduced.filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens"] as const) {
          for (const form of UEBUNGSFORMEN.filter((f) => SECHS.includes(f.id))) {
            const ctx: FormKontext = {
              lernweg: "fr", introduced, shift: introduced.includes(SHIFT_UNIT), oneHand: false,
              stufe, lang: "fr", count: 8, zufall: zufall(bis),
            };
            if (!form.taugt(ctx)) continue;
            angeboten.add(form.id);
            const c = { ...ctx, zufall: zufall(bis + 1) };
            let getippt: string[] = [];
            if (form.eigenerBildschirm === "buchstabensalat") {
              const q = waehleSalatwort(c);
              getippt = q ? [q] : [];
            } else if (form.fragen) {
              const aufgaben = form.fragen(c);
              if (aufgaben.length < 5) fehler.push(`${form.id} ${bis}: nur ${aufgaben.length} Aufgaben`);
              getippt = aufgaben.flatMap((a) => a.antworten);
            } else {
              getippt = form.baue?.(c)?.zeilen.map((z) => z.text) ?? [];
            }
            if (getippt.length === 0) fehler.push(`${form.id} ${bis}/${stufe}: nichts zu tippen`);
            for (const t of getippt)
              if (fitText(t, erlaubt, "fr") === null) fehler.push(`${form.id} ${bis}/${stufe}: „${t}"`);
          }
        }
      }
      expect(fehler).toEqual([]);
      expect([...angeboten].sort()).toEqual([...SECHS].sort());
    });
  }
});
