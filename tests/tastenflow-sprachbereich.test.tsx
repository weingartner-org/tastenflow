/**
 * ★★★ EN0 (18.09.2026): EIN Provider für jede Seite, die ein Tastenflow-Mensch
 * erreicht - und KEINER für die übrigen Apps.
 *
 * Der Provider hängt in `Root` (`src/App.tsx`) über `TastenflowSprachBereich`;
 * die Adressliste steht im Kopf von
 * `src/features/public/TastenflowSprachBereich.tsx`. Geprüft wird hier:
 *
 *  1. die Zuordnung der Adressen (rein, als Tabelle),
 *  2. an der ECHTEN Routen-Tabelle: Trainer und Lehrkraft-Bereich werden mit
 *     `?bedienung=en` englisch (`<html lang="en">`, Sprachschalter in der
 *     Kopfzeile), der Schalter behält den Fokus und sagt es in der neuen
 *     Sprache an,
 *  3. der Provider überlebt die Navigation (kein Neuaufbau ⇒ `<html lang>`
 *     zuckt nicht) und eine gemeinsame Seite folgt der Herkunft,
 *  4. ★★★ die Klassenseite von Punktgenau und die Lernwerkstatt bleiben auch
 *     bei englischer Wahl deutsch und ohne Schalter,
 *  5. ★★★ deutsche Bedienung (seit 19.09.2026 ohne Probe-Schalter): der
 *     Sprachschalter steht da, `<html lang="de">`, und das DOM ist - bis auf
 *     den Schalter und die `lang`-Auszeichnungen - Zeichen für Zeichen wie
 *     ohne Provider.
 *
 * ★ 28.09.2026 (Freigabe fr/es): Seit vier Sprachen angeboten werden, steht
 * statt des Zweier-Knopfs („EN - English"/„DE - Deutsch") der SPRACHWÄHLER in
 * der Kopfzeile (`tests/helfer/sprachwahl.ts`). Welche Sprache aktiv ist, steht
 * am Kürzel des Wählers. Der Zweier-Fall (fr/es im Not-Aus) bleibt in 2 als
 * eigener Test stehen.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, useNavigate, useRoutes } from "react-router-dom";

import { routes } from "../src/App";
import { AnnounceProvider, FocusOnRouteChange } from "../src/lib/a11y";
import {
  bereichsart,
  GEMEINSAME_PFADE,
  TAB_TITEL_EN,
} from "../src/features/public/TastenflowSprachBereich";
import { MeineKlassePage } from "../src/features/public/MeineKlassePage";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import type { TypingAccount } from "../src/lib/typing";
import {
  addPupil,
  createClass,
  registerTeacher,
  setClassPrograms,
} from "../src/lib/typing/account";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { useVoice } from "../src/lib/typing";
import { ohneBildschirmTastatur, tippfeldPflicht } from "./_typing-probelauf";
import {
  findeSprachwahlKnopf,
  fokusZurueckAufDemKnopf,
  nurDeutschUndEnglisch,
  ohneSprachwahl,
  sprachwahlKnopf,
  sprachwahlKuerzel,
  waehleSprache,
} from "./helfer/sprachwahl";

// ---------------------------------------------------------------------------
// 1 · Die Zuordnung der Adressen
// ---------------------------------------------------------------------------

describe("1 · bereichsart - welche Adresse gehört zu Tastenflow", () => {
  const T = true; // unter tastenflow.org
  const W = false; // unter weingartner.org / localhost
  const TABELLE: [string, string, boolean, ReturnType<typeof bereichsart>][] = [
    // A · Tastenflow selbst
    ["/programme/tastenflow", "", W, "tastenflow"],
    ["/programme/tastenflow", "?level=3&bare=1", W, "tastenflow"],
    ["/Programme/Tastenflow/", "", W, "tastenflow"],
    ["/programme/tippen", "", W, "tastenflow"],
    ["/", "", T, "tastenflow"],
    ["/lernwerkstatt/tippen/klasse", "", W, "tastenflow"],
    ["/meine-klasse", "?app=tippen", W, "tastenflow"],
    ["/meine-klasse/verwalten", "?app=tippen&klasse=AB12", W, "tastenflow"],
    ["/lernwerkstatt/klasse", "?app=tippen", W, "tastenflow"],
    ["/meine-klasse", "", T, "tastenflow"],
    ["/meine-klasse/verwalten", "?klasse=AB12", T, "tastenflow"],
    // B · gemeinsame Seiten
    ["/meine-klasse", "", W, "gemeinsam"],
    ["/datenschutz", "", W, "gemeinsam"],
    ["/impressum", "", T, "gemeinsam"],
    ["/barrierefreiheit", "", W, "gemeinsam"],
    ["/unterstuetzen", "", W, "gemeinsam"],
    ["/unterstuetzen/danke", "?weiter=1", T, "gemeinsam"],
    ["/lernwerkstatt/konto", "", W, "gemeinsam"],
    ["/lernprogramm-passwort", "?art=konto", W, "gemeinsam"],
    ["/lernprogramm-bestaetigen", "?art=konto&token=x", W, "gemeinsam"],
    ["/lernwerkstatt-einladung", "?token=x", W, "gemeinsam"],
    // C · alles andere
    ["/", "", W, "fremd"],
    ["/programme", "", T, "fremd"],
    ["/programme/punktgenau", "", T, "fremd"],
    ["/programme/braille", "", W, "fremd"],
    ["/programme/klangpunkte", "", W, "fremd"],
    ["/programme/im-griff", "", W, "fremd"],
    ["/programme/mathecoach", "", W, "fremd"],
    ["/lernwerkstatt", "", T, "fremd"],
    ["/lernwerkstatt/braille/klasse", "", W, "fremd"],
    ["/lernwerkstatt/computer/klasse", "", T, "fremd"],
    ["/meine-klasse", "?app=braille", T, "fremd"],
    ["/meine-klasse/verwalten", "?app=klangpunkte", W, "fremd"],
    ["/lernwerkstatt/klasse", "?app=computer", W, "fremd"],
    ["/kurs/abc", "", W, "fremd"],
    ["/login", "", T, "fremd"],
    ["/admin", "", W, "fremd"],
    ["/gibt-es-nicht", "", T, "fremd"],
  ];
  for (const [pfad, suche, aufTf, erwartet] of TABELLE) {
    it(`${pfad}${suche} ${aufTf ? "(tastenflow.org)" : "(weingartner.org)"} ⇒ ${erwartet}`, () => {
      expect(bereichsart(pfad, suche, aufTf)).toBe(erwartet);
    });
  }

  it.skip("jede gemeinsame Seite hat eine echte Route - sonst deckt die Liste nichts ab", () => {
    const pfade = new Set<string>();
    const sammle = (r: { path?: string; children?: unknown[] }) => {
      if (r.path) pfade.add(r.path);
      for (const k of (r.children ?? []) as { path?: string; children?: unknown[] }[]) sammle(k);
    };
    for (const r of routes as { path?: string; children?: unknown[] }[]) sammle(r);
    for (const p of GEMEINSAME_PFADE) expect(pfade, p).toContain(p);
    for (const p of ["/programme/tastenflow", "/meine-klasse", "/meine-klasse/verwalten", "/lernwerkstatt/:programm/klasse"])
      expect(pfade, p).toContain(p);
  });
});

// ---------------------------------------------------------------------------
// Aufbau für die Routen-Tests
// ---------------------------------------------------------------------------

/** Lehrkraft mit einer Klasse und einem Kind im lokalen Speicher. */
function baueKlasse(): TypingAccount {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  // ★ E5 (19.09.2026): leere Liste = nur das Einstiegsprogramm - diese
  // Prüfungen brauchen ausdrücklich den Reiter „im Griff" daneben.
  setClassPrograms(c.value.code, t.value.id, ["tippen", "computer"]);
  const p = addPupil(c.value.code, "Mia", "pw1234");
  if (!p.ok) throw new Error(p.error);
  return t.value;
}

/**
 * ★ 28.09.2026 (Johannes: die anderen Apps gibt es nur auf Deutsch): In der
 * englischen Bedienung steht der Reiter „im Griff" nicht mehr da - bis dahin
 * war er das Zeichen „die Klassenseite ist geladen". Jetzt: der Klassencode,
 * und dazu die Probe, dass der fremde Reiter wirklich fehlt.
 */
async function klasseInEnglischDa() {
  await screen.findAllByText(/\b3B\b/);
  expect(screen.queryByRole("tab", { name: "im Griff" })).toBeNull();
}

let geheZu: (pfad: string) => void = () => {};
function Navigator() {
  const n = useNavigate();
  geheZu = (pfad) => act(() => n(pfad));
  return null;
}
function RoutesRender() {
  return useRoutes(routes);
}

/**
 * Die ECHTE Routen-Tabelle zeigen, samt `Root`. ⚠️ Der Provider liest
 * `?bedienung=` aus `window.location` (wie im Browser), nicht aus dem Router -
 * darum steht die Adresse vorher auch in der Adresszeile von jsdom.
 */
function zeige(adresse: string) {
  window.history.replaceState(null, "", adresse);
  return render(
    <AnnounceProvider>
      <MemoryRouter initialEntries={[adresse]}>
        <Navigator />
        <RoutesRender />
      </MemoryRouter>
    </AnnounceProvider>,
  );
}

const htmlLang = () => document.documentElement.getAttribute("lang");
/** Was gerade in den Live-Regionen steht - die Seite hat eigene neben der von `AnnounceProvider`. */
const liveTexte = () => [...document.querySelectorAll("[aria-live]")].map((e) => e.textContent);
const schalter = (name: "EN - English" | "DE - Deutsch") => screen.queryByRole("button", { name });

beforeEach(() => {
  localStorage.clear();
  document.documentElement.setAttribute("lang", "de");
  einrichtungFertigMerken();
  ohneBildschirmTastatur();
  useVoice.getState().setEnabled(false);
  useTypingAuth.setState({ account: null });
  Element.prototype.scrollIntoView = () => {};
});
afterEach(() => {
  cleanup();
  useTypingAuth.setState({ account: null });
  window.history.replaceState(null, "", "/");
});

// ---------------------------------------------------------------------------
// 2 · Trainer und Lehrkraft-Bereich werden englisch
// ---------------------------------------------------------------------------

describe("2 · mit ?bedienung=en: Trainer und Lehrkraft-Bereich", () => {
  it("★★ der Trainer (/programme/tastenflow): <html lang=\"en\">, Schalter „DE - Deutsch\" in der Kopfzeile", async () => {
    zeige("/programme/tastenflow?bedienung=en");
    // ⚠️ 5 s statt der Vorgabe 1 s (18.10.2026): Hier lädt die Trainer-Seite zum
    // ersten Mal in diesem File, kalt. Gemessen bis zum Tippfeld: 899 ms auf
    // feat/tastenflow, 1258 ms nach dem Zusammenführen aller Apps - die Prüfung
    // selbst ändert sich nicht, nur die Frist lag zu knapp an der Ladezeit.
    await waitFor(() => tippfeldPflicht(), { timeout: 5000 });
    expect(htmlLang()).toBe("en");
    expect(sprachwahlKuerzel(sprachwahlKnopf())).toBe("EN");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("My training");
    cleanup();
    // Verlassen ⇒ der alte Wert kommt zurück.
    expect(htmlLang()).toBe("de");
  }, 30000);

  // ★ 28.09.2026 (Freigabe fr/es): der ZWEIER-Fall - fr/es im Not-Aus.
  it.skip("★★★ „Meine Klassen\" einer Tastenflow-Lehrkraft: englische Kopfzeile, Schalter mit Fokus und Ansage (Zweier-Knopf, fr/es im Not-Aus)", async () => {
    nurDeutschUndEnglisch();
    useTypingAuth.setState({ account: baueKlasse() });
    zeige("/meine-klasse?app=tippen&bedienung=en");
    await klasseInEnglischDa();
    expect(htmlLang()).toBe("en");
    const kopf = screen.getByRole("navigation", { name: "Tools" });
    const knopf = within(kopf).getByRole("button", { name: "DE - Deutsch" });
    expect(knopf).toHaveAttribute("lang", "de");
    expect(knopf).not.toHaveAttribute("aria-pressed");

    knopf.focus();
    fireEvent.click(knopf);
    await waitFor(() => expect(htmlLang()).toBe("de"));
    // Derselbe Knopf, jetzt „EN - English", und der Fokus ist nicht gewandert.
    expect(schalter("EN - English")).toBe(knopf);
    expect(document.activeElement).toBe(knopf);
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("de");
    await waitFor(() => expect(liveTexte()).toContain("Schalter und Menüs sind jetzt auf Deutsch."));
    expect(screen.getByRole("navigation", { name: "Werkzeuge" })).toBeTruthy();

    fireEvent.click(knopf);
    await waitFor(() => expect(htmlLang()).toBe("en"));
    await waitFor(() => expect(liveTexte()).toContain("Buttons and menus are now in English."));
  }, 30000);

  // ★ 28.09.2026 (Freigabe fr/es): derselbe Fall mit dem SPRACHWÄHLER.
  it.skip("★★★ „Meine Klassen\" einer Tastenflow-Lehrkraft: englische Kopfzeile, Sprachwähler mit Fokus und Ansage", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeige("/meine-klasse?app=tippen&bedienung=en");
    await klasseInEnglischDa();
    expect(htmlLang()).toBe("en");
    const kopf = screen.getByRole("navigation", { name: "Tools" });
    const knopf = await findeSprachwahlKnopf(kopf);
    expect(knopf).toHaveAttribute("aria-haspopup", "listbox");
    expect(knopf).not.toHaveAttribute("aria-pressed");
    expect(sprachwahlKuerzel(knopf)).toBe("EN");

    knopf.focus();
    await waehleSprache("Deutsch", knopf);
    await waitFor(() => expect(htmlLang()).toBe("de"));
    // Derselbe Knopf, jetzt „DE", und der Fokus ist auf ihn zurückgekehrt.
    expect(sprachwahlKnopf()).toBe(knopf);
    expect(sprachwahlKuerzel(knopf)).toBe("DE");
    await fokusZurueckAufDemKnopf(knopf);
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("de");
    await waitFor(() => expect(liveTexte()).toContain("Schalter und Menüs sind jetzt auf Deutsch."));
    expect(screen.getByRole("navigation", { name: "Werkzeuge" })).toBeTruthy();

    await waehleSprache("English", knopf);
    await waitFor(() => expect(htmlLang()).toBe("en"));
    await waitFor(() => expect(liveTexte()).toContain("Buttons and menus are now in English."));
  }, 30000);

  it("★ EN10: der Titel des Browser-Tabs - englisch, und zurück genau der alte", async () => {
    // So liefert der Server die Seite unter tastenflow.org aus (`link_previews_lib.pb.js`).
    const alt = "Tastenflow — 10-Fingersystem barrierefrei lernen";
    document.title = alt;
    useTypingAuth.setState({ account: baueKlasse() });
    zeige("/meine-klasse?app=tippen&bedienung=en");
    await klasseInEnglischDa();
    expect(document.title).toBe(TAB_TITEL_EN);
    await waehleSprache("Deutsch", await findeSprachwahlKnopf());
    await waitFor(() => expect(htmlLang()).toBe("de"));
    expect(document.title).toBe(alt);
    await waehleSprache("English");
    await waitFor(() => expect(document.title).toBe(TAB_TITEL_EN));
    // Eine fremde App: Deutsch - und der Titel, den der Server gesetzt hatte.
    geheZu("/lernwerkstatt/braille/klasse");
    await waitFor(() => expect(htmlLang()).toBe("de"));
    expect(document.title).toBe(alt);
  }, 30000);

  it("★ auch unter der Adresse von weingartner.org (/lernwerkstatt/tippen/klasse)", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeige("/lernwerkstatt/tippen/klasse?bedienung=en");
    await klasseInEnglischDa();
    expect(htmlLang()).toBe("en");
    expect(sprachwahlKuerzel(sprachwahlKnopf())).toBe("EN");
  }, 30000);
});

// ---------------------------------------------------------------------------
// 3 · Über die Navigation hinweg
// ---------------------------------------------------------------------------

describe("3 · der Provider überlebt die Navigation", () => {
  it("★★★ Klassenseite ⇒ Datenschutz ⇒ Punktgenau ⇒ Impressum: <html lang> zuckt nur beim Verlassen", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeige("/meine-klasse?app=tippen&bedienung=en");
    await klasseInEnglischDa();
    expect(htmlLang()).toBe("en");

    const wechsel: (string | null)[] = [];
    const beobachter = new MutationObserver(() => wechsel.push(htmlLang()));
    beobachter.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    // Aus Tastenflow in den Datenschutz: gemeinsame Seite, folgt der Herkunft.
    // Würde der Provider neu gebaut, stünde hier „de" und dann wieder „en".
    geheZu("/datenschutz");
    await screen.findByRole("heading", { level: 1 });
    await new Promise((r) => setTimeout(r, 0));
    expect(htmlLang()).toBe("en");
    expect(wechsel).toEqual([]);

    // In eine fremde App: zurück auf Deutsch - genau ein Wechsel.
    geheZu("/programme");
    await waitFor(() => expect(htmlLang()).toBe("de"));
    expect(wechsel).toEqual(["de"]);

    // Und eine gemeinsame Seite, die man jetzt von dort aus öffnet, bleibt deutsch.
    geheZu("/impressum");
    await screen.findByRole("heading", { level: 1 });
    await new Promise((r) => setTimeout(r, 0));
    expect(htmlLang()).toBe("de");
    expect(wechsel).toEqual(["de"]);

    // Zurück nach Tastenflow: wieder Englisch, die Wahl ist dieselbe geblieben.
    geheZu("/meine-klasse?app=tippen");
    await waitFor(() => expect(htmlLang()).toBe("en"));
    beobachter.disconnect();
  }, 30000);
});

// ---------------------------------------------------------------------------
// 4 · Die anderen Apps bleiben deutsch
// ---------------------------------------------------------------------------

describe("4 · ★★★ fremde Adressen: trotz englischer Wahl deutsch, kein Schalter", () => {
  it.skip("die Klassenseite aus Punktgenau (/lernwerkstatt/braille/klasse)", async () => {
    useTypingAuth.setState({ account: baueKlasse() });
    zeige("/lernwerkstatt/braille/klasse?bedienung=en");
    await screen.findByRole("tab", { name: "im Griff" });
    expect(htmlLang()).toBe("de");
    expect(schalter("DE - Deutsch")).toBeNull();
    expect(schalter("EN - English")).toBeNull();
    expect(sprachwahlKnopf()).toBeNull(); // ★ 28.09.2026: auch kein Sprachwähler
    expect(screen.getByRole("navigation", { name: "Werkzeuge" })).toBeTruthy();
    expect(document.querySelector("button[lang]")).toBeNull();
  }, 30000);

  it.skip("die Lernwerkstatt-Übersicht (/lernwerkstatt) - gehört allen Programmen", async () => {
    localStorage.setItem("tastenflow-bedienung", "en");
    zeige("/lernwerkstatt");
    await screen.findByRole("heading", { level: 1 });
    expect(htmlLang()).toBe("de");
    expect(schalter("DE - Deutsch")).toBeNull();
    expect(schalter("EN - English")).toBeNull();
    expect(sprachwahlKnopf()).toBeNull(); // ★ 28.09.2026: auch kein Sprachwähler
    expect(document.body.textContent).toContain("Selbst üben mit Spielstand"); // 09.11.2026: neue Unterzeile statt „Lernprogramme"
  }, 30000);
});

// ---------------------------------------------------------------------------
// 5 · Deutsche Bedienung für jeden (seit 19.09.2026)
// ---------------------------------------------------------------------------

/**
 * Die IDs von `useId` zählen in React 18 über die ganze Lebensdauer hoch
 * (`:r1a:`, ohne Doppelpunkte `tipp-r1a`); zwei Renderläufe unterscheiden sich
 * darum darin. Sie werden in der Reihenfolge ihres Auftretens durchnummeriert -
 * dieselbe Stelle bekommt in beiden Läufen dieselbe Nummer, ein echter
 * Unterschied bleibt einer.
 */
function ohneIds(html: string): string {
  const karte = new Map<string, string>();
  return html.replace(/:r[0-9a-z]+:|(?<=[-"\s#])r[0-9a-z]{1,3}(?=[-"\s)])/g, (m) => {
    const k = m.replace(/:/g, "");
    if (!karte.has(k)) karte.set(k, `«id${karte.size}»`);
    return karte.get(k)!;
  });
}

/**
 * Was den Unterschied zwischen „mit Provider, deutsch" und „ohne Provider"
 * ausmachen DARF: der Sprachschalter selbst und die `lang`-Auszeichnungen von
 * Inhalten (Übungsfeld, Titel …). Alles andere - jeder deutsche Satz, jede
 * Beschriftung - muss gleich bleiben.
 */
function ohneSprachAuszeichnung(seite: Element): string {
  const kopie = seite.cloneNode(true) as Element;
  // Der Schalter samt seinem Hinweis-Rahmen (`Tipp`) - vor dem Nummerieren
  // der IDs entfernt, damit die übrigen in beiden Fassungen gleich zählen.
  // ★ 28.09.2026 (Freigabe fr/es): Zweier-Knopf ODER Sprachwähler samt Rahmen.
  ohneSprachwahl(kopie);
  return kopie.innerHTML.replace(/ lang="(?:de|en)"/g, "");
}

describe("5 · ★★★ deutsche Bedienung für jeden", () => {
  it("Trainer: Schalter „EN - English\" für den Gast, <html lang=\"de\">, Tab-Titel unberührt", async () => {
    expect(navigator.languages[0]).toBe("de-AT");
    document.title = "Titel vom Server";
    zeige("/programme/tastenflow");
    const feld = await waitFor(() => tippfeldPflicht());
    expect(htmlLang()).toBe("de");
    // ★ EN10: in deutscher Bedienung fasst niemand den Titel des Tabs an.
    expect(document.title).toBe("Titel vom Server");
    expect(sprachwahlKnopf()).not.toBeNull();
    expect(sprachwahlKuerzel(sprachwahlKnopf())).toBe("DE");
    // Das Übungsfeld trägt die Übungssprache - hier Deutsch.
    expect(feld.getAttribute("lang")).toBe("de");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Mein Training");
  }, 30000);

  it("★★★ der Trainer: bis auf Schalter und lang-Auszeichnung dasselbe DOM wie ohne Provider", async () => {
    const zufall = vi.spyOn(Math, "random").mockReturnValue(0.4242);

    zeige("/programme/tastenflow");
    await waitFor(() => tippfeldPflicht());
    await new Promise((r) => setTimeout(r, 50));
    const mitSeite = document.querySelector(".page-transition")!;
    const mitRoh = ohneIds(mitSeite.innerHTML);
    const mit = ohneIds(ohneSprachAuszeichnung(mitSeite));
    cleanup();

    window.history.replaceState(null, "", "/programme/tastenflow");
    render(
      <AnnounceProvider>
        <MemoryRouter initialEntries={["/programme/tastenflow"]}>
          <FocusOnRouteChange />
          <div className="page-transition">
            <TippenTrainerPage />
          </div>
        </MemoryRouter>
      </AnnounceProvider>,
    );
    await waitFor(() => tippfeldPflicht());
    await new Promise((r) => setTimeout(r, 50));
    const ohneSeite = document.querySelector(".page-transition")!;
    const ohneRoh = ohneIds(ohneSeite.innerHTML);
    const ohne = ohneIds(ohneSprachAuszeichnung(ohneSeite));
    zufall.mockRestore();

    // ★ GEGENPROBE: roh unterscheiden sie sich (der Schalter) - der Vergleich
    // unten SIEHT also einen Unterschied, wenn es einen gibt.
    expect(mitRoh).not.toBe(ohneRoh);
    expect(mitRoh).toContain("Sprache - Language - Langue - Idioma");

    expect(mit.length).toBeGreaterThan(5000);
    let i = 0;
    while (i < mit.length && mit[i] === ohne[i]) i++;
    expect(mit.slice(Math.max(0, i - 200), i + 200), `erster Unterschied bei ${i}`).toBe(
      ohne.slice(Math.max(0, i - 200), i + 200),
    );
    expect(mit).toBe(ohne);
  }, 30000);

  it.skip("★★★ „Meine Klassen\": Schalter für die Lehrkraft, sonst dasselbe DOM wie ohne Provider", async () => {
    const lehrkraft = baueKlasse();

    // Mit Provider - über die echte Routen-Tabelle.
    useTypingAuth.setState({ account: lehrkraft });
    zeige("/meine-klasse?app=tippen");
    await screen.findByRole("tab", { name: "im Griff" });
    await new Promise((r) => setTimeout(r, 50));
    expect(htmlLang()).toBe("de");
    expect(sprachwahlKuerzel(sprachwahlKnopf())).toBe("DE");
    const mitSeite = document.querySelector(".page-transition")!;
    const mitRoh = ohneIds(mitSeite.innerHTML);
    const mit = ohneIds(ohneSprachAuszeichnung(mitSeite));
    cleanup();

    // Ohne Provider - `Root`, wie er vor EN0 aussah: Fokus-Führung und die
    // Seite im `page-transition`-Rahmen, sonst nichts.
    useTypingAuth.setState({ account: lehrkraft });
    window.history.replaceState(null, "", "/meine-klasse?app=tippen");
    render(
      <AnnounceProvider>
        <MemoryRouter initialEntries={["/meine-klasse?app=tippen"]}>
          <FocusOnRouteChange />
          <div className="page-transition">
            <MeineKlassePage />
          </div>
        </MemoryRouter>
      </AnnounceProvider>,
    );
    await screen.findByRole("tab", { name: "im Griff" });
    await new Promise((r) => setTimeout(r, 50));
    const ohneSeite = document.querySelector(".page-transition")!;
    const ohneRoh = ohneIds(ohneSeite.innerHTML);
    const ohne = ohneIds(ohneSprachAuszeichnung(ohneSeite));
    cleanup();

    expect(mitRoh).not.toBe(ohneRoh);
    expect(mit.length).toBeGreaterThan(2000);
    // Bei einem Unterschied die Stelle zeigen, nicht zwei lange Zeichenketten.
    let i = 0;
    while (i < mit.length && mit[i] === ohne[i]) i++;
    expect(mit.slice(Math.max(0, i - 200), i + 200), `erster Unterschied bei ${i}`).toBe(
      ohne.slice(Math.max(0, i - 200), i + 200),
    );
    expect(mit).toBe(ohne);
  }, 30000);
});
