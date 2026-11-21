/**
 * Passwort-Bedienelemente des Tipptrainers „Tastenflow".
 *
 *  • {@link ChangeOwnPasswordCard} — eigenes Passwort ändern (lernende Person ODER
 *    Lehrkraft): aktuelles Passwort + neues ZWEIMAL (Tippfehler-Schutz). Kinder
 *    werden mit „Du" angesprochen, Lehrkräfte mit „Sie".
 *  • {@link ResetPupilPasswordForm} — Lehrkraft setzt das Passwort eines Kindes
 *    neu (vergessenes Passwort), ohne das alte zu kennen. Sichtbares Feld, damit
 *    die Lehrkraft das neue Passwort dem Kind sagen kann.
 *
 * Siehe [[project_zehnfinger_trainer]], [[feedback_security_first]].
 */
import { useState } from "react";
import type { Result } from "@/lib/typing/account";
import { typingBackend } from "@/lib/typing/backend";
// ★ O-CS (03.10.2026): `mehrzahl` für „aspoň 6 znaků" (vier Formen, Glossar §2.11).
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";
import { Aufklappen } from "@/components/Aufklappen";
import { ServerMeldung } from "./ServerMeldung";

/**
 * ★★ DIE TEXTE DER PASSWORT-MASKEN - beide Sprachen nebeneinander (EN2,
 * 19.09.2026). Deutsch wortgleich wie vorher (Kind „du", Lehrkraft „Sie");
 * Englisch kennt kein Du/Sie - der Ton bleibt je Tonlage ruhig und direkt.
 *
 * ★ Fehlermeldungen werden DEUTSCH gespeichert und beim Anzeigen übersetzt
 * (`ServerMeldung`, Tabelle in `lib/typing/serverMeldungen.ts`) - so geht es
 * mit den eigenen Sätzen genauso wie mit denen vom Server, und ein
 * Sprachwechsel mitten in der Maske übersetzt auch die stehende Meldung.
 */
const T = texte({
  de: {
    alleFelder: "Bitte alle drei Felder ausfüllen.",
    neueUngleich: "Die beiden neuen Passwörter stimmen nicht überein.",
    neuZuKurz: (min: number) => `Das neue Passwort braucht mindestens ${min} Zeichen.`,
    geaendertDu: "Dein Passwort ist geändert.",
    geaendertSie: "Ihr Passwort ist geändert.",
    passwortAendern: "Passwort ändern",
    aktuell: "Aktuelles Passwort",
    neu: "Neues Passwort",
    neuNochmal: "Neues Passwort wiederholen",
    bitteWarten: "Bitte warten …",
    // --- Lehrkraft setzt das Passwort eines Kindes zurück ---
    zuKurz4: "Das neue Passwort braucht mindestens 4 Zeichen.",
    gesetzt: (name: string, pw: string) => `Neues Passwort für „${name}“ gesetzt: ${pw}`,
    zuruecksetzen: "Passwort zurücksetzen",
    zuruecksetzenSatz: (name: string) => [
      "Für ein vergessenes Passwort. Das neue Passwort wird angezeigt - sagen Sie es ",
      name,
      " und es gilt sofort (der alte Zugang gilt dann nicht mehr).",
    ],
    mind4: "mind. 4 Zeichen",
    setzen: "Setzen",
  },
  en: {
    alleFelder: "Please fill in all three fields.",
    neueUngleich: "The two new passwords don't match.",
    neuZuKurz: (min: number) => `The new password needs at least ${min} characters.`,
    geaendertDu: "Your password has been changed.",
    geaendertSie: "Your password has been changed.",
    passwortAendern: "Change password",
    aktuell: "Current password",
    neu: "New password",
    neuNochmal: "Repeat new password",
    bitteWarten: "Please wait …",
    zuKurz4: "The new password needs at least 4 characters.",
    gesetzt: (name: string, pw: string) => `New password for “${name}” set: ${pw}`,
    zuruecksetzen: "Reset password",
    zuruecksetzenSatz: (name: string) => [
      "For a forgotten password. The new password is shown here - tell it to ",
      name,
      " and it works straight away (the old one stops working).",
    ],
    mind4: "at least 4 characters",
    setzen: "Set",
  },
  fr: {
    alleFelder: "Merci de remplir les trois champs.",
    neueUngleich: "Les deux nouveaux mots de passe ne correspondent pas.",
    neuZuKurz: (min: number) => `Le nouveau mot de passe doit compter au moins ${min} caractères.`,
    geaendertDu: "Ton mot de passe est modifié.",
    geaendertSie: "Votre mot de passe est modifié.",
    passwortAendern: "Changer le mot de passe",
    aktuell: "Mot de passe actuel",
    neu: "Nouveau mot de passe",
    neuNochmal: "Répéter le nouveau mot de passe",
    bitteWarten: "Merci de patienter …",
    zuKurz4: "Le nouveau mot de passe doit compter au moins 4 caractères.",
    gesetzt: (name: string, pw: string) => `Nouveau mot de passe défini pour "${name}" : ${pw}`,
    zuruecksetzen: "Réinitialiser le mot de passe",
    zuruecksetzenSatz: (name: string) => [
      "Pour un mot de passe oublié. Le nouveau mot de passe s'affiche - communiquez-le à ",
      name,
      " et il est valable aussitôt (l'ancien ne fonctionne plus).",
    ],
    mind4: "4 caractères min.",
    setzen: "Définir",
  },
  // ★ ES-O (27.09.2026): `geaendertDu` tú, `geaendertSie` und das Zurücksetzen
  // (liest nur die Lehrkraft) usted - wie im Deutschen und Französischen.
  es: {
    alleFelder: "Hay que completar los tres campos.",
    neueUngleich: "Las dos contraseñas nuevas no coinciden.",
    neuZuKurz: (min: number) => `La contraseña nueva debe tener al menos ${min} caracteres.`,
    geaendertDu: "Tu contraseña se ha cambiado.",
    geaendertSie: "Su contraseña se ha cambiado.",
    passwortAendern: "Cambiar la contraseña",
    aktuell: "Contraseña actual",
    neu: "Contraseña nueva",
    neuNochmal: "Repetir la contraseña nueva",
    bitteWarten: "Un momento, por favor …",
    zuKurz4: "La contraseña nueva debe tener al menos 4 caracteres.",
    gesetzt: (name: string, pw: string) => `Nueva contraseña para "${name}": ${pw}`,
    zuruecksetzen: "Restablecer la contraseña",
    zuruecksetzenSatz: (name: string) => [
      "Para una contraseña olvidada. Se muestra la contraseña nueva: comuníquesela a ",
      name,
      " y vale al instante (la anterior deja de funcionar).",
    ],
    mind4: "mín. 4 caracteres",
    setzen: "Establecer",
  },
  it: {
    alleFelder: "Bisogna compilare tutti e tre i campi.",
    neueUngleich: "Le due password nuove non coincidono.",
    neuZuKurz: (min: number) => `La password nuova deve avere almeno ${min} caratteri.`,
    geaendertDu: "La tua password è stata cambiata.",
    geaendertSie: "La password è stata cambiata.",
    passwortAendern: "Cambia la password",
    aktuell: "Password attuale",
    neu: "Password nuova",
    neuNochmal: "Ripeti la password nuova",
    bitteWarten: "Un momento, per favore...",
    zuKurz4: "La password nuova deve avere almeno 4 caratteri.",
    gesetzt: (name: string, pw: string) => `Nuova password per "${name}": ${pw}`,
    zuruecksetzen: "Reimposta la password",
    zuruecksetzenSatz: (name: string) => [
      "Per una password dimenticata. Compare la password nuova: comunicarla a ",
      name,
      " - vale subito (quella vecchia non funziona più).",
    ],
    mind4: "almeno 4 caratteri",
    setzen: "Imposta",
  },
  // ★ O-PL (02.10.2026): ty (Kind) und unpersönlich (Lehrkraft) - „Zapisano"-Stil
  // ohne Geschlecht (Glossar Regel 1/2); Name nur nach Doppelpunkt (Regel 11);
  // „4 znaki" · „6 znaków" (§2.10a).
  pl: {
    alleFelder: "Wypełnij wszystkie trzy pola.",
    neueUngleich: "Dwa nowe hasła nie są takie same.",
    neuZuKurz: (min: number) => `Nowe hasło musi mieć co najmniej ${min} ${znakiPl(min)}.`,
    geaendertDu: "Twoje hasło zostało zmienione.",
    geaendertSie: "Hasło zostało zmienione.",
    passwortAendern: "Zmień hasło",
    aktuell: "Obecne hasło",
    neu: "Nowe hasło",
    neuNochmal: "Powtórz nowe hasło",
    bitteWarten: "Proszę czekać...",
    zuKurz4: "Nowe hasło musi mieć co najmniej 4 znaki.",
    gesetzt: (name: string, pw: string) => `Ustawiono nowe hasło dla: ${name}. Hasło: ${pw}`,
    zuruecksetzen: "Ustaw nowe hasło",
    zuruecksetzenSatz: (name: string) => [
      "Na wypadek zapomnianego hasła. Nowe hasło pojawi się tutaj - przekaż je tej osobie: ",
      name,
      ". Działa od razu (stare hasło przestaje działać).",
    ],
    mind4: "co najmniej 4 znaki",
    setzen: "Ustaw",
  },
  // ★ O-TR (02.10.2026): "şifre" (Glossar §2.5); Kind sen, Lehrkraft siz -(y)In;
  // Sätze, die beide sehen, unpersönlich (Regel 1); Knöpfe als blosser Stamm.
  // Name nie mit Endung: "... için", Doppelpunkt oder Klammer (Regel 6).
  tr: {
    alleFelder: "Üç alanın da doldurulması gerekiyor.",
    neueUngleich: "İki yeni şifre birbirini tutmuyor.",
    neuZuKurz: (min: number) => `Yeni şifre en az ${min} karakter olmalı.`,
    geaendertDu: "Şifren değiştirildi.",
    geaendertSie: "Şifreniz değiştirildi.",
    passwortAendern: "Şifreyi değiştir",
    aktuell: "Mevcut şifre",
    neu: "Yeni şifre",
    neuNochmal: "Yeni şifre (tekrar)",
    bitteWarten: "Bir saniye...",
    zuKurz4: "Yeni şifre en az 4 karakter olmalı.",
    gesetzt: (name: string, pw: string) => `${name} için yeni şifre ayarlandı: ${pw}`,
    zuruecksetzen: "Şifreyi sıfırla",
    zuruecksetzenSatz: (name: string) => [
      "Unutulan şifre için. Yeni şifre burada gösterilir - öğrenciye söyleyin (",
      name,
      "). Hemen geçerli olur; eski şifre artık çalışmaz.",
    ],
    mind4: "en az 4 karakter",
    setzen: "Ayarla",
  },
  // ★ O-CS (03.10.2026): „heslo" (Glossar §2.5); Kind ty, Lehrkraft vy; Sätze, die
  // beide sehen, unpersönlich (Regel 1); ohne Geschlecht („je změněné" am Heslo,
  // Regel 2); Name nur in Klammern oder nach Doppelpunkt (Regel 12); die Zahl mit
  // `mehrzahl` (alle vier Formen, §2.11); Knöpfe im Infinitiv.
  cs: {
    alleFelder: "Je potřeba vyplnit všechna tři pole.",
    neueUngleich: "Obě nová hesla se neshodují.",
    neuZuKurz: (min: number) =>
      mehrzahl(min, "cs", {
        one: (z) => `Nové heslo musí mít aspoň ${z} znak.`,
        few: (z) => `Nové heslo musí mít aspoň ${z} znaky.`,
        many: (z) => `Nové heslo musí mít aspoň ${z} znaku.`,
        other: (z) => `Nové heslo musí mít aspoň ${z} znaků.`,
      }),
    geaendertDu: "Tvoje heslo je změněné.",
    geaendertSie: "Vaše heslo je změněné.",
    passwortAendern: "Změnit heslo",
    aktuell: "Současné heslo",
    neu: "Nové heslo",
    neuNochmal: "Nové heslo znovu",
    bitteWarten: "Chvilku strpení...",
    zuKurz4: "Nové heslo musí mít aspoň 4 znaky.",
    gesetzt: (name: string, pw: string) => `Nové heslo je nastavené (${name}): ${pw}`,
    zuruecksetzen: "Obnovit heslo",
    zuruecksetzenSatz: (name: string) => [
      "Pro zapomenuté heslo. Nové heslo se zobrazí tady - sdělte ho této osobě: ",
      name,
      ". Platí hned (staré heslo pak už neplatí).",
    ],
    mind4: "aspoň 4 znaky",
    setzen: "Nastavit",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      alleFelder: "Трябва да се попълнят и трите полета.",
      neueUngleich: "Двете нови пароли не съвпадат.",
      neuZuKurz: (min: number) => `Новата парола трябва да има поне ${min} знака.`,
      geaendertDu: "Паролата ти е сменена.",
      geaendertSie: "Паролата е сменена.",
      passwortAendern: "Смени паролата",
      aktuell: "Сегашна парола",
      neu: "Нова парола",
      neuNochmal: "Новата парола още веднъж",
      bitteWarten: "Един момент …",
      // --- Lehrkraft setzt das Passwort eines Kindes zurück (Вие-Form) ---
      zuKurz4: "Новата парола трябва да има поне 4 знака.",
      gesetzt: (name: string, pw: string) => `Новата парола за „${name}“ е зададена: ${pw}`,
      zuruecksetzen: "Нулирай паролата",
      zuruecksetzenSatz: (name: string) => [
        "За забравена парола. Новата парола се показва тук - кажете я на ",
        name,
        " и тя важи веднага (старата спира да важи).",
      ],
      mind4: "поне 4 знака",
      setzen: "Задай",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      alleFelder: "Πρέπει να συμπληρωθούν και τα τρία πεδία.",
      neueUngleich: "Οι δύο νέοι κωδικοί πρόσβασης δεν ταιριάζουν.",
      neuZuKurz: (min: number) => `Ο νέος κωδικός πρόσβασης χρειάζεται τουλάχιστον ${min} χαρακτήρες.`,
      geaendertDu: "Ο κωδικός πρόσβασής σου άλλαξε.",
      geaendertSie: "Ο κωδικός πρόσβασής σας άλλαξε.",
      passwortAendern: "Αλλαγή κωδικού πρόσβασης",
      aktuell: "Τρέχων κωδικός πρόσβασης",
      neu: "Νέος κωδικός πρόσβασης",
      neuNochmal: "Επανάληψη νέου κωδικού πρόσβασης",
      bitteWarten: "Μια στιγμή...",
      // --- Lehrkraft setzt das Passwort eines Kindes zurück (εσείς, Glossar Regel 1) ---
      zuKurz4: "Ο νέος κωδικός πρόσβασης χρειάζεται τουλάχιστον 4 χαρακτήρες.",
      gesetzt: (name: string, pw: string) => `Παιδί: ${name}. Νέος κωδικός πρόσβασης: ${pw}`,
      zuruecksetzen: "Επαναφορά κωδικού πρόσβασης",
      zuruecksetzenSatz: (name: string) => [
        "Για ξεχασμένο κωδικό πρόσβασης. Ο νέος κωδικός εμφανίζεται εδώ - πείτε τον στο παιδί (",
        name,
        ") και ισχύει αμέσως (ο παλιός δεν ισχύει πια).",
      ],
      mind4: "τουλάχιστον 4 χαρακτήρες",
      setzen: "Ορισμός",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      alleFelder: "Mind a három mezőt ki kell tölteni.",
      neueUngleich: "A két új jelszó nem egyezik.",
      neuZuKurz: (min: number) => `Az új jelszónak legalább ${min} karakterből kell állnia.`,
      geaendertDu: "Megváltozott a jelszavad.",
      geaendertSie: "A jelszó megváltozott.",
      passwortAendern: "Jelszó módosítása",
      aktuell: "Jelenlegi jelszó",
      neu: "Új jelszó",
      neuNochmal: "Új jelszó még egyszer",
      bitteWarten: "Kis türelmet…",
      zuKurz4: "Az új jelszónak legalább 4 karakterből kell állnia.",
      gesetzt: (name: string, pw: string) => `Új jelszó beállítva. Tanuló: ${name}, jelszó: ${pw}`,
      zuruecksetzen: "Jelszó visszaállítása",
      zuruecksetzenSatz: (name: string) => [
        "Elfelejtett jelszó esetére. Az új jelszó itt megjelenik - mondja meg a tanulónak (",
        name,
        "), és azonnal érvényes (a régi jelszó ezután nem működik).",
      ],
      mind4: "legalább 4 karakter",
      setzen: "Beállítás",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      alleFelder: "Vul alle drie de velden in.",
      neueUngleich: "De twee nieuwe wachtwoorden zijn niet hetzelfde.",
      neuZuKurz: (min: number) => `Het nieuwe wachtwoord moet minstens ${min} tekens hebben.`,
      geaendertDu: "Je wachtwoord is gewijzigd.",
      geaendertSie: "Je wachtwoord is gewijzigd.",
      passwortAendern: "Wachtwoord wijzigen",
      aktuell: "Huidig wachtwoord",
      neu: "Nieuw wachtwoord",
      neuNochmal: "Nieuw wachtwoord herhalen",
      bitteWarten: "Even geduld …",
      zuKurz4: "Het nieuwe wachtwoord moet minstens 4 tekens hebben.",
      gesetzt: (name: string, pw: string) => `Nieuw wachtwoord voor "${name}" ingesteld: ${pw}`,
      zuruecksetzen: "Wachtwoord opnieuw instellen",
      zuruecksetzenSatz: (name: string) => [
        "Voor een vergeten wachtwoord. Het nieuwe wachtwoord verschijnt hier - geef het door aan ",
        name,
        " en het werkt meteen (het oude wachtwoord werkt dan niet meer).",
      ],
      mind4: "minstens 4 tekens",
      setzen: "Instellen",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      alleFelder: "Preenche os três campos.",
      neueUngleich: "As duas palavras-passe novas não coincidem.",
      neuZuKurz: (min: number) => `A nova palavra-passe precisa de pelo menos ${min} carateres.`,
      geaendertDu: "A tua palavra-passe foi alterada.",
      geaendertSie: "A sua palavra-passe foi alterada.",
      passwortAendern: "Alterar a palavra-passe",
      aktuell: "Palavra-passe atual",
      neu: "Nova palavra-passe",
      neuNochmal: "Repetir a nova palavra-passe",
      bitteWarten: "Um momento...",
      // Lehrkraft-Teil: Höflichkeitsform ohne Pronomen (Glossar Regel 1)
      zuKurz4: "A nova palavra-passe precisa de pelo menos 4 carateres.",
      gesetzt: (name: string, pw: string) => `Nova palavra-passe definida para "${name}": ${pw}`,
      zuruecksetzen: "Repor a palavra-passe",
      zuruecksetzenSatz: (name: string) => [
        "Para uma palavra-passe esquecida. A nova palavra-passe aparece aqui - diga-a a ",
        name,
        " e passa a valer de imediato (o acesso antigo deixa de funcionar).",
      ],
      mind4: "pelo menos 4 carateres",
      setzen: "Definir",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      alleFelder: "Preencha os três campos.",
      neueUngleich: "As duas senhas novas não são iguais.",
      neuZuKurz: (min: number) => `A senha nova precisa ter pelo menos ${min} caracteres.`,
      geaendertDu: "Sua senha foi alterada.",
      geaendertSie: "Sua senha foi alterada.",
      passwortAendern: "Alterar senha",
      aktuell: "Senha atual",
      neu: "Senha nova",
      neuNochmal: "Repetir a senha nova",
      bitteWarten: "Aguarde...",
      zuKurz4: "A senha nova precisa ter pelo menos 4 caracteres.",
      gesetzt: (name: string, pw: string) => `Senha nova definida para "${name}": ${pw}`,
      zuruecksetzen: "Redefinir a senha",
      zuruecksetzenSatz: (name: string) => [
        "Para uma senha esquecida. A senha nova aparece aqui - informe a senha para ",
        name,
        " e ela vale na hora (o acesso antigo deixa de funcionar).",
      ],
      mind4: "pelo menos 4 caracteres",
      setzen: "Definir",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      alleFelder: "Toate cele trei câmpuri trebuie completate.",
      neueUngleich: "Cele două parole noi nu sunt identice.",
      neuZuKurz: (min: number) =>
        mehrzahl(min, "ro", {
          one: () => "Parola nouă trebuie să aibă cel puțin un caracter.",
          few: (z) => `Parola nouă trebuie să aibă cel puțin ${z} caractere.`,
          other: (z) => `Parola nouă trebuie să aibă cel puțin ${z} de caractere.`,
        }),
      geaendertDu: "Parola ta a fost schimbată.",
      geaendertSie: "Parola a fost schimbată.",
      passwortAendern: "Schimbați parola",
      aktuell: "Parola actuală",
      neu: "Parola nouă",
      neuNochmal: "Repetați parola nouă",
      bitteWarten: "Un moment …",
      zuKurz4: "Parola nouă trebuie să aibă cel puțin 4 caractere.",
      gesetzt: (name: string, pw: string) => `Parola nouă a fost setată - „${name}”: ${pw}`,
      zuruecksetzen: "Resetați parola",
      zuruecksetzenSatz: (name: string) => [
        "Pentru o parolă uitată. Parola nouă apare aici - spuneți-o persoanei ",
        name,
        " și funcționează imediat (parola veche nu mai funcționează).",
      ],
      mind4: "cel puțin 4 caractere",
      setzen: "Setați",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      alleFelder: "Fyll i alla tre fälten.",
      neueUngleich: "De två nya lösenorden stämmer inte överens.",
      neuZuKurz: (min: number) => `Det nya lösenordet behöver minst ${min} tecken.`,
      geaendertDu: "Ditt lösenord är ändrat.",
      geaendertSie: "Ditt lösenord är ändrat.",
      passwortAendern: "Byt lösenord",
      aktuell: "Nuvarande lösenord",
      neu: "Nytt lösenord",
      neuNochmal: "Upprepa nytt lösenord",
      bitteWarten: "Vänta...",
      zuKurz4: "Det nya lösenordet behöver minst 4 tecken.",
      gesetzt: (name: string, pw: string) => `Nytt lösenord för ${name}: ${pw}`,
      zuruecksetzen: "Återställ lösenordet",
      zuruecksetzenSatz: (name: string) => [
        "För ett glömt lösenord. Det nya lösenordet visas här - säg det till ",
        name,
        " så gäller det direkt (det gamla slutar gälla).",
      ],
      mind4: "minst 4 tecken",
      setzen: "Spara",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      alleFelder: "Потрібно заповнити всі три поля.",
      neueUngleich: "Два нові паролі не збігаються.",
      neuZuKurz: (min: number) =>
        `Новий пароль має містити щонайменше ${mehrzahl(min, "uk", {
          one: (z) => `${z} знак`,
          few: (z) => `${z} знаки`,
          many: (z) => `${z} знаків`,
          other: (z) => `${z} знака`,
        })}.`,
      geaendertDu: "Твій пароль змінено.",
      geaendertSie: "Ваш пароль змінено.",
      passwortAendern: "Змінити пароль",
      aktuell: "Поточний пароль",
      neu: "Новий пароль",
      neuNochmal: "Повторити новий пароль",
      bitteWarten: "Хвилинку...",
      // --- Lehrkraft setzt das Passwort eines Kindes zurück (ви-Form) ---
      zuKurz4: "Новий пароль має містити щонайменше 4 знаки.",
      // Name nur nach Doppelpunkt oder in Klammern, nie gebeugt (Glossar Regel 12).
      gesetzt: (name: string, pw: string) => `Новий пароль установлено. Ім'я: ${name}. Пароль: ${pw}`,
      zuruecksetzen: "Скинути пароль",
      zuruecksetzenSatz: (name: string) => [
        "Якщо пароль забуто. Новий пароль буде показано тут. Повідомте його дитині (",
        name,
        ") - він діє одразу, а старий більше не діє.",
      ],
      mind4: "щонайменше 4 знаки",
      setzen: "Установити",
    },
});

/** ★ O-PL: „znak" nach einer Zahl im Genitiv nach „co najmniej" - 2-4 „znaki", sonst „znaków". */
function znakiPl(n: number): string {
  return new Intl.PluralRules("pl-PL").select(n) === "few" ? "znaki" : "znaków";
}

export function ChangeOwnPasswordCard({
  minLen,
  tone,
  change,
  immerOffen = false,
  onErfolg,
}: {
  /** Mindestlänge des neuen Passworts (Lehrkraft 6, Kind 4). */
  minLen: number;
  tone: "du" | "sie";
  /**
   * Wer das Passwort wirklich ändert. Vorgabe ist der Tastenflow-/Im-Griff-
   * Zugang; Punktgenau und Klangpunkte reichen ihren eigenen durch. So liegt
   * dieselbe Maske in allen vier Apps ([[feedback_platform_parity]]).
   */
  change?: (altesPw: string, neuesPw: string) => Promise<Result<true>>;
  /**
   * ★ Nr 6 der Fokusziele (Johannes' Entscheidung F2, 22.08.2026): Was NACH
   * einem erfolgreichen Wechsel geschieht. Ist der Rückruf gesetzt, meldet die
   * Maske den Erfolg an den Aufrufer, statt eine Erfolgsmeldung stehen zu
   * lassen - in Tastenflow schließt die Seite daraufhin den Dialog, sagt
   * „Passwort geändert." und holt den Fokus in die Eingabezeile.
   *
   * Der Grund: Wer den Dialog aus dem Konto-Menü geöffnet hat, steht danach in
   * einer Maske mit drei geleerten Feldern und einem Knopf, der nichts mehr
   * tut. Ohne Rückruf bleibt es beim bisherigen Verhalten (Meldung in der
   * Maske) - die drei anderen Programme merken von der Änderung nichts.
   */
  onErfolg?: () => void;
  /**
   * Ohne eigenen Aufklapp-Schalter: So steckt die Maske IM Konto-Fenster
   * (seit 10.08.2026), wo der Titel schon darübersteht. Ein zweiter Schalter
   * wäre dort nur eine Hürde mehr.
   */
  immerOffen?: boolean;
}) {
  const [open, setOpen] = useState(immerOffen);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const du = tone === "du";
  const { sprache } = useBedienSprache();
  const t = T[sprache];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    // Was vorher `disabled` am Knopf verhinderte, prüft jetzt der Handler
    // (R5): ohne alle drei Felder passiert nichts, und gesagt wird, warum.
    if (!oldPw || !newPw || !newPw2) {
      setMsg({ ok: false, text: T.de.alleFelder });
      return;
    }
    setMsg(null);
    if (newPw !== newPw2) {
      setMsg({ ok: false, text: T.de.neueUngleich });
      return;
    }
    if (newPw.length < minLen) {
      setMsg({ ok: false, text: T.de.neuZuKurz(minLen) });
      return;
    }
    setBusy(true);
    const r = await (change ?? typingBackend().changeOwnPassword.bind(typingBackend()))(
      oldPw,
      newPw,
    );
    setBusy(false);
    if (r.ok) {
      setOldPw("");
      setNewPw("");
      setNewPw2("");
      if (onErfolg) {
        onErfolg();
        return;
      }
      // Erfolg: gleich in der Sprache der Bedienung (keine Server-Zeile).
      setMsg({ ok: true, text: du ? t.geaendertDu : t.geaendertSie });
    } else {
      setMsg({ ok: false, text: r.error });
    }
  };

  return (
    <div className={immerOffen ? "space-y-2" : "card space-y-2 p-4"}>
      {!immerOffen && (
        <button
          type="button"
          className="flex items-center gap-1.5 text-left text-base font-semibold text-ink"
          aria-expanded={open}
          onClick={() => {
            setOpen((o) => !o);
            setMsg(null);
          }}
        >
          <span aria-hidden className="text-ink-muted">
            {open ? "▾" : "▸"}
          </span>
          <span aria-hidden="true">🔑</span> {t.passwortAendern}
        </button>
      )}
      {/* ★ Bewegung beim Aufklappen (Johannes 19.09.2026): Das Formular wächst
          sichtbar auf, statt auf einen Schlag dazustehen. Mit `immerOffen`
          (im Fenster „Passwort ändern") ist es von Anfang an offen - dort
          bewegt sich nichts. */}
      <Aufklappen offen={open}>
        <form className="space-y-2" onSubmit={submit}>
          <div>
            <label className="field-label" htmlFor="cp-old">
              {t.aktuell}
            </label>
            <input
              id="cp-old"
              type="password"
              className="field-input"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="cp-new">
              {t.neu}
            </label>
            <input
              id="cp-new"
              type="password"
              className="field-input"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="cp-new2">
              {t.neuNochmal}
            </label>
            <input
              id="cp-new2"
              type="password"
              className="field-input"
              value={newPw2}
              onChange={(e) => setNewPw2(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {/*
            ★ R5 (Fokus-Pflicht, 22.08.2026): `aria-disabled` statt `disabled`.
            Diese Stelle war die schlimmste im ganzen Programm: Der Knopf
            sperrte sich beim Abschicken UND blieb danach gesperrt, weil die
            drei Felder geleert werden - der Fokus lag also erst auf `body` und
            hatte anschließend nicht einmal ein Ziel, zu dem er hätte
            zurückkehren können. Jetzt bleibt der Knopf Tabstopp; die Sperre
            gegen Doppel-Auslösung und gegen leere Felder steht in `submit`.
          */}
          <button
            type="submit"
            className="btn-primary aria-disabled:opacity-40"
            aria-disabled={busy || !oldPw || !newPw || !newPw2}
          >
            {busy ? t.bitteWarten : t.passwortAendern}
          </button>
        </form>
      </Aufklappen>
      {msg && (
        <p
          role={msg.ok ? "status" : "alert"}
          className={
            "m-0 rounded-xl p-2 text-sm " +
            (msg.ok ? "bg-success-soft text-ink" : "bg-danger-soft text-ink")
          }
        >
          {msg.ok ? msg.text : <ServerMeldung text={msg.text} />}
        </p>
      )}
    </div>
  );
}

export function ResetPupilPasswordForm({
  pupilName,
  onReset,
}: {
  pupilName: string;
  /** Setzt das neue Passwort (über das Backend) — gibt Erfolg/Fehler zurück. */
  onReset: (newPassword: string) => Promise<Result<true>>;
}) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const { sprache } = useBedienSprache();
  const t = T[sprache];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    // Vorher sperrte `disabled` den Knopf, solange das Feld zu kurz war (R5);
    // jetzt sagt der Handler, was fehlt, statt stumm nichts zu tun.
    if (pw.length < 4) {
      setMsg({ ok: false, text: T.de.zuKurz4 });
      return;
    }
    setBusy(true);
    const r = await onReset(pw);
    setBusy(false);
    if (r.ok) {
      setMsg({ ok: true, text: t.gesetzt(pupilName, pw) });
      setPw("");
    } else {
      setMsg({ ok: false, text: r.error });
    }
  };

  return (
    <form
      className="space-y-2 rounded-lg border border-hairline bg-surface-raised px-3 py-2"
      onSubmit={submit}
    >
      <h3 className="m-0 text-sm font-semibold text-ink">
        {t.zuruecksetzen}
      </h3>
      <p className="m-0 text-sm text-ink-muted">{t.zuruecksetzenSatz(pupilName)}</p>
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label className="field-label" htmlFor={`rp-${pupilName}`}>
            {t.neu}
          </label>
          <input
            id={`rp-${pupilName}`}
            className="field-input w-48"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder={t.mind4}
          />
        </div>
        {/* ★ R5 wie oben - derselbe Knopf-Typ, dieselbe Falle. Die Sperre
            (`busy`, Mindestlänge) steht in `submit`. Diese Maske gehört zu
            »Meine Klassen«; die Regel gilt dort genauso. */}
        <button
          type="submit"
          className="btn-secondary btn-toggle aria-disabled:opacity-40"
          aria-disabled={busy || pw.length < 4}
        >
          {busy ? "…" : t.setzen}
        </button>
      </div>
      {msg && (
        <p
          role={msg.ok ? "status" : "alert"}
          className={
            "m-0 rounded-lg p-2 text-sm " +
            (msg.ok ? "bg-success-soft text-ink" : "bg-danger-soft text-ink")
          }
        >
          {msg.ok ? msg.text : <ServerMeldung text={msg.text} />}
        </p>
      )}
    </form>
  );
}
