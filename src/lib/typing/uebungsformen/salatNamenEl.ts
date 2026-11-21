/**
 * ★ G3c-VERTEILER (25.10.2026): WAS DER BUCHSTABENSALAT AUF WEG „el" (Griechisch) NICHT ALS WORT ZÄHLT - gefüllt (★ O-INHALT-EL, 29.10.2026).
 *
 * Vorbild: die `cs`-Einträge in `salatNamen.ts`. Aus ALLEN Funden der Quellwörter (`buchstabensalatEl.ts`) von Hand
 * durchgesehen: {@link SALAT_NAMEN_EL} Vornamen, Nachnamen, Orte, Länder, Flüsse; {@link SALAT_KEINE_WOERTER_EL} Abkürzungen,
 * Ausrufe, fremde Wörter, Schreibungen ohne Diakritika, die als Wort falsch sind, und Funde, die ein Kind nicht als Wort finden soll.
 * Alles klein. Verteiler: `uebungsformen/salatNamen.ts`. Wächter: `tests/tastenflow-salat-namen.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „el" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/*
 * ★ O-INHALT-EL (29.10.2026): Das Vorlese-Lexikon kennt „el" noch nicht (F8) - der Salat hat heute KEINE Funde. Sobald das Fach
 * kommt, trägt es die Wörter des Korpus (Charge 1) und damit dessen Namen in genau den Formen, die dort stehen („λεμεσό",
 * „κύπρου" - Griechisch beugt Namen). Darum stehen hier vorab die Wörter, die im Korpus mitten im Satz GROSS stehen und nie klein
 * vorkommen (gezählt 29.10.2026 über `CORPUS_EL`), klein mit Tonos. Bewusst NICHT hier, weil sie gewöhnliche Wörter sind oder im
 * Griechischen gross geschrieben werden, ohne Namen zu sein: Wochentage und Monate (Glossar Regel 9: „Σάββατο", „Ιανουάριο"),
 * Schulfächer („Χημεία"), Feste („Πάσχα"), und Namen, die zugleich Wörter sind: „Ζωή" (Leben), „Ειρήνη" (Frieden), „Σοφία"
 * (Weisheit), „Ευτυχία", „Δάφνη" (Lorbeer), „Νεφέλη", „Φωτεινή" (hell), „Βασιλική", „Γεωργία", „Βόλο" (Murmel).
 * Wächter: `tests/tastenflow-wortspiele-el.test.ts` (jeder Name im Korpus belegt).
 */
export const SALAT_NAMEN_EL: readonly string[] = [
  "λεμεσό", "λευκωσία", "θεσσαλονίκη", "λάρνακα", "πάφο", "αθήνα", "ηράκλειο", "κέρκυρα", "παραλίμνι", "τόκιο", "χανιά",
  "γιάννενα", "λάρισα", "νάξο", "ελένη", "τρόοδος", "κομοτηνή", "πάτρα", "κεφαλονιά", "τρίκαλα", "χίο", "άννα", "ρέθυμνο",
  "άρης", "ναύπλιο", "σύρο", "αθανάσιος", "γκαβέλας", "καρολίνα", "πελενδρίτου", "τρίπολη", "τροόδους", "κοζάνη", "πέτρος",
  "παύλος", "ρία", "στέφανος", "δέσποινα", "στέλιος", "λάρνακας", "μπράιγ", "ρόδου", "καλαμάτα", "χαράλαμπος", "νίκος",
  "μαρίνα", "ραφαήλ", "κρήτης", "κύπρου", "λουλού", "καστοριά", "κω", "ζάκυνθο", "ιωάννα", "ερμίρα", "μάριο", "δανάη",
  "πάτρας", "λευτέρης", "ναταλία", "καβάλα", "πήλιο", "λήμνο", "στέλλα", "κυριάκος", "χριστίνα", "μανώλης", "αλεξανδρούπολη",
  "σάμο", "λαμίας", "ζαγόρι", "αλεξάνδρα", "ικαρία", "παρίσι", "πεκίνο", "κύπρος", "τήνο", "σάββας", "μυρτώ",
  "σαμαριάς", "κρήτη", "ορέστης", "ευαγγελία", "αντρέας", "μεσσηνία", "μαρία", "αντώνης", "γιάννης", "πάφου",
  "κώστας", "άντρη", "μέτσοβο", "ρόδο", "σύμη", "πεδουλά", "λευκωσίας", "ξάνθης", "λαμία", "θανάσης", "σαντορίνη", "λεύκαρα",
  "μαρούλα", "χρυσταλλένη", "άρτα", "ραλλού", "όμοδο", "καλαμπάκα", "χαλκίδα", "ευρίπου", "κατερίνας", "κύπρο", "ανέστης",
];

/** Abkürzungen und Ausrufe - kein Wort, das ein Kind im Salat finden soll (alles klein). */
export const SALAT_KEINE_WOERTER_EL: readonly string[] = ["κλπ", "κτλ", "πχ", "οκ", "αχ", "ωχ", "ουφ", "μπα", "χμ", "μμ"];
