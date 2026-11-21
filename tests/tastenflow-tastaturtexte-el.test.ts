/**
 * ★★★ WÄCHTER O-INHALT-EL (29.10.2026): JEDE TASTATUR HAT EINEN GRIECHISCHEN NAMEN UND EINE GRIECHISCHE ERKLÄRUNG
 * (`tastaturTexteEl.ts`).
 *
 * Vorbild: der Block „každá klávesnice má český název a popis" in `tastenflow-tschechisch-alles.test.tsx`. Anders als dort
 * wird die Tabelle DIREKT geprüft (nicht über `layoutTexteIn`), und auch die Tastaturen der neun neuen Sprachen müssen
 * übersetzt sein - kein englischer Rückfall. Geprüft:
 *  · Vollständigkeit: jede `LayoutId` aus `LAYOUTS` hat genau einen Eintrag, Name länger als 3 Zeichen, Kurzname vorhanden
 *    und klein (er steht nach „Πληκτρολόγιο:"), eine Erklärung genau dort, wo Englisch eine hat;
 *  · Schrift: jeder Name trägt griechische Buchstaben; jedes Wort ist griechisch oder ein erlaubter lateinischer Eigenname
 *    (Tastenname wie auf der Kappe, Windows/Mac, QWERTY …) - einzelne Zeichen (ä, я, ˇ, µ) sind die Sache selbst;
 *  · kein Gedankenstrich, kein Deutsch, kein Englisch, keine französischen Anführungszeichen, kein Maus-Wort;
 *  · ⚠️ kein „;" direkt hinter einem Wort: im Griechischen ist „;" das Fragezeichen - als Semikolon des englischen Textes
 *    gelesen hiesse der Satz etwas anderes (als Zeichen selbst steht es mit Leerzeichen davor: „το ερωτηματικό ; στο Q");
 *  · Alt Gr wie in `tastenErklaerungEl.ts` (mit Leerzeichen), nie „AltGr";
 *  · Inhalt: die griechische Tastatur nennt den Tonos als Totaste und das Schluss-Sigma auf W; Namen nach Glossar §2.9.
 * GEGENPROBE: die englischen Texte (der alte Rückfall) fallen durch.
 */
import { describe, expect, it } from "vitest";
import { LAYOUTS, layoutTexteEnglisch, type LayoutId } from "../src/lib/typing/layouts";
import { LAYOUT_TEXTE_EL } from "../src/lib/typing/tastaturTexteEl";
import { englischFehler, schriftFehler, strichFehler } from "./helfer/oInhaltNeueWege";
import { deutscheWoerter } from "./helfer/deutschFaenger";

type Texte = { label: string; kurz: string; hinweis?: string };

/** Lateinische Wörter, die stehen bleiben: Tastennamen wie auf der Kappe, Systeme, Tastaturnormen, Ersatzschreibungen. */
const LATEIN = new Set([
  "Shift", "Caps", "Lock", "Alt", "Gr", "Ctrl", "Enter", "Option", "Mac", "Windows", "NVDA", "AZERTY", "QWERTY",
  "QWERTZ", "QZERTY", "CSA", "ISO", "ABNT", "BDS", "Italiano", "Pro", "Polski", "programisty", "ae", "ss", "Oe",
]);
const MAUS = /(?<!\p{L})(ποντίκ\p{L}*|κλικ)(?!\p{L})/iu;

function fehler(id: string, t: Texte): string[] {
  const out: string[] = [];
  if (t.label.length <= 3) out.push(`${id}: Name zu kurz`);
  if (!t.kurz) out.push(`${id}: Kurzname fehlt`);
  else if (t.kurz[0] !== t.kurz[0].toLocaleLowerCase("el")) out.push(`${id}: Kurzname nicht klein - ${t.kurz}`);
  if (!/\p{Script=Greek}/u.test(t.label)) out.push(`${id}: Name ohne griechische Buchstaben - ${t.label}`);
  for (const [feld, text] of [["label", t.label], ["kurz", t.kurz], ["hinweis", t.hinweis ?? ""]] as const) {
    const s = schriftFehler(text, "Greek", LATEIN).filter((w) => [...w].length > 1);
    if (s.length) out.push(`${id}.${feld}: fremde Schrift ${s.join(", ")}`);
    if (strichFehler(text)) out.push(`${id}.${feld}: Gedankenstrich`);
    const d = deutscheWoerter(text).filter((w) => w.length > 1);
    if (d.length) out.push(`${id}.${feld}: Deutsch ${d.join(", ")}`);
    const e = englischFehler(text, LATEIN);
    if (e.length) out.push(`${id}.${feld}: Englisch ${e.join(", ")}`);
    if (/[«»]/u.test(text)) out.push(`${id}.${feld}: französische Anführungszeichen`);
    if (MAUS.test(text)) out.push(`${id}.${feld}: Maus-Wort`);
    if (/[\p{L}\p{N})];/u.test(text)) out.push(`${id}.${feld}: Semikolon als Satzzeichen (griechisch = Fragezeichen)`);
    if (/AltGr/u.test(text)) out.push(`${id}.${feld}: AltGr statt Alt Gr`);
  }
  return out;
}

describe("★★★ O-INHALT-EL κάθε πληκτρολόγιο έχει ελληνικό όνομα και περιγραφή (tastaturTexteEl.ts)", () => {
  it("vollständig: jede LayoutId genau einmal, Erklärung genau dort, wo Englisch eine hat", () => {
    expect(Object.keys(LAYOUT_TEXTE_EL).sort()).toEqual(LAYOUTS.map((l) => l.id).sort());
    for (const l of LAYOUTS) {
      expect(Boolean(LAYOUT_TEXTE_EL[l.id].hinweis), l.id).toBe(Boolean(layoutTexteEnglisch(l.id).hinweis));
    }
  });
  it("jeder Text griechisch, ohne Gedankenstrich, Deutsch, Englisch, « », Maus-Wort, Semikolon - auch die neun neuen", () => {
    const alle = LAYOUTS.flatMap((l) => fehler(l.id, LAYOUT_TEXTE_EL[l.id]));
    expect(alle).toEqual([]);
  });
  it("Inhalt: Tonos als Totaste rechts von λ, Schluss-Sigma auf W, Namen nach Glossar", () => {
    const el = LAYOUT_TEXTE_EL.el.hinweis ?? "";
    expect(el).toMatch(/τόνος ΄ είναι\s+νεκρό πλήκτρο/u);
    expect(el).toMatch(/ς είναι στο W/u);
    expect(LAYOUT_TEXTE_EL.el.label).toBe("Ελληνικό (Windows)");
    expect(LAYOUT_TEXTE_EL["el-220"].label).toBe("Ελληνικό (220)");
    expect(LAYOUT_TEXTE_EL["el-319"].label).toBe("Ελληνικό (319)");
  });
  it("GEGENPROBE: der englische Rückfall fällt durch", () => {
    const ids: LayoutId[] = ["bg", "el", "ua", "sv"];
    for (const id of ids) expect(fehler(id, layoutTexteEnglisch(id)).length, id).toBeGreaterThan(0);
  });
});
