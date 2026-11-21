import { LW_PROGRAMS } from "@/lib/lernwerkstatt/klassen";
import { altAnzeige, istMacSystem } from "@/lib/altTaste";
import { WAHLTASTE } from "@/lib/typing/wahltaste";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";

/**
 * ★★ „Ein Konto für alle Programme" - die Erklärung, EINMAL geschrieben
 * (21.09.2026, Johannes: *„gilt wirklich ein Konto für alle Apps? Wenn ja,
 * kannst du das in der Lernwerkstatt anpreisen"* - und dann: *„wenn ich ohne
 * Anmeldung auf Konto klicke, da soll die Erklärung kommen und die Möglichkeit
 * der Anmeldung für alle Apps"*).
 *
 * Sie steht an ZWEI Stellen: auf der Überblicksseite der Lernwerkstatt und auf
 * der Konto-Seite, wenn niemand angemeldet ist. Zwei Stellen, ein Baustein -
 * sonst behauptet die eine bald etwas anderes als die andere
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * Gemessen am Code, bevor ein Wort geschrieben wurde: Tastenflow, Punktgenau,
 * Klangpunkte und »im Griff« benutzen alle `tt_teachers`/`tt_pupils` und
 * denselben Ausweis-Speicher `tt_pb_auth`; die Klasse verwaltet die Lehrkraft
 * einmal für alle vier („Meine Klassen"). Das Hörbuch-Studio braucht kein Konto
 * und steht darum NICHT in der Aufzählung.
 *
 * ⚠️ Die Namen kommen aus `LW_PROGRAMS` gefiltert nach `released` - nie von
 *    Hand: Ein Programm, das der Admin geparkt hat, darf hier nicht als
 *    „gilt auch in …" stehen.
 * ⚠️ Der Block sagt „dieselben Zugangsdaten", NICHT „einmal anmelden": Der
 *    Ausweis liegt im localStorage, und der gehört zu EINEM Rechnernamen.
 *    Tastenflow wohnt unter `tastenflow.org` (`adressen.ts`), die übrigen
 *    unter `weingartner.org` - der Wechsel dazwischen verlangt eine neue
 *    Anmeldung. Der letzte Absatz sagt es offen, statt es zu verschweigen.
 * ⚠️ Kein Knopf und kein Formular in diesem Baustein: Konto ist ein Angebot,
 *    keine Pflicht. Das Formular bringt die Konto-Seite selbst mit.
 * ⚠️ Beide Sprachen (EN2): Die Konto-Seite spricht Englisch, wenn man aus
 *    Tastenflow kommt - ein deutscher Kasten in einer englischen Seite wäre
 *    ein Bruch mitten im Bildschirm.
 */
const T = texte({
  de: {
    titel: "Ein Konto für alle Programme",
    einleitung: (namen: string) =>
      `Mit einem Konto meldest du dich in ${namen} an - mit denselben Zugangsdaten. ` +
      "Dein Fortschritt in jedem Programm hängt an deinem Konto und nicht an einem Gerät.",
    klasseTitel: "In einer Klasse",
    klasseText:
      "Deine Lehrkraft legt die Klasse einmal an - für alle Programme zugleich. " +
      "Du bekommst Klassencode, Namen und Passwort und kommst damit in jedes Programm. " +
      "Deine Lehrkraft sieht deinen Stand in „Meine Klassen“.",
    alleinTitel: "Allein",
    alleinText:
      "Wer zu keiner Klasse gehört, legt sich selbst ein Konto an. Dafür braucht es eine " +
      "E-Mail-Adresse: Dorthin geht montags der Wochenbericht, aber nur in Wochen, in denen " +
      "wirklich geübt wurde.",
    ohneTitel: "Ohne Konto",
    ohneText: "Ausprobieren geht immer ohne. Dein Stand bleibt dann nur auf diesem Gerät.",
    anlegenOben: (namen: string) =>
      `Ein Konto legst du oben unter „Konto“ an - oder direkt in ${namen}: ` +
      "Wähle dort „Konto“ oder drück Alt + J.",
    anlegenHier: "Anmelden oder ein Konto anlegen kannst du gleich hier darunter.",
    tastenflowAdresse:
      " Tastenflow hat eine eigene Adresse (tastenflow.org): Dort meldest du dich einmal " +
      "extra an, mit denselben Zugangsdaten.",
  },
  en: {
    titel: "One account for all apps",
    einleitung: (namen: string) =>
      `With one account you sign in to ${namen} - with the same login details. ` +
      "Your progress in each app belongs to your account, not to a device.",
    klasseTitel: "In a class",
    klasseText:
      "Your teacher sets up the class once - for all the apps at the same time. " +
      "You get a class code, your name and a password, and with them you can get into every app. " +
      "Your teacher can see how you're getting on in “My classes”.",
    alleinTitel: "On your own",
    alleinText:
      "If you're not in a class, you create your own account. That needs an email address: " +
      "the weekly report is sent there on Mondays, but only in weeks when you really practised.",
    ohneTitel: "Without an account",
    ohneText: "You can always try things out without one. Your progress then stays on this device only.",
    anlegenOben: (namen: string) =>
      `You create an account under “Account” at the top - or directly in ${namen}: ` +
      "choose “Account” there, or press Alt + J.",
    anlegenHier: "You can sign in or create an account right below.",
    tastenflowAdresse:
      " Tastenflow has its own address (tastenflow.org): you sign in there once more, " +
      "with the same login details.",
  },
  fr: {
    titel: "Un compte pour tous les programmes",
    einleitung: (namen: string) =>
      `Avec un compte, tu te connectes à ${namen} - avec les mêmes identifiants. ` +
      "Tes progrès dans chaque programme sont liés à ton compte, pas à un appareil.",
    klasseTitel: "Dans une classe",
    klasseText:
      "La classe est créée une seule fois - pour tous les programmes à la fois. " +
      "Tu reçois un code de classe, un nom et un mot de passe, et tu entres avec eux dans chaque programme. " +
      'Ton enseignant ou ton enseignante voit tes progrès dans "Mes classes".',
    alleinTitel: "Sans classe",
    alleinText:
      "Qui n'appartient à aucune classe crée son propre compte. Cela demande une adresse e-mail : " +
      "le bilan hebdomadaire y arrive le lundi, mais seulement après une semaine avec de l'entrainement.",
    ohneTitel: "Sans compte",
    ohneText: "Essayer est toujours possible sans compte. Tes progrès restent alors seulement sur cet appareil.",
    anlegenOben: (namen: string) =>
      `Tu crées un compte en haut sous "Compte" - ou directement dans ${namen} : ` +
      'choisis "Compte" là-bas, ou appuie sur Alt + J.',
    anlegenHier: "Tu peux te connecter ou créer un compte juste en dessous.",
    tastenflowAdresse:
      " Tastenflow a sa propre adresse (tastenflow.org) : tu dois t'y connecter séparément, " +
      "avec les mêmes identifiants.",
  },
  // ★ ES-O (27.09.2026): tú (die Seite richtet sich an Lernende).
  es: {
    titel: "Una cuenta para todos los programas",
    einleitung: (namen: string) =>
      `Con una cuenta inicias sesión en ${namen} - con los mismos datos de acceso. ` +
      "Tu progreso en cada programa va unido a tu cuenta, no a un dispositivo.",
    klasseTitel: "En una clase",
    klasseText:
      "La clase se crea una sola vez - para todos los programas a la vez. " +
      "Recibes un código de clase, un nombre y una contraseña, y con ellos entras en cada programa. " +
      'Tu docente ve tu progreso en "Mis clases".',
    alleinTitel: "Sin clase",
    alleinText:
      "Quien no pertenece a ninguna clase crea su propia cuenta. Para ello hace falta un correo electrónico: " +
      "allí llega el resumen semanal los lunes, pero solo después de una semana con práctica.",
    ohneTitel: "Sin cuenta",
    ohneText: "Probar siempre es posible sin cuenta. Tu progreso se queda entonces solo en este dispositivo.",
    anlegenOben: (namen: string) =>
      `Creas una cuenta arriba, en "Cuenta" - o directamente en ${namen}: ` +
      'elige allí "Cuenta" o pulsa Alt + J.',
    anlegenHier: "Justo aquí debajo puedes iniciar sesión o crear una cuenta.",
    tastenflowAdresse:
      " Tastenflow tiene su propia dirección (tastenflow.org): allí tienes que iniciar sesión aparte, " +
      "con los mismos datos de acceso.",
  },
  // ★ O-IT (02.10.2026): Kinder und Selbstlernende „tu"; „l'insegnante" verrät
  // kein Geschlecht (Glossar Regel 2).
  it: {
    titel: "Un account per tutti i programmi",
    einleitung: (namen: string) =>
      `Con un account accedi a ${namen} - con gli stessi dati di accesso. ` +
      "I tuoi progressi in ogni programma sono legati al tuo account, non a un dispositivo.",
    klasseTitel: "In una classe",
    klasseText:
      "La classe viene creata una sola volta - per tutti i programmi insieme. " +
      "Ricevi codice classe, nome e password e con questi entri in ogni programma. " +
      `L'insegnante vede i tuoi progressi in "Le mie classi".`,
    alleinTitel: "Senza classe",
    alleinText:
      "Chi non fa parte di una classe crea da sé un account. Serve un indirizzo email: " +
      "lì il lunedì arriva il resoconto settimanale, ma solo nelle settimane in cui ci si è davvero esercitati.",
    ohneTitel: "Senza account",
    ohneText: "Provare si può sempre, anche senza account. I tuoi progressi restano allora solo su questo dispositivo.",
    anlegenOben: (namen: string) =>
      `Crei un account in alto, in "Account" - oppure direttamente in ${namen}: ` +
      'scegli lì "Account" oppure premi Alt + J.',
    anlegenHier: "Qui sotto puoi subito accedere o creare un account.",
    tastenflowAdresse:
      " Tastenflow ha un indirizzo tutto suo (tastenflow.org): lì accedi una volta a parte, " +
      "con gli stessi dati di accesso.",
  },
  // ★ O-PL (02.10.2026): „ty"; die Namen der Programme nach Doppelpunkt (bleiben
  // im Nominativ, Glossar Regel 11); „nauczyciele" meint alle (Regel 2).
  pl: {
    titel: "Jedno konto do wszystkich programów",
    einleitung: (namen: string) =>
      `Jednym kontem logujesz się do programów: ${namen} - tymi samymi danymi logowania. ` +
      "Twoje postępy w każdym programie są zapisane na koncie, a nie na urządzeniu.",
    klasseTitel: "W klasie",
    klasseText:
      "Klasę zakłada się raz - dla wszystkich programów naraz. " +
      "Dostajesz kod klasy, imię i hasło i wchodzisz nimi do każdego programu. " +
      "Nauczyciele widzą twoje postępy w sekcji „Moje klasy”.",
    alleinTitel: "Bez klasy",
    alleinText:
      "Bez klasy konto zakłada się samodzielnie. Potrzebny jest do tego adres e-mail: " +
      "w poniedziałki przychodzi na niego podsumowanie tygodnia, ale tylko za tygodnie, " +
      "w których naprawdę były ćwiczenia.",
    ohneTitel: "Bez konta",
    ohneText: "Wypróbować można zawsze, także bez konta. Twoje postępy zostają wtedy tylko na tym urządzeniu.",
    anlegenOben: (namen: string) =>
      `Konto założysz u góry w części „Konto” - albo bezpośrednio w programach: ${namen}. ` +
      "Wybierz tam „Konto” albo naciśnij Alt + J.",
    anlegenHier: "Zalogować się albo założyć konto możesz tutaj, poniżej.",
    tastenflowAdresse:
      " Tastenflow ma własny adres (tastenflow.org): tam logujesz się osobno, " +
      "tymi samymi danymi logowania.",
  },
  // ★ O-TR (02.10.2026): "sen"; die Programmnamen stehen nach dem Doppelpunkt,
  // ohne Endung (Glossar Regel 6); "Tastenflow programının" - die Endung trägt
  // "program".
  tr: {
    titel: "Tüm programlar için tek hesap",
    einleitung: (namen: string) =>
      `Tek bir hesapla, aynı giriş bilgileriyle şu programlara girersin: ${namen}. ` +
      "Her programdaki ilerlemen cihazda değil, hesabında kayıtlıdır.",
    klasseTitel: "Bir sınıfta",
    klasseText:
      "Öğretmenin sınıfı bir kez oluşturur - tüm programlar için aynı anda. " +
      "Sınıf kodunu, adını ve şifreni alırsın ve bunlarla her programa girersin. " +
      'Öğretmenin ilerlemeni "Sınıflarım" bölümünde görür.',
    alleinTitel: "Tek başına",
    alleinText:
      "Bir sınıfa bağlı olmayan kişi hesabını kendisi oluşturur. Bunun için bir e-posta " +
      "adresi gerekir: Haftalık rapor her pazartesi oraya gider, ama yalnızca gerçekten " +
      "çalışılan haftalarda.",
    ohneTitel: "Hesap olmadan",
    ohneText: "Denemek için hesap gerekmez. O zaman ilerlemen yalnızca bu cihazda kalır.",
    anlegenOben: (namen: string) =>
      `Hesabı yukarıdaki "Hesap" bölümünden oluşturursun - ya da doğrudan şu programlarda: ${namen}. ` +
      'Orada "Hesap" seçeneğini seç veya Alt + J tuşlarına bas.',
    anlegenHier: "Giriş yapmak veya hesap oluşturmak için hemen aşağıdaki formu kullanabilirsin.",
    tastenflowAdresse:
      " Tastenflow programının kendi adresi var (tastenflow.org): Orada aynı giriş " +
      "bilgileriyle ayrıca bir kez giriş yaparsın.",
  },
  // ★ O-CS (03.10.2026): "ty"; die Programmnamen stehen nach dem Doppelpunkt,
  // ungebeugt (Glossar Regel 12). Keine Vergangenheit und kein "sám/sama" über die
  // Person (Regel 2): "Bez třídy se účet vytváří samostatně", die Lehrkraft
  // "vyučující" im Nominativ.
  cs: {
    titel: "Jeden účet pro všechny programy",
    einleitung: (namen: string) =>
      `Jedním účtem se se stejnými přihlašovacími údaji přihlásíš do těchto programů: ${namen}. ` +
      "Tvůj pokrok v každém programu patří k tvému účtu, ne k zařízení.",
    klasseTitel: "Ve třídě",
    klasseText:
      "Vyučující vytvoří třídu jednou - pro všechny programy najednou. " +
      "Dostaneš kód třídy, jméno a heslo a s nimi se dostaneš do každého programu. " +
      "Vyučující vidí tvůj pokrok v části Moje třídy.",
    alleinTitel: "Bez třídy",
    alleinText:
      "Bez třídy se účet vytváří samostatně. Je k tomu potřeba e-mailová adresa: tam " +
      "chodí každé pondělí týdenní přehled, ale jen za týdny, ve kterých se opravdu " +
      "cvičilo.",
    ohneTitel: "Bez účtu",
    ohneText: "Vyzkoušet to jde vždycky i bez účtu. Tvůj pokrok pak zůstane jen v tomto zařízení.",
    anlegenOben: (namen: string) =>
      `Účet si vytvoříš nahoře v části Účet - nebo přímo v těchto programech: ${namen}. ` +
      "Vyber tam Účet nebo stiskni Alt + J.",
    anlegenHier: "Přihlásit se nebo vytvořit účet můžeš hned tady níže.",
    tastenflowAdresse:
      " Tastenflow má vlastní adresu (tastenflow.org): tam se přihlásíš ještě jednou " +
      "zvlášť, se stejnými přihlašovacími údaji.",
  },
  bg: {
    titel: "Един акаунт за всички програми",
    einleitung: (namen: string) =>
      `С един акаунт влизаш в тези програми: ${namen} - с едни и същи данни за вход. ` +
      "Напредъкът ти във всяка програма е свързан с акаунта, а не с устройството.",
    klasseTitel: "В клас",
    klasseText:
      "Учителят създава класа веднъж - за всички програми наведнъж. " +
      "Получаваш код на класа, име и парола и с тях влизаш във всяка програма. " +
      "Учителят вижда напредъка ти в „Моите класове“.",
    alleinTitel: "Без клас",
    alleinText:
      "Без клас акаунтът се създава самостоятелно. За това е нужен имейл адрес: там " +
      "всеки понеделник идва седмичният отчет, но само за седмици, в които наистина " +
      "има упражнения.",
    ohneTitel: "Без акаунт",
    ohneText: "Винаги можеш да опиташ и без акаунт. Тогава напредъкът ти остава само на това устройство.",
    anlegenOben: (namen: string) =>
      `Акаунт създаваш горе в „Акаунт“ - или направо в тези програми: ${namen}. ` +
      "Избери там „Акаунт“ или натисни Alt + J.",
    anlegenHier: "Можеш да влезеш или да създадеш акаунт точно тук, по-долу.",
    tastenflowAdresse:
      " Tastenflow има собствен адрес (tastenflow.org): там влизаш още веднъж " +
      "отделно, със същите данни за вход.",
  },
  el: {
    titel: "Ένας λογαριασμός για όλα τα προγράμματα",
    einleitung: (namen: string) =>
      `Με έναν λογαριασμό συνδέεσαι με τα ίδια στοιχεία σύνδεσης σε αυτά τα προγράμματα: ${namen}. ` +
      "Η πρόοδός σου σε κάθε πρόγραμμα ανήκει στον λογαριασμό σου, όχι σε μια συσκευή.",
    klasseTitel: "Σε τμήμα",
    klasseText:
      "Οι εκπαιδευτικοί σου δημιουργούν το τμήμα μία φορά - για όλα τα προγράμματα μαζί. " +
      "Παίρνεις κωδικό τμήματος, όνομα και κωδικό πρόσβασης και με αυτά μπαίνεις σε κάθε πρόγραμμα. " +
      "Οι εκπαιδευτικοί σου βλέπουν την πρόοδό σου στην ενότητα «Τα τμήματά μου».",
    alleinTitel: "Χωρίς τμήμα",
    alleinText:
      "Χωρίς τμήμα, ο λογαριασμός δημιουργείται χωριστά. Χρειάζεται για αυτό μια διεύθυνση e-mail: εκεί " +
      "έρχεται κάθε Δευτέρα η εβδομαδιαία αναφορά, αλλά μόνο για τις εβδομάδες που έγινε πραγματικά " +
      "εξάσκηση.",
    ohneTitel: "Χωρίς λογαριασμό",
    ohneText: "Μπορείς πάντα να δοκιμάσεις και χωρίς λογαριασμό. Η πρόοδός σου μένει τότε μόνο σε αυτή τη συσκευή.",
    anlegenOben: (namen: string) =>
      `Λογαριασμό δημιουργείς πάνω, στην ενότητα «Λογαριασμός» - ή κατευθείαν σε αυτά τα προγράμματα: ${namen}. ` +
      "Επίλεξε εκεί «Λογαριασμός» ή πάτησε Alt + J.",
    anlegenHier: "Μπορείς να συνδεθείς ή να δημιουργήσεις λογαριασμό αμέσως εδώ από κάτω.",
    tastenflowAdresse:
      " Το Tastenflow έχει δική του διεύθυνση (tastenflow.org): εκεί συνδέεσαι ακόμα μία φορά " +
      "χωριστά, με τα ίδια στοιχεία σύνδεσης.",
  },
  hu: {
    titel: "Egy fiók minden programhoz",
    einleitung: (namen: string) =>
      `Egy fiókkal, ugyanazokkal a belépési adatokkal jelentkezel be ezekbe a programokba: ${namen}. ` +
      "A haladásod minden programban a fiókodhoz tartozik, nem egy eszközhöz.",
    klasseTitel: "Osztályban",
    klasseText:
      "A tanárod egyszer hozza létre az osztályt - egyszerre minden programhoz. " +
      "Kapsz osztálykódot, nevet és jelszót, és ezekkel minden programba be tudsz lépni. " +
      "A tanárod az „Osztályaim” részben látja, hol tartasz.",
    alleinTitel: "Osztály nélkül",
    alleinText:
      "Aki nem tartozik osztályhoz, maga hoz létre fiókot. Ehhez e-mail-cím kell: oda " +
      "érkezik hétfőnként a heti összesítő, de csak azokon a heteken, amikor valóban " +
      "volt gyakorlás.",
    ohneTitel: "Fiók nélkül",
    ohneText: "Kipróbálni fiók nélkül is mindig lehet. A haladásod ekkor csak ezen az eszközön marad meg.",
    anlegenOben: (namen: string) =>
      `Fiókot fent, a „Fiók” résznél hozhatsz létre - vagy közvetlenül ezekben a programokban: ${namen}. ` +
      "Ott válaszd a „Fiók” lehetőséget, vagy nyomd meg az Alt + J billentyűket.",
    anlegenHier: "Bejelentkezni vagy fiókot létrehozni itt lent is tudsz.",
    tastenflowAdresse:
      " A Tastenflow programnak saját címe van (tastenflow.org): ott még egyszer külön " +
      "be kell jelentkezned, ugyanazokkal a belépési adatokkal.",
  },
  nl: {
    titel: "Eén account voor alle programma's",
    einleitung: (namen: string) =>
      `Met één account log je in bij ${namen} - met dezelfde inloggegevens. ` +
      "Je voortgang in elk programma hoort bij je account en niet bij een apparaat.",
    klasseTitel: "In een klas",
    klasseText:
      "Je leerkracht maakt de klas één keer aan - voor alle programma's tegelijk. " +
      "Je krijgt een klascode, je naam en een wachtwoord en komt daarmee in elk programma. " +
      "Je leerkracht ziet je voortgang in Mijn klassen.",
    alleinTitel: "Zonder klas",
    alleinText:
      "Wie niet in een klas zit, maakt zelf een account aan. Daarvoor is een e-mailadres nodig: " +
      "daar komt op maandag het weekverslag, maar alleen in weken waarin echt is geoefend.",
    ohneTitel: "Zonder account",
    ohneText: "Uitproberen kan altijd zonder account. Je voortgang blijft dan alleen op dit apparaat.",
    anlegenOben: (namen: string) =>
      `Een account maak je bovenaan aan onder Account - of direct in ${namen}: ` +
      "kies daar Account of druk op Alt + J.",
    anlegenHier: "Inloggen of een account aanmaken kan meteen hieronder.",
    tastenflowAdresse:
      " Tastenflow heeft een eigen adres (tastenflow.org): daar log je nog een keer apart in, " +
      "met dezelfde inloggegevens.",
  },
  pt: {
    titel: "Uma conta para todos os programas",
    einleitung: (namen: string) =>
      `Com uma só conta inicias sessão em ${namen} - com os mesmos dados de acesso. ` +
      "O teu progresso em cada programa fica na tua conta e não num dispositivo.",
    klasseTitel: "Numa turma",
    klasseText:
      "Quem ensina cria a turma uma vez - para todos os programas ao mesmo tempo. " +
      "Recebes o código da turma, um nome e uma palavra-passe e, com eles, entras em qualquer programa. " +
      "Quem ensina vê o teu progresso em \"As minhas turmas\".",
    alleinTitel: "Sem turma",
    alleinText:
      "Quem não pertence a nenhuma turma cria a sua própria conta. Para isso, é preciso um endereço " +
      "de e-mail: é para lá que vai o resumo semanal, à segunda-feira, mas só nas semanas em que " +
      "houve mesmo prática.",
    ohneTitel: "Sem conta",
    ohneText: "Experimentar é sempre possível sem conta. Nesse caso, o teu progresso fica só neste dispositivo.",
    anlegenOben: (namen: string) =>
      `Cria uma conta em cima, em "Conta" - ou diretamente em ${namen}: ` +
      "escolhe aí \"Conta\" ou prime Alt + J.",
    anlegenHier: "Podes iniciar sessão ou criar uma conta aqui mesmo, por baixo.",
    tastenflowAdresse:
      " O Tastenflow tem um endereço próprio (tastenflow.org): aí inicias sessão mais uma vez, " +
      "com os mesmos dados de acesso.",
  },
  br: {
    titel: "Uma conta para todos os aplicativos",
    einleitung: (namen: string) =>
      `Com uma só conta e os mesmos dados de acesso, você entra nestes aplicativos: ${namen}. ` +
      "Seu progresso em cada aplicativo fica na sua conta, não em um dispositivo.",
    klasseTitel: "Em uma turma",
    klasseText:
      "Quem dá aula cria a turma uma vez - para todos os aplicativos ao mesmo tempo. " +
      "Você recebe o código da turma, um nome e uma senha e, com eles, entra em todos os aplicativos. " +
      "Quem dá aula vê seu progresso em Minhas turmas.",
    alleinTitel: "Sem turma",
    alleinText:
      "Sem turma, cada pessoa cria a própria conta. Para isso, é preciso um endereço de e-mail: " +
      "para lá vai o resumo semanal às segundas-feiras, mas só nas semanas em que houve prática.",
    ohneTitel: "Sem conta",
    ohneText: "Experimentar sempre é possível sem conta. Nesse caso, seu progresso fica só neste dispositivo.",
    anlegenOben: (namen: string) =>
      `Você cria uma conta aqui em cima, em Conta - ou diretamente nestes aplicativos: ${namen}. ` +
      "Escolha Conta ali ou pressione Alt + J.",
    anlegenHier: "Você pode entrar ou criar uma conta logo abaixo.",
    tastenflowAdresse:
      " O Tastenflow tem um endereço próprio (tastenflow.org): lá você entra mais uma vez, " +
      "com os mesmos dados de acesso.",
  },
  ro: {
    titel: "Un singur cont pentru toate aplicațiile",
    einleitung: (namen: string) =>
      `Cu un singur cont te conectezi, cu aceleași date de conectare, la aceste aplicații: ${namen}. ` +
      "Progresul din fiecare aplicație ține de contul tău, nu de un dispozitiv.",
    klasseTitel: "Într-o clasă",
    klasseText:
      "Cadrul didactic creează clasa o singură dată - pentru toate aplicațiile deodată. " +
      "Primești codul clasei, numele și parola și cu ele intri în fiecare aplicație. " +
      "Cadrul didactic vede progresul tău în secțiunea Clasele mele.",
    alleinTitel: "Fără clasă",
    alleinText:
      "Fără clasă, contul se creează independent. Pentru asta este nevoie de o adresă de e-mail: " +
      "acolo vine în fiecare luni raportul săptămânal, dar numai pentru săptămânile în care " +
      "s-a exersat cu adevărat.",
    ohneTitel: "Fără cont",
    ohneText: "Poți încerca oricând și fără cont. Progresul tău rămâne atunci doar pe acest dispozitiv.",
    anlegenOben: (namen: string) =>
      `Îți creezi un cont sus, la Cont - sau direct în aceste aplicații: ${namen}. ` +
      "Alege acolo Cont sau apasă Alt + J.",
    anlegenHier: "Te poți conecta sau îți poți crea un cont chiar aici, mai jos.",
    tastenflowAdresse:
      " Tastenflow are o adresă proprie (tastenflow.org): acolo te conectezi încă o dată " +
      "separat, cu aceleași date de conectare.",
  },
  sv: {
    titel: "Ett konto för alla program",
    einleitung: (namen: string) =>
      `Med ett konto loggar du in i ${namen} - med samma inloggningsuppgifter. ` +
      "Dina framsteg i varje program hör till ditt konto och inte till en enhet.",
    klasseTitel: "I en klass",
    klasseText:
      "Din lärare skapar klassen en gång - för alla program samtidigt. " +
      "Du får klasskod, namn och lösenord och kommer med dem in i alla program. " +
      "Din lärare ser dina framsteg i Mina klasser.",
    alleinTitel: "På egen hand",
    alleinText:
      "Den som inte hör till någon klass skapar ett eget konto. Då behövs en e-postadress: dit " +
      "kommer veckorapporten på måndagar, men bara de veckor då du verkligen har övat.",
    ohneTitel: "Utan konto",
    ohneText: "Du kan alltid prova utan konto. Dina framsteg finns då bara kvar på den här enheten.",
    anlegenOben: (namen: string) =>
      `Du skapar ett konto högst upp under Konto - eller direkt i ${namen}: ` +
      "välj Konto där eller tryck på Alt + J.",
    anlegenHier: "Du kan logga in eller skapa ett konto här nedanför.",
    tastenflowAdresse:
      " Tastenflow har en egen adress (tastenflow.org): där loggar du in en gång till, " +
      "med samma inloggningsuppgifter.",
  },
  uk: {
    titel: "Один обліковий запис для всіх програм",
    einleitung: (namen: string) =>
      `Одним обліковим записом ти входиш із тими самими даними для входу в ці програми: ${namen}. ` +
      "Твій поступ у кожній програмі належить твоєму обліковому запису, а не пристрою.",
    klasseTitel: "У класі",
    klasseText:
      "Твій педагог створює клас один раз - для всіх програм одразу. " +
      "Ти отримуєш код класу, ім'я і пароль і з ними заходиш у кожну програму. " +
      "Твій педагог бачить твій поступ у розділі Мої класи.",
    alleinTitel: "Без класу",
    alleinText:
      "Без класу обліковий запис створюють самостійно. Для цього потрібна адреса електронної " +
      "пошти: туди щопонеділка приходить тижневий звіт, але тільки за ті тижні, коли справді " +
      "було тренування.",
    ohneTitel: "Без облікового запису",
    ohneText: "Спробувати можна завжди й без облікового запису. Тоді твій поступ залишається лише на цьому пристрої.",
    anlegenOben: (namen: string) =>
      `Обліковий запис можна створити вгорі в розділі Обліковий запис - або прямо в цих програмах: ${namen}. ` +
      "Вибери там Обліковий запис або натисни Alt + J.",
    anlegenHier: "Увійти або створити обліковий запис можна прямо тут, нижче.",
    tastenflowAdresse:
      " Tastenflow має власну адресу (tastenflow.org): там ти входиш ще раз окремо, " +
      "з тими самими даними для входу.",
  },
});

/** „A, B und C" - die Namen der Programme für einen Satz. */
// ★ O-TR (02.10.2026): "a, b ve c" (Glossar §2.10).
// ★ O-CS (03.10.2026): "a, b a c" (Glossar §2.10, wie `Intl.ListFormat("cs")`).
const UND: Record<BedienSprache, string> = {
  de: "und",
  en: "and",
  fr: "et",
  es: "y",
  it: "e",
  pl: "i",
  tr: "ve",
  cs: "a",
  bg: "и",
  el: "και",
  hu: "és",
  nl: "en",
  pt: "e",
  br: "e",
  ro: "și",
  sv: "och",
  uk: "і",
};
function aufzaehlung(namen: string[], sprache: BedienSprache): string {
  if (namen.length <= 1) return namen.join("");
  return `${namen.slice(0, -1).join(", ")} ${UND[sprache]} ${namen[namen.length - 1]}`;
}

export function KontoErklaerung({
  released,
  anmeldungHier = false,
  className = "card mt-8 p-6",
}: {
  /** Ist das Programm öffentlich freigegeben? (`useProgrammeCatalog`) */
  released: (key: string) => boolean;
  /**
   * Steht das Anmelde-Formular gleich darunter (Konto-Seite)? Dann verweist der
   * letzte Absatz darauf statt auf den Konto-Schalter oben - der Leser ist ja
   * schon dort.
   */
  anmeldungHier?: boolean;
  className?: string;
}) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const offen = LW_PROGRAMS.filter((p) => released(p.key));
  if (offen.length === 0) return null;
  const namen = aufzaehlung(
    offen.map((p) => p.label),
    sprache,
  );
  const mitTastenflow = offen.some((p) => p.key === "tippen");

  const punkte: { titel: string; text: string }[] = [
    { titel: t.klasseTitel, text: t.klasseText },
    { titel: t.alleinTitel, text: t.alleinText },
    { titel: t.ohneTitel, text: t.ohneText },
  ];

  return (
    <section aria-labelledby="konto-werbung-titel" className={className}>
      <h2 id="konto-werbung-titel" className="text-xl font-semibold tracking-tight">
        {t.titel}
      </h2>
      <p className="mt-2 max-w-[62ch] text-ink-muted">{t.einleitung(namen)}</p>
      {/* Auf der Konto-Seite (schmale Formularspalte, `max-w-lg`) stehen die drei
          Punkte untereinander: in drei Spalten wären es ~130 px breite
          Streifen, gemessen am 21.09.2026 im Browser. */}
      <dl className={anmeldungHier ? "mt-4 space-y-3" : "mt-4 grid gap-4 md:grid-cols-3"}>
        {punkte.map((p) => (
          <div key={p.titel}>
            <dt className="font-semibold text-ink">{p.titel}</dt>
            <dd className="mt-1 text-sm text-ink-muted">{p.text}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 max-w-[62ch] text-sm text-ink-muted">
        {/* Am Mac „Wahl + J" bzw. „Option + J" je Sprache (18.10.2026). */}
        {anmeldungHier ? t.anlegenHier : altAnzeige(t.anlegenOben(namen), istMacSystem(), WAHLTASTE[sprache])}
        {mitTastenflow ? t.tastenflowAdresse : ""}
      </p>
    </section>
  );
}
