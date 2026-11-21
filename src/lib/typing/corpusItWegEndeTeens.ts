/**
 * Korpus nur für Lernweg "it", späte Sprossen (Satzzeichen, Ziffern,
 * Sonderzeichen) - Altersstufe Teens, Jugendliche 12-16 (IT-T8, 03.10.2026,
 * Bauplan `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §1 D2-D4, I7-I9, I19,
 * §3, §5; Befund `BEFUND-2026-10-02-IT-T8-TEENS-ENDE.md`; Vorgehen nach Befund
 * IT-T1 §6, Form wie ES-T8).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF ITALIENISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz
 * (darum kein `herkunft`). Keine Zeile der Chargen T1-T5 ist kopiert oder nur
 * abgewandelt - der Wächter prüft Text, Ledger-Schlüssel, Paare und „fast gleich".
 *
 * ZEICHENSATZ (`introOrder("it")`, gemessen; auf `it` und `it-qzerty` gleich bis 68):
 *   37-44  ? ! " : ; - ( )      (alle weglassbar, Klammern als festes Paar: eine
 *                                Zeile mit Klammer erscheint erst an `)`, 44)
 *   45-54  1 2 3 4 5 6 7 8 9 0  (hart: vorher nie serviert)
 *   55-68  % & / + * = _ < > $ | € @ #   (hart)
 *   69-70  `it`: [ ]  ·  `it-qzerty`: { }   (die andere Tastatur hat das Paar nicht:
 *                                fitText lässt die Zeile dort an KEINER Sprosse durch)
 * Die Sprosse einer Zeile ist die, ab der sie VOLLSTÄNDIG erscheint. `? !` sind
 * auf Weg „it" weglassbar, nicht hart (Befund IT-T4 §2): vor ihrer Sprosse kommt
 * eine Zeile ohne sie an. Darum trägt JEDE Zeile einen Buchstaben ab `g`
 * (g h b z è à ' q é ì ù y w x) - früh serviert erscheint sie frühestens in den
 * Runden der Mitte-Chargen, nie vor Maiusc (Auto-Grossschreibung) und nie in
 * den frühen Runden von T2. Weg „it" hat keine Frühfassungen: nach einem
 * mittleren `?`/`!` beginnt der nächste Satz darum mit einem Namen (Wächter:
 * kein fremder Grossbuchstabe mitten in einer früh servierten Fassung).
 * `minTier` gerechnet von `minTierFor(text, "it")`, nicht von Hand.
 *
 * FORM: Satzanfang gross, Namen und Orte gross; kein Leerzeichen vor `? ! : ;`
 * (GLOSSAR §1 Nr. 7); gerade Anführungszeichen `"…"` (I7), wörtliche Rede nur
 * mit ihnen (I8), ein Gedankenstrich ist ein Bindestrich mit Leerzeichen; keine
 * grossen Akzentbuchstaben (I4), kein `º ª °` (I9). Zahlen (I19): Uhrzeit mit
 * Doppelpunkt (16:45), `€` nach der Zahl mit Leerzeichen (3 €), `%` direkt an der
 * Zahl (10%), keine Dezimalzahl, keine Tausender ausser Jahreszahlen. `€` nur in
 * Zeilen, die in Italien oder San Marino spielen - im Tessin gilt der Franken
 * (Fallen Bauplan §5 Nr. 7).
 *
 * ALTERSGEMÄSS 12-16 (Bauplan §3, Themenfeld der Jugend; Feste, Nationalfeiertage
 * und Geschichte gehören den Chargen T7/T9 - Falle 51): Sport mit Paralympics
 * (nur Belegtes aus `recherche-italienisch-2026-10-02/texte-quellen.md` §4:
 * Assunta Legnante London 2012, Milano Cortina 2026, Parigi 2024; dazu
 * Cristoforetti), Musik heute, Technik (Excel, Python, Linux, CSS,
 * Adressen, Hashtags - die Sonderzeichen gehören dorthin), Umwelt, Berufswahl,
 * Freundschaft, Reisen (Bus, Fähre, Flug, Rad - das Wort „treno" ist über die
 * Jugend-Chargen aufgebraucht).
 *
 * BEZUG ZU LAND UND SPRACHE - Italien in seiner Breite, der Norden NICHT vorne
 * (Wächter: Süden, Inseln und Tessin/Graubünden je mindestens so oft wie der
 * Norden; Mitte und Südtirol nah dran; San Marino): Wörter aus den Regionen in
 * Anführungszeichen (talìa, daje, guagliò, ajò, natel, servus), Bozen/Bolzano,
 * Ladinisch in Val Badia und Ortisei, Zweisprachigkeit im Aostatal, „cancelletto"
 * und „chiocciola" als italienische Namen von `#` und `@`, Franken im Tessin.
 * ★ Merge 03.10.2026 mit T6/T9: sechs Zeilen ersetzt, die dort wortgleich oder
 * fast gleich standen (Vorwahlen, Gianotti, Ballarò, Tabelle mit |, Name von #).
 *
 * Wächter: `tests/tastenflow-texte-it-teens-ende.test.ts`. Nur anhängen -
 * Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_IT_WEG_ENDE_TEENS: CorpusItem[] = [
  // ── Sprosse 37 (?) ──
  { text: "Chi viene al torneo di pallavolo sulla sabbia a Pescara sabato pomeriggio?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Hai già scaricato l'orario dei bus per Bressanone?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mi presti il caricabatterie, che il mio è rimasto a casa?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Quanto ci vuole in bici da Locarno fino a Gordola?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Hai mai visto il tramonto dalla rocca di Cefalù?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Dove si prende la navetta per l'aeroporto di Catania?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Chi porta le casse per la musica in spiaggia a Diamante?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ti va di provare il surf a Buggerru, sulla costa sarda?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ti piacerebbe lavorare come fisioterapista con gli atleti?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Quale app usi per ripassare i verbi irregolari inglesi?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Chi ha voglia di pulire il bosco sopra Biasca domenica mattina?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A che ora apre la piscina comunale di Reggio Calabria?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Perché il wifi della biblioteca di Perugia è sempre così lento?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Hai ascoltato il podcast sulle api della Val Venosta?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Mi aiuti a montare la tenda in Valle di Blenio?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Chi suona la batteria nella band di tuo cugino a Foggia?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Hai già deciso quale indirizzo sceglierai alle superiori?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Hai assaggiato la focaccia di Recco quando eri in Liguria?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Chi ha preso il mio quaderno di chimica?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Quando apre la pista di pattinaggio in piazza a Brunico?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Sei entrata nella staffetta di nuoto di Ragusa?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Vieni a vedere i fenicotteri alle saline di Cagliari?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Chi mi spiega gli esercizi di geometria per domani?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A San Marino si gioca davvero a baseball?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Quanto costa il traghetto da Piombino all'isola d'Elba?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Hai visto quanta gente c'era al festival del cinema di Locarno?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Come si chiama quella band di Bari che canta reggae in dialetto?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ti va un giro in kayak fino alle grotte di Palinuro?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Sai chi ha vinto la gara di slalom ieri a Bormio?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ti serve una mano con la presentazione di storia dell'arte?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Chi ha lasciato lo skateboard in mezzo al corridoio?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Perché non proviamo il corso di danza hip hop al centro giovani di Brindisi?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 38 (!) ──
  { text: "Che bello, oggi niente compiti!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Forza, ragazze, l'ultimo set è nostro!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Che vista dalla cima del Monte Generoso!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ce l'abbiamo fatta, siamo in finale al torneo di Trapani!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Tanti auguri, Nadia, sedici candeline sono un bel traguardo!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Che freddo stamattina alla fermata di Vipiteno!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Sbrigati, il pullman per Otranto sta partendo!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Che emozione suonare per la prima volta al teatro di Salerno!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Bravissima, Chiara, hai battuto il tuo record nei cento metri!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Silenzio in sala, il film sta per cominciare!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Finalmente si parte per la gita in Val di Non!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Che buona la granita alla mandorla di Noto!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Attenzione, il ghiaccio sul laghetto è ancora sottile!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Basta con le bottiglie di plastica in mensa!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Grazie, Federica, senza i tuoi appunti non ce l'avrei fatta!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Che spettacolo il lago di Lugano visto dal Monte Brè!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ho trovato un lavoretto del sabato in una gelateria di Riccione!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Mamma mia, che caldo oggi ad Agrigento!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Dai, ancora un giro di corsa e poi andiamo a casa!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Che bella la neve sul Gran Sasso!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ho preso otto in latino, non ci credo!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Che fortuna, abbiamo trovato posto sul traghetto per Stromboli!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Alla fine il concerto a Bellinzona è stato fantastico!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Evviva, da lunedì la biblioteca di Iglesias apre anche la sera!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Benvenuti alla gara di scherma di Merano!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Che forte la nuova pista da skate di Cosenza!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Che gol, Martina, da metà campo!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ho finalmente imparato a saltare con lo skate!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 39 (") ──
  { text: "A Palermo \"talìa\" significa \"guarda\".", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Roma per fare coraggio a qualcuno si dice \"daje\".", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Napoli \"guagliò\" è il modo di chiamare un ragazzo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "In Ticino il telefonino lo chiamano \"natel\".", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "In Sardegna \"ajò\" vuol dire \"andiamo\".", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "\"Ci sei per il lavoro di gruppo?\", mi scrive Ilaria.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "\"Che ansia!\", dice Marco prima dell'interrogazione.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La prof di musica ci ha detto \"bravi\" dopo il saggio.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Sul mio zaino c'è una spilla con scritto \"non mollare\".", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La chat del calcetto si chiama \"quelli del giovedì\".", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "\"Ci vediamo in stazione\", dice Matteo, ma poi arriva tardi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Sul cartello del rifugio c'è scritto \"acqua non potabile\".", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "In chat Samir scrive sempre \"top\" quando qualcosa gli piace.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "\"Domani c'è la verifica?\", chiede Asia nella chat della sezione.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La parola \"computer\" in italiano non cambia al plurale.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "La parola \"ciao\" viene dal dialetto veneziano.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Bolzano sui cartelli c'è scritto sia \"Bozen\" sia \"Bolzano\".", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "In Alto Adige molti ragazzi salutano con \"servus\".", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 40 (:) ──
  { text: "Il mio zaino per il campeggio: tenda, sacco a pelo e torcia.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Le cose che non dimentico mai: chiavi, cuffie e abbonamento del bus.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il programma del weekend a Lipari: spiaggia, trekking e granita.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La mia playlist ha un po' di tutto: rap, indie e cantautori.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Una cosa l'ho capita: ripassare un po' ogni sera funziona.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "In Val Verzasca c'è un posto magico: il Ponte dei Salti a Lavertezzo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Le regole della nostra chat sono semplici: rispetto e niente spoiler.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Bressanone ho comprato tutto per la montagna: scarponi, zaino e borraccia.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Pantelleria ho assaggiato due cose buonissime: il cuscus e i capperi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il problema del motorino è chiaro: la batteria è scarica.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ogni sabato a Pesaro faccio le stesse cose: basket e pizza con gli amici.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il mio sogno per la maturità: girare la Sardegna in bici.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Brunico a gennaio si sente una cosa sola: il freddo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Al mercato di Ortigia compro sempre le stesse cose: pane, olive e ricotta.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Mendrisio abbiamo un appuntamento fisso: la corsa nel bosco della domenica.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "In laboratorio abbiamo un obiettivo: un robot che raccoglie la plastica.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Mia sorella ha deciso: vuole diventare ostetrica.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Dalla terrazza di Ostuni si vede tutto: ulivi, case bianche e mare.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Gubbio ho scoperto una cosa: anche in Umbria ci sono montagne vere.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Le tappe del nostro viaggio in Calabria: Tropea, Pizzo e Scilla.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 41 (;) ──
  { text: "Io gioco a calcio; mia sorella preferisce l'atletica.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Lugano piove da giorni; a Palermo invece c'è il sole.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il primo tempo è andato male; nel secondo abbiamo segnato due gol.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Alcuni vanno in bici; altri prendono il vaporetto dal Lido.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ho studiato tutto il pomeriggio; adesso mi merito una pizza.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Marta suona il basso; Omar canta e scrive i testi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Cosenza la sera fa fresco; giù a Soverato si fa ancora il bagno.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il mio telefono è scarico; ti chiamo da quello di Giorgio.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Non ho vinto la gara; però ho migliorato il mio tempo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "In Val Badia molti parlano ladino in famiglia; con gli amici anche italiano.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il concerto è finito tardi; siamo tornati a casa a mezzanotte.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A luglio aiuto in un chiosco al porto di Olbia; a settembre torno sui libri.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Alcuni amano il rap; io preferisco la musica barocca.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Bellinzona c'è il sole; sul passo del San Bernardino nevica.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ad Ancona il mare è vicino; a Urbino ci sono le colline.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 42 (-) ──
  { text: "Prendo il bus Bellinzona-Locarno tutte le mattine.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "La partita di basket Sassari-Cagliari è finita ai supplementari.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Ortisei ho comprato un dizionario ladino-tedesco.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il volo Olbia-Torino dura poco più di un'ora.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La ciclabile Bolzano-Merano è perfetta per allenarsi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Con la matematica ho un rapporto amore-odio.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il traghetto Napoli-Palermo viaggia di notte.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Pedaliamo sulla ciclabile Alghero-Fertilia al tramonto.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Con la mia migliore amica ho un'amicizia a distanza Taranto-Bergamo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Sabato - se non piove - andiamo al lago di Bolsena.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il sentiero Agerola-Positano ha una vista pazzesca sul mare.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "In Valle d'Aosta il bilinguismo italiano-francese si vede sui cartelli.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La barca Vieste-Tremiti parte presto, quindi sveglia all'alba.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La sfida prof-studenti di calcetto si gioca a fine maggio.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 44 ()) ──
  { text: "Bressanone (in tedesco Brixen) ha un centro storico bellissimo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il mio migliore amico (quello che vive a Lecce) arriva domani.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La gara di sci (se c'è neve) si fa a Plan de Corones.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Domani ho due ore di laboratorio (chimica e fisica).", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ho finito il libro (finalmente) e stasera guardo il film.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "La mia band (siamo in quattro) prova nel garage di mio zio.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Lugano si paga in franchi (non in euro).", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il lago di Braies (in Val Pusteria) ad agosto è pieno di turisti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Lampedusa (più vicina alla Tunisia che alla Sicilia) ha spiagge incredibili.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il mio corso di inglese (online) comincia alle sette.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Nel girone (otto squadre in tutto) siamo arrivati terzi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Le torri di San Marino (Guaita, Cesta e Montale) si vedono da lontano.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "La Sila (in Calabria) d'inverno si copre di neve.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La mia vicina (la conosci anche tu) fa l'apprendista falegname a Giubiasco.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La Mole Antonelliana (il simbolo di Torino) ospita il museo del cinema.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il Verbano (cioè il lago Maggiore) bagna anche Locarno.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 45 (1) ──
  { text: "Ho 11 messaggi non letti nel gruppo del calcetto.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Alle 11 apre la piscina all'aperto di Alghero.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ci vediamo al binario 1 della stazione di Brunico.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho fatto 111 flessioni in una settimana.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La sala 1 del cinema di Cosenza è la più grande.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La linea 11 ci lascia davanti al palazzetto di Chieti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Domenica alle 11 c'è la gara di nuoto al centro sportivo di Tenero.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il negozio di dischi di Arezzo apre alle 11.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 46 (2) ──
  { text: "La verifica di storia è martedì 12.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Sono le 12 e la mensa è già piena.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La partita di calcetto è finita 2 a 1 per noi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Dopo la gita a Canazei ho dormito 12 ore.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il corso di robotica a Udine dura 12 settimane.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nella compagnia di teatro di Viterbo siamo in 12.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho 2 biglietti per il concerto di sabato a Teramo, vieni?", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Mia cugina di Oristano ha compiuto 12 anni ieri.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Oggi a Enna ci sono 12 gradi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il pullman 21 passa ogni 12 minuti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 47 (3) ──
  { text: "La lezione di chitarra comincia alle 13 in punto.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Abbiamo vinto 3 a 2 in rimonta a Trento!", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il pullman 32 ci porta fino al lido di Catania.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Sono 3 giorni che piove a Locarno.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La sfida di scacchi online è durata 23 minuti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il podcast della nostra radio ha già 123 ascoltatori.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Al campeggio in Maremma eravamo in 23.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 48 (4) ──
  { text: "Alle 14 c'è il pullman per Campobasso.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho 14 anni e suono il sassofono nella banda di Sulmona.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La partita è finita 4 a 2 per la squadra di Brunico.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il mio record al cubo di Rubik è di 41 secondi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel coro di Mendrisio siamo in 24.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Al torneo di scacchi di Trapani ci sono 34 iscritti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Abbiamo camminato per 4 ore sulla Sila.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Mi mancano 4 capitoli per finire il romanzo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 49 (5) ──
  { text: "Si parte alle 5 per vedere l'alba sull'Etna.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho 15 anni e la domenica aiuto mio zio nella sua pasticceria di Modica.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il film comincia alle 21:15 al cinema di Parma.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Mancano 15 minuti alla fine dell'intervallo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il Frecciarossa per Salerno parte dal binario 15.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nella mia squadra di rugby a Benevento siamo in 25.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il mio record di apnea è di 45 secondi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Al mercatino di Lugano ho trovato 5 vecchi vinili.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho letto 15 libri da settembre.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 50 (6) ──
  { text: "Alle 6 suona la sveglia per l'allenamento di nuoto.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il pullman per Gubbio passa alle 16:45.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In palestra a Potenza facciamo 3 serie da 16 piegamenti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La corsa campestre di Spoleto è lunga 6 chilometri.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho risparmiato per 6 mesi per comprarmi la chitarra.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Mio fratello ha preso 26 all'esame di fisica a Pisa.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho 16 anni e sto imparando a riparare le biciclette.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "A Bressanone ci sono 6 ragazzi nuovi nella mia sezione.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 51 (7) ──
  { text: "Mia sorella ha 17 anni e si allena per la maratona di Firenze.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Alle 7 in punto passa la corriera per Ascoli.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Mi sono alzata alle 6:47 per vedere l'alba a Polignano.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Siamo saliti per 7 chilometri fino al rifugio sopra Cortina.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nella mia playlist ci sono 172 canzoni.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La mia nonna di Nuoro ha 77 primavere e balla ancora il ballo sardo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Abbiamo vinto 7 a 5 la finale di pallamano a Bolzano.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Le ragazze dell'hockey di Chiasso giocano alle 17.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho 7 ore di laboratorio a settimana all'istituto tecnico.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 52 (8) ──
  { text: "La prima campanella è alle 8.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Mia cugina di Lecco ha 18 anni e ha appena preso la patente.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La linea 48 porta al palazzetto di Siena.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Abbiamo raccolto 85 chili di plastica sulla spiaggia di Marsala.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nella partita di basket ad Avellino abbiamo segnato 78 punti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel gruppo di arrampicata di Arco siamo 8 ragazze.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho 8 cugini in Calabria e 3 in Svizzera.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 53 (9) ──
  { text: "Il mio bisnonno è del 1939 e usa lo smartphone meglio di me.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho segnato 19 punti stasera al palazzetto di Catanzaro.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "L'autopostale delle 19:45 per Locarno è sempre pieno.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel gruppo di lettura di Macerata siamo in 9.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In pagella ho 9 in inglese e 8 in scienze!", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Alle 9 ci troviamo davanti alla stazione di Ancona.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il primo impianto di Ortisei apre alle 9:15.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Mio zio di Messina ha una barca a vela di 9 metri.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il nostro volo per Lampedusa è durato 59 minuti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 54 (0) ──
  { text: "Ci vediamo alle 13:30 davanti alla gelateria di Viareggio.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La biblioteca di Bergamo apre alle 14:30.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La gara di sci di fondo a Poschiavo comincia alle 8:30.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel 2012, a Londra, Assunta Legnante è salita sul gradino più alto del podio.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Le Paralimpiadi di Milano Cortina si sono svolte a marzo del 2026.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Alle Paralimpiadi di Parigi 2024 l'Italia ha vinto 71 medaglie.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Samantha Cristoforetti nel 2022 è diventata comandante della stazione spaziale.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Mio cugino ha fatto la mezza maratona di Salerno nel 2025.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Sono nata nel 2010 a Siracusa.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Mio fratello è nato nel 2013 a Roveredo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Abbiamo raccolto 200 firme per la pista ciclabile ad Avellino.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "A 10 anni ho imparato a nuotare nelle acque di Tropea.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La piscina olimpionica è lunga 50 metri.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Abbiamo pedalato 40 chilometri lungo il Ticino fino a Bellinzona.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Alle 20:30 inizia la sfida di hockey a Merano.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel 2026 ho guardato tutto il Festival di Sanremo con mia nonna.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il canto a tenore è patrimonio UNESCO dal 2008.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Da Lugano a Milano ci sono circa 80 chilometri.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il mio quartiere di Bari ha un campo da basket nuovo dal 2020.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 55 (%) ──
  { text: "Il mio telefono è al 10%, ti scrivo dopo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho finito il 70% del progetto di tecnologia.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Con lo sconto del 20% le scarpe da corsa costano poco.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La batteria del monopattino è al 50%.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nella mia sezione il 30% arriva a piedi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho risposto bene al 95% delle domande del quiz di geografia.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Oggi ad Airolo c'è il 100% di probabilità di pioggia.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il 50% della mia playlist è rap napoletano.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 56 (&) ──
  { text: "Il negozio di dischi di Catania si chiama Vinili & Caffè.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "R&B è il genere preferito di mia sorella.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel codice abbiamo scritto && per unire le due condizioni.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Lo studio di grafica di mia zia a Mendrisio si chiama Linea & Colore.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il bar del lido di Rimini si chiama Sabbia & Sole.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La nostra band si chiama Onde & Rocce.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il centro giovani di Lecce organizza Rap & Poesia ogni giovedì.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 57 (/) ──
  { text: "A Bologna il limite in molte strade è di 30 km/h.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La verifica è il 15/10, segnatelo sul diario.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho salvato i file nella cartella compiti/storia.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho risolto 3/4 degli esercizi di fisica.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La chat di studio è attiva 24/7.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Porta una felpa e/o un k-way per l'uscita a Vipiteno.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il sito della biblioteca di Cagliari è www.example.it/orari.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Scrivo i voti in una tabella: 7/10 in storia e 8/10 in arte.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 58 (+) ──
  { text: "Nel gruppo della classe Matteo risponde sempre con un +1.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Sul termometro di Campobasso stamattina c'erano solo +2 gradi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel videogioco ho guadagnato +500 punti esperienza.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Lo ione sodio si scrive Na+.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La mia media è salita: +1 in inglese.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In classifica abbiamo +6 punti sulle ragazze di Brindisi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Sul cartellone del cinema di Trento c'è scritto 14+.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 59 (*) ──
  { text: "Nel foglio di calcolo 5*4 vuol dire cinque per quattro.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "I campi con * sono obbligatori nel modulo di iscrizione.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel menù del bar di Ostuni i piatti con * sono vegani.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In chat metto le parole tra *asterischi* per scriverle in grassetto.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La password appare come ****** sullo schermo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In Python 2**3 fa 8.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nella classifica, l'asterisco * indica le squadre ripescate.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 60 (=) ──
  { text: "In Excel scrivo =SOMMA(A1:A5) per sommare i voti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La formula =MEDIA(B2:B9) mi dà la media delle verifiche.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Se x + 4 = 10, allora x = 6.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In Python scrivo punti = 0 all'inizio del gioco.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel codice, a == b controlla se due valori sono uguali.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "L'area del triangolo è A = b * h / 2.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Al corso di Python di Catania abbiamo scritto livello = 1.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 61 (_) ──
  { text: "Sul forum di scacchi mi chiamo torre_nera.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho salvato il file come ricerca_vulcani.docx.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel gioco online il mio clan è lupi_della_sila.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In Python le variabili si scrivono così: voto_finale.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Completa la frase: Cagliari si trova nel sud della ____.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Le foto sono nella cartella gita_Siena.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il nome utente di mio fratello è skate_bari.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 62 (<) ──
  { text: "Ti mando un <3 per il gol di ieri.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Se il voto è < 6, la prof ti fa recuperare.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La temperatura a Livigno è < 0 da una settimana.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Se x < 0, il numero è negativo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel codice uso if punti < 10 per controllare il livello.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La pendenza della ciclabile di Lucca è < 2%.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In matematica il segno < si legge \"minore di\".", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 63 (>) ──
  { text: "Nella mia classifica: pizza napoletana > pizza al taglio.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Filtro i voti > 8 nel foglio di calcolo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Montagna > mare, almeno per me che vivo a Bressanone.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il tag <b> mette il testo in grassetto.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nei miei appunti la freccia -> vuol dire quindi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Se x > 5, il programma stampa \"bravo\".", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Per me il gelato di Bronte > qualsiasi altro gelato.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 64 ($) ──
  { text: "In Excel il riferimento $A$1 blocca la cella.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In PHP le variabili cominciano con $, come $nome.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "A New York mia cugina paga $3 per un caffè.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Negli Stati Uniti quel videogioco costa $60.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel terminale di Linux $HOME indica la cartella personale.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Mio zio di Toronto dice che lì un panino si paga $8.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel gioco di ruolo le monete d'oro si scrivono con $.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 65 (|) ──
  { text: "Il menù del sito: Home | Chi siamo | Contatti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il valore assoluto |-5| è uguale a 5.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel mio profilo ho scritto: Biasca | pallamano | fotografia.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In Linux la barra | collega un comando all'altro.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Sul diario ho segnato i turni: Asia | Omar | Lukas.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Sulla tastiera italiana il simbolo | sta sopra la barra rovesciata.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il mio orario del lunedì: latino | storia | ginnastica.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 66 (€) ──
  { text: "A Roma un trancio di pizza al taglio costa circa 3 €.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "A Pescara con 10 € prendo pizza e bibita.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il biglietto per lo spettacolo al teatro antico di Taormina costa 45 €.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "A San Marino si paga in euro: un gelato costa circa 3 €.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il giro in barca alle Egadi costa 30 € per gli studenti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il noleggio della bici a Ravenna costa 8 € al giorno.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho venduto la vecchia chitarra per 80 € a un ragazzo di Caserta.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Per le lezioni di surf a Siniscola paghiamo 25 € l'ora.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "A Bologna ho comprato un fumetto usato a 4 €.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 67 (@) ──
  { text: "Scrivimi a giulia.serra@example.it per il progetto.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La mail del club di scherma di Ancona è info@example.org.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel messaggio metto @Davide per avvisarlo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La chiocciola @ è il simbolo di ogni indirizzo email.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il centro giovani di Bellinzona risponde a ciao@example.ch.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il mio profilo da fotografo è @scatti_dal_sud.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Per il torneo di Sassari scrivete a torneo@example.it.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho aperto un nuovo indirizzo: luca.skate@example.it.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 68 (#) ──
  { text: "Ho postato le foto della spiaggia pulita con #mareliberodaplastica.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Sul tastierino premi # per confermare.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In Python il simbolo # serve per scrivere un commento.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Il canale #compiti del server della sezione è sempre pieno.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Sulla tastiera italiana il cancelletto # si fa con AltGr e à.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel calcetto porto la maglia #10.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Ho scritto il post con #Ticino per far vedere i laghi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Le foto della serata jazz a Trapani sono sotto #musicadalvivo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── Sprosse 70 (]), it-qzerty nie ──
  { text: "In Python la lista voti = [7, 8, 9] contiene i voti del trimestre.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In una citazione scrivo [...] quando taglio una parte.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel mio codice amici[0] è il nome del mio migliore amico.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La playlist del viaggio è [reggae, indie, pop].", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nella mappa del gioco [A] è la partenza e [B] l'arrivo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel dizionario la pronuncia sta tra parentesi quadre [ ].", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel programma la lista [8, 9, 10] tiene i voti di Lukas.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nella ricerca ho messo le fonti tra parentesi quadre, come [1] e [2].", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  // ── nur it-qzerty: Sprosse 70 (}) - auf it gibt es keine geschweiften Klammern ──
  { text: "In JavaScript un blocco di codice va tra { e }.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "L'insieme A = {1, 2, 3} ha tre elementi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel CSS scrivo p {color: red} per colorare il testo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In matematica le vocali si scrivono come insieme: {a, e, i, o, u}.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "L'oggetto {nome: \"Luca\"} contiene un dato.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "La lista dei miei sport è {nuoto, scherma, sci}.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "Nel nostro programma {} indica un dizionario vuoto.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
  { text: "In matematica l'insieme vuoto si può scrivere anche { }.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "it" },
];
