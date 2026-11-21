/**
 * ★★★★★ WÄCHTER: DIE ZEILEN-RECHNUNG DER LESEZEILE (E12, 20.09.2026).
 * ===========================================================================
 * `lib/typing/leseZeile.ts` - REINE Funktionen, ohne DOM: Rechtecke rein,
 * Zeilen raus. jsdom rechnet kein Layout (`Range.getClientRects()` liefert
 * dort nichts) - darum wird hier mit erfundenen Rechtecken geprüft, wie sie
 * ein echter Browser für einen mehrzeiligen Absatz liefern würde.
 *
 * Die Bedienung (Pfeiltasten, Popup, „Feld bleibt hell") prüft
 * `tastenflow-cvi-lesezeile.test.tsx` am Bauteil.
 *
 * ★★★ WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD:
 *  · Zwei Rechtecke derselben Zeile werden als zwei Zeilen gezählt - rot.
 *  · Pfeil ab springt über das Ende hinaus oder läuft um - rot.
 *  · Ein Zahlenfeld oder ein `<textarea>` gilt plötzlich als „sicher" - rot.
 *
 * ★ Seit der Korrektur vom 20.09.2026 („nicht nur die anderen Zeilen -
 * der ganze Bildschirm ausser Lesezeile und Eingabefeld") prüft dieser
 * Wächter zusätzlich `abdeckRechtecke` - die waagrechte Bandzerlegung, die
 * aus Löchern + Bildschirmgrösse die Abdeck-Rechtecke berechnet:
 *  · Ein Abdeck-Rechteck berührt eines der Löcher - rot.
 *  · Ein Punkt ausserhalb aller Löcher bleibt unbedeckt - rot.
 */
import { describe, expect, it } from "vitest";
import {
  abdeckRechtecke,
  istEinzeiligesTextfeld,
  mitLuft,
  naechsteZeile,
  vorherigeZeile,
  zeilenAusRechtecken,
  zeilenIndexKlemmen,
  type LesezeileRechteck,
} from "@/lib/typing/leseZeile";

/** Ein Rechteck kurz hinschreiben. */
function r(x: number, y: number, w: number, h: number): LesezeileRechteck {
  return { x, y, w, h };
}

describe("zeilenAusRechtecken - Zeilen ERMITTELN, nicht raten", () => {
  it("keine Rechtecke ⇒ keine Zeilen", () => {
    expect(zeilenAusRechtecken([])).toEqual([]);
  });

  it("ein einziges Rechteck ⇒ eine Zeile (kein Umbruch)", () => {
    expect(zeilenAusRechtecken([r(10, 10, 300, 24)])).toEqual([r(10, 10, 300, 24)]);
  });

  it("★★★★★ drei Zeilen, wie sie ein umbrochener Absatz wirklich liefert", () => {
    // Drei Zeilen mit derselben Höhe (24 px), 24 px Vorschub - wie beim Bild
    // aus Testerin Rückmeldung ("Was fehlt hier?" über mehrere Zeilen).
    const zeilen = zeilenAusRechtecken([
      r(10, 58, 180, 24), // dritte Zeile (absichtlich zuletzt in der Liste)
      r(10, 10, 320, 24), // erste Zeile
      r(10, 34, 260, 24), // zweite Zeile
    ]);
    expect(zeilen).toHaveLength(3);
    // Top-nach-unten sortiert, unabhängig von der Reihenfolge der Eingabe.
    expect(zeilen.map((z) => z.y)).toEqual([10, 34, 58]);
  });

  it("★★★★★ MEHRERE Rechtecke auf DERSELBEN Zeile (EN4: Bedienung + Inhalt in eigenen <span>) werden EINE Zeile", () => {
    // Ein gemischter Satz kann auf derselben Zeile in zwei Fragmente zerfallen
    // (Bedienungs-Teil, Inhalts-Teil in eigenem <span lang>) - beide haben
    // dieselbe senkrechte Lage.
    const zeilen = zeilenAusRechtecken([
      r(10, 10, 120, 24), // "Frage: " (Bedienung)
      r(130, 10, 90, 24), // "Hund" (Inhalt, eigener <span>, gleiche Zeile)
      r(10, 34, 200, 24), // zweite Zeile
    ]);
    expect(zeilen).toHaveLength(2);
    // Die erste Zeile ist die Vereinigung ihrer beiden Fragmente.
    expect(zeilen[0]).toEqual({ x: 10, y: 10, w: 210, h: 24 });
  });

  it("Nullflächen-Rechtecke (leere Textknoten, jsdom ohne Layout) zählen nicht mit", () => {
    const zeilen = zeilenAusRechtecken([r(0, 0, 0, 0), r(10, 10, 300, 24)]);
    expect(zeilen).toHaveLength(1);
  });

  it("leicht unterschiedliche Zeilenhöhen auf derselben Zeile werden trotzdem zusammengefasst", () => {
    // Ein <span> mit anderer Schriftgrösse kann eine leicht andere Höhe haben,
    // steht aber sichtbar auf derselben Zeile.
    const zeilen = zeilenAusRechtecken([
      r(10, 10, 100, 24),
      r(110, 12, 50, 20),
    ]);
    expect(zeilen).toHaveLength(1);
  });
});

describe("naechsteZeile / vorherigeZeile - an den Enden passiert nichts", () => {
  it("Pfeil ab geht eine Zeile weiter", () => {
    expect(naechsteZeile(0, 3)).toBe(1);
    expect(naechsteZeile(1, 3)).toBe(2);
  });

  it("★★★★★ Pfeil ab an der LETZTEN Zeile: kein Sprung, kein Umlauf", () => {
    expect(naechsteZeile(2, 3)).toBe(2);
  });

  it("Pfeil auf geht eine Zeile zurück", () => {
    expect(vorherigeZeile(2)).toBe(1);
  });

  it("★★★★★ Pfeil auf an der ERSTEN Zeile: kein Sprung, kein Umlauf", () => {
    expect(vorherigeZeile(0)).toBe(0);
  });

  it("ohne Zeilen (0) bleibt naechsteZeile bei 0", () => {
    expect(naechsteZeile(0, 0)).toBe(0);
  });
});

describe("zeilenIndexKlemmen - weniger Zeilen nach einer Fenstergrössen-Änderung", () => {
  it("ein Index ausserhalb der neuen Spanne wird eingefangen", () => {
    expect(zeilenIndexKlemmen(4, 2)).toBe(1);
  });

  it("ein gültiger Index bleibt, wie er ist", () => {
    expect(zeilenIndexKlemmen(1, 3)).toBe(1);
  });

  it("keine Zeilen mehr ⇒ 0", () => {
    expect(zeilenIndexKlemmen(2, 0)).toBe(0);
  });
});

describe("istEinzeiligesTextfeld - Pflicht Nr 3: darf das Tippen nicht stören", () => {
  it("★★★★★ ein gewöhnliches <input type=text> ist sicher", () => {
    const el = document.createElement("input");
    el.type = "text";
    expect(istEinzeiligesTextfeld(el)).toBe(true);
  });

  it("<input> ohne type (Vorgabe „text“) ist sicher", () => {
    const el = document.createElement("input");
    expect(istEinzeiligesTextfeld(el)).toBe(true);
  });

  it("★★★★★ ein <textarea> (mehrzeilig) ist NICHT sicher", () => {
    const el = document.createElement("textarea");
    expect(istEinzeiligesTextfeld(el)).toBe(false);
  });

  it("★★★★★ ein Zahlenfeld (Pfeil = Spinner) ist NICHT sicher", () => {
    const el = document.createElement("input");
    el.type = "number";
    expect(istEinzeiligesTextfeld(el)).toBe(false);
  });

  it("ein Schieberegler (Pfeil = Wert) ist NICHT sicher", () => {
    const el = document.createElement("input");
    el.type = "range";
    expect(istEinzeiligesTextfeld(el)).toBe(false);
  });

  it("eine Liste (<select>, Pfeil = Auswahl) ist NICHT sicher", () => {
    const el = document.createElement("select");
    expect(istEinzeiligesTextfeld(el)).toBe(false);
  });

  it("kein Element (Fokus nirgends) ist NICHT sicher", () => {
    expect(istEinzeiligesTextfeld(null)).toBe(false);
  });
});

describe("mitLuft - ein paar Pixel Rand, damit ein Loch nicht an der Kante klebt", () => {
  it("vergrössert nach allen vier Seiten um denselben Betrag", () => {
    expect(mitLuft(r(10, 10, 100, 20), 6)).toEqual(r(4, 4, 112, 32));
  });

  it("Luft null lässt das Rechteck unverändert", () => {
    expect(mitLuft(r(10, 10, 100, 20), 0)).toEqual(r(10, 10, 100, 20));
  });
});

// ---------------------------------------------------------------------------
// abdeckRechtecke - die Korrektur vom 20.09.2026: der GANZE Bildschirm wird
// verdunkelt, nicht nur die Nachbarzeilen der Frage.
// ---------------------------------------------------------------------------

/** Liegt der Punkt (x, y) in diesem Rechteck? */
function enthaeltPunkt(rechteck: LesezeileRechteck, x: number, y: number): boolean {
  return x >= rechteck.x && x < rechteck.x + rechteck.w && y >= rechteck.y && y < rechteck.y + rechteck.h;
}

/** An wie vielen der Abdeck-Rechtecke liegt dieser Punkt? (Für „genau eines" / „keines".) */
function anzahlAbdeckend(rechtecke: readonly LesezeileRechteck[], x: number, y: number): number {
  return rechtecke.filter((rr) => enthaeltPunkt(rr, x, y)).length;
}

/**
 * Rastert die ganze Bildschirmfläche ab und prüft für jeden Punkt: liegt er
 * in einem Loch, darf KEIN Abdeck-Rechteck ihn treffen; liegt er ausserhalb
 * aller Löcher, muss GENAU EIN Abdeck-Rechteck ihn treffen (die Bänder dürfen
 * einander nicht überlappen). Das prüft „berührt kein Loch" und „deckt den
 * ganzen Rest ab" in einem Rutsch, für beliebige Loch-Konfigurationen.
 */
function pruefeVollstaendigeAbdeckung(
  loecher: readonly LesezeileRechteck[],
  bildschirm: { w: number; h: number },
  schritt = 5,
) {
  const rechtecke = abdeckRechtecke(loecher, bildschirm);
  for (let y = 0; y < bildschirm.h; y += schritt) {
    for (let x = 0; x < bildschirm.w; x += schritt) {
      const inEinemLoch = loecher.some((l) => enthaeltPunkt(l, x, y));
      const anzahl = anzahlAbdeckend(rechtecke, x, y);
      if (inEinemLoch) expect(anzahl).toBe(0);
      else expect(anzahl).toBe(1);
    }
  }
  return rechtecke;
}

describe("abdeckRechtecke - der GANZE Bildschirm verdunkelt, ausser den Löchern", () => {
  const BILDSCHIRM = { w: 200, h: 160 };

  it("kein Loch ⇒ ein einziges Rechteck deckt den ganzen Bildschirm", () => {
    const rechtecke = pruefeVollstaendigeAbdeckung([], BILDSCHIRM);
    expect(rechtecke).toEqual([{ x: 0, y: 0, w: BILDSCHIRM.w, h: BILDSCHIRM.h }]);
  });

  it("★★★★★ EIN Loch in der Mitte: Band darüber, Bänder links/rechts, Band darunter", () => {
    const loch = r(60, 50, 80, 30);
    const rechtecke = pruefeVollstaendigeAbdeckung([loch], BILDSCHIRM);
    // Band über dem Loch, Band darunter, links vom Loch, rechts vom Loch.
    expect(rechtecke).toHaveLength(4);
  });

  it("★★★★★ ZWEI Löcher übereinander (Lesezeile über dem Eingabefeld, wie im Bild): Band darüber, Bänder um jedes Loch, Band dazwischen, Band darunter", () => {
    const lesezeile = r(20, 10, 100, 24); // oben: die helle Zeile
    const feld = r(20, 90, 160, 40); // unten: das Eingabefeld
    const rechtecke = pruefeVollstaendigeAbdeckung([lesezeile, feld], BILDSCHIRM);
    // 1 (darüber) + 2 (links/rechts Lesezeile) + 1 (dazwischen) + 2 (links/rechts Feld) + 1 (darunter) = 7.
    expect(rechtecke).toHaveLength(7);
  });

  it("zwei Löcher, die sich überschneiden, werden trotzdem sauber ausgespart", () => {
    const a = r(20, 20, 80, 60);
    const b = r(60, 50, 80, 60); // überlappt a
    pruefeVollstaendigeAbdeckung([a, b], BILDSCHIRM);
  });

  it("★★★★★ ein Loch ganz ausserhalb des Bildschirms trägt nichts bei (wie kein Loch)", () => {
    const drinnen = r(-500, -500, 40, 20);
    const rechtecke = pruefeVollstaendigeAbdeckung([drinnen], BILDSCHIRM);
    expect(rechtecke).toEqual([{ x: 0, y: 0, w: BILDSCHIRM.w, h: BILDSCHIRM.h }]);
  });

  it("ein Loch, das über den Bildschirmrand hinausragt, wird auf den Bildschirm zugeschnitten", () => {
    const amRand = r(-10, -10, 40, 30); // ragt über die linke obere Ecke hinaus
    pruefeVollstaendigeAbdeckung([amRand], BILDSCHIRM);
  });

  it("leere Bildschirmfläche (Breite oder Höhe null) liefert keine Rechtecke", () => {
    expect(abdeckRechtecke([], { w: 0, h: 100 })).toEqual([]);
    expect(abdeckRechtecke([], { w: 100, h: 0 })).toEqual([]);
  });
});
