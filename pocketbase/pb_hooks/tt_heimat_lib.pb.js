/// <reference path="../pb_data/types.d.ts" />
//
// Die Heimat-Adresse einer Lehrkraft in ihren Mails (Johannes 16.11.2026)
// ==========================================================================
// „wenn man ein lehrerkonto erstellt und plötzlich auf weingartner steht kennen
// sich die leute nicht mehr aus" - entschieden: „eigene adresse aber für
// tastenflow und lexami".
//
// `tt_teachers.heimat` sagt, auf welcher Adresse die Lehrkraft zuletzt
// angemeldet war: "tippen" (tastenflow.org), "lexami" (lexami.org) oder leer
// (weingartner.org). Der Client schreibt es beim Anlegen und bei jeder
// Anmeldung (`schreibeHeimat` in src/lib/typing/pbBackend.ts).
//
// Die Mails bauen ihre Links weiter mit `appURL` (weingartner.org). `umlenken`
// setzt DANACH die Heimat-Adresse ein - ein Eingriff an EINER Stelle statt in
// jeder Mail-Vorlage und jeder Sprache:
//   - `<appURL>/lernwerkstatt` (der Weg „zur Lernwerkstatt") ⇒ `/meine-klasse`
//   - jeder andere Link `<appURL>/…` ⇒ derselbe Pfad auf der Heimat-Adresse
// Ohne Heimat (leer, unbekannt, Kind-Konto) bleibt die Mail Zeichen für Zeichen.

var HEIMAT_BASIS = {}; // Paket: keine eigenen Heimat-Adressen, die Links bleiben auf der appURL

/** "tippen" | "lexami" | "" - nie etwas anderes. */
function heimatVon(rec) {
  var h = "";
  try {
    h = rec ? String(rec.getString("heimat") || "") : "";
  } catch (_) {
    h = "";
  }
  return Object.prototype.hasOwnProperty.call(HEIMAT_BASIS, h) ? h : "";
}

/** Die Adresse, auf die die Links der Mail zeigen sollen. */
function basisFuer(rec, appUrl) {
  var h = heimatVon(rec);
  return h ? HEIMAT_BASIS[h] : appUrl;
}

/**
 * Setzt in einem fertigen Mailtext die Heimat-Adresse ein. `appUrl` ist die
 * Adresse, mit der die Mail gebaut wurde (z. B. "https://weingartner.org").
 */
function umlenken(text, appUrl, rec) {
  if (!text) return text;
  var h = heimatVon(rec);
  var alt = String(appUrl || "").replace(/\/+$/, "");
  if (!h || !alt) return text;
  var neu = HEIMAT_BASIS[h];
  var s = String(text);
  // Der Weg „zur Lernwerkstatt" endet auf der Heimat-Adresse in „Meine Klassen"
  // dieser App - nur der GENAUE Pfad, nicht /lernwerkstatt-einladung usw.
  s = s.replace(
    new RegExp(alt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "/lernwerkstatt(?=[\"'<\\s]|$)", "g"),
    neu + "/meine-klasse?app=" + h,
  );
  return s.split(alt + "/").join(neu + "/").split(alt + '"').join(neu + '"');
}

// Export nur im require()-Kontext - beim Auto-Laden als Hook gibt es kein `module`
// (sonst bei jedem Start „module is not defined", gemessen 16.11. am Server).
if (typeof module !== "undefined") {
  module.exports = {
    HEIMAT_BASIS: HEIMAT_BASIS,
    heimatVon: heimatVon,
    basisFuer: basisFuer,
    umlenken: umlenken,
  };
}
