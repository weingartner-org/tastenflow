/**
 * ★★★ Punkt 1 „vier Reste" (28.09.2026): kein Leerzeichen, das nur durch das
 * STREICHEN eines noch nicht gelernten Zeichens entsteht.
 *
 * Beobachtet in der Schlussprüfung (Weg fr): „"Je vais planter ce noyau
 * d'avocat", explique Samir." wurde ohne gelerntes " zu „… d'avocat ,
 * explique Samir." - das gestrichene Zeichen hinterliess ein Leerzeichen vor
 * dem Komma. Gemessen über alle Wege: es 208 Zeilen, fr 68, de 4, en 0
 * (`pruefstand/vier-reste/p1-leerzeichen-nach-streichen.mts`).
 *
 * Der Wächter deckt die FEHLERKLASSE: an JEDER Sprosse jedes Weges auf JEDER
 * seiner Tastaturen wird jede Korpus- und Serienzeile der Sprachen des Weges,
 * in der ein streichbares Zeichen neben einem anderen Satzzeichen steht,
 * serviert und gelesen:
 *  · keine zwei Leerzeichen, keines am Rand,
 *  · kein Leerzeichen vor , . ) ] } (alle Wege) und vor ; : ! ? (ausser Weg
 *    fr - dort ist es richtig, F8/D-6), das der Rohtext nicht selbst hat,
 *  · keines vor einem schliessenden Anführungszeichen / nach einem öffnenden.
 * Die Prüfung liest nur die servierte Zeile.
 */
import { describe, expect, it } from "vitest";
import { fitText, korpusFuer, passtLernweg } from "../src/lib/typing/corpus";
import { introOrder } from "../src/lib/typing/letters";
import { SERIEN, allowedFromIntroduced } from "../src/lib/typing/serien";
import { setLayout } from "../src/lib/typing/layouts";
import { uebungsSprachenImWeg, type Lang } from "../src/lib/typing/account";
import type { Lernweg } from "../src/lib/typing/lernweg";

const WEGE: [Lernweg, string[], readonly Lang[]][] = [
  ["de", ["de", "ch", "us", "uk"], uebungsSprachenImWeg("de")],
  ["en", ["us", "uk", "de", "ch"], uebungsSprachenImWeg("en")],
  ["fr", ["fr", "be", "ch-fr", "ca-fr", "ca-csa"], uebungsSprachenImWeg("fr")],
  ["es", ["es", "latam"], uebungsSprachenImWeg("es")],
];

/** Streichbare Zeichen (`STRIPPABLE_PUNCT` + Striche in corpus.ts). */
const STREICHBAR = `.,\\-?!:;–—"„“”«»()…`;
/** Zeilen, in denen ein streichbares Zeichen neben einem anderen Nicht-Wortzeichen steht. */
const KANDIDAT = new RegExp(`[${STREICHBAR}]\\s*[^\\p{L}\\p{N}\\s]|[^\\p{L}\\p{N}\\s]\\s*[${STREICHBAR}]`, "u");

function zeilen(weg: Lernweg, sprachen: readonly Lang[]): string[] {
  const out = new Set<string>();
  for (const l of sprachen) {
    for (const it of korpusFuer(l)) if (passtLernweg(it.nurWeg, weg)) out.add(it.text);
    for (const s of SERIEN) {
      if ((s.lang ?? "de") !== l || !passtLernweg(s.nurWeg, weg)) continue;
      for (const e of s.etappen) for (const z of e.lines) out.add(z);
    }
  }
  return [...out].filter((z) => KANDIDAT.test(z));
}

/** Leerzeichen-Fehler der servierten Zeile (leer = in Ordnung). */
export function luecken(serviert: string, roh: string, weg: Lernweg): string[] {
  const out: string[] = [];
  const vorSZ = weg === "fr" ? / [,.)\]}]/ : / [,.;:!?)\]}]/;
  const zu = / ([“]|["”»](?=[\s,.;:!?]|$))/;
  const auf = /[(\[{„¿¡«] |(^|\s)" /;
  if (/ {2}/.test(serviert)) out.push("zwei Leerzeichen");
  if (/^\s|\s$/.test(serviert)) out.push("Leerzeichen am Rand");
  if (vorSZ.test(serviert) && !vorSZ.test(roh)) out.push("Leerzeichen vor Satzzeichen");
  if (zu.test(serviert) && !zu.test(roh) && !(weg === "fr" && / »/.test(serviert))) out.push("Leerzeichen vor schliessendem Zeichen");
  if (auf.test(serviert) && !auf.test(roh) && !(weg === "fr" && /« /.test(serviert))) out.push("Leerzeichen nach öffnendem Zeichen");
  return out;
}

describe("Punkt 1: gestrichene Zeichen hinterlassen keine falschen Leerzeichen - jeder Weg, jede Tastatur, jede Sprosse", () => {
  for (const [weg, tastaturen, sprachen] of WEGE) {
    it(`Weg ${weg}`, () => {
      const alle = zeilen(weg, sprachen);
      const fehler = new Map<string, string>();
      let gelesen = 0;
      for (const lay of tastaturen) {
        setLayout(lay);
        const order = introOrder(weg);
        for (let n = 1; n <= order.length; n++) {
          const allowed = allowedFromIntroduced(order.slice(0, n), weg);
          for (const roh of alle) {
            const s = fitText(roh, allowed, weg);
            if (s === null) continue;
            gelesen++;
            const f = luecken(s, roh, weg);
            if (f.length && !fehler.has(roh)) fehler.set(roh, `${lay} S${n}(+${order[n - 1]}) ${f.join(", ")}: „${s}"`);
          }
        }
      }
      setLayout("de");
      // Gemessen 28.09.: de 25 Kandidaten (de + en), en 9, fr 397, es 344.
      expect(alle.length).toBeGreaterThan(5);
      expect(gelesen).toBeGreaterThan(100);
      expect([...fehler.values()].slice(0, 12), `${fehler.size} Zeilen`).toEqual([]);
    }, 240_000);
  }
});

describe("Punkt 1: die gemeldeten Zeilen und die Regeln", () => {
  const buchstaben = "abcdefghijklmnopqrstuvwxyzäöüßéèàçùâêîôûëïÿœñáíóú".split("");

  it("Weg fr: das gestrichene \" lässt kein Leerzeichen vor dem Komma", () => {
    const allowed = new Set([...buchstaben, ",", ".", "'"]);
    expect(fitText("\"Je vais planter ce noyau d'avocat\", explique Samir.", allowed, "fr")).toBe(
      "Je vais planter ce noyau d'avocat, explique Samir.",
    );
  });

  it("Weg fr: vor ; : ! ? bleibt das Leerzeichen des Rohtexts, auch nach gestrichenem « »", () => {
    const allowed = new Set([...buchstaben, "?", "!", ","]);
    expect(fitText("« Vraiment » ? Oui !", allowed, "fr")).toBe("Vraiment ? Oui !");
    expect(fitText("« Bonjour », dit-il.", new Set([...allowed, "-"]), "fr")).toBe("Bonjour, dit-il");
  });

  it("Weg de/es/en: vor ! ? steht nach dem Streichen kein Leerzeichen", () => {
    const allowed = new Set([...buchstaben, "!", ","]);
    expect(fitText("Was?! Nein, wirklich!", allowed, "de")).toBe("Was! Nein, wirklich!");
    expect(fitText("\"¡Qué bien!\", dice.", new Set([...allowed, "¡"]), "es")).toBe("¡Qué bien!, dice");
    expect(fitText("Wow!\" she said.", allowed, "en")).toBe("Wow! she said");
  });

  it("Weg de: Satzzeichen vor dem gestrichenen Anführungszeichen, Ergänzungsstrich", () => {
    const allowed = new Set([...buchstaben, ",", "."]);
    expect(fitText("„Das war mein Versteck als Kind!\", ruft er.", allowed, "de")).toBe(
      "Das war mein Versteck als Kind, ruft er.",
    );
    expect(fitText("Man unterscheidet Saiten-, Blas- und Tasteninstrumente.", allowed, "de")).toBe(
      "Man unterscheidet Saiten, Blas und Tasteninstrumente.",
    );
  });

  it("zwischen zwei Wortzeichen bleibt die Lücke ein Leerzeichen (wie bisher)", () => {
    const allowed = new Set([...buchstaben, "0", "1", "2", "3"]);
    expect(fitText("Hals-Nasen-Ohren", allowed, "de")).toBe("Hals Nasen Ohren");
    expect(fitText("um 12:30 Uhr", allowed, "de")).toBe("um 12 30 Uhr");
    expect(fitText("Er kam – und ging.", allowed, "de")).toBe("Er kam und ging");
  });

  it("vor einem gelernten schliessenden Anführungszeichen: kein Leerzeichen", () => {
    const allowed = new Set([...buchstaben, "\"", ",", "-", "'", "."]);
    expect(fitText("\"J'ai eu une très bonne note (grâce aux msemen)\", crie-t-il.", allowed, "fr")).toBe(
      "\"J'ai eu une très bonne note grâce aux msemen\", crie-t-il.",
    );
  });

  it("Gegenprobe: der Wächter sieht den alten Fehler", () => {
    const roh = "\"Je vais planter ce noyau d'avocat\", explique Samir.";
    expect(luecken("Je vais planter ce noyau d'avocat , explique Samir.", roh, "fr")).toHaveLength(1);
    expect(luecken("Vraiment ? Oui !", "« Vraiment » ? Oui !", "fr")).toEqual([]);
    expect(luecken("Was ! Nein", "Was?! Nein", "de")).toHaveLength(1);
    expect(luecken("\"grâce aux msemen \", crie", "\"grâce aux (msemen)\", crie", "fr")).toHaveLength(1);
  });
});
