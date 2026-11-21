/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „tr" (TR-S, 09.10.2026). Modell: `tests/tastenflow-lektionen-it.test.ts`.
 * Geprüft auf der Pflicht-Tastatur `tr-q` (Windows „Türkçe Q" / Mac „Turkish - QWERTY - PC"); die Reihenfolge-Regel
 * zusätzlich auf `tr-f` (nur mit Schalter) und auf einer fremden Tastatur (`de`), auf der türkische Buchstaben fehlen:
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("tr")` - jede Einheit hat ihre Lektion, keine Lektion greift vor.
 *  2. Eigene Lektionen für Shift, Nokta und virgül, noktasız ı, den Apostroph, die Totaste `^`, w x q, ? !.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen; Klammern und Anführungszeichen paarweise.
 *  4. Kein deutsches, englisches, französisches, spanisches oder italienisches Wort in Titeln und Einführungen; kein
 *     Maus-Wort, kein „kör yazım", kein Halbgeviertstrich, kein typografischer Apostroph.
 *  5. Jedes Beispielwort (zwischen geraden Anführungszeichen) ist an der Stelle seiner Lektion tippbar - i und ı sind
 *     zwei Buchstaben; `â î û` brauchen die Totaste `^` UND den Vokal.
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (Shift, Alt Gr, ölü tuş, Lage zur Grundstellung); die Tasten
 *     tragen ihre Kappe über das Gebietsschema `tr` (İ für die i-Taste, I für die ı-Taste).
 *
 * Mit Gegenproben.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import {
  introducedThroughLesson,
  lektionenFuer,
  lessonById,
  lessonIntroText,
  shiftUnlockedAt,
  unlockedKeysAt,
  unlockedKeysWith,
  type Lesson,
} from "../src/lib/typing/curriculum";
import { TR_LEKTIONS_IDS, trLektionsVorspannFuer } from "../src/lib/typing/curriculumTr";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { generateRound } from "../src/lib/typing/generator";
import { CORPUS_TR } from "../src/lib/typing/corpusTr";
import { fitText } from "../src/lib/typing/corpus";
import { isRealWord } from "../src/lib/typing/lexicon";
import { STUFE_VOCAB_TR, WORDS_TR } from "../src/lib/typing/wordsTr";

const TR_TASTATUREN: readonly LayoutId[] = ["tr-q"];

afterEach(() => setLayout("de"));

function einheiten(l: Lesson): string[] {
  return l.enablesShift ? [SHIFT_UNIT, ...l.newKeys] : [...l.newKeys];
}

function folgtDerReihenfolge(lektionen: readonly Lesson[], reihenfolge: readonly string[]): string[] {
  const fehler: string[] = [];
  let i = 0;
  for (const l of lektionen)
    for (const u of einheiten(l)) {
      if (reihenfolge[i] !== u) fehler.push(`${l.id}: „${u}" an Stelle ${i + 1}, dran wäre „${reihenfolge[i]}"`);
      i += 1;
    }
  if (i !== reihenfolge.length) fehler.push(`${i} Einheiten in den Lektionen, ${reihenfolge.length} in der Reihenfolge`);
  return fehler;
}

/**
 * Auf `tr-q` ist jeder türkische Buchstabe eine eigene Einheit; `â î û` entstehen über die Totaste `^` UND den Vokal.
 * Gross-/Kleinschreibung nur türkisch (`İ ⇒ i`, `I ⇒ ı`), nie `toLowerCase()` ohne Sprache.
 */
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  for (const ch of wort) {
    if (ch === " ") continue;
    const c = ch.toLocaleLowerCase("tr");
    if (stand.has(c)) continue;
    const mitTotaste: Record<string, string> = { â: "a", î: "i", û: "u" };
    if (mitTotaste[c] && stand.has("^") && stand.has(mitTotaste[c])) continue;
    return false;
  }
  return ch0Gross(wort) ? stand.has(SHIFT_UNIT) : true;
}
function ch0Gross(wort: string): boolean {
  return [...wort].some((c) => c !== c.toLocaleLowerCase("tr"));
}

/** Die Beispielwörter zwischen geraden Anführungszeichen - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1]).filter((w) => /\p{L}/u.test(w));
}

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „tr“ - auf jeder Tastatur", () => {
  for (const t of [...TR_TASTATUREN, "tr-f", "de"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("tr")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer("tr"), introOrder("tr"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("tr-q");
    const falsch = lektionenFuer("tr").map((l) => (l.id === "tr-sik-1" ? { ...l, newKeys: ["i", "r"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("tr")).length).toBeGreaterThan(0);
  });

  it("24 Lektionen auf jeder Tastatur, IDs mit „tr-“, eindeutig, gecacht", () => {
    expect(TR_LEKTIONS_IDS).toHaveLength(24);
    expect(new Set(TR_LEKTIONS_IDS).size).toBe(24);
    for (const id of TR_LEKTIONS_IDS) expect(id.startsWith("tr-")).toBe(true);
    for (const t of [...TR_TASTATUREN, "tr-f"] as const) {
      setLayout(t);
      expect(lektionenFuer("tr").map((l) => l.id), t).toEqual([...TR_LEKTIONS_IDS]);
      expect(lektionenFuer("tr")).toBe(lektionenFuer("tr"));
    }
  });

  it("die acht Grundtasten, die Gruppen der häufigen Buchstaben und die letzten Buchstaben", () => {
    setLayout("tr-q");
    expect(lessonById("tr-temel-1")?.newKeys).toEqual(["f", "j"]);
    expect(lessonById("tr-temel-4")?.newKeys).toEqual(["a", "ş"]);
    expect(lessonById("tr-sik-1")?.newKeys).toEqual(["e", "i"]);
    expect(lessonById("tr-sik-4")?.newKeys).toEqual(["ı", "t"]);
    expect(lessonById("tr-sik-5")?.newKeys).toEqual(["y", "o", "u"]);
    expect(lessonById("tr-zch")?.newKeys).toEqual(["z", "ç", "h"]);
    expect(lessonById("tr-gg")?.newKeys).toEqual(["g", "ğ"]);
    expect(lessonById("tr-uv")?.newKeys).toEqual(["ü", "v"]);
    expect(lessonById("tr-pco")?.newKeys).toEqual(["p", "c", "ö"]);
    expect(lessonById("tr-wxq")?.newKeys).toEqual(["w", "x", "q"]);
  });

  it("eigene Lektionen: Shift, . ,, Apostroph, Totaste ^, ? !, Zeichen und Sonderzeichen", () => {
    setLayout("tr-q");
    expect(lessonById("tr-buyuk")?.enablesShift).toBe(true);
    expect(lessonById("tr-nokta-virgul")?.newKeys).toEqual([".", ","]);
    expect(lessonById("tr-kesme")?.newKeys).toEqual(["'"]);
    expect(lessonById("tr-sapka")?.newKeys).toEqual(["^"]);
    expect(lessonById("tr-soru")?.newKeys).toEqual(["?", "!"]);
    expect(lessonById("tr-noktalama")?.newKeys).toEqual([":", '"', ";", "-", "(", ")"]);
    expect(lessonById("tr-simge-1")?.newKeys).toEqual(["%", "&", "/", "+", "*", "=", "_", ">", "<", "$"]);
    expect(lessonById("tr-simge-2")?.newKeys).toEqual(["@", "#", "[", "]", "{", "}", "\\", "|", "€", "₺", "½"]);
    expect(shiftUnlockedAt("tr-sik-5")).toBe(false);
    expect(shiftUnlockedAt("tr-buyuk")).toBe(true);
    for (const l of lektionenFuer("tr")) expect(new Set(unlockedKeysWith(l.id, undefined, "tr"))).toEqual(new Set(unlockedKeysAt(l.id)));
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of TR_TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("tr")) {
        stand = introducedThroughLesson(stand, l.id, "tr");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "tr").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "tr", lang: "tr", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) if (!z.text.trim() || fitText(z.text, erlaubt, "tr") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
        }
      }
      expect(fehler).toEqual([]);
    });
  }
});

/** Ein halbes Paar: ( ohne ), ) ohne (, eine ungerade Zahl gerader Anführungszeichen. */
function halbesPaar(zeile: string): boolean {
  let offen = 0;
  for (const c of zeile) {
    if (c === "(") offen += 1;
    else if (c === ")") {
      if (offen === 0) return true;
      offen -= 1;
    }
  }
  return offen !== 0 || (zeile.match(/"/g)?.length ?? 0) % 2 === 1;
}

describe("★★★ Klammern und Anführungszeichen immer als Paar - auf dem Weg durch die Lektionen", () => {
  for (const t of TR_TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      setLayout(t);
      const funde: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("tr")) {
        stand = introducedThroughLesson(stand, l.id, "tr");
        for (const stufe of ["kids", "teens", "erwachsen"] as const)
          for (let k = 0; k < 3; k++)
            for (const z of generateRound(l.id, { lernweg: "tr", lang: "tr", introduced: stand, stufe, count: 10 }))
              if (halbesPaar(z.text)) funde.push(`${l.id}/${stufe}: „${z.text}"`);
      }
      expect(funde).toEqual([]);
    });
  }

  it('Gegenprobe: „kelime( ev“, „(ev“ und „dedi "merhaba“ fallen auf, „(ev) ve "merhaba"“ nicht', () => {
    expect(["kelime( ev", "(ev", 'dedi "merhaba', '(ev) ve "merhaba"'].filter(halbesPaar)).toEqual(["kelime( ev", "(ev", 'dedi "merhaba']);
  });
});

const TR_WOERTER = new Set<string>([
  ...WORDS_TR,
  ...Object.values(STUFE_VOCAB_TR).flat(),
  ...CORPUS_TR.flatMap((c) => c.text.toLocaleLowerCase("tr").split(/[^\p{L}]+/u).filter(Boolean)),
]);
/**
 * Zwei gewollte Ausnahmen der Übungszeilen: der Vorname „Ali" (Tatoeba-Platzhalter, in den Lexika anderer Sprachen ein Wort)
 * und die Endung einer E-Mail-Adresse „com" (Sonderzeichen-Lektionen). Beide sind kein fremdes Wort im Sinn des Wächters.
 */
// ★ 28.10.2026: „sami" - der türkische Vorname aus `sami'nin` (wordsTr.ts); der Test zerlegt an der Apostrophe, und „sami" steht
//   dann in einer fremden Wortliste. Der Test war dadurch zufällig rot, je nachdem, ob die gewürfelte Zeile den Namen traf.
const GEWOLLT = new Set(["ali", "com", "sami"]);
function fremdesWort(wort: string): boolean {
  const w = wort.toLocaleLowerCase("tr");
  if (w.length < 3 || GEWOLLT.has(w) || TR_WOERTER.has(w) || isRealWord(w, "tr")) return false;
  return isRealWord(w, "de") || isRealWord(w, "en") || isRealWord(w, "fr") || isRealWord(w, "es") || isRealWord(w, "it");
}

/** Häufige Wörter der Lektionstexte anderer Wege, die im Türkischen nie vorkommen. */
const NIE = new Set([
  "und", "der", "die", "mit", "ist", "nicht", "taste", "tasten", "finger", "zeigefinger", "reihe", "grundreihe",
  "umschalttaste", "links", "rechts", "the", "and", "with", "key", "keys", "row", "press", "hold", "left", "right", "your",
  "touche", "doigt", "rangée", "avec", "gauche", "droite", "clavier", "tecla", "dedo", "izquierda", "derecha", "teclado",
  "tasto", "dito", "riga", "tastiera", "sinistra", "destra", "mignolo", "maiusc",
]);

describe("★★★ Kein Deutsch, Englisch, Französisch, Spanisch oder Italienisch; Hausregeln", () => {
  it("Titel und Einführungen: keine fremden Wörter, kein Maus-Wort, kein „kör yazım“, kein – —, kein typografischer Apostroph", () => {
    const funde: string[] = [];
    for (const t of [...TR_TASTATUREN, "tr-f"] as const) {
      setLayout(t);
      for (const l of lektionenFuer("tr"))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          if (/[äß–—’“”…]/.test(text)) funde.push(`${t} ${l.id} ${feld}: Zeichen`);
          if (/tıkla|tıklayın|sürükle|dokun|\bfare\b|\bmouse\b|kör yazım|kör çocuk|özürlü|sakat|görme engelli/i.test(text))
            funde.push(`${t} ${l.id} ${feld}: Hausregel`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLocaleLowerCase("tr"))) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("keine Endung an Platzhaltern: kein ${…}, kein Wort wie „Tastenflow'a“ in den Texten", () => {
    setLayout("tr-q");
    const funde = lektionenFuer("tr").filter((l) => /\$\{|Tastenflow'/.test(l.intro) || /\$\{/.test(l.title));
    expect(funde.map((l) => l.id)).toEqual([]);
  });

  it("Übungszeilen einer Runde je Lektion: kein deutsches, englisches, französisches, spanisches oder italienisches Wort", () => {
    setLayout("tr-q");
    const funde = new Set<string>();
    let stand: string[] | undefined;
    for (const l of lektionenFuer("tr")) {
      stand = introducedThroughLesson(stand, l.id, "tr");
      for (const stufe of ["kids", "teens", "erwachsen"] as const)
        for (const z of generateRound(l.id, { lernweg: "tr", lang: "tr", introduced: stand, stufe, count: 10 })) {
          if (z.art === "unsinn") continue; // Übungssilben sind Kunstwörter
          for (const w of z.text.split(/[^\p{L}]+/u).filter(Boolean)) if (fremdesWort(w)) funde.add(`${l.id}: ${w}`);
        }
    }
    expect([...funde]).toEqual([]);
  }, 120_000); // ★ allein 7-27 s gemessen (10.10.), unter Volllast sonst Zeitüberschreitung

  it("Gegenprobe: eine deutsche, eine englische Zeile und Hausregeln fallen auf", () => {
    expect("Der Hund und die Katze spielen".split(" ").filter(fremdesWort).length).toBeGreaterThan(1);
    expect("The children play with their friends".split(" ").filter(fremdesWort).length).toBeGreaterThan(1);
    expect(/tıkla|tıklayın/i.test("Düğmeye tıkla")).toBe(true);
    expect(/kör yazım/i.test("kör yazım öğren")).toBe(true);
    expect(/[–—’]/.test("Ali’nin")).toBe(true);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("tr-q");
    expect(lektionenFuer("tr").flatMap((l) => beispielWoerter(trLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(100);
  });

  for (const t of TR_TASTATUREN) {
    it(`${t}: jedes Wort zwischen Anführungszeichen passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer("tr")) {
        const stand = new Set(unlockedKeysAt(l.id));
        if (shiftUnlockedAt(l.id)) stand.add(SHIFT_UNIT);
        for (const w of beispielWoerter(trLektionsVorspannFuer(l.id, l.newKeys))) if (!wortTippbar(w, stand)) fehler.push(`${l.id}: "${w}"`);
      }
      expect(fehler).toEqual([]);
    });
  }

  it("jedes Beispielwort ist ein türkisches Wort (Vorlese-Lexikon) oder ein Name mit/ohne Kesme - kein Tippfehler", () => {
    setLayout("tr-q");
    const NAMEN = new Set(["Ali", "Ayşe", "Elif", "Emre", "Ankara", "Adana", "Bursa", "Konya", "Mersin", "Tokat", "İlker", "Işıl"]);
    // „ilik" (Gegenstück zu „ılık") steht seit dem Lexikon-Nachtrag 10.10.2026 im Vorlese-Lexikon; die Ausnahme ist leer.
    const NUR_NICHT_IM_LEXIKON = new Set<string>([]);
    const unbekannt: string[] = [];
    for (const l of lektionenFuer("tr"))
      for (const w of beispielWoerter(trLektionsVorspannFuer(l.id, l.newKeys))) {
        const ohneKesme = w.split("'")[0];
        if (NAMEN.has(ohneKesme) || /^[A-ZİÇĞÖŞÜ]/.test(w) || NUR_NICHT_IM_LEXIKON.has(w)) continue;
        if (!w.split("-").every((x) => isRealWord(x, "tr"))) unbekannt.push(`${l.id}: ${w}`);
      }
    // Was das Lexikon nicht kennt, steht hier mit Grund: Zeichenfolgen mit ? ! oder Satzanfang, Fremdwörter (web/wifi).
    expect(unbekannt).toEqual([]);
    // Die Ausnahme veraltet nicht still: kennt das Lexikon das Wort einmal, muss sie hier weg.
    expect([...NUR_NICHT_IM_LEXIKON].filter((w) => isRealWord(w, "tr"))).toEqual([]);
  });

  it("Gegenprobe: ein Wort mit einer späteren Taste, ein Grossbuchstabe vor Shift und ein â ohne Totaste fallen auf", () => {
    setLayout("tr-q");
    expect(wortTippbar("Ankara", new Set(unlockedKeysAt("tr-sik-5")))).toBe(false); // Shift fehlt
    expect(wortTippbar("deniz", new Set(unlockedKeysAt("tr-sik-5")))).toBe(false); // z fehlt
    expect(wortTippbar("deniz", new Set(unlockedKeysAt("tr-zch")))).toBe(true);
    expect(wortTippbar("hâlâ", new Set(unlockedKeysAt("tr-pco")))).toBe(false); // ^ fehlt
    expect(wortTippbar("hâlâ", new Set(unlockedKeysAt("tr-sapka")))).toBe(true);
    expect(wortTippbar("Işıl", new Set([...unlockedKeysAt("tr-buyuk"), SHIFT_UNIT]))).toBe(true);
    expect(wortTippbar("ılık", new Set(unlockedKeysAt("tr-sik-3")))).toBe(false); // ı fehlt
    expect(wortTippbar("ilik", new Set(unlockedKeysAt("tr-sik-3")))).toBe(true);
  });
});

describe("★★ Griffe je Tastatur (gerechnet, nicht geschrieben)", () => {
  it("Grundreihe: F und J auf den Höckern, Ş mit dem rechten kleinen Finger", () => {
    setLayout("tr-q");
    const a = lessonById("tr-temel-1")!.intro;
    expect(a).toMatch(/F tuşu: sol işaret parmağı, temel konumda\./);
    expect(a).toMatch(/J tuşu: sağ işaret parmağı, temel konumda\./);
    expect(lessonById("tr-temel-4")!.intro).toMatch(/Ş tuşu: sağ serçe parmak, temel konumda\./);
  });

  it("i und ı tragen ihren Zusatz und ihre Kappe: İ für die i-Taste, I für die ı-Taste - zwei verschiedene Tasten", () => {
    setLayout("tr-q");
    expect(lessonById("tr-sik-1")!.intro).toMatch(/Noktalı i \(İ\) tuşu: sağ serçe parmak, Ş tuşunun sağında\./);
    expect(lessonById("tr-sik-4")!.intro).toMatch(/Noktasız ı \(I\) tuşu: sağ orta parmak, K tuşunun hemen üstünde\./);
    expect(lessonById("tr-sik-4")!.title).toBe("Noktasız ı ve T");
    expect(lessonById("tr-sik-1")!.title).toBe("Sık kullanılan harfler: E ve İ");
  });

  it("Apostroph und Totaste: Shift + 2 und Shift + 3 (ölü tuş)", () => {
    setLayout("tr-q");
    expect(lessonById("tr-kesme")!.intro).toMatch(/Kesme işareti "'": karşı elindeki Shift tuşunu basılı tut ve 2 tuşuna bas/);
    const sapka = lessonById("tr-sapka")!.intro;
    expect(sapka).toMatch(/Şapka "\^": karşı elindeki Shift tuşunu basılı tut ve 3 tuşuna bas/);
    expect(sapka).toMatch(/Bu bir ölü tuştur/);
  });

  it("Ziffern ohne Shift; dritte Ebene: Alt Gr (Mac: Option)", () => {
    setLayout("tr-q");
    expect(lessonById("tr-sayilar")!.intro).toMatch(/sayılar Shift tuşu olmadan yazılır/);
    expect(lessonById("tr-simge-2")!.intro).toMatch(/Avro "€": Alt Gr \(Mac'te: Option\) tuşunu basılı tut ve E tuşuna bas/);
    expect(lessonById("tr-simge-2")!.intro).toMatch(/Türk lirası "₺": Alt Gr \(Mac'te: Option\) tuşunu basılı tut ve T tuşuna bas/);
  });

  it("die Schlusslektion sagt, wie die Tastatur â î û liefert, und warnt vor İ und I", () => {
    setLayout("tr-q");
    const metin = lessonById("tr-metin")!;
    expect(metin.kind).toBe("text");
    expect(metin.intro).toMatch(/ölü tuş \^ tuşuna/);
    expect(metin.intro).toMatch(/noktalı i büyüyünce İ, noktasız ı büyüyünce I olur/);
    expect(lessonIntroText(metin, "tr-q")).toBe(metin.intro);
  });

  it("Gegenprobe: auf `tr-f` fehlt der Q-spezifische Satz nicht still, sondern der Text weicht ab (introByLayout)", () => {
    setLayout("tr-q");
    const q = lessonById("tr-metin")!;
    expect(lessonIntroText(q, "tr-f")).not.toBe(q.intro);
  });
});
