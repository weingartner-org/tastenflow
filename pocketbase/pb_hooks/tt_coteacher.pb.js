/// <reference path="../pb_data/types.d.ts" />
//
// „Tastenflow" — Co-Lehrkräfte einer Klasse verwalten (ROUTEN)
// ----------------------------------------------------------------
// Eine Lehrkraft kann WEITERE Lehrkräfte zu ihrer Klasse hinzufügen; diese
// erhalten volle Rechte auf die Klasse (Schüler:innen sehen/verwalten,
// Fortschritt, Passwörter zurücksetzen). Mitgliedschaft = eine Zeile in der
// Join-Collection `tt_class_teachers` (Klassencode ↔ Lehrkraft-id).
//
// WICHTIG — warum die Logik in `tt_coteacher_lib.pb.js` liegt und NICHT hier:
//   PocketBase ruft die unten registrierten Handler in einem eigenen
//   Runtime-Pool auf, der Top-Level-Funktionen aus DERSELBEN Datei NICHT sieht.
//   Ein Handler, der direkt eine hier oben definierte Hilfsfunktion aufruft,
//   stürzt deshalb ab (Client sieht nur „Something went wrong"). Darum laden die
//   Handler die Implementierung INNERHALB des Callbacks per require() — dabei
//   wird die Lib-Datei vollständig ausgewertet und alle Funktionen sind da.
//
// Verträge (alle POST, Header Authorization: Bearer <tt_teachers-token>):
//   /api/tt/coteacher/list     { classCode }            → { teachers: [...] }
//   /api/tt/coteacher/add      { classCode, email }     → { teachers: [...] }
//                              ODER, kennt tt_teachers die E-Mail nicht:
//                              { invited: true, email, teachers: [...] }
//   /api/tt/coteacher/remove   { classCode, teacherId } → { teachers: [...] }
//   teachers[] = { id, name, email, owner }
//
// Einladung noch nicht registrierter Kolleg:innen (14.09.2026, KEIN Header
// nötig für invite-vorschau):
//   /api/tt/coteacher/invite-vorschau  { token } → { klasseName, email, eingeloest }
//   /api/tt/coteacher/invite-annehmen  { token } → { ok, classCode, klasseName }
//     (braucht Authorization: Bearer <tt_teachers-token> - siehe tt_coteacher_lib.pb.js)
//
// Sicherheit:
//   - Nur eine Lehrkraft, die die Klasse BESITZT oder bereits co-betreut, darf
//     die Liste lesen/ändern.
//   - Die Eigentümer:in lässt sich nicht entfernen (dazu Klasse löschen).
//   - Best effort + Logging; fail closed.
//
// Voraussetzung (Johannes-Infra, einmalig): Beide Dateien (tt_coteacher.pb.js
// UND tt_coteacher_lib.pb.js) nach pb_hooks/ der Live-PocketBase + Schema
// (setup.mjs: tt_class_teachers, seit 14.09.2026 zusätzlich
// tt_class_teacher_invites) → „Update LMS (komplett)".

routerAdd("POST", "/api/tt/coteacher/list", (e) => {
  return require(`${__hooks}/tt_coteacher_lib.pb.js`).coteacherHandler(e, "list");
});
routerAdd("POST", "/api/tt/coteacher/add", (e) => {
  return require(`${__hooks}/tt_coteacher_lib.pb.js`).coteacherHandler(e, "add");
});
routerAdd("POST", "/api/tt/coteacher/remove", (e) => {
  return require(`${__hooks}/tt_coteacher_lib.pb.js`).coteacherHandler(e, "remove");
});
routerAdd("POST", "/api/tt/coteacher/invite-vorschau", (e) => {
  return require(`${__hooks}/tt_coteacher_lib.pb.js`).inviteVorschauAktion(e);
});
routerAdd("POST", "/api/tt/coteacher/invite-annehmen", (e) => {
  return require(`${__hooks}/tt_coteacher_lib.pb.js`).inviteAnnehmenAktion(e);
});
