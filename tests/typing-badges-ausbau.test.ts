/**
 * Wächter für den Abzeichen-AUSBAU vom 09.08.2026 (52 → 105 Abzeichen).
 *
 * Anlass (Johannes): „Jano hat 32 von 50 Abzeichen und kann noch nicht einmal
 * alle Buchstaben." Auf den letzten 42 der 73 Einheiten hing genau EIN
 * Abzeichen. Diese Datei sichert die fünf neuen Achsen — und vor allem die
 * Regel, an der alles hängt:
 *
 *   ★★ KEIN Abzeichen darf an einem der beiden Lernwege hängen.
 *
 * Der Test „Gleichstellung" ganz unten baut denselben Lernstand zweimal — einmal
 * über den Lehrgang, einmal über „Mein Training" — und verlangt dieselbe Ernte.
 */
import { describe, it, expect } from "vitest";
import {
  BADGES,
  CHAIN_TIERS,
  EXAM_MS,
  INTRO_ORDER,
  LESSONS,
  LETTER_ORDER,
  SPEED_MIN_KEYS,
  TypingProgress,
  awardBadges,
  emptyProgress,
  introOrder,
  lessonsDoneCount,
  nextGoals,
  weekKey,
  type LetterStat,
  type RoundDetail,
} from "../src/lib/typing";

/* ────────────────────────────────────────────────────────────────────────────
 * Werkzeug
 * ──────────────────────────────────────────────────────────────────────────*/

/** Eine Zeichen-Statistik, die sicher als „sitzt" UND „solide gelernt" gilt. */
function sitzt(): LetterStat {
  return {
    hits: 40,
    misses: 0,
    sumMs: 40 * 300,
    timed: 40,
    recent: Array(20).fill(300),
  };
}

/** Spielstand mit den ersten `n` Einheiten freigeschaltet und sitzend. */
function stand(n: number, extra: Partial<TypingProgress> = {}): TypingProgress {
  const introduced = introOrder("de").slice(0, n);
  const letters: Record<string, LetterStat> = {};
  for (const u of introduced) letters[u] = sitzt();
  return {
    ...emptyProgress(),
    introduced,
    letters,
    // Ein Tally, damit awardBadges nicht erst aus dem Verlauf sät.
    badgeTally: {
      rounds: 1,
      perfect: 0,
      cleanStreak: 0,
      bestCleanStreak: 0,
      stars3: 0,
      days: 1,
    },
    ...extra,
  };
}

/** Eine Runden-Feinauskunft ohne Fehler (leadClean = trailClean = alles). */
function sauber(keys: number, ms = 60_000): RoundDetail {
  return {
    keys,
    errors: 0,
    ms,
    leadClean: keys,
    trailClean: keys,
    bestClean: keys,
    hadError: false,
  };
}

const MO = new Date(2026, 7, 10, 12, 0, 0).getTime(); // Montag, 10.08.2026, 12:00

function runde(
  p: TypingProgress,
  round: Partial<Parameters<typeof awardBadges>[1]> = {},
  now = MO,
) {
  return awardBadges(
    p,
    { acc: 0.9, cpm: 50, stars: 2, level: 1, ...round },
    now, "de",
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * A · Der Katalog selbst
 * ──────────────────────────────────────────────────────────────────────────*/

describe("Katalog", () => {
  it("hat mindestens 100 Abzeichen und keine doppelte ID", () => {
    expect(BADGES.length).toBeGreaterThanOrEqual(100);
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("hat 20 Geheim-Abzeichen (Wunsch Johannes) — jedes mit eigenem Emoji", () => {
    const geheim = BADGES.filter((b) => b.secret);
    expect(geheim.length).toBeGreaterThanOrEqual(20);
    // Doppelte Emojis wirken wie ein Fehler in der Vitrine (09.08.2026: „Früher
    // Vogel" und „Seiten-Spatz" trugen beide 🐦).
    const emojis = BADGES.map((b) => b.emoji);
    expect(new Set(emojis).size).toBe(emojis.length);
  });

  it("★ füllt die frühere Wüste: die zweite Hälfte des Lernwegs hat Abzeichen", () => {
    // Vor dem 09.08. hing auf den Einheiten 32–73 (Satzzeichen, Ziffern,
    // Sonderzeichen) GENAU EINES. Gemessen wird hier über die Tastenwelt:
    // wie viele ihrer Abzeichen erst nach dem Alphabet fällig werden.
    const nachDemAlphabet = INTRO_ORDER.length - 31;
    expect(nachDemAlphabet).toBeGreaterThan(30); // 42 Einheiten
    const bisAlphabet = runde(stand(31)).progress.badges ?? {};
    const komplett = runde(stand(INTRO_ORDER.length)).progress.badges ?? {};
    const dazu = Object.keys(komplett).filter((id) => !(id in bisAlphabet));
    expect(dazu.length).toBeGreaterThanOrEqual(8);
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * B · Tastenwelt + „Sitzt!"
 * ──────────────────────────────────────────────────────────────────────────*/

describe("Tastenwelt — der Lernweg als Abzeichen-Familie", () => {
  it("die volle Grundstellung bringt den Grundstellungs-Gorilla, vorher nicht", () => {
    expect(runde(stand(7)).newly.map((b) => b.id)).not.toContain(
      "grundstellungs-gorilla",
    );
    expect(runde(stand(8)).newly.map((b) => b.id)).toContain(
      "grundstellungs-gorilla",
    );
  });

  it("die Umschalt-Einheit bringt den Groß-Baumeister", () => {
    expect(runde(stand(14)).newly.map((b) => b.id)).toContain("gross-baumeister");
  });

  it("alle Satzzeichen bringen den Satzzeichen-Sammler, alle Ziffern den Zauberer", () => {
    const ids = (n: number) => runde(stand(n)).newly.map((b) => b.id);
    expect(ids(38)).toContain("satzzeichen-sammler");
    expect(ids(43)).toContain("zahlen-zebra");
    expect(ids(47)).not.toContain("zahlen-zauberer");
    expect(ids(48)).toContain("zahlen-zauberer");
  });

  it("★ die ganze Tastatur bringt die Krone — das Ziel am Ende des Weges", () => {
    const alle = introOrder("de").length;
    expect(runde(stand(alle - 1)).newly.map((b) => b.id)).not.toContain(
      "tastatur-krone",
    );
    expect(runde(stand(alle)).newly.map((b) => b.id)).toContain("tastatur-krone");
  });
});

describe("Sitzt! — Qualität statt Menge", () => {
  it("nur freigeschaltet genügt nicht: die Zeichen müssen auch sitzen", () => {
    // Grundreihe freigeschaltet, aber kaum geübt → „Feste Burg" noch nicht.
    const wackelig = stand(8);
    for (const u of wackelig.introduced!)
      wackelig.letters![u] = { hits: 2, misses: 1, sumMs: 900, timed: 2, recent: [300, -1, 300] };
    expect(runde(wackelig).newly.map((b) => b.id)).not.toContain("feste-burg");
    expect(runde(stand(8)).newly.map((b) => b.id)).toContain("feste-burg");
  });

  it("alle Buchstaben sitzen → Buchstaben-Bändiger", () => {
    const bisLetzterBuchstabe = introOrder("de").indexOf(
      LETTER_ORDER[LETTER_ORDER.length - 1],
    ) + 1;
    expect(runde(stand(bisLetzterBuchstabe)).newly.map((b) => b.id)).toContain(
      "buchstaben-baendiger",
    );
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * C · Tempo — echte Schulnormen, absolute Zahlen (Entscheidung Johannes)
 * ──────────────────────────────────────────────────────────────────────────*/

describe("Tempo-Treppe", () => {
  it("160 Anschläge bei 98 % bringen alle Stufen bis 160 — und keine darüber", () => {
    const r = runde(stand(20), {
      acc: 0.98,
      cpm: 160,
      detail: sauber(400),
    });
    const ids = r.newly.map((b) => b.id);
    expect(ids).toContain("tempo-60");
    expect(ids).toContain("tempo-120");
    expect(ids).toContain("tempo-160");
    expect(ids).not.toContain("tempo-200");
    expect(ids).not.toContain("tempo-300");
  });

  it("schnell allein genügt nicht — das Genauigkeits-Tor hält", () => {
    const ids = runde(stand(20), { acc: 0.9, cpm: 300, detail: sauber(400) }).newly.map(
      (b) => b.id,
    );
    // 300 Anschläge, aber nur 90 % Treffsicherheit → keine einzige Tempo-Stufe.
    expect(ids.filter((id) => id.startsWith("tempo-"))).toEqual([]);
  });

  it("eine zu kurze Runde zählt nicht für die Tempo-Treppe", () => {
    const kurz = SPEED_MIN_KEYS - 1;
    const ids = runde(stand(20), { acc: 1, cpm: 300, detail: sauber(kurz) }).newly.map(
      (b) => b.id,
    );
    expect(ids).not.toContain("tempo-60");
  });

  it("ohne Feinauskunft (alte Aufrufer) bleibt die Tempo-Treppe unberührt", () => {
    const ids = runde(stand(20), { acc: 1, cpm: 300 }).newly.map((b) => b.id);
    expect(ids.filter((id) => id.startsWith("tempo-"))).toEqual([]);
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * D · „Am Stück" — fehlerfreie Ketten über Runden hinweg
 * ──────────────────────────────────────────────────────────────────────────*/

describe("Am Stück", () => {
  it("★ die Kette läuft über Runden hinweg weiter (das ist der Witz daran)", () => {
    let p = stand(20);
    // Zwei fehlerfreie Runden zu je 300 Anschlägen = 600 am Stück.
    p = runde(p, { acc: 1, detail: sauber(300) }).progress;
    expect(p.badgeTally?.bestCleanRun).toBe(300);
    const r = runde(p, { acc: 1, detail: sauber(300) }, MO + 60_000);
    expect(r.progress.badgeTally?.bestCleanRun).toBe(600);
    expect(r.newly.map((b) => b.id)).toContain("kette-500");
  });

  it("ein Fehler reißt die laufende Kette, der Bestwert bleibt", () => {
    let p = stand(20);
    p = runde(p, { acc: 1, detail: sauber(300) }).progress;
    const mitFehler: RoundDetail = {
      keys: 200,
      errors: 1,
      ms: 60_000,
      leadClean: 20,
      trailClean: 30,
      bestClean: 120,
      hadError: true,
    };
    p = runde(p, { acc: 0.99, detail: mitFehler }, MO + 60_000).progress;
    expect(p.badgeTally?.bestCleanRun).toBe(320); // 300 + Anlauf 20
    expect(p.badgeTally?.cleanRun).toBe(30); // ab dem Auslauf neu
  });

  it("die Schwellen steigen bis 2000 — der Schluss ist schwer", () => {
    expect(CHAIN_TIERS[CHAIN_TIERS.length - 1]).toBe(2000);
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * E · Die 10-Minuten-Abschrift
 * ──────────────────────────────────────────────────────────────────────────*/

describe("10-Minuten-Abschrift", () => {
  const haelfte = EXAM_MS / 2;

  it("zehn Minuten am Stück mit höchstens 0,5 % Fehlern → bestanden", () => {
    let p = stand(20);
    p = runde(p, { acc: 1, detail: sauber(600, haelfte) }).progress;
    const r = runde(p, { acc: 1, detail: sauber(600, haelfte) }, MO + 60_000);
    expect(r.newly.map((b) => b.id)).toContain("zehn-minuten-abschrift");
  });

  it("zu viele Fehler → nicht bestanden, und der Lauf beginnt von vorn", () => {
    let p = stand(20);
    const schlampig: RoundDetail = {
      keys: 600,
      errors: 20, // 3,3 %
      ms: haelfte,
      leadClean: 10,
      trailClean: 10,
      bestClean: 50,
      hadError: true,
    };
    p = runde(p, { acc: 0.97, detail: schlampig }).progress;
    const r = runde(p, { acc: 0.97, detail: schlampig }, MO + 60_000);
    expect(r.newly.map((b) => b.id)).not.toContain("zehn-minuten-abschrift");
    expect(r.progress.badgeTally?.examMs).toBe(0); // frischer Anlauf
  });

  it("eine längere Pause beendet den Lauf — »am Stück« heißt am Stück", () => {
    let p = stand(20);
    p = runde(p, { acc: 1, detail: sauber(600, haelfte) }).progress;
    // 20 Minuten später weiter: der alte Lauf zählt nicht mehr mit.
    const r = runde(p, { acc: 1, detail: sauber(600, haelfte) }, MO + 20 * 60_000);
    expect(r.newly.map((b) => b.id)).not.toContain("zehn-minuten-abschrift");
    expect(r.progress.badgeTally?.examMs).toBe(haelfte);
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * F · Übungswochen + Geheim-Abzeichen
 * ──────────────────────────────────────────────────────────────────────────*/

describe("Übungswochen", () => {
  it("weekKey zählt nach ISO — Montag und Sonntag derselben Woche sind gleich", () => {
    const montag = new Date(2026, 7, 10, 9, 0, 0).getTime();
    const sonntag = new Date(2026, 7, 16, 21, 0, 0).getTime();
    const naechsterMontag = new Date(2026, 7, 17, 9, 0, 0).getTime();
    expect(weekKey(montag)).toBe(weekKey(sonntag));
    expect(weekKey(montag)).not.toBe(weekKey(naechsterMontag));
  });

  it("in zwölf verschiedenen Wochen geübt → »Ein Vierteljahr dabei«", () => {
    let p = stand(20);
    for (let w = 0; w < 12; w++)
      p = runde(p, {}, MO + w * 7 * 24 * 3600 * 1000).progress;
    expect(p.badgeTally?.weeks).toBe(12);
    expect(Object.keys(p.badges ?? {})).toContain("vierteljahr-dabei");
  });
});

describe("Geheim-Abzeichen des Ausbaus", () => {
  it("im August geübt → Ferien-Held", () => {
    expect(runde(stand(20)).newly.map((b) => b.id)).toContain("ferien-held");
  });

  it("Samstag UND Sonntag → Wochenend-Schreiber", () => {
    const samstag = new Date(2026, 7, 15, 10, 0, 0).getTime();
    const sonntag = new Date(2026, 7, 16, 10, 0, 0).getTime();
    let p = stand(20);
    p = runde(p, {}, samstag).progress;
    expect(Object.keys(p.badges ?? {})).not.toContain("wochenend-schreiber");
    p = runde(p, {}, sonntag).progress;
    expect(Object.keys(p.badges ?? {})).toContain("wochenend-schreiber");
  });

  it("nach langer Pause wieder da → Zurück im Sattel", () => {
    let p = stand(20);
    p = runde(p).progress;
    const r = runde(p, {}, MO + 30 * 24 * 3600 * 1000);
    expect(r.newly.map((b) => b.id)).toContain("zurueck-im-sattel");
  });

  it("zwei fehlerfreie Runden hintereinander → Doppelt genäht", () => {
    let p = stand(20);
    p = runde(p, { acc: 1 }).progress;
    const r = runde(p, { acc: 1 }, MO + 60_000);
    expect(r.newly.map((b) => b.id)).toContain("doppelt-genaeht");
  });
});

describe("Zweite Geheim-Charge (auf 20 aufgestockt)", () => {
  const winter = new Date(2026, 11, 31, 15, 0, 0).getTime(); // 31.12.2026

  it("im Dezember geübt → Winterkind, am 31.12. zusätzlich Jahreswechsel", () => {
    const ids = runde(stand(20), {}, winter).newly.map((b) => b.id);
    expect(ids).toContain("winterkind");
    expect(ids).toContain("jahreswechsel");
    // Im August gibt es beides nicht.
    const august = runde(stand(20)).newly.map((b) => b.id);
    expect(august).not.toContain("winterkind");
    expect(august).not.toContain("jahreswechsel");
  });

  it("zehn Runden an einem Tag → Tages-Marathon (am nächsten Tag zählt es neu)", () => {
    let p = stand(20);
    for (let i = 0; i < 9; i++) p = runde(p, {}, MO + i * 60_000).progress;
    expect(Object.keys(p.badges ?? {})).not.toContain("tages-marathon");
    p = runde(p, {}, MO + 9 * 60_000).progress;
    expect(Object.keys(p.badges ?? {})).toContain("tages-marathon");
    // Tageswechsel setzt den Zähler zurück.
    const morgen = runde(p, {}, MO + 24 * 3600 * 1000);
    expect(morgen.progress.badgeTally?.dayRounds).toBe(1);
  });

  it("drei 3-Sterne-Runden an einem Tag → Sternentag; drei fehlerfreie → Blitzsauber", () => {
    let p = stand(20);
    for (let i = 0; i < 3; i++)
      p = runde(p, { acc: 1, stars: 3 }, MO + i * 60_000).progress;
    const ids = Object.keys(p.badges ?? {});
    expect(ids).toContain("sternentag");
    expect(ids).toContain("blitzsauber");
  });

  it("fünf Übungstage in EINER Woche → Volle Woche", () => {
    let p = stand(20);
    const tag = 24 * 3600 * 1000;
    for (let i = 0; i < 4; i++) p = runde(p, {}, MO + i * tag).progress; // Mo–Do
    expect(Object.keys(p.badges ?? {})).not.toContain("volle-woche");
    p = runde(p, {}, MO + 4 * tag).progress; // Freitag
    expect(Object.keys(p.badges ?? {})).toContain("volle-woche");
  });

  it("★ Blindflug: fehlerfrei mit ausgeblendeter Bildschirm-Tastatur", () => {
    const ohne = { ...sauber(300), keyboardHidden: true };
    expect(runde(stand(20), { acc: 1, detail: ohne }).newly.map((b) => b.id)).toContain(
      "blindflug",
    );
    // Mit sichtbarer Tastatur gibt es das Abzeichen nicht.
    expect(
      runde(stand(20), { acc: 1, detail: sauber(300) }).newly.map((b) => b.id),
    ).not.toContain("blindflug");
  });

  it("in beiden Sprachen geübt → Sprachwechsler", () => {
    let p = stand(20);
    p = runde(p, { lang: "de" }).progress;
    expect(Object.keys(p.badges ?? {})).not.toContain("sprachwechsler");
    p = runde(p, { lang: "en" }, MO + 60_000).progress;
    expect(Object.keys(p.badges ?? {})).toContain("sprachwechsler");
  });

  // ★ D1 Randfund (28.09.2026): „Viaje entre idiomas" zählte nur de + en - auf
  // Weg fr/es (Hauptsprache + Englisch, D1 Nr. 18) kam niemand dran.
  it.each([
    ["es", "en"],
    ["fr", "en"],
    ["es", "fr"],
  ] as const)("★ D1: %s und %s geübt → Sprachwechsler", (a, b) => {
    let p = stand(20);
    p = runde(p, { lang: a }).progress;
    expect(Object.keys(p.badges ?? {})).not.toContain("sprachwechsler");
    p = runde(p, { lang: b }, MO + 60_000).progress;
    expect(Object.keys(p.badges ?? {})).toContain("sprachwechsler");
  });

  it("★ D1 Gegenprobe: zweimal dieselbe Sprache ist kein Sprachwechsel", () => {
    let p = stand(20);
    p = runde(p, { lang: "es" }).progress;
    p = runde(p, { lang: "es" }, MO + 60_000).progress;
    expect(Object.keys(p.badges ?? {})).not.toContain("sprachwechsler");
  });

  it("★ Zähe Taste: was einmal hakte und jetzt sitzt", () => {
    // Eine Taste, die deutlich zu unsicher ist → sie gilt als „hakt".
    const wackelt = stand(20);
    wackelt.letters!["e"] = {
      hits: 6,
      misses: 9,
      sumMs: 9000,
      timed: 6,
      recent: [-1, -1, 400, -1, -1, 400, -1, -1, 400, -1],
    };
    const nach = runde(wackelt, {}, MO).progress;
    expect(nach.badgeTally?.struggled).toContain("e");
    expect(Object.keys(nach.badges ?? {})).not.toContain("zaehe-taste");
    // Später sitzt sie — jetzt wird gefeiert.
    const geschafft = stand(20, {
      badges: nach.badges,
      badgeTally: nach.badgeTally,
    });
    expect(runde(geschafft, {}, MO + 60_000).newly.map((b) => b.id)).toContain(
      "zaehe-taste",
    );
  });

  it("fünf Leistungsstufen höher als am Anfang → Aufsteiger", () => {
    let p = stand(20);
    p = runde(p, { level: 4 }).progress;
    expect(p.badgeTally?.firstLevel).toBe(4);
    expect(
      runde(p, { level: 8 }, MO + 60_000).newly.map((b) => b.id),
    ).not.toContain("aufsteiger");
    expect(runde(p, { level: 9 }, MO + 60_000).newly.map((b) => b.id)).toContain(
      "aufsteiger",
    );
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * G · Stiller Nachtrag (Entscheidung Johannes 09.08.2026)
 * ──────────────────────────────────────────────────────────────────────────*/

describe("Stiller Nachtrag", () => {
  it("★ ein bestehendes Kind bekommt die neuen Abzeichen OHNE Jubel", () => {
    // Stand wie Jano: viel geübt, viele alte Abzeichen — aber noch nie einen
    // Katalog-Vermerk.
    const p = stand(40, {
      badges: { volltreffer: 1, "tasten-kueken": 1 },
      badgeTally: {
        rounds: 200,
        perfect: 10,
        cleanStreak: 2,
        bestCleanStreak: 4,
        stars3: 12,
        days: 30,
      },
    });
    const r = runde(p);
    // Im Spielstand stehen sie …
    expect(Object.keys(r.progress.badges ?? {})).toContain("grundstellungs-gorilla");
    expect(Object.keys(r.progress.badges ?? {})).toContain("satzzeichen-sammler");
    // … aber gefeiert wird nichts davon.
    expect(r.newly.map((b) => b.id)).not.toContain("grundstellungs-gorilla");
    expect(r.newly.map((b) => b.id)).not.toContain("satzzeichen-sammler");
    expect(r.progress.badgeTally?.catalog).toBeGreaterThanOrEqual(2);
  });

  it("ein NEUES Kind erlebt jedes Abzeichen selbst (kein Nachtrag)", () => {
    const r = runde(stand(8)); // noch keine Abzeichen im Stand
    expect(r.newly.map((b) => b.id)).toContain("grundstellungs-gorilla");
  });

  it("nachgetragen wird nur EINMAL — danach zählt wieder jede Leistung", () => {
    const p = stand(8, { badges: { volltreffer: 1 } });
    const nach = runde(p).progress;
    // Jetzt kommen Satzzeichen dazu → das muss wieder gefeiert werden.
    const weiter = stand(38, {
      badges: nach.badges,
      badgeTally: nach.badgeTally,
    });
    expect(runde(weiter, {}, MO + 60_000).newly.map((b) => b.id)).toContain(
      "satzzeichen-sammler",
    );
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * H · ★★ Die Regel: kein Abzeichen hängt an einem Lernweg
 * ──────────────────────────────────────────────────────────────────────────*/

describe("Gleichstellung der beiden Lernwege", () => {
  /** Derselbe Lernstand, einmal über den Lehrgang erarbeitet … */
  function ueberLehrgang(): TypingProgress {
    const lessons: TypingProgress["lessons"] = {};
    for (const l of LESSONS)
      lessons[l.id] = { completed: true, bestStars: 3, bestCpm: 120, attempts: 2 };
    return stand(introOrder("de").length, { lessons });
  }
  /** … einmal über „Mein Training" (dort wird nie eine Lektion abgeschlossen). */
  function ueberMeinTraining(): TypingProgress {
    return stand(introOrder("de").length, {
      rounds: [{ ts: MO - 1000, acc: 1, cpm: 120, stars: 3, level: 5 }],
    });
  }

  it("»Mein Training« zählt die Lektionen über den STOFF", () => {
    expect(lessonsDoneCount(ueberMeinTraining(), "de")).toBe(LESSONS.length);
    expect(lessonsDoneCount(ueberLehrgang(), "de")).toBe(LESSONS.length);
    // Wer noch am Anfang steht, hat sie natürlich nicht.
    expect(lessonsDoneCount(stand(8), "de")).toBeLessThan(LESSONS.length);
  });

  it("★★ beide Wege ernten dieselben Abzeichen", () => {
    const a = new Set(Object.keys(runde(ueberLehrgang()).progress.badges ?? {}));
    const b = new Set(Object.keys(runde(ueberMeinTraining()).progress.badges ?? {}));
    const nurLehrgang = [...a].filter((id) => !b.has(id));
    const nurTraining = [...b].filter((id) => !a.has(id));
    expect(nurLehrgang).toEqual([]);
    expect(nurTraining).toEqual([]);
  });

  it("die Lektions-Familie ist in »Mein Training« vollständig zu holen", () => {
    const ids = Object.keys(runde(ueberMeinTraining()).progress.badges ?? {});
    expect(ids).toContain("lektions-loewe");
    expect(ids).toContain("kapitel-kaeptn");
    expect(ids).toContain("lehrgangs-legende");
    expect(ids).toContain("lehrgangs-meister");
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * I · „Nächstes Ziel" — ohne das fühlt sich jede Lücke wie eine Wüste an
 * ──────────────────────────────────────────────────────────────────────────*/

describe("Nächstes Ziel", () => {
  it("mitten im Lernweg gibt es immer ein greifbares nächstes Tastenwelt-Ziel", () => {
    // Kind mit 40 Einheiten NACH einer Runde (dann stehen die schon verdienten
    // Abzeichen im Stand — sonst nennt die Galerie das allererste Ziel).
    const goals = nextGoals(runde(stand(40)).progress, "de");
    const tw = goals.find((g) => g.unit === "freigeschaltete Zeichen");
    expect(tw).toBeTruthy();
    expect(tw!.need).toBeGreaterThan(40);
    expect(tw!.have).toBe(40);
  });

  it("die neuen Familien tauchen als Ziel auf (Ketten, Wochen, Lesen)", () => {
    const goals = nextGoals(stand(20), "de");
    const units = goals.map((g) => g.unit);
    expect(units).toContain("Anschläge am Stück ohne Fehler");
    expect(units).toContain("Übungswochen");
    expect(units).toContain("gelesene Etappen");
  });
});
