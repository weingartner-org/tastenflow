/// <reference path="../pb_data/types.d.ts" />
//
// „Tastenflow" — Co-Lehrkräfte: IMPLEMENTIERUNG (Begleitdatei)
// ----------------------------------------------------------------
// WARUM eine eigene Datei? PocketBase führt die `routerAdd`-Handler in einem
// SEPARATEN Runtime-Pool aus, der die im selben .pb.js-File oben definierten
// Top-Level-Funktionen NICHT kennt. Ruft ein Handler so eine Hilfsfunktion auf,
// stürzt er ab → der Client sieht nur „Something went wrong" (HTTP 400/500).
// Lösung: Die gesamte Logik liegt hier und wird vom Handler per
//   require(`${__hooks}/tt_coteacher_lib.pb.js`)
// INNERHALB des Handlers geladen — dabei wird DIESE Datei komplett ausgewertet,
// also sind alle Hilfsfunktionen verfügbar (klassisches CommonJS-Modul).
//
// Diese Datei registriert KEINE Route. Sie wird zwar von PocketBase als Hook
// automatisch geladen, exportiert dann aber nur (siehe Guard ganz unten) —
// beim Auto-Laden ist `module` nicht definiert, deshalb der typeof-Guard, sonst
// gäbe es bei jedem Start eine „module is not defined"-Fehlerzeile.
//
// Verträge siehe tt_coteacher.pb.js.
//
// ── Einladung noch nicht registrierter Kolleg:innen (14.09.2026) ───────────
// Bis dahin schlug `add` mit 404 fehl, wenn es zur E-Mail kein `tt_teachers`-
// Konto gab - die Lehrkraft musste die Person erst BITTEN, sich anzumelden.
// Jetzt legt derselbe Pfad stattdessen eine Zeile in `tt_class_teacher_invites`
// an und verschickt eine Einladungsmail mit Token-Link. Bauart 1:1 von
// apps/mathecoach `ma_beobachter_lib.pb.js` übernommen (dort für
// Beobachter-Einladungen mit Lesezugriff): Token erzeugen, Mail verschicken,
// „annehmen" bindet AUSSCHLIESSLICH an die aktuelle Anmeldung, nie an einen
// mitgeschickten Wert - siehe inviteAnnehmenAktion weiter unten.

// 14 Tage - dieselbe Frist wie bei ma_beobachter: eine ERST-Einladung, kein
// Konto-Wiederzugang.
var INVITE_ABLAUF_MS = 14 * 24 * 60 * 60 * 1000;

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function appUrl(app) {
  try {
    return app.settings().meta.appURL || "";
  } catch (_) {
    return "";
  }
}

/** Wer fragt? Liefert die tt_teachers-id oder null. */
function angemeldeteLehrkraft(e) {
  var auth = e.auth;
  var coll = "";
  try {
    coll = auth ? auth.collection().name : "";
  } catch (_) {
    coll = "";
  }
  if (!auth || coll !== "tt_teachers") return null;
  return auth.id;
}

/**
 * Der Text der Einladungsmail - REINE Funktion, deutsch UND englisch
 * nebeneinander (EN9, 19.09.2026; `tests/tastenflow-englisch-mails.test.ts`).
 *
 * ★ WELCHE SPRACHE? Die eingeladene Person hat (noch) kein Konto - ihre
 * Sprache kennt niemand. Genommen wird die der EINLADENDEN Lehrkraft
 * (`bedienSprache` an ihrem Konto): Wer Tastenflow auf Englisch bedient und
 * eine Kollegin einlädt, arbeitet mit ihr aller Wahrscheinlichkeit auf
 * Englisch.
 *
 * `d`: { link, klasseName, einladerName }. Deutsch wörtlich wie vor EN9.
 */
function einladungMailInhalt(d, sprache) {
  if (sprache === "en") {
    // Glossar §3.9: *Invitation to co-teach*, *co-teach*; §3.8: *learners*.
    var werEn = d.einladerName ? esc(d.einladerName) : "A colleague";
    return {
      vonName: "Sensorik - learning apps",
      subject: "Invitation to co-teach class " + d.klasseName,
      html:
        '<div lang="en">' +
        "<p>Hello,</p>" +
        "<p>" + werEn + " is inviting you to co-teach the class <strong>" + esc(d.klasseName) +
        "</strong> on the Sensorik learning platform - with the same rights as the class " +
        "teacher: adding and managing learners, seeing their progress and resetting passwords.</p>" +
        '<p><a href="' + esc(d.link) + '">View the invitation</a></p>' +
        "<p>If you don't have a teacher account on the platform yet, you can create one " +
        "via the same link - the invitation is then accepted straight away.</p>" +
        '<p style="color:#666;font-size:12px">The link is valid for 14 days. This email ' +
        "was sent automatically because a teacher added you to this class. If that " +
        "wasn't intended, you can ignore it.</p>" +
        "</div>",
    };
  }
  if (sprache === "fr") {
    // ★ E11c (26.09.2026): vous, Doppelform statt Point médian (F10).
    var werFr = d.einladerName ? esc(d.einladerName) : "Un ou une collègue";
    return {
      vonName: "Sensorik - applications d'apprentissage",
      subject: "Invitation à co-enseigner la classe " + d.klasseName,
      html:
        '<div lang="fr">' +
        "<p>Bonjour,</p>" +
        "<p>" + werFr + " vous invite à co-enseigner la classe <strong>" + esc(d.klasseName) +
        "</strong> sur la plateforme d'apprentissage Sensorik - avec les mêmes droits que " +
        "l'enseignant ou l'enseignante de la classe : ajouter et gérer les élèves, voir leurs " +
        "progrès et réinitialiser les mots de passe.</p>" +
        '<p><a href="' + esc(d.link) + '">Voir l\'invitation</a></p>' +
        "<p>Si vous n'avez pas encore de compte enseignant sur la plateforme, vous pouvez en " +
        "créer un avec le même lien - l'invitation est alors acceptée tout de suite.</p>" +
        '<p style="color:#666;font-size:12px">Le lien est valable 14 jours. Cet e-mail a été ' +
        "envoyé automatiquement parce qu'une personne enseignante a inscrit votre adresse pour " +
        "cette classe. Si ce n'était pas voulu, vous pouvez l'ignorer.</p>" +
        "</div>",
    };
  }
  if (sprache === "es") {
    // ★ ES-M (27.09.2026): usted, ohne Geschlecht (*persona docente*, S10).
    // „gestionar también" - dieselben Rechte wie die Lehrkraft der Klasse.
    var werEs = d.einladerName ? esc(d.einladerName) : "Una persona docente";
    return {
      vonName: "Sensorik - programas de aprendizaje",
      subject: "Invitación: gestionar también la clase " + d.klasseName,
      html:
        '<div lang="es">' +
        "<p>Hola:</p>" +
        "<p>" + werEs + " le invita a gestionar también la clase <strong>" + esc(d.klasseName) +
        "</strong> en la plataforma de aprendizaje Sensorik - con los mismos derechos que la " +
        "persona docente de la clase: añadir y gestionar estudiantes, ver su progreso y " +
        "restablecer contraseñas.</p>" +
        '<p><a href="' + esc(d.link) + '">Ver la invitación</a></p>' +
        "<p>Si todavía no tiene una cuenta de docente en la plataforma, puede crearla con el " +
        "mismo enlace - y la invitación queda aceptada en ese momento.</p>" +
        '<p style="color:#666;font-size:12px">El enlace es válido durante 14 días. Este correo ' +
        "se envió automáticamente porque una persona docente indicó su dirección para esta " +
        "clase. Si no era lo previsto, puede ignorarlo.</p>" +
        "</div>",
    };
  }
  if (sprache === "it") {
    // ★ O-IT (02.10.2026): neutral ohne „Lei" (Glossar Regel 1), „co-insegnante",
    // „gestire la classe insieme" (§2.5); ohne Namen „Una persona che insegna".
    var werIt = d.einladerName ? esc(d.einladerName) : "Una persona che insegna";
    return {
      vonName: "Sensorik - programmi di apprendimento",
      subject: "Invito: gestire insieme la classe " + d.klasseName,
      html:
        '<div lang="it">' +
        "<p>Buongiorno,</p>" +
        "<p>" + werIt + " invita a gestire insieme la classe <strong>" + esc(d.klasseName) +
        "</strong> sulla piattaforma di apprendimento Sensorik - con gli stessi diritti di chi " +
        "insegna nella classe: aggiungere e gestire gli alunni, vedere i loro progressi e " +
        "reimpostare le password.</p>" +
        '<p><a href="' + esc(d.link) + '">Vedi l\'invito</a></p>' +
        "<p>Chi non ha ancora un account da insegnante sulla piattaforma può crearlo con lo " +
        "stesso link - e l'invito risulta subito accettato.</p>" +
        '<p style="color:#666;font-size:12px">Il link vale 14 giorni. Questa email è stata ' +
        "inviata automaticamente perché una persona che insegna ha indicato questo indirizzo " +
        "per la classe. Se non era previsto, la si può ignorare.</p>" +
        "</div>",
    };
  }
  if (sprache === "pl") {
    // ★ O-PL (02.10.2026): ty mit Höflichkeits-Grossschreibung (Glossar Regel 1),
    // „druga osoba prowadząca", „wspólnie prowadzić klasę" (§2.5). Der Name als
    // Subjekt im Präsens (Regel 11); ohne Namen „Osoba prowadząca klasę" - ohne
    // Geschlecht (Regel 2). Kein „kliknij" (Falle 7).
    var werPl = d.einladerName ? esc(d.einladerName) : "Osoba prowadząca klasę";
    return {
      vonName: "Sensorik - programy do nauki",
      subject: "Zaproszenie: wspólnie prowadzić klasę " + d.klasseName,
      html:
        '<div lang="pl">' +
        "<p>Dzień dobry,</p>" +
        "<p>" + werPl + " zaprasza Cię, by wspólnie prowadzić klasę <strong>" + esc(d.klasseName) +
        "</strong> na platformie edukacyjnej Sensorik - jako druga osoba prowadząca, z tymi " +
        "samymi uprawnieniami: dodawanie uczniów i zarządzanie ich kontami, wgląd w postępy " +
        "i ustawianie nowych haseł.</p>" +
        '<p><a href="' + esc(d.link) + '">Otwórz zaproszenie</a></p>' +
        "<p>Jeśli nie masz jeszcze konta dla nauczycieli na platformie, możesz je założyć przez " +
        "ten sam link - zaproszenie zostanie wtedy od razu przyjęte.</p>" +
        '<p style="color:#666;font-size:12px">Link jest ważny 14 dni. Ta wiadomość została ' +
        "wysłana automatycznie, bo osoba prowadząca klasę podała ten adres e-mail. Jeśli " +
        "wiadomość nie jest przeznaczona dla Ciebie, możesz ją zignorować.</p>" +
        "</div>",
    };
  }
  if (sprache === "tr") {
    // ★ O-TR (02.10.2026): siz mit -(y)In (Glossar Regel 1), „ortak öğretmen",
    // „sınıfı birlikte yönet" (§2.5). Der Name als Subjekt ohne Endung, ohne
    // Namen „Bir öğretmen" (§2.11); die Klasse nach Doppelpunkt, nie mit
    // Endung (Regel 6). Kein „tıklayın" (Regel 8).
    var werTr = d.einladerName ? esc(d.einladerName) : "Bir öğretmen";
    return {
      vonName: "Sensorik - öğrenme programları",
      subject: "Ortak öğretmen daveti - Sınıf: " + d.klasseName,
      html:
        '<div lang="tr">' +
        "<p>Merhaba,</p>" +
        "<p>" + werTr + " sizi, Sensorik öğrenme platformundaki bir sınıfı ortak öğretmen olarak " +
        "birlikte yönetmeye davet ediyor. Sınıf: <strong>" + esc(d.klasseName) + "</strong></p>" +
        "<p>Sınıfın öğretmeniyle aynı yetkilere sahip olursunuz: öğrenci ekleme ve hesaplarını " +
        "yönetme, ilerlemeyi görme ve şifreleri sıfırlama.</p>" +
        '<p><a href="' + esc(d.link) + '">Daveti aç</a></p>' +
        "<p>Platformda henüz öğretmen hesabınız yoksa aynı bağlantıyla bir hesap oluşturabilirsiniz - " +
        "davet o zaman hemen kabul edilir.</p>" +
        '<p style="color:#666;font-size:12px">Bağlantı 14 gün geçerlidir. Bu e-posta, bir öğretmen ' +
        "bu e-posta adresini sınıfa eklediği için otomatik olarak gönderildi. Bu bir yanlışlıksa " +
        "e-postayı dikkate almayabilirsiniz.</p>" +
        "</div>",
    };
  }
  // ★ O4 (30.10.2026): die neun - Aufbau in tt_mail_neun_lib.pb.js.
  if (["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"].indexOf(String(sprache || "")) >= 0) return require(`${__hooks}/tt_mail_neun_lib.pb.js`).einladung(d, sprache);
  if (sprache === "cs") {
    // ★ O-CS (03.10.2026): vy in der Mehrzahlform (Glossar Regel 1), „další
    // vyučující", „spravovat společně" (§2.5). Der Name als Subjekt im Präsens
    // (Regel 12: „Honza vás zve"), ohne Namen „Vyučující třídy" - beides
    // Nominativ, ohne Geschlecht (Regel 2). Die Klasse mit Kopfwort („třídu
    // 5A"), kein „klikněte" (Regel 8).
    var werCs = d.einladerName ? esc(d.einladerName) : "Vyučující třídy";
    return {
      vonName: "Sensorik - výukové programy",
      subject: "Pozvánka: spravovat společně třídu " + d.klasseName,
      html:
        '<div lang="cs">' +
        "<p>Dobrý den,</p>" +
        "<p>" + werCs + " vás zve ke společné správě třídy <strong>" + esc(d.klasseName) +
        "</strong> na výukové platformě Sensorik - jako další vyučující se stejnými právy: " +
        "přidávat žáky a spravovat jejich účty, sledovat pokrok a nastavovat nová hesla.</p>" +
        '<p><a href="' + esc(d.link) + '">Otevřít pozvánku</a></p>' +
        "<p>Pokud na platformě ještě nemáte účet pro vyučující, můžete si ho vytvořit přes " +
        "stejný odkaz - pozvánka se tím hned přijme.</p>" +
        '<p style="color:#666;font-size:12px">Odkaz platí 14 dní. Tento e-mail byl odeslán ' +
        "automaticky, protože tato e-mailová adresa byla přidána ke třídě. Pokud tento e-mail " +
        "není určen vám, můžete ho ignorovat.</p>" +
        "</div>",
    };
  }
  var vonWem = d.einladerName ? esc(d.einladerName) : "Eine Kollegin oder ein Kollege";
  return {
    vonName: "Sensorik — Lernprogramme",
    subject: "Einladung: Klasse " + d.klasseName + " mitverwalten",
    html:
      "<p>Hallo,</p>" +
      "<p>" + vonWem + " lädt dich ein, die Klasse <strong>" + esc(d.klasseName) + "</strong> " +
      "auf der Sensorik-Lernplattform mitzuverwalten - mit denselben Rechten " +
      "wie die Klassenlehrkraft: Lernende anlegen und verwalten, Fortschritt " +
      "einsehen, Passwörter zurücksetzen.</p>" +
      '<p><a href="' + esc(d.link) + '">Einladung ansehen</a></p>' +
      "<p>Hast du noch kein Lehrkraft-Konto auf der Plattform, kannst du dir " +
      "über denselben Link eines anlegen - danach ist die Einladung sofort " +
      "eingelöst.</p>" +
      '<p style="color:#666;font-size:12px">Der Link gilt 14 Tage. Diese Mail ' +
      "wurde automatisch verschickt, weil eine Lehrkraft dich für diese Klasse " +
      "eingetragen hat. War das nicht beabsichtigt, kannst du sie ignorieren.</p>",
  };
}

/**
 * Verschickt die Einladungsmail. Best effort - schlägt der Versand fehl
 * (SMTP weg, Adresse abgewiesen), bleibt die Einladung trotzdem gültig; die
 * Lehrkraft kann jederzeit erneut einladen (das erzeugt einen frischen Link).
 * `sprache` (EN9): die der einladenden Lehrkraft, siehe {@link einladungMailInhalt}.
 */
function inviteMailVerschicken(app, email, klasseName, einladerName, token, sprache, einlader) {
  try {
    // ★ 16.11.2026: Die Einladung zeigt auf die Adresse der EINLADENDEN
    // (tastenflow.org / lexami.org) - dort arbeitet die Klasse.
    var url = require(`${__hooks}/tt_heimat_lib.pb.js`).basisFuer(einlader || null, appUrl(app));
    var link = url
      ? url + "/lernwerkstatt-einladung?token=" + encodeURIComponent(token)
      : "";
    if (!link) {
      app.logger().warn("[tt-coteacher] keine appURL gesetzt - Mail übersprungen");
      return;
    }
    var urteil = require(`${__hooks}/mail_bremse_lib.pb.js`).darfRaus(app, "gesamt");
    if (!urteil.erlaubt) {
      app.logger().warn("[tt-coteacher] Mail-Bremse", "grund", urteil.grund);
      return;
    }
    var mail = einladungMailInhalt(
      { link: link, klasseName: klasseName, einladerName: einladerName },
      sprache,
    );
    var message = new MailerMessage({
      from: { address: app.settings().meta.senderAddress, name: mail.vonName },
      to: [{ address: String(email) }],
      subject: mail.subject,
      html: mail.html,
    });
    app.newMailClient().send(message);
    app.logger().info("[tt-coteacher] Einladung gesendet", "email", String(email));
  } catch (err) {
    app.logger().warn("[tt-coteacher] Mailversand fehlgeschlagen", "error", String(err));
  }
}

/**
 * Kein tt_teachers-Konto mit dieser E-Mail gefunden: statt eines Fehlers eine
 * Einladung anlegen (oder eine offene Zeile wiederverwenden - Unique-Index
 * classCode+email verbietet eine zweite) und eine kollegiale Einladungsmail
 * verschicken. `e.auth`/`classCode`/`cls` kommen vom Aufrufer (coteacherHandler
 * hat Auth- und Berechtigungsprüfung bereits erledigt).
 */
function inviteAction(e, classCode, cls, email) {
  var meId = e.auth.id;
  var einladerName = "";
  // ★ EN9: die Sprache der Einladenden (`bedienSprache` an ihrem Konto).
  var sprache = "de";
  try {
    einladerName = e.auth.getString("name") || "";
  } catch (_) {
    einladerName = "";
  }
  // ★ E11c: ebenso "fr". ★ ES-M (27.09.2026): die Sprache kommt aus DER einen
  // Stelle, die alle Mail-Hooks fragen (`spracheVon`, `MAIL_SPRACHEN` in
  // tt_mail_texte_lib.pb.js) - vorher stand hier eine eigene Liste „en/fr".
  try {
    sprache = require(`${__hooks}/tt_mail_texte_lib.pb.js`).spracheVon(e.auth);
  } catch (_) {
    sprache = "de";
  }
  var klasseName = cls.getString("name") || classCode;

  var bestehend = null;
  try {
    bestehend = e.app.findFirstRecordByFilter(
      "tt_class_teacher_invites",
      "classCode = {:c} && email = {:e}",
      { c: classCode, e: email },
    );
  } catch (_) {
    bestehend = null;
  }
  var token = $security.randomString(32);
  var jetzt = Date.now();
  try {
    var rec;
    if (bestehend) {
      rec = bestehend;
    } else {
      rec = new Record(e.app.findCollectionByNameOrId("tt_class_teacher_invites"));
      rec.set("classCode", classCode);
      rec.set("email", email);
    }
    rec.set("ownerUid", meId);
    rec.set("teacherUid", "");
    rec.set("token", token);
    rec.set("aktiv", true);
    rec.set("eingeladenAtMs", jetzt);
    rec.set("eingeloestAtMs", 0);
    e.app.save(rec);
  } catch (err) {
    e.app
      .logger()
      .error("[tt_coteacher] Einladen fehlgeschlagen", "error", String(err));
    return e.json(500, { error: "Einladung konnte nicht angelegt werden." });
  }

  inviteMailVerschicken(e.app, email, klasseName, einladerName, token, sprache, e.auth);
  return e.json(200, {
    invited: true,
    email: email,
    teachers: listTeachers(e.app, classCode, cls.getString("teacherUid")),
  });
}

/** Vorschau OHNE Anmeldung - für den Landeplatz `/lernwerkstatt-einladung`. */
function inviteVorschauAktion(e) {
  var body = {};
  try {
    body = e.requestInfo().body || {};
  } catch (_) {
    body = {};
  }
  var token = String(body.token || "").trim();
  if (!token) return e.json(400, { error: "Kein Einladungscode übermittelt." });

  var rec = null;
  try {
    rec = e.app.findFirstRecordByFilter("tt_class_teacher_invites", "token = {:t}", { t: token });
  } catch (_) {
    rec = null;
  }
  if (!rec) return e.json(404, { error: "Diese Einladung gibt es nicht." });
  if (!rec.getBool("aktiv")) return e.json(410, { error: "Diese Einladung wurde zurückgezogen." });
  var alter = Date.now() - rec.getFloat("eingeladenAtMs");
  if (rec.getFloat("eingeloestAtMs") === 0 && alter > INVITE_ABLAUF_MS) {
    return e.json(410, { error: "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern." });
  }

  var klasseName = rec.getString("classCode");
  try {
    var klasse = e.app.findFirstRecordByFilter("tt_classes", "code = {:c}", { c: rec.getString("classCode") });
    if (klasse) klasseName = klasse.getString("name") || klasseName;
  } catch (_) {
    /* Name bleibt der Code, falls die Klasse inzwischen weg wäre */
  }

  return e.json(200, {
    klasseName: klasseName,
    email: rec.getString("email"),
    eingeloest: rec.getFloat("eingeloestAtMs") > 0,
  });
}

/** Einladung einlösen - braucht eine angemeldete tt_teachers-Session. */
function inviteAnnehmenAktion(e) {
  var meId = angemeldeteLehrkraft(e);
  if (!meId) return e.json(401, { error: "Bitte zuerst anmelden oder ein Konto anlegen." });

  var body = {};
  try {
    body = e.requestInfo().body || {};
  } catch (_) {
    body = {};
  }
  var token = String(body.token || "").trim();
  if (!token) return e.json(400, { error: "Kein Einladungscode übermittelt." });

  var rec = null;
  try {
    rec = e.app.findFirstRecordByFilter("tt_class_teacher_invites", "token = {:t}", { t: token });
  } catch (_) {
    rec = null;
  }
  if (!rec) return e.json(404, { error: "Diese Einladung gibt es nicht." });
  if (!rec.getBool("aktiv")) return e.json(410, { error: "Diese Einladung wurde zurückgezogen." });

  var schonEingeloest = rec.getFloat("eingeloestAtMs") > 0;
  if (schonEingeloest && rec.getString("teacherUid") !== meId) {
    return e.json(409, { error: "Diese Einladung wurde bereits von einem anderen Konto eingelöst." });
  }
  if (!schonEingeloest) {
    var alter = Date.now() - rec.getFloat("eingeladenAtMs");
    if (alter > INVITE_ABLAUF_MS) {
      return e.json(410, { error: "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern." });
    }
  }

  var classCode = rec.getString("classCode");
  var cls = null;
  try {
    cls = e.app.findFirstRecordByFilter("tt_classes", "code = {:c}", { c: classCode });
  } catch (_) {
    cls = null;
  }
  if (!cls) return e.json(404, { error: "Diese Klasse gibt es nicht mehr." });
  var ownerId = cls.getString("teacherUid");

  if (!schonEingeloest) {
    try {
      // ★★★★★ DIE WICHTIGSTE ZEILE (wie ma_beobachter_lib.pb.js): `teacherUid`
      // kommt AUSSCHLIESSLICH aus der Anmeldung (`meId`), nie aus dem Aufruf -
      // sonst könnte jede angemeldete Lehrkraft mit einem erratenen Token eine
      // FREMDE Einladung an sich binden.
      rec.set("teacherUid", meId);
      rec.set("eingeloestAtMs", Date.now());
      e.app.save(rec);
    } catch (err) {
      e.app
        .logger()
        .error("[tt_coteacher] Einladung annehmen fehlgeschlagen", "error", String(err));
      return e.json(500, { error: "Das hat gerade nicht geklappt." });
    }

    // Volle Co-Lehrkraft-Rechte gewähren - derselbe Weg wie beim direkten
    // Hinzufügen (add), nur ohne Berechtigungsprüfung (die eingeladene Person
    // verwaltet die Klasse ja noch nicht). Ist sie zufällig schon Eigentümer:in
    // (eigene Einladung mit der eigenen E-Mail), bleibt hier nichts zu tun.
    if (meId !== ownerId) {
      var bestehendeMitgliedschaft = null;
      try {
        bestehendeMitgliedschaft = e.app.findFirstRecordByFilter(
          "tt_class_teachers",
          "classCode = {:c} && teacherUid = {:t}",
          { c: classCode, t: meId },
        );
      } catch (_) {
        bestehendeMitgliedschaft = null;
      }
      if (!bestehendeMitgliedschaft) {
        try {
          var coll = e.app.findCollectionByNameOrId("tt_class_teachers");
          var neu = new Record(coll);
          neu.set("classCode", classCode);
          neu.set("teacherUid", meId);
          neu.set("createdAtMs", Date.now());
          e.app.save(neu);
        } catch (err) {
          e.app
            .logger()
            .error("[tt_coteacher] Mitgliedschaft anlegen fehlgeschlagen", "error", String(err));
          return e.json(500, { error: "Das hat gerade nicht geklappt." });
        }
      }
      backfillClassCode(e.app, classCode);
    }
  }

  var klasseName = cls.getString("name") || classCode;
  return e.json(200, { ok: true, classCode: classCode, klasseName: klasseName });
}

/** Haupt-Dispatcher: list | add | remove. Bekommt das RequestEvent + Aktion. */
function coteacherHandler(e, action) {
  // --- Auth-Gate: nur Lehrkräfte ---------------------------------------------
  const auth = e.auth;
  let authCollName = "";
  try {
    authCollName = auth ? auth.collection().name : "";
  } catch (_) {
    authCollName = "";
  }
  if (!auth || authCollName !== "tt_teachers") {
    return e.json(401, { error: "Bitte als Lehrkraft anmelden." });
  }
  const meId = auth.id;

  // --- Body ------------------------------------------------------------------
  let body = {};
  try {
    body = e.requestInfo().body || {};
  } catch (_) {
    body = {};
  }
  const classCode = String(body.classCode || "").trim().toUpperCase();
  if (!classCode) return e.json(400, { error: "Kein Klassencode übermittelt." });

  // --- Klasse + Berechtigung -------------------------------------------------
  let cls = null;
  try {
    cls = e.app.findFirstRecordByFilter("tt_classes", "code = {:c}", {
      c: classCode,
    });
  } catch (_) {
    cls = null;
  }
  if (!cls) return e.json(404, { error: "Diese Klasse gibt es nicht." });
  const ownerId = cls.getString("teacherUid");

  if (!mayManage(e.app, classCode, ownerId, meId)) {
    return e.json(403, {
      error: "Diese Klasse gehört einer anderen Lehrkraft.",
    });
  }

  // --- Aktion ----------------------------------------------------------------
  if (action === "add") {
    const email = String(body.email || "").trim().toLowerCase();
    if (!email || email.indexOf("@") < 0)
      return e.json(400, { error: "Bitte eine gültige E-Mail angeben." });
    let teacher = null;
    try {
      teacher = e.app.findFirstRecordByFilter("tt_teachers", "email = {:m}", {
        m: email,
      });
    } catch (_) {
      teacher = null;
    }
    if (!teacher) return inviteAction(e, classCode, cls, email);
    if (teacher.id === ownerId)
      return e.json(400, {
        error: "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.",
      });
    // Schon eingetragen? Dann idempotent.
    let existing = null;
    try {
      existing = e.app.findFirstRecordByFilter(
        "tt_class_teachers",
        "classCode = {:c} && teacherUid = {:t}",
        { c: classCode, t: teacher.id },
      );
    } catch (_) {
      existing = null;
    }
    if (!existing) {
      try {
        const coll = e.app.findCollectionByNameOrId("tt_class_teachers");
        const rec = new Record(coll);
        rec.set("classCode", classCode);
        rec.set("teacherUid", teacher.id);
        rec.set("createdAtMs", Date.now());
        e.app.save(rec);
      } catch (err) {
        e.app
          .logger()
          .error("[tt_coteacher] add fehlgeschlagen", "error", String(err));
        return e.json(500, {
          error: "Lehrkraft konnte nicht hinzugefügt werden.",
        });
      }
    }
    // classCode auf vorhandene Fortschritts-/Telemetrie-Zeilen nachtragen, damit
    // die neue Co-Lehrkraft auch ältere Stände sehen darf (Regel ttCoTeacher).
    backfillClassCode(e.app, classCode);
  } else if (action === "remove") {
    const teacherId = String(body.teacherId || "").trim();
    if (!teacherId) return e.json(400, { error: "Keine Lehrkraft angegeben." });
    if (teacherId === ownerId)
      return e.json(400, {
        error:
          "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.",
      });
    try {
      const row = e.app.findFirstRecordByFilter(
        "tt_class_teachers",
        "classCode = {:c} && teacherUid = {:t}",
        { c: classCode, t: teacherId },
      );
      if (row) e.app.delete(row);
    } catch (_) {
      /* nicht vorhanden → nichts zu tun */
    }
  }

  // --- Aktuelle Lehrkraft-Liste zurückgeben ----------------------------------
  return e.json(200, { teachers: listTeachers(e.app, classCode, ownerId) });
}

/** Darf `teacherId` die Co-Lehrkräfte der Klasse verwalten? Eigentümer:in oder Co. */
function mayManage(app, classCode, ownerId, teacherId) {
  if (teacherId === ownerId) return true;
  try {
    const row = app.findFirstRecordByFilter(
      "tt_class_teachers",
      "classCode = {:c} && teacherUid = {:t}",
      { c: classCode, t: teacherId },
    );
    return !!row;
  } catch (_) {
    return false;
  }
}

/** Lehrkraft-Infos (id, name, email, owner) — server-seitig aufgelöst. */
function teacherInfo(app, id, ownerId) {
  try {
    const t = app.findRecordById("tt_teachers", id);
    return {
      id: t.id,
      name: t.getString("name"),
      email: t.getString("email"),
      owner: t.id === ownerId,
    };
  } catch (_) {
    return null;
  }
}

/** Eigentümer:in + alle Co-Lehrkräfte einer Klasse. */
function listTeachers(app, classCode, ownerId) {
  const out = [];
  const owner = teacherInfo(app, ownerId, ownerId);
  if (owner) out.push(owner);
  let rows = [];
  try {
    rows = app.findRecordsByFilter(
      "tt_class_teachers",
      "classCode = {:c}",
      "createdAtMs",
      0,
      0,
      { c: classCode },
    );
  } catch (_) {
    rows = [];
  }
  for (let i = 0; i < rows.length; i++) {
    const info = teacherInfo(app, rows[i].getString("teacherUid"), ownerId);
    if (info) out.push(info);
  }
  return out;
}

/** `classCode` auf Fortschritts-/Telemetrie-Zeilen aller Kinder der Klasse setzen. */
function backfillClassCode(app, classCode) {
  let pupils = [];
  try {
    pupils = app.findRecordsByFilter(
      "tt_pupils",
      "classCode = {:c}",
      "",
      0,
      0,
      { c: classCode },
    );
  } catch (_) {
    pupils = [];
  }
  // Alte Tabellen: genau eine Zeile je Kind (unique pupilUid).
  const colls = ["tt_progress", "tt_events"];
  for (let i = 0; i < pupils.length; i++) {
    for (let j = 0; j < colls.length; j++) {
      try {
        const row = app.findFirstRecordByFilter(
          colls[j],
          "pupilUid = {:p}",
          { p: pupils[i].id },
        );
        if (row && row.getString("classCode") !== classCode) {
          row.set("classCode", classCode);
          app.save(row);
        }
      } catch (_) {
        /* keine Zeile → nichts zu tun */
      }
    }
    // Umbau Etappe 4d (2026-06-26): dieselbe Nachtragung auf der kanonischen
    // Lernwerkstatt-Quelle lw_*. Dort gibt es bis zu EINER Zeile je (pupilUid,
    // program) → alle Zeilen des Kindes holen und je classCode setzen. Memory:
    // project_lernwerkstatt_datenmodell.
    const lwColls = ["lw_progress", "lw_events"];
    for (let j = 0; j < lwColls.length; j++) {
      let lwRows = [];
      try {
        lwRows = app.findRecordsByFilter(
          lwColls[j],
          "pupilUid = {:p}",
          "",
          0,
          0,
          { p: pupils[i].id },
        );
      } catch (_) {
        lwRows = [];
      }
      for (let k = 0; k < lwRows.length; k++) {
        try {
          if (lwRows[k].getString("classCode") !== classCode) {
            lwRows[k].set("classCode", classCode);
            app.save(lwRows[k]);
          }
        } catch (_) {
          /* einzelne Zeile nicht speicherbar → überspringen */
        }
      }
    }
  }
}

// --- Export (nur im require()-Kontext; beim Auto-Laden als Hook kein `module`) -
if (typeof module !== "undefined") {
  module.exports = {
    coteacherHandler: coteacherHandler,
    inviteVorschauAktion: inviteVorschauAktion,
    inviteAnnehmenAktion: inviteAnnehmenAktion,
    einladungMailInhalt: einladungMailInhalt,
  };
}
