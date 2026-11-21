/**
 * Der GESCHICHTEN-HAUPTWEG (28.07.2026, Wunsch Johannes): Nach jeder Runde und
 * jeder Lektion wird die nächste fällige Geschichte angekündigt; wer immer
 * bestätigt, kommt durch die ganze Bücherei. Dazu zählt eine Etappe seit diesem
 * Umbau genauso viel wie eine Übungsrunde (Abzeichen + neue Tasten).
 *
 * Geprüft wird die REIHENFOLGE-Regel (erst zu Ende lesen, was offen ist) und die
 * Verbuchung — nicht einzelne Titel, damit neue Inhalte die Tests nicht brechen.
 */
import { describe, it, expect } from "vitest";
import {
  advanceStory,
  allowedFromIntroduced,
  emptyProgress,
  introOrder,
  isStoryBadge,
  nextSerieFor,
  noteStoryLine,
  recordStoryEtappe,
  serieEtappeCount,
  serieStatus,
  storyStateFor,
  unlockedSerien,
  type TypingProgress,
} from "../src/lib/typing";

const ALLE_TASTEN = () => allowedFromIntroduced([...introOrder("de")], "de");
const TAG = new Date(2026, 6, 28, 10, 0, 0).getTime(); // 28.07.2026, 10:00
const TAG_DARAUF = TAG + 24 * 3600 * 1000;

describe("Warteschlange der Geschichten", () => {
  it("bietet ohne Lesestand die erste Geschichte der Stufe an", () => {
    const p = emptyProgress();
    const serie = nextSerieFor(p, ALLE_TASTEN(), "teens", "de", "de");
    expect(serie).toBeDefined();
    expect(serieStatus(p, serie!.slug)).toBe("neu");
  });

  it("liest erst zu Ende, was begonnen ist — auch wenn es nicht die erste ist", () => {
    const alle = unlockedSerien(ALLE_TASTEN(), "teens", "de", "de");
    expect(alle.length).toBeGreaterThan(2);
    const dritte = alle[2];
    // In der dritten Serie eine Etappe vorrücken → sie ist „offen".
    const p: TypingProgress = {
      ...emptyProgress(),
      storyProgress: advanceStory({}, dritte.slug, serieEtappeCount(dritte)),
    };
    expect(serieStatus(p, dritte.slug)).toBe("offen");
    expect(nextSerieFor(p, ALLE_TASTEN(), "teens", "de", "de")?.slug).toBe(dritte.slug);
  });

  it("rückt nach einer fertigen Geschichte auf die nächste ungelesene vor", () => {
    const alle = unlockedSerien(ALLE_TASTEN(), "teens", "de", "de");
    const erste = alle[0];
    // Erste Serie komplett durchlesen.
    let sp = {};
    for (let i = 0; i < serieEtappeCount(erste); i++)
      sp = advanceStory(sp, erste.slug, serieEtappeCount(erste));
    const p: TypingProgress = { ...emptyProgress(), storyProgress: sp };
    expect(serieStatus(p, erste.slug)).toBe("fertig");
    const naechste = nextSerieFor(p, ALLE_TASTEN(), "teens", "de", "de");
    expect(naechste?.slug).not.toBe(erste.slug);
    expect(serieStatus(p, naechste!.slug)).toBe("neu");
  });

  it("bietet nichts an, wenn die Tasten noch nicht reichen", () => {
    const p = emptyProgress(); // Anfänger: nur f und j
    expect(nextSerieFor(p, allowedFromIntroduced(["f", "j"], "de"), "teens", "de", "de")).toBeUndefined();
  });
});

describe("Lese-Abzeichen", () => {
  it("gibt für die erste Etappe Seiten-Spatz — und für eine fehlerfreie Federleicht", () => {
    const r = recordStoryEtappe(emptyProgress(), { clean: true, storyDone: false }, TAG, "de");
    const ids = r.newly.map((b) => b.id);
    expect(ids).toContain("seiten-spatz");
    expect(ids).toContain("federleicht");
    expect(r.progress.badgeTally?.etappen).toBe(1);
    // Alle stammen aus dem Lese-Bereich → eigener Klang.
    expect(r.newly.every(isStoryBadge)).toBe(true);
  });

  it("belohnt das Weiterlesen an einem anderen Tag (»Lesezeichen-Held«)", () => {
    const tag1 = recordStoryEtappe(emptyProgress(), { clean: false, storyDone: false }, TAG, "de");
    expect(tag1.newly.map((b) => b.id)).not.toContain("lesezeichen-held");
    const tag2 = recordStoryEtappe(
      tag1.progress,
      { clean: false, storyDone: false },
      TAG_DARAUF, "de",
    );
    expect(tag2.newly.map((b) => b.id)).toContain("lesezeichen-held");
  });

  it("gibt »Nimmersatt« erst bei der dritten Etappe DESSELBEN Tages", () => {
    let p = emptyProgress();
    const ids: string[][] = [];
    for (let i = 0; i < 3; i++) {
      const r = recordStoryEtappe(p, { clean: false, storyDone: false }, TAG + i * 60000, "de");
      p = r.progress;
      ids.push(r.newly.map((b) => b.id));
    }
    expect(ids[0]).not.toContain("nimmersatt");
    expect(ids[1]).not.toContain("nimmersatt");
    expect(ids[2]).toContain("nimmersatt");
    expect(p.badgeTally?.storyDayCount).toBe(3);
  });

  it("zählt fertige Geschichten und gibt »In einem Rutsch« nur am selben Tag", () => {
    const amStueck = recordStoryEtappe(
      emptyProgress(),
      { clean: false, storyDone: true, sameDay: true },
      TAG, "de",
    );
    expect(amStueck.newly.map((b) => b.id)).toContain("lese-luchs");
    expect(amStueck.newly.map((b) => b.id)).toContain("in-einem-rutsch");
    expect(amStueck.progress.badgeTally?.storiesDone).toBe(1);

    const ueberTage = recordStoryEtappe(
      emptyProgress(),
      { clean: false, storyDone: true, sameDay: false },
      TAG, "de",
    );
    expect(ueberTage.newly.map((b) => b.id)).not.toContain("in-einem-rutsch");
  });
});

describe("Lesestand", () => {
  it("merkt Zeile UND Starttag, damit später genau dort weitergelesen wird", () => {
    const sp = noteStoryLine({}, "test-serie", 0, 5, "2026-07-28");
    const st = storyStateFor(sp, "test-serie");
    expect(st.line).toBe(5);
    expect(st.startDay).toBe("2026-07-28");
    // Der Starttag bleibt beim Weiterlesen erhalten (auch an einem anderen Tag).
    const sp2 = noteStoryLine(sp, "test-serie", 0, 8, "2026-07-29");
    expect(storyStateFor(sp2, "test-serie").startDay).toBe("2026-07-28");
    expect(storyStateFor(sp2, "test-serie").line).toBe(8);
  });
});
