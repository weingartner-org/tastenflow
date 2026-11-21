import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PublicHeader } from "@/components/PublicHeader";
import { applyTheme } from "@/lib/theme";
import { typingBackend } from "@/lib/typing/backend";
import { tastenflowHref, hausStartHref, mitHausName } from "@/lib/adressen";
import { RechtlichesFusszeile } from "@/components/RechtlichesFusszeile";
import { ServerMeldung } from "@/components/typing/ServerMeldung";
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★★ EN2 (19.09.2026): beide Sprachen nebeneinander. GEMEINSAME Seite - ohne
 * (aktiven) Provider „de", wortgleich wie vorher; englisch nur, wenn man aus
 * Tastenflow kommt (Gruppe B in `TastenflowSprachBereich.tsx`) und die
 * Bedienung dort englisch ist. Glossar §3.9 (*Forgotten your password?*, *reset password*).
 *
 * ⚠️ Ein deutscher Satz war schon vor EN2 schief und bleibt es (Deutsch wird
 * nicht angefasst): „Vergib ein neues Passwort für dein Lehrkraft-Konto.
 * Mindestens 6 Zeichen." steht auch beim Link eines SELBSTLERNENDEN Kontos
 * (`art=konto`, ab 8 Zeichen). Die englische Fassung sagt es richtig.
 */
const T = texte({
  de: {
    vergessen: "Passwort vergessen",
    kontoArt: (schueler: boolean) => (schueler ? "eigenes Konto" : "Lehrkraft-Konto"),
    unterwegs1: (art: string) => ["Wenn ein ", art, " zu", " "],
    unterwegs2:
      " existiert, ist eine E-Mail mit einem Link zum Zurücksetzen unterwegs. Bitte auch den Spam-Ordner prüfen.",
    fuerEigene:
      "Für eigene Konten ohne Klasse (Tastenflow). Gib die E-Mail-Adresse deines Kontos ein.",
    fuerLehrkraefte:
      "Für Lehrkräfte des Braille-Trainers und von »Tastenflow«. Gib die E-Mail-Adresse deines Kontos ein.",
    email: "E-Mail",
    wirdGesendet: "Wird gesendet …",
    anfordern: "Link anfordern",
    zurLernwerkstatt: "Zur Lernwerkstatt",
    festlegen: "Neues Passwort festlegen",
    gesetzt:
      "Dein Passwort ist gesetzt. Du kannst dich jetzt im Trainer mit deiner E-Mail und dem neuen Passwort anmelden.",
    zuPunktgenau: "Zu Punktgenau",
    zuTastenflow: "Zu „Tastenflow\"",
    festlegenSatz: (_schueler: boolean) =>
      "Vergib ein neues Passwort für dein Lehrkraft-Konto. Mindestens 6 Zeichen.",
    neu: "Neues Passwort",
    nochmal: "Passwort wiederholen",
    wirdGespeichert: "Wird gespeichert …",
    speichern: "Passwort speichern",
    // Deutsch gespeichert, übersetzt beim Anzeigen (`ServerMeldung`).
    zuKurz: (min: number) => `Das Passwort muss mindestens ${min} Zeichen lang sein.`,
    ungleich: "Die beiden Passwörter stimmen nicht überein.",
  },
  en: {
    vergessen: "Forgotten your password?",
    kontoArt: (schueler: boolean) => (schueler ? "personal account" : "teacher account"),
    unterwegs1: (art: string) => ["If a ", art, " exists for", " "],
    unterwegs2:
      ", an email with a link to reset the password is on its way. Please check your spam folder too.",
    fuerEigene:
      "For personal accounts without a class (Tastenflow). Enter the email address of your account.",
    fuerLehrkraefte:
      "For teachers using Punktgenau (the braille trainer) or Tastenflow. Enter the email address of your account.",
    email: "Email",
    wirdGesendet: "Sending …",
    anfordern: "Send link",
    zurLernwerkstatt: "Go to Lernwerkstatt",
    festlegen: "Choose a new password",
    gesetzt:
      "Your password has been set. You can now sign in to the app with your email address and the new password.",
    zuPunktgenau: "Go to Punktgenau",
    zuTastenflow: "Go to Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Choose a new password for your account. At least 8 characters."
        : "Choose a new password for your teacher account. At least 6 characters.",
    neu: "New password",
    nochmal: "Repeat password",
    wirdGespeichert: "Saving …",
    speichern: "Save password",
    zuKurz: (min: number) => `The password must be at least ${min} characters long.`,
    ungleich: "The two passwords don't match.",
  },
  // ★ E11a: „tu" durchgehend - wie die deutsche Basis (siehe Kopf-Kommentar).
  fr: {
    vergessen: "Mot de passe oublié",
    kontoArt: (schueler: boolean) => (schueler ? "compte personnel" : "compte enseignant"),
    unterwegs1: (art: string) => ["Si un ", art, " existe pour", " "],
    unterwegs2:
      ", un e-mail avec un lien de réinitialisation est en route - il peut aussi arriver dans le dossier des indésirables.",
    fuerEigene:
      "Pour les comptes personnels sans classe (Tastenflow). Indique l'adresse e-mail de ton compte.",
    fuerLehrkraefte:
      "Pour les enseignants et enseignantes du logiciel braille et de Tastenflow. Indiquez l'adresse e-mail de votre compte.",
    email: "E-mail",
    wirdGesendet: "Envoi en cours …",
    anfordern: "Demander le lien",
    zurLernwerkstatt: "Vers Lernwerkstatt",
    festlegen: "Définir un nouveau mot de passe",
    gesetzt:
      "Le nouveau mot de passe est défini. La connexion fonctionne maintenant avec l'adresse e-mail et ce mot de passe.",
    zuPunktgenau: "Vers Punktgenau",
    zuTastenflow: 'Vers "Tastenflow"',
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Choisis un nouveau mot de passe pour ton compte. Au moins 8 caractères."
        : "Choisissez un nouveau mot de passe pour votre compte enseignant. Au moins 6 caractères.",
    neu: "Nouveau mot de passe",
    nochmal: "Répéter le mot de passe",
    wirdGespeichert: "Enregistrement en cours …",
    speichern: "Enregistrer le mot de passe",
    zuKurz: (min: number) => `Le mot de passe doit compter au moins ${min} caractères.`,
    ungleich: "Les deux mots de passe ne correspondent pas.",
  },
  // ★ ES-O (27.09.2026): Lernende tú, Lehrkräfte usted - wie „fr".
  es: {
    vergessen: "He olvidado la contraseña",
    kontoArt: (schueler: boolean) => (schueler ? "cuenta personal" : "cuenta de docente"),
    unterwegs1: (art: string) => ["Si existe una ", art, " para", " "],
    unterwegs2:
      ", va en camino un correo con un enlace para restablecer la contraseña - también puede llegar a la carpeta de correo no deseado.",
    fuerEigene:
      "Para cuentas personales sin clase (Tastenflow). Indica el correo electrónico de tu cuenta.",
    fuerLehrkraefte:
      "Para docentes del programa de braille y de Tastenflow. Indique el correo electrónico de su cuenta.",
    email: "Correo electrónico",
    wirdGesendet: "Enviando …",
    anfordern: "Pedir el enlace",
    zurLernwerkstatt: "Ir a Lernwerkstatt",
    festlegen: "Fijar una contraseña nueva",
    gesetzt:
      "La contraseña nueva está fijada. Ahora se inicia sesión con el correo electrónico y esta contraseña.",
    zuPunktgenau: "Ir a Punktgenau",
    zuTastenflow: 'Ir a "Tastenflow"',
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Elige una contraseña nueva para tu cuenta. Al menos 8 caracteres."
        : "Elija una contraseña nueva para su cuenta de docente. Al menos 6 caracteres.",
    neu: "Contraseña nueva",
    nochmal: "Repetir la contraseña",
    wirdGespeichert: "Guardando …",
    speichern: "Guardar la contraseña",
    zuKurz: (min: number) => `La contraseña debe tener al menos ${min} caracteres.`,
    ungleich: "Las dos contraseñas no coinciden.",
  },
  // ★ O-IT (02.10.2026): eigenes Konto „tu", Lehrkraft Infinitiv (Glossar Regel 1).
  it: {
    vergessen: "Password dimenticata",
    kontoArt: (schueler: boolean) => (schueler ? "account personale" : "account da insegnante"),
    unterwegs1: (art: string) => ["Se esiste un ", art, " per", " "],
    unterwegs2:
      ", è in arrivo un'email con un link per reimpostare la password. Controllare anche la cartella dello spam.",
    fuerEigene:
      "Per gli account personali senza classe (Tastenflow). Inserisci l'indirizzo email del tuo account.",
    fuerLehrkraefte:
      "Per insegnanti del programma di braille e di Tastenflow. Inserire l'indirizzo email dell'account.",
    email: "Email",
    wirdGesendet: "Invio in corso...",
    anfordern: "Richiedi il link",
    zurLernwerkstatt: "Vai alla Lernwerkstatt",
    festlegen: "Imposta una nuova password",
    gesetzt:
      "La nuova password è impostata. Ora si accede con l'indirizzo email e questa password.",
    zuPunktgenau: "Vai a Punktgenau",
    zuTastenflow: `Vai a "Tastenflow"`,
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Scegli una nuova password per il tuo account. Almeno 8 caratteri."
        : "Scegliere una nuova password per l'account da insegnante. Almeno 6 caratteri.",
    neu: "Nuova password",
    nochmal: "Ripeti la password",
    wirdGespeichert: "Salvataggio in corso...",
    speichern: "Salva la password",
    zuKurz: (min: number) => `La password deve avere almeno ${min} caratteri.`,
    ungleich: "Le due password non coincidono.",
  },
  // ★ O-PL (02.10.2026): ty-Form auch für Lehrkräfte (Glossar Regel 1),
  // „konto prywatne" · „konto dla nauczycieli" (§2.11); Mehrzahl mit vier Formen.
  pl: {
    vergessen: "Nie pamiętasz hasła?",
    kontoArt: (schueler: boolean) => (schueler ? "konto prywatne" : "konto dla nauczycieli"),
    unterwegs1: (art: string) => ["Jeśli istnieje ", art, " dla adresu", " "],
    unterwegs2:
      ", e-mail z linkiem do ustawienia nowego hasła jest już w drodze. Sprawdź też folder ze spamem.",
    fuerEigene:
      "Dla kont prywatnych bez klasy (Tastenflow). Wpisz adres e-mail swojego konta.",
    fuerLehrkraefte:
      "Dla nauczycieli programu do nauki brajla i programu Tastenflow. Wpisz adres e-mail swojego konta.",
    email: "E-mail",
    wirdGesendet: "Wysyłanie...",
    anfordern: "Poproś o link",
    zurLernwerkstatt: "Przejdź do Lernwerkstatt",
    festlegen: "Ustaw nowe hasło",
    gesetzt:
      "Nowe hasło jest ustawione. Teraz możesz się zalogować adresem e-mail i tym hasłem.",
    zuPunktgenau: "Przejdź do programu Punktgenau",
    zuTastenflow: "Przejdź do programu Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Wybierz nowe hasło do swojego konta. Co najmniej 8 znaków."
        : "Wybierz nowe hasło do konta dla nauczycieli. Co najmniej 6 znaków.",
    neu: "Nowe hasło",
    nochmal: "Powtórz hasło",
    wirdGespeichert: "Zapisywanie...",
    speichern: "Zapisz hasło",
    zuKurz: (min: number) =>
      mehrzahl(min, "pl", {
        one: (z) => `Hasło musi mieć co najmniej ${z} znak.`,
        few: (z) => `Hasło musi mieć co najmniej ${z} znaki.`,
        many: (z) => `Hasło musi mieć co najmniej ${z} znaków.`,
        other: (z) => `Hasło musi mieć co najmniej ${z} znaku.`,
      }),
    ungleich: "Hasła nie są identyczne.",
  },
  // ★ O-TR (02.10.2026): eigenes Konto "sen", Lehrkraft "siz" mit -(y)In (Glossar
  // Regel 1); was beide sehen, ohne Anrede. Die Adresse steht hinter "Şu adrese
  // ... varsa:" - nie eine Endung an der Adresse (Regel 6). Nach der Zahl Einzahl.
  tr: {
    vergessen: "Şifremi unuttum",
    kontoArt: (schueler: boolean) => (schueler ? "kişisel hesap" : "öğretmen hesabı"),
    unterwegs1: (art: string) => ["Şu adrese ait bir ", art, " varsa", ": "],
    unterwegs2:
      " - şifreyi sıfırlamak için bağlantı içeren bir e-posta yolda. İstenmeyen e-posta (spam) klasörüne de bakmakta fayda var.",
    fuerEigene:
      "Sınıfa bağlı olmayan kişisel hesaplar için: Tastenflow. Hesabının e-posta adresini gir.",
    fuerLehrkraefte:
      "Punktgenau (Braille programı, Almanca) ve Tastenflow kullanan öğretmenler için. Hesabınızın e-posta adresini girin.",
    email: "E-posta",
    wirdGesendet: "Gönderiliyor...",
    anfordern: "Bağlantı iste",
    zurLernwerkstatt: "Lernwerkstatt sayfasına git",
    festlegen: "Yeni şifre belirle",
    gesetzt:
      "Yeni şifre kaydedildi. Artık e-posta adresi ve bu şifreyle giriş yapılabilir.",
    zuPunktgenau: "Punktgenau programına git",
    zuTastenflow: "Tastenflow programına git",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Hesabın için yeni bir şifre seç. En az 8 karakter."
        : "Öğretmen hesabınız için yeni bir şifre seçin. En az 6 karakter.",
    neu: "Yeni şifre",
    nochmal: "Şifre (tekrar)",
    wirdGespeichert: "Kaydediliyor...",
    speichern: "Şifreyi kaydet",
    zuKurz: (min: number) => `Şifre en az ${min} karakter olmalı.`,
    ungleich: "İki şifre aynı değil.",
  },
  // ★ O-CS (03.10.2026): eigenes Konto "ty", Lehrkraft "vy" (Glossar Regel 1); was
  // beide sehen, ohne Anrede. "Zapomenuté heslo?" (§2.5, nie "Zapomněl/a jsi").
  // Die Adresse steht hinter dem Kopfwort "pro adresu" - ungebeugt (Regel 12).
  // Mehrzahl mit vier Formen (§2.11).
  cs: {
    vergessen: "Zapomenuté heslo?",
    kontoArt: (schueler: boolean) => (schueler ? "osobní účet" : "účet pro vyučující"),
    unterwegs1: (art: string) => ["Pokud existuje ", art, " pro adresu", " "],
    unterwegs2:
      ", je na cestě e-mail s odkazem pro obnovení hesla. Vyplatí se zkontrolovat i složku se spamem.",
    fuerEigene:
      "Pro osobní účty bez třídy: Tastenflow. Zadej e-mailovou adresu svého účtu.",
    fuerLehrkraefte:
      "Pro vyučující programu Punktgenau (Braillovo písmo, v němčině) a programu Tastenflow. Zadejte e-mailovou adresu svého účtu.",
    email: "E-mail",
    wirdGesendet: "Odesílání...",
    anfordern: "Vyžádat odkaz",
    zurLernwerkstatt: "Přejít na Lernwerkstatt",
    festlegen: "Nastavit nové heslo",
    gesetzt:
      "Nové heslo je uložené. Teď se lze přihlásit e-mailovou adresou a tímto heslem.",
    zuPunktgenau: "Přejít do programu Punktgenau",
    zuTastenflow: "Přejít do programu Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Zvol nové heslo pro svůj účet. Nejméně 8 znaků."
        : "Zvolte nové heslo pro svůj účet pro vyučující. Nejméně 6 znaků.",
    neu: "Nové heslo",
    nochmal: "Heslo znovu",
    wirdGespeichert: "Ukládání...",
    speichern: "Uložit heslo",
    zuKurz: (min: number) =>
      mehrzahl(min, "cs", {
        one: (z) => `Heslo musí mít nejméně ${z} znak.`,
        few: (z) => `Heslo musí mít nejméně ${z} znaky.`,
        many: (z) => `Heslo musí mít nejméně ${z} znaku.`,
        other: (z) => `Heslo musí mít nejméně ${z} znaků.`,
      }),
    ungleich: "Hesla se neshodují.",
  },
  bg: {
    vergessen: "Забравена парола?",
    kontoArt: (schueler: boolean) => (schueler ? "собствен акаунт" : "учителски акаунт"),
    unterwegs1: (art: string) => ["Ако съществува ", art, " за адреса", " "],
    unterwegs2:
      ", на път е имейл с връзка за нулиране на паролата. Струва си да се провери и папката за нежелана поща.",
    fuerEigene:
      "За собствени акаунти без клас: Tastenflow. Въведи имейл адреса на акаунта си.",
    fuerLehrkraefte:
      "За учители, които използват Punktgenau (брайлово писмо, на немски) и Tastenflow. Въведете имейл адреса на акаунта си.",
    email: "Имейл",
    wirdGesendet: "Изпращане...",
    anfordern: "Поискай връзка",
    zurLernwerkstatt: "Към Lernwerkstatt",
    festlegen: "Задай нова парола",
    gesetzt:
      "Новата парола е запазена. Вече може да се влезе с имейл адреса и тази парола.",
    zuPunktgenau: "Към Punktgenau",
    zuTastenflow: "Към Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Избери нова парола за акаунта си. Поне 8 знака."
        : "Изберете нова парола за учителския си акаунт. Поне 6 знака.",
    neu: "Нова парола",
    nochmal: "Паролата отново",
    wirdGespeichert: "Записване...",
    speichern: "Запиши паролата",
    zuKurz: (min: number) =>
      mehrzahl(min, "bg", {
        one: (z) => `Паролата трябва да има поне ${z} знак.`,
        other: (z) => `Паролата трябва да има поне ${z} знака.`,
      }),
    ungleich: "Двете пароли не съвпадат.",
  },
  el: {
    vergessen: "Ξέχασες τον κωδικό πρόσβασης;",
    kontoArt: (schueler: boolean) => (schueler ? "προσωπικός λογαριασμός" : "λογαριασμός εκπαιδευτικού"),
    unterwegs1: (art: string) => ["Αν υπάρχει ", art, " για τη διεύθυνση", " "],
    unterwegs2:
      ", έχει σταλεί ένα e-mail με σύνδεσμο για επαναφορά του κωδικού πρόσβασης. Αξίζει έλεγχος και στον φάκελο ανεπιθύμητης αλληλογραφίας.",
    fuerEigene:
      "Για προσωπικούς λογαριασμούς χωρίς τμήμα: Tastenflow (στα Γερμανικά). Γράψε τη διεύθυνση e-mail του λογαριασμού σου.",
    fuerLehrkraefte:
      "Για εκπαιδευτικούς του προγράμματος Punktgenau (γραφή Braille, στα Γερμανικά) και του προγράμματος Tastenflow. Πληκτρολογήστε τη διεύθυνση e-mail του λογαριασμού σας.",
    email: "E-mail",
    wirdGesendet: "Αποστολή...",
    anfordern: "Αποστολή συνδέσμου",
    zurLernwerkstatt: "Μετάβαση στο Lernwerkstatt",
    festlegen: "Ορισμός νέου κωδικού πρόσβασης",
    gesetzt:
      "Ο νέος κωδικός πρόσβασης αποθηκεύτηκε. Τώρα η σύνδεση γίνεται με τη διεύθυνση e-mail και αυτόν τον κωδικό.",
    zuPunktgenau: "Μετάβαση στο Punktgenau",
    zuTastenflow: "Μετάβαση στο Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Διάλεξε νέο κωδικό πρόσβασης για τον λογαριασμό σου. Τουλάχιστον 8 χαρακτήρες."
        : "Επιλέξτε νέο κωδικό πρόσβασης για τον λογαριασμό εκπαιδευτικού σας. Τουλάχιστον 6 χαρακτήρες.",
    neu: "Νέος κωδικός πρόσβασης",
    nochmal: "Επανάληψη κωδικού πρόσβασης",
    wirdGespeichert: "Αποθήκευση...",
    speichern: "Αποθήκευση κωδικού πρόσβασης",
    zuKurz: (min: number) =>
      mehrzahl(min, "el", {
        one: (z) => `Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον ${z} χαρακτήρα.`,
        other: (z) => `Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον ${z} χαρακτήρες.`,
      }),
    ungleich: "Οι δύο κωδικοί πρόσβασης δεν ταιριάζουν.",
  },
  hu: {
    vergessen: "Elfelejtett jelszó?",
    kontoArt: (schueler: boolean) => (schueler ? "saját fiók" : "tanári fiók"),
    unterwegs1: (art: string) => ["Ha létezik ", art, " a következő címhez:", " "],
    unterwegs2:
      ", akkor úton van egy e-mail egy hivatkozással, amellyel a jelszó visszaállítható. Érdemes a levélszemét (spam) mappát is megnézni.",
    fuerEigene:
      "Saját fiókokhoz, osztály nélkül: Tastenflow. Add meg a fiókod e-mail-címét.",
    fuerLehrkraefte:
      "A Punktgenau (Braille-írás, német nyelvű) és a Tastenflow program tanárainak. Adja meg a fiókja e-mail-címét.",
    email: "E-mail",
    wirdGesendet: "Küldés...",
    anfordern: "Hivatkozás kérése",
    zurLernwerkstatt: "Tovább a Lernwerkstatt oldalára",
    festlegen: "Új jelszó megadása",
    gesetzt:
      "Az új jelszó elmentve. Most már be lehet jelentkezni az e-mail-címmel és ezzel a jelszóval.",
    zuPunktgenau: "Tovább a Punktgenau programba",
    zuTastenflow: "Tovább a Tastenflow programba",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Válassz új jelszót a fiókodhoz. Legalább 8 karakter."
        : "Válasszon új jelszót a tanári fiókjához. Legalább 6 karakter.",
    neu: "Új jelszó",
    nochmal: "Jelszó újra",
    wirdGespeichert: "Mentés...",
    speichern: "Jelszó mentése",
    zuKurz: (min: number) =>
      mehrzahl(min, "hu", {
        one: (z) => `A jelszónak legalább ${z} karakterből kell állnia.`,
        other: (z) => `A jelszónak legalább ${z} karakterből kell állnia.`,
      }),
    ungleich: "A két jelszó nem egyezik.",
  },
  nl: {
    vergessen: "Wachtwoord vergeten?",
    kontoArt: (schueler: boolean) => (schueler ? "eigen account" : "account voor leerkrachten"),
    unterwegs1: (art: string) => ["Als er een ", art, " bestaat voor", " "],
    unterwegs2:
      ", is er een e-mail onderweg met een link om het wachtwoord opnieuw in te stellen. Kijk ook in je map met spam.",
    fuerEigene:
      "Voor eigen accounts zonder klas: Tastenflow. Vul het e-mailadres van je account in.",
    fuerLehrkraefte:
      "Voor leerkrachten van Punktgenau (brailleprogramma, in het Duits) en Tastenflow. Vul het e-mailadres van je account in.",
    email: "E-mail",
    wirdGesendet: "Verzenden...",
    anfordern: "Link aanvragen",
    zurLernwerkstatt: "Naar Lernwerkstatt",
    festlegen: "Nieuw wachtwoord instellen",
    gesetzt:
      "Je nieuwe wachtwoord is ingesteld. Je kunt nu inloggen met je e-mailadres en dit wachtwoord.",
    zuPunktgenau: "Naar Punktgenau",
    zuTastenflow: "Naar Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Kies een nieuw wachtwoord voor je account. Minstens 8 tekens."
        : "Kies een nieuw wachtwoord voor je account voor leerkrachten. Minstens 6 tekens.",
    neu: "Nieuw wachtwoord",
    nochmal: "Wachtwoord herhalen",
    wirdGespeichert: "Opslaan...",
    speichern: "Wachtwoord opslaan",
    zuKurz: (min: number) =>
      mehrzahl(min, "nl", {
        one: (z) => `Het wachtwoord moet minstens ${z} teken lang zijn.`,
        other: (z) => `Het wachtwoord moet minstens ${z} tekens lang zijn.`,
      }),
    ungleich: "De twee wachtwoorden zijn niet gelijk.",
  },
  pt: {
    vergessen: "Esqueceu-se da palavra-passe?",
    kontoArt: (schueler: boolean) => (schueler ? "conta pessoal" : "conta de docente"),
    unterwegs1: (art: string) => ["Se existir uma ", art, " para o endereço", " "],
    unterwegs2:
      ", está a caminho um e-mail com uma ligação para repor a palavra-passe. Convém verificar também a pasta de spam.",
    fuerEigene:
      "Para contas pessoais sem turma: Tastenflow. Escreve o endereço de e-mail da tua conta.",
    fuerLehrkraefte:
      "Para docentes do programa Punktgenau (braille, em alemão) e do programa Tastenflow. Escreva o endereço de e-mail da sua conta.",
    email: "E-mail",
    wirdGesendet: "A enviar...",
    anfordern: "Pedir ligação",
    zurLernwerkstatt: "Ir para a Lernwerkstatt",
    festlegen: "Definir nova palavra-passe",
    gesetzt:
      "A nova palavra-passe está guardada. Agora já é possível iniciar sessão com o endereço de e-mail e esta palavra-passe.",
    zuPunktgenau: "Ir para o Punktgenau",
    zuTastenflow: "Ir para o Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Escolhe uma nova palavra-passe para a tua conta. Pelo menos 8 carateres."
        : "Escolha uma nova palavra-passe para a sua conta de docente. Pelo menos 6 carateres.",
    neu: "Nova palavra-passe",
    nochmal: "Repetir palavra-passe",
    wirdGespeichert: "A guardar...",
    speichern: "Guardar palavra-passe",
    zuKurz: (min: number) =>
      mehrzahl(min, "pt", {
        one: (z) => `A palavra-passe tem de ter pelo menos ${z} caráter.`,
        other: (z) => `A palavra-passe tem de ter pelo menos ${z} carateres.`,
      }),
    ungleich: "As palavras-passe não coincidem.",
  },
  br: {
    vergessen: "Esqueceu a senha?",
    kontoArt: (schueler: boolean) => (schueler ? "conta pessoal" : "conta docente"),
    unterwegs1: (art: string) => ["Se existir uma ", art, " para", " "],
    unterwegs2:
      ", um e-mail com um link para redefinir a senha está a caminho. Veja também a pasta de spam.",
    fuerEigene:
      "Para contas pessoais sem turma: Tastenflow. Digite o endereço de e-mail da sua conta.",
    fuerLehrkraefte:
      "Para docentes do aplicativo Punktgenau (braille, em alemão) e do Tastenflow. Digite o endereço de e-mail da sua conta.",
    email: "E-mail",
    wirdGesendet: "Enviando...",
    anfordern: "Pedir link",
    zurLernwerkstatt: "Ir para a Lernwerkstatt",
    festlegen: "Definir nova senha",
    gesetzt:
      "Sua senha foi definida. Agora você pode entrar com seu endereço de e-mail e a nova senha.",
    zuPunktgenau: "Ir para o Punktgenau",
    zuTastenflow: "Ir para o Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Escolha uma nova senha para sua conta. Pelo menos 8 caracteres."
        : "Escolha uma nova senha para sua conta docente. Pelo menos 6 caracteres.",
    neu: "Nova senha",
    nochmal: "Repetir a senha",
    wirdGespeichert: "Salvando...",
    speichern: "Salvar senha",
    zuKurz: (min: number) =>
      mehrzahl(min, "br", {
        one: (z) => `A senha precisa ter pelo menos ${z} caractere.`,
        other: (z) => `A senha precisa ter pelo menos ${z} caracteres.`,
      }),
    ungleich: "As duas senhas não são iguais.",
  },
  ro: {
    vergessen: "Ați uitat parola?",
    kontoArt: (schueler: boolean) => (schueler ? "cont propriu" : "cont pentru cadre didactice"),
    unterwegs1: (art: string) => ["Dacă există un ", art, " pentru adresa", " "],
    unterwegs2:
      ", este pe drum un e-mail cu un link pentru resetarea parolei. Merită verificat și folderul de spam.",
    fuerEigene:
      "Pentru conturi proprii fără clasă: Tastenflow. Scrie adresa de e-mail a contului tău.",
    fuerLehrkraefte:
      "Pentru cadrele didactice care folosesc Punktgenau (scriere braille, în germană) și Tastenflow. Introduceți adresa de e-mail a contului.",
    email: "E-mail",
    wirdGesendet: "Se trimite...",
    anfordern: "Cereți linkul",
    zurLernwerkstatt: "Mergeți la Lernwerkstatt",
    festlegen: "Setați o parolă nouă",
    gesetzt:
      "Parola nouă este salvată. Acum conectarea se face cu adresa de e-mail și cu această parolă.",
    zuPunktgenau: "Mergeți la Punktgenau",
    zuTastenflow: "Mergeți la Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Alege o parolă nouă pentru contul tău. Cel puțin 8 caractere."
        : "Alegeți o parolă nouă pentru contul de cadru didactic. Cel puțin 6 caractere.",
    neu: "Parolă nouă",
    nochmal: "Repetați parola",
    wirdGespeichert: "Se salvează...",
    speichern: "Salvați parola",
    zuKurz: (min: number) =>
      mehrzahl(min, "ro", {
        one: (_z) => "Parola trebuie să aibă cel puțin un caracter.",
        few: (z) => `Parola trebuie să aibă cel puțin ${z} caractere.`,
        other: (z) => `Parola trebuie să aibă cel puțin ${z} de caractere.`,
      }),
    ungleich: "Cele două parole nu coincid.",
  },
  sv: {
    vergessen: "Glömt lösenordet?",
    kontoArt: (schueler: boolean) => (schueler ? "eget konto" : "lärarkonto"),
    unterwegs1: (art: string) => ["Om det finns ett ", art, " för", " "],
    unterwegs2:
      ", har ett e-postmeddelande med en länk för att återställa lösenordet skickats. Kontrollera även skräpposten.",
    fuerEigene:
      "För egna konton utan klass: Tastenflow. Ange e-postadressen för ditt konto.",
    fuerLehrkraefte:
      "För lärare som använder Punktgenau (punktskrift, på tyska) och Tastenflow. Ange e-postadressen för ditt konto.",
    email: "E-post",
    wirdGesendet: "Skickar...",
    anfordern: "Begär länk",
    zurLernwerkstatt: "Gå till Lernwerkstatt",
    festlegen: "Välj ett nytt lösenord",
    gesetzt:
      "Det nya lösenordet är sparat. Nu kan du logga in med din e-postadress och det nya lösenordet.",
    zuPunktgenau: "Gå till Punktgenau",
    zuTastenflow: "Gå till Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Välj ett nytt lösenord för ditt konto. Minst 8 tecken."
        : "Välj ett nytt lösenord för ditt lärarkonto. Minst 6 tecken.",
    neu: "Nytt lösenord",
    nochmal: "Upprepa lösenordet",
    wirdGespeichert: "Sparar...",
    speichern: "Spara lösenordet",
    zuKurz: (min: number) =>
      mehrzahl(min, "sv", {
        one: (z) => `Lösenordet måste ha minst ${z} tecken.`,
        other: (z) => `Lösenordet måste ha minst ${z} tecken.`,
      }),
    ungleich: "De två lösenorden stämmer inte överens.",
  },
  uk: {
    vergessen: "Забутий пароль?",
    kontoArt: (schueler: boolean) => (schueler ? "особистий обліковий запис" : "обліковий запис педагога"),
    unterwegs1: (art: string) => ["Якщо існує ", art, " для адреси", " "],
    unterwegs2:
      ", на неї надіслано лист із посиланням для скидання пароля. Варто перевірити й папку зі спамом.",
    fuerEigene:
      "Для особистих облікових записів без класу: Tastenflow. Введи адресу електронної пошти свого облікового запису.",
    fuerLehrkraefte:
      "Для педагогів, які працюють із програмою Punktgenau (шрифт Брайля, німецькою мовою) і програмою Tastenflow. Введіть адресу електронної пошти свого облікового запису.",
    email: "Електронна пошта",
    wirdGesendet: "Надсилання...",
    anfordern: "Запросити посилання",
    zurLernwerkstatt: "Перейти до Lernwerkstatt",
    festlegen: "Установити новий пароль",
    gesetzt:
      "Новий пароль збережено. Тепер можна увійти за адресою електронної пошти та цим паролем.",
    zuPunktgenau: "Перейти до Punktgenau",
    zuTastenflow: "Перейти до Tastenflow",
    festlegenSatz: (schueler: boolean) =>
      schueler
        ? "Вибери новий пароль для свого облікового запису. Щонайменше 8 знаків."
        : "Виберіть новий пароль для свого облікового запису педагога. Щонайменше 6 знаків.",
    neu: "Новий пароль",
    nochmal: "Повторити пароль",
    wirdGespeichert: "Збереження...",
    speichern: "Зберегти пароль",
    zuKurz: (min: number) =>
      mehrzahl(min, "uk", {
        one: (z) => `Пароль має містити щонайменше ${z} знак.`,
        few: (z) => `Пароль має містити щонайменше ${z} знаки.`,
        many: (z) => `Пароль має містити щонайменше ${z} знаків.`,
        other: (z) => `Пароль має містити щонайменше ${z} знака.`,
      }),
    ungleich: "Паролі не збігаються.",
  },
});

/**
 * Passwort-Zurücksetzen für die LERNPROGRAMM-Lehrkraft-Konten (Tastenflow +
 * Braille — beide nutzen dieselbe tt_teachers-Tabelle). Bewusst getrennt von der
 * LMS-Reset-Seite (`/passwort-zuruecksetzen`, Collection `users`).
 *
 *  - OHNE `?token=`  → E-Mail eingeben, Reset-Link wird angefordert.
 *  - MIT  `?token=…` → Ziel des Links aus der Mail: neues Passwort festlegen.
 *
 * ★ Seit 09.08.2026 zwei Konto-Arten, unterschieden über `?art=`:
 *   `art=konto` = selbstlernendes SCHÜLER-Konto (tt_pupils, Passwort ab 8
 *   Zeichen), sonst LEHRKRAFT (tt_teachers, ab 6). Ohne diesen Zusatz liefe der
 *   Reset eines Schüler-Kontos gegen die falsche Tabelle — der Link aus der Mail
 *   bringt ihn darum mit.
 *
 * Öffentliche Route (kein Login): der Link wird oft auf einem anderen Gerät
 * geöffnet. Das Theme kann per `?theme=light|dark` vorgegeben werden.
 */
export function LernprogrammPasswortPage() {
  const [sp] = useSearchParams();
  const token = (sp.get("token") ?? "").trim();
  const schuelerKonto = (sp.get("art") ?? "") === "konto";
  const themeParam = sp.get("theme");
  useEffect(() => {
    if (themeParam === "light" || themeParam === "dark") applyTheme(themeParam);
  }, [themeParam]);

  return (
    <div className="min-h-screen">
      {/* 05.09.2026: Kopfzeile war nachgebaut - Schalter fest am Fensterrand,
          Marke im Fluss (und dort stand „ensorik"). Jetzt die gemeinsame
          Leiste. */}
      <PublicHeader konto={false} />

      <div className="mx-auto w-full max-w-md px-4 pb-12 pt-10 sm:px-6">
        {token ? (
          <SetForm token={token} schuelerKonto={schuelerKonto} />
        ) : (
          <RequestForm schuelerKonto={schuelerKonto} />
        )}
      </div>
      <RechtlichesFusszeile />
    </div>
  );
}

/** Modus 1 — Reset-Link anfordern. */
function RequestForm({ schuelerKonto }: { schuelerKonto: boolean }) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    // Antwort ist absichtlich immer „verschickt" — verrät nicht, ob es das Konto gibt.
    await (schuelerKonto
      ? typingBackend().requestPupilPasswordReset(email)
      : typingBackend().requestTeacherPasswordReset(email));
    setBusy(false);
    setDone(true);
  }

  return (
    <div className="card space-y-4 p-6">
      <h1 className="text-xl font-semibold tracking-tight text-ink">
        {t.vergessen}
      </h1>
      {done ? (
        <div className="ce-callout ce-callout--success" role="status">
          <p className="m-0">
            {t.unterwegs1(t.kontoArt(schuelerKonto))}
            <strong>{email}</strong>
            {t.unterwegs2}
          </p>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={onSubmit} noValidate>
          <p className="m-0 text-sm text-ink-muted">
            {schuelerKonto ? t.fuerEigene : t.fuerLehrkraefte}
          </p>
          <div>
            <label className="field-label" htmlFor="lp-mail">{t.email}</label>
            <input
              id="lp-mail"
              type="email"
              required
              className="field-input"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? t.wirdGesendet : t.anfordern}
          </button>
        </form>
      )}
      <p className="m-0 text-center text-sm">
        <Link to={hausStartHref()} className="text-accent underline underline-offset-2">
          {mitHausName(t.zurLernwerkstatt)}
        </Link>
      </p>
    </div>
  );
}

/** Modus 2 — Token einlösen, neues Passwort setzen. */
function SetForm({ token, schuelerKonto }: { token: string; schuelerKonto: boolean }) {
  // Schüler-Konten haben die strengere Untergrenze (8 statt 6) — dieselbe wie
  // beim Anlegen; sonst könnte man sie über den Reset unterlaufen.
  const minLaenge = schuelerKonto ? 8 : 6;
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pw.length < minLaenge) {
      setError(T.de.zuKurz(minLaenge));
      return;
    }
    if (pw !== pw2) {
      setError(T.de.ungleich);
      return;
    }
    setBusy(true);
    const r = await (schuelerKonto
      ? typingBackend().confirmPupilPasswordReset(token, pw)
      : typingBackend().confirmTeacherPasswordReset(token, pw));
    setBusy(false);
    if (r.ok) setDone(true);
    else setError(r.error);
  }

  return (
    <div className="card space-y-4 p-6">
      <h1 className="text-xl font-semibold tracking-tight text-ink">
        {t.festlegen}
      </h1>
      {done ? (
        <div className="ce-callout ce-callout--success" role="status">
          <p className="m-0">{t.gesetzt}</p>
          <p className="m-0 mt-3 flex gap-3">
            <Link to="/programme/punktgenau" className="text-accent underline underline-offset-2">
              {t.zuPunktgenau}
            </Link>
            <Link to={tastenflowHref()} className="text-accent underline underline-offset-2">
              {t.zuTastenflow}
            </Link>
          </p>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={onSubmit} noValidate>
          <p className="m-0 text-sm text-ink-muted">{t.festlegenSatz(schuelerKonto)}</p>
          {error && (
            <p role="alert" className="m-0 rounded-xl bg-danger-soft p-3 text-sm text-ink">
              <ServerMeldung text={error} />
            </p>
          )}
          <div>
            <label className="field-label" htmlFor="lp-pw">{t.neu}</label>
            <input
              id="lp-pw"
              type="password"
              required
              minLength={6}
              className="field-input"
              autoComplete="new-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="lp-pw2">{t.nochmal}</label>
            <input
              id="lp-pw2"
              type="password"
              required
              minLength={6}
              className="field-input"
              autoComplete="new-password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? t.wirdGespeichert : t.speichern}
          </button>
        </form>
      )}
    </div>
  );
}
