/**
 * ★★★ E2a (25.09.2026): DAS GERÜST DES FRANZÖSISCHEN LEHRGANGS.
 *
 * Bauplan: `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §14 E2, §2.3 (die
 * Wächter des Gerüsts). Was hier geprüft wird - die fünf Golden-Tests für
 * „de"/„en" bleiben unverändert und stehen NICHT hier:
 *
 *  1. `LERNWEGE.fr` existiert, ist vorläufig, unterscheidet sich echt von
 *     „de" und „en" (kein stiller Rückfall).
 *  2. `bestimmeLernweg`: „fr" wird NUR mit dem neuen Schalter gewählt; ohne
 *     ihn verhält sich eine französische Bedienung wie heute.
 *  3. Der Schalter `?franzoesisch-lehrgang=1`/`=0` und sein Gerät-Merker.
 *  4. Der Server-Wächter nimmt „fr" jetzt an (die Ausführung selbst steht in
 *     `tastenflow-lernweg.test.ts` §3/§4 - hier nur die Ergänzung).
 *  5. `fr` fällt bei den umgebauten Weichen nie still auf `de` zurück.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  LEHRGANG_PROBE_MERKER_FR,
  LERNWEGE,
  LERNWEGE_LISTE,
  bestimmeLernweg,
  franzoesischLehrgangProbeAn,
  istLernweg,
} from "../src/lib/typing/lernweg";
import { istTastenflowMerker } from "../src/lib/bedienSprache/sprache";
import { achteGrundtasteFuerLayout, introOrder, layoutLetterOrder } from "../src/lib/typing/letters";
import { homeKeyFor, FINGERS } from "../src/lib/typing/fingers";
import { lektionenFuer } from "../src/lib/typing/curriculum";
import { stationGuessWords } from "../src/lib/typing/expedition/words";
import { heimZeichenDesWeges } from "../src/lib/typing/heimtasten";
import { istGeruestSprache } from "../src/lib/typing/sprachRegister";

beforeEach(() => localStorage.clear());

// ── 1 · LERNWEGE.fr existiert und ist vorläufig ─────────────────────────────

describe("1 · LERNWEGE.fr - das Gerüst", () => {
  it("ist Teil der Liste und gilt als Lernweg", () => {
    expect(LERNWEGE_LISTE).toContain("fr");
    expect(istLernweg("fr")).toBe(true);
    // ★ ES-F2 (27.09.2026): „es" ist inzwischen ein echter Lernweg (Gerüst) -
    // diese Zeile prüfte ursprünglich nur „kein stiller Fünfter", nicht „es"
    // im Besonderen. Ein wirklich unbekannter Wert bleibt abgelehnt.
    expect(istLernweg("xx")).toBe(false); // ★ G2a: „it" ist seitdem ein Lernweg
  });

  it("hat eine eigene, von de UND en verschiedene Buchstabenfolge", () => {
    expect(LERNWEGE.fr.letterOrder).not.toEqual(LERNWEGE.de.letterOrder);
    expect(LERNWEGE.fr.letterOrder).not.toEqual(LERNWEGE.en.letterOrder);
    expect(LERNWEGE.fr.introOrder).not.toEqual(LERNWEGE.de.introOrder);
  });

  it("★ E3 (25.09.2026): die Grundreihe ist jetzt die ECHTE AZERTY-Form q s d f j k l m (Bauplan §3.1) - der E2a-Platzhalter a s d f j k l ; ist abgelöst", () => {
    // ★ 26.09.2026: Anker-Folge wie Bauplan §5.3 (f j · d k · s l · q m), nicht die Positions-Folge.
    expect(LERNWEGE.fr.letterOrder.slice(0, 8)).toEqual(["f", "j", "d", "k", "s", "l", "q", "m"]);
  });

  it("★ Fassung A2 (E5, 25.09.): nach der Grundreihe folgen e t n u i a o r, dann p c v", () => {
    expect(LERNWEGE.fr.letterOrder.slice(8, 16)).toEqual(["e", "t", "n", "u", "i", "a", "o", "r"]);
    expect(LERNWEGE.fr.letterOrder.slice(16, 19)).toEqual(["p", "c", "v"]);
  });

  it("★ Fassung A2: Maj kommt nach ' und é - also erst, wenn echte Sätze entstehen (21 Buchstaben)", () => {
    const intro = LERNWEGE.fr.introOrder;
    expect(intro.indexOf("⇧")).toBe(21);
    expect(intro.indexOf("é")).toBeLessThan(intro.indexOf("⇧"));
    expect(intro.indexOf("'")).toBeLessThan(intro.indexOf("⇧"));
  });

  it("★ Fassung A2: keine Einheit doppelt, jeder französische Buchstabe genau einmal", () => {
    const o = LERNWEGE.fr.letterOrder;
    expect(new Set(o).size).toBe(o.length);
    for (const b of "abcdefghijklmnopqrstuvwxyzéèàçù'") expect(o).toContain(b);
  });

  it("' und é kommen nach p c v, vor b g h (Fassung A2)", () => {
    const o = LERNWEGE.fr.letterOrder;
    expect(o.indexOf("'")).toBe(o.indexOf("v") + 1);
    expect(o.indexOf("é")).toBe(o.indexOf("'") + 1);
    expect(o.indexOf("é")).toBeLessThan(o.indexOf("b"));
  });

  it("★ E4 (25.09.2026): die Totasten ^/¨ sind jetzt eigene Lerneinheiten (Bauplan §4.3 Punkt 2, §5.3 Sprosse 28) - die zusammengesetzten Zeichen selbst (ê â î ô û ë ï) bleiben weiter unerreicht, wie ⇧ nie ein eigenes Grosszeichen ist", () => {
    for (const kombiZeichen of ["ê", "â", "î", "ô", "û", "ë", "ï"]) {
      expect(LERNWEGE.fr.letterOrder).not.toContain(kombiZeichen);
      expect(LERNWEGE.fr.introOrder).not.toContain(kombiZeichen);
    }
    for (const totaste of ["^", "¨"]) {
      expect(LERNWEGE.fr.letterOrder).toContain(totaste);
      expect(LERNWEGE.fr.introOrder).toContain(totaste);
    }
    // Fassung A2: à ^ è (die Totaste zwischen den beiden Ziffernreihen-Buchstaben),
    // ¨ ganz am Ende der Buchstaben.
    const order = LERNWEGE.fr.letterOrder;
    expect(order.indexOf("^")).toBe(order.indexOf("à") + 1);
    expect(order.indexOf("è")).toBe(order.indexOf("^") + 1);
    expect(order.indexOf("¨")).toBe(order.length - 1);
  });

  it("tierCuts sind aufsteigend und enden an der Länge von letterOrder", () => {
    const t = LERNWEGE.fr.tierCuts;
    expect(t[0]).toBeLessThan(t[1]);
    expect(t[1]).toBeLessThan(t[2]);
    expect(t[2]).toBeLessThanOrEqual(t[3]);
    expect(t[3]).toBe(LERNWEGE.fr.letterOrder.length);
  });

  it("homeKeys enthält die Grundreihe UND die Ersatztaste ö (wie bei en)", () => {
    for (const k of ["a", "s", "d", "f", "j", "k", "l", ";", "ö"]) {
      expect(LERNWEGE.fr.homeKeys.has(k)).toBe(true);
    }
  });

  it("★ E9a (26.09.2026): „;\" gehört zur Satzzeichenfolge, in der Reihenfolge des Bauplans §5.3 „dann\": , ; : ! ? \" - ( )", () => {
    expect(LERNWEGE.fr.punctOrder).toContain(";");
    const komma = LERNWEGE.fr.punctOrder.indexOf(",");
    const semikolon = LERNWEGE.fr.punctOrder.indexOf(";");
    const doppelpunkt = LERNWEGE.fr.punctOrder.indexOf(":");
    const ausrufezeichen = LERNWEGE.fr.punctOrder.indexOf("!");
    expect(semikolon).toBe(komma + 1);
    expect(doppelpunkt).toBe(semikolon + 1);
    expect(ausrufezeichen).toBe(doppelpunkt + 1);
    // Genau einmal in der ganzen Folge (Satzzeichen UND Buchstaben) - „;" ist
    // auf AZERTY (fr/be) KEIN Buchstabe der Grundreihe, anders als bei „en".
    expect(LERNWEGE.fr.letterOrder).not.toContain(";");
    expect(LERNWEGE.fr.introOrder.filter((u) => u === ";")).toHaveLength(1);
  });
});

// ── 2 · bestimmeLernweg: fr NUR mit Schalter ────────────────────────────────

describe("2 · bestimmeLernweg - fr nur mit dem neuen Schalter", () => {
  it("ohne französischen Schalter: eine französische Bedienung verhält sich wie heute (⇒ Regel für 'alles ausser en')", () => {
    // ★ Ohne Schalter fällt bedienSprache „fr" durch zu Regel 3/4 - GENAU wie
    // jede andere nicht-englische Bedienung, unabhängig vom englischen Schalter.
    expect(
      bestimmeLernweg({ gespeichert: null, bedienSprache: "fr", lehrgangProbeAn: false }),
    ).toBe("de");
    expect(
      bestimmeLernweg({ gespeichert: null, bedienSprache: "fr", lehrgangProbeAn: true }),
    ).toBe("de");
    // Auch mit explizit AUSgeschaltetem Schalter dasselbe wie ohne Angabe.
    expect(
      bestimmeLernweg({
        gespeichert: null,
        bedienSprache: "fr",
        lehrgangProbeAn: true,
        franzoesischLehrgangProbeAn: false,
      }),
    ).toBe("de");
  });

  it("mit dem französischen Schalter an UND französischer Bedienung: fr", () => {
    expect(
      bestimmeLernweg({
        gespeichert: null,
        bedienSprache: "fr",
        lehrgangProbeAn: false,
        franzoesischLehrgangProbeAn: true,
      }),
    ).toBe("fr");
  });

  it("der französische Schalter allein macht aus de/en-Bedienung kein fr", () => {
    expect(
      bestimmeLernweg({
        gespeichert: null,
        bedienSprache: "de",
        lehrgangProbeAn: true,
        franzoesischLehrgangProbeAn: true,
      }),
    ).toBe("de");
    expect(
      bestimmeLernweg({
        gespeichert: null,
        bedienSprache: "en",
        lehrgangProbeAn: true,
        franzoesischLehrgangProbeAn: true,
      }),
    ).toBe("en");
  });

  it("ein gespeicherter Weg fr gewinnt immer (D2)", () => {
    expect(
      bestimmeLernweg({ gespeichert: "fr", bedienSprache: "de", lehrgangProbeAn: false }),
    ).toBe("fr");
  });
});

// ── 3 · Der Schalter ?franzoesisch-lehrgang=1/=0 ────────────────────────────

// ★ 28.09.2026 (Freigabe fr/es): Bis zur Freigabe stand hier „default AUS".
// Seither ist der Schalter gepolt wie der englische seit E10: default AN,
// `?franzoesisch-lehrgang=0` ist der Not-Aus und wird auf dem Gerät gemerkt.
describe("3 · der Schalter ?franzoesisch-lehrgang - ★ seit 28.09.2026 default AN, =0 ist der Not-Aus", () => {
  it("★ ohne Adresse und ohne Merker: AN (Freigabe 28.09.2026)", () => {
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_FR)).toBeNull();
    expect(franzoesischLehrgangProbeAn("")).toBe(true);
    // Nur ein gemerktes "0" schaltet aus - jeder andere Wert heisst an.
    localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "irgendwas");
    expect(franzoesischLehrgangProbeAn("")).toBe(true);
    localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "0");
    expect(franzoesischLehrgangProbeAn("")).toBe(false);
  });

  it("=1 schaltet an und merkt es; =0 schaltet wieder aus", () => {
    expect(franzoesischLehrgangProbeAn("?franzoesisch-lehrgang=1")).toBe(true);
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_FR)).toBe("1");
    expect(franzoesischLehrgangProbeAn("")).toBe(true);
    expect(franzoesischLehrgangProbeAn("?franzoesisch-lehrgang=0")).toBe(false);
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_FR)).toBe("0");
    expect(franzoesischLehrgangProbeAn("")).toBe(false);
  });

  it("★ gesperrter Speicher: kein Absturz - die Grundeinstellung (seit 28.09.2026: an) gilt einfach ungespeichert weiter", () => {
    const echt = window.localStorage;
    const kaputt = {
      getItem: () => {
        throw new Error("gesperrt");
      },
      setItem: () => {
        throw new Error("gesperrt");
      },
      removeItem: () => {
        throw new Error("gesperrt");
      },
    };
    Object.defineProperty(window, "localStorage", { value: kaputt, configurable: true });
    try {
      expect(franzoesischLehrgangProbeAn("")).toBe(true);
      // Der Not-Aus in der Adresse wirkt auch ohne Speicher.
      expect(franzoesischLehrgangProbeAn("?franzoesisch-lehrgang=0")).toBe(false);
    } finally {
      Object.defineProperty(window, "localStorage", { value: echt, configurable: true });
    }
  });

  it("der Merker zählt NICHT als „Gerät kennt Tastenflow“ (derselbe Grund wie beim englischen Schalter)", () => {
    expect(istTastenflowMerker(LEHRGANG_PROBE_MERKER_FR)).toBe(false);
  });
});

// ── 4 · Der Server-Wächter nimmt fr an (Ergänzung zu tastenflow-lernweg.test.ts) ─

function ladeWaechter() {
  const quelle = readFileSync(
    resolve(__dirname, "../pocketbase/pb_hooks/tt_pupils_field_guard.pb.js"),
    "utf8",
  );
  const angemeldet: ((e: unknown) => void)[] = [];
  new Function("onRecordUpdateRequest", quelle)((h: (e: unknown) => void) => angemeldet.push(h));
  return angemeldet[0];
}

type Felder = Record<string, unknown>;
function datensatz(id: string, felder: Felder) {
  const f: Felder = { ...felder };
  return {
    id,
    felder: f,
    get: (k: string) => f[k],
    set: (k: string, v: unknown) => {
      f[k] = v;
    },
    getString: (k: string) => {
      const v = f[k];
      return v == null ? "" : typeof v === "string" ? v : JSON.stringify(v);
    },
    getBool: (k: string) => !!f[k],
    getInt: (k: string) => Number(f[k] ?? 0),
  };
}

describe("4 · tt_pupils_field_guard: bedienSprache=fr wird angenommen", () => {
  it("bedienSprache fr bleibt stehen, Unsinn wird verworfen", () => {
    const handler = ladeWaechter();
    const stored = datensatz("k1", { bedienSprache: "de" });
    const record = datensatz("k1", { bedienSprache: "fr" });
    let weiter = false;
    handler({
      auth: { id: "k1", collection: () => ({ name: "tt_pupils" }) },
      record,
      app: { findRecordById: () => stored },
      next: () => {
        weiter = true;
      },
    });
    expect(weiter).toBe(true);
    expect(record.felder.bedienSprache).toBe("fr");
  });
});

// ── 5 · fr fällt nie still auf de zurück (Bauplan §2.3 Punkt 4) ─────────────

describe("5 · fr fällt bei den umgebauten Weichen nie still auf de zurück", () => {
  it("achteGrundtasteFuerLayout: fr verhält sich wie en auf de/ch-Tastaturen (nicht wie de)", () => {
    const order = ["a", "s", "d", "f", "j", "k", "l", ";"];
    const fr = achteGrundtasteFuerLayout(order, "fr", "de");
    const de = achteGrundtasteFuerLayout(order, "de", "de");
    expect(fr).not.toEqual(de);
    expect(fr[7]).toBe("ö");
  });

  it("homeKeyFor (fingers.ts): fr verhält sich wie en auf US-Tastatur (nicht wie de)", () => {
    const echt = window.localStorage.getItem("tippen-layout");
    window.localStorage.setItem("tippen-layout", "us");
    try {
      const kleinRechts = FINGERS["kleiner-rechts"];
      // ★ Vorher stand hier `lernweg !== "en"` (Falle Bauplan §15.1) - „fr"
      // hätte auf US-Tastatur still „ö" bekommen statt „;".
      expect(homeKeyFor(kleinRechts, "fr")).toBe(";");
      expect(homeKeyFor(kleinRechts, "en")).toBe(";");
      expect(homeKeyFor(kleinRechts, "de")).toBe("ö");
    } finally {
      if (echt === null) window.localStorage.removeItem("tippen-layout");
      else window.localStorage.setItem("tippen-layout", echt);
    }
  });

  it("lektionenFuer: fr liefert nicht die deutschen Lektionen", () => {
    expect(lektionenFuer("fr")).not.toEqual(lektionenFuer("de"));
  });

  it("introOrder/layoutLetterOrder: fr liefert eine andere Reihenfolge als de", () => {
    expect(introOrder("fr")).not.toEqual(introOrder("de"));
    expect(layoutLetterOrder("fr")).not.toEqual(layoutLetterOrder("de"));
  });

  it("stationGuessWords (Expedition): fr liefert einen anderen Wortvorrat als de", () => {
    const alleBuchstaben = "abcdefghijklmnopqrstuvwxyzäöüß".split("");
    const fr = stationGuessWords(alleBuchstaben, { lernweg: "fr", seed: 1 });
    const de = stationGuessWords(alleBuchstaben, { lernweg: "de", seed: 1 });
    expect(fr.length).toBeGreaterThan(0);
    expect(de.length).toBeGreaterThan(0);
    expect(fr).not.toEqual(de);
  });
});

describe("★ Anfänger beginnen auf JEDEM Weg mit den Fingerankern F und J (26.09.2026)", () => {
  it("die ersten zwei Einheiten sind f j - de, en und fr", () => {
    for (const weg of ["de", "en", "fr"] as const) {
      const erste = LERNWEGE[weg].letterOrder.slice(0, LERNWEGE[weg].initialLetters);
      expect(erste, weg).toEqual(["f", "j"]);
    }
  });

  // ★ G3a-SCHRIFT (25.10.2026, Falle 41 verallgemeinert): „F und J" heisst die Zeichen auf den Tasten mit den
  // Fühlmarken (KeyF/KeyJ) der Haupttastatur des Weges - auf Bulgarisch о т, auf Griechisch φ ξ, auf Ukrainisch а о.
  // Für die acht Wege bis zum 25.10.2026 bleibt es ausdrücklich f j (nicht abgeschwächt).
  it("JEDER Weg: die ersten Einheiten sind die Zeichen auf KeyF/KeyJ seiner Haupttastatur", () => {
    for (const weg of LERNWEGE_LISTE) {
      const erste = LERNWEGE[weg].letterOrder.slice(0, LERNWEGE[weg].initialLetters);
      expect(LERNWEGE[weg].initialLetters, weg).toBe(2);
      expect(erste, weg).toEqual([...heimZeichenDesWeges(weg)]);
      if (!istGeruestSprache(weg)) expect(erste, weg).toEqual(["f", "j"]);
    }
  });
});
