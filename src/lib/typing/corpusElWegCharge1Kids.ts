/**
 * Korpus des Weges „el" (Griechisch), Charge 1 - Kinder (K-EL, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_EL_WEG_CHARGE1_KIDS: CorpusItem[] = [
  { text: "Στη Λεμεσό η Δέσποινα φτάνει πρώτη στο σχολείο και ανοίγει τα παράθυρα της τάξης.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule" }, // el-c1-001
  { text: "Στα Χανιά ο Στέλιος δίνει νερό και φαγητό στις γάτες της γειτονιάς.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Tiere" }, // el-c1-002
  { text: "Στα Γιάννενα η γιαγιά κι εγώ ανοίγουμε φύλλο για πίτα με χόρτα.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Familie, Essen" }, // el-c1-003
  { text: "Στην παραλία της Λάρνακας χτίζουμε ένα κάστρο από άμμο με τρεις πύργους.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Spiel, Strand" }, // el-c1-004
  { text: "Σήμερα βρέχει, γι' αυτό παίζουμε επιτραπέζια στον διάδρομο του σχολείου.", kind: "satz", stufen: ["kids"], minTier: 4, nurWeg: "el", topic: "Wetter, Spiel" }, // el-c1-005
  { text: "Στην Κέρκυρα κάναμε βόλτα με βάρκα και μετρήσαμε έξι γλάρους στο κατάρτι.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Tiere, Meer" }, // el-c1-006
  { text: "Το πρωί στην Πάφο τρώω ψωμί με χαλλούμι και ντομάτα πριν φύγω για το σχολείο.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Essen" }, // el-c1-007
  { text: "Στη Θεσσαλονίκη αγοράζω μόνος μου κουλούρι από τον φούρνο της γωνίας.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Essen" }, // el-c1-008
  { text: "Η τάξη μας στη Λάρισα φύτεψε τρεις λεμονιές στην αυλή του σχολείου.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule, Natur" }, // el-c1-009
  { text: "Ο θείος μου στη Νάξο έχει δύο κατσίκες και ένα γαϊδουράκι που το λένε Μέλι.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Tiere, Familie" }, // el-c1-010
  { text: "Στην Αθήνα η Ελένη διαβάζει με τα δάχτυλα σε γραφή Μπράιγ και τελειώνει πρώτη το βιβλίο.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule, Lesen" }, // el-c1-011
  { text: "Στη Λευκωσία παίζουμε κρυφτό στο πάρκο μέχρι να ανάψουν τα φώτα του δρόμου.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Spiel" }, // el-c1-012
  { text: "Τον χειμώνα πάμε στο Τρόοδος και φτιάχνουμε χιονάνθρωπο με κόκκινο κασκόλ.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Wetter, Natur" }, // el-c1-013
  { text: "Η μαμά μου δουλεύει στο λιμάνι της Ρόδου και ξέρει τα ονόματα όλων των πλοίων.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "el", topic: "Familie, Arbeit" }, // el-c1-014
  { text: "Στην Καλαμάτα ο παππούς μου μαζεύει ελιές και εγώ γεμίζω το καλάθι.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Familie, Natur" }, // el-c1-015
  { text: "Στη Λεμεσό ο Χαράλαμπος, που κινείται με αναπηρικό αμαξίδιο, είναι ο τερματοφύλακας της ομάδας μας.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Sport" }, // el-c1-016
  { text: "Στον Βόλο μαθαίνουμε στο σχολείο να φτιάχνουμε μικρά ρομπότ από χαρτόνι.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule, Technik" }, // el-c1-017
  { text: "Ο σκύλος μας κοιμάται κάτω από το τραπέζι και ροχαλίζει σαν τρακτέρ.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Tiere" }, // el-c1-018
  { text: "Στο Ηράκλειο κάνουμε αγώνα με ποδήλατα γύρω από την πλατεία της γειτονιάς.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "el", topic: "Spiel" }, // el-c1-019
  { text: "Στο Παραλίμνι έμαθα να κολυμπάω χωρίς μπρατσάκια και η αδελφή μου χειροκρότησε.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Strand, Familie" }, // el-c1-020
  { text: "Στην Κομοτηνή ο μπαμπάς μαγειρεύει φασολάδα και εγώ στρώνω το τραπέζι.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Familie, Essen" }, // el-c1-021
  { text: "Στην Πάτρα ο Νίκος, που έχει απώλεια ακοής, μας μαθαίνει νοηματική γλώσσα στο διάλειμμα.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule, Freundschaft" }, // el-c1-022
  { text: "Στον Κατακλυσμό στη Λάρνακα ρίχνουμε νερό ο ένας στον άλλον στην παραλία.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Fest (Κατακλυσμός)" }, // el-c1-023
  { text: "Στην Κεφαλονιά η αδελφή μου μέτρησε δεκαπέντε πεταλούδες πάνω σε μια λεβάντα.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Tiere, Natur" }, // el-c1-024
  { text: "Στη Λευκωσία, στο μάθημα πληροφορικής, φτιάξαμε στον υπολογιστή μια γάτα που χορεύει.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule, Technik" }, // el-c1-025
  { text: "Στα Τρίκαλα παίζουμε μπάσκετ στην αυλή μέχρι να χτυπήσει το κουδούνι.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Spiel, Sport" }, // el-c1-026
  { text: "Ο ουρανός είναι γκρίζος, οπότε παίρνω ομπρέλα και πάω με τα πόδια στο σχολείο.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Wetter, Schule" }, // el-c1-027
  { text: "Στην Πάφο βρήκαμε έναν σκαντζόχοιρο στον κήπο και του αφήσαμε ένα πιατάκι νερό.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Tiere" }, // el-c1-028
  { text: "Στη Χίο η ξαδέρφη μου κι εγώ μαζεύουμε κοχύλια και τα βάφουμε με χρώματα.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Familie, Strand" }, // el-c1-029
  { text: "Η Μαρίνα έχει απώλεια όρασης και κολυμπά στην Αγία Νάπα, ενώ ο σκύλος οδηγός περιμένει.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Strand, Tiere" }, // el-c1-030
  { text: "Στη Λεμεσό η Δευτέρα ξεκινά με μάθημα Γλώσσας.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule" }, // el-c1-031.1
  { text: "Η δασκάλα γράφει στον πίνακα μια ερώτηση: \"Τι θα έκανες με μια ολόκληρη μέρα μόνο για σένα;\"", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule" }, // el-c1-031.2
  { text: "Η Άννα θέλει να ζωγραφίσει, ο Ραφαήλ να πάει για ψάρεμα.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule" }, // el-c1-031.3
  { text: "Εγώ γράφω ότι θα έφτιαχνα ένα μικρό πάρκο για τα σκυλιά.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule" }, // el-c1-031.4
  { text: "Το Σάββατο στο Ρέθυμνο φτιάχνω ντάκο με τη θεία μου.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Essen" }, // el-c1-032.1
  { text: "Βρέχω λίγο το παξιμάδι, τρίβω ντομάτα από πάνω και ρίχνω μυζήθρα και ρίγανη.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Essen" }, // el-c1-032.2
  { text: "Στο τέλος βάζω άφθονο λάδι.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Essen" }, // el-c1-032.3
  { text: "Η θεία λέει ότι ο ντάκος μου είναι ο πιο ωραίος της Κρήτης, αλλά το λέει κάθε φορά.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Essen" }, // el-c1-032.4
  { text: "Η Χιονίστρα στο Τρόοδος έχει ύψος 1.952 μέτρα και είναι η ψηλότερη κορυφή της Κύπρου.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "el", topic: "Natur, Ausflug" }, // el-c1-033.1
  { text: "Τον Ιανουάριο η τάξη μας πήγε με λεωφορείο στις χιονισμένες πλαγιές.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Natur, Ausflug" }, // el-c1-033.2
  { text: "Φορέσαμε γάντια και σκούφους, κάναμε χιονοπόλεμο και ήπιαμε ζεστό τσάι από θερμός.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Natur, Ausflug" }, // el-c1-033.3
  { text: "Ο Άρης έχει απώλεια όρασης και στο σχολείο χρησιμοποιεί υπολογιστή που του διαβάζει δυνατά τα κείμενα.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule, Tippen" }, // el-c1-034.1
  { text: "Σήμερα στο Ναύπλιο κάναμε διαγωνισμό γρήγορης πληκτρολόγησης.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "el", topic: "Schule, Tippen" }, // el-c1-034.2
  { text: "Ο Άρης έγραφε χωρίς να κοιτάζει τα πλήκτρα και κέρδισε με διαφορά.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule, Tippen" }, // el-c1-034.3
  { text: "Την επόμενη φορά θα μου δείξει το κόλπο του.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Schule, Tippen" }, // el-c1-034.4
  { text: "Στη Σύρο έχουμε μια γάτα, τη Λουλού.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Tiere" }, // el-c1-035.1
  { text: "Κάθε πρωί κάθεται στο παράθυρο και κοιτάζει τα πλοία στο λιμάνι.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Tiere" }, // el-c1-035.2
  { text: "Όταν ακούει τη σφυρίχτρα, τρέχει στην πόρτα, γιατί νομίζει ότι έρχονται επισκέπτες.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Tiere" }, // el-c1-035.3
  { text: "Εγώ της εξηγώ ότι είναι απλώς το πλοίο της Τρίτης.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "el", topic: "Tiere" }, // el-c1-035.4
  { text: "Στο διάλειμμα στη Λευκωσία παίζουμε κουτσό.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Spiel, Pause" }, // el-c1-036.1
  { text: "Με κιμωλία ζωγραφίζουμε τετράγωνα στο τσιμέντο και γράφουμε μέσα αριθμούς.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Spiel, Pause" }, // el-c1-036.2
  { text: "Πετάμε ένα πετραδάκι και περνάμε με το ένα πόδι από κουτί σε κουτί.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "el", topic: "Spiel, Pause" }, // el-c1-036.3
  { text: "Η Σοφία δεν χάνει ποτέ την ισορροπία της, γι' αυτό σήμερα της ζητήσαμε να μας δείξει πώς το κάνει.", kind: "satz", stufen: ["kids"], minTier: 4, nurWeg: "el", topic: "Spiel, Pause" }, // el-c1-036.4
  { text: "Το πρωί στην Καστοριά η λίμνη ήταν σκεπασμένη με ομίχλη.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Wetter, Natur" }, // el-c1-037.1
  { text: "Από το παράθυρο του λεωφορείου έβλεπα μόνο τις κορυφές των δέντρων.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Wetter, Natur" }, // el-c1-037.2
  { text: "Στο σχολείο ζωγραφίσαμε την ομίχλη με άσπρο και γκρι χρώμα.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Wetter, Natur" }, // el-c1-037.3
  { text: "Το μεσημέρι βγήκε ο ήλιος και οι πάπιες άρχισαν να κολυμπούν κοντά στην όχθη.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Wetter, Natur" }, // el-c1-037.4
  { text: "Στην Κω ζούμε έξι άτομα σε ένα σπίτι: οι γονείς μου, η γιαγιά, τα δύο αδέρφια μου κι εγώ.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Familie" }, // el-c1-038.1
  { text: "Το βράδυ ο καθένας λέει κάτι ωραίο από τη μέρα του.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Familie" }, // el-c1-038.2
  { text: "Ο μικρός μου αδερφός λέει πάντα το ίδιο, ότι έφαγε παγωτό.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "el", topic: "Familie" }, // el-c1-038.3
  { text: "Ακόμα κι όταν δεν έφαγε.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "el", topic: "Familie" }, // el-c1-038.4
  { text: "Στη Ζάκυνθο κατεβήκαμε στην παραλία νωρίς το πρωί.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Strand, Natur" }, // el-c1-039.1
  { text: "Είδαμε ένα κομμάτι της άμμου με ξύλινα σημάδια και ρωτήσαμε τη ναυαγοσώστρια τι σημαίνουν.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "el", topic: "Strand, Natur" }, // el-c1-039.2
  { text: "Μας είπε να περπατάμε προσεκτικά, γιατί εκεί μπορεί να κρύβονται αυγά.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Strand, Natur" }, // el-c1-039.3
  { text: "Από τότε κοιτάζω πάντα πού πατάω.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Strand, Natur" }, // el-c1-039.4
  { text: "Λίγες μέρες πριν από το Πάσχα, στο χωριό της γιαγιάς κοντά στην Πάφο, φτιάχνουμε φλαούνες.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Fest (Πάσχα), Essen" }, // el-c1-040.1
  { text: "Εγώ ανακατεύω το τυρί με τα αυγά και τη μέντα, ο ξάδερφος κόβει τη ζύμη σε κύκλους.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Fest (Πάσχα), Essen" }, // el-c1-040.2
  { text: "Ρίχνουμε από πάνω σουσάμι και τις βάζουμε στον φούρνο.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Fest (Πάσχα), Essen" }, // el-c1-040.3
  { text: "Όλο το σπίτι μυρίζει γιορτή.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "el", topic: "Fest (Πάσχα), Essen" }, // el-c1-040.4
];
