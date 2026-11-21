/**
 * ★ O2-LIB (29.10.2026): die Oberflächentexte aus `src/lib/typing/`, die Etappe O2-LIB für die neun Sprachen des
 * Gerüsts eigen geschrieben hat. Je Sprache: weder der englische noch der deutsche Wortlaut (Vergleich je Tabelle,
 * weil einzelne Wörter zu Recht gleich sein dürfen - „Robot", „Piano"), und die Hausregeln (nur `-`, keine Marke).
 */
import { describe, expect, it } from "vitest";
import { GERUEST_SPRACHEN } from "../src/lib/typing/sprachRegister";
import type { Lang } from "../src/lib/typing/account";
import { langLabel } from "../src/lib/typing/account";
import { KLAENGE, klangName, melodieZufallName } from "../src/lib/typing/melodie";
import { pruefungWort, pruefungWortMehrzahl } from "../src/lib/typing/schreibprobe";
import { FORM_HINWEISE, FORM_NAMEN } from "../src/lib/typing/uebungsformen/namen";

/** Wörter, die in einer der neun Sprachen genau wie im Englischen heissen (nl/sv „Piano", hu/nl/ro/sv „Robot", ro „Dragon"). */
const ERLAUBT_WIE_EN = ["Piano", "Robot", "Dragon"];

const PROBEN:Record<string, (s: Lang) => unknown> = {
  klangName: (s) => [...KLAENGE.map((k) => klangName(k, s)), klangName("zufall", s), melodieZufallName(s)],
  pruefungWort: (s) => [pruefungWort(s), pruefungWortMehrzahl(s)],
  langLabel: (s) => (["de", "en", "fr", "bg", "uk"] as const).map((l) => langLabel(l, s)),
  formNamen: (s) => FORM_NAMEN[s],
  formHinweise: (s) => FORM_HINWEISE[s],
};

describe.each(GERUEST_SPRACHEN.map((s) => [s]))("O2-LIB: %s hat eigene Oberflächentexte", (s) => {
  for (const [name, probe] of Object.entries(PROBEN)) {
    it(name, () => {
      const ist = JSON.stringify(probe(s));
      expect(ist, `${name} · ${s}: englisch`).not.toBe(JSON.stringify(probe("en")));
      expect(ist, `${name} · ${s}: deutsch`).not.toBe(JSON.stringify(probe("de")));
      expect(ist, `${name} · ${s}: Gedankenstrich`).not.toMatch(/[–—]/);
      expect(ist, `${name} · ${s}: Marke`).not.toMatch(/RÜCKFALL-EN/);
      // je Eintrag: gleich wie Englisch nur, wo das Wort in der Sprache wirklich so heisst
      const werte = (x: unknown) => Object.values(x as Record<string, unknown>).map(String);
      const en = werte(probe("en"));
      werte(probe(s)).forEach((w, i) => {
        if (w === en[i]) expect(ERLAUBT_WIE_EN, `${name} · ${s}: „${w}" ist Englisch`).toContain(w);
      });
      if (s === "ro") expect(ist, "ro: Cedille statt Komma").not.toMatch(/[şţŞŢ]/);
    });
  }
});
