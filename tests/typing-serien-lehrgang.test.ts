/**
 * Wächter der LEHRGANGS-Treppe (07.08.2026, serienLehrgangFrueh.ts):
 *
 * Der Lehrgang führt das n als LETZTEN Buchstaben ein (Lektion 16) — die frühe
 * Bücherei-Treppe vom 29./30.07. ist auf die INTRO_ORDER getextet und brauchte
 * durchweg das n. Ein reiner Lehrgangs-Geher hatte darum bis 31 Einheiten
 * KEINE einzige Geschichte; der angekündigte Geschichten-Hauptweg schwieg
 * 15 Lektionen lang.
 *
 * Diese Ratsche stellt sicher: Ab Lehrgangs-Lektion 9 („T und Z") gibt es für
 * JEDE Altersstufe etwas zu lesen — und das darf nie wieder verschwinden.
 * Gemessen wird am ECHTEN Lehrgangs-Stand (`introducedThroughLesson`), nicht
 * an der INTRO_ORDER.
 */
import { describe, it, expect } from "vitest";
import {
  STUFEN,
  allowedFromIntroduced,
  computeSerieMinTier,
  emptyProgress,
  introducedThroughLesson,
  nextSerieFor,
  unlockedSerien,
  validateSerie,
} from "../src/lib/typing";
import { SERIEN_LEHRGANG_FRUEH } from "../src/lib/typing/serienLehrgangFrueh";

/** Der Tastenstand eines reinen Lehrgangs-Gehers nach Lektion `id`. */
function lehrgangAllowed(id: string): Set<string> {
  return allowedFromIntroduced(introducedThroughLesson(undefined, id, "de"), "de");
}

describe("serienLehrgangFrueh — Struktur und Rechte", () => {
  it("alle sechs Serien sind formal gültig (Etappen, Zeilen, minTier)", () => {
    expect(SERIEN_LEHRGANG_FRUEH).toHaveLength(6);
    for (const s of SERIEN_LEHRGANG_FRUEH) {
      const v = validateSerie(s, "de");
      expect(v.problems, s.slug).toEqual([]);
      expect(computeSerieMinTier(s, "de"), s.slug).toBe(s.minTier);
      expect(s.herkunft?.lizenz).toMatch(/Eigenes Werk/);
    }
  });

  it("keine Serie ist gleichzeitig für 7–9 und 13–15 freigegeben", () => {
    for (const s of SERIEN_LEHRGANG_FRUEH)
      expect(s.stufen.includes("kids") && s.stufen.includes("erwachsen"), s.slug).toBe(false);
  });
});

describe("die Lehrgangs-Treppe — Öffnung am echten Lehrgangs-Stand (Ratsche)", () => {
  it("vor Lektion 9 (»R und U«): noch keine der sechs Serien tippbar", () => {
    const allowed = lehrgangAllowed("ober-ru");
    for (const stufe of STUFEN) {
      const slugs = unlockedSerien(allowed, stufe, "de", "de").map((s) => s.slug);
      for (const s of SERIEN_LEHRGANG_FRUEH)
        expect(slugs, `${stufe} vor T/Z`).not.toContain(s.slug);
    }
  });

  it("nach Lektion 9 (»T und Z«, 17 Einh.): JEDE Stufe hat mindestens eine Serie", () => {
    const allowed = lehrgangAllowed("ober-tz");
    expect(unlockedSerien(allowed, "kids", "de", "de").map((s) => s.slug)).toContain("der-graue-kater");
    expect(unlockedSerien(allowed, "teens", "de", "de").map((s) => s.slug)).toContain("der-graue-kater");
    expect(unlockedSerien(allowed, "erwachsen", "de", "de").map((s) => s.slug)).toContain("die-letzte-kiste");
    expect(unlockedSerien(allowed, "erwachsen", "de", "de").map((s) => s.slug)).toContain("die-letzte-kiste");
    for (const stufe of STUFEN)
      expect(unlockedSerien(allowed, stufe, "de", "de").length, stufe).toBeGreaterThanOrEqual(1);
  });

  it("nach Lektion 10 (»W und O«) kommt je Stufe die zweite Serie dazu", () => {
    const allowed = lehrgangAllowed("ober-wo");
    expect(unlockedSerien(allowed, "kids", "de", "de").map((s) => s.slug)).toContain("otto-der-otter");
    expect(unlockedSerien(allowed, "erwachsen", "de", "de").map((s) => s.slug)).toContain("das-alte-hotel");
    for (const stufe of STUFEN)
      expect(unlockedSerien(allowed, stufe, "de", "de").length, stufe).toBeGreaterThanOrEqual(2);
  });

  it("nach Lektion 12 (»M und V«) die dritte", () => {
    const allowed = lehrgangAllowed("unter-mv");
    expect(unlockedSerien(allowed, "teens", "de", "de").map((s) => s.slug)).toContain("die-maus-im-turm");
    expect(unlockedSerien(allowed, "erwachsen", "de", "de").map((s) => s.slug)).toContain("der-marmorsaal");
    for (const stufe of STUFEN)
      expect(unlockedSerien(allowed, stufe, "de", "de").length, stufe).toBeGreaterThanOrEqual(3);
  });

  it("der Geschichten-Hauptweg bietet dem Lehrgangs-Geher ab Lektion 9 wirklich an", () => {
    // Genau der Aufruf, den `serienLehrgangFrueh.ts` für das Angebot benutzt
    // (bis E7, 19.09.2026, auch `TypingTrainer.tsx` - siehe `trainerMode.ts`).
    const introduced = introducedThroughLesson(undefined, "ober-tz", "de");
    const allowed = allowedFromIntroduced(introduced, "de");
    const p = { ...emptyProgress(), introduced };
    expect(nextSerieFor(p, allowed, "kids", "de", "de")?.slug).toBe("der-graue-kater");
    expect(nextSerieFor(p, allowed, "erwachsen", "de", "de")?.slug).toBe("die-letzte-kiste");
  });
});
