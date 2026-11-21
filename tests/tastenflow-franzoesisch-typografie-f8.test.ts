/**
 * ★★★ E9a (26.09.2026, Bauplan §1.2 F8, §10.1): das Leerzeichen vor `: ; ! ?`.
 * Die Übungstexte des Weges „fr" werden EINHEITLICH in der Form FR/BE/CH
 * gespeichert (Leerzeichen vor allen vieren) - nur Kanada schreibt anders
 * (kein Leerzeichen vor `; ! ?`, aber weiterhin eines vor `:`, Bauplan §10.1).
 *
 * `wandleTypografie` (franzVariante.ts) ist die letzte Servierstufe, genau wie
 * `wandleSchreibweise` für Englisch (schreibweise.ts) - NACH `fitText`, NACH
 * der Ledger-Kennung, damit ein Wechsel der Landesvariante nie verändert, was
 * ein Kind schon getippt hat, und die Ledger-Kennung immer gegen dieselbe
 * (FR/BE/CH-)Grundform gebildet wird.
 */
import { describe, expect, it } from "vitest";
import { fitText } from "../src/lib/typing/corpus";
import { wandleTypografie } from "../src/lib/typing/franzVariante";
import { ladeTexte, wandleProbentextTypografie, type Probentext } from "../src/lib/typing/schreibproben";

describe("wandleTypografie (F8): das Leerzeichen vor : ; ! ?", () => {
  it("fr-FR/fr-BE/fr-CH: unverändert - die Grundform trägt das Leerzeichen schon", () => {
    const text = "Tu viens ? Bien sûr ; ne bouge pas ! Il est 8 h : viens vite.";
    for (const variante of ["fr-FR", "fr-BE", "fr-CH"] as const) {
      expect(wandleTypografie(text, variante)).toBe(text);
    }
  });

  it("fr-CA: das Leerzeichen vor ; ! ? verschwindet, vor : bleibt es stehen", () => {
    const text = "Tu viens ? Bien sûr ; ne bouge pas ! Il est 8 h : viens vite.";
    expect(wandleTypografie(text, "fr-CA")).toBe(
      "Tu viens? Bien sûr; ne bouge pas! Il est 8 h : viens vite.",
    );
  });

  it("fr-CA: zwei Satzzeichen kurz hintereinander verlieren beide ihr Leerzeichen", () => {
    expect(wandleTypografie("dit-il ; ne bouge pas ?", "fr-CA")).toBe("dit-il; ne bouge pas?");
  });

  it("fr-CA: ein Satzzeichen ohne vorangehendes Leerzeichen bleibt unverändert (nichts zu tun)", () => {
    expect(wandleTypografie("Vraiment?!", "fr-CA")).toBe("Vraiment?!");
  });

  it("ein Text ohne eines der vier Satzzeichen bleibt in jeder Variante gleich", () => {
    const text = "Le chat dort sur le tapis";
    for (const variante of ["fr-FR", "fr-BE", "fr-CH", "fr-CA"] as const) {
      expect(wandleTypografie(text, variante)).toBe(text);
    }
  });
});

describe("Zusammenspiel mit fitText: ein noch nicht gelerntes Satzzeichen nimmt sein Leerzeichen mit", () => {
  // ★ Bauplan §1.2 F8 / Leitfaden §3 Nr. 33: fitText (STRIPPABLE_PUNCT) lässt
  // ein ungelerntes „?" weg, BEVOR die Landes-Typografie überhaupt zum Zug
  // kommt (wandleTypografie läuft danach, siehe corpus.ts `wandleVariante`).
  // „Tu viens ?" darf früh nie zu „Tu viens " (mit Leerzeichen am Ende)
  // werden, egal welche Landesvariante am Ende greift.
  const ohneFragezeichen = new Set(["t", "u", "v", "i", "e", "n", "s"]);
  const mitFragezeichen = new Set([...ohneFragezeichen, "?"]);

  it("? noch nicht gelernt: „Tu viens\" ohne Leerzeichen am Ende", () => {
    const fitted = fitText("Tu viens ?", ohneFragezeichen, "fr");
    expect(fitted).toBe("Tu viens");
    // Die anschliessende Kanada-Umwandlung findet nichts mehr zu tun - kein
    // Sonderfall nötig, kein doppeltes Leerzeichen, keine Verstümmelung.
    expect(wandleTypografie(fitted ?? "", "fr-CA")).toBe("Tu viens");
  });

  it("? gelernt: das Leerzeichen bleibt (FR-Grundform), Kanada nimmt es weg", () => {
    const fitted = fitText("Tu viens ?", mitFragezeichen, "fr");
    expect(fitted).toBe("Tu viens ?");
    expect(wandleTypografie(fitted ?? "", "fr-CA")).toBe("Tu viens?");
  });

  it("Satzzeichen mittendrin (: nicht gelernt) - kein doppeltes/verwaistes Leerzeichen", () => {
    const allowed = new Set(["i", "l", "d", "t", "8", "h", "v", "e", "n", "s"]);
    const fitted = fitText("Il est 8 h : viens", allowed, "fr");
    expect(fitted).toBe("Il est 8 h viens");
  });
});

/**
 * ★ E10d (26.09.2026, Bauplan §7.2 Punkt 3): dasselbe für den DÉFI (die
 * Tippchallenge) - die geschriebenen Probentexte stehen fest in der
 * FR/BE/CH-Grundform, `wandleProbentextTypografie` ist ihre letzte
 * Servierstufe, GENAU wie `wandleTypografie` für den gewöhnlichen Übungslauf.
 */
describe("wandleProbentextTypografie (E10d, Bauplan §7.2 Punkt 3): dieselbe Regel für den Défi", () => {
  const text: Probentext = {
    nr: 0,
    titel: "Test",
    zeilen: ["Tu viens ? Bien sûr ; ne bouge pas !", "Il est 8 h : viens vite."],
  };

  it("fr-FR/fr-BE/fr-CH: unverändert (dieselbe Referenz, keine Kopie nötig)", () => {
    for (const variante of ["fr-FR", "fr-BE", "fr-CH"] as const) {
      expect(wandleProbentextTypografie(text, variante)).toBe(text);
    }
  });

  it("fr-CA: das Leerzeichen vor ; ! ? verschwindet in JEDER Zeile, vor : bleibt es stehen", () => {
    const gewandelt = wandleProbentextTypografie(text, "fr-CA");
    expect(gewandelt.zeilen).toEqual([
      "Tu viens? Bien sûr; ne bouge pas!",
      "Il est 8 h : viens vite.",
    ]);
    // Titel und Nummer bleiben unverändert - nur die Zeilen tragen Typografie.
    expect(gewandelt.nr).toBe(text.nr);
    expect(gewandelt.titel).toBe(text.titel);
  });
});

/**
 * Gegenprobe an ECHTEM Défi-Inhalt (Niveau „Toutes les touches", E13b4): Der
 * Korpus des gewöhnlichen Lehrgangs (`CORPUS_FR`) trägt heute noch KEIN
 * `; ! ?` (siehe Kopf-Kommentar oben) - ein Wächter, der nur dort sucht, würde
 * nichts finden und nichts beweisen (Leitfaden Falle 16/18). Die Défi-Bank
 * „alles" dagegen hat laut BEFUND-2026-09-26-E13B2-DEFI-PONCTUATION.md §3
 * bereits echte Zeilen mit Leerzeichen vor `;`/`!`/`?` UND die Umwandlung für
 * Kanada fehlte dort ausdrücklich noch („gibt es noch nicht"). Diese Prüfung
 * belegt an echten Zeilen, dass sie jetzt existiert.
 */
describe("wandleProbentextTypografie an echtem Défi-Inhalt (Niveau „alles“, fr)", () => {
  it("mindestens eine echte Zeile trägt ein Leerzeichen vor ; ! ? (Gegenprobe: kein leerer Wächter)", async () => {
    const texte = await ladeTexte("alles", "fr");
    const treffer = texte.flatMap((t) => t.zeilen).filter((z) => / [;!?]/.test(z));
    expect(treffer.length).toBeGreaterThan(0);
  });

  it("fr-CA entfernt das Leerzeichen vor ; ! ? in JEDEM betroffenen Text, fr-FR lässt ihn unangetastet", async () => {
    const texte = await ladeTexte("alles", "fr");
    const betroffen = texte.filter((t) => t.zeilen.some((z) => / [;!?]/.test(z)));
    expect(betroffen.length).toBeGreaterThan(0);
    for (const t of betroffen) {
      const ca = wandleProbentextTypografie(t, "fr-CA");
      for (const zeile of ca.zeilen) expect(zeile).not.toMatch(/ [;!?]/);
      const fr = wandleProbentextTypografie(t, "fr-FR");
      expect(fr).toBe(t); // Grundform: unangetastet, dieselbe Referenz
    }
  });
});
