/**
 * ★★★ DIE LEKTIONEN DES WEGES „ro" (Rumänisch) - F4-RO (29.10.2026), vorher leerer Einhängepunkt (G3c-VERTEILER).
 *
 * Bauart wie `curriculumHu.ts`; die Rechnung (Tasten je Lektion, Griffe aus den Daten der Tastatur, `introByLayout`) steht im
 * `lektionenBaukasten.ts`. Neu auf Rumänisch geschrieben, nichts übersetzt. Begriffe nach dem Glossar (`glossar/GLOSSAR-ro.md` §2.1,
 * §2.8, §2.9): *șirul de bază* (nie „rând" - das ist die Übungszeile), *poziția de bază*, *șirul de sus/de jos/de cifre*,
 * *degetul mic · inelarul · mijlociul · arătătorul · degetul mare*, *liniuțele în relief*, *tasta Shift*, *tasta Alt Gr*,
 * *bara de spațiu*, *tastă moartă*, *lecție*; Kinder werden geduzt (*tu*: „Apasă", Bauplan R10); Tastennamen nie gebeugt, immer mit
 * „tasta" (Regel 11); nur Komma-Formen ș ț (U+0219/U+021B); Tastenwege statt Maus; nur der Bindestrich `-`; Beispielwörter in „…”
 * (U+201E/U+201D, Regel 7).
 *
 * ── DIE REGEL (wie hu/cs) ────────────────────────────────────────────────────────────────────────────────────────────
 * Jede Lektion führt NUR Tasten ein, die in der Reihenfolge des Weges (`lernweg.ts#RO_LETTER_ORDER`) bis dahin dran sind: die Tasten
 * aller Lektionen hintereinander SIND `introOrder("ro")` - auf `ro` (Standard) und `ro-prog` (Programmers). Auf `ro-prog` ist die
 * achte Heimtaste `;` (Bauplan R2): `ș` kommt dort zusammen mit `ă` als erste Alt-Gr-Lektion. Die Griffe werden gerechnet, nie
 * geschrieben. Wächter: `tests/tastenflow-lektionen-ro.test.ts`.
 */
import type { Lesson } from "./curriculum";
import type { FingerId, KeyAccess } from "./fingers";
import { heimZeichenDesWeges } from "./heimtasten";
import type { KeyboardLayout, LayoutId } from "./layouts";
import { fingerTeile, lektionenJeTastatur, type GriffSaetze, type Lage, type LektionsBauplan } from "./lektionenBaukasten";
import { kappeFuer } from "./sprachRegister";

// ── Namen ────────────────────────────────────────────────────────────────────

/** Was auf der Kappe steht: Buchstaben gross (Ă, Ș), sonst das Zeichen. */
const kappe = (k: string): string => kappeFuer(k, "ro");

/** Die Buchstaben mit Zeichen, wie das Kind sie in der Schule nennt (Glossar §2.8). */
const DIACRITICE: Readonly<Record<string, string>> = {
  ă: "a cu căciulă", â: "â din a", î: "î din i", ș: "s cu virgulă", ț: "t cu virgulă",
};

/** „F și J", „A, B și C". */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} și ${teile[teile.length - 1]}`;
}
const kappen = (t: readonly string[]): string => aufzaehlen(t.map(kappe));

const FINGER: Record<"kleiner" | "ring" | "mittel" | "zeige" | "daumen", string> = {
  kleiner: "degetul mic", ring: "inelarul", mittel: "mijlociul", zeige: "arătătorul", daumen: "degetul mare",
};
function fingerName(f: FingerId): string {
  const { hand, art } = fingerTeile(f);
  return hand === null ? FINGER[art] : `${FINGER[art]} ${hand === "links" ? "stâng" : "drept"}`;
}

const SIRURI = ["șirul de cifre", "șirul de sus", "șirul de bază", "șirul de jos"];

/** „la dreapta tastei F", „la două taste la stânga tastei J". */
function lateral(l: Lage): string {
  const parte = l.richtung === "links" ? "stânga" : "dreapta";
  const weit = l.abstand >= 3 ? "la trei taste " : l.abstand === 2 ? "la două taste " : "";
  return `${weit}la ${parte} tastei ${kappe(l.heim ?? "")}`;
}

/** Finger und Lage, z. B. „arătătorul stâng, la dreapta tastei F". */
function lageText(l: Lage): string {
  const finger = fingerName(l.finger);
  if (l.istHeim) return `${finger}, poziția de bază`;
  if (!l.heim) return `${finger}, ${SIRURI[l.reihe]}`;
  if (l.reihe === 2) return `${finger}, ${lateral(l)}`;
  if (l.abstand === 0) {
    return `${finger}, ${SIRURI[l.reihe]}, ${l.reihe === 3 ? "chiar sub tasta" : "chiar deasupra tastei"} ${kappe(l.heim)}`;
  }
  return `${finger}, ${SIRURI[l.reihe]}, ${lateral(l)}`;
}

function zusatz(z: KeyAccess): string {
  if (z.mod === "shift") return "ține apăsată tasta Shift cu cealaltă mână și apasă ";
  if (z.mod === "altgr") return "ține apăsată tasta Alt Gr și apasă ";
  return "apasă ";
}

const MOARTA = "Este o tastă moartă: singură nu scrie nimic, își pune semnul pe litera pe care o apeși imediat după ea.";

/** Zeichennamen wie NVDA rumänisch sie spricht (Glossar §2.8, `SPOKEN_RO`): der Name steht vor dem Zeichen. */
const ZEICHEN: Readonly<Record<string, string>> = {
  ".": "punct", ",": "virgulă", "?": "semnul întrebării", "!": "semnul exclamării", "-": "cratimă", ";": "punct și virgulă",
  ":": "două puncte", "„": "ghilimele deschise", "”": "ghilimele închise", "\"": "ghilimele", "'": "apostrof",
  "(": "paranteză rotundă deschisă", ")": "paranteză rotundă închisă", "%": "procent", "/": "bară oblică", "+": "plus",
  "=": "egal", "_": "liniuță joasă", "*": "asterisc", "&": "ampersand", "$": "dolar", "@": "a rond", "#": "diez",
  "^": "circumflex", "<": "mai mic", ">": "mai mare", "[": "paranteză pătrată deschisă", "]": "paranteză pătrată închisă",
  "{": "acoladă deschisă", "}": "acoladă închisă", "|": "bară verticală", "\\": "bară oblică inversă", "€": "euro",
  "`": "accent grav", "~": "tildă",
};

/** Der Name, mit dem ein Griff-Satz beginnt: „Ă (a cu căciulă)", „5", „cratimă (-)". */
function satzName(u: string): string {
  if (DIACRITICE[u]) return `${kappe(u)} (${DIACRITICE[u]})`;
  if (/^\p{L}$/u.test(u) || /^\d$/.test(u)) return kappe(u);
  return ZEICHEN[u] ? `${ZEICHEN[u]} (${u})` : u;
}

const SAETZE: GriffSaetze = {
  griff(u, lage, zugang, _layout, kombi) {
    const name = satzName(u);
    if (kombi) {
      const tot = ZEICHEN[kombi.tot] ?? kombi.tot;
      const mitZusatz = kombi.totZugang?.mod ? zusatz(kombi.totZugang) : "apasă ";
      const baza = kappe(u.normalize("NFD")[0]);
      return `${name}: mai întâi ${mitZusatz}tasta moartă ${tot}, apoi tasta ${baza}${lage ? ` (${lageText(lage)})` : ""}. ${MOARTA}`;
    }
    if (zugang?.dead) {
      if (zugang.base === u && !zugang.mod) return `${name}: ${lage ? lageText(lage) : "tasta ei"}. ${MOARTA}`;
      return `${name}: ${zusatz(zugang)}tasta ${kappe(zugang.base)}${lage ? ` (${lageText(lage)})` : ""}. ${MOARTA}`;
    }
    if (zugang && (zugang.mod || zugang.base !== u)) {
      return `${name}: ${zusatz(zugang)}tasta ${kappe(zugang.base)}${lage ? ` (${lageText(lage)})` : ""}.`;
    }
    if (lage) return `${name}: ${lageText(lage)}.`;
    return `${name}: locul ei pe această tastatură nu este încă descris.`;
  },
};

// ── Die Sonderteile ──────────────────────────────────────────────────────────

function shiftTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const grund =
    "Literele mari le scrii ținând apăsată tasta Shift cu cealaltă mână: pentru o literă din partea stângă a tastaturii, " +
    "tasta Shift din dreapta; pentru o literă din partea dreaptă, tasta Shift din stânga. Ambele taste Shift le apasă " +
    "degetul mic.";
  if (layout.access["Ș"]?.mod === "altgr") {
    return `${grund} Literele mari cu diacritice vin mai târziu: pe tastatura ta au nevoie de Alt Gr și de Shift deodată.`;
  }
  if (layout.rows.some((r) => r.keys.includes("ș"))) {
    return `${grund} Ă, Î, Â, Ș și Ț sunt toate în partea dreaptă: literele lor mari le scrii cu tasta Shift din stânga.`;
  }
  return grund;
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const fix = (text: string) => () => text;
const SIR = (t: readonly string[]) => `Șirul de bază: ${kappen(t)}`;

const BAUPLAENE: readonly LektionsBauplan[] = [
  {
    id: "ro-baza-1", kind: "home",
    // Falle 41: die Zeichen auf KeyF/KeyJ der Haupttastatur (auf `ro` f und j) - erst beim Bauen gelesen, nie beim Laden.
    get einheiten() {
      return [...heimZeichenDesWeges("ro")];
    },
    titel: SIR,
    vorspann: fix(
      "Pune degetele pe șirul de bază - aceasta este poziția de bază. Pe tastele F și J simți niște liniuțe în relief: " +
        "așa le găsești fără să te uiți la tastatură. Începi cu aceste două taste, cu cele două arătătoare. Fiecare deget " +
        "pleacă de aici și se întoarce aici.",
    ),
  },
  {
    id: "ro-baza-2", kind: "home", einheiten: ["d", "k"], titel: SIR,
    vorspann: fix("Lângă arătătoare vin mijlociii: D în stânga, K în dreapta. Arătătoarele rămân pe liniuțele în relief."),
  },
  {
    id: "ro-baza-3", kind: "home", einheiten: ["s", "l"], titel: SIR,
    vorspann: fix("Acum vin inelarele: S în stânga, L în dreapta. Degetele rămân relaxate și ușoare."),
  },
  {
    // Bauplan R2: auf `ro-prog` liegt hier `;` statt `ș` - der Text richtet sich nach den Tasten, die ankommen.
    id: "ro-baza-4", kind: "home", einheiten: ["a", "ș"],
    titel: (t) => `Tot șirul de bază: ${kappen(t)}`,
    vorspann: (t) =>
      t.includes("ș")
        ? "Degetul mic stâng merge pe A, degetul mic drept pe Ș, lângă L. Ș - s cu virgulă - are pe tastatura românească " +
          "tasta lui. Acum șirul de bază este complet: opt degete pe opt taste, degetele mari pe bara de spațiu. Primele " +
          "cuvinte: „las”, „sala”, „fals”, „șa” și „șal”."
        : "Degetul mic stâng merge pe A, degetul mic drept pe tasta de lângă L. Pe tastatura ta, acolo nu este o literă, ci " +
          "punct și virgulă - ș vine mai târziu, cu tasta Alt Gr. Acum șirul de bază este complet: opt degete pe opt taste, " +
          "degetele mari pe bara de spațiu. Primele cuvinte: „las”, „sala” și „fals”.",
  },
  {
    id: "ro-frecvente-1", kind: "letters", einheiten: ["e", "i"],
    titel: (t) => `Litere frecvente: ${kappen(t)}`,
    vorspann: fix(
      "E este cea mai frecventă literă din limba română, iar I vine imediat după ea. Cu E și I scrii deja: „deal”, „lei”, " +
        "„idee”, „file” și „seif”.",
    ),
  },
  {
    id: "ro-frecvente-2", kind: "letters", einheiten: ["t", "u"],
    titel: (t) => `Litere frecvente: ${kappen(t)}`,
    vorspann: fix("Cu T și U: „tu”, „sat”, „tata”, „sfat”, „stele” și „lut”."),
  },
  {
    id: "ro-frecvente-3", kind: "letters", einheiten: ["n", "r"],
    titel: (t) => `Litere frecvente: ${kappen(t)}`,
    vorspann: fix("Cu N și R: „nu”, „tren”, „unde”, „inel”, „sare” și „final”."),
  },
  {
    id: "ro-frecvente-4", kind: "letters", einheiten: ["c", "o"],
    titel: (t) => `Litere frecvente: ${kappen(t)}`,
    vorspann: fix("Cu C și O: „acolo”, „loc”, „cer”, „nor”, „cort” și „ocean”."),
  },
  {
    // Auf `ro-prog` kommt `ș` hierher (direkt nach `ă`): die zwei ersten Alt-Gr-Buchstaben zusammen (Bauplan R2).
    id: "ro-frecvente-5", kind: "letters", einheiten: ["m", "ă", "p"],
    titel: (t) => `Litere frecvente: ${kappen(t)}`,
    vorspann: (t) =>
      "Ă - a cu căciulă - este altă literă decât a: „casa” și „casă” sunt cuvinte diferite. Scrie: „mamă”, „apă”, „măr”, " +
      "„pom”, „copil” și „școală”." +
      (t.includes("ș")
        ? " Pe tastatura ta, ă și ș se scriu cu tasta Alt Gr: ține apăsată tasta Alt Gr cu degetul mare drept și apasă A " +
          "sau S. Sunt primele litere cu Alt Gr - celelalte trei vin mai târziu, la fel."
        : ""),
  },
  {
    id: "ro-majuscule", kind: "shift", einheiten: [], enablesShift: true,
    titel: () => "Litere mari cu tasta Shift",
    vorspann: fix(
      "Până acum, Tastenflow a scris literele mari în locul tău. De acum le scrie mâna ta: „Ana”, „Dan”, „Elena”, „Ion”, " +
        "„Arad” și „Cluj”. Cu literă mare la început scrii deja o propoziție întreagă: „Ana are mere”.",
    ),
    griffe: shiftTeil,
  },
  {
    id: "ro-punctuatie-1", kind: "punctuation", einheiten: [".", ",", "-", "?"],
    titel: () => "Punct, virgulă, cratimă și semnul întrebării: . , - ?",
    vorspann: fix(
      "Propoziția începe cu literă mare și se termină cu punct. Virgula o împarte în bucăți, semnul întrebării încheie o " +
        "întrebare. Cratima leagă cuvintele: „s-a”, „n-am”, „dă-mi”. Înainte de aceste semne nu pui spațiu, după ele da. " +
        "Încearcă: „Ce faci?” și „Da, e acasă.”",
    ),
  },
  {
    id: "ro-litere-1", kind: "letters", einheiten: ["v", "b"],
    titel: (t) => `Alte litere: ${kappen(t)}`,
    vorspann: fix("Cu V și B: „vara”, „bun”, „bine”, „vis”, „bunic” și „voce”."),
  },
  {
    id: "ro-litere-2", kind: "letters", einheiten: ["î", "ț"],
    titel: (t) => `Litere cu diacritice: ${kappen(t)}`,
    vorspann: fix(
      "Î - î din i - și Ț - t cu virgulă: „în”, „înainte”, „țară”, „ceață” și „mulțumesc”. Împreună cu cratima, î apare " +
        "des: „într-o” și „într-un”.",
    ),
  },
  {
    id: "ro-litere-3", kind: "letters", einheiten: ["g", "z"],
    titel: (t) => `Alte litere: ${kappen(t)}`,
    vorspann: fix("Cu G și Z: „zi”, „ziar”, „grădină”, „zăpadă” și „mergem”."),
  },
  {
    id: "ro-litere-4", kind: "letters", einheiten: ["â", "h"],
    titel: (t) => `Alte litere: ${kappen(t)}`,
    vorspann: fix(
      "Â - â din a - stă în interiorul cuvântului, î la început și la sfârșit. Cu Â și H: „pâine”, „câine”, „mâine”, " +
        "„hartă” și „hai”.",
    ),
  },
  {
    id: "ro-rare", kind: "letters", einheiten: ["y", "x", "w", "q"],
    titel: (t) => `Litere rare: ${kappen(t)}`,
    vorspann: fix(
      "Y, X, W și Q apar mai ales în nume și în cuvinte venite din alte limbi: „taxi”, „xilofon”, „yoga”, „kiwi”, " +
        "„sandwich” și „Qatar”.",
    ),
  },
  {
    id: "ro-punctuatie-2", kind: "punctuation", einheiten: ["!", ":", "„", "”", ";", "'", "(", ")"],
    titel: (t) => `Alte semne de punctuație: ${t.join(" ")}`,
    vorspann: fix(
      "Semnul exclamării încheie o exclamație, două puncte anunță o enumerare sau o explicație. Ghilimelele românești se " +
        "deschid jos și se închid sus. Parantezele închid o observație. Încearcă: „Bravo!”, „Atenție:” și „(notă)”.",
    ),
  },
  {
    id: "ro-cifre", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Șirul de cifre",
    vorspann: fix("Date, ore, prețuri și rezultate: acum vin cifrele. Fiecare deget urcă în coloana lui."),
  },
  {
    id: "ro-simboluri-1", kind: "symbols", einheiten: ["%", "/", "+", "=", "_", "*", "&", "$", "@", "#"],
    titel: (t) => `Simboluri: ${t.join(" ")}`,
    vorspann: fix("Aceste semne sunt pentru calcule, procente și lucrul la calculator. Aici precizia contează mai mult decât viteza."),
  },
  {
    id: "ro-simboluri-2", kind: "symbols", einheiten: ["^", "<", ">", "[", "]", "\\", "€"],
    titel: (t) => `Alte simboluri: ${t.join(" ")}`,
    vorspann: fix("Semne pentru prețuri, comparații și cod de programare. Sunt cele mai grele, de aceea vin la sfârșit."),
  },
  {
    id: "ro-texte", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Texte",
    vorspann: fix(
      "Acum toată tastatura este a ta și scrii texte întregi: de la Marea Neagră la Carpați, de la Chișinău la Timișoara, " +
        "povești despre școală, sport, animale și o zi obișnuită.",
    ),
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const RO_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/** Der GESCHRIEBENE erste Absatz einer Lektion (für den Beispielwort-Wächter). */
export function roLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return BAUPLAENE.find((b) => b.id === id)?.vorspann(tasten) ?? "";
}

/** Die rumänischen Pflicht-Tastaturen (G3b): Standard (Bezug) und Programmers. */
const RO_LAYOUTS: readonly LayoutId[] = ["ro", "ro-prog"];

const bauen = lektionenJeTastatur("ro", RO_LAYOUTS, BAUPLAENE, SAETZE);

/** Die Lektionen des Weges „ro" auf dieser Tastatur (gecacht; `introByLayout` trägt die andere Pflicht-Tastatur). */
export function roLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  return bauen(layoutId);
}
