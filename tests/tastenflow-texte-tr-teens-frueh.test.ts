/**
 * ★★★ Wächter TR-T2 (03.10.2026): die frühen tr-Texte für Jugendliche (`corpusTrWegFruehTeens.ts`, Sprossen 7-19 auf
 * `tr-q` - bis zur Sprosse vor ⇧). Kopiert aus dem Piloten `tastenflow-texte-tr-kids-frueh.test.ts` (TR-T1), dazu die
 * Lehren aus PL-T2/PL-T3; Befund `BEFUND-2026-10-02-TR-T2-TEENS-FRUEH.md`, Leitfaden Fallen 26/31/37/45/48/51/58/76/87-91.
 *
 * Die Sprosse einer Zeile wird hier AUSGERECHNET (kleinstes n, ab dem `fitText` sie mit
 * `introOrder("tr").slice(0, n)` durchlässt), nie aus einem Kommentar geglaubt. Jede Regel hat eine Gegenprobe.
 *
 * Neu gegenüber TR-T1:
 *  · Verglichen wird mit der ROHEN Sammelliste aus `corpusTr.ts` (`TR_ROH`, die Datenblätter nach Objekt) - NICHT mit
 *    `CORPUS_TR` aus corpus.ts: das ist die GELADENE Liste nach `mergeCorpus`, dort wäre eine wortgleiche Kopie schon still
 *    mit dem Original verschmolzen und fiele beim Vergleich nach Text als „eigene Zeile" heraus (so standen in PL-T2 neun
 *    Dubletten, gefunden erst am Anker). Darum auch: jede Zeile bringt eine EIGENE ID in den Anker.
 *  · Keine Kopie, kein Paar, nichts „fast gleich" gegen JEDE andere tr-Zeile (T1 und jede spätere Charge), Ledger-Schlüssel
 *    eingeschlossen (`bausteinKey` kennt `ç ğ ı ş` nicht).
 *  · Wortbudget Jugend: höchstens 8 Zeilen je Inhaltswort über ALLE tr-Jugendzeilen (T2 + T5 + T8), getrennt von Kindern.
 *  · Jugendliche bekommen keine Kinderzeile, Kinder keine Jugendzeile.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import {
  fitText,
  corpusItemsFor,
  korpusFuer,
  CORPUS,
  CORPUS_EN,
  CORPUS_FR,
  CORPUS_IT,
  CORPUS_PL,
  CORPUS_TR,
  CORPUS_CS,
} from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_TR as TR_ROH } from "../src/lib/typing/corpusTr";
import { CORPUS_TR_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusTrWegFruehKids";
import { CORPUS_TR_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusTrWegFruehTeens";
import { allowedFromIntroduced, SERIEN } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { adaptiveRound } from "../src/lib/typing/generator";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtGefaltetTr, fuerWortlisteUngeeignetTr, istKernGesperrtTr } from "../src/lib/typing/sperrlisteTr";
import { WORDS_TR, STUFE_VOCAB_TR } from "../src/lib/typing/wordsTr";
import { NACHTRAG_TR, NACHTRAG_TR_ERGAENZT } from "../src/lib/typing/lexikonNachtragTr";
import { isRealWord, normalizeWord } from "../src/lib/typing/lexicon";
import { kleinFuer } from "../src/lib/typing/sprachRegister";
import { zeilenFehler } from "./helfer/trTextRegeln";

afterEach(() => setLayout("de"));

const CHARGE = CORPUS_TR_WEG_FRUEH_TEENS;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN tr-Zeilen (T1 und jede spätere Charge) - aus der ROHEN Sammelliste, nach Objekt (siehe Kopf). */
const ANDERE_TR = () => TR_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_TR_ZEILEN = (): string[] => ANDERE_TR().map((i) => i.text);
const KINDERZEILEN = CORPUS_TR_WEG_FRUEH_KIDS.map((i) => i.text);
/** Die erste Sprosse mit echten Wörtern: an 7 ist „a" der erste Vokal - davor nur Konsonanten. */
const ERSTE_SPROSSE = 7;
/** Die Charge reicht bis zur Sprosse vor ⇧ (Wächter unten: = `letzteSprosse()`). */
const GEBAUT_BIS = 19;

/** Die Sprosse direkt vor ⇧ - aus der Reihenfolge gerechnet, nicht gezählt. */
function letzteSprosse(): number {
  setLayout("tr-q");
  return introOrder("tr").indexOf(SHIFT_UNIT);
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis vor ⇧). */
function sprosseAuf(text: string, bisEnde = false): number | null {
  setLayout("tr-q");
  const o = introOrder("tr");
  const bis = bisEnde ? o.length : o.indexOf(SHIFT_UNIT);
  for (let n = 1; n <= bis; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "tr"), "tr") !== null) return n;
  }
  return null;
}

describe("TR-T2: jede Zeile an ihrer Sprosse (tr-q)", () => {
  it("die Folge vor ⇧: 19 Einheiten, f j d k s l a ş · e i n m b r ı t y o u", () => {
    setLayout("tr-q");
    expect(introOrder("tr").slice(0, 19).join(" ")).toBe("f j d k s l a ş e i n m b r ı t y o u");
    expect(letzteSprosse()).toBe(GEBAUT_BIS);
  });

  it(`jede Zeile passt an einer Sprosse ${ERSTE_SPROSSE}-${GEBAUT_BIS}, nicht früher, und minTier stimmt`, () => {
    const fehler: string[] = [];
    for (const item of CHARGE) {
      const s = sprosseAuf(item.text);
      if (s === null || s < ERSTE_SPROSSE || s > GEBAUT_BIS) fehler.push(`"${item.text}": Sprosse ${s}`);
      const tier = minTierFor(item.text, "tr");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die Einträge stehen nach Sprosse sortiert (wer eine Zeile ergänzt, findet ihren Platz)", () => {
    const s = ZEILEN.map((t) => sprosseAuf(t) as number);
    expect(s).toEqual([...s].sort((a, b) => a - b));
  });

  it("Gegenprobe: was beim Schreiben über die Sprosse fiel - rakip (p), tarihi (h), finaldeyiz/sınıftayız (z), maç (ç)", () => {
    // Fünf Entwurfszeilen fielen so heraus (Befund §2); der Wächter muss sie auch finden.
    for (const t of ["rakip kalede", "tarihi derbi", "yarı finaldeyiz", "bu yıl ayrı sınıftayız", "takım ruhu", "maç bitti"]) {
      expect(sprosseAuf(t), t).toBeNull();
    }
    // „kafa kafaya" trägt ein y - es steht an 17, nicht an 7.
    expect(sprosseAuf("kafa kafaya")).toBe(17);
    expect(sprosseAuf("kafa salla")).toBe(7);
    expect(sprosseAuf("Ankara'da kal")).toBeNull();
    expect(sprosseAuf("maç bitti", true)).not.toBeNull();
  });

  /**
   * GEMESSEN am Ende von TR-T2 (vom Code gezählt) - jede Grenze darf künftig nur STEIGEN. Unter 6 nur, wo die
   * Buchstaben für Jugendliche nicht mehr hergeben (Befund §2): an 7 nur der Vokal „a", an 8 dazu `ş`, an 9 dazu `e`.
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    7: 2, 8: 2, 9: 4, 10: 7, 11: 8, 12: 6, 13: 6, 14: 11, 15: 13, 16: 18, 17: 17, 18: 22, 19: 24,
  };

  it("je Sprosse mindestens so viele Zeilen wie gemessen (gerechnete Sprosse)", () => {
    const anzahl = new Map<number, number>();
    for (const t of ZEILEN) {
      const s = sprosseAuf(t);
      if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
      const soll = MINDESTENS_JE_SPROSSE[n] ?? 6;
      if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n}: ${anzahl.get(n) ?? 0} < ${soll}`);
    }
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
  });
});

describe("TR-T2: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[]): string[] {
    setLayout("tr-q");
    const o = introOrder("tr");
    return zeilen
      .filter((z) => !z.text.includes(o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  it("jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse", () => {
    const zeilen = ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text) as number }));
    const fehler = ohneNeueEinheit(zeilen);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Einheit von a bis zur letzten vor ⇧ hat an ihrer Sprosse mindestens eine Zeile (W6)", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const fehlt: string[] = [];
    for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
      const erlaubt = allowedFromIntroduced(o.slice(0, n), "tr");
      const treffer = ZEILEN.filter((t) => fitText(t, erlaubt, "tr") !== null && t.includes(o[n - 1]));
      if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet", () => {
    expect(ohneNeueEinheit([{ text: "kalede kal", sprosse: 10 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "kalede kal", sprosse: 9 }])).toEqual([]);
  });

  it("die echte Runde (adaptiveRound, Jugendliche, Fokus ı) bringt Zeilen dieser Charge MIT ı", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const intro = o.slice(0, o.indexOf("ı") + 1);
    const echt = Math.random;
    let s = 2003;
    const texte: string[] = [];
    try {
      for (let r = 0; r < 10; r++) {
        let a = s++ >>> 0;
        Math.random = () => {
          a = (a + 0x6d2b79f5) | 0;
          let t = Math.imul(a ^ (a >>> 15), 1 | a);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        for (const z of adaptiveRound({ introduced: intro, focus: ["ı"], stufe: "teens", lang: "tr", lernweg: "tr", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    // Vor ⇧ setzt die Auto-Grossschreibung den Anfang gross (türkisch gerechnet) - verglichen wird klein.
    const eigene = new Set(ZEILEN);
    const treffer = texte.filter((t) => eigene.has(kleinFuer(t, "tr")) && t.includes("ı"));
    expect(treffer.length, texte.slice(0, 12).join(" / ")).toBeGreaterThan(0);
    // Keine Kinderzeile in der Jugendrunde.
    const kinder = new Set(KINDERZEILEN);
    expect(texte.filter((t) => kinder.has(kleinFuer(t, "tr")))).toEqual([]);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

/** Vor ⇧: nur die 19 Buchstaben der Folge und einfache Leerzeichen. */
const ERLAUBTE_ZEICHEN = /^[fjdkslaşeinmbrıtyou ]+$/u;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t !== kleinFuer(t, "tr") || t !== t.trim() || t.includes("  ");

describe("TR-T2: vor ⇧ nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile ist klein geschrieben und besteht nur aus Buchstaben der Folge und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe (İ, I), Punkt, ç, ü, Fragezeichen, Apostroph und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["İnternet kesildi", "Işık", "ofsayt yok.", "maç bitti", "müzik", "neden ki?", "efes'te", "iki  farkla"]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("sıradaki şarkı")).toBe(false);
  });

  it("jede Zeile besteht die Regeln aller türkischen Zeilen (`helfer/trTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Anrede mit Rolle (abi) und ein ASCII-Ersatz (sarki ... icin) werden von den Regeln gefunden", () => {
    expect(zeilenFehler("baksana abi").length).toBeGreaterThan(0);
    expect(zeilenFehler("bu sarki icin").length).toBeGreaterThan(0);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg tr, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("tr");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Wortschatz: Wortbudget Jugend, Sperrliste, Wortbasis, Endungen, Zahlwörter ─

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Nachwörter, Pronomen, Partikeln). */
const FUNKTIONSWOERTER = new Set(
  (
    "bir bu şu o ben sen biz siz onlar bana sana beni seni benim senin " +
    "ile da de ki mi mı mu mü ne en ama ya kadar gibi için daha çok her hiç tam yine"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    // ★ TR-T8 (09.10.2026): leere Stücke zählen nicht - eine Zeile mit `&`, `%`, `₺` oder Ziffern hinterlässt nach dem
    // Entfernen der Zeichen zwei Leerzeichen, und „“ (kein Wort) stand sonst in 215 Jugendzeilen.
    for (const w of new Set(z.split(" ").filter(Boolean))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Alle tr-Jugendzeilen (diese Charge und spätere: T5, T8) - das Wortbudget gilt über die ganze Stufe. */
const ALLE_TR_JUGEND = (): string[] =>
  TR_ROH.filter((i) => i.stufen.includes("teens")).map((i) => kleinFuer(i.text, "tr").replace(/[^\p{L} ]/gu, ""));

/**
 * Was vorher bekannt war: der Wortschatz (`WORDS_TR`, `STUFE_VOCAB_TR`, Nachtrag) UND die Wörter der anderen tr-Chargen
 * (sie sind in deren Wächter belegt - `adada`, `yayla`, `yaylada` stehen in TR-T1).
 *
 * ★ Merge mit TR-T3 (03.10.2026): für die Frage „trägt die Beleg-Liste nur Nötiges?" zählen nur die Chargen VOR dieser in
 * der rohen Liste ({@link FRUEHER_BEKANNT}). Sonst machte jede SPÄTERE Charge, die ein hier belegtes Wort benutzt
 * (TR-T3: *kuru dolma* neben *midye dolma*), die Belege dieser Charge rückwirkend „überflüssig" - der Wächter wurde rot,
 * ohne dass sich an TR-T2 etwas geändert hatte.
 */
const FRUEHER_BEKANNT: ReadonlySet<string> = new Set([
  ...[...WORDS_TR, ...Object.values(STUFE_VOCAB_TR).flat(), ...NACHTRAG_TR, ...NACHTRAG_TR_ERGAENZT].map((w) =>
    normalizeWord(w, "tr"),
  ),
  ...TR_ROH.slice(0, TR_ROH.indexOf(CHARGE[0]))
    .map((i) => i.text)
    .flatMap((z) => kleinFuer(z, "tr").split(/[^\p{L}']+/u).filter(Boolean)),
]);
const VORHER_BEKANNT: ReadonlySet<string> = new Set([
  ...[...WORDS_TR, ...Object.values(STUFE_VOCAB_TR).flat(), ...NACHTRAG_TR, ...NACHTRAG_TR_ERGAENZT].map((w) =>
    normalizeWord(w, "tr"),
  ),
  ...ANDERE_TR_ZEILEN().flatMap((z) => kleinFuer(z, "tr").split(/[^\p{L}']+/u).filter(Boolean)),
]);

/**
 * Neue GRUNDFORMEN dieser Charge - weder im Wortschatz noch in einer anderen tr-Charge. Jedes ist ein gewöhnliches Wort
 * der heutigen Standard- oder Jugendsprache [G - eigenes Sprachwissen, NICHT an einer Quelle belegt; vom macOS-Wörterbuch
 * `tr:` am 03.10.2026 zweimal NICHT abgelehnt - das ist bei Türkisch kein Beweis, Falle 87]. Über den Korpus kommen sie
 * ins Vorlese-Lexikon (die Stimme spricht sie ganz).
 */
const NEUE_GRUNDFORMEN: Readonly<Record<string, string>> = {
  afiş: "Plakat (frz. affiche) - nur als Stamm von „afişi“",
  bateri: "Schlagzeug (TDK „bateri“)",
  dalış: "das Tauchen, Verbalnomen von „dalmak“ (dal- + -ış); Kaş/Akdeniz",
  darbuka: "Bechertrommel (TDK „darbuka“, auch „dümbelek“)",
  dolma: "Gefülltes; „midye dolma“ = gefüllte Miesmuscheln (İzmir, Strassenessen)",
  kafe: "Café (Lehnwort); „kafede“ steht schon im Wortschatz - als Grundform nur in „en sakin kafe“",
  kafile: "Reisegruppe, Mannschaftstross (arab. qāfila) - im Sport üblich („milli takım kafilesi“)",
  kanka: "Jugendsprache für „enger Freund“ (aus „kan kardeş“), geschlechtsneutral",
  kantin: "Schulkiosk",
  kaya: "Fels; „kaya oteli“ = Höhlenhotel (Kapadokya)",
  kurs: "Kurs - nur als Stamm („kursu“)",
  maraton: "Marathon; „yarı maraton“ = Halbmarathon",
  meyan: "Süssholz; „meyan şerbeti“ = Süssholzgetränk der Strassenverkäufer (Urfa, Gaziantep, Adana, Hatay)",
  mod: "Modus; „karanlık mod“ = dunkler Modus am Gerät",
  mola: "Pause (auch im Sport: „mola“ = Auszeit)",
  nakarat: "Refrain",
  ritim: "Rhythmus; „aksak ritim“ = hinkender Rhythmus (9/8, 7/8) der türkischen Volksmusik",
  ritmi: "ritim + -i mit Vokalausfall (ünlü düşmesi: ritim ⇒ ritmi) - darum nicht als Stamm + Endung",
  selfi: "Selbstporträt-Foto (Lehnwort; TDK empfiehlt „özçekim“, im Alltag „selfi“)",
  solo: "Solo (Musik)",
  sıradaki: "sıra + -da + -ki: das „-ki“ ist unveränderlich (keine Vokalharmonie) - darum nicht als Stamm + Endung",
};

/**
 * Neue Formen = bekannter Stamm + Endung. Der Stamm stand im Wortschatz (oder ist eine Grundform oben); der Wächter rechnet
 * Vokalharmonie und d/t-Angleichung nach (Puffer `n y s` gehören zur Endung).
 */
const NEUE_FORMEN: Readonly<Record<string, readonly [string, string]>> = {
  afişi: ["afiş", "i"], basketbolu: ["basketbol", "u"], feribotla: ["feribot", "la"], indirimde: ["indirim", "de"],
  iskeleye: ["iskele", "ye"], kalsak: ["kal", "sak"], kankam: ["kanka", "m"], kankama: ["kanka", "ma"],
  karnede: ["karne", "de"], kaykayla: ["kaykay", "la"], kodlama: ["kod", "lama"], koroda: ["koro", "da"],
  korosu: ["koro", "su"], koşusu: ["koşu", "su"], kulaklıkla: ["kulaklık", "la"], kumsalda: ["kumsal", "da"],
  kursu: ["kurs", "u"], lisesi: ["lise", "si"], lokantası: ["lokanta", "sı"], metroda: ["metro", "da"],
  oteli: ["otel", "i"], radyosu: ["radyo", "su"], reklamlar: ["reklam", "lar"], sette: ["set", "te"],
  seti: ["set", "i"], sisli: ["sis", "li"], yedide: ["yedi", "de"], şarjım: ["şarj", "ım"],
};

const HINTEN = new Set(["a", "ı", "o", "u"]);
const VOKALE = new Set(["a", "e", "ı", "i", "o", "ö", "u", "ü"]);
const STIMMLOS = new Set(["ç", "f", "h", "k", "p", "s", "ş", "t"]);

/** Fehler einer Endung gegen die Vokalharmonie (zweifach a/e, vierfach ı/i/u/ü) und die d/t-Angleichung (wie TR-T1). */
function endungFehler(stamm: string, endung: string): string[] {
  const fehler: string[] = [];
  let vorher = [...stamm].reverse().find((z) => VOKALE.has(z));
  for (const v of endung) {
    if (!VOKALE.has(v) || vorher === undefined) continue;
    if (v === "o") {
      vorher = v;
      continue;
    }
    const hinten = HINTEN.has(vorher);
    const soll =
      v === "a" || v === "e"
        ? hinten ? "a" : "e"
        : vorher === "a" || vorher === "ı" ? "ı" : vorher === "e" || vorher === "i" ? "i" : vorher === "o" || vorher === "u" ? "u" : "ü";
    if (v !== soll) fehler.push(`„${v}“ nach „${vorher}“ (soll „${soll}“)`);
    vorher = v;
  }
  const anlaut = endung[0];
  if (anlaut === "d" || anlaut === "t") {
    const soll = STIMMLOS.has(stamm[stamm.length - 1]) ? "t" : "d";
    if (anlaut !== soll) fehler.push(`Anlaut „${anlaut}“ nach „${stamm[stamm.length - 1]}“ (soll „${soll}“)`);
  }
  return fehler;
}

function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of z.split(" ")) {
      if (w.length >= 2 && !VORHER_BEKANNT.has(w) && !(w in NEUE_GRUNDFORMEN) && !(w in NEUE_FORMEN)) out.add(w);
    }
  }
  return [...out];
}

const ZAHLWOERTER = new Set("bir iki üç dört beş altı yedi sekiz dokuz on yirmi otuz kırk elli yüz bin".split(" "));
/** Nach einem Zahlwort steht die Einzahl (Glossar Regel 5): „elli like“, „beş bin kişi“, nie „elli likelar“. */
function mehrzahlNachZahl(zeile: string): string[] {
  const w = zeile.split(" ");
  return w.filter((x, i) => i > 0 && ZAHLWOERTER.has(w[i - 1]) && /l[ae]r(?:ı|i|a|e|da|de|dan|den|ın|in)?$/u.test(x));
}

describe("TR-T2: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 tr-Jugendzeilen (Wortbudget der Stufe, getrennt von den Kindern)", () => {
    expect(ALLE_TR_JUGEND().length).toBeGreaterThanOrEqual(ZEILEN.length);
    const fehler = zuHaeufig(ALLE_TR_JUGEND());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `ile kanka ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"kanka": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - Kern, Wortbasis, gefaltet (ı→i ş→s …) und kein unerwünschtes Themenwort", () => {
    const fehler = ZEILEN.flatMap((t) =>
      t.split(" ").filter((w) => gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w)).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: sik (Kern), şık (gefaltet), salak (Wortbasis) - kanka, darbuka, selfi, kafile nicht", () => {
    expect(istKernGesperrtTr("sik")).toBe(true);
    expect(gesperrtGefaltetTr("şık")).toBe(true);
    expect(gesperrtGefaltetTr("salak")).toBe(true);
    for (const w of ["kanka", "darbuka", "selfi", "kafile", "aşk"]) {
      expect(gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w), w).toBe(false);
    }
  });

  it("jedes Wort stand schon im Wortschatz (oder in einer anderen tr-Charge) oder ist als Grundform/Form belegt", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird und nicht schon bekannt war (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.split(" ")));
    const staemme = new Set(Object.values(NEUE_FORMEN).map(([s]) => s));
    // Nur gegen Wortschatz und FRÜHERE Chargen (siehe FRUEHER_BEKANNT) - eine spätere Charge macht keinen Beleg überflüssig.
    expect(Object.keys(NEUE_FORMEN).filter((w) => !benutzt.has(w) || FRUEHER_BEKANNT.has(w))).toEqual([]);
    expect(
      Object.keys(NEUE_GRUNDFORMEN).filter((w) => (!benutzt.has(w) && !staemme.has(w)) || FRUEHER_BEKANNT.has(w)),
    ).toEqual([]);
  });

  it("Gegenprobe FRUEHER_BEKANNT: ein Wort aus TR-T1 (adada) zählt als früher bekannt, eines nur aus TR-T3 (dolma) nicht", () => {
    expect(FRUEHER_BEKANNT.has("adada")).toBe(true);
    expect(VORHER_BEKANNT.has("dolma")).toBe(true);
    expect(FRUEHER_BEKANNT.has("dolma")).toBe(false);
  });

  it("jede neue Form = Stamm + Endung; der Stamm ist bekannt; Vokalharmonie und d/t-Angleichung stimmen", () => {
    const fehler: string[] = [];
    for (const [wort, [stamm, endung]] of Object.entries(NEUE_FORMEN)) {
      if (stamm + endung !== wort) fehler.push(`${wort}: ${stamm} + ${endung} ergibt ${stamm + endung}`);
      if (!VORHER_BEKANNT.has(stamm) && !(stamm in NEUE_GRUNDFORMEN)) fehler.push(`${wort}: Stamm „${stamm}“ unbekannt`);
      for (const f of endungFehler(stamm, endung)) fehler.push(`${wort}: ${f}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: falsche Harmonie (lokantasi, radyosü, kulaklıkle) und falsche Angleichung (setde, metrota) werden gemeldet", () => {
    expect(endungFehler("lokanta", "si")).toHaveLength(1);
    expect(endungFehler("radyo", "sü")).toHaveLength(1);
    expect(endungFehler("kulaklık", "le")).toHaveLength(1);
    expect(endungFehler("set", "de")).toHaveLength(1);
    expect(endungFehler("metro", "ta")).toHaveLength(1);
    expect(endungFehler("set", "te")).toEqual([]);
    expect(endungFehler("şarj", "ım")).toEqual([]);
    expect(ungeprueft(["kanka salla", "darbukax ritmi"])).toEqual(["darbukax"]);
  });

  it("nach einem Zahlwort steht die Einzahl", () => {
    const fehler = ZEILEN.flatMap((z) => mehrzahlNachZahl(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „elli likelar“, „beş bin kişiler“ werden gemeldet, „elli like“, „taraftarlar ayakta“ nicht", () => {
    expect(mehrzahlNachZahl("elli likelar")).toEqual(["likelar"]);
    expect(mehrzahlNachZahl("beş bin kişiler")).toEqual(["kişiler"]);
    expect(mehrzahlNachZahl("elli like")).toEqual([]);
    expect(mehrzahlNachZahl("taraftarlar ayakta")).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => z.split(" ").some((w) => w.length >= 2 && !isRealWord(w, "tr")));
    expect(buchstabiert).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, Ledger-Schlüssel, nichts fast gleich ─────────

/** Person und Zahl gleichgesetzt: „ben dans bilmem"/„sen dans bilmem" und „reklam bitsin"/„reklamlar bitsin" sind ein Paar. */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { ben: "PRO", sen: "PRO", o: "PRO", biz: "PRO", siz: "PRO", onlar: "PRO" };
  return zeile
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/l[ae]r$/u, ""))
    .join(" ");
}

function paare(zeilen: string[], andere: string[] = []): string[] {
  const gesehen = new Map<string, string>(andere.map((z) => [paarForm(z), z]));
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}

const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_CS];

describe("TR-T2: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ç ğ ı ş nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    const schluessel = ZEILEN.map((t) => bausteinKey("satz", t));
    expect(new Set(schluessel).size).toBe(ZEILEN.length);
  });

  it("Gegenprobe: „kaş al“/„kaç al“ teilen den Schlüssel, „kır kal“/„kar kal“ nicht", () => {
    expect(bausteinKey("satz", "kaş al")).toBe(bausteinKey("satz", "kaç al"));
    expect(bausteinKey("satz", "kır kal")).not.toBe(bausteinKey("satz", "kar kal"));
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/pl/cs oder einer anderen tr-Charge (Text oder Ledger-Schlüssel)", () => {
    const fremd = [...FREMDE_KORPORA(), ...ANDERE_TR()];
    expect(fremd.length).toBeGreaterThan(1000);
    const texte = new Set(fremd.map((i) => kleinFuer(i.text, "tr").replace(/[.,!?;:"]/gu, "")));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CHARGE.filter((i) => texte.has(i.text) || schluessel.has(bausteinKey(i.kind, i.text))).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: eine TR-T1-Zeile wäre aus der rohen Liste erkannt, auch mit ç statt ş (gleicher Schlüssel)", () => {
    const andere = new Set(ANDERE_TR().map((i) => bausteinKey(i.kind, i.text)));
    expect(andere.has(bausteinKey("satz", KINDERZEILEN[0]))).toBe(true);
    // „şarkı dinle" steht in T1 - „çarkı dinle" (ç statt ş) hätte denselben Schlüssel.
    expect(andere.has(bausteinKey("satz", "çarkı dinle"))).toBe(true);
    // Die rohe Liste trägt die Charge wirklich (sonst wäre ANDERE_TR = alles).
    expect(ANDERE_TR().length).toBe(TR_ROH.length - CHARGE.length);
  });

  it("keine Paare in der Charge und keines mit einer anderen tr-Zeile (nur Person oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_TR_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ben/sen, Einzahl/Mehrzahl und ein Paar mit einer T1-Zeile werden erkannt", () => {
    expect(paare(["ben dans bilmem", "sen dans bilmem"])).toHaveLength(1);
    expect(paare(["reklamlar bitsin", "reklam bitsin"])).toHaveLength(1);
    expect(paare(["bulut kayıyor"], KINDERZEILEN)).toHaveLength(1);
    expect(paare(["kır kal", "kir kal"])).toEqual([]);
  });
});

/**
 * Kopien und „fast gleich" gegen ALLES, was sonst Text trägt (Muster TR-T1/PL-T3): alle Korpora, JEDE andere tr-Zeile
 * (roh), alle Serien aller Sprachen und alle Prüfungstext-Banken (`schreibproben/texte*.ts`, auch die it-Sfida), Zeile
 * für Zeile und Satz für Satz; „fast gleich" ab Jaccard 0,6 (Falle 51).
 */
const BANKEN = import.meta.glob("../src/lib/typing/schreibproben/texte*.ts", { eager: true }) as Record<
  string,
  Record<string, unknown>
>;
function bankZeilen(): string[] {
  const out: string[] = [];
  for (const modul of Object.values(BANKEN)) {
    for (const wert of Object.values(modul)) {
      if (!Array.isArray(wert)) continue;
      for (const t of wert) {
        const zeilen = (t as { zeilen?: unknown }).zeilen;
        if (Array.isArray(zeilen)) for (const z of zeilen) if (typeof z === "string") out.push(z);
      }
    }
  }
  return out;
}
function alleFremdenZeilen(): string[] {
  const roh = [
    ...FREMDE_KORPORA().map((i) => i.text),
    ...ANDERE_TR_ZEILEN(),
    ...SERIEN.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
    ...bankZeilen(),
  ];
  return [...new Set(roh.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
}
const ohneZeichen = (t: string) => kleinFuer(t, "tr").replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
const wortMenge = (t: string) => new Set(ohneZeichen(t).split(" ").filter(Boolean));
function fastGleich(a: Set<string>, b: Set<string>): boolean {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s) >= 0.6;
}

describe("TR-T2: keine Kopie und nichts fast gleich - gegen Korpora, tr-Chargen, Serien und Prüfungstext-Banken", () => {
  it("die Vergleichsmenge ist voll (Serien, Banken, pl/cs und die rohe tr-Liste ohne diese Charge)", () => {
    expect(Object.keys(BANKEN).some((p) => /It[AB]?\.ts$/.test(p))).toBe(true);
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(CORPUS_PL.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(ANDERE_TR().length).toBeGreaterThanOrEqual(CORPUS_TR_WEG_FRUEH_KIDS.length);
  });

  it("keine Zeile gleicht einer fremden Zeile oder einem fremden Satz (ohne Satzzeichen, klein) oder ihrem Ledger-Schlüssel", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    const fehler = ZEILEN.filter((t) => texte.has(ohneZeichen(t)) || schluessel.has(bausteinKey("satz", t)));
    expect(fehler).toEqual([]);
  });

  it("nichts fast gleich - weder in der Charge noch gegen fremde Zeilen (Wortmenge, Jaccard ≥ 0,6)", () => {
    const fremd = alleFremdenZeilen().map((t) => [t, wortMenge(t)] as const);
    const eigen = ZEILEN.map((t) => [t, wortMenge(t)] as const);
    const fehler: string[] = [];
    for (let i = 0; i < eigen.length; i++) {
      for (const [t, m] of fremd) if (fastGleich(eigen[i][1], m)) fehler.push(`"${eigen[i][0]}" ~ "${t}"`);
      for (let j = i + 1; j < eigen.length; j++) {
        if (fastGleich(eigen[i][1], eigen[j][1])) fehler.push(`"${eigen[i][0]}" ~ "${eigen[j][0]}"`);
      }
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Serienzeile, Banken-Satz, T1-Zeile als Kopie; Erweiterung einer T1-Zeile als fast gleich", () => {
    const fremd = new Set(alleFremdenZeilen().map(ohneZeichen));
    expect(fremd.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
    expect(fremd.has("şarkı dinle")).toBe(true);
    // Beim Schreiben verworfen (Befund §2): „bir şarkı dinle" neben T1 „şarkı dinle" (2 von 3 Wörtern).
    expect(fastGleich(wortMenge("bir şarkı dinle"), wortMenge("şarkı dinle"))).toBe(true);
    expect(fastGleich(wortMenge("bisiklet yarışı"), wortMenge("yelken yarışı"))).toBe(false);
  });
});

describe("TR-T2: Korpus-Anker und Auslieferung", () => {
  it("die rohe Liste und korpusFuer(\"tr\") tragen jede Zeile dieser Charge, HINTER TR-T1, als Block", () => {
    const geladen = new Set(korpusFuer("tr").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
    expect(new Set(CORPUS_TR.map((i) => i.text)).size).toBeGreaterThanOrEqual(ZEILEN.length);
    const start = TR_ROH.indexOf(CHARGE[0]);
    expect(start).toBeGreaterThan(TR_ROH.indexOf(CORPUS_TR_WEG_FRUEH_KIDS[CORPUS_TR_WEG_FRUEH_KIDS.length - 1]));
    expect(TR_ROH.slice(start, start + CHARGE.length)).toEqual(CHARGE);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung mit einer Zeile irgendeines Korpus)", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_TR()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    expect(new Set(CHARGE.map((i) => bausteinId(i.kind, i.text))).size).toBe(CHARGE.length);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "zzz probe tr t2", kind: "satz" as const, stufen: ["teens" as const] };
    const ids = manifestFor([...FREMDE_KORPORA(), ...CORPUS_TR, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „tr“ bekommt Jugendlichen vor ⇧ alle Zeilen dieser Charge - nur eigene tr-Jugendzeilen, keine Kinderzeile", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "tr");
    const geliefert = corpusItemsFor({ stufe: "teens", allowed, lang: "tr", lernweg: "tr" });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    // Eigen ist der Rohtext ODER seine servierte Fassung: spätere ⇧-Chargen (T5) kommen über die Auto-Grossschreibung
    // schon vor ⇧ an, ohne ihre noch nicht gelernten Satzzeichen (wie IT-T5 am IT-T2-Wächter).
    const eigeneJugend = new Set(
      CORPUS_TR.filter((i) => i.nurWeg === "tr" && i.stufen.includes("teens")).flatMap((i) => [
        i.text,
        fitText(i.text, allowed, "tr") ?? i.text,
      ]),
    );
    expect(geliefert.filter((t) => !eigeneJugend.has(t))).toEqual([]);
    expect(geliefert.filter((t) => KINDERZEILEN.includes(t))).toEqual([]);
  });

  it("Kinder bekommen keine Jugendzeile; Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const kinder = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "tr"), lang: "tr", lernweg: "tr" });
    expect(ZEILEN.filter((t) => kinder.includes(t))).toEqual([]);
    setLayout("de");
    const deO = introOrder("de");
    const de = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(deO, "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const itO = introOrder("it");
    const it_ = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(itO, "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
