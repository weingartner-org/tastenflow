/**
 * ★ O-RO (29.10.2026): Wächter über „Explorarea tastelor" / „Căutarea tastelor" auf Rumänisch
 * (`src/lib/typing/tastenErklaerungRo.ts`, Glossar `recherche-rumänisch-2026-10-25/GLOSSAR-ro.md`).
 *
 * Geprüft wird über den VERTEILER (`tastenErklaerung.ts`, Sprache „ro"), nicht nur über die Datei selbst - sonst sähe
 * der Wächter nicht, ob die Sätze dort ankommen. Dazu läuft er über ALLE Texte des Objekts `TASTEN_SATZ_RO` (jede
 * Funktion für jede Taste, jede Plattform, mehrere Tastaturen): kein Gedankenstrich, keine Cedille (ş ţ), kein deutsches
 * oder englisches Wort, kein Maus-Wort, keine Zahl mit Punkt am Satzende.
 * Gegenprobe (Mutationsprobe) am 29.10.: ein „ş" in einem Satz der Datei ⇒ rot; zurückgebaut ⇒ grün.
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import { WIRKUNGEN } from "../src/lib/computer/kuerzelWirkung";
import type { Plattform } from "../src/lib/computer/model";
import { suchbareTasten, tastenFuer, type TastenName } from "../src/lib/computer/tastenNamen";
import { DIGIT_ORDER, PUNCT_ORDER, SHIFT_UNIT, SYMBOL_ORDER, unitLabelEn } from "../src/lib/typing/letters";
import type { LayoutId } from "../src/lib/typing/layouts";
import {
  alleZeichen,
  ansageFuer,
  erklaerungFuerSprache,
  erkundeTaste,
  zeichenName,
  zeileFuer,
} from "../src/lib/typing/tastenErklaerung";
import { suchSatzEn } from "../src/lib/typing/tastenErklaerungEn";
import { TASTEN_SATZ_RO, suchSatzRo, unitLabelRo } from "../src/lib/typing/tastenErklaerungRo";

const PLATTFORMEN: Plattform[] = ["windows", "macos"];
const LAYOUTS: LayoutId[] = ["ro", "ro-prog", "de", "us", "uk"];
const NACH_KEY = [
  ...Array.from({ length: 24 }, (_, i) => `F${i + 1}`),
  "Home", "End", "PageUp", "PageDown", "Insert", "NumLock", "Clear", "ContextMenu", "PrintScreen",
  "ScrollLock", "Pause", "AudioVolumeUp", "AudioVolumeDown", "AudioVolumeMute", "Fn", "Dead",
];
const BUCHSTABEN = [..."abcdefghijklmnopqrstuvwxyzăâîșț"];

const ev = (key: string, code?: string, extra: Partial<KeyEventLike> = {}): KeyEventLike => ({
  key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...extra,
});

/* ── die Regeln über jeden Text ─────────────────────────────────────────── */

const GEDANKENSTRICH = /[–—]/;
const CEDILLE = /[ŞşŢţ]/;
/** Deutsche Reste (Tastennamen der deutschen Kappe wie „Strg", „Entf", „Pos 1" sind erlaubt). */
const DEUTSCH = /(?<!\p{L})(Taste|Tasten|Tastatur|drücken|drück|drückst|Leertaste|Umschalt|Umschalttaste|springt|Zeichen|zum Beispiel|Buchstabe|Ziffer|und|oder|mit|nicht)(?!\p{L})/u;
/** Englische Reste (Kappennamen wie „Page Up", „Print Screen", „Caps Lock" sind erlaubt). */
/** Grenzen über `\p{L}`: `\b` hielte „ț" für keinen Buchstaben und fände „it" in „împărțit". */
const ENGLISCH = /(?<!\p{L})(the|key|keys|with|press|and|for|example|it|is|of|to|Find|Found|Got|sign|arrow|space bar|Command|Option|Function|Return|Forward|Escape|Control key|Volume|Mute|accent key|circumflex accent)(?!\p{L})/u;
const MAUS = /clic|atinge|atingi|mouse|maus|klick|trage cu/i;
/** Eine Zahl mit Punkt am Satzende liest die Stimme als Ordnungszahl (Glossar §4 Falle 6). */
const ZAHL_AM_SATZENDE = /\d\.(\s|$)/;

function regelFehler(text: string): string[] {
  const f: string[] = [];
  if (GEDANKENSTRICH.test(text)) f.push("Gedankenstrich");
  if (CEDILLE.test(text)) f.push("Cedille");
  if (DEUTSCH.test(text)) f.push(`deutsch: ${DEUTSCH.exec(text)![0]}`);
  if (ENGLISCH.test(text)) f.push(`englisch: ${ENGLISCH.exec(text)![0]}`);
  if (MAUS.test(text)) f.push("Maus-Wort");
  if (ZAHL_AM_SATZENDE.test(text)) f.push("Zahl am Satzende");
  return f;
}

/** Alle Texte, die das Objekt `TASTEN_SATZ_RO` liefern kann - jede Funktion für jede Taste, Plattform und Tastatur. */
function alleTexte(): { wo: string; text: string }[] {
  const s = TASTEN_SATZ_RO;
  const aus: { wo: string; text: string }[] = [];
  const nimm = (wo: string, text: string | null | undefined) => {
    if (text) aus.push({ wo, text });
  };
  for (const p of PLATTFORMEN) {
    for (const layout of LAYOUTS) {
      for (const t of tastenFuer(p)) {
        const e = s.sondertaste(t.id, p, layout);
        if (e) {
          nimm(`sondertaste ${t.id} ${p} ${layout}`, e.kurz);
          nimm(`sondertaste ${t.id} ${p} ${layout}`, e.name);
          for (const w of e.was) nimm(`sondertaste ${t.id} ${p} ${layout}`, w);
        }
      }
      for (const k of NACH_KEY) {
        const e = s.nachKey(k, p, layout);
        if (e) {
          nimm(`nachKey ${k} ${p} ${layout}`, e.name);
          for (const w of e.was) nimm(`nachKey ${k} ${p} ${layout}`, w);
        }
      }
    }
    for (const k of s.eigeneKombinationen[p]) nimm(`eigeneKombinationen ${p}`, k.was); // `keys` ist kein Lesetext
    for (const id of Object.keys(WIRKUNGEN)) nimm(`wirkung ${id} ${p}`, s.wirkung(id, p));
    const suchbar = suchbareTasten(p);
    for (let i = 0; i < suchbar.length; i++) {
      for (const art of ["daneben", "gefunden", "weiter", "fertig"] as const) {
        if (art === "weiter" && i === suchbar.length - 1) continue;
        nimm(`suchSatz ${art} ${suchbar[i]!.id} ${p}`, suchSatzRo(art, suchbar[(i + 1) % suchbar.length]!, suchbar, i, p));
        nimm(`suchSatz ${art} ohne Taste ${p}`, suchSatzRo(art, null, suchbar, i, p));
      }
    }
  }
  for (const [k, v] of Object.entries(s.tasteKurz)) nimm(`tasteKurz ${k}`, v);
  for (const [k, z] of Object.entries(s.zeichen)) {
    nimm(`zeichen ${k}`, z.name);
    for (const w of z.was) nimm(`zeichen ${k}`, w);
  }
  for (const ch of [...alleZeichen(), ...Object.keys(s.zeichen), ...BUCHSTABEN, ...BUCHSTABEN.map((b) => b.toLocaleUpperCase("ro-RO"))]) {
    nimm(`zeichenName ${ch}`, s.zeichenName(ch));
  }
  for (const [k, a] of Object.entries(s.akzente)) {
    nimm(`akzente ${k}`, a.name);
    for (const w of a.was) nimm(`akzente ${k}`, w);
  }
  for (const [k, w] of Object.entries(s.erkundenWoerter)) {
    nimm(`erkundenWoerter ${k}`, typeof w === "function" ? w("X") : w);
  }
  for (const [k, v] of Object.entries(s.ort)) nimm(`ort ${k}`, v);
  nimm("aufzaehlung", s.aufzaehlung(["în Word", "în Excel", "în browser"]));
  return aus;
}

describe("★★★ O-RO: jede Wörterbuch-Taste hat über den Verteiler einen rumänischen Satz", () => {
  for (const p of PLATTFORMEN) {
    it(`${p}: Satz da, nicht der englische, Form wie in allen Sprachen`, () => {
      const fehlt: string[] = [];
      const englisch: string[] = [];
      const form: string[] = [];
      for (const t of tastenFuer(p)) {
        const ro = erklaerungFuerSprache(t.id, p, "ro", "ro");
        const en = erklaerungFuerSprache(t.id, p, "ro", "en");
        if (!ro) {
          fehlt.push(t.id);
          continue;
        }
        if (JSON.stringify(ro) === JSON.stringify(en)) englisch.push(t.id);
        if (!ro.name || ro.was.length === 0) form.push(`${t.id}: leer`);
        for (const satz of ro.was) {
          if (!/[.?]$/.test(satz.trim())) form.push(`${t.id}: ohne Punkt: ${satz}`);
          if (satz.split(/\s+/).length > 18) form.push(`${t.id}: zu lang: ${satz}`);
        }
      }
      expect(fehlt).toEqual([]);
      expect(englisch).toEqual([]);
      expect(form).toEqual([]);
    });
  }

  it("„Explorarea tastelor“ sagt Tab rumänisch - Zeile und Stimme", () => {
    const aus = erkundeTaste(ev("Tab", "Tab"), "windows", { sprache: "ro", layout: "ro" });
    expect(aus.zeile).toBe(
      "tasta Tab - trece la elementul următor, de exemplu la un link, un câmp sau un buton. " +
        "Cu tasta Shift se întoarce la elementul anterior.",
    );
    expect(aus.ansage.startsWith("tasta Tab: Trece la elementul următor")).toBe(true);
    expect(aus.schlucken).toBe(true);
  });

  it("Buchstaben, Ziffern, Zeichen: rumänische Namen, Grossbuchstaben „A mare“, ș mit Komma", () => {
    expect(zeichenName("ș", "ro")).toBe("s cu virgulă");
    expect(zeichenName("Ș", "ro")).toBe("s cu virgulă, mare");
    expect(zeichenName("A", "ro")).toBe("A mare");
    expect(zeichenName("?", "ro")).toBe("semnul întrebării");
    const zwei = erkundeTaste(ev("2", "Digit2"), "windows", { sprache: "ro", layout: "ro" });
    expect(zwei.ansage.startsWith("cifra 2:")).toBe(true);
    const a = erkundeTaste(ev("A", "KeyA", { shiftKey: true }), "windows", { sprache: "ro", layout: "ro" });
    expect(a.ansage).toBe("A mare.");
  });

  it("die Grossform der Kappe rechnet rumänisch", () => {
    expect(TASTEN_SATZ_RO.aufdruckGross("ș")).toBe("Ș");
    expect(TASTEN_SATZ_RO.aufdruckGross("ă")).toBe("Ă");
  });
});

describe("★★★ O-RO: die Hausregeln über ALLE Texte des Objekts", () => {
  const texte = alleTexte();

  it("es wird wirklich viel geprüft (sonst wäre der Wächter leer grün)", () => {
    expect(texte.length).toBeGreaterThan(1500);
  });

  it("kein Gedankenstrich, keine Cedille, kein Deutsch, kein Englisch, kein Maus-Wort, keine Zahl am Satzende", () => {
    const fehler = texte.flatMap(({ wo, text }) => regelFehler(text).map((f) => `${wo}: ${f}: ${text}`));
    expect(fehler).toEqual([]);
  });

  it("jede Wirkung des Kürzel-Katalogs hat einen rumänischen Satz (null hiesse: fällt weg)", () => {
    const ohne = PLATTFORMEN.flatMap((p) =>
      Object.keys(WIRKUNGEN).filter((id) => TASTEN_SATZ_RO.wirkung(id, p) === null).map((id) => `${id} ${p}`),
    );
    expect(ohne).toEqual([]);
  });

  it("Zeile und Stimme von „Explorarea tastelor“ halten die Regeln - jede Taste, jedes Zeichen", () => {
    const fehler: string[] = [];
    for (const p of PLATTFORMEN) {
      const ereignisse: KeyEventLike[] = [
        ev("Tab", "Tab"), ev("Enter", "Enter"), ev(" ", "Space"), ev("Backspace", "Backspace"), ev("Delete", "Delete"),
        ev("Escape", "Escape"), ev("Shift", "ShiftLeft"), ev("CapsLock", "CapsLock"), ev("ArrowLeft", "ArrowLeft"),
        ev("ArrowUp", "ArrowUp"), ev("Home", "Home"), ev("PageDown", "PageDown"), ev("Insert", "Insert"),
        ...NACH_KEY.map((k) => ev(k, k)),
        ...[...alleZeichen(), ...BUCHSTABEN, "0", "5", "9"].map((ch) => ev(ch)),
        ev("c", "KeyC", p === "macos" ? { metaKey: true } : { ctrlKey: true }),
      ];
      for (const e of ereignisse) {
        const aus = erkundeTaste(e, p, { sprache: "ro", layout: "ro" });
        for (const f of [...regelFehler(aus.zeile), ...regelFehler(aus.ansage)]) fehler.push(`${p} ${e.key}: ${f}: ${aus.ansage}`);
      }
    }
    expect(fehler).toEqual([]);
  });

  it("zeileFuer/ansageFuer: der erste Satz beginnt klein, die Stimme gross", () => {
    const t = TASTEN_SATZ_RO.sondertaste("esc", "windows", "ro")!;
    expect(zeileFuer(t)).toBe("tasta Esc - anulează ce se întâmplă acum. Închide meniuri, ferestre și mesaje. În Tastenflow te duce înapoi în câmpul de scriere.");
    expect(ansageFuer(t).startsWith("tasta Esc: Anulează")).toBe(true);
  });
});

describe("★★ O-RO: unitLabelRo - Buchstaben, Ziffern, Satz- und Sonderzeichen, Shift", () => {
  /** Wörter, die im Rumänischen und Englischen gleich geschrieben werden - kein Rückfall. */
  const HOMOGRAF = new Set(["plus", "euro", "ampersand"]);

  it("feste Beispiele", () => {
    expect(unitLabelRo("a")).toBe("A");
    expect(unitLabelRo("ș")).toBe("Ș");
    expect(unitLabelRo("ț")).toBe("Ț");
    expect(unitLabelRo("2")).toBe("cifra 2");
    expect(unitLabelRo(SHIFT_UNIT)).toBe("litere mari");
    expect(unitLabelRo(".")).toBe("punct");
    expect(unitLabelRo("-")).toBe("cratimă");
    expect(unitLabelRo("@")).toBe("a rond");
    expect(unitLabelRo("„")).toBe("ghilimele deschise");
  });

  it("kein Satz- oder Sonderzeichen, keine Ziffer und nicht Shift trägt den englischen Namen", () => {
    const englisch = [...PUNCT_ORDER, ...SYMBOL_ORDER, ...DIGIT_ORDER, SHIFT_UNIT].filter(
      (u) => unitLabelRo(u) === unitLabelEn(u) && !HOMOGRAF.has(unitLabelRo(u)),
    );
    expect(englisch).toEqual([]);
    const regeln = [...PUNCT_ORDER, ...SYMBOL_ORDER, ...DIGIT_ORDER, SHIFT_UNIT, ...BUCHSTABEN].flatMap((u) =>
      regelFehler(unitLabelRo(u)).map((f) => `${u}: ${f}`),
    );
    expect(regeln).toEqual([]);
  });
});

describe("★★ O-RO: suchSatzRo - alle vier Arten rumänisch", () => {
  for (const p of PLATTFORMEN) {
    it(`${p}: daneben, gefunden, weiter, fertig - nicht englisch, höchstens ein „!“`, () => {
      const suchbar = suchbareTasten(p);
      const fehler: string[] = [];
      const pruefe = (wo: string, ro: string, en: string) => {
        if (ro === en) fehler.push(`${wo}: englisch`);
        if ((ro.match(/!/g) ?? []).length > 1) fehler.push(`${wo}: mehr als ein Ausrufezeichen: ${ro}`);
      };
      for (let i = 0; i < suchbar.length; i++) {
        const andere: TastenName = suchbar[(i + 1) % suchbar.length]!;
        pruefe(`daneben ${i}`, suchSatzRo("daneben", andere, suchbar, i, p), suchSatzEn("daneben", andere, suchbar, i, p));
        pruefe(`daneben ohne ${i}`, suchSatzRo("daneben", null, suchbar, i, p), suchSatzEn("daneben", null, suchbar, i, p));
        pruefe(`gefunden ${i}`, suchSatzRo("gefunden", null, suchbar, i, p), suchSatzEn("gefunden", null, suchbar, i, p));
        if (i < suchbar.length - 1) {
          pruefe(`weiter ${i}`, suchSatzRo("weiter", null, suchbar, i, p), suchSatzEn("weiter", null, suchbar, i, p));
        }
      }
      const letzte = suchbar.length - 1;
      pruefe("fertig", suchSatzRo("fertig", null, suchbar, letzte, p), suchSatzEn("fertig", null, suchbar, letzte, p));
      expect(fehler).toEqual([]);
    });
  }

  it("feste Beispiele (Windows)", () => {
    const suchbar = suchbareTasten("windows");
    const i = suchbar.findIndex((t) => t.id === "tabulator");
    expect(i).toBeGreaterThanOrEqual(0);
    expect(suchSatzRo("gefunden", null, suchbar, i, "windows")).toBe("Ai găsit-o! Apasă altă tastă, apoi din nou tasta Tab.");
    expect(suchSatzRo("daneben", null, suchbar, i, "windows")).toBe("Această tastă nu se exersează aici. Caută tasta Tab.");
    const fertig = suchSatzRo("fertig", null, suchbar, suchbar.length - 1, "windows");
    expect(fertig).toMatch(/^Corect! .*Toate tastele sunt găsite: \d+ din \d+, foarte bine\.$/);
  });
});
