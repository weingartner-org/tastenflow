/**
 * ★★ DIE TASTEN, DIE DIE HILFE BIS 18.10.2026 NICHT NANNTE (Kürzel einheitlich,
 * Johannes: „die Tastenkürzel sollen möglichst einheitlich bei allen Lern-Apps
 * sein").
 *
 * Gemessen an diesem Tag: Die Kürzel-Liste (Alt + T, `SEITEN_TEXTE` in
 * `TippenTrainerPage.tsx`) und die Hilfe (Alt + H, „Wichtige Tasten") nannten
 * VERSCHIEDENE Tasten. In der Hilfe fehlten Alt + O, J, B, W, G, R, M, 5, 6,
 * 7 / 8, Strg, Alt + X, Alt + 0 und das Melden - wer nur die Hilfe las, kannte
 * die Hälfte der Tasten nicht. Seitdem nennen beide dieselben; der Wächter
 * `tests/tastenflow-kuerzel-einheitlich.test.tsx` vergleicht sie in jeder
 * Sprache.
 *
 * ★ Warum eine Tabelle statt acht Mal dieselben `<li>` in acht Dateien: Die
 * Hilfe steht je Sprache in einer eigenen Datei (`TippenHilfe.<sprache>.tsx`).
 * Die NEUEN Zeilen stehen hier einmal, alle Sprachen nebeneinander - wer eine
 * Taste ergänzt, sieht sofort, welche Sprache noch fehlt. Die Wortlaute folgen
 * der Kürzel-Liste derselben Sprache.
 *
 * ⚠️ Alt + 7 / 8 nennt hier keine Klänge („Monster, Katzen …" wie die Liste):
 * Ausserhalb des deutschen Lernwegs darf die Hilfe kein Monster nennen
 * (`tests/tastenflow-d1-hoehle-ehrlich.test.tsx` - dort gibt es das Höhlenwesen nicht).
 *
 * ⚠️ Alt + 5 gilt NUR im Fenster „Tasten finden", Alt + X NUR während einer
 * Tippchallenge oder eines Klassenmatchs - beides steht im Text, denn ein
 * Kürzel, das ohne Bedingung genannt wird und dann nichts tut, sucht ein Kind
 * mit Blindheit als Fehler bei sich.
 */
import { GEZIELT_KUERZEL } from "@/lib/typing/gezieltKuerzel";
import { altAnzeige, istMacSystem } from "@/lib/altTaste";
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { pruefungWort } from "@/lib/typing/schreibprobe";
import { WAHLTASTE, WAHLTASTE_SATZ } from "@/lib/typing/wahltaste";
import { Kbd } from "./TippenHilfeTeile";

/** Eine Zeile: die Tasten (je Griff die einzelnen Tasten) und was sie tun. */
type Zeile = { tasten: string[][]; text: string };

/** Die Namen von Strg und Umschalt in der Sprache - wie in der Kürzel-Liste. */
const STRG: Record<BedienSprache, string> = {
  de: "Strg", en: "Ctrl", fr: "Ctrl", es: "Ctrl", it: "Ctrl", pl: "Ctrl", tr: "Ctrl", cs: "Ctrl",
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "Ctrl",
  el: "Ctrl",
  hu: "Ctrl",
  nl: "Ctrl",
  pt: "Ctrl",
  br: "Ctrl",
  ro: "Ctrl",
  sv: "Ctrl",
  uk: "Ctrl",
};
const UMSCHALT: Record<BedienSprache, string> = {
  de: "Umschalt", en: "Shift", fr: "Maj", es: "Mayús", it: "Maiusc", pl: "Shift", tr: "Shift", cs: "Shift",
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "Shift",
  el: "Shift",
  hu: "Shift",
  nl: "Shift",
  pt: "Shift",
  br: "Shift",
  ro: "Shift",
  sv: "Skift",
  uk: "Shift",
};

/** Die Texte je Sprache, in der Reihenfolge der Tasten unten. */
const TEXTE: Record<BedienSprache, Record<Schluessel, string>> = {
  de: {
    O: "Einstellungen öffnen oder schließen.",
    J: "Mein Konto öffnen oder schließen - angemeldet das Konto-Menü, sonst die Anmeldung.",
    B: "Übungsart reihum: Mein Training - Geschichten - Wortspiele.",
    W: "Die aktuelle Aufgabe noch einmal ansagen.",
    G: "Zur nächsten Überschrift springen - mit Vorlesen wird sie angesagt (G wie Gliederung, im Kreis).",
    R: "Die Einrichtung neu starten (Alter, Sprache, Tastatur, Ton).",
    M: "Klassenmatch ausschreiben: fünf Minuten um die Wette schreiben (nur in einer Klasse, wenn die Lehrkraft es erlaubt). Läuft schon eines, wird das gesagt.",
    "5": "Nur in „Tasten finden\": zwischen „Meine Tasten\" und „Alle Tasten\" wechseln.",
    "6": "Melodie beim Tippen an oder aus: Jede richtige Taste spielt den nächsten Ton.",
    "78": "Klang der Melodie: Alt + 7 zurück, Alt + 8 vor.",
    STRG: "Sofort still: Die laufende Ansage endet. Das Vorlesen bleibt an.",
    X: `Nur während einer ${pruefungWort("de")} oder eines Klassenmatchs: Restzeit ansagen, im Klassenmatch auch den Platz.`,
    PL: "Nur im Klassenmatch: sagt alle Plätze an - wer auf welchem Platz ist.",
    "0": "Das Schreibfeld wieder in normaler Größe.",
    P: "Einen Fehler melden - mit einem Bild des Fensters.",
  },
  en: {
    O: "Opens or closes the settings.",
    J: "Opens or closes your account - the account menu when you are signed in, otherwise sign in.",
    B: "Switches between the practice types: My training - Stories - Word games.",
    W: "Repeats the current task.",
    G: "Jumps to the next heading - announced when read aloud is on (starts again at the top).",
    R: "Starts the setup again (age, language, keyboard, sound).",
    M: "Starts a Class Match: race each other at typing for five minutes (only in a class, if the teacher allows it). If one is already running, it tells you.",
    "5": "Only in “Find keys”: switches between “My keys” and “All keys”.",
    "6": "Melody while typing on or off: every correct key plays the next note.",
    "78": "Melody sound: Alt + 7 back, Alt + 8 forward.",
    STRG: "Instant silence: the current announcement stops. Read aloud stays on.",
    X: `Only during a ${pruefungWort("en")} or a Class Match: tells you the time left, and in a Class Match your place too.`,
    PL: "Only in a Class Match: announces every place - who is in which place.",
    "0": "Makes the typing field normal size again.",
    P: "Reports a problem - with a picture of the window.",
  },
  fr: {
    O: "Ouvrir / fermer les réglages.",
    J: "Ouvrir / fermer ton compte - le menu du compte après la connexion, sinon la page de connexion.",
    B: "Changer de type d'exercice : Mon entrainement - Histoires - Jeux de lettres.",
    W: "Répéter l'activité en cours.",
    G: "Aller au titre suivant - annoncé si la lecture à voix haute est activée (reprend au début).",
    R: "Recommencer la configuration (âge, langue, clavier, son).",
    M: "Lancer un Match de la classe : cinq minutes de course de frappe (seulement dans une classe, si le Match de la classe y est autorisé). Si un match est déjà en cours, il te le dit.",
    "5": 'Seulement dans Trouver les touches : basculer entre "Mes touches" et "Toutes les touches".',
    "6": "Mélodie en tapant activée / désactivée : chaque bonne touche joue la note suivante.",
    "78": "Son de la mélodie : Alt + 7 en arrière, Alt + 8 en avant.",
    STRG: "Silence immédiat : l'annonce en cours s'arrête. La lecture à voix haute reste activée.",
    X: `Seulement pendant un ${pruefungWort("fr")} ou un Match de la classe : annonce le temps restant, et dans un Match de la classe aussi ta place.`,
    PL: "Seulement dans un Match de la classe : annonce toutes les places - qui est à quelle place.",
    "0": "Remet le champ de saisie à sa taille normale.",
    P: "Signaler un problème - avec une image de la fenêtre.",
  },
  es: {
    O: "Abrir o cerrar la configuración.",
    J: "Abrir o cerrar tu cuenta - el menú de la cuenta si has iniciado sesión, si no, la página para iniciar sesión.",
    B: "Cambiar el tipo de ejercicio: Mi entrenamiento - Cuentos - Juegos de palabras.",
    W: "Repetir la actividad actual.",
    G: "Ir al siguiente título - se anuncia si la lectura en voz alta está activada (vuelve a empezar al final).",
    R: "Volver a hacer la configuración inicial (edad, idioma, teclado, sonido).",
    M: "Empezar una Competición de la clase: cinco minutos de carrera escribiendo (solo en una clase, si allí está permitida la Competición de la clase). Si ya hay una en marcha, te lo dice.",
    "5": 'Solo en Buscar teclas: cambiar entre "Mis teclas" y "Todas las teclas".',
    "6": "Melodía al escribir activada o desactivada: cada tecla correcta toca la nota siguiente.",
    "78": "Sonido de la melodía: Alt + 7 atrás, Alt + 8 adelante.",
    STRG: "Silencio inmediato: se detiene el aviso en curso. La lectura en voz alta sigue activada.",
    X: `Solo durante un ${pruefungWort("es")} o una Competición de la clase: anuncia el tiempo que queda, y en la Competición de la clase también tu puesto.`,
    PL: "Solo en una Competición de la clase: anuncia todos los puestos - quién va en qué puesto.",
    "0": "Devuelve el campo de escritura a su tamaño normal.",
    P: "Informar de un problema - con una imagen de la ventana.",
  },
  it: {
    O: "Apri o chiudi le impostazioni.",
    J: "Apri o chiudi il tuo account - con l'accesso il menu dell'account, altrimenti la pagina per accedere.",
    B: "Tipo di esercizio a turno: Il mio allenamento - Storie - Giochi di parole.",
    W: "Annuncia di nuovo l'attività attuale.",
    G: "Vai al titolo successivo - con la lettura ad alta voce viene annunciato (dopo l'ultimo si ricomincia).",
    R: "Ricomincia la configurazione (età, lingua, tastiera, suono).",
    M: "Proponi una Gara di classe: cinque minuti di gara a chi scrive (solo in una classe, se l'insegnante lo permette). Se ce n'è già una in corso, te lo dice.",
    "5": 'Solo in Trova i tasti: passa da "I miei tasti" a "Tutti i tasti" e viceversa.',
    "6": "Melodia mentre scrivi sì o no: ogni tasto giusto suona la nota seguente.",
    "78": "Suono della melodia: Alt + 7 indietro, Alt + 8 avanti.",
    STRG: "Silenzio immediato: l'annuncio in corso si ferma. La lettura ad alta voce resta attiva.",
    X: `Solo durante una ${pruefungWort("it")} o una Gara di classe: annuncia il tempo che resta, e nella Gara di classe anche il tuo posto.`,
    PL: "Solo in una Gara di classe: annuncia tutti i posti - chi è in quale posto.",
    "0": "Riporta il campo di scrittura alla dimensione normale.",
    P: "Segnala un problema - con un'immagine della finestra.",
  },
  pl: {
    O: "Otwórz lub zamknij ustawienia.",
    J: "Otwórz lub zamknij moje konto - po zalogowaniu menu konta, bez logowania okno logowania.",
    B: "Rodzaj ćwiczenia po kolei: Mój trening - Opowiadania - Gry słowne.",
    W: "Odczytaj ponownie bieżące zadanie.",
    G: "Przejdź do następnego nagłówka - przy czytaniu na głos zostaje odczytany (po ostatnim od nowa).",
    R: "Zacznij konfigurację od nowa (wiek, język, klawiatura, dźwięk).",
    M: "Ogłoś Wyścig klasowy: pięć minut pisania na wyścigi (tylko w klasie, jeśli nauczyciele na to pozwalają). Jeśli jakiś już trwa, program o tym powie.",
    "5": "Tylko w oknie Znajdź klawisze: przełączanie między „Moje klawisze” i „Wszystkie klawisze”.",
    "6": "Melodia podczas pisania: włącz lub wyłącz - każdy dobry klawisz gra następną nutę.",
    "78": "Dźwięk melodii: Alt + 7 wstecz, Alt + 8 dalej.",
    STRG: "Natychmiastowa cisza: bieżący komunikat się kończy. Czytanie na głos zostaje włączone.",
    X: `Odczytaj pozostały czas (tylko w trakcie: ${pruefungWort("pl")} albo Wyścig klasowy) - w Wyścigu klasowym także miejsce.`,
    PL: "Tylko w Wyścigu klasowym: odczytuje wszystkie miejsca - kto jest na którym miejscu.",
    "0": "Przywróć normalny rozmiar pola pisania.",
    P: "Zgłoś problem - z obrazem okna.",
  },
  tr: {
    O: "Ayarları aç / kapat.",
    J: "Hesabımı aç / kapat - giriş yapıldıysa hesap menüsü, yoksa giriş sayfası.",
    B: "Alıştırma türleri sırayla: Antrenmanım - Öyküler - Kelime oyunları.",
    W: "Şu anki görevi yeniden seslendir.",
    G: "Sonraki başlığa git - sesli okuma açıksa başlık okunur (sonuncudan sonra baştan).",
    R: "Kurulumu yeniden başlat (yaş, dil, klavye, ses efektleri).",
    M: "Sınıf Maçı başlat: beş dakika yarışarak yazma (yalnızca bir sınıfta, öğretmen izin verirse). Zaten bir maç sürüyorsa program bunu söyler.",
    "5": 'Yalnızca Tuşları Bul penceresinde: "Tuşlarım" ile "Tüm tuşlar" arasında geçiş.',
    "6": "Yazarken melodi: aç / kapat - her doğru tuş bir sonraki notayı çalar.",
    "78": "Melodi sesi: Alt + 7 geri, Alt + 8 ileri.",
    STRG: "Hemen sustur: süren duyuru biter. Sesli okuma açık kalır.",
    X: `Yalnızca ${pruefungWort("tr")} ya da Sınıf Maçı sırasında: kalan süreyi seslendirir, Sınıf Maçında yerini de söyler.`,
    PL: "Yalnızca Sınıf Maçında: tüm sıralamayı seslendirir - kim kaçıncı sırada.",
    "0": "Yazma alanını normal boyutuna döndür.",
    P: "Sorun bildir - pencerenin bir görüntüsüyle.",
  },
  cs: {
    O: "Otevřít / zavřít nastavení.",
    J: "Otevřít / zavřít Můj účet - po přihlášení nabídka účtu, jinak přihlášení.",
    B: "Druh cvičení dokola: Můj trénink - Příběhy - Slovní hry.",
    W: "Znovu přečíst aktuální úkol.",
    G: "Přejít na další nadpis - s předčítáním se nadpis přečte (po posledním znovu od začátku).",
    R: "Spustit úvodní nastavení znovu (věk, jazyk, klávesnice, zvuk).",
    M: "Vyhlásit Třídní závod: pět minut psaní o závod (jen ve třídě, pokud to vyučující povolí). Pokud už nějaký běží, program to řekne.",
    "5": "Jen v okně Hledání kláves: přepínání mezi Moje klávesy a Všechny klávesy.",
    "6": "Melodie při psaní: zapnout / vypnout - každá správná klávesa zahraje další tón.",
    "78": "Zvuk melodie: Alt + 7 zpět, Alt + 8 dál.",
    STRG: "Okamžité ztišení: právě běžící hlášení skončí. Předčítání zůstane zapnuté.",
    X: `Přečíst zbývající čas (jen během: ${pruefungWort("cs")} nebo Třídní závod) - v Třídním závodě také místo.`,
    PL: "Jen v Třídním závodě: přečte všechna místa - kdo je na kterém místě.",
    "0": "Vrátit pole pro psaní na normální velikost.",
    P: "Nahlásit problém - s obrázkem okna.",
  },
  // ★ O2-COMP (30.10.2026): bg eigene Fassung.
  bg: {
      O: "Отваря или затваря настройките.",
      J: "Отваря или затваря акаунта - след вход менюто на акаунта, иначе входа.",
      B: "Сменя вида упражнение поред: Моята тренировка - Истории - Игри с думи.",
      W: "Казва още веднъж текущата задача.",
      G: "Отива на следващото заглавие - при четене на глас то се прочита (след последното отново отначало).",
      R: "Пуска първоначалната настройка отново (възраст, език, клавиатура, звук).",
      M: "Обявява Състезание в класа: пет минути писане наперегонки (само в клас и ако е разрешено за класа). Ако вече тече едно, програмата го казва.",
      "5": "Само в Търсене на клавиши: превключва между Моите клавиши и Всички клавиши.",
      "6": "Мелодия при писане: включва или изключва - всеки верен клавиш свири следващия тон.",
      "78": "Звук на мелодията: Alt + 7 назад, Alt + 8 напред.",
      STRG: "Веднага тишина: текущото съобщение спира. Четенето на глас остава включено.",
      X: `Само по време на ${pruefungWort("bg")} или Състезание в класа: казва оставащото време, а в състезанието и мястото.`,
      PL: "Само в Състезание в класа: казва всички места - кой на кое място е.",
      "0": "Връща полето за писане в нормален размер.",
      P: "Съобщава за проблем - със снимка на прозореца.",
    },
  // ★ O2-COMP (30.10.2026): el eigene Fassung.
  el: {
      O: "Ανοίγει ή κλείνει τις Ρυθμίσεις.",
      J: "Ανοίγει ή κλείνει τον λογαριασμό σου - με σύνδεση το μενού λογαριασμού, αλλιώς τη σύνδεση.",
      B: "Αλλάζει είδος άσκησης με τη σειρά: Η εξάσκησή μου - Ιστορίες - Παιχνίδια λέξεων.",
      W: "Εκφωνεί ξανά την τρέχουσα άσκηση.",
      G: "Πηγαίνει στην επόμενη επικεφαλίδα - με ενεργή Εκφώνηση την ακούς (μετά την τελευταία, ξανά από την αρχή).",
      R: "Ξεκινά ξανά τις αρχικές ρυθμίσεις (ηλικία, γλώσσα, πληκτρολόγιο, ήχος).",
      M: "Ξεκινά Αγώνα τμήματος: πέντε λεπτά γραφής σε αγώνα (μόνο σε τμήμα, αν επιτρέπεται στο τμήμα). Αν τρέχει ήδη ένας, σου το λέει.",
      "5": "Μόνο στο «Βρες τα πλήκτρα»: εναλλαγή ανάμεσα σε «Τα πλήκτρα μου» και «Όλα τα πλήκτρα».",
      "6": "Μελωδία όσο γράφεις: ενεργή ή ανενεργή - κάθε σωστό πλήκτρο παίζει την επόμενη νότα.",
      "78": "Ήχος μελωδίας: Alt + 7 πίσω, Alt + 8 μπροστά.",
      STRG: "Άμεση σίγαση: η τρέχουσα ανακοίνωση σταματά. Η Εκφώνηση μένει ενεργή.",
      // Wort nach Doppelpunkt, ungebeugt (wie cs) - „μιας Πρόκλησης" ließe sich aus dem Wort nicht bilden.
      X: `Εκφωνεί τον χρόνο που απομένει (μόνο σε: ${pruefungWort("el")} ή Αγώνας τμήματος) - στον Αγώνα τμήματος και τη θέση σου.`,
      PL: "Μόνο σε Αγώνα τμήματος: εκφωνεί όλες τις θέσεις - ποιος είναι σε ποια θέση.",
      "0": "Επαναφέρει το πεδίο γραφής σε κανονικό μέγεθος.",
      P: "Αναφορά προβλήματος - με εικόνα του παραθύρου.",
    },
  // ★ O2-COMP (30.10.2026): hu eigene Fassung.
  hu: {
      O: "Megnyitja vagy bezárja a Beállításokat.",
      J: "Megnyitja vagy bezárja a Saját fiókot - bejelentkezve a fiók menüjét, különben a bejelentkezést.",
      B: "Gyakorlattípus körbe: Saját gyakorlás - Történetek - Szójátékok.",
      W: "Újra bemondja az aktuális feladatot.",
      G: "A következő címsorra ugrik - felolvasással be is mondja (a végén elölről kezdi).",
      R: "Újraindítja az első beállítást (életkor, nyelv, billentyűzet, hang).",
      M: "Osztályversenyt hirdet: öt perc gépelés versenyben (csak osztályban, ha a tanár engedi). Ha már fut egy, ezt bemondja.",
      "5": "Csak a „Billentyűk keresése” ablakban: váltás a „Saját billentyűim” és a „Minden billentyű” között.",
      "6": "Dallam gépelés közben be vagy ki: minden helyes billentyű a következő hangot játssza.",
      "78": "A dallam hangszíne: Alt + 7 vissza, Alt + 8 előre.",
      STRG: "Azonnali csend: az épp futó bemondás leáll. A felolvasás bekapcsolva marad.",
      X: `Csak ${pruefungWort("hu")} vagy Osztályverseny közben: bemondja a hátralévő időt, az Osztályversenyben a helyezést is.`,
      PL: "Csak Osztályversenyen: bemondja az összes helyezést - ki hányadik.",
      "0": "A gépelési mező újra normál méretű lesz.",
      P: "Hiba bejelentése - az ablakról készült képpel.",
    },
  // ★ O2-COMP (30.10.2026): nl eigene Fassung.
  nl: {
      O: "Instellingen openen of sluiten.",
      J: "Mijn account openen of sluiten - ingelogd het accountmenu, anders het inloggen.",
      B: "Soort oefening wisselen: Mijn training - Verhalen - Woordspelletjes.",
      W: "De huidige taak nog een keer voorlezen.",
      G: "Naar de volgende kop springen - met Voorlezen wordt de kop voorgelezen (na de laatste weer bovenaan).",
      R: "De eerste stappen opnieuw doorlopen (leeftijd, taal, toetsenbord, geluid).",
      M: "Een klassenwedstrijd uitschrijven: vijf minuten tegen elkaar typen (alleen in een klas, als de leerkracht het toestaat). Loopt er al een, dan hoor je dat.",
      "5": "Alleen in \"Toetsen zoeken\": wisselen tussen \"Mijn toetsen\" en \"Alle toetsen\".",
      "6": "Melodie bij het typen aan of uit: elke goede toets speelt de volgende toon.",
      "78": "Klank van de melodie: Alt + 7 terug, Alt + 8 verder.",
      STRG: "Meteen stil: de melding die bezig is, stopt. Voorlezen blijft aan.",
      X: `Alleen tijdens een ${pruefungWort("nl")} of een klassenwedstrijd: de resterende tijd laten horen, in de klassenwedstrijd ook je plaats.`,
      PL: "Alleen in een klassenwedstrijd: leest alle plaatsen voor - wie op welke plaats staat.",
      "0": "Het typveld weer op normale grootte.",
      P: "Een probleem melden - met een afbeelding van het venster.",
    },
  // ★ O2-COMP (30.10.2026): pt eigene Fassung.
  pt: {
      O: "Abrir ou fechar as definições.",
      J: "Abrir ou fechar A minha conta - com sessão iniciada, o menu da conta; caso contrário, o início de sessão.",
      B: "Tipo de exercício, à vez: O meu treino - Histórias - Jogos de palavras.",
      W: "Voltar a dizer a tarefa atual.",
      G: "Saltar para o título seguinte - com a leitura em voz alta, o título é lido (depois do último, volta ao início).",
      R: "Repetir a configuração inicial (idade, língua, teclado, som).",
      M: "Lançar uma Corrida da turma: cinco minutos de escrita a competir (só numa turma, se quem ensina o permitir). Se já houver uma a decorrer, o programa avisa.",
      "5": "Só em \"Encontrar as teclas\": alternar entre \"As minhas teclas\" e \"Todas as teclas\".",
      "6": "Melodia ao escrever: ligar ou desligar - cada tecla certa toca a nota seguinte.",
      "78": "Som da melodia: Alt + 7 para trás, Alt + 8 para a frente.",
      STRG: "Silêncio imediato: o anúncio em curso termina. A leitura em voz alta continua ligada.",
      X: `Só durante um ${pruefungWort("pt")} ou uma Corrida da turma: dizer o tempo restante e, na Corrida da turma, também o lugar.`,
      PL: "Só na Corrida da turma: diz todos os lugares - quem está em que lugar.",
      "0": "Repor o tamanho normal do campo de escrita.",
      P: "Comunicar um problema - com uma imagem da janela.",
    },
  // ★ O2-COMP (30.10.2026): br eigene Fassung.
  br: {
      O: "Abre ou fecha as configurações.",
      J: "Abre ou fecha Minha conta - depois de entrar na conta, o menu da conta; senão, a tela de entrada.",
      B: "Muda o tipo de prática: Meu treino - Histórias - Jogos de palavras.",
      W: "Lê de novo o exercício atual.",
      G: "Vai para o próximo título - com a leitura em voz alta ligada, ele é lido (depois do último, volta ao começo).",
      R: "Começa a configuração inicial de novo (idade, idioma, teclado, som).",
      M: "Convoca uma Competição da turma: cinco minutos de corrida de digitação (só dentro de uma turma, se quem dá aula permitir). Se já houver uma em andamento, o programa avisa.",
      "5": "Só em Encontrar teclas: alterna entre Minhas teclas e Todas as teclas.",
      "6": "Liga ou desliga a melodia ao digitar: cada tecla certa toca a próxima nota.",
      "78": "Som da melodia: Alt + 7 volta, Alt + 8 avança.",
      STRG: "Silêncio imediato: o aviso atual para. A leitura em voz alta continua ligada.",
      X: `Só durante um ${pruefungWort("br")} ou uma Competição da turma: diz o tempo que falta e, na Competição da turma, também a sua posição.`,
      PL: "Só na Competição da turma: anuncia todas as posições - quem está em qual posição.",
      "0": "Volta o campo de digitação ao tamanho normal.",
      P: "Relata um problema - com uma imagem da janela.",
    },
  // ★ O2-COMP (30.10.2026): ro eigene Fassung.
  ro: {
      O: "Deschide sau închide setările.",
      J: "Deschide sau închide Contul meu - meniul contului după ce ai intrat în cont, altfel conectarea.",
      B: "Tipul de exercițiu, pe rând: Antrenamentul meu - Povești - Jocuri cu cuvinte.",
      W: "Citește din nou sarcina actuală.",
      G: "Sare la titlul următor - cu citirea cu voce tare, titlul este anunțat (după ultimul, din nou de la început).",
      R: "Pornește din nou configurarea (vârstă, limbă, tastatură, sunet).",
      M: "Pornește o Întrecere a clasei: cinci minute de scris în întrecere (doar într-o clasă, dacă cadrul didactic permite). Dacă una este deja în desfășurare, programul îți spune.",
      "5": "Doar în Căutarea tastelor: comută între Tastele mele și Toate tastele.",
      "6": "Melodia la scris, pornită sau oprită: fiecare tastă corectă cântă nota următoare.",
      "78": "Sunetul melodiei: Alt + 7 înapoi, Alt + 8 înainte.",
      STRG: "Liniște imediată: anunțul în curs se oprește. Citirea cu voce tare rămâne pornită.",
      X: `Anunță timpul rămas (doar în timpul: ${pruefungWort("ro")} sau Întrecerea clasei) - în Întrecerea clasei și locul.`,
      PL: "Doar în Întrecerea clasei: anunță toate locurile - cine pe ce loc este.",
      "0": "Readuce câmpul de scriere la dimensiunea normală.",
      P: "Raportează o problemă - cu o imagine a ferestrei.",
    },
  // ★ O2-COMP (30.10.2026): sv eigene Fassung.
  sv: {
      O: "Öppnar eller stänger Inställningar.",
      J: "Öppnar eller stänger Mitt konto - kontomenyn när du är inloggad, annars inloggningen.",
      B: "Byter övningsform i tur och ordning: Min träning - Berättelser - Ordlekar.",
      W: "Läser upp den aktuella uppgiften igen.",
      G: "Hoppar till nästa rubrik - med Uppläsning på läses den upp (efter den sista börjar det om uppifrån).",
      R: "Startar kom igång igen (ålder, språk, tangentbord, ljud).",
      M: "Startar en Klasstävling: skriv i kapp i fem minuter (bara i en klass, om läraren tillåter det). Om en redan pågår får du veta det.",
      "5": "Bara i Hitta tangenterna: växlar mellan Mina tangenter och Alla tangenter.",
      "6": "Melodi när du skriver, på eller av: varje rätt tangent spelar nästa ton.",
      "78": "Melodins klang: Alt + 7 bakåt, Alt + 8 framåt.",
      STRG: "Tyst direkt: det pågående meddelandet slutar. Uppläsningen är fortfarande på.",
      X: `Bara under en ${pruefungWort("sv")} eller en Klasstävling: läser upp tiden som är kvar, i Klasstävlingen även din placering.`,
      PL: "Bara i en Klasstävling: läser upp alla placeringar - vem som är på vilken plats.",
      "0": "Gör skrivfältet normalstort igen.",
      P: "Rapporterar ett problem - med en bild av fönstret.",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      O: "Відкриває або закриває налаштування.",
      J: "Відкриває або закриває обліковий запис - після входу меню облікового запису, інакше вхід.",
      B: "Перемикає вид вправи по колу: Моє тренування - Історії - Ігри зі словами.",
      W: "Ще раз промовляє поточне завдання.",
      G: "Переходить до наступного заголовка - якщо ввімкнено читання вголос, він промовляється (після останнього знову спочатку).",
      R: "Знову запускає початкове налаштування (вік, мова, клавіатура, звук).",
      M: "Оголошує Перегони класу: п'ять хвилин друку наввипередки (лише в класі, якщо це дозволяє педагог). Якщо перегони вже тривають, програма про це скаже.",
      "5": "Лише в розділі Знайти клавіші: перемикає між Мої клавіші і Усі клавіші.",
      "6": "Мелодія під час друку: вмикає або вимикає - кожна правильна клавіша грає наступну ноту.",
      "78": "Звук мелодії: Alt + 7 назад, Alt + 8 вперед.",
      STRG: "Миттєва тиша: поточне повідомлення завершується. Читання вголос залишається ввімкненим.",
      X: `Лише під час такого завдання: ${pruefungWort("uk")} або Перегони класу - промовляє, скільки часу залишилося, а в Перегонах класу ще й місце.`,
      PL: "Лише в Перегонах класу: оголошує всі місця - хто на якому місці.",
      "0": "Повертає поле для друку до звичайного розміру.",
      P: "Повідомляє про проблему - із зображенням вікна.",
    },
};

type Schluessel = "O" | "J" | "B" | "W" | "G" | "R" | "M" | "5" | "6" | "78" | "STRG" | "X" | "PL" | "0" | "P";

function zeilen(sprache: BedienSprache): Zeile[] {
  const t = TEXTE[sprache];
  const alt = (taste: string) => ["Alt", taste];
  return [
    { tasten: [alt("O")], text: t.O },
    { tasten: [alt("J")], text: t.J },
    { tasten: [alt("B")], text: t.B },
    { tasten: [alt("W")], text: t.W },
    { tasten: [alt("G")], text: t.G },
    { tasten: [alt("R")], text: t.R },
    { tasten: [alt("M")], text: t.M },
    { tasten: [alt("X")], text: t.X },
    // ★ Tester 13.11.2026: die ganze Platzliste im Klassenmatch.
    { tasten: [alt("P")], text: t.PL },
    // ★ 13.11.2026: „Gezielt üben" - der Wortlaut steht in `gezieltKuerzel.ts` (Liste, Hilfe und Handbücher lesen dieselbe Zeile).
    { tasten: [alt("2")], text: GEZIELT_KUERZEL[sprache] },
    { tasten: [alt("5")], text: t["5"] },
    { tasten: [alt("6")], text: t["6"] },
    { tasten: [alt("7"), alt("8")], text: t["78"] },
    { tasten: [[STRG[sprache]]], text: t.STRG },
    { tasten: [alt("0")], text: t["0"] },
    { tasten: [["Alt", UMSCHALT[sprache], "P"]], text: t.P },
  ];
}

/**
 * Die weiteren Zeilen für die Liste „Wichtige Tasten" - als `<li>` in
 * derselben Bauart wie die Zeilen darüber. Gehört IN deren `<ul>`.
 */
export function WeitereTasten() {
  const { spracheGewaehlt } = useBedienSprache();
  const mac = istMacSystem();
  return (
    <>
      {zeilen(spracheGewaehlt).map(({ tasten, text }) => (
        <li key={tasten.map((g) => g.join("+")).join("/")} className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="min-w-[8.5rem] shrink-0">
            {tasten.map((griff, i) => (
              <span key={griff.join("+")}>
                {i > 0 && " / "}
                {griff.map((taste, j) => (
                  <span key={taste}>
                    {j > 0 && " + "}
                    <Kbd>{taste}</Kbd>
                  </span>
                ))}
              </span>
            ))}
          </span>
          <span>{altAnzeige(text, mac, WAHLTASTE[spracheGewaehlt])}</span>
        </li>
      ))}
    </>
  );
}

/**
 * Der Satz über der Liste: sonst „Alt ist auf dem Mac die ⌥-Taste" (wie er in
 * der Fassung steht), am Mac der Satz, den auch die Kürzel-Liste dort zeigt -
 * die Tasten heißen dann schon „Wahl".
 */
export function AltOderWahl({ children }: { children: React.ReactNode }) {
  const { spracheGewaehlt } = useBedienSprache();
  return <>{istMacSystem() ? WAHLTASTE_SATZ[spracheGewaehlt] : children}</>;
}
