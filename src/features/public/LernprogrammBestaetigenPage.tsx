/**
 * Der Landeplatz für die Bestätigungs-Links der Lernprogramm-Konten
 * (09.08.2026). Eine Seite, drei Fälle — welcher, sagt `?art=`:
 *
 *   • `art=konto`     Selbstlernendes Schüler-Konto: „Ja, diese Adresse gehört
 *                     mir." Ein Klick genügt.
 *   • `art=lehrkraft` Dasselbe für ein Lehrkraft-Konto.
 *   • `art=adresse`   Adresswechsel eines Schüler-Kontos: Der Link ging an die
 *                     NEUE Adresse; zur Sicherheit wird zusätzlich das eigene
 *                     Passwort verlangt, damit ein offen stehender Rechner
 *                     nicht genügt.
 *   • `art=lehrkraft-adresse`  Dasselbe für ein Lehrkraft-Konto (04.09.2026).
 *                     ⚠️ Eigene Art und nicht bloß eine Fahne an `adresse`:
 *                     Das Token wird in einer ANDEREN Sammlung eingelöst
 *                     (`tt_teachers` statt `tt_pupils`). In der falschen zu
 *                     suchen ergäbe „Link abgelaufen" - eine Meldung, die nach
 *                     einem Zeitproblem klingt und in die Irre führt.
 *
 * ── Die vier Regeln dieser Datei ────────────────────────────────────────────
 *
 * 1. **Öffentlich, ohne Anmeldung.** Solche Links werden fast immer auf einem
 *    anderen Gerät geöffnet als dem, auf dem geübt wird.
 * 2. **Sie bestätigt von selbst** (außer beim Adresswechsel, der das Passwort
 *    braucht): Wer den Link öffnet, hat schon zugestimmt — noch ein Knopf wäre
 *    eine Hürde ohne Gewinn.
 * 3. **Jede Antwort ist ein ganzer Satz**, kein Statuscode. Diese Seite lesen
 *    Kinder und Eltern, nicht Entwickler.
 * 4. **Kein Sackgassen-Ende:** Von hier führt immer ein Weg zurück in die
 *    Lernwerkstatt.
 */
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PublicHeader } from "@/components/PublicHeader";
import { applyTheme } from "@/lib/theme";
import { typingBackend } from "@/lib/typing/backend";
import { RechtlichesFusszeile } from "@/components/RechtlichesFusszeile";
import { ServerMeldung } from "@/components/typing/ServerMeldung";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import { hausStartHref, mitHausName } from "@/lib/adressen";

type Art = "konto" | "lehrkraft" | "adresse" | "lehrkraft-adresse";
type Stand = "laeuft" | "fertig" | "fehler" | "wartet";

/**
 * ★★ EN2 (19.09.2026): beide Sprachen nebeneinander. GEMEINSAME Seite - ohne
 * (aktiven) Provider „de", wortgleich wie vorher (auch die zwei Gedankenstriche
 * „—" der deutschen Sätze bleiben; die englischen haben nur Bindestriche,
 * Braillezeile). Englisch nur aus Tastenflow in englischer Bedienung.
 */
const T = texte({
  de: {
    ohneSchluessel: "In diesem Link fehlt der Bestätigungs-Schlüssel.",
    dankeLehrkraft: "Danke! Deine Adresse ist bestätigt — wir können dich jetzt erreichen.",
    dankeKonto:
      "Danke! Deine Adresse ist bestätigt. Ab jetzt bekommst du montags deinen Wochenbericht — aber nur, wenn du in der Woche geübt hast.",
    erledigt:
      "Erledigt — dein Konto hört jetzt auf die neue Adresse. Melde dich beim nächsten Mal damit an.",
    titelNeu: "Neue E-Mail-Adresse bestätigen",
    titel: "E-Mail-Adresse bestätigen",
    moment: "Einen Moment …",
    sicherheit:
      "Zur Sicherheit brauchen wir noch dein Passwort — dasselbe, mit dem du dich anmeldest.",
    passwort: "Passwort",
    wechsel: "Wechsel bestätigen",
    neuerLink:
      "Einen neuen Link bekommst du in deinem Konto unter „Meine Zugangsdaten\" — oder du meldest dich an und forderst ihn dort an.",
    zurLernwerkstatt: "Zur Lernwerkstatt",
  },
  en: {
    ohneSchluessel: "This link is missing its confirmation key.",
    dankeLehrkraft: "Thank you! Your address is confirmed - we can reach you now.",
    dankeKonto:
      "Thank you! Your address is confirmed. From now on you'll get your weekly report on Mondays - but only if you practised that week.",
    erledigt: "Done - your account now uses the new address. Sign in with it next time.",
    titelNeu: "Confirm your new email address",
    titel: "Confirm your email address",
    moment: "Just a moment …",
    sicherheit: "For security, we also need your password - the one you sign in with.",
    passwort: "Password",
    wechsel: "Confirm the change",
    neuerLink:
      "You can get a new link in your account under “My login details” - sign in and ask for one there.",
    zurLernwerkstatt: "Go to Lernwerkstatt",
  },
  // ★ E11a: „tu" - wie die deutsche Basis, die hier durchgehend duzt (auch für
  // Lehrkraft-Konten, siehe Kopf-Kommentar zu `LernprogrammPasswortPage.tsx`).
  fr: {
    ohneSchluessel: "Ce lien n'a pas de clé de confirmation.",
    dankeLehrkraft: "Merci ! Ton adresse est confirmée - nous pouvons maintenant te joindre.",
    dankeKonto:
      "Merci ! Ton adresse est confirmée. À partir de maintenant, tu reçois ton bilan hebdomadaire le lundi - mais seulement si tu as pratiqué cette semaine-là.",
    erledigt:
      "C'est fait - ton compte utilise maintenant la nouvelle adresse. Connecte-toi avec elle la prochaine fois.",
    titelNeu: "Confirmer la nouvelle adresse e-mail",
    titel: "Confirmer l'adresse e-mail",
    moment: "Un instant …",
    sicherheit: "Par sécurité, il nous faut encore ton mot de passe - celui avec lequel tu te connectes.",
    passwort: "Mot de passe",
    wechsel: "Confirmer le changement",
    neuerLink:
      'Tu peux obtenir un nouveau lien dans ton compte sous "Mes identifiants" - ou connecte-toi et demande-le là.',
    zurLernwerkstatt: "Vers Lernwerkstatt",
  },
  // ★ ES-O (27.09.2026): tú wie „fr".
  es: {
    ohneSchluessel: "Este enlace no tiene clave de confirmación.",
    dankeLehrkraft: "¡Gracias! Su dirección está confirmada: a partir de ahora podemos ponernos en contacto con usted.",
    dankeKonto:
      "¡Gracias! Tu dirección está confirmada. Desde ahora recibes tu resumen semanal los lunes - pero solo si esa semana has practicado.",
    erledigt:
      "Hecho - tu cuenta usa ahora la dirección nueva. La próxima vez, inicia sesión con ella.",
    titelNeu: "Confirmar el nuevo correo electrónico",
    titel: "Confirmar el correo electrónico",
    moment: "Un momento …",
    sicherheit: "Por seguridad, todavía necesitamos tu contraseña - la que usas para iniciar sesión.",
    passwort: "Contraseña",
    wechsel: "Confirmar el cambio",
    neuerLink:
      'Puedes conseguir un enlace nuevo en tu cuenta, en "Mis datos de acceso" - o inicia sesión y pídelo allí.',
    zurLernwerkstatt: "Ir a Lernwerkstatt",
  },
  // ★ O-IT (02.10.2026): Lehrkraft neutral, Kind „tu" (Glossar Regel 1).
  it: {
    ohneSchluessel: "In questo link manca la chiave di conferma.",
    dankeLehrkraft: "Grazie. L'indirizzo è confermato - ora possiamo scrivere a questo indirizzo.",
    dankeKonto:
      "Grazie! Il tuo indirizzo è confermato. Da ora il lunedì ricevi il tuo resoconto settimanale - ma solo nelle settimane in cui hai fatto esercizio.",
    erledigt:
      "Fatto - il tuo account ora usa il nuovo indirizzo. La prossima volta accedi con questo.",
    titelNeu: "Conferma il nuovo indirizzo email",
    titel: "Conferma l'indirizzo email",
    moment: "Un momento...",
    sicherheit: "Per sicurezza ci serve ancora la tua password - la stessa che usi per accedere.",
    passwort: "Password",
    wechsel: "Conferma il cambio",
    neuerLink:
      `Un nuovo link lo trovi nel tuo account, in "I miei dati di accesso" - oppure accedi e richiedilo lì.`,
    zurLernwerkstatt: "Vai alla Lernwerkstatt",
  },
  // ★ O-PL (02.10.2026): eigenes Konto „ty", nichts verrät das Geschlecht
  // (Glossar Regel 1/2; „Moje dane logowania" §2.11).
  pl: {
    ohneSchluessel: "W tym linku brakuje klucza potwierdzającego.",
    dankeLehrkraft: "Dziękujemy. Adres jest potwierdzony - teraz możemy pisać na ten adres.",
    dankeKonto:
      "Dziękujemy! Twój adres jest potwierdzony. Od teraz w poniedziałki dostajesz podsumowanie tygodnia - ale tylko za tygodnie z ćwiczeniami.",
    erledigt:
      "Gotowe - twoje konto używa teraz nowego adresu. Następnym razem zaloguj się nim.",
    titelNeu: "Potwierdź nowy adres e-mail",
    titel: "Potwierdź adres e-mail",
    moment: "Chwileczkę...",
    sicherheit: "Dla bezpieczeństwa potrzebujemy jeszcze twojego hasła - tego samego, którym się logujesz.",
    passwort: "Hasło",
    wechsel: "Potwierdź zmianę",
    neuerLink:
      "Nowy link znajdziesz na swoim koncie w części „Moje dane logowania” - albo zaloguj się i poproś o niego tam.",
    zurLernwerkstatt: "Przejdź do Lernwerkstatt",
  },
  // ★ O-TR (02.10.2026): Lehrkraft "siz" mit -(y)In, eigenes Konto "sen"; was
  // beide sehen (Passwort, neuer Link, Adresswechsel), steht ohne Anrede
  // (Glossar Regel 1). "Giriş bilgilerim" wie die Kontoseite.
  tr: {
    ohneSchluessel: "Bu bağlantıda onay anahtarı eksik.",
    dankeLehrkraft: "Teşekkürler. Adresiniz onaylandı - artık size ulaşabiliriz.",
    dankeKonto:
      "Teşekkürler! Adresin onaylandı. Artık her pazartesi haftalık raporunu alacaksın - ama yalnızca o hafta çalıştıysan.",
    erledigt:
      "Tamamlandı - hesap artık yeni adresi kullanıyor. Bir sonraki girişte bu adres geçerli.",
    titelNeu: "Yeni e-posta adresini onayla",
    titel: "E-posta adresini onayla",
    moment: "Bir saniye...",
    sicherheit: "Güvenlik için şifre de gerekiyor - giriş yaparken kullanılan şifre.",
    passwort: "Şifre",
    wechsel: "Değişikliği onayla",
    neuerLink:
      'Yeni bir bağlantı, hesaptaki "Giriş bilgilerim" bölümünde bulunur - ya da giriş yaptıktan sonra oradan istenebilir.',
    zurLernwerkstatt: "Lernwerkstatt sayfasına git",
  },
  // ★ O-CS (03.10.2026): Lehrkraft "vy", eigenes Konto "ty"; was beide sehen
  // (Heslo, neuer Link, Adresswechsel), steht ohne Anrede (Glossar Regel 1).
  // Keine Vergangenheit über die Person: "jen za týdny s cvičením" (Regel 2).
  // "Přihlašovací údaje" wie die Kontoseite (§2.5).
  cs: {
    ohneSchluessel: "V tomto odkazu chybí potvrzovací klíč.",
    dankeLehrkraft: "Děkujeme. Vaše adresa je potvrzená - teď vás můžeme kontaktovat.",
    dankeKonto:
      "Děkujeme! Tvoje adresa je potvrzená. Od teď ti každé pondělí přijde týdenní přehled - ale jen za týdny s cvičením.",
    erledigt:
      "Hotovo - účet teď používá novou adresu. Při příštím přihlášení platí tato adresa.",
    titelNeu: "Potvrdit novou e-mailovou adresu",
    titel: "Potvrdit e-mailovou adresu",
    moment: "Okamžik...",
    sicherheit: "Z bezpečnostních důvodů je potřeba ještě heslo - stejné jako při přihlášení.",
    passwort: "Heslo",
    wechsel: "Potvrdit změnu",
    neuerLink:
      "Nový odkaz je v účtu v části „Přihlašovací údaje“ - nebo si ho tam lze po přihlášení vyžádat.",
    zurLernwerkstatt: "Přejít na Lernwerkstatt",
  },
  bg: {
    ohneSchluessel: "В тази връзка липсва ключът за потвърждение.",
    dankeLehrkraft: "Благодарим. Адресът е потвърден - вече можем да се свържем с вас.",
    dankeKonto:
      "Благодарим! Адресът ти е потвърден. Отсега нататък всеки понеделник ще получаваш седмичния отчет - но само за седмици с упражнения.",
    erledigt:
      "Готово - акаунтът вече използва новия адрес. При следващото влизане важи този адрес.",
    titelNeu: "Потвърждаване на новия имейл адрес",
    titel: "Потвърждаване на имейл адреса",
    moment: "Един момент...",
    sicherheit: "За сигурност е нужна и паролата - същата като при влизане.",
    passwort: "Парола",
    wechsel: "Потвърди промяната",
    neuerLink:
      "Нова връзка може да се поиска в акаунта, в „Моите данни за вход“ - след влизане.",
    zurLernwerkstatt: "Към Lernwerkstatt",
  },
  el: {
    ohneSchluessel: "Σε αυτόν τον σύνδεσμο λείπει το κλειδί επιβεβαίωσης.",
    dankeLehrkraft: "Ευχαριστούμε. Η διεύθυνσή σας επιβεβαιώθηκε - τώρα μπορούμε να επικοινωνήσουμε μαζί σας.",
    dankeKonto:
      "Ευχαριστούμε! Η διεύθυνσή σου επιβεβαιώθηκε. Από τώρα θα λαμβάνεις κάθε Δευτέρα την εβδομαδιαία αναφορά σου - αλλά μόνο για εβδομάδες με εξάσκηση.",
    erledigt:
      "Έγινε - ο λογαριασμός χρησιμοποιεί τώρα τη νέα διεύθυνση. Την επόμενη φορά συνδέσου με αυτή.",
    titelNeu: "Επιβεβαίωση νέας διεύθυνσης e-mail",
    titel: "Επιβεβαίωση διεύθυνσης e-mail",
    moment: "Μια στιγμή...",
    sicherheit:
      "Για λόγους ασφαλείας χρειαζόμαστε ακόμα τον κωδικό πρόσβασής σου - τον ίδιο που χρησιμοποιείς για τη σύνδεση.",
    passwort: "Κωδικός πρόσβασης",
    wechsel: "Επιβεβαίωση αλλαγής",
    neuerLink:
      "Νέο σύνδεσμο βρίσκεις στον λογαριασμό σου, στην ενότητα «Τα στοιχεία σύνδεσής μου» - ή συνδέσου και ζήτησέ τον εκεί.",
    zurLernwerkstatt: "Μετάβαση στο Lernwerkstatt",
  },
  hu: {
    ohneSchluessel: "Ebből a hivatkozásból hiányzik a megerősítő kulcs.",
    dankeLehrkraft: "Köszönjük. Az e-mail-cím megerősítve - mostantól el tudjuk érni.",
    dankeKonto:
      "Köszönjük! A címed megerősítve. Mostantól minden hétfőn megkapod a heti összesítőt - de csak azokról a hetekről, amikor gyakoroltál.",
    erledigt:
      "Kész - a fiók mostantól az új címet használja. A következő bejelentkezéskor ez a cím érvényes.",
    titelNeu: "Új e-mail-cím megerősítése",
    titel: "E-mail-cím megerősítése",
    moment: "Egy pillanat...",
    sicherheit: "Biztonsági okból szükség van még a jelszóra is - ugyanarra, amellyel a bejelentkezés történik.",
    passwort: "Jelszó",
    wechsel: "Módosítás megerősítése",
    neuerLink:
      "Új hivatkozás a fiókban, a „Belépési adataim” részben kérhető - bejelentkezés után.",
    zurLernwerkstatt: "Tovább a Lernwerkstatt oldalára",
  },
  nl: {
    ohneSchluessel: "In deze link ontbreekt de bevestigingscode.",
    dankeLehrkraft: "Bedankt. Je adres is bevestigd - we kunnen je nu bereiken.",
    dankeKonto:
      "Bedankt! Je adres is bevestigd. Vanaf nu krijg je op maandag je weekverslag - maar alleen als je die week hebt geoefend.",
    erledigt:
      "Klaar - je account gebruikt nu het nieuwe adres. Log daar de volgende keer mee in.",
    titelNeu: "Nieuw e-mailadres bevestigen",
    titel: "E-mailadres bevestigen",
    moment: "Een moment...",
    sicherheit: "Voor de veiligheid hebben we ook je wachtwoord nodig - hetzelfde waarmee je inlogt.",
    passwort: "Wachtwoord",
    wechsel: "Wijziging bevestigen",
    neuerLink:
      "Een nieuwe link vind je in je account bij \"Mijn inloggegevens\" - log in en vraag de link daar aan.",
    zurLernwerkstatt: "Naar Lernwerkstatt",
  },
  pt: {
    ohneSchluessel: "Nesta ligação falta a chave de confirmação.",
    dankeLehrkraft: "Obrigado. O seu endereço está confirmado - agora já podemos enviar-lhe mensagens.",
    dankeKonto:
      "Obrigado! O teu endereço está confirmado. A partir de agora, recebes o resumo semanal à segunda-feira - mas só nas semanas em que praticares.",
    erledigt:
      "Concluído - a conta passa a usar o novo endereço. É este o endereço para o próximo início de sessão.",
    titelNeu: "Confirmar o novo endereço de e-mail",
    titel: "Confirmar o endereço de e-mail",
    moment: "Um momento...",
    sicherheit: "Por segurança, precisamos ainda da palavra-passe - a mesma do início de sessão.",
    passwort: "Palavra-passe",
    wechsel: "Confirmar a alteração",
    neuerLink:
      "Há uma nova ligação na conta, em \"Os meus dados de acesso\" - ou pode ser pedida aí depois de iniciar sessão.",
    zurLernwerkstatt: "Ir para a Lernwerkstatt",
  },
  br: {
    ohneSchluessel: "Falta a chave de confirmação neste link.",
    dankeLehrkraft: "Agradecemos. Seu endereço foi confirmado - agora podemos entrar em contato com você.",
    dankeKonto:
      "Valeu! Seu endereço foi confirmado. A partir de agora, você recebe o resumo semanal às segundas-feiras - mas só nas semanas em que praticou.",
    erledigt:
      "Tudo certo - agora sua conta usa o novo endereço. Da próxima vez, entre com ele.",
    titelNeu: "Confirmar o novo endereço de e-mail",
    titel: "Confirmar o endereço de e-mail",
    moment: "Só um momento...",
    sicherheit: "Por segurança, precisamos também da sua senha - a mesma que você usa para entrar.",
    passwort: "Senha",
    wechsel: "Confirmar a mudança",
    neuerLink:
      "Você recebe um novo link na sua conta, em Meus dados de acesso - basta entrar e pedir por lá.",
    zurLernwerkstatt: "Ir para a Lernwerkstatt",
  },
  ro: {
    ohneSchluessel: "În acest link lipsește cheia de confirmare.",
    dankeLehrkraft: "Mulțumim. Adresa este confirmată - acum vă putem contacta.",
    dankeKonto:
      "Mulțumim! Adresa ta este confirmată. De acum primești lunea raportul săptămânal - dar numai pentru săptămânile în care ai exersat.",
    erledigt:
      "Gata - contul folosește acum noua adresă. La următoarea conectare este valabilă această adresă.",
    titelNeu: "Confirmați noua adresă de e-mail",
    titel: "Confirmați adresa de e-mail",
    moment: "Un moment...",
    sicherheit: "Din motive de securitate, mai este nevoie de parolă - aceeași ca la conectare.",
    passwort: "Parolă",
    wechsel: "Confirmați schimbarea",
    neuerLink:
      "Un link nou se găsește în cont, la Datele mele de conectare - se poate cere de acolo după conectare.",
    zurLernwerkstatt: "Mergeți la Lernwerkstatt",
  },
  sv: {
    ohneSchluessel: "Bekräftelsenyckeln saknas i den här länken.",
    dankeLehrkraft: "Tack! Din adress är bekräftad - nu går det att nå dig.",
    dankeKonto:
      "Tack! Din adress är bekräftad. Från och med nu får du din veckorapport på måndagar - men bara om du har övat under veckan.",
    erledigt:
      "Klart - ditt konto använder nu den nya adressen. Logga in med den nästa gång.",
    titelNeu: "Bekräfta den nya e-postadressen",
    titel: "Bekräfta e-postadressen",
    moment: "Ett ögonblick...",
    sicherheit: "Av säkerhetsskäl behövs också ditt lösenord - samma som när du loggar in.",
    passwort: "Lösenord",
    wechsel: "Bekräfta ändringen",
    neuerLink:
      "Du får en ny länk i ditt konto under Mina inloggningsuppgifter - logga in och begär den där.",
    zurLernwerkstatt: "Gå till Lernwerkstatt",
  },
  uk: {
    ohneSchluessel: "У цьому посиланні немає ключа підтвердження.",
    dankeLehrkraft: "Дякуємо. Вашу адресу підтверджено - тепер ми можемо зв'язатися з вами.",
    dankeKonto:
      "Дякуємо! Твою адресу підтверджено. Відтепер щопонеділка надходитиме тижневий звіт - але лише за тижні, коли було тренування.",
    erledigt:
      "Готово - обліковий запис тепер використовує нову адресу. Під час наступного входу діє саме вона.",
    titelNeu: "Підтвердити нову адресу електронної пошти",
    titel: "Підтвердити адресу електронної пошти",
    moment: "Хвилинку...",
    sicherheit: "Для безпеки потрібен ще пароль - той самий, що й для входу.",
    passwort: "Пароль",
    wechsel: "Підтвердити зміну",
    neuerLink:
      "Нове посилання є в обліковому записі, у розділі Дані для входу - там його можна запросити після входу.",
    zurLernwerkstatt: "Перейти до Lernwerkstatt",
  },
});

/**
 * Was in der Meldungszeile steht: ein eigener Satz (Schlüssel, wird beim
 * Anzeigen in der Sprache der Bedienung gelesen) oder ein Satz vom Server
 * (deutsch, übersetzt über `ServerMeldung`).
 */
type Meldung =
  | { von: "hier"; schluessel: "ohneSchluessel" | "dankeLehrkraft" | "dankeKonto" | "erledigt" }
  | { von: "server"; text: string }
  | null;

export function LernprogrammBestaetigenPage() {
  const [sp] = useSearchParams();
  const token = (sp.get("token") ?? "").trim();
  const artParam = (sp.get("art") ?? "konto").trim();
  const art: Art =
    artParam === "lehrkraft"
      ? "lehrkraft"
      : artParam === "lehrkraft-adresse"
        ? "lehrkraft-adresse"
        : artParam === "adresse"
          ? "adresse"
          : "konto";
  /** Beide Adresswechsel-Arten warten auf das Passwort. */
  const istAdresswechsel = art === "adresse" || art === "lehrkraft-adresse";
  const themeParam = sp.get("theme");
  useEffect(() => {
    if (themeParam === "light" || themeParam === "dark") applyTheme(themeParam);
  }, [themeParam]);

  // Beim Adresswechsel wartet die Seite auf das Passwort; sonst legt sie los.
  const [stand, setStand] = useState<Stand>(istAdresswechsel ? "wartet" : "laeuft");
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const [meldung, setMeldung] = useState<Meldung>(null);
  const [passwort, setPasswort] = useState("");
  const meldungText =
    meldung === null ? null : meldung.von === "hier" ? (
      t[meldung.schluessel]
    ) : (
      <ServerMeldung text={meldung.text} />
    );
  const gelaufen = useRef(false);

  useEffect(() => {
    if (istAdresswechsel || gelaufen.current) return;
    gelaufen.current = true; // React 18 ruft Effekte im Strict-Modus doppelt
    if (!token) {
      setStand("fehler");
      setMeldung({ von: "hier", schluessel: "ohneSchluessel" });
      return;
    }
    void (async () => {
      const r =
        art === "lehrkraft"
          ? await typingBackend().bestaetigeLehrkraft(token)
          : await typingBackend().bestaetigeKonto(token);
      if (r.ok) {
        setStand("fertig");
        setMeldung({ von: "hier", schluessel: art === "lehrkraft" ? "dankeLehrkraft" : "dankeKonto" });
      } else {
        setStand("fehler");
        setMeldung({ von: "server", text: r.error });
      }
    })();
  }, [art, istAdresswechsel, token]);

  async function adresseBestaetigen(e: React.FormEvent) {
    e.preventDefault();
    if (stand === "laeuft") return;
    setStand("laeuft");
    const r =
      art === "lehrkraft-adresse"
        ? await typingBackend().bestaetigeLehrkraftAdresse(token, passwort)
        : await typingBackend().bestaetigeAdresse(token, passwort);
    if (r.ok) {
      setStand("fertig");
      setMeldung({ von: "hier", schluessel: "erledigt" });
    } else {
      setStand("wartet");
      setMeldung({ von: "server", text: r.error });
    }
  }

  return (
    <div className="min-h-screen">
      {/* 05.09.2026: Kopfzeile war nachgebaut - Schalter fest am Fensterrand,
          Marke im Fluss (und dort stand „ensorik"). Jetzt die gemeinsame
          Leiste. */}
      <PublicHeader konto={false} />

      <div className="mx-auto w-full max-w-md px-4 pb-12 pt-10 sm:px-6">

        <div className="card space-y-4 p-6">
          <h1 className="m-0 text-xl font-semibold text-ink">
            {istAdresswechsel ? t.titelNeu : t.titel}
          </h1>

          {stand === "laeuft" && <p className="m-0 text-ink-muted">{t.moment}</p>}

          {stand === "wartet" && (
            <form className="space-y-3" onSubmit={adresseBestaetigen}>
              <p className="m-0 text-ink-soft">{t.sicherheit}</p>
              <div>
                <label className="field-label" htmlFor="b-pw">
                  {t.passwort}
                </label>
                <input
                  id="b-pw"
                  type="password"
                  className="field-input"
                  value={passwort}
                  onChange={(ev) => setPasswort(ev.target.value)}
                  autoComplete="current-password"
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                {t.wechsel}
              </button>
              {meldung && (
                <p role="alert" className="m-0 rounded-xl bg-danger-soft p-3 text-sm text-ink">
                  {meldungText}
                </p>
              )}
            </form>
          )}

          {stand === "fertig" && (
            <p role="status" className="m-0 rounded-xl bg-success-soft p-3 text-ink">
              {meldungText}
            </p>
          )}

          {stand === "fehler" && (
            <>
              <p role="alert" className="m-0 rounded-xl bg-danger-soft p-3 text-ink">
                {meldungText}
              </p>
              <p className="m-0 text-sm text-ink-muted">{t.neuerLink}</p>
            </>
          )}

          <p className="m-0 text-center text-sm">
            <Link to={hausStartHref()} className="text-accent underline underline-offset-2">
              {mitHausName(t.zurLernwerkstatt)}
            </Link>
          </p>
        </div>
      </div>
      <RechtlichesFusszeile />
    </div>
  );
}
