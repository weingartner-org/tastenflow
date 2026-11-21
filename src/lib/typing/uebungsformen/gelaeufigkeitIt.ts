/**
 * ★ F5-F8 Italienisch (02.10.2026): die häufigen Buchstabenverbindungen des Italienischen für das Geläufigkeitsschreiben
 * (`gelaeufigkeit.ts`) - neu gewählt, nicht übertragen. Bis hierher stand für `it` das ENGLISCHE `VERBINDUNGEN_EN`
 * (RÜCKFALL-EN, G2a): jede adaptive Runde („Mein Training") hängt eine Geläufigkeits-Zeile an, ein Kind auf Weg „it" hätte
 * darin „education station action nation" geschrieben.
 *
 * Gewählt nach dem, was das Italienische über seine Schreibung ausmacht und was Zehnfingerschreiben automatisiert:
 *  · die Doppelkonsonanten (*ll tt ss nn rr cc pp bb zz mm*: gatto, palla, pizza, mamma) - dieselbe Fingerfolge zweimal;
 *  · die Laute aus zwei oder drei Buchstaben (*ch gh gn gl sc sci qu gi gu*: chiave, funghi, bagno, famiglia, scuola,
 *    quaderno, giorno) - im Italienischen KEINE Sonderzeichen, aber das, was Kinder beim Schreiben am häufigsten verwechseln;
 *  · die Wortanfänge mit zwei Mitlauten (*str tr fr gr pr cr br sp st*: strada, treno, fratello, grande);
 *  · die häufigen Endungen (*-zione -mente -ino -ina -etta -ello -ore -tore -are -ere -ire -ato -ata -ggio -io -ia*) und
 *    die Vokalverbindungen (*uo ie ai*: uomo, miele, mai).
 *
 * Alle Wörter klein (italienische Nomen werden nicht grossgeschrieben), echte Alltagswörter, bestehen das macOS-Wörterbuch
 * für Italienisch (`scripts/woerterbuch-macos.js`, Vorsilbe `it:`) und die Sperrliste (`sperrlisteIt.ts`; darum kein
 * *pisello*, *patata*, *uccello*, *brutto*). Drei Verbindungen tragen Akzentbuchstaben (*-ò* andò, però; *-tà* città, libertà;
 * *-ì* così, lunedì) und fünf eine Elision (*l' un' dell' all' d'*: l'amico, un'ora, dell'acqua): `gelaeufigkeit.ts` prüft mit
 * dem Weg (`fitText`) und lässt ein Wort erst durch, wenn die Einheit gelernt ist - die Akzentwörter erscheinen ab ihrer Taste
 * (`ò` ab Nr. 8, `à` Nr. 25, `ì` Nr. 29), die Elisionen ab dem Apostroph (Nr. 26), nie vorher und nie ohne Akzent.
 * Wächter: `tests/tastenflow-it-woerter.test.ts`.
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_IT: Verbindung[] = [
  { folge: "ll", stelle: "mitte", woerter: ["palla", "bella", "stella", "valle", "pelle", "collo", "mille", "anello", "castello", "cavallo", "collina", "fratello", "gallo"] },
  { folge: "tt", stelle: "mitte", woerter: ["gatto", "tetto", "letto", "sette", "notte", "tutto", "latte", "otto", "sotto", "piatto", "bottone", "fretta", "tetti", "gatti"] },
  { folge: "ss", stelle: "mitte", woerter: ["rosso", "sasso", "passo", "classe", "spesso", "grosso", "basso", "osso", "essere", "sessanta", "tessera", "passeggiata"] },
  { folge: "nn", stelle: "mitte", woerter: ["anno", "anni", "nonno", "nonna", "penna", "panna", "gonna", "donna", "canna", "sonno", "tonno", "hanno"] },
  { folge: "rr", stelle: "mitte", woerter: ["terra", "torre", "carro", "burro", "correre", "sorriso", "guerra", "ferro", "arrivo", "errore", "torrente", "barriera", "carrozza"] },
  { folge: "cc", stelle: "mitte", woerter: ["faccia", "braccio", "bocca", "ricco", "secco", "piccolo", "tacco", "sacco", "ecco", "occhio", "macchina", "ghiaccio", "freccia", "focaccia"] },
  { folge: "pp", stelle: "mitte", woerter: ["coppa", "zuppa", "mappa", "cappello", "doppio", "troppo", "tappeto", "appena", "coppia", "tappo", "pioppo", "scoppio"] },
  { folge: "bb", stelle: "mitte", woerter: ["labbro", "gabbia", "sabbia", "nebbia", "abbraccio", "rabbia", "dubbio", "fabbrica", "gabbiano", "abbaiare", "abbigliamento"] },
  { folge: "zz", stelle: "mitte", woerter: ["pizza", "tazza", "piazza", "ragazzo", "palazzo", "pozzo", "pezzo", "mezzo", "razzo", "azzurro", "bellezza", "tazzina", "carrozza", "dozzina"] },
  { folge: "mm", stelle: "mitte", woerter: ["mamma", "gamma", "scimmia", "grammo", "immagine", "commedia", "mummia", "programma", "somma", "ammirare", "ammalato", "sommare"] },
  { folge: "ch", stelle: "anfang", woerter: ["che", "chi", "chiave", "chiesa", "chiodo", "chilo", "chiaro", "chiuso", "chitarra", "chimica", "chiamare", "chiudere", "chilometro", "chiedere"] },
  { folge: "ch", stelle: "mitte", woerter: ["occhio", "macchina", "secchio", "pochi", "anche", "amiche", "fuochi", "giochi", "orchestra", "pacchi", "banche", "barche", "bocche", "mucche"] },
  { folge: "gh", stelle: "mitte", woerter: ["lunghi", "funghi", "spaghetti", "laghi", "luoghi", "maghi", "borghi", "larghi", "righello", "draghi", "alberghi", "lunghezza"] },
  { folge: "gn", stelle: "mitte", woerter: ["bagno", "lavagna", "montagna", "ragno", "sogno", "legno", "signore", "cognome", "bisogno", "campagna", "compagno", "agnello", "stagno", "ingegnere", "castagna"] },
  { folge: "gl", stelle: "mitte", woerter: ["figlio", "famiglia", "foglia", "aglio", "bottiglia", "meglio", "voglio", "maglia", "sveglia", "luglio", "taglio", "coniglio", "biglietto", "consiglio", "figlia"] },
  { folge: "sci", stelle: "anfang", woerter: ["sci", "scimmia", "scienza", "sciarpa", "sciare", "scivolo", "scialle", "sciopero", "sciroppo", "scintilla"] },
  { folge: "sc", stelle: "anfang", woerter: ["scuola", "scala", "scatola", "scarpa", "scuro", "scudo", "scorpione", "scoiattolo", "scacchi", "scalino", "scavare", "scaffale"] },
  { folge: "qu", stelle: "anfang", woerter: ["quando", "quadro", "quaderno", "quattro", "quindici", "questo", "quella", "quanto", "qualche", "quale", "quasi", "quarto", "quinto", "qui"] },
  { folge: "qu", stelle: "mitte", woerter: ["acqua", "cinque", "squadra", "pasqua", "aquila", "aquilone", "tranquillo", "equilibrio", "sequoia"] },
  { folge: "gi", stelle: "anfang", woerter: ["giorno", "giallo", "giardino", "giocare", "giro", "gigante", "giacca", "giugno", "giovane", "giusto", "gioia", "giraffa", "gioco", "giornale", "gioiello", "ginocchio", "giostra"] },
  { folge: "gu", stelle: "anfang", woerter: ["guanto", "guardare", "guerra", "guida", "gufo", "gusto", "guadagno", "guancia", "guscio", "guaio"] },
  { folge: "gu", stelle: "mitte", woerter: ["lingua", "seguire", "sangue", "pinguino", "distinguere", "anguria", "sguardo"] },
  { folge: "str", stelle: "anfang", woerter: ["strada", "strano", "stretto", "strumento", "stringa", "strisciare", "struzzo", "strega", "stradale", "stretta", "strofa", "striscia"] },
  { folge: "tr", stelle: "anfang", woerter: ["tre", "treno", "trenta", "tronco", "trovare", "trota", "trucco", "trenino", "trombone", "trattore", "tracciare"] },
  { folge: "fr", stelle: "anfang", woerter: ["fratello", "freddo", "frutta", "fresco", "fretta", "fresca", "frase", "frana", "frigo", "fragola", "francobollo", "frullato", "frusta", "freccia"] },
  { folge: "gr", stelle: "anfang", woerter: ["grande", "grosso", "grigio", "grazie", "grano", "grotta", "gruppo", "grido", "gradino", "grappolo", "grondaia", "grillo", "granchio", "gru", "gradire"] },
  { folge: "pr", stelle: "anfang", woerter: ["primo", "prato", "prezzo", "premio", "pronto", "prova", "presto", "prugna", "pranzo", "principe", "presepe", "profumo", "prima", "problema", "programma", "professore", "proprio"] },
  { folge: "cr", stelle: "anfang", woerter: ["crema", "croce", "crescere", "credere", "cravatta", "cratere", "crostata", "cristallo", "crudo", "crisi", "croccante", "crociera", "creare"] },
  { folge: "br", stelle: "anfang", woerter: ["braccio", "bravo", "breve", "briciola", "brodo", "bruco", "brillare", "brivido", "brocca", "brigante", "bruno", "brusco"] },
  { folge: "ci", stelle: "anfang", woerter: ["cibo", "cinque", "cima", "cinema", "cintura", "cielo", "cinese", "ciao", "cioccolato", "ciliegia", "ciclo", "cigno", "cinghiale", "civetta", "cipolla"] },
  { folge: "ce", stelle: "anfang", woerter: ["cena", "cerchio", "certo", "cervo", "centro", "cesto", "celeste", "cerotto", "cestino", "cervello", "centimetro"] },
  { folge: "sp", stelle: "anfang", woerter: ["spesa", "spiaggia", "spazio", "spada", "spalla", "spazzola", "spilla", "specchio", "spettacolo", "spina", "spago", "sport", "spesso", "spaghetti", "spinaci"] },
  { folge: "st", stelle: "anfang", woerter: ["stella", "stanza", "stare", "stato", "stagione", "stazione", "stampa", "stivale", "storia", "studio", "stufa", "stomaco", "stagno", "stalla"] },
  { folge: "zione", stelle: "ende", woerter: ["azione", "lezione", "stazione", "nazione", "colazione", "attenzione", "soluzione", "situazione", "emozione", "istruzione", "informazione", "educazione", "direzione", "collezione"] },
  { folge: "mente", stelle: "ende", woerter: ["finalmente", "lentamente", "certamente", "solamente", "veramente", "facilmente", "sicuramente", "tranquillamente", "esattamente", "rapidamente"] },
  { folge: "ino", stelle: "ende", woerter: ["bambino", "vicino", "mattino", "cugino", "gattino", "cestino", "panino", "giardino", "destino", "vino", "pino", "rubino", "violino", "cappuccino", "tacchino", "postino", "cuscino"] },
  { folge: "ina", stelle: "ende", woerter: ["mattina", "cucina", "bambina", "vicina", "cugina", "farina", "regina", "collina", "medicina", "pagina", "vetrina", "cartina", "tazzina", "ballerina", "pallina"] },
  { folge: "etta", stelle: "ende", woerter: ["fetta", "forchetta", "bicicletta", "maglietta", "bacchetta", "casetta", "paletta", "scaletta", "barchetta", "cassetta", "saetta", "vendetta"] },
  { folge: "ello", stelle: "ende", woerter: ["fratello", "castello", "bello", "ombrello", "anello", "agnello", "cervello", "cappello", "gemello", "pennello", "mantello", "carrello", "cancello", "coltello", "ruscello"] },
  { folge: "ore", stelle: "ende", woerter: ["fiore", "amore", "colore", "rumore", "dolore", "signore", "sapore", "motore", "calore", "valore", "pastore", "odore", "errore", "autore", "cuore", "sudore", "timore"] },
  { folge: "tore", stelle: "ende", woerter: ["giocatore", "pittore", "autore", "motore", "attore", "direttore", "lavoratore", "pescatore", "scrittore", "viaggiatore", "allenatore", "trattore", "calciatore", "nuotatore", "dottore"] },
  { folge: "are", stelle: "ende", woerter: ["amare", "usare", "lavare", "tirare", "cantare", "parlare", "ballare", "nuotare", "giocare", "saltare", "guardare", "mangiare", "portare", "tornare", "aiutare"] },
  { folge: "ere", stelle: "ende", woerter: ["vedere", "leggere", "scrivere", "correre", "sapere", "potere", "volere", "credere", "vivere", "spendere", "chiedere", "perdere", "mettere", "prendere", "rispondere"] },
  { folge: "ire", stelle: "ende", woerter: ["dormire", "finire", "partire", "sentire", "capire", "uscire", "aprire", "servire", "pulire", "costruire", "preferire", "dire", "venire", "seguire", "salire"] },
  { folge: "ato", stelle: "ende", woerter: ["gelato", "prato", "mercato", "stato", "passato", "parlato", "giocato", "mangiato", "andato", "amato", "cantato", "lavato"] },
  { folge: "ata", stelle: "ende", woerter: ["giornata", "serata", "passeggiata", "camminata", "insalata", "nevicata", "serenata", "entrata", "cascata", "risata"] },
  { folge: "ggio", stelle: "ende", woerter: ["viaggio", "formaggio", "raggio", "messaggio", "villaggio", "paesaggio", "coraggio", "vantaggio", "linguaggio", "passaggio", "maggio"] },
  { folge: "io", stelle: "ende", woerter: ["mio", "zio", "studio", "tempio", "esempio", "ufficio", "servizio", "silenzio", "orologio", "pomeriggio", "viaggio", "vecchio"] },
  { folge: "ia", stelle: "ende", woerter: ["via", "mia", "storia", "farmacia", "allegria", "magia", "geografia", "poesia", "fantasia", "compagnia", "malattia", "melodia", "pizzeria"] },
  { folge: "uo", stelle: "mitte", woerter: ["uomo", "buono", "cuore", "suono", "scuola", "nuovo", "fuoco", "luogo", "tuono", "uova", "cuoco", "nuoto", "vuoto", "duomo", "tuo", "suo"] },
  { folge: "ie", stelle: "mitte", woerter: ["miele", "fiera", "piede", "siepe", "pietra", "cielo", "dieci", "niente", "pieno", "viene", "tiene", "chiesa", "fiero"] },
  { folge: "ai", stelle: "mitte", woerter: ["mai", "sai", "fai", "hai", "vai", "stai", "aiuto", "baia", "paio", "gennaio", "febbraio", "fornaio", "pagaia"] },
  { folge: "ò", stelle: "ende", woerter: ["andò", "parlò", "però", "può", "ciò", "perciò", "sarò", "farò", "dirò", "andrò", "avrò"] },
  { folge: "tà", stelle: "ende", woerter: ["città", "università", "qualità", "libertà", "verità", "società", "attività", "felicità", "novità", "curiosità"] },
  { folge: "ì", stelle: "ende", woerter: ["così", "sì", "lì", "partì", "uscì", "capì", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì"] },
  { folge: "l'", stelle: "anfang", woerter: ["l'amico", "l'acqua", "l'ora", "l'anno", "l'uomo", "l'estate", "l'albero", "l'arte", "l'aria", "l'isola", "l'uovo", "l'ombra", "l'erba"] },
  { folge: "un'", stelle: "anfang", woerter: ["un'ora", "un'altra", "un'amica", "un'idea", "un'isola", "un'aula", "un'estate", "un'arancia"] },
  { folge: "dell'", stelle: "anfang", woerter: ["dell'acqua", "dell'anno", "dell'uomo", "dell'aria", "dell'arte", "dell'estate", "dell'isola", "dell'ora"] },
  { folge: "all'", stelle: "anfang", woerter: ["all'ora", "all'inizio", "all'aperto", "all'estero", "all'ombra", "all'aria", "all'altro"] },
  { folge: "d'", stelle: "anfang", woerter: ["d'estate", "d'oro", "d'argento", "d'acqua", "d'arte", "d'accordo", "d'inverno", "d'autunno"] },
];
