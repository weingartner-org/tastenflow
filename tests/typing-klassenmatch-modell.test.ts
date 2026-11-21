/**
 * WÄCHTER über das RECHENWERK des Klassenmatchs (11.09.2026, Etappe E6).
 *
 * Geprüft werden die fünf Stellen, an denen ein Fehler sich NICHT als Absturz
 * zeigt, sondern als falsche Zahl vor einem Kind:
 *  • {@link rangliste} - wer steht wo,
 *  • {@link kugelPositionen} - wo steht die Kugel (und: kommt die erste genau
 *    nach fünf Minuten rechts an?),
 *  • {@link matchZeitstand} - acht Braille-Zellen, IMMER,
 *  • {@link matchPhaseVon} - wann ein Match läuft und wann es vorbei ist,
 *  • {@link einladbar} - wer eine Einladung bekommt (F9).
 *
 * WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]): Er prüft nicht, dass die
 * Funktionen „etwas zurückgeben", sondern die Aussagen des Auftrags - „die
 * erste Kugel kommt nach fünf Minuten rechts an", „acht Zellen", „Teilnehmende
 * sind für die Dauer nicht erreichbar". Wer eine davon bricht, wird rot.
 */
import { describe, expect, it } from "vitest";
import {
  MATCH_COUNTDOWN_MS,
  MATCH_DAUER_MIN,
  MATCH_DAUER_MS,
  MATCH_VORSPANN_BREITE,
  ausschreibungsOrdnung,
  dabeiNamen,
  dabeiSatz,
  einladbar,
  gebundeneKinder,
  kugelPositionen,
  matchApm,
  matchBrailleSatz,
  matchWert,
  matchPhaseVon,
  matchZeitstand,
  offeneEinladungen,
  offeneMatches,
  rangliste,
  type Match,
  type MatchStand,
} from "@/lib/typing/klassenmatch";

const T0 = 1_800_000_000_000;

function match(over: Partial<Match> = {}): Match {
  return {
    id: "m1",
    classCode: "K1",
    hostUid: "sarah",
    hostName: "Sarah",
    status: "einladung",
    startMs: 0,
    endeMs: 0,
    dauerMin: MATCH_DAUER_MIN,
    createdMs: T0,
    ...over,
  };
}

function stand(over: Partial<MatchStand> = {}): MatchStand {
  return {
    id: "s1",
    matchId: "m1",
    classCode: "K1",
    pupilUid: "p1",
    name: "Mustafa",
    status: "schreibt",
    zeichen: 0,
    fehler: 0,
    apm: 0,
    wert: 0,
    updatedMs: T0,
    ...over,
  };
}

// ── (a) Die Rangliste ───────────────────────────────────────────────────────

describe("(a) Die Rangliste", () => {
  it("setzt den besten Wert auf Platz 1 - und Genauigkeit schlägt Tempo", () => {
    // Dieselbe Aussage wie bei der Tippchallenge: Die WURZEL beim Tempo macht
    // „Genauigkeit schlägt Zeit" wahr. 300 Anschläge mit 10 % Fehlern liegen
    // HINTER 120 Anschlägen fast ohne Fehler.
    const schnellUndSchlampig = stand({
      pupilUid: "schnell",
      name: "Schnell",
      zeichen: 1500,
      fehler: 150,
      apm: 300,
    });
    const langsamUndGenau = stand({
      pupilUid: "genau",
      name: "Genau",
      zeichen: 600,
      fehler: 3,
      apm: 120,
    });
    const liste = rangliste([schnellUndSchlampig, langsamUndGenau]);
    expect(liste[0].stand.pupilUid).toBe("genau");
    expect(liste[0].platz).toBe(1);
    expect(liste[1].platz).toBe(2);
  });

  it("rechnet AUCH unter 200 Zeichen - die Mindestmenge gilt hier nicht", () => {
    // Vorgabe Johannes (§6): In einem Fünf-Minuten-Spiel hat ein Kind der
    // Grundreihe nach einer Minute vielleicht 60 Zeichen. Eine Kugel, die
    // dabei auf 0 stünde, wäre kein Spiel.
    const liste = rangliste([stand({ zeichen: 60, fehler: 1, apm: 60 })]);
    expect(liste[0].wert).toBeGreaterThan(0);
  });

  it("löst Gleichstand nach Zeichen auf, dann nach Namen - stabil auf jedem Gerät", () => {
    const a = stand({ pupilUid: "a", name: "Toprak", zeichen: 0, apm: 0 });
    const b = stand({ pupilUid: "b", name: "Sebastian", zeichen: 0, apm: 0 });
    // Zweimal dieselbe Eingabe in anderer Reihenfolge - dieselbe Liste.
    expect(rangliste([a, b]).map((e) => e.stand.name)).toEqual(
      rangliste([b, a]).map((e) => e.stand.name),
    );
    // Und bei echtem Gleichstand entscheiden die Zeichen.
    const viel = stand({ pupilUid: "c", name: "Aaron", zeichen: 300, fehler: 6, apm: 100 });
    const wenig = stand({ pupilUid: "d", name: "Berta", zeichen: 100, fehler: 2, apm: 100 });
    const l = rangliste([wenig, viel]);
    // Gleiche Güte (1:50) und gleiches Tempo ⇒ gleicher Wert ⇒ mehr Zeichen vorn.
    expect(l[0].wert).toBeCloseTo(l[1].wert, 5);
    expect(l[0].stand.pupilUid).toBe("c");
  });
});

// ── (b) Die Kugeln ──────────────────────────────────────────────────────────

describe("(b) Die Kugeln", () => {
  it("★ Die erste Kugel kommt GENAU nach fünf Minuten rechts an", () => {
    const liste = rangliste([
      stand({ pupilUid: "a", zeichen: 800, fehler: 4, apm: 160 }),
      stand({ pupilUid: "b", zeichen: 400, fehler: 8, apm: 80 }),
    ]);
    expect(kugelPositionen(liste, 0, MATCH_DAUER_MS)[0]).toBe(0);
    expect(kugelPositionen(liste, MATCH_DAUER_MS / 2, MATCH_DAUER_MS)[0]).toBeCloseTo(0.5, 6);
    expect(kugelPositionen(liste, MATCH_DAUER_MS, MATCH_DAUER_MS)[0]).toBe(1);
    // Auch eine Uhr, die überläuft, schiebt niemanden aus dem Strich heraus.
    expect(kugelPositionen(liste, MATCH_DAUER_MS * 2, MATCH_DAUER_MS)[0]).toBe(1);
  });

  it("setzt die anderen auf ihren Anteil am Besten", () => {
    const liste = rangliste([
      stand({ pupilUid: "a", zeichen: 800, fehler: 0, apm: 160 }),
      stand({ pupilUid: "b", zeichen: 400, fehler: 0, apm: 80 }),
    ]);
    const pos = kugelPositionen(liste, MATCH_DAUER_MS, MATCH_DAUER_MS);
    expect(pos[1]).toBeCloseTo(liste[1].wert / liste[0].wert, 6);
    expect(pos[1]).toBeLessThan(pos[0]);
  });

  it("stellt alle nach links, solange niemand einen Wert hat - und teilt nie durch null", () => {
    const liste = rangliste([stand({ pupilUid: "a" }), stand({ pupilUid: "b" })]);
    expect(kugelPositionen(liste, 60_000, MATCH_DAUER_MS)).toEqual([0, 0]);
  });
});

// ── (c) Der Braille-Vorspann ────────────────────────────────────────────────

describe("(c) Der Vorspann auf der Braillezeile (§6 Frage 4)", () => {
  it("★★★ ist IMMER acht Zellen breit - sonst wandert der Text unter den Fingern", () => {
    const faelle: [number, number][] = [
      [1, 0],
      [1, 3_450 * 65],
      [2, 225_000],
      [9, 59_000],
      [10, 225_000],
      [12, 225_000],
      [99, 1_000],
      [3, 300_000],
    ];
    for (const [platz, rest] of faelle) {
      const s = matchZeitstand(platz, rest);
      expect(s.length, `Platz ${platz}, Rest ${rest}: „${s}"`).toBe(MATCH_VORSPANN_BREITE);
    }
  });

  it("schreibt die Vorgabe wörtlich: P2 3:45 und P12 3:45", () => {
    expect(matchZeitstand(2, 225_000)).toBe("P2 3:45 ");
    expect(matchZeitstand(12, 225_000)).toBe("P12 3:45");
  });

  it("fängt Unsinn ab, statt eine kaputte Zeile zu schreiben", () => {
    expect(matchZeitstand(0, -5).length).toBe(MATCH_VORSPANN_BREITE);
    expect(matchZeitstand(0, -5).startsWith("P1")).toBe(true);
    expect(matchZeitstand(1000, 0).length).toBe(MATCH_VORSPANN_BREITE);
  });

  it("beantwortet Alt + X mit Platz, Zeit und den ersten drei", () => {
    const liste = rangliste([
      stand({ pupilUid: "a", name: "Mustafa", zeichen: 900, fehler: 2, apm: 180 }),
      stand({ pupilUid: "b", name: "Sebastian", zeichen: 600, fehler: 2, apm: 120 }),
      stand({ pupilUid: "c", name: "Toprak", zeichen: 300, fehler: 2, apm: 60 }),
    ]);
    expect(matchBrailleSatz(2, 6, 225_000, liste)).toBe(
      "Platz 2 von 6, 3:45. 1. Mustafa, 2. Sebastian, 3. Toprak",
    );
  });
});

// ── (d) Die Phasen ──────────────────────────────────────────────────────────

describe("(d) Die Phase kommt aus der UHR, nicht aus dem Wort", () => {
  it("kennt kein Match ohne Match", () => {
    expect(matchPhaseVon(null, T0)).toBe("keine");
  });

  it("führt einladung → countdown → laeuft → fertig", () => {
    const start = T0 + MATCH_COUNTDOWN_MS;
    const m = match({ status: "countdown", startMs: start, endeMs: start + MATCH_DAUER_MS });
    expect(matchPhaseVon(match(), T0)).toBe("einladung");
    expect(matchPhaseVon(m, T0)).toBe("countdown");
    expect(matchPhaseVon(m, start)).toBe("laeuft");
    expect(matchPhaseVon(m, start + MATCH_DAUER_MS - 1)).toBe("laeuft");
    // ★ Punktgenau: Bei `endeMs` ist es vorbei - bei allen zugleich.
    expect(matchPhaseVon(m, start + MATCH_DAUER_MS)).toBe("fertig");
  });

  it("★ ist fertig, wenn die Zeit um ist - AUCH wenn der Server noch „laeuft“ sagt", () => {
    // Das ist der Kern von F13: Am Server läuft keine Uhr; der Cron kommt erst
    // eine Minute später. Ein Client, der auf ihn wartete, schriebe weiter.
    const start = T0 - MATCH_DAUER_MS - 1000;
    const m = match({ status: "laeuft", startMs: start, endeMs: start + MATCH_DAUER_MS });
    expect(matchPhaseVon(m, T0)).toBe("fertig");
  });

  it("ist bei „abgebrochen“ vorbei, egal welche Zeiten darin stehen", () => {
    const m = match({ status: "abgebrochen", startMs: T0 - 1000, endeMs: T0 + 999_999 });
    expect(matchPhaseVon(m, T0)).toBe("fertig");
  });
});

// ── (e) Wer ist erreichbar? (F9) ────────────────────────────────────────────

describe("(e) Teilnehmende sind für die Dauer nicht erreichbar (F9)", () => {
  const laufend = match({
    id: "m-laeuft",
    status: "laeuft",
    startMs: T0 - 60_000,
    endeMs: T0 + 240_000,
  });

  it("bindet den Gastgeber, auch bevor er seine Zeile geschrieben hat", () => {
    expect(gebundeneKinder([laufend], [], T0).has("sarah")).toBe(true);
    expect(einladbar("sarah", [laufend], [], T0)).toBe(false);
  });

  it("bindet, wer „dabei“ oder „schreibt“ steht - und lässt „fertig“ frei", () => {
    const staende = [
      stand({ matchId: "m-laeuft", pupilUid: "dabei", status: "dabei" }),
      stand({ matchId: "m-laeuft", pupilUid: "schreibt", status: "schreibt" }),
      stand({ matchId: "m-laeuft", pupilUid: "fertig", status: "fertig" }),
    ];
    const g = gebundeneKinder([laufend], staende, T0);
    expect(g.has("dabei")).toBe(true);
    expect(g.has("schreibt")).toBe(true);
    // ★ Wer früher fertig ist, darf sofort wieder eingeladen werden.
    expect(g.has("fertig")).toBe(false);
  });

  it("★ lässt ein Kind, das NICHT mitspielt, ein zweites Match ausschreiben", () => {
    const staende = [stand({ matchId: "m-laeuft", pupilUid: "mustafa", status: "schreibt" })];
    expect(einladbar("franz", [laufend], staende, T0)).toBe(true);
  });

  it("bindet niemanden mehr, sobald die Zeit des Matches um ist", () => {
    const vorbei = match({
      id: "m-vorbei",
      status: "laeuft",
      startMs: T0 - MATCH_DAUER_MS - 1000,
      endeMs: T0 - 1000,
    });
    const staende = [stand({ matchId: "m-vorbei", pupilUid: "mustafa", status: "schreibt" })];
    expect(gebundeneKinder([vorbei], staende, T0).size).toBe(0);
  });

  it("zählt als offen nur, was wirklich offen ist - jüngstes zuerst", () => {
    const alt = match({ id: "alt", createdMs: T0 - 10_000 });
    const neu = match({ id: "neu", createdMs: T0 });
    const zu = match({ id: "zu", status: "fertig", createdMs: T0 });
    expect(offeneMatches([alt, neu, zu], T0).map((m) => m.id)).toEqual(["neu", "alt"]);
  });
});

// ── (e2) Zwei schreiben gleichzeitig aus (11.09.2026 abends) ────────────────

describe("(e2) Wer zuerst ausgeschrieben hat - eine Ordnung für alle Geräte", () => {
  it("★★★ ordnet nach der Anlegezeit des Servers, bei Gleichstand nach der Kennung", () => {
    // Die Kennung zählt NUR bei Gleichstand - „b" ist hier trotzdem früher.
    expect(ausschreibungsOrdnung(match({ id: "b", createdMs: T0 }), match({ id: "a", createdMs: T0 + 1 }))).toBeLessThan(0);
    const a = match({ id: "m-a", createdMs: T0 });
    const b = match({ id: "m-b", createdMs: T0 });
    // ★ Genau eines ist früher - nie beide, nie keines.
    expect(ausschreibungsOrdnung(a, b)).toBeLessThan(0);
    expect(ausschreibungsOrdnung(b, a)).toBeGreaterThan(0);
  });

  it("★★★ die Einladungen für ein Kind: älteste zuerst, ohne eigene, abgelehnte und gestartete", () => {
    const alt = match({ id: "alt", hostUid: "sarah", createdMs: T0 - 5000 });
    const neu = match({ id: "neu", hostUid: "mira", createdMs: T0 });
    const eigen = match({ id: "eigen", hostUid: "franz", createdMs: T0 - 9000 });
    const weg = match({ id: "weg", hostUid: "ben", createdMs: T0 - 8000 });
    const los = match({
      id: "los",
      hostUid: "mia",
      status: "countdown",
      startMs: T0 + 5000,
      endeMs: T0 + 5000 + MATCH_DAUER_MS,
      createdMs: T0 - 7000,
    });
    expect(
      offeneEinladungen([neu, los, weg, eigen, alt], T0, "franz", ["weg"]).map((m) => m.id),
    ).toEqual(["alt", "neu"]);
  });
});

// ── (f) Wer ist dabei? (F3) ─────────────────────────────────────────────────

describe("(f) „3 dabei: Tester, Sebastian, Tester“ - die NEUESTEN neben der Zahl", () => {
  it("dreht die Beitritts-Reihenfolge um und lässt den Gastgeber weg", () => {
    const staende = [
      stand({ pupilUid: "mustafa", name: "Mustafa", status: "dabei", updatedMs: T0 + 1000 }),
      stand({ pupilUid: "sebastian", name: "Sebastian", status: "dabei", updatedMs: T0 + 2000 }),
      stand({ pupilUid: "toprak", name: "Toprak", status: "dabei", updatedMs: T0 + 3000 }),
      stand({ pupilUid: "sarah", name: "Sarah", status: "dabei", updatedMs: T0 }),
    ];
    const namen = dabeiNamen(staende, "sarah");
    expect(namen).toEqual(["Toprak", "Sebastian", "Mustafa"]);
    expect(dabeiSatz(namen)).toBe("3 dabei: Toprak, Sebastian, Mustafa");
  });

  it("sagt es auch, wenn noch niemand da ist - ohne Vorwurf", () => {
    // Johannes 11.09.: der Satz sagt, WO die Einladung ist, nicht nur „niemand".
    expect(dabeiSatz([])).toMatch(/^Noch niemand dabei - die Einladung ist bei allen aus deiner Klasse/);
  });

  it("zählt niemanden mit, der ausgestiegen ist", () => {
    const staende = [
      stand({ pupilUid: "weg", name: "Weg", status: "fertig", updatedMs: T0 + 1 }),
      stand({ pupilUid: "da", name: "Da", status: "dabei", updatedMs: T0 + 2 }),
    ];
    expect(dabeiNamen(staende, "sarah")).toEqual(["Da"]);
  });
});

// ── (g) Anschläge je Minute: fair zwischen Überlegen und Zuhören (14.09.2026) ─

describe("(g) matchApm - Sarah (Braillezeile) gegen Tester (sehend), durchgerechnet", () => {
  it("ohne gemessene Wartezeit rechnet sie wie bisher - keine Verhaltensänderung ohne Messung", () => {
    expect(matchApm({ zeichen: 150, verstrichenMs: 60_000, wartezeitMs: 0 })).toBe(150); // 150 Zeichen in einer Minute
  });

  it("★★★★★ zieht NUR die gemessene Vorlese-Wartezeit ab - reines Überlegen bleibt bestraft", () => {
    // Johannes, 14.09.2026: „überlegen gehört bestraft, aber zuhören von
    // blinden nicht". Zwei Minuten verstrichen, die Hälfte davon nichts
    // getippt - OHNE gemessene Wartezeit (keine Ansage lief, das Kind hat
    // nachgedacht) zählt die volle Zeit gegen es, wie in einem Wettschreiben.
    expect(matchApm({ zeichen: 120, verstrichenMs: 120_000, wartezeitMs: 0 })).toBe(60); // 120 Zeichen / 2 Minuten
  });

  it("isoliert NUR den Zeiteffekt (künstlich gleicher Output - keine Vorhersage für ein echtes Match)", () => {
    // ⚠️ Johannes 14.09.2026 zu Recht misstrauisch: „ist das jetzt nicht
    // wieder zu sehr für die blinden?" - dieser erste Test hält den Output
    // absichtlich GLEICH (210 Zeichen, keine Fehler, beide), um NUR zu
    // zeigen, dass die Formel überhaupt reagiert. Er sagt nichts darüber, wer
    // in einem echten Match vorne liegt - das prüft der nächste Test, mit
    // echten Zahlen von Sarah und Tester.
    const ZEILEN = 6;
    const ZEICHEN_JE_ZEILE = 35;
    const zeichen = ZEILEN * ZEICHEN_JE_ZEILE; // 210
    const verstrichenMs = 150_000;
    const wartezeitSarah = ZEILEN * (4490 + 102.0 * ZEICHEN_JE_ZEILE); // 48 360 ms
    const wartezeitMustafa = ZEILEN * (2050 + 13.8 * ZEICHEN_JE_ZEILE); // 15 198 ms

    expect(matchApm({ zeichen, verstrichenMs, wartezeitMs: 0 })).toBe(84); // beide gleich - vorher
    expect(matchApm({ zeichen, verstrichenMs, wartezeitMs: wartezeitSarah })).toBe(124);
    expect(matchApm({ zeichen, verstrichenMs, wartezeitMs: wartezeitMustafa })).toBe(93);
  });

  it("★★★★★ ECHTE Klassenmatches von Sarah und Tester (14.09.2026) - keine Simulation mehr", () => {
    // Johannes: „sarah und mustafa haben schon einige klassenmatch
    // absolviert. vielleicht kannst du das analysieren?" - ja: Klassenmatch-
    // Zeilen hängen (wie jede Übungszeile) über `contextId: KONTEXT_ID` als
    // `lesson: "klassenmatch"` im normalen Ereignisprotokoll des Kindes
    // (`lw_events`), auch wenn die Match-Zeilen selbst nach einer Stunde
    // gelöscht werden (F10). Ausgelesen per SSH + `unpackEvents` (dieselbe
    // Quelle wie BEFUND-2026-09-10-VORLESEZEIT-GEMESSEN.md), summiert über
    // alle Klassenmatch-Zeilen des Tages:
    //
    //   Sarah:   51 Zeilen, 1994 Zeichen, 92 Fehler, 576 071 ms Schreibzeit,
    //            326 786 ms gemessene Wartezeit (JEDE Zeile hatte welche)
    //   Tester: 96 Zeilen, 3788 Zeichen, 148 Fehler, 1 027 395 ms Schreibzeit,
    //            149 439 ms gemessene Wartezeit
    //
    // (verstrichenMs = Schreibzeit + Wartezeit; das ist keine echte
    // Matchdauer, sondern die Summe über mehrere Matches - für die reine
    // Formelprüfung genügt das, F13 unten macht daraus eine dauerhafte Quelle
    // je einzelnem Match.)
    const sarah = { zeichen: 1994, fehler: 92, ms: 576_071, wartezeit: 326_786 };
    const mustafa = { zeichen: 3788, fehler: 148, ms: 1_027_395, wartezeit: 149_439 };

    // ★ F1c (18.09.2026): nur noch RICHTIGE Zeichen im Zähler - die Fehler
    // (sarah.fehler, mustafa.fehler) stecken allein in der Güte des
    // Leistungswerts. Bis F1c standen hier `zeichen + fehler` und die Zahlen
    // 139/201 (ohne Abzug) und 217/230 (mit Abzug); die Aussagen darunter
    // (45 % und 6 %) gelten unverändert.
    //
    // OHNE Abzug (der Stand vor dem 14.09.2026) wirkt Tester 45 % schneller -
    expect(matchApm({ zeichen: sarah.zeichen, verstrichenMs: sarah.ms + sarah.wartezeit, wartezeitMs: 0 })).toBe(133);
    expect(matchApm({ zeichen: mustafa.zeichen, verstrichenMs: mustafa.ms + mustafa.wartezeit, wartezeitMs: 0 })).toBe(193);

    // MIT Abzug bleibt Tester vorne (er ist real etwas schneller), aber der
    // Abstand schrumpft auf 6 % - fast genau der Abstand ihrer eigenen
    // gemessenen Tempi OHNE jedes Vorlesen (210 gegen 226 A/min,
    // BEFUND-2026-09-10-VORLESEZEIT-GEMESSEN.md §0). Die Korrektur dreht das
    // Ergebnis nicht um - sie nimmt nur die Zuhörzeit aus dem Vergleich, die
    // nie eine Tippleistung war.
    expect(matchApm({ zeichen: sarah.zeichen, verstrichenMs: sarah.ms + sarah.wartezeit, wartezeitMs: sarah.wartezeit })).toBe(208);
    expect(matchApm({ zeichen: mustafa.zeichen, verstrichenMs: mustafa.ms + mustafa.wartezeit, wartezeitMs: mustafa.wartezeit })).toBe(221);
  });

  // ── (g2) F1c: eine Messart überall (18.09.2026) ──────────────────────────
  // Johannes: „zähle nur richtige Zeichen, und ‚Überlegen' wird bestraft,
  // Zuhören natürlich nicht, mach es überall gleich". Die Rechnung durch die
  // echte Session steht in `tests/typing-eine-messart.test.ts`; hier nur, was
  // `matchApm` selbst verspricht.

  it("★★★★★ F1c: Fehlgriffe sind keine Anschläge - sie wirken nur über die Güte", () => {
    // Bis F1c: (Zeichen + Fehler) im Zähler - wer daneben griff, bekam mehr
    // Anschläge je Minute (hier 210 statt 200) und wurde erst von der Güte
    // wieder eingeholt. Jetzt kennt `matchApm` die Fehler gar nicht mehr.
    const apm = matchApm({ zeichen: 200, verstrichenMs: 60_000, wartezeitMs: 0 });
    expect(apm).toBe(200);
    const sauber = matchWert({ zeichen: 200, fehler: 0, apm });
    const mitFehlern = matchWert({ zeichen: 200, fehler: 10, apm });
    expect(mitFehlern).toBeLessThan(sauber);
    expect(mitFehlern / sauber).toBeCloseTo(200 / (200 + 5 * 10), 2); // Güte Z/(Z+5F)
  });

  it("★★★★★ F1c: Sarah hört die Zeilenansagen VOR dem ersten Anschlag - und liegt gleichauf mit Tester", () => {
    // Dieselbe Tippleistung (210 Zeichen in 84 s Tippen + 16 s Überlegen),
    // aber Sarah hört vor jeder der sechs Zeilen die Ansage ab (4490 ms
    // Vorlauf je Zeile, BEFUND-2026-09-10-VORLESEZEIT-GEMESSEN.md §4), Tester
    // liest mit und tippt sofort. Bis F1c fiel genau dieser Vorlauf aus der
    // gemessenen Wartezeit heraus - die Uhr des Matches lief für Sarah um
    // 27 s länger, und nichts davon wurde abgezogen.
    const tippenUndUeberlegen = 84_000 + 16_000;
    const vorlauf = 6 * 4490;
    const pausen = 5 * 220;
    const sarah = matchApm({
      zeichen: 210,
      verstrichenMs: tippenUndUeberlegen + vorlauf + pausen,
      wartezeitMs: vorlauf,
      zeilenwechselMs: pausen,
    });
    const mustafa = matchApm({
      zeichen: 210,
      verstrichenMs: tippenUndUeberlegen + pausen,
      wartezeitMs: 0,
      zeilenwechselMs: pausen,
    });
    expect(sarah).toBe(mustafa);
    expect(mustafa).toBe(126); // 210 ÷ 100 s
    // Die Gegenprobe - so rechnete die Uhr vorher mit Sarah: der Vorlauf auf
    // der Uhr, aber nicht im Abzug.
    expect(
      matchApm({ zeichen: 210, verstrichenMs: tippenUndUeberlegen + vorlauf + pausen, wartezeitMs: 0 }),
    ).toBeLessThan(100);
  });

  it("★ F1c: Überlegen bleibt auf der Uhr - nur Zuhören und Zeilenwechsel gehen ab", () => {
    const denkt = matchApm({ zeichen: 120, verstrichenMs: 90_000, wartezeitMs: 0, zeilenwechselMs: 0 });
    const hoert = matchApm({ zeichen: 120, verstrichenMs: 90_000, wartezeitMs: 30_000, zeilenwechselMs: 0 });
    expect(denkt).toBe(80); // 30 s Überlegen zählen
    expect(hoert).toBe(120); // 30 s Zuhören nicht
  });
});
