import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * ★★★★★ DIE WOCHENBERICHT-MAIL (W5, 19.09.2026) - Rendertests der REINEN
 * Funktion `berichtHtml` (und ihrer Zellen-Helfer) aus
 * `pocketbase/pb_hooks/tt_wochenziel_lib.pb.js`. Johannes: „Mail brauch ich
 * unbedingt, bitte mach sie gut und richtig."
 *
 * Geladen wie eine ECHTE PocketBase-Instanz die Datei sähe (CommonJS,
 * `new Function`) - Muster wie tests/tastenflow-wochenziel-server-zwilling.
 * test.ts. `berichtHtml` selbst braucht kein `$app`, ist also ohne PocketBase
 * testbar UND für die Beispiel-Mail wiederverwendbar
 * (scripts/beispiel-wochenmail.mjs).
 */

interface Zeile {
  name: string;
  geuebtMin: number;
  tage: number;
  treffsicherheit: string | null;
  stufe: string | null;
  hatZiel: boolean;
  zielwoche: boolean;
  erlassen: boolean;
  zielMin: number;
  erfuelltMin: number;
  offenMin: number;
  schuljahrAnteil: number | null;
  nachholenOffenMin: number | null;
}

interface BerichtDaten {
  klasse: string;
  wocheStartMs: number;
  zeilen: Zeile[];
  klassenLink?: string;
  gesperrtMs?: number;
  fussHtml?: string;
}

interface WochenzielLib {
  wochenStartMs: (utcMs: number) => number;
  berichtHtml: (daten: BerichtDaten) => { subject: string; html: string };
  wochenzielZellenText: (zeile: Partial<Zeile>) => string;
  schuljahrZellenText: (anteil: number | null) => string;
  nachholenZellenText: (zeile: Partial<Zeile>) => string;
  formatStunden: (ms: number) => string;
  fmtTagMonat: (utcMs: number) => string;
}

function ladeHookLib(pfad: string): WochenzielLib {
  const code = readFileSync(resolve(__dirname, pfad), "utf8");
  const mod = { exports: {} };
  new Function("module", "exports", "require", code)(mod, mod.exports, () => ({}));
  return mod.exports as WochenzielLib;
}
const wz = ladeHookLib("../pocketbase/pb_hooks/tt_wochenziel_lib.pb.js");

/** Montag, 21.09.2026, 08:00 Wien (weit weg von jeder Zeitumstellung). */
const MONTAG = new Date(2026, 8, 21, 8, 0, 0).getTime();

function zeile(extra: Partial<Zeile> = {}): Zeile {
  return {
    name: "Kind",
    geuebtMin: 0,
    tage: 0,
    treffsicherheit: null,
    stufe: null,
    hatZiel: false,
    zielwoche: false,
    erlassen: false,
    zielMin: 0,
    erfuelltMin: 0,
    offenMin: 0,
    schuljahrAnteil: null,
    nachholenOffenMin: null,
    ...extra,
  };
}

describe("★★★★★ Wochenbericht-Mail: Betreff, Einleitung, Zusammenfassung", () => {
  it("Betreff: „Wochenbericht Tastenflow - {Klasse} (KW {n})“", () => {
    const { subject } = wz.berichtHtml({ klasse: "3B", wocheStartMs: MONTAG, zeilen: [] });
    expect(subject).toBe("Wochenbericht Tastenflow - 3B (KW 39)");
  });

  it("Einleitung nennt beide Montage mit Datum und Uhrzeit", () => {
    const { html } = wz.berichtHtml({ klasse: "3B", zeilen: [], wocheStartMs: MONTAG });
    expect(html).toContain(
      "Wochenbericht für Ihre Klasse <b>3B</b>, Woche von Montag, 21.09., 8:00 Uhr bis Montag, 28.09., 8:00 Uhr.",
    );
  });

  it("Einleitung über eine DST-Woche (letzter Sonntag im Oktober 2026)", () => {
    // Montag, 26.10.2026 08:00 - die Woche endet am Montag NACH der
    // Zeitumstellung (letzter Sonntag im Oktober). Das Datum muss trotzdem
    // stimmen, nicht um eine Stunde/einen Tag verschoben sein.
    const montagVorUmstellung = new Date(2026, 9, 26, 8, 0, 0).getTime();
    const { html } = wz.berichtHtml({ klasse: "DST", zeilen: [], wocheStartMs: montagVorUmstellung });
    expect(html).toContain("Woche von Montag, 26.10., 8:00 Uhr bis Montag, 02.11., 8:00 Uhr.");
  });

  it("Zusammenfassung zählt aktive Kinder, Minuten und erreichte Wochenziele", () => {
    const zeilen = [
      zeile({ name: "Lena", geuebtMin: 62, tage: 3, hatZiel: true, zielwoche: true, zielMin: 60, erfuelltMin: 60, offenMin: 0 }),
      zeile({ name: "Jonas", geuebtMin: 20, tage: 2, hatZiel: true, zielwoche: true, zielMin: 60, erfuelltMin: 20, offenMin: 40 }),
      zeile({ name: "Emir", geuebtMin: 0, tage: 0 }),
    ];
    const { html } = wz.berichtHtml({ klasse: "3B", zeilen, wocheStartMs: MONTAG });
    expect(html).toContain("2 von 3 Kindern haben geübt, zusammen 82 Minuten.");
    expect(html).toContain("1 von 2 Kindern mit Wochenziel hat es erreicht.");
  });

  it('Einzahl: 1 von 3 Kindern hat geübt, zusammen 1 Minute - ohne Zielwoche kein zweiter Satz', () => {
    const zeilen = [
      zeile({ name: "Lena", geuebtMin: 1, tage: 1 }),
      zeile({ name: "Jonas", geuebtMin: 0, tage: 0 }),
      zeile({ name: "Emir", geuebtMin: 0, tage: 0 }),
    ];
    const { html } = wz.berichtHtml({ klasse: "3B", zeilen, wocheStartMs: MONTAG });
    expect(html).toContain("1 von 3 Kindern hat geübt, zusammen 1 Minute.");
    expect(html).not.toContain("0 von 0");
    expect(html).not.toContain("mit Wochenziel");
  });

  it("erwähnt gesperrte Zeit nur, wenn welche in die Woche fällt", () => {
    const ohneSperre = wz.berichtHtml({ klasse: "3B", zeilen: [], wocheStartMs: MONTAG, gesperrtMs: 0 });
    expect(ohneSperre.html).not.toContain("gesperrt");

    const mitEinerStunde = wz.berichtHtml({ klasse: "3B", zeilen: [], wocheStartMs: MONTAG, gesperrtMs: 3_600_000 });
    expect(mitEinerStunde.html).toContain(
      "In dieser Woche war 1 Stunde gesperrt - Übung darin zählt nicht fürs Wochenziel.",
    );

    const mitZweieinhalbStunden = wz.berichtHtml({
      klasse: "3B",
      zeilen: [],
      wocheStartMs: MONTAG,
      gesperrtMs: 2.5 * 3_600_000,
    });
    expect(mitZweieinhalbStunden.html).toContain("In dieser Woche war 2,5 Stunden gesperrt");
  });

  it("zeigt den Klassen-Link nur, wenn einer übergeben wurde", () => {
    const ohne = wz.berichtHtml({ klasse: "3B", zeilen: [], wocheStartMs: MONTAG });
    expect(ohne.html).not.toContain("<a href");

    const mit = wz.berichtHtml({
      klasse: "3B",
      zeilen: [],
      wocheStartMs: MONTAG,
      klassenLink: "https://tastenflow.org/meine-klasse?klasse=abc123&app=tippen",
    });
    expect(mit.html).toContain('<a href="https://tastenflow.org/meine-klasse?klasse=abc123&amp;app=tippen">Zur Klasse 3B</a>');
  });

  it("hängt den Fuss (Abbestellen) unverändert an", () => {
    const { html } = wz.berichtHtml({
      klasse: "3B",
      zeilen: [],
      wocheStartMs: MONTAG,
      fussHtml: '<p style="color:#666">FUSS-MARKE</p>',
    });
    expect(html).toContain('<p style="color:#666">FUSS-MARKE</p>');
    expect(html.endsWith('<p style="color:#666">FUSS-MARKE</p>')).toBe(true);
  });
});

describe("★★★★★ Wochenbericht-Mail: die Tabellen-Kopfzeilen", () => {
  it("nennt alle acht Spalten in der richtigen Reihenfolge", () => {
    const { html } = wz.berichtHtml({ klasse: "3B", zeilen: [], wocheStartMs: MONTAG });
    const spalten = ["Name", "Geübt", "Tage", "Treffsicherheit", "Stufe", "Wochenziel", "Schuljahr", "Nachholen"];
    let letzterIndex = -1;
    for (const spalte of spalten) {
      const i = html.indexOf(">" + spalte + "<");
      expect(i, `Spalte "${spalte}"`).toBeGreaterThan(letzterIndex);
      letzterIndex = i;
    }
  });
});

describe("★★★★★ Wochenbericht-Mail: die Wochenziel-Zelle, jede Variante", () => {
  it("„kein Ziel“ - nie ein Zielverlauf gesetzt", () => {
    expect(wz.wochenzielZellenText(zeile({ hatZiel: false }))).toBe("kein Ziel");
  });

  it("„erlassen“ - für dieses Kind einzeln erlassen", () => {
    expect(wz.wochenzielZellenText(zeile({ hatZiel: true, erlassen: true }))).toBe("erlassen");
  });

  it("„keine Zielwoche“ - Ziel gesetzt, aber diese Woche keine Ziel-Woche", () => {
    expect(wz.wochenzielZellenText(zeile({ hatZiel: true, zielwoche: false }))).toBe("keine Zielwoche");
  });

  it("„45 von 60 Min.“ ohne Häkchen, solange offen", () => {
    const text = wz.wochenzielZellenText(
      zeile({ hatZiel: true, zielwoche: true, zielMin: 60, erfuelltMin: 45, offenMin: 15 }),
    );
    expect(text).toBe("45 von 60 Min.");
  });

  it("„60 von 60 Min. ✓“ - erreicht, ein Häkchen, KEIN rotes Kreuz irgendwo", () => {
    const text = wz.wochenzielZellenText(
      zeile({ hatZiel: true, zielwoche: true, zielMin: 60, erfuelltMin: 60, offenMin: 0 }),
    );
    expect(text).toBe("60 von 60 Min. ✓");
    expect(text).not.toContain("✗"); // kein ✗
    expect(text).not.toMatch(/[x✗×]/i);
  });
});

describe("★★★★★ Wochenbericht-Mail: die Schuljahr- und die Nachholen-Zelle", () => {
  it("Schuljahr: „-“ ohne eine einzige abgeschlossene Ziel-Woche", () => {
    expect(wz.schuljahrZellenText(null)).toBe("-");
  });

  it("Schuljahr: gerundeter Prozentsatz", () => {
    expect(wz.schuljahrZellenText(0.874)).toBe("87 %");
    expect(wz.schuljahrZellenText(1)).toBe("100 %");
  });

  it("Nachholen: leer ohne Nachholen oder ohne offene Minuten", () => {
    expect(wz.nachholenZellenText(zeile({ nachholenOffenMin: null }))).toBe("");
    expect(wz.nachholenZellenText(zeile({ nachholenOffenMin: 0 }))).toBe("");
  });

  it("Nachholen: „15 Min. offen“, wenn Nachholen an ist und Minuten offen sind", () => {
    expect(wz.nachholenZellenText(zeile({ nachholenOffenMin: 15.4 }))).toBe("15 Min. offen");
  });
});

describe("★★★★★ Wochenbericht-Mail: Hausregeln (echte Umlaute, nur Bindestrich, kein „Einheit“)", () => {
  it("kein Gedankenstrich (– oder —), nur der Bindestrich -", () => {
    const zeilen = [
      zeile({ name: "Lena", hatZiel: true, zielwoche: true, zielMin: 60, erfuelltMin: 60, offenMin: 0, schuljahrAnteil: 0.9 }),
    ];
    const { subject, html } = wz.berichtHtml({
      klasse: "3B",
      zeilen,
      wocheStartMs: MONTAG,
      gesperrtMs: 3_600_000,
    });
    expect(subject).not.toMatch(/[–—]/);
    expect(html).not.toMatch(/[–—]/);
  });

  it("nirgends das Wort „Einheit“ - das neue Wochenziel rechnet in Minuten", () => {
    const zeilen = [
      zeile({ name: "Jonas", hatZiel: true, zielwoche: true, zielMin: 60, erfuelltMin: 20, offenMin: 40, nachholenOffenMin: 40 }),
    ];
    const { html } = wz.berichtHtml({ klasse: "3B", zeilen, wocheStartMs: MONTAG, gesperrtMs: 3_600_000 });
    expect(html.toLowerCase()).not.toContain("einheit");
  });

  it("kein rotes Kreuz irgendwo in der ganzen Mail - nie etwas gegen ein Kind", () => {
    const zeilen = [
      zeile({ name: "Emir", geuebtMin: 0, tage: 0, hatZiel: true, zielwoche: true, zielMin: 45, erfuelltMin: 0, offenMin: 45 }),
    ];
    const { html } = wz.berichtHtml({ klasse: "3B", zeilen, wocheStartMs: MONTAG });
    expect(html).not.toContain("✗");
    expect(html).not.toContain("✗");
  });

  it("escaped Namen mit Sonderzeichen (kein kaputtes HTML durch einen Kindernamen)", () => {
    const zeilen = [zeile({ name: 'Ma<x> & "Cie"' })];
    const { html } = wz.berichtHtml({ klasse: "3B", zeilen, wocheStartMs: MONTAG });
    expect(html).toContain("Ma&lt;x&gt; &amp; &quot;Cie&quot;");
    expect(html).not.toContain("<x>");
  });
});
