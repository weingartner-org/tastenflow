/**
 * ★★★ O4 (30.10.2026): die sieben Dateien, die für die neun bis dahin Englisch lieferten (`geruestAufEn`), gefahren.
 * Bewusst über die öffentlichen Funktionen: eine Weiche, die vergessen wird, fällt hier auf (eigen = nie Deutsch, nie
 * Englisch). `ohneVergleichSatz` fiel bis O4 sogar auf DEUTSCH.
 */
import { describe, expect, it } from "vitest";
import { GERUEST_SPRACHEN, type GeruestSprache } from "../src/lib/typing/sprachRegister";
import { KETTEN_NEUN, type KettenTexte } from "../src/lib/typing/kettenNeun";
import { weekLabelJeSprache } from "../src/lib/typing/goals";
import { scoreErklaerung } from "../src/lib/typing/score";
import {
  entwicklungsGrund,
  entwicklungsGrundKurz,
  ohneVergleichSatz,
  spaltenGrund,
  spaltenHilfe,
  veraenderungSatz,
  type Veraenderung,
} from "../src/lib/typing/veraenderung";
import { klassenBezeichnung } from "../src/lib/typing/excelMarke";
import { vergleichsName, wochenBereichKompakt, zeitraumTitel, type Zeitraum } from "../src/lib/typing/zeitraum";
import { wochenzielHilfe } from "../src/lib/typing/wochenzielZeitraum";
import { eigeneUebungKurzstand } from "../src/lib/typing/eigeneUebungReihe";
import { ansageGewaehlt } from "../src/lib/typing/vorlesen";
import type { Lang } from "../src/lib/typing/account";

const JETZT = new Date(2026, 9, 21, 12).getTime();
const v = (richtung: Veraenderung["richtung"], differenz: number) => ({ richtung, differenz }) as Veraenderung;
const ZEITRAEUME: Zeitraum[] = [
  { art: "gesamt" },
  { art: "schuljahr", jahrVersatz: 0 },
  { art: "monat", monatVersatz: 0 },
  { art: "monat", monatVersatz: -1 },
  { art: "woche", wochenVersatz: 0 },
  { art: "woche", wochenVersatz: -1 },
  { art: "woche", wochenVersatz: 1 },
  { art: "woche", wochenVersatz: -3 },
] as unknown as Zeitraum[];
const ent = (wochen: number) => ({ treffer: null, tempo: null, score: null, ausgangswoche: null, wochen }) as never;

/** Je Probe der Aufruf - alles, was ein Mensch in dieser Sprache sieht. */
const PROBEN: Record<string, (s: Lang) => unknown> = {
  veraenderungSatz: (s) =>
    (["treffer", "score", "tempo"] as const).flatMap((g) =>
      [v("hoch", 3), v("runter", -1), v("gleich", 0.5)].map((x) => veraenderungSatz(x, g, "QQQ", s)),
    ),
  ohneVergleichSatz: (s) => [ohneVergleichSatz("", s), ohneVergleichSatz("QQQ", s)],
  entwicklungsGrund: (s) => [entwicklungsGrund(ent(0), s), entwicklungsGrund(ent(1), s), entwicklungsGrundKurz(ent(0), s), entwicklungsGrundKurz(ent(1), s)],
  spalten: (s) => (["treffer", "score", "tempo"] as const).flatMap((g) => [spaltenGrund(g, s), spaltenHilfe(g, true, s), spaltenHilfe(g, false, s)]),
  zeitraumTitel: (s) => ZEITRAEUME.map((z) => zeitraumTitel(z, JETZT, null, s)),
  vergleichsName: (s) => ZEITRAEUME.slice(1).map((z) => vergleichsName(z, JETZT, s)),
  kompakt: (s) => [wochenBereichKompakt(0, new Date(2026, 8, 16).getTime(), null, s), wochenBereichKompakt(0, new Date(2026, 8, 30).getTime(), null, s)],
  woche: (s) => weekLabelJeSprache(new Date(2026, 9, 19).getTime(), s),
  score: (s) => [scoreErklaerung("du", s), scoreErklaerung("Sie", s)],
  klasse: (s) => [klassenBezeichnung("3b", s), klassenBezeichnung("", s)],
  eigene: (s) => [eigeneUebungKurzstand({} as never, s), eigeneUebungKurzstand({ eigeneTextId: "a", eigenerTextName: "b.txt" } as never, s)],
  wochenziel: (s) => ZEITRAEUME.map((z) => wochenzielHilfe(z, s)),
  gewaehlt: (s) => ansageGewaehlt("X", s),
};

/** Kein Rest, sondern derselbe Inhalt: kein Text (null) oder ein Strich. */
const GLEICH_ERLAUBT = new Set(["null", "-"]);

const MAUS = /(кликн|щракн|клікн|мишк|κλικ|ποντίκι|kattint|egér|klik op|klik met|\bmuis\b|clique|clicar|\brato\b|\bmouse\b|dă clic|faceți clic|klicka)/iu;

describe("★★★ O4: die neun bekommen eigene Texte, weder Deutsch noch Englisch", () => {
  for (const [name, probe] of Object.entries(PROBEN)) {
    it(name, () => {
      // ⚠️ Stück für Stück und mit festem Vergleichsnamen: Als ganzes JSON war die Probe taub (Mutationsprobe O4) - ein
      // einziger eigener Eintrag oder ein eingesetzter Name machte die Zeile „verschieden", auch wenn der Satz deutsch blieb.
      const stuecke = (s: Lang) => [probe(s)].flat(3).map(String);
      const en = stuecke("en");
      const de = stuecke("de");
      expect(JSON.stringify(en), `${name}: Probe taub`).not.toBe(JSON.stringify(de));
      for (const s of GERUEST_SPRACHEN) {
        const teile = stuecke(s);
        const ist = JSON.stringify(teile);
        teile.forEach((teil, i) => {
          if (GLEICH_ERLAUBT.has(teil)) return;
          expect(teil, `${name} · ${s} · ${i}`).not.toBe(en[i]);
          expect(teil, `${name} · ${s} · ${i}`).not.toBe(de[i]);
        });
        expect(ist, `${name} · ${s}`).not.toMatch(/[–—]|undefined|NaN/);
        expect(ist, `${name} · ${s}`).not.toMatch(MAUS);
      }
    });
  }
  it("zwei Sprachen, die sich nicht ähneln, sind auch wirklich verschieden; pt und br getrennt", () => {
    expect(KETTEN_NEUN.pt).not.toBe(KETTEN_NEUN.br);
    expect(JSON.stringify(KETTEN_NEUN.pt.vergleich) + KETTEN_NEUN.pt.spalteTreffer).not.toBe(JSON.stringify(KETTEN_NEUN.br.vergleich) + KETTEN_NEUN.br.spalteTreffer);
  });
});

/** Jede Zeichenkette (auch aus den Funktionen mit Probewerten) einer Sprache. */
function alleTexte(k: KettenTexte): string[] {
  const aus: string[] = [];
  const gang = (x: unknown) => {
    if (typeof x === "string") aus.push(x);
    else if (typeof x === "function") {
      const f = x as (...a: unknown[]) => unknown;
      for (const args of [[2, 3, "Q", 4], ["Q", "Q", "Q"], ["treffer", 2], ["tempo", 1], ["score", 5]]) {
        try {
          gang(f(...args));
        } catch {
          /* falsche Probewerte */
        }
      }
    } else if (x && typeof x === "object") Object.values(x).forEach(gang);
  };
  gang(k);
  return aus;
}

describe("★★ O4: die Regeln für alles, was ein Mensch liest", () => {
  it.each(GERUEST_SPRACHEN as readonly GeruestSprache[])("%s: nur Bindestrich, kein Mischwort aus zwei Schriften", (s) => {
    for (const t of alleTexte(KETTEN_NEUN[s])) {
      expect(t).not.toMatch(/[–—]/);
      const misch = t.match(/\p{L}*(?:\p{Script=Latin}\p{L}*[\p{Script=Cyrillic}\p{Script=Greek}]|[\p{Script=Cyrillic}\p{Script=Greek}]\p{L}*\p{Script=Latin})\p{L}*/gu);
      expect(misch, t).toBeNull();
    }
  });
  it("ro nur mit ș ț (Komma)", () => {
    for (const t of alleTexte(KETTEN_NEUN.ro)) expect(t).not.toMatch(/[şţŞŢ]/);
  });
  it("der Klassenname wird nie doppelt beschriftet", () => {
    for (const s of GERUEST_SPRACHEN) {
      const einmal = klassenBezeichnung("3b", s);
      expect(klassenBezeichnung(einmal, s), s).toBe(einmal);
      expect(klassenBezeichnung("Klasse 3b", s), s).toBe("Klasse 3b");
    }
  });
});
