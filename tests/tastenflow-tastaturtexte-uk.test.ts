/**
 * ★★★ WÄCHTER O-INHALT-UK (29.10.2026): JEDE TASTATUR HAT EINEN UKRAINISCHEN NAMEN UND EINE UKRAINISCHE ERKLÄRUNG
 * (`tastaturTexteUk.ts`).
 *
 * Vorbild: der Block „každá klávesnice má český název a popis" in `tastenflow-tschechisch-alles.test.tsx`. Anders als dort
 * wird die Tabelle DIREKT geprüft (nicht über `layoutTexteIn`), und auch die Tastaturen der neun neuen Sprachen müssen
 * übersetzt sein - kein englischer Rückfall. Geprüft:
 *  · Vollständigkeit: jede `LayoutId` aus `LAYOUTS` hat genau einen Eintrag, Name länger als 3 Zeichen, Kurzname vorhanden
 *    und klein (er steht nach „Клавіатура:"), eine Erklärung genau dort, wo Englisch eine hat;
 *  · Schrift: jeder Name trägt kyrillische Buchstaben; jedes Wort ist kyrillisch oder ein erlaubter lateinischer Eigenname
 *    (Tastenname wie auf der Kappe, Windows/Mac, QWERTY …) - einzelne Zeichen (ä, ς, ˇ, µ) sind die Sache selbst;
 *  · kein Gedankenstrich, kein Deutsch, kein Englisch, keine französischen Anführungszeichen, kein Maus-Wort;
 *  · Inhalt: die ukrainischen Tastaturen nach dem Glossar §2.9 („Українська (розширена)" / „Українська"), die erweiterte
 *    nennt Apostroph und Hrywnja-Zeichen, die Standard-Belegung sagt, dass ihr der Apostroph fehlt.
 * GEGENPROBE: die englischen Texte (der alte Rückfall) fallen durch.
 */
import { describe, expect, it } from "vitest";
import { LAYOUTS, layoutTexteEnglisch, type LayoutId } from "../src/lib/typing/layouts";
import { LAYOUT_TEXTE_UK } from "../src/lib/typing/tastaturTexteUk";
import { englischFehler, schriftFehler, strichFehler } from "./helfer/oInhaltNeueWege";
import { deutscheWoerter } from "./helfer/deutschFaenger";

type Texte = { label: string; kurz: string; hinweis?: string };

/** Lateinische Wörter, die stehen bleiben: Tastennamen wie auf der Kappe, Systeme, Tastaturnormen, Ersatzschreibungen. */
const LATEIN = new Set([
  "Shift", "Caps", "Lock", "AltGr", "Alt", "Ctrl", "Enter", "Option", "Mac", "Windows", "NVDA", "AZERTY", "QWERTY",
  "QWERTZ", "QZERTY", "CSA", "ISO", "ABNT", "Italiano", "Pro", "Polski", "programisty", "ae", "ss", "Oe",
]);
const MAUS = /(?<!\p{L})(миш\p{L}*|клацн\p{L}*|клікн\p{L}*)(?!\p{L})/iu;

function fehler(id: string, t: Texte): string[] {
  const out: string[] = [];
  if (t.label.length <= 3) out.push(`${id}: Name zu kurz`);
  if (!t.kurz) out.push(`${id}: Kurzname fehlt`);
  else if (t.kurz[0] !== t.kurz[0].toLocaleLowerCase("uk")) out.push(`${id}: Kurzname nicht klein - ${t.kurz}`);
  if (!/\p{Script=Cyrillic}/u.test(t.label)) out.push(`${id}: Name ohne kyrillische Buchstaben - ${t.label}`);
  for (const [feld, text] of [["label", t.label], ["kurz", t.kurz], ["hinweis", t.hinweis ?? ""]] as const) {
    const s = schriftFehler(text, "Cyrillic", LATEIN).filter((w) => [...w].length > 1);
    if (s.length) out.push(`${id}.${feld}: fremde Schrift ${s.join(", ")}`);
    if (strichFehler(text)) out.push(`${id}.${feld}: Gedankenstrich`);
    const d = deutscheWoerter(text).filter((w) => w.length > 1);
    if (d.length) out.push(`${id}.${feld}: Deutsch ${d.join(", ")}`);
    const e = englischFehler(text, LATEIN);
    if (e.length) out.push(`${id}.${feld}: Englisch ${e.join(", ")}`);
    if (/[«»]/u.test(text)) out.push(`${id}.${feld}: französische Anführungszeichen`);
    if (MAUS.test(text)) out.push(`${id}.${feld}: Maus-Wort`);
  }
  return out;
}

describe("★★★ O-INHALT-UK кожна клавіатура має українську назву й опис (tastaturTexteUk.ts)", () => {
  it("vollständig: jede LayoutId genau einmal, Erklärung genau dort, wo Englisch eine hat", () => {
    expect(Object.keys(LAYOUT_TEXTE_UK).sort()).toEqual(LAYOUTS.map((l) => l.id).sort());
    for (const l of LAYOUTS) {
      expect(Boolean(LAYOUT_TEXTE_UK[l.id].hinweis), l.id).toBe(Boolean(layoutTexteEnglisch(l.id).hinweis));
    }
  });
  it("jeder Text ukrainisch, ohne Gedankenstrich, Deutsch, Englisch, « », Maus-Wort - auch die neun neuen Sprachen", () => {
    const alle = LAYOUTS.flatMap((l) => fehler(l.id, LAYOUT_TEXTE_UK[l.id]));
    expect(alle).toEqual([]);
  });
  it("Inhalt: ukrainische Tastaturen nach Glossar, Apostroph und ₴ in der erweiterten, kein Apostroph in der Standard", () => {
    expect(LAYOUT_TEXTE_UK.ua.label).toBe("Українська (розширена)");
    expect(LAYOUT_TEXTE_UK["ua-std"].label).toBe("Українська");
    const ua = LAYOUT_TEXTE_UK.ua.hinweis ?? "";
    expect(ua).toMatch(/[Аа]построф '/u);
    expect(ua).toMatch(/₴/u);
    expect(ua).toMatch(/основний ряд/u);
    expect(LAYOUT_TEXTE_UK["ua-std"].hinweis ?? "").toMatch(/без апострофа/u);
  });
  it("GEGENPROBE: der englische Rückfall fällt durch", () => {
    const ids: LayoutId[] = ["bg", "el", "ua", "sv"];
    for (const id of ids) expect(fehler(id, layoutTexteEnglisch(id)).length, id).toBeGreaterThan(0);
  });
});
