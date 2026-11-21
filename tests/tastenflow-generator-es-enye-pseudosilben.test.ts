/**
 * ★★★★ WÄCHTER S1 (ES-P7a-Behebung, 27.09.2026, Prüfbericht Fundament es):
 * Pseudosilben mit ñ - „ñaña gibt es nicht: nur echte Silben" (Bauplan
 * §4.3). Im echten Spanisch steht ñ NIE am Wortanfang und NIE doppelt.
 *
 * Gemessen (e11, Sprosse 8 - ñ als Fokus, nur die Grundreihe gelernt): 58
 * von 200 Fokus-Zeilen enthielten „ññ", 183 Pseudowörter begannen mit ñ.
 *
 * Behoben: `korrigiereEnye` (generator.ts, `spanischeSilbe`) zieht Doppel-ñ
 * zusammen und entfernt jedes ñ, das am Wortanfang steht oder nicht von
 * einem echten Vokal gefolgt wird.
 *
 * ⚠️ Eigener Fund BEIM Bauen dieses Wächters: die erste Fassung nutzte
 * `isVowel(arr[i + 1] ?? "")` als „folgt ein Vokal?"-Test - `"".includes("")`
 * ist in JS WAHR, darum hielt der Test ein ñ am STRING-ENDE fälschlich für
 * „vor einem Vokal" und liess es durch (behoben: `naechstes !== undefined`
 * zusätzlich geprüft). Ohne diesen zweiten Fund wäre „ñaas"/„ñ" weiterhin
 * durchgerutscht - ein Beispiel dafür, dass ein Wächter, der nur die
 * Symptom-Zahl prüft, aber nicht mit echten Werten rechnet, den eigenen
 * Fehler leicht übersieht.
 */
import { describe, expect, it } from "vitest";
import { setLayout } from "@/lib/typing/layouts";
import { wordDrillLines } from "@/lib/typing/generator";

describe("★★★★ S1: kein ñ am Wortanfang, kein ñ doppelt", () => {
  it("Grundreihe (Sprosse 8, Fokus ñ): 0 von vielen Zeilen mit ññ oder führendem ñ", () => {
    setLayout("es");
    const allowed = ["f", "j", "d", "k", "s", "l", "a", "ñ"];
    let doppel = 0;
    let anfang = 0;
    let woerter = 0;
    for (let i = 0; i < 100; i++) {
      const lines = wordDrillLines(allowed, false, "kids", ["ñ"], 1, false, "es");
      for (const l of lines) {
        for (const w of l.split(" ")) {
          woerter++;
          if (w.includes("ññ")) doppel++;
          if (w.startsWith("ñ") || w.startsWith("Ñ")) anfang++;
        }
      }
    }
    expect(woerter).toBeGreaterThan(0);
    expect(doppel).toBe(0);
    expect(anfang).toBe(0);
  });

  it("latam dieselbe Regel", () => {
    setLayout("latam");
    const allowed = ["f", "j", "d", "k", "s", "l", "a", "ñ"];
    let treffer = 0;
    for (let i = 0; i < 100; i++) {
      const lines = wordDrillLines(allowed, false, "kids", ["ñ"], 1, false, "es");
      for (const l of lines) {
        for (const w of l.split(" ")) {
          if (w.includes("ññ") || w.startsWith("ñ") || w.startsWith("Ñ")) treffer++;
        }
      }
    }
    expect(treffer).toBe(0);
  });

  it("Randfall: ein ñ am Ende einer Rohsilbe (keinen folgenden Vokal) zählt NICHT als gültig", () => {
    // Regressions-Beleg für den zweiten Fund ("".includes("") ist wahr):
    // ein Wort darf nie NUR aus ñ bestehen oder mit ñ enden, ohne dass ein
    // Vokal danach folgt (die Endungen -o/-a/-as/-os/-ar liefern den Vokal
    // NACH dem ñ, nicht das ñ selbst am Ende).
    setLayout("es");
    const allowed = ["f", "j", "d", "k", "s", "l", "a", "ñ"];
    let endetAufEnye = 0;
    for (let i = 0; i < 200; i++) {
      const lines = wordDrillLines(allowed, false, "kids", ["ñ"], 1, false, "es");
      for (const l of lines)
        for (const w of l.split(" ")) if (/ñ$/i.test(w)) endetAufEnye++;
    }
    expect(endetAufEnye).toBe(0);
  });
});
