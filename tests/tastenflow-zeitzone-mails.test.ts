/**
 * ★★★ D2 (28.09.2026): Uhrzeiten in den Mails in der Zeitzone der Lehrkraft.
 *
 * Wohin sich dieser Wächter bewegt, wenn es schlechter wird:
 *  · Eine Lehrkraft in America/Mexico_City liest wieder Wiener Zeit - rot.
 *  · Ohne gemerkte Zone fehlt der Hinweis „mitteleuropäische Zeit" - rot.
 *  · Eine Lehrkraft in Wien (Zone Europe/Vienna) bekommt einen anderen
 *    Wochenbericht als vor D2 (de/en/fr Byte für Byte) - rot.
 *  · Die eigene Umrechnung (goja hat kein `Intl`) weicht irgendwo von der
 *    echten Zeitzonen-Datenbank ab - rot (Gegenprobe gegen Node-`Intl`,
 *    tzdata 2026a, über 2026-2028 inkl. aller Umstellungen).
 */
import { describe, expect, it } from "vitest";
import { FakeRecord, neueLaufzeit, type Mail } from "./helfer/pbHookLaufzeit";

interface ZonenLib {
  zoneRegel: (z: string) => unknown;
  zonenVersatzMs: (ms: number, z: string) => number | null;
  ortsFelder: (ms: number, z: string) => Record<string, number | boolean>;
  ortsZeit: (ms: number, z: string) => { naivMs: number; lokal: boolean };
}
interface Wz {
  berichtHtml: (d: unknown, s?: string) => { subject: string; html: string };
}

const lzLib = neueLaufzeit({ jetzt: Date.UTC(2026, 8, 28, 7, 30) });
const zz = lzLib.lib<ZonenLib>("tt_zeitzone_lib.pb.js");
const wz = lzLib.lib<Wz>("tt_wochenziel_lib.pb.js");

const FORMATE = new Map<string, Intl.DateTimeFormat>();

/** Der echte Versatz aus der Zeitzonen-Datenbank von Node (ms). */
function intlVersatz(ms: number, zone: string): number {
  let format = FORMATE.get(zone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    FORMATE.set(zone, format);
  }
  const teile = format.formatToParts(new Date(ms));
  const w = (t: string) => Number(teile.find((p) => p.type === t)!.value);
  const wand = Date.UTC(w("year"), w("month") - 1, w("day"), w("hour"), w("minute"), w("second"));
  return wand - Math.floor(ms / 1000) * 1000;
}

describe("die eigene Umrechnung gegen die echte Zeitzonen-Datenbank", () => {
  const ZONEN = [
    "Europe/Vienna", "Europe/Berlin", "Europe/Zurich", "Europe/Madrid", "Europe/Paris",
    "Europe/Luxembourg", "Europe/London", "Europe/Lisbon", "Europe/Athens", "Europe/Kyiv",
    "Europe/Moscow", "Europe/Istanbul", "Atlantic/Canary", "Atlantic/Azores",
    "America/Mexico_City", "America/Monterrey", "America/Cancun", "America/Hermosillo",
    "America/Tijuana", "America/Ciudad_Juarez", "America/Guatemala", "America/Tegucigalpa",
    "America/El_Salvador", "America/Managua", "America/Costa_Rica", "America/Panama",
    "America/Havana", "America/Santo_Domingo", "America/Puerto_Rico", "America/Bogota",
    "America/Lima", "America/Guayaquil", "Pacific/Galapagos", "America/Caracas",
    "America/La_Paz", "America/Asuncion", "America/Montevideo",
    "America/Argentina/Buenos_Aires", "America/Argentina/Cordoba", "America/Sao_Paulo",
    "America/Santiago", "Pacific/Easter", "America/Punta_Arenas", "America/New_York",
    "America/Chicago", "America/Denver", "America/Phoenix", "America/Los_Angeles",
    "America/Toronto", "America/Vancouver", "America/Halifax", "America/St_Johns",
    "America/Indiana/Indianapolis", "Pacific/Honolulu", "Africa/Johannesburg",
    "Africa/Lagos", "Asia/Tokyo", "Asia/Kolkata", "Asia/Kathmandu", "Asia/Tehran",
    "Australia/Sydney", "Australia/Adelaide", "Australia/Brisbane", "Australia/Perth",
    "Pacific/Auckland", "UTC", "Etc/GMT+5",
  ];

  it("jede Zone der Tabelle, alle 11 Stunden über 2026-2028", () => {
    const von = Date.UTC(2026, 0, 1);
    const bis = Date.UTC(2028, 0, 1);
    for (const zone of ZONEN) {
      expect(zz.zoneRegel(zone), `${zone} steht in der Tabelle`).not.toBeNull();
      for (let t = von; t < bis; t += 11 * 3600000) {
        expect(zz.zonenVersatzMs(t, zone), `${zone} bei ${new Date(t).toISOString()}`).toBe(
          intlVersatz(t, zone),
        );
      }
    }
  });

  it("an jeder Umstellung minutengenau (Zonen mit Sommerzeit, 2026-2027)", () => {
    const MIT_SOMMERZEIT = [
      "Europe/Vienna", "Europe/London", "Europe/Athens", "America/New_York",
      "America/Los_Angeles", "America/Tijuana", "America/Havana", "America/Santiago",
      "Pacific/Easter", "America/St_Johns", "Australia/Sydney", "Australia/Adelaide",
      "Pacific/Auckland",
    ];
    for (const zone of MIT_SOMMERZEIT) {
      // Stundenweise suchen, wo Intl den Versatz wechselt, und dort ±1 Minute prüfen.
      for (let t = Date.UTC(2026, 0, 1); t < Date.UTC(2028, 0, 1); t += 3600000) {
        if (intlVersatz(t, zone) === intlVersatz(t + 3600000, zone)) continue;
        for (let m = -61; m <= 61; m += 1) {
          const p = t + 3600000 + m * 60000;
          expect(zz.zonenVersatzMs(p, zone), `${zone} bei ${new Date(p).toISOString()}`).toBe(
            intlVersatz(p, zone),
          );
        }
      }
    }
  });

  it("unbekannte Zone ⇒ null, die Felder sind dann Wiener Zeit mit `lokal: false`", () => {
    expect(zz.zonenVersatzMs(Date.UTC(2026, 8, 1), "Mars/Olympus")).toBeNull();
    expect(zz.zonenVersatzMs(Date.UTC(2026, 8, 1), "")).toBeNull();
    const f = zz.ortsFelder(Date.UTC(2026, 8, 21, 6, 0), "");
    expect(f).toMatchObject({ stunde: 8, minute: 0, wochentag: 0, lokal: false });
  });
});

/** Eine sofort vollständige Tippchallenge - mit der Lehrkraft `lehrkraft`. */
function tippchallenge(startUtcMs: number, lehrkraft: Record<string, unknown>): Mail {
  const plan = { id: "p1", startMs: startUtcMs, dauerMin: 5, niveau: "start", textNr: 0, startZeile: 0 };
  const lz = neueLaufzeit({
    jetzt: startUtcMs + 2 * 60000,
    appUrl: "https://weingartner.org",
    daten: {
      tt_teachers: [
        new FakeRecord("tt_teachers", "T1", { email: "lehrer@schule.at", name: "Lehrer", ...lehrkraft }),
      ],
      tt_classes: [
        new FakeRecord("tt_classes", "C1", {
          code: "K1",
          name: "K1",
          teacherUid: "T1",
          settings: { schreibprobe: plan },
        }),
      ],
      tt_pupils: [new FakeRecord("tt_pupils", "P1", { name: "Kind", classCode: "K1" })],
      tt_schreibproben: [
        new FakeRecord("tt_schreibproben", "Z1", {
          classCode: "K1",
          probeId: plan.id,
          pupilUid: "P1",
          beginnAtMs: startUtcMs + 60000,
          data: {},
          gemeldetAtMs: 0,
          anschlaege: 100,
          genauigkeit: 0.9,
          zeichen: 300,
          fehler: 10,
        }),
      ],
    },
  });
  lz.ladeHook("tt_schreibprobe_mail.pb.js");
  lz.cron("tt_schreibprobe_mail")();
  expect(lz.gesendet.length).toBe(1);
  return lz.gesendet[0];
}

describe("die Tippchallenge-Mail", () => {
  const START = Date.UTC(2026, 8, 18, 8, 5); // 10:05 Wien, 02:05 Mexiko-Stadt

  it.skip("Lehrkraft in America/Mexico_City: Ortszeit, kein Zusatz", () => {
    const de = tippchallenge(START, { zeitzone: "America/Mexico_City" });
    expect(de.html).toContain("Start 18.09.2026, 02:05</p>");
    expect(de.html).not.toContain("mitteleuropäische");
    const es = tippchallenge(START, { zeitzone: "America/Mexico_City", bedienSprache: "es" });
    expect(es.html).toContain("Inicio 18 de septiembre de 2026, 2:05");
    expect(es.html).not.toContain("hora de Europa central");
  });

  it.skip("Gegenprobe ohne Zone: Wiener Zeit MIT Zusatz - in jeder Sprache", () => {
    expect(tippchallenge(START, {}).html).toContain("Start 18.09.2026, 10:05 (mitteleuropäische Zeit)");
    expect(tippchallenge(START, { bedienSprache: "en" }).html).toContain(
      "Start 18 September 2026, 10:05 (Central European Time)",
    );
    expect(tippchallenge(START, { bedienSprache: "fr" }).html).toContain(
      "Début 18 septembre 2026, 10 h 05 (heure d'Europe centrale)",
    );
    expect(tippchallenge(START, { bedienSprache: "es" }).html).toContain(
      "Inicio 18 de septiembre de 2026, 10:05 (hora de Europa central)",
    );
  });

  it.skip("unbekannte Zone wie ohne Zone", () => {
    expect(tippchallenge(START, { zeitzone: "Mars/Olympus" }).html).toContain(
      "Start 18.09.2026, 10:05 (mitteleuropäische Zeit)",
    );
  });

  it.skip("Lehrkraft in Wien: dieselbe Zeit wie vor D2, ohne Zusatz", () => {
    const html = tippchallenge(START, { zeitzone: "Europe/Vienna" }).html;
    expect(html).toContain("Start 18.09.2026, 10:05</p>");
    expect(html).not.toContain("mitteleuropäische");
  });
});

describe("der Klassen-Wochenbericht", () => {
  const MONTAG = Date.UTC(2026, 8, 21, 6, 0); // Montag 21.09.2026, 08:00 Wien
  const ENDE = Date.UTC(2026, 8, 28, 6, 0);
  const daten = (zone: string) => ({
    klasse: "3B",
    wocheStartMs: MONTAG,
    zeilen: [],
    ortVon: zz.ortsFelder(MONTAG, zone),
    ortBis: zz.ortsFelder(ENDE, zone),
  });

  it("Mexiko-Stadt: Montag 0:00 bis Montag 0:00, ohne Zusatz", () => {
    expect(wz.berichtHtml(daten("America/Mexico_City")).html).toContain(
      "Woche von Montag, 21.09., 0:00 Uhr bis Montag, 28.09., 0:00 Uhr.</p>",
    );
    expect(wz.berichtHtml(daten("America/Mexico_City"), "es").html).toContain(
      "del lunes 21 de septiembre, 0:00, al lunes 28 de septiembre, 0:00.</p>",
    );
    expect(wz.berichtHtml(daten("America/Mexico_City"), "en").html).toContain(
      "the week from 12am on Monday 21 September to 12am on Monday 28 September.</p>",
    );
  });

  it("Los Angeles: der Wochentag wandert mit - Sonntag, 23:00", () => {
    expect(wz.berichtHtml(daten("America/Los_Angeles")).html).toContain(
      "Woche von Sonntag, 20.09., 23:00 Uhr bis Sonntag, 27.09., 23:00 Uhr.</p>",
    );
    expect(wz.berichtHtml(daten("America/Los_Angeles"), "fr").html).toContain(
      "la semaine du dimanche 20 septembre, 23 h, au dimanche 27 septembre, 23 h.</p>",
    );
  });

  it("Gegenprobe ohne Zone: Wiener Zeit mit Zusatz in jeder Sprache", () => {
    expect(wz.berichtHtml(daten("")).html).toContain(
      "Woche von Montag, 21.09., 8:00 Uhr bis Montag, 28.09., 8:00 Uhr (mitteleuropäische Zeit).</p>",
    );
    expect(wz.berichtHtml(daten(""), "en").html).toContain(
      "to 8am on Monday 28 September (Central European Time).</p>",
    );
    expect(wz.berichtHtml(daten(""), "fr").html).toContain(
      "au lundi 28 septembre, 8 h (heure d'Europe centrale).</p>",
    );
    expect(wz.berichtHtml(daten(""), "es").html).toContain(
      "al lunes 28 de septiembre, 8:00 (hora de Europa central).</p>",
    );
  });

  it("Wien: de/en/fr Byte für Byte wie vor D2 (ohne ortVon)", () => {
    for (const s of [undefined, "en", "fr"]) {
      const alt = wz.berichtHtml({ klasse: "3B", wocheStartMs: MONTAG, zeilen: [] }, s);
      const neu = wz.berichtHtml(daten("Europe/Vienna"), s);
      expect(neu).toEqual(alt);
    }
    // Spanisch: dasselbe, nur ohne den Zusatz - die Zeit IST die der Lehrkraft.
    const altEs = wz.berichtHtml({ klasse: "3B", wocheStartMs: MONTAG, zeilen: [] }, "es").html;
    expect(wz.berichtHtml(daten("Europe/Vienna"), "es").html).toBe(
      altEs.replace(" (hora de Europa central)", ""),
    );
  });
});

describe("der Wochenbericht-Hook reicht die Zone der Lehrkraft durch", () => {
  function bericht(lehrkraft: Record<string, unknown>, jetzt = Date.UTC(2026, 8, 28, 7, 30)): Mail {
    const lz = neueLaufzeit({
      jetzt,
      daten: {
        tt_teachers: [
          new FakeRecord("tt_teachers", "T1", { email: "lehrer@schule.at", name: "Lehrer", ...lehrkraft }),
        ],
        tt_classes: [
          new FakeRecord("tt_classes", "C1", {
            code: "K1",
            name: "3B",
            teacherUid: "T1",
            weeklyReport: true,
            data: {},
            settings: { schuljahrBeginn: 2 },
          }),
        ],
        tt_pupils: [new FakeRecord("tt_pupils", "P1", { name: "Kind", classCode: "K1" })],
      },
    });
    lz.ladeHook("tt_weekly_report.pb.js");
    lz.cron("tt_weekly_report")();
    expect(lz.gesendet.length).toBe(1);
    return lz.gesendet[0];
  }

  it.skip("Mexiko-Stadt ⇒ Ortszeit; ohne Zone ⇒ Wien mit Zusatz", () => {
    // ★ Z1 (28.09.2026): seit Z1 liegt auch die GRENZE in der Zone der
    // Lehrkraft - die Woche endet Montag 08:00 Mexiko (= 14:00 UTC), die Mail
    // kommt beim ersten Lauf danach (vor Z1 stand hier „0:00 Uhr", die Wiener
    // Grenze in Mexiko-Zeit). Der Rest: tests/tastenflow-wochengrenze-zone.test.ts.
    expect(bericht({ zeitzone: "America/Mexico_City" }, Date.UTC(2026, 8, 28, 14, 30)).html).toContain(
      "Woche von Montag, 21.09., 8:00 Uhr bis Montag, 28.09., 8:00 Uhr.</p>",
    );
    expect(bericht({}).html).toContain("8:00 Uhr (mitteleuropäische Zeit).</p>");
  });
});
