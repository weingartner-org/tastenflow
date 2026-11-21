/// <reference path="../pb_data/types.d.ts" />
//
// Mail-Bremse: die Zählung (02.09.2026)
// =====================================
// Gemeinsamer Teil von `mail_bremse.pb.js` und `tt_teacher_welcome.pb.js`.
// Steht in einer eigenen Datei, weil ein Hook-Handler NICHTS sieht, was im
// Dateikopf steht (bekannter Fallstrick, [[reference_pocketbase_hook_scope]]) -
// geteilt wird darum über `require()` INNERHALB des Handlers.
//
// ⚠️ PocketBase führt beim Start JEDE `*.pb.js` aus, auch diese Begleitdatei -
// dabei ist `module` nicht definiert. Bis zum 08.09.2026 stand der Export hier
// ungeschützt, und jeder Dienst-Neustart meldete „module is not defined".
// Folgenlos für den Betrieb, aber eine Fehlerzeile im Protokoll, die echte
// Fehler verdeckt. Seither trägt der Export unten den Wächter
// `if (typeof module !== "undefined")`, wie alle übrigen `*_lib.pb.js`.
//
// ── Warum überhaupt gezählt wird ────────────────────────────────────────────
// Ein Bot, der Konten anlegt, füllt nicht die Datenbank - er füllt das
// POSTFACH. Jede Registrierung stösst eine Mail an, und der Versand läuft über
// ein privates iCloud-Konto mit einem Tageslimit. Ist das gerissen, kommen auch
// die ECHTEN Mails nicht mehr an: Fristen-Erinnerungen, Wochenberichte,
// Löschwarnungen. Der teure Schaden ist also nicht der Speicherplatz, sondern
// der stumme Absender am nächsten Morgen.
//
// ── Zwei Töpfe, und warum es zwei sein müssen ───────────────────────────────
// `fremd`  - alles, was eine fremde Person OHNE Anmeldung auslösen kann:
//            Bestätigungsmail, Passwort-vergessen, Adresswechsel, Begrüssung
//            eines neuen Lehrkraft-Kontos. Enge Grenze.
// `gesamt` - jede Mail des Servers, auch die nächtlichen Läufe. Weite Grenze.
//
// Ein einziger Topf wäre zu wenig: Ein Angreifer könnte die Tagesmenge
// aufbrauchen und damit den Wochenbericht am Montagmorgen mit abschalten. Mit
// zwei Töpfen kommt er an 40 Mails am Tag nicht vorbei - die übrigen 360
// bleiben für die Arbeit der Plattform reserviert.
//
// ── Gezählt wird am BESTAND, nie im Speicher ────────────────────────────────
// Jeder Hook-Aufruf läuft in einer frischen Laufzeit; eine Zahl in einer
// Variablen wäre beim nächsten Aufruf wieder null. Der Zähler steht darum in
// der Collection `mail_bremse` (eine Zeile je Topf und Zeitfenster).

// Der Rumpf steht in einer Variablen, damit die Datei auch ohne `module`
// fehlerfrei durchläuft - der Export folgt unten hinter dem Wächter.
var mailBremse = {
  /**
   * Zählt eine Mail und sagt, ob sie noch hinausgehen darf.
   *
   * @param app    PocketBase-App aus dem Hook (`e.app`).
   * @param topf   "fremd" oder "gesamt".
   * @returns {{ erlaubt: boolean, grund: string }}
   */
  darfRaus(app, topf) {
    // Grenzen. Gemessener Normalbetrieb am 02.09.2026: 49 LMS-Konten,
    // 8 Lehrkräfte - die grösste Spitze im Alltag ist eine Ankündigung an alle
    // (49 Mails in einer Minute).
    //
    // ⚠️⚠️ `fremd` stand zuerst auf 10 je Stunde. Das war an einem Bot gemessen
    // und nicht am Betrieb: Johannes meldet ein Seminar mit **30 Studierenden
    // im selben Uni-WLAN** an, und jede LMS-Registrierung stösst sofort eine
    // Bestätigungsmail an. 20 von ihnen hätten ihre Mail nie bekommen -
    // während die Anmeldung selbst durchlief. Der Fehler wäre erst im
    // Seminarraum aufgefallen, und dort als „die Plattform funktioniert
    // nicht".
    //
    // Seit dem 03.09. sind es 60 Studierende (Johannes: „heb die studies auf
    // 60 an") - also bis zu 60 Bestätigungsmails in einer Stunde, plus zweite
    // Anläufe. 120 je Stunde decken das mit Spielraum.
    //
    // Der TAG bleibt der eigentliche Schutz des Postfachs: 250 sind gut das
    // Dreifache eines vollen Seminartags und deutlich unter dem, was ein
    // iCloud-Konto am Tag verträgt. Ein Bot kommt damit an 250 Mails nicht
    // vorbei, ganz gleich von wie vielen Adressen er kommt - die Mail-Bremse
    // zählt als einzige Grenze NICHT je IP, und genau darum ist sie die
    // wirksame. Die IP-Grenzen sind Bequemlichkeit; DIESE Zahl ist der Schutz.
    //
    // `gesamt` liegt so weit darüber, dass nach einem vollen fremden Tag noch
    // 200 Mails für die Plattform selbst übrig sind. Gemessen am 02.09. an den
    // Server-Protokollen: Der eigene Versand liegt bei einer Handvoll Mails je
    // Woche (zwei Wochenberichte in den vorgehaltenen Protokolltagen) - die
    // 200 sind das Vielfache jeder echten Spitze.
    //
    // ⚠️ Wer die Grenzen der Registrierungs-Türen in `setup.mjs` ändert, muss
    // hier mitziehen. Die beiden hängen zusammen: Eine angehobene Anmeldung
    // ohne angehobene Mailgrenze heisst, dass die Anmeldung durchläuft und die
    // Bestätigungsmail nicht kommt - und das fällt erst im Seminarraum auf.
    const GRENZEN = {
      fremd: { stunde: 120, tag: 250 },
      gesamt: { stunde: 200, tag: 450 },
    };
    const grenze = GRENZEN[topf] || GRENZEN.gesamt;

    // ISO-Zeit als Fensterschlüssel: "2026-09-02T21" (Stunde), "2026-09-02"
    // (Tag). UTC, weil der Server in UTC läuft - die Grenze soll nicht zur
    // Zeitumstellung springen.
    const jetzt = new Date().toISOString();
    const fenster = [
      { schluessel: topf + ":h:" + jetzt.slice(0, 13), max: grenze.stunde, name: "Stunde" },
      { schluessel: topf + ":t:" + jetzt.slice(0, 10), max: grenze.tag, name: "Tag" },
    ];

    for (const f of fenster) {
      let rec = null;
      try {
        rec = app.findFirstRecordByFilter("mail_bremse", "fenster = {:f}", {
          f: f.schluessel,
        });
      } catch (_) {
        rec = null;
      }
      let anzahl = 0;
      try {
        if (!rec) {
          const coll = app.findCollectionByNameOrId("mail_bremse");
          rec = new Record(coll);
          rec.set("fenster", f.schluessel);
          rec.set("anzahl", 0);
        }
        anzahl = Number(rec.getInt("anzahl") || 0) + 1;
        rec.set("anzahl", anzahl);
        app.save(rec);
      } catch (err) {
        // Lässt sich der Zähler nicht schreiben, wird NICHT gebremst: eine
        // kaputte Bremse darf die Plattform nicht stumm schalten. Der Fehler
        // steht im Protokoll.
        app.logger().warn("[mail-bremse] Zähler nicht schreibbar", "error", String(err));
        return { erlaubt: true, grund: "" };
      }
      if (anzahl > f.max) {
        return {
          erlaubt: false,
          grund:
            "Topf „" + topf + "“ über der Grenze je " + f.name +
            " (" + anzahl + " > " + f.max + ")",
        };
      }
    }
    return { erlaubt: true, grund: "" };
  },
};

// --- Export (nur im require()-Kontext; beim Auto-Laden kein `module`) --------
if (typeof module !== "undefined") {
  module.exports = mailBremse;
}
