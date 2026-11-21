/**
 * ★★★ DIE LEKTIONEN DES WEGES „it" (IT-S, 03.10.2026).
 *
 * Vorbild: `curriculumEs.ts` (Bauart, Griffe aus den Daten) und `curriculumFr.ts` (eine andere
 * achte Grundtaste je Tastatur). Neu auf Italienisch geschrieben, nichts übersetzt (Johannes:
 * *„keine texte werden übersetzt, Texte aus den regionen, altersgemäß und zeitgemäß"*). Die
 * Kinder (und Selbstlernende) werden geduzt (Glossar Regel 1); Begriffe aus
 * `recherche-italienisch-2026-10-02/GLOSSAR-it.md` §2 (riga di base, posizione base, i rilievi su F e
 * J, Maiusc, Alt Gr, Opzione, tasto morto, barra spaziatrice, indice/medio/anulare/mignolo);
 * Tastenwege statt Maus; Beispielwörter in geraden Anführungszeichen (Glossar Regel 7).
 *
 * ── DIE REGEL, AN DER ALLES HÄNGT (wie `curriculumFr.ts`/`curriculumEs.ts`) ─────────────────────
 * Jede Lektion führt NUR Tasten ein, die in der Reihenfolge des Weges (`lernweg.ts#IT_LETTER_ORDER`,
 * Befund F4-it) bis dahin dran sind: Die Tasten aller Lektionen hintereinander SIND
 * `introOrder("it")` - auf JEDER Tastatur. Wächter: `tests/tastenflow-lektionen-it.test.ts`.
 *
 * ── JE TASTATUR EINE EIGENE LISTE ────────────────────────────────────────────────────────────────
 * Auf `it` (Windows „Italiano", Mac „Italiano - Pro") ist die achte Grundtaste `ò`, auf der
 * Mac-QZERTY `it-qzerty` ist es `m`; dort kommt `ò` erst nach `ì` (`achteGrundtasten`,
 * `verdraengtNach`). Die Lektionen folgen der Folge DER Tastatur mit derselben Regel wie
 * `curriculumFr.ts#inFolgeDerTastatur`: eine Einheit, die FRÜHER kommt als geplant (`m` in der
 * Grundreihe), und eine, deren Lektion schon VORBEI ist (`ò` nach `ì`), kommen in die gerade
 * laufende Lektion; eine Einheit, die der Plan gar nicht kennt (`ö` als achte Grundtaste der
 * Schweizer Tastatur `ch`), ebenso. Die IDs bleiben auf jeder Tastatur gleich (der Fortschritt hängt
 * an der ID).
 *
 * ── WAS GERECHNET IST UND WAS GESCHRIEBEN ────────────────────────────────────────────────────────
 * Geschrieben: Titel und der erste Absatz (was die Lektion bringt, Beispielwörter). Gerechnet: die
 * GRIFFE - Finger, Reihe, Lage zur Grundstellung, Maiusc/Alt Gr/Opzione - aus den Daten der Tastatur
 * (`layouts.ts`). Ein Griff, den die Tastatur nicht kennt, wird nicht geraten.
 *
 * ⚠️ Grosse Akzentbuchstaben (À È É Ì Ò Ù): unter Windows gibt es sie auf `it` nicht (`grossFehlt`), am
 * Mac mit Opzione + Maiuscole. Kein Beispielwort einer Lektion trägt einen (Wächter), die Schlusslektion
 * sagt, was die Tastatur kann - Windows: nie, Mac: Opzione (Bauplan I3-I6, Befund F4-it §6).
 */
import type { Lesson, LessonKind } from "./curriculum";
import { SHIFT_UNIT, achteGrundtasteFuerLayout } from "./letters";
import { lernwegDef } from "./lernweg";
import { layoutById, layoutIndex, type KeyboardLayout, type LayoutId } from "./layouts";
import { FINGERS, fingerName, type FingerId } from "./fingers";
// ★ G2b-1: Gross-/Klein ausdrücklich in der Sprache dieser Lektionen ("it").
import { grossFuer, kleinFuer } from "./sprachRegister";

interface ItLektionsBauplan {
  id: string;
  kind: LessonKind;
  /** Die neuen Einheiten in der Folge der Bezugstastatur `it`, genau in der Reihenfolge des Weges. */
  einheiten: readonly string[];
  enablesShift?: boolean;
  corpusKinds?: Lesson["corpusKinds"];
  /** Der Titel aus den Tasten, die auf DIESER Tastatur ankommen. */
  titel: (tasten: readonly string[], layout: KeyboardLayout) => string;
  /** Der geschriebene erste Absatz - aus den Tasten, die auf DIESER Tastatur ankommen. */
  vorspann: (tasten: readonly string[]) => string;
  /** Statt der gerechneten Griffe ein eigener Teil (Maiusc, Ziffern, Schluss). */
  griffe?: (tasten: readonly string[], layout: KeyboardLayout) => string;
}

// ── Tastennamen ───────────────────────────────────────────────────────────────

/**
 * Die Tastaturen, die es NUR am Mac gibt (`layouts.ts`: „Nur am Mac - nie in der Windows-Erkennung").
 * Dort heisst die Umschalttaste „Maiuscole" und die dritte Ebene „Opzione" (Glossar §2.9); auf `it`
 * (Windows UND Mac Pro) nennt der Text beide.
 */
const NUR_MAC: ReadonlySet<LayoutId> = new Set<LayoutId>(["it-qzerty"]);

function maiusc(layout: KeyboardLayout): string {
  return NUR_MAC.has(layout.id) ? "Maiuscole" : "Maiusc";
}

function terzoLivello(layout: KeyboardLayout): string {
  if (NUR_MAC.has(layout.id)) return "Opzione";
  return layout.id === "it" ? "Alt Gr (sul Mac: Opzione)" : "Alt Gr";
}

/** Buchstaben a-z gross (wie auf der Kappe); Akzentbuchstaben bleiben klein - so stehen sie auf der Kappe. */
function kappe(k: string): string {
  return /^[a-z]$/.test(k) ? grossFuer(k, "it") : k;
}

/** Satz- und Sonderzeichen haben im Satz einen NAMEN vor dem Zeichen (Glossar §2.8, `SPOKEN_IT`). */
const ZEICHEN_NAMEN_IT: Readonly<Record<string, string>> = {
  ".": "il punto", ",": "la virgola", ";": "il punto e virgola", ":": "i due punti",
  "?": "il punto interrogativo", "!": "il punto esclamativo", "'": "l'apostrofo", '"': "le virgolette",
  "-": "il trattino", "(": "la parentesi aperta", ")": "la parentesi chiusa",
  "[": "la parentesi quadra aperta", "]": "la parentesi quadra chiusa",
  "{": "la parentesi graffa aperta", "}": "la parentesi graffa chiusa",
  "%": "il simbolo di percentuale", "&": "la e commerciale", "/": "la barra", "+": "il segno più",
  "*": "l'asterisco", "=": "il segno uguale", _: "il trattino basso", "<": "il segno minore",
  ">": "il segno maggiore", $: "il simbolo del dollaro", "|": "la barra verticale", "€": "il simbolo dell'euro",
  "@": "la chiocciola", "#": "il cancelletto",
};

/** Das Zeichen im Satz: in geraden Anführungszeichen, das Anführungszeichen selbst in Klammern. */
function zeichenZeigen(u: string): string {
  return u === '"' ? `(")` : `"${u}"`;
}

/** Der Anfang eines Griff-Satzes: „La E", „La è", „Il punto ".“". */
function satzAnfang(u: string): string {
  const name = ZEICHEN_NAMEN_IT[u];
  if (!name) return `La ${kappe(u)}`;
  return `${grossFuer(name.charAt(0), "it")}${name.slice(1)} ${zeichenZeigen(u)}`;
}

/** Eine Taste im Satz: Buchstaben und Ziffern für sich, Zeichen gezeigt. */
function tasteImSatz(k: string): string {
  return /^[\p{L}\p{N}]$/u.test(k) ? kappe(k) : zeichenZeigen(k);
}

/** „F e J", „C, I e M", „I ed E" (vor einem E steht „ed"). */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  const letzte = teile[teile.length - 1];
  const und = /^[eèé]/i.test(letzte) ? "ed" : "e";
  return `${teile.slice(0, -1).join(", ")} ${und} ${letzte}`;
}

function kappen(tasten: readonly string[]): string {
  return aufzaehlen(tasten.map(kappe));
}

// ── Die Folge des Weges auf einer Tastatur ───────────────────────────────────

/** Die Reihenfolge des Weges „it" auf dieser Tastatur (wie `introOrder`, aber für ein beliebiges Layout). */
function reihenfolgeAuf(layout: KeyboardLayout): string[] {
  const fehlt = layoutIndex(layout).missing;
  const vorhanden = lernwegDef("it").introOrder.filter((u) => !fehlt.has(kleinFuer(u, "it")));
  return achteGrundtasteFuerLayout(vorhanden, "it", layout.id);
}

// ── Griffe aus den Daten der Tastatur ────────────────────────────────────────

const RIGHE = ["riga dei numeri", "riga superiore", "riga di base", "riga inferiore"];

function platz(layout: KeyboardLayout, taste: string): { reihe: number; spalte: number } | null {
  for (let r = 0; r < layout.rows.length; r++) {
    const s = layout.rows[r].keys.indexOf(taste);
    if (s >= 0) return { reihe: r, spalte: s };
  }
  return null;
}

/**
 * Finger → seine Taste in der Grundstellung auf DIESER Tastatur: die Heimtasten des Weges (Vereinigung
 * `a s d f j k l ò m é ö`), soweit sie hier in der Grundreihe liegen (auf `it` liegt `m` unten, auf der
 * QZERTY `ò` - die zählen dort nicht).
 */
function heimTasten(layout: KeyboardLayout): ReadonlyMap<FingerId, string> {
  const m = new Map<FingerId, string>();
  for (const k of lernwegDef("it").homeKeys) {
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

/** „medio sinistro, proprio sopra la D" - Finger und Lage einer Taste. */
function lage(layout: KeyboardLayout, taste: string): string | null {
  const p = platz(layout, taste);
  const fingerId = layoutIndex(layout).finger.get(taste);
  if (!p || !fingerId || fingerId === "daumen") return null;
  const finger = fingerName(FINGERS[fingerId], "it");
  const h = heimTasten(layout).get(fingerId);
  const hp = h ? platz(layout, h) : null;
  if (!h || !hp) return `${finger}, ${RIGHE[p.reihe]}`;
  const H = kappe(h);
  const s = grundreihenSpalte(layout, p.reihe, p.spalte);
  const abstand = Math.abs(s - hp.spalte);
  const richtung = s < hp.spalte ? "a sinistra" : "a destra";
  const weit = abstand >= 3 ? "tre tasti " : abstand === 2 ? "due tasti " : "";
  if (p.reihe === 2) return taste === h ? `${finger}, nella posizione base` : `${finger}, ${weit}${richtung} della ${H}`;
  const vorne = p.reihe === 0 ? "nella riga dei numeri, " : "";
  if (abstand === 0) return `${finger}, ${vorne}${p.reihe === 3 ? "proprio sotto la" : "proprio sopra la"} ${H}`;
  // In der Ziffernreihe sagt die Reihe schon „oben" - „in alto" stünde doppelt.
  if (vorne) return `${finger}, ${vorne}${weit}${richtung} della ${H}`;
  return `${finger}, ${p.reihe === 3 ? "in basso" : "in alto"}, ${weit}${richtung} della ${H}`;
}

/** Ein Satz: wie wird diese Einheit auf dieser Tastatur getippt? */
function griffSatz(layout: KeyboardLayout, u: string): string {
  const zugang = layout.access[u];
  const anfang = satzAnfang(u);
  if (zugang?.dead) {
    const wo = lage(layout, zugang.base);
    const morto =
      "È un tasto morto: da solo non scrive nulla, mette il suo segno sulla vocale che premi dopo.";
    if (zugang.base === u && !zugang.mod) return `${anfang}: ${wo ?? "un tasto proprio"}. ${morto}`;
    const mod =
      zugang.mod === "shift"
        ? `tieni premuto il tasto ${maiusc(layout)} dell'altra mano e premi `
        : zugang.mod === "altgr"
          ? `tieni premuto ${terzoLivello(layout)} e premi `
          : "premi ";
    return `${anfang}: ${mod}il tasto ${tasteImSatz(zugang.base)}${wo ? ` (${wo})` : ""}. ${morto}`;
  }
  if (zugang?.mod) {
    const wo = lage(layout, zugang.base);
    const mod = zugang.mod === "shift" ? `il tasto ${maiusc(layout)} dell'altra mano` : terzoLivello(layout);
    return `${anfang}: tieni premuto ${mod} e premi ${tasteImSatz(zugang.base)}${wo ? ` (${wo})` : ""}.`;
  }
  const wo = lage(layout, u);
  if (wo) return `${anfang}: ${wo}.`;
  // Nicht geraten: Die Daten dieser Tastatur zeigen keinen Griff.
  return `${anfang}: il suo posto su questa tastiera non è ancora descritto qui.`;
}

function griffeGerechnet(tasten: readonly string[], layout: KeyboardLayout): string {
  return tasten.map((u) => griffSatz(layout, u)).join(" ");
}

// ── Die Sonderteile ──────────────────────────────────────────────────────────

function maiuscTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const m = maiusc(layout);
  return (
    `Per una maiuscola tieni premuto il tasto ${m} con l'altra mano: una lettera della metà ` +
    `sinistra della tastiera chiede il tasto ${m} di destra, una lettera della metà destra quello di ` +
    `sinistra. Se ne occupano i due mignoli. Conta solo il tasto ${m} dell'altra mano.`
  );
}

function numeriTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const cifre = "1234567890".split("");
  if (cifre.every((z) => layout.access[z]?.mod === "shift")) {
    const m = maiusc(layout);
    const coppie = cifre.map((z) => `${z} = ${m} + ${layout.access[z].base}`).join(", ");
    return (
      `Sulla tua tastiera i numeri sono nella riga dei numeri, ma si scrivono insieme al tasto ${m} dell'altra ` +
      `mano: senza ${m} quei tasti scrivono altri segni. ${coppie}. Ogni dito resta nella sua colonna.`
    );
  }
  const uno = lage(layout, "1");
  return (
    `Sulla tua tastiera i numeri si scrivono senza ${maiusc(layout)}. Ogni dito sale nella sua colonna ` +
    "fino alla riga dei numeri: 1 2 3 4 5 con la mano sinistra, 6 7 8 9 0 con la destra" +
    `${uno ? ` (1: ${uno})` : ""}.`
  );
}

/**
 * Die Schlusslektion: was DIESE Tastatur mit den grossen Akzentbuchstaben kann (Bauplan I3-I6, F3-it):
 * `it` unter Windows nie (nur ein Alt-Code - kein Weg der Lehre), am Mac „Italiano - Pro" Opzione +
 * Maiuscole; die Mac-QZERTY ebenso, À und É über die Totasten Opzione + 9 und Opzione + 0 (gemessen,
 * `layouts.ts`). Eine andere Tastatur (Schweiz, …): nichts behauptet.
 */
function maiuscoleAccentateTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const regola =
    "In italiano l'accento resta anche sulla maiuscola: all'inizio di una frase si scrive È, non E con l'apostrofo.";
  if (layout.id === "it") {
    return (
      `${regola} Su Windows la tastiera italiana non ha le maiuscole accentate: per questo, su ` +
      "Windows, Tastenflow non ti propone testi che ne hanno bisogno. Sul Mac (Italiano - Pro) le scrivi " +
      "tenendo premuti Opzione e Maiuscole."
    );
  }
  if (NUR_MAC.has(layout.id)) {
    return (
      `${regola} Sul Mac le scrivi tenendo premuti Opzione e Maiuscole; per la A e la E con l'accento ` +
      "si usano i tasti morti Opzione + 9 e Opzione + 0, poi Maiuscole e la vocale."
    );
  }
  return regola;
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const RIGA = (t: readonly string[]) => `La riga di base: ${kappen(t)}`;
const fisso = (testo: string) => () => testo;

const BAUPLAENE: readonly ItLektionsBauplan[] = [
  {
    id: "it-base-1", kind: "home", einheiten: ["f", "j"], titel: RIGA,
    vorspann: fisso(
      "Appoggia le dita sulla riga di base: è la posizione base. I piccoli rilievi su F e J ti " +
        "aiutano a trovarla senza guardare la tastiera. Si comincia da questi due tasti, con i due " +
        "indici. Ogni dito parte da qui e ci torna dopo ogni tasto.",
    ),
  },
  {
    id: "it-base-2", kind: "home", einheiten: ["d", "k"], titel: RIGA,
    vorspann: fisso("I medi si aggiungono agli indici: D a sinistra, K a destra. Gli indici restano sui rilievi."),
  },
  {
    id: "it-base-3", kind: "home", einheiten: ["s", "l"], titel: RIGA,
    vorspann: fisso("Arrivano gli anulari: S a sinistra, L a destra. Le dita restano morbide e leggere."),
  },
  {
    id: "it-base-4", kind: "home", einheiten: ["a", "ò"],
    titel: (t) => `La riga di base al completo: ${kappen(t)}`,
    vorspann: (t) => {
      const achte = t.find((u) => u !== "a");
      const inizio =
        "Il mignolo sinistro si posa sulla A" +
        (achte ? `, il mignolo destro sulla ${kappe(achte)}` : "") +
        ". Ora la riga di base è completa: otto dita su otto tasti e i pollici sulla barra spaziatrice.";
      if (achte === "ò")
        return `${inizio} Arrivano le prime parole: "la", "da", "sala", "salsa", "alla", "dalla" e "falò".`;
      if (achte === "m")
        return (
          `${inizio} Sulla tua tastiera la M sta nella riga di base, a destra della L. Arrivano le ` +
          'prime parole: "la", "da", "sala", "salsa", "mamma", "lama" e "dama".'
        );
      return `${inizio} Arrivano le prime parole: "la", "da", "sala", "salsa", "alla" e "dalla".`;
    },
  },
  {
    id: "it-frequenti-1", kind: "letters", einheiten: ["i", "e"],
    titel: (t) => `Le lettere più frequenti: ${kappen(t)}`,
    vorspann: fisso(
      "La I e la E sono tra le lettere più usate dell'italiano. Con loro arrivano tante parole brevi: " +
        '"il", "di", "se", "lei", "sei", "idea", "sale", "sedia" e "sfida".',
    ),
  },
  {
    id: "it-frequenti-2", kind: "letters", einheiten: ["o", "n"],
    titel: (t) => `Le lettere più frequenti: ${kappen(t)}`,
    vorspann: fisso(
      'Con la O e la N scrivi "no", "non", "noi", "sono", "nonna", "nonno", "nido", "naso", "olio", ' +
        '"isola" e "leone".',
    ),
  },
  {
    id: "it-frequenti-3", kind: "letters", einheiten: ["r", "t"],
    titel: (t) => `Le lettere più frequenti: ${kappen(t)}`,
    vorspann: fisso(
      'Con la R e la T arrivano "tre", "tra", "terra", "treno", "strada", "notte", "fiore", "sera", ' +
        '"arte" e "torta".',
    ),
  },
  {
    id: "it-frequenti-4", kind: "letters", einheiten: ["c", "u"],
    titel: (t) => `Le lettere più frequenti: ${kappen(t)}`,
    vorspann: fisso(
      'Con la C e la U scrivi "ciao", "con", "una", "luna", "luce", "cane", "casa", "cuore", "cucina" ' +
        'e "scuola".',
    ),
  },
  {
    id: "it-mvp", kind: "letters", einheiten: ["m", "v", "p"],
    titel: (t) => `Le prime frasi intere: ${kappen(t)}`,
    vorspann: (t) =>
      `Con ${kappen(t)} puoi già scrivere frasi intere, come "mio nonno vive vicino al mare", e tante ` +
      'parole nuove: "mamma", "mare", "vento", "vela", "pane", "mela", "porta", "ponte" e "primavera".',
  },
  {
    id: "it-maiusc", kind: "shift", einheiten: [], enablesShift: true,
    titel: (_t, l) => `Le maiuscole con il tasto ${maiusc(l)}`,
    vorspann: fisso(
      "Finora le maiuscole le metteva Tastenflow al posto tuo. Da qui le scrive la tua mano: " +
        '"Anna", "Marco", "Napoli", "Palermo", "Sicilia", "Trieste", "Matera", "Merano", "Locarno" ' +
        'e "San Marino".',
    ),
    griffe: maiuscTeil,
  },
  // ★ D-1 (Didaktik-Synthese 28.09.2026, gilt für jeden Weg): Punkt und Komma direkt nach Maiusc.
  {
    id: "it-punto-virgola", kind: "punctuation", einheiten: [".", ","],
    titel: () => "Il punto e la virgola: . ,",
    vorspann: fisso(
      "Una frase comincia con la maiuscola e finisce con il punto. La virgola la divide in parti. " +
        "Dopo il punto e dopo la virgola viene uno spazio.",
    ),
  },
  {
    id: "it-ghbz", kind: "letters", einheiten: ["g", "h", "b", "z"],
    titel: (t) => `Altre lettere: ${kappen(t)}`,
    vorspann: fisso(
      'La H non si sente, ma si scrive: "ho", "hai", "ha". Davanti a E e I cambia il suono di C e G: ' +
        '"che", "chi", "ghiro". Con G, B e Z arrivano "gatto", "bosco", "zaino", "pizza", "Genova", ' +
        '"Bari", "Bolzano" e "Gorizia".',
    ),
  },
  {
    id: "it-e-a-accentate", kind: "letters", einheiten: ["è", "à"],
    titel: (t) => `Le vocali accentate: ${kappen(t)}`,
    vorspann: fisso(
      'L\'accento cambia il senso di una parola: "e" non è "è", "la" non è "là", "papa" non è "papà". ' +
        'Con è e à scrivi anche "città", "caffè", "età", "già" e "libertà".',
    ),
  },
  {
    id: "it-apostrofo", kind: "letters", einheiten: ["'"],
    titel: () => "L'apostrofo: '",
    vorspann: fisso(
      "L'apostrofo prende il posto di una vocale che cade davanti a un'altra vocale: " +
        '"l\'amico", "l\'albero", "un\'amica", "dell\'isola", "c\'è", "dov\'è". Anche "po\'" si scrive ' +
        "con l'apostrofo, non con l'accento.",
    ),
  },
  {
    id: "it-q", kind: "letters", einheiten: ["q"],
    titel: () => "La lettera Q",
    vorspann: fisso(
      'In italiano dopo la Q viene quasi sempre la U: "qui", "qua", "quando", "quattro", "quadro", "acqua", ' +
        '"questo" e "squadra". Attenzione: "cuore" e "scuola" si scrivono con la C.',
    ),
  },
  {
    id: "it-e-acuta", kind: "letters", einheiten: ["é"],
    titel: () => "La e con l'accento acuto: é",
    vorspann: (t) =>
      (t.includes("é") ? "" : "Sulla tua tastiera la é sta già nella riga di base: qui la ripassi. ") +
      'La é ha un suono chiuso. La trovi soprattutto in fondo alle parole: "perché", "poiché", ' +
      '"finché", "né", "ventitré" e "trentatré".',
  },
  {
    id: "it-i-u-accentate", kind: "letters", einheiten: ["ì", "ù"],
    titel: (t) => `Le ultime vocali accentate: ${kappen(t)}`,
    vorspann: (t) =>
      'Con ì e ù arrivano "sì", "lì", "così", "lunedì", "venerdì", "più", "giù", "virtù" e "gioventù".' +
      (t.includes("ò") ? ' Sulla tua tastiera arriva qui anche la ò: "però", "ciò", "farò" e "falò".' : ""),
  },
  {
    id: "it-ywx", kind: "letters", einheiten: ["y", "w", "x"],
    titel: (t) => `Lettere da altre lingue: ${kappen(t)}`,
    vorspann: fisso(
      'Y, W e X si trovano soprattutto in parole venute da altre lingue: "yogurt", "kiwi", "web", ' +
        '"taxi", "extra" e "xilofono". Con loro hai tutto l\'alfabeto.',
    ),
  },
  {
    id: "it-domanda", kind: "punctuation", einheiten: ["?", "!"],
    titel: () => "La domanda e l'esclamazione: ? !",
    vorspann: fisso(
      'Il punto interrogativo chiude una domanda, il punto esclamativo un\'esclamazione: "Come stai?", ' +
        '"Dove sei?", "Che bello!", "Evviva!". Prima di questi segni non va lo spazio.',
    ),
  },
  {
    id: "it-punteggiatura", kind: "punctuation", einheiten: ['"', ":", ";", "-", "(", ")"],
    titel: (t) => `Altri segni: ${t.join(" ")}`,
    vorspann: fisso(
      "Le virgolette per le parole dette da qualcuno, i due punti e il punto e virgola per elenchi e " +
        'spiegazioni, il trattino per parole come "nord-est", le parentesi per una precisazione.',
    ),
  },
  {
    id: "it-numeri", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "La riga dei numeri",
    vorspann: fisso(
      "Date, orari, prezzi e risultati: adesso arrivano i numeri. In italiano le migliaia si separano " +
        "con il punto e i decimali con la virgola, come in 1.250 e in 2,50.",
    ),
    griffe: numeriTeil,
  },
  {
    id: "it-simboli-1", kind: "symbols", einheiten: ["%", "&", "/", "+", "*", "=", "_", "<", ">", "$"],
    titel: (t) => `I simboli: ${t.join(" ")}`,
    vorspann: fisso(
      "Questi simboli servono per i calcoli, per le percentuali e al computer. Prenditi il tempo che " +
        "serve: qui conta più la precisione della velocità.",
    ),
  },
  {
    id: "it-simboli-2", kind: "symbols", einheiten: ["|", "€", "@", "#", "[", "]", "{", "}"],
    titel: (t) => `Altri simboli: ${t.join(" ")}`,
    vorspann: fisso(
      "I simboli degli indirizzi email, dei prezzi e del codice. Sono i più difficili della tastiera, " +
        "per questo arrivano per ultimi.",
    ),
  },
  {
    id: "it-testi", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Le maiuscole accentate e i testi",
    vorspann: fisso(
      "Ora hai tutta la tastiera e scrivi testi interi: dalle Alpi alla Sicilia, dal Ticino alla " +
        "Sardegna, storie di scuola, di sport, di animali e di vita di tutti i giorni.",
    ),
    griffe: maiuscoleAccentateTeil,
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const IT_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/**
 * Der GESCHRIEBENE erste Absatz einer Lektion, wie er auf einer Tastatur mit DIESEN Tasten der
 * Lektion erscheint - für den Beispielwort-Wächter je Tastatur.
 */
export function itLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return BAUPLAENE.find((b) => b.id === id)?.vorspann(tasten) ?? "";
}

/**
 * Die Tasten jeder Lektion auf dieser Tastatur: die Folge der Tastatur durchgehen (wie
 * `curriculumFr.ts#inFolgeDerTastatur`) -
 *  · eine Einheit kommt in ihre geplante Lektion;
 *  · ist deren Lektion schon VORBEI (`ò` nach `ì` auf der QZERTY), in die laufende;
 *  · kommt sie FRÜHER als geplant (die nächste Einheit gehört wieder zu einer früheren Lektion - `m` in
 *    der Grundreihe der QZERTY), ebenso;
 *  · kennt der Plan sie gar nicht (`ö` auf `ch`), ebenso.
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
  /**
   * Die geplante Lektion der nächsten Einheit, die REGULÄR kommt - Nachzügler (`ò` nach `ì`) und
   * Einheiten ohne Plan (`ö`) zählen dafür nicht, sonst hielte die Regel „zu früh" die Einheit davor
   * fälschlich an (gemessen: `ì` rutschte auf der QZERTY sonst in die Lektion der `é`).
   */
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

/** Die italienischen Pflicht-Tastaturen (Bauplan, F3-it): Windows/Mac Pro und die Mac-QZERTY. */
const IT_LAYOUTS: readonly LayoutId[] = ["it", "it-qzerty"];

const CACHE = new Map<LayoutId, readonly Lesson[]>();

/**
 * Die Lektionen des Weges „it" auf dieser Tastatur - gecacht, damit `lektionenFuer("it")` bei gleicher
 * Tastatur immer DIESELBE Liste liefert. Gerechnet wird mit der Tastatur, die eingestellt ist (auch
 * Schweiz-Französisch und Schweiz für Tessin und Graubünden); jede Lektion trägt in
 * {@link Lesson.introByLayout} die Einführung der anderen italienischen Pflicht-Tastatur, wo sie abweicht.
 */
export function itLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  const cached = CACHE.get(layoutId);
  if (cached) return cached;
  const eigene = baueLektionen(layoutById(layoutId));
  const andere = IT_LAYOUTS.filter((id) => id !== layoutId).map(
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
