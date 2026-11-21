/// <reference path="../pb_data/types.d.ts" />
//
// Kinder-Passwörter VERSCHLÜSSELT ablegen (26.09.2026)
// --------------------------------------------------------------------------
// `tt_pupils.passwordPlain` ist der Spiegel des Kinder-Passworts für die
// Teilnehmerliste und die Passwort-Mail (Begründung in `setup.mjs`). Bis
// 26.09.2026 stand er im KLARTEXT in der Datenbank - wer die Datei
// `data.db` oder eine Sicherung davon in die Hand bekam, las jedes Passwort.
// Jetzt steht dort `enc:v1:<AES-256-GCM, base64>`; entschlüsselt wird nur für
// die Antwort an die Lehrkraft der Klasse und für die Passwort-Mail.
//
// Der Schlüssel kommt aus der Dienst-Umgebung `TT_PASSWORT_SCHLUESSEL` -
// genau 32 Zeichen (`openssl rand -hex 16`). Er liegt NIE in der Datenbank
// und nie in einer Sicherung von `pb_data`.
//
// Die Aufrufer (alle in `tt_pupils_passwort_verschluesseln.pb.js`, dazu
// `tt_pupils_passwort_mail*.pb.js`):
//   • vorDemSpeichern  - Modell-Hook onRecordCreate/onRecordUpdate: JEDER
//                        Schreibweg (API, Admin-Oberfläche, `app.save` in
//                        einer Route) geht hier durch.
//   • anreichern       - onRecordEnrich: Klartext nur für die Lehrkraft der
//                        Klasse (Eigentümerin oder Co-Lehrkraft).
//   • migriere         - onBootstrap: alte Klartext-Zeilen per rohem SQL
//                        verschlüsseln - OHNE Modell-Hooks, also ohne Mail.
//   • klartext         - für die Mail und den Vergleich „hat sich das
//                        Passwort wirklich geändert?".
//
// ⚠️ Handler sehen die Funktionen dieser Datei nur über `require(...)`
// ([[reference_pocketbase_hook_scope]]). Darum steht hier alles, was mehr als
// ein Handler braucht.

var PRAEFIX = "enc:v1:";
var FELD = "passwordPlain";
var ENV = "TT_PASSWORT_SCHLUESSEL";

/** Der Schlüssel aus der Umgebung - "" wenn er fehlt oder nicht 32 Zeichen hat. */
function schluessel() {
  var k = "";
  try {
    k = String($os.getenv(ENV) || "");
  } catch (_) {
    k = "";
  }
  return k.length === 32 ? k : "";
}

/** `$security.decrypt` liefert Bytes (Go `[]byte`) - als Text lesen. */
function alsText(roh) {
  if (typeof roh === "string") return roh;
  return toString(roh);
}

function verschluessele(klartext, key) {
  return PRAEFIX + $security.encrypt(String(klartext), key);
}

/**
 * Entschlüsselt einen gespeicherten Wert.
 *  - "" bleibt "".
 *  - Ohne Präfix ist es ein Alt-Wert im Klartext (vor der Migration) - so zurück.
 *  - Mit Präfix: der Klartext, oder `null`, wenn es nicht geht (kein/falscher
 *    Schlüssel, verfälschter Text - GCM prüft die Echtheit).
 */
function klartext(wert, key) {
  var w = String(wert || "");
  if (!w) return "";
  if (w.indexOf(PRAEFIX) !== 0) return w;
  var k = key === undefined ? schluessel() : key;
  if (!k) return null;
  try {
    return alsText($security.decrypt(w.slice(PRAEFIX.length), k));
  } catch (_) {
    return null;
  }
}

/**
 * Trägt der Wert schon einen GÜLTIGEN Schlüsseltext? Nur das Präfix zu prüfen
 * reichte nicht: Ein Passwort, das zufällig mit „enc:v1:" beginnt, bliebe
 * sonst im Klartext stehen. Gültig heisst: mit diesem Schlüssel entschlüsselbar.
 */
function istVerschluesselt(wert, key) {
  var w = String(wert || "");
  if (w.indexOf(PRAEFIX) !== 0) return false;
  return klartext(w, key) !== null;
}

/**
 * Modell-Hook vor dem Schreiben. Klartext ⇒ verschlüsselt. Schon gültig
 * verschlüsselt (jede Änderung am Kind, die das Passwort nicht anfasst) ⇒
 * unverändert.
 *
 * ★★★ FEHLT DER SCHLÜSSEL: fail-closed. Es wird KEIN Klartext geschrieben -
 * das Feld bleibt leer, und das Protokoll meldet es als Fehler. Das Anlegen
 * des Kindes und das Zurücksetzen seines Passworts gehen trotzdem durch (das
 * echte Anmelde-Passwort ist ein eigenes, gehashtes Feld); die Teilnehmerliste
 * zeigt dann für dieses Kind kein Passwort - wie bei Konten von vor dem
 * 14.09.2026 -, bis mit Schlüssel einmal zurückgesetzt wird. Ein Wert, der
 * schon mit „enc:v1:" dasteht, bleibt ohne Schlüssel unangetastet: Er kommt
 * aus der Datenbank, und ihn zu leeren, verlöre ihn.
 */
function vorDemSpeichern(app, record) {
  var w = String(record.getString(FELD) || "");
  if (!w) return "leer";
  var key = schluessel();
  if (!key) {
    if (w.indexOf(PRAEFIX) === 0) return "ohne-schluessel-belassen";
    record.set(FELD, "");
    try {
      app
        .logger()
        .error(
          "[tt-passwort-verschluesseln] " + ENV + " fehlt oder hat nicht 32 Zeichen - " +
            "Passwort-Spiegel NICHT gespeichert (kein Klartext in der Datenbank)",
          "pupil",
          record.id,
        );
    } catch (_) {}
    return "geleert";
  }
  if (istVerschluesselt(w, key)) return "schon-verschluesselt";
  record.set(FELD, verschluessele(w, key));
  return "verschluesselt";
}

/**
 * Ist `auth` Lehrkraft der Klasse dieses Kindes - Eigentümerin der Klasse
 * (`tt_classes.teacherUid`) oder Co-Lehrkraft (`tt_class_teachers`)? Dieselbe
 * Frage wie `ttClassStaff("classCode")` in den Regeln (`setup.mjs`).
 */
function istLehrkraftDerKlasse(app, auth, record) {
  try {
    if (!auth || auth.collection().name !== "tt_teachers") return false;
    var code = String(record.getString("classCode") || "");
    if (!code) return false;
    try {
      app.findFirstRecordByFilter("tt_classes", "code = {:c} && teacherUid = {:t}", {
        c: code,
        t: auth.id,
      });
      return true;
    } catch (_) {}
    try {
      app.findFirstRecordByFilter("tt_class_teachers", "classCode = {:c} && teacherUid = {:t}", {
        c: code,
        t: auth.id,
      });
      return true;
    } catch (_) {}
  } catch (_) {}
  return false;
}

/**
 * onRecordEnrich: was die Antwort (GET, Liste, Antwort auf Anlegen/Ändern,
 * Anmeldung, Realtime) im Feld trägt.
 *  - Lehrkraft der Klasse ⇒ der Klartext (wie vor dem 26.09.2026).
 *  - Superuser ⇒ der gespeicherte Schlüsseltext, UNVERÄNDERT. Nicht versteckt:
 *    Die Admin-Oberfläche schickt beim Speichern jedes Feld zurück - fehlte es,
 *    schriebe sie es leer. Den Schlüsseltext nimmt `vorDemSpeichern` als
 *    „schon verschlüsselt" an. Ein Superuser liest ohnehin die Datenbank.
 *  - Alle anderen (das Kind selbst, eine fremde Lehrkraft, wer ohne
 *    Anmeldung fragt) ⇒ Feld versteckt.
 * Fail-closed: Wirft etwas, wird versteckt.
 */
function anreichern(e) {
  var auth = null;
  try {
    auth = e.requestInfo && e.requestInfo.auth;
  } catch (_) {
    auth = null;
  }
  try {
    if (auth && auth.isSuperuser && auth.isSuperuser()) return "superuser";
  } catch (_) {}
  try {
    if (istLehrkraftDerKlasse(e.app, auth, e.record)) {
      var roh = e.record.getString(FELD);
      var k = klartext(roh);
      if (k === null) {
        e.record.set(FELD, "");
        try {
          e.app
            .logger()
            .error(
              "[tt-passwort-verschluesseln] Entschlüsseln fehlgeschlagen (Schlüssel fehlt oder falsch)",
              "pupil",
              e.record.id,
            );
        } catch (_) {}
        return "fehler";
      }
      e.record.set(FELD, k);
      return "lehrkraft";
    }
  } catch (_) {}
  e.record.hide(FELD);
  return "versteckt";
}

/**
 * Einmalige, wiederholbare Umstellung der Alt-Zeilen (onBootstrap).
 *
 * ★★★ ROHES SQL, KEIN `app.save`. Ein `app.save` liefe durch die Modell-Hooks,
 * und die Passwort-Mail hängt an Anlegen/Ändern - jede Kontakt-Adresse bekäme
 * beim Neustart eine Mail. `app.db().newQuery(...)` feuert keinen Hook.
 *
 * Wiederholbar: Eine Zeile mit gültigem Schlüsseltext wird übersprungen; das
 * UPDATE trägt den alten Wert in der Bedingung (`AND passwordPlain = {:alt}`),
 * damit ein gleichzeitiges Schreiben nicht überschrieben wird.
 *
 * Gibt { gesehen, verschluesselt, fehler } zurück.
 */
function migriere(app) {
  var ergebnis = { gesehen: 0, verschluesselt: 0, fehler: 0, ohneSchluessel: false };
  var key = schluessel();
  var zeilen = arrayOf(new DynamicModel({ id: "", pw: "" }));
  app
    .db()
    .newQuery("SELECT id, passwordPlain AS pw FROM tt_pupils WHERE passwordPlain != ''")
    .all(zeilen);
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    var alt = String(z.pw || "");
    if (!alt) continue;
    ergebnis.gesehen++;
    if (!key) {
      if (alt.indexOf(PRAEFIX) !== 0) ergebnis.ohneSchluessel = true;
      continue;
    }
    if (istVerschluesselt(alt, key)) continue;
    try {
      app
        .db()
        .newQuery("UPDATE tt_pupils SET passwordPlain = {:neu} WHERE id = {:id} AND passwordPlain = {:alt}")
        .bind({ neu: verschluessele(alt, key), id: String(z.id), alt: alt })
        .execute();
      ergebnis.verschluesselt++;
    } catch (_) {
      ergebnis.fehler++;
    }
  }
  return ergebnis;
}

if (typeof module !== "undefined") {
  module.exports = {
    PRAEFIX: PRAEFIX,
    ENV: ENV,
    schluessel: schluessel,
    verschluessele: verschluessele,
    klartext: klartext,
    istVerschluesselt: istVerschluesselt,
    vorDemSpeichern: vorDemSpeichern,
    istLehrkraftDerKlasse: istLehrkraftDerKlasse,
    anreichern: anreichern,
    migriere: migriere,
  };
}
