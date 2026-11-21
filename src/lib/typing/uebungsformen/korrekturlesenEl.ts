/**
 * ★ D-LERNDATEN (25.10.2026): DIE KORREKTURLESE-FÄLLE des Weges „el" (Griechisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/el/tf-fest-el.json`, Schlüssel `unsinnSaetze` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja, unter der Bedingung, dass die Punkte 1 und 2 aus Abschnitt 4 kurz entschieden werden.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `korrekturlesenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Griechisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * In jedem Satz steht ein falsches, echtes Wort (`falsch`), das im Satz offensichtlich nicht stimmt; `richtig` ist das gemeinte.
 * Ob der Unterschied für eine Sprachausgabe HÖRBAR ist (Johannes 02.09.2026), prüft erst ein Lautschlüssel je Sprache (F8, offen).
 *
 * Verteiler: `korrekturlesen.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?griechisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-el.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_EL: readonly Korrekturfall[] = [
  { satz: "Τρώω τη σούπα μου με το κουτάβι.", falsch: "κουτάβι", richtig: "κουτάλι" },
  { satz: "Αλείφω το ψωμί με βούρτσα και μέλι.", falsch: "βούρτσα", richtig: "βούτυρο" },
  { satz: "Μένουμε σε ένα μεγάλο σπίρτο κοντά στη θάλασσα.", falsch: "σπίρτο", richtig: "σπίτι" },
  { satz: "Ο ψαράς βγήκε στη θάλασσα με τη μάρκα του.", falsch: "μάρκα", richtig: "βάρκα" },
  { satz: "Τη νύχτα στον ουρανό λάμπει το φανάρι.", falsch: "φανάρι", richtig: "φεγγάρι" },
  { satz: "Τη νύχτα ξαπλώνουμε στην αυλή και μετράμε τα αστεία.", falsch: "αστεία", richtig: "αστέρια" },
  { satz: "Κάθε πρωί πηγαίνω με τα πόδια στο σχοινί.", falsch: "σχοινί", richtig: "σχολείο" },
  { satz: "Πριν βγω έξω, φοράω τα παπάκια μου.", falsch: "παπάκια", richtig: "παπούτσια" },
  { satz: "Για πρωινό στύβω ένα ζουμερό πορτοφόλι.", falsch: "πορτοφόλι", richtig: "πορτοκάλι" },
  { satz: "Η σαλάτα έχει ντουλάπα, αγγούρι και φέτα.", falsch: "ντουλάπα", richtig: "ντομάτα" },
  { satz: "Το πρωί πίνω ένα ποτήρι γάτα.", falsch: "γάτα", richtig: "γάλα" },
  { satz: "Η γιαγιά ποτίζει τα λουκούμια στον κήπο.", falsch: "λουκούμια", richtig: "λουλούδια" },
  { satz: "Στο κλαδί κελαηδάει ένα μικρό πουλόβερ.", falsch: "πουλόβερ", richtig: "πουλί" },
  { satz: "Πριν κοιμηθώ, διαβάζω ένα βιολί.", falsch: "βιολί", richtig: "βιβλίο" },
  { satz: "Στο διάλειμμα παίζουμε ποδόσφαιρο με μια μπανάνα.", falsch: "μπανάνα", richtig: "μπάλα" },
  { satz: "Βρέχει, γι' αυτό ανοίγω την ομελέτα μου.", falsch: "ομελέτα", richtig: "ομπρέλα" },
  { satz: "Είμαι κουρασμένος και πέφτω στο κρεμμύδι.", falsch: "κρεμμύδι", richtig: "κρεβάτι" },
  { satz: "Στο ενυδρείο κολυμπάει ένα χρυσό ψαλίδι.", falsch: "ψαλίδι", richtig: "ψάρι" },
  { satz: "Η γιαγιά μαγειρεύει φασολάδα στην κουρτίνα.", falsch: "κουρτίνα", richtig: "κουζίνα" },
  { satz: "Το μεσημέρι τρώμε ζεστή φασαρία.", falsch: "φασαρία", richtig: "φασολάδα" },
  { satz: "Τον χειμώνα στο Τρόοδος πέφτει πολύ χιούμορ.", falsch: "χιούμορ", richtig: "χιόνι" },
  { satz: "Ο σκίουρος ανέβηκε στο ψηλό δόντι.", falsch: "δόντι", richtig: "δέντρο" },
  { satz: "Για πρωινό έφαγα μια ζεστή πέτρα με τυρί.", falsch: "πέτρα", richtig: "πίτα" },
  { satz: "Την Καθαρά Δευτέρα πετάμε χαρτομάντιλα στον ουρανό.", falsch: "χαρτομάντιλα", richtig: "χαρταετούς" },
  { satz: "Μέσα στη βασιλόπιτα κρύβουμε ένα φλιτζάνι.", falsch: "φλιτζάνι", richtig: "φλουρί" },
  { satz: "Την παραμονή των Χριστουγέννων τα παιδιά λένε κάλτσες στις γειτονιές.", falsch: "κάλτσες", richtig: "κάλαντα" },
  { satz: "Το καλοκαίρι τρώμε ένα δροσερό παγώνι.", falsch: "παγώνι", richtig: "παγωτό" },
  { satz: "Στο τσάι βάζω μια φέτα λιμάνι.", falsch: "λιμάνι", richtig: "λεμόνι" },
  { satz: "Η κότα γέννησε στο κοτέτσι ένα μεγάλο αυτί.", falsch: "αυτί", richtig: "αυγό" },
  { satz: "Η χελώνα κρύβεται στο καβούρι της.", falsch: "καβούρι", richtig: "καβούκι" },
  { satz: "Μετά το μπάνιο σκουπίζομαι με μια μεγάλη πεταλούδα.", falsch: "πεταλούδα", richtig: "πετσέτα" },
  { satz: "Πλένω τα χέρια μου με νερό και σαλάμι.", falsch: "σαλάμι", richtig: "σαπούνι" },
  { satz: "Η θεία μου φοράει στο αυτί ένα χρυσό σκουλήκι.", falsch: "σκουλήκι", richtig: "σκουλαρίκι" },
  { satz: "Στη γιορτή τραγουδάμε όλοι μαζί ένα χαρούμενο τραγί.", falsch: "τραγί", richtig: "τραγούδι" },
  { satz: "Γράφω με τα δέκα δάχτυλα στο πλυντήριο.", falsch: "πλυντήριο", richtig: "πληκτρολόγιο" },
  { satz: "Ο παππούς ποτίζει τις γλάστρες στο μπαλόνι.", falsch: "μπαλόνι", richtig: "μπαλκόνι" },
  { satz: "Κάθομαι στην καρφίτσα και τρώω το φαγητό μου.", falsch: "καρφίτσα", richtig: "καρέκλα" },
  { satz: "Στην τούρτα σβήνουμε δέκα κεραμίδια.", falsch: "κεραμίδια", richtig: "κεριά" },
  { satz: "Στον δρόμο για το σχολείο αγόρασα ένα κουνούπι με σουσάμι.", falsch: "κουνούπι", richtig: "κουλούρι" },
  { satz: "Τη νύχτα κάνει κρύο, γι' αυτό σκεπάζομαι με μια ζεστή κουβέντα.", falsch: "κουβέντα", richtig: "κουβέρτα" },
  { satz: "Ξεφλουδίζω ένα ζουμερό μαντολίνο.", falsch: "μαντολίνο", richtig: "μανταρίνι" },
  { satz: "Η μέλισσα φτιάχνει γλυκό μήλο.", falsch: "μήλο", richtig: "μέλι" },
];
