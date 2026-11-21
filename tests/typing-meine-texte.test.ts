/**
 * WÄCHTER über „Meine Texte" - die Textablage EINER Lehrkraft (E8, 19.09.2026).
 *
 * Geprüft wird die LOKALE Bauart (`account.ts`, dasselbe Fach wie
 * `eigeneTexte`, siehe dort) - reine Funktionen, kein Backend-Mock nötig.
 * Die Server-Regeln (`tt_meine_texte`) prüft
 * `tastenflow-meine-texte-server.test.ts` als Text; dass PocketBase sie so
 * AUSWERTET, ist Sache des Live-Beweises nach dem Deploy.
 *
 * ★★★★★ Der Punkt, um den sich alles dreht (Johannes, Entwurf-Dokument §7a
 * Frage 7): *„‚Meine Texte' nur im eigenen Konto, kein Teilen."* - eine
 * Lehrkraft sieht NIE die Ablage einer anderen, auch nicht über die Id.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  leseMeinenText,
  listeMeineTexte,
  loescheMeinenText,
  speichereMeinenText,
} from "@/lib/typing/account";
import { ersteWorte, MEINE_TEXTE_VORSCHAU_LAENGE } from "@/lib/typing/meineTexte";

afterEach(() => vi.useRealTimers());

describe("Meine Texte - die Textablage einer Lehrkraft", () => {
  it("speichert einen Text und liest ihn wieder", async () => {
    const id = speichereMeinenText("lehrer-a", "gedicht.txt", ["Erste Zeile", "Zweite Zeile"]);
    expect(id).not.toBeNull();
    const gelesen = leseMeinenText(id!);
    expect(gelesen).toEqual({ dateiname: "gedicht.txt", zeilen: ["Erste Zeile", "Zweite Zeile"] });
  });

  it("listet nur die EIGENEN Texte, jüngste zuerst", () => {
    // ★ Echte Zeitabstände nötig: zwei Speicherungen im selben Tick trügen
    // dasselbe `erstelltMs" - ein stabiler Sort beließe sie dann in der
    // Einfüge-Reihenfolge, und der Test bewiese nichts über die Sortierung.
    vi.useFakeTimers();
    try {
      vi.setSystemTime(1000);
      speichereMeinenText("lehrer-a", "erstes.txt", ["a"]);
      speichereMeinenText("lehrer-b", "fremdes.txt", ["b"]); // gehört einer ANDEREN Lehrkraft
      vi.setSystemTime(2000);
      speichereMeinenText("lehrer-a", "zweites.txt", ["c"]);
    } finally {
      vi.useRealTimers();
    }

    const liste = listeMeineTexte("lehrer-a");
    expect(liste.map((e) => e.dateiname)).toEqual(["zweites.txt", "erstes.txt"]);
    expect(liste.every((e) => e.dateiname !== "fremdes.txt")).toBe(true);
  });

  it("★★★★★ kein Teilen: eine fremde Lehrkraft sieht die Ablage nicht, auch nicht leer", () => {
    speichereMeinenText("lehrer-a", "geheim.txt", ["x"]);
    expect(listeMeineTexte("lehrer-b")).toEqual([]);
  });

  it("trägt die ersten Worte für die Liste", () => {
    speichereMeinenText("lehrer-a", "satz.txt", ["Ein kurzer Satz", "noch einer"]);
    const liste = listeMeineTexte("lehrer-a");
    expect(liste[0].ersteWorte).toBe("Ein kurzer Satz noch einer");
  });

  it("löscht nur, wenn die anfragende Lehrkraft die Eigentümerin ist", () => {
    const id = speichereMeinenText("lehrer-a", "loeschbar.txt", ["x"])!;
    // Eine fremde Lehrkraft darf NICHT löschen - „kein Teilen" gilt auch hier.
    expect(loescheMeinenText(id, "lehrer-b")).toBe(false);
    expect(leseMeinenText(id)).not.toBeNull();
    // Die Eigentümerin darf.
    expect(loescheMeinenText(id, "lehrer-a")).toBe(true);
    expect(leseMeinenText(id)).toBeNull();
  });

  it("das Löschen eines nicht (mehr) vorhandenen Eintrags meldet false", () => {
    expect(loescheMeinenText("nicht-vorhanden", "lehrer-a")).toBe(false);
  });

  it("ein Upload legt IMMER eine NEUE Zeile an - kein Überschreiben", () => {
    const erste = speichereMeinenText("lehrer-a", "gleicher-name.txt", ["alt"])!;
    const zweite = speichereMeinenText("lehrer-a", "gleicher-name.txt", ["neu"])!;
    expect(erste).not.toBe(zweite);
    expect(listeMeineTexte("lehrer-a")).toHaveLength(2);
  });
});

describe("ersteWorte - die Kurzfassung für die Liste", () => {
  it("gibt kurze Texte unverändert zurück", () => {
    expect(ersteWorte(["Ein kurzer Text"])).toBe("Ein kurzer Text");
  });

  it("schneidet lange Texte mit „…“ ab", () => {
    const lang = ["a".repeat(MEINE_TEXTE_VORSCHAU_LAENGE + 20)];
    const kurz = ersteWorte(lang);
    expect(kurz.endsWith("…")).toBe(true);
    expect(kurz.length).toBeLessThanOrEqual(MEINE_TEXTE_VORSCHAU_LAENGE + 1);
  });

  it("zieht mehrere Zeilen zu einem Fließtext zusammen", () => {
    expect(ersteWorte(["Zeile eins", "Zeile zwei"])).toBe("Zeile eins Zeile zwei");
  });
});
