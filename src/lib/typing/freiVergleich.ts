/**
 * DER VERGLEICH FÜR „FREIES SCHREIBEN" - Soll gegen Ist, wie bei einer
 * Tastschreib-Abschrift (23.09.2026).
 *
 * ── Warum es dieses Modul gibt ───────────────────────────────────────────────
 *
 * Die Tippchallenge wertet bisher nach „erst richtig, dann weiter": eine
 * falsche Taste rückt nicht vor, der Text ist am Ende immer richtig. Im neuen
 * Modus „Freies Schreiben" (`BAUPLAN-2026-09-23-FREIES-SCHREIBEN.md` §3)
 * schreibt das Kind frei, Fehler bleiben stehen, die Rücktaste bessert nur in
 * der aktuellen Zeile aus - gewertet wird, was am Ende falsch dasteht. Genau
 * wie beim Typewriter-Test und den Wettschreibordnungen aus
 * `RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md`.
 *
 * ── Warum über den WORTSTROM verglichen wird, nicht Zeile für Zeile ─────────
 *
 * Ein vergessenes Wort am Ende einer Zeile würde bei einem Zeilen-für-Zeilen-
 * Vergleich den Rest der Zeile falsch aussehen lassen. Also werden alle
 * Soll-Zeilen zu EINEM Wortstrom aneinandergereiht (ebenso die Ist-Zeilen) und
 * per Wort-Levenshtein ausgerichtet - jedes Wort behält dabei seine
 * Zeilen-Nummer. So wirkt ein Fehler an einer Zeilengrenze nicht in die
 * nächste Zeile weiter (siehe Test „Fehler an einer Zeilengrenze").
 *
 * Das Muster für den Zeichen-Levenshtein steht zur Anschauung in
 * `src/lib/computer/antwortPruefer.ts` (Funktion `abstand`, ~Zeile 156) - hier
 * ist es NICHT importiert, weil dort einzelne Buchstaben verglichen werden und
 * hier ganze Wörter, mit zwei zusätzlichen Übergängen für Leerzeichen-Fehler.
 *
 * ── Die fünf Übergänge der Ausrichtung, mit Kosten ──────────────────────────
 *
 *   gleich               Kosten 0   Soll-Wort = Ist-Wort
 *   falsch               Kosten 1   Soll-Wort ≠ Ist-Wort, 1:1 ausgerichtet
 *   fehlend              Kosten 1   Soll-Wort ohne Ist-Wort
 *   ueberzaehlig         Kosten 1   Ist-Wort ohne Soll-Wort
 *   leerzeichen (2→1)    Kosten 1   zwei Soll-Wörter als EIN Ist-Wort getippt
 *   leerzeichen (1→2)    Kosten 1   ein Soll-Wort als ZWEI Ist-Wörter getippt
 *
 * Weil „falsch" (1 Stehle) immer billiger ist als „fehlend" + „ueberzaehlig"
 * für dieselben zwei Wörter (Kosten 1 gegen Kosten 2), bevorzugt die minimale
 * Ausrichtung „falsch" von selbst; bei echtem Gleichstand entscheidet die
 * Reihenfolge, in der die Übergänge geprüft werden (Diagonale zuerst).
 *
 * ── Das letzte getippte Wort - die Intersteno-Regel ─────────────────────────
 *
 * Das allerletzte Ist-Wort kann angefangen sein (die Zeit ist einfach um) und
 * zählt darum NIE als Fehler - auch dort nicht, wo die Ausrichtung „falsch"
 * oder „leerzeichen" fände. Und die Soll-Wörter DAHINTER zählen nicht als
 * „fehlend", weil das Kind dort nie hinkam. Das gilt nur für das Ende des
 * GANZEN Textes, nicht für das Ende einer einzelnen Zeile davor (die nächste
 * Zeile hat ja noch Ist-Wörter - siehe RECHERCHE-2026-09-10, §1: „Der Fehler
 * im letzten Wort zählt nicht als Fehler.").
 *
 * ★★★ Zwei Bausteine dafür (Abnahme 23.09.2026, Fall „Nehmen Sie" gegen das
 * abgeschnittene „Nehm"):
 *
 *  1. Ist das allerletzte Ist-Wort der ANFANG eines Soll-Worts (Gross/klein
 *     wie eingestellt), kostet diese Zuordnung in der Ausrichtung selbst 0 -
 *     wie ein Treffer, nicht wie ein „falsch". Ohne das würde die Ausrichtung
 *     so rechnen, als müsse sie diese Zuordnung noch „bezahlen", und bei
 *     echtem Kostengleichstand lieber auf eine andere, falsche Deutung
 *     ausweichen.
 *  2. Das FREIE ENDE auf der Soll-Seite ist ein eigener Schritt NACH der
 *     Ausrichtung, keine Sonderkoste *während* ihr: Es wird für jede
 *     Soll-Position `i`, an der schon alle Ist-Wörter verbraucht sind, ihr
 *     Ausrichtungspreis notiert; das Ergebnis ist die GRÖSSTE dieser
 *     Positionen mit dem kleinsten Preis - „so viel echten Text wie möglich,
 *     der Rest ist frei", nicht „irgendeine". (Eine Variante, die stattdessen
 *     das Weiterrücken selbst kostenlos macht, wirkt verlockend einfacher,
 *     öffnet aber ein NEUES Schlupfloch: Sie lässt echten, richtig
 *     getippten Text am Ende einer Zeile so aussehen, als sei er „frei",
 *     sobald irgendwo VOR ihm zufällig genau so viele Fehlgriffe möglich
 *     wären, wie tatsächliche Treffer nötig wären - siehe den Test
 *     „übersprungene Zeile", der genau das aufgedeckt hat.)
 *
 * Die Nachbearbeitung unten bleibt trotzdem nötig für EINEN Fall: ein echtes
 * „falsch"/„leerzeichen"/„ueberzaehlig" GENAU am letzten Ist-Wort, wenn es
 * KEIN Wortanfang ist - das ist immer der zeitlich LETZTE Schritt der
 * (schon getrimmten) Ausrichtung und wird darum einfach ausgelassen.
 *
 * ── Das Band ─────────────────────────────────────────────────────────────────
 *
 * Die Ausrichtung wird nicht über die volle (Soll-Länge × Ist-Länge)-Tabelle
 * gerechnet, sondern nur in einem Band um die Diagonale - der Bauplan nennt
 * „etwa ±25 Wörter". Hier sind es mindestens 40 (25 aus dem Bauplan plus 15
 * Sicherheitszuschlag, falls einmal 25+ Fehler ohne Gegenrichtung
 * hintereinanderstehen), zusätzlich erweitert um den Längenunterschied
 * zwischen Soll und Ist. Bei 3000 Wörtern bleibt das Band bei knapp 100
 * Zeilen der Rechen-Tabelle - schnell genug für die Zeitgrenze im Bauplan.
 */

import type { Lang } from "./account";
import { kleinFuer } from "./sprachRegister";

/** Die Art einer stehengebliebenen Fehlerstelle. */
export type FreiFehlerArt = "falsch" | "fehlend" | "ueberzaehlig" | "leerzeichen";

export interface FreiFehlerStelle {
  /** 0-basierter Index der Soll-Zeile, zu der die Stelle gehört (bei überzähligen Wörtern: die Zeile, in der sie getippt wurden). */
  zeile: number;
  /** Das Soll-Wort (bei „leerzeichen" ggf. zwei Wörter mit Leerzeichen; bei „ueberzaehlig" ""). */
  soll: string;
  /** Das getippte Wort (bei „fehlend" ""). */
  ist: string;
  art: FreiFehlerArt;
}

export interface FreiVergleich {
  /** Gezählte Anschläge: je gewertetem Ist-Wort seine Länge + 1 Trenner (Leerzeichen oder Zeilenende); überzählige Wörter zählen NICHT. */
  zeichen: number;
  /** Stehende Fehler - je Soll-Wort höchstens 1. */
  fehler: number;
  fehlerArten: Record<FreiFehlerArt, number>;
  /** Alle Fehlerstellen in Textreihenfolge. */
  stellen: FreiFehlerStelle[];
}

/** Ein Wort im Strom, mit der Zeile, aus der es stammt. */
interface WortEintrag {
  wort: string;
  zeile: number;
}

/**
 * Alle Zeilen zu einem Wortstrom aneinandergereiht. Leerraum trennt Wörter,
 * mehrfacher Leerraum zählt als ein Trenner (Regel 1); eine leere Zeile
 * liefert einfach keine Wörter - genau das lässt eine übersprungene Zeile
 * (Regel 6) ohne Sonderfall aus der Ausrichtung herausfallen.
 */
function tokenisiere(zeilen: readonly string[]): WortEintrag[] {
  const strom: WortEintrag[] = [];
  for (let zeile = 0; zeile < zeilen.length; zeile += 1) {
    const woerter = (zeilen[zeile] ?? "").trim().split(/\s+/).filter(Boolean);
    for (const wort of woerter) strom.push({ wort, zeile });
  }
  return strom;
}

// ── Die Übergänge der Ausrichtung, als Zahlen (kein `const enum` - das
//    Projekt baut mit Vite/esbuild, das isolierte Module übersetzt und
//    `const enum` dabei nicht auflösen kann). ─────────────────────────────────
const OP_GLEICH = 0;
const OP_FALSCH = 1;
const OP_FEHLEND = 2;
const OP_UEBERZAEHLIG = 3;
const OP_ZUSAMMEN = 4; // zwei Soll-Wörter als ein Ist-Wort ("dasist")
const OP_AUSEINANDER = 5; // ein Soll-Wort als zwei Ist-Wörter ("da s")

/** Ein ausgerichteter Schritt, in Textreihenfolge (nach der Rückverfolgung). */
interface Schritt {
  op: number;
  sollVon: number;
  sollBis: number;
  istVon: number;
  istBis: number;
}

/** Leeres Fehler-Konto, je Art auf 0. */
function leereFehlerArten(): Record<FreiFehlerArt, number> {
  return { falsch: 0, fehlend: 0, ueberzaehlig: 0, leerzeichen: 0 };
}

/**
 * Der Vergleich Soll gegen Ist für „Freies Schreiben".
 *
 * `soll` und `ist` sollen gleich viele Zeilen haben; sie dürfen es aber
 * nicht sein (Regel 10, nie werfen): Ist kürzer - die fehlenden Zeilen werden
 * wie das Ende des Textes behandelt (Regel 5, keine „fehlend"-Fehler). Ist
 * länger - die überschüssigen Zeilen werden ignoriert, sie zählen nirgends
 * mit (auch nicht als „ueberzaehlig").
 */
export function vergleicheFrei(
  soll: readonly string[],
  ist: readonly string[],
  // ★ G2b-1: `sprache` = die Sprache des Textes (Weg); türkisch „I" ≙ „ı", „İ" ≙ „i". Ohne Angabe Deutsch (= `toLowerCase()`).
  opts: { grossKleinEgal: boolean; sprache?: Lang },
): FreiVergleich {
  const sprache: Lang = opts.sprache ?? "de";
  const istBegrenzt = ist.length > soll.length ? ist.slice(0, soll.length) : ist;
  const sollWoerter = tokenisiere(soll);
  const istWoerter = tokenisiere(istBegrenzt);
  const n = sollWoerter.length;
  const m = istWoerter.length;

  const gleich = (a: string, b: string): boolean =>
    opts.grossKleinEgal ? kleinFuer(a, sprache) === kleinFuer(b, sprache) : a === b;

  /**
   * Ist `kurz` der ANFANG von `lang" (echt kürzer, nicht gleich lang)? Nur
   * für das allerletzte Ist-Wort gebraucht - siehe die Begründung bei der
   * Diagonale weiter unten.
   */
  const praefixVon = (kurz: string, lang: string): boolean => {
    if (kurz.length === 0 || kurz.length >= lang.length) return false;
    const a = opts.grossKleinEgal ? kleinFuer(kurz, sprache) : kurz;
    const b = opts.grossKleinEgal ? kleinFuer(lang, sprache) : lang;
    return b.startsWith(a);
  };

  // ── Band-begrenzte Kostentabelle ──────────────────────────────────────────
  // "Zusammen"/"auseinander" greifen bis zu zwei Zeilen zurück, darum werden
  // die letzten ZWEI vorigen Zeilen im Speicher gehalten; die Übergänge selbst
  // (für die Rückverfolgung) stehen für jede Zeile vollständig im `opGrid` -
  // das kostet bei 3000 Wörtern nur ein paar hundert KB.
  const BAND = Math.max(40, Math.abs(n - m) + 25);
  const BREITE = 2 * BAND + 1;
  const UNENDLICH = Number.POSITIVE_INFINITY;
  const kIndex = (i: number, j: number): number => j - i + BAND;

  let kostenVorVor = new Float64Array(BREITE).fill(UNENDLICH); // Zeile i-2
  let kostenVor = new Float64Array(BREITE).fill(UNENDLICH); // Zeile i-1
  const opGrid: Uint8Array[] = new Array(n + 1);
  // Der Preis, an JEDER Soll-Position i schon alle Ist-Wörter verbraucht zu
  // haben - Grundlage für das freie Ende (Baustein 2 oben).
  const kostenSpalteM = new Float64Array(n + 1).fill(UNENDLICH);

  // ★★★ Abnahme 23.09.2026 (zweiter Befund): eine ZWEITE, nachrangige
  // Kostenstufe - erst die bisherigen Kosten, bei Gleichstand DIESE hier.
  // Sie zählt +1 für jeden Treffer/jede Ersetzung/jeden Leerzeichen-Übergang,
  // bei dem Soll-Wort und Ist-Wort in verschiedenen ZEILEN liegen, und ändert
  // nie die Fehlerzahl - nur, WELCHE gleich teure Zuordnung gewählt wird.
  //
  // Ohne sie: Kommt ein Wort in zwei benachbarten Zeilen vor (hier "und" am
  // Ende von Zeile 20 UND am Anfang von Zeile 21), gibt es einen echten
  // Gleichstand zwischen "das überzählige Wort steht in Zeile 20" (richtig -
  // dort hat das Kind es getippt) und "es steht in Zeile 21" (rechnerisch
  // genauso billig, aber es reisst ein Ist-Wort über die Zeilengrenze). Die
  // Fehlerstellen-Liste der Lehrkraft zeigte dann die falsche Zeile.
  let kostenVorVor2 = new Float64Array(BREITE).fill(UNENDLICH);
  let kostenVor2 = new Float64Array(BREITE).fill(UNENDLICH);

  const holeVor = (k: number): number => (k >= 0 && k < BREITE ? kostenVor[k] : UNENDLICH);
  const holeVorVor = (k: number): number => (k >= 0 && k < BREITE ? kostenVorVor[k] : UNENDLICH);
  const holeVor2 = (k: number): number => (k >= 0 && k < BREITE ? kostenVor2[k] : UNENDLICH);
  const holeVorVor2 = (k: number): number => (k >= 0 && k < BREITE ? kostenVorVor2[k] : UNENDLICH);

  /** Lexikographischer Vergleich: erst `kosten`, bei Gleichstand `kosten2`. */
  const besser = (kosten: number, kosten2: number, best: number, best2: number): boolean =>
    kosten < best || (kosten === best && kosten2 < best2);

  for (let i = 0; i <= n; i += 1) {
    const kostenJetzt = new Float64Array(BREITE).fill(UNENDLICH);
    const kostenJetzt2 = new Float64Array(BREITE).fill(UNENDLICH);
    const op = new Uint8Array(BREITE);
    const jVon = Math.max(0, i - BAND);
    const jBis = Math.min(m, i + BAND);

    for (let j = jVon; j <= jBis; j += 1) {
      const k = kIndex(i, j);
      if (i === 0 && j === 0) {
        kostenJetzt[k] = 0;
        kostenJetzt2[k] = 0;
        continue;
      }
      let best = UNENDLICH;
      let best2 = UNENDLICH;
      let bestOp = OP_FEHLEND;

      // Die Diagonale wird VORAB berechnet, aber je nach Ergebnis an
      // unterschiedlicher Stelle in die Reihenfolge unten eingereiht - siehe
      // die Begründung dort.
      let diagKosten = UNENDLICH;
      let diagKosten2 = UNENDLICH;
      let diagOp = OP_FALSCH;
      if (i >= 1 && j >= 1) {
        const basis = holeVor(k);
        if (basis < UNENDLICH) {
          const sollWort = sollWoerter[i - 1].wort;
          const istWort = istWoerter[j - 1].wort;
          const istGleich = gleich(sollWort, istWort);
          // ★★★ Abnahme 23.09.2026: Das ALLERLETZTE Ist-Wort kann angefangen
          // sein. Ist es (Gross/klein wie eingestellt) der ANFANG des
          // Soll-Worts, kostet die Zuordnung 0 wie ein Treffer - nicht 1 wie
          // ein "falsch". Ohne das rechnet die Ausrichtung so, als müsse sie
          // das noch bezahlen, und weicht bei Gleichstand lieber auf einen
          // zufällig gleich teuren, aber falschen Pfad aus ("Nehmen Sie"
          // gegen das abgeschnittene "Nehm" landete sonst manchmal auf
          // "Nehmen fehlend" statt auf der richtigen Stelle).
          const angefangenesLetztesWort =
            !istGleich && j === m && praefixVon(istWort, sollWort);
          diagKosten = basis + (istGleich || angefangenesLetztesWort ? 0 : 1);
          diagKosten2 = holeVor2(k) + (sollWoerter[i - 1].zeile === istWoerter[j - 1].zeile ? 0 : 1);
          diagOp = istGleich || angefangenesLetztesWort ? OP_GLEICH : OP_FALSCH;
        }
      }

      // ★★★ Bei GLEICHSTAND: „falsch" VOR „fehlend"/„ueberzaehlig" (Regel 2),
      // ein echtes WORT-TREFFER aber NACH allen anderen Übergängen geprüft.
      //
      // Grund für die zweite Hälfte - ohne sie bricht „ist kürzer" (Regel 10)
      // bei jedem Wort, das im Text mehrfach vorkommt („der", „die", „ist", …):
      // Bricht ein Kind nach der ersten Zeile ab, kostet „gleich ausrichten,
      // Rest löschen" GENAU SO VIEL wie „bis zum letzten Vorkommen des Wortes
      // durchlöschen, dort erst treffen" - beide Pfade landen auf derselben
      // Endsumme. Ein echter Treffer erst NACH „fehlend"/„ueberzaehlig" geprüft
      // sorgt dafür, dass bei einem Gleichstand die FRÜHESTMÖGLICHE Stelle
      // gewinnt - genau die, an der ein Kind wirklich aufgehört hat zu tippen.
      if (diagOp === OP_FALSCH && besser(diagKosten, diagKosten2, best, best2)) {
        best = diagKosten;
        best2 = diagKosten2;
        bestOp = OP_FALSCH;
      }
      // Zusammengeschrieben: zwei Soll-Wörter als ein Ist-Wort - dp[i-2][j-1].
      if (i >= 2 && j >= 1) {
        const basis = holeVorVor(k + 1);
        if (basis < UNENDLICH) {
          const zusammen = sollWoerter[i - 2].wort + sollWoerter[i - 1].wort;
          if (gleich(zusammen, istWoerter[j - 1].wort)) {
            const kosten = basis + 1;
            const kosten2 =
              holeVorVor2(k + 1) + (sollWoerter[i - 1].zeile === istWoerter[j - 1].zeile ? 0 : 1);
            if (besser(kosten, kosten2, best, best2)) {
              best = kosten;
              best2 = kosten2;
              bestOp = OP_ZUSAMMEN;
            }
          }
        }
      }
      // Auseinandergerissen: ein Soll-Wort als zwei Ist-Wörter - dp[i-1][j-2].
      if (i >= 1 && j >= 2) {
        const basis = holeVor(k - 1);
        if (basis < UNENDLICH) {
          const auseinander = istWoerter[j - 2].wort + istWoerter[j - 1].wort;
          if (gleich(sollWoerter[i - 1].wort, auseinander)) {
            const kosten = basis + 1;
            const kosten2 =
              holeVor2(k - 1) + (sollWoerter[i - 1].zeile === istWoerter[j - 1].zeile ? 0 : 1);
            if (besser(kosten, kosten2, best, best2)) {
              best = kosten;
              best2 = kosten2;
              bestOp = OP_AUSEINANDER;
            }
          }
        }
      }
      // Fehlend: nur ein Soll-Wort verbraucht - dp[i-1][j].
      if (i >= 1) {
        const basis = holeVor(k + 1);
        if (basis < UNENDLICH) {
          const kosten = basis + 1;
          const kosten2 = holeVor2(k + 1);
          if (besser(kosten, kosten2, best, best2)) {
            best = kosten;
            best2 = kosten2;
            bestOp = OP_FEHLEND;
          }
        }
      }
      // Überzählig: nur ein Ist-Wort verbraucht - dp[i][j-1], dieselbe Zeile.
      if (j >= 1) {
        const idx = k - 1;
        const basis = idx >= 0 && idx < BREITE ? kostenJetzt[idx] : UNENDLICH;
        if (basis < UNENDLICH) {
          const kosten = basis + 1;
          const kosten2 = idx >= 0 && idx < BREITE ? kostenJetzt2[idx] : UNENDLICH;
          if (besser(kosten, kosten2, best, best2)) {
            best = kosten;
            best2 = kosten2;
            bestOp = OP_UEBERZAEHLIG;
          }
        }
      }
      // Der echte Treffer - absichtlich zuletzt geprüft (siehe oben).
      if (diagOp === OP_GLEICH && besser(diagKosten, diagKosten2, best, best2)) {
        best = diagKosten;
        best2 = diagKosten2;
        bestOp = OP_GLEICH;
      }

      kostenJetzt[k] = best;
      kostenJetzt2[k] = best2;
      op[k] = bestOp;
    }

    if (m >= jVon && m <= jBis) kostenSpalteM[i] = kostenJetzt[kIndex(i, m)];
    opGrid[i] = op;
    kostenVorVor = kostenVor;
    kostenVor = kostenJetzt;
    kostenVorVor2 = kostenVor2;
    kostenVor2 = kostenJetzt2;
  }

  // ── Das freie Ende: die GRÖSSTE Soll-Position mit dem kleinsten Preis ────
  // Wurde ÜBERHAUPT NICHTS getippt (m === 0), ist die Antwort immer i = 0 -
  // kein einziges Soll-Wort wird auch nur versucht (Regel 5 von Anfang an).
  // Sonst: unter allen `i`, die den global kleinsten Preis in Spalte `m`
  // erreichen, gewinnt das GRÖSSTE - "so viel echten Text wie möglich, der
  // Rest ist frei" (die Begründung mit dem Gegenbeispiel steht im Kopf der
  // Datei).
  let iEnde = 0;
  if (m > 0) {
    let minKosten = UNENDLICH;
    for (let ii = 0; ii <= n; ii += 1) {
      const w = kostenSpalteM[ii];
      if (w < UNENDLICH && w <= minKosten) {
        minKosten = w;
        iEnde = ii;
      }
    }
  }

  // ── Rückverfolgung: von (iEnde, m) rückwärts bis (0, 0) ───────────────────
  // Soll-Wörter zwischen iEnde und n gehören zum freien Ende und bekommen gar
  // keinen Schritt - sie waren nie erreichbar (Regel 5).
  const schritteRueckwaerts: Schritt[] = [];
  let i = iEnde;
  let j = m;
  while (!(i === 0 && j === 0)) {
    const op = opGrid[i][kIndex(i, j)];
    switch (op) {
      case OP_GLEICH:
      case OP_FALSCH:
        schritteRueckwaerts.push({ op, sollVon: i - 1, sollBis: i, istVon: j - 1, istBis: j });
        i -= 1;
        j -= 1;
        break;
      case OP_ZUSAMMEN:
        schritteRueckwaerts.push({ op, sollVon: i - 2, sollBis: i, istVon: j - 1, istBis: j });
        i -= 2;
        j -= 1;
        break;
      case OP_AUSEINANDER:
        schritteRueckwaerts.push({ op, sollVon: i - 1, sollBis: i, istVon: j - 2, istBis: j });
        i -= 1;
        j -= 2;
        break;
      case OP_UEBERZAEHLIG:
        schritteRueckwaerts.push({ op, sollVon: i, sollBis: i, istVon: j - 1, istBis: j });
        j -= 1;
        break;
      case OP_FEHLEND:
      default:
        schritteRueckwaerts.push({ op, sollVon: i - 1, sollBis: i, istVon: j, istBis: j });
        i -= 1;
        break;
    }
  }
  const schritte = schritteRueckwaerts.reverse();

  // ── Zeichen: jedes gewertete Ist-Wort zählt Länge + 1 Trenner ─────────────
  // (Regel 7). Überzählige Wörter zählen nie mit - unabhängig davon, ob sie
  // am Ende stehen und deshalb auch nicht als FEHLER zählen (das ist eine
  // andere Rechnung, siehe unten).
  const istZaehlt = new Array<boolean>(m).fill(true);
  for (const s of schritte) if (s.op === OP_UEBERZAEHLIG) istZaehlt[s.istVon] = false;
  let zeichen = 0;
  for (let w = 0; w < m; w += 1) if (istZaehlt[w]) zeichen += istWoerter[w].wort.length + 1;

  // ── Das letzte Ist-Wort zählt nie als Fehler (Regel 5) ────────────────────
  // Das freie Ende oben hat die Soll-Wörter DANACH schon ganz aus der
  // Ausrichtung herausgehalten - hier bleibt nur noch EIN Fall übrig: der
  // Schritt, der das allerletzte Ist-Wort selbst verbraucht (immer der
  // zeitlich LETZTE in `schritte`, weil danach nichts mehr folgt). War er
  // schon ein Treffer oder ein Wortanfang, ist er ohnehin `OP_GLEICH` und
  // fällt unten heraus; war er ein echtes "falsch"/"leerzeichen"/
  // "ueberzaehlig", wird er hier ausdrücklich übersprungen.
  const letzterSchrittIndex = schritte.length - 1;

  const stellen: FreiFehlerStelle[] = [];
  const fehlerArten = leereFehlerArten();
  schritte.forEach((s, idx) => {
    if (s.op === OP_GLEICH) return;
    if (idx === letzterSchrittIndex) return;

    let stelle: FreiFehlerStelle;
    switch (s.op) {
      case OP_FALSCH:
        stelle = {
          zeile: sollWoerter[s.sollVon].zeile,
          soll: sollWoerter[s.sollVon].wort,
          ist: istWoerter[s.istVon].wort,
          art: "falsch",
        };
        break;
      case OP_FEHLEND:
        stelle = {
          zeile: sollWoerter[s.sollVon].zeile,
          soll: sollWoerter[s.sollVon].wort,
          ist: "",
          art: "fehlend",
        };
        break;
      case OP_UEBERZAEHLIG:
        stelle = {
          zeile: istWoerter[s.istVon].zeile,
          soll: "",
          ist: istWoerter[s.istVon].wort,
          art: "ueberzaehlig",
        };
        break;
      case OP_ZUSAMMEN:
        stelle = {
          zeile: sollWoerter[s.sollVon].zeile,
          soll: `${sollWoerter[s.sollVon].wort} ${sollWoerter[s.sollVon + 1].wort}`,
          ist: istWoerter[s.istVon].wort,
          art: "leerzeichen",
        };
        break;
      default: // OP_AUSEINANDER
        stelle = {
          zeile: sollWoerter[s.sollVon].zeile,
          soll: sollWoerter[s.sollVon].wort,
          ist: `${istWoerter[s.istVon].wort} ${istWoerter[s.istVon + 1].wort}`,
          art: "leerzeichen",
        };
        break;
    }
    stellen.push(stelle);
    fehlerArten[stelle.art] += 1;
  });

  return { zeichen, fehler: stellen.length, fehlerArten, stellen };
}
