/**
 * ★★★★★ „NÄCHSTE TASTE ANSAGEN" - die Ansage sagt, was KOMMT.
 *
 * ── WORAUS DAS ENTSTANDEN IST ─────────────────────────────────────────────
 *
 * Johannes am 03.09.2026 abends, am iPad mit Bluetooth-Tastatur und VoiceOver:
 *
 *   „er sagt beim Tastenecho immer, was gedrückt wurde. Das ist ja nicht das,
 *    was man hören will - man will ja die nächste Taste hören."
 *
 * Die erste Fassung dieses Schalters (Vormittag desselben Tages) sagte an, was
 * GEDRÜCKT wurde, und wiederholte damit genau das, was der Screenreader
 * ohnehin sagt. Ein Kind, das blind schreiben lernt, weiss selbst, was es
 * gedrückt hat - es braucht die Anweisung, nicht die Quittung.
 *
 * ── WAS DIESE TESTS FESTHALTEN ────────────────────────────────────────────
 *
 * Vor allem die drei Stellen, an denen sich „nächste" von „gedrückte"
 * unterscheidet und an denen ein Flüchtigkeitsfehler unsichtbar bliebe:
 *
 *  1. Nach einem Anschlag kommt das FOLGENDE Zeichen, nicht das getippte.
 *  2. Die Leertaste ist dabei mit erledigt - sie braucht keine Sonderregel
 *     mehr, weil nach ihr ohnehin die nächste Taste angesagt wird. Und wenn
 *     SIE die nächste ist, heisst sie „Leertaste" und nicht „ ".
 *  3. Am ZEILENENDE gibt es kein nächstes Zeichen. Dort darf keine Ansage
 *     ins Leere gehen.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { TypingSession } from "@/components/typing/TypingSession";
import {
  useTypingA11y,
  tastenAnsageAus,
  TASTEN_ANSAGE_KEY,
  type TastenAnsage,
} from "@/lib/typing/a11y";

/**
 * Eine Zeile mit allem, worauf es ankommt: Buchstabe, Leertaste, Umlaut - und
 * sie endet auf einem Zeichen, damit der Zeilenende-Fall prüfbar ist.
 */
const ZEILE = "fa fä";

/**
 * ⚠️ NACH DEM AUFBAU ERST ABKLINGEN LASSEN.
 *
 * Seit dem 03.09.2026 abends sagt die App 700 ms nach dem Zeilenanfang das
 * ERSTE Zeichen an (Johannes: „sie spricht das erste Zeichen einer Zeile
 * nicht"). Diese Ansage fiel den Tests mitten ins Messfenster: `pushLive`
 * leert den Bereich zuerst, und wer genau dann nachsah, las eine Stille, die
 * keine war. Wer misst, wartet sie ab - so wie ein Kind sie auch hört, bevor
 * es den ersten Anschlag macht.
 */
async function abklingen(): Promise<void> {
  await act(async () => {
    await new Promise((f) => setTimeout(f, 900));
  });
}

function aufbauen(stufe: TastenAnsage, zeile: string = ZEILE) {
  act(() => useTypingA11y.getState().setTastenAnsage(stufe));
  const ergebnis = render(
    <TypingSession
      items={[zeile]}
      contextId="test-ansage"
      unlocked={new Set(["f", "a", "ä", " ", "h", "u", "s", "d"])}
      shiftLearned={false}
      stufe={1 as never}
      voiceEnabled={false}
      onRetry={() => {}}
    />,
  );
  const feld = ergebnis.container.querySelector<HTMLInputElement>('[data-feld="tippen"]');
  const live = ergebnis.container.querySelector('[role="status"][aria-live="assertive"]');
  if (!feld || !live) throw new Error("Übungsfeld oder Live-Bereich nicht gefunden");
  return { feld, live };
}

/**
 * ★★★★ EINE PRÜFMARKE JE ANSCHLAG - dieselbe Lehre wie beim VoiceOver-Läufer.
 *
 * „Nichts angesagt" ist NICHT dasselbe wie „der Live-Bereich ist leer": Dort
 * steht noch die Meldung vom Anschlag davor, denn niemand räumt sie weg. Ein
 * früherer Entwurf prüfte auf `""` und war rot, obwohl der Code stimmte.
 *
 * ⚠️ `pushLive` leert erst und füllt 50 ms später - sonst spräche NVDA zwei
 * gleiche Meldungen hintereinander nicht erneut. Darum wird gewartet.
 */
const MARKE = "pruefmarke";

async function anschlag(feld: HTMLInputElement, live: Element, taste: string): Promise<string> {
  live.textContent = MARKE;
  await act(async () => {
    fireEvent.keyDown(feld, { key: taste });
    await new Promise((f) => setTimeout(f, 120));
  });
  const jetzt = live.textContent ?? "";
  // ⚠️ GETRIMMT. Seit dem 03.09.2026 abends haengt an jeder zweiten Ansage ein
  // Leerzeichen, damit VoiceOver zwei gleiche Ansagen hintereinander nicht
  // verschluckt (siehe `pushLive`). Fuer den Wortlaut ist es bedeutungslos -
  // der eine Test, dem der Unterschied WICHTIG ist, vergleicht darum roh.
  return jetzt === MARKE ? "" : jetzt.trim();
}

beforeEach(() => {
  try {
    localStorage.removeItem(TASTEN_ANSAGE_KEY);
  } catch {
    /* egal */
  }
});
afterEach(cleanup);

describe("Stufe „aus“ - der Screenreader macht es allein", () => {
  it("schweigt bei einem ECHTEN Wort", async () => {
    // „haus" steht im Wörterbuch: Ein Kind hört das Wort einmal und tippt es
    // aus dem Kopf - vier Ansagen wären Geplapper.
    const { feld, live } = aufbauen("aus", "haus");
    await abklingen();
    expect(await anschlag(feld, live, "h")).toBe("");
    expect(await anschlag(feld, live, "a")).toBe("");
    expect(await anschlag(feld, live, "u")).toBe("");
  });

  /*
   * ★★★★★ SEIT 09.09.2026 SCHWEIGT „AUS" AUCH BEI ÜBUNGSSILBEN - UND BEI
   * FEHLERN, UND AM ZEILENENDE.
   *
   * Bis dahin stand hier der Gegentest „sagt bei einer ÜBUNGSSILBE trotzdem
   * jede Taste an" (Johannes 03.09.: „bei Wörtern, die keine sind, muss auch
   * bei ‚aus' jede Taste angesagt werden"). Die Kinder mit Braillezeile haben
   * damit gearbeitet - und jede dieser Ansagen verdrängte die Übungszeile als
   * Blitzmeldung: „bei NVDA kommt nur der eine Buchstabe ganz links, es
   * springt also ständig." Johannes: „die Anzeige darf nie auf 1 Zeichen oder
   * auf die Ausgabe ‚Leertaste' springen … auch bei Tippfehler darf sich die
   * Anzeige nicht ändern, es gibt ja einen Ton."
   *
   * Diese drei Tests sind die Gegenprobe zur ersten: „aus" ist erst dann
   * richtig, wenn WÄHREND DES TIPPENS gar nichts mehr in den Live-Bereich
   * geht. Wer eine Ansage will, schaltet „Buchstabieren" an (Tests unten).
   */
  it("★★★ schweigt auch bei einer ÜBUNGSSILBE - die Braillezeile trägt die nächste Taste", async () => {
    const { feld, live } = aufbauen("aus", "fa fä");
    await abklingen();
    expect(await anschlag(feld, live, "f")).toBe("");
    expect(await anschlag(feld, live, "a")).toBe("");
    // Vor der Leertaste hiess es bisher „Leertaste" - genau das Wort, das auf
    // der Zeile die Übungszeile verdrängte.
    expect(await anschlag(feld, live, " ")).toBe("");
  });

  it("★★★ schweigt bei einem FALSCHEN Anschlag - der Cursor bleibt, der Ton sagt es", async () => {
    const { feld, live } = aufbauen("aus", "fa fä");
    await abklingen();
    expect(await anschlag(feld, live, "q")).toBe("");
    // Der Schreibzeiger ist nicht weitergerückt.
    expect(feld.selectionStart).toBe(0);
    // Und der richtige Anschlag danach bleibt genauso still.
    expect(await anschlag(feld, live, "f")).toBe("");
    expect(feld.selectionStart).toBe(1);
  });

  it('★★ meldet auch am ZEILENENDE kein „Geschafft." in den Live-Bereich', async () => {
    const { feld, live } = aufbauen("aus", "fa");
    await abklingen();
    await anschlag(feld, live, "f");
    expect(await anschlag(feld, live, "a")).toBe("");
  });

  it("schreibt am Zeilenanfang keine erste Taste in den Live-Bereich", async () => {
    const { live } = aufbauen("aus", "fa fä");
    live.textContent = MARKE;
    await abklingen();
    expect(live.textContent).toBe(MARKE);
  });
});

describe("Stufe „an“ - nach jedem Anschlag die nächste Taste", () => {
  it("★ sagt das FOLGENDE Zeichen an, nicht das getippte", async () => {
    const { feld, live } = aufbauen("naechste");
    await abklingen();
    // Zeile „fa fä": nach dem „f" kommt „a".
    expect(await anschlag(feld, live, "f")).toBe("a");
    // ⚠️ Der Test, der „gedrückte Taste" auffliegen liesse: Hier wurde „a"
    //    getippt, angesagt werden muss aber die Leertaste.
    expect(await anschlag(feld, live, "a")).toBe("Leertaste");
  });

  it("die Leertaste braucht keine Sonderregel mehr - nach ihr kommt das Nächste", async () => {
    const { feld, live } = aufbauen("naechste");
    await abklingen();
    for (const t of ["f", "a"]) await anschlag(feld, live, t);
    // Getippt wird die Leertaste; angesagt wird, was danach kommt.
    expect(await anschlag(feld, live, " ")).toBe("f");
  });

  it("sagt den Umlaut mit seinem Sprech-Namen an", async () => {
    const { feld, live } = aufbauen("naechste");
    await abklingen();
    for (const t of ["f", "a", " "]) await anschlag(feld, live, t);
    // Nach dem „f" kommt „ä" - gesprochen „a Umlaut", weil der nackte
    // Buchstabenname fast wie „e" klingt.
    expect(await anschlag(feld, live, "f")).toBe("a Umlaut");
  });

  it("★ geht am ZEILENENDE nicht ins Leere", async () => {
    const { feld, live } = aufbauen("naechste");
    await abklingen();
    for (const t of ["f", "a", " ", "f"]) await anschlag(feld, live, t);
    // Der letzte Anschlag schliesst die Zeile ab: „Geschafft." aus
    // handleComplete - aber KEINE nächste Taste, die es nicht gibt.
    const letzte = await anschlag(feld, live, "ä");
    expect(letzte).toContain("Geschafft");
  });
});

describe("Zwei Befunde vom iPad (03.09.2026 abends)", () => {
  it("★ sagt DIESELBE Taste auch zweimal hintereinander an", async () => {
    // Johannes: „VoiceOver spricht bei gleichen Buchstaben immer nur den
    // ersten - bei jjj spricht sie nur beim ersten j." Der Live-Bereich wurde
    // zwar geleert und neu gefüllt, stand danach aber wortgleich da; VoiceOver
    // vergleicht das ERGEBNIS. Jetzt wechselt ein nachgestelltes Leerzeichen,
    // damit der Textknoten sich garantiert unterscheidet.
    const zeile = "jjj";
    act(() => useTypingA11y.getState().setTastenAnsage("naechste"));
    const e = render(
      <TypingSession
        items={[zeile]}
        contextId="test-wiederholung"
        unlocked={new Set(["j"])}
        shiftLearned={false}
        stufe={1 as never}
        voiceEnabled={false}
        onRetry={() => {}}
      />,
    );
    const feld = e.container.querySelector<HTMLInputElement>('[data-feld="tippen"]')!;
    const live = e.container.querySelector('[role="status"][aria-live="assertive"]')!;
    const gesehen: string[] = [];
    for (let i = 0; i < 2; i++) {
      await act(async () => {
        fireEvent.keyDown(feld, { key: "j" });
        await new Promise((f) => setTimeout(f, 120));
      });
      gesehen.push(live.textContent ?? "");
    }
    // Beide Male steht „j" da - aber NICHT wortgleich, sonst bliebe die
    // zweite Ansage stumm.
    expect(gesehen.map((t) => t.trim())).toEqual(["j", "j"]);
    expect(gesehen[0]).not.toBe(gesehen[1]);
  });
});

describe("Ein FALSCHER Anschlag bleibt, was er war", () => {
  it("meldet weiterhin die richtige Taste", async () => {
    const { feld, live } = aufbauen("naechste");
    await abklingen();
    // Erwartet ist „f", getippt wird „q".
    expect(await anschlag(feld, live, "q")).toBe("Falsch. Richtig ist: f.");
  });
});

describe("Die gespeicherte Wahl", () => {
  it("merkt sich die Stufe", () => {
    act(() => useTypingA11y.getState().setTastenAnsage("naechste"));
    expect(localStorage.getItem(TASTEN_ANSAGE_KEY)).toBe("naechste");
    act(() => useTypingA11y.getState().setTastenAnsage("aus"));
    expect(localStorage.getItem(TASTEN_ANSAGE_KEY)).toBe("aus");
  });

  it("★ nimmt einem Bestandsgerät die Ansage nicht weg", () => {
    // Am Vormittag des 03.09. hiessen die Stufen „sonderzeichen" und „jede"
    // und sagten an, was GEDRÜCKT wurde. Wer eine davon gewählt hatte, WOLLTE
    // eine Ansage - ein stiller Rückfall auf „aus" nähme sie ausgerechnet dem
    // Kind, das sie eingeschaltet hatte.
    expect(tastenAnsageAus("sonderzeichen")).toBe("naechste");
    expect(tastenAnsageAus("jede")).toBe("naechste");
  });

  it("lässt eine ausdrückliche Wahl in Ruhe", () => {
    expect(tastenAnsageAus("aus")).toBe("aus");
    expect(tastenAnsageAus("naechste")).toBe("naechste");
  });

  it("ohne gespeicherte Wahl gilt die Vorgabe des Systems", () => {
    // ⚠️ Die Gegenprobe zum Test darüber: „nichts gespeichert" ist etwas
    // anderes als ein Alt-Wert. Welche Vorgabe herauskommt, hängt am System -
    // geprüft wird deshalb nur, dass es überhaupt eine gültige ist.
    expect(["aus", "naechste"]).toContain(tastenAnsageAus(null));
    expect(["aus", "naechste"]).toContain(tastenAnsageAus("unfug"));
  });
});
