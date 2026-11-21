/**
 * ★★★★★ WÄCHTER: Ein Wortspiel kostet kein Tempo (02.09.2026).
 *
 * ── Warum dieser Wächter ──────────────────────────────────────────────────
 *
 * Johannes am 02.09.2026: *„es darf nicht sein dass ein kind seine
 * anschlagsgeschwindigkeit verliert weil es konzentriert korrigiert oder
 * andere dinge bei den übungen macht. bitte bei allen wortspielen die
 * anschlaggeschwindigkeit rausnehmen. genauigkeit zählt."*
 *
 * Der Gedanke: Ein Wortspiel misst etwas anderes als eine Abschrift. Wer im
 * Lückentext nachdenkt, im Buchstabensalat sucht oder im Fingerdiktat den
 * richtigen Finger tastet, tippt langsam - und zwar richtig so. Zählt diese
 * Zeit als Tempo, bestraft das Programm genau das Verhalten, das es beibringen
 * will.
 *
 * ⚠️ Das Gegenstück ist genauso wichtig und wird hier mitgeprüft: Ein
 * Wortspiel ist VOLLE ÜBUNG. Genauigkeit, Zeichen, Fehler, Übezeit, Tage und
 * die Zahl der Aufgaben zählen unverändert mit. Wer beim Aufräumen dieser
 * Regel zu weit geht, macht aus der Übezeit-Reparatur vom 01.09. wieder einen
 * Verlust.
 *
 * Vier Stellen schreiben einem Kind Tempo gut - alle vier stehen hier:
 *   1. die Statistik (`avgCpm`, `bestCpm`, `wpm`)
 *   2. die Sterne einer Runde
 *   3. die drei Tempo-Abzeichen (Fuchs, Faultier, Tempo-Treppe)
 *   4. das persönliche Tempo-Ziel (`speedEma`)
 * Nummer 2 und 4 hängen an den Trainern und sind dort geprüft; 1 und 3 hier.
 */
import { describe, expect, it } from "vitest";
import {
  computePupilStats,
  istWortspiel,
  WORTSPIEL_PRAEFIX,
  type TaskEvent,
} from "@/lib/typing/account";
import { awardBadges, type BadgeRound } from "@/lib/typing/badges";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";

/** Ein Ereignis: `chars` Zeichen in `ms` Millisekunden, ohne Fehler. */
function ereignis(lesson: string, chars: number, ms: number, ts = 1_000_000): TaskEvent {
  return { lesson, chars, errors: 0, ms, activeMs: ms, ts, lang: "de" } as TaskEvent;
}

describe(`★★★★★ Die Kennung: was ist ein Wortspiel`, () => {
  it(`jede Uebungsform bringt eine Kennung hervor, die als Wortspiel gilt`, () => {
    // Der Bildschirm setzt `form:<id>` - genau das muss die Statistik erkennen.
    for (const f of UEBUNGSFORMEN)
      expect(istWortspiel(`${WORTSPIEL_PRAEFIX}${f.id}`), f.id).toBe(true);
  });

  it(`eine gewoehnliche Runde ist KEIN Wortspiel`, () => {
    expect(istWortspiel("adaptiv")).toBe(false);
    expect(istWortspiel("l04")).toBe(false);
  });
});

describe(`★★★★★ Das Tempo rechnet ohne Wortspiele`, () => {
  // Eine schnelle gewoehnliche Runde und ein langsames Wortspiel.
  const schnell = ereignis("adaptiv", 200, 60_000); // 200 Anschlaege/Min
  const langsam = ereignis(`${WORTSPIEL_PRAEFIX}lueckentext`, 20, 60_000); // 20/Min

  it(`das langsame Wortspiel zieht das Tempo NICHT nach unten`, () => {
    const ohne = computePupilStats([schnell]);
    const mit = computePupilStats([schnell, langsam]);
    expect(mit.avgCpm).toBeCloseTo(ohne.avgCpm, 5);
    expect(mit.wpm).toBeCloseTo(ohne.wpm, 5);
    expect(mit.bestCpm).toBeCloseTo(ohne.bestCpm, 5);
  });

  it(`ein SCHNELLES Wortspiel hebt das Tempo auch nicht - die Regel gilt in beide Richtungen`, () => {
    const rasend = ereignis(`${WORTSPIEL_PRAEFIX}alphabetreihen`, 600, 60_000);
    const ohne = computePupilStats([schnell]);
    const mit = computePupilStats([schnell, rasend]);
    expect(mit.avgCpm).toBeCloseTo(ohne.avgCpm, 5);
    expect(mit.bestCpm).toBeCloseTo(ohne.bestCpm, 5);
  });

  it(`wer NUR Wortspiele geuebt hat, hat kein Tempo - keine erfundene Null-Messung`, () => {
    const s = computePupilStats([langsam]);
    expect(s.avgCpm).toBe(0);
    expect(s.bestCpm).toBe(0);
  });

  it(`⚠️ ABER: Genauigkeit, Zeichen, Zeit, Tage und Aufgaben zaehlen voll mit`, () => {
    const mitFehlern: TaskEvent = {
      ...ereignis(`${WORTSPIEL_PRAEFIX}buchstabensalat`, 50, 30_000),
      errors: 10,
    } as TaskEvent;
    const s = computePupilStats([mitFehlern]);
    expect(s.tasks).toBe(1);
    expect(s.chars).toBe(50);
    expect(s.errors).toBe(10);
    expect(s.accuracy).toBeCloseTo(50 / 60, 5);
    expect(s.totalMs).toBe(30_000);
    expect(s.days).toBe(1);
  });
});

describe(`★★★★ Die drei Tempo-Abzeichen bleiben bei Wortspielen unberuehrt`, () => {
  const fortschritt = { xp: 0, level: 5, introduced: [], lessons: {} } as never;
  const detail = {
    keys: 400,
    errors: 0,
    ms: 60_000,
    leadClean: 400,
    trailClean: 400,
    bestClean: 400,
    hadError: false,
  };
  /** Welche Abzeichen diese Runde NEU einbringt - als Menge von Kennungen. */
  const verdiente = (r: BadgeRound): Set<string> =>
    new Set(awardBadges(fortschritt, r, Date.now(), "de").newly.map((b) => b.id));

  const runde = (extra: Partial<BadgeRound>): BadgeRound => ({
    acc: 1,
    cpm: 400,
    stars: 3,
    level: 5,
    target: 150,
    detail,
    ...extra,
  });

  it(`eine gewoehnliche Runde holt den Fuchs und die Tempo-Treppe`, () => {
    const ids = verdiente(runde({}));
    expect(ids.has("flinker-fuchs")).toBe(true);
  });

  it(`★★★★★ dieselbe Runde als WORTSPIEL holt sie nicht`, () => {
    const ids = verdiente(runde({ wortspiel: true }));
    expect(ids.has("flinker-fuchs")).toBe(false);
    for (const tempo of ["tempo-60", "tempo-90", "tempo-120", "tempo-160"])
      expect(ids.has(tempo), tempo).toBe(false);
  });

  it(`auch das FAULTIER bleibt aus - es waere eine Auszeichnung fuer eine Messung, die es nicht gab`, () => {
    const ids = verdiente(runde({ cpm: 20, wortspiel: true }));
    expect(ids.has("gemuetliches-faultier")).toBe(false);
  });

  it(`die Marke kommt auch ueber die Feinauskunft der Tipp-Sitzung an`, () => {
    const ids = verdiente(runde({ detail: { ...detail, wortspiel: true } }));
    expect(ids.has("flinker-fuchs")).toBe(false);
  });
});
