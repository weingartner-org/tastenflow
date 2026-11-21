/**
 * Der WÄCHTER über alle Übungsformen zusammen (02.09.2026).
 *
 * Jede Form bringt ihre eigenen Tests mit. Dieser hier prüft, was keine
 * einzelne Form prüfen kann: dass die REGISTRY vollständig ist, dass die
 * Reihum-Zählung wirklich jede Form drankommen lässt, dass KEINE Form je eine
 * Taste verlangt, die ein Kind nicht gelernt hat - und dass die Zählung das
 * Speichern übersteht.
 *
 * ★★ Der letzte Punkt ist kein theoretischer: `loadProgress` hat eine
 * Whitelist. Was dort fehlt, geht anonymen Ständen beim Neuladen verloren -
 * das ist in diesem Projekt schon zweimal passiert (Ledger, Serien-Fortschritt).
 * Ohne diesen Fall bekäme ein Kind ohne Konto ewig dieselbe erste Form.
 */
import { describe, expect, it } from "vitest";
import {
  GESCHICHTE,
  UEBUNGSFORMEN,
  angebotVermerkt,
  leererStand,
  naechstesAngebot,
  standAus,
  verfuegbareFormen,
  type AngebotId,
  type FormKontext,
} from "@/lib/typing/uebungsformen";
import { fitText } from "@/lib/typing/corpus";
import { loadProgress, saveProgress } from "@/lib/typing/progress";

/** Ein fester Zufall - sonst prüft der Wächter jedes Mal etwas anderes. */
function festerZufall(saat: number): () => number {
  let z = saat >>> 0;
  return () => {
    z = (z * 1664525 + 1013904223) >>> 0;
    return z / 4294967296;
  };
}

const VOLL = [
  ..."abcdefghijklmnopqrstuvwxyzäöüß".split(""),
  "⇧",
  ".",
  ",",
  "?",
  "!",
  "-",
];

function ctxMit(introduced: string[], saat = 7): FormKontext {
  return {
    lernweg: "de",
    introduced,
    shift: introduced.includes("⇧"),
    oneHand: false,
    stufe: "kids",
    lang: "de",
    count: 12,
    zufall: festerZufall(saat),
  };
}

describe(`Registry der Uebungsformen`, () => {
  it(`fuehrt genau die angebotenen Formen - das Gelaeufigkeitsschreiben gehoert NICHT dazu`, () => {
    const ids = UEBUNGSFORMEN.map((f) => f.id).sort();
    expect(ids).toEqual(
      [
        // Charge A + B (01./02.09.2026)
        "alphabetreihen",
        "buchstabensalat",
        "fingerdiktat",
        "handschwerpunkte",
        "lueckentext",
        "pyramide",
        "wandernder-gross",
        // Charge C (02.09.2026) - aus den Vorschlaegen ausgewaehlt
        "korrekturlesen",
        "langersatz",
        "spiegelwoerter",
        "wasfehlt",
        "zahlendiktat",
        "zwillingsgriffe",
        // 23.10.2026 - Testerin Galgenmännchen als Iglu-Raten
        "iglu",
      ].sort(),
    );
  });

  it(`vergibt jede Kennung nur einmal`, () => {
    const ids = UEBUNGSFORMEN.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it(`kuendigt jede Form mit einem GANZEN SATZ an - in beiden Sprachen`, () => {
    for (const f of UEBUNGSFORMEN)
      for (const lang of ["de", "en"] as const) {
        const satz = f.ankuendigung({ ...ctxMit(VOLL), lang });
        expect(satz.length, f.id).toBeGreaterThan(12);
        // Ein Satz endet mit einem Satzzeichen. Fuer ein Kind mit Blindheit ist
        // diese Ankuendigung die ganze Information ueber das, was kommt.
        expect(satz.trim().endsWith(".") || satz.trim().endsWith("!"), f.id).toBe(true);
      }
  });

  it(`hat je Form entweder einen Bau ODER einen eigenen Bildschirm - nie beides, nie keines`, () => {
    for (const f of UEBUNGSFORMEN) {
      const zeilenform = typeof f.baue === "function";
      const eigen = !!f.eigenerBildschirm;
      expect(zeilenform !== eigen, f.id).toBe(true);
      // Wer einen Raetsel-Bildschirm hat, muss auch Fragen liefern.
      if (f.eigenerBildschirm === "raetsel")
        expect(typeof f.fragen, f.id).toBe("function");
    }
  });
});

describe(`Keine Form verlangt je eine ungelernte Taste`, () => {
  // Mehrere echte Taststaende - von der Grundreihe bis zum vollen Vorrat.
  const staende: [string, string[]][] = [
    [`Grundreihe`, "asdfjklö".split("")],
    [`Grundreihe plus g h`, "asdfghjklö".split("")],
    [`halbes Alphabet`, "abcdefghijklmnopqrst".split("")],
    [`alles mit Umschalt`, VOLL],
  ];
  for (const [name, introduced] of staende)
    it(`${name}`, () => {
      const allowed = new Set(introduced);
      for (const f of UEBUNGSFORMEN) {
        for (let saat = 1; saat <= 5; saat++) {
          const ctx = ctxMit(introduced, saat);
          if (!f.taugt(ctx)) continue;
          if (f.baue) {
            const runde = f.baue(ctx);
            if (!runde) continue;
            for (const z of runde.zeilen)
              expect(fitText(z.text, allowed), `${f.id}: ${z.text}`).toBe(z.text);
          }
          if (f.fragen)
            for (const a of f.fragen(ctx))
              // Getippt wird die ANTWORT, nicht die Frage - die wird nur gelesen.
              expect(fitText(a.antworten[0], allowed), `${f.id}: ${a.antworten[0]}`).toBe(
                a.antworten[0],
              );
        }
      }
    });
});

describe(`Reihum - wer immer den Hauptknopf drueckt, kommt an allem vorbei`, () => {
  it(`bietet in den ersten Runden JEDE verfuegbare Form genau einmal an`, () => {
    const ctx = ctxMit(VOLL);
    const verfuegbar: AngebotId[] = [...verfuegbareFormen(ctx), GESCHICHTE];
    let stand = leererStand();
    const gesehen: AngebotId[] = [];
    for (let i = 0; i < verfuegbar.length; i++) {
      const naechstes = naechstesAngebot(stand, verfuegbar);
      expect(naechstes).not.toBeNull();
      gesehen.push(naechstes!);
      stand = angebotVermerkt(stand, naechstes!);
    }
    expect(new Set(gesehen).size).toBe(verfuegbar.length);
  });

  it(`laesst nichts verhungern - auch nach 200 Runden liegt der Abstand bei hoechstens einem Durchlauf`, () => {
    const ctx = ctxMit(VOLL);
    const verfuegbar: AngebotId[] = [...verfuegbareFormen(ctx), GESCHICHTE];
    let stand = leererStand();
    const zaehler = new Map<AngebotId, number>();
    for (let i = 0; i < 200; i++) {
      const n = naechstesAngebot(stand, verfuegbar)!;
      zaehler.set(n, (zaehler.get(n) ?? 0) + 1);
      stand = angebotVermerkt(stand, n);
    }
    const werte = [...zaehler.values()];
    expect(zaehler.size).toBe(verfuegbar.length);
    expect(Math.max(...werte) - Math.min(...werte)).toBeLessThanOrEqual(1);
  });

  it(`eine Form, die noch nicht taugt, blockiert die Reihe nicht`, () => {
    // Nur zwei sind verfuegbar - die dritte kommt spaeter dazu und ist dann
    // sofort dran, weil sie am laengsten nicht angeboten wurde.
    let stand = leererStand();
    stand = angebotVermerkt(stand, "alphabetreihen");
    stand = angebotVermerkt(stand, GESCHICHTE);
    expect(naechstesAngebot(stand, ["alphabetreihen", GESCHICHTE, "pyramide"])).toBe(
      "pyramide",
    );
  });

  it(`ohne jedes Angebot bleibt es bei null - die Karte traegt dann einfach Weiter`, () => {
    expect(naechstesAngebot(leererStand(), [])).toBeNull();
  });

  it(`liest einen fremden Stand vorsichtig - Unsinn aus dem Netz wird nicht geglaubt`, () => {
    const stand = standAus({ naechste: -3, zuletzt: { pyramide: "viel", boese: 2 } });
    expect(stand.naechste).toBe(1);
    expect(stand.zuletzt.pyramide).toBeUndefined();
  });
});

describe(`Die Reihum-Zaehlung uebersteht das Speichern`, () => {
  it(`kommt durch loadProgress zurueck - sonst bekaeme ein Kind ohne Konto ewig dieselbe Form`, () => {
    const stand = angebotVermerkt(leererStand(), "pyramide");
    saveProgress({ xp: 0, lessons: {}, letters: {}, formStand: stand });
    const zurueck = loadProgress();
    expect(zurueck.formStand).toEqual(stand);
  });
});
