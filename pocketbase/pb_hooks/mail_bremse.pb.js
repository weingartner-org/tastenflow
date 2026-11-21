/// <reference path="../pb_data/types.d.ts" />
//
// Mail-Bremse: die Haken (02.09.2026)
// ===================================
// Anlass Johannes: „was wenn ein bot 1000 benutzer anlegt oder sonst meine
// seite zumüllt". Gemessen an dem Abend: drei Registrierungs-Wege stehen ohne
// Anmeldung offen, und jeder von ihnen löst eine Mail aus. Die Datenbank
// steckt 1000 Zeilen weg; das iCloud-Postfach steckt 1000 Mails nicht weg.
//
// Diese Datei hängt die Zählung (`mail_bremse_lib.pb.js`) an zwei Stellen ein:
//
//  1. **`onMailerSend`** - läuft bei JEDER Mail, die der Server über
//     `newMailClient()` verschickt (PocketBase-Doku: „triggered every time when
//     a new email is being sent"). Topf `gesamt`. Das ist der Notausgang: was
//     hier durchfällt, geht nicht hinaus, egal wer es ausgelöst hat.
//
//  2. **Die vier Konto-Mails**, die eine fremde Person ohne Anmeldung auslösen
//     kann - Bestätigung, Passwort-vergessen, Einmalkennwort, Adresswechsel.
//     Topf `fremd`, enge Grenze. Eine Person, die den Server nicht kennt, kommt
//     damit an 10 Mails je Stunde und 40 am Tag nicht vorbei.
//
// ── Gebremst wird STILL ─────────────────────────────────────────────────────
// Ein Handler, der `e.next()` nicht aufruft, beendet die Kette - die Mail
// unterbleibt, der Aufrufer bekommt aber keinen Fehler. Das ist Absicht: Wäre
// es ein Fehler, schlüge eine überschrittene Grenze der registrierenden Person
// als „Etwas ist schiefgelaufen" entgegen, und ein Angreifer wüsste sofort,
// dass er die Bremse gefunden hat. Jede unterdrückte Mail steht mit Grund im
// Protokoll (`[mail-bremse] blockiert`) - dort und nur dort sieht man es.
//
// ⚠️ Wer die Grenzen ändert, ändert sie in `mail_bremse_lib.pb.js`, nicht hier.
//
// Deploy: Datei nach pb_hooks/ + Collection `mail_bremse` (setup.mjs) +
// Neustart → „Update LMS (komplett)".

// --- 1) Jede Mail: der weite Topf ------------------------------------------
onMailerSend((e) => {
  const app = e.app || $app;
  let urteil = { erlaubt: true, grund: "" };
  try {
    urteil = require(`${__hooks}/mail_bremse_lib.pb.js`).darfRaus(app, "gesamt");
  } catch (err) {
    // Eine kaputte Bremse darf die Plattform nicht stumm schalten.
    app.logger().warn("[mail-bremse] Prüfung fehlgeschlagen", "error", String(err));
    e.next();
    return;
  }
  if (!urteil.erlaubt) {
    let ziel = "";
    try {
      const to = e.message.to || [];
      ziel = to.length ? String(to[0].address || "") : "";
    } catch (_) {
      ziel = "";
    }
    app.logger().warn("[mail-bremse] blockiert", "grund", urteil.grund, "an", ziel);
    return; // kein e.next() ⇒ die Mail geht nicht hinaus
  }
  e.next();
});

// --- 2) Die vier Konto-Mails: der enge Topf --------------------------------
// Alle vier lassen sich ohne Anmeldung anstossen: Bestätigung und
// Einmalkennwort beim Anlegen, „Passwort vergessen" zu jeder fremden Adresse,
// Adresswechsel an einem gekaperten Konto. Sie teilen sich darum einen Topf.
//
// ⚠️ Der Handler steht viermal fast gleich da statt in einer Schleife: Ein
// Hook-Handler sieht nichts, was ausserhalb von ihm steht - auch keine
// Hilfsfunktion und keine Konstante. Eine Schleife über die vier Haken wäre
// kürzer und würde mit „is not defined" enden.

onMailerRecordVerificationSend((e) => {
  const app = e.app || $app;
  try {
    const urteil = require(`${__hooks}/mail_bremse_lib.pb.js`).darfRaus(app, "fremd");
    if (!urteil.erlaubt) {
      app.logger().warn("[mail-bremse] blockiert", "art", "Bestätigung", "grund", urteil.grund);
      return;
    }
  } catch (err) {
    app.logger().warn("[mail-bremse] Prüfung fehlgeschlagen", "error", String(err));
  }
  e.next();
});

onMailerRecordPasswordResetSend((e) => {
  const app = e.app || $app;
  try {
    const urteil = require(`${__hooks}/mail_bremse_lib.pb.js`).darfRaus(app, "fremd");
    if (!urteil.erlaubt) {
      app.logger().warn("[mail-bremse] blockiert", "art", "Passwort-Reset", "grund", urteil.grund);
      return;
    }
  } catch (err) {
    app.logger().warn("[mail-bremse] Prüfung fehlgeschlagen", "error", String(err));
  }
  e.next();
});

onMailerRecordOTPSend((e) => {
  const app = e.app || $app;
  try {
    const urteil = require(`${__hooks}/mail_bremse_lib.pb.js`).darfRaus(app, "fremd");
    if (!urteil.erlaubt) {
      app.logger().warn("[mail-bremse] blockiert", "art", "Einmalkennwort", "grund", urteil.grund);
      return;
    }
  } catch (err) {
    app.logger().warn("[mail-bremse] Prüfung fehlgeschlagen", "error", String(err));
  }
  e.next();
});

onMailerRecordEmailChangeSend((e) => {
  const app = e.app || $app;
  try {
    const urteil = require(`${__hooks}/mail_bremse_lib.pb.js`).darfRaus(app, "fremd");
    if (!urteil.erlaubt) {
      app.logger().warn("[mail-bremse] blockiert", "art", "Adresswechsel", "grund", urteil.grund);
      return;
    }
  } catch (err) {
    app.logger().warn("[mail-bremse] Prüfung fehlgeschlagen", "error", String(err));
  }
  e.next();
});
