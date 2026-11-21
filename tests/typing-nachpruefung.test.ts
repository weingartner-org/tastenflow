/**
 * Nachprüfung 28.07.2026 — Gate gegen die Lücke, die zweimal hintereinander
 * aufgetreten ist: Eine Charge behebt eine GRUPPE von Befunden nur teilweise, die
 * Übergabe meldet „alles behoben", und beim nächsten Nachfragen stimmt es nicht.
 *
 * Konkret waren nach dem 27.07. noch offen: 4 von 8 fehlkategorisierten Rätseln,
 * 15 von 19 erfundenen Pseudo-Sprichwörtern, drei Serien-Zeilen (Erd-Nachtseite,
 * „fish boat", „The mother comes in"), die Rabatt-Werbezeile, „genau so" und zwei
 * inhaltsgleiche Doppelfassungen.
 *
 * Dieser Test prüft die BEHAUPTUNG, nicht die Charge: Kein Rätsel darf als `satz`
 * laufen, kein erfundener Sinnspruch als `sprichwort`, und die namentlich
 * genannten Zeilen dürfen nicht mehr auftauchen.
 */
import { describe, it, expect } from "vitest";
import { CORPUS, isDeactivated } from "../src/lib/typing";
import { SERIEN } from "../src/lib/typing/serien";

const AKTIV = CORPUS.filter((i) => !isDeactivated(i.kind, i.text));
const SERIEN_ZEILEN = (SERIEN as readonly { titel: string; etappen: { lines: string[] }[] }[])
  .flatMap((s) => s.etappen.flatMap((e) => e.lines));

describe("Nachprüfung: Fehl-Sorten vollständig bereinigt", () => {
  it("kein Frage-Antwort-Rätsel läuft als »satz« (Prüfbericht 1.1c: 8 Stück)", () => {
    const raetsel = AKTIV.filter(
      (i) =>
        i.kind === "satz" &&
        /^(Was|Wo|Wie|Warum|Welche[rs]?|Wer|Wann)\b/.test(i.text) &&
        /\?.+[!.]$/.test(i.text),
    );
    expect(raetsel.map((r) => r.text)).toEqual([]);
  });

  it("kein erfundener Sinnspruch läuft als »sprichwort« (Prüfbericht 1.1c: ~21)", () => {
    // Die im Bericht namentlich genannten Erfindungen — als `spruch`/`fakt`/`satz`
    // bleiben sie aktiv, als `sprichwort` (= überliefertes Gut) dürfen sie nicht mehr laufen.
    const ERFUNDEN = [
      "Wer rastet im Lernen, der rostet im Können.",
      "Übung macht den Punkt zur Linie.",
      "Sechs Punkte sind ein ganzer Buchstabe.",
      "Wer tastet, der findet.",
      "Auch unter den Fingern kann man lesen.",
      "Der Wald ruft, und das Echo lacht.",
      "Hund und Katze, alte Freunde im Streit.",
      "Sonne im Herzen, Lieder im Mund.",
      "Wer fragt, der lernt.",
      "Reden ist gut, Tun ist besser.",
      "Klein anfangen, groß werden.",
      "Wer lacht, hat mehr Luft.",
      "Wer langsam tastet, liest auch gut.",
      "Ein guter Tag fängt mit Lachen an.",
      "Der Hund mag warme Wurst.",
      "Kater Karl mag warme Milch.",
      "Mein Hut ist im Garten.",
      "Eine Maus im alten Haus.",
    ];
    const nochSprichwort = ERFUNDEN.filter((t) =>
      AKTIV.some((i) => i.kind === "sprichwort" && i.text === t),
    );
    expect(nochSprichwort).toEqual([]);
  });
});

describe("Nachprüfung: die namentlich genannten Rest-Zeilen", () => {
  it("die Serien-Zeilen sind korrigiert", () => {
    // Fehlvorstellung „feste Nachtseite" (Prüfbericht 1.2) …
    expect(SERIEN_ZEILEN).not.toContain("Immer nur eine Seite der Erde schaut zur Sonne.");
    expect(SERIEN_ZEILEN).toContain("Gerade jetzt schaut nur eine Seite der Erde zur Sonne.");
    // … und die beiden Denglisch-Zeilen (Prüfbericht 2.1).
    expect(SERIEN_ZEILEN.filter((z) => /fish boat/.test(z))).toEqual([]);
    expect(SERIEN_ZEILEN.filter((z) => /^The mother comes in/.test(z))).toEqual([]);
  });

  it("Werbesprache und »genau so« sind weg", () => {
    expect(AKTIV.filter((i) => /Im Angebot/.test(i.text)).map((i) => i.text)).toEqual([]);
    expect(AKTIV.filter((i) => /\bgenau so\b/.test(i.text)).map((i) => i.text)).toEqual([]);
  });

  it("kein Fakt läuft in zwei Fassungen (Oktopus/Krake, Faultier-Verdauung)", () => {
    const herzen = AKTIV.filter((i) => /(Oktopus|Krake).*Herzen/.test(i.text));
    expect(herzen.length, herzen.map((h) => h.text).join(" | ")).toBe(1);
    const verdauung = AKTIV.filter((i) => /Faultier.*[Vv]erdau|verdau.*Faultier/.test(i.text));
    expect(verdauung.length, verdauung.map((h) => h.text).join(" | ")).toBe(1);
  });
});
