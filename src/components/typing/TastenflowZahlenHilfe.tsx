/**
 * ════════════════════════════════════════════════════════════════════════════
 * WIE DIE ZAHLEN ENTSTEHEN - die Erklärung für Lehrkräfte (01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„die hilfe ist viel zu kurz, da gehört hinein wie punkte berechnet
 * werden die 3 parameter aus denen ein lehrer seine note erstellen kann"* -
 * und: *„was bedeutet leistungsstufen"*.
 *
 * ── ⚠️ EINE Quelle, zwei Orte ──────────────────────────────────────────────
 * Dieselbe Erklärung wird an ZWEI Stellen gebraucht: in der Hilfe von „Meine
 * Klassen" (dort steht die Tabelle) und in der Hilfe des Programms selbst
 * (`LehrerHilfe`). Zweimal geschrieben wäre sie beim ersten Zahlen-Umbau
 * auseinandergelaufen - genau die Doppelung, die in diesem Projekt schon
 * mehrfach Schaden gemacht hat
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── ★★★ Die Zahlen sind Werte, keine Note ─────────────────────────────────
 * Johannes am 31.08.2026: *„das sind Werte, auf die ein Lehrer dann seine Note
 * bauen kann, nicht die App!"* Diese Datei erklärt deshalb, WIE gerechnet wird,
 * und schlägt an keiner Stelle eine Bewertung vor.
 *
 * ── ⚠️ Jede Zahl hier ist am Code abgelesen, nicht geschätzt ───────────────
 *   Leistungsstufe 1-50, Ziel Stufe 2 = 22, Stufe 50 = 420 Anschläge/Min,
 *   geometrisch dazwischen ........... `src/lib/typing/level.ts` (LV_STEP2_CPM,
 *                                      LV_TOP_CPM, levelTargetCpm)
 *   Aufstieg/Abstieg, Fenster 5 Runden,
 *   Mehrheit 60 %, Abklingzeit 3 ..... `level.ts` (adaptLevel, ADAPT_WINDOW,
 *                                      ADAPT_MIN_AT_LEVEL, MAJORITY)
 *   Treffsicherheit = (Zeichen minus Fehler) ÷ Zeichen
 *                                 ..... `account.ts` (computePupilStats),
 *                                      `jahreskarte.ts` (wochenwerte)
 *   Anschläge/Min = Zeichen ÷ Tippzeit  `account.ts` (cpmOf)
 *   Übezeit = Summe der reinen Tippzeit `account.ts` (msOf: activeMs)
 *   Wochenaufgaben = Σ erfüllt ÷ Σ Ziel,
 *   Minuten je Woche, keine Einheiten mehr .. `wochenziel.ts`
 *                                 ..... (wochenzielGeschichte, erfuellungProzent)
 * Wer eine dieser Stellen ändert, ändert diesen Text mit.
 */
import type { ReactNode } from "react";
import {
  BEZUGSTEMPO,
  FEHLER_GEWICHT,
  FEHLER_GEWICHT_FREI,
  MIND_ZEICHEN_WERTUNG,
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_EN,
} from "@/lib/typing";
import { PRUEFUNG_WORT_ES, PRUEFUNG_WORT_FR, PRUEFUNG_WORT_IT } from "@/lib/typing/schreibprobe";

/**
 * ★ O-PL (02.10.2026): „Wyzwanie" (Glossar Polnisch §2.3), gross wie ein Name.
 * Steht hier, solange `schreibprobe.ts` noch keinen polnischen Zwilling trägt.
 */
const PRUEFUNG_WORT_PL = "Wyzwanie";

/**
 * ★ O-TR (02.10.2026): "Yarışma" (Glossar Türkisch §2.3), gross wie ein Name.
 * Steht hier, solange `schreibprobe.ts` noch keinen türkischen Zwilling trägt.
 */
const PRUEFUNG_WORT_TR = "Yarışma";

/**
 * ★ O-CS (03.10.2026): „Výzva" (Glossar Tschechisch §2.3), gross wie ein Name.
 * Steht hier, solange `schreibprobe.ts` noch keinen tschechischen Zwilling trägt.
 */
const PRUEFUNG_WORT_CS = "Výzva";
import { dezimal, mehrzahl, useBedienSprache } from "@/lib/bedienSprache";

/*
 * ★ EN6a (19.09.2026): Jede der drei Erklärungen hat ein englisches
 * Gegenstück weiter unten (`…En`) - derselbe Aufbau, dieselben Zahlen aus
 * denselben Konstanten, Wortwahl nach dem Glossar (§3.2: *difficulty level*,
 * *precision*, *speed factor*, *challenge score*, *mark*; §3.3 *weekly goal*,
 * *catch up*; §3.4 *Take your time*, *text age group*) und nach dem
 * englischen Handbuch, Kapitel 4.2 und 8. Welche gilt, sagt der Provider -
 * ohne ihn (andere Apps, Tests) bleibt alles deutsch.
 */

function Absatz({ children }: { children: ReactNode }) {
  return <p className="m-0">{children}</p>;
}

/**
 * Was die Leistungsstufe ist - und was sie nicht ist.
 *
 * ⚠️ Der letzte Absatz ist kein Beiwerk. „Stufe 34" sieht aus wie eine Note von
 * 34 Punkten, und genau so wurde sie gelesen. Sie ist aber eine Angabe über die
 * SCHWIERIGKEIT der Übung, nicht über den Wert der Leistung - wer das nicht
 * dazuschreibt, lässt eine Aussage GEGEN ein Kind entstehen
 * ([[feedback_nie_gegen_das_kind]]).
 */
export function LeistungsstufeHilfe() {
  const sprache = useBedienSprache().sprache;
  if (sprache === "bg") return <LeistungsstufeHilfeBg />;
  if (sprache === "el") return <LeistungsstufeHilfeEl />;
  if (sprache === "hu") return <LeistungsstufeHilfeHu />;
  if (sprache === "nl") return <LeistungsstufeHilfeNl />;
  if (sprache === "pt") return <LeistungsstufeHilfePt />;
  if (sprache === "br") return <LeistungsstufeHilfeBr />;
  if (sprache === "ro") return <LeistungsstufeHilfeRo />;
  if (sprache === "sv") return <LeistungsstufeHilfeSv />;
  if (sprache === "uk") return <LeistungsstufeHilfeUk />;
  if (sprache === "en") return <LeistungsstufeHilfeEn />;
  if (sprache === "fr") return <LeistungsstufeHilfeFr />;
  if (sprache === "es") return <LeistungsstufeHilfeEs />;
  if (sprache === "it") return <LeistungsstufeHilfeIt />;
  // ★ O-PL (02.10.2026): polnisch.
  if (sprache === "pl") return <LeistungsstufeHilfePl />;
  // ★ O-TR (02.10.2026): türkisch.
  if (sprache === "tr") return <LeistungsstufeHilfeTr />;
  // ★ O-CS (03.10.2026): tschechisch.
  if (sprache === "cs") return <LeistungsstufeHilfeCs />;
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        Die <strong>Leistungsstufe</strong> ist eine Zahl von <strong>1 bis 50</strong>.
        Sie sagt, <strong>wie schwer die Übungen für dieses Kind gerade sein
        dürfen</strong> - und sonst nichts. Das Programm stellt sie selbst ein;
        Sie müssen dafür nichts tun.
      </Absatz>
      <Absatz>
        Hinter jeder Stufe steht ein <strong>Tempo-Ziel</strong>: Stufe 2
        verlangt 22 Anschläge je Minute, Stufe 50 verlangt 420 (das sind rund 84
        Wörter je Minute, also Schreibkraft-Tempo). Dazwischen wachsen die Ziele
        in gleichmäßigen Schritten - unten fein, damit auch sehr langsame Kinder
        eine erreichbare nächste Stufe haben, oben weit, damit geübte Kinder
        nicht anstoßen. <strong>Stufe 1 ist besonders:</strong> Dort zählt das
        Tempo überhaupt nicht, nur die Treffsicherheit.
      </Absatz>
      <Absatz>
        <strong>Wie sie sich bewegt:</strong> Das Programm sieht sich die letzten
        bis zu fünf Runden auf der aktuellen Stufe an - und erst ab der dritten
        Runde auf dieser Stufe überhaupt (sonst spränge die Zahl hin und her).
        Sind die meisten davon treffsicher <em>und</em> beim Tempo-Ziel, steigt
        die Stufe; bei großem Vorsprung auch mehrere Stufen auf einmal. Sind die
        meisten zu ungenau oder deutlich zu langsam, sinkt sie um eine. Nur wer
        anhaltend sehr ungenau <em>und</em> sehr langsam ist, kommt zurück auf
        Stufe 1 - dorthin, wo das Tempo nicht mehr mitzählt.
      </Absatz>
      <Absatz>
        <strong>Bei „Tempo zählt nicht"</strong> (Einstellung je Kind) zählt
        das Tempo auf <em>jeder</em> Stufe nicht mit. Die Stufe steigt und
        fällt dann allein über die Treffsicherheit.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Die Leistungsstufe ist keine Note und keine Punktzahl.</strong>{" "}
        Ein Kind auf Stufe 8, das jede Woche zwei Stufen zulegt, arbeitet besser
        als eines, das seit Oktober auf Stufe 30 steht. Wofür die Stufe taugt:
        zu sehen, ob die Übungen gerade passen. Was für eine Beurteilung
        gedacht ist, steht im nächsten Abschnitt.
      </Absatz>
      <Absatz>
        ⚠️ Nicht zu verwechseln mit der <strong>Textstufe</strong> - die steuert
        nur, wie erwachsen die Übungstexte klingen (7-10 Jahre, 11-15 Jahre, ab
        16), und hat mit der Leistung nichts zu tun.
      </Absatz>
    </div>
  );
}

/**
 * Die drei Werte, aus denen eine Lehrkraft ihre Note bauen kann - samt der
 * Rechnung dahinter, und samt dem, was die Rechnung NICHT weiß.
 */
export function DreiWerteHilfe() {
  const sprache = useBedienSprache().sprache;
  if (sprache === "bg") return <DreiWerteHilfeBg />;
  if (sprache === "el") return <DreiWerteHilfeEl />;
  if (sprache === "hu") return <DreiWerteHilfeHu />;
  if (sprache === "nl") return <DreiWerteHilfeNl />;
  if (sprache === "pt") return <DreiWerteHilfePt />;
  if (sprache === "br") return <DreiWerteHilfeBr />;
  if (sprache === "ro") return <DreiWerteHilfeRo />;
  if (sprache === "sv") return <DreiWerteHilfeSv />;
  if (sprache === "uk") return <DreiWerteHilfeUk />;
  if (sprache === "en") return <DreiWerteHilfeEn />;
  if (sprache === "fr") return <DreiWerteHilfeFr />;
  if (sprache === "es") return <DreiWerteHilfeEs />;
  if (sprache === "it") return <DreiWerteHilfeIt />;
  // ★ O-PL (02.10.2026): polnisch.
  if (sprache === "pl") return <DreiWerteHilfePl />;
  // ★ O-TR (02.10.2026): türkisch.
  if (sprache === "tr") return <DreiWerteHilfeTr />;
  // ★ O-CS (03.10.2026): tschechisch.
  if (sprache === "cs") return <DreiWerteHilfeCs />;
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        Das Programm vergibt <strong>keine Note</strong>. Es liefert{" "}
        <strong>vier Werte</strong> - was daraus eine Note wird, entscheiden
        Sie. Die ersten drei stehen auf der Karte über der Tabelle, für die
        ganze Klasse und je Kind hinter dem Pfeil; der vierte in der Spalte
        „{PRUEFUNG_WORT}“.
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Geschwindigkeit (Anschläge je Minute)</p>
        <Absatz>
          Alle getippten Zeichen geteilt durch die reine Tippzeit, mal 60. Nur
          Zeit am Text zählt - eine Pause, in der das Programm offen steht,
          zählt nicht mit.
        </Absatz>
        <Absatz>
          Daneben steht die Veränderung, und zwar in <strong>Anschlägen</strong>,
          nicht in Prozent: „um 4 gesteigert" heißt 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Treffsicherheit</p>
        <Absatz>
          <strong>(Zeichen minus Fehler) ÷ Zeichen</strong>, in Prozent. Ein
          korrigierter Fehler bleibt ein Fehler - gezählt wird der Anschlag, nicht
          das Ergebnis auf dem Bildschirm.
        </Absatz>
        <Absatz>
          Die Veränderung steht hier in <strong>Prozentpunkten</strong> (von 94 %
          auf 96 % ist „um 2 gesteigert").
        </Absatz>
        <Absatz>
          ★ Das ist der aussagekräftigere der beiden Leistungswerte: Wer sicher
          schreibt, wird von selbst schneller - umgekehrt fast nie.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Wochenaufgaben</p>
        <Absatz>
          Pro Kind stellen Sie <strong>Minuten pro Woche</strong> ein - ohne
          Einheiten. Angezeigt wird der Anteil der geschafften an den
          geforderten Minuten, z. B. „87 %", mit dem Zusatz „62 von 71
          Minuten - in 2 von 3 Wochen ganz erfüllt". Gerechnet wird{" "}
          <strong>einzeln nach Minuten</strong>, nicht wochenweise: Wer jede
          Woche einen Teil schafft, steht damit sichtbar anders da als
          jemand, der nichts macht.
        </Absatz>
        <Absatz>
          {/* ★ L5 (19.09.2026): der neue Name des Häkchens, wörtlich wie am Feld. */}
          <strong>Verpasste Minuten der vergangenen Wochen nachholen</strong>{" "}
          (Häkchen der Lehrkraft): Wer mehr übt als eine Woche verlangt, füllt
          damit die älteste noch offene Woche auf - nie über deren eigenes Ziel
          hinaus.
        </Absatz>
        <Absatz>
          Ist <strong>kein Wochenziel gesetzt</strong>, fällt dieser Wert weg -
          und mit ihm die Spalte „Wochenziel" in der Tabelle. Es steht dann
          nirgends eine Null, die wie ein Versäumnis aussieht.
        </Absatz>
      </div>

      {/*
        ★★★ 4 · DIE TIPPCHALLENGE (10.09.2026). Johannes, nachdem er die Hilfe
        gelesen hatte: „in der Lehrer-Hilfeseite fehlt die Tippchallenge völlig
        … gehört auch bei Note dazu". Jede Zahl kommt aus den Konstanten der
        Wertung (`schreibprobeWertung.ts`), keine ist abgeschrieben.
      */}
      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT} (Leistungswert)</p>
        <Absatz>
          Eine {PRUEFUNG_WORT} ist eine Prüfung für die ganze Klasse: derselbe
          Text, dieselbe Zeit. Ihr Ergebnis ist der{" "}
          <strong>Leistungswert von 0 bis 100</strong>. Er fasst Treffsicherheit
          und Tempo in einer Zahl zusammen:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Güte</strong> = Zeichen ÷ (Zeichen + k × Fehler) - ein
            Fehler zählt so viel wie k Zeichen.
          </li>
          <li>
            <strong>Tempo-Anteil</strong> = Wurzel aus (Anschläge je Minute ÷{" "}
            {BEZUGSTEMPO}), höchstens 1.
          </li>
          <li>
            <strong>Leistungswert</strong> = 100 × Güte × Tempo-Anteil.
          </li>
        </ul>
        {/*
          ★★★ 23.09.2026 („Freies Schreiben", E6): DAS Gewicht k hängt seither
          an der Art der {PRUEFUNG_WORT} - „streng" zählt jeden Fehlgriff, weil
          er sofort Zeit gekostet hat; „frei" zählt nur, was am Ende noch
          falsch dasteht, und das wiegt darum zehnmal so schwer
          (`schreibprobeWertung.ts`, Bauplan §2/§7).
        */}
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> bei „Streng" (Vorgabe): Jeder
          Fehlgriff zählt, auch ein sofort verbesserter - er hat unterwegs
          Zeit gekostet.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> bei „Freies Schreiben":
          Gewertet wird nur, was am Ende noch falsch dasteht (je Wort
          höchstens ein Fehler, ausgebesserte Stellen zählen nicht) - ein
          stehender Fehler hat dafür keine eigene Zeit gekostet und wiegt
          darum schwerer.
        </Absatz>
        <Absatz>
          Die Wurzel sorgt dafür, dass <strong>Genauigkeit mehr zählt als
          Zeit</strong>: Doppeltes Tempo zählt nicht doppelt, sondern nur 1,4-fach.
          Unter {MIND_ZEICHEN_WERTUNG} geschriebenen Zeichen gibt es keinen
          Leistungswert.
        </Absatz>
        <Absatz>
          Er steht in der Ergebnistabelle jeder Runde, als Schnitt in der Spalte
          „{PRUEFUNG_WORT}“ der Klassenstatistik („3 / 82“: drei geschrieben,
          Leistungswert im Schnitt 82) und beim Kind in „Meine Statistik“. Weil
          alle Kinder einer Runde denselben Text in derselben Zeit schreiben,
          lassen sich ihre Werte miteinander vergleichen.
        </Absatz>
      </div>

      <Absatz>
        <strong>Womit verglichen wird,</strong> stellen Sie über dem Wert um:
        gegenüber der <strong>Vorwoche</strong> (Grundstellung) oder gegenüber
        dem <strong>Schuljahresbeginn der Klasse</strong>. Der Schuljahresbeginn
        ist dabei nicht der 1. August, sondern die erste Woche, in der{" "}
        <strong>mindestens die Hälfte</strong> der Klasse geübt hat - damit
        einzelne Ferienarbeit nicht den Start für alle auslöst. Wer später
        dazukommt, wird ab seiner eigenen ersten Woche verglichen.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Was diese Werte nicht wissen</p>
        <Absatz>
          Sie messen, was am Gerät passiert ist. Sie wissen nichts über die
          Ausgangslage eines Kindes, über eine Handverletzung, über eine Woche
          mit Krankenstand oder über eine Hilfsmittel-Umstellung. Ein Wert, der
          kleiner geworden ist, ist ein <em>Anlass nachzufragen</em> - keine
          Auskunft über die Anstrengung.
        </Absatz>
        <Absatz>
          Wie viel Übung überhaupt hinter den Zahlen steckt, sehen Sie in der
          Spalte <strong>Übezeit</strong> und hinter dem Pfeil („Übungen",
          „Aktive Tage", „Geübte Zeit").
        </Absatz>
      </div>
    </div>
  );
}

/**
 * Was in welcher Spalte steht. Kurz gehalten: Die ausführliche Fassung jeder
 * Spalte steht seit dem 01.09.2026 als Hinweis am Spaltenkopf selbst
 * (`Spaltenkopf.tsx`) - hier steht nur, was man liest, ohne die Maus zu
 * bewegen.
 */
export function SpaltenHilfe() {
  const sprache = useBedienSprache().sprache;
  if (sprache === "bg") return <SpaltenHilfeBg />;
  if (sprache === "el") return <SpaltenHilfeEl />;
  if (sprache === "hu") return <SpaltenHilfeHu />;
  if (sprache === "nl") return <SpaltenHilfeNl />;
  if (sprache === "pt") return <SpaltenHilfePt />;
  if (sprache === "br") return <SpaltenHilfeBr />;
  if (sprache === "ro") return <SpaltenHilfeRo />;
  if (sprache === "sv") return <SpaltenHilfeSv />;
  if (sprache === "uk") return <SpaltenHilfeUk />;
  if (sprache === "en") return <SpaltenHilfeEn />;
  if (sprache === "fr") return <SpaltenHilfeFr />;
  if (sprache === "es") return <SpaltenHilfeEs />;
  if (sprache === "it") return <SpaltenHilfeIt />;
  // ★ O-PL (02.10.2026): polnisch.
  if (sprache === "pl") return <SpaltenHilfePl />;
  // ★ O-TR (02.10.2026): türkisch.
  if (sprache === "tr") return <SpaltenHilfeTr />;
  // ★ O-CS (03.10.2026): tschechisch.
  if (sprache === "cs") return <SpaltenHilfeCs />;
  const zeilen: [string, string][] = [
    [
      "Einstellungen",
      // ⚠️ Backticks, nicht Anführungszeichen: Der Text enthält selbst welche.
      // ★ Fix 19.09.2026: Textstufe, Geburtsjahr, Sprache und das Startniveau
      // der Klasse sind seit dem 11.09.2026 (B10) Werte der ganzen Klasse,
      // nicht mehr je Kind - hier stand noch die alte Liste.
      `Der runde Knopf mit dem Pfeil. Er klappt alles zu dieser Person auf: „Womit anfangen?", „Einhand schreiben", „Tempo zählt nicht", „Zeichenabstand groß (CVI)", das Wochenziel und die ausführliche Auswertung.`,
    ],
    [
      "Leistungsstufe",
      "1 bis 50 - wie schwer die Übungen gerade sein dürfen. Keine Note.",
    ],
    [
      "Übezeit",
      "Reine Tippzeit im gewählten Zeitraum. Pausen zählen nicht mit.",
    ],
    [
      "Wochenziel",
      "Geübte von den geforderten Minuten dieser Woche. Steht nur da, wenn ein Ziel gesetzt ist.",
    ],
    ["Treffsicherheit", "Anteil richtig getroffener Zeichen."],
    [
      "Anschl./Min",
      `Tempo. Bei „Tempo zählt nicht" steht die Zahl da, zählt im Programm aber nirgends.`,
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Der Zeitraum: </dt>
        <dd className="m-0 inline">
          Über der Tabelle wählen Sie, worauf sich alle Zahlen beziehen - eine
          einzelne Woche, einen Monat (die letzten 4 Wochen, nicht der
          Kalendermonat), das Schuljahr oder alles; Woche, Monat und Schuljahr
          blättern Sie mit den Pfeilen davor und zurück. Die Auswertung hinter
          dem Pfeil bleibt davon unberührt; sie zeigt immer das ganze Jahr.
        </dd>
      </div>
    </dl>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ★ EN6a (19.09.2026): DIE DREI ERKLÄRUNGEN ENGLISCH
// ════════════════════════════════════════════════════════════════════════════

function LeistungsstufeHilfeEn() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        The <strong>difficulty level</strong> is a number from <strong>1 to 50</strong>.
        It says <strong>how hard the exercises may be for this pupil at the
        moment</strong> - and nothing else. The app sets it by itself; you
        don't need to do anything.
      </Absatz>
      <Absatz>
        Behind every level is a <strong>speed goal</strong>: level 2 asks for
        22 keystrokes per minute, level 50 for 420 (about 84 words per minute,
        the speed of a professional typist). In between, the goals grow in
        even steps - small at the bottom, so that even pupils who type very
        slowly have a next level within reach, and large at the top, so that
        experienced pupils don't hit a ceiling. <strong>Level 1 is
        special:</strong> there, speed doesn't count at all, only accuracy.
      </Absatz>
      <Absatz>
        <strong>How it moves:</strong> the app looks at up to the last five
        rounds on the current level - and only from the third round on that
        level (otherwise the number would jump back and forth). If most of them
        are accurate <em>and</em> at the speed goal, the level goes up; with a
        large lead, by several levels at once. If most are too inaccurate or
        clearly too slow, it goes down by one. Only a pupil who stays very
        inaccurate <em>and</em> very slow goes back to level 1 - where speed
        no longer counts.
      </Absatz>
      <Absatz>
        <strong>With “Take your time”</strong> (a setting for each pupil),
        speed doesn't count on <em>any</em> level. The level then goes up and
        down through accuracy alone.
      </Absatz>
      <Absatz>
        ⚠️ <strong>The difficulty level is not a mark and not a score.</strong>{" "}
        A pupil on level 8 who goes up two levels every week is doing better
        than one who has been on level 30 since October. What the level is
        good for: seeing whether the exercises fit at the moment. What is meant
        for assessment is in the next section.
      </Absatz>
      <Absatz>
        ⚠️ Not to be confused with the <strong>text age group</strong> - it only
        controls how grown-up the practice texts sound (Ages 7-10, Ages 11-15,
        16 and over) and has nothing to do with performance.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeEn() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        The app does <strong>not give a mark</strong>. It provides{" "}
        <strong>four figures</strong> - what becomes a mark is your decision.
        The first three are on the card above the table, for the whole class
        and for each pupil behind the arrow; the fourth is in the column
        “{PRUEFUNG_WORT_EN}”.
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Speed (keystrokes per minute)</p>
        <Absatz>
          All the characters typed, divided by the pure typing time, times 60.
          Only time spent on the text counts - a pause while the app is open
          doesn't.
        </Absatz>
        <Absatz>
          Next to it is the change, in <strong>keystrokes</strong>, not in
          per cent: “up 4” means 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Accuracy</p>
        <Absatz>
          <strong>(Characters minus mistakes) ÷ characters</strong>, as a
          percentage. A mistake that was corrected is still a mistake - what
          counts is the keystroke, not the result on the screen.
        </Absatz>
        <Absatz>
          Here the change is given in <strong>percentage points</strong> (from
          94% to 96% is “up 2”).
        </Absatz>
        <Absatz>
          ★ This is the more telling of the two figures: pupils who type
          accurately get faster by themselves - the other way round hardly
          ever happens.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Weekly goals</p>
        <Absatz>
          For each pupil you set <strong>minutes per week</strong> - there is
          nothing else to set. What is shown is the share of the minutes set
          that were actually done, for example “87%”, with the addition “62 of
          71 minutes - met in full in 2 of 3 weeks”. It is worked out{" "}
          <strong>minute by minute</strong>, not week by week: a pupil who
          does part of it every week clearly stands apart from one who does
          nothing.
        </Absatz>
        <Absatz>
          <strong>Catch up on missed minutes from previous weeks</strong> (a
          tick box for the teacher): practising more than a week asks for
          fills up the oldest week that is still open - never beyond that
          week's own goal.
        </Absatz>
        <Absatz>
          If <strong>no weekly goal is set</strong>, this figure is left out -
          and with it the column “Weekly goal” in the table. So there is never
          a zero anywhere that looks like something was missed.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT_EN} (challenge score)</p>
        <Absatz>
          A {PRUEFUNG_WORT_EN} is a challenge for the whole class: the same
          text, the same time. Its result is the{" "}
          <strong>challenge score from 0 to 100</strong>. It puts accuracy
          and speed together in one number:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Precision</strong> = characters ÷ (characters + {FEHLER_GEWICHT} ×
            wrong keys) - a wrong key counts as much as {FEHLER_GEWICHT} characters.
          </li>
          <li>
            <strong>Speed factor</strong> = square root of (keystrokes per minute ÷{" "}
            {BEZUGSTEMPO}), at most 1.
          </li>
          <li>
            <strong>Challenge score</strong> = 100 × precision × speed factor.
          </li>
        </ul>
        {/* ★ 23.09.2026 („Freies Schreiben", E6): siehe die deutsche Fassung -
            die Formel oben bleibt Zeichen für Zeichen stehen (der Wächter
            prüft sie wörtlich mit k = {FEHLER_GEWICHT}); hier nur der zweite
            Fall dazu. */}
        <Absatz>
          That {FEHLER_GEWICHT} is the weight for <strong>“Strict”</strong>{" "}
          (the default): every wrong key counts, even one put right straight
          away - it cost time along the way. For{" "}
          <strong>“Free writing”</strong> the weight is{" "}
          <strong>{FEHLER_GEWICHT_FREI}</strong> instead: only what is still
          wrong at the end is scored (at most one mistake per word, corrected
          spots don't count), and a mistake left standing has cost no typing
          time of its own - so it weighs more.
        </Absatz>
        <Absatz>
          The square root makes sure that <strong>accuracy counts for more
          than time</strong>: double the speed doesn't count double, only 1.4
          times. Below {MIND_ZEICHEN_WERTUNG} characters typed there is no
          challenge score.
        </Absatz>
        <Absatz>
          It appears in the results table of every round, as an average in the
          column “{PRUEFUNG_WORT_EN}” of the class statistics (“3 / 82”: three
          done, average challenge score 82) and for the pupil in “My
          statistics”. Because all pupils in a round type the same text in the
          same time, their figures can be compared with each other.
        </Absatz>
      </div>

      <Absatz>
        <strong>What it is compared with</strong> you can switch above the
        figure: with the <strong>previous week</strong> (the default) or with
        the <strong>start of the school year for the class</strong>. The start
        of the school year is not 1 August but the first week in which{" "}
        <strong>at least half</strong> of the class practised - so that a few
        pupils practising in the holidays don't set the start for everyone.
        Anyone who joins later is compared from their own first week.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">What these figures don't know</p>
        <Absatz>
          They measure what happened on the device. They know nothing about
          where a pupil started from, about an injured hand, a week off sick
          or a change of assistive technology. A figure that has gone down is a{" "}
          <em>reason to ask</em> - not a statement about effort.
        </Absatz>
        <Absatz>
          How much practice lies behind the figures at all is shown in the
          column <strong>Practice time</strong> and behind the arrow
          (“Exercises”, “Active days”, “Time practised”).
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeEn() {
  const zeilen: [string, string][] = [
    [
      "Settings",
      "The round button with the arrow. It expands everything about this pupil: “Where to start”, “One-handed typing”, “Take your time”, “Wide letter spacing (CVI)”, the weekly goal and the detailed results.",
    ],
    ["Difficulty level", "1 to 50 - how hard the exercises may be at the moment. Not a mark."],
    ["Practice time", "Pure typing time in the chosen period. Pauses don't count."],
    [
      "Weekly goal",
      "Minutes practised out of the minutes set for this week. Only appears if a goal is set.",
    ],
    ["Accuracy", "The proportion of characters typed correctly."],
    [
      "Keystrokes/min",
      "Speed. With “Take your time” the number is shown, but it doesn't count anywhere in the app.",
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">The period: </dt>
        <dd className="m-0 inline">
          Above the table you choose what all the figures refer to - a single
          week, a month (the last 4 weeks, not the calendar month), the school
          year or all time; you move back and forth through weeks, months and
          school years with the arrows on either side. The results behind the
          arrow are not affected; they always show the whole year.
        </dd>
      </div>
    </dl>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ★ E11a-5 (26.09.2026): DIE DREI ERKLÄRUNGEN FRANZÖSISCH
// ════════════════════════════════════════════════════════════════════════════
//
// Johannes F18: „wer Französisch verwendet, bekommt alles in Französisch" -
// bis hierher fiel die französische Bedienung an dieser Stelle auf Englisch
// zurück (die „bekannte Lücke" in `LehrerHilfe.fr.tsx`/`MeineKlasseHilfe.fr.tsx`),
// und mit dem Einschalten wäre sie auf DEUTSCH gefallen (`sprache === "en"`
// oben, Falle 30). Aus der Funktion neu geschrieben, nicht übersetzt;
// dieselben Zahlen aus denselben Konstanten. Lehrkraft-Bereich ⇒ immer
// „vous" (Bauplan §9.1). Die Namen der Felder und Spalten sind wörtlich die
// der französischen Oberfläche (`TastenflowReiter.tsx`, `leistungExport.ts`):
// « Niveau », « Précision », « Qualité », « Temps d'exercice », « Par où
// commencer ? », « La vitesse ne compte pas », « le Défi », « Mes progrès ».

function LeistungsstufeHilfeFr() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        Le <strong>niveau</strong> est un nombre de <strong>1 à 50</strong>. Il
        dit <strong>quelle difficulté les exercices peuvent avoir pour cet élève
        en ce moment</strong> - et rien d'autre. L'application le règle
        elle-même ; vous n'avez rien à faire.
      </Absatz>
      <Absatz>
        Chaque niveau a un <strong>objectif de vitesse</strong> : le niveau 2
        demande 22 frappes par minute, le niveau 50 en demande 420 (environ 84
        mots par minute, la vitesse d'une personne dont c'est le métier). Entre
        les deux, les objectifs augmentent par paliers réguliers - petits en
        bas, pour que même un élève qui tape très lentement ait un niveau
        suivant à sa portée, grands en haut, pour que les élèves entrainés ne
        butent pas contre un plafond. <strong>Le niveau 1 est à part :</strong>{" "}
        la vitesse n'y compte pas du tout, seule la précision compte.
      </Absatz>
      <Absatz>
        <strong>Comment il évolue :</strong> l'application regarde jusqu'aux
        cinq dernières séries au niveau actuel - et seulement à partir de la
        troisième série à ce niveau (sinon le nombre sauterait sans cesse). Si
        la plupart sont précises <em>et</em> atteignent l'objectif de vitesse,
        le niveau monte ; avec une grande avance, de plusieurs niveaux d'un
        coup. Si la plupart sont trop imprécises ou nettement trop lentes, il
        descend d'un niveau. Seul un élève qui reste longtemps très imprécis{" "}
        <em>et</em> très lent revient au niveau 1 - là où la vitesse ne compte
        plus.
      </Absatz>
      <Absatz>
        <strong>Avec "La vitesse ne compte pas"</strong> (un réglage par
        élève), la vitesse ne compte à <em>aucun</em> niveau. Le niveau monte
        et descend alors uniquement selon la précision.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Le niveau n'est ni une note ni un score.</strong> Un élève
        au niveau 8 qui gagne deux niveaux chaque semaine avance mieux qu'un
        élève resté au niveau 30 depuis octobre. À quoi sert le niveau : voir
        si les exercices conviennent en ce moment. Ce qui est pensé pour
        l'évaluation se trouve dans la partie suivante.
      </Absatz>
      <Absatz>
        ⚠️ À ne pas confondre avec le <strong>niveau des textes</strong> - il
        règle seulement à quel point les textes d'exercice sonnent adultes
        (7-10 ans, 11-15 ans, 16 ans et plus) et n'a rien à voir avec la
        performance.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeFr() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        L'application <strong>ne donne pas de note</strong>. Elle fournit{" "}
        <strong>quatre valeurs</strong> - c'est vous qui décidez ce qui en
        fait une note. Les trois premières figurent sur la carte au-dessus du
        tableau, pour toute la classe et, pour chaque élève, derrière la
        flèche ; la quatrième dans la colonne "{PRUEFUNG_WORT_FR}".
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Vitesse (frappes par minute)</p>
        <Absatz>
          Tous les caractères tapés, divisés par le temps de frappe pur, fois
          60. Seul le temps passé sur le texte compte - une pause pendant
          laquelle l'application reste ouverte ne compte pas.
        </Absatz>
        <Absatz>
          À côté figure l'évolution, en <strong>frappes</strong> et non en
          pourcentage : "en hausse de 4" signifie 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Précision</p>
        <Absatz>
          <strong>(Caractères moins erreurs de frappe) ÷ caractères</strong>,
          en pourcentage. Une erreur de frappe corrigée reste une erreur de
          frappe - c'est la frappe qui compte, pas le résultat à l'écran.
        </Absatz>
        <Absatz>
          Ici, l'évolution est donnée en <strong>points de pourcentage</strong>{" "}
          (de 94 % à 96 %, c'est "en hausse de 2").
        </Absatz>
        <Absatz>
          ★ C'est la plus parlante des deux valeurs : qui tape avec précision
          devient plus rapide tout seul - l'inverse n'arrive presque jamais.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Objectifs de la semaine</p>
        <Absatz>
          Pour chaque élève, vous réglez des <strong>minutes par semaine</strong>{" "}
          - rien d'autre. L'application affiche la part des minutes faites sur
          les minutes demandées, par exemple "87 %", avec la précision "62
          sur 71 minutes - entièrement atteint 2 semaines sur 3". Le calcul se
          fait <strong>minute par minute</strong>, pas semaine par semaine : un
          élève qui fait une partie chaque semaine se distingue clairement de
          quelqu'un qui ne fait rien.
        </Absatz>
        <Absatz>
          <strong>Rattraper les minutes manquées des semaines précédentes</strong>{" "}
          (case à cocher de l'enseignant ou de l'enseignante) : qui s'exerce
          plus qu'une semaine ne le demande remplit la plus ancienne semaine
          encore ouverte - jamais au-delà de son propre objectif.
        </Absatz>
        <Absatz>
          Si <strong>aucun objectif de la semaine n'est fixé</strong>, cette
          valeur disparait - et avec elle la colonne "Objectif de la semaine"
          du tableau. Aucun zéro n'apparait alors, qui ressemblerait à un oubli.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT_FR} (score du Défi)</p>
        <Absatz>
          Le {PRUEFUNG_WORT_FR} est une épreuve pour toute la classe : le même
          texte, le même temps. Son résultat est le{" "}
          <strong>score du Défi, de 0 à 100</strong>. Il réunit la précision
          et la vitesse en un seul nombre :
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Qualité</strong> = caractères ÷ (caractères + k × erreurs
            de frappe) - une erreur de frappe compte autant que k caractères.
          </li>
          <li>
            <strong>Facteur de vitesse</strong> = racine carrée de (frappes par
            minute ÷ {BEZUGSTEMPO}), au plus 1.
          </li>
          <li>
            <strong>Score du Défi</strong> = 100 × qualité × facteur de vitesse.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> en mode "Strict" (réglage par
          défaut) : chaque erreur de frappe compte, même corrigée aussitôt -
          elle a couté du temps en route.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> en mode "Écriture libre" :
          seul ce qui reste faux à la fin est compté (au plus une erreur par
          mot, les endroits corrigés ne comptent pas) - une erreur restée en
          place n'a pas couté de temps à elle seule et pèse donc plus lourd.
        </Absatz>
        <Absatz>
          La racine carrée fait que <strong>la précision compte plus que le
          temps</strong> : une vitesse double ne compte pas double, mais
          seulement 1,4 fois. En dessous de {MIND_ZEICHEN_WERTUNG} caractères
          écrits, il n'y a pas de score du Défi.
        </Absatz>
        <Absatz>
          Il figure dans le tableau des résultats de chaque série, en moyenne
          dans la colonne "{PRUEFUNG_WORT_FR}" du tableau de bord ("3 / 82" :
          trois Défis, score du Défi moyen 82) et, pour l'élève, dans "Mes
          progrès". Comme tous les élèves d'une série écrivent le même texte
          dans le même temps, leurs valeurs se comparent entre elles.
        </Absatz>
      </div>

      <Absatz>
        <strong>À quoi la valeur est comparée,</strong> vous le choisissez
        au-dessus d'elle : à la <strong>semaine précédente</strong> (réglage
        par défaut) ou au <strong>début de l'année scolaire de la classe</strong>.
        Ce début n'est pas le 1er aout, mais la première semaine où{" "}
        <strong>au moins la moitié</strong> de la classe s'est exercée - pour
        que quelques élèves qui s'exercent pendant les vacances ne fixent pas
        le départ de tout le monde. Qui arrive plus tard est comparé à partir
        de sa propre première semaine.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Ce que ces valeurs ignorent</p>
        <Absatz>
          Elles mesurent ce qui s'est passé sur l'appareil. Elles ne savent
          rien du point de départ d'un élève, d'une main blessée, d'une semaine
          de maladie ou d'un changement d'aide technique. Une valeur qui a
          baissé est une <em>raison de se renseigner</em> - pas une information
          sur l'effort.
        </Absatz>
        <Absatz>
          Combien d'exercice se cache derrière les chiffres, vous le voyez dans
          la colonne <strong>Temps d'exercice</strong> et derrière la flèche
          ("Exercices", "Jours actifs", "Temps exercé").
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeFr() {
  const zeilen: [string, string][] = [
    [
      "Réglages",
      `Le bouton rond avec la flèche. Il déplie tout ce qui concerne cet élève : "Par où commencer ?", "Écrire d'une seule main", "La vitesse ne compte pas", "Grand espacement des caractères (CVI)", l'objectif de la semaine et le bilan détaillé.`,
    ],
    ["Niveau", "1 à 50 - quelle difficulté les exercices peuvent avoir en ce moment. Pas une note."],
    ["Temps d'exercice", "Temps de frappe pur sur la période choisie. Les pauses ne comptent pas."],
    [
      "Objectif de la semaine",
      "Minutes exercées sur les minutes demandées cette semaine. N'apparait que si un objectif est fixé.",
    ],
    ["Précision", "La part des caractères tapés correctement."],
    [
      "Frappes/min",
      `La vitesse. Avec "La vitesse ne compte pas", le nombre s'affiche, mais ne compte nulle part dans l'application.`,
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name} : </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">La période : </dt>
        <dd className="m-0 inline">
          Au-dessus du tableau, vous choisissez à quoi se rapportent tous les
          chiffres - une semaine, un mois (les 4 dernières semaines, pas le
          mois du calendrier), l'année scolaire ou tout ; vous passez d'une
          semaine, d'un mois ou d'une année scolaire à l'autre avec les flèches
          de part et d'autre. Le bilan derrière la flèche n'en dépend pas ; il
          montre toujours toute l'année.
        </dd>
      </div>
    </dl>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ★ ES-O (27.09.2026, Bauplan D6): DIESELBEN DREI ERKLÄRUNGEN AUF SPANISCH
// ════════════════════════════════════════════════════════════════════════════
//
// Ohne diesen Zweig fiel die spanische Bedienung hier auf DEUTSCH (Falle 30).
// Aus der Funktion neu geschrieben, nicht übersetzt; dieselben Zahlen aus
// denselben Konstanten. Lehrkraft-Bereich ⇒ immer „usted" (Bauplan S9),
// geschlechtergerecht über Sammelwörter („el alumnado", „estudiante", S10).
// Die Namen der Felder und Spalten sind wörtlich die der spanischen
// Oberfläche (`TastenflowReiter.tsx`, `leistungExport.ts`): « Nivel »,
// « Precisión », « Calidad », « Tiempo de práctica », « La velocidad no
// cuenta », « el Reto », « Mi progreso ». Dezimalzeichen seit D1 (28.09.2026,
// Nr. 15) nach dem Land der Browsersprache (`dezimal("es")`), nicht mehr fest
// der Punkt nach RAE/ASALE 2010.

function LeistungsstufeHilfeEs() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        El <strong>nivel</strong> es un número del <strong>1 al 50</strong>.
        Indica <strong>qué dificultad pueden tener ahora los ejercicios para
        esta persona</strong> - y nada más. El programa lo ajusta por sí solo;
        usted no tiene que hacer nada.
      </Absatz>
      <Absatz>
        Cada nivel tiene una <strong>meta de velocidad</strong>: el nivel 2 pide
        22 pulsaciones por minuto y el nivel 50 pide 420 (unas 84 palabras por
        minuto, la velocidad de quien escribe a máquina por oficio). Entre
        ambos, las metas crecen en pasos regulares - pequeños abajo, para que
        incluso quien escribe muy despacio tenga un nivel siguiente a su
        alcance, y grandes arriba, para que quien ya tiene práctica no choque
        contra un techo. <strong>El nivel 1 es especial:</strong> allí la
        velocidad no cuenta en absoluto, solo la precisión.
      </Absatz>
      <Absatz>
        <strong>Cómo cambia:</strong> el programa mira hasta las cinco últimas
        rondas en el nivel actual - y solo a partir de la tercera ronda en ese
        nivel (si no, el número saltaría sin parar). Si la mayoría son precisas{" "}
        <em>y</em> alcanzan la meta de velocidad, el nivel sube; con mucha
        ventaja, varios niveles de una vez. Si la mayoría son demasiado
        imprecisas o claramente demasiado lentas, baja un nivel. Solo quien se
        mantiene mucho tiempo muy impreciso <em>y</em> muy lento vuelve al
        nivel 1 - donde la velocidad ya no cuenta.
      </Absatz>
      <Absatz>
        <strong>Con "La velocidad no cuenta"</strong> (un ajuste para cada
        estudiante), la velocidad no cuenta en <em>ningún</em> nivel. El nivel
        sube y baja entonces solo según la precisión.
      </Absatz>
      <Absatz>
        ⚠️ <strong>El nivel no es una nota ni una puntuación.</strong> Quien
        está en el nivel 8 y sube dos niveles cada semana avanza mejor que
        quien sigue en el nivel 30 desde octubre. Para qué sirve el nivel: para
        ver si los ejercicios encajan en este momento. Lo que está pensado para
        la evaluación se encuentra en el apartado siguiente.
      </Absatz>
      <Absatz>
        ⚠️ No hay que confundirlo con el <strong>nivel de los textos</strong> -
        ese solo decide lo adultos que suenan los textos de práctica (7 a 10
        años, 11 a 15 años, a partir de 16) y no tiene nada que ver con el
        rendimiento.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeEs() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        El programa <strong>no pone notas</strong>. Ofrece{" "}
        <strong>cuatro valores</strong> - usted decide qué nota sale de ellos.
        Los tres primeros aparecen en la tarjeta encima de la tabla, para toda
        la clase y, para cada estudiante, detrás de la flecha; el cuarto, en la
        columna "{PRUEFUNG_WORT_ES}".
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Velocidad (pulsaciones por minuto)</p>
        <Absatz>
          Todos los caracteres escritos, divididos entre el tiempo neto de
          escritura en segundos y multiplicados por 60. Solo cuenta el tiempo
          dedicado al texto - una pausa
          con el programa abierto no cuenta.
        </Absatz>
        <Absatz>
          Al lado aparece la evolución, en <strong>pulsaciones</strong> y no en
          porcentaje: una subida de 4 significa 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Precisión</p>
        <Absatz>
          <strong>(Caracteres menos errores de pulsación) ÷ caracteres</strong>,
          en porcentaje. Un error corregido sigue siendo un error de pulsación -
          cuenta la pulsación, no el resultado en la pantalla.
        </Absatz>
        <Absatz>
          Aquí la evolución se da en <strong>puntos porcentuales</strong> (de
          94 % a 96 % es una subida de 2).
        </Absatz>
        <Absatz>
          ★ Es el más revelador de los dos valores: quien escribe con precisión
          gana velocidad por sí solo - lo contrario casi nunca ocurre.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Objetivos semanales</p>
        <Absatz>
          Para cada estudiante usted fija <strong>minutos por semana</strong> -
          nada más. El programa muestra el porcentaje de los minutos hechos sobre
          los pedidos, por ejemplo "87 %", con el detalle "62 de 71 minutos -
          objetivo cumplido del todo en 2 de 3 semanas". El cálculo va{" "}
          <strong>minuto a minuto</strong>, no semana a semana: quien hace una
          parte cada semana se distingue claramente de quien no hace nada.
        </Absatz>
        <Absatz>
          <strong>Recuperar los minutos pendientes de semanas anteriores</strong>{" "}
          (casilla de la persona docente): quien practica más de lo que pide una
          semana recupera la semana abierta más antigua - nunca por encima de su
          propio objetivo.
        </Absatz>
        <Absatz>
          Si <strong>no hay ningún objetivo semanal fijado</strong>, este valor
          desaparece - y con él la columna "Objetivo semanal" de la tabla. Así no
          aparece ningún cero que parezca un descuido.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT_ES} (puntuación del Reto)</p>
        <Absatz>
          El {PRUEFUNG_WORT_ES} es una prueba para toda la clase: el mismo
          texto y el mismo tiempo. Su resultado es la{" "}
          <strong>puntuación del Reto, de 0 a 100</strong>. Une la precisión y
          la velocidad en un solo número:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Calidad</strong> = caracteres ÷ (caracteres + k × errores de
            pulsación) - un error de pulsación cuenta como k caracteres.
          </li>
          <li>
            <strong>Factor de velocidad</strong> = raíz cuadrada de (pulsaciones
            por minuto ÷ {BEZUGSTEMPO}), como máximo 1.
          </li>
          <li>
            <strong>Puntuación del Reto</strong> = 100 × calidad × factor de
            velocidad.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> en el modo "Estricto" (el
          predeterminado): cuenta cada error de pulsación, aunque se corrija en
          el acto - por el camino ha costado tiempo.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> en el modo "Escritura
          libre": solo cuenta lo que al final sigue mal (como mucho un error por
          palabra; lo corregido no cuenta) - un error que se queda no ha costado
          tiempo por sí solo, por eso pesa más.
        </Absatz>
        <Absatz>
          La raíz cuadrada hace que <strong>la precisión cuente más que el
          tiempo</strong>: el doble de velocidad no cuenta el doble, sino solo
          {dezimal("es") === "," ? "1,4" : "1.4"} veces. Por debajo de {MIND_ZEICHEN_WERTUNG} caracteres escritos no
          hay puntuación del Reto.
        </Absatz>
        <Absatz>
          Aparece en la tabla de resultados de cada ronda, como media en la
          columna "{PRUEFUNG_WORT_ES}" del resumen ("3 / 82": tres Retos,
          puntuación media 82) y, para cada estudiante, en "Mi progreso". Como
          en una ronda todo el alumnado escribe el mismo texto en el mismo
          tiempo, sus valores se pueden comparar entre sí.
        </Absatz>
      </div>

      <Absatz>
        <strong>Con qué se compara el valor</strong> lo elige usted encima de
        él: con la <strong>semana anterior</strong> (lo predeterminado) o con
        el <strong>comienzo del curso escolar de la clase</strong>. Ese comienzo
        no es el 1 de agosto, sino la primera semana en la que{" "}
        <strong>al menos la mitad</strong> de la clase ha practicado - para que
        unas pocas personas que practican en vacaciones no fijen el punto de
        partida de todo el grupo. Quien llega más tarde se compara desde su
        propia primera semana.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Lo que estos valores no saben</p>
        <Absatz>
          Miden lo que ha pasado en el dispositivo. No saben nada del punto de
          partida de cada estudiante, de una mano lesionada, de una semana de
          enfermedad ni de un cambio de ayuda técnica. Un valor que ha bajado es
          un <em>motivo para preguntar</em> - no un dato sobre el esfuerzo.
        </Absatz>
        <Absatz>
          Cuánta práctica hay detrás de las cifras lo ve en la columna{" "}
          <strong>Tiempo de práctica</strong> y detrás de la flecha
          ("Ejercicios", "Días activos", "Tiempo practicado").
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeEs() {
  const zeilen: [string, string][] = [
    [
      "Configuración",
      `El botón redondo con la flecha. Despliega todo lo que afecta a esta persona: "¿Por dónde empieza?", "Escribir con una mano", "La velocidad no cuenta", "Espacio grande entre caracteres (CVI)", el objetivo semanal y el resumen detallado.`,
    ],
    ["Nivel", "Del 1 al 50 - qué dificultad pueden tener ahora los ejercicios. No es una nota."],
    ["Tiempo de práctica", "Tiempo neto de escritura en el periodo elegido. Las pausas no cuentan."],
    [
      "Objetivo semanal",
      "Minutos practicados sobre los minutos pedidos esta semana. Solo aparece si hay un objetivo fijado.",
    ],
    ["Precisión", "El porcentaje de caracteres escritos correctamente."],
    [
      "Pulsaciones por minuto",
      `La velocidad. Con "La velocidad no cuenta", el número se muestra, pero no cuenta en ninguna parte del programa.`,
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">El periodo: </dt>
        <dd className="m-0 inline">
          Encima de la tabla usted elige a qué se refieren todas las cifras -
          una semana, un mes (las 4 últimas semanas, no el mes del calendario),
          el curso escolar o todo; con las flechas de ambos lados pasa de una
          semana, un mes o un curso escolar a otro. El resumen detrás de la
          flecha no depende de ello; siempre muestra todo el año.
        </dd>
      </div>
    </dl>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ★ O-IT (02.10.2026): DIESELBEN DREI ERKLÄRUNGEN AUF ITALIENISCH
// ════════════════════════════════════════════════════════════════════════════
//
// Ohne diesen Zweig fiel die italienische Bedienung hier auf DEUTSCH (Falle 30).
// Aus der Funktion neu geschrieben, nicht übersetzt; dieselben Zahlen aus
// denselben Konstanten. Lehrkraft-Bereich ⇒ Infinitiv und neutrale Formen, nie
// „Lei" (Glossar Regel 1); „alunni" als Sammelwort, die einzelne „persona"
// (Regel 2); Dezimalkomma (Regel 5). Die Namen der Felder und Spalten sind
// wörtlich die der italienischen Oberfläche (`TastenflowReiter.tsx`,
// `leistungExport.ts`): « Livello », « Precisione », « Qualità », « Tempo di
// esercizio », « Da dove iniziare? », « La velocità non conta », « la Sfida »,
// « I miei progressi ».

function LeistungsstufeHilfeIt() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        Il <strong>livello</strong> è un numero da <strong>1 a 50</strong>.
        Indica <strong>quanto possono essere difficili ora gli esercizi per
        questa persona</strong> - e nient'altro. Il programma lo regola da
        solo; non serve fare niente.
      </Absatz>
      <Absatz>
        Ogni livello ha un <strong>obiettivo di velocità</strong>: il livello 2
        chiede 22 battute al minuto, il livello 50 ne chiede 420 (circa 84
        parole al minuto, la velocità di chi scrive per mestiere). In mezzo,
        gli obiettivi crescono a passi regolari - piccoli in basso, perché
        anche chi scrive molto lentamente abbia un livello successivo alla
        propria portata, grandi in alto, perché chi ha già pratica non sbatta
        contro un soffitto. <strong>Il livello 1 è speciale:</strong> lì la
        velocità non conta affatto, conta solo la precisione.
      </Absatz>
      <Absatz>
        <strong>Come cambia:</strong> il programma guarda fino agli ultimi
        cinque giri al livello attuale - e solo dal terzo giro a quel livello
        (altrimenti il numero salterebbe di continuo). Se la maggior parte
        sono precisi <em>e</em> raggiungono l'obiettivo di velocità, il livello
        sale; con molto vantaggio, anche di più livelli in una volta. Se la
        maggior parte sono troppo imprecisi o chiaramente troppo lenti, scende
        di uno. Solo chi resta a lungo molto impreciso <em>e</em> molto lento
        torna al livello 1 - dove la velocità non conta più.
      </Absatz>
      <Absatz>
        <strong>Con "La velocità non conta"</strong> (un'impostazione per ogni
        persona), la velocità non conta a <em>nessun</em> livello. Il livello
        sale e scende allora solo in base alla precisione.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Il livello non è un voto né un punteggio.</strong> Chi è al
        livello 8 e sale di due livelli ogni settimana va meglio di chi è
        fermo al livello 30 da ottobre. A che cosa serve il livello: a vedere
        se gli esercizi vanno bene in questo momento. Quello che è pensato per
        la valutazione si trova nella parte successiva.
      </Absatz>
      <Absatz>
        ⚠️ Da non confondere con i <strong>testi adatti all'età</strong> -
        decidono solo quanto suonano adulti i testi di esercizio (7-10 anni,
        11-15 anni, da 16 anni) e non hanno niente a che fare con il
        rendimento.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeIt() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        Il programma <strong>non dà voti</strong>. Fornisce{" "}
        <strong>quattro valori</strong> - quale voto ne esce lo decide chi
        insegna. I primi tre compaiono sulla scheda sopra la tabella, per
        tutta la classe e, per ogni persona, dietro la freccia; il quarto nella
        colonna "{PRUEFUNG_WORT_IT}".
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Velocità (battute al minuto)</p>
        <Absatz>
          Tutti i caratteri scritti, divisi per il tempo netto di scrittura e
          moltiplicati per 60. Conta solo il tempo passato sul testo - una
          pausa con il programma aperto non conta.
        </Absatz>
        <Absatz>
          Accanto c'è la variazione, in <strong>battute</strong> e non in
          percentuale: "salita di 4" significa 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Precisione</p>
        <Absatz>
          <strong>(Caratteri meno errori di battuta) ÷ caratteri</strong>, in
          percentuale. Un errore corretto resta un errore di battuta - conta la
          battuta, non il risultato sullo schermo.
        </Absatz>
        <Absatz>
          Qui la variazione è data in <strong>punti percentuali</strong> (da
          94% a 96% è "salita di 2").
        </Absatz>
        <Absatz>
          ★ È il più significativo dei due valori: chi scrive con precisione
          diventa più veloce da sé - il contrario non succede quasi mai.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Obiettivi settimanali</p>
        <Absatz>
          Per ogni persona si impostano i <strong>minuti alla settimana</strong>{" "}
          - nient'altro. Il programma mostra la quota dei minuti fatti su
          quelli richiesti, per esempio "87%", con il dettaglio "62 su 71
          minuti - obiettivo raggiunto del tutto in 2 settimane su 3". Il
          calcolo va <strong>minuto per minuto</strong>, non settimana per
          settimana: chi fa una parte ogni settimana si distingue chiaramente
          da chi non fa niente.
        </Absatz>
        <Absatz>
          <strong>Recuperare i minuti mancanti delle settimane precedenti</strong>{" "}
          (casella dell'insegnante): chi si esercita più di quanto chiede una
          settimana completa la settimana aperta più vecchia - mai oltre il suo
          obiettivo.
        </Absatz>
        <Absatz>
          Se <strong>non è impostato nessun obiettivo settimanale</strong>,
          questo valore sparisce - e con lui la colonna "Obiettivo settimanale"
          della tabella. Così non compare nessuno zero che sembri una
          mancanza.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT_IT} (punteggio della Sfida)</p>
        <Absatz>
          La {PRUEFUNG_WORT_IT} è una prova per tutta la classe: lo stesso
          testo e lo stesso tempo. Il suo risultato è il{" "}
          <strong>punteggio della Sfida, da 0 a 100</strong>. Unisce
          precisione e velocità in un solo numero:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Qualità</strong> = caratteri ÷ (caratteri + k × errori di
            battuta) - un errore di battuta conta quanto k caratteri.
          </li>
          <li>
            <strong>Fattore di velocità</strong> = radice quadrata di (battute
            al minuto ÷ {BEZUGSTEMPO}), al massimo 1.
          </li>
          <li>
            <strong>Punteggio della Sfida</strong> = 100 × qualità × fattore di
            velocità.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> nel modo "Rigoroso" (quello
          predefinito): conta ogni errore di battuta, anche se corretto subito -
          lungo la strada è costato tempo.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> nel modo "Scrittura
          libera": conta solo quello che alla fine è ancora sbagliato (al
          massimo un errore per parola; i punti corretti non contano) - un
          errore che resta non è costato tempo da solo, per questo pesa di più.
        </Absatz>
        <Absatz>
          La radice quadrata fa sì che <strong>la precisione conti più del
          tempo</strong>: il doppio della velocità non conta il doppio, ma solo
          1,4 volte. Sotto i {MIND_ZEICHEN_WERTUNG} caratteri scritti non c'è
          punteggio della Sfida.
        </Absatz>
        <Absatz>
          Compare nella tabella dei risultati di ogni giro, come media nella
          colonna "{PRUEFUNG_WORT_IT}" della panoramica ("3 / 82": tre Sfide,
          punteggio medio 82) e, per ogni persona, in "I miei progressi".
          Siccome in un giro tutti gli alunni scrivono lo stesso testo nello
          stesso tempo, i loro valori si possono confrontare tra loro.
        </Absatz>
      </div>

      <Absatz>
        <strong>Con che cosa si confronta il valore</strong> si sceglie sopra
        di esso: con la <strong>settimana precedente</strong> (impostazione
        predefinita) o con l'<strong>inizio dell'anno scolastico della
        classe</strong>. Questo inizio non è il primo agosto, ma la prima
        settimana in cui <strong>almeno la metà</strong> della classe si è
        esercitata - perché poche persone che si esercitano in vacanza non
        fissino la partenza per tutti. Chi arriva più tardi viene confrontato
        dalla propria prima settimana.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Quello che questi valori non sanno</p>
        <Absatz>
          Misurano quello che è successo sul dispositivo. Non sanno niente del
          punto di partenza di una persona, di una mano ferita, di una
          settimana di malattia o di un cambio di ausilio. Un valore che è
          sceso è un <em>motivo per chiedere</em> - non un'informazione
          sull'impegno.
        </Absatz>
        <Absatz>
          Quanto esercizio c'è dietro i numeri si vede nella colonna{" "}
          <strong>Tempo di esercizio</strong> e dietro la freccia ("Esercizi",
          "Giorni attivi", "Tempo esercitato").
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeIt() {
  const zeilen: [string, string][] = [
    [
      "Impostazioni",
      `Il pulsante rotondo con la freccia. Apre tutto quello che riguarda questa persona: "Da dove iniziare?", "Scrivere con una mano", "La velocità non conta", "Spaziatura ampia (CVI)", l'obiettivo settimanale e il resoconto dettagliato.`,
    ],
    ["Livello", "Da 1 a 50 - quanto possono essere difficili ora gli esercizi. Non è un voto."],
    ["Tempo di esercizio", "Tempo netto di scrittura nel periodo scelto. Le pause non contano."],
    [
      "Obiettivo settimanale",
      "Minuti esercitati sui minuti richiesti questa settimana. Compare solo se c'è un obiettivo impostato.",
    ],
    ["Precisione", "La quota di caratteri scritti correttamente."],
    [
      "Battute al minuto",
      `La velocità. Con "La velocità non conta" il numero si vede, ma non conta da nessuna parte nel programma.`,
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Il periodo: </dt>
        <dd className="m-0 inline">
          Sopra la tabella si sceglie a che cosa si riferiscono tutti i numeri -
          una settimana, un mese (le ultime 4 settimane, non il mese del
          calendario), l'anno scolastico o tutto dall'inizio; con le frecce ai
          due lati si passa da una settimana, un mese o un anno scolastico
          all'altro. Il resoconto dietro la freccia non ne dipende; mostra
          sempre tutto l'anno.
        </dd>
      </div>
    </dl>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ★ O-PL (02.10.2026): DIESELBEN DREI ERKLÄRUNGEN AUF POLNISCH
// ════════════════════════════════════════════════════════════════════════════
//
// Ohne diesen Zweig fiele die polnische Bedienung hier auf DEUTSCH (Falle 30).
// Aus der Funktion neu geschrieben, nicht übersetzt; dieselben Zahlen aus
// denselben Konstanten. Lehrkraft-Bereich ⇒ unpersönlich, nie die
// Höflichkeitsform der 3. Person (Glossar `recherche-polnisch-2026-10-02/
// GLOSSAR-pl.md`, Regel 1); „osoba" für die einzelne, „uczniowie" für alle,
// „osoba prowadząca klasę" für die Lehrkraft (Regel 2); keine Adjektive über
// eine Person; Dezimalkomma, „95%" (Regel 5); „…” im Fliesstext (Regel 8).
// Fachwörter §2.2/§2.6: poziom trudności, dokładność, tempo, uderzeń na
// minutę, wynik wyzwania, jakość, pomyłka, cel tygodniowy, czas ćwiczeń,
// „Bez pośpiechu", „Moje postępy". Eine Zahl aus einer Konstante im Satz geht
// durch `mehrzahl` mit allen vier Formen.

function LeistungsstufeHilfePl() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        <strong>Poziom trudności</strong> to liczba od <strong>1 do 50</strong>.
        Mówi, <strong>jak trudne mogą być teraz ćwiczenia dla tej
        osoby</strong> - i nic więcej. Program ustawia go sam; nie trzeba nic
        robić.
      </Absatz>
      <Absatz>
        Za każdym poziomem stoi <strong>cel tempa</strong>: poziom 2 wymaga 22
        uderzeń na minutę, poziom 50 - 420 (to około 84 słów na minutę, czyli
        tempo pisania zawodowego). Pomiędzy nimi cele rosną równymi krokami -
        na dole drobnymi, żeby także osoby piszące bardzo wolno miały
        następny poziom w zasięgu, na górze dużymi, żeby osoby z wprawą nie
        trafiały na sufit. <strong>Poziom 1 jest wyjątkowy:</strong> tam tempo
        w ogóle się nie liczy, liczy się tylko dokładność.
      </Absatz>
      <Absatz>
        <strong>Jak się zmienia:</strong> program patrzy na najwyżej pięć
        ostatnich rund na bieżącym poziomie - i to dopiero od trzeciej rundy na
        tym poziomie (inaczej liczba skakałaby w górę i w dół). Jeśli większość
        z nich jest dokładna <em>i</em> osiąga cel tempa, poziom rośnie; przy
        dużej przewadze nawet o kilka poziomów naraz. Jeśli większość jest zbyt
        niedokładna albo wyraźnie za wolna, spada o jeden. Dopiero przy
        długotrwale bardzo niskiej dokładności <em>i</em> bardzo wolnym tempie
        poziom wraca do 1 - tam, gdzie tempo przestaje się liczyć.
      </Absatz>
      <Absatz>
        <strong>Przy ustawieniu „Bez pośpiechu”</strong> (ustawienie dla każdej
        osoby) tempo nie liczy się na <em>żadnym</em> poziomie. Poziom rośnie i
        spada wtedy wyłącznie według dokładności.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Poziom trudności nie jest oceną ani liczbą punktów.</strong>{" "}
        Osoba na poziomie 8, która co tydzień idzie w górę o dwa poziomy,
        pracuje lepiej niż osoba, która od października stoi na poziomie 30. Do
        czego służy poziom: do sprawdzenia, czy ćwiczenia teraz pasują. To, co
        jest przeznaczone do oceniania, opisuje następna część.
      </Absatz>
      <Absatz>
        ⚠️ Nie mylić z ustawieniem <strong>„Teksty dla”</strong> - ono decyduje
        tylko o tym, jak dorośle brzmią teksty ćwiczeń (7-10 lat, 11-15 lat, od
        16 lat), i nie ma nic wspólnego z wynikami.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfePl() {
  // „Poniżej 200 napisanych znaków" - Genitiv nach „poniżej": die Einzahl
  // heisst „napisanego znaku", jede Mehrzahl „napisanych znaków".
  const mindZeichen = mehrzahl(MIND_ZEICHEN_WERTUNG, "pl", {
    one: (z) => `${z} napisanego znaku`,
    few: (z) => `${z} napisanych znaków`,
    many: (z) => `${z} napisanych znaków`,
    other: (z) => `${z} napisanego znaku`,
  });
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        Program <strong>nie wystawia ocen</strong>. Podaje{" "}
        <strong>cztery wartości</strong> - jaką ocenę z nich zbudować, decyduje
        osoba prowadząca klasę. Pierwsze trzy są na karcie nad tabelą, dla
        całej klasy i dla każdej osoby za strzałką; czwarta w kolumnie „
        {PRUEFUNG_WORT_PL}”.
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Tempo (uderzenia na minutę)</p>
        <Absatz>
          Wszystkie napisane znaki podzielone przez czysty czas pisania, razy
          60. Liczy się tylko czas przy tekście - przerwa, w której program jest
          otwarty, się nie liczy.
        </Absatz>
        <Absatz>
          Obok jest zmiana, i to w <strong>uderzeniach</strong>, nie w
          procentach: „wzrost o 4” oznacza 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Dokładność</p>
        <Absatz>
          <strong>(Znaki minus błędy) ÷ znaki</strong>, w procentach. Poprawiona
          pomyłka nadal jest pomyłką - liczy się uderzenie, a nie wynik na
          ekranie.
        </Absatz>
        <Absatz>
          Zmiana jest tu podawana w <strong>punktach procentowych</strong> (z
          94% na 96% to „wzrost o 2”).
        </Absatz>
        <Absatz>
          ★ To ważniejsza z dwóch wartości: pewne pisanie samo z czasem staje
          się szybsze - odwrotnie prawie nigdy.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Cele tygodniowe</p>
        <Absatz>
          Dla każdej osoby ustawia się <strong>minuty na tydzień</strong> - nic
          więcej. Widać udział przećwiczonych minut w wymaganych, np. „87%”, z
          dopiskiem „62 z 71 minut - w 2 z 3 tygodni cel w pełni osiągnięty”.
          Obliczenie idzie <strong>minuta po minucie</strong>, nie tydzień po
          tygodniu: osoba, która co tydzień robi część, wygląda wyraźnie inaczej
          niż osoba, która nie robi nic.
        </Absatz>
        <Absatz>
          <strong>Nadrób brakujące minuty z poprzednich tygodni</strong> (pole
          wyboru dla osoby prowadzącej klasę): ćwiczenie dłuższe, niż wymaga
          tydzień, uzupełnia najstarszy jeszcze otwarty tydzień - nigdy ponad
          jego własny cel.
        </Absatz>
        <Absatz>
          Jeśli <strong>nie ustawiono celu tygodniowego</strong>, ta wartość
          znika - a z nią kolumna „Cel tygodniowy” w tabeli. Nigdzie nie stoi
          wtedy zero, które wyglądałoby na zaniedbanie.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT_PL} (wynik wyzwania)</p>
        <Absatz>
          {PRUEFUNG_WORT_PL} to próba dla całej klasy: ten sam tekst, ten sam
          czas. Jego wynikiem jest <strong>wynik wyzwania od 0 do 100</strong>.
          Łączy dokładność i tempo w jednej liczbie:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Jakość</strong> = znaki ÷ (znaki + k × błędy) - jeden błąd
            liczy się tyle co k znaków.
          </li>
          <li>
            <strong>Współczynnik tempa</strong> = pierwiastek z (uderzenia na
            minutę ÷ {BEZUGSTEMPO}), najwyżej 1.
          </li>
          <li>
            <strong>Wynik wyzwania</strong> = 100 × jakość × współczynnik tempa.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> w trybie „Ściśle” (domyślnie):
          liczy się każda pomyłka, także od razu poprawiona - po drodze
          kosztowała czas.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> w trybie „Swobodne
          pisanie”: liczy się tylko to, co na końcu nadal jest błędne (najwyżej
          jeden błąd na słowo, poprawione miejsca się nie liczą) - pozostawiony
          błąd nie kosztował osobnego czasu, dlatego waży więcej.
        </Absatz>
        <Absatz>
          Pierwiastek sprawia, że <strong>dokładność liczy się bardziej niż
          czas</strong>: dwa razy wyższe tempo nie liczy się podwójnie, tylko
          1,4 raza. Poniżej {mindZeichen} nie ma wyniku wyzwania.
        </Absatz>
        <Absatz>
          Wynik jest w tabeli wyników każdej rundy, jako średnia w kolumnie „
          {PRUEFUNG_WORT_PL}” w statystykach klasy („3 / 82”: trzy Wyzwania,
          średni wynik 82) i u każdej osoby w części „Moje postępy”. Ponieważ w
          jednej rundzie wszyscy uczniowie piszą ten sam tekst w tym samym
          czasie, ich wyniki można ze sobą porównywać.
        </Absatz>
      </div>

      <Absatz>
        <strong>Z czym porównywać</strong>, wybiera się nad wartością: z{" "}
        <strong>poprzednim tygodniem</strong> (ustawienie domyślne) albo z{" "}
        <strong>początkiem roku szkolnego klasy</strong>. Ten początek to nie 1
        sierpnia, tylko pierwszy tydzień, w którym ćwiczyła{" "}
        <strong>co najmniej połowa</strong> klasy - żeby pojedyncze ćwiczenia
        w wakacje nie wyznaczały startu dla wszystkich. Osoby, które dołączą
        później, są porównywane od ich własnego pierwszego tygodnia.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Czego te wartości nie wiedzą</p>
        <Absatz>
          Mierzą to, co wydarzyło się na urządzeniu. Nie wiedzą nic o punkcie
          wyjścia danej osoby, o kontuzji ręki, o tygodniu choroby ani o zmianie
          technologii wspomagającej. Wartość, która spadła, to{" "}
          <em>powód, żeby zapytać</em> - a nie informacja o włożonym wysiłku.
        </Absatz>
        <Absatz>
          Ile ćwiczeń w ogóle kryje się za liczbami, widać w kolumnie{" "}
          <strong>Czas ćwiczeń</strong> i za strzałką („Ćwiczenia”, „Aktywne
          dni”, „Przećwiczony czas”).
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfePl() {
  const zeilen: [string, string][] = [
    [
      "Ustawienia",
      "Okrągły przycisk ze strzałką. Rozwija wszystko, co dotyczy tej osoby: „Od czego zacząć?”, „Pisanie jedną ręką”, „Bez pośpiechu”, „Duże odstępy (CVI)”, cel tygodniowy i szczegółowe podsumowanie.",
    ],
    ["Poziom trudności", "Od 1 do 50 - jak trudne mogą być teraz ćwiczenia. To nie ocena."],
    ["Czas ćwiczeń", "Czysty czas pisania w wybranym okresie. Przerwy się nie liczą."],
    [
      "Cel tygodniowy",
      "Przećwiczone minuty z wymaganych w tym tygodniu. Widać go tylko wtedy, gdy ustawiono cel.",
    ],
    ["Dokładność", "Udział trafionych znaków."],
    [
      "Uderzenia/min",
      "Tempo. Przy „Bez pośpiechu” liczba jest widoczna, ale nigdzie w programie się nie liczy.",
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Okres: </dt>
        <dd className="m-0 inline">
          Nad tabelą wybiera się, czego dotyczą wszystkie liczby - jednego
          tygodnia, miesiąca (ostatnie 4 tygodnie, nie miesiąc kalendarzowy),
          roku szkolnego albo wszystkiego od początku; między tygodniami,
          miesiącami i latami szkolnymi przechodzi się strzałkami po obu
          stronach. Podsumowanie za strzałką od tego nie zależy; zawsze pokazuje
          cały rok.
        </dd>
      </div>
    </dl>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ★ O-TR (02.10.2026): DIESELBEN DREI ERKLÄRUNGEN AUF TÜRKISCH
// ════════════════════════════════════════════════════════════════════════════
//
// Ohne diesen Zweig fiele die türkische Bedienung hier auf DEUTSCH (Falle 30).
// Aus der Funktion neu geschrieben, nicht übersetzt; dieselben Zahlen aus
// denselben Konstanten. Wer sie sieht: nur Lehrkräfte (Hilfe von "Sınıflarım"
// und `LehrerHilfe`) - darum durchgehend siz mit -(y)In ("ayarlarsınız",
// "karıştırmayın"), nie -(y)InIz, kein Ausrufezeichen (Glossar
// `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md`, Regel 1); das Kind heisst in
// der Lehrkraft-Sicht "öğrenci" (Regel 2). Prozent VOR der Zahl ("%87"),
// Dezimalkomma ("1,4"), nach einer Zahl Einzahl ("200 karakter"), KEINE Endung
// an Zahl oder Platzhalter (Regel 5/6: "%94 → %96", nie "%94'ten"). Fachwörter
// §2.2/§2.6: zorluk seviyesi, doğruluk, hız, dakikada vuruş (Spalte Vuruş/dk),
// yarışma puanı, kalite, yanlış tuş, haftalık hedef, çalışma süresi,
// "Acele yok", "İlerlemem", "Metinler"; Yarışma-Arten "Sıkı" / "Serbest yazma"
// und "hız katsayısı" sind neu (Glossar-Ergänzung, Schlussbericht O-TR B).

function LeistungsstufeHilfeTr() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        <strong>Zorluk seviyesi</strong>, <strong>1 ile 50</strong> arasında bir
        sayıdır. Tek bir şey söyler:{" "}
        <strong>alıştırmaların bu öğrenci için şu anda ne kadar zor
        olabileceğini</strong>. Program seviyeyi kendisi ayarlar; sizin bir şey
        yapmanız gerekmez.
      </Absatz>
      <Absatz>
        Her seviyenin arkasında bir <strong>hız hedefi</strong> vardır: 2. seviye
        dakikada 22 vuruş, 50. seviye dakikada 420 vuruş ister (bu, dakikada
        yaklaşık 84 kelime, yani profesyonel bir daktilografın hızıdır).
        Aradaki hedefler düzenli adımlarla büyür - altta küçük adımlarla,
        böylece çok yavaş yazan öğrencilerin de ulaşılabilir bir sonraki
        seviyesi olur; üstte büyük adımlarla, böylece deneyimli öğrenciler
        tavana çarpmaz. <strong>1. seviye özeldir:</strong> orada hız hiç
        sayılmaz, yalnızca doğruluk sayılır.
      </Absatz>
      <Absatz>
        <strong>Nasıl değişir:</strong> program, geçerli seviyedeki son en fazla
        beş tura bakar - ve bunu ancak bu seviyedeki üçüncü turdan itibaren
        yapar (yoksa sayı sürekli inip çıkardı). Bu turların çoğunda doğruluk
        yeterliyse <em>ve</em> hız hedefine ulaşılmışsa seviye yükselir; büyük
        bir farkla ulaşılmışsa aynı anda birkaç seviye birden. Çoğu fazla hatalı
        veya açıkça fazla yavaşsa seviye bir düşer. Yalnızca uzun süre çok
        hatalı <em>ve</em> çok yavaş yazan öğrenci 1. seviyeye geri döner -
        hızın artık sayılmadığı yere.
      </Absatz>
      <Absatz>
        <strong>"Acele yok" açıkken</strong> (her öğrenci için ayrı bir ayar)
        hız <em>hiçbir</em> seviyede sayılmaz. Seviye o zaman yalnızca doğruluğa
        göre yükselir ve düşer.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Zorluk seviyesi bir not veya puan değildir.</strong> Her hafta
        iki seviye ilerleyen 8. seviyedeki bir öğrenci, ekimden beri 30.
        seviyede duran bir öğrenciden daha iyi çalışmaktadır. Seviyenin işe
        yaradığı şey: alıştırmaların şu anda uygun olup olmadığını görmek.
        Değerlendirme için düşünülen değerler bir sonraki bölümde yer alır.
      </Absatz>
      <Absatz>
        ⚠️ <strong>"Metinler"</strong> ayarıyla karıştırmayın - bu ayar yalnızca
        alıştırma metinlerinin hangi yaşa uygun olduğunu belirler (7-10 yaş,
        11-15 yaş, 16 yaş ve üstü) ve başarıyla hiçbir ilgisi yoktur.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeTr() {
  // Nach einer Zahl steht im Türkischen die Einzahl ("200 karakter"), darum
  // `one` und `other` gleich; die Endung "-den" hängt am Wort "karakter",
  // nie an der Zahl (Glossar Regel 5/6).
  const mindZeichen = mehrzahl(MIND_ZEICHEN_WERTUNG, "tr", {
    one: (z) => `${z} karakterden`,
    other: (z) => `${z} karakterden`,
  });
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        Program <strong>not vermez</strong>. <strong>Dört değer</strong> sunar -
        bunlardan nasıl bir not oluşacağına siz karar verirsiniz. İlk üçü
        tablonun üstündeki kartta, tüm sınıf için ve her öğrenci için ok
        düğmesiyle açılan bölümde yer alır; dördüncüsü "{PRUEFUNG_WORT_TR}"
        sütunundadır.
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Hız (dakikada vuruş)</p>
        <Absatz>
          Yazılan tüm karakterler net yazma süresine bölünür ve 60 ile çarpılır.
          Yalnızca metin üzerinde geçen süre sayılır - programın açık durduğu
          bir mola sayılmaz.
        </Absatz>
        <Absatz>
          Yanında değişim yer alır, hem de yüzde olarak değil,{" "}
          <strong>vuruş</strong> olarak: "4 arttı", 211 → 215 demektir.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Doğruluk</p>
        <Absatz>
          <strong>(Karakterler eksi hatalar) ÷ karakterler</strong>, yüzde
          olarak. Düzeltilmiş bir hata yine de hatadır - sayılan, ekrandaki
          sonuç değil, vuruştur.
        </Absatz>
        <Absatz>
          Değişim burada <strong>yüzde puan</strong> olarak verilir (%94 → %96
          değişimi "2 arttı" olarak gösterilir).
        </Absatz>
        <Absatz>
          ★ İki başarı değerinden daha anlamlı olan budur: güvenle yazan,
          zamanla kendiliğinden hızlanır - tersi neredeyse hiç olmaz.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Haftalık hedefler</p>
        <Absatz>
          Her öğrenci için <strong>haftada kaç dakika</strong> çalışılacağını
          ayarlarsınız - başka bir birim yoktur. Gösterilen, istenen dakikalardan
          tamamlananların oranıdır, örn. "%87", yanında da "62 dk. (hedef: 71
          dk.) - hedefe tamamen ulaşılan hafta: 2, toplam 3" gibi bir ek bilgi.
          Hesap <strong>dakika dakika</strong> yapılır, hafta hafta değil: her
          hafta bir kısmını tamamlayan öğrenci, hiçbir şey yapmayan birinden
          görünür biçimde farklı bir yerde durur.
        </Absatz>
        <Absatz>
          <strong>Önceki haftalarda kaçırılan dakikaları telafi et</strong>{" "}
          (öğretmenin onay kutusu): bir haftanın istediğinden fazla çalışan
          öğrenci, fazlasıyla henüz tamamlanmamış en eski haftayı doldurur -
          ama asla o haftanın kendi hedefinin üstüne çıkmaz.
        </Absatz>
        <Absatz>
          <strong>Haftalık hedef belirlenmemişse</strong> bu değer kaybolur -
          onunla birlikte tablodaki "Haftalık hedef" sütunu da. O zaman hiçbir
          yerde ihmal gibi görünen bir sıfır durmaz.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT_TR} (yarışma puanı)</p>
        <Absatz>
          {PRUEFUNG_WORT_TR}, tüm sınıf için ortak bir yazma denemesidir: aynı
          metin, aynı süre. Sonucu <strong>0 ile 100 arasında bir yarışma
          puanıdır</strong>. Bu puan doğruluğu ve hızı tek bir sayıda birleştirir:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Kalite</strong> = karakterler ÷ (karakterler + k × hatalar) -
            bir hata k karakter kadar sayılır.
          </li>
          <li>
            <strong>Hız katsayısı</strong> = (dakikada vuruş ÷ {BEZUGSTEMPO})
            değerinin karekökü, en fazla 1.
          </li>
          <li>
            <strong>Yarışma puanı</strong> = 100 × kalite × hız katsayısı.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> "Sıkı" türünde (varsayılan): her
          yanlış tuş sayılır, hemen düzeltilmiş olsa bile - yolda zaman
          kaybettirmiştir.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> "Serbest yazma" türünde:
          yalnızca sonunda yanlış kalan sayılır (kelime başına en fazla bir
          hata, düzeltilen yerler sayılmaz) - kalan bir hata bunun için ayrıca
          zaman kaybettirmemiştir, bu yüzden daha ağır basar.
        </Absatz>
        <Absatz>
          Karekök, <strong>doğruluğun zamandan daha çok sayılmasını</strong>{" "}
          sağlar: iki kat hız iki kat değil, yalnızca 1,4 kat sayılır.{" "}
          {mindZeichen} az yazıldığında yarışma puanı verilmez.
        </Absatz>
        <Absatz>
          Puan her turun sonuç tablosunda, sınıf istatistiklerinin "
          {PRUEFUNG_WORT_TR}" sütununda ortalama olarak (iki sayı: yazılan
          yarışma sayısı ve ortalama yarışma puanı, örneğin 3 ve 82) ve
          öğrencinin "İlerlemem"
          bölümünde yer alır. Bir turdaki tüm öğrenciler aynı metni aynı sürede
          yazdığı için değerleri birbiriyle karşılaştırılabilir.
        </Absatz>
      </div>

      <Absatz>
        <strong>Neyle karşılaştırılacağını</strong> değerin üstünden
        değiştirirsiniz: <strong>önceki haftayla</strong> (varsayılan ayar) veya{" "}
        <strong>sınıfın öğretim yılı başlangıcıyla</strong>. Öğretim yılı
        başlangıcı burada 1 Ağustos değil, sınıfın <strong>en az
        yarısının</strong> çalıştığı ilk haftadır - böylece tatildeki tek tük
        çalışmalar herkes için başlangıcı belirlemez. Sonradan katılan öğrenci
        kendi ilk haftasından itibaren karşılaştırılır.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Bu değerlerin bilmedikleri</p>
        <Absatz>
          Değerler cihazda olanı ölçer. Bir öğrencinin başlangıç durumu, bir el
          yaralanması, hastalıkla geçen bir hafta veya yardımcı teknolojinin
          değiştirilmesi hakkında hiçbir şey bilmez. Küçülmüş bir değer{" "}
          <em>sormak için bir vesiledir</em> - harcanan emek hakkında bir bilgi
          değildir.
        </Absatz>
        <Absatz>
          Sayıların arkasında ne kadar alıştırma olduğunu{" "}
          <strong>Çalışma süresi</strong> sütununda ve ok düğmesiyle açılan
          bölümde ("Alıştırmalar", "Çalışılan günler", "Çalışma süresi")
          görürsünüz.
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeTr() {
  const zeilen: [string, string][] = [
    [
      "Ayarlar",
      `Ok işaretli yuvarlak düğme. Bu öğrenciyle ilgili her şeyi açar: "Nereden başlansın?", "Tek elle yazma", "Acele yok", "Geniş harf aralığı (CVI)", haftalık hedef ve ayrıntılı değerlendirme.`,
    ],
    ["Zorluk seviyesi", "1 ile 50 arası - alıştırmaların şu anda ne kadar zor olabileceği. Not değildir."],
    ["Çalışma süresi", "Seçilen zaman aralığındaki net yazma süresi. Molalar sayılmaz."],
    [
      "Haftalık hedef",
      "Bu haftanın istenen dakikalarından çalışılanlar. Yalnızca bir hedef belirlenmişse görünür.",
    ],
    ["Doğruluk", "Doğru basılan karakterlerin oranı."],
    [
      "Vuruş/dk",
      `Hız. "Acele yok" açıkken sayı görünür, ama programda hiçbir yerde sayılmaz.`,
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Zaman aralığı: </dt>
        <dd className="m-0 inline">
          Tablonun üstünde tüm sayıların neye dayandığını seçersiniz - tek bir
          hafta, bir ay (takvim ayı değil, son 4 hafta), öğretim yılı veya
          başından beri; haftalar, aylar ve öğretim yılları arasında yanlardaki
          ok düğmeleriyle geçiş yaparsınız. Ok düğmesiyle açılan değerlendirme
          bundan etkilenmez; her zaman tüm yılı gösterir.
        </dd>
      </div>
    </dl>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ★ O-CS (03.10.2026): DIESELBEN DREI ERKLÄRUNGEN AUF TSCHECHISCH
// ════════════════════════════════════════════════════════════════════════════
//
// Ohne diesen Zweig fiele die tschechische Bedienung hier auf DEUTSCH (Falle 30).
// Aus der Funktion neu geschrieben, nicht übersetzt; dieselben Zahlen aus
// denselben Konstanten. Wer sie sieht: nur Lehrkräfte (Hilfe von „Moje třídy"
// und `LehrerHilfe`) - darum durchgehend vy-Mehrzahl („nastavíte",
// „Nezaměňujte"), kein Ausrufezeichen (Glossar
// `recherche-tschechisch-2026-10-02/GLOSSAR-cs.md`, Regel 1); das Kind heisst in
// der Lehrkraft-Sicht „osoba", alle zusammen „žáci"/„děti" (Regel 2), keine
// Vergangenheit über eine Person. Kein Satz endet mit Zahl und Punkt
// (§4 Falle 4: „hodnota 1 je strop", nicht „nejvýše 1."); Zahlen aus
// Konstanten stehen nach „je" oder in Klammern, nie gebeugt vor einem Nomen.
// Prozent mit geschütztem Leerzeichen („94&nbsp;%", Regel 5), Dezimalkomma
// („1,4krát"). Fachwörter §2.2/§2.6: úroveň obtížnosti, přesnost, rychlost,
// úhozy za minutu (Spalte úhozů/min), skóre výzvy, kvalita, překlep, týdenní
// cíl, čas procvičování, „V klidu", „Texty pro věk", „Kde začít?", „Můj
// pokrok", „Dohnat minuty z minulých týdnů"; die Výzva-Arten „Přísně" /
// „Volné psaní" und „podíl rychlosti" sind neu (Glossar-Ergänzung,
// Schlussbericht O-CS B).

function LeistungsstufeHilfeCs() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        <strong>Úroveň obtížnosti</strong> je číslo od <strong>1 do 50</strong>.
        Říká, <strong>jak těžká smějí být cvičení pro tuto osobu právě
        teď</strong> - a nic jiného. Program ji nastavuje sám; nemusíte pro to
        nic dělat.
      </Absatz>
      <Absatz>
        Za každou úrovní stojí <strong>cíl rychlosti</strong>: úroveň 2 vyžaduje
        22 úhozů za minutu, úroveň 50 vyžaduje 420 (to odpovídá rychlosti
        profesionálního psaní). Mezi nimi cíle rostou
        rovnoměrnými kroky - dole jemnými, aby i žáci, kteří píšou velmi
        pomalu, měli dosažitelnou další úroveň, nahoře širokými, aby zkušení
        žáci nenarazili na strop. <strong>Úroveň 1 je zvláštní:</strong> tam se
        rychlost vůbec nepočítá, jen přesnost.
      </Absatz>
      <Absatz>
        <strong>Jak se mění:</strong> program se dívá na nejvýše pět posledních
        kol na aktuální úrovni - a vůbec až od třetího kola na této úrovni
        (jinak by číslo skákalo sem a tam). Je-li většina z nich přesná{" "}
        <em>a</em> dosahuje cíle rychlosti, úroveň stoupne; při velkém náskoku
        i o několik úrovní najednou. Je-li většina příliš nepřesná nebo
        zřetelně příliš pomalá, klesne o jednu. Jen při dlouhodobě velmi nízké
        přesnosti <em>a</em> velmi pomalém psaní se vrátí na úroveň 1 - tam,
        kde se rychlost už nepočítá.
      </Absatz>
      <Absatz>
        <strong>Při volbě „V klidu“</strong> (nastavení pro každou osobu zvlášť)
        se rychlost nepočítá na <em>žádné</em> úrovni. Úroveň pak stoupá a
        klesá jen podle přesnosti.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Úroveň obtížnosti není známka ani počet bodů.</strong>{" "}
        Osoba na úrovni 8, která každý týden postoupí o dvě úrovně, pracuje
        lépe než osoba, která stojí na úrovni 30 už od října. K čemu úroveň slouží:
        k posouzení, zda cvičení právě odpovídají. Co je určeno k hodnocení,
        popisuje další oddíl.
      </Absatz>
      <Absatz>
        ⚠️ Nezaměňujte s nastavením <strong>„Texty pro věk“</strong> - to řídí
        jen to, jak dospěle znějí texty cvičení (7-10 let, 11-15 let, od 16
        let), a s výkonem nemá nic společného.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeCs() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        Program <strong>nedává známky</strong>. Poskytuje{" "}
        <strong>čtyři hodnoty</strong> - jakou známku z nich sestavíte,
        rozhodujete vy. První tři jsou na kartě nad tabulkou, pro celou třídu a
        u každé osoby za šipkou; čtvrtá ve sloupci „{PRUEFUNG_WORT_CS}“.
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Rychlost (úhozy za minutu)</p>
        <Absatz>
          Počet všech napsaných znaků krát 60, vydělený čistým časem psaní v
          sekundách. Počítá se jen čas u textu - přestávka, během níž je program otevřený, se
          nepočítá.
        </Absatz>
        <Absatz>
          Vedle je změna, a to v <strong>úhozech</strong>, ne v procentech:
          zlepšení o 4 úhozy znamená 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Přesnost</p>
        <Absatz>
          <strong>(Znaky minus chyby) ÷ znaky</strong>, v procentech. Opravená
          chyba zůstává chybou - počítá se úhoz, ne výsledek na obrazovce.
        </Absatz>
        <Absatz>
          Změna je zde uvedena v <strong>procentních bodech</strong> (z 94&nbsp;%
          na 96&nbsp;% je zlepšení o 2 procentní body).
        </Absatz>
        <Absatz>
          ★ To je výmluvnější z obou hodnot výkonu: kdo píše jistě, sám od sebe
          zrychlí - naopak to skoro nikdy neplatí.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Týdenní cíle</p>
        <Absatz>
          U každé osoby nastavíte <strong>minuty za týden</strong> - nic víc.
          Zobrazuje se podíl odcvičených minut z požadovaných, např.
          „87&nbsp;%“, a vedle toho, kolik minut z požadovaných bylo odcvičeno a
          v kolika týdnech byl cíl splněn celý. Počítá se{" "}
          <strong>jednotlivě po minutách</strong>, ne po týdnech: kdo každý
          týden zvládne aspoň část, vypadá zřetelně jinak než někdo, kdo nedělá
          nic.
        </Absatz>
        <Absatz>
          <strong>Dohnat minuty z minulých týdnů</strong> (políčko pro
          vyučující): kdo cvičí víc, než týden vyžaduje, doplní tím nejstarší
          dosud otevřený týden - nikdy nad jeho vlastní cíl.
        </Absatz>
        <Absatz>
          Není-li <strong>nastaven týdenní cíl</strong>, tato hodnota odpadá - a
          s ní i sloupec „Týdenní cíl“ v tabulce. Nikde pak nestojí nula, která
          by vypadala jako zanedbání.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT_CS} (skóre výzvy)</p>
        <Absatz>
          {PRUEFUNG_WORT_CS} je společné psaní pro celou třídu: stejný text,
          stejný čas. Jejím výsledkem je <strong>skóre výzvy od 0 do 100</strong>.
          Spojuje přesnost a rychlost v jednom čísle:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Kvalita</strong> = znaky ÷ (znaky + k × chyby) - jedna chyba
            se počítá jako k znaků.
          </li>
          <li>
            <strong>Podíl rychlosti</strong> = odmocnina z (úhozy za minutu
            ÷ {BEZUGSTEMPO}); hodnota 1 je strop.
          </li>
          <li>
            <strong>Skóre výzvy</strong> = 100 × kvalita × podíl rychlosti.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> u typu „Přísně“ (výchozí):
          počítá se každý překlep, i hned opravený - cestou stál čas.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> u typu „Volné psaní“:
          hodnotí se jen to, co na konci zůstane chybně (v každém slově nejvýše
          jedna chyba, opravená místa se nepočítají) - ponechaná chyba za to
          nestála žádný zvláštní čas, a proto váží víc.
        </Absatz>
        <Absatz>
          Odmocnina zajišťuje, že <strong>přesnost se počítá víc než
          čas</strong>: dvojnásobná rychlost se nepočítá dvojnásobně, ale jen
          1,4krát. Nejmenší počet napsaných znaků pro skóre výzvy je{" "}
          {MIND_ZEICHEN_WERTUNG} - při menším počtu se skóre výzvy neuvádí.
        </Absatz>
        <Absatz>
          Skóre je v tabulce výsledků každého kola, jako průměr ve sloupci „
          {PRUEFUNG_WORT_CS}“ ve statistice třídy („3 / 82“: tři napsané Výzvy,
          průměrné skóre 82) a u dítěte v části „Můj pokrok“. Protože všechny
          děti jednoho kola píšou stejný text ve stejném čase, lze jejich
          hodnoty mezi sebou porovnávat.
        </Absatz>
      </div>

      <Absatz>
        <strong>S čím se porovnává,</strong> přepnete nad hodnotou: s{" "}
        <strong>předchozím týdnem</strong> (výchozí nastavení), nebo se{" "}
        <strong>začátkem školního roku třídy</strong>. Začátek školního roku se
        přitom nepočítá od 1. srpna, ale od prvního týdne, ve kterém cvičila{" "}
        <strong>alespoň polovina</strong> třídy - aby ojedinělé cvičení o
        prázdninách neurčilo začátek pro všechny. Kdo přibude později, porovnává
        se od svého vlastního prvního týdne.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Co tyto hodnoty nevědí</p>
        <Absatz>
          Měří, co se stalo na zařízení. Nevědí nic o výchozí situaci dítěte, o
          zranění ruky, o týdnu nemoci ani o změně kompenzační pomůcky. Hodnota,
          která se zmenšila, je <em>podnětem se zeptat</em> - ne údajem o
          vynaloženém úsilí.
        </Absatz>
        <Absatz>
          Kolik cvičení se za čísly vůbec skrývá, vidíte ve sloupci{" "}
          <strong>Čas procvičování</strong> a za šipkou („Cvičení“, „Aktivní
          dny“, „Odcvičený čas“).
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeCs() {
  const zeilen: [string, string][] = [
    [
      "Nastavení",
      `Kulaté tlačítko se šipkou. Rozbalí vše, co se týká této osoby: „Kde začít?“, „Psaní jednou rukou“, „V klidu“, „Větší mezery (CVI)“, týdenní cíl a podrobné vyhodnocení.`,
    ],
    ["Úroveň obtížnosti", "Od 1 do 50 - jak těžká smějí být cvičení právě teď. Není to známka."],
    ["Čas procvičování", "Čistý čas psaní ve zvoleném období. Přestávky se nepočítají."],
    [
      "Týdenní cíl",
      "Odcvičené minuty z požadovaných minut tohoto týdne. Zobrazuje se jen tehdy, když je cíl nastaven.",
    ],
    ["Přesnost", "Podíl správně trefených znaků."],
    [
      "úhozů/min",
      `Rychlost. Při volbě „V klidu“ se číslo zobrazuje, ale v programu se nikde nepočítá.`,
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Období: </dt>
        <dd className="m-0 inline">
          Nad tabulkou zvolíte, k čemu se všechna čísla vztahují - jeden týden,
          měsíc (poslední 4 týdny, ne kalendářní měsíc), školní rok nebo vše od
          začátku; mezi týdny, měsíci a školními roky přecházíte šipkami po obou
          stranách. Vyhodnocení za šipkou to neovlivňuje; vždy ukazuje celý rok.
        </dd>
      </div>
    </dl>
  );
}

// ★ O2-COMP (30.10.2026): bg eigene Fassung.
// ★ O-BG: aus der Funktion neu geschrieben, nicht übersetzt; dieselben Zahlen aus denselben
// Konstanten wie cs. Nur Lehrkräfte sehen das ⇒ Вие-Form (Imperativ auf -ете, „вие" klein),
// kein Ausrufezeichen, kein Semikolon (Glossar bg Regel 1). Kind = „ученик" (Rolle) bzw.
// „детето" (n.), Mehrzahl „ученици"/„деца" (Regel 2) - keine Vergangenheit/kein Adjektiv am Kind.
// Prozent ohne Leerzeichen („94%", Regel 5), Dezimalkomma („1,4 пъти"). Kein Satz endet mit
// Zahl und Punkt. Spaltennamen wie in LehrerHilfe.bg: „Ниво на трудност", „Време за упражнения",
// „Седмична цел", „Точност", „знаци/мин", „Спокойно", „Текстове за възраст", „Откъде да започнете?".
// ⚠️ PRUEFUNG_WORT_BG gibt es in der Datei noch nicht - der Chef legt es an (wie PRUEFUNG_WORT_CS):
const PRUEFUNG_WORT_BG = "Предизвикателство";

function LeistungsstufeHilfeBg() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        <strong>Нивото на трудност</strong> е число от <strong>1 до 50</strong>.
        То казва <strong>колко трудни могат да бъдат упражненията за този ученик
        в момента</strong> - и нищо друго. Програмата го определя сама - не е
        нужно да правите нищо.
      </Absatz>
      <Absatz>
        Зад всяко ниво стои <strong>цел за скорост</strong>: ниво 2 изисква 22
        знака в минута, ниво 50 изисква 420 (това отговаря на скоростта на
        професионално писане). Между тях целите растат на равномерни стъпки -
        малки отдолу, за да има и за учениците, които пишат много бавно,
        достижимо следващо ниво, и големи отгоре, за да не стигат опитните
        ученици до таван. <strong>Ниво 1 е особено:</strong> там скоростта
        изобщо не се брои, а само точността.
      </Absatz>
      <Absatz>
        <strong>Как се променя:</strong> програмата гледа най-много петте
        последни кръга на текущото ниво - и то едва от третия кръг на това ниво
        (иначе числото би скачало напред-назад). Ако повечето от тях са точни{" "}
        <em>и</em> достигат целта за скорост, нивото се вдига, при голяма
        преднина - и с няколко нива наведнъж. Ако повечето са твърде неточни
        или явно твърде бавни, то пада с едно. Само при трайно много ниска
        точност <em>и</em> много бавно писане нивото се връща на 1 - там, където
        скоростта вече не се брои.
      </Absatz>
      <Absatz>
        <strong>При „Спокойно“</strong> (настройка за всеки ученик поотделно)
        скоростта не се брои на <em>нито едно</em> ниво. Тогава нивото се
        вдига и пада само според точността.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Нивото на трудност не е оценка и не е резултат.</strong>{" "}
        Ученик на ниво 8, който всяка седмица се вдига с две нива, напредва
        по-добре от ученик, който стои на ниво 30 още от октомври. За какво
        служи нивото: за да се види дали упражненията пасват в момента. Какво е
        предназначено за оценяване, описва следващият раздел.
      </Absatz>
      <Absatz>
        ⚠️ Не го бъркайте с настройката <strong>„Текстове за възраст“</strong> -
        тя определя само колко пораснало звучат текстовете за упражнение (7-10
        г., 11-15 г., над 16 г.) и няма нищо общо с постиженията.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeBg() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        Програмата <strong>не пише оценки</strong>. Тя дава{" "}
        <strong>четири стойности</strong> - каква оценка ще получите от тях,
        решавате вие. Първите три са на картата над таблицата, за целия клас и
        за всеки ученик зад стрелката, а четвъртата - в колоната „
        {PRUEFUNG_WORT_BG}“.
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Скорост (знака в минута)</p>
        <Absatz>
          Броят на всички написани знаци, умножен по 60 и разделен на чистото
          време за писане в секунди. Брои се само времето над текста - пауза,
          докато програмата е отворена, не се брои.
        </Absatz>
        <Absatz>
          До нея стои промяната - в <strong>знаци</strong>, не в проценти:
          „4 знака повече“ означава от 211 на 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Точност</p>
        <Absatz>
          <strong>(Знаци минус грешки) ÷ знаци</strong>, в проценти. Поправената
          грешка остава грешка - брои се натиснатият клавиш, а не резултатът на
          екрана.
        </Absatz>
        <Absatz>
          Тук промяната е дадена в <strong>процентни пунктове</strong> (от 94% на
          96% са „2 процентни пункта повече“).
        </Absatz>
        <Absatz>
          ★ Това е по-показателната от двете стойности: при точно писане скоростта
          расте от само себе си - обратното почти никога не се случва.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Седмични цели</p>
        <Absatz>
          За всеки ученик задавате <strong>минути на седмица</strong> - нищо
          повече. Показва се делът на действително упражняваните минути от
          зададените, например „87%“, а до него - колко минути от зададените са
          упражнени и в колко седмици целта е изпълнена изцяло. Изчислява се{" "}
          <strong>минута по минута</strong>, а не седмица по седмица: ученик, който
          всяка седмица изпълнява поне част, ясно се различава от някой, който не
          прави нищо.
        </Absatz>
        <Absatz>
          <strong>Наваксай минутите от минали седмици</strong> (отметка за
          учителя): упражненията над това, което изисква седмицата, попълват
          най-старата още отворена седмица - никога над собствената ѝ цел.
        </Absatz>
        <Absatz>
          Ако <strong>няма зададена седмична цел</strong>, тази стойност отпада -
          а с нея и колоната „Седмична цел“ в таблицата. Така никъде не стои нула,
          която да изглежда като пропуск.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT_BG} (резултат от предизвикателството)</p>
        <Absatz>
          {PRUEFUNG_WORT_BG} е общо писане за целия клас: един и същ текст, едно и
          също време. Неговият резултат е{" "}
          <strong>резултатът от предизвикателството от 0 до 100</strong>. Той
          събира точността и скоростта в едно число:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Качество</strong> = знаци ÷ (знаци + {FEHLER_GEWICHT} × погрешни
            клавиши) - един погрешен клавиш се брои колкото {FEHLER_GEWICHT} знака.
          </li>
          <li>
            <strong>Дял на скоростта</strong> = корен квадратен от (знака в минута
            ÷ {BEZUGSTEMPO}) - най-голямата стойност е 1.
          </li>
          <li>
            <strong>Резултат от предизвикателството</strong> = 100 × качество × дял
            на скоростта.
          </li>
        </ul>
        <Absatz>
          Тази стойност {FEHLER_GEWICHT} е теглото за <strong>„Строго“</strong>{" "}
          (по подразбиране): брои се всеки погрешен клавиш, дори веднага поправен -
          по пътя той е струвал време. При <strong>„Свободно писане“</strong>{" "}
          теглото е <strong>{FEHLER_GEWICHT_FREI}</strong>: оценява се само това,
          което в края остава грешно (във всяка дума най-много една грешка,
          поправените места не се броят), а оставената грешка не е струвала
          отделно време за писане - затова тежи повече.
        </Absatz>
        <Absatz>
          Коренът гарантира, че <strong>точността се брои повече от
          времето</strong>: двойната скорост не се брои двойно, а само 1,4 пъти.
          Най-малкият брой написани знаци за резултат е {MIND_ZEICHEN_WERTUNG} -
          при по-малко знаци резултат от предизвикателството няма.
        </Absatz>
        <Absatz>
          Резултатът стои в таблицата с резултати на всеки кръг, като средна
          стойност в колоната „{PRUEFUNG_WORT_BG}“ в статистиката на класа („3 / 82“:
          три написани предизвикателства, среден резултат 82) и при ученика в
          „Моят напредък“. Понеже всички ученици в един кръг пишат един и същ текст
          за едно и също време, стойностите им могат да се сравняват помежду си.
        </Absatz>
      </div>

      <Absatz>
        <strong>С какво се сравнява,</strong> превключвате над стойността: с{" "}
        <strong>предходната седмица</strong> (по подразбиране) или с{" "}
        <strong>началото на учебната година на класа</strong>. Началото на
        учебната година не е 15 септември, а първата седмица, в която са се
        упражнявали <strong>поне половината</strong> от класа - за да не определят
        няколко упражнения през ваканцията началото за всички. Който се присъедини
        по-късно, се сравнява от собствената си първа седмица.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Какво не знаят тези стойности</p>
        <Absatz>
          Те измерват какво се е случило на устройството. Не знаят нищо за
          изходното положение на детето, за наранена ръка, за седмица болест или за
          смяна на помощното средство. Стойност, която е намаляла, е{" "}
          <em>повод да попитате</em> - а не твърдение за положените усилия.
        </Absatz>
        <Absatz>
          Колко упражнения изобщо стоят зад стойностите, виждате в колоната{" "}
          <strong>Време за упражнения</strong> и зад стрелката („Упражнения“,
          „Активни дни“, „Време за упражнения“).
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeBg() {
  const zeilen: [string, string][] = [
    [
      "Настройки",
      "Кръглият бутон със стрелка. Разгъва всичко за този ученик: „Откъде да започнете?“, „Писане с една ръка“, „Спокойно“, „По-голямо разстояние между знаците (CVI)“, седмичната цел и подробните резултати.",
    ],
    ["Ниво на трудност", "От 1 до 50 - колко трудни могат да бъдат упражненията в момента. Не е оценка."],
    ["Време за упражнения", "Чистото време за писане в избрания период. Паузите не се броят."],
    [
      "Седмична цел",
      "Упражнените минути от зададените за тази седмица. Появява се само ако има зададена цел.",
    ],
    ["Точност", "Делът на правилно натиснатите знаци."],
    [
      "знаци/мин",
      "Скорост. При „Спокойно“ числото се показва, но в програмата не се брои никъде.",
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Периодът: </dt>
        <dd className="m-0 inline">
          Над таблицата избирате за какво се отнасят всички числа - една седмица,
          месец (последните 4 седмици, не календарният месец), учебната година или
          всичко от началото. Между седмиците, месеците и учебните години минавате
          със стрелките от двете страни. Резултатите зад стрелката не се влияят от
          това - те винаги показват цялата година.
        </dd>
      </div>
    </dl>
  );
}

// ★ O2-COMP (30.10.2026): el eigene Fassung.
// ★ O2-COMP el: aus der Funktion neu geschrieben, nicht übersetzt; dieselben Zahlen aus
// denselben Konstanten wie cs. Nur Lehrkräfte sehen das - darum εσείς (Glossar Regel 1),
// keine Ausrufezeichen, das Kind ist „το παιδί", die Gruppe „τα παιδιά" (Regel 2).
// Prozent ohne Leerzeichen („94%", Regel 5), Dezimalkomma („1,4 φορές"). Fachwörter:
// επίπεδο δυσκολίας, ακρίβεια, ταχύτητα, πατήματα ανά λεπτό (Spalte πατήματα/λεπτό),
// σκορ Πρόκλησης, ποιότητα, μερίδιο ταχύτητας, εβδομαδιαίος στόχος, χρόνος εξάσκησης,
// «Με την ησυχία σου», «Κείμενα για ηλικίες», «Από πού να ξεκινήσετε;», «Η πρόοδός μου»,
// «Αναπλήρωση λεπτών από προηγούμενες εβδομάδες», Arten «Αυστηρά» / «Ελεύθερη γραφή».
// Das Wort der Tippchallenge steht ausgeschrieben („Πρόκληση", wie LehrerHilfe.el).

function LeistungsstufeHilfeEl() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        Το <strong>επίπεδο δυσκολίας</strong> είναι ένας αριθμός από το{" "}
        <strong>1 ως το 50</strong>. Λέει <strong>πόσο δύσκολες μπορούν να είναι
        οι ασκήσεις για αυτό το παιδί αυτή τη στιγμή</strong> - και τίποτα άλλο.
        Το πρόγραμμα το ορίζει μόνο του. Δεν χρειάζεται να κάνετε τίποτα.
      </Absatz>
      <Absatz>
        Πίσω από κάθε επίπεδο υπάρχει ένας <strong>στόχος ταχύτητας</strong>: το
        επίπεδο 2 ζητά 22 πατήματα ανά λεπτό, το επίπεδο 50 ζητά 420 (περίπου η
        ταχύτητα επαγγελματικής δακτυλογράφησης). Ανάμεσα, οι στόχοι μεγαλώνουν
        με ομοιόμορφα βήματα - μικρά στη βάση, ώστε και τα παιδιά που γράφουν
        πολύ αργά να έχουν ένα επόμενο επίπεδο κοντά τους, και μεγάλα στην
        κορυφή, ώστε τα παιδιά με εμπειρία να μη φτάνουν σε ταβάνι.{" "}
        <strong>Το επίπεδο 1 είναι ιδιαίτερο:</strong> εκεί η ταχύτητα δεν
        μετράει καθόλου, μόνο η ακρίβεια.
      </Absatz>
      <Absatz>
        <strong>Πώς αλλάζει:</strong> το πρόγραμμα κοιτάζει ως και τους πέντε
        τελευταίους γύρους στο τρέχον επίπεδο - και μόνο από τον τρίτο γύρο σε
        αυτό το επίπεδο και μετά (αλλιώς ο αριθμός θα πηδούσε πέρα δώθε). Αν οι
        περισσότεροι είναι ακριβείς <em>και</em> φτάνουν τον στόχο ταχύτητας, το
        επίπεδο ανεβαίνει. Με μεγάλο προβάδισμα, ανεβαίνει και πολλά επίπεδα
        μαζί. Αν οι περισσότεροι έχουν πολύ χαμηλή ακρίβεια ή είναι καθαρά πολύ
        αργοί, κατεβαίνει κατά ένα. Μόνο με σταθερά πολύ χαμηλή ακρίβεια{" "}
        <em>και</em> πολύ αργή γραφή γυρίζει στο επίπεδο 1 - εκεί όπου η
        ταχύτητα δεν μετράει πια.
      </Absatz>
      <Absatz>
        <strong>Με το «Με την ησυχία σου»</strong> (ρύθμιση για κάθε παιδί
        χωριστά) η ταχύτητα δεν μετράει σε <em>κανένα</em> επίπεδο. Το επίπεδο
        τότε ανεβαίνει και κατεβαίνει μόνο με την ακρίβεια.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Το επίπεδο δυσκολίας δεν είναι βαθμός ούτε σκορ.</strong>{" "}
        Ένα παιδί στο επίπεδο 8 που ανεβαίνει δύο επίπεδα κάθε εβδομάδα
        προχωρά καλύτερα από ένα παιδί που μένει στο επίπεδο 30 από τον
        Οκτώβριο. Σε τι χρησιμεύει το επίπεδο: για να δείτε αν οι ασκήσεις
        ταιριάζουν αυτή τη στιγμή. Τι προορίζεται για αξιολόγηση, το περιγράφει
        η επόμενη ενότητα.
      </Absatz>
      <Absatz>
        ⚠️ Μην το μπερδεύετε με τα <strong>«Κείμενα για ηλικίες»</strong> - αυτά
        ορίζουν μόνο πόσο ώριμα ακούγονται τα κείμενα εξάσκησης (7-10 ετών,
        11-15 ετών, από 16 ετών) και δεν έχουν καμία σχέση με την επίδοση.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeEl() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        Το πρόγραμμα <strong>δεν βάζει βαθμούς</strong>. Δίνει{" "}
        <strong>τέσσερις τιμές</strong> - τι βαθμός θα προκύψει από αυτές, το
        αποφασίζετε εσείς. Οι τρεις πρώτες βρίσκονται στην κάρτα πάνω από τον
        πίνακα, για όλο το τμήμα και για κάθε παιδί πίσω από το βέλος. Η τέταρτη
        βρίσκεται στη στήλη «Πρόκληση».
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 - Ταχύτητα (πατήματα ανά λεπτό)</p>
        <Absatz>
          Όλοι οι χαρακτήρες που γράφτηκαν, διαιρεμένοι με τον καθαρό χρόνο
          γραφής, επί 60. Μετράει μόνο ο χρόνος πάνω στο κείμενο - μια παύση
          όσο το πρόγραμμα είναι ανοιχτό δεν μετράει.
        </Absatz>
        <Absatz>
          Δίπλα φαίνεται η αλλαγή, σε <strong>πατήματα</strong>, όχι σε
          ποσοστό: «αύξηση κατά 4 πατήματα» σημαίνει από 211 σε 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 - Ακρίβεια</p>
        <Absatz>
          <strong>(Χαρακτήρες μείον λάθη) ÷ χαρακτήρες</strong>, σε ποσοστό. Ένα
          λάθος που διορθώθηκε μένει λάθος - μετράει το πάτημα, όχι το
          αποτέλεσμα στην οθόνη.
        </Absatz>
        <Absatz>
          Εδώ η αλλαγή δίνεται σε <strong>ποσοστιαίες μονάδες</strong> (από 94%
          σε 96% είναι «αύξηση κατά 2 ποσοστιαίες μονάδες»).
        </Absatz>
        <Absatz>
          ★ Αυτή είναι η πιο αποκαλυπτική από τις δύο τιμές: όποιο παιδί γράφει
          με ακρίβεια, γίνεται πιο γρήγορο από μόνο του - το αντίστροφο σχεδόν
          ποτέ δεν συμβαίνει.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 - Εβδομαδιαίοι στόχοι</p>
        <Absatz>
          Για κάθε παιδί ορίζετε <strong>λεπτά την εβδομάδα</strong> - τίποτα
          άλλο. Φαίνεται το ποσοστό των λεπτών που ζητήθηκαν και έγιναν
          πραγματικά, για παράδειγμα «87%», μαζί με τη συμπλήρωση «62 από 71
          λεπτά - πλήρης στόχος: 2 από 3 εβδομάδες». Υπολογίζεται{" "}
          <strong>λεπτό προς λεπτό</strong>, όχι εβδομάδα προς εβδομάδα: ένα
          παιδί που κάνει κάθε εβδομάδα ένα μέρος ξεχωρίζει καθαρά από ένα παιδί
          που δεν κάνει τίποτα.
        </Absatz>
        <Absatz>
          <strong>Αναπλήρωση λεπτών από προηγούμενες εβδομάδες</strong> (επιλογή
          για εκπαιδευτικούς): ό,τι γίνεται πάνω από όσα ζητά μια εβδομάδα,
          συμπληρώνει την παλαιότερη εβδομάδα που είναι ακόμα ανοιχτή - ποτέ πάνω
          από τον δικό της στόχο.
        </Absatz>
        <Absatz>
          Αν <strong>δεν έχει οριστεί εβδομαδιαίος στόχος</strong>, αυτή η τιμή
          παραλείπεται - και μαζί της η στήλη «Εβδομαδιαίος στόχος» στον πίνακα.
          Έτσι δεν υπάρχει πουθενά ένα μηδέν που μοιάζει με παράλειψη.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 - Πρόκληση (σκορ Πρόκλησης)</p>
        <Absatz>
          Μια Πρόκληση είναι μια δοκιμή για όλο το τμήμα: το ίδιο κείμενο, ο
          ίδιος χρόνος. Το αποτέλεσμά της είναι το{" "}
          <strong>σκορ Πρόκλησης από 0 ως 100</strong>. Ενώνει την ακρίβεια και
          την ταχύτητα σε έναν αριθμό:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Ποιότητα</strong> = χαρακτήρες ÷ (χαρακτήρες + k × λάθη) -
            ένα λάθος μετράει όσο k χαρακτήρες.
          </li>
          <li>
            <strong>Μερίδιο ταχύτητας</strong> = τετραγωνική ρίζα του (πατήματα
            ανά λεπτό ÷ {BEZUGSTEMPO}). Η τιμή 1 είναι το ανώτατο όριο.
          </li>
          <li>
            <strong>Σκορ Πρόκλησης</strong> = 100 × ποιότητα × μερίδιο ταχύτητας.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> στο είδος «Αυστηρά»
          (προεπιλογή): μετράει κάθε λάθος πλήκτρο, ακόμα και αν διορθώθηκε
          αμέσως - στον δρόμο κόστισε χρόνο.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> στο είδος «Ελεύθερη γραφή»:
          βαθμολογείται μόνο ό,τι μένει λάθος στο τέλος (σε κάθε λέξη το πολύ
          ένα λάθος, τα σημεία που διορθώθηκαν δεν μετράνε) - ένα λάθος που
          έμεινε δεν κόστισε δικό του χρόνο γραφής, και έτσι βαραίνει
          περισσότερο.
        </Absatz>
        <Absatz>
          Η τετραγωνική ρίζα φροντίζει ώστε <strong>η ακρίβεια να μετράει
          περισσότερο από τον χρόνο</strong>: η διπλή ταχύτητα δεν μετράει
          διπλά, μόνο 1,4 φορές. Το σκορ Πρόκλησης χρειάζεται τουλάχιστον{" "}
          {MIND_ZEICHEN_WERTUNG} χαρακτήρες - με λιγότερους δεν δίνεται σκορ.
        </Absatz>
        <Absatz>
          Το σκορ βρίσκεται στον πίνακα αποτελεσμάτων κάθε γύρου, ως μέσος όρος
          στη στήλη «Πρόκληση» των στατιστικών του τμήματος («3 / 82»: τρεις
          Προκλήσεις, μέσο σκορ 82) και για το παιδί στην «Η πρόοδός μου».
          Επειδή όλα τα παιδιά ενός γύρου γράφουν το ίδιο κείμενο στον ίδιο
          χρόνο, οι τιμές τους συγκρίνονται μεταξύ τους.
        </Absatz>
      </div>

      <Absatz>
        <strong>Με τι γίνεται η σύγκριση</strong> το αλλάζετε πάνω από την τιμή:
        με την <strong>προηγούμενη εβδομάδα</strong> (προεπιλογή) ή με την{" "}
        <strong>αρχή του σχολικού έτους του τμήματος</strong>. Η αρχή του
        σχολικού έτους δεν είναι η 1η Αυγούστου, αλλά η πρώτη εβδομάδα στην
        οποία έκανε εξάσκηση <strong>τουλάχιστον το μισό</strong> τμήμα - ώστε
        λίγα παιδιά που κάνουν εξάσκηση στις διακοπές να μην ορίζουν την αρχή για
        όλους. Όποιο παιδί έρχεται αργότερα, συγκρίνεται από τη δική του πρώτη
        εβδομάδα.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Τι δεν ξέρουν αυτές οι τιμές</p>
        <Absatz>
          Μετρούν ό,τι έγινε στη συσκευή. Δεν ξέρουν τίποτα για το από πού
          ξεκίνησε ένα παιδί, για ένα τραυματισμένο χέρι, για μια εβδομάδα
          αρρώστιας ή για μια αλλαγή υποστηρικτικής τεχνολογίας. Μια τιμή που
          έπεσε είναι <em>αφορμή για μια ερώτηση</em> - όχι κρίση για την
          προσπάθεια.
        </Absatz>
        <Absatz>
          Πόση εξάσκηση βρίσκεται πίσω από τις τιμές, το βλέπετε στη στήλη{" "}
          <strong>Χρόνος εξάσκησης</strong> και πίσω από το βέλος («Ασκήσεις»,
          «Ενεργές ημέρες», «Χρόνος εξάσκησης»).
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeEl() {
  const zeilen: [string, string][] = [
    [
      "Ρυθμίσεις",
      "Το στρογγυλό κουμπί με το βέλος. Ανοίγει όλα όσα αφορούν αυτό το παιδί: «Από πού να ξεκινήσετε;», «Γραφή με ένα χέρι», «Με την ησυχία σου», «Μεγαλύτερη απόσταση γραμμάτων (CVI)», τον εβδομαδιαίο στόχο και τα αναλυτικά αποτελέσματα.",
    ],
    ["Επίπεδο δυσκολίας", "Από 1 ως 50 - πόσο δύσκολες μπορούν να είναι οι ασκήσεις αυτή τη στιγμή. Δεν είναι βαθμός."],
    ["Χρόνος εξάσκησης", "Καθαρός χρόνος γραφής στην περίοδο που επιλέχθηκε. Οι παύσεις δεν μετράνε."],
    [
      "Εβδομαδιαίος στόχος",
      "Τα λεπτά που έγιναν από τα λεπτά που ορίστηκαν για αυτή την εβδομάδα. Εμφανίζεται μόνο αν έχει οριστεί στόχος.",
    ],
    ["Ακρίβεια", "Το ποσοστό των χαρακτήρων που γράφτηκαν σωστά."],
    [
      "πατήματα/λεπτό",
      "Ταχύτητα. Με το «Με την ησυχία σου» ο αριθμός φαίνεται, αλλά δεν μετράει πουθενά στο πρόγραμμα.",
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Η περίοδος: </dt>
        <dd className="m-0 inline">
          Πάνω από τον πίνακα επιλέγετε σε τι αναφέρονται όλοι οι αριθμοί - σε
          μία εβδομάδα, σε έναν μήνα (τις τελευταίες 4 εβδομάδες, όχι τον
          ημερολογιακό μήνα), στο σχολικό έτος ή σε όλο το διάστημα από την αρχή.
          Με τα βέλη στις δύο πλευρές πηγαίνετε μπρος και πίσω ανάμεσα σε
          εβδομάδες, μήνες και σχολικά έτη. Τα αποτελέσματα πίσω από το βέλος δεν
          επηρεάζονται - δείχνουν πάντα όλο το έτος.
        </dd>
      </div>
    </dl>
  );
}

// ★ O2-COMP (30.10.2026): hu eigene Fassung.
// Ohne diesen Zweig fiele die ungarische Bedienung hier auf DEUTSCH. Aus der Funktion neu
// geschrieben, nicht übersetzt; dieselben Zahlen aus denselben Konstanten. Wer sie sieht: nur
// Lehrkräfte - darum ohne Anrede, Hauptwort-Sätze und „-ható/-hető" (Glossar
// `recherche-ungarisch-2026-10-25/GLOSSAR-hu.md`, Regel 1), keine Ausrufezeichen. Das Kind heisst
// „tanuló". „Kihívás" steht ausgeschrieben (keine Konstante), weil es gebeugt wird (Kihíváshoz,
// Kihívások) - wie in LehrerHilfe.hu.tsx. Keine Endung an Konstanten-Zahlen (Regel 12), kein Satz
// endet mit Zahl und Punkt (§4 Falle 4). Prozent ohne Leerzeichen („94%", gemessen), Dezimalkomma
// („1,4-szeres"). Begriffe: nehézségi szint, pontosság, sebesség, leütés/perc, a Kihívás
// pontszáma, minőség, sebességarány, elütés, heti cél, gyakorlási idő, „Nyugodtan",
// „Szövegek életkora", „Honnan induljon?", „Fejlődésem", „Szigorú" / „Szabad gépelés".

function LeistungsstufeHilfeHu() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        A <strong>nehézségi szint</strong> egy szám <strong>1 és 50 között</strong>.
        Azt mutatja, <strong>milyen nehezek lehetnek most a gyakorlatok ennek a
        tanulónak</strong> - és semmi mást. A program magától állítja be; ehhez
        nem kell semmit tenni.
      </Absatz>
      <Absatz>
        Minden szint mögött egy <strong>sebességcél</strong> áll: a 2. szinten a
        cél 22 leütés percenként, az 50. szinten 420 leütés percenként (ez egy
        hivatásos gépíró sebessége). A kettő között a célok egyenletes lépésekben
        nőnek - alul kicsikben, hogy a nagyon lassan gépelő tanulók is elérhető
        közelségben lássák a következő szintet, felül nagyokban, hogy a
        gyakorlottak ne ütközzenek plafonba. <strong>Az 1. szint
        különleges:</strong> ott a sebesség egyáltalán nem számít, csak a
        pontosság.
      </Absatz>
      <Absatz>
        <strong>Hogyan változik:</strong> a program az aktuális szinten legfeljebb
        az utolsó öt kört nézi - és csak az ezen a szinten töltött harmadik körtől
        (különben a szám ide-oda ugrálna). Ha a körök többsége pontos{" "}
        <em>és</em> eléri a sebességcélt, a szint emelkedik; nagy előnynél
        egyszerre több szinttel is. Ha a többség túl pontatlan vagy egyértelműen
        túl lassú, eggyel csökken. Csak tartósan nagyon pontatlan <em>és</em>{" "}
        nagyon lassú gépelésnél tér vissza az 1. szintre - oda, ahol a sebesség
        már nem számít.
      </Absatz>
      <Absatz>
        <strong>A „Nyugodtan” beállítással</strong> (tanulónként állítható) a
        sebesség <em>egyik</em> szinten sem számít. A szint ilyenkor csak a
        pontosság alapján emelkedik és csökken.
      </Absatz>
      <Absatz>
        ⚠️ <strong>A nehézségi szint nem érdemjegy és nem pontszám.</strong>{" "}
        Az a tanuló, aki a 8. szinten áll, és hetente két szintet lép előre,
        jobban halad, mint az, aki október óta a 30. szinten áll. Mire való a
        szint: annak megítélésére, hogy a gyakorlatok éppen megfelelnek-e. Ami az
        értékelésre szolgál, azt a következő rész írja le.
      </Absatz>
      <Absatz>
        ⚠️ Nem tévesztendő össze a <strong>„Szövegek életkora”</strong>{" "}
        beállítással - az csak azt szabályozza, mennyire felnőttesen szólnak a
        gyakorló szövegek (7-10 éveseknek, 11-15 éveseknek, 16 éves kortól), és a
        teljesítményhez semmi köze.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeHu() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        A program <strong>nem ad érdemjegyet</strong>.{" "}
        <strong>Négy értéket</strong> ad - hogy ebből milyen érdemjegy lesz, az a
        tanár döntése. Az első három a táblázat fölötti kártyán áll, az egész
        osztályra és tanulónként a nyíl mögött; a negyedik a „Kihívás” oszlopban.
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Sebesség (leütés percenként)</p>
        <Absatz>
          Képlet: az összes begépelt karakter × 60 ÷ a tiszta gépelési idő
          másodpercben. Csak a szöveg mellett töltött idő számít - egy szünet,
          amíg a program nyitva van, nem.
        </Absatz>
        <Absatz>
          Mellette a változás áll, mégpedig <strong>leütésben</strong>, nem
          százalékban: a „javulás: 4 leütés” azt jelenti: 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Pontosság</p>
        <Absatz>
          <strong>(Karakterek mínusz hibák) ÷ karakterek</strong>, százalékban. A
          kijavított hiba is hiba marad - a leütés számít, nem az eredmény a
          képernyőn.
        </Absatz>
        <Absatz>
          Itt a változás <strong>százalékpontban</strong> áll (94%-ról 96%-ra:
          „javulás: 2 százalékpont”).
        </Absatz>
        <Absatz>
          ★ Ez a kettő közül a beszédesebb érték: aki pontosan gépel, magától
          gyorsul - fordítva ez szinte soha nem történik meg.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Heti célok</p>
        <Absatz>
          Tanulónként <strong>heti percszám</strong> állítható be - más nem. Az
          látszik, hogy a beállított percek mekkora része teljesült, például
          „87%”, ehhez a kiegészítés: „62/71 perc - maradéktalanul teljesült hetek:
          2/3”. A számítás <strong>percenként</strong> történik, nem hetenként: aki
          minden héten teljesít egy részt, egyértelműen különbözik attól, aki
          semmit sem.
        </Absatz>
        <Absatz>
          <strong>Elmaradt percek pótlása az előző hetekről</strong> (jelölőnégyzet
          a tanárnak): ami egy hét céljánál több gyakorlás, az a legrégebbi még
          nyitott hetet tölti fel - soha nem annak a hétnek a saját célján túl.
        </Absatz>
        <Absatz>
          Ha <strong>nincs heti cél beállítva</strong>, ez az érték elmarad - és
          vele a táblázat „Heti cél” oszlopa is. Így sehol sem áll nulla, amely
          mulasztásnak tűnhetne.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · Kihívás (a Kihívás pontszáma)</p>
        <Absatz>
          A Kihívás az egész osztály közös próbája: ugyanaz a szöveg, ugyanannyi
          idő. Eredménye <strong>a Kihívás pontszáma 0 és 100 között</strong>. A
          pontosságot és a sebességet egyetlen számban foglalja össze:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Minőség</strong> = karakterek ÷ (karakterek + k × elütések) -
            egy elütés annyit számít, mint k karakter.
          </li>
          <li>
            <strong>Sebességarány</strong> = négyzetgyök (leütés/perc ÷{" "}
            {BEZUGSTEMPO}); az értéke legfeljebb 1 lehet.
          </li>
          <li>
            <strong>A Kihívás pontszáma</strong> = 100 × minőség × sebességarány.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> a „Szigorú” típusnál
          (alapértelmezés): minden elütés számít, a rögtön javított is - útközben
          időbe került.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> a „Szabad gépelés” típusnál:
          csak az számít, ami a végén hibás marad (szavanként legfeljebb egy hiba,
          a javított helyek nem számítanak) - a bent hagyott hiba nem került külön
          gépelési időbe, ezért nagyobb a súlya.
        </Absatz>
        <Absatz>
          A négyzetgyök gondoskodik arról, hogy <strong>a pontosság többet
          számítson, mint az idő</strong>: a kétszeres sebesség nem számít
          kétszeresen, csak 1,4-szeresen. A Kihívás pontszámához szükséges
          legkevesebb begépelt karakter: {MIND_ZEICHEN_WERTUNG} - kevesebbnél nincs
          pontszám.
        </Absatz>
        <Absatz>
          Minden kör eredménytáblázatában megjelenik, átlagként az
          osztálystatisztika „Kihívás” oszlopában („3 / 82”: három megírt
          Kihívás, átlagos pontszám 82) és a tanulónál a „Fejlődésem” részben.
          Mivel egy kör minden tanulója ugyanazt a szöveget ugyanannyi idő alatt
          gépeli, az értékeik összevethetők.
        </Absatz>
      </div>

      <Absatz>
        <strong>Mihez képest</strong> történik az összevetés, az érték fölött
        váltható: az <strong>előző héthez</strong> (alapértelmezés) vagy{" "}
        <strong>az osztály tanévének kezdetéhez</strong>. A tanév kezdete itt nem
        a naptári kezdőnap, hanem az első olyan hét, amelyben az osztálynak{" "}
        <strong>legalább a fele</strong> gyakorolt - hogy néhány, a szünetben
        gyakorló tanuló ne határozza meg mindenki számára a kezdetet. Aki később
        csatlakozik, azt a saját első hetétől kezdve veti össze a program.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Amit ezek az értékek nem tudnak</p>
        <Absatz>
          Azt mérik, ami az eszközön történt. Semmit sem tudnak arról, honnan
          indult egy tanuló, egy sérült kézről, egy betegség miatt kimaradt hétről
          vagy a segédeszköz cseréjéről. Egy csökkent érték <em>ok a
          kérdezésre</em> - nem állítás az igyekezetről.
        </Absatz>
        <Absatz>
          Hogy egyáltalán mennyi gyakorlás áll a számok mögött, azt a{" "}
          <strong>Gyakorlási idő</strong> oszlop és a nyíl mögötti rész mutatja
          („Gyakorlatok”, „Aktív napok”, „Gyakorlási idő”).
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeHu() {
  const zeilen: [string, string][] = [
    [
      "Beállítások",
      "A kerek gomb a nyíllal. Mindent lenyit, ami ehhez a tanulóhoz tartozik: „Honnan induljon?”, „Gépelés egy kézzel”, „Nyugodtan”, „Nagyobb betűköz (CVI)”, a heti cél és a részletes eredmények.",
    ],
    ["Nehézségi szint", "1-től 50-ig - milyen nehezek lehetnek most a gyakorlatok. Nem érdemjegy."],
    ["Gyakorlási idő", "Tiszta gépelési idő a választott időszakban. A szünetek nem számítanak."],
    [
      "Heti cél",
      "A hétre beállított percekből a gyakorolt percek. Csak akkor jelenik meg, ha van beállított cél.",
    ],
    ["Pontosság", "A helyesen begépelt karakterek aránya."],
    [
      "leütés/perc",
      "Sebesség. A „Nyugodtan” beállításnál a szám látszik, de a programban sehol sem számít.",
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Az időszak: </dt>
        <dd className="m-0 inline">
          A táblázat fölött választható ki, mire vonatkozik az összes szám - egyetlen
          hét, egy hónap (az utolsó 4 hét, nem a naptári hónap), a tanév vagy a
          kezdettől eltelt teljes idő; a heteket, hónapokat és tanéveket a két
          oldalon lévő nyilakkal lehet lapozni. A nyíl mögötti eredményeket ez nem
          érinti; azok mindig az egész évet mutatják.
        </dd>
      </div>
    </dl>
  );
}

// ★ O2-COMP (30.10.2026): nl eigene Fassung.
// ★ O-NL: aus der Funktion neu geschrieben, gebaut wie die cs-Fassung; dieselben
// Zahlen aus denselben Konstanten. Nur Lehrkräfte sehen es - darum Imperativ bzw.
// „je" (Glossar `recherche-niederländisch-2026-10-25/GLOSSAR-nl.md`, Regel 1), kein
// Ausrufezeichen; das Kind heisst „leerling" (Regel 2), kein zijn/haar. Die
// Tippchallenge heisst „Uitdaging" (ausgeschrieben, solange `pruefungWort("nl")`
// den englischen Rückfall liefert). Prozent ohne Leerzeichen („94%", Regel 5),
// Dezimalkomma („1,4 keer"). „Note" nie nennen (§2.6) - „beoordeling".
// Spaltennamen wie in LehrerHilfe.nl: Instellingen, Moeilijkheidsniveau,
// Oefentijd, Weekdoel, Nauwkeurigheid, aanslagen/min, Uitdaging.

function LeistungsstufeHilfeNl() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        Het <strong>moeilijkheidsniveau</strong> is een getal van <strong>1 tot 50</strong>.
        Het zegt <strong>hoe moeilijk de oefeningen voor deze leerling op dit
        moment mogen zijn</strong> - en verder niets. De app stelt het zelf in;
        je hoeft er niets voor te doen.
      </Absatz>
      <Absatz>
        Achter elk niveau zit een <strong>snelheidsdoel</strong>: niveau 2 vraagt
        22 aanslagen per minuut, niveau 50 vraagt 420 (ongeveer de snelheid van
        iemand die beroepsmatig typt). Daartussen groeien de doelen in
        gelijkmatige stappen - onderaan klein, zodat ook leerlingen die heel
        langzaam typen een volgend niveau binnen bereik hebben, bovenaan groot,
        zodat ervaren leerlingen niet tegen een plafond aanlopen.{" "}
        <strong>Niveau 1 is bijzonder:</strong> daar telt snelheid helemaal niet,
        alleen nauwkeurigheid.
      </Absatz>
      <Absatz>
        <strong>Hoe het verandert:</strong> de app kijkt naar hoogstens de laatste
        vijf rondes op het huidige niveau - en pas vanaf de derde ronde op dat
        niveau (anders zou het getal heen en weer springen). Zijn de meeste
        daarvan nauwkeurig <em>en</em> halen ze het snelheidsdoel, dan gaat het
        niveau omhoog; bij een grote voorsprong meerdere niveaus tegelijk. Zijn
        de meeste te onnauwkeurig of duidelijk te langzaam, dan gaat het één
        niveau omlaag. Alleen bij langdurig heel lage nauwkeurigheid{" "}
        <em>en</em> heel langzaam typen gaat het terug naar niveau 1 - waar
        snelheid niet meer telt.
      </Absatz>
      <Absatz>
        <strong>Met "Snelheid telt niet"</strong> (een instelling per leerling)
        telt snelheid op <em>geen enkel</em> niveau. Het niveau gaat dan alleen
        door de nauwkeurigheid omhoog en omlaag.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Het moeilijkheidsniveau is geen beoordeling en geen score.</strong>{" "}
        Een leerling op niveau 8 die elke week twee niveaus stijgt, doet het
        beter dan een leerling die al sinds oktober op niveau 30 staat. Waarvoor
        het niveau dient: zien of de oefeningen op dit moment passen. Wat voor de
        beoordeling bedoeld is, staat in het volgende deel.
      </Absatz>
      <Absatz>
        ⚠️ Niet te verwarren met de instelling <strong>"Teksten voor"</strong> -
        die bepaalt alleen hoe volwassen de oefenteksten klinken (7-10 jaar,
        11-15 jaar, vanaf 16 jaar) en heeft niets met prestaties te maken.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeNl() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        De app <strong>geeft geen beoordeling</strong>. Ze levert{" "}
        <strong>vier waarden</strong> - wat daarvan een beoordeling wordt, beslis
        jij. De eerste drie staan op de kaart boven de tabel, voor de hele klas en
        per leerling achter de pijl; de vierde staat in de kolom "Uitdaging".
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Snelheid (aanslagen per minuut)</p>
        <Absatz>
          Alle getypte tekens, gedeeld door de zuivere typtijd, maal 60. Alleen
          de tijd bij de tekst telt - een pauze terwijl de app open is, telt niet.
        </Absatz>
        <Absatz>
          Ernaast staat de verandering, in <strong>aanslagen</strong>, niet in
          procenten: "gestegen met 4 aanslagen" betekent 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Nauwkeurigheid</p>
        <Absatz>
          <strong>(Tekens min fouten) ÷ tekens</strong>, in procenten. Een
          verbeterde fout blijft een fout - de aanslag telt, niet het resultaat
          op het scherm.
        </Absatz>
        <Absatz>
          Hier staat de verandering in <strong>procentpunten</strong> (van 94%
          naar 96% is "gestegen met 2 procentpunten").
        </Absatz>
        <Absatz>
          ★ Dit is de waarde die het meest zegt: wie nauwkeurig typt, wordt
          vanzelf sneller - andersom gebeurt dat bijna nooit.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Weekdoelen</p>
        <Absatz>
          Per leerling stel je <strong>minuten per week</strong> in - verder
          niets. Getoond wordt welk deel van de ingestelde minuten echt is
          geoefend, bijvoorbeeld "87%", met de toevoeging "62 van 71 minuten - in
          2 van 3 weken helemaal gehaald". Er wordt{" "}
          <strong>per minuut</strong> gerekend, niet per week: wie elke week een
          deel doet, onderscheidt zich duidelijk van wie niets doet.
        </Absatz>
        <Absatz>
          <strong>Gemiste minuten van vorige weken inhalen</strong> (een vinkje
          voor de leerkracht): wie meer oefent dan een week vraagt, vult daarmee
          de oudste week aan die nog open is - nooit boven het eigen doel van die
          week.
        </Absatz>
        <Absatz>
          Is er <strong>geen weekdoel ingesteld</strong>, dan vervalt deze waarde -
          en daarmee ook de kolom "Weekdoel" in de tabel. Zo staat er nergens een
          nul die eruitziet alsof er iets is gemist.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · Uitdaging (score van de Uitdaging)</p>
        <Absatz>
          Een Uitdaging is een gezamenlijke opdracht voor de hele klas: dezelfde
          tekst, dezelfde tijd. Het resultaat is de{" "}
          <strong>score van de Uitdaging, van 0 tot 100</strong>. Die zet
          nauwkeurigheid en snelheid samen in één getal:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Kwaliteit</strong> = tekens ÷ (tekens + k × verkeerde toetsen) -
            een verkeerde toets telt even zwaar als k tekens.
          </li>
          <li>
            <strong>Snelheidsaandeel</strong> = vierkantswortel uit (aanslagen per
            minuut ÷ {BEZUGSTEMPO}); de waarde 1 is het maximum.
          </li>
          <li>
            <strong>Score van de Uitdaging</strong> = 100 × kwaliteit × snelheidsaandeel.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> bij de soort "Streng" (standaard):
          elke verkeerde toets telt, ook een die meteen is verbeterd - die kostte
          onderweg tijd.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> bij "Vrij typen": alleen wat
          aan het eind nog fout is, telt (per woord hoogstens één fout, verbeterde
          plekken tellen niet) - een fout die blijft staan, heeft geen eigen
          typtijd gekost en weegt daarom zwaarder.
        </Absatz>
        <Absatz>
          De wortel zorgt ervoor dat <strong>nauwkeurigheid zwaarder telt dan
          tijd</strong>: dubbele snelheid telt niet dubbel, maar maar 1,4 keer.
          Voor een score van de Uitdaging zijn minstens{" "}
          {MIND_ZEICHEN_WERTUNG} getypte tekens nodig - bij minder tekens is er
          geen score.
        </Absatz>
        <Absatz>
          De score staat in de resultatentabel van elke ronde, als gemiddelde in
          de kolom "Uitdaging" van de klasstatistiek ("3 / 82": drie Uitdagingen
          gedaan, gemiddelde score 82) en bij de leerling in "Mijn voortgang".
          Omdat alle leerlingen van één ronde dezelfde tekst in dezelfde tijd
          typen, kun je hun waarden met elkaar vergelijken.
        </Absatz>
      </div>

      <Absatz>
        <strong>Waarmee vergeleken wordt,</strong> kies je boven de waarde: met de{" "}
        <strong>vorige week</strong> (standaard) of met het{" "}
        <strong>begin van het schooljaar van de klas</strong>. Het begin van het
        schooljaar is daarbij niet 1 augustus, maar de eerste week waarin{" "}
        <strong>minstens de helft</strong> van de klas heeft geoefend - zodat een
        paar leerlingen die in de vakantie oefenen niet voor iedereen het begin
        bepalen. Wie later bij de klas komt, wordt vanaf de eigen eerste week
        vergeleken.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Wat deze waarden niet weten</p>
        <Absatz>
          Ze meten wat er op het apparaat is gebeurd. Ze weten niets over het
          beginpunt van een leerling, over een geblesseerde hand, een week ziekte
          of een ander hulpmiddel. Een waarde die is gedaald, is een{" "}
          <em>reden om te vragen</em> - geen uitspraak over inzet.
        </Absatz>
        <Absatz>
          Hoeveel oefenen er eigenlijk achter de getallen zit, zie je in de kolom{" "}
          <strong>Oefentijd</strong> en achter de pijl ("Oefeningen", "Actieve
          dagen", "Geoefende tijd").
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeNl() {
  const zeilen: [string, string][] = [
    [
      "Instellingen",
      `De ronde knop met de pijl. Die klapt alles over deze leerling open: "Waar beginnen?", "Met één hand typen", "Snelheid telt niet", "Brede letterafstand (CVI)", het weekdoel en de uitgebreide resultaten.`,
    ],
    ["Moeilijkheidsniveau", "1 tot 50 - hoe moeilijk de oefeningen op dit moment mogen zijn. Geen beoordeling."],
    ["Oefentijd", "Zuivere typtijd in de gekozen periode. Pauzes tellen niet."],
    [
      "Weekdoel",
      "Geoefende minuten van de ingestelde minuten van deze week. Verschijnt alleen als er een doel is ingesteld.",
    ],
    ["Nauwkeurigheid", "Het aandeel goed getypte tekens."],
    [
      "aanslagen/min",
      `Snelheid. Met "Snelheid telt niet" wordt het getal getoond, maar het telt nergens in de app mee.`,
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">De periode: </dt>
        <dd className="m-0 inline">
          Boven de tabel kies je waarop alle getallen betrekking hebben - één
          week, een maand (de laatste 4 weken, niet de kalendermaand), het
          schooljaar of vanaf het begin; met de pijlen aan beide kanten ga je
          terug en vooruit door weken, maanden en schooljaren. De resultaten
          achter de pijl veranderen daardoor niet; die tonen altijd het hele jaar.
        </dd>
      </div>
    </dl>
  );
}

// ★ O2-COMP (30.10.2026): pt eigene Fassung.
// ★ O2-COMP pt (29.10.2026): aus der Funktion neu geschrieben, nicht übersetzt; dieselben Zahlen aus
// denselben Konstanten. Nur für docentes - Höflichkeitsform ohne „você" (Glossar pt Regel 1), kein
// Ausrufezeichen; das Kind heisst „a pessoa", alle zusammen „estudantes" (Regel 2). Gerade
// Anführungszeichen um Namen von Feldern und Spalten (Regel 7), Prozent ohne Leerzeichen (95%),
// Dezimalkomma („1,4 vezes"). Das Wort für die Tippchallenge steht wörtlich als „Desafio"
// (Glossar §2.3), damit keine neue Konstante nötig ist. Feldnamen wie in den pt-Tabellen:
// „Nível de dificuldade", „Tempo de prática", „Objetivo semanal", „Precisão", „Toques/min",
// „Com calma", „Por onde começar?", „Escrever com uma mão", „Espaçamento largo (CVI)",
// „Rigoroso" / „Escrita livre", „Os meus progressos", „Textos para".

function LeistungsstufeHilfePt() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        O <strong>nível de dificuldade</strong> é um número de <strong>1 a 50</strong>.
        Diz <strong>quão difíceis podem ser os exercícios para esta pessoa neste
        momento</strong> - e nada mais. O programa define-o sozinho; não é
        preciso fazer nada.
      </Absatz>
      <Absatz>
        Por trás de cada nível há uma <strong>meta de velocidade</strong>: o nível 2
        pede 22 toques por minuto, o nível 50 pede 420 (a velocidade de quem
        escreve profissionalmente). Entre eles, as metas crescem em passos
        regulares - pequenos em baixo, para que mesmo quem escreve muito devagar
        tenha um nível seguinte ao seu alcance, e grandes em cima, para que quem
        tem experiência não bata num teto. <strong>O nível 1 é
        especial:</strong> aí a velocidade não conta nada, só a precisão.
      </Absatz>
      <Absatz>
        <strong>Como muda:</strong> o programa olha para as últimas cinco rondas,
        no máximo, no nível atual - e só a partir da terceira ronda nesse nível
        (senão o número saltaria para cima e para baixo). Se a maioria for
        precisa <em>e</em> atingir a meta de velocidade, o nível sobe; com uma
        grande vantagem, vários níveis de uma vez. Se a maioria for pouco precisa
        ou claramente lenta demais, desce um. Só com uma precisão muito baixa{" "}
        <em>e</em> uma escrita muito lenta durante muito tempo volta ao nível 1 -
        onde a velocidade já não conta.
      </Absatz>
      <Absatz>
        <strong>Com "Com calma"</strong> (uma definição para cada pessoa), a
        velocidade não conta em <em>nenhum</em> nível. O nível sobe e desce
        então só pela precisão.
      </Absatz>
      <Absatz>
        ⚠️ <strong>O nível de dificuldade não é uma nota nem uma pontuação.</strong>{" "}
        Uma pessoa no nível 8 que sobe dois níveis todas as semanas está a
        evoluir melhor do que outra que está no nível 30 desde outubro. Para que
        serve o nível: para ver se os exercícios se ajustam neste momento. O que
        serve para avaliar está na secção seguinte.
      </Absatz>
      <Absatz>
        ⚠️ Não confundir com <strong>"Textos para"</strong> - essa definição só
        controla quão adultos soam os textos de prática (7-10 anos, 11-15 anos,
        a partir dos 16 anos) e não tem nada a ver com o desempenho.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfePt() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        O programa <strong>não dá notas</strong>. Fornece{" "}
        <strong>quatro valores</strong> - a nota que resulta deles é uma decisão
        sua. Os três primeiros estão no cartão por cima da tabela, para a turma
        inteira e, para cada pessoa, atrás da seta; o quarto está na coluna
        "Desafio".
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Velocidade (toques por minuto)</p>
        <Absatz>
          Todos os carateres escritos, a dividir pelo tempo puro de escrita, vezes
          60. Só conta o tempo passado no texto - uma pausa com o programa aberto
          não conta.
        </Absatz>
        <Absatz>
          Ao lado está a evolução, em <strong>toques</strong>, não em
          percentagem: "mais 4" quer dizer de 211 para 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Precisão</p>
        <Absatz>
          <strong>(Carateres menos erros) ÷ carateres</strong>, em percentagem. Um
          erro corrigido continua a ser um erro - conta o toque, não o resultado
          no ecrã.
        </Absatz>
        <Absatz>
          Aqui a evolução é dada em <strong>pontos percentuais</strong> (de 94%
          para 96% é "mais 2").
        </Absatz>
        <Absatz>
          ★ Este é o mais revelador dos dois valores: quem escreve com precisão
          fica mais rápido por si - o contrário quase nunca acontece.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Objetivos semanais</p>
        <Absatz>
          Para cada pessoa, define <strong>minutos por semana</strong> - não há
          mais nada para definir. Mostra-se a parte dos minutos definidos que foi
          de facto cumprida, por exemplo "87%", com o complemento "62 de 71
          minutos - cumprido por inteiro em 2 de 3 semanas". É calculado{" "}
          <strong>minuto a minuto</strong>, não semana a semana: quem cumpre uma
          parte todas as semanas distingue-se claramente de quem não faz nada.
        </Absatz>
        <Absatz>
          <strong>Recuperar os minutos das semanas anteriores</strong> (uma caixa
          de verificação para docentes): praticar mais do que uma semana pede
          completa a semana mais antiga ainda em aberto - nunca para além do
          objetivo dessa semana.
        </Absatz>
        <Absatz>
          Se <strong>não houver objetivo semanal definido</strong>, este valor não
          aparece - e com ele a coluna "Objetivo semanal" na tabela. Assim, nunca
          aparece um zero que pareça uma falha.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · Desafio (pontuação do Desafio)</p>
        <Absatz>
          Um Desafio é uma prova para a turma inteira: o mesmo texto, o mesmo
          tempo. O seu resultado é a{" "}
          <strong>pontuação do Desafio, de 0 a 100</strong>. Junta a precisão e
          a velocidade num só número:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Qualidade</strong> = carateres ÷ (carateres + {FEHLER_GEWICHT} ×
            teclas erradas) - uma tecla errada conta tanto como {FEHLER_GEWICHT} carateres.
          </li>
          <li>
            <strong>Fator de velocidade</strong> = raiz quadrada de (toques por minuto ÷{" "}
            {BEZUGSTEMPO}), no máximo 1.
          </li>
          <li>
            <strong>Pontuação do Desafio</strong> = 100 × qualidade × fator de velocidade.
          </li>
        </ul>
        <Absatz>
          Esse {FEHLER_GEWICHT} é o peso para <strong>"Rigoroso"</strong>{" "}
          (a predefinição): conta cada tecla errada, mesmo a corrigida logo a
          seguir - custou tempo pelo caminho. Para{" "}
          <strong>"Escrita livre"</strong>, o peso é{" "}
          <strong>{FEHLER_GEWICHT_FREI}</strong>: só se avalia o que ainda está
          errado no fim (no máximo um erro por palavra; os sítios corrigidos não
          contam), e um erro que ficou não custou tempo de escrita próprio - por
          isso pesa mais.
        </Absatz>
        <Absatz>
          A raiz quadrada garante que <strong>a precisão conta mais do que o
          tempo</strong>: o dobro da velocidade não conta a dobrar, só 1,4 vezes.
          Com menos de {MIND_ZEICHEN_WERTUNG} carateres escritos não há pontuação
          do Desafio.
        </Absatz>
        <Absatz>
          A pontuação aparece na tabela de resultados de cada ronda, como média
          na coluna "Desafio" das estatísticas da turma ("3 / 82": três Desafios
          feitos, pontuação média 82) e, para cada pessoa, em "Os meus
          progressos". Como todas as pessoas de uma ronda escrevem o mesmo texto
          no mesmo tempo, os seus valores podem ser comparados entre si.
        </Absatz>
      </div>

      <Absatz>
        <strong>Com o que se compara</strong> escolhe-se por cima do valor: com a{" "}
        <strong>semana anterior</strong> (a predefinição) ou com o{" "}
        <strong>início do ano letivo da turma</strong>. O início do ano letivo
        não é o dia 1 de setembro, mas a primeira semana em que{" "}
        <strong>pelo menos metade</strong> da turma praticou - para que algumas
        pessoas a praticar nas férias não definam o início para todas. Quem
        entra mais tarde é comparado a partir da sua primeira semana.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">O que estes valores não sabem</p>
        <Absatz>
          Medem o que aconteceu no dispositivo. Não sabem nada do ponto de partida
          de cada pessoa, de uma mão magoada, de uma semana de doença ou de uma
          mudança de produto de apoio. Um valor que desceu é um{" "}
          <em>motivo para perguntar</em> - não uma afirmação sobre o esforço.
        </Absatz>
        <Absatz>
          Quanta prática está por trás dos valores mostra-se na coluna{" "}
          <strong>Tempo de prática</strong> e atrás da seta ("Exercícios", "Dias
          ativos", "Tempo de prática").
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfePt() {
  const zeilen: [string, string][] = [
    [
      "Definições",
      "O botão redondo com a seta. Expande tudo o que diz respeito a esta pessoa: \"Por onde começar?\", \"Escrever com uma mão\", \"Com calma\", \"Espaçamento largo (CVI)\", o objetivo semanal e os resultados detalhados.",
    ],
    ["Nível de dificuldade", "De 1 a 50 - quão difíceis podem ser os exercícios neste momento. Não é uma nota."],
    ["Tempo de prática", "Tempo puro de escrita no período escolhido. As pausas não contam."],
    [
      "Objetivo semanal",
      "Minutos praticados dos minutos definidos para esta semana. Só aparece se houver um objetivo definido.",
    ],
    ["Precisão", "A parte dos carateres escritos corretamente."],
    [
      "Toques/min",
      "Velocidade. Com \"Com calma\", o número aparece, mas não conta em lado nenhum do programa.",
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">O período: </dt>
        <dd className="m-0 inline">
          Por cima da tabela escolhe-se a que se referem todos os valores - uma
          semana, um mês (as últimas 4 semanas, não o mês do calendário), o ano
          letivo ou desde o início; com as setas de cada lado passa-se de uma
          semana, mês ou ano letivo para o outro. Os resultados atrás da seta não
          mudam; mostram sempre o ano inteiro.
        </dd>
      </div>
    </dl>
  );
}

// ★ O2-COMP (30.10.2026): br eigene Fassung.
// ★ O-BR: aus der Funktion neu geschrieben, dieselben Zahlen aus denselben Konstanten.
// Lehrkraft-Sicht: „você", kein Ausrufezeichen; das Kind heisst „pessoa", alle
// zusammen „estudantes" (Glossar pt-BR Regel 1/2). Prozent ohne Leerzeichen („94%"),
// Dezimalkomma („1,4 vez"). Fachwörter: nível de dificuldade, precisão, velocidade,
// toques por minuto (Spalte toques/min), pontuação do desafio, qualidade, fator de
// velocidade, meta semanal, tempo de prática, Com calma, Textos para, Por onde começar?,
// Meu progresso, Rigoroso / Escrita livre (wie LehrerHilfe.br).
// ⚠️ Braucht in der Datei: const PRUEFUNG_WORT_BR = "Desafio";

const PRUEFUNG_WORT_BR = "Desafio";

function LeistungsstufeHilfeBr() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        O <strong>nível de dificuldade</strong> é um número de <strong>1 a 50</strong>.
        Ele diz <strong>o quanto os exercícios podem ser difíceis para esta pessoa
        neste momento</strong> - e nada mais. O aplicativo define o nível automaticamente;
        você não precisa fazer nada.
      </Absatz>
      <Absatz>
        Por trás de cada nível há uma <strong>meta de velocidade</strong>: o nível 2
        pede 22 toques por minuto, o nível 50 pede 420 (a velocidade de quem digita
        profissionalmente). Entre eles, as metas crescem em passos regulares -
        pequenos embaixo, para que também quem digita bem devagar tenha um próximo
        nível ao alcance, e grandes em cima, para que quem já tem experiência não
        bata no teto. <strong>O nível 1 é especial:</strong> nele a velocidade não
        conta, só a precisão.
      </Absatz>
      <Absatz>
        <strong>Como ele muda:</strong> o aplicativo olha até as cinco últimas
        rodadas no nível atual - e só a partir da terceira rodada nesse nível (senão
        o número ficaria pulando para cima e para baixo). Se a maioria delas for
        precisa <em>e</em> atingir a meta de velocidade, o nível sobe; com uma
        vantagem grande, sobe vários níveis de uma vez. Se a maioria for imprecisa
        demais ou claramente lenta demais, desce um. Só com uma precisão muito baixa{" "}
        <em>e</em> uma digitação muito lenta por bastante tempo ele volta ao nível 1
        - onde a velocidade não conta mais.
      </Absatz>
      <Absatz>
        <strong>Com a opção Com calma</strong> (uma configuração para cada pessoa), a
        velocidade não conta em <em>nenhum</em> nível. Aí o nível sobe e desce só
        pela precisão.
      </Absatz>
      <Absatz>
        ⚠️ <strong>O nível de dificuldade não é nota nem pontuação.</strong>{" "}
        Uma pessoa no nível 8 que sobe dois níveis por semana está indo melhor do
        que outra que está no nível 30 desde outubro. Para que o nível serve: para
        ver se os exercícios combinam com o momento. O que serve para avaliar está
        na próxima seção.
      </Absatz>
      <Absatz>
        ⚠️ Não confunda com <strong>Textos para</strong> - essa opção só define o
        quanto os textos de prática soam adultos (7-10 anos, 11-15 anos, a partir de
        16 anos) e não tem nada a ver com o desempenho.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeBr() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        O aplicativo <strong>não dá nota</strong>. Ele fornece{" "}
        <strong>quatro valores</strong> - a nota que sai deles é decisão sua. Os
        três primeiros estão no cartão acima da tabela, para a turma inteira e para
        cada pessoa atrás da seta; o quarto está na coluna {PRUEFUNG_WORT_BR}.
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Velocidade (toques por minuto)</p>
        <Absatz>
          Todos os caracteres digitados, divididos pelo tempo puro de digitação,
          vezes 60. Só conta o tempo no texto - uma pausa com o aplicativo aberto
          não conta.
        </Absatz>
        <Absatz>
          Ao lado aparece a mudança, em <strong>toques</strong>, não em
          porcentagem: subiu 4 significa 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Precisão</p>
        <Absatz>
          <strong>(Caracteres menos erros) ÷ caracteres</strong>, em porcentagem.
          Um erro corrigido continua sendo erro - o que conta é o toque, não o
          resultado na tela.
        </Absatz>
        <Absatz>
          Aqui a mudança aparece em <strong>pontos percentuais</strong> (de 94% para
          96% é subiu 2).
        </Absatz>
        <Absatz>
          ★ Este é o mais revelador dos dois valores: quem digita com precisão fica
          mais rápido por conta própria - o contrário quase nunca acontece.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Metas semanais</p>
        <Absatz>
          Para cada pessoa, você define os <strong>minutos por semana</strong> - não
          há mais nada a definir. O que aparece é a parte dos minutos definidos que
          foi realmente cumprida, por exemplo 87%, com o complemento 62 de 71
          minutos - cumprida por completo em 2 de 3 semanas. O cálculo é feito{" "}
          <strong>minuto a minuto</strong>, não semana a semana: quem faz uma parte
          toda semana se distingue claramente de quem não faz nada.
        </Absatz>
        <Absatz>
          <strong>Recuperar os minutos das semanas anteriores</strong> (uma caixa de
          seleção para docentes): praticar mais do que a semana pede completa a
          semana mais antiga ainda em aberto - nunca além da meta dessa semana.
        </Absatz>
        <Absatz>
          Se <strong>nenhuma meta semanal estiver definida</strong>, este valor não
          aparece - e com ele some a coluna Meta semanal da tabela. Assim nunca
          aparece um zero que pareça algo que ficou para trás.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT_BR} (pontuação do desafio)</p>
        <Absatz>
          O {PRUEFUNG_WORT_BR} é uma prova de digitação para a turma inteira: o
          mesmo texto, o mesmo tempo. O resultado é a{" "}
          <strong>pontuação do desafio, de 0 a 100</strong>. Ela junta a precisão e
          a velocidade em um só número:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Qualidade</strong> = caracteres ÷ (caracteres + {FEHLER_GEWICHT} ×
            teclas erradas) - uma tecla errada conta tanto quanto {FEHLER_GEWICHT} caracteres.
          </li>
          <li>
            <strong>Fator de velocidade</strong> = raiz quadrada de (toques por minuto ÷{" "}
            {BEZUGSTEMPO}); o valor máximo é 1.
          </li>
          <li>
            <strong>Pontuação do desafio</strong> = 100 × qualidade × fator de velocidade.
          </li>
        </ul>
        <Absatz>
          Esse {FEHLER_GEWICHT} é o peso para <strong>Rigoroso</strong> (o padrão):
          toda tecla errada conta, mesmo uma corrigida logo em seguida - ela custou
          tempo no caminho. Para <strong>Escrita livre</strong>, o peso é{" "}
          <strong>{FEHLER_GEWICHT_FREI}</strong>: só conta o que ainda está errado no
          fim (no máximo um erro por palavra; trechos corrigidos não contam), e um
          erro que ficou não custou tempo de digitação próprio - por isso pesa mais.
        </Absatz>
        <Absatz>
          A raiz quadrada garante que <strong>a precisão conta mais do que o
          tempo</strong>: o dobro da velocidade não conta o dobro, só 1,4 vez. Com
          menos de {MIND_ZEICHEN_WERTUNG} caracteres digitados, não há pontuação do
          desafio.
        </Absatz>
        <Absatz>
          Ela aparece na tabela de resultados de cada rodada, como média na coluna{" "}
          {PRUEFUNG_WORT_BR} das estatísticas da turma (3 / 82: três feitos,
          pontuação média 82) e para a pessoa em Meu progresso. Como todas as pessoas
          de uma rodada digitam o mesmo texto no mesmo tempo, os valores podem ser
          comparados entre si.
        </Absatz>
      </div>

      <Absatz>
        <strong>Com o que comparar</strong> você escolhe acima do valor: com a{" "}
        <strong>semana anterior</strong> (o padrão) ou com o{" "}
        <strong>início do ano letivo da turma</strong>. O início do ano letivo não é
        uma data fixa do calendário, mas a primeira semana em que pelo menos{" "}
        <strong>metade</strong> da turma praticou - para que algumas pessoas que
        praticam nas férias não definam o início para todo mundo. Quem entra depois
        é comparado a partir da sua própria primeira semana.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">O que estes valores não sabem</p>
        <Absatz>
          Eles medem o que aconteceu no dispositivo. Não sabem nada sobre o ponto de
          partida de uma pessoa, uma mão machucada, uma semana de doença ou uma
          troca de tecnologia assistiva. Um valor que caiu é um{" "}
          <em>motivo para perguntar</em> - não uma afirmação sobre o esforço.
        </Absatz>
        <Absatz>
          Quanta prática existe por trás dos valores aparece na coluna{" "}
          <strong>Tempo de prática</strong> e atrás da seta (Exercícios, Dias ativos,
          Tempo de prática).
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeBr() {
  const zeilen: [string, string][] = [
    [
      "Configurações",
      "O botão redondo com a seta. Ele expande tudo sobre esta pessoa: Por onde começar?, Digitar com uma mão, Com calma, Espaço maior entre letras (DVC), a meta semanal e os resultados detalhados.",
    ],
    ["Nível de dificuldade", "De 1 a 50 - o quanto os exercícios podem ser difíceis neste momento. Não é nota."],
    ["Tempo de prática", "Tempo puro de digitação no período escolhido. Pausas não contam."],
    [
      "Meta semanal",
      "Minutos praticados dos minutos definidos para esta semana. Só aparece se houver uma meta definida.",
    ],
    ["Precisão", "A parte dos caracteres digitados corretamente."],
    [
      "Toques/min",
      "Velocidade. Com a opção Com calma ligada, o número aparece, mas não conta em lugar nenhum do aplicativo.",
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">O período: </dt>
        <dd className="m-0 inline">
          Acima da tabela você escolhe a que todos os valores se referem - uma
          semana, um mês (as últimas 4 semanas, não o mês do calendário), o ano
          letivo ou desde o início; com as setas dos dois lados, você passa de uma
          semana, um mês ou um ano letivo para outro. Os resultados atrás da seta
          não mudam; eles sempre mostram o ano inteiro.
        </dd>
      </div>
    </dl>
  );
}

// ★ O2-COMP (30.10.2026): ro eigene Fassung.
// ★ O-RO (29.10.2026): scris din nou din funcție, nu tradus; aceleași numere din
// aceleași constante. O văd doar cadrele didactice (Ajutor din „Clasele mele” și
// `LehrerHilfe`) - de aceea peste tot forma de politețe (persoana a II-a plural,
// fără „dumneavoastră” unde verbul o spune deja), fără semne de exclamare (Glosar
// `recherche-rumänisch-2026-10-25/GLOSSAR-ro.md`, Regula 1). Copilul este „persoana”,
// toți împreună „elevii” (Regula 2), fără adjective la persoană. Nicio propoziție
// nu se termină cu număr și punct; „de” de la 20 în sus („420 de caractere”).
// Procent cu spațiu neseparabil („94&nbsp;%”), virgulă zecimală („de 1,4 ori”).
// Termeni (Glosar §2.2/§2.6/§2.12): nivel de dificultate, precizie, viteză,
// caractere pe minut (coloana car./min), scorul Provocării, calitate, ponderea
// vitezei, tastă greșită, obiectiv săptămânal, timp de exersare, „În ritmul tău”,
// „Texte pentru vârsta”, „De unde începeți?”, „Progresul meu”, „Recuperați minutele
// din săptămânile trecute”, felurile Provocării „Strict” / „Scriere liberă”.

function LeistungsstufeHilfeRo() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        <strong>Nivelul de dificultate</strong> este un număr de la <strong>1 la 50</strong>.
        Spune <strong>cât de grele pot fi exercițiile pentru această persoană în
        acest moment</strong> - și nimic altceva. Aplicația îl stabilește singură;
        nu trebuie să faceți nimic.
      </Absatz>
      <Absatz>
        În spatele fiecărui nivel stă o <strong>țintă de viteză</strong>: nivelul 2
        cere 22 de caractere pe minut, nivelul 50 cere 420 (cât scrie cineva care
        scrie profesionist). Între ele, țintele cresc în pași egali - mici jos,
        pentru ca și elevii care scriu foarte încet să aibă un nivel următor la
        îndemână, mari sus, pentru ca elevii exersați să nu se lovească de un
        plafon. <strong>Nivelul 1 este special:</strong> acolo viteza nu contează
        deloc, doar precizia.
      </Absatz>
      <Absatz>
        <strong>Cum se schimbă:</strong> aplicația se uită la cel mult ultimele cinci
        runde de pe nivelul actual - și abia de la a treia rundă pe acest nivel
        (altfel numărul ar sări încoace și încolo). Dacă cele mai multe sunt precise{" "}
        <em>și</em> ating ținta de viteză, nivelul crește; la un avans mare, chiar cu
        mai multe niveluri deodată. Dacă cele mai multe sunt prea imprecise sau
        clar prea lente, scade cu unul. Doar la o precizie foarte scăzută{" "}
        <em>și</em> o viteză foarte mică pe termen lung revine la nivelul 1 - acolo
        unde viteza nu mai contează.
      </Absatz>
      <Absatz>
        <strong>Cu „În ritmul tău”</strong> (o setare pentru fiecare persoană),
        viteza nu contează pe <em>niciun</em> nivel. Nivelul crește și scade atunci
        doar după precizie.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Nivelul de dificultate nu este o notă și nici un scor.</strong>{" "}
        O persoană de pe nivelul 8 care urcă în fiecare săptămână două niveluri
        lucrează mai bine decât una care stă pe nivelul 30 încă din octombrie. La
        ce folosește nivelul: să vedeți dacă exercițiile se potrivesc acum. Ce este
        gândit pentru evaluare descrie secțiunea următoare.
      </Absatz>
      <Absatz>
        ⚠️ A nu se confunda cu setarea <strong>„Texte pentru vârsta”</strong> - ea
        stabilește doar cât de matur sună textele de exersat (7-10 ani, 11-15 ani,
        de la 16 ani) și nu are nimic de-a face cu performanța.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeRo() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        Aplicația <strong>nu dă note</strong>. Oferă{" "}
        <strong>patru valori</strong> - ce notă faceți din ele hotărâți
        dumneavoastră. Primele trei sunt pe cardul de deasupra tabelului, pentru
        toată clasa și pentru fiecare persoană în spatele săgeții; a patra în
        coloana „Provocare”.
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Viteză (caractere pe minut)</p>
        <Absatz>
          Toate caracterele scrise, împărțite la timpul curat de scris în
          secunde, înmulțit cu 60. Se socotește doar timpul petrecut la text - o
          pauză în care aplicația e deschisă nu se socotește.
        </Absatz>
        <Absatz>
          Alături este schimbarea, în <strong>caractere</strong>, nu în procente:
          211 → 215 înseamnă „în creștere cu 4 apăsări”.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Precizie</p>
        <Absatz>
          <strong>(Caractere minus greșeli) ÷ caractere</strong>, în procente. O
          greșeală corectată rămâne greșeală - contează apăsarea, nu rezultatul de
          pe ecran.
        </Absatz>
        <Absatz>
          Aici schimbarea se dă în <strong>puncte procentuale</strong> (de la
          94&nbsp;% la 96&nbsp;% înseamnă o creștere cu 2 puncte procentuale).
        </Absatz>
        <Absatz>
          ★ Aceasta este cea mai grăitoare dintre cele două valori: cine scrie
          precis devine de la sine mai rapid - invers, aproape niciodată.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Obiective săptămânale</p>
        <Absatz>
          Pentru fiecare persoană stabiliți <strong>minute pe săptămână</strong> -
          nimic altceva. Se arată ce parte din minutele stabilite a fost exersată,
          de exemplu „87&nbsp;%”, iar alături câte minute din cele cerute au fost
          exersate și în câte săptămâni obiectivul a fost atins complet. Se
          calculează <strong>minut cu minut</strong>, nu săptămână cu săptămână:
          cine face în fiecare săptămână măcar o parte se deosebește clar de
          cineva care nu face nimic.
        </Absatz>
        <Absatz>
          <strong>Recuperați minutele din săptămânile trecute</strong> (o căsuță
          pentru cadrul didactic): ce se exersează peste cât cere o săptămână
          completează cea mai veche săptămână încă deschisă - niciodată peste
          obiectivul ei propriu.
        </Absatz>
        <Absatz>
          Dacă <strong>nu este stabilit un obiectiv săptămânal</strong>, această
          valoare lipsește - și odată cu ea coloana „Obiectiv săptămânal” din
          tabel. Astfel nu apare nicăieri un zero care să arate ca o neglijență.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · Provocare (scorul Provocării)</p>
        <Absatz>
          Provocarea este o probă de scris pentru toată clasa: același text,
          același timp. Rezultatul ei este <strong>scorul Provocării, de la 0 la
          100</strong>. Adună precizia și viteza într-un singur număr:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Calitate</strong> = caractere ÷ (caractere + k × taste greșite) -
            o tastă greșită contează cât k caractere.
          </li>
          <li>
            <strong>Ponderea vitezei</strong> = rădăcina pătrată din (caractere pe
            minut ÷ {BEZUGSTEMPO}); valoarea 1 este plafonul.
          </li>
          <li>
            <strong>Scorul Provocării</strong> = 100 × calitate × ponderea vitezei.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> la felul „Strict” (implicit): se
          socotește fiecare tastă greșită, chiar și una corectată imediat - pe drum
          a costat timp.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> la felul „Scriere liberă”: se
          evaluează doar ce rămâne greșit la sfârșit (cel mult o greșeală în fiecare
          cuvânt, locurile corectate nu se socotesc) - o greșeală lăsată în text nu a
          costat timp de scris în plus, de aceea cântărește mai mult.
        </Absatz>
        <Absatz>
          Rădăcina pătrată face ca <strong>precizia să conteze mai mult decât
          timpul</strong>: viteza dublă nu contează dublu, ci doar de 1,4 ori.
          Numărul minim de caractere scrise pentru un scor al Provocării este{" "}
          {MIND_ZEICHEN_WERTUNG} - sub această limită nu se dă niciun scor.
        </Absatz>
        <Absatz>
          Scorul apare în tabelul de rezultate al fiecărei runde, ca medie în
          coloana „Provocare” din statistica clasei („3 / 82”: trei Provocări
          scrise, scorul mediu 82) și la persoana respectivă în „Progresul meu”.
          Pentru că toți elevii unei runde scriu același text în același timp,
          valorile lor se pot compara între ele.
        </Absatz>
      </div>

      <Absatz>
        <strong>Cu ce se compară</strong> comutați deasupra valorii: cu{" "}
        <strong>săptămâna trecută</strong> (implicit) sau cu{" "}
        <strong>începutul anului școlar al clasei</strong>. Începutul anului școlar
        nu se socotește de la o dată fixă, ci de la prima săptămână în care a
        exersat <strong>cel puțin jumătate</strong> din clasă - ca exersarea câtorva
        elevi în vacanță să nu stabilească începutul pentru toți. Cine vine mai
        târziu este comparat de la propria primă săptămână.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Ce nu știu aceste valori</p>
        <Absatz>
          Ele măsoară ce s-a întâmplat pe dispozitiv. Nu știu nimic despre punctul
          de pornire al persoanei, despre o mână rănită, o săptămână de boală sau o
          schimbare a tehnologiei asistive. O valoare care a scăzut este un{" "}
          <em>motiv de a întreba</em> - nu o afirmație despre efort.
        </Absatz>
        <Absatz>
          Câtă exersare stă în spatele valorilor arată coloana{" "}
          <strong>Timp de exersare</strong> și ce este în spatele săgeții
          („Exerciții”, „Zile active”, „Timp exersat”).
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeRo() {
  const zeilen: [string, string][] = [
    [
      "Setări",
      "Butonul rotund cu săgeată. Deschide tot ce privește această persoană: „De unde începeți?”, „Scriere cu o mână”, „În ritmul tău”, „Spațiere mare între caractere (CVI)”, obiectivul săptămânal și rezultatele detaliate.",
    ],
    ["Nivel de dificultate", "De la 1 la 50 - cât de grele pot fi exercițiile acum. Nu este o notă."],
    ["Timp de exersare", "Timpul curat de scris în perioada aleasă. Pauzele nu se socotesc."],
    [
      "Obiectiv săptămânal",
      "Minutele exersate din minutele stabilite pentru această săptămână. Apare doar dacă este stabilit un obiectiv.",
    ],
    ["Precizie", "Partea de caractere scrise corect."],
    [
      "car./min",
      "Viteza. Cu „În ritmul tău”, numărul se afișează, dar nu contează nicăieri în aplicație.",
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Perioada: </dt>
        <dd className="m-0 inline">
          Deasupra tabelului alegeți la ce se referă toate numerele - o singură
          săptămână, o lună (ultimele patru săptămâni, nu luna calendaristică),
          anul școlar sau De la început; între săptămâni, luni și ani școlari
          treceți cu săgețile din ambele părți. Rezultatele din spatele săgeții nu
          sunt afectate; ele arată mereu tot anul.
        </dd>
      </div>
    </dl>
  );
}

// ★ O2-COMP (30.10.2026): sv eigene Fassung.
// ★ O2-COMP sv: Aus der Funktion neu geschrieben, nicht übersetzt; dieselben
// Konstanten wie cs/en. Nur für Lehrkräfte - Anrede du, sachlich, kein
// Ausrufezeichen (Glossar sv Regel 1). Tippchallenge = „Utmaningen" (gross),
// Fachwörter §2.2/§2.6/§2.12: svårighetsnivå, träffsäkerhet, hastighet,
// anslag per minut (Spalte Anslag/min), utmaningspoäng, kvalitet,
// hastighetsandel, veckomål, övningstid, „I lugn och ro", „Texter för ålder",
// „Var vill du börja?", „Mina framsteg", Arten „Strikt" / „Fri skrivning".
// Prozent mit geschütztem Leerzeichen, Dezimalkomma („1,4 gånger").

function LeistungsstufeHilfeSv() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        <strong>Svårighetsnivån</strong> är ett tal från <strong>1 till 50</strong>.
        Den anger <strong>hur svåra övningarna får vara för eleven just
        nu</strong> - och ingenting annat. Appen ställer in den själv; du
        behöver inte göra något.
      </Absatz>
      <Absatz>
        Bakom varje nivå finns ett <strong>hastighetsmål</strong>: nivå 2 kräver
        22 anslag per minut, nivå 50 kräver 420 (det motsvarar en
        yrkesskribents hastighet). Däremellan växer målen i jämna steg - små
        längst ned, så att även elever som skriver mycket långsamt har en
        nästa nivå inom räckhåll, och stora längst upp, så att vana elever
        inte slår i taket. <strong>Nivå 1 är speciell:</strong> där räknas
        hastigheten inte alls, bara träffsäkerheten.
      </Absatz>
      <Absatz>
        <strong>Så ändras den:</strong> appen tittar på högst de fem senaste
        omgångarna på den aktuella nivån - och först från den tredje omgången
        på nivån (annars skulle talet hoppa fram och tillbaka). Om de flesta
        av dem är träffsäkra <em>och</em> når hastighetsmålet, går nivån upp;
        med stor marginal flera nivåer på en gång. Om de flesta är för
        osäkra eller tydligt för långsamma, går den ned en nivå. Bara vid
        varaktigt mycket låg träffsäkerhet <em>och</em> mycket långsamt
        skrivande går den tillbaka till nivå 1 - där hastigheten inte längre
        räknas.
      </Absatz>
      <Absatz>
        <strong>Med I lugn och ro</strong> (en inställning för varje elev)
        räknas hastigheten inte på <em>någon</em> nivå. Nivån går då upp och
        ned enbart efter träffsäkerheten.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Svårighetsnivån är inget betyg och inga poäng.</strong>{" "}
        En elev på nivå 8 som går upp två nivåer varje vecka utvecklas bättre
        än en elev som har stått på nivå 30 sedan oktober. Vad nivån är till
        för: att se om övningarna passar just nu. Vad som är tänkt för
        bedömning beskriver nästa avsnitt.
      </Absatz>
      <Absatz>
        ⚠️ Blanda inte ihop den med inställningen <strong>Texter för
        ålder</strong> - den styr bara hur vuxet övningstexterna låter (7-10 år,
        11-15 år, från 16 år) och har ingenting med prestationen att göra.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeSv() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        Appen <strong>sätter inga betyg</strong>. Den ger{" "}
        <strong>fyra värden</strong> - vilket betyg som blir av dem bestämmer
        du. De tre första står på kortet ovanför tabellen, för hela klassen och
        för varje elev bakom pilen; det fjärde står i kolumnen Utmaningen.
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Hastighet (anslag per minut)</p>
        <Absatz>
          Alla skrivna tecken gånger 60, delat med den rena skrivtiden i
          sekunder. Bara tiden vid texten räknas - en paus medan appen är
          öppen räknas inte.
        </Absatz>
        <Absatz>
          Bredvid står förändringen, i <strong>anslag</strong>, inte i procent:
          ökat med 4 betyder 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Träffsäkerhet</p>
        <Absatz>
          <strong>(Tecken minus fel) ÷ tecken</strong>, i procent. Ett fel som
          har rättats är ändå ett fel - det är anslaget som räknas, inte
          resultatet på skärmen.
        </Absatz>
        <Absatz>
          Här anges förändringen i <strong>procentenheter</strong> (från
          94&nbsp;% till 96&nbsp;% är ökat med 2).
        </Absatz>
        <Absatz>
          ★ Det här är det mer talande av de två värdena: den som skriver
          säkert blir snabbare av sig själv - tvärtom händer det nästan aldrig.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Veckomål</p>
        <Absatz>
          För varje elev ställer du in <strong>minuter per vecka</strong> - inget
          annat. Det som visas är andelen av de inställda minuterna som
          verkligen har övats, till exempel 87&nbsp;%, och bredvid hur många
          minuter av de inställda som har övats och under hur många veckor
          målet har uppnåtts helt. Det räknas{" "}
          <strong>minut för minut</strong>, inte vecka för vecka: en elev som
          gör en del varje vecka skiljer sig tydligt från en elev som inte gör
          något alls.
        </Absatz>
        <Absatz>
          <strong>Ta igen minuter från tidigare veckor</strong> (en kryssruta
          för läraren): den som övar mer än veckan kräver fyller upp den
          äldsta vecka som fortfarande är öppen - aldrig mer än den veckans
          eget mål.
        </Absatz>
        <Absatz>
          Om <strong>inget veckomål är inställt</strong> faller det här värdet
          bort - och med det kolumnen Veckomål i tabellen. Därför står det
          aldrig en nolla någonstans som ser ut som något som har missats.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · Utmaningen (utmaningspoäng)</p>
        <Absatz>
          Utmaningen är ett gemensamt skrivande för hela klassen: samma text,
          samma tid. Resultatet är <strong>utmaningspoäng från 0 till 100</strong>.
          De sammanfattar träffsäkerhet och hastighet i ett enda tal:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Kvalitet</strong> = tecken ÷ (tecken + k × fel) - ett fel
            räknas som k tecken.
          </li>
          <li>
            <strong>Hastighetsandel</strong> = kvadratroten ur (anslag per minut
            ÷ {BEZUGSTEMPO}); värdet 1 är taket.
          </li>
          <li>
            <strong>Utmaningspoäng</strong> = 100 × kvalitet × hastighetsandel.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> för typen Strikt (standard):
          varje felslag räknas, även ett som rättas direkt - det kostade tid på
          vägen.{" "}
          <strong>k = {FEHLER_GEWICHT_FREI}</strong> för typen Fri skrivning:
          bara det som fortfarande är fel i slutet bedöms (högst ett fel per
          ord, rättade ställen räknas inte) - ett fel som står kvar har inte
          kostat någon egen skrivtid, och därför väger det tyngre.
        </Absatz>
        <Absatz>
          Kvadratroten gör att <strong>träffsäkerheten räknas mer än
          tiden</strong>: dubbel hastighet räknas inte dubbelt, utan bara
          1,4 gånger. Det minsta antalet skrivna tecken för utmaningspoäng är{" "}
          {MIND_ZEICHEN_WERTUNG} - med färre tecken anges inga utmaningspoäng.
        </Absatz>
        <Absatz>
          Poängen står i resultattabellen för varje omgång, som genomsnitt i
          kolumnen Utmaningen i klassens statistik (3 / 82 betyder: tre
          Utmaningar skrivna, genomsnitt 82 poäng) och för eleven under Mina
          framsteg. Eftersom alla elever i en omgång skriver samma text under
          samma tid, går deras värden att jämföra med varandra.
        </Absatz>
      </div>

      <Absatz>
        <strong>Vad som jämförs med</strong> växlar du ovanför värdet: med{" "}
        <strong>förra veckan</strong> (standard) eller med{" "}
        <strong>läsårets början för klassen</strong>. Läsårets början räknas
        då inte från den 1 augusti, utan från den första vecka då{" "}
        <strong>minst hälften</strong> av klassen övade - så att några elevers
        övning under lovet inte bestämmer början för alla. Den som kommer till
        senare jämförs från sin egen första vecka.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Vad de här värdena inte vet</p>
        <Absatz>
          De mäter vad som har hänt på enheten. De vet ingenting om elevens
          utgångsläge, om en skadad hand, en sjukvecka eller ett byte av
          hjälpmedel. Ett värde som har sjunkit är en <em>anledning att
          fråga</em> - inget påstående om ansträngning.
        </Absatz>
        <Absatz>
          Hur mycket övning som alls ligger bakom värdena ser du i kolumnen{" "}
          <strong>Övningstid</strong> och bakom pilen (Övningar, Aktiva dagar,
          Övningstid).
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeSv() {
  const zeilen: [string, string][] = [
    [
      "Inställningar",
      "Den runda knappen med pilen. Den fäller ut allt som gäller eleven: Var vill du börja?, Skriva med en hand, I lugn och ro, Större avstånd mellan tecknen (CVI), veckomålet och de utförliga resultaten.",
    ],
    ["Svårighetsnivå", "1 till 50 - hur svåra övningarna får vara just nu. Inget betyg."],
    ["Övningstid", "Ren skrivtid under den valda perioden. Pauser räknas inte."],
    [
      "Veckomål",
      "Övade minuter av de inställda minuterna för den här veckan. Visas bara om ett mål är inställt.",
    ],
    ["Träffsäkerhet", "Andelen tecken som skrevs rätt."],
    [
      "Anslag/min",
      "Hastighet. Med I lugn och ro visas talet, men det räknas ingenstans i appen.",
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Perioden: </dt>
        <dd className="m-0 inline">
          Ovanför tabellen väljer du vad alla värden gäller - en enskild vecka,
          en månad (de senaste 4 veckorna, inte kalendermånaden), läsåret eller
          från början; mellan veckor, månader och läsår går du fram och tillbaka
          med pilarna på båda sidor. Resultaten bakom pilen påverkas inte; de
          visar alltid hela året.
        </dd>
      </div>
    </dl>
  );
}

// ★ O2-COMP (30.10.2026): uk eigene Fassung.
// ★ O-UK: aus der Funktion neu geschrieben, nicht übersetzt; dieselben Zahlen aus denselben
// Konstanten. Nur Lehrkräfte sehen es - darum durchgehend ви-Form („задаєте", „Не плутайте"),
// kein Ausrufezeichen (Glossar uk Regel 1); das Kind heisst „дитина", alle zusammen „діти"/„учні"
// (Regel 2), keine Vergangenheit über eine Person. Prozent ohne Leerzeichen („94%", Regel 5),
// Dezimalkomma („1,4 раза"). Fachwörter §2.2/§2.6: рівень складності, точність, швидкість,
// знаків за хвилину (Spalte Знаків/хв), бали Виклику, якість, частка швидкості, тижнева мета,
// час тренування, «Швидкість не важлива», «Тексти для віку», «З чого почати?», «Мій поступ»,
// die Arten des Виклик «Суворий» / «Вільне письмо» (§2.12). Kein Satz endet mit Zahl und Punkt
// (§4 Falle 4); Zahlen aus Konstanten stehen nach „=" oder Doppelpunkt, nie gebeugt vor einem Nomen.

function LeistungsstufeHilfeUk() {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink">
      <Absatz>
        <strong>Рівень складності</strong> - це число від <strong>1 до 50</strong>.
        Воно показує, <strong>наскільки складними можуть бути вправи для цієї дитини
        зараз</strong>, - і нічого більше. Програма встановлює його сама; вам нічого
        не треба робити.
      </Absatz>
      <Absatz>
        За кожним рівнем стоїть <strong>ціль швидкості</strong>: рівень 2 вимагає
        22 знаки за хвилину, рівень 50 - 420 знаків за хвилину (це швидкість
        професійного друку). Між ними цілі зростають рівномірними кроками - унизу
        дрібними, щоб навіть діти, які друкують дуже повільно, мали наступний рівень
        у досяжності, а вгорі великими, щоб досвідчені діти не впиралися в стелю.{" "}
        <strong>Рівень 1 особливий:</strong> там швидкість зовсім не враховується,
        лише точність.
      </Absatz>
      <Absatz>
        <strong>Як він змінюється:</strong> програма дивиться щонайбільше на п'ять
        останніх раундів на поточному рівні - і лише починаючи з третього раунду на
        цьому рівні (інакше число стрибало б туди й назад). Якщо більшість із них
        точні <em>і</em> досягають цілі швидкості, рівень підвищується; із великим
        запасом - одразу на кілька рівнів. Якщо більшість надто неточні або явно
        надто повільні, рівень знижується на один. Лише коли друк тривалий час дуже
        неточний <em>і</em> дуже повільний, рівень повертається до рівня 1 - туди,
        де швидкість уже не враховується.
      </Absatz>
      <Absatz>
        <strong>Із «Швидкість не важлива»</strong> (налаштування для кожної дитини
        окремо) швидкість не враховується на <em>жодному</em> рівні. Рівень тоді
        підвищується і знижується лише за точністю.
      </Absatz>
      <Absatz>
        ⚠️ <strong>Рівень складності - це не оцінка і не бали.</strong>{" "}
        Дитина на рівні 8, яка щотижня піднімається на два рівні, працює краще,
        ніж дитина, що з жовтня стоїть на рівні 30. Для чого потрібен рівень: щоб
        бачити, чи вправи зараз підходять. Що призначене для оцінювання, описано в
        наступному розділі.
      </Absatz>
      <Absatz>
        ⚠️ Не плутайте з налаштуванням <strong>«Тексти для віку»</strong> - воно
        визначає лише те, наскільки дорослими є тексти вправ (7-10 років, 11-15
        років, від 16 років), і з результатами не має нічого спільного.
      </Absatz>
    </div>
  );
}

function DreiWerteHilfeUk() {
  // ★ O-UK: „Виклик" (Glossar uk §2.3), великий як назва - steht hier, solange
  // `schreibprobe.ts` noch keinen ukrainischen Zwilling trägt.
  const PRUEFUNG_WORT_UK = "Виклик";
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      <Absatz>
        Програма <strong>не ставить оцінок</strong>. Вона дає{" "}
        <strong>чотири показники</strong> - яку оцінку з них скласти, вирішуєте
        ви. Перші три є на картці над таблицею, для всього класу і для кожної
        дитини за стрілкою; четвертий - у стовпці «{PRUEFUNG_WORT_UK}».
      </Absatz>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">1 · Швидкість (знаків за хвилину)</p>
        <Absatz>
          Кількість усіх надрукованих знаків, поділена на чистий час друку і
          помножена на 60. Враховується лише час над текстом - пауза, поки
          програма відкрита, не враховується.
        </Absatz>
        <Absatz>
          Поруч стоїть зміна - у <strong>натисканнях</strong>, а не у відсотках:
          «більше на 4» означає 211 → 215.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">2 · Точність</p>
        <Absatz>
          <strong>(Знаки мінус помилки) ÷ знаки</strong>, у відсотках. Виправлена
          помилка все одно залишається помилкою - рахується натискання, а не
          результат на екрані.
        </Absatz>
        <Absatz>
          Зміна тут подана у <strong>відсоткових пунктах</strong> (з 94% до 96% -
          це «більше на 2»).
        </Absatz>
        <Absatz>
          ★ Це промовистіший із двох показників: хто друкує точно, сам собою стає
          швидшим - навпаки так майже ніколи не буває.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">3 · Тижнева мета</p>
        <Absatz>
          Для кожної дитини ви задаєте <strong>хвилини на тиждень</strong> - більше
          нічого. Показано частку виконаних хвилин від заданих, наприклад «87%», а
          поруч - скільки хвилин із заданих виконано і в скількох тижнях мету
          досягнуто повністю. Рахується{" "}
          <strong>похвилинно</strong>, а не потижнево: дитина, яка щотижня виконує
          хоча б частину, помітно відрізняється від дитини, яка не робить нічого.
        </Absatz>
        <Absatz>
          <strong>Надолужити хвилини попередніх тижнів</strong> (позначка для
          педагога): тренування понад мету тижня заповнює найстаріший тиждень, де
          мету ще не досягнуто, - ніколи не понад власну мету того тижня.
        </Absatz>
        <Absatz>
          Якщо <strong>тижневу мету не встановлено</strong>, цей показник
          відпадає - а з ним і стовпець «Тижнева мета» в таблиці. Тож ніде не стоїть
          нуль, який виглядав би як щось пропущене.
        </Absatz>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface-sunken p-3">
        <p className="m-0 font-semibold text-ink">4 · {PRUEFUNG_WORT_UK} (бали Виклику)</p>
        <Absatz>
          {PRUEFUNG_WORT_UK} - це спільне завдання для всього класу: той самий
          текст, той самий час. Його результат - <strong>бали Виклику від 0 до
          100</strong>. Вони поєднують точність і швидкість в одному числі:
        </Absatz>
        <ul className="m-0 list-none space-y-1 p-0">
          <li>
            <strong>Якість</strong> = знаки ÷ (знаки + k × хибні натискання) - одне
            хибне натискання важить стільки, скільки k знаків.
          </li>
          <li>
            <strong>Частка швидкості</strong> = квадратний корінь із (знаків за
            хвилину ÷ {BEZUGSTEMPO}); найбільше значення дорівнює 1.
          </li>
          <li>
            <strong>Бали Виклику</strong> = 100 × якість × частка швидкості.
          </li>
        </ul>
        <Absatz>
          <strong>k = {FEHLER_GEWICHT}</strong> для виду «Суворий» (типово):
          рахується кожне хибне натискання, навіть одразу виправлене - воно
          забрало час дорогою. <strong>k = {FEHLER_GEWICHT_FREI}</strong> для виду
          «Вільне письмо»: оцінюється лише те, що наприкінці залишилося з помилкою
          (у кожному слові щонайбільше одна помилка, виправлені місця не
          рахуються) - залишена помилка не забрала окремого часу на друк, тому
          важить більше.
        </Absatz>
        <Absatz>
          Квадратний корінь забезпечує, що <strong>точність важить більше, ніж
          час</strong>: удвічі вища швидкість дає не вдвічі більше, а лише в 1,4
          раза. Найменша кількість надрукованих знаків для балів Виклику:{" "}
          {MIND_ZEICHEN_WERTUNG} - якщо знаків менше, бали Виклику не виставляються.
        </Absatz>
        <Absatz>
          Бали стоять у таблиці результатів кожного раунду, як середнє значення у
          стовпці «{PRUEFUNG_WORT_UK}» статистики класу («3 / 82»: три Виклики,
          середні бали 82) і в дитини в розділі «Мій поступ». Оскільки всі діти
          одного раунду друкують той самий текст за той самий час, їхні показники
          можна порівнювати між собою.
        </Absatz>
      </div>

      <Absatz>
        <strong>З чим порівнювати,</strong> ви перемикаєте над показником: з{" "}
        <strong>попереднім тижнем</strong> (типово) або з{" "}
        <strong>початком навчального року класу</strong>. Початок навчального року
        при цьому - не перше число місяця, а перший тиждень, у якому тренувалася{" "}
        <strong>щонайменше половина</strong> класу, - щоб поодиноке тренування на
        канікулах не визначало початок для всіх. Хто приєднується пізніше,
        порівнюється від свого власного першого тижня.
      </Absatz>

      <div className="space-y-1.5 rounded-lg border-2 border-warning bg-warning-soft p-3">
        <p className="m-0 font-semibold text-ink">Чого ці показники не знають</p>
        <Absatz>
          Вони вимірюють, що відбулося на пристрої. Вони нічого не знають про
          вихідну ситуацію дитини, про травму руки, тиждень хвороби чи зміну
          допоміжного засобу. Показник, що зменшився, - це <em>привід запитати</em>,
          а не висновок про докладені зусилля.
        </Absatz>
        <Absatz>
          Скільки тренування взагалі стоїть за цими числами, видно у стовпці{" "}
          <strong>Час тренування</strong> і за стрілкою («Вправи», «Активні дні»,
          «Час тренування»).
        </Absatz>
      </div>
    </div>
  );
}

function SpaltenHilfeUk() {
  const zeilen: [string, string][] = [
    [
      "Налаштування",
      "Кругла кнопка зі стрілкою. Розгортає все, що стосується цієї дитини: «З чого почати?», «Друк однією рукою», «Швидкість не важлива», «Широкі інтервали (CVI)», тижневу мету і докладні результати.",
    ],
    ["Рівень складності", "Від 1 до 50 - наскільки складними можуть бути вправи зараз. Це не оцінка."],
    ["Час тренування", "Чистий час друку у вибраний період. Паузи не враховуються."],
    [
      "Тижнева мета",
      "Виконані хвилини із заданих на цей тиждень. З'являється, лише якщо мету встановлено.",
    ],
    ["Точність", "Частка правильно надрукованих знаків."],
    [
      "Знаків/хв",
      "Швидкість. Із «Швидкість не важлива» число показано, але в програмі воно ніде не враховується.",
    ],
  ];
  return (
    <dl className="m-0 space-y-1.5 text-sm leading-relaxed text-ink">
      {zeilen.map(([name, text]) => (
        <div key={name}>
          <dt className="m-0 inline font-semibold">{name}: </dt>
          <dd className="m-0 inline">{text}</dd>
        </div>
      ))}
      <div>
        <dt className="m-0 inline font-semibold">Період: </dt>
        <dd className="m-0 inline">
          Над таблицею ви вибираєте, до чого стосуються всі числа, - один тиждень,
          місяць (останні 4 тижні, а не календарний місяць), навчальний рік або все
          від початку; між тижнями, місяцями й навчальними роками ви переходите
          стрілками з обох боків. Результати за стрілкою від цього не залежать;
          вони завжди показують увесь рік.
        </dd>
      </div>
    </dl>
  );
}
