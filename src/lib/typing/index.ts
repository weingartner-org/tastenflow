/**
 * Modul des 10-Finger-Trainers „Tastenflow". Bündelt Finger-/Tastenmodell,
 * Lehrplan, Übungs-Generator, Fortschritt, Konten, Töne, Sprachausgabe,
 * Barrierefreiheit (Kontrast/Zoom) und Kennzahlen. Siehe
 * [[project_zehnfinger_trainer]].
 */
export * from "./layouts";
// ★ E4 (25.09.2026, Bauplan französischer Lehrgang §4): zusammengesetzte
// Zeichen (Totaste + Grundbuchstabe), nur auf französischen Tastaturen wirksam.
export * from "./totasten";
export * from "./totastenTexte";
export * from "./fingers";
export * from "./curriculum";
export * from "./words";
export * from "./corpus";
// ★ 28.09.2026: Die einzelnen Korpus- und Serien-Dateien (corpusErstleser …
// corpusJugend2, serienEn) stehen hier NICHT mehr: Ein Sammel-Export zöge sie
// statisch in jedes Bündel, das aus „@/lib/typing" importiert - und damit
// alle vier Sprachpakete zu jedem Besucher (`sprachpakete.ts`). Wer eine
// einzelne Datei braucht (Tests, Skripte), importiert sie direkt.
export * from "./corpusDeactivated";
export * from "./corpusDeactivatedEn";
export * from "./markov";
export * from "./lexicon";
export * from "./tiers";
export * from "./serie";
export * from "./serien";
export * from "./ledger";
export * from "./corpusManifest";
export * from "./belohnungsspiel";
export * from "./skin";
export * from "./trainerMode";
export * from "./letters";
export * from "./level";
export * from "./stars";
export * from "./badges";
export * from "./generator";
export * from "./iceFloe";
export * from "./metrics";
export * from "./zeilenzeit";
export * from "./practiceClock";
export * from "./goalAnsage";
export * from "./focusField";
export * from "./focusStats";
export * from "./noTimePressure";
export * from "./einhand";
export * from "./zeichenabstand";
export * from "./progress";
export * from "./account";
export * from "./datum";
export * from "./goals";
export * from "./jahreskarte";
export * from "./wochenrhythmus";
// ★ Wochenziel NEU (Bauplan W, 18.09.2026 - W1 Logik, additiv, noch von
// niemandem aufgerufen): Minuten je Woche JE KIND (keine Einheiten mehr;
// „für die Klasse" ist erst W3s Bulk-Schreiber), Zielverlauf als FELD am
// Kind (`tt_pupils.wochenzielVerlauf`, kommt mit W2 - keine Ereignis-Marker
// mehr, die hätten bei einer Klassen-Änderung ~25 Kinder-Datensätze
// mitten im Schreiben ihrer eigenen Übungszeilen überschrieben), Nachholen,
// %-Erfüllung. Ersetzt `goals.ts` erst in W3/W4.
export * from "./wochenziel";
// ★ E4 (18.09.2026): die aufgeklappte Zeile gruppiert die Übezeit nach
// WOCHE statt nach Kalendertag - eigene, unit-getestete Rechnung, siehe
// `uebungsperioden.ts` (dieselbe Wochengrenze wie das Wochenziel,
// `WOCHENZIEL_GRENZE`).
export * from "./uebungsperioden";
export * from "./useGesperrteZeiten";
// Die Merker der Erklär-Fenster und ihr Wortlaut (31.08.2026).
export * from "./merkfenster";
export * from "./merkfensterTexte";
// Erkennung „vielleicht ohne Tastatur" (20.09.2026).
export * from "./geraeteHinweis";
// Die Erklärung des Wochenziel-Systems - EINMAL, fürs Handbuch
// (`scripts/erzeuge-tastenflow-handbuch.mts`).
export * from "./wochenzielErklaerung";
export * from "./sound";
export * from "./vorlesen";
export * from "./voice";
export * from "./a11y";
// Erkennung „Ziffernblock angeschlossen" + Einstellung „Große Tastatur" (25.09.2026).
export * from "./grosseTastatur";
export * from "./ueberschriften";
export * from "./backend";
export * from "./arcs";
export * from "./arcEngine";
export * from "./rueckmeldung";
export * from "./rundenlaenge";
// ★ Die Rundenend-Regel („kommt eine Taste dazu?") - EINMAL, benutzt von
// „Mein Training" UND vom Klassenmatch (11.09.2026, F7).
export * from "./tastenfreischaltung";
// ★★★ Das KLASSENMATCH (11.09.2026): Begriffe, Zeiten, Rangliste, Kugeln und
// der Braille-Vorspann; dazu der gemeinsame Beobachtungs-Haken und der Zustand
// der Kind-Seite. Die Mock-Mitspieler (`matchMock`) sind bewusst NICHT hier -
// sie gehören ins Backend, nicht ins Sammel-Modul.
export * from "./klassenmatch";
export * from "./klassenmatchAngebot";
export * from "./serverUhr";
export * from "./useKlassenBeobachtung";
export * from "./useKlassenmatch";
// ★★★ Die Schreibprobe (09.09.2026): Begriffe und Zeiten, das Rechenwerk der
// Auswertung und der Haken, über den ein Kind erfährt, dass eine läuft.
// Die TEXTE sind bewusst NICHT hier - sie werden nachgeladen (schreibproben/).
export * from "./schreibprobe";
export * from "./schreibprobeAuswertung";
export * from "./schreibprobeWertung";
// ★ Der Score (§2.1, 11.09.2026): dieselbe Rechnung wie die Tippchallenge,
// angewandt auf die Übungsdaten eines Zeitraums.
export * from "./score";
// ★ B9 (11.09.2026): Schulstufe der Klasse ⇒ Alter ⇒ Textstufe, wächst mit.
export * from "./klassenEinstellungen";
export * from "./useSchreibprobe";
// ★ 10.09.2026: „3 / 82" je Kind und die Mouseover-Hinweise der ganzen Challenge.
export * from "./schreibprobenUebersicht";
export * from "./schreibprobeHinweise";
// ★★★ Eigene Texte (17.09.2026): hochgeladene Übungs-/Prüfungstexte - die
// reine Umwandlung (eigenerText.ts) und der Haken, über den ein Kind erfährt,
// dass ihm eine „Eigene Übung" zugewiesen ist (useEigeneUebung.ts).
export * from "./eigenerText";
export * from "./useEigeneUebung";
// ★★★★★ Vorlagen (E7, 19.09.2026): die sechs Text-Lektionen als Angebot in
// „Eigene Übung" - Textquelle ist der Korpus, nicht ein fester Text.
export * from "./vorlagen";
export * from "./meineTexte";
export * from "./useEigenerTextUpload";
