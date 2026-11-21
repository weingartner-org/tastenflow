/**
 * im Griff — der Antwort-Prüfer für frei getippte Antworten (Kürzel-Üben, Neubau).
 *
 * ── Warum es ihn gibt ────────────────────────────────────────────────────────
 *
 * Johannes, 25.08.2026: „du musst ein großes Portfolio für jede Antwort haben,
 * wie Kinder das schreiben können: klein, groß, ein ganzer Satz, Abkürzungen,
 * falsch geschrieben, …"
 *
 * Das Kürzel-Üben fragt ab jetzt in BEIDE Richtungen. Die zweite Richtung
 * lautet „Was bewirkt Strg+C?" — und darauf tippt ein neunjähriges Kind an der
 * Braillezeile alles Mögliche:
 *
 *     kopieren · Kopieren · kopiern · kopieren. · KOPIEREN · ich kopiere das
 *     man kopiert den Text · es wird kopiert · kopie · in die zwischenablage
 *     zwischenablage · kopieren ohne zu löschen · coppieren
 *
 * Jede dieser Eingaben ist ein Kind, das die Sache verstanden hat. Würde die
 * App davon auch nur eine als falsch werten, lernte das Kind nicht „Strg+C
 * kopiert", sondern „ich kann es nicht" — und suchte den Fehler bei sich
 * (die schädlichste Rückmeldung überhaupt, siehe `nurErkennen.ts`).
 *
 * ── Die fünf Stufen der Milde ────────────────────────────────────────────────
 *
 * 1. **Groß und klein ist egal**, Satzzeichen auch, ebenso doppelte Leerzeichen.
 * 2. **Umlaute in jeder Schreibweise.** „einfügen" und „einfuegen" sind
 *    dasselbe Wort. (Die Umschrift läuft NUR hier, in der Prüfung der Eingabe;
 *    ausgegeben werden weiterhin ausschließlich echte Umlaute.)
 * 3. **Der ganze Satz zählt so viel wie das eine Wort.** Füllwörter
 *    („ich", „man", „das", „damit", „dann") fallen weg; übrig bleibt der Kern.
 * 4. **Beugung ist egal.** „kopiere", „kopiert", „kopieren" haben denselben
 *    Stamm.
 * 5. **Vertippt ist nicht falsch.** Ein bis zwei Buchstaben Abstand (je nach
 *    Wortlänge) gelten noch als dasselbe Wort. Das Kind bekommt dann die
 *    richtige Schreibweise nebenbei gesagt — als Auskunft, nicht als Tadel.
 *
 * ── Was der Prüfer NICHT tut ─────────────────────────────────────────────────
 *
 * Er rät nicht. Wer die Tastenkombination selbst hinschreibt („strg c"), hat
 * die Frage nicht beantwortet, sondern wiederholt — das bekommt eine eigene,
 * freundliche Antwort statt eines Fehlers. Und wer eine ANDERE Wirkung aus
 * demselben Bereich nennt („einfügen" statt „kopieren"), bekommt gesagt, was
 * er da beschrieben hat. Beides sind Auskünfte über die Sache, nie über das
 * Kind ([[feedback_nie_gegen_das_kind]]).
 *
 * Dieses Modul ist BEWUSST rein: kein React, kein PocketBase, kein Import aus
 * `data.ts`. Erwartungen und Verwechslungskandidaten werden hereingereicht,
 * damit jede Regel als Invariante prüfbar ist (`tests/computer-antwort.test.ts`).
 */

// ── Wortlisten ───────────────────────────────────────────────────────────────

/**
 * Wörter, die ein Kind um seine Antwort herumbaut und die nie etwas über die
 * Sache aussagen. Sie fallen vor dem Vergleich weg, damit „ich kopiere damit
 * den ganzen Text" auf denselben Kern zusammenschnurrt wie „kopieren".
 *
 * Bewusst NICHT in dieser Liste: „nicht" und „kein" — die Verneinung ändert
 * die Aussage und wird eigens geprüft.
 */
const FUELLWOERTER = new Set([
  "ich", "du", "er", "sie", "es", "man", "wir", "mir", "mich", "dir", "dich",
  "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem",
  "einer", "eines",
  "und", "oder", "aber", "dann", "damit", "dazu", "so", "auch", "noch", "schon",
  "wieder", "nur", "ganz", "ganze", "ganzen", "ganzes", "alle", "alles", "allem",
  "etwas", "was", "wie", "wo", "wenn", "dass", "weil", "um", "zu", "zum", "zur",
  "in", "im", "an", "am", "auf", "aus", "bei", "beim", "mit", "nach", "von",
  "vom", "vor", "ueber", "unter", "fuer", "durch", "gegen", "ohne",
  "ist", "sind", "war", "wird", "werden", "wurde", "worden", "hat", "haben",
  "hab", "kann", "kannst", "koennen", "muss", "musst", "soll", "sollen",
  "macht", "machen", "mache", "tut", "tun", "tue", "geht", "gehen", "passiert",
  "bewirkt", "bedeutet", "heisst", "sagt", "gibt", "lasst", "laesst",
  "bitte", "danke", "vielleicht", "eventuell",
  "taste", "tasten", "kombination", "tastenkombination", "kuerzel",
]);

/**
 * Endungen, die beim Stammvergleich abfallen — längste zuerst, damit
 * „markierst" nicht schon bei „t" hängen bleibt. Der Stamm behält immer
 * mindestens `STAMM_MIN` Zeichen, sonst schrumpfte „gehen" auf „g".
 */
const ENDUNGEN = ["endes", "ende", "enden", "eren", "ern", "est", "en", "em", "er", "es", "et", "st", "e", "n", "t", "s"];
const STAMM_MIN = 4;

/**
 * Wortteile, an denen der Prüfer erkennt, dass ein Kind die TASTEN aufgezählt
 * hat statt der Wirkung. Sie stehen hier in der Form NACH der Umschrift
 * (siehe `normalisiere`).
 */
const TASTEN_WOERTER = new Set([
  "strg", "ctrl", "steuerung", "alt", "option", "wahltaste", "umschalt",
  "shift", "cmd", "befehlstaste", "command", "windows", "win", "fn",
  "enter", "eingabe", "entf", "entfernen", "delete", "backspace", "tab",
  "esc", "escape", "leertaste", "leer", "space", "pfeil", "pfeiltaste",
  "bild", "pos1", "ende", "einfg", "einfuegetaste",
]);

/**
 * Wörter, die rund um eine Tastennennung stehen, ohne selbst eine Taste zu
 * sein. „man drückt Strg und C gleichzeitig" ist dieselbe Nicht-Antwort wie
 * „Strg+C" — nur ausgeschrieben.
 */
const TASTEN_UMFELD = new Set([
  "druecken", "drueckt", "druecke", "gedrueckt", "tippen", "tippt", "tippe",
  "halten", "haelt", "gehalten", "gleichzeitig", "zusammen", "plus",
  "betaetigen", "betaetigt",
]);

// ── Normalisierung ───────────────────────────────────────────────────────────

/**
 * Ein Text in die Vergleichsform: klein, ohne Satzzeichen, Umlaute
 * umgeschrieben, Mehrfach-Leerzeichen zusammengezogen.
 *
 * ★ Die Umschrift läuft in Richtung ä → ae und NIE umgekehrt. Andersherum
 *   („ue" → „ü") zerlegte harmlose Wörter: aus „neuer Ordner" würde „nür
 *   Ordner", aus „auswerten" „auswürten". Diese Richtung ist die einzig
 *   gefahrlose — und sie führt beide Schreibweisen des Kindes zusammen.
 */
export function normalisiere(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    // Alles, was kein Buchstabe und keine Ziffer ist, trennt Wörter. Das
    // erledigt Punkte, Kommas, Bindestriche, Klammern und das „+" der
    // Tastenschreibweise in einem Zug.
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Der Wortstamm: Endung ab, aber nie unter `STAMM_MIN` Zeichen. */
export function stamm(wort: string): string {
  for (const e of ENDUNGEN) {
    if (wort.length - e.length >= STAMM_MIN && wort.endsWith(e)) {
      return wort.slice(0, wort.length - e.length);
    }
  }
  return wort;
}

/**
 * Die Wörter einer Eingabe in Vergleichsform: normalisiert, ohne Füllwörter,
 * auf den Stamm gekürzt. Leere Eingabe → leere Liste.
 */
export function kernWoerter(text: string): string[] {
  const roh = normalisiere(text).split(" ").filter(Boolean);
  return roh.filter((w) => !FUELLWOERTER.has(w)).map(stamm);
}

// ── Abstand zweier Wörter ────────────────────────────────────────────────────

/** Levenshtein-Abstand (Einfügen, Löschen, Ersetzen), iterativ und knapp. */
export function abstand(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let vorher = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const jetzt = [i];
    for (let j = 1; j <= b.length; j++) {
      jetzt[j] = Math.min(
        vorher[j] + 1,
        jetzt[j - 1] + 1,
        vorher[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    vorher = jetzt;
  }
  return vorher[b.length];
}

/**
 * Wie viele Buchstaben Abstand noch als „dasselbe Wort, nur vertippt" gelten.
 *
 * Kurze Wörter bekommen keine Toleranz: bei drei Buchstaben ist ein Abstand
 * von eins schon ein anderes Wort („aus" / „auf"). Ab acht Buchstaben sind
 * zwei erlaubt — so viel vertippt sich ein Kind an einer Braillezeile in
 * „unterstreichen" mühelos.
 */
export function erlaubterAbstand(wort: string): number {
  return erlaubterAbstandFuerLaenge(wort.length);
}

/** Dieselbe Treppe, gemessen an einer Länge statt an einem Wort. */
export function erlaubterAbstandFuerLaenge(laenge: number): number {
  // ★ Vier Buchstaben bekommen KEINE Toleranz. Das Kürzen der Endungen macht
  //   aus „suchen" den Stamm „such" und aus „sichern" den Stamm „sich" — bei
  //   einem Buchstaben Milde wären Suchen und Speichern dasselbe Wort, und die
  //   App erklärte einem Kind seine richtige Antwort zur Verwechslung.
  if (laenge <= 4) return 0;
  if (laenge <= 6) return 1;
  return 2;
}

/**
 * Sind zwei Wörter dasselbe Wort?
 *
 * Drei Wege führen dahin, und alle drei werden gebraucht:
 *
 * 1. **Buchstabengleich.**
 * 2. **Der kürzere ist der Anfang des längeren** (ab vier Buchstaben).
 *    Das Kürzen der Endungen (`stamm`) trifft nicht immer dieselbe Stelle:
 *    aus „kopieren" wird „kopi", aus „kopiere" aber „kopier". Ohne diesen Weg
 *    wäre „ich kopiere das" nicht dasselbe wie „kopieren" — und genau so
 *    schreibt ein Kind.
 * 3. **Ein bis zwei Buchstaben Abstand**, gemessen am LÄNGEREN der beiden
 *    Wörter. Am kürzeren gemessen bekäme ein durch das Kürzen geschrumpfter
 *    Stamm weniger Milde als das ausgeschriebene Wort — die Toleranz hinge
 *    dann an unserer Grammatik statt an der Schreibleistung des Kindes.
 */
export function gleichesWort(a: string, b: string): boolean {
  if (a === b) return true;
  const [kurz, lang] = a.length <= b.length ? [a, b] : [b, a];
  if (kurz.length >= 4 && lang.startsWith(kurz)) return true;
  if (lang.length >= 6 && lang.includes(kurz) && kurz.length >= 6) return true;
  return abstand(a, b) <= erlaubterAbstand(lang);
}

/** Kommt `gesucht` in den Wörtern vor — vertippt und gebeugt erlaubt? */
function enthaelt(woerter: string[], gesucht: string): boolean {
  return woerter.some((w) => gleichesWort(w, gesucht));
}

/**
 * Dasselbe für ein SPERRWORT — aber ohne den Weg über den gemeinsamen Anfang.
 *
 * ★ Eine Sperre ist ein Skalpell, keine Sense. Über den Wortanfang verglichen
 *   steckt „Absatz" in „Absatzwechsel", und die Musterantwort „Zeilenumbruch im
 *   selben Absatz" wäre an ihrer eigenen Sperre gescheitert. Für Sperren zählt
 *   darum nur das ganze Wort — vertippt darf es trotzdem sein.
 */
function sperrTreffer(woerter: string[], sperrwort: string): boolean {
  return woerter.some((w) => {
    if (w === sperrwort) return true;
    const laenge = Math.max(w.length, sperrwort.length);
    return abstand(w, sperrwort) <= erlaubterAbstandFuerLaenge(laenge);
  });
}

// ── Erwartungen ──────────────────────────────────────────────────────────────

/**
 * Was auf eine Frage nach der WIRKUNG als richtig gilt.
 *
 * `muster` ist die Schreibweise, die die App zurückmeldet und ansagt (echte
 * Umlaute). `antworten` sind die zugelassenen Formulierungen — jede eine
 * KURZE Wendung, die als Ganzes in der Eingabe stecken muss. Lieber viele
 * kurze Alternativen als eine lange: „in die Zwischenablage legen" verlangte
 * sonst beide Kerne, und das Kind, das nur „Zwischenablage" schreibt, stünde
 * als ahnungslos da.
 */
export interface WirkungErwartung {
  /** Kennung der Wirkung (z. B. "kopieren") — für Verwechslungs-Meldungen. */
  id: string;
  /** Die vorbildliche Antwort, wie die App sie schreibt und ansagt. */
  muster: string;
  /** Zugelassene Formulierungen (roh, werden hier normalisiert). */
  antworten: string[];
  /**
   * Wörter, die die Antwort trotz Treffers ungültig machen — die Nachbarn,
   * mit denen sich diese Wirkung verwechseln lässt.
   *
   * ★ Ohne sie zerfällt die Milde in Beliebigkeit: „suchen und ersetzen"
   * enthält das Wort „suchen" und ginge bei der Frage nach Strg+F als richtig
   * durch, obwohl das Kind gerade die andere Kombination beschreibt. Wer
   * `ersetzen` sperrt, bekommt stattdessen die Verwechslungs-Auskunft.
   */
  sperren?: string[];
}

/** Was der Prüfer über eine Eingabe sagt. */
export type AntwortUrteil =
  /** Nichts eingegeben (oder nur Füllwörter). */
  | { art: "leer" }
  /** Getroffen, Schreibweise sauber. */
  | { art: "richtig" }
  /** Getroffen, aber verschrieben — `muster` ist die richtige Schreibweise. */
  | { art: "richtig-verschrieben"; muster: string }
  /** Das Kind hat die Tastenkombination hingeschrieben statt der Wirkung. */
  | { art: "tasten-statt-wirkung" }
  /** Getroffen, aber eine ANDERE Wirkung aus demselben Bereich. */
  | { art: "verwechselt"; gemeint: string; muster: string }
  /** Verneint („macht NICHT kopieren") — als Antwort nicht verwertbar. */
  | { art: "verneint" }
  /** Nichts davon. */
  | { art: "falsch" };

/**
 * Trifft eine Alternative? Liefert 0 (sauber) oder 1 (nur vertippt getroffen),
 * sonst `null`.
 *
 * ★ Der Rückfall auf die ROHEN Wörter ist für die trennbaren Verben da. „Ich
 *   mache es auf" ist die Antwort eines Kindes, das genau weiß, was Enter tut —
 *   aber „mache" und „auf" sind beides Füllwörter, und nach dem Strippen bliebe
 *   von der Alternative „mache auf" nichts übrig. Wo eine Alternative auf nichts
 *   zusammenschnurrt, wird darum ungestrippt verglichen.
 */
function trefferAbstand(kerne: string[], roh: string[], alternative: string): number | null {
  const gesucht = kernWoerter(alternative);
  const [suchliste, heuhaufen] =
    gesucht.length > 0
      ? [gesucht, kerne]
      : [normalisiere(alternative).split(" ").filter(Boolean), roh];
  if (!suchliste.length) return null;
  let groesster = 0;
  for (const g of suchliste) {
    if (!enthaelt(heuhaufen, g)) return ganzeWoerterVertippt(roh, alternative);
    if (!heuhaufen.some((k) => k === g)) groesster = 1;
  }
  return groesster;
}

/**
 * ★ Testerin 08.11.2026: „copieren" ist ein Schreibfehler, kein falsches Wissen.
 *   Der Stamm („copi" gegen „kopi") hat nur vier Buchstaben und bekommt darum
 *   keine Toleranz - das ganze Wort hat acht. Scheitert der Stamm-Vergleich,
 *   werden darum die UNGEKÜRZTEN Wörter verglichen, mit derselben Treppe.
 *   Trifft das, ist es höchstens „verschrieben" (1), nie sauber (0).
 *   Nur Buchstabenabstand, kein „steckt im längeren Wort": sonst ginge
 *   „hineinkopieren" als „kopieren" durch (Wächter D6.1).
 */
function ganzeWoerterVertippt(roh: string[], alternative: string): 1 | null {
  const gesucht = normalisiere(alternative)
    .split(" ")
    .filter((w) => w && !FUELLWOERTER.has(w));
  if (!gesucht.length) return null;
  return gesucht.every((g) => sperrTreffer(roh, g)) ? 1 : null;
}

/**
 * Prüft eine frei getippte Antwort auf die Frage „Was bewirkt diese
 * Tastenkombination?".
 *
 * @param eingabe   was das Kind getippt hat
 * @param erwartung die richtige Wirkung
 * @param andere    die übrigen Wirkungen desselben Übungs-Bereichs; wird eine
 *                  davon erkannt, sagt die App, WAS das Kind beschrieben hat,
 *                  statt bloß „falsch"
 * @param angabeTasten die Kombination, die in der ANGABE steht (z. B. „Strg+C").
 *                  Wer sie abschreibt, hat die Frage gelesen, nicht beantwortet —
 *                  siehe `folge()`.
 */
export function pruefeAntwort(
  eingabe: string,
  erwartung: WirkungErwartung,
  andere: WirkungErwartung[] = [],
  angabeTasten?: string,
): AntwortUrteil {
  const roh = normalisiere(eingabe).split(" ").filter(Boolean);
  if (!roh.length) return { art: "leer" };
  const kerne = kernWoerter(eingabe);

  // Zuerst die richtige Wirkung — sie gewinnt auch dann, wenn zusätzlich eine
  // andere anklingt („kopieren, nicht ausschneiden" ist eine richtige Antwort).
  const treffer = besterTreffer(kerne, roh, erwartung);
  if (treffer !== null) {
    if (istVerneint(roh, erwartung, kerne)) return { art: "verneint" };
    return treffer > 0
      ? { art: "richtig-verschrieben", muster: erwartung.muster }
      : { art: "richtig" };
  }

  // ── Die Kombination aus der Angabe abgeschrieben? ─────────────────────────
  // Zwei Wege dorthin, und der erste ist der genaue: Steht die gesuchte
  // Kombination in der Angabe, wird auf genau sie geprüft. „ich drücke Strg
  // und C" fällt damit ebenso auf wie „Strg+C".
  if (angabeTasten) {
    const teile = normalisiere(angabeTasten).split(" ").filter(Boolean);
    if (teile.length > 0 && teile.every((t) => roh.includes(t))) {
      return { art: "tasten-statt-wirkung" };
    }
  }
  // Der zweite Weg gilt auch ohne Angabe: Es steht nichts als Tastennamen da.
  const nurTasten =
    roh.some((w) => TASTEN_WOERTER.has(w) || /^[a-z]$/.test(w) || /^f\d{1,2}$/.test(w)) &&
    roh.every(
      (w) =>
        TASTEN_WOERTER.has(w) ||
        TASTEN_UMFELD.has(w) ||
        FUELLWOERTER.has(w) ||
        /^[a-z0-9]$/.test(w) ||
        /^f\d{1,2}$/.test(w),
    );
  if (nurTasten) return { art: "tasten-statt-wirkung" };

  // Eine andere Wirkung aus demselben Bereich? Es gewinnt der SAUBERE Treffer
  // vor dem bloß vertippten — sonst nennt die Auskunft den erstbesten Nachbarn
  // der Liste statt den, den das Kind wirklich beschrieben hat.
  let nachbar: { muster: string; guete: number } | null = null;
  for (const a of andere) {
    if (a.id === erwartung.id) continue;
    const t = besterTreffer(kerne, roh, a);
    if (t === null) continue;
    if (!nachbar || t < nachbar.guete) nachbar = { muster: a.muster, guete: t };
    if (t === 0) break;
  }
  if (nachbar) {
    return { art: "verwechselt", gemeint: nachbar.muster, muster: erwartung.muster };
  }

  return { art: "falsch" };
}

/** Der beste Alternativen-Treffer einer Erwartung (0 = sauber, 1 = vertippt). */
function besterTreffer(
  kerne: string[],
  roh: string[],
  erwartung: WirkungErwartung,
): number | null {
  // ★ Sperren werden gegen die ROHEN Wörter geprüft, nicht gegen die Kerne.
  //   „speichern UNTER" ist der Nachbar von „speichern" — und „unter" ist ein
  //   Füllwort. Gegen die gestrippten Kerne geprüft, wäre die Sperre still
  //   verschwunden und „speichern unter" ginge als „Speichern" durch.
  // ★ Eine mehrwortige Sperre muss GANZ vorkommen. Wort für Wort geprüft,
  //   hätte „Überschrift 2" schon bei „Überschrift 1 zuweisen" zugeschlagen —
  //   die richtige Antwort wäre an ihrer eigenen Sperre gescheitert.
  for (const sperre of erwartung.sperren ?? []) {
    const teile = normalisiere(sperre).split(" ").filter(Boolean);
    if (teile.length > 0 && teile.every((t) => sperrTreffer(roh, t))) return null;
  }
  let bester: number | null = null;
  for (const alt of erwartung.antworten) {
    const t = trefferAbstand(kerne, roh, alt);
    if (t === null) continue;
    if (t === 0) return 0;
    bester = bester === null ? t : Math.min(bester, t);
  }
  return bester;
}

/**
 * Steht direkt vor dem Treffer eine Verneinung? „das kopiert nicht" ist keine
 * Antwort auf „Was bewirkt Strg+C?" — und darf nicht als richtig durchgehen,
 * bloß weil das Wort „kopieren" darin vorkommt.
 *
 * Geprüft wird bewusst eng: nur „nicht" und „kein…" im selben Satz, und nur,
 * wenn die Eingabe kurz ist. Bei längeren Sätzen („kopieren, aber der Text
 * wird nicht gelöscht") ist die Verneinung fast immer eine richtige
 * Zusatzerklärung — und die soll nichts kaputt machen.
 */
function istVerneint(roh: string[], _erwartung: WirkungErwartung, kerne: string[]): boolean {
  if (kerne.length > 3) return false;
  return roh.some((w) => w === "nicht" || w === "kein" || w === "keine" || w === "nichts");
}


// ── Was aus einem Urteil folgt ───────────────────────────────────────────────

/**
 * Die Folge eines Urteils für die Übung — die EINE Stelle, an der steht, was
 * eine Antwort auslöst.
 *
 *  · `weiter`  — die Aufgabe ist erledigt, das Atom bekommt einen Treffer.
 *  · `fehler`  — falsch beantwortet: das Atom fällt zurück und kommt nach
 *                drei bis fünf anderen Elementen wieder (Rückkehr-Regel).
 *  · `nochmal` — KEINE Antwort auf die gestellte Frage. Nichts wird verbucht,
 *                nichts geht weiter, das Kind schreibt noch einmal.
 */
export type AntwortFolge = "weiter" | "fehler" | "nochmal";

/**
 * ★★ Johannes, 25.08.2026: „wer Text schreiben soll und die in der Angabe
 * formulierte Tastenkombination eintippt, soll nicht weiterkommen — nicht
 * falsch, aber auch nicht das, was gefragt war."
 *
 * Die Frage lautet „Was bewirkt Strg+C?"; die Kombination steht in der Angabe.
 * Wer sie abschreibt, hat sie gelesen, nicht beantwortet — genau derselbe
 * Kurzschluss, wegen dem das Kürzel-Üben neu gebaut wird (die Lösung stand
 * früher die ganze Zeit oben am Blatt).
 *
 * Als Fehler zu verbuchen wäre trotzdem verkehrt: Das Kind hat nichts falsch
 * verstanden, es hat die Frage nicht getroffen. Ein Fehler würde sein
 * Gedächtnis-Ranking nach unten ziehen für etwas, das es vielleicht längst
 * weiß ([[feedback_nie_gegen_das_kind]]). Also: weder Treffer noch Fehler,
 * die Aufgabe bleibt stehen.
 *
 * Dasselbe gilt für die leere Eingabe und für die Verneinung („es kopiert
 * nicht") — beides sind Nicht-Antworten, keine falschen Antworten.
 */
export function folge(urteil: AntwortUrteil): AntwortFolge {
  switch (urteil.art) {
    case "richtig":
    case "richtig-verschrieben":
      return "weiter";
    case "verwechselt":
    case "falsch":
      return "fehler";
    case "tasten-statt-wirkung":
    case "leer":
    case "verneint":
      return "nochmal";
  }
}
