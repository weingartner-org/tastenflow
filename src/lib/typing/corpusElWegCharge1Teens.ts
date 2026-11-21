/**
 * Korpus des Weges „el" (Griechisch), Charge 1 - Jugendliche (K-EL, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
 *
 * Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/el.jsonl` (je Altersgruppe 30 Sätze und 10 Absätze, neu in der
 * Sprache verfasst, `quelle: "eigen"`), geprüft von einem zweiten Prüfer (`PRUEFBERICHT-el.md`: freigabefähig).
 * Der Text ist unverändert übernommen. Zuordnung: `alter` ⇒ `stufen`, `thema` ⇒ `topic`, `weg` ⇒ `nurWeg`; die Kennung
 * der Quelle steht als Kommentar hinter jeder Zeile.
 *  · Absätze (`art: "absatz"`) sind an den Satzgrenzen in ihre Sätze geteilt (`<id>.1`, `<id>.2` …): Korpus-Zeilen sind einzelne
 *    Übungszeilen (die längste der acht Wege davor hat 130 Zeichen), mehrsätzige Geschichten sind Serien. Kein Wort geändert.
 *  · Selbst verfasst ⇒ ohne `herkunft` (wie die Chargen von it/pl/tr/cs; `herkunft` ist für ÜBERNOMMENE Texte).
 *  · `minTier` = `minTierFor(text, "el")` nach der eigenen Lern-Folge des Weges (`lernweg.ts`, F4), Bezugstastatur `el`.
 * Wächter: `tests/tastenflow-texte-el-charge1.test.ts`. Nur HINTEN anhängen (Anker, `corpusEl.ts`).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_EL_WEG_CHARGE1_TEENS: CorpusItem[] = [
  { text: "Στο Τόκιο ο Αθανάσιος Γκαβέλας έτρεξε τα 100 μέτρα σε 10,82 δευτερόλεπτα, νέο παγκόσμιο ρεκόρ.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-041
  { text: "Η Καρολίνα Πελενδρίτου από τη Λεμεσό κέρδισε τρία παραολυμπιακά χρυσά στα 100 μέτρα πρόσθιο.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-042
  { text: "Στη Θεσσαλονίκη η Ιωάννα γράφει μουσική στο λάπτοπ και ανεβάζει τα κομμάτια της στο διαδίκτυο.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Musik" }, // el-c1-043
  { text: "Το πλοίο για τη Νάξο φεύγει στις 07:30, οπότε ξυπνάμε πριν βγει ο ήλιος.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "el", topic: "Reisen, Fähre" }, // el-c1-044
  { text: "Στη Λευκωσία φτιάξαμε με την ομάδα μας μια εφαρμογή που δείχνει πότε έρχεται το λεωφορείο.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Technik" }, // el-c1-045
  { text: "Στο Ηράκλειο μαζέψαμε πλαστικά από την ακτή και τα χωρίσαμε για ανακύκλωση.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Umwelt" }, // el-c1-046
  { text: "Η Ερμίρα μετακόμισε από τα Γιάννενα, αλλά κάνει βιντεοκλήση με τον Μάριο κάθε Κυριακή.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Freundschaft" }, // el-c1-047
  { text: "Στη Λάρνακα προπονούμαστε στο βόλεϊ παραλίας ακόμα και τον Νοέμβριο.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport" }, // el-c1-048
  { text: "Η Δανάη χρησιμοποιεί αναπηρικό αμαξίδιο και παίζει μπάσκετ με μια ομάδα της Πάτρας.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport" }, // el-c1-049
  { text: "Ο Λευτέρης από την Κέρκυρα θέλει να γίνει μηχανικός πλοίων και διαβάζει ό,τι βρει για μηχανές.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Berufswahl" }, // el-c1-050
  { text: "Στην Αθήνα η Ναταλία έφτιαξε ένα σύστημα με αισθητήρα που ποτίζει μόνο του τα φυτά στο μπαλκόνι.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Technik, Umwelt" }, // el-c1-051
  { text: "Η μπάντα του σχολείου μας στη Λεμεσό παίζει ροκ με μπουζούκι και ηλεκτρική κιθάρα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Musik" }, // el-c1-052
  { text: "Στην Καβάλα κάνουμε κωπηλασία νωρίς το πρωί, όταν η θάλασσα είναι ακόμα ήρεμη.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport" }, // el-c1-053
  { text: "Στο Πήλιο φυτέψαμε καστανιές σε μια πλαγιά που είχε καεί πέρσι.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Umwelt" }, // el-c1-054
  { text: "Στη Λήμνο όλα τα παιδιά του γυμνασίου μας χωράνε σε μία φωτογραφία, και αυτό μας αρέσει.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Inselleben, Schule" }, // el-c1-055
  { text: "Στην Πάφο η Στέλλα και ο Κυριάκος μοιράζονται τα ακουστικά στο λεωφορείο της επιστροφής.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Freundschaft, Musik" }, // el-c1-056
  { text: "Στην Τρίπολη μαθαίνουμε προγραμματισμό και φτιάχνουμε ένα μικρό παιχνίδι με διαστημόπλοια.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Technik, Schule" }, // el-c1-057
  { text: "Στη Λευκωσία η Χριστίνα, που έχει προβλήματα όρασης, ακούει τα μαθήματα στο κινητό της.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Schule, Technik" }, // el-c1-058
  { text: "Στο Ρέθυμνο ο Μανώλης μαθαίνει λύρα από τον παππού του και νέα τραγούδια από το ίντερνετ.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Musik" }, // el-c1-059
  { text: "Με το τρένο από την Αλεξανδρούπολη φτάσαμε στη Θεσσαλονίκη αργά το απόγευμα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Reisen" }, // el-c1-060
  { text: "Στα μονοπάτια του Τροόδους μετράμε τα πουλιά με μια εφαρμογή για το μάθημα της Βιολογίας.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Natur, Schule" }, // el-c1-061
  { text: "Στη Σάμο το σχολείο μας μαζεύει νερό της βροχής σε δεξαμενές για τον κήπο.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Umwelt" }, // el-c1-062
  { text: "Η Φωτεινή έχει κοχλιακό εμφύτευμα και τραγουδά πρώτη φωνή στη χορωδία της Λαμίας.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Musik" }, // el-c1-063
  { text: "Στο Παραλίμνι η ομάδα μας στο πόλο προπονείται στην πισίνα τρεις φορές την εβδομάδα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport" }, // el-c1-064
  { text: "Στο Ζαγόρι περπατήσαμε πάνω από πέτρινα γεφύρια και κοιμηθήκαμε σε έναν ξενώνα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Reisen, Natur" }, // el-c1-065
  { text: "Στη Λάρνακα φτιάξαμε ένα μικρό ρομπότ που καθαρίζει την άμμο από τα αποτσίγαρα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Technik, Umwelt" }, // el-c1-066
  { text: "Όταν η φίλη μου έχει άγχος πριν από τις εξετάσεις, της στέλνω ένα αστείο μήνυμα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Freundschaft" }, // el-c1-067
  { text: "Στην Κοζάνη η Αλεξάνδρα θέλει να σπουδάσει μηχανικός ενέργειας και να στήνει φωτοβολταϊκά πάρκα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Berufswahl, Umwelt" }, // el-c1-068
  { text: "Στην Ικαρία το καλοκαίρι βοηθάω στο καφενείο της θείας μου και μιλάω με τουρίστες.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Inselleben, Arbeit" }, // el-c1-069
  { text: "Στην Αγία Νάπα κάναμε συναυλία στην πλατεία και μαζέψαμε χρήματα για το καταφύγιο ζώων.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Musik, Tiere" }, // el-c1-070
  { text: "Ο Αθανάσιος Γκαβέλας είναι δρομέας με απώλεια όρασης.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-071.1
  { text: "Τρέχει δίπλα σε έναν συνοδό δρομέα και τους δύο τους ενώνει ένα κοντό κορδόνι στο χέρι.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-071.2
  { text: "Οι δύο δρομείς πρέπει να κινούνται σαν ένας.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-071.3
  { text: "Στους Παραολυμπιακούς Αγώνες του Τόκιο κέρδισε το χρυσό στα 100 μέτρα με παγκόσμιο ρεκόρ, και στο Παρίσι πήρε ξανά το χρυσό.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-071.4
  { text: "Η Καρολίνα Πελενδρίτου είναι κολυμβήτρια με προβλήματα όρασης από τη Λεμεσό.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-072.1
  { text: "Στους Παραολυμπιακούς Αγώνες κέρδισε τρεις φορές το χρυσό στα 100 μέτρα πρόσθιο: στην Αθήνα το 2004, στο Πεκίνο το 2008 και στο Τόκιο.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-072.2
  { text: "Το 2004 η Κύπρος έβγαλε και ένα γραμματόσημο με τη μορφή της.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-072.3
  { text: "Το καλοκαίρι πήγα πρώτη φορά μόνη μου με το πλοίο από τη Σύρο στην Τήνο.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "el", topic: "Reisen, Fähre" }, // el-c1-073.1
  { text: "Η μαμά μου με αποχαιρέτησε στο λιμάνι και η θεία μου με περίμενε στην άλλη άκρη.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Reisen, Fähre" }, // el-c1-073.2
  { text: "Στο κατάστρωμα έφαγα ένα τοστ, έγραψα μηνύματα και έψαχνα δελφίνια που δεν εμφανίστηκαν ποτέ.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Reisen, Fähre" }, // el-c1-073.3
  { text: "Την επόμενη φορά θα πάρω κιάλια.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Reisen, Fähre" }, // el-c1-073.4
  { text: "Στη Λευκωσία η τάξη μας αποφάσισε μια εβδομάδα χωρίς κινητά στο διάλειμμα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Technik, Freundschaft" }, // el-c1-074.1
  { text: "Την πρώτη μέρα κανείς δεν ήξερε τι να κάνει.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "el", topic: "Technik, Freundschaft" }, // el-c1-074.2
  { text: "Τη δεύτερη ο Σάββας έφερε τάβλι και η Μυρτώ μια μπάλα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Technik, Freundschaft" }, // el-c1-074.3
  { text: "Την Παρασκευή είχαμε τουρνουά, πολλά γέλια και καμία ειδοποίηση.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Technik, Freundschaft" }, // el-c1-074.4
  { text: "Τη Δευτέρα όμως όλοι ξαναβγάλαμε τα κινητά.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Technik, Freundschaft" }, // el-c1-074.5
  { text: "Με το σχολείο περπατήσαμε το φαράγγι της Σαμαριάς στην Κρήτη.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Natur, Reisen" }, // el-c1-075.1
  { text: "Ξεκινήσαμε πολύ νωρίς, με νερό, καπέλα και σάντουιτς στις τσάντες.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "el", topic: "Natur, Reisen" }, // el-c1-075.2
  { text: "Το μονοπάτι κατέβαινε ανάμεσα σε πεύκα και βράχους, και στο πιο στενό σημείο τα τοιχώματα έμοιαζαν να ακουμπούν.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Natur, Reisen" }, // el-c1-075.3
  { text: "Στο τέλος βουτήξαμε στη θάλασσα, κουρασμένοι αλλά χαρούμενοι.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Natur, Reisen" }, // el-c1-075.4
  { text: "Ο Πέτρος έχει εγκεφαλική παράλυση και παίζει μπότσια σε έναν σύλλογο του Βόλου.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-076.1
  { text: "Στο άθλημα αυτό ρίχνεις μπάλες όσο πιο κοντά γίνεται σε μια μικρή λευκή μπάλα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-076.2
  { text: "Χρειάζεται ακρίβεια, υπομονή και καλό μυαλό για τακτική.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-076.3
  { text: "Το Σάββατο ο Πέτρος έμαθε το παιχνίδι σε όλη την τάξη και μετά μας κέρδισε όλους με άνεση.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Sport, Paralympics" }, // el-c1-076.4
  { text: "Στη Λάρνακα η ομάδα περιβάλλοντος του σχολείου μας μετρά κάθε μήνα τα σκουπίδια σε ένα κομμάτι της ακτής.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Umwelt" }, // el-c1-077.1
  { text: "Γράφουμε τι βρίσκουμε σε ένα υπολογιστικό φύλλο: καπάκια, καλαμάκια, δίχτυα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Umwelt" }, // el-c1-077.2
  { text: "Τον Μάιο βρήκαμε τα μισά σε σχέση με τον Μάρτιο.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Umwelt" }, // el-c1-077.3
  { text: "Δεν ξέρουμε αν φταίει ο αέρας ή οι πινακίδες που βάλαμε, αλλά συνεχίζουμε.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Umwelt" }, // el-c1-077.4
  { text: "Στη Θεσσαλονίκη, κάθε Πέμπτη μετά το σχολείο, η Δάφνη και ο Ορέστης κάνουν πρόβες σε ένα υπόγειο.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Musik, Freundschaft" }, // el-c1-078.1
  { text: "Εκείνη παίζει ντραμς, εκείνος γράφει στίχους στο κινητό.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Musik, Freundschaft" }, // el-c1-078.2
  { text: "Το πρώτο τους τραγούδι μιλά για το λεωφορείο που αργεί πάντα.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "el", topic: "Musik, Freundschaft" }, // el-c1-078.3
  { text: "Το έπαιξαν στη γιορτή του σχολείου και ο διευθυντής χειροκρότησε πρώτος.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Musik, Freundschaft" }, // el-c1-078.4
  { text: "Η Ευαγγελία ήρθε στην Πάφο από την Αθήνα στη μέση της χρονιάς.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Freundschaft" }, // el-c1-079.1
  { text: "Τις πρώτες μέρες καθόταν μόνη στο διάλειμμα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Freundschaft" }, // el-c1-079.2
  { text: "Ο Αντρέας τη ρώτησε αν ξέρει σκάκι.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "el", topic: "Freundschaft" }, // el-c1-079.3
  { text: "Δεν ήξερε, αλλά έμαθε γρήγορα.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Freundschaft" }, // el-c1-079.4
  { text: "Τώρα κάνουν παρέα κάθε μέρα και εκείνη τον κερδίζει πιο συχνά απ' ό,τι θα ήθελε ο ίδιος.", kind: "satz", stufen: ["teens"], minTier: 4, nurWeg: "el", topic: "Freundschaft" }, // el-c1-079.5
  { text: "Η Ειρήνη από τη Μεσσηνία δεν ξέρει ακόμα τι θέλει να σπουδάσει.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Berufswahl" }, // el-c1-080.1
  { text: "Της αρέσουν η Χημεία και η μαγειρική.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Berufswahl" }, // el-c1-080.2
  { text: "Τον Δεκέμβριο βοήθησε στο ελαιοτριβείο του θείου της και είδε πώς βγαίνει το λάδι από τον καρπό.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Berufswahl" }, // el-c1-080.3
  { text: "Τώρα σκέφτεται να γίνει χημικός τροφίμων.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Berufswahl" }, // el-c1-080.4
  { text: "Ο παππούς της λέει ότι πρώτα πρέπει να μάθει να μαζεύει ελιές.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "el", topic: "Berufswahl" }, // el-c1-080.5
];
