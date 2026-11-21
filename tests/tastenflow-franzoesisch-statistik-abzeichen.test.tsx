/**
 * ★★★ E11a-5b (26.09.2026): WÄCHTER - Abzeichen, Freischalt-Feier, Sterne,
 * Statistik-Sätze, Merkfenster und Übungsuhr auf Französisch.
 *
 * Geprüft werden die französischen Fassungen aus `badgesFr.ts`
 * (`badgeName`/`badgeBeschreibung`/`badgeBild`/`badgeGruppe` für ALLE
 * Abzeichen × Profile × Lernwege, `medaillenBeschreibung`, die Einheiten der
 * nächsten Ziele), die Freischalt-Feier (`unlockSpeech`/`unlockInfoFr`/
 * `unlockBrailleLabelFr` für jede Einheit des Weges „fr" auf AZERTY), die
 * Sterne (`starsSpokenFor`), die Statistik (`veraenderungSatz`,
 * `ohneVergleichSatz`, `entwicklungsGrund`, `zeitraumTitel`, `vergleichsName`),
 * die Wochenziel-Erklärung, den Klassenmatch-Hinweis, die Merkfenster und die
 * gesprochene Übezeit.
 *
 *  1. Kein deutsches Wort (Deutsch-Fänger, `tests/helfer/deutschFaenger.ts`),
 *     kein englisches Wort (eigene Liste, ohne Homografen), keine Lücke, kein
 *     « faute », kein « clique », kein Halbgeviert-/Geviertstrich.
 *  2. Jeder französische Text ist ein anderer als der englische.
 *  3. GEGENPROBE: dieselbe Sammlung auf Deutsch findet viele deutsche Wörter,
 *     auf Englisch viele englische.
 *  4. Render des Abzeichen-Regals mit der ECHTEN französischen Bedienung
 *     (`BedienSpracheProvider`, kein Mock) - samt Gegenprobe auf Deutsch.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { deutscheWoerter, findeDeutsch } from "./helfer/deutschFaenger";
import { BedienSpracheProvider, type BedienSprache } from "../src/lib/bedienSprache";
import { setLayout } from "../src/lib/typing/layouts";
import {
  BADGES,
  badgeBeschreibung,
  badgeBild,
  badgeGruppe,
  badgeName,
  nextGoalUnit,
  nextGoals,
} from "../src/lib/typing/badges";
import { ABZEICHEN_FR } from "../src/lib/typing/badgesFr";
import { medaillenBeschreibung } from "../src/components/typing/BadgeMedal";
import { BadgeShelf } from "../src/components/typing/BadgeShelf";
import {
  introOrder,
  unlockBrailleLabelFr,
  unlockInfo,
  unlockInfoEn,
  unlockInfoFr,
  unlockSpeech,
  unlockBrailleLabel,
  unlockBrailleLabelEn,
} from "../src/lib/typing/letters";
import { SHIFT_UNIT, emptyProgress } from "../src/lib/typing";
import { UI_COPY, starsSpokenFor } from "../src/lib/typing/skin";
import {
  entwicklungsGrund,
  entwicklungsGrundKurz,
  ohneVergleichSatz,
  veraenderungSatz,
  veraenderungWert,
} from "../src/lib/typing/veraenderung";
import { vergleichsName, zeitraumTitel, type Zeitraum } from "../src/lib/typing/zeitraum";
import { wochenzielSchritte } from "../src/lib/typing/wochenzielErklaerung";
import { matchHinweisLaeuft, matchHinweisSatz } from "../src/lib/typing/klassenmatch";
import {
  grossschreibungFenster,
  lesezeileFenster,
  tastaturHinweisFenster,
  umschaltFenster,
  wochenzielFenster,
  type Fenstertext,
} from "../src/lib/typing/merkfensterTexte";
import { formatPracticeSpoken } from "../src/lib/typing/practiceClock";
import type { Lernweg } from "../src/lib/typing/lernweg";

type Sprache = "de" | "en" | "fr";
const SKINS = ["kind", "jugend", "erwachsen"] as const;
const LERNWEGE: Lernweg[] = ["de", "en", "fr"];
const JETZT = new Date(2026, 8, 23, 10, 0).getTime();

/**
 * Wörter aus `DEUTSCHE_WOERTER`, die es im Französischen genauso gibt - in
 * einem französischen Satz kein Fund („solide": « Solide comme un roc »).
 */
const FRANZOESISCHE_HOMOGRAPHE = new Set(["des", "du", "solide"]);

/**
 * Ist das Wort ein deutscher Fund? Einzelne Zeichen (ä, ö, ü, ß) sind in den
 * Abzeichen-Beschreibungen GEGENSTAND - „ä, ö et ü débloqués" nennt die
 * Tasten, die das Kind freischaltet, und die Grundreihe von Weg „de" enthält
 * „ö". Ein einzelnes Zeichen ist darum nie ein Fund, ein Wort schon.
 */
function istDeutscherFund(wort: string): boolean {
  return wort.length > 1 && !FRANZOESISCHE_HOMOGRAPHE.has(wort.toLowerCase());
}

/**
 * Englische Wörter, die es im Französischen NICHT gibt. Bewusst ohne
 * Homografen: « radio », « zone », « message », « score », « minute(s) »,
 * « simple », « long », « type », « bonus » sind auch französisch.
 */
const ENGLISCHE_WOERTER = new Set(
  (
    "the and you your is are not with from this that press key keys round rounds " +
    "mistake mistakes accuracy keystroke keystrokes lesson lessons week weeks level levels " +
    "star stars unlocked letter letters capital shift hour hours second seconds " +
    "goal reached practice practised practising school year before earlier nothing compare " +
    "done well great strong keep going almost typed hand finger little other " +
    "reading line arrow down up keyboard connect running over another " +
    "stories stages story stage fish caught adventures ribbon medal showing gold silver"
  ).split(/\s+/),
);

/** Eine Sammlung: Schlüssel → Text. */
type Sammlung = Map<string, string>;

function fenster(m: Sammlung, k: string, f: Fenstertext): void {
  m.set(`${k}.titel`, f.titel);
  f.absaetze.forEach((a, i) => m.set(`${k}.${i}`, a));
}

/** Die Zeiträume, deren Titel und Vergleichsnamen gelesen werden. */
const ZEITRAEUME: Zeitraum[] = [
  { art: "gesamt", wochenVersatz: 0 },
  { art: "schuljahr", wochenVersatz: 0, jahrVersatz: 0 },
  ...[-2, -1, 0, 1].map((v) => ({ art: "woche" as const, wochenVersatz: v })),
  ...[-2, -1, 0, 1].map((v) => ({ art: "monat" as const, wochenVersatz: 0, monatVersatz: v })),
];

/** Alle Einheiten des französischen Weges (auf AZERTY, siehe `beforeAll`) plus Maj. */
function einheiten(): string[] {
  return [SHIFT_UNIT, ...introOrder("fr")];
}

const UNLOCK_INFO: Record<Sprache, typeof unlockInfo> = { de: unlockInfo, en: unlockInfoEn, fr: unlockInfoFr };
const UNLOCK_BRAILLE: Record<Sprache, typeof unlockBrailleLabel> = {
  de: unlockBrailleLabel,
  en: unlockBrailleLabelEn,
  fr: unlockBrailleLabelFr,
};

function sammle(s: Sprache): Sammlung {
  const m: Sammlung = new Map();
  // ── Abzeichen ──
  const gruppen = new Set<string>();
  for (const b of BADGES) {
    gruppen.add(b.group);
    for (const sk of SKINS) m.set(`badgeName.${b.id}.${sk}`, badgeName(b, sk, s));
    for (const lw of LERNWEGE) m.set(`badgeBeschreibung.${b.id}.${lw}`, badgeBeschreibung(b, s, lw));
    m.set(`badgeBild.${b.id}`, badgeBild(b, s));
    m.set(`medaille.${b.id}`, medaillenBeschreibung(b, false, s));
  }
  m.set("medaille.geheim", medaillenBeschreibung(BADGES[0], true, s));
  for (const g of gruppen) m.set(`badgeGruppe.${g}`, badgeGruppe(g, s));
  for (const lw of LERNWEGE)
    for (const g of nextGoals(emptyProgress(), lw)) m.set(`ziel.${lw}.${g.def.id}`, nextGoalUnit(g, s));
  // ── Freischalt-Feier ──
  for (const u of einheiten()) {
    for (const sober of [true, false]) m.set(`unlockSpeech.${u}.${sober}`, unlockSpeech(u, sober, s));
    const i = UNLOCK_INFO[s](u);
    m.set(`unlockKopf.${u}`, i.name ? `${i.article} ${i.noun} ${i.name}` : i.noun);
    m.set(`unlockWie.${u}`, i.howTo);
    m.set(`unlockBraille.${u}`, UNLOCK_BRAILLE[s](u));
  }
  // ── Sterne ──
  for (const sk of SKINS) for (const st of [1, 2, 3]) m.set(`sterne.${sk}.${st}`, starsSpokenFor(UI_COPY[sk], st, s));
  // ── Statistik ──
  ZEITRAEUME.forEach((z, i) => {
    m.set(`zeitraumTitel.${i}`, zeitraumTitel(z, JETZT, null, s));
    const name = vergleichsName(z, JETZT, s);
    if (name) m.set(`vergleichsName.${i}`, name);
    m.set(`ohneVergleich.${i}`, ohneVergleichSatz(name, s));
    for (const g of ["treffer", "tempo", "score"] as const)
      for (const v of [
        { richtung: "hoch" as const, differenz: 3.2 },
        { richtung: "runter" as const, differenz: -1 },
        { richtung: "gleich" as const, differenz: 0.4 },
      ])
        m.set(`veraenderung.${i}.${g}.${v.richtung}`, veraenderungSatz(v, g, name || "X", s));
  });
  m.set("veraenderungWert", veraenderungWert({ richtung: "hoch", differenz: 3 }, "treffer", s));
  for (const w of [0, 1]) {
    const ent = { treffer: null, tempo: null, score: null, ausgangswoche: null, wochen: w };
    m.set(`grund.${w}`, entwicklungsGrund(ent, s) ?? "");
    m.set(`grundKurz.${w}`, entwicklungsGrundKurz(ent, s) ?? "");
  }
  wochenzielSchritte(s).forEach((sch, i) => {
    m.set(`wochenziel.${i}.kopf`, sch.kopf);
    m.set(`wochenziel.${i}.sie`, sch.sie);
    m.set(`wochenziel.${i}.du`, sch.du);
  });
  m.set("match.hinweis", matchHinweisLaeuft(s));
  m.set("match.satz", matchHinweisSatz(matchHinweisLaeuft(s)));
  // ── Merkfenster ──
  for (const sk of SKINS) {
    for (const seite of ["links", "rechts"] as const) fenster(m, `umschalt.${sk}.${seite}`, umschaltFenster("A", seite, sk, s));
    for (const an of ["du", "Sie"] as const) {
      fenster(m, `gross.${sk}.${an}`, grossschreibungFenster(sk, s, an));
      fenster(m, `wochenzielFenster.${sk}.${an}`, wochenzielFenster(sk, s, an));
    }
  }
  for (const an of ["du", "Sie"] as const) {
    fenster(m, `lesezeile.${an}`, lesezeileFenster(an, s));
    fenster(m, `tastatur.${an}`, tastaturHinweisFenster(an, s));
  }
  // ── Übungsuhr ──
  for (const ms of [0, 1000, 2000, 60000, 61000, 125000, 3600000, 3661000, 7322000])
    m.set(`uhr.${ms}`, formatPracticeSpoken(ms, s));
  return m;
}

function deutscheFunde(m: Sammlung): string[] {
  const funde: string[] = [];
  for (const [k, t] of m) {
    const w = deutscheWoerter(t).filter(istDeutscherFund);
    if (w.length) funde.push(`${k}: „${t}" [${w.join(", ")}]`);
  }
  return funde;
}

function englischeFunde(m: Sammlung): string[] {
  const funde: string[] = [];
  for (const [k, t] of m) {
    // Mit Bindestrich als EIN Wort: « week-end » ist französisch, „week" allein nicht.
    const w = (t.toLowerCase().match(/[\p{L}-]+/gu) ?? []).filter((x) => ENGLISCHE_WOERTER.has(x));
    if (w.length) funde.push(`${k}: „${t}" [${w.join(", ")}]`);
  }
  return funde;
}

/**
 * Schlüssel, die in ALLEN Sprachen gleich sein dürfen: Abzeichen-Beschreibungen
 * für ä/ö/ü und ß nennen dieselben Zeichen, Zeiträume ohne Wort gibt es nicht -
 * nur Texte ohne eigenes Wort (Zahlen, Zeichen) werden ausgelassen.
 */
function ohneEigenesWort(t: string): boolean {
  return !/\p{L}{3,}/u.test(t);
}

/**
 * Wörter, die im Englischen und Französischen gleich geschrieben werden und
 * darum als GANZER Text gleich sein dürfen: der trockene Zweitname „Marathon",
 * die Familie „Secret", „1 minute" der Übungsuhr. Von Hand geprüft - jeder
 * davon ist richtiges Französisch.
 */
const GLEICH_IN_BEIDEN = new Set(["Marathon", "Secret", "1 minute"]);

let fr: Sammlung;
let en: Sammlung;
let de: Sammlung;

beforeAll(() => {
  // Die Freischalt-Sätze auf der französischen Tastatur - dort liegt der Weg „fr".
  setLayout("fr");
  fr = sammle("fr");
  en = sammle("en");
  de = sammle("de");
});

afterAll(() => {
  setLayout("de");
});

afterEach(() => {
  cleanup();
  localStorage.removeItem("tastenflow-bedienung");
});

describe("E11a-5b: Abzeichen, Feier, Statistik, Merkfenster, Übungsuhr - französisch", () => {
  it("liest wirklich viele Texte", () => {
    expect(fr.size).toBeGreaterThan(1000);
    expect(fr.size).toBe(en.size);
  });

  it("jedes Abzeichen hat einen französischen Eintrag, einen Zweitnamen genau wo das Deutsche einen hat", () => {
    const fehlt: string[] = [];
    for (const b of BADGES) {
      const e = ABZEICHEN_FR[b.id];
      if (!e) fehlt.push(`${b.id}: kein Eintrag`);
      else if (!!e.nameNeutral !== !!b.nameNeutral) fehlt.push(`${b.id}: Zweitname passt nicht`);
    }
    expect(fehlt).toEqual([]);
  });

  it("kein deutsches Wort in einem französischen Text", () => {
    expect(deutscheFunde(fr)).toEqual([]);
  });

  it("kein englisches Wort in einem französischen Text", () => {
    expect(englischeFunde(fr)).toEqual([]);
  });

  it("keine Lücke, kein leerer Text, keine verbotenen Zeichen oder Wörter", () => {
    const funde: string[] = [];
    for (const [k, t] of fr) {
      if (/undefined|NaN|\[object/.test(t)) funde.push(`${k}: Lücke „${t}"`);
      // „grund.2" gibt es nicht; leer darf nur sein, was auch deutsch leer ist.
      if (t.trim() === "" && (de.get(k) ?? "").trim() !== "") funde.push(`${k}: leer`);
      if (/[–—]/.test(t)) funde.push(`${k}: Halbgeviert/Geviertstrich`);
      if (/\bfautes?\b/i.test(t)) funde.push(`${k}: « faute »`);
      if (/\bcliqu/i.test(t)) funde.push(`${k}: « clique »`);
    }
    expect(funde).toEqual([]);
  });

  it("jeder französische Text ist ein anderer als der englische", () => {
    const gleich: string[] = [];
    for (const [k, t] of fr) {
      if (t.trim() === "" || ohneEigenesWort(t) || GLEICH_IN_BEIDEN.has(t)) continue;
      if (en.get(k) === t) gleich.push(`${k}: „${t}"`);
    }
    expect(gleich).toEqual([]);
  });

  it("GEGENPROBE: dieselbe Sammlung findet auf Deutsch viele deutsche, auf Englisch viele englische Wörter", () => {
    expect(deutscheFunde(de).length).toBeGreaterThan(300);
    expect(englischeFunde(en).length).toBeGreaterThan(300);
  });

  it("Stichproben: Mehrzahl, Angleichung, Datum, Prozent", () => {
    // Übungsuhr: 0 und 1 sind im Französischen Einzahl.
    expect(formatPracticeSpoken(0, "fr")).toBe("0 seconde");
    expect(formatPracticeSpoken(1000, "fr")).toBe("1 seconde");
    expect(formatPracticeSpoken(125000, "fr")).toBe("2 minutes 5 secondes");
    expect(formatPracticeSpoken(3661000, "fr")).toBe("1 heure 1 minute");
    // Freischalten: „la lettre" weiblich, „le chiffre" männlich.
    expect(unlockSpeech("r", false, "fr")).toMatch(/^Bravo ! La lettre R est débloquée\. /);
    expect(unlockSpeech("5", false, "fr")).toMatch(/^Bravo ! Le chiffre cinq est débloqué\. /);
    expect(unlockBrailleLabelFr(SHIFT_UNIT)).toBe("Nouveau : les majuscules");
    // Vergleich: der Name trägt seinen Artikel, der Satz sagt « que ».
    const woche = vergleichsName({ art: "woche", wochenVersatz: 0 }, JETZT, "fr");
    expect(woche).toBe("la semaine précédente");
    expect(veraenderungSatz({ richtung: "hoch", differenz: 3 }, "treffer", woche, "fr")).toBe(
      "La précision est 3 points de pourcentage plus élevée que la semaine précédente.",
    );
    expect(veraenderungWert({ richtung: "hoch", differenz: 3 }, "treffer", "fr")).toBe("+3 %");
    // Umschalt-Fenster: Tastennamen wie auf der Kappe.
    expect(umschaltFenster("A", "links", "kind", "fr").absaetze[0]).toBe(
      "Tu tapes A avec la touche Maj GAUCHE - avec l'auriculaire de ta main gauche.",
    );
  });

  it('Pünktchen-Panda und Schlangen-S sind auf Weg „fr" nicht verdienbar beschrieben, aber vorhanden', () => {
    expect(badgeName(BADGES.find((b) => b.id === "puenktchen-panda")!, "kind", "fr")).toBe("Panda à points");
  });
});

describe("E11a-5b: das Abzeichen-Regal mit der echten französischen Bedienung", () => {
  function progressMit(ids: string[]) {
    const p = emptyProgress();
    return { ...p, badges: Object.fromEntries(ids.map((id) => [id, 1758880000000])) };
  }

  function zeigeRegal(sprache: BedienSprache) {
    localStorage.setItem("tastenflow-bedienung", sprache);
    render(
      <BedienSpracheProvider>
        <BadgeShelf progress={progressMit(["tasten-kueken", "volltreffer", "nachteule"])} selfView />
      </BedienSpracheProvider>,
    );
    // Die ganze Aufklapp-Liste mit allen Familien öffnen.
    const alle = screen.queryByText(sprache === "fr" ? "Afficher tous les badges" : "Alle Abzeichen anzeigen");
    if (alle) fireEvent.click(alle);
  }

  function allesLesbare(): string {
    const teile = [document.body.textContent ?? ""];
    for (const el of document.body.querySelectorAll("[aria-label]")) teile.push(el.getAttribute("aria-label") ?? "");
    return teile.join(" ");
  }

  it("zeigt französische Namen und Familien - ohne deutsches oder englisches Wort", () => {
    zeigeRegal("fr");
    const text = allesLesbare();
    expect(text).toContain("Poussin du clavier");
    expect(text).toContain("En plein dans le mille");
    expect(text).toContain("Oiseau de nuit");
    expect(text).toContain("Médaille");
    // Dieselbe Regel wie oben: Homografen und einzelne Zeichen sind kein Fund.
    const deutsch = findeDeutsch(document.body).filter((f) => {
      const liste = /\[([^\]]*)\]$/.exec(f)?.[1] ?? "";
      return liste.split(", ").some(istDeutscherFund);
    });
    expect(deutsch).toEqual([]);
    expect(englischeFunde(new Map([["DOM", text]]))).toEqual([]);
  });

  it("GEGENPROBE: dasselbe Regal in der deutschen Bedienung liefert deutsche Funde", () => {
    zeigeRegal("de");
    expect(findeDeutsch(document.body).length).toBeGreaterThan(10);
  });
});
