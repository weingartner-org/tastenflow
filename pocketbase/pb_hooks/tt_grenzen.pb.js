/// <reference path="../pb_data/types.d.ts" />
//
// Obergrenzen für Klassen und Kinder (02.09.2026)
// ===============================================
// Vorschlag Johannes: „vielleicht eine ip kann nie mehr als 30 Lehrer und ein
// lehrer kann nie mehr als 20 Klassen und eine klasse kann nie mehr wie 40
// schüler haben?"
//
// Zwei der drei Grenzen stehen hier. Die dritte - die Zahl neuer Konten je IP -
// gehört nicht in einen Hook, sondern in die Bremse von PocketBase selbst
// (Einstellung `rateLimits`, gesetzt in `setup.mjs`): dort greift sie, BEVOR
// überhaupt ein Datensatz entsteht, und sie zählt je Zeitfenster statt auf
// Lebenszeit. Eine Lebenszeit-Grenze je IP wäre an einer Schule falsch - ein
// Gymnasium sitzt mit 80 bis 120 Lehrkräften hinter einem einzigen Anschluss,
// im Mobilfunk teilen sich Tausende eine Adresse.
//
// ── Was diese Grenzen leisten - und was nicht ───────────────────────────────
// Sie begrenzen, was EIN Konto anrichten kann. Sie verhindern NICHT, dass viele
// Konten entstehen: Ein Bot, der 1000 Lehrkräfte mit je einer Klasse und einem
// Kind anlegt, läuft durch beide Grenzen hindurch. Dagegen stehen die Bremse in
// den Einstellungen, die Mail-Bremse (`mail_bremse.pb.js`) und das Aufräumen
// (`konto_aufraeumen.pb.js`). Diese Datei ist die Schadensbegrenzung, nicht die
// Mauer.
//
// ── 30 Kinder je Klasse, 20 Klassen je Lehrkraft ────────────────────────────
// Beides von Johannes festgelegt (02.09.2026: „max 30 Pro klasse max 20 Klasse
// pro lehrkraft bitte"). Ich hatte 60 vorgeschlagen; er hat es auf 30 gesetzt,
// und das deckt sich mit der Wirklichkeit: Gemessen am selben Tag ist die
// grösste Klasse 8 Kinder gross, die meisten Klassen je Lehrkraft sind 5, und
// eine österreichische Schulklasse liegt bei 25 bis 30.
//
// ⚠️ 30 ist eine SCHARFE Grenze, keine grosszügige: Eine Klasse mit 31 Kindern
// gibt es, und dann steht die Lehrkraft davor. Sie bekommt eine verständliche
// Meldung und kann eine zweite Klasse anlegen - wer die Grenze dauerhaft
// anheben will, ändert die Zahl hier, nicht die Meldung.
//
// ⚠️ Die Grenze gilt der KLASSE, nicht der Lehrkraft. Eine Lehrkraft darf
// beliebig viele Kinder anlegen (20 Klassen x 30 = 600) - und sie läuft dabei
// in keine Bremse je IP, weil alle diese Regeln `audience: "@guest"` tragen
// und sie angemeldet ist. Gemessen: acht Kinder hintereinander aus derselben
// Leitung, keine Sperre.
//
// ── Ein Konto, das seine eigene Uhr stellt, gibt es nicht ───────────────────
// `tt_teachers.createdAtMs` kam bisher aus dem Client. Wer die Zahl weglässt,
// hat ein Konto mit Anlegezeit 0 - und wäre damit für das Aufräumen unsichtbar
// gewesen („älter als der Stichtag" träfe nie zu). Der Server setzt das Feld
// darum selbst, bei JEDEM Anlegen.
//
// Deploy: Datei nach pb_hooks/ + Neustart → „Update LMS (komplett)".

// --- Lehrkraft-Konto: Anlegezeit gehört dem Server -------------------------
onRecordCreateRequest((e) => {
  e.record.set("createdAtMs", Date.now());
  e.next();
}, "tt_teachers");

// --- Höchstens 20 Klassen je Lehrkraft -------------------------------------
onRecordCreateRequest((e) => {
  const MAX_KLASSEN = 20;

  // Wer legt an? Ohne Lehrkraft-Anmeldung kommt hier ohnehin niemand durch
  // (create-Regel in setup.mjs), aber ein Superuser darf mehr.
  let besitzer = "";
  let vonSuperuser = false;
  try {
    const auth = e.auth;
    if (auth && auth.collection().name === "_superusers") vonSuperuser = true;
    else if (auth) besitzer = auth.id;
  } catch (_) {
    besitzer = "";
  }
  if (vonSuperuser || !besitzer) {
    e.next();
    return;
  }

  let anzahl = 0;
  try {
    anzahl = e.app.countRecords("tt_classes", $dbx.hashExp({ teacherUid: besitzer }));
  } catch (err) {
    // Lässt sich nicht zählen, wird nicht gesperrt: eine kaputte Zählung darf
    // keine Lehrkraft an ihrer Arbeit hindern.
    e.app.logger().warn("[tt-grenzen] Klassen nicht zählbar", "error", String(err));
    e.next();
    return;
  }

  if (anzahl >= MAX_KLASSEN) {
    e.app.logger().warn("[tt-grenzen] Klassen-Grenze erreicht", "teacher", besitzer, "anzahl", anzahl);
    throw new BadRequestError(
      "Mehr als " + MAX_KLASSEN + " Klassen sind je Konto nicht vorgesehen. " +
        "Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an.",
    );
  }
  e.next();
}, "tt_classes");

// --- Höchstens 30 Kinder je Klasse -----------------------------------------
onRecordCreateRequest((e) => {
  const MAX_KINDER = 30;

  const code = String(e.record.getString("classCode") || "").trim();
  // Selbstlernende Konten gehören zu keiner Klasse - für sie gibt es hier
  // nichts zu zählen.
  if (!code) {
    e.next();
    return;
  }

  let vonSuperuser = false;
  try {
    vonSuperuser = !!e.auth && e.auth.collection().name === "_superusers";
  } catch (_) {
    vonSuperuser = false;
  }
  if (vonSuperuser) {
    e.next();
    return;
  }

  let anzahl = 0;
  try {
    anzahl = e.app.countRecords("tt_pupils", $dbx.hashExp({ classCode: code }));
  } catch (err) {
    e.app.logger().warn("[tt-grenzen] Kinder nicht zählbar", "error", String(err));
    e.next();
    return;
  }

  if (anzahl >= MAX_KINDER) {
    e.app.logger().warn("[tt-grenzen] Klassen-Stärke erreicht", "klasse", code, "anzahl", anzahl);
    throw new BadRequestError(
      "In dieser Klasse sind bereits " + anzahl + " Kinder. Mehr als " +
        MAX_KINDER + " sind je Klasse nicht vorgesehen - lege bitte eine " +
        "zweite Klasse an.",
    );
  }
  e.next();
}, "tt_pupils");
