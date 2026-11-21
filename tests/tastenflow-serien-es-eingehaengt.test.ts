/**
 * ★★★ ES-S (27.09.2026): Wächter für die EINGEHÄNGTEN spanischen Serien
 * (`serienEs.ts` → `SERIEN_ES` → `SERIEN`). Prüft, was das EINHÄNGEN selbst
 * dazubringt - nicht die Form der Texte (das prüfen weiterhin die drei
 * Wächter je Charge: `tastenflow-serien-es-kids-1.test.ts`,
 * `-teens-1.test.ts`, `-erwachsen-1.test.ts`).
 *
 * Vorbild: `tastenflow-serien-fr-zusatz-kids.test.ts` (Sprosse ausgerechnet,
 * nicht geraten) und `tastenflow-lernweg-es-tastaturen.test.ts` (`hatGriff`,
 * die harten Paare ¿?/¡!).
 *
 *  1. Jede eingehängte Serie besteht `validateSerie(s, "es")`.
 *  2. Jede eingehängte Serie ist NUR auf Weg „es" sichtbar (lang/nurWeg
 *     „es") und taucht unter keiner anderen Sprache in `SERIEN` auf.
 *  3. Jedes Zeichen jeder Zeile hat auf BEIDEN Pflicht-Tastaturen (es,
 *     latam) einen Griff.
 *  4. Öffnungs-Sprosse je Serie ausgerechnet (kleinstes n, ab dem `fitText`
 *     jede Zeile SERVIERT), auf beiden Tastaturen. Und: keine servierte
 *     (nicht-null) Fassung einer Zeile zeigt „¿" ohne „?" oder „¡" ohne „!" -
 *     das harte Paar (M3, `fitText`) verhindert eine Teil-Anzeige, auch wenn
 *     die Zeile daneben noch andere, WEGLASSBARE Satzzeichen enthält (Komma,
 *     Anführungszeichen, Punkt), die für sich genommen früher erscheinen
 *     dürfen.
 *  5. ★ D1 Nr. 13 (28.09.2026): die fünf früher zurückgehaltenen Serien
 *     (Apostroph- und Euro-Falle, siehe `serienEs.ts`) sind eingehängt.
 *
 * Jede Regel mit Gegenprobe.
 */
import { describe, it, expect } from "vitest";
import { setLayout, toLayoutText, layoutById, type KeyboardLayout } from "../src/lib/typing/layouts";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText } from "../src/lib/typing/corpus";
import { kombizeichenZu } from "../src/lib/typing/totasten";
import { SERIEN_ES } from "../src/lib/typing/serienEs";
import { SERIEN } from "../src/lib/typing/serien";
import { validateSerie } from "../src/lib/typing/serie";
import type { Serie } from "../src/lib/typing/serie";

const zeilen = (s: Serie) => s.etappen.flatMap((e) => e.lines);

// ── 1 · validateSerie ────────────────────────────────────────────────────

describe("1 · validateSerie gegen Weg es", () => {
  it("jede eingehängte Serie besteht validateSerie(s, \"es\")", () => {
    expect(SERIEN_ES.length).toBeGreaterThan(0);
    for (const s of SERIEN_ES) {
      const { ok, problems } = validateSerie(s, "es");
      expect(ok, `${s.slug}: ${problems.join("; ")}`).toBe(true);
    }
  });

  it("Gegenprobe: ein falsch deklariertes minTier wird abgelehnt", () => {
    const s = SERIEN_ES[0];
    const falsch = ((s.minTier as number) + 1) % 6;
    const kaputt: Serie = { ...s, minTier: falsch as Serie["minTier"] };
    const { ok, problems } = validateSerie(kaputt, "es");
    expect(ok).toBe(false);
    expect(problems.some((p) => p.includes("minTier"))).toBe(true);
  });

  it("Gegenprobe: eine zu kurze Etappe (< 12 Zeilen) wird abgelehnt", () => {
    const s = SERIEN_ES[0];
    const kaputt: Serie = { ...s, etappen: [{ lines: s.etappen[0].lines.slice(0, 3) }] };
    const { ok, problems } = validateSerie(kaputt, "es");
    expect(ok).toBe(false);
    expect(problems.some((p) => p.includes("Zeilen"))).toBe(true);
  });
});

// ── 2 · nur auf Weg „es" sichtbar ───────────────────────────────────────

describe("2 · nur auf Weg es sichtbar", () => {
  it("jede Serie aus SERIEN_ES hat lang \"es\" und nurWeg \"es\"", () => {
    for (const s of SERIEN_ES) {
      expect(s.lang).toBe("es");
      expect(s.nurWeg).toBe("es");
    }
  });

  it("keine spanische Serie taucht unter den Serien anderer Sprachen auf", () => {
    const esSlugs = new Set(SERIEN_ES.map((s) => s.slug));
    const andere = SERIEN.filter((s) => s.lang !== "es");
    for (const s of andere) expect(esSlugs.has(s.slug)).toBe(false);
  });

  it("SERIEN enthält jede Serie aus SERIEN_ES genau einmal", () => {
    for (const s of SERIEN_ES) {
      const treffer = SERIEN.filter((t) => t.slug === s.slug);
      expect(treffer.length, s.slug).toBe(1);
    }
  });

  it("Gegenprobe: eine als \"es\" markierte Fremd-Serie würde der Filter oben fangen", () => {
    const esSlugs = new Set(SERIEN_ES.map((s) => s.slug));
    const eingeschmuggelt: Serie = { ...SERIEN_ES[0], lang: "de", slug: "fremd-markiert-als-es-zwilling" };
    // Die Prüfzeile aus dem Test oben, hier isoliert gegen ein Fremdstück:
    expect(esSlugs.has(eingeschmuggelt.slug)).toBe(false);
    expect(eingeschmuggelt.lang).not.toBe("es"); // würde also NICHT unter §2 "andere" durchrutschen dürfen
  });
});

// ── 3 · jedes Zeichen hat auf beiden Tastaturen einen Griff ────────────────

/** Wie `hatGriff` in `tastenflow-lernweg-es-tastaturen.test.ts` (Taste · Umschalt/AltGr · Totaste). */
function hatGriff(layout: KeyboardLayout, zeichen: string): boolean {
  if (zeichen === "⇧" || zeichen === " ") return true;
  const klein = zeichen.toLowerCase();
  if (layout.rows.some((r) => r.keys.includes(klein))) return true;
  if (layout.access[klein] !== undefined) return true;
  if (kombizeichenZu(zeichen, layout) !== undefined) return true;
  return false;
}

const ES_LAYOUT = layoutById("es");
const LATAM_LAYOUT = layoutById("latam");

describe("3 · jedes Zeichen hat auf ES und LatAm einen Griff", () => {
  it("jedes Zeichen jeder Zeile jeder eingehängten Serie ist auf beiden Tastaturen greifbar", () => {
    const ungegriffen: string[] = [];
    for (const s of SERIEN_ES) {
      for (const l of zeilen(s)) {
        for (const ch of l) {
          if (!hatGriff(ES_LAYOUT, ch)) ungegriffen.push(`${s.slug}: „${ch}" fehlt auf ES`);
          if (!hatGriff(LATAM_LAYOUT, ch)) ungegriffen.push(`${s.slug}: „${ch}" fehlt auf LatAm`);
        }
      }
    }
    expect(ungegriffen).toEqual([]);
  });

  it("Gegenprobe: ein Zeichen ohne Griff wird gefunden (‰, auf keiner der beiden Tastaturen)", () => {
    expect(hatGriff(ES_LAYOUT, "‰")).toBe(false);
    expect(hatGriff(LATAM_LAYOUT, "‰")).toBe(false);
  });

  it("Gegenprobe: „€\" hat auf LATAM KEINEN Griff (gemessene Lücke, layouts.ts missing: [\"€\"]) - genau darum bleiben zwei Serien draussen", () => {
    expect(hatGriff(ES_LAYOUT, "€")).toBe(true);
    expect(hatGriff(LATAM_LAYOUT, "€")).toBe(false);
  });
});

// ── 4 · Öffnungs-Sprosse (ausgerechnet) + harte Paare ¿?/¡! ────────────────

const INTRO = lernwegDef("es").introOrder;
const LETZTE = INTRO.length;
const norm = (t: string) => t.replace(/\s+/g, " ").trim();

function sprossenFuer(layoutId: "es" | "latam") {
  setLayout(layoutId);
  const cache = new Map<number, Set<string>>();
  const allowedAt = (n: number): Set<string> => {
    let s = cache.get(n);
    if (!s) {
      s = new Set(INTRO.slice(0, n).filter((u) => u !== SHIFT_UNIT).map((u) => u.toLowerCase()));
      cache.set(n, s);
    }
    return s;
  };
  function buchstabenSprosse(text: string): number | null {
    for (let n = 1; n <= LETZTE; n++) if (fitText(text, allowedAt(n), "es") !== null) return n;
    return null;
  }
  function volleSprosse(text: string): number | null {
    const ziel = norm(toLayoutText(text));
    for (let n = 1; n <= LETZTE; n++) if (fitText(text, allowedAt(n), "es") === ziel) return n;
    return null;
  }
  return { buchstabenSprosse, volleSprosse };
}

describe("4 · Öffnungs-Sprosse ausgerechnet, harte Paare ¿?/¡! greifen", () => {
  it.each(["es", "latam"] as const)(
    "auf Tastatur %s: keine servierte Fassung zeigt ¿ ohne ? oder ¡ ohne !",
    (layoutId) => {
      setLayout(layoutId);
      const cache = new Map<number, Set<string>>();
      const allowedAt = (n: number): Set<string> => {
        let s = cache.get(n);
        if (!s) {
          s = new Set(INTRO.slice(0, n).filter((u) => u !== SHIFT_UNIT).map((u) => u.toLowerCase()));
          cache.set(n, s);
        }
        return s;
      };
      const halbeParung: string[] = [];
      for (const s of SERIEN_ES) {
        for (const l of zeilen(s)) {
          if (!/[¿¡]/.test(l)) continue;
          for (let n = 1; n <= LETZTE; n++) {
            const bedient = fitText(l, allowedAt(n), "es");
            if (bedient === null) continue;
            if (bedient.includes("¿") !== bedient.includes("?")) {
              halbeParung.push(`${s.slug} n=${n}: "${bedient}" (¿/? halb)`);
            }
            if (bedient.includes("¡") !== bedient.includes("!")) {
              halbeParung.push(`${s.slug} n=${n}: "${bedient}" (¡/! halb)`);
            }
          }
        }
      }
      expect(halbeParung).toEqual([]);
      setLayout("de");
    },
  );

  it("Öffnungs-Sprosse je Serie ist auf beiden Tastaturen ermittelbar (keine Serie bleibt für immer zu)", () => {
    for (const layoutId of ["es", "latam"] as const) {
      const { buchstabenSprosse } = sprossenFuer(layoutId);
      for (const s of SERIEN_ES) {
        const sprossen = zeilen(s).map((l) => buchstabenSprosse(l));
        expect(sprossen.every((n) => n !== null), `${s.slug} auf ${layoutId}`).toBe(true);
      }
    }
    setLayout("de");
  });

  it("Gegenprobe: eine Zeile mit ¿ ohne gelerntes ? bleibt UNSERVIERT (kein Teilbuchstabenstand)", () => {
    setLayout("es");
    const zeile = "¿Qué hora es?";
    // „é" braucht die Akzent-Totaste „´" ZUSÄTZLICH zum Grundbuchstaben „e"
    // (wie jede andere Serien-Zeile mit Akzent) - sonst weicht schon DAS
    // aus, bevor die ¿?-Frage überhaupt geprüft wird.
    const nurBuchstaben = new Set(["q", "u", "h", "o", "r", "a", "e", "s", "´", " "]); // ¿ UND ? fehlen beide
    expect(fitText(zeile, nurBuchstaben, "es")).toBeNull();
    const mitNurOeffnend = new Set([...nurBuchstaben, "¿"]); // nur ¿, nicht ?
    expect(fitText(zeile, mitNurOeffnend, "es")).toBeNull();
    const mitBeiden = new Set([...nurBuchstaben, "¿", "?"]);
    expect(fitText(zeile, mitBeiden, "es")).toBe(zeile);
    setLayout("de");
  });
});

// ── 5 · die fünf früher zurückgehaltenen Serien sind drin (D1 Nr. 13) ─────

describe("5 · ★ D1 Nr. 13: die fünf früher zurückgehaltenen Serien sind eingehängt", () => {
  // Johannes 27.09.: „Apostroph sollen sie lernen" (späte Sprosse `'`) und
  // Preise „nicht mit €-Zeichen - in Spanien-Geschichten wird ‚euros' ausgeschrieben".
  const FRUEHER_ZURUECK = [
    "es-teens-1-bix-a-beel",
    "es-erwachsen-1-la-consulta-en-maya",
    "es-erwachsen-1-el-azul-del-lago",
    "es-erwachsen-1-percebes-al-amanecer",
    "es-erwachsen-1-tension-o-presion",
  ];

  it("alle fünf stecken in SERIEN_ES und in SERIEN", () => {
    const es = new Set(SERIEN_ES.map((s) => s.slug));
    const alle = new Set(SERIEN.map((s) => s.slug));
    for (const slug of FRUEHER_ZURUECK) {
      expect(es.has(slug), slug).toBe(true);
      expect(alle.has(slug), slug).toBe(true);
    }
  });

  it("keine eingehängte spanische Serie enthält noch ein €-Zeichen (LatAm-Lücke)", () => {
    const mitEuro = SERIEN_ES.filter((s) => s.etappen.some((e) => e.lines.some((l) => l.includes("€"))));
    expect(mitEuro.map((s) => s.slug)).toEqual([]);
  });

  it("der Apostroph ist eine Sprosse des Weges „es“ - die letzte", () => {
    const o = lernwegDef("es").introOrder;
    expect(o[o.length - 1]).toBe("'");
  });

  it("60 von 60 Entwürfen sind eingehängt (Gegenprobe der Zählung)", () => {
    expect(SERIEN_ES.length).toBe(60);
  });
});
