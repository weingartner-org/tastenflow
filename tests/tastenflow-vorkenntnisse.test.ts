/**
 * ════════════════════════════════════════════════════════════════════════════
 * VORKENNTNISSE: der Startpunkt darf DAZUNEHMEN - und sonst nichts
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Anlass (Testerin, 01.09.2026): *„Klassiker bei uns ist, dass Schüler zwar die
 * Buchstaben können, aber nicht die Ziffern. Das hätte ich gern zum
 * Auswählen."* Die Stufen gab es schon (`startPoints`), erreichbar waren sie
 * aber nur ohne Anmeldung - beim Anlegen eines Kindes stand der erste Punkt
 * fest verdrahtet, und im Lehrbereich fehlte das Feld ganz.
 *
 * ★★★ SEIT 04.09.2026 HAT DIE REGEL ZWEI HÄLFTEN (Johannes: *„Lehrer dürfen
 * ihre Schüler auch downgraden … wer sich sein Startlevel einstellen kann, soll
 * es auch wieder weniger hoch stellen können - hatten gerade das Problem mit
 * dem Schüler Said, das Startlevel war zu hoch eingestellt."*). Ein zu hoch
 * eingetragener Startpunkt war bis dahin unumkehrbar.
 *
 * ── WAS DIESE DATEI BEWACHT ────────────────────────────────────────────────
 *
 * Die Trennung, deren Bruch niemand bemerken würde, bis ein Kind seine
 * Statistik verliert:
 *
 *  • **Die AUTOMATIK** (`startpunktAngleichen`, läuft bei JEDEM Laden) nimmt
 *    nur dazu, nie weg. Sie muss das, weil sie sich wiederholt: Eine Zuweisung
 *    an dieser Stelle nähme einem Kind bei jedem Öffnen alles wieder weg, was
 *    es sich seit dem Eintrag erübt hat.
 *  • **Der BESCHLUSS** (`startpunktAnwenden`, wenn jemand den Startpunkt
 *    einstellt) gilt in beide Richtungen - und genau EINMAL. Erkannt wird er am
 *    Zeitstempel des Kontos, nicht am Wert: Eine Lehrkraft, die auf denselben
 *    Wert zurückstellt, den sie damals eingetragen hat, träfe sonst auf ein
 *    Bedienelement, das nichts tut.
 *
 * Warum das leicht kaputtgeht: Die naheliegende Zeile wäre
 * `introduced = startpunktEinheiten(startUnits)` - eine Zuweisung, überall. Sie sieht
 * in jedem Test grün aus, in dem das Kind noch nicht geübt hat, und genau das
 * ist der Normalfall beim Anlegen. Der Schaden zeigt sich erst an einem Konto
 * mit Geschichte.
 *
 * ⚠️ Was auch das Zurückstufen NICHT anfasst: Anschlag-Statistik, Abzeichen,
 *    Übezeit. Johannes ausdrücklich: *„bestehende Abzeichen können bleiben."*
 */
import { describe, expect, it } from "vitest";
import {
  INITIAL_LETTERS,
  introOrder,
  startpunktEinheiten,
  startPoints,
  startpunktAngleichen,
  startpunktAnwenden,
} from "@/lib/typing/letters";
import {
  addPupil,
  createClass,
  getProgress,
  registerTeacher,
  setStartUnits,
} from "@/lib/typing/account";

/** Die benannte Stufe „Alle Buchstaben (mit Großschreibung)". */
const buchstaben = () => startPoints("de", "de").find((s) => s.key === "buchstaben")!;
/** Die benannte Stufe „+ Zahlen" - Testerin Fall. */
const zahlen = () => startPoints("de", "de").find((s) => s.key === "zahlen")!;

describe("Startpunkt einer Lehrkraft, angewandt auf ein Kind", () => {
  it("schaltet bis zur gewählten Stufe frei", () => {
    const neu = startpunktAngleichen(startpunktEinheiten(INITIAL_LETTERS, "de"), buchstaben().units, "de");
    expect(neu).not.toBeNull();
    expect(neu!.length).toBe(buchstaben().units);
  });

  it(`★ Testerin Fall: „kann die Buchstaben, nicht die Ziffern" holt die Ziffern dazu`, () => {
    const vorher = startpunktEinheiten(buchstaben().units, "de");
    const neu = startpunktAngleichen(vorher, zahlen().units, "de");
    expect(neu).not.toBeNull();
    // Alles, was vorher da war, ist noch da …
    for (const c of vorher) expect(neu).toContain(c);
    // … und es ist mehr geworden.
    expect(neu!.length).toBeGreaterThan(vorher.length);
  });

  it("★★★★★ DIE AUTOMATIK NIMMT NIE WEG: eine niedrigere Stufe lässt das Kind unberührt", () => {
    /*
      Der Fall, um den es hier geht. Ein Kind steht bei „+ Zahlen", auf dem
      Konto steht „Alle Buchstaben". Nähme die Angleichung das beim Laden
      wörtlich, verlöre das Kind bei JEDEM Öffnen seine Ziffern - samt der
      Anschlag-Statistik, an der das Tor zur nächsten Taste hängt.

      ⇒ Zurückgestuft wird nur auf einen BESCHLUSS hin, und den prüft der
        zweite Block dieser Datei (`startpunktAnwenden`).
    */
    const weit = startpunktEinheiten(zahlen().units, "de");
    expect(startpunktAngleichen(weit, buchstaben().units, "de")).toBeNull();
    expect(startpunktAngleichen(weit, INITIAL_LETTERS, "de")).toBeNull();
    expect(startpunktAngleichen(weit, 0, "de")).toBeNull();
  });

  it(`meldet „nichts zu tun", wenn die Stufe schon erreicht ist`, () => {
    const stand = startpunktEinheiten(buchstaben().units, "de");
    expect(startpunktAngleichen(stand, buchstaben().units, "de")).toBeNull();
  });

  it(`„Anfänger: nur F und J" ändert nie etwas`, () => {
    const anfaenger = startPoints("de", "de")[0];
    expect(anfaenger.units).toBe(INITIAL_LETTERS);
    expect(startpunktAngleichen(undefined, anfaenger.units, "de")).toBeNull();
    expect(startpunktAngleichen(startpunktEinheiten(INITIAL_LETTERS, "de"), anfaenger.units, "de")).toBeNull();
  });

  it("behält die Lehrgangs-Reihenfolge bei", () => {
    const neu = startpunktAngleichen(startpunktEinheiten(INITIAL_LETTERS, "de"), zahlen().units, "de")!;
    const ordnung = introOrder("de");
    const plaetze = neu.map((c) => ordnung.indexOf(c));
    expect(plaetze).toEqual([...plaetze].sort((a, b) => a - b));
    // Keine Taste, die es auf dieser Tastatur nicht gibt.
    expect(plaetze.every((i) => i >= 0)).toBe(true);
  });

  it("verträgt fehlende und leere Angaben", () => {
    expect(startpunktAngleichen(undefined, undefined, "de")).toBeNull();
    expect(startpunktAngleichen([], undefined, "de")).toBeNull();
    expect(startpunktAngleichen(undefined, 0, "de")).toBeNull();
  });
});

describe("Die benannten Stufen selbst", () => {
  it(`★ enthalten „+ Zahlen" - der Fall, für den das Feld gebaut wurde`, () => {
    expect(zahlen()).toBeTruthy();
    expect(zahlen().units).toBeGreaterThan(buchstaben().units);
  });

  it("steigen durchgehend an - sonst könnte eine Stufe eine andere zurücknehmen", () => {
    const werte = startPoints("de", "de").map((s) => s.units);
    expect(werte).toEqual([...werte].sort((a, b) => a - b));
    expect(new Set(werte).size).toBe(werte.length);
  });
});

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ DER BESCHLUSS - zurückstufen, aber genau EINMAL (04.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Saids Fall: Der Startpunkt war zu hoch eingestellt. Bis heute gab es keinen
 * Weg zurück - die Angleichung nahm nur dazu, und das Kind bekam Tasten
 * geschenkt, die es nicht kann.
 *
 * Die beiden Fallen, die dieser Block festnagelt:
 *
 *  1. **Zu viel:** Ein Zurückstufen, das bei jedem Laden neu greift, nimmt dem
 *     Kind alles wieder weg, was es sich seither erübt hat. Der Beschluss gilt
 *     EINMAL - das ist der Unterschied zwischen einer Einstellung und einer
 *     Fessel.
 *  2. **Zu wenig:** Ein Beschluss, der am WERT erkannt wird, greift nicht, wenn
 *     jemand auf genau den Wert zurückstellt, der schon dasteht. Ein Feld, das
 *     in genau dem Fall nichts tut, in dem man es braucht, ist schlimmer als
 *     ein fehlendes ([[feedback_gruener_waechter_beweist_was]]).
 */
describe("Startpunkt-BESCHLUSS: gilt in beide Richtungen, aber einmal", () => {
  /** „Grundstellung (ganze Grundreihe)". */
  const grund = () => startPoints("de", "de").find((s) => s.key === "start")!;
  const T1 = 1_757_000_000_000; // ein Beschluss-Zeitpunkt
  const T2 = T1 + 60_000; // der nächste

  it("★★★★★ SAIDS FALL: ein frischer Beschluss stuft zurück", () => {
    const zuHoch = startpunktEinheiten(buchstaben().units, "de");
    const erg = startpunktAnwenden(zuHoch, grund().units, T1, {}, "de");
    expect(erg).not.toBeNull();
    expect(erg!.introduced).toEqual(startpunktEinheiten(grund().units, "de"));
    expect(erg!.introduced!.length).toBeLessThan(zuHoch.length);
    expect(erg!.vermerk).toEqual({ units: grund().units, am: T1 });
  });

  it("★★★★★ NUR EINMAL: derselbe Beschluss greift kein zweites Mal", () => {
    // Das Kind hat sich nach dem Zurückstufen wieder Tasten erarbeitet.
    const gewachsen = startpunktEinheiten(grund().units + 3, "de");
    expect(
      startpunktAnwenden(gewachsen, grund().units, T1, {
        units: grund().units,
        am: T1,
      }, "de"),
    ).toBeNull();
  });

  it("★ ein ZWEITER Beschluss auf denselben Wert stuft wieder zurück", () => {
    /*
      Genau das Loch, das der Zeitstempel schliesst: Eine Lehrkraft stellt ein
      Kind auf „Grundstellung" zurück, obwohl dort schon „Grundstellung" steht.
      Am Wert allein wäre das nicht zu unterscheiden - und das Feld täte nichts.
    */
    const gewachsen = startpunktEinheiten(buchstaben().units, "de");
    const erg = startpunktAnwenden(gewachsen, grund().units, T2, {
      units: grund().units,
      am: T1,
    }, "de");
    expect(erg).not.toBeNull();
    expect(erg!.introduced).toEqual(startpunktEinheiten(grund().units, "de"));
    expect(erg!.vermerk.am).toBe(T2);
  });

  it("ein Beschluss nach OBEN schaltet frei (Testerin Fall, ausdrücklich)", () => {
    const erg = startpunktAnwenden(startpunktEinheiten(buchstaben().units, "de"), zahlen().units, T1, {}, "de");
    expect(erg!.introduced).toEqual(startpunktEinheiten(zahlen().units, "de"));
  });

  it("★★★★★ ALT-KONTEN: ohne Beschluss-Zeitpunkt wird NIE zurückgestuft", () => {
    /*
      Jedes Konto von vor dem 04.09.2026 trägt einen Startpunkt ohne Zeitpunkt.
      Ob er gerade gewählt wurde oder seit Wochen dasteht, ist nicht
      unterscheidbar - ein Kind, das sich weit geübt hat, darf das nicht
      bezahlen. Es läuft die Automatik, der Vermerk wird nachgetragen.
    */
    const weit = startpunktEinheiten(zahlen().units, "de");
    const erg = startpunktAnwenden(weit, buchstaben().units, 0, {}, "de");
    expect(erg!.introduced).toBeNull(); // nichts weggenommen
    expect(erg!.vermerk).toEqual({ units: buchstaben().units, am: 0 });
  });

  it("ohne Beschluss nimmt die Automatik weiter DAZU", () => {
    const erg = startpunktAnwenden(startpunktEinheiten(buchstaben().units, "de"), zahlen().units, 0, {}, "de");
    expect(erg!.introduced).toEqual(startpunktEinheiten(zahlen().units, "de"));
  });

  it(`meldet „nichts zu tun", wenn Vermerk und Stand schon stimmen`, () => {
    const stand = startpunktEinheiten(zahlen().units, "de");
    expect(
      startpunktAnwenden(stand, zahlen().units, T1, { units: zahlen().units, am: T1 }, "de"),
    ).toBeNull();
    // Auch der Alt-Konten-Weg meldet nichts, sobald der Vermerk steht.
    expect(
      startpunktAnwenden(stand, zahlen().units, 0, { units: zahlen().units, am: 0 }, "de"),
    ).toBeNull();
  });

  it("verträgt fehlende Angaben", () => {
    expect(startpunktAnwenden(undefined, undefined, undefined, undefined, "de")).not.toBeUndefined();
    expect(startpunktAnwenden(undefined, undefined, 0, { units: 0, am: 0 }, "de")).toBeNull();
  });
});

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ AM KONTO ENTLANG - der Weg, den Saids Lehrkraft wirklich geht
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Die Regel oben ist reine Rechnung. Hier wird der Weg geprüft, auf dem sie
 * überhaupt zustande kommt: Die Lehrkraft schreibt an das KONTO, das Kind
 * wendet es beim nächsten Laden an. Den Fortschritt darf nur das Kind selbst
 * schreiben - diese Grenze bleibt unangetastet.
 *
 * ⚠️ Die Zeile, die dabei am leichtesten verlorengeht: `setStartUnits` muss den
 *    ZEITSTEMPEL mitschreiben. Ohne ihn ist der Wert kein Beschluss, und das
 *    Zurückstufen wäre still wieder ausgebaut - bei grünen Rechen-Tests.
 */
describe("Startpunkt am Konto: Lehrkraft trägt ein, Kind wendet an", () => {
  const grund = () => startPoints("de", "de").find((s) => s.key === "start")!;

  it("★★★★★ SAIDS FALL, ganzer Weg: zu hoch angelegt, dann zurückgestuft", () => {
    const t = registerTeacher("Frau Start", "startpunkt-test@example.org", "geheim1");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "Startklasse");
    if (!c.ok) throw new Error(c.error);
    // Angelegt mit einem Startpunkt, der zu hoch ist.
    const p = addPupil(c.value.code, "Said", "pw12", "b", "normal", zahlen().units);
    if (!p.ok) throw new Error(p.error);
    expect(getProgress(p.value.id).introduced).toEqual(startpunktEinheiten(zahlen().units, "de"));

    // Die Lehrkraft stuft zurück.
    const konto = setStartUnits(p.value.id, grund().units);
    expect(konto?.startUnits).toBe(grund().units);
    expect(konto?.startUnitsAt ?? 0).toBeGreaterThan(0); // ← daran hängt alles

    // Was das Kind beim nächsten Öffnen tut.
    const erg = startpunktAnwenden(
      getProgress(p.value.id).introduced,
      konto!.startUnits,
      konto!.startUnitsAt,
      {}, "de",
    );
    expect(erg!.introduced).toEqual(startpunktEinheiten(grund().units, "de"));

    // Und beim übernächsten Öffnen geschieht nichts mehr.
    expect(
      startpunktAnwenden(
        erg!.introduced ?? undefined,
        konto!.startUnits,
        konto!.startUnitsAt,
        erg!.vermerk, "de",
      ),
    ).toBeNull();
  });
});
