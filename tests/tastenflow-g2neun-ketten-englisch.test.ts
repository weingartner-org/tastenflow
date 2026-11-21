/**
 * ★★ G2-NEUN (25.10.2026): KETTEN `if (cs) … if (tr) … if (en) … Deutsch` (Falle 30/57).
 *
 * Die Etappen O-IT … O-CS haben viele Funktionen von `altSpracheOderEn(sprache)` auf eine Kette mit einem Zweig je
 * Sprache umgestellt - deren Rest ist DEUTSCH. `tsc` sieht das nicht. Für die neun Sprachen des Gerüsts steht darum
 * am Anfang jeder solchen Kette `geruestAufEn(…)`; dieser Wächter fährt eine Auswahl davon und verlangt für jede der
 * neun GENAU das Englische (nie das Deutsche).
 */
import { describe, expect, it } from "vitest";
import { GERUEST_SPRACHEN } from "../src/lib/typing/sprachRegister";
import { weekLabelJeSprache } from "../src/lib/typing/goals";
import { topfLabel } from "../src/lib/typing/jahreskarte";
import { schulstufeText } from "../src/lib/typing/klassenEinstellungen";
import { scoreErklaerung } from "../src/lib/typing/score";
import { spaltenGrund, spaltenHilfe } from "../src/lib/typing/veraenderung";
import { spokenLabel } from "../src/lib/typing/fingers";
import { klassenBezeichnung } from "../src/lib/typing/excelMarke";
import { erklaerungFuerSprache } from "../src/lib/typing/tastenErklaerung";
import { handbuchInSprache, type Handbuch } from "../src/lib/lernwerkstatt/handbuecher";
import type { Lang } from "../src/lib/typing/account";

/**
 * ★ O-INHALT-HU/NL/RO (29.10.2026): Proben, deren Einhängepunkt eine Sprache inzwischen SELBST füllt - dort gilt nicht mehr
 * „genau Englisch", sondern „eigen, nie Deutsch und nie Englisch" (der Wächter der Sprache prüft den Inhalt).
 */
const EIGEN_GEFUELLT: Record<string, readonly Lang[]> = {
  erklaerungFuerSprache: ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"], // ★ O-INHALT (29.10.2026): alle neun eigen
  topfLabel: ["bg", "el", "hu", "nl", "pt", "br", "ro", "uk"], // ★ O2-LIB (30.10.2026): eigen; sv heisst wirklich „under 50" wie Englisch
  schulstufeText: ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"], // ★ O2-LIB (30.10.2026): alle neun eigen
  // ★ O4 (30.10.2026): die sieben Dateien sind eigen (`tastenflow-o4-ketten-neun.test.ts` prüft sie vollständig).
  weekLabelJeSprache: ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"],
  scoreErklaerung: ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"],
  spaltenGrund: ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"],
  spaltenHilfe: ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"],
  klassenBezeichnung: ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"],
};

const MONTAG = new Date(2026, 9, 19).getTime();


/** Je Probe: der Aufruf mit einer Sprache. */
const PROBEN: Record<string, (s: Lang) => unknown> = {
  weekLabelJeSprache: (s) => weekLabelJeSprache(MONTAG, s),
  topfLabel: (s) => topfLabel(0, s),
  schulstufeText: (s) => [schulstufeText(null, s), schulstufeText(5, s)],
  scoreErklaerung: (s) => [scoreErklaerung("du", s), scoreErklaerung("Sie", s)],
  spaltenGrund: (s) => (["treffer", "tempo", "score"] as const).map((g) => spaltenGrund(g, s)),
  spaltenHilfe: (s) => (["treffer", "tempo", "score"] as const).map((g) => spaltenHilfe(g, true, s)),
  // ★ F58 (29.10.2026): `spokenLabel` ist aus dieser Liste herausgenommen - die neun haben seit F58 EIGENE Zeichennamen
  // (`zeichenNamen<Xx>.ts`), Englisch ist dort nicht mehr die Erwartung. „Nie Deutsch" prüft der Abschnitt unten weiter.
  klassenBezeichnung: (s) => klassenBezeichnung("3b", s),
  erklaerungFuerSprache: (s) => erklaerungFuerSprache("tabulator", "windows", "de", s),
};

describe("★★ die neun Sprachen des Gerüsts bekommen am Ende einer Kette ENGLISCH, nie Deutsch", () => {
  for (const [name, probe] of Object.entries(PROBEN)) {
    it(name, () => {
      const en = JSON.stringify(probe("en"));
      const de = JSON.stringify(probe("de"));
      // Gegenprobe: die Probe unterscheidet Englisch und Deutsch überhaupt
      expect(en, `${name}: Probe taub`).not.toBe(de);
      for (const s of GERUEST_SPRACHEN) {
        const ist = JSON.stringify(probe(s));
        if (EIGEN_GEFUELLT[name]?.includes(s)) {
          expect(ist, `${name} · ${s} (eigen)`).not.toBe(en);
          expect(ist, `${name} · ${s} (eigen)`).not.toBe(de);
        } else expect(ist, `${name} · ${s}`).toBe(en);
      }
    });
  }

  it("★ F58: spokenLabel - die neun sagen weder den deutschen noch (seit F58) den englischen Namen", () => {
    const probe = (s: Lang) => [",", ".", "?", "-", " "].map((z) => spokenLabel(z, s));
    const de = JSON.stringify(probe("de"));
    const en = JSON.stringify(probe("en"));
    for (const s of GERUEST_SPRACHEN) {
      expect(JSON.stringify(probe(s)), s).not.toBe(de);
      expect(JSON.stringify(probe(s)), s).not.toBe(en);
    }
  });

  it("Handbuch: die neun bekommen die englische Fassung, nie die deutsche", () => {
    const h = {
      titel: "Handbuch",
      datei: "/handbuecher/de.pdf",
      en: { titel: "Manual", datei: "/handbuecher/en.pdf" },
    } as unknown as Handbuch;
    const en = handbuchInSprache(h, "en");
    for (const s of GERUEST_SPRACHEN) expect(handbuchInSprache(h, s), s).toEqual(en);
  });
});
