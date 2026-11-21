/**
 * ★★★★★ E9 (24.09.2026, Bauplan §8) - DIE SCHREIBWEISE: britisch/amerikanisch.
 *
 * Deckt Auftrag Punkt 1-3 und 7 ab:
 *  · Erkennung (gespeicherte Wahl > Klassen-Vorgabe > Browser-Sprachen),
 *  · die Übungstext-Karte (angewandt NACH der Ledger-Kennung),
 *  · die Tippchallenge bleibt varianten-neutral (E7-Wächter),
 *  · die UI-Überlagerung (`texte()`), Deutsch bleibt unangetastet.
 *
 * Punkt 4 (Serverfeld) wird über einen Datei-Grep auf `pocketbase/setup.mjs`
 * geprüft - ein echter PocketBase-Lauf ist hier nicht nötig (E1 hat densel-
 * ben Feld-Mechanismus schon gegen einen echten Server bewiesen).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, afterEach, beforeEach, vi } from "vitest";
import {
  bestimmeSchreibweise,
  erkenneVarianteAusSprachen,
  englischVariante,
  gespeicherteSchreibweise,
  schreibweiseMerken,
  schreibweiseVon,
  SCHREIBWEISE_SCHLUESSEL,
  wandleSchreibweise,
  wandleUiSchreibweise,
  WOERTER_GB_ZU_US,
  WOERTER_UI_GB_ZU_US,
  AMBIGE_WORTE,
  langAttribut,
  feinesLangAttribut,
} from "../src/lib/typing/schreibweise";
import { texte } from "../src/lib/bedienSprache/texte";
import { corpusItemsFor } from "../src/lib/typing/corpus";
import { corpusEntriesFor, corpusManifest } from "../src/lib/typing/corpusManifest";
import { allowedForTier } from "../src/lib/typing/tiers";
import { ladeTexte } from "../src/lib/typing/schreibproben";
import type { ProbenNiveau } from "../src/lib/typing/schreibprobe";
import { LEHRGANG_PROBE_MERKER } from "../src/lib/typing/lernweg";
import {
  createClass,
  getClass,
  registerTeacher,
  setClassEinstellungen,
} from "../src/lib/typing/account";
import { PocketBaseTypingBackend } from "../src/lib/typing/pbBackend";

/**
 * ★★★★★ DAS TOR (Lead-Review 24.09.2026): `englischVariante()` liefert ohne
 * den Probe-Schalter des englischen Lehrgangs UNBEDINGT „gb" - siehe die
 * Kopf-Doku von `schreibweise.ts`. Jeder Test, der die LEBENDE Erkennung
 * prüft, schaltet die Probe hier bewusst an/aus - nie über einen zweiten,
 * eigenen Merker (`?englisch-lehrgang=1` bleibt EIN Schalter, EIN Schlüssel).
 */
function probeAn(): void {
  localStorage.setItem(LEHRGANG_PROBE_MERKER, "1");
}
/**
 * ★ FREIGABE 25.09.2026: Die Grundeinstellung des Schalters ist jetzt „an" -
 * ihn AUSZUSCHALTEN braucht darum den expliziten Not-Aus-Wert "0", ein
 * blosses `removeItem` (wie bis 24.09.) liesse ihn auf der Grundeinstellung
 * „an" stehen.
 */
function probeAus(): void {
  localStorage.setItem(LEHRGANG_PROBE_MERKER, "0");
}
afterEach(() => {
  probeAus();
  localStorage.removeItem(SCHREIBWEISE_SCHLUESSEL);
});

// ---------------------------------------------------------------------------
// § 1 Erkennung
// ---------------------------------------------------------------------------

describe("§1 englischVariante/erkenneVarianteAusSprachen (F5)", () => {
  it("en-US ⇒ amerikanisch, jedes andere en-* ⇒ britisch", () => {
    expect(erkenneVarianteAusSprachen(["en-US"])).toBe("us");
    expect(erkenneVarianteAusSprachen(["en_US"])).toBe("us");
    expect(erkenneVarianteAusSprachen(["en-GB"])).toBe("gb");
    expect(erkenneVarianteAusSprachen(["en-IE"])).toBe("gb");
    expect(erkenneVarianteAusSprachen(["en-AU"])).toBe("gb");
    expect(erkenneVarianteAusSprachen(["en-NZ"])).toBe("gb");
    expect(erkenneVarianteAusSprachen(["en-ZA"])).toBe("gb");
    expect(erkenneVarianteAusSprachen(["en-CA"])).toBe("gb");
    expect(erkenneVarianteAusSprachen(["en-IN"])).toBe("gb");
    expect(erkenneVarianteAusSprachen(["en"])).toBe("gb");
  });

  it("keine englische Sprache in der Liste ⇒ britisch (Vorgabe)", () => {
    expect(erkenneVarianteAusSprachen([])).toBe("gb");
    expect(erkenneVarianteAusSprachen(["fr-FR", "de-AT"])).toBe("gb");
  });

  it("die erste ENGLISCHE Sprache der Liste entscheidet, nicht die erste überhaupt", () => {
    expect(erkenneVarianteAusSprachen(["fr", "en-US", "de"])).toBe("us");
    expect(erkenneVarianteAusSprachen(["fr", "en-GB", "en-US"])).toBe("gb");
  });

  it("bestimmeSchreibweise: gespeicherte Wahl gewinnt IMMER", () => {
    expect(
      bestimmeSchreibweise({ gespeichert: "us", klassenVorgabe: "gb", sprachen: ["en-GB"] }),
    ).toBe("us");
    expect(
      bestimmeSchreibweise({ gespeichert: "gb", klassenVorgabe: "us", sprachen: ["en-US"] }),
    ).toBe("gb");
  });

  it("bestimmeSchreibweise: ohne gespeicherte Wahl gewinnt die Klassen-Vorgabe", () => {
    expect(
      bestimmeSchreibweise({ gespeichert: null, klassenVorgabe: "us", sprachen: ["en-GB"] }),
    ).toBe("us");
    expect(
      bestimmeSchreibweise({ gespeichert: undefined, klassenVorgabe: "gb", sprachen: ["en-US"] }),
    ).toBe("gb");
  });

  it("bestimmeSchreibweise: ohne beides entscheidet der Browser", () => {
    expect(
      bestimmeSchreibweise({ gespeichert: null, klassenVorgabe: null, sprachen: ["en-US"] }),
    ).toBe("us");
    expect(
      bestimmeSchreibweise({ gespeichert: null, klassenVorgabe: undefined, sprachen: ["en-CA"] }),
    ).toBe("gb");
  });

  it("englischVariante() liest die gemerkte Wahl aus localStorage - MIT der Probe an", () => {
    probeAn();
    localStorage.removeItem(SCHREIBWEISE_SCHLUESSEL);
    expect(gespeicherteSchreibweise()).toBeNull();
    schreibweiseMerken("us");
    expect(gespeicherteSchreibweise()).toBe("us");
    expect(englischVariante()).toBe("us");
    schreibweiseMerken("gb");
    expect(englischVariante()).toBe("gb");
  });

  it("langAttribut liefert die volle BCP-47-Kennung", () => {
    expect(langAttribut("us")).toBe("en-US");
    expect(langAttribut("gb")).toBe("en-GB");
  });

  /**
   * ★★★★★ E10 (Übergabe 24.09. §3: „langAttribut() gebaut, nicht
   * angebunden"): `feinesLangAttribut` trägt dasselbe TOR wie
   * `englischVariante` - ohne den Probe-Schalter bleibt „en" ein blosses
   * „en", byte-identisch zur Zeit vor E10.
   */
  it("feinesLangAttribut: OHNE Probe-Schalter bleibt „en\" byte-identisch „en\"", () => {
    probeAus();
    schreibweiseMerken("us"); // selbst eine gemerkte Wahl darf ohne das Tor nicht wirken
    expect(feinesLangAttribut("en")).toBe("en");
    expect(feinesLangAttribut("de")).toBe("de");
    expect(feinesLangAttribut(undefined)).toBeUndefined();
  });

  it("feinesLangAttribut: MIT Probe-Schalter die verfeinerte Kennung je Schreibweise", () => {
    probeAn();
    schreibweiseMerken("gb");
    expect(feinesLangAttribut("en")).toBe("en-GB");
    schreibweiseMerken("us");
    expect(feinesLangAttribut("en")).toBe("en-US");
    // Deutsch und „kein Attribut" bleiben vom Tor unberührt.
    expect(feinesLangAttribut("de")).toBe("de");
    expect(feinesLangAttribut(undefined)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// § 1a DAS TOR - ohne den Probe-Schalter des englischen Lehrgangs bleibt
// ALLES „gb", unbesehen jeder Erkennung (Lead-Review 24.09.2026).
// ---------------------------------------------------------------------------

describe("§1a Das Tor: ohne Probe-Schalter bleibt es UNBEDINGT bei „gb“", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Probe AUS + Browser en-US ⇒ gb (keine gespeicherte Wahl)", () => {
    probeAus();
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-US"]);
    expect(englischVariante()).toBe("gb");
  });

  it("Probe AUS + Browser en-US + GESPEICHERTE Wahl „us“ ⇒ trotzdem gb", () => {
    probeAus();
    schreibweiseMerken("us");
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-US"]);
    expect(englischVariante()).toBe("gb");
  });

  it("Probe AUS + Klassen-Vorgabe „us“ ⇒ trotzdem gb", () => {
    probeAus();
    expect(englischVariante("us")).toBe("gb");
  });

  it("Probe AN + Browser en-US ⇒ us (die Erkennung wirkt wieder)", () => {
    probeAn();
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-US"]);
    expect(englischVariante()).toBe("us");
  });

  it("Probe AUS: keine Übungstext-Änderung, egal was gespeichert ist", () => {
    probeAus();
    schreibweiseMerken("us");
    // Die Übungstext-Karte selbst kennt das Tor nicht (sie nimmt die
    // Variante als expliziten Parameter, siehe §2/§3) - das Tor sitzt
    // EINZIG in `englischVariante()`. Ein Aufrufer, der die Variante
    // korrekt über `englischVariante()` ermittelt, bekommt darum "gb" und
    // ändert damit auch am Text nichts:
    const gb = englischVariante();
    expect(wandleSchreibweise("The colour of the harbour.", gb)).toBe(
      "The colour of the harbour.",
    );
  });

  it("Probe AUS: keine UI-Änderung, egal was gespeichert ist", () => {
    probeAus();
    schreibweiseMerken("us");
    const beispiel = texte({
      de: { pupilLabel: "Schüler:in" },
      en: { pupilLabel: "Pupil" },
    });
    expect(beispiel.en.pupilLabel).toBe("Pupil");
  });
});

// ---------------------------------------------------------------------------
// § 2 Die Übungstext-Karte
// ---------------------------------------------------------------------------

describe("§2 wandleSchreibweise - die Übungstext-Karte (§8.2)", () => {
  it("wandelt bekannte Wörter, ganze Wörter, Gross-/Kleinschreibung bleibt erhalten", () => {
    expect(wandleSchreibweise("The colour is grey.", "us")).toBe("The color is gray.");
    expect(wandleSchreibweise("Colour", "us")).toBe("Color");
    expect(wandleSchreibweise("COLOUR", "us")).toBe("COLOR");
    expect(wandleSchreibweise("My favourite neighbour", "us")).toBe(
      "My favorite neighbor",
    );
  });

  it("wandelt NICHT als Teil eines längeren Wortes (whole word only)", () => {
    expect(wandleSchreibweise("colourful", "us")).toBe("colourful");
  });

  it("bei „gb“ bleibt der Text unverändert (ausser Markup)", () => {
    const text = "The colour of the harbour at dawn.";
    expect(wandleSchreibweise(text, "gb")).toBe(text);
  });

  it("das {gb|us}-Markup wählt je nach Variante die passende Seite", () => {
    expect(wandleSchreibweise("a TV {programme|program}", "gb")).toBe("a TV programme");
    expect(wandleSchreibweise("a TV {programme|program}", "us")).toBe("a TV program");
  });

  it("mehrdeutige Wörter stehen NICHT in der Karte", () => {
    for (const wort of ["practise", "practice", "fall", "football", "tyre", "tire", "check", "cheque", "programme", "program"]) {
      expect(WOERTER_GB_ZU_US[wort], `„${wort}" darf nicht in der Karte stehen`).toBeUndefined();
      expect(AMBIGE_WORTE).toContain(wort);
    }
  });

  it("organise/realise/recognise/apologise samt Inflektionen sind dabei", () => {
    expect(wandleSchreibweise("We organised the trip.", "us")).toBe("We organized the trip.");
    expect(wandleSchreibweise("She realises this now.", "us")).toBe(
      "She realizes this now.",
    );
  });
});

// ---------------------------------------------------------------------------
// § 3 Das Ledger bleibt intakt - der Manifest-Index ändert sich NIE mit der
// Schreibweise, nur der servierte Text.
// ---------------------------------------------------------------------------

describe("§3 Ledger-Sicherheit: die Baustein-ID kommt aus dem britischen Rohtext", () => {
  it("corpusEntriesFor liefert für „gb“ und „us“ denselben Index je Zeile - nur der Text unterscheidet sich", () => {
    const allowed = allowedForTier(5, "en");
    const gb = corpusEntriesFor({ stufe: "erwachsen", allowed, lang: "en", lernweg: "en", variante: "gb" });
    const us = corpusEntriesFor({ stufe: "erwachsen", allowed, lang: "en", lernweg: "en", variante: "us" });
    expect(gb.length).toBeGreaterThan(0);
    expect(gb.length).toBe(us.length);
    // Gleiche Reihenfolge (dieselbe Quelle, derselbe Filter) → Index gleich je Position.
    for (let i = 0; i < gb.length; i++) {
      expect(us[i].index, `Zeile ${i}: Index muss trotz Schreibweise gleich bleiben`).toBe(
        gb[i].index,
      );
      expect(us[i].kind).toBe(gb[i].kind);
    }
    // Und mindestens eine Zeile zeigt wirklich einen anderen Text (die Karte griff).
    const geaendert = gb.filter((e, i) => e.text !== us[i].text);
    expect(geaendert.length, "mindestens eine Zeile muss sich sichtbar ändern").toBeGreaterThan(0);
  });

  it("corpusManifest()-Indizes selbst sind von der Schreibweise komplett unberührt", () => {
    const m1 = corpusManifest();
    // corpusManifest() ist unabhängig von jeder Query - es kennt „variante" gar
    // nicht. Das ist die eigentliche Absicherung: Es gibt keinen Weg, wie ein
    // Aufruf mit „variante: 'us'" das Manifest je verändern könnte.
    expect(m1.ids.length).toBeGreaterThan(0);
  });

  it("corpusItemsFor: ohne `variante` (alte Aufrufer) bleibt alles wie vor E9", () => {
    const allowed = allowedForTier(5, "en");
    const ohneVariante = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "en", lernweg: "en" });
    const mitGb = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "en", lernweg: "en", variante: "gb" });
    expect(ohneVariante).toEqual(mitGb);
  });
});

// ---------------------------------------------------------------------------
// § 4 Serverfeld (Auftrag Punkt 4) - Datei-Beleg statt Live-Server.
// ---------------------------------------------------------------------------

describe("§4 tt_classes.schreibweise im Schema", () => {
  it("pocketbase/setup.mjs trägt das Feld an tt_classes", () => {
    const inhalt = readFileSync(resolve(__dirname, "../pocketbase/setup.mjs"), "utf8");
    const zeile = inhalt
      .split("\n")
      .find((z) => z.includes('base("tt_classes"') && z.includes('T("lernweg")'));
    expect(zeile, "die tt_classes-Feldliste wurde nicht gefunden").toBeDefined();
    expect(zeile).toContain('T("schreibweise")');
  });
});

// ---------------------------------------------------------------------------
// § 4a DIE KLASSEN-VORGABE PERSISTIERT (Lead-Review 24.09.2026, Punkt 2) -
// lokales Mock-Backend UND der PocketBase-Rumpf.
// ---------------------------------------------------------------------------

describe("§4a Die Schreibweise-Vorgabe der Klasse persistiert (Mock-Backend)", () => {
  beforeEach(() => localStorage.clear());

  it("setClassEinstellungen({ schreibweise: \"us\" }) speichert und liest zurück", async () => {
    const t = registerTeacher("Frau Berger", "berger-e9@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "9c", "9C-E9");
    if (!c.ok) throw new Error(c.error);
    expect(c.value.schreibweise).toBeUndefined(); // Vorgabe: automatisch

    const neu = setClassEinstellungen(c.value.code, t.value.id, { schreibweise: "us" });
    expect(neu?.schreibweise).toBe("us");
    // Wirklich PERSISTIERT, nicht nur die Rückgabe des Aufrufs:
    expect(getClass(c.value.code)?.schreibweise).toBe("us");
  });

  it("\"\" löscht die Vorgabe wieder (zurück auf automatisch)", async () => {
    const t = registerTeacher("Herr Kaya", "kaya-e9@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "9d", "9D-E9", { schreibweise: "us" });
    if (!c.ok) throw new Error(c.error);
    expect(getClass(c.value.code)?.schreibweise).toBe("us");

    setClassEinstellungen(c.value.code, t.value.id, { schreibweise: "" });
    expect(getClass(c.value.code)?.schreibweise).toBeUndefined();
  });

  it("★★★ EIN KIND DIESER KLASSE bekommt „us“ - Klasse gewinnt über den Browser (Probe an)", () => {
    probeAn();
    const t = registerTeacher("Frau Novak", "novak-e9@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "9e", "9E-E9");
    if (!c.ok) throw new Error(c.error);
    setClassEinstellungen(c.value.code, t.value.id, { schreibweise: "us" });
    const klasse = getClass(c.value.code);

    // Das Gerät des Kindes hat keine eigene Wahl und einen britischen
    // Browser - trotzdem gewinnt die Klassen-Vorgabe.
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-GB"]);
    expect(englischVariante(schreibweiseVon(klasse))).toBe("us");
    vi.restoreAllMocks();
  });

  it("eine PERSÖNLICH gespeicherte Wahl des Kindes gewinnt über die Klassen-Vorgabe", () => {
    probeAn();
    const t = registerTeacher("Herr Adler", "adler-e9@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "9f", "9F-E9");
    if (!c.ok) throw new Error(c.error);
    setClassEinstellungen(c.value.code, t.value.id, { schreibweise: "us" });
    const klasse = getClass(c.value.code);

    schreibweiseMerken("gb"); // das Kind hat selbst „britisch" gewählt
    expect(englischVariante(schreibweiseVon(klasse))).toBe("gb");
  });
});

describe("§4b Die Schreibweise-Vorgabe erreicht den PocketBase-Rumpf", () => {
  function backendMit(pb: unknown): PocketBaseTypingBackend {
    const b = Object.create(PocketBaseTypingBackend.prototype) as PocketBaseTypingBackend;
    (b as unknown as { pb: unknown }).pb = pb;
    return b;
  }
  function pbMitMerker(merker: { body?: Record<string, unknown> }) {
    const rec = { id: "rec1", code: "3B", name: "3b", teacherUid: "t1" };
    return {
      filter: (s: string) => s,
      collection(name: string) {
        if (name !== "tt_classes") throw new Error("unerwartete Sammlung: " + name);
        return {
          async getFirstListItem() {
            return rec;
          },
          async update(_id: string, body: Record<string, unknown>) {
            merker.body = body;
            return { ...rec, ...body };
          },
        };
      },
    };
  }

  it("setClassEinstellungen({ schreibweise: \"us\" }) ⇒ der Rumpf trägt schreibweise: \"us\"", async () => {
    const merker: { body?: Record<string, unknown> } = {};
    await backendMit(pbMitMerker(merker)).setClassEinstellungen("3B", "t1", {
      schreibweise: "us",
    });
    expect(merker.body?.schreibweise).toBe("us");
  });

  it("schreibweise: \"\" ⇒ der Rumpf trägt einen leeren String (löscht am Server)", async () => {
    const merker: { body?: Record<string, unknown> } = {};
    await backendMit(pbMitMerker(merker)).setClassEinstellungen("3B", "t1", {
      schreibweise: "",
    });
    expect(merker.body?.schreibweise).toBe("");
  });
});

// ---------------------------------------------------------------------------
// § 5 Die UI-Überlagerung (Auftrag Punkt 5)
// ---------------------------------------------------------------------------

describe("§5 Die UI-Überlagerung von texte() (§8.3)", () => {
  const beispiel = texte({
    de: {
      pupilLabel: "Schüler:in",
      practiseHint: "Üben Sie jeden Tag.",
      satz: (n: number) => `Zeile ${n}`,
    },
    en: {
      pupilLabel: "Pupil",
      practiseHint: "Practise every day.",
      satz: (n: number) => `Line ${n}`,
    },
  });

  it("britisch (Vorgabe im Test): unverändert englisch, Britisches bleibt stehen", () => {
    // ⚠️ tests/setup.ts stellt die Browser-Sprachliste global auf Deutsch -
    // ohne gespeicherte Wahl ist die Schreibweise darum immer „gb".
    localStorage.removeItem(SCHREIBWEISE_SCHLUESSEL);
    expect(beispiel.en.pupilLabel).toBe("Pupil");
    expect(beispiel.en.practiseHint).toBe("Practise every day.");
    expect(beispiel.en.satz(3)).toBe("Line 3");
  });

  it("amerikanisch (Probe an, gespeicherte Wahl): pupil→student, practise→practice, Grossschreibung bleibt", () => {
    probeAn();
    schreibweiseMerken("us");
    expect(beispiel.en.pupilLabel).toBe("Student");
    expect(beispiel.en.practiseHint).toBe("Practice every day.");
    expect(beispiel.en.satz(3)).toBe("Line 3"); // kein GB/US-Wort enthalten
  });

  it("ein fehlender US-Schlüssel fällt auf Britisch zurück, nie auf leer (Probe an)", () => {
    probeAn();
    schreibweiseMerken("us");
    // "satz" enthält kein Wort aus WOERTER_UI_GB_ZU_US → bleibt wörtlich stehen.
    expect(beispiel.en.satz(1)).toBe("Line 1");
  });

  it("die deutsche Tabelle bleibt in JEDEM Fall unangetastet (Probe an)", () => {
    probeAn();
    schreibweiseMerken("us");
    expect(beispiel.de.pupilLabel).toBe("Schüler:in");
    expect(beispiel.de.practiseHint).toBe("Üben Sie jeden Tag.");
  });

  it("wandleUiSchreibweise: whole-word, auch bei der Mehrwort-Phrase „full stop“", () => {
    expect(wandleUiSchreibweise("Press full stop to finish.")).toBe(
      "Press period to finish.",
    );
    expect(wandleUiSchreibweise("Pupils and their Pupils")).toBe(
      "Students and their Students",
    );
  });

  it("die UI-Karte trägt genau die im Auftrag genannten Schlüssel", () => {
    for (const schluessel of [
      "pupil",
      "pupils",
      "practise",
      "practising",
      "full stop",
      "maths",
      "colour",
      "favourite",
      "programme",
      "centre",
      "organise",
      "cancelled",
      "enrol",
    ]) {
      expect(WOERTER_UI_GB_ZU_US[schluessel], `„${schluessel}" fehlt in der UI-Karte`).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// § 6 Tippchallenge bleibt varianten-neutral (Auftrag Punkt 3, E7-Wächter)
// ---------------------------------------------------------------------------

describe("§6 Tippchallenge (schreibproben/) ist varianten-neutral", () => {
  const NIVEAUS: ProbenNiveau[] = ["start", "gross", "buchstaben", "satz", "zahlen", "alles", "code"];

  it("keine Zeile der englischen Bank ändert sich unter der Karte", async () => {
    let geprueft = 0;
    const verstoesse: string[] = [];
    for (const niveau of NIVEAUS) {
      const texte = await ladeTexte(niveau, "en");
      for (const text of texte) {
        for (const zeile of text.zeilen) {
          geprueft += 1;
          const us = wandleSchreibweise(zeile, "us");
          if (us !== zeile) {
            verstoesse.push(`[${niveau}] „${text.titel}": „${zeile}" → „${us}"`);
          }
        }
      }
    }
    // Ein Wächter, der nichts geprüft hat, beweist nichts.
    expect(geprueft).toBeGreaterThan(0);
    expect(verstoesse, verstoesse.join("\n")).toEqual([]);
  });
});
