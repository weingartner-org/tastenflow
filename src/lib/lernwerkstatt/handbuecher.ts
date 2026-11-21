/**
 * Die Lehrkraft-Handbücher — EINE Liste für alle Stellen, die sie anbieten
 * (Johannes, 07.09.2026: „Lehrerhandbuch muss auch bei meine klassen
 * downloadbar sein").
 *
 * ★★★★ WARUM EINE LISTE: Bis heute standen die Handbücher an drei Stellen,
 * jede mit eigenem Text und eigener Größenangabe - die »Im Griff«-Seite
 * (zwei Verweise samt „(PDF, 10 MB)"), die Tastenflow-Lehrer-Hilfe (eigener
 * Lade-Knopf) und nirgends sonst. Drei Fassungen derselben Sache, von denen
 * beim nächsten neuen Handbuch zwei zurückblieben
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ★★★ DIE GRÖSSEN WERDEN GEMESSEN, NICHT GESCHÄTZT. `bytes` steht hier als
 * Zahl, und `tests/handbuecher.test.ts` hält sie gegen die echte Datei in
 * `public/`. Eine Angabe „(PDF, 10 MB)" im Fließtext veraltet beim ersten
 * Nachdruck, ohne dass es jemand bemerkt; dieser Test fällt dann durch.
 *
 * ⚠️ DER WEG IST GESCHÜTZT. `/handbuecher/…` liefert ohne Anmeldung 404 - und
 * zwar absichtlich (`pb_hooks/geschuetzte_inhalte.pb.js`, „nur angemeldete
 * Lehrer/Schüler", Johannes 03.08.). Wer eine dieser Dateien lädt, holt vorher
 * den Datei-Ausweis; das erledigt `HandbuchKnopf`.
 *
 * ★★★ DIE EINE AUSNAHME: `oeffentlich: true` (19.09.2026, das Tastenflow-Plakat).
 * Die Regel vom 03.08. schützt Handbücher, weil sie „Lehrmaterial, kein
 * Werbematerial" sind ([[feedback_handbuecher_nur_angemeldet]]). Ein Plakat,
 * das in einer Schule oder Einrichtung ausgedruckt und aufgehängt werden soll,
 * IST Werbematerial - und es steht auch in der Hilfe der Kinder, die Gäste
 * ohne Anmeldung sehen. Ein so gekennzeichneter Eintrag liegt darum offen in
 * `pb_public` (Adresse `/<datei>`, siehe `downloadAdresse`); das Deploy-Skript
 * schliesst ihn NICHT aus, und `tests/lehrinhalte-schutz.test.ts` prüft beide
 * Richtungen: jeder andere Eintrag bleibt geschützt, und öffentlich ist genau
 * das Plakat.
 */
import type { LwProgramKey } from "./klassen";
import type { Lang } from "../typing/account";
import { istGeruestSprache } from "../typing/sprachRegister";

/**
 * Die Sprachen, in denen ein Handbuch angeboten wird (= Bedienungssprachen).
 * ★ E15 (26.09.2026): „fr" dazu - der französische Lehrgang hat ein eigenes
 * Handbuch (`scripts/tastenflow-handbuch-fr.mts`).
 *
 * ★ ES-F2 (27.09.2026): „es" dazu - GERÜST NUR, kein eigenes spanisches
 * Handbuch (kommt mit ES-O). `Handbuch` bekommt bewusst KEIN eigenes `es?`-
 * Feld - {@link handbuchInSprache} bildet „es" auf die englische Fassung ab,
 * wie „fr" es ohne eigene Datei auch täte.
 */
type Sprache = Lang;

/**
 * ★★ DIE ENGLISCHE FASSUNG EINES EINTRAGS (EN7, 19.09.2026).
 *
 * Zwei Fälle, EIN Feld:
 *  · MIT `datei`: Es gibt eine eigene englische Ausgabe (Tastenflow). Die
 *    englische Bedienung bietet sie an - mit eigenem Speichernamen und eigener,
 *    GEMESSENER Größe (`tests/handbuecher.test.ts` hält sie gegen `public/`).
 *  · OHNE `datei`: Das Heft gibt es nur deutsch (»Im Griff«). Die englische
 *    Bedienung nennt es englisch und sagt dazu, dass es deutsch ist - eine
 *    Lehrkraft soll vor dem Laden wissen, was sie bekommt.
 *
 * ⚠️ Nur die Tastenflow-Bedienung kennt eine englische Sprache; alle anderen
 * Stellen (»Im Griff«-Seite) haben keinen aktiven Provider und bekommen immer
 * die deutsche Zeile - genau wie vorher.
 */
export interface HandbuchEnglisch {
  titel: string;
  hinweis: string;
  /** Eigene englische Datei unter `/handbuecher/` - fehlt, wenn es nur die deutsche gibt. */
  datei?: string;
  speicherName?: string;
  bytes?: number;
}

export interface Handbuch {
  /** Dateiname unter `/handbuecher/` (öffentlich: direkt unter `/`) - ein Slug, der NIE umbenannt wird. */
  datei: string;
  /** Was in der Liste steht. */
  titel: string;
  /** Ein Satz: für wen und wofür. */
  hinweis: string;
  /** Zu welchem Programm es gehört (für die Gruppierung). */
  programm: LwProgramKey;
  /**
   * Der Name, unter dem die Datei gespeichert wird.
   * ★ Ohne Rollenwörter im SICHTBAREN Namen (Johannes, 01.09.2026) - die
   * Adresse bleibt `…-lehrerhandbuch.pdf`, weil jeder bestehende Verweis
   * daran hängt.
   */
  speicherName: string;
  /** Gemessene Größe in Byte - der Test hält sie gegen `public/`. */
  bytes: number;
  /** ★ EN7: die englische Fassung dieses Eintrags (siehe {@link HandbuchEnglisch}). */
  en?: HandbuchEnglisch;
  /**
   * ★ E15 (26.09.2026): die französische Fassung - dieselbe Bauart wie `en`.
   * MIT `datei`: eine eigene französische Ausgabe (Tastenflow-Handbuch). OHNE
   * `datei`: es gibt keine französische Datei - dann bietet die französische
   * Bedienung die ENGLISCHE Ausgabe an, wo es eine gibt (eine Lehrkraft in
   * Frankreich liest eher Englisch als Deutsch), sonst die deutsche; der
   * Titel sagt jeweils dazu, in welcher Sprache das Heft ist.
   */
  fr?: HandbuchEnglisch;
  /**
   * ★ ES-O (27.09.2026): die spanische Fassung - dieselbe Bauart. Eine
   * spanische DATEI gibt es noch nicht (Handbuch und Plakat sind eigene
   * Etappen); ohne `datei` bietet die spanische Bedienung die ENGLISCHE
   * Ausgabe an, wo es eine gibt, sonst die deutsche - der spanische Titel sagt
   * jeweils dazu, in welcher Sprache das Heft ist.
   */
  es?: HandbuchEnglisch;
  /**
   * ★ O-IT (02.10.2026): die italienische Fassung - wie `fr`/`es` ohne
   * eigene `datei`: die italienische Bedienung bietet die ENGLISCHE Ausgabe an
   * (Tastenflow-Handbuch, Plakat), sonst die deutsche; der Titel sagt dazu, in
   * welcher Sprache das Heft ist.
   */
  it?: HandbuchEnglisch;
  /**
   * ★ O-PL (02.10.2026): die polnische Fassung - wie `it` ohne eigene `datei`:
   * die polnische Bedienung bietet die ENGLISCHE Ausgabe an (Tastenflow-
   * Handbuch, Plakat), sonst die deutsche; der Titel sagt dazu, in welcher
   * Sprache das Heft ist („po angielsku", „po niemiecku").
   */
  pl?: HandbuchEnglisch;
  /**
   * ★ O-TR (02.10.2026): die türkische Fassung - wie `pl` ohne eigene `datei`:
   * die türkische Bedienung bietet die ENGLISCHE Ausgabe an (Tastenflow-
   * Handbuch, Plakat), sonst die deutsche; der Titel sagt dazu, in welcher
   * Sprache das Heft ist ("(İngilizce)", "(Almanca)").
   */
  tr?: HandbuchEnglisch;
  /**
   * ★ O-CS (03.10.2026): die tschechische Fassung - wie `tr` ohne eigene `datei`:
   * die tschechische Bedienung bietet die ENGLISCHE Ausgabe an (Tastenflow-
   * Handbuch, Plakat), sonst die deutsche; der Titel sagt dazu, in welcher
   * Sprache das Heft ist („v angličtině", „v němčině").
   */
  cs?: HandbuchEnglisch;
  /**
   * ★ O3 (30.10.2026): die neun Wege - dieselbe Bauart, mit eigener Datei (`erzeuge-tastenflow-handbuch.mts --sv --pdf`).
   * ⚠️ `bytes: 0` heisst: das PDF ist noch nicht erzeugt (nur am Mac möglich) und nichts ist gemessen. Bis dahin bietet
   * {@link handbuchInSprache} die ENGLISCHE Ausgabe an, wie vorher - eine erfundene Grösse gibt es nicht.
   */
  bg?: HandbuchEnglisch;
  el?: HandbuchEnglisch;
  hu?: HandbuchEnglisch;
  nl?: HandbuchEnglisch;
  pt?: HandbuchEnglisch;
  br?: HandbuchEnglisch;
  ro?: HandbuchEnglisch;
  sv?: HandbuchEnglisch;
  uk?: HandbuchEnglisch;
  /**
   * ★ 19.09.2026: `true` = für alle, ohne Anmeldung - die Datei liegt offen
   * unter `/<datei>` statt unter `/handbuecher/`. NUR für Werbematerial (das
   * Plakat); ein Handbuch oder eine Checkliste bekommt das nie
   * (`tests/lehrinhalte-schutz.test.ts` nennt die erlaubten Dateien).
   */
  oeffentlich?: boolean;
}

export const HANDBUECHER: Handbuch[] = [
  {
    datei: "tastenflow-lehrerhandbuch.pdf",
    titel: "Tastenflow-Handbuch",
    hinweis:
      "Für Lehrkräfte, die mit ihrer Klasse das Zehnfingersystem üben: Klasse einrichten, Klassenstatistik, die Tippchallenge Schritt für Schritt, der Leistungswert und die Werte für eine Note.",
    programm: "tippen",
    speicherName: "Tastenflow-Handbuch-für-Lehrkräfte.pdf",
    bytes: 1103388,
    // ★ EN7 (19.09.2026): die englische Ausgabe - `erzeuge-tastenflow-handbuch.mts --en --pdf`.
    // Glossar §3.13: Handbuch ⇒ *guide*, Pädagoginnen und Pädagogen ⇒ *teachers*.
    en: {
      titel: "Tastenflow guide",
      hinweis:
        "For teachers practising touch typing with their class: setting up the class, class statistics, the Typing Challenge step by step, the challenge score and the figures behind a mark.",
      datei: "tastenflow-handbuch-en.pdf",
      speicherName: "Tastenflow-guide-for-teachers.pdf",
      // ★ E8 (24.09.2026): neu erzeugt (`npx tsx scripts/erzeuge-tastenflow-
      // handbuch.mts --en --pdf`) nach dem neuen Absatz „A class on the
      // English course order" in Kapitel 4.1 - gemessen, nicht geraten.
      bytes: 1064771,
    },
    // ★ E15 (26.09.2026): die französische Ausgabe - `erzeuge-tastenflow-handbuch.mts --fr --pdf`.
    // Sie beschreibt den Lernweg „fr" (Reihenfolge, AZERTY, Totasten, 1990). Glossar §9.2:
    // Handbuch ⇒ *guide*, Tippchallenge ⇒ *Défi*, Lehrkraft ⇒ Doppelform (F10).
    fr: {
      titel: "Guide Tastenflow",
      hinweis:
        "Pour les enseignants et enseignantes qui apprennent la frappe à dix doigts avec leur classe : préparer la classe, les claviers français, les statistiques, le Défi étape par étape, le score et les valeurs pour une évaluation.",
      datei: "tastenflow-handbuch-fr.pdf",
      speicherName: "Guide-Tastenflow-pour-les-enseignants.pdf",
      // Gemessen nach `--fr --pdf` (34 Seiten), nicht geraten. ★ E10b-2
      // (26.09.2026): neu erzeugt - Anhang A zeigt jetzt die 24 Lektionen,
      // der Défi-Niveau „Code informatique" steht in Kapitel 6.2. Feinschliff
      // fr (26.09.2026): neu erzeugt nach den Wortlaut-Änderungen und den Kinder-Serien.
      // ★ W2a (28.09.2026): neu erzeugt - Grossbuchstaben mit Akzent je Zeichen, Leerzeichen vor ; : ! ? mit und ohne.
      bytes: 1155293,
    },
    // ★ ES-H (27.09.2026): die spanische Ausgabe - `erzeuge-tastenflow-handbuch.mts --es --pdf`.
    // Sie beschreibt den Lernweg „es" (zwei Tastaturen, ¿ ? ¡ ! als Paar, RAE 2010).
    // Glossar §7: Handbuch ⇒ *guía*, Lehrkraft ⇒ *docente*. Nach jedem Merge einer
    // Korpus-Charge: `bash scripts/handbuch-nach-merge.sh es` (misst die Bytes neu).
    es: {
      titel: "Guía de Tastenflow",
      hinweis:
        "Para docentes que practican la mecanografía con su clase: preparar la clase, los teclados de España y Latinoamérica, las estadísticas, el Reto paso a paso, la puntuación y los valores para una evaluación.",
      datei: "tastenflow-handbuch-es.pdf",
      speicherName: "Guia-de-Tastenflow-para-docentes.pdf",
      bytes: 1155704,
    },
    // ★ IT-H (09.10.2026): die italienische Ausgabe - `erzeuge-tastenflow-handbuch.mts --it --pdf`.
    // Sie beschreibt den Lernweg „it" (Tastatur it und Mac-QZERTY, grosse Akzentbuchstaben).
    // Glossar §2.6: Handbuch ⇒ *guida*, „Tastenflow: guida per insegnanti". UNSICHTBAR wie der
    // ganze Weg „it": nur die italienische Bedienung bietet sie an, und die ist abgeschaltet.
    // Nach jedem Merge einer Korpus-Charge: `bash scripts/handbuch-nach-merge.sh it`.
    it: {
      titel: "Guida di Tastenflow",
      hinweis:
        "Per insegnanti che praticano la dattilografia a dieci dita con la classe: preparare la classe, la tastiera italiana e quella del Mac, le statistiche, la Sfida passo per passo, il punteggio e i valori per una valutazione.",
      datei: "tastenflow-handbuch-it.pdf",
      speicherName: "Guida-di-Tastenflow-per-insegnanti.pdf",
      bytes: 1152550,
    },
    // ★ O-PL (02.10.2026): Glossar §2.6 - „podręcznik dla nauczycieli", immer
    // mit „dla nauczycieli" (sonst das Schulbuch); die Datei ist die englische.
    // ★ PL-H (09.10.2026): die polnische Ausgabe - `erzeuge-tastenflow-handbuch.mts --pl --pdf`.
    // Sie beschreibt den Lernweg „pl" (Tastatur `pl`, polnische Buchstaben mit dem rechten Alt).
    // UNSICHTBAR wie der ganze Weg „pl": nur die polnische Bedienung bietet sie an, und die ist abgeschaltet.
    // Nach jedem Merge einer Korpus-Charge: `bash scripts/handbuch-nach-merge.sh pl`.
    pl: {
      titel: "Tastenflow - podręcznik dla nauczycieli",
      hinweis:
        "Dla nauczycieli, którzy ćwiczą z klasą pisanie dziesięcioma palcami: przygotowanie klasy, klawiatura polska i polskie litery, statystyki, Wyzwanie krok po kroku, wynik i wartości, na których można oprzeć ocenę.",
      datei: "tastenflow-handbuch-pl.pdf",
      speicherName: "Tastenflow-podrecznik-dla-nauczycieli.pdf",
      bytes: 1216734,
    },
    // ★ O-TR (02.10.2026): Glossar §2.6 - "Öğretmen kılavuzu".
    // ★ TR-H (10.10.2026): die türkische Ausgabe - `erzeuge-tastenflow-handbuch.mts --tr --pdf`.
    // Sie beschreibt den Lernweg „tr" (Türkçe Q, ç ğ ı ö ş ü auf eigenen Tasten, i und ı als zwei Tasten, Totaste ^).
    // UNSICHTBAR wie der ganze Weg „tr": nur die türkische Bedienung bietet sie an, und die ist abgeschaltet.
    // Nach jedem Merge einer Korpus-Charge: `bash scripts/handbuch-nach-merge.sh tr`.
    tr: {
      titel: "Tastenflow öğretmen kılavuzu",
      hinweis:
        "Sınıfıyla on parmak klavye çalışan öğretmenler için: sınıfı hazırlama, Türkçe Q klavye ve Türkçe harfler, sınıf istatistikleri, adım adım Yarışma, yarışma puanı ve not vermek için kullanılabilecek değerler.",
      datei: "tastenflow-handbuch-tr.pdf",
      speicherName: "Tastenflow-ogretmen-kilavuzu.pdf",
      bytes: 1235682,
    },
    // ★ O-CS (03.10.2026): Glossar §2.6 - „příručka pro vyučující".
    // ★ CS-H (10.10.2026): die tschechische Ausgabe - `erzeuge-tastenflow-handbuch.mts --cs --pdf`.
    // Sie beschreibt den Lernweg „cs" (Tastaturen cs und cs-qwerty, Zahlenreihe mit Buchstaben, Háček und Čárka als Totasten).
    // UNSICHTBAR wie der ganze Weg „cs": nur die tschechische Bedienung bietet sie an, und die ist abgeschaltet.
    // Nach jedem Merge einer Korpus-Charge: `bash scripts/handbuch-nach-merge.sh cs`.
    cs: {
      titel: "Tastenflow - příručka pro vyučující",
      hinweis:
        "Pro vyučující, kteří se třídou procvičují psaní všemi deseti: příprava třídy, česká klávesnice a písmena s háčkem a čárkou, statistika třídy, Výzva krok za krokem, skóre a hodnoty, o které se lze při známkování opřít.",
      datei: "tastenflow-handbuch-cs.pdf",
      speicherName: "Tastenflow-prirucka-pro-vyucujici.pdf",
      bytes: 1240694,
    },
    // ★ O3 (30.10.2026): die neun Wege (`scripts/tastenflow-handbuch-neun.mts`). UNSICHTBAR wie die Wege selbst.
    // bytes: 0 = noch nicht erzeugt (PDF nur am Mac); danach `bash scripts/handbuch-nach-merge.sh <weg>` trägt die Grösse ein.
    bg: {
      titel: "Tastenflow: наръчник за учители",
      hinweis:
        "Писане с десет пръста с целия клас: подготовка на класа, упражнения, проследяване на напредъка, Предизвикателство и стойностите, на които можете да основете оценката си.",
      datei: "tastenflow-handbuch-bg.pdf",
      speicherName: "Tastenflow-narachnik-za-uchiteli.pdf",
      bytes: 1655480,
    },
    el: {
      titel: "Tastenflow: οδηγός για εκπαιδευτικούς",
      hinweis:
        "Πληκτρολόγηση με τα δέκα δάχτυλα στην τάξη: προετοιμασία της τάξης, εξάσκηση, ανάγνωση της προόδου, μια Πρόκληση και οι τιμές πάνω στις οποίες μπορείτε να στηρίξετε την αξιολόγηση.",
      datei: "tastenflow-handbuch-el.pdf",
      speicherName: "Tastenflow-odigos-gia-ekpaideftikous.pdf",
      bytes: 1841435,
    },
    hu: {
      titel: "Tastenflow - kézikönyv pedagógusoknak",
      hinweis:
        "Tízujjas vakírás az osztályban: az osztály előkészítése, gyakorlás, a haladás nyomon követése, a Kihívás elindítása és azoknak az értékeknek az áttekintése, amelyekre az értékelés támaszkodhat.",
      datei: "tastenflow-handbuch-hu.pdf",
      speicherName: "Tastenflow-kezikonyv-pedagogusoknak.pdf",
      bytes: 1272118,
    },
    nl: {
      titel: "Tastenflow: handleiding voor leerkrachten",
      hinweis:
        "Met de klas leren typen met tien vingers: de klas voorbereiden, oefenen, de voortgang lezen, een Uitdaging starten en de waarden lezen waarop een beoordeling kan steunen.",
      datei: "tastenflow-handbuch-nl.pdf",
      speicherName: "Tastenflow-handleiding-voor-leerkrachten.pdf",
      bytes: 1226648,
    },
    pt: {
      titel: "Tastenflow: guia para docentes",
      hinweis:
        "Aprender a escrever com os dez dedos, em turma: preparar a turma, praticar, ler os progressos, lançar um Desafio e ler os valores que podem apoiar a avaliação.",
      datei: "tastenflow-handbuch-pt.pdf",
      speicherName: "Tastenflow-guia-para-docentes.pdf",
      bytes: 1212896,
    },
    br: {
      titel: "Tastenflow: manual para docentes",
      hinweis:
        "Digitação com dez dedos na sua turma: preparar a turma, praticar, acompanhar o progresso, aplicar um Desafio e ler os valores que podem apoiar a avaliação.",
      datei: "tastenflow-handbuch-br.pdf",
      speicherName: "Tastenflow-manual-para-docentes.pdf",
      bytes: 1215928,
    },
    ro: {
      titel: "Tastenflow: ghid pentru cadrele didactice",
      hinweis:
        "Scrierea cu zece degete, împreună cu clasa: pregătirea clasei, exercițiul, citirea progresului, pornirea unei Provocări și citirea valorilor pe care se poate sprijini evaluarea.",
      datei: "tastenflow-handbuch-ro.pdf",
      speicherName: "Tastenflow-ghid-pentru-cadrele-didactice.pdf",
      bytes: 1218708,
    },
    sv: {
      titel: "Tastenflow: lärarhandledning",
      hinweis:
        "Tangentbordsträning med tio fingrar i klassen: förbereda klassen, öva, läsa av framstegen, starta Utmaningen och läsa de värden som bedömningen kan bygga på.",
      datei: "tastenflow-handbuch-sv.pdf",
      speicherName: "Tastenflow-lararhandledning.pdf",
      bytes: 1206303,
    },
    uk: {
      titel: "Tastenflow: посібник для педагогів",
      hinweis:
        "Десятипальцевий метод друку з усім класом: підготувати клас, тренуватися, читати поступ, запускати Виклик і читати значення, на які можна спиратися під час оцінювання.",
      datei: "tastenflow-handbuch-uk.pdf",
      speicherName: "Tastenflow-posibnyk-dlia-pedahohiv.pdf",
      bytes: 1717636,
    },
  },
  /*
    ★ 19.09.2026 (Johannes: „Tastenflow Plakat zum Aufhängen in der Schule als
    PDF, in der Hilfe unter dem Handbuch"): ein Plakat zum Ausdrucken, kein Heft.
    Es steht in DIESER Liste, weil sie die EINE Liste aller Lehrkraft-Downloads
    ist (ein Knopf, eine gemessene Größe, ein Kasten „Downloads").
    ★★ Noch am selben Abend ÖFFENTLICH (Johannes: „Ziel: dass es jemand in einer
    Einrichtung ausdruckt und aufhängt … und in der Hilfe bei den Schülern?"):
    Werbematerial, kein Lehrmaterial - `oeffentlich: true`, siehe Dateikopf.
    ⚠️ Es MUSS hinter dem Handbuch stehen: `handbuecherFuer("tippen")[0]` ist an
    vier Stellen DAS Handbuch. Gefunden wird es über `tastenflowPlakat()`.
    Quelle und Erzeuger: `scripts/plakat/`, `scripts/erzeuge-tastenflow-plakat.mjs`.
  */
  {
    datei: "tastenflow-plakat.pdf",
    titel: "Tastenflow-Plakat zum Aufhängen in der Schule",
    hinweis:
      "Zum Ausdrucken und Aufhängen, A3 hochkant - für die Wand im Klassenzimmer, im Lehrerzimmer oder in Ihrer Einrichtung, mit QR-Code zu tastenflow.org. Für alle frei, auch ohne Anmeldung.",
    programm: "tippen",
    speicherName: "Tastenflow-Plakat-zum-Aufhängen-in-der-Schule.pdf",
    bytes: 451321,
    oeffentlich: true,
    // ★ 21.09.2026 (Johannes: „Plakat brauchen wir auf englisch! wer die englische
    // Oberfläche benutzt soll auch das englische Plakat bekommen"): eine eigene
    // englische Ausgabe, wie beim Handbuch. Erzeugt mit
    // `node scripts/erzeuge-tastenflow-plakat.mjs --en`; ebenfalls öffentlich.
    en: {
      titel: "Tastenflow poster for hanging up at school",
      hinweis:
        "To print and put up, A3 portrait - for the wall of a classroom, a staff room or your organisation, with a QR code to tastenflow.org. Free for everyone, no sign-in needed.",
      datei: "tastenflow-plakat-en.pdf",
      speicherName: "Tastenflow-poster-for-hanging-up-at-school.pdf",
      bytes: 421437,
    },
    // ★ E15 (26.09.2026): jetzt eine eigene französische Ausgabe - das Bild
    // der Oberfläche (AZERTY, „Un panier de pommes") kommt aus
    // `scripts/plakat/bild-oberflaeche-fr.mjs`, erzeugt mit
    // `node scripts/erzeuge-tastenflow-plakat.mjs --fr`; ebenfalls öffentlich.
    fr: {
      titel: "Affiche Tastenflow à accrocher à l'école",
      hinweis:
        "À imprimer et à accrocher, A3 portrait - pour une salle de classe, la salle des enseignants ou votre établissement, avec un code QR vers tastenflow.org. Libre pour tout le monde, sans connexion.",
      datei: "tastenflow-plakat-fr.pdf",
      speicherName: "Affiche-Tastenflow-à-accrocher-à-l-école.pdf",
      bytes: 453392,
    },
    // ★ ES-H (28.09.2026): jetzt eine eigene spanische Ausgabe - das Bild
    // der Oberfläche (Tastatur España ISO, „Carmen vive en Valencia…") kommt
    // aus `scripts/plakat/bild-oberflaeche-es.mjs` (gegen die LIVE-Seite,
    // kein Dev-Server), erzeugt mit
    // `node scripts/erzeuge-tastenflow-plakat.mjs --es`; ebenfalls öffentlich.
    es: {
      titel: "Cartel de Tastenflow para colgar en la escuela",
      hinweis:
        "Para imprimir y colgar, A3 vertical - para la pared de un aula, de la sala del profesorado o de su centro, con un código QR a tastenflow.org. Libre para todo el mundo, sin iniciar sesión.",
      datei: "tastenflow-plakat-es.pdf",
      speicherName: "Cartel-de-Tastenflow-para-colgar-en-la-escuela.pdf",
      bytes: 462748,
    },
    it: {
      titel: "Poster di Tastenflow da appendere a scuola",
      hinweis:
        "Da stampare e appendere, A3 verticale - per la parete di un'aula, della sala insegnanti o di un istituto, con un codice QR per tastenflow.org. Libero per tutti, senza accesso.",
      datei: "tastenflow-plakat-it.pdf",
      speicherName: "Poster-di-Tastenflow-da-appendere-a-scuola.pdf",
      bytes: 446499,
    },
    pl: {
      titel: "Plakat Tastenflow do powieszenia w szkole",
      hinweis:
        "Do wydrukowania i powieszenia, A3 w pionie - na ścianę klasy, pokoju nauczycielskiego albo placówki, z kodem QR prowadzącym do tastenflow.org. Dostępny dla wszystkich, bez logowania.",
      datei: "tastenflow-plakat-pl.pdf",
      speicherName: "Plakat-Tastenflow-do-powieszenia-w-szkole.pdf",
      bytes: 466360,
    },
    tr: {
      titel: "Okulda asmak için Tastenflow afişi",
      hinweis:
        "Yazdırıp asmak için, A3 dikey - sınıfın, öğretmenler odasının veya kurumunuzun duvarı için, tastenflow.org adresine giden bir QR kodu ile. Herkese açık, giriş yapmak gerekmez.",
      datei: "tastenflow-plakat-tr.pdf",
      speicherName: "Okulda-asmak-icin-Tastenflow-afisi.pdf",
      bytes: 453908,
    },
    cs: {
      titel: "Plakát Tastenflow na zeď ve škole",
      hinweis:
        "K vytištění a pověšení, A3 na výšku - na zeď třídy, sborovny nebo školy, s QR kódem, který vede na tastenflow.org. Přístupný všem, bez přihlášení.",
      datei: "tastenflow-plakat-cs.pdf",
      speicherName: "Plakat-Tastenflow-na-zed-ve-skole.pdf",
      bytes: 452657,
    },
    // ★ 06.11.2026: bg/el/uk/hu - eigene Plakate in der Sprache (`erzeuge-tastenflow-plakat.mjs --bg` usw.).
    bg: {
      titel: "Плакат на Tastenflow за окачване в училище",
      hinweis:
        "За отпечатване и окачване, A3 вертикално - за стената на класна стая, учителска стая или на вашата организация, с QR код към tastenflow.org. Свободен за всички, без вход.",
      datei: "tastenflow-plakat-bg.pdf",
      speicherName: "Plakat-na-Tastenflow-za-okachvane-v-uchilishte.pdf",
      bytes: 437794,
    },
    el: {
      titel: "Αφίσα του Tastenflow για κρέμασμα στο σχολείο",
      hinweis:
        "Για εκτύπωση και κρέμασμα, A3 κατακόρυφα - για τον τοίχο μιας τάξης, του γραφείου των εκπαιδευτικών ή του οργανισμού σας, με κωδικό QR προς tastenflow.org. Ελεύθερη για όλους, χωρίς σύνδεση.",
      datei: "tastenflow-plakat-el.pdf",
      speicherName: "Afisa-tou-Tastenflow-gia-kremasma-sto-scholeio.pdf",
      bytes: 481982,
    },
    uk: {
      titel: "Плакат Tastenflow, щоб повісити в школі",
      hinweis:
        "Для друку й розвішування, A3 вертикально - для стіни класу, вчительської чи вашого закладу, з QR-кодом на tastenflow.org. Вільний для всіх, без входу.",
      datei: "tastenflow-plakat-uk.pdf",
      speicherName: "Plakat-Tastenflow-shchob-povisyty-v-shkoli.pdf",
      bytes: 431098,
    },
    hu: {
      titel: "Tastenflow-plakát az iskolai kifüggesztéshez",
      hinweis:
        "Nyomtatásra és kifüggesztésre, A3 álló - osztályterem, tanári szoba vagy az Ön intézménye falára, a tastenflow.org címre vezető QR-kóddal. Mindenkinek szabad, bejelentkezés nélkül.",
      datei: "tastenflow-plakat-hu.pdf",
      speicherName: "Tastenflow-plakat-az-iskolai-kifuggeszteshez.pdf",
      bytes: 456370,
    },
    // ★ PL-NL-PT-BR-RO-SV (06.11.2026): eigene Plakate in der Sprache (Bild der Oberfläche aus
    // `scripts/plakat/bild-oberflaeche-nl-pt-br-ro-sv.mjs`, erzeugt mit `node scripts/erzeuge-tastenflow-plakat.mjs --<xx>`).
    nl: {
      titel: "Tastenflow-poster om op te hangen op school",
      hinweis:
        "Om af te drukken en op te hangen, A3 staand - voor de muur van een klaslokaal, de lerarenkamer of je school, met een QR-code naar tastenflow.org/nl. Vrij voor iedereen, zonder inloggen.",
      datei: "tastenflow-plakat-nl.pdf",
      speicherName: "Tastenflow-poster-om-op-te-hangen-op-school.pdf",
      bytes: 440473,
    },
    pt: {
      titel: "Cartaz do Tastenflow para afixar na escola",
      hinweis:
        "Para imprimir e afixar, A3 ao alto - para a parede de uma sala de aula, da sala de professores ou da sua escola, com um código QR para tastenflow.org/pt. Livre para todos, sem iniciar sessão.",
      datei: "tastenflow-plakat-pt.pdf",
      speicherName: "Cartaz-do-Tastenflow-para-afixar-na-escola.pdf",
      bytes: 460401,
    },
    br: {
      titel: "Cartaz do Tastenflow para pendurar na escola",
      hinweis:
        "Para imprimir e pendurar, A3 na vertical - para a parede de uma sala de aula, da sala dos professores ou da sua escola, com um código QR para tastenflow.org/pt-br. Livre para todo mundo, sem fazer login.",
      datei: "tastenflow-plakat-br.pdf",
      speicherName: "Cartaz-do-Tastenflow-para-pendurar-na-escola.pdf",
      bytes: 458705,
    },
    ro: {
      titel: "Afișul Tastenflow de pus pe perete la școală",
      hinweis:
        "Pentru imprimat și pus pe perete, A3 vertical - pentru peretele unei săli de clasă, al cancelariei sau al școlii tale, cu un cod QR spre tastenflow.org/ro. Liber pentru toată lumea, fără autentificare.",
      datei: "tastenflow-plakat-ro.pdf",
      speicherName: "Afisul-Tastenflow-de-pus-pe-perete-la-scoala.pdf",
      bytes: 448849,
    },
    sv: {
      titel: "Tastenflow-affisch att sätta upp i skolan",
      hinweis:
        "Att skriva ut och sätta upp, A3 stående - för väggen i ett klassrum, lärarrummet eller din skola, med en QR-kod till tastenflow.org/sv. Fri för alla, utan inloggning.",
      datei: "tastenflow-plakat-sv.pdf",
      speicherName: "Tastenflow-affisch-att-satta-upp-i-skolan.pdf",
      bytes: 453523,
    },
  },
];

/** Die Handbücher eines Programms (leer, wo es noch keines gibt). */
export function handbuecherFuer(programm: LwProgramKey): Handbuch[] {
  return HANDBUECHER.filter((h) => h.programm === programm);
}

/** Der Dateiname des Tastenflow-Plakats - ein Slug, der nie umbenannt wird. */
export const PLAKAT_DATEI = "tastenflow-plakat.pdf";

/**
 * Das Tastenflow-Plakat aus der EINEN Liste - gefunden über den Dateinamen,
 * nicht über die Stelle (wirft bei Tippfehler). Lehrer-Hilfe, Kinder-Hilfe
 * und Kasten nehmen Titel, Speichername und Größe von hier.
 */
export function tastenflowPlakat(): Handbuch {
  const h = HANDBUECHER.find((x) => x.datei === PLAKAT_DATEI);
  if (!h) throw new Error("Kein Tastenflow-Plakat in HANDBUECHER");
  return h;
}

/**
 * ★ Wo die Datei zu holen ist (19.09.2026): öffentlich direkt unter
 * `/<datei>` (pb_public), sonst unter `/handbuecher/<datei>` - geschützt,
 * nur mit Datei-Ausweis. `HandbuchKnopf` und die Kinder-Hilfe fragen hier.
 */
export function downloadAdresse(h: Handbuch): string {
  return `/${h.datei}`;
}

/**
 * ★★ Ein Eintrag, wie ihn die Bedienungssprache anbietet (EN7, 19.09.2026).
 *
 * Deutsch: der Eintrag unverändert. Englisch: englischer Titel und Satz - und,
 * wo es eine englische Ausgabe gibt, DEREN Datei, Speichername und Größe. So
 * bleibt die Liste EINE Liste; `HandbuchKnopf` fragt nur hier nach und lädt,
 * was herauskommt. Der Schutz ist derselbe: jede Datei liegt unter
 * `/handbuecher/`, nur für Angemeldete - ausser einem Eintrag mit
 * `oeffentlich: true` (das Plakat; `oeffentlich` wird mitgenommen).
 */
export function handbuchInSprache(h: Handbuch, gewaehlt: Sprache = "de"): Handbuch {
  // ★ G2a (02.10.2026): it/pl/tr/cs haben noch kein eigenes Heft und bekommen
  // die ENGLISCHE Fassung - nie die deutsche, die `h[sprache]` sonst liefern würde.
  // ★ O-TR (02.10.2026): tr hat jetzt eigene Titel (`h.tr`), die Datei bleibt englisch.
  // ★ O-CS (03.10.2026): cs hat eigene Titel (`h.cs`), die Datei bleibt englisch -
  // damit hat jede Sprache ihren Zweig, kein Rückfall mehr.
  // RÜCKFALL-EN (G2-NEUN): die neun Sprachen des Gerüsts haben noch kein Heft und keine Titel - sie bekommen die
  // ENGLISCHE Fassung, nie die deutsche (`if (!fassung) return h` unten gäbe sonst das deutsche Heft).
  // ★ O3 (30.10.2026): mit einer eigenen, GEMESSENEN Datei bekommen sie diese.
  const eigen = istGeruestSprache(gewaehlt) ? h[gewaehlt] : undefined;
  const sprache = istGeruestSprache(gewaehlt) && !(eigen?.datei && eigen.bytes) ? "en" : gewaehlt;
  if (sprache === "de") return h;
  // ★ ES-O (27.09.2026): spanischer Titel und Satz (`es`); eine spanische
  // Datei gibt es noch nicht - bis dahin die englische, wo es eine gibt.
  const fassung = h[sprache];
  if (!fassung) return h;
  // ★ E15: ohne eigene französische (★ ES-O: oder spanische) Datei die englische, wo es eine gibt.
  const datei = fassung.datei
    ? fassung
    : (sprache === "fr" || sprache === "es" || sprache === "it" || sprache === "pl" || sprache === "tr" || sprache === "cs") && h.en?.datei
      ? h.en
      : undefined;
  return {
    ...h,
    titel: fassung.titel,
    hinweis: fassung.hinweis,
    datei: datei?.datei ?? h.datei,
    speicherName: datei?.speicherName ?? h.speicherName,
    bytes: datei?.datei ? (datei.bytes ?? h.bytes) : h.bytes,
  };
}

/**
 * Größe als Satzteil - „742 KB" / „11,4 MB" (englisch „11.4 MB").
 *
 * ★ Warum das überhaupt dasteht: 11 MB in einem Schul-WLAN sind eine
 * Entscheidung, keine Nebensache. Eine Lehrkraft soll vor dem Antippen wissen,
 * worauf sie sich einlässt.
 */
export function groesse(bytes: number, sprache: Sprache = "de"): string {
  // ★ E15 (26.09.2026): als Tabelle - Französisch mit Komma und „Mo"/„Ko"
  // (Bauplan §9.1: Zahlen französisch).
  const art = GROESSE_ART[sprache];
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) {
    const zahl = mb.toFixed(1);
    return `${art.komma ? zahl.replace(".", ",") : zahl} ${art.mb}`;
  }
  return `${Math.round(bytes / 1024)} ${art.kb}`;
}

const GROESSE_ART: Record<Sprache, { komma: boolean; mb: string; kb: string }> = {
  de: { komma: true, mb: "MB", kb: "KB" },
  en: { komma: false, mb: "MB", kb: "KB" },
  fr: { komma: true, mb: "Mo", kb: "Ko" },
  // ★ ES-O (27.09.2026): Dezimalpunkt wie überall in der spanischen Bedienung (RAE 2010).
  es: { komma: false, mb: "MB", kb: "KB" },
  // ★ O-IT: Dezimalkomma (Glossar Regel 5).
  it: { komma: true, mb: "MB", kb: "KB" },
  // ★ O-PL: Dezimalkomma (Glossar Regel 5, „1,2 MB").
  pl: { komma: true, mb: "MB", kb: "KB" },
  // ★ O-TR: Dezimalkomma (Glossar Regel 5, "1,2 MB").
  tr: { komma: true, mb: "MB", kb: "KB" },
  // ★ O-CS: Dezimalkomma (Glossar Regel 5, „1,2 MB").
  cs: { komma: true, mb: "MB", kb: "KB" },
  // ★ O3 (30.10.2026): alle neun mit Dezimalkomma (Glossare, Regel Zahlen: „1,2 MB"), bis dahin stand hier der englische Punkt.
  bg: { komma: true, mb: "MB", kb: "KB" },
  el: { komma: true, mb: "MB", kb: "KB" },
  hu: { komma: true, mb: "MB", kb: "KB" },
  nl: { komma: true, mb: "MB", kb: "KB" },
  pt: { komma: true, mb: "MB", kb: "KB" },
  br: { komma: true, mb: "MB", kb: "KB" },
  ro: { komma: true, mb: "MB", kb: "KB" },
  sv: { komma: true, mb: "MB", kb: "KB" },
  uk: { komma: true, mb: "MB", kb: "KB" },
};
