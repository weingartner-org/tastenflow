/**
 * ★ IT-W (03.10.2026): „Korrekturlesen" auf Weg „it" (*Rilettura*) - in jedem Satz steht ein falsches, ECHTES
 * italienisches Wort, das man deutlich anders hört (Johannes 02.09.2026: der Fehler muss hörbar sein) und das im Satz
 * offensichtlich nicht stimmt. Neu auf Italienisch geschrieben, nicht übersetzt.
 *
 * ⚠️ Im Italienischen klingen einige Schreibungen gleich - ein Paar, das sich nur darin unterscheidet, ist für eine
 * Sprachausgabe UNHÖRBAR und wäre eine Aufgabe gegen das Kind: stummes `h` (*anno/hanno, a/ha, o/ho*), `ci`/`c` vor e
 * (*cielo/celo*), `qu`/`cu` (*cuore*), `sci`/`sc` vor e (*scienza*), `gi`/`g` vor e. Auch die DOPPELKONSONANTEN
 * (*pala/palla, nono/nonno, caro/carro*) sind hier nicht dabei: der Unterschied ist nur eine Länge, die eine
 * Sprachausgabe oft verschluckt. Der Wächter rechnet dafür einen Lautschlüssel.
 *
 * ★ Hörbar ist dagegen der AKZENT, wenn er die Betonung verschiebt: *papa/papà* (der Papst / der Papa), *pero/però*
 * (der Birnbaum / aber), *meta/metà*, *busso/bussò*, *arrivo/arrivò*, *canto/cantò*, *assaggio/assaggiò*, *parlo/parlò* -
 * beim Vorlesen liegt die Betonung auf einer anderen Silbe. Einsilbige Paare (*è/e, là/la, dà/da, sì/si, tè/te*) sind
 * gleich betont und darum NICHT dabei - sie stehen im Lückentext, wo das Kind sie schreibt, statt sie zu hören.
 * Ebenso nicht *perché/perche*: „perche" ist kein Wort, und ein falsches Wort muss ein echtes sein.
 *
 * Die passato-remoto-Formen (*bussò, cantò*) stehen in Märchen- und Erzählsätzen, wo sie in ganz Italien und im Tessin
 * die gewöhnliche Erzählzeit sind.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_IT: readonly Korrekturfall[] = [
  { satz: "Abitiamo in una cosa molto grande.", falsch: "cosa", richtig: "casa" },
  { satz: "La cena è pronta: tutti a favola!", falsch: "favola", richtig: "tavola" },
  { satz: "Le api producono un fiele dolcissimo.", falsch: "fiele", richtig: "miele" },
  { satz: "In spiaggia costruisco un castello di rabbia.", falsch: "rabbia", richtig: "sabbia" },
  { satz: "Il gatto dà la caccia a un tipo.", falsch: "tipo", richtig: "topo" },
  { satz: "La nonna mi ha fatto una sciarpa di rana.", falsch: "rana", richtig: "lana" },
  { satz: "Il fornaio fa il pane con la carina.", falsch: "carina", richtig: "farina" },
  { satz: "Il cane beve l'acqua dalla sua cipolla.", falsch: "cipolla", richtig: "ciotola" },
  { satz: "Di notte nel cielo brilla la duna.", falsch: "duna", richtig: "luna" },
  { satz: "Il pescatore prende i pesci con la sete.", falsch: "sete", richtig: "rete" },
  { satz: "Scrivo il mio nome con la panna.", falsch: "panna", richtig: "penna" },
  { satz: "Il treno parte dal binario tre della stagione.", falsch: "stagione", richtig: "stazione" },
  { satz: "La mattina mi sveglio quando suona la foglia.", falsch: "foglia", richtig: "sveglia" },
  { satz: "Prima di mangiare mi lavo le mani con acqua e sapore.", falsch: "sapore", richtig: "sapone" },
  { satz: "D'estate facciamo il bagno al male.", falsch: "male", richtig: "mare" },
  { satz: "Il contadino munge la mucca nella stella.", falsch: "stella", richtig: "stalla" },
  { satz: "In cortile giochiamo a calcio con una bolla.", falsch: "bolla", richtig: "palla" },
  { satz: "Dopo cena mi lavo i venti.", falsch: "venti", richtig: "denti" },
  { satz: "In autunno cadono le soglie degli alberi.", falsch: "soglie", richtig: "foglie" },
  { satz: "La nonna cuoce la torta nel corno.", falsch: "corno", richtig: "forno" },
  { satz: "Nella stalla il cavallo mangia il treno.", falsch: "treno", richtig: "fieno" },
  { satz: "Il re e la regina vivono in un grande cartello.", falsch: "cartello", richtig: "castello" },
  { satz: "Lo scoiattolo nasconde le voci per l'inverno.", falsch: "voci", richtig: "noci" },
  { satz: "Il sole sorge ogni sera.", falsch: "sera", richtig: "mattina" },
  { satz: "Un anno ha dodici settimane.", falsch: "settimane", richtig: "mesi" },
  { satz: "Una settimana ha sette ore.", falsch: "ore", richtig: "giorni" },
  { satz: "Per vedere usiamo le orecchie.", falsch: "orecchie", richtig: "occhi" },
  // --- Der Akzent verschiebt die Betonung auf eine andere Silbe ---
  { satz: "Il mio papa mi accompagna a scuola in bicicletta.", falsch: "papa", richtig: "papà" },
  { satz: "Volevo andare al parco, pero pioveva.", falsch: "pero", richtig: "però" },
  { satz: "Ho mangiato solo la meta della pizza.", falsch: "meta", richtig: "metà" },
  { satz: "Il lupo busso alla porta della nonna.", falsch: "busso", richtig: "bussò" },
  { satz: "Quella notte il gallo canto prima dell'alba e svegliò tutto il paese.", falsch: "canto", richtig: "cantò" },
  { satz: "Il cuoco assaggio il sugo e sorrise.", falsch: "assaggio", richtig: "assaggiò" },
  { satz: "Alla fine il treno arrivo con un'ora di ritardo.", falsch: "arrivo", richtig: "arrivò" },
  { satz: "Alla festa della scuola, la maestra parlo a tutti dal palco.", falsch: "parlo", richtig: "parlò" },
];
