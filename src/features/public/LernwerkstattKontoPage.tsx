/**
 * „Meine Zugangsdaten" — der Kontobereich für SELBSTLERNENDE (09.08.2026).
 *
 * Wunsch Johannes: „Die Mailadresse muss auch nachträglich geändert werden
 * können, unter Einstellungen?" — Ja: Der Weg dorthin führt aus dem Zahnrad
 * jeder App (Tastenflow: Gruppe „Mein Konto"), die Seite selbst liegt hier,
 * damit alle vier Programme dieselbe benutzen.
 *
 * Vier Dinge, und alle vier nur für Konten OHNE Klasse:
 *   1. **Adresse bestätigen** (falls noch offen) — neue Mail anfordern.
 *   2. **Adresse ändern** — der Link geht an die NEUE Adresse, bestätigt wird
 *      dort mit dem eigenen Passwort. Ohne Zugriff auf die neue Mailbox ändert
 *      sich nichts.
 *   3. **Passwort ändern** (altes Passwort nötig).
 *   4. **Konto löschen** — mit allen Spielständen, sofort und selbst. Ein Konto,
 *      das man nicht wieder loswird, ist keins.
 *
 * ── Warum ein Kind einer Klasse hier nichts findet ──────────────────────────
 * Dessen Zugang gehört zur Klasse: Name, Passwort und Klassencode verwaltet die
 * Lehrkraft, eine eigene Adresse gibt es nicht. Diese Seite sagt das offen,
 * statt leere Felder anzubieten.
 *
 * ── ★★ 08.09.2026: Die Seite hat jetzt eine Tür, also muss sie jede Ankunft
 *    beantworten ────────────────────────────────────────────────────────────
 * Seit heute steht „Konto" in der Kopfzeile der Lernwerkstatt-Überblicksseite -
 * abgemeldet wie angemeldet, für jede Rolle. Bis dahin kam man nur aus den
 * Einstellungen eines Programms her, und die zeigten den Weg NUR
 * Selbstlernenden. Zwei Ankünfte waren deshalb unbeantwortet:
 *
 *   • **Abgemeldet** stand hier „Melde dich in einem der Programme an" - ohne
 *     zu sagen, in welchen. Jetzt stehen die vier als Verweise da.
 *   • **Als Lehrkraft** fiel man in den Zweig für Kinder einer Klasse und las
 *     „Dein Zugang gehört zu deiner Klasse … sprich deine Lehrkraft an". Das
 *     war schon vorher falsch, fiel aber niemandem auf, weil niemand hierher
 *     kam. Lehrkräfte haben jetzt ihren eigenen Abschnitt - mit dem, was für
 *     sie wirklich gilt (Anrede „Sie", K21).
 *
 * ⚠️ Ein eigenes Formular für E-Mail und Passwort haben Lehrkräfte hier NICHT.
 * `passwortAendern`/`adresseAendern` laufen gegen `tt_pupils`; für `tt_teachers`
 * gibt es bisher nur den Weg über „Passwort vergessen"
 * (`/lernprogramm-passwort`). Diese Seite behauptet darum nichts anderes,
 * sondern nennt den Weg, den es wirklich gibt.
 */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PublicHeader } from "@/components/PublicHeader";
import { typingBackend } from "@/lib/typing/backend";
import { TypingAuth } from "@/components/typing/TypingAuth";
import { KontoErklaerung } from "@/components/lernwerkstatt/KontoErklaerung";
import { useProgrammeCatalog } from "@/lib/useProgrammeReleases";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { RechtlichesFusszeile } from "@/components/RechtlichesFusszeile";
import { LW_PROGRAMS } from "@/lib/lernwerkstatt/klassen";
import { ProgrammZeichen } from "@/components/lernwerkstatt/ProgrammZeichen";
import { meineKlasseHref, hausStartHref, mitHausName } from "@/lib/adressen";
import { ServerMeldung } from "@/components/typing/ServerMeldung";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★★ EN2 (19.09.2026): beide Sprachen nebeneinander. GEMEINSAME Seite (alle
 * vier Programme) - ohne (aktiven) Provider „de", wortgleich wie vorher.
 * Englisch nur, wenn man aus Tastenflow kommt (Zahnrad „My account" ⇒ „My
 * login details") und die Bedienung dort englisch ist. Glossar §3.9 (*My login details*,
 * *Change email address*, *Delete account*, *delete permanently*) und EN8
 * (*Weekly report by email* - so nennt ihn auch die Datenschutzerklärung).
 *
 * ★ Erfolgs-Sätze stehen als SCHLÜSSEL im Zustand und werden beim Anzeigen
 * gelesen; Fehler kommen deutsch (vom Server oder von hier) und laufen durch
 * `ServerMeldung`. So übersetzt ein Sprachwechsel auch eine stehende Meldung.
 */
const T = texte({
  de: {
    titel: "Meine Zugangsdaten",
    direktZu: "Oder gleich zu einem Programm:",
    lernprogramme: "Lernprogramme",
    lehrkraftAngemeldet: "Sie sind als Lehrkraft angemeldet:",
    lehrkraftKlassen:
      "Klassen, Kinder und den Stand in allen Lernprogrammen verwalten Sie im Bereich „Meine Klassen\".",
    lehrkraftPasswort:
      "Ein neues Passwort für Ihr Lehrkraft-Konto setzen Sie über „Passwort vergessen\": Wir schicken Ihnen einen Link an Ihre E-Mail-Adresse.",
    meineKlassen: "Meine Klassen",
    passwortAendern: "Passwort ändern",
    klassenkind:
      "Dein Zugang gehört zu deiner Klasse: Name, Passwort und Klassencode verwaltet deine Lehrkraft - sprich sie an, wenn sich etwas ändern soll. Eine eigene E-Mail-Adresse hat dieses Konto nicht.",
    emailBlock: "E-Mail-Adresse",
    aktuell: "Aktuell: ",
    bestaetigt: "· bestätigt",
    unbestaetigt: "· noch nicht bestätigt",
    keinBericht:
      "Solange die Adresse nicht bestätigt ist, schicken wir keinen Wochenbericht dorthin: Ein Tippfehler soll nicht wöchentlich bei jemand anderem landen. Üben kannst du ganz normal weiter.",
    nochmalSchicken: "Bestätigungs-Mail noch einmal schicken",
    neueAdresse: "Neue E-Mail-Adresse",
    neueAdresseHinweis:
      "Der Bestätigungs-Link geht an die neue Adresse. Wer sie nicht öffnen kann, ändert nichts.",
    adresseAendern: "Adresse ändern",
    postBlock: "Post von uns",
    bericht: "Wöchentlicher Übe-Bericht per E-Mail",
    berichtHinweis:
      "Montags früh, und nur in Wochen, in denen du geübt hast. Er nennt deine Minuten, Tage und Aufgaben - und nur die Programme, die du benutzt hast.",
    berichtUnbestaetigt:
      "Solange deine Adresse nicht bestätigt ist, kommt der Bericht trotzdem nicht - das Häkchen merkt sich aber deinen Wunsch.",
    warnung:
      "Die Warnung, bevor ein lange ungenutztes Konto gelöscht wird, lässt sich nicht abbestellen. Sonst wären deine Daten eines Tages ohne Vorwarnung weg.",
    passwortBlock: "Passwort",
    bisher: "Bisheriges Passwort",
    neu: "Neues Passwort (mindestens 8 Zeichen)",
    neuNochmal: "Neues Passwort wiederholen",
    loeschenBlock: "Konto löschen",
    loeschenSatz:
      "Damit sind dein Konto und alle Spielstände in allen vier Programmen weg, sofort und endgültig.",
    loeschenKnopf: "Konto löschen …",
    endgueltig: "Ja, endgültig löschen",
    abbrechen: "Abbrechen",
    abmelden: "Abmelden",
    zurLernwerkstatt: "Zur Lernwerkstatt",
    // --- Meldungen (Erfolg und Zwischenstand) ---
    mailGeschickt: "Wir haben dir eine Mail mit einem Bestätigungs-Link geschickt.",
    linkAnNeue:
      "Wir haben einen Link an die NEUE Adresse geschickt. Erst der Klick dort stellt das Konto um, bis dahin gilt die alte.",
    wirdGespeichert: "Wird gespeichert …",
    berichtAn: "Wochenbericht eingeschaltet. Du bekommst ihn montags.",
    berichtAus: "Wochenbericht abbestellt. Du bekommst keine Post mehr.",
    passwortGeaendert: "Dein Passwort ist geändert.",
    kontoGeloescht: "Dein Konto ist gelöscht.",
    // --- Fehler, die hier entstehen (deutsch gespeichert, s. oben) ---
    nichtGeklappt: "Das hat nicht geklappt.",
    nochEinmal: "Das hat nicht geklappt. Bitte versuch es noch einmal.",
    ungleich: "Die beiden neuen Passwörter stimmen nicht überein.",
  },
  en: {
    titel: "My login details",
    direktZu: "Or go straight to an app:",
    lernprogramme: "Learning apps",
    lehrkraftAngemeldet: "You're signed in as a teacher:",
    lehrkraftKlassen:
      "You manage classes, pupils and their progress in all the learning apps under “My classes”.",
    lehrkraftPasswort:
      "To set a new password for your teacher account, use “Forgotten your password?”: we'll send a link to your email address.",
    meineKlassen: "My classes",
    passwortAendern: "Change password",
    klassenkind:
      "Your login belongs to your class: your teacher looks after your name, password and class code - talk to them if something needs to change. This account doesn't have its own email address.",
    emailBlock: "Email address",
    aktuell: "Current: ",
    bestaetigt: "· confirmed",
    unbestaetigt: "· not confirmed yet",
    keinBericht:
      "Until the address is confirmed, we don't send a weekly report to it: a typo in the address shouldn't land in someone else's inbox every week. You can carry on practising as normal.",
    nochmalSchicken: "Send the confirmation email again",
    neueAdresse: "New email address",
    neueAdresseHinweis:
      "The confirmation link goes to the new address. Anyone who can't open it can't change anything.",
    adresseAendern: "Change email address",
    postBlock: "Emails from us",
    bericht: "Weekly report by email",
    berichtHinweis:
      "Early on Mondays, and only in weeks when you've practised. It lists your minutes, days and tasks - and only the apps you've used.",
    berichtUnbestaetigt:
      "Until your address is confirmed, the report still won't come - but the tick remembers what you'd like.",
    warnung:
      "You can't unsubscribe from the warning we send before deleting an account that hasn't been used for a long time. Otherwise your data could one day be gone without warning.",
    passwortBlock: "Password",
    bisher: "Current password",
    neu: "New password (at least 8 characters)",
    neuNochmal: "Repeat new password",
    loeschenBlock: "Delete account",
    loeschenSatz:
      "This removes your account and all your progress in all four apps - immediately and permanently.",
    loeschenKnopf: "Delete account …",
    endgueltig: "Yes, delete permanently",
    abbrechen: "Cancel",
    abmelden: "Sign out",
    zurLernwerkstatt: "Go to Lernwerkstatt",
    mailGeschickt: "We've sent you an email with a confirmation link.",
    linkAnNeue:
      "We've sent a link to the NEW address. The account only switches over once the link there is opened - until then, the old address still applies.",
    wirdGespeichert: "Saving …",
    berichtAn: "Weekly report switched on. You'll get it on Mondays.",
    berichtAus: "Weekly report switched off. You won't get any more emails.",
    passwortGeaendert: "Your password has been changed.",
    kontoGeloescht: "Your account has been deleted.",
    nichtGeklappt: "That didn't work.",
    nochEinmal: "That didn't work. Please try again.",
    ungleich: "The two new passwords don't match.",
  },
  // ★ E11a: gemischtes Register wie die deutsche Basis - Lehrkraft-Zeilen
  // „vous" (F9), Zeilen für Kinder/Selbstlernende „tu".
  fr: {
    titel: "Mes identifiants",
    direktZu: "Ou directement vers un programme :",
    lernprogramme: "Programmes d'apprentissage",
    lehrkraftAngemeldet: "Connexion en tant qu'enseignant ou enseignante :",
    lehrkraftKlassen:
      "Vous gérez les classes, les élèves et les progrès dans tous les programmes d'apprentissage sous \"Mes classes\".",
    lehrkraftPasswort:
      "Pour définir un nouveau mot de passe pour votre compte enseignant, utilisez \"Mot de passe oublié\" : nous vous enverrons un lien à votre adresse e-mail.",
    meineKlassen: "Mes classes",
    passwortAendern: "Changer le mot de passe",
    klassenkind:
      "Ton accès appartient à ta classe : ton enseignant ou ton enseignante gère ton nom, ton mot de passe et le code de classe - parle-lui si quelque chose doit changer. Ce compte n'a pas sa propre adresse e-mail.",
    emailBlock: "Adresse e-mail",
    aktuell: "Actuelle : ",
    bestaetigt: "- confirmée",
    unbestaetigt: "- pas encore confirmée",
    keinBericht:
      "Tant que l'adresse n'est pas confirmée, nous n'y envoyons pas de bilan hebdomadaire : une erreur de frappe ne doit pas atterrir chaque semaine chez quelqu'un d'autre. Tu peux continuer à t'exercer normalement.",
    nochmalSchicken: "Renvoyer l'e-mail de confirmation",
    neueAdresse: "Nouvelle adresse e-mail",
    neueAdresseHinweis:
      "Le lien de confirmation part à la nouvelle adresse. Sans y accéder, rien ne change.",
    adresseAendern: "Changer l'adresse e-mail",
    postBlock: "Nos e-mails",
    bericht: "Bilan hebdomadaire par e-mail",
    berichtHinweis:
      "Le lundi matin, et seulement après une semaine avec de l'entrainement. Il indique tes minutes, tes jours et tes activités - et seulement les programmes que tu as utilisés.",
    berichtUnbestaetigt:
      "Tant que ton adresse n'est pas confirmée, le bilan ne vient quand même pas - mais la case retient ton choix.",
    warnung:
      "L'avertissement envoyé avant la suppression d'un compte inactif depuis longtemps ne peut pas être désactivé. Sinon, tes données pourraient disparaitre un jour sans prévenir.",
    passwortBlock: "Mot de passe",
    bisher: "Mot de passe actuel",
    neu: "Nouveau mot de passe (8 caractères minimum)",
    neuNochmal: "Répéter le nouveau mot de passe",
    loeschenBlock: "Supprimer le compte",
    loeschenSatz:
      "Ton compte et tous tes progrès dans les quatre programmes disparaissent alors, immédiatement et définitivement.",
    loeschenKnopf: "Supprimer le compte …",
    endgueltig: "Oui, supprimer définitivement",
    abbrechen: "Annuler",
    abmelden: "Se déconnecter",
    zurLernwerkstatt: "Vers Lernwerkstatt",
    mailGeschickt: "Nous t'avons envoyé un e-mail avec un lien de confirmation.",
    linkAnNeue:
      "Nous avons envoyé un lien à la NOUVELLE adresse. Le compte ne bascule qu'une fois ce lien ouvert - jusque-là, l'ancienne adresse reste valable.",
    wirdGespeichert: "Enregistrement en cours …",
    berichtAn: "Bilan hebdomadaire activé. Tu le recevras le lundi.",
    berichtAus: "Bilan hebdomadaire désactivé. Tu ne recevras plus d'e-mails.",
    passwortGeaendert: "Ton mot de passe est modifié.",
    kontoGeloescht: "Ton compte est supprimé.",
    nichtGeklappt: "Cela n'a pas fonctionné.",
    nochEinmal: "Cela n'a pas fonctionné. Merci de réessayer.",
    ungleich: "Les deux nouveaux mots de passe ne correspondent pas.",
  },
  // ★ ES-O (27.09.2026): wie „fr" - die Lehrkraft-Zeilen usted, alles andere
  // richtet sich an die lernende Person (tú).
  es: {
    titel: "Mis datos de acceso",
    direktZu: "O directamente a un programa:",
    lernprogramme: "Programas de aprendizaje",
    lehrkraftAngemeldet: "Sesión iniciada como docente:",
    lehrkraftKlassen:
      "Las clases, el alumnado y el progreso en todos los programas de aprendizaje los gestiona en \"Mis clases\".",
    lehrkraftPasswort:
      "Para fijar una contraseña nueva para su cuenta de docente, use \"¿Ha olvidado la contraseña?\": le enviaremos un enlace a su correo electrónico.",
    meineKlassen: "Mis clases",
    passwortAendern: "Cambiar la contraseña",
    klassenkind:
      "Tu acceso pertenece a tu clase: tu docente gestiona tu nombre, tu contraseña y el código de clase - díselo si hay que cambiar algo. Esta cuenta no tiene correo electrónico propio.",
    emailBlock: "Correo electrónico",
    aktuell: "Actual: ",
    bestaetigt: "- confirmado",
    unbestaetigt: "- todavía sin confirmar",
    keinBericht:
      "Mientras la dirección no esté confirmada, no enviamos allí ningún resumen semanal: una errata no debe llegar cada semana a otra persona. Puedes seguir practicando con normalidad.",
    nochmalSchicken: "Volver a enviar el correo de confirmación",
    neueAdresse: "Nuevo correo electrónico",
    neueAdresseHinweis:
      "El enlace de confirmación va a la nueva dirección. Sin abrirlo, no cambia nada.",
    adresseAendern: "Cambiar el correo electrónico",
    postBlock: "Nuestros correos",
    bericht: "Resumen semanal por correo electrónico",
    berichtHinweis:
      "El lunes por la mañana, y solo después de una semana con práctica. Indica tus minutos, tus días y tus actividades - y solo los programas que has usado.",
    berichtUnbestaetigt:
      "Mientras tu dirección no esté confirmada, el resumen no llega de todos modos - pero la casilla guarda tu elección.",
    warnung:
      "El aviso que se envía antes de eliminar una cuenta inactiva desde hace mucho tiempo no se puede desactivar. Si no, tus datos podrían desaparecer un día sin avisar.",
    passwortBlock: "Contraseña",
    bisher: "Contraseña actual",
    neu: "Contraseña nueva (mínimo 8 caracteres)",
    neuNochmal: "Repetir la contraseña nueva",
    loeschenBlock: "Eliminar la cuenta",
    loeschenSatz:
      "Tu cuenta y todo tu progreso en los cuatro programas desaparecen entonces, al instante y para siempre.",
    loeschenKnopf: "Eliminar la cuenta …",
    endgueltig: "Sí, eliminar para siempre",
    abbrechen: "Cancelar",
    abmelden: "Cerrar sesión",
    zurLernwerkstatt: "Ir a Lernwerkstatt",
    mailGeschickt: "Te hemos enviado un correo con un enlace de confirmación.",
    linkAnNeue:
      "Hemos enviado un enlace a la NUEVA dirección. La cuenta solo cambia cuando se abre ese enlace - hasta entonces sigue valiendo la dirección anterior.",
    wirdGespeichert: "Guardando …",
    berichtAn: "Resumen semanal activado. Lo recibirás el lunes.",
    berichtAus: "Resumen semanal desactivado. Ya no recibirás correos.",
    passwortGeaendert: "Tu contraseña se ha cambiado.",
    kontoGeloescht: "Tu cuenta se ha eliminado.",
    nichtGeklappt: "No ha funcionado.",
    nochEinmal: "No ha funcionado. Vuelve a intentarlo, por favor.",
    ungleich: "Las dos contraseñas nuevas no coinciden.",
  },
  // ★ O-IT (02.10.2026): Lehrkraft-Sätze neutral, Kind „tu" (Glossar Regel 1).
  it: {
    titel: "I miei dati di accesso",
    direktZu: "Oppure direttamente a un programma:",
    lernprogramme: "Programmi di apprendimento",
    lehrkraftAngemeldet: "Accesso effettuato come insegnante:",
    lehrkraftKlassen:
      `Le classi, gli alunni e i progressi in tutti i programmi di apprendimento si gestiscono in "Le mie classi".`,
    lehrkraftPasswort:
      `Una nuova password per l'account da insegnante si imposta con "Password dimenticata?": arriva un link all'indirizzo email.`,
    meineKlassen: "Le mie classi",
    passwortAendern: "Cambia la password",
    klassenkind:
      "Il tuo accesso appartiene alla tua classe: nome, password e codice classe li gestisce l'insegnante - parlane con l'insegnante se qualcosa deve cambiare. Questo account non ha un indirizzo email proprio.",
    emailBlock: "Indirizzo email",
    aktuell: "Attuale: ",
    bestaetigt: "- confermato",
    unbestaetigt: "- non ancora confermato",
    keinBericht:
      "Finché l'indirizzo non è confermato, non inviamo lì nessun resoconto settimanale: un errore di battitura non deve finire ogni settimana da un'altra persona. Puoi continuare a esercitarti come sempre.",
    nochmalSchicken: "Invia di nuovo l'email di conferma",
    neueAdresse: "Nuovo indirizzo email",
    neueAdresseHinweis:
      "Il link di conferma va al nuovo indirizzo. Senza aprirlo non cambia nulla.",
    adresseAendern: "Cambia indirizzo",
    postBlock: "Le nostre email",
    bericht: "Resoconto settimanale degli esercizi via email",
    berichtHinweis:
      "Il lunedì mattina, e solo nelle settimane in cui hai fatto esercizio. Indica i tuoi minuti, i giorni e le attività - e solo i programmi che hai usato.",
    berichtUnbestaetigt:
      "Finché il tuo indirizzo non è confermato, il resoconto comunque non arriva - ma la casella si ricorda la tua scelta.",
    warnung:
      "L'avviso che arriva prima che un account inutilizzato da molto tempo venga eliminato non si può disattivare. Altrimenti un giorno i tuoi dati sparirebbero senza preavviso.",
    passwortBlock: "Password",
    bisher: "Password attuale",
    neu: "Nuova password (almeno 8 caratteri)",
    neuNochmal: "Ripeti la nuova password",
    loeschenBlock: "Elimina l'account",
    loeschenSatz:
      "Così il tuo account e tutti i progressi nei quattro programmi spariscono, subito e per sempre.",
    loeschenKnopf: "Elimina l'account...",
    endgueltig: "Sì, elimina per sempre",
    abbrechen: "Annulla",
    abmelden: "Esci",
    zurLernwerkstatt: "Vai alla Lernwerkstatt",
    mailGeschickt: "Ti abbiamo inviato un'email con un link di conferma.",
    linkAnNeue:
      "Abbiamo inviato un link al NUOVO indirizzo. L'account cambia solo quando si apre quel link - fino ad allora vale l'indirizzo precedente.",
    wirdGespeichert: "Salvataggio in corso...",
    berichtAn: "Resoconto settimanale attivato. Lo ricevi il lunedì.",
    berichtAus: "Resoconto settimanale disattivato. Non ricevi più email.",
    passwortGeaendert: "La tua password è stata cambiata.",
    kontoGeloescht: "Il tuo account è stato eliminato.",
    nichtGeklappt: "Non ha funzionato.",
    nochEinmal: "Non ha funzionato. Riprova.",
    ungleich: "Le due nuove password non coincidono.",
  },
  // ★ O-PL (02.10.2026): eigenes Konto „ty", Lehrkraft unpersönlich (Glossar
  // Regel 1); „podsumowanie tygodnia" (§2.6), „Moje dane logowania" (§2.11).
  pl: {
    titel: "Moje dane logowania",
    direktZu: "Albo od razu do programu:",
    lernprogramme: "Programy do nauki",
    lehrkraftAngemeldet: "Zalogowano kontem dla nauczycieli:",
    lehrkraftKlassen:
      "Klasami, uczniami i postępami we wszystkich programach do nauki zarządza się w sekcji „Moje klasy”.",
    lehrkraftPasswort:
      "Nowe hasło do konta dla nauczycieli ustawia się przez „Nie pamiętasz hasła?”: na adres e-mail przychodzi link.",
    meineKlassen: "Moje klasy",
    passwortAendern: "Zmień hasło",
    klassenkind:
      "Twój dostęp należy do twojej klasy: imieniem, hasłem i kodem klasy zarządzają nauczyciele - powiedz im, jeśli coś ma się zmienić. To konto nie ma własnego adresu e-mail.",
    emailBlock: "Adres e-mail",
    aktuell: "Obecnie: ",
    bestaetigt: "- potwierdzony",
    unbestaetigt: "- jeszcze niepotwierdzony",
    keinBericht:
      "Dopóki adres nie jest potwierdzony, nie wysyłamy na niego podsumowania tygodnia: literówka nie powinna co tydzień trafiać do kogoś innego. Możesz normalnie ćwiczyć dalej.",
    nochmalSchicken: "Wyślij ponownie e-mail z potwierdzeniem",
    neueAdresse: "Nowy adres e-mail",
    neueAdresseHinweis:
      "Link potwierdzający trafia na nowy adres. Dopóki nikt go nie otworzy, nic się nie zmienia.",
    adresseAendern: "Zmień adres",
    postBlock: "Wiadomości od nas",
    bericht: "Podsumowanie tygodnia e-mailem",
    berichtHinweis:
      "W poniedziałek rano i tylko za tygodnie z ćwiczeniami. Podaje twoje minuty, dni i zadania - i tylko programy, z których korzystasz.",
    berichtUnbestaetigt:
      "Dopóki twój adres nie jest potwierdzony, podsumowanie i tak nie przychodzi - ale pole wyboru zapamiętuje twoje życzenie.",
    warnung:
      "Ostrzeżenia przed usunięciem długo nieużywanego konta nie da się wyłączyć. Inaczej twoje dane mogłyby pewnego dnia zniknąć bez uprzedzenia.",
    passwortBlock: "Hasło",
    bisher: "Obecne hasło",
    neu: "Nowe hasło (co najmniej 8 znaków)",
    neuNochmal: "Powtórz nowe hasło",
    loeschenBlock: "Usuń konto",
    loeschenSatz:
      "Wtedy twoje konto i wszystkie postępy we wszystkich czterech programach znikną, od razu i na zawsze.",
    loeschenKnopf: "Usuń konto...",
    endgueltig: "Tak, usuń na zawsze",
    abbrechen: "Anuluj",
    abmelden: "Wyloguj się",
    zurLernwerkstatt: "Przejdź do Lernwerkstatt",
    mailGeschickt: "Wysłaliśmy ci e-mail z linkiem potwierdzającym.",
    linkAnNeue:
      "Wysłaliśmy link na NOWY adres. Konto zmieni się dopiero po otwarciu tego linku - do tego czasu obowiązuje stary adres.",
    wirdGespeichert: "Zapisywanie...",
    berichtAn: "Podsumowanie tygodnia włączone. Dostajesz je w poniedziałki.",
    berichtAus: "Podsumowanie tygodnia wyłączone. Nie dostajesz już od nas wiadomości.",
    passwortGeaendert: "Hasło zostało zmienione.",
    kontoGeloescht: "Konto zostało usunięte.",
    nichtGeklappt: "Nie udało się.",
    nochEinmal: "Nie udało się. Spróbuj jeszcze raz.",
    ungleich: "Nowe hasła nie są identyczne.",
  },
  // ★ O-TR (02.10.2026): eigenes Konto "sen", Lehrkraft "siz" mit -(y)In (Glossar
  // Regel 1); "Giriş bilgilerim" (§2.5 giriş bilgileri), "haftalık rapor" (§2.11).
  tr: {
    titel: "Giriş bilgilerim",
    direktZu: "Ya da doğrudan bir programa git:",
    lernprogramme: "Öğrenme programları",
    lehrkraftAngemeldet: "Öğretmen olarak giriş yaptınız:",
    lehrkraftKlassen:
      'Sınıfları, öğrencileri ve tüm öğrenme programlarındaki ilerlemeyi "Sınıflarım" bölümünde yönetirsiniz.',
    lehrkraftPasswort:
      'Öğretmen hesabınız için yeni şifreyi "Şifremi unuttum" ile belirlersiniz: E-posta adresinize bir bağlantı göndeririz.',
    meineKlassen: "Sınıflarım",
    passwortAendern: "Şifreyi değiştir",
    klassenkind:
      "Bu hesap sınıfına ait: Adını, şifreni ve sınıf kodunu öğretmenin yönetiyor - bir şeyin değişmesini istersen ona söyle. Bu hesabın kendi e-posta adresi yok.",
    emailBlock: "E-posta adresi",
    aktuell: "Şu anki adres: ",
    bestaetigt: "· onaylandı",
    unbestaetigt: "· henüz onaylanmadı",
    keinBericht:
      "Adres onaylanmadığı sürece oraya haftalık rapor göndermeyiz: Bir yazım hatası yüzünden rapor her hafta başka birine gitmesin. Çalışmaya her zamanki gibi devam edebilirsin.",
    nochmalSchicken: "Onay e-postasını tekrar gönder",
    neueAdresse: "Yeni e-posta adresi",
    neueAdresseHinweis:
      "Onay bağlantısı yeni adrese gider. O adresi açamayan kişi hiçbir şeyi değiştiremez.",
    adresseAendern: "Adresi değiştir",
    postBlock: "Bizden gelen e-postalar",
    bericht: "Haftalık raporu e-postayla gönder",
    berichtHinweis:
      "Pazartesi sabahı ve yalnızca çalıştığın haftalarda. Rapor dakikalarını, günlerini ve görevlerini gösterir - ve yalnızca kullandığın programları.",
    berichtUnbestaetigt:
      "Adresin onaylanmadığı sürece rapor yine de gelmez - ama seçimin kaydedilir.",
    warnung:
      "Uzun süre kullanılmayan bir hesap silinmeden önce gelen uyarı kapatılamaz. Yoksa bir gün verilerin haber verilmeden silinmiş olurdu.",
    passwortBlock: "Şifre",
    bisher: "Şu anki şifre",
    neu: "Yeni şifre (en az 8 karakter)",
    neuNochmal: "Yeni şifre (tekrar)",
    loeschenBlock: "Hesabı sil",
    loeschenSatz:
      "Böylece hesabın ve dört programdaki tüm ilerlemen hemen ve kalıcı olarak silinir.",
    loeschenKnopf: "Hesabı sil...",
    endgueltig: "Evet, kalıcı olarak sil",
    abbrechen: "İptal",
    abmelden: "Çıkış yap",
    zurLernwerkstatt: "Lernwerkstatt sayfasına git",
    mailGeschickt: "Sana onay bağlantısı içeren bir e-posta gönderdik.",
    linkAnNeue:
      "YENİ adrese bir bağlantı gönderdik. Hesap ancak oradaki bağlantı açılınca değişir - o zamana kadar eski adres geçerli.",
    wirdGespeichert: "Kaydediliyor...",
    berichtAn: "Haftalık rapor açık. Raporu her pazartesi alırsın.",
    berichtAus: "Haftalık rapor kapatıldı. Artık bizden e-posta almazsın.",
    passwortGeaendert: "Şifren değiştirildi.",
    kontoGeloescht: "Hesabın silindi.",
    nichtGeklappt: "Bu işlem tamamlanamadı.",
    nochEinmal: "Bu işlem tamamlanamadı. Tekrar dene.",
    ungleich: "İki yeni şifre aynı değil.",
  },
  // ★ O-CS (03.10.2026): eigenes Konto "ty", Lehrkraft "vy" (Glossar Regel 1);
  // "Přihlašovací údaje" (§2.5), "týdenní přehled"; nie "Smazat" - "Odstranit"
  // (Regel 10). Keine Vergangenheit über die Person (Regel 2): "Heslo se
  // změnilo.", "za týdny, ve kterých se cvičilo"; die Lehrkraft der Klasse heisst
  // "vyučující" in der Mehrzahl (Regel 2: "vyučujícímu" wäre männlich).
  cs: {
    titel: "Přihlašovací údaje",
    direktZu: "Nebo rovnou do programu:",
    lernprogramme: "Výukové programy",
    lehrkraftAngemeldet: "Účet pro vyučující:",
    lehrkraftKlassen:
      "Třídy, žáky a pokrok ve všech výukových programech spravujete v části Moje třídy.",
    lehrkraftPasswort:
      "Nové heslo pro účet pro vyučující nastavíte přes Zapomenuté heslo: pošleme vám odkaz na vaši e-mailovou adresu.",
    meineKlassen: "Moje třídy",
    passwortAendern: "Změnit heslo",
    klassenkind:
      "Tento účet patří k tvé třídě: jméno, heslo a kód třídy spravují vyučující - řekni jim, pokud se má něco změnit. Vlastní e-mailovou adresu tento účet nemá.",
    emailBlock: "E-mailová adresa",
    aktuell: "Současná adresa: ",
    bestaetigt: "· potvrzená",
    unbestaetigt: "· zatím nepotvrzená",
    keinBericht:
      "Dokud adresa není potvrzená, týdenní přehled tam neposíláme: chyba v adrese nemá každý týden posílat přehled někomu jinému. Cvičit můžeš dál jako obvykle.",
    nochmalSchicken: "Znovu poslat potvrzovací e-mail",
    neueAdresse: "Nová e-mailová adresa",
    neueAdresseHinweis:
      "Potvrzovací odkaz přijde na novou adresu. Kdo ji nemůže otevřít, nic nezmění.",
    adresseAendern: "Změnit adresu",
    postBlock: "Pošta od nás",
    bericht: "Týdenní přehled cvičení e-mailem",
    berichtHinweis:
      "V pondělí ráno, a jen za týdny, ve kterých se cvičilo. Uvádí tvoje minuty, dny a úkoly - a jen programy, které používáš.",
    berichtUnbestaetigt:
      "Dokud tvoje adresa není potvrzená, přehled stejně nepřijde - zaškrtnutí si ale tvoje přání zapamatuje.",
    warnung:
      "Upozornění, než se dlouho nepoužívaný účet odstraní, nelze vypnout. Jinak by tvoje data jednoho dne zmizela bez varování.",
    passwortBlock: "Heslo",
    bisher: "Dosavadní heslo",
    neu: "Nové heslo (nejméně 8 znaků)",
    neuNochmal: "Nové heslo znovu",
    loeschenBlock: "Odstranit účet",
    loeschenSatz:
      "Tím zmizí tvůj účet a veškerý pokrok ve všech čtyřech programech, hned a natrvalo.",
    loeschenKnopf: "Odstranit účet...",
    endgueltig: "Ano, natrvalo odstranit",
    abbrechen: "Zrušit",
    abmelden: "Odhlásit se",
    zurLernwerkstatt: "Přejít na Lernwerkstatt",
    mailGeschickt: "Poslali jsme ti e-mail s potvrzovacím odkazem.",
    linkAnNeue:
      "Odkaz jsme poslali na NOVOU adresu. Účet se přepne až po otevření odkazu tam - do té doby platí stará adresa.",
    wirdGespeichert: "Ukládání...",
    berichtAn: "Týdenní přehled je zapnutý. Přijde ti každé pondělí.",
    berichtAus: "Týdenní přehled je vypnutý. Další e-maily od nás už nepřijdou.",
    passwortGeaendert: "Heslo se změnilo.",
    kontoGeloescht: "Účet byl odstraněn.",
    nichtGeklappt: "To se nepodařilo.",
    nochEinmal: "To se nepodařilo. Zkus to znovu.",
    ungleich: "Nová hesla se neshodují.",
  },
  bg: {
    titel: "Моите данни за вход",
    direktZu: "Или направо към програма:",
    lernprogramme: "Програми за обучение",
    lehrkraftAngemeldet: "Учителски акаунт:",
    lehrkraftKlassen:
      "Класовете, учениците и напредъка във всички програми за обучение управлявате в раздела „Моите класове“.",
    lehrkraftPasswort:
      "Нова парола за учителския акаунт задавате чрез „Забравена парола?“: изпращаме ви връзка на имейл адреса.",
    meineKlassen: "Моите класове",
    passwortAendern: "Смени паролата",
    klassenkind:
      "Този акаунт е към класа ти: името, паролата и кодът на класа се управляват в училище - кажи в клас, ако нещо трябва да се промени. Собствен имейл адрес този акаунт няма.",
    emailBlock: "Имейл адрес",
    aktuell: "Текущ адрес: ",
    bestaetigt: "· потвърден",
    unbestaetigt: "· още не е потвърден",
    keinBericht:
      "Докато адресът не е потвърден, не изпращаме седмичен отчет на него: грешка в адреса не бива всяка седмица да праща отчета на някой друг. Можеш да се упражняваш както обикновено.",
    nochmalSchicken: "Изпрати пак имейла за потвърждение",
    neueAdresse: "Нов имейл адрес",
    neueAdresseHinweis:
      "Връзката за потвърждение отива на новия адрес. Който не може да го отвори, не може да промени нищо.",
    adresseAendern: "Смени адреса",
    postBlock: "Поща от нас",
    bericht: "Седмичен отчет за упражненията по имейл",
    berichtHinweis:
      "В понеделник сутрин и само за седмици с упражнения. В него са минутите, дните и задачите ти - и само програмите, които използваш.",
    berichtUnbestaetigt:
      "Докато адресът ти не е потвърден, отчетът пак няма да идва - но отметката запомня желанието ти.",
    warnung:
      "Предупреждението, преди дълго неизползван акаунт да бъде изтрит, не може да се изключи. Иначе един ден данните ти биха изчезнали без предупреждение.",
    passwortBlock: "Парола",
    bisher: "Досегашна парола",
    neu: "Нова парола (поне 8 знака)",
    neuNochmal: "Новата парола отново",
    loeschenBlock: "Изтриване на акаунта",
    loeschenSatz:
      "Така акаунтът ти и целият напредък във всичките четири програми изчезват веднага и завинаги.",
    loeschenKnopf: "Изтрий акаунта...",
    endgueltig: "Да, изтрий завинаги",
    abbrechen: "Отказ",
    abmelden: "Излез",
    zurLernwerkstatt: "Към Lernwerkstatt",
    mailGeschickt: "Изпратихме ти имейл с връзка за потвърждение.",
    linkAnNeue:
      "Изпратихме връзка на НОВИЯ адрес. Акаунтът се превключва едва след като връзката бъде отворена там - дотогава важи старият адрес.",
    wirdGespeichert: "Записване...",
    berichtAn: "Седмичният отчет е включен. Ще го получаваш всеки понеделник.",
    berichtAus: "Седмичният отчет е изключен. Повече имейли от нас няма да идват.",
    passwortGeaendert: "Паролата е сменена.",
    kontoGeloescht: "Акаунтът е изтрит.",
    nichtGeklappt: "Не се получи.",
    nochEinmal: "Не се получи. Опитай пак.",
    ungleich: "Новите пароли не съвпадат.",
  },
  el: {
    titel: "Τα στοιχεία σύνδεσής μου",
    direktZu: "Ή κατευθείαν σε ένα πρόγραμμα:",
    lernprogramme: "Εφαρμογές μάθησης",
    lehrkraftAngemeldet: "Λογαριασμός εκπαιδευτικού:",
    lehrkraftKlassen:
      "Τα τμήματα, τους μαθητές και την πρόοδό τους σε όλες τις εφαρμογές μάθησης τα διαχειρίζεστε στην ενότητα «Τα τμήματά μου».",
    lehrkraftPasswort:
      "Νέο κωδικό πρόσβασης για τον λογαριασμό εκπαιδευτικού ορίζετε μέσω του «Ξέχασες τον κωδικό πρόσβασης;»: σας στέλνουμε σύνδεσμο στη διεύθυνση e-mail σας.",
    meineKlassen: "Τα τμήματά μου",
    passwortAendern: "Αλλαγή κωδικού πρόσβασης",
    klassenkind:
      "Αυτός ο λογαριασμός ανήκει στο τμήμα σου: το όνομα, τον κωδικό πρόσβασης και τον κωδικό τμήματος τα φροντίζουν οι εκπαιδευτικοί σου - πες τους, αν κάτι πρέπει να αλλάξει. Αυτός ο λογαριασμός δεν έχει δική του διεύθυνση e-mail.",
    emailBlock: "Διεύθυνση e-mail",
    aktuell: "Τρέχουσα διεύθυνση: ",
    bestaetigt: "· επιβεβαιωμένη",
    unbestaetigt: "· δεν έχει επιβεβαιωθεί ακόμα",
    keinBericht:
      "Όσο η διεύθυνση δεν έχει επιβεβαιωθεί, δεν στέλνουμε εκεί εβδομαδιαία αναφορά: ένα λάθος στη διεύθυνση δεν πρέπει να στέλνει κάθε εβδομάδα την αναφορά σε κάποιο άλλο άτομο. Μπορείς να συνεχίσεις την εξάσκηση όπως πάντα.",
    nochmalSchicken: "Νέα αποστολή e-mail επιβεβαίωσης",
    neueAdresse: "Νέα διεύθυνση e-mail",
    neueAdresseHinweis:
      "Ο σύνδεσμος επιβεβαίωσης πηγαίνει στη νέα διεύθυνση. Χωρίς πρόσβαση σε αυτή τη διεύθυνση δεν αλλάζει τίποτα.",
    adresseAendern: "Αλλαγή διεύθυνσης",
    postBlock: "E-mail από εμάς",
    bericht: "Εβδομαδιαία αναφορά εξάσκησης με e-mail",
    berichtHinweis:
      "Τη Δευτέρα το πρωί, και μόνο για εβδομάδες με εξάσκηση. Δείχνει τα λεπτά, τις ημέρες και τις εργασίες σου - και μόνο τα προγράμματα που χρησιμοποιείς.",
    berichtUnbestaetigt:
      "Όσο η διεύθυνσή σου δεν έχει επιβεβαιωθεί, η αναφορά δεν θα έρθει - το σημάδι επιλογής όμως θυμάται τι θέλεις.",
    warnung:
      "Την προειδοποίηση πριν από τη διαγραφή ενός λογαριασμού που δεν χρησιμοποιήθηκε για πολύ καιρό δεν μπορείς να την απενεργοποιήσεις. Αλλιώς τα δεδομένα σου θα μπορούσαν κάποια μέρα να χαθούν χωρίς προειδοποίηση.",
    passwortBlock: "Κωδικός πρόσβασης",
    bisher: "Τρέχων κωδικός πρόσβασης",
    neu: "Νέος κωδικός πρόσβασης (τουλάχιστον 8 χαρακτήρες)",
    neuNochmal: "Επανάληψη νέου κωδικού πρόσβασης",
    loeschenBlock: "Διαγραφή λογαριασμού",
    loeschenSatz:
      "Έτσι διαγράφονται ο λογαριασμός σου και όλη η πρόοδός σου και στα τέσσερα προγράμματα, αμέσως και οριστικά.",
    loeschenKnopf: "Διαγραφή λογαριασμού...",
    endgueltig: "Ναι, οριστική διαγραφή",
    abbrechen: "Άκυρο",
    abmelden: "Αποσύνδεση",
    zurLernwerkstatt: "Μετάβαση στο Lernwerkstatt",
    mailGeschickt: "Σου στείλαμε ένα e-mail με σύνδεσμο επιβεβαίωσης.",
    linkAnNeue:
      "Στείλαμε τον σύνδεσμο στη νέα διεύθυνση, όχι στην παλιά. Ο λογαριασμός αλλάζει μόνο όταν ανοίξει ο σύνδεσμος εκεί - μέχρι τότε ισχύει η παλιά διεύθυνση.",
    wirdGespeichert: "Αποθήκευση...",
    berichtAn: "Η εβδομαδιαία αναφορά ενεργοποιήθηκε. Θα έρχεται κάθε Δευτέρα.",
    berichtAus: "Η εβδομαδιαία αναφορά απενεργοποιήθηκε. Δεν θα λαμβάνεις άλλα e-mail από εμάς.",
    passwortGeaendert: "Ο κωδικός πρόσβασης άλλαξε.",
    kontoGeloescht: "Ο λογαριασμός διαγράφηκε.",
    nichtGeklappt: "Κάτι δεν πήγε καλά.",
    nochEinmal: "Κάτι δεν πήγε καλά. Δοκίμασε ξανά.",
    ungleich: "Οι δύο νέοι κωδικοί πρόσβασης δεν ταιριάζουν.",
  },
  hu: {
    titel: "Belépési adataim",
    direktZu: "Vagy egyenesen egy programhoz:",
    lernprogramme: "Oktatóprogramok",
    lehrkraftAngemeldet: "Bejelentkezett tanári fiók:",
    lehrkraftKlassen:
      "Az osztályok, a tanulók és a haladás kezelése minden oktatóprogramban az „Osztályaim” részben történik.",
    lehrkraftPasswort:
      "A tanári fiók új jelszava az „Elfelejtett jelszó?” lehetőséggel állítható be: a fiók e-mail-címére hivatkozást küldünk.",
    meineKlassen: "Osztályaim",
    passwortAendern: "Jelszó módosítása",
    klassenkind:
      "Ez a fiók az osztályodhoz tartozik: a nevet, a jelszót és az osztálykódot a tanárod kezeli - szólj neki, ha valamit módosítani kell. Saját e-mail-címe ennek a fióknak nincs.",
    emailBlock: "E-mail-cím",
    aktuell: "Jelenlegi cím: ",
    bestaetigt: "· megerősítve",
    unbestaetigt: "· még nincs megerősítve",
    keinBericht:
      "Amíg a cím nincs megerősítve, nem küldünk oda heti összesítőt: egy elírt cím miatt ne kapja meg más minden héten. Gyakorolni ugyanúgy tudsz tovább.",
    nochmalSchicken: "Megerősítő e-mail újraküldése",
    neueAdresse: "Új e-mail-cím",
    neueAdresseHinweis:
      "A megerősítő hivatkozás az új címre megy. Aki azt nem tudja megnyitni, nem változtat semmit.",
    adresseAendern: "Cím módosítása",
    postBlock: "Levelek tőlünk",
    bericht: "Heti összesítő e-mailben",
    berichtHinweis:
      "Hétfő reggel, és csak azokon a heteken, amikor gyakoroltál. Felsorolja a perceidet, a napjaidat és a feladataidat - és csak azokat a programokat, amelyeket használtál.",
    berichtUnbestaetigt:
      "Amíg a címed nincs megerősítve, az összesítő akkor sem érkezik meg - a pipa viszont megjegyzi, mit szeretnél.",
    warnung:
      "A figyelmeztetésről, amelyet egy sokáig nem használt fiók törlése előtt küldünk, nem lehet leiratkozni. Különben az adataid egy nap figyelmeztetés nélkül eltűnnének.",
    passwortBlock: "Jelszó",
    bisher: "Jelenlegi jelszó",
    neu: "Új jelszó (legalább 8 karakter)",
    neuNochmal: "Új jelszó újra",
    loeschenBlock: "Fiók törlése",
    loeschenSatz:
      "Ezzel a fiókod és minden eredményed mind a négy programban eltűnik, azonnal és véglegesen.",
    loeschenKnopf: "Fiók törlése...",
    endgueltig: "Igen, végleges törlés",
    abbrechen: "Mégse",
    abmelden: "Kijelentkezés",
    zurLernwerkstatt: "Tovább a Lernwerkstatt oldalára",
    mailGeschickt: "Küldtünk neked egy e-mailt egy megerősítő hivatkozással.",
    linkAnNeue:
      "A hivatkozást az ÚJ címre küldtük. A fiók csak akkor vált át, amikor ott megnyitják a hivatkozást - addig a régi cím érvényes.",
    wirdGespeichert: "Mentés...",
    berichtAn: "Heti összesítő bekapcsolva. Hétfőnként megkapod.",
    berichtAus: "Heti összesítő kikapcsolva. Több e-mailt nem küldünk.",
    passwortGeaendert: "A jelszó megváltozott.",
    kontoGeloescht: "A fiók törölve.",
    nichtGeklappt: "Ez nem sikerült.",
    nochEinmal: "Ez nem sikerült. Próbáld újra.",
    ungleich: "A két új jelszó nem egyezik.",
  },
  nl: {
    titel: "Mijn inloggegevens",
    direktZu: "Of meteen naar een programma:",
    lernprogramme: "Leerprogramma's",
    lehrkraftAngemeldet: "Je bent ingelogd als leerkracht:",
    lehrkraftKlassen:
      "Klassen, leerlingen en de voortgang in alle leerprogramma's beheer je bij \"Mijn klassen\".",
    lehrkraftPasswort:
      "Een nieuw wachtwoord voor je account voor leerkrachten stel je in via \"Wachtwoord vergeten?\": we sturen een link naar je e-mailadres.",
    meineKlassen: "Mijn klassen",
    passwortAendern: "Wachtwoord wijzigen",
    klassenkind:
      "Je inloggegevens horen bij je klas: je naam, je wachtwoord en de klascode worden beheerd door je leerkracht - zeg het tegen je leerkracht als er iets moet veranderen. Bij deze inloggegevens hoort geen eigen e-mailadres.",
    emailBlock: "E-mailadres",
    aktuell: "Huidig adres: ",
    bestaetigt: "· bevestigd",
    unbestaetigt: "· nog niet bevestigd",
    keinBericht:
      "Zolang het adres niet is bevestigd, sturen we er geen weekverslag naartoe: een typefout mag niet elke week bij iemand anders terechtkomen. Je kunt gewoon verder oefenen.",
    nochmalSchicken: "Bevestigingsmail opnieuw verzenden",
    neueAdresse: "Nieuw e-mailadres",
    neueAdresseHinweis:
      "De bevestigingslink gaat naar het nieuwe adres. Wie dat adres niet kan openen, kan niets wijzigen.",
    adresseAendern: "Adres wijzigen",
    postBlock: "E-mails van ons",
    bericht: "Weekverslag van het oefenen per e-mail",
    berichtHinweis:
      "Op maandagochtend, en alleen in weken waarin je hebt geoefend. Het noemt je minuten, dagen en opdrachten - en alleen de programma's die je hebt gebruikt.",
    berichtUnbestaetigt:
      "Zolang je adres niet is bevestigd, komt het verslag toch niet - het vinkje onthoudt wel wat je wilt.",
    warnung:
      "Je krijgt altijd een waarschuwing voordat we een account na lange tijd zonder gebruik verwijderen. Die e-mail kun je niet uitzetten. Anders zouden je gegevens op een dag zonder waarschuwing weg zijn.",
    passwortBlock: "Wachtwoord",
    bisher: "Huidig wachtwoord",
    neu: "Nieuw wachtwoord (minstens 8 tekens)",
    neuNochmal: "Nieuw wachtwoord herhalen",
    loeschenBlock: "Account verwijderen",
    loeschenSatz:
      "Daarmee verdwijnen je account en al je voortgang in alle vier de programma's, meteen en definitief.",
    loeschenKnopf: "Account verwijderen...",
    endgueltig: "Ja, definitief verwijderen",
    abbrechen: "Annuleren",
    abmelden: "Uitloggen",
    zurLernwerkstatt: "Naar Lernwerkstatt",
    mailGeschickt: "We hebben je een e-mail met een bevestigingslink gestuurd.",
    linkAnNeue:
      "We hebben een link naar het NIEUWE adres gestuurd. Pas als die link daar is geopend, gaat je account over op dat adres - tot die tijd geldt het oude adres.",
    wirdGespeichert: "Opslaan...",
    berichtAn: "Weekverslag ingeschakeld. Je krijgt het op maandag.",
    berichtAus: "Weekverslag uitgeschakeld. Je krijgt geen e-mails meer.",
    passwortGeaendert: "Je wachtwoord is gewijzigd.",
    kontoGeloescht: "Je account is verwijderd.",
    nichtGeklappt: "Dat is niet gelukt.",
    nochEinmal: "Dat is niet gelukt. Probeer het nog eens.",
    ungleich: "De twee nieuwe wachtwoorden zijn niet gelijk.",
  },
  pt: {
    titel: "Os meus dados de acesso",
    direktZu: "Ou ir diretamente para um programa:",
    lernprogramme: "Programas de aprendizagem",
    lehrkraftAngemeldet: "Sessão iniciada com conta de docente:",
    lehrkraftKlassen:
      "Gere turmas, estudantes e progressos em todos os programas de aprendizagem na área \"As minhas turmas\".",
    lehrkraftPasswort:
      "Para definir uma nova palavra-passe da conta de docente, use \"Esqueceu-se da palavra-passe?\": enviamos-lhe uma ligação para o seu endereço de e-mail.",
    meineKlassen: "As minhas turmas",
    passwortAendern: "Alterar palavra-passe",
    klassenkind:
      "Esta conta pertence à tua turma: o nome, a palavra-passe e o código da turma são geridos por quem ensina - fala com essa pessoa se algo tiver de mudar. Esta conta não tem endereço de e-mail próprio.",
    emailBlock: "Endereço de e-mail",
    aktuell: "Atual: ",
    bestaetigt: "· confirmado",
    unbestaetigt: "· ainda não confirmado",
    keinBericht:
      "Enquanto o endereço não estiver confirmado, não enviamos para lá o resumo semanal: um erro no endereço não deve fazer chegar o resumo a outra pessoa todas as semanas. Podes continuar a praticar como sempre.",
    nochmalSchicken: "Enviar outra vez o e-mail de confirmação",
    neueAdresse: "Novo endereço de e-mail",
    neueAdresseHinweis:
      "A ligação de confirmação segue para o novo endereço. Quem não o conseguir abrir não altera nada.",
    adresseAendern: "Alterar endereço",
    postBlock: "E-mails que enviamos",
    bericht: "Resumo semanal da prática por e-mail",
    berichtHinweis:
      "À segunda-feira de manhã cedo e só nas semanas em que praticaste. Indica os teus minutos, dias e tarefas - e só os programas que usaste.",
    berichtUnbestaetigt:
      "Enquanto o teu endereço não estiver confirmado, o resumo não chega - mas a caixa de verificação guarda a tua escolha.",
    warnung:
      "O aviso antes de ser eliminada uma conta sem uso há muito tempo não pode ser cancelado. Caso contrário, os teus dados podiam desaparecer um dia sem aviso.",
    passwortBlock: "Palavra-passe",
    bisher: "Palavra-passe atual",
    neu: "Nova palavra-passe (pelo menos 8 carateres)",
    neuNochmal: "Repetir nova palavra-passe",
    loeschenBlock: "Eliminar conta",
    loeschenSatz:
      "Assim, a tua conta e todos os progressos nos quatro programas desaparecem, de imediato e para sempre.",
    loeschenKnopf: "Eliminar conta...",
    endgueltig: "Sim, eliminar para sempre",
    abbrechen: "Cancelar",
    abmelden: "Terminar sessão",
    zurLernwerkstatt: "Ir para a Lernwerkstatt",
    mailGeschickt: "Enviámos-te um e-mail com uma ligação de confirmação.",
    linkAnNeue:
      "Enviámos uma ligação para o NOVO endereço. A conta só muda depois de abrires essa ligação - até lá, vale o endereço antigo.",
    wirdGespeichert: "A guardar...",
    berichtAn: "Resumo semanal ligado. Chega à segunda-feira.",
    berichtAus: "Resumo semanal desligado. Não recebes mais e-mails.",
    passwortGeaendert: "A palavra-passe foi alterada.",
    kontoGeloescht: "A conta foi eliminada.",
    nichtGeklappt: "Não resultou.",
    nochEinmal: "Não resultou. Tenta outra vez.",
    ungleich: "As duas novas palavras-passe não coincidem.",
  },
  br: {
    titel: "Meus dados de acesso",
    direktZu: "Ou direto para um aplicativo:",
    lernprogramme: "Aplicativos de aprendizagem",
    lehrkraftAngemeldet: "Conta docente conectada:",
    lehrkraftKlassen:
      "Você gerencia turmas, estudantes e o progresso em todos os aplicativos na área Minhas turmas.",
    lehrkraftPasswort:
      "Uma nova senha para sua conta docente é definida pela opção Esqueceu a senha? - enviamos um link para seu endereço de e-mail.",
    meineKlassen: "Minhas turmas",
    passwortAendern: "Alterar senha",
    klassenkind:
      "Este acesso pertence à sua turma: nome, senha e código da turma são gerenciados por quem dá aula para você - fale com essa pessoa se algo precisar mudar. Esta conta não tem endereço de e-mail próprio.",
    emailBlock: "Endereço de e-mail",
    aktuell: "Atual: ",
    bestaetigt: "· confirmado",
    unbestaetigt: "· ainda não confirmado",
    keinBericht:
      "Enquanto o endereço não for confirmado, não enviamos o resumo semanal para ele: um erro de digitação não deve fazer o resumo chegar toda semana para outra pessoa. Você pode continuar praticando normalmente.",
    nochmalSchicken: "Enviar o e-mail de confirmação de novo",
    neueAdresse: "Novo endereço de e-mail",
    neueAdresseHinweis:
      "O link de confirmação vai para o novo endereço. Quem não consegue abrir esse endereço não muda nada.",
    adresseAendern: "Alterar endereço",
    postBlock: "Nossos e-mails",
    bericht: "Resumo semanal da prática por e-mail",
    berichtHinweis:
      "Na segunda-feira cedo, e só nas semanas em que você praticou. Ele informa seus minutos, dias e exercícios - e só os aplicativos que você usou.",
    berichtUnbestaetigt:
      "Enquanto seu endereço não for confirmado, o resumo não chega - mas a caixa marcada guarda o que você quer.",
    warnung:
      "O aviso enviado antes da exclusão de uma conta sem uso há muito tempo não pode ser cancelado. Sem ele, seus dados poderiam sumir um dia sem aviso prévio.",
    passwortBlock: "Senha",
    bisher: "Senha atual",
    neu: "Nova senha (pelo menos 8 caracteres)",
    neuNochmal: "Repetir a nova senha",
    loeschenBlock: "Excluir conta",
    loeschenSatz:
      "Com isso, sua conta e todo o progresso nos quatro aplicativos somem, na hora e para sempre.",
    loeschenKnopf: "Excluir conta...",
    endgueltig: "Sim, excluir para sempre",
    abbrechen: "Cancelar",
    abmelden: "Sair",
    zurLernwerkstatt: "Ir para a Lernwerkstatt",
    mailGeschickt: "Enviamos para você um e-mail com um link de confirmação.",
    linkAnNeue:
      "Enviamos um link para o NOVO endereço. A conta só muda depois que esse link for aberto - até lá, vale o endereço antigo.",
    wirdGespeichert: "Salvando...",
    berichtAn: "Resumo semanal ligado. Ele chega às segundas-feiras.",
    berichtAus: "Resumo semanal cancelado. Você não recebe mais e-mails nossos.",
    passwortGeaendert: "Sua senha foi alterada.",
    kontoGeloescht: "Sua conta foi excluída.",
    nichtGeklappt: "Não foi possível concluir.",
    nochEinmal: "Não foi possível concluir. Tente de novo.",
    ungleich: "As duas novas senhas não são iguais.",
  },
  ro: {
    titel: "Datele mele de conectare",
    direktZu: "Sau direct la un program:",
    lernprogramme: "Programe de învățare",
    lehrkraftAngemeldet: "Cont pentru cadre didactice:",
    lehrkraftKlassen:
      "Clasele, elevii și progresul din toate programele de învățare se administrează în secțiunea Clasele mele.",
    lehrkraftPasswort:
      "O parolă nouă pentru contul de cadru didactic se setează prin „Ați uitat parola?”: vă trimitem un link la adresa de e-mail.",
    meineKlassen: "Clasele mele",
    passwortAendern: "Modificați parola",
    klassenkind:
      "Acest cont ține de clasa ta: numele, parola și codul clasei se administrează la școală - spune la clasă dacă trebuie schimbat ceva. Contul nu are o adresă de e-mail proprie.",
    emailBlock: "Adresa de e-mail",
    aktuell: "Adresa actuală: ",
    bestaetigt: "· confirmată",
    unbestaetigt: "· încă neconfirmată",
    keinBericht:
      "Cât timp adresa nu este confirmată, nu trimitem acolo raportul săptămânal: o greșeală în adresă nu trebuie să ajungă în fiecare săptămână la altcineva. Poți exersa în continuare ca de obicei.",
    nochmalSchicken: "Trimiteți din nou e-mailul de confirmare",
    neueAdresse: "Adresă de e-mail nouă",
    neueAdresseHinweis:
      "Linkul de confirmare ajunge la noua adresă. Cine nu o poate deschide nu schimbă nimic.",
    adresseAendern: "Modificați adresa",
    postBlock: "Mesaje de la noi",
    bericht: "Raport săptămânal de exersare prin e-mail",
    berichtHinweis:
      "Lunea dimineața, și numai pentru săptămânile în care ai exersat. Cuprinde minutele, zilele și sarcinile tale - și numai programele pe care le-ai folosit.",
    berichtUnbestaetigt:
      "Cât timp adresa ta nu este confirmată, raportul tot nu sosește - dar bifa reține ce dorești.",
    warnung:
      "Avertismentul dinaintea ștergerii unui cont nefolosit de mult timp nu se poate dezactiva. Altfel, datele tale ar putea dispărea într-o zi fără avertisment.",
    passwortBlock: "Parolă",
    bisher: "Parola actuală",
    neu: "Parolă nouă (cel puțin 8 caractere)",
    neuNochmal: "Repetați parola nouă",
    loeschenBlock: "Ștergeți contul",
    loeschenSatz:
      "Astfel dispar contul tău și tot progresul din toate cele patru programe, imediat și definitiv.",
    loeschenKnopf: "Ștergeți contul...",
    endgueltig: "Da, ștergeți definitiv",
    abbrechen: "Anulați",
    abmelden: "Deconectați-vă",
    zurLernwerkstatt: "Mergeți la Lernwerkstatt",
    mailGeschickt: "Ți-am trimis un e-mail cu un link de confirmare.",
    linkAnNeue:
      "Am trimis un link la adresa NOUĂ. Contul se schimbă abia după deschiderea linkului de acolo - până atunci este valabilă adresa veche.",
    wirdGespeichert: "Se salvează...",
    berichtAn: "Raportul săptămânal este pornit. Îl primești lunea.",
    berichtAus: "Raportul săptămânal este oprit. Nu mai primești e-mailuri de la noi.",
    passwortGeaendert: "Parola a fost modificată.",
    kontoGeloescht: "Contul a fost șters.",
    nichtGeklappt: "Nu a reușit.",
    nochEinmal: "Nu a reușit. Mai încearcă o dată.",
    ungleich: "Cele două parole noi nu coincid.",
  },
  sv: {
    titel: "Mina inloggningsuppgifter",
    direktZu: "Eller gå direkt till ett program:",
    lernprogramme: "Lärprogram",
    lehrkraftAngemeldet: "Du är inloggad som lärare:",
    lehrkraftKlassen:
      "Klasser, elever och framsteg i alla lärprogram hanterar du i Mina klasser.",
    lehrkraftPasswort:
      "Ett nytt lösenord för ditt lärarkonto ställer du in via Glömt lösenordet: en länk skickas till din e-postadress.",
    meineKlassen: "Mina klasser",
    passwortAendern: "Ändra lösenord",
    klassenkind:
      "Din inloggning hör till din klass: läraren sköter namn, lösenord och klasskod - prata med läraren om något ska ändras. Det här kontot har ingen egen e-postadress.",
    emailBlock: "E-postadress",
    aktuell: "Nuvarande adress: ",
    bestaetigt: "· bekräftad",
    unbestaetigt: "· inte bekräftad än",
    keinBericht:
      "Så länge adressen inte är bekräftad skickas ingen veckorapport dit: ett skrivfel i adressen ska inte leda till att någon annan får rapporten varje vecka. Du kan öva vidare som vanligt.",
    nochmalSchicken: "Skicka bekräftelsen igen via e-post",
    neueAdresse: "Ny e-postadress",
    neueAdresseHinweis:
      "Bekräftelselänken skickas till den nya adressen. Den som inte kan öppna den kan inte ändra något.",
    adresseAendern: "Ändra adress",
    postBlock: "E-post från oss",
    bericht: "Veckorapport om övningen via e-post",
    berichtHinweis:
      "Tidigt på måndagar, och bara de veckor då du har övat. Den visar dina minuter, dagar och uppgifter - och bara de program som du har använt.",
    berichtUnbestaetigt:
      "Så länge din adress inte är bekräftad kommer rapporten ändå inte - men kryssrutan minns ditt val.",
    warnung:
      "Varningen innan ett konto som inte har använts på länge tas bort går inte att stänga av. Annars skulle dina uppgifter en dag kunna försvinna utan förvarning.",
    passwortBlock: "Lösenord",
    bisher: "Nuvarande lösenord",
    neu: "Nytt lösenord (minst 8 tecken)",
    neuNochmal: "Upprepa det nya lösenordet",
    loeschenBlock: "Ta bort konto",
    loeschenSatz:
      "Då försvinner ditt konto och alla dina framsteg i alla fyra program, direkt och för alltid.",
    loeschenKnopf: "Ta bort konto...",
    endgueltig: "Ja, ta bort för alltid",
    abbrechen: "Avbryt",
    abmelden: "Logga ut",
    zurLernwerkstatt: "Gå till Lernwerkstatt",
    mailGeschickt: "Ett e-postmeddelande med en bekräftelselänk har skickats till dig.",
    linkAnNeue:
      "En länk har skickats till den nya adressen. Kontot byter adress först när länken där öppnas - fram till dess gäller den gamla adressen.",
    wirdGespeichert: "Sparar...",
    berichtAn: "Veckorapporten är på. Du får den på måndagar.",
    berichtAus: "Veckorapporten är avstängd. Du får ingen mer e-post.",
    passwortGeaendert: "Ditt lösenord är ändrat.",
    kontoGeloescht: "Ditt konto är borttaget.",
    nichtGeklappt: "Det gick inte.",
    nochEinmal: "Det gick inte. Försök igen.",
    ungleich: "De två nya lösenorden stämmer inte överens.",
  },
  uk: {
    titel: "Дані для входу",
    direktZu: "Або одразу до програми:",
    lernprogramme: "Навчальні програми",
    lehrkraftAngemeldet: "Обліковий запис педагога:",
    lehrkraftKlassen:
      "Класами, учнями та поступом у всіх навчальних програмах ви керуєте в розділі Мої класи.",
    lehrkraftPasswort:
      "Новий пароль для облікового запису педагога: виберіть Забутий пароль? - ми надішлемо посилання на вашу адресу електронної пошти.",
    meineKlassen: "Мої класи",
    passwortAendern: "Змінити пароль",
    klassenkind:
      "Цей обліковий запис належить до твого класу: ім'я, пароль і код класу змінює педагог - звернися до педагога, якщо щось треба змінити. Власної адреси електронної пошти в цьому обліковому записі немає.",
    emailBlock: "Адреса електронної пошти",
    aktuell: "Поточна адреса: ",
    bestaetigt: "· підтверджено",
    unbestaetigt: "· ще не підтверджено",
    keinBericht:
      "Доки адресу не підтверджено, ми не надсилаємо туди тижневий звіт: помилка в адресі не має щотижня надсилати звіт комусь іншому. Можеш тренуватися далі як завжди.",
    nochmalSchicken: "Надіслати лист із підтвердженням ще раз",
    neueAdresse: "Нова адреса електронної пошти",
    neueAdresseHinweis:
      "Посилання для підтвердження прийде на нову адресу. Хто не може її відкрити, нічого не змінить.",
    adresseAendern: "Змінити адресу",
    postBlock: "Листи від нас",
    bericht: "Тижневий звіт про тренування електронною поштою",
    berichtHinweis:
      "У понеділок уранці й лише за тижні з тренуванням. У ньому є твої хвилини, дні та завдання - і лише програми, якими ти користуєшся.",
    berichtUnbestaetigt:
      "Доки твою адресу не підтверджено, звіт усе одно не надходитиме - але позначка запам'ятає твоє бажання.",
    warnung:
      "Попередження перед видаленням облікового запису, яким довго не користувалися, вимкнути не можна. Інакше твої дані одного дня зникли б без попередження.",
    passwortBlock: "Пароль",
    bisher: "Поточний пароль",
    neu: "Новий пароль (щонайменше 8 знаків)",
    neuNochmal: "Повторити новий пароль",
    loeschenBlock: "Видалити обліковий запис",
    loeschenSatz:
      "Тоді твій обліковий запис і весь поступ у всіх чотирьох програмах зникнуть одразу й назавжди.",
    loeschenKnopf: "Видалити обліковий запис...",
    endgueltig: "Так, видалити назавжди",
    abbrechen: "Скасувати",
    abmelden: "Вийти",
    zurLernwerkstatt: "Перейти до Lernwerkstatt",
    mailGeschickt: "Ми надіслали тобі лист із посиланням для підтвердження.",
    linkAnNeue:
      "Ми надіслали посилання на НОВУ адресу. Обліковий запис перейде на неї лише після відкриття посилання - доти діє стара адреса.",
    wirdGespeichert: "Збереження...",
    berichtAn: "Тижневий звіт увімкнено. Він надходитиме щопонеділка.",
    berichtAus: "Тижневий звіт вимкнено. Листів від нас більше не буде.",
    passwortGeaendert: "Пароль змінено.",
    kontoGeloescht: "Обліковий запис видалено.",
    nichtGeklappt: "Не вдалося.",
    nochEinmal: "Не вдалося. Спробуй ще раз.",
    ungleich: "Нові паролі не збігаються.",
  },
});

/** Die Erfolgs- und Zwischenmeldungen - als Schlüssel im Zustand. */
type MeldungSchluessel =
  | "mailGeschickt"
  | "linkAnNeue"
  | "wirdGespeichert"
  | "berichtAn"
  | "berichtAus"
  | "passwortGeaendert"
  | "kontoGeloescht";

/** Ein Abschnitt mit Überschrift — wie die Gruppen im Einstellungs-Bereich. */
function Block({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card space-y-3 p-5">
      <h2 className="m-0 text-lg font-semibold text-ink">{titel}</h2>
      {children}
    </section>
  );
}

export function LernwerkstattKontoPage() {
  const account = useTypingAuth((s) => s.account);
  const update = useTypingAuth((s) => s.update);
  const logout = useTypingAuth((s) => s.logout);

  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const [busy, setBusy] = useState(false);
  const [meldung, setMeldung] = useState<MeldungSchluessel | "">("");
  const [fehler, setFehler] = useState("");
  const [neueAdresse, setNeueAdresse] = useState("");
  const [altesPw, setAltesPw] = useState("");
  const [neuesPw, setNeuesPw] = useState("");
  const [neuesPw2, setNeuesPw2] = useState("");
  const [loeschenOffen, setLoeschenOffen] = useState(false);

  const istLehrkraft = account?.role === "lehrkraft";
  const selbst = account?.role === "schueler" && account.selfManaged;

  const navigate = useNavigate();
  const { released } = useProgrammeCatalog();

  // ★ Fokus nach dem Anmelden (Fokusziel: Der Knopf, den man eben betätigt hat,
  // ist mit dem Formular verschwunden). Der Fokus geht auf die Überschrift der
  // Seite, dahinter steht jetzt „Meine Zugangsdaten" mit dem neuen Inhalt - und
  // NUR beim Wechsel von abgemeldet zu angemeldet, nicht beim bloßen Ankommen
  // (wer schon angemeldet hierher kommt, landet wie überall am Seitenanfang).
  const titelRef = useRef<HTMLHeadingElement>(null);
  const warAngemeldet = useRef(!!account);
  useEffect(() => {
    if (account && !warAngemeldet.current) titelRef.current?.focus();
    warAngemeldet.current = !!account;
  }, [account]);

  async function lauf(
    fn: () => Promise<{ ok: boolean; error?: string }>,
    gut: MeldungSchluessel,
  ) {
    if (busy) return;
    setBusy(true);
    setMeldung("");
    setFehler("");
    const r = await fn();
    setBusy(false);
    if (r.ok) setMeldung(gut);
    else setFehler(r.error ?? T.de.nichtGeklappt);
  }

  return (
    <div className="min-h-screen">
      {/* 05.09.2026: Kopfzeile war nachgebaut - Schalter fest am Fensterrand,
          Marke im Fluss (und dort stand „ensorik"). Jetzt die gemeinsame
          Leiste. */}
      <PublicHeader konto={false} />

      <div className="mx-auto w-full max-w-lg space-y-5 px-4 pb-12 pt-10 sm:px-6">

        <h1 ref={titelRef} tabIndex={-1} className="m-0 text-2xl font-semibold text-ink">
          {t.titel}
        </h1>

        {!account ? (
          /*
            ★★ ABGEMELDET (21.09.2026, Johannes: *„wenn ich ohne Anmeldung in
            der Lernwerkstatt auf Konto klicke … da soll die Erklärung kommen
            und die Möglichkeit der Anmeldung für alle Apps"*). Bis heute stand
            hier nur „Melde dich in einem der Programme an" und vier Verweise -
            wer kein Konto hatte, erfuhr nicht, was ihm eines bringt, und musste
            die Anmeldung erst in einem Programm suchen.

            Jetzt: die Erklärung (derselbe Baustein wie auf der Überblicksseite),
            darunter DIESELBE Anmeldung wie in den Programmen - Klassencode oder
            eigenes Konto, Lehrkraft, Konto erstellen, „Passwort vergessen?".
            Nach dem Anmelden zeigt die Seite von selbst „Meine Zugangsdaten".
            Die vier Verweise bleiben, kleiner, als Weg in ein Programm.
          */
          <>
            <KontoErklaerung released={released} anmeldungHier className="card p-5" />
            <TypingAuth alsKontoSeite onCancel={() => navigate(hausStartHref())} />
            <div className="space-y-2">
              <p className="m-0 text-sm text-ink-muted">{t.direktZu}</p>
              <nav aria-label={t.lernprogramme} className="flex flex-wrap gap-2">
                {/* Nur freigegebene Programme - dieselbe Auswahl wie die
                    Erklärung darüber. Ein geparktes Programm hier zu verlinken,
                    während der Text es nicht nennt, wären zwei Listen, die
                    einander widersprechen. */}
                {LW_PROGRAMS.filter((p) => released(p.key)).map((p) => (
                  <Link
                    key={p.key}
                    to={p.path}
                    className="btn-secondary btn-toggle inline-flex items-center gap-2"
                  >
                    {/* ★ Das echte Zeichen der App (10.09.2026, Johannes). */}
                    <ProgrammZeichen programm={p.key} /> {p.label}
                  </Link>
                ))}
              </nav>
            </div>
          </>
        ) : istLehrkraft ? (
          /*
            LEHRKRAFT - eigener Abschnitt, Anrede „Sie" (K21). Was hier steht,
            ist genau das, was es für `tt_teachers` wirklich gibt: der Bereich
            „Meine Klassen" und der Weg über „Passwort vergessen". Kein
            Formular, das nichts kann (siehe Kopf dieser Datei).
          */
          <div className="card space-y-3 p-5">
            <p className="m-0 text-ink-soft">
              {t.lehrkraftAngemeldet}{" "}
              <strong>{account.name}</strong>
              {account.email ? <> · {account.email}</> : null}
            </p>
            <p className="m-0 text-ink-soft">{t.lehrkraftKlassen}</p>
            <p className="m-0 text-sm text-ink-muted">{t.lehrkraftPasswort}</p>
            <div className="flex flex-wrap gap-2">
              <Link to={meineKlasseHref()} className="btn-primary">
                {t.meineKlassen}
              </Link>
              <Link to="/lernprogramm-passwort" className="btn-secondary">
                {t.passwortAendern}
              </Link>
            </div>
          </div>
        ) : !selbst ? (
          <div className="card p-5">
            <p className="m-0 text-ink-soft">{t.klassenkind}</p>
          </div>
        ) : (
          <>
            {meldung && (
              <p role="status" className="m-0 rounded-xl bg-success-soft p-3 text-ink">
                {t[meldung]}
              </p>
            )}
            {fehler && (
              <p role="alert" className="m-0 rounded-xl bg-danger-soft p-3 text-ink">
                <ServerMeldung text={fehler} />
              </p>
            )}

            <Block titel={t.emailBlock}>
              <p className="m-0 text-ink-soft">
                {t.aktuell}
                <strong>{account.email || "-"}</strong>{" "}
                {account.verified ? (
                  <span className="text-success">{t.bestaetigt}</span>
                ) : (
                  <span className="text-warning">{t.unbestaetigt}</span>
                )}
              </p>
              {!account.verified && (
                <>
                  <p className="m-0 text-sm text-ink-muted">{t.keinBericht}</p>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={busy}
                    onClick={() =>
                      void lauf(
                        () => typingBackend().sendeKontoBestaetigung(account.email ?? ""),
                        "mailGeschickt",
                      )
                    }
                  >
                    {t.nochmalSchicken}
                  </button>
                </>
              )}

              <form
                className="space-y-2 border-t border-hairline pt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void lauf(
                    () => typingBackend().adresseAendern(neueAdresse),
                    "linkAnNeue",
                  );
                }}
              >
                <label className="field-label" htmlFor="k-mail">
                  {t.neueAdresse}
                </label>
                <input
                  id="k-mail"
                  type="email"
                  className="field-input"
                  value={neueAdresse}
                  onChange={(e) => setNeueAdresse(e.target.value)}
                  autoComplete="email"
                />
                <p className="m-0 text-sm text-ink-muted">{t.neueAdresseHinweis}</p>
                <button type="submit" className="btn-primary" disabled={busy}>
                  {t.adresseAendern}
                </button>
              </form>
            </Block>

            <Block titel={t.postBlock}>
              {/*
                Abbestellen und wieder einschalten (23.08.2026, Johannes: „sonst
                heisst es, wir sind Spamer"). Der Umschalter ist der ZWEITE Weg;
                der erste ist der Ein-Klick-Link unten in jeder Wochenbericht-
                Mail. Beide setzen dasselbe Feld, und beide gehen in BEIDE
                Richtungen - ein Abbestellen ohne Rückweg wäre eine Falle.

                Gespeichert wird ein AUS-Feld (`mailWeeklyOptOut`), angezeigt
                wird der AN-Zustand. Darum die Umkehrung hier im Häkchen: Ein
                Konto, an dem das Feld nie gesetzt wurde, ist angemeldet.

                Fokus (R5): `aria-disabled` statt `disabled`, die Sperre sitzt
                im Handler. Ein Häkchen, das sich im Augenblick des Umlegens
                selbst sperrt, fällt aus der Fokus-Ordnung - und die
                Braillezeile steht ausgerechnet dann im Nichts, wenn auf die
                Antwort gewartet wird.
              */}
              <label className="flex items-start gap-3">
                <input
                  id="k-woche"
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-[rgb(var(--c-accent))] aria-disabled:opacity-40"
                  checked={!account.mailWeeklyOptOut}
                  aria-disabled={busy}
                  onChange={(e) => {
                    const an = e.target.checked;
                    if (busy) {
                      setMeldung("wirdGespeichert");
                      return;
                    }
                    setBusy(true);
                    setMeldung("");
                    setFehler("");
                    void typingBackend()
                      .setMailWeeklyOptOut(account.id, !an)
                      .then((neu) => {
                        setBusy(false);
                        if (!neu) {
                          setFehler(T.de.nochEinmal);
                          return;
                        }
                        update(neu);
                        setMeldung(an ? "berichtAn" : "berichtAus");
                      });
                  }}
                />
                <span className="text-ink">
                  {t.bericht}
                  <span className="mt-1 block text-sm text-ink-muted">{t.berichtHinweis}</span>
                </span>
              </label>
              {!account.verified && !account.mailWeeklyOptOut && (
                <p className="m-0 text-sm text-ink-muted">{t.berichtUnbestaetigt}</p>
              )}
              <p className="m-0 text-sm text-ink-muted">{t.warnung}</p>
            </Block>

            <Block titel={t.passwortBlock}>
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (neuesPw !== neuesPw2) {
                    setFehler(T.de.ungleich);
                    return;
                  }
                  void lauf(async () => {
                    const r = await typingBackend().passwortAendern(
                      account.id,
                      altesPw,
                      neuesPw,
                    );
                    if (r.ok) {
                      setAltesPw("");
                      setNeuesPw("");
                      setNeuesPw2("");
                    }
                    return r;
                  }, "passwortGeaendert");
                }}
              >
                <label className="field-label" htmlFor="k-pw-alt">
                  {t.bisher}
                </label>
                <input
                  id="k-pw-alt"
                  type="password"
                  className="field-input"
                  value={altesPw}
                  onChange={(e) => setAltesPw(e.target.value)}
                  autoComplete="current-password"
                />
                <label className="field-label" htmlFor="k-pw-neu">
                  {t.neu}
                </label>
                <input
                  id="k-pw-neu"
                  type="password"
                  className="field-input"
                  value={neuesPw}
                  onChange={(e) => setNeuesPw(e.target.value)}
                  autoComplete="new-password"
                />
                <label className="field-label" htmlFor="k-pw-neu2">
                  {t.neuNochmal}
                </label>
                <input
                  id="k-pw-neu2"
                  type="password"
                  className="field-input"
                  value={neuesPw2}
                  onChange={(e) => setNeuesPw2(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="submit" className="btn-primary" disabled={busy}>
                  {t.passwortAendern}
                </button>
              </form>
            </Block>

            <Block titel={t.loeschenBlock}>
              <p className="m-0 text-ink-soft">{t.loeschenSatz}</p>
              {!loeschenOffen ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setLoeschenOffen(true)}
                >
                  {t.loeschenKnopf}
                </button>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-danger"
                    disabled={busy}
                    onClick={() =>
                      void lauf(async () => {
                        const r = await typingBackend().kontoLoeschen(account.id);
                        if (r.ok) logout();
                        return r;
                      }, "kontoGeloescht")
                    }
                  >
                    {t.endgueltig}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setLoeschenOffen(false)}
                  >
                    {t.abbrechen}
                  </button>
                </div>
              )}
            </Block>
          </>
        )}

        {/*
          ★ ABMELDEN gilt für JEDE angemeldete Rolle (08.09.2026). Es stand
          bis heute nur im Zweig der Selbstlernenden - Lehrkräfte und Kinder
          einer Klasse konnten sich von dieser Seite aus nicht abmelden,
          obwohl sie sie jetzt über den Konto-Schalter erreichen.
          `logout()` setzt das Konto im Store selbst auf `null`; das frühere
          `update(null as never)` daneben war ein zweiter Aufruf für dieselbe
          Wirkung und ist weg.
        */}
        {account && (
          <p className="m-0 text-center text-sm">
            <button
              type="button"
              className="text-accent underline underline-offset-2"
              onClick={logout}
            >
              {t.abmelden}
            </button>
          </p>
        )}

        <p className="m-0 text-center text-sm">
          <Link to={hausStartHref()} className="text-accent underline underline-offset-2">
            <span aria-hidden="true">← </span>
            {mitHausName(t.zurLernwerkstatt)}
          </Link>
        </p>
      </div>
      <RechtlichesFusszeile />
    </div>
  );
}
