/**
 * WÄCHTER über die Rechenregeln der Schreibprobe (09.09.2026).
 *
 * ★★★ Was ein Wächter hier beweisen muss - und was er nicht beweist.
 * Diese Prüfung fasst kein Bild an. Sie prüft die vier Stellen, an denen eine
 * Prüfung kippen kann, wenn sich jemand vertut:
 *
 *  1. **Die Phasen.** Wer zu spät kommt, ist zu spät; wer abgegeben hat, ist
 *     fertig; wer begonnen hat, ist drin - und keine dieser Antworten darf sich
 *     ändern, weil eine Uhr weitergelaufen ist.
 *  2. **Die Uhr samt Zeitzuschlag.** Sie läuft seit 15.09.2026 für jedes Kind
 *     gleich lang - die abgezogene Vorlesezeit steckt seither in der Wertung
 *     (§6), nicht mehr in der Uhr. Hier steckt die einzige Zahl, die einem
 *     Kind wirklich schaden kann.
 *  3. **Die Text-Rotation.** Zwei Schreibproben derselben Klasse dürfen nie
 *     denselben Text bekommen, solange es noch einen freien gibt.
 *  4. **Das wehrhafte Lesen.** Ein kaputter Wert vom Server darf keinem Kind
 *     eine Prüfung vor die Nase setzen.
 *
 * Jede Gegenprobe ist dabei so gebaut, dass sie ROT würde, wenn die Sache
 * schlechter wäre - eine Prüfung, die auch bei kaputtem Code grün bliebe,
 * beweist nichts ([[feedback_gruener_waechter_beweist_was]]).
 */
import { describe, it, expect } from "vitest";
import {
  DAUER_MIN_GROESST,
  EINSTIEGSFENSTER_MIN,
  LEERER_STAND,
  PROBEN_JE_NIVEAU,
  PROBEN_NIVEAUS,
  UHR_SPIELRAUM_MS,
  dauerMsFuer,
  einstiegBisMs,
  einstiegRestMs,
  klasseVorbeiMs,
  mmss,
  naechsterText,
  phaseVon,
  planAusEinstellungen,
  restGesprochen,
  restMs,
  verbrauchtAusEinstellungen,
  zeichenVorrat,
  niveauDef,
  anfangAb,
  baueFolge,
  endetMitSatz,
  naechsterStart,
  normiereStelle,
  satzweise,
  stelleBezeichnung,
  zeigerAusEinstellungen,
  VORRAT_ANSCHLAEGE_JE_MIN,
  type KindStand,
  type ProbenEnde,
  type SchreibprobePlan,
  type TextZeilen,
} from "@/lib/typing/schreibprobe";
import { ladeTexte } from "@/lib/typing/schreibproben";
import {
  anschlaegeProMinute,
  genauigkeitVon,
  tastenAuflistung,
  wackligeTasten,
  werteAus,
  ergebnisAusJson,
  fuersSpeichern,
  TASTEN_KAPPE,
  FEHLERSTELLEN_KAPPE,
  GETIPPT_ZEILEN_KAPPE,
  GETIPPT_ZEILE_ZEICHEN_KAPPE,
} from "@/lib/typing/schreibprobeAuswertung";
import { SHIFT_UNIT } from "@/lib/typing/letters";

const START = new Date(2026, 8, 10, 9, 0, 0).getTime();

function plan(over: Partial<SchreibprobePlan> = {}): SchreibprobePlan {
  return {
    id: "sp-test",
    niveau: "satz",
    startMs: START,
    dauerMin: 10,
    textNr: 0,
    startZeile: 0,
    zuschlagProzent: 50,
    angelegtMs: START - 60_000,
    ...over,
  };
}

function stand(over: Partial<KindStand> = {}): KindStand {
  return { ...LEERER_STAND, ...over };
}

// ── 1 · Die Phasen ──────────────────────────────────────────────────────────

describe("Phasen der Schreibprobe", () => {
  it("ohne Plan gibt es keine Schreibprobe", () => {
    expect(phaseVon(null, stand(), START)).toBe("keine");
  });

  it("★★ gestartet wird nur sofort: eine nachgehende Geräte-Uhr wartet nicht (10.09.2026)", () => {
    // Johannes: nur „Jetzt starten". Ein Start knapp in der Zukunft ist also
    // eine Schuluhr, die nachgeht - das Kind darf trotzdem sofort beginnen.
    expect(phaseVon(plan(), stand(), START - 1)).toBe("offen");
    expect(phaseVon(plan(), stand(), START - UHR_SPIELRAUM_MS)).toBe("offen");
    // … und die Anzeige „Zum Beginnen hast du noch" wird nie länger als das Fenster.
    expect(einstiegRestMs(plan(), START - 2 * 60_000)).toBe(EINSTIEGSFENSTER_MIN * 60_000);
  });

  it("★ ein Termin WEIT in der Zukunft (älterer Datensatz) setzt dem Kind nichts vor", () => {
    // Gegenprobe zur Zeile darüber: Ohne die Grenze stünde ein Startbildschirm
    // stundenlang da, bevor irgendjemand beginnen soll.
    expect(phaseVon(plan(), stand(), START - UHR_SPIELRAUM_MS - 1)).toBe("keine");
    expect(phaseVon(plan(), stand(), START - 24 * 3600_000)).toBe("keine");
  });

  it("im Einstiegsfenster ist sie offen - an beiden Rändern", () => {
    expect(phaseVon(plan(), stand(), START)).toBe("offen");
    expect(phaseVon(plan(), stand(), einstiegBisMs(plan()))).toBe("offen");
  });

  it("eine Millisekunde nach dem Fenster ist sie verpasst", () => {
    expect(phaseVon(plan(), stand(), einstiegBisMs(plan()) + 1)).toBe("verpasst");
  });

  it("wer begonnen hat, bleibt drin - auch weit nach dem Einstiegsfenster", () => {
    // ★ Der Fall, um den es wirklich geht: Ein Kind beginnt in der letzten
    // Sekunde des Fensters. Seine Prüfungszeit läuft danach noch zehn Minuten
    // weiter. Würde die Phase am Fenster hängen, verlöre es mitten im
    // Schreiben seinen Bildschirm.
    const s = stand({ beginnMs: einstiegBisMs(plan()) });
    expect(phaseVon(plan(), s, einstiegBisMs(plan()) + 9 * 60_000)).toBe("laeuft");
  });

  it("wer abgegeben hat, ist fertig - und bleibt es", () => {
    const s = stand({ beginnMs: START, abgegeben: true });
    expect(phaseVon(plan(), s, START)).toBe("abgegeben");
    expect(phaseVon(plan(), s, START + 99 * 60_000)).toBe("abgegeben");
  });

  it("wer sich abgemeldet hat, sieht gar keine Schreibprobe mehr", () => {
    expect(phaseVon(plan(), stand({ abgemeldet: true }), START)).toBe("keine");
  });

  it("„abgegeben“ schlägt „abgemeldet“", () => {
    // Sonst könnte ein Kind nach der Abgabe auf „ich schreibe nicht mit"
    // drücken und sein Ergebnis aus der eigenen Ansicht verschwinden lassen.
    const s = stand({ beginnMs: START, abgegeben: true, abgemeldet: true });
    expect(phaseVon(plan(), s, START)).toBe("abgegeben");
  });
});

// ── 2 · Die Uhr ─────────────────────────────────────────────────────────────

describe("Prüfungszeit, Zeitzuschlag und Vorlesezeit", () => {
  it("ohne Zuschlag ist die Zeit genau die eingestellte", () => {
    expect(dauerMsFuer(plan(), stand())).toBe(10 * 60_000);
  });

  it("mit Zuschlag bekommt das Kind die Prozente dazu", () => {
    expect(dauerMsFuer(plan(), stand({ zuschlag: true }))).toBe(15 * 60_000);
  });

  it("der Zuschlag greift NUR bei Kindern, die ihn haben", () => {
    // Gegenprobe zur Zeile darüber: Wäre der Zuschlag pauschal, wäre dieser
    // Test rot - und die halbe Klasse bekäme Zeit, die ihr nicht zusteht.
    expect(dauerMsFuer(plan(), stand({ zuschlag: false }))).toBe(10 * 60_000);
  });

  it("ein Zuschlag von 0 % ändert nichts", () => {
    expect(dauerMsFuer(plan({ zuschlagProzent: 0 }), stand({ zuschlag: true }))).toBe(
      10 * 60_000,
    );
  });

  it("vor dem ersten Tastendruck steht die volle Zeit", () => {
    expect(restMs(plan(), stand(), START + 5 * 60_000)).toBe(10 * 60_000);
  });

  it("die Restzeit sinkt mit der Wanduhr", () => {
    const s = stand({ beginnMs: START });
    expect(restMs(plan(), s, START + 4 * 60_000)).toBe(6 * 60_000);
  });

  it("★★★★★ Vorlesen pausiert die Uhr NICHT mehr (15.09.2026) - Klassenmatch-Prinzip", () => {
    // Johannes: „die tippchallenge soll auch exakt die zeit tippen, die der
    // lehrer vorgibt, und das so werten wie beim klassenmatch". Bis 14.09.
    // zog `restMs` die gemessene Vorlesezeit ab und verlängerte die Prüfung
    // dadurch real - `restMs` kennt seither gar kein `wartezeitMs` mehr.
    // Vier Minuten Wanduhr sind vier Minuten, ganz gleich wie viel davon
    // Vorlesen war; der Ausgleich steckt jetzt allein in `schreibMs`
    // (siehe „Das Rechenwerk der Auswertung" unten).
    const s = stand({ beginnMs: START });
    expect(restMs(plan(), s, START + 4 * 60_000)).toBe(6 * 60_000);
  });

  it("die Restzeit wird nie negativ", () => {
    const s = stand({ beginnMs: START });
    expect(restMs(plan(), s, START + 60 * 60_000)).toBe(0);
  });

  it("das Klassen-Ende rechnet mit dem GRÖSSTEN möglichen Zuschlag", () => {
    // Sonst ginge die Sammel-Mail an die Lehrkraft ab, während das Kind mit
    // Zeitzuschlag noch schreibt - und sein Ergebnis fehlte darin.
    expect(klasseVorbeiMs(plan())).toBe(
      START + EINSTIEGSFENSTER_MIN * 60_000 + 15 * 60_000,
    );
  });
});

describe("Zeit-Anzeige", () => {
  it("mmss zählt Minuten und Sekunden", () => {
    expect(mmss(0)).toBe("0:00");
    expect(mmss(64_000)).toBe("1:04");
    expect(mmss(600_000)).toBe("10:00");
    expect(mmss(-5000)).toBe("0:00");
  });

  it("die ANSAGE ist bewusst grob", () => {
    // Feine Ansagen wären auf der Braillezeile eine Blitzmeldung im Sekundentakt
    // ([[reference_live_region_ist_braille_blitzmeldung]]).
    expect(restGesprochen(300_000)).toBe("Noch 5 Minuten.");
    expect(restGesprochen(40_000)).toBe("Noch 40 Sekunden.");
    expect(restGesprochen(0)).toBe("Die Zeit ist um.");
    expect(restGesprochen(300_000)).not.toMatch(/Sekunde/);
  });
});

// ── 3 · Die Text-Rotation ───────────────────────────────────────────────────

describe("welcher Prüfungstext als nächster kommt", () => {
  it("beginnt bei 0", () => {
    expect(naechsterText("satz", {})).toBe(0);
  });

  it("überspringt, was schon dran war", () => {
    expect(naechsterText("satz", { satz: [0, 1, 2] })).toBe(3);
  });

  it("★ nimmt die kleinste FREIE Nummer, nicht die nächste nach der letzten", () => {
    // Der Fall, den eine „letzte + 1"-Regel falsch macht: Eine abgesagte Probe
    // hat 3 verbraucht, 1 und 2 sind noch frei.
    expect(naechsterText("satz", { satz: [0, 3] })).toBe(1);
  });

  it("Niveaus zählen getrennt", () => {
    expect(naechsterText("zahlen", { satz: [0, 1, 2, 3] })).toBe(0);
  });

  it("nach dem 15. Text beginnt der Zyklus von vorn", () => {
    const voll = Array.from({ length: PROBEN_JE_NIVEAU }, (_, i) => i);
    expect(naechsterText("satz", { satz: voll })).toBe(0);
  });
});

// ── 3b · Texte sparen: wo die nächste Challenge beginnt (10.09.2026) ────────

/** 15 kleine Texte zu je `n` Zeilen: „t3 z7" ist Zeile 8 von Text 4. */
function kleineTexte(n = 50): TextZeilen[] {
  return Array.from({ length: PROBEN_JE_NIVEAU }, (_, nr) => ({
    nr,
    zeilen: Array.from({ length: n }, (_, z) => `t${nr} z${z}`),
  }));
}

/**
 * Texte mit Sätzen. Text 1 hat Satzanfänge in den Zeilen 0, 2, 5 und 6; die
 * übrigen Texte beginnen mit einem Satz und enden mit einem.
 */
function satzTexte(): TextZeilen[] {
  const t0 = [
    "Ein Satz beginnt",
    "und endet hier.",
    "Der zweite Satz",
    "geht weiter und",
    "endet jetzt!",
    "Eine Frage?",
    "Und noch ein Rest",
  ];
  return Array.from({ length: PROBEN_JE_NIVEAU }, (_, nr) => ({
    nr,
    zeilen: nr === 0 ? t0 : ["Anfang eines Textes", "mit einem Ende."],
  }));
}

function zeiger(niveau: string, textNr: number, zeile: number, probeId = "sp-a") {
  return { schreibprobeZeiger: { [niveau]: { textNr, zeile, probeId } } };
}

function ende(textNr: number, zeile: number, probeId = "sp-a"): ProbenEnde {
  return { probeId, textNr, zeile };
}

describe("★★★ Texte sparen - wo die nächste Challenge beginnt", () => {
  it("★★★ an der Zeile NACH der, an der das weiteste Kind war", () => {
    const s = naechsterStart(
      "buchstaben",
      zeiger("buchstaben", 3, 10),
      [ende(3, 30), ende(3, 41), ende(3, 12)],
      kleineTexte(),
    );
    expect(s).toEqual({ textNr: 3, zeile: 42, herkunft: "weiter" });
    // Gegenprobe: Zählte das LANGSAMSTE Kind, begänne sie bei 13.
    expect(s.zeile).not.toBe(13);
  });

  it("★★ zählt nur die Challenge, auf die der Zeiger zeigt - nicht ältere", () => {
    const s = naechsterStart(
      "buchstaben",
      zeiger("buchstaben", 3, 10),
      [ende(3, 20), ende(9, 40, "sp-alt")],
      kleineTexte(),
    );
    expect(s).toEqual({ textNr: 3, zeile: 21, herkunft: "weiter" });
  });

  it("★★ wer schon im NÄCHSTEN Text war, ist weiter als jemand weit hinten im Starttext", () => {
    const s = naechsterStart(
      "buchstaben",
      zeiger("buchstaben", 3, 45),
      [ende(3, 49), ende(4, 2)],
      kleineTexte(),
    );
    expect(s).toEqual({ textNr: 4, zeile: 3, herkunft: "weiter" });
  });

  it("★★ bei Satztexten am nächsten SATZANFANG - bei den anderen an der nächsten Zeile", () => {
    const t = satzTexte();
    // Zeile 3 ist mitten im Satz ⇒ weiter zu Zeile 5 („Eine Frage?").
    expect(naechsterStart("satz", zeiger("satz", 0, 0), [ende(0, 2)], t)).toEqual({
      textNr: 0,
      zeile: 5,
      herkunft: "weiter",
    });
    // Nach „Eine Frage?" beginnt in Zeile 6 ein Satz.
    expect(naechsterStart("satz", zeiger("satz", 0, 0), [ende(0, 5)], t).zeile).toBe(6);
    // Gegenprobe: Ohne Satzzeichen im Niveau zählt die nächste Zeile.
    expect(naechsterStart("buchstaben", zeiger("buchstaben", 0, 0), [ende(0, 2)], t)).toEqual({
      textNr: 0,
      zeile: 3,
      herkunft: "weiter",
    });
  });

  it("★★ kommt im Rest des Textes kein Satzanfang mehr, beginnt der nächste Text", () => {
    const t = satzTexte();
    // Zeile 6 ist die letzte von Text 1 ⇒ Text 2, Zeile 1.
    expect(naechsterStart("satz", zeiger("satz", 0, 0), [ende(0, 6)], t)).toEqual({
      textNr: 1,
      zeile: 0,
      herkunft: "weiter",
    });
    expect(anfangAb(t, { textNr: 0, zeile: 3 }, true)).toEqual({ textNr: 0, zeile: 5 });
    expect(endetMitSatz("mit einem Ende.")).toBe(true);
    expect(endetMitSatz('sagte er: „Ja!“')).toBe(true);
    expect(endetMitSatz("mitten im Satz,")).toBe(false);
  });

  it("★★★ von Text 15 geht es in Text 1 weiter", () => {
    const t = kleineTexte();
    expect(naechsterStart("start", zeiger("start", 14, 40), [ende(14, 49)], t)).toEqual({
      textNr: 0,
      zeile: 0,
      herkunft: "weiter",
    });
    // Ein Kind, das schon in Text 1 schrieb, ist weiter als eines am Ende von Text 15.
    expect(
      naechsterStart("start", zeiger("start", 14, 40), [ende(14, 49), ende(0, 3)], t),
    ).toEqual({ textNr: 0, zeile: 4, herkunft: "weiter" });
    expect(normiereStelle(t, { textNr: 14, zeile: 52 })).toEqual({ textNr: 0, zeile: 2 });
  });

  it("★★★ im Lauf: EINE Zeilenliste, die nahtlos in den nächsten Text übergeht - auch von 15 auf 1", () => {
    const t = kleineTexte();
    const f = baueFolge(t, { textNr: 14, zeile: 48 }, 30);
    expect(f.zeilen.slice(0, 3)).toEqual(["t14 z48", "t14 z49", "t0 z0"]);
    expect(f.stellen.slice(0, 3)).toEqual([
      { textNr: 14, zeile: 48 },
      { textNr: 14, zeile: 49 },
      { textNr: 0, zeile: 0 },
    ]);
    // Keine Leerzeile, keine Trennzeile - das Kind merkt den Wechsel nicht.
    expect(f.zeilen.every((z) => z.trim().length > 0)).toBe(true);
    // Höchstens einmal rundherum: Die Zeilen des Starttextes VOR der Startstelle
    // kommen nicht noch einmal.
    const alles = baueFolge(t, { textNr: 5, zeile: 3 }, 1e9);
    expect(alles.zeilen.length).toBe(15 * 50 - 3);
    expect(alles.stellen.at(-1)).toEqual({ textNr: 4, zeile: 49 });
  });

  it("★ der Vorrat reicht für die längste Prüfungszeit und das schnellste Kind - an den echten Texten", async () => {
    // Die ungünstigste Stelle: die letzte Zeile eines Textes, längste Prüfungszeit.
    for (const niveau of PROBEN_NIVEAUS) {
      const texte = await ladeTexte(niveau);
      const letzte = texte[2].zeilen.length - 1;
      const noetig = DAUER_MIN_GROESST * VORRAT_ANSCHLAEGE_JE_MIN;
      const f = baueFolge(texte, { textNr: 2, zeile: letzte }, noetig);
      const zeichen = f.zeilen.reduce((s, z) => s + z.length + 1, 0);
      expect(zeichen, niveau).toBeGreaterThanOrEqual(noetig);
    }
  });

  describe("★★★ baueFolge mit EINEM Text (Tippchallenge mit eigener Datei, 17.09.2026)", () => {
    /** Eine kurze eigene Datei - genau EIN Text, Index 0. */
    function eigenerText(zeilen: string[]): TextZeilen[] {
      return [{ nr: 0, zeilen }];
    }

    it("ohne anzahlTexte/maxLaeufe bleibt das Verhalten der 15er-Bank unverändert (Vorgabewerte)", () => {
      // Genau der Fall aus dem Test oben ("im Lauf: EINE Zeilenliste …") -
      // die neuen Parameter dürfen daran nichts ändern, weil ihre Vorgaben
      // exakt das alte `PROBEN_JE_NIVEAU` reproduzieren.
      const t = kleineTexte();
      const alt = baueFolge(t, { textNr: 5, zeile: 3 }, 1e9);
      const neu = baueFolge(t, { textNr: 5, zeile: 3 }, 1e9, PROBEN_JE_NIVEAU, PROBEN_JE_NIVEAU);
      expect(neu).toEqual(alt);
      expect(alt.zeilen.length).toBe(15 * 50 - 3);
    });

    it("★★★★★ eine kurze Datei wird VIELE Male wiederholt, statt nach einem Durchlauf abzubrechen", () => {
      const t = eigenerText(["eins", "zwei", "drei"]); // 3 Zeilen, 14 Zeichen (inkl. Trenner)
      // Ohne anzahlTexte/maxLaeufe (Vorgabe PROBEN_JE_NIVEAU=15 für beides)
      // bräche die Schleife nach höchstens 15 Durchläufen ab UND würde ab
      // Durchlauf 2 nichts mehr liefern, weil `textNr` dann aus dem Array
      // heraus zeigt (nur Index 0 existiert) - genau der Fehler, den die
      // neuen Parameter beheben.
      const kaputt = baueFolge(t, { textNr: 0, zeile: 0 }, 1000);
      expect(kaputt.zeilen.length).toBe(3); // bricht nach EINEM Durchlauf ab

      // Mit anzahlTexte=1 (Modulo) und einer grosszügigen maxLaeufe-Grenze
      // wiederholt sich der eine Text so oft wie nötig.
      const richtig = baueFolge(t, { textNr: 0, zeile: 0 }, 1000, 1, 200);
      const zeichen = richtig.zeilen.reduce((s, z) => s + z.length + 1, 0);
      expect(zeichen).toBeGreaterThanOrEqual(1000);
      // Und zwar wirklich derselbe Text, wieder und wieder - keine Lücken,
      // keine erfundenen Zeilen.
      expect(richtig.zeilen.slice(0, 6)).toEqual([
        "eins", "zwei", "drei", "eins", "zwei", "drei",
      ]);
      expect(new Set(richtig.stellen.map((s) => s.textNr))).toEqual(new Set([0]));
    });

    it("beginnt mitten in der Datei und läuft trotzdem nahtlos weiter von vorne", () => {
      const t = eigenerText(["a", "b", "c"]);
      const f = baueFolge(t, { textNr: 0, zeile: 1 }, 8, 1, 10);
      // Start bei Zeile 1 ("b"): b, c, dann wieder von vorn a, b, c, …
      expect(f.zeilen.slice(0, 5)).toEqual(["b", "c", "a", "b", "c"]);
    });
  });

  it("niemand hat abgegeben ⇒ dieselbe Stelle noch einmal", () => {
    expect(naechsterStart("start", zeiger("start", 6, 17), [], kleineTexte())).toEqual({
      textNr: 6,
      zeile: 17,
      herkunft: "wiederholt",
    });
  });

  it("★★★ ohne Zeiger gilt die ALTE Verbrauchsliste: nächster freier Text, Zeile 1", () => {
    const settings = {
      schreibprobeVerbraucht: { satz: [0, 1, 2] },
      // Der Zeiger eines ANDEREN Niveaus ändert daran nichts.
      schreibprobeZeiger: { zahlen: { textNr: 9, zeile: 99, probeId: "sp-z" } },
    };
    expect(naechsterStart("satz", settings, [ende(9, 120, "sp-z")], satzTexte())).toEqual({
      textNr: 3,
      zeile: 0,
      herkunft: "neu",
    });
    expect(verbrauchtAusEinstellungen(settings).satz).toEqual([0, 1, 2]);
  });

  it("★★★ ein kaputter Zeiger fällt sicher auf die Verbrauchsliste zurück", () => {
    const kaputt: unknown[] = [
      { textNr: 15, zeile: 0, probeId: "sp" },
      { textNr: -1, zeile: 0, probeId: "sp" },
      { textNr: "3", zeile: 0, probeId: "sp" },
      { textNr: 2.5, zeile: 0, probeId: "sp" },
      { textNr: 2, zeile: -4, probeId: "sp" },
      { textNr: 2, zeile: 99_999, probeId: "sp" },
      { textNr: 2, zeile: 4, probeId: "" },
      { textNr: 2, zeile: 4 },
      null,
      "kaputt",
      [1, 2],
    ];
    for (const eintrag of kaputt) {
      const settings = {
        schreibprobeVerbraucht: { satz: [0] },
        schreibprobeZeiger: { satz: eintrag },
      };
      expect(zeigerAusEinstellungen(settings), JSON.stringify(eintrag)).toEqual({});
      expect(naechsterStart("satz", settings, [ende(2, 40, "sp")], satzTexte())).toEqual({
        textNr: 1,
        zeile: 0,
        herkunft: "neu",
      });
    }
    expect(zeigerAusEinstellungen({ schreibprobeZeiger: "kaputt" })).toEqual({});
    expect(zeigerAusEinstellungen(null)).toEqual({});
  });

  it("ohne geladene Texte bleibt nur der Textanfang - kein Absturz, keine Endlosschleife", () => {
    expect(normiereStelle([], { textNr: 3, zeile: 500 })).toEqual({ textNr: 3, zeile: 0 });
    expect(baueFolge([], { textNr: 3, zeile: 0 }, 1000).zeilen).toEqual([]);
  });

  it("★★★ 'eigen' beginnt IMMER am Dateianfang - ganz ohne Sonderfall in naechsterStart", () => {
    // Weil „eigen" absichtlich nicht in PROBEN_NIVEAUS steht (schreibprobe.ts),
    // bekommt es nie einen Zeiger und nie eine Verbrauchsliste - selbst wenn
    // die Einstellungen (fälschlich, oder von einer älteren Version) einen
    // Zeiger für "eigen" enthalten, wird er ignoriert: `zeigerAusEinstellungen`
    // iteriert nur über PROBEN_NIVEAUS und liest "eigen" darum nie ein.
    const irrefuehrend = zeiger("eigen", 7, 99);
    expect(
      naechsterStart("eigen", irrefuehrend, [ende(7, 99)], [{ nr: 0, zeilen: ["a", "b"] }]),
    ).toEqual({ textNr: 0, zeile: 0, herkunft: "neu" });
    // Auch ganz ohne Einstellungen und ohne Enden - derselbe, einzige Anfang.
    expect(naechsterStart("eigen", {}, [], [{ nr: 0, zeilen: ["a"] }])).toEqual({
      textNr: 0,
      zeile: 0,
      herkunft: "neu",
    });
  });

  it("die Anzeige: „Text 2, ab Zeile 58“ - am Textanfang „Text 2 von 15“", () => {
    expect(stelleBezeichnung(1, 57)).toBe("Text 2, ab Zeile 58");
    expect(stelleBezeichnung(1, 0)).toBe("Text 2 von 15");
  });

  it("★★ die Startzeile im Plan: gelesen, und Unsinn macht die Challenge NICHT ungültig", () => {
    expect(planAusEinstellungen({ schreibprobe: plan({ startZeile: 57 }) })?.startZeile).toBe(57);
    const { startZeile: _weg, ...ohne } = plan();
    expect(planAusEinstellungen({ schreibprobe: ohne })?.startZeile).toBe(0);
    for (const unsinn of [-3, 1.5, "57", 999_999])
      expect(
        planAusEinstellungen({ schreibprobe: { ...plan(), startZeile: unsinn } })?.startZeile,
      ).toBe(0);
  });

  it("★ satzweise stimmt mit den echten Texten: Satzzeichen nur, wo die Regel sie erwartet", async () => {
    for (const niveau of PROBEN_NIVEAUS) {
      const texte = await ladeTexte(niveau);
      const satzEnden = texte.flatMap((t) => t.zeilen).filter(endetMitSatz).length;
      if (satzweise(niveau)) expect(satzEnden, niveau).toBeGreaterThan(100);
      else if (niveau !== "code") expect(satzEnden, niveau).toBe(0);
    }
  });
});

// ── 4 · Wehrhaftes Lesen ────────────────────────────────────────────────────

describe("was vom Server kommt, wird nicht geglaubt", () => {
  it("nichts, Unsinn, leer ⇒ keine Schreibprobe", () => {
    expect(planAusEinstellungen(null)).toBeNull();
    expect(planAusEinstellungen(undefined)).toBeNull();
    expect(planAusEinstellungen("kaputt")).toBeNull();
    expect(planAusEinstellungen({})).toBeNull();
    expect(planAusEinstellungen({ schreibprobe: null })).toBeNull();
  });

  it("ein unbekanntes Niveau wird abgewiesen", () => {
    expect(
      planAusEinstellungen({ schreibprobe: { ...plan(), niveau: "erfunden" } }),
    ).toBeNull();
  });

  it("★ eine unmögliche Dauer wird abgewiesen", () => {
    // Der gefährlichste kaputte Wert: Eine Dauer von 0 gäbe eine Prüfung, die
    // im selben Augenblick abläuft; eine von 10.000 eine, die nie endet.
    expect(planAusEinstellungen({ schreibprobe: { ...plan(), dauerMin: 0 } })).toBeNull();
    expect(
      planAusEinstellungen({ schreibprobe: { ...plan(), dauerMin: DAUER_MIN_GROESST + 1 } }),
    ).toBeNull();
    expect(
      planAusEinstellungen({ schreibprobe: { ...plan(), dauerMin: "viel" } }),
    ).toBeNull();
  });

  it("eine Textnummer ausserhalb 0…14 wird abgewiesen", () => {
    expect(planAusEinstellungen({ schreibprobe: { ...plan(), textNr: 15 } })).toBeNull();
    expect(planAusEinstellungen({ schreibprobe: { ...plan(), textNr: -1 } })).toBeNull();
  });

  it("ein fehlender Startzeitpunkt wird abgewiesen", () => {
    expect(planAusEinstellungen({ schreibprobe: { ...plan(), startMs: 0 } })).toBeNull();
  });

  it("ein unsinniger Zuschlag wird gekappt, nicht abgewiesen", () => {
    // Der Zuschlag ist der einzige Wert, bei dem „kaputt" nicht heisst
    // „gar keine Prüfung": Er kann gefahrlos auf einen gültigen Bereich
    // gezogen werden, und die Prüfung soll deswegen nicht ausfallen.
    expect(
      planAusEinstellungen({ schreibprobe: { ...plan(), zuschlagProzent: -20 } })
        ?.zuschlagProzent,
    ).toBe(0);
    expect(
      planAusEinstellungen({ schreibprobe: { ...plan(), zuschlagProzent: 99999 } })
        ?.zuschlagProzent,
    ).toBe(200);
  });

  it("ein gültiger Plan kommt vollständig durch", () => {
    const p = planAusEinstellungen({ schreibprobe: plan() });
    expect(p).toEqual(plan());
  });

  describe("★★★ 'modus' - Freies Schreiben (23.09.2026)", () => {
    it('modus "frei" wird gelesen', () => {
      expect(planAusEinstellungen({ schreibprobe: { ...plan(), modus: "frei" } })?.modus).toBe(
        "frei",
      );
    });

    it("fehlt es ⇒ streng (kein Feld, nicht 'streng' als Wert)", () => {
      const p = planAusEinstellungen({ schreibprobe: plan() });
      expect(p?.modus).toBeUndefined();
      expect(p).not.toHaveProperty("modus");
    });

    it("Unsinn ⇒ streng - auch das Wort 'streng' selbst zählt als Unsinn", () => {
      for (const unsinn of ["streng", "frei ", "FREI", 1, true, null, {}])
        expect(
          planAusEinstellungen({ schreibprobe: { ...plan(), modus: unsinn } })?.modus,
        ).toBeUndefined();
    });
  });

  describe("★★★ Niveau 'eigen' (Tippchallenge mit eigener Datei, 17.09.2026)", () => {
    it("kommt NUR mit einer echten Datei-Id durch", () => {
      expect(
        planAusEinstellungen({
          schreibprobe: { ...plan(), niveau: "eigen", eigeneDateiId: "text-1" },
        }),
      ).toEqual({ ...plan(), niveau: "eigen", eigeneDateiId: "text-1" });
    });

    it("ohne Datei-Id ist 'eigen' KEIN gültiger Plan - er hätte keinen Text", () => {
      expect(
        planAusEinstellungen({ schreibprobe: { ...plan(), niveau: "eigen" } }),
      ).toBeNull();
      expect(
        planAusEinstellungen({
          schreibprobe: { ...plan(), niveau: "eigen", eigeneDateiId: "  " },
        }),
      ).toBeNull();
    });

    it("ein Plan ohne 'eigen' trägt gar kein eigeneDateiId-Feld (kein leerer String)", () => {
      const p = planAusEinstellungen({ schreibprobe: plan() });
      expect(p).not.toHaveProperty("eigeneDateiId");
    });
  });

  it("die Verbrauchsliste wird gesäubert, nicht geglaubt", () => {
    const v = verbrauchtAusEinstellungen({
      schreibprobeVerbraucht: { satz: [1, 1, 99, -3, "zwei", 4], quatsch: [1] },
    });
    expect(v.satz).toEqual([1, 4]);
    expect((v as Record<string, unknown>).quatsch).toBeUndefined();
  });
});

// ── 5 · Der Zeichenvorrat der Niveaus ───────────────────────────────────────

describe("Zeichenvorrat je Niveau", () => {
  it("die Grundreihe hat acht Buchstaben und das Leerzeichen", () => {
    const v = zeichenVorrat("start", "de");
    expect(v.size).toBe(9);
    for (const c of "fjdkslaö ") expect(v.has(c)).toBe(true);
    expect(v.has("e")).toBe(false);
  });

  it("die Umschalttaste ist KEIN Textzeichen", () => {
    // Sie steht in `einheiten` (sie ist gelernt), darf aber nie als Zeichen in
    // einem Text auftauchen - sonst müsste ein Kind „⇧" tippen.
    for (const n of PROBEN_NIVEAUS) expect(zeichenVorrat(n, "de").has(SHIFT_UNIT)).toBe(false);
  });

  it("die Niveaus wachsen streng ineinander", () => {
    // Ein Text eines niedrigen Niveaus muss in jedem höheren tippbar sein.
    for (let i = 1; i < PROBEN_NIVEAUS.length; i++) {
      const klein = zeichenVorrat(PROBEN_NIVEAUS[i - 1], "de");
      const gross = zeichenVorrat(PROBEN_NIVEAUS[i], "de");
      for (const c of klein) expect(gross.has(c)).toBe(true);
      expect(gross.size).toBeGreaterThan(klein.size);
    }
  });

  it("nur „Grundreihe“ kommt ohne Umschalttaste aus", () => {
    expect(niveauDef("start", "de")?.shift).toBe(false);
    for (const n of PROBEN_NIVEAUS.slice(1)) expect(niveauDef(n, "de")?.shift).toBe(true);
  });

  it("keine Zeile eines Niveaus ist länger als eine Braillezeile", () => {
    // 40 Module hat eine übliche Braillezeile. Wäre eine Zeile länger, müsste
    // ein Kind mit Blindheit sie mitten im Satz weiterschieben.
    for (const n of PROBEN_NIVEAUS) {
      expect(niveauDef(n, "de")!.zeileBis).toBeLessThanOrEqual(40);
      expect(niveauDef(n, "de")!.zeileVon).toBeLessThan(niveauDef(n, "de")!.zeileBis);
    }
  });
});

// ── 6 · Das Rechenwerk der Auswertung ───────────────────────────────────────

describe("Auswertung einer Schreibprobe", () => {
  it("Anschläge je Minute", () => {
    expect(anschlaegeProMinute(600, 300_000)).toBe(120);
    expect(anschlaegeProMinute(0, 300_000)).toBe(0);
    expect(anschlaegeProMinute(600, 0)).toBe(0);
  });

  it("★ die Anschlagszahl wird NIE negativ", () => {
    // Die klassische Wettschreib-Formel (brutto minus zehn je Fehler) kann
    // negativ werden. Eine negative Leistungszahl ist eine Aussage gegen ein
    // Kind ([[feedback_nie_gegen_das_kind]]) - wir rechnen sie nicht.
    expect(anschlaegeProMinute(10, 300_000)).toBeGreaterThanOrEqual(0);
  });

  it("★★★★★ dieselbe Rechnung wie Klassenmatch: starres Fenster, bereinigte Rate", () => {
    // Zwei Kinder mit derselben wahren Tippfähigkeit (150 A/min), eines davon
    // mit 2,5 Minuten Vorlesezeit in einer 10-Minuten-Prüfung. `restMs` läuft
    // für beide exakt 10 Minuten (siehe oben); `schreibMs` bekommt vom Kind
    // mit Vorlesen nur die reine Schreibzeit gemeldet (7,5 Minuten statt 10).
    // Beide Kinder kommen trotzdem auf dieselben Anschläge je Minute - genau
    // die Eigenschaft, die `matchApm` in `klassenmatch.ts` für Klassenmatch
    // beweist (tests/typing-klassenmatch-modell.test.ts, Fall g).
    const R = 150;
    const sehend = anschlaegeProMinute(R * 10, 10 * 60_000);
    const vorlesen = anschlaegeProMinute(R * 7.5, 7.5 * 60_000);
    expect(sehend).toBe(R);
    expect(vorlesen).toBe(R);
  });

  it("Treffsicherheit", () => {
    expect(genauigkeitVon(90, 10)).toBeCloseTo(0.9, 5);
    expect(genauigkeitVon(0, 0)).toBe(0);
  });

  it("die Tasten-Auflistung lässt das Leerzeichen weg", () => {
    const tasten = tastenAuflistung([
      { char: " ", correct: true },
      { char: " ", correct: false },
      { char: "a", correct: true, ms: 200 },
    ]);
    expect(tasten.map((t) => t.zeichen)).toEqual(["a"]);
  });

  it("die Umschalttaste bleibt DRIN", () => {
    const tasten = tastenAuflistung([
      { char: SHIFT_UNIT, correct: false },
      { char: SHIFT_UNIT, correct: true, ms: 300 },
    ]);
    expect(tasten[0].zeichen).toBe(SHIFT_UNIT);
    expect(tasten[0].dran).toBe(2);
    expect(tasten[0].fehler).toBe(1);
  });

  it("die schwächste Taste steht oben", () => {
    const ev = [
      ...Array.from({ length: 10 }, () => ({ char: "a", correct: true, ms: 200 })),
      ...Array.from({ length: 8 }, () => ({ char: "q", correct: true, ms: 400 })),
      ...Array.from({ length: 4 }, () => ({ char: "q", correct: false })),
    ];
    const tasten = tastenAuflistung(ev);
    expect(tasten[0].zeichen).toBe("q");
    expect(tasten[0].quote).toBeCloseTo(8 / 12, 5);
  });

  it("★ „wacklig“ braucht GENUG Anschläge - ein Vergreifer ist keine Diagnose", () => {
    // Zwei Anschläge, einer daneben: 50 % Trefferquote, aber nur zwei Versuche.
    // Wer das „wacklig" nennt, macht aus Zufall ein Urteil.
    const wenig = tastenAuflistung([
      { char: "y", correct: true, ms: 200 },
      { char: "y", correct: false },
    ]);
    expect(wackligeTasten(wenig)).toHaveLength(0);

    const genug = tastenAuflistung([
      { char: "y", correct: true, ms: 200 },
      { char: "y", correct: true, ms: 200 },
      { char: "y", correct: false },
      { char: "y", correct: false },
    ]);
    expect(wackligeTasten(genug).map((t) => t.zeichen)).toEqual(["y"]);
  });

  it("eine sichere Taste ist nicht wacklig", () => {
    const sicher = tastenAuflistung(
      Array.from({ length: 20 }, () => ({ char: "e", correct: true, ms: 180 })),
    );
    expect(wackligeTasten(sicher)).toHaveLength(0);
  });

  it("werteAus setzt die Zahlen zusammen", () => {
    const r = werteAus({
      probeId: "sp-1",
      niveau: "satz",
      textNr: 3,
      textTitel: "Der Wind",
      beginnMs: START,
      endeMs: START + 600_000,
      zeitMs: 600_000,
      zuschlagProzent: 0,
      wartezeitMs: 12_000,
      zeichen: 900,
      fehler: 100,
      zeilen: 25,
      schreibMs: 540_000,
      anschlaege: [
        ...Array.from({ length: 5 }, () => ({ char: "x", correct: true, ms: 300 })),
        ...Array.from({ length: 5 }, () => ({ char: "x", correct: false })),
      ],
      layout: "de",
      textZuEnde: false,
      frueherAbgegeben: false,
    });
    expect(r.anschlaege).toBe(100);
    expect(r.genauigkeit).toBeCloseTo(0.9, 5);
    expect(r.wacklig.map((t) => t.zeichen)).toEqual(["x"]);
    expect(r.zeilen).toBe(25);
  });

  it("gespeichert wird gekappt - aber die schwächsten Tasten bleiben", () => {
    const viele = Array.from({ length: 30 }, (_, i) => ({
      char: String.fromCharCode(97 + i),
      correct: i % 2 === 0,
      ms: 200,
    }));
    const r = werteAus({
      probeId: "sp-2",
      niveau: "alles",
      textNr: 0,
      textTitel: "T",
      beginnMs: START,
      endeMs: START + 1,
      zeitMs: 1,
      zuschlagProzent: 0,
      wartezeitMs: 0,
      zeichen: 30,
      fehler: 15,
      zeilen: 1,
      schreibMs: 1000,
      anschlaege: viele,
      layout: "de",
      textZuEnde: false,
      frueherAbgegeben: false,
    });
    const gespeichert = fuersSpeichern(r);
    expect(gespeichert.tasten.length).toBeLessThanOrEqual(TASTEN_KAPPE);
    // Die erste (schwächste) Taste überlebt das Kappen.
    expect(gespeichert.tasten[0].zeichen).toBe(r.tasten[0].zeichen);
  });

  it("ein kaputtes gespeichertes Ergebnis verschwindet, statt abzustürzen", () => {
    expect(ergebnisAusJson(null)).toBeNull();
    expect(ergebnisAusJson({})).toBeNull();
    expect(ergebnisAusJson({ probeId: "x" })).toBeNull();
    expect(ergebnisAusJson({ probeId: "x", niveau: "satz", textNr: 99 })).toBeNull();
    const gut = ergebnisAusJson({
      probeId: "x",
      niveau: "satz",
      textNr: 2,
      anschlaege: 140,
      genauigkeit: 0.95,
      tasten: [{ zeichen: "q", dran: 10, fehler: 4 }],
    });
    expect(gut?.anschlaege).toBe(140);
    expect(gut?.wacklig.map((t) => t.zeichen)).toEqual(["q"]);
  });

  describe("★★★ 'Freies Schreiben' - die neuen Felder (23.09.2026)", () => {
    it("werteAus nimmt alle neuen Felder durch, ergebnisAusJson liest sie zurück - Hin- und Rückweg", () => {
      const roh = werteAus({
        probeId: "sp-frei",
        niveau: "satz",
        textNr: 1,
        textTitel: "T",
        beginnMs: START,
        endeMs: START + 600_000,
        zeitMs: 600_000,
        zuschlagProzent: 0,
        wartezeitMs: 0,
        zeichen: 900,
        // Im freien Modus: „fehler" = stehengeblieben.
        fehler: 4,
        zeilen: 20,
        schreibMs: 540_000,
        anschlaege: [],
        layout: "de",
        textZuEnde: false,
        frueherAbgegeben: false,
        modus: "frei",
        korrekturen: 7,
        fehlgriffe: 11,
        fehlerArten: { falsch: 2, fehlend: 1, ueberzaehlig: 0, leerzeichen: 1 },
        fehlerStellen: [{ zeile: 3, soll: "Haus", ist: "Hais", art: "falsch" }],
        getippt: ["Erste Zeile", "Zweite Zeile"],
      });
      expect(roh.modus).toBe("frei");
      expect(roh.korrekturen).toBe(7);
      expect(roh.fehlgriffe).toBe(11);
      expect(roh.fehlerArten).toEqual({ falsch: 2, fehlend: 1, ueberzaehlig: 0, leerzeichen: 1 });
      expect(roh.fehlerStellen).toEqual([{ zeile: 3, soll: "Haus", ist: "Hais", art: "falsch" }]);
      expect(roh.getippt).toEqual(["Erste Zeile", "Zweite Zeile"]);
      // ★ Der freie Modus wertet mit dem GRÖSSEREN Fehlergewicht (50 statt 5) -
      // die Gegenprobe steht im Wächter der Wertung; hier nur: die Wertung hängt
      // sichtbar am Modus.
      const streng = werteAus({
        probeId: "sp-streng",
        niveau: "satz",
        textNr: 1,
        textTitel: "T",
        beginnMs: START,
        endeMs: START + 600_000,
        zeitMs: 600_000,
        zuschlagProzent: 0,
        wartezeitMs: 0,
        zeichen: 900,
        fehler: 4,
        zeilen: 20,
        schreibMs: 540_000,
        anschlaege: [],
        layout: "de",
        textZuEnde: false,
        frueherAbgegeben: false,
      });
      expect(roh.wertung.guete).toBeLessThan(streng.wertung.guete);

      // Hin- und Rückweg: dasselbe JSON zurückgelesen ergibt dieselben Felder.
      const zurueck = ergebnisAusJson(JSON.parse(JSON.stringify(roh)));
      expect(zurueck?.modus).toBe("frei");
      expect(zurueck?.korrekturen).toBe(7);
      expect(zurueck?.fehlgriffe).toBe(11);
      expect(zurueck?.fehlerArten).toEqual(roh.fehlerArten);
      expect(zurueck?.fehlerStellen).toEqual(roh.fehlerStellen);
      expect(zurueck?.getippt).toEqual(roh.getippt);
      expect(zurueck?.wertung.wert).toBe(roh.wertung.wert);
    });

    it("fehlen die neuen Felder (strenger Modus, ältere Ergebnisse) ⇒ sie bleiben weg, nicht erfunden", () => {
      const r = ergebnisAusJson({
        probeId: "x",
        niveau: "satz",
        textNr: 0,
        anschlaege: 100,
        genauigkeit: 0.95,
      });
      expect(r).not.toHaveProperty("modus");
      expect(r).not.toHaveProperty("korrekturen");
      expect(r).not.toHaveProperty("fehlgriffe");
      expect(r).not.toHaveProperty("fehlerArten");
      expect(r).not.toHaveProperty("fehlerStellen");
      expect(r).not.toHaveProperty("getippt");
    });

    it("kaputte Werte der neuen Felder verschwinden, statt eine falsche Zahl zu erfinden", () => {
      const r = ergebnisAusJson({
        probeId: "x",
        niveau: "satz",
        textNr: 0,
        anschlaege: 100,
        genauigkeit: 0.95,
        modus: "streng", // ⚠️ Unsinn - nur "frei" ist gültig.
        korrekturen: "sieben",
        fehlgriffe: null,
        fehlerArten: "kaputt",
        fehlerStellen: "kaputt",
        getippt: "kaputt",
      });
      expect(r?.modus).toBeUndefined();
      expect(r).not.toHaveProperty("korrekturen");
      expect(r).not.toHaveProperty("fehlgriffe");
      expect(r).not.toHaveProperty("fehlerArten");
      expect(r).not.toHaveProperty("fehlerStellen");
      expect(r).not.toHaveProperty("getippt");
    });

    it("★ Kappung: höchstens FEHLERSTELLEN_KAPPE Fehlerstellen, höchstens GETIPPT_ZEILEN_KAPPE Zeilen zu je GETIPPT_ZEILE_ZEICHEN_KAPPE Zeichen", () => {
      const vieleStellen = Array.from({ length: FEHLERSTELLEN_KAPPE + 50 }, (_, i) => ({
        zeile: i,
        soll: "x",
        ist: "y",
        art: "falsch",
      }));
      const vieleZeilen = Array.from(
        { length: GETIPPT_ZEILEN_KAPPE + 50 },
        (_, i) => `Zeile ${i}`,
      );
      const langeZeile = "x".repeat(GETIPPT_ZEILE_ZEICHEN_KAPPE + 100);

      const r = werteAus({
        probeId: "sp-kappen",
        niveau: "satz",
        textNr: 0,
        textTitel: "T",
        beginnMs: START,
        endeMs: START + 1,
        zeitMs: 1,
        zuschlagProzent: 0,
        wartezeitMs: 0,
        zeichen: 10,
        fehler: 1,
        zeilen: 1,
        schreibMs: 1000,
        anschlaege: [],
        layout: "de",
        textZuEnde: false,
        frueherAbgegeben: false,
        modus: "frei",
        fehlerStellen: vieleStellen,
        getippt: [...vieleZeilen, langeZeile],
      });
      expect(r.fehlerStellen).toHaveLength(FEHLERSTELLEN_KAPPE);
      expect(r.getippt).toHaveLength(GETIPPT_ZEILEN_KAPPE);
      expect(r.getippt!.every((z) => z.length <= GETIPPT_ZEILE_ZEICHEN_KAPPE)).toBe(true);

      // Und dieselbe Kappung gilt beim wehrhaften Zurücklesen aus dem Server-JSON.
      const zurueck = ergebnisAusJson({
        probeId: "x",
        niveau: "satz",
        textNr: 0,
        anschlaege: 100,
        genauigkeit: 0.95,
        fehlerStellen: vieleStellen,
        getippt: [...vieleZeilen, langeZeile],
      });
      expect(zurueck?.fehlerStellen).toHaveLength(FEHLERSTELLEN_KAPPE);
      expect(zurueck?.getippt).toHaveLength(GETIPPT_ZEILEN_KAPPE);
      expect(zurueck?.getippt!.every((z) => z.length <= GETIPPT_ZEILE_ZEICHEN_KAPPE)).toBe(true);
    });
  });
});
