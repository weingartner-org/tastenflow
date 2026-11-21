/**
 * ★★★★★ DER WÄCHTER FÜR DAS MESSGERÄT SELBST - Fluss-Zeile und Sprechdauer.
 * ============================================================================
 *
 * ── WARUM AUSGERECHNET DAS WERKZEUG EINEN WÄCHTER BRAUCHT ──────────────────
 *
 * Am 04.09.2026 hat eine ganze Messnacht die falsche Schicht gemessen:
 * `public/ansage-tempo-messung.html` rief `speechSynthesis.speak()` direkt und
 * übersprang damit genau die Kette, die es prüfen sollte. Die Zahlen waren
 * richtig gemessen und trotzdem wertlos.
 *
 * Auf dem Messgerät im echten Trainer ruht jetzt eine Entscheidung: Passt die
 * Stimme in den Tipprhythmus, oder ist sie eine Geschwindigkeitsgrenze?
 * Johannes am 04.09.2026: *„mit Vorlesen kann man nicht üben, jeder nächste
 * Buchstabe dauert ewig, man kommt nicht in einen Schreibfluss."*
 *
 * ⚠️ DIE FALLE, die dieser Wächter festnagelt: Eine ABGESCHNITTENE Ansage misst
 * den Schnitt, nicht den Text. Zählte sie zur Sprechdauer, sähe die Ansage umso
 * kürzer aus, je schneller getippt wird - das Werkzeug meldete „passt" genau
 * dann, wenn es am wenigsten passt. Ein Wert, der sein eigenes Gegenteil
 * belegt ([[feedback_gruener_waechter_beweist_was]]).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/** Utterance mit echten Ereignis-Hörern - das Messgerät hängt sich daran. */
class FakeUtterance {
  text: string;
  rate = 1;
  pitch = 1;
  volume = 1;
  lang = "";
  voice: SpeechSynthesisVoice | null = null;
  onend: (() => void) | null = null;
  private hoerer: Record<string, Array<() => void>> = {};
  constructor(text: string) {
    this.text = text;
  }
  addEventListener(art: string, fn: () => void): void {
    (this.hoerer[art] ??= []).push(fn);
  }
  removeEventListener(): void {}
  /** Was die Engine meldet: „start", „end", „error". */
  feuere(art: string): void {
    for (const fn of this.hoerer[art] ?? []) fn();
  }
}

const fakeSynth = {
  speaking: false,
  pending: false,
  paused: false,
  getVoices: () => [] as SpeechSynthesisVoice[],
  speak(): void {},
  cancel(): void {},
  resume(): void {},
  pause(): void {},
  addEventListener(): void {},
  removeEventListener(): void {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;
w.speechSynthesis = fakeSynth;
w.SpeechSynthesisUtterance = FakeUtterance;

const { ansageMessungStarten } = await import("../src/lib/typing/ansageMessung");

/** Die Uhr, an der das Messgerät hängt - jeder Schritt von Hand gestellt. */
let jetzt = 0;
let beenden: () => void = () => {};

beforeEach(() => {
  vi.useFakeTimers();
  jetzt = 10_000;
  vi.spyOn(performance, "now").mockImplementation(() => jetzt);
  beenden = ansageMessungStarten();
  // ⚠️ Das Messgerät hält seinen Bestand MODULWEIT - der letzte Anschlag des
  // vorigen Tests überlebte sonst und gäbe dem ersten Anschlag des nächsten
  // einen erfundenen Abstand. Über den echten Knopf zurücksetzen, nicht über
  // eine zweite Wahrheit im Test.
  zuruecksetzen();
});

/** Der Knopf „Messung zurücksetzen" der Anzeige. */
function zuruecksetzen(): void {
  const knopf = Array.from(document.querySelectorAll("button")).find(
    (b) => b.textContent === "Messung zurücksetzen",
  );
  knopf?.click();
}

afterEach(() => {
  beenden();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

/** Ein Anschlag des Kindes. */
function anschlag(taste: string, beiMs: number): void {
  jetzt = beiMs;
  document.dispatchEvent(new KeyboardEvent("keydown", { key: taste, bubbles: true }));
}

/** Eine Ansage absetzen (die Kette ruft `speak`). */
function absetzen(text: string, beiMs: number): FakeUtterance {
  jetzt = beiMs;
  const u = new FakeUtterance(text);
  window.speechSynthesis.speak(u as unknown as SpeechSynthesisUtterance);
  return u;
}

function bericht(): string {
  const feld = document.querySelector<HTMLTextAreaElement>(
    'textarea[aria-label="Bericht der Ansage-Messung"]',
  );
  return feld?.value ?? "";
}

describe("Messgerät - Tipprhythmus und Sprechdauer", () => {
  it("misst den Abstand zweier Anschläge, nicht den zum Sprechbeginn", () => {
    anschlag("a", 10_000);
    absetzen("a", 10_050);
    anschlag("b", 10_900); // 900 ms nach dem vorigen Anschlag
    absetzen("b", 10_950);

    // Der erste Anschlag hat keinen Vorgänger - er trägt KEINE erfundene Null
    // in den Mittelwert. Der zweite trägt die gemessenen 900 ms.
    expect(bericht()).toContain("Tipprhythmus: 900 ms");
  });

  it("misst die Sprechdauer vom Beginn bis zum Ende", () => {
    anschlag("a", 10_000);
    const u = absetzen("a", 10_050);
    jetzt = 10_100;
    u.feuere("start");
    jetzt = 10_500;
    u.feuere("end"); // 400 ms gesprochen

    expect(bericht()).toContain("Sprechdauer (nur gesprochene): 400 ms (1)");
  });
});

describe("Messgerät - die Fluss-Zeile", () => {
  /** Eine Ansage, die ausreden darf. */
  function ganzeAnsage(taste: string, tasteBei: number, dauerMs: number): void {
    anschlag(taste, tasteBei);
    const u = absetzen(taste, tasteBei + 50);
    jetzt = tasteBei + 100;
    u.feuere("start");
    jetzt = tasteBei + 100 + dauerMs;
    u.feuere("end");
  }

  it("sagt NEIN, wenn die Ansage länger dauert als der Tipprhythmus", () => {
    // Alle 300 ms ein Anschlag, jede Ansage braucht 400 ms.
    ganzeAnsage("a", 10_000, 400);
    ganzeAnsage("b", 10_300, 400);
    ganzeAnsage("c", 10_600, 400);

    const b = bericht();
    expect(b).toContain("Tipprhythmus: 300 ms");
    // 400 ms Sprechen + 90 ms Atempause = 490 ms gegen 300 ms Rhythmus.
    expect(b).toContain("NEIN - die Ansage braucht 490 ms, der Anschlag kommt nach 300 ms");
  });

  it("sagt ja, wenn die Ansage vor dem nächsten Anschlag fertig ist", () => {
    // Alle 900 ms ein Anschlag, jede Ansage braucht 400 ms.
    ganzeAnsage("a", 10_000, 400);
    ganzeAnsage("b", 10_900, 400);
    ganzeAnsage("c", 11_800, 400);

    expect(bericht()).toContain("ja - die Ansage ist 410 ms vor dem nächsten Anschlag fertig");
  });

  it("urteilt nicht, solange keine Ansage ausgeredet hat", () => {
    anschlag("a", 10_000);
    const u = absetzen("a", 10_050);
    jetzt = 10_100;
    u.feuere("start"); // sie spricht noch - kein Ende, keine Dauer

    expect(bericht()).toContain("noch nicht entschieden");
  });
});

describe("★★★★★ Eine abgeschnittene Ansage misst den Schnitt, nicht den Text", () => {
  it("zählt sie NICHT zur Sprechdauer", () => {
    // Erste Ansage: sie darf ausreden und braucht 400 ms.
    anschlag("a", 10_000);
    const eins = absetzen("a", 10_050);
    jetzt = 10_100;
    eins.feuere("start");
    jetzt = 10_500;
    eins.feuere("end");

    // Zweite Ansage: nach 40 ms schneidet der nächste Anschlag sie ab.
    anschlag("b", 10_900);
    const zwei = absetzen("b", 10_950);
    jetzt = 11_000;
    zwei.feuere("start");
    jetzt = 11_040;
    window.speechSynthesis.cancel(); // der Schnitt
    zwei.feuere("error"); // WebKit meldet den Abbruch als „error", nicht als „end"
    jetzt = 11_040;

    const b = bericht();
    // Zählte der Schnitt mit, stünde hier die Mitte aus 400 und 40 - und die
    // Ansage sähe umso kürzer aus, je schneller getippt wurde.
    expect(b).toContain("Sprechdauer (nur gesprochene): 400 ms (1)");
    expect(b).not.toContain("Sprechdauer (nur gesprochene): 40 ms");
  });

  it("hält den Schnitt trotzdem in der Zeile fest - er ist der Befund", () => {
    anschlag("a", 10_000);
    const u = absetzen("a", 10_050);
    jetzt = 10_100;
    u.feuere("start");
    jetzt = 10_140;
    window.speechSynthesis.cancel();
    u.feuere("error");

    // Die Dauer steht da, mit dem „x" der abgeschnittenen Zeile: 40 ms
    // gesprochen von einer Ansage, die länger gedauert hätte.
    expect(bericht()).toMatch(/40 msx/);
  });
});

/**
 * ★★★★★ DEN FEHLER, DEN DIESE TESTS NICHT GEFUNDEN HABEN, FESTNAGELN.
 *
 * Die erste Fassung war grün und trotzdem falsch. Der Probelauf am Live-Stand
 * (04.09.2026) zeigte im Bericht:
 *
 *   Sprechdauer (nur gesprochene): 957 ms (5)
 *   … Dauer 0 ms · 5 ms · 957 ms · 1049 ms · 2136 ms
 *
 * Zwei der fünf hatten NIE GESPROCHEN: `start` und `end` feuerten im selben
 * Augenblick. Meine Prüfung fragte nur „kam ein `cancel()` dazwischen?" - und
 * das kam nicht, die Engine hatte die Ansage schlicht fallen gelassen. Genau
 * die Erscheinung, um die es seit der Nacht geht, von der anderen Seite.
 *
 * ⚠️ Die Folge wäre die schlimmste Sorte Messfehler gewesen: Je mehr die Engine
 * verschluckt, desto KÜRZER sähe die Sprechdauer aus - die Zahl würde umso
 * besser, je schlechter die Lage ist ([[feedback_gruener_waechter_beweist_was]]).
 *
 * ⚠️ Und warum die Tests es nicht sahen: Sie liessen jede Ansage entweder
 * ausreden oder abschneiden. Der dritte Fall - enden ohne zu sprechen - kam in
 * ihnen nicht vor. **Ein Test findet nur die Fälle, die er kennt**; gefunden
 * hat es der Probelauf im Browser, wie schon am 01.09.
 */
describe("★★★★★ Eine Ansage kann enden, ohne gesprochen zu haben", () => {
  it("zählt eine stumm beendete Ansage NICHT zur Sprechdauer", () => {
    // Eine echte Ansage: 400 ms.
    anschlag("a", 10_000);
    const echt = absetzen("a", 10_050);
    jetzt = 10_100;
    echt.feuere("start");
    jetzt = 10_500;
    echt.feuere("end");

    // Eine verschluckte: start und end im selben Augenblick, ohne cancel.
    anschlag("b", 10_900);
    const stumm = absetzen("b", 10_950);
    jetzt = 11_000;
    stumm.feuere("start");
    stumm.feuere("end"); // 0 ms - sie hat nie gesprochen

    const b = bericht();
    expect(b).toContain("Sprechdauer (nur gesprochene): 400 ms (1)");
    // Nicht zwei - und schon gar nicht die Mitte aus 400 und 0.
    expect(b).not.toContain("Sprechdauer (nur gesprochene): 400 ms (2)");
    expect(b).not.toContain("Sprechdauer (nur gesprochene): 200 ms");
    expect(b).not.toContain("Sprechdauer (nur gesprochene): 0 ms");
  });

  it("verschweigt sie aber nicht - sie ist selbst der Befund", () => {
    anschlag("a", 10_000);
    const u = absetzen("a", 10_050);
    jetzt = 10_100;
    u.feuere("start");
    u.feuere("end");

    expect(bericht()).toContain("STUMM BEENDET (unter 80 ms, nie gesprochen): 1");
  });

  it("lässt eine kurze, aber echte Ansage zählen", () => {
    // 120 ms - über der Grenze, also gesprochen. Die Schwelle darf nicht so
    // hoch liegen, dass sie schnelle Ansagen wegwirft.
    anschlag("a", 10_000);
    const u = absetzen("a", 10_050);
    jetzt = 10_100;
    u.feuere("start");
    jetzt = 10_220;
    u.feuere("end");

    const b = bericht();
    expect(b).toContain("Sprechdauer (nur gesprochene): 120 ms (1)");
    expect(b).not.toContain("STUMM BEENDET");
  });
});

describe("Der Bericht schreibt die Einstellung selbst mit", () => {
  it("nennt Vorlese-Umfang und Tempo, statt sie von Hand zu verlangen", () => {
    const b = bericht();
    expect(b).toContain("Vorlesen:");
    expect(b).toContain("Umfang:");
    expect(b).toContain("Tempo:");
    // Der Satz, der die Auskunft von Hand verlangte, ist weg - genau daran ist
    // die Frage „was war eingestellt?" am 04.09. gescheitert.
    expect(b).not.toContain("Vorlese-Umfang und VoiceOver bitte von Hand");
  });

  it("lässt VoiceOver ausdrücklich offen - es ist nicht abfragbar", () => {
    expect(bericht()).toContain("VoiceOver bitte von Hand ergaenzen");
  });
});
