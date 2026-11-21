/**
 * ★★★★★ WÄCHTER: die englische Reihenfolge (Weg „en"), Etappe E2 (24.09.2026).
 *
 * BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md §3.3a (Fassung A2, gemessen),
 * §3.5 (Stufen), §6.3 (Abzeichen), §11 (Fallen). Der Wächter für Weg „de"
 * bleibt eigenständig: `tests/tastenflow-lernweg-de-unveraendert.test.ts`.
 * Dieser hier prüft NUR den neuen Weg - „de" wird nirgends verändert erwartet.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  HOME_KEYS,
  SHIFT_UNIT,
  achteGrundtasteFuerLayout,
  advanceIntroduced,
  allMastered,
  ensureIntroduced,
  focusUnits,
  introOrder,
  introducedUpTo,
  isMastered,
  keyDifficulty,
  layoutLetterOrder,
  masteredCount,
  nextLetter,
  offeneBaustellen,
  personalBaseMs,
  startPoints,
  weakestLetters,
} from "../src/lib/typing/letters";
import { LERNWEGE, lernwegDef, type Lernweg } from "../src/lib/typing/lernweg";
import { allowedForTier, tierChars, tierOfChar, TIERS } from "../src/lib/typing/tiers";
import { niveauDefs } from "../src/lib/typing/schreibprobe";
import { awardBadges, emptyProgress, type LetterStat, type TypingProgress } from "../src/lib/typing";
import { setLayout } from "../src/lib/typing/layouts";

afterEach(() => setLayout("de"));

// ── Werkzeug ─────────────────────────────────────────────────────────────────

function sitzt(): LetterStat {
  return { hits: 40, misses: 0, sumMs: 40 * 300, timed: 40, recent: Array(20).fill(300) };
}

/** Ein Spielstand mit den ersten `n` Einheiten des Weges freigeschaltet und sitzend. */
function stand(n: number, lernweg: Lernweg, extra: Partial<TypingProgress> = {}): TypingProgress {
  const introduced = introOrder(lernweg).slice(0, n);
  const letters: Record<string, LetterStat> = {};
  for (const u of introduced) letters[u] = sitzt();
  return {
    ...emptyProgress(),
    introduced,
    letters,
    badgeTally: { rounds: 1, perfect: 0, cleanStreak: 0, bestCleanStreak: 0, stars3: 0, days: 1 },
    ...extra,
  };
}

function runde(p: TypingProgress, lernweg: Lernweg) {
  return awardBadges(p, { acc: 0.9, cpm: 50, stars: 2, level: 1 }, Date.now(), lernweg);
}

// ── introOrder / achte Grundtaste ────────────────────────────────────────────

describe("introOrder(\"en\") - US/UK-Tastatur", () => {
  it.each(["us", "uk"] as const)("%s: die 8. Grundtaste ist „;\", keine Umlaute/ß/§/°", (layout) => {
    setLayout(layout);
    const order = introOrder("en");
    expect(order[7]).toBe(";");
    for (const verboten of ["ä", "ö", "ü", "ß", "§", "°"]) {
      expect(order).not.toContain(verboten);
    }
    // ★ D1 Nr. 6 (28.09.2026, Didaktik-Recherche Englisch E7): „€" gibt es auf
    // UK (AltGr + 4) - dort ist es seither die letzte Sprosse; US hat es nicht.
    if (layout === "uk") expect(order[order.length - 1]).toBe("€");
    else expect(order).not.toContain("€");
  });

  it("us: 26 Buchstaben + „;\" (27) vor der Umschalttaste, dann die restlichen 19", () => {
    setLayout("us");
    const order = introOrder("en");
    const shiftAt = order.indexOf(SHIFT_UNIT);
    expect(shiftAt).toBe(15); // Grundreihe (8) + e i n r t h o (7)
    expect(order.slice(0, 8)).toEqual(["f", "j", "d", "k", "s", "l", "a", ";"]);
    expect(order.slice(8, 15)).toEqual(["e", "i", "n", "r", "t", "h", "o"]);
    // ★ D-1 (28.09.2026): Punkt und Komma direkt nach der Umschalttaste.
    expect(order.slice(16, 18)).toEqual([".", ","]);
    expect(order.slice(18, 22)).toEqual(["u", "y", "w", "m"]); // der gemessene Hebel (§3.3a)
    expect(order.slice(22, 26)).toEqual(["c", "g", "p", "b"]);
    expect(order.slice(26, 30)).toEqual(["v", "x", "q", "z"]);
  });

  it("„'\" und '\"' stehen im Satzzeichen-Block, nicht bei den Sonderzeichen", () => {
    setLayout("us");
    const order = introOrder("en");
    const punct = lernwegDef("en").punctOrder;
    expect(punct).toContain("'");
    expect(punct).toContain('"');
    // Reihenfolge: erst alle Buchstaben+Shift, dann die Satzzeichen mit „'" und '"'.
    // ★ D-1: „." und „," stehen seither direkt nach ⇧ - gemessen wird ab dem
    // ersten Satzzeichen NACH dem Alphabet.
    const ersterBuchstabeNachAlphabet = order.indexOf(punct.filter((c) => c !== "." && c !== ",")[0]);
    expect(order.indexOf("'")).toBeGreaterThanOrEqual(ersterBuchstabeNachAlphabet);
    expect(order.indexOf('"')).toBeGreaterThanOrEqual(ersterBuchstabeNachAlphabet);
  });

  it("„;\" kommt nur EINMAL vor (Grundtaste) - nicht auch noch als Satzzeichen", () => {
    setLayout("us");
    const order = introOrder("en");
    expect(order.filter((u) => u === ";")).toHaveLength(1);
  });

  it("uk hat „£\", us nicht", () => {
    setLayout("uk");
    expect(introOrder("en")).toContain("£");
    setLayout("us");
    expect(introOrder("en")).not.toContain("£");
  });

  it("„\\\\\" ist auf US und UK ein lernbares Sonderzeichen", () => {
    for (const layout of ["us", "uk"] as const) {
      setLayout(layout);
      expect(introOrder("en")).toContain("\\");
    }
  });
});

describe("introOrder(\"en\") - deutsche/Schweizer Tastatur (F3: Englisch in Österreich)", () => {
  it.each(["de", "ch"] as const)("%s: die 8. Grundtaste ist „ö\", nicht „;\"", (layout) => {
    setLayout(layout);
    const order = introOrder("en");
    expect(order[7]).toBe("ö");
    expect(order.slice(0, 8)).toEqual(["f", "j", "d", "k", "s", "l", "a", "ö"]);
  });

  it("„;\" taucht auf DE/CH für Weg „en\" gar nicht auf (weder Grundtaste noch Satzzeichen)", () => {
    setLayout("de");
    expect(introOrder("en")).not.toContain(";");
  });

  it("Weg „de\" ist von der Ersetzung unberührt - Position 8 bleibt „ö\", wie immer", () => {
    setLayout("de");
    expect(introOrder("de")[7]).toBe("ö");
    setLayout("us");
    expect(introOrder("de")[7]).not.toBe("ö"); // auf US fällt „ö" ohnehin heraus (missing)
  });

  it("achteGrundtasteFuerLayout ersetzt NUR Position 8, sonst nichts", () => {
    const roh = ["f", "j", "d", "k", "s", "l", "a", ";", "e", ";", "z"]; // zweites „;" absichtlich
    const ersetzt = achteGrundtasteFuerLayout(roh, "en", "de");
    expect(ersetzt).toEqual(["f", "j", "d", "k", "s", "l", "a", "ö", "e", ";", "z"]);
  });

  it("wirkt nicht auf Weg „de\" oder auf US/UK", () => {
    const roh = ["f", "j", "d", "k", "s", "l", "a", ";"];
    expect(achteGrundtasteFuerLayout(roh, "de", "de")).toEqual(roh);
    expect(achteGrundtasteFuerLayout(roh, "en", "us")).toEqual(roh);
    expect(achteGrundtasteFuerLayout(roh, "en", "uk")).toEqual(roh);
  });
});

describe("layoutLetterOrder(\"en\")", () => {
  it("nur Buchstaben (ohne ⇧/Satzzeichen/Ziffern/Sonderzeichen), 27 Einheiten auf US", () => {
    setLayout("us");
    const letters = layoutLetterOrder("en");
    expect(letters).toHaveLength(27); // 26 Buchstaben + die Grundtaste „;"
    expect(letters).not.toContain(SHIFT_UNIT);
  });

  it("auf DE mit „ö\" an Position 8, wie introOrder", () => {
    setLayout("de");
    expect(layoutLetterOrder("en")[7]).toBe("ö");
  });
});

// ── Stufen (Tiers, §3.5) ─────────────────────────────────────────────────────

describe("Stufen des Weges „en\" (§3.5: T0=8, T1=15, T2=23, T3=27)", () => {
  it("tierCuts stimmen mit dem Bauplan überein", () => {
    expect(lernwegDef("en").tierCuts).toEqual([8, 15, 23, 27]);
  });

  it("tierChars(\"en\") liefert die vier Buchstaben-Gruppen + Satzzeichen + Rest", () => {
    const chars = tierChars("en");
    expect(chars[0]).toEqual(["f", "j", "d", "k", "s", "l", "a", ";"]);
    expect(chars[1]).toEqual(["e", "i", "n", "r", "t", "h", "o"]);
    expect(chars[2]).toEqual(["u", "y", "w", "m", "c", "g", "p", "b"]);
    expect(chars[3]).toEqual(["v", "x", "q", "z"]);
  });

  it("tierOfChar: „u\" ist erst ab T2 dran (der gemessene Hebel), nicht T1", () => {
    expect(tierOfChar("u", "en")).toBe(2);
    expect(tierOfChar("h", "en")).toBe(1);
    expect(tierOfChar(";", "en")).toBe(0);
  });

  it("allowedForTier(0, \"en\") ist genau die Grundreihe", () => {
    expect(allowedForTier(0, "en")).toEqual(new Set(["f", "j", "d", "k", "s", "l", "a", ";"]));
  });

  it("TIERS bleiben gleich (0..5) - nur die Zeichen je Stufe unterscheiden sich", () => {
    expect(TIERS).toEqual([0, 1, 2, 3, 4, 5]);
  });
});

// ── homeKeys / keyDifficulty ─────────────────────────────────────────────────

describe("homeKeys und keyDifficulty auf Weg „en\"", () => {
  it("homeKeys(\"en\") ist a s d f j k l ; (plus „ö\" für die DE/CH-Ersetzung)", () => {
    const keys = lernwegDef("en").homeKeys;
    for (const k of ["a", "s", "d", "f", "j", "k", "l", ";"]) expect(keys.has(k)).toBe(true);
    expect(keys.has("ö")).toBe(true); // F3: die physische Taste auf DE/CH
  });

  it("„de\" bleibt unverändert - genau HOME_KEYS, mit „ö\", ohne „;\"", () => {
    expect(lernwegDef("de").homeKeys).toBe(HOME_KEYS);
    expect(HOME_KEYS.has(";")).toBe(false);
  });

  it("keyDifficulty(\";\", \"en\") ist Grundreihen-leicht, nicht Satzzeichen-schwer", () => {
    const diffHome = keyDifficulty("a", "en"); // eine unstrittige Grundreihen-Taste
    expect(keyDifficulty(";", "en")).toBe(diffHome);
    // Gegenprobe: auf Weg „de" ist „;" ein echtes Satzzeichen (unverändert).
    expect(keyDifficulty(";", "de")).toBeGreaterThan(diffHome);
  });

  it("auf DE-Tastatur ist „ö\" für Weg „en\" ebenso Grundreihen-leicht", () => {
    expect(keyDifficulty("ö", "en")).toBe(keyDifficulty("a", "en"));
  });

  it("de/en unterscheiden sich bei „ö\": auf „de\" ist es die Grundreihe (immer schon so)", () => {
    expect(keyDifficulty("ö", "de")).toBe(keyDifficulty("a", "de"));
  });
});

// ── startPoints ──────────────────────────────────────────────────────────────

describe("startPoints(sprache, \"en\")", () => {
  it("Home row zeigt auf US die echten acht Tasten inklusive „;\"", () => {
    setLayout("us");
    const pts = startPoints("en", "en");
    const start = pts.find((p) => p.key === "start")!;
    expect(start.label).toBe("Home position (whole home row f j d k s l a ;)");
    expect(start.units).toBe(8);
  });

  it("Home row zeigt auf DE die physische Taste „ö\" statt „;\"", () => {
    setLayout("de");
    const pts = startPoints("en", "en");
    const start = pts.find((p) => p.key === "start")!;
    expect(start.label).toBe("Home position (whole home row f j d k s l a ö)");
  });

  it("dieselben Landmarken wie „de\": Anfänger, Grundreihe, erste Buchstaben, alle, +Satz, +Zahlen, alles", () => {
    setLayout("us");
    const keys = startPoints("en", "en").map((p) => p.key);
    expect(keys).toEqual(["anfaenger", "start", "gross", "buchstaben", "satz", "zahlen", "alles"]);
  });

  it("units wachsen streng monoton und „alles\" ist die volle introOrder-Länge", () => {
    setLayout("us");
    const pts = startPoints("en", "en");
    for (let i = 1; i < pts.length; i++) expect(pts[i].units).toBeGreaterThan(pts[i - 1].units);
    expect(pts[pts.length - 1].units).toBe(introOrder("en").length);
  });

  it("deutsche Beschriftung (sprache=\"de\") für einen Weg-„en\"-Lehrer/Klasse funktioniert ebenso", () => {
    setLayout("us");
    const pts = startPoints("de", "en");
    expect(pts.find((p) => p.key === "start")!.label).toBe("Grundstellung (ganze Grundreihe f j d k s l a ;)");
  });
});

// ── NIVEAU_DEFS (Tippchallenge-Niveaus, schreibprobe.ts) ────────────────────

describe("niveauDefs(\"en\") - Tastaturniveaus der Tippchallenge", () => {
  it("Home row nennt f j d k s l a ; auf US", () => {
    setLayout("us");
    const defs = niveauDefs("en");
    const start = defs.find((d) => d.key === "start")!;
    expect(start.en.label).toBe("Home row (f j d k s l a ;)");
    expect(start.einheiten).toEqual(["f", "j", "d", "k", "s", "l", "a", ";"]);
  });

  it("„All letters\" umfasst alle 26 Buchstaben + die Grundtaste, keine Satzzeichen", () => {
    setLayout("us");
    const defs = niveauDefs("en");
    const alle = defs.find((d) => d.key === "buchstaben")!;
    expect(alle.einheiten).toHaveLength(27 + 1); // 27 Buchstaben-Einheiten + ⇧
    expect(alle.einheiten).not.toContain(".");
  });

  it("+ punctuation nennt die englischen Satzzeichen, nicht die deutschen", () => {
    setLayout("us");
    const defs = niveauDefs("en");
    const satz = defs.find((d) => d.key === "satz")!;
    expect(satz.en.erklaerung).toContain("'");
    expect(satz.en.erklaerung).not.toContain(": ;"); // „de"s Satzzeichen enden auf „;"
  });

  it("de-Niveaus bleiben unverändert (Grundreihe f j d k s l a ö)", () => {
    setLayout("us");
    const defs = niveauDefs("de");
    expect(defs.find((d) => d.key === "start")!.label).toBe("Grundreihe (f j d k s l a ö)");
  });
});

// ── Badges (Bauplan §6.3) ────────────────────────────────────────────────────

describe("Abzeichen auf Weg „en\" (Bauplan §6.3)", () => {
  it("Pünktchen-Panda (ä ö ü) ist auf Weg „en\" NIE erreichbar, auch mit allem freigeschaltet", () => {
    setLayout("us");
    const voll = stand(introOrder("en").length, "en");
    const r = runde(voll, "en");
    expect(Object.keys(r.progress.badges ?? {})).not.toContain("puenktchen-panda");
  });

  it("Schlangen-S (ß) ist auf Weg „en\" NIE erreichbar", () => {
    setLayout("us");
    const voll = stand(introOrder("en").length, "en");
    const r = runde(voll, "en");
    expect(Object.keys(r.progress.badges ?? {})).not.toContain("schlangen-s");
  });

  it("auch auf DE-Tastatur (wo „ö\" die 8. Grundtaste ist) bleibt Pünktchen-Panda unerreichbar", () => {
    setLayout("de");
    const voll = stand(introOrder("en").length, "en");
    const r = runde(voll, "en");
    expect(Object.keys(r.progress.badges ?? {})).not.toContain("puenktchen-panda");
  });

  it("Grundstellungs-Gorilla wird auf Weg „en\" verdient, sobald die 8 Grundtasten sitzen", () => {
    setLayout("us");
    const r = runde(stand(8, "en"), "en");
    expect(r.newly.map((b) => b.id)).toContain("grundstellungs-gorilla");
  });

  it("Gegenprobe: auf Weg „de\" sind dieselben zwei Abzeichen weiterhin ganz normal erreichbar", () => {
    setLayout("de");
    const voll = stand(introOrder("de").length, "de");
    const r = runde(voll, "de");
    expect(Object.keys(r.progress.badges ?? {})).toContain("puenktchen-panda");
    expect(Object.keys(r.progress.badges ?? {})).toContain("schlangen-s");
  });
});

// ── Die golden „de"-Datei bleibt die Wahrheit für Weg „de" ──────────────────
//
// Dieser Wächter hier fasst nichts an „de" an; der eigenständige Wächter
// `tests/tastenflow-lernweg-de-unveraendert.test.ts` bleibt die Prüfung dafür
// und muss weiterhin grün sein (im Verifikations-Lauf mitgeführt).

// ── Fehlerklassen-Wächter: kein Reihenfolge-Aufruf ohne echten Lernweg ──────

describe("Fehlerklassen-Wächter: jede Reihenfolge-Funktion unterscheidet „de\" von „en\"", () => {
  it("introOrder/ensureIntroduced/nextLetter/introducedUpTo unterscheiden sich ab der 8. Einheit", () => {
    setLayout("us");
    // Auf US fällt „ö" aus „de" heraus (missing) - die 8. Einheit ist dort
    // schon „e", bei „en" ist es die Grundtaste „;". Bewusst n=8, nicht 9:
    // ab n=9 rutscht „de" (ohne „ö") zufällig auf dieselbe nächste Taste wie
    // „en" (beide dann „i") - das wäre kein Fehler, nur ein ungünstiger Test.
    expect(introOrder("de")[7]).not.toBe(introOrder("en")[7]); // „e" gegen „;"
    expect(ensureIntroduced(introducedUpTo(8, "de"), "de")).not.toEqual(
      ensureIntroduced(introducedUpTo(8, "en"), "en"),
    );
    expect(nextLetter(introducedUpTo(8, "de"), "de")).not.toBe(
      nextLetter(introducedUpTo(8, "en"), "en"),
    );
  });

  it("advanceIntroduced schaltet je Weg eine andere Taste auf", () => {
    setLayout("us");
    const introDe = introducedUpTo(8, "de");
    const introEn = introducedUpTo(8, "en");
    const letters: Record<string, LetterStat> = {};
    for (const u of new Set([...introDe, ...introEn])) letters[u] = sitzt();
    const naechsteDe = advanceIntroduced(introDe, letters, "de")[introDe.length];
    const naechsteEn = advanceIntroduced(introEn, letters, "en")[introEn.length];
    expect(naechsteDe).not.toBe(naechsteEn);
  });

  it("keyDifficulty(\";\", …) unterscheidet sich zwischen den Wegen", () => {
    expect(keyDifficulty(";", "de")).not.toBe(keyDifficulty(";", "en"));
  });

  it("personalBaseMs zieht auf jedem Weg seine EIGENEN Grundreihen-Tasten heran", () => {
    // Nur drei Einheiten sitzen sauber bei 600 ms: „a", „s" (auf beiden Wegen
    // Grundreihe) und „;" (nur auf Weg „en" Grundreihe). `BASE_MS_MIN_KEYS`
    // (3) ist die Schwelle, ab der überhaupt normiert wird - auf Weg „de"
    // zählen nur „a"/„s" (2, zu wenig ⇒ Rückfall auf das nominelle Ziel), auf
    // Weg „en" zählt „;" mit (3, genug ⇒ echte Normierung auf 600 ms).
    const flott = { hits: 40, misses: 0, sumMs: 40 * 600, timed: 40, recent: Array(20).fill(600) };
    const letters: Record<string, LetterStat> = { a: flott, s: flott, ";": flott };
    const introEn = ["a", "s", ";"];
    const baseEn = personalBaseMs(introEn, letters, "en");
    const baseDe = personalBaseMs(["a", "s"], letters, "de");
    expect(baseEn).toBe(600); // echte Normierung, „;" zählt mit
    expect(baseDe).toBe(900); // TARGET_MS-Rückfall, zu wenig Grundreihen-Tasten
  });

  it("canAdvance/allMastered/masteredCount/offeneBaustellen: „;\" zählt auf „en\" als leichte Grundreihen-Taste", () => {
    const introEn = ["a", "s", "d", "f", "j", "k", "l", ";"];
    const letters: Record<string, LetterStat> = {};
    for (const c of introEn) letters[c] = sitzt();
    expect(allMastered(introEn, letters, "en")).toBe(true);
    expect(masteredCount(introEn, letters, "en")).toBe(8);
    expect(offeneBaustellen(introEn, letters, "en")).toBe(0);
    expect(isMastered(letters[";"], undefined, "en", ";")).toBe(true);
  });

  it("weakestLetters/focusUnits laufen auf „en\" ohne Fehler und liefern etwas", () => {
    setLayout("us");
    const intro = introducedUpTo(12, "en");
    const letters: Record<string, LetterStat> = {};
    for (const u of intro) letters[u] = sitzt();
    letters[intro[intro.length - 1]] = { hits: 2, misses: 8, sumMs: 0, timed: 0, recent: [] };
    expect(weakestLetters(intro, letters, "en", 3).length).toBeGreaterThan(0);
    expect(focusUnits(intro, letters, "en", 3).length).toBeGreaterThan(0);
  });

  it("LERNWEGE.de und LERNWEGE.en sind wirklich zwei verschiedene Tabellen", () => {
    expect(LERNWEGE.de.letterOrder).not.toEqual(LERNWEGE.en.letterOrder);
    expect(LERNWEGE.de.punctOrder).not.toEqual(LERNWEGE.en.punctOrder);
    expect(LERNWEGE.de.tierCuts).not.toEqual(LERNWEGE.en.tierCuts);
  });
});
