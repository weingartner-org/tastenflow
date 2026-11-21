/**
 * ★★★ WÄCHTER über die RANGLISTE der Tippchallenge (10.09.2026).
 *
 * Auftrag Johannes: *„ein Prozentranking vom besten ausgehend, genauigkeit
 * schlägt zeit"*. Gerechnet wird das in `src/lib/typing/schreibprobeWertung.ts`
 * (dort steht auch die Herleitung); **hier wird geprüft, was die Lehrkraft
 * wirklich zu lesen bekommt** - die Reihenfolge der Tabelle.
 *
 * ── Warum es diesen Wächter zusätzlich zum Rechenwerk-Test gibt ─────────────
 * Die Formel kann stimmen und die Tabelle trotzdem falsch dastehen: Es genügt,
 * dass jemand nach `anschlaege` sortiert, weil das die auffälligste Spalte ist.
 * Dann läge das schnelle, ungenaue Kind oben - also genau das Gegenteil des
 * Auftrags, und keine einzige Zahl wäre falsch.
 *
 * ── Die zwei Aussagen, die dieser Wächter belegt ────────────────────────────
 *  1. **Sortiert wird nach Rangprozent, das beste Kind oben** - und „bestes"
 *     heisst nicht „schnellstes": Runa schreibt mit 120 Anschlägen und 99,5 %
 *     Treffsicherheit, Ferdi mit 300 und 90 %. Ferdi ist zweieinhalbmal so
 *     schnell und steht trotzdem unter ihr (Beispiel 4 gegen 6 aus
 *     `RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md` §4.4).
 *  2. ★★ **Ein zu kurzes Ergebnis bekommt KEINEN Rang - und keinen letzten
 *     Platz.** Nabil ist der schärfste Fall, den es gibt: Sein Leistungswert
 *     wäre mit 85,6 der HÖCHSTE der ganzen Klasse (150 Zeichen, 2 Fehlgriffe,
 *     200 Anschläge). Er steht trotzdem ohne Rang da, hinter allen gewerteten
 *     Kindern - und nicht auf dem letzten Platz, sondern ausserhalb der
 *     Wertung. Wer den Riegel versehentlich auf den WERT statt auf `gewertet`
 *     legt, setzt ihn an die Spitze; wer ihn ganz vergisst, setzt ihn ans Ende
 *     der Rangliste. Beides wird hier rot.
 *
 * ⚠️ Die Zahlen der Beispielkinder sind NICHT frei erfunden - sie sind die
 * durchgerechneten Zeilen 4, 6 und 8 der Recherche. Ändert jemand die Formel,
 * fällt dieser Wächter mit den Zahlen dort zusammen und nicht allein.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { TypingAccount, TypingClass } from "@/lib/typing/account";
import { SchreibprobeKasten } from "@/components/lernwerkstatt/klasse/SchreibprobeKasten";
import type { Probenergebnis } from "@/lib/typing/schreibprobeAuswertung";
import {
  BEZUGSTEMPO,
  FEHLER_GEWICHT,
  MIND_ZEICHEN_WERTUNG,
  werte,
} from "@/lib/typing/schreibprobeWertung";

let klassenProben: Record<string, Probenergebnis[]> = {};

vi.mock("@/lib/typing/backend", () => ({
  typingBackend: () => ({
    setzeSchreibprobe: async (c: string, t: string) =>
      ({ code: c, name: "4a", teacherId: t, createdAt: 0 }) as TypingClass,
    leseKlassenProben: async () => klassenProben,
    // „Bereit: 12 von 14" (10.09.2026) - ohne Server ohne Meldungen.
    beobachteKinder: () => () => {},
    listPupils: async () => [],
  }),
}));

const PROBE_ID = "sp-rang";
/**
 * Vor drei Tagen gestartet - die Runde ist vorbei. Seit 10.09.2026 steht dann
 * oben das Formular, und diese Runde offen darunter.
 */
const START_MS = Date.now() - 3 * 24 * 3600_000;

const PLAN = {
  id: PROBE_ID,
  niveau: "start",
  startMs: START_MS,
  dauerMin: 10,
  textNr: 0,
  zuschlagProzent: 0,
  angelegtMs: START_MS - 60_000,
};

/**
 * Ein Ergebnis, wie es vom Server käme - MIT Wertung, so wie `werteAus` und
 * `ergebnisAusJson` sie immer mitliefern.
 */
function ergebnis(over: {
  zeichen: number;
  fehler: number;
  anschlaege: number;
  zuschlagProzent?: number;
  wartezeitMs?: number;
}): Probenergebnis {
  const zuschlagProzent = over.zuschlagProzent ?? 0;
  const wartezeitMs = over.wartezeitMs ?? 0;
  return {
    probeId: PROBE_ID,
    niveau: "start",
    textNr: 0,
    textTitel: "Der Weg zur Schule",
    startZeile: 0,
    endeTextNr: 0,
    endeZeile: Math.round(over.zeichen / 30),
    beginnMs: START_MS,
    endeMs: START_MS + 600_000,
    zeitMs: 600_000,
    zuschlagProzent,
    wartezeitMs,
    zeichen: over.zeichen,
    fehler: over.fehler,
    zeilen: Math.round(over.zeichen / 30),
    schreibMs: 600_000,
    anschlaege: over.anschlaege,
    genauigkeit: over.zeichen / (over.zeichen + over.fehler),
    tasten: [],
    wacklig: [],
    layout: "de",
    textZuEnde: false,
    frueherAbgegeben: false,
    wertung: werte({
      zeichen: over.zeichen,
      fehler: over.fehler,
      anschlaege: over.anschlaege,
      // ⚠️ Genau wie im Rechenwerk: gemessene Wartezeit ⇒ kein pauschaler
      // Zuschlag, sonst zählte dieselbe Lesezeit zweimal.
      zuschlagProzent: wartezeitMs > 0 ? 0 : zuschlagProzent,
    }),
  } as Probenergebnis;
}

/** Die vier Kinder der Klasse - Ada tritt nie an. */
const KINDER = [
  { id: "k-ferdi", role: "schueler", name: "Ferdi", createdAt: 0 },
  { id: "k-runa", role: "schueler", name: "Runa", createdAt: 0 },
  { id: "k-nabil", role: "schueler", name: "Nabil", createdAt: 0 },
  { id: "k-timo", role: "schueler", name: "Timo", createdAt: 0 },
  { id: "k-ada", role: "schueler", name: "Ada", createdAt: 0 },
] as TypingAccount[];

/** Die Anschlagszahlen der Beispielkinder - für die Gegenprobe gebraucht. */
const ANSCHLAEGE: Record<string, number> = { Ferdi: 300, Runa: 120, Nabil: 200, Timo: 80 };

function fixture(): Record<string, Probenergebnis[]> {
  return {
    // §4.4 Zeile 6: sehr schnell, mässig genau ⇒ Leistungswert 64,3
    "k-ferdi": [ergebnis({ zeichen: 3000, fehler: 333, anschlaege: 300 })],
    // §4.4 Zeile 4: mittel, fast fehlerfrei ⇒ Leistungswert 69,0
    "k-runa": [ergebnis({ zeichen: 1200, fehler: 6, anschlaege: 120 })],
    // ★ Zu kurz: 150 < MIND_ZEICHEN_WERTUNG. Sein Wert WÄRE mit 85,6 der beste.
    "k-nabil": [ergebnis({ zeichen: 150, fehler: 2, anschlaege: 200 })],
    // §4.4 Zeile 8: langsam, sehr genau ⇒ Leistungswert 55,0
    "k-timo": [ergebnis({ zeichen: 800, fehler: 8, anschlaege: 80 })],
  };
}

function zeige(pupils: TypingAccount[] = KINDER) {
  render(
    <SchreibprobeKasten
      cls={
        { code: "4a", name: "4a", teacherId: "t1", createdAt: 0, settings: { schreibprobe: PLAN } } as TypingClass
      }
      pupils={pupils}
      onClassChange={vi.fn()}
    />,
  );
}

/**
 * Die Tabelle so lesen, wie sie dasteht: erste Zelle Rang, Zeilenkopf Name.
 *
 * ⚠️ Bewusst über die DOM-Reihenfolge und nicht über eine Hilfsfunktion des
 * Bauteils: Geprüft werden soll, was auf dem Bildschirm steht, nicht was das
 * Bauteil sich dabei gedacht hat.
 */
function tabelle(wurzel: ParentNode = document): { rang: string; name: string }[] {
  return [...wurzel.querySelectorAll("tbody tr")].map((tr) => ({
    rang: (tr.querySelector("td")?.textContent ?? "").trim(),
    name: (tr.querySelector("th")?.textContent ?? "").trim(),
  }));
}

beforeEach(() => {
  klassenProben = fixture();
  vi.stubGlobal("confirm", () => true);
});

describe("Die Rangliste der Lehrkraft", () => {
  it("sortiert nach Rangprozent - das beste Kind oben, 100 % für das beste", async () => {
    zeige();
    await waitFor(() => expect(document.body.textContent).toContain("Vergangene"));
    await waitFor(() => expect(document.body.textContent).toContain("nicht angetreten"));

    const gezeigt = tabelle();
    expect(gezeigt.map((z) => z.name)).toEqual(["Runa", "Ferdi", "Timo", "Nabil", "Ada"]);
    expect(gezeigt.map((z) => z.rang)).toEqual([
      "100,0 %",
      "93,2 %",
      "79,7 %",
      "zu kurz für eine Wertung",
      "",
    ]);
  });

  it("★ Genauigkeit schlägt Zeit - und die GEGENPROBE, dass der Test das misst", async () => {
    zeige();
    await waitFor(() => expect(document.body.textContent).toContain("Vergangene"));
    await waitFor(() => expect(document.body.textContent).toContain("nicht angetreten"));

    const namen = tabelle()
      .map((z) => z.name)
      .filter((n) => n in ANSCHLAEGE);

    // Runa (120 Anschläge, 99,5 %) steht über Ferdi (300 Anschläge, 90 %).
    expect(namen.indexOf("Runa")).toBeLessThan(namen.indexOf("Ferdi"));

    /*
      ★★ DIE GEGENPROBE: Sortiert nach der auffälligsten Spalte - den
      Anschlägen - käme eine ANDERE Reihenfolge heraus. Ohne diese Zeile könnte
      der Test oben auch dann grün sein, wenn gar nicht sortiert würde und die
      Kinder zufällig in dieser Ordnung im Fixture stehen.
    */
    const nachTempo = [...namen].sort((a, b) => ANSCHLAEGE[b] - ANSCHLAEGE[a]);
    expect(nachTempo).toEqual(["Ferdi", "Nabil", "Runa", "Timo"]);
    expect(namen).not.toEqual(nachTempo);
  });

  it("★★ ein zu kurzes Ergebnis bekommt keinen Rang - obwohl sein Wert der höchste wäre", async () => {
    // Belegt am Rechenwerk, dass der Fall wirklich der schärfste ist: Nabils
    // Leistungswert liegt ÜBER dem des besten gewerteten Kindes.
    const nabil = werte({ zeichen: 150, fehler: 2, anschlaege: 200 });
    const runa = werte({ zeichen: 1200, fehler: 6, anschlaege: 120 });
    expect(nabil.gewertet).toBe(false);
    expect(nabil.wert).toBeGreaterThan(runa.wert);
    expect(150).toBeLessThan(MIND_ZEICHEN_WERTUNG);

    zeige();
    await waitFor(() => expect(document.body.textContent).toContain("Vergangene"));
    await waitFor(() => expect(document.body.textContent).toContain("nicht angetreten"));

    const gezeigt = tabelle();
    const nabilZeile = gezeigt.find((z) => z.name === "Nabil");
    // Kein Rang, sondern der Satz - und ausdrücklich kein Prozentwert.
    expect(nabilZeile?.rang).toBe("zu kurz für eine Wertung");
    expect(nabilZeile?.rang).not.toMatch(/\d\s*%/);
    // Am Ende der Tabelle, nicht auf dem letzten Platz der Rangliste: hinter
    // ALLEN gewerteten Kindern, aber ohne eigene Wertung.
    const namen = gezeigt.map((z) => z.name);
    expect(namen.indexOf("Nabil")).toBeGreaterThan(namen.indexOf("Timo"));
    // Und die Zahlen des Kindes stehen trotzdem da - nicht gewertet heisst
    // nicht verschwiegen.
    const zeile = [...document.querySelectorAll("tbody tr")].find(
      (tr) => tr.querySelector("th")?.textContent?.trim() === "Nabil",
    );
    expect(zeile?.textContent).toContain("200");
    expect(zeile?.textContent).toContain("150");
  });

  /*
    ★ E12 (19.09.2026, Mouseover-/Schlank-Durchgang): Der Satz stand bis dahin
    als eigener Absatz FEST unter der Tabelle - Johannes: „halte die Seite
    jetzt extrem schlank und mach keine dauerhaften Erklärungen unter den
    Schaltern, das geht mit Mouseover". Er hängt jetzt am Spaltenkopf
    „Leistungswert" (`H.leistungswert` in `schreibprobeHinweise.ts`, samt dem
    einen Zusatz, der dort noch fehlte). Die Sätze bleiben im Baum - nur
    `visibility: hidden`, bis der Kopf Zeiger oder Fokus bekommt
    (`Zeigerhinweis.tsx`) - `document.body.textContent` findet sie darum
    weiterhin, jsdom rechnet keine Sichtbarkeit.
  */
  it("erklärt die Wertung am Spaltenkopf 'Leistungswert' - aus den Konstanten, nicht abgeschrieben", async () => {
    zeige();
    await waitFor(() => expect(document.body.textContent).toContain("Vergangene"));
    await waitFor(() => expect(document.body.textContent).toContain("nicht angetreten"));

    const t = document.body.textContent ?? "";
    expect(t).toContain("Treffsicherheit und Tempo in einer Zahl von 0 bis 100");
    expect(t).toContain(`so viel wie ${FEHLER_GEWICHT} Zeichen`);
    expect(t).toContain(`${BEZUGSTEMPO} Anschläge je Minute`);
    expect(t).toContain(`Unter ${MIND_ZEICHEN_WERTUNG} Zeichen gibt es keinen Leistungswert`);
    // ★ Der Satz, der einen Rang von einer Note unterscheidet.
    expect(t).toContain("Er ist keine Note");
    // ★ Der Zusatz, der bis dahin nur im (jetzt entfernten) Absatz stand:
    // nicht gewertet heisst nicht verschwiegen.
    expect(t).toContain("Ohne Wertung bleiben die anderen Zahlen der Zeile trotzdem stehen");
    // Nie etwas gegen ein Kind: keine Podestsprache, kein „Letzter".
    expect(t).not.toMatch(/Platz \d|Sieger|Gewinner|Letzte|Medaille|Podest/);
  });

  it("zeigt die gewertete Anschlagszahl, wo der Zeitzuschlag gewirkt hat", async () => {
    klassenProben = {
      // Kein Vorlesen gemessen ⇒ der pauschale Zuschlag greift: 90 ⇒ 135.
      "k-runa": [
        ergebnis({ zeichen: 900, fehler: 30, anschlaege: 90, zuschlagProzent: 50 }),
      ],
      // Vorlesezeit GEMESSEN ⇒ kein Zuschlag, also auch kein Hinweis.
      "k-ferdi": [
        ergebnis({
          zeichen: 900,
          fehler: 30,
          anschlaege: 90,
          zuschlagProzent: 50,
          wartezeitMs: 40_000,
        }),
      ],
    };
    zeige();
    await waitFor(() => expect(document.body.textContent).toContain("Vergangene"));
    await waitFor(() => expect(document.body.textContent).toContain("mit Zeitzuschlag"));

    const zeileVon = (name: string) =>
      [...document.querySelectorAll("tbody tr")].find(
        (tr) => tr.querySelector("th")?.textContent?.trim() === name,
      )?.textContent ?? "";

    expect(zeileVon("Runa")).toContain("mit Zeitzuschlag gewertet: 135");
    expect(zeileVon("Ferdi")).not.toContain("mit Zeitzuschlag");
  });

  it("ordnet auch eine ältere Runde nach dem Rang - zugeklappt, bis man sie öffnet", async () => {
    // Eine zweite, ÄLTERE Runde mit denselben Kindern, zehn Tage vor der letzten.
    const alt = (e: Probenergebnis): Probenergebnis => ({
      ...e,
      probeId: "sp-alt",
      beginnMs: START_MS - 7 * 24 * 3600_000,
      endeMs: START_MS - 7 * 24 * 3600_000 + 600_000,
    });
    const jetzt = fixture();
    klassenProben = Object.fromEntries(
      Object.entries(jetzt).map(([id, liste]) => [id, [...liste, ...liste.map(alt)]]),
    );
    zeige();
    await waitFor(() => expect(document.body.textContent).toContain("Vergangene"));
    await waitFor(() => expect(document.body.textContent).toContain("nicht angetreten"));

    // ★ Seit 11.09.2026 abends steht die Liste im einklappbaren Kasten, und
    // der ist beim Laden zu - erst sein Schalter macht sie zugänglich.
    fireEvent.click(screen.getByRole("button", { name: "Tippchallenge" }));
    // ★ L3 (19.09.2026): ALLE Runden stehen zu, auch die eben beendete - die
    // Liste ist nach Datum geordnet, die ältere steht darum an zweiter Stelle.
    // Erst ein Druck öffnet sie.
    const aufklapper = screen
      .getAllByRole("button")
      .filter((b) => b.closest("li") && b.getAttribute("aria-expanded") === "false")[1];
    expect(aufklapper, "die ältere Runde steht nicht zugeklappt da").toBeTruthy();
    const eintrag = aufklapper!.closest("li") as HTMLElement;
    fireEvent.click(aufklapper!);
    await waitFor(() => expect(aufklapper!.getAttribute("aria-expanded")).toBe("true"));

    // Dieselbe Ordnung - ohne Ada, die dort kein Ergebnis hat.
    expect(tabelle(eintrag).map((z) => z.name)).toEqual(["Runa", "Ferdi", "Timo", "Nabil"]);
  });

  it("die Braillezeile bleibt ruhig, und nichts ist `disabled`", async () => {
    zeige();
    await waitFor(() => expect(document.body.textContent).toContain("Vergangene"));
    await waitFor(() => expect(document.body.textContent).toContain("nicht angetreten"));

    // Gegenprobe: Der Rang MUSS irgendwo stehen - sonst prüft die Schleife nichts.
    expect(document.body.textContent).toContain("93,2 %");
    // ⚠️ Und er darf in KEINER Live-Region stehen: Jede Meldung dort verdrängt
    // die Braillezeile vier Sekunden lang.
    for (const bereich of document.querySelectorAll("[aria-live]")) {
      expect(bereich.textContent ?? "").not.toMatch(/\d+,\d\s*%/);
    }
    // R5: nichts wird je `disabled`.
    expect(document.querySelectorAll("[disabled]").length).toBe(0);
  });
});
