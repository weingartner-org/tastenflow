/**
 * PocketBase provisioning for the Baukasten-LMS.
 *
 * Creates the auth collection + all data collections (data-json + scalar
 * filter columns, mirroring src/backend/pocketbase.ts) and seeds demo
 * accounts. Idempotent — safe to re-run. Works locally and, with env
 * overrides, against the later EU server.
 *
 * Provisionierung läuft in ZWEI Pässen (2026-07-13): erst alle Collections
 * OHNE API-Regeln anlegen, dann die Regeln setzen. Sonst bricht ein frisches
 * Nackt-Provisioning (Disaster-Recovery / neuer Server), sobald eine Regel per
 * `@collection.X` auf eine in Array-Reihenfolge noch nicht angelegte Collection
 * zeigt. Details bei ensureCollectionShell/applyCollectionRules.
 *
 *   node pocketbase/setup.mjs
 *
 * Env (defaults = local dev):
 *   PB_URL        http://127.0.0.1:8090
 *   PB_SU_EMAIL   admin@local.test
 *   PB_SU_PASS    pbdevAdmin12345!
 *
 * API rules are hardened to firestore.rules parity: owner isolation
 * (a learner only sees their own progress/exams/attendance/analytics),
 * staff-only writes for shared content, write-once exam locking, and no
 * privilege escalation on self-signup. The superuser used by this script
 * bypasses collection rules, so demo provisioning still works.
 *
 * Phase F (Kurs-Superuser / PH-Leitung, 2026-05-23): die Rolle
 * `course_observer` ist GLOBAL als Markierung am User UND PRO KURS als
 * `enrollments.role = "course_observer"`. Lesezugriff im Kurs läuft über
 * den bestehenden `enrolledOrStaff(...)`-Filter (Observer ist ja in dem
 * Kurs "eingeschrieben"); zusätzlich erweitert `ownerOrStaffOrCourseObserver`
 * den Lesezugriff auf `gradeOverrides` / `submissions` / `attendance`,
 * damit die PH-Leitung Noten/Abgaben/Anwesenheit der Studis sieht.
 * Schreibrechte HAT der Observer NIE — kein Self-Enroll (SELF_ENROLL
 * erzwingt `role = "student"`), keine Staff-Aktion (Observer ist nicht
 * staff). Memory: feedback_security_first (kompromisslos).
 */
import PocketBase from "pocketbase";

const URL = process.env.PB_URL || "http://127.0.0.1:8090";
const SU_EMAIL = process.env.PB_SU_EMAIL || "admin@local.test";
const SU_PASS = process.env.PB_SU_PASS || "pbdevAdmin12345!";

// SICHERHEIT: Demo-Accounts (schwache Test-Passwörter!) NUR lokal seeden.
// Gegen einen entfernten Server (Produktion) standardmäßig überspringen,
// damit niemand versehentlich admin@example.edu/Test1234! auf prod anlegt.
// Erzwingen mit PB_SEED_DEMO=1, hart aus mit PB_SEED_DEMO=0.
const IS_LOCAL = /\/\/(localhost|127\.0\.0\.1)\b/.test(URL);

// HARTE SICHERHEITS-GRENZE: gegen Production (kein localhost) NIEMALS
// den eingebauten Default-Superuser („admin@local.test“ mit dem
// öffentlich bekannten Demo-Passwort) verwenden. Sonst legt das Skript
// einen offenen Admin-Zugang auf der Live-PB an, den jeder kennt, der
// dieses Repo gesehen hat. Stattdessen explizit:
//   PB_SU_EMAIL=… PB_SU_PASS=… node pocketbase/setup.mjs
// Memory: feedback_security_first / project_status_2026-05-18 (Demo-User
// auf Live = Phase-A-Restposten, in B-Aufräumen entfernt).
if (!IS_LOCAL && SU_EMAIL === "admin@local.test") {
  console.error(
    `ABORT: Production-Lauf (${URL}) mit dem eingebauten Demo-` +
      `Superuser "admin@local.test" verweigert. Bitte explizit setzen:\n` +
      `  PB_SU_EMAIL=<live-superuser> PB_SU_PASS=<starkes-passwort> ` +
      `node pocketbase/setup.mjs`,
  );
  process.exit(2);
}

const pb = new PocketBase(URL);
pb.autoCancellation(false); //  locked: only this script's superuser
const SIGNED_IN = '@request.auth.id != ""';
const ADMIN = '@request.auth.role = "admin"';

// === „Flinke Finger“ (Tipptrainer) — eigenes, ISOLIERTES Konto-System ========
// Komplett getrennt von den LMS-Konten: eigene Auth-Collections für Lehrkräfte
// (E-Mail+Passwort) und Schüler:innen (synthetische E-Mail aus Klassencode+Name,
// damit dieselbe Anmeldung „Klassencode + Name + Passwort“ von JEDEM Gerät
// funktioniert). Strenge Isolation: eine Lehrkraft sieht nur ihre eigenen
// Klassen/Schüler:innen, ein Kind nur seine eigenen Daten. Token-Herkunft wird
// über `@request.auth.collectionName` geprüft (Lehrkraft vs. Schüler:in), damit
// sich die beiden Rollen nicht gegenseitig untergraben können.
// Memory: feedback_security_first, feedback_data_transparency, project_zehnfinger_trainer.
const TT_TEACHER = '@request.auth.collectionName = "tt_teachers"';
const TT_PUPIL = '@request.auth.collectionName = "tt_pupils"';
// col = Spalte mit der Lehrkraft-id des Datensatzes (teacherUid)
const ttOwnerTeacher = (col) => `(${TT_TEACHER} && @request.auth.id = ${col})`;
// col = Spalte mit der Schüler:in-id des Datensatzes (id bzw. pupilUid)
const ttSelfPupil = (col) => `(${TT_PUPIL} && @request.auth.id = ${col})`;

// --- Mehrere Lehrkräfte pro Klasse (Co-Lehrkräfte) ---------------------------
// Eine Lehrkraft kann WEITERE Lehrkräfte zu einer Klasse hinzufügen; diese haben
// dann VOLLE Rechte auf die Klasse (Schüler:innen sehen/verwalten, Fortschritt,
// Passwörter zurücksetzen). Umgesetzt über eine Join-Collection
// `tt_class_teachers` (eine Zeile je Klassencode+Co-Lehrkraft); die EIGENTÜMER-
// Lehrkraft bleibt `tt_classes.teacherUid`. Die Mitgliedschaft wird über einen
// server-seitigen Hook (pb_hooks/tt_coteacher.pb.js) gepflegt, der die E-Mail
// einer Lehrkraft auflöst, ohne das Lehrer-Verzeichnis offenzulegen.
//
// Zugriff in den Regeln über `@collection`-KORRELATION (wie bei den LMS-Kursen):
//  • besitzt die Lehrkraft die Klasse mit Code `col`? (tt_classes)
//  • ist die Lehrkraft als Co-Lehrkraft der Klasse mit Code `col` eingetragen?
// Beide Bedingungen je @collection sind auf DIESELBE Join-/Klassen-Zeile
// korreliert (eindeutiger Klassencode) → keine klassenübergreifende Freigabe.
const ttOwnsClass = (col) =>
  `(${TT_TEACHER} && @collection.tt_classes.code ?= ${col} && @collection.tt_classes.teacherUid ?= @request.auth.id)`;
const ttCoTeacher = (col) =>
  `(${TT_TEACHER} && @collection.tt_class_teachers.classCode ?= ${col} && @collection.tt_class_teachers.teacherUid ?= @request.auth.id)`;
// Lehrkraft mit VOLLEM Zugriff auf die Klasse mit Code `col` (Eigentümer ODER Co).
const ttClassStaff = (col) => `(${ttOwnsClass(col)} || ${ttCoTeacher(col)})`;
// Dasselbe mit EIGENEN Join-Aliasen (10.09.2026) - für Regeln, die ZWEI Klassen
// zugleich prüfen (bisherige und neue, `tt_pupils.updateRule`). Ohne Alias
// teilen sich alle `@collection.tt_classes.*` einer Regel dieselbe Join-Zeile.
const ttClassStaffAlias = (col, alias) =>
  `((${TT_TEACHER} && @collection.tt_classes:${alias}klasse.code ?= ${col}` +
  ` && @collection.tt_classes:${alias}klasse.teacherUid ?= @request.auth.id)` +
  ` || (${TT_TEACHER} && @collection.tt_class_teachers:${alias}co.classCode ?= ${col}` +
  ` && @collection.tt_class_teachers:${alias}co.teacherUid ?= @request.auth.id))`;

// --- Die Lehrkraft, die SELBST übt (03.09.2026) -------------------------------
// „Selbst üben" ist seit dem 01.09. eine ausdrücklich gebaute Funktion — aber
// `lw_progress`/`lw_events` liessen bis heute NUR `tt_pupils` schreiben. Gemessen
// an den Server-Protokollen: 39 + 15 abgewiesene Schreibversuche, ALLE von
// Lehrkräften, KEINER von einem Kind. In der Datenbank stand danach für 8
// Lehrkräfte keine einzige Zeile: Wer als Lehrkraft übte, begann bei jedem
// Seitenaufruf wieder bei null und bekam dazu den Warnstreifen zu lesen, der für
// Kinder geschrieben ist („sag es deiner Lehrkraft").
//
// ★★★ WARUM ZWEI BEDINGUNGEN UND NICHT EINE: `pupilUid = @request.auth.id`
// allein würde reichen, solange sich die Kennungen von `tt_pupils` und
// `tt_teachers` nie gleichen. Darauf ist kein Verlass — die Kennungen sind je
// Sammlung eindeutig, nicht sammlungsübergreifend. Das Paar
// (pupilUid = ich UND teacherUid = ich) trifft dagegen ausschliesslich die
// eigene Zeile einer Lehrkraft: Die Zeile eines Kindes trägt in `teacherUid`
// zwar die Kennung SEINER Lehrkraft, in `pupilUid` aber die des Kindes — beide
// Bedingungen zugleich kann sie nie erfüllen.
//
// ★★★ Beim Ändern sind Kennung und Programm GESPERRT (`:isset = false`) - für
// BEIDE Rollen. Der Grund liegt in PocketBase selbst: Die Änder-Regel wird
// gegen den BESTEHENDEN Datensatz geprüft, nicht gegen den Rumpf. Wer eine
// Zeile ändern darf, dürfte ohne diese Sperre im selben PATCH ihre Zuordnung
// umschreiben - die Regel hätte da längst „ja" gesagt.
//
//  • Eine Lehrkraft könnte ihre eigene Zeile auf die Kennung eines Kindes
//    umschreiben und ihm damit einen erfundenen Lernstand unterschieben.
//  • Ein Kind könnte seine eigene Zeile auf die Kennung eines ANDEREN Kindes
//    umschreiben (gefunden am 03.09.2026 bei der Lehrkraft-Umstellung, damals
//    bewusst nicht mitverändert). Es verlöre dabei seinen eigenen Fortschritt
//    UND legte dem anderen Kind eine Zeile unter, die dieses nie erzeugt hat.
//    Der eindeutige Index (pupilUid, program) fängt das NUR ab, solange das
//    andere Kind bereits eine Zeile hat - sonst gelingt es.
//
// Beides endet in einer Wertung über ein Kind, die es selbst nie erzeugt hat
// ([[feedback_nie_gegen_das_kind]]).
//
// ⚠️ Verträglichkeit: Das ist der Schreibweg ALLER Kinder. Er hält, weil kein
// Backend diese drei Felder beim Ändern je mitschickt - `upsertLw` sendet in
// allen vier Lernwerkstatt-Backends (tippen, braille, klangpunkte, im griff)
// nur data/classCode/updatedAtMs. Festgehalten in
// tests/tastenflow-lehrkraft-uebt-selbst.test.ts.
const LW_FELDER_GESPERRT =
  ` && @request.body.pupilUid:isset = false` +
  ` && @request.body.teacherUid:isset = false` +
  ` && @request.body.program:isset = false`;
const LW_SELBST_LEHRKRAFT_CREATE =
  `(${TT_TEACHER} && @request.auth.id = @request.body.pupilUid` +
  ` && @request.auth.id = @request.body.teacherUid)`;
const LW_SELBST_LEHRKRAFT_UPDATE =
  `(${TT_TEACHER} && @request.auth.id = pupilUid && @request.auth.id = teacherUid` +
  `${LW_FELDER_GESPERRT})`;
// Der Zweig der Kinder. Die Identitäts-Bedingung ist wortgleich mit
// `ttSelfPupil("pupilUid")`; dazu kommen NUR die drei Feldsperren. `ttSelfPupil`
// selbst bleibt unangetastet - es trägt auch das Lesen und Löschen.
const LW_KIND_UPDATE = `(${TT_PUPIL} && @request.auth.id = pupilUid${LW_FELDER_GESPERRT})`;
/** Wer eine `lw_*`-Zeile ANLEGEN darf: das Kind seine eigene, die Lehrkraft ihre eigene. */
const LW_CREATE =
  `(${TT_PUPIL} && @request.auth.id = @request.body.pupilUid) || ${LW_SELBST_LEHRKRAFT_CREATE}`;
/** Wer eine `lw_*`-Zeile ÄNDERN darf: dieselben zwei, jeder nur die eigene - und
 *  keiner darf dabei die Zuordnung verschieben (siehe LW_FELDER_GESPERRT). */
const LW_UPDATE = `${LW_KIND_UPDATE} || ${LW_SELBST_LEHRKRAFT_UPDATE}`;

// --- Lernwerkstatt-Nachrichten (lw_messages): Lehrkraft ↔ Schüler:in ----------
// App-ÜBERGREIFEND (eine Nachricht je Lehrkraft–Kind-Paar, chat-artig; das Kind
// sieht sie in JEDER Lernwerkstatt-App, da Konten geteilt sind — Memory:
// project_lernwerkstatt_unified). Strenge Isolation wie bei lw_progress.
//
// LESEN: Kind nur eigene; Lehrkraft über teacherUid ODER die Klasse (Co-Lehrkraft).
const LW_MSG_READ = `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`;
// ANLEGEN — zwei erlaubte Wege, beide hart an die Identität gepinnt:
//  • Kind: schreibt NUR an seine EIGENE Lehrkraft/Klasse. teacherUid/classCode
//    müssen mit den Feldern des Kind-Auth-Datensatzes übereinstimmen → ein Kind
//    kann KEINE fremde Lehrkraft anschreiben. (Nutzerwunsch: Kind darf auch
//    selbst beginnen, nicht nur antworten.)
const LW_MSG_CREATE_PUPIL =
  `(${TT_PUPIL} && @request.auth.id = @request.body.pupilUid` +
  ` && @request.body.senderRole = "pupil"` +
  ` && @request.body.teacherUid = @request.auth.teacherUid` +
  ` && @request.body.classCode = @request.auth.classCode)`;
//  • Lehrkraft: NUR an ein Kind der EIGENEN Klasse — sie muss die Klasse besitzen
//    (oder Co sein) UND das Kind muss in genau dieser Klasse sein (tt_pupils-Join).
//    So kann eine Lehrkraft kein fremdes Kind anschreiben.
const LW_MSG_CREATE_TEACHER =
  `(${TT_TEACHER} && @request.auth.id = @request.body.teacherUid` +
  ` && @request.body.senderRole = "teacher"` +
  ` && (${ttOwnsClass("@request.body.classCode")} || ${ttCoTeacher("@request.body.classCode")})` +
  ` && @collection.tt_pupils.id ?= @request.body.pupilUid` +
  ` && @collection.tt_pupils.classCode ?= @request.body.classCode)`;
const LW_MSG_CREATE = `${LW_MSG_CREATE_PUPIL} || ${LW_MSG_CREATE_TEACHER}`;
// AKTUALISIEREN = AUSSCHLIESSLICH den „gelesen“-Stempel setzen, je Rolle das
// EIGENE Feld (Kind: readPupilAtMs, Lehrkraft: readTeacherAtMs). Inhalt und
// Zuordnung bleiben unveränderlich (Feldsperren via :isset) → niemand kann den
// Text der Gegenseite verändern oder eine Lese-Markierung fälschen.
const LW_MSG_LOCK_COMMON =
  ` && @request.body.data:isset = false` +
  ` && @request.body.senderRole:isset = false` +
  ` && @request.body.teacherUid:isset = false` +
  ` && @request.body.pupilUid:isset = false` +
  ` && @request.body.classCode:isset = false` +
  ` && @request.body.createdAtMs:isset = false`;
const LW_MSG_UPDATE =
  `(${ttSelfPupil("pupilUid")}${LW_MSG_LOCK_COMMON} && @request.body.readTeacherAtMs:isset = false)` +
  ` || ((${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")})${LW_MSG_LOCK_COMMON} && @request.body.readPupilAtMs:isset = false)`;
const LW_MSG_DEL = `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`;

/** base collection: scalar filter columns + the full domain object in `data`. */
function base(name, cols, rules) {
  return {
    name,
    type: "base",
    fields: [...cols, { name: "data", type: "json", maxSize: 5_242_880 }],
    listRule: rules.list,
    viewRule: rules.view,
    createRule: rules.create,
    updateRule: rules.update,
    deleteRule: rules.del,
  };
}
const T = (name) => ({ name, type: "text" });
const N = (name) => ({ name, type: "number" });
const B = (name) => ({ name, type: "bool" });

const COLLECTIONS = [
  // Globale Plattform-Einstellungen (je EIN Datensatz pro key): u.a. die
  // editierbaren Willkommensmail-Vorlagen je Rolle (key="global") und die
  // Programm-Freigaben (key="programme-overrides", steuert welche Lern-Apps
  // öffentlich sind). Lesen sonst nur für Eingeloggte, Schreiben nur Admin.
  // AUSNAHME: "programme-overrides" ist anonym lesbar, damit die öffentlichen
  // Seiten /lernwerkstatt und /erleben die Freigaben ohne Login auswerten
  // (useProgrammeReleases) — der Inhalt ist ohnehin öffentlich sichtbar.
  // Der Hook course_access_mail liest serverseitig (rule-frei).
  base("appSettings", [T("key")], {
    list: `${SIGNED_IN} || key = "programme-overrides"`,
    view: `${SIGNED_IN} || key = "programme-overrides"`,
    create: ADMIN,
    update: ADMIN,
    del: ADMIN,
  }),

  // --- „Flinke Finger“ Tipptrainer (isoliertes Konto-System) ---------------
  // Lehrkräfte: offene Selbst-Registrierung (Nutzerwunsch). E-Mail+Passwort.
  {
    name: "tt_teachers",
    type: "auth",
    // Mindest-Passwortlänge 6 (PocketBase-Default 8 wäre für dieses kleine
    // Schul-Tool unnötig streng); überschreibt das System-Passwortfeld.
    // `bedienSprache` (EN9, 19.09.2026): "en", wenn die Lehrkraft Tastenflow
    // auf Englisch bedient (der Client schreibt es beim Umschalten, nur mit
    // Probe-Schalter). Danach richten sich IHRE Mails (Wochenbericht,
    // Tippchallenge, Begrüssung, Konto-Mails). Leer = Deutsch. Additiv; die
    // eigene updateRule lässt die Lehrkraft es selbst setzen.
    //
    // `spendenAufrufAm`/`spendenAufrufMeilenstein` (Nachbesserung 19.09.2026,
    // `lib/spendenbanner.ts`): wann zuletzt und bis zu welchem 5-Stunden-
    // Meilenstein der Spendenbanner GEZEIGT wurde - jetzt am KONTO statt nur
    // in `localStorage`, damit „nie öfter als alle zwei Monate" auch über
    // mehrere Geräte UND über alle Programme (Tastenflow/Punktgenau/»Im
    // Griff«, dieselbe Sammlung) hinweg gilt. Additiv, 0 = noch nie gezeigt.
    // Die Lehrkraft schreibt ihr eigenes Konto selbst (updateRule oben lässt
    // das ohnehin uneingeschränkt zu); kein Feld-Wächter nötig wie bei
    // `tt_pupils` unten.
    //
    // `neuigkeitenGesehen` (Z3, 19.09.2026, `src/lib/typing/neuigkeiten.ts`):
    // die Fassung des Fensters „Was gibt's Neues", die die Lehrkraft schon
    // quittiert hat (z. B. „2026-09-19") - am KONTO, damit es je Lehrkraft
    // EINMAL erscheint, nicht je Gerät. Additiv, leer = noch keine. Die
    // Lehrkraft schreibt es selbst (updateRule unten), kein Hook wacht über
    // die Felder von `tt_teachers`.
    //
    // `rundgaengeGesehen` (Z4, 19.09.2026, `src/lib/typing/rundgang.ts`): die
    // Schlüssel der Rundgänge beim ersten Betreten, die dieses Konto schon
    // gesehen hat (z. B. ["tastenflow-meine-klassen"]) - am KONTO, damit ein
    // zweites Gerät ihn nicht noch einmal zeigt. Additiv, leer = noch keiner.
    // Die Lehrkraft schreibt es selbst (updateRule unten).
    //
    // `gespendetAm` (19.09.2026, `src/lib/spendeBestaetigt.ts`): wann dieses
    // Konto nach einer BESTÄTIGTEN Spende (Rückkehr von Stripe auf
    // `/unterstuetzen/danke`) zurückkam, ms. Gesetzt ⇒ der Spendenbanner
    // kommt nie wieder, in keinem Programm (`spendenBannerFaellig`). Nur das
    // Datum - kein Betrag, keine Zahlungsdaten. Additiv, 0 = nie. Die
    // Lehrkraft schreibt es selbst (updateRule unten), kein Hook wacht über
    // die Felder von `tt_teachers`.
    //
    // `zeitzone` (D2, 28.09.2026, `src/lib/typing/zeitzone.ts`): die
    // Zeitzone des Geräts (IANA-Name, z. B. „America/Mexico_City") - danach
    // nennen Wochenbericht und Tippchallenge-Mail Uhrzeiten in IHRER Zeit
    // (`pb_hooks/tt_zeitzone_lib.pb.js`). Die App schreibt es bei jeder
    // Anmeldung, wenn es sich geändert hat - wie `bedienSprache`. Additiv,
    // leer = Wiener Zeit mit Zusatz in der Mail.
    //
    // `heimat` (16.11.2026, Johannes: „wenn man ein lehrerkonto erstellt und
    // plötzlich auf weingartner steht kennen sich die leute nicht mehr aus"):
    // die Adresse, auf der die Lehrkraft zuletzt angemeldet war - "tippen"
    // (tastenflow.org), "lexami" (lexami.org), leer = weingartner.org. Die App
    // schreibt es beim Anlegen und bei jeder Anmeldung; die Mails setzen danach
    // ihre Links (`pb_hooks/tt_heimat_lib.pb.js`). Additiv.
    fields: [
      { name: "password", type: "password", min: 6 },
      T("name"),
      N("createdAtMs"),
      T("bedienSprache"),
      T("zeitzone"),
      T("heimat"),
      N("spendenAufrufAm"),
      N("spendenAufrufMeilenstein"),
      N("gespendetAm"),
      T("neuigkeitenGesehen"),
      { name: "rundgaengeGesehen", type: "json", maxSize: 2000 },
    ],
    listRule: null, // niemand listet alle Lehrkräfte
    viewRule: "@request.auth.id = id", // nur das eigene Konto
    createRule: "", // offene Selbst-Registrierung (nur Lehrkraft-Konten)
    updateRule: "@request.auth.id = id",
    deleteRule: null, // nur Superuser
  },
  // Co-Lehrkräfte je Klasse (Join: Klassencode ↔ Lehrkraft-id). Eine Zeile = eine
  // zusätzliche Lehrkraft mit vollen Rechten auf die Klasse. Wird AUSSCHLIESSLICH
  // vom Server-Hook (pb_hooks/tt_coteacher.pb.js) mit Admin-Rechten gepflegt; für
  // den Client komplett gesperrt (alle Regeln null) — gelesen wird er nur über die
  // `@collection`-Korrelation in den Regeln oben (die die Sperre umgeht). So kann
  // niemand sich selbst zu einer fremden Klasse eintragen.
  // Hinweis (Reihenfolge): steht historisch vor tt_pupils/tt_classes/
  // tt_progress/tt_events, deren Regeln über @collection.tt_class_teachers
  // korrelieren. Seit der Zwei-Pass-Provisionierung (2026-07-13, siehe
  // ensureCollectionShell/applyCollectionRules) ist die Reihenfolge für
  // @collection-Cross-Joins NICHT mehr kritisch — die Regeln werden erst in
  // Pass 2 gesetzt, wenn alle Collections existieren. Die Anordnung bleibt der
  // Übersicht halber, ist aber keine harte Voraussetzung mehr.
  {
    name: "tt_class_teachers",
    type: "base",
    fields: [T("classCode"), T("teacherUid"), N("createdAtMs")],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE UNIQUE INDEX `idx_tt_class_teacher` ON `tt_class_teachers` (`classCode`, `teacherUid`)",
    ],
  },
  // Ausstehende Co-Lehrkraft-Einladungen (14.09.2026): Findet der add-Pfad in
  // tt_coteacher_lib.pb.js KEIN tt_teachers-Konto mit der eingegebenen E-Mail,
  // verschickt er statt eines Fehlers eine Einladungsmail mit Token-Link
  // (Landeplatz `/lernwerkstatt-einladung`). Wie tt_class_teachers oben
  // AUSSCHLIESSLICH vom Server-Hook gepflegt (Admin-Rechte) - für den Client
  // komplett gesperrt. Die Annahme-Seite liest die Einladung über den Hook
  // (invite-vorschau/invite-annehmen), nie direkt über pb.collection() - sonst
  // liesse sich mit einem erratenen Token eine E-Mail-Adresse erfragen.
  {
    name: "tt_class_teacher_invites",
    type: "base",
    fields: [
      T("classCode"), T("email"), T("token"), T("ownerUid"), T("teacherUid"),
      B("aktiv"), N("eingeladenAtMs"), N("eingeloestAtMs"),
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE UNIQUE INDEX `idx_tt_class_teacher_invites` ON `tt_class_teacher_invites` (`classCode`, `email`)",
      "CREATE INDEX `idx_tt_class_teacher_invites_token` ON `tt_class_teacher_invites` (`token`)",
    ],
  },
  // Klassen: gehören einer Lehrkraft. Klassencode global eindeutig.
  // `weeklyReport` (bool): wöchentlicher E-Mail-Bericht an die Lehrkraft (Cron
  // in pb_hooks/tt_weekly_report.pb.js); `data.lastReportWeek` merkt die zuletzt
  // berichtete Kalenderwoche (Idempotenz, kein Doppel-Versand).
  // Vor tt_pupils, weil tt_pupils über @collection.tt_classes korreliert.
  // Umbau Etappe 4a (2026-06-26): Feld `programs` (JSON-Liste freigeschalteter
  // Programm-Schlüssel, z. B. ["tippen","braille"]) für „Programme ankreuzen“.
  // Additiv + leer; die Lese-Logik behandelt leer/fehlend als „alle Programme
  // an" (Bestandsklassen ändern sich nicht). Noch NICHT verdrahtet (kommt später).
  // Additiv 2026-07-02: Feld `settings` (JSON) = Lern-Einstellungen der Klasse
  // für Punktgenau (freeChoice/extendedNumbers/expressComputer — die Lehrkraft
  // stellt ein). Kinder MÜSSEN ihre eigene Klasse dafür LESEN dürfen —
  // list/view daher zusätzlich fürs Kind der Klasse (classCode = code);
  // SCHREIBEN weiterhin nur Eigentümer:in/Co-Lehrkraft.
  //
  // ★★★ 2026-09-01 (N6, Wochengrenze am Unterrichtstag): `settings` trägt jetzt
  // zusätzlich
  //     unterrichtstag      Wochentag der Unterrichtsstunde, Mo=0 … So=6
  //     unterrichtstagAbMs  Zeitpunkt des Eintrags (Anker für „nie zum Nachteil")
  //
  // ⚠️ DAS IST KEINE SCHEMA-ÄNDERUNG. `settings` ist seit dem 02.07.2026 ein
  // JSON-Feld, und die Leserechte stimmen bereits: Ein Kind darf seine eigene
  // Klasse sehen (classCode = code) — genau das braucht es, damit die
  // Kind-Sicht dieselbe Wochengrenze rechnet wie die Lehrkraft-Sicht.
  // Ein NEUES Feld hätte die Deploy-Art »Update LMS (komplett)« erzwungen;
  // so genügt ein gewöhnlicher Deploy. Nachgesehen und nicht angenommen:
  // die Feldliste steht zwei Zeilen weiter unten.
  {
    // `lessonLocks` (07.09.2026, Johannes: „Ein Lehrer muss für ein Kind oder
    // die ganze klasse lektionen ein und ausstellen können"): Welche Lektionen
    // die Lehrkraft für die GANZE Klasse zurückhält, je Programm
    // (`{ tippen: ["home-fj", …], klangpunkte: [...] }`). Die Abweichung eines
    // EINZELNEN Kindes steht in `tt_pupils.lessonLocks`.
    //
    // ★ Ein eigenes Feld und NICHT in `settings`: Dort liegen die drei
    // Punktgenau-Lern-Einstellungen und die Wochengrenze, und `settings` hat
    // maxSize 2000. Rund 180 Lektionen über vier Programme passen zwar hinein,
    // aber nicht neben allem anderen - und ein volles Feld verlöre beim
    // nächsten Speichern still die Wochengrenze. Getrennte Sachen, getrennte
    // Felder.
    //
    // ⚠️ Das Kind DARF dieses Feld LESEN (die view-Regel unten lässt es die
    // eigene Klasse sehen) - anders ginge es nicht: Die Kinder-App muss wissen,
    // was offen ist. Schreiben darf es nur die Lehrkraft (update-Regel).
    //
    // ★★★ 11.09.2026 - KLASSEN-EINSTELLUNGEN (Johannes: „Jede Klasse hat also
    // nur eine Textstufe … Auch oben für die ganze Klasse kann man die Sprache
    // einstellen und ob man sie sperrt"). Bis dahin gab es auf Klassenebene
    // KEIN einziges Lern-Feld - Sprache, Sperre, Textstufe, Geburtsjahr hingen
    // alle am Kind, und „für alle übernehmen" schrieb N-mal einzeln.
    //
    //   schulstufe          1-13, 0 = nicht gesetzt. Daraus rechnet die App die
    //                       Textstufe (Alter = Schulstufe + 6) - und sie WÄCHST
    //                       MIT: jedes Schuljahr eine Stufe weiter.
    //   schulstufeSchuljahr Startjahr des Schuljahrs, in dem die Schulstufe
    //                       eingetragen wurde (2026 für 2026/27). Ohne dieses
    //                       Jahr wüsste niemand, wie oft schon weitergezählt
    //                       werden muss.
    //   lang                Inhaltssprache der Klasse (de/en), leer = Vorgabe.
    //   langLocked          Sprache für die Kinder gesperrt.
    //   klassenmatchAus     true = die Lehrkraft hat das Klassenmatch für diese
    //                       Klasse abgeschaltet. ★ Bewusst „Aus" und nicht
    //                       „Erlaubt": ein Bool-Feld ist neu immer false, und
    //                       die Vorgabe soll „erlaubt" sein - so braucht keine
    //                       bestehende Klasse eine Nachpflege.
    //   zeilenEndeEnter     ★ 23.09.2026: true = jedes Kind der Klasse schliesst
    //                       jede Übungszeile in `TypingSession` mit der
    //                       Eingabetaste ab (Anlass: eine 3. Klasse HAS, die für
    //                       die Büroarbeit lernt). Eigenes Bool-Feld, gleicher
    //                       Grund wie `klassenmatchAus`: neu immer false, die
    //                       Vorgabe bleibt „aus" - keine Bestandsklasse braucht
    //                       Nachpflege.
    //
    // ★★★ 11.09.2026 NACHT - STARTNIVEAU ALS VORGABE, SCHULSTUFE „ERWACHSEN".
    // Johannes wählte „Startniveau als Vorgabe an der Klasse speichern" und
    // schrieb: „Ja 1 aber auch die schulstufe soll der server für alle kinder
    // vorab dort speichern (und es soll eine Schulstufe "Erwachsen" geben)".
    //
    //   schulstufe = 100    „Erwachsen" (`SCHULSTUFE_ERWACHSEN` in
    //                       `src/lib/typing/klassenEinstellungen.ts`) - im
    //                       selben Zahlenfeld, kein zweites: „7. Schulstufe UND
    //                       erwachsen" wäre ein Zustand, den niemand meint. Wer
    //                       nur 1-13 kennt, liest 100 als „nicht gesetzt"
    //                       (Vorgabe), nie als falsche Stufe. Wächst nicht mit.
    //   startUnits          Startniveau der Klasse: so viele Lern-Einheiten
    //                       sind für JEDES Kind der Klasse frei - auch für eines,
    //                       das später beitritt. 0 = keine Vorgabe. Gleicher
    //                       Name und Typ wie `tt_pupils.startUnits`.
    //   startUnitsAt        Wann die Vorgabe zuletzt gesetzt wurde (ms). Wie am
    //                       Kind macht erst der Zeitstempel aus dem Wert einen
    //                       BESCHLUSS (Übergabe 04.09.2026 nachmittags §2): Ein
    //                       Kind mit einem EIGENEN, neueren Beschluss behält ihn;
    //                       sonst nimmt die Vorgabe nur DAZU
    //                       (`startpunktMitKlasse`, gerechnet beim Laden in
    //                       `useTypingAuth`, nichts wird ins Kind kopiert).
    //                       ⚠️ Die Kinder können `tt_classes` nicht schreiben
    //                       (update-Regel unten: nur Lehrkraft/Co-Lehrkraft) -
    //                       anders als bei `tt_pupils` braucht es darum keinen
    //                       Feld-Wächter-Hook.
    //   lernweg             ★ E1 (24.09.2026, Bauplan englischer Lehrgang
    //                       §2.2): "de"/"en" - der Lernweg für NEUE Kinder
    //                       dieser Klasse (wie `startUnits` nur eine Vorgabe).
    //                       Wird NIE auf ein bestehendes Kind angewandt. Leer =
    //                       „de". Additiv.
    //   schreibweise        ★ E9 (24.09.2026, Bauplan §8.2): "gb"/"us" - die
    //                       Vorgabe der Klasse für alle ihre Kinder, solange
    //                       keine EIGENE Wahl gespeichert ist (anders als
    //                       `lernweg`: eine Schreibweise darf jederzeit
    //                       wechseln, an ihr hängt keine Taste). Leer =
    //                       automatisch (Browser-Sprache entscheidet, F5).
    //                       Nur bei englischer Übungssprache von Bedeutung.
    //                       Additiv.
    //
    // ★ Alle diese Felder nimmt auch das ANLEGEN an (create-Regel prüft nur
    // Lehrkraft, Besitzer und Code; `tt_klasse.pb.js` nur den Code,
    // `tt_grenzen.pb.js` nur die Zahl der Klassen - geprüft 11.09.2026 Nacht).
    // Die Verwaltung schickt sie seither beim Anlegen in EINEM Aufruf mit.
    //
    // ★ Eigene Felder, nicht in `settings` - derselbe Grund wie bei
    // `lessonLocks` unten (2000 Bytes, ein volles Feld verliert still). Die
    // Kinder LESEN sie über die view-Regel (eigene Klasse); schreiben darf
    // nur die Lehrkraft. Die Kind-Felder `stufe`/`geburtsjahr`/`lang`/
    // `langLocked` bleiben im Schema für Selbstlernende ohne Klasse.
    // Deploy: neue Felder ⇒ »Update LMS (komplett)«.
    //
    // ★★★ Wochenziel NEU (W2, 18.09.2026, Bauplan §W/Entwurf §7f/§7g):
    //   wochenzielVorgabe  { minuten, wochen: string[], nachholen, am } - was
    //                      „für die Klasse einstellen" zuletzt geschrieben hat
    //                      (`setKlassenWochenziel`). NUR die Vorgabe für ein
    //                      SPÄTER beitretendes Kind (`addPupil`) - das Ziel
    //                      selbst bleibt JE KIND in `tt_pupils.wochenzielVerlauf`.
    //   gesperrteZeiten    Liste `{ abMs, bisMs }` - „eine Stunde sperren"
    //                      (`stundeSperren`/`sperreAufheben`). Übung darin
    //                      zählt überall sonst normal, nur nicht fürs
    //                      Wochenziel (`wochenziel.ts`, `inGesperrterZeit`).
    //                      Kinder LESEN es über dieselbe view-Regel wie
    //                      `settings` (eigene Klasse) - keine Regel geändert.
    //
    // ★★★★★ Z1 (19.09.2026) - DIE REIHE DER „EIGENEN ÜBUNGEN". Johannes: „Wenn
    // der Lehrer in der Zwischenzeit schon eine neue Übung gestartet hat, dann
    // kommt zuerst die alte und dann die neue."
    //   eigeneUebungen     Liste `{ textId, dateiname, gestartetAm, von }`,
    //                      älteste zuerst, höchstens 20
    //                      (`src/lib/typing/eigeneUebungReihe.ts`). „Eigene
    //                      Übung starten" HÄNGT AN - bis dahin ersetzte es den
    //                      einen Zeiger `settings.eigeneUebung`, und ein Kind,
    //                      das die alte Übung noch nicht geschrieben hatte,
    //                      bekam sie nie. Der alte Zeiger wird nur noch gelesen,
    //                      solange die Reihe leer ist (kein Datenumbau nötig),
    //                      und beim nächsten Start/Beenden geleert. Eigenes
    //                      Feld, nicht `settings` (2000 Bytes). Kinder LESEN es
    //                      über dieselbe view-Regel (eigene Klasse), schreiben
    //                      darf nur die Lehrkraft - keine Regel geändert.
    //                      Additiv ⇒ »Update LMS (komplett)«.
    //
    // ★★★ »Im Griff« (29.09.2026) - „KAPITEL MIT DER KLASSE STARTEN".
    //   imgriffKapitel     Liste `{ id, modul, level, gestartetAm, von }`,
    //                      höchstens 10 (`src/lib/computer/klassenKapitel.ts`).
    //                      Ein Kapitel ist Modul + Stufe, keine Lektions-ids -
    //                      jedes Gerät rechnet selbst aus, welche Lektionen das
    //                      für dieses Kind sind (Mac, Hilfsmittel). Dieselben
    //                      Regeln wie `eigeneUebungen`: Kinder LESEN über die
    //                      view-Regel der eigenen Klasse, schreiben darf nur
    //                      die Lehrkraft - keine Regel geändert. Additiv ⇒
    //                      »Update LMS (komplett)«.
    ...base("tt_classes", [T("code"), T("name"), T("teacherUid"), B("weeklyReport"), N("createdAtMs"), { name: "programs", type: "json", maxSize: 2000 }, { name: "settings", type: "json", maxSize: 2000 }, { name: "lessonLocks", type: "json", maxSize: 20000 }, N("schulstufe"), N("schulstufeSchuljahr"), T("lang"), B("langLocked"), B("klassenmatchAus"), N("startUnits"), N("startUnitsAt"), { name: "wochenzielVorgabe", type: "json", maxSize: 4000 }, { name: "gesperrteZeiten", type: "json", maxSize: 20000 }, { name: "eigeneUebungen", type: "json", maxSize: 10000 }, { name: "imgriffKapitel", type: "json", maxSize: 4000 }, B("zeilenEndeEnter"), { name: "gezielt", type: "json", maxSize: 2000 }, T("lernweg"), T("schreibweise")], {
      // Eigentümer:in ODER Co-Lehrkraft sieht/bearbeitet die Klasse; LÖSCHEN bleibt
      // bei der Eigentümer:in (eine Co-Lehrkraft soll die Klasse nicht entfernen).
      list: `${ttOwnerTeacher("teacherUid")} || ${ttCoTeacher("code")} || (${TT_PUPIL} && @request.auth.classCode = code)`,
      view: `${ttOwnerTeacher("teacherUid")} || ${ttCoTeacher("code")} || (${TT_PUPIL} && @request.auth.classCode = code)`,
      // ★ 10.09.2026 (Johannes): Der Klassencode ist PFLICHT - die Oberfläche
      // erzeugt keinen mehr von selbst. Ein Code aus Leerzeichen fängt
      // zusätzlich `tt_klasse.pb.js` ab.
      create: `${TT_TEACHER} && @request.auth.id = @request.body.teacherUid && @request.body.code != ""`,
      // ★ 10.09.2026: Den CODE ändert nur noch die Route
      // `/api/tt/klassencode-aendern` - in einer Transaktion mit den Kindern,
      // den Co-Lehrkräften und allem, was die Klasse über ihren Code findet.
      // Direkt über die Schnittstelle liesse sich der Code sonst ändern, und die
      // Kinder stünden mit einem Code da, den es nicht mehr gibt. Name,
      // Programme und Einstellungen bleiben direkt änderbar.
      update: `(${ttOwnerTeacher("teacherUid")} || ${ttCoTeacher("code")}) && (@request.body.code:isset = false || @request.body.code = code)`,
      del: ttOwnerTeacher("teacherUid"),
    }),
    indexes: ["CREATE UNIQUE INDEX `idx_tt_class_code` ON `tt_classes` (`code`)"],
  },
  // Schüler:innen: von der Lehrkraft angelegt. Login per synthetischer E-Mail
  // (= Klassencode+Name, in der App gebildet) + Passwort → von jedem Gerät.
  {
    name: "tt_pupils",
    type: "auth",
    // WICHTIG: Kinder haben nur eine erfundene `<code>__<name>@tt.local`-Adresse
    // (keine echte Mailbox). PocketBase verschickt sonst bei jeder Anmeldung von
    // einem neuen Gerät automatisch eine „Login from a new location“-Mail an diese
    // Adresse → die prallt ab und der Bounce landet beim Absender.
    // Darum die Login-Benachrichtigung für Schüler-Konten AUS. (Bei tt_teachers
    // bleibt sie an — die haben echte Adressen. 2026-07-08.)
    authAlert: { enabled: false },
    fields: [
      // Kinder-Passwörter dürfen kurz sein (mind. 4 Zeichen).
      { name: "password", type: "password", min: 4 },
      // ★★★★★ Klartext-Spiegel des Passworts (14.09.2026, Fund beim Test der
      // Teilnehmerliste: die Spalte blieb leer). `password` ist PocketBases
      // eingebautes Auth-Feld - gehasht gespeichert und von der API NIE
      // zurückgegeben, an niemanden, auch nicht an die eigene Lehrkraft über
      // die `viewRule`. Ein bestehendes Passwort lässt sich daraus also
      // grundsätzlich nicht mehr auslesen, gleich wie die Regeln stehen.
      // ⇒ `passwordPlain` ist ein gewöhnliches Textfeld mit DERSELBEN
      // `viewRule`/`listRule` wie der Rest des Datensatzes (Lehrkraft der
      // Klasse oder das Kind selbst) - keine weitere Öffnung. Geschrieben
      // wird es NUR an den zwei Stellen, die auch das echte Passwort setzen
      // (`addPupil`, `resetPupilPassword` in `pbBackend.ts`), im selben
      // Aufruf, aus derselben Variable.
      // ⚠️ Kein `hidden: true`: Ein verstecktes Feld nimmt von einer
      // Nicht-Superuser-Schreibung auch keinen WERT mehr an (gemessen an
      // `ma_loesungen_blind.pb.js`, 08.09.2026) - die Lehrkraft, die ein Kind
      // anlegt, ist keine Superuserin, das Anlegen liefe leer. Auch kein
      // Blind-Hook nach dessen Vorbild nötig: Anders als bei `ma_solutions`
      // ist hier niemand mit Schreibrecht (`createRule`/`updateRule`/
      // `manageRule`) weiter gefasst als die `viewRule` - eine
      // Schreib-Antwort zeigt darum nie mehr, als dieselbe Person ohnehin
      // per GET sähe.
      // ⚠️ Gegen Verfälschung durch das Kind selbst: in der LOCKED-Liste von
      // `tt_pupils_field_guard.pb.js` - sonst könnte ein Kind per PATCH einen
      // falschen Text hineinschreiben, den die Lehrkraft gutgläubig
      // ausdruckt und weitergibt.
      // ⏳ Gilt nur für Passwörter, die NACH diesem Feld gesetzt oder
      // zurückgesetzt wurden. Für ältere Konten bleibt die Spalte leer, bis
      // einmal zurückgesetzt wird - ein rückwirkendes Auslesen ist unmöglich
      // (das gehashte `password` ist unumkehrbar).
      // ★★★★★ SEIT 26.09.2026 VERSCHLÜSSELT GESPEICHERT - trotz des Namens.
      // In der Datenbank steht `enc:v1:<AES-256-GCM>`, Schlüssel aus der
      // Dienst-Umgebung `TT_PASSWORT_SCHLUESSEL` (32 Zeichen). Verschlüsselt
      // wird in einem MODELL-Hook (jeder Schreibweg), entschlüsselt nur in der
      // Antwort an die Lehrkraft der Klasse (onRecordEnrich) und für die
      // Passwort-Mail; das Kind selbst und alle anderen bekommen das Feld
      // nicht mehr zu sehen. `pbBackend.ts` schreibt und liest weiter Klartext -
      // es merkt nichts davon. Alles dazu:
      // `pb_hooks/tt_pupils_passwort_verschluesseln_lib.pb.js`.
      T("passwordPlain"),
      // ★★★★ Kontakt-E-Mail (optional, 14.09.2026, Wunsch Johannes). NICHT das
      // eingebaute Auth-Feld `email` oben - das trägt bei Klassen-Kindern die
      // ERFUNDENE Login-Adresse (`synthEmail()`, `<code>__<name>@tt.local`),
      // an der `loginPupil()` hängt; die bleibt unverändert. `contactEmail`
      // ist eine echte, frei wählbare Adresse - Kind oder Erziehungs-
      // berechtigte, die App legt sich nicht fest. Ist sie gesetzt, schickt
      // `tt_pupils_passwort_mail.pb.js` nach dem Anlegen und nach jedem
      // Zurücksetzen automatisch das aktuelle Passwort dorthin (liest
      // `passwordPlain`, siehe oben). Nur die Lehrkraft darf sie setzen - in
      // der LOCKED-Liste von `tt_pupils_field_guard.pb.js`, sonst könnte ein
      // Kind sein eigenes Passwort an eine fremde Adresse umleiten.
      T("contactEmail"),
      T("name"),
      T("classCode"),
      T("teacherUid"),
      T("stufe"),
      // Geburtsjahr — NUR die Jahreszahl (Datenminimierung, Bauplan 14.08. §0b.3,
      // 15.08.2026). Freiwillig; 0/leer = nicht angegeben. Ist es gesetzt und
      // wurde KEINE Stufe ausdrücklich gewählt (`stufe` leer), leitet die App die
      // Textstufe daraus ab — sie wächst dann von selbst mit dem Kind mit
      // (`lib/typing/account.stufeFuer`). Eine gewählte Stufe hat immer Vorrang.
      // Setzen darf es die Lehrkraft; ein Konto OHNE Lehrkraft (selfManaged)
      // sich selbst (siehe tt_pupils_field_guard). Additiv, Default 0.
      N("geburtsjahr"),
      // Sprache der Übungsinhalte (de/en).
      T("lang"),
      // Sprache der BEDIENUNG (EN9, 19.09.2026) - nicht der Übungsinhalte: "en",
      // wenn das Konto Tastenflow auf Englisch bedient (Client schreibt es beim
      // Umschalten, nur mit Probe-Schalter). Danach richten sich die Mails AN
      // dieses Konto (Wochenbericht der Selbstlernenden, Löschwarnung,
      // Konto-Mails, Zugangsdaten an die Kontakt-Adresse). Leer = Deutsch. Das
      // Kind darf es selbst setzen (tt_pupils_field_guard sperrt es NICHT,
      // prüft nur den Wert). Additiv.
      T("bedienSprache"),
      // Zeitzone des Geräts (D2, 28.09.2026) - nur selbstlernende Konten
      // schreiben sie (der Abgleich bei der Anmeldung, wie `bedienSprache`);
      // danach richten sich Uhrzeiten in Mails an dieses Konto. Der Guard
      // (tt_pupils_field_guard) prüft nur die Form. Additiv, leer = Wien.
      T("zeitzone"),
      // Sprach-Sperre: Lehrkraft legt die Inhaltssprache für dieses Kind fest,
      // das Kind kann sie dann nicht mehr umstellen (der Server-Guard
      // tt_pupils_field_guard erzwingt das). Additiv, Default leer/false.
      B("langLocked"),
      T("tempo"),
      N("startUnits"),
      // Wann der Startpunkt zuletzt eingestellt wurde (ms, 04.09.2026). Erst
      // der Zeitstempel macht aus dem Wert einen BESCHLUSS - und nur ein
      // Beschluss darf ZURÜCKSTUFEN, und zwar genau einmal
      // (`letters.startpunktAnwenden`). Johannes: „Lehrer dürfen ihre Schüler
      // auch downgraden … wer sich sein Startlevel einstellen kann, soll es
      // auch wieder weniger hoch stellen können." Additiv, Default 0 = kein
      // Beschluss ⇒ es bleibt bei der nur dazunehmenden Angleichung. Schutz
      // wie `startUnits` in tt_pupils_field_guard.
      N("startUnitsAt"),
      // ★ E1 (24.09.2026, `apps/tastenflow/BAUPLAN-2026-09-24-ENGLISCHER-
      // LEHRGANG.md` §2.2): der LERNWEG - "de" oder "en", in welcher
      // Reihenfolge die Tasten kommen. Leer = „de" (jedes Bestandskonto).
      // Beim ersten Fortschritt EINMAL gesetzt; danach fest -
      // tt_pupils_field_guard lässt ihn nur schreiben, solange er leer ist
      // (für alle ausser Superusern). Beim Anlegen nimmt
      // tt_pupils_selfsignup nur "de"/"en" an. Additiv.
      T("lernweg"),
      // Wochenziel: Mindest-Minuten je Übungseinheit + Einheiten pro Woche.
      N("goalMinutes"),
      N("goalUnits"),
      // Ziel-Kalenderwochen (ISO-Schlüssel) + ob Verpasstes nachgeholt werden muss.
      { name: "goalWeeks", type: "json", maxSize: 4000 },
      B("goalCatchUp"),
      // „Überfällige zurücksetzen“ (Johannes 15.07.): Stich-KW (ISO). Wochen davor zählen
      // nicht mehr als verpasste Ziel-Woche. Leer = nie zurückgesetzt.
      T("goalResetWeek"),
      // Einzeln ERLASSENE Wochen (Befund 16.09.2026, z. B. bei Krankheit) - dasselbe
      // Format wie goalWeeks. Eine hier genannte Woche zählt nie als versäumt/nachzuholen.
      { name: "goalExcusedWeeks", type: "json", maxSize: 4000 },
      // ★★★ Wochenziel NEU (W2, 18.09.2026, Bauplan §W/Entwurf §7f/§7g,
      // `src/lib/typing/wochenziel.ts`): Minuten je Woche, OHNE Einheiten -
      // Liste von Abschnitten `{ ab: "2026-W39", minuten }`. Ersetzt
      // `goalMinutes`/`goalUnits` als Rechengrundlage, sobald nicht-leer;
      // die beiden alten Zahlenfelder bleiben unverändert stehen (Rückweg +
      // lazy Umrechnung, `kindWochenzielAusFeldern`). In einer Klasse schreibt
      // es NUR die Lehrkraft; ein Konto OHNE Lehrkraft (selfManaged) setzt
      // sein Wochenziel seit 19.09.2026 selbst im Zahnrad, samt goalWeeks und
      // goalCatchUp - geschützt in tt_pupils_field_guard.pb.js.
      { name: "wochenzielVerlauf", type: "json", maxSize: 4000 },
      // im Griff (P1): Hilfsmittel-Profil + Kompetenzstufe. Optional, leer = nicht gesetzt.
      T("toolProfile"),  // "" | "bildschirmlupe" | "nvda" | "jaws"
      T("skillLevel"),   // "" | "L1" | "L1plus" | "L2" | "L3"
      // Einhand schreiben: Lehrkraft schaltet die Umschalt-Gegenhand-Regel für
      // dieses Kind AUS (z. B. wer nur mit einer Hand tippt). Default false = an.
      // Ein Konto OHNE Lehrkraft (selfManaged) legt es seit 19.09.2026 selbst
      // um, wie „Zeit lassen" (siehe tt_pupils_field_guard).
      B("oneHand"),
      // ★ „Gezielt üben" (13.11.2026): { zeichen: string[], anteil, bis } - einzelne
      // Tasten/Zeichen, die gezielt geübt werden (max. 8). Lehrkraft für ihr Kind,
      // Konto ohne Lehrkraft (selfManaged) für sich (siehe tt_pupils_field_guard).
      // Additiv, leer = nicht gesetzt (wie die Klasse). Modell: src/lib/typing/gezielt.ts.
      { name: "gezielt", type: "json", maxSize: 2000 },
      // „Zeit lassen“ (14.08.2026): Für dieses Kind zählt das Tempo nirgends —
      // keine Zeitfenster im Spiel, kein Tempo-Ziel bei den Sternen, kein Auf-
      // und Abstieg der Leistungsstufe. Die Lehrkraft setzt es; ein Konto OHNE
      // Lehrkraft (selfManaged) darf es selbst umlegen (siehe
      // tt_pupils_field_guard). Additiv, Default false.
      B("noTimePressure"),
      // ★★★ „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026, Wunsch
      // Johannes): grösserer Abstand zwischen JEDEM Zeichen beim Abschreiben -
      // für Kinder mit zerebraler Sehbehinderung (CVI), bei denen eng
      // stehende Zeichen ineinanderlaufen (Crowding). Der Wert TRÄGT den
      // Faktor selbst: 1 = aus, 2 = doppelt, 3 = dreifach, 4 = vierfach
      // (0/fehlend bei Alt-Konten ist gleichbedeutend mit „aus" -
      // `zeichenabstandFaktor` normalisiert). Seit 19.09.2026 stellt ihn
      // JEDES Kind selbst ein, auch eines einer Klasse, und die Lehrkraft
      // weiter in „Meine Klassen" - wer zuletzt stellt, gilt. Der Wächter
      // tt_pupils_field_guard prüft nur den Wert (1-4). Additiv, Default 0.
      N("zeichenabstand"),
      // ★ 25.09.2026 (Johannes): eigene SCHULSTUFE dieses Kindes in Tastenflow -
      // sie gilt statt der Schulstufe der Klasse (Vorrang in `useTypingAuth`,
      // `mitKlassenVorrang`). Dieselben Werte wie `tt_classes.schulstufe`:
      // 0 = wie die Klasse, 1-13, 100 = Erwachsen; `schulstufeSchuljahr` ist das
      // Schuljahr der Eingabe, damit sie jedes Jahr mitwächst wie die der Klasse.
      // Nur die Lehrkraft schreibt sie (LOCKED in tt_pupils_field_guard.pb.js).
      // Additiv, Default 0.
      N("schulstufe"),
      N("schulstufeSchuljahr"),
      // ★★★ „Vorlesen bei Prüfungen erlaubt" (10.09.2026, ersetzt den
      // Zeitzuschlag vom 09.09.): true = dieses Kind bekommt in der
      // Tippchallenge vorgelesen, und die Wartezeit auf die Stimme wird von der
      // Prüfungszeit abgezogen. Ohne das Häkchen ist das Vorlesen dort stumm -
      // sonst bekäme ein Kind, das den Text sieht, Zeit gutgeschrieben.
      // Additiv, Default false. Geschützt in tt_pupils_field_guard.pb.js.
      B("vorlesenPruefung"),
      // ★★ „Bereit für die Tippchallenge" (10.09.2026, Johannes: „das Fenster
      // soll bei allen Kindern schnell kommen" - und die Lehrkraft soll sehen,
      // wer es schon hat). Form `{ probeId, ms }`: Das Gerät des Kindes meldet,
      // sobald es den Plan der angesetzten Challenge kennt, und danach
      // höchstens jede Minute als Lebenszeichen, solange sie angesetzt ist.
      // Das KIND schreibt es (steht bewusst NICHT in der LOCKED-Liste von
      // tt_pupils_field_guard.pb.js); die ZEIT setzt der Server dort selbst -
      // die Uhr eines Schulgeräts kann falsch gehen. Additiv, Default leer.
      { name: "probeBereit", type: "json", maxSize: 200 },
      // --- Selbstlernende (09.08.2026, Wunsch Johannes) -----------------------
      // Bis hierher legte IMMER eine Lehrkraft ein Kind an. Jetzt kann sich
      // jemand auch SELBST anmelden — ohne Klasse und ohne Lehrkraft. Solche
      // Konten haben `selfManaged = true`, KEINEN classCode, KEINE teacherUid
      // und eine ECHTE E-Mail-Adresse (statt der synthetischen `…@tt.local`).
      // Sie sind damit die einzigen Schüler-Konten, die selbst Post bekommen:
      // Wochenbericht montags (nur wenn geübt wurde) und die Inaktivitäts-
      // Warnung nach einem Jahr.
      B("selfManaged"),
      // Zuletzt angemeldet (ms). Wird beim Login gesetzt; zusammen mit den
      // lw_*-Zeitstempeln entscheidet er über „ein Jahr nichts getan“.
      N("lastSeenAtMs"),
      // Wann die Inaktivitäts-Warnung verschickt wurde (0 = nie). Drei Wochen
      // danach wird gelöscht — es sei denn, es gab wieder Aktivität.
      N("inactiveNoticeAtMs"),
      // Zuletzt berichtete ISO-Kalenderwoche (z. B. „2026-W32“). Verhindert,
      // dass ein zweiter Cron-Lauf dieselbe Wochenmail noch einmal schickt —
      // dasselbe Muster wie `tt_classes.data.lastReportWeek`.
      T("lastReportWeek"),
      // Abbestellen des Wochenberichts (23.08.2026, Johannes: „sonst heißt es,
      // wir sind Spamer"): true = der montägliche Übe-Bericht geht NICHT mehr
      // an dieses Konto. Zwei Wege führen hierher: der Ein-Klick-Link in der
      // Fußzeile der Mail (Route /api/sensorik/mail/abbestellen) und der
      // Umschalter unter „Meine Zugangsdaten“ — der ihn auch wieder AUSschaltet.
      // Betrifft nur selbstverwaltete Konten; Klassen-Kinder bekommen ohnehin
      // keine Post. Additiv, Default false = Bericht kommt wie bisher.
      // Das Kind darf dieses Feld SELBST setzen: es steht bewusst NICHT in der
      // LOCKED-Liste von tt_pupils_field_guard.pb.js — anders als Tempo oder
      // Wochenziel ist es keine Lehrkraft-Einstellung, sondern die Antwort auf
      // die Frage, wer Post haben möchte.
      B("mailWeeklyOptOut"),
      // Lektionen für DIESES Kind abweichend von der Klasse (07.09.2026).
      // Form: `{ <programm>: { zu: [...ids], auf: [...ids] } }` — zwei Listen,
      // weil „für ein Kind oder die ganze Klasse" beide Richtungen braucht:
      // das Kind, das noch nicht so weit ist (`zu`), und das Kind, das schon
      // weiter ist als seine Klasse (`auf`). Mit nur einer Sperrliste ließe
      // sich eine Klassensperre für ein einzelnes Kind nie aufheben.
      // Die Klassen-Vorgabe steht in `tt_classes.lessonLocks`.
      //
      // ★★ Das Kind darf das NICHT selbst setzen — es steht in der LOCKED-Liste
      // von tt_pupils_field_guard.pb.js. Ohne diesen Eintrag könnte sich jedes
      // Kind per PATCH jede zurückgehaltene Lektion selbst aufsperren; die
      // updateRule erlaubt ihm ja, den eigenen Datensatz zu schreiben.
      // Additiv, Default leer = das Kind folgt seiner Klasse.
      { name: "lessonLocks", type: "json", maxSize: 20000 },
      // ★ Beschlüsse der Lehrkraft für PLUS (23.09.2026) - eigene Schulstufe
      // eines Kindes und Einstufungen je Übung („sitzt" / „noch einmal üben"),
      // je mit Zeitstempel. Dasselbe Muster wie `startUnits`/`startUnitsAt`:
      // Die Lehrkraft schreibt NUR hierher, das Kind übernimmt beim nächsten
      // Öffnen von Plus in seinen eigenen Fortschritt (`lw_progress` darf
      // weiter nur das Kind schreiben). Form und Prüfung:
      // `src/lib/plus/beschluss.ts`.
      // ★★ Das Kind darf das NICHT selbst setzen - LOCKED in
      // tt_pupils_field_guard.pb.js. Sonst stellte es sich per PATCH jede
      // Übung auf „sitzt". 161 Übungen × ~45 Zeichen ≈ 7 kB, darum 20000.
      // Additiv, Default leer = nichts beschlossen.
      { name: "plusBeschluss", type: "json", maxSize: 20000 },
      N("createdAtMs"),
      // `spendenAufrufAm`/`spendenAufrufMeilenstein` (Nachbesserung 19.09.2026,
      // `lib/spendenbanner.ts`): dasselbe Paar wie oben bei `tt_teachers" - hier
      // nur für SELBSTLERNENDE Konten ohne Klasse befüllt (ein Kind einer
      // Klasse bekommt den Spendenbanner nie, siehe `SpendenBanner.tsx`).
      // Additiv, 0 = noch nie gezeigt. ⚠️ BEWUSST NICHT in der LOCKED-Liste
      // von `tt_pupils_field_guard.pb.js` - ein Kind einer Klasse sieht den
      // Banner ohnehin nie, und ein selbstlernendes Konto muss sein EIGENES
      // Popup selbst quittieren können, ohne eine Lehrkraft zu brauchen, die
      // es gar nicht hat.
      N("spendenAufrufAm"),
      N("spendenAufrufMeilenstein"),
      // `gespendetAm` (19.09.2026, `src/lib/spendeBestaetigt.ts`): dasselbe Feld
      // wie oben bei `tt_teachers` - eine BESTÄTIGTE Spende dieses Kontos, ms;
      // danach kein Spendenbanner mehr. Additiv, 0 = nie. ⚠️ BEWUSST NICHT in
      // der LOCKED-Liste von `tt_pupils_field_guard.pb.js`: Das eigene Konto
      // setzt es selbst (mit der unveränderten `teacherUid`). Ein Kind EINER
      // Klasse bekommt den Banner ohnehin nie - das Feld ist bei ihm ohne
      // Wirkung.
      N("gespendetAm"),
      // `rundgaengeGesehen` (Z4, 19.09.2026, `src/lib/typing/rundgang.ts`): dasselbe
      // Feld wie oben bei `tt_teachers` - welche Rundgänge beim ersten Betreten
      // dieses Konto (Kind einer Klasse oder Selbstlernende) schon gesehen hat.
      // Additiv, leer = noch keiner. ⚠️ BEWUSST NICHT in der LOCKED-Liste von
      // `tt_pupils_field_guard.pb.js`: Das Kind schreibt es für SICH selbst
      // (mit der unveränderten `teacherUid`, `selfPupilFields` in
      // `pbBackend.ts`) - es sagt nur, ob ihm ein Rundgang schon gezeigt wurde.
      { name: "rundgaengeGesehen", type: "json", maxSize: 2000 },
    ],
    // Lehrkräfte der Klasse (Eigentümer:in ODER Co-Lehrkraft) listen/sehen ihre
    // Schüler:innen; das Kind sieht sich selbst. Über den Klassencode (classCode)
    // statt der Pupil-teacherUid — so sieht die Eigentümer:in auch Kinder, die eine
    // Co-Lehrkraft angelegt hat, und umgekehrt.
    listRule: ttClassStaff("classCode"),
    viewRule: `${ttSelfPupil("id")} || ${ttClassStaff("classCode")}`,
    // Eine Lehrkraft legt Schüler:innen mit sich selbst als teacherUid an. Volle-
    // Rechte-Co-Lehrkräfte dürfen das ebenfalls (sie setzen sich selbst ein); die
    // Sichtbarkeit für die übrigen Lehrkräfte läuft über den Klassencode.
    // ZWEI Wege, ein Konto anzulegen:
    //  1. Die Lehrkraft legt ein Kind ihrer Klasse an (der Normalfall).
    //  2. SELBSTANMELDUNG (09.08.2026): jemand ohne Klasse und ohne Lehrkraft.
    //     Ohne Anmeldung erlaubt — wie jede Registrierung —, aber hart
    //     eingegrenzt: `selfManaged` MUSS gesetzt sein, classCode und
    //     teacherUid MÜSSEN leer bleiben. Damit kann sich niemand über diesen
    //     Weg in eine fremde Klasse schreiben oder sich einer Lehrkraft
    //     unterschieben. Zusätzlich prüft der Hook `tt_pupils_selfsignup`
    //     server-seitig E-Mail und Passwortlänge (fail-closed).
    createRule:
      `(${TT_TEACHER} && @request.auth.id = @request.body.teacherUid)` +
      ` || (@request.body.selfManaged = true` +
      ` && @request.body.classCode = ""` +
      ` && @request.body.teacherUid = "")`,
    // Lehrkräfte der Klasse oder das Kind selbst (Stufe; teacherUid bleibt fix).
    //
    // ★★★ LOCH GESCHLOSSEN (10.09.2026, beim Bau von „In andere Klasse
    // verschieben"): Diese Regel prüfte nur die BISHERIGE Klasse. PocketBase
    // wertet eine updateRule gegen den GESPEICHERTEN Datensatz aus - eine
    // Lehrkraft konnte darum `classCode` per PATCH auf eine beliebige fremde
    // Klasse setzen und dieser Klasse ein Kind unterschieben (oder `teacherUid`
    // auf eine fremde Lehrkraft). Jetzt gilt für den Lehrkraft-Weg:
    //  • `classCode` nur, wenn sie AUCH in der neuen Klasse Eigentümer:in oder
    //    Co-Lehrkraft ist,
    //  • `teacherUid` gar nicht.
    // Das Verschieben in eine FREMDE Klasse (Entscheidung Johannes: jede Klasse,
    // deren Code man kennt) geht ausschliesslich über die Route
    // `/api/tt/kind-verschieben` - dort mit allen Prüfungen und in einer
    // Transaktion.
    // ⚠️ Die zweite Klassen-Prüfung braucht EIGENE Aliase
    // (`@collection.tt_classes:neuklasse`). Ohne Alias zeigten beide Prüfungen
    // auf DIESELBE Join-Zeile, und die müsste gleichzeitig den alten und den
    // neuen Code tragen - die Regel hiesse dann still „nie ändern".
    updateRule:
      `(${ttSelfPupil("id")} && @request.body.teacherUid = teacherUid)` +
      ` || (${ttClassStaff("classCode")}` +
      ` && (@request.body.classCode:isset = false || @request.body.classCode = classCode || ${ttClassStaffAlias("@request.body.classCode", "neu")})` +
      ` && (@request.body.teacherUid:isset = false || @request.body.teacherUid = teacherUid))`,
    // „Manage“-Regel: Lehrkräfte der Klasse dürfen sensible Auth-Felder (Login-
    // E-Mail beim Code-Wechsel, Passwort-Reset) ihrer Kinder ändern. Scoped auf
    // die Klasse → kein fremder Zugriff. Siehe [[feedback_security_first]].
    manageRule: ttClassStaff("classCode"),
    // Löschen: die Lehrkraft der Klasse — oder ein selbstlernendes Konto sich
    // selbst (dort gibt es keine Lehrkraft, die es täte; DSGVO-Auskunft/Löschung
    // muss ohne Umweg möglich sein).
    deleteRule: `${ttClassStaff("classCode")} || (${ttSelfPupil("id")} && selfManaged = true)`,
  },
  // Fortschritt: ein Datensatz je Kind. Kind schreibt den eigenen; Lehrkraft
  // liest (Statistik), schreibt aber NICHT (Datentransparenz: nie mehr Rechte
  // als das Kind selbst).
  // `classCode`: denormalisiert (vom Kind beim Schreiben gesetzt), damit eine
  // Co-Lehrkraft den Fortschritt über den Klassencode lesen darf (ttCoTeacher).
  // Der Eigentümer:innen-Zugriff läuft weiter über teacherUid (auch für Altstände
  // ohne classCode); zusätzlich über die Klasse (ttOwnsClass) für von Co-Lehrkräften
  // angelegte Kinder. Geschrieben wird WEITER nur vom Kind selbst.
  {
    ...base("tt_progress", [T("pupilUid"), T("teacherUid"), T("classCode"), N("updatedAtMs")], {
      list: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
      view: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
      create: `${TT_PUPIL} && @request.auth.id = @request.body.pupilUid`,
      update: ttSelfPupil("pupilUid"),
      del: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
    }),
    indexes: ["CREATE UNIQUE INDEX `idx_tt_prog_pupil` ON `tt_progress` (`pupilUid`)"],
  },
  // Übungs-Telemetrie: ein Datensatz je Kind (gekappte Liste im `data`-Feld).
  {
    ...base("tt_events", [T("pupilUid"), T("teacherUid"), T("classCode"), N("updatedAtMs")], {
      list: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
      view: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
      create: `${TT_PUPIL} && @request.auth.id = @request.body.pupilUid`,
      update: ttSelfPupil("pupilUid"),
      del: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
    }),
    indexes: ["CREATE UNIQUE INDEX `idx_tt_ev_pupil` ON `tt_events` (`pupilUid`)"],
  },

  // --- Schreibprobe: die Ergebnisse (09.09.2026) ----------------------------
  // Eine Zeile je Kind UND Schreibprobe. Der volle Bericht (Tasten, Wartezeit,
  // Zeitzuschlag) steckt in `data`; die Spalten daneben sind das, wonach
  // sortiert und gefiltert wird - und das, was der Mail-Hook liest, ohne das
  // JSON auspacken zu müssen.
  //
  // ★★★★★ WARUM DAS KIND HIER NUR `create` DARF UND KEIN `update`:
  // Eine Prüfung, die man zweimal abgeben kann, ist keine. Überall sonst in
  // dieser App gilt „das Kind schreibt seine eigene Zeile" (lw_progress) - und
  // das ist dort richtig, weil ein Fortschritt fortgeschrieben wird. Ein
  // Prüfungsergebnis wird NICHT fortgeschrieben. Es entsteht einmal und bleibt
  // dann stehen; wer es ändern darf, kann nach der Abgabe nachbessern.
  // Der UNIQUE-Index über (pupilUid, probeId) ist der zweite Riegel: Auch ein
  // zweites `create` zur selben Probe wird abgewiesen.
  //
  // LÖSCHEN darf nur die Lehrkraft - ein Kind, das seine eigene Zeile löschen
  // könnte, hätte den ersten Riegel umgangen (löschen, neu anlegen).
  {
    ...base(
      "tt_schreibproben",
      [
        T("pupilUid"),
        T("teacherUid"),
        T("classCode"),
        // Kennung der Schreibprobe (aus `tt_classes.settings.schreibprobe.id`).
        T("probeId"),
        T("niveau"),
        N("textNr"),
        N("beginnAtMs"),
        N("endeAtMs"),
        // Die drei Zahlen, die in jeder Liste stehen - als Spalten, damit
        // Sortieren und der Mail-Hook ohne JSON-Auspacken auskommen.
        N("anschlaege"),
        N("genauigkeit"),
        N("zeichen"),
        N("fehler"),
        // Ist die Sammel-Mail an die Lehrkraft für diese Probe schon raus?
        // Gesetzt vom Hook, nie von der App.
        N("gemeldetAtMs"),
      ],
      {
        list: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
        view: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
        // Nur das Kind selbst, nur für sich - und die Zuordnung muss stimmen.
        create: `${TT_PUPIL} && @request.auth.id = @request.body.pupilUid`,
        // ⚠️ ABSICHTLICH NIEMAND. Siehe der Absatz oben.
        update: null,
        del: `${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
      },
    ),
    indexes: [
      "CREATE UNIQUE INDEX `idx_tt_sp_pupil_probe` ON `tt_schreibproben` (`pupilUid`, `probeId`)",
      "CREATE INDEX `idx_tt_sp_class` ON `tt_schreibproben` (`classCode`, `probeId`)",
    ],
  },

  // --- Eigene Texte: hochgeladene Übungs-/Prüfungstexte (17.09.2026) ---------
  // Eine Zeile je Upload - für „Eigene Übung" UND die Tippchallenge mit
  // eigener Datei (`tt_classes.settings` verweist per Id darauf, genau wie
  // beim `schreibprobe`-Zeiger; das JSON dort ist auf 2000 Byte gedeckelt,
  // der Text selbst liegt im automatischen `data`-Feld von `base()`, 5 MB).
  //
  // ⚠️ ANDERS ALS `tt_schreibproben`: Dort sieht jedes Kind nur seine EIGENE
  // Zeile (eine Prüfung ist pro Kind). Hier muss die GANZE Klasse dieselbe
  // Zeile lesen - Vorbild ist darum `tt_classes` selbst (Zeile 1342f.), nicht
  // `tt_schreibproben`.
  //
  // Ein neuer Upload legt eine NEUE Zeile an (`update: null`, wie bei den
  // Schreibprobe-Ergebnissen) - der Zeiger zeigt dann auf die neue Zeile, die
  // alte bleibt unverändert liegen (harmlos, nicht aufräumen).
  {
    ...base("tt_eigene_texte", [T("classCode"), T("teacherUid"), T("dateiname")], {
      list: `${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")} || (${TT_PUPIL} && @request.auth.classCode = classCode)`,
      view: `${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")} || (${TT_PUPIL} && @request.auth.classCode = classCode)`,
      // Nur eine Lehrkraft DIESER Klasse (Eigentümer:in oder Co-Lehrkraft) darf
      // hochladen - über die geltende Klasse korreliert (`@request.body.classCode`,
      // nicht die spätere Zeile selbst, die es beim Anlegen noch nicht gibt).
      create: `${ttClassStaff("@request.body.classCode")} && @request.auth.id = @request.body.teacherUid`,
      update: null,
      del: `${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
    }),
    indexes: ["CREATE INDEX `idx_tt_et_class` ON `tt_eigene_texte` (`classCode`)"],
  },

  // --- Meine Texte: die Textablage EINER Lehrkraft (E8, 19.09.2026) ----------
  // Johannes wörtlich: „ich würde gerne den Lehrkräften die Möglichkeit geben,
  // Dateien zu speichern und aus diesen dann auszuwählen, die Dateien gehören
  // aber zu den Konten und nicht zur Klasse. Für die Klassenübungen." Und in
  // der Nacht: „vergiss ... den Pool an Dateien je Lehrer nicht" - und
  // (Frage 7): „‚Meine Texte' nur im eigenen Konto, kein Teilen."
  //
  // ⚠️ ANDERS ALS `tt_eigene_texte`: KEIN `classCode`, KEIN `ttClassStaff` -
  // dieser Pool gehört dem KONTO, nicht der Klasse, und wird mit NIEMANDEM
  // geteilt, auch nicht mit einer Co-Lehrkraft derselben Klasse. Nur
  // `@request.auth.id = teacherUid` öffnet eine Zeile - in allen fünf Regeln,
  // auch bei `update` (anders als bei `tt_eigene_texte`, wo ein Prüfungs-/
  // Übungsergebnis nie nachträglich geändert wird; ein Pool-Eintrag darf das,
  // z. B. für ein künftiges Umbenennen). `teacherUid` selbst ist dabei
  // UNVERÄNDERLICH - sonst könnte eine Lehrkraft ihre eigene Zeile einer
  // fremden `teacherUid` zuschreiben (oder umgekehrt eine fremde kapern, sollte
  // die Eigentümer-Prüfung je an anderer Stelle lockerer werden).
  //
  // „Für die Klasse festlegen" legt wie beim Upload eine NEUE Zeile in
  // `tt_eigene_texte` an (`speichereEigenenText`) - der Pool-Eintrag selbst
  // bleibt unverändert liegen, Kinder sehen diese Sammlung nie.
  {
    ...base("tt_meine_texte", [T("teacherUid"), T("dateiname"), N("createdAtMs")], {
      list: ttOwnerTeacher("teacherUid"),
      view: ttOwnerTeacher("teacherUid"),
      create: ttOwnerTeacher("@request.body.teacherUid"),
      update: `${ttOwnerTeacher("teacherUid")} && (@request.body.teacherUid:isset = false || @request.body.teacherUid = teacherUid)`,
      del: ttOwnerTeacher("teacherUid"),
    }),
    indexes: ["CREATE INDEX `idx_tt_mt_teacher` ON `tt_meine_texte` (`teacherUid`)"],
  },

  // --- Klassenmatch (11.09.2026) ---------------------------------------------
  // Ein Tippmatch innerhalb der Klasse: ein Kind lädt ein, andere treten bei,
  // der Einlader startet, alle schreiben fünf Minuten auf ihrem eigenen
  // Tastenniveau, ein Live-Ranking läuft mit. Kein Lehrkraft-Werkzeug - ein
  // Spiel (Johannes: „Es gibt keine Statistik; Lehrer wissen nicht, wer wie
  // oft ein Match macht").
  //
  // ★★★★★ WARUM ZWEI NEUE SAMMLUNGEN: Kinder können einander heute auf
  // keinem Weg sehen - `tt_pupils.listRule` gehört den Lehrkräften,
  // `tt_schreibproben` zeigt nur die eigenen Zeilen, `tt_classes.settings`
  // ist für Kinder schreibgeschützt. Ein Ranking, in dem jedes Kind alle
  // sieht, braucht einen Kanal, den es bisher nicht gibt.
  //
  //   tt_matches      EINE Zeile je Match: wer lädt ein, in welcher Klasse,
  //                   in welchem Zustand (einladung · countdown · laeuft ·
  //                   fertig · abgebrochen), wann gestartet.
  //   tt_match_stand  EINE Zeile je Kind UND Match: dabei/schreibt/fertig
  //                   und der laufende Stand (Zeichen, Fehler, Anschläge je
  //                   Minute, Leistungswert). Das Kind schreibt NUR seine
  //                   eigene Zeile, alle anderen lesen sie.
  //
  // ★★★ Die Leseregel ist die Klasse: `@request.auth.classCode = classCode`.
  // Ein Kind sieht nur Matches und Stände seiner eigenen Klasse. Und es gibt
  // KEINE Lehrkraft-Regel - weder Eigentümer noch Co-Lehrkraft. Das ist F10
  // des Auftrags, kein Versehen. Aufräumen (Matches schliessen, alte Zeilen
  // löschen, höchstens zwei offene Matches je Klasse, `klassenmatchAus` der
  // Klasse achten) übernimmt der Hook `tt_match.pb.js`, der Regeln umgeht.
  //
  // ⚠️ `classCode` steht in BEIDEN Sammlungen doppelt zur Match-Zeile - damit
  // die Leseregel des Standes ohne @collection-Join auskommt. 30 Kinder, die
  // alle drei Sekunden schreiben und lesen, sind der Massstab; ein Join je
  // Zeile wäre dort der falsche Preis.
  {
    ...base(
      "tt_matches",
      [
        T("classCode"),
        T("hostUid"),
        T("hostName"),
        T("status"),
        N("startMs"),
        N("endeMs"),
        N("dauerMin"),
        N("createdMs"),
      ],
      {
        list: `${TT_PUPIL} && @request.auth.classCode = classCode`,
        view: `${TT_PUPIL} && @request.auth.classCode = classCode`,
        // Nur für die eigene Klasse, nur als Gastgeber seiner selbst.
        create: `${TT_PUPIL} && @request.auth.id = @request.body.hostUid && @request.auth.classCode = @request.body.classCode`,
        // Zustand ändert nur der Gastgeber (starten, abbrechen). Der Hook
        // prüft die Übergänge; Klasse und Gastgeber bleiben, was sie sind.
        update: `${TT_PUPIL} && @request.auth.id = hostUid && (@request.body.classCode:isset = false || @request.body.classCode = classCode) && (@request.body.hostUid:isset = false || @request.body.hostUid = hostUid)`,
        // ⚠️ Niemand über die Schnittstelle - der Hook räumt auf.
        del: null,
      },
    ),
    indexes: ["CREATE INDEX `idx_tt_match_class` ON `tt_matches` (`classCode`, `status`)"],
  },
  {
    ...base(
      "tt_match_stand",
      [
        T("matchId"),
        T("classCode"),
        T("pupilUid"),
        T("name"),
        T("status"),
        N("zeichen"),
        N("fehler"),
        N("apm"),
        N("wert"),
        // ★ 14.09.2026: die gemessene Wartezeit aufs Vorlesen, die `matchApm`
        // schon vom Nenner abgezogen hat (siehe klassenmatch.ts) - mitgeschickt,
        // damit sie nicht verloren geht, sobald `apm` einmal gerechnet ist.
        N("wartezeitMs"),
        N("updatedMs"),
      ],
      {
        list: `${TT_PUPIL} && @request.auth.classCode = classCode`,
        view: `${TT_PUPIL} && @request.auth.classCode = classCode`,
        create: `${TT_PUPIL} && @request.auth.id = @request.body.pupilUid && @request.auth.classCode = @request.body.classCode`,
        // Nur die eigene Zeile, und Match/Klasse/Kind bleiben, was sie sind.
        update: `${TT_PUPIL} && @request.auth.id = pupilUid && (@request.body.matchId:isset = false || @request.body.matchId = matchId) && (@request.body.classCode:isset = false || @request.body.classCode = classCode) && (@request.body.pupilUid:isset = false || @request.body.pupilUid = pupilUid)`,
        del: null,
      },
    ),
    indexes: [
      "CREATE UNIQUE INDEX `idx_tt_ms_match_pupil` ON `tt_match_stand` (`matchId`, `pupilUid`)",
      "CREATE INDEX `idx_tt_ms_class` ON `tt_match_stand` (`classCode`, `matchId`)",
    ],
  },

  // --- Klassenmatch-Verlauf (14.09.2026) --------------------------------------
  // `tt_matches`/`tt_match_stand` bleiben Spielstand und werden nach F10 eine
  // Stunde nach dem Ende gelöscht. Diese Sammlung ist etwas anderes: EINE
  // dauerhafte Zeile je Kind UND Match, geschrieben vom Hook selbst, GENAU
  // BEVOR er die Spielstand-Zeilen löscht (`tt_match.pb.js`).
  //
  // ★★★★★ 14.11.2026 - NUR NOCH DIE TEILNAHME. Johannes: „Ich möchte schon
  // wissen, wie viele Matches gespielt wurden, für die Statistik, und welcher
  // Schüler wie viele Matches spielt, aber nicht, wer gewonnen hat." Bis dahin
  // stand hier je Kind auch Platz, Zeichen, Fehler, Tempo, Wertung und das
  // Hilfsmittel (`toolProfile`) - die Datenschutzerklärung versprach aber, ein
  // Match sei nach einer Stunde mit allen Ständen weg. Jetzt bleibt nur: Match,
  // Klasse, Kind, Zeit, Zahl der Mitspielenden und `durchgespielt` (Regel
  // `istDurchgespielt` in `tt_match_anzahl_lib.pb.js`, vom Hook EINMAL vor dem
  // Löschen ausgerechnet). `entfernteFelder` nimmt die alten Spalten samt Inhalt
  // vom Server. Mit dem Kind wird seine Zeile gelöscht (`tt_pupils_loeschen`).
  //
  // ★★★★★ FÜR NIEMANDEN ÜBER DIE SCHNITTSTELLE - weder Kind noch Lehrkraft.
  // Die Lehrkraft sieht nur die Anzahl je Kind und Woche, über die eigene
  // Route `tt_match_anzahl.pb.js`.
  {
    ...base(
      "tt_match_verlauf",
      [
        T("matchId"),
        T("classCode"),
        T("pupilUid"),
        B("durchgespielt"),
        N("anzahl"),
        N("startMs"),
        N("endeMs"),
        N("createdMs"),
      ],
      {
        list: null,
        view: null,
        create: null,
        update: null,
        del: null,
      },
    ),
    entfernteFelder: [
      "hostUid",
      "toolProfile",
      "zeichen",
      "fehler",
      "apm",
      "wert",
      "wartezeitMs",
      "verstrichenMs",
      "platz",
    ],
    indexes: [
      "CREATE INDEX `idx_tt_mv_pupil` ON `tt_match_verlauf` (`pupilUid`, `createdMs`)",
      "CREATE INDEX `idx_tt_mv_match` ON `tt_match_verlauf` (`matchId`)",
    ],
  },

  // --- Lernwerkstatt: gemeinsames Fortschritts-Modell (Umbau Etappe 4a) ------
  // „Große Variante“: EIN generisches Paar lw_progress/lw_events für ALLE
  // Lernprogramme (Tippen, Braille, künftige). Das Skalar-Feld `program`
  // unterscheidet die Programme (z. B. "tippen" | "braille"). Struktur + Regeln
  // 1:1 wie tt_progress/tt_events (Auth-Token aus tt_pupils/tt_teachers, dieselben
  // Helfer: Kind nur eigene Zeile, Lehrkraft nur eigene Klasse — nie mehr Rechte
  // als das Kind selbst). UNIQUE je (pupilUid, program) → ein Datensatz pro Kind
  // & Programm. 4a legt die Tabellen nur AN (leer); Migration der Bestandsdaten
  // (tt_*/br_* → lw_*) ist Schritt 4b, die App-Umstellung 4c. Bestehende
  // tt_*/br_*-Tabellen bleiben unberührt. Memory: project_lernwerkstatt_datenmodell,
  // feedback_security_first, feedback_data_transparency.
  {
    ...base("lw_progress", [T("pupilUid"), T("program"), T("teacherUid"), T("classCode"), N("updatedAtMs")], {
      list: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
      view: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
      create: LW_CREATE,
      update: LW_UPDATE,
      del: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
    }),
    indexes: [
      "CREATE UNIQUE INDEX `idx_lw_prog_pupil_prog` ON `lw_progress` (`pupilUid`, `program`)",
    ],
  },
  {
    ...base("lw_events", [T("pupilUid"), T("program"), T("teacherUid"), T("classCode"), N("updatedAtMs")], {
      list: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
      view: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
      create: LW_CREATE,
      update: LW_UPDATE,
      del: `${ttSelfPupil("pupilUid")} || ${ttOwnerTeacher("teacherUid")} || ${ttClassStaff("classCode")}`,
    }),
    indexes: [
      "CREATE UNIQUE INDEX `idx_lw_ev_pupil_prog` ON `lw_events` (`pupilUid`, `program`)",
    ],
  },
  // --- Lernwerkstatt: Nachrichten Lehrkraft ↔ Schüler:in (app-übergreifend) ---
  // Eine kleine Glocke wie in den Kursen, aber für die Lernwerkstatt: die
  // Lehrkraft schreibt aus ihrer Schüler-Übersicht an einzelne Kinder oder die
  // ganze Klasse; Kinder können in der Plattform ANTWORTEN (und auch selbst
  // beginnen). Chat-artig: ein Datensatz = eine Nachricht; das „Gespräch“ mit
  // einem Kind = alle Zeilen mit dessen `pupilUid`. `readPupilAtMs`/
  // `readTeacherAtMs` = Lese-Stempel je Seite (für die Ungelesen-Zähler an der
  // Glocke). Kinder haben nur eine synthetische `@tt.local`-Adresse → KEINE Mail
  // an Kinder; der Hook lw_message_mail.pb.js mailt nur die LEHRKRAFT, wenn ein
  // Kind antwortet. Regeln/Begründung oben (LW_MSG_*); Isolation wie lw_progress.
  // Memory: project_lernwerkstatt_unified, feedback_security_first.
  {
    ...base(
      "lw_messages",
      [
        T("pupilUid"),
        T("teacherUid"),
        T("classCode"),
        T("senderRole"),
        N("readPupilAtMs"),
        N("readTeacherAtMs"),
        N("createdAtMs"),
      ],
      {
        list: LW_MSG_READ,
        view: LW_MSG_READ,
        create: LW_MSG_CREATE,
        update: LW_MSG_UPDATE,
        del: LW_MSG_DEL,
      },
    ),
    indexes: [
      "CREATE INDEX `idx_lw_msg_pupil` ON `lw_messages` (`pupilUid`)",
      "CREATE INDEX `idx_lw_msg_teacher` ON `lw_messages` (`teacherUid`)",
      "CREATE INDEX `idx_lw_msg_class` ON `lw_messages` (`classCode`)",
    ],
  },
  // --- Zähler der Mail-Bremse (02.09.2026) ----------------------------------
  // Eine Zeile je Topf und Zeitfenster: `fremd:h:2026-09-02T21`, `gesamt:t:…`.
  // Gezählt wird am Bestand und nicht im Speicher, weil jeder Hook-Aufruf in
  // einer frischen Laufzeit läuft ([[reference_pocketbase_hook_scope]]) - eine
  // Zahl in einer Variablen wäre beim nächsten Aufruf wieder null.
  //
  // Für den Client komplett gesperrt: Wer die Zähler lesen könnte, wüsste, wie
  // nah er an der Grenze ist; wer sie schreiben könnte, hätte die Bremse
  // gelöst. Nachsehen kann man im PB-Admin und im Protokoll.
  //
  // Alte Zeilen räumt `konto_aufraeumen.pb.js` nach zwei Wochen weg.
  {
    name: "mail_bremse",
    type: "base",
    fields: [T("fenster"), N("anzahl")],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE UNIQUE INDEX `idx_mail_bremse_fenster` ON `mail_bremse` (`fenster`)",
    ],
  },
];

// ── Zwei-Pass-Provisionierung (2026-07-13) ───────────────────────────────────
// FRÜHER lief alles in EINEM Pass: jede Collection wurde in Array-Reihenfolge
// direkt MIT ihren API-Regeln angelegt. Das bricht bei einer KOMPLETT FRISCHEN
// DB, sobald eine Regel per `@collection.X` auf eine Collection zeigt, die in der
// Reihenfolge noch nicht existiert — PocketBase validiert die Regel beim Anlegen
// und lehnt sie ab ("failed to load collection X"). Beispiel: `lmsCourses`
// (enrolledOrStaff → @collection.enrollments) steht VOR `enrollments`. Auf
// Produktion fiel das nie auf, weil dort alle Collections schon existieren und
// setup.mjs nur PATCHt. Nur echtes Nackt-Provisioning (Disaster-Recovery / neuer
// Server) traf den Fehler.
//
// FIX: zwei Durchläufe.
//   Pass 1 (ensureCollectionShell): ALLE Collections OHNE Regeln anlegen (alle
//     Rule-Felder null) bzw. bei bestehenden nur die Felder mergen.
//   Pass 2 (applyCollectionRules): erst JETZT — wenn jede referenzierte
//     Collection existiert — die tatsächlichen Regeln setzen.
// Damit ist die Array-Reihenfolge für @collection-Cross-Joins irrelevant.
// Idempotenz + Patch-Verhalten für bestehende DBs bleiben erhalten (die Felder-
// Merge-Logik und das Regel-Setzen sind nur auf zwei Updates aufgeteilt).

// Pass 1: Collection-Hülle anlegen (Felder/Indizes/Typ, NOCH OHNE Regeln) oder
// bei bestehender Collection nur die Felder mergen.
async function ensureCollectionShell(def) {
  let existing = null;
  try {
    existing = await pb.collections.getOne(def.name);
  } catch (e) {
    if (e?.status !== 404) throw e;
  }
  // `entfernteFelder` ist eine Anweisung an dieses Skript, kein Feld der
  // Sammlung - sie geht nie an PocketBase.
  const { entfernteFelder = [], ...sammlung } = def;
  if (!existing) {
    // Ohne API-Regeln anlegen (alle null) — die echten Regeln kommen in Pass 2,
    // wenn alle per @collection referenzierten Ziel-Collections existieren.
    // Der Provisionierungs-Superuser umgeht Regeln ohnehin, das Seeding
    // funktioniert also auch mit null-Regeln.
    await pb.collections.create({
      ...sammlung,
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      ...(def.manageRule !== undefined ? { manageRule: null } : {}),
    });
    console.log(`+ collection ${def.name} created (shell, ohne Regeln)`);
    return;
  }
  // Bestehende Felder behalten (inkl. System-Felder), für unsere im Code
  // definierten Felder aber die Eigenschaften AKTUALISIEREN (z. B. maxSize).
  // Vorher wurden nur NEUE Felder angehängt → eine geänderte maxSize blieb auf
  // dem alten Wert stehen; Upload-Grenzen ließen sich an bestehenden
  // Collections nie erhöhen. Die Feld-`id` bleibt erhalten, damit PocketBase
  // die Felder am Platz aktualisiert statt sie neu anzulegen. Regeln bleiben
  // hier unangetastet — die setzt Pass 2.
  //
  // ★ 14.11.2026: `entfernteFelder` - Felder, die NICHT mehr gespeichert
  // werden dürfen (Datensparsamkeit, erstmals die Klassenmatch-Verläufe). Sie
  // fallen hier aus der Liste; PocketBase löscht die Spalte samt Inhalt. Ohne
  // diese Liste bliebe jedes einmal angelegte Feld für immer stehen, denn das
  // Mergen oben hängt nur an und ändert, es nimmt nie weg.
  const weg = new Set(entfernteFelder);
  const defByName = new Map(def.fields.map((f) => [f.name, f]));
  const haveNames = new Set(existing.fields.map((f) => f.name));
  const merged = existing.fields
    .filter((f) => !weg.has(f.name))
    .map((f) => {
      const d = defByName.get(f.name);
      return d ? { ...f, ...d } : f;
    });
  for (const d of def.fields) if (!haveNames.has(d.name)) merged.push(d);
  const entfernt = existing.fields.filter((f) => weg.has(f.name)).map((f) => f.name);
  await pb.collections.update(existing.id, { fields: merged });
  console.log(
    `~ collection ${def.name} Felder gemerged` + (entfernt.length ? ` (entfernt: ${entfernt.join(", ")})` : ""),
  );
}

// Pass 2: die tatsächlichen API-Regeln setzen. Läuft NACHDEM alle Collections
// existieren, sodass jeder `@collection.X`-Cross-Join (enrolledOrStaff,
// ownerOrStaffOrCourseObserver, courseStaff, SELF_ENROLL, ttClassStaff …)
// seine Ziel-Collection auflösen kann.
async function applyCollectionRules(def) {
  const existing = await pb.collections.getOne(def.name);
  await pb.collections.update(existing.id, {
    listRule: def.listRule,
    viewRule: def.viewRule,
    createRule: def.createRule,
    updateRule: def.updateRule,
    deleteRule: def.deleteRule,
    // manageRule nur für Auth-Collections, die es ausdrücklich setzen (z. B.
    // tt_pupils: die Lehrkraft darf die Login-E-Mail ihrer eigenen Kinder
    // umstellen). Sonst weglassen, damit Base-Collections nichts Falsches kriegen.
    ...(def.manageRule !== undefined ? { manageRule: def.manageRule } : {}),
    // authAlert nur, wenn die Collection es ausdrücklich setzt (tt_pupils schaltet
    // die „Login from a new location“-Mail aus — die Kinder haben keine echte
    // Mailbox, sonst gäbe es endlose Bounces). So bleibt der Wert auch nach einem
    // erneuten setup.mjs-Lauf erzwungen, nicht nur beim ersten Anlegen.
    ...(def.authAlert !== undefined ? { authAlert: def.authAlert } : {}),
  });
  console.log(`~ collection ${def.name} Regeln gesetzt`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Manche Doppelklick-Läufe scheitern an der ALLERERSTEN Verbindung zu :8090
// (status 0 / „fetch failed“) — typischerweise eine direkt nach dem scp noch
// „kalte“ Tailscale-Route. Nur echte Netzwerkfehler (status 0) werden
// wiederholt; falsche Zugangsdaten (4xx) NICHT (sofortiger Abbruch).
async function authWithRetry(attempts = 5, delayMs = 2500) {
  for (let i = 1; i <= attempts; i++) {
    try {
      await pb.collection("_superusers").authWithPassword(SU_EMAIL, SU_PASS);
      if (i > 1) console.log(`auth ok (Versuch ${i}/${attempts})`);
      return;
    } catch (e) {
      const transient = e?.status === 0; // Verbindungs-/Netzwerkfehler
      if (!transient || i === attempts) throw e;
      const why =
        e?.originalError?.cause?.code || e?.originalError?.message || "Netzwerk";
      console.warn(
        `auth Versuch ${i}/${attempts} fehlgeschlagen (${why}) — ` +
          `neuer Versuch in ${(delayMs / 1000).toFixed(1)}s …`,
      );
      await sleep(delayMs);
    }
  }
}

async function main() {
  await authWithRetry();
  console.log(`auth ok as superuser ${SU_EMAIL}`);


  // Zwei-Pass (siehe ensureCollectionShell/applyCollectionRules): erst alle
  // Collection-Hüllen OHNE Regeln anlegen, dann die Regeln setzen. So lösen
  // @collection-Cross-Joins ihre Ziel-Collection auf, egal in welcher
  // Array-Reihenfolge sie stehen (frisches Nackt-Provisioning bricht sonst).
  for (const def of COLLECTIONS) await ensureCollectionShell(def);
  for (const def of COLLECTIONS) await applyCollectionRules(def);

  // ── ★★★★★ Anmeldung der KINDER: 90 Tage statt 7 (23.09.2026) ────────────
  //
  // ANLASS (3. Klasse HAS, am Server gemessen): Eine Schülerin meldete sich am
  // 16.09. um 08:2x Uhr an und übte erst in der nächsten Wochenstunde wieder.
  // Die Anmeldung galt 7 Tage (Vorgabe von PocketBase) - sie lief am 23.09.
  // mitten in der Stunde ab. Eine Klasse, die einmal die Woche zur selben
  // Stunde übt, trifft das Ende damit JEDE Woche. Johannes: „auf einem
  // Schul-PC meldet sich jeder Schüler mit seinem eigenen Konto an ... Warum
  // kann ein Schüler dort nicht immer angemeldet bleiben?"
  //
  // 90 Tage: jede Nutzung verlängert die Anmeldung (`kontoAuffrischen` beim
  // Laden und eine Stunde vor dem Ende, `useTypingAuth`), und 90 Tage reichen
  // über die Sommerferien. Nur `tt_pupils` - Lehrkräfte haben mehr Rechte und
  // arbeiten oft an fremden Geräten; dort bleibt es bei der Vorgabe.
  // Wirkt für jede NEUE Anmeldung oder Verlängerung; bestehende Tokens behalten
  // ihr altes Ende, bis sie beim nächsten Laden verlängert werden.
  // Idempotent: nur erhöhen, nie senken (dasselbe Muster wie fileToken oben).
  try {
    const NEUNZIG_TAGE_S = 90 * 24 * 60 * 60; // 7 776 000 s
    const col = await pb.collections.getOne("tt_pupils");
    const curDur = Number(col?.authToken?.duration ?? 0) || 0;
    if (curDur < NEUNZIG_TAGE_S) {
      await pb.collections.update(col.id, { authToken: { duration: NEUNZIG_TAGE_S } });
      const nach = await pb.collections.getOne("tt_pupils");
      const ist = Number(nach?.authToken?.duration ?? 0) || 0;
      console.log(
        ist === NEUNZIG_TAGE_S
          ? `+ Anmeldung tt_pupils: ${NEUNZIG_TAGE_S}s (90 Tage, vorher ${curDur}s)`
          : `⚠️  Anmeldung tt_pupils steht auf ${ist}s (${NEUNZIG_TAGE_S} gewünscht)`,
      );
    } else {
      console.log(`Anmeldung tt_pupils bereits ≥ 90 Tage (${curDur}s)`);
    }
  } catch (e) {
    console.warn(
      "WARNUNG: Anmelde-Gültigkeit tt_pupils konnte nicht automatisch gesetzt " +
        "werden - bitte im PB-Admin unter Collections > tt_pupils > Options > " +
        "Auth token duration auf 7776000 setzen. (" +
        (e?.message || e) +
        ")",
    );
  }

  // ── Die Bremse selbst ────────────────────────────────────────────────────
  // Vorgefunden am 02.09.2026: eingeschaltet, aber nur mit den Werkseinstellungen
  // (30 Anmeldungen/10 s, 20 Neuanlagen/5 s, 300 Anfragen/10 s). Für einen Bot,
  // der Konten anlegt, sind 20 Neuanlagen je 5 Sekunden 14.400 Konten in der
  // Stunde.
  //
  // Die drei Türen, die OHNE Anmeldung offenstehen (create-Regeln oben):
  //   • users        — LMS-Registrierung, nur `role = "student"`
  //   • tt_teachers  — offene Selbst-Registrierung für Lehrkräfte
  //   • tt_pupils    — Selbstanmeldung ohne Klasse (`selfManaged`)
  // Dazu die Wege, über die sich Post auslösen lässt (Bestätigung, Passwort
  // vergessen) — sie sind der teure Teil, siehe mail_bremse.pb.js.
  //
  // ⚠️⚠️ GEMESSEN am 02.09.2026 an einer Kopie der Live-Datenbank, weil die
  // erste Fassung dieser Regeln WIRKUNGSLOS war und trotzdem sauber gespeichert
  // wurde - der gefährlichste Fehlertyp: eine Einstellung, die aussieht, als
  // stünde sie.
  //
  // Falsch war die Beschriftung `POST /api/collections/tt_teachers/records`.
  // PocketBase nimmt sie an, speichert sie, zeigt sie im Admin - und benutzt
  // sie für Record-Routen nie: Für die gilt die MARKE, und die vorhandene
  // `*:create` gewinnt. Sieben Anmeldungen hintereinander liefen darum alle
  // durch (7 x 200).
  //
  // Richtig ist die sammlungseigene Marke `<collection>:<vorgang>`:
  //   tt_teachers:create → ab dem 6. Versuch 429, eine andere Adresse 200.
  // Beides gemessen; die zweite Messung beweist zugleich, dass `trustedProxy`
  // wirkt (ohne sie läge alles in einem Eimer).
  //
  // Für EIGENE Routen (`/api/sensorik/…`) gibt es keine Marke - dort gilt der
  // Pfad, und eine Beschriftung MIT Schrägstrich am Ende gilt als Präfix.
  // Darum steht `/api/sensorik/workshop-by-code/` mit Schrägstrich hier: Die
  // Unterwege (`/upload`, `/save`, `/delete`) fielen sonst durch die vorhandene
  // Regel hindurch, und `/upload` nimmt Dateien bis 500 MB entgegen. Gemessen:
  // ab dem 4. Aufruf 429.
  //
  // ⚠️ `audience: "@guest"` ist bei den Registrierungs-Marken entscheidend:
  // Ohne sie liefe eine LEHRKRAFT, die ihre Klasse anlegt, in dieselbe Grenze
  // wie ein Bot - bei 25 Kindern nach dem fünften Kind. Gemessen: angemeldet
  // gehen 8 Kinder hintereinander durch, als Gast greift die Grenze.
  //
  // Die Zahlen sind bewusst grosszügig. Die Grenze je IP ist nicht die Mauer -
  // die Mauer sind die Mail-Bremse (höchstens 40 Konto-Mails am Tag, ganz
  // gleich von wo) und das Aufräumen leerer Konten. Eine enge IP-Grenze würde
  // vor allem einen Workshop treffen, in dem 20 Lehrkräfte im selben Raum und
  // damit hinter derselben Adresse ein Konto anlegen.
  try {
    const vorher = await pb.settings.getAll();
    const rateLimits = {
      enabled: true,
      excludedIPs: vorher?.rateLimits?.excludedIPs || [],
      rules: [
        { label: "tt_teachers:create", audience: "@guest", duration: 3600, maxRequests: 120 },
        { label: "tt_pupils:create", audience: "@guest", duration: 3600, maxRequests: 120 },
        { label: "tt_teachers:requestPasswordReset", audience: "", duration: 3600, maxRequests: 15 },
        { label: "tt_teachers:requestVerification", audience: "", duration: 3600, maxRequests: 120 },
        { label: "tt_pupils:requestPasswordReset", audience: "", duration: 3600, maxRequests: 15 },
        { label: "tt_pupils:requestVerification", audience: "", duration: 3600, maxRequests: 120 },
        { label: "/api/tt/kind-verschieben", audience: "", duration: 3600, maxRequests: 60 },
        { label: "/api/tt/klassencode-aendern", audience: "", duration: 3600, maxRequests: 30 },
        { label: "*:auth", audience: "", duration: 10, maxRequests: 60 },
        { label: "*:create", audience: "", duration: 10, maxRequests: 150 },
        { label: "/api/batch", audience: "", duration: 1, maxRequests: 3 },
        { label: "/api/", audience: "", duration: 10, maxRequests: 900 },
      ],
    };
    await pb.settings.update({ rateLimits });
    const nach = await pb.settings.getAll();
    console.log(
      `+ rateLimits gesetzt: ${nach?.rateLimits?.rules?.length ?? 0} Regeln, ` +
        `aktiv=${nach?.rateLimits?.enabled}`,
    );
  } catch (e) {
    console.warn(
      "WARNUNG: rateLimits konnten nicht gesetzt werden — die Registrierungs-" +
        "Türen stehen dann nur unter der Werkseinstellung (20 Neuanlagen/5 s). (" +
        (e?.message || e) +
        ")",
    );
  }

  // Selbstlernende Schüler-Konten (tt_pupils, 09.08.2026): Sie haben als
  // einzige Schüler-Konten eine ECHTE Adresse — und hängen daran (Wochenbericht,
  // Löschwarnung). Darum drei eigene Vorlagen, alle mit einem Link auf UNSERE
  // Seiten statt auf PocketBases Admin-Oberfläche:
  //   • verification  → Adresse beim Anlegen beweisen
  //   • confirmEmailChange → Adresswechsel, Link geht an die NEUE Adresse
  //   • resetPassword → „Passwort vergessen“ auch für diese Konten
  // Klassen-Kinder berührt das nicht: Ihre `…@tt.local`-Adresse bekommt nie
  // eine Mail (der Versand würde am Mailserver abprallen).
  //
  // ★★★ 04.09.2026 - DER LINK STEHT HINTER EINEM WORT, NICHT ROH IM TEXT
  // (Johannes: *„die Bestätigungsmails haben schrecklich lange Links, kannst du
  // die hinter einem Text-Link verstecken"*).
  //
  // Ein Token ist über 100 Zeichen lang. Roh im Text bedeutet das: Der Absatz
  // ist mitten im Satz zerschnitten, Mailprogramme brechen die Adresse um (und
  // machen sie damit manchmal unklickbar), und **eine Sprachausgabe liest die
  // ganze Zeichenkette vor** - Zeichen für Zeichen, bevor der nächste Satz
  // kommt. Für unsere Leserinnen und Leser ist das der teuerste Teil der Mail.
  //
  // ⚠️ Die Vorlagen sind HTML (so auch PocketBases eigene Vorgaben und unsere
  // Hook-Mails, z. B. `tt_teacher_welcome.pb.js`). Wer hier wieder Fliesstext
  // mit `\n` hinschreibt, bekommt eine Mail ohne Absätze - die Zeilenumbrüche
  // eines Textes gelten in HTML nicht.
  //
  // ★ Das `&` der Adresse gehört als `&amp;` geschrieben: In einem
  // HTML-Attribut ist `&` der Anfang einer Entity.
  try {
    const FOUR_WEEKS_S = 28 * 24 * 60 * 60;
    const tpCol = await pb.collections.getOne("tt_pupils");
    await pb.collections.update(tpCol.id, {
      passwordResetToken: { duration: FOUR_WEEKS_S },
      verificationTemplate: {
        subject: "Bitte bestätige deine E-Mail-Adresse (Tastenflow)",
        body:
          "<p>Hallo,</p>" +
          "<p>bitte bestätige mit einem Klick, dass dir diese Adresse gehört:</p>" +
          '<p><a href="{APP_URL}/lernprogramm-bestaetigen?art=konto&amp;token={TOKEN}">' +
          "E-Mail-Adresse bestätigen</a></p>" +
          '<p style="color:#666;font-size:12px">Üben kannst du auch ohne diesen ' +
          "Klick. Falls du dich nicht angemeldet hast, ignoriere diese Mail " +
          "einfach.</p>",
      },
      confirmEmailChangeTemplate: {
        subject: "Neue E-Mail-Adresse bestätigen (Tastenflow)",
        body:
          "<p>Hallo,</p>" +
          "<p>du möchtest dein Tastenflow-Konto auf diese Adresse umstellen. " +
          "Bestätige den Wechsel hier:</p>" +
          '<p><a href="{APP_URL}/lernprogramm-bestaetigen?art=adresse&amp;token={TOKEN}">' +
          "Adresswechsel bestätigen</a></p>" +
          '<p style="color:#666;font-size:12px">Zur Sicherheit wird dabei dein ' +
          "Passwort abgefragt. Wenn du das nicht angefordert hast, tu nichts — " +
          "dann bleibt alles beim Alten.</p>",
      },
      resetPasswordTemplate: {
        subject: "Passwort für dein Tastenflow-Konto zurücksetzen",
        body:
          "<p>Hallo,</p>" +
          "<p>hier ist dein Weg zu einem neuen Passwort:</p>" +
          '<p><a href="{APP_URL}/lernprogramm-passwort?art=konto&amp;token={TOKEN}">' +
          "Neues Passwort setzen</a></p>" +
          '<p style="color:#666;font-size:12px">Der Link ist 4 Wochen gültig. ' +
          "Falls du das nicht angefordert hast, kannst du diese Mail " +
          "ignorieren.</p>",
      },
    });
    console.log(`+ tt_pupils Bestätigungs-/Wechsel-/Reset-Templates gesetzt`);
  } catch (e) {
    console.warn(
      "WARNUNG: tt_pupils Mail-Templates konnten nicht gesetzt werden (" +
        (e?.message || e) +
        ")",
    );
  }

  // Lernprogramm-Lehrkräfte (tt_teachers): „Passwort vergessen“ nutzt
  // denselben Token-Typ. 4 Wochen Gültigkeit + eigenes E-Mail-Template,
  // damit der Reset-Link zu /lernprogramm-passwort zeigt (nicht zu PBs
  // Default-Admin-URL). Idempotent — beide Felder werden bei jedem setup gesetzt.
  try {
    const FOUR_WEEKS_S = 28 * 24 * 60 * 60;
    const ttCol = await pb.collections.getOne("tt_teachers");
    await pb.collections.update(ttCol.id, {
      passwordResetToken: { duration: FOUR_WEEKS_S },
      resetPasswordTemplate: {
        subject: "Passwort für die Tastenflow zurücksetzen",
        body:
          "<p>Hallo,</p>" +
          "<p>hier ist dein Weg zu einem neuen Passwort für dein " +
          "Lehrkraft-Konto:</p>" +
          '<p><a href="{APP_URL}/lernprogramm-passwort?token={TOKEN}">' +
          "Neues Passwort setzen</a></p>" +
          '<p style="color:#666;font-size:12px">Der Link ist 4 Wochen gültig. ' +
          "Falls du das nicht angefordert hast, kannst du diese Mail einfach " +
          "ignorieren.</p>",
      },
    });
    console.log(
      `+ tt_teachers passwordResetToken-Gültigkeit + Mail-Template gesetzt`,
    );
    // Bestätigungs-Link für LEHRKRÄFTE (09.08.2026). Bis dahin kam nach der
    // Registrierung nur eine Begrüßungs-Mail OHNE Link — die beweist nichts.
    await pb.collections.update(ttCol.id, {
      // ★★★ 04.09.2026: Diese Vorlage war bis heute PocketBases VORGABE -
      // englisch und mit einem Link in die Admin-Oberfläche (`/_/#/auth/...`).
      // Wer sie öffnete, landete in einem Bereich, den er weder versteht noch
      // betreten darf. Jetzt: deutsch und auf unsere Seite, wo das Token
      // eingelöst wird (`art=lehrkraft-adresse` → Sammlung tt_teachers).
      confirmEmailChangeTemplate: {
        subject: "Neue E-Mail-Adresse bestätigen (Tastenflow)",
        body:
          "<p>Hallo,</p>" +
          "<p>du möchtest dein Lehrkraft-Konto auf diese Adresse umstellen. " +
          "Bestätige den Wechsel hier:</p>" +
          '<p><a href="{APP_URL}/lernprogramm-bestaetigen?art=lehrkraft-adresse&amp;token={TOKEN}">' +
          "Adresswechsel bestätigen</a></p>" +
          '<p style="color:#666;font-size:12px">Zur Sicherheit wird dabei dein ' +
          "Passwort abgefragt. Wenn du das nicht angefordert hast, tu nichts — " +
          "dann bleibt alles beim Alten.</p>",
      },
      verificationTemplate: {
        subject: "Bitte bestätige deine E-Mail-Adresse (Tastenflow)",
        body:
          "<p>Hallo,</p>" +
          "<p>bitte bestätige mit einem Klick, dass dir diese Adresse gehört:</p>" +
          '<p><a href="{APP_URL}/lernprogramm-bestaetigen?art=lehrkraft&amp;token={TOKEN}">' +
          "E-Mail-Adresse bestätigen</a></p>" +
          "<p>Erst dann können wir dich erreichen — etwa beim Zurücksetzen des " +
          "Passworts.</p>" +
          '<p style="color:#666;font-size:12px">Falls du dich nicht angemeldet ' +
          "hast, kannst du diese Mail ignorieren.</p>",
      },
    });
    console.log(`+ tt_teachers Bestätigungs-Template gesetzt`);
  } catch (e) {
    console.warn(
      "WARNUNG: tt_teachers passwordResetToken/resetPasswordTemplate konnte " +
        "nicht automatisch gesetzt werden — bitte im PB-Admin unter Collections > " +
        "tt_teachers manuell konfigurieren. (" +
        (e?.message || e) +
        ")",
    );
  }
}

main().catch((e) => {
  // Aussagekräftiger Fehler: vorher zeigte `e?.response || …` bei einem
  // Netzwerk-/Verbindungsfehler nur ein leeres {} (PocketBase setzt response
  // dann auf {}), wodurch die echte Ursache verloren ging. Jetzt: Meldung,
  // HTTP-Status, URL, Antwortkörper UND die zugrunde liegende Netzwerk-Ursache.
  console.error("SETUP FAILED");
  console.error("  message :", e?.message ?? "(keine)");
  if (e?.status !== undefined) console.error("  status  :", e.status);
  if (e?.url) console.error("  url     :", e.url);
  try {
    const r = e?.response;
    if (r && Object.keys(r).length) console.error("  response:", JSON.stringify(r));
  } catch {
    /* response nicht serialisierbar — egal */
  }
  // Volle Ursachen-Kette: undici verschachtelt den echten Fehler tief
  // (ClientResponseError → TypeError „fetch failed“ → Error mit .code/.syscall).
  let c = e?.originalError || e?.cause;
  let depth = 0;
  while (c && depth < 8) {
    const parts = [
      c.name,
      c.message,
      c.code,
      c.errno,
      c.syscall,
      c.address ? `${c.address}:${c.port}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    console.error(`  cause[${depth}]:`, parts);
    if (Array.isArray(c.errors)) {
      c.errors.forEach((er, i) =>
        console.error(
          `    └ err[${i}]:`,
          [er?.name, er?.message, er?.code].filter(Boolean).join(" · "),
        ),
      );
    }
    c = c.cause;
    depth++;
  }
  if (e?.stack) console.error(e.stack);
  process.exit(1);
});
