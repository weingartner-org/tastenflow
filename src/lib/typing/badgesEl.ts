/**
 * ★ G3c-VERTEILER (25.10.2026): DIE ABZEICHEN IN GRIECHISCH.
 * ★ O-INHALT-EL (29.10.2026): gefüllt - Gegenstück zu `badgesCs.ts`, dieselben Schlüssel, NEU AUF GRIECHISCH GESCHRIEBEN, nicht
 * übersetzt (Glossar `recherche-griechisch-2026-10-25/GLOSSAR-el.md` §2.4): übertragen ist die IDEE. Griechische Wendungen, wo es sie
 * gibt („Ο μίτος της Αριάδνης" für den roten Faden, „Λαμπίκος", „Μονορούφι", „Ολοταχώς μπροστά", „Το σπίτι μου, το κάστρο μου",
 * „Ο βιβλιοσκώληκας"), sonst ein Bild oder Stabreim („Πιστός πιγκουίνος", „Σβέλτη αλεπού").
 *
 * ★★★ Geschlecht nie raten (Regel 2): KEINE Personenwörter für das Kind (νικητής, πρωταθλητής, μάστορας, εξερευνητής, ήρωας), keine
 * Adjektive am Kind („Είσαι …"); Adjektive nur am Tier oder Ding. Die Beschreibungen sind Sätze über die Sache - Passiv
 * („Ξεκλειδώθηκαν …", „διαβάστηκαν"), Zahl + Hauptwort („5 γύροι χωρίς κανένα λάθος") oder Hauptwort-Satz.
 * ★ Zahlen nach `Intl` „el" (Regel 5): Tausenderpunkt auch vierstellig („1.000", „10.000"), Prozent ohne Leerzeichen („95%").
 * Mehrzahl über `Intl.PluralRules("el")` (one/other). Uhrzeiten in Worten. Monate und Wochentage GROSS (Regel 9). Kein `?`.
 * Begriffe: μετάλλιο, γύρος, πάτημα (Anschlag, Regel 6), ακρίβεια, λάθος, βασική θέση, βασική σειρά, σειρά αριθμών, μέρος (Teil einer
 * Geschichte), κύκλος πόντων, επίπεδο δυσκολίας, σημείο εκκίνησης, Παγοκομμάτια, Πολική εξερεύνηση.
 * ⚠️ [G]: von einer Person mit Griechisch als Erstsprache gegenzulesen (Glossar §5 Nr. 4).
 *
 * Verteiler: `badges.ts`. Wächter: `tests/tastenflow-abzeichen-el.test.ts`.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextEl = AbzeichenTextEn;

/** Zahl mit der passenden Form (one nur für 1, `Intl.PluralRules("el")`): `el(5, "περιπέτεια", "περιπέτειες")`. */
function el(n: number, one: string, other: string): string {
  return `${n.toLocaleString("el-GR")} ${new Intl.PluralRules("el-GR").select(n) === "one" ? one : other}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesCs.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} και ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_EL: Readonly<Record<string, string>> = {
  Fehlerfrei: "Χωρίς λάθη",
  "Saubere Serie": "Καθαροί γύροι",
  Fleiß: "Επιμέλεια",
  Anschläge: "Πατήματα",
  Dranbleiben: "Επιμονή",
  Übungswochen: "Εβδομάδες εξάσκησης",
  Sterne: "Αστέρια",
  Lektionen: "Μαθήματα",
  Stufen: "Επίπεδα",
  Tastenwelt: "Ο κόσμος των πλήκτρων",
  "Sitzt!": "Το έμαθα!",
  Tempo: "Ταχύτητα",
  "Am Stück": "Χωρίς διακοπή",
  Meisterprüfung: "Δεξιοτεχνία",
  Abenteuer: "Περιπέτειες",
  "Abenteuer-Kunststücke": "Κατορθώματα περιπέτειας",
  Expedition: "Εξερεύνηση",
  Geschichten: "Ιστορίες",
  Lesestunde: "Ώρα για διάβασμα",
  "Lese-Kunststücke": "Κατορθώματα ανάγνωσης",
  Geheim: "Μυστικά",
};

/** Der ganze Katalog griechisch, je Abzeichen-ID. */
export const ABZEICHEN_EL: Readonly<Record<string, AbzeichenTextEl>> = {
  // ── Χωρίς λάθη ───────────────────────────────────────────────────────────
  volltreffer: { name: "Στο κέντρο του στόχου", description: "Ολόκληρος γύρος χωρίς κανένα λάθος.", bildbeschreibung: "στόχος με βέλος ακριβώς στο κέντρο" },
  "null-fehler-ninja": { name: "Νίντζα χωρίς λάθη", description: "5 γύροι χωρίς κανένα λάθος.", bildbeschreibung: "νίντζα" },
  "makellos-meister": { name: "Άψογα αστέρια", description: "15 γύροι χωρίς κανένα λάθος.", bildbeschreibung: "τρία λαμπερά αστέρια" },
  "diamant-finger": { name: "Διαμαντένια δάχτυλα", description: "40 γύροι χωρίς κανένα λάθος.", bildbeschreibung: "μπλε πολύτιμος λίθος" },
  "weisse-weste": { name: "Καθαρό σαν το χιόνι", description: "80 γύροι χωρίς κανένα λάθος.", bildbeschreibung: "λευκό περιστέρι" },
  "einhorn-finger": { name: "Δάχτυλα μονόκερου", nameNeutral: "150 γύροι χωρίς λάθη", description: "150 γύροι χωρίς κανένα λάθος.", bildbeschreibung: "μονόκερος" },
  // ── Καθαροί γύροι ────────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Πιστός πιγκουίνος", nameNeutral: "Τρεις φορές καθαρά", description: "3 καθαροί γύροι στη σειρά (ακρίβεια τουλάχιστον 95%).", bildbeschreibung: "πιγκουίνος" },
  adlerauge: { name: "Μάτι αετού", description: "7 καθαροί γύροι στη σειρά (ακρίβεια τουλάχιστον 95%).", bildbeschreibung: "αετός" },
  "laser-lama": { name: "Λάμα λέιζερ", nameNeutral: "Λειτουργία λέιζερ", description: "15 καθαροί γύροι στη σειρά (ακρίβεια τουλάχιστον 95%).", bildbeschreibung: "λάμα" },
  "eiskalte-serie": { name: "Παγωμένη ηρεμία", description: "25 καθαροί γύροι στη σειρά (ακρίβεια τουλάχιστον 95%).", bildbeschreibung: "παγάκι" },
  // ── Επιμέλεια ────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Κοτοπουλάκι των πλήκτρων", nameNeutral: "Πρώτος γύρος", description: "Ο πρώτος ολοκληρωμένος γύρος.", bildbeschreibung: "κοτοπουλάκι που βγαίνει από το αυγό" },
  "ausdauer-ameise": { name: "Εργατικό μυρμήγκι", nameNeutral: "Μετά το ζέσταμα", description: "25 γύροι εξάσκησης.", bildbeschreibung: "μυρμήγκι" },
  "marathon-maus": { name: "Ποντικάκι του μαραθωνίου", nameNeutral: "Εκατό γύροι", description: "100 γύροι εξάσκησης.", bildbeschreibung: "κεφάλι ποντικιού" },
  "munteres-murmeltier": { name: "Ζωηρός κάστορας", nameNeutral: "Μαραθώνιος", description: "250 γύροι εξάσκησης.", bildbeschreibung: "κάστορας" },
  dauerlaeufer: { name: "Μεγάλη απόσταση", description: "500 γύροι εξάσκησης.", bildbeschreibung: "άνθρωπος που τρέχει" },
  tausendsassa: { name: "Χίλιοι και ένας γύροι", nameNeutral: "Χίλιοι γύροι", description: "1.000 γύροι εξάσκησης.", bildbeschreibung: "φάλαινα που πετάει νερό" },
  // ── Πατήματα ─────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Τίγρη των χιλίων πλήκτρων", nameNeutral: "Χίλια σωστά πατήματα", description: "1.000 σωστά πατήματα.", bildbeschreibung: "κεφάλι τίγρης" },
  "tasten-t-rex": { name: "Τυραννόσαυρος των πλήκτρων", nameNeutral: "Δέκα χιλιάδες σωστά πατήματα", description: "10.000 σωστά πατήματα.", bildbeschreibung: "τυραννόσαυρος" },
  "galaktische-fingerspitzen": { name: "Γαλαξιακά δάχτυλα", description: "50.000 σωστά πατήματα.", bildbeschreibung: "πύραυλος που απογειώνεται" },
  "hunderttausend-held": { name: "Εκατό χιλιάδες αστραπές", nameNeutral: "Εκατό χιλιάδες σωστά πατήματα", description: "100.000 σωστά πατήματα.", bildbeschreibung: "κίτρινη αστραπή" },
  viertelmillion: { name: "Ένα τέταρτο του εκατομμυρίου", description: "250.000 σωστά πατήματα - τόσα γράμματα έχει ένα ολόκληρο βιβλίο.", bildbeschreibung: "δορυφόρος" },
  // ── Επιμονή ──────────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Επίμονος ασβός", nameNeutral: "Επιμονή", description: "3 διαφορετικές ημέρες εξάσκησης.", bildbeschreibung: "ασβός" },
  gewohnheitstier: { name: "Πιστή χελώνα", description: "7 διαφορετικές ημέρες εξάσκησης.", bildbeschreibung: "χελώνα" },
  "wie-ein-uhrwerk": { name: "Σαν ρολόι", description: "20 διαφορετικές ημέρες εξάσκησης.", bildbeschreibung: "κόκκινο ξυπνητήρι" },
  unaufhaltsam: { name: "Ασταμάτητα", description: "50 διαφορετικές ημέρες εξάσκησης.", bildbeschreibung: "βουνό με χιονισμένη κορυφή" },
  "tief-verwurzelt": { name: "Βαθιές ρίζες", description: "100 διαφορετικές ημέρες εξάσκησης.", bildbeschreibung: "μεγάλο πράσινο φυλλοβόλο δέντρο" },
  // Nicht „Σταθερός σαν βράχος": das Adjektiv hinge am Kind (Regel 2).
  "fels-in-der-brandung": { name: "Σαν βράχος", description: "200 διαφορετικές ημέρες εξάσκησης - σχεδόν κάθε μέρα της σχολικής χρονιάς.", bildbeschreibung: "πέτρινο άγαλμα από το Νησί του Πάσχα" },
  // ── Εβδομάδες εξάσκησης ──────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Ήδη τρεις μήνες", description: "12 διαφορετικές εβδομάδες εξάσκησης.", bildbeschreibung: "καφέ φθινοπωρινό φύλλο" },
  "halbes-jahr-dabei": { name: "Ήδη μισός χρόνος", description: "26 διαφορετικές εβδομάδες εξάσκησης.", bildbeschreibung: "σύννεφο που ρίχνει χιόνι" },
  "ganzes-jahr-dabei": { name: "Ολόκληρος χρόνος", description: "52 διαφορετικές εβδομάδες εξάσκησης.", bildbeschreibung: "τούρτα γενεθλίων με κερί" },
  // ── Αστέρια ──────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Πεφταστέρι", description: "Πρώτος γύρος με 3 αστέρια.", bildbeschreibung: "πεφταστέρι στον νυχτερινό ουρανό" },
  "sternen-sammler": { name: "Μια χούφτα αστέρια", description: "10 γύροι με 3 αστέρια.", bildbeschreibung: "λαμπερό κίτρινο αστέρι" },
  sternenhimmel: { name: "Έναστρος ουρανός", description: "30 γύροι με 3 αστέρια.", bildbeschreibung: "ο Γαλαξίας στον νυχτερινό ουρανό" },
  sternenmeer: { name: "Θάλασσα από αστέρια", description: "75 γύροι με 3 αστέρια.", bildbeschreibung: "πορτοκαλί οκτάκτινο αστέρι" },
  // ── Μαθήματα ─────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Λιοντάρι των μαθημάτων", nameNeutral: "Πέντε μαθήματα", description: "5 ολοκληρωμένα μαθήματα.", bildbeschreibung: "λιοντάρι" },
  "kapitel-kaeptn": { name: "Ολοταχώς μπροστά", description: "15 ολοκληρωμένα μαθήματα.", bildbeschreibung: "άγκυρα" },
  "lehrgangs-legende": { name: "Θρύλος του προγράμματος", description: (z) => `Ολοκληρώθηκαν όλα τα μαθήματα του προγράμματος (σύνολο ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "χρυσό κύπελλο" },
  // ── Επίπεδα (κύκλος πόντων) ──────────────────────────────────────────────
  "kletter-koala": { name: "Κοάλα που σκαρφαλώνει", nameNeutral: "Επίπεδο 5", description: "Επίπεδο 5 στον κύκλο πόντων.", bildbeschreibung: "κοάλα" },
  "punkte-rakete": { name: "Πύραυλος πόντων", description: "Επίπεδο 10 στον κύκλο πόντων.", bildbeschreibung: "κόκκινο μπαλόνι" },
  "gipfel-gaemse": { name: "Αγριόγιδο στην κορυφή", nameNeutral: "Επίπεδο 20", description: "Επίπεδο 20 στον κύκλο πόντων.", bildbeschreibung: "αγριόγιδο" },
  hoehenflug: { name: "Ψηλή πτήση", nameNeutral: "Επίπεδο 50", description: "Επίπεδο 50 στον κύκλο πόντων.", bildbeschreibung: "ελικόπτερο" },
  "ueber-den-wolken": { name: "Πάνω από τα σύννεφα", nameNeutral: "Επίπεδο 100", description: "Επίπεδο 100 στον κύκλο πόντων.", bildbeschreibung: "ιπτάμενος δίσκος" },
  sternenreise: { name: "Ταξίδι στα αστέρια", nameNeutral: "Επίπεδο 200", description: "Επίπεδο 200 στον κύκλο πόντων.", bildbeschreibung: "κομήτης με μακριά ουρά" },
  // ── Ο κόσμος των πλήκτρων ────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „el" φ ξ δ κ σ λ α; ohne feste Zahl (sie ist je Weg verschieden).
  "grundstellungs-gorilla": {
    name: "Γορίλας της βασικής σειράς",
    nameNeutral: "Ολόκληρη η βασική σειρά",
    description: (z) =>
      `Ξεκλειδώθηκαν όλα τα πλήκτρα της βασικής θέσης: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "γορίλας",
  },
  "gross-baumeister": { name: "Κάστρο από κεφαλαία", nameNeutral: "Κεφαλαία", description: "Το Shift κατακτήθηκε - αληθινά κεφαλαία με τα δικά σου δάχτυλα.", bildbeschreibung: "τέσσερα κεφαλαία σε μπλε πλήκτρα" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „el" nicht zu verdienen - das Regal beschreibt trotzdem jedes.
  "puenktchen-panda": { name: "Πάντα με τελίτσες", nameNeutral: "Γερμανικά γράμματα με τελείες", description: "Ξεκλειδώθηκαν τα ä, ö και ü - τα γερμανικά γράμματα με τελείες.", bildbeschreibung: "πάντα" },
  "schlangen-s": { name: "Φιδίσιο S", nameNeutral: "Γερμανικό διπλό s", description: "Ξεκλειδώθηκε το ß, το γερμανικό διπλό s - το τελευταίο γράμμα του γερμανικού πληκτρολογίου.", bildbeschreibung: "φίδι" },
  "alphabet-as": { name: "Όλο το αλφάβητο", description: "Ξεκλειδώθηκαν όλα τα γράμματα του αλφαβήτου.", bildbeschreibung: "πεζά γράμματα σε μπλε πλήκτρα" },
  "punkt-und-komma": { name: "Τελεία και κόμμα", description: "Ξεκλειδώθηκαν η τελεία και το κόμμα - τα πρώτα αληθινά σημεία στίξης.", bildbeschreibung: "μαύρη πένα" },
  // Auf Weg „el" ist `;` das Fragezeichen.
  "satzzeichen-sammler": { name: "Συλλογή σημείων", nameNeutral: "Όλα τα σημεία στίξης", description: "Ξεκλειδώθηκαν τα σημεία στίξης: . , - ; ! :", bildbeschreibung: "μεγάλο κόκκινο θαυμαστικό" },
  "zahlen-zebra": { name: "Ζέβρα των αριθμών", nameNeutral: "Τα μισά ψηφία", description: "Ξεκλειδώθηκαν πέντε ψηφία της σειράς αριθμών.", bildbeschreibung: "ζέβρα" },
  "zahlen-zauberer": { name: "Μαγεία των αριθμών", nameNeutral: "Όλη η σειρά αριθμών", description: "Ξεκλειδώθηκαν όλα τα ψηφία από το 1 ως το 0 - όλη η σειρά αριθμών.", bildbeschreibung: "μπλε πλήκτρο με τον αριθμό δέκα" },
  "klammer-krokodil": { name: "Κροκόδειλος σε παρένθεση", nameNeutral: "Παρενθέσεις", description: "Ξεκλειδώθηκαν οι παρενθέσεις ( ) - τα πρώτα σύμβολα.", bildbeschreibung: "κροκόδειλος" },
  "alltags-ass": { name: "Σύμβολα για κάθε μέρα", nameNeutral: "Καθημερινά σύμβολα", description: (z) => `Ξεκλειδώθηκαν: ${alltagsZeichen(z)} - σύμβολα από τα email και από τον κόσμο των χρημάτων.`, bildbeschreibung: "φάκελος" },
  "tastatur-krone": { name: "Στέμμα του πληκτρολογίου", nameNeutral: "Όλο το πληκτρολόγιο", description: "Ξεκλειδώθηκαν ΟΛΑ τα πλήκτρα - μέχρι το τελευταίο σύμβολο.", bildbeschreibung: "χρυσό στέμμα" },
  // ── Το έμαθα! ────────────────────────────────────────────────────────────
  "feste-burg": { name: "Το σπίτι μου, το κάστρο μου", nameNeutral: "Η βασική σειρά είναι σίγουρη", description: "Όλα τα πλήκτρα της βασικής θέσης είναι σίγουρα.", bildbeschreibung: "σπίτι" },
  "buchstaben-baendiger": { name: "Δαμασμένα γράμματα", nameNeutral: "Όλα τα γράμματα είναι σίγουρα", description: "Κάθε γράμμα είναι σίγουρο - κανένα δεν είναι πια αβέβαιο.", bildbeschreibung: "κόκκινο τετράγωνο με μεγάλο Α" },
  "zahlen-fels": { name: "Αριθμοί σαν βράχος", nameNeutral: "Όλα τα ψηφία είναι σίγουρα", description: "Όλη η σειρά αριθμών είναι σίγουρη.", bildbeschreibung: "άβακας με χρωματιστές χάντρες" },
  "nichts-wackelt": { name: "Τίποτα δεν κουνιέται", description: "Κάθε πλήκτρο του πληκτρολογίου είναι σίγουρο - όλο το πληκτρολόγιο, όχι μόνο τα ξεκλειδωμένα πλήκτρα.", bildbeschreibung: "μπλε ρόμβος με τελεία στη μέση" },
  // ── Ταχύτητα (πατήματα το λεπτό, Regel 6) ────────────────────────────────
  "flinker-fuchs": { name: "Σβέλτη αλεπού", nameNeutral: "Γρήγορα και σωστά", description: "Η ζητούμενη ταχύτητα ΚΑΙ ακρίβεια τουλάχιστον 95% - η ταχύτητα μετράει μόνο όταν το γράψιμο είναι ακριβές.", bildbeschreibung: "αλεπού" },
  "tempo-60": { name: "Λαγός που χοροπηδά", nameNeutral: "60 το λεπτό, με ακρίβεια", description: "Γύρος με 60 πατήματα το λεπτό και ακρίβεια τουλάχιστον 95%.", bildbeschreibung: "λαγός" },
  "tempo-90": { name: "Γρήγορο ελάφι", nameNeutral: "90 το λεπτό, με ακρίβεια", description: "Γύρος με 90 πατήματα το λεπτό και ακρίβεια τουλάχιστον 95%.", bildbeschreibung: "ελάφι" },
  "tempo-120": { name: "Άλογο σε καλπασμό", nameNeutral: "120 το λεπτό, με ακρίβεια", description: "Γύρος με 120 πατήματα το λεπτό και ακρίβεια τουλάχιστον 98%.", bildbeschreibung: "άλογο που καλπάζει" },
  "tempo-160": { name: "Ατμομηχανή", nameNeutral: "160 το λεπτό, με ακρίβεια", description: "Γύρος με 160 πατήματα το λεπτό και ακρίβεια τουλάχιστον 98%.", bildbeschreibung: "ατμομηχανή" },
  "tempo-200": { name: "Γρήγορο τρένο", nameNeutral: "200 το λεπτό, με ακρίβεια", description: "Γύρος με 200 πατήματα το λεπτό και ακρίβεια τουλάχιστον 98%.", bildbeschreibung: "γρήγορο τρένο" },
  "tempo-300": { name: "Αεριωθούμενο", nameNeutral: "300 το λεπτό, με ακρίβεια", description: "Γύρος με 300 πατήματα το λεπτό και ακρίβεια τουλάχιστον 99% - επαγγελματικό επίπεδο.", bildbeschreibung: "μικρό αεροπλάνο" },
  // ── Χωρίς διακοπή ────────────────────────────────────────────────────────
  "kette-100": { name: "Αλυσιδωτή αντίδραση", nameNeutral: "100 στη σειρά", description: "100 σωστά πατήματα στη σειρά, χωρίς κανένα λάθος.", bildbeschreibung: "δύο κρίκοι αλυσίδας" },
  "kette-250": { name: "Χωρίς σκόνταμμα", description: "250 σωστά πατήματα στη σειρά.", bildbeschreibung: "αλυσίδα με πολλούς κρίκους" },
  // Der rote Faden heisst auf Griechisch der Faden der Ariadne.
  "kette-500": { name: "Ο μίτος της Αριάδνης", nameNeutral: "500 στη σειρά", description: "500 σωστά πατήματα στη σειρά - περισσότερα από έναν ολόκληρο γύρο.", bildbeschreibung: "καρούλι με κλωστή" },
  "kette-1000": { name: "Χίλια χωρίς λάθος", description: "1.000 σωστά πατήματα στη σειρά.", bildbeschreibung: "το βουνό Φούτζι με χιονισμένη κορυφή" },
  "kette-2000": { name: "Σιδερένια αλυσίδα", nameNeutral: "2.000 στη σειρά", description: "2.000 σωστά πατήματα στη σειρά - τέσσερις με πέντε γύροι χωρίς τον παραμικρό δισταγμό.", bildbeschreibung: "ηφαίστειο που βγάζει λάβα" },
  // ── Περιπέτειες (παιχνίδι „Παγοκομμάτια", Glossar §2.3) ─────────────────
  "erste-expedition": { name: "Πρώτη εξερεύνηση", description: "Η πρώτη περιπέτεια στα Παγοκομμάτια στο ελεύθερο παιχνίδι - μέχρι το ιγκλού.", bildbeschreibung: "πυξίδα" },
  // Nicht „Πολικός εξερευνητής" (Personenwort, männlich).
  polarforscher: { name: "Πολικές ανακαλύψεις", description: "10 ολοκληρωμένες περιπέτειες στα Παγοκομμάτια στο ελεύθερο παιχνίδι.", bildbeschreibung: "νιφάδα χιονιού" },
  "eismeer-legende": { name: "Θρύλος του παγωμένου ωκεανού", description: "30 ολοκληρωμένες περιπέτειες στα Παγοκομμάτια στο ελεύθερο παιχνίδι.", bildbeschreibung: "ψηλό μπλε κύμα" },
  "packeis-profi": { name: "Οι πάγοι κατακτήθηκαν", nameNeutral: "60 περιπέτειες", description: "60 ολοκληρωμένες περιπέτειες στα Παγοκομμάτια στο ελεύθερο παιχνίδι.", bildbeschreibung: "βαλίτσα" },
  // ── Κατορθώματα περιπέτειας ──────────────────────────────────────────────
  // Das „Frack" ist der Pinguin selbst.
  "trockener-frack": { name: "Στεγνό φράκο", description: "Ολόκληρη περιπέτεια χωρίς καμία πτώση στο νερό ή στο χιόνι.", bildbeschreibung: "μαύρο ψηλό καπέλο" },
  "immer-trocken": { name: "Πάντα στεγνά", description: (z) => `${el(z.trockeneAbenteuer, "περιπέτεια", "περιπέτειες")} χωρίς καμία πτώση στο νερό.`, bildbeschreibung: "κλειστή ομπρέλα" },
  fischfaenger: { name: "Καλή ψαριά", description: (z) => `${el(z.fische, "ψαράκι μπόνους", "ψαράκια μπόνους")} στα Παγοκομμάτια.`, bildbeschreibung: "μπλε ψάρι" },
  // ── Εξερεύνηση (Zonennamen wie im Spiel, Glossar §2.3) ───────────────────
  "hoehlen-lauscher": { name: "Αυτιά νυχτερίδας", description: "Ολόκληρη η Σπηλιά της ηχούς ως την έξοδο - στο σκοτάδι, μόνο με την ακοή.", bildbeschreibung: "νυχτερίδα" },
  "sturm-trotzer": { name: "Η χιονοθύελλα ξεπεράστηκε", description: "Η Χιονοθύελλα ξεπεράστηκε - σειρές από σύμβολα, γραμμένες από μνήμης.", bildbeschreibung: "πρόσωπο που φυσάει άνεμο" },
  "funker-freund": { name: "Φίλοι στον ασύρματο", description: "Ένα ολόκληρο μήνυμα από τον ασύρματο αποκρυπτογραφήθηκε και στάλθηκε στον Πολικό σταθμό.", bildbeschreibung: "ραδιόφωνο" },
  "polarlicht-entdecker": { name: "Κάτω από το πολικό σέλας", description: "Ολόκληρη η Πολική εξερεύνηση χωρίς κανένα λάθος - το πολικό σέλας χορεύει.", bildbeschreibung: "αστέρι με ουρά από σπίθες" },
  // ── Ιστορίες ─────────────────────────────────────────────────────────────
  "lese-luchs": { name: "Λύγκας της ανάγνωσης", nameNeutral: "Πρώτη ιστορία", description: "Η πρώτη ιστορία διαβάστηκε και γράφτηκε ως το τέλος.", bildbeschreibung: "λεοπάρδαλη" },
  // Glossar §2.4: „Βιβλιοφάγος" verrät mit dem Artikel ein Geschlecht - der Tiername nicht.
  buecherwurm: { name: "Ο βιβλιοσκώληκας", description: "3 ιστορίες διαβάστηκαν ως το τέλος.", bildbeschreibung: "πράσινη κάμπια" },
  "buecherei-baer": { name: "Αρκούδα της βιβλιοθήκης", nameNeutral: "Οκτώ ιστορίες", description: "8 ιστορίες διαβάστηκαν ως το τέλος.", bildbeschreibung: "αρκούδα" },
  vielleser: { name: "Βουνό από βιβλία", description: "15 ιστορίες διαβάστηκαν ως το τέλος.", bildbeschreibung: "στοίβα από χρωματιστά βιβλία" },
  // ── Ώρα για διάβασμα (μέρος = Teil einer Geschichte) ─────────────────────
  "seiten-spatz": { name: "Σπουργίτι της πρώτης σελίδας", nameNeutral: "Πρώτη σελίδα", description: "Το πρώτο μέρος μιας ιστορίας γράφτηκε.", bildbeschreibung: "μικρό μπλε πουλί" },
  "kapitel-krake": { name: "Χταπόδι που διαβάζει", nameNeutral: "Δέκα μέρη", description: "10 μέρη διαβάστηκαν και γράφτηκαν.", bildbeschreibung: "χταπόδι" },
  "geschichten-gigant": { name: "Μερίδα ελέφαντα από ιστορίες", description: "30 μέρη διαβάστηκαν και γράφτηκαν.", bildbeschreibung: "ελέφαντας" },
  leseratte: { name: "Διάβασμα χωρίς τέλος", nameNeutral: "75 μέρη", description: "75 μέρη διαβάστηκαν και γράφτηκαν.", bildbeschreibung: "πάπυρος" },
  // ── Κατορθώματα ανάγνωσης ────────────────────────────────────────────────
  federleicht: { name: "Ελαφρύ σαν φτερό", description: "Ένα ολόκληρο μέρος γράφτηκε χωρίς κανένα λάθος.", bildbeschreibung: "λευκό φτερό" },
  // „Μονορούφι" = in einem Zug; nicht „Χωρίς διακοπή" - so heisst schon die Familie „Am Stück".
  "in-einem-rutsch": { name: "Μονορούφι", description: "Μια ολόκληρη ιστορία διαβάστηκε ως το τέλος μέσα σε μία μέρα.", bildbeschreibung: "μπλε σπείρα" },
  "lesezeichen-held": { name: "Ο σελιδοδείκτης στη θέση του", description: "Διάβασμα σε άλλη μέρα ακριβώς από εκεί που είχε σταματήσει.", bildbeschreibung: "σελιδοδείκτης" },
  // ── Δεξιοτεχνία (nie „εξέταση") ──────────────────────────────────────────
  "zehn-minuten-abschrift": { name: "Αντιγραφή δέκα λεπτών", description: "Δέκα λεπτά αντιγραφή κειμένου χωρίς διάλειμμα και το πολύ 0,5% λάθη - όπως σε αληθινό διαγωνισμό.", bildbeschreibung: "χρονόμετρο" },
  "lehrgangs-meister": { name: "Το πρόγραμμα κατακτήθηκε", description: (z) => `Ολοκληρώθηκαν όλα τα μαθήματα του προγράμματος, το καθένα με τρία αστέρια (σύνολο ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "μαύρο καπέλο αποφοίτησης" },
  "goldene-tastatur": { name: "Χρυσό πληκτρολόγιο", description: "Όλα τα πλήκτρα ξεκλειδωμένα και σίγουρα - και μία φορά 160 πατήματα το λεπτό με ακρίβεια 98%. Το τελευταίο μετάλλιο.", bildbeschreibung: "αθλητικό μετάλλιο σε κορδέλα" },
  // ── Μυστικά ──────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Νωχελικός βραδύποδας", description: "Αργά αργά, αλλά χωρίς κανένα λάθος - η ακρίβεια μετράει περισσότερο από την ταχύτητα!", bildbeschreibung: "βραδύποδας" },
  "comeback-kaenguru": { name: "Άλμα καγκουρό", description: "Γύρος με 3 αστέρια αμέσως μετά από γύρο με 1 αστέρι.", bildbeschreibung: "καγκουρό" },
  // Uhrzeiten in Worten.
  nachteule: { name: "Κουκουβάγια της νύχτας", description: "Γύρος που τελείωσε μετά τις εννιά το βράδυ.", bildbeschreibung: "κουκουβάγια" },
  "frueher-vogel": { name: "Πρωινό πουλί", description: "Γύρος που τελείωσε πριν από τις επτά το πρωί.", bildbeschreibung: "κόκορας" },
  nimmersatt: { name: "Πείνα για διάβασμα", description: "3 μέρη μιας ιστορίας σε μία μέρα.", bildbeschreibung: "πράσινο μήλο" },
  // Monate gross (Regel 9).
  "ferien-held": { name: "Διακοπές με το πληκτρολόγιο", description: "Εξάσκηση στις καλοκαιρινές διακοπές - τον Ιούλιο ή τον Αύγουστο.", bildbeschreibung: "παραλία με ομπρέλα" },
  "wochenend-schreiber": { name: "Γραφή το Σαββατοκύριακο", description: "Εξάσκηση και το Σάββατο και την Κυριακή.", bildbeschreibung: "φύλλο ημερολογίου" },
  "zurueck-im-sattel": { name: "Ξανά στη σέλα", description: (z) => `Επιστροφή στην εξάσκηση μετά από διάλειμμα πάνω από ${el(z.pauseTage, "ημέρα", "ημέρες")} - και η επιστροφή μετράει.`, bildbeschreibung: "δύο βέλη σε κύκλο" },
  "doppelt-genaeht": { name: "Δύο φορές καθαρά", description: "Δύο γύροι χωρίς λάθος, ο ένας μετά τον άλλον.", bildbeschreibung: "βελόνα με κλωστή" },
  winterkind: { name: "Χειμωνιάτικα πλήκτρα", description: "Εξάσκηση στην καρδιά του χειμώνα - τον Δεκέμβριο ή τον Ιανουάριο.", bildbeschreibung: "χιονάνθρωπος" },
  jahreswechsel: { name: "Καλή χρονιά", description: "Εξάσκηση την τελευταία μέρα του χρόνου ή την πρώτη μέρα του νέου.", bildbeschreibung: "πυροτεχνήματα στον νυχτερινό ουρανό" },
  "tages-marathon": { name: "Μαραθώνιος μιας μέρας", description: "Δέκα γύροι σε μία μέρα.", bildbeschreibung: "άνθρωπος πάνω σε άλογο αγώνων" },
  sternentag: { name: "Μέρα με αστέρια", description: "Τρεις γύροι με τρία αστέρια σε μία μέρα.", bildbeschreibung: "ήλιος με πρόσωπο" },
  // „Λαμπίκος" = blitzsauber.
  blitzsauber: { name: "Λαμπίκος", description: "Τρεις γύροι χωρίς λάθος σε μία μέρα.", bildbeschreibung: "σαπούνι με αφρό" },
  "volle-woche": { name: "Γεμάτη εβδομάδα", description: "Πέντε διαφορετικές ημέρες εξάσκησης σε ΜΙΑ εβδομάδα.", bildbeschreibung: "πράσινο βιβλίο" },
  // „Blindflug" ⇒ „Χωρίς να κοιτάς" (Regel 4: nie „τυφλό").
  blindflug: { name: "Χωρίς να κοιτάς", description: "Ολόκληρος γύρος χωρίς λάθος - με κρυμμένο το πληκτρολόγιο της οθόνης. Αυτό ακριβώς είναι η δακτυλογράφηση με δέκα δάχτυλα.", bildbeschreibung: "μαϊμουδάκι που κλείνει τα μάτια του" },
  // Sprachnamen gross (Regel 9).
  sprachwechsler: { name: "Ταξίδι ανάμεσα στις γλώσσες", description: "Εξάσκηση σε δύο γλώσσες - για παράδειγμα στα Ελληνικά και στα Αγγλικά.", bildbeschreibung: "υδρόγειος με την Ευρώπη και την Αφρική" },
  lesenacht: { name: "Διάβασμα τη νύχτα", description: "Ένα μέρος ιστορίας διαβάστηκε μετά τις οκτώ το βράδυ.", bildbeschreibung: "φεγγάρι με πρόσωπο" },
  "zaehe-taste": { name: "Πεισματάρικο πλήκτρο", description: "Ένα πλήκτρο που δυσκόλευε για πολύ είναι τώρα σίγουρο.", bildbeschreibung: "σαλιγκάρι" },
  aufsteiger: { name: "Ανηφόρα", description: "Πέντε επίπεδα δυσκολίας πάνω από το σημείο εκκίνησης.", bildbeschreibung: "γράφημα με καμπύλη που ανεβαίνει" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine griechische Bedienung auf diesem Weg.
  "akzente-ziffernreihe": { name: "Ακροβασίες με τόνους", nameNeutral: "é, è, ç και à", description: "Ξεκλειδώθηκαν τα é, è, ç και à - γράμματα που μένουν στη σειρά αριθμών.", bildbeschreibung: "ψηφία 1 2 3 4 σε μπλε πλήκτρο" },
  "accent-circonflexe": { name: "Καπελάκι", nameNeutral: "Γαλλικό καπελάκι", description: "Το νεκρό πλήκτρο ^ είναι σίγουρο: ê, â, î, ô και û.", bildbeschreibung: "ψάθινο καπέλο με κορδέλα" },
  trema: { name: "Πασχαλίτσα με δύο τελείες", nameNeutral: "Δύο τελείες", description: "Το νεκρό πλήκτρο ¨ είναι σίγουρο: ë, ï και ü.", bildbeschreibung: "πασχαλίτσα" },
};
