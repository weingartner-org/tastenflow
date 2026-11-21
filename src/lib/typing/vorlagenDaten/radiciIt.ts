/**
 * „Radici e prestiti" - das italienische Gegenstück zu `raices.ts` (Spanisch), `racines.ts`
 * (Französisch), `wordRoots.ts` (Englisch) und `fremdwoerter.ts` (Deutsch): eine ÜBUNGSVORLAGE zum
 * Abschreiben für den Lernweg „it". Jede Zeile lautet `<indizio> - <parola>`; wer abschreibt, lernt
 * nebenbei, woher ein Wort kommt.
 *
 * ★ IT-S (03.10.2026): Aufbau wie `RAICES` (drei Altersstufen, 80 Paare je Stufe, 240 zusammen), aber
 * FÜNF Themen, weil das Italienische seine Wörter aus anderen Quellen hat als das Spanische: Inhalt neu
 * auf Italienisch zusammengestellt und geschrieben - nichts übersetzt (Johannes: *„keine texte werden
 * übersetzt"*, *„die texte sollen einen bezug zum land und sprache haben"*).
 *
 * ── Themen (je Stufe) ─────────────────────────────────────────────────────
 *  • „Radici greche e latine" (20) - der Schulwortschatz, dazu Wörter mit Bezug zum Land: das
 *    Acquedotto und das Anfiteatro der Römer, der Vulcano (Etna, Vesuvio), die Zampogna des Südens,
 *    der Catasto aus dem byzantinischen Griechisch.
 *  • „Parole che vengono dall'arabo" (15) - Sizilien, Venedig und die Häfen (zagara, cassata, zibibbo,
 *    carrubo, arsenale, darsena, dogana, zecca …).
 *  • „Parole dei popoli germanici" (15) - Langobarden, Goten, Franken (guancia, schiena, panca,
 *    bianco, guerra, albergo …) und das heutige Deutsch aus Südtirol und den Alpen (strudel, speck,
 *    krapfen, stambecco, alabarda).
 *  • „Parole arrivate da lontano" (15) - aus den Sprachen Amerikas (cioccolato, cacao, mais, avocado,
 *    caucciù), dem Französischen (ragù, mangiare, treno), Englischen, Spanischen, Türkischen,
 *    Japanischen und weiter.
 *  • „Parole nate in Italia" (15) - aus den Dialekten (ciao und calle aus Venedig, grissino aus dem
 *    Piemont, scugnizzo und sfizio aus Neapel, intrallazzo aus Sizilien, nuraghe aus Sardinien, trullo
 *    aus Apulien), aus Ortsnamen (lavagna, magenta, parmigiano, gorgonzola, jeans), aus der Schweiz
 *    (natel) und dem Ladinischen, aus Kunst und Kino (arlecchino, paparazzo).
 *
 * ── Belege (GELESEN, nicht erinnert) ─────────────────────────────────────
 * Jede Herkunft wurde am 03.10.2026 an der Rohseite von it.wiktionary.org gelesen (`action=raw`,
 * Abschnitt `{{-etim-}}` der Sprache Italienisch); die Seitenadresse steht bei jedem Paar in `beleg`.
 * Hat ein Wort mehrere Bedeutungen (*zecca*, *lama*, *piano*, *vulcano*, *delfino*), gilt die
 * Etymologie der gemeinten. Wörter mit „etimologia incerta", „forse", „probabilmente", mehreren
 * Theorien oder ohne Seite fielen heraus (*pizza, zio, gondola, albicocca, tabacco, zabaione, torrone,
 * bottarga, camoscio, supplì …*) - lieber weniger und belegt. Geprüfte und verworfene Wörter: Befund
 * `BEFUND-2026-10-02-IT-RADICI-EXPEDITION-LEKTIONEN.md`.
 * `origine` nennt die Sprache, die die Seite als Ursprung angibt (*caffè*: vom Türkischen, ursprünglich
 * Arabisch ⇒ „arabo"; *arsenale*: vom Venezianischen, ursprünglich Arabisch ⇒ „arabo"); nur für die
 * Lehrkraft, beim Abtippen nicht gezeigt.
 *
 * ── Zeilenregeln (Wächter: `tests/tastenflow-vorlage-radici-it.test.ts`) ───────────────────────────
 * - höchstens 40 Zeichen (Braillezeile), genau ein Trenner ` - `;
 * - `parola` ein Einzelwort, klein; `indizio` enthält es nicht;
 * - kein Wort doppelt, in keiner Stufe und über die Stufen hinweg;
 * - kein Wort der Sperrliste `gesperrtIt` (Kern UND Wortbasis), weder in `parola` noch in `indizio`;
 * - nur Zeichen, die `it` UND `it-qzerty` tippen (keine grossen Akzentbuchstaben, ASCII-Apostroph).
 */

export type RadiceStufe = "kids" | "teens" | "erwachsen";

/** Nur ein Hinweis für die Lehrkraft - wird beim Abtippen nicht gezeigt. */
export type RadiceOrigine =
  | "greco" | "greco-bizantino" | "latino" | "preromano"
  | "arabo" | "persiano"
  | "longobardo" | "gotico" | "franco" | "germanico" | "tedesco"
  | "nahuatl" | "quechua" | "arawak" | "caribe" | "guarani"
  | "spagnolo" | "portoghese" | "francese" | "svizzero-romanzo" | "inglese"
  | "turco" | "ceco" | "giapponese" | "cinese" | "hindi" | "polinesiano" | "australiano"
  | "veneziano" | "veneto" | "ligure" | "piemontese" | "lombardo" | "milanese"
  | "napoletano" | "siciliano" | "meridionale" | "sardo" | "romancio"
  | "italiano" | "luogo" | "nome-proprio";

export interface RadicePaar {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  indizio: string;
  /** Das Wort selbst - ein Einzelwort. */
  parola: string;
  origine: RadiceOrigine;
  /** Die it.wiktionary-Seite, an der `origine` gelesen wurde (CC BY-SA 4.0). */
  beleg: string;
}

export interface RadiceTema {
  id: string;
  titel: string;
  paare: RadicePaar[];
}

export const RADICI_TEMI: readonly { id: string; titel: string }[] = [
  { id: "greco-latino", titel: "Radici greche e latine" },
  { id: "arabo", titel: "Parole che vengono dall'arabo" },
  { id: "germanico", titel: "Parole dei popoli germanici" },
  { id: "lontano", titel: "Parole arrivate da lontano" },
  { id: "italia", titel: "Parole nate in Italia" },
];

function w(parola: string): string {
  return `https://it.wiktionary.org/wiki/${parola}`;
}

function p(indizio: string, parola: string, origine: RadiceOrigine): RadicePaar {
  return { indizio, parola, origine, beleg: w(parola) };
}

export const RADICI: Record<RadiceStufe, RadiceTema[]> = {
  // ------------------------------------------------------------ kids (8-11)
  kids: [
    { id: "greco-latino", titel: "Radici greche e latine", paare: [
      p("parli con chi è lontano", "telefono", "greco"),
      p("rettile gigante di un tempo", "dinosauro", "greco"),
      p("cavallo di fiume africano", "ippopotamo", "greco"),
      p("mostra ciò che è minuscolo", "microscopio", "greco"),
      p("figura con tre angoli", "triangolo", "latino"),
      p("grande fuoco all'aperto", "falò", "greco"),
      p("forma delle celle delle api", "esagono", "greco"),
      p("studia monti, fiumi e paesi", "geografia", "greco"),
      p("tanti libri in prestito", "biblioteca", "greco"),
      p("gira intorno al Sole", "pianeta", "latino"),
      p("animale che mangia carne", "carnivoro", "latino"),
      p("beve latte da cucciolo", "mammifero", "latino"),
      p("vive in acqua e sulla terra", "anfibio", "greco"),
      p("cocomero, rosso e succoso", "anguria", "greco"),
      p("immagine fatta con la luce", "fotografia", "greco"),
      p("segna le ore", "orologio", "greco"),
      p("vola con le pale che girano", "elicottero", "greco"),
      p("ha otto braccia e vive in mare", "polpo", "greco"),
      p("ci vai a imparare", "scuola", "greco"),
      p("canale romano per l'acqua", "acquedotto", "latino"),
    ] },
    { id: "arabo", titel: "Parole che vengono dall'arabo", paare: [
      p("rende dolce il tè", "zucchero", "arabo"),
      p("agrume succoso della Sicilia", "arancia", "arabo"),
      p("agrume giallo e aspro", "limone", "arabo"),
      p("ortaggio verde e spinoso", "carciofo", "arabo"),
      p("è viola, va nella parmigiana", "melanzana", "arabo"),
      p("medicina dolce per la tosse", "sciroppo", "arabo"),
      p("fibra bianca per le magliette", "cotone", "arabo"),
      p("ha il collo lunghissimo", "giraffa", "arabo"),
      p("antilope veloce della savana", "gazzella", "arabo"),
      p("ci bevi il latte la mattina", "tazza", "arabo"),
      p("lo suoni con le bacchette", "tamburo", "arabo"),
      p("giovane, non più bambino", "ragazzo", "arabo"),
      p("dolce siciliano con ricotta", "cassata", "arabo"),
      p("spezia gialla del risotto", "zafferano", "arabo"),
      p("fiore bianco dell'arancio", "zagara", "arabo"),
    ] },
    { id: "germanico", titel: "Parole dei popoli germanici", paare: [
      p("parte del viso sotto l'occhio", "guancia", "longobardo"),
      p("parte dietro del corpo", "schiena", "longobardo"),
      p("sedile lungo per tante persone", "panca", "longobardo"),
      p("il colore della neve", "bianco", "germanico"),
      p("scalda la mano d'inverno", "guanto", "germanico"),
      p("terreno con fiori e prato", "giardino", "germanico"),
      p("dolce di mele dell'Alto Adige", "strudel", "tedesco"),
      p("dolce fritto e ripieno", "krapfen", "tedesco"),
      p("protegge la testa del cavaliere", "elmo", "gotico"),
      p("sporge dalla facciata di casa", "balcone", "longobardo"),
      p("bolle bianche sull'acqua", "schiuma", "longobardo"),
      p("fare rumore mentre si dorme", "russare", "longobardo"),
      p("capra delle Alpi", "stambecco", "tedesco"),
      p("casa delle mucche", "stalla", "germanico"),
      p("battere alla porta", "bussare", "longobardo"),
    ] },
    { id: "lontano", titel: "Parole arrivate da lontano", paare: [
      p("dolce scuro fatto col cacao", "cioccolato", "nahuatl"),
      p("semi da cui nasce il cioccolato", "cacao", "nahuatl"),
      p("frutto con la corona di foglie", "ananas", "guarani"),
      p("vento fortissimo che gira", "uragano", "arawak"),
      p("barca stretta da remare", "canoa", "spagnolo"),
      p("letto appeso tra due alberi", "amaca", "spagnolo"),
      p("grande lucertola verde", "iguana", "caribe"),
      p("grande rapace delle Ande", "condor", "spagnolo"),
      p("minuscolo e vola sul posto", "colibrì", "spagnolo"),
      p("latte fermentato e cremoso", "yogurt", "turco"),
      p("lo metti per andare a letto", "pigiama", "persiano"),
      p("macchina che lavora da sola", "robot", "ceco"),
      p("salta e ha il marsupio", "canguro", "australiano"),
      p("corre sui binari", "treno", "francese"),
      p("ci parcheggi l'auto", "garage", "francese"),
    ] },
    { id: "italia", titel: "Parole nate in Italia", paare: [
      p("saluto nato a Venezia", "ciao", "veneziano"),
      p("ci scrivi col gesso in classe", "lavagna", "luogo"),
      p("antica torre della Sardegna", "nuraghe", "sardo"),
      p("casa col tetto a cono in Puglia", "trullo", "greco"),
      p("maschera vestita a rombi", "arlecchino", "nome-proprio"),
      p("casa di pastori in montagna", "malga", "preromano"),
      p("gara di barche", "regata", "veneziano"),
      p("formaggio fresco del Sud", "mozzarella", "meridionale"),
      p("bastoncino di pane croccante", "grissino", "piemontese"),
      p("dolce freddo d'estate", "gelato", "italiano"),
      p("pasta lunga e sottile", "spaghetti", "italiano"),
      p("strumento a tasti bianchi e neri", "piano", "italiano"),
      p("colore rosso porpora", "magenta", "luogo"),
      p("dolce di Natale di Milano", "panettone", "milanese"),
      p("strada stretta di Venezia", "calle", "veneziano"),
    ] },
  ],
  // ------------------------------------------------------------ teens (12-16)
  teens: [
    { id: "greco-latino", titel: "Radici greche e latine", paare: [
      p("le piante usano la luce", "fotosintesi", "greco"),
      p("scienza dell'ambiente", "ecologia", "greco"),
      p("il potere al popolo", "democrazia", "greco"),
      p("studia i resti antichi", "archeologia", "greco"),
      p("studia i fossili", "paleontologia", "greco"),
      p("cornamusa del Sud Italia", "zampogna", "greco"),
      p("stesso significato", "sinonimo", "greco"),
      p("significato contrario", "antonimo", "greco"),
      p("conversazione tra due persone", "dialogo", "greco"),
      p("firma di una persona famosa", "autografo", "greco"),
      p("senza il nome dell'autore", "anonimo", "greco"),
      p("malattia che si diffonde", "epidemia", "greco"),
      p("idea da verificare", "ipotesi", "greco"),
      p("scrittura corretta", "ortografia", "greco"),
      p("elemento che forma l'acqua", "idrogeno", "greco"),
      p("la Luna copre il Sole", "eclissi", "greco"),
      p("come l'Etna o il Vesuvio", "vulcano", "latino"),
      p("come l'Arena di Verona", "anfiteatro", "greco"),
      p("figura fatta di tessere", "mosaico", "latino"),
      p("linea tra cielo e terra", "orizzonte", "greco"),
    ] },
    { id: "arabo", titel: "Parole che vengono dall'arabo", paare: [
      p("il numero del niente", "zero", "arabo"),
      p("segno che scrive un numero", "cifra", "arabo"),
      p("matematica con le lettere", "algebra", "arabo"),
      p("comanda una flotta", "ammiraglio", "arabo"),
      p("cantiere navale di Venezia", "arsenale", "arabo"),
      p("controllo al confine", "dogana", "arabo"),
      p("vento caldo e umido da sud", "scirocco", "arabo"),
      p("vento da sud-ovest", "libeccio", "arabo"),
      p("grande vaso per l'olio", "giara", "arabo"),
      p("il colore della Nazionale", "azzurro", "persiano"),
      p("ci ti siedi in salotto", "divano", "arabo"),
      p("antico strumento a corde", "liuto", "arabo"),
      p("si beve al bar in tazzina", "caffè", "arabo"),
      p("parte dietro del collo", "nuca", "arabo"),
      p("piatto di semola a chicchi", "cuscus", "arabo"),
    ] },
    { id: "germanico", titel: "Parole dei popoli germanici", paare: [
      p("il contrario della pace", "guerra", "germanico"),
      p("pausa nei combattimenti", "tregua", "gotico"),
      p("chi sorveglia un posto", "guardia", "gotico"),
      p("dove si esibiscono gli attori", "palco", "longobardo"),
      p("dove si deposita il denaro", "banca", "germanico"),
      p("tanti alberi insieme", "bosco", "germanico"),
      p("tornare in salute", "guarire", "germanico"),
      p("stima di sé, fierezza", "orgoglio", "franco"),
      p("ci dormi in vacanza", "albergo", "gotico"),
      p("ballo a tre tempi", "valzer", "tedesco"),
      p("cristallo duro e trasparente", "quarzo", "tedesco"),
      p("salume affumicato altoatesino", "speck", "tedesco"),
      p("metallo delle grondaie", "zinco", "tedesco"),
      p("organo vicino allo stomaco", "milza", "longobardo"),
      p("serve a catturare un animale", "trappola", "franco"),
    ] },
    { id: "lontano", titel: "Parole arrivate da lontano", paare: [
      p("frutto verde e cremoso", "avocado", "nahuatl"),
      p("gomma naturale degli alberi", "caucciù", "quechua"),
      p("griglia all'aperto", "barbecue", "spagnolo"),
      p("dà una lana fine sulle Ande", "alpaca", "spagnolo"),
      p("felino delle montagne d'America", "puma", "quechua"),
      p("cereale della polenta", "mais", "arawak"),
      p("piccolo negozio all'aperto", "chiosco", "turco"),
      p("onda enorme dal mare", "tsunami", "giapponese"),
      p("canti leggendo il testo", "karaoke", "giapponese"),
      p("fetta di carne alla griglia", "bistecca", "inglese"),
      p("sugo di carne per la pasta", "ragù", "francese"),
      p("foresta tropicale fitta", "giungla", "hindi"),
      p("bevanda calda dalla Cina", "tè", "cinese"),
      p("ci scrivi e navighi in rete", "computer", "inglese"),
      p("agrume di Calabria", "bergamotto", "turco"),
    ] },
    { id: "italia", titel: "Parole nate in Italia", paare: [
      p("ragazzino vivace di Napoli", "scugnizzo", "napoletano"),
      p("roccia in mezzo al mare", "scoglio", "ligure"),
      p("piccolo capriccio, voglia", "sfizio", "napoletano"),
      p("pantaloni di tela blu", "jeans", "luogo"),
      p("fotografo a caccia di vip", "paparazzo", "nome-proprio"),
      p("disegno su un muro", "graffito", "italiano"),
      p("dolcetti dei matrimoni", "confetti", "italiano"),
      p("dolce al caffè e mascarpone", "tiramisù", "italiano"),
      p("caffè con latte e schiuma", "cappuccino", "italiano"),
      p("formaggio da grattugiare", "parmigiano", "luogo"),
      p("lingua delle Dolomiti", "ladino", "romancio"),
      p("il cellulare in Ticino", "natel", "tedesco"),
      p("lingua della Sardegna", "sardo", "latino"),
      p("bibita amara di agrumi", "chinotto", "italiano"),
      p("dolce natalizio a stella", "pandoro", "italiano"),
    ] },
  ],
  // ------------------------------------------------------------ erwachsen
  erwachsen: [
    { id: "greco-latino", titel: "Radici greche e latine", paare: [
      p("amore per la sapienza", "filosofia", "greco"),
      p("amore per il genere umano", "filantropia", "greco"),
      p("studio dell'essere umano", "antropologia", "greco"),
      p("governo di pochi", "oligarchia", "greco"),
      p("governo di un sovrano", "monarchia", "greco"),
      p("cambiamento di forma", "metamorfosi", "greco"),
      p("vita in comune con vantaggio", "simbiosi", "greco"),
      p("origine delle parole", "etimologia", "greco"),
      p("cittadino del mondo", "cosmopolita", "greco"),
      p("registro dei terreni", "catasto", "greco-bizantino"),
      p("che vuole il bene", "benevolo", "latino"),
      p("navigare tutto intorno", "circumnavigare", "latino"),
      p("tutti dello stesso parere", "unanime", "latino"),
      p("di animo grande e generoso", "magnanimo", "latino"),
      p("predominio di uno sugli altri", "egemonia", "greco"),
      p("assenza di emozioni", "apatia", "greco"),
      p("parla molte lingue", "poliglotta", "greco"),
      p("sentire ciò che prova un altro", "empatia", "greco"),
      p("cosa fuori dal suo tempo", "anacronismo", "greco"),
      p("idea contro il senso comune", "paradosso", "greco"),
    ] },
    { id: "arabo", titel: "Parole che vengono dall'arabo", paare: [
      p("bacino interno del porto", "darsena", "arabo"),
      p("prezzo fissato per un servizio", "tariffa", "arabo"),
      p("sostanza nera e appiccicosa", "catrame", "arabo"),
      p("calendario con notizie", "almanacco", "arabo"),
      p("punto del cielo sopra di noi", "zenit", "arabo"),
      p("punto opposto allo zenit", "nadir", "arabo"),
      p("misura di oro e diamanti", "carato", "arabo"),
      p("albero dai baccelli dolci", "carrubo", "arabo"),
      p("magazzino dei mercanti", "fondaco", "arabo"),
      p("antica tassa sulle merci", "gabella", "arabo"),
      p("dove si coniano le monete", "zecca", "arabo"),
      p("quaderno per gli appunti", "taccuino", "arabo"),
      p("uva dolce di Pantelleria", "zibibbo", "arabo"),
      p("drappo sopra un trono", "baldacchino", "arabo"),
      p("mediatore di affari", "sensale", "arabo"),
    ] },
    { id: "germanico", titel: "Parole dei popoli germanici", paare: [
      p("osso davanti alla gamba", "stinco", "longobardo"),
      p("giuntura delle dita", "nocca", "longobardo"),
      p("fango molle", "melma", "longobardo"),
      p("pezzo di terra compatta", "zolla", "tedesco"),
      p("guida le ruote dell'auto", "sterzo", "longobardo"),
      p("vernice dura e lucida", "smalto", "franco"),
      p("nodo in gola di tristezza", "magone", "germanico"),
      p("casa misera e cadente", "stamberga", "longobardo"),
      p("odore cattivo di chiuso", "tanfo", "longobardo"),
      p("capigliatura folta e lunga", "zazzera", "longobardo"),
      p("lite noiosa, fastidio", "bega", "gotico"),
      p("bottiglia rivestita di paglia", "fiasco", "gotico"),
      p("mercenario tedesco", "lanzichenecco", "tedesco"),
      p("alzare i bicchieri insieme", "brindisi", "tedesco"),
      p("arma della Guardia Svizzera", "alabarda", "tedesco"),
    ] },
    { id: "lontano", titel: "Parole arrivate da lontano", paare: [
      p("insieme di navi", "flotta", "francese"),
      p("rifiuto organizzato", "boicottaggio", "inglese"),
      p("danno fatto apposta", "sabotaggio", "francese"),
      p("casa di legno in montagna", "chalet", "svizzero-romanzo"),
      p("aria di superiorità", "sussiego", "spagnolo"),
      p("sciolto e sicuro di sé", "disinvolto", "spagnolo"),
      p("uova di storione", "caviale", "turco"),
      p("argomento proibito", "tabù", "polinesiano"),
      p("gioielli di poco valore", "bigiotteria", "francese"),
      p("dolce di pasta cotta e ripiena", "bignè", "francese"),
      p("baccello che profuma i dolci", "vaniglia", "spagnolo"),
      p("pezzetto d'oro grezzo", "pepita", "spagnolo"),
      p("insetto che dà il rosso", "cocciniglia", "spagnolo"),
      p("fecola della manioca", "tapioca", "portoghese"),
      p("galleria sotto un monte", "tunnel", "inglese"),
    ] },
    { id: "italia", titel: "Parole nate in Italia", paare: [
      p("accordo nascosto, intrigo", "inciucio", "napoletano"),
      p("furto con strappo", "scippo", "napoletano"),
      p("traffico poco pulito", "intrallazzo", "siciliano"),
      p("ospedale delle epidemie", "lazzaretto", "luogo"),
      p("fetta di vitello con l'osso", "ossobuco", "milanese"),
      p("formaggio con venature blu", "gorgonzola", "luogo"),
      p("fallimento di un'impresa", "bancarotta", "italiano"),
      p("febbre delle zone paludose", "malaria", "italiano"),
      p("guida turistica che spiega", "cicerone", "nome-proprio"),
      p("crostaceo dalle chele lunghe", "scampo", "veneziano"),
      p("crema di nocciole e cacao", "gianduia", "piemontese"),
      p("piccolo pesce azzurro", "acciuga", "ligure"),
      p("pallina di pasta morbida", "gnocco", "veneto"),
      p("formaggio cremoso lombardo", "mascarpone", "lombardo"),
      p("carne secca della Valtellina", "bresaola", "lombardo"),
    ] },
  ],
};

/** Die Zeile eines Paares: zuerst die Umschreibung, dann das Wort. */
export function radiceZeile(x: RadicePaar): string {
  return `${x.indizio} - ${x.parola}`;
}

/**
 * Dieselben Wörter, alphabetisch nach `indizio` (italienische Sortierung) - für die Sfida, wie
 * `RAICES_ALPHABETISCH` (raices.ts).
 */
export const RADICI_ALFABETICO: Record<RadiceStufe, string[]> = Object.fromEntries(
  (Object.keys(RADICI) as RadiceStufe[]).map((stufe) => [
    stufe,
    RADICI[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indizio.localeCompare(b.indizio, "it"))
      .map(radiceZeile),
  ]),
) as Record<RadiceStufe, string[]>;
