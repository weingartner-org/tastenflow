/// <reference path="../pb_data/types.d.ts" />
//
// Löst tt_pupils_passwort_mail_lib.pb.js aus (Wunsch Johannes, 14.09.2026):
// einmal beim Anlegen eines Kindes, einmal bei jedem Zurücksetzen seines
// Passworts - immer nur, wenn eine Kontakt-E-Mail-Adresse hinterlegt ist.
// Zwei getrennte Hooks, weil PocketBase Anlegen/Ändern als eigene
// Lifecycle-Events führt.
//
// Anlegen: onRecordAfterCreateSuccess - eindeutig, jedes neue Kind hat
// entweder eine Kontakt-Adresse oder keine, keine Abgrenzung nötig.
//
// Zurücksetzen: onRecordUpdateRequest (VOR dem Schreiben, wie
// tt_pupils_field_guard.pb.js) statt onRecordAfterUpdateSuccess - nur hier
// lässt sich zuverlässig zwischen "das war ein Passwort-Reset" und "das war
// eine x-beliebige andere Änderung" (Tempo, Sprache, Klasse wechseln, …)
// unterscheiden: passwordPlain VORHER (`e.app.findRecordById`, noch der alte
// Stand) gegen passwordPlain NACHHER (`e.record`, das schon zusammengeführte
// Ergebnis) vergleichen. Ohne diesen Vergleich ginge bei JEDER Änderung eines
// Kindes mit Kontakt-Adresse eine Mail raus, nicht nur bei einem echten
// Passwort-Wechsel.

onRecordAfterCreateSuccess((e) => {
  try {
    if (e.record.getString("contactEmail")) {
      require(`${__hooks}/tt_pupils_passwort_mail_lib.pb.js`).sende(e.app, e.record);
    }
  } catch (err) {
    e.app.logger().warn("[tt-pupils-passwort-mail] Anlegen-Hook Fehler", "error", String(err));
  }
  e.next();
}, "tt_pupils");

onRecordUpdateRequest((e) => {
  try {
    // ★★★★ NIE AUF ZURUF DES KINDES (Befund 26.09.2026, gemessen am
    // Wegwerf-PocketBase 0.38.1): Ein Kind schickte
    // `PATCH {passwordPlain: "gefaelscht"}` an den eigenen Datensatz - der
    // Feld-Wächter setzte den Wert richtig zurück, die Datenbank blieb
    // unverändert, ABER diese Mail ging mit „gefaelscht" als Passwort an die
    // Kontakt-Adresse. Dieser Hook sieht den Aufruf VOR dem Wächter
    // (`tt_pupils_field_guard.pb.js`) - auf die Reihenfolge der Dateien ist
    // kein Verlass. `passwordPlain` schreibt nur die Lehrkraft
    // (`resetPupilPassword`); ein Aufruf des Kindes löst darum nie eine
    // Passwort-Mail aus - egal, was er enthält.
    let vomKind = false;
    try {
      vomKind = !!e.auth && e.auth.collection().name === "tt_pupils";
    } catch (_) {
      vomKind = false;
    }
    // ★★★ Seit 26.09.2026 steht in der Datenbank der SCHLÜSSELTEXT
    // (`tt_pupils_passwort_verschluesseln_lib.pb.js`), und derselbe Klartext
    // ergibt bei jedem Speichern einen ANDEREN Schlüsseltext. Verglichen wird
    // darum ENTSCHLÜSSELT: Hier (vor dem Speichern) trägt `e.record` entweder
    // den Klartext aus dem Aufruf der Lehrkraft oder - wenn der Aufruf das
    // Passwort nicht anfasst - den unveränderten Schlüsseltext aus der
    // Datenbank; beides wird zum Klartext, und nur ein ECHT anderes Passwort
    // löst die Mail aus.
    const vs = require(`${__hooks}/tt_pupils_passwort_verschluesseln_lib.pb.js`);
    const neuesPasswort = vs.klartext(e.record.getString("passwordPlain"));
    if (!vomKind && neuesPasswort && e.record.getString("contactEmail")) {
      const stored = e.app.findRecordById("tt_pupils", e.record.id);
      const altesPasswort = stored ? vs.klartext(stored.getString("passwordPlain")) : "";
      if (neuesPasswort !== altesPasswort) {
        require(`${__hooks}/tt_pupils_passwort_mail_lib.pb.js`).sende(e.app, e.record);
      }
    }
  } catch (err) {
    e.app.logger().warn("[tt-pupils-passwort-mail] Reset-Hook Fehler", "error", String(err));
  }
  e.next();
}, "tt_pupils");
