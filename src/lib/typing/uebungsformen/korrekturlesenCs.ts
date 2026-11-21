/**
 * ★ CS-W (09.10.2026): „Korrekturlesen" auf Weg „cs" (*Oprav chybu*) - in jedem Satz steht ein falsches, ECHTES tschechisches
 * Wort, das man deutlich anders hört (Johannes 02.09.2026: der Fehler muss hörbar sein) und das im Satz offensichtlich nicht
 * stimmt. Neu auf Tschechisch geschrieben, nicht übersetzt.
 *
 * ⚠️ Im Tschechischen klingen einige Schreibungen GLEICH - ein Paar, das sich nur darin unterscheidet, ist für eine
 * Sprachausgabe unhörbar und wäre eine Aufgabe gegen das Kind: `i`/`y` und `í`/`ý` (*byl/bil*, *mi/my*), `ú`/`ů`, `dě tě ně`
 * gegen `ďe ťe ňe`, `di ti ni` (gesprochen weich), `mě`/`mně`, und die Auslautverhärtung samt Angleichung in Mitlautgruppen
 * (*led/let*, *had/hat*, *loďka/loťka*, *vůz/vůs*). Der Wächter rechnet dafür einen Lautschlüssel.
 *
 * ★ Hörbar sind dagegen Háček und Čárka, die einen ANDEREN LAUT tragen: *ze/že* (z gegen ž), *mys/myš*, *kosu/koši* (s gegen
 * š), *pas/pás*, *vila/víla*, *být/byt*, *rada/ráda*, *dal/dál* (kurz gegen lang), *ruce/řece* (r gegen ř). Diese Fälle üben
 * genau das, was die Zeichen ausmachen: ohne sie ist es ein anderes Wort.
 *
 * Kein Geschlecht der tippenden Person: 1. Person nur im Präsens, Vergangenheit nur in der 3. Person (*kočka chytila*). Keine
 * Feiertage, keine Religion. Nichts aus der Sperrliste (`sperrlisteCs.ts`, Kern UND Wortbasis).
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_CS: readonly Korrekturfall[] = [
  { satz: "V lese rostou vysoké stoly.", falsch: "stoly", richtig: "stromy" },
  { satz: "Pes vesele vrtí oknem.", falsch: "oknem", richtig: "ocasem" },
  { satz: "V zimě děti staví sněhuláka ze smíchu.", falsch: "smíchu", richtig: "sněhu" },
  { satz: "Táta krájí chleba ostrým nosem.", falsch: "nosem", richtig: "nožem" },
  { satz: "V noci svítí na obloze hřebíky.", falsch: "hřebíky", richtig: "hvězdy" },
  { satz: "Kuřátko se vylíhne z jablka.", falsch: "jablka", richtig: "vejce" },
  { satz: "Ráno si češu vlasy houbou.", falsch: "houbou", richtig: "hřebenem" },
  { satz: "Babička peče v troubě voňavé město.", falsch: "město", richtig: "těsto" },
  { satz: "Večer si lehnu do postele a zavřu uši.", falsch: "uši", richtig: "oči" },
  { satz: "Do sešitu píšu okurkou.", falsch: "okurkou", richtig: "tužkou" },
  { satz: "Na hlavu si dám teplou kapsu.", falsch: "kapsu", richtig: "čepici" },
  { satz: "Anička čte zajímavou kašičku.", falsch: "kašičku", richtig: "knížku" },
  { satz: "Po bouřce se na obloze ukáže dýně.", falsch: "dýně", richtig: "duha" },
  { satz: "Včely sbírají nektar a dělají sladký led.", falsch: "led", richtig: "med" },
  { satz: "Vlak jede po kolenou.", falsch: "kolenou", richtig: "kolejích" },
  { satz: "V Česku jsou letní prázdniny v zimě.", falsch: "zimě", richtig: "létě" },
  { satz: "Týden má sedm hodin.", falsch: "hodin", richtig: "dní" },
  { satz: "Rok má dvanáct týdnů.", falsch: "týdnů", richtig: "měsíců" },
  { satz: "Vůni květin cítíme ušima.", falsch: "ušima", richtig: "nosem" },
  { satz: "Veverka si schovává oříšky na zmrzlinu.", falsch: "zmrzlinu", richtig: "zimu" },
  { satz: "Na pískovišti stavíme hrad z pyžama.", falsch: "pyžama", richtig: "písku" },
  { satz: "Kolo má dvě kolena.", falsch: "kolena", richtig: "kola" },
  { satz: "Na zamrzlém rybníce bruslíme na lžičkách.", falsch: "lžičkách", richtig: "bruslích" },
  { satz: "Slunce zapadá ráno.", falsch: "ráno", richtig: "večer" },
  { satz: "Na jabloni rostou hrušky.", falsch: "hrušky", richtig: "jablka" },
  { satz: "Kachna plave po stole.", falsch: "stole", richtig: "rybníce" },
  { satz: "Pes spí ve své botě.", falsch: "botě", richtig: "boudě" },
  { satz: "Z mouky, vajec a mléka smažíme palice.", falsch: "palice", richtig: "palačinky" },
  { satz: "Na stole stojí váza s kvádry.", falsch: "kvádry", richtig: "květinami" },
  { satz: "Krávy se pasou na lavici.", falsch: "lavici", richtig: "louce" },
  { satz: "Kočka má čtyři lampy.", falsch: "lampy", richtig: "tlapky" },
  { satz: "Houby sbíráme do košile.", falsch: "košile", richtig: "košíku" },
  // --- Háček a čárka: bez nich je to jiné slovo (a jiný zvuk) ---
  { satz: "Ryby plavou v ruce.", falsch: "ruce", richtig: "řece" },
  { satz: "Vím, ze zítra nejdeme do školy.", falsch: "ze", richtig: "že" },
  { satz: "Kočka chytila malou mys.", falsch: "mys", richtig: "myš" },
  { satz: "Jablka nosíme v proutěném kosu.", falsch: "kosu", richtig: "koši" },
  { satz: "Kalhoty mi drží kožený pas.", falsch: "pas", richtig: "pás" },
  { satz: "V pohádce tančí na louce lesní vila.", falsch: "vila", richtig: "víla" },
  { satz: "Náš nový být má tři pokoje.", falsch: "být", richtig: "byt" },
  { satz: "Babička je rada, když přijdeme na návštěvu.", falsch: "rada", richtig: "ráda" },
  { satz: "Petr jde dal, až na konec ulice.", falsch: "dal", richtig: "dál" },
];
