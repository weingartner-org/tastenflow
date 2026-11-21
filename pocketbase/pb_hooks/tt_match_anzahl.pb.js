/// <reference path="../pb_data/types.d.ts" />
//
// Klassenmatch-Anzahl - die ROUTE (E9, 19.09.2026)
// ==================================================
// Johannes, 18.09.2026: „Klassenmatch-Anzahl ja" - die Lehrkraft sieht in
// „Übungszeiten" (aufgeklappte Zeile, `TastenflowReiter.tsx`), wie oft jedes
// Kind je Woche ein Klassenmatch gespielt hat - NUR die Anzahl, kein
// Ranking. Die gesamte Logik liegt in tt_match_anzahl_lib.pb.js
// (Hook-Scope-Fallstrick, [[reference_pocketbase_hook_scope]]) und wird hier
// per require() geladen - diese Datei bleibt bewusst dünn.
//
// ⚠️ Diese Route liegt NICHT in tt_match.pb.js: Der Wächter
// tests/tastenflow-klassenmatch-server.test.ts prüft, dass jene Datei „keine
// Route anmeldet" (F10 - die Match-Sammlungen selbst bleiben ohne jede
// Lehrkraft-Regel). Die Anzahl kommt aus einer ANDEREN Sammlung
// (`tt_match_verlauf`, analyse-only) und verdient darum eine eigene Route.
//
// Vertrag: GET /api/tt/klassenmatch-anzahl?klasse=<code>
//   → 200 { kinder: { [pupilUid]: { [wochenKey]: anzahl } } }
//   → 400 kein Klassencode · 401 keine Lehrkraft angemeldet
//   → 403 die Klasse gehört einer anderen Lehrkraft (oder gibt es nicht)
//
// Deploy: diese Datei + tt_match_anzahl_lib.pb.js nach pb_hooks/ → „Update
// LMS (komplett)". Kein Schema-Zusatz, keine Regeländerung an
// tt_match_verlauf (bleibt für jeden Client unlesbar).

routerAdd("GET", "/api/tt/klassenmatch-anzahl", (e) => {
  return require(`${__hooks}/tt_match_anzahl_lib.pb.js`).klassenmatchAnzahlHandler(e);
});
