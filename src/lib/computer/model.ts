// ── Dimensionen ──────────────────────────────────────────────
/**
 * Der Computer, an dem ein Kind sitzt (Etappe M1).
 *
 * Die zweite Plattform wird GESPIEGELT, nicht in die Windows-Atome
 * hineingebaut: eigene Datendateien (`dataMac.ts`, `lehrpfadMac.ts`) mit dem
 * id-Präfix `mac.`, dieselbe Mechanik. Begründung siehe RECHERCHE-01 §13 —
 * am Mac unterscheiden sich nicht nur Tasten, sondern Begriffe (Explorer ↔
 * Finder), und `verifiedAgainst` ist plattformgebunden.
 *
 * Welche Plattform gerade gilt, steht an EINER Stelle: `plattform.ts`.
 */
export type Plattform = "windows" | "macos";
/**
 * Womit ein Kind arbeitet. `ohne` = ohne Hilfsmittel (inklusiver Unterricht,
 * Etappe A1) — es sieht alle `shared`-Atome und die ausdrücklich für `ohne`
 * geöffneten Varianten, aber keine Lupen- und keine Screenreader-Atome.
 * `ohne` gilt auf BEIDEN Plattformen und ist dort dasselbe Profil-id.
 * macOS (M1): `voiceover` (Screenreader) und `zoom` (Vergrößerung).
 * Die gültige Liste je Plattform steht an EINER Stelle: `profile.profileFuer()`.
 */
export type ToolProfile =
  | "bildschirmlupe" | "nvda" | "jaws" | "ohne"   // Windows (+ ohne)
  | "voiceover" | "zoom";                          // macOS (+ ohne)
export type SkillLevel = "L1" | "L1plus" | "L2" | "L3";
export type ModulId =
  | "grundlagen" | "bedienungshilfen" | "explorer" | "word"   // L1
  | "finder"                                                  // L1, nur macOS
  | "excel" | "browser" | "teams" | "powerpoint" | "outlook"  // L2
  | "datenschutz" | "ki"                                       // L3
  | "selfadvocacy";                                            // quer L1–L3

// ── Mechanik → Motor ─────────────────────────────────────────
/**
 * ★ `tasten` ist der fünfte Motor (Etappe T2, Bauplan „Tasten-Lektion" §1) —
 * der Explorier-Modus, in dem ein Kind einzelne Tasten ertastet und ihren Namen
 * angesagt bekommt. Er ist bewusst KEIN `chord`: Ein Akkord prüft eine
 * Kombination auf richtig oder falsch, hier gibt es beim freien Erkunden weder
 * richtig noch falsch. Der Stoff steht in `tastenNamen.ts`.
 *
 * ★ `haus` ist der sechste Motor (Etappe H5, Bauplan „Das Haus" §2/§3) — die
 * Brücken-Übung: aufräumen im App-Baum (Stufe 1) und dieselbe Arbeit am echten
 * Rechner mit Herunterladen, Aufräumen, Hochladen (Stufe 2). Wie `tasten` ist er
 * **übend, nicht prüfbar**: Es gibt kein Richtig-oder-Falsch je Tastendruck,
 * sondern Kriterien mit Hinweisen. Der geprüfte Teil einer Haus-Lektion kommt aus
 * begleitenden `knowledge`-Lernschritten. Das Haus selbst steht NICHT im Skill,
 * sondern im Register `haus/hausRegister.ts` — sonst gäbe es es zweimal.
 *
 * ★ `tabelle` ist der siebte Motor (Etappe E2, „Die Excel-Brücke") — dieselbe
 * Brücken-Übung wie das Haus, nur mit einer Tabelle: Das Kind lädt eine `.xlsx`
 * herunter, arbeitet im ECHTEN Excel (oder LibreOffice), lädt sie hoch, und die
 * Prüfung läuft im Browser. Ein eigener Motor und kein `haus` mit anderer
 * Nutzlast: Das Haus prüft Ordner und Dateinamen, diese Übung Zellen und
 * Formeln — dieselbe Didaktik, aber ein anderer Leser und ein anderer
 * Fehlerbild-Katalog. Ebenfalls **übend, nicht prüfbar**; der geprüfte Teil
 * kommt aus begleitenden `knowledge`-Lernschritten.
 */
/**
 * ★ `wort` ist der achte Motor (Etappe W2-5, Bauplan „Word Stufe 2" §7
 * Etappe 5, 20.09.2026) — dieselbe Brücken-Übung wie `tabelle`, nur mit einem
 * WORD-Übungsheft: Das Kind lädt eine `.docx` herunter, arbeitet im ECHTEN
 * Word (oder LibreOffice Writer), lädt sie hoch, und die Prüfung läuft im
 * Browser über `bruecke/wordPruefung.ts`. Ein eigener Motor und kein
 * `tabelle` mit anderer Nutzlast: Excel prüft Zellen und Formeln, dieser
 * Motor Absätze, Formatvorlagen und Tabellen in einem Textdokument — derselbe
 * Grundsatz wie der Kopf-Kommentar von `tabelle` selbst. Ebenfalls **übend,
 * nicht prüfbar**.
 */
export type SkillKind =
  | "chord" | "navigation" | "procedure" | "knowledge" | "tasten" | "haus" | "tabelle" | "wort";

/**
 * Welche der beiden Stufen des Hauses ein Lernschritt meint (H5).
 *  · `app`  — der Baum in der App (Bauplan §2): sofortige Ansage, nichts geht kaputt.
 *  · `echt` — die ZIP-Rundreise (Bauplan §3): herunterladen, im echten
 *    Explorer/Finder aufräumen, wieder verpacken, hochladen. Die Prüfung läuft
 *    im Browser des Kindes; die Datei verlässt den Rechner nie.
 */
export type HausStufe = "app" | "echt";

// ── Pro-Profil-Variante eines Befehls/Schritts ───────────────
export interface Variant {
  profiles?: ToolProfile[]; // welche Profile; weggelassen = ALLE
  keys?: string;            // kanonische Schreibweise, z. B. "Strg+Umschalt+F", "NVDA+F7", "Einf+F6"
  say?: string;             // was der Screenreader sagen SOLL (navigation/procedure)
  hint?: string;            // kurzer Hinweis (Du)
}

// ── Erfolgsprüfung, je nach kind ─────────────────────────────
export interface ProcStep { key: string; say: string; do: string; } // Wege-Schritt
export type Check =
  | { type: "chord"; expect: string }                                   // Motor 1 (useChordItem)
  | { type: "navigation"; target: string; say?: string }                // Motor 2: DOM-Fokus/Markierung trifft `target`
  | { type: "procedure"; steps: ProcStep[]; checkpoint?: string }       // Motor 3
  /**
   * ★ `taste` (E14, 12.09.2026): die kanonische Schreibweise des EINEN Griffs,
   * um den eine Wissenskarte kreist — nur gesetzt, wenn die Karte genau EIN
   * Kürzel lehrt/abfragt, das nach den vorhandenen Klassifizierern
   * (`nurErkennenMac.istReserviertMac`/`istNiePruefbarMac` am Mac,
   * `nurErkennen.RESERVIERTE_KOMBINATION` unter Windows) gar nicht gedrückt
   * werden kann. `zeigtNurWissenZeile` (`nurWissen.ts`) liest dieses Feld, um
   * unter der Lernkarte die feste Zeile „Nur Wissen - dieses/diese Kürzel
   * drückst du hier nicht." zu zeigen — ohne Handliste, ohne Satz in der Karte
   * selbst.
   *
   * ★★ E14b (12.09.2026, Koordinator-Entscheidung D15): manche Karten nennen
   * MEHRERE Griffe auf einmal (z. B. die vier Ansichten-Kürzel des Finders).
   * `taste` nimmt darum wahlweise EINEN Griff (`string`) oder mehrere
   * (`string[]`) - eine Liste mit nur einem Eintrag wäre für die 13 Karten der
   * Etappe E14 eine unnötige Änderung ihres Feldes gewesen, ein zweites,
   * paralleles Feld (`tasten` NEBEN `taste`) eine vermeidbare Doppelung.
   * `zeigtNurWissenZeile` liefert die Zeile nur, wenn ALLE eingetragenen
   * Griffe nicht drückbar sind — ist auch nur einer drückbar, bleibt die Karte
   * ohne Zeile (das wäre dann kein reines Wissens-Kürzel mehr, sondern gehört
   * als `chord` geprüft).
   *
   * Wird ein Griff später drückbar (Ratsche in `nurErkennenMac.ts`), verschwindet
   * die Zeile von selbst; das Feld muss dafür nicht angefasst werden.
   */
  | { type: "knowledge"; question: string; options: string[]; correct: number; reflect?: boolean; explanation?: string; encouragement?: string; intro?: string; taste?: string | string[] }
  /**
   * Motor 5 (T2): `tasten` sind ids aus `tastenNamen.ts`, in Lehr-Reihenfolge.
   * Das Element führt sie erst frei zum Erkunden vor und lässt sie dann suchen.
   * Nicht suchbare Tasten (fn) dürfen hier stehen — sie werden erklärt und aus
   * der Suchrunde herausgehalten, damit ein Kind nie nach etwas sucht, das kein
   * Ereignis erzeugt.
   */
  | { type: "tasten"; tasten: string[]; intro?: string }
  /**
   * Motor 6 (H5): die Adresse eines ZIP-Pakets, dazu `stufe` — Baum in der App
   * oder ZIP-Rundreise am echten Rechner.
   * ★ Die Haus-Definition selbst steht hier bewusst NICHT: Sie ist die eine
   * Quelle für Generator, Erwartungen, Prüfung und Baum — ein zweites Vorkommen
   * im Skill wäre die erste Stelle, an der beide auseinanderlaufen.
   *
   * ★★ P3a (14.08.2026): **GENAU EINES von beiden** ist gesetzt.
   *  · `level` — eines der zwei Live-Häuser (`hausFuerLevel`).
   *  · `paket` — ein Paket des Übungswerks über seinen eingefrorenen Slug
   *    (`paketMitSlug`), z. B. `ordner-s1-schulranzen`.
   *
   * Zwei optionale Felder statt eines Pflichtfeldes, weil die zwei Häuser ihre
   * `level`-Nummern behalten müssen: An `progress.haus.level-1`/`level-2` hängt
   * der Fortschritt echter Kinder (MINDMAP §1.5). Ein Wächter hält fest, dass
   * nie beide und nie keines gesetzt sind — TypeScript kann das an einer
   * gemeinsamen `type`-Marke nicht ausdrücken, ohne die zwei Bauarten in zwei
   * Motor-Namen zu spalten, und das wären zwei Motoren für eine Sache.
   */
  | { type: "haus"; level?: number; paket?: string; stufe: HausStufe; intro?: string }
  /**
   * Motor 7 (E2): `uebung` ist der eingefrorene Slug einer Übung im
   * Excel-Register (`bruecke/excelRegister.ts`, `uebungMitSlug`).
   * ★ Wie beim Haus steht die Übung selbst hier NICHT: Sie ist die eine Quelle
   * für Generator, Anleitung, Erwartungen und Prüfung.
   * ★ Es gibt nur EINE Stufe — anders als beim Haus, wo ein Baum in der App der
   * echten Runde vorausgeht. Eine Tabelle in der App nachzubauen hieße, ein
   * zweites Excel zu bauen; und die ganze Etappe existiert, damit ein Kind im
   * ECHTEN Programm arbeitet.
   */
  | { type: "tabelle"; uebung: string; intro?: string }
  /**
   * Motor 8 (W2-5): `uebung` ist der eingefrorene Basis-Slug eines Word-Hefts
   * im Register (`bruecke/uebungswerk/wordHeftRegister.ts`, `heftMitSlug` bzw.
   * `heftFuerPlattform`). Wie bei `tabelle` steht das Heft selbst hier NICHT —
   * es ist die eine Quelle für Generator, Anleitung, Erwartungen und Prüfung.
   */
  | { type: "wort"; uebung: string; intro?: string };

// ── Ein atomarer Lern-Baustein ───────────────────────────────
export interface Skill {
  id: string;            // EINGEFROREN: "<modul>.<slug>", z. B. "word.fett", "explorer.neuer-ordner"
  modul: ModulId;
  level: SkillLevel;     // Spiralstufe, in der NEU eingeführt
  kind: SkillKind;
  titel: string;         // „Wort fett machen" (Du) — aus daten/
  // Befehl: geteilt (alle Profile) UND/ODER pro-Profil-Abweichungen.
  // Fehlt für ein Profil jede Variante → Skill erscheint für dieses Profil NICHT.
  shared?: Variant;
  variants?: Variant[];
  check: Check;
  /**
   * ★★★★★ EIGENE FASSUNGEN JE HILFSMITTEL-AUSWAHL (09.09., Modell seit
   * 12.09.2026 - Etappe E8).
   *
   * ── Warum es dieses Feld gibt ───────────────────────────────────────────
   *
   * Bis zum 09.09.2026 konnte das Hilfsmittel nur steuern, **ob** ein
   * Lernschritt erscheint und **welche Tastenzeile** dabeisteht - nie, **was**
   * darin steht: `Variant` trägt nur `profiles`/`keys`/`say`/`hint`, der
   * Lehrstoff sitzt in `check` und war unteilbar. Gemessen am selben Tag: 142
   * Mac- und 199 Windows-Lernschritte, **0 mit profileigenem Text**. Ein Kind
   * mit Blindheit und ein Kind mit Restsehen bekamen denselben Satz - und im
   * ersten Kapitel hiess der: „Du klickst am Fenster auf den roten Knopf."
   *
   * ── Neun Versionen, nicht zwei ──────────────────────────────────────────
   *
   * Johannes' Zielabgleich 09.09.2026: Kategorie 1 = NVDA · JAWS · VoiceOver,
   * Kategorie 2 = Bildschirmlupe · Zoom, Kategorie 3 = die drei Kombinationen,
   * Kategorie 4 = ohne Hilfsmittel. Der Schlüssel ist darum die AUSWAHL
   * (`Fassung`), nicht das einzelne Werkzeug. Das Vorgängerfeld
   * `mitScreenreader` (bis 12.09.) kannte nur zwei Gruppen.
   *
   * ── Wie es benutzt wird ─────────────────────────────────────────────────
   *
   * `check` ist die Grundfassung und zugleich der Rückfall. Jeder Eintrag in
   * `fuerProfil` trägt **nur die Felder, die abweichen** - in aller Regel
   * `intro` (der Weg) und `explanation` (die Rückmeldung), selten Frage und
   * Antworten.
   *
   *     check:      { type: "knowledge", intro: "Links oben sitzen …", … }
   *     fuerProfil: fuerGruppeA({ intro: "Cmd+W schliesst das Fenster. …" })
   *     fuerProfil: { ...fuerGruppeA({ intro: "…" }), zoom: { intro: "…" } }
   *
   * Aufgelöst wird mit `checkFuer(skill, wahl)` in `profile.ts`. Die
   * VORRANGREGEL steht dort: erst der Eintrag für GENAU diese Auswahl, sonst
   * `check` - keine Vererbung zwischen Auswahlen. Dieselbe Abweichung für
   * mehrere Auswahlen verteilen `gleicheFassung` und `fuerGruppeA`; wer zu
   * Gruppe A gehört, entscheidet allein `gehoertZuGruppeA` (F5 offen).
   *
   * ⚠️ ADDITIV. Ein Lernschritt ohne dieses Feld verhält sich Zeile für Zeile
   * wie bisher. Es wird Kapitel für Kapitel nachgetragen, nicht auf einmal -
   * und nur dort, wo sich der Stoff wirklich unterscheidet. Für ein Kürzel
   * („Cmd+C drücken") oder ein Konzept („was eine Datei ist") gibt es nichts
   * zu unterscheiden; grob die Hälfte des Bestands braucht das Feld nie.
   *
   * ⚠️ `type` darf NICHT abweichen - ein Lernschritt hat einen Motor, und der
   * gilt für alle Kinder. Der Typ schliesst das aus, ein Wächter hält es fest.
   */
  fuerProfil?: Partial<Record<Fassung, CheckAbweichung>>;
  // Verifikation (Jahres-Selbstprüfung):
  status: "verified" | "unsure" | "deprecated";
  verifiedAgainst?: string; // "Win11-24H2 / M365 / JAWS2027 / NVDA-2026.x"
  verifiedAt?: string;      // ISO-Datum
}

/**
 * Die zwei Werkzeuge zugleich, die es gibt (Kategorie 3): Werkzeug zum Sehen
 * vor dem Screenreader, genau so geschrieben wie in `gueltigeWahlen()`.
 */
export type KombiProfil = "bildschirmlupe+nvda" | "bildschirmlupe+jaws" | "zoom+voiceover";

/**
 * Eine Auswahl, für die ein Lernschritt eine eigene Fassung tragen kann - die
 * neun aus `gueltigeWahlen()` beider Plattformen. Ein Wächter in
 * `computer-zwei-fassungen.test.ts` hält diesen Typ mit `gueltigeWahlen` gleich.
 */
export type Fassung = ToolProfile | KombiProfil;

/**
 * Die Felder, die eine eigene Fassung überschreiben darf - alles ausser `type`.
 * Was nicht gesetzt ist, kommt aus `check`.
 */
export type CheckAbweichung = Partial<Omit<Extract<Check, { type: "knowledge" }>, "type">> &
  Partial<Omit<Extract<Check, { type: "procedure" }>, "type">> &
  Partial<Omit<Extract<Check, { type: "navigation" }>, "type">>;
