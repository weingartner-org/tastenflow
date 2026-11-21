/**
 * Die Stand-Zeile UNTER dem Übungsfeld (Johannes 25.08.2026).
 *
 * Sie ersetzt die beiden Karten, die bis dahin ÜBER dem Feld standen („Mein
 * Training" mit Spielstand, Übezeit-Uhr und Wochenziel-Ringen; „Deine Tasten"
 * mit den Problem-Tasten und „20 von 24 sitzen"). Was dort stand, steht jetzt
 * in einer Zeile: Stufe, Übezeit, Wochenziel, nächste Taste.
 *
 * ★★ SIE STEHT IMMER (Johannes 09.09.2026). Bis dahin wurde sie beim Tippen
 * blass und kam nach der Pausentoleranz wieder (Schalter „Anzeige-Zeile beim
 * Tippen ausblenden", ab Werk an). Die Kinder haben damit gearbeitet, und
 * Johannes hat es gestrichen: *„lass die Leiste oberhalb des Eingabefeldes
 * immer an, dann springt kein Fokus und man sieht, wie lange man schon geübt
 * hat."* Kein Zeitgeber, kein Zustand, keine Übergangsanimation mehr - die
 * Zeile ist ein ruhiges Stück Seite.
 *
 * Was NICHT mehr hier steht: welche Tasten sitzen und welche haken. Das steht
 * in „Meine Statistik" (Alt + S) - dort, wo man in Ruhe hinschaut. Über dem
 * Übungsfeld hat die Dauer-Anzeige der eigenen Schwächen nichts verloren
 * ([[feedback_nie_gegen_das_kind]]).
 *
 * Siehe [[project_zehnfinger_trainer]].
 */
import { htmlLang } from "./htmlLang";
import {
  KLASSENMATCH_EREIGNIS,
  ansage,
  matchHinweisSatz,
  speakUi,
  unitGlyph,
  unitLabel,
  unitLabelEn,
  unitLabelEs,
  unitLabelFr,
  useKlassenmatchAngebot,
} from "@/lib/typing";
import { Tipp } from "@/components/Tipp";
import { unitLabelIt } from "@/lib/typing/tastenErklaerungIt";
import { unitLabelPl } from "@/lib/typing/tastenErklaerungPl";
import { unitLabelTr } from "@/lib/typing/tastenErklaerungTr";
import { unitLabelCs } from "@/lib/typing/tastenErklaerungCs";
import { unitLabelBg } from "@/lib/typing/tastenErklaerungBg";
import { unitLabelEl } from "@/lib/typing/tastenErklaerungEl";
import { unitLabelHu } from "@/lib/typing/tastenErklaerungHu";
import { unitLabelNl } from "@/lib/typing/tastenErklaerungNl";
import { unitLabelPt } from "@/lib/typing/tastenErklaerungPt";
import { unitLabelBr } from "@/lib/typing/tastenErklaerungBr";
import { unitLabelRo } from "@/lib/typing/tastenErklaerungRo";
import { unitLabelSv } from "@/lib/typing/tastenErklaerungSv";
import { unitLabelUk } from "@/lib/typing/tastenErklaerungUk";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import { PracticeClock } from "./PracticeClock";

/**
 * ★ ZWEI SINNBILDER NUR FÜR DIESE ZEILE (18.09.2026, Johannes: „Die Symbole
 * auf der Übeseite für Spielen und Klassenmatch passen nicht zum Rest" -
 * gemeint waren die Emoji 🐧 und ⚔️, während jedes andere Zeichen der App ein
 * flacher Strich-Umriss ist, siehe `components/Icon.tsx`).
 *
 * EIGENS gezeichnet statt aus `Icon.tsx` importiert: Die Datei gehört
 * mehreren Apps ([[GEMEINSAM]]), und nur diese Zeile braucht genau diese
 * zwei. Selber Stil wie überall: `viewBox 0 0 24 24`, nur Umriss
 * (`currentColor`), `strokeWidth 2`, runde Enden/Ecken, dekorativ
 * (`aria-hidden`, `focusable="false"`) - der Name steht im Text daneben, nie
 * im Bild.
 */
function sinnbildEigenschaften(className: string) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
    focusable: "false" as const,
  };
}

/** Spielkonsole - Steuerkreuz links, zwei Knöpfe rechts (ersetzt 🐧). */
function SpielenSinnbild({ className }: { className: string }) {
  return (
    <svg {...sinnbildEigenschaften(className)}>
      <rect x="2" y="7" width="20" height="11" rx="5" />
      <path d="M6.5 10v4" />
      <path d="M4.5 12h4" />
      <circle cx="15.5" cy="10.5" r="1" />
      <circle cx="18" cy="13" r="1" />
    </svg>
  );
}

/** Zwei gekreuzte Schwerter - dieselbe Bedeutung wie das frühere ⚔️. */
function KlassenmatchSinnbild({ className }: { className: string }) {
  return (
    <svg {...sinnbildEigenschaften(className)}>
      <line x1="5" y1="19" x2="19" y2="5" />
      <line x1="5.5" y1="15.5" x2="8.5" y2="18.5" />
      <line x1="19" y1="19" x2="5" y2="5" />
      <line x1="15.5" y1="18.5" x2="18.5" y2="15.5" />
    </svg>
  );
}

/**
 * Die Texte der Stand-Zeile in beiden Bedienungssprachen (Probestück
 * „englische Bedienung", 12.09.2026). Deutsch wortgleich wie vorher.
 * ⚠️ Der Name der nächsten Taste folgt der BEDIENUNG, nicht der Übungssprache:
 * Er ist Beschriftung, kein Übungsinhalt.
 */
export const STAND_TEXTE = texte({
  de: {
    stufeTipp: "Wächst mit jeder geübten Runde.",
    naechsteTasteTipp: "Kommt von selbst, sobald die anderen sitzen.",
    naechsteTaste: "Nächste Taste",
    naechsteTasteName: (unit: string) => `Nächste Taste: ${unitLabel(unit)}`,
    alleGelernt: "alle Tasten gelernt",
    spielenTipp: "Spielen statt üben - zählt nicht als Übezeit.",
    spielen: "Spielen",
    // ★ 18.09.2026: nennt jetzt „Klassenmatch" selbst (vorher stand nur, was
    //   passiert, nie der Name des Schalters) - Grund: In der runden,
    //   wortlosen Fassung ist der Tipp die einzige SICHTBARE Stelle, an der
    //   ein sehendes Kind den Namen noch lesen kann.
    matchTipp: "Klassenmatch: fünf Minuten um die Wette schreiben - zählt als Übezeit.",
    klassenmatch: "Klassenmatch",
  },
  en: {
    stufeTipp: "Goes up with every round you practise.",
    naechsteTasteTipp: "Unlocks by itself once you know the other keys well.",
    naechsteTaste: "Next key",
    naechsteTasteName: (unit: string) => `Next key: ${unitLabelEn(unit)}`,
    alleGelernt: "all keys learnt",
    spielenTipp: "Play instead of practising - does not count as practice time.",
    spielen: "Play",
    matchTipp: "Class Match: race each other at typing for five minutes - counts as practice time.",
    klassenmatch: "Class Match",
  },
  // ★ E11a: „tu" - die Stand-Zeile spricht immer die lernende Person an (F9).
  // ★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.3 F3): die Taste
  // mit ihrem französischen Namen (`unitLabelFr`) - bis W1 stand hier das
  // deutsche `unitLabel` („Prochaine touche : Punkt").
  fr: {
    stufeTipp: "Augmente à chaque série terminée.",
    naechsteTasteTipp: "Se débloque tout seul dès que les autres touches sont sûres.",
    naechsteTaste: "Prochaine touche",
    naechsteTasteName: (unit: string) => `Prochaine touche : ${unitLabelFr(unit)}`,
    alleGelernt: "toutes les touches apprises",
    spielenTipp: "Jouer plutôt que s'exercer - ne compte pas comme temps d'exercice.",
    spielen: "Jouer",
    matchTipp: "Match de la classe : cinq minutes de course de frappe - compte comme temps d'exercice.",
    klassenmatch: "Match de la classe",
  },
  // ★ ES-O (27.09.2026): tú; die Taste mit ihrem spanischen Namen (`unitLabelEs`).
  // „Klassenmatch" heisst „Competición de la clase" (eigener Name, damit er
  // nicht mit dem „Reto" verwechselt wird).
  es: {
    stufeTipp: "Sube con cada serie que practicas.",
    naechsteTasteTipp: "Se desbloquea sola en cuanto las demás teclas te salgan seguras.",
    naechsteTaste: "Tecla siguiente",
    naechsteTasteName: (unit: string) => `Tecla siguiente: ${unitLabelEs(unit)}`,
    alleGelernt: "todas las teclas aprendidas",
    spielenTipp: "Jugar en lugar de practicar - no cuenta como tiempo de práctica.",
    spielen: "Jugar",
    matchTipp: "Competición de la clase: cinco minutos de carrera escribiendo - cuenta como tiempo de práctica.",
    klassenmatch: "Competición de la clase",
  },
  // ★ O-IT (02.10.2026): „tu"; die Taste mit ihrem italienischen Namen (`unitLabelIt`).
  it: {
    stufeTipp: "Sale a ogni giro che fai.",
    naechsteTasteTipp: "Si sblocca da solo appena gli altri tasti ti vengono sicuri.",
    naechsteTaste: "Prossimo tasto",
    naechsteTasteName: (unit: string) => `Prossimo tasto: ${unitLabelIt(unit)}`,
    alleGelernt: "tutti i tasti imparati",
    spielenTipp: "Giocare invece di esercitarsi - non conta come tempo di esercizio.",
    spielen: "Gioca",
    matchTipp: "Gara di classe: cinque minuti di gara di scrittura - conta come tempo di esercizio.",
    klassenmatch: "Gara di classe",
  },
  // ★ O-PL (02.10.2026): ty; die Taste mit ihrem polnischen Namen (`unitLabelPl`);
  // „Wyścig klasowy" (Glossar §2.3), „Graj" als Knopf (Regel 12).
  pl: {
    stufeTipp: "Rośnie z każdą przećwiczoną rundą.",
    naechsteTasteTipp: "Odblokuje się sam, gdy pozostałe klawisze będą pewne.",
    naechsteTaste: "Następny klawisz",
    naechsteTasteName: (unit: string) => `Następny klawisz: ${unitLabelPl(unit)}`,
    alleGelernt: "wszystkie klawisze opanowane",
    spielenTipp: "Gra zamiast ćwiczeń - nie liczy się do czasu ćwiczeń.",
    spielen: "Graj",
    matchTipp: "Wyścig klasowy: pięć minut pisania na wyścigi - liczy się do czasu ćwiczeń.",
    klassenmatch: "Wyścig klasowy",
  },
  // ★ O-TR (02.10.2026): sen; die Taste mit ihrem türkischen Namen (`unitLabelTr`),
  // nach dem Doppelpunkt ohne Endung; „Sınıf Maçı" (Glossar §2.3), Knopf „Oyna".
  tr: {
    stufeTipp: "Çalıştığın her turla yükselir.",
    naechsteTasteTipp: "Diğer tuşlar oturunca kilidi kendiliğinden açılır.",
    naechsteTaste: "Sıradaki tuş",
    naechsteTasteName: (unit: string) => `Sıradaki tuş: ${unitLabelTr(unit)}`,
    alleGelernt: "tüm tuşlar öğrenildi",
    spielenTipp: "Çalışmak yerine oyun - çalışma süresine sayılmaz.",
    spielen: "Oyna",
    matchTipp: "Sınıf Maçı: beş dakika yazma yarışı - çalışma süresine sayılır.",
    klassenmatch: "Sınıf Maçı",
  },
  // ★ O-CS (03.10.2026): ty; die Taste mit ihrem tschechischen Namen (`unitLabelCs`)
  // nach dem Doppelpunkt, ungebeugt; „Třídní závod" (Glossar §2.3), Knopf „Hrát" (Regel 1).
  cs: {
    stufeTipp: "Roste s každým procvičeným kolem.",
    naechsteTasteTipp: "Odemkne se sama, jakmile ti ostatní klávesy půjdou jistě.",
    naechsteTaste: "Další klávesa",
    naechsteTasteName: (unit: string) => `Další klávesa: ${unitLabelCs(unit)}`,
    alleGelernt: "všechny klávesy umíš",
    spielenTipp: "Hra místo cvičení - nepočítá se do času procvičování.",
    spielen: "Hrát",
    matchTipp: "Třídní závod: pět minut psaní o závod - počítá se do času procvičování.",
    klassenmatch: "Třídní závod",
  },
  // ★ O2-TASTATUR (30.10.2026): die neun Sprachen, Namen nach den Glossaren (Klassenmatch §2.3, Spielen §2.11, Übezeit §2.2), die Taste
  // mit ihrem Namen in der Sprache (`unitLabel<Xx>`) nach dem Doppelpunkt. Ohne Muttersprachler-Lesung.
  bg: {
    stufeTipp: "Расте с всеки упражнен кръг.",
    naechsteTasteTipp: "Отключва се сам, щом другите клавиши станат сигурни.",
    naechsteTaste: "Следващ клавиш",
    naechsteTasteName: (unit: string) => `Следващ клавиш: ${unitLabelBg(unit)}`,
    alleGelernt: "всички клавиши са научени",
    spielenTipp: "Игра вместо упражнение - не се брои за време за упражнения.",
    spielen: "Играй",
    matchTipp: "Състезание в класа: пет минути писане на бързина - брои се за време за упражнения.",
    klassenmatch: "Състезание в класа",
  },
  el: {
    stufeTipp: "Ανεβαίνει με κάθε γύρο εξάσκησης.",
    naechsteTasteTipp: "Ξεκλειδώνει μόνο του, μόλις τα άλλα πλήκτρα γίνουν σίγουρα.",
    naechsteTaste: "Επόμενο πλήκτρο",
    naechsteTasteName: (unit: string) => `Επόμενο πλήκτρο: ${unitLabelEl(unit)}`,
    alleGelernt: "όλα τα πλήκτρα έχουν μαθευτεί",
    spielenTipp: "Παιχνίδι αντί για εξάσκηση - δεν μετράει ως χρόνος εξάσκησης.",
    spielen: "Παιχνίδι",
    matchTipp: "Αγώνας τμήματος: πέντε λεπτά αγώνας γραφής - μετράει ως χρόνος εξάσκησης.",
    klassenmatch: "Αγώνας τμήματος",
  },
  hu: {
    stufeTipp: "Minden gyakorolt körrel nő.",
    naechsteTasteTipp: "Magától feloldódik, amint a többi billentyű biztosan megy.",
    naechsteTaste: "Következő billentyű",
    naechsteTasteName: (unit: string) => `Következő billentyű: ${unitLabelHu(unit)}`,
    alleGelernt: "minden billentyű megvan",
    spielenTipp: "Játék gyakorlás helyett - nem számít gyakorlási időnek.",
    spielen: "Játék",
    matchTipp: "Osztályverseny: öt perc gépelőverseny - gyakorlási időnek számít.",
    klassenmatch: "Osztályverseny",
  },
  nl: {
    stufeTipp: "Stijgt met elke ronde die je oefent.",
    naechsteTasteTipp: "Komt vanzelf vrij zodra de andere toetsen goed zitten.",
    naechsteTaste: "Volgende toets",
    naechsteTasteName: (unit: string) => `Volgende toets: ${unitLabelNl(unit)}`,
    alleGelernt: "alle toetsen geleerd",
    spielenTipp: "Spelen in plaats van oefenen - telt niet als oefentijd.",
    spielen: "Spelen",
    matchTipp: "Klassenwedstrijd: vijf minuten om het hardst typen - telt als oefentijd.",
    klassenmatch: "Klassenwedstrijd",
  },
  pt: {
    stufeTipp: "Sobe com cada ronda que praticas.",
    naechsteTasteTipp: "Desbloqueia-se sozinha quando as outras teclas estiverem seguras.",
    naechsteTaste: "Próxima tecla",
    naechsteTasteName: (unit: string) => `Próxima tecla: ${unitLabelPt(unit)}`,
    alleGelernt: "todas as teclas aprendidas",
    spielenTipp: "Jogar em vez de praticar - não conta como tempo de prática.",
    spielen: "Jogar",
    matchTipp: "Corrida da turma: cinco minutos de corrida a escrever - conta como tempo de prática.",
    klassenmatch: "Corrida da turma",
  },
  br: {
    stufeTipp: "Sobe a cada rodada praticada.",
    naechsteTasteTipp: "É desbloqueada automaticamente quando as outras teclas estiverem seguras.",
    naechsteTaste: "Próxima tecla",
    naechsteTasteName: (unit: string) => `Próxima tecla: ${unitLabelBr(unit)}`,
    alleGelernt: "todas as teclas aprendidas",
    spielenTipp: "Jogar em vez de praticar - não conta como tempo de prática.",
    spielen: "Jogar",
    matchTipp: "Competição da turma: cinco minutos de corrida de digitação - conta como tempo de prática.",
    klassenmatch: "Competição da turma",
  },
  ro: {
    stufeTipp: "Crește cu fiecare rundă exersată.",
    naechsteTasteTipp: "Se deblochează singură când celelalte taste sunt sigure.",
    naechsteTaste: "Tasta următoare",
    naechsteTasteName: (unit: string) => `Tasta următoare: ${unitLabelRo(unit)}`,
    alleGelernt: "toate tastele sunt învățate",
    spielenTipp: "Joc în loc de exersare - nu se pune la timpul de exersare.",
    spielen: "Jucați",
    matchTipp: "Întrecerea clasei: cinci minute de scris pe întrecute - se pune la timpul de exersare.",
    klassenmatch: "Întrecerea clasei",
  },
  sv: {
    stufeTipp: "Stiger med varje omgång du övar.",
    naechsteTasteTipp: "Låses upp av sig självt när de andra tangenterna sitter.",
    naechsteTaste: "Nästa tangent",
    naechsteTasteName: (unit: string) => `Nästa tangent: ${unitLabelSv(unit)}`,
    alleGelernt: "alla tangenter inlärda",
    spielenTipp: "Spela i stället för att öva - räknas inte som övningstid.",
    spielen: "Spela",
    matchTipp: "Klasstävlingen: fem minuters skrivtävling - räknas som övningstid.",
    klassenmatch: "Klasstävlingen",
  },
  uk: {
    stufeTipp: "Зростає з кожним раундом тренування.",
    naechsteTasteTipp: "Відкриється сама, щойно інші клавіші будуть упевнено виходити.",
    naechsteTaste: "Наступна клавіша",
    naechsteTasteName: (unit: string) => `Наступна клавіша: ${unitLabelUk(unit)}`,
    alleGelernt: "усі клавіші вивчено",
    spielenTipp: "Гра замість тренування - не зараховується до часу тренування.",
    spielen: "Грати",
    matchTipp: "Перегони класу: п'ять хвилин друкування наввипередки - зараховується до часу тренування.",
    klassenmatch: "Перегони класу",
  },
});

export interface StandZeileProps {
  /** „Übungsstufe" bzw. „Spielstufe" — dasselbe Wort wie Ansage und Statistik. */
  stufeLabel: string;
  /** Die erreichte Stufe. */
  level: number;
  /**
   * Die nächste, noch gesperrte Taste — oder `null`, wenn alles gelernt ist.
   * Ersetzt das frühere „20 von 24 sitzen" (Johannes 25.08.2026): Beim Üben
   * zählt, was als Nächstes kommt.
   */
  nextUnit?: string | null;
  /** Umschalttaste schon gelernt? Dann die Taste groß zeigen. */
  shiftLearned?: boolean;
  /** Das Wochenziel (kompakte Fassung) — nur für Lernende mit Ziel. */
  goalSlot?: React.ReactNode;
  /** ★ „Gezielt üben" (13.11.2026): das Schildchen „Gezielt: ö ä ß ?" samt „Ändern" - nur in „Mein Training", nur wenn es gilt. */
  gezieltSlot?: React.ReactNode;
  /**
   * Der freie Spiel-Einstieg („Spielen"). WER ihn bekommt, entscheidet die
   * Aufrufstelle über `showsFreePlay` (skin.ts) - seit 31.08.2026 alle bis 15
   * Jahre, ab 16 nicht. Diese Zeile fragt bewusst nicht selbst nach der Stufe.
   */
  spielen?: boolean;
}

export function StandZeile({
  stufeLabel,
  level,
  nextUnit,
  shiftLearned = false,
  goalSlot,
  gezieltSlot,
  spielen = false,
}: StandZeileProps) {
  /*
    ★ Der Schalter „Klassenmatch" (F1). Er kommt NICHT als Eigenschaft
    herein, sondern aus einem kleinen Speicher - wie die Übezeit-Uhr eine Zeile
    weiter unten. Begründung in `lib/typing/klassenmatchAngebot.ts`: Die Frage
    ist in allen drei Trainern dieselbe, und keiner von ihnen kann sie
    beantworten.
  */
  const matchOffen = useKlassenmatchAngebot((s) => s.offen);
  /** Leer = der Schalter lädt ein; sonst sagt er, warum das gerade nicht geht. */
  const matchHinweis = useKlassenmatchAngebot((s) => s.hinweis);
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` (Muster aus E11a-2/-3) - STAND_TEXTE kennt „fr" bereits seit
  // E11a.
  const { spracheGewaehlt: sprache, bereichAktiv } = useBedienSprache();
  const t = STAND_TEXTE[sprache];
  /* ★★ ALLE ANGABEN SIND GLEICHRANGIG VERTEILT (Johannes 30.08.2026: „Übezeit
     und Wochenziel sind sehr nahe nebeneinander - wenn es Wochenziele gibt,
     einfach vierspaltig, wenn keines, dreispaltig").

     Das revidiert die Fassung vom 25.08. („immer drei Plätze, die Mitte
     wächst"): Übezeit und Wochenziel standen dort als EINE Gruppe mit
     Trennpunkt - gedacht als Zusammenhang, gelesen als Gedränge. Jetzt ist
     jede Angabe ihr eigener Platz, und `justify-between` verteilt, was da
     ist: drei Plätze ohne Ziel, vier mit -

         Übungsstufe 3      Heute 4:12      Wochenziel ◕ ▬▬▭▭▭      Nächste Taste d

     ★ Die Ordnung bleibt dieselbe, ob mit oder ohne Ziel: Stufe links,
     nächste Taste rechts. Für Sprachausgabe und Braillezeile ändert sich
     nichts: Die Reihenfolge im Dokument ist unverändert. */

  return (
    <div
      className={
        // ★ 30.08.2026 (Johannes): Schrift eine Stufe größer (text-base statt
        //   text-sm), die Zeile aber NICHT höher - das Polster gleicht die
        //   höhere Zeilenhöhe exakt aus: 2×8px + 20px = 2×6px + 24px = 36px.
        // ★ 18.09.2026: `standzeile-leiste` benennt die Zeile als Behälter für
        //   die Breiten-Abfrage von „Spielen"/„Klassenmatch" (index.css).
        "card standzeile-leiste flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-1.5 text-base text-ink-soft"
      }
      lang={htmlLang(sprache)}
    >
      {/* Kurze Erklärungen beim Darüberfahren (Johannes 25.08.2026) - ein
          Halbsatz je Angabe, mehr nicht. Ausführlich steht alles in der Hilfe.
          ★ 30.08.: aus dem Tipp-Baustein statt aus `title` (Johannes: der
          native Hinweis kam „sehr verzögert und viel kleiner") - sofort da,
          lesbare Größe, wie bei den Knöpfen der Kopfzeile. Für Sprachausgabe
          und Braillezeile ändert sich nichts: Die Angaben stehen als Text da,
          und die Ids werden nicht angehängt (keine doppelte Auskunft). */}
      <Tipp text={t.stufeTipp} ausrichtung="links">
        {() => (
          <span className="flex items-center gap-1.5">
            {stufeLabel} <b className="font-semibold text-ink">{level}</b>
          </span>
        )}
      </Tipp>
      <PracticeClock kompakt />
      {goalSlot && (
        <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          {goalSlot}
        </span>
      )}
      {gezieltSlot}
      {nextUnit ? (
        <Tipp text={t.naechsteTasteTipp}>
          {() => (
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true">{t.naechsteTaste}</span>
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-md border border-dashed border-hairline bg-surface font-legible text-sm font-semibold text-ink-muted"
              >
                {unitGlyph(nextUnit, shiftLearned)}
              </span>
              {/* Auf der Braillezeile der ausgeschriebene Name, nicht das Zeichen. */}
              <span className="sr-only">{t.naechsteTasteName(nextUnit)}</span>
            </span>
          )}
        </Tipp>
      ) : (
        <span>{t.alleGelernt}</span>
      )}
      {spielen && (
        <Tipp text={t.spielenTipp}>
          {(beschreibungId) => (
            <button
              type="button"
              className="btn-secondary btn-toggle standzeile-schalter"
              aria-describedby={beschreibungId}
              onClick={() => {
                speakUi(ansage("eisschollenSpiel"));
                window.dispatchEvent(new Event("tippen-open-freeplay"));
              }}
            >
              <SpielenSinnbild className="standzeile-schalter-sinnbild shrink-0" />
              {/* ★ 18.09.2026: Das Wort bleibt hier IM BAUM (Name für
                  Sprachausgabe/Braillezeile) - wird nur unsichtbar, wenn die
                  Zeile eng wird (index.css, `.standzeile-schalter-wort`
                  innerhalb der Breiten-Abfrage). Nie `display:none`: Das
                  entfernte den Namen ebenfalls. */}
              <span className="standzeile-schalter-wort">{t.spielen}</span>
            </button>
          )}
        </Tipp>
      )}
      {/*
        ★★★ DAS KLASSENMATCH (11.09.2026, F1): neben „Spielen".
        (Beide tragen seit 18.09.2026 ein gezeichnetes Sinnbild statt Emoji.)

        ⚠️ Es gibt ihn ENTWEDER oder GAR NICHT - nie als toten Schalter. Wer
        keiner Klasse angehört, hat niemanden zum Einladen; wo die Lehrkraft das
        Match abgeschaltet hat, wäre ein Schalter mit `aria-disabled` eine
        Auskunft über eine Entscheidung, die das Kind nicht trifft und nicht
        ändern kann. Die Bedingung steht in `useKlassenmatch`, gefüllt wird der
        Speicher in `TippenTrainerPage`.

        ★★ WAS AUS EINEM ANDEREN GRUND GERADE NICHT GEHT, SAGT ER (11.09.2026,
        §2.6): Läuft schon ein Match dieses Kindes oder laufen in der Klasse
        bereits zwei, bleibt der Schalter stehen und trägt den Grund als
        Beschriftung („Klassenmatch läuft gerade"). Der Unterschied zu den
        zwei Fällen oben: Dieser Zustand geht von selbst vorbei, und das Kind
        soll wissen, worauf es wartet. Kein `disabled`, keine Live-Region -
        gesprochen wird der ganze Satz beim Drücken und bei Alt + M.
      */}
      {matchOffen && (
        <Tipp
          text={
            matchHinweis
              ? matchHinweisSatz(matchHinweis)
              : t.matchTipp
          }
        >
          {(beschreibungId) => (
            <button
              type="button"
              className="btn-secondary btn-toggle standzeile-schalter"
              aria-describedby={beschreibungId}
              aria-keyshortcuts="Alt+M"
              onClick={() => {
                /*
                  ★★ Steht ein Hinweis an, SAGT der Schalter ihn - er tut nicht
                  stillschweigend nichts (R-A3) und ist nicht `disabled`: Der
                  Fokus bleibt, wo er ist, und auf der Braillezeile steht der
                  Grund ohnehin schon in der Beschriftung. Dieselbe Bauart wie
                  „Starten" im Wartefenster.
                */
                if (matchHinweis) {
                  // ★ EN5: Der Hinweis kommt schon in der Bedienungssprache
                  // (`useKlassenmatch`) - in Tastenflow also auch mit ihrer
                  // Stimme; ohne aktiven Sprachbereich der Aufruf von vorher.
                  if (bereichAktiv) speakUi(matchHinweisSatz(matchHinweis), undefined, undefined, sprache);
                  else speakUi(matchHinweisSatz(matchHinweis));
                  return;
                }
                window.dispatchEvent(new Event(KLASSENMATCH_EREIGNIS));
              }}
            >
              <KlassenmatchSinnbild className="standzeile-schalter-sinnbild shrink-0" />
              {/* ★ 18.09.2026: dieselbe sr-only-Bauart wie bei „Spielen" -
                  der Hinweis-Satz („läuft gerade") bleibt lesbar, auch rund. */}
              <span className="standzeile-schalter-wort">
                {matchHinweis || t.klassenmatch}
              </span>
            </button>
          )}
        </Tipp>
      )}
    </div>
  );
}
