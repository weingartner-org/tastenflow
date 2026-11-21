/// <reference path="../pb_data/types.d.ts" />
//
// Die Konto-Mails von Tastenflow in der Sprache des Kontos (EN9, 19.09.2026)
// ==========================================================================
// „Passwort vergessen", „E-Mail-Adresse bestätigen" und „Neue Adresse
// bestätigen" verschickt PocketBase selbst, mit den Vorlagen der Sammlungen
// `tt_teachers` und `tt_pupils` (setup.mjs). Eine Vorlage je Sammlung - und
// die ist deutsch. Wer Tastenflow auf Englisch benutzt (`bedienSprache =
// "en"` am Konto), bekäme als allererste Mail nach dem Anlegen eine deutsche
// Bestätigung.
//
// Darum ersetzen diese drei Haken, KURZ VOR DEM VERSAND, Betreff und Text
// durch die englische Fassung (`kontoMailEn` in tt_mail_texte_lib.pb.js). Den
// Link mit dem Token nehmen sie aus der fertigen deutschen Mail (`linkAus`) -
// er bleibt damit Zeichen für Zeichen, was PocketBase erzeugt hat.
//
// ★ E11c (26.09.2026): dasselbe für "fr" (`kontoMailInSprache`, französische
// Texte `KONTO_MAILS_FR` in tt_mail_texte_lib.pb.js).
//
// Alles andere bleibt, wie es ist: kein "en" am Konto ⇒ die Mail wird nicht
// angefasst. Geht beim Ersetzen irgendetwas schief, geht die DEUTSCHE Mail
// hinaus - eine Mail in der falschen Sprache ist besser als keine.
//
// ⚠️ Reihenfolge: `mail_bremse.pb.js` hängt an denselben Ereignissen und wird
// vorher geladen (PocketBase lädt die Hooks alphabetisch). Unterdrückt die
// Bremse eine Mail, ruft sie `e.next()` nicht auf - dann kommt dieser Haken
// gar nicht erst dran.
//
// ⚠️ Hook-Scope: Jeder Handler holt die Lib selbst per require() - ein
// Handler sieht nichts aus dem Kopf seiner Datei
// (tests/pocketbase-hook-scope.test.ts). Darum steht der Handler dreimal fast
// gleich da statt in einer Schleife (dieselbe Begründung wie in
// mail_bremse.pb.js).
//
// Deploy: Datei nach pb_hooks/ + Neustart, mit dem Feld `bedienSprache`
// (setup.mjs) → „Update LMS (komplett)".

onMailerRecordPasswordResetSend((e) => {
  try {
    const texte = require(`${__hooks}/tt_mail_texte_lib.pb.js`);
    const sprache = texte.spracheVon(e.record);
    if (sprache !== "de") {
      const m = texte.kontoMailInSprache(sprache, "passwort", e.record.collection().name, texte.linkAus(e.message.html));
      if (m) {
        e.message.subject = m.subject;
        e.message.html = m.html;
      }
    }
  } catch (err) {
    (e.app || $app).logger().warn("[tt-mail-sprache] Passwort-Mail bleibt deutsch", "error", String(err));
  }
  e.next();
}, "tt_teachers", "tt_pupils");

onMailerRecordVerificationSend((e) => {
  try {
    const texte = require(`${__hooks}/tt_mail_texte_lib.pb.js`);
    const sprache = texte.spracheVon(e.record);
    if (sprache !== "de") {
      const m = texte.kontoMailInSprache(sprache, "bestaetigung", e.record.collection().name, texte.linkAus(e.message.html));
      if (m) {
        e.message.subject = m.subject;
        e.message.html = m.html;
      }
    }
  } catch (err) {
    (e.app || $app).logger().warn("[tt-mail-sprache] Bestätigung bleibt deutsch", "error", String(err));
  }
  e.next();
}, "tt_teachers", "tt_pupils");

onMailerRecordEmailChangeSend((e) => {
  try {
    const texte = require(`${__hooks}/tt_mail_texte_lib.pb.js`);
    const sprache = texte.spracheVon(e.record);
    if (sprache !== "de") {
      const m = texte.kontoMailInSprache(sprache, "adresse", e.record.collection().name, texte.linkAus(e.message.html));
      if (m) {
        e.message.subject = m.subject;
        e.message.html = m.html;
      }
    }
  } catch (err) {
    (e.app || $app).logger().warn("[tt-mail-sprache] Adresswechsel bleibt deutsch", "error", String(err));
  }
  e.next();
}, "tt_teachers", "tt_pupils");
