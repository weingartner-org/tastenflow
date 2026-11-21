/**
 * ★★★ „WAS GIBT'S NEUES" - das Fenster für BESTEHENDE Lehrkräfte (Z3, 19.09.2026).
 * ============================================================================
 *
 * Johannes, 19.09.2026, wörtlich: *„bestehende Lehrer bekommen beim nächsten
 * Mal Anmelden ein Popup mit ‚Was gibt's Neues:', in dem du die neue
 * Benutzeroberfläche erklärst, die neuen Wochenaufgaben, die eigene Übungen
 * (auch in der Tippchallenge), der Übungspool"*.
 *
 * WER und WIE OFT entscheidet `lib/typing/neuigkeiten.ts` (einmal je Konto,
 * nur Lehrkräfte, nur Konten von vor dem Stichtag). Dieses Bauteil entscheidet
 * nur noch WO:
 *  · `ort="meine-klassen"` - „Meine Klassen" für Tastenflow (`programm`
 *    „tippen" aus Pfad oder `?app=`; ohne Programm nur unter tastenflow.org).
 *    Nie in der Klassenseite von Punktgenau, Klangpunkte oder »Im Griff«.
 *  · `ort="ueben"` - die Übungsseite, aber nur, wenn eine Lehrkraft dort
 *    wirklich SELBST übt: Sie kam über „Selbst üben" (Marke `selbstUeben` am
 *    Verlaufseintrag). Ohne die Marke leitet `TippenTrainerPage` jede
 *    Lehrkraft sofort nach „Meine Klassen" weiter (T3/A6, siehe dort
 *    `umgeleitetFuer`) - das Fenster erscheint dann eben dort. Ein Fenster,
 *    das im selben Augenblick mit der Seite wieder verschwindet, könnte
 *    niemand lesen.
 * Wo es zuerst quittiert wird, gilt es für beide Orte (und jedes Gerät).
 *
 * ── EIN FENSTER ZUR ZEIT ────────────────────────────────────────────────────
 * Beim ersten Öffnen nach dem Deploy trifft das Fenster auf den Spendenbanner
 * (`SpendenBanner.tsx`, Z2 - bei vielen Klassen genau beim selben Öffnen
 * fällig). Zwei `Modal` übereinander vertragen sich nicht: Beide fangen Tab
 * und Escape auf `document` ab - Escape schlösse beide, und Tab spränge nur
 * noch zwischen dem ersten und letzten Knopf des oberen Fensters. Darum tritt
 * dieses Fenster zurück, solange ein ANDERES modales Fenster offen ist (auch
 * wenn jenes erst später aufgeht), und kommt danach wieder - ohne dass es als
 * gesehen gilt. Erkannt wird ein Fenster wie in `AppKopfzeile`/`LwMessageBell`:
 * `[role="dialog"][aria-modal="true"]`.
 *
 * ── FOKUS ───────────────────────────────────────────────────────────────────
 * Beim Öffnen steht der Fokus auf dem ersten Satz (die Sprachausgabe nennt
 * dazu den Namen des Fensters); die Pfeiltasten rollen das Fenster. Escape,
 * ✕ und „Verstanden" schliessen - alle drei gelten als gesehen. Danach geht
 * der Fokus dorthin zurück, wo er war (`Modal`); stand er nirgends (das
 * Fenster kam beim Laden der Seite), auf die Hauptüberschrift `#seitentitel`
 * („Meine Klassen") - auf der Übungsseite holt `Modal` ihn ins Übungsfeld.
 *
 * ⚠️ `Modal` gehört fünf Apps (`apps/GEMEINSAM.md` §1) - hier BENUTZT, nicht
 * geändert.
 */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "@/components/Modal";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { typingBackend } from "@/lib/typing/backend";
import { handbuecherFuer } from "@/lib/lernwerkstatt/handbuecher";
import { hierIstTastenflow, meineKlasseHref } from "@/lib/adressen";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import {
  NEUIGKEITEN_FASSUNG,
  neuigkeitenEntscheiden,
  neuigkeitenLokalLesen,
  neuigkeitenLokalMerken,
} from "@/lib/typing/neuigkeiten";
// ★ Z4 (19.09.2026): „Rundgang durch die Seite" - statt des Rundgangs, den
// eine NEUE Lehrkraft von selbst bekommt (`lib/typing/rundgang.ts`).
import { useRundgangWunsch } from "@/lib/typing/rundgang";
import { RUNDGANG_TEXTE } from "@/lib/typing/rundgangTexte";
import { wahlTexte } from "@/lib/typing/wahltaste";

/**
 * Die Texte - je Abschnitt eine Zeile: zuerst die Überschrift, dann die
 * Punkte. Kurz und zum Überfliegen (Johannes: *„Halte die Seite extrem
 * schlank"*); die ausführliche Fassung steht in der Hilfe und im Handbuch.
 * Englisch: britisch, Wörter aus `GLOSSAR-ENGLISCH.md` (§3.3, §3.8, §3.15),
 * zu sehen in der englischen Bedienung.
 */
export const NEUIGKEITEN_TEXTE = texte({
  de: {
    titel: "Was gibt's Neues",
    einleitung:
      "Tastenflow hat für Lehrkräfte eine neue Oberfläche und neue Werkzeuge. Hier das Wichtigste in Kürze - dieses Fenster erscheint nur einmal. Ausführlich steht alles in der Hilfe (Alt + H) und im Handbuch.",
    abschnitte: [
      [
        "„Meine Klassen\" - die neue Seite",
        "Oben wechseln Sie zwischen „Lernstand\" und „Kinder und Zugänge\" (Kinder anlegen, Zugangsdaten).",
        "Die Aufgaben für die Klasse stehen in einer Zeile: Tippchallenge, Eigene Übung, Wochenziel, Einstellungen der Klasse und Stunde sperren.",
        "Über der Tabelle zeigt der Klassenüberblick die ganze Klasse - für den „Monat\" (die letzten 4 Wochen) oder das „Schuljahr\", mit Punktleiste und Liniendiagramm des Scores.",
        "Die Tabelle zeigt Woche, Monat, Schuljahr oder Gesamt. Die Zeile eines Kindes klappt auf: Einstellungen, Tippchallenges, Übungszeiten je Woche, wacklige Tasten, Abzeichen.",
        "Erklärungen erscheinen als Hinweis, sobald Sie zu einem Schalter gehen - mit der Tabulatortaste oder dem Zeiger.",
      ],
      [
        "Wochenaufgaben: Minuten pro Woche",
        "Unter „Wochenziel\" stellen Sie je Kind Minuten pro Woche ein - ohne Einheiten. „Für die Klasse übernehmen\" gilt auch für Kinder, die später dazukommen.",
        "Eine Woche läuft von Montag 8:00 bis Montag 8:00 Uhr. Änderungen gelten ab dem nächsten Montag.",
        "Dazu gibt es „Verpasste Minuten der vergangenen Wochen nachholen\", „Woche erlassen\" und „Überfällige zurücksetzen\".",
        "„Stunde sperren\": 60 Minuten lang zählt das Üben der ganzen Klasse nicht fürs Wochenziel, als Übezeit aber schon - etwa im Unterricht.",
        "Tabelle und Klassenüberblick zeigen in Prozent, wie viel geschafft ist. Der Wochenbericht per E-Mail kommt am Montagmorgen, neu aufgebaut (einschalten unter „Kinder und Zugänge\").",
      ],
      [
        "Eigene Übung - ein Text für die ganze Klasse",
        "Unter „Eigene Übung\" wählen Sie den Text: eine Datei hochladen (.txt oder .docx), einen Text aus „Meine Texte\" oder eine „Vorlage\" - die Texte der früheren Lektionen.",
        "Nach „Eigene Übung starten\" bekommt jedes Kind ein Fenster und schreibt den Text einmal im eigenen Tempo; danach übt es normal weiter.",
        "Mehrere Übungen kommen der Reihe nach, jede mit eigenem Fenster, und jede lässt sich einzeln beenden.",
        "Dieselben Wege gibt es für eine Tippchallenge mit eigenem Text.",
      ],
      [
        "Meine Texte - Ihr Übungspool",
        "„Meine Texte\" ist Ihre eigene Ablage für Übungstexte - am Konto, nicht an einer Klasse, und nur für Sie sichtbar.",
        "Beim Hochladen legt „In Meine Texte speichern\" eine Kopie dort ab. So verwenden Sie den Text wieder, in „Eigene Übung\" und in der Tippchallenge.",
      ],
      [
        "Außerdem",
        "Je Kind gibt es „Zeichenabstand groß (CVI)\" - mehr Abstand zwischen den Zeichen für Kinder mit zerebraler Sehbehinderung. Das Kind kann ihn auch selbst in seinen Einstellungen ändern.",
        "Die Übungszeiten eines Kindes zeigen je Woche, wie oft es beim Klassenmatch mitgespielt hat.",
      ],
    ],
    handbuch:
      "Das Handbuch für Lehrkräfte ist auf dem neuen Stand - in „Meine Klassen\" unter „Downloads\", in der Hilfe (Alt + H) oder gleich hier:",
    verstanden: "Verstanden",
  },
  en: {
    titel: "What's new",
    einleitung:
      "Tastenflow has a new look and new tools for teachers. Here are the main changes in brief - this window appears only once. You will find everything in detail in the help (Alt + H) and in the guide.",
    abschnitte: [
      [
        "“My classes” - the new page",
        "At the top you switch between “Progress” and “Pupils and logins” (adding pupils, login details).",
        "The tasks for the class sit in one row: Typing Challenge, Custom exercise, Weekly goal, Class settings and Pause goal for 1 hour.",
        "Above the table, the class overview shows the whole class - for the “Month” (the last 4 weeks) or the “School year”, with a score bar and a line chart of the score.",
        "The table shows Week, Month, School year or All time. Expand a pupil's row for settings, Typing Challenges, practice times per week, wobbly keys and badges.",
        "Explanations appear as a hint as soon as you move to a button - with the Tab key or the pointer.",
      ],
      [
        "Weekly goals in minutes",
        "Under “Weekly goal” you set minutes per week for each pupil - no more units. “Apply to the class” also covers pupils who join later.",
        "A week runs from 8am on Monday to 8am the following Monday. Changes apply from the next Monday.",
        "You can also use “Catch up on missed minutes from previous weeks”, “Excuse weeks” and “Clear overdue minutes”.",
        "“Pause goal for 1 hour”: for 60 minutes the whole class's practice does not count towards the weekly goal, though it still counts as practice time - useful in lessons.",
        "The table and the class overview show the percentage met. The weekly report by email arrives on Monday morning, rebuilt (switch it on under “Pupils and logins”).",
      ],
      [
        "Custom exercise - one text for the whole class",
        "Under “Custom exercise” you choose the text: upload a file (.txt or .docx), pick one from “My texts”, or use a “Template” - the texts of the former lessons.",
        "After “Start the custom exercise”, every pupil gets a window and types the text once at their own pace, then goes back to normal practice.",
        "Several exercises come one after the other, each with its own window, and you can end each one separately.",
        "The same sources are there for a Typing Challenge with your own text.",
      ],
      [
        "My texts - your pool of exercises",
        "“My texts” is your own store of practice texts - kept with your account, not with a class, and visible only to you.",
        "When you upload a file, “Save to My texts” keeps a copy there, so you can use the text again in “Custom exercise” and in the Typing Challenge.",
      ],
      [
        "Also new",
        "Each pupil can have “Wide letter spacing (CVI)” - more space between characters for pupils with cerebral visual impairment. Pupils can also change it in their own settings.",
        "A pupil's practice times show how often they took part in a Class Match each week.",
      ],
    ],
    handbuch:
      "The guide for teachers is up to date - in “My classes” under “Downloads”, in the help (Alt + H) or right here:",
    verstanden: "Got it",
  },
  // ★ E11a: „vous" - dieses Fenster erscheint nur Lehrkräften (F9).
  fr: {
    titel: "Quoi de neuf",
    einleitung:
      "Tastenflow a une nouvelle interface et de nouveaux outils pour les enseignants. Voici l'essentiel en bref - cette fenêtre n'apparait qu'une fois. Tout est détaillé dans l'aide (Alt + H) et dans le guide.",
    abschnitte: [
      [
        '"Mes classes" - la nouvelle page',
        'En haut, vous passez de "Progrès" à "Élèves et accès" (créer des élèves, identifiants).',
        "Les activités pour la classe sont sur une ligne : Défi, Texte de la classe, Objectif de la semaine, Réglages de la classe et Verrouiller l'heure.",
        'Au-dessus du tableau, l\'aperçu de la classe montre toute la classe - pour le "Mois" (les 4 dernières semaines) ou l\'"Année scolaire", avec un anneau de progression et un graphique du score.',
        "Le tableau affiche la semaine, le mois, l'année scolaire ou le total. La ligne d'un élève se déplie : réglages, Défis, temps d'exercice par semaine, touches instables, badges.",
        "Les explications apparaissent en info-bulle dès que vous atteignez un bouton, par exemple avec la touche Tab.",
      ],
      [
        "Objectifs de la semaine : minutes par semaine",
        'Sous "Objectif de la semaine", vous réglez les minutes par semaine pour chaque élève - un simple nombre, sans séances de cours à indiquer. "Appliquer à la classe" vaut aussi pour les élèves qui arrivent plus tard.',
        "Une semaine va du lundi 8 h au lundi 8 h suivant. Les changements s'appliquent à partir du lundi suivant.",
        '"Rattraper les minutes manquées des semaines précédentes", "Dispenser une semaine" et "Réinitialiser les minutes en retard" sont aussi disponibles.',
        '"Verrouiller l\'heure" : pendant 60 minutes, l\'exercice de toute la classe ne compte pas pour l\'objectif de la semaine, mais compte quand même comme temps d\'exercice - par exemple pendant un cours.',
        "Le tableau et l'aperçu de la classe indiquent en pourcentage ce qui est atteint. Le bilan hebdomadaire par e-mail arrive le lundi matin, entièrement refait (à activer sous \"Élèves et accès\").",
      ],
      [
        "Texte de la classe - un texte pour toute la classe",
        'Sous "Texte de la classe", vous choisissez le texte : charger un fichier (.txt ou .docx), un texte de "Mes textes" ou un "modèle" - les textes des leçons précédentes.',
        'Après "Lancer le texte de la classe", une fenêtre l\'annonce à chaque élève, qui tape le texte une fois à son propre rythme ; ensuite, l\'entrainement normal reprend.',
        "Plusieurs textes se suivent dans l'ordre, chacun annoncé par sa propre fenêtre, et chacun peut être terminé individuellement.",
        "Les mêmes possibilités existent pour un Défi avec un fichier personnel.",
      ],
      [
        "Mes textes - votre réserve d'exercices",
        '"Mes textes" est votre propre espace pour les textes d\'exercice - lié au compte, pas à une classe, et visible seulement par vous.',
        'En chargeant un fichier, "Enregistrer dans Mes textes" en garde une copie. Vous réutilisez ainsi le texte, dans "Texte de la classe" et dans le Défi.',
      ],
      [
        "Par ailleurs",
        "Pour chaque élève, il y a \"Grand espacement des caractères (CVI)\" - plus d'espace entre les caractères pour les élèves avec une déficience visuelle cérébrale. L'élève peut aussi le changer lui-même dans ses réglages.",
        "Les temps d'exercice d'un élève indiquent, par semaine, combien de fois il a participé au Match de la classe.",
      ],
    ],
    handbuch:
      'Le guide pour les enseignants est à jour - dans "Mes classes" sous "Téléchargements", dans l\'aide (Alt + H) ou juste ici :',
    verstanden: "Compris",
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft - usted.
  es: {
    titel: "Novedades",
    einleitung:
      "Tastenflow tiene una interfaz nueva y herramientas nuevas para docentes. Aquí va lo esencial en pocas palabras - esta ventana aparece solo una vez. Todo se explica en detalle en la ayuda (Alt + H) y en la guía.",
    abschnitte: [
      [
        '"Mis clases" - la página nueva',
        'Arriba cambia entre "Progreso" y "Estudiantes y accesos" (crear cuentas, datos de acceso).',
        "Las actividades para la clase están en una sola línea: Reto, Texto de la clase, Objetivo semanal, Configuración de la clase y Bloquear la hora.",
        'Encima de la tabla, el resumen de la clase muestra a toda la clase - para el "Mes" (las últimas 4 semanas) o el "Curso escolar", con un anillo de progreso y un gráfico de la puntuación.',
        "La tabla muestra la semana, el mes, el curso escolar o el total. La fila de cada estudiante se despliega: configuración, Retos, tiempos de práctica por semana, teclas inseguras, insignias.",
        "Las explicaciones aparecen como texto de ayuda en cuanto llega a un botón, por ejemplo con la tecla Tab.",
      ],
      [
        "Objetivos semanales: minutos por semana",
        'En "Objetivo semanal" fija los minutos por semana de cada estudiante - un simple número, sin indicar horas de clase. "Aplicar a toda la clase" se aplica también a estudiantes que lleguen más tarde.',
        "Una semana va del lunes a las 8 al lunes siguiente a las 8. Los cambios se aplican a partir del lunes siguiente.",
        'También están "Recuperar los minutos que faltaron en semanas anteriores", "Eximir una semana" y "Poner a cero los minutos pendientes".',
        '"Bloquear la hora": durante 60 minutos, lo que practica toda la clase no cuenta para el objetivo semanal, pero sí como tiempo de práctica - por ejemplo, durante una clase.',
        "La tabla y el resumen de la clase indican en porcentaje lo que se ha alcanzado. El resumen semanal por correo electrónico llega el lunes por la mañana, totalmente renovado (se activa en \"Estudiantes y accesos\").",
      ],
      [
        "Texto de la clase - un texto para toda la clase",
        'En "Texto de la clase" elige el texto: subir un archivo (.txt o .docx), un texto de "Mis textos" o una "plantilla" - los textos de lecciones anteriores.',
        'Después de "Iniciar el texto de la clase", una ventana se lo anuncia a cada estudiante, que escribe el texto una vez a su propio ritmo; después sigue el entrenamiento normal.',
        "Varios textos van uno detrás de otro, cada uno anunciado con su propia ventana, y cada uno se puede terminar por separado.",
        "Las mismas posibilidades existen para un Reto con un archivo propio.",
      ],
      [
        "Mis textos - su reserva de ejercicios",
        '"Mis textos" es su propio espacio para textos de práctica - vinculado a la cuenta, no a una clase, y visible solo para usted.',
        'Al subir un archivo, "Guardar en Mis textos" conserva una copia. Así puede volver a usar el texto, en "Texto de la clase" y en el Reto.',
      ],
      [
        "Además",
        "Para cada estudiante existe \"Espacio grande entre caracteres (CVI)\" - más espacio entre los caracteres para estudiantes con discapacidad visual cerebral (CVI; en español también DVC). Cada estudiante también puede cambiarlo en su configuración.",
        "Los tiempos de práctica de cada estudiante indican, por semana, cuántas veces participó en la Competición de la clase.",
      ],
    ],
    handbuch:
      'La guía para docentes está actualizada - en "Mis clases", en "Descargas", en la ayuda (Alt + H) o aquí mismo:',
    verstanden: "Entendido",
  },
  // ★ O-IT (02.10.2026): liest nur die Lehrkraft - neutral (Glossar Regel 1);
  // „in classe" für den Unterricht, „lezione" bleibt die Lektion (§2.6).
  it: {
    titel: "Novità",
    einleitung:
      "Tastenflow ha un'interfaccia nuova e strumenti nuovi per insegnanti. Qui l'essenziale in poche parole - questa finestra compare una sola volta. Tutto è spiegato nei dettagli nell'aiuto (Alt + H) e nella guida.",
    abschnitte: [
      [
        `"Le mie classi" - la pagina nuova`,
        `In alto si passa da "Progressi" ad "Alunni e accessi" (creare account, dati di accesso).`,
        "Le attività per la classe sono su una sola riga: Sfida, Esercizio personalizzato, Obiettivo settimanale, Impostazioni della classe e Sospendere l'obiettivo per un'ora.",
        `Sopra la tabella, la panoramica della classe mostra tutta la classe - per il "Mese" (le ultime 4 settimane) o l'"Anno scolastico", con una barra a punti e un grafico a linee del punteggio.`,
        "La tabella mostra la settimana, il mese, l'anno scolastico o tutto dall'inizio. La riga di ogni persona si apre: impostazioni, Sfide, tempi di esercizio per settimana, tasti incerti, medaglie.",
        "Le spiegazioni compaiono come testo di aiuto appena si arriva a un pulsante, per esempio con il tasto Tab.",
      ],
      [
        "Obiettivi settimanali: minuti alla settimana",
        `In "Obiettivo settimanale" si impostano i minuti alla settimana di ogni persona - un semplice numero, senza indicare ore di lezione in classe. "Applica a tutta la classe" vale anche per chi arriva più tardi.`,
        "Una settimana va dal lunedì alle 8:00 al lunedì successivo alle 8:00. Le modifiche valgono dal lunedì successivo.",
        `Ci sono anche "Recuperare i minuti mancanti delle settimane precedenti", "Esonerare una settimana" e "Azzerare i minuti arretrati".`,
        `"Sospendere l'obiettivo per un'ora": per 60 minuti quello che fa tutta la classe non conta per l'obiettivo settimanale, ma conta come tempo di esercizio - per esempio durante un'ora in classe.`,
        `La tabella e la panoramica della classe indicano in percentuale quanto è stato raggiunto. Il resoconto settimanale via email arriva il lunedì mattina, tutto rinnovato (si attiva in "Alunni e accessi").`,
      ],
      [
        "Esercizio personalizzato - un testo per tutta la classe",
        `In "Esercizio personalizzato" si sceglie il testo: caricare un file (.txt o .docx), un testo da "I miei testi" o un "modello" - i testi delle lezioni del percorso.`,
        `Dopo "Avvia l'esercizio personalizzato" una finestra lo annuncia a ogni persona, che scrive il testo una volta al proprio ritmo; poi continua l'allenamento normale.`,
        "Più testi vengono uno dopo l'altro, ognuno annunciato dalla propria finestra, e ognuno si può concludere separatamente.",
        "Le stesse possibilità ci sono per una Sfida con un proprio file.",
      ],
      [
        "I miei testi - la propria raccolta di esercizi",
        `"I miei testi" è uno spazio proprio per i testi di esercizio - legato all'account, non a una classe, e visibile solo in questo account.`,
        `Quando si carica un file, "Salva in I miei testi" conserva una copia. Così il testo si può usare di nuovo, in "Esercizio personalizzato" e nella Sfida.`,
      ],
      [
        "Inoltre",
        `Per ogni persona c'è "Spaziatura ampia (CVI)" - più spazio tra i caratteri per chi ha una disabilità visiva di origine cerebrale (CVI). Ogni persona può anche cambiarla nelle proprie impostazioni.`,
        "I tempi di esercizio di ogni persona indicano, per settimana, quante volte ha partecipato alla Gara di classe.",
      ],
    ],
    handbuch:
      `La guida per insegnanti è aggiornata - in "Le mie classi", in "Download", nell'aiuto (Alt + H) o direttamente qui:`,
    verstanden: "Ho capito",
  },
  // ★ O-PL (02.10.2026): „Nowości" (Glossar §2.11); liest nur die Lehrkraft - ty-Befehlsform
  // und unpersönlicher Stil, nie Pan/Pani (Regel 1); Bereichsnamen im Nominativ in „…”.
  // „lekcja" bleibt die Lektion, die Unterrichtsstunde heisst „godzina lekcyjna" (§2.6).
  pl: {
    titel: "Nowości",
    einleitung:
      "Program Tastenflow ma nowy wygląd i nowe narzędzia dla nauczycieli. Tu najważniejsze w skrócie - to okno pojawia się tylko raz. Wszystko dokładnie opisują pomoc (Alt + H) i podręcznik dla nauczycieli.",
    abschnitte: [
      [
        "„Moje klasy” - nowa strona",
        "U góry są dwie sekcje: „Postępy” oraz „Uczniowie i dostęp” (dodawanie uczniów, dane logowania).",
        "Zadania dla klasy są w jednym wierszu: Wyzwanie, Własne ćwiczenie, Cel tygodniowy, Ustawienia klasy i Wstrzymaj cel na godzinę.",
        "Nad tabelą przegląd klasy pokazuje całą klasę - za „Miesiąc” (ostatnie 4 tygodnie) albo „Rok szkolny”, z paskiem punktów i wykresem liniowym wyniku.",
        "Tabela pokazuje Tydzień, Miesiąc, Rok szkolny albo Od początku. Wiersz każdej osoby się rozwija: ustawienia, Wyzwania, czasy ćwiczeń w każdym tygodniu, niepewne klawisze, odznaki.",
        "Wyjaśnienia pojawiają się jako podpowiedź, gdy tylko przejdziesz do przycisku, na przykład klawiszem Tab.",
      ],
      [
        "Cele tygodniowe: minuty w tygodniu",
        "W sekcji „Cel tygodniowy” ustawia się minuty w tygodniu dla każdej osoby - zwykła liczba, bez godzin lekcyjnych. „Zastosuj dla całej klasy” obejmuje też osoby, które dołączą później.",
        "Tydzień trwa od poniedziałku 8:00 do następnego poniedziałku 8:00. Zmiany obowiązują od następnego poniedziałku.",
        "Są też: „Nadrób brakujące minuty z poprzednich tygodni”, „Zwolnij z celu na tydzień” i „Wyzeruj zaległe minuty”.",
        "„Wstrzymaj cel na godzinę”: przez 60 minut ćwiczenia całej klasy nie liczą się do celu tygodniowego, ale liczą się do czasu ćwiczeń - na przykład w czasie zajęć.",
        "Tabela i przegląd klasy pokazują w procentach, ile już osiągnięto. Podsumowanie tygodnia e-mailem przychodzi w poniedziałek rano, w nowej formie (włącza się je w sekcji „Uczniowie i dostęp”).",
      ],
      [
        "Własne ćwiczenie - jeden tekst dla całej klasy",
        "W sekcji „Własne ćwiczenie” wybierz tekst: prześlij plik (.txt lub .docx), weź tekst z sekcji „Moje teksty” albo „Szablon” - teksty dawnych lekcji.",
        "Po wybraniu przycisku Zacznij własne ćwiczenie każda osoba dostaje okno i pisze tekst raz we własnym tempie; potem ćwiczy dalej jak zwykle.",
        "Kilka ćwiczeń przychodzi po kolei, każde z własnym oknem, i każde można zakończyć osobno.",
        "Te same możliwości są w Wyzwaniu z własnym tekstem.",
      ],
      [
        "Moje teksty - własny zbiór ćwiczeń",
        "„Moje teksty” to własne miejsce na teksty do ćwiczeń - przy koncie, nie przy klasie, i widoczne tylko dla ciebie.",
        "Przy przesyłaniu pliku opcja „Zapisz w sekcji Moje teksty” zachowuje tam kopię. Tak można użyć tekstu ponownie - we własnym ćwiczeniu i w Wyzwaniu.",
      ],
      [
        "Poza tym",
        "Dla każdej osoby jest opcja „Duże odstępy (CVI)” - więcej miejsca między znakami dla dzieci z mózgowymi zaburzeniami widzenia (CVI). Każda osoba może ją też zmienić we własnych ustawieniach.",
        "Czasy ćwiczeń każdej osoby pokazują dla każdego tygodnia, ile razy brała udział w Wyścigu klasowym.",
      ],
    ],
    handbuch:
      "Podręcznik dla nauczycieli jest aktualny - w sekcji „Moje klasy” pod „Do pobrania”, w pomocy (Alt + H) albo od razu tutaj:",
    verstanden: "Rozumiem",
  },
  // ★ O-TR (02.10.2026): "Yenilikler"; liest nur die Lehrkraft - siz mit -(y)In, nie -InIz
  // (Regel 1). Bereichs- und Knopfnamen wie in der türkischen Oberfläche in geraden
  // Anführungszeichen; "ders" bleibt die Lektion, die Unterrichtsstunde heisst "ders saati"
  // (§2.6); CVI als "Geniş harf aralığı (CVI)" (§2.8). Keine Endung an Uhrzeit oder Name.
  tr: {
    titel: "Yenilikler",
    einleitung:
      "Tastenflow öğretmenler için yeni bir görünüme ve yeni araçlara sahip. Burada en önemlileri kısaca - bu pencere yalnızca bir kez görünür. Her şey ayrıntılı olarak Yardım bölümünde (Alt + H) ve öğretmen kılavuzunda anlatılır.",
    abschnitte: [
      [
        `"Sınıflarım" - yeni sayfa`,
        `Üstte "İlerleme" ile "Öğrenciler ve girişler" (öğrenci ekleme, giriş bilgileri) arasında geçiş yaparsınız.`,
        "Sınıfın görevleri tek bir satırdadır: Yarışma, Kişisel alıştırma, Haftalık hedef, Sınıf ayarları ve Hedefi 1 saat durdur.",
        `Tablonun üstünde "Sınıfa genel bakış" bütün sınıfı gösterir - "Ay" (son 4 hafta) ya da "Öğretim yılı" için, puan çubuğu ve puanın çizgi grafiğiyle.`,
        "Tablo Hafta, Ay, Öğretim yılı ya da Başından beri gösterir. Bir öğrencinin satırı açılır: ayarlar, yarışmalar, haftalara göre çalışma süreleri, henüz oturmamış tuşlar, rozetler.",
        "Açıklamalar, bir düğmeye gittiğinizde ipucu olarak görünür - örneğin Tab tuşuyla.",
      ],
      [
        "Haftalık hedefler: haftada dakika",
        `"Haftalık hedef" bölümünde her öğrenci için haftalık dakika ayarlarsınız - ders saati birimi olmadan. "Tüm sınıfa uygula" sonradan katılan öğrenciler için de geçerlidir.`,
        "Bir hafta, Pazartesi saat 08:00 ile bir sonraki Pazartesi saat 08:00 arasıdır. Değişiklikler bir sonraki Pazartesiden itibaren geçerlidir.",
        `Ayrıca "Önceki haftalarda kaçırılan dakikaları telafi et", "Haftayı muaf tut" ve "Biriken dakikaları sıfırla" vardır.`,
        `"Hedefi 1 saat durdur": 60 dakika boyunca bütün sınıfın çalışması haftalık hedefe sayılmaz, ama çalışma süresine sayılır - örneğin ders saatinde.`,
        `Tablo ve sınıfa genel bakış, ne kadarının tamamlandığını yüzde olarak gösterir. E-postayla haftalık rapor Pazartesi sabahı, yeni düzeniyle gelir ("Öğrenciler ve girişler" bölümünde açılır).`,
      ],
      [
        "Kişisel alıştırma - bütün sınıf için bir metin",
        `"Kişisel alıştırma" bölümünde metni seçersiniz: bir dosya yükleyin (.txt veya .docx), "Metinlerim" içinden bir metin ya da bir "Şablon" alın - eski derslerin metinleri.`,
        `"Kişisel alıştırmayı başlat" düğmesinden sonra her öğrenci bir pencere alır ve metni kendi hızında bir kez yazar; sonra her zamanki gibi çalışmaya devam eder.`,
        "Birden fazla alıştırma sırayla gelir, her biri kendi penceresiyle, ve her biri ayrı ayrı bitirilebilir.",
        "Kendi metniyle bir Yarışma için de aynı yollar vardır.",
      ],
      [
        "Metinlerim - alıştırma arşiviniz",
        `"Metinlerim" alıştırma metinleri için kendi arşivinizdir - sınıfa değil hesabınıza aittir ve yalnızca siz görürsünüz.`,
        `Dosya yüklerken "Metinlerime kaydet" oraya bir kopya kaydeder. Böylece metni yeniden kullanırsınız - "Kişisel alıştırma" içinde ve Yarışmada.`,
      ],
      [
        "Ayrıca",
        `Her öğrenci için "Geniş harf aralığı (CVI)" vardır - serebral görme bozukluğu (CVI) olan öğrenciler için karakterler arasında daha geniş aralık. Öğrenci bunu kendi ayarlarında da değiştirebilir.`,
        "Bir öğrencinin çalışma süreleri, her hafta Sınıf Maçına kaç kez katıldığını gösterir.",
      ],
    ],
    handbuch:
      `Öğretmen kılavuzu güncel - "Sınıflarım" içinde "İndirmeler" altında, Yardım bölümünde (Alt + H) ya da hemen burada:`,
    verstanden: "Anladım",
  },
  // ★ O-CS (03.10.2026): „Co je nového"; liest nur die Lehrkraft - vy in der Mehrzahlform
  // (Regel 1), nie eine Vergangenheit, die ein Geschlecht verrät (Regel 2). Bereichs- und
  // Knopfnamen ohne Anführungszeichen, mit Kopfwort („sekce", „karta", „tlačítko", Regel 7);
  // „lekce" bleibt die Lektion, die Unterrichtsstunde heisst „vyučovací hodina" (§2.6); CVI
  // als „Větší mezery mezi znaky (CVI)" (§2.8). Kein Maus-Wort (Regel 8).
  cs: {
    titel: "Co je nového",
    einleitung:
      "Tastenflow má pro vyučující nový vzhled a nové nástroje. Tady je to nejdůležitější ve zkratce - toto okno se zobrazí jen jednou. Podrobně je vše popsáno v Nápovědě (Alt + H) a v příručce pro vyučující.",
    abschnitte: [
      [
        "Moje třídy - nová stránka",
        "Nahoře přepínáte mezi kartami Pokrok a Žáci a přístupy (přidávání žáků, přihlašovací údaje).",
        "Úkoly pro třídu jsou v jednom řádku: Výzva, Vlastní cvičení, Týdenní cíl, Nastavení třídy a Pozastavit cíl na hodinu.",
        "Nad tabulkou ukazuje Přehled třídy celou třídu - za Měsíc (poslední 4 týdny) nebo za Školní rok, s pruhem skóre a spojnicovým grafem skóre.",
        "Tabulka ukazuje Týden, Měsíc, Školní rok nebo Od začátku. Řádek každé osoby se rozbalí: nastavení, Výzvy, časy procvičování po týdnech, nejisté klávesy, odznaky.",
        "Vysvětlení se objeví jako tip, jakmile přejdete na tlačítko - například klávesou Tabulátor.",
      ],
      [
        "Týdenní cíle: minuty za týden",
        "V sekci Týdenní cíl nastavíte pro každé dítě minuty za týden - bez vyučovacích hodin. Tlačítko Použít pro celou třídu platí i pro žáky, kteří přibudou později.",
        "Týden trvá od pondělí 8:00 do dalšího pondělí 8:00 ráno. Změny platí od příštího pondělí.",
        "K tomu jsou tu tlačítka Dohnat minuty z minulých týdnů, Prominout týden a Vynulovat minuty k dohnání.",
        "Pozastavit cíl na hodinu: po dobu 60 minut se cvičení celé třídy nepočítá do týdenního cíle, do času procvičování ale ano - třeba během výuky.",
        "Tabulka i Přehled třídy ukazují v procentech, kolik je splněno. Týdenní přehled e-mailem přichází v pondělí ráno v nové podobě (zapíná se na kartě Žáci a přístupy).",
      ],
      [
        "Vlastní cvičení - jeden text pro celou třídu",
        "V sekci Vlastní cvičení vyberete text: nahrajte soubor (.txt nebo .docx), vezměte text ze sekce Moje texty nebo šablonu - texty dřívějších lekcí.",
        "Po stisknutí tlačítka Spustit vlastní cvičení dostane každé dítě okno a napíše text jednou svým tempem; pak cvičí normálně dál.",
        "Více cvičení přichází postupně, každé ve vlastním okně, a každé lze ukončit zvlášť.",
        "Stejné možnosti má i Výzva s vlastním textem.",
      ],
      [
        "Moje texty - vaše zásoba cvičení",
        "Moje texty jsou vaše vlastní úložiště textů ke cvičení - patří k účtu, ne ke třídě, a vidíte je jen vy.",
        "Při nahrávání uloží volba Uložit do sekce Moje texty kopii právě tam. Text tak použijete znovu - v sekci Vlastní cvičení i ve Výzvě.",
      ],
      [
        "Dále",
        "U každého dítěte je volba Větší mezery mezi znaky (CVI) - víc místa mezi znaky pro děti s cerebrálním zrakovým postižením (CVI). Dítě ji může změnit i samo ve svém nastavení.",
        "Časy procvičování každé osoby ukazují po týdnech počet účastí v Třídním závodu.",
      ],
    ],
    handbuch:
      "Příručka pro vyučující je aktuální - v sekci Moje třídy pod Ke stažení, v Nápovědě (Alt + H) nebo přímo tady:",
    verstanden: "Rozumím",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: "Какво ново",
      einleitung:
        "Tastenflow има нов вид и нови инструменти за учители. Ето най-важното накратко - този прозорец се появява само веднъж. Подробно всичко е описано в помощта (Alt + H) и в ръководството.",
      abschnitte: [
        [
          "„Моите класове“ - новата страница",
          "Горе превключвате между „Напредък“ и „Ученици и достъп“ (добавяне на ученици, данни за вход).",
          "Задачите за класа стоят в една лента: Предизвикателство, Собствено упражнение, Седмична цел, Настройки на класа и Спри за 1 час.",
          "Над таблицата прегледът на класа показва целия клас - за „Месец“ (последните 4 седмици) или за „Учебна година“, с лента с резултати и линейна диаграма на резултата.",
          "Таблицата показва Седмица, Месец, Учебна година или От началото. Редът на всеки ученик се разгъва: настройки, предизвикателства, време за упражнения по седмици, несигурни клавиши, значки.",
          "Обясненията се появяват като съвет, щом стигнете до бутон с клавиша Tab.",
        ],
        [
          "Седмични цели в минути",
          "В „Седмична цел“ задавате за всеки ученик минути на седмица - вече без единици. „Приложи за класа“ важи и за ученици, които се присъединят по-късно.",
          "Седмицата тече от понеделник в 8:00 до следващия понеделник в 8:00. Промените важат от следващия понеделник.",
          "Освен това има „Наваксай минутите от минали седмици“, „Освободи седмицата“ и „Нулирай минутите за наваксване“.",
          "„Спри за 1 час“: 60 минути упражненията на целия клас не се броят за седмичната цел, но се броят като време за упражнения - например в час.",
          "Таблицата и прегледът на класа показват в проценти колко е изпълнено. Седмичният отчет по имейл идва в понеделник сутрин, с нов вид (включва се в „Ученици и достъп“).",
        ],
        [
          "Собствено упражнение - един текст за целия клас",
          "В „Собствено упражнение“ избирате текста: качете файл (.txt или .docx), изберете текст от „Моите текстове“ или „Шаблон“ - текстовете на предишните уроци.",
          "След „Започни собственото упражнение“ всеки ученик получава прозорец и пише текста веднъж със своето темпо, а след това продължава с обичайните упражнения.",
          "Няколко упражнения идват едно след друго, всяко със свой прозорец, и всяко може да се приключи отделно.",
          "Същите възможности има и за Предизвикателство със собствен текст.",
        ],
        [
          "Моите текстове - вашият сбор от упражнения",
          "„Моите текстове“ е вашето собствено хранилище за текстове за упражнение - към акаунта, не към клас, и се вижда само от вас.",
          "При качване „Запиши в Моите текстове“ оставя копие там. Така използвате текста отново - в „Собствено упражнение“ и в Предизвикателството.",
        ],
        [
          "Още нещо",
          "За всеки ученик има „По-голямо разстояние между знаците (CVI)“ - повече място между знаците за деца с церебрално зрително увреждане. Детето може да го промени и в собствените си настройки.",
          "Времето за упражнения на всеки ученик показва по седмици броя на участията в Състезание в класа.",
        ],
      ],
      handbuch:
        "Ръководството за учители е обновено - в „Моите класове“ под „Изтегляния“, в помощта (Alt + H) или направо тук:",
      verstanden: "Разбрах",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titel: "Τι νέο υπάρχει",
      einleitung:
        "Το Tastenflow έχει νέα εμφάνιση και νέα εργαλεία για εκπαιδευτικούς. Εδώ τα πιο σημαντικά με λίγα λόγια - αυτό το παράθυρο εμφανίζεται μόνο μία φορά. Αναλυτικά τα βρίσκετε όλα στη βοήθεια (Alt + H) και στον οδηγό.",
      abschnitte: [
        [
          "«Τα τμήματά μου» - η νέα σελίδα",
          "Επάνω αλλάζετε ανάμεσα σε «Πρόοδος» και «Μαθητές και πρόσβαση» (προσθήκη παιδιών, στοιχεία σύνδεσης).",
          "Οι εργασίες για το τμήμα βρίσκονται σε μία γραμμή: Πρόκληση, Προσαρμοσμένη άσκηση, Εβδομαδιαίος στόχος, Ρυθμίσεις τμήματος και Παύση για 1 ώρα.",
          "Πάνω από τον πίνακα, η Επισκόπηση τμήματος δείχνει όλο το τμήμα - για τον «Μήνα» (τις τελευταίες 4 εβδομάδες) ή για το «Σχολικό έτος», με μπάρα σκορ και γράφημα γραμμών του σκορ.",
          "Ο πίνακας δείχνει Εβδομάδα, Μήνα, Σχολικό έτος ή Από την αρχή. Η γραμμή ενός παιδιού ανοίγει: ρυθμίσεις, Προκλήσεις, χρόνοι εξάσκησης ανά εβδομάδα, αβέβαια πλήκτρα, μετάλλια.",
          "Οι εξηγήσεις εμφανίζονται ως συμβουλή μόλις μεταβείτε σε ένα κουμπί, για παράδειγμα με το πλήκτρο Tab.",
        ],
        [
          "Εβδομαδιαίοι στόχοι σε λεπτά",
          "Στο «Εβδομαδιαίος στόχος» ορίζετε για κάθε παιδί λεπτά την εβδομάδα - χωρίς διδακτικές ώρες. Η «Εφαρμογή για όλο το τμήμα» ισχύει και για τα παιδιά που έρχονται αργότερα.",
          "Μια εβδομάδα διαρκεί από τη Δευτέρα στις 8:00 ως την επόμενη Δευτέρα στις 8:00. Οι αλλαγές ισχύουν από την επόμενη Δευτέρα.",
          "Υπάρχουν επίσης η «Αναπλήρωση λεπτών από προηγούμενες εβδομάδες», η «Απαλλαγή από την εβδομάδα» και ο «Μηδενισμός λεπτών για αναπλήρωση».",
          "«Παύση για 1 ώρα»: για 60 λεπτά η εξάσκηση όλου του τμήματος δεν μετράει για τον εβδομαδιαίο στόχο, μετράει όμως ως χρόνος εξάσκησης - για παράδειγμα την ώρα του μαθήματος στην τάξη.",
          "Ο πίνακας και η Επισκόπηση τμήματος δείχνουν σε ποσοστό πόσο έχει γίνει. Η εβδομαδιαία αναφορά με e-mail έρχεται τη Δευτέρα το πρωί, με νέα μορφή (ενεργοποίηση στο «Μαθητές και πρόσβαση»).",
        ],
        [
          "Προσαρμοσμένη άσκηση - ένα κείμενο για όλο το τμήμα",
          "Στην «Προσαρμοσμένη άσκηση» επιλέγετε το κείμενο: ανέβασμα αρχείου (.txt ή .docx), ένα κείμενο από τα «Τα κείμενά μου» ή ένα «Πρότυπο» - τα κείμενα των παλαιότερων μαθημάτων.",
          "Μετά την «Έναρξη άσκησης» κάθε παιδί παίρνει ένα παράθυρο και γράφει το κείμενο μία φορά με τον δικό του ρυθμό. Μετά συνεχίζει κανονικά την εξάσκηση.",
          "Περισσότερες ασκήσεις έρχονται η μία μετά την άλλη, η καθεμία με δικό της παράθυρο, και την καθεμία μπορείτε να την τελειώσετε χωριστά.",
          "Τους ίδιους δρόμους έχετε και για μια Πρόκληση με δικό σας κείμενο.",
        ],
        [
          "Τα κείμενά μου - η δική σας συλλογή ασκήσεων",
          "Τα «Τα κείμενά μου» είναι ο δικός σας χώρος για κείμενα εξάσκησης - ανήκει στον λογαριασμό σας, όχι σε ένα τμήμα, και τον βλέπετε μόνο εσείς.",
          "Στο ανέβασμα, η «Αποθήκευση στα Τα κείμενά μου» κρατά εκεί ένα αντίγραφο. Έτσι χρησιμοποιείτε το κείμενο ξανά, στην «Προσαρμοσμένη άσκηση» και στην Πρόκληση.",
        ],
        [
          "Επίσης",
          "Για κάθε παιδί υπάρχει η «Μεγαλύτερη απόσταση γραμμάτων (CVI)» - περισσότερος χώρος ανάμεσα στους χαρακτήρες για παιδιά με εγκεφαλική οπτική αναπηρία. Το παιδί μπορεί να την αλλάξει και μόνο του στις ρυθμίσεις του.",
          "Οι χρόνοι εξάσκησης ενός παιδιού δείχνουν ανά εβδομάδα πόσες φορές πήρε μέρος σε Αγώνα τμήματος.",
        ],
      ],
      handbuch:
        "Ο οδηγός για εκπαιδευτικούς είναι ενημερωμένος (στα Αγγλικά) - στα «Τα τμήματά μου» στα «Αρχεία για λήψη», στη βοήθεια (Alt + H) ή απευθείας εδώ:",
      verstanden: "Κατάλαβα",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      // Nur Lehrkräfte sehen es: ohne Anrede, ohne „Ön" (Glossar hu Regel 1). Statt „Zeiger" (Maus) nur der Fokus.
      titel: "Újdonságok",
      einleitung:
        "A Tastenflow új felületet és új eszközöket kapott a tanárok számára. Itt a legfontosabbak röviden - ez az ablak csak egyszer jelenik meg. Részletesen minden megtalálható a súgóban (Alt + H) és a kézikönyvben.",
      abschnitte: [
        [
          "„Osztályaim” - az új oldal",
          "Fent lehet váltani a „Haladás” és a „Tanulók és belépések” között (tanulók felvétele, belépési adatok).",
          "Az osztálynak szóló feladatok egy sorban állnak: Kihívás, Saját gyakorlat, Heti cél, Az osztály beállításai és Cél szüneteltetése egy órára.",
          "A táblázat fölött az osztályáttekintés az egész osztályt mutatja - a „Hónap” (az utolsó 4 hét) vagy a „Tanév” szerint, pontsávval és a pontszám vonaldiagramjával.",
          "A táblázat a hetet, a hónapot, a tanévet vagy a kezdettől eltelt időt mutatja. Egy tanuló sora lenyitható: beállítások, Kihívások, heti gyakorlási idők, bizonytalan billentyűk, jelvények.",
          "A magyarázatok tippként jelennek meg, amint a fókusz egy gombra kerül - például a Tab billentyűvel.",
        ],
        [
          "Heti célok percben",
          "A „Heti cél” résznél tanulónként heti percszám állítható be - foglalkozási egységek nélkül. Az „Alkalmaz az egész osztályra” a később érkező tanulókra is érvényes.",
          "Egy hét hétfő 8:00-tól a következő hétfő 8:00-ig tart. A módosítások a következő hétfőtől érvényesek.",
          "Emellett van „Elmaradt percek pótlása az előző hetekről”, „A hét elengedése” és „Pótlandó percek nullázása”.",
          "„Cél szüneteltetése egy órára”: 60 percig az egész osztály gyakorlása nem számít bele a heti célba, a gyakorlási időbe viszont igen - például tanórán.",
          "A táblázat és az osztályáttekintés százalékban mutatja, mennyi teljesült. A heti összesítő e-mail hétfő reggel érkezik, új felépítésben (bekapcsolás a „Tanulók és belépések” résznél).",
        ],
        [
          "Saját gyakorlat - egy szöveg az egész osztálynak",
          "A „Saját gyakorlat” résznél választható ki a szöveg: fájl feltöltése (.txt vagy .docx), egy szöveg a „Saját szövegeim” közül vagy egy „Sablon” - a korábbi leckék szövegei.",
          "A „Saját gyakorlat indítása” után minden tanuló kap egy ablakot, és a saját tempójában egyszer begépeli a szöveget; utána a szokásos módon gyakorol tovább.",
          "Több gyakorlat egymás után következik, mindegyik saját ablakkal, és mindegyik külön befejezhető.",
          "Ugyanezek a lehetőségek megvannak a saját szöveggel írt Kihíváshoz is.",
        ],
        [
          "Saját szövegeim - saját gyakorlószöveg-tár",
          "A „Saját szövegeim” a tanár saját tára a gyakorló szövegekhez - a fiókhoz tartozik, nem egy osztályhoz, és csak a tanár látja.",
          "Feltöltéskor a „Mentés a Saját szövegeim közé” egy másolatot tesz oda. Így a szöveg újra felhasználható a „Saját gyakorlat” résznél és a Kihívásnál.",
        ],
        [
          "Továbbá",
          "Tanulónként beállítható a „Nagyobb betűköz (CVI)” - nagyobb köz a karakterek között a cerebrális látássérüléssel (CVI) élő gyerekeknek. A tanuló a saját beállításaiban maga is megváltoztathatja.",
          "A tanuló „Gyakorlási idők” része hetenként mutatja, hányszor vett részt Osztályversenyen.",
        ],
      ],
      handbuch:
        "A tanári kézikönyv naprakész - az „Osztályaim” oldalon a „Letöltések” résznél, a súgóban (Alt + H) vagy közvetlenül itt:",
      verstanden: "Értem",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: "Wat is er nieuw",
      einleitung:
        "Tastenflow heeft voor leerkrachten een nieuwe opbouw en nieuwe functies. Hier het belangrijkste in het kort - dit venster verschijnt maar één keer. Alles staat uitgebreid in de help (Alt + H) en in de handleiding.",
      abschnitte: [
        [
          "\"Mijn klassen\" - de nieuwe pagina",
          "Bovenaan wissel je tussen \"Voortgang\" en \"Leerlingen en toegang\" (leerlingen toevoegen, inloggegevens).",
          "De opdrachten voor de klas staan in één balk: Uitdaging, Eigen oefening, Weekdoel, Klasinstellingen en 1 uur pauzeren.",
          "Boven de tabel laat het klasoverzicht de hele klas zien - voor de \"Maand\" (de laatste 4 weken) of het \"Schooljaar\", met een scorebalk en een lijndiagram van de score.",
          "De tabel toont Week, Maand, Schooljaar of Vanaf het begin. De regel van een leerling klapt open: instellingen, Uitdagingen, oefentijden per week, onzekere toetsen, medailles.",
          "Uitleg verschijnt als tip zodra je naar een knop gaat, bijvoorbeeld met de Tab-toets.",
        ],
        [
          "Weekdoelen in minuten",
          "Bij \"Weekdoel\" stel je per leerling minuten per week in - zonder eenheden. \"Toepassen op de hele klas\" geldt ook voor leerlingen die later bij de klas komen.",
          "Een week loopt van maandag 8.00 uur tot maandag 8.00 uur. Wijzigingen gelden vanaf de volgende maandag.",
          "Daarnaast zijn er \"Gemiste minuten van vorige weken inhalen\", \"Vrijstellen van het weekdoel\" en \"Achterstallige minuten wissen\".",
          "\"1 uur pauzeren\": 60 minuten lang telt het oefenen van de hele klas niet voor het weekdoel, wel als oefentijd - bijvoorbeeld tijdens het lesuur.",
          "De tabel en het klasoverzicht tonen in procenten hoeveel er gehaald is. Het weekverslag per e-mail komt op maandagochtend, met een nieuwe opbouw (aanzetten bij \"Leerlingen en toegang\").",
        ],
        [
          "Eigen oefening - één tekst voor de hele klas",
          "Bij \"Eigen oefening\" kies je de tekst: een bestand uploaden (.txt of .docx), een tekst uit \"Mijn teksten\" of een \"Sjabloon\" - de teksten van de vroegere lessen.",
          "Na \"Eigen oefening starten\" krijgt elke leerling een venster en typt de tekst één keer in het eigen tempo; daarna gaat het oefenen gewoon verder.",
          "Meerdere oefeningen komen na elkaar, elk met een eigen venster, en elke oefening kun je apart stoppen.",
          "Dezelfde mogelijkheden zijn er voor een Uitdaging met een eigen tekst.",
        ],
        [
          "Mijn teksten - je eigen verzameling oefenteksten",
          "\"Mijn teksten\" is je eigen opslag voor oefenteksten - bij je account, niet bij een klas, en alleen voor jou zichtbaar.",
          "Bij het uploaden bewaart \"Opslaan in Mijn teksten\" daar een kopie. Zo gebruik je de tekst opnieuw, in \"Eigen oefening\" en in de Uitdaging.",
        ],
        [
          "Verder",
          "Per leerling is er \"Brede letterafstand (CVI)\" - meer ruimte tussen de tekens voor kinderen met CVI (cerebrale visuele inperking). De leerling kan het ook zelf veranderen in de eigen instellingen.",
          "Bij de oefentijden van een leerling zie je per week hoe vaak er aan een klassenwedstrijd is meegedaan.",
        ],
      ],
      handbuch:
        "De handleiding voor leerkrachten is bijgewerkt - in \"Mijn klassen\" bij \"Downloads\", in de help (Alt + H) of meteen hier:",
      verstanden: "Begrepen",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: "Novidades",
      einleitung:
        "O Tastenflow tem um novo aspeto e novas ferramentas para docentes. Aqui fica o mais importante em resumo - esta janela aparece só uma vez. Tudo em pormenor está na ajuda (Alt + H) e no guia.",
      abschnitte: [
        [
          "\"As minhas turmas\" - a nova página",
          "Em cima, alterne entre \"Progressos\" e \"Estudantes e acessos\" (adicionar pessoas, dados de acesso).",
          "As tarefas para a turma estão numa só linha: Desafio, Exercício personalizado, Objetivo semanal, Definições da turma e Suspender 1 hora.",
          "Por cima da tabela, a visão geral da turma mostra a turma inteira - para o \"Mês\" (as últimas 4 semanas) ou o \"Ano letivo\", com barra de pontuação e gráfico de linhas da pontuação.",
          "A tabela mostra Semana, Mês, Ano letivo ou Desde o início. A linha de cada pessoa expande-se: definições, Desafios, tempos de prática por semana, teclas em consolidação, medalhas.",
          "As explicações aparecem como dica assim que se chega a um botão - com a tecla de tabulação ou com o ponteiro.",
        ],
        [
          "Objetivos semanais em minutos",
          "Em \"Objetivo semanal\", defina para cada pessoa os minutos por semana - já sem unidades. \"Aplicar à turma\" vale também para as pessoas que entrarem mais tarde.",
          "Uma semana vai de segunda-feira às 08:00 até à segunda-feira seguinte às 08:00. As alterações aplicam-se a partir da segunda-feira seguinte.",
          "Há ainda \"Recuperar os minutos das semanas anteriores\", \"Dispensar a semana\" e \"Repor a zero os minutos em atraso\".",
          "\"Suspender 1 hora\": durante 60 minutos, a prática de toda a turma não conta para o objetivo semanal, mas conta como tempo de prática - por exemplo, durante a aula.",
          "A tabela e a visão geral da turma mostram em percentagem quanto foi cumprido. O resumo semanal por e-mail chega na segunda-feira de manhã, com nova estrutura (ative-o em \"Estudantes e acessos\").",
        ],
        [
          "Exercício personalizado - um texto para toda a turma",
          "Em \"Exercício personalizado\", escolha o texto: carregar um ficheiro (.txt ou .docx), um texto de \"Os meus textos\" ou um \"Modelo\" - os textos das antigas lições.",
          "Depois de \"Começar o exercício personalizado\", cada pessoa recebe uma janela e escreve o texto uma vez, ao seu ritmo; depois continua a praticar normalmente.",
          "Vários exercícios vêm uns a seguir aos outros, cada um com a sua janela, e cada um pode ser terminado separadamente.",
          "As mesmas fontes existem para um Desafio com texto próprio.",
        ],
        [
          "Os meus textos - a sua coleção de exercícios",
          "\"Os meus textos\" é o seu arquivo de textos de prática - fica na sua conta, não numa turma, e só é visível para si.",
          "Ao carregar um ficheiro, \"Guardar em Os meus textos\" guarda lá uma cópia. Assim pode voltar a usar o texto em \"Exercício personalizado\" e no Desafio.",
        ],
        [
          "Também novo",
          "Para cada pessoa há \"Espaçamento largo (CVI)\" - mais espaço entre os carateres para crianças com deficiência visual cerebral. Cada pessoa também o pode alterar nas suas próprias definições.",
          "Os tempos de prática de cada pessoa mostram, por semana, quantas vezes participou numa Corrida da turma.",
        ],
      ],
      handbuch:
        "O guia para docentes está atualizado - em \"As minhas turmas\", em \"Transferências\", na ajuda (Alt + H) ou aqui mesmo:",
      verstanden: "Entendido",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titel: "Novidades",
      einleitung:
        "O Tastenflow tem um visual novo e ferramentas novas para docentes. Aqui está o principal, em resumo - esta janela aparece só uma vez. Tudo em detalhes está na ajuda (Alt + H) e no manual.",
      abschnitte: [
        [
          "Minhas turmas - a nova página",
          "No alto, você alterna entre Progresso e Estudantes e acessos (adicionar pessoas, dados de acesso).",
          "As atividades para a turma ficam em uma linha: Desafio, Exercício personalizado, Meta semanal, Configurações da turma e Pausar por 1 hora.",
          "Acima da tabela, a visão geral da turma mostra a turma inteira - no Mês (as últimas 4 semanas) ou no Ano letivo, com barra de pontuação e gráfico de linhas da pontuação.",
          "A tabela mostra Semana, Mês, Ano letivo ou Desde o início. A linha de cada pessoa se expande: configurações, Desafios, tempos de prática por semana, teclas inseguras, medalhas.",
          "As explicações aparecem como dica assim que você chega a um botão com a tecla Tab.",
        ],
        [
          "Metas semanais em minutos",
          "Em Meta semanal, você define os minutos por semana para cada pessoa - sem unidades. Aplicar à turma vale também para quem entrar depois.",
          "Uma semana vai de segunda-feira às 8h até a segunda-feira seguinte às 8h. As mudanças valem a partir da próxima segunda-feira.",
          "Além disso, existem Recuperar os minutos das semanas anteriores, Dispensar a semana e Zerar os minutos atrasados.",
          "Pausar por 1 hora: durante 60 minutos, a prática da turma inteira não conta para a meta semanal, mas conta como tempo de prática - por exemplo, durante a aula.",
          "A tabela e a visão geral da turma mostram em porcentagem quanto foi cumprido. O resumo semanal por e-mail chega na segunda-feira de manhã, com um formato novo (ative em Estudantes e acessos).",
        ],
        [
          "Exercício personalizado - um texto para a turma inteira",
          "Em Exercício personalizado, você escolhe o texto: carregar um arquivo (.txt ou .docx), um texto de Meus textos ou um Modelo - os textos das lições anteriores.",
          "Depois de Começar o exercício personalizado, cada pessoa recebe uma janela e digita o texto uma vez, no próprio ritmo; depois continua praticando normalmente.",
          "Vários exercícios vêm um depois do outro, cada um com a sua janela, e cada um pode ser encerrado separadamente.",
          "As mesmas opções existem para um Desafio com texto próprio.",
        ],
        [
          "Meus textos - o seu acervo de exercícios",
          "Meus textos é o seu acervo pessoal de textos de prática - fica na sua conta, não em uma turma, e só você vê.",
          "Ao carregar um arquivo, Salvar em Meus textos guarda uma cópia ali. Assim você usa o texto de novo, em Exercício personalizado e no Desafio.",
        ],
        [
          "Também novo",
          "Para cada pessoa existe Espaço maior entre letras (DVC) - mais espaço entre os caracteres para crianças com deficiência visual cortical. A própria pessoa também pode mudar isso nas configurações dela.",
          "Os tempos de prática de cada pessoa mostram, por semana, quantas vezes ela participou da Competição da turma.",
        ],
      ],
      handbuch:
        "O manual para docentes está atualizado - em Minhas turmas, em Downloads, na ajuda (Alt + H) ou aqui mesmo:",
      verstanden: "Entendi",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titel: "Noutăți",
      einleitung:
        "Tastenflow are pentru cadrele didactice un aspect nou și instrumente noi. Iată pe scurt ce este important - această fereastră apare o singură dată. Totul este explicat pe larg în Ajutor (Alt + H) și în ghid.",
      abschnitte: [
        [
          "„Clasele mele” - pagina nouă",
          "Sus comutați între „Progres” și „Elevi și conturi” (adăugarea elevilor, datele de conectare).",
          "Sarcinile pentru clasă stau într-un singur rând: Provocare, Exercițiu propriu, Obiectiv săptămânal, Setările clasei și Suspendați o oră.",
          "Deasupra tabelului, Prezentarea clasei arată toată clasa - pentru „Lună” (ultimele patru săptămâni) sau pentru „An școlar”, cu bara scorului și un grafic liniar al scorului.",
          "Tabelul arată Săptămână, Lună, An școlar sau De la început. Rândul unei persoane se deschide: setări, Provocări, timpii de exersare pe săptămână, taste nesigure, medalii.",
          "Explicațiile apar ca sfat imediat ce ajungeți la un buton - de exemplu cu tasta Tab.",
        ],
        [
          "Obiectivul săptămânal: minute pe săptămână",
          "La „Obiectiv săptămânal” stabiliți pentru fiecare persoană minute pe săptămână - fără unități. „Aplicați pentru toată clasa” este valabil și pentru elevii care vin mai târziu.",
          "O săptămână ține de luni de la ora 8:00 până lunea următoare la ora 8:00. Schimbările se aplică de lunea următoare.",
          "În plus există „Recuperați minutele din săptămânile trecute”, „Scutiți săptămâna” și „Resetați minutele restante”.",
          "„Suspendați o oră”: timp de o oră, exersarea întregii clase nu se socotește pentru obiectivul săptămânal, dar se socotește ca timp de exersare - de exemplu în timpul orei de curs.",
          "Tabelul și Prezentarea clasei arată în procente cât s-a realizat. Raportul săptămânal prin e-mail vine luni dimineața, construit din nou (se activează la „Elevi și conturi”).",
        ],
        [
          "Exercițiu propriu - un text pentru toată clasa",
          "La „Exercițiu propriu” alegeți textul: încărcați un fișier (.txt sau .docx), un text din „Textele mele” sau un „Șablon” - textele lecțiilor de mai înainte.",
          "După „Începeți exercițiul propriu”, fiecare persoană primește o fereastră și scrie textul o dată, în ritmul ei; apoi exersează mai departe ca de obicei.",
          "Mai multe exerciții vin unul după altul, fiecare cu fereastra lui, și fiecare se poate încheia separat.",
          "Aceleași căi există și pentru o Provocare cu un text propriu.",
        ],
        [
          "Textele mele - colecția dumneavoastră de exerciții",
          "„Textele mele” este locul dumneavoastră pentru textele de exersat - legat de cont, nu de o clasă, și vizibil doar pentru dumneavoastră.",
          "La încărcare, „Salvați în Textele mele” păstrează acolo o copie. Așa folosiți textul din nou, în „Exercițiu propriu” și în Provocare.",
        ],
        [
          "Tot nou",
          "Pentru fiecare persoană există „Spațiere mare între caractere (CVI)” - mai mult spațiu între caractere pentru copiii cu deficiență de vedere de origine cerebrală. Persoana o poate schimba și singură, în setările ei.",
          "Timpii de exersare ai unei persoane arată pe săptămâni de câte ori a participat la Întrecerea clasei.",
        ],
      ],
      handbuch:
        "Ghidul pentru cadre didactice este actualizat - în „Clasele mele” la „Descărcări”, în Ajutor (Alt + H) sau chiar aici:",
      verstanden: "Am înțeles",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: "Nyheter",
      einleitung:
        "Tastenflow har ett nytt utseende och nya verktyg för lärare. Här är det viktigaste i korthet - det här fönstret visas bara en gång. Allt finns utförligt i hjälpen (Alt + H) och i handboken.",
      abschnitte: [
        [
          "Mina klasser - den nya sidan",
          "Högst upp växlar du mellan Framsteg och Elever och inloggningar (lägga till elever, inloggningsuppgifter).",
          "Uppgifterna för klassen står i en rad: Utmaningen, Egna övningar, Veckomål, Klassens inställningar och Pausa en timme.",
          "Ovanför tabellen visar Klassöversikt hela klassen - för Månad (de senaste 4 veckorna) eller Läsår, med poängstapel och linjediagram över poängen.",
          "Tabellen visar Vecka, Månad, Läsår eller Från början. Fäll ut en elevs rad för inställningar, Utmaningar, övningstider per vecka, osäkra tangenter och märken.",
          "Förklaringar visas som tips så fort du går till en knapp, till exempel med Tabb.",
        ],
        [
          "Veckomål i minuter",
          "Under Veckomål ställer du in minuter per vecka för varje elev - inga enheter längre. Använd för hela klassen gäller också elever som går med senare.",
          "En vecka går från måndag klockan 08:00 till nästa måndag klockan 08:00. Ändringar gäller från nästa måndag.",
          "Dessutom finns Ta igen minuter från tidigare veckor, Undanta veckan och Nollställ minuter att ta igen.",
          "Pausa målet i en timme: i 60 minuter räknas hela klassens övning inte till veckomålet, men den räknas ändå som övningstid - till exempel under lektionen.",
          "Tabellen och Klassöversikt visar i procent hur mycket som är klart. Veckorapporten via e-post kommer på måndagsmorgonen, i ny form (slå på den under Elever och inloggningar).",
        ],
        [
          "Egna övningar - en text för hela klassen",
          "Under Egna övningar väljer du texten: ladda upp en fil (.txt eller .docx), välj en text från Mina texter eller en mall - texterna från de tidigare lektionerna.",
          "När du har valt Börja övningen får varje elev ett fönster och skriver texten en gång i sin egen takt; sedan övar eleven vidare som vanligt.",
          "Flera övningar kommer i tur och ordning, var och en med eget fönster, och varje övning går att avsluta för sig.",
          "Samma vägar finns för en Utmaning med egen text.",
        ],
        [
          "Mina texter - din samling av övningstexter",
          "Mina texter är din egen plats för övningstexter - kopplad till ditt konto, inte till en klass, och bara synlig för dig.",
          "När du laddar upp en fil sparar Spara i Mina texter en kopia där. Då kan du använda texten igen, i Egna övningar och i Utmaningen.",
        ],
        [
          "Dessutom",
          "För varje elev finns Större avstånd mellan tecknen (CVI) - mer avstånd mellan tecknen för elever med cerebral synnedsättning. Eleven kan också ändra det själv i sina inställningar.",
          "En elevs övningstider visar för varje vecka hur ofta eleven har varit med i Klasstävlingen.",
        ],
      ],
      handbuch:
        "Handboken för lärare är uppdaterad - under Mina klasser vid Att ladda ned, i hjälpen (Alt + H) eller direkt här:",
      verstanden: "Jag förstår",
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      titel: "Що нового",
      einleitung:
        "Tastenflow має для педагогів новий вигляд і нові інструменти. Тут коротко найважливіше - це вікно з'являється лише один раз. Докладно все описано в довідці (Alt + H) і в посібнику.",
      abschnitte: [
        [
          "«Мої класи» - нова сторінка",
          "Угорі ви перемикаєтеся між розділами «Поступ» і «Учні й доступи» (додавання дітей, дані для входу).",
          "Завдання для класу зібрано в одному рядку: Виклик, Власна вправа, Тижнева мета, Налаштування класу і Пауза на 1 годину.",
          "Над таблицею Огляд класу показує весь клас - за «Місяць» (останні 4 тижні) або за «Навчальний рік», зі шкалою балів і лінійним графіком балів.",
          "Таблиця показує Тиждень, Місяць, Навчальний рік або Від початку. Рядок дитини розгортається: налаштування, Виклики, час тренування по тижнях, непевні клавіші, медалі.",
          "Пояснення з'являються як підказка, щойно ви переходите до кнопки - клавішею Tab або вказівником.",
        ],
        [
          "Тижнева мета: хвилини на тиждень",
          "У розділі «Тижнева мета» ви задаєте для кожної дитини хвилини на тиждень - без одиниць. «Застосувати для класу» діє і для дітей, які приєднаються пізніше.",
          "Тиждень триває з понеділка 8:00 до наступного понеділка 8:00. Зміни діють з наступного понеділка.",
          "Крім того, є «Надолужити хвилини попередніх тижнів», «Звільнити від тижневої мети» і «Скинути хвилини для надолуження».",
          "«Пауза на 1 годину»: протягом 60 хвилин тренування всього класу не зараховується до тижневої мети, але зараховується як час тренування - наприклад, під час шкільного уроку.",
          "Таблиця й Огляд класу показують у відсотках, скільки виконано. Тижневий звіт електронною поштою приходить у понеділок уранці, у новому вигляді (увімкнути можна в розділі «Учні й доступи»).",
        ],
        [
          "Власна вправа - один текст для всього класу",
          "У розділі «Власна вправа» ви вибираєте текст: додати файл (.txt або .docx), текст із «Мої тексти» або «Шаблон» - тексти колишніх уроків.",
          "Після «Почати власну вправу» кожна дитина отримує вікно й один раз друкує текст у власному темпі; потім тренується далі як завжди.",
          "Кілька вправ ідуть одна за одною, кожна у своєму вікні, і кожну можна завершити окремо.",
          "Ті самі способи є і для Виклику з власним текстом.",
        ],
        [
          "Мої тексти - ваша збірка вправ",
          "«Мої тексти» - ваше власне сховище текстів для вправ: воно належить до облікового запису, а не до класу, і видиме лише вам.",
          "Під час додавання файлу «Зберегти в Мої тексти» зберігає там копію. Так ви можете використати текст знову - у «Власній вправі» і у Виклику.",
        ],
        [
          "Також нове",
          "Для кожної дитини є «Широкі інтервали (CVI)» - більше місця між знаками для дітей з церебральним порушенням зору. Дитина може змінити це й сама у своїх налаштуваннях.",
          "Час тренування дитини показує для кожного тижня, скільки разів вона брала участь у Перегонах класу.",
        ],
      ],
      handbuch:
        "Посібник для педагогів оновлено - у «Мої класи» в розділі «Завантаження», у довідці (Alt + H) або просто тут:",
      verstanden: "Зрозуміло",
    },
});

/**
 * Die Marke im Fenster - an ihr erkennt es sich selbst unter allen offenen
 * Fenstern. ⚠️ Steht unten im JSX wörtlich (`data-neuigkeiten-fenster`).
 */
const MARKE = "data-neuigkeiten-fenster";

/** Ist gerade ein ANDERES modales Fenster offen (Hilfe, Spendenbanner …)? */
function fremdesFensterOffen(): boolean {
  return Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]')).some(
    (d) => !d.querySelector(`[${MARKE}]`),
  );
}

export function NeuigkeitenFenster({
  ort,
  programm,
}: {
  /** Wo das Fenster hängt - siehe Dateikopf. */
  ort: "meine-klassen" | "ueben";
  /** Nur bei „meine-klassen": das Programm aus Pfad oder `?app=` (`herkunft?.key`). */
  programm?: string | null;
}) {
  const account = useTypingAuth((s) => s.account);
  const location = useLocation();
  const navigate = useNavigate();
  const { sprache } = useBedienSprache();
  // ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): am Mac „Wahl" statt „Alt" im Text (`wahlTexte`).
  const t = wahlTexte(NEUIGKEITEN_TEXTE[sprache], sprache);
  const rundgangWuenschen = useRundgangWunsch((s) => s.wuenschen);

  const hierRichtig =
    ort === "ueben"
      ? !!(location.state as { selbstUeben?: boolean } | null)?.selbstUeben
      : programm === "tippen" || (!programm && hierIstTastenflow());
  const kontoId = account?.role === "lehrkraft" ? account.id : null;
  const erstelltImKonto = account?.createdAt ?? 0;

  /** Für WELCHES Konto das Fenster offen ist - ein Kontowechsel schliesst es. */
  const [offenFuer, setOffenFuer] = useState<string | null>(null);
  const [fremdesOffen, setFremdesOffen] = useState(false);
  const einleitungRef = useRef<HTMLParagraphElement>(null);
  /** `body.style.overflow` vor dem ersten Öffnen - siehe `schliessen`. */
  const overflowVorher = useRef<string | null>(null);

  // ── Soll es erscheinen? Einmal je Konto und Seite gefragt. ────────────────
  useEffect(() => {
    if (!hierRichtig || !kontoId) return;
    let lebt = true;
    void (async () => {
      let stand: { gesehen: string; erstelltMs: number } | null = null;
      try {
        stand = await typingBackend().getNeuigkeitenStand(kontoId);
      } catch {
        stand = null;
      }
      if (!lebt) return;
      const entscheid = neuigkeitenEntscheiden({
        rolle: "lehrkraft",
        // Frisch vom Server, sonst das Datum aus der Sitzung.
        erstelltMs: stand?.erstelltMs || erstelltImKonto,
        serverGesehen: stand ? stand.gesehen : null,
        lokalGesehen: neuigkeitenLokalLesen(kontoId),
      });
      if (entscheid === "nachtragen") {
        // Das Gerät hat es schon quittiert, der Server (noch) nicht - still nachholen.
        void typingBackend().setNeuigkeitenGesehen(kontoId, NEUIGKEITEN_FASSUNG);
      } else if (entscheid === "zeigen") {
        if (overflowVorher.current === null) overflowVorher.current = document.body.style.overflow;
        setOffenFuer(kontoId);
      }
    })();
    return () => {
      lebt = false;
    };
  }, [hierRichtig, kontoId, erstelltImKonto]);

  // ── Ein anderes Fenster hat Vorrang (siehe Dateikopf). ─────────────────────
  const soll = offenFuer !== null && offenFuer === kontoId;
  useEffect(() => {
    if (!soll) return;
    const pruefe = () => setFremdesOffen(fremdesFensterOffen());
    pruefe();
    const beobachter = new MutationObserver(pruefe);
    beobachter.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["role", "aria-modal"],
    });
    return () => beobachter.disconnect();
  }, [soll]);

  // Trat dieses Fenster gerade zurück, holt sein Schliessen den Fokus auf die
  // Seite (`Modal`) - er gehört aber in das Fenster, das jetzt vorn steht.
  useEffect(() => {
    if (!soll || !fremdesOffen) return;
    const zeitgeber = window.setTimeout(() => {
      const vorn = Array.from(
        document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'),
      ).find((d) => !d.querySelector(`[${MARKE}]`));
      if (vorn && !vorn.contains(document.activeElement)) vorn.focus();
    }, 0);
    return () => window.clearTimeout(zeitgeber);
  }, [soll, fremdesOffen]);

  if (!soll || !kontoId || fremdesOffen) return null;

  function schliessen() {
    // ⚠️ Solange ein anderes Fenster vorn steht, gilt ein Escape IHM.
    if (fremdesFensterOffen()) return;
    const id = kontoId!;
    // Zuerst auf dem Gerät merken - scheitert der Server, bleibt es hier zu,
    // und beim nächsten Öffnen wird nachgeschrieben (`"nachtragen"`).
    neuigkeitenLokalMerken(id, NEUIGKEITEN_FASSUNG);
    void typingBackend()
      .setNeuigkeitenGesehen(id, NEUIGKEITEN_FASSUNG)
      .catch(() => false);
    setOffenFuer(null);
    const overflow = overflowVorher.current;
    window.setTimeout(() => {
      // Zwei Fenster, die nicht in umgekehrter Reihenfolge schliessen (dieses
      // trat zurück und kam wieder), stellen `body.style.overflow` auf den
      // Stand des jeweils anderen zurück - die Seite liesse sich danach nicht
      // mehr rollen. Ist kein Fenster mehr offen, gilt der Stand von vorher.
      if (
        overflow !== null &&
        !document.querySelector('[role="dialog"][aria-modal="true"]') &&
        document.body.style.overflow !== overflow
      )
        document.body.style.overflow = overflow;
      // Stand der Fokus vor dem Fenster nirgends: auf die Hauptüberschrift.
      const aktiv = document.activeElement;
      if (!aktiv || aktiv === document.body) {
        const titel = document.getElementById("seitentitel");
        if (titel) {
          if (!titel.hasAttribute("tabindex")) titel.setAttribute("tabindex", "-1");
          titel.focus({ preventScroll: true });
        }
      }
    }, 0);
  }

  const handbuch = handbuecherFuer("tippen")[0];

  return (
    <Modal title={t.titel} onClose={schliessen} size="lg" initialFocus={einleitungRef}>
      <div data-neuigkeiten-fenster="" className="space-y-4 text-ink">
        <p ref={einleitungRef} tabIndex={-1} className="m-0 outline-none">
          {t.einleitung}
        </p>
        {t.abschnitte.map(([ueberschrift, ...punkte], i) => (
          <section key={i} className="space-y-1">
            <h3 className="m-0 text-base font-semibold text-ink">{ueberschrift}</h3>
            <ul className="m-0 list-disc space-y-1 pl-5 text-ink-soft">
              {punkte.map((satz, j) => (
                <li key={j}>{satz}</li>
              ))}
              {/* Der letzte Abschnitt endet mit dem Handbuch - samt Knopf. */}
              {i === t.abschnitte.length - 1 && (
                <li>
                  {t.handbuch}
                  {/* Eigene Zeile, linksbündig - ein umbrechender Knopf stünde sonst mittig. */}
                  {handbuch && (
                    <div className="mt-1 [&>button]:text-left">
                      <HandbuchKnopf alsLink handbuch={handbuch} />
                    </div>
                  )}
                </li>
              )}
            </ul>
          </section>
        ))}
        <p className="m-0 flex flex-wrap gap-2 pt-2">
          <button type="button" className="btn-primary" onClick={schliessen}>
            {t.verstanden}
          </button>
          {/* ★ Z4 (19.09.2026): schliesst das Fenster (gilt als gesehen) und
              zeigt die neue Oberfläche Schritt für Schritt - den Rundgang, den
              eine NEUE Lehrkraft beim ersten Besuch von selbst bekommt. Von
              der Übungsseite aus führt er nach „Meine Klassen". */}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              schliessen();
              rundgangWuenschen("meine-klassen");
              if (ort === "ueben") navigate(meineKlasseHref("tippen"));
            }}
          >
            <span aria-hidden="true">👉</span>{" "}
            {ort === "ueben"
              ? RUNDGANG_TEXTE[sprache].durchMeineKlassen
              : RUNDGANG_TEXTE[sprache].durchDieSeite}
          </button>
        </p>
      </div>
    </Modal>
  );
}
