/**
 * Der GEMEINSAME Wächter der tschechischen Serien (CS-S, 09.10.2026): eine Funktion, die für eine Charge (Kinder, Jugend,
 * Erwachsene) alle Prüfungen samt Gegenproben anlegt. Die drei Dateien `tastenflow-serien-cs-{kids,teens,erwachsen}-1.test.ts`
 * geben nur, was je Stufe anders ist: Form (Zeichen, Wortzahl), Ziffern und Pflichtzeichen, die begründete Wortliste, die
 * gemessene Öffnung jeder Serie, die gelesenen Diakritik-Fälle. Regeln: `csSerienRegeln.ts`.
 *
 * Jede Regel hat eine Gegenprobe - ein Wächter, der nie anschlägt, beweist nichts ([[feedback_gruener_waechter_beweist_was]]).
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../../src/lib/typing/letters";
import { fitText } from "../../src/lib/typing/corpus";
import { CORPUS_CS as CS_ROH } from "../../src/lib/typing/corpusCs";
import { SERIEN, allowedFromIntroduced, unlockedSerien } from "../../src/lib/typing/serien";
import { computeSerieMinTier, validateSerie, type Serie } from "../../src/lib/typing/serie";
import { bausteinKey } from "../../src/lib/typing/ledger";
import { corpusManifest } from "../../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../../src/lib/typing/corpusAnker";
import { SERIEN_CS } from "../../src/lib/typing/serienCs";
import { SERIEN_CS_KIDS_1 } from "../../src/lib/typing/serienCsKids1";
import { SERIEN_CS_TEENS_1 } from "../../src/lib/typing/serienCsTeens1";
import { SERIEN_CS_ERWACHSEN_1 } from "../../src/lib/typing/serienCsErwachsen1";
import type { SerieEntwurfCs } from "../../src/lib/typing/serienCsTyp";
import * as R from "./csSerienRegeln";
import { BELEGE_CS_SERIEN } from "./csSerienBelege";

export interface CsSerienCharge {
  stufe: "kids" | "teens" | "erwachsen";
  serien: SerieEntwurfCs[];
  form: R.FormRegel;
  /** Zeilen je Etappe (IT-Vorbild: Kinder 12-16, Jugend und Erwachsene 14-16). */
  minZeilen: number;
  maxZeilen: number;
  /** Ziffern: keine (Kinder) oder mindestens so viele Serien mit/ohne und diese Zeichen kommen vor. */
  ziffern: "keine" | { mindestMit: number; mindestOhne: number; pflicht: string[] };
  /** Öffnungs-Einheit je Serie auf `cs` (GEMESSEN; `cs-qwerty` muss gleich sein). */
  oeffnetGemessen: Readonly<Record<string, string>>;
  /** Diakritik-Verdachtsfälle, gelesen und richtig (Wort ⇒ Grund). */
  diakritikGelesen: Readonly<Record<string, string>>;
  /** Eine gute Zeile dieser Stufe für die Gegenproben (sie muss alle Zeilenregeln bestehen). */
  guteZeile: string;
}

const kopie = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const LAYOUTS = R.TASTATUREN;
const STUFEN = ["kids", "teens", "erwachsen"] as const;
const CHARGEN: Record<(typeof STUFEN)[number], SerieEntwurfCs[]> = {
  kids: SERIEN_CS_KIDS_1,
  teens: SERIEN_CS_TEENS_1,
  erwachsen: SERIEN_CS_ERWACHSEN_1,
};

export function csSerienWaechter(c: CsSerienCharge): void {
  afterEach(() => setLayout("de"));
  const S = c.serien;
  const ZEILEN = S.flatMap(R.zeilenVon);
  const EIGENE_SLUGS = new Set(S.map((s) => s.slug));
  const NAMEN = new Set(S.flatMap((s) => [...R.namenVon(s)]));
  const titel = `CS-S ${c.stufe}`;

  // ── 1 · Form jeder Zeile ──────────────────────────────────────────────────
  describe(`${titel} · 1 Form jeder Zeile`, () => {
    it("jede Zeile besteht die Regeln aller cs-Zeilen und die Form der Stufe", () => {
      const f = ZEILEN.flatMap((z) => R.formFehler(z, c.form).map((x) => `${x}: ${z}`));
      expect(f, f.join("\n")).toEqual([]);
    });
    it("Zahlen im Landesbrauch, v/ve und z/ze vor Zahlen, keine echten Daten, € nur im Ausland", () => {
      const f = ZEILEN.flatMap((z) =>
        [...R.zahlFehler(z), ...R.praepositionFehler(z), ...R.datenFehler(z), ...(R.euroOhneAusland(z) ? ["€ ohne Ausland"] : [])].map(
          (x) => `${x}: ${z}`,
        ),
      );
      expect(f, f.join("\n")).toEqual([]);
    });
    it("Gegenprobe: jede Form-, Zahl- und Datenregel schlägt an, die gute Zeile nicht", () => {
      expect(R.formFehler(c.guteZeile, c.form)).toEqual([]);
      const rot: [string, string][] = [
        ["ema čte.", "kein Grossbuchstabe am Anfang"],
        ["Ema čte knihu u okna", "kein Satzschluss am Ende"],
        ["Ema čte knihu. Pak spí.", "mehr als ein Satz"],
        ["Ema čte knihu? Pak spí doma.", "mehr als ein Satz"],
        ["Ema čte knihu,pak spí doma.", "kein Leerzeichen nach , ; :"],
        ['Ema volá "pojď sem domů.', "Anführungszeichen ungerade"],
        ["Ema čte knihu - pak spí.", "Bindestrich (vor seiner Sprosse fiele er weg und zerrisse das Wort oder den Einschub)"],
        ["Ema čte knihu ve Frýdku-Místku.", "Bindestrich (vor seiner Sprosse fiele er weg und zerrisse das Wort oder den Einschub)"],
        ["Ema čte knihu „Pejsek“ doma.", "Zeichen ausserhalb der erlaubten"],
        ["Na Ůvalech je hezky.", "Zeichen ausserhalb der erlaubten"],
      ];
      for (const [z, e] of rot) expect(R.formFehler(z, c.form), z).toContain(e);
      expect(R.formFehler("Ema čte.", c.form).some((x) => /Wörter$/.test(x))).toBe(true);
      expect(R.formFehler(`Ema ${"čte ".repeat(20)}doma.`, c.form).some((x) => /Wörter$/.test(x))).toBe(true);
      for (const t of ["Baterie má 50 %.", "Stojí 2Kč.", "Váží 1.5 kila.", "Je tu 12345 lidí.", "Sraz v 7:5 ráno.", "Hrajeme na 2."]) {
        expect(R.zahlFehler(t).length, t).toBeGreaterThan(0);
      }
      expect(R.zahlFehler("V 7:15 je 20% sleva, stojí 2 400 Kč a průměr je 1,2 v 9. třídě.")).toEqual([]);
      for (const t of ["Sraz v 2:00 ráno.", "Sraz ve 7:15 ráno.", "Ze 5 lidí.", "Z 3 lidí."]) expect(R.praepositionFehler(t).length, t).toBeGreaterThan(0);
      expect(R.praepositionFehler("Ve 4 ráno, v 7:15, ze 22 lidí a z 5 lidí.")).toEqual([]);
      for (const t of ["Pište na jana@seznam.cz.", "Volejte 602 123 456.", "Rodné číslo 850101/1234.", "Je to na www.obec.cz."]) {
        expect(R.datenFehler(t).length, t).toBeGreaterThan(0);
      }
      expect(R.datenFehler("Pište na klub@skola.example.")).toEqual([]);
      expect(R.euroOhneAusland("V Brně stojí kafe 3 €.")).toBe(true);
      expect(R.euroOhneAusland("Ve Vídni stojí kafe 4 €.")).toBe(false);
    });
    if (c.ziffern === "keine") {
      it("keine Ziffer (Kinder: alle Zahlen ausgeschrieben - sonst stiege minTier auf 5)", () => {
        expect(ZEILEN.filter((z) => /\d/.test(z))).toEqual([]);
      });
    } else {
      const z = c.ziffern;
      it(`mindestens ${z.mindestMit} Serien mit Ziffern, ${z.mindestOhne} ohne; ${z.pflicht.join(" ")} kommen vor`, () => {
        const mit = S.filter((s) => R.zeilenVon(s).some((l) => /\d/.test(l))).length;
        expect(mit).toBeGreaterThanOrEqual(z.mindestMit);
        expect(S.length - mit).toBeGreaterThanOrEqual(z.mindestOhne);
        const text = ZEILEN.join(" ");
        for (const p of z.pflicht) expect(p === "h:mm" ? /\d:\d\d/.test(text) : text.includes(p), p).toBe(true);
      });
    }
  });

  // ── 2 · Form jeder Serie ──────────────────────────────────────────────────
  describe(`${titel} · 2 Form jeder Serie`, () => {
    it("Slug, Stufe, Weg, Herkunft, Kraj und Land, Etappen, Zeilen je Etappe, Fortsetzung endet auf ? oder !, Titel, Eigennamen", () => {
      const f = S.flatMap((s) => R.serienFormFehler(s, c.stufe, c.minZeilen, c.maxZeilen));
      expect(f, f.join("\n")).toEqual([]);
    });
    it("20 Serien: 19 mit zwei Etappen, genau eine mit drei; Slugs und Titel eindeutig, auch gegen die anderen cs-Chargen", () => {
      expect(S.length).toBe(20);
      expect(S.filter((s) => s.etappen.length === 3).length).toBe(1);
      const andere = STUFEN.filter((x) => x !== c.stufe).flatMap((x) => CHARGEN[x]);
      expect(new Set(S.map((s) => s.slug)).size).toBe(20);
      expect(new Set(S.map((s) => s.titel.toLowerCase())).size).toBe(20);
      const fremdTitel = new Set(andere.map((s) => s.titel.toLowerCase()));
      expect(S.filter((s) => fremdTitel.has(s.titel.toLowerCase())).map((s) => s.titel)).toEqual([]);
    });
    it("Gegenprobe: falsche Etappenzahl, Zeilenzahl, offenes Ende, Slug, Stufe, Herkunft, Kraj, Land und fehlender Name", () => {
      const b = () => kopie(S[1]);
      const s1 = b();
      s1.etappen = s1.etappen.slice(0, 1);
      expect(R.serienFormFehler(s1, c.stufe, c.minZeilen, c.maxZeilen).some((x) => x.includes("1 Etappen"))).toBe(true);
      const s2 = b();
      s2.etappen[0].lines = s2.etappen[0].lines.slice(0, c.minZeilen - 1);
      expect(R.serienFormFehler(s2, c.stufe, c.minZeilen, c.maxZeilen).some((x) => x.includes(`${c.minZeilen - 1} Zeilen`))).toBe(true);
      const s3 = b();
      s3.etappen[0].lines[s3.etappen[0].lines.length - 1] = "Ema jde domů.";
      expect(R.serienFormFehler(s3, c.stufe, c.minZeilen, c.maxZeilen).some((x) => x.includes("endet ohne"))).toBe(true);
      const f = (x: SerieEntwurfCs) => R.serienFormFehler(x, c.stufe, c.minZeilen, c.maxZeilen);
      expect(f({ ...b(), slug: "cs-falsch-1-x" }).some((x) => x.includes("Slug-Vorsilbe"))).toBe(true);
      expect(f({ ...b(), stufen: [c.stufe === "kids" ? "teens" : "kids"] }).some((x) => x.includes("stufen"))).toBe(true);
      expect(f({ ...b(), herkunft: { quelle: "Tatoeba", lizenz: "CC BY" } }).some((x) => x.includes("herkunft"))).toBe(true);
      expect(f({ ...b(), land: "Atlantida" as never }).some((x) => x.includes("land"))).toBe(true);
      expect(f({ ...b(), land: "Praha", zeme: "Slezsko" }).some((x) => x.includes("zeme"))).toBe(true);
      expect(f({ ...b(), eigennamen: [...b().eigennamen, "Xaver"] }).some((x) => x.includes("Xaver"))).toBe(true);
    });
  });

  // ── 3 · Eingehängt, nur Weg cs, nur diese Stufe ───────────────────────────
  describe(`${titel} · 3 eingehängt: validateSerie, minTier gerechnet, SERIEN_CS, nur Weg cs`, () => {
    it("jede Serie besteht validateSerie(s, \"cs\") und trägt ihr gerechnetes minTier - auf cs und cs-qwerty gleich", () => {
      // ⚠️ Die Einstufung hängt an der eingestellten Tastatur: ď ť ň kommen nur über die Totaste ˇ der tschechischen
      // Tastatur (`KOMBIZEICHEN_CS`) - auf „de" wäre „teď" nie tippbar (gemessen: minTierFor("Loďka.") = null).
      const f: string[] = [];
      setLayout("cs-qwerty");
      const qwerty = S.map((s) => computeSerieMinTier(s as unknown as Serie, "cs"));
      setLayout("cs");
      S.forEach((s, i) => {
        if (qwerty[i] !== s.minTier) f.push(`${s.slug}: minTier auf cs-qwerty ${qwerty[i]}`);
      });
      for (const s of S) {
        const { ok, problems } = validateSerie(s as unknown as Serie, "cs");
        if (!ok) f.push(`${s.slug}: ${problems.join("; ")}`);
        if (s.minTier === undefined || computeSerieMinTier(s as unknown as Serie, "cs") !== s.minTier) f.push(`${s.slug}: minTier`);
      }
      expect(f, f.join("\n")).toEqual([]);
    });
    it("jede Serie steht genau einmal in SERIEN_CS und SERIEN, als Block in der Reihenfolge Kinder, Jugend, Erwachsene", () => {
      for (const s of S) {
        expect(SERIEN_CS.filter((t) => t.slug === s.slug).length, s.slug).toBe(1);
        expect(SERIEN.filter((t) => t.slug === s.slug).length, s.slug).toBe(1);
      }
      const erwartet = STUFEN.flatMap((x) => CHARGEN[x].map((s) => s.slug));
      expect(SERIEN_CS.map((s) => s.slug)).toEqual(erwartet);
    });
    it("Gegenprobe: ein falsch eingetragenes minTier wird abgelehnt; auf „de“ ist „teď“ nie tippbar", () => {
      setLayout("cs");
      const s = S[0] as unknown as Serie;
      const falsch = { ...s, minTier: (((s.minTier as number) + 1) % 6) as Serie["minTier"] };
      expect(validateSerie(falsch, "cs").problems.some((p) => p.includes("minTier"))).toBe(true);
      const tedy = { ...s, etappen: [{ lines: ["Teď jde Ema domů."] }] } as Serie;
      expect(computeSerieMinTier(tedy, "cs")).toBe(3);
      setLayout("de");
      expect(computeSerieMinTier(tedy, "cs")).toBeNull();
    });
    for (const l of LAYOUTS) {
      it(`${l}: mit allen Tasten bekommt die Stufe jede Serie; die anderen Stufen keine; vor ⇧ niemand`, () => {
        const alle = R.allowedAt(R.ordnung(l).length, l);
        const offen = new Set(unlockedSerien(alle, c.stufe, "cs", "cs").map((s) => s.slug));
        expect(S.filter((s) => !offen.has(s.slug)).map((s) => s.slug)).toEqual([]);
        for (const x of STUFEN.filter((y) => y !== c.stufe)) {
          expect(unlockedSerien(alle, x, "cs", "cs").filter((s) => EIGENE_SLUGS.has(s.slug)).map((s) => s.slug), x).toEqual([]);
        }
        const vorShift = R.allowedAt(R.ordnung(l).indexOf(SHIFT_UNIT), l);
        expect(unlockedSerien(vorShift, c.stufe, "cs", "cs", false).filter((s) => EIGENE_SLUGS.has(s.slug))).toEqual([]);
      });
    }
    it("die Wege „de“ und „it“ bekommen keine dieser Serien", () => {
      for (const w of ["de", "it"] as const) {
        setLayout(w);
        const alle = allowedFromIntroduced(introOrder(w), w);
        expect(unlockedSerien(alle, c.stufe, w, w).filter((s) => EIGENE_SLUGS.has(s.slug)), w).toEqual([]);
      }
    });
  });

  // ── 4 · Tastaturen ────────────────────────────────────────────────────────
  describe(`${titel} · 4 jedes Zeichen auf cs und cs-qwerty greifbar`, () => {
    for (const l of LAYOUTS) {
      it(`${l}: jedes Zeichen jeder Zeile und jedes Titels hat einen Griff`, () => {
        expect(R.griffFehler([...ZEILEN, ...S.map((s) => s.titel)], l)).toEqual([]);
      });
    }
    it("Gegenprobe: ñ und Ů haben keinen Griff, ř, ď und Č schon", () => {
      expect(R.griffFehler(["ñ Ů"], "cs")).toEqual(["ñ", "Ů"]);
      expect(R.griffFehler(["řďČ"], "cs-qwerty")).toEqual([]);
    });
  });

  // ── 5 · Servieren gegen den echten Weg ────────────────────────────────────
  describe(`${titel} · 5 Servieren auf Weg „cs“`, () => {
    for (const l of LAYOUTS) {
      it(`${l}: jede Serie öffnet; keine gekürzte Fassung verliert ein Wort; am Ende kommt jede Zeile vollständig`, () => {
        const f: string[] = [];
        for (const s of S) if (R.oeffnet(s, l) === null) f.push(`${s.slug}: öffnet nie`);
        for (const z of ZEILEN) {
          if (R.volleSprosse(z, l) === null) f.push(`nie vollständig: ${z}`);
          const v = R.wortVerlust(z, l);
          if (v.length) f.push(`Wort verloren an ${v.join(",")}: ${z}`);
        }
        expect(f, f.join("\n")).toEqual([]);
      });
    }
    it("jede Serie öffnet an der gemessenen Einheit, auf cs und cs-qwerty gleich", () => {
      const ist = Object.fromEntries(S.map((s) => [s.slug, R.oeffnetEinheit(s, "cs")]));
      expect(ist).toEqual(c.oeffnetGemessen);
      expect(S.filter((s) => R.oeffnet(s, "cs") !== R.oeffnet(s, "cs-qwerty")).map((s) => s.slug)).toEqual([]);
    });
    it("Gegenprobe: eine Zeile mit ď öffnet erst an ˇ, eine mit Ziffer kommt erst mit ihr vollständig, ñ nie", () => {
      expect(R.ordnung("cs")[R.ersteSprosse("Ema má loďku.", "cs")! - 1]).toBe("ˇ");
      expect(R.volleSprosse("Ema má 7 let.", "cs")).toBe(R.sprosseVon("7"));
      expect(R.ersteSprosse("Mañana prší.", "cs")).toBeNull();
      expect(R.wortfolge("Ema, pojď!")).toBe("ema pojď");
    });
  });

  // ── 6 · Grosswörter, auch nach dem Kürzen ─────────────────────────────────
  describe(`${titel} · 6 gross mitten im Satz nur Eigennamen der Serie - auch gekürzt (Naht nach ? ! :)`, () => {
    it("vollständig", () => {
      const f = S.flatMap((s) => R.zeilenVon(s).flatMap((z) => R.fremdeGrosswoerter(z, R.namenVon(s)).map((w) => `${s.slug}: ${w} in ${z}`)));
      expect(f, f.join("\n")).toEqual([]);
    });
    for (const l of LAYOUTS) {
      it(`${l}: in jeder gekürzten Fassung`, () => {
        const f = S.flatMap((s) => R.zeilenVon(s).flatMap((z) => R.gekuerztFehler(z, R.namenVon(s), l).map((x) => `${s.slug}: ${z} @ ${x}`)));
        expect(f, f.join("\n")).toEqual([]);
      });
    }
    it("Gegenprobe: „Trenér volá: \"Rychleji!\"“ wird gekürzt zu einem Grosswort mitten im Satz, die Rede vorn nicht", () => {
      const n = new Set(["ema"]);
      expect(R.fremdeGrosswoerter("Ema volá Pojď sem.", n)).toEqual(["Pojď"]);
      expect(R.gekuerztFehler('Ema volá: "Pojď sem!"', n).length).toBeGreaterThan(0);
      expect(R.gekuerztFehler('"Pojď sem!" volá Ema.', n)).toEqual([]);
      expect(R.fremdeGrosswoerter("Ema jede do Brna.", n)).toEqual(["Brna"]);
    });
  });

  // ── 7 · Inhalt: Geschlecht, Feiertage, Politik, Religion, Staatssymbole, Etikett ─
  describe(`${titel} · 7 Inhalt`, () => {
    it("keine Zeile legt das Geschlecht der tippenden Person fest (auch nicht in wörtlicher Rede)", () => {
      const f = S.flatMap((s) => R.zeilenVon(s).filter((z) => R.geschlechtFehler(z, R.namenVon(s))));
      expect(f, f.join("\n")).toEqual([]);
    });
    it("keine Feiertage, keine Politik, keine Religion, keine Staatssymbole, kein Etikett", () => {
      const f = ZEILEN.flatMap((z) =>
        [
          R.feiertagIn(z) && "Feiertag",
          R.politikIn(z) && "Politik",
          R.religionIn(z) && "Religion",
          R.staatssymbolIn(z) && "Staatssymbol",
          R.etikettIn(z) && "Etikett",
        ]
          .filter(Boolean)
          .map((x) => `${x}: ${z}`),
      );
      expect(f, f.join("\n")).toEqual([]);
      const titelF = S.filter((s) => R.feiertagIn(s.titel) || R.religionIn(s.titel) || R.etikettIn(s.titel));
      expect(titelF.map((s) => s.titel)).toEqual([]);
    });
    it("Gegenprobe Geschlecht: gegenderte Formen werden gefunden, neutrale nicht", () => {
      for (const z of [
        "Byl jsem tam!", "Včera jsem tam byla.", '"Jsi hotová?" ptá se Ema.', "Chtěla bych psa.", '"Půjdu sám," říká Ema.',
        "Mám rád zmrzlinu.", "Byl jste u nás?", "Kde jsi byl?", "Jsem připravený.", "Můj manžel vaří.",
      ]) {
        expect(R.geschlechtFehler(z), z).toBe(true);
      }
      for (const z of ["Ema byla v Brně.", "Byli jsme v Brně!", '"Jsem z Brna," říká Ema.', "Ema má ráda psy.", "Jdu do školy.", "Jsem ve škole."]) {
        expect(R.geschlechtFehler(z), z).toBe(false);
      }
      expect(R.geschlechtFehler('"Jsem tu, Michal!" volá Ema.', new Set(["michal", "ema"]))).toBe(false);
    });
    it("Gegenprobe Inhalt: Feiertag, Wahl, Kirche, Fahne, Etikett werden gefunden; Slepice, Bohumín, bohužel, Český ráj nicht", () => {
      expect(R.feiertagIn("Na Vánoce jedeme k babičce.")).toBe(true);
      expect(R.politikIn("Táta jde k volbám.")).toBe(true);
      expect(R.religionIn("Ve vsi stojí starý kostel.")).toBe(true);
      expect(R.religionIn("Bože, to je zima!")).toBe(true);
      expect(R.staatssymbolIn("Na stožáru vlaje vlajka.")).toBe(true);
      expect(R.etikettIn("Slepý chlapec čte.")).toBe(true);
      expect(R.etikettIn("Ema píše naslepo.")).toBe(true);
      expect(R.etikettIn("Nevidomá dívka zpívá.")).toBe(true);
      expect(R.etikettIn("Slepice snesla vejce.")).toBe(false);
      expect(R.religionIn("Vlak jede do Bohumína, bohužel pozdě.")).toBe(false);
      expect(R.religionIn("V Českém ráji jsou skály.")).toBe(false);
      expect(R.politikIn("Dálkový ovladač ovládá televizi.")).toBe(false);
    });
  });

  // ── 8 · Wortschatz ────────────────────────────────────────────────────────
  describe(`${titel} · 8 Wortschatz`, () => {
    it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Eigennamen und Funktionswörter ausgenommen)", () => {
      const f = R.zuHaeufig(ZEILEN, NAMEN);
      expect(f, f.join("\n")).toEqual([]);
    });
    it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross), ein Funktionswort und ein Name nicht", () => {
      const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Kapela" : "Ta kapela"} hraje ${"abcdefghi"[i]} u Emy.`);
      expect(R.zuHaeufig(neun, new Set(["emy"]))).toEqual(['"kapela": 9 Zeilen', '"hraje": 9 Zeilen']);
      expect(R.zuHaeufig(neun.slice(0, 8), new Set(["emy"]))).toEqual([]);
      expect(R.zuHaeufig(neun, new Set())).toContain('"emy": 9 Zeilen');
    });
    it("kein Wort aus der Sperrliste - Kern und Wortbasis, auch im Titel", () => {
      const f = [...ZEILEN, ...S.map((s) => s.titel)].flatMap((z) => R.pruefWoerter(z).filter((w) => R.gesperrtCs(w)).map((w) => `${w}: ${z}`));
      expect(f, f.join("\n")).toEqual([]);
    });
    it("Gegenprobe: kurva (Kern) und vole (Wortbasis) gefunden; knihovně, slepice nicht", () => {
      expect(R.istKernGesperrtCs("kurva")).toBe(true);
      expect(R.gesperrtCs("vole")).toBe(true);
      for (const w of ["knihovně", "sekundy", "přestávky"]) expect(R.gesperrtCs(w), w).toBe(false);
    });
    it("jedes Wort steht in der Wortbasis, unter den Namen der Serie oder begründet in der gemeinsamen Liste - die Liste trägt nur Gebrauchtes", () => {
      const f = S.flatMap((s) => R.ungeprueft(R.zeilenVon(s), BELEGE_CS_SERIEN, R.namenVon(s)).map((w) => `${s.slug}: ${w}`));
      expect(f, f.join("\n")).toEqual([]);
      const alleZeilen = STUFEN.flatMap((x) => CHARGEN[x].flatMap(R.zeilenVon));
      expect(R.ueberfluessig(alleZeilen, BELEGE_CS_SERIEN)).toEqual([]);
      expect(Object.entries(BELEGE_CS_SERIEN).filter(([, g]) => g.trim().length < 3).map(([w]) => w)).toEqual([]);
    });
    it("Gegenprobe: ein erfundenes Wort, eine falsche Endung und ein fremder Name werden gemeldet - Adresse und Zahl nicht", () => {
      expect(R.ungeprueft(["Ema má florbalx a dva brigádové.", "Píše na klub@skola.example v 7:15."], {}, new Set(["ema"]))).toEqual([
        "florbalx",
        "brigádové",
      ]);
      expect(R.ungeprueft(["Přijel Xaverius."], {}, new Set())).toEqual(["xaverius"]);
      expect(R.ungeprueft(["Přijel Xaverius."], { xaverius: "Name" }, new Set())).toEqual([]);
      expect(R.ueberfluessig(["Ema čte."], { florbalx: "nie benutzt", čte: "steht im Wortschatz" })).toEqual(["florbalx", "čte"]);
    });
    it("kein Wort ohne den Haken oder Strich, den es braucht (Diakritik-Falle) - ausser den gelesenen", () => {
      const v = R.diakritikVerdacht(ZEILEN, NAMEN).map((x) => x.split(" ")[0]);
      expect(v.filter((w) => !(w in c.diakritikGelesen))).toEqual([]);
      expect(Object.keys(c.diakritikGelesen).filter((w) => !v.includes(w))).toEqual([]);
    });
    it("Gegenprobe: „Mam hlad!“ und „Muze to byt.“ werden gemeldet, „Mám hlad!“ nicht", () => {
      expect(R.diakritikVerdacht(["Mam hlad!"]).length).toBeGreaterThan(0);
      expect(R.diakritikVerdacht(["Muze to byt."]).length).toBeGreaterThan(0);
      expect(R.diakritikVerdacht(["Mám hlad!"])).toEqual([]);
    });
  });

  // ── 9 · Keine Kopien, keine Paare, nichts fast gleich ─────────────────────
  describe(`${titel} · 9 keine Kopien, keine Paare, nichts fast gleich`, () => {
    it("die Vergleichsmengen sind voll (cs-Korpus roh, Serien, Banken)", () => {
      expect(R.andereCsZeilen(EIGENE_SLUGS).length).toBeGreaterThan(1500);
      expect(R.alleFremdenZeilen(EIGENE_SLUGS).length).toBeGreaterThan(100000);
      expect(R.bankZeilen().length).toBeGreaterThan(1000);
    });
    it("keine Zeile doppelt - auch nicht ohne Satzzeichen oder nach dem Ledger-Schlüssel (der Háček und Čárka nicht kennt)", () => {
      expect(new Set(ZEILEN.map(R.ohneSatzzeichen)).size).toBe(ZEILEN.length);
      expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
    });
    it("keine Zeile gleicht einer Zeile oder einem Satz eines Korpus, einer anderen Serie oder einer Bank", () => {
      expect(R.kopienGegen(ZEILEN, R.alleFremdenZeilen(EIGENE_SLUGS))).toEqual([]);
    });
    it("keine Paare (nur Geschlecht oder Zahl getauscht) - untereinander und gegen jede andere cs-Zeile", () => {
      const f = R.paare(ZEILEN, R.andereCsZeilen(EIGENE_SLUGS));
      expect(f, f.join("\n")).toEqual([]);
    });
    it("nichts fast gleich (Jaccard ≥ 0,6) - untereinander, gegen jede andere cs-Zeile und gegen alles andere", () => {
      const f = [...R.fastGleichUntereinander(ZEILEN, 0.6), ...R.fastGleich(ZEILEN, R.alleFremdenZeilen(EIGENE_SLUGS), 0.6)];
      expect(f, f.slice(0, 15).join("\n")).toEqual([]);
    });
    it("Gegenprobe: Kopie mit anderen Satzzeichen, eine Korpuszeile, ein Paar und ein Fast-Duplikat werden erkannt; der Präfix-Filter findet, was der volle Vergleich findet", () => {
      const k = CS_ROH[0].text;
      expect(R.kopienGegen([`${k.replace(/[.!?]$/, "")}!`], R.alleFremdenZeilen(EIGENE_SLUGS))).toHaveLength(1);
      expect(R.paare(["Šimon vyhrál závod!", "Šimon vyhrála závod."])).toHaveLength(1);
      expect(R.paare(["On čte knihu.", "Ona čte knihu."])).toHaveLength(1);
      const probe = ["Na stole leží modrá kniha.", "Na stole leží modrá kniha a pero.", "Venku prší a fouká vítr."];
      const gegen = ["Na stole leží modrá kniha a pero.", "Pes spí na gauči.", "Venku prší."];
      expect(R.fastGleich(probe, gegen, 0.6).sort()).toEqual(R.fastGleichVoll(probe, gegen, 0.6).sort());
      expect(R.fastGleich(probe, gegen, 0.6).length).toBe(1);
      const stichprobe = ZEILEN.slice(0, 40);
      const andere = R.andereCsZeilen(EIGENE_SLUGS);
      expect(R.fastGleich(stichprobe, andere, 0.4).sort()).toEqual(R.fastGleichVoll(stichprobe, andere, 0.4).sort());
    });
  });

  // ── 10 · Regionen ─────────────────────────────────────────────────────────
  describe(`${titel} · 10 Tschechien in seiner Breite: Böhmen, Mähren, Schlesien`, () => {
    it("jeder Kraj 1-2 Serien, Praha höchstens eine, Mähren + Schlesien mindestens 7, Schlesien dabei", () => {
      expect(R.verteilungFehler(S)).toEqual([]);
    });
    it("Gegenprobe: zehnmal Praha, ein fehlender Kraj und kein Schlesien werden gemeldet", () => {
      const p = R.verteilungFehler(Array.from({ length: 10 }, () => ({ land: "Praha", zeme: "Čechy" })));
      expect(p).toContain("Praha: 10 Serien");
      expect(p).toContain("Zlínský fehlt");
      expect(p).toContain("Schlesien fehlt");
    });
  });

  // ── 11 · Anker unberührt ──────────────────────────────────────────────────
  describe(`${titel} · 11 Korpus-Anker unberührt`, () => {
    it("der Anker ist aktuell und kennt keine Serienzeile (Serien tragen keine Anker-IDs)", () => {
      expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
      const korpus = new Set(CS_ROH.map((i) => i.text));
      expect(ZEILEN.filter((z) => korpus.has(z))).toEqual([]);
    });
  });

  // Hilfsausgabe für den Autor: gekürzte Fassungen zählen (keine Prüfung, nur damit `fitText` sichtbar benutzt bleibt).
  it(`${titel}: an der Öffnung kommen die Zeilen an (mindestens eine gekürzt, falls ! oder " vorkommen)`, () => {
    const l: LayoutId = "cs";
    let gekuerzt = 0;
    for (const s of S) {
      const n = R.oeffnet(s, l)!;
      for (const z of R.zeilenVon(s)) if (fitText(z, R.allowedAt(n, l), "cs") !== z.replace(/\s+/g, " ").trim()) gekuerzt++;
    }
    if (ZEILEN.some((z) => /[!"]/.test(z))) expect(gekuerzt).toBeGreaterThan(0);
  });
}
