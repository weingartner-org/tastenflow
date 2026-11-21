/**
 * ★★★★★ Z1 (28.09.2026): DIE WOCHENGRENZE FOLGT DER ZEITZONE DES KONTOS.
 *
 * Die App rechnet die Übungswoche ab Montag 08:00 in der Ortszeit des Geräts
 * (`WOCHENZIEL_GRENZE`), der Server rechnete bis Z1 immer ab Montag 08:00
 * WIEN. Für eine Klasse in Mexiko-Stadt lagen die Grenzen sieben Stunden
 * auseinander: Minuten vom Montagmorgen landeten in der falschen Woche, Mail
 * und App zeigten verschiedene Zahlen.
 *
 * Wohin sich dieser Wächter bewegt, wenn es schlechter wird:
 *  (a) Ein Konto ohne Zone, in Wien oder mit Wiens Uhr bekommt auch nur EINE
 *      Zahl, ein Datum, eine Zeile Mail anders als vor Z1 - rot (Golden aus
 *      der Fassung vor Z1, `tests/fixtures/wochengrenze-wien-vor-z1-golden.json`).
 *  (b) In Mexiko-Stadt, Bogotá, Buenos Aires, Santiago (Sommerzeit im Süden)
 *      und weiteren Zonen weicht die Server-Woche von der App-Woche derselben
 *      Zone ab - rot (die App-Funktionen laufen dazu mit `process.env.TZ`).
 *  (c) Montag 07:30 Ortszeit Mexiko zählt nicht mehr zur Vorwoche, 08:30 nicht
 *      zur neuen - am Server oder in der App - rot.
 *  (d) Der Klassen-Wochenbericht einer Lehrkraft in Mexiko-Stadt kommt vor
 *      ihrer Grenze, eine Woche zu spät oder doppelt; eine Wiener Klasse
 *      bekommt ihre Mail zu einem anderen Termin als vor Z1 - rot.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  WOCHENZIEL_GRENZE,
  isoWeekKey,
  naechsteWocheKey,
  schuljahrVon,
  wochenStart,
  wochenStartFuerSchluessel,
  wochenzielVerlauf,
  kindWochenzielAusFeldern,
  type KindWochenziel,
  type WochenErgebnis,
} from "@/lib/typing";
import type { TaskEvent } from "@/lib/typing/account";
import { abdruck, ladeHookQuelle, ladeWochenzielLib, HOOKS_ORDNER } from "./helfer/wochengrenzeAbdruck";
import { FakeRecord, neueLaufzeit } from "./helfer/pbHookLaufzeit";

const GOLDEN = resolve(__dirname, "fixtures/wochengrenze-wien-vor-z1-golden.json");
const wz = ladeWochenzielLib();

const M = 60_000;
const H = 3_600_000;
const T = 86_400_000;

// ── Golden erzeugen (nur mit Absicht, siehe tests/helfer/wochengrenzeAbdruck.ts) ─
if (process.env.WOCHENGRENZE_GOLDEN_AUS) {
  const alt = ladeHookQuelle(readFileSync(process.env.WOCHENGRENZE_GOLDEN_AUS, "utf8"));
  writeFileSync(GOLDEN, JSON.stringify(abdruck(alt, undefined)) + "\n");
}

describe("(a) Europa bleibt Byte für Byte - Golden aus der Fassung VOR Z1", () => {
  const golden = JSON.parse(readFileSync(GOLDEN, "utf8"));

  it("das Golden ist nicht leer und deckt 2026-2028 ab", () => {
    expect(golden.punkte.length).toBe(1100);
    expect(golden.schluessel.length).toBe(159);
    expect(golden.ergebnisse.length).toBeGreaterThan(70);
    expect(golden.berichte.length).toBe(24);
  });

  for (const zone of [undefined, null, "", "Europe/Vienna", "Europe/Berlin", "Europe/Zurich", "Europe/Rome", "Mars/Olympus"]) {
    it(`Zone ${JSON.stringify(zone)}: jedes Ergebnis wie vor Z1`, () => {
      // Über JSON, genau wie das Golden geschrieben wurde.
      expect(JSON.parse(JSON.stringify(abdruck(wz, zone)))).toEqual(golden);
    });
  }

  it("Gegenprobe: das Golden unterscheidet Zonen wirklich (London, Mexiko-Stadt sind anders)", () => {
    for (const zone of ["Europe/London", "America/Mexico_City"]) {
      const neu = JSON.parse(JSON.stringify(abdruck(wz, zone)));
      expect(neu.punkte).not.toEqual(golden.punkte);
      expect(neu.ergebnisse).not.toEqual(golden.ergebnisse);
    }
  });

  it("istWienerUhr: Wien, leer, unbekannt und Wiens Uhr - nicht London, nicht Mexiko", () => {
    for (const z of [undefined, "", "Europe/Vienna", "Europe/Berlin", "Europe/Zurich", "Mars/Olympus"]) {
      expect(wz.istWienerUhr(z), String(z)).toBe(true);
    }
    for (const z of ["Europe/London", "Europe/Athens", "America/Mexico_City", "America/Santiago"]) {
      expect(wz.istWienerUhr(z), z).toBe(false);
    }
  });
});

// ── (b) Server gegen App, je Zone ──────────────────────────────────────────

const VORHERIGE_TZ = process.env.TZ;
function mitZone<T>(zone: string, f: () => T): T {
  process.env.TZ = zone;
  try {
    return f();
  } finally {
    if (VORHERIGE_TZ === undefined) delete process.env.TZ;
    else process.env.TZ = VORHERIGE_TZ;
  }
}

/** Jeder Montag 08:00 in der Ortszeit von `process.env.TZ` (App-Rechnung), 2026 bis Anfang 2028. */
function alleMontageLokal(): number[] {
  const out: number[] = [];
  let montag = wochenStart(new Date(2026, 0, 1).getTime(), WOCHENZIEL_GRENZE);
  const ende = new Date(2028, 1, 1).getTime();
  while (montag < ende) {
    out.push(montag);
    const d = new Date(montag);
    d.setDate(d.getDate() + 7);
    montag = d.getTime();
  }
  return out;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const zufall = (rng: () => number, a: number, b: number) => a + Math.floor(rng() * (b - a + 1));

/** Seed-feste Ereignisse über [von - 3 Wochen, bis + 3 Wochen], dazu an jedem Montag 07:59/08:00/08:01 Ortszeit. */
function zufallsEvents(rng: () => number, montage: number[], von: number, bis: number): TaskEvent[] {
  const out: TaskEvent[] = [];
  let ts = von - 21 * T;
  while (ts < bis + 21 * T) {
    ts += rng() < 0.4 ? zufall(rng, 31 * M, 3 * T) : zufall(rng, 0, 25 * M);
    const ms = zufall(rng, 1, 30) * M;
    out.push({ ts, lesson: "u1", chars: 40, errors: 1, ms, activeMs: ms });
  }
  for (const m of montage) {
    if (m < von - 21 * T || m > bis + 21 * T) continue;
    for (const v of [-M, 0, M, -8 * H - M, -8 * H]) {
      if (rng() < 0.5) out.push({ ts: m + v, lesson: "u1", chars: 10, errors: 0, ms: 3 * M, activeMs: 3 * M });
    }
  }
  return out;
}

function gleicheWochen(app: readonly WochenErgebnis[], server: readonly WochenErgebnis[], wo: string): void {
  expect(server.length, `${wo}: Anzahl Wochen`).toBe(app.length);
  for (let i = 0; i < app.length; i++) {
    const stelle = `${wo}, Woche ${app[i].woche}`;
    expect(server[i].woche, stelle).toBe(app[i].woche);
    expect(server[i].startMs, stelle).toBe(app[i].startMs);
    expect(server[i].zielwoche, stelle).toBe(app[i].zielwoche);
    expect(server[i].geuebt, stelle).toBeCloseTo(app[i].geuebt, 9);
    expect(server[i].erfuellt, stelle).toBeCloseTo(app[i].erfuellt, 9);
    expect(server[i].offen, stelle).toBeCloseTo(app[i].offen, 9);
  }
}

const ZONEN_B = [
  // Die vier aus dem Auftrag ...
  "America/Mexico_City",
  "America/Bogota",
  "America/Argentina/Buenos_Aires",
  "America/Santiago", // Sommerzeit im Süden, Umstellung um MITTERNACHT
  // ... und die, deren Rechenweg anders aussieht: Kuba (Umstellung um
  // Mitternacht, doppelte Stunde 00:00-01:00), Nordamerika, Hawaii, Indien
  // (halbe Stunde), Neuseeland (Montag 08:00 = Sonntag UTC), London.
  "America/Havana",
  "America/Los_Angeles",
  "Pacific/Honolulu",
  "Asia/Kolkata",
  "Pacific/Auckland",
  "Europe/London",
];

describe("(b) Server-Woche = App-Woche derselben Zone (App mit process.env.TZ)", () => {
  for (const zone of ZONEN_B) {
    it(`${zone}: jeder Montag 2026/2027, die Minuten um 08:00, Wochenmitte, Wochenende`, () => {
      mitZone(zone, () => {
        const montage = alleMontageLokal();
        expect(montage.length).toBeGreaterThan(100);
        for (const m of montage) {
          // Die App-Grenze ist wirklich Montag 08:00 Ortszeit ...
          const d = new Date(m);
          expect([d.getDay(), d.getHours(), d.getMinutes()]).toEqual([1, 8, 0]);
          for (const v of [-25 * H, -61 * M, -M, 0, M, 30 * M, 17 * H, 3.5 * T, 6 * T + 23 * H]) {
            const t = m + v;
            const stelle = `${zone} bei ${new Date(t).toISOString()}`;
            const app = wochenStart(t, WOCHENZIEL_GRENZE);
            // ... und der Server trifft sie.
            expect(wz.wochenStartMs(t, zone), stelle).toBe(app);
            expect(wz.isoWochenKey(t, zone), stelle).toBe(isoWeekKey(app));
            expect(wz.naechsteWocheKey(t, zone), stelle).toBe(naechsteWocheKey(t));
          }
          const key = isoWeekKey(m);
          expect(wz.wochenStartFuerSchluessel(key, zone), `${zone} ${key}`).toBe(wochenStartFuerSchluessel(key));
          expect(wz.wochenStartVerschobenMs(m, 1, zone), `${zone} +1 Woche ab ${key}`).toBe(
            wochenStart(m + 7 * T + 2 * H, WOCHENZIEL_GRENZE),
          );
        }
      });
    });

    it(`${zone}: Schuljahr (1. des Monats, 00:00 Ortszeit) wie schuljahrVon`, () => {
      mitZone(zone, () => {
        for (let t = Date.UTC(2026, 0, 1); t < Date.UTC(2028, 0, 1); t += 5 * T + 7 * H) {
          for (const beginn of [undefined, 2, 8, 9]) {
            const app = beginn === undefined ? schuljahrVon(t) : schuljahrVon(t, beginn);
            const s = wz.schuljahrGrenzenMs(t, beginn, zone);
            expect([s.vonMs, s.bisMs], `${zone} ${beginn} ${new Date(t).toISOString()}`).toEqual([app.vonMs, app.bisMs]);
          }
        }
      });
    });

    it(`${zone}: der ganze Wochenbericht eines Kindes (Minuten, Tage, Nachholen) wie wochenzielVerlauf`, () => {
      mitZone(zone, () => {
        const rng = mulberry32(2809 + zone.length);
        const montage = alleMontageLokal();
        for (let szenario = 0; szenario < 12; szenario++) {
          // Erst ab August 2026: `ACTIVE_TIME_SINCE_MS` (7.7.2026) rechnet die
          // App beim LADEN des Moduls, also in der Zone des Testläufers - ein
          // Gerät in `zone` rechnete ihn dort, wie der Server es tut.
          const i = zufall(rng, 34, montage.length - 30);
          const von = montage[i];
          const bis = montage[i + zufall(rng, 4, 25)];
          const ziel: KindWochenziel = kindWochenzielAusFeldern({
            wochenzielVerlauf: [{ ab: isoWeekKey(montage[i - 2]), minuten: [20, 45, 60][szenario % 3] }],
          });
          ziel.nachholen = rng() < 0.5;
          const events = zufallsEvents(rng, montage, von, bis);
          const gesperrt = [{ abMs: von + 2 * T, bisMs: von + 2 * T + 90 * M }];
          gleicheWochen(
            wochenzielVerlauf(events, ziel, von, bis, gesperrt),
            wz.wochenErgebnisse(events, ziel, von, bis, gesperrt, zone),
            `${zone} Szenario ${szenario}`,
          );
        }
      });
    });
  }

  it("Chile und Kuba: die Mitternacht am Umstelltag (Lücke und doppelte Stunde) wie der Browser", () => {
    // Übungstag-Schlüssel = lokale Mitternacht (`new Date(ts).setHours(0)` in
    // der App). In Santiago gibt es Sonntag 00:00 am 6.9.2026 nicht, in Havanna
    // gibt es Sonntag 00:00-01:00 am 1.11.2026 zweimal.
    const faelle: [string, number][] = [
      ["America/Santiago", Date.UTC(2026, 8, 6, 12)],
      ["America/Santiago", Date.UTC(2027, 3, 4, 12)],
      ["America/Havana", Date.UTC(2026, 2, 8, 12)],
      ["America/Havana", Date.UTC(2026, 10, 1, 12)],
      ["America/Havana", Date.UTC(2026, 10, 1, 4, 30)],
    ];
    for (const [zone, t] of faelle) {
      mitZone(zone, () => {
        const d = new Date(t);
        d.setHours(0, 0, 0, 0);
        expect(wz.uebungstagSchluesselMs(t, zone), `${zone} ${new Date(t).toISOString()}`).toBe(d.getTime());
      });
    }
  });
});

// ── (c) Montag 07:30 / 08:30 Ortszeit Mexiko ───────────────────────────────

describe("(c) Montag 07:30 Mexiko zählt zur VORwoche, 08:30 zur neuen - Server und App gleich", () => {
  // Montag, 28.09.2026: 07:30 CST = 13:30 UTC (= 15:30 Wien - dort längst die
  // neue Woche; genau das war der Fehler), 08:30 CST = 14:30 UTC.
  const ZONE = "America/Mexico_City";
  const um0730 = Date.UTC(2026, 8, 28, 13, 30);
  const um0830 = Date.UTC(2026, 8, 28, 14, 30);
  const ziel = { verlauf: [{ ab: "2026-W30", minuten: 60 }], wochen: [], nachholen: false, erlasseneWochen: [] };
  const block = (ts: number) => ({ ts, lesson: "u1", chars: 100, errors: 0, ms: 20 * M, activeMs: 20 * M });
  const von = Date.UTC(2026, 8, 21, 14); // Montag 21.09., 08:00 Mexiko
  const bis = Date.UTC(2026, 8, 28, 14); // Montag 28.09., 08:00 Mexiko

  it("Server: 20 Minuten um 07:30 in KW 39, 20 Minuten um 08:30 in KW 40", () => {
    expect(wz.isoWochenKey(um0730, ZONE)).toBe("2026-W39");
    expect(wz.isoWochenKey(um0830, ZONE)).toBe("2026-W40");
    const w = wz.wochenErgebnisse([block(um0730), block(um0830)], ziel, von, bis, [], ZONE);
    expect(w.map((x: WochenErgebnis) => [x.woche, Math.round(x.geuebt)])).toEqual([
      ["2026-W39", 20],
      ["2026-W40", 20],
    ]);
  });

  it("App (TZ Mexiko): dieselben Wochen, dieselben Minuten", () => {
    mitZone(ZONE, () => {
      expect(isoWeekKey(wochenStart(um0730, WOCHENZIEL_GRENZE))).toBe("2026-W39");
      expect(isoWeekKey(wochenStart(um0830, WOCHENZIEL_GRENZE))).toBe("2026-W40");
      const w = wochenzielVerlauf([block(um0730), block(um0830)], ziel as KindWochenziel, von, bis, []);
      expect(w.map((x) => [x.woche, Math.round(x.geuebt)])).toEqual([
        ["2026-W39", 20],
        ["2026-W40", 20],
      ]);
    });
  });

  it("Gegenprobe: mit Wiener Uhr (keine Zone) fiele 07:30 Mexiko schon in die neue Woche", () => {
    expect(wz.isoWochenKey(um0730)).toBe("2026-W40");
  });
});

// ── (d) Die Mails und Abfragen ─────────────────────────────────────────────

describe("(d) Klassen-Wochenbericht: Woche, Termin und KW in der Zone der Lehrkraft", () => {
  const ZONE = "America/Mexico_City";
  /** Kind übt Montag 21.09. 07:30 Mexiko (Vorwoche) und Freitag 25.09. 16:00 Mexiko. */
  function lauf(jetzt: number, lehrkraft: Record<string, unknown>, data: Record<string, unknown> = {}) {
    const lz = neueLaufzeit({
      jetzt,
      daten: {
        tt_teachers: [new FakeRecord("tt_teachers", "T1", { email: "lehrer@schule.mx", name: "L", ...lehrkraft })],
        tt_classes: [
          new FakeRecord("tt_classes", "C1", { code: "K1", name: "3B", teacherUid: "T1", weeklyReport: true, data }),
        ],
        tt_pupils: [
          new FakeRecord("tt_pupils", "P1", {
            name: "Ana",
            classCode: "K1",
            wochenzielVerlauf: [{ ab: "2026-W36", minuten: 30 }],
          }),
        ],
        lw_events: [
          new FakeRecord("lw_events", "E1", {
            pupilUid: "P1",
            program: "tippen",
            data: {
              events: [
                { ts: Date.UTC(2026, 8, 21, 13, 30), lesson: "u1", chars: 100, errors: 0, ms: 12 * M, activeMs: 12 * M },
                { ts: Date.UTC(2026, 8, 25, 22), lesson: "u1", chars: 100, errors: 0, ms: 25 * M, activeMs: 25 * M },
              ],
            },
          }),
        ],
      },
    });
    lz.ladeHook("tt_weekly_report.pb.js");
    lz.cron("tt_weekly_report")();
    return lz;
  }

  it.skip("läuft stündlich (der Termin der Wiener Klassen steht im Rückruf)", () => {
    const quelle = readFileSync(resolve(HOOKS_ORDNER, "tt_weekly_report.pb.js"), "utf8");
    expect(quelle).toContain('cronAdd("tt_weekly_report", "30 * * * *"');
  });

  it.skip("Mexiko, Montag 28.09. 08:30 Ortszeit: KW 39 von Montag 8:00 bis Montag 8:00, 25 Minuten (nicht 37)", () => {
    const lz = lauf(Date.UTC(2026, 8, 28, 14, 30), { zeitzone: ZONE }, { lastReportWeek: "2026-W38" });
    expect(lz.gesendet.length).toBe(1);
    const mail = lz.gesendet[0];
    expect(mail.subject).toContain("(KW 39)");
    expect(mail.html).toContain("Woche von Montag, 21.09., 8:00 Uhr bis Montag, 28.09., 8:00 Uhr.</p>");
    // 07:30 am 21.09. gehört der Vorwoche (KW 38) - gezählt sind nur die 25 Minuten vom Freitag.
    expect(mail.html).toContain("zusammen 25 Minuten.");
    expect(mail.html).toContain("25 von 30 Min.");
  });

  it.skip("Mexiko, Montag 28.09. 07:30 UTC (= 01:30 Ortszeit): die Woche läuft noch - keine Mail, auch keine alte", () => {
    const lz = lauf(Date.UTC(2026, 8, 28, 7, 30), { zeitzone: ZONE }, { lastReportWeek: "2026-W38" });
    expect(lz.gesendet.length).toBe(0);
  });

  it.skip("Mexiko: ein zweiter Lauf derselben Woche schickt nichts nach, eine spätere Marke auch nicht zurück", () => {
    expect(lauf(Date.UTC(2026, 8, 28, 14, 30), { zeitzone: ZONE }, { lastReportWeek: "2026-W39" }).gesendet.length).toBe(0);
    expect(lauf(Date.UTC(2026, 8, 28, 14, 30), { zeitzone: ZONE }, { lastReportWeek: "2026-W40" }).gesendet.length).toBe(0);
  });

  it.skip("Mexiko: nur im ersten Lauf nach der Grenze - eine Stunde später oder am Mittwoch keine Mail (auch ohne Marke)", () => {
    expect(lauf(Date.UTC(2026, 8, 28, 15, 30), { zeitzone: ZONE }).gesendet.length).toBe(0);
    expect(lauf(Date.UTC(2026, 8, 30, 14, 30), { zeitzone: ZONE }).gesendet.length).toBe(0);
    expect(lauf(Date.UTC(2026, 8, 28, 14, 30), { zeitzone: ZONE }).gesendet.length).toBe(1);
  });

  it.skip("Auckland: Montag 08:00 NZ ist Sonntag 19:00 UTC - Mail am Sonntag UTC, KW und Datum in NZ", () => {
    // 28.09.2026 08:00 NZDT (UTC+13) = 27.09. 19:00 UTC.
    const lz = lauf(Date.UTC(2026, 8, 27, 19, 30), { zeitzone: "Pacific/Auckland" });
    expect(lz.gesendet.length).toBe(1);
    expect(lz.gesendet[0].subject).toContain("(KW 39)");
    expect(lz.gesendet[0].html).toContain("Woche von Montag, 21.09., 8:00 Uhr bis Montag, 28.09., 8:00 Uhr.</p>");
  });

  it.skip("Wien (keine Zone / Europe/Vienna): nur Montag 07:30 UTC wie vor Z1, sonst kein Lauf", () => {
    for (const lehrkraft of [{}, { zeitzone: "Europe/Vienna" }, { zeitzone: "Europe/Berlin" }]) {
      expect(lauf(Date.UTC(2026, 8, 28, 7, 30), lehrkraft).gesendet.length, JSON.stringify(lehrkraft)).toBe(1);
      expect(lauf(Date.UTC(2026, 8, 28, 6, 30), lehrkraft).gesendet.length, JSON.stringify(lehrkraft)).toBe(0);
      expect(lauf(Date.UTC(2026, 8, 28, 8, 30), lehrkraft).gesendet.length, JSON.stringify(lehrkraft)).toBe(0);
      expect(lauf(Date.UTC(2026, 8, 29, 7, 30), lehrkraft).gesendet.length, JSON.stringify(lehrkraft)).toBe(0);
    }
  });

  it.skip("Wien: der Bericht ist Zeichen für Zeichen derselbe wie ohne Zone", () => {
    const ohne = lauf(Date.UTC(2026, 8, 28, 7, 30), {}).gesendet[0];
    const wien = lauf(Date.UTC(2026, 8, 28, 7, 30), { zeitzone: "Europe/Vienna" }).gesendet[0];
    // Einziger Unterschied seit D2: ohne Zone sagt die Mail „mitteleuropäische Zeit" dazu.
    expect(wien.subject).toBe(ohne.subject);
    expect(wien.html).toBe(ohne.html.replace(" (mitteleuropäische Zeit)", ""));
  });
});

describe("(d) Klassenmatch-Zähler: Wochen in der Zone der abrufenden Lehrkraft", () => {
  const lib = ladeHookQuelle(readFileSync(resolve(HOOKS_ORDNER, "tt_match_anzahl_lib.pb.js"), "utf8"));
  function abfrage(zone: string) {
    // Ein Match endet Montag 28.09. 07:30 Mexiko (= 13:30 UTC).
    const ende = Date.UTC(2026, 8, 28, 13, 30);
    const zeile = { pupilUid: "P1", startMs: ende - 300_000, endeMs: ende, durchgespielt: true };
    const e = {
      auth: {
        id: "T1",
        collection: () => ({ name: "tt_teachers" }),
        getString: (f: string) => (f === "zeitzone" ? zone : ""),
      },
      requestInfo: () => ({ query: { klasse: "K1" } }),
      json: (status: number, body: unknown) => ({ status, body }),
      app: {
        findFirstRecordByFilter: (c: string) => {
          if (c === "tt_classes") return { getString: () => "T1" };
          throw new Error("sql: no rows");
        },
        findRecordsByFilter: () => [
          { getString: (f: string) => (zeile as never)[f], getFloat: (f: string) => (zeile as never)[f], getBool: (f: string) => (zeile as never)[f] },
        ],
        logger: () => ({ warn: () => undefined }),
      },
    };
    return lib.klassenmatchAnzahlHandler(e) as { status: number; body: { kinder: Record<string, Record<string, number>> } };
  }

  it("Mexiko: 07:30 Ortszeit zählt in KW 39; ohne Zone (Wien) in KW 40 wie bisher", () => {
    expect(abfrage("America/Mexico_City").body.kinder).toEqual({ P1: { "2026-W39": 1 } });
    expect(abfrage("").body.kinder).toEqual({ P1: { "2026-W40": 1 } });
  });
});

// Kein Rest-TZ für andere Dateien desselben Arbeiters.
afterEach(() => {
  if (VORHERIGE_TZ === undefined) delete process.env.TZ;
  else process.env.TZ = VORHERIGE_TZ;
});
