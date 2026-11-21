/**
 * ★★ WÄCHTER der Oberflächen-Sprache (Etappe N1, 01.09.2026).
 *
 * ── Der Anlass ─────────────────────────────────────────────────────────────
 * Entschieden am 31.08.2026 (Entwurf §1, Vorgaben G3 + G1 + G2):
 *
 *   G3 · Wo genau EINE Person gemeint ist, steht ihr Name.
 *        „Mia kann die Sprache wieder selbst wählen" statt „Schüler:in kann …".
 *   G1 · Wege und Überschriften nennen die TÄTIGKEIT, nicht die Rolle:
 *        „Klasse & Konten".
 *        ⚠️ AUSNAHME seit 01.09.2026: die ANMELDUNG. Sie fragt, WER kommt,
 *        nicht was er vorhat - „Lernende" / „Lehrkraft" statt „Üben" /
 *        „Unterrichten" (Johannes: „nicht üben und unterrichten sondern
 *        personenbezogen"). Der Wächter unten prüft die Umkehrung.
 *   G2 · Echte Sammelbegriffe heißen „Lernende".
 *
 * Der Grund ist gemessen und steht im Entwurf §1.2: „Schüler:innen" sind
 * 15 Zellen auf einer Braillezeile, und die Sprachausgabe liest den
 * Doppelpunkt je nach Programm mit („Schüler Doppelpunkt innen"). Was alle
 * ansprechen soll, klingt dann für die Kinder mit Blindheit am schlechtesten.
 *
 * ── ⚠️⚠️ Der Suchraum ist ABSICHTLICH eng ─────────────────────────────────
 * Geprüft werden NUR die Dateien der Tastenflow-Oberfläche und der geteilten
 * Lehrkraft-Oberfläche „Meine Klasse" (Liste unten). Zwei Grenzen, beide mit
 * Grund:
 *
 *  1. NIEMALS `src/lib/typing/corpus*` oder `serien*`. Dort ist „Der Lehrer
 *     fragt: Wo liegt der Atlantik?" ein Übungssatz und keine Oberfläche. Ein
 *     Wächter, der dort sucht, wird rot - und wer ihn dann grün macht, LÖSCHT
 *     INHALT. (Entwurf §1.4, [[feedback_gruener_waechter_beweist_was]])
 *
 *  2. Nicht die Oberflächen der anderen Programme (Punktgenau, Klangpunkte,
 *     Sehsimulation, Admin-Bereich). Dort steht „Schüler:innen" noch an sechs
 *     Stellen; sie zu ändern ist ein Sweep über fremde Apps und war in der
 *     Nacht vom 01.09. ausdrücklich nicht beauftragt. Wer diesen Wächter
 *     ausweitet, ändert Programme, die er gerade nicht vor sich hat.
 *
 * ── ⚠️⚠️⚠️ Was diese Grenze am 01.09. GEKOSTET hat ─────────────────────────
 * Der Suchraum war eine feste Liste aus `components/` und `features/` - und
 * genau darum grün. Beim Gegenlesen des AUSGELIEFERTEN Bündels, also nach dem
 * Deploy, lagen fünf sichtbare Texte in `src/lib/`: zweimal „Diese/n Schüler:in
 * gibt es nicht.", zweimal „Schüler:in konnte nicht angelegt/gelöscht werden."
 * und ein Namens-Rückfall in der Gesprächsliste der Lehrkraft.
 *
 * **Der Suchraum eines Wächters IST der Befund.** Grün hiess nur: in diesen 23
 * Dateien nichts. Darum wird `src/lib/typing/` und `src/lib/lernwerkstatt/`
 * jetzt BERECHNET statt aufgezählt - eine neue Datei ist damit von selbst
 * bewacht, und niemand muss daran denken, sie einzutragen.
 *
 * ── Warum Kommentare nicht zählen ──────────────────────────────────────────
 * In `src/lib/` stehen 40 weitere Fundstellen - alle in JSDoc-Kommentaren
 * („Die Lehrkraft legt je Schüler:in zwei Dinge fest"). Die liest kein Kind und
 * keine Braillezeile. Würden sie mitzählen, wäre der Wächter dauerhaft rot und
 * jemand würde ihn irgendwann stumm schalten. `ohneKommentare()` schneidet sie
 * heraus - zeichenweise und stringbewusst, damit JSX-Text und `https://…`
 * unberührt bleiben.
 *
 * ── Was NICHT beanstandet wird ─────────────────────────────────────────────
 * Das schlichte Wort „Schüler" in einem ZITAT (Johannes, Testerin aus Marburg)
 * oder in einem Bezeichner bleibt erlaubt. Beanstandet wird die
 * Doppelpunkt- und Schrägstrich-Form - genau die, gegen die §1.2 argumentiert.
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Die Dateien der Tastenflow-Oberfläche und der Lehrkraft-Oberfläche
 * „Meine Klasse". Eine Liste und kein Glob: ein Glob wächst unbemerkt in
 * fremde Programme hinein. Für `src/components/` und `src/features/` bleibt
 * das richtig - dort liegen die Oberflächen von SIEBEN Programmen nebeneinander.
 */
const OBERFLAECHE = [
  "src/components/typing/AdaptiveTrainer.tsx",
  "src/components/typing/LehrerHilfe.tsx",
  "src/components/typing/LevelTrend.tsx",
  "src/components/typing/PasswordControls.tsx",
  "src/components/typing/PupilSelfStats.tsx",
  "src/components/typing/PupilStatsPanel.tsx",
  "src/components/typing/StandZeile.tsx",
  "src/components/typing/TippenHilfe.tsx",
  "src/components/typing/TypingAuth.tsx",
  "src/components/typing/TypingSettings.tsx",
  // „TypingTrainer.tsx" (Übungsart „Lektionen") stand hier bis E7
  // (19.09.2026) - mit der Übungsart gelöscht, siehe `trainerMode.ts`.
  "src/components/typing/WeeklyGoalRings.tsx",
  "src/components/typing/WeeklyGoalStats.tsx",
  "src/components/lernwerkstatt/LwMessageBell.tsx",
  "src/components/lernwerkstatt/LwMessageThread.tsx",
  "src/components/lernwerkstatt/LwTeacherCompose.tsx",
  "src/components/lernwerkstatt/SchuelerAnmeldung.tsx",
  "src/components/lernwerkstatt/klasse/ClassTeachers.tsx",
  "src/components/lernwerkstatt/klasse/KlasseUndKinder.tsx",
  "src/components/lernwerkstatt/klasse/TastenflowReiter.tsx",
  // „UeberblickReiter.tsx" stand hier bis 09.09.2026 - der Reiter
  // „Überblick" ist ersatzlos entfallen (Entscheidung Johannes).
  "src/features/public/MeineKlassePage.tsx",
  "src/features/public/TippenTrainerPage.tsx",
];

/**
 * ★★ Die Bausteine hinter der Oberfläche - BERECHNET, nicht aufgezählt.
 *
 * `src/lib/typing/` und `src/lib/lernwerkstatt/` gehören ganz zu diesem Revier;
 * dort kann keine fremde App hineinwachsen. Darum darf hier gelesen statt
 * aufgezählt werden - und eine neue Datei ist von selbst bewacht.
 *
 * ⛔ AUSGENOMMEN bleiben `corpus*` und `serien*`: dort ist „Der Lehrer fragt:
 * Wo liegt der Atlantik?" ein ÜBUNGSSATZ. Ein Wächter, der dort rot wird,
 * verleitet zum Löschen von Inhalt. (Entwurf §1.4)
 */
function bausteine(ordner: string): string[] {
  const wurzel = new URL("../" + ordner, import.meta.url);
  return readdirSync(wurzel, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".ts"))
    .map((e) => e.name)
    .filter((n) => !/^(corpus|serien)/.test(n))
    .map((n) => ordner + n)
    .sort();
}

const BAUSTEINE = [
  ...bausteine("src/lib/typing/"),
  ...bausteine("src/lib/lernwerkstatt/"),
];

/** Alles, was ein Mensch zu sehen bekommt. */
const SUCHRAUM = [...OBERFLAECHE, ...BAUSTEINE];

/**
 * Schneidet Kommentare heraus und lässt alles andere an seinem Platz
 * (Kommentarzeichen werden durch Leerzeichen ersetzt, damit die Zeilennummern
 * im Befund stimmen).
 *
 * Zeichenweise und stringbewusst - sonst würde `"https://…"` als Zeilenkommentar
 * gelesen und der halbe Rest der Zeile verschwände aus der Prüfung.
 */
function ohneKommentare(text: string): string {
  const aus: string[] = [];
  let i = 0;
  let zustand: "code" | "'" | '"' | "`" | "//" | "/*" = "code";
  while (i < text.length) {
    const z = text[i];
    const zz = text.slice(i, i + 2);
    if (zustand === "code") {
      if (zz === "//") { zustand = "//"; aus.push("  "); i += 2; continue; }
      if (zz === "/*") { zustand = "/*"; aus.push("  "); i += 2; continue; }
      if (z === "'" || z === '"' || z === "`") zustand = z;
      aus.push(z);
    } else if (zustand === "//") {
      if (z === "\n") { zustand = "code"; aus.push(z); } else aus.push(" ");
    } else if (zustand === "/*") {
      if (zz === "*/") { zustand = "code"; aus.push("  "); i += 2; continue; }
      aus.push(z === "\n" ? z : " ");
    } else {
      // in einem String: Fluchtzeichen überspringen, Ende erkennen
      if (z === "\\") { aus.push(text.slice(i, i + 2)); i += 2; continue; }
      if (z === zustand) zustand = "code";
      aus.push(z);
    }
    i += 1;
  }
  return aus.join("");
}

/** Die Formen, gegen die §1.2 argumentiert - mit dem Ersatz dazu. */
const VERBOTEN: [RegExp, string][] = [
  [/Schüler:in(nen)?/g, 'Lernende (Sammelbegriff) oder der Name der Person (G3)'],
  [/Lehrer:in(nen)?/g, 'Lehrkraft bzw. Lehrkräfte'],
  [/Diese\/[rn]/g, 'der Name der Person (G3)'],
  [/Schüler\/-?innen/g, 'Lernende (Sammelbegriff)'],
  [/Kolleg:innen/g, 'Kolleginnen und Kollegen'],
];

function lies(pfad: string): string {
  return readFileSync(new URL("../" + pfad, import.meta.url), "utf8");
}

describe("★★ Oberflächen-Sprache: keine Doppelpunkt-Form (G3 + G1 + G2)", () => {
  it.each(SUCHRAUM)("%s ist frei von Doppelpunkt-Formen", (pfad) => {
    const text = ohneKommentare(lies(pfad));
    const funde: string[] = [];
    for (const [muster, ersatz] of VERBOTEN) {
      for (const treffer of text.matchAll(muster)) {
        const zeile = text.slice(0, treffer.index ?? 0).split("\n").length;
        funde.push(`${pfad}:${zeile} - ${treffer[0]} ⇒ ${ersatz}`);
      }
    }
    expect(funde, funde.join("\n")).toEqual([]);
  });

  it("★ die Übungsinhalte werden NICHT geprüft - dort ist das Wort Inhalt", () => {
    // Dieser Test hält die Grenze fest, statt sie nur zu kommentieren. Er ist
    // seit dem 01.09. mehr als eine Zusicherung: der Suchraum wird BERECHNET,
    // also prüft er ein Ergebnis und nicht mehr eine Liste, die jemand tippt.
    for (const pfad of SUCHRAUM) {
      expect(pfad).not.toMatch(/src\/lib\/typing\/(corpus|serien)/);
    }
  });

  it("★★ der Suchraum umfasst die Bausteine - grün darf nicht 'nirgends gesucht' heissen", () => {
    // Die Falle vom 01.09.: der Wächter war grün, weil er src/lib/ nie ansah.
    // Dieser Test misst den Suchraum selbst, nicht seinen Befund.
    expect(BAUSTEINE).toContain("src/lib/typing/account.ts");
    expect(BAUSTEINE).toContain("src/lib/typing/pbBackend.ts");
    expect(BAUSTEINE).toContain("src/lib/lernwerkstatt/messages.ts");
    // Und die Übungsinhalte sind wirklich draussen - es gibt sie ja.
    expect(BAUSTEINE.length).toBeGreaterThan(30);
    expect(BAUSTEINE.some((p) => p.includes("corpus"))).toBe(false);
    expect(BAUSTEINE.some((p) => p.includes("serien"))).toBe(false);
  });

  it("★★ ohneKommentare trifft die Grenze - Kommentar weg, Text und URL heil", () => {
    // Ohne diesen Test wäre der Filter selbst ungemessen - und ein Filter, der
    // zu viel wegschneidet, macht den Wächter still grün.
    expect(ohneKommentare('const a = "Schüler:in";')).toContain("Schüler:in");
    expect(ohneKommentare("// je Schüler:in einstellbar")).not.toContain("Schüler:in");
    // ⚠️ Als GANZER Block - eine " * …"-Zeile für sich allein ist kein
    // Kommentar, sondern eine Multiplikation. Der erste Anlauf dieses Tests
    // prüfte die Zeile isoliert und war rot, obwohl der Filter recht hatte.
    expect(
      ohneKommentare("/**\n * Die Lehrkraft legt je Schüler:in fest\n */"),
    ).not.toContain("Schüler:in");
    expect(ohneKommentare('x; // Schüler:in')).not.toContain("Schüler:in");
    expect(ohneKommentare("<p>Schüler:innen</p>")).toContain("Schüler:innen");
    // Ein // im String ist kein Kommentar:
    expect(ohneKommentare('const u = "https://x/Schüler:in";')).toContain("Schüler:in");
    // Zeilennummern bleiben erhalten:
    expect(ohneKommentare("a\n/* weg */\nb").split("\n").length).toBe(3);
  });

  it("★★ die ANMELDUNG fragt, WER kommt - nicht, was er tut (G1, Ausnahme vom 01.09.2026)", () => {
    // ⚠️ Das ist eine bewusste UMKEHRUNG. Bis zum 01.09. stand hier die
    // Gegenprobe: „die Anmeldung nennt die Tätigkeit, nicht die Rolle" - mit
    // „Üben" und „Unterrichten" als Beleg. Johannes am 01.09.2026: *„nicht
    // üben und unterrichten sondern personenbezogen"*.
    //
    // G1 (Wege und Überschriften nennen die Tätigkeit) gilt WEITER - für Wege
    // und Überschriften. Die Anmeldung ist keins von beidem: Sie fragt nicht,
    // was jemand vorhat, sondern wer er ist. Ein Kind wählt dort keine
    // Tätigkeit aus.
    //
    // Die beiden Wörter folgen G2 („echte Sammelbegriffe heissen Lernende")
    // und kommen aus der App selbst - „Lehrkraft" steht 76-mal im Quelltext.
    // Ein drittes Wortpaar hiesse, dass zwei Stellen dieselbe Person
    // verschieden nennen.
    const auth = lies("src/components/typing/TypingAuth.tsx");
    // ★ EN2 (19.09.2026, englische Bedienung): Die zwei Wörter stehen seither
    // in der Texttabelle NEBEN dem Bauteil (`texte({ de, en })`), nicht mehr als
    // JSX-Text im Knopf. Geprüft wird darum die deutsche Spalte - und dass die
    // beiden Reiter genau diese Schlüssel zeigen. Die Absicht bleibt: WER
    // kommt, nicht was er tut (englisch *Learner | Teacher*, Glossar §3.8).
    expect(auth).toContain('    lernende: "Lernende",');
    expect(auth).toContain('    lehrkraft: "Lehrkraft",');
    expect(auth).toContain("          {t.lernende}\n        </button>");
    expect(auth).toContain("          {t.lehrkraft}\n        </button>");
    // Und die Tätigkeits-Fassung ist wirklich weg, nicht nur überdeckt.
    expect(auth).not.toMatch(/"Üben"|"Unterrichten"/);
    expect(auth).not.toContain("          Üben\n        </button>");
    expect(auth).not.toContain("          Unterrichten\n        </button>");
  });

  /*
    ★ B8/B10 (11.09.2026): Die Sprach-Sperre steht nicht mehr je KIND, sondern
    an der KLASSE („Einstellungen der Klasse"). Der Satz nennt darum jetzt
    genau die Gruppe, um die es wirklich geht - „die Kinder dieser Klasse" -,
    und nicht mehr einen Namen, den die Einstellung gar nicht mehr betrifft.
    Die Absicht der Regel (G3: sagen, WEN es angeht) ist unverändert; sie wird
    hier nur an der neuen Stelle geprüft.
  */
  it("★ die Sprach-Sperre sagt, wen sie betrifft: die Kinder dieser Klasse (G3)", () => {
    const reiter = lies("src/components/lernwerkstatt/klasse/TastenflowReiter.tsx");
    // ★ 11.09.2026 (Nacht): Die Felder der Klasse sind EIN Bauteil für
    // „Einstellungen der Klasse" UND „Neue Klasse anlegen" - der Satz steht
    // seither dort, wörtlich unverändert.
    const felder = lies("src/components/typing/KlassenEinstellungsFelder.tsx");
    expect(felder).toContain(
      "Die Kinder dieser Klasse können die Sprache wieder selbst wählen",
    );
    expect(reiter).toContain("KlassenEinstellungsFelder");
    // Und es gibt keine zweite Sperre je Kind mehr.
    expect(reiter).not.toContain("${pupil.name} kann die Sprache wieder selbst wählen");
  });
});
