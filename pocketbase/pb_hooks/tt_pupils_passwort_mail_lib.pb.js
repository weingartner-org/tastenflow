/// <reference path="../pb_data/types.d.ts" />
//
// Passwort-Mail für Klassen-Kinder mit hinterlegter Kontakt-Adresse
// --------------------------------------------------------------------------
// Gemeinsame Sende-Funktion für tt_pupils_passwort_mail.pb.js (Anlegen UND
// Zurücksetzen lösen dieselbe Mail aus, siehe dort). Eigene Datei statt
// Duplikat in beiden Hooks (anders als course_access_mail.pb.js) - hier gibt
// es keinen je-Aufruf-unterschiedlichen Kontext, nur den Datensatz selbst.
//
// Voraussetzung: `contactEmail` gesetzt UND `passwordPlain` nicht leer
// (Spiegel des sonst nie auslesbaren Auth-Passworts, siehe setup.mjs - seit
// 26.09.2026 verschlüsselt gespeichert, hier entschlüsselt). Bewusst neutral gehalten (Wunsch Johannes 14.09.2026) - die
// Mail legt nicht fest, ob sie an das Kind selbst oder an Erziehungs-
// berechtigte geht.
//
// Best effort: ein Mail-Fehler darf das Anlegen/Zurücksetzen des Kontos nie
// verhindern - das sichert der Aufrufer ab (e.next() läuft dort immer, auch
// wenn diese Funktion wirft).
//
// ★ Keine Mail-Bremse "fremd" nötig (anders als tt_teacher_welcome.pb.js):
// tt_pupils-Anlegen läuft nur über eine angemeldete Lehrkraft (createRule
// TT_TEACHER), Zurücksetzen nur über manageRule (ttClassStaff) - beides ohne
// Anmeldung unerreichbar. Die globale "gesamt"-Bremse (mail_bremse.pb.js,
// onMailerSend) greift trotzdem automatisch bei jedem Versand über
// newMailClient().

/**
 * Der Text der Mail - REINE Funktion (kein `app`), deutsch UND englisch
 * nebeneinander (EN9, 19.09.2026), ohne PocketBase prüfbar
 * (`tests/tastenflow-englisch-mails.test.ts`).
 *
 * ★ WELCHE SPRACHE? Die Mail geht an Kind oder Eltern - wer genau, legt sie
 * bewusst nicht fest (siehe oben). Die Sprache der LEHRKRAFT sagt darüber
 * nichts: Eine Lehrkraft, die Tastenflow auf Englisch bedient, hat nicht
 * deshalb englischsprachige Familien. Entschieden (Auftrag EN9): DEUTSCH,
 * ausser das Konto des Kindes selbst trägt `bedienSprache = "en"` - das Kind
 * hat die Bedienung dann selbst auf Englisch umgestellt.
 *
 * `d`: { name, passwort, classCode, appUrl }. Deutsch wörtlich wie vor EN9.
 */
function passwortMailInhalt(d, sprache) {
  var esc = function (s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };
  // ★ O4 (30.10.2026): die neun - Aufbau in tt_mail_neun_lib.pb.js.
  if (["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"].indexOf(String(sprache || "")) >= 0) return require(`${__hooks}/tt_mail_neun_lib.pb.js`).zugang(d, sprache);
  var linkAbsatz = d.appUrl
    ? '<p><a href="' + esc(d.appUrl) + '">' + esc(d.appUrl) + "</a></p>"
    : "";
  if (sprache === "en") {
    // Glossar §3.8: Zugangsdaten ⇒ *login details*, Klassencode ⇒ *class code*.
    return {
      vonName: "Sensorik - learning apps",
      subject: "Login details for " + d.name,
      html:
        '<div lang="en">' +
        "<p>Login details for <strong>" + esc(d.name) + "</strong>:</p>" +
        "<p>Name: <strong>" + esc(d.name) + "</strong><br>" +
        "Password: <strong>" + esc(d.passwort) + "</strong><br>" +
        "Class code: <strong>" + esc(d.classCode) + "</strong></p>" +
        "<p>Sign in to any of the learning apps in Lernwerkstatt with the class code, " +
        "name and password.</p>" +
        linkAbsatz +
        '<p style="color:#666;font-size:12px">This email was sent automatically because ' +
        "a contact email address is stored for this account. If the teacher changes the " +
        "password again, a new email will follow. If you have any questions, please ask " +
        "the teacher responsible.</p>" +
        "</div>",
    };
  }
  if (sprache === "fr") {
    // ★ E11c (26.09.2026): *identifiants*, *code de classe* (Glossar §9.2).
    // Ohne Anrede an Kind oder Eltern - wer liest, legt die Mail nicht fest;
    // der eine Satz an die Lesenden steht in „vous".
    return {
      vonName: "Sensorik - applications d'apprentissage",
      subject: "Identifiants de " + d.name,
      html:
        '<div lang="fr">' +
        "<p>Identifiants de <strong>" + esc(d.name) + "</strong> :</p>" +
        "<p>Nom : <strong>" + esc(d.name) + "</strong><br>" +
        "Mot de passe : <strong>" + esc(d.passwort) + "</strong><br>" +
        "Code de classe : <strong>" + esc(d.classCode) + "</strong></p>" +
        "<p>Connexion dans chaque application de Lernwerkstatt avec le code de classe, " +
        "le nom et le mot de passe.</p>" +
        linkAbsatz +
        '<p style="color:#666;font-size:12px">Cet e-mail a été envoyé automatiquement parce ' +
        "qu'une adresse e-mail de contact est enregistrée pour ce compte. Si l'enseignant ou " +
        "l'enseignante change à nouveau le mot de passe, un nouvel e-mail suivra. Pour toute " +
        "question, adressez-vous à l'enseignant ou à l'enseignante de la classe.</p>" +
        "</div>",
    };
  }
  if (sprache === "es") {
    // ★ ES-M (27.09.2026): *datos de acceso*, *código de clase* (Glossar ES-O
    // §2). Ohne Anrede an Kind oder Eltern - wer liest, legt die Mail nicht
    // fest; der eine Satz an die Lesenden steht in „usted".
    return {
      vonName: "Sensorik - programas de aprendizaje",
      subject: "Datos de acceso de " + d.name,
      html:
        '<div lang="es">' +
        "<p>Datos de acceso de <strong>" + esc(d.name) + "</strong>:</p>" +
        "<p>Nombre: <strong>" + esc(d.name) + "</strong><br>" +
        "Contraseña: <strong>" + esc(d.passwort) + "</strong><br>" +
        "Código de clase: <strong>" + esc(d.classCode) + "</strong></p>" +
        "<p>Para iniciar sesión en cualquier programa de Lernwerkstatt se necesitan el código " +
        "de clase, el nombre y la contraseña.</p>" +
        linkAbsatz +
        '<p style="color:#666;font-size:12px">Este correo se envió automáticamente porque ' +
        "esta cuenta tiene guardado un correo electrónico de contacto. Si la persona docente " +
        "vuelve a cambiar la contraseña, llegará un correo nuevo. Si tiene alguna pregunta, " +
        "diríjase a la persona docente de la clase.</p>" +
        "</div>",
    };
  }
  if (sprache === "it") {
    // ★ O-IT (02.10.2026): *dati di accesso*, *codice classe* (Glossar §2.5).
    // Ohne Anrede an Kind oder Familie - wer liest, legt die Mail nicht fest;
    // „l'insegnante" (Regel 2).
    return {
      vonName: "Sensorik - programmi di apprendimento",
      subject: "Dati di accesso di " + d.name,
      html:
        '<div lang="it">' +
        "<p>Dati di accesso di <strong>" + esc(d.name) + "</strong>:</p>" +
        "<p>Nome: <strong>" + esc(d.name) + "</strong><br>" +
        "Password: <strong>" + esc(d.passwort) + "</strong><br>" +
        "Codice classe: <strong>" + esc(d.classCode) + "</strong></p>" +
        "<p>Per accedere a qualsiasi programma di Lernwerkstatt servono il codice classe, " +
        "il nome e la password.</p>" +
        linkAbsatz +
        '<p style="color:#666;font-size:12px">Questa email è stata inviata automaticamente ' +
        "perché per questo account è salvato un indirizzo email di contatto. Se l'insegnante " +
        "cambia di nuovo la password, arriverà una nuova email. Per qualsiasi domanda, " +
        "rivolgersi all'insegnante della classe.</p>" +
        "</div>",
    };
  }
  if (sprache === "pl") {
    // ★ O-PL (02.10.2026): *dane logowania*, *kod klasy* (Glossar §2.5). Ohne
    // Anrede an Kind oder Familie - wer liest, legt die Mail nicht fest; der
    // Name nur nach Doppelpunkt (Regel 11), die Lehrkraft als „osoba
    // prowadząca klasę" (Regel 2).
    return {
      vonName: "Sensorik - programy do nauki",
      subject: "Dane logowania: " + d.name,
      html:
        '<div lang="pl">' +
        "<p>Dane logowania: <strong>" + esc(d.name) + "</strong></p>" +
        "<p>Imię: <strong>" + esc(d.name) + "</strong><br>" +
        "Hasło: <strong>" + esc(d.passwort) + "</strong><br>" +
        "Kod klasy: <strong>" + esc(d.classCode) + "</strong></p>" +
        "<p>Do logowania w każdym programie na platformie Lernwerkstatt potrzebne są kod klasy, " +
        "imię i hasło.</p>" +
        linkAbsatz +
        '<p style="color:#666;font-size:12px">Ta wiadomość została wysłana automatycznie, ' +
        "bo przy tym koncie zapisano kontaktowy adres e-mail. Jeśli hasło zostanie znowu " +
        "zmienione, przyjdzie nowa wiadomość. W razie pytań najlepiej zwrócić się do osoby " +
        "prowadzącej klasę.</p>" +
        "</div>",
    };
  }
  if (sprache === "tr") {
    // ★ O-TR (02.10.2026): *giriş bilgileri*, *sınıf kodu* (Glossar §2.5). Ohne
    // Anrede an Kind oder Veli - wer liest, legt die Mail nicht fest; darum
    // Sätze ohne Person (weder sen noch siz). Der Name nur nach Doppelpunkt,
    // nie mit Endung (Regel 6); „Lernwerkstatt içindeki" statt einer Endung am Namen.
    return {
      vonName: "Sensorik - öğrenme programları",
      subject: "Giriş bilgileri: " + d.name,
      html:
        '<div lang="tr">' +
        "<p>Giriş bilgileri: <strong>" + esc(d.name) + "</strong></p>" +
        "<p>Ad: <strong>" + esc(d.name) + "</strong><br>" +
        "Şifre: <strong>" + esc(d.passwort) + "</strong><br>" +
        "Sınıf kodu: <strong>" + esc(d.classCode) + "</strong></p>" +
        "<p>Lernwerkstatt içindeki her programa sınıf kodu, ad ve şifre ile giriş yapılır.</p>" +
        linkAbsatz +
        '<p style="color:#666;font-size:12px">Bu e-posta, bu hesap için bir iletişim e-posta ' +
        "adresi kayıtlı olduğu için otomatik olarak gönderildi. Şifre yeniden değiştirilirse " +
        "yeni bir e-posta gelir. Sorular için en iyisi sınıfın öğretmenine başvurmaktır.</p>" +
        "</div>",
    };
  }
  if (sprache === "cs") {
    // ★ O-CS (03.10.2026): *přihlašovací údaje*, *kód třídy* (Glossar §2.5).
    // Ohne Anrede an Kind oder Eltern - wer liest, legt die Mail nicht fest;
    // darum Sätze ohne Person. Der Name nur nach Doppelpunkt, nie gebeugt
    // (Regel 12); „vyučující" nur im Nominativ (Regel 2); Lernwerkstatt mit
    // Kopfwort („v aplikaci Lernwerkstatt").
    return {
      vonName: "Sensorik - výukové programy",
      subject: "Přihlašovací údaje: " + d.name,
      html:
        '<div lang="cs">' +
        "<p>Přihlašovací údaje: <strong>" + esc(d.name) + "</strong></p>" +
        "<p>Jméno: <strong>" + esc(d.name) + "</strong><br>" +
        "Heslo: <strong>" + esc(d.passwort) + "</strong><br>" +
        "Kód třídy: <strong>" + esc(d.classCode) + "</strong></p>" +
        "<p>Do každého výukového programu v aplikaci Lernwerkstatt se přihlašuje kódem třídy, " +
        "jménem a heslem.</p>" +
        linkAbsatz +
        '<p style="color:#666;font-size:12px">Tento e-mail byl odeslán automaticky, protože je ' +
        "u tohoto účtu uložena kontaktní e-mailová adresa. Pokud se heslo znovu změní, přijde " +
        "nový e-mail. Na otázky odpoví vyučující třídy.</p>" +
        "</div>",
    };
  }
  return {
    vonName: "Sensorik — Lernprogramme",
    subject: "Zugangsdaten für " + d.name,
    html:
      "<p>Zugangsdaten für <strong>" + esc(d.name) + "</strong>:</p>" +
      "<p>Name: <strong>" + esc(d.name) + "</strong><br>" +
      "Passwort: <strong>" + esc(d.passwort) + "</strong><br>" +
      "Klassencode: <strong>" + esc(d.classCode) + "</strong></p>" +
      "<p>Anmeldung in jedem Lernprogramm der Lernwerkstatt mit Klassencode, " +
      "Name und Passwort.</p>" +
      linkAbsatz +
      '<p style="color:#666;font-size:12px">Diese Mail wurde automatisch ' +
      "versendet, weil für dieses Konto eine Kontakt-E-Mail-Adresse hinterlegt " +
      "ist. Ändert die Lehrkraft das Passwort erneut, kommt eine neue Mail. " +
      "Fragen dazu beantwortet die zuständige Lehrkraft.</p>",
  };
}

function sende(app, record) {
  const contactEmail = String(record.getString("contactEmail") || "").trim();
  // ★★★ Seit 26.09.2026 verschlüsselt gespeichert - für die Mail entschlüsseln
  // (`tt_pupils_passwort_verschluesseln_lib.pb.js`). Ein Klartext (Aufruf der
  // Lehrkraft vor dem Speichern, Alt-Zeile vor der Umstellung) kommt
  // unverändert zurück; geht das Entschlüsseln nicht, geht KEINE Mail - lieber
  // keine als eine mit Schlüsseltext statt Passwort.
  let passwort = "";
  try {
    passwort = String(
      require(`${__hooks}/tt_pupils_passwort_verschluesseln_lib.pb.js`).klartext(
        record.getString("passwordPlain"),
      ) || "",
    );
  } catch (_) {
    passwort = "";
  }
  if (!contactEmail || !passwort) {
    if (contactEmail && record.getString("passwordPlain")) {
      app.logger().error("[tt-pupils-passwort-mail] Passwort nicht entschlüsselbar - keine Mail", "pupil", record.id);
    }
    return;
  }

  const name = record.getString("name") || "";
  const classCode = record.getString("classCode") || "";

  let appUrl = "";
  try {
    appUrl = app.settings().meta.appURL || "";
  } catch (_) {
    appUrl = "";
  }
  // ★ EN9: "en" nur bei genau "en" am Konto des KINDES (siehe oben).
  // ★ E11c: ebenso "fr" nur bei genau "fr".
  // ★ ES-M (27.09.2026): ebenso "es" - über DIE eine Stelle, die alle
  // Mail-Hooks fragen (`spracheVon`, `MAIL_SPRACHEN` in tt_mail_texte_lib.pb.js).
  let sprache = "de";
  try {
    sprache = require(`${__hooks}/tt_mail_texte_lib.pb.js`).spracheVon(record);
  } catch (_) {
    sprache = "de";
  }
  const mail = passwortMailInhalt(
    { name: name, passwort: passwort, classCode: classCode, appUrl: appUrl },
    sprache,
  );

  try {
    const message = new MailerMessage({
      from: { address: app.settings().meta.senderAddress, name: mail.vonName },
      to: [{ address: contactEmail }],
      subject: mail.subject,
      html: mail.html,
    });
    app.newMailClient().send(message);
    app.logger().info("[tt-pupils-passwort-mail] gesendet", "pupil", record.id);
  } catch (err) {
    app
      .logger()
      .warn(
        "[tt-pupils-passwort-mail] Versand fehlgeschlagen",
        "error",
        String(err),
        "pupil",
        record.id,
      );
  }
}

if (typeof module !== "undefined") {
  module.exports = { sende, passwortMailInhalt };
}
