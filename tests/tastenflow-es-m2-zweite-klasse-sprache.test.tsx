/**
 * ★★★★★ WÄCHTER (ES-M2, 27.09.2026, Prüfbericht ES-P2 M3):
 * AUCH DIE ZWEITE KLASSE BEKOMMT DIE SPRACHE IHRES WEGES.
 *
 * Befund M3: Nach dem Anlegen setzte `KlasseUndKinder` die Sprache für die
 * nächste Klasse mit `sprache === "en" ? "en" : "de"` zurück - der
 * Anfangswert kannte fr/es, das Zurücksetzen nicht. Die ZWEITE Klasse einer
 * spanischen (französischen) Lehrkraft wurde mit Weg „es" („fr") und
 * Übungssprache Deutsch gespeichert; `mitKlassenVorrang` gab jedem Kind die
 * Sprache der Klasse.
 *
 * Geprüft über die Fehlerklasse: JEDE Bedienung, mit und ohne Schalter der
 * Lehrgänge, ZWEI Klassen nacheinander in derselben Sitzung - beide mit
 * derselben Sprache, und die passt zum Weg der Klasse. Dazu die Gegenprobe
 * gegen die alte Zeile.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const bedien = vi.hoisted(() => ({ sprache: "es" as "de" | "en" | "fr" | "es" }));

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: bedien.sprache,
      spracheGewaehlt: bedien.sprache,
      setzeSprache: () => {},
      bereichAktiv: true,
      wechsle: () => {},
      beimSchalter: () => () => {},
    }),
  };
});

import { KlasseUndKinder } from "@/components/lernwerkstatt/klasse/KlasseUndKinder";
import { vergissGeladeneKlasse } from "@/components/typing/useTypingAuth";
import type { TypingAccount } from "@/lib/typing";
import { _resetTypingBackend } from "@/lib/typing/backend";
import {
  getClass,
  neueKlassenSprache,
  registerTeacher,
  uebungsSprachenImWeg,
} from "@/lib/typing/account";
import {
  LEHRGANG_PROBE_MERKER_ES,
  LEHRGANG_PROBE_MERKER_FR,
  LERNWEGE_LISTE,
  lernwegVon,
} from "@/lib/typing/lernweg";

/** Die Beschriftungen des Anlege-Formulars je Bedienung. */
const FELDER = {
  de: { name: "Klassenname", stufe: "Schulstufe der neuen Klasse", start: "Startniveau für alle Kinder der neuen Klasse", knopf: "Klasse anlegen" },
  en: { name: "Class name", stufe: "Year group for the new class", start: "Starting point for all pupils in the new class", knopf: "Create a class" },
  fr: { name: "Nom de la classe", stufe: "Niveau scolaire de la nouvelle classe", start: "Niveau de départ pour tous les élèves de la nouvelle classe", knopf: "Créer la classe" },
  es: { name: "Nombre de la clase", stufe: "Curso de la clase nueva", start: "Nivel de partida para todo el alumnado de la clase nueva", knopf: "Crear la clase" },
} as const;

function lehrkraft(): TypingAccount {
  const t = registerTeacher("Lehrkraft", `m3-${Math.random()}@example.org`, "geheim123");
  if (!t.ok) throw new Error(t.error);
  return t.value;
}

function zeige(teacher: TypingAccount) {
  render(
    <KlasseUndKinder
      teacher={teacher}
      classes={[]}
      cls={null}
      pupils={[]}
      offeneProgramme={[]}
      einstiegsProgramm="tippen"
      onSelectClass={() => {}}
      onChanged={() => {}}
    />,
  );
}

async function anlegen(name: string) {
  const f = FELDER[bedien.sprache];
  fireEvent.change(screen.getByLabelText(f.name), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(f.stufe), { target: { value: "5" } });
  const start = screen.getByLabelText(f.start) as HTMLSelectElement;
  const wert = [...start.options].map((o) => o.value).filter((v) => v && v !== "0")[1];
  fireEvent.change(start, { target: { value: wert } });
  fireEvent.click(screen.getByRole("button", { name: f.knopf }));
  await vi.waitFor(() => expect(getClass(name.toUpperCase())).toBeTruthy());
  // Das Formular ist erst nach dem Zurücksetzen bereit für die nächste Klasse -
  // genau dort sass der Fehler.
  await vi.waitFor(() => expect((screen.getByLabelText(f.name) as HTMLInputElement).value).toBe(""));
  return getClass(name.toUpperCase())!;
}

beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
  vergissGeladeneKlasse();
  window.history.replaceState(null, "", "/");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("M3: zwei Klassen nacheinander - jede Bedienung, mit und ohne Schalter", () => {
  for (const sprache of ["de", "en", "fr", "es"] as const) {
    for (const schalter of [true, false]) {
      it(`Bedienung ${sprache}, Schalter ${schalter ? "an" : "aus"}`, async () => {
        bedien.sprache = sprache;
        if (schalter) {
          localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "1");
          localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "1");
        }
        zeige(lehrkraft());
        const erste = await anlegen("5a");
        const zweite = await anlegen("5b");
        const weg = lernwegVon(zweite);
        expect(zweite.lang, "zweite wie erste").toBe(erste.lang);
        expect(lernwegVon(erste)).toBe(weg);
        expect(uebungsSprachenImWeg(weg), `Weg ${weg}, Sprache ${zweite.lang}`).toContain(zweite.lang);
        expect(zweite.lang).toBe(neueKlassenSprache(sprache, weg));
        // Mit Schalter: die spanische/französische Lehrkraft bekommt ihre Sprache - beide Male.
        if (schalter && (sprache === "es" || sprache === "fr")) {
          expect(weg).toBe(sprache);
          expect(zweite.lang).toBe(sprache);
        }
      });
    }
  }
});

describe("die Vorgabe (account.ts) und die Gegenprobe", () => {
  it("jede Bedienung × jeder Weg: die Vorgabe ist eine Sprache des Weges", () => {
    for (const s of ["de", "en", "fr", "es"] as const)
      for (const w of LERNWEGE_LISTE) expect(uebungsSprachenImWeg(w)).toContain(neueKlassenSprache(s, w));
    // Weg „de": wie bisher - englische Bedienung ⇒ Englisch, sonst Deutsch.
    expect(neueKlassenSprache("en", "de")).toBe("en");
    expect(neueKlassenSprache("de", "de")).toBe("de");
    expect(neueKlassenSprache("es", "de")).toBe("de");
    expect(neueKlassenSprache("fr", "de")).toBe("de");
  });

  it("GEGENPROBE: die alte Zeile gab der zweiten Klasse auf Weg es/fr Deutsch", () => {
    const alt = (s: string) => (s === "en" ? "en" : "de");
    expect(uebungsSprachenImWeg("es")).not.toContain(alt("es"));
    expect(uebungsSprachenImWeg("fr")).not.toContain(alt("fr"));
  });

  it("Quelltext: Anfangswert und Zurücksetzen aus EINER Funktion", () => {
    const q = readFileSync(
      resolve(__dirname, "../src/components/lernwerkstatt/klasse/KlasseUndKinder.tsx"),
      "utf-8",
    );
    expect(q).not.toContain('setNeuLang(sprache === "en" ? "en" : "de")');
    expect(q.match(/neueKlassenSprache\(sprache, neuerKlassenWeg\)/g)?.length).toBe(2);
  });
});
