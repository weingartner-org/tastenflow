/**
 * ★★★★★ WANN EINE NEUE TASTE DAZUKOMMT - die Regel, EINMAL (11.09.2026).
 *
 * ── Warum diese Datei entstanden ist ────────────────────────────────────────
 * F7 des Klassenmatchs lautet: *„Zählt zur Übezeit und schaltet Tasten frei wie
 * eine normale Runde."* Damit gab es zum ersten Mal einen ZWEITEN Ort, an dem
 * eine Runde endet - bis dahin war das ausschliesslich `AdaptiveTrainer`
 * (`onSessionDone`).
 *
 * ★ Stand 02.10.2026: F7 gilt seither nur noch für die ENTSCHEIDUNG. Das Match
 * ruft nicht mehr {@link wendeRundenendeAn}, sondern {@link merkeMatchRundenende}
 * (am Ende der Datei) und schaltet nichts frei - die Taste wird im Training
 * vorgestellt ({@link loeseVormerkungEin}). Grund und Befund dort.
 *
 * Zwei Wege standen zur Wahl, und der Umbauplan liess ausdrücklich die Wahl:
 *
 *  (a) Den `AdaptiveTrainer` mit einem „match"-Modus fahren.
 *  (b) Die Rundenend-Regel in eine gemeinsame Funktion ziehen.
 *
 * **Gewählt ist (b), und zwar aus einem messbaren Grund:** `AdaptiveTrainer`
 * ist 863 Zeilen und trägt Übungsformen, Geschichten, Themenstränge,
 * Abzeichen, Belohnungsspiele, Sterne und das Tor vor der neuen Taste. Ein
 * Match braucht davon NICHTS ausser den fünf Zeilen, um die es hier geht - und
 * es bringt drei Dinge mit, die dort nirgends hineinpassen: einen Text ohne
 * `seen`-Ledger, einen Lauf ohne Rundenende und eine Uhr, die von aussen kommt.
 * Ein Schalter durch dieses Bauteil hätte in jeder zweiten Verzweigung ein
 * `if (!match)` bedeutet. Das ist die Bauart, aus der Programmleichen werden.
 *
 * Mit (b) steht die Regel an EINER Stelle, und **`AdaptiveTrainer` benutzt sie
 * auch** - das ist die Bedingung, unter der eine Auslagerung überhaupt etwas
 * wert ist. Ändert jemand, wann eine Taste dazukommt, ändert er beides.
 *
 * ── Was hier NICHT steht ────────────────────────────────────────────────────
 * Erfahrungspunkte, Sterne, Abzeichen, Leistungsstufe, Themenstränge, das Tor
 * vor der neuen Taste. Das sind Dinge des Lehrgangs; ein Match verteilt keine
 * Sterne und feiert keine Aufstiege. Hier steht nur: **kommt eine Taste dazu,
 * und was heisst das für den Fortschritt.**
 */
import {
  advanceIntroduced,
  ensureIntroduced,
  neuFreigeschaltet,
  nextLetter,
  stampUnlocks,
  type Mastery,
} from "./letters";
import { topfTastenVerbuchen } from "./topf";
import type { TypingProgress } from "./progress";
import type { Lernweg } from "./lernweg";

/** Was eine beendete Runde am Fortschritt ändert - nur die Tasten-Felder. */
export interface Freischaltung {
  /** Die Einheiten nach der Runde (gewachsen oder unverändert). */
  introduced: string[];
  /** Die Zeitstempel der Freischaltungen - unverändert, wenn nichts dazukam. */
  introducedAt: Record<string, number> | undefined;
  /** Der Geduld-Zähler: 0 nach einer neuen Taste, sonst um die Gutschrift höher. */
  rundenOhneTaste: number;
  /** Ist wirklich eine Taste dazugekommen? */
  gewachsen: boolean;
  /** Welche - für die Feier. `null`, wenn nichts dazukam. */
  neueTaste: string | null;
}

/**
 * Die Rundenend-Regel anwenden.
 *
 * `rundenGutschrift` ist der Wert dieser Runde fürs Tor (`rundenWert` aus
 * `rundenlaenge.ts`): Eine gekürzte oder in Sekunden weggetippte Runde ist
 * anteilig weniger Übung. Ein Match liefert dafür seine eigene Zahl.
 *
 * ★ `topfTastenVerbuchen` steht MIT drin und nicht daneben: Der anonyme Topf
 * ist die Messung, an der das Tor künftig an echten Kindern justiert wird -
 * eine Freischaltung, die er nicht sieht, verzerrt sie. Bisher stand der
 * Aufruf in BEIDEN Trainern und ein Wächter (`tests/typing-topf.test.ts`)
 * passte darauf auf, dass niemand einen davon vergisst. Genau das ist jetzt
 * nicht mehr nötig.
 */
export function wendeRundenendeAn(
  progress: TypingProgress,
  m: Mastery,
  rundenGutschrift: number,
  jetztMs: number,
  /** ★ E1 (24.09.2026): der Lernweg des Kindes - er bestimmt die nächste Taste. */
  lernweg: Lernweg,
): Freischaltung {
  const vorher = ensureIntroduced(progress.introduced, lernweg);
  const nachher = advanceIntroduced(
    vorher,
    progress.letters,
    lernweg,
    m,
    progress.rundenOhneTaste,
  );
  const gewachsen = nachher.length > vorher.length;
  topfTastenVerbuchen(jetztMs, nachher.length);
  return {
    introduced: nachher,
    introducedAt: gewachsen
      ? stampUnlocks(vorher, nachher, progress.introducedAt, jetztMs)
      : progress.introducedAt,
    rundenOhneTaste: gewachsen ? 0 : (progress.rundenOhneTaste ?? 0) + rundenGutschrift,
    gewachsen,
    neueTaste: gewachsen ? nachher[nachher.length - 1] : null,
  };
}

/**
 * ★★★★★ DAS KLASSENMATCH ENTSCHEIDET - ES SCHALTET NICHT FREI (02.10.2026).
 *
 * Johannes: *„ein match darf eine neue taste für nach dem match freischalten
 * aber nie während dem match! nach dem abschluss, wenn es wieder in mein
 * training geht kommt die meldung der neuen taste!"*
 *
 * Bis dahin rief das Match {@link wendeRundenendeAn} und schrieb `introduced`
 * sofort. Gemessen an Arda (Klasse CSS6, 02.10.2026): Das R kam am Match-Ende
 * dazu, danach lief das Kind in die Spiele - die nehmen `introduced` - und
 * bekam ein R abgefragt, ohne es je vorgestellt bekommen zu haben.
 *
 * Diese Funktion trifft dieselbe Entscheidung (`advanceIntroduced`, dieselbe
 * Regel), schreibt sie aber NUR als Vormerkung
 * (`progress.freischaltungAusMatch`, Begründung der Form dort). `introduced`,
 * `introducedAt` und der anonyme Topf bleiben unangetastet - die entstehen,
 * wenn {@link loeseVormerkungEin} die Taste im Training vorstellt.
 *
 *  • Steht schon eine Vormerkung da (zweites Match vor dem Training), bleibt
 *    sie wie sie ist: Es wird keine zweite Taste vorgemerkt, bevor die erste
 *    vorgestellt wurde.
 *  • Der Geduld-Zähler (`rundenOhneTaste`) bleibt bei einer Vormerkung
 *    unverändert und wird bei der Vorstellung auf 0 gesetzt, wie bei jeder
 *    neuen Taste. Ohne Vormerkung zählt die Runde wie bisher.
 */
export function merkeMatchRundenende(
  progress: TypingProgress,
  m: Mastery,
  rundenGutschrift: number,
  jetztMs: number,
  lernweg: Lernweg,
): Pick<TypingProgress, "freischaltungAusMatch" | "rundenOhneTaste"> {
  if (progress.freischaltungAusMatch) {
    return {
      freischaltungAusMatch: progress.freischaltungAusMatch,
      rundenOhneTaste: progress.rundenOhneTaste,
    };
  }
  const vorher = ensureIntroduced(progress.introduced, lernweg);
  const nachher = advanceIntroduced(vorher, progress.letters, lernweg, m, progress.rundenOhneTaste);
  const neu = neuFreigeschaltet(vorher, nachher);
  if (neu.length > 0) {
    return {
      freischaltungAusMatch: { einheiten: neu, ts: jetztMs },
      rundenOhneTaste: progress.rundenOhneTaste,
    };
  }
  return {
    freischaltungAusMatch: undefined,
    rundenOhneTaste: (progress.rundenOhneTaste ?? 0) + rundenGutschrift,
  };
}

/** Was {@link loeseVormerkungEin} ergab. */
export interface VormerkungErgebnis {
  /** Der Fortschritt danach - ohne Vormerkung, bei Erfolg mit der neuen Taste. */
  progress: TypingProgress;
  /** Die jetzt vorgestellten Einheiten (leer, wenn nichts vorgemerkt war oder sie verworfen wurde). */
  neu: string[];
  /** Hat sich am Fortschritt etwas geändert (dann speichern)? */
  geaendert: boolean;
}

/**
 * Die Vormerkung des Matchs einlösen: genau der normale Freischalt-Weg
 * (Einheiten dazu, `introducedAt` mit dem Zeitpunkt der Vorstellung,
 * Geduld-Zähler 0, anonymer Topf) - nur ohne neue Prüfung von `canAdvance`:
 * Die Entscheidung des Matchs gilt (Vorgabe Johannes, 02.10.2026).
 *
 * Die Vormerkung wird still VERWORFEN (ohne Feier, nichts zu speichern ausser
 * dem Löschen des Merkfelds), wenn sie nicht mehr passt:
 *  • alle vorgemerkten Einheiten sind schon frei (Startpunkt der Lehrkraft,
 *    Serien-Etappe o. ä. war schneller), oder
 *  • die erste noch fehlende ist nicht die nächste Taste des Weges (anderer
 *    Startpunkt oder Weg) - dann wäre das Einsetzen eine Taste aus der Reihe.
 */
export function loeseVormerkungEin(
  progress: TypingProgress,
  jetztMs: number,
  lernweg: Lernweg,
): VormerkungErgebnis {
  const vm = progress.freischaltungAusMatch;
  if (!vm) return { progress, neu: [], geaendert: false };
  const { freischaltungAusMatch: _weg, ...ohne } = progress;
  const vorher = ensureIntroduced(progress.introduced, lernweg);
  const offen = vm.einheiten.filter((u) => !vorher.includes(u));
  if (offen.length === 0 || offen[0] !== nextLetter(vorher, lernweg)) {
    return { progress: ohne, neu: [], geaendert: true };
  }
  const nachher = [...vorher, ...offen];
  topfTastenVerbuchen(jetztMs, nachher.length);
  return {
    progress: {
      ...ohne,
      introduced: nachher,
      introducedAt: stampUnlocks(vorher, nachher, progress.introducedAt, jetztMs),
      rundenOhneTaste: 0,
    },
    neu: offen,
    geaendert: true,
  };
}
