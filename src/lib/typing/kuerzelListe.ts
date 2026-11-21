/**
 * ★★ DIE KÜRZEL-LISTE VON TASTENFLOW (Alt + T) - EINE Quelle für die Liste im
 * Programm UND die Tabelle „Alle Tastenkürzel" in den Handbüchern
 * (18.10.2026, Johannes: „ergänze das in die handbücher").
 *
 * Gemessen an diesem Tag: Das Handbuch führte eine eigene, abgeschriebene
 * Tabelle (`KUERZEL` in `scripts/erzeuge-tastenflow-handbuch.mts` und je
 * Sprache in `scripts/tastenflow-handbuch-<sprache>.mts`). Ihr fehlten
 * Alt + J, Alt + M, Alt + 0 und das Melden (Alt + Umschalt + P) - in jeder der
 * acht Sprachen; Alt + D hiess dort noch „Übezeit ansagen", Alt + X kannte
 * das Klassenmatch nicht. Seither lesen Liste und Handbuch DIESE Zeilen
 * (`kuerzelZeilen`), und `tests/tastenflow-handbuch-kuerzel.test.ts` prüft,
 * dass jedes Heft genau sie zeigt. Die Hilfe (Alt + H) nennt dieselben Tasten,
 * das bewacht `tests/tastenflow-kuerzel-einheitlich.test.tsx`.
 *
 * Bis 18.10.2026 standen die Zeilen in `SEITEN_TEXTE` (`TippenTrainerPage.tsx`);
 * sie sind Zeichen für Zeichen hierher gewandert, samt den Begründungen je Zeile.
 * Ein Skript (das Handbuch läuft in Node) kann die Seite nicht laden - diese
 * Datei schon.
 *
 * ⚠️ Am Mac zeigt die Liste „Wahl + O" (`altAnzeige` mit `WAHLTASTE`); hier steht
 * immer „Alt" - das Handbuch erklärt die Wahltaste in seiner Fußnote.
 */
import type { BedienSprache } from "../bedienSprache/sprache";
import { pruefungWort } from "./schreibprobe";
import { GEZIELT_KUERZEL } from "./gezieltKuerzel";

/** Eine Zeile: das Kürzel, wie es dasteht, und was es tut. */
export type KuerzelZeile = [string, string];

export interface KuerzelListeTexte {
  kurztastenVorher: KuerzelZeile[];
  /** Die Zeile zu Alt + L - mit dem Wort der Stufe („Übungsstufe", „Spielstufe" …). */
  stufeAnzeigen: (stufenWort: string) => string;
  kurztastenNachher: KuerzelZeile[];
  /** Unter der Liste (Windows und andere): „Alt + Taste. Auf dem Mac: …". */
  fussnote: string;
  /** Am Mac statt der Fußnote, nach `WAHLTASTE_SATZ`. */
  fussnoteFeld: string;
}

const DE: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Fenster schließen, und zurück ins Schreibfeld - dasselbe tut ein Klick auf das Wort „Tastenflow“ oben"],
    // ★ 18.10.2026 (Kürzel einheitlich): steht auch in der Hilfe - die Liste nennt jetzt jede Taste, die die Hilfe nennt.
    ["Umschalt Umschalt", "Zweimal kurz drücken: der richtige Finger wird angesagt"],
    ["Alt + O", "Einstellungen öffnen / schließen"],
    ["Alt + J", "Mein Konto öffnen / schließen - angemeldet das Konto-Menü, sonst die Anmeldung"],
    [
      "Alt + B",
      "Übungsart reihum: Mein Training - Geschichten - Wortspiele",
    ],
    ["Alt + H", "Hilfe öffnen / schließen"],
    ["Alt + E", "Ins Schreibfeld springen"],
    ["Alt + V", "Vorlesen an / aus"],
    ["Alt + 6", "Melodie beim Tippen an / aus: jede richtige Taste spielt den nächsten Ton (mit Vorlesen auf dem rechten Ohr)"],
    ["Alt + 7 / Alt + 8", "Klang der Melodie: Alt + 7 zurück, Alt + 8 vor (Monster, Katzen, Roboter …)"],
    // ★★★ 04.09.2026 (Johannes: „egal an welcher Stelle gelesen
    // wird, mit Strg muss es sofort leise werden"). Die einzige
    // Zeile dieser Liste, die KEIN Alt-Kürzel ist - und sie steht
    // bewusst hier: Es ist die Geste jedes Screenreaders, und wer
    // sie nicht kennt, sitzt jede Ansage ab. Derselbe Wortlaut im
    // Handbuch (`scripts/erzeuge-tastenflow-handbuch.mts`).
    ["Strg", "Sofort still: die laufende Ansage endet. Das Vorlesen bleibt an"],
    ["Alt + W", "Aktuelle Aufgabe erneut ansagen"],
    ["Alt + Z", '"Zeile X von Y" anzeigen'],
    ["Alt + D", "Übezeit und Wochenziel ansagen"],
    // ★ 18.10.2026: Alt + X wirkt nur in der Tippchallenge (`SchreibprobeLauf`) und im
    //   Klassenmatch (`KlassenmatchLauf`) - darum steht die Bedingung im Text.
    ["Alt + X", `Nur während einer ${pruefungWort("de")}: Restzeit ansagen - im Klassenmatch: Platz und Zeit`],
    ["Alt + P", "Nur im Klassenmatch: alle Plätze ansagen (wer ist auf welchem Platz)"],
    ["Alt + 2", GEZIELT_KUERZEL.de],
    ["Alt + 3", "Tasten erkunden: jede Taste wird angesagt (raus: noch einmal Alt + 3 oder zweimal Esc)"],
    ["Alt + 4", "Tasten finden: eine Taste wird genannt, du suchst sie (im Fenster: zwischen Erkunden und Finden wechseln)"],
    // ★ 25.09.2026: nur im Fenster „Tasten finden" - die Seite selbst hat kein Alt + 5.
    ["Alt + 5", "Nur in „Tasten finden\": zwischen „Meine Tasten\" und „Alle Tasten\" wechseln"],
    ["Alt + K", "Farben und Kontrast wählen"],
    ["Alt + G", "Zur nächsten Überschrift springen - mit Vorlesen wird sie angesagt (G wie Gliederung, im Kreis)"],
    ["Alt + R", "Einrichtung neu starten (Alter, Sprache, Tastatur, Ton)"],
    ["Alt + T", "Diese Liste öffnen / schließen"],
  ],
  // Dasselbe Wort wie Ring und Ansage - es heißt außerhalb des
  // Kinder-Profils „Übungsstufe" (30.07.).
  stufeAnzeigen: (stufenWort: string) => `${stufenWort} anzeigen`,
  kurztastenNachher: [
    // ★ 11.09.2026: Der Zusatz am Ende gehört dazu - Alt + M sagt
    //   jetzt auch, WARUM es gerade nicht geht (R-A3).
    ["Alt + M", "Klassenmatch ausschreiben: fünf Minuten um die Wette schreiben (nur in einer Klasse, wenn die Lehrkraft es erlaubt) - läuft schon eines, sagt es das"],
    ["Alt + N", "Nachrichten öffnen / schließen (wenn angemeldet)"],
    ["Alt + U", "Zum Üben wechseln (wenn angemeldet)"],
    // ★ „(wenn angemeldet)" wie bei Alt + N und Alt + U darüber
    // (Befund F20 des Vollaudits): Ohne Konto ist Alt + S still
    // und wirkungslos - die Liste versprach eine Taste, die
    // schweigt. Regel R-A3 („kein Kürzel tut stillschweigend
    // nichts"). Derselbe Zusatz steht im Handbuch,
    // `scripts/erzeuge-tastenflow-handbuch.mts` - wer ihn hier
    // ändert, ändert ihn dort mit, sonst lehren zwei Dokumente
    // Verschiedenes.
    ["Alt + S", "Statistik öffnen und wieder schließen (beim Üben) bzw. Bereich Meine Klassen (beim Unterrichten) (wenn angemeldet)"],
    ["Alt + +", "Tippfeld vergrößern"],
    ["Alt + -", "Tippfeld verkleinern"],
    // ★ 18.10.2026 (Kürzel einheitlich, `UNIVERSAL_SHORTCUTS`): Alt + 0 ist das Gegenstück
    //   zu Alt + Plus / Minus, Alt + Umschalt + P wirkt auf jeder Seite (Melden).
    ["Alt + 0", "Tippfeld wieder in normaler Größe"],
    ["Alt + Umschalt + P", "Fehler melden - mit einem Bild des Fensters"],
  ],
  fussnote: "Alt + Taste. Auf dem Mac: Wahltaste (⌥) + Taste. Funktioniert auch direkt im Schreibfeld.",
  // ★ 18.10.2026: am Mac steht statt der Fußnote `WAHLTASTE_SATZ` (lib/typing/wahltaste.ts)
  //   und dieser zweite Satz - die Liste schreibt dort schon „Wahl + …".
  fussnoteFeld: "Funktioniert auch direkt im Schreibfeld.",
};

const EN: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Close windows and go back to the typing field - the word “Tastenflow” at the top does the same"],
    ["Shift Shift", "Press twice quickly: the right finger is announced"],
    ["Alt + O", "Open / close settings"],
    ["Alt + J", "Open / close your account - the account menu when you are signed in, otherwise sign in"],
    // ★ EN1: „Lektionen" gibt es seit E7 (19.09.2026) nicht mehr - Alt + B
    //   wechselt Mein Training → Geschichten → Wortspiele
    //   (`naechsteTrainerMode`). Die deutsche Zeile nennt noch die alte
    //   Reihe; sie gehört nachgezogen (Bericht EN1), hier steht die richtige.
    ["Alt + B", "Switch between the practice types: My training - Stories - Word games"],
    ["Alt + H", "Open / close help"],
    ["Alt + E", "Jump to the typing field"],
    ["Alt + V", "Read aloud on / off"],
    ["Alt + 6", "Melody while typing on / off: every correct key plays the next note (with reading aloud: in the right ear)"],
    ["Alt + 7 / Alt + 8", "Melody sound: Alt + 7 back, Alt + 8 forward (monsters, cats, robots …)"],
    ["Ctrl", "Instant silence: the current announcement stops. Reading aloud stays on"],
    ["Alt + W", "Repeat the current task"],
    ["Alt + Z", "Show “Line X of Y”"],
    ["Alt + D", "Announce practice time and weekly goal"],
    ["Alt + X", `Only during a ${pruefungWort("en")}: announce the time left - in a Class Match: your place and the time`],
    ["Alt + P", "Only in a Class Match: announce every place (who is in which place)"],
    ["Alt + 2", GEZIELT_KUERZEL.en],
    ["Alt + 3", "Explore keys: every key is announced (to leave: Alt + 3 again or Esc twice)"],
    ["Alt + 4", "Find keys: a key is named and you look for it (inside the window: switch between exploring and finding)"],
    ["Alt + 5", "While finding keys: switch between \"My keys\" and \"All keys\""],
    ["Alt + K", "Choose colours and contrast"],
    ["Alt + G", "Jump to the next heading - announced when reading aloud is on (starts again at the top)"],
    ["Alt + R", "Start the setup again (age, language, keyboard, sound)"],
    ["Alt + T", "Open / close this list"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Show your ${stufenWort.toLowerCase()}`,
  kurztastenNachher: [
    ["Alt + M", "Start a Class Match: race each other at typing for five minutes (only in a class, if the teacher allows it) - if one is already running, it tells you"],
    ["Alt + N", "Open / close messages (when signed in)"],
    ["Alt + U", "Go to practice (when signed in)"],
    ["Alt + S", "Open or close statistics while practising, or go to My classes while teaching (when signed in)"],
    ["Alt + +", "Make the typing field bigger"],
    ["Alt + -", "Make the typing field smaller"],
    ["Alt + 0", "Typing field back to normal size"],
    ["Alt + Shift + P", "Report a problem - with a picture of the window"],
  ],
  fussnote: "Alt + key. On a Mac: Option (⌥) + key. Also works directly in the typing field.",
  fussnoteFeld: "Also works directly in the typing field.",
};

const FR: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Échap", 'Fermer les fenêtres et revenir au champ de saisie - le mot "Tastenflow" en haut fait la même chose'],
    ["Maj Maj", "Deux appuis rapides : le bon doigt est annoncé"],
    ["Alt + O", "Ouvrir / fermer les réglages"],
    ["Alt + J", "Ouvrir / fermer ton compte - le menu du compte après la connexion, sinon la page de connexion"],
    ["Alt + B", "Changer de type d'exercice : Mon entrainement - Histoires - Jeux de lettres"],
    ["Alt + H", "Ouvrir / fermer l'aide"],
    ["Alt + E", "Aller au champ de saisie"],
    ["Alt + V", "Lecture à voix haute activée / désactivée"],
    ["Alt + 6", "Mélodie en tapant activée / désactivée : chaque bonne touche joue la note suivante (avec la lecture à voix haute : dans l'oreille droite)"],
    ["Alt + 7 / Alt + 8", "Son de la mélodie : Alt + 7 en arrière, Alt + 8 en avant (monstres, chats, robots …)"],
    ["Ctrl", "Silence immédiat : l'annonce en cours s'arrête. La lecture à voix haute reste activée"],
    ["Alt + W", "Répéter l'activité en cours"],
    ["Alt + Z", 'Afficher "Ligne X sur Y"'],
    ["Alt + D", "Annoncer le temps d'exercice et l'objectif de la semaine"],
    ["Alt + X", `Seulement pendant un ${pruefungWort("fr")} : annoncer le temps restant - dans un Match de la classe : ta place et le temps`],
    ["Alt + P", "Seulement dans un Match de la classe : annoncer toutes les places (qui est à quelle place)"],
    ["Alt + 2", GEZIELT_KUERZEL.fr],
    ["Alt + 3", "Explorer le clavier : chaque touche est annoncée (pour quitter : Alt + 3 à nouveau ou Échap deux fois)"],
    ["Alt + 4", "Trouver les touches : une touche est nommée, tu la cherches (dans la fenêtre : basculer entre explorer et trouver)"],
    ["Alt + 5", 'Pendant Trouver les touches : basculer entre "Mes touches" et "Toutes les touches"'],
    ["Alt + K", "Choisir les couleurs et le contraste"],
    ["Alt + G", "Aller au titre suivant - annoncé si la lecture à voix haute est activée (reprend au début)"],
    ["Alt + R", "Recommencer la configuration (âge, langue, clavier, son)"],
    ["Alt + T", "Ouvrir / fermer cette liste"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Afficher ton ${stufenWort.toLowerCase()}`,
  kurztastenNachher: [
    [
      "Alt + M",
      "Lancer un Match de la classe : cinq minutes de course de frappe (seulement dans une classe, si le Match de la classe y est autorisé) - si un match est déjà en cours, il te le dit",
    ],
    ["Alt + N", "Ouvrir / fermer les messages (après la connexion)"],
    ["Alt + U", "Aller à l'exercice (après la connexion)"],
    ["Alt + S", "Ouvrir ou fermer les statistiques en t'exerçant, ou aller à Mes classes pour le personnel enseignant (après la connexion)"],
    ["Alt + +", "Agrandir le champ de saisie"],
    ["Alt + -", "Rétrécir le champ de saisie"],
    ["Alt + 0", "Remettre le champ de saisie à sa taille normale"],
    ["Alt + Maj + P", "Signaler un problème - avec une image de la fenêtre"],
  ],
  fussnote: "Alt + touche. Sur Mac : Option (⌥) + touche. Fonctionne aussi directement dans le champ de saisie.",
  fussnoteFeld: "Fonctionne aussi directement dans le champ de saisie.",
};

const ES: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", 'Cerrar las ventanas y volver al campo de escritura - la palabra "Tastenflow" de arriba hace lo mismo'],
    ["Mayús Mayús", "Dos pulsaciones rápidas: se anuncia el dedo correcto"],
    ["Alt + O", "Abrir o cerrar la configuración"],
    ["Alt + J", "Abrir o cerrar tu cuenta - el menú de la cuenta si has iniciado sesión, si no, la página para iniciar sesión"],
    ["Alt + B", "Cambiar el tipo de ejercicio: Mi entrenamiento - Cuentos - Juegos de palabras"],
    ["Alt + H", "Abrir o cerrar la ayuda"],
    ["Alt + E", "Ir al campo de escritura"],
    ["Alt + V", "Lectura en voz alta activada o desactivada"],
    ["Alt + 6", "Melodía al escribir activada o desactivada: cada tecla correcta toca la nota siguiente (con lectura en voz alta: en el oído derecho)"],
    ["Alt + 7 / Alt + 8", "Sonido de la melodía: Alt + 7 atrás, Alt + 8 adelante (monstruos, gatos, robots …)"],
    ["Ctrl", "Silencio inmediato: se detiene el aviso en curso. La lectura en voz alta sigue activada"],
    ["Alt + W", "Repetir la actividad actual"],
    ["Alt + Z", 'Mostrar "Línea X de Y"'],
    ["Alt + D", "Anunciar el tiempo de práctica y el objetivo semanal"],
    ["Alt + X", `Solo durante un ${pruefungWort("es")}: anunciar el tiempo que queda - en una Competición de la clase: tu puesto y el tiempo`],
    ["Alt + P", "Solo en una Competición de la clase: anunciar todos los puestos (quién va en qué puesto)"],
    ["Alt + 2", GEZIELT_KUERZEL.es],
    ["Alt + 3", "Explorar el teclado: se anuncia cada tecla (para salir: Alt + 3 otra vez o Esc dos veces)"],
    ["Alt + 4", "Buscar teclas: se nombra una tecla y tú la buscas (en la ventana: cambiar entre explorar y buscar)"],
    ["Alt + 5", 'Durante Buscar teclas: cambiar entre "Mis teclas" y "Todas las teclas"'],
    ["Alt + K", "Elegir los colores y el contraste"],
    ["Alt + G", "Ir al siguiente título - se anuncia si la lectura en voz alta está activada (vuelve a empezar al final)"],
    ["Alt + R", "Volver a hacer la configuración inicial (edad, idioma, teclado, sonido)"],
    ["Alt + T", "Abrir o cerrar esta lista"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Mostrar tu ${stufenWort.toLowerCase()}`,
  kurztastenNachher: [
    [
      "Alt + M",
      "Empezar una Competición de la clase: cinco minutos de carrera escribiendo (solo en una clase, si allí está permitida la Competición de la clase) - si ya hay una en marcha, te lo dice",
    ],
    ["Alt + N", "Abrir o cerrar los mensajes (con la sesión iniciada)"],
    ["Alt + U", "Ir al ejercicio (con la sesión iniciada)"],
    ["Alt + S", "Abrir o cerrar las estadísticas mientras practicas, o ir a Mis clases si eres docente (con la sesión iniciada)"],
    ["Alt + +", "Agrandar el campo de escritura"],
    ["Alt + -", "Reducir el campo de escritura"],
    ["Alt + 0", "Devolver el campo de escritura a su tamaño normal"],
    ["Alt + Mayús + P", "Informar de un problema - con una imagen de la ventana"],
  ],
  fussnote: "Alt + tecla. En Mac: Opción (⌥) + tecla. También funciona directamente en el campo de escritura.",
  fussnoteFeld: "También funciona directamente en el campo de escritura.",
};

const IT: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", `Chiude le finestre e torna al campo di scrittura - la parola "Tastenflow" in alto fa lo stesso`],
    ["Maiusc Maiusc", "Due pressioni veloci: viene annunciato il dito giusto"],
    ["Alt + O", "Apri o chiudi le impostazioni"],
    ["Alt + J", "Apri o chiudi il tuo account - con l'accesso il menu dell'account, altrimenti la pagina per accedere"],
    ["Alt + B", "Tipo di esercizio a turno: Il mio allenamento - Storie - Giochi di parole"],
    ["Alt + H", "Apri o chiudi l'aiuto"],
    ["Alt + E", "Vai al campo di scrittura"],
    ["Alt + V", "Lettura ad alta voce sì o no"],
    ["Alt + 6", "Melodia mentre scrivi sì o no: ogni tasto giusto suona la nota seguente (con la lettura ad alta voce: nell'orecchio destro)"],
    ["Alt + 7 / Alt + 8", "Suono della melodia: Alt + 7 indietro, Alt + 8 avanti (mostri, gatti, robot …)"],
    ["Ctrl", "Silenzio immediato: l'annuncio in corso si ferma. La lettura ad alta voce resta attiva"],
    ["Alt + W", "Annuncia di nuovo l'attività attuale"],
    ["Alt + Z", `Mostra "Riga X di Y"`],
    ["Alt + D", "Annuncia il tempo di esercizio e l'obiettivo settimanale"],
    ["Alt + X", `Solo durante una ${pruefungWort("it")}: annuncia il tempo che resta - in una Gara di classe: il tuo posto e il tempo`],
    ["Alt + P", "Solo in una Gara di classe: annuncia tutti i posti (chi è in quale posto)"],
    ["Alt + 2", GEZIELT_KUERZEL.it],
    ["Alt + 3", "Esplora i tasti: ogni tasto viene annunciato (per uscire: di nuovo Alt + 3 oppure due volte Esc)"],
    ["Alt + 4", "Trova i tasti: viene detto un tasto e tu lo cerchi (nella finestra: passa da Esplora a Trova e viceversa)"],
    ["Alt + 5", `In Trova i tasti: passa da "I miei tasti" a "Tutti i tasti" e viceversa`],
    ["Alt + K", "Scegli colori e contrasto"],
    ["Alt + G", "Vai al titolo successivo - con la lettura ad alta voce viene annunciato (dopo l'ultimo si ricomincia)"],
    ["Alt + R", "Ricomincia la configurazione (età, lingua, tastiera, suono)"],
    ["Alt + T", "Apri o chiudi questo elenco"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Mostra il tuo ${stufenWort.toLowerCase()}`,
  kurztastenNachher: [
    [
      "Alt + M",
      "Proponi una Gara di classe: cinque minuti di gara a chi scrive (solo in una classe, se l'insegnante lo permette) - se ce n'è già una in corso, te lo dice",
    ],
    ["Alt + N", "Apri o chiudi i messaggi (con l'accesso)"],
    ["Alt + U", "Passa all'esercizio (con l'accesso)"],
    ["Alt + S", "Apri e chiudi i progressi mentre ti eserciti, oppure Le mie classi se insegni (con l'accesso)"],
    ["Alt + +", "Ingrandisci il campo di scrittura"],
    ["Alt + -", "Rimpicciolisci il campo di scrittura"],
    ["Alt + 0", "Riporta il campo di scrittura alla dimensione normale"],
    ["Alt + Maiusc + P", "Segnala un problema - con un'immagine della finestra"],
  ],
  fussnote: "Alt + tasto. Sul Mac: Opzione (⌥) + tasto. Funziona anche direttamente nel campo di scrittura.",
  fussnoteFeld: "Funziona anche direttamente nel campo di scrittura.",
};

const PL: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Zamyka okna i wraca do pola pisania - to samo robi słowo „Tastenflow” u góry"],
    ["Shift Shift", "Dwa razy szybko: odczytywany jest odpowiedni palec"],
    ["Alt + O", "Otwórz lub zamknij ustawienia"],
    ["Alt + J", "Otwórz lub zamknij moje konto - po zalogowaniu menu konta, bez logowania okno logowania"],
    ["Alt + B", "Rodzaj ćwiczenia po kolei: Mój trening - Opowiadania - Gry słowne"],
    ["Alt + H", "Otwórz lub zamknij pomoc"],
    ["Alt + E", "Przejdź do pola pisania"],
    ["Alt + V", "Czytanie na głos: włącz lub wyłącz"],
    ["Alt + 6", "Melodia podczas pisania: włącz lub wyłącz - każdy dobry klawisz gra następną nutę (z czytaniem na głos: w prawym uchu)"],
    ["Alt + 7 / Alt + 8", "Dźwięk melodii: Alt + 7 wstecz, Alt + 8 dalej (potwory, koty, roboty …)"],
    ["Ctrl", "Natychmiastowa cisza: bieżący komunikat się kończy. Czytanie na głos zostaje włączone"],
    ["Alt + W", "Odczytaj ponownie bieżące zadanie"],
    ["Alt + Z", "Pokaż „Wiersz X z Y”"],
    ["Alt + D", "Odczytaj czas ćwiczeń i cel tygodniowy"],
    ["Alt + X", `Odczytaj pozostały czas (tylko w trakcie: ${pruefungWort("pl")}) - w Wyścigu klasowym: miejsce i czas`],
    ["Alt + P", "Tylko w Wyścigu klasowym: odczytaj wszystkie miejsca (kto jest na którym miejscu)"],
    ["Alt + 2", GEZIELT_KUERZEL.pl],
    ["Alt + 3", "Odkrywaj klawisze: program mówi nazwę każdego klawisza (wyjście: jeszcze raz Alt + 3 albo dwa razy Esc)"],
    ["Alt + 4", "Znajdź klawisze: program podaje klawisz, a ty go szukasz (w oknie: przełączanie między Odkrywaj i Znajdź)"],
    ["Alt + 5", "W oknie Znajdź klawisze: przełączanie między „Moje klawisze” i „Wszystkie klawisze”"],
    ["Alt + K", "Wybierz kolory i kontrast"],
    ["Alt + G", "Przejdź do następnego nagłówka - przy czytaniu na głos zostaje odczytany (po ostatnim od nowa)"],
    ["Alt + R", "Zacznij konfigurację od nowa (wiek, język, klawiatura, dźwięk)"],
    ["Alt + T", "Otwórz lub zamknij tę listę"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Pokaż: ${stufenWort}`,
  kurztastenNachher: [
    [
      "Alt + M",
      "Ogłoś Wyścig klasowy: pięć minut pisania na wyścigi (tylko w klasie, jeśli nauczyciele na to pozwalają) - jeśli jakiś już trwa, program o tym powie",
    ],
    ["Alt + N", "Otwórz lub zamknij wiadomości (po zalogowaniu)"],
    ["Alt + U", "Przejdź do ćwiczeń (po zalogowaniu)"],
    ["Alt + S", "Otwórz i zamknij postępy (przy ćwiczeniu) albo sekcję Moje klasy (przy prowadzeniu zajęć) (po zalogowaniu)"],
    ["Alt + +", "Powiększ pole pisania"],
    ["Alt + -", "Zmniejsz pole pisania"],
    ["Alt + 0", "Przywróć normalny rozmiar pola pisania"],
    ["Alt + Shift + P", "Zgłoś problem - z obrazem okna"],
  ],
  fussnote: "Alt + klawisz. Na Macu: Option (⌥) + klawisz. Działa też bezpośrednio w polu pisania.",
  fussnoteFeld: "Działa też bezpośrednio w polu pisania.",
};

const TR: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", 'Pencereleri kapatır ve yazma alanına döner - üstteki "Tastenflow" kelimesi de aynısını yapar'],
    ["Shift Shift", "İki kez hızlıca bas: doğru parmak söylenir"],
    ["Alt + O", "Ayarları aç / kapat"],
    ["Alt + J", "Hesabımı aç / kapat - giriş yapıldıysa hesap menüsü, yoksa giriş sayfası"],
    ["Alt + B", "Alıştırma türleri sırayla: Antrenmanım - Öyküler - Kelime oyunları"],
    ["Alt + H", "Yardımı aç / kapat"],
    ["Alt + E", "Yazma alanına git"],
    ["Alt + V", "Sesli okuma: aç / kapat"],
    ["Alt + 6", "Yazarken melodi: aç / kapat - her doğru tuş bir sonraki notayı çalar (sesli okuma açıksa: sağ kulakta)"],
    ["Alt + 7 / Alt + 8", "Melodi sesi: Alt + 7 geri, Alt + 8 ileri (canavarlar, kediler, robotlar ...)"],
    ["Ctrl", "Hemen sustur: süren duyuru biter. Sesli okuma açık kalır"],
    ["Alt + W", "Şu anki görevi yeniden seslendir"],
    ["Alt + Z", '"Satır X, toplam Y" bilgisini göster'],
    ["Alt + D", "Çalışma süresini ve haftalık hedefi seslendir"],
    ["Alt + X", `Yalnızca ${pruefungWort("tr")} sırasında: kalan süreyi seslendir - Sınıf Maçında: yerini ve kalan süreyi`],
    ["Alt + P", "Yalnızca Sınıf Maçında: tüm sıralamayı seslendir (kim kaçıncı sırada)"],
    ["Alt + 2", GEZIELT_KUERZEL.tr],
    ["Alt + 3", "Tuşları Keşfet: her tuşun adı söylenir (çıkış: yeniden Alt + 3 veya iki kez Esc)"],
    ["Alt + 4", "Tuşları Bul: bir tuş söylenir, sen onu bulursun (pencerede: Keşfet ile Bul arasında geçiş)"],
    ["Alt + 5", 'Tuşları Bul penceresinde: "Tuşlarım" ile "Tüm tuşlar" arasında geçiş'],
    ["Alt + K", "Renkleri ve karşıtlığı seç"],
    ["Alt + G", "Sonraki başlığa git - sesli okuma açıksa başlık okunur (sonuncudan sonra baştan)"],
    ["Alt + R", "Kurulumu yeniden başlat (yaş, dil, klavye, ses efektleri)"],
    ["Alt + T", "Bu listeyi aç / kapat"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Göster: ${stufenWort}`,
  kurztastenNachher: [
    [
      "Alt + M",
      "Sınıf Maçı başlat: beş dakika yarışarak yazma (yalnızca bir sınıfta, öğretmen izin verirse) - zaten bir maç sürüyorsa program bunu söyler",
    ],
    ["Alt + N", "Mesajları aç / kapat (giriş yapıldıysa)"],
    ["Alt + U", "Alıştırmaya geç (giriş yapıldıysa)"],
    ["Alt + S", "İlerlemeyi aç ve kapat (alıştırmada) ya da Sınıflarım bölümü (öğretmen olarak) (giriş yapıldıysa)"],
    ["Alt + +", "Yazma alanını büyüt"],
    ["Alt + -", "Yazma alanını küçült"],
    ["Alt + 0", "Yazma alanını normal boyutuna döndür"],
    ["Alt + Shift + P", "Sorun bildir - pencerenin bir görüntüsüyle"],
  ],
  fussnote: "Alt + tuş. Mac'te: Option (⌥) + tuş. Doğrudan yazma alanında da çalışır.",
  fussnoteFeld: "Doğrudan yazma alanında da çalışır.",
};

const CS: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Zavřít okna a vrátit se do pole pro psaní - totéž udělá slovo Tastenflow nahoře"],
    ["Shift Shift", "Dvakrát rychle: ohlásí se správný prst"],
    ["Alt + O", "Otevřít / zavřít nastavení"],
    ["Alt + J", "Otevřít / zavřít Můj účet - po přihlášení nabídka účtu, jinak přihlášení"],
    ["Alt + B", "Druh cvičení dokola: Můj trénink - Příběhy - Slovní hry"],
    ["Alt + H", "Otevřít / zavřít nápovědu"],
    ["Alt + E", "Přejít do pole pro psaní"],
    ["Alt + V", "Předčítání: zapnout / vypnout"],
    ["Alt + 6", "Melodie při psaní: zapnout / vypnout - každá správná klávesa zahraje další tón (s předčítáním: v pravém uchu)"],
    ["Alt + 7 / Alt + 8", "Zvuk melodie: Alt + 7 zpět, Alt + 8 dál (příšery, kočky, roboti ...)"],
    ["Ctrl", "Okamžité ztišení: právě běžící hlášení skončí. Předčítání zůstane zapnuté"],
    ["Alt + W", "Znovu přečíst aktuální úkol"],
    ["Alt + Z", "Ukázat údaj Řádek X/Y"],
    ["Alt + D", "Přečíst čas procvičování a týdenní cíl"],
    ["Alt + X", `Přečíst zbývající čas (jen během: ${pruefungWort("cs")}) - v Třídním závodě: místo a čas`],
    ["Alt + P", "Jen v Třídním závodě: přečíst všechna místa (kdo je na kterém místě)"],
    ["Alt + 2", GEZIELT_KUERZEL.cs],
    ["Alt + 3", "Průzkum kláves: program řekne název každé klávesy (konec: znovu Alt + 3 nebo dvakrát Esc)"],
    ["Alt + 4", "Hledání kláves: program řekne klávesu a ty ji hledáš (v okně: přepínání mezi průzkumem a hledáním)"],
    ["Alt + 5", "V okně Hledání kláves: přepínání mezi Moje klávesy a Všechny klávesy"],
    ["Alt + K", "Vybrat barvy a kontrast"],
    ["Alt + G", "Přejít na další nadpis - s předčítáním se nadpis přečte (po posledním znovu od začátku)"],
    ["Alt + R", "Spustit úvodní nastavení znovu (věk, jazyk, klávesnice, zvuk)"],
    ["Alt + T", "Otevřít / zavřít tento seznam"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Zobrazit: ${stufenWort}`,
  kurztastenNachher: [
    [
      "Alt + M",
      "Vyhlásit Třídní závod: pět minut psaní o závod (jen ve třídě, pokud to vyučující povolí) - pokud už nějaký běží, program to řekne",
    ],
    ["Alt + N", "Otevřít / zavřít zprávy (po přihlášení)"],
    ["Alt + U", "Přepnout na cvičení (po přihlášení)"],
    ["Alt + S", "Otevřít a zavřít pokrok (při cvičení) nebo část Moje třídy (při výuce) (po přihlášení)"],
    ["Alt + +", "Zvětšit pole pro psaní"],
    ["Alt + -", "Zmenšit pole pro psaní"],
    ["Alt + 0", "Vrátit pole pro psaní na normální velikost"],
    ["Alt + Shift + P", "Nahlásit problém - s obrázkem okna"],
  ],
  fussnote: "Alt + klávesa. Na Macu: Option (⌥) + klávesa. Funguje i přímo v poli pro psaní.",
  fussnoteFeld: "Funguje i přímo v poli pro psaní.",
};

/** ★ O2-LIB (30.10.2026): die Kürzelliste bulgarisch - Verbalhauptwörter wie in Windows („Отваряне / затваряне"), Tastennamen wie auf der Kappe. */
const BG: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Затваряне на прозорците и връщане в полето за писане - същото прави думата Tastenflow най-горе"],
    ["Shift Shift", "Двукратно бързо натискане: обявява се правилният пръст"],
    ["Alt + O", "Отваряне / затваряне на настройките"],
    ["Alt + J", "Отваряне / затваряне на Моят акаунт - след вход менюто на акаунта, иначе входът"],
    ["Alt + B", "Смяна на вида упражнение по кръг: Моята тренировка - Истории - Игри с думи"],
    ["Alt + H", "Отваряне / затваряне на помощта"],
    ["Alt + E", "Преминаване в полето за писане"],
    ["Alt + V", "Четене на глас: включване / изключване"],
    ["Alt + 6", "Мелодия при писане: включване / изключване - всеки правилен клавиш свири следващия тон (при четене на глас: в дясното ухо)"],
    ["Alt + 7 / Alt + 8", "Звук на мелодията: Alt + 7 назад, Alt + 8 напред (чудовища, котки, роботи ...)"],
    ["Ctrl", "Веднага тишина: текущото съобщение спира. Четенето на глас остава включено"],
    ["Alt + W", "Повторно прочитане на текущата задача"],
    ["Alt + Z", "Показване на Ред X/Y"],
    ["Alt + D", "Съобщаване на времето за упражнения и седмичната цел"],
    ["Alt + X", `Съобщаване на оставащото време (само при ${pruefungWort("bg")}) - в Състезание в класа: мястото и времето`],
    ["Alt + P", "Само в Състезание в класа: съобщаване на всички места (кой на кое място е)"],
    ["Alt + 2", GEZIELT_KUERZEL.bg],
    ["Alt + 3", "Разглеждане на клавишите: всеки клавиш се назовава (изход: пак Alt + 3 или два пъти Esc)"],
    ["Alt + 4", "Търсене на клавиши: назовава се клавиш, който се търси (в прозореца: превключване между разглеждане и търсене)"],
    ["Alt + 5", "При търсене на клавиши: превключване между Моите клавиши и Всички клавиши"],
    ["Alt + K", "Избор на цветове и контраст"],
    ["Alt + G", "Преминаване към следващото заглавие - при включено четене на глас се прочита (след последното отново от началото)"],
    ["Alt + R", "Ново стартиране на първоначалната настройка (възраст, език, клавиатура, звук)"],
    ["Alt + T", "Отваряне / затваряне на този списък"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Показване: ${stufenWort}`,
  kurztastenNachher: [
    [
      "Alt + M",
      "Обявяване на Състезание в класа: пет минути състезание по писане (само в клас, ако учителите го позволяват) - ако вече тече едно, програмата го казва",
    ],
    ["Alt + N", "Отваряне / затваряне на съобщенията (след вход)"],
    ["Alt + U", "Преминаване към упражнения (след вход)"],
    ["Alt + S", "Отваряне и затваряне на напредъка при упражняване или преминаване към Моите класове при преподаване (след вход)"],
    ["Alt + +", "Увеличаване на полето за писане"],
    ["Alt + -", "Намаляване на полето за писане"],
    ["Alt + 0", "Връщане на полето за писане към нормалния размер"],
    ["Alt + Shift + P", "Съобщаване за проблем - със снимка на прозореца"],
  ],
  fussnote: "Alt + клавиш. На Mac: Option (⌥) + клавиш. Работи и директно в полето за писане.",
  fussnoteFeld: "Работи и директно в полето за писане.",
};

/** ★ O2-LIB (30.10.2026): die Liste der Tastenkürzel griechisch (Glossar §2.8/§2.12). */
const EL: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Κλείσιμο παραθύρων και επιστροφή στο πεδίο γραφής - το ίδιο κάνει η λέξη Tastenflow στην κορυφή"],
    ["Shift Shift", "Πάτημα δύο φορές γρήγορα: ανακοινώνεται το σωστό δάχτυλο"],
    ["Alt + O", "Άνοιγμα / κλείσιμο ρυθμίσεων"],
    ["Alt + J", "Άνοιγμα / κλείσιμο του λογαριασμού - μετά τη σύνδεση το μενού λογαριασμού, αλλιώς η σύνδεση"],
    ["Alt + B", "Αλλαγή είδους εξάσκησης: Η εξάσκησή μου - Ιστορίες - Παιχνίδια λέξεων"],
    ["Alt + H", "Άνοιγμα / κλείσιμο βοήθειας"],
    ["Alt + E", "Μετάβαση στο πεδίο γραφής"],
    ["Alt + V", "Εκφώνηση: ενεργή / ανενεργή"],
    ["Alt + 6", "Μελωδία κατά τη γραφή: ενεργή / ανενεργή - κάθε σωστό πλήκτρο παίζει την επόμενη νότα (με εκφώνηση: στο δεξί αυτί)"],
    ["Alt + 7 / Alt + 8", "Ήχος μελωδίας: Alt + 7 πίσω, Alt + 8 μπροστά (τέρατα, γάτες, ρομπότ ...)"],
    ["Ctrl", "Άμεση σίγαση: η τρέχουσα ανακοίνωση σταματά. Η εκφώνηση μένει ενεργή"],
    ["Alt + W", "Επανάληψη της τρέχουσας εργασίας"],
    ["Alt + Z", "Εμφάνιση του αριθμού γραμμής (Γραμμή Χ από Ψ)"],
    ["Alt + D", "Ανακοίνωση χρόνου εξάσκησης και εβδομαδιαίου στόχου"],
    ["Alt + X", `Μόνο σε ${pruefungWort("el")}: ανακοίνωση του χρόνου που απομένει - σε Αγώνα τμήματος: η θέση και ο χρόνος`],
    ["Alt + P", "Μόνο σε Αγώνα τμήματος: ανακοίνωση όλων των θέσεων (ποιος είναι σε ποια θέση)"],
    ["Alt + 2", GEZIELT_KUERZEL.el],
    ["Alt + 3", "Γνωριμία με τα πλήκτρα: ανακοινώνεται κάθε πλήκτρο (έξοδος: ξανά Alt + 3 ή δύο φορές Esc)"],
    ["Alt + 4", "Βρες τα πλήκτρα: ανακοινώνεται ένα πλήκτρο και αναζητείται (μέσα στο παράθυρο: εναλλαγή ανάμεσα στη γνωριμία και την αναζήτηση)"],
    ["Alt + 5", "Στο Βρες τα πλήκτρα: εναλλαγή ανάμεσα στα Τα πλήκτρα μου και Όλα τα πλήκτρα"],
    ["Alt + K", "Επιλογή χρωμάτων και αντίθεσης"],
    ["Alt + G", "Μετάβαση στην επόμενη επικεφαλίδα - με ενεργή εκφώνηση ανακοινώνεται (μετά την τελευταία ξανά από την αρχή)"],
    ["Alt + R", "Νέα εκκίνηση των αρχικών ρυθμίσεων (ηλικία, γλώσσα, πληκτρολόγιο, ήχος)"],
    ["Alt + T", "Άνοιγμα / κλείσιμο αυτής της λίστας"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Εμφάνιση: ${stufenWort}`,
  kurztastenNachher: [
    ["Alt + M", "Προκήρυξη Αγώνα τμήματος: πέντε λεπτά αγώνας γραφής (μόνο σε τμήμα, αν το επιτρέπουν οι ρυθμίσεις του τμήματος) - αν τρέχει ήδη ένας, το λέει η εφαρμογή"],
    ["Alt + N", "Άνοιγμα / κλείσιμο μηνυμάτων (μετά τη σύνδεση)"],
    ["Alt + U", "Μετάβαση στην εξάσκηση (μετά τη σύνδεση)"],
    ["Alt + S", "Άνοιγμα ή κλείσιμο της προόδου κατά την εξάσκηση ή μετάβαση στα τμήματα κατά τη διδασκαλία (μετά τη σύνδεση)"],
    ["Alt + +", "Μεγέθυνση του πεδίου γραφής"],
    ["Alt + -", "Σμίκρυνση του πεδίου γραφής"],
    ["Alt + 0", "Επαναφορά του πεδίου γραφής στο κανονικό μέγεθος"],
    ["Alt + Shift + P", "Αναφορά προβλήματος - με εικόνα του παραθύρου"],
  ],
  fussnote: "Alt + πλήκτρο. Σε Mac: Option (⌥) + πλήκτρο. Λειτουργεί και απευθείας μέσα στο πεδίο γραφής.",
  fussnoteFeld: "Λειτουργεί και απευθείας μέσα στο πεδίο γραφής.",
};

/** ★ O2-LIB (30.10.2026): die Kürzel-Liste ungarisch - Tastennamen wie auf der Kappe (Glossar §2.9), Wortlaut ohne Anrede. */
const HU: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Ablakok bezárása és vissza a gépelési mezőbe - ugyanezt teszi a lap tetején lévő „Tastenflow” szó is"],
    ["Shift Shift", "Kétszer gyorsan: bemondja, melyik ujj a megfelelő"],
    ["Alt + O", "Beállítások megnyitása / bezárása"],
    ["Alt + J", "Saját fiók megnyitása / bezárása - bejelentkezve a fiókmenü, egyébként a bejelentkezés"],
    ["Alt + B", "Gyakorlattípus váltása sorban: Saját gyakorlás - Történetek - Szójátékok"],
    ["Alt + H", "Súgó megnyitása / bezárása"],
    ["Alt + E", "Ugrás a gépelési mezőbe"],
    ["Alt + V", "Felolvasás be / ki"],
    ["Alt + 6", "Dallam gépelés közben be / ki: minden helyes billentyű a következő hangot játssza (felolvasással: a jobb fülben)"],
    ["Alt + 7 / Alt + 8", "A dallam hangzása: Alt + 7 vissza, Alt + 8 tovább (szörnyek, macskák, robotok ...)"],
    ["Ctrl", "Azonnali elhallgatás: a most futó bemondás véget ér. A felolvasás bekapcsolva marad"],
    ["Alt + W", "A jelenlegi feladat ismétlése"],
    ["Alt + Z", "A „Sor: X/Y” kijelzése"],
    ["Alt + D", "A gyakorlási idő és a heti cél bemondása"],
    ["Alt + X", `Csak ${pruefungWort("hu")} közben: a hátralévő idő bemondása - Osztályversenyen: a helyezés és az idő`],
    ["Alt + P", "Csak Osztályversenyen: az összes helyezés bemondása (ki hányadik)"],
    ["Alt + 2", GEZIELT_KUERZEL.hu],
    ["Alt + 3", "Billentyűk felfedezése: minden billentyű nevét bemondja (kilépés: újra Alt + 3 vagy kétszer Esc)"],
    ["Alt + 4", "Billentyűk keresése: megnevez egy billentyűt, és te megkeresed (az ablakban: váltás a felfedezés és a keresés között)"],
    ["Alt + 5", "Billentyűk keresése közben: váltás a „Saját billentyűim” és a „Minden billentyű” között"],
    ["Alt + K", "Színek és kontraszt kiválasztása"],
    ["Alt + G", "Ugrás a következő címsorra - bekapcsolt felolvasásnál bemondja (az utolsó után újra az elejéről)"],
    ["Alt + R", "Az első beállítás újraindítása (életkor, nyelv, billentyűzet, hang)"],
    ["Alt + T", "Ez a lista megnyitása / bezárása"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Megjelenítés: ${stufenWort}`,
  kurztastenNachher: [
    ["Alt + M", "Osztályverseny meghirdetése: öt perc gépelési verseny egymással (csak osztályban, ha a tanár engedélyezi) - ha már fut egy, a program szól"],
    ["Alt + N", "Üzenetek megnyitása / bezárása (bejelentkezve)"],
    ["Alt + U", "Váltás a gyakorlásra (bejelentkezve)"],
    ["Alt + S", "Gyakorlás közben a haladás megnyitása / bezárása, tanítás közben az „Osztályaim” (bejelentkezve)"],
    ["Alt + +", "A gépelési mező nagyítása"],
    ["Alt + -", "A gépelési mező kicsinyítése"],
    ["Alt + 0", "A gépelési mező visszaállítása normál méretre"],
    ["Alt + Shift + P", "Hiba bejelentése - az ablak képével"],
  ],
  fussnote: "Alt + billentyű. Macen: Option (⌥) + billentyű. Közvetlenül a gépelési mezőben is működik.",
  fussnoteFeld: "Közvetlenül a gépelési mezőben is működik.",
};

/** ★ O2-LIB (30.10.2026): die Kürzelliste niederländisch - Tastennamen wie auf der Kappe (Glossar nl §2.9), Knöpfe und Reiter mit ihren Namen aus §2. */
const NL: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Vensters sluiten en terug naar het typveld - het woord Tastenflow bovenaan doet hetzelfde"],
    ["Shift Shift", "Twee keer snel indrukken: de juiste vinger wordt genoemd"],
    ["Alt + O", "Instellingen openen / sluiten"],
    ["Alt + J", "Mijn account openen / sluiten - als je bent ingelogd het accountmenu, anders het inloggen"],
    ["Alt + B", "Soort oefening wisselen: Mijn training - Verhalen - Woordspelletjes"],
    ["Alt + H", "Help openen / sluiten"],
    ["Alt + E", "Naar het typveld springen"],
    ["Alt + V", "Voorlezen aan / uit"],
    ["Alt + 6", "Melodie tijdens het typen aan / uit: elke goede toets speelt de volgende toon (met voorlezen in het rechteroor)"],
    ["Alt + 7 / Alt + 8", "Geluid van de melodie: Alt + 7 terug, Alt + 8 vooruit (monsters, katten, robots ...)"],
    ["Ctrl", "Meteen stil: de lopende melding stopt. Voorlezen blijft aan"],
    ["Alt + W", "De huidige opdracht herhalen"],
    ["Alt + Z", "Regel X van Y tonen"],
    ["Alt + D", "Oefentijd en weekdoel voorlezen"],
    ["Alt + X", `Alleen tijdens een ${pruefungWort("nl")}: de resterende tijd voorlezen - in een Klassenwedstrijd: je plaats en de tijd`],
    ["Alt + P", "Alleen in een Klassenwedstrijd: alle plaatsen voorlezen (wie op welke plaats staat)"],
    ["Alt + 2", GEZIELT_KUERZEL.nl],
    ["Alt + 3", "Toetsen verkennen: elke toets wordt genoemd (stoppen: nog eens Alt + 3 of twee keer Esc)"],
    ["Alt + 4", "Toetsen zoeken: een toets wordt genoemd en jij zoekt hem (in het venster: wisselen tussen verkennen en zoeken)"],
    ["Alt + 5", "Bij Toetsen zoeken: wisselen tussen Mijn toetsen en Alle toetsen"],
    ["Alt + K", "Kleuren en contrast kiezen"],
    ["Alt + G", "Naar de volgende kop springen - met voorlezen aan wordt de kop voorgelezen (na de laatste weer bovenaan)"],
    ["Alt + R", "De eerste stappen opnieuw doorlopen (leeftijd, taal, toetsenbord, geluid)"],
    ["Alt + T", "Deze lijst openen / sluiten"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Toon je ${stufenWort.toLowerCase()}`,
  kurztastenNachher: [
    ["Alt + M", "Een Klassenwedstrijd starten: vijf minuten lang om het snelst typen (alleen in een klas, als de leerkracht het toestaat) - loopt er al een, dan hoor je dat"],
    ["Alt + N", "Berichten openen / sluiten (als je bent ingelogd)"],
    ["Alt + U", "Naar het oefenen gaan (als je bent ingelogd)"],
    ["Alt + S", "Tijdens het oefenen de voortgang openen of sluiten, of tijdens het lesgeven naar Mijn klassen gaan (als je bent ingelogd)"],
    ["Alt + +", "Het typveld groter maken"],
    ["Alt + -", "Het typveld kleiner maken"],
    ["Alt + 0", "Het typveld weer op normale grootte zetten"],
    ["Alt + Shift + P", "Een probleem melden - met een afbeelding van het venster"],
  ],
  fussnote: "Alt + toets. Op een Mac: Option (⌥) + toets. Werkt ook direct in het typveld.",
  fussnoteFeld: "Werkt ook direct in het typveld.",
};

/** ★ O2-LIB (30.10.2026): a lista de atalhos em português (Portugal) - botões e descrições no infinitivo, nomes de teclas como na tecla (Glossário pt §2.9). */
const PT: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Fechar as janelas e voltar ao campo de escrita - a palavra Tastenflow no topo faz o mesmo"],
    ["Shift Shift", "Premir duas vezes depressa: o dedo certo é anunciado"],
    ["Alt + O", "Abrir / fechar as definições"],
    ["Alt + J", "Abrir / fechar A minha conta - com sessão iniciada, o menu da conta; caso contrário, o início de sessão"],
    ["Alt + B", "Passar ao tipo de exercício seguinte: O meu treino - Histórias - Jogos de palavras"],
    ["Alt + H", "Abrir / fechar a ajuda"],
    ["Alt + E", "Saltar para o campo de escrita"],
    ["Alt + V", "Leitura em voz alta ligada / desligada"],
    ["Alt + 6", "Melodia ao escrever ligada / desligada: cada tecla certa toca a nota seguinte (com leitura em voz alta: no ouvido direito)"],
    ["Alt + 7 / Alt + 8", "Som da melodia: Alt + 7 para trás, Alt + 8 para a frente (monstros, gatos, robôs ...)"],
    ["Ctrl", "Silêncio imediato: o anúncio em curso termina. A leitura em voz alta continua ligada"],
    ["Alt + W", "Repetir a tarefa atual"],
    ["Alt + Z", "Mostrar \"Linha X de Y\""],
    ["Alt + D", "Dizer o tempo de prática e o objetivo semanal"],
    ["Alt + X", `Só durante um ${pruefungWort("pt")}: dizer o tempo que falta - na Corrida da turma: o lugar e o tempo`],
    ["Alt + P", "Só na Corrida da turma: dizer todos os lugares (quem está em que lugar)"],
    ["Alt + 2", GEZIELT_KUERZEL.pt],
    ["Alt + 3", "Explorar as teclas: cada tecla é anunciada (para sair: Alt + 3 outra vez ou Esc duas vezes)"],
    ["Alt + 4", "Encontrar teclas: o programa diz uma tecla e procura-se (dentro da janela: alternar entre explorar e encontrar)"],
    ["Alt + 5", "Ao encontrar teclas: alternar entre \"As minhas teclas\" e \"Todas as teclas\""],
    ["Alt + K", "Escolher cores e contraste"],
    ["Alt + G", "Saltar para o título seguinte - anunciado se a leitura em voz alta estiver ligada (depois do último, volta ao início)"],
    ["Alt + R", "Repetir a configuração inicial (idade, língua, teclado, som)"],
    ["Alt + T", "Abrir / fechar esta lista"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Mostrar: ${stufenWort}`,
  kurztastenNachher: [
    ["Alt + M", "Lançar uma Corrida da turma: cinco minutos de corrida de escrita (só numa turma, se quem ensina o permitir) - se já houver uma a decorrer, o programa avisa"],
    ["Alt + N", "Abrir / fechar as mensagens (com sessão iniciada)"],
    ["Alt + U", "Ir para a prática (com sessão iniciada)"],
    ["Alt + S", "Abrir ou fechar os progressos ao praticar, ou ir para As minhas turmas ao ensinar (com sessão iniciada)"],
    ["Alt + +", "Aumentar o campo de escrita"],
    ["Alt + -", "Diminuir o campo de escrita"],
    ["Alt + 0", "Repor o tamanho normal do campo de escrita"],
    ["Alt + Shift + P", "Comunicar um problema - com uma imagem da janela"],
  ],
  fussnote: "Alt + tecla. No Mac: Opção (⌥) + tecla. Também funciona diretamente no campo de escrita.",
  fussnoteFeld: "Também funciona diretamente no campo de escrita.",
};

/** ★ O2-LIB (30.10.2026): die Kürzelliste, Portugiesisch (Brasilien) - Tastennamen wie auf der Kappe (Alt, Shift, Ctrl, Esc), "barra de espaço". */
const BR: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Fechar janelas e voltar ao campo de digitação - a palavra Tastenflow no alto faz o mesmo"],
    ["Shift Shift", "Pressione duas vezes rápido: o dedo certo é anunciado"],
    ["Alt + O", "Abrir / fechar as configurações"],
    ["Alt + J", "Abrir / fechar Minha conta - depois de entrar na conta, o menu da conta; senão, a tela de entrada"],
    ["Alt + B", "Alternar o tipo de prática: Meu treino - Histórias - Jogos de palavras"],
    ["Alt + H", "Abrir / fechar a ajuda"],
    ["Alt + E", "Ir para o campo de digitação"],
    ["Alt + V", "Leitura em voz alta: ligar / desligar"],
    ["Alt + 6", "Melodia ao digitar: ligar / desligar - cada tecla correta toca a próxima nota (com leitura em voz alta: no ouvido direito)"],
    ["Alt + 7 / Alt + 8", "Som da melodia: Alt + 7 volta, Alt + 8 avança (monstros, gatos, robôs ...)"],
    ["Ctrl", "Silêncio imediato: o anúncio em andamento termina. A leitura em voz alta continua ligada"],
    ["Alt + W", "Repetir a tarefa atual"],
    ["Alt + Z", "Mostrar a indicação Linha X de Y"],
    ["Alt + D", "Anunciar o tempo de prática e a meta semanal"],
    ["Alt + X", `Só durante um ${pruefungWort("br")}: anunciar o tempo restante - na Competição da turma: a posição e o tempo`],
    ["Alt + P", "Só na Competição da turma: anunciar todas as posições (quem está em qual posição)"],
    ["Alt + 2", GEZIELT_KUERZEL.br],
    ["Alt + 3", "Explorar teclas: cada tecla é anunciada (para sair: Alt + 3 de novo ou Esc duas vezes)"],
    ["Alt + 4", "Encontrar teclas: o nome de uma tecla é dito e você a procura (na janela: alternar entre explorar e encontrar)"],
    ["Alt + 5", "Em Encontrar teclas: alternar entre Minhas teclas e Todas as teclas"],
    ["Alt + K", "Escolher cores e contraste"],
    ["Alt + G", "Ir para o próximo título - anunciado quando a leitura em voz alta está ligada (depois do último, volta ao começo)"],
    ["Alt + R", "Refazer a configuração inicial (idade, idioma, teclado, som)"],
    ["Alt + T", "Abrir / fechar esta lista"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Mostrar: ${stufenWort}`,
  kurztastenNachher: [
    [
      "Alt + M",
      "Iniciar uma Competição da turma: cinco minutos de corrida de digitação (só em uma turma, se a pessoa docente permitir) - se já houver uma em andamento, o aplicativo avisa",
    ],
    ["Alt + N", "Abrir / fechar as mensagens (depois de entrar na conta)"],
    ["Alt + U", "Ir para a prática (depois de entrar na conta)"],
    ["Alt + S", "Abrir / fechar o progresso durante a prática, ou ir para Minhas turmas durante o ensino (depois de entrar na conta)"],
    ["Alt + +", "Aumentar o campo de digitação"],
    ["Alt + -", "Diminuir o campo de digitação"],
    ["Alt + 0", "Voltar o campo de digitação ao tamanho normal"],
    ["Alt + Shift + P", "Relatar um problema - com uma imagem da janela"],
  ],
  fussnote: "Alt + tecla. No Mac: Option (⌥) + tecla. Funciona também direto no campo de digitação.",
  fussnoteFeld: "Funciona também direto no campo de digitação.",
};

/** ★ O2-LIB (30.10.2026): die Kürzel-Liste auf Rumänisch. */
const RO: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Închide ferestrele și revine în câmpul de scriere - același lucru îl face cuvântul Tastenflow de sus"],
    ["Shift Shift", "De două ori repede: se anunță degetul potrivit"],
    ["Alt + O", "Deschide / închide setările"],
    ["Alt + J", "Deschide / închide Contul meu - după conectare meniul contului, altfel conectarea"],
    ["Alt + B", "Tipul de exercițiu, pe rând: Antrenamentul meu - Povești - Jocuri cu cuvinte"],
    ["Alt + H", "Deschide / închide ajutorul"],
    ["Alt + E", "Sare în câmpul de scriere"],
    ["Alt + V", "Citire cu voce tare: pornită / oprită"],
    ["Alt + 6", "Melodie la scris: pornită / oprită - fiecare tastă corectă cântă următoarea notă (cu citire cu voce tare: în urechea dreaptă)"],
    ["Alt + 7 / Alt + 8", "Sunetul melodiei: Alt + 7 înapoi, Alt + 8 înainte (monștri, pisici, roboți ...)"],
    ["Ctrl", "Liniște imediată: anunțul în curs se oprește. Citirea cu voce tare rămâne pornită"],
    ["Alt + W", "Repetă sarcina curentă"],
    ["Alt + Z", "Arată Rândul X/Y"],
    ["Alt + D", "Anunță timpul de exersare și obiectivul săptămânal"],
    ["Alt + X", `Anunță timpul rămas (doar în timpul: ${pruefungWort("ro")}) - în Întrecerea clasei: locul și timpul`],
    ["Alt + P", "Doar în Întrecerea clasei: anunță toate locurile (cine pe ce loc este)"],
    ["Alt + 2", GEZIELT_KUERZEL.ro],
    ["Alt + 3", "Explorarea tastelor: fiecare tastă este anunțată (ieșire: din nou Alt + 3 sau de două ori Esc)"],
    ["Alt + 4", "Căutarea tastelor: se spune numele unei taste, iar tu o cauți (în fereastră: comutare între explorare și căutare)"],
    ["Alt + 5", "În Căutarea tastelor: comutare între Tastele mele și Toate tastele"],
    ["Alt + K", "Alege culorile și contrastul"],
    ["Alt + G", "Sare la titlul următor - cu citirea cu voce tare pornită, titlul este citit (după ultimul, din nou de la început)"],
    ["Alt + R", "Reia configurarea (vârsta, limba, tastatura, sunetul)"],
    ["Alt + T", "Deschide / închide această listă"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Arată: ${stufenWort}`,
  kurztastenNachher: [
    [
      "Alt + M",
      "Lansează o Întrecere a clasei: cinci minute de scris în întrecere (doar într-o clasă, dacă cadrul didactic permite) - dacă una rulează deja, programul spune asta",
    ],
    ["Alt + N", "Deschide / închide mesajele (după conectare)"],
    ["Alt + U", "Mergi la exersare (după conectare)"],
    ["Alt + S", "Deschide sau închide progresul la exersare, sau Clasele mele la predare (după conectare)"],
    ["Alt + +", "Mărește câmpul de scriere"],
    ["Alt + -", "Micșorează câmpul de scriere"],
    ["Alt + 0", "Readu câmpul de scriere la dimensiunea normală"],
    ["Alt + Shift + P", "Raportează o problemă - cu o imagine a ferestrei"],
  ],
  fussnote: "Alt + tastă. Pe Mac: Opțiune (⌥) + tastă. Funcționează și direct în câmpul de scriere.",
  fussnoteFeld: "Funcționează și direct în câmpul de scriere.",
};

/** ★ O2-LIB (29.10.2026): die Kürzelliste schwedisch - Tastennamen wie auf der Kappe (Glossar §2.9), ungebeugt. */
const SV: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Stäng fönster och gå tillbaka till skrivfältet - ordet Tastenflow överst gör detsamma"],
    ["Skift Skift", "Tryck två gånger snabbt: rätt finger sägs"],
    ["Alt + O", "Öppna / stäng inställningarna"],
    ["Alt + J", "Öppna / stäng ditt konto - kontomenyn när du är inloggad, annars inloggningen"],
    ["Alt + B", "Växla mellan övningsformerna: Min träning - Berättelser - Ordlekar"],
    ["Alt + H", "Öppna / stäng hjälpen"],
    ["Alt + E", "Hoppa till skrivfältet"],
    ["Alt + V", "Uppläsning på / av"],
    ["Alt + 6", "Melodi vid skrivning på / av: varje rätt tangent spelar nästa ton (med uppläsning i höger öra)"],
    ["Alt + 7 / Alt + 8", "Melodins ljud: Alt + 7 bakåt, Alt + 8 framåt (monster, katter, robotar och fler)"],
    ["Ctrl", "Tyst direkt: det som sägs just nu avbryts. Uppläsningen förblir påslagen"],
    ["Alt + W", "Upprepa den aktuella uppgiften"],
    ["Alt + Z", "Visa Rad X/Y"],
    ["Alt + D", "Läs upp övningstid och veckomål"],
    ["Alt + X", `Bara under ${pruefungWort("sv")}: läs upp tiden som är kvar - i en Klasstävling: din placering och tiden`],
    ["Alt + P", "Bara i en Klasstävling: läs upp alla placeringar (vem som är på vilken plats)"],
    ["Alt + 2", GEZIELT_KUERZEL.sv],
    ["Alt + 3", "Utforska tangenterna: varje tangent sägs (avsluta: Alt + 3 igen eller Esc två gånger)"],
    ["Alt + 4", "Hitta tangenterna: en tangent nämns och du letar efter den (i fönstret: växla mellan att utforska och att hitta)"],
    ["Alt + 5", "När du hittar tangenter: växla mellan Mina tangenter och Alla tangenter"],
    ["Alt + K", "Välj färger och kontrast"],
    ["Alt + G", "Hoppa till nästa rubrik - rubriken läses upp när uppläsningen är på (börjar om från toppen)"],
    ["Alt + R", "Börja om med inställningarna (ålder, språk, tangentbord, ljud)"],
    ["Alt + T", "Öppna / stäng den här listan"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Visa: ${stufenWort.toLowerCase()}`,
  kurztastenNachher: [
    ["Alt + M", "Starta en Klasstävling: tävla i skrivning i fem minuter (bara i en klass, om läraren tillåter det) - om en redan pågår får du veta det"],
    ["Alt + N", "Öppna / stäng meddelanden (när du är inloggad)"],
    ["Alt + U", "Gå till övningen (när du är inloggad)"],
    ["Alt + S", "Öppna eller stäng framstegen medan du övar, eller gå till Mina klasser medan du undervisar (när du är inloggad)"],
    ["Alt + +", "Gör skrivfältet större"],
    ["Alt + -", "Gör skrivfältet mindre"],
    ["Alt + 0", "Skrivfältet tillbaka till normal storlek"],
    ["Alt + Skift + P", "Rapportera ett problem - med en bild av fönstret"],
  ],
  fussnote: "Alt + tangent. På Mac: Alternativ (⌥) + tangent. Fungerar också direkt i skrivfältet.",
  fussnoteFeld: "Fungerar också direkt i skrivfältet.",
};

/** ★ O2-LIB (30.10.2026): die Kürzelliste ukrainisch (Glossar Ukrainisch: Читання вголос, Дослідити клавіші, Знайти клавіші, Перегони класу). */
const UK: KuerzelListeTexte = {
  kurztastenVorher: [
    ["Esc", "Закрити вікна й повернутися в поле для друку - те саме робить слово Tastenflow угорі"],
    ["Shift Shift", "Двічі швидко: оголошується правильний палець"],
    ["Alt + O", "Відкрити / закрити налаштування"],
    ["Alt + J", "Відкрити / закрити обліковий запис - після входу меню облікового запису, інакше вхід"],
    ["Alt + B", "Види вправ по колу: Моє тренування - Історії - Ігри зі словами"],
    ["Alt + H", "Відкрити / закрити довідку"],
    ["Alt + E", "Перейти в поле для друку"],
    ["Alt + V", "Читання вголос: увімкнути / вимкнути"],
    ["Alt + 6", "Мелодія під час друку: увімкнути / вимкнути - кожна правильна клавіша грає наступну ноту (з читанням вголос: у правому вусі)"],
    ["Alt + 7 / Alt + 8", "Звучання мелодії: Alt + 7 назад, Alt + 8 уперед (монстри, коти, роботи ...)"],
    ["Ctrl", "Миттєва тиша: поточне оголошення припиняється. Читання вголос лишається ввімкненим"],
    ["Alt + W", "Повторити поточне завдання"],
    ["Alt + Z", "Показати Рядок X/Y"],
    ["Alt + D", "Оголосити час тренування й тижневу мету"],
    ["Alt + X", `Оголосити час, що лишився (лише під час: ${pruefungWort("uk")}) - у Перегонах класу: місце й час`],
    ["Alt + P", "Лише в Перегонах класу: оголосити всі місця (хто на якому місці)"],
    ["Alt + 2", GEZIELT_KUERZEL.uk],
    ["Alt + 3", "Дослідити клавіші: програма називає кожну клавішу (вийти: знову Alt + 3 або двічі Esc)"],
    ["Alt + 4", "Знайти клавіші: програма називає клавішу, а ти її шукаєш (у вікні: перемикання між дослідженням і пошуком)"],
    ["Alt + 5", "У вікні Знайти клавіші: перемикання між Мої клавіші й Усі клавіші"],
    ["Alt + K", "Вибрати кольори й контраст"],
    ["Alt + G", "Перейти до наступного заголовка - з читанням вголос заголовок оголошується (після останнього знову з початку)"],
    ["Alt + R", "Запустити початкове налаштування знову (вік, мова, клавіатура, звук)"],
    ["Alt + T", "Відкрити / закрити цей список"],
  ],
  stufeAnzeigen: (stufenWort: string) => `Показати: ${stufenWort}`,
  kurztastenNachher: [
    [
      "Alt + M",
      "Оголосити Перегони класу: п'ять хвилин змагання з друку (лише в класі, якщо педагог дозволяє) - якщо вони вже тривають, програма про це скаже",
    ],
    ["Alt + N", "Відкрити / закрити повідомлення (після входу)"],
    ["Alt + U", "Перейти до тренування (після входу)"],
    ["Alt + S", "Під час тренування відкрити чи закрити Мій поступ, під час навчання класу перейти до Моїх класів (після входу)"],
    ["Alt + +", "Збільшити поле для друку"],
    ["Alt + -", "Зменшити поле для друку"],
    ["Alt + 0", "Повернути звичайний розмір поля для друку"],
    ["Alt + Shift + P", "Повідомити про проблему - зі знімком вікна"],
  ],
  fussnote: "Alt + клавіша. На Mac: Option (⌥) + клавіша. Працює й безпосередньо в полі для друку.",
  fussnoteFeld: "Працює й безпосередньо в полі для друку.",
};

/** Die Liste je Sprache der Bedienung. */
export const KUERZEL_LISTE: Readonly<Record<BedienSprache, KuerzelListeTexte>> = {
  de: DE,
  en: EN,
  fr: FR,
  es: ES,
  it: IT,
  pl: PL,
  tr: TR,
  cs: CS,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: BG,
  el: EL,
  hu: HU,
  nl: NL,
  pt: PT,
  br: BR,
  ro: RO,
  sv: SV,
  uk: UK,
};

/**
 * Alle Zeilen in der Reihenfolge der Liste: davor, Alt + L, danach.
 * `stufenWort` ist das Wort der Stufe (in der App `bedienCopy(…).progressLabel`).
 */
export function kuerzelZeilen(sprache: BedienSprache, stufenWort: string): KuerzelZeile[] {
  const t = KUERZEL_LISTE[sprache];
  return [...t.kurztastenVorher, ["Alt + L", t.stufeAnzeigen(stufenWort)], ...t.kurztastenNachher];
}
