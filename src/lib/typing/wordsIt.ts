import type { InhaltsStufe } from "./account";

/**
 * Italienische Wortliste (Kleinschreibung) - das Gegenstück zu `WORDS` (`words.ts`), `WORDS_EN` (`corpusEn.ts`),
 * `WORDS_FR` (`wordsFr.ts`) und `WORDS_ES` (`wordsEs.ts`) für den Generator (Wort-Drill, Zeichen-Zeilen) und für die
 * Übungsformen, die ihren Vorrat über `wortquelle()`/`wortpool()` (`uebungsformen/hilfen.ts`) ziehen.
 *
 * ★ F5-F8 Italienisch (02.10.2026, Bauplan italienischer Lehrgang §4): bis hierher gab `wortquelle("it")` und
 * `WORD_BASE.it` das ENGLISCHE `WORDS_EN` (Marke `RÜCKFALL-EN (G2a)`) - eine italienische Übungszeile bestand dann
 * aus englischen Wörtern. Diese Liste ersetzt sie.
 *
 * ── Herkunft (GEMESSEN und von Hand zusammengestellt, nichts roh übernommen) ──────────────────────────────────────
 * 1. `scripts/messe-worthaeufigkeit-it.mts` zählt die Wortformen der italienischen Tatoeba-ORIGINALSÄTZE
 *    (`ita_sentences_base.tsv.bz2`: Spalte 2 = „0" ⇒ Original, 222.906 Sätze, 40.141 Wortformen - Übersetzungen zählen
 *    NICHT, Johannes' Regel „nichts wird übersetzt"; keine zusätzliche Wortliste geladen). Tatoeba ist kein Kinderkorpus
 *    (die häufigsten Wörter zeigen Übungsserien einzelner Beitragender: `andare`, `costruire`, `nazionalità`, Länder- und
 *    Gebäudelisten mit je 1.440 Belegen) - die Zählung dient als BELEG, dass ein Wort in Gebrauch ist, nicht als Auswahl.
 * 2. Die Auswahl ist HANDARBEIT nach der Tastenfolge von `IT_LETTER_ORDER` (lernweg.ts): je Sprosse genug
 *    Alltags- und Kinderwörter, damit jeder Stand des Lehrgangs echte Wörter hat (ab {@link REAL_WORD_FLOOR} = 40 passenden
 *    Wörtern fallen die Unsinnwörter ganz weg). Ohne dieses Vorgehen füllen die häufigen Buchstaben `i e o n r t` die ganze
 *    Liste, und `g h b z q y w x` blieben ohne eigenes Wort (für Spanisch gemessen).
 * 3. JEDES Wort besteht das macOS-Wörterbuch für Italienisch (`NSSpellChecker`, `scripts/woerterbuch-macos.js` mit der
 *    Vorsilbe `it:`; gemessen: ein Unsinnswort wie `qwxz` wird abgelehnt, `l'amico` angenommen, `lamico` abgelehnt) und
 *    steht nicht auf der Sperrliste (`sperrlisteIt.ts`: Schimpf-, Doppelsinn-, Blasphemie-, Kind-Schutzwörter; als
 *    EXAKTE Formen, nicht als Stämme - Lehre aus `sperrlisteEs.ts`). Wächter: `tests/tastenflow-it-woerter.test.ts`.
 *
 * ── Eigenschaften, die der Generator braucht ──────────────────────────────────────────────────────────────────────
 *  · Akzente sind Absicht: `à è é ì ò ù` sind eigene Einheiten (KEINE Totaste, Bauplan I3) - `filterWords` lässt ein Wort
 *    erst durch, wenn die Einheit freigeschaltet ist. Es gibt keinen Ersatz (`è` ⇒ `e` wäre ein anderes Wort): die neun
 *    Paare `e/è, da/dà, la/là, li/lì, ne/né, se/sé, si/sì, te/tè, di/dì` stehen mit beiden Formen in der Liste, jede erst
 *    ab ihrer Sprosse.
 *  · Der Apostroph `'` ist Einheit Nr. 26 (nach `è à`, F4-Messung: 7,7 % der Sätze). Wörter mit Elision (`l'amico`, `c'è`,
 *    `un'ora`, `dell'acqua`) und `po'` stehen darum erst ab dort zur Verfügung - der Generator kann vorher keine Elision
 *    erzeugen, weil `filterWords` jedes Zeichen gegen die freigeschalteten Einheiten prüft.
 *  · Regionalwörter (anguria/cocomero/mellone): nur die panitalienische Form (`cocomero`, nach Crusca).
 *  · Keine Eigennamen, keine Wörter mit `á í ó ú ä ö ü ñ ç` (auf `it` nicht tippbar), keine Ordnungszeichen `º ª`.
 *  · Kleinschreibung durchgehend; die Grossschreibung am Zeilenanfang setzt der Generator (`SENTENCE_CAP`).
 *
 * Grob geordnet nach der Sprosse, an der ein Wort vollständig tippbar wird (Zahl in Klammern = Wörter dieser Gruppe).
 */
export const WORDS_IT: string[] = [
  // Grundreihe f j d k s l a ò (14)
  "la", "da", "al", "fa", "sa", "ad", "alla", "dalla", "sala", "salsa", "falsa", "falda", "salda", "sfalda",
  // i e o n r t c u (285)
  "di", "il", "in", "io", "lo", "le", "li", "se", "ne", "ci", "ti", "si", "ed", "non", "un", "una", "uno", "tu",
  "lui", "lei", "noi", "sei", "era", "erano", "sono", "essere", "siete", "stato", "stati", "stata", "state", "fare",
  "fatto", "fatta", "detto", "dire", "dare", "dato", "data", "dati", "sta", "sto", "stai", "stare", "stanno",
  "tutto", "tutta", "tutti", "tutte", "ancora", "adesso", "allora", "ora", "ieri", "sera", "sotto", "dentro",
  "contro", "intorno", "tra", "fra", "con", "entro", "oltre", "ecco", "nessuno", "alcuno", "lento", "lenta", "tanto",
  "tanti", "tante", "tale", "tali", "unico", "unica", "uniti", "stesso", "stessa", "stessi", "stesse", "sola",
  "solo", "soli", "sole", "casa", "case", "cosa", "cose", "cena", "cane", "cani", "rana", "rane", "orso", "orsi",
  "luna", "notte", "notti", "nonno", "nonna", "nonni", "nonne", "donna", "donne", "strada", "strade", "treno",
  "treni", "cuore", "cuori", "cielo", "cieli", "sorella", "sorelle", "fratello", "fratelli", "scuola", "scuole",
  "aula", "aule", "classe", "classi", "sedia", "sedie", "fiore", "fiori", "foresta", "foreste", "isola", "isole",
  "terra", "terre", "tenda", "tende", "tetto", "tetti", "torre", "torri", "stella", "stelle", "ruota", "ruote",
  "arena", "aria", "area", "idea", "idee", "oro", "ore", "anno", "anni", "nodo", "nodi", "nido", "nidi", "sasso",
  "sassi", "sale", "scena", "scale", "scatola", "scatole", "lettera", "lettere", "tuono", "tuoni", "torta", "torte",
  "carta", "carte", "carro", "cartone", "cintura", "concerto", "cestino", "cucina", "cucine", "colore", "colori",
  "corsa", "corse", "corda", "corde", "cortile", "destra", "sinistra", "estate", "autunno", "ritorno", "tessera",
  "tessere", "sorriso", "sorrisi", "rosa", "rose", "rosso", "rossa", "rossi", "rosse", "nero", "nera", "neri",
  "nere", "turno", "strano", "strana", "strani", "rotto", "rotta", "rotti", "intero", "intera", "dolce", "dolci",
  "carino", "carina", "carini", "tesoro", "tesori", "sentiero", "sentieri", "sorte", "storia", "storie",
  "ristorante", "ristoranti", "andare", "andate", "andrete", "uscire", "uscita", "tornare", "torna", "tornano",
  "sorridere", "correre", "corre", "corrono", "cantare", "canta", "cantano", "sentire", "sentito", "scendere",
  "lettura", "dicono", "dico", "dici", "dite", "fanno", "faccio", "finire", "finisce", "finito", "tuta", "ciò",
  "andò", "sarò", "farò", "dirò", "andrò", "fuoco", "tocca", "toccare", "ricco", "ricca", "tecnica", "cuoco",
  "cuoca", "scritto", "scritta", "scritti", "jeans", "koala", "judo", "sassofono", "ok", "online", "internet",
  "radio", "foto", "auto", "tennis", "te",
  // m v p (mit Maj kommen die ersten ganzen Sätze) (340)
  "mi", "ma", "me", "mio", "mia", "mie", "miei", "molto", "molta", "molti", "molte", "mai", "male", "mare", "mari",
  "mano", "mani", "mamma", "mamme", "muro", "muri", "mela", "mele", "menta", "mese", "mesi", "mondo", "monte",
  "monti", "moto", "musica", "mattina", "mattino", "mercato", "minuto", "minuti", "medico", "medici", "maestra",
  "maestro", "maestri", "maestre", "mattone", "materia", "metro", "metri", "mulino", "matita", "matite", "marito",
  "madre", "madri", "mostro", "mostri", "mosca", "domani", "dimenticare", "amico", "amica", "amici", "amare",
  "amore", "amori", "camera", "camere", "come", "nome", "nomi", "uomo", "uomini", "numero", "numeri", "rumore",
  "rumori", "ritmo", "cima", "cime", "scimmia", "scimmie", "limone", "limoni", "formica", "fumo", "fumetto",
  "fumetti", "lumaca", "simile", "vi", "voi", "vero", "vera", "veri", "vere", "via", "vie", "viva", "vivo", "vivere",
  "vita", "vite", "voce", "voci", "volo", "voli", "volta", "volte", "vento", "venti", "verde", "verdi", "verso",
  "vedere", "vede", "vedo", "vedi", "vediamo", "venire", "viene", "vicino", "vicina", "vicini", "vino", "vini",
  "viso", "visto", "vista", "visita", "villa", "valle", "valli", "vaso", "vasi", "valore", "vestito", "vestiti",
  "vetro", "vetri", "violino", "verdura", "verdure", "vulcano", "uovo", "uova", "nuovo", "nuova", "nuovi", "nuove",
  "nave", "navi", "neve", "ovest", "vuoto", "vuota", "avere", "avete", "avevo", "aveva", "avuto", "davvero",
  "davanti", "dove", "dovere", "devo", "deve", "devi", "lavoro", "lavori", "lavare", "lava", "lavano", "serve",
  "servire", "avventura", "avvocato", "cervello", "vendere", "vende", "inverno", "invece", "invitare", "invito",
  "rivista", "riva", "rive", "estivo", "attivo", "attiva", "motivo", "motivi", "nuvola", "nuvole", "per", "poi",
  "pure", "pera", "pere", "pesce", "pesci", "pasta", "pane", "pace", "parte", "parti", "parola", "parole", "porta",
  "porte", "porto", "ponte", "ponti", "posto", "posti", "palla", "piano", "piede", "piedi", "pietra", "piccolo",
  "piccola", "piccoli", "piccole", "pulire", "pulita", "pulito", "pulce", "papa", "prato", "prati", "premio",
  "prima", "primo", "primi", "prime", "presto", "pronto", "pronta", "proprio", "prova", "provare", "pare", "parlare",
  "parla", "parlano", "partire", "parto", "passo", "passi", "passare", "pensare", "penso", "pensi", "pelo", "pena",
  "peso", "pesi", "pila", "pile", "pipa", "pista", "piste", "pittura", "pittore", "pomodoro", "pomodori", "popolo",
  "popoli", "ospite", "ospiti", "ospedale", "ospedali", "spesa", "spese", "sport", "spesso", "sapere", "sapete",
  "sopra", "supera", "super", "tappeto", "tappeti", "tempo", "tempi", "campo", "campi", "campana", "campane",
  "carpa", "capo", "capi", "capire", "capisco", "capito", "capelli", "cappello", "cappelli", "coperta", "coperte",
  "troppo", "troppa", "troppi", "dopo", "dopodomani", "oppure", "ripetere", "ripete", "rapido", "rapida", "sporco",
  "sporca", "stampa", "stampare", "stampante", "sempre", "spera", "sperare", "sperando", "però", "può", "perciò",
  "parlò", "avrò", "comò", "mucca", "poco", "poca", "pacco", "scrivere", "scrive", "scrivo", "tavolo", "tavola",
  "kimono", "stop", "film", "email", "computer", "mouse", "video", "tram",
  // g h b z (353)
  "leggere", "legge", "leggono", "inizio", "iniziare", "iniziato", "passeggiata", "gli", "gente", "grande", "grandi",
  "grosso", "grossa", "grossi", "gola", "gonna", "gomma", "gomito", "gradino", "grano", "grotta", "gruppo", "gufo",
  "guardare", "guarda", "guanto", "guerra", "gusto", "gelato", "gelati", "genitori", "gennaio", "gentile", "gesto",
  "giallo", "gialla", "gialli", "gialle", "giardino", "giardini", "gigante", "giocare", "gioca", "giocano", "gioia",
  "giovane", "giovani", "giugno", "giusto", "giusta", "giusti", "grave", "greco", "grigio", "grigia", "grido",
  "gridare", "gelo", "gemma", "genio", "geloso", "gesso", "getto", "gettare", "ghiro", "ghiaia", "ghirlanda",
  "gatto", "gatti", "gatta", "gamba", "gambe", "giorno", "giorni", "giro", "giri", "gioco", "giochi", "ho", "hai",
  "ha", "hanno", "che", "chi", "anche", "chiaro", "chiara", "chiave", "chiavi", "chiuso", "chiusa", "chiudere",
  "chiesa", "chiese", "chiamare", "chiama", "chiamo", "chilo", "chili", "chiedere", "chiede", "chiesto", "occhio",
  "occhi", "occhiali", "orecchio", "orecchie", "macchina", "macchine", "mucche", "bocche", "bianco", "bianca",
  "bianchi", "bianche", "banca", "banche", "barca", "barche", "fuochi", "luoghi", "lunghi", "lungo", "lunga",
  "lunghe", "largo", "larga", "larghi", "spiaggia", "spiagge", "righello", "scherzo", "scherzi", "schiena",
  "schiuma", "scheda", "schede", "poche", "pochi", "ricchi", "secchio", "secchi", "pacchi", "becco", "ghianda",
  "cuochi", "fischio", "fischi", "fischiare", "schiaffo", "orchestra", "architetto", "chitarra", "chitarre",
  "chilometro", "chilometri", "chimica", "chiodo", "chiodi", "bene", "bello", "bella", "belli", "belle", "bimbo",
  "bimba", "bimbi", "bambino", "bambina", "bambini", "bambine", "bacio", "baci", "balena", "balene", "balcone",
  "ballo", "ballare", "banco", "banchi", "bandiera", "bar", "barba", "base", "basso", "bassa", "bassi", "basta",
  "bastone", "battere", "battito", "bere", "beve", "bevo", "bevanda", "biblioteca", "bicchiere", "bicicletta",
  "bilancia", "binario", "biro", "biscotto", "biscotti", "blu", "bocca", "borsa", "borse", "bosco", "boschi",
  "bottiglia", "bottone", "braccio", "braccia", "bravo", "brava", "bravi", "breve", "brevi", "brillante", "briciola",
  "brodo", "bruco", "bruno", "buco", "buchi", "buio", "buona", "buono", "buoni", "buone", "burro", "bus", "busta",
  "buste", "abito", "abiti", "albero", "alberi", "ambiente", "cabina", "cibo", "cibi", "dubbio", "fabbrica", "fiaba",
  "fiabe", "labbro", "labbra", "libro", "libri", "libero", "libera", "liberi", "nebbia", "nobile", "nube", "nubi",
  "obiettivo", "ombra", "ombre", "ombrello", "ombrelli", "pubblico", "rabbia", "rubare", "sabato", "sabbia",
  "sbaglio", "sbagliare", "sbagliato", "scarabeo", "tabella", "albicocca", "gabbiano", "zio", "zia", "zii", "zie",
  "zaino", "zaini", "zebra", "zero", "zona", "zone", "zucca", "zucche", "zucchero", "zuppa", "zoo", "zanzara",
  "zampa", "zampe", "zattera", "zenzero", "zitto", "zitta", "azzurro", "azzurra", "azzurri", "grazie", "forza",
  "forze", "lezione", "lezioni", "pranzo", "stanza", "stanze", "vacanza", "vacanze", "spazio", "spazi", "azione",
  "azioni", "attenzione", "stazione", "stazioni", "nazione", "nazioni", "canzone", "canzoni", "colazione", "ragazzo",
  "ragazza", "ragazzi", "ragazze", "mezzo", "mezza", "mezzi", "mezzanotte", "tazza", "tazze", "piazza", "piazze",
  "palazzo", "palazzi", "pezzo", "pezzi", "pozzo", "razzo", "razzi", "terzo", "terza", "terzi", "zucchina",
  "zucchine", "zampogna", "pizza", "pizze", "tazzina", "jazz", "ketchup", "chef", "basket",
  // è (Akzent) (3)
  "caffè", "tè", "cioè",
  // à (Akzent) (24)
  "città", "università", "età", "libertà", "verità", "realtà", "società", "attività", "difficoltà", "possibilità",
  "comunità", "felicità", "novità", "già", "andrà", "sarà", "farà", "verrà", "avrà", "dà", "là", "papà", "bontà",
  "curiosità",
  // Apostroph ' (Elision) (62)
  "l'ho", "l'anno", "c'è", "l'uomo", "un'altra", "un'ora", "all'ora", "d'accordo", "c'era", "dov'è", "com'è",
  "cos'è", "l'amico", "l'amica", "un'amica", "un'idea", "un'isola", "un'aula", "l'albero", "l'ombra", "l'ombrello",
  "l'orso", "l'isola", "l'estate", "l'aria", "l'arte", "l'ora", "l'oro", "l'erba", "l'italiano", "l'inverno",
  "l'autunno", "l'uovo", "l'anima", "l'amore", "l'unico", "l'uso", "all'aperto", "all'inizio", "dall'altra", "po'",
  "mezz'ora", "d'estate", "d'oro", "d'argento", "d'arte", "s'è", "n'è", "c'entra", "anch'io", "nient'altro",
  "sull'albero", "dell'anno", "dell'uomo", "nell'aria", "all'estero", "un'estate", "un'arancia", "l'arancia",
  "un'aranciata", "l'insegnante", "l'amicizia",
  // q (58)
  "qualità", "l'acqua", "dell'acqua", "quest'anno", "nell'acqua", "quell'uomo", "qui", "qua", "quando", "quanto",
  "quanta", "quanti", "quale", "quali", "quasi", "quello", "quella", "quelli", "quelle", "questo", "questa",
  "questi", "queste", "qualche", "qualcosa", "qualcuno", "quadro", "quadri", "quaderno", "quaderni", "quattro",
  "quarto", "quarta", "quindici", "quinto", "quieto", "quiete", "quota", "quote", "quercia", "querce", "questione",
  "questioni", "acqua", "acque", "aquila", "aquile", "aquilone", "equatore", "equilibrio", "tranquillo",
  "tranquilla", "pasqua", "squadra", "squadre", "cinque", "cinquanta", "cinquecento",
  // é (Akzent) (12)
  "perché", "né", "sé", "finché", "poiché", "benché", "affinché", "ventitré", "trentatré", "sicché", "purché",
  "anziché",
  // ì (Akzent) (15)
  "così", "sì", "lì", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "partì", "uscì", "capì", "finì",
  "colibrì", "bensì", "dì",
  // ù (Akzent) (13)
  "più", "giù", "virtù", "gioventù", "tribù", "laggiù", "lassù", "quaggiù", "menù", "ragù", "bambù", "tabù",
  "servitù",
  // y w x (Fremdwörter) (24)
  "yogurt", "yoga", "yacht", "hobby", "rugby", "kiwi", "kayak", "jolly", "web", "wifi", "weekend", "wafer", "taxi",
  "extra", "xilofono", "sax", "mixer", "box", "ex", "relax", "pony", "party", "baby", "hockey",
];


/**
 * Alters-gestufter Bonus-Wortschatz (Italiano) - das Gegenstück zu `STUFE_VOCAB_FR`/`STUFE_VOCAB_ES` für
 * `stufeVocab()` (`generator.ts`).
 *
 * ★ F6-it (02.10.2026, Bauplan §3 „Texte"): von Hand NEU auf Italienisch zusammengestellt (nicht aus `STUFE_VOCAB`/
 * `STUFE_VOCAB_EN` übersetzt), nach den Themen des Bauplans - Kinder: Schule, Tiere (Alpen bis Meer), Natur,
 * Essen (pasta, pizza, gelato), Feste (carnevale, befana, presepe), Orte (Baita, Gondel, Campanile); Jugend:
 * Freundschaft, Schule, Musik, Sport (auch Paralympics-Sportarten), Technik, Umwelt, Berufswahl, Reisen mit dem Zug;
 * Erwachsene: Arbeit, Behörden, Wohnen, Gesundheit, Migration, Kultur. Variantenneutral (keine Wörter, die nur in
 * einer Region gelten: `cocomero` statt anguria/mellone), alle Wörter bestehen das macOS-Wörterbuch und die Sperrliste
 * (`sperrlisteIt.ts`); Nord, Mitte, Süd, Inseln, Tessin, Südtirol (Bauplan D3) kommen über die Dinge vor, nicht über
 * Eigennamen (die Liste führt keine). Wächter: `tests/tastenflow-it-woerter.test.ts`.
 */
export const STUFE_VOCAB_IT: Record<InhaltsStufe, string[]> = {
  kids: [
    "scuola", "quaderno", "zaino", "matita", "gomma", "astuccio", "lavagna", "maestra", "maestro", "compagno",
    "compagna", "ricreazione", "banco", "merenda", "cortile", "cartella", "penna", "disegno", "favola", "racconto",
    "gatto", "cane", "coniglio", "tartaruga", "farfalla", "formica", "ape", "lumaca", "riccio", "scoiattolo",
    "passero", "cicogna", "delfino", "balena", "pesce", "rondine", "gufo", "lupo", "orso", "volpe", "leone",
    "elefante", "giraffa", "pecora", "mucca", "cavallo", "gallina", "maiale", "camoscio", "marmotta", "stambecco",
    "nuvola", "pioggia", "arcobaleno", "montagna", "fiume", "lago", "mare", "spiaggia", "conchiglia", "sabbia",
    "onda", "vulcano", "bosco", "prato", "giardino", "parco", "altalena", "scivolo", "pallone", "bicicletta",
    "aquilone", "bambola", "giocattolo", "trenino", "pasta", "pizza", "gelato", "focaccia", "biscotto", "mela",
    "pera", "fragola", "arancia", "limone", "cocomero", "mandarino", "castagna", "panettone", "colomba", "carciofo",
    "ciliegia", "carnevale", "maschera", "coriandoli", "befana", "presepe", "regalo", "torta", "candeline", "festa",
    "cugino", "cugina", "tamburello", "chitarra", "fisarmonica", "zampogna", "neve", "ghiacciaio", "baita", "malga",
    "slitta", "faro", "barca", "pescatore", "vela", "gondola", "tram", "funivia", "castello", "piazza", "campanile",
    "fontana", "mercato", "lava", "cratere",
  ],
  teens: [
    "amicizia", "fiducia", "rispetto", "segreto", "scherzo", "compagnia", "compito", "interrogazione", "verifica",
    "pagella", "voto", "ricerca", "progetto", "biblioteca", "laboratorio", "esperimento", "scienza", "geografia",
    "matematica", "concerto", "canzone", "batteria", "cantante", "festival", "telefono", "schermo", "messaggio",
    "applicazione", "videogioco", "cuffie", "squadra", "allenamento", "partita", "campionato", "gara", "vittoria",
    "sconfitta", "arbitro", "allenatore", "calcio", "pallavolo", "nuoto", "atletica", "ginnastica", "medaglia",
    "clima", "ambiente", "riciclo", "plastica", "inquinamento", "siccità", "energia", "solare", "futuro", "sogno",
    "scelta", "mestiere", "tirocinio", "treno", "stazione", "binario", "viaggio", "ostello", "avventura", "campagna",
  ],
  erwachsen: [
    "ufficio", "riunione", "azienda", "cliente", "stipendio", "fattura", "imposta", "banca", "economia", "governo",
    "comune", "anagrafe", "certificato", "modulo", "domanda", "permesso", "contratto", "affitto", "condominio",
    "quartiere", "bolletta", "sanità", "ospedale", "medico", "visita", "ricetta", "terapia", "pensione",
    "previdenza", "sindacato", "elezioni", "cittadino", "cittadina", "giustizia", "uguaglianza", "solidarietà",
    "democrazia", "immigrazione", "integrazione", "accoglienza", "lingua", "cultura", "patrimonio", "museo",
    "teatro", "cinema", "giornale", "notizia", "intervista", "università", "laurea", "trasporto", "traffico",
    "ferrovia", "autostrada", "agricoltura", "artigianato", "commercio", "turismo",
  ],
};
