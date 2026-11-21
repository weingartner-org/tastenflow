/**
 * ★★★★★ WÄCHTER D-1 (28.09.2026): Punkt und Komma direkt nach der
 * Umschalttaste - auf jedem Weg, auf jeder Tastatur - UND die Live-
 * Verträglichkeit für Kinder, die mitten im Lehrgang stehen.
 *
 * Entscheidung: `recherche-didaktik-2026-09-27/SYNTHESE-UND-ENTSCHEIDUNGEN.md`
 * D-1. Befund: `BEFUND-2026-09-28-DA1-DIDAKTIK-MECHANIK.md` §1/§2.
 *
 * Die FEHLERKLASSE, gegen die dieser Wächter steht, ist nicht „Punkt an der
 * falschen Stelle", sondern „eine Reihenfolge-Änderung verschiebt, was eine
 * GESPEICHERTE Zahl oder ein gespeicherter Stand bedeutet". Darum:
 *  1. Reihenfolge je Weg × Tastatur: ⇧, dann `.` `,`, dann die Buchstaben.
 *  2. Sonst bewegt sich NICHTS: ohne `.` `,` sind alte und neue Folge gleich.
 *  3. Startpunkt vorher = nachher, als TASTENMENGE - jede Anzahl 0 … Ende und
 *     jeder benannte Startpunkt, in beiden Bedienungssprachen.
 *  4. Simulierte Bestandskinder vor / um / nach ⇧: Tasten vorher ⊆ nachher,
 *     nichts geschenkt, und wer ⇧ hat, aber `.` nicht, bekommt `.` als NÄCHSTE
 *     Taste über die normale Freischaltung.
 * Mit Gegenprobe: die Zählung in der NEUEN Folge würde Startpunkte verbiegen
 * (sonst misst Punkt 3 nichts).
 */
import { afterAll, describe, expect, it } from "vitest";
import {
  PUNKT_UND_KOMMA,
  SHIFT_UNIT,
  achteGrundtasteFuerLayout,
  advanceIntroduced,
  ensureIntroduced,
  introOrder,
  startpunktEinheiten,
  nextLetter,
  startPoints,
  startpunktAngleichen,
  startpunktAnwenden,
  startpunktFolge,
  startpunktStand,
} from "../src/lib/typing/letters";
import { lernwegDef, type Lernweg } from "../src/lib/typing/lernweg";
import { onlyExistingKeys, setLayout, type LayoutId } from "../src/lib/typing/layouts";
import type { LetterStat } from "../src/lib/typing/progress";

const TASTATUREN: Record<Lernweg, LayoutId[]> = {
  de: ["de", "ch", "us", "uk"],
  en: ["us", "uk", "de", "ch"],
  fr: ["fr", "be", "ch-fr", "ca-csa", "ca-fr"],
  es: ["es", "latam"],
  // RÜCKFALL-EN (G2a): it zeigt vorerst Englisch. ★ F4 (02.10.2026): pl, tr, cs haben eigene Reihenfolge UND eigene Tastaturen -
  // sie laufen zusätzlich auf ihnen (die fremden bleiben: ein Weg darf auf einer Tastatur ohne seine Zeichen nichts verdoppeln).
  it: ["us", "uk", "de", "ch"],
  pl: ["pl", "us", "uk", "de", "ch"],
  tr: ["tr-q", "us", "uk", "de", "ch"],
  cs: ["cs", "cs-qwerty", "us", "uk", "de", "ch"],
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: ["us", "uk", "de", "ch"],
  el: ["us", "uk", "de", "ch"],
  hu: ["us", "uk", "de", "ch"],
  nl: ["us", "uk", "de", "ch"],
  pt: ["us", "uk", "de", "ch"],
  br: ["us", "uk", "de", "ch"],
  ro: ["us", "uk", "de", "ch"],
  sv: ["us", "uk", "de", "ch"],
  uk: ["us", "uk", "de", "ch"],
};
const FAELLE = (Object.keys(TASTATUREN) as Lernweg[]).flatMap((weg) =>
  TASTATUREN[weg].map((layout) => ({ weg, layout })),
);

/**
 * Die Folge VOR D-1, UNABHÄNGIG vom Code nachgebaut (nicht über
 * `startpunktFolge`): Buchstaben bis ⇧, ⇧, restliche Buchstaben, ALLE
 * Satzzeichen, Ziffern, Sonderzeichen - so stand es bis 27.09.2026 in
 * letters.ts und lernweg.ts.
 */
function folgeVorD1(weg: Lernweg, layout: LayoutId): string[] {
  const d = lernwegDef(weg);
  const roh = [
    ...d.letterOrder.slice(0, d.lettersBeforeShift),
    SHIFT_UNIT,
    ...d.letterOrder.slice(d.lettersBeforeShift),
    ...d.punctOrder,
    ...d.digitOrder,
    ...d.symbolOrder,
  ];
  return achteGrundtasteFuerLayout(onlyExistingKeys(roh), weg, layout);
}

const sortiert = (xs: Iterable<string>) => [...xs].sort();
const ohne = (xs: readonly string[], weg: readonly string[]) => xs.filter((x) => !weg.includes(x));
/**
 * ★ F4-cs (02.10.2026): die Satzzeichen, die ein Weg DIREKT nach ⇧ führt - Vorgabe `. ,`; Tschechisch zusätzlich `?`
 * (`LernwegDef.punktNachShift`). Alles andere in diesem Wächter gilt unverändert.
 */
const nachShift = (weg: Lernweg): readonly string[] => lernwegDef(weg).punktNachShift ?? PUNKT_UND_KOMMA;

/** Ein Stand, in dem alles „sitzt" (treffsicher, zügig, genug Übung). */
function sitzt(einheiten: readonly string[]): Record<string, LetterStat> {
  const out: Record<string, LetterStat> = {};
  for (const u of einheiten)
    out[u] = { hits: 80, misses: 0, sumMs: 80 * 250, timed: 80, recent: Array(60).fill(250) };
  return out;
}

afterAll(() => setLayout("de"));

describe("★★★★★ D-1: ⇧, dann Punkt und Komma - auf jedem Weg und jeder Tastatur", () => {
  it.each(FAELLE)("$weg auf $layout: direkt nach ⇧ kommen „.\" und „,\"", ({ weg, layout }) => {
    setLayout(layout);
    const order = introOrder(weg);
    const s = order.indexOf(SHIFT_UNIT);
    expect(s).toBeGreaterThan(0);
    // Kanada (fr): der Apostroph braucht dort Umschalt und steht darum
    // direkt nach ⇧ (S2, 26.09.2026) - er ist der einzige erlaubte Gast.
    const danach = order.slice(s + 1).filter((u) => u !== "'" || !layout.startsWith("ca-"));
    expect(danach.slice(0, 2)).toEqual([".", ","]);
    // … und VOR jedem Buchstaben, der nach ⇧ kommt.
    const buchstaben = new Set(lernwegDef(weg).letterOrder);
    const ersterBuchstabeNachShift = order.findIndex((u, i) => i > s && buchstaben.has(u) && u !== "'");
    expect(order.indexOf(".")).toBeLessThan(ersterBuchstabeNachShift);
    expect(order.indexOf(",")).toBeLessThan(ersterBuchstabeNachShift);
  });

  it.each(FAELLE)("$weg auf $layout: die übrigen Satzzeichen bleiben nach allen Buchstaben", ({ weg, layout }) => {
    setLayout(layout);
    const order = introOrder(weg);
    const d = lernwegDef(weg);
    const letzterBuchstabe = Math.max(...d.letterOrder.map((u) => order.indexOf(u)));
    for (const p of ohne(d.punctOrder, nachShift(weg))) {
      if (!order.includes(p)) continue;
      // „;" ist auf Weg „en" und auf Kanada eine Grundtaste.
      if (order.indexOf(p) < d.homeRowLetters) continue;
      expect(order.indexOf(p), p).toBeGreaterThan(letzterBuchstabe);
    }
  });

  it.each(FAELLE)("$weg auf $layout: ohne „.\" „,\" sind alte und neue Folge identisch", ({ weg, layout }) => {
    setLayout(layout);
    expect(ohne(introOrder(weg), nachShift(weg))).toEqual(ohne(folgeVorD1(weg, layout), nachShift(weg)));
    expect(sortiert(introOrder(weg))).toEqual(sortiert(folgeVorD1(weg, layout)));
  });

  it.each(FAELLE)("$weg auf $layout: die Startpunkt-Zählung IST die Folge vor D-1", ({ weg, layout }) => {
    setLayout(layout);
    expect(startpunktFolge(weg)).toEqual(folgeVorD1(weg, layout));
  });
});

describe("★★★★★ D-1: ein Startpunkt bedeutet dieselben Tasten wie vorher", () => {
  it.each(FAELLE)("$weg auf $layout: jede Anzahl 0 … Ende - dieselbe Tastenmenge", ({ weg, layout }) => {
    setLayout(layout);
    const vorher = folgeVorD1(weg, layout);
    const min = lernwegDef(weg).initialLetters;
    for (let n = 0; n <= vorher.length + 2; n++) {
      const erwartet = vorher.slice(0, Math.max(min, Math.min(n, vorher.length)));
      const jetzt = startpunktEinheiten(n, weg);
      expect(sortiert(jetzt), `n = ${n}`).toEqual(sortiert(erwartet));
      // … und in der Lehrgangs-Reihenfolge (so, wie ensureIntroduced sie ordnet).
      expect(jetzt).toEqual(ensureIntroduced(jetzt, weg));
    }
  });

  it.each(FAELLE)("$weg auf $layout: jeder benannte Startpunkt - Zahl und Tasten unverändert", ({ weg, layout }) => {
    setLayout(layout);
    const vorher = folgeVorD1(weg, layout);
    for (const sprache of ["de", "en", "fr", "es"] as const) {
      for (const sp of startPoints(sprache, weg)) {
        expect(sortiert(startpunktEinheiten(sp.units, weg)), `${sprache}/${sp.key}`).toEqual(
          sortiert(vorher.slice(0, Math.max(lernwegDef(weg).initialLetters, sp.units))),
        );
      }
    }
    // „Alle Buchstaben" heisst weiter: alle Buchstaben + ⇧, KEIN Satzzeichen.
    const buchstaben = startPoints("de", weg).find((s) => s.key === "buchstaben")!;
    const tasten = startpunktEinheiten(buchstaben.units, weg);
    expect(tasten).toContain(SHIFT_UNIT);
    expect(tasten).not.toContain(".");
    const d = lernwegDef(weg);
    for (const u of introOrder(weg)) if (d.letterOrder.includes(u)) expect(tasten, u).toContain(u);
  });

  it("Gegenprobe: in der NEUEN Folge abgezählt, verlöre „Alle Buchstaben\" Buchstaben", () => {
    for (const { weg, layout } of FAELLE) {
      setLayout(layout);
      const buchstaben = startPoints("de", weg).find((s) => s.key === "buchstaben")!;
      const falsch = introOrder(weg).slice(0, buchstaben.units);
      expect(falsch, `${weg}/${layout}`).toContain(".");
      expect(sortiert(falsch)).not.toEqual(sortiert(startpunktEinheiten(buchstaben.units, weg)));
    }
  });

  it.each(FAELLE)("$weg auf $layout: startpunktStand liest einen alten Stand als seine Länge", ({ weg, layout }) => {
    setLayout(layout);
    const vorher = folgeVorD1(weg, layout);
    for (let n = lernwegDef(weg).initialLetters; n <= vorher.length; n++) {
      expect(startpunktStand(vorher.slice(0, n), weg), `n = ${n}`).toBe(n);
    }
    // Ein neuer Stand bis „," zählt NICHT bis „Alle Buchstaben": Punkt und
    // Komma zählen erst dort, wo die Startpunkte sie zählen (Kanada: der
    // Apostroph direkt nach ⇧ zählt mit, er steht in beiden Folgen dort).
    const neu = introOrder(weg).slice(0, introOrder(weg).indexOf(",") + 1);
    const stand = startpunktStand(neu, weg);
    expect(stand).toBeLessThan(vorher.indexOf("."));
    expect(vorher.slice(0, stand).every((u) => neu.includes(u))).toBe(true);
    expect(neu).not.toContain(vorher[stand]);
  });
});

describe("★★★★★ D-1: Bestandskinder vor, um und nach ⇧ (live-verträglich)", () => {
  for (const { weg, layout } of FAELLE) {
    describe(`${weg} auf ${layout}`, () => {
      const staende = () => {
        setLayout(layout);
        const vorher = folgeVorD1(weg, layout);
        const s = vorher.indexOf(SHIFT_UNIT);
        const punkt = vorher.indexOf(".");
        return {
          vorher,
          vorShift: vorher.slice(0, s), // alles bis kurz vor ⇧
          umShift: vorher.slice(0, s + 2), // ⇧ und ein Buchstabe danach
          nachShift: vorher.slice(0, punkt), // alle Buchstaben + ⇧, kein Satzzeichen
          mitSatzzeichen: vorher.slice(0, punkt + 4), // schon Satzzeichen
        };
      };

      it("kein Kind verliert eine Taste, keines bekommt eine geschenkt", () => {
        const st = staende();
        for (const [name, stand] of Object.entries(st)) {
          if (name === "vorher") continue;
          const jetzt = ensureIntroduced([...stand], weg);
          expect(sortiert(jetzt), name).toEqual(sortiert(stand));
        }
      });

      it("vor ⇧: die nächste Taste ist dieselbe wie vorher", () => {
        const { vorher, vorShift } = staende();
        expect(nextLetter(vorShift, weg)).toBe(vorher[vorShift.length]);
      });

      it("um ⇧ und nach allen Buchstaben: die nächste Taste ist „.\", danach „,\"", () => {
        const { umShift, nachShift } = staende();
        for (const stand of [umShift, nachShift]) {
          // Kanada (fr): ein Kind VOR dem Apostroph bekommt erst ihn (S2).
          const erst = nextLetter(stand, weg) === "'" ? [...stand, "'"] : stand;
          expect(nextLetter(erst, weg)).toBe(".");
          // … über die NORMALE Freischaltung (alles sitzt, das Tor geht auf).
          const weiter = advanceIntroduced(erst, sitzt(erst), weg);
          expect(weiter).toEqual([...erst, "."]);
          expect(nextLetter(weiter, weg)).toBe(",");
        }
      });

      it("wer schon Satzzeichen hat, hat „.\" und „,\" - die nächste Taste ist die alte", () => {
        const { vorher, mitSatzzeichen } = staende();
        expect(mitSatzzeichen).toEqual(expect.arrayContaining([".", ","]));
        expect(nextLetter(mitSatzzeichen, weg)).toBe(vorher[mitSatzzeichen.length]);
      });

      it("ein gespeicherter Startpunkt holt keinem Bestandskind etwas nach und nimmt nichts weg", () => {
        const { vorShift, umShift, nachShift, mitSatzzeichen } = staende();
        for (const stand of [vorShift, umShift, nachShift, mitSatzzeichen]) {
          const units = stand.length;
          // Automatik (Alt-Konto ohne Zeitpunkt): nichts dazu.
          expect(startpunktAngleichen([...stand], units, weg)).toBeNull();
          // Schon übernommener Beschluss: nichts zu tun.
          expect(startpunktAnwenden([...stand], units, 1000, { units, am: 1000 }, weg)).toBeNull();
          // Derselbe Beschluss neu: dieselbe Tastenmenge.
          const r = startpunktAnwenden([...stand], units, 2000, { units, am: 1000 }, weg)!;
          expect(r.introduced).toBeNull();
        }
      });
    });
  }
});
