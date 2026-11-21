/**
 * ★★ Die Veränderungs-Rechnung (01.09.2026).
 *
 * Der EINBAU steht in `tastenflow-tabelle-veraenderung.test.tsx`. Hier stehen
 * die beiden Entscheidungen, die man in der Tabelle nicht sieht: die Totzone
 * und der Vergleichszeitraum.
 */
import { describe, expect, it } from "vitest";

import {
  ohneVergleichSatz,
  veraenderung,
  veraenderungSatz,
} from "@/lib/typing/veraenderung";
import { vergleichsGrenzen, vergleichsName } from "@/lib/typing/zeitraum";
import { schuljahrVon } from "@/lib/typing/jahreskarte";

const WOCHE = 7 * 86_400_000;

describe("★★★ Die Totzone - ein Pfeil zeigt Entwicklung, nicht Rauschen", () => {
  it(`94,6 % gegen 94,4 % ist „gleich", nicht „besser"`, () => {
    /*
      ⚠️ Ohne diese Grenze trüge JEDE Zeile jede Woche einen Pfeil. Wer jede
      Woche einen Pfeil sieht, liest bald keinen mehr - der Hinweis wäre damit
      schädlicher als gar keiner.
    */
    expect(veraenderung(94.6, 94.4, "treffer")?.richtung).toBe("gleich");
    expect(veraenderung(96, 94.4, "treffer")?.richtung).toBe("hoch");
    expect(veraenderung(92, 94.4, "treffer")?.richtung).toBe("runter");
  });

  it("beim Tempo sind es 5 Anschläge je Minute", () => {
    expect(veraenderung(123, 120, "tempo")?.richtung).toBe("gleich");
    expect(veraenderung(130, 120, "tempo")?.richtung).toBe("hoch");
    expect(veraenderung(110, 120, "tempo")?.richtung).toBe("runter");
  });

  it("★★★ ein fehlender Vorwert ist KEINE Null", () => {
    /*
      Wer vorige Woche nicht da war, ist nicht „von 0 auf 95 gestiegen" - er
      hat vorige Woche nicht geübt ([[feedback_zusammenfassung_ist_kein_beleg]]).
    */
    expect(veraenderung(95, null, "treffer")).toBeNull();
    expect(veraenderung(null, 95, "treffer")).toBeNull();
    expect(ohneVergleichSatz("der Woche davor")).toMatch(/nicht geübt/);
    expect(ohneVergleichSatz("")).toMatch(/keinen Zeitraum davor/);
  });

  it("★ der Satz nennt immer eine ZAHL, nie nur ein Urteil", () => {
    const v = veraenderung(96, 94, "treffer")!;
    const satz = veraenderungSatz(v, "treffer", "der Woche davor");
    expect(satz).toMatch(/2 Prozentpunkte/);
    expect(satz).toMatch(/der Woche davor/);
    // Einzahl bleibt Einzahl.
    expect(
      veraenderungSatz(veraenderung(131, 120, "tempo")!, "tempo", "X"),
    ).toMatch(/11 Anschläge je Minute/);
  });
});

describe("★★★ Verglichen wird Gleiches mit Gleichem", () => {
  const jetzt = new Date(2026, 8, 1, 12, 0, 0).getTime();

  it("eine Woche mit der Woche davor", () => {
    const g = vergleichsGrenzen({ art: "woche", wochenVersatz: 0 }, jetzt, null)!;
    expect(g.bisMs - g.vonMs).toBe(WOCHE - 1);
    // Genau eine Woche früher als der laufende Zeitraum.
    expect(g.vonMs).toBe(
      vergleichsGrenzen({ art: "woche", wochenVersatz: 1 }, jetzt, null)!.vonMs -
        WOCHE,
    );
    expect(vergleichsName({ art: "woche", wochenVersatz: 0 }, jetzt)).toBe(
      "der Woche davor",
    );
  });

  it("★★ ein Schuljahr mit dem Schuljahr davor - nicht mit einer Woche", () => {
    /*
      ⚠️ Stünde in der Schuljahr-Ansicht eine Jahreszahl neben einem
      Wochen-Pfeil, trüge EINE Zelle zwei verschiedene Zeiträume
      ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
    */
    const g = vergleichsGrenzen({ art: "schuljahr", wochenVersatz: 0 }, jetzt, null)!;
    const dies = schuljahrVon(jetzt);
    expect(g.bisMs).toBe(dies.vonMs - 1);
    expect(vergleichsName({ art: "schuljahr", wochenVersatz: 0 }, jetzt)).toBe(
      "Schuljahr 2025/26",
    );
  });

  it(`★★★ „Gesamt" hat kein Davor - und erfindet sich keins`, () => {
    expect(vergleichsGrenzen({ art: "gesamt", wochenVersatz: 0 }, jetzt, null)).toBeNull();
    expect(vergleichsName({ art: "gesamt", wochenVersatz: 0 }, jetzt)).toBe("");
  });
});
