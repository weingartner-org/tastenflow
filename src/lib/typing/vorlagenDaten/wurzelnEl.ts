/**
 * ★ G3c-VERTEILER (25.10.2026): DIE WURZEL-VORLAGE DES WEGES „el" (Griechisch) - woher die Wörter kommen, zum Abschreiben. Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `radiciIt.ts` (mit `beleg`) und `korenyCs.ts`: drei Altersstufen, Themen mit Paaren `<Hinweis> - <Wort>`. Die Feldnamen sind
 * die von `radiciIt.ts` (`indizio`, `parola`, `origine`, `beleg`) - genau die Schlüssel der Quelle, iCloud
 * `sprachen-2026-10-25/tf-fest-neu/el/tf-fest-el.json`: `wurzeln` (`{ kids, teens, erwachsen }`) und `wurzelKategorien` (die Themen).
 * `raetsel` dort ist KEINE Wurzel-Zeile (Rezept D „Befund raetsel") und gehört nicht hierher.
 *
 * Zeilenregeln (Wächter: `tests/tastenflow-lerndaten-el.test.ts`, Vorbild `tastenflow-vorlage-koreny-cs`): höchstens 40 Zeichen,
 * genau ein ` - `, `parola` ein Einzelwort, klein, nicht im Hinweis; kein Wort doppelt; keine Sperrwörter (`sperrlisteEl.ts`); nur Zeichen
 * aller Tastaturen des Weges. Mengen: der Wächter misst die eigene Grösse (cs/it verlangen 80 je Stufe, die neuen Daten haben weniger).
 *
 * ★ D-LERNDATEN (25.10.2026): gefüllt aus `tf-fest-el.json` (`wurzeln`, `wurzelKategorien`), geprüft im `PRUEFBERICHT.md`
 * desselben Ordners. Paare je Stufe: Kinder 80, Jugend 80, Erwachsene 80 (Ziel wie cs/it: 80 - der
 * Wächter führt die gelieferte Menge als benannte Mindestzahl). Die Themen-Namen auf Deutsch und Englisch (`titelJe`) sind in
 * D-LERNDATEN übersetzt (die übrigen Bedienungen lesen das Englische). `raetsel` (240 Zeilen) ist NICHT eingehängt - es hat im
 * Code keinen Platz (Rezept D, Erkenntnis 3; Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * Wächter: `tests/tastenflow-lerndaten-el.test.ts`.
 *
 * Verteiler: `vorlagen.ts` (`GERUEST_WURZELN`, Art `"wortherkunft"`; Gruppe in `EigenerTextQuelle.tsx`). Solange {@link WURZEL_THEMEN_EL}
 * leer ist, gibt es KEINE Vorlage (weder „Eigene Übung" noch Tippchallenge); mit dem ersten Thema erscheint sie für Weg UND Übungssprache „el".
 *
 * ⚠️ DATENBLATT: nur `import type`, kein Code-Import.
 */

export type WurzelStufeEl = "kids" | "teens" | "erwachsen";

/** Woher ein Wort kommt - GESCHLOSSENE Liste (gemessen in `tf-fest-el.json`, 25.10.2026); nur für die Lehrkraft, wird nicht abgetippt. */
export type WurzelOrigineEl = "αγγλικά" | "αρχαίες ρίζες" | "βενετικά" | "γαλλικά" | "ιταλικά" | "λατινικά" | "τουρκικά";

export interface WurzelPaarEl {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  indizio: string;
  /** Das Wort selbst - ein Einzelwort, klein. */
  parola: string;
  origine: WurzelOrigineEl;
  /** Wo die Herkunft nachgelesen wurde (Quelle aus `tf-fest`, z. B. eine Wiktionary-Seite). */
  beleg: string;
}

export interface WurzelThemaEl {
  id: string;
  titel: string;
  paare: WurzelPaarEl[];
}

/** Die Themen (aus `wurzelKategorien`): `titel` in Griechisch, `titelJe` der Name in den Bedienungssprachen (fehlt einer: englisch, sonst `titel`). */
export const WURZEL_THEMEN_EL: readonly { id: string; titel: string; titelJe?: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> }[] = [
  { id: "archaies", titel: "Λέξεις από αρχαίες ελληνικές ρίζες", titelJe: { de: "Wörter aus altgriechischen Wurzeln", en: "Words from Ancient Greek roots" } },
  { id: "latinika", titel: "Λέξεις από τα λατινικά", titelJe: { de: "Wörter aus dem Lateinischen", en: "Words from Latin" } },
  { id: "italika", titel: "Λέξεις από τα ιταλικά και τα βενετικά", titelJe: { de: "Wörter aus dem Italienischen und Venezianischen", en: "Words from Italian and Venetian" } },
  { id: "tourkika", titel: "Λέξεις από τα τουρκικά", titelJe: { de: "Wörter aus dem Türkischen", en: "Words from Turkish" } },
  { id: "gallika", titel: "Λέξεις από τα γαλλικά και τα αγγλικά", titelJe: { de: "Wörter aus dem Französischen und Englischen", en: "Words from French and English" } },
];

/** Die Paare je Stufe und Thema. */
export const WURZELN_EL: Record<WurzelStufeEl, WurzelThemaEl[]> = {
  kids: [
    {
      id: "archaies",
      titel: "Λέξεις από αρχαίες ελληνικές ρίζες",
      paare: [
        { indizio: "μιλάς με κάποιον που είναι μακριά", parola: "τηλέφωνο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/τηλέφωνο" },
        { indizio: "τρομερή σαύρα του παρελθόντος", parola: "δεινόσαυρος", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/δεινόσαυρος" },
        { indizio: "άλογο του ποταμού", parola: "ιπποπόταμος", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ιπποπόταμος" },
        { indizio: "δείχνει τα πολύ μικρά", parola: "μικροσκόπιο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/μικροσκόπιο" },
        { indizio: "περιγράφει τη γη, τα βουνά και τις χώρες", parola: "γεωγραφία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/γεωγραφία" },
        { indizio: "ράφια με πολλά βιβλία", parola: "βιβλιοθήκη", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/βιβλιοθήκη" },
        { indizio: "σχήμα με τρεις γωνίες", parola: "τρίγωνο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/τρίγωνο" },
        { indizio: "σχήμα των κελιών της κηρήθρας", parola: "εξάγωνο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/εξάγωνο" },
        { indizio: "ζει και στο νερό και στη στεριά", parola: "αμφίβιο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/αμφίβιο" },
        { indizio: "εικόνα που γράφεται με το φως", parola: "φωτογραφία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/φωτογραφία" },
        { indizio: "πετά με έλικα που γυρίζει", parola: "ελικόπτερο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ελικόπτερο" },
        { indizio: "έχει κέρατο πάνω στη μύτη", parola: "ρινόκερος", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ρινόκερος" },
        { indizio: "το κινούμε με τα πόδια", parola: "ποδήλατο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ποδήλατο" },
        { indizio: "βλέπουμε εικόνες από μακριά", parola: "τηλεόραση", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/τηλεόραση" },
        { indizio: "ταξιδεύει ανάμεσα στα άστρα", parola: "αστροναύτης", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/αστροναύτης" },
        { indizio: "μετρά πόσο ζεστό είναι", parola: "θερμόμετρο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/θερμόμετρο" },
        { indizio: "σχήμα με πέντε γωνίες", parola: "πεντάγωνο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/πεντάγωνο" },
        { indizio: "μελετά τα άστρα", parola: "αστρονομία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/αστρονομία" },
        { indizio: "έχει οκτώ πόδια και ζει στη θάλασσα", parola: "χταπόδι", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/χταπόδι" },
        { indizio: "σκηνή με πολλές θέσεις για να δούμε έργο", parola: "θέατρο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/θέατρο" },
      ],
    },
    {
      id: "latinika",
      titel: "Λέξεις από τα λατινικά",
      paare: [
        { indizio: "εκεί μένουμε με την οικογένεια", parola: "σπίτι", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/σπίτι" },
        { indizio: "την ανοίγουμε για να μπούμε", parola: "πόρτα", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/πόρτα" },
        { indizio: "παλιό οχυρό με τείχη και πύργους", parola: "κάστρο", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κάστρο" },
        { indizio: "ζεστό κουτί της κουζίνας για φαγητά και γλυκά", parola: "φούρνος", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/φούρνος" },
        { indizio: "καθόμαστε πάνω της στο άλογο", parola: "σέλα", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/σέλα" },
        { indizio: "χτυπά στο καμπαναριό", parola: "καμπάνα", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/καμπάνα" },
        { indizio: "ζώο ανάμεσα σε άλογο και γάιδαρο", parola: "μουλάρι", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/μουλάρι" },
        { indizio: "πλένουμε μαζί του τα χέρια", parola: "σαπούνι", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/σαπούνι" },
        { indizio: "ακουμπάμε πάνω του το κεφάλι στο κρεβάτι", parola: "μαξιλάρι", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/μαξιλάρι" },
        { indizio: "τραγούδια που λέμε τα Χριστούγεννα", parola: "κάλαντα", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κάλαντα" },
        { indizio: "ο μήνας που αρχίζει η άνοιξη", parola: "Μάρτιος", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/Μάρτιος" },
        { indizio: "μακρύ και ψήνεται στη σχάρα", parola: "λουκάνικο", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/λουκάνικο" },
        { indizio: "μικρό κάθισμα χωρίς πλάτη", parola: "σκαμνί", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/σκαμνί" },
        { indizio: "μαύρο και καίγεται στη σχάρα", parola: "κάρβουνο", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κάρβουνο" },
        { indizio: "ο έβδομος μήνας του χρόνου", parola: "Ιούλιος", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/Ιούλιος" },
      ],
    },
    {
      id: "italika",
      titel: "Λέξεις από τα ιταλικά και τα βενετικά",
      paare: [
        { indizio: "βγαίνουμε σε αυτό από το σαλόνι", parola: "μπαλκόνι", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/μπαλκόνι" },
        { indizio: "μας προστατεύει από τη βροχή", parola: "ομπρέλα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/ομπρέλα" },
        { indizio: "σε αυτό σερβίρουμε το φαγητό", parola: "πιάτο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/πιάτο" },
        { indizio: "το φοράμε στο κεφάλι", parola: "καπέλο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/καπέλο" },
        { indizio: "ζυμαρικά με σάλτσα", parola: "μακαρόνια", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/μακαρόνια" },
        { indizio: "μεγάλα κύματα και δυνατός αέρας στη θάλασσα", parola: "φουρτούνα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/φουρτούνα" },
        { indizio: "παλιά λέξη για το πλοίο", parola: "βαπόρι", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/βαπόρι" },
        { indizio: "δωμάτιο με μπανιέρα και νιπτήρα", parola: "μπάνιο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/μπάνιο" },
        { indizio: "βάζουμε μέσα τα ρούχα για το ταξίδι", parola: "βαλίτσα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/βαλίτσα" },
        { indizio: "κρατάμε μέσα του τα χρήματα", parola: "πορτοφόλι", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/πορτοφόλι" },
        { indizio: "πορτοκαλί λαχανικό που αρέσει στα κουνέλια", parola: "καρότο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/καρότο" },
        { indizio: "μας σκεπάζει στο κρεβάτι", parola: "κουβέρτα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/κουβέρτα" },
        { indizio: "το φουσκώνουμε στα γενέθλια", parola: "μπαλόνι", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/μπαλόνι" },
        { indizio: "κόμπος με κορδέλα στα μαλλιά", parola: "φιόγκος", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/φιόγκος" },
        { indizio: "αλλαντικό που κόβουμε σε φέτες", parola: "σαλάμι", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/σαλάμι" },
      ],
    },
    {
      id: "tourkika",
      titel: "Λέξεις από τα τουρκικά",
      paare: [
        { indizio: "άσπρο και παχύ, φτιάχνεται από γάλα", parola: "γιαούρτι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/γιαούρτι" },
        { indizio: "αμπελόφυλλο γεμιστό με ρύζι", parola: "ντολμάς", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/ντολμάς" },
        { indizio: "φαγητό με μελιτζάνες και κιμά στον φούρνο", parola: "μουσακάς", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μουσακάς" },
        { indizio: "στρώνεται στο πάτωμα", parola: "χαλί", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/χαλί" },
        { indizio: "μεγάλο σκεύος για το φαγητό στον φούρνο", parola: "ταψί", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/ταψί" },
        { indizio: "πίνουμε μέσα του τον καφέ", parola: "φλιτζάνι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/φλιτζάνι" },
        { indizio: "φτιάχνεται από δέρμα και έχει σόλα", parola: "παπούτσι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/παπούτσι" },
        { indizio: "βάζουμε μέσα της τα χέρια στο παντελόνι", parola: "τσέπη", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/τσέπη" },
        { indizio: "μικρό ανοιχτό σπιτάκι στον κήπο", parola: "κιόσκι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/κιόσκι" },
        { indizio: "με αυτήν βάφουμε τον τοίχο", parola: "μπογιά", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μπογιά" },
        { indizio: "ξύλινη βάρκα του ψαρά", parola: "καΐκι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/καΐκι" },
        { indizio: "σκαρφαλώνει στα δέντρα και τρώει μπανάνες", parola: "μαϊμού", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μαϊμού" },
        { indizio: "μπαλίτσα από κιμά στο τηγάνι", parola: "κεφτές", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/κεφτές" },
        { indizio: "γλυκό με φύλλο, καρύδια και σιρόπι", parola: "μπακλαβάς", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μπακλαβάς" },
        { indizio: "γυαλί στο παράθυρο", parola: "τζάμι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/τζάμι" },
      ],
    },
    {
      id: "gallika",
      titel: "Λέξεις από τα γαλλικά και τα αγγλικά",
      paare: [
        { indizio: "ανεβαίνει και κατεβαίνει με επιβάτες", parola: "ασανσέρ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/ασανσέρ" },
        { indizio: "το τυλίγουμε γύρω από τον λαιμό", parola: "κασκόλ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/κασκόλ" },
        { indizio: "ζεστό χοντρό σακάκι για τον χειμώνα", parola: "μπουφάν", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/μπουφάν" },
        { indizio: "το φοράμε στο πάνω μέρος του σώματος", parola: "μπλούζα", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/μπλούζα" },
        { indizio: "εκεί παρκάρουμε το αυτοκίνητο", parola: "γκαράζ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/γκαράζ" },
        { indizio: "το φοράμε για να κολυμπήσουμε", parola: "μαγιό", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/μαγιό" },
        { indizio: "ζεστό πλεκτό ρούχο", parola: "πουλόβερ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/πουλόβερ" },
        { indizio: "δύο φέτες ψωμί με γέμιση", parola: "σάντουιτς", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/σάντουιτς" },
        { indizio: "γλυκό ψημένο στη φόρμα", parola: "κέικ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/κέικ" },
        { indizio: "παντελόνι από μπλε ύφασμα", parola: "τζιν", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/τζιν" },
        { indizio: "κοντό παντελόνι για το καλοκαίρι", parola: "σορτς", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/σορτς" },
        { indizio: "η μπάλα μπαίνει στο τέρμα", parola: "γκολ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/γκολ" },
        { indizio: "γλυκό που τρέμει στο πιάτο", parola: "ζελέ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/ζελέ" },
        { indizio: "βάφει τα χείλη", parola: "κραγιόν", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/κραγιόν" },
        { indizio: "γλιστράμε με αυτό στον πάγο", parola: "πατινάζ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/πατινάζ" },
      ],
    },
  ],
  teens: [
    {
      id: "archaies",
      titel: "Λέξεις από αρχαίες ελληνικές ρίζες",
      paare: [
        { indizio: "εξουσία του λαού", parola: "δημοκρατία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/δημοκρατία" },
        { indizio: "αγάπη για τη σοφία", parola: "φιλοσοφία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/φιλοσοφία" },
        { indizio: "επιστήμη της ζωής", parola: "βιολογία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/βιολογία" },
        { indizio: "σωστή γραφή των λέξεων", parola: "ορθογραφία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ορθογραφία" },
        { indizio: "κτίριο με πολλά σπίτια μαζί", parola: "πολυκατοικία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/πολυκατοικία" },
        { indizio: "κινείται μόνο του στον δρόμο", parola: "αυτοκίνητο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/αυτοκίνητο" },
        { indizio: "πετά στον αέρα με φτερά", parola: "αεροπλάνο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/αεροπλάνο" },
        { indizio: "βλέπουμε μαζί του μακρινά αστέρια", parola: "τηλεσκόπιο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/τηλεσκόπιο" },
        { indizio: "κάνει τη μικρή φωνή δυνατή", parola: "μικρόφωνο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/μικρόφωνο" },
        { indizio: "μεγάλη ομάδα νησιών στη θάλασσα", parola: "αρχιπέλαγος", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/αρχιπέλαγος" },
        { indizio: "στεριά σχεδόν νησί", parola: "χερσόνησος", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/χερσόνησος" },
        { indizio: "εκεί έτρεχαν τα άλογα στους αγώνες", parola: "ιππόδρομος", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ιππόδρομος" },
        { indizio: "μελετά τη σκέψη και τα συναισθήματα", parola: "ψυχολογία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ψυχολογία" },
        { indizio: "μέτρηση της γης, σχήματα και γωνίες", parola: "γεωμετρία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/γεωμετρία" },
        { indizio: "καταγράφει πόσο τρέμει η γη", parola: "σεισμογράφος", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/σεισμογράφος" },
        { indizio: "τα φυτά φτιάχνουν τροφή με το φως", parola: "φωτοσύνθεση", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/φωτοσύνθεση" },
        { indizio: "μεγάλη ορχήστρα που αγαπά την αρμονία", parola: "φιλαρμονική", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/φιλαρμονική" },
        { indizio: "μετρά τον χρόνο στους αγώνες", parola: "χρονόμετρο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/χρονόμετρο" },
        { indizio: "γράμματα στη σειρά από το άλφα ως το ωμέγα", parola: "αλφάβητο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/αλφάβητο" },
        { indizio: "επιστήμη που μελετά τα ζώα", parola: "ζωολογία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ζωολογία" },
      ],
    },
    {
      id: "latinika",
      titel: "Λέξεις από τα λατινικά",
      paare: [
        { indizio: "μεγάλο σπίτι του βασιλιά", parola: "παλάτι", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/παλάτι" },
        { indizio: "ο γιος του βασιλιά", parola: "πρίγκιπας", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/πρίγκιπας" },
        { indizio: "σίδερα γύρω από τον κήπο ή το μπαλκόνι", parola: "κάγκελο", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κάγκελο" },
        { indizio: "καλύπτει το κεφάλι στο μπουφάν", parola: "κουκούλα", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κουκούλα" },
        { indizio: "υπόγειο για το κρασί και τα τρόφιμα", parola: "κελάρι", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κελάρι" },
        { indizio: "σπίτι για τα άλογα", parola: "στάβλος", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/στάβλος" },
        { indizio: "απόσταση στη θάλασσα για τα πλοία", parola: "μίλι", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/μίλι" },
        { indizio: "ύφασμα για το κεφάλι ή τη μύτη", parola: "μαντίλι", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/μαντίλι" },
        { indizio: "παιχνίδι με ζάρια και πούλια", parola: "τάβλι", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/τάβλι" },
        { indizio: "μεγάλη επίπεδη έκταση με χωράφια", parola: "κάμπος", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κάμπος" },
        { indizio: "παλιά λέξη για τον δρόμο", parola: "στράτα", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/στράτα" },
        { indizio: "ανεβαίνουμε μαζί της στον πάνω όροφο", parola: "σκάλα", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/σκάλα" },
        { indizio: "καντηλάκι που καίει μπροστά στην εικόνα", parola: "καντήλι", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/καντήλι" },
        { indizio: "ο μήνας του Δεκαπενταύγουστου", parola: "Αύγουστος", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/Αύγουστος" },
        { indizio: "ο πρώτος μήνας του χρόνου", parola: "Ιανουάριος", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/Ιανουάριος" },
      ],
    },
    {
      id: "italika",
      titel: "Λέξεις από τα ιταλικά και τα βενετικά",
      paare: [
        { indizio: "μόλις ψαρεμένος ή κομμένος, όχι μπαγιάτικος", parola: "φρέσκος", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/φρέσκος" },
        { indizio: "γυάλινο δοχείο για νερό ή λάδι", parola: "μπουκάλι", origine: "βενετικά", beleg: "https://el.wiktionary.org/wiki/μπουκάλι" },
        { indizio: "μπλούζα για τη ζέστη ή την ομάδα", parola: "φανέλα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/φανέλα" },
        { indizio: "η πλατεία του ταξί", parola: "πιάτσα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/πιάτσα" },
        { indizio: "μαγαζάκι με φαγητό στο σχολείο", parola: "καντίνα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/καντίνα" },
        { indizio: "διευθύνει την ορχήστρα", parola: "μαέστρος", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/μαέστρος" },
        { indizio: "έγχορδο όργανο με δοξάρι", parola: "βιολί", origine: "βενετικά", beleg: "https://el.wiktionary.org/wiki/βιολί" },
        { indizio: "μεγάλη αποτυχία", parola: "φιάσκο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/φιάσκο" },
        { indizio: "γρήγορο σχέδιο με μολύβι", parola: "σκίτσο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/σκίτσο" },
        { indizio: "τη φοράμε στο πόδι πριν το παπούτσι", parola: "κάλτσα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/κάλτσα" },
        { indizio: "μικρή κλειδαριά που κρεμάμε σε πόρτα ή ντουλάπι", parola: "λουκέτο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/λουκέτο" },
        { indizio: "ο αρχηγός του πλοίου", parola: "καπετάνιος", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/καπετάνιος" },
        { indizio: "γκρίζα σκόνη για τα κτίρια", parola: "τσιμέντο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/τσιμέντο" },
        { indizio: "η οικογένεια, στην καθημερινή γλώσσα", parola: "φαμίλια", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/φαμίλια" },
        { indizio: "τη δένουμε στον λαιμό με το πουκάμισο", parola: "γραβάτα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/γραβάτα" },
      ],
    },
    {
      id: "tourkika",
      titel: "Λέξεις από τα τουρκικά",
      paare: [
        { indizio: "ζεστό ρόφημα που ξυπνά", parola: "καφές", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/καφές" },
        { indizio: "μικρή μερίδα φαγητού για να δοκιμάσουμε", parola: "μεζές", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μεζές" },
        { indizio: "στενό δρομάκι", parola: "σοκάκι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/σοκάκι" },
        { indizio: "έπιπλο για τα ρούχα", parola: "ντουλάπα", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/ντουλάπα" },
        { indizio: "γλυκό από σιμιγδάλι ή ταχίνι", parola: "χαλβάς", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/χαλβάς" },
        { indizio: "καλή διάθεση", parola: "κέφι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/κέφι" },
        { indizio: "γιορτή με μουσική και χορό", parola: "γλέντι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/γλέντι" },
        { indizio: "δεν θέλει να δουλέψει", parola: "τεμπέλης", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/τεμπέλης" },
        { indizio: "κήπος με λαχανικά", parola: "μπαξές", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μπαξές" },
        { indizio: "πουλάει τρόφιμα στη γειτονιά", parola: "μπακάλης", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μπακάλης" },
        { indizio: "μεγάλο μεταλλικό δοχείο για βράσιμο", parola: "καζάνι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/καζάνι" },
        { indizio: "ρούχο χωρίς μανίκια πάνω από το πουκάμισο", parola: "γιλέκο", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/γιλέκο" },
        { indizio: "κρουστό όργανο με κουδουνάκια", parola: "ντέφι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/ντέφι" },
        { indizio: "δυσκολία, πίεση", parola: "ζόρι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/ζόρι" },
        { indizio: "μικρό ελάττωμα", parola: "κουσούρι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/κουσούρι" },
      ],
    },
    {
      id: "gallika",
      titel: "Λέξεις από τα γαλλικά και τα αγγλικά",
      paare: [
        { indizio: "συνάντηση δύο ομάδων", parola: "ματς", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/ματς" },
        { indizio: "άθλημα με ρακέτα και φιλέ", parola: "τένις", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/τένις" },
        { indizio: "άθλημα με καλάθι", parola: "μπάσκετ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/μπάσκετ" },
        { indizio: "άθλημα με μπάλα πάνω από το δίχτυ", parola: "βόλεϊ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/βόλεϊ" },
        { indizio: "πάνω στα κύματα με μια σανίδα", parola: "σέρφινγκ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/σέρφινγκ" },
        { indizio: "ασχολία για τον ελεύθερο χρόνο", parola: "χόμπι", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/χόμπι" },
        { indizio: "μέρα ξεκούρασης από τη δουλειά", parola: "ρεπό", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/ρεπό" },
        { indizio: "βάψιμο του προσώπου", parola: "μακιγιάζ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/μακιγιάζ" },
        { indizio: "ο αρχηγός της κουζίνας", parola: "σεφ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/σεφ" },
        { indizio: "η διακόσμηση ενός χώρου", parola: "ντεκόρ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/ντεκόρ" },
        { indizio: "μικρό κατάστημα με ρούχα", parola: "μπουτίκ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/μπουτίκ" },
        { indizio: "αγώνες με πολλές ομάδες", parola: "τουρνουά", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/τουρνουά" },
        { indizio: "οργανωμένη παραλία", parola: "πλαζ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/πλαζ" },
        { indizio: "το αποτέλεσμα του αγώνα", parola: "σκορ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/σκορ" },
        { indizio: "μουσική με ηλεκτρικές κιθάρες", parola: "ροκ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/ροκ" },
      ],
    },
  ],
  erwachsen: [
    {
      id: "archaies",
      titel: "Λέξεις από αρχαίες ελληνικές ρίζες",
      paare: [
        { indizio: "αγάπη για τον συνάνθρωπο", parola: "φιλανθρωπία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/φιλανθρωπία" },
        { indizio: "οι νόμοι του σπιτιού, τα έσοδα και τα έξοδα", parola: "οικονομία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/οικονομία" },
        { indizio: "μελετά το περιβάλλον και τα έμβια όντα", parola: "οικολογία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/οικολογία" },
        { indizio: "μελετά τον άνθρωπο και τους πολιτισμούς", parola: "ανθρωπολογία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ανθρωπολογία" },
        { indizio: "μελετά τα αρχαία ευρήματα", parola: "αρχαιολογία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/αρχαιολογία" },
        { indizio: "μελετά τα απολιθώματα", parola: "παλαιοντολογία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/παλαιοντολογία" },
        { indizio: "η θέα προς όλες τις μεριές", parola: "πανόραμα", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/πανόραμα" },
        { indizio: "ο νόμος του εαυτού του, ανεξαρτησία", parola: "αυτονομία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/αυτονομία" },
        { indizio: "η αληθινή ρίζα μιας λέξης", parola: "ετυμολογία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ετυμολογία" },
        { indizio: "η τέχνη του ωραίου γραψίματος", parola: "καλλιγραφία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/καλλιγραφία" },
        { indizio: "δέχεται τους ξένους για ύπνο", parola: "ξενοδοχείο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/ξενοδοχείο" },
        { indizio: "εκεί φροντίζουν τους αρρώστους", parola: "νοσοκομείο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/νοσοκομείο" },
        { indizio: "βιβλίο με όλη τη γνώση σε κύκλο", parola: "εγκυκλοπαίδεια", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/εγκυκλοπαίδεια" },
        { indizio: "θέατρο με θέσεις γύρω γύρω", parola: "αμφιθέατρο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/αμφιθέατρο" },
        { indizio: "γνωρίζει πολλές γλώσσες", parola: "πολύγλωσσος", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/πολύγλωσσος" },
        { indizio: "επισκευάζει τους σωλήνες του νερού", parola: "υδραυλικός", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/υδραυλικός" },
        { indizio: "μετρά την πίεση του αέρα", parola: "βαρόμετρο", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/βαρόμετρο" },
        { indizio: "γιατρός των παιδιών", parola: "παιδίατρος", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/παιδίατρος" },
        { indizio: "η ιστορία της ζωής κάποιου, γραμμένη σε βιβλίο", parola: "βιογραφία", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/βιογραφία" },
        { indizio: "γράφει μουσική για ορχήστρα", parola: "μουσικοσυνθέτης", origine: "αρχαίες ρίζες", beleg: "https://el.wiktionary.org/wiki/μουσικοσυνθέτης" },
      ],
    },
    {
      id: "latinika",
      titel: "Λέξεις από τα λατινικά",
      paare: [
        { indizio: "μικρό δωμάτιο μοναχού", parola: "κελί", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κελί" },
        { indizio: "τίτλος ευγενούς, πάνω από τον κόμη", parola: "δούκας", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/δούκας" },
        { indizio: "ευγενής με τίτλο κάτω από τον δούκα", parola: "κόμης", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κόμης" },
        { indizio: "στέγαστρο πάνω από ιερό ή τάφο", parola: "κουβούκλιο", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κουβούκλιο" },
        { indizio: "λεπτό δέρμα για γραφή ή λεπτό στρώμα", parola: "μεμβράνη", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/μεμβράνη" },
        { indizio: "εργαλείο με δόντια για το άχυρο", parola: "φούρκα", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/φούρκα" },
        { indizio: "παλιά μονάδα βάρους", parola: "ουγγιά", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/ουγγιά" },
        { indizio: "κόκκινο κομμάτι από ψημένο πηλό για το χτίσιμο", parola: "τούβλο", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/τούβλο" },
        { indizio: "μονάδα του ρωμαϊκού στρατού", parola: "λεγεώνα", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/λεγεώνα" },
        { indizio: "έδρα του Ρωμαίου διοικητή", parola: "πραιτόριο", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/πραιτόριο" },
        { indizio: "ανώτερος κληρικός της καθολικής εκκλησίας", parola: "καρδινάλιος", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/καρδινάλιος" },
        { indizio: "συνοδεία που φυλάει και προσέχει", parola: "κουστωδία", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/κουστωδία" },
        { indizio: "ο μήνας που ανοίγουν τα σχολεία", parola: "Σεπτέμβριος", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/Σεπτέμβριος" },
        { indizio: "σημαία, λάβαρο στις γιορτές του χωριού", parola: "φλάμπουρο", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/φλάμπουρο" },
        { indizio: "ο μήνας της πρώτης μέρας του καλοκαιριού", parola: "Ιούνιος", origine: "λατινικά", beleg: "https://el.wiktionary.org/wiki/Ιούνιος" },
      ],
    },
    {
      id: "italika",
      titel: "Λέξεις από τα ιταλικά και τα βενετικά",
      paare: [
        { indizio: "πνευματικός συγγενής, όπως ο νονός", parola: "κουμπάρος", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/κουμπάρος" },
        { indizio: "σήμα για να καταλάβει ο άλλος", parola: "σινιάλο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/σινιάλο" },
        { indizio: "ζημιά σε πλοίο ή μηχανή", parola: "αβαρία", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/αβαρία" },
        { indizio: "τραγούδι κάτω από το παράθυρο τη νύχτα", parola: "καντάδα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/καντάδα" },
        { indizio: "κίνηση με το τιμόνι", parola: "μανούβρα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/μανούβρα" },
        { indizio: "αντίθετη θέση, αντιπαράθεση", parola: "κόντρα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/κόντρα" },
        { indizio: "πάστα για τις τρύπες στον τοίχο", parola: "στόκος", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/στόκος" },
        { indizio: "άχρηστος, χαλασμένος", parola: "σκάρτος", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/σκάρτος" },
        { indizio: "ο λάθος τόνος στο τραγούδι", parola: "φάλτσο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/φάλτσο" },
        { indizio: "δοκιμή του ρούχου ή του έργου", parola: "πρόβα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/πρόβα" },
        { indizio: "σειρά για τη δουλειά της νύχτας", parola: "βάρδια", origine: "βενετικά", beleg: "https://el.wiktionary.org/wiki/βάρδια" },
        { indizio: "επιφώνημα όταν κάποιος τα πάει πολύ καλά", parola: "μπράβο", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/μπράβο" },
        { indizio: "μια χαρά, πολύ καλά, στην καθημερινή γλώσσα", parola: "πρίμα", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/πρίμα" },
        { indizio: "ανατολικός άνεμος", parola: "λεβάντες", origine: "ιταλικά", beleg: "https://el.wiktionary.org/wiki/λεβάντες" },
        { indizio: "στενό δρομάκι στις πόλεις των Επτανήσων", parola: "καντούνι", origine: "βενετικά", beleg: "https://el.wiktionary.org/wiki/καντούνι" },
      ],
    },
    {
      id: "tourkika",
      titel: "Λέξεις από τα τουρκικά",
      paare: [
        { indizio: "είδηση, νέο", parola: "χαμπάρι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/χαμπάρι" },
        { indizio: "αγάπη και φροντίδα σε μια δουλειά", parola: "μεράκι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μεράκι" },
        { indizio: "καημός της αγάπης", parola: "νταλκάς", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/νταλκάς" },
        { indizio: "μπλέξιμο, φασαρία", parola: "μπελάς", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μπελάς" },
        { indizio: "ντροπή μπροστά σε όλους", parola: "ρεζίλι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/ρεζίλι" },
        { indizio: "χάρη σε κάποιον", parola: "χατίρι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/χατίρι" },
        { indizio: "βαθύς πόνος της ψυχής", parola: "ντέρτι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/ντέρτι" },
        { indizio: "φιλονικία με φωνές", parola: "καβγάς", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/καβγάς" },
        { indizio: "άσχημη κατάσταση", parola: "χάλι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/χάλι" },
        { indizio: "ο επισκέπτης στο σπίτι", parola: "μουσαφίρης", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μουσαφίρης" },
        { indizio: "γειτονιά της παλιάς πόλης", parola: "μαχαλάς", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/μαχαλάς" },
        { indizio: "κάτι που χάθηκε άδικα", parola: "χαράμι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/χαράμι" },
        { indizio: "χαμηλός καναπές", parola: "ντιβάνι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/ντιβάνι" },
        { indizio: "δρόμος στρωμένος με πέτρες", parola: "καλντερίμι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/καλντερίμι" },
        { indizio: "πείσμα", parola: "γινάτι", origine: "τουρκικά", beleg: "https://el.wiktionary.org/wiki/γινάτι" },
      ],
    },
    {
      id: "gallika",
      titel: "Λέξεις από τα γαλλικά και τα αγγλικά",
      paare: [
        { indizio: "εκτενής δημοσιογραφική έρευνα", parola: "ρεπορτάζ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/ρεπορτάζ" },
        { indizio: "πλεονέκτημα", parola: "αβαντάζ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/αβαντάζ" },
        { indizio: "πίνακας με τα όργανα του αυτοκινήτου", parola: "ταμπλό", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/ταμπλό" },
        { indizio: "μικρό κόσμημα", parola: "μπιζού", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/μπιζού" },
        { indizio: "παλιομοδίτικος", parola: "ντεμοντέ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/ντεμοντέ" },
        { indizio: "η αίθουσα της εισόδου στο θέατρο", parola: "φουαγιέ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/φουαγιέ" },
        { indizio: "ο δεύτερος αγώνας για να πάρουμε πίσω την ήττα", parola: "ρεβάνς", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/ρεβάνς" },
        { indizio: "τρυφερό κομμάτι κρέατος ή ψαριού χωρίς κόκαλα", parola: "φιλέ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/φιλέ" },
        { indizio: "κύρος και φήμη", parola: "πρεστίζ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/πρεστίζ" },
        { indizio: "μεγάλη επιτυχία", parola: "σουξέ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/σουξέ" },
        { indizio: "η καλύτερη επίδοση όλων των εποχών", parola: "ρεκόρ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/ρεκόρ" },
        { indizio: "προώθηση και πώληση προϊόντων", parola: "μάρκετινγκ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/μάρκετινγκ" },
        { indizio: "ο διευθυντής μιας ομάδας ή επιχείρησης", parola: "μάνατζερ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/μάνατζερ" },
        { indizio: "μεγάλο κατάστημα τροφίμων", parola: "σουπερμάρκετ", origine: "αγγλικά", beleg: "https://el.wiktionary.org/wiki/σουπερμάρκετ" },
        { indizio: "ανοιχτό καφέ χρώμα", parola: "μπεζ", origine: "γαλλικά", beleg: "https://el.wiktionary.org/wiki/μπεζ" },
      ],
    },
  ],
};

/** Der Name der Tippchallenge-Dateien je Bedienungssprache, mit `{i}` und `{n}` („Bulgarian word origins, alphabetical: file {i} of {n}"). */
export const WURZEL_CHALLENGE_TITEL_EL: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> = {
  de: "Herkunft griechischer Wörter, alphabetisch: Datei {i} von {n}",
  en: "Greek word origins, alphabetical: file {i} of {n}",
};

/** Die Zeile eines Paares: zuerst der Hinweis, dann das Wort. */
export function wurzelZeileEl(x: { indizio: string; parola: string }): string {
  return `${x.indizio} - ${x.parola}`;
}

/** Dieselben Wörter, alphabetisch nach dem Hinweis (Sortierung „el-GR") - für die Tippchallenge, wie `KORENY_ABECEDNE`. */
export const WURZELN_EL_ALPHABETISCH: Record<WurzelStufeEl, string[]> = Object.fromEntries(
  (Object.keys(WURZELN_EL) as WurzelStufeEl[]).map((stufe) => [
    stufe,
    WURZELN_EL[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indizio.localeCompare(b.indizio, "el-GR"))
      .map(wurzelZeileEl),
  ]),
) as Record<WurzelStufeEl, string[]>;
