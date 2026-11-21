/**
 * ★★ HINWEISE FÜR LEHRKRÄFTE ZUR DIDAKTIK (D-9, Didaktik-Entscheidung 27./28.09.2026).
 *
 * Wie oft und wie lange üben, welches Tempo man erwarten darf, warum
 * Tastenflow die Tasten in dieser Reihenfolge bringt, Genauigkeit vor Tempo.
 * Grundlage: `recherche-didaktik-2026-09-27/` (je Sprache §0).
 *
 * ★ EINE Quelle für ZWEI Stellen: die Lehrkraft-Hilfe (`LehrerHilfe*.tsx`,
 * Abschnitt 4b) und das Handbuch (Kapitel 4, alle vier Sprachen). Zwei
 * Fassungen desselben Absatzes liefen beim nächsten Nachbessern auseinander.
 *
 * ★ Jede Sprache ist in ihrer Sprache NEU geschrieben, mit den Zahlen IHRES
 * Raums (Schweiz/Bayern · New South Wales · Québec · Spanien/Mexiko) - nichts
 * ist übersetzt.
 *
 * ★ Die Kennzahlen aus Tastenflow selbst kommen aus dem Code: die Schwelle
 * „sitzt" ({@link TARGET_ACC}) und das erste Tempo-Ziel ({@link LV_STEP2_CPM}).
 *
 * ★ Kein anderes Programm wird beim Namen genannt (Hausregel des Handbuchs,
 * „nur Tastenflow") - Quellen sind Behörden, Lehrpläne, Fachbücher und
 * Fachverbände.
 *
 * ⚠️⚠️ Der Satz über Punkt und Komma „direkt nach der Umschalttaste" stimmt
 * erst, wenn D-1 (neue Reihenfolge) gebaut ist. Er steht im Punkt
 * „reihenfolge" und darf NICHT vor D-1 live gehen (BEFUND-2026-09-28-DA2-DIDAKTIK-HILFE.md).
 */
import type { Lang } from "./account";
import { TARGET_ACC } from "./letters";
import { LV_STEP2_CPM } from "./level";
import { WACKLIG_MIND_ANSCHLAEGE, wackligProzent, wackligSchwelleText } from "./wacklig";

export interface DidaktikPunkt {
  /** Schlüssel für Wächter und Handbuch. */
  id: "dauer" | "genauigkeit" | "tempo" | "reihenfolge" | "grundstellung" | "blindheit";
  /** Der fette Anfang des Absatzes. */
  kopf: string;
  text: string;
}

export interface DidaktikHinweise {
  titel: string;
  punkte: readonly DidaktikPunkt[];
  quellenKopf: string;
  quellen: readonly string[];
}

/** Die Schwelle „sitzt" in Prozent - aus dem Code. */
export const SITZT_PROZENT = Math.round(TARGET_ACC * 100);
/** Das erste Tempo-Ziel (Leistungsstufe 2) in Anschlägen je Minute - aus dem Code. */
export const ERSTES_TEMPO_ZIEL = LV_STEP2_CPM;

const P = SITZT_PROZENT;
const T = ERSTES_TEMPO_ZIEL;
/** ★ D-4/D-5 (28.09.2026): „wacklig" - Mindestzahl und Schwelle aus wacklig.ts. */
const W = WACKLIG_MIND_ANSCHLAEGE;

const HINWEISE: Record<Lang, DidaktikHinweise> = {
  de: {
    titel: "Für den Unterricht: wie oft, wie lange, wie schnell",
    punkte: [
      {
        id: "dauer",
        kopf: "Oft und kurz.",
        text:
          "10 bis 20 Minuten am Stück, mehrmals pro Woche - lieber jeden Tag kurz als einmal lang; " +
          "für jüngere Kinder eher 10 Minuten. Bis alle Buchstaben sitzen, braucht eine Klasse etwa " +
          "7 bis 16 Stunden reine Übungszeit, verteilt über Wochen.",
      },
      {
        id: "genauigkeit",
        kopf: "Genauigkeit vor Tempo.",
        text:
          `Eine Taste gilt in Tastenflow als sicher ab ${P} % Treffsicherheit. Tempo verlangt das ` +
          `Programm erst nach und nach: Das Tempo-Ziel beginnt bei ${T} Anschlägen je Minute und ` +
          "steigt mit der Leistungsstufe. Wer langsam und sicher beginnt, erreicht das Ziel insgesamt " +
          "schneller - das zeigen Schweizer Auswertungen von über 100 000 Schullektionen. " +
          `In der Liste „Wacklige Tasten“ steht eine Taste erst ab ${W} Anschlägen und nur unter ` +
          `${wackligSchwelleText("de", "de")} Treffsicherheit - bei wenigen Anschlägen misst die Zahl Zufall.`,
      },
      {
        id: "tempo",
        kopf: "Richtwerte für das Tempo.",
        text:
          "Eine Orientierung, keine Hürde: In der Schweiz gelten in der 4. und 5. Klasse 35, in der " +
          "6. Klasse 50 Anschläge je Minute bei 95 % Treffsicherheit als genügend. An bayerischen " +
          "Realschulen sind es mindestens 80 Anschläge je Minute am Ende des Anfangsunterrichts und " +
          "120 am Ende des Aufbauunterrichts. Für die Grundschule nennen Deutschland und Österreich " +
          "keine amtliche Zahl. Der Lehrplan 21 verlangt, die Tastatur geläufig und ergonomisch zu " +
          "nutzen - die „blinde, perfekte Beherrschung“ ist ausdrücklich nicht Ziel der Volksschule.",
      },
      {
        id: "reihenfolge",
        kopf: "Warum diese Reihenfolge.",
        text:
          "„Mein Training“ bringt nach der Grundreihe die häufigsten Buchstaben zuerst - so entstehen " +
          "früh echte Wörter; fast dieselbe Reihenfolge nutzen verbreitete deutschsprachige " +
          "Tastschreib-Trainer. Die Vorlagen in „Eigene Übung“ folgen den Tastaturreihen, wie die " +
          "Lehrmittel vieler Schweizer Kantone. Beides sind anerkannte Wege; kein Land schreibt eine " +
          "Reihenfolge vor. Punkt und Komma kommen direkt nach der Umschalttaste: Ein Satz braucht " +
          "einen Großbuchstaben am Anfang und einen Punkt am Ende - beides lernt das Kind zusammen.",
      },
      {
        id: "grundstellung",
        kopf: "Grundstellung prüfen.",
        text:
          "Unter „Wortspiele“ (Alt + B wechselt dorthin) steht „Grundstellung prüfen“: Das Kind legt " +
          "alle acht Finger auf die Grundreihe und drückt die acht Grundtasten zugleich; Tastenflow " +
          "sagt, ob jeder Finger richtig liegt - ohne hinzusehen, ohne Lehrkraft. Wer noch an der " +
          "Grundreihe übt, bekommt es nach der ersten Runde auch angeboten.",
      },
      {
        id: "blindheit",
        kopf: "Kinder mit Blindheit.",
        text:
          "Für sie gibt es kein Mindestalter: Der österreichische Sonderschul-Lehrplan verlangt das " +
          "sichere Schreiben im Zehnfingersystem „so rasch als möglich“ - nach dem Entwicklungsstand, " +
          "nicht nach der Schulstufe.",
      },
    ],
    quellenKopf: "Quellen",
    quellen: [
      "Kantone Schwyz, Luzern und Zug, Leitfäden Tastaturschreiben; Kanton Basel-Landschaft, Umsetzungshilfe Tastaturschreiben (2025)",
      "Schüler, L. und Lindauer, T. (Hrsg.): Didaktik des Tastaturschreibens. Bochum 2025 (Open Access)",
      "LehrplanPLUS Bayern, Realschule, Informationstechnologie (ISB)",
      "Lehrplan 21, Deutsch: Tastaturschreiben und D.4.A.1 (D-EDK)",
      "Österreich, Lehrplan der Volksschule, Anlage C 3 (Sonderschule)",
    ],
  },
  en: {
    titel: "For your lessons: how often, how long, how fast",
    punkte: [
      {
        id: "dauer",
        kopf: "Short and often.",
        text:
          "15 to 20 minutes a session, at least three times a week - a little every day beats one " +
          "long session; with younger pupils, start with 5 to 10 minutes. As a rough guide, 15 to 18 " +
          "hours of teaching take pupils to 10 to 15 words a minute.",
      },
      {
        id: "genauigkeit",
        kopf: "Accuracy before speed.",
        text:
          `In Tastenflow a key counts as secure at ${P}% accuracy. Speed is asked for only gradually: ` +
          `the speed target starts at ${T} keystrokes a minute and rises with the difficulty level. ` +
          "Official goals for children of about nine end at 80 to 90% accuracy, so the threshold " +
          "used here sits at the top of that range. " +
          `A key only appears under “Wobbly keys” after ${W} keystrokes, and only below ` +
          `${wackligSchwelleText("en", "en")} accuracy - with fewer keystrokes the figure measures chance.`,
      },
      {
        id: "tempo",
        kopf: "Speed as a guide.",
        text:
          "A guide, not a hurdle: New South Wales suggests 15, 25 and 35 words a minute for " +
          "beginning, developing and advanced typists at around nine or ten, and lets pupils set " +
          "their own goals; a common rule of thumb in the US is 5 words a minute for each year of " +
          "school. One word counts as five keystrokes, so 15 words a minute is about 75 keystrokes a " +
          "minute. England, Scotland, Wales and Ireland set no figures.",
      },
      {
        id: "reihenfolge",
        kopf: "Why this order.",
        text:
          "After the home row, “My training” brings in the most frequent English letters first, so " +
          "pupils type real words from the first lessons - which research names as the one thing " +
          "that matters. Many school courses go row by row instead; both are established, and no " +
          "country prescribes an order. The full stop and the comma come straight after the Shift " +
          "key: a sentence needs a capital letter at the start and a full stop at the end, and " +
          "pupils learn both together.",
      },
      {
        id: "grundstellung",
        kopf: "Check your home position.",
        text:
          "“Check your home position” is in “Word games” (Alt + B takes you there): the pupil rests " +
          "all eight fingers on the home row and presses the eight home keys together, and " +
          "Tastenflow says whether every finger is in the right place - no looking, no adult " +
          "needed. Pupils still on the home row are also offered it after their first round.",
      },
      {
        id: "blindheit",
        kopf: "Pupils who are blind.",
        text:
          "Guidance from the US and the UK suggests starting earlier than classmates, with short " +
          "daily sessions and learning where every key is, including Ctrl and Alt.",
      },
    ],
    quellenKopf: "Sources",
    quellen: [
      "NSW Department of Education: English Stage 2 and Stage 3, Instructional sequence - Handwriting and digital transcription (2023, 2026)",
      "Wisconsin Department of Public Instruction: Keyboarding at the Elementary Level",
      "National Business Education Association, keyboarding rates (in Nebraska Department of Education, 2011)",
      "West, L. J.: Implications of Research for Teaching Typewriting, 2nd edition, 1974",
      "RNIB: Assistive technology assessment for pupils with a vision impairment; Perkins (USA), teaching touch typing to students with visual impairments",
    ],
  },
  fr: {
    titel: "Pour la classe : à quelle fréquence, combien de temps, à quelle vitesse",
    punkte: [
      {
        id: "dauer",
        kopf: "Souvent et court.",
        text:
          "10 à 20 minutes par séance, trois ou quatre fois par semaine - mieux vaut souvent et " +
          "court que rarement et long ; au total, environ une heure par semaine. Avec les plus " +
          "jeunes, commencez par 10 minutes. L'apprentissage s'étale utilement sur plus d'une " +
          "année scolaire.",
      },
      {
        id: "genauigkeit",
        kopf: "La précision avant la vitesse.",
        text:
          `Dans Tastenflow, une touche est considérée comme sûre à partir de ${P} % de précision. ` +
          `La vitesse ne vient que peu à peu : l'objectif commence à ${T} frappes par minute et ` +
          "augmente avec le niveau. Pour les 6-11 ans, 90 % correspond déjà au niveau \"expert\" " +
          "des repères québécois. " +
          `Une touche n'apparait dans "Touches instables" qu'après ${W} frappes, et seulement sous ` +
          `${wackligSchwelleText("fr", "fr")} de précision - avec moins de frappes, le chiffre mesure le hasard.`,
      },
      {
        id: "tempo",
        kopf: "Repères de vitesse.",
        text:
          "Un repère, pas un obstacle : aucun programme officiel de France, de Belgique, de Suisse " +
          "romande ou du Québec ne fixe de vitesse pour les enfants. Un référentiel scolaire " +
          "québécois répandu vise, en fin d'apprentissage, 15, 25 et 35 mots par minute (75, 125 et " +
          "175 frappes) pour les 6-11 ans - débutant, intermédiaire, expert - et 30, 40 et 50 mots " +
          "par minute pour les 12-16 ans.",
      },
      {
        id: "reihenfolge",
        kopf: "Pourquoi cet ordre.",
        text:
          "Après la rangée de base, \"Mon entrainement\" introduit d'abord les lettres les plus " +
          "fréquentes du français, pour écrire tôt de vrais mots ; les cours scolaires avancent " +
          "souvent rangée par rangée. Les deux démarches sont reconnues, et aucun programme officiel " +
          "n'impose d'ordre. Le point et la virgule arrivent juste après la touche Maj (sur AZERTY, " +
          "le point se tape d'ailleurs avec Maj) : une phrase commence par une majuscule et finit " +
          "par un point, et l'élève apprend les deux ensemble.",
      },
      {
        id: "grundstellung",
        kopf: "Vérifier la position de base.",
        text:
          "\"Vérifier la position de base\" se trouve dans \"Jeux de lettres\" (Alt + B y mène) : " +
          "l'élève pose les huit doigts sur la rangée de base et appuie sur les huit touches en " +
          "même temps ; Tastenflow dit si chaque doigt est bien placé - sans regarder, sans adulte. " +
          "Les élèves qui travaillent encore la rangée de base se le voient aussi proposer après " +
          "leur première série.",
      },
      {
        id: "blindheit",
        kopf: "Élèves en situation de handicap visuel.",
        text:
          "Aucune source francophone ne prévoit d'ordre ni d'objectifs propres ; la Ligue Braille " +
          "(Belgique) enseigne la frappe à dix doigts dès la fin du primaire, par séances " +
          "régulières. Tastenflow mise sur la précision d'abord, la lecture à voix haute et la " +
          "plage braille.",
      },
    ],
    quellenKopf: "Sources",
    quellen: [
      "Losier, Université de Moncton (2002) : séances d'environ 15 minutes sur plus d'une année scolaire",
      "Référentiel scolaire québécois : fiches pédagogiques \"Vitesse de frappe\" et \"Planification de la formation\" (2007)",
      "Programmes de français cycle 3 (2023, 2025) : aucune vitesse ni précision fixée",
      "Ligue Braille (Belgique)",
    ],
  },
  es: {
    titel: "Para la clase: con qué frecuencia, cuánto tiempo, a qué velocidad",
    punkte: [
      {
        id: "dauer",
        kopf: "Poco y a menudo.",
        text:
          "Sesiones cortas, de 10 a 20 minutos, varias veces por semana - mejor un poco cada día " +
          "que una sesión larga de vez en cuando. Con estudiantes más jóvenes, empiece por 10 minutos.",
      },
      {
        id: "genauigkeit",
        kopf: "Precisión antes que velocidad.",
        text:
          `En Tastenflow una tecla se da por segura a partir de un ${P} % de precisión. La velocidad ` +
          `llega poco a poco: el objetivo empieza en ${T} pulsaciones por minuto y sube con el ` +
          "nivel. La metodología de la ONCE sigue el mismo camino: primero orientarse en el " +
          "teclado, después precisión y, solo al final, velocidad. " +
          `Una tecla solo aparece en "Teclas inseguras" a partir de ${W} pulsaciones y por debajo del ` +
          `${wackligSchwelleText("es", "es")} de precisión - con menos pulsaciones, la cifra mide el azar.`,
      },
      {
        id: "tempo",
        kopf: "Velocidad orientativa.",
        text:
          "Una orientación, no un obstáculo: ni en España ni en Latinoamérica hay una cifra " +
          "oficial para la etapa escolar. Las únicas cifras oficiales son de la formación " +
          "profesional: en España, al menos 200 pulsaciones por minuto al terminar el módulo de " +
          "Grado Medio (desde los 16 años, 180 horas); en México, de 80 a 90 pulsaciones por minuto " +
          "tras el primer módulo del bachillerato tecnológico.",
      },
      {
        id: "reihenfolge",
        kopf: "Por qué este orden.",
        text:
          "Después de la fila guía, \"Mi entrenamiento\" introduce primero las letras más " +
          "frecuentes del español, para escribir palabras de verdad desde muy pronto; los cursos " +
          "habituales avanzan fila por fila. Los dos caminos son reconocidos y ningún plan de " +
          "estudios oficial fija un orden. El punto y la coma llegan justo después de la tecla " +
          "Mayús: una oración empieza con mayúscula y termina con punto, y el alumnado aprende las " +
          "dos cosas a la vez.",
      },
      {
        id: "grundstellung",
        kopf: "Comprobar la posición de base.",
        text:
          "\"Comprobar la posición de base\" está en \"Juegos de palabras\" (Alt + B lleva allí): " +
          "cada estudiante pone los ocho dedos en la fila guía y pulsa a la vez las ocho teclas; " +
          "Tastenflow dice si cada dedo está bien colocado, sin mirar y sin ayuda. Es el ejercicio " +
          "\"A sus puestos\" de la ONCE. A quien todavía practica la fila guía se le ofrece también " +
          "tras su primera serie.",
      },
      {
        id: "blindheit",
        kopf: "Estudiantes con ceguera o discapacidad visual.",
        text:
          "La metodología de la ONCE empieza desde los 5 años, con lecciones cortas; para el resto " +
          "del alumnado, las guías suelen recomendar empezar hacia los 8 o 9 años.",
      },
    ],
    quellenKopf: "Fuentes",
    quellen: [
      "Real Decreto 1631/2009, Técnico en Gestión Administrativa, módulo 0440",
      "SEP, México: Dirección General de Educación Tecnológica Industrial (DGETI)",
      "Lafuente, Á. (2011), en Integración 61, ONCE: la mecanografía para estudiantes con y sin discapacidad visual",
      "Eduteka, Universidad Icesi (Colombia)",
    ],
  },
  // ★ O-IT (02.10.2026): neu geschrieben aus R0 `recherche-didaktik-2026-10-02/
  // didaktik-italienisch.md` (I6, I7, I13, I14): Tutore Dattilo „Tempi di
  // apprendimento", Signorelli, UICI/IRIFOR, Biblioteca per i Ciechi. Lehrkraft
  // neutral (Glossar Regel 1), „battute al minuto" (Regel 6), „95%" (Regel 5).
  it: {
    titel: "Per le lezioni: quanto spesso, quanto a lungo, quanto veloce",
    punkte: [
      {
        id: "dauer",
        kopf: "Spesso e poco alla volta.",
        text:
          "Nei primi giorni non più di 30 minuti al giorno, divisi in due o tre blocchi da 10-15 minuti - " +
          "meglio un po' ogni giorno che una volta alla settimana a lungo. Con mezz'ora di esercizio al " +
          "giorno, la maggior parte dei caratteri si scrive senza guardare la tastiera dopo circa 40-50 ore.",
      },
      {
        id: "genauigkeit",
        kopf: "Prima la precisione, poi la velocità.",
        text:
          `In Tastenflow un tasto è sicuro da ${P}% di precisione. La velocità arriva poco a poco: ` +
          `l'obiettivo parte da ${T} battute al minuto e cresce con il livello di difficoltà. Anche il ` +
          "corso Tutore Dattilo conta la precisione tre volte più della velocità. " +
          `Un tasto compare tra i "Tasti incerti" solo dopo ${W} battute e sotto il ` +
          `${wackligSchwelleText("it", "it")} di precisione - con poche battute il numero misura il caso.`,
      },
      {
        id: "tempo",
        kopf: "Valori orientativi per la velocità.",
        text:
          "Un orientamento, non un ostacolo: in Italia non c'è un valore ufficiale per la scuola. Il " +
          "corso Tutore Dattilo indica 50-60 battute al minuto nelle prime lezioni, 80-100 a metà corso e " +
          "120-150 alla fine; all'inizio consiglia un ritmo lento, intorno a 40-50 battute al minuto.",
      },
      {
        id: "reihenfolge",
        kopf: "Perché quest'ordine.",
        text:
          `Dopo la riga di base - sulla tastiera italiana ne fa parte anche la ò - "Il mio allenamento" ` +
          "introduce prima le lettere più frequenti, così si scrivono presto parole vere; i corsi italiani " +
          "diffusi procedono di solito con due tasti nuovi alla volta. Entrambe le strade sono riconosciute " +
          "e nessun programma ministeriale fissa un ordine. Il punto e la virgola arrivano subito dopo il " +
          "tasto Maiusc: una frase inizia con la maiuscola e finisce con il punto, e le due cose si " +
          "imparano insieme.",
      },
      {
        id: "grundstellung",
        kopf: "Controllare la posizione base.",
        text:
          `"Controlla la posizione base" si trova in "Giochi di parole" (Alt + B porta lì): chi scrive ` +
          "mette le otto dita sulla riga di base e preme insieme gli otto tasti; Tastenflow dice se ogni " +
          "dito è al posto giusto, senza guardare e senza aiuto. Anche i corsi italiani fanno cercare la " +
          "posizione base a occhi chiusi. A chi si esercita ancora sulla riga di base viene proposto anche " +
          "dopo il primo giro.",
      },
      {
        id: "blindheit",
        kopf: "Alunni con cecità o disabilità visiva.",
        text:
          "Per loro non c'è un'età minima: le guide per le famiglie consigliano di iniziare presto, anche " +
          "prima della scuola. In tutta Italia i 19 Centri di consulenza tiflodidattica aiutano scuole e " +
          "famiglie.",
      },
    ],
    quellenKopf: "Fonti",
    quellen: [
      `Tutore Dattilo: "Tempi di apprendimento" e "Prime lezioni" (R. Signorelli)`,
      `UICI Piemonte e I.Ri.Fo.R.: "SOS Inclusione"`,
      `Biblioteca Italiana per i Ciechi "Regina Margherita": Centri di consulenza tiflodidattica`,
      `"Ciechi e ipovedenti a scuola" (ciechiescuola.it)`,
    ],
  },
  // ★ O-PL (02.10.2026): neu geschrieben aus R0 `recherche-didaktik-2026-10-02/
  // didaktik-polnisch.md` (§2, §3.1, §5, §7; P3, P9, P14, P15) - nur was dort
  // belegt ist: MEN-Leitfaden 2006 (nach Kinel, WSiP), WSiP Informatyka Klasse 4,
  // Kompas Jutra, Owińska, PZN, zpe.gov.pl. Kein Programm beim Namen (Hausregel).
  // Lehrkraft unpersönlich (Glossar Regel 1), „uderzeń na minutę" (Regel 7),
  // „95%" (Regel 5). Für Kinder gibt es KEINEN polnischen Richtwert - das steht so da.
  pl: {
    titel: "Na zajęcia: jak często, jak długo, jak szybko",
    punkte: [
      {
        id: "dauer",
        kopf: "Często i krótko.",
        text:
          "Polskie kursy pisania dziesięcioma palcami zalecają 15-20 minut ćwiczeń dziennie - lepiej " +
          "codziennie krótko niż raz w tygodniu długo. Po godzinie pracy przy komputerze poradnik MEN " +
          "przewiduje co najmniej 5 minut przerwy. Krótkie jednostki pasują też do podstawy programowej " +
          "„Kompas Jutra”, która kładzie nacisk na higienę pracy z ekranem. Podręcznik WSiP do " +
          "informatyki dla klasy 4 ma lekcję o szybkim pisaniu na klawiaturze.",
      },
      {
        id: "genauigkeit",
        kopf: "Najpierw dokładność, potem tempo.",
        text:
          `W programie Tastenflow klawisz jest pewny od ${P}% dokładności. Tempa program wymaga ` +
          `stopniowo: wymagane tempo zaczyna się od ${T} uderzeń na minutę i rośnie z poziomem ` +
          "trudności. Także poradnik MEN zaleca pisać wolno i równomiernie, a tempo zwiększać dopiero " +
          "z rosnącą wprawą. " +
          `Na liście „Niepewne klawisze” klawisz pojawia się dopiero po ${W} uderzeniach i tylko poniżej ` +
          `${wackligSchwellePl()} dokładności - przy kilku uderzeniach liczba mierzy przypadek.`,
      },
      {
        id: "tempo",
        kopf: "Wartości orientacyjne tempa.",
        text:
          "To orientacja, nie przeszkoda: podstawa programowa nie wymaga pisania dziesięcioma palcami, " +
          "a polskiej wartości orientacyjnej dla dzieci nie ma. Poradnik MEN dla kształcenia zawodowego " +
          "(technik administracji) wymaga na końcu modułu ponad 130 uderzeń na minutę przy najwyżej 0,5% " +
          "błędów - to norma końcowa dla młodzieży, nie próg do nauki.",
      },
      {
        id: "reihenfolge",
        kopf: "Dlaczego taka kolejność.",
        text:
          "Poradnik MEN zaczyna od wyczuwalnych klawiszy F i J i od rzędu podstawowego - tak samo " +
          "„Mój trening”. Podstawa programowa nie ustala żadnej kolejności liter. Polskie litery pisze się " +
          "prawym Altem (AltGr) i literą podstawową - poradnik MEN ćwiczy ł już w pierwszym ćwiczeniu. " +
          "Kropka i przecinek przychodzą zaraz po klawiszu Shift: zdanie zaczyna się wielką literą i " +
          "kończy kropką, i jednego, i drugiego uczy się razem.",
      },
      {
        id: "grundstellung",
        kopf: "Sprawdzanie pozycji podstawowej.",
        text:
          "Ćwiczenie „Sprawdź pozycję podstawową” jest w części „Gry słowne” (prowadzi tam Alt + B): " +
          "osoba ćwicząca kładzie osiem palców na rzędzie podstawowym i naciska razem osiem klawiszy; " +
          "Tastenflow mówi, czy każdy palec jest na swoim miejscu - bez patrzenia i bez pomocy. Kto " +
          "ćwiczy jeszcze rząd podstawowy, dostaje to ćwiczenie także po pierwszej rundzie.",
      },
      {
        id: "blindheit",
        kopf: "Uczniowie z niepełnosprawnością wzroku.",
        text:
          "Specjalny Ośrodek Szkolno-Wychowawczy dla Dzieci Niewidomych w Owińskach uczy obsługi " +
          "klawiatury bez patrzenia razem z czytnikiem ekranu, syntezatorem mowy i monitorem " +
          "brajlowskim. Listę szkół i ośrodków prowadzi Polski Związek Niewidomych. Materiały dla " +
          "zawodu technik tyfloinformatyk są na Zintegrowanej Platformie Edukacyjnej (zpe.gov.pl).",
      },
    ],
    quellenKopf: "Źródła",
    quellen: [
      `MEN: „Wykonywanie prac biurowych” 343[01].O1.03, poradnik dla ucznia, technik administracji (2006), według: K. Kinel, „Technika pracy biurowej”, WSiP`,
      `WSiP: „Informatyka”, klasa 4, lekcja „Czy potrafisz szybko pisać?”`,
      `ORE: podstawa programowa „Kompas Jutra” (2026), poradniki`,
      `Specjalny Ośrodek Szkolno-Wychowawczy dla Dzieci Niewidomych w Owińskach; Polski Związek Niewidomych`,
    ],
  },
  // ★ O-TR (02.10.2026): neu geschrieben aus R0 `recherche-didaktik-2026-10-02/
  // didaktik-tuerkisch.md` (§1.3, §2, §4, §5, §7; T3, T5, T8-T11) - nur was dort
  // belegt ist: MEB/MEGEP-Module "F Klavye 1" (2011) und "Hızlı Yazı" (2019),
  // BTY-Lehrplan 2018, EBA, TEKÖP (Gazi Üniversitesi 2020). Kein Programm beim
  // Namen (Hausregel; TEKÖP ist ein Forschungsprogramm). Lehrkraft unpersönlich,
  // nie "-InIz" (Glossar Regel 1), "dakikada vuruş" (§2.2), "%95" (Regel 5),
  // keine Endung an Zahl, Abkürzung oder "Tastenflow" (Regel 6: "MEB modülleri",
  // "Tastenflow programında"). Für Kinder gibt es KEINEN türkischen Richtwert.
  tr: {
    titel: "Ders için: ne sıklıkla, ne kadar süre, ne hızla",
    punkte: [
      {
        id: "dauer",
        kopf: "Sık ve kısa.",
        text:
          "Görme yetersizliği olan çocuklar için geliştirilen Türkçe klavye öğretim programı TEKÖP " +
          "(Gazi Üniversitesi) haftada dört gün 15 dakika çalışır; aynı çalışmadaki literatür özeti " +
          "haftada 2-5 kez, 20-45 dakika önerir. MEB modülleri hız çalışmasını birer dakikalık kısa " +
          "bölümlerle yaptırır. Zorunlu öğretim programında on parmak klavye yer almaz: Bilişim " +
          "Teknolojileri ve Yazılım dersi 5. sınıfta yalnızca fareyi ve klavyeyi doğru kullanmayı ister.",
      },
      {
        id: "genauigkeit",
        kopf: "Önce doğruluk, sonra hız.",
        text:
          `Tastenflow programında bir tuş %${P} doğrulukla yerine oturmuş sayılır. Hızı program adım ` +
          `adım ister: istenen hız dakikada ${T} vuruşla başlar ve zorluk seviyesiyle birlikte artar. ` +
          "TEKÖP de bir sonraki adıma ancak %90 doğrulukla geçer. " +
          `Bir tuş "Henüz oturmamış tuşlar" listesinde ancak ${W} vuruştan sonra ve yalnızca ` +
          `${wackligSchwelleTr()} doğruluğun altında görünür - birkaç vuruşta sayı yalnızca tesadüfü ölçer.`,
      },
      {
        id: "tempo",
        kopf: "Hız için yol gösterici değerler.",
        text:
          "Bunlar yön gösterir, engel değildir: Türkiye'de çocuklar için resmi bir hız değeri yoktur. " +
          "MEB büro yönetimi modülleri vuruşu sayar ve 5 vuruşu 1 kelime kabul eder (boşluklar da " +
          "sayılır). Meslek ölçütü 3 dakikada 90 kelimedir, yani dakikada yaklaşık 150 vuruş - bu, " +
          "yetişkinler için bir meslek ölçütüdür, öğrenme eşiği değildir.",
      },
      {
        id: "reihenfolge",
        kopf: "Bu sıra neden?",
        text:
          "Türkiye'de evlerin çoğunda ve Windows sisteminde varsayılan olarak Q klavye kullanılır; MEB " +
          "kursları ise F klavyeyi öğretir. \"Antrenmanım\" Q klavyeyle temel sıradan (a s d f j k l ş) " +
          "başlar ve sonra en sık kullanılan harfleri getirir - böylece kısa sürede gerçek kelimeler " +
          "yazılır. TEKÖP de Q klavyede harfleri hemen hemen sıklık sırasıyla öğretir. ı, ğ, ş, ç, ö ve " +
          "ü harflerinin kendi tuşları vardır; bu yüzden ayrı bir \"Türkçe harfler\" dersi yoktur. MEB " +
          "kursları Shift tuşunu bütün harflerden sonra öğretir; Tastenflow nokta ve virgülü Shift " +
          "tuşunun hemen ardından getirir: cümle büyük harfle başlar ve noktayla biter, ikisi birlikte öğrenilir.",
      },
      {
        id: "grundstellung",
        kopf: "Temel konumu kontrol etmek.",
        text:
          `"Temel konumu kontrol et" alıştırması "Kelime oyunları" bölümündedir (Alt + B oraya götürür): ` +
          "öğrenci sekiz parmağını temel sıraya yerleştirir ve sekiz tuşa birlikte basar; Tastenflow her " +
          "parmağın yerinde olup olmadığını söyler - bakmadan ve yardım almadan. MEB modülleri de ilk iş " +
          "olarak temel sırayı ve temel tuşları öğretir. Temel sırayı henüz çalışan öğrenciye bu " +
          "alıştırma ilk turdan sonra da önerilir.",
      },
      {
        id: "blindheit",
        kopf: "Görme yetersizliği olan öğrenciler.",
        text:
          "TEKÖP, kör ve az gören çocuklara klavyeyi seslerle öğretir: tuş tarif edilir, ses söylenir, " +
          "çocuk tuşa basar. Program Q klavyeyle ve F ile J tuşlarındaki çıkıntılarla çalışır. 53 " +
          "oturumdan sonra 1. sınıftaki 8 yaşında bir çocuk, henüz Braille okuyamazken, söylenen " +
          "metinleri klavyeyle yazabildi. Çalışmaya göre Braille yazısı çocuklara geç ulaşır - klavye " +
          "erken bir yazma yolu olabilir.",
      },
    ],
    quellenKopf: "Kaynaklar",
    quellen: [
      `Küçüközyiğit, Çakmak (2020): "Görme engelliler için klavye öğretim programının etkililiğinin incelenmesi" (TEKÖP), Gazi Üniversitesi, UEAD 4(1)`,
      `MEB, MEGEP modülleri "F Klavye 1" (2011) ve "Hızlı Yazı" (2019), büro yönetimi`,
      `MEB: Bilişim Teknolojileri ve Yazılım dersi öğretim programı, 5. ve 6. sınıflar (2018)`,
      `MEB EBA: "F Klavye Dersleri"`,
    ],
  },
  // ★ O-CS (03.10.2026): neu geschrieben aus R0 `recherche-didaktik-2026-10-02/
  // didaktik-tschechisch.md` (§0 C1, C3-C6, C9-C12; §2, §3.1, §3.2, §5, §7) -
  // nur was dort belegt ist: NPI-Kurs für Erwachsene (10-15 Minuten täglich,
  // Reihenfolge), Anforderungen des Státní těsnopisný ústav (NPI), RVP ZV,
  // Wikipedia (50/70 Stunden). Kein Programm beim Namen (Hausregel): der
  // verbreitetste Kurs und der Kurs mit angepasster Fassung bleiben ohne Namen.
  // Lehrkraft vy-Mehrzahl bzw. unpersönlich (Glossar Regel 1), „úhozy za
  // minutu" (Regel 6), „95 %" mit geschütztem Leerzeichen (Regel 5), nie
  // „zkouška" (§4 Falle 11 - das Wort gehört hier niemandem). Für Kinder gibt es
  // KEINEN tschechischen Richtwert - das steht so da.
  cs: {
    titel: "Pro výuku: jak často, jak dlouho, jak rychle",
    punkte: [
      {
        id: "dauer",
        kopf: "Často a krátce.",
        text:
          "Kurz psaní všemi deseti Národního pedagogického institutu doporučuje cvičit 10-15 minut " +
          "denně - raději každý den krátce než jednou týdně dlouho. Na psaní souvislého textu se " +
          "počítá s nejméně 50 hodinami cvičení, na téměř celou klávesnici se 70 hodinami, rozloženými " +
          "do několika měsíců. Rámcový vzdělávací program pro základní školy psaní všemi deseti " +
          "nepředepisuje; školy ho nabízejí v informatice nebo v kroužku.",
      },
      {
        id: "genauigkeit",
        kopf: "Nejdřív přesnost, potom rychlost.",
        text:
          `V aplikaci Tastenflow je klávesa jistá od přesnosti ${P}\u00a0%. Rychlost program vyžaduje ` +
          `postupně: požadovaná rychlost začíná na hodnotě ${T} úhozů za minutu a roste s úrovní ` +
          "obtížnosti. I nejrozšířenější český kurz upevňuje nejdřív časté a snadné hmaty, aby obtížné " +
          "hmaty nikoho neodradily. " +
          `V seznamu Nejisté klávesy se klávesa objeví až po ${W} úhozech a jen pod hranicí ` +
          `${wackligSchwelleCs()} přesnosti - při několika úhozech měří číslo jen náhodu.`,
      },
      {
        id: "tempo",
        kopf: "Orientační hodnoty rychlosti.",
        text:
          "Jde o orientaci, ne o překážku: pro děti na základní škole žádná česká úřední hodnota " +
          "rychlosti není. Jediné úřední číslo je profesní a platí pro dospělé: desetiminutový opis " +
          "s nejméně 200 čistými úhozy za minutu při přesnosti nejméně 99,50\u00a0% (za každou chybu " +
          "se odečte 10 úhozů). To je norma pro povolání, ne práh pro učení.",
      },
      {
        id: "reihenfolge",
        kopf: "Proč toto pořadí.",
        text:
          "Můj trénink přináší po základní řadě nejčastější písmena češtiny - tak brzy vznikají " +
          "skutečná slova. Podle četnosti písmen učí i nejrozšířenější český kurz. Písmena ě š č ř ž ý " +
          "á í é z číselné řady jsou pro české dítě běžná písmena, ne pozdní řada: častá í, á a ě " +
          "přicházejí brzy, číslice (Shift a klávesa číselné řady) až na konci. Velká Č Š Ř Ž se " +
          "s klávesou Shift napsat nedají - přicházejí až s mrtvými klávesami háček a čárka nad " +
          "písmenem. Tečka, čárka a otazník přicházejí hned po klávese Shift: věta začíná velkým " +
          "písmenem a končí tečkou, obojí se učí společně.",
      },
      {
        id: "grundstellung",
        kopf: "Kontrola základního postavení.",
        text:
          "Cvičení na kontrolu základního postavení je v části Slovní hry (přejdete tam klávesami " +
          "Alt + B): dítě položí osm prstů na základní řadu a stiskne najednou osm kláves; Tastenflow " +
          "řekne, jestli je každý prst na svém místě - bez dívání a bez pomoci vyučujících. Kdo ještě " +
          "cvičí základní řadu, dostane toto cvičení nabídnuté i po prvním kole.",
      },
      {
        id: "blindheit",
        kopf: "Děti se zrakovým postižením.",
        text:
          "Kurz psaní na klávesnici pro mladší děti s těžkým zrakovým postižením se v Česku najít " +
          "nepodařilo. Jediná přizpůsobená verze rozšířeného školního kurzu je určená lidem, kteří " +
          "používají odečítač obrazovky, a to od 16 let; výslovně netlačí na rychlost a cvičení se v ní " +
          "dají opakovat podle potřeby.",
      },
    ],
    quellenKopf: "Zdroje",
    quellen: [
      `Národní pedagogický institut ČR: „Psaní na klávesnici všemi deseti“, kurz pro dospělé`,
      `Národní pedagogický institut ČR, Státní těsnopisný ústav: požadavky na psaní na klávesnici (desetiminutový opis)`,
      `MŠMT: Rámcový vzdělávací program pro základní vzdělávání, Informatika (2021)`,
      `Wikipedie: „Hmatová metoda ovládání klávesnice deseti prsty“`,
    ],
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    titel: "За вашите уроци: колко често, колко дълго, колко бързо",
    punkte: [
      {
        id: "dauer",
        kopf: "Кратко и често.",
        text:
          "От 15 до 20 минути на занятие, поне три пъти седмично - по малко всеки ден е по-добре от едно " +
          "дълго занятие; при по-малките ученици започнете с 5 до 10 минути. Като ориентир, 15 до 18 " +
          "часа обучение извеждат учениците до 10 до 15 думи в минута.",
      },
      {
        id: "genauigkeit",
        kopf: "Първо точност, после скорост.",
        text:
          `В Tastenflow един клавиш се счита за сигурен при ${P}% точност. Скорост се изисква само постепенно: ` +
          `целта за скорост започва от ${T} знака в минута и расте с нивото на трудност. ` +
          "Официалните цели за деца на около девет години свършват при 80 до 90% точност, така че прагът, " +
          "използван тук, е в горната част на този диапазон. " +
          `Един клавиш се появява в „Несигурни клавиши“ едва след ${W} натискания и само под ` +
          `${wackligSchwelleText("bg", "bg")} точност - при по-малко натискания числото измерва случайността.`,
      },
      {
        id: "tempo",
        kopf: "Скоростта като ориентир.",
        text:
          "Ориентир, а не препятствие: Нов Южен Уелс предлага 15, 25 и 35 думи в минута за " +
          "начинаещи, напредващи и добри машинописци на около девет или десет години и оставя учениците " +
          "сами да си поставят цели; често правило в САЩ е 5 думи в минута за всяка " +
          "учебна година. Една дума се брои за пет знака, така че 15 думи в минута са около 75 знака в " +
          "минута. Англия, Шотландия, Уелс и Ирландия не определят цифри.",
      },
      {
        id: "reihenfolge",
        kopf: "Защо този ред.",
        text:
          "След основния ред „Моята тренировка“ въвежда буквите в реда на курса, за да " +
          "пишат учениците истински думи още от първите уроци - което изследванията посочват като единственото, " +
          "което има значение. Много училищни курсове вървят по редове; и двата подхода са утвърдени и " +
          "никоя държава не предписва ред. Точката и запетаята идват веднага след клавиша " +
          "Shift: едно изречение се нуждае от главна буква в началото и от точка в края, и " +
          "учениците учат и двете заедно.",
      },
      {
        id: "grundstellung",
        kopf: "Проверка на изходната позиция.",
        text:
          "„Проверка на изходната позиция“ е в „Игри с думи“ (Alt + B ви води дотам): ученикът поставя " +
          "всичките осем пръста на основния ред и натиска осемте основни клавиша едновременно, и " +
          "Tastenflow казва дали всеки пръст е на правилното място - без поглеждане, без да е " +
          "нужен възрастен. Учениците, които още упражняват основния ред, я получават като предложение и след първия си кръг.",
      },
      {
        id: "blindheit",
        kopf: "Ученици със зрителни увреждания.",
        text:
          "Указанията от САЩ и Обединеното кралство препоръчват да се започне по-рано от съучениците, с кратки " +
          "ежедневни занятия, и да се научи къде е всеки клавиш, включително Ctrl и Alt.",
      },
    ],
    quellenKopf: "Източници",
    quellen: [
      "NSW Department of Education: English Stage 2 and Stage 3, Instructional sequence - Handwriting and digital transcription (2023, 2026)",
      "Wisconsin Department of Public Instruction: Keyboarding at the Elementary Level",
      "National Business Education Association, keyboarding rates (in Nebraska Department of Education, 2011)",
      "West, L. J.: Implications of Research for Teaching Typewriting, 2nd edition, 1974",
      "RNIB: Assistive technology assessment for pupils with a vision impairment; Perkins (USA), teaching touch typing to students with visual impairments",
    ],
  },
  el: {
    titel: "Για την τάξη: πόσο συχνά, πόσο διαρκεί, πόσο γρήγορα",
    punkte: [
      {
        id: "dauer",
        kopf: "Σύντομα και συχνά.",
        text:
          "15 έως 20 λεπτά κάθε φορά, τουλάχιστον τρεις φορές την εβδομάδα - λίγο κάθε μέρα είναι " +
          "καλύτερο από μία μεγάλη συνεδρία. Για μικρότερα παιδιά αρκεί να ξεκινήσει κανείς με 5 έως 10 " +
          "λεπτά. Ως πρόχειρος οδηγός, 15 έως 18 ώρες διδασκαλίας φέρνουν τα παιδιά σε 10 έως 15 " +
          "λέξεις το λεπτό.",
      },
      {
        id: "genauigkeit",
        kopf: "Πρώτα η ακρίβεια, μετά η ταχύτητα.",
        text:
          `Στο Tastenflow ένα πλήκτρο θεωρείται σίγουρο από ακρίβεια ${P}%. Η ταχύτητα ζητείται ` +
          `σταδιακά: ο στόχος ταχύτητας ξεκινά από ${T} πατήματα ανά λεπτό και ανεβαίνει με το ` +
          "επίπεδο δυσκολίας. Οι επίσημοι στόχοι για παιδιά περίπου εννέα ετών καταλήγουν σε " +
          "ακρίβεια 80 έως 90%, για αυτό το όριο που χρησιμοποιείται εδώ βρίσκεται στο ψηλότερο " +
          "σημείο αυτού του εύρους. " +
          `Ένα πλήκτρο εμφανίζεται στα Αβέβαια πλήκτρα μόνο μετά από ${W} πατήματα και μόνο κάτω από ` +
          `${wackligSchwelleText("el", "el")} ακρίβεια - με λιγότερα πατήματα ο αριθμός μετρά την τύχη.`,
      },
      {
        id: "tempo",
        kopf: "Η ταχύτητα ως οδηγός.",
        text:
          "Ένας οδηγός, όχι εμπόδιο: η Νέα Νότια Ουαλία (Αυστραλία) προτείνει 15, 25 και 35 λέξεις " +
          "το λεπτό για το ξεκίνημα, την εξέλιξη και το προχωρημένο επίπεδο γύρω στα εννέα ή δέκα " +
          "χρόνια και αφήνει τα παιδιά να θέτουν τους δικούς τους στόχους. Ένας συνηθισμένος " +
          "εμπειρικός κανόνας στις ΗΠΑ είναι 5 λέξεις το λεπτό για κάθε σχολική χρονιά. Μία λέξη " +
          "μετράει ως πέντε πατήματα, άρα 15 λέξεις το λεπτό είναι περίπου 75 πατήματα το λεπτό. Η " +
          "Αγγλία, η Σκωτία, η Ουαλία και η Ιρλανδία δεν ορίζουν αριθμούς.",
      },
      {
        id: "reihenfolge",
        kopf: "Γιατί αυτή η σειρά.",
        text:
          "Μετά τη βασική σειρά, το είδος Η εξάσκησή μου προσθέτει σταδιακά τα πλήκτρα, ώστε να γράφονται " +
          "πραγματικές λέξεις από τα πρώτα μαθήματα - κάτι που η έρευνα ονομάζει το μόνο που " +
          "μετράει. Πολλά σχολικά προγράμματα προχωρούν αντίθετα, σειρά σειρά του πληκτρολογίου. Και οι δύο δρόμοι " +
          "είναι καθιερωμένοι και καμία χώρα δεν επιβάλλει συγκεκριμένη σειρά. Η τελεία και το " +
          "κόμμα έρχονται αμέσως μετά το πλήκτρο Shift: μια πρόταση χρειάζεται κεφαλαίο γράμμα " +
          "στην αρχή και τελεία στο τέλος, και τα παιδιά μαθαίνουν και τα δύο μαζί.",
      },
      {
        id: "grundstellung",
        kopf: "Έλεγχος βασικής θέσης.",
        text:
          "Ο Έλεγχος βασικής θέσης βρίσκεται στα Παιχνίδια λέξεων (το Alt + B σας μεταφέρει εκεί): το " +
          "παιδί ακουμπά και τα οκτώ δάχτυλα στη βασική σειρά και πατά ταυτόχρονα τα οκτώ βασικά " +
          "πλήκτρα, και το Tastenflow λέει αν κάθε δάχτυλο βρίσκεται στη σωστή θέση - χωρίς να " +
          "κοιτάζει το παιδί, χωρίς να χρειάζεται ενήλικας. Όσα παιδιά εξασκούνται ακόμα στη " +
          "βασική σειρά τους προτείνεται και μετά τον πρώτο γύρο.",
      },
      {
        id: "blindheit",
        kopf: "Παιδιά με τύφλωση.",
        text:
          "Οι οδηγίες από τις ΗΠΑ και το Ηνωμένο Βασίλειο προτείνουν να αρχίζει η εκμάθηση νωρίτερα " +
          "από τους συμμαθητές, με σύντομες καθημερινές συνεδρίες, και να μαθαίνεται η θέση κάθε " +
          "πλήκτρου, μαζί με τα Ctrl και Alt.",
      },
    ],
    quellenKopf: "Πηγές",
    quellen: [
      "NSW Department of Education: English Stage 2 and Stage 3, Instructional sequence - Handwriting and digital transcription (2023, 2026)",
      "Wisconsin Department of Public Instruction: Keyboarding at the Elementary Level",
      "National Business Education Association, keyboarding rates (in Nebraska Department of Education, 2011)",
      "West, L. J.: Implications of Research for Teaching Typewriting, 2nd edition, 1974",
      "RNIB: Assistive technology assessment for pupils with a vision impairment; Perkins (USA), teaching touch typing to students with visual impairments",
    ],
  },
  hu: {
    titel: "Az órákhoz: milyen gyakran, mennyi ideig, milyen gyorsan",
    punkte: [
      {
        id: "dauer",
        kopf: "Röviden és gyakran.",
        text:
          "Alkalmanként 15-20 perc, hetente legalább háromszor - egy kis gyakorlás minden nap többet ér, mint egy " +
          "hosszú alkalom; a kisebb tanulóknál kezdjék 5-10 perccel. Durva támpontként 15-18 " +
          "óra oktatás percenként 10-15 szóig juttatja el a tanulókat.",
      },
      {
        id: "genauigkeit",
        kopf: "Először a pontosság, aztán a sebesség.",
        text:
          `A Tastenflow-ban egy billentyű ${P}% pontosságnál számít biztosnak. Sebességet csak fokozatosan kér a program: ` +
          `a sebességcél percenként ${T} leütésről indul, és a nehézségi szinttel együtt emelkedik. ` +
          "A kilenc év körüli gyerekek hivatalos céljai 80-90% pontosságnál végződnek, így az itt " +
          "használt küszöb ennek a sávnak a felső szélén van. " +
          `Egy billentyű csak ${W} leütés után kerül be a „Bizonytalan billentyűk” közé, és csak ` +
          `${wackligSchwelleText("hu", "hu")} pontosság alatt - kevesebb leütésnél a szám a véletlent méri.`,
      },
      {
        id: "tempo",
        kopf: "A sebesség támpont.",
        text:
          "Támpont, nem akadály: New South Wales percenként 15, 25 és 35 szót javasol " +
          "a kezdő, a fejlődő és a haladó gépelőknek kilenc-tíz éves kor körül, és a tanulókra bízza, " +
          "hogy maguk tűzzenek ki célokat; az USA-ban elterjedt ökölszabály percenként 5 szó minden " +
          "tanévre. Egy szó öt leütésnek számít, tehát percenként 15 szó nagyjából percenként 75 " +
          "leütés. Anglia, Skócia, Wales és Írország nem ír elő számokat.",
      },
      {
        id: "reihenfolge",
        kopf: "Miért ez a sorrend.",
        text:
          "Az alapsor után a „Saját gyakorlás” a betűket a tanfolyam sorrendjében vezeti be, hogy " +
          "a tanulók már az első órákon valódi szavakat gépeljenek - a kutatás szerint ez az egyetlen, " +
          "ami számít. Sok iskolai tanfolyam inkább soronként halad; mindkettő bevett, és " +
          "egyetlen ország sem ír elő sorrendet. A pont és a vessző közvetlenül a Shift " +
          "billentyű után jön: a mondat elején nagybetű kell, a végén pont, és " +
          "a tanulók a kettőt együtt tanulják meg.",
      },
      {
        id: "grundstellung",
        kopf: "Az alapállás ellenőrzése.",
        text:
          "Az „Alapállás ellenőrzése” a „Szójátékok” között van (az Alt + B oda visz): a tanuló mind a nyolc " +
          "ujját az alapsorra teszi, és a nyolc alapbillentyűt egyszerre nyomja le, és " +
          "a Tastenflow megmondja, hogy minden ujj a megfelelő helyen van-e - kukucskálás nélkül, felnőtt " +
          "nélkül. Azok a tanulók, akik még az alapsort gyakorolják, az első körük után is megkapják ajánlatként.",
      },
      {
        id: "blindheit",
        kopf: "Vak tanulók.",
        text:
          "Az USA és az Egyesült Királyság útmutatói azt javasolják, hogy a társaiknál korábban kezdjenek, rövid " +
          "napi alkalmakkal, és tanulják meg, hol van minden billentyű, a Ctrl és az Alt is.",
      },
    ],
    quellenKopf: "Források",
    quellen: [
      "NSW Department of Education: English Stage 2 and Stage 3, Instructional sequence - Handwriting and digital transcription (2023, 2026)",
      "Wisconsin Department of Public Instruction: Keyboarding at the Elementary Level",
      "National Business Education Association, keyboarding rates (in Nebraska Department of Education, 2011)",
      "West, L. J.: Implications of Research for Teaching Typewriting, 2nd edition, 1974",
      "RNIB: Assistive technology assessment for pupils with a vision impairment; Perkins (USA), teaching touch typing to students with visual impairments",
    ],
  },
  nl: {
    titel: "Voor in de klas: hoe vaak, hoe lang, hoe snel",
    punkte: [
      {
        id: "dauer",
        kopf: "Kort en vaak.",
        text:
          "15 tot 20 minuten per keer, minstens drie keer per week - elke dag een beetje is beter dan " +
          "één keer lang; begin bij jongere leerlingen met 5 tot 10 minuten. Als vuistregel brengen 15 tot 18 " +
          "uur onderwijs leerlingen op 10 tot 15 woorden per minuut.",
      },
      {
        id: "genauigkeit",
        kopf: "Eerst nauwkeurigheid, dan snelheid.",
        text:
          `In Tastenflow geldt een toets als zeker vanaf ${P}% nauwkeurigheid. Snelheid vraagt het programma pas geleidelijk: ` +
          `het snelheidsdoel begint bij ${T} aanslagen per minuut en stijgt met het moeilijkheidsniveau. ` +
          "Officiële doelen voor kinderen van een jaar of negen eindigen op 80 tot 90% nauwkeurigheid; de drempel " +
          "die hier wordt gebruikt ligt dus aan de bovenkant van dat bereik. " +
          `Een toets verschijnt pas bij Onzekere toetsen na ${W} aanslagen, en alleen onder ` +
          `${wackligSchwelleText("nl", "nl")} nauwkeurigheid - bij minder aanslagen meet het getal toeval.`,
      },
      {
        id: "tempo",
        kopf: "Snelheid als richtlijn.",
        text:
          "Een richtlijn, geen hindernis: New South Wales stelt 15, 25 en 35 woorden per minuut voor aan " +
          "beginnende, zich ontwikkelende en gevorderde typisten van rond de negen of tien jaar, en laat " +
          "leerlingen hun eigen doelen stellen; een gangbare vuistregel in de VS is 5 woorden per minuut voor elk " +
          "schooljaar. Eén woord telt als vijf aanslagen, dus 15 woorden per minuut zijn ongeveer 75 aanslagen per " +
          "minuut. Engeland, Schotland, Wales en Ierland stellen geen cijfers.",
      },
      {
        id: "reihenfolge",
        kopf: "Waarom deze volgorde.",
        text:
          "Na de basisrij brengt Mijn training de letters in de volgorde van de cursus, zodat " +
          "leerlingen al in de eerste lessen echte woorden typen - wat volgens onderzoek het enige is dat " +
          "telt. Veel schoolcursussen gaan in plaats daarvan rij voor rij; beide zijn gangbaar, en geen enkel " +
          "land schrijft een volgorde voor. De punt en de komma komen direct na de Shift-toets: een zin heeft " +
          "een hoofdletter aan het begin en een punt aan het eind nodig, en leerlingen leren beide samen.",
      },
      {
        id: "grundstellung",
        kopf: "Basishouding controleren.",
        text:
          "Basishouding controleren staat bij Woordspelletjes (Alt + B brengt je erheen): de leerling legt " +
          "alle acht vingers op de basisrij en drukt de acht basistoetsen tegelijk in, en " +
          "Tastenflow zegt of elke vinger op de goede plek ligt - zonder te kijken, zonder dat een " +
          "volwassene nodig is. Leerlingen die nog op de basisrij oefenen, krijgen het ook aangeboden na hun eerste ronde.",
      },
      {
        id: "blindheit",
        kopf: "Leerlingen die blind zijn.",
        text:
          "Richtlijnen uit de VS en het Verenigd Koninkrijk raden aan eerder te beginnen dan klasgenoten, met " +
          "korte dagelijkse sessies, en te leren waar elke toets zit, ook Ctrl en Alt.",
      },
    ],
    quellenKopf: "Bronnen",
    quellen: [
      "NSW Department of Education: English Stage 2 and Stage 3, Instructional sequence - Handwriting and digital transcription (2023, 2026)",
      "Wisconsin Department of Public Instruction: Keyboarding at the Elementary Level",
      "National Business Education Association, keyboarding rates (in Nebraska Department of Education, 2011)",
      "West, L. J.: Implications of Research for Teaching Typewriting, 2nd edition, 1974",
      "RNIB: Assistive technology assessment for pupils with a vision impairment; Perkins (USA), teaching touch typing to students with visual impairments",
    ],
  },
  pt: {
    titel: "Para as aulas: com que frequência, durante quanto tempo, com que velocidade",
    punkte: [
      {
        id: "dauer",
        kopf: "Pouco de cada vez, e muitas vezes.",
        text:
          "Sessões de 15 a 20 minutos, pelo menos três vezes por semana - um pouco todos os dias " +
          "vale mais do que uma sessão longa; com os mais novos, começar com 5 a 10 minutos. Como " +
          "orientação geral, 15 a 18 horas de aulas levam os estudantes a 10 a 15 palavras por minuto.",
      },
      {
        id: "genauigkeit",
        kopf: "Precisão antes da velocidade.",
        text:
          `No Tastenflow, uma tecla conta como dominada com ${P}% de precisão. A velocidade só é pedida aos ` +
          `poucos: o objetivo de velocidade começa em ${T} toques por minuto e sobe com o nível de ` +
          "dificuldade. Os objetivos oficiais para crianças de cerca de nove anos terminam em 80 a 90% de " +
          "precisão, por isso o limiar usado aqui fica no topo desse intervalo. " +
          `Uma tecla só aparece em \"Teclas em consolidação\" depois de ${W} toques, e só abaixo de ` +
          `${wackligSchwelleText("pt", "pt")} de precisão - com menos toques, o valor mede o acaso.`,
      },
      {
        id: "tempo",
        kopf: "A velocidade como orientação.",
        text:
          "Uma orientação, não um obstáculo: a Nova Gales do Sul sugere 15, 25 e 35 palavras por minuto " +
          "para quem está a começar, a desenvolver-se e em nível avançado, por volta dos nove ou dez anos, " +
          "e deixa os estudantes definirem os seus próprios objetivos; uma regra prática comum nos Estados " +
          "Unidos é 5 palavras por minuto por cada ano de escola. Uma palavra conta como cinco toques, " +
          "por isso 15 palavras por minuto são cerca de 75 toques por minuto. A Inglaterra, a Escócia, o " +
          "País de Gales e a Irlanda não fixam valores.",
      },
      {
        id: "reihenfolge",
        kopf: "Porquê esta ordem.",
        text:
          "Depois da fila de base, \"O meu treino\" introduz as letras pela ordem do curso, para que os " +
          "estudantes escrevam palavras verdadeiras desde as primeiras lições - o que a investigação aponta " +
          "como a única coisa que importa. Muitos cursos escolares avançam antes fila a fila; ambos os " +
          "caminhos são reconhecidos, e nenhum país prescreve uma ordem. O ponto final e a vírgula vêm " +
          "logo a seguir à tecla Shift: uma frase precisa de uma letra maiúscula no início e de um ponto " +
          "final no fim, e os estudantes aprendem as duas coisas juntas.",
      },
      {
        id: "grundstellung",
        kopf: "Verificar a posição inicial.",
        text:
          "\"Verificar a posição inicial\" está em \"Jogos de palavras\" (Alt + B leva até lá): a criança " +
          "pousa os oito dedos na fila de base e prime as oito teclas da posição inicial em simultâneo, e " +
          "o Tastenflow diz se cada dedo está no sítio certo - sem olhar, sem precisar de um adulto. Quem " +
          "ainda está na fila de base também recebe esta proposta depois da primeira ronda.",
      },
      {
        id: "blindheit",
        kopf: "Crianças com cegueira.",
        text:
          "As orientações dos Estados Unidos e do Reino Unido sugerem começar mais cedo do que os " +
          "colegas, com sessões curtas diárias e aprendendo onde está cada tecla, incluindo Ctrl e Alt.",
      },
    ],
    quellenKopf: "Fontes",
    quellen: [
      "NSW Department of Education: English Stage 2 and Stage 3, Instructional sequence - Handwriting and digital transcription (2023, 2026)",
      "Wisconsin Department of Public Instruction: Keyboarding at the Elementary Level",
      "National Business Education Association, keyboarding rates (in Nebraska Department of Education, 2011)",
      "West, L. J.: Implications of Research for Teaching Typewriting, 2nd edition, 1974",
      "RNIB: Assistive technology assessment for pupils with a vision impairment; Perkins (USA), teaching touch typing to students with visual impairments",
    ],
  },
  br: {
    titel: "Para as aulas: com que frequência, por quanto tempo, com que velocidade",
    punkte: [
      {
        id: "dauer",
        kopf: "Curto e com frequência.",
        text:
          "De 15 a 20 minutos por sessão, pelo menos três vezes por semana - um pouco todo dia vale mais " +
          "que uma sessão longa; com estudantes menores, comece com 5 a 10 minutos. Como referência " +
          "geral, 15 a 18 horas de ensino levam as turmas a 10 a 15 palavras por minuto.",
      },
      {
        id: "genauigkeit",
        kopf: "Precisão antes da velocidade.",
        text:
          `No Tastenflow, uma tecla é considerada segura a partir de ${P}% de precisão. A velocidade só é pedida aos poucos: ` +
          `a meta de velocidade começa em ${T} toques por minuto e sobe com o nível de dificuldade. ` +
          "Metas oficiais para crianças de cerca de nove anos terminam em 80 a 90% de precisão, então o limite " +
          "usado aqui fica no topo dessa faixa. " +
          `Uma tecla só aparece em Teclas inseguras depois de ${W} toques, e só abaixo de ` +
          `${wackligSchwelleText("br", "br")} de precisão - com menos toques, o número mede o acaso.`,
      },
      {
        id: "tempo",
        kopf: "Velocidade como referência.",
        text:
          "Uma referência, não um obstáculo: Nova Gales do Sul (New South Wales) sugere 15, 25 e 35 palavras por minuto para " +
          "quem está começando, desenvolvendo e em nível avançado, por volta dos nove ou dez anos, e deixa que " +
          "as crianças definam as próprias metas; uma regra prática comum nos EUA é 5 palavras por minuto para cada ano de " +
          "escola. Uma palavra conta como cinco toques, então 15 palavras por minuto são cerca de 75 toques por " +
          "minuto. Inglaterra, Escócia, País de Gales e Irlanda não fixam números.",
      },
      {
        id: "reihenfolge",
        kopf: "Por que esta ordem.",
        text:
          "Depois da fileira central, Meu treino traz as letras na ordem do curso, para que " +
          "as crianças digitem palavras de verdade já nas primeiras lições - o que a pesquisa aponta como a única coisa " +
          "que importa. Muitos cursos escolares avançam fileira por fileira; os dois caminhos são reconhecidos, e nenhum " +
          "país prescreve uma ordem. O ponto final e a vírgula vêm logo depois da tecla Shift: " +
          "uma frase precisa de letra maiúscula no começo e de ponto final no fim, e as crianças aprendem as duas coisas juntas.",
      },
      {
        id: "grundstellung",
        kopf: "Verificar a posição inicial.",
        text:
          "Verificar a posição inicial fica em Jogos de palavras (Alt + B leva até lá): a criança apoia " +
          "os oito dedos na fileira central e pressiona as oito teclas da fileira central ao mesmo tempo, e o " +
          "Tastenflow diz se cada dedo está no lugar certo - sem olhar, sem precisar de um adulto. " +
          "Quem ainda pratica a fileira central também recebe essa opção depois da primeira rodada.",
      },
      {
        id: "blindheit",
        kopf: "Crianças cegas ou com baixa visão.",
        text:
          "Orientações dos EUA e do Reino Unido sugerem começar mais cedo que os colegas, com sessões curtas " +
          "todos os dias e aprendendo onde fica cada tecla, incluindo Ctrl e Alt.",
      },
    ],
    quellenKopf: "Fontes",
    quellen: [
      "NSW Department of Education: English Stage 2 and Stage 3, Instructional sequence - Handwriting and digital transcription (2023, 2026)",
      "Wisconsin Department of Public Instruction: Keyboarding at the Elementary Level",
      "National Business Education Association, keyboarding rates (in Nebraska Department of Education, 2011)",
      "West, L. J.: Implications of Research for Teaching Typewriting, 2nd edition, 1974",
      "RNIB: Assistive technology assessment for pupils with a vision impairment; Perkins (USA), teaching touch typing to students with visual impairments",
    ],
  },
  ro: {
    titel: "Pentru ore: cât de des, cât de mult, cât de repede",
    punkte: [
      {
        id: "dauer",
        kopf: "Scurt și des.",
        text:
          "15-20 de minute pe sesiune, de cel puțin trei ori pe săptămână - puțin în fiecare zi este " +
          "mai bine decât o sesiune lungă; cu elevii mai mici, începeți cu 5-10 minute. Ca reper " +
          "aproximativ, 15-18 ore de predare duc elevii la 10-15 cuvinte pe minut.",
      },
      {
        id: "genauigkeit",
        kopf: "Precizia înainte de viteză.",
        text:
          `În Tastenflow o tastă este considerată sigură de la o precizie de ${P} %. Viteza se cere ` +
          `doar treptat: ținta de viteză începe la ${T} apăsări pe minut și crește odată cu nivelul de ` +
          "dificultate. Obiectivele oficiale pentru copiii de aproximativ nouă ani se opresc la o " +
          "precizie de 80-90 %, deci pragul folosit aici se află în partea de sus a acestui interval. " +
          `O tastă apare în lista Taste nesigure abia după ${W} apăsări și doar sub o precizie de ` +
          `${wackligSchwelleText("ro", "ro")} - la mai puține apăsări numărul măsoară întâmplarea.`,
      },
      {
        id: "tempo",
        kopf: "Viteza ca reper.",
        text:
          "Un reper, nu un obstacol: New South Wales sugerează 15, 25 și 35 de cuvinte pe minut pentru " +
          "nivelul începător, în dezvoltare și avansat, la aproximativ nouă sau zece ani, și lasă " +
          "elevii să-și stabilească propriile obiective; o regulă empirică des întâlnită în SUA este " +
          "5 cuvinte pe minut pentru fiecare an de școală. Un cuvânt se numără ca cinci apăsări, deci " +
          "15 cuvinte pe minut înseamnă aproximativ 75 de apăsări pe minut. Anglia, Scoția, Țara " +
          "Galilor și Irlanda nu stabilesc cifre.",
      },
      {
        id: "reihenfolge",
        kopf: "De ce această ordine.",
        text:
          "După șirul de bază, Antrenamentul meu aduce literele în ordinea cursului, " +
          "așa că elevii scriu cuvinte reale încă de la primele lecții, lucru " +
          "pe care cercetarea îl numește singurul care contează. Multe cursuri școlare merg în schimb " +
          "șir cu șir; ambele căi sunt consacrate și nicio țară nu prescrie o ordine. Punctul și " +
          "virgula vin imediat după tasta Shift: o propoziție are nevoie de o literă mare la început " +
          "și de un punct la sfârșit, iar elevii le învață împreună.",
      },
      {
        id: "grundstellung",
        kopf: "Verificarea poziției de bază.",
        text:
          "Verificarea poziției de bază se află în Jocuri cu cuvinte (Alt + B vă duce acolo): persoana " +
          "pune toate cele opt degete pe șirul de bază și apasă deodată cele opt taste de bază, iar " +
          "Tastenflow spune dacă fiecare deget este la locul lui - fără să se uite, fără ajutorul " +
          "unui adult. Cine mai exersează șirul de bază o primește oferită și după prima rundă.",
      },
      {
        id: "blindheit",
        kopf: "Persoane nevăzătoare.",
        text:
          "Ghidurile din SUA și din Marea Britanie recomandă să se înceapă mai devreme decât " +
          "colegii, cu sesiuni zilnice scurte și învățând unde se află fiecare tastă, inclusiv " +
          "Ctrl și Alt.",
      },
    ],
    quellenKopf: "Surse",
    quellen: [
      "NSW Department of Education: English Stage 2 and Stage 3, Instructional sequence - Handwriting and digital transcription (2023, 2026)",
      "Wisconsin Department of Public Instruction: Keyboarding at the Elementary Level",
      "National Business Education Association, keyboarding rates (in Nebraska Department of Education, 2011)",
      "West, L. J.: Implications of Research for Teaching Typewriting, 2nd edition, 1974",
      "RNIB: Assistive technology assessment for pupils with a vision impairment; Perkins (USA), teaching touch typing to students with visual impairments",
    ],
  },
  sv: {
    titel: "För din undervisning: hur ofta, hur länge, hur snabbt",
    punkte: [
      {
        id: "dauer",
        kopf: "Kort och ofta.",
        text:
          "15 till 20 minuter per tillfälle, minst tre gånger i veckan - lite varje dag är bättre än ett " +
          "långt pass; med yngre elever börjar man med 5 till 10 minuter. Som tumregel tar 15 till 18 " +
          "timmars undervisning eleverna upp till 10 till 15 ord per minut.",
      },
      {
        id: "genauigkeit",
        kopf: "Träffsäkerhet före hastighet.",
        text:
          `I Tastenflow räknas en tangent som säker från ${P} % träffsäkerhet. Hastighet krävs bara gradvis: ` +
          `hastighetsmålet börjar på ${T} anslag per minut och stiger med svårighetsnivån. ` +
          "Officiella mål för barn i nioårsåldern slutar på 80 till 90 % träffsäkerhet, så tröskeln " +
          "som används här ligger i den övre delen av det spannet. " +
          `En tangent visas under Osäkra tangenter först efter ${W} anslag och bara under ` +
          `${wackligSchwelleText("sv", "sv")} träffsäkerhet - vid färre anslag mäter talet slumpen.`,
      },
      {
        id: "tempo",
        kopf: "Hastighet som vägledning.",
        text:
          "En vägledning, inte ett hinder: New South Wales föreslår 15, 25 och 35 ord per minut för " +
          "nybörjare, för dem som är på väg och för avancerade skribenter vid ungefär nio eller tio års " +
          "ålder, och låter eleverna sätta sina egna mål; en vanlig tumregel i USA är 5 ord per minut " +
          "för varje skolår. Ett ord räknas som fem anslag, så 15 ord per minut är ungefär 75 anslag " +
          "per minut. England, Skottland, Wales och Irland anger inga siffror.",
      },
      {
        id: "reihenfolge",
        kopf: "Varför den här ordningen.",
        text:
          "Efter grundraden tar Min träning in tangenterna i kursens ordning, så att eleverna skriver " +
          "riktiga ord från de första lektionerna - vilket forskningen anger som det enda som " +
          "spelar roll. Många skolkurser går i stället rad för rad; båda vägarna är etablerade, och " +
          "inget land föreskriver en ordning. Punkt och komma kommer direkt efter Skift: en mening " +
          "behöver en stor bokstav i början och en punkt i slutet, och eleverna lär sig båda " +
          "tillsammans.",
      },
      {
        id: "grundstellung",
        kopf: "Kontrollera grundställningen.",
        text:
          "Kontrollera grundställningen finns under Ordlekar (Alt + B tar dig dit): eleven lägger alla " +
          "åtta fingrar på grundraden och trycker ned de åtta hemtangenterna samtidigt, och " +
          "Tastenflow säger om varje finger ligger rätt - utan att titta, utan att någon vuxen " +
          "behövs. Elever som fortfarande övar på grundraden får den också erbjuden efter sin första " +
          "omgång.",
      },
      {
        id: "blindheit",
        kopf: "Elever som är blinda.",
        text:
          "Vägledning från USA och Storbritannien föreslår att man börjar tidigare än klasskamraterna, " +
          "med korta dagliga pass och att man lär sig var varje tangent sitter, inklusive Ctrl och Alt.",
      },
    ],
    quellenKopf: "Källor",
    quellen: [
      "NSW Department of Education: English Stage 2 and Stage 3, Instructional sequence - Handwriting and digital transcription (2023, 2026)",
      "Wisconsin Department of Public Instruction: Keyboarding at the Elementary Level",
      "National Business Education Association, keyboarding rates (in Nebraska Department of Education, 2011)",
      "West, L. J.: Implications of Research for Teaching Typewriting, 2nd edition, 1974",
      "RNIB: Assistive technology assessment for pupils with a vision impairment; Perkins (USA), teaching touch typing to students with visual impairments",
    ],
  },
  uk: {
    titel: "Для уроків: як часто, як довго, як швидко",
    punkte: [
      {
        id: "dauer",
        kopf: "Коротко й часто.",
        text:
          "15-20 хвилин за заняття, щонайменше тричі на тиждень - щодня потроху краще, ніж один " +
          "довгий раз; із молодшими дітьми починайте з 5-10 хвилин. Орієнтовно: 15-18 годин " +
          "навчання доводять до 10-15 слів за хвилину.",
      },
      {
        id: "genauigkeit",
        kopf: "Спершу точність, потім швидкість.",
        text:
          `У Tastenflow клавіша вважається впевненою від точності ${P}%. Швидкість програма вимагає лише поступово: ` +
          `цільова швидкість починається з ${T} знаків за хвилину і зростає разом з рівнем складності. ` +
          "Офіційні цілі для дітей приблизно дев'яти років закінчуються на 80-90% точності, тож поріг, " +
          "який використано тут, лежить у верхній частині цього діапазону. " +
          `У списку Непевні клавіші клавіша з'являється лише після ${W} натискань і лише якщо точність нижча за ` +
          `${wackligSchwelleText("uk", "uk")} - за малої кількості натискань це число вимірює випадковість.`,
      },
      {
        id: "tempo",
        kopf: "Швидкість як орієнтир.",
        text:
          "Орієнтир, а не перешкода: Новий Південний Уельс пропонує 15, 25 і 35 слів за хвилину для " +
          "початкового, середнього та просунутого рівнів у віці близько дев'яти-десяти років і дозволяє " +
          "учням ставити власні цілі; поширене правило в США - 5 слів за хвилину на кожен рік " +
          "навчання. Одне слово вважається п'ятьма натисканнями, тож 15 слів за хвилину - це приблизно " +
          "75 натискань за хвилину. Англія, Шотландія, Уельс та Ірландія не встановлюють жодних цифр.",
      },
      {
        id: "reihenfolge",
        kopf: "Чому такий порядок.",
        text:
          "Після основного ряду Моє тренування вводить літери в порядку курсу, і вже з перших уроків " +
          "учні друкують справжні слова - дослідження називають це єдиним, що має значення. " +
          "Багато шкільних курсів натомість іде ряд за рядом; обидва шляхи визнані, і жодна країна " +
          "не приписує порядку. Крапка й кома йдуть одразу після клавіші Shift: у реченні потрібна " +
          "велика літера на початку й крапка в кінці, і діти вчать обидва разом.",
      },
      {
        id: "grundstellung",
        kopf: "Перевір основне положення.",
        text:
          "Вправа Перевір основне положення є в розділі Ігри зі словами (Alt + B веде туди): дитина кладе " +
          "всі вісім пальців на основний ряд і натискає вісім основних клавіш разом, а Tastenflow " +
          "каже, чи кожен палець лежить на своєму місці - не дивлячись на клавіатуру і без допомоги " +
          "дорослого. Діти, які ще тренують основний ряд, отримують цю вправу і після першого раунду.",
      },
      {
        id: "blindheit",
        kopf: "Незрячі діти.",
        text:
          "Рекомендації зі США та Великої Британії радять починати раніше, ніж однокласники, з коротких " +
          "щоденних занять і вивчати, де розташована кожна клавіша, зокрема Ctrl і Alt.",
      },
    ],
    quellenKopf: "Джерела",
    quellen: [
      "NSW Department of Education: English Stage 2 and Stage 3, Instructional sequence - Handwriting and digital transcription (2023, 2026)",
      "Wisconsin Department of Public Instruction: Keyboarding at the Elementary Level",
      "National Business Education Association, keyboarding rates (in Nebraska Department of Education, 2011)",
      "West, L. J.: Implications of Research for Teaching Typewriting, 2nd edition, 1974",
      "RNIB: Assistive technology assessment for pupils with a vision impairment; Perkins (USA), teaching touch typing to students with visual impairments",
    ],
  },
};

/**
 * ★ O-CS (03.10.2026): die Schwelle „nejistá" tschechisch - „95 %" mit
 * geschütztem Leerzeichen (Glossar Regel 5). Aus denselben Zahlen wie
 * {@link wackligSchwellePl} gerechnet, nie hingeschrieben.
 */
function wackligSchwelleCs(): string {
  const jung = wackligProzent({ lernweg: "cs", stufe: "kids" });
  const erw = wackligProzent({ lernweg: "cs", stufe: "erwachsen" });
  return jung === erw ? `${erw}\u00a0%` : `${jung}\u00a0% (děti a dospívající) nebo ${erw}\u00a0% (dospělí)`;
}

/**
 * ★ O-TR (02.10.2026): die Schwelle "henüz oturmamış" türkisch - "%95", das
 * Zeichen VOR der Zahl (Glossar Regel 5). Aus denselben Zahlen wie
 * {@link wackligSchwellePl} gerechnet, nie hingeschrieben.
 */
function wackligSchwelleTr(): string {
  const jung = wackligProzent({ lernweg: "tr", stufe: "kids" });
  const erw = wackligProzent({ lernweg: "tr", stufe: "erwachsen" });
  return jung === erw ? `%${erw}` : `%${jung} (çocuklar ve gençler) ya da %${erw} (yetişkinler)`;
}

/**
 * ★ O-PL (02.10.2026): die Schwelle „niepewny" polnisch - „95%" ohne
 * Leerzeichen (Glossar Regel 5). `wackligSchwelleText` (`wacklig.ts`) kennt
 * „pl" noch nicht (dort „95 %" und englische Zusätze); darum hier aus
 * denselben Zahlen gerechnet, nie hingeschrieben.
 */
function wackligSchwellePl(): string {
  const jung = wackligProzent({ lernweg: "pl", stufe: "kids" });
  const erw = wackligProzent({ lernweg: "pl", stufe: "erwachsen" });
  return jung === erw ? `${erw}%` : `${jung}% (dzieci i młodzież) lub ${erw}% (osoby dorosłe)`;
}

/** Die Hinweise in dieser Sprache. */
export function didaktikHinweise(lang: Lang): DidaktikHinweise {
  return HINWEISE[lang];
}
