/**
 * ★★★ DIE LEKTIONEN DES WEGES „el" (Griechisch) - F4-EL (29.10.2026), vorher leerer Einhängepunkt (G3c-VERTEILER).
 *
 * Bauart wie `curriculumRo.ts`; die Rechnung (Tasten je Lektion, Griffe aus den Daten der Tastatur, `introByLayout`) steht im
 * `lektionenBaukasten.ts`. Neu auf Griechisch geschrieben, nichts übersetzt. Begriffe nach dem Glossar
 * (`recherche-griechisch-2026-10-25/GLOSSAR-el.md` §1, §2.1, §2.8): *βασική σειρά*, *βασική θέση*, *ανάγλυφα σημάδια στο Φ και
 * στο Ξ*, *μικρό δάχτυλο · παράμεσος · μέσος · δείκτης · αντίχειρας*, *πλήκτρο*, *νεκρό πλήκτρο*, *τόνος*, *διαλυτικά*,
 * *τελικό σίγμα*, *ερωτηματικό* (`;`); Tastennamen lateinisch, nie gebeugt (Regel 11: „το Shift"); Kinder mit **εσύ** (Regel 1),
 * ohne Adjektiv am Kind (Regel 2); das Fragezeichen ist `;` - nie `?` im Text (Regel 7); keine Ano Teleia, nur der Bindestrich
 * `-`; Tonos auch auf Grossbuchstaben (darum `toUpperCase()` ohne Gebietsschema - `toLocaleUpperCase("el")` wirft ihn weg);
 * Beispielwörter in «…» (Regel 7).
 *
 * ── DIE REGEL (wie ro/hu/cs) ─────────────────────────────────────────────────────────────────────────────────────────
 * Die Tasten aller Lektionen hintereinander SIND `introOrder("el")` - auf `el` (Bezug), `el-220` und `el-319`. Die drei Totasten
 * `΄ ¨ ΅` sind EINHEITEN (`lernweg.ts#totastenZiele`): ein Buchstabe mit Tonos braucht `΄` UND seinen Grundbuchstaben. Die Griffe
 * werden gerechnet, nie geschrieben (`¨` ist auf `el` Shift + Tonos-Taste, auf `el-220` eine eigene Taste; `΅` auf `el-319`
 * Alt Gr + Tonos-Taste). Wächter: `tests/tastenflow-lektionen-el.test.ts`.
 */
import type { Lesson } from "./curriculum";
import type { FingerId, KeyAccess } from "./fingers";
import { heimZeichenDesWeges } from "./heimtasten";
import type { KeyboardLayout, LayoutId } from "./layouts";
import { fingerTeile, griffSatz, lektionenJeTastatur, type GriffSaetze, type Lage, type LektionsBauplan } from "./lektionenBaukasten";
import { kappeFuer } from "./sprachRegister";

const TONOS = "΄";
const DIALYTIKA = "¨";
const DIALYTIKA_TONOS = "΅";

// ── Namen ────────────────────────────────────────────────────────────────────

/** Was auf der Kappe steht: Buchstaben gross (ς bleibt ς), sonst das Zeichen. */
const kappe = (k: string): string => kappeFuer(k, "el");

/** „Φ και Ξ", „Α, Β και Γ". */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} και ${teile[teile.length - 1]}`;
}
const kappen = (t: readonly string[]): string => aufzaehlen(t.map(kappe));

/** Die Finger (Glossar §2.1): männlich ausser dem kleinen Finger (δάχτυλο, sächlich). */
const DAXTYLA: Record<"ring" | "mittel" | "zeige", string> = { ring: "παράμεσος", mittel: "μέσος", zeige: "δείκτης" };

/** „αριστερός δείκτης", „δεξί μικρό δάχτυλο", „αντίχειρας". */
function fingerName(f: FingerId): string {
  const { hand, art } = fingerTeile(f);
  if (hand === null || art === "daumen") return "αντίχειρας";
  const links = hand === "links";
  if (art === "kleiner") return links ? "αριστερό μικρό δάχτυλο" : "δεξί μικρό δάχτυλο";
  return `${links ? "αριστερός" : "δεξιός"} ${DAXTYLA[art]}`;
}

/** „το πλήκτρο Φ", „το πλήκτρο τόνου". */
function plektro(k: string): string {
  if (k === TONOS) return "το πλήκτρο τόνου";
  if (k === DIALYTIKA) return "το πλήκτρο των διαλυτικών";
  // Die Kappe mancher Tastaturen trägt U+037E (griechisches Fragezeichen) - im Text immer U+003B (Glossar Regel 7, NFC).
  return `το πλήκτρο ${kappe(k.normalize("NFC"))}`;
}

const SEIRES = ["στη σειρά αριθμών", "στην πάνω σειρά", "στη βασική σειρά", "στην κάτω σειρά"];
const POSA: Readonly<Record<number, string>> = { 2: "δύο", 3: "τρία", 4: "τέσσερα", 5: "πέντε", 6: "έξι" };

/** „δεξιά από το πλήκτρο Φ", „δύο πλήκτρα αριστερά από το πλήκτρο Ξ". */
function lateral(l: Lage): string {
  const meria = l.richtung === "links" ? "αριστερά" : "δεξιά";
  const weit = l.abstand >= 2 ? `${POSA[l.abstand] ?? String(l.abstand)} πλήκτρα ` : "";
  return `${weit}${meria} από ${plektro(l.heim ?? "")}`;
}

/** Finger und Lage, z. B. „αριστερός δείκτης, δεξιά από το πλήκτρο Φ". */
function lageText(l: Lage): string {
  const finger = fingerName(l.finger);
  if (l.istHeim) return `${finger}, βασική θέση`;
  if (!l.heim) return `${finger}, ${SEIRES[l.reihe]}`;
  if (l.reihe === 2) return `${finger}, ${lateral(l)}`;
  if (l.abstand === 0) {
    return `${finger}, ${SEIRES[l.reihe]}, ${l.reihe === 3 ? "ακριβώς κάτω από" : "ακριβώς πάνω από"} ${plektro(l.heim)}`;
  }
  return `${finger}, ${SEIRES[l.reihe]}, ${lateral(l)}`;
}

function zusatz(z: KeyAccess): string {
  if (z.mod === "shift") return "κράτα πατημένο το Shift με το άλλο χέρι και πάτησε ";
  if (z.mod === "altgr") return "κράτα πατημένο το Alt Gr και πάτησε ";
  return "πάτησε ";
}

const NEKRO =
  "Είναι νεκρό πλήκτρο: μόνο του δεν γράφει τίποτα, βάζει το σημάδι του στο φωνήεν που πατάς αμέσως μετά.";

/** Zeichennamen der Sprachausgabe (Glossar §2.8, `SPOKEN_EL`): der Name steht vor dem Zeichen. */
const SIMEIA: Readonly<Record<string, string>> = {
  ".": "τελεία", ",": "κόμμα", ";": "ερωτηματικό", ":": "άνω κάτω τελεία", "!": "θαυμαστικό", "\"": "εισαγωγικά",
  "'": "απόστροφος", "-": "παύλα", "(": "άνοιγμα παρένθεσης", ")": "κλείσιμο παρένθεσης", "%": "τοις εκατό", "/": "κάθετος",
  "+": "συν", "=": "ίσον", "*": "αστερίσκος", "_": "κάτω παύλα", "$": "δολάριο", "€": "ευρώ", "«": "άνοιγμα εισαγωγικών",
  "»": "κλείσιμο εισαγωγικών", [TONOS]: "τόνος", [DIALYTIKA]: "διαλυτικά", [DIALYTIKA_TONOS]: "διαλυτικά και τόνος",
};

/** Der Satz beginnt gross, MIT Tonos („Άνω κάτω τελεία") - `toUpperCase()` ohne Gebietsschema behält ihn. */
const gross = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** Der Name, mit dem ein Griff-Satz beginnt: „ς (τελικό σίγμα)", „5", „Κόμμα (,)", „Τόνος (΄)". */
function satzName(u: string): string {
  if (u === "ς") return "ς (τελικό σίγμα)";
  if (/^\p{L}$/u.test(u) || /^\d$/.test(u)) return kappe(u);
  return SIMEIA[u] ? `${gross(SIMEIA[u])} (${u})` : u;
}

const SAETZE: GriffSaetze = {
  griff(u, lage, zugang, _layout, kombi) {
    const name = satzName(u);
    if (kombi) {
      const mitZusatz = kombi.totZugang?.mod ? zusatz(kombi.totZugang) : "πάτησε ";
      return `${name}: πρώτα ${mitZusatz}${plektro(kombi.totZugang?.base ?? kombi.tot)}, μετά ${plektro(u.normalize("NFD")[0])}${lage ? ` (${lageText(lage)})` : ""}.`;
    }
    if (zugang?.dead) {
      if (zugang.base === u && !zugang.mod) return `${name}: ${lage ? lageText(lage) : "δικό του πλήκτρο"}. ${NEKRO}`;
      return `${name}: ${zusatz(zugang)}${plektro(zugang.base)}${lage ? ` (${lageText(lage)})` : ""}. ${NEKRO}`;
    }
    if (zugang && (zugang.mod || zugang.base !== u)) {
      return `${name}: ${zusatz(zugang)}${plektro(zugang.base)}${lage ? ` (${lageText(lage)})` : ""}.`;
    }
    if (lage) return `${name}: ${lageText(lage)}.`;
    return `${name}: η θέση του σε αυτό το πληκτρολόγιο δεν έχει περιγραφεί ακόμα.`;
  },
};

const griffeVon = (t: readonly string[], layout: KeyboardLayout): string => t.map((u) => griffSatz("el", layout, u, SAETZE)).join(" ");

// ── Die Sonderteile ──────────────────────────────────────────────────────────

function shiftTeil(t: readonly string[], layout: KeyboardLayout): string {
  const grund =
    "Τα κεφαλαία τα γράφεις κρατώντας πατημένο το Shift με το άλλο χέρι. Για γράμμα από το αριστερό μισό του " +
    "πληκτρολογίου πατάς το δεξί Shift, για γράμμα από το δεξί μισό το αριστερό Shift. Και τα δύο Shift τα πατάει το μικρό " +
    "δάχτυλο. Κεφαλαίο με τόνο: πρώτα ο τόνος, μετά το Shift και το φωνήεν.";
  return `${grund} ${griffeVon(t, layout)}`;
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const fix = (text: string) => () => text;
const SEIRA = (t: readonly string[]) => `Βασική σειρά: ${kappen(t)}`;
const NEA = (t: readonly string[]) => `Νέα γράμματα: ${kappen(t)}`;

const BAUPLAENE: readonly LektionsBauplan[] = [
  {
    id: "el-vasiki-1", kind: "home",
    // Falle 41: die Zeichen auf KeyF/KeyJ der Haupttastatur (auf `el` φ und ξ) - erst beim Bauen gelesen, nie beim Laden.
    get einheiten() {
      return [...heimZeichenDesWeges("el")];
    },
    titel: SEIRA,
    vorspann: fix(
      "Βάλε τα δάχτυλα στη βασική σειρά - αυτή είναι η βασική θέση. Στα πλήκτρα Φ και Ξ νιώθεις μικρά ανάγλυφα σημάδια: " +
        "με αυτά βρίσκεις τη βασική θέση χωρίς να κοιτάς το πληκτρολόγιο. Ξεκινάς με αυτά τα δύο πλήκτρα, με τους δύο " +
        "δείκτες. Κάθε δάχτυλο ξεκινά από εδώ και γυρίζει εδώ.",
    ),
  },
  {
    id: "el-vasiki-2", kind: "home", einheiten: ["δ", "κ"], titel: SEIRA,
    vorspann: fix("Δίπλα στους δείκτες έρχονται οι μέσοι: Δ αριστερά, Κ δεξιά. Οι δείκτες μένουν στα ανάγλυφα σημάδια."),
  },
  {
    id: "el-vasiki-3", kind: "home", einheiten: ["σ", "λ", "α"], titel: SEIRA,
    vorspann: fix(
      "Τώρα οι παράμεσοι, Σ και Λ, και το αριστερό μικρό δάχτυλο στο Α. Τα δάχτυλα μένουν χαλαρά και ελαφριά. Οι αντίχειρες " +
        "ακουμπούν στο πλήκτρο διαστήματος.",
    ),
  },
  {
    id: "el-fonienta", kind: "letters", einheiten: ["ε", "ο", "ι"],
    titel: (t) => `Φωνήεντα: ${kappen(t)}`,
    vorspann: fix(
      "Ε, Ο και Ι είναι στην πάνω σειρά. Είναι φωνήεντα - χωρίς αυτά δεν γράφεται σχεδόν καμία λέξη. Οι πρώτες λέξεις: " +
        "«και», «σε» και «δε».",
    ),
  },
  {
    id: "el-tonos", kind: "letters", einheiten: [TONOS],
    titel: () => "Ο τόνος",
    vorspann: fix(
      "Ο τόνος είναι το όγδοο βασικό πλήκτρο, δίπλα στο Λ, κάτω από το δεξί μικρό δάχτυλο. Πρώτα πατάς τον τόνο και μετά το " +
        "φωνήεν. Ο τόνος μπαίνει μόνο σε φωνήεντα. Τώρα γράφεις: «καλά», «φίλε», «φίδι», «δέκα», «λάδι» και «σόδα».",
    ),
  },
  {
    id: "el-grammata-1", kind: "letters", einheiten: ["ν", "τ", "η"], titel: NEA,
    vorspann: fix("Με Ν, Τ και Η: «ένα», «νησί», «κάνει», «τι» και «νίκη»."),
  },
  {
    id: "el-grammata-2", kind: "letters", einheiten: ["υ", "μ", "π"], titel: NEA,
    vorspann: fix("Με Υ, Μ και Π: «μήλο», «πόδι», «μπάλα», «σπίτι» και «αυτό»."),
  },
  {
    id: "el-grammata-3", kind: "letters", einheiten: ["ρ", "ς", "γ"], titel: NEA,
    vorspann: fix(
      "Το σίγμα στο τέλος της λέξης γράφεται ς - τελικό σίγμα - και έχει δικό του πλήκτρο. Με Ρ, ς και Γ: «νερό», «γάτα», " +
        "«καλός», «ήλιος» και «τρένο».",
    ),
  },
  {
    id: "el-grammata-4", kind: "letters", einheiten: ["ω", "θ", "χ"], titel: NEA,
    vorspann: fix("Με Ω, Θ και Χ: «ώρα», «χαρά», «θάλασσα» και «σχολείο»."),
  },
  {
    id: "el-grammata-5", kind: "letters", einheiten: ["β", "ζ", "ψ"], titel: NEA,
    vorspann: fix("Με Β, Ζ και Ψ όλο το αλφάβητο είναι δικό σου: «βιβλίο», «ψωμί», «ψάρι», «ζώο» και «βουνό»."),
  },
  {
    id: "el-kefalaia", kind: "shift", einheiten: [".", ","], enablesShift: true,
    titel: () => "Κεφαλαία, τελεία και κόμμα",
    vorspann: fix(
      "Μέχρι τώρα το Tastenflow έγραφε τα κεφαλαία για σένα. Από τώρα τα γράφει το χέρι σου: «Ελένη», «Νίκος», «Μαρία», " +
        "«Άννα», «Αθήνα» και «Κρήτη». Η πρόταση αρχίζει με κεφαλαίο και τελειώνει με τελεία. Το κόμμα χωρίζει την πρόταση " +
        "σε κομμάτια.",
    ),
    griffe: shiftTeil,
  },
  {
    // Bauplan E1/E8: `;` ist das griechische Fragezeichen (auf `el` die Taste Q, auf `el-220`/`el-319` Shift + Komma).
    id: "el-erotimatiko", kind: "punctuation", einheiten: [";", ":"],
    titel: () => "Ερωτηματικό και άνω κάτω τελεία: ; :",
    vorspann: fix(
      "Στα ελληνικά η ερώτηση τελειώνει με το ερωτηματικό: ένα κόμμα με μια τελεία από πάνω. Η άνω κάτω τελεία ανοίγει μια " +
        "απαρίθμηση ή μια εξήγηση. Πριν από αυτά τα σημεία δεν μπαίνει διάστημα, μετά μπαίνει. Δοκίμασε: «Τι κάνεις;» και " +
        "«Πού είσαι;»",
    ),
  },
  {
    id: "el-dialytika", kind: "letters", einheiten: [DIALYTIKA, DIALYTIKA_TONOS],
    titel: () => "Διαλυτικά",
    vorspann: fix(
      "Τα διαλυτικά δείχνουν ότι δύο φωνήεντα δεν διαβάζονται μαζί: «προϊόν» και «αϋπνία». Με διαλυτικά και τόνο μαζί: " +
        "«πρωτεΐνη» και «Μαΐου». Είναι νεκρά πλήκτρα, όπως ο τόνος.",
    ),
  },
  {
    id: "el-stixi", kind: "punctuation", einheiten: ["!", "\"", "'", "-", "(", ")"],
    titel: (t) => `Σημεία στίξης: ${t.join(" ")}`,
    vorspann: fix(
      "Το θαυμαστικό κλείνει ένα επιφώνημα. Η παύλα ενώνει λέξεις και οι παρενθέσεις κλείνουν μια σημείωση. Δοκίμασε: " +
        "«Μπράβο!» και «Γεια σου!»",
    ),
  },
  {
    id: "el-arithmoi", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Σειρά αριθμών",
    vorspann: fix("Ημερομηνίες, ώρες, τιμές και αποτελέσματα: τώρα έρχονται τα ψηφία. Κάθε δάχτυλο ανεβαίνει στη δική του στήλη."),
  },
  {
    id: "el-symvola", kind: "symbols", einheiten: ["%", "/", "+", "=", "*", "_", "$", "€", "«", "»"],
    titel: (t) => `Σύμβολα: ${t.join(" ")}`,
    vorspann: fix(
      "Αυτά τα σύμβολα χρειάζονται για πράξεις, ποσοστά και τιμές. Στο τέλος έρχονται τα ελληνικά εισαγωγικά. Εδώ η " +
        "ακρίβεια μετράει περισσότερο από την ταχύτητα.",
    ),
  },
  {
    id: "el-keimena", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Κείμενα",
    vorspann: fix(
      "Τώρα όλο το πληκτρολόγιο είναι δικό σου και γράφεις ολόκληρα κείμενα: για τα νησιά και τα βουνά, για την Αθήνα, τη " +
        "Θεσσαλονίκη και τη Λευκωσία, για το σχολείο, τον αθλητισμό, τα ζώα και μια συνηθισμένη μέρα.",
    ),
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const EL_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/** Der GESCHRIEBENE erste Absatz einer Lektion (für den Beispielwort-Wächter). */
export function elLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return BAUPLAENE.find((b) => b.id === id)?.vorspann(tasten) ?? "";
}

/** Die griechischen Pflicht-Tastaturen (G3b): Greek (Bezug), Greek (220), Greek (319). */
const EL_LAYOUTS: readonly LayoutId[] = ["el", "el-220", "el-319"];

const bauen = lektionenJeTastatur("el", EL_LAYOUTS, BAUPLAENE, SAETZE);

/** Die Lektionen des Weges „el" auf dieser Tastatur (gecacht; `introByLayout` trägt die anderen Pflicht-Tastaturen). */
export function elLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  return bauen(layoutId);
}
