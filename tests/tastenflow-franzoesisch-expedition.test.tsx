/**
 * ★★★ E11a-5 (26.09.2026): WÄCHTER - die Expedition (« l'Expédition », « la Banquise »)
 * erzählt auf Französisch, wenn die Bedienungssprache „fr" ist.
 *
 * Geprüft werden ALLE französischen Texte des Spiels - die Zonentexte (`zoneText`), das
 * Tagebuch (`diaryText`), die Spiel-Sätze (`SPIEL_TEXTE`), die Zonennamen und
 * Trainingssätze (`zoneName`/`zoneTrains`), die Tabellen von Bühne, Tagebuch-Blatt und
 * Finale, die Posen der Debug-Leiste, die Beschriftung der Stations-Ablage und der Name,
 * den das Höhlenwesen auf Weg „fr" in die Live-Region schreibt. Jede Funktion wird mit
 * VIELEN Beispielwerten aufgerufen (alle Kombinationen, nicht nur eine), damit auch die
 * Zweige „Erwachsene", „mit Zeitdruck", „fehlerfrei" und die Mehrzahl gelesen werden.
 *
 *  1. Kein deutsches Wort (Deutsch-Fänger `tests/helfer/deutschFaenger.ts`), kein
 *     englisches Wort (eigene Liste, siehe unten), kein « faute », kein « clique », kein
 *     Halbgeviert-/Geviertstrich, keine Lücke (`undefined`/`NaN`).
 *  2. Jeder französische Text ist ein anderer als der englische (sonst wäre er nur
 *     durchgereicht - `texte()` fällt ohne `fr` still auf Englisch zurück).
 *  3. GEGENPROBE: Dieselbe Prüfung gegen Deutsch findet viele deutsche Wörter - ein
 *     Fänger, der nichts liest, wäre sonst auch „grün".
 *  4. Ein Render der Reise (Tagebuch-Blatt, Bühne, erste Spielzeile) mit „fr" - gemessen
 *     am DOM, dazu dieselbe Seite mit „de" als Gegenprobe.
 *
 * ⚠️ `useBedienSprache` wird hier gemockt: Der echte Hook liefert bis zum Einschalten der
 * französischen Oberfläche (`oberflaechenSprache`, `sprache.ts`) nie „fr". Der Render prüft
 * darum die BAUTEILE mit „fr", nicht den Provider.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const zustand = vi.hoisted(() => ({ sprache: "fr" as "de" | "en" | "fr" }));

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: zustand.sprache,
      spracheGewaehlt: zustand.sprache,
      setzeSprache: () => {},
      // `false`: ohne Stimme schreibt die Bühne jede Ansage in ihre Live-Region - genau
      // die wird unten gelesen.
      bereichAktiv: false,
      wechsle: () => {},
      beimSchalter: () => () => {},
    }),
  };
});

import { deutscheWoerter, findeDeutsch } from "./helfer/deutschFaenger";
import { diaryText, zoneText, type PlayZone } from "../src/lib/typing/expedition/texts";
import { EXPEDITION_ZONES, zoneName, zoneTrains } from "../src/lib/typing/expedition/course";
import { SPIEL_TEXTE, caveAnnouncement } from "../src/components/typing/expedition/useExpedition";
import { BUEHNE_TEXTE, POSES } from "../src/components/typing/expedition/ExpeditionStage";
import { TAGEBUCH_TEXTE } from "../src/components/typing/expedition/DiaryCard";
import { ExpeditionJourney, FINALE_TEXTE } from "../src/components/typing/expedition/ExpeditionJourney";
import { ABLAGE_TEXT } from "../src/components/typing/expedition/scenes/StationScene";
import { SHIFT_UNIT } from "../src/lib/typing";
import { masteryFor } from "../src/lib/typing/letters";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  zustand.sprache = "fr";
});

type Sprache = "de" | "en" | "fr";
const ZONEN: PlayZone[] = ["water", "climb", "slide", "cave", "storm", "station"];

/**
 * Wörter aus `DEUTSCHE_WOERTER`, die im Französischen genauso geschrieben werden - sie
 * sind in einem französischen Satz kein Fund. Gemessen an den Texten dieser Datei: nur
 * diese beiden kommen vor.
 */
const FRANZOESISCHE_HOMOGRAPHE = new Set(["des", "du"]);

/**
 * Englische Wörter, die es im Französischen NICHT gibt - bewusst ohne Homografen:
 * « message », « radio », « zone », « igloo », « blizzard », « type », « sent », « bar »,
 * « station », « long » sind auch französisch und fehlen darum.
 */
const ENGLISCHE_WOERTER = new Set(
  (
    "the and you your is are not with from this that press key keys jump floe floes " +
    "cave ice cliff snow storm letter letters word words caught catch next first back " +
    "done well fish heart hearts northern lights journey sequence memory remember " +
    "shore slide belly home gate sound bright too early yet again stop start space " +
    "diary example mistake mistakes listen creature board typed hooray whoops splash " +
    "reached summit decoded jumbled bonus-fish received clear good time pressure"
  ).split(/\s+/),
);

/** Beispielwerte: alle Kombinationen je Stelle, damit jeder Zweig gelesen wird. */
const KANDIDATEN: unknown[] = [true, false, 1, 2, 5, "Ab"];
const ZONEN_WERTE: unknown[] = ["water", "climb", "slide"];

function aufrufe(fn: (...a: unknown[]) => unknown, schluessel: string): { args: string; text: string }[] {
  const n = fn.length;
  const kandidaten = schluessel === "oeffnerSonst" ? [ZONEN_WERTE, ["Ab"]] : null;
  const out: { args: string; text: string }[] = [];
  const rek = (args: unknown[]) => {
    if (args.length === n) {
      let r: unknown;
      try {
        r = fn(...args);
      } catch {
        return; // unpassende Beispielwerte (z. B. Zahl statt Name) - kein Fund
      }
      out.push({ args: JSON.stringify(args), text: alsText(r) });
      return;
    }
    const liste = kandidaten ? kandidaten[args.length] : KANDIDATEN;
    for (const k of liste) rek([...args, k]);
  };
  rek([]);
  return out;
}

function alsText(wert: unknown): string {
  if (Array.isArray(wert)) return wert.map(alsText).join("");
  return String(wert);
}

/** Alle Texte einer Sprache - Schlüssel → Text, je Aufruf-Kombination ein Eintrag. */
function alleTexte(s: Sprache): Map<string, string> {
  const m = new Map<string, string>();
  const tabelle = (name: string, t: Record<string, unknown>) => {
    for (const [k, v] of Object.entries(t)) {
      if (typeof v === "function") {
        for (const a of aufrufe(v as (...a: unknown[]) => unknown, k)) m.set(`${name}.${k}${a.args}`, a.text);
      } else m.set(`${name}.${k}`, alsText(v));
    }
  };
  for (const z of ZONEN) {
    tabelle(`zoneText.${z}`, zoneText(z, s) as unknown as Record<string, unknown>);
    for (const erwachsen of [false, true]) {
      const d = diaryText(z, erwachsen, s);
      m.set(`diaryText.${z}.${erwachsen}.task`, d.task);
      m.set(`diaryText.${z}.${erwachsen}.example`, d.example);
    }
  }
  for (const z of EXPEDITION_ZONES) {
    m.set(`zoneName.${z.kind}`, zoneName(z, s));
    m.set(`zoneTrains.${z.kind}`, zoneTrains(z, s));
  }
  tabelle("SPIEL_TEXTE", SPIEL_TEXTE[s] as unknown as Record<string, unknown>);
  tabelle("BUEHNE_TEXTE", BUEHNE_TEXTE[s] as unknown as Record<string, unknown>);
  tabelle("TAGEBUCH_TEXTE", TAGEBUCH_TEXTE[s] as unknown as Record<string, unknown>);
  tabelle("FINALE_TEXTE", FINALE_TEXTE[s] as unknown as Record<string, unknown>);
  for (const p of POSES) m.set(`POSES.${p.p}`, p.label[s]);
  m.set("ABLAGE_TEXT", ABLAGE_TEXT[s]);
  return m;
}

/** Leerer Text ist erlaubt, wo er gewollt ist (die Station kann nicht scheitern). */
const ABSICHTLICH_LEER = /^zoneText\.station\.fail(Kid|Adult)/;

function deutscheFunde(texte: Map<string, string>): string[] {
  const funde: string[] = [];
  for (const [k, t] of texte) {
    const w = deutscheWoerter(t).filter((x) => !FRANZOESISCHE_HOMOGRAPHE.has(x.toLowerCase()));
    if (w.length) funde.push(`${k}: „${t}" [${w.join(", ")}]`);
  }
  return funde;
}

function englischeFunde(texte: Map<string, string>): string[] {
  const funde: string[] = [];
  for (const [k, t] of texte) {
    const w = (t.toLowerCase().match(/[\p{L}-]+/gu) ?? []).filter((x) => ENGLISCHE_WOERTER.has(x));
    if (w.length) funde.push(`${k}: „${t}" [${w.join(", ")}]`);
  }
  return funde;
}

describe("E11a-5: die Expedition auf Französisch - Tabellen", () => {
  const fr = alleTexte("fr");
  const en = alleTexte("en");

  it("liest wirklich viele Texte (sonst bewiese ein grüner Lauf nichts)", () => {
    expect(fr.size).toBeGreaterThan(500);
    expect(fr.size).toBe(en.size);
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
      // ⚠️ Ein Beispielwert „Ab" an einer ZAHL-Stelle (`mehrzahl(rest, …)`) wird zu `NaN` -
      // das ist der falsche Beispieltyp, keine Lücke im Satz. Dieselbe Stelle wird mit
      // den Zahl-Beispielwerten (1, 2, 5) ohnehin gelesen.
      const zahlStelleMitText = k.includes('"Ab"') && /NaN/.test(t);
      if (/undefined|NaN|\[object/.test(t) && !zahlStelleMitText) funde.push(`${k}: Lücke „${t}"`);
      if (t.trim() === "" && !ABSICHTLICH_LEER.test(k)) funde.push(`${k}: leer`);
      if (/[–—]/.test(t)) funde.push(`${k}: Halbgeviert/Geviertstrich`);
      if (/\bfautes?\b/i.test(t)) funde.push(`${k}: « faute »`);
      if (/\bcliqu/i.test(t)) funde.push(`${k}: « clique »`);
      if (/[  ]/.test(t)) funde.push(`${k}: geschütztes Leerzeichen (F8: gewöhnliches)`);
    }
    expect(funde).toEqual([]);
  });

  it("jeder französische Text ist ein anderer als der englische", () => {
    const gleich: string[] = [];
    for (const [k, t] of fr) {
      if (t.trim() === "") continue;
      // Reine Durchreichungen (nur ein Platzhalter, z. B. `${taste}.`) sind in allen
      // Sprachen gleich - sie tragen kein eigenes Wort.
      const ohneWerte = t.replace(/\b(Ab|true|false)\b/g, "");
      if (!/\p{L}{3,}/u.test(ohneWerte)) continue;
      if (en.get(k) === t) gleich.push(`${k}: „${t}"`);
    }
    expect(gleich).toEqual([]);
  });

  it("GEGENPROBE: dieselbe Prüfung findet im Deutschen viele deutsche Wörter", () => {
    expect(deutscheFunde(alleTexte("de")).length).toBeGreaterThan(100);
  });

  it("GEGENPROBE: dieselbe Prüfung findet im Englischen viele englische Wörter", () => {
    expect(englischeFunde(en).length).toBeGreaterThan(100);
  });

  it('die Tagebuch-Beispiele passen zum Weg „fr" und nennen nie ein Rätselwort', () => {
    // Steilwand/Sturm: nur Zeichen aus dem ersten Abschnitt des Weges „fr".
    expect(diaryText("climb", false, "fr").example).toContain("s, e, l");
    expect(diaryText("storm", false, "fr").example).toContain("Q, S, D");
    // Höhle: wie in der englischen Bedienung sagt das Beispiel, was das Wesen sagt UND
    // welche Taste das ist.
    expect(diaryText("cave", false, "fr").example).toMatch(/"Ka".*K/);
    // Station: dasselbe Fremd-Beispiel wie im Englischen.
    expect(diaryText("station", true, "fr").example).toContain("radio");
  });

  it('das Höhlenwesen: Weg „fr" hat einen Ton und den FRANZÖSISCHEN Namen in der Live-Region', () => {
    expect(caveAnnouncement(",", "fr")).toEqual({ text: "virgule.", tone: true });
    expect(caveAnnouncement(SHIFT_UNIT, "fr")).toEqual({ text: "Maj.", tone: true });
    // Weg „en" unverändert englisch, Weg „de" unverändert die deutsche Aufnahme.
    expect(caveAnnouncement(",", "en").text).not.toBe("virgule.");
    expect(caveAnnouncement(",", "de").tone).toBe(false);
  });

  it("die Mehrzahl stimmt (Französisch: 1 Einzahl, 2 Mehrzahl)", () => {
    const S = SPIEL_TEXTE.fr;
    expect(S.herzWeg(true, 1)).toBe("Erreur de frappe - il reste 1 cœur.");
    expect(S.herzWeg(true, 2)).toBe("Erreur de frappe - il reste 2 cœurs.");
    expect(S.fische(false, 1)).toBe(" Et tu as attrapé un poisson !");
    expect(S.fische(false, 3)).toBe(" Et tu as attrapé 3 poissons !");
    expect(S.fische(true, 3)).toBe(" 3 poissons bonus attrapés.");
  });
});

describe("E11a-5: die Expedition auf Französisch - gerendert", () => {
  const M = masteryFor("normal");
  const INTRO = ["f", "j", "d", "k", "s", "l", "q", "m", "e", "i", "u", "a", "n", "o", "t", "r"];

  function zeigeReise() {
    return render(<ExpeditionJourney open onClose={() => {}} introduced={INTRO} mastery={M} seed={2} lernweg="fr" />);
  }

  /** Text und vorgelesene Attribute unter `document.body`, als eine Zeichenkette. */
  function allesLesbare(): string {
    const teile = [document.body.textContent ?? ""];
    for (const el of document.body.querySelectorAll("[aria-label]")) teile.push(el.getAttribute("aria-label") ?? "");
    return teile.join(" ");
  }

  it("Tagebuch-Blatt und Bühne: französisch, ohne deutsches oder englisches Wort", () => {
    const { baseElement } = zeigeReise();
    const blatt = baseElement.querySelector(".px-diary");
    expect(blatt?.textContent).toContain("Journal de l'Expédition");
    expect(blatt?.textContent).toContain("La Banquise");
    expect(blatt?.textContent).toContain(diaryText("water", false, "fr").task);
    expect(blatt?.textContent).toContain("Échap");
    const ansage = baseElement.querySelector('.px-stage [role="alert"]');
    expect(ansage?.textContent).toContain("Journal de l'Expédition. La Banquise.");
    const deutsch = findeDeutsch(document.body).filter(
      (f) => !/\[(des|du)(, (des|du))*\]$/.test(f),
    );
    expect(deutsch).toEqual([]);
    expect(englischeFunde(new Map([["DOM", allesLesbare()]]))).toEqual([]);
  });

  it("nach der Leertaste: die erste Spielzeile französisch", () => {
    const { baseElement } = zeigeReise();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: " " });
    expect(baseElement.querySelector(".px-diary")).toBeNull();
    const lesbar = allesLesbare();
    expect(lesbar).toContain("Sur la rive. Saute sur le premier bloc de glace :");
    expect(lesbar).toContain("Banquise : appuie sur");
    expect(findeDeutsch(document.body).filter((f) => !/\[(des|du)(, (des|du))*\]$/.test(f))).toEqual([]);
    expect(englischeFunde(new Map([["DOM", lesbar]]))).toEqual([]);
  });

  it("GEGENPROBE: dieselbe Reise in der deutschen Bedienung liefert deutsche Funde", () => {
    zustand.sprache = "de";
    zeigeReise();
    expect(findeDeutsch(document.body).length).toBeGreaterThan(3);
  });
});
