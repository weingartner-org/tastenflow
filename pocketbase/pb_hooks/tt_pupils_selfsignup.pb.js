/// <reference path="../pb_data/types.d.ts" />
//
// Selbstlernende Schüler-Konten (ohne Klasse, ohne Lehrkraft) — 09.08.2026
// =======================================================================
// Wunsch Johannes: „ermögliche, dass sich Menschen als Schüler selbst anmelden
// und registrieren können, ohne bei einer Klasse eingetragen zu sein."
//
// Bis hierher legte IMMER eine Lehrkraft ein Kind an; die Login-Adresse war
// synthetisch (`<klassencode>__<name>@tt.local`, keine echte Mailbox). Jetzt
// gibt es einen zweiten Weg: `tt_pupils.selfManaged = true`, kein classCode,
// keine teacherUid — und eine ECHTE E-Mail-Adresse, weil diese Konten selbst
// Post bekommen (Wochenbericht montags, Inaktivitäts-Warnung nach einem Jahr).
//
// Dieser Hook ist das SERVER-SEITIGE Gegenstück zur geöffneten create-Regel in
// `setup.mjs`. Die Regel erlaubt das Anlegen ohne Anmeldung, wenn selfManaged
// gesetzt und classCode/teacherUid leer sind; alles Weitere prüft er hier —
// fail-closed, also lieber ablehnen als ein halbes Konto anlegen:
//
//   1. **Echte Adresse.** Keine `…@tt.local`- und keine Wegwerf-Endung
//      (.local/.test/.invalid/…). Ohne zustellbare Adresse gäbe es weder
//      Wochenbericht noch Löschwarnung — das Konto wäre nicht betreubar.
//   2. **Passwort mindestens 8 Zeichen.** Klassen-Kinder dürfen kurze
//      Passwörter haben (die Lehrkraft vergibt sie, das Konto hängt an einer
//      Klasse). Ein selbst angelegtes Konto mit echter Adresse ist ein
//      normales Konto und bekommt die normale Untergrenze.
//   3. **Name da.** Ohne Namen steht später in jeder Mail „Hallo ".
//   4. **Keine Lehrkraft-Felder.** Wochenziel, Tempo, Sprachsperre &c. setzt
//      sonst niemand für dieses Konto — sie kommen leer, nicht aus dem Body.
//
// Zusätzlich hängt hier die ZEITRECHNUNG der Konten:
//   • Bei jeder erfolgreichen Anmeldung wird `lastSeenAtMs` gesetzt und eine
//     etwaige Inaktivitäts-Warnung (`inactiveNoticeAtMs`) gelöscht — wer sich
//     anmeldet, ist zurück, und die Drei-Wochen-Frist endet damit.
//   • Das Feld schreibt NUR der Server. Im Client-Body wird es ignoriert
//     (tt_pupils_field_guard sperrt es), sonst könnte ein Konto seine eigene
//     Löschung beliebig hinausschieben.
//
// Deploy: Datei nach pb_hooks/ + Neustart → „Update LMS (komplett)"
// (setup.mjs ändert sich mit: neue Felder + create-Regel).

// ⚠️⚠️ KEINE Top-Level-Funktionen benutzen! Ein Hook-Handler läuft in einem
// EIGENEN Gültigkeitsbereich und sieht nichts, was hier draußen steht — der
// Aufruf endet mit „ReferenceError: … is not defined" und die Anfrage mit einem
// nackten 400. Genau daran ist die erste Selbstanmeldung am 09.08. gescheitert
// (bekannter Fallstrick, [[reference_pocketbase_hook_scope]]). Alle Helfer
// stehen darum INNERHALB des Handlers.

onRecordCreateRequest((e) => {
  /** Sieht die Adresse nach einer echten, zustellbaren Mailbox aus? */
  const istEchteAdresse = (addr) => {
    const a = String(addr || "").trim().toLowerCase();
    if (!a || a.indexOf("@") < 1) return false;
    const domain = a.split("@").pop();
    if (!domain || domain.indexOf(".") < 1) return false;
    // Die synthetischen Klassen-Adressen und die üblichen Nicht-Domänen.
    return !/\.(local|localhost|invalid|test|example|lan|internal)$/.test(domain);
  };

  // Wer legt an? Eine Lehrkraft (bzw. ein Superuser) läuft in den bisherigen
  // Weg und wird hier nicht angefasst.
  let vonLehrkraft = false;
  try {
    const auth = e.auth;
    vonLehrkraft = !!auth && auth.collection().name === "tt_teachers";
  } catch (_) {
    vonLehrkraft = false;
  }
  let vonSuperuser = false;
  try {
    vonSuperuser = !!e.auth && e.auth.collection().name === "_superusers";
  } catch (_) {
    vonSuperuser = false;
  }

  // ★ DER LERNWEG (E1, 24.09.2026 - `apps/tastenflow/BAUPLAN-2026-09-24-
  // ENGLISCHER-LEHRGANG.md` §2.2): beim Anlegen angenommen - von der
  // Selbstanmeldung ebenso wie von der Lehrkraft (die gibt einem neuen Kind
  // den Weg ihrer Klasse). Nur "de", "en", (E2a, 25.09.2026) "fr" und
  // (ES-M, 27.09.2026) "es" gelten;
  // alles andere wird LEER (= „de"), damit der Weg beim ersten Fortschritt
  // noch festgelegt werden kann. Danach ist er fest - `tt_pupils_field_guard.pb.js`.
  if (!vonSuperuser) {
    const lw = String(e.record.getString("lernweg") || "");
    // ★ E2a (25.09.2026, Gerüst französischer Lehrgang): "fr" dazu.
    // ★ ES-M (27.09.2026): "es" dazu - als Liste IM Handler (ein Handler sieht
    // den Kopf seiner Datei nicht, tests/pocketbase-hook-scope.test.ts).
    // ★ G2b-2 (02.10.2026): "it", "pl", "tr", "cs" dazu.
    // ★ G2-NEUN (25.10.2026): dazu die neun Wege des Gerüsts.
    const LERNWEGE = ["de", "en", "fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];
    if (LERNWEGE.indexOf(lw) < 0) e.record.set("lernweg", "");
  }

  if (vonLehrkraft || vonSuperuser) {
    e.next();
    return;
  }

  // Ab hier: SELBSTANMELDUNG. Alles, was nicht ausdrücklich erlaubt ist, wird
  // abgelehnt — der Weg steht ohne Anmeldung offen.
  const selbst = !!e.record.getBool("selfManaged");
  if (!selbst) {
    throw new BadRequestError(
      "Schüler-Konten legt die Lehrkraft an. Für ein eigenes Konto ohne Klasse " +
        "bitte in der App „Ich übe allein“ auswählen.",
    );
  }
  if (
    String(e.record.getString("classCode") || "") !== "" ||
    String(e.record.getString("teacherUid") || "") !== ""
  ) {
    throw new BadRequestError("Ein eigenes Konto gehört zu keiner Klasse.");
  }

  // ⚠️ `record.email()` gibt es im JSVM nicht auf jedem Record-Typ — der
  // Feldzugriff `getString("email")` tut es überall und ist der sichere Weg
  // (09.08.: die Methode ließ den ganzen Hook mit einem nackten 400 abbrechen).
  const email = String(e.record.getString("email") || "");
  if (!istEchteAdresse(email)) {
    throw new BadRequestError(
      "Für ein eigenes Konto brauchst du eine gültige E-Mail-Adresse — dorthin " +
        "geht dein Wochenbericht.",
    );
  }

  if (String(e.record.getString("name") || "").trim() === "") {
    throw new BadRequestError("Bitte gib deinen Namen an.");
  }

  // Passwortlänge aus dem ROHEN Body prüfen (im Record steht nur der Hash).
  // Lässt sich der Body nicht lesen, bleibt es bei der Collection-Untergrenze —
  // ein unlesbarer Body ist kein Grund, eine Anmeldung zu verweigern.
  try {
    const body = e.requestInfo().body || {};
    const pw = String(body.password || "");
    if (pw && pw.length < 8) {
      throw new BadRequestError("Das Passwort braucht mindestens 8 Zeichen.");
    }
  } catch (err) {
    if (err && String(err).indexOf("mindestens 8 Zeichen") >= 0) throw err;
  }

  // Lehrkraft-Felder kommen NICHT aus dem Body: Für ein Konto ohne Lehrkraft
  // gibt es niemanden, der sie setzen dürfte.
  //
  // ⚠️ Der Leerwert muss zum FELDTYP passen: Eine Zahl-Spalte mit "" zu
  // belegen lässt PocketBase den ganzen Schreibvorgang mit einem nackten 400
  // („Something went wrong…") abweisen — genau daran ist die erste
  // Selbstanmeldung am 09.08. gescheitert. Darum je Feld der richtige
  // Leerwert statt eines gemeinsamen "".
  const LEER = {
    tempo: "",
    goalMinutes: 0,
    goalUnits: 0,
    goalWeeks: [],
    goalCatchUp: false,
    goalResetWeek: "",
    oneHand: false,
    langLocked: false,
    inactiveNoticeAtMs: 0,
    lastSeenAtMs: 0,
    lastReportWeek: "",
    // ★★★★ Befund 26.09.2026 (gemessen am Wegwerf-PocketBase 0.38.1): OHNE
    // Anmeldung ging `POST {selfManaged: true, contactEmail: "opfer@…",
    // passwordPlain: "<beliebiger Text>"}` durch - und
    // `tt_pupils_passwort_mail.pb.js` schickte die „Zugangsdaten"-Mail mit
    // diesem Text an die fremde Adresse. Ein offenes Mail-Relais. Beide Felder
    // sind Lehrkraft-Felder (Kontakt-Adresse und Passwort-Spiegel für die
    // Teilnehmerliste); die Selbstanmeldung schickt sie nie mit.
    contactEmail: "",
    passwordPlain: "",
  };
  for (const f in LEER) {
    e.record.set(f, LEER[f]);
  }

  // ── WOMIT ANFANGEN? (01.09.2026) ────────────────────────────────────────
  //
  // `startUnits` stand bis heute in der Liste oben und wurde mit 0
  // überschrieben - jeder mitgeschickte Wert ging still verloren.
  //
  // Das war für die Klasse richtig gedacht und für ein Konto OHNE Lehrkraft
  // falsch: Die Regel lautet „Lehrkraft-Felder kommen nicht aus dem Body, weil
  // es hier niemanden gibt, der sie setzen dürfte". Bei den Vorkenntnissen
  // gibt es diesen Jemand aber - es ist die anmeldende Person selbst
  // (Johannes: „und wenn sich jemand selbst anmeldet auch"). Dieselbe
  // Unterscheidung wie bei `noTimePressure` und `geburtsjahr` im
  // Feld-Wächter: Kind MIT Lehrkraft bekommt es von ihr, Konto OHNE Lehrkraft
  // setzt es selbst.
  //
  // ⚠️ Der Wert wird geklemmt, nicht geglaubt. Eine sinnlos grosse Zahl ist
  // ungefährlich (die App schneidet die Tastenliste ohnehin an ihrer eigenen
  // Länge ab, siehe `letters.introducedUpTo`), aber sie hätte in der
  // Lehrkraft-Ansicht nichts zu suchen. Die Obergrenze liegt weit über allem,
  // was `introOrder()` je hergibt (rund 45 Einheiten).
  const OBERGRENZE_START = 100;
  let start = 0;
  try {
    const roh = Number(e.requestInfo().body.startUnits || 0);
    if (isFinite(roh) && roh > 0) {
      start = Math.min(OBERGRENZE_START, Math.round(roh));
    }
  } catch (_) {
    start = 0; // unlesbarer Body ist kein Grund, eine Anmeldung zu verweigern
  }
  e.record.set("startUnits", start);
  e.record.set("createdAtMs", Date.now());
  $app.logger().info("[tt-selfsignup] neues Konto ohne Klasse", "email", email);
  // Frisch angelegt = gerade gesehen. Sonst stünde ein neues Konto ab Minute
  // eins mit „zuletzt gesehen: nie" da.
  e.record.set("lastSeenAtMs", Date.now());

  e.next();
}, "tt_pupils");

// --- Zeitrechnung: jede Anmeldung setzt die Uhr zurück ----------------------
onRecordAuthRequest((e) => {
  e.next();
  try {
    const rec = e.record;
    if (!rec || !rec.getBool("selfManaged")) return;
    rec.set("lastSeenAtMs", Date.now());
    // Wer sich anmeldet, ist zurück — die Löschfrist endet.
    if (Number(rec.getInt("inactiveNoticeAtMs") || 0) > 0) {
      rec.set("inactiveNoticeAtMs", 0);
    }
    e.app.save(rec);
  } catch (err) {
    // Eine misslungene Zeitnotiz darf keine Anmeldung verhindern.
    $app.logger().warn("[tt-selflearner] lastSeen nicht gesetzt", "error", String(err));
  }
}, "tt_pupils");
