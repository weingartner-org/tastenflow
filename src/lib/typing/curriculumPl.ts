/**
 * ★★★ DIE LEKTIONEN DES WEGES „pl" (PL-W, 09.10.2026).
 *
 * Vorbild: `curriculumIt.ts` (Bauart, Griffe aus den Daten) und `curriculumEs.ts`. Neu auf Polnisch geschrieben, nichts übersetzt
 * (Johannes: *„keine texte werden übersetzt, Texte aus den regionen, altersgemäß und zeitgemäß"*). Kinder und Selbstlernende
 * werden geduzt (Glossar Regel 1: Ty-Befehlsform, `naciśnij`, `przytrzymaj`, `połóż`); kein Geschlecht der tippenden Person
 * (kein `sam`, kein `-łeś/-łaś`), keine Anrede Pan/Pani. Begriffe aus `recherche-polnisch-2026-10-02/GLOSSAR-pl.md` §2.1 und
 * §2.9: rząd podstawowy, pozycja podstawowa, wypustki na F i J, palec wskazujący, kciuk, spacja, Shift (drugą ręką), prawy Alt
 * (AltGr; am Mac Option), klawisz martwy. Tastenwege statt Maus (`naciśnij`, `przytrzymaj`, nie `kliknij`); Beispielwörter in
 * geraden Anführungszeichen (die Übungstexte kennen nur das gerade `"`, Glossar Regel 8).
 *
 * ── DIE REGEL, AN DER ALLES HÄNGT (wie `curriculumIt.ts`/`curriculumEs.ts`) ─────────────────────
 * Jede Lektion führt NUR Tasten ein, die in der Reihenfolge des Weges (`lernweg.ts#PL_LETTER_ORDER`, Befund F4-pl) bis dahin
 * dran sind: Die Tasten aller Lektionen hintereinander SIND `introOrder("pl")` - auf jeder Tastatur. Wächter:
 * `tests/tastenflow-lektionen-pl.test.ts`.
 *
 * ── EINE TASTATUR, DREI FUSSNOTEN ────────────────────────────────────────────────────────────────
 * Polnisch hat EINE Pflicht-Tastatur: `pl` (Windows „Polski (programisty)", Mac „Polish - Pro"; US-Belegung, ANSI). Die neun
 * polnischen Buchstaben sind je ein AltGr-Griff (Mac: Option), `ź` auf `x`. Darum gibt es keine Tastatur-Unterschiede im Text
 * wie bei `it`/`it-qzerty`; der Text nennt „prawy Alt (na Macu: Option)". Auf anderer Hardware (deutsch, Schweiz, …) fehlen die
 * polnischen Buchstaben (`onlyExistingKeys`); die Lektionen folgen dort derselben Regel wie `curriculumIt.ts#tastenJeLektion`:
 * eine Einheit, die der Plan nicht kennt (`ö` als achte Grundtaste), kommt in die laufende Lektion. Die IDs bleiben gleich.
 *
 * ── WAS GERECHNET IST UND WAS GESCHRIEBEN ────────────────────────────────────────────────────────
 * Geschrieben: Titel und der erste Absatz (was die Lektion bringt, Beispielwörter). Gerechnet: die GRIFFE - Finger, Reihe, Lage
 * zur Grundstellung, Shift/prawy Alt - aus den Daten der Tastatur (`layouts.ts`). Ein Griff, den die Tastatur nicht kennt, wird
 * nicht geraten. Die Fingernamen stehen im Nominativ nach dem Doppelpunkt („lewy środkowy"), damit nichts gebeugt werden muss
 * (Glossar Regel 11); Tastennamen nach „klawisza"/„klawiszem" bleiben ungebeugt („od klawisza D").
 *
 * ⚠️ `ń` (prawy Alt + N) startet unter Windows mit NVDA-Standardinstallation NVDA (Ctrl + Alt + N) und ist dort nicht tippbar
 * (Befund F4-pl §8, Falle 67): die Lektion `pl-o-n-ogonek` sagt es ausdrücklich, ohne die Lösung zu raten. Die grossen polnischen
 * Buchstaben (Ą Ć Ę Ł Ń Ó Ś Ź Ż) sind ein Dreiergriff und kommen erst mit der letzten Buchstaben-Einheit (`grossAkzentAb: "q"`);
 * die Schlusslektion erklärt ihn. Kein Beispielwort einer Lektion trägt einen (Wächter).
 */
import type { Lesson, LessonKind } from "./curriculum";
import { SHIFT_UNIT, achteGrundtasteFuerLayout } from "./letters";
import { lernwegDef } from "./lernweg";
import { layoutById, layoutIndex, type KeyboardLayout, type LayoutId } from "./layouts";
import { FINGERS, fingerName, type FingerId } from "./fingers";
// ★ G2b-1: Gross-/Klein ausdrücklich in der Sprache dieser Lektionen ("pl").
import { grossFuer, kleinFuer } from "./sprachRegister";

interface PlLektionsBauplan {
  id: string;
  kind: LessonKind;
  /** Die neuen Einheiten in der Folge der Bezugstastatur `pl`, genau in der Reihenfolge des Weges. */
  einheiten: readonly string[];
  enablesShift?: boolean;
  corpusKinds?: Lesson["corpusKinds"];
  /** Der Titel aus den Tasten, die auf DIESER Tastatur ankommen. */
  titel: (tasten: readonly string[], layout: KeyboardLayout) => string;
  /** Der geschriebene erste Absatz (was die Lektion bringt, Beispielwörter) - aus den Tasten dieser Tastatur. */
  vorspann: (tasten: readonly string[]) => string;
  /** Statt der gerechneten Griffe ein eigener Teil (Shift, Ziffern, Schluss). */
  griffe?: (tasten: readonly string[], layout: KeyboardLayout) => string;
}

// ── Tastennamen ───────────────────────────────────────────────────────────────

/** Der Name der dritten Ebene: unter Windows „prawy Alt" (auch wo die Kappe „Alt Gr" trägt), am Mac „Option" (Glossar §2.9). */
const PRAWY_ALT = "prawy Alt (na Macu: Option)";

/** Buchstaben a-z gross (wie auf der Kappe); polnische Buchstaben bleiben klein - sie stehen auf keiner Kappe. */
function kappe(k: string): string {
  return /^[a-z]$/.test(k) ? grossFuer(k, "pl") : k;
}

/** Satz- und Sonderzeichen haben im Satz einen NAMEN vor dem Zeichen (Glossar §2.8, `SPOKEN_PL`). */
const ZEICHEN_NAMEN_PL: Readonly<Record<string, string>> = {
  ".": "kropka", ",": "przecinek", ";": "średnik", ":": "dwukropek", "?": "znak zapytania", "!": "wykrzyknik",
  "'": "apostrof", '"': "cudzysłów", "-": "łącznik", "(": "lewy nawias", ")": "prawy nawias",
  "[": "lewy nawias kwadratowy", "]": "prawy nawias kwadratowy", "{": "lewy nawias klamrowy", "}": "prawy nawias klamrowy",
  "%": "procent", "&": "ampersand", "/": "ukośnik", "+": "plus", "*": "gwiazdka", "=": "równa się", _: "podkreślnik",
  "<": "mniejsze", ">": "większe", $: "dolar", "|": "kreska pionowa", "\\": "ukośnik wsteczny", "@": "małpa",
  "#": "krzyżyk", "^": "daszek", "€": "euro",
};

/** Das Zeichen im Satz: in geraden Anführungszeichen, das Anführungszeichen selbst in Klammern. */
function zeichenZeigen(u: string): string {
  return u === '"' ? `(")` : `"${u}"`;
}

/** Die Taste so, wie man sie nach „klawisza"/„klawiszem" nennt: Buchstaben und Ziffern wie auf der Kappe, Zeichen beim Namen. */
function klawiszNazwa(k: string): string {
  if (/^[\p{L}\p{N}]$/u.test(k)) return kappe(k);
  return ZEICHEN_NAMEN_PL[k] ?? k;
}

/** Der Anfang eines Griff-Satzes: „Klawisz F", „Litera ę", „Cyfra 5", „Kropka (.)". */
function satzAnfang(u: string): string {
  if (/^[a-z]$/.test(u)) return `Klawisz ${kappe(u)}`;
  if (/^\p{L}$/u.test(u)) return `Litera ${u}`;
  if (/^[0-9]$/.test(u)) return `Cyfra ${u}`;
  const name = ZEICHEN_NAMEN_PL[u];
  if (!name) return `Znak ${u}`;
  return `${grossFuer(name.charAt(0), "pl")}${name.slice(1)} ${zeichenZeigen(u)}`;
}

/** „F i J", „C, Y i R", „X, ź, V i Q". */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} i ${teile[teile.length - 1]}`;
}

function kappen(tasten: readonly string[]): string {
  return aufzaehlen(tasten.map(kappe));
}

// ── Die Folge des Weges auf einer Tastatur ───────────────────────────────────

/** Die Reihenfolge des Weges „pl" auf dieser Tastatur (wie `introOrder`, aber für ein beliebiges Layout). */
function reihenfolgeAuf(layout: KeyboardLayout): string[] {
  const fehlt = layoutIndex(layout).missing;
  const vorhanden = lernwegDef("pl").introOrder.filter((u) => !fehlt.has(kleinFuer(u, "pl")));
  return achteGrundtasteFuerLayout(vorhanden, "pl", layout.id);
}

// ── Griffe aus den Daten der Tastatur ────────────────────────────────────────

const RZEDY = ["w rzędzie cyfr", "w rzędzie górnym", "w rzędzie podstawowym", "w rzędzie dolnym"];

function platz(layout: KeyboardLayout, taste: string): { reihe: number; spalte: number } | null {
  for (let r = 0; r < layout.rows.length; r++) {
    const s = layout.rows[r].keys.indexOf(taste);
    if (s >= 0) return { reihe: r, spalte: s };
  }
  return null;
}

/**
 * Finger → seine Taste in der Grundstellung auf DIESER Tastatur: die Heimtasten des Weges (`a s d f j k l ; ö`), soweit sie hier
 * in der Grundreihe liegen.
 */
function heimTasten(layout: KeyboardLayout): ReadonlyMap<FingerId, string> {
  const m = new Map<FingerId, string>();
  for (const k of lernwegDef("pl").homeKeys) {
    const f = layoutIndex(layout).finger.get(k);
    const p = platz(layout, k);
    if (f && p && p.reihe === 2) m.set(f, k);
  }
  return m;
}

/** Die Spalte in der Zählung der Grundreihe (Ziffernreihe und ISO-Unterreihe beginnen eine Taste weiter links). */
function grundreihenSpalte(layout: KeyboardLayout, reihe: number, spalte: number): number {
  if (reihe === 0) return spalte - 1;
  if (reihe === 3 && layout.rows[3].keys.length === 11) return spalte - 1;
  return spalte;
}

/** „o dwa klawisze", „o jeden klawisz" - der Abstand zur Heimtaste (bis vier, weiter wird nicht gezählt). */
function oKlawisze(abstand: number): string {
  if (abstand <= 0) return "";
  if (abstand === 1) return "o jeden klawisz ";
  if (abstand <= 4) return `o ${abstand === 2 ? "dwa" : abstand === 3 ? "trzy" : "cztery"} klawisze `;
  return "daleko ";
}

/** „lewy środkowy, w rzędzie górnym, nad klawiszem D" - Finger und Lage einer Taste. */
function lage(layout: KeyboardLayout, taste: string): string | null {
  const p = platz(layout, taste);
  const fingerId = layoutIndex(layout).finger.get(taste);
  if (!p || !fingerId || fingerId === "daumen") return null;
  const finger = fingerName(FINGERS[fingerId], "pl");
  const h = heimTasten(layout).get(fingerId);
  const hp = h ? platz(layout, h) : null;
  if (!h || !hp) return `${finger}, ${RZEDY[p.reihe]}`;
  const H = klawiszNazwa(h);
  const s = grundreihenSpalte(layout, p.reihe, p.spalte);
  const abstand = Math.abs(s - hp.spalte);
  const richtung = s < hp.spalte ? "na lewo" : "na prawo";
  if (p.reihe === 2) {
    return taste === h ? `${finger}, w pozycji podstawowej` : `${finger}, ${oKlawisze(abstand)}${richtung} od klawisza ${H}`;
  }
  // Das Feld über oder unter der Heimtaste ist der Bezugspunkt; ein seitlicher Abstand wird von DORT gezählt.
  const miejsce = p.reihe === 3 ? `pod klawiszem ${H}` : p.reihe === 0 ? `dwa rzędy nad klawiszem ${H}` : `nad klawiszem ${H}`;
  if (abstand === 0) return `${finger}, ${RZEDY[p.reihe]}, ${miejsce}`;
  return `${finger}, ${RZEDY[p.reihe]}, ${oKlawisze(abstand)}${richtung} od miejsca ${miejsce}`;
}

/** Ein Satz: wie wird diese Einheit auf dieser Tastatur getippt? */
function griffSatz(layout: KeyboardLayout, u: string): string {
  const zugang = layout.access[u];
  const anfang = satzAnfang(u);
  if (zugang?.dead) {
    const wo = lage(layout, zugang.base);
    const martwy = "To klawisz martwy: sam nic nie wpisuje, dodaje swój znak do litery, którą naciśniesz zaraz po nim.";
    if (zugang.base === u && !zugang.mod) return `${anfang}: ${wo ?? "osobny klawisz"}. ${martwy}`;
    const mod =
      zugang.mod === "shift"
        ? "przytrzymaj Shift drugą ręką i naciśnij "
        : zugang.mod === "altgr"
          ? `przytrzymaj ${PRAWY_ALT} i naciśnij `
          : "naciśnij ";
    return `${anfang}: ${mod}klawisz ${klawiszNazwa(zugang.base)}${wo ? ` (${wo})` : ""}. ${martwy}`;
  }
  if (zugang?.mod) {
    const wo = lage(layout, zugang.base);
    const klawisz = `klawisz ${klawiszNazwa(zugang.base)}${wo ? ` (${wo})` : ""}`;
    if (zugang.mod === "shift") return `${anfang}: przytrzymaj Shift drugą ręką i naciśnij ${klawisz}.`;
    const kciuk = zugang.buchstabe ? " prawym kciukiem" : "";
    return `${anfang}: przytrzymaj ${PRAWY_ALT}${kciuk} i naciśnij ${klawisz}.`;
  }
  const wo = lage(layout, u);
  if (wo) return `${anfang}: ${wo}.`;
  // Nicht geraten: Die Daten dieser Tastatur zeigen keinen Griff.
  return `${anfang}: tego chwytu nie opisano dla tej klawiatury.`;
}

function griffeGerechnet(tasten: readonly string[], layout: KeyboardLayout): string {
  return tasten.map((u) => griffSatz(layout, u)).join(" ");
}

// ── Die Sonderteile ──────────────────────────────────────────────────────────

function shiftTeil(): string {
  return (
    "Wielką literę piszesz, przytrzymując Shift drugą ręką: litera z lewej połowy klawiatury wymaga prawego Shift, " +
    "litera z prawej połowy - lewego. Zajmują się tym małe palce. Liczy się tylko Shift drugiej ręki."
  );
}

function ziffernTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const cyfry = "1234567890".split("");
  if (cyfry.every((z) => layout.access[z]?.mod === "shift")) {
    const pary = cyfry.map((z) => `${z} = Shift + ${klawiszNazwa(layout.access[z].base)}`).join(", ");
    return (
      "Na twojej klawiaturze cyfry są w rzędzie cyfr, ale pisze się je razem z Shift drugiej ręki: bez Shift te klawisze " +
      `wpisują inne znaki. ${pary}. Każdy palec zostaje w swojej kolumnie.`
    );
  }
  const jeden = lage(layout, "1");
  return (
    "Na twojej klawiaturze cyfry pisze się bez Shift. Każdy palec sięga w górę w swojej kolumnie do rzędu cyfr: " +
    `1 2 3 4 5 lewą ręką, 6 7 8 9 0 prawą${jeden ? ` (1: ${jeden})` : ""}.`
  );
}

/**
 * Die Schlusslektion: der Dreiergriff der grossen polnischen Buchstaben (prawy Alt + Shift drugą ręką + Buchstabe; Mac Option +
 * Shift). Eine andere Tastatur ohne diese Buchstaben: nichts behauptet.
 */
function grosseBuchstabenTeil(_t: readonly string[], layout: KeyboardLayout): string {
  if (!layout.access["ą"]) return "";
  return (
    "Wielkie polskie litery (Ą Ć Ę Ł Ń Ó Ś Ź Ż) to trzy klawisze naraz: " +
    `${PRAWY_ALT} prawym kciukiem, Shift drugą ręką i litera. To najtrudniejszy chwyt, dlatego Tastenflow zaczyna od niego ` +
    "dopiero teraz. Zdanie, które zaczyna się od takiej litery, ćwiczysz najpierw powoli."
  );
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const RZAD = (t: readonly string[]) => `Rząd podstawowy: ${kappen(t)}`;
const stale = (tekst: string) => () => tekst;

const BAUPLAENE: readonly PlLektionsBauplan[] = [
  {
    id: "pl-podstawowy-1", kind: "home", einheiten: ["f", "j"], titel: RZAD,
    vorspann: stale(
      "Połóż palce na rzędzie podstawowym: to pozycja podstawowa. Małe wypustki na klawiszach F i J pomagają ją znaleźć " +
        "bez patrzenia na klawiaturę. Zaczynamy od tych dwóch klawiszy, dwoma palcami wskazującymi. Z tego miejsca każdy " +
        "palec rusza i po każdym klawiszu tu wraca.",
    ),
  },
  {
    id: "pl-podstawowy-2", kind: "home", einheiten: ["d", "k"], titel: RZAD,
    vorspann: stale("Do palców wskazujących dołączają środkowe: D po lewej, K po prawej. Palce wskazujące zostają na wypustkach."),
  },
  {
    id: "pl-podstawowy-3", kind: "home", einheiten: ["s", "l"], titel: RZAD,
    vorspann: stale("Teraz palce serdeczne: S po lewej, L po prawej. Palce zostają miękkie i lekkie."),
  },
  {
    id: "pl-podstawowy-4", kind: "home", einheiten: ["a", ";"],
    titel: (t) => `Pełny rząd podstawowy: ${kappen(t.map((u) => (u === ";" ? "średnik" : u)))}`,
    vorspann: (t) => {
      const osma = t.find((u) => u !== "a");
      const poczatek =
        "Lewy mały palec ląduje na A" +
        (osma ? `, prawy mały na klawiszu ${klawiszNazwa(osma)}` : "") +
        ". Teraz rząd podstawowy jest pełny: osiem palców na ośmiu klawiszach, a kciuki na spacji. Spację naciskasz kciukiem.";
      return `${poczatek} Pojawiają się pierwsze słowa: "las", "sad", "sala", "kask", "fala" i "dla".`;
    },
  },
  {
    id: "pl-czeste-1", kind: "letters", einheiten: ["w", "o"],
    titel: (t) => `Najczęstsze litery: ${kappen(t)}`,
    vorspann: stale('Z W i O napiszesz "woda", "kawa", "sowa", "owad", "sofa" i "kask".'),
  },
  {
    id: "pl-czeste-2", kind: "letters", einheiten: ["n", "t"],
    titel: (t) => `Najczęstsze litery: ${kappen(t)}`,
    vorspann: stale('Z N i T dochodzą "tak", "nos", "okno", "lato", "stan", "kotwa" i "wanna".'),
  },
  {
    id: "pl-czeste-3", kind: "letters", einheiten: ["e", "i"],
    titel: (t) => `Najczęstsze litery: ${kappen(t)}`,
    vorspann: stale(
      'E i I należą do najczęstszych liter w polskich słowach. Z nimi napiszesz "nie", "ten", "jest", "tenis", "kino", ' +
        '"fotel" i "silnik".',
    ),
  },
  {
    id: "pl-czeste-4", kind: "letters", einheiten: ["m", "z"],
    titel: (t) => `Najczęstsze litery: ${kappen(t)}`,
    vorspann: stale('Z M i Z powstają "mama", "zima", "zamek", "mleko", "miasto", "most" i "zmiana".'),
  },
  {
    id: "pl-e-ogonek", kind: "letters", einheiten: ["ę"],
    titel: () => "Pierwsza polska litera: ę",
    vorspann: stale(
      "Na klawiszu E stoi tylko E: polskie litery ze znaczkami - ogonkiem, kreską albo kropką - powstają z prawym Alt " +
        '(AltGr), który naciskasz prawym kciukiem, razem z literą podstawową. Zaczynamy od ę. Dzięki niej napiszesz "się", "idę", "mięso", "dzięki" i "wędka".',
    ),
  },
  {
    id: "pl-cy", kind: "letters", einheiten: ["c", "y"],
    titel: (t) => `Kolejne litery: ${kappen(t)}`,
    vorspann: stale(
      'Z C i Y napiszesz "czas", "cena", "owca", "ocean", "dzieci", "dym", "lody", "tylko" i "syn". Litery "cz", "dz" i "sz" ' +
        "czytamy jak jeden dźwięk, ale piszesz je osobno, jedną po drugiej.",
    ),
  },
  {
    id: "pl-rpu", kind: "letters", einheiten: ["r", "p", "u"],
    titel: (t) => `Pierwsze pełne zdania: ${kappen(t)}`,
    vorspann: (t) =>
      `Z ${kappen(t)} napiszesz już całe zdania, na przykład "to jest rower", i wiele nowych słów: "rower", "park", "pies", ` +
      '"rzeka", "morze", "ulica", "jutro", "plecak", "zupa" i "pusty". Dwie litery "rz" czytamy jak jeden dźwięk, ale piszesz ' +
      "je osobno: R, potem Z.",
  },
  {
    id: "pl-shift", kind: "shift", einheiten: [], enablesShift: true,
    titel: () => "Wielkie litery z klawiszem Shift",
    vorspann: stale(
      "Dotąd wielkie litery stawiał za ciebie program. Od tej lekcji piszą je twoje palce: " +
        '"Ania", "Marek", "Zosia", "Polska", "Warszawa", "Mazury", "Zakopane", "Sopot" i "Tatry".',
    ),
    griffe: shiftTeil,
  },
  // ★ D-1 (Didaktik-Synthese 28.09.2026, gilt für jeden Weg): Punkt und Komma direkt nach Shift.
  {
    id: "pl-kropka-przecinek", kind: "punctuation", einheiten: [".", ","],
    titel: () => "Kropka i przecinek: . ,",
    vorspann: stale(
      "Zdanie zaczyna się wielką literą i kończy kropką. Przecinek dzieli zdanie na części. Po kropce i po przecinku jest " +
        "spacja, przed nimi - nie.",
    ),
  },
  {
    id: "pl-l-b", kind: "letters", einheiten: ["ł", "b"],
    titel: (t) => `Kolejne litery: ${kappen(t)}`,
    vorspann: stale(
      'Litera ł jest w polskich słowach bardzo częsta: "słowo", "szkoła", "ławka", "mydło", "biały". Z B napiszesz ' +
        '"bułka", "bilet", "burza", "dobry" i "kubek".',
    ),
  },
  {
    id: "pl-g-z-kropka", kind: "letters", einheiten: ["g", "ż"],
    titel: (t) => `Kolejne litery: ${kappen(t)}`,
    vorspann: stale(
      'G to zwykła litera, a ż powstaje z prawym Alt i Z. Napiszesz "gra", "droga", "noga", "gitara", "jagoda", "żaba", ' +
        '"żagiel", "życie", "żurek" i "jeż". Pamiętaj: "ż" i "rz" brzmią tak samo, ale piszą się inaczej.',
    ),
  },
  {
    id: "pl-a-s-ogonek", kind: "letters", einheiten: ["ą", "ś"],
    titel: (t) => `Kolejne polskie litery: ${kappen(t)}`,
    vorspann: stale(
      'Ą i ś powstają z prawym Alt oraz A i S: "łąka", "mąka", "ząb", "dąb", "kąt", "świat", "śnieg", "ślad", "ślimak" i ' +
        '"wieś".',
    ),
  },
  {
    id: "pl-c-h", kind: "letters", einheiten: ["ć", "h"],
    titel: (t) => `Kolejne litery: ${kappen(t)}`,
    vorspann: stale(
      'Ć powstaje z prawym Alt i C, H to zwykła litera. Napiszesz "kość", "gość", "pięć", "cześć", "lecieć", "hala", ' +
        '"chata", "chleb", "echo" i "cichy". Pamiętaj: "ch" i "h" brzmią tak samo.',
    ),
  },
  {
    id: "pl-o-n-ogonek", kind: "letters", einheiten: ["ó", "ń"],
    titel: (t) => `Ostatnie polskie litery: ${kappen(t)}`,
    vorspann: stale(
      'Ó i ń powstają z prawym Alt oraz O i N: "góra", "mróz", "róża", "ogród", "córka", "koń", "dzień", "jeleń", "słoń" ' +
        'i "kamień". Pamiętaj: "ó" i "u" brzmią tak samo, ale piszą się inaczej. Uwaga dla Windows z czytnikiem ekranu NVDA: ' +
        "prawy Alt + N bywa zajęty przez NVDA (Ctrl + Alt + N) i wtedy nie wpisze ń. Zapytaj osobę prowadzącą klasę, jak to obejść.",
    ),
  },
  {
    id: "pl-xzvq", kind: "letters", einheiten: ["x", "ź", "v", "q"],
    titel: (t) => `Litery z obcych słów: ${kappen(t)}`,
    vorspann: stale(
      "Na koniec litery, które w polskich słowach prawie nie występują: x, v i q pojawiają się głównie w słowach obcych, " +
        'a ź powstaje z prawym Alt i X. Napiszesz "taxi", "mix", "quiz", "avatar", "źródło", "łabędź", "dźwięk" i "łódź". ' +
        "Masz teraz cały polski alfabet.",
    ),
  },
  {
    id: "pl-pytanie", kind: "punctuation", einheiten: ["?", "!", "-", '"', ":", "(", ")", "'"],
    titel: (t) => `Pozostałe znaki: ${t.join(" ")}`,
    vorspann: stale(
      'Znak zapytania kończy pytanie, wykrzyknik - okrzyk: "Jak się masz?" i "Uwaga!". Przed nimi i przed dwukropkiem nie ' +
        'ma spacji. Łącznik łączy części słowa, na przykład "biało-czerwony". Cudzysłów otwiera i zamyka cudze słowa, ' +
        'dwukropek zapowiada wyliczenie, nawias dopowiada coś w zdaniu, a apostrof stoi w nazwiskach, jak "Braille\'a".',
    ),
  },
  {
    id: "pl-cyfry", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Rząd cyfr",
    vorspann: stale(
      "Daty, godziny, ceny i wyniki: teraz cyfry. W Polsce ułamki zapisuje się z przecinkiem, jak w \"2,50\", a liczby od " +
        'pięciu cyfr dzieli się spacją, na przykład "12 345".',
    ),
    griffe: ziffernTeil,
  },
  {
    id: "pl-symbole-1", kind: "symbols", einheiten: ["%", "&", "/", "+", "*", "=", "_", "<", ">", "$"],
    titel: (t) => `Symbole: ${t.join(" ")}`,
    vorspann: stale(
      "Te znaki służą do rachunków, do procentów i do pracy na komputerze. Daj sobie czas: tu dokładność jest ważniejsza " +
        "niż szybkość.",
    ),
  },
  {
    id: "pl-symbole-2", kind: "symbols", einheiten: ["|", "\\", "@", "#", "^", "[", "]", "{", "}", "€"],
    titel: (t) => `Kolejne symbole: ${t.join(" ")}`,
    vorspann: stale(
      "Znaki z adresów e-mail, z cen i z kodu programu. To najtrudniejsze znaki na klawiaturze, dlatego są na końcu.",
    ),
  },
  {
    id: "pl-teksty", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Wielkie polskie litery i teksty",
    vorspann: stale(
      "Masz już całą klawiaturę i piszesz całe teksty: od Bałtyku po Tatry, opowiadania ze szkoły, o sporcie i o zwierzętach, " +
        "i o zwykłym życiu na co dzień.",
    ),
    griffe: grosseBuchstabenTeil,
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const PL_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/**
 * Der GESCHRIEBENE erste Absatz einer Lektion, wie er auf einer Tastatur mit DIESEN Tasten der Lektion erscheint - für den
 * Beispielwort-Wächter.
 */
export function plLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return BAUPLAENE.find((b) => b.id === id)?.vorspann(tasten) ?? "";
}

/**
 * Die Tasten jeder Lektion auf dieser Tastatur: die Folge der Tastatur durchgehen (wie `curriculumIt.ts#tastenJeLektion`) -
 *  · eine Einheit kommt in ihre geplante Lektion;
 *  · ist deren Lektion schon VORBEI, in die laufende;
 *  · kommt sie FRÜHER als geplant, ebenso;
 *  · kennt der Plan sie gar nicht (`ö` auf deutscher Hardware), ebenso.
 * „⇧" ist der feste Anker seiner Lektion.
 */
function tastenJeLektion(layout: KeyboardLayout): Map<string, string[]> {
  const reihenfolge = reihenfolgeAuf(layout);
  const geplant = new Map<string, number>();
  BAUPLAENE.forEach((b, i) => {
    for (const u of b.einheiten) geplant.set(u, i);
    if (b.enablesShift) geplant.set(SHIFT_UNIT, i);
  });
  const neu = new Map<string, string[]>(BAUPLAENE.map((b) => [b.id, []]));
  let jetzt = 0;
  /** Die geplante Lektion der nächsten Einheit, die REGULÄR kommt - Nachzügler und Einheiten ohne Plan zählen nicht. */
  const naechsteRegulaer = (k: number): number => {
    for (let j = k + 1; j < reihenfolge.length; j++) {
      const q = geplant.get(reihenfolge[j]);
      if (q !== undefined && q >= jetzt) return q;
    }
    return Infinity;
  };
  reihenfolge.forEach((u, k) => {
    const p = geplant.get(u);
    const naechste = naechsteRegulaer(k);
    let l: number;
    if (p === undefined) l = jetzt;
    else if (p < jetzt) l = jetzt;
    else if (u !== SHIFT_UNIT && p > jetzt && naechste < p) l = jetzt;
    else l = p;
    jetzt = l;
    if (u !== SHIFT_UNIT) neu.get(BAUPLAENE[l].id)!.push(u);
  });
  return neu;
}

function baueLektionen(layout: KeyboardLayout): Lesson[] {
  const tastenJe = tastenJeLektion(layout);
  return BAUPLAENE.map((b) => {
    const tasten = tastenJe.get(b.id) ?? [];
    const griffe = b.griffe ? b.griffe(tasten, layout) : griffeGerechnet(tasten, layout);
    const vorspann = b.vorspann(tasten);
    const lektion: Lesson = {
      id: b.id,
      title: b.titel(tasten, layout),
      kind: b.kind,
      newKeys: tasten,
      intro: griffe ? `${vorspann} ${griffe}` : vorspann,
    };
    if (b.enablesShift) lektion.enablesShift = true;
    if (b.corpusKinds) lektion.corpusKinds = b.corpusKinds;
    return lektion;
  });
}

/** Die polnische Pflicht-Tastatur (Bauplan, F3-pl): Windows „Polski (programisty)" und Mac „Polish - Pro" in einer Belegung. */
const PL_LAYOUTS: readonly LayoutId[] = ["pl"];

const CACHE = new Map<LayoutId, readonly Lesson[]>();

/**
 * Die Lektionen des Weges „pl" auf dieser Tastatur - gecacht, damit `lektionenFuer("pl")` bei gleicher Tastatur immer DIESELBE
 * Liste liefert. Gerechnet wird mit der Tastatur, die eingestellt ist; jede Lektion trägt in {@link Lesson.introByLayout} die
 * Einführung der polnischen Pflicht-Tastatur, wo sie auf der eingestellten abweicht.
 */
export function plLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  const cached = CACHE.get(layoutId);
  if (cached) return cached;
  const eigene = baueLektionen(layoutById(layoutId));
  const andere = PL_LAYOUTS.filter((id) => id !== layoutId).map(
    (id) => [id, new Map(baueLektionen(layoutById(id)).map((l) => [l.id, l.intro]))] as const,
  );
  for (const l of eigene) {
    const je: Partial<Record<LayoutId, string>> = {};
    for (const [id, intros] of andere) {
      const text = intros.get(l.id);
      if (text !== undefined && text !== l.intro) je[id] = text;
    }
    if (Object.keys(je).length > 0) l.introByLayout = je;
  }
  const fertig = Object.freeze(eigene);
  CACHE.set(layoutId, fertig);
  return fertig;
}
