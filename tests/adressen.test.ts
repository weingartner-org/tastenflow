import { describe, it, expect } from "vitest";
import {
  EIGENE_HOSTS,
  PLATTFORM_START,
  TASTENFLOW_HOSTS,
  TASTENFLOW_PFAD,
  TASTENFLOW_START,
  backendUrl,
  hierIstLexami,
  hierIstTastenflow,
  istEigenerHost,
  istTastenflowHost,
  plattformStartHref,
  programmHref,
  tastenflowHref,
} from "@/lib/adressen";
import { ALL_PROGRAMS } from "@/lib/allPrograms";

const AUF_TASTENFLOW = { hostname: "tastenflow.org", origin: "https://tastenflow.org" };
const AUF_TASTENFLOW_WWW = {
  hostname: "www.tastenflow.org",
  origin: "https://www.tastenflow.org",
};
const AUF_PLATTFORM = { hostname: "weingartner.org", origin: "https://weingartner.org" };
const AUF_PLATTFORM_WWW = {
  hostname: "www.weingartner.org",
  origin: "https://www.weingartner.org",
};
const LOKAL = { hostname: "localhost", origin: "http://localhost:5173" };

/**
 * Die zweite Adresse (tastenflow.org, 22.08.2026) und die www-Falle.
 *
 * Der Altstand fragte sein Backend fest bei `https://weingartner.org` ab. Unter
 * `tastenflow.org` ist das eine fremde Herkunft: Der Browser verwirft dort das
 * Cookie des Datei-Ausweises, Handbuch und Kursdateien antworten mit 404.
 * Diese Prüfungen fallen am Altstand - sie sind der Wächter gegen den Rückfall.
 */
describe("Eigene Adressen", () => {
  it("kennt beide Adressen samt »www«-Schreibweise", () => {
    expect(EIGENE_HOSTS).toEqual([
      "weingartner.org",
      "www.weingartner.org",
      "tastenflow.org",
      "www.tastenflow.org",
      "lexami.org",
      "www.lexami.org",
    ]);
  });

  it("erkennt jede eigene Adresse", () => {
    for (const host of EIGENE_HOSTS) expect(istEigenerHost(host)).toBe(true);
  });

  it("erkennt Großschreibung - Rechnernamen sind gleich, egal wie geschrieben", () => {
    expect(istEigenerHost("Tastenflow.ORG")).toBe(true);
  });

  it("hält fremde Adressen heraus - auch täuschend ähnliche", () => {
    expect(istEigenerHost("tastenflow.org.example.com")).toBe(false);
    expect(istEigenerHost("nicht-tastenflow.org")).toBe(false);
    expect(istEigenerHost("localhost")).toBe(false);
    expect(istEigenerHost("")).toBe(false);
    expect(istEigenerHost(null)).toBe(false);
  });

  it("trennt die Tastenflow-Adressen von der Plattform-Adresse", () => {
    for (const host of TASTENFLOW_HOSTS) expect(istTastenflowHost(host)).toBe(true);
    expect(istTastenflowHost("weingartner.org")).toBe(false);
    expect(istTastenflowHost("www.weingartner.org")).toBe(false);
    expect(istTastenflowHost("localhost")).toBe(false);
  });
});

describe("Backend-Adresse", () => {
  it("nimmt unter »tastenflow.org« die EIGENE Herkunft - sonst stirbt der Datei-Ausweis", () => {
    expect(
      backendUrl({ hostname: "tastenflow.org", origin: "https://tastenflow.org" }),
    ).toBe("https://tastenflow.org");
  });

  it("nimmt unter »www.tastenflow.org« ebenfalls die eigene Herkunft", () => {
    expect(
      backendUrl({ hostname: "www.tastenflow.org", origin: "https://www.tastenflow.org" }),
    ).toBe("https://www.tastenflow.org");
  });

  it("nimmt unter »weingartner.org« die eigene Herkunft", () => {
    expect(
      backendUrl({ hostname: "weingartner.org", origin: "https://weingartner.org" }),
    ).toBe("https://weingartner.org");
  });

  it("nimmt unter »www.weingartner.org« die eigene Herkunft - genau das war die Falle vom 16.08.", () => {
    expect(
      backendUrl({ hostname: "www.weingartner.org", origin: "https://www.weingartner.org" }),
    ).toBe("https://www.weingartner.org");
  });

  it("fällt bei localhost auf die eingebaute Adresse zurück", () => {
    expect(
      backendUrl({ hostname: "localhost", origin: "http://localhost:5173" }),
    ).toBe(import.meta.env.VITE_POCKETBASE_URL ?? "http://127.0.0.1:8090");
  });

  it("fällt auf Vorschau-Hosts auf die eingebaute Adresse zurück", () => {
    expect(
      backendUrl({ hostname: "app.127-0-0-1.sslip.io", origin: "http://app.127-0-0-1.sslip.io" }),
    ).toBe(import.meta.env.VITE_POCKETBASE_URL ?? "http://127.0.0.1:8090");
  });

  it("nimmt ohne Angabe die Herkunft des laufenden Fensters", () => {
    // jsdom läuft unter localhost - also die eingebaute Adresse.
    expect(backendUrl()).toBe(
      import.meta.env.VITE_POCKETBASE_URL ?? "http://127.0.0.1:8090",
    );
  });
});

describe("Verweise auf Tastenflow", () => {
  it("zeigt von der Plattform aus auf die eigene Adresse - nicht mehr auf den Hausweg", () => {
    expect(tastenflowHref(AUF_PLATTFORM)).toBe("https://tastenflow.org");
    expect(tastenflowHref(AUF_PLATTFORM_WWW)).toBe("https://tastenflow.org");
  });

  it("bleibt auf tastenflow.org relativ - der Rechnername darf nicht wechseln", () => {
    expect(tastenflowHref(AUF_TASTENFLOW)).toBe("/");
    expect(tastenflowHref(AUF_TASTENFLOW_WWW)).toBe("/");
  });

  it("nimmt in der Entwicklung den Hausweg - dort gibt es die zweite Adresse nicht", () => {
    expect(tastenflowHref(LOKAL)).toBe(TASTENFLOW_PFAD);
  });

  it("kennt die eigene Adresse aus dem Programm-Katalog", () => {
    const tippen = ALL_PROGRAMS.find((p) => p.key === "tippen");
    expect(tippen?.externeAdresse).toBe(TASTENFLOW_START);
    expect(tippen?.path).toBe(TASTENFLOW_PFAD);
    expect(programmHref(tippen!, AUF_PLATTFORM)).toBe(TASTENFLOW_START);
    expect(programmHref(tippen!, AUF_TASTENFLOW)).toBe("/");
    expect(programmHref(tippen!, LOKAL)).toBe(TASTENFLOW_PFAD);
  });

  it("lässt »key« und »path« von Tastenflow unangetastet - daran hängt der Fortschritt der Kinder", () => {
    const tippen = ALL_PROGRAMS.find((p) => p.key === "tippen");
    expect(tippen).toBeDefined();
    expect(tippen!.key).toBe("tippen");
    expect(tippen!.path).toBe("/programme/tastenflow");
  });

  it("gibt allen übrigen Programmen weiterhin ihren Hausweg", () => {
    for (const prog of ALL_PROGRAMS) {
      if (prog.key === "tippen") continue;
      expect(prog.externeAdresse, `${prog.key} hat unerwartet eine eigene Adresse`).toBeUndefined();
      if (prog.path) expect(programmHref(prog, AUF_PLATTFORM)).toBe(prog.path);
      if (prog.path) expect(programmHref(prog, AUF_TASTENFLOW)).toBe(prog.path);
    }
  });
});

describe("Heim-Verweis der Kopfzeile", () => {
  it("führt von tastenflow.org zurück zur Lernplattform - dort wohnen die anderen Programme", () => {
    expect(plattformStartHref(AUF_TASTENFLOW)).toBe(PLATTFORM_START);
    expect(plattformStartHref(AUF_TASTENFLOW_WWW)).toBe(PLATTFORM_START);
  });

  it("bleibt auf der Plattform und in der Entwicklung schlicht »/«", () => {
    expect(plattformStartHref(AUF_PLATTFORM)).toBe("/");
    expect(plattformStartHref(LOKAL)).toBe("/");
  });
});


describe("Welche Adresse ist gerade dran", () => {
  it("erkennt die Tastenflow-Adresse", () => {
    expect(hierIstTastenflow(AUF_TASTENFLOW)).toBe(true);
    expect(hierIstTastenflow(AUF_TASTENFLOW_WWW)).toBe(true);
  });

  it("erkennt Plattform und Entwicklung als NICHT-Tastenflow", () => {
    expect(hierIstTastenflow(AUF_PLATTFORM)).toBe(false);
    expect(hierIstTastenflow(LOKAL)).toBe(false);
    // Ohne Angabe: jsdom läuft unter localhost.
    expect(hierIstTastenflow()).toBe(false);
  });
});

/**
 * lexami.org (14.11.2026): eigene Adresse wie tastenflow.org. Ohne den Eintrag
 * in EIGENE_HOSTS fragte die App dort ihr Backend bei weingartner.org ab - die
 * www-Falle: Datei-Ausweis verworfen, geschützte Dateien 404.
 */
describe("lexami.org", () => {
  const AUF_LEXAMI = { hostname: "lexami.org", origin: "https://lexami.org" };
  const AUF_LEXAMI_WWW = { hostname: "www.lexami.org", origin: "https://www.lexami.org" };

  it("fragt das Backend unter der EIGENEN Adresse ab", () => {
    expect(backendUrl(AUF_LEXAMI)).toBe("https://lexami.org");
    expect(backendUrl(AUF_LEXAMI_WWW)).toBe("https://www.lexami.org");
  });

  it("erkennt die Lexami-Adresse - und nur sie", () => {
    expect(hierIstLexami(AUF_LEXAMI)).toBe(true);
    expect(hierIstLexami(AUF_LEXAMI_WWW)).toBe(true);
    expect(hierIstLexami({ hostname: "LEXAMI.org", origin: "https://lexami.org" })).toBe(true);
    expect(hierIstLexami(AUF_PLATTFORM)).toBe(false);
    expect(hierIstLexami(AUF_TASTENFLOW)).toBe(false);
    expect(hierIstLexami({ hostname: "lexami.org.example.com", origin: "https://x" })).toBe(false);
    expect(hierIstLexami(LOKAL)).toBe(false);
  });

  it("der Heim-Verweis führt von lexami.org zur Lernplattform", () => {
    expect(plattformStartHref(AUF_LEXAMI)).toBe(PLATTFORM_START);
  });

  it("ist keine Tastenflow-Adresse", () => {
    expect(hierIstTastenflow(AUF_LEXAMI)).toBe(false);
  });
});
