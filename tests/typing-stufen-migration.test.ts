/**
 * Wächter für den Umbau auf DREI Altersstufen (Charge S1, 15.08.2026).
 *
 * Bauplan `Sensorik/BAUPLAN-2026-08-14-TASTENFLOW-DREI-STUFEN-UND-INHALT.md`
 * §0.2 + §0b.2/§0b.3, Skizze `SKIZZE-2026-08-15-TASTENFLOW-S1-STUFEN-MIGRATION.md`
 * §5 Schritte 1 und 2.
 *
 * Was hier festgenagelt wird — und warum:
 *
 *  1. **Jeder ALTE Konto-Wert liest sich richtig.** a → kids, b → teens,
 *     c → teens, erwachsen → erwachsen. Gespeicherte Konten (localStorage-Blobs
 *     und das PocketBase-Textfeld) tragen die alten Werte noch monatelang.
 *  2. **Die Serviermenge schrumpft NIE.** Das ist die eigentliche Gefahr des
 *     Umbaus: Ein Kind, das gestern 1208 Zeilen hatte, darf heute nicht 810
 *     haben, bloß weil sein Etikett gewandert ist. Gemessen wird nicht am
 *     Mapping, sondern am wirklich servierten Bestand (Korpus, Serien, Stränge).
 *  3. **Das Geburtsjahr leitet ab und wächst mit** — inklusive der Grenzfälle
 *     10/11 und 15/16, an denen sich die Stufe ändert.
 *  4. **Das Vorrangmodell:** eine ausdrücklich gewählte Stufe schlägt das
 *     Geburtsjahr, das Geburtsjahr schlägt die Vorgabe.
 *
 * Die INHALTE bleiben in dieser Charge mit a/b/c/erwachsen etikettiert (der
 * redaktionelle Retag ist Charge S3) — deshalb prüfen die Mengen-Tests gegen
 * `contentStufenFor`, nicht gegen die Tags selbst.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  ALT_ETIKETTEN,
  INHALTS_STUFEN,
  STUFEN,

  STUFE_LABELS,
  VORGABE_STUFE,
  addPupil,
  alterImJahr,
  createClass,
  contentStufenFor,
  geburtsjahrAusText,
  getAccount,
  istPlausiblesGeburtsjahr,
  migriereStufe,
  setGeburtsjahr,
  setStufe,
  stufeAusGeburtsjahr,
  stufeFuer,
  type InhaltsStufe,
  type Stufe,
} from "../src/lib/typing/account";
import { CORPUS, CORPUS_EN, corpusItemsFor } from "../src/lib/typing/corpus";
import { SERIEN, serienForStufe } from "../src/lib/typing/serien";
import { ARCS, arcsFor } from "../src/lib/typing/arcs";
import { INTRO_PODCASTS, introPodcastFuerStufe } from "../src/lib/typing/podcastsTippen";
import { skinForStufe } from "../src/lib/typing/skin";
import { TIER_CHARS } from "../src/lib/typing/tiers";

/** Alle Zeichen bis einschließlich Tier `t` — der Tastenstand eines Kindes. */
function allowedUpTo(tier: number): Set<string> {
  const s = new Set<string>();
  for (let t = 0; t <= tier; t++) for (const c of TIER_CHARS[t] ?? []) s.add(c);
  return s;
}

/** Die Übersetzung, die Bauplan §4 S1 vorschreibt. */
const MIGRATION: Record<(typeof ALT_ETIKETTEN)[number], Stufe> = {
  a: "kids",
  b: "teens",
  c: "teens",
  erwachsen: "erwachsen",
};

describe("S1 · Lese-Übersetzung der alten Konto-Werte", () => {
  it("übersetzt jeden alten Wert nach Bauplan §4", () => {
    for (const alt of ALT_ETIKETTEN) {
      expect(migriereStufe(alt), `alter Wert »${alt}«`).toBe(MIGRATION[alt]);
    }
  });

  it("lässt die neuen Werte unverändert durch", () => {
    for (const neu of STUFEN) expect(migriereStufe(neu)).toBe(neu);
  });

  it("macht aus Leerem und Unbekanntem KEINEN Ersatzwert", () => {
    // Wichtig fürs Vorrangmodell: ein automatisch eingesetzter Vorgabewert wäre
    // von einer echten Wahl nicht zu unterscheiden und schaltete das
    // Geburtsjahr für immer stumm.
    for (const roh of ["", undefined, null, "d", 7, {}])
      expect(migriereStufe(roh), String(roh)).toBeUndefined();
  });

  it("ist stabil: zweimal übersetzen ändert nichts mehr", () => {
    for (const alt of ALT_ETIKETTEN) {
      const einmal = migriereStufe(alt)!;
      expect(migriereStufe(einmal)).toBe(einmal);
    }
  });

  it("wählbar sind genau drei Stufen, alle mit Beschriftung ohne Halbgeviertstrich", () => {
    expect(STUFEN).toEqual(["kids", "teens", "erwachsen"]);
    expect(STUFE_LABELS.kids).toBe("7-10 Jahre");
    expect(STUFE_LABELS.teens).toBe("11-15 Jahre");
    expect(STUFE_LABELS.erwachsen).toBe("ab 16 Jahren");
    for (const s of STUFEN)
      expect(/[–—]/.test(STUFE_LABELS[s]), `»${STUFE_LABELS[s]}«`).toBe(false);
  });

  it("die Vorgabe (auch für anonyme Besucher) ist teens", () => {
    expect(VORGABE_STUFE).toBe("teens");
    expect(stufeFuer(null)).toBe("teens");
    expect(stufeFuer({})).toBe("teens");
  });

  it("bildet die Profile ab: kids = kind, teens = jugend", () => {
    expect(skinForStufe("kids")).toBe("kind");
    expect(skinForStufe("teens")).toBe("jugend");
    expect(skinForStufe("erwachsen")).toBe("erwachsen");
  });
});

describe("S1 · Konto-Stufe → Inhalts-Etiketten", () => {
  it("serviert jede Stufe aus GENAU ihrem eigenen Etikett", () => {
    // Seit S3 Phase 3: Inhalts-Etikett und Konto-Stufe sind dasselbe.
    expect(contentStufenFor("kids")).toEqual(["kids"]);
    expect(contentStufenFor("teens")).toEqual(["teens"]);
    expect(contentStufenFor("erwachsen")).toEqual(["erwachsen"]);
  });

  it("KERNREGEL: ein alter Konto-Wert landet dort, wo die Migration ihn hinschickt", () => {
    for (const alt of ALT_ETIKETTEN) {
      const neu = migriereStufe(alt)!;
      expect(
        contentStufenFor(alt),
        `»${alt}« serviert etwas anderes als »${neu}«`,
      ).toEqual(contentStufenFor(neu));
    }
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * S3 · Inhalts-Etikett und Konto-Stufe sind dasselbe geworden
 * ──────────────────────────────────────────────────────────────────────────*/

describe("S3 · die Servier-Abbildung ist die Identität", () => {
  /**
   * Genau das Prädikat, mit dem `corpus.corpusItemsFor`, `serien.serienForStufe`,
   * `arcs.arcsFor` und `podcastsTippen.introPodcastFuerStufe` filtern. Es hier
   * nachzubauen ist Absicht: die Tabelle darunter prüft ALLE Tag-Formen.
   */
  const serviert = (stufen: InhaltsStufe[], stufe: Stufe): boolean =>
    contentStufenFor(stufe).some((e) => stufen.includes(e));

  /** Tag-Satz → wer ihn sehen darf. Seit Phase 3 ohne Überschneidung. */
  const TAFEL: { tags: InhaltsStufe[]; kids: boolean; teens: boolean; erw: boolean }[] = [
    { tags: ["kids"], kids: true, teens: false, erw: false },
    { tags: ["teens"], kids: false, teens: true, erw: false },
    { tags: ["erwachsen"], kids: false, teens: false, erw: true },
    { tags: ["kids", "teens"], kids: true, teens: true, erw: false },
    { tags: ["teens", "erwachsen"], kids: false, teens: true, erw: true },
    { tags: ["kids", "teens", "erwachsen"], kids: true, teens: true, erw: true },
  ];

  for (const zeile of TAFEL) {
    it(`»${zeile.tags.join("+")}« → kids ${zeile.kids}, teens ${zeile.teens}, erwachsen ${zeile.erw}`, () => {
      expect(serviert(zeile.tags, "kids")).toBe(zeile.kids);
      expect(serviert(zeile.tags, "teens")).toBe(zeile.teens);
      expect(serviert(zeile.tags, "erwachsen")).toBe(zeile.erw);
    });
  }

  it("jede Stufe sieht GENAU ihr eigenes Etikett", () => {
    for (const stufe of STUFEN) expect(contentStufenFor(stufe)).toEqual([stufe]);
  });

  it("kein Etikett fällt durch: jedes findet genau einen Abnehmer", () => {
    for (const etikett of INHALTS_STUFEN) {
      const abnehmer = STUFEN.filter((s) => serviert([etikett], s));
      expect(abnehmer, `Etikett »${etikett}«`).toEqual([etikett]);
    }
  });

  it("ein Konto mit ALTEM Wert sitzt trotzdem nie vor einer leeren Textwelt", () => {
    // Der Fall: ein gespeichertes Konto kommt an migriereStufe vorbei herein
    // (etwa aus einem PocketBase-Feld, das ein Skript geschrieben hat).
    // contentStufenFor bildet dieselbe Übersetzung ab wie die Migration.
    const allowed = allowedUpTo(5);
    for (const alt of ALT_ETIKETTEN) {
      const neu = migriereStufe(alt)!;
      expect(contentStufenFor(alt), `»${alt}«`).toEqual(contentStufenFor(neu));
      for (const lang of ["de", "en"] as const) {
        const n = corpusItemsFor({ lernweg: "de", stufe: alt, allowed, lang }).length;
        expect(n, `${lang}: Konto mit »${alt}« bekommt nur ${n} Zeilen`).toBeGreaterThan(100);
      }
    }
  });

  it("KEIN Inhalt trägt mehr ein altes Etikett (Korpus, Serien, Stränge, Podcasts)", () => {
    // Der Abschluss-Wächter der Charge S3: Nach der Redaktion darf a/b/c in
    // KEINEM stufen-Array mehr vorkommen. `erwachsen` ist KEIN Alt-Wert - es
    // hat den Umbau unverändert überlebt und ist eines der drei neuen
    // Etiketten. Grundmengen werden ausgegeben (Regel 12) - ein leerer
    // Treffer soll nie wie ein Erfolg aussehen.
    const alt = new Set<string>(ALT_ETIKETTEN.filter((e) => e !== "erwachsen"));
    const funde: string[] = [];
    for (const [name, liste] of [
      ["Korpus DE", CORPUS.map((e) => ({ id: e.text, stufen: e.stufen }))],
      ["Korpus EN", CORPUS_EN.map((e) => ({ id: e.text, stufen: e.stufen }))],
      ["Serien", SERIEN.map((s) => ({ id: s.slug, stufen: s.stufen }))],
      ["Stränge", ARCS.map((a) => ({ id: a.id, stufen: a.stufen }))],
      ["Podcasts", INTRO_PODCASTS.map((p) => ({ id: p.id, stufen: [...p.stufen] }))],
    ] as const) {
      for (const e of liste)
        for (const s of e.stufen) if (alt.has(s)) funde.push(`${name}: ${e.id} [${s}]`);
    }
    console.log(
      `[drei-stufen] geprüft: ${CORPUS.length} DE + ${CORPUS_EN.length} EN Einträge, ` +
        `${SERIEN.length} Serien, ${ARCS.length} Stränge, ${INTRO_PODCASTS.length} Podcasts`,
    );
    expect(funde.slice(0, 10)).toEqual([]);
  });

  it("auch im QUELLTEXT steht kein altes Etikett mehr in einem stufen-Array", () => {
    // Der Objekt-Wächter oben sieht nur, was auch exportiert wird. Dieser hier
    // liest die Dateien selbst - er fände auch eine tote Konstante
    // (`const A: Stufe[] = ["a"]`), die niemand mehr benutzt, und die
    // Schlüssel der Wortschatz-Tabellen.
    const ordner = resolve(__dirname, "../src/lib/typing");
    const dateien = readdirSync(ordner).filter((f) => f.endsWith(".ts"));
    const muster = [
      /stufen:\s*\[[^\]]*"(?:a|b|c)"/,
      /Stufe\[\]\s*=\s*\[[^\]]*"(?:a|b|c)"/,
    ];
    const funde: string[] = [];
    for (const datei of dateien) {
      const zeilen = readFileSync(resolve(ordner, datei), "utf8").split("\n");
      zeilen.forEach((z, i) => {
        if (muster.some((m) => m.test(z))) funde.push(`${datei}:${i + 1}  ${z.trim()}`);
      });
    }
    console.log(`[drei-stufen] Quelltext-Sweep über ${dateien.length} Dateien`);
    expect(funde.slice(0, 10)).toEqual([]);
  });
});

describe("S1 · Wächter: die Serviermenge schrumpft nie", () => {
  const TIERS = [0, 1, 2, 3, 4, 5];

  for (const lang of ["de", "en"] as const) {
    for (const alt of ALT_ETIKETTEN) {
      const neu = migriereStufe(alt)!;
      it(`${lang}/${alt} → ${neu}: Korpus je Tastenstand mindestens so viel wie vorher`, () => {
        for (const tier of TIERS) {
          const allowed = allowedUpTo(tier);
          const vorher = corpusItemsFor({ lernweg: "de", stufe: alt, allowed, lang });
          const nachher = corpusItemsFor({ lernweg: "de", stufe: neu, allowed, lang });
          expect(
            nachher.length,
            `${lang}/${alt}→${neu} T${tier}: ${nachher.length} < ${vorher.length}`,
          ).toBeGreaterThanOrEqual(vorher.length);
          // Nicht nur die ZAHL: jede einzelne alte Zeile muss weiter kommen.
          const jetzt = new Set(nachher);
          const fehlend = vorher.filter((z) => !jetzt.has(z));
          expect(fehlend.slice(0, 3), `${lang}/${alt}→${neu} T${tier}`).toEqual([]);
        }
      });

      it(`${lang}/${alt} → ${neu}: Bücherei behält jede Serie`, () => {
        const vorher = serienForStufe(alt, lang, "de").map((s) => s.slug);
        const nachher = new Set(serienForStufe(neu, lang, "de").map((s) => s.slug));
        expect(vorher.filter((s) => !nachher.has(s))).toEqual([]);
        expect(nachher.size).toBeGreaterThanOrEqual(vorher.length);
      });

      it(`${lang}/${alt} → ${neu}: Themenstränge bleiben erhalten`, () => {
        const vorher = arcsFor(alt, lang, "de").map((a) => a.id);
        const nachher = new Set(arcsFor(neu, lang, "de").map((a) => a.id));
        expect(vorher.filter((a) => !nachher.has(a))).toEqual([]);
      });
    }
  }

  it("jede neue Stufe hat in beiden Sprachen echten Bestand", () => {
    for (const lang of ["de", "en"] as const) {
      for (const stufe of STUFEN) {
        const n = corpusItemsFor({ lernweg: "de", stufe, allowed: allowedUpTo(5), lang }).length;
        expect(n, `${lang}/${stufe}: nur ${n} Zeilen`).toBeGreaterThan(100);
      }
    }
  });

  it("jede neue Stufe bekommt eine Einführungs-Folge", () => {
    for (const stufe of STUFEN)
      expect(introPodcastFuerStufe(stufe), stufe).toBeDefined();
    // kids bekommt die Kinder-Folge, teens die Schüler-Folge.
    expect(introPodcastFuerStufe("kids")?.id).toBe("tf-intro-kinder");
    expect(introPodcastFuerStufe("teens")?.id).toBe("tf-intro-schueler");
    expect(introPodcastFuerStufe("erwachsen")?.id).toBe("tf-intro-erwachsene");
  });
});

describe("S1 · Geburtsjahr: Ableitung und Grenzfälle", () => {
  /** 1. Juli des Jahres — die Rechnung kennt nur das Jahr, der Tag ist egal. */
  const imJahr = (jahr: number) => new Date(`${jahr}-07-01T12:00:00Z`).getTime();

  it("rechnet das Alter, das jemand in DIESEM Kalenderjahr erreicht", () => {
    expect(alterImJahr(2016, imJahr(2026))).toBe(10);
    expect(alterImJahr(2016, imJahr(2027))).toBe(11);
  });

  it("Grenzfall 10/11: mit 10 noch kids, mit 11 schon teens", () => {
    expect(stufeAusGeburtsjahr(2016, imJahr(2026))).toBe("kids"); // wird 10
    expect(stufeAusGeburtsjahr(2015, imJahr(2026))).toBe("teens"); // wird 11
  });

  it("Grenzfall 15/16: mit 15 noch teens, mit 16 erwachsen", () => {
    expect(stufeAusGeburtsjahr(2011, imJahr(2026))).toBe("teens"); // wird 15
    expect(stufeAusGeburtsjahr(2010, imJahr(2026))).toBe("erwachsen"); // wird 16
  });

  it("wächst mit: dasselbe Kind wandert zum Jahreswechsel weiter", () => {
    const kind = { geburtsjahr: 2016 };
    expect(stufeFuer(kind, imJahr(2026))).toBe("kids"); // 10
    expect(stufeFuer(kind, imJahr(2027))).toBe("teens"); // 11
    expect(stufeFuer(kind, imJahr(2032))).toBe("erwachsen"); // 16
  });

  it("weist unplausible Jahreszahlen ab (Tippfehler bleiben folgenlos)", () => {
    expect(stufeAusGeburtsjahr(2062, imJahr(2026))).toBeNull(); // Zukunft
    expect(stufeAusGeburtsjahr(2025, imJahr(2026))).toBeNull(); // Säugling
    expect(stufeAusGeburtsjahr(1800, imJahr(2026))).toBeNull(); // zu alt
    expect(stufeAusGeburtsjahr("2016", imJahr(2026))).toBeNull(); // kein number
    expect(stufeAusGeburtsjahr(undefined, imJahr(2026))).toBeNull();
    expect(istPlausiblesGeburtsjahr(2016, imJahr(2026))).toBe(true);
  });

  it("liest halb getippte Felder als »nichts angegeben«", () => {
    expect(geburtsjahrAusText("", imJahr(2026))).toBeUndefined();
    expect(geburtsjahrAusText("20", imJahr(2026))).toBeUndefined();
    expect(geburtsjahrAusText("abc", imJahr(2026))).toBeUndefined();
    expect(geburtsjahrAusText(" 2016 ", imJahr(2026))).toBe(2016);
  });
});

describe("S1 · Vorrangmodell Stufe vor Geburtsjahr", () => {
  const jetzt = new Date("2026-07-01T12:00:00Z").getTime();

  it("eine ausdrücklich gewählte Stufe übersteuert das Geburtsjahr", () => {
    expect(stufeFuer({ stufe: "erwachsen", geburtsjahr: 2016 }, jetzt)).toBe(
      "erwachsen",
    );
    expect(stufeFuer({ stufe: "kids", geburtsjahr: 1990 }, jetzt)).toBe("kids");
  });

  it("ohne Wahl entscheidet das Geburtsjahr", () => {
    expect(stufeFuer({ geburtsjahr: 2016 }, jetzt)).toBe("kids");
  });

  it("ohne beides gilt die Vorgabe", () => {
    expect(stufeFuer({ geburtsjahr: 2099 }, jetzt)).toBe(VORGABE_STUFE);
    expect(stufeFuer({ stufe: undefined }, jetzt)).toBe(VORGABE_STUFE);
  });

  it("ein migrierter Alt-Wert zählt als ausdrückliche Wahl", () => {
    // Bestandskonten haben eine Stufe — sie behalten sie, bis jemand sie ändert.
    const alt = { stufe: migriereStufe("a"), geburtsjahr: 1990 };
    expect(stufeFuer(alt, jetzt)).toBe("kids");
  });
});

describe("S1 · Der lokale Speicher trägt das Modell mit", () => {
  beforeEach(() => localStorage.clear());

  it("ein Kind MIT Geburtsjahr bekommt KEINE feste Stufe", () => {
    const cls = createClass("le1", "3b");
    expect(cls.ok).toBe(true);
    const p = addPupil(
      cls.ok ? cls.value.code : "",
      "Mia",
      "1234",
      undefined,
      undefined,
      undefined,
      2017,
    );
    expect(p.ok).toBe(true);
    const acc = p.ok ? getAccount(p.value.id)! : null;
    expect(acc?.geburtsjahr).toBe(2017);
    expect(acc?.stufe).toBeUndefined();
  });

  it("ohne Geburtsjahr steht die Vorgabe im Konto", () => {
    const cls = createClass("le1", "3b");
    const p = addPupil(cls.ok ? cls.value.code : "", "Nik", "1234");
    const acc = p.ok ? getAccount(p.value.id)! : null;
    expect(acc?.stufe).toBe(VORGABE_STUFE);
    expect(acc?.geburtsjahr).toBeUndefined();
  });

  it("ein nachgetragenes Geburtsjahr räumt die gewählte Stufe weg", () => {
    const cls = createClass("le1", "3b");
    const p = addPupil(cls.ok ? cls.value.code : "", "Ida", "1234");
    const id = p.ok ? p.value.id : "";
    setStufe(id, "erwachsen");
    expect(getAccount(id)?.stufe).toBe("erwachsen");
    setGeburtsjahr(id, 2017);
    // Sonst bliebe die Wahl vorrangig und die Eingabe wäre eine Attrappe.
    expect(getAccount(id)?.stufe).toBeUndefined();
    expect(getAccount(id)?.geburtsjahr).toBe(2017);
    // Unplausibles löscht das Jahr wieder — die Vorgabe greift.
    setGeburtsjahr(id, 2099);
    expect(getAccount(id)?.geburtsjahr).toBeUndefined();
    expect(stufeFuer(getAccount(id))).toBe(VORGABE_STUFE);
  });

  it("gespeicherte ALTE Werte werden beim Laden übersetzt", () => {
    const cls = createClass("le1", "3b");
    const p = addPupil(cls.ok ? cls.value.code : "", "Tom", "1234");
    const id = p.ok ? p.value.id : "";
    // Von Hand einen Bestandsstand schreiben, wie ihn ein Browser von gestern hat.
    const roh = JSON.parse(localStorage.getItem("tippen-trainer:store:v1")!);
    roh.accounts[id].stufe = "a";
    localStorage.setItem("tippen-trainer:store:v1", JSON.stringify(roh));
    expect(getAccount(id)?.stufe).toBe("kids");
  });
});
