/**
 * ★ D-LERNDATEN (25.10.2026): DIE KORREKTURLESE-FÄLLE des Weges „ro" (Rumänisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/ro/tf-fest-ro.json`, Schlüssel `unsinnSaetze` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja, unter einer Bedingung: Eine muttersprachliche Person liest die Stellen aus Abschnitt 5 noch einmal.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `korrekturlesenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Rumänisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * In jedem Satz steht ein falsches, echtes Wort (`falsch`), das im Satz offensichtlich nicht stimmt; `richtig` ist das gemeinte.
 * Ob der Unterschied für eine Sprachausgabe HÖRBAR ist (Johannes 02.09.2026), prüft erst ein Lautschlüssel je Sprache (F8, offen).
 *
 * Verteiler: `korrekturlesen.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?rumaenisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-ro.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_RO: readonly Korrekturfall[] = [
  { satz: "Locuim într-o masă mare, cu grădină.", falsch: "masă", richtig: "casă" },
  { satz: "Fratele meu se joacă afară cu mingea în cutie.", falsch: "cutie", richtig: "curte" },
  { satz: "Vara mergem cu toată familia la sare.", falsch: "sare", richtig: "mare" },
  { satz: "Bunica mi-a tricotat un fular din lună.", falsch: "lună", richtig: "lână" },
  { satz: "Noaptea, pe cer strălucește lupa.", falsch: "lupa", richtig: "luna" },
  { satz: "Am pus brânză pe o felie de mâine.", falsch: "mâine", richtig: "pâine" },
  { satz: "Toamna culegem mare din livadă.", falsch: "mare", richtig: "mere" },
  { satz: "Am mâncat o cară zemoasă.", falsch: "cară", richtig: "pară" },
  { satz: "Câinele bea apă din nasul lui.", falsch: "nasul", richtig: "vasul" },
  { satz: "Seara ne spălăm pe minți.", falsch: "minți", richtig: "dinți" },
  { satz: "Trenul pleacă din vară la ora opt.", falsch: "vară", richtig: "gară" },
  { satz: "Seara citesc o carne cu povești.", falsch: "carne", richtig: "carte" },
  { satz: "Mașinile trec râul pe un pom.", falsch: "pom", richtig: "pod" },
  { satz: "Iarna patinăm pe ceața de pe lac.", falsch: "ceața", richtig: "gheața" },
  { satz: "Albinele fac mere dulci în stup.", falsch: "mere", richtig: "miere" },
  { satz: "În pădure am văzut un curs brun.", falsch: "curs", richtig: "urs" },
  { satz: "Lutul urlă la lună.", falsch: "Lutul", richtig: "Lupul" },
  { satz: "Pe cer trece un dor alb și pufos.", falsch: "dor", richtig: "nor" },
  { satz: "La plajă stăm la umbră ca să ne ferim de sare.", falsch: "sare", richtig: "soare" },
  { satz: "Am urcat pe frunte până la cabană.", falsch: "frunte", richtig: "munte" },
  { satz: "Am traversat lacul cu banca.", falsch: "banca", richtig: "barca" },
  { satz: "Oile pasc barbă verde pe deal.", falsch: "barbă", richtig: "iarbă" },
  { satz: "Beau ceai fierbinte dintr-o vană.", falsch: "vană", richtig: "cană" },
  { satz: "Melcul își duce coasa în spinare.", falsch: "coasa", richtig: "casa" },
  { satz: "Mămăliga se face din făină de porumbel.", falsch: "porumbel", richtig: "porumb" },
  { satz: "Mă uit la ceai să văd cât e ora.", falsch: "ceai", richtig: "ceas" },
  { satz: "Sora mea cântă la pion.", falsch: "pion", richtig: "pian" },
  { satz: "Am umflat un salon roșu de ziua mea.", falsch: "salon", richtig: "balon" },
  { satz: "Pe port ardeau zece lumânări.", falsch: "port", richtig: "tort" },
  { satz: "Un cal mare a venit din mare și a stricat castelul de nisip.", falsch: "cal", richtig: "val" },
  { satz: "Veverița urcă repede în capac.", falsch: "capac", richtig: "copac" },
  { satz: "Toamna cad brânzele din copaci.", falsch: "brânzele", richtig: "frunzele" },
  { satz: "Bicicleta mea are o rață dezumflată.", falsch: "rață", richtig: "roată" },
  { satz: "Noaptea mă învelesc cu o pădure caldă.", falsch: "pădure", richtig: "pătură" },
  { satz: "Am pus florile într-o oază cu apă.", falsch: "oază", richtig: "vază" },
  { satz: "În clasă, elevii stau în băi.", falsch: "băi", richtig: "bănci" },
  { satz: "Am dormit la munte într-un tort.", falsch: "tort", richtig: "cort" },
  { satz: "Ca să nu mă rătăcesc, mă uit pe tartă.", falsch: "tartă", richtig: "hartă" },
  { satz: "Bunicul taie lemne cu topul.", falsch: "topul", richtig: "toporul" },
];
