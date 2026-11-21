/**
 * ★ D-LERNDATEN (25.10.2026): DIE BUCHSTABENVERBINDUNGEN FÜR DAS GELÄUFIGKEITSSCHREIBEN des Weges „ro" (Rumänisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/ro/tf-fest-ro.json`, Schlüssel `buchstabenFolgen` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja, unter einer Bedingung: Eine muttersprachliche Person liest die Stellen aus Abschnitt 5 noch einmal.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `gelaeufigkeitCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Rumänisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * Verteiler: `gelaeufigkeit.ts` (prüft jedes Wort mit dem Weg über `fitText`) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?rumaenisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-ro.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_RO: Verbindung[] = [
  { folge: "ă", stelle: "ende", woerter: ["casă", "masă", "mamă", "apă", "pisică", "bunică", "fereastră", "școală", "lună", "stradă", "frunză", "ceapă"] },
  { folge: "ă", stelle: "mitte", woerter: ["pădure", "tăcere", "mătură", "băiat", "păpușă", "căpșună", "mămăligă", "grădină", "zăpadă", "cămară"] },
  { folge: "â", stelle: "mitte", woerter: ["pâine", "câine", "mâine", "vânt", "câmp", "cântec", "pământ", "mână", "brânză", "sâmbătă", "lână", "când"] },
  { folge: "î", stelle: "anfang", woerter: ["încet", "înot", "înger", "înalt", "întâi", "întrebare", "început", "înapoi", "înainte", "înghețată"] },
  { folge: "îm", stelle: "anfang", woerter: ["împreună", "împărat", "împinge", "împrumut", "împletit", "împodobit", "împărți", "împăcat"] },
  { folge: "ș", stelle: "anfang", woerter: ["șapte", "șase", "școală", "șoarece", "șosea", "șarpe", "șal", "șir", "șofer", "șorț", "șurub", "șiret"] },
  { folge: "ș", stelle: "mitte", woerter: ["cireașă", "ceașcă", "ușă", "cămașă", "mărțișor", "frumușel", "ușor", "păpușă", "iepurași"] },
  { folge: "ț", stelle: "anfang", woerter: ["țară", "țăran", "țânțar", "țiglă", "țelină", "ține", "țintă", "țărm", "țurțur", "țestoasă"] },
  { folge: "ț", stelle: "mitte", woerter: ["cățel", "băiețel", "furculiță", "veveriță", "dulceață", "gheață", "verdeață", "pițigoi", "rățușcă"] },
  { folge: "ție", stelle: "ende", woerter: ["lecție", "stație", "poziție", "atenție", "relație", "situație", "invenție", "porție", "informație", "expoziție"] },
  { folge: "șt", stelle: "anfang", woerter: ["știu", "știri", "știință", "ștrand", "ștergar", "știucă", "ștampilă", "ștafetă"] },
  { folge: "ch", stelle: "anfang", woerter: ["chiar", "cheie", "chibrit", "chip", "chef", "chirie", "chitară", "chimie", "chiflă", "chioșc"] },
  { folge: "ch", stelle: "mitte", woerter: ["ochi", "unchi", "ureche", "veche", "pereche", "genunchi", "deschide", "ochelari", "rochie", "pachet"] },
  { folge: "gh", stelle: "anfang", woerter: ["ghiozdan", "ghindă", "gheață", "ghețar", "ghid", "ghiveci", "ghici", "ghem", "ghete", "ghiocel"] },
  { folge: "gh", stelle: "mitte", woerter: ["unghie", "înghețată", "înghiți", "unghi", "veghe", "îngheț", "sughiț", "junghi"] },
  { folge: "ce", stelle: "anfang", woerter: ["cer", "cerc", "ceas", "ceapă", "ceai", "cerb", "cerneală", "centru", "cetate", "ceață"] },
  { folge: "ci", stelle: "anfang", woerter: ["cină", "cinci", "cireașă", "citi", "ciorbă", "cifră", "cinema", "circ", "ciocan", "ciupercă"] },
  { folge: "ge", stelle: "anfang", woerter: ["geam", "gem", "geantă", "gest", "ger", "geografie", "geniu", "genunchi"] },
  { folge: "gi", stelle: "anfang", woerter: ["girafă", "gimnastică", "gimnaziu", "ginere", "gingaș", "gingie", "gimnast", "gigant"] },
  { folge: "ea", stelle: "mitte", woerter: ["seară", "fereastră", "ceașcă", "deasupra", "pleacă", "ceapă", "dimineață", "cireașă"] },
  { folge: "ea", stelle: "ende", woerter: ["cafea", "stea", "perdea", "lalea", "curea", "mărgea", "viorea", "saltea", "acadea"] },
  { folge: "oa", stelle: "mitte", woerter: ["floare", "soare", "școală", "noapte", "poartă", "roată", "joacă", "vioară", "doamnă", "toamnă"] },
  { folge: "oa", stelle: "anfang", woerter: ["oaie", "oaspete", "oaspeți", "oare", "oarecum", "oameni", "oală", "oază"] },
  { folge: "ie", stelle: "anfang", woerter: ["ieri", "iepure", "ieftin", "ieși", "ieșire", "iederă", "iertare", "iezer"] },
  { folge: "ia", stelle: "anfang", woerter: ["iarnă", "iarbă", "iaurt", "iaz", "iarmaroc", "iată", "iapă", "iar"] },
  { folge: "ie", stelle: "ende", woerter: ["familie", "bucurie", "poezie", "bucătărie", "copilărie", "prietenie", "farfurie", "cutie", "bijuterie", "librărie"] },
  { folge: "ii", stelle: "ende", woerter: ["copii", "ochii", "frații", "pomii", "câinii", "lupii", "munții", "elevii", "anii", "prietenii", "colegii"] },
  { folge: "oi", stelle: "ende", woerter: ["noi", "voi", "doi", "apoi", "ploi", "eroi", "usturoi", "mușuroi", "înapoi"] },
  { folge: "ee", stelle: "mitte", woerter: ["ideea", "aleea", "aceeași", "aceea", "creează", "agreează", "feeric", "reeditare"] },
  { folge: "nn", stelle: "mitte", woerter: ["înnorat", "înnoi", "înnoit", "înnodat", "înnoptat", "înnoda", "înnegrit", "înnămolit"] },
  { folge: "cc", stelle: "mitte", woerter: ["accent", "accident", "succes", "acces", "accept", "accelera", "acceptat", "succesor"] },
  { folge: "x", stelle: "mitte", woerter: ["exemplu", "examen", "excursie", "taxi", "text", "explică", "expoziție", "extraterestru", "exact", "exterior", "exercițiu", "maxim"] },
  { folge: "str", stelle: "anfang", woerter: ["stradă", "strugure", "strâmb", "strănut", "străin", "străbunic", "strop", "strălucit"] },
  { folge: "sf", stelle: "anfang", woerter: ["sfat", "sfârșit", "sfeclă", "sfoară", "sferă", "sfert", "sfială", "sfeșnic"] },
  { folge: "zg", stelle: "anfang", woerter: ["zgomot", "zgomotos", "zgârie", "zglobiu", "zgribulit", "zgură", "zgâlțâit", "zgardă"] },
  { folge: "zb", stelle: "anfang", woerter: ["zbor", "zbura", "zburda", "zburător", "zbârcit", "zbuciumat", "zbenguială", "zbârnâi"] },
  { folge: "tr", stelle: "anfang", woerter: ["tren", "trei", "trandafir", "trotinetă", "trăsură", "trunchi", "tricou", "trist", "treaptă", "trup"] },
  { folge: "pl", stelle: "anfang", woerter: ["ploaie", "plajă", "plapumă", "plăcintă", "plin", "plimbare", "plop", "plug", "pleoapă", "plută"] },
  { folge: "fl", stelle: "anfang", woerter: ["floare", "fluture", "flaut", "flacără", "flămând", "fluier", "fluviu", "flori"] },
  { folge: "br", stelle: "anfang", woerter: ["brad", "brânză", "broască", "braț", "brățară", "brumă", "brutar", "brazdă"] },
  { folge: "cr", stelle: "anfang", woerter: ["creion", "cred", "crește", "crin", "crap", "creangă", "cratiță", "cruce"] },
  { folge: "gr", stelle: "anfang", woerter: ["grădină", "grâu", "greu", "grijă", "grindină", "grup", "graur", "gras", "grădiniță"] },
  { folge: "scr", stelle: "anfang", woerter: ["scrie", "scris", "scrisul", "scriitor", "scrisoare", "scrâșnet", "scrumbie", "scripcă"] },
  { folge: "reî", stelle: "anfang", woerter: ["reînnoi", "reînnoire", "reîntâlnire", "reîntoarcere", "reîncepe", "reîncălzi", "reînvia", "reînființa"] },
  { folge: "neî", stelle: "anfang", woerter: ["neîncredere", "neînțeles", "neîntrerupt", "neînfricat", "neîndemânatic", "neîmpăcat", "neînceput", "neîndoielnic"] },
  { folge: "esc", stelle: "ende", woerter: ["citesc", "vorbesc", "iubesc", "privesc", "folosesc", "doresc", "povestesc", "mulțumesc"] },
  { folge: "ează", stelle: "ende", woerter: ["lucrează", "creează", "desenează", "dansează", "pictează", "visează", "înotează", "colorează"] },
  { folge: "ul", stelle: "ende", woerter: ["copilul", "pomul", "lupul", "drumul", "ursul", "satul", "orașul", "râul"] },
  { folge: "le", stelle: "ende", woerter: ["fetele", "casele", "florile", "mesele", "zilele", "cărțile", "stelele", "mâinile"] },
];
