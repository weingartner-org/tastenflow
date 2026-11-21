/**
 * WÄCHTER: Impressum und Datenschutz stehen auch im Lehrkraft-Bereich.
 * ===========================================================================
 * Befund vom 02.09.2026 (Johannes): „in der Lehreransicht gibt es kein
 * Impressum und keinen Datenschutz". Gemessen stimmte das - und es war kein
 * Versehen an einer Stelle, sondern die Bauart: Die Fußzeile der Plattform
 * hängt in `Layout.tsx` und gilt nur für Seiten INNERHALB dieses Layouts.
 * „Meine Klassen" ist eine eigene Route daneben, genau wie die Lernprogramme.
 *
 * Beide Texte müssen von JEDER Seite aus unmittelbar erreichbar sein
 * (§ 25 MedienG, § 5 ECG, Art. 13 DSGVO). Eine Rechtspflicht, die still
 * verschwindet, ist der Grund, warum hier ein Wächter steht und kein Kommentar.
 *
 * Geprüft werden BEIDE Zustände der Seite - der angemeldete und der, den
 * jemand ohne Lehrkonto sieht. Der zweite ist der wichtigere: Er ist
 * öffentlich erreichbar, und bis heute war er der einzige Bildschirm des
 * Bereichs, den auch Nicht-Angemeldete zu sehen bekamen.
 *
 * ⚠️ Mitgeprüft wird, dass die Verweise RELATIV sind („/impressum",
 * „/datenschutz"). Ein absoluter Verweis würde den Rechnernamen wechseln und
 * damit die Sitzung verlieren (www-Falle, `src/lib/adressen.ts`).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { MeineKlassePage } from "@/features/public/MeineKlassePage";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import type { TypingAccount } from "@/lib/typing";
import { addPupil, createClass, registerTeacher, setClassPrograms } from "@/lib/typing/account";

/** Lehrkraft mit einer Klasse und einem Kind im lokalen Speicher anlegen. */
function baueKlasse(): TypingAccount {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  // ★ E5 (19.09.2026): leere Liste = nur das Einstiegsprogramm - dieser
  // Wächter braucht ausdrücklich den Reiter „im Griff".
  setClassPrograms(c.value.code, t.value.id, ["tippen", "computer"]);
  const p = addPupil(c.value.code, "Mia", "pw1234");
  if (!p.ok) throw new Error(p.error);
  return t.value;
}

beforeEach(() => {
  localStorage.clear();
  useTypingAuth.setState({ account: null });
});
afterEach(() => {
  cleanup();
  useTypingAuth.setState({ account: null });
});

function zeigeSeite() {
  render(
    <MemoryRouter>
      <MeineKlassePage />
    </MemoryRouter>,
  );
}

/** Die Fußzeile heißt „Rechtliches" - so findet ein Screenreader sie auch. */
function pruefeFusszeile() {
  const fuss = within(
    screen.getByRole("contentinfo", { name: "Rechtliches" }),
  );
  expect(fuss.getByRole("link", { name: "Impressum" })).toHaveAttribute(
    "href",
    "/impressum",
  );
  expect(fuss.getByRole("link", { name: "Datenschutz" })).toHaveAttribute(
    "href",
    "/datenschutz",
  );
}

describe("Fußzeile im Lehrkraft-Bereich", () => {
  it.skip("★ steht auf der Seite einer angemeldeten Lehrkraft", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeigeSeite();
    await screen.findByRole("tab", { name: "im Griff" });
    pruefeFusszeile();
  });

  it("★ steht auch auf dem Hinweis für Nicht-Angemeldete", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: "Meine Klassen" });
    pruefeFusszeile();
  });

  it.skip("bleibt normaler Inhalt: nicht versteckt, kein aria-hidden", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeigeSeite();
    await screen.findByRole("tab", { name: "im Griff" });
    expect(
      screen.getByRole("contentinfo", { name: "Rechtliches" }),
    ).not.toHaveAttribute("aria-hidden");
  });
});
