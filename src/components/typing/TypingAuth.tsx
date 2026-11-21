/**
 * Anmeldung/Registrierung für den Tipptrainer „Tastenflow" (eigene Konten) —
 * und für »im Griff«, das dasselbe Formular benutzt.
 *
 * Lehrkraft: E-Mail + Passwort (mit Registrierung).
 * Üben: der gemeinsame Baustein `SchuelerAnmeldung` — Klassencode +
 * Name + Passwort (Standardweg, Konten legt die Lehrkraft an) ODER seit
 * 09.08.2026 ein eigenes Konto ohne Klasse (Häkchen „Ich übe allein …",
 * E-Mail + Passwort). Der Wortlaut steht EINMAL in jenem Baustein und gilt so
 * wortgleich in allen vier Programmen.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Result, TypingAccount, getRememberedClassCode } from "@/lib/typing/account";
import { typingBackend } from "@/lib/typing/backend";
// ★ O-IT (02.10.2026): die Startpunkte über `startPunkte` - italienisch beschriftet (letters.ts bleibt unberührt).
import { startPunkte } from "@/lib/typing/startpunkteIt";
import { ansage } from "@/lib/typing/vorlesen";
import { SchuelerAnmeldung } from "@/components/lernwerkstatt/SchuelerAnmeldung";
import { einrichtungTexte } from "@/lib/typing/einrichtung";
import { geburtsjahrAusText } from "@/lib/typing/account";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import { ServerMeldung } from "./ServerMeldung";
import { useBedienStimme } from "./useBedienStimme";
import { useTypingAuth } from "./useTypingAuth";
import { lernwegBeimAnlegen } from "@/lib/typing/lernweg";

/**
 * ★★ DIE TEXTE DES ANMELDE-FENSTERS - beide Sprachen nebeneinander (EN2,
 * 19.09.2026). Deutsch wortgleich wie vorher; Englisch nach Glossar §3.9
 * (*sign in*, *create an account*, *Forgotten your password?*) und §3.8
 * (*Learner | Teacher*).
 *
 * ★ Der Reiter „Lernende" zeigt `SchuelerAnmeldung`
 * (`components/lernwerkstatt/`, gemeinsam mit Punktgenau und Mathecoach). Seit
 * EN6b (19.09.2026) spricht sie selbst die Bedienungssprache (über den
 * Anbieter - die anderen Programme bleiben deutsch). Der `lang="de"`-Block, in
 * dem sie seit EN2 stand, ist darum weg; von hier kommen nur noch die Texte,
 * die Tastenflow ihr hereinreicht (Startpunkte, Geburtsjahr).
 */
const T = texte({
  de: {
    titelNurAnmelden: "Anmelden",
    titel: "Anmelden oder Konto erstellen",
    wer: "Wer meldet sich an?",
    lernende: "Lernende",
    lehrkraft: "Lehrkraft",
    name: "Name",
    nameBeispiel: "z. B. Frau Berger",
    email: "E-Mail",
    passwort: "Passwort",
    passwortNochmal: "Passwort wiederholen",
    bitteWarten: "Bitte warten …",
    anmelden: "Anmelden",
    kontoErstellen: "Konto erstellen",
    neuHier: "Neu hier? ",
    schonKonto: "Schon ein Konto? ",
    zurErstellung: "Zur Konto-Erstellung wechseln",
    zurAnmeldung: "Zur Anmeldung wechseln",
    vergessen: "Passwort vergessen?",
    ohneKonto: "Ohne Konto weiterüben",
    passwoerterUngleich: "Die beiden Passwörter stimmen nicht überein.",
    startpunktLabel: "Womit anfangen?",
    startpunktErklaerung:
      "Was du schon kannst. Die Tasten bis dorthin sind von Anfang an " +
      "frei. Wenn du es nicht weisst, lass es auf Anfänger stehen - " +
      "später kommt immer nur etwas dazu, es wird nie etwas weggenommen.",
  },
  en: {
    titelNurAnmelden: "Sign in",
    titel: "Sign in or create an account",
    wer: "Who is signing in?",
    lernende: "Learner",
    lehrkraft: "Teacher",
    name: "Name",
    nameBeispiel: "e.g. Ms Berger",
    email: "Email",
    passwort: "Password",
    passwortNochmal: "Repeat password",
    bitteWarten: "Please wait …",
    anmelden: "Sign in",
    kontoErstellen: "Create account",
    neuHier: "New here? ",
    schonKonto: "Already have an account? ",
    zurErstellung: "Switch to creating an account",
    zurAnmeldung: "Switch to signing in",
    vergessen: "Forgotten your password?",
    ohneKonto: "Keep practising without an account",
    // Derselbe deutsche Satz steht in `serverMeldungen.ts` - die Anzeige
    // übersetzt ihn dort, egal ob er von hier oder von `SchuelerAnmeldung` kommt.
    passwoerterUngleich: "The two passwords don't match.",
    // EN6b: Glossar §3.4 - „Womit anfangen?" ⇒ *Where do you want to start?*;
    // „Anfänger" ist die erste Stufe von `startPoints("en")` (*Beginner*).
    startpunktLabel: "Where do you want to start?",
    startpunktErklaerung:
      "What you can already do. The keys up to there are unlocked from the " +
      "start. If you're not sure, leave it on Beginner - later on, keys only " +
      "ever get added, nothing is ever taken away.",
  },
  // ★ E11a: Auswahl-Beschriftungen ohne Anrede (beide Rollen); der einzige
  // ganze Satz (startpunktErklaerung) betrifft nur Lernende, darum „tu".
  fr: {
    titelNurAnmelden: "Se connecter",
    titel: "Se connecter ou créer un compte",
    wer: "Qui se connecte ?",
    lernende: "Élève",
    lehrkraft: "Enseignant ou enseignante",
    name: "Nom",
    nameBeispiel: "par ex. Mme Berger",
    email: "E-mail",
    passwort: "Mot de passe",
    passwortNochmal: "Répéter le mot de passe",
    bitteWarten: "Merci de patienter …",
    anmelden: "Se connecter",
    kontoErstellen: "Créer un compte",
    neuHier: "Nouveau ici ? ",
    schonKonto: "Déjà un compte ? ",
    zurErstellung: "Passer à la création de compte",
    zurAnmeldung: "Passer à la connexion",
    vergessen: "Mot de passe oublié ?",
    ohneKonto: "Continuer sans compte",
    passwoerterUngleich: "Les deux mots de passe ne correspondent pas.",
    startpunktLabel: "Par où commencer ?",
    startpunktErklaerung:
      "Ce que tu sais déjà faire. Les touches jusque-là sont libres dès le " +
      "départ. Si tu ne sais pas, laisse Débutant - plus tard, on ajoute " +
      "toujours, on n'enlève jamais.",
  },
  // ★ ES-O (27.09.2026): tú wie „tu" oben; „docente" geschlechtsneutral (S10).
  es: {
    titelNurAnmelden: "Iniciar sesión",
    titel: "Iniciar sesión o crear una cuenta",
    wer: "¿Quién inicia sesión?",
    lernende: "Estudiante",
    lehrkraft: "Docente",
    name: "Nombre",
    nameBeispiel: "p. ej. Sra. García",
    email: "Correo electrónico",
    passwort: "Contraseña",
    passwortNochmal: "Repetir la contraseña",
    bitteWarten: "Un momento, por favor …",
    anmelden: "Iniciar sesión",
    kontoErstellen: "Crear una cuenta",
    neuHier: "¿Primera vez aquí? ",
    schonKonto: "¿Ya tienes cuenta? ",
    zurErstellung: "Ir a crear una cuenta",
    zurAnmeldung: "Ir a iniciar sesión",
    vergessen: "¿Has olvidado la contraseña?",
    ohneKonto: "Seguir sin cuenta",
    passwoerterUngleich: "Las dos contraseñas no coinciden.",
    startpunktLabel: "¿Por dónde empiezo?",
    startpunktErklaerung:
      "Lo que ya sabes hacer. Las teclas hasta ese punto están libres desde el " +
      "principio. Si no lo sabes, deja Principiante - más adelante siempre se " +
      "añade, nunca se quita.",
  },
  // ★ O-IT (02.10.2026): „Accedi", „Crea un account", „Imparo | Insegno" (Glossar §2.5).
  // Der Name des ersten Startpunkts steht in `letters.ts` (Etappe F4) - darum
  // sagt der Satz „il primo punto di partenza" statt eines Namens.
  it: {
    titelNurAnmelden: "Accedi",
    titel: "Accedi o crea un account",
    wer: "Chi accede?",
    lernende: "Imparo",
    lehrkraft: "Insegno",
    name: "Nome",
    nameBeispiel: "ad es. Anna Rossi",
    email: "Indirizzo email",
    passwort: "Password",
    passwortNochmal: "Ripeti la password",
    bitteWarten: "Un momento, per favore...",
    anmelden: "Accedi",
    kontoErstellen: "Crea un account",
    neuHier: "Sei qui per la prima volta? ",
    schonKonto: "Hai già un account? ",
    zurErstellung: "Vai a creare un account",
    zurAnmeldung: "Vai all'accesso",
    vergessen: "Password dimenticata?",
    ohneKonto: "Continua senza account",
    passwoerterUngleich: "Le due password non coincidono.",
    startpunktLabel: "Da dove vuoi iniziare?",
    startpunktErklaerung:
      "Quello che sai già fare. I tasti fino a quel punto sono liberi fin " +
      "dall'inizio. Se non lo sai, lascia il primo punto di partenza - più avanti " +
      "si aggiunge sempre, non si toglie mai.",
  },
  // ★ O-PL (02.10.2026): „Zaloguj się", „Załóż konto", „Uczę się | Uczę",
  // „Pierwszy raz tutaj?", „Nie pamiętasz hasła?", „Ćwicz bez konta" (Glossar
  // §2.5) - alles ohne Geschlecht (Regel 2: 1. Person Präsens, Fragen im Präsens).
  pl: {
    titelNurAnmelden: "Zaloguj się",
    titel: "Zaloguj się albo załóż konto",
    wer: "Kto się loguje?",
    lernende: "Uczę się",
    lehrkraft: "Uczę",
    name: "Imię i nazwisko",
    nameBeispiel: "np. Anna Kowalska",
    email: "Adres e-mail",
    passwort: "Hasło",
    passwortNochmal: "Powtórz hasło",
    bitteWarten: "Proszę czekać...",
    anmelden: "Zaloguj się",
    kontoErstellen: "Załóż konto",
    neuHier: "Pierwszy raz tutaj? ",
    schonKonto: "Masz już konto? ",
    zurErstellung: "Przejdź do zakładania konta",
    zurAnmeldung: "Przejdź do logowania",
    vergessen: "Nie pamiętasz hasła?",
    ohneKonto: "Ćwicz bez konta",
    passwoerterUngleich: "Dwa hasła nie są takie same.",
    startpunktLabel: "Od czego chcesz zacząć?",
    startpunktErklaerung:
      "To, co już umiesz. Klawisze do tego miejsca są dostępne od początku. " +
      "Jeśli nie wiesz, zostaw pierwszy punkt startowy - później zawsze coś " +
      "dochodzi, nigdy nic nie znika.",
  },
  // ★ O-TR (02.10.2026): "Giriş yap", "Hesap oluştur", "Öğrenci | Öğretmen",
  // "İlk kez mi buradasın?", "Şifremi unuttum", "Misafir olarak çalış" (Glossar
  // §2.5); Knöpfe als blosser Stamm (Regel 1); Namensbeispiel ohne Bey/Hanım.
  tr: {
    titelNurAnmelden: "Giriş yap",
    titel: "Giriş yap ya da hesap oluştur",
    wer: "Kim giriş yapıyor?",
    lernende: "Öğrenci",
    lehrkraft: "Öğretmen",
    name: "Ad ve soyad",
    nameBeispiel: "örn. Ayşe Yılmaz",
    email: "E-posta adresi",
    passwort: "Şifre",
    passwortNochmal: "Şifre (tekrar)",
    bitteWarten: "Bir saniye...",
    anmelden: "Giriş yap",
    kontoErstellen: "Hesap oluştur",
    neuHier: "İlk kez mi buradasın? ",
    schonKonto: "Hesabın var mı? ",
    zurErstellung: "Hesap oluşturmaya geç",
    zurAnmeldung: "Giriş ekranına geç",
    vergessen: "Şifremi unuttum",
    ohneKonto: "Misafir olarak çalış",
    passwoerterUngleich: "İki şifre birbirini tutmuyor.",
    startpunktLabel: "Nereden başlamak istersin?",
    startpunktErklaerung:
      "Zaten bildiklerin. Buraya kadarki tuşlar baştan açık olur. Emin " +
      "değilsen ilk başlangıç noktasını bırak - sonradan hep yeni tuşlar " +
      "eklenir, hiçbiri geri alınmaz.",
  },
  // ★ O-CS (03.10.2026): „Přihlásit se", „Vytvořit účet", „Učím se | Učím",
  // „Jsi tu poprvé?", „Zapomenuté heslo?", „Cvičit bez přihlášení" (Glossar
  // §2.5) - alles ohne Geschlecht (Regel 2: kein „Zapomněl jsi", kein „host");
  // Knöpfe im Infinitiv (Regel 1); „Odkud začneš?" (§2.2).
  cs: {
    titelNurAnmelden: "Přihlásit se",
    titel: "Přihlásit se nebo vytvořit účet",
    wer: "Kdo se přihlašuje?",
    lernende: "Učím se",
    lehrkraft: "Učím",
    name: "Jméno a příjmení",
    nameBeispiel: "např. Jana Nováková",
    email: "E-mailová adresa",
    passwort: "Heslo",
    passwortNochmal: "Heslo znovu",
    bitteWarten: "Chvilku strpení...",
    anmelden: "Přihlásit se",
    kontoErstellen: "Vytvořit účet",
    neuHier: "Jsi tu poprvé? ",
    schonKonto: "Už máš účet? ",
    zurErstellung: "Přejít na vytvoření účtu",
    zurAnmeldung: "Přejít na přihlášení",
    vergessen: "Zapomenuté heslo?",
    ohneKonto: "Cvičit bez přihlášení",
    passwoerterUngleich: "Obě hesla se neshodují.",
    startpunktLabel: "Odkud začneš?",
    startpunktErklaerung:
      "To, co už umíš. Klávesy až sem budou volné hned od začátku. Když " +
      "nevíš, nech první výchozí bod - později se vždy jen něco přidá, nikdy " +
      "se nic neubere.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titelNurAnmelden: "Вход",
      titel: "Вход или създаване на акаунт",
      wer: "Кой влиза?",
      // Glossar §2.5: Reiter „Уча | Преподавам" (keine Personenwörter).
      lernende: "Уча",
      lehrkraft: "Преподавам",
      name: "Име",
      nameBeispiel: "напр. г-жа Петрова",
      email: "Имейл адрес",
      passwort: "Парола",
      passwortNochmal: "Паролата още веднъж",
      bitteWarten: "Един момент …",
      anmelden: "Влез",
      kontoErstellen: "Създай акаунт",
      neuHier: "За първи път ли си тук? ",
      schonKonto: "Вече имаш ли акаунт? ",
      zurErstellung: "Към създаването на акаунт",
      zurAnmeldung: "Към входа",
      vergessen: "Забравена парола?",
      ohneKonto: "Упражнявай се без вход",
      passwoerterUngleich: "Двете пароли не съвпадат.",
      // „Anfänger" ist in bg „Съвсем отначало" (`startpunkteBg.ts`, kein Personenwort).
      startpunktLabel: "Откъде започваш?",
      startpunktErklaerung:
        "Какво вече можеш. Клавишите дотам са отключени от самото начало. " +
        "Ако не знаеш, остави „Съвсем отначало“ - после клавиши само се " +
        "добавят, нищо не се отнема.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titelNurAnmelden: "Σύνδεση",
      titel: "Σύνδεση ή δημιουργία λογαριασμού",
      // nicht „Ποιος συνδέεται;" (maskulin) - Glossar §2.12 „Σύνδεση ως: ...".
      wer: "Σύνδεση ως:",
      lernende: "Μαθαίνω",
      lehrkraft: "Διδάσκω",
      name: "Όνομα",
      nameBeispiel: "π.χ. Μαρία Παπαδοπούλου",
      email: "Διεύθυνση e-mail",
      passwort: "Κωδικός πρόσβασης",
      passwortNochmal: "Επανάληψη κωδικού πρόσβασης",
      bitteWarten: "Μια στιγμή...",
      anmelden: "Σύνδεση",
      kontoErstellen: "Δημιουργία λογαριασμού",
      neuHier: "Πρώτη φορά εδώ; ",
      schonKonto: "Έχεις ήδη λογαριασμό; ",
      zurErstellung: "Μετάβαση στη δημιουργία λογαριασμού",
      zurAnmeldung: "Μετάβαση στη σύνδεση",
      vergessen: "Ξέχασες τον κωδικό πρόσβασης;",
      ohneKonto: "Εξάσκηση χωρίς λογαριασμό",
      passwoerterUngleich: "Οι δύο κωδικοί πρόσβασης δεν ταιριάζουν.",
      // „Από την αρχή" ist die erste Stufe von `startpunkteEl.ts`.
      startpunktLabel: "Από πού ξεκινάς;",
      startpunktErklaerung:
        "Τι ξέρεις ήδη. Τα πλήκτρα μέχρι εκεί είναι ανοιχτά από την αρχή. " +
        "Αν δεν ξέρεις, άφησέ το στο «Από την αρχή» - " +
        "αργότερα μόνο προστίθενται πλήκτρα, τίποτα δεν αφαιρείται ποτέ.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titelNurAnmelden: "Bejelentkezés",
      titel: "Bejelentkezés vagy fiók létrehozása",
      wer: "Ki jelentkezik be?",
      lernende: "Tanulok",
      lehrkraft: "Tanítok",
      name: "Név",
      nameBeispiel: "pl. Kovács Kata",
      email: "E-mail-cím",
      passwort: "Jelszó",
      passwortNochmal: "Jelszó még egyszer",
      bitteWarten: "Kis türelmet…",
      anmelden: "Bejelentkezés",
      kontoErstellen: "Fiók létrehozása",
      neuHier: "Új vagy itt? ",
      schonKonto: "Van már fiókod? ",
      zurErstellung: "Váltás a fiók létrehozására",
      zurAnmeldung: "Váltás a bejelentkezésre",
      vergessen: "Elfelejtett jelszó?",
      ohneKonto: "Gyakorlás bejelentkezés nélkül",
      passwoerterUngleich: "A két jelszó nem egyezik.",
      startpunktLabel: "Honnan kezded?",
      startpunktErklaerung:
        "Amit már tudsz. Az addig tartó billentyűk az elejétől fel vannak oldva. " +
        "Ha nem tudod biztosan, hagyd a „Kezdő” beállításon - " +
        "később mindig csak új billentyűk jönnek hozzá, soha semmit nem veszünk el.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titelNurAnmelden: "Inloggen",
      titel: "Inloggen of account aanmaken",
      wer: "Wie logt er in?",
      lernende: "Ik leer",
      lehrkraft: "Ik geef les",
      name: "Naam",
      nameBeispiel: "bijvoorbeeld mevrouw Berger",
      email: "E-mailadres",
      passwort: "Wachtwoord",
      passwortNochmal: "Wachtwoord herhalen",
      bitteWarten: "Even geduld …",
      anmelden: "Inloggen",
      kontoErstellen: "Account aanmaken",
      neuHier: "Nieuw hier? ",
      schonKonto: "Heb je al een account? ",
      zurErstellung: "Naar account aanmaken",
      zurAnmeldung: "Naar inloggen",
      vergessen: "Wachtwoord vergeten?",
      ohneKonto: "Oefenen zonder account",
      passwoerterUngleich: "De twee wachtwoorden zijn niet hetzelfde.",
      startpunktLabel: "Waar wil je beginnen?",
      startpunktErklaerung:
        "Wat je al kunt. De toetsen tot daar zijn vanaf het begin " +
        "vrijgespeeld. Weet je het niet zeker, laat het dan op Beginner staan - " +
        "later komt er alleen iets bij, er wordt nooit iets weggenomen.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titelNurAnmelden: "Iniciar sessão",
      titel: "Iniciar sessão ou criar conta",
      wer: "Quem vai iniciar sessão?",
      lernende: "Aprendo",
      lehrkraft: "Ensino",
      name: "Nome",
      nameBeispiel: "p. ex. Ana Berger",
      email: "E-mail",
      passwort: "Palavra-passe",
      passwortNochmal: "Repetir a palavra-passe",
      bitteWarten: "Um momento...",
      anmelden: "Iniciar sessão",
      kontoErstellen: "Criar conta",
      neuHier: "É a primeira vez? ",
      schonKonto: "Já tens conta? ",
      zurErstellung: "Mudar para criar conta",
      zurAnmeldung: "Mudar para iniciar sessão",
      vergessen: "Esqueceste-te da palavra-passe?",
      ohneKonto: "Praticar sem conta",
      passwoerterUngleich: "As duas palavras-passe não coincidem.",
      startpunktLabel: "Por onde queres começar?",
      startpunktErklaerung:
        "O que já sabes. As teclas até aí ficam desbloqueadas desde o " +
        "início. Se não tiveres a certeza, deixa em \"Só F e J\" - mais tarde " +
        "só se juntam teclas, nunca se tira nenhuma.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titelNurAnmelden: "Entrar",
      titel: "Entrar ou criar conta",
      wer: "Quem vai entrar?",
      lernende: "Aprendo",
      lehrkraft: "Ensino",
      name: "Nome",
      nameBeispiel: "ex.: Ana Berger",
      email: "E-mail",
      passwort: "Senha",
      passwortNochmal: "Repetir a senha",
      bitteWarten: "Aguarde...",
      anmelden: "Entrar",
      kontoErstellen: "Criar conta",
      neuHier: "Primeira vez aqui? ",
      schonKonto: "Já tem uma conta? ",
      zurErstellung: "Ir para a criação de conta",
      zurAnmeldung: "Ir para a entrada",
      vergessen: "Esqueceu a senha?",
      ohneKonto: "Praticar sem conta",
      passwoerterUngleich: "As duas senhas não são iguais.",
      // Glossar §2.12: erste Stufe der Startpunkte heisst „Começo".
      startpunktLabel: "Por onde você quer começar?",
      startpunktErklaerung:
        "O que você já sabe. As teclas até ali ficam desbloqueadas desde o " +
        "início. Se não tiver certeza, deixe em Começo - depois, só entram " +
        "teclas novas, nunca nada é tirado.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titelNurAnmelden: "Conectați-vă",
      titel: "Conectați-vă sau creați un cont",
      wer: "Cine se conectează?",
      lernende: "Învăț",
      lehrkraft: "Predau",
      name: "Nume",
      nameBeispiel: "de ex. doamna Berger",
      email: "Adresa de e-mail",
      passwort: "Parolă",
      passwortNochmal: "Repetați parola",
      bitteWarten: "Un moment …",
      anmelden: "Conectați-vă",
      kontoErstellen: "Creați un cont",
      neuHier: "Prima dată aici? ",
      schonKonto: "Ai deja un cont? ",
      zurErstellung: "Treceți la crearea unui cont",
      zurAnmeldung: "Treceți la conectare",
      vergessen: "Ai uitat parola?",
      ohneKonto: "Exersează fără cont",
      passwoerterUngleich: "Cele două parole nu sunt identice.",
      startpunktLabel: "De unde începi?",
      startpunktErklaerung:
        "Ce știi deja. Tastele până acolo sunt deblocate de la început. " +
        "Dacă nu știi sigur, lasă „De la zero” - mai târziu doar se " +
        "adaugă taste, nu se ia niciodată nimic.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titelNurAnmelden: "Logga in",
      titel: "Logga in eller skapa konto",
      wer: "Vem loggar in?",
      lernende: "Jag lär mig",
      lehrkraft: "Jag undervisar",
      name: "Namn",
      nameBeispiel: "till exempel Eva Berg",
      email: "E-postadress",
      passwort: "Lösenord",
      passwortNochmal: "Upprepa lösenordet",
      bitteWarten: "Vänta...",
      anmelden: "Logga in",
      kontoErstellen: "Skapa konto",
      neuHier: "Ny här? ",
      schonKonto: "Har du redan ett konto? ",
      zurErstellung: "Gå till Skapa konto",
      zurAnmeldung: "Gå till Logga in",
      vergessen: "Glömt lösenordet?",
      ohneKonto: "Öva utan att logga in",
      passwoerterUngleich: "De två lösenorden stämmer inte överens.",
      startpunktLabel: "Var vill du börja?",
      startpunktErklaerung:
        "Det du redan kan. Tangenterna fram till dit är upplåsta från " +
        "början. Om du inte vet, låt det stå på Nybörjare - " +
        "senare läggs det bara till tangenter, inget tas någonsin bort.",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titelNurAnmelden: "Увійти",
      titel: "Увійти або створити обліковий запис",
      wer: "Хто входить?",
      lernende: "Я навчаюся",
      lehrkraft: "Я навчаю",
      name: "Ім'я",
      nameBeispiel: "напр. пані Бойко",
      email: "Електронна пошта",
      passwort: "Пароль",
      passwortNochmal: "Повторити пароль",
      // Für Kind und Lehrkraft gleich: ohne ти/ви (Glossar Regel 1).
      bitteWarten: "Хвилинку...",
      anmelden: "Увійти",
      kontoErstellen: "Створити обліковий запис",
      neuHier: "Тут уперше? ",
      schonKonto: "Уже є обліковий запис? ",
      zurErstellung: "Перейти до створення облікового запису",
      zurAnmeldung: "Перейти до входу",
      // Dieselbe Anmeldung für Kind und Lehrkraft - Glossar §2.5 hat zwei Formen; der Knopf gilt für beide.
      vergessen: "Скинути пароль",
      ohneKonto: "Тренуватися без входу",
      passwoerterUngleich: "Ці два паролі не збігаються.",
      // „Anfänger" ist in uk „Перші кроки" (`startpunkteUk.ts`, kein Personenwort).
      startpunktLabel: "З чого почати?",
      startpunktErklaerung:
        "Що ти вже вмієш. Клавіші до цієї точки відкрито від самого початку. " +
        "Якщо не знаєш, залиш «Перші кроки» - згодом клавіші тільки додаються, " +
        "нічого не забирається.",
    },
});

export function TypingAuth({
  onCancel,
  abbruchText,
  nurAnmelden = false,
  alsKontoSeite = false,
}: {
  onCancel: () => void;
  /**
   * ★★★★ NUR ANMELDEN - keine neuen Konten (Johannes, 28.08.2026: „blende die
   * zwei Wege aus, ja und alleine üben muss auch weg").
   *
   * ⚠️ EIN Schalter für ZWEI Wege, weil es derselbe Gedanke ist: „Ich übe
   * allein" und „Konto erstellen" legen beide ein NEUES Konto an. Im
   * Mathecoach kann ein neues Konto nie etwas sehen - dort hängt jedes Blatt
   * an einer Freischaltung durch Johannes. Beide Wege ständen sichtbar da und
   * führten nirgends hin.
   *
   * ⚠️ „Passwort vergessen?" bleibt - das ist kein neues Konto, sondern der
   * Weg zurück in ein vorhandenes. Genau den braucht, wer nicht hineinkommt.
   */
  nurAnmelden?: boolean;
  /**
   * ★★★ WAS AUF DEM ABBRUCH-SCHALTER STEHT (Johannes, 28.08.2026).
   *
   * ⚠️ „Ohne Konto weiterüben" stimmt in Tastenflow - dort kann man wirklich
   * ohne Konto üben. Im Mathecoach stimmt es NICHT: Ohne Freischaltung gibt es
   * dort kein einziges Blatt. Ein Schalter, der etwas verspricht, das dahinter
   * nicht kommt, ist für ein Kind an der Braillezeile schlimmer als keiner -
   * es drückt ihn, landet woanders und weiss nicht, warum.
   *
   * ★ EN2: Ohne Angabe gilt „Ohne Konto weiterüben" in der Sprache der
   * Bedienung. Wer einen eigenen Text reicht, reicht ihn in seiner Sprache.
   */
  abbruchText?: string;
  /**
   * ★★★ ALS SEITE der Lernwerkstatt-Konto-Seite (`LernwerkstattKontoPage`,
   * 21.09.2026: *„da soll die Erklärung kommen und die Möglichkeit der
   * Anmeldung für alle Apps"*) - zwei Unterschiede zum Einsatz in einem Programm:
   *
   *  1. **Kein Fokus-Sprung beim Öffnen.** Im Programm öffnet der Knopf
   *     „Konto" dieses Formular, und der Fokus MUSS hinein (sonst bleibt der
   *     Screenreader auf dem Knopf stehen). Auf der Konto-Seite ist das
   *     Formular kein Fenster, sondern Teil der Seite: Wer hier ankommt, soll
   *     Überschrift und Erklärung lesen, nicht mitten im Formular landen.
   *  2. **Ohne Geburtsjahr und Startpunkt.** Beide Felder gehören Tastenflow
   *     („Womit anfangen?" nennt Tastenflow-Tasten). Auf einer Seite, die für
   *     ALLE Programme anlegt, wäre das eine Frage, die nur eines von vier
   *     Programmen braucht - eine Datenerhebung ohne Zweck für die anderen drei.
   *     Ohne Angabe legt der Server das Konto mit der Vorgabe an, und
   *     Tastenflow fragt beim ersten Öffnen selbst nach (`Einrichtung`).
   */
  alsKontoSeite?: boolean;
}) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  // ★ E1 (24.09.2026): der Lernweg eines Kontos, das sich hier SELBST anlegt -
  // die Startpunkte sind Anzahlen in ihm (Bauplan englischer Lehrgang §2.4).
  // Ohne Probe-Schalter immer „de", wie bisher.
  const neuerWeg = lernwegBeimAnlegen(sprache);
  const stimme = useBedienStimme();
  const login = useTypingAuth((s) => s.login);
  // Voreinstellung: „Lernende" — das ist die häufigste Anmeldung. Reiter links.
  const [tab, setTab] = useState<"lehrkraft" | "schueler">("schueler");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [teacherMode, setTeacherMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  // Passwort-Bestätigung (nur bei der Konto-Erstellung; Wunsch: zweimal eingeben).
  const [pwConfirm, setPwConfirm] = useState("");

  const handle = (r: Result<TypingAccount>) => {
    if (r.ok) {
      setError("");
      login(r.value);
    } else {
      setError(r.error);
    }
  };

  const run = async (op: () => Promise<Result<TypingAccount>>) => {
    // ★ R5 (22.08.2026): Der Abschick-Knopf sperrt sich NICHT mehr selbst
    // (`aria-disabled` statt `disabled`, siehe unten) - die Sperre gegen
    // Doppel-Auslösung sitzt hier. Damit der Vorgang trotzdem hörbar wird,
    // sagt er sich an: die Beschriftung wechselt zwar auf „Bitte warten …",
    // aber einen Namenswechsel liest keine Sprachausgabe verlässlich vor.
    if (busy) return;
    stimme.sprich(ansage("wirdGesendet", stimme.lang()));
    setBusy(true);
    setError("");
    try {
      handle(await op());
    } finally {
      setBusy(false);
    }
  };

  // Öffnet sich dieses Formular (z. B. über den Knopf „Konto"),
  // bewegt sich der DOM-Fokus sonst nirgendwo hin — Screenreader bleiben auf
  // dem auslösenden Button stehen und erkennen die neuen Felder nicht (NVDA-
  // Test 2026-07-01, wie bei BrailleAuth). Fokus geht auf den aktiven Reiter.
  //
  // ★ Nr 4 der Fokusziele (22.08.2026): `setTimeout(0)` statt eines direkten
  // Aufrufs im Effekt. Der Auslöser („Konto" in der Kopfzeile)
  // bleibt beim Öffnen stehen und behält den Fokus - ein Fokuswechsel im
  // selben Takt kann von ihm überschrieben werden. Ein Takt später steht das
  // Formular sicher im Baum und der Fokus hält
  // ([[feedback_fokus_pflicht_alle_apps]]).
  useEffect(() => {
    if (alsKontoSeite) return;
    const t = window.setTimeout(() => tabRefs.current[tab]?.focus(), 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card mx-auto max-w-md space-y-4 p-6">
      <h2 className="sr-only">{nurAnmelden ? t.titelNurAnmelden : t.titel}</h2>
      {/*
        ★★★ WER sich anmeldet, nicht WAS er tut (Johannes, 01.09.2026).
        Hier stand „Üben" und „Unterrichten" - zwei Tätigkeiten. Gefragt ist
        aber die Person: Ein Kind wählt nicht eine Tätigkeit, es sagt, wer es
        ist. Die beiden Wörter kommen deshalb aus der App selbst („Lehrkraft"
        steht 76-mal im Quelltext, „Lernende" 21-mal) - ein drittes Wortpaar
        hiesse, dass zwei Stellen dieselbe Person verschieden nennen.

        ⚠️ Beide beginnen mit „Le": Auf der Braillezeile sind die ersten zwei
        Zellen gleich, erst ab der dritten trennt es sich (Lern/Lehr).
        Gesprochen sind sie deutlich verschieden. Johannes hat das gegen die
        Alternativen abgewogen und sich bewusst dafür entschieden - wer es
        später ändert, ändert es an DIESER einen Stelle.
      */}
      <div role="group" aria-label={t.wer} className="flex gap-2">
        <button
          type="button"
          ref={(el) => {
            tabRefs.current["schueler"] = el;
          }}
          aria-pressed={tab === "schueler"}
          className={tab === "schueler" ? "btn-primary flex-1" : "btn-secondary flex-1"}
          onClick={() => {
            setTab("schueler");
            setError("");
          }}
        >
          {t.lernende}
        </button>
        <button
          type="button"
          ref={(el) => {
            tabRefs.current["lehrkraft"] = el;
          }}
          aria-pressed={tab === "lehrkraft"}
          className={tab === "lehrkraft" ? "btn-primary flex-1" : "btn-secondary flex-1"}
          onClick={() => {
            setTab("lehrkraft");
            setError("");
          }}
        >
          {t.lehrkraft}
        </button>
      </div>

      {tab === "lehrkraft" ? (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (teacherMode === "register") {
              // Bei der Konto-Erstellung das Passwort zweimal eingeben (Tippfehler-
              // Schutz) — die beiden Eingaben müssen übereinstimmen.
              if (pw !== pwConfirm) {
                // Deutsch gespeichert, übersetzt beim Anzeigen (`ServerMeldung`).
                setError(T.de.passwoerterUngleich);
                return;
              }
              run(() => typingBackend().registerTeacher(name, email, pw));
            } else {
              run(() => typingBackend().loginTeacher(email, pw));
            }
          }}
        >
          {teacherMode === "register" && (
            <div>
              <label className="field-label" htmlFor="t-name">{t.name}</label>
              <input
                id="t-name"
                className="field-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.nameBeispiel}
              />
            </div>
          )}
          <div>
            <label className="field-label" htmlFor="t-mail">{t.email}</label>
            <input
              id="t-mail"
              type="email"
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="t-pw">{t.passwort}</label>
            <input
              id="t-pw"
              type="password"
              className="field-input"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete={teacherMode === "login" ? "current-password" : "new-password"}
            />
          </div>
          {teacherMode === "register" && (
            <div>
              <label className="field-label" htmlFor="t-pw2">
                {t.passwortNochmal}
              </label>
              <input
                id="t-pw2"
                type="password"
                className="field-input"
                value={pwConfirm}
                onChange={(e) => setPwConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}
          {/* ★ R5: `aria-disabled`, kein `disabled` - der Knopf, den man eben
              betätigt hat, darf einem nicht unter dem Fokus wegbrechen. Die
              Sperre gegen Doppel-Auslösung steht in `run`. */}
          <button
            type="submit"
            className="btn-primary w-full aria-disabled:opacity-40"
            aria-disabled={busy}
          >
            {busy ? t.bitteWarten : teacherMode === "login" ? t.anmelden : t.kontoErstellen}
          </button>
          {/* ⚠️ Bei `nurAnmelden` gibt es den Weg zur Konto-Erstellung GAR NICHT -
              nicht ausgegraut, sondern gar nicht (Bauart §3/§4). */}
          {!nurAnmelden && (
          <p className="m-0 text-center text-sm text-ink-muted">
            {teacherMode === "login" ? t.neuHier : t.schonKonto}
            <button
              type="button"
              className="text-accent underline underline-offset-2"
              aria-label={teacherMode === "login" ? t.zurErstellung : t.zurAnmeldung}
              // ★ Nr 23 der Fokusziele (22.08.2026): Der Fokus BLEIBT auf dem
              // Knopf (R3) - er steht ja weiterhin da. Unter ihm tauschen sich
              // aber zwei Felder aus, und das geschah bisher völlig stumm: Wer
              // nicht sieht, weiß nach dem Umschalten nicht, wie viele Felder
              // jetzt über ihm stehen. Darum sagt der Knopf die neue Maske an.
              onClick={() => {
                const neu = teacherMode === "login" ? "register" : "login";
                setTeacherMode(neu);
                setError("");
                setPwConfirm("");
                stimme.sprich(
                  ansage(neu === "register" ? "kontoErstellen" : "anmelden", stimme.lang()),
                );
              }}
            >
              {teacherMode === "login" ? t.kontoErstellen : t.anmelden}
            </button>
          </p>
          )}
          {teacherMode === "login" && (
            <p className="m-0 text-center text-sm">
              <Link
                to="/lernprogramm-passwort"
                className="text-accent underline underline-offset-2"
              >
                {t.vergessen}
              </Link>
            </p>
          )}
        </form>
      ) : (
        <SchuelerAnmeldung
          nurKlassenweg={nurAnmelden}
          busy={busy}
          klassenCode={getRememberedClassCode()}
          onFehlerZuruecksetzen={() => setError("")}
          onLokalerFehler={(t) => setError(t)}
          onKlassenLogin={(c, n, p) => run(() => typingBackend().loginPupil(c, n, p))}
          onSelbstLogin={(mail, p) => run(() => typingBackend().loginPupilSelf(mail, p))}
          mitGeburtsjahr={!alsKontoSeite}
          geburtsjahrErklaerung={einrichtungTexte(sprache).geburtsjahrErklaerung}
          // ★ 30.08.2026: EINE Regel für „ist das ein brauchbares Jahr?".
          //   `geburtsjahrAusText` entscheidet es hier beim Anmelden UND
          //   danach über die Textstufe - eine zweite Prüfung im Formular
          //   liefe irgendwann auseinander.
          geburtsjahrPruefen={geburtsjahrAusText}
          // WOMIT ANFANGEN? (Johannes, 01.09.2026): Wer sich selbst anmeldet,
          // hat keine Lehrkraft, die den Startpunkt setzt - also gibt er ihn
          // hier an. Dieselben Startpunkte wie im Anlege-Formular der Klasse
          // (`startPoints()`), damit nicht zwei Listen auseinanderlaufen.
          // ★ EN6b: die Namen in der Bedienungssprache (`startPoints("en")`) -
          //   dieselben Einheiten, nur anders beschriftet.
          startpunkte={
            alsKontoSeite
              ? undefined
              : startPunkte(sprache, neuerWeg.lernweg).map((sp) => ({
                  units: sp.units,
                  label: sp.label,
                }))
          }
          startpunktLabel={t.startpunktLabel}
          startpunktErklaerung={t.startpunktErklaerung}
          onSelbstRegister={(n, mail, p, jahr, start) =>
            run(() =>
              typingBackend().registerPupilSelf(n, mail, p, jahr, start, neuerWeg.mitgeben),
            )
          }
        />
      )}

      {error && (
        <p role="alert" className="m-0 rounded-xl bg-danger-soft p-3 text-sm text-ink">
          {/* ★ EN2: Server- und Formular-Sätze kommen deutsch; übersetzt wird
              beim Anzeigen (`lib/typing/serverMeldungen.ts`). */}
          <ServerMeldung text={error} />
        </p>
      )}

      <button type="button" className="btn-ghost w-full" onClick={onCancel}>
        {abbruchText ?? t.ohneKonto}
      </button>
    </div>
  );
}
