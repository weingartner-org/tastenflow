/**
 * Korpus des Weges „el" (Griechisch), Charge 1 - Erwachsene (K-EL, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_EL_WEG_CHARGE1_ERWACHSENE: CorpusItem[] = [
  { text: "Στη Λευκωσία έκλεισα ραντεβού στο κέντρο εξυπηρέτησης του πολίτη από την ιστοσελίδα.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Behörden" }, // el-c1-081
  { text: "Η Μαρία είναι νοσηλεύτρια στο Ηράκλειο και τελειώνει τη βάρδια της στις 23:00.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "el", topic: "Arbeit, Gesundheit" }, // el-c1-082
  { text: "Βρήκαμε διαμέρισμα στην Πάτρα με δύο υπνοδωμάτια και ενοίκιο 450 € τον μήνα.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "el", topic: "Wohnen" }, // el-c1-083
  { text: "Στη Λεμεσό ο Αντώνης δουλεύει από το σπίτι για μια εταιρεία λογισμικού.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "el", topic: "Arbeit" }, // el-c1-084
  { text: "Στη Λάρισα έχω ραντεβού με την οικογενειακή γιατρό στις 08:30.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "el", topic: "Gesundheit" }, // el-c1-085
  { text: "Στην Κεφαλονιά ο Γιάννης νοικιάζει καγιάκ και εξηγεί στους επισκέπτες πού φυσάει λιγότερο.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Tourismus, Arbeit" }, // el-c1-086
  { text: "Σε ένα χωριό της Πάφου η Ελένη φτιάχνει χαλλούμι κάθε πρωί στο τυροκομείο της.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Landwirtschaft" }, // el-c1-087
  { text: "Στη Θεσσαλονίκη ο Κώστας, που έχει απώλεια όρασης, ελέγχει ιστοσελίδες με αναγνώστη οθόνης.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Technik" }, // el-c1-088
  { text: "Το Σάββατο είδαμε ταινία σε θερινό σινεμά στην Αθήνα και φέραμε μαξιλάρια από το σπίτι.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur" }, // el-c1-089
  { text: "Στην Κομοτηνή ψωνίζω στη λαϊκή φρέσκα χόρτα, φασόλια και ζεστό ψωμί.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Alltag, Essen" }, // el-c1-090
  { text: "Στη Λευκωσία πίνουμε τον καφέ στη σκιά, γιατί τον Ιούλιο η ζέστη δεν αστειεύεται.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Alltag, Wetter" }, // el-c1-091
  { text: "Στο Ναύπλιο ανακαινίσαμε ένα παλιό σπίτι και κρατήσαμε τα ξύλινα παράθυρα.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Wohnen" }, // el-c1-092
  { text: "Στα Χανιά μαζεύουμε ελιές τα Σαββατοκύριακα και βοηθά όλη η οικογένεια.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Landwirtschaft, Familie" }, // el-c1-093
  { text: "Στη Λάρνακα η Άντρη, που χρησιμοποιεί αναπηρικό αμαξίδιο, διευθύνει ένα γραφείο ταξιδιών.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Tourismus" }, // el-c1-094
  { text: "Στο Μέτσοβο ο ξενώνας μας γεμίζει τον χειμώνα, αλλά εμείς προτιμάμε τον Οκτώβριο.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Tourismus" }, // el-c1-095
  { text: "Στη Ρόδο η Σοφία κυβερνά ένα σκάφος που κάνει κάθε μέρα το δρομολόγιο για τη Σύμη.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit" }, // el-c1-096
  { text: "Μετά από δύο ώρες στον υπολογιστή, σηκώνομαι και περπατάω δέκα λεπτά.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "el", topic: "Gesundheit, Arbeit" }, // el-c1-097
  { text: "Στα Τρίκαλα έκανα μια υπεύθυνη δήλωση από το κινητό, χωρίς να περιμένω σε ουρά.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Behörden" }, // el-c1-098
  { text: "Στον Πεδουλά μαζεύουμε κεράσια τον Ιούνιο και τα πουλάμε σε μια αγορά της Λευκωσίας.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Landwirtschaft" }, // el-c1-099
  { text: "Ο σταθμός του μετρό ήταν κλειστός, οπότε περπάτησα από το Σύνταγμα ως το γραφείο.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Alltag" }, // el-c1-100
  { text: "Στη Χίο στήσαμε μια έκθεση με εκθέματα που μπορούν να αγγίξουν και άτομα με προβλήματα όρασης.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur" }, // el-c1-101
  { text: "Στη Λεμεσό η χορωδία της γειτονιάς κάνει πρόβες στην αυλή ενός παλιού σχολείου.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Musik" }, // el-c1-102
  { text: "Στην παλιά πόλη της Ξάνθης μένουμε σε ένα σπίτι με ξύλινο μπαλκόνι και πέτρινη αυλή.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Wohnen, Kultur" }, // el-c1-103
  { text: "Στη Λαμία ο Θανάσης άνοιξε συνεργείο ποδηλάτων και επισκευάζει και ηλεκτρικά πατίνια.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit" }, // el-c1-104
  { text: "Στη Λάρνακα πλήρωσα από το κινητό τον λογαριασμό του νερού: 38,60 € για δύο μήνες.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "el", topic: "Alltag, Behörden" }, // el-c1-105
  { text: "Στη Σαντορίνη η Νεφέλη δουλεύει σε ξενοδοχείο το καλοκαίρι και τον χειμώνα σπουδάζει από απόσταση.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Tourismus" }, // el-c1-106
  { text: "Στην Αγία Νάπα τον χειμώνα οι δρόμοι ησυχάζουν και οι κάτοικοι ξαναβρίσκουν τις παραλίες τους.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Alltag" }, // el-c1-107
  { text: "Στην Τρίπολη η Βασιλική, που είναι κωφή, διδάσκει νοηματική γλώσσα σε ενήλικες.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Kultur" }, // el-c1-108
  { text: "Στην Κέρκυρα κάθε Κυριακή ακούω από το μπαλκόνι μου τις πρόβες της φιλαρμονικής.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Musik" }, // el-c1-109
  { text: "Στα Λεύκαρα η Μαρούλα κεντά τραπεζομάντιλα και διδάσκει την τέχνη σε νέους του χωριού.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Arbeit" }, // el-c1-110
  { text: "Η Χρυσταλλένη ξεκίνησε νέα δουλειά σε λογιστικό γραφείο στη Λευκωσία.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Behörden" }, // el-c1-111.1
  { text: "Την πρώτη εβδομάδα έπρεπε να ανοίξει λογαριασμό για τον μισθό, να γραφτεί στις κοινωνικές ασφαλίσεις και να βρει θέση για το αυτοκίνητο.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Behörden" }, // el-c1-111.2
  { text: "Το τελευταίο ήταν το δυσκολότερο.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "el", topic: "Arbeit, Behörden" }, // el-c1-111.3
  { text: "Τελικά αγόρασε ποδήλατο και φτάνει στο γραφείο σε δώδεκα λεπτά.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "el", topic: "Arbeit, Behörden" }, // el-c1-111.4
  { text: "Ο Παύλος από την Άρτα έκανε εξετάσεις αίματος, γιατί ένιωθε συνέχεια κουρασμένος.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Gesundheit" }, // el-c1-112.1
  { text: "Η γιατρός είδε ότι είχε χαμηλό σίδηρο και του πρότεινε φακές, σπανάκι και περισσότερο ύπνο.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Gesundheit" }, // el-c1-112.2
  { text: "Ο Παύλος μαγείρευε φακές τρεις φορές την εβδομάδα.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Gesundheit" }, // el-c1-112.3
  { text: "Μετά από δύο μήνες τα αποτελέσματα ήταν καλύτερα, αλλά οι φακές δεν του αρέσουν πια.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "el", topic: "Gesundheit" }, // el-c1-112.4
  { text: "Στη Λεμεσό η Άννα και η Ραλλού νοίκιασαν μαζί ένα διαμέρισμα με μεγάλη βεράντα.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Wohnen, Alltag" }, // el-c1-113.1
  { text: "Μοιράζονται τα ψώνια, τους λογαριασμούς και ένα κουτί με εργαλεία.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Wohnen, Alltag" }, // el-c1-113.2
  { text: "Την Κυριακή μαγειρεύει η μία και πλένει τα πιάτα η άλλη.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "el", topic: "Wohnen, Alltag" }, // el-c1-113.3
  { text: "Την Πέμπτη παραγγέλνουν σουβλάκια, γιατί και οι δύο δουλεύουν ως αργά.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Wohnen, Alltag" }, // el-c1-113.4
  { text: "Η Ζωή έχει απώλεια όρασης και δουλεύει ως ψυχολόγος σε ένα κέντρο στο Ηράκλειο.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Alltag" }, // el-c1-114.1
  { text: "Το πρωί πηγαίνει στη δουλειά με το λεωφορείο, μαζί με τον σκύλο οδηγό, τη Ρία.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Alltag" }, // el-c1-114.2
  { text: "Στο γραφείο χρησιμοποιεί αναγνώστη οθόνης και γράφει γρήγορα χωρίς να κοιτάζει τα πλήκτρα.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Alltag" }, // el-c1-114.3
  { text: "Στο διάλειμμα η Ρία ξαπλώνει κάτω από το γραφείο και περιμένει υπομονετικά.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "el", topic: "Arbeit, Alltag" }, // el-c1-114.4
  { text: "Το Σαββατοκύριακο κάναμε βόλτα στον Όμοδο, ένα χωριό στις πλαγιές του Τροόδους.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Ausflug" }, // el-c1-115.1
  { text: "Περπατήσαμε στα πέτρινα σοκάκια, αγοράσαμε σουτζούκο και καθίσαμε στην πλατεία.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Ausflug" }, // el-c1-115.2
  { text: "Στο διπλανό τραπέζι ένας κύριος έλυνε σταυρόλεξο και ρωτούσε όλους για τη λέξη που του έλειπε.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Ausflug" }, // el-c1-115.3
  { text: "Στο τέλος τη βρήκε η κόρη μου.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Ausflug" }, // el-c1-115.4
  { text: "Ο Στέφανος είναι ξεναγός στην Καλαμπάκα.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "el", topic: "Arbeit, Tourismus" }, // el-c1-116.1
  { text: "Κάθε πρωί ανεβαίνει με μια ομάδα στα Μετέωρα και μιλά για τα μοναστήρια πάνω στους βράχους.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Tourismus" }, // el-c1-116.2
  { text: "Οι ερωτήσεις αλλάζουν από χώρα σε χώρα, αλλά μία την ακούει πάντα: πώς ανέβαιναν τα τρόφιμα εκεί πάνω;", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Tourismus" }, // el-c1-116.3
  { text: "Ο Στέφανος χαμογελά και δείχνει ένα παλιό καλάθι με σκοινί.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Arbeit, Tourismus" }, // el-c1-116.4
  { text: "Στη Χαλκίδα η Ευτυχία πηγαίνει στη δουλειά με τα πόδια και περνά τη γέφυρα του Ευρίπου.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Alltag" }, // el-c1-117.1
  { text: "Συχνά σταματά για να κοιτάξει τα νερά που αλλάζουν κατεύθυνση.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Alltag" }, // el-c1-117.2
  { text: "Οι ψαράδες στην προβλήτα την ξέρουν πια και της λένε τα νέα της ημέρας.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Alltag" }, // el-c1-117.3
  { text: "Έτσι φτάνει στο γραφείο ενημερωμένη πριν ανοίξει τον υπολογιστή.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "el", topic: "Alltag" }, // el-c1-117.4
  { text: "Την Πρωτοχρονιά η οικογένειά μας μαζεύεται στο σπίτι της αδερφής μου, της Κατερίνας, στην Κοζάνη.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Fest (Πρωτοχρονιά), Familie" }, // el-c1-118.1
  { text: "Πριν από το φαγητό κόβουμε τη βασιλόπιτα: ένα κομμάτι για το σπίτι και ένα για κάθε άνθρωπο στο τραπέζι.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Fest (Πρωτοχρονιά), Familie" }, // el-c1-118.2
  { text: "Φέτος το φλουρί το βρήκε ο εννιάχρονος ανιψιός μας, που το σήκωσε ψηλά σαν μετάλλιο.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Fest (Πρωτοχρονιά), Familie" }, // el-c1-118.3
  { text: "Η Γεωργία καλλιεργεί πατάτες σε χωράφια κοντά στο Παραλίμνι.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Landwirtschaft, Umwelt" }, // el-c1-119.1
  { text: "Ξυπνά πριν από τις πέντε, για να ποτίσει πριν ζεστάνει ο ήλιος.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Landwirtschaft, Umwelt" }, // el-c1-119.2
  { text: "Παρακολουθεί την υγρασία του χώματος από μια εφαρμογή στο κινητό και ανοίγει τις βάνες μόνο όσο χρειάζεται.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Landwirtschaft, Umwelt" }, // el-c1-119.3
  { text: "Λέει ότι στην Κύπρο το νερό είναι πιο πολύτιμο από κάθε μηχάνημα.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Landwirtschaft, Umwelt" }, // el-c1-119.4
  { text: "Ο Ανέστης είναι μουσικός και χρησιμοποιεί αναπηρικό αμαξίδιο.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Musik" }, // el-c1-120.1
  { text: "Στη Θεσσαλονίκη παίζει πιάνο σε μικρές σκηνές κοντά στο λιμάνι.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Musik" }, // el-c1-120.2
  { text: "Πριν από κάθε συναυλία ρωτά αν ο χώρος έχει ράμπα.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Musik" }, // el-c1-120.3
  { text: "Όταν δεν έχει, το λέει ευγενικά αλλά καθαρά.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Musik" }, // el-c1-120.4
  { text: "Πέρσι τρεις χώροι έβαλαν ράμπα μετά από δική του πρόταση, και τώρα τη χρησιμοποιούν όλοι.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "el", topic: "Kultur, Musik" }, // el-c1-120.5
];
