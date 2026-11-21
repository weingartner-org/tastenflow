/// <reference path="../pb_data/types.d.ts" />
//
// Kinder-Passwörter VERSCHLÜSSELT ablegen (26.09.2026) - die Verdrahtung.
// Was und warum: `tt_pupils_passwort_verschluesseln_lib.pb.js`.
//
// ★★★ WARUM MODELL-HOOKS (onRecordCreate/onRecordUpdate) UND NICHT
// onRecord…Request: Die Request-Hooks sehen nur Schreibungen über die API.
// `app.save(...)` in einer Route (`/api/tt/kind-verschieben`,
// `/api/tt/klassencode-aendern`), in einem Cron oder aus der Admin-Oberfläche
// liefe daran vorbei. Die Modell-Hooks feuern bei JEDEM Speichern, vor der
// Prüfung und vor dem INSERT/UPDATE - der Klartext erreicht die Datenbank nie.
//
// Die Request-Hooks davor (Feld-Wächter, Passwort-Mail) sehen darum weiter
// den Klartext aus dem Aufruf der Lehrkraft; die Mail vergleicht seither
// entschlüsselt (siehe `tt_pupils_passwort_mail.pb.js`).
//
// ⚠️ Handler holen alles per `require` ([[reference_pocketbase_hook_scope]]).

onRecordCreate((e) => {
  try {
    require(`${__hooks}/tt_pupils_passwort_verschluesseln_lib.pb.js`).vorDemSpeichern(e.app, e.record);
  } catch (err) {
    // Fail-closed, ohne das Speichern zu verhindern: lieber kein Spiegel als
    // Klartext. Ein schon verschlüsselter Wert aus der Datenbank bleibt.
    if (String(e.record.getString("passwordPlain") || "").indexOf("enc:v1:") !== 0) {
      e.record.set("passwordPlain", "");
    }
    e.app.logger().error("[tt-passwort-verschluesseln] Hook-Fehler - Spiegel geleert", "error", String(err));
  }
  e.next();
}, "tt_pupils");

onRecordUpdate((e) => {
  try {
    require(`${__hooks}/tt_pupils_passwort_verschluesseln_lib.pb.js`).vorDemSpeichern(e.app, e.record);
  } catch (err) {
    // Fail-closed, ohne das Speichern zu verhindern: lieber kein Spiegel als
    // Klartext. Ein schon verschlüsselter Wert aus der Datenbank bleibt.
    if (String(e.record.getString("passwordPlain") || "").indexOf("enc:v1:") !== 0) {
      e.record.set("passwordPlain", "");
    }
    e.app.logger().error("[tt-passwort-verschluesseln] Hook-Fehler - Spiegel geleert", "error", String(err));
  }
  e.next();
}, "tt_pupils");

onRecordEnrich((e) => {
  try {
    require(`${__hooks}/tt_pupils_passwort_verschluesseln_lib.pb.js`).anreichern(e);
  } catch (_) {
    e.record.hide("passwordPlain");
  }
  e.next();
}, "tt_pupils");

// Einmalige Umstellung der Alt-Zeilen bei jedem Start - wiederholbar, ohne
// Modell-Hooks (rohes SQL), also ohne eine einzige Mail.
onBootstrap((e) => {
  e.next();
  try {
    const r = require(`${__hooks}/tt_pupils_passwort_verschluesseln_lib.pb.js`).migriere(e.app);
    if (r.ohneSchluessel) {
      e.app
        .logger()
        .error(
          "[tt-passwort-verschluesseln] TT_PASSWORT_SCHLUESSEL fehlt - Klartext-Zeilen bleiben UNVERSCHLÜSSELT",
          "gesehen",
          r.gesehen,
        );
    } else if (r.verschluesselt > 0 || r.fehler > 0) {
      e.app
        .logger()
        .info(
          "[tt-passwort-verschluesseln] Alt-Zeilen umgestellt",
          "verschluesselt",
          r.verschluesselt,
          "fehler",
          r.fehler,
          "gesehen",
          r.gesehen,
        );
    }
  } catch (err) {
    // Frische Datenbank ohne tt_pupils (vor `setup.mjs`) - nichts zu tun.
    try {
      e.app.logger().warn("[tt-passwort-verschluesseln] Umstellung übersprungen", "error", String(err));
    } catch (_) {}
  }
});
