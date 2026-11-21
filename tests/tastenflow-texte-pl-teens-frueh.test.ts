/**
 * ★★★ Wächter PL-T2 (03.10.2026): die frühen pl-Texte für Jugendliche
 * (`corpusPlWegFruehTeens.ts`, Sprossen 7-22 auf der Tastatur `pl` - bis zur
 * Sprosse vor ⇧). Vorbild: `tastenflow-texte-pl-kids-frueh.test.ts` (PL-T1) und
 * `tastenflow-texte-it-teens-frueh.test.ts`; Befund
 * `BEFUND-2026-10-02-PL-T2-TEENS-FRUEH.md`, Leitfaden Fallen 26/31/37/45/48/51/58.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET (kleinstes n, ab dem `fitText` sie
 * mit `introOrder("pl").slice(0, n)` durchlässt). Polnisch: die Grundreihe hat
 * nur EINEN Vokal (`a`), die achte Einheit `;` ist kein Buchstabe (Sprosse 8
 * trägt keine Zeile), `ę` (17) ist ein AltGr-Griff, und es gibt KEINEN
 * Wörterbuch-Beleg (Falle 61) - darum jedes Wort gegen den Wortschatz oder eine
 * Liste von Hand mit Begründung, und jede Zeile mit einem „Ogonek-Zwilling" ist
 * gelesen. Neu gegenüber PL-T1: keine Zeile gleich einer Zeile einer ANDEREN
 * pl-Charge (Text oder Ledger-Schlüssel, der die neun polnischen Buchstaben NICHT
 * kennt) und kein Paar mit ihr; Jugendliche bekommen keine Kinderzeile.
 * Jede Regel hat eine Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { SERIEN } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_IT, CORPUS_PL, CORPUS_TR, CORPUS_CS } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_PL_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusPlWegFruehTeens";
import { CORPUS_PL_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusPlWegFruehKids";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtPl, istKernGesperrtPl, ohneOgonki } from "../src/lib/typing/sperrlistePl";
import { WORDS_PL, STUFE_VOCAB_PL } from "../src/lib/typing/wordsPl";
import { NACHTRAG_PL, NACHTRAG_PL_ERGAENZT } from "../src/lib/typing/lexikonNachtragPl";
import { isRealWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/plTextRegeln";

afterEach(() => setLayout("de"));

const ZEILEN = CORPUS_PL_WEG_FRUEH_TEENS.map((i) => i.text);
/** Die Kinderzeilen PL-T1 (andere Stufe: eigenes Wortbudget, aber keine Kopie und kein Paar). */
const KINDERZEILEN = CORPUS_PL_WEG_FRUEH_KIDS.map((i) => i.text);
/** ALLE anderen pl-Chargen (heute T1, nach dem Merge auch T3 ff.) - gegen sie Kopien, Schlüssel, Paare. */
const ANDERE_PL_ZEILEN = (() => {
  const eigen = new Set(ZEILEN);
  return CORPUS_PL.map((i) => i.text).filter((t) => !eigen.has(t));
})();
/** Die erste Sprosse mit echten Wörtern: an 7 ist „a" der erste (und vor `o` einzige) Vokal. */
const ERSTE_SPROSSE = 7;
/** Die Charge reicht bis zur Sprosse vor ⇧ (Wächter unten: = `letzteSprosse()`). */
const GEBAUT_BIS = 22;
/** Einheiten der Folge, die kein Buchstabe sind und darum keine eigene Zeile brauchen (W6): `;` ist der Fingeranker. */
const OHNE_ZEILE: ReadonlySet<string> = new Set([";"]);

/** Die Sprosse direkt vor ⇧ - aus der Reihenfolge gerechnet, nicht gezählt. */
function letzteSprosse(): number {
  setLayout("pl");
  return introOrder("pl").indexOf(SHIFT_UNIT);
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis vor ⇧). */
function sprosseAuf(text: string): number | null {
  setLayout("pl");
  const o = introOrder("pl");
  const bis = o.indexOf(SHIFT_UNIT);
  for (let n = 1; n <= bis; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "pl"), "pl") !== null) return n;
  }
  return null;
}

describe("PL-T2: jede Zeile an ihrer Sprosse (Tastatur pl)", () => {
  it("die Folge vor ⇧: 22 Einheiten (Grundreihe mit ;, w o n t e i m z, ę, c y r p u)", () => {
    setLayout("pl");
    expect(introOrder("pl").slice(0, 22).join(" ")).toBe("f j d k s l a ; w o n t e i m z ę c y r p u");
    expect(letzteSprosse()).toBe(GEBAUT_BIS);
  });

  it(`jede Zeile passt an einer Sprosse ${ERSTE_SPROSSE}-${GEBAUT_BIS}, nicht früher, und minTier stimmt`, () => {
    const fehler: string[] = [];
    for (const item of CORPUS_PL_WEG_FRUEH_TEENS) {
      const s = sprosseAuf(item.text);
      if (s === null || s < ERSTE_SPROSSE || s > GEBAUT_BIS) fehler.push(`"${item.text}": Sprosse ${s}`);
      const tier = minTierFor(item.text, "pl");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ł, ż, ą, b, g, ś, ó (nach ⇧) passen nie; ę an 17, u an 22, das erste Wort an 7", () => {
    // Beim Schreiben gefunden (Befund §2): „smog", „żużel", „siatkówka", „obóz", „pociąg" gehen vor ⇧ nicht.
    for (const t of ["mały kot", "żużel", "pociąg", "obóz", "smog", "siatkówka", "dzień"]) expect(sprosseAuf(t), t).toBeNull();
    expect(sprosseAuf("jaka klasa")).toBe(7);
    expect(sprosseAuf("dawaj")).toBe(9);
    expect(sprosseAuf("tak się da")).toBe(17);
    expect(sprosseAuf("na luzie")).toBe(22);
    // Ohne Ersatz: „sie" ist eine ANDERE (falsche) Form, sie passt schon an 14 - der Zwillings-Wächter unten fängt sie.
    expect(sprosseAuf("tak sie da")).toBe(14);
  });

  it("vor Sprosse 7 gibt es keinen Vokal, und an Sprosse 8 (;) steht keine Zeile und kein ;", () => {
    setLayout("pl");
    const o = introOrder("pl");
    expect(o.slice(0, ERSTE_SPROSSE - 1).filter((u) => "aąeęioóuy".includes(u))).toEqual([]);
    expect(o[7]).toBe(";");
    expect(ZEILEN.filter((t) => sprosseAuf(t) === 8)).toEqual([]);
    expect(ZEILEN.filter((t) => t.includes(";"))).toEqual([]);
  });

  /**
   * GEMESSEN am Ende von PL-T2 (vom Code gezählt) - jede Grenze darf künftig nur STEIGEN. 7-12 sind ehrlich dünn
   * (Befund §2): mit `f j d k s l a` (+ w o n t) und T1 daneben bleibt für Jugendliche kaum ein Ausruf, der kein
   * Wortsalat ist. Sprosse 8 (`;`) trägt bauartbedingt keine Zeile.
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    7: 2, 8: 0, 9: 2, 10: 2, 11: 2, 12: 3, 13: 6, 14: 8, 15: 7, 16: 10, 17: 5, 18: 9, 19: 15, 20: 26, 21: 29, 22: 25,
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

describe("PL-T2: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[]): string[] {
    setLayout("pl");
    const o = introOrder("pl");
    return zeilen
      .filter((z) => !z.text.includes(o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  it("jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse", () => {
    const zeilen = ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text) })).filter(
      (z): z is { text: string; sprosse: number } => z.sprosse !== null,
    );
    const fehler = ohneNeueEinheit(zeilen);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Einheit von a bis u (ausser dem Fingeranker ;) hat an ihrer Sprosse mindestens eine Zeile (W6)", () => {
    setLayout("pl");
    const o = introOrder("pl");
    const fehlt: string[] = [];
    for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
      if (OHNE_ZEILE.has(o[n - 1])) continue;
      const erlaubt = allowedFromIntroduced(o.slice(0, n), "pl");
      const treffer = ZEILEN.filter((t) => fitText(t, erlaubt, "pl") !== null && t.includes(o[n - 1]));
      if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet", () => {
    expect(ohneNeueEinheit([{ text: "skok w dal", sprosse: 11 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "skok w dal", sprosse: 10 }])).toEqual([]);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

const ERLAUBTE_ZEICHEN = /^[acdefijklmnoprstuwyzę ]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t !== t.toLowerCase() || t !== t.trim() || t.includes("  ");

describe("PL-T2: vor ⇧ nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile ist klein geschrieben und besteht nur aus gelernten Buchstaben und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe, Punkt, ł, ą, b und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["Polski rap", "polski rap.", "szkoła", "pociąg", "obóz", "polski  rap"]) {
      expect(formFehler(t), t).toBe(true);
    }
  });

  it("jede Zeile besteht die Regeln aller polnischen Zeilen (`helfer/plTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg pl, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_PL_WEG_FRUEH_TEENS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("pl");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Wortbasis, Ogonek-Zwillinge ────────

const FUNKTIONSWOERTER = new Set(
  (
    "a i w we z ze na do od o po za nad pod przed dla jak to ten ta te tak nie się mi mnie ja ty on ona ono my wy " +
    "oni one jest są ma mam masz mamy czy co oraz lub ale no"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(z.split(" "))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

const BASIS: ReadonlySet<string> = new Set([
  ...WORDS_PL,
  ...Object.values(STUFE_VOCAB_PL).flat(),
  ...NACHTRAG_PL,
  ...NACHTRAG_PL_ERGAENZT,
]);

/**
 * Wörter dieser Charge, die NICHT im Wortschatz standen (Tatoeba hat sie seltener als zweimal; ein Wörterbuch-Beleg fehlt
 * für Polnisch, Falle 61). Jedes ist eine gewöhnliche Form eines Standardworts oder ein im Polnischen eingebürgertes
 * Lehnwort; die Begründung steht daneben. Über den Korpus kommen sie ins Vorlese-Lexikon (die Stimme spricht sie ganz).
 * ⚠️ Von keiner Person mit Polnisch als Erstsprache gelesen (Befund §4a).
 */
const VON_HAND_BELEGT: Readonly<Record<string, string>> = {
  dal: "Akk. Sg. von dal (Ferne), feste Wendung „skok w dal“ (Weitsprung)",
  kajaka: "Gen. Sg. von kajak",
  konsola: "Nom. Sg. (Spielkonsole)",
  wokal: "Nom. Sg. (Gesang in einem Lied, Musiksprache)",
  set: "Nom. Sg. (Satz im Volleyball/Tennis)",
  oklaski: "Nom. Pl. (Beifall, Pluraletantum)",
  saksofonie: "Lok. Sg. von saksofon (na saksofonie)",
  linowa: "Adjektiv zu lina, Nom. Sg. f. (kolejka linowa = Seilbahn)",
  fotowoltaika: "Nom. Sg. (Photovoltaik)",
  mem: "Nom. Sg. (Internet-Meme)",
  sztafeta: "Nom. Sg. (Staffel)",
  mieszana: "Partizip/Adjektiv von mieszać, Nom. Sg. f. (sztafeta mieszana = Mixed-Staffel)",
  kajaki: "Akk. Pl. von kajak (sezon na kajaki)",
  nocna: "Adjektiv zu noc, Nom. Sg. f. (cisza nocna = Nachtruhe)",
  klasowe: "Adjektiv zu klasa, Nom. Sg. n. (zdjęcie klasowe)",
  filmowa: "Adjektiv zu film, Nom. Sg. f. (noc filmowa, muzyka filmowa)",
  kodowania: "Gen. Sg. von kodowanie (zajęcia z kodowania)",
  ciekawostka: "Nom. Sg. (interessante Tatsache)",
  czat: "Nom. Sg. (Chat, eingebürgert)",
  klasowy: "Adjektiv zu klasa, Nom. Sg. m. (czat klasowy, wyjazd klasowy)",
  czacie: "Lok. Sg. von czat (na czacie)",
  ziemny: "Adjektiv zu ziemia, Nom. Sg. m. (tenis ziemny = Tennis, im Gegensatz zu Tischtennis)",
  tyczce: "Lok. Sg. von tyczka (skok o tyczce = Stabhochsprung)",
  weny: "Gen. Sg. von wena (nie mam weny)",
  kolonie: "Akk. Pl. von kolonia (Ferienlager heisst im Plural „kolonie“)",
  klimatyczny: "Adjektiv zu klimat, Nom. Sg. m. (strajk klimatyczny)",
  sadzimy: "1. Pl. von sadzić (pflanzen); Zwilling sądzimy (meinen) - gelesen",
  szanty: "Nom. Pl. von szanta (Seemannslied)",
  familoki: "Nom. Pl. von familok (schlesisches Arbeiterhaus)",
  cerkwie: "Nom. Pl. von cerkiew (orthodoxe/griechisch-katholische Kirche)",
  drona: "Gen. Sg. von dron (zdjęcia z drona)",
  wkręcam: "1. Sg. von wkręcać (się) - umgangssprachlich „sich hineinsteigern“",
  as: "Nom. Sg. (Ass; as serwisowy = Aufschlag-Ass)",
  serwisowy: "Adjektiv zu serwis (Aufschlag), Nom. Sg. m.",
  peron: "Nom. Sg. (Bahnsteig)",
  przesiadka: "Nom. Sg. (Umstieg)",
  paralimpijczycy: "Nom. Pl. m.-pers. von paralimpijczyk (Polski Komitet Paralimpijski; Zweifel paraolimpijczycy, Befund §4a)",
  klasyk: "Nom. Sg. (Klassiker)",
  playlista: "Nom. Sg. (Wiedergabeliste, eingebürgert)",
  podcast: "Nom. Sg. (eingebürgert; auch podkast)",
  wyciszam: "1. Sg. von wyciszać",
  powiadomienia: "Akk. Pl. von powiadomienie (Benachrichtigung)",
  osiemnastkę: "Akk. Sg. von osiemnastka (18. Geburtstagsfeier)",
  walentynkowa: "Adjektiv zu walentynki, Nom. Sg. f. (poczta walentynkowa)",
  prima: "Teil von „prima aprilis“ (1. April, klein geschrieben)",
  aprilis: "Teil von „prima aprilis“",
  sklepik: "Nom. Sg., Verkleinerung von sklep (Schulkiosk)",
  szatni: "Lok. Sg. von szatnia (Garderobe)",
  plenerowe: "Adjektiv zu plener, Nom. Sg. n. (kino plenerowe = Freiluftkino)",
  salto: "Nom. Sg.",
  trampolinie: "Lok. Sg. von trampolina",
  plecakiem: "Instr. Sg. von plecak",
  rekrutacja: "Nom. Sg. (Aufnahmeverfahren nach der 8. Klasse)",
  plastyczne: "Adjektiv zu plastyka, Nom. Sg. n. (liceum plastyczne = Kunstgymnasium)",
  karny: "Nom. Sg. m. (rzut karny = Strafstoss)",
  lektury: "Nom. Pl. von lektura (Pflichtlektüre)",
  klawiszu: "Lok. Sg. von klawisz (klawisz po klawiszu)",
  perkusji: "Gen. Sg. von perkusja (STUFE_VOCAB_PL: nur Nom.)",
  andrzejki: "Nom. Pl. (Andreasabend, Volksbrauch, klein geschrieben)",
  lanie: "Nom. Sg., Verbalsubstantiv von lać (lanie wosku = Wachsgiessen)",
  wosku: "Gen. Sg. von wosk",
  skansenu: "Gen. Sg. von skansen (Freilichtmuseum)",
  odpuszcza: "3. Sg. von odpuszczać (nachgeben, locker lassen)",
  międzyklasowy: "Adjektiv, Nom. Sg. m. (turniej międzyklasowy)",
  rysuję: "1. Sg. von rysować",
  polo: "Teil von „disco polo“ (Musikrichtung, klein)",
  skateparku: "Lok. Sg. von skatepark (eingebürgert)",
  dyktando: "Nom. Sg. (Diktat)",
};

/** Lehnwörter, die als Teil einer festen Bezeichnung dastehen und kein eigenes polnisches Wort sind. */
const TEILE_FESTER_BEZEICHNUNGEN: ReadonlySet<string> = new Set(["prima", "aprilis", "polo"]);

function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of z.split(" ")) {
      if (w.length >= 2 && !BASIS.has(w) && !(w in VON_HAND_BELEGT)) out.add(w);
    }
  }
  return [...out];
}

const ZWILLINGE: ReadonlyMap<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  for (const v of BASIS) {
    if (!/[ąćęłńóśźż]/.test(v)) continue;
    const k = ohneOgonki(v);
    if (k !== v) m.set(k, [...(m.get(k) ?? []), v]);
  }
  return m;
})();
const mitZwilling = (zeile: string): boolean => zeile.split(" ").some((w) => ZWILLINGE.has(w));

/** Gelesen (Befund §4a): die geschriebene Form ist gemeint (jaka klasa = Nom., nicht jaką klasą; dal = Ferne, nicht dał). */
const ZEILEN_MIT_ZWILLING_GELESEN: ReadonlySet<string> = new Set([
  "jaka klasa", "jaka fala", "jaka walka", "skok w dal", "od nowa", "nowa konsola", "stan konta", "nowa deska",
  "jaka szkoda", "cisza nocna", "lekcje online", "wiatr i fale", "sadzimy drzewa", "as serwisowy", "jedna przesiadka",
  "przyjaciele na zawsze", "dzięki za pomoc", "ta piosenka to klasyk", "nowa playlista", "praca w wakacje",
  "poczta walentynkowa", "lekcje perkusji", "muzyka filmowa",
]);

describe("PL-T2: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Wortbudget Jugend, getrennt von den Kindern)", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `jest rap ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"rap": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => t.split(" ").filter((w) => gesperrtPl(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurwa (Kern), kartacze (beim Schreiben gefunden, Befund §2) werden gefunden, kajaki nicht", () => {
    expect(istKernGesperrtPl("kurwa")).toBe(true);
    expect(gesperrtPl("kartacze")).toBe(true);
    expect(gesperrtPl("kajaki")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz oder ist von Hand belegt - und die Liste trägt nur, was gebraucht wird", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    const benutzt = new Set(ZEILEN.flatMap((z) => z.split(" ")));
    expect(Object.keys(VON_HAND_BELEGT).filter((w) => !benutzt.has(w) || BASIS.has(w))).toEqual([]);
    expect([...TEILE_FESTER_BEZEICHNUNGEN].filter((w) => !(w in VON_HAND_BELEGT))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine Form ohne Ogonek, die es so nicht gibt, werden gemeldet", () => {
    expect(ungeprueft(["polski rapx", "dzieki za link"])).toEqual(["rapx", "dzieki"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) => z.split(" ").some((w) => w.length >= 2 && !isRealWord(w, "pl")));
    expect(buchstabiert).toEqual([]);
  });

  it("jede Zeile mit einem Ogonek-Zwilling ist gelesen - und nur diese", () => {
    const mit = ZEILEN.filter(mitZwilling);
    expect(mit.filter((z) => !ZEILEN_MIT_ZWILLING_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_ZWILLING_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „tak sie da“ (statt się) und „dzieki za link“ haben einen Zwilling, „polski rap“ nicht", () => {
    expect(mitZwilling("tak sie da")).toBe(true);
    expect(ZWILLINGE.get("sie")).toContain("się");
    expect(mitZwilling("polski rap")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare (auch nicht mit PL-T1), Anker ─────────────────

function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", one: "PRO" };
  return zeile
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/[aeiouyąę]$/, "_"))
    .join(" ");
}

/** Paare unter `zeilen` und zwischen `zeilen` und den Vergleichszeilen `gegen`. */
function paare(zeilen: string[], gegen: string[] = []): string[] {
  const gesehen = new Map<string, string>();
  for (const z of gegen) gesehen.set(paarForm(z), `andere pl-Charge: ${z}`);
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}

const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_TR, ...CORPUS_CS];

describe("PL-T2: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der die neun polnischen Buchstaben NICHT kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer Zeile einer anderen pl-Charge (PL-T1 …) - Text oder Ledger-Schlüssel", () => {
    expect(ANDERE_PL_ZEILEN.length).toBeGreaterThanOrEqual(KINDERZEILEN.length);
    const texte = new Set(ANDERE_PL_ZEILEN);
    const schluessel = new Set(ANDERE_PL_ZEILEN.map((t) => bausteinKey("satz", t)));
    const fehler = ZEILEN.filter((t) => texte.has(t) || schluessel.has(bausteinKey("satz", t)));
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: eine T1-Zeile und eine, die sich nur im Ogonek von ihr unterscheidet, wären Kopien", () => {
    const schluessel = new Set(ANDERE_PL_ZEILEN.map((t) => bausteinKey("satz", t)));
    expect(schluessel.has(bausteinKey("satz", "idę do kina"))).toBe(true);
    // „widzą sową" hat denselben Schlüssel wie „widzę sowę" (T1) - darum der Schlüssel-Vergleich.
    expect(schluessel.has(bausteinKey("satz", "widzą sową"))).toBe(true);
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/tr/cs (Text oder Ledger-Schlüssel)", () => {
    const fremd = FREMDE_KORPORA();
    const texte = new Set(fremd.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_PL_WEG_FRUEH_TEENS.filter(
      (i) => texte.has(i.text) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  /** Serien-Zeilen aller Sprachen und Sätze der Prüfungsbanken (Tippchallenge, Sfida, Výzva … in `schreibproben/`). */
  const normSatz = (s: string) => s.toLowerCase().replace(/[.,?!:;"()]/g, "").replace(/\s+/g, " ").trim();
  function serienUndBanken(): { serien: Set<string>; banken: Set<string> } {
    const serien = new Set(SERIEN.flatMap((s) => serieLines(s)).map(normSatz));
    const ordner = resolve(process.cwd(), "src/lib/typing/schreibproben");
    const banken = new Set<string>();
    for (const datei of readdirSync(ordner).filter((d) => d.endsWith(".ts"))) {
      for (const m of readFileSync(join(ordner, datei), "utf8").matchAll(/"((?:[^"\\]|\\.)*)"|`([^`]*)`/g)) {
        for (const satz of (m[1] ?? m[2] ?? "").split(/[.?!\n]+/)) if (satz.trim()) banken.add(normSatz(satz));
      }
    }
    return { serien, banken };
  }

  it("keine Zeile gleicht einer Serien-Zeile (alle Sprachen) oder einem Satz der Prüfungsbanken (`schreibproben/`)", () => {
    const { serien, banken } = serienUndBanken();
    expect(serien.size).toBeGreaterThan(1000);
    expect(banken.size).toBeGreaterThan(1000);
    expect(ZEILEN.filter((z) => serien.has(normSatz(z)) || banken.has(normSatz(z)))).toEqual([]);
  });

  it("Gegenprobe: eine Serien-Zeile wäre als Kopie erkannt", () => {
    const { serien } = serienUndBanken();
    const probe = serieLines(SERIEN[0])[0];
    expect(serien.has(normSatz(probe))).toBe(true);
  });

  it("Gegenprobe: eine italienische Jugendzeile wäre als Kopie erkannt", () => {
    const it0 = CORPUS_IT.find((i) => i.stufen.includes("teens"));
    expect(it0).toBeDefined();
    const schluessel = new Set(FREMDE_KORPORA().map((i) => bausteinKey(i.kind, i.text)));
    expect(schluessel.has(bausteinKey("satz", (it0 as { text: string }).text))).toBe(true);
  });

  it("keine Paare - weder untereinander noch mit einer Zeile einer anderen pl-Charge (Falle 31)", () => {
    const fehler = paare(ZEILEN, ANDERE_PL_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Paar mit einer Kinderzeile (fajne lalki / fajna lalka), on/ona und nowy/nowa werden gefunden", () => {
    expect(paare(["fajne lalki"], ANDERE_PL_ZEILEN)).toHaveLength(1);
    expect(paare(["on wie", "ona wie"])).toHaveLength(1);
    expect(paare(["nowy sezon", "nowa sezon"])).toHaveLength(1);
    expect(paare(["polski rap", "polski rock"])).toEqual([]);
  });
});

describe("PL-T2: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_PL trägt jede Zeile dieser Charge HINTER der Kinder-Charge (nur angehängt), korpusFuer(\"pl\") lädt sie", () => {
    const pl = CORPUS_PL.map((i) => i.text);
    expect(pl.slice(0, KINDERZEILEN.length)).toEqual(KINDERZEILEN);
    const ab = pl.indexOf(ZEILEN[0]);
    expect(ab).toBeGreaterThanOrEqual(KINDERZEILEN.length);
    expect(pl.slice(ab, ab + ZEILEN.length)).toEqual(ZEILEN);
    const geladen = new Set(korpusFuer("pl").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_PL_WEG_FRUEH_TEENS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "zzz probe pl t2", kind: "satz" as const, stufen: ["teens" as const] };
    const ids = manifestFor([
      ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, probe,
    ]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „pl“ bekommt Jugendlichen vor ⇧ alle Zeilen dieser Charge - nur eigene pl-Jugendzeilen, keine Kinderzeile", () => {
    setLayout("pl");
    const o = introOrder("pl");
    const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "pl");
    const geliefert = corpusItemsFor({ stufe: "teens", allowed, lang: "pl", lernweg: "pl" });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    // Eigen ist der Rohtext ODER seine servierte Fassung: spätere ⇧-Chargen (T5) kommen über die Auto-Grossschreibung
    // schon vor ⇧ an, ohne ihre noch nicht gelernten Satzzeichen (wie IT-T5 am IT-T2-Wächter).
    const eigeneJugend = new Set(
      CORPUS_PL.filter((i) => i.nurWeg === "pl" && i.stufen.includes("teens")).flatMap((i) => [
        i.text,
        fitText(i.text, allowed, "pl") ?? i.text,
      ]),
    );
    expect(geliefert.filter((t) => !eigeneJugend.has(t))).toEqual([]);
    expect(geliefert.filter((t) => KINDERZEILEN.includes(t))).toEqual([]);
  });

  it("Kinder bekommen keine Jugendzeile; Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("pl");
    const o = introOrder("pl");
    const kinder = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "pl"), lang: "pl", lernweg: "pl" });
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
