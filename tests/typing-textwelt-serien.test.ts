/**
 * TW-E3 (Textwelt): Geschichten-Engine + Bücherei „Geschichten & Wissen".
 * Prüft die harten Garantien der Serien-Datenschicht und des Fortschritts:
 *  • jede Serie ist strukturell gültig (Etappen 12–16, minTier konsistent),
 *  • der deklarierte `minTier` stimmt mit dem berechneten überein (erzwingt den
 *    wortschatz-begrenzten Erstleser-Text — verbotene Zeichen würden auffliegen),
 *  • die Bücherei-Filter (Tier × Stufe) sind korrekt,
 *  • der Serien-Fortschritt läuft strikt linear (jede Etappe genau einmal) und
 *    ist wieder aufnehmbar (Resume),
 *  • loadProgress reicht die additiven Textwelt-Felder durch (Resume für anonyme
 *    Nutzer — sonst ginge Ledger + Serien-Fortschritt beim Neuladen verloren).
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md
 */
import { describe, it, expect } from "vitest";
import {
  ETAPPE_MAX_LINES,
  ETAPPE_MIN_LINES,
  SERIEN,
  advanceStory,
  allowedForTier,
  allowedFromIntroduced,
  computeSerieMinTier,
  emptyProgress,
  firstOpenSerie,
  isStoryDone,
  lockedSerien,
  minTierFor,
  serieBySlug,
  serieEtappeCount,
  serieLines,
  serieStatus,
  serieTypeable,
  serienForStufe,
  startEtappeFor,
  storyStateFor,
  unlockedSerien,
  validateSerie,
  type Stufe,
} from "../src/lib/typing";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { w1SerieNie } from "./helfer/w1-grossbuchstaben";

/**
 * ★ CS-S (09.10.2026): die Bezugstastatur eines Weges, auf der seine Serien gemessen werden. „fr" seit W1 (siehe unten);
 * „cs", weil ď ť ň (und die grossen Č Š Ř Ž …) nur über die Totaste ˇ der tschechischen Tastatur entstehen
 * (`KOMBIZEICHEN_CS`, nur für `cs`/`cs-qwerty`) - auf „de" wäre „teď" oder „šňůrka" nie tippbar (gemessen:
 * `minTierFor("Loďka.", "cs")` = null auf „de", 3 auf „cs"). Eine cs-Serie kommt nie auf einer anderen Tastatur dran.
 */
// ★ SPRACHEN-9 (30.10.2026): die neun Wege ebenso - ihre Buchstaben und Totasten gibt es nur auf ihren Tastaturen.
const BEZUGSTASTATUR: Partial<Record<string, LayoutId>> = { fr: "fr", cs: "cs", bg: "bg", el: "el", hu: "hu", nl: "nl-intl", pt: "pt", br: "br-abnt2", ro: "ro", sv: "sv", uk: "ua" };
const aufBezug = (s: { nurWeg?: string }) => {
  const l = s.nurWeg ? BEZUGSTASTATUR[s.nurWeg] : undefined;
  if (l) setLayout(l);
};

const PILOT = "filo-und-mira";
/** Freigeschaltete Zeichensätze für „Kind auf Tier n" (alle T0..n-Buchstaben). */
const A1 = allowedForTier(1, "de");
const A2 = allowedForTier(2, "de");
const A5 = allowedForTier(5, "de");

describe("TW-E3 — Serien-Daten sind strukturell gültig", () => {
  it("jede Serie besteht validateSerie (Etappen 12–16, minTier konsistent)", () => {
    for (const s of SERIEN) {
      // ★ E4b (24.09.2026)/E8a-2 (26.09.2026): wie beim dritten Test unten
      // `s.nurWeg ?? "de"` statt eines pauschalen "de" - `validateSerie`
      // reicht den Weg an `computeSerieMinTier` weiter, das intern ohnehin
      // `s.nurWeg ?? lernweg` bildet. Für eine Serie MIT `nurWeg` (heute:
      // "en" und "fr") ändert das am Ergebnis nichts (der interne Fallback
      // greift so oder so), macht aber explizit, wessen Stufen wirklich
      // gemessen werden - geprüft, keine Serie kippt dadurch um.
      // ★ W1 (27.09.2026): Serien des Weges „fr" werden auf SEINER
      // Bezugstastatur (Windows-AZERTY) gemessen, wie in den fr-Inhalts-
      // Wächtern - seit W1 hängt ihr Tier dort an den Grossbuchstaben mit
      // Akzent (späte Lektion); eine Serie mit É/Ç kommt dort nie
      // (tests/helfer/w1-grossbuchstaben.ts).
      aufBezug(s); // ★ CS-S: auch Weg „cs" auf seiner Tastatur (siehe BEZUGSTASTATUR)
      const v = validateSerie(s, s.nurWeg ?? "de");
      const probleme = v.problems.filter((p) => !(s.nurWeg === "fr" && w1SerieNie(s) && /nie freischaltbar/.test(p)));
      setLayout("de");
      expect(probleme, `${s.slug}: ${probleme.join("; ")}`).toEqual([]);
    }
  });

  it("deklarierter minTier == berechneter minTier (Wortschatz-Grenze erzwungen)", () => {
    for (const s of SERIEN) {
      // ★ E4b/E8a-2: siehe Kommentar im Test darüber.
      // ★ W1: siehe oben - Weg „fr" auf seiner Bezugstastatur.
      aufBezug(s);
      const t = computeSerieMinTier(s, s.nurWeg ?? "de");
      setLayout("de");
      if (s.nurWeg === "fr" && w1SerieNie(s)) continue;
      expect(t, `${s.slug} minTier`).toBe(s.minTier);
    }
  });

  it("jede EINZELNE Zeile ist auf dem Serien-Tier tippbar (kein Ausreißer)", () => {
    for (const s of SERIEN) {
      for (const line of serieLines(s)) {
        // ★ E4b (24.09.2026): eine Serie nur für Lernweg „en" wird an dessen
        // Stufen gemessen (Bauplan englischer Lehrgang §3.5), alle anderen wie bisher.
        // ★ CS-S: Weg „cs" auf seiner Tastatur (ď ť ň über ˇ), siehe BEZUGSTASTATUR; „fr" bleibt hier wie bisher auf „de".
        // ★ SPRACHEN-9 (30.10.2026): die neun ebenso.
        if (s.nurWeg && s.nurWeg !== "fr") aufBezug(s);
        const t = minTierFor(line, s.nurWeg ?? "de");
        setLayout("de");
        expect(t, `${s.slug}: "${line}"`).not.toBeNull();
        expect(t! <= s.minTier, `${s.slug}: "${line}" braucht Tier ${t}`).toBe(true);
      }
    }
  });

  it("Etappen-Längen liegen im erlaubten Rahmen (12–16)", () => {
    for (const s of SERIEN)
      for (const e of s.etappen) {
        expect(e.lines.length).toBeGreaterThanOrEqual(ETAPPE_MIN_LINES);
        expect(e.lines.length).toBeLessThanOrEqual(ETAPPE_MAX_LINES);
      }
  });

  it("keine doppelten Slugs", () => {
    const slugs = SERIEN.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("Pilot-Serie «Filo und Mira» ist da: T2, 6 Etappen, Geschichte", () => {
    const p = serieBySlug(PILOT);
    expect(p).toBeTruthy();
    expect(p!.minTier).toBe(2);
    expect(serieEtappeCount(p!)).toBe(6);
    expect(p!.kind).toBe("geschichte");
    // Charge I1b (16.08.2026): Der Pilot ist eine Erstleser-Geschichte und
    // gehört seither NUR noch `kids` - die mittlere Stufe hat eigene frühe
    // Serien bekommen (serienTeensFrueh.ts). Darum steht hier eine Stufe.
    expect(p!.stufen).toEqual(["kids"]);
  });
});

describe("TW-E3 — Bücherei-Filter (Tasten × Stufe)", () => {
  it("ein T2-Pilot ist erst mit den T2-Tasten sichtbar", () => {
    // zu wenig Können (nur T0/T1-Tasten) → gesperrt, aber richtige Stufe
    expect(unlockedSerien(A1, "kids", "de", "de").some((s) => s.slug === PILOT)).toBe(false);
    expect(lockedSerien(A1, "kids", "de", "de").some((s) => s.slug === PILOT)).toBe(true);
    // genug Können → sichtbar
    expect(unlockedSerien(A2, "kids", "de", "de").some((s) => s.slug === PILOT)).toBe(true);
    expect(unlockedSerien(A5, "kids", "de", "de").some((s) => s.slug === PILOT)).toBe(true);
  });

  it("PRÄZISION: Tier 2 erreicht, aber noch nicht ALLE T2-Tasten → gesperrt", () => {
    // Gefahr des groben Tier-Gates: `introduced` schaltet Buchstaben einzeln frei.
    // Wer erst beim ERSTEN T2-Buchstaben (h) steht, hat „Tier 2 erreicht", aber
    // z. B. w/m/u der Geschichte noch nicht — die Serie darf NICHT freigegeben sein.
    const early = allowedFromIntroduced([
      "f", "j", "d", "k", "s", "l", "a", "ö", // T0
      "e", "n", "i", "r", "t", // T1
      "h", // erst der erste T2-Buchstabe
    ], "de");
    expect(serieTypeable(serieBySlug(PILOT)!, early)).toBe(false);
    expect(unlockedSerien(early, "kids", "de", "de").some((s) => s.slug === PILOT)).toBe(false);
  });

  it("falsche Altersstufe blendet die Serie ganz aus (weder offen noch gesperrt)", () => {
    // Der Pilot gehört seit Charge I1b nur noch `kids` - fuer die mittlere
    // Stufe und fuer Erwachsene gibt es ihn gar nicht.
    for (const stufe of ["teens", "erwachsen"] as Stufe[]) {
      expect(unlockedSerien(A5, stufe, "de", "de").some((s) => s.slug === PILOT)).toBe(false);
      expect(lockedSerien(A1, stufe, "de", "de").some((s) => s.slug === PILOT)).toBe(false);
      expect(serienForStufe(stufe, "de", "de").some((s) => s.slug === PILOT)).toBe(false);
    }
  });
});

describe("TW-E3 — Serien-Fortschritt (strikt linear, resume-fähig)", () => {
  it("advanceStory führt Etappe für Etappe genau einmal bis «fertig»", () => {
    const serie = serieBySlug(PILOT)!;
    const total = serieEtappeCount(serie);
    let sp = undefined as Parameters<typeof advanceStory>[0];
    // Frisch: neu, Start bei Etappe 0.
    expect(serieStatus({ ...emptyProgress() }, PILOT)).toBe("neu");
    expect(storyStateFor(sp, PILOT).etappe).toBe(0);
    for (let k = 0; k < total; k++) {
      // Vor dem Abschluss der Etappe k steht der Zeiger auf k.
      expect(storyStateFor(sp, PILOT).etappe).toBe(k);
      sp = advanceStory(sp, PILOT, total);
    }
    expect(isStoryDone(sp, PILOT)).toBe(true);
    expect(storyStateFor(sp, PILOT).etappe).toBe(total);
    // Nach „fertig" bleibt es fertig (kein Über-den-Rand-Zählen).
    sp = advanceStory(sp, PILOT, total);
    expect(storyStateFor(sp, PILOT).etappe).toBe(total);
    expect(serieStatus({ ...emptyProgress(), storyProgress: sp }, PILOT)).toBe("fertig");
  });

  it("startEtappeFor nimmt eine begonnene Serie an der richtigen Etappe wieder auf", () => {
    const serie = serieBySlug(PILOT)!;
    // Zwei Etappen geschafft → Resume bei Etappe 2.
    const sp = advanceStory(advanceStory(undefined, PILOT, 6), PILOT, 6);
    const prog = { ...emptyProgress(), storyProgress: sp };
    expect(serieStatus(prog, PILOT)).toBe("offen");
    expect(startEtappeFor(prog, serie)).toBe(2);
    // Fertige Serie: „nochmal" startet wieder bei 0.
    let done = undefined as Parameters<typeof advanceStory>[0];
    for (let k = 0; k < 6; k++) done = advanceStory(done, PILOT, 6);
    expect(startEtappeFor({ ...emptyProgress(), storyProgress: done }, serie)).toBe(0);
  });

  it("firstOpenSerie bietet nur BEGONNENE, freigeschaltete Serien an (fürs Einweben)", () => {
    // nichts begonnen → kein Angebot
    expect(firstOpenSerie(emptyProgress(), A2, "kids", "de", "de")).toBeUndefined();
    // begonnen, aber Tasten reichen nicht → kein Angebot
    const started = { ...emptyProgress(), storyProgress: advanceStory(undefined, PILOT, 6) };
    expect(firstOpenSerie(started, A1, "kids", "de", "de")).toBeUndefined();
    // begonnen + freigeschaltet + richtige Stufe → Angebot
    expect(firstOpenSerie(started, A2, "kids", "de", "de")?.slug).toBe(PILOT);
    // fertige Serie wird NICHT mehr angeboten
    let done = undefined as Parameters<typeof advanceStory>[0];
    for (let k = 0; k < 6; k++) done = advanceStory(done, PILOT, 6);
    expect(firstOpenSerie({ ...emptyProgress(), storyProgress: done }, A2, "kids", "de", "de")).toBeUndefined();
  });
});
