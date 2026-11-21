/**
 * Die Anmeldung der Lernenden in der Lernwerkstatt — EIN Formular für alle vier
 * Programme (Tastenflow, im Griff, Punktgenau, Klangpunkte).
 *
 * Seit 09.08.2026 gibt es zwei Wege hinein:
 *
 *   1. **Mit Klasse** (der Normalfall, wie bisher): Die Lehrkraft hat das Konto
 *      angelegt; man meldet sich mit Klassencode, Name und Passwort an.
 *   2. **Ohne Klasse** (neu, Wunsch Johannes): Wer allein übt, legt sich selbst
 *      ein Konto an — mit einer echten E-Mail-Adresse statt eines Klassencodes.
 *
 * ── Die fünf Regeln dieser Datei ────────────────────────────────────────────
 *
 * 1. **Der Standardweg bleibt der Standardweg.** Das Häkchen ist AUS, der Fokus
 *    liegt wie bisher, und die Klassen-Felder stehen oben. Wer aus einer Klasse
 *    kommt, merkt von der Neuerung nichts (Johannes: „da das aber weiterhin
 *    nicht der Standardweg ist, ist der Fokus/die Standardauswahl wie bisher").
 *
 * 2. **Ein Häkchen, ein Satz.** „Ich übe allein, ohne Klasse und ohne
 *    Lehrkraft." Darunter steht in einer Zeile, was das bedeutet: keine
 *    Klasse, dafür eine E-Mail-Adresse. Kein Reiter, kein zweiter Dialog —
 *    sonst sucht ein Kind den Weg zurück.
 *
 * 3. **E-Mail statt Klassencode — und der Grund steht dabei.** Die Adresse ist
 *    keine Formalie: Dort kommt der Wochenbericht an, und dorthin geht die
 *    Warnung, bevor ein ruhendes Konto gelöscht wird. Wer nicht weiß, wofür er
 *    etwas hergibt, gibt es zu Recht ungern her.
 *
 * 4. **Die Anmeldung ist NICHT die Einrichtung.** Alter, Sprache, Tastatur und
 *    Ton fragt danach die Einrichtung (Tastenflow) bzw. der Rundgang (im Griff)
 *    — hier steht nur, wer jemand ist.
 *
 * 5. **Diese Datei kennt keinen Server.** Sie bekommt drei Rückrufe und meldet,
 *    was eingegeben wurde; welches Backend das ausführt, entscheidet die App.
 *    So bleibt der Wortlaut in allen vier Programmen wirklich derselbe.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/** Wortlaut des Häkchens — EINE Quelle für alle Apps und für den Wächter-Test. */
export const OHNE_KLASSE_LABEL = "Ich übe allein, ohne Klasse und ohne Lehrkraft";

/** Die Erklärzeile darunter (siehe Regel 3). */
export const OHNE_KLASSE_HINWEIS =
  "Dann brauchst du keinen Klassencode, sondern eine E-Mail-Adresse: Dorthin " +
  "kommt montags dein Wochenbericht, aber nur, wenn du geübt hast.";

/**
 * ★ EN6b (19.09.2026): das Häkchen englisch - Glossar §3.9 (*personal
 * account*: „I'm practising on my own, without a class or teacher"). Dieselben
 * Worte nennt die englische Kinder-Hilfe (`TippenHilfe.en.tsx`, Abschnitt
 * „Practising without a class").
 */
export const OHNE_KLASSE_LABEL_EN = "I'm practising on my own, without a class or teacher";
export const OHNE_KLASSE_HINWEIS_EN =
  "Then you don't need a class code, just an email address: your weekly " +
  "report goes there on Mondays - but only if you've practised.";

/**
 * ★ E11a (25.09.2026): das Häkchen französisch - Glossar §9.2 (*compte
 * personnel*).
 */
export const OHNE_KLASSE_LABEL_FR = "Je m'entraine de mon côté, sans classe";
/** ★ ES-O (27.09.2026): dieselbe Wahl spanisch, tú. */
export const OHNE_KLASSE_LABEL_ES = "Practico por mi cuenta, sin clase";
export const OHNE_KLASSE_HINWEIS_ES =
  "Así no necesitas código de clase, pero sí un correo electrónico: allí llega " +
  "tu resumen semanal los lunes - pero solo después de una semana con práctica.";

/**
 * ★ O-IT (02.10.2026): dieselbe Wahl italienisch, „tu" - Glossar §2.5
 * (*account personale*). Ohne Partizip, damit nichts gegendert ist.
 */
export const OHNE_KLASSE_LABEL_IT = "Mi esercito per conto mio, senza classe";
export const OHNE_KLASSE_HINWEIS_IT =
  "Così non ti serve un codice classe, ma un indirizzo email: lì arriva ogni lunedì " +
  "il tuo resoconto settimanale - ma solo se nella settimana hai fatto esercizio.";

/**
 * ★ O-PL (02.10.2026): dieselbe Wahl polnisch, „ty" - Glossar §2.5 (*konto
 * prywatne*). „samodzielnie" statt „sam/sama": nichts verrät das Geschlecht.
 */
export const OHNE_KLASSE_LABEL_PL = "Ćwiczę samodzielnie, bez klasy";
export const OHNE_KLASSE_HINWEIS_PL =
  "Wtedy nie potrzebujesz kodu klasy, tylko adresu e-mail: w poniedziałki przychodzi " +
  "na niego twoje podsumowanie tygodnia - ale tylko po tygodniu z ćwiczeniami.";

/**
 * ★ O-TR (02.10.2026): dieselbe Wahl türkisch, "sen" - Glossar §2.5 (*kişisel
 * hesap*); derselbe Wortlaut wie in der türkischen Kinder-Hilfe
 * (`TippenHilfe.tr.tsx`, "Sınıfsız çalışmak").
 */
export const OHNE_KLASSE_LABEL_TR = "Sınıfsız, kendi başıma çalışıyorum";
export const OHNE_KLASSE_HINWEIS_TR =
  "O zaman sınıf koduna değil, bir e-posta adresine ihtiyacın var: Haftalık raporun " +
  "her pazartesi oraya gelir - ama yalnızca çalıştığın haftalardan sonra.";

/**
 * ★ O-CS (03.10.2026): dieselbe Wahl tschechisch, "ty" - Glossar §2.5 (*vlastní
 * účet*). "samostatně" statt "sám/sama": nichts verrät das Geschlecht (Regel 2);
 * derselbe Wortlaut wie in der tschechischen Kinder- und Lehrkraft-Hilfe
 * (`TippenHilfe.cs.tsx`, `LehrerHilfe.cs.tsx`).
 */
export const OHNE_KLASSE_LABEL_CS = "Cvičím samostatně, bez třídy";
export const OHNE_KLASSE_HINWEIS_CS =
  "Pak nepotřebuješ kód třídy, ale e-mailovou adresu: tam ti každé pondělí přijde " +
  "týdenní přehled - ale jen po týdnu, ve kterém se cvičilo.";

export const OHNE_KLASSE_HINWEIS_FR =
  "Alors tu n'as pas besoin de code de classe, mais d'une adresse e-mail : ton " +
  "bilan hebdomadaire y arrive le lundi - mais seulement après une semaine avec de l'entrainement.";

// Bulgarisch, ти-Form, ohne Geschlecht (Glossar §2.12 „Упражнявам се самостоятелно, без клас")
const OHNE_KLASSE_LABEL_BG = "Упражнявам се самостоятелно, без клас";
const OHNE_KLASSE_HINWEIS_BG =
  "Тогава не ти трябва код на класа, а имейл адрес: там всеки понеделник ще получаваш " +
  "седмичния отчет - но само след седмица, в която е имало упражнения.";

// Häkchen „ohne Klasse" griechisch - derselbe Wortlaut wie in TippenHilfe.el.tsx.
const OHNE_KLASSE_LABEL_EL = "Εξάσκηση χωρίς τμήμα";
const OHNE_KLASSE_HINWEIS_EL =
  "Τότε δεν χρειάζεσαι κωδικό τμήματος, αλλά μια διεύθυνση e-mail: εκεί σου έρχεται κάθε Δευτέρα " +
  "η εβδομαδιαία αναφορά - αλλά μόνο μετά από μια εβδομάδα με εξάσκηση.";

// ungarisch, Anrede te - derselbe Wortlaut wie in TippenHilfe.hu.tsx
const OHNE_KLASSE_LABEL_HU = "Egyedül gyakorlok, osztály nélkül";
const OHNE_KLASSE_HINWEIS_HU =
  "Ekkor nem osztálykód kell, hanem e-mail-cím: oda érkezik hétfőnként a heti " +
  "összesítőd - de csak olyan hét után, amikor volt gyakorlás.";

const OHNE_KLASSE_LABEL_NL = "Ik oefen zelfstandig, zonder klas";
const OHNE_KLASSE_HINWEIS_NL =
  "Dan heb je geen klascode nodig, maar wel een e-mailadres: daar komt op maandag je " +
  "weekverslag - maar alleen als je hebt geoefend.";

const OHNE_KLASSE_LABEL_PT = "Pratico por conta própria, sem turma";
const OHNE_KLASSE_HINWEIS_PT =
  "Nesse caso, não precisas de código da turma, mas sim de um endereço de e-mail: é para lá que " +
  "vai o teu resumo semanal, à segunda-feira, mas só depois de uma semana com prática.";

const OHNE_KLASSE_LABEL_BR = "Pratico sem turma";
const OHNE_KLASSE_HINWEIS_BR =
  "Nesse caso, você não precisa do código da turma, mas de um endereço de e-mail: para lá vai " +
  "seu resumo semanal às segundas-feiras, mas só depois de uma semana com prática.";

const OHNE_KLASSE_LABEL_RO = "Exersez independent, fără clasă";
const OHNE_KLASSE_HINWEIS_RO =
  "Atunci nu ai nevoie de codul clasei, ci de o adresă de e-mail: acolo primești în fiecare " +
  "luni raportul săptămânal - dar numai după o săptămână în care s-a exersat.";

// Glossar §2.12 („Jag övar på egen hand, utan klass"), Veckorapport wie in den Mails.
const OHNE_KLASSE_LABEL_SV = "Jag övar på egen hand, utan klass";
const OHNE_KLASSE_HINWEIS_SV =
  "Då behöver du ingen klasskod, utan en e-postadress: dit kommer veckorapporten varje " +
  "måndag - men bara efter veckor då du har övat.";

// Dieselben Worte wie TippenHilfe.uk.tsx, Abschnitt zum Üben ohne Klasse.
const OHNE_KLASSE_LABEL_UK = "Тренуюся самостійно, без класу";
const OHNE_KLASSE_HINWEIS_UK =
  "Тоді потрібен не код класу, а адреса електронної пошти: туди щопонеділка приходить " +
  "тижневий звіт - але тільки за ті тижні, коли справді було тренування.";

/**
 * ★★ DIE TEXTE DES FORMULARS in beiden Bedienungssprachen (EN6b, 19.09.2026).
 *
 * ⚠️ GEMEINSAMER TEIL (Punktgenau, Klangpunkte, »Im Griff«, Mathecoach): Die
 * Sprache kommt aus dem Anbieter (`useBedienSprache`), und den gibt es aktiv
 * nur auf den Adressen von Tastenflow - die anderen Programme bekommen „de"
 * und damit Zeichen für Zeichen das Formular von vorher. Deutsch wortgleich.
 *
 * ⚠️ Was über `onLokalerFehler` an die App geht, bleibt DEUTSCH („Die beiden
 * Passwörter …"): Die App zeigt es über `ServerMeldung`, und die übersetzt den
 * deutschen Satz selbst (`lib/typing/serverMeldungen.ts`). Ein englischer Satz
 * dort fände keinen Eintrag und stünde in `lang="de"`.
 *
 * Anrede: Kinder und Selbstlernende mit *you*, kurz und freundlich (Glossar
 * §1.5); die Bitte um das Geburtsjahr ist eine Bitte, kein Vorwurf (§1.4).
 */
const T = texte({
  de: {
    klasse: "Klasse: ",
    andereKlasse: "andere Klasse",
    klassencode: "Klassencode",
    codeBeispiel: "z. B. ABC234",
    deinName: "Dein Name",
    passwort: "Passwort",
    nameBeispiel: "so wirst du begrüßt",
    email: "E-Mail-Adresse",
    mindestens8: "Mindestens 8 Zeichen.",
    passwortNochmal: "Passwort wiederholen",
    geburtsjahr: "Geburtsjahr",
    jahrBeispiel: "z. B. 2016",
    jahrFehlt:
      "Bitte trag noch dein Geburtsjahr ein. Daran erkennt das " +
      "Programm, welche Texte zu dir passen - und es stellt sie " +
      "jedes Jahr neu darauf ein.",
    jahrPasstNicht:
      "Diese Jahreszahl passt nicht. Trag bitte das Jahr ein, in " +
      "dem du geboren bist, mit vier Ziffern - zum Beispiel 2016.",
    nurJahr: " Nur die Jahreszahl wird gespeichert.",
    womitAnfangen: "Womit anfangen?",
    bitteWarten: "Bitte warten …",
    kontoErstellen: "Konto erstellen",
    anmelden: "Anmelden",
    wirdGesendet: "Wird gesendet …",
    ohneKlasseLabel: OHNE_KLASSE_LABEL,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS,
    schonKonto: "Schon ein eigenes Konto? ",
    nochKeinKonto: "Noch kein eigenes Konto? ",
    vergessen: "Passwort vergessen?",
  },
  en: {
    klasse: "Class: ",
    // Der Knopf ersetzt den gemerkten Klassencode durch ein leeres Feld.
    andereKlasse: "change class",
    klassencode: "Class code",
    codeBeispiel: "e.g. ABC234",
    deinName: "Your name",
    passwort: "Password",
    nameBeispiel: "this is what we'll call you",
    email: "Email address",
    mindestens8: "At least 8 characters.",
    passwortNochmal: "Repeat password",
    geburtsjahr: "Year of birth",
    jahrBeispiel: "e.g. 2016",
    jahrFehlt:
      "Please add your year of birth. It tells the app which texts suit " +
      "you - and it adjusts them again every year.",
    jahrPasstNicht:
      "That year doesn't look right. Please type the year you were born " +
      "in, with four digits - for example 2016.",
    nurJahr: " Only the year is saved.",
    // Glossar §3.4: „Womit anfangen?" ⇒ *Where do you want to start?*
    womitAnfangen: "Where do you want to start?",
    bitteWarten: "Please wait …",
    kontoErstellen: "Create account",
    anmelden: "Sign in",
    wirdGesendet: "Sending …",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_EN,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_EN,
    schonKonto: "Already have your own account? ",
    nochKeinKonto: "Don't have your own account yet? ",
    vergessen: "Forgotten your password?",
  },
  fr: {
    klasse: "Classe : ",
    andereKlasse: "changer de classe",
    klassencode: "Code de classe",
    codeBeispiel: "par ex. ABC234",
    deinName: "Ton nom",
    passwort: "Mot de passe",
    nameBeispiel: "c'est ainsi qu'on t'appellera",
    email: "Adresse e-mail",
    mindestens8: "8 caractères minimum.",
    passwortNochmal: "Répéter le mot de passe",
    geburtsjahr: "Année de naissance",
    jahrBeispiel: "par ex. 2016",
    jahrFehlt:
      "Merci d'indiquer aussi ton année de naissance. Le programme sait ainsi " +
      "quels textes te conviennent - et les adapte chaque année.",
    jahrPasstNicht:
      "Cette année ne convient pas. Indique l'année de ta naissance, avec " +
      "quatre chiffres - par exemple 2016.",
    nurJahr: " Seule l'année est enregistrée.",
    womitAnfangen: "Par où commencer ?",
    bitteWarten: "Merci de patienter …",
    kontoErstellen: "Créer un compte",
    anmelden: "Se connecter",
    wirdGesendet: "Envoi en cours …",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_FR,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_FR,
    schonKonto: "Déjà un compte personnel ? ",
    nochKeinKonto: "Pas encore de compte personnel ? ",
    vergessen: "Mot de passe oublié ?",
  },
  // ★ ES-O (27.09.2026): tú (Kinder und Selbstlernende melden sich hier an).
  es: {
    klasse: "Clase: ",
    andereKlasse: "cambiar de clase",
    klassencode: "Código de clase",
    codeBeispiel: "p. ej. ABC234",
    deinName: "Tu nombre",
    passwort: "Contraseña",
    nameBeispiel: "así te llamaremos",
    email: "Correo electrónico",
    mindestens8: "Mínimo 8 caracteres.",
    passwortNochmal: "Repetir la contraseña",
    geburtsjahr: "Año de nacimiento",
    jahrBeispiel: "p. ej. 2016",
    jahrFehlt:
      "Indica también tu año de nacimiento, por favor. Así el programa sabe " +
      "qué textos te van bien - y los adapta cada año.",
    jahrPasstNicht:
      "Ese año no encaja. Indica el año en que naciste, con " +
      "cuatro cifras - por ejemplo 2016.",
    nurJahr: " Solo se guarda el año.",
    womitAnfangen: "¿Por dónde empiezo?",
    bitteWarten: "Un momento, por favor …",
    kontoErstellen: "Crear una cuenta",
    anmelden: "Iniciar sesión",
    wirdGesendet: "Enviando …",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_ES,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_ES,
    schonKonto: "¿Ya tienes una cuenta personal? ",
    nochKeinKonto: "¿Todavía no tienes una cuenta personal? ",
    vergessen: "¿Has olvidado la contraseña?",
  },
  it: {
    klasse: "Classe: ",
    andereKlasse: "cambia classe",
    klassencode: "Codice classe",
    codeBeispiel: "ad es. ABC234",
    deinName: "Il tuo nome",
    passwort: "Password",
    nameBeispiel: "così ti chiameremo",
    email: "Indirizzo email",
    mindestens8: "Almeno 8 caratteri.",
    passwortNochmal: "Ripeti la password",
    geburtsjahr: "Anno di nascita",
    jahrBeispiel: "ad es. 2016",
    jahrFehlt:
      "Scrivi anche il tuo anno di nascita, per favore. Così il programma sa " +
      "quali testi vanno bene per te - e li adatta ogni anno.",
    jahrPasstNicht:
      "Questo anno non va bene. Scrivi l'anno in cui sei nato o nata, con " +
      "quattro cifre - per esempio 2016.",
    nurJahr: " Si salva solo l'anno.",
    womitAnfangen: "Da dove vuoi iniziare?",
    bitteWarten: "Un momento, per favore...",
    kontoErstellen: "Crea un account",
    anmelden: "Accedi",
    wirdGesendet: "Invio in corso...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_IT,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_IT,
    schonKonto: "Hai già un account personale? ",
    nochKeinKonto: "Non hai ancora un account personale? ",
    vergessen: "Password dimenticata?",
  },
  // ★ O-PL (02.10.2026): „ty", kurz; das Geburtsjahr ohne Satz über die Person
  // („w którym się urodziłeś" verriete das Geschlecht).
  pl: {
    klasse: "Klasa: ",
    andereKlasse: "inna klasa",
    klassencode: "Kod klasy",
    codeBeispiel: "np. ABC234",
    deinName: "Twoje imię",
    passwort: "Hasło",
    nameBeispiel: "tak będziemy cię witać",
    email: "Adres e-mail",
    mindestens8: "Co najmniej 8 znaków.",
    passwortNochmal: "Powtórz hasło",
    geburtsjahr: "Rok urodzenia",
    jahrBeispiel: "np. 2016",
    jahrFehlt:
      "Wpisz jeszcze swój rok urodzenia. Po nim program poznaje, które teksty " +
      "do ciebie pasują - i co roku dopasowuje je na nowo.",
    jahrPasstNicht:
      "Ten rok się nie zgadza. Wpisz swój rok urodzenia czterema cyframi - " +
      "na przykład 2016.",
    nurJahr: " Zapisywany jest tylko rok.",
    womitAnfangen: "Od czego chcesz zacząć?",
    bitteWarten: "Chwileczkę...",
    kontoErstellen: "Załóż konto",
    anmelden: "Zaloguj się",
    wirdGesendet: "Wysyłanie...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_PL,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_PL,
    schonKonto: "Masz już konto prywatne? ",
    nochKeinKonto: "Nie masz jeszcze konta prywatnego? ",
    vergessen: "Nie pamiętasz hasła?",
  },
  // ★ O-TR (02.10.2026): Kinder und Selbstlernende "sen" (Glossar Regel 1),
  // "Giriş yap", "Hesap oluştur", "Şifremi unuttum" (§2.5); Startpunkt-Frage §2.2.
  tr: {
    klasse: "Sınıf: ",
    andereKlasse: "başka sınıf",
    klassencode: "Sınıf kodu",
    codeBeispiel: "örn. ABC234",
    deinName: "Adın",
    passwort: "Şifre",
    nameBeispiel: "seni bu adla selamlarız",
    email: "E-posta adresi",
    mindestens8: "En az 8 karakter.",
    passwortNochmal: "Şifre (tekrar)",
    geburtsjahr: "Doğum yılı",
    jahrBeispiel: "örn. 2016",
    jahrFehlt:
      "Doğum yılını da yaz. Program buna göre sana uygun metinleri " +
      "bulur - ve onları her yıl yeniden ayarlar.",
    jahrPasstNicht:
      "Bu yıl uygun görünmüyor. Doğduğun yılı dört rakamla yaz - " +
      "örneğin 2016.",
    nurJahr: " Yalnızca yıl kaydedilir.",
    womitAnfangen: "Nereden başlamak istersin?",
    bitteWarten: "Bir saniye...",
    kontoErstellen: "Hesap oluştur",
    anmelden: "Giriş yap",
    wirdGesendet: "Gönderiliyor...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_TR,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_TR,
    schonKonto: "Kişisel hesabın var mı? ",
    nochKeinKonto: "Henüz kişisel hesabın yok mu? ",
    vergessen: "Şifremi unuttum",
  },
  // ★ O-CS (03.10.2026): Kinder und Selbstlernende "ty" (Glossar Regel 1),
  // "Přihlásit se", "Vytvořit účet", "Zapomenuté heslo?" (§2.5); Startpunkt-Frage
  // "Odkud začneš?" (§2.2). Keine Vergangenheit über das Kind ("kdy ses narodil"
  // verriete das Geschlecht, Regel 2); kein Satz endet mit Zahl und Punkt (Regel 13).
  cs: {
    klasse: "Třída: ",
    andereKlasse: "jiná třída",
    klassencode: "Kód třídy",
    codeBeispiel: "např. ABC234",
    deinName: "Tvoje jméno",
    passwort: "Heslo",
    nameBeispiel: "takhle tě pozdravíme",
    email: "E-mailová adresa",
    mindestens8: "Nejméně 8 znaků.",
    passwortNochmal: "Heslo znovu",
    geburtsjahr: "Rok narození",
    jahrBeispiel: "např. 2016",
    jahrFehlt:
      "Doplň prosím ještě rok narození. Podle něj program pozná, které texty " +
      "se k tobě hodí - a každý rok je podle toho znovu nastaví.",
    jahrPasstNicht:
      "Tento rok nesedí. Napiš prosím rok narození, třeba 2016, " +
      "čtyřmi číslicemi.",
    nurJahr: " Uloží se jen rok.",
    womitAnfangen: "Odkud začneš?",
    bitteWarten: "Okamžik...",
    kontoErstellen: "Vytvořit účet",
    anmelden: "Přihlásit se",
    wirdGesendet: "Odesílání...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_CS,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_CS,
    schonKonto: "Už máš vlastní účet? ",
    nochKeinKonto: "Ještě nemáš vlastní účet? ",
    vergessen: "Zapomenuté heslo?",
  },
  bg: {
    klasse: "Клас: ",
    andereKlasse: "друг клас",
    klassencode: "Код на класа",
    codeBeispiel: "напр. ABC234",
    deinName: "Твоето име",
    passwort: "Парола",
    nameBeispiel: "така ще те поздравяваме",
    email: "Имейл адрес",
    mindestens8: "Поне 8 знака.",
    passwortNochmal: "Паролата още веднъж",
    geburtsjahr: "Година на раждане",
    jahrBeispiel: "напр. 2016",
    jahrFehlt:
      "Добави и годината на раждане. По нея програмата разбира кои текстове " +
      "са подходящи за теб - и всяка година ги нагласява отново.",
    jahrPasstNicht:
      "Тази година не изглежда правилна. Напиши годината на раждане " +
      "с четири цифри, например 2016.",
    nurJahr: " Записва се само годината.",
    womitAnfangen: "Откъде започваш?",
    bitteWarten: "Момент...",
    kontoErstellen: "Създай акаунт",
    anmelden: "Влез",
    wirdGesendet: "Изпращане...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_BG,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_BG,
    schonKonto: "Вече имаш ли собствен акаунт? ",
    nochKeinKonto: "Още нямаш собствен акаунт? ",
    vergessen: "Забравена парола?",
  },
  el: {
    klasse: "Τμήμα: ",
    andereKlasse: "άλλο τμήμα",
    klassencode: "Κωδικός τμήματος",
    codeBeispiel: "π.χ. ABC234",
    deinName: "Το όνομά σου",
    passwort: "Κωδικός πρόσβασης",
    nameBeispiel: "έτσι θα σε χαιρετάμε",
    email: "Διεύθυνση e-mail",
    mindestens8: "Τουλάχιστον 8 χαρακτήρες.",
    passwortNochmal: "Κωδικός πρόσβασης ξανά",
    geburtsjahr: "Έτος γέννησης",
    jahrBeispiel: "π.χ. 2016",
    jahrFehlt:
      "Συμπλήρωσε ακόμα το έτος γέννησής σου. Από αυτό το πρόγραμμα καταλαβαίνει ποια κείμενα " +
      "σου ταιριάζουν - και κάθε χρόνο τα προσαρμόζει ξανά.",
    jahrPasstNicht:
      "Αυτό το έτος δεν ταιριάζει. Γράψε το έτος που γεννήθηκες, με τέσσερα ψηφία - " +
      "για παράδειγμα 2016.",
    nurJahr: " Αποθηκεύεται μόνο το έτος.",
    womitAnfangen: "Από πού ξεκινάς;",
    bitteWarten: "Μια στιγμή...",
    kontoErstellen: "Δημιουργία λογαριασμού",
    anmelden: "Σύνδεση",
    wirdGesendet: "Αποστολή...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_EL,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_EL,
    schonKonto: "Έχεις ήδη δικό σου λογαριασμό; ",
    nochKeinKonto: "Δεν έχεις ακόμα δικό σου λογαριασμό; ",
    vergessen: "Ξέχασες τον κωδικό πρόσβασης;",
  },
  hu: {
    klasse: "Osztály: ",
    andereKlasse: "másik osztály",
    klassencode: "Osztálykód",
    codeBeispiel: "pl. ABC234",
    deinName: "A neved",
    passwort: "Jelszó",
    nameBeispiel: "így köszöntünk",
    email: "E-mail-cím",
    mindestens8: "Legalább 8 karakter.",
    passwortNochmal: "Jelszó újra",
    geburtsjahr: "Születési év",
    jahrBeispiel: "pl. 2016",
    jahrFehlt:
      "Írd be még a születési évedet. Ebből tudja a program, milyen szövegek " +
      "illenek hozzád - és minden évben újra beállítja őket.",
    jahrPasstNicht:
      "Ez az évszám nem illik ide. Írd be a születési évedet négy számjeggyel, " +
      "például így: 2016.",
    nurJahr: " Csak az évszámot mentjük.",
    womitAnfangen: "Honnan kezded?",
    bitteWarten: "Egy pillanat...",
    kontoErstellen: "Fiók létrehozása",
    anmelden: "Bejelentkezés",
    wirdGesendet: "Küldés...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_HU,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_HU,
    schonKonto: "Van már saját fiókod? ",
    nochKeinKonto: "Még nincs saját fiókod? ",
    vergessen: "Elfelejtett jelszó?",
  },
  nl: {
    klasse: "Klas: ",
    andereKlasse: "andere klas",
    klassencode: "Klascode",
    codeBeispiel: "bijvoorbeeld ABC234",
    deinName: "Jouw naam",
    passwort: "Wachtwoord",
    nameBeispiel: "zo begroeten we je",
    email: "E-mailadres",
    mindestens8: "Minstens 8 tekens.",
    passwortNochmal: "Wachtwoord herhalen",
    geburtsjahr: "Geboortejaar",
    jahrBeispiel: "bijvoorbeeld 2016",
    jahrFehlt:
      "Vul nog je geboortejaar in. Daaraan ziet het programma welke teksten bij je passen - " +
      "en het stelt ze elk jaar opnieuw in.",
    jahrPasstNicht:
      "Dit jaartal klopt niet. Vul het jaar in waarin je bent geboren, met vier cijfers - " +
      "bijvoorbeeld 2016.",
    nurJahr: " Alleen het jaartal wordt opgeslagen.",
    womitAnfangen: "Waar wil je beginnen?",
    bitteWarten: "Even geduld...",
    kontoErstellen: "Account aanmaken",
    anmelden: "Inloggen",
    wirdGesendet: "Wordt verzonden...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_NL,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_NL,
    schonKonto: "Heb je al een eigen account? ",
    nochKeinKonto: "Heb je nog geen eigen account? ",
    vergessen: "Wachtwoord vergeten?",
  },
  pt: {
    klasse: "Turma: ",
    andereKlasse: "outra turma",
    klassencode: "Código da turma",
    codeBeispiel: "p. ex., ABC234",
    deinName: "O teu nome",
    passwort: "Palavra-passe",
    nameBeispiel: "é assim que te cumprimentamos",
    email: "Endereço de e-mail",
    mindestens8: "Pelo menos 8 carateres.",
    passwortNochmal: "Repetir a palavra-passe",
    geburtsjahr: "Ano de nascimento",
    jahrBeispiel: "p. ex., 2016",
    jahrFehlt:
      "Falta ainda o teu ano de nascimento. Com ele, o programa sabe que textos " +
      "são adequados para ti - e volta a ajustá-los todos os anos.",
    jahrPasstNicht:
      "Este ano não parece certo. Escreve o ano em que nasceste, com quatro " +
      "algarismos - por exemplo, 2016.",
    nurJahr: " Só o ano fica guardado.",
    womitAnfangen: "Por onde queres começar?",
    bitteWarten: "Um momento...",
    kontoErstellen: "Criar conta",
    anmelden: "Iniciar sessão",
    wirdGesendet: "A enviar...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_PT,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_PT,
    schonKonto: "Já tens conta pessoal? ",
    nochKeinKonto: "Ainda não tens conta pessoal? ",
    vergessen: "Esqueceste-te da palavra-passe?",
  },
  br: {
    klasse: "Turma: ",
    andereKlasse: "outra turma",
    klassencode: "Código da turma",
    codeBeispiel: "ex.: ABC234",
    deinName: "Seu nome",
    passwort: "Senha",
    nameBeispiel: "é assim que vamos cumprimentar você",
    email: "Endereço de e-mail",
    mindestens8: "Pelo menos 8 caracteres.",
    passwortNochmal: "Repetir a senha",
    geburtsjahr: "Ano de nascimento",
    jahrBeispiel: "ex.: 2016",
    jahrFehlt:
      "Digite também seu ano de nascimento. Com ele, o aplicativo sabe quais textos " +
      "combinam com você - e os ajusta de novo a cada ano.",
    jahrPasstNicht:
      "Este ano não parece certo. Digite o ano em que você nasceu (por exemplo, 2016), " +
      "com quatro algarismos.",
    nurJahr: " Só o ano é salvo.",
    womitAnfangen: "Por onde você quer começar?",
    bitteWarten: "Aguarde...",
    kontoErstellen: "Criar conta",
    anmelden: "Entrar",
    wirdGesendet: "Enviando...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_BR,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_BR,
    schonKonto: "Já tem uma conta pessoal? ",
    nochKeinKonto: "Ainda não tem uma conta pessoal? ",
    vergessen: "Esqueceu a senha?",
  },
  ro: {
    klasse: "Clasa: ",
    andereKlasse: "altă clasă",
    klassencode: "Codul clasei",
    codeBeispiel: "de ex. ABC234",
    deinName: "Numele tău",
    passwort: "Parolă",
    nameBeispiel: "așa te vom saluta",
    email: "Adresa de e-mail",
    mindestens8: "Cel puțin 8 caractere.",
    passwortNochmal: "Repetă parola",
    geburtsjahr: "Anul nașterii",
    jahrBeispiel: "de ex. 2016",
    jahrFehlt:
      "Mai scrie anul nașterii. După el aplicația știe ce texte ți se potrivesc - " +
      "și le potrivește din nou în fiecare an.",
    jahrPasstNicht:
      "Acest an nu se potrivește. Scrie anul nașterii cu patru cifre, " +
      "de exemplu 2016.",
    nurJahr: " Se salvează doar anul.",
    womitAnfangen: "De unde începi?",
    bitteWarten: "Un moment...",
    kontoErstellen: "Creați un cont",
    anmelden: "Conectați-vă",
    wirdGesendet: "Se trimite...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_RO,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_RO,
    schonKonto: "Ai deja un cont propriu? ",
    nochKeinKonto: "Nu ai încă un cont propriu? ",
    vergessen: "Ai uitat parola?",
  },
  sv: {
    klasse: "Klass: ",
    andereKlasse: "annan klass",
    klassencode: "Klasskod",
    codeBeispiel: "till exempel ABC234",
    deinName: "Ditt namn",
    passwort: "Lösenord",
    nameBeispiel: "så hälsar programmet på dig",
    email: "E-postadress",
    mindestens8: "Minst 8 tecken.",
    passwortNochmal: "Upprepa lösenordet",
    geburtsjahr: "Födelseår",
    jahrBeispiel: "till exempel 2016",
    jahrFehlt:
      "Fyll också i ditt födelseår. Med det vet programmet vilka texter som " +
      "passar dig - och det ställer in dem på nytt varje år.",
    jahrPasstNicht:
      "Det här årtalet stämmer inte. Skriv året då du föddes, med fyra " +
      "siffror - till exempel 2016.",
    nurJahr: " Bara årtalet sparas.",
    womitAnfangen: "Var vill du börja?",
    bitteWarten: "Vänta lite...",
    kontoErstellen: "Skapa konto",
    anmelden: "Logga in",
    wirdGesendet: "Skickar...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_SV,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_SV,
    schonKonto: "Har du redan ett eget konto? ",
    nochKeinKonto: "Har du inget eget konto än? ",
    vergessen: "Glömt lösenordet?",
  },
  uk: {
    klasse: "Клас: ",
    andereKlasse: "інший клас",
    klassencode: "Код класу",
    codeBeispiel: "напр. ABC234",
    deinName: "Твоє ім'я",
    passwort: "Пароль",
    nameBeispiel: "так ми тебе вітатимемо",
    email: "Адреса електронної пошти",
    mindestens8: "Щонайменше 8 знаків.",
    passwortNochmal: "Пароль ще раз",
    geburtsjahr: "Рік народження",
    jahrBeispiel: "напр. 2016",
    jahrFehlt:
      "Будь ласка, додай ще рік народження. За ним програма знає, які тексти " +
      "тобі підходять, - і щороку налаштовує їх заново.",
    jahrPasstNicht:
      "Цей рік не підходить. Напиши, будь ласка, рік свого народження " +
      "чотирма цифрами - наприклад, 2016.",
    nurJahr: " Зберігається лише рік.",
    womitAnfangen: "З чого почати?",
    bitteWarten: "Зачекай...",
    kontoErstellen: "Створити обліковий запис",
    anmelden: "Увійти",
    wirdGesendet: "Надсилання...",
    ohneKlasseLabel: OHNE_KLASSE_LABEL_UK,
    ohneKlasseHinweis: OHNE_KLASSE_HINWEIS_UK,
    schonKonto: "Уже є власний обліковий запис? ",
    nochKeinKonto: "Ще немає власного облікового запису? ",
    vergessen: "Не пам'ятаєш пароль?",
  },
});

/**
 * Der Hilfe-Text zum eigenen Konto — EIN Wortlaut für alle vier Programme
 * (Tastenflow, im Griff, Punktgenau, Klangpunkte). Er steht hier und nicht in
 * den vier Hilfe-Dateien, damit er nicht viermal auseinanderläuft.
 */
export const OHNE_KLASSE_HILFE =
  `Wer zu keiner Klasse gehört, legt sich selbst ein Konto an: beim runden Knopf „Konto" ` +
  `das Häkchen „${OHNE_KLASSE_LABEL}" setzen. Dafür braucht es eine ` +
  `E-Mail-Adresse: Dorthin kommt montags der Wochenbericht, aber nur in Wochen, ` +
  `in denen wirklich geübt wurde. Wer ein ganzes Jahr keines der vier Programme ` +
  `öffnet, bekommt eine Vorwarnung per Mail; meldet sich danach drei Wochen lang ` +
  `niemand an, wird das Konto mit allen Spielständen gelöscht.`;

export interface SchuelerAnmeldungProps {
  /** Läuft gerade eine Anfrage? (Knöpfe sperren.) */
  busy: boolean;
  /** Fehlermeldung zurücksetzen, wenn der Weg gewechselt wird. */
  onFehlerZuruecksetzen: () => void;
  /** Gemerkter Klassencode (aus dem Browser) — leer, wenn keiner da ist. */
  klassenCode: string;
  /** Anmeldung mit Klasse (der Standardweg). */
  onKlassenLogin: (code: string, name: string, passwort: string) => void;
  /** Anmeldung eines selbstlernenden Kontos. */
  onSelbstLogin: (email: string, passwort: string) => void;
  /**
   * ★★★★ NUR DER KLASSENWEG - das Häkchen „Ich übe allein" fällt weg
   * (Johannes, 28.08.2026: „alleine üben muss auch weg").
   *
   * ⚠️ Für Programme, in die man NUR über eine Klasse hineinkommt. Im
   * Mathecoach hängt jedes Blatt an einer Freischaltung durch die Lehrkraft;
   * ein selbstlernendes Konto könnte dort nie etwas sehen. Das Häkchen wäre
   * ein Weg, der sichtbar dasteht und nirgends hinführt - und wer ihn geht,
   * legt sich ein Konto an, das ihm nichts nützt.
   */
  nurKlassenweg?: boolean;
  /**
   * Neues selbstlernendes Konto anlegen. `geburtsjahr` kommt nur mit, wenn die
   * App {@link mitGeburtsjahr} gesetzt hat und wirklich eine Jahreszahl im Feld
   * stand; sonst `undefined`.
   */
  onSelbstRegister: (
    name: string,
    email: string,
    passwort: string,
    geburtsjahr?: number,
    /**
     * Womit angefangen wird - nur, wenn die App {@link startpunkte} gesetzt
     * hat. Sonst `undefined` (dann entscheidet der Server wie bisher).
     */
    startUnits?: number,
  ) => void;
  /**
   * Beim Anlegen eines eigenen Kontos zusätzlich das GEBURTSJAHR fragen —
   * Tastenflow nutzt es, um die Textstufe mitwachsen zu lassen (Bauplan
   * 14.08. §0b.3). Die anderen drei Programme lassen es weg, darum ein
   * Schalter und keine feste Zeile: Ein Feld, das nirgends wirkt, ist eine
   * Datenerhebung ohne Zweck.
   *
   * ★★★ SEIT 30.08.2026 IST DAS FELD PFLICHT, WO ES ERSCHEINT (Entscheidung
   * Johannes: „es ist bedingung für eine anmeldung"). Die Pflicht hängt an
   * DIESER Prop, nicht an der Komponente: Wer sie nicht setzt — Punktgenau,
   * Klangpunkte, »im Griff« —, sieht das Feld gar nicht, und für den ändert
   * sich nichts.
   *
   * Der Grund ist nicht Vollständigkeit, sondern Wirkung: Eine von Hand
   * gewählte Stufe wächst nicht mit. Nur das Jahr lässt die Texte jedes Jahr
   * von selbst mitwachsen.
   */
  mitGeburtsjahr?: boolean;
  /** Der Satz unter dem Feld — warum es überhaupt gefragt wird. */
  geburtsjahrErklaerung?: string;
  /**
   * WOMIT ANFANGEN? — die Vorkenntnisse beim Anlegen eines eigenen Kontos
   * (Johannes, 01.09.2026: *„Ich muss die startstufe … und wenn sich jemand
   * selbst anmeldet auch"*).
   *
   * ★ Warum eine Prop und keine feste Zeile: genau dieselbe Überlegung wie bei
   * {@link mitGeburtsjahr}. In der Klasse setzt die Lehrkraft den Startpunkt
   * beim Anlegen (`KlasseUndKinder`, Feld `mk-pupil-start`); wer sich SELBST
   * anmeldet, hat niemanden, der es für ihn tut - und in den Programmen ohne
   * Tastenstand (Punktgenau, Klangpunkte, »im Griff«, Mathecoach) gäbe es
   * nichts zu wählen. Wer die Prop nicht setzt, sieht das Feld nicht, und für
   * den ändert sich nichts.
   *
   * ⚠️ Anders als das Geburtsjahr ist es KEINE Pflicht: Die erste Zeile ist
   * die Vorgabe („Anfänger"), und wer nichts weiss, geht mit einem Tabstopp
   * daran vorbei. Eine falsche Wahl kostet nichts: Sie lässt sich später im
   * Zahnrad in BEIDE Richtungen ändern (seit 04.09.2026 auch nach unten -
   * `letters.startpunktAnwenden`).
   */
  startpunkte?: { units: number; label: string }[];
  /** Beschriftung des Startpunkt-Feldes (die App nennt ihr Programm darin). */
  startpunktLabel?: string;
  /** Der Satz unter dem Startpunkt-Feld. */
  startpunktErklaerung?: string;
  /**
   * Prüft den eingetippten Text und liefert die Jahreszahl — oder `undefined`,
   * wenn daraus kein brauchbares Geburtsjahr wird (leer, halb getippt, oder
   * unsinnig wie 2062).
   *
   * ★ WARUM HEREINGEREICHT UND NICHT HIER GEBAUT: Was ein plausibles
   * Geburtsjahr ist, weiß `lib/typing/account.ts` (`geburtsjahrAusText`, Alter
   * 3 bis 120) — und dieselbe Regel entscheidet danach über die Textstufe.
   * Eine zweite Prüfung an dieser Stelle wäre genau die Doppelung, die
   * auseinanderläuft: Das Formular ließe eine Zahl durch, die die App danach
   * verwirft [[feedback_zwei_stellen_die_voneinander_nichts_wissen]].
   * Ohne die Prop genügt eine vierstellige Zahl (das alte Verhalten).
   */
  geburtsjahrPruefen?: (text: string) => number | undefined;
  /** Sichtbare Fehlermeldung (wird von der App gesetzt). */
  fehler?: string;
  /** Zusätzliche Meldung, die die App unter den Feldern zeigen will. */
  onLokalerFehler: (text: string) => void;
}

export function SchuelerAnmeldung({
  busy,
  onFehlerZuruecksetzen,
  klassenCode,
  onKlassenLogin,
  onSelbstLogin,
  onSelbstRegister,
  onLokalerFehler,
  mitGeburtsjahr,
  geburtsjahrErklaerung,
  geburtsjahrPruefen,
  startpunkte,
  startpunktLabel,
  startpunktErklaerung,
  nurKlassenweg = false,
}: SchuelerAnmeldungProps) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  // Regel 1: aus. Der Klassen-Weg ist die Vorauswahl.
  const [ohneKlasse, setOhneKlasse] = useState(false);
  const [selbstNeu, setSelbstNeu] = useState(false);

  const [code, setCode] = useState(klassenCode);
  const [prefilled] = useState(klassenCode !== "");
  const [changeCode, setChangeCode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [jahr, setJahr] = useState("");
  /**
   * Womit angefangen wird. Vorgabe ist der ERSTE Startpunkt („Anfänger") -
   * wer nichts angibt, fängt vorn an, und das ist nie falsch.
   */
  const [start, setStart] = useState<number>(() => startpunkte?.[0]?.units ?? 0);
  /** Meldung DIREKT AM Geburtsjahr-Feld (nicht die allgemeine Fehlerzeile). */
  const [jahrFehler, setJahrFehler] = useState("");
  const jahrRef = useRef<HTMLInputElement>(null);
  const ersteEigeneRef = useRef<HTMLInputElement>(null);
  /** Das erste Feld des KLASSEN-Wegs (Nr 21 und Nr 22 der Fokusziele). */
  const ersteKlasseRef = useRef<HTMLInputElement>(null);

  /**
   * Wohin der Fokus wandert, wenn das Häkchen den halben Bildschirm austauscht.
   *
   *  • EINSCHALTEN („Ich übe allein …"): ins erste Feld des eigenen Kontos -
   *    sonst stünde der Fokus auf dem Häkchen und der Screenreader läse die
   *    neuen Felder nicht vor. So war es schon.
   *  • ★ AUSSCHALTEN (Nr 22, 22.08.2026): symmetrisch ins erste Feld des
   *    Klassen-Wegs. Vorher gab es dafür KEINEN Fokus-Aufruf - der Fokus blieb
   *    auf dem Häkchen, während darüber die halbe Maske wechselte. Ein Weg,
   *    der nur in eine Richtung geführt ist, ist keiner.
   *
   * Der Ref merkt, ob das Häkchen wirklich UMGELEGT wurde: Beim ersten Aufbau
   * des Formulars steht es aus, und dort hat niemand etwas betätigt.
   *
   * `setTimeout(0)`: Die Felder gibt es erst nach dem Rendern
   * ([[feedback_fokus_pflicht_alle_apps]]).
   */
  /** Text → Jahreszahl. Ohne hereingereichte Prüfung gilt das alte Verhalten. */
  const jahrAusText = (text: string): number | undefined => {
    if (geburtsjahrPruefen) return geburtsjahrPruefen(text);
    return /^\d{4}$/.test(text.trim()) ? Number(text.trim()) : undefined;
  };

  const warOhneKlasse = useRef(ohneKlasse);
  useEffect(() => {
    const vorher = warOhneKlasse.current;
    warOhneKlasse.current = ohneKlasse;
    if (!ohneKlasse && !vorher) return;
    const ziel = ohneKlasse ? ersteEigeneRef : ersteKlasseRef;
    const t = window.setTimeout(() => ziel.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [ohneKlasse, selbstNeu]);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        // Die Sperre, die vorher `disabled` am Knopf war (R5, 22.08.2026):
        // Sie steht jetzt hier, damit sie in ALLEN vier Programmen greift und
        // nicht davon abhängt, ob die App ihr `busy` selbst noch einmal prüft.
        if (busy) return;
        if (!ohneKlasse) {
          onKlassenLogin(code, name, pw);
          return;
        }
        if (selbstNeu) {
          if (pw !== pw2) {
            onLokalerFehler("Die beiden Passwörter stimmen nicht überein.");
            return;
          }
          const j = jahrAusText(jahr);
          /* ★★★ PFLICHT, ABER NICHTS WIRD GESPERRT (30.08.2026).
             ⚠️ Der Knopf bleibt bedienbar und bekommt KEIN `disabled` und auch
             kein `aria-disabled` wegen des leeren Feldes (Hausregel R5): Ein
             Knopf, der sich unter dem Fokus wegzieht, lässt eine Braillezeile
             im Nichts stehen - und ein Kind, das nicht sieht, WARUM nichts
             passiert, sucht den Fehler bei sich.
             Stattdessen: drücken darf man immer, und dann sagt das Formular am
             Feld, was noch fehlt, und holt den Fokus dorthin. Der Wortlaut ist
             eine Bitte, kein Vorwurf [[feedback_nie_gegen_das_kind]]. */
          if (mitGeburtsjahr && j === undefined) {
            setJahrFehler(jahr.trim() === "" ? t.jahrFehlt : t.jahrPasstNicht);
            window.setTimeout(() => jahrRef.current?.focus(), 0);
            return;
          }
          onSelbstRegister(name, email, pw, j, startpunkte ? start : undefined);
          return;
        }
        onSelbstLogin(email, pw);
      }}
    >
      {!ohneKlasse ? (
        <>
          {prefilled && !changeCode ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-sunken px-3 py-2 text-sm text-ink">
              <span>
                {t.klasse}<strong className="tracking-wide">{code}</strong>
              </span>
              {/* ★ Nr 21 der Fokusziele (22.08.2026): Der Knopf verschwindet
                  im selben Augenblick, in dem er das Klassencode-Feld
                  einblendet - er kann den Fokus also nicht behalten. Bisher
                  setzte ihn niemand: Der Fokus fiel auf `body`, und das neue,
                  leere Feld fand nur, wer es sehen konnte. */}
              <button
                type="button"
                className="text-accent underline underline-offset-2"
                onClick={() => {
                  setChangeCode(true);
                  setCode("");
                  window.setTimeout(() => ersteKlasseRef.current?.focus(), 0);
                }}
              >
                {t.andereKlasse}
              </button>
            </div>
          ) : (
            <div>
              <label className="field-label" htmlFor="s-code">
                {t.klassencode}
              </label>
              <input
                id="s-code"
                ref={ersteKlasseRef}
                className="field-input uppercase"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={t.codeBeispiel}
                autoComplete="off"
              />
            </div>
          )}
          <div>
            <label className="field-label" htmlFor="s-name">
              {t.deinName}
            </label>
            <input
              id="s-name"
              // Steht der Klassencode schon fest, ist „Dein Name" das erste
              // Feld des Klassen-Wegs und damit das Fokus-Ziel (Nr 22).
              ref={prefilled && !changeCode ? ersteKlasseRef : undefined}
              className="field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="s-pw">
              {t.passwort}
            </label>
            <input
              id="s-pw"
              type="password"
              className="field-input"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </>
      ) : (
        <>
          {selbstNeu && (
            <div>
              <label className="field-label" htmlFor="e-name">
                {t.deinName}
              </label>
              <input
                id="e-name"
                ref={ersteEigeneRef}
                className="field-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder={t.nameBeispiel}
              />
            </div>
          )}
          <div>
            <label className="field-label" htmlFor="e-mail">
              {t.email}
            </label>
            <input
              id="e-mail"
              ref={selbstNeu ? undefined : ersteEigeneRef}
              type="email"
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="e-pw">
              {t.passwort}
            </label>
            <input
              id="e-pw"
              type="password"
              className="field-input"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete={selbstNeu ? "new-password" : "current-password"}
            />
            {selbstNeu && (
              <p className="m-0 mt-1 text-xs text-ink-muted">
                {t.mindestens8}
              </p>
            )}
          </div>
          {selbstNeu && (
            <div>
              <label className="field-label" htmlFor="e-pw2">
                {t.passwortNochmal}
              </label>
              <input
                id="e-pw2"
                type="password"
                className="field-input"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}
          {selbstNeu && mitGeburtsjahr && (
            <div>
              <label className="field-label" htmlFor="e-jahr">
                {t.geburtsjahr}
              </label>
              <input
                id="e-jahr"
                ref={jahrRef}
                className="field-input"
                inputMode="numeric"
                value={jahr}
                placeholder={t.jahrBeispiel}
                /* `aria-required` meldet das Feld einer Sprachausgabe als
                   Pflichtfeld, BEVOR jemand es leer lässt - nicht erst
                   hinterher.
                   ⚠️ ABER KEIN `required` (gemessen 30.08.2026): Das HTML-
                   Attribut lässt den Browser die Absendung selbst abfangen -
                   `submit` feuert dann gar nicht, unsere Prüfung läuft nie,
                   und statt des Satzes in einfacher Sprache erscheint die
                   Sprechblase des Browsers. Die ist nicht fokussierbar,
                   verschwindet von selbst, redet in der Sprache des
                   Betriebssystems und sagt einem Kind nicht, WOFÜR die Zahl
                   gebraucht wird. Im Test war der Beleg eindeutig: mit
                   `required` kam die Meldung nie an. */
                aria-required="true"
                aria-invalid={jahrFehler ? true : undefined}
                aria-describedby={jahrFehler ? "e-jahr-fehler" : undefined}
                onChange={(e) => {
                  setJahr(e.target.value);
                  if (jahrFehler) setJahrFehler("");
                }}
              />
              {jahrFehler && (
                <p
                  id="e-jahr-fehler"
                  role="alert"
                  className="m-0 mt-1 rounded-lg bg-danger-soft p-2 text-xs text-ink"
                >
                  {jahrFehler}
                </p>
              )}
              {geburtsjahrErklaerung && (
                <p className="m-0 mt-1 text-xs text-ink-muted">
                  {geburtsjahrErklaerung}
                  {t.nurJahr}
                </p>
              )}
            </div>
          )}

          {/*
            WOMIT ANFANGEN? - nur beim Anlegen eines EIGENEN Kontos, und nur
            dort, wo die App Startpunkte hereinreicht (Johannes, 01.09.2026).
            In einer Klasse setzt die Lehrkraft den Startpunkt beim Anlegen;
            wer sich selbst anmeldet, hat niemanden, der es für ihn tut.

            ⚠️ Keine Pflicht: Die erste Zeile ist die Vorgabe („Anfänger").
            Wer nichts weiss, geht mit einem Tabstopp daran vorbei - und wer
            zu niedrig wählt, verliert nichts, weil die App den Startpunkt
            später nur noch erhöht, nie zurücknimmt.
          */}
          {selbstNeu && startpunkte && startpunkte.length > 0 && (
            <div>
              <label className="field-label" htmlFor="e-start">
                {startpunktLabel ?? t.womitAnfangen}
              </label>
              <select
                id="e-start"
                className="field-input"
                value={String(start)}
                onChange={(e) => setStart(Number(e.target.value))}
                aria-describedby={startpunktErklaerung ? "e-start-hilfe" : undefined}
              >
                {startpunkte.map((sp) => (
                  <option key={sp.units} value={sp.units}>
                    {sp.label}
                  </option>
                ))}
              </select>
              {startpunktErklaerung && (
                <p id="e-start-hilfe" className="m-0 mt-1 text-xs text-ink-muted">
                  {startpunktErklaerung}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/*
        ★ R5 (Fokus-Pflicht, 22.08.2026): `aria-disabled` statt `disabled`.
        Wer den Knopf betätigt, steht mit dem Fokus darauf - ein `disabled`
        im selben Augenblick warf ihn auf `body`, und eine Braillezeile stand
        im Nichts, genau während auf den Server gewartet wird. Der Knopf bleibt
        jetzt Tabstopp; gegen Doppel-Auslösung schützt die Sperre in der
        App (`busy` wird dort gesetzt und dort geprüft).

        Warum die Ansage hier eine LIVE-REGION ist und keine Sprachausgabe:
        Dieses Formular gehört allen vier Programmen, und jedes bringt seine
        eigene Stimme mit. Eine Live-Region spricht in allen vieren - und geht
        genauso auf die Braillezeile.
      */}
      <button
        type="submit"
        className="btn-primary w-full aria-disabled:opacity-40"
        aria-disabled={busy}
      >
        {busy ? t.bitteWarten : selbstNeu && ohneKlasse ? t.kontoErstellen : t.anmelden}
      </button>
      <p role="status" className="sr-only">
        {busy ? t.wirdGesendet : ""}
      </p>

      {/* Regel 2: EIN Häkchen, direkt unter dem Knopf — nicht über den Feldern,
          damit der gewohnte Weg zuerst kommt.

          ⚠️ In Programmen mit `nurKlassenweg` gibt es das Häkchen GAR NICHT -
          es wird nicht ausgegraut gezeigt (Arbeitsblatt-Bauart §3/§4). Ein
          Schalter, den man antastet, drückt und der nichts tut, ist auf der
          Braillezeile schlimmer als keiner. */}
      {!nurKlassenweg && (
      <div className="rounded-xl border border-hairline bg-surface-sunken p-3">
        <label className="flex items-start gap-2 text-sm text-ink">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={ohneKlasse}
            onChange={(e) => {
              setOhneKlasse(e.target.checked);
              setSelbstNeu(false);
              setPw("");
              setPw2("");
              onFehlerZuruecksetzen();
            }}
          />
          <span>
            <strong>{t.ohneKlasseLabel}</strong>
            <span className="mt-0.5 block text-ink-muted">{t.ohneKlasseHinweis}</span>
          </span>
        </label>
        {ohneKlasse && (
          <p className="m-0 mt-2 text-sm text-ink-muted">
            {selbstNeu ? t.schonKonto : t.nochKeinKonto}
            <button
              type="button"
              className="text-accent underline underline-offset-2"
              onClick={() => {
                setSelbstNeu((v) => !v);
                onFehlerZuruecksetzen();
              }}
            >
              {selbstNeu ? t.anmelden : t.kontoErstellen}
            </button>
          </p>
        )}
      </div>
      )}

      {ohneKlasse && !selbstNeu && (
        <p className="m-0 text-center text-sm">
          <Link
            // `art=konto`: Diese Seite bedient sonst LEHRKRAFT-Konten. Ohne den
            // Zusatz liefe der Reset gegen die falsche Tabelle ins Leere.
            to="/lernprogramm-passwort?art=konto"
            className="text-accent underline underline-offset-2"
          >
            {t.vergessen}
          </Link>
        </p>
      )}
    </form>
  );
}
