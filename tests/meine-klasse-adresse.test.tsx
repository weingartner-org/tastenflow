/**
 * ★★ N2 (01.09.2026): „Meine Klassen" hat ZWEI ADRESSEN, je nach Rechnernamen.
 *
 * ── Der Anlass, im Wortlaut ────────────────────────────────────────────────
 * Johannes am 31.08.2026: „auf einmal steht Lernwerkstatt in der Adresse".
 * Gemessen stimmte das: Die Seite lag unter `/lernwerkstatt/klasse`, auch wenn
 * man sie von `tastenflow.org` aus geöffnet hatte.
 *
 * Entschieden (Entwurf §0a, F9):
 *   auf `tastenflow.org`    ⇒ `/meine-klasse`
 *   auf `weingartner.org`   ⇒ `/lernwerkstatt/<programm>/klasse`
 *   die alte Adresse bleibt ⇒ und leitet um.
 *
 * ── Was dieser Test festhält ───────────────────────────────────────────────
 * (a) Die Wahl der Adresse, an beiden Rechnernamen und in der Entwicklung.
 * (b) Dass die alte Adresse WEITER ANKOMMT - verschickte Links, Lesezeichen
 *     und die Hilfe-Texte der anderen vier Programme zeigen dorthin.
 * (c) ★ Dass die Umleitung KEINE SCHLEIFE bauen kann. Das ist der einzige Weg,
 *     auf dem dieser Umbau die Seite komplett unerreichbar machen könnte -
 *     darum steht er hier als eigene Messung und nicht nur als Kommentar.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useRoutes } from "react-router-dom";
import { routes } from "../src/App";
import { AnnounceProvider } from "../src/lib/a11y";
import {
  MEINE_KLASSE_PFAD,
  MEINE_KLASSE_PFAD_ALT,
  meineKlasseHref,
} from "@/lib/adressen";

const AUF_TASTENFLOW = { hostname: "tastenflow.org", origin: "https://tastenflow.org" };
const AUF_PLATTFORM = { hostname: "weingartner.org", origin: "https://weingartner.org" };
const LOKAL = { hostname: "localhost", origin: "http://localhost:5173" };

describe("★★ meineKlasseHref - zwei Adressen, je nach Rechnernamen (F9)", () => {
  it("auf tastenflow.org führt der Weg auf /meine-klasse", () => {
    expect(meineKlasseHref("tippen", null, AUF_TASTENFLOW)).toBe(
      "/meine-klasse?app=tippen",
    );
  });

  it("auf weingartner.org steht das Programm im PFAD, nicht im Anhang", () => {
    expect(meineKlasseHref("tippen", null, AUF_PLATTFORM)).toBe(
      "/lernwerkstatt/tippen/klasse",
    );
    expect(meineKlasseHref("braille", null, AUF_PLATTFORM)).toBe(
      "/lernwerkstatt/braille/klasse",
    );
  });

  it("ohne bekanntes Programm gilt /meine-klasse - die gibt es auf beiden", () => {
    expect(meineKlasseHref(null, null, AUF_TASTENFLOW)).toBe(MEINE_KLASSE_PFAD);
    expect(meineKlasseHref(null, null, AUF_PLATTFORM)).toBe(MEINE_KLASSE_PFAD);
    expect(meineKlasseHref(undefined, null, LOKAL)).toBe(MEINE_KLASSE_PFAD);
  });

  it("der Beitritts-Code wandert mit, auf beiden Wegen", () => {
    expect(meineKlasseHref("tippen", "AB12", AUF_TASTENFLOW)).toContain("klasse=AB12");
    expect(meineKlasseHref("tippen", "AB12", AUF_PLATTFORM)).toBe(
      "/lernwerkstatt/tippen/klasse?klasse=AB12",
    );
  });

  it("★ KEINE SCHLEIFE: das Ziel ist nie die alte Adresse selbst", () => {
    // Genau die Zusicherung, die `AlteKlassenAdresse` in App.tsx braucht.
    for (const herkunft of [AUF_TASTENFLOW, AUF_PLATTFORM, LOKAL]) {
      for (const programm of [null, "tippen", "braille", "klangpunkte", "computer"]) {
        const ziel = meineKlasseHref(programm, "AB12", herkunft);
        expect(ziel.split("?")[0]).not.toBe(MEINE_KLASSE_PFAD_ALT);
      }
    }
  });
});

function RoutesRender() {
  return useRoutes(routes);
}
function zeige(pfad: string) {
  return render(
    <AnnounceProvider>
      <MemoryRouter initialEntries={[pfad]}>
        <RoutesRender />
      </MemoryRouter>
    </AnnounceProvider>,
  );
}

/**
 * Ohne angemeldete Lehrkraft zeigt die Seite ihren Hinweis „Dieser Bereich ist
 * für Lehrkräfte". Genau das genügt hier: Geprüft wird, ob die ADRESSE die
 * Seite überhaupt erreicht - nicht, was sie einer Lehrkraft zeigt.
 */
const ERKENNUNG = /Dieser Bereich ist für Lehrkräfte/i;

/** Seit 28.09.2026 wird die Seite erst beim Aufruf nachgeladen (lib/seiteNachladen.tsx);
 *  im Testlauf braucht das Umwandeln der grossen Klassenseite länger als 1 s. */
const NACHLADEN = { timeout: 15_000 };

describe("★★ die drei Adressen führen alle ans selbe Ziel", () => {
  it("die neue kurze Adresse /meine-klasse", async () => {
    zeige(MEINE_KLASSE_PFAD);
    expect(await screen.findByText(ERKENNUNG, {}, NACHLADEN)).toBeTruthy();
  });

  it("die neue Adresse mit dem Programm im Pfad", async () => {
    zeige("/lernwerkstatt/tippen/klasse");
    expect(await screen.findByText(ERKENNUNG, {}, NACHLADEN)).toBeTruthy();
  });

  it("★ die ALTE Adresse leitet um und kommt an", async () => {
    zeige(MEINE_KLASSE_PFAD_ALT + "?app=tippen&klasse=AB12");
    expect(await screen.findByText(ERKENNUNG, {}, NACHLADEN)).toBeTruthy();
  });

  it("★ die alte Adresse ohne jeden Anhang kommt ebenfalls an", async () => {
    zeige(MEINE_KLASSE_PFAD_ALT);
    expect(await screen.findByText(ERKENNUNG, {}, NACHLADEN)).toBeTruthy();
  });
});
