/**
 * ★★★★★ WÄCHTER (ES-M2, 27.09.2026, Prüfbericht ES-P2 M2 und S8, S4):
 * DIE ÜBUNGSSPRACHE PASST ZUM WEG.
 *
 * Befund M2: `LANGS = ["de", "en"]` speiste die Einrichtung („Idioma":
 * „Alemán | Inglés", keine gewählt) und das Zahnrad (Wert „es" ohne Option,
 * angezeigt „Alemán"). Ein Klick gab dem Kind deutsche Texte auf der
 * spanischen Reihenfolge - „´ ¿ ¡" nie als Anschlag. Gilt ebenso für den
 * LIVE-Weg „fr". Befund S8, umgekehrt: Weg „de" mit Übungssprache „es"
 * erzeugte „¿ciudad?" auf einer deutschen Tastatur.
 *
 * ENTSCHEIDUNG DES CHATS (bis Johannes anders entscheidet, Frage S8): Auf
 * einem Weg mit eigener Sprache ist die Übungssprache fest; Weg „de"/„en"
 * unverändert (Deutsch und Englisch frei).
 *
 * ★★★ D1 (28.09.2026, ENTSCHEIDUNG JOHANNES Nr. 18) LÖST DAS AB: Ein Weg mit
 * Hauptsprache (`hauptsprache`, lernweg.ts) bietet sie UND Englisch an -
 * „Englisch ist die Weltsprache und alle sollen sie zusätzlich üben können,
 * die Tastaturfolge der 1. Sprache hat aber Vorrang". Deutsch bleibt dort
 * NIE wählbar (die Gegenprobe unten), die Hauptsprache ist die Vorgabe, und
 * der Sprachschalter der Bedienung zieht dort nichts mit.
 *
 * Geprüft über die FEHLERKLASSE - jeder Weg × jede gespeicherte Sprache ×
 * Einrichtung, Zahnrad, Seite - mit Gegenprobe. Die Klasse (M3) prüft
 * `tastenflow-es-m2-zweite-klasse-sprache.test.tsx`.
 */
import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ReactNode } from "react";

import { BedienSpracheProvider } from "@/lib/bedienSprache";
import { Einrichtung } from "@/components/typing/Einrichtung";
import { TypingSettings } from "@/components/typing/TypingSettings";
import {
  LANGS,
  klassenUebungsSprache,
  langLabel,
  uebungsSpracheImWeg,
  uebungsSprachenImWeg,
  type Lang,
} from "@/lib/typing/account";
import { einrichtungSchritte } from "@/lib/typing/einrichtung";
import {
  LEHRGANG_PROBE_MERKER_ES,
  LEHRGANG_PROBE_MERKER_FR,
  LERNWEGE_LISTE,
  lernwegDef,
  type Lernweg,
} from "@/lib/typing/lernweg";
import { useVoice } from "@/lib/typing/voice";
import { mitRueckfallEn } from "../src/lib/typing/sprachRegister";

const ALLE_LANGS: readonly Lang[] = ["de", "en", "fr", "es"];
/** Die Bedienung, mit der ein Kind auf diesem Weg üblicherweise sitzt. */
const BEDIENUNG: Record<Lernweg, Lang> = /* RÜCKFALL-EN (G2-NEUN) */ mitRueckfallEn({ de: "de", en: "en", fr: "fr", es: "es", it: "en", pl: "en", tr: "en", cs: "en" /* RÜCKFALL-EN (G2a) */ });

function zeige(knoten: ReactNode) {
  return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
}
function bedienung(weg: Lernweg) {
  localStorage.setItem("tastenflow-bedienung", BEDIENUNG[weg]);
  localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "1");
  localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "1");
}
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("die Regel (account.ts)", () => {
  it("Wege mit eigener Sprache: genau diese; Weg de/en: Deutsch und Englisch wie bisher", () => {
    expect(Object.fromEntries(LERNWEGE_LISTE.map((w) => [w, uebungsSprachenImWeg(w)]))).toEqual({
      de: ["de", "en"],
      en: ["de", "en"],
      fr: ["fr", "en"],
      es: ["es", "en"],
      // ★ F5-F8-it (02.10.2026): Italienisch hat seit der Hauptsprache dieselbe Regel wie fr und es - Italienisch und Englisch.
      it: ["it", "en"],
      // ★ F5-F8-pl (03.10.2026): Polnisch ebenso - Polnisch und Englisch.
      pl: ["pl", "en"],
      // ★ F5-F8-tr (03.10.2026): Türkisch hat seit der Hauptsprache dieselbe Regel - Türkisch und Englisch.
      tr: ["tr", "en"],
      // ★ F5-F8-cs (03.10.2026): Tschechisch ebenso - Tschechisch und Englisch.
      cs: ["cs", "en"],
      // ★ GEN-HAUPTSPRACHE (29.10.2026): die neun neuen Wege mit Hauptsprache - sie und Englisch (bis dahin wie Weg en: de, en).
      bg: ["bg", "en"], el: ["el", "en"], hu: ["hu", "en"], nl: ["nl", "en"], pt: ["pt", "en"],
      br: ["br", "en"], ro: ["ro", "en"], sv: ["sv", "en"], uk: ["uk", "en"],
    });
    // Weg „de"/„en" bieten dieselbe Liste wie vorher (`LANGS`, dasselbe Feld).
    expect(uebungsSprachenImWeg("de")).toBe(LANGS);
    expect(uebungsSprachenImWeg("en")).toBe(LANGS);
  });

  it("jeder Weg × jede gespeicherte Sprache: wirksam ist immer eine Sprache des Weges", () => {
    for (const weg of LERNWEGE_LISTE)
      for (const lang of [...ALLE_LANGS, undefined]) {
        const wirksam = uebungsSpracheImWeg(lang, weg);
        expect(uebungsSprachenImWeg(weg), `${weg}/${lang}`).toContain(wirksam);
        // Passt die gespeicherte, bleibt sie (Weg „de" mit Englisch, D1).
        if (lang && uebungsSprachenImWeg(weg).includes(lang)) expect(wirksam).toBe(lang);
        // ★ D1: Ein Weg mit Hauptsprache übt sie - oder Englisch, wenn es
        // gespeichert ist. Deutsch NIE.
        const haupt = lernwegDef(weg).hauptsprache;
        if (haupt) {
          expect(wirksam, `${weg}/${lang}`).toBe(lang === "en" ? "en" : haupt);
          expect(wirksam, `${weg}/${lang}`).not.toBe("de");
        }
      }
    // Die beiden Fälle aus dem Prüfbericht:
    expect(uebungsSpracheImWeg("de", "es")).toBe("es"); // M2: „Alemán" auf Weg es
    expect(uebungsSpracheImWeg("es", "de")).toBe("de"); // S8: „¿ciudad?" auf Weg de
    expect(uebungsSpracheImWeg("de", "fr")).toBe("fr"); // M2 auf dem Live-Weg fr
    // ★ D1 Nr. 18: Englisch als Zusatz auf fr/es.
    expect(uebungsSpracheImWeg("en", "fr")).toBe("en");
    expect(uebungsSpracheImWeg("en", "es")).toBe("en");
    expect(uebungsSpracheImWeg(undefined, "fr")).toBe("fr");
  });

  it("★ D1 GEGENPROBE: Deutsch ist auf Weg fr/es nie wählbar, Spanisch/Französisch nie auf einem fremden Weg", () => {
    for (const weg of ["fr", "es"] as const) {
      expect(uebungsSprachenImWeg(weg)).not.toContain("de");
      expect(uebungsSprachenImWeg(weg)[0]).toBe(weg); // die Hauptsprache zuerst
    }
    expect(uebungsSprachenImWeg("fr")).not.toContain("es");
    expect(uebungsSprachenImWeg("es")).not.toContain("fr");
    for (const weg of ["de", "en"] as const) {
      expect(uebungsSprachenImWeg(weg)).not.toContain("fr");
      expect(uebungsSprachenImWeg(weg)).not.toContain("es");
    }
  });

  it("GEGENPROBE: die alte Regel (gespeicherte Sprache unverändert) verletzt die Eigenschaft", () => {
    const alt = (lang: Lang | undefined) => lang ?? "de";
    const verstoesse = LERNWEGE_LISTE.flatMap((w) =>
      ALLE_LANGS.filter((l) => !uebungsSprachenImWeg(w).includes(alt(l))).map((l) => `${w}/${l}`),
    );
    expect(verstoesse).toContain("es/de");
    expect(verstoesse).toContain("fr/de");
    expect(verstoesse).toContain("de/es");
  });

  it("die Eigenschaft steht am Weg (hauptsprache), nicht an seiner Kennung", () => {
    expect(LERNWEGE_LISTE.filter((w) => lernwegDef(w).hauptsprache)).toEqual(["fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"]);
    const quelle = readFileSync(resolve(__dirname, "../src/lib/typing/account.ts"), "utf-8");
    const rumpf = quelle.slice(quelle.indexOf("export function uebungsSprachenImWeg"));
    const funktion = rumpf.slice(0, rumpf.indexOf("\n}\n"));
    expect(funktion).toContain("hauptsprache");
    expect(funktion).not.toMatch(/=== "(fr|es)"/);
  });

  it("Einrichtung: der Schritt „sprache“ entfällt bei gebundener Sprache, wie bei der Sperre", () => {
    expect(einrichtungSchritte({ spracheGebunden: true })).not.toContain("sprache");
    expect(einrichtungSchritte({ langLocked: true })).not.toContain("sprache");
    expect(einrichtungSchritte({})).toContain("sprache");
  });
});

describe("Einrichtung, erster Start (gerendert)", () => {
  for (const weg of LERNWEGE_LISTE) {
    it(`Weg ${weg}: nur Sprachen des Weges zur Wahl, keine fremde wird gesetzt`, async () => {
      bedienung(weg);
      // ★ F5-F8-it: auf einem Weg mit Hauptsprache beginnt das Kind IMMER mit ihr (`neueKlassenSprache`, D1 Nr. 18) - auch Italienisch
      // mit englischer Bedienung im Test (die italienische Bedienung ist über den echten Provider noch nicht erreichbar).
      const lang = uebungsSpracheImWeg(lernwegDef(weg).hauptsprache ?? BEDIENUNG[weg], weg);
      const gesetzt: Lang[] = [];
      const { container } = zeige(
        <Einrichtung
          stufe="kids"
          lang={lang}
          onLangChange={(l) => gesetzt.push(l)}
          startUnits={2}
          onStartUnitsChange={() => {}}
          lernweg={weg}
          onExit={() => {}}
        />,
      );
      const fremd = ALLE_LANGS.filter((l) => !uebungsSprachenImWeg(weg).includes(l));
      const gesehen = new Set<string>();
      const sprachWahl: { titel: string; gewaehlt: boolean }[] = [];
      for (let i = 0; i < 10; i++) {
        const knoepfe = [...container.querySelectorAll("button")];
        for (const b of knoepfe) gesehen.add(b.querySelector("span")?.textContent?.trim() ?? "");
        for (const l of uebungsSprachenImWeg(weg)) {
          const titel = langLabel(l, BEDIENUNG[weg]);
          const b = knoepfe.find((k) => k.querySelector("span")?.textContent?.trim() === titel);
          if (b) sprachWahl.push({ titel, gewaehlt: b.getAttribute("aria-pressed") === "true" });
        }
        // Jede Sprach-Wahl, die es gibt, einmal drücken - keine darf fremd sein.
        for (const l of ALLE_LANGS) {
          const b = knoepfe.find((k) => k.querySelector("span")?.textContent?.trim() === langLabel(l, BEDIENUNG[weg]));
          if (b) await act(async () => fireEvent.click(b));
        }
        const weiter = [...container.querySelectorAll("button")].find((b) =>
          /^(Weiter|Next|Continue|Suivant|Siguiente|Los geht|Let's go|C'est parti|Commencer|Empezar|Start)/i.test(
            b.textContent?.trim() ?? "",
          ),
        );
        if (!weiter) break;
        await act(async () => fireEvent.click(weiter));
      }
      for (const l of fremd) expect(gesehen, `${weg}: ${langLabel(l, BEDIENUNG[weg])}`).not.toContain(langLabel(l, BEDIENUNG[weg]));
      for (const l of gesetzt) expect(uebungsSprachenImWeg(weg), `${weg}: gesetzt ${l}`).toContain(l);
      const haupt = lernwegDef(weg).hauptsprache;
      if (haupt) {
        // ★ D1 Nr. 18: der Schritt ist da, mit Hauptsprache und Englisch -
        // die Hauptsprache ist gewählt, Deutsch fehlt (Gegenprobe oben: `fremd`).
        expect([...new Set(sprachWahl.map((w) => w.titel))].sort()).toEqual(
          [haupt, "en"].map((l) => langLabel(l as Lang, BEDIENUNG[weg])).sort(),
        );
        expect(sprachWahl.find((w) => w.titel === langLabel(haupt, BEDIENUNG[weg]))?.gewaehlt).toBe(true);
        expect(gesehen).not.toContain(langLabel("de", BEDIENUNG[weg]));
      } else {
        // GEGENPROBE: auf Weg „de"/„en" gibt es den Schritt, mit Deutsch und Englisch, eine gewählt.
        expect(sprachWahl.map((w) => w.titel).sort()).toEqual(
          LANGS.map((l) => langLabel(l, BEDIENUNG[weg])).sort(),
        );
        expect(sprachWahl.some((w) => w.gewaehlt)).toBe(true);
      }
    });
  }
});

describe("Zahnrad (gerendert)", () => {
  for (const weg of LERNWEGE_LISTE) {
    for (const gespeichert of ALLE_LANGS) {
      it(`Weg ${weg}, gespeichert ${gespeichert}: Wert und Auswahl passen zum Weg`, () => {
        bedienung(weg);
        const lang = uebungsSpracheImWeg(gespeichert, weg);
        const { container } = zeige(
          <TypingSettings stufe="kids" lang={lang} onLangChange={() => {}} lernweg={weg} />,
        );
        const feld = [...container.querySelectorAll("select")].find((s) =>
          [...s.options].some((o) => o.value === lang && o.textContent === langLabel(lang, BEDIENUNG[weg])),
        );
        expect(feld, `${weg}/${gespeichert}`).toBeTruthy();
        expect(feld!.value).toBe(lang);
        expect([...feld!.options].map((o) => o.value)).toEqual([...uebungsSprachenImWeg(weg)]);
        // ★ D1 Nr. 18: auf keinem Weg mehr gesperrt - fr/es bieten zwei Sprachen.
        expect(feld!.getAttribute("aria-disabled")).toBeNull();
        const haupt = lernwegDef(weg).hauptsprache;
        if (haupt) {
          // Der Hinweis nennt die Hauptsprache und dass Englisch dazukommt.
          expect(container.textContent).toContain(langLabel(haupt, BEDIENUNG[weg]));
          expect([...feld!.options].map((o) => o.value)).not.toContain("de");
        }
      });
    }
  }

  it("Stimmen: auf Weg es spanische, auf Weg fr französische Stimmen im Angebot; Weg de wie bisher", async () => {
    const stimmen = [
      { name: "Anna", lang: "de-DE", voiceURI: "anna" },
      { name: "Samantha", lang: "en-US", voiceURI: "samantha" },
      { name: "Mónica", lang: "es-ES", voiceURI: "monica" },
      { name: "Paulina", lang: "es-MX", voiceURI: "paulina" },
      { name: "Thomas", lang: "fr-FR", voiceURI: "thomas" },
    ];
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        getVoices: () => stimmen,
        addEventListener() {},
        removeEventListener() {},
        speak() {},
        cancel() {},
        speaking: false,
        pending: false,
      },
    });
    act(() => useVoice.getState().setEnabled(true));
    try {
      const angebot = (weg: Lernweg) => {
        bedienung(weg);
        const { container } = zeige(
          <TypingSettings stufe="kids" lang={uebungsSpracheImWeg(BEDIENUNG[weg], weg)} onLangChange={() => {}} lernweg={weg} />,
        );
        const s = container.querySelector("#tt-voice") as HTMLSelectElement | null;
        const namen = s ? [...s.options].map((o) => o.textContent ?? "") : [];
        cleanup();
        return namen;
      };
      const es = angebot("es");
      expect(es.some((n) => n.includes("Mónica"))).toBe(true);
      expect(es.some((n) => n.includes("Paulina"))).toBe(true);
      expect(es.findIndex((n) => n.includes("Mónica"))).toBeLessThan(es.findIndex((n) => n.includes("Anna")));
      const fr = angebot("fr");
      expect(fr.some((n) => n.includes("Thomas"))).toBe(true);
      // Weg „de": wie bisher nur Deutsch und Englisch, Deutsch zuerst.
      const de = angebot("de");
      expect(de.some((n) => n.includes("Mónica") || n.includes("Thomas"))).toBe(false);
      expect(de.findIndex((n) => n.includes("Anna"))).toBeLessThan(de.findIndex((n) => n.includes("Samantha")));
    } finally {
      act(() => useVoice.getState().setEnabled(false));
    }
  });
});

describe("Seite: die wirksame Sprache und der Sprachschalter (Quelltext)", () => {
  const q = readFileSync(resolve(__dirname, "../src/features/public/TippenTrainerPage.tsx"), "utf-8");
  it("die Übungssprache der Seite geht durch uebungsSpracheImWeg", () => {
    expect(q).toMatch(/const lang: Lang = uebungsSpracheImWeg\(/);
    expect(q).not.toMatch(/const lang: Lang = isPupil \? \(account\?\.lang \?\? "de"\) : localLang;/);
  });
  it("der Sprachschalter zieht nur eine Sprache des Weges mit", () => {
    const i = q.indexOf("useBeimSprachSchalter((neu)");
    expect(i).toBeGreaterThan(0);
    expect(q.slice(i, i + 1400)).toContain("uebungsSprachenImWeg(lernweg).includes(neu)");
  });
  it("★ D1 Nr. 18: auf einem Weg mit Hauptsprache zieht der Sprachschalter nichts mit", () => {
    const i = q.indexOf("useBeimSprachSchalter((neu)");
    expect(q.slice(i, i + 1400)).toContain("if (hauptspracheDesWeges(lernweg)) return;");
  });
});

describe("Klasse: was für die ganze Klasse gebaut und angezeigt wird", () => {
  it("klassenUebungsSprache: gespeicherte Sprache, wenn sie zum Weg passt, sonst die des Weges", () => {
    expect(klassenUebungsSprache({ lang: "de", lernweg: "fr" })).toBe("fr");
    expect(klassenUebungsSprache({ lang: "de", lernweg: "es" })).toBe("es");
    expect(klassenUebungsSprache({ lang: "en" })).toBe("en"); // Weg fehlt = „de", Englisch frei
    expect(klassenUebungsSprache({})).toBe("de");
    expect(klassenUebungsSprache({ lang: "es" })).toBe("de"); // S8 umgekehrt
    // ★ D1 Nr. 18: eine fr/es-Klasse darf Englisch üben, Deutsch nie.
    expect(klassenUebungsSprache({ lang: "en", lernweg: "fr" })).toBe("en");
    expect(klassenUebungsSprache({ lang: "en", lernweg: "es" })).toBe("en");
  });

  it("Quelltext: Kurzstand, Klassen-Einstellungen, Tippchallenge und Eigene Übung lesen die geltende Sprache", () => {
    const dateien = [
      "components/lernwerkstatt/klasse/TastenflowReiter.tsx",
      "components/lernwerkstatt/klasse/SchreibprobeKasten.tsx",
      "components/lernwerkstatt/klasse/EigeneUebungKasten.tsx",
    ];
    for (const d of dateien) {
      const q = readFileSync(resolve(__dirname, "../src", d), "utf-8");
      expect(q, d).not.toMatch(/(cls|klasse)\.lang \?\? "de"/);
      expect(q, d).toContain("klassenUebungsSprache(");
    }
  });
});
