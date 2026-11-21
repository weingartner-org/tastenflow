/**
 * ★★ DIE TEXTE DER RUNDGÄNGE (Z4, 19.09.2026) - deutsch und englisch.
 *
 * Die Regel steht in `lib/typing/rundgang.ts`, die Oberfläche in
 * `components/typing/Rundgang.tsx`. Hier nur, was gelesen und gehört wird.
 *
 * ── WIE EIN SCHRITT SPRICHT ────────────────────────────────────────────────
 * Jeder Schritt hat einen NAMEN (der Bereich, um den es geht) und einen SATZ.
 * Sichtbar steht der Name fett davor; in der Ansage (Live-Bereich und
 * Vorlese-Stimme) steht „Name: Satz". ⚠️ Der Name ist Pflicht und keine
 * Zierde: Ein Leuchtrahmen sagt einem Screenreader nichts - er erfährt nur
 * aus dem TEXT, welcher Bereich gemeint ist (dieselbe Regel wie in
 * `SimEinfuehrung.tsx`).
 *
 * ── DREI TONLAGEN AUF DER ÜBUNGSSEITE ──────────────────────────────────────
 * Kinder kurz und warm, Jugendliche knapp, Erwachsene sachlich (`skin.ts`).
 * Die ANREDE ist seit 19.09.2026 eine eigene Achse (`anredeFuer`): Alle
 * Lernenden lesen „du", auch ab 16 - „Sie" liest nur die Lehrkraft, und die
 * bekommt immer den Erwachsenen-Ton (`Rundgang.tsx`). „Meine Klassen" siezt
 * immer.
 * Englisch: britisch, Wörter aus `GLOSSAR-ENGLISCH.md` (§3.1, §3.3, §3.6,
 * §3.8, §3.12) - „Rundgang" heisst *tour*. Zu sehen in der englischen Bedienung.
 *
 * Hausregeln: echte Umlaute, nur Bindestrich `-`, keine Maus-Wörter (die
 * Tastenwege stehen dabei), nie etwas gegen ein Kind, Person zuerst.
 */
import { texte } from "@/lib/bedienSprache";
import { isFormal, type Anrede } from "./skin";

/** Die Tonlage (`skinForStufe`). */
export type RundgangTon = "kind" | "jugend" | "erwachsen";
/** Wer auf der Übungsseite steht - davon hängen Stand-Zeile und Konto-Menü ab. */
export type RundgangWer = "gast" | "klassenkind" | "selbstlernend" | "lehrkraft";

/** „Sie"? Nur die Lehrkraft, im Erwachsenen-Ton (`isFormal`, skin.ts). */
const sie = (ton: RundgangTon, anrede: Anrede) => isFormal(ton, anrede);

export const RUNDGANG_TEXTE = texte({
  de: {
    name: "Rundgang",
    zaehler: (nr: number, von: number) => `Rundgang ${nr} von ${von}`,
    weiter: "Weiter",
    fertig: "Fertig",
    ueberspringen: "Überspringen",
    geschafft: "Geschafft.",
    nochmalUeben: "Rundgang noch einmal",
    durchUebungsseite: "Rundgang durch die Übungsseite",
    durchMeineKlassen: "Rundgang durch Meine Klassen",
    durchDieSeite: "Rundgang durch die Seite",
    nochmalTipp: "Zeigt die Bereiche der Übungsseite noch einmal, Schritt für Schritt.",
    meineKlassenTipp: "Zeigt die Bereiche von „Meine Klassen\" Schritt für Schritt.",

    // ── Die Übungsseite ────────────────────────────────────────────────
    uebenZeileName: (_ton: RundgangTon) => "Die Übungszeile",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Hier tippst du ab, was dasteht. Fang einfach an - der erste Buchstabe landet schon hier."
        : sie(ton, anrede)
          ? "Hier tippen Sie den Text ab - einfach lostippen. Mit Alt + E sind Sie jederzeit wieder hier."
          : "Hier tippst du den Text ab - einfach lostippen. Mit Alt + E bist du jederzeit wieder hier.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede) ? "Ihr Stand" : "Dein Stand",
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? "Über der Übungszeile: Ihre Stufe, Ihre Übezeit von heute, Ihr Wochenziel und die nächste neue Taste. „Spielen\" startet ein Spiel, „Klassenmatch\" (Alt + M) ein Wettschreiben mit der Klasse."
          : "Über der Übungszeile: Ihre Stufe, Ihre Übezeit von heute und die nächste neue Taste. „Spielen\" startet ein Spiel."
        : wer === "klassenkind"
          ? "Über der Übungszeile: deine Stufe, deine Übezeit von heute, dein Wochenziel und die nächste neue Taste. „Spielen\" startet ein Spiel, „Klassenmatch\" (Alt + M) ein Wettschreiben mit deiner Klasse."
          : "Über der Übungszeile: deine Stufe, deine Übezeit von heute und die nächste neue Taste. „Spielen\" startet ein Spiel.",
    uebenTastaturName: (_ton: RundgangTon) => "Die Bildschirm-Tastatur",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Sie zeigt dir, welche Taste als Nächstes dran ist. Mit dem Knopf darüber blendest du sie aus und wieder ein."
        : "Sie zeigt, welche Taste als Nächstes dran ist. Der Knopf darüber blendet sie aus und wieder ein.",
    uebenArtName: (_ton: RundgangTon) => "Die Übungsarten",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Du kannst auf drei Arten üben: „Mein Training\", „Geschichten\" und „Wortspiele\". Mit Alt + B kommst du zur nächsten."
        : "Drei stehen zur Wahl: „Mein Training\", „Geschichten\" und „Wortspiele\". Alt + B wechselt zur nächsten.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "Die Werkzeuge",
    // Die Erwachsenen-Fassung nennt mehr Werkzeuge - das ist der Ton, keine
    // Anrede; sie gilt darum für Du und Sie gleich.
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "In der Kopfzeile: Hilfe (Alt + H), alle Tastenkürzel (Alt + T), Einstellungen (Alt + O), Farben und Kontrast (Alt + K) und Vorlesen (Alt + V)."
        : ton === "kind"
          ? "In der Kopfzeile: Hilfe (Alt + H), Einstellungen (Alt + O), Farben (Alt + K) und Vorlesen (Alt + V). Alle Tastenkürzel zeigt dir Alt + T."
          : "In der Kopfzeile: Hilfe (Alt + H), Einstellungen (Alt + O), Farben (Alt + K) und Vorlesen (Alt + V). Alle Tastenkürzel zeigt Alt + T.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede) ? "Ihr Konto" : "Dein Konto",
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? "Hier (Alt + J) finden Sie Ihre Nachrichten, „Passwort ändern\" und „Abmelden\". „Meine Klassen\" (Alt + S) führt zurück zu Ihren Klassen."
        : wer === "gast"
          ? sie(ton, anrede)
            ? "Hier melden Sie sich an (Alt + J). Dann wird Ihr Fortschritt gespeichert, und Sie sehen „Meine Statistik\"."
            : "Hier meldest du dich an (Alt + J). Dann wird dein Fortschritt gespeichert, und du siehst „Meine Statistik\"."
          : sie(ton, anrede)
            ? "Hier (Alt + J) finden Sie „Meine Statistik\" (Alt + S), Ihre Nachrichten und „Passwort ändern\"."
            : ton === "erwachsen"
              ? "Hier (Alt + J) findest du „Meine Statistik\" (Alt + S), deine Nachrichten und „Passwort ändern\"."
              : "Hier (Alt + J) findest du „Meine Statistik\" (Alt + S) mit deinen Abzeichen, deine Nachrichten und „Passwort ändern\".",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Los geht's!" : "Los geht's"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Diesen Rundgang finden Sie jederzeit wieder in der Hilfe (Alt + H). Jetzt einfach lostippen."
        : "Diesen Rundgang findest du jederzeit wieder in der Hilfe (Alt + H). Jetzt einfach lostippen.",

    // ── „Meine Klassen" - Lernstand (Lehrkraft, immer „Sie") ────────────
    mkKopfName: "Der Klassenkopf",
    mkKopf:
      "Name der Klasse, Zahl der Kinder und Klassencode. Haben Sie mehrere Klassen, wechseln Sie hier. Unter „Downloads\" liegen die Handbücher für Lehrkräfte und das Plakat zum Aufhängen.",
    mkBereichName: "Lernstand | Kinder und Zugänge",
    mkBereich:
      "Sie sehen gerade den Lernstand. Unter „Kinder und Zugänge\" legen Sie Klassen und Kinder an, sehen Passwörter und importieren Teilnehmer aus Excel.",
    mkTippchallengeName: "Tippchallenge",
    mkTippchallenge:
      "Eine Prüfung für die ganze Klasse: Text und Zeit legen Sie fest, danach stehen hier die Ergebnisse.",
    mkEigeneUebungName: "Eigene Übung",
    mkEigeneUebung:
      "Ein Text für die ganze Klasse - aus einer Datei, aus „Meine Texte\" oder einer Vorlage. Jedes Kind schreibt ihn einmal im eigenen Tempo; mehrere kommen der Reihe nach.",
    mkWochenzielName: "Wochenziel",
    mkWochenziel:
      "Wie viele Minuten pro Woche geübt werden soll - je Kind oder für alle auf einmal. Die Woche beginnt Montag 8:00.",
    mkEinstellungenName: "Einstellungen der Klasse",
    mkEinstellungen:
      "Schulstufe, Sprache, Startniveau und Klassenmatch - für alle Kinder der Klasse auf einmal.",
    mkSperrenName: "Stunde sperren",
    mkSperren:
      "60 Minuten lang zählt das Üben der ganzen Klasse nicht fürs Wochenziel, als Übezeit aber schon - etwa im Unterricht. Derselbe Knopf hebt die Sperre wieder auf.",
    mkUeberblickName: "Der Klassenüberblick",
    mkUeberblick:
      "Die ganze Klasse auf einen Blick, für den „Monat\" (die letzten 4 Wochen) oder das „Schuljahr\": Punktleiste und Liniendiagramm des Scores. Dazu: „Nachricht an die Klasse\".",
    mkZeitraumName: "Der Zeitraum",
    mkZeitraum:
      "Woche, Monat, Schuljahr oder Gesamt - Alt + Pfeil links und rechts blättert. „Als Excel herunterladen\" nimmt alle vier Zeiträume mit.",
    mkTabelleName: "Die Tabelle",
    mkTabelle:
      "Ein Kind je Zeile. Ein Spaltenkopf sortiert nach seiner Spalte; was eine Spalte bedeutet, zeigt ein Hinweis, sobald Sie zu ihr gehen.",
    mkKindName: "Die Zeile eines Kindes",
    mkKind:
      "Sie klappt auf: die Einstellungen des Kindes, Tippchallenges, Übungszeiten je Woche, wacklige Tasten und Abzeichen.",
    mkWerkzeugeName: "Die Kopfzeile",
    mkWerkzeuge:
      "„Selbst üben\" (Alt + U) führt in Ihr eigenes Üben. Die Hilfe (Alt + H) erklärt alles ausführlich - dort finden Sie auch diesen Rundgang wieder.",

    // ── „Meine Klassen" - Kinder und Zugänge ──────────────────────────
    kuzKlassenName: "Klassen",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Hier legen Sie eine Klasse an: Name, Schulstufe und Klassencode. Mit dem Klassencode melden sich die Kinder an - in jedem Lernprogramm."
        : "Hier legen Sie Ihre erste Klasse an: Name, Schulstufe und Klassencode. Danach legen Sie darunter die Kinder an - einzeln oder mit einer Excel-Datei - und sehen ihre Zugangsdaten.",
    kuzKlasseName: "Die Klasse",
    kuzKlasse:
      "Klassencode, die Programme der Klasse, weitere Lehrkräfte und der Wochenbericht per E-Mail.",
    kuzLernendeName: "Lernende",
    kuzLernende:
      "Kinder legen Sie mit Name und Passwort an. Je Kind: Passwort ändern, Kontakt-E-Mail, in eine andere Klasse verschieben. „Zugangsdaten drucken\" gibt Ihnen eine Liste zum Austeilen.",
    kuzExcelName: "Viele auf einmal (Excel)",
    kuzExcel:
      "„Vorlage herunterladen (Excel)\", je Kind eine Zeile ausfüllen, dann „Teilnehmer aus Excel importieren\" - vor dem Anlegen sehen Sie eine Vorschau.",
    kuzZurueckName: "Zurück zum Lernstand",
    kuzZurueck: "Oben mit „Lernstand\". Diesen Rundgang finden Sie in der Hilfe (Alt + H).",
  },
  en: {
    name: "Tour",
    zaehler: (nr: number, von: number) => `Tour ${nr} of ${von}`,
    weiter: "Next",
    fertig: "Done",
    ueberspringen: "Skip",
    geschafft: "Well done.",
    nochmalUeben: "Take the tour again",
    durchUebungsseite: "Tour of the practice page",
    durchMeineKlassen: "Tour of My classes",
    durchDieSeite: "Tour of the page",
    nochmalTipp: "Shows the parts of the practice page again, one step at a time.",
    meineKlassenTipp: "Shows the parts of “My classes” one step at a time.",

    uebenZeileName: (_ton: RundgangTon) => "The typing field",
    uebenZeile: (ton: RundgangTon) =>
      ton === "kind"
        ? "This is where you copy the text. Just start typing - your first letter lands right here."
        : "This is where you copy the text - just start typing. Alt + E brings you back here at any time.",
    uebenStandName: (_ton: RundgangTon) => "Your progress",
    uebenStand: (_ton: RundgangTon, wer: RundgangWer) =>
      wer === "klassenkind"
        ? "Above the typing field: your level, your practice time today, your weekly goal and the next new key. “Play” starts a game, “Class Match” (Alt + M) a typing race with your class."
        : "Above the typing field: your level, your practice time today and the next new key. “Play” starts a game.",
    uebenTastaturName: (_ton: RundgangTon) => "The on-screen keyboard",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "It shows you which key comes next. The button above it hides it and brings it back."
        : "It shows which key comes next. The button above it hides it and brings it back.",
    uebenArtName: (_ton: RundgangTon) => "The practice types",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "You can practise in three ways: “My training”, “Stories” and “Word games”. Alt + B takes you to the next one."
        : "There are three to choose from: “My training”, “Stories” and “Word games”. Alt + B switches to the next one.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "The tools",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "In the header: Help (Alt + H), all keyboard shortcuts (Alt + T), Settings (Alt + O), colour and contrast (Alt + K) and read aloud (Alt + V)."
        : "In the header: Help (Alt + H), Settings (Alt + O), colours (Alt + K) and read aloud (Alt + V). Alt + T shows all keyboard shortcuts.",
    uebenKontoName: (_ton: RundgangTon) => "Your account",
    uebenKonto: (_ton: RundgangTon, wer: RundgangWer) =>
      wer === "lehrkraft"
        ? "Here (Alt + J) you will find your messages, “Change password” and “Sign out”. “My classes” (Alt + S) takes you back to your classes."
        : wer === "gast"
          ? "Sign in here (Alt + J). Then your progress is saved, and you can see “My statistics”."
          : "Here (Alt + J) you will find “My statistics” (Alt + S) with your badges, your messages and “Change password”.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Off you go!" : "Off you go"),
    uebenEnde: (_ton: RundgangTon) =>
      "You can find this tour again at any time in the help (Alt + H). Now just start typing.",

    mkKopfName: "The class header",
    mkKopf:
      "The class name, the number of pupils and the class code. If you have several classes, switch between them here. “Downloads” has the guides for teachers and the poster for hanging up.",
    mkBereichName: "Progress | Pupils and logins",
    mkBereich:
      "You are looking at the progress now. Under “Pupils and logins” you create classes and add pupils, see passwords and import pupils from Excel.",
    mkTippchallengeName: "Typing Challenge",
    mkTippchallenge:
      "A challenge for the whole class: you set the text and the time, and the results appear here afterwards.",
    mkEigeneUebungName: "Custom exercise",
    mkEigeneUebung:
      "One text for the whole class - from a file, from “My texts” or from a template. Every pupil types it once at their own pace; several exercises come one after the other.",
    mkWochenzielName: "Weekly goal",
    mkWochenziel:
      "How many minutes per week the pupils should practise - for each pupil or for everyone at once. The week starts at 8am on Monday.",
    mkEinstellungenName: "Class settings",
    mkEinstellungen:
      "Year group, language, starting point and Class Match - for all pupils in the class at once.",
    mkSperrenName: "Pause goal for 1 hour",
    mkSperren:
      "For 60 minutes, the whole class's practice does not count towards the weekly goal, though it still counts as practice time - useful in lessons. The same button ends the pause.",
    mkUeberblickName: "The class overview",
    mkUeberblick:
      "The whole class at a glance, for the “Month” (the last 4 weeks) or the “School year”: a score bar and a line chart of the score. Also here: “Message to the class”.",
    mkZeitraumName: "The period",
    mkZeitraum:
      "Week, Month, School year or All time - Alt + left or right arrow moves back and forward. “Download as Excel” includes all four periods.",
    mkTabelleName: "The table",
    mkTabelle:
      "One pupil per row. A column heading sorts by that column; a hint explains each column as soon as you move to it.",
    mkKindName: "A pupil's row",
    mkKind:
      "It expands: the pupil's settings, Typing Challenges, practice times per week, wobbly keys and badges.",
    mkWerkzeugeName: "The header",
    mkWerkzeuge:
      "“Practise yourself” (Alt + U) takes you to your own practice. The help (Alt + H) explains everything in detail - you will find this tour there again.",

    kuzKlassenName: "Classes",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Create a class here: name, year group and class code. Pupils sign in with the class code - in every app."
        : "Create your first class here: name, year group and class code. Then add the pupils below - one by one or from an Excel file - and see their login details.",
    kuzKlasseName: "The class",
    kuzKlasse: "The class code, the class's apps, other teachers and the weekly report by email.",
    kuzLernendeName: "Learners",
    kuzLernende:
      "Add pupils with a name and a password. For each pupil: change the password, contact email, move to another class. “Print login details” gives you a list to hand out.",
    kuzExcelName: "Many at once (Excel)",
    kuzExcel:
      "“Download template (Excel)”, fill in one row per pupil, then “Import pupils from Excel” - you see a preview before anything is created.",
    kuzZurueckName: "Back to the progress",
    kuzZurueck: "Use “Progress” at the top. You will find this tour in the help (Alt + H).",
  },
  // ★ E11a (25.09.2026): wie die deutsche Fassung mit derselben tu/vous-Weiche
  // (sie(ton, anrede), F9) - Englisch kennt diese Unterscheidung nicht, Französisch
  // schon, darum bleibt hier jede Funktion so mehrstimmig wie im Deutschen.
  fr: {
    name: "Visite guidée",
    zaehler: (nr: number, von: number) => `Visite guidée ${nr} sur ${von}`,
    weiter: "Suivant",
    fertig: "Terminé",
    ueberspringen: "Passer",
    geschafft: "Terminé.",
    nochmalUeben: "Revoir la visite guidée",
    durchUebungsseite: "Visite guidée de la page d'exercice",
    durchMeineKlassen: "Visite guidée de Mes classes",
    durchDieSeite: "Visite guidée de la page",
    nochmalTipp: "Montre à nouveau les zones de la page d'exercice, étape par étape.",
    meineKlassenTipp: 'Montre les zones de "Mes classes" étape par étape.',

    uebenZeileName: (_ton: RundgangTon) => "Le champ de saisie",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Ici, tu recopies ce qui est écrit. Commence simplement - la première lettre atterrit déjà ici."
        : sie(ton, anrede)
          ? "Ici, vous recopiez le texte - commencez simplement à taper. Avec Alt + E, vous revenez ici à tout moment."
          : "Ici, tu recopies le texte - commence simplement à taper. Avec Alt + E, tu reviens ici à tout moment.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Vos progrès" : "Tes progrès"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? 'Au-dessus du champ de saisie : votre niveau, votre temps d\'exercice du jour, votre objectif de la semaine et la prochaine nouvelle touche. "Jouer" lance un jeu, "Match de la classe" (Alt + M) une course de frappe avec la classe.'
          : 'Au-dessus du champ de saisie : votre niveau, votre temps d\'exercice du jour et la prochaine nouvelle touche. "Jouer" lance un jeu.'
        : wer === "klassenkind"
          ? 'Au-dessus du champ de saisie : ton niveau, ton temps d\'exercice du jour, ton objectif de la semaine et la prochaine nouvelle touche. "Jouer" lance un jeu, "Match de la classe" (Alt + M) une course de frappe avec ta classe.'
          : 'Au-dessus du champ de saisie : ton niveau, ton temps d\'exercice du jour et la prochaine nouvelle touche. "Jouer" lance un jeu.',
    uebenTastaturName: (_ton: RundgangTon) => "Le clavier à l'écran",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Il te montre quelle touche vient ensuite. Le bouton au-dessus le masque et le réaffiche."
        : "Il montre quelle touche vient ensuite. Le bouton au-dessus le masque et le réaffiche.",
    uebenArtName: (_ton: RundgangTon) => "Les types d'exercice",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? 'Tu peux t\'exercer de trois façons : "Mon entrainement", "Histoires" et "Jeux de lettres". Alt + B te mène au suivant.'
        : 'Trois choix possibles : "Mon entrainement", "Histoires" et "Jeux de lettres". Alt + B passe au suivant.',
    uebenWerkzeugeName: (_ton: RundgangTon) => "Les outils",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "Dans l'en-tête : aide (Alt + H), tous les raccourcis clavier (Alt + T), réglages (Alt + O), couleurs et contraste (Alt + K) et lecture à voix haute (Alt + V)."
        : ton === "kind"
          ? "Dans l'en-tête : aide (Alt + H), réglages (Alt + O), couleurs (Alt + K) et lecture à voix haute (Alt + V). Alt + T montre tous les raccourcis clavier."
          : "Dans l'en-tête : aide (Alt + H), réglages (Alt + O), couleurs (Alt + K) et lecture à voix haute (Alt + V). Alt + T montre tous les raccourcis clavier.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Votre compte" : "Ton compte"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? 'Ici (Alt + J), vous trouvez vos messages, "Changer le mot de passe" et "Se déconnecter". "Mes classes" (Alt + S) vous ramène à vos classes.'
        : wer === "gast"
          ? sie(ton, anrede)
            ? 'Vous vous connectez ici (Alt + J). Vos progrès sont alors enregistrés, et vous voyez "Mes progrès".'
            : 'Tu te connectes ici (Alt + J). Tes progrès sont alors enregistrés, et tu vois "Mes progrès".'
          : sie(ton, anrede)
            ? 'Ici (Alt + J), vous trouvez "Mes progrès" (Alt + S), vos messages et "Changer le mot de passe".'
            : ton === "erwachsen"
              ? 'Ici (Alt + J), tu trouves "Mes progrès" (Alt + S), tes messages et "Changer le mot de passe".'
              : 'Ici (Alt + J), tu trouves "Mes progrès" (Alt + S) avec tes badges, tes messages et "Changer le mot de passe".',
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "C'est parti !" : "C'est parti"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Vous retrouverez cette visite guidée à tout moment dans l'aide (Alt + H). Il ne reste plus qu'à taper."
        : "Tu retrouveras cette visite guidée à tout moment dans l'aide (Alt + H). Il ne reste plus qu'à taper.",

    mkKopfName: "L'en-tête de la classe",
    mkKopf:
      'Le nom de la classe, le nombre d\'élèves et le code de classe. Si vous avez plusieurs classes, changez ici. Sous "Téléchargements" se trouvent les guides pour le personnel enseignant et l\'affiche à accrocher.',
    mkBereichName: "Progrès | Élèves et accès",
    mkBereich:
      'Vous voyez actuellement les progrès. Sous "Élèves et accès", vous créez des classes et des élèves, voyez les mots de passe et importez des participants depuis Excel.',
    mkTippchallengeName: "Défi",
    mkTippchallenge:
      "Une épreuve pour toute la classe : vous fixez le texte et la durée, les résultats apparaissent ensuite ici.",
    mkEigeneUebungName: "Texte de la classe",
    mkEigeneUebung:
      'Un texte pour toute la classe - depuis un fichier, depuis "Mes textes" ou un modèle. Chaque élève le tape une fois à son rythme ; plusieurs textes se suivent dans l\'ordre.',
    mkWochenzielName: "Objectif de la semaine",
    mkWochenziel:
      "Combien de minutes par semaine s'exercer - par élève ou pour tous à la fois. La semaine commence le lundi à 8 h.",
    mkEinstellungenName: "Réglages de la classe",
    mkEinstellungen:
      "Niveau scolaire, langue, niveau de départ et Match de la classe - pour tous les élèves de la classe à la fois.",
    mkSperrenName: "Verrouiller l'heure",
    mkSperren:
      "Pendant 60 minutes, l'exercice de toute la classe ne compte pas pour l'objectif de la semaine, mais compte comme temps d'exercice - par exemple en cours. Le même bouton lève le verrouillage.",
    mkUeberblickName: "L'aperçu de la classe",
    mkUeberblick:
      'Toute la classe en un coup d\'œil, pour le "Mois" (les 4 dernières semaines) ou l\'"Année scolaire" : barre de points et graphique en ligne du score. Avec aussi : "Message à la classe".',
    mkZeitraumName: "La période",
    mkZeitraum:
      'Semaine, mois, année scolaire ou total - Alt + flèche gauche ou droite pour naviguer. "Télécharger en Excel" reprend les quatre périodes.',
    mkTabelleName: "Le tableau",
    mkTabelle:
      "Un élève par ligne. Un en-tête de colonne trie selon sa colonne ; une info-bulle explique chaque colonne dès que vous l'atteignez.",
    mkKindName: "La ligne d'un élève",
    mkKind:
      "Elle se déplie : les réglages de l'élève, les Défis, les temps d'exercice par semaine, les touches instables et les badges.",
    mkWerkzeugeName: "L'en-tête",
    mkWerkzeuge:
      '"M\'entrainer" (Alt + U) mène à votre propre exercice. L\'aide (Alt + H) explique tout en détail - vous y retrouverez aussi cette visite guidée.',

    kuzKlassenName: "Classes",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Créez ici une classe : nom, niveau scolaire et code de classe. Les élèves se connectent avec le code de classe - dans chaque programme d'apprentissage."
        : "Créez ici votre première classe : nom, niveau scolaire et code de classe. Créez ensuite les élèves en dessous - un par un ou avec un fichier Excel - et consultez leurs identifiants.",
    kuzKlasseName: "La classe",
    kuzKlasse: "Le code de classe, les programmes de la classe, le personnel enseignant de la classe et le bilan hebdomadaire par e-mail.",
    kuzLernendeName: "Élèves",
    kuzLernende:
      'Créez les élèves avec un nom et un mot de passe. Pour chaque élève : changer le mot de passe, e-mail de contact, déplacer vers une autre classe. "Imprimer les identifiants" vous donne une liste à distribuer.',
    kuzExcelName: "Plusieurs à la fois (Excel)",
    kuzExcel:
      '"Télécharger le modèle (Excel)", remplir une ligne par élève, puis "Importer des participants depuis Excel" - un aperçu s\'affiche avant toute création.',
    kuzZurueckName: "Retour aux progrès",
    kuzZurueck: 'En haut avec "Progrès". Vous trouverez cette visite guidée dans l\'aide (Alt + H).',
  },
  // ★ ES-O (27.09.2026): Kinder und Selbstlernende tú, die Lehrkraft usted
  // (`sie()`), die Teile von „Mis clases" liest nur die Lehrkraft - usted.
  es: {
    name: "Visita guiada",
    zaehler: (nr: number, von: number) => `Visita guiada ${nr} de ${von}`,
    weiter: "Siguiente",
    fertig: "Terminar",
    ueberspringen: "Saltar",
    geschafft: "Terminado.",
    nochmalUeben: "Ver otra vez la visita guiada",
    durchUebungsseite: "Visita guiada por la página de práctica",
    durchMeineKlassen: "Visita guiada por Mis clases",
    durchDieSeite: "Visita guiada por la página",
    nochmalTipp: "Muestra otra vez, paso a paso, las zonas de la página de práctica.",
    meineKlassenTipp: 'Muestra paso a paso las zonas de "Mis clases".',

    uebenZeileName: (_ton: RundgangTon) => "El campo de escritura",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Aquí copias lo que está escrito. Empieza sin más: la primera letra ya aparece aquí."
        : sie(ton, anrede)
          ? "Aquí copia el texto - empiece a escribir sin más. Con Alt + E vuelve aquí en cualquier momento."
          : "Aquí copias el texto - empieza a escribir sin más. Con Alt + E vuelves aquí en cualquier momento.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Su progreso" : "Tu progreso"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? 'Encima del campo de escritura: su nivel, su tiempo de práctica de hoy, su objetivo semanal y la próxima tecla nueva. "Jugar" abre un juego, "Competición de la clase" (Alt + M) una carrera escribiendo con la clase.'
          : 'Encima del campo de escritura: su nivel, su tiempo de práctica de hoy y la próxima tecla nueva. "Jugar" abre un juego.'
        : wer === "klassenkind"
          ? 'Encima del campo de escritura: tu nivel, tu tiempo de práctica de hoy, tu objetivo semanal y la próxima tecla nueva. "Jugar" abre un juego, "Competición de la clase" (Alt + M) una carrera escribiendo con tu clase.'
          : 'Encima del campo de escritura: tu nivel, tu tiempo de práctica de hoy y la próxima tecla nueva. "Jugar" abre un juego.',
    uebenTastaturName: (_ton: RundgangTon) => "El teclado en pantalla",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Te muestra qué tecla va ahora. Con el botón de encima lo ocultas y lo vuelves a mostrar."
        : "Muestra qué tecla va ahora. El botón de encima lo oculta y lo vuelve a mostrar.",
    uebenArtName: (_ton: RundgangTon) => "Los tipos de ejercicio",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? 'Puedes practicar de tres maneras: "Mi entrenamiento", "Cuentos" y "Juegos de palabras". Alt + B te lleva al siguiente.'
        : 'Tres opciones: "Mi entrenamiento", "Cuentos" y "Juegos de palabras". Alt + B pasa al siguiente.',
    uebenWerkzeugeName: (_ton: RundgangTon) => "Las herramientas",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "En la cabecera: ayuda (Alt + H), todos los atajos de teclado (Alt + T), configuración (Alt + O), colores y contraste (Alt + K) y lectura en voz alta (Alt + V)."
        : "En la cabecera: ayuda (Alt + H), configuración (Alt + O), colores (Alt + K) y lectura en voz alta (Alt + V). Alt + T muestra todos los atajos de teclado.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Su cuenta" : "Tu cuenta"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? 'Aquí (Alt + J) encuentra sus mensajes, "Cambiar la contraseña" y "Cerrar sesión". "Mis clases" (Alt + S) le lleva de vuelta a sus clases.'
        : wer === "gast"
          ? sie(ton, anrede)
            ? 'Aquí inicia sesión (Alt + J). Así se guarda su progreso y ve "Mi progreso".'
            : 'Aquí inicias sesión (Alt + J). Así se guarda tu progreso y ves "Mi progreso".'
          : sie(ton, anrede)
            ? 'Aquí (Alt + J) encuentra "Mi progreso" (Alt + S), sus mensajes y "Cambiar la contraseña".'
            : ton === "erwachsen"
              ? 'Aquí (Alt + J) encuentras "Mi progreso" (Alt + S), tus mensajes y "Cambiar la contraseña".'
              : 'Aquí (Alt + J) encuentras "Mi progreso" (Alt + S) con tus insignias, tus mensajes y "Cambiar la contraseña".',
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "¡A escribir!" : "A escribir"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Encontrará esta visita guiada en cualquier momento en la ayuda (Alt + H). Ahora, a escribir."
        : "Encontrarás esta visita guiada en cualquier momento en la ayuda (Alt + H). Ahora, a escribir.",

    mkKopfName: "La cabecera de la clase",
    mkKopf:
      'El nombre de la clase, el número de estudiantes y el código de clase. Si tiene varias clases, cambie aquí. En "Descargas" están las guías para docentes y el cartel para colgar.',
    mkBereichName: "Progreso | Estudiantes y accesos",
    mkBereich:
      'Ahora ve el progreso. En "Estudiantes y accesos" crea clases y las cuentas del alumnado, ve las contraseñas e importa participantes desde Excel.',
    mkTippchallengeName: "Reto",
    mkTippchallenge:
      "Una prueba para toda la clase: usted fija el texto y la duración, y después los resultados aparecen aquí.",
    mkEigeneUebungName: "Texto de la clase",
    mkEigeneUebung:
      'Un texto para toda la clase - desde un archivo, desde "Mis textos" o desde una plantilla. Cada estudiante lo escribe una vez a su ritmo; varios textos van uno detrás de otro.',
    mkWochenzielName: "Objetivo semanal",
    mkWochenziel:
      "Cuántos minutos por semana se practica - por estudiante o para todos a la vez. La semana empieza el lunes a las 8.",
    mkEinstellungenName: "Configuración de la clase",
    mkEinstellungen:
      "Curso, idioma, nivel de partida y Competición de la clase - para todo el alumnado de la clase a la vez.",
    mkSperrenName: "Bloquear la hora",
    mkSperren:
      "Durante 60 minutos, lo que practica toda la clase no cuenta para el objetivo semanal, pero sí como tiempo de práctica - por ejemplo, en clase. El mismo botón quita el bloqueo.",
    mkUeberblickName: "El resumen de la clase",
    mkUeberblick:
      'Toda la clase de un vistazo, para el "Mes" (las últimas 4 semanas) o el "Curso escolar": barra de puntos y gráfico de líneas de la puntuación. También aquí: "Mensaje a la clase".',
    mkZeitraumName: "El periodo",
    mkZeitraum:
      'Semana, mes, curso escolar o total - con Alt + flecha izquierda o derecha se pasa de uno a otro. "Descargar en Excel" incluye los cuatro periodos.',
    mkTabelleName: "La tabla",
    mkTabelle:
      "Una fila por estudiante. El encabezado de una columna ordena por esa columna; un texto de ayuda explica cada columna en cuanto llega a ella.",
    mkKindName: "La fila de cada estudiante",
    mkKind:
      "Se despliega: la configuración de cada estudiante, los Retos, los tiempos de práctica por semana, las teclas todavía inseguras y las insignias.",
    mkWerkzeugeName: "La cabecera",
    mkWerkzeuge:
      '"Practicar por mi cuenta" (Alt + U) lleva a su propia práctica. La ayuda (Alt + H) lo explica todo en detalle - allí encontrará también esta visita guiada.',

    kuzKlassenName: "Clases",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Cree aquí una clase: nombre, curso y código de clase. El alumnado inicia sesión con el código de clase - en cada programa de aprendizaje."
        : "Cree aquí su primera clase: nombre, curso y código de clase. Después cree debajo las cuentas del alumnado - una por una o con un archivo de Excel - y consulte sus datos de acceso.",
    kuzKlasseName: "La clase",
    kuzKlasse: "El código de clase, los programas de la clase, el profesorado de la clase y el resumen semanal por correo electrónico.",
    kuzLernendeName: "Estudiantes",
    kuzLernende:
      'Cree a cada estudiante con un nombre y una contraseña. Para cada estudiante: cambiar la contraseña, correo de contacto, mover a otra clase. "Imprimir los datos de acceso" le da una lista para repartir.',
    kuzExcelName: "Varios a la vez (Excel)",
    kuzExcel:
      '"Descargar la plantilla (Excel)", completar una fila por estudiante y después "Importar participantes desde Excel" - antes de crear nada se muestra una vista previa.',
    kuzZurueckName: "Volver al progreso",
    kuzZurueck: 'Arriba, con "Progreso". Encontrará esta visita guiada en la ayuda (Alt + H).',
  },
  // ★ O-IT (02.10.2026): „visita guidata" (Glossar §2.5); Kind und Selbstlernende
  // „tu", die Lehrkraft (`sie`) neutral ohne „Lei" (Regel 1). Die Namen der Knöpfe
  // wie in der italienischen Oberfläche („Gioca", „Gara di classe", „Le mie classi").
  it: {
    name: "Visita guidata",
    zaehler: (nr: number, von: number) => `Visita guidata ${nr} di ${von}`,
    weiter: "Avanti",
    fertig: "Fatto",
    ueberspringen: "Salta",
    geschafft: "Visita completata.",
    nochmalUeben: "Rivedi la visita guidata",
    durchUebungsseite: "Visita guidata della pagina di esercizio",
    durchMeineKlassen: "Visita guidata di Le mie classi",
    durchDieSeite: "Visita guidata della pagina",
    nochmalTipp: "Mostra di nuovo, passo per passo, le zone della pagina di esercizio.",
    meineKlassenTipp: `Mostra passo per passo le zone di "Le mie classi".`,

    uebenZeileName: (_ton: RundgangTon) => "Il campo di scrittura",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Qui ricopi quello che è scritto. Inizia pure: la prima lettera è già qui."
        : sie(ton, anrede)
          ? "Qui si ricopia il testo - basta iniziare a scrivere. Con Alt + E si torna qui in qualsiasi momento."
          : "Qui ricopi il testo - inizia pure a scrivere. Con Alt + E torni qui in qualsiasi momento.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "I progressi" : "I tuoi progressi"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? `Sopra il campo di scrittura: il livello, il tempo di esercizio di oggi, l'obiettivo settimanale e il prossimo tasto nuovo. "Gioca" apre un gioco, "Gara di classe" (Alt + M) una gara di scrittura con la classe.`
          : `Sopra il campo di scrittura: il livello, il tempo di esercizio di oggi e il prossimo tasto nuovo. "Gioca" apre un gioco.`
        : wer === "klassenkind"
          ? `Sopra il campo di scrittura: il tuo livello, il tuo tempo di esercizio di oggi, il tuo obiettivo settimanale e il prossimo tasto nuovo. "Gioca" apre un gioco, "Gara di classe" (Alt + M) una gara di scrittura con la tua classe.`
          : `Sopra il campo di scrittura: il tuo livello, il tuo tempo di esercizio di oggi e il prossimo tasto nuovo. "Gioca" apre un gioco.`,
    uebenTastaturName: (_ton: RundgangTon) => "La tastiera sullo schermo",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Ti mostra qual è il prossimo tasto. Con il pulsante sopra la nascondi e la mostri di nuovo."
        : "Mostra qual è il prossimo tasto. Il pulsante sopra la nasconde e la mostra di nuovo.",
    uebenArtName: (_ton: RundgangTon) => "I tipi di esercizio",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? `Puoi esercitarti in tre modi: "Il mio allenamento", "Storie" e "Giochi di parole". Alt + B ti porta al successivo.`
        : `Tre possibilità: "Il mio allenamento", "Storie" e "Giochi di parole". Alt + B passa al successivo.`,
    uebenWerkzeugeName: (_ton: RundgangTon) => "Gli strumenti",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "Nell'intestazione: aiuto (Alt + H), tutte le scorciatoie da tastiera (Alt + T), impostazioni (Alt + O), colori e contrasto (Alt + K) e lettura ad alta voce (Alt + V)."
        : "Nell'intestazione: aiuto (Alt + H), impostazioni (Alt + O), colori (Alt + K) e lettura ad alta voce (Alt + V). Alt + T mostra tutte le scorciatoie da tastiera.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "L'account" : "Il tuo account"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? `Qui (Alt + J) ci sono i messaggi, "Cambia la password" ed "Esci". "Le mie classi" (Alt + S) riporta alle classi.`
        : wer === "gast"
          ? sie(ton, anrede)
            ? `Qui si accede (Alt + J). Così i progressi vengono salvati e si vede "I miei progressi".`
            : `Qui accedi (Alt + J). Così i tuoi progressi vengono salvati e vedi "I miei progressi".`
          : sie(ton, anrede)
            ? `Qui (Alt + J) ci sono "I miei progressi" (Alt + S), i messaggi e "Cambia la password".`
            : ton === "erwachsen"
              ? `Qui (Alt + J) trovi "I miei progressi" (Alt + S), i tuoi messaggi e "Cambia la password".`
              : `Qui (Alt + J) trovi "I miei progressi" (Alt + S) con le tue medaglie, i tuoi messaggi e "Cambia la password".`,
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Al lavoro!" : "Al lavoro"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Questa visita guidata si trova sempre nell'aiuto (Alt + H). Ora si può scrivere."
        : "Questa visita guidata la trovi sempre nell'aiuto (Alt + H). Ora puoi scrivere.",

    mkKopfName: "L'intestazione della classe",
    mkKopf:
      `Il nome della classe, il numero degli alunni e il codice classe. Con più classi si cambia qui. In "Download" ci sono le guide per insegnanti e il poster da appendere.`,
    mkBereichName: "Progressi | Alunni e accessi",
    mkBereich:
      `Ora si vedono i progressi. In "Alunni e accessi" si creano le classi e gli account degli alunni, si vedono le password e si importano alunni da Excel.`,
    mkTippchallengeName: "Sfida",
    mkTippchallenge:
      "Una sfida per tutta la classe: si scelgono il testo e la durata, poi i risultati compaiono qui.",
    mkEigeneUebungName: "Esercizio personalizzato",
    mkEigeneUebung:
      `Un testo per tutta la classe - da un file, da "I miei testi" o da un modello. Ogni persona lo scrive una volta al proprio ritmo; più testi vengono uno dopo l'altro.`,
    mkWochenzielName: "Obiettivo settimanale",
    mkWochenziel:
      "Quanti minuti alla settimana ci si esercita - per ogni persona o per tutta la classe insieme. La settimana inizia lunedì alle 8:00.",
    mkEinstellungenName: "Impostazioni della classe",
    mkEinstellungen:
      "Classe frequentata, lingua, punto di partenza e Gara di classe - per tutti gli alunni della classe insieme.",
    mkSperrenName: "Sospendere l'obiettivo per un'ora",
    mkSperren:
      "Per 60 minuti quello che fa tutta la classe non conta per l'obiettivo settimanale, ma conta come tempo di esercizio - per esempio in classe. Lo stesso pulsante riprende l'obiettivo.",
    mkUeberblickName: "La panoramica della classe",
    mkUeberblick:
      `Tutta la classe in un colpo d'occhio, per il "Mese" (le ultime 4 settimane) o l'"Anno scolastico": barra a punti e grafico a linee del punteggio. Anche qui: "Messaggio alla classe".`,
    mkZeitraumName: "Il periodo",
    mkZeitraum:
      `Settimana, mese, anno scolastico o dall'inizio - con Alt + freccia sinistra o destra si passa dall'uno all'altro. "Scarica in Excel" contiene i quattro periodi.`,
    mkTabelleName: "La tabella",
    mkTabelle:
      "Una riga per ogni persona. L'intestazione di una colonna ordina secondo quella colonna; un testo di aiuto spiega ogni colonna appena ci si arriva.",
    mkKindName: "La riga di ogni persona",
    mkKind:
      "Si apre: le impostazioni di ogni persona, le Sfide, i tempi di esercizio per settimana, i tasti ancora incerti e le medaglie.",
    mkWerkzeugeName: "L'intestazione",
    mkWerkzeuge:
      `"Esercitarsi" (Alt + U) porta al proprio esercizio. L'aiuto (Alt + H) spiega tutto nei dettagli - lì si trova anche questa visita guidata.`,

    kuzKlassenName: "Classi",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Qui si crea una classe: nome, classe frequentata e codice classe. Gli alunni accedono con il codice classe - in ogni programma di apprendimento."
        : "Qui si crea la prima classe: nome, classe frequentata e codice classe. Poi, qui sotto, si creano gli account degli alunni - uno alla volta o con un file Excel - e si vedono i loro dati di accesso.",
    kuzKlasseName: "La classe",
    kuzKlasse: "Il codice classe, i programmi della classe, gli insegnanti della classe e il resoconto settimanale via email.",
    kuzLernendeName: "Alunni",
    kuzLernende:
      `Ogni persona si crea con un nome e una password. Per ogni persona: cambiare la password, email di contatto, spostare in un'altra classe. "Stampa i dati di accesso" dà un elenco da distribuire.`,
    kuzExcelName: "Più persone insieme (Excel)",
    kuzExcel:
      `"Scarica il modello (Excel)", compilare una riga per persona e poi "Importa alunni da Excel" - prima di creare gli account si vede un'anteprima.`,
    kuzZurueckName: "Tornare ai progressi",
    kuzZurueck: `In alto, con "Progressi". Questa visita guidata si trova nell'aiuto (Alt + H).`,
  },
  // ★ O-PL (02.10.2026): „Przewodnik" (Glossar §2.5). Kind, Jugend und Selbstlernende
  // „ty"; die Lehrkraft (`sie`) ebenfalls ohne Pan/Pani - Schritte in der ty-Befehlsform,
  // Beschreibungen unpersönlich („widać", „można", „-no"), Regel 1. Nie eine Vergangenheit
  // der 2. Person (Regel 2). Knopfnamen mit „przycisk" davor, Bereichsnamen in „…”
  // (Regel 8); die Namen wie in der polnischen Oberfläche („Graj", „Wyścig klasowy",
  // „Moje postępy", „Moje klasy", „Poćwicz", „Uczniowie i dostęp").
  pl: {
    name: "Przewodnik",
    zaehler: (nr: number, von: number) => `Przewodnik: krok ${nr} z ${von}`,
    weiter: "Dalej",
    fertig: "Gotowe",
    ueberspringen: "Pomiń",
    geschafft: "Przewodnik zakończony.",
    nochmalUeben: "Pokaż przewodnik jeszcze raz",
    durchUebungsseite: "Przewodnik po stronie ćwiczeń",
    durchMeineKlassen: "Przewodnik po sekcji Moje klasy",
    durchDieSeite: "Przewodnik po stronie",
    nochmalTipp: "Pokazuje jeszcze raz, krok po kroku, części strony ćwiczeń.",
    meineKlassenTipp: "Pokazuje krok po kroku części sekcji „Moje klasy”.",

    uebenZeileName: (_ton: RundgangTon) => "Pole pisania",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Tu przepisujesz to, co jest napisane. Po prostu zacznij - pierwsza litera trafi właśnie tutaj."
        : sie(ton, anrede)
          ? "Tu przepisuje się tekst - wystarczy zacząć pisać. Alt + E w każdej chwili prowadzi z powrotem tutaj."
          : "Tu przepisujesz tekst - po prostu zacznij pisać. Alt + E w każdej chwili przenosi cię z powrotem tutaj.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Postępy" : "Twoje postępy"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? "Nad polem pisania: poziom, dzisiejszy czas ćwiczeń, cel tygodniowy i następny nowy klawisz. Przycisk Graj otwiera grę, a przycisk Wyścig klasowy (Alt + M) - wyścig w pisaniu z klasą."
          : "Nad polem pisania: poziom, dzisiejszy czas ćwiczeń i następny nowy klawisz. Przycisk Graj otwiera grę."
        : wer === "klassenkind"
          ? "Nad polem pisania: twój poziom, twój dzisiejszy czas ćwiczeń, twój cel tygodniowy i następny nowy klawisz. Przycisk Graj otwiera grę, a przycisk Wyścig klasowy (Alt + M) - wyścig w pisaniu z twoją klasą."
          : "Nad polem pisania: twój poziom, twój dzisiejszy czas ćwiczeń i następny nowy klawisz. Przycisk Graj otwiera grę.",
    uebenTastaturName: (_ton: RundgangTon) => "Klawiatura ekranowa",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Pokazuje ci, który klawisz jest następny. Przyciskiem nad nią ukrywasz ją i pokazujesz z powrotem."
        : "Pokazuje, który klawisz jest następny. Przycisk nad nią ukrywa ją i pokazuje z powrotem.",
    uebenArtName: (_ton: RundgangTon) => "Rodzaje ćwiczeń",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Możesz ćwiczyć na trzy sposoby: „Mój trening”, „Opowiadania” i „Gry słowne”. Alt + B przenosi cię do następnego."
        : "Do wyboru są trzy: „Mój trening”, „Opowiadania” i „Gry słowne”. Alt + B przechodzi do następnego.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "Narzędzia",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "W nagłówku: Pomoc (Alt + H), wszystkie skróty klawiaturowe (Alt + T), Ustawienia (Alt + O), Kolory i kontrast (Alt + K) oraz Czytanie na głos (Alt + V)."
        : ton === "kind"
          ? "W nagłówku: Pomoc (Alt + H), Ustawienia (Alt + O), Kolory (Alt + K) i Czytanie na głos (Alt + V). Wszystkie skróty klawiaturowe pokazuje ci Alt + T."
          : "W nagłówku: Pomoc (Alt + H), Ustawienia (Alt + O), Kolory (Alt + K) i Czytanie na głos (Alt + V). Wszystkie skróty klawiaturowe pokazuje Alt + T.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Konto" : "Twoje konto"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? "Tu (Alt + J) są wiadomości, „Zmień hasło” i „Wyloguj się”. „Moje klasy” (Alt + S) prowadzi z powrotem do klas."
        : wer === "gast"
          ? sie(ton, anrede)
            ? "Tu można się zalogować (Alt + J). Wtedy postępy zostają zapisane i widać „Moje postępy”."
            : "Tu się zalogujesz (Alt + J). Wtedy twoje postępy zostaną zapisane i zobaczysz „Moje postępy”."
          : sie(ton, anrede)
            ? "Tu (Alt + J) są „Moje postępy” (Alt + S), wiadomości i „Zmień hasło”."
            : ton === "erwachsen"
              ? "Tu (Alt + J) znajdziesz „Moje postępy” (Alt + S), swoje wiadomości i „Zmień hasło”."
              : "Tu (Alt + J) znajdziesz „Moje postępy” (Alt + S) ze swoimi odznakami, swoje wiadomości i „Zmień hasło”.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Zaczynamy!" : "Zaczynamy"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Ten przewodnik jest zawsze w pomocy (Alt + H). Teraz można zacząć pisać."
        : "Ten przewodnik znajdziesz zawsze w pomocy (Alt + H). Teraz po prostu zacznij pisać.",

    mkKopfName: "Nagłówek klasy",
    mkKopf:
      "Nazwa klasy, liczba uczniów i kod klasy. Przy kilku klasach można je tu przełączać. W sekcji „Do pobrania” są podręczniki dla nauczycieli i plakat do powieszenia.",
    mkBereichName: "Postępy | Uczniowie i dostęp",
    mkBereich:
      "Teraz widać postępy. W sekcji „Uczniowie i dostęp” tworzy się klasy i konta uczniów, widać hasła i można importować uczniów z pliku Excel.",
    mkTippchallengeName: "Wyzwanie",
    mkTippchallenge:
      "Wyzwanie dla całej klasy: wybierz tekst i czas, a potem tutaj pojawią się wyniki.",
    mkEigeneUebungName: "Własne ćwiczenie",
    mkEigeneUebung:
      "Jeden tekst dla całej klasy - z pliku, z „Moich tekstów” albo z szablonu. Każda osoba pisze go raz we własnym tempie; kilka ćwiczeń przychodzi po kolei.",
    mkWochenzielName: "Cel tygodniowy",
    mkWochenziel:
      "Ile minut tygodniowo ćwiczyć - dla każdej osoby osobno albo dla wszystkich naraz. Tydzień zaczyna się w poniedziałek o 8:00.",
    mkEinstellungenName: "Ustawienia klasy",
    mkEinstellungen:
      "Klasa, do której chodzą uczniowie, język tekstów, punkt startowy i Wyścig klasowy - dla całej klasy naraz.",
    mkSperrenName: "Wstrzymaj cel na godzinę",
    mkSperren:
      "Przez 60 minut ćwiczenia całej klasy nie liczą się do celu tygodniowego, ale liczą się do czasu ćwiczeń - na przykład w czasie zajęć. Ten sam przycisk wznawia cel.",
    mkUeberblickName: "Przegląd klasy",
    mkUeberblick:
      "Cała klasa w jednym miejscu, za „Miesiąc” (ostatnie 4 tygodnie) albo „Rok szkolny”: pasek punktów i wykres liniowy wyniku. Do tego: „Wiadomość do klasy”.",
    mkZeitraumName: "Okres",
    mkZeitraum:
      "Tydzień, Miesiąc, Rok szkolny albo Od początku - Alt + strzałka w lewo lub w prawo przełącza okres. „Pobierz jako plik Excel” obejmuje wszystkie cztery okresy.",
    mkTabelleName: "Tabela",
    mkTabelle:
      "Jedna osoba w każdym wierszu. Nagłówek kolumny sortuje według tej kolumny; co oznacza kolumna, pokazuje podpowiedź, gdy tylko do niej przejdziesz.",
    mkKindName: "Wiersz jednej osoby",
    mkKind:
      "Rozwija się: ustawienia tej osoby, Wyzwania, czasy ćwiczeń w każdym tygodniu, niepewne klawisze i odznaki.",
    mkWerkzeugeName: "Nagłówek",
    mkWerkzeuge:
      "Przycisk Poćwicz (Alt + U) prowadzi do własnych ćwiczeń. Pomoc (Alt + H) wyjaśnia wszystko dokładnie - tam jest też ten przewodnik.",

    kuzKlassenName: "Klasy",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Tu utwórz klasę: nazwa, klasa (np. klasa 3) i kod klasy. Kodem klasy uczniowie logują się - w każdym programie do nauki."
        : "Tu utwórz pierwszą klasę: nazwa, klasa (np. klasa 3) i kod klasy. Potem poniżej dodaj uczniów - pojedynczo albo z pliku Excel - i zobacz ich dane logowania.",
    kuzKlasseName: "Klasa",
    kuzKlasse: "Kod klasy, programy tej klasy, inne osoby prowadzące klasę i podsumowanie tygodnia e-mailem.",
    kuzLernendeName: "Uczniowie",
    kuzLernende:
      "Uczniów dodaje się z imieniem i hasłem. Dla każdej osoby: zmiana hasła, kontaktowy adres e-mail, przeniesienie do innej klasy. Przycisk Drukuj dane logowania daje listę do rozdania.",
    kuzExcelName: "Wiele osób naraz (Excel)",
    kuzExcel:
      "Pobierz szablon (Excel), wypełnij jeden wiersz dla każdej osoby, a potem wybierz przycisk Importuj uczniów z pliku Excel - przed założeniem kont widać podgląd.",
    kuzZurueckName: "Powrót do postępów",
    kuzZurueck: "U góry przyciskiem Postępy. Ten przewodnik jest w pomocy (Alt + H).",
  },
  // ★ O-TR (02.10.2026): "Tanıtım turu" (Glossar §2.5). Kind, Jugend und Selbstlernende
  // (auch Erwachsene) sen, kurze Befehlsform; die Lehrkraft (`sie`) siz mit -(y)In
  // ("yazın", "oluşturun"), nie -InIz (Regel 1). Knopf- und Bereichsnamen in geraden
  // Anführungszeichen, wie in der türkischen Oberfläche ("Oyna", "Sınıf Maçı",
  // "İlerlemem", "Sınıflarım", "Alıştırma yap", "Öğrenciler ve girişler"). Keine Endung
  // an Namen oder Tasten (Regel 6): "Tanıtım turu: adım 2, toplam 7".
  tr: {
    name: "Tanıtım turu",
    zaehler: (nr: number, von: number) => `Tanıtım turu: adım ${nr}, toplam ${von}`,
    weiter: "İleri",
    fertig: "Bitti",
    ueberspringen: "Atla",
    geschafft: "Tanıtım turu bitti.",
    nochmalUeben: "Tanıtım turunu tekrar izle",
    durchUebungsseite: "Alıştırma sayfası tanıtım turu",
    durchMeineKlassen: "Sınıflarım tanıtım turu",
    durchDieSeite: "Sayfa tanıtım turu",
    nochmalTipp: "Alıştırma sayfasının bölümlerini adım adım yeniden gösterir.",
    meineKlassenTipp: `"Sınıflarım" sayfasının bölümlerini adım adım gösterir.`,

    uebenZeileName: (_ton: RundgangTon) => "Yazma alanı",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Burada gösterilen metni yazarsın. Hemen başla - ilk harf zaten buraya gelir."
        : sie(ton, anrede)
          ? "Burada metni yazın - hemen yazmaya başlayın. Alt + E ile her an buraya dönersiniz."
          : "Burada metni yazarsın - hemen yazmaya başla. Alt + E ile her an buraya dönersin.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Durumunuz" : "Durumun"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? `Yazma alanının üstünde: seviyeniz, bugünkü çalışma süreniz, haftalık hedefiniz ve sıradaki yeni tuş. "Oyna" düğmesi bir oyun başlatır, "Sınıf Maçı" düğmesi (Alt + M) sınıfla bir yazma yarışı.`
          : `Yazma alanının üstünde: seviyeniz, bugünkü çalışma süreniz ve sıradaki yeni tuş. "Oyna" düğmesi bir oyun başlatır.`
        : wer === "klassenkind"
          ? `Yazma alanının üstünde: seviyen, bugünkü çalışma süren, haftalık hedefin ve sıradaki yeni tuş. "Oyna" düğmesi bir oyun başlatır, "Sınıf Maçı" düğmesi (Alt + M) sınıfınla bir yazma yarışı.`
          : `Yazma alanının üstünde: seviyen, bugünkü çalışma süren ve sıradaki yeni tuş. "Oyna" düğmesi bir oyun başlatır.`,
    uebenTastaturName: (_ton: RundgangTon) => "Ekran klavyesi",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Sıradaki tuşu sana gösterir. Üstündeki düğmeyle onu gizler ve yeniden gösterirsin."
        : "Sıradaki tuşu gösterir. Üstündeki düğme onu gizler ve yeniden gösterir.",
    uebenArtName: (_ton: RundgangTon) => "Alıştırma türleri",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? `Üç şekilde çalışabilirsin: "Antrenmanım", "Öyküler" ve "Kelime oyunları". Alt + B ile sıradakine geçersin.`
        : `Üç seçenek var: "Antrenmanım", "Öyküler" ve "Kelime oyunları". Alt + B sıradakine geçer.`,
    uebenWerkzeugeName: (_ton: RundgangTon) => "Araçlar",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "Başlık satırında: Yardım (Alt + H), tüm klavye kısayolları (Alt + T), Ayarlar (Alt + O), Renkler ve karşıtlık (Alt + K) ve Sesli okuma (Alt + V)."
        : ton === "kind"
          ? "Başlık satırında: Yardım (Alt + H), Ayarlar (Alt + O), Renkler (Alt + K) ve Sesli okuma (Alt + V). Tüm klavye kısayollarını Alt + T sana gösterir."
          : "Başlık satırında: Yardım (Alt + H), Ayarlar (Alt + O), Renkler (Alt + K) ve Sesli okuma (Alt + V). Tüm klavye kısayollarını Alt + T gösterir.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Hesabınız" : "Hesabın"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? `Burada (Alt + J) mesajlarınızı, "Şifreyi değiştir" ve "Çıkış yap" seçeneklerini bulursunuz. "Sınıflarım" (Alt + S) sizi sınıflarınıza geri götürür.`
        : wer === "gast"
          ? sie(ton, anrede)
            ? `Burada giriş yaparsınız (Alt + J). O zaman ilerlemeniz kaydedilir ve "İlerlemem" sayfasını görürsünüz.`
            : `Burada giriş yaparsın (Alt + J). O zaman ilerlemen kaydedilir ve "İlerlemem" sayfasını görürsün.`
          : sie(ton, anrede)
            ? `Burada (Alt + J) "İlerlemem" (Alt + S), mesajlarınız ve "Şifreyi değiştir" bulunur.`
            : ton === "erwachsen"
              ? `Burada (Alt + J) "İlerlemem" (Alt + S), mesajların ve "Şifreyi değiştir" bulunur.`
              : `Burada (Alt + J) rozetlerinle birlikte "İlerlemem" (Alt + S), mesajların ve "Şifreyi değiştir" bulunur.`,
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Haydi başlayalım!" : "Başlayalım"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Bu tanıtım turunu her zaman Yardım bölümünde (Alt + H) bulursunuz. Şimdi yazmaya başlayın."
        : "Bu tanıtım turunu her zaman Yardım bölümünde (Alt + H) bulursun. Şimdi yazmaya başla.",

    mkKopfName: "Sınıfın başlık satırı",
    mkKopf:
      `Sınıfın adı, öğrenci sayısı ve sınıf kodu. Birden fazla sınıfınız varsa burada değiştirirsiniz. "İndirmeler" altında öğretmen kılavuzları ve asmak için bir afiş bulunur.`,
    mkBereichName: "İlerleme | Öğrenciler ve girişler",
    mkBereich:
      `Şu anda ilerlemeyi görüyorsunuz. "Öğrenciler ve girişler" bölümünde sınıf ve öğrenci oluşturur, şifreleri görür ve Excel dosyasından öğrenci eklersiniz.`,
    mkTippchallengeName: "Yarışma",
    mkTippchallenge:
      "Bütün sınıf için bir yarışma: metni ve süreyi siz belirlersiniz, sonra sonuçlar burada görünür.",
    mkEigeneUebungName: "Kişisel alıştırma",
    mkEigeneUebung:
      `Bütün sınıf için bir metin - bir dosyadan, "Metinlerim" içinden ya da bir şablondan. Her öğrenci onu bir kez kendi hızında yazar; birden fazlası sırayla gelir.`,
    mkWochenzielName: "Haftalık hedef",
    mkWochenziel:
      "Haftada kaç dakika çalışılacağı - her öğrenci için ayrı ya da herkes için birden. Hafta başlangıcı: Pazartesi, 08:00.",
    mkEinstellungenName: "Sınıf ayarları",
    mkEinstellungen:
      "Sınıf düzeyi, dil, başlangıç noktası ve Sınıf Maçı - sınıfın bütün öğrencileri için birden.",
    mkSperrenName: "Hedefi 1 saat durdur",
    mkSperren:
      "60 dakika boyunca bütün sınıfın çalışması haftalık hedefe sayılmaz, ama çalışma süresine sayılır - örneğin ders saatinde. Aynı düğmeyle hedefe yeniden devam edersiniz.",
    mkUeberblickName: "Sınıfa genel bakış",
    mkUeberblick:
      `Bütün sınıf tek bakışta, "Ay" (son 4 hafta) ya da "Öğretim yılı" için: puan çubuğu ve puanın çizgi grafiği. Ayrıca: "Sınıfa mesaj".`,
    mkZeitraumName: "Zaman aralığı",
    mkZeitraum:
      `Hafta, Ay, Öğretim yılı ya da Başından beri - Alt + sol ok ve Alt + sağ ok ile geçersiniz. "Excel olarak indir" dört zaman aralığının hepsini alır.`,
    mkTabelleName: "Tablo",
    mkTabelle:
      "Her satırda bir öğrenci. Bir sütun başlığı o sütuna göre sıralar; bir sütunun ne anlama geldiğini, o sütuna gittiğinizde bir ipucu gösterir.",
    mkKindName: "Bir öğrencinin satırı",
    mkKind:
      "Satır açılır: öğrencinin ayarları, yarışmalar, haftalara göre çalışma süreleri, henüz oturmamış tuşlar ve rozetler.",
    mkWerkzeugeName: "Başlık satırı",
    mkWerkzeuge:
      `"Alıştırma yap" (Alt + U) sizi kendi alıştırmanıza götürür. Yardım (Alt + H) her şeyi ayrıntılı açıklar - bu tanıtım turunu da orada yeniden bulursunuz.`,

    kuzKlassenName: "Sınıflar",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Burada bir sınıf oluşturun: ad, sınıf düzeyi ve sınıf kodu. Öğrenciler sınıf koduyla giriş yapar - her öğrenme programında."
        : "Burada ilk sınıfınızı oluşturun: ad, sınıf düzeyi ve sınıf kodu. Sonra altında öğrencileri ekleyin - tek tek ya da bir Excel dosyasıyla - ve giriş bilgilerini görün.",
    kuzKlasseName: "Sınıf",
    kuzKlasse: "Sınıf kodu, sınıfın programları, ortak öğretmenler ve e-postayla haftalık rapor.",
    kuzLernendeName: "Öğrenciler",
    kuzLernende:
      `Öğrencileri ad ve şifreyle eklersiniz. Her öğrenci için: şifreyi değiştirme, iletişim e-postası, başka sınıfa taşıma. "Giriş bilgilerini yazdır" size dağıtmak için bir liste verir.`,
    kuzExcelName: "Birçok öğrenci birden (Excel)",
    kuzExcel:
      `"Şablonu indir (Excel)", her öğrenci için bir satır doldurun, sonra "Excel dosyasından öğrenci ekle" - hesaplar oluşturulmadan önce bir önizleme görürsünüz.`,
    kuzZurueckName: "İlerlemeye dön",
    kuzZurueck: `Üstte "İlerleme" ile. Bu tanıtım turunu Yardım bölümünde (Alt + H) bulursunuz.`,
  },
  // ★ O-CS (03.10.2026): „Prohlídka" (Glossar §2.5). Kind, Jugend und Selbstlernende (auch
  // Erwachsene) ty; die Lehrkraft (`sie`) vy in der Mehrzahlform, „Moje třídy" immer vy
  // (Regel 1). Nie eine Vergangenheit der 2. Person (Regel 2). Der Schritt ist eine Ansage
  // (Live-Bereich): darum KEINE Anführungszeichen, Knopf- und Bereichsnamen mit Kopfwort
  // („tlačítko Hrát", „karta Žáci a přístupy", „stránka Můj pokrok", Regel 7 und 12);
  // „Krok 2/7" (Regel 13); kein Satz endet mit einer Zahl und Punkt (Falle 4).
  cs: {
    name: "Prohlídka",
    zaehler: (nr: number, von: number) => `Prohlídka: krok ${nr}/${von}`,
    weiter: "Další",
    fertig: "Hotovo",
    ueberspringen: "Přeskočit",
    geschafft: "Prohlídka je u konce.",
    nochmalUeben: "Prohlídka znovu",
    durchUebungsseite: "Prohlídka stránky pro cvičení",
    durchMeineKlassen: "Prohlídka sekce Moje třídy",
    durchDieSeite: "Prohlídka stránky",
    nochmalTipp: "Ukáže znovu krok za krokem části stránky pro cvičení.",
    meineKlassenTipp: "Ukáže krok za krokem části sekce Moje třídy.",

    uebenZeileName: (_ton: RundgangTon) => "Pole pro psaní",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Tady opisuješ, co je napsané. Prostě začni - první písmeno přistane právě tady."
        : sie(ton, anrede)
          ? "Tady opisujete text - stačí začít psát. Klávesovou zkratkou Alt + E se sem kdykoli vrátíte."
          : "Tady opisuješ text - prostě začni psát. Klávesovou zkratkou Alt + E se sem kdykoli vrátíš.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Váš stav" : "Tvůj stav"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? "Nad polem pro psaní: vaše úroveň, dnešní čas procvičování, týdenní cíl a další nová klávesa. Tlačítko Hrát spustí hru, tlačítko Třídní závod (Alt + M) závod v psaní s celou třídou."
          : "Nad polem pro psaní: vaše úroveň, dnešní čas procvičování a další nová klávesa. Tlačítko Hrát spustí hru."
        : wer === "klassenkind"
          ? "Nad polem pro psaní: tvoje úroveň, tvůj dnešní čas procvičování, tvůj týdenní cíl a další nová klávesa. Tlačítko Hrát spustí hru, tlačítko Třídní závod (Alt + M) závod v psaní s tvojí třídou."
          : "Nad polem pro psaní: tvoje úroveň, tvůj dnešní čas procvičování a další nová klávesa. Tlačítko Hrát spustí hru.",
    uebenTastaturName: (_ton: RundgangTon) => "Klávesnice na obrazovce",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Ukazuje ti, která klávesa je na řadě. Tlačítkem nad ní ji skryješ a zase zobrazíš."
        : "Ukazuje, která klávesa je na řadě. Tlačítko nad ní ji skryje a zase zobrazí.",
    uebenArtName: (_ton: RundgangTon) => "Druhy cvičení",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Cvičit můžeš třemi způsoby: Můj trénink, Příběhy a Slovní hry. Klávesovou zkratkou Alt + B přejdeš na další."
        : "Na výběr jsou tři: Můj trénink, Příběhy a Slovní hry. Alt + B přepne na další.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "Nástroje",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "V záhlaví: Nápověda (Alt + H), všechny klávesové zkratky (Alt + T), Nastavení (Alt + O), Barvy a kontrast (Alt + K) a Předčítání (Alt + V)."
        : ton === "kind"
          ? "V záhlaví: Nápověda (Alt + H), Nastavení (Alt + O), Barvy (Alt + K) a Předčítání (Alt + V). Všechny klávesové zkratky ti ukáže Alt + T."
          : "V záhlaví: Nápověda (Alt + H), Nastavení (Alt + O), Barvy (Alt + K) a Předčítání (Alt + V). Všechny klávesové zkratky ukáže Alt + T.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Váš účet" : "Tvůj účet"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? "Tady (Alt + J) najdete své zprávy a položky Změnit heslo a Odhlásit se. Sekce Moje třídy (Alt + S) vás vrátí k vašim třídám."
        : wer === "gast"
          ? sie(ton, anrede)
            ? "Tady se přihlásíte (Alt + J). Pak se váš pokrok uloží a uvidíte stránku Můj pokrok."
            : "Tady se přihlásíš (Alt + J). Pak se tvůj pokrok uloží a uvidíš stránku Můj pokrok."
          : sie(ton, anrede)
            ? "Tady (Alt + J) najdete stránku Můj pokrok (Alt + S), své zprávy a položku Změnit heslo."
            : ton === "erwachsen"
              ? "Tady (Alt + J) najdeš stránku Můj pokrok (Alt + S), své zprávy a položku Změnit heslo."
              : "Tady (Alt + J) najdeš stránku Můj pokrok (Alt + S) se svými odznaky, své zprávy a položku Změnit heslo.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Jdeme na to!" : "Jdeme na to"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Tuto prohlídku kdykoli znovu najdete v Nápovědě (Alt + H). Teď stačí začít psát."
        : "Tuto prohlídku kdykoli znovu najdeš v Nápovědě (Alt + H). Teď prostě začni psát.",

    mkKopfName: "Záhlaví třídy",
    mkKopf:
      "Název třídy, počet žáků a kód třídy. Máte-li více tříd, přepnete je tady. V sekci Ke stažení jsou příručky pro vyučující a plakát na zeď.",
    mkBereichName: "Pokrok | Žáci a přístupy",
    mkBereich:
      "Právě vidíte pokrok. Na kartě Žáci a přístupy vytváříte třídy a účty žáků, vidíte hesla a nahráváte žáky z Excelu.",
    mkTippchallengeName: "Výzva",
    mkTippchallenge:
      "Výzva pro celou třídu: text a čas určíte vy, potom tu najdete výsledky.",
    mkEigeneUebungName: "Vlastní cvičení",
    mkEigeneUebung:
      "Jeden text pro celou třídu - ze souboru, ze sekce Moje texty nebo ze šablony. Každé dítě ho napíše jednou svým tempem; více cvičení přijde postupně.",
    mkWochenzielName: "Týdenní cíl",
    mkWochenziel:
      "Kolik minut týdně se má cvičit - pro každé dítě zvlášť, nebo pro všechny najednou. Týden začíná v pondělí v 8:00 ráno.",
    mkEinstellungenName: "Nastavení třídy",
    mkEinstellungen:
      "Ročník, jazyk, výchozí bod a Třídní závod - pro všechny žáky třídy najednou.",
    mkSperrenName: "Pozastavit cíl na hodinu",
    mkSperren:
      "Po dobu 60 minut se cvičení celé třídy nepočítá do týdenního cíle, do času procvičování ale ano - třeba během výuky. Stejné tlačítko cíl zase obnoví.",
    mkUeberblickName: "Přehled třídy",
    mkUeberblick:
      "Celá třída na jeden pohled, za Měsíc (poslední 4 týdny) nebo za Školní rok: pruh skóre a spojnicový graf skóre. K tomu tlačítko Zpráva pro třídu.",
    mkZeitraumName: "Období",
    mkZeitraum:
      "Týden, Měsíc, Školní rok nebo Od začátku - Alt + šipka vlevo a vpravo přepíná. Tlačítko Stáhnout jako Excel vezme všechna čtyři období.",
    mkTabelleName: "Tabulka",
    mkTabelle:
      "Jedna osoba na řádek. Záhlaví sloupce řadí podle svého sloupce; co sloupec znamená, ukáže tip, jakmile na něj přejdete.",
    mkKindName: "Řádek jedné osoby",
    mkKind:
      "Rozbalí se: nastavení dané osoby, Výzvy, časy procvičování po týdnech, nejisté klávesy a odznaky.",
    mkWerkzeugeName: "Záhlaví",
    mkWerkzeuge:
      "Tlačítko Cvičit (Alt + U) vás vezme k vlastnímu cvičení. Nápověda (Alt + H) vše podrobně vysvětlí - tam najdete i tuto prohlídku.",

    kuzKlassenName: "Třídy",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Tady vytvoříte třídu: název, ročník a kód třídy. S kódem třídy se žáci přihlašují - v každém výukovém programu."
        : "Tady vytvoříte svou první třídu: název, ročník a kód třídy. Pak pod ní přidáte žáky - jednotlivě nebo souborem Excel - a uvidíte jejich přihlašovací údaje.",
    kuzKlasseName: "Třída",
    kuzKlasse: "Kód třídy, programy třídy, další vyučující a týdenní přehled e-mailem.",
    kuzLernendeName: "Žáci",
    kuzLernende:
      "Žáky přidáváte se jménem a heslem. U každé osoby: změnit heslo, kontaktní e-mail, přesunout do jiné třídy. Tlačítko Vytisknout přihlašovací údaje vám dá seznam k rozdání.",
    kuzExcelName: "Více žáků najednou (Excel)",
    kuzExcel:
      "Stáhněte šablonu (Excel), vyplňte jeden řádek pro každou osobu a pak vyberte Nahrát žáky z Excelu - před vytvořením účtů uvidíte náhled.",
    kuzZurueckName: "Zpět na pokrok",
    kuzZurueck: "Nahoře kartou Pokrok. Tuto prohlídku najdete v Nápovědě (Alt + H).",
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    name: "Обиколка",
    zaehler: (nr: number, von: number) => `Обиколка: стъпка ${nr}/${von}`,
    weiter: "Напред",
    fertig: "Готово",
    ueberspringen: "Пропусни",
    geschafft: "Обиколката приключи.",
    nochmalUeben: "Нова обиколка",
    durchUebungsseite: "Обиколка на страницата за упражнения",
    durchMeineKlassen: "Обиколка на Моите класове",
    durchDieSeite: "Обиколка на страницата",
    nochmalTipp: "Показва отново стъпка по стъпка частите на страницата за упражнения.",
    meineKlassenTipp: "Показва стъпка по стъпка частите на Моите класове.",

    uebenZeileName: (_ton: RundgangTon) => "Поле за писане",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Тук преписваш написаното. Просто започни - първата буква се появява точно тук."
        : sie(ton, anrede)
          ? "Тук преписвате текста - просто започнете да пишете. С Alt + E винаги се връщате тук."
          : "Тук преписваш текста - просто започни да пишеш. С Alt + E винаги се връщаш тук.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Вашият напредък" : "Твоят напредък"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? "Над полето за писане: вашето ниво, времето за упражнения днес, седмичната цел и следващият нов клавиш. Бутонът Играй започва игра, бутонът Състезание в класа (Alt + M) - състезание по писане с целия клас."
          : "Над полето за писане: вашето ниво, времето за упражнения днес и следващият нов клавиш. Бутонът Играй започва игра."
        : wer === "klassenkind"
          ? "Над полето за писане: твоето ниво, времето за упражнения днес, твоята седмична цел и следващият нов клавиш. Бутонът Играй започва игра, бутонът Състезание в класа (Alt + M) - състезание по писане с твоя клас."
          : "Над полето за писане: твоето ниво, времето за упражнения днес и следващият нов клавиш. Бутонът Играй започва игра.",
    uebenTastaturName: (_ton: RundgangTon) => "Екранна клавиатура",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Показва ти кой клавиш е следващ. С бутона над нея я скриваш и пак я показваш."
        : "Показва кой клавиш е следващ. Бутонът над нея я скрива и пак я показва.",
    uebenArtName: (_ton: RundgangTon) => "Видове упражнения",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Можеш да упражняваш по три начина: Моята тренировка, Истории и Игри с думи. С Alt + B преминаваш към следващия."
        : "На избор има три: Моята тренировка, Истории и Игри с думи. Alt + B превключва към следващия.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "Инструменти",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "В горната част: Помощ (Alt + H), всички клавишни комбинации (Alt + T), Настройки (Alt + O), Цветове и контраст (Alt + K) и Четене на глас (Alt + V)."
        : ton === "kind"
          ? "В горната част: Помощ (Alt + H), Настройки (Alt + O), Цветове (Alt + K) и Четене на глас (Alt + V). Всички клавишни комбинации ти показва Alt + T."
          : "В горната част: Помощ (Alt + H), Настройки (Alt + O), Цветове (Alt + K) и Четене на глас (Alt + V). Всички клавишни комбинации показва Alt + T.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Вашият акаунт" : "Твоят акаунт"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? "Тук (Alt + J) са вашите съобщения, Смяна на паролата и Излез. Моите класове (Alt + S) ви връща към вашите класове."
        : wer === "gast"
          ? sie(ton, anrede)
            ? "Тук влизате в акаунта си (Alt + J). Тогава напредъкът ви се запазва и виждате страницата Моят напредък."
            : "Тук влизаш в акаунта си (Alt + J). Тогава напредъкът ти се запазва и виждаш страницата Моят напредък."
          : sie(ton, anrede)
            ? "Тук (Alt + J) са страницата Моят напредък (Alt + S), вашите съобщения и Смяна на паролата."
            : ton === "erwachsen"
              ? "Тук (Alt + J) са страницата Моят напредък (Alt + S), твоите съобщения и Смяна на паролата."
              : "Тук (Alt + J) са страницата Моят напредък (Alt + S) с твоите значки, твоите съобщения и Смяна на паролата.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Да започваме!" : "Да започваме"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Тази обиколка винаги можете да намерите отново в Помощ (Alt + H). Сега просто започнете да пишете."
        : "Тази обиколка винаги можеш да намериш отново в Помощ (Alt + H). Сега просто започни да пишеш.",

    mkKopfName: "Заглавие на класа",
    mkKopf:
      "Името на класа, броят на учениците и кодът на класа. Ако имате няколко класа, превключвате между тях тук. В Изтегляния са ръководствата за учители и плакатът за стената.",
    mkBereichName: "Напредък | Ученици и достъп",
    mkBereich:
      "Сега виждате напредъка. В раздела Ученици и достъп създавате класове и акаунти за ученици, виждате паролите и добавяте ученици от файл на Excel.",
    mkTippchallengeName: "Предизвикателство",
    mkTippchallenge:
      "Предизвикателство за целия клас: вие определяте текста и времето, а резултатите се показват тук след това.",
    mkEigeneUebungName: "Собствено упражнение",
    mkEigeneUebung:
      "Един текст за целия клас - от файл, от Моите текстове или от шаблон. Всеки ученик го пише веднъж със собствена скорост; няколко упражнения следват едно след друго.",
    mkWochenzielName: "Седмична цел",
    mkWochenziel:
      "Колко минути седмично трябва да се упражняват учениците - за всеки поотделно или за всички наведнъж. Седмицата започва в понеделник в 8:00.",
    mkEinstellungenName: "Настройки на класа",
    mkEinstellungen:
      "Клас в училище, език, начална точка и Състезание в класа - за всички ученици в класа наведнъж.",
    mkSperrenName: "Спри целта за 1 час",
    mkSperren:
      "За 60 минути упражненията на целия клас не се броят към седмичната цел, но се броят във времето за упражнения - удобно по време на час. Същият бутон възобновява целта.",
    mkUeberblickName: "Преглед на класа",
    mkUeberblick:
      "Целият клас накратко, за Месец (последните 4 седмици) или за Учебна година: лента с резултати и линейна диаграма на резултата. Тук е и бутонът Съобщение до класа.",
    mkZeitraumName: "Периодът",
    mkZeitraum:
      "Седмица, Месец, Учебна година или От началото - с Alt + стрелка наляво и надясно се движите назад и напред. Изтегли като Excel включва и четирите периода.",
    mkTabelleName: "Таблицата",
    mkTabelle:
      "Един ученик на ред. Заглавието на колона сортира по тази колона; какво означава колоната, обяснява съвет, щом преминете към нея.",
    mkKindName: "Редът на един ученик",
    mkKind:
      "Разгъва се: настройките на ученика, Предизвикателствата, времето за упражнения по седмици, несигурните клавиши и значките.",
    mkWerkzeugeName: "Заглавната част",
    mkWerkzeuge:
      "Упражнения (Alt + U) ви води към вашето собствено упражняване. Помощта (Alt + H) обяснява всичко подробно - там отново ще намерите и тази обиколка.",

    kuzKlassenName: "Класове",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Тук създавате клас: име, клас в училище и код на класа. С кода на класа учениците влизат - във всяко приложение."
        : "Тук създавате първия си клас: име, клас в училище и код на класа. После отдолу добавяте ученици - поотделно или от файл на Excel - и виждате данните им за вход.",
    kuzKlasseName: "Класът",
    kuzKlasse: "Кодът на класа, приложенията на класа, други учители и седмичният отчет по имейл.",
    kuzLernendeName: "Ученици",
    kuzLernende:
      "Добавяте ученици с име и парола. За всеки ученик: смяна на паролата, контактен имейл адрес, преместване в друг клас. Бутонът Отпечатай данните за вход ви дава списък за раздаване.",
    kuzExcelName: "Много наведнъж (Excel)",
    kuzExcel:
      "Изтеглете шаблона (Excel), попълнете по един ред за всеки ученик, после изберете Добави ученици от файл на Excel - преди да се създаде нещо, виждате преглед.",
    kuzZurueckName: "Обратно към напредъка",
    kuzZurueck: "Горе с раздела Напредък. Обиколката ще намерите в Помощ (Alt + H).",
  },
  el: {
    name: "Ξενάγηση",
    zaehler: (nr: number, von: number) => `Ξενάγηση: βήμα ${nr} από ${von}`,
    weiter: "Επόμενο",
    fertig: "Τέλος",
    ueberspringen: "Παράλειψη",
    geschafft: "Η ξενάγηση ολοκληρώθηκε.",
    nochmalUeben: "Επανάληψη ξενάγησης",
    durchUebungsseite: "Ξενάγηση στη σελίδα εξάσκησης",
    durchMeineKlassen: "Ξενάγηση στην ενότητα Τα τμήματά μου",
    durchDieSeite: "Ξενάγηση στη σελίδα",
    nochmalTipp: "Δείχνει ξανά, βήμα βήμα, τα μέρη της σελίδας εξάσκησης.",
    meineKlassenTipp: "Δείχνει βήμα βήμα τα μέρη της ενότητας Τα τμήματά μου.",

    uebenZeileName: (_ton: RundgangTon) => "Το πεδίο γραφής",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Εδώ αντιγράφεις αυτό που βλέπεις γραμμένο. Απλώς ξεκίνα - το πρώτο γράμμα εμφανίζεται ακριβώς εδώ."
        : sie(ton, anrede)
          ? "Εδώ αντιγράφετε το κείμενο - αρκεί να αρχίσετε να γράφετε. Με Alt + E επιστρέφετε εδώ οποιαδήποτε στιγμή."
          : "Εδώ αντιγράφεις το κείμενο - απλώς άρχισε να γράφεις. Με Alt + E επιστρέφεις εδώ οποιαδήποτε στιγμή.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Η κατάστασή σας" : "Η κατάστασή σου"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? "Πάνω από το πεδίο γραφής: το επίπεδό σας, ο σημερινός χρόνος εξάσκησης, ο εβδομαδιαίος στόχος σας και το επόμενο νέο πλήκτρο. Το κουμπί Παιχνίδι ξεκινά ένα παιχνίδι, ο Αγώνας τμήματος (Alt + M) έναν αγώνα γραφής με το τμήμα σας."
          : "Πάνω από το πεδίο γραφής: το επίπεδό σας, ο σημερινός χρόνος εξάσκησης και το επόμενο νέο πλήκτρο. Το κουμπί Παιχνίδι ξεκινά ένα παιχνίδι."
        : wer === "klassenkind"
          ? "Πάνω από το πεδίο γραφής: το επίπεδό σου, ο σημερινός χρόνος εξάσκησης, ο εβδομαδιαίος στόχος σου και το επόμενο νέο πλήκτρο. Το κουμπί Παιχνίδι ξεκινά ένα παιχνίδι, ο Αγώνας τμήματος (Alt + M) έναν αγώνα γραφής με το τμήμα σου."
          : "Πάνω από το πεδίο γραφής: το επίπεδό σου, ο σημερινός χρόνος εξάσκησης και το επόμενο νέο πλήκτρο. Το κουμπί Παιχνίδι ξεκινά ένα παιχνίδι.",
    uebenTastaturName: (_ton: RundgangTon) => "Το πληκτρολόγιο οθόνης",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Σου δείχνει ποιο πλήκτρο είναι το επόμενο. Με το κουμπί από πάνω το κρύβεις και το εμφανίζεις ξανά."
        : "Δείχνει ποιο πλήκτρο είναι το επόμενο. Το κουμπί από πάνω το κρύβει και το εμφανίζει ξανά.",
    uebenArtName: (_ton: RundgangTon) => "Το είδος εξάσκησης",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Μπορείς να εξασκείσαι με τρεις τρόπους: Η εξάσκησή μου, Ιστορίες και Παιχνίδια λέξεων. Με Alt + B πηγαίνεις στον επόμενο."
        : "Υπάρχουν τρεις επιλογές: Η εξάσκησή μου, Ιστορίες και Παιχνίδια λέξεων. Το Alt + B αλλάζει στην επόμενη.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "Τα εργαλεία",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "Στην κεφαλίδα: Βοήθεια (Alt + H), όλες οι συντομεύσεις πληκτρολογίου (Alt + T), Ρυθμίσεις (Alt + O), χρώματα και αντίθεση (Alt + K) και Εκφώνηση (Alt + V)."
        : "Στην κεφαλίδα: Βοήθεια (Alt + H), Ρυθμίσεις (Alt + O), Χρώματα (Alt + K) και Εκφώνηση (Alt + V). Όλες οι συντομεύσεις πληκτρολογίου εμφανίζονται με Alt + T.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Ο λογαριασμός σας" : "Ο λογαριασμός σου"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? "Εδώ (Alt + J) θα βρείτε τα μηνύματά σας, την Αλλαγή κωδικού πρόσβασης και την Αποσύνδεση. Η ενότητα Τα τμήματά μου (Alt + S) σας επαναφέρει στα τμήματά σας."
        : wer === "gast"
          ? sie(ton, anrede)
            ? "Εδώ συνδέεστε (Alt + J). Έτσι αποθηκεύεται η πρόοδός σας και βλέπετε τη σελίδα Η πρόοδός μου."
            : "Εδώ συνδέεσαι (Alt + J). Έτσι αποθηκεύεται η πρόοδός σου και βλέπεις τη σελίδα Η πρόοδός μου."
          : sie(ton, anrede)
            ? "Εδώ (Alt + J) θα βρείτε τη σελίδα Η πρόοδός μου (Alt + S), τα μηνύματά σας και την Αλλαγή κωδικού πρόσβασης."
            : ton === "erwachsen"
              ? "Εδώ (Alt + J) θα βρεις τη σελίδα Η πρόοδός μου (Alt + S), τα μηνύματά σου και την Αλλαγή κωδικού πρόσβασης."
              : "Εδώ (Alt + J) θα βρεις τη σελίδα Η πρόοδός μου (Alt + S) με τα μετάλλιά σου, τα μηνύματά σου και την Αλλαγή κωδικού πρόσβασης.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Πάμε!" : "Πάμε"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Αυτή την ξενάγηση μπορείτε να τη βρείτε ξανά οποιαδήποτε στιγμή στη Βοήθεια (Alt + H). Τώρα αρκεί να αρχίσετε να γράφετε."
        : "Αυτή την ξενάγηση μπορείς να τη βρεις ξανά οποιαδήποτε στιγμή στη Βοήθεια (Alt + H). Τώρα απλώς άρχισε να γράφεις.",

    mkKopfName: "Η κεφαλίδα του τμήματος",
    mkKopf:
      "Το όνομα του τμήματος, ο αριθμός των μαθητών και ο κωδικός τμήματος. Αν έχετε περισσότερα τμήματα, εδώ εναλλάσσεστε ανάμεσά τους. Στα Αρχεία για λήψη βρίσκονται οι οδηγοί για εκπαιδευτικούς και η αφίσα για να την κρεμάσετε.",
    mkBereichName: "Πρόοδος | Μαθητές και πρόσβαση",
    mkBereich:
      "Τώρα βλέπετε την πρόοδο. Στο Μαθητές και πρόσβαση δημιουργείτε τμήματα και προσθέτετε μαθητές, βλέπετε τους κωδικούς πρόσβασης και προσθέτετε μαθητές από αρχείο Excel.",
    mkTippchallengeName: "Πρόκληση",
    mkTippchallenge:
      "Μια Πρόκληση για όλο το τμήμα: εσείς ορίζετε το κείμενο και τον χρόνο, και τα αποτελέσματα εμφανίζονται εδώ στη συνέχεια.",
    mkEigeneUebungName: "Προσαρμοσμένη άσκηση",
    mkEigeneUebung:
      "Ένα κείμενο για όλο το τμήμα - από αρχείο, από την ενότητα Τα κείμενά μου ή από πρότυπο. Κάθε παιδί το γράφει μία φορά με τον δικό του ρυθμό. Αν υπάρχουν περισσότερες ασκήσεις, έρχονται η μία μετά την άλλη.",
    mkWochenzielName: "Εβδομαδιαίος στόχος",
    mkWochenziel:
      "Πόσα λεπτά την εβδομάδα πρέπει να εξασκούνται τα παιδιά - για κάθε παιδί χωριστά ή για όλα μαζί. Η εβδομάδα ξεκινά τη Δευτέρα στις 8:00.",
    mkEinstellungenName: "Ρυθμίσεις τμήματος",
    mkEinstellungen:
      "Τάξη, γλώσσα, σημείο εκκίνησης και Αγώνας τμήματος - για όλα τα παιδιά του τμήματος ταυτόχρονα.",
    mkSperrenName: "Παύση στόχου για 1 ώρα",
    mkSperren:
      "Για 60 λεπτά η εξάσκηση ολόκληρου του τμήματος δεν προσμετράται στον εβδομαδιαίο στόχο, προσμετράται όμως στον χρόνο εξάσκησης - χρήσιμο στην τάξη. Το ίδιο κουμπί συνεχίζει τον στόχο.",
    mkUeberblickName: "Η επισκόπηση του τμήματος",
    mkUeberblick:
      "Όλο το τμήμα με μια ματιά, για τον Μήνα (τις τελευταίες 4 εβδομάδες) ή για το Σχολικό έτος: μια μπάρα σκορ και ένα γράφημα γραμμών του σκορ. Εδώ βρίσκεται και το Μήνυμα στο τμήμα.",
    mkZeitraumName: "Η περίοδος",
    mkZeitraum:
      "Εβδομάδα, Μήνας, Σχολικό έτος ή Από την αρχή - με Alt + αριστερό ή δεξιό βέλος πηγαίνετε πίσω και μπροστά. Η Λήψη ως Excel περιλαμβάνει και τις τέσσερις περιόδους.",
    mkTabelleName: "Ο πίνακας",
    mkTabelle:
      "Ένα παιδί ανά γραμμή. Η επικεφαλίδα μιας στήλης ταξινομεί με βάση αυτή τη στήλη, και μια συμβουλή εξηγεί κάθε στήλη μόλις μεταβείτε σε αυτήν.",
    mkKindName: "Η γραμμή ενός παιδιού",
    mkKind:
      "Ανοίγει προς τα κάτω: οι ρυθμίσεις του παιδιού, οι Προκλήσεις, οι χρόνοι εξάσκησης ανά εβδομάδα, τα αβέβαια πλήκτρα και τα μετάλλια.",
    mkWerkzeugeName: "Η κεφαλίδα",
    mkWerkzeuge:
      "Το κουμπί Εξάσκηση (Alt + U) σας μεταφέρει στη δική σας εξάσκηση. Η Βοήθεια (Alt + H) εξηγεί τα πάντα αναλυτικά - εκεί θα βρείτε ξανά και αυτή την ξενάγηση.",

    kuzKlassenName: "Τμήματα",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Εδώ δημιουργείτε ένα τμήμα: όνομα, τάξη και κωδικός τμήματος. Με τον κωδικό τμήματος συνδέονται τα παιδιά - σε κάθε εφαρμογή."
        : "Εδώ δημιουργείτε το πρώτο σας τμήμα: όνομα, τάξη και κωδικός τμήματος. Μετά προσθέτετε από κάτω τα παιδιά - ένα ένα ή από αρχείο Excel - και βλέπετε τα στοιχεία σύνδεσής τους.",
    kuzKlasseName: "Το τμήμα",
    kuzKlasse: "Ο κωδικός τμήματος, οι εφαρμογές του τμήματος, οι άλλοι εκπαιδευτικοί και η εβδομαδιαία αναφορά με e-mail.",
    kuzLernendeName: "Μαθητές",
    kuzLernende:
      "Προσθέτετε μαθητές με όνομα και κωδικό πρόσβασης. Για κάθε παιδί: αλλαγή κωδικού πρόσβασης, e-mail επικοινωνίας, μετακίνηση σε άλλο τμήμα. Η Εκτύπωση στοιχείων σύνδεσης σας δίνει μια λίστα για διανομή.",
    kuzExcelName: "Πολλοί μαζί (Excel)",
    kuzExcel:
      "Λήψη προτύπου (Excel), συμπλήρωση μίας γραμμής για κάθε παιδί και μετά Προσθήκη μαθητών από αρχείο Excel - βλέπετε μια προεπισκόπηση πριν δημιουργηθεί οτιδήποτε.",
    kuzZurueckName: "Πίσω στην πρόοδο",
    kuzZurueck: "Πηγαίνετε στο Πρόοδος, στο επάνω μέρος. Αυτή την ξενάγηση θα τη βρείτε στη Βοήθεια (Alt + H).",
  },
  hu: {
    name: "Bemutató",
    zaehler: (nr: number, von: number) => `Bemutató: ${nr}/${von}`,
    weiter: "Tovább",
    fertig: "Kész",
    ueberspringen: "Kihagyás",
    geschafft: "Sikerült.",
    nochmalUeben: "Bemutató újra",
    durchUebungsseite: "Bemutató a gyakorlóoldalról",
    durchMeineKlassen: "Bemutató az Osztályaim részről",
    durchDieSeite: "Bemutató az oldalról",
    nochmalTipp: "Újra megmutatja a gyakorlóoldal részeit, lépésről lépésre.",
    meineKlassenTipp: "Lépésről lépésre megmutatja az „Osztályaim” részeit.",

    uebenZeileName: (_ton: RundgangTon) => "A gépelési mező",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Itt írod le a szöveget, ami ott áll. Kezdj el gépelni - az első betű rögtön ide kerül."
        : sie(ton, anrede)
          ? "Itt kell leírni a szöveget - elég elkezdeni gépelni. Az Alt + E billentyűparancs bármikor ide visz vissza."
          : "Itt írod le a szöveget - kezdj el gépelni. Az Alt + E billentyűparancs bármikor ide visz vissza.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Haladás" : "Haladásod"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? "A gépelési mező fölött: a szint, a mai gyakorlási idő, a heti cél és a következő új billentyű. A „Játék” gombbal játék indul, az „Osztályverseny” gombbal (Alt + M) gépelési verseny az osztállyal."
          : "A gépelési mező fölött: a szint, a mai gyakorlási idő és a következő új billentyű. A „Játék” gombbal játék indul."
        : wer === "klassenkind"
          ? "A gépelési mező fölött látod a szintedet, a mai gyakorlási idődet, a heti célodat és a következő új billentyűt. A „Játék” gombbal játék indul, az „Osztályverseny” gombbal (Alt + M) gépelési verseny az osztályoddal."
          : "A gépelési mező fölött látod a szintedet, a mai gyakorlási idődet és a következő új billentyűt. A „Játék” gombbal játék indul.",
    uebenTastaturName: (_ton: RundgangTon) => "A képernyő-billentyűzet",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Megmutatja, melyik billentyű következik. A fölötte lévő gombbal elrejtheted, és újra előhozhatod."
        : "Megmutatja, melyik billentyű következik. A fölötte lévő gomb elrejti, majd újra előhozza.",
    uebenArtName: (_ton: RundgangTon) => "A gyakorlattípusok",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Háromféleképpen gyakorolhatsz: „Saját gyakorlás”, „Történetek” és „Szójátékok”. Az Alt + B a következőre vált."
        : "Három közül lehet választani: „Saját gyakorlás”, „Történetek” és „Szójátékok”. Az Alt + B a következőre vált.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "Az eszközök",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "A fejlécben: Súgó (Alt + H), az összes billentyűparancs (Alt + T), Beállítások (Alt + O), színek és kontraszt (Alt + K) és Felolvasás (Alt + V)."
        : "A fejlécben: Súgó (Alt + H), Beállítások (Alt + O), színek (Alt + K) és Felolvasás (Alt + V). Az összes billentyűparancsot az Alt + T mutatja.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "A fiók" : "A fiókod"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? "Itt (Alt + J) vannak az üzenetek, a „Jelszó módosítása” és a „Kijelentkezés”. Az „Osztályaim” (Alt + S) visszavisz az osztályokhoz."
        : wer === "gast"
          ? sie(ton, anrede)
            ? "Itt lehet bejelentkezni (Alt + J). Utána a haladás elmentődik, és megnyílik a „Fejlődésem” oldal."
            : "Itt tudsz bejelentkezni (Alt + J). Utána elmentődik a haladásod, és megnézheted a „Fejlődésem” oldalt."
          : sie(ton, anrede)
            ? "Itt (Alt + J) található a „Fejlődésem” oldal (Alt + S), az üzenetek és a „Jelszó módosítása”."
            : ton === "erwachsen"
              ? "Itt (Alt + J) találod a „Fejlődésem” oldalt (Alt + S), az üzeneteidet és a „Jelszó módosítása” menüpontot."
              : "Itt (Alt + J) találod a „Fejlődésem” oldalt (Alt + S) a jelvényeiddel, az üzeneteidet és a „Jelszó módosítása” menüpontot.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Kezdjük!" : "Kezdhetjük"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "A bemutató bármikor újra megtalálható a Súgóban (Alt + H). Most elég elkezdeni a gépelést."
        : "A bemutatót bármikor újra megtalálod a Súgóban (Alt + H). Most csak kezdj el gépelni.",

    mkKopfName: "Az osztály fejléce",
    mkKopf:
      "Az osztály neve, a tanulók száma és az osztálykód. Több osztály között itt lehet váltani. A „Letöltések” alatt vannak a tanároknak szóló kézikönyvek és a kifüggeszthető plakát.",
    mkBereichName: "Haladás | Tanulók és belépések",
    mkBereich:
      "Most a haladás látszik. A „Tanulók és belépések” részben lehet osztályokat létrehozni, tanulókat felvenni, jelszavakat megnézni, és tanulókat Excel-fájlból felvenni.",
    mkTippchallengeName: "Kihívás",
    mkTippchallenge:
      "Kihívás az egész osztálynak: a szöveg és az idő beállítható, az eredmények utána itt jelennek meg.",
    mkEigeneUebungName: "Saját gyakorlat",
    mkEigeneUebung:
      "Egy szöveg az egész osztálynak - fájlból, a „Saját szövegeim” közül vagy sablonból. Minden tanuló egyszer gépeli le, a saját sebességével; több gyakorlat egymás után következik.",
    mkWochenzielName: "Heti cél",
    mkWochenziel:
      "Hány percet kell hetente gyakorolni - tanulónként külön, vagy mindenkinek egyszerre. A hét hétfőn 8:00-kor kezdődik.",
    mkEinstellungenName: "Az osztály beállításai",
    mkEinstellungen:
      "Évfolyam, nyelv, kiindulópont és Osztályverseny - az osztály összes tanulójára egyszerre.",
    mkSperrenName: "Cél szüneteltetése egy órára",
    mkSperren:
      "60 percig az egész osztály gyakorlása nem számít bele a heti célba, a gyakorlási időbe viszont igen - például tanóra alatt hasznos. Ugyanez a gomb fejezi be a szünetet.",
    mkUeberblickName: "Az osztály áttekintése",
    mkUeberblick:
      "Az egész osztály egy pillantásra, a „Hónap” (az utolsó 4 hét) vagy a „Tanév” szerint: pontszámsáv és a pontszám vonaldiagramja. Itt van az „Üzenet az osztálynak” is.",
    mkZeitraumName: "Az időszak",
    mkZeitraum:
      "Hét, Hónap, Tanév vagy Kezdettől - az Alt + balra nyíl és az Alt + jobbra nyíl lapoz vissza és előre. A „Letöltés Excel-fájlként” mind a négy időszakot tartalmazza.",
    mkTabelleName: "A táblázat",
    mkTabelle:
      "Soronként egy tanuló. Az oszlopfej a saját oszlopa szerint rendez; hogy mit jelent egy oszlop, azt tipp mondja el, amint a fókusz odaér.",
    mkKindName: "Egy tanuló sora",
    mkKind:
      "Kinyílik: a tanuló beállításai, Kihívások, heti gyakorlási idők, bizonytalan billentyűk és jelvények.",
    mkWerkzeugeName: "A fejléc",
    mkWerkzeuge:
      "A „Gyakorlás” (Alt + U) a saját gyakorláshoz visz. A Súgó (Alt + H) mindent részletesen elmagyaráz - ott van ez a bemutató is.",

    kuzKlassenName: "Osztályok",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Itt lehet osztályt létrehozni: név, évfolyam és osztálykód. A tanulók az osztálykóddal jelentkeznek be - minden programban."
        : "Itt hozható létre az első osztály: név, évfolyam és osztálykód. Utána lent felvehetők a tanulók - egyenként vagy Excel-fájlból -, és megnézhetők a belépési adataik.",
    kuzKlasseName: "Az osztály",
    kuzKlasse: "Az osztálykód, az osztály programjai, további tanárok és a heti összesítő e-mailben.",
    kuzLernendeName: "Tanulók",
    kuzLernende:
      "A tanulók névvel és jelszóval vehetők fel. Tanulónként: jelszó módosítása, kapcsolattartó e-mail-cím, áthelyezés másik osztályba. A „Belépési adatok nyomtatása” kiosztható listát ad.",
    kuzExcelName: "Sok tanuló egyszerre (Excel)",
    kuzExcel:
      "„Sablon letöltése (Excel)”, tanulónként egy sor kitöltése, majd „Tanulók felvétele Excel-fájlból” - létrehozás előtt előnézet látszik.",
    kuzZurueckName: "Vissza a haladáshoz",
    kuzZurueck: "Fent a „Haladás” lappal. Ez a bemutató a Súgóban (Alt + H) található.",
  },
  nl: {
    name: "Rondleiding",
    zaehler: (nr: number, von: number) => `Rondleiding ${nr} van ${von}`,
    weiter: "Volgende",
    fertig: "Klaar",
    ueberspringen: "Overslaan",
    geschafft: "Goed gedaan.",
    nochmalUeben: "Rondleiding opnieuw bekijken",
    durchUebungsseite: "Rondleiding door de oefenpagina",
    durchMeineKlassen: "Rondleiding door Mijn klassen",
    durchDieSeite: "Rondleiding door de pagina",
    nochmalTipp: "Toont de onderdelen van de oefenpagina nog een keer, stap voor stap.",
    meineKlassenTipp: "Toont de onderdelen van Mijn klassen stap voor stap.",

    uebenZeileName: (_ton: RundgangTon) => "Het typveld",
    uebenZeile: (ton: RundgangTon) =>
      ton === "kind"
        ? "Hier typ je de tekst over. Begin gewoon - je eerste letter komt meteen hier terecht."
        : "Hier typ je de tekst over - begin gewoon met typen. Met Alt + E ben je altijd meteen terug.",
    uebenStandName: (_ton: RundgangTon) => "Jouw voortgang",
    uebenStand: (_ton: RundgangTon, wer: RundgangWer) =>
      wer === "klassenkind"
        ? "Boven het typveld: je niveau, je oefentijd van vandaag, je weekdoel en de volgende nieuwe toets. De knop Spelen start een spel, de knop Klassenwedstrijd (Alt + M) een typwedstrijd met je klas."
        : "Boven het typveld: je niveau, je oefentijd van vandaag en de volgende nieuwe toets. De knop Spelen start een spel.",
    uebenTastaturName: (_ton: RundgangTon) => "Het schermtoetsenbord",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Het laat zien welke toets aan de beurt is. Met de knop erboven verberg je het en haal je het weer terug."
        : "Het laat zien welke toets aan de beurt is. Met de knop erboven verberg je het en haal je het weer terug.",
    uebenArtName: (_ton: RundgangTon) => "De soorten oefening",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Je kunt op drie manieren oefenen: Mijn training, Verhalen en Woordspelletjes. Met Alt + B ga je naar de volgende."
        : "Je kunt kiezen uit drie: Mijn training, Verhalen en Woordspelletjes. Met Alt + B ga je naar de volgende.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "Extra",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "Bovenaan: Help (Alt + H), alle sneltoetsen (Alt + T), Instellingen (Alt + O), Kleuren en contrast (Alt + K) en Voorlezen (Alt + V)."
        : "Bovenaan: Help (Alt + H), Instellingen (Alt + O), Kleuren (Alt + K) en Voorlezen (Alt + V). Met Alt + T zie je alle sneltoetsen.",
    uebenKontoName: (_ton: RundgangTon) => "Jouw account",
    uebenKonto: (_ton: RundgangTon, wer: RundgangWer) =>
      wer === "lehrkraft"
        ? "Hier (Alt + J) vind je je berichten, Wachtwoord wijzigen en Uitloggen. Met Mijn klassen (Alt + S) ga je terug naar je klassen."
        : wer === "gast"
          ? "Log hier in (Alt + J). Dan wordt je voortgang opgeslagen en zie je Mijn voortgang."
          : "Hier (Alt + J) vind je Mijn voortgang (Alt + S) met je medailles, je berichten en Wachtwoord wijzigen.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Aan de slag!" : "Aan de slag"),
    uebenEnde: (_ton: RundgangTon) =>
      "Deze rondleiding vind je altijd terug in de Help (Alt + H). Begin nu gewoon met typen.",

    mkKopfName: "De gegevens van de klas",
    mkKopf:
      "De naam van de klas, het aantal leerlingen en de klascode. Heb je meer klassen, dan wissel je hier tussen ze. Bij Downloads staan de handleidingen voor leerkrachten en de poster om op te hangen.",
    mkBereichName: "Voortgang | Leerlingen en toegang",
    mkBereich:
      "Je ziet nu de voortgang. Bij Leerlingen en toegang maak je klassen en leerlingen aan, zie je wachtwoorden en importeer je leerlingen uit Excel.",
    mkTippchallengeName: "Uitdaging",
    mkTippchallenge:
      "Een uitdaging voor de hele klas: jij bepaalt de tekst en de tijd, daarna staan de resultaten hier.",
    mkEigeneUebungName: "Eigen oefening",
    mkEigeneUebung:
      "Eén tekst voor de hele klas - uit een bestand, uit Mijn teksten of uit een sjabloon. Elke leerling typt hem één keer in het eigen tempo; meerdere oefeningen komen na elkaar.",
    mkWochenzielName: "Weekdoel",
    mkWochenziel:
      "Hoeveel minuten per week de leerlingen moeten oefenen - per leerling of voor iedereen tegelijk. De week begint op maandag om 8.00 uur.",
    mkEinstellungenName: "Klasinstellingen",
    mkEinstellungen:
      "Leerjaar, taal, startpunt en Klassenwedstrijd - voor alle leerlingen van de klas tegelijk.",
    mkSperrenName: "1 uur pauzeren",
    mkSperren:
      "60 minuten lang telt het oefenen van de hele klas niet mee voor het weekdoel, maar wel voor de oefentijd - handig in de klas. Met dezelfde knop hervat je het weekdoel.",
    mkUeberblickName: "Klasoverzicht",
    mkUeberblick:
      "De hele klas in één oogopslag, voor de Maand (de laatste 4 weken) of het Schooljaar: een scorebalk en een lijndiagram van de score. Ook hier: Bericht aan de klas.",
    mkZeitraumName: "De periode",
    mkZeitraum:
      "Week, Maand, Schooljaar of Vanaf het begin - met Alt + pijl naar links of rechts ga je terug of vooruit. Downloaden als Excel bevat alle vier de periodes.",
    mkTabelleName: "De tabel",
    mkTabelle:
      "Eén leerling per rij. Een kolomkop sorteert op die kolom; een tip legt elke kolom uit zodra je erbij bent.",
    mkKindName: "De rij van een leerling",
    mkKind:
      "De rij klapt open: de instellingen van de leerling, Uitdagingen, oefentijden per week, onzekere toetsen en medailles.",
    mkWerkzeugeName: "Bovenaan",
    mkWerkzeuge:
      "Oefenen (Alt + U) brengt je naar je eigen oefening. De Help (Alt + H) legt alles uitgebreid uit - daar vind je deze rondleiding terug.",

    kuzKlassenName: "Klassen",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Maak hier een klas aan: naam, leerjaar en klascode. Leerlingen loggen in met de klascode - in elk programma."
        : "Maak hier je eerste klas aan: naam, leerjaar en klascode. Voeg daarna eronder de leerlingen toe - een voor een of uit een Excel-bestand - en bekijk hun inloggegevens.",
    kuzKlasseName: "De klas",
    kuzKlasse: "De klascode, de programma's van de klas, andere leerkrachten en het weekverslag per e-mail.",
    kuzLernendeName: "Leerlingen",
    kuzLernende:
      "Voeg leerlingen toe met een naam en een wachtwoord. Per leerling: wachtwoord wijzigen, e-mailadres voor contact, naar een andere klas verplaatsen. Met Inloggegevens afdrukken krijg je een lijst om uit te delen.",
    kuzExcelName: "Veel tegelijk (Excel)",
    kuzExcel:
      "Sjabloon downloaden (Excel), per leerling een rij invullen en dan Leerlingen importeren uit Excel - je ziet een voorbeeld voordat er iets wordt aangemaakt.",
    kuzZurueckName: "Terug naar de voortgang",
    kuzZurueck: "Kies bovenaan Voortgang. Deze rondleiding vind je in de Help (Alt + H).",
  },
  pt: {
    name: "Visita guiada",
    zaehler: (nr: number, von: number) => `Visita guiada: passo ${nr} de ${von}`,
    weiter: "Seguinte",
    fertig: "Concluído",
    ueberspringen: "Saltar",
    geschafft: "Visita concluída.",
    nochmalUeben: "Repetir a visita guiada",
    durchUebungsseite: "Visita guiada pela página de prática",
    durchMeineKlassen: "Visita guiada pelas turmas",
    durchDieSeite: "Visita guiada pela página",
    nochmalTipp: "Mostra outra vez, passo a passo, as partes da página de prática.",
    meineKlassenTipp: "Mostra, passo a passo, as partes de \"As minhas turmas\".",

    uebenZeileName: (_ton: RundgangTon) => "O campo de escrita",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Aqui escreves o que está no texto. Começa já - a primeira letra aparece logo aqui."
        : sie(ton, anrede)
          ? "Aqui, escreva o texto - basta começar. Com Alt + E volta aqui em qualquer altura."
          : "Aqui escreves o texto - começa já. Com Alt + E voltas aqui em qualquer altura.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "O seu progresso" : "O teu progresso"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? "Acima do campo de escrita: o seu nível, o tempo de prática de hoje, o objetivo semanal e a próxima tecla nova. \"Jogar\" abre um jogo, \"Corrida da turma\" (Alt + M) é uma corrida de escrita com a turma."
          : "Acima do campo de escrita: o seu nível, o tempo de prática de hoje e a próxima tecla nova. \"Jogar\" abre um jogo."
        : wer === "klassenkind"
          ? "Acima do campo de escrita: o teu nível, o teu tempo de prática de hoje, o teu objetivo semanal e a próxima tecla nova. \"Jogar\" abre um jogo, \"Corrida da turma\" (Alt + M) é uma corrida de escrita com a tua turma."
          : "Acima do campo de escrita: o teu nível, o teu tempo de prática de hoje e a próxima tecla nova. \"Jogar\" abre um jogo.",
    uebenTastaturName: (_ton: RundgangTon) => "O teclado no ecrã",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Mostra-te qual é a próxima tecla. O botão por cima dele esconde-o e volta a mostrá-lo."
        : "Mostra qual é a próxima tecla. O botão por cima dele esconde-o e volta a mostrá-lo.",
    uebenArtName: (_ton: RundgangTon) => "Os tipos de exercício",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Podes praticar de três maneiras: \"O meu treino\", \"Histórias\" e \"Jogos de palavras\". Com Alt + B passas ao seguinte."
        : "Há três à escolha: \"O meu treino\", \"Histórias\" e \"Jogos de palavras\". Alt + B passa ao seguinte.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "As ferramentas",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "No cabeçalho: Ajuda (Alt + H), todos os atalhos de teclado (Alt + T), Definições (Alt + O), cores e contraste (Alt + K) e leitura em voz alta (Alt + V)."
        : ton === "kind"
          ? "No cabeçalho: Ajuda (Alt + H), Definições (Alt + O), cores (Alt + K) e leitura em voz alta (Alt + V). Com Alt + T vês todos os atalhos de teclado."
          : "No cabeçalho: Ajuda (Alt + H), Definições (Alt + O), cores (Alt + K) e leitura em voz alta (Alt + V). Alt + T mostra todos os atalhos de teclado.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "A sua conta" : "A tua conta"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? "Aqui (Alt + J) estão as suas mensagens, \"Alterar palavra-passe\" e \"Terminar sessão\". Com \"As minhas turmas\" (Alt + S) volta às suas turmas."
        : wer === "gast"
          ? sie(ton, anrede)
            ? "Aqui inicia a sessão (Alt + J). Depois o seu progresso fica guardado e pode ver \"Os meus progressos\"."
            : "Aqui inicias a sessão (Alt + J). Depois o teu progresso fica guardado e podes ver \"Os meus progressos\"."
          : sie(ton, anrede)
            ? "Aqui (Alt + J) encontra \"Os meus progressos\" (Alt + S), as suas mensagens e \"Alterar palavra-passe\"."
            : ton === "erwachsen"
              ? "Aqui (Alt + J) encontras \"Os meus progressos\" (Alt + S), as tuas mensagens e \"Alterar palavra-passe\"."
              : "Aqui (Alt + J) encontras \"Os meus progressos\" (Alt + S) com as tuas medalhas, as tuas mensagens e \"Alterar palavra-passe\".",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Vamos a isso!" : "Vamos a isso"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Pode voltar a encontrar esta visita guiada, em qualquer altura, na ajuda (Alt + H). Agora é só começar a escrever."
        : "Voltas a encontrar esta visita guiada, em qualquer altura, na ajuda (Alt + H). Agora é só começar a escrever.",

    mkKopfName: "O cabeçalho da turma",
    mkKopf:
      "O nome da turma, o número de estudantes e o código da turma. Se tem várias turmas, mude de uma para outra aqui. Em \"Transferências\" estão os guias para docentes e o cartaz para afixar.",
    mkBereichName: "Progressos | Estudantes e acessos",
    mkBereich:
      "Está agora a ver os progressos. Em \"Estudantes e acessos\" cria turmas e adiciona estudantes, vê palavras-passe e importa estudantes de um ficheiro Excel.",
    mkTippchallengeName: "Desafio",
    mkTippchallenge:
      "Um Desafio para a turma toda: define o texto e o tempo, e os resultados aparecem aqui depois.",
    mkEigeneUebungName: "Exercício personalizado",
    mkEigeneUebung:
      "Um texto para a turma toda - de um ficheiro, de \"Os meus textos\" ou de um modelo. Cada estudante escreve-o uma vez, ao seu ritmo; vários exercícios vêm um a seguir ao outro.",
    mkWochenzielName: "Objetivo semanal",
    mkWochenziel:
      "Quantos minutos por semana se deve praticar - para cada pessoa ou para todas de uma vez. A semana começa à segunda-feira, às 08:00.",
    mkEinstellungenName: "Definições da turma",
    mkEinstellungen:
      "Ano de escolaridade, língua, ponto de partida e Corrida da turma - para todos os estudantes da turma de uma vez.",
    mkSperrenName: "Suspender o objetivo durante 1 hora",
    mkSperren:
      "Durante 60 minutos, a prática da turma toda não conta para o objetivo semanal, mas continua a contar para o tempo de prática - útil durante as aulas. O mesmo botão retoma o objetivo.",
    mkUeberblickName: "A visão geral da turma",
    mkUeberblick:
      "A turma toda de relance, para o \"Mês\" (as últimas 4 semanas) ou o \"Ano letivo\": uma barra de pontuação e um gráfico de linhas da pontuação. Aqui também: \"Mensagem para a turma\".",
    mkZeitraumName: "O período",
    mkZeitraum:
      "Semana, Mês, Ano letivo ou Desde o início - Alt + seta para a esquerda ou para a direita recua e avança. \"Transferir em Excel\" inclui os quatro períodos.",
    mkTabelleName: "A tabela",
    mkTabelle:
      "Uma pessoa por linha. O título de uma coluna ordena por essa coluna; uma dica explica cada coluna assim que passa para ela.",
    mkKindName: "A linha de uma pessoa",
    mkKind:
      "Expande-se: as definições da pessoa, Desafios, tempos de prática por semana, teclas em consolidação e medalhas.",
    mkWerkzeugeName: "O cabeçalho",
    mkWerkzeuge:
      "Com \"Praticar\" (Alt + U) vai para a sua própria prática. A ajuda (Alt + H) explica tudo em pormenor - aí encontra também esta visita guiada.",

    kuzKlassenName: "Turmas",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Crie aqui uma turma: nome, ano de escolaridade e código da turma. Os estudantes iniciam sessão com o código da turma - em todas as aplicações."
        : "Crie aqui a sua primeira turma: nome, ano de escolaridade e código da turma. Depois adicione os estudantes mais abaixo - um a um ou a partir de um ficheiro Excel - e veja os dados de acesso.",
    kuzKlasseName: "A turma",
    kuzKlasse: "O código da turma, as aplicações da turma, mais docentes e o resumo semanal por e-mail.",
    kuzLernendeName: "Estudantes",
    kuzLernende:
      "Adicione estudantes com um nome e uma palavra-passe. Para cada pessoa: alterar a palavra-passe, e-mail de contacto, mover para outra turma. \"Imprimir dados de acesso\" dá uma lista para distribuir.",
    kuzExcelName: "Muitos de uma vez (Excel)",
    kuzExcel:
      "\"Transferir modelo (Excel)\", preencha uma linha por pessoa e depois \"Importar estudantes do Excel\" - vê uma pré-visualização antes de ser criado o que quer que seja.",
    kuzZurueckName: "De volta aos progressos",
    kuzZurueck: "Use \"Progressos\" no topo. Encontra esta visita guiada na ajuda (Alt + H).",
  },
  br: {
    name: "Visita guiada",
    zaehler: (nr: number, von: number) => `Visita guiada: passo ${nr} de ${von}`,
    weiter: "Avançar",
    fertig: "Concluir",
    ueberspringen: "Pular",
    geschafft: "Visita concluída.",
    nochmalUeben: "Ver a visita guiada de novo",
    durchUebungsseite: "Visita guiada pela página de prática",
    durchMeineKlassen: "Visita guiada por Minhas turmas",
    durchDieSeite: "Visita guiada pela página",
    nochmalTipp: "Mostra de novo, passo a passo, as partes da página de prática.",
    meineKlassenTipp: "Mostra, passo a passo, as partes de Minhas turmas.",

    uebenZeileName: (_ton: RundgangTon) => "O campo de digitação",
    uebenZeile: (ton: RundgangTon) =>
      ton === "kind"
        ? "Aqui você digita o texto que está escrito. É só começar - a primeira letra aparece bem aqui."
        : "Aqui você digita o texto - é só começar. Com Alt + E você volta para cá a qualquer momento.",
    uebenStandName: (_ton: RundgangTon) => "Seu progresso",
    uebenStand: (_ton: RundgangTon, wer: RundgangWer) =>
      wer === "klassenkind"
        ? "Acima do campo de digitação: seu nível, seu tempo de prática de hoje, sua meta semanal e a próxima tecla nova. Jogar abre um jogo; Competição da turma (Alt + M) é uma corrida de digitação com a sua turma."
        : "Acima do campo de digitação: seu nível, seu tempo de prática de hoje e a próxima tecla nova. Jogar abre um jogo.",
    uebenTastaturName: (_ton: RundgangTon) => "O teclado na tela",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Ele mostra qual tecla vem agora. O botão acima dele esconde o teclado e mostra de novo."
        : "Ele mostra qual tecla vem agora. O botão acima dele esconde o teclado e mostra de novo.",
    uebenArtName: (_ton: RundgangTon) => "Os tipos de prática",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Você pode praticar de três jeitos: Meu treino, Histórias e Jogos de palavras. Com Alt + B você passa para o próximo."
        : "São três opções: Meu treino, Histórias e Jogos de palavras. Alt + B passa para a próxima.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "As ferramentas",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "No cabeçalho: Ajuda (Alt + H), todos os atalhos de teclado (Alt + T), Configurações (Alt + O), cores e contraste (Alt + K) e leitura em voz alta (Alt + V)."
        : "No cabeçalho: Ajuda (Alt + H), Configurações (Alt + O), cores (Alt + K) e leitura em voz alta (Alt + V). Alt + T mostra todos os atalhos de teclado.",
    uebenKontoName: (_ton: RundgangTon) => "Sua conta",
    uebenKonto: (_ton: RundgangTon, wer: RundgangWer) =>
      wer === "lehrkraft"
        ? "Aqui (Alt + J) ficam suas mensagens, Alterar senha e Sair. Minhas turmas (Alt + S) leva você de volta às suas turmas."
        : wer === "gast"
          ? "Entre por aqui (Alt + J). Assim o seu progresso fica salvo e você vê Meu progresso."
          : "Aqui (Alt + J) ficam Meu progresso (Alt + S) com as suas medalhas, as suas mensagens e Alterar senha.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Vamos lá!" : "Vamos lá"),
    uebenEnde: (_ton: RundgangTon) =>
      "Você encontra esta visita guiada de novo, a qualquer momento, na Ajuda (Alt + H). Agora é só começar a digitar.",

    mkKopfName: "O cabeçalho da turma",
    mkKopf:
      "O nome da turma, o número de estudantes e o código da turma. Se houver várias turmas, é aqui que você troca de uma para outra. Em Downloads ficam os guias para docentes e o cartaz para afixar.",
    mkBereichName: "Progresso | Estudantes e acessos",
    mkBereich:
      "Agora você está vendo o progresso. Em Estudantes e acessos você cria turmas e adiciona estudantes, vê as senhas e importa estudantes do Excel.",
    mkTippchallengeName: "Desafio",
    mkTippchallenge:
      "Um desafio para a turma toda: você define o texto e o tempo, e depois os resultados aparecem aqui.",
    mkEigeneUebungName: "Exercício personalizado",
    mkEigeneUebung:
      "Um texto para a turma toda - de um arquivo, de Meus textos ou de um modelo. Cada estudante digita uma vez, no seu próprio ritmo; vários exercícios vêm um depois do outro.",
    mkWochenzielName: "Meta semanal",
    mkWochenziel:
      "Quantos minutos por semana as pessoas devem praticar - para cada estudante ou para todos de uma vez. A semana começa na segunda-feira, às 8h.",
    mkEinstellungenName: "Configurações da turma",
    mkEinstellungen:
      "Ano escolar, idioma, ponto de partida e Competição da turma - para todos os estudantes da turma de uma vez.",
    mkSperrenName: "Pausar a meta por 1 hora",
    mkSperren:
      "Por 60 minutos, a prática da turma toda não conta para a meta semanal, mas continua contando no tempo de prática - útil durante a aula. O mesmo botão encerra a pausa.",
    mkUeberblickName: "A visão geral da turma",
    mkUeberblick:
      "A turma toda de relance, para o Mês (as últimas 4 semanas) ou o Ano letivo: uma barra de pontuação e um gráfico de linhas da pontuação. Aqui também fica Mensagem para a turma.",
    mkZeitraumName: "O período",
    mkZeitraum:
      "Semana, Mês, Ano letivo ou Desde o início - Alt + seta para a esquerda ou para a direita volta e avança. Baixar em Excel inclui os quatro períodos.",
    mkTabelleName: "A tabela",
    mkTabelle:
      "Uma pessoa por linha. O título de uma coluna ordena por essa coluna; uma dica explica cada coluna assim que você chega nela.",
    mkKindName: "A linha de uma pessoa",
    mkKind:
      "Ela se expande: as configurações da pessoa, Desafios, tempos de prática por semana, teclas inseguras e medalhas.",
    mkWerkzeugeName: "O cabeçalho",
    mkWerkzeuge:
      "Praticar (Alt + U) leva você à sua própria prática. A Ajuda (Alt + H) explica tudo em detalhes - e é lá que você encontra esta visita guiada de novo.",

    kuzKlassenName: "Turmas",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Crie uma turma aqui: nome, ano escolar e código da turma. Os estudantes entram com o código da turma - em todos os aplicativos."
        : "Crie aqui a sua primeira turma: nome, ano escolar e código da turma. Depois adicione os estudantes logo abaixo - um por um ou de um arquivo Excel - e veja os dados de acesso deles.",
    kuzKlasseName: "A turma",
    kuzKlasse: "O código da turma, os aplicativos da turma, outras pessoas docentes e o relatório semanal por e-mail.",
    kuzLernendeName: "Estudantes",
    kuzLernende:
      "Adicione estudantes com um nome e uma senha. Para cada pessoa: alterar a senha, e-mail de contato, mover para outra turma. Imprimir dados de acesso gera uma lista para distribuir.",
    kuzExcelName: "Vários de uma vez (Excel)",
    kuzExcel:
      "Baixe o modelo (Excel), preencha uma linha por pessoa e depois escolha Importar estudantes do Excel - você vê uma prévia antes de qualquer conta ser criada.",
    kuzZurueckName: "De volta ao progresso",
    kuzZurueck: "Use Progresso, no alto. Você encontra esta visita guiada na Ajuda (Alt + H).",
  },
  ro: {
    name: "Tur ghidat",
    zaehler: (nr: number, von: number) => `Pasul ${nr} din ${von}`,
    weiter: "Mai departe",
    fertig: "Gata",
    ueberspringen: "Omiteți",
    geschafft: "Turul ghidat s-a încheiat.",
    nochmalUeben: "Reluați turul ghidat",
    durchUebungsseite: "Tur ghidat al paginii de exersare",
    durchMeineKlassen: "Tur ghidat prin Clasele mele",
    durchDieSeite: "Tur ghidat al paginii",
    nochmalTipp: "Arată din nou, pas cu pas, părțile paginii de exersare.",
    meineKlassenTipp: "Arată pas cu pas părțile secțiunii Clasele mele.",

    uebenZeileName: (_ton: RundgangTon) => "Câmpul de scriere",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Aici scrii textul care apare. Începe pur și simplu - prima literă ajunge chiar aici."
        : sie(ton, anrede)
          ? "Aici scrieți textul - începeți pur și simplu. Cu Alt + E reveniți aici oricând."
          : "Aici scrii textul - începe pur și simplu. Cu Alt + E revii aici oricând.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Starea curentă" : "Starea ta"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? "Deasupra câmpului de scriere: nivelul, timpul de exersare de azi, obiectivul săptămânal și următoarea tastă nouă. Jucați pornește un joc, Întrecerea clasei (Alt + M) o întrecere de scris cu toată clasa."
          : "Deasupra câmpului de scriere: nivelul, timpul de exersare de azi și următoarea tastă nouă. Jucați pornește un joc."
        : wer === "klassenkind"
          ? "Deasupra câmpului de scriere: nivelul tău, timpul tău de exersare de azi, obiectivul tău săptămânal și următoarea tastă nouă. Jucați pornește un joc, Întrecerea clasei (Alt + M) o întrecere de scris cu clasa ta."
          : "Deasupra câmpului de scriere: nivelul tău, timpul tău de exersare de azi și următoarea tastă nouă. Jucați pornește un joc.",
    uebenTastaturName: (_ton: RundgangTon) => "Tastatura de pe ecran",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Îți arată ce tastă urmează. Cu butonul de deasupra o ascunzi și o aduci înapoi."
        : "Arată ce tastă urmează. Butonul de deasupra o ascunde și o aduce înapoi.",
    uebenArtName: (_ton: RundgangTon) => "Tipurile de exercițiu",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Poți exersa în trei feluri: Antrenamentul meu, Povești și Jocuri cu cuvinte. Cu Alt + B treci la următorul."
        : "Sunt trei la alegere: Antrenamentul meu, Povești și Jocuri cu cuvinte. Alt + B trece la următorul.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "Instrumentele",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "În antet: Ajutor (Alt + H), toate comenzile rapide de la tastatură (Alt + T), Setări (Alt + O), Culori și contrast (Alt + K) și Citire cu voce tare (Alt + V)."
        : ton === "kind"
          ? "În antet: Ajutor (Alt + H), Setări (Alt + O), Culori (Alt + K) și Citire cu voce tare (Alt + V). Toate comenzile rapide de la tastatură ți le arată Alt + T."
          : "În antet: Ajutor (Alt + H), Setări (Alt + O), Culori (Alt + K) și Citire cu voce tare (Alt + V). Toate comenzile rapide de la tastatură le arată Alt + T.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Contul" : "Contul tău"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? "Aici (Alt + J) găsiți mesajele, Schimbați parola și Deconectați-vă. Clasele mele (Alt + S) vă duce înapoi la clase."
        : wer === "gast"
          ? sie(ton, anrede)
            ? "Aici vă conectați (Alt + J). Apoi progresul se salvează și vedeți pagina Progresul meu."
            : "Aici te conectezi (Alt + J). Apoi progresul tău se salvează și vezi pagina Progresul meu."
          : sie(ton, anrede)
            ? "Aici (Alt + J) găsiți Progresul meu (Alt + S), mesajele și Schimbați parola."
            : ton === "erwachsen"
              ? "Aici (Alt + J) găsești Progresul meu (Alt + S), mesajele și Schimbați parola."
              : "Aici (Alt + J) găsești Progresul meu (Alt + S) cu medaliile tale, mesajele și Schimbați parola.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Să începem!" : "Să începem"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Acest tur ghidat îl regăsiți oricând în Ajutor (Alt + H). Acum începeți să scrieți."
        : "Acest tur ghidat îl regăsești oricând în Ajutor (Alt + H). Acum începe pur și simplu să scrii.",

    mkKopfName: "Antetul clasei",
    mkKopf:
      "Numele clasei, numărul de elevi și codul clasei. Dacă aveți mai multe clase, comutați între ele aici. La Descărcări găsiți ghidurile pentru cadre didactice și afișul de pus pe perete.",
    mkBereichName: "Progres | Elevi și conturi",
    mkBereich:
      "Acum vedeți progresul. La Elevi și conturi creați clase și adăugați persoane, vedeți parolele și adăugați elevi dintr-un fișier Excel.",
    mkTippchallengeName: "Provocare",
    mkTippchallenge:
      "O provocare pentru toată clasa: stabiliți textul și durata, iar rezultatele apar aici după aceea.",
    mkEigeneUebungName: "Exercițiu propriu",
    mkEigeneUebung:
      "Un singur text pentru toată clasa - dintr-un fișier, din Textele mele sau dintr-un șablon. Fiecare persoană îl scrie o dată, în ritmul ei; mai multe exerciții vin unul după altul.",
    mkWochenzielName: "Obiectiv săptămânal",
    mkWochenziel:
      "Câte minute pe săptămână ar trebui să exerseze elevii - pentru fiecare în parte sau pentru toți deodată. Săptămâna începe luni la ora 8:00.",
    mkEinstellungenName: "Setările clasei",
    mkEinstellungen:
      "Anul de studiu, limba, punctul de plecare și Întrecerea clasei - pentru toți elevii clasei deodată.",
    mkSperrenName: "Suspendați obiectivul pentru o oră",
    mkSperren:
      "Timp de 60 de minute, exersarea întregii clase nu se numără la obiectivul săptămânal, dar se numără la timpul de exersare - util în timpul orei. Același buton încheie suspendarea.",
    mkUeberblickName: "Prezentarea clasei",
    mkUeberblick:
      "Toată clasa dintr-o privire, pentru Lună (ultimele 4 săptămâni) sau An școlar: bara scorului și un grafic liniar al scorului. Tot aici: Mesaj pentru clasă.",
    mkZeitraumName: "Perioada",
    mkZeitraum:
      "Săptămână, Lună, An școlar sau De la început - Alt + săgeată la stânga sau la dreapta se mută înapoi și înainte. Descărcați în format Excel cuprinde toate cele patru perioade.",
    mkTabelleName: "Tabelul",
    mkTabelle:
      "O persoană pe rând. Antetul unei coloane sortează după coloana respectivă; un sfat explică fiecare coloană de îndată ce ajungeți la ea.",
    mkKindName: "Rândul unei persoane",
    mkKind:
      "Se deschide: setările persoanei, Provocările, timpii de exersare pe săptămâni, tastele nesigure și medaliile.",
    mkWerkzeugeName: "Antetul paginii",
    mkWerkzeuge:
      "Exersați (Alt + U) vă duce la propria exersare. Ajutorul (Alt + H) explică totul în detaliu - acolo găsiți din nou și acest tur ghidat.",

    kuzKlassenName: "Clasele",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Creați aici o clasă: nume, an de studiu și codul clasei. Elevii se conectează cu codul clasei - în fiecare aplicație."
        : "Creați aici prima clasă: nume, an de studiu și codul clasei. Apoi adăugați mai jos elevii - unul câte unul sau dintr-un fișier Excel - și vedeți datele lor de conectare.",
    kuzKlasseName: "Clasa",
    kuzKlasse: "Codul clasei, aplicațiile clasei, alte cadre didactice și raportul săptămânal prin e-mail.",
    kuzLernendeName: "Elevii",
    kuzLernende:
      "Adăugați persoane cu un nume și o parolă. Pentru fiecare: schimbați parola, adresa de e-mail de contact, mutați în altă clasă. Imprimați datele de conectare vă dă o listă de împărțit.",
    kuzExcelName: "Mai mulți deodată (Excel)",
    kuzExcel:
      "Descărcați șablonul (Excel), completați câte un rând pentru fiecare persoană, apoi alegeți Adăugați elevi dintr-un fișier Excel - vedeți o previzualizare înainte să se creeze ceva.",
    kuzZurueckName: "Înapoi la progres",
    kuzZurueck: "Sus, cu Progres. Acest tur ghidat îl găsiți în Ajutor (Alt + H).",
  },
  sv: {
    name: "Rundtur",
    zaehler: (nr: number, von: number) => `Rundtur: steg ${nr}/${von}`,
    weiter: "Nästa",
    fertig: "Klar",
    ueberspringen: "Hoppa över",
    geschafft: "Rundturen är klar.",
    nochmalUeben: "Gör rundturen igen",
    durchUebungsseite: "Rundtur på övningssidan",
    durchMeineKlassen: "Rundtur i Mina klasser",
    durchDieSeite: "Rundtur på sidan",
    nochmalTipp: "Visar delarna av övningssidan igen, steg för steg.",
    meineKlassenTipp: "Visar delarna av Mina klasser steg för steg.",

    uebenZeileName: (_ton: RundgangTon) => "Skrivfältet",
    uebenZeile: (ton: RundgangTon) =>
      ton === "kind"
        ? "Här skriver du av texten. Börja bara skriva - den första bokstaven hamnar just här."
        : "Här skriver du av texten - börja bara skriva. Med Alt + E kommer du tillbaka hit när som helst.",
    uebenStandName: (_ton: RundgangTon) => "Dina framsteg",
    uebenStand: (_ton: RundgangTon, wer: RundgangWer) =>
      wer === "klassenkind"
        ? "Ovanför skrivfältet: din nivå, din övningstid i dag, ditt veckomål och nästa nya tangent. Knappen Spela startar ett spel, knappen Klasstävlingen (Alt + M) en skrivtävling med din klass."
        : "Ovanför skrivfältet: din nivå, din övningstid i dag och nästa nya tangent. Knappen Spela startar ett spel.",
    uebenTastaturName: (_ton: RundgangTon) => "Skärmtangentbordet",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Det visar vilken tangent som kommer härnäst. Knappen ovanför det döljer det och visar det igen."
        : "Det visar vilken tangent som kommer härnäst. Knappen ovanför det döljer det och visar det igen.",
    uebenArtName: (_ton: RundgangTon) => "Övningsformerna",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Du kan öva på tre sätt: Min träning, Berättelser och Ordlekar. Med Alt + B kommer du till nästa."
        : "Det finns tre att välja mellan: Min träning, Berättelser och Ordlekar. Alt + B växlar till nästa.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "Verktygen",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "I sidhuvudet: Hjälp (Alt + H), alla kortkommandon (Alt + T), Inställningar (Alt + O), färger och kontrast (Alt + K) och uppläsning (Alt + V)."
        : "I sidhuvudet: Hjälp (Alt + H), Inställningar (Alt + O), färger (Alt + K) och uppläsning (Alt + V). Alt + T visar alla kortkommandon.",
    uebenKontoName: (_ton: RundgangTon) => "Ditt konto",
    uebenKonto: (_ton: RundgangTon, wer: RundgangWer) =>
      wer === "lehrkraft"
        ? "Här (Alt + J) hittar du dina meddelanden, Byt lösenord och Logga ut. Mina klasser (Alt + S) tar dig tillbaka till dina klasser."
        : wer === "gast"
          ? "Logga in här (Alt + J). Då sparas dina framsteg, och du kan se Mina framsteg."
          : "Här (Alt + J) hittar du Mina framsteg (Alt + S) med dina märken, dina meddelanden och Byt lösenord.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Nu kör vi!" : "Nu kör vi"),
    uebenEnde: (_ton: RundgangTon) =>
      "Den här rundturen hittar du när som helst i Hjälp (Alt + H). Nu är det bara att börja skriva.",

    mkKopfName: "Klassens sidhuvud",
    mkKopf:
      "Klassens namn, antalet elever och klasskoden. Har du flera klasser växlar du mellan dem här. Under Att ladda ned finns handböckerna för lärare och affischen att hänga upp.",
    mkBereichName: "Framsteg | Elever och inloggningar",
    mkBereich:
      "Nu ser du Framsteg. Under Elever och inloggningar skapar du klasser och lägger till elever, ser lösenord och lägger till elever från Excel.",
    mkTippchallengeName: "Utmaningen",
    mkTippchallenge:
      "En utmaning för hela klassen: du bestämmer text och tid, och resultaten visas sedan här.",
    mkEigeneUebungName: "Egna övningar",
    mkEigeneUebung:
      "En text för hela klassen - från en fil, från Mina texter eller från en mall. Varje elev skriver den en gång i sin egen takt; flera övningar kommer efter varandra.",
    mkWochenzielName: "Veckomål",
    mkWochenziel:
      "Hur många minuter per vecka eleverna ska öva - för varje elev eller för alla på en gång. Veckan börjar på måndag klockan 08:00.",
    mkEinstellungenName: "Klassens inställningar",
    mkEinstellungen:
      "Årskurs, språk, startpunkt och Klasstävlingen - för alla elever i klassen på en gång.",
    mkSperrenName: "Pausa målet i en timme",
    mkSperren:
      "I 60 minuter räknas klassens övning inte mot veckomålet, men den räknas ändå som övningstid - praktiskt under lektionstid. Samma knapp avslutar pausen.",
    mkUeberblickName: "Klassöversikten",
    mkUeberblick:
      "Hela klassen på en gång, för Månad (de senaste 4 veckorna) eller Läsår: en poängstapel och ett linjediagram över poängen. Här finns också Meddelande till klassen.",
    mkZeitraumName: "Tidsperioden",
    mkZeitraum:
      "Vecka, Månad, Läsår eller Från början - Alt + Vänsterpil eller Högerpil bläddrar bakåt och framåt. Ladda ned som Excel-fil tar med alla fyra perioderna.",
    mkTabelleName: "Tabellen",
    mkTabelle:
      "En elev per tabellrad. En kolumnrubrik sorterar efter kolumnen; ett tips förklarar varje kolumn så fort du kommer till den.",
    mkKindName: "En elevs rad",
    mkKind:
      "Den fälls ut: elevens inställningar, Utmaningar, övningstid per vecka, osäkra tangenter och märken.",
    mkWerkzeugeName: "Sidhuvudet",
    mkWerkzeuge:
      "Öva själv (Alt + U) tar dig till din egen övning. Hjälp (Alt + H) förklarar allt i detalj - där hittar du också den här rundturen.",

    kuzKlassenName: "Klasser",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Skapa en klass här: namn, årskurs och klasskod. Eleverna loggar in med klasskoden - i alla program."
        : "Skapa din första klass här: namn, årskurs och klasskod. Lägg sedan till eleverna nedanför - en och en eller från en Excel-fil - och se deras inloggningsuppgifter.",
    kuzKlasseName: "Klassen",
    kuzKlasse: "Klasskoden, klassens program, fler lärare och veckorapporten med e-post.",
    kuzLernendeName: "Elever",
    kuzLernende:
      "Lägg till elever med namn och lösenord. För varje elev: byt lösenord, kontakt-e-post, flytta till en annan klass. Skriv ut inloggningsuppgifter ger dig en lista att dela ut.",
    kuzExcelName: "Många på en gång (Excel)",
    kuzExcel:
      "Ladda ned mall (Excel), fyll i en rad per elev och välj sedan Lägg till elever från en Excel-fil - du ser en förhandsgranskning innan något skapas.",
    kuzZurueckName: "Tillbaka till framstegen",
    kuzZurueck: "Använd Framsteg högst upp. Rundturen finns i Hjälp (Alt + H).",
  },
  uk: {
    name: "Екскурсія",
    zaehler: (nr: number, von: number) => `Екскурсія: крок ${nr}/${von}`,
    weiter: "Далі",
    fertig: "Готово",
    ueberspringen: "Пропустити",
    geschafft: "Екскурсію завершено.",
    nochmalUeben: "Пройти екскурсію ще раз",
    durchUebungsseite: "Екскурсія сторінкою вправ",
    durchMeineKlassen: "Екскурсія розділом Мої класи",
    durchDieSeite: "Екскурсія сторінкою",
    nochmalTipp: "Ще раз покаже крок за кроком частини сторінки вправ.",
    meineKlassenTipp: "Покаже крок за кроком частини розділу Мої класи.",

    uebenZeileName: (_ton: RundgangTon) => "Поле для друку",
    uebenZeile: (ton: RundgangTon, anrede: Anrede) =>
      ton === "kind"
        ? "Тут ти передруковуєш те, що написано. Просто починай - перша літера опиниться саме тут."
        : sie(ton, anrede)
          ? "Тут ви передруковуєте текст - досить почати друкувати. Сполучення клавіш Alt + E у будь-який момент поверне вас сюди."
          : "Тут ти передруковуєш текст - просто починай друкувати. Сполучення клавіш Alt + E у будь-який момент поверне тебе сюди.",
    uebenStandName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Ваш стан" : "Твій стан"),
    uebenStand: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      sie(ton, anrede)
        ? wer === "klassenkind"
          ? "Над полем для друку: ваш рівень, сьогоднішній час тренування, тижнева мета і наступна нова клавіша. Кнопка Грати запускає гру, кнопка Перегони класу (Alt + M) - перегони з друку з усім класом."
          : "Над полем для друку: ваш рівень, сьогоднішній час тренування і наступна нова клавіша. Кнопка Грати запускає гру."
        : wer === "klassenkind"
          ? "Над полем для друку: твій рівень, твій сьогоднішній час тренування, твоя тижнева мета і наступна нова клавіша. Кнопка Грати запускає гру, кнопка Перегони класу (Alt + M) - перегони з друку з твоїм класом."
          : "Над полем для друку: твій рівень, твій сьогоднішній час тренування і наступна нова клавіша. Кнопка Грати запускає гру.",
    uebenTastaturName: (_ton: RundgangTon) => "Екранна клавіатура",
    uebenTastatur: (ton: RundgangTon) =>
      ton === "kind"
        ? "Показує тобі, яка клавіша наступна. Кнопка над нею ховає клавіатуру й знову показує."
        : "Показує, яка клавіша наступна. Кнопка над нею ховає клавіатуру й знову показує.",
    uebenArtName: (_ton: RundgangTon) => "Види вправ",
    uebenArt: (ton: RundgangTon) =>
      ton === "kind"
        ? "Тренуватися можна трьома способами: Моє тренування, Історії та Ігри зі словами. Alt + B перемикає на наступний."
        : "На вибір три: Моє тренування, Історії та Ігри зі словами. Alt + B перемикає на наступний.",
    uebenWerkzeugeName: (_ton: RundgangTon) => "Інструменти",
    uebenWerkzeuge: (ton: RundgangTon) =>
      ton === "erwachsen"
        ? "Угорі: Довідка (Alt + H), усі сполучення клавіш (Alt + T), Налаштування (Alt + O), Кольори й контраст (Alt + K) і Читання вголос (Alt + V)."
        : ton === "kind"
          ? "Угорі: Довідка (Alt + H), Налаштування (Alt + O), Кольори (Alt + K) і Читання вголос (Alt + V). Усі сполучення клавіш покаже Alt + T."
          : "Угорі: Довідка (Alt + H), Налаштування (Alt + O), Кольори (Alt + K) і Читання вголос (Alt + V). Усі сполучення клавіш покаже Alt + T.",
    uebenKontoName: (ton: RundgangTon, anrede: Anrede) => (sie(ton, anrede) ? "Ваш обліковий запис" : "Твій обліковий запис"),
    uebenKonto: (ton: RundgangTon, wer: RundgangWer, anrede: Anrede) =>
      wer === "lehrkraft"
        ? "Тут (Alt + J) ви знайдете свої повідомлення, пункти Змінити пароль і Вийти. Розділ Мої класи (Alt + S) повертає вас до ваших класів."
        : wer === "gast"
          ? sie(ton, anrede)
            ? "Тут ви входите (Alt + J). Тоді ваш поступ зберігається, і ви бачите сторінку Мій поступ."
            : "Тут ти входиш (Alt + J). Тоді твій поступ зберігається, і ти бачиш сторінку Мій поступ."
          : sie(ton, anrede)
            ? "Тут (Alt + J) ви знайдете сторінку Мій поступ (Alt + S), свої повідомлення і пункт Змінити пароль."
            : ton === "erwachsen"
              ? "Тут (Alt + J) ти знайдеш сторінку Мій поступ (Alt + S), свої повідомлення і пункт Змінити пароль."
              : "Тут (Alt + J) ти знайдеш сторінку Мій поступ (Alt + S) зі своїми медалями, свої повідомлення і пункт Змінити пароль.",
    uebenEndeName: (ton: RundgangTon) => (ton === "kind" ? "Почнімо!" : "Почнімо"),
    uebenEnde: (ton: RundgangTon, anrede: Anrede) =>
      sie(ton, anrede)
        ? "Цю екскурсію ви в будь-який час знову знайдете в Довідці (Alt + H). Тепер досить почати друкувати."
        : "Цю екскурсію ти в будь-який час знову знайдеш у Довідці (Alt + H). Тепер просто починай друкувати.",

    mkKopfName: "Заголовок класу",
    mkKopf:
      "Назва класу, кількість учнів і код класу. Якщо у вас кілька класів, перемикайтеся між ними тут. У розділі Завантаження є посібники для педагогів і плакат, який можна повісити на стіну.",
    mkBereichName: "Поступ | Учні й доступи",
    mkBereich:
      "Зараз ви бачите поступ. У розділі Учні й доступи ви створюєте класи й облікові записи учнів, бачите паролі та імпортуєте учнів з Excel.",
    mkTippchallengeName: "Виклик",
    mkTippchallenge:
      "Виклик для всього класу: текст і час задаєте ви, а результати потім з'являються тут.",
    mkEigeneUebungName: "Власна вправа",
    mkEigeneUebung:
      "Один текст для всього класу - з файлу, з розділу Мої тексти або із шаблону. Кожна дитина друкує його один раз у своєму темпі; кілька вправ ідуть одна за одною.",
    mkWochenzielName: "Тижнева мета",
    mkWochenziel:
      "Скільки хвилин на тиждень мають тренуватися учні - для кожної дитини окремо або для всіх одразу. Тиждень починається в понеділок о 8:00 ранку.",
    mkEinstellungenName: "Налаштування класу",
    mkEinstellungen:
      "Рік навчання, мова, точка старту і Перегони класу - для всіх учнів класу одразу.",
    mkSperrenName: "Пауза на 1 годину",
    mkSperren:
      "Протягом 60 хвилин тренування всього класу не зараховується до тижневої мети, але зараховується до часу тренування - це зручно під час шкільного уроку. Та сама кнопка знімає паузу.",
    mkUeberblickName: "Огляд класу",
    mkUeberblick:
      "Увесь клас коротко за Місяць (останні 4 тижні) або за Навчальний рік: шкала балів і лінійний графік балів. Тут також є Повідомлення класу.",
    mkZeitraumName: "Період",
    mkZeitraum:
      "Тиждень, Місяць, Навчальний рік або Від початку - Alt + стрілка вліво чи вправо перемикає період. Кнопка Завантажити в Excel бере всі чотири періоди.",
    mkTabelleName: "Таблиця",
    mkTabelle:
      "Один рядок - одна дитина. Заголовок стовпця сортує таблицю за цим стовпцем; що означає стовпець, пояснює підказка, щойно ви переходите на нього.",
    mkKindName: "Рядок однієї дитини",
    mkKind:
      "Він розгортається: налаштування дитини, Виклики, час тренування по тижнях, непевні клавіші та медалі.",
    mkWerkzeugeName: "Верхній рядок",
    mkWerkzeuge:
      "Кнопка Тренуватися (Alt + U) веде до вашого власного тренування. Довідка (Alt + H) докладно все пояснює - там ви знову знайдете й цю екскурсію.",

    kuzKlassenName: "Класи",
    kuzKlassen: (hatKlasse: boolean) =>
      hatKlasse
        ? "Тут ви створюєте клас: назву, рік навчання й код класу. За кодом класу учні входять - у кожній програмі."
        : "Тут ви створюєте свій перший клас: назву, рік навчання й код класу. Потім нижче додаєте учнів - по одному або з файлу Excel - і бачите їхні дані для входу.",
    kuzKlasseName: "Клас",
    kuzKlasse: "Код класу, програми класу, інші педагоги й тижневий звіт електронною поштою.",
    kuzLernendeName: "Учні",
    kuzLernende:
      "Учнів додаєте з іменем і паролем. Для кожної дитини: змінити пароль, контактна адреса електронної пошти, перемістити до іншого класу. Кнопка Друкувати дані для входу дає список, який можна роздати.",
    kuzExcelName: "Багато учнів одразу (Excel)",
    kuzExcel:
      "Завантажте шаблон (Excel), заповніть по одному рядку на дитину, а потім виберіть Імпортувати учнів з Excel - перед створенням облікових записів ви побачите попередній перегляд.",
    kuzZurueckName: "Назад до поступу",
    kuzZurueck: "Угорі виберіть Поступ. Цю екскурсію ви знайдете в Довідці (Alt + H).",
  },
});
