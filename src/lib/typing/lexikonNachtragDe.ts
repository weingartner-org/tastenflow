/**
 * Lexikon-Nachtrag Deutsch - aus `lexicon.ts` herausgelöst (28.09.2026), Inhalt
 * unverändert. Eine reine Wortliste ohne Code, damit sie als Blatt im Sprach-
 * Datenpaket des Bündels liegt (`scripts/buendel-aufteilung.ts`): Ändert sich
 * der deutsche Nachtrag, lädt ein Kind mit einer anderen Sprache nichts neu.
 * ⚠️ Nur `import type` - ein Code-Import hier machte die Datei zum Nicht-Blatt.
 */

/**
 * ★★★★ WÖRTER, DIE EIN KIND FINDET UND DAS LEXIKON NICHT KENNT (04.09.2026).
 *
 * Testerin am 03.09.2026 über den Buchstabensalat: *„Bei der Kombi eefhilnr hieß
 * es, das Wort ‚Niere' gäbe es nicht."*
 *
 * Nachgemessen: `isRealWord("niere", "de")` war **false**. Der Grund ist keine
 * Prüf-Logik, sondern der Wortschatz - das Lexikon baut sich aus dem
 * Übungs-Korpus und den Serien, und was dort nie vorkam, kennt es nicht.
 *
 * ★★★★★ WARUM DAS SCHLIMMER IST ALS EIN FEHLENDES WORT. Das Kind hat ein
 * richtiges Wort gefunden und bekommt „Dieses Wort kenne ich nicht" zu hören.
 * Der Wortlaut ist schon sorgfältig (die App sagt „ich kenne es nicht", nicht
 * „es gibt es nicht" - siehe `feedback_nie_gegen_das_kind`), aber die Wirkung
 * bleibt: Es sucht den Fehler bei sich, obwohl es recht hatte.
 *
 * ── WIE DIESE LISTE ENTSTAND, UND WAS SIE NICHT IST ───────────────────────
 *
 * Gemessen an 28 gängigen Wörtern, die aus üblichen Quellwörtern des
 * Buchstabensalats zu bauen sind: **6 fehlten** (niere, nieren, kerne, erle,
 * ehre, nierchen). Das ist keine vollständige Lücken-Liste, sondern eine
 * Stichprobe - und darum steht hier auch die Messung dabei, nicht nur das
 * Ergebnis.
 *
 * ⚠️ Diese Liste ist ein NACHTRAG, kein Wortschatz. Sie füllt gemeldete und
 * gemessene Lücken. Wer den Buchstabensalat breiter machen will, erweitert den
 * Korpus - dann wächst das Lexikon von selbst mit, und die Wörter kommen auch
 * in den Übungen vor.
 */
export const NACHTRAG_DE = [
  // Testerin Fall (eefhilnr) und was in derselben Stichprobe fehlte
  "niere", "nieren", "nierchen",
  "kern", "kerne", "kernen",
  "erle", "erlen",
  "ehre", "ehren",
  // Naheliegende Nachbarn derselben Wortfelder. ⚠️ JEDES EINZELN GEPRÜFT:
  // Ein Nicht-Wort hier wäre schlimmer als die Lücke - das Kind bekäme
  // „richtig" für etwas, das es nicht gibt, und lernte es falsch.
  // Aussortiert beim Durchsehen: „nerf" (kein deutsches Wort), „hiefe"
  // (Konjunktiv, den kein Kind sucht).
  "ferne", "fernen", "lehne", "lehnen", "reihen",
  "helle", "hellen", "feile", "feilen", "eifer",
  "riefe", "liefe",
  // ★ 25.09.2026 - Testerin „Lid" (Runde „Linde"): wieder ein richtiges Wort mit
  // „Dieses Wort kenne ich nicht". Diesmal nicht als Stichprobe, sondern als
  // DURCHGANG: jedes Wort des Hunspell-Wörterbuchs (`vorbereitung/hunspell/de`,
  // nur Stämme, 2-7 Buchstaben), das aus einem der 60 Quellwörter zu bauen ist
  // und hier fehlte - 1.232 Kandidaten. Davon JEDES EINZELN DURCHGESEHEN und nur
  // geläufige, kindgerechte Wörter übernommen. Aussortiert: Namen, Abkürzungen,
  // Fremd- und Fachwörter, Beugungsformen ohne Grundform, und alles, was ein
  // Kind nicht als Treffer hören soll.
  "lid", "lider", "eid", "stil", "list", "silbe", "lande", "alge", "algen", "anis",
  "angel", "armee", "armut", "asche", "aster", "auster", "base", "beil", "beige",
  "biest", "blase", "blei", "bluse", "braue", "brauen", "brise", "daune", "degen",
  "delta", "dieb", "diener", "dielen", "dornen", "eber", "egel", "eibe", "eiche",
  "eichel", "eichen", "eigelb", "eigen", "einrad", "einsam", "ekel", "elch", "elfe",
  "elfen", "enge", "enkel", "erbe", "erben", "esche", "etui", "fahne", "farn",
  "fasten", "feier", "ferse", "fies", "finster", "gabe", "gabeln", "garbe", "gaul",
  "gebet", "gebiet", "geier", "geist", "geiz", "gelten", "gemisch", "gerste", "gesamt",
  "geste", "giebel", "gier", "gleis", "gnade", "gratis", "greis", "gunst", "gurt",
  "hagel", "hain", "hantel", "harfe", "hasel", "hastig", "hauen", "heck", "heirat",
  "heiser", "heiter", "hengst", "hirse", "kachel", "kamin", "kehle", "keil", "keim",
  "kelch", "krise", "lachs", "lack", "laib", "laie", "latein", "laube", "leber",
  "lecker", "ledig", "leier", "leihen", "leiten", "lerche", "liane", "liga", "limo",
  "lunge", "magie", "marine", "masche", "mast", "matsch", "maut", "miene", "mieten",
  "mieter", "milbe", "mine", "mischen", "mobil", "muse", "nagen", "nager", "narbe",
  "nelke", "neon", "nerz", "nichte", "nobel", "nord", "oase", "omen", "orden",
  "ostern", "rabe", "radeln", "raub", "rauben", "rebe", "regeln", "reiben", "reue",
  "riemen", "rieseln", "riesen", "rind", "robe", "roden", "rosine", "rune", "rute",
  "sahne", "salbe", "salbei", "salon", "samt", "sardine", "satin", "scheren",
  "schlank", "schrei", "seifen", "sichern", "sicht", "siebte", "siegen", "sieger",
  "silbern", "ski", "skier", "sorgen", "steak", "stecker", "stich", "stiege", "stier",
  "strafe", "strafen", "streik", "strick", "tadel", "tango", "tarnen", "taub", "tauen",
  "tausch", "teer", "theke", "traben", "tresen", "treue", "trio", "tube", "turban",
  "uni", "urne", "ware", "weiden", "werte", "wesen", "zelten", "zielen", "zins",
] as const;
