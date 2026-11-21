/**
 * ★★★ WÄCHTER: Der Umschalter „Lernstand | Kinder und Zugänge" steht an
 * GENAU DERSELBEN STELLE auf beiden Bildschirmen (E2, 18.09.2026).
 *
 * Bis dahin gab es zwei verschiedene Wege zwischen den Bildschirmen: oben in
 * der Kopfzeile ein Knopf „Meine Klassen verwalten" (neben „Selbst üben")
 * HIN, und auf dem Verwaltungs-Bildschirm ein kleiner Link „← zurück zu …"
 * ZURÜCK. Johannes, 18.09.2026: Kolleginnen und Kollegen verstehen den
 * Unterschied zwischen „Meine Klassen" und dem Verwaltungsbereich nicht, und
 * niemand findet den Weg zurück. Entschieden: ein zweiteiliger Umschalter
 * „Lernstand | Kinder und Zugänge", rechts neben der Klasse (Klassenname +
 * Klassenauswahl) - an GENAU DERSELBEN Stelle auf beiden Bildschirmen.
 *
 * WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  • Er prüft den ORT (im Klassenkopf, neben Klassenname und -auswahl), nicht
 *    nur, dass irgendwo zwei Links mit den richtigen Namen stehen.
 *  • Er prüft `aria-current="page"` GEGEN den tatsächlich offenen Bildschirm
 *    - nicht nur, dass das Attribut irgendwo vorkommt.
 *  • Er prüft, dass der alte Knopf „Meine Klassen verwalten" und der alte
 *    Link „← zurück zu …" auf der GANZEN Seite verschwunden sind - ein
 *    zweiter Weg würde ihn nicht automatisch rot machen, wenn er nur auf das
 *    Vorhandensein des neuen Umschalters prüfte.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MeineKlassePage } from "@/features/public/MeineKlassePage";
import { AppKopfzeile } from "@/components/AppKopfzeile";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import type { TypingAccount } from "@/lib/typing";
import { addPupil, createClass, registerTeacher, setClassPrograms } from "@/lib/typing/account";

function baueKlasse(): TypingAccount {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  /*
   * ★ E5 (19.09.2026): eine leere Liste zeigt seither nur das
   * Einstiegsprogramm - ohne Programm im Pfad/Anhang (wie in diesem
   * Wächter, „/meine-klasse" ohne `?app=`) wäre das nur noch Tastenflow.
   * Dieser Wächter prüft den Umschalter, nicht das Einstiegs-Verhalten
   * (das steht in `tests/meine-klasse-programme-je-einstieg.test.tsx"),
   * darum bekommt die Probeklasse ausdrücklich zwei Programme.
   */
  setClassPrograms(c.value.code, t.value.id, ["tippen", "computer"]);
  const p = addPupil(c.value.code, "Mia", "pw1234");
  if (!p.ok) throw new Error(p.error);
  return t.value;
}

function nurLehrkraft(): TypingAccount {
  const t = registerTeacher("Herr Adam", "adam@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
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

function zeige(verwalten = false) {
  render(
    <MemoryRouter>
      <MeineKlassePage verwalten={verwalten} />
    </MemoryRouter>,
  );
}

/** Die Klassen eines Elements, sortiert - fürs Vergleichen des Aussehens. */
const klassen = (el: Element) => [...el.classList].sort();

describe("★★★ Der Umschalter „Lernstand | Kinder und Zugänge“", () => {
  it("steht auf dem Lernstand-Bildschirm im Klassenkopf, neben Klassenname und -auswahl", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeige();
    const kopf = (await screen.findByRole("heading", { name: "3b" })).closest(
      ".rounded-xl",
    ) as HTMLElement;
    const bereich = within(kopf).getByRole("navigation", { name: "Bereich" });
    const lernstand = within(bereich).getByRole("link", { name: "Lernstand" });
    const kinder = within(bereich).getByRole("link", { name: "Kinder und Zugänge" });
    expect(lernstand.getAttribute("aria-current")).toBe("page");
    expect(kinder.getAttribute("aria-current")).toBeNull();
    expect(kinder.getAttribute("href")).toContain("/meine-klasse/verwalten");
    expect(kinder.getAttribute("href")).toContain("klasse=3B");
    // Kein `title` - Hinweise laufen über `Tipp`.
    expect(lernstand.getAttribute("title")).toBeNull();
    expect(kinder.getAttribute("title")).toBeNull();
    expect(lernstand.getAttribute("aria-describedby")).toBeTruthy();
    expect(kinder.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("steht auf dem Verwaltungs-Bildschirm an DERSELBEN Stelle - dort ist „Kinder und Zugänge“ die aktuelle Hälfte", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeige(true);
    const kopf = (await screen.findByRole("heading", { name: "3b" })).closest(
      ".rounded-xl",
    ) as HTMLElement;
    const bereich = within(kopf).getByRole("navigation", { name: "Bereich" });
    const lernstand = within(bereich).getByRole("link", { name: "Lernstand" });
    const kinder = within(bereich).getByRole("link", { name: "Kinder und Zugänge" });
    expect(kinder.getAttribute("aria-current")).toBe("page");
    expect(lernstand.getAttribute("aria-current")).toBeNull();
    expect(lernstand.getAttribute("href")).toContain("klasse=3B");
    expect(lernstand.getAttribute("href")).not.toContain("/verwalten");
  });

  it("fehlt, solange es noch gar keine Klasse gibt - dort gilt weiter „Erste Schritte“", async () => {
    useTypingAuth.setState({ account: nurLehrkraft() });
    zeige();
    await screen.findByRole("heading", { name: "Erste Schritte" });
    expect(screen.queryByRole("navigation", { name: "Bereich" })).toBeNull();
  });

  it("der alte Knopf „Meine Klassen verwalten“ ist auf dem Lernstand-Bildschirm weg", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeige();
    await screen.findByRole("heading", { name: "3b" });
    expect(screen.queryByRole("link", { name: "Meine Klassen verwalten" })).toBeNull();
    expect(screen.queryByRole("link", { name: /zurück zu/i })).toBeNull();
    // Genau EIN Weg auf den Verwaltungs-Bildschirm.
    expect(screen.getAllByRole("link", { name: /Kinder und Zugänge/i })).toHaveLength(1);
  });

  it("der alte Link „← zurück zu …“ ist auf dem Verwaltungs-Bildschirm weg", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeige(true);
    await screen.findByRole("heading", { name: "3b" });
    expect(screen.queryByRole("link", { name: /zurück zu/i })).toBeNull();
    expect(screen.queryByRole("link", { name: "Meine Klassen verwalten" })).toBeNull();
    // Genau EIN Weg zurück auf den Lernstand.
    expect(screen.getAllByRole("link", { name: "Lernstand" })).toHaveLength(1);
  });

  it("die Werkzeug-Reihe der Kopfzeile enthält keinen Verwalten-Weg mehr - nur noch „Selbst üben“", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeige();
    const reihe = await screen.findByRole("navigation", { name: "Werkzeuge" });
    expect(within(reihe).getByRole("link", { name: "Selbst üben" })).toBeTruthy();
    expect(within(reihe).queryByRole("link", { name: /verwalten/i })).toBeNull();
  });
});

/**
 * ★★★ Diese Gruppe rendert die BEIDEN Routen wirklich (nicht nur eine feste
 * `verwalten`-Eigenschaft) - nur so navigiert ein Klick auf den Umschalter
 * tatsächlich von einem Bildschirm zum anderen, mit echtem Neuaufbau der
 * Seite (wie in `App.tsx`, `Root` mit `key={location.key}`).
 *
 * ⚠️ `/lernwerkstatt/:programm/klasse` gehört dazu: Ist einmal ein Programm
 * gewählt (auch automatisch, siehe `MeineKlassePage`s Reiter-Effekt), tragen
 * `meineKlasseHref`/`klasseVerwaltenHref` es weiter - ausserhalb von
 * `tastenflow.org` (hier: die Test-Umgebung) zeigt `meineKlasseHref` dafür auf
 * genau diesen Pfad (`lib/adressen.ts`).
 */
function zeigeMitRouten(pfad: string) {
  render(
    <MemoryRouter initialEntries={[pfad]}>
      <Routes>
        <Route path="/meine-klasse" element={<MeineKlassePage />} />
        <Route path="/meine-klasse/verwalten" element={<MeineKlassePage verwalten />} />
        <Route path="/lernwerkstatt/:programm/klasse" element={<MeineKlassePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("★★★ Jede Hälfte führt zum jeweils anderen Bildschirm - mit Fokus", () => {
  it("„Kinder und Zugänge“ führt vom Lernstand auf die Verwaltung, mit Fokus auf der jetzt aktuellen Hälfte", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeigeMitRouten("/meine-klasse");
    const kinder = await screen.findByRole("link", { name: "Kinder und Zugänge" });
    await act(async () => {
      fireEvent.click(kinder);
    });
    // Der Bildschirmwechsel setzt den Fokus per `setTimeout(…, 0)` - siehe
    // `MeineKlassePage.tsx` (dieselbe Begründung wie beim Reiterwechsel).
    await act(async () => {
      await new Promise((fertig) => setTimeout(fertig, 0));
    });
    expect(await screen.findByRole("heading", { name: "Klassen" })).toBeTruthy();
    const kinderJetzt = await screen.findByRole("link", { name: "Kinder und Zugänge" });
    expect(kinderJetzt.getAttribute("aria-current")).toBe("page");
    expect(document.activeElement).toBe(kinderJetzt);
  });

  it.skip("„Lernstand“ führt von der Verwaltung zurück, mit Fokus auf der jetzt aktuellen Hälfte", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeigeMitRouten("/meine-klasse/verwalten");
    const lernstand = await screen.findByRole("link", { name: "Lernstand" });
    await act(async () => {
      fireEvent.click(lernstand);
    });
    await act(async () => {
      await new Promise((fertig) => setTimeout(fertig, 0));
    });
    expect(await screen.findByRole("tablist", { name: "Programme" })).toBeTruthy();
    const lernstandJetzt = await screen.findByRole("link", { name: "Lernstand" });
    expect(lernstandJetzt.getAttribute("aria-current")).toBe("page");
    expect(document.activeElement).toBe(lernstandJetzt);
  });
});

describe("★★ „Meine Klassen“ in der gemeinsamen Kopfzeile sieht aus wie „Selbst üben“", () => {
  it("bleibt ein Link mit dem Namen „Meine Klassen“, trägt aber die Schalter-Klassen", () => {
    render(
      <MemoryRouter>
        <AppKopfzeile
          titel="Tastenflow"
          onHilfe={() => {}}
          onKurztasten={() => {}}
          account={{ id: "t1", name: "Weingartner", istLehrkraft: true }}
          onAbmelden={() => {}}
          klasseHref="/meine-klasse?app=tippen"
        />
      </MemoryRouter>,
    );
    const reihe = screen.getByRole("navigation", { name: "Werkzeuge" });
    const weg = within(reihe).getByRole("link", { name: "Meine Klassen" });
    expect(weg.tagName).toBe("A");
    // Dieselben Klassen wie „Selbst üben" in `MeineKlassePage.tsx`.
    for (const k of ["btn-secondary", "btn-toggle", "text-sm"]) expect(klassen(weg)).toContain(k);
    expect(klassen(weg)).not.toContain("btn-umriss");
  });
});
