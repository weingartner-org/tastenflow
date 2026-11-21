/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TASTEN IN GRIECHISCH - „Tasten erkunden", Tastennamen, Suchrunde.
 * ★ O-INHALT-EL (29.10.2026): gefüllt - Vorbild `tastenErklaerungEn.ts` (dieselben Fächer, Eintrag für Eintrag), neu auf Griechisch
 * geschrieben nach dem Glossar `recherche-griechisch-2026-10-25/GLOSSAR-el.md`.
 *
 * Was hier steht, liest der Verteiler `tastenErklaerung.ts` über {@link TASTEN_SATZ_EL}, die Bauteile `LetterMap.tsx`,
 * `PupilStatsPanel.tsx`, `TastenflowReiter.tsx` über {@link unitLabelEl} und `TastenErkunden.tsx` über {@link suchSatzEl}. Noch NICHT
 * angeschlossen (Etappe O, gemeinsame Dateien): die Rahmensätze in `findenRunde.ts`, `StandZeile.tsx`, `TastenErkunden.tsx` und die
 * Wörter `ALTGR_WORT`/`SHIFT_WORT`/Tastmarke im Verteiler.
 *
 * ── Die Regeln der Sätze (Glossar §1) ──────────────────────────────────────
 *  · Ein Kind liest „εσύ" (Regel 1): „Πάτησε …". Verben verraten kein Geschlecht (Regel 2) - auch der Aorist nicht („Το βρήκες!");
 *    kein Adjektiv am Kind, Adjektive nur am Ding („πατημένο" am Shift).
 *  · Tastennamen LATEINISCH wie auf der Kappe, sächlich und ungebeugt (Regel 11, §2.9): „το πλήκτρο Shift", „με το Ctrl"; griechisch
 *    sind nur „πλήκτρο διαστήματος", die Pfeile („Αριστερό βέλος") und „πλήκτρο Windows". Die rechte Alt-Taste heisst „Alt Gr".
 *  · Fragezeichen ist `;` (U+003B), nie `?` in einem griechischen Satz (Regel 7). Kein Apostroph, kein Gedankenpunkt, nur Bindestrich.
 *  · Ohne Maus (Regel 8), keine Anführungszeichen in Live-Zeilen (Regel 7), Knopfnamen wie „Αρχική" nie für Home (Regel 10).
 *  · Gross mit `toUpperCase()` ohne Sprache - `toLocaleUpperCase("el")` nähme den Tonos weg (Regel 7).
 * ⚠️ [G]: von einer Person mit Griechisch als Erstsprache gegenzulesen (Glossar §5).
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import type { LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";
import type { TastenErklaerungSatz } from "./tastenErklaerungSatz";
import type { AKZENTE_EN } from "./tastenErklaerungEn";
import { SHIFT_UNIT, unitKindImWeg } from "./letters";
import type { Lernweg } from "./lernweg";
import { grossFuer, istBuchstabe } from "./sprachRegister";

/** Halbgeviertstrich als Zeichencode - das Zeichen ist hier die SACHE (eine Taste), kein vorgelesener Text (Strich-Wächter). */
const HALBGEVIERT = String.fromCharCode(0x2013);

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/** „Στο γερμανικό πληκτρολόγιο γράφει Strg." - nur bei eingestellter deutscher Tastatur (Glossar §2.9). */
function deutscheAufschrift(layout: LayoutId, wort: string): string[] {
  return layout === "de" ? [`Στο γερμανικό πληκτρολόγιο γράφει ${wort}.`] : [];
}

/** Griechische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteEl(id: string, plattform: Plattform, layout: LayoutId = "de"): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Option" : "Ctrl";
  switch (id) {
    case "tabulator":
      return {
        kurz: null,
        name: "πλήκτρο Tab",
        was: [
          "πηγαίνει από ένα στοιχείο στο επόμενο, για παράδειγμα σε σύνδεσμο, πεδίο ή κουμπί.",
          "Με το Shift πηγαίνει πίσω.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? { kurz: null, name: "πλήκτρο Return", was: ["επιβεβαιώνει και στέλνει.", "Ανοίγει συνδέσμους και αρχίζει νέα γραμμή σε κείμενο."] }
        : {
            kurz: null,
            name: "πλήκτρο Enter",
            was: ["επιβεβαιώνει και στέλνει.", "Ανοίγει συνδέσμους, πατάει κουμπιά και αρχίζει νέα γραμμή σε κείμενο."],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "πλήκτρο διαστήματος",
        was: ["αφήνει κενό ανάμεσα σε δύο λέξεις.", "Πατάει επίσης κουμπιά και επιλέγει πλαίσια ελέγχου."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: "πλήκτρο Backspace",
        was: ["σβήνει τον χαρακτήρα αριστερά από τον δρομέα.", "Έτσι διορθώνεις ένα λάθος."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "πλήκτρο διαγραφής προς τα δεξιά",
            was: ["σβήνει τον χαρακτήρα δεξιά από τον δρομέα.", "Αν το πληκτρολόγιο δεν το έχει, πάτησε Fn και Delete."],
          }
        : {
            kurz: "Del",
            name: "πλήκτρο Delete",
            was: [
              "σβήνει τον χαρακτήρα δεξιά από τον δρομέα.",
              "Διαγράφει και επιλεγμένα αρχεία.",
              ...deutscheAufschrift(layout, "Entf"),
            ],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "πλήκτρο Escape",
        was: ["ακυρώνει.", "Κλείνει μενού, παράθυρα και μηνύματα.", "Στο Tastenflow σε γυρίζει στο πεδίο γραφής."],
      };
    case "umschalt":
      return {
        kurz: null,
        name: "πλήκτρο Shift",
        was: [
          "γράφει κεφαλαία όσο το κρατάς πατημένο.",
          "Δίνει και το πάνω σύμβολο ενός πλήκτρου, για παράδειγμα την άνω κάτω τελεία.",
        ],
      };
    case "feststell":
      return { kurz: null, name: "πλήκτρο Caps Lock", was: ["γράφει τα πάντα με κεφαλαία, ώσπου να το πατήσεις ξανά."] };
    case "pfeil-links":
      return {
        kurz: null,
        name: "Αριστερό βέλος",
        was: ["μετακινεί τον δρομέα έναν χαρακτήρα αριστερά.", `Με το ${pfeilWort} πηγαίνει μια ολόκληρη λέξη.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "Δεξιό βέλος",
        was: ["μετακινεί τον δρομέα έναν χαρακτήρα δεξιά.", `Με το ${pfeilWort} πηγαίνει μια ολόκληρη λέξη.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "Επάνω βέλος",
        was: [
          "μετακινεί τον δρομέα μία γραμμή πάνω.",
          "Σε λίστες και μενού πηγαίνει στο προηγούμενο στοιχείο.",
          `Με το ${pfeilWort} πηγαίνει μια ολόκληρη παράγραφο πάνω.`,
        ],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "Κάτω βέλος",
        was: [
          "μετακινεί τον δρομέα μία γραμμή κάτω.",
          "Σε λίστες και μενού πηγαίνει στο επόμενο στοιχείο.",
          `Με το ${pfeilWort} πηγαίνει μια ολόκληρη παράγραφο κάτω.`,
        ],
      };
    case "pos1":
      return {
        kurz: null,
        name: "πλήκτρο Home",
        was: [
          "πηγαίνει στην αρχή της γραμμής.",
          "Σε μια ιστοσελίδα πηγαίνει τέρμα πάνω.",
          "Με το Ctrl πηγαίνει στην αρχή όλου του κειμένου.",
          ...deutscheAufschrift(layout, "Pos 1"),
        ],
      };
    case "ende":
      return {
        kurz: null,
        name: "πλήκτρο End",
        was: [
          "πηγαίνει στο τέλος της γραμμής.",
          "Σε μια ιστοσελίδα πηγαίνει τέρμα κάτω.",
          "Με το Ctrl πηγαίνει στο τέλος όλου του κειμένου.",
          ...deutscheAufschrift(layout, "Ende"),
        ],
      };
    case "bild-auf":
      return { kurz: "PgUp", name: "πλήκτρο Page Up", was: ["ανεβαίνει μία οθόνη.", ...deutscheAufschrift(layout, "Bild ↑")] };
    case "bild-ab":
      return { kurz: "PgDn", name: "πλήκτρο Page Down", was: ["κατεβαίνει μία οθόνη.", ...deutscheAufschrift(layout, "Bild ↓")] };
    case "einfg":
      return {
        kurz: "Ins",
        name: "πλήκτρο Insert",
        was: [
          "είναι το πλήκτρο του αναγνώστη οθόνης για το NVDA και το JAWS.",
          "Σχεδόν κάθε εντολή του αναγνώστη οθόνης αρχίζει με αυτό.",
          ...deutscheAufschrift(layout, "Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "πλήκτρο Control",
        was: [
          "είναι για συνδυασμούς πλήκτρων.",
          "Ctrl + C αντιγράφει, Ctrl + V επικολλά, Ctrl + Z αναιρεί.",
          "Μόνο του σταματά αμέσως τη φωνή.",
          ...deutscheAufschrift(layout, "Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "πλήκτρο Alt",
        was: ["είναι για συνδυασμούς πλήκτρων.", "Alt + Tab αλλάζει παράθυρο.", "Στο Tastenflow το Alt + H ανοίγει τη βοήθεια."],
      };
    case "altgr":
      return {
        kurz: null,
        name: "πλήκτρο Alt Gr",
        was: [
          // Στο βρετανικό πληκτρολόγιο το ευρώ είναι στο Alt Gr + 4, στο ελληνικό, γερμανικό και ελβετικό στο Alt Gr + E.
          `γράφει το τρίτο σύμβολο ενός πλήκτρου, για παράδειγμα το ευρώ με Alt Gr + ${layout === "uk" ? "4" : "E"}.`,
        ],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "πλήκτρο Windows",
        was: [
          "ανοίγει το μενού Έναρξη.",
          "Πάτησέ το ξανά για να κλείσει.",
          "Μαζί με άλλα πλήκτρα κάνει κι άλλα, για παράδειγμα το Win + D δείχνει την επιφάνεια εργασίας.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "cmd",
        name: "πλήκτρο Command",
        was: ["είναι για συνδυασμούς πλήκτρων.", "cmd + C αντιγράφει, cmd + V επικολλά, cmd + Z αναιρεί."],
      };
    case "wahltaste":
      return {
        kurz: null,
        name: "πλήκτρο Option",
        was: ["γράφει σύμβολα, για παράδειγμα το παπάκι.", "Με τα βέλη πηγαίνει μια ολόκληρη λέξη."],
      };
    case "ctrl":
      return {
        kurz: "ctrl",
        name: "πλήκτρο Control",
        was: ["είναι μέρος των συνδυασμών πλήκτρων στο Mac.", "Μόνο του σταματά τη φωνή του VoiceOver."],
      };
    case "fn":
      return {
        kurz: "fn",
        name: "πλήκτρο Fn",
        was: ["δίνει σε άλλα πλήκτρα μια δεύτερη δουλειά, για παράδειγμα να δυναμώνουν και να χαμηλώνουν τον ήχο."],
      };
    default:
      return null;
  }
}

/** Wie die Taste in einer KOMBINATION und gross in der Mitte heisst. */
export const TASTE_KURZ_EL: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Return",
  leertaste: "διάστημα",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "Αριστερό βέλος",
  "pfeil-rechts": "Δεξιό βέλος",
  "pfeil-auf": "Επάνω βέλος",
  "pfeil-ab": "Κάτω βέλος",
  pos1: "Home",
  ende: "End",
  "bild-auf": "Page Up",
  "bild-ab": "Page Down",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "Alt Gr",
  "windows-taste": "Win",
  befehlstaste: "cmd",
  wahltaste: "Option",
  ctrl: "ctrl",
  fn: "fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_EL: Readonly<Record<string, readonly string[]>> = {
  F1: ["ανοίγει τη βοήθεια σε πολλά προγράμματα."],
  F2: ["μετονομάζει ένα επιλεγμένο αρχείο."],
  F3: ["ξεκινά αναζήτηση."],
  F4: ["μαζί με το Alt κλείνει το παράθυρο."],
  F5: ["ανανεώνει την ιστοσελίδα.", "Εδώ δεν γίνεται τίποτα, μπορείς να συνεχίσεις."],
  F6: ["πηγαίνει στη γραμμή διευθύνσεων του προγράμματος περιήγησης."],
  F7: ["ελέγχει την ορθογραφία στο Word."],
  F10: ["πηγαίνει στη γραμμή μενού σε πολλά προγράμματα."],
  F11: ["ανοίγει και κλείνει την πλήρη οθόνη στο πρόγραμμα περιήγησης.", "Σε φορητό υπολογιστή συχνά μαζί με το Fn."],
  F12: ["ανοίγει το παράθυρο Αποθήκευση ως στο Word."],
};

/** Griechisch zu `nachKey` - F-Tasten, Num, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyEl(key: string, plattform: Plattform, layout: LayoutId = "de"): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? ["έχει δική του δουλειά σε κάποια προγράμματα.", "Στο Mac αυτά τα πλήκτρα συχνά ρυθμίζουν τη φωτεινότητα και την ένταση."]
        : (F_TASTEN_WINDOWS_EL[key] ?? ["έχει δική του δουλειά σε κάποια προγράμματα."]);
    return { kurz: key, name: "πλήκτρο λειτουργίας", was };
  }
  switch (key) {
    case "Home":
      return sondertasteEl("pos1", "windows", layout);
    case "End":
      return sondertasteEl("ende", "windows", layout);
    case "PageUp":
      return sondertasteEl("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteEl("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteEl("einfg", "windows", layout);
    case "NumLock":
      return { kurz: null, name: "πλήκτρο Num Lock", was: ["ανοίγει και κλείνει τους αριθμούς στο αριθμητικό πληκτρολόγιο."] };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`).
    case "Clear":
      return {
        kurz: "5",
        name: "πλήκτρο 5 στο αριθμητικό πληκτρολόγιο",
        was: ["γράφει 5 όταν το Num Lock είναι ανοιχτό.", "Τώρα το Num Lock είναι κλειστό, οπότε δεν κάνει τίποτα."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "πλήκτρο μενού",
        was: ["ανοίγει ένα μενού με εντολές για το σημείο όπου βρίσκεσαι.", "Το Shift + F10 κάνει το ίδιο."],
      };
    case "PrintScreen":
      return {
        kurz: null,
        name: "πλήκτρο Print Screen",
        was: ["φωτογραφίζει την οθόνη.", "Στα Windows ανοίγει συχνά ένα εργαλείο για στιγμιότυπα.", "Το Esc το κλείνει ξανά."],
      };
    case "ScrollLock":
      return { kurz: null, name: "πλήκτρο Scroll Lock", was: ["σήμερα δεν χρειάζεται σχεδόν ποτέ."] };
    case "Pause":
      return { kurz: null, name: "πλήκτρο Pause", was: ["σήμερα δεν χρειάζεται σχεδόν ποτέ."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "πλήκτρο αύξησης έντασης", was: ["δυναμώνει τον ήχο."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "πλήκτρο μείωσης έντασης", was: ["χαμηλώνει τον ήχο."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "πλήκτρο σίγασης", was: ["κλείνει τον ήχο και μετά τον ανοίγει ξανά."] };
    case "Fn":
      return sondertasteEl("fn", plattform, layout);
    case "Dead":
      return {
        kurz: null,
        name: "νεκρό πλήκτρο",
        was: ["βάζει ένα σημάδι στο επόμενο γράμμα, για παράδειγμα τον τόνο στο ά.", "Το σημάδι φαίνεται μόνο με το επόμενο γράμμα."],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

const ERSCHEINT_SPAETER_EL = "Το σημάδι φαίνεται μόνο με το επόμενο γράμμα.";

/** Die vier bekannten Akzente (der deutschen und französischen Tastatur) - nach derselben Kennung wie die deutsche Tabelle. */
export const AKZENTE_EL: typeof AKZENTE_EN = {
  zirkumflex: { name: "καπελάκι", was: ["βάζει ένα μικρό καπέλο πάνω στο επόμενο γράμμα, για παράδειγμα ê.", ERSCHEINT_SPAETER_EL] },
  // ★ O2-TASTATUR (30.10.2026): auf den griechischen Tastaturen ist das der Tonos, nie „οξεία" (das ist die polytonische Fachsprache).
  akut: { name: "τόνος", was: ["βάζει τον τόνο στο επόμενο γράμμα, για παράδειγμα ά.", ERSCHEINT_SPAETER_EL] },
  gravis: { name: "βαρεία", was: ["βάζει μια γραμμή προς τα πάνω αριστερά στο επόμενο γράμμα, για παράδειγμα è.", ERSCHEINT_SPAETER_EL] },
  trema: { name: "διαλυτικά", was: ["βάζει δύο τελείες στο επόμενο γράμμα, για παράδειγμα ϊ.", ERSCHEINT_SPAETER_EL] },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMMIEREN_EL = ["χρησιμοποιείται στον προγραμματισμό."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`, dazu die Zeichen der griechischen Tastatur (« » · ΄ ΅). Namen nach Glossar
 * §2.8 (NVDA `symbols.dic` el): `;` ist im Griechischen das FRAGEZEICHEN („ερωτηματικό"), `?` heisst „αγγλικό ερωτηματικό".
 */
export const ZEICHEN_EL: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { name: "τελεία", was: ["μπαίνει στο τέλος της πρότασης."] },
  ",": { name: "κόμμα", was: ["χωρίζει τα μέρη μιας πρότασης."] },
  ";": { name: "ερωτηματικό", was: ["στα ελληνικά μπαίνει στο τέλος μιας ερώτησης.", "Στα αγγλικά χωρίζει δύο μέρη μιας πρότασης."] },
  "?": { name: "αγγλικό ερωτηματικό", was: ["μπαίνει στο τέλος μιας ερώτησης στα αγγλικά και σε άλλες γλώσσες."] },
  "!": { name: "θαυμαστικό", was: ["μπαίνει μετά από ένα επιφώνημα."] },
  ":": { name: "άνω κάτω τελεία", was: ["εισάγει κάτι, για παράδειγμα μια απαρίθμηση."] },
  "·": { name: "άνω τελεία", was: ["χωρίζει δύο μέρη μιας πρότασης πιο έντονα από το κόμμα."] },
  "-": { name: "παύλα", was: ["ενώνει λέξεις, για παράδειγμα στο ελληνο-αγγλικό."] },
  [HALBGEVIERT]: { name: "μεσαία παύλα", was: ["χωρίζει ένα κομμάτι της πρότασης.", "Είναι πιο μακριά από την παύλα."] },
  "@": { name: "παπάκι", was: ["υπάρχει σε κάθε διεύθυνση email."] },
  "+": { name: "συν", was: ["σημαίνει συν στις πράξεις.", "Στους συνδυασμούς πλήκτρων σημαίνει: πάτα μαζί."] },
  "*": { name: "αστερίσκος", was: ["στον υπολογιστή σημαίνει επί."] },
  "/": { name: "κάθετος", was: ["στον υπολογιστή σημαίνει διά.", "Υπάρχει και στις διευθύνσεις των ιστοσελίδων."] },
  "=": { name: "ίσον", was: ["μπαίνει πριν από το αποτέλεσμα μιας πράξης."] },
  "'": { name: "απόστροφος", was: ["δείχνει ότι λείπει ένα γράμμα."] },
  '"': { name: "εισαγωγικά", was: ["μπαίνουν πριν και μετά από αυτό που λέει κάποιος."] },
  "«": { name: "άνοιγμα εισαγωγικών", was: ["ανοίγει τα λόγια κάποιου σε ελληνικό κείμενο."] },
  "»": { name: "κλείσιμο εισαγωγικών", was: ["κλείνει τα λόγια κάποιου σε ελληνικό κείμενο."] },
  "“": { name: "άνοιγμα αγγλικών εισαγωγικών", was: ["ανοίγει τα λόγια κάποιου σε αγγλικό κείμενο."] },
  "”": { name: "κλείσιμο αγγλικών εισαγωγικών", was: ["κλείνει τα λόγια κάποιου σε αγγλικό κείμενο."] },
  "(": { name: "άνοιγμα παρένθεσης", was: ["ανοίγει κάτι που προσθέτεις."] },
  ")": { name: "κλείσιμο παρένθεσης", was: ["κλείνει αυτό που πρόσθεσες."] },
  "%": { name: "τοις εκατό", was: ["σημαίνει στα εκατό, για παράδειγμα 50 τοις εκατό."] },
  "&": { name: "εμπορικό και", was: ["σημαίνει και."] },
  "#": { name: "δίεση", was: ["χρησιμοποιείται και για ετικέτες στα κοινωνικά δίκτυα."] },
  "€": { name: "ευρώ", was: ["είναι το σύμβολο του ευρώ."] },
  $: { name: "δολάριο", was: ["είναι το σύμβολο του δολαρίου."] },
  "£": { name: "λίρα", was: ["είναι το σύμβολο της βρετανικής λίρας."] },
  "§": { name: "παράγραφος", was: ["μπαίνει μπροστά από νόμους και κανόνες."] },
  "°": { name: "βαθμοί", was: ["δείχνει βαθμούς, για παράδειγμα της θερμοκρασίας."] },
  "<": { name: "μικρότερο", was: ["συγκρίνει δύο αριθμούς: ο αριστερός είναι μικρότερος."] },
  ">": { name: "μεγαλύτερο", was: ["συγκρίνει δύο αριθμούς: ο αριστερός είναι μεγαλύτερος."] },
  _: { name: "κάτω παύλα", was: ["υπάρχει συχνά σε διευθύνσεις email και σε ονόματα αρχείων."] },
  "^": { name: "δύναμη", was: ["στα μαθηματικά σημαίνει εις τη δύναμη, για παράδειγμα 2 εις την τρίτη."] },
  "²": { name: "στο τετράγωνο", was: ["χρησιμοποιείται για εμβαδά, για παράδειγμα τετραγωνικά μέτρα."] },
  "³": { name: "στον κύβο", was: ["χρησιμοποιείται για όγκους, για παράδειγμα κυβικά μέτρα."] },
  "[": { name: "άνοιγμα αγκύλης", was: PROGRAMMIEREN_EL },
  "]": { name: "κλείσιμο αγκύλης", was: PROGRAMMIEREN_EL },
  "{": { name: "άνοιγμα αγκίστρου", was: PROGRAMMIEREN_EL },
  "}": { name: "κλείσιμο αγκίστρου", was: PROGRAMMIEREN_EL },
  "\\": { name: "ανάποδη κάθετος", was: PROGRAMMIEREN_EL },
  "|": { name: "μπάρα", was: PROGRAMMIEREN_EL },
  "~": { name: "περισπωμένη", was: PROGRAMMIEREN_EL },
  "´": { name: "οξεία", was: ["βάζει τόνο σε ένα γράμμα."] },
  "`": { name: "βαρεία", was: ["βάζει τόνο σε ένα γράμμα."] },
  "¨": { name: "διαλυτικά", was: ["βάζει δύο τελείες σε ένα γράμμα."] },
  "΄": { name: "τόνος", was: ["βάζει τόνο στο επόμενο φωνήεν, για παράδειγμα ά."] },
  "΅": { name: "διαλυτικά και τόνος", was: ["βάζει διαλυτικά και τόνο στο επόμενο φωνήεν, για παράδειγμα ΐ."] },
  "µ": { name: "μίκρο", was: ["είναι το σύμβολο για το ένα εκατομμυριοστό."] },
};

/** Die Schulnamen der Buchstaben (Glossar §2.8). */
const BUCHSTABEN_NAMEN_EL: Readonly<Record<string, string>> = {
  α: "άλφα", β: "βήτα", γ: "γάμμα", δ: "δέλτα", ε: "έψιλον", ζ: "ζήτα", η: "ήτα", θ: "θήτα", ι: "γιώτα", κ: "κάπα", λ: "λάμδα",
  μ: "μι", ν: "νι", ξ: "ξι", ο: "όμικρον", π: "πι", ρ: "ρο", σ: "σίγμα", ς: "τελικό σίγμα", τ: "ταυ", υ: "ύψιλον", φ: "φι", χ: "χι",
  ψ: "ψι", ω: "ωμέγα",
};

/** „άλφα με τόνο", „γιώτα με διαλυτικά και τόνο" - ein griechischer Buchstabe mit Zeichen (oder `null`). */
function mitZeichen(klein: string): string | null {
  const [basis, ...zeichen] = [...klein.normalize("NFD")];
  const name = BUCHSTABEN_NAMEN_EL[basis];
  if (!name || zeichen.length === 0) return null;
  const tonos = zeichen.includes("́");
  const dialytika = zeichen.includes("̈");
  if (tonos && dialytika) return `${name} με διαλυτικά και τόνο`;
  if (tonos) return `${name} με τόνο`;
  if (dialytika) return `${name} με διαλυτικά`;
  return null;
}

/**
 * Der griechische Name eines Zeichens. Satz- und Sonderzeichen aus {@link ZEICHEN_EL}; ς „τελικό σίγμα"; Buchstaben mit Tonos oder
 * Dialytika „άλφα με τόνο"; ein Grossbuchstabe „κεφαλαίο" + Name (Glossar §2.8: „κεφαλαίο άλφα"); sonst das Zeichen selbst - nie Englisch.
 */
export function zeichenNameEl(ch: string): string {
  const eintrag = ZEICHEN_EL[ch]?.name;
  if (eintrag) return eintrag;
  const klein = ch.toLowerCase();
  if (istBuchstabe(ch) && klein !== ch) {
    const name = mitZeichen(klein) ?? BUCHSTABEN_NAMEN_EL[klein] ?? ch;
    return `κεφαλαίο ${name}`;
  }
  if (ch === "ς") return BUCHSTABEN_NAMEN_EL.ς;
  return mitZeichen(ch) ?? ch;
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - griechisch. */
export const ORT_EL: Readonly<Record<string, string>> = {
  explorer: "στην Εξερεύνηση αρχείων",
  finder: "στο Finder",
  word: "στο Word",
  excel: "στο Excel",
  browser: "στο πρόγραμμα περιήγησης",
  teams: "στο Teams",
  powerpoint: "στο PowerPoint",
  outlook: "στο Outlook",
  bedienungshilfen: "στον αναγνώστη οθόνης",
};

/** Die kleine eigene Liste der deutschen Datei, griechisch. */
export const EIGENE_KOMBINATIONEN_EL: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "πηγαίνει πίσω στο προηγούμενο στοιχείο." },
    { keys: "Strg+P", was: "ανοίγει το παράθυρο εκτύπωσης." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "πηγαίνει πίσω στο προηγούμενο στοιχείο." },
    { keys: "Cmd+P", was: "ανοίγει το παράθυρο εκτύπωσης." },
  ],
};

const WIRKUNG_EL: Readonly<Record<string, string>> = {
  kopieren: "Αντιγραφή",
  einfuegen: "Επικόλληση",
  ausschneiden: "Αποκοπή",
  rueckgaengig: "Αναίρεση",
  wiederherstellen: "Επανάληψη - επαναφέρει ό,τι αναιρέθηκε",
  "alles-markieren": "Επιλογή όλων",
  "markieren-zeichen": "Επιλογή χαρακτήρα προς χαρακτήρα",
  "markieren-wort": "Επιλογή λέξης προς λέξη",
  "spalte-markieren": "Επιλογή ολόκληρης της στήλης",
  "zeile-markieren": "Επιλογή ολόκληρης της γραμμής",
  oeffnen: "Άνοιγμα",
  umbenennen: "Μετονομασία",
  "neuer-ordner": "Δημιουργία νέου φακέλου",
  papierkorb: "Μετακίνηση στον Κάδο Ανακύκλωσης",
  duplizieren: "Δεύτερο αντίγραφο του ίδιου αρχείου",
  "ebene-hoeher": "Ένα επίπεδο πάνω",
  adressleiste: "Μετάβαση στη γραμμή διευθύνσεων",
  eigenschaften: "Εμφάνιση των ιδιοτήτων",
  uebersicht: "Γρήγορη προεπισκόπηση χωρίς άνοιγμα",
  bewegen: "Μετακίνηση του αρχείου στη νέα θέση (φεύγει από την παλιά)",
  "ansicht-details": "Προβολή Λεπτομέρειες",
  speichern: "Αποθήκευση",
  "speichern-unter": "Αποθήκευση ως - με νέο όνομα ή σε νέα θέση",
  fett: "Έντονα",
  kursiv: "Πλάγια",
  unterstreichen: "Υπογράμμιση",
  ueberschrift1: "Στυλ Επικεφαλίδα 1",
  ueberschrift2: "Στυλ Επικεφαλίδα 2",
  "standard-format": "Στυλ Κανονικό",
  links: "Στοίχιση αριστερά",
  zentriert: "Στοίχιση στο κέντρο",
  zeilenumbruch: "Αλλαγή γραμμής στην ίδια παράγραφο",
  rechtschreibung: "Έλεγχος ορθογραφίας",
  fensterbereiche: "Εναλλαγή ανάμεσα στα τμήματα του παραθύρου",
  suchen: "Εύρεση",
  ersetzen: "Εύρεση και αντικατάσταση",
  "gehe-zu-zelle": "Μετάβαση σε συγκεκριμένο κελί",
  "zelle-bearbeiten": "Συνέχεια γραφής στο κελί",
  "zelle-formatieren": "Παράθυρο Μορφοποίηση κελιών",
  "zum-rand": "Μετάβαση στην άκρη των δεδομένων",
  autosumme: "Αυτόματη Άθροιση",
  "ausfuellen-unten": "Συμπλήρωση προς τα κάτω",
  "ausfuellen-rechts": "Συμπλήρωση προς τα δεξιά",
  "absoluter-bezug": "Σταθερή αναφορά (απόλυτη αναφορά με σύμβολα δολαρίου)",
  datum: "Εισαγωγή της σημερινής ημερομηνίας",
  uhrzeit: "Εισαγωγή της τρέχουσας ώρας",
  kommentar: "Εισαγωγή σχολίου",
  autofilter: "Ενεργοποίηση και απενεργοποίηση του Αυτόματου φίλτρου",
  blattwechsel: "Μετάβαση σε άλλο φύλλο εργασίας",
  "neues-blatt": "Εισαγωγή νέου φύλλου εργασίας",
  "neu-laden": "Ανανέωση της σελίδας",
  lesezeichen: "Προσθήκη σελιδοδείκτη",
  verlauf: "Άνοιγμα του ιστορικού",
  senden: "Αποστολή του μηνύματος",
  "nachricht-loeschen": "Διαγραφή του μηνύματος",
  "sr-stopp": "Διακοπή της φωνής",
};

/** Was ein Kürzel BEWIRKT - griechisch. Fehlt eine Kennung, fällt die Zeile weg (`null`) - nie ein deutsches Wort. */
export function wirkungEl(id: string, plattform: Plattform): string | null {
  if (id === "papierkorb") return plattform === "macos" ? "Μετακίνηση στον Κάδο" : "Μετακίνηση στον Κάδο Ανακύκλωσης";
  return WIRKUNG_EL[id] ?? null;
}

/** „α, β και γ" - die griechische Aufzählung (gemessen `Intl.ListFormat("el")`, kein Komma vor „και"). */
export function aufzaehlungEl(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} και ${teile[teile.length - 1]}`;
}

/** Die festen Wörter des Erkundens, griechisch (Form der englischen Vorlage, siehe `tastenErklaerungBg.ts`). */
export const ERKUNDEN_WOERTER_EL = {
  kombination: "συνδυασμός πλήκτρων",
  kombiUnbekannt: "τι κάνει εξαρτάται από το πρόγραμμα.",
  mit: "Με",
  akzentTaste: "νεκρό πλήκτρο",
  unbekannt: "Δεν αναγνωρίζω αυτό το πλήκτρο.",
  taste: (key: string) => `Πλήκτρο ${key}`,
} as const;

/* ══ „Tasten finden" ════════════════════════════════════════════════════════ */

interface TasteEl {
  /** Mit Artikel, sächlich - im Griechischen derselbe Fall als Gegenstand und als Ergänzung („το πλήκτρο Tab"). */
  nennung: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur die Feststelltaste). */
  achtung?: string;
}

const SECHSERBLOCK = "Στο μπλοκ των έξι πλήκτρων πάνω από τα βέλη";

/** Die Tasten der Suchrunde, griechisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_EL: Readonly<Record<string, TasteEl | ((plattform: Plattform) => TasteEl)>> = {
  tabulator: { nennung: "το πλήκτρο Tab", lage: "Αριστερό μικρό δάχτυλο: μία σειρά πάνω, τέρμα αριστερά." },
  "pfeil-links": { nennung: "το Αριστερό βέλος", lage: "Κάτω δεξιά στα βέλη, το αριστερό." },
  "pfeil-rechts": { nennung: "το Δεξιό βέλος", lage: "Κάτω δεξιά στα βέλη, το δεξί." },
  "pfeil-auf": { nennung: "το Επάνω βέλος", lage: "Κάτω δεξιά στα βέλη, το πάνω." },
  "pfeil-ab": { nennung: "το Κάτω βέλος", lage: "Κάτω δεξιά στα βέλη, κάτω από το Επάνω βέλος." },
  pos1: { nennung: "το πλήκτρο Home", lage: `${SECHSERBLOCK}, πάνω στη μέση. Στον φορητό συχνά με το Fn.` },
  ende: { nennung: "το πλήκτρο End", lage: `${SECHSERBLOCK}, κάτω στη μέση. Στον φορητό συχνά με το Fn.` },
  "bild-auf": { nennung: "το πλήκτρο Page Up", lage: `${SECHSERBLOCK}, πάνω δεξιά. Στον φορητό συχνά με το Fn.` },
  "bild-ab": { nennung: "το πλήκτρο Page Down", lage: `${SECHSERBLOCK}, κάτω δεξιά. Στον φορητό συχνά με το Fn.` },
  leertaste: { nennung: "το πλήκτρο διαστήματος", lage: "Το μακρύ πλήκτρο κάτω από τους αντίχειρες." },
  eingabe: { nennung: "το πλήκτρο Enter", lage: "Δεξί χέρι τέρμα δεξιά: το μεγάλο πλήκτρο." },
  zeilenschalter: { nennung: "το πλήκτρο Return", lage: "Δεξί χέρι τέρμα δεξιά: το μεγάλο πλήκτρο." },
  loeschtaste: { nennung: "το πλήκτρο Backspace", lage: "Δεξί χέρι τέρμα δεξιά, δύο σειρές πάνω." },
  entf: (plattform) =>
    plattform === "macos"
      ? { nennung: "το πλήκτρο διαγραφής προς τα δεξιά", lage: "Μόνο στα μεγάλα πληκτρολόγια, δίπλα στο Return. Αλλιώς Fn και Delete." }
      : { nennung: "το πλήκτρο Delete", lage: `${SECHSERBLOCK}, κάτω αριστερά. Στον φορητό πάνω δεξιά.` },
  esc: { nennung: "το πλήκτρο Esc", lage: "Η πάνω αριστερή γωνία." },
  umschalt: { nennung: "το πλήκτρο Shift", lage: "Δύο φορές: αριστερά και δεξιά στην κάτω σειρά με τα γράμματα." },
  feststell: {
    nennung: "το πλήκτρο Caps Lock",
    lage: "Αριστερό μικρό δάχτυλο: ένα βήμα αριστερά.",
    achtung: "Γράφει τώρα με κεφαλαία; Πάτησέ το ξανά.",
  },
  strg: { nennung: "το πλήκτρο Ctrl", lage: "Η κάτω αριστερή γωνία." },
  alt: { nennung: "το πλήκτρο Alt", lage: "Κάτω, αριστερά από το πλήκτρο διαστήματος." },
  altgr: { nennung: "το πλήκτρο Alt Gr", lage: "Κάτω, δεξιά από το πλήκτρο διαστήματος." },
  "windows-taste": { nennung: "το πλήκτρο Windows", lage: "Κάτω αριστερά, ανάμεσα στο Ctrl και στο Alt." },
  einfg: { nennung: "το πλήκτρο Insert", lage: `${SECHSERBLOCK}, πάνω αριστερά, πάνω από το Delete. Στον φορητό συχνά λείπει.` },
  befehlstaste: { nennung: "το πλήκτρο Command", lage: "Κάτω αριστερά, ακριβώς δίπλα στο πλήκτρο διαστήματος." },
  wahltaste: { nennung: "το πλήκτρο Option", lage: "Κάτω αριστερά, το τρίτο πλήκτρο από την άκρη." },
  ctrl: { nennung: "το πλήκτρο Control", lage: "Κάτω αριστερά, το δεύτερο πλήκτρο από την άκρη." },
  fn: { nennung: "το πλήκτρο Fn", lage: "Κάτω αριστερά, το πρώτο πλήκτρο, ακριβώς στη γωνία. Στο MacBook γράφει fn." },
};

function tasteEl(t: TastenName, plattform: Plattform): TasteEl {
  const e = TASTEN_EL[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne griechischen Eintrag - der Kurzname wie auf der Kappe.
  return e ?? { nennung: `το πλήκτρο ${t.kurz ?? t.name}`, lage: "" };
}

/** „το πλήκτρο Tab" - wie eine Taste im Satz heisst. */
export function tastenNennungEl(t: TastenName, plattform: Plattform): string {
  return tasteEl(t, plattform).nennung;
}

/** Nur die Lage - oder "". */
export function tastenLageEl(t: TastenName, plattform: Plattform): string {
  return tasteEl(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Βρες το πλήκτρο Tab. Αριστερό μικρό δάχτυλο: …" */
export function ansageSuchauftragEl(t: TastenName, plattform: Plattform): string {
  const e = tasteEl(t, plattform);
  return e.lage ? `Βρες ${e.nennung}. ${e.lage}` : `Βρες ${e.nennung}.`;
}

/** Erster Treffer - erst die Wiederholung zählt. Der Aorist verrät kein Geschlecht (Regel 2). */
export function ansageGefundenEl(t: TastenName, plattform: Plattform): string {
  return `Το βρήκες! Πάτησε ένα άλλο πλήκτρο και μετά ξανά ${tastenNennungEl(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Feststelltaste). */
export function ansageBestaetigtEl(t: TastenName, plattform: Plattform): string {
  const e = tasteEl(t, plattform);
  return e.achtung ? `Μπράβο! ${e.achtung}` : "Μπράβο!";
}

/** Eine Taste, die hier nicht unterrichtet wird. */
export const ANSAGE_UNBEKANNT_EL = "Αυτό το πλήκτρο δεν το μαθαίνουμε εδώ.";

/** Der Satz zu einem Schritt der Suchrunde - griechisch. Höchstens ein Ausrufezeichen je Satz (Regel 1). */
export function suchSatzEl(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteEl(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_EL} Βρες ${g.nennung}.`;
      return `Αυτό είναι ${tasteEl(taste, plattform).nennung}. Βρες ${g.nennung}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenEl(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtEl(gesucht, plattform)} Βρέθηκαν όλα τα πλήκτρα: ${suchbar.length} από ${suchbar.length}.`;
    case "weiter":
      return `${ansageBestaetigtEl(gesucht, plattform)} ${ansageSuchauftragEl(suchbar[index + 1]!, plattform)}`;
  }
}

/* ══ Name einer Lerneinheit ════════════════════════════════════════════════ */

/**
 * Der Name einer Lerneinheit („κεφαλαία", „ψηφίο 5", „κόμμα", „Φ") - Vorbild `unitLabelCs`. Satz- und Sonderzeichen und die Totasten
 * mit ihrem griechischen Namen; die Art der Einheit kommt aus dem WEG. Buchstaben gross - ausser ς (sein Grossbuchstabe Σ gehört der
 * Taste σ, Glossar §2.9).
 */
export function unitLabelEl(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "κεφαλαία";
  switch (unitKindImWeg(unit, lernweg)) {
    case "shift":
      return "κεφαλαία";
    case "ziffer":
      return `ψηφίο ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return zeichenNameEl(unit);
    default:
      if (unit === "ß") return "ß";
      if (unit === "ς") return "ς";
      return istBuchstabe(unit) ? grossFuer(unit, lernweg ?? "el") : zeichenNameEl(unit);
  }
}

/* ══ Das Objekt für den Verteiler ══════════════════════════════════════════ */

/** Alles, was „Tasten erkunden" auf Griechisch sagt. */
export const TASTEN_SATZ_EL: TastenErklaerungSatz = {
  sondertaste: sondertasteEl,
  nachKey: nachKeyEl,
  tasteKurz: TASTE_KURZ_EL,
  zeichen: ZEICHEN_EL,
  zeichenName: zeichenNameEl,
  akzente: AKZENTE_EL,
  erkundenWoerter: ERKUNDEN_WOERTER_EL,
  eigeneKombinationen: EIGENE_KOMBINATIONEN_EL,
  wirkung: wirkungEl,
  ort: ORT_EL,
  aufzaehlung: aufzaehlungEl,
  // Ohne Sprache: `toLocaleUpperCase("el")` nähme den Tonos weg (Regel 7).
  aufdruckGross: (key) => key.toUpperCase(),
};
