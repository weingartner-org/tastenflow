import { describe, expect, it } from "vitest";
import {
  aktuelleWoche,
  aktuelleWocheKey,
  anstehendeAenderung,
  buildDayPractice,
  effektivesWochenziel,
  erfuellungProzent,
  inGesperrterZeit,
  isoWeekKey,
  istZielwoche,
  kindWochenzielAusFeldern,
  naechsteWocheKey,
  neuesKindVerlauf,
  prozentAnzeige,
  UMSTELLUNG_WOCHE,
  wochenStart,
  wochenzielVerlauf,
  WOCHENZIEL_GRENZE,
  zielAendern,
  zielAenderungsText,
  zielFuerWoche,
  type GesperrteZeit,
  type KindWochenziel,
  type ZielAbschnitt,
} from "@/lib/typing";
import type { TaskEvent } from "@/lib/typing/account";

/**
 * Wochenziel NEU (Bauplan W, W1 - reine Logik), NACH Johannes' Korrektur vom
 * 18.09.2026 UND VIER Review-Runden derselben Nacht. Diese Datei spiegelt die
 * FÜNFTE (letzte) Runde: der Zielverlauf ist ein FELD am Kind
 * (`tt_pupils.wochenzielVerlauf`, kommt mit W2), KEIN Ereignis-Marker mehr -
 * eine Klassen-Änderung hätte sonst beim Lesen-Ändern-Schreiben in ~25
 * Kinder-Ereignislisten während des Unterrichts einen Wettlauf ausgelöst.
 *
 * ★★★ Montag-08:00-Grenze (dritte Runde), „ab kommender Woche, nicht ab
 * dieser" (dritte Runde), Sperr-Zeiträume statt Ereignis-Marke (vierte
 * Runde) - alle drei bleiben unverändert und sind unten weiter geprüft.
 *
 * Montag, 10. August 2026, 08:00 - bewusst eine Woche, die ganz nach dem
 * Umstieg auf reine Tippzeit liegt (`ACTIVE_TIME_SINCE_MS`, 07.07.2026 fällt
 * DAVOR).
 */
const MONTAG = new Date(2026, 7, 10, 8, 0, 0).getTime(); // Montag, 10.08.2026, 08:00
const TAG_MS = 86_400_000;
const MIN = 60_000;

/** Ein Abschnitt, der lange vor jeder Testwoche beginnt - sortiert als
 *  String-Schlüssel garantiert vor „2026-W…" und „2027-W…". */
const IMMER_AB = "2000-W01";

function ev(
  ts: number,
  minuten: number,
  extra: Partial<TaskEvent> = {},
): TaskEvent {
  const ms = minuten * MIN;
  return { ts, lesson: "x", chars: 10, errors: 0, ms, activeMs: ms, ...extra };
}

/** Woche `n` (0 = die MONTAG-Woche) - ihr Montag 08:00 + `key`. Reine
 *  Millisekunden-Schrittweite ist hier sicher: die Testwochen liegen alle
 *  weit weg von einer Sommer-/Winterzeit-Umstellung (siehe eigener
 *  DST-Abschnitt unten für die Grenzfälle). */
function woche(n: number): { start: number; key: string } {
  const start = MONTAG + n * 7 * TAG_MS;
  return { start, key: isoWeekKey(start) };
}

function kindZielVerlauf(
  verlauf: ZielAbschnitt[],
  extra: Partial<KindWochenziel> = {},
): KindWochenziel {
  return { verlauf, wochen: [], nachholen: false, erlasseneWochen: [], ...extra };
}

/** Ein flaches Ziel, das (über {@link IMMER_AB}) für jede Testwoche gilt -
 *  der Komfort-Fall für alles, was sich nicht für den Zielverlauf selbst
 *  interessiert. */
function kindZiel(minuten: number, extra: Partial<KindWochenziel> = {}): KindWochenziel {
  return kindZielVerlauf(minuten > 0 ? [{ ab: IMMER_AB, minuten }] : [], extra);
}

describe("Wochenziel NEU - WOCHENZIEL_GRENZE ist Montag 08:00", () => {
  it("jede Testwoche beginnt tatsächlich an einem Montag um 08:00", () => {
    for (let n = -2; n <= 5; n++) {
      const d = new Date(woche(n).start);
      expect(d.getDay()).toBe(1); // Montag
      expect(d.getHours()).toBe(8);
      expect(d.getMinutes()).toBe(0);
      expect(wochenStart(woche(n).start, WOCHENZIEL_GRENZE)).toBe(woche(n).start);
    }
  });
});

describe("Wochenziel NEU - istZielwoche", () => {
  it("leere Auswahl = jede Woche ist Ziel-Woche", () => {
    expect(istZielwoche(woche(0).key, [])).toBe(true);
    expect(istZielwoche(woche(5).key, [])).toBe(true);
  });

  it("mit Auswahl zählt nur, was drinsteht", () => {
    const gewaehlt = [woche(0).key, woche(2).key];
    expect(istZielwoche(woche(0).key, gewaehlt)).toBe(true);
    expect(istZielwoche(woche(1).key, gewaehlt)).toBe(false);
    expect(istZielwoche(woche(2).key, gewaehlt)).toBe(true);
  });
});

describe("Wochenziel NEU - naechsteWocheKey / aktuelleWocheKey (Montag-08:00-Grenze)", () => {
  it("Montag 07:00 (vor der Grenze) - „nächste Woche\" ist DIESER Montag", () => {
    const jetzt = woche(1).start - 1 * 3_600_000; // Montag 07:00
    expect(aktuelleWocheKey(jetzt)).toBe(woche(0).key);
    expect(naechsteWocheKey(jetzt)).toBe(woche(1).key);
  });

  it("Montag 09:00 (nach der Grenze) - „nächste Woche\" ist der NÄCHSTE Montag", () => {
    const jetzt = woche(1).start + 1 * 3_600_000; // Montag 09:00
    expect(aktuelleWocheKey(jetzt)).toBe(woche(1).key);
    expect(naechsteWocheKey(jetzt)).toBe(woche(2).key);
  });

  it("bleibt über die Sommerzeit-Umstellung hinweg korrekt (Frühjahr 2027)", () => {
    // Montag 22.03.2027, 09:00 - die Woche VOR der Umstellung (Sa/So 27./28.03.2027).
    const montagVorher = new Date(2027, 2, 22, 9, 0, 0).getTime();
    const montagDanach = new Date(2027, 2, 29, 8, 0, 0).getTime(); // die Folgewoche, NACH der Umstellung
    expect(naechsteWocheKey(montagVorher)).toBe(isoWeekKey(montagDanach));
  });

  it("bleibt über die Sommerzeit-Umstellung hinweg korrekt (Herbst 2026)", () => {
    // Montag 19.10.2026, 09:00 - die Woche VOR der Umstellung (So 25.10.2026).
    const montagVorher = new Date(2026, 9, 19, 9, 0, 0).getTime();
    const montagDanach = new Date(2026, 9, 26, 8, 0, 0).getTime();
    expect(naechsteWocheKey(montagVorher)).toBe(isoWeekKey(montagDanach));
  });
});

describe("Wochenziel NEU - zielFuerWoche", () => {
  it("ohne Verlauf gilt überall 0 - kein Ziel vor dem ersten Abschnitt", () => {
    expect(zielFuerWoche([], woche(0).key)).toBe(0);
    expect(zielFuerWoche([], woche(9).key)).toBe(0);
  });

  it("ein Abschnitt gilt AB seiner Woche, davor 0", () => {
    const verlauf: ZielAbschnitt[] = [{ ab: woche(2).key, minuten: 60 }];
    expect(zielFuerWoche(verlauf, woche(0).key)).toBe(0);
    expect(zielFuerWoche(verlauf, woche(1).key)).toBe(0);
    expect(zielFuerWoche(verlauf, woche(2).key)).toBe(60);
    expect(zielFuerWoche(verlauf, woche(5).key)).toBe(60);
  });

  it("mehrere Abschnitte - jede Woche bekommt IHREN (den jüngsten passenden)", () => {
    const verlauf: ZielAbschnitt[] = [
      { ab: woche(1).key, minuten: 30 },
      { ab: woche(3).key, minuten: 60 },
    ];
    expect(zielFuerWoche(verlauf, woche(0).key)).toBe(0); // vor dem ersten Abschnitt
    expect(zielFuerWoche(verlauf, woche(1).key)).toBe(30);
    expect(zielFuerWoche(verlauf, woche(2).key)).toBe(30);
    expect(zielFuerWoche(verlauf, woche(3).key)).toBe(60);
    expect(zielFuerWoche(verlauf, woche(4).key)).toBe(60);
  });

  it("effektivesWochenziel ist derselbe Blick, nur über einen Zeitpunkt", () => {
    const ziel = kindZielVerlauf([{ ab: woche(2).key, minuten: 60 }]);
    expect(effektivesWochenziel(ziel, woche(1).start)).toBe(0);
    expect(effektivesWochenziel(ziel, woche(2).start)).toBe(60);
  });
});

describe("Wochenziel NEU - zielAendern (gilt ab der FOLGEWOCHE, dritte Review-Runde)", () => {
  it("eine einzelne Änderung gilt ab der Folgewoche, nicht ab der laufenden", () => {
    const jetzt = woche(1).start + 9 * 3_600_000; // irgendwann in Woche 1
    const verlauf = zielAendern([], 60, jetzt);
    expect(verlauf).toEqual([{ ab: naechsteWocheKey(jetzt), minuten: 60 }]);
    expect(naechsteWocheKey(jetzt)).toBe(woche(2).key);
  });

  it("zwei Änderungen in DERSELBEN Woche - nur die letzte gilt", () => {
    const jetzt1 = woche(1).start + 9 * 3_600_000; // Montag dieser Woche
    const jetzt2 = woche(1).start + 2 * TAG_MS; // Mittwoch derselben Woche
    let verlauf = zielAendern([], 45, jetzt1);
    verlauf = zielAendern(verlauf, 90, jetzt2);
    expect(verlauf).toEqual([{ ab: woche(2).key, minuten: 90 }]);
  });

  it("eine Änderung ZURÜCK auf den bisherigen Wert entfernt den anstehenden Abschnitt", () => {
    const bisher: ZielAbschnitt[] = [{ ab: IMMER_AB, minuten: 45 }];
    const jetzt1 = woche(1).start + 9 * 3_600_000;
    const jetzt2 = woche(1).start + 2 * TAG_MS; // dieselbe Woche wie jetzt1
    const mitAnstehender = zielAendern(bisher, 90, jetzt1);
    expect(mitAnstehender).toEqual([{ ab: IMMER_AB, minuten: 45 }, { ab: woche(2).key, minuten: 90 }]);
    const zurueckgesetzt = zielAendern(mitAnstehender, 45, jetzt2);
    expect(zurueckgesetzt).toEqual([{ ab: IMMER_AB, minuten: 45 }]); // die 90er-Änderung ist wieder weg
  });

  it("Minuten werden gerundet und auf 0..600 geklemmt", () => {
    const jetzt = woche(1).start;
    expect(zielAendern([], 59.6, jetzt)[0].minuten).toBe(60);
    expect(zielAendern([], -5, jetzt)[0]).toBeUndefined(); // 0 ⇒ kein Abschnitt (kein Ziel)
    expect(zielAendern([], 5000, jetzt)[0].minuten).toBe(600);
  });

  it("ist eine reine Funktion - der übergebene Verlauf bleibt unangetastet", () => {
    const original: ZielAbschnitt[] = [{ ab: IMMER_AB, minuten: 30 }];
    zielAendern(original, 60, woche(1).start);
    expect(original).toEqual([{ ab: IMMER_AB, minuten: 30 }]);
  });
});

describe("Wochenziel NEU - anstehendeAenderung", () => {
  it("null, solange nichts ansteht", () => {
    const verlauf: ZielAbschnitt[] = [{ ab: IMMER_AB, minuten: 45 }];
    expect(anstehendeAenderung(verlauf, woche(1).start)).toBeNull();
  });

  it("zeigt die anstehende Änderung, solange die Folgewoche noch nicht begonnen hat", () => {
    const jetzt = woche(1).start + 9 * 3_600_000;
    const verlauf = zielAendern([{ ab: IMMER_AB, minuten: 45 }], 90, jetzt);
    expect(anstehendeAenderung(verlauf, jetzt)).toEqual({ ab: woche(2).key, minuten: 90 });
    // Kurz vor der Folgewoche (noch in Woche 1) steht sie noch an …
    expect(anstehendeAenderung(verlauf, woche(2).start - 1)).toEqual({ ab: woche(2).key, minuten: 90 });
    // … ab der Folgewoche selbst ist sie schon die AKTUELLE, nicht mehr „anstehend".
    expect(anstehendeAenderung(verlauf, woche(2).start)).toBeNull();
  });
});

describe("Wochenziel NEU - neuesKindVerlauf (Beitritt zur Klasse)", () => {
  it("ein neues Kind bekommt seinen ersten Abschnitt ab der Folgewoche, nie ab der laufenden", () => {
    const jetzt = woche(1).start + 9 * 3_600_000;
    expect(neuesKindVerlauf(60, jetzt)).toEqual([{ ab: woche(2).key, minuten: 60 }]);
  });

  it("0 (oder weniger) Minuten ⇒ leerer Verlauf, kein Abschnitt", () => {
    expect(neuesKindVerlauf(0, woche(1).start)).toEqual([]);
    expect(neuesKindVerlauf(-5, woche(1).start)).toEqual([]);
  });

  it("ein Kind, das am MITTWOCH beitritt, hat DIESE Woche noch kein Ziel - erst die Folgewoche zählt", () => {
    const mittwoch = woche(1).start + 2 * TAG_MS + 3 * 3_600_000; // Mittwoch, 11:00
    const verlauf = neuesKindVerlauf(60, mittwoch);
    const ziel = kindZielVerlauf(verlauf);
    const events = [
      ev(woche(1).start + 9 * 3_600_000, 30), // schon vor dem Beitritt geübt (zählt trotzdem als geuebt)
      ev(woche(2).start + 9 * 3_600_000, 60),
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(1).start, woche(2).start);
    expect(wochen[0]).toMatchObject({ zielwoche: false, ziel: 0, geuebt: 30 }); // Beitrittswoche
    expect(wochen[1]).toMatchObject({ zielwoche: true, ziel: 60, geuebt: 60, erfuellt: 60 }); // Folgewoche
  });
});

describe("Wochenziel NEU - kindWochenzielAusFeldern (Übergang von den alten Feldern)", () => {
  it("ein gültiger, nicht-leerer wochenzielVerlauf wird direkt übernommen - Alt-Felder werden ignoriert", () => {
    const gespeichert: ZielAbschnitt[] = [{ ab: woche(1).key, minuten: 45 }];
    const kind = kindWochenzielAusFeldern({
      wochenzielVerlauf: gespeichert,
      goalMinutes: 99,
      goalUnits: 9,
    });
    expect(kind.verlauf).toEqual(gespeichert);
  });

  it("lazy Umrechnung: 15 Min/Einheit × 3 Einheiten = 45 Min/Woche, gültig ab der Umstellungswoche", () => {
    const kind = kindWochenzielAusFeldern({ goalMinutes: 15, goalUnits: 3 });
    expect(kind.verlauf).toEqual([{ ab: UMSTELLUNG_WOCHE, minuten: 45 }]);
  });

  it("Wochen VOR der Umstellungswoche haben kein Ziel - „die vergangenen Wochen zählen natürlich nicht\"", () => {
    const kind = kindWochenzielAusFeldern({ goalMinutes: 15, goalUnits: 3 });
    const vorherigeWoche = new Date(2026, 8, 7, 8, 0, 0).getTime(); // Montag 07.09.2026 - eine Woche vor 2026-W38
    const umstellungsWoche = new Date(2026, 8, 14, 8, 0, 0).getTime(); // Montag 14.09.2026 - die Woche 2026-W38 selbst
    expect(isoWeekKey(umstellungsWoche)).toBe(UMSTELLUNG_WOCHE);
    expect(zielFuerWoche(kind.verlauf, isoWeekKey(vorherigeWoche))).toBe(0);
    expect(zielFuerWoche(kind.verlauf, isoWeekKey(umstellungsWoche))).toBe(45);
  });

  it("kein altes Ziel gesetzt (0 oder fehlend) ⇒ leerer Verlauf, nicht umgerechnet", () => {
    expect(kindWochenzielAusFeldern({}).verlauf).toEqual([]);
    expect(kindWochenzielAusFeldern({ goalMinutes: 0, goalUnits: 3 }).verlauf).toEqual([]);
    expect(kindWochenzielAusFeldern({ goalMinutes: 15, goalUnits: 0 }).verlauf).toEqual([]);
  });

  it("ein fehlender/kaputter wochenzielVerlauf fällt auf die Alt-Felder zurück", () => {
    for (const kaputt of [undefined, null, "garbage", 42, [], [{ foo: 1 }, "nonsense", 42]]) {
      const kind = kindWochenzielAusFeldern({ wochenzielVerlauf: kaputt, goalMinutes: 20, goalUnits: 2 });
      expect(kind.verlauf).toEqual([{ ab: UMSTELLUNG_WOCHE, minuten: 40 }]);
    }
  });

  it("übernimmt die restlichen Felder (Wochen, Nachholen, Erlassen, Reset)", () => {
    const kind = kindWochenzielAusFeldern({
      goalMinutes: 10,
      goalUnits: 1,
      goalWeeks: [woche(0).key],
      goalCatchUp: true,
      goalExcusedWeeks: [woche(1).key],
      goalResetWeek: woche(2).key,
    });
    expect(kind.wochen).toEqual([woche(0).key]);
    expect(kind.nachholen).toBe(true);
    expect(kind.erlasseneWochen).toEqual([woche(1).key]);
    expect(kind.zurueckgesetztAb).toBe(woche(2).key);
  });
});

describe("Wochenziel NEU - Text fürs Popup bei Zieländerung", () => {
  it("Montag 07:00 (vor der 8-Uhr-Grenze) - „ab Montag\" nennt DENSELBEN Tag", () => {
    const jetzt = woche(1).start - 1 * 3_600_000; // Montag 07:00 dieser Woche
    const text = zielAenderungsText(60, jetzt);
    const montag = new Date(woche(1).start); // dieselbe Woche beginnt ja erst um 8 Uhr
    const datum = `${String(montag.getDate()).padStart(2, "0")}.${String(
      montag.getMonth() + 1,
    ).padStart(2, "0")}.`;
    expect(text).toBe(
      `Das neue Ziel von 60 Minuten pro Woche gilt ab Montag, ${datum}, 8:00 Uhr. ` +
        `Bis dahin gilt das bisherige Ziel.`,
    );
  });

  it("Montag 09:00 (nach der 8-Uhr-Grenze) - „ab Montag\" nennt den NÄCHSTEN Montag", () => {
    const jetzt = woche(1).start + 1 * 3_600_000; // Montag 09:00 dieser Woche
    const text = zielAenderungsText(60, jetzt);
    const naechsterMontag = new Date(woche(2).start); // eine ganze Woche später
    const datum = `${String(naechsterMontag.getDate()).padStart(2, "0")}.${String(
      naechsterMontag.getMonth() + 1,
    ).padStart(2, "0")}.`;
    expect(text).toBe(
      `Das neue Ziel von 60 Minuten pro Woche gilt ab Montag, ${datum}, 8:00 Uhr. ` +
        `Bis dahin gilt das bisherige Ziel.`,
    );
  });

  it("echte Umlaute, kein Gedankenstrich", () => {
    const text = zielAenderungsText(60, woche(1).start);
    expect(text).not.toMatch(/[–—]/);
    expect(text).toContain("bisherige");
    expect(text).toMatch(/Bis dahin gilt das bisherige Ziel\./);
  });
});

describe("Wochenziel NEU - wochenzielVerlauf: normale Woche", () => {
  it("eine einzelne Ziel-Woche mit teilweise erreichtem Ziel", () => {
    const ziel = kindZiel(60);
    const events = [ev(woche(0).start + 9 * 3_600_000, 25)]; // Montag 17:00, 25 min
    const [w] = wochenzielVerlauf(events, ziel, woche(0).start, woche(0).start);
    expect(w).toMatchObject({
      woche: woche(0).key,
      ziel: 60,
      geuebt: 25,
      erfuellt: 25,
      offen: 35,
      erlassen: false,
      zielwoche: true,
    });
  });

  it("kein Wochenziel gesetzt (0) ⇒ keine Ziel-Woche, aber Übezeit wird trotzdem gezeigt", () => {
    const ziel = kindZiel(0);
    const events = [ev(woche(0).start + 9 * 3_600_000, 40)];
    const [w] = wochenzielVerlauf(events, ziel, woche(0).start, woche(0).start);
    expect(w.zielwoche).toBe(false);
    expect(w.ziel).toBe(0);
    expect(w.geuebt).toBe(40);
    expect(w.erfuellt).toBe(0);
    expect(w.offen).toBe(0);
  });
});

describe("Wochenziel NEU - Zieländerung mitten im Zeitraum (Zielverlauf-Feld)", () => {
  it("die Wechsel-Woche behält ihr altes Ziel, erst die Folgewoche zählt schon das neue", () => {
    // 30 Min/Woche bis EINSCHLIESSLICH Woche 2, ab Woche 3 60 Min/Woche - so,
    // wie zielAendern das mitten in Woche 2 auch geschrieben hätte.
    const verlauf: ZielAbschnitt[] = [
      { ab: IMMER_AB, minuten: 30 },
      { ab: woche(3).key, minuten: 60 },
    ];
    const ziel = kindZielVerlauf(verlauf);
    const events = [
      ev(woche(1).start + 9 * 3_600_000, 30), // erfüllt das ALTE Ziel (30) exakt
      ev(woche(2).start + 10 * 3_600_000, 30), // Wechsel-Woche selbst: noch Ziel 30, exakt erfüllt
      ev(woche(3).start + 9 * 3_600_000, 20), // Folgewoche: schon Ziel 60, nur 20 geübt
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(1).start, woche(3).start);
    expect(wochen[0]).toMatchObject({ ziel: 30, geuebt: 30, erfuellt: 30, offen: 0 });
    expect(wochen[1]).toMatchObject({ ziel: 30, geuebt: 30, erfuellt: 30, offen: 0 }); // die Wechsel-Woche
    expect(wochen[2]).toMatchObject({ ziel: 60, geuebt: 20, erfuellt: 20, offen: 40 }); // die Folgewoche
  });
});

describe("Wochenziel NEU - erlassene Woche", () => {
  it("zählt weder als Soll noch als Ist, obwohl geübt wurde", () => {
    const ziel = kindZiel(60, { erlasseneWochen: [woche(1).key] });
    const events = [ev(woche(1).start + 9 * 3_600_000, 20)];
    const [w] = wochenzielVerlauf(events, ziel, woche(1).start, woche(1).start);
    expect(w.erlassen).toBe(true);
    expect(w.zielwoche).toBe(false);
    expect(w.ziel).toBe(0);
    expect(w.erfuellt).toBe(0);
    expect(w.offen).toBe(0);
    // Die geübte Zeit selbst bleibt sichtbar - sie ist ja wirklich geschehen.
    expect(w.geuebt).toBe(20);
    // Isoliert betrachtet gibt es für diese Woche gar kein Soll ⇒ null, nicht 0 %.
    expect(erfuellungProzent([w])).toBeNull();
  });
});

describe("Wochenziel NEU - Überfällige zurücksetzen", () => {
  it("Wochen vor der Stichwoche sind aus der Rechnung - kein Rückstand mehr", () => {
    const ziel = kindZiel(60, { nachholen: true, zurueckgesetztAb: woche(3).key });
    const events = [
      // Woche 0-2: nichts geübt (wäre ohne Reset ein grosser Rückstand).
      ev(woche(3).start + 9 * 3_600_000, 90), // Woche 3: 90 min geübt, Ziel 60
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(3).start);
    for (const w of wochen.slice(0, 3)) {
      expect(w.zielwoche).toBe(false);
      expect(w.ziel).toBe(0);
    }
    // Woche 3 zählt normal - der Überschuss hat NICHTS aufzufüllen (keine
    // offene Woche vor ihr, weil die zurückgesetzten Wochen nie in die
    // Warteschlange kamen).
    expect(wochen[3]).toMatchObject({ ziel: 60, geuebt: 90, erfuellt: 60, offen: 0 });
  });
});

describe("Wochenziel NEU - Nachholen", () => {
  it("AUS: eine offene Woche bleibt offen, auch wenn später mehr geübt wird", () => {
    const ziel = kindZiel(60, { nachholen: false });
    const events = [
      ev(woche(0).start + 9 * 3_600_000, 20), // Woche 0: 20 von 60 - 40 offen
      ev(woche(1).start + 9 * 3_600_000, 100), // Woche 1: 100 von 60 - Überschuss 40
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(1).start);
    expect(wochen[0]).toMatchObject({ geuebt: 20, erfuellt: 20, offen: 40 });
    expect(wochen[1]).toMatchObject({ geuebt: 100, erfuellt: 60, offen: 0 }); // eigenes Ziel gedeckelt
  });

  it("AN: der Überschuss füllt die offene FRÜHERE Woche auf, nie über deren eigenes Ziel", () => {
    const ziel = kindZiel(60, { nachholen: true });
    const events = [
      ev(woche(0).start + 9 * 3_600_000, 20), // Woche 0: 20 von 60 - 40 offen
      ev(woche(1).start + 9 * 3_600_000, 100), // Woche 1: 100 von 60 - Überschuss 40
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(1).start);
    expect(wochen[0]).toMatchObject({ geuebt: 20, erfuellt: 60, offen: 0 }); // 20 + 40 Nachholen = 60, nicht mehr
    expect(wochen[1]).toMatchObject({ geuebt: 100, erfuellt: 60, offen: 0 }); // eigenes Ziel bleibt bei 60
  });

  it("AN: reicht der Überschuss nicht für die ganze Lücke, bleibt ein Rest offen", () => {
    const ziel = kindZiel(60, { nachholen: true });
    const events = [
      ev(woche(0).start + 9 * 3_600_000, 10), // 50 offen
      ev(woche(1).start + 9 * 3_600_000, 90), // Überschuss 30
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(1).start);
    expect(wochen[0]).toMatchObject({ erfuellt: 40, offen: 20 }); // 10 + 30
    expect(wochen[1]).toMatchObject({ erfuellt: 60, offen: 0 });
  });

  it("AN: ÄLTESTE offene Woche zuerst - eine zweite Lücke bleibt, bis auch sie an der Reihe ist", () => {
    const ziel = kindZiel(60, { nachholen: true });
    const events = [
      ev(woche(0).start + 9 * 3_600_000, 10), // Woche 0: 50 offen (älteste)
      ev(woche(1).start + 9 * 3_600_000, 30), // Woche 1: 30 offen
      ev(woche(2).start + 9 * 3_600_000, 200), // Woche 2: Überschuss 140
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(2).start);
    // 140 Überschuss: erst die 50 von Woche 0, dann die 30 von Woche 1, Rest 60 bleibt bei Woche 2 (Deckel).
    expect(wochen[0]).toMatchObject({ erfuellt: 60, offen: 0 });
    expect(wochen[1]).toMatchObject({ erfuellt: 60, offen: 0 });
    expect(wochen[2]).toMatchObject({ geuebt: 200, erfuellt: 60, offen: 0 });
  });

  it("AN: eine Woche OHNE eigenes Ziel gibt ihre GANZE geübte Zeit als Überschuss weiter (nie gegen ein Kind)", () => {
    // Nur Woche 0 ist Ziel-Woche; Woche 1 ist eine Ferienwoche (nicht
    // gewählt) - wer dort trotzdem übt, soll damit die offene Woche 0 füllen.
    const ziel = kindZiel(60, { wochen: [woche(0).key], nachholen: true });
    const events = [
      ev(woche(0).start + 9 * 3_600_000, 20), // 40 offen
      ev(woche(1).start + 9 * 3_600_000, 40), // Ferienwoche, ganz als Überschuss
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(1).start);
    expect(wochen[0]).toMatchObject({ ziel: 60, geuebt: 20, erfuellt: 60, offen: 0 });
    // Die Ferienwoche selbst bleibt bei 0/0/0 stehen - nur ihr Überschuss wanderte weiter.
    expect(wochen[1]).toMatchObject({ zielwoche: false, ziel: 0, geuebt: 40, erfuellt: 0, offen: 0 });
  });

  it("AN: Wochen vor zurueckgesetztAb (oder vor dem ersten Abschnitt) bleiben NIE füllbar", () => {
    const ziel = kindZiel(60, { nachholen: true, zurueckgesetztAb: woche(1).key });
    const events = [
      ev(woche(0).start + 9 * 3_600_000, 50), // vor dem Reset - hätte sonst 50 Überschuss
      ev(woche(1).start + 9 * 3_600_000, 20), // 40 offen
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(1).start);
    expect(wochen[0]).toMatchObject({ zielwoche: false, ziel: 0, erfuellt: 0, offen: 0 });
    // Woche 1 bleibt bei ihrem eigenen Stand - die 50 aus Woche 0 füllen NICHTS,
    // weil Woche 0 (ziel 0) nie in die Warteschlange kam.
    expect(wochen[1]).toMatchObject({ ziel: 60, geuebt: 20, erfuellt: 20, offen: 40 });
  });
});

describe("Wochenziel NEU - Ziel nur in ausgewählten Wochen", () => {
  it("eine nicht gewählte Woche ist keine Ziel-Woche, auch wenn geübt wurde", () => {
    const ziel = kindZiel(60, { wochen: [woche(0).key, woche(2).key] });
    const events = [
      ev(woche(0).start + 9 * 3_600_000, 60),
      ev(woche(1).start + 9 * 3_600_000, 60), // nicht gewählt
      ev(woche(2).start + 9 * 3_600_000, 30),
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(2).start);
    expect(wochen[0].zielwoche).toBe(true);
    expect(wochen[1].zielwoche).toBe(false);
    expect(wochen[1].ziel).toBe(0);
    expect(wochen[2].zielwoche).toBe(true);
    // Die Erfüllung zählt nur über die zwei gewählten Wochen: (60+30)/(60+60).
    expect(erfuellungProzent(wochen)).toBeCloseTo(90 / 120);
  });
});

describe("Wochenziel NEU - gesperrte Zeiträume (Klasse, vierte Review-Runde: Zeitraum statt Marke)", () => {
  it("ein Ereignis MITTEN in einem gesperrten Zeitraum zählt nicht fürs Wochenziel, wohl aber für die Gesamt-Übezeit", () => {
    const ziel = kindZiel(60);
    const sperrbeginn = woche(0).start + 10 * 3_600_000;
    const events: TaskEvent[] = [
      ev(woche(0).start + 9 * 3_600_000, 15),
      ev(sperrbeginn + 5 * MIN, 45), // während der Sperrstunde
    ];
    const gesperrt: GesperrteZeit[] = [{ abMs: sperrbeginn, bisMs: sperrbeginn + 60 * MIN }];
    const [w] = wochenzielVerlauf(events, ziel, woche(0).start, woche(0).start, gesperrt);
    expect(w.geuebt).toBe(15); // die gesperrten 45 min fehlen hier
    expect(w.erfuellt).toBe(15);
    expect(w.offen).toBe(45);

    const gesamtOhneFilter = [...buildDayPractice(events).values()].reduce(
      (s, d) => s + d.minutes,
      0,
    );
    expect(gesamtOhneFilter).toBe(60); // 15 + 45, nichts ging verloren
  });

  it("abMs ist INKLUSIVE - ein Ereignis genau am Anfang der Sperre zählt schon nicht mehr", () => {
    const ziel = kindZiel(30);
    const abMs = woche(0).start + 10 * 3_600_000;
    const events = [ev(abMs, 10)];
    const gesperrt: GesperrteZeit[] = [{ abMs, bisMs: abMs + 60 * MIN }];
    const [w] = wochenzielVerlauf(events, ziel, woche(0).start, woche(0).start, gesperrt);
    expect(w.geuebt).toBe(0);
  });

  it("bisMs ist EXKLUSIV - ein Ereignis genau am Ende der Sperre zählt schon wieder", () => {
    const ziel = kindZiel(30);
    const bisMs = woche(0).start + 11 * 3_600_000;
    const events = [ev(bisMs, 10)];
    const gesperrt: GesperrteZeit[] = [{ abMs: bisMs - 60 * MIN, bisMs }];
    const [w] = wochenzielVerlauf(events, ziel, woche(0).start, woche(0).start, gesperrt);
    expect(w.geuebt).toBe(10);
  });

  it("mehrere, auch ÜBERLAPPENDE Sperr-Zeiträume schliessen zusammen den ganzen betroffenen Bereich aus", () => {
    const ziel = kindZiel(60);
    const t0 = woche(0).start + 9 * 3_600_000;
    const events = [
      ev(t0, 10), // nur in Sperre 1
      ev(t0 + 30 * MIN, 10), // in BEIDEN Sperren (Überlappung)
      ev(t0 + 70 * MIN, 10), // nur in Sperre 2
      ev(t0 + 200 * MIN, 10), // ausserhalb jeder Sperre - zählt
    ];
    const gesperrt: GesperrteZeit[] = [
      { abMs: t0, bisMs: t0 + 40 * MIN },
      { abMs: t0 + 20 * MIN, bisMs: t0 + 80 * MIN },
    ];
    const [w] = wochenzielVerlauf(events, ziel, woche(0).start, woche(0).start, gesperrt);
    expect(w.geuebt).toBe(10); // nur das letzte, ungesperrte Ereignis
  });

  it("leere Liste (Standard, kein Parameter) = altes Verhalten - nichts wird ausgeschlossen", () => {
    const ziel = kindZiel(60);
    const events = [ev(woche(0).start + 9 * 3_600_000, 25)];
    const [ohneParameter] = wochenzielVerlauf(events, ziel, woche(0).start, woche(0).start);
    const [mitLeererListe] = wochenzielVerlauf(events, ziel, woche(0).start, woche(0).start, []);
    expect(ohneParameter.geuebt).toBe(25);
    expect(mitLeererListe.geuebt).toBe(25);
  });

  it("aktuelleWoche reicht `gesperrt` unverändert weiter", () => {
    const ziel = kindZiel(60);
    const abMs = woche(0).start + 9 * 3_600_000;
    const events = [ev(abMs, 20)];
    const jetzt = woche(0).start + 12 * 3_600_000;
    const gesperrt: GesperrteZeit[] = [{ abMs, bisMs: abMs + 30 * MIN }];
    expect(aktuelleWoche(events, ziel, jetzt, gesperrt).geuebtMin).toBe(0);
    expect(aktuelleWoche(events, ziel, jetzt).geuebtMin).toBe(20); // ohne Sperre: zählt normal
  });
});

describe("Wochenziel NEU - inGesperrterZeit", () => {
  it("abMs inklusive, bisMs exklusiv", () => {
    const zeitraum: GesperrteZeit = { abMs: 1000, bisMs: 2000 };
    expect(inGesperrterZeit(999, [zeitraum])).toBe(false);
    expect(inGesperrterZeit(1000, [zeitraum])).toBe(true);
    expect(inGesperrterZeit(1999, [zeitraum])).toBe(true);
    expect(inGesperrterZeit(2000, [zeitraum])).toBe(false);
  });

  it("leere Liste sperrt nichts", () => {
    expect(inGesperrterZeit(1500, [])).toBe(false);
  });
});

describe("Wochenziel NEU - Erfüllung in Prozent: 87 %-Beispiel", () => {
  it("vier Ziel-Wochen à 25 Minuten, 87 der 100 Soll-Minuten erfüllt", () => {
    const ziel = kindZiel(25);
    const events = [
      ev(woche(0).start + 9 * 3_600_000, 25), // voll
      ev(woche(1).start + 9 * 3_600_000, 25), // voll
      ev(woche(2).start + 9 * 3_600_000, 25), // voll
      ev(woche(3).start + 9 * 3_600_000, 12), // 12 von 25
    ];
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(3).start);
    const anteil = erfuellungProzent(wochen);
    expect(anteil).toBeCloseTo(0.87, 10);
    expect(prozentAnzeige(anteil)).toBe("87 %");
  });

  it("rundet ,5 aufwärts (dokumentiertes Verhalten von prozentAnzeige)", () => {
    expect(prozentAnzeige(0.875)).toBe("88 %");
    expect(prozentAnzeige(0.005)).toBe("1 %"); // 0,5 % rundet auf
  });

  it("keine Ziel-Woche im Bereich ⇒ null statt Division durch 0", () => {
    const ziel = kindZiel(0); // kein Wochenziel gesetzt
    const wochen = wochenzielVerlauf([], ziel, woche(0).start, woche(3).start);
    expect(erfuellungProzent(wochen)).toBeNull();
    expect(prozentAnzeige(erfuellungProzent(wochen))).toBe("-");
  });
});

describe("Wochenziel NEU - aktuelle Woche (Kind-Ansicht)", () => {
  it('liefert geuebtMin/zielMin/rest für „25 von 60 Min."', () => {
    const ziel = kindZiel(60);
    const events = [ev(woche(0).start + 9 * 3_600_000, 25)];
    const jetzt = woche(0).start + 12 * 3_600_000; // Montagabend derselben Woche
    const stand = aktuelleWoche(events, ziel, jetzt);
    expect(stand).toEqual({ geuebtMin: 25, zielMin: 60, rest: 35 });
  });
});

describe("Wochenziel NEU - Wochengrenze Montag 08:00 (Review, dritte Runde)", () => {
  it("Montag 07:30 gehört noch zur VORIGEN Woche", () => {
    const ziel = kindZiel(30);
    const events = [ev(woche(1).start - 30 * MIN, 10)]; // Montag 07:30 der Woche 1
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(1).start);
    expect(wochen[0].geuebt).toBe(10); // Woche 0 (die vorige)
    expect(wochen[1].geuebt).toBe(0); // Woche 1 (die neue) - noch nichts
  });

  it("Montag 08:30 gehört schon zur NEUEN Woche", () => {
    const ziel = kindZiel(30);
    const events = [ev(woche(1).start + 30 * MIN, 10)]; // Montag 08:30 der Woche 1
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(1).start);
    expect(wochen[0].geuebt).toBe(0); // Woche 0 - nichts mehr
    expect(wochen[1].geuebt).toBe(10); // Woche 1 - schon die neue
  });

  it("Montag 08:00:00 genau gehört schon zur neuen Woche (die Grenze selbst zählt vorwärts)", () => {
    const ziel = kindZiel(30);
    const events = [ev(woche(1).start, 10)]; // exakt Montag 08:00:00
    const wochen = wochenzielVerlauf(events, ziel, woche(0).start, woche(1).start);
    expect(wochen[0].geuebt).toBe(0);
    expect(wochen[1].geuebt).toBe(10);
  });

  it("vonMs/bisMs auf einem Montag 07:00 landen noch in der VORIGEN Woche", () => {
    const montag0700 = woche(1).start - 1 * 3_600_000;
    const ziel = kindZiel(30);
    const events = [ev(woche(0).start + 9 * 3_600_000, 10)];
    // Der Zeitraum beginnt UND endet an diesem Montag 07:00 - das muss die
    // Woche VOR diesem Montag treffen (Woche 0), nicht Woche 1.
    const wochen = wochenzielVerlauf(events, ziel, montag0700, montag0700);
    expect(wochen).toHaveLength(1);
    expect(wochen[0].woche).toBe(woche(0).key);
    expect(wochen[0].geuebt).toBe(10);
  });
});

describe("Wochenziel NEU - Wochengrenze über die Sommer-/Winterzeit-Umstellung (DST)", () => {
  /**
   * ⚠️⚠️ Review, dritte Runde: `wochenStartMs + 7 * 86_400_000` (rohe
   * Millisekunden) träfe in der Umstellungswoche NICHT mehr 08:00, sondern
   * 07:00 (Frühjahr, eine Stunde fehlt) oder 09:00 (Herbst, eine Stunde ist
   * zu viel) - dieselbe Falle, die `wochenAnfaengeZwischen` schon immer per
   * `setDate` umgeht. Diese Prüfung bestätigt an ECHTEN Umstellungsdaten:
   * jeder Übungs-Zeitpunkt landet in GENAU einer Woche, die Summe über alle
   * Wochen ergibt exakt die eingegebene Gesamtzeit - keine Lücke, keine
   * Dopplung.
   */
  function baueTaeglicheEreignisse(
    vonTag: [number, number, number],
    bisTag: [number, number, number],
  ): { events: TaskEvent[]; minutenJeEreignis: number; anzahlTage: number } {
    const minutenJeEreignis = 10;
    const zeitenProTag: [number, number][] = [
      [7, 30], // vor der 8-Uhr-Grenze (am Montag: vorige Woche)
      [8, 30], // nach der 8-Uhr-Grenze (am Montag: neue Woche)
      [14, 0], // Nachmittag, unabhängig von der Grenze
    ];
    const [by, bm, bd] = bisTag;
    const bisMs = new Date(by, bm - 1, bd, 23, 59, 0).getTime();
    const tag = new Date(vonTag[0], vonTag[1] - 1, vonTag[2], 0, 0, 0);
    const events: TaskEvent[] = [];
    let anzahlTage = 0;
    while (tag.getTime() <= bisMs) {
      for (const [h, m] of zeitenProTag) {
        const ts = new Date(tag.getFullYear(), tag.getMonth(), tag.getDate(), h, m, 0).getTime();
        events.push(ev(ts, minutenJeEreignis));
      }
      anzahlTage += 1;
      tag.setDate(tag.getDate() + 1);
    }
    return { events, minutenJeEreignis, anzahlTage };
  }

  function pruefeKeineLueckeKeineDopplung(
    vonTag: [number, number, number],
    bisTag: [number, number, number],
  ) {
    const { events, minutenJeEreignis, anzahlTage } = baueTaeglicheEreignisse(vonTag, bisTag);
    const ziel = kindZiel(0); // Ziel irrelevant - geprüft wird nur `geuebt` (immer echt, siehe WochenErgebnis)
    const [vy, vm, vd] = vonTag;
    const [by, bm, bd] = bisTag;
    // Grosszügiger Rand, damit KEIN Ereignis ausserhalb des geprüften Bereichs fällt.
    const vonMs = new Date(vy, vm - 1, vd - 2).getTime();
    const bisMs = new Date(by, bm - 1, bd + 2).getTime();
    const wochen = wochenzielVerlauf(events, ziel, vonMs, bisMs);
    const summe = wochen.reduce((s, w) => s + w.geuebt, 0);
    expect(summe).toBeCloseTo(anzahlTage * 3 * minutenJeEreignis, 6);
  }

  it("Frühjahr: die Woche um den 29.03.2027 (Umstellung Sa/So 27./28.03.2027)", () => {
    pruefeKeineLueckeKeineDopplung([2027, 3, 15], [2027, 4, 11]);
  });

  it("Herbst: die Woche um den 25.10.2026 (Umstellung So 25.10.2026)", () => {
    pruefeKeineLueckeKeineDopplung([2026, 10, 11], [2026, 11, 8]);
  });
});
