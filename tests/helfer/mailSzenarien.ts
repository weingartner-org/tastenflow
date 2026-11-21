/**
 * ★★ DIE MAILS VON TASTENFLOW, EINMAL DURCHGESPIELT (EN9, 19.09.2026).
 *
 * Jede Mail, die Tastenflow verschickt, in einem festen Szenario - mit
 * erfundenen Kindern, einer Lehrkraft und fester Uhr - über die ECHTEN
 * Hook-Dateien ausgeführt (`pbHookLaufzeit.ts`). `sprache` setzt das Feld
 * `bedienSprache` der Person, die die Mail bekommt (Lehrkraft, selbstlernendes
 * Konto, Kind mit Kontakt-Adresse); „de" lässt es LEER, wie bei jedem Konto,
 * das nie umgeschaltet hat.
 *
 * Gebraucht von:
 *  · `tests/tastenflow-englisch-mails.test.ts` - Deutsch Byte für Byte gegen
 *    `tests/fixtures/mails-deutsch.json`, Englisch durch den Deutsch-Fänger;
 *  · dem einmaligen Vergleich mit dem Stand VOR EN9 (`lade` = `git show
 *    HEAD:…`), aus dem die Fixture entstanden ist.
 *
 * ⚠️ Die Uhr steht fest (Montag, 21.09.2026) und der Test läuft in UTC wie
 * der Server - die Selbstlerner-Mail und die Tippchallenge-Mail rechnen mit
 * den LOKALEN Datums-Gettern, eine andere Zeitzone gäbe andere Tage.
 */
import { createHmac } from "node:crypto";
import { FakeRecord, neueLaufzeit, type Mail } from "./pbHookLaufzeit";

// ★ O-IT (02.10.2026): „it" dazu - die Mails gibt es seither italienisch.
// ★ O-PL (02.10.2026): „pl" dazu - die Mails gibt es seither polnisch.
// ★ O-TR (02.10.2026): „tr" dazu - die Mails gibt es seither türkisch.
// ★ O-CS (03.10.2026): „cs" dazu - die Mails gibt es seither tschechisch.
export type Sprache = "de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs";

/** Was ein Szenario ergibt: Mails, Seiten (Abbestellen) oder JSON-Antworten. */
export interface Ergebnis {
  mails: Mail[];
  seiten?: { status: number; html: string }[];
}

const APP = "https://weingartner.org";

/** Wien-Zeit als echter Zeitpunkt (September/Oktober 2026: Sommerzeit, UTC+2). */
function wien(tag: number, stunde: number, minute = 0, monat0 = 8): number {
  return Date.UTC(2026, monat0, tag, stunde - 2, minute);
}

/** Das Feld, das die Sprache trägt - bei Deutsch leer (nie umgeschaltet). */
function feld(sprache: Sprache): { bedienSprache?: string } {
  return sprache === "de" ? {} : { bedienSprache: sprache };
}

function lehrkraft(sprache: Sprache, extra: Record<string, unknown> = {}) {
  return new FakeRecord("tt_teachers", "T1", {
    email: "berger@schule-wien.at",
    name: "Anna Berger",
    ...feld(sprache),
    /*
      ★ D2 (28.09.2026): Die deutsche Lehrkraft sitzt in Wien und hat sich seit
      D2 angemeldet - ihre Zone steht am Konto, und ihre Mails sind Byte für
      Byte die von vorher (die Grundlage von `mails-deutsch.json`). Ohne Zone
      stünde „(mitteleuropäische Zeit)" dabei - das prüft
      `tests/tastenflow-zeitzone-mails.test.ts`, ebenso eine Lehrkraft in
      Mexiko-Stadt. Die anderen Sprachen bleiben ohne Zone (mit Zusatz).
    */
    ...(sprache === "de" ? { zeitzone: "Europe/Vienna" } : {}),
    ...extra,
  });
}

/** Ein Übungsblock: `minuten` aktive Zeit, endend um `ts`. */
function block(ts: number, minuten: number, zeichen = minuten * 120, fehler = Math.round(minuten * 4)) {
  return { ts, ms: minuten * 60000, activeMs: minuten * 60000, chars: zeichen, errors: fehler, lesson: "u1" };
}

/** Übung verteilt auf Tage der BERICHTETEN Woche (14.-20.09.2026). */
function wocheMit(tage: [number, number][]) {
  return tage.map(([tag, minuten]) => block(wien(tag, 16), minuten));
}

type Lade = (datei: string) => string;

// ── 1. Der Klassen-Wochenbericht (tt_weekly_report) ─────────────────────────
function wochenbericht(sprache: Sprache, lade?: Lade): Ergebnis {
  const jetzt = Date.UTC(2026, 8, 21, 7, 30); // Montag, 09:30 Wien - der Cron
  const kinder: [string, string, Record<string, unknown>, ReturnType<typeof block>[], number][] = [
    ["P1", "Lena", { wochenzielVerlauf: [{ ab: "2026-W36", minuten: 60 }] }, [
      ...wocheMit([[14, 20], [15, 15], [16, 18], [18, 10]]),
      block(wien(8, 16), 60),
      block(wien(1, 16), 50),
    ], 5],
    ["P2", "Jonas", { wochenzielVerlauf: [{ ab: "2026-W36", minuten: 60 }] }, wocheMit([[15, 15], [17, 10]]), 3],
    ["P3", "Emir", { wochenzielVerlauf: [{ ab: "2026-W37", minuten: 45 }] }, [], 2],
    ["P4", "Hanna", { wochenzielVerlauf: [{ ab: "2026-W36", minuten: 60 }], goalExcusedWeeks: ["2026-W38"] }, wocheMit([[16, 12]]), 4],
    ["P5", "Luka", { wochenzielVerlauf: [{ ab: "2026-W37", minuten: 45 }], goalCatchUp: true }, [
      ...wocheMit([[14, 15], [17, 15]]),
      block(wien(9, 16), 20),
    ], 3],
    ["P6", "Mira", {}, wocheMit([[14, 20], [15, 11], [19, 10]]), 4],
  ];
  const pupils = kinder.map(([id, name, extra]) => new FakeRecord("tt_pupils", id, { name, classCode: "3B", ...extra }));
  const events = kinder.map(([id, , , ev]) => new FakeRecord("lw_events", `E${id}`, { pupilUid: id, program: "tippen", data: { events: ev } }));
  const progress = kinder.map(([id, , , , level]) => new FakeRecord("lw_progress", `L${id}`, { pupilUid: id, program: "tippen", data: { level } }));
  const lz = neueLaufzeit({
    jetzt,
    appUrl: APP,
    lade,
    daten: {
      tt_teachers: [lehrkraft(sprache)],
      tt_classes: [
        new FakeRecord("tt_classes", "C1", {
          code: "3B",
          name: "3B",
          teacherUid: "T1",
          weeklyReport: true,
          data: {},
          // Eine gesperrte Stunde (Üben im Unterricht) am Dienstag.
          gesperrteZeiten: [{ abMs: wien(15, 10), bisMs: wien(15, 11) }],
        }),
      ],
      tt_pupils: pupils,
      lw_events: events,
      lw_progress: progress,
    },
  });
  lz.ladeHook("tt_weekly_report.pb.js");
  lz.cron("tt_weekly_report")();
  return { mails: lz.gesendet };
}

// ── 2. Der Wochenbericht der Selbstlernenden (tt_selflearner_weekly) ────────
function selbstWoche(sprache: Sprache, lade?: Lade): Ergebnis {
  const jetzt = Date.UTC(2026, 8, 21, 7, 10);
  const mia = new FakeRecord("tt_pupils", "S1", {
    name: "Mia",
    email: "mia@familie-huber.at",
    selfManaged: true,
    verified: true,
    ...feld(sprache),
  });
  const ben = new FakeRecord("tt_pupils", "S2", {
    name: "Ben",
    email: "ben@familie-gruber.at",
    selfManaged: true,
    verified: true,
    ...feld(sprache),
  });
  const ev = (id: string, programm: string, liste: ReturnType<typeof block>[]) =>
    new FakeRecord("lw_events", `${id}-${programm}`, { pupilUid: id, program: programm, data: { events: liste } });
  const lz = neueLaufzeit({
    jetzt,
    appUrl: APP,
    lade,
    daten: {
      tt_pupils: [mia, ben],
      lw_events: [
        ev("S1", "tippen", [block(Date.UTC(2026, 8, 14, 15), 20), block(Date.UTC(2026, 8, 14, 16), 12), block(Date.UTC(2026, 8, 17, 15), 25)]),
        ev("S1", "braille", [block(Date.UTC(2026, 8, 19, 9), 14)]),
        ev("S2", "tippen", [block(Date.UTC(2026, 8, 16, 15), 1)]),
      ],
    },
  });
  lz.ladeHook("tt_selflearner_weekly.pb.js");
  lz.cron("tt_selflearner_weekly")();
  return { mails: lz.gesendet };
}

// ── 3. Die Löschwarnung (tt_selflearner_lifecycle) ─────────────────────────
function loeschWarnung(sprache: Sprache, lade?: Lade): Ergebnis {
  const jetzt = Date.UTC(2026, 8, 21, 6, 20);
  const tom = new FakeRecord("tt_pupils", "S3", {
    name: "Tom",
    email: "tom@familie-berg.at",
    selfManaged: true,
    lastSeenAtMs: jetzt - 400 * 86400000,
    createdAtMs: jetzt - 500 * 86400000,
    inactiveNoticeAtMs: 0,
    ...feld(sprache),
  });
  const lz = neueLaufzeit({ jetzt, appUrl: APP, lade, daten: { tt_pupils: [tom] } });
  lz.ladeHook("tt_selflearner_lifecycle.pb.js");
  lz.cron("tt_selflearner_lifecycle")();
  return { mails: lz.gesendet };
}

// ── 4. Die Begrüssung einer neuen Lehrkraft (tt_teacher_welcome) ────────────
function willkommen(sprache: Sprache, lade?: Lade): Ergebnis {
  const gesendet: Mail[] = [];
  for (const name of ["Anna Berger", ""]) {
    const lz = neueLaufzeit({ jetzt: Date.UTC(2026, 8, 19, 10), appUrl: APP, lade });
    lz.ladeHook("tt_teacher_welcome.pb.js");
    const rec = lehrkraft(sprache, { name });
    for (const h of lz.handler("onRecordAfterCreateSuccess", "tt_teachers")) {
      h.handler({ record: rec, app: lz.$app, next() {} });
    }
    gesendet.push(...lz.gesendet);
  }
  return { mails: gesendet };
}

// ── 5. Die Zugangsdaten eines Kindes (tt_pupils_passwort_mail) ─────────────
function passwortMail(sprache: Sprache, lade?: Lade): Ergebnis {
  const lz = neueLaufzeit({ jetzt: Date.UTC(2026, 8, 19, 10), appUrl: APP, lade });
  lz.ladeHook("tt_pupils_passwort_mail.pb.js");
  const kind = new FakeRecord("tt_pupils", "P9", {
    name: "Mia",
    classCode: "3B",
    contactEmail: "eltern@familie-huber.at",
    passwordPlain: "Kiwi47",
    ...feld(sprache),
  });
  for (const h of lz.handler("onRecordAfterCreateSuccess", "tt_pupils")) {
    h.handler({ record: kind, app: lz.$app, next() {} });
  }
  return { mails: lz.gesendet };
}

// ── 6. Die Einladung als Co-Lehrkraft (tt_coteacher_lib) ───────────────────
function einladung(sprache: Sprache, lade?: Lade): Ergebnis {
  const ich = lehrkraft(sprache);
  const lz = neueLaufzeit({
    jetzt: Date.UTC(2026, 8, 19, 10),
    appUrl: APP,
    lade,
    daten: {
      tt_teachers: [ich],
      tt_classes: [new FakeRecord("tt_classes", "C1", { code: "3B", name: "3B Tastschreiben", teacherUid: "T1" })],
    },
  });
  const lib = lz.lib<{ coteacherHandler: (e: unknown, a: string) => unknown }>("tt_coteacher_lib.pb.js");
  lib.coteacherHandler(
    {
      auth: ich,
      app: lz.$app,
      requestInfo: () => ({ body: { classCode: "3B", email: "kollegin@schule-wien.at" } }),
      json: (status: number, antwort: unknown) => ({ status, antwort }),
    },
    "add",
  );
  return { mails: lz.gesendet };
}

// ── 7. Die Tippchallenge-Mail (tt_schreibprobe_mail) ───────────────────────
function schreibprobe(sprache: Sprache, lade?: Lade, variante: 1 | 2 = 1): Ergebnis {
  const start = Date.UTC(2026, 8, 18, 8, 5);
  const jetzt = variante === 1 ? start + 20 * 60000 : start + 12 * 60000;
  const plan =
    variante === 1
      ? { id: "p1", startMs: start, dauerMin: 5, niveau: "start", textNr: 3, startZeile: 0 }
      : { id: "p2", startMs: start, dauerMin: 3, niveau: "satz", textNr: 1, startZeile: 57, zuschlagProzent: 25 };
  const kinder = variante === 1 ? ["Lena", "Jonas", "Emir", "Luka"] : ["Lena", "Jonas"];
  const pupils = kinder.map((name, i) => new FakeRecord("tt_pupils", `P${i + 1}`, { name, classCode: "3B" }));
  const zeile = (pid: string, w: Record<string, unknown>, d: Record<string, unknown>) =>
    new FakeRecord("tt_schreibproben", `Z${pid}`, {
      classCode: "3B",
      probeId: plan.id,
      pupilUid: pid,
      beginnAtMs: start + 60000,
      data: d,
      gemeldetAtMs: 0,
      ...w,
    });
  const zeilen =
    variante === 1
      ? [
          zeile("P1", { anschlaege: 132, genauigkeit: 0.972, zeichen: 640, fehler: 12 }, {
            wacklig: [{ zeichen: "k", quote: 0.8 }, { zeichen: "ö", quote: 0.75 }],
            textZuEnde: true,
          }),
          zeile("P2", { anschlaege: 88, genauigkeit: 0.9, zeichen: 410, fehler: 30 }, {
            wacklig: [],
            wartezeitMs: 134000,
            frueherAbgegeben: true,
          }),
          zeile("P4", { anschlaege: 40, genauigkeit: 0.85, zeichen: 150, fehler: 20 }, {}),
        ]
      : [
          zeile("P1", { anschlaege: 150, genauigkeit: 0.95, zeichen: 440, fehler: 10 }, { zuschlagProzent: 25 }),
          zeile("P2", { anschlaege: 120, genauigkeit: 0.93, zeichen: 350, fehler: 11 }, {}),
        ];
  const lz = neueLaufzeit({
    jetzt,
    appUrl: APP,
    lade,
    daten: {
      tt_teachers: [lehrkraft(sprache)],
      tt_classes: [
        new FakeRecord("tt_classes", "C1", { code: "3B", name: "3B", teacherUid: "T1", settings: { schreibprobe: plan } }),
      ],
      tt_pupils: pupils,
      tt_schreibproben: zeilen,
    },
  });
  lz.ladeHook("tt_schreibprobe_mail.pb.js");
  lz.cron("tt_schreibprobe_mail")();
  return { mails: lz.gesendet };
}

// ── 8. Ein Kind antwortet der Lehrkraft (lw_message_mail) ──────────────────
function nachricht(sprache: Sprache, lade?: Lade): Ergebnis {
  const gesendet: Mail[] = [];
  for (const fromName of ["Mia", ""]) {
    const lz = neueLaufzeit({ jetzt: Date.UTC(2026, 8, 19, 10), appUrl: APP, lade, daten: { tt_teachers: [lehrkraft(sprache)] } });
    lz.ladeHook("lw_message_mail.pb.js");
    const rec = new FakeRecord("lw_messages", "M1", {
      senderRole: "pupil",
      teacherUid: "T1",
      data: fromName ? { body: "Ich bin fertig!\nDarf ich weiter üben?", fromName } : { body: "Hallo" },
    });
    for (const h of lz.handler("onRecordAfterCreateSuccess", "lw_messages")) {
      h.handler({ record: rec, app: lz.$app, next() {} });
    }
    gesendet.push(...lz.gesendet);
  }
  return { mails: gesendet };
}

// ── 9. Die Seite hinter dem Abbestell-Link (mail_abbestellen_lib) ──────────
function abbestellSeite(sprache: Sprache, lade?: Lade): Ergebnis {
  const seiten: { status: number; html: string }[] = [];
  const lz = neueLaufzeit({
    jetzt: Date.UTC(2026, 8, 19, 10),
    appUrl: APP,
    lade,
    daten: {
      tt_classes: [new FakeRecord("tt_classes", "C1", { code: "3B", weeklyReport: true })],
      tt_pupils: [new FakeRecord("tt_pupils", "S1", { name: "Mia", mailWeeklyOptOut: false })],
    },
  });
  type Lib = {
    unterschrift: (z: string, id: string, k: string, h: unknown) => string;
    abbestellHandler: (e: unknown) => unknown;
  };
  const lib = lz.lib<Lib>("mail_abbestellen_lib.pb.js");
  const geheim = "geheimnis-fuer-den-test-0123456789";
  const hs = (t: string, k: string) => createHmac("sha256", k).update(t).digest("hex");
  const faelle: Record<string, string>[] = [
    { zweck: "klasse-woche", id: "C1", t: lib.unterschrift("klasse-woche", "C1", geheim, hs) },
    // Zweimal: das zweite Mal „war schon vorher so eingestellt".
    { zweck: "klasse-woche", id: "C1", t: lib.unterschrift("klasse-woche", "C1", geheim, hs) },
    { zweck: "tt-woche", id: "S1", t: lib.unterschrift("tt-woche", "S1", geheim, hs) },
    { zweck: "tt-woche", id: "WEG", t: lib.unterschrift("tt-woche", "WEG", geheim, hs) },
    { zweck: "tt-woche", id: "S1", t: "falsch" },
  ];
  for (const q of faelle) {
    const query = sprache === "de" ? q : { ...q, sprache };
    lib.abbestellHandler({
      requestInfo: () => ({ query }),
      html: (status: number, html: string) => seiten.push({ status, html }),
    });
  }
  return { mails: [], seiten };
}

// ── 10. Die Konto-Mails von PocketBase (tt_mail_sprache) ───────────────────
//
// Die deutschen Vorlagen aus `setup.mjs` (Platzhalter schon eingesetzt, wie
// PocketBase sie an den Haken reicht). Ohne `bedienSprache = "en"` muss die
// Mail UNVERÄNDERT hinausgehen - vor EN9 gab es den Haken gar nicht.
const KONTO_VORLAGEN: { ereignis: string; sammlung: string; subject: string; html: string }[] = [
  {
    ereignis: "onMailerRecordPasswordResetSend",
    sammlung: "tt_teachers",
    subject: "Passwort für die Sensorik-Lernprogramme zurücksetzen",
    html:
      "<p>Hallo,</p><p>hier ist dein Weg zu einem neuen Passwort für dein Lehrkraft-Konto:</p>" +
      '<p><a href="https://weingartner.org/lernprogramm-passwort?token=eyJ.lehrkraft.reset">Neues Passwort setzen</a></p>' +
      '<p style="color:#666;font-size:12px">Der Link ist 4 Wochen gültig. Falls du das nicht angefordert hast, kannst du diese Mail einfach ignorieren.</p>',
  },
  {
    ereignis: "onMailerRecordVerificationSend",
    sammlung: "tt_teachers",
    subject: "Bitte bestätige deine E-Mail-Adresse (Sensorik)",
    html:
      "<p>Hallo,</p><p>bitte bestätige mit einem Klick, dass dir diese Adresse gehört:</p>" +
      '<p><a href="https://weingartner.org/lernprogramm-bestaetigen?art=lehrkraft&amp;token=eyJ.lehrkraft.pruef">E-Mail-Adresse bestätigen</a></p>' +
      "<p>Erst dann können wir dich erreichen — etwa beim Zurücksetzen des Passworts oder mit dem Wochenbericht deiner Klasse.</p>" +
      '<p style="color:#666;font-size:12px">Falls du dich nicht angemeldet hast, kannst du diese Mail ignorieren.</p>',
  },
  {
    ereignis: "onMailerRecordEmailChangeSend",
    sammlung: "tt_teachers",
    subject: "Neue E-Mail-Adresse bestätigen (Sensorik)",
    html:
      "<p>Hallo,</p><p>du möchtest dein Lehrkraft-Konto auf diese Adresse umstellen. Bestätige den Wechsel hier:</p>" +
      '<p><a href="https://weingartner.org/lernprogramm-bestaetigen?art=lehrkraft-adresse&amp;token=eyJ.lehrkraft.adresse">Adresswechsel bestätigen</a></p>' +
      '<p style="color:#666;font-size:12px">Zur Sicherheit wird dabei dein Passwort abgefragt. Wenn du das nicht angefordert hast, tu nichts — dann bleibt alles beim Alten.</p>',
  },
  {
    ereignis: "onMailerRecordPasswordResetSend",
    sammlung: "tt_pupils",
    subject: "Passwort für dein Sensorik-Konto zurücksetzen",
    html:
      "<p>Hallo,</p><p>hier ist dein Weg zu einem neuen Passwort:</p>" +
      '<p><a href="https://weingartner.org/lernprogramm-passwort?art=konto&amp;token=eyJ.konto.reset">Neues Passwort setzen</a></p>' +
      '<p style="color:#666;font-size:12px">Der Link ist 4 Wochen gültig. Falls du das nicht angefordert hast, kannst du diese Mail ignorieren.</p>',
  },
  {
    ereignis: "onMailerRecordVerificationSend",
    sammlung: "tt_pupils",
    subject: "Bitte bestätige deine E-Mail-Adresse (Sensorik)",
    html:
      "<p>Hallo,</p><p>bitte bestätige mit einem Klick, dass dir diese Adresse gehört:</p>" +
      '<p><a href="https://weingartner.org/lernprogramm-bestaetigen?art=konto&amp;token=eyJ.konto.pruef">E-Mail-Adresse bestätigen</a></p>' +
      "<p>Danach bekommst du montags deinen Wochenbericht — aber nur in Wochen, in denen du geübt hast.</p>" +
      '<p style="color:#666;font-size:12px">Üben kannst du auch ohne diesen Klick. Falls du dich nicht angemeldet hast, ignoriere diese Mail einfach.</p>',
  },
  {
    ereignis: "onMailerRecordEmailChangeSend",
    sammlung: "tt_pupils",
    subject: "Neue E-Mail-Adresse bestätigen (Sensorik)",
    html:
      "<p>Hallo,</p><p>du möchtest dein Sensorik-Konto auf diese Adresse umstellen. Bestätige den Wechsel hier:</p>" +
      '<p><a href="https://weingartner.org/lernprogramm-bestaetigen?art=adresse&amp;token=eyJ.konto.adresse">Adresswechsel bestätigen</a></p>' +
      '<p style="color:#666;font-size:12px">Zur Sicherheit wird dabei dein Passwort abgefragt. Wenn du das nicht angefordert hast, tu nichts — dann bleibt alles beim Alten.</p>',
  },
];

function kontoMails(sprache: Sprache, lade?: Lade): Ergebnis {
  const mails: Mail[] = [];
  for (const v of KONTO_VORLAGEN) {
    const lz = neueLaufzeit({ jetzt: Date.UTC(2026, 8, 19, 10), appUrl: APP, lade });
    let geladen = true;
    try {
      lz.ladeHook("tt_mail_sprache.pb.js");
    } catch {
      geladen = false; // vor EN9 gab es den Haken nicht
    }
    const rec = new FakeRecord(v.sammlung, "K1", { email: "konto@familie-huber.at", ...feld(sprache) });
    const message = lz.neueMail({
      from: { address: "sensorik@weingartner.org", name: "Sensorik" },
      to: [{ address: "konto@familie-huber.at" }],
      subject: v.subject,
      html: v.html,
    });
    let weiter = true;
    if (geladen) {
      for (const h of lz.handler(v.ereignis, v.sammlung)) {
        weiter = false;
        h.handler({ record: rec, message, app: lz.$app, next: () => (weiter = true) });
        if (!weiter) break;
      }
    }
    if (weiter) mails.push(message);
  }
  return { mails };
}

/** Alle Szenarien - Name → Ergebnis. */
export function alleSzenarien(sprache: Sprache, lade?: Lade): Record<string, Ergebnis> {
  return {
    wochenbericht: wochenbericht(sprache, lade),
    selbstWoche: selbstWoche(sprache, lade),
    loeschWarnung: loeschWarnung(sprache, lade),
    willkommen: willkommen(sprache, lade),
    passwortMail: passwortMail(sprache, lade),
    einladung: einladung(sprache, lade),
    schreibprobe: schreibprobe(sprache, lade, 1),
    schreibprobe2: schreibprobe(sprache, lade, 2),
    nachricht: nachricht(sprache, lade),
    abbestellSeite: abbestellSeite(sprache, lade),
    kontoMails: kontoMails(sprache, lade),
  };
}

/** Was von einer Mail verglichen wird - alles, was die Empfängerin sieht. */
export function sichtbar(m: Mail) {
  return { from: m.from, to: m.to, subject: m.subject, html: m.html, headers: m.headers ?? null };
}
