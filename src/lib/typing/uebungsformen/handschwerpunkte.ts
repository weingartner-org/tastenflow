/**
 * Übungsform „Hand-Schwerpunkte".
 *
 * Herkunft: eine der Übungsformen aus Testerin Mail (Kollegin, dieselbe
 * Zielgruppe), am 01.09.2026 mit Johannes durchgesprochen
 * (`AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md` §3, Punkt 9): „nur
 * linke Hand, nur rechte, linker/rechter Umschalter" als Filter über den
 * Wortvorrat. Übt, was Alphabet-Reihen und Fingerdiktat nicht können - die
 * EINE Hand allein bewegt sich sicher über die Tastatur, während die andere
 * ruht (bzw. beim Umschalt-Schwerpunkt: die Gegenhand-Regel für genau EINE
 * Umschalttaste-Seite).
 *
 * Woher eine Runde weiß, welche Hand ein Buchstabe braucht: NIE über eine
 * eigene Tabelle hier, sondern immer über `fingerForChar(ch).hand` aus
 * `fingers.ts` - genau die Stelle, die auch die Bildschirm-Tastatur und die
 * Finger-Ansage benutzen. Zwei Stellen, die dieselbe Zuordnung getrennt
 * kennen, sind in diesem Projekt schon mehrfach auseinandergelaufen (siehe
 * `fingers.ts`-Kopf) - der Test `tests/tastenflow-form-handschwerpunkte.test.ts`
 * sichert das für diese Form ab, indem er jedes ausgewählte Wort selbst noch
 * einmal gegen `fingerForChar` nachrechnet, statt einer eigenen Buchstaben-
 * liste zu vertrauen.
 *
 * Der Wortvorrat kommt aus `wortkettenThemen.ts` (Wortketten nach Thema) und,
 * nur auf Englisch, zusätzlich aus `englischGrundreihe.ts` - dort ist keine
 * einzige Kette absichtlich einhändig geschrieben; die Auswahl HIER filtert
 * aus echten, gemischten Wörtern die einhändig tippbaren heraus. Deutsche
 * Wörter sind durchweg Nomen (großgeschrieben); für „links"/„rechts" wird die
 * Großschreibung entfernt (sonst bräuchte selbst ein rein linkshändiges Wort
 * wie „Vater" die rechte Umschalttaste für das große V - und wäre damit kein
 * Einhand-Wort mehr). Für „umschalt-links"/„umschalt-rechts" gilt das
 * Gegenteil: Hier zählt GENAU die Großschreibung, die restlichen Buchstaben
 * dürfen auf beiden Händen liegen. Englische Wörter werden nie großgeschrieben
 * (Sprachregel des Trainers) - „umschalt-*" taugt darum auf Englisch nie;
 * das ist beabsichtigt, keine Lücke.
 *
 * ★ Ankündigung und gebaute Runde müssen denselben Schwerpunkt nennen, dürfen
 * dafür aber NICHT zweimal unabhängig würfeln (`ctx.zufall()` ist zustands-
 * behaftet - ein zweiter Aufruf zieht die NÄCHSTE Zahl, nicht dieselbe). Die
 * Wahl wird deshalb einmal je `FormKontext`-Objekt getroffen und über eine
 * `WeakMap` an genau dieses Objekt gehängt: Ruft der Aufrufer `ankuendigung`
 * und `baue` mit demselben Kontext auf (wie bei jeder anderen Form - erst die
 * Ankündigung zeigen, dann auf Klick bauen), bekommt die zweite Anfrage die
 * gecachte Antwort der ersten, ohne dass der Zufall noch einmal läuft.
 */
import type { RoundLine } from "../generator";
import { fitText } from "../corpus";
import { kleinFuer } from "../sprachRegister";
import { fingerForChar, needsShift, shiftHandFor, type Hand } from "../fingers";
import { contentStufenFor, type Lang } from "../account";
import type { FormKontext, FormRunde, Uebungsform } from "./typen";
import { WORTKETTEN_DE, WORTKETTEN_EN } from "./wortkettenThemen";
import { WORTKETTEN_FR } from "./wortkettenFr";
import { WORTKETTEN_ES } from "./wortkettenEs";
import { WORTKETTEN_IT } from "./wortkettenIt";
import { WORTKETTEN_PL } from "./wortkettenPl";
import { WORTKETTEN_CS } from "./wortkettenCs";
import { WORTKETTEN_TR } from "./wortkettenTr";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Wege haben je eine eigene, noch leere Datei (`wortketten<Xx>.ts`).
import { WORTKETTEN_BG } from "./wortkettenBg";
import { WORTKETTEN_EL } from "./wortkettenEl";
import { WORTKETTEN_HU } from "./wortkettenHu";
import { WORTKETTEN_NL } from "./wortkettenNl";
import { WORTKETTEN_PT } from "./wortkettenPt";
import { WORTKETTEN_BR } from "./wortkettenBr";
import { WORTKETTEN_RO } from "./wortkettenRo";
import { WORTKETTEN_SV } from "./wortkettenSv";
import { WORTKETTEN_UK } from "./wortkettenUk";
import { eigenOderEn } from "../geruestRueckfall";
import { EN_GRUNDREIHE } from "./englischGrundreihe";
import { wandleSchreibweise } from "../schreibweise";
import { texte } from "../../bedienSprache/texte";
import { bedienSpracheVon } from "./bedienung";
import { FORM_NAMEN } from "./namen";

/** Die vier Schwerpunkte, über die eine Runde gehen kann. */
export type Handschwerpunkt = "links" | "rechts" | "umschalt-links" | "umschalt-rechts";

const ALLE_SCHWERPUNKTE: Handschwerpunkt[] = ["links", "rechts", "umschalt-links", "umschalt-rechts"];

/** Ab so vielen passenden Wörtern taugt EIN Schwerpunkt. */
const MINDEST_WOERTER = 12;

/** Wie viele Wörter eine Zeile trägt (3 bis 5, wie im Auftrag verlangt). */
const MIN_WOERTER_JE_ZEILE = 3;
const MAX_WOERTER_JE_ZEILE = 5;

/**
 * ★ E10b (25.09.2026, Bauplan französischer Lehrgang §2.3 Punkt 4): eine
 * Tabelle statt der Zwei-Wege-Ternäre (nur „en" oder sonst Deutsch) - die
 * Ternäre gab für „fr" still den deutschen Vorrat zurück. ★ E10b-2
 * (26.09.2026): „fr" hat jetzt eigenen, auf Französisch geschriebenen Inhalt
 * (eigene Datei `…Fr.ts`).
 */
// ★ ES-W (27.09.2026): „es" hat eigene Wortketten (`wortkettenEs.ts`).
const WORTKETTEN: Record<Lang, typeof WORTKETTEN_DE> = {
  de: WORTKETTEN_DE,
  en: WORTKETTEN_EN,
  fr: WORTKETTEN_FR,
  es: WORTKETTEN_ES,
  // ★ IT-W (03.10.2026): „it" hat eigene Wortketten (`wortkettenIt.ts`) - vorher das Englische.
  it: WORTKETTEN_IT,
  // ★ PL-W (09.10.2026): „pl" hat eigene Wortketten (`wortkettenPl.ts`) - vorher das Englische.
  pl: WORTKETTEN_PL,
  // ★ TR-W (09.10.2026): „tr" hat eigene Wortketten (`wortkettenTr.ts`) - vorher das Englische.
  tr: WORTKETTEN_TR,
  // ★ CS-W (09.10.2026): „cs" hat eigene Wortketten (`wortkettenCs.ts`) - vorher das Englische.
  cs: WORTKETTEN_CS,
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  // ★ G3c-VERTEILER (25.10.2026): jede liest schon ihre eigene Datei (`wortketten<Xx>.ts`) - leer ⇒ der englische Wert (`geruestRueckfall.ts`).
  bg: eigenOderEn(WORTKETTEN_BG, WORTKETTEN_EN),
  el: eigenOderEn(WORTKETTEN_EL, WORTKETTEN_EN),
  hu: eigenOderEn(WORTKETTEN_HU, WORTKETTEN_EN),
  nl: eigenOderEn(WORTKETTEN_NL, WORTKETTEN_EN),
  pt: eigenOderEn(WORTKETTEN_PT, WORTKETTEN_EN),
  br: eigenOderEn(WORTKETTEN_BR, WORTKETTEN_EN),
  ro: eigenOderEn(WORTKETTEN_RO, WORTKETTEN_EN),
  sv: eigenOderEn(WORTKETTEN_SV, WORTKETTEN_EN),
  uk: eigenOderEn(WORTKETTEN_UK, WORTKETTEN_EN),
};

/** Der rohe, sprachabhängige Wortvorrat - noch ungefiltert nach Hand/Tastenstand. */
function rohvorrat(ctx: FormKontext): string[] {
  const ketten = WORTKETTEN[ctx.lang];
  const passendeStufen = new Set(contentStufenFor(ctx.stufe));
  // ★ E10: Schreibweise VOR jeder Hand-/Tastenprüfung (wie `wortpool` in
  // `hilfen.ts`) - ein Wort wie „grey"/„gray" muss auf beiden Händen dieselbe
  // Zuordnung ergeben wie das, was am Ende angezeigt wird.
  const varianteAn = ctx.lang === "en" && ctx.variante === "us";
  const wandeln = (wort: string) => (varianteAn ? wandleSchreibweise(wort, "us") : wort);
  const woerter = new Set<string>();
  for (const kette of ketten) {
    if (!kette.stufen.some((s) => passendeStufen.has(s))) continue;
    for (const wort of kette.woerter) woerter.add(wandeln(wort));
  }
  // Nur Englisch: die Grundreihen-Wörter gehören mit in denselben Vorrat -
  // siehe Auftrag „Der Wortvorrat sind die Wortketten aus 1. plus (bei
  // ctx.lang === "en") EN_GRUNDREIHE."
  if (ctx.lang === "en") for (const wort of EN_GRUNDREIHE) woerter.add(wandeln(wort));
  return [...woerter];
}

/** Ist JEDER Buchstabe (klein gerechnet) dieses Worts auf `hand`? */
function nurEineHand(wortKlein: string, hand: Hand): boolean {
  for (const ch of wortKlein) {
    const finger = fingerForChar(ch);
    if (!finger || finger.hand !== hand) return false;
  }
  return true;
}

/**
 * Trägt das Wort mindestens einen Großbuchstaben, und liegt dessen
 * Umschalttaste (Gegenhand-Prinzip, `shiftHandFor`) auf `seite` - UND KEIN
 * anderer Großbuchstabe im selben Wort auf der Gegenseite?
 */
function nurUmschaltSeite(wort: string, seite: Hand): boolean {
  let hatGross = false;
  for (const ch of wort) {
    if (!needsShift(ch)) continue;
    hatGross = true;
    if (shiftHandFor(ch) !== seite) return false;
  }
  return hatGross;
}

/**
 * Die Wörter aus `vorrat`, die zu `schwerpunkt` UND zum Tastenstand passen -
 * ohne Dubletten. Für „links"/„rechts" wird kleingeschrieben (siehe
 * Kopf-Kommentar); für „umschalt-*" bleibt die Großschreibung stehen, sonst
 * ginge genau das verloren, was geprüft werden soll.
 */
function woerterFuer(ctx: FormKontext, schwerpunkt: Handschwerpunkt, vorrat: readonly string[]): string[] {
  const allowed = new Set(ctx.introduced);
  const out = new Set<string>();
  for (const roh of vorrat) {
    if (schwerpunkt === "links" || schwerpunkt === "rechts") {
      const hand: Hand = schwerpunkt === "links" ? "links" : "rechts";
      const klein = kleinFuer(roh, ctx.lang);
      if (!nurEineHand(klein, hand)) continue;
      if (fitText(klein, allowed) !== klein) continue;
      out.add(klein);
    } else {
      if (!ctx.shift) continue; // Umschalt-Schwerpunkte brauchen die echte Umschalttaste.
      const seite: Hand = schwerpunkt === "umschalt-links" ? "links" : "rechts";
      if (!nurUmschaltSeite(roh, seite)) continue;
      if (fitText(roh, allowed) !== roh) continue;
      out.add(roh);
    }
  }
  return [...out];
}

/** Welche Schwerpunkte haben mit diesem Kontext genug Wörter? */
function schwerpunkteMitGenug(ctx: FormKontext): Handschwerpunkt[] {
  const vorrat = rohvorrat(ctx);
  return ALLE_SCHWERPUNKTE.filter((sp) => woerterFuer(ctx, sp, vorrat).length >= MINDEST_WOERTER);
}

/**
 * Die EINMALIGE Wahl je Kontext-Objekt (siehe Kopf-Kommentar) - `null`, wenn
 * kein Schwerpunkt genug Wörter hat.
 */
const SCHWERPUNKT_JE_KONTEXT = new WeakMap<FormKontext, Handschwerpunkt | null>();

function gewaehlterSchwerpunkt(ctx: FormKontext): Handschwerpunkt | null {
  const gecacht = SCHWERPUNKT_JE_KONTEXT.get(ctx);
  if (gecacht !== undefined) return gecacht;
  const kandidaten = schwerpunkteMitGenug(ctx);
  const gewaehlt =
    kandidaten.length === 0
      ? null
      : kandidaten[Math.min(kandidaten.length - 1, Math.floor(ctx.zufall() * kandidaten.length))];
  SCHWERPUNKT_JE_KONTEXT.set(ctx, gewaehlt);
  return gewaehlt;
}

function shuffle<T>(arr: readonly T[], zufall: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Baut die Zeilen für einen bereits gewählten Schwerpunkt. */
function baueZeilen(ctx: FormKontext, woerter: readonly string[]): RoundLine[] {
  let pool = shuffle(woerter, ctx.zufall);
  let cursor = 0;
  const naechstesWort = (ausschluss: Set<string>): string => {
    // Obergrenze gegen eine Endlosschleife, falls der Pool kleiner ist als
    // eine dublettenfreie Zeile - dann eben mit einer Dublette weiter, statt
    // hängen zu bleiben.
    for (let versuch = 0; versuch < pool.length * 2 + 10; versuch++) {
      if (cursor >= pool.length) {
        pool = shuffle(woerter, ctx.zufall);
        cursor = 0;
      }
      const wort = pool[cursor];
      cursor++;
      if (!ausschluss.has(wort)) return wort;
    }
    return pool[Math.max(0, cursor - 1)];
  };

  const zeilen: RoundLine[] = [];
  while (zeilen.length < ctx.count) {
    const anzahl =
      MIN_WOERTER_JE_ZEILE + Math.floor(ctx.zufall() * (MAX_WOERTER_JE_ZEILE - MIN_WOERTER_JE_ZEILE + 1));
    const gesehen = new Set<string>();
    const teil: string[] = [];
    for (let i = 0; i < anzahl; i++) {
      const wort = naechstesWort(gesehen);
      gesehen.add(wort);
      teil.push(wort);
    }
    zeilen.push({ text: teil.join(" "), source: null, art: "woerter" });
  }
  return zeilen;
}

function baueRunde(ctx: FormKontext): FormRunde | null {
  const schwerpunkt = gewaehlterSchwerpunkt(ctx);
  if (!schwerpunkt) return null;
  const woerter = woerterFuer(ctx, schwerpunkt, rohvorrat(ctx));
  if (woerter.length < MINDEST_WOERTER) return null; // sollte durch die Wahl schon ausgeschlossen sein
  return { zeilen: baueZeilen(ctx, woerter) };
}

/**
 * Bedienung (EN4) - Deutsch wortgleich wie vorher. `ohne` sollte nie
 * erscheinen (der Aufrufer prüft vorher `taugt`), aber ohne Schwerpunkt darf
 * der Satz keinen behaupten.
 */
const TEXTE = texte({
  de: {
    links: "Jetzt kommen Wörter nur für die linke Hand.",
    rechts: "Jetzt kommen Wörter nur für die rechte Hand.",
    "umschalt-links": "Jetzt kommen Wörter mit der linken Umschalttaste.",
    "umschalt-rechts": "Jetzt kommen Wörter mit der rechten Umschalttaste.",
    ohne: "Jetzt kommen Wörter zum Hand-Schwerpunkt.",
  } satisfies Record<Handschwerpunkt | "ohne", string>,
  en: {
    links: "Now some words for your left hand only.",
    rechts: "Now some words for your right hand only.",
    "umschalt-links": "Now some words with the left Shift key.",
    "umschalt-rechts": "Now some words with the right Shift key.",
    ohne: "Now some hand focus words.",
  },
  // ★ E11a-5 (26.09.2026): Französisch aus der Funktion neu geschrieben (tu, kurz).
  fr: {
    links: "Voici des mots pour la main gauche seule.",
    rechts: "Voici des mots pour la main droite seule.",
    "umschalt-links": "Voici des mots avec la touche Maj de gauche.",
    "umschalt-rechts": "Voici des mots avec la touche Maj de droite.",
    ohne: "Voici des mots pour une main à la fois.",
  },
  es: {
    links: "Aquí tienes palabras solo para la mano izquierda.",
    rechts: "Aquí tienes palabras solo para la mano derecha.",
    "umschalt-links": "Aquí tienes palabras con la tecla Mayús izquierda.",
    "umschalt-rechts": "Aquí tienes palabras con la tecla Mayús derecha.",
    ohne: "Aquí tienes palabras para una sola mano cada vez.",
  },
  it: {
    links: "Ora tocca a parole solo per la mano sinistra.",
    rechts: "Ora tocca a parole solo per la mano destra.",
    "umschalt-links": "Ora tocca a parole con il tasto Maiusc sinistro.",
    "umschalt-rechts": "Ora tocca a parole con il tasto Maiusc destro.",
    ohne: "Ora tocca a parole per una mano sola alla volta.",
  },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: {
    links: "Teraz kolej na: słowa tylko dla lewej ręki.",
    rechts: "Teraz kolej na: słowa tylko dla prawej ręki.",
    "umschalt-links": "Teraz kolej na: słowa z lewym klawiszem Shift.",
    "umschalt-rechts": "Teraz kolej na: słowa z prawym klawiszem Shift.",
    ohne: "Teraz kolej na: słowa raz dla jednej, raz dla drugiej ręki.",
  },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: {
    links: "Sırada: yalnızca sol elle yazılan kelimeler.",
    rechts: "Sırada: yalnızca sağ elle yazılan kelimeler.",
    "umschalt-links": "Sırada: sol Shift tuşuyla yazılan kelimeler.",
    "umschalt-rechts": "Sırada: sağ Shift tuşuyla yazılan kelimeler.",
    ohne: "Sırada: bir sol elle, bir sağ elle yazılan kelimeler.",
  },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  cs: {
    links: "Teď: slova jen pro levou ruku.",
    rechts: "Teď: slova jen pro pravou ruku.",
    "umschalt-links": "Teď: slova s levou klávesou Shift.",
    "umschalt-rechts": "Teď: slova s pravou klávesou Shift.",
    ohne: "Teď: slova jednou pro levou, jednou pro pravou ruku.",
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    links: "Сега: думи само за лявата ръка.",
    rechts: "Сега: думи само за дясната ръка.",
    "umschalt-links": "Сега: думи с левия клавиш Shift.",
    "umschalt-rechts": "Сега: думи с десния клавиш Shift.",
    ohne: "Сега: лява ръка, дясна ръка.",
  },
  el: {
    links: "Τώρα: λέξεις μόνο για το αριστερό χέρι.",
    rechts: "Τώρα: λέξεις μόνο για το δεξί χέρι.",
    "umschalt-links": "Τώρα: λέξεις με το αριστερό Shift.",
    "umschalt-rechts": "Τώρα: λέξεις με το δεξί Shift.",
    ohne: "Τώρα: αριστερό χέρι, δεξί χέρι.",
  },
  hu: {
    links: "Most: szavak csak a bal kézre.",
    rechts: "Most: szavak csak a jobb kézre.",
    "umschalt-links": "Most: szavak a bal Shift billentyűvel.",
    "umschalt-rechts": "Most: szavak a jobb Shift billentyűvel.",
    ohne: "Most: bal kéz, jobb kéz.",
  },
  nl: {
    links: "Nu: woorden alleen voor je linkerhand.",
    rechts: "Nu: woorden alleen voor je rechterhand.",
    "umschalt-links": "Nu: woorden met de linker Shift-toets.",
    "umschalt-rechts": "Nu: woorden met de rechter Shift-toets.",
    ohne: "Nu: linkerhand, rechterhand.",
  },
  pt: {
    links: "Agora: palavras só para a mão esquerda.",
    rechts: "Agora: palavras só para a mão direita.",
    "umschalt-links": "Agora: palavras com a tecla Shift da esquerda.",
    "umschalt-rechts": "Agora: palavras com a tecla Shift da direita.",
    ohne: "Agora: mão esquerda, mão direita.",
  },
  br: {
    links: "Agora: palavras só para a mão esquerda.",
    rechts: "Agora: palavras só para a mão direita.",
    "umschalt-links": "Agora: palavras com a tecla Shift da esquerda.",
    "umschalt-rechts": "Agora: palavras com a tecla Shift da direita.",
    ohne: "Agora: mão esquerda, mão direita.",
  },
  ro: {
    links: "Acum: cuvinte doar pentru mâna stângă.",
    rechts: "Acum: cuvinte doar pentru mâna dreaptă.",
    "umschalt-links": "Acum: cuvinte cu tasta Shift din stânga.",
    "umschalt-rechts": "Acum: cuvinte cu tasta Shift din dreapta.",
    ohne: "Acum: mâna stângă, mâna dreaptă.",
  },
  sv: {
    links: "Nu: ord bara för vänster hand.",
    rechts: "Nu: ord bara för höger hand.",
    "umschalt-links": "Nu: ord med vänster Skift-tangent.",
    "umschalt-rechts": "Nu: ord med höger Skift-tangent.",
    ohne: "Nu: vänster hand, höger hand.",
  },
  uk: {
    links: "Далі: слова лише для лівої руки.",
    rechts: "Далі: слова лише для правої руки.",
    "umschalt-links": "Далі: слова з лівою клавішею Shift.",
    "umschalt-rechts": "Далі: слова з правою клавішею Shift.",
    ohne: "Далі: ліва рука, права рука.",
  },
});

function ankuendigungText(ctx: FormKontext): string {
  return TEXTE[bedienSpracheVon(ctx)][gewaehlterSchwerpunkt(ctx) ?? "ohne"];
}

export const handschwerpunkte: Uebungsform = {
  id: "handschwerpunkte",
  name: FORM_NAMEN.de.handschwerpunkte,
  ankuendigung: ankuendigungText,
  taugt: (ctx) => schwerpunkteMitGenug(ctx).length > 0,
  baue: baueRunde,
};
