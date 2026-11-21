/**
 * Korpus nur für Lernweg "it", mittlere Sprossen - Altersstufe Teens,
 * Jugendliche 12-16 (IT-T5, 03.10.2026, Bauplan
 * `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §1 D2-D4, §3, §5; Befund
 * `BEFUND-2026-10-02-IT-T5-TEENS-MITTE.md`; Vorgehen nach Befund IT-T1 §6).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF ITALIENISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz
 * (darum kein `herkunft`). Tatoeba (nur Originalsätze) diente als WORTLISTE.
 * Keine Zeile der Kinder-Charge T1 (`corpusItWegFruehKids.ts`) ist kopiert oder
 * nur abgewandelt - der Wächter prüft Text, Ledger-Schlüssel und Paare.
 *
 * ZEICHENSATZ (`lernweg.ts` `IT_LETTER_ORDER`; „Sprosse" = Anzahl gelernter
 * Einheiten von `introOrder("it")`). Die zwei Pflicht-Tastaturen rechnen
 * VERSCHIEDEN (F4-it, `achteGrundtasten`):
 *   Einheit   `it` (Windows/Mac Pro)   `it-qzerty` (Mac „Italian")
 *   ⇧         20                        19   (auf der QZERTY fehlt `m` vor ⇧)
 *   . ,       21 22                     20 21  (weglassbar - keine eigene Zeile)
 *   g h b z   23-26                     22-25
 *   è à '     27-29                     26-28
 *   q é ì     30-32                     29-31
 *   ò         8 (Grundreihe)            32   (nach ì)
 *   ù y w x   33-36                     33-36
 * Die Sprosse einer Zeile ist die kleinste, an der `fitText` sie durchlässt,
 * mindestens die ⇧-Sprosse. Grossbuchstaben lässt `fitText` über die
 * Auto-Grossschreibung schon vor ⇧ durch (corpus.ts, KERNREGEL; D-3 für Kinder
 * und Jugendliche): jede ⇧-Zeile trägt darum ein `p` (die letzte Einheit vor
 * ⇧, auf beiden Tastaturen) - so kommt sie höchstens EINE Sprosse vor ⇧, nie in
 * die frühen Runden der Jugend-Charge T2 (Wächter). Eine Zeile mit `ò` steht auf
 * der QZERTY erst an Sprosse 32 (nach `ì`); die fünf `ò`-Zeilen tragen darum
 * alle ein `ì` (Lunedì andrò …) und stehen auf beiden Tastaturen am Ende von ì.
 * `minTier` gerechnet von `minTierFor(text, "it")`, nicht von Hand.
 *
 * FORM: Satzanfang gross, Namen und Orte gross, Punkt am Satzende, Komma wo es
 * hingehört (D-1: `. ,` direkt nach ⇧ - vorher lässt `fitText` sie weg). Keine
 * Frage- und Ausrufezeichen, keine Anführungszeichen, kein Bindestrich, keine
 * Ziffern (sie kommen ab Sprosse 37, Charge T8). Kein grosser Akzentbuchstabe
 * (`È` ist unter Windows nie tippbar, I4). Vor `è` (27) kein „è", vor `'` (29)
 * keine Elision (kein „l'", „c'è", „un'"), vor `q` (30) kein „qui/questo/
 * squadra/acqua", vor `é` kein „perché", vor `ì` kein „così/lunedì", vor `ù`
 * kein „più". ★ An der Apostroph-Sprosse trägt JEDE Zeile eine Elision
 * (l'estate, un'amica, c'è, d'inverno, dall'Alto Adige, po') - sonst übt ein
 * Kind den Apostroph dort kaum (Befund IT-T1 §3a).
 *
 * ALTERSGEMÄSS 12-16 (Bauplan §3, Themenfeld der Jugend): Sport auch Paralympics
 * (Bebe Vio, Assunta Legnante, Oney Tapia, Giacomo Bertagnolli - nur Gesichertes),
 * Musik heute (rap in napoletano, techno, hip hop, pizzica, canto a tenore),
 * Technik ohne Moralkeule (wifi, podcast, app, Linux, webcam), Umwelt (ghiacciaio,
 * siccità, spiaggia pulita, tartarughe a Lampedusa), Berufswahl (alberghiero,
 * apprendista, infermiera, geologa, regista, astronauta), Freundschaft, Reisen
 * mit dem Zug (Frecciarossa, regionale, Gottardo, trenino rosso del Bernina).
 *
 * BEZUG ZU LAND UND SPRACHE - Italien in seiner Breite, der Norden NICHT vorne
 * (Wächter: Norden höchstens so oft wie Süden, Inseln, Tessin/Graubünden, je
 * eigene Mindestzahl für Südtirol, Mitte und San Marino): Süden (Napoli, Matera,
 * Lecce, Taranto, Altamura, Abruzzo …), Inseln (Palermo, Lampedusa, Cagliari,
 * Nuoro, Mazara, Lipari, Cefalù …), Tessin und italienisches Graubünden
 * (Bellinzona, Leventina, Chiasso, Ceresio, Poschiavo, Bernina, Mesolcina),
 * Südtirol (Bolzano, Bressanone, Brunico, Val Gardena, Val Venosta, San Candido),
 * San Marino (Monte Titano), Mitte (Siena, Lucca, Perugia, Orvieto, Urbino …).
 * Die Sprache selbst: il sardo, il siciliano, il ladino, rap in napoletano,
 * „In Toscana il papà si chiama babbo" (Crusca, Geosynonym), Zweisprachigkeit in
 * Südtirol und Graubünden. Namen aus vielen Familien (Amira, Karim, Ahmed,
 * Fatima, Mohamed, Yasmine, Ivan, Leonie, Wolfgang …).
 *
 * Wächter: `tests/tastenflow-texte-it-teens-mitte.test.ts`. Nur anhängen -
 * Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_IT_WEG_MITTE_TEENS: CorpusItem[] = [
  // ── Sprosse 20 (⇧ Maiusc - Namen und Orte, Buchstaben bis p, jede Zeile mit p (QZERTY 19)) ──
  { text: "Marta prende il pullman per Napoli.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Sara suona il pianoforte a Palermo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Trapani il vento soffia forte.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Elena studia per diventare infermiera.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Lucia corre i cento metri in pista.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Pietro crea un sito per il torneo di calcio.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Sofia fa nuoto a Pescara.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Davide vende dolci per la festa di fine anno.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Locarno Matteo impara a fare vela.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Anna prende il primo pullman da Mendrisio.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Martina scia sopra Vipiteno.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Dario fa sci di fondo in Val Pusteria.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Irene arrampica sulle rocce sopra Ortisei.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Alessia suona il violino a Padova.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Tommaso rema sul Po a Torino.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Carla fa un podcast sul cinema.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Riccardo monta video per il suo canale.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Noemi ascolta rap in napoletano.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ilaria tifa per il Palermo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Federico ripassa per la verifica di matematica.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Teresa porta il cane al parco dopo cena.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Marco e Nina partono per Airolo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Silvia ripara il motorino del nonno.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Luca impara il sardo dalla nonna a Nuoro.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il pullman per Siracusa parte in ritardo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Elisa lavora in un lido a Positano.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Prendo il Frecciarossa per Roma.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Mattia sale a piedi sul Monte Titano.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Fa freddo, metto la sciarpa.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 23 (+g (QZERTY 22)) ──
  { text: "Nicola parte per Lampedusa con i compagni.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Giulia gioca a pallavolo a Cagliari.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Giorgia segna due gol a Lecce.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ginevra scrive testi rap in siciliano.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Diego sogna di giocare in serie A.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il primo giorno di liceo Greta era agitata.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Andiamo in gita a Matera.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il regionale per Foggia arriva tardi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Giacomo gioca a calcetto a Sassari.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Leggo un fumetto giapponese.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Giada vuole fare la geologa.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Nel gruppo di classe arrivano mille messaggi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Genova Edoardo impara a navigare.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Pedaliamo lungo il lago fino ad Ascona.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ad agosto nuotiamo nel mare di Gallipoli.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ogni autunno Lucca ospita una grande fiera dei fumetti.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Asia vuole studiare ingegneria a Pisa.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il giornale del liceo esce ogni mese.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Agata gioca a pallanuoto a Catania.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "In Leventina il treno sale verso il Gottardo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Leonie fa un corso di grafica a Merano.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ivan legge manga in metro a Roma.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 24 (+h - che, chi, anche, ho/ha (QZERTY 23)) ──
  { text: "Chiara ha una chitarra elettrica.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Michele fa hip hop a Taranto.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il ghiacciaio della Marmolada si ritira.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ho perso il regionale per Chiasso.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Che caldo oggi a Crotone.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Chi viene al concerto mi scrive in chat.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Sami ha sedici anni e vive a Pistoia.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Michela lavora in un hotel ad Alghero.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Fatima ha imparato il siciliano a Palermo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Anche Enrico ama la musica techno.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Achille fa esperimenti di chimica.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ho finito i compiti, ora esco.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Hanno aperto una pista di skate a Messina.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il trenino rosso passa da Poschiavo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Mohamed allena i pulcini a Prato.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Al fischio finale cantiamo tutti.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Chiedo un consiglio alla prof di arte.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Lampedusa le tartarughe marine fanno il nido sulla spiaggia.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il nonno del mio amico fa il pescatore a Chioggia.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 25 (+b (QZERTY 24)) ──
  { text: "Bianca fa basket a Bari.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Giacomo Bertagnolli scia con una guida.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Abbiamo vinto la partita di pallavolo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il bus per Olbia parte alle otto.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Beatrice sogna di lavorare con i delfini.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "La batteria del telefono si scarica subito.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Sotto i portici di Bologna si studia anche di notte.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Brunico vado a scuola in bici.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Abito a Bressanone e parlo tre lingue.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ho dimenticato il biglietto a casa.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "In Sicilia i volontari spengono gli incendi nei boschi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Abbiamo pulito la spiaggia di Ostia.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ho preso un bel voto in storia.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ambra suona il basso in una band.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il trenino rosso del Bernina sale oltre duemila metri.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Sabato sera balliamo a Barletta.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Un abbraccio a tutti dal ritiro di Bormio.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Benvenuti a bordo del Frecciarossa per Brindisi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 26 (+z (QZERTY 25)) ──
  { text: "Bebe Vio tira di scherma in carrozzina.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ci vediamo in piazza alle sei.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Lorenzo esce a mangiare una pizza con gli amici.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "La pizzica si balla in Salento.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Ho una verifica di scienze domani.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Venezia molti studenti vanno a scuola in vaporetto.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Bolzano Lena parla tedesco con la nonna e italiano con gli amici.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Bellinzona ha tre castelli.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "La nazionale femminile di calcio scende in campo stasera.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "La mia canzone preferita parla di Napoli.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Azzurra fa danza classica.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Lo zaino pesa troppo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Il Palio di Siena si corre in Piazza del Campo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Organizziamo una raccolta di vestiti usati.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "La lezione di inglese inizia alle otto.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Grazie mille, ci vediamo domani.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A mezzogiorno mangio in mensa.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Viola scrive canzoni pop.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Durante le vacanze lavoro in un rifugio in Trentino.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "A Cosenza Vincenzo studia informatica.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "Fabrizio impara a fare il pizzaiolo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 27 (+è - ist (QZERTY 26)) ──
  { text: "Bellinzona è il capoluogo del Ticino.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mia sorella è a San Marino per lavoro.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Oggi è il compleanno di Giulia.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il concerto è finito tardi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il mio sogno è fare la regista.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il mio amico di Biasca è appassionato di treni.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il vulcano Etna è ancora attivo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mio fratello è infermiere a Potenza.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il traghetto è in ritardo di venti minuti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il mio telefono è scarico.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Lo sport è per tutti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il dialetto di Bergamo è diverso dal milanese.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il canto a tenore è una tradizione sarda.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Amira è nata a Perugia da genitori egiziani.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il Gran Paradiso è un parco nazionale.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il tunnel di base del Gottardo è lunghissimo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "San Marino è una piccola repubblica.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Matera è stata capitale europea della cultura.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mio padre è cuoco a Merano.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il mio compagno di banco è nato in Romania.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mio cugino è apprendista meccanico a Lugano.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Domani è festa, niente sveglia.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 28 (+à - città, papà, già, sarà (QZERTY 27)) ──
  { text: "A Siena la città si divide in contrade.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Lecce il centro della città è di pietra chiara.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Taranto è la città dei due mari.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il papà di Karim lavora sui pescherecci di Mazara.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mio papà fa il pane ad Altamura.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Dopo la maturità voglio studiare a Urbino.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La gita sarà a maggio.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Sono già le dieci, è tardi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Ferrara in città si va soprattutto in bici.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La siccità preoccupa gli agricoltori del Sud.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A metà strada ci fermiamo a Orvieto.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ahmed e suo papà lavorano al porto di Livorno.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mendrisio è una città di confine.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Bolzano metà dei miei amici parla tedesco.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Palermo è la città dove sono nato.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La pallavolo è la mia attività preferita.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Elsa aiuta il papà con il gregge in Abruzzo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La prossima tappa sarà Nuoro.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "In Toscana il papà si chiama babbo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 29 (+' - ELISION: l', un', dell', all', c'è, d'estate, po' (QZERTY 28)) ──
  { text: "C'è un'amica di Lecce in classe con me.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "L'estate scorsa ho lavorato in un lido.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "D'inverno andiamo sull'Etna a sciare.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ho passato un'estate intera a Ischia.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "L'allenamento inizia alle sei.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Anch'io voglio fare l'alberghiero.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Non so dov'è il binario per Fortezza.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Dall'Alto Adige arrivano tre compagni nuovi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "L'app del treno mi avvisa del ritardo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ho un'ora di matematica e un'ora di inglese.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Un'altra partita, poi studio.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "L'anno prossimo vado al liceo artistico.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "C'era tanta gente al concerto all'aperto di Cagliari.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "All'ultimo minuto abbiamo segnato.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Sull'autobus per Sassari leggo un libro.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "D'accordo, ci vediamo all'ingresso.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "L'inverno a San Candido è lungo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Un'amica di Locarno mi insegna a fare il risotto.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "L'orario dei treni cambia a dicembre.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mi piace un po' di rap e un po' di jazz.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Nell'orto della scuola coltiviamo pomodori.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Oggi c'è lo sciopero dei treni.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ho perso l'ultimo treno per Biasca.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Nell'aula di informatica impariamo a programmare.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Assunta Legnante, di Napoli, ha vinto l'oro nel peso.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il Ticino d'estate è pieno di turisti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Poschiavo l'italiano è la lingua di casa.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "In Val Gardena c'è chi parla ladino, tedesco e italiano.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "L'esame di terza media mi mette ansia.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 30 (+q - qui, questo, squadra, acqua (QZERTY 29)) ──
  { text: "L'acqua del Ceresio è fredda.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "D'inverno l'aria di Milano è inquinata.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Sono le quattro. Il bus arriva tra poco.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Questa squadra è la mia famiglia.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Qui a Messina il mare è sempre blu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Siamo in quattro nel gruppo di lavoro.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Quest'anno faccio il corso di primo soccorso.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Tifiamo per la squadra di pallavolo di Trento.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "L'Aquila è circondata dalle montagne.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Bevo acqua del rubinetto e non compro bottiglie.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Cinque amici, un pallone e la piazza.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Questo podcast racconta la musica sarda.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Quasi tutti in classe hanno uno smartphone.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Qualche volta vado a cavallo in Maremma.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Alla quarta ora c'è educazione fisica.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ieri la squadra di Lugano ha vinto in casa.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Quando arrivo a Bolzano ti scrivo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mi squilla il telefono in classe.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "In gita siamo andati all'Acquario di Genova.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Nel mio quartiere di Bari c'è un campo di basket.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Quest'estate faccio volontariato a Lampedusa.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 31 (+é - perché, né, finché, ventitré (QZERTY 30)) ──
  { text: "Studio tedesco perché voglio lavorare a Bolzano.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Non ho né fame né sonno.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Esco perché c'è il sole.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Finché piove, giochiamo ai videogiochi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ho trentatré messaggi non letti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il bus è in ritardo perché c'è traffico a Napoli.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mi alleno ogni giorno perché voglio andare alle Paralimpiadi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ventitré ragazzi della mia classe vanno in gita a Trieste.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Non vado in bici perché ho la ruota bucata.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Benché sia stanca, Sara va all'allenamento.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Imparo il ladino perché mia nonna è di Ortisei.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Restiamo a Siracusa finché non finisce l'estate.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ho scelto l'alberghiero perché mi piace cucinare.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Lavoro d'estate perché voglio comprare un motorino.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Poiché piove, la partita a Cosenza è rinviata.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 32 (+ì - così, sì, lunedì … venerdì (QZERTY 31; Zeilen mit ò dort 32)) ──
  { text: "Il lunedì ho allenamento di pallavolo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Venerdì scendiamo in piazza per il clima.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Così impariamo a scrivere senza guardare la tastiera.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Sì, vengo anch'io al concerto.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mercoledì c'è la gita a Forlì.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il mare di Lipari è così trasparente.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il lunedì mattina il treno per Lugano è pieno di frontalieri.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Martedì giochiamo contro la squadra di Rieti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Così tanto caldo a Foggia non l'ho mai sentito.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Sì, il mio sogno è fare l'astronauta come Samantha Cristoforetti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Venerdì sera suoniamo in un locale di Matera.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Giovedì ho l'esame per il patentino.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Lunedì andrò a Trapani con la nonna.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Venerdì però ho la verifica di storia.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Così però non si può giocare.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Sì, lo so, ho sbagliato il passaggio, però ho segnato.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mercoledì sarò a Cagliari per una gara di nuoto.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 33 (+ù - più, giù, lassù, Cefalù (QZERTY 33)) ──
  { text: "Chiasso è la città più a sud della Svizzera.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "D'estate a Cefalù c'è più gente che in inverno.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il tiramisù della nonna è il più buono.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Napoli il ragù cuoce per ore la domenica.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Più mi alleno, più miglioro.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Corriamo giù in spiaggia.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Non ne posso più dei compiti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Lassù in rifugio non c'è campo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ogni anno il ghiacciaio diventa più piccolo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Lassù in Val Venosta si raccolgono le mele.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Nel menù della mensa c'è sempre pasta.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Non c'è più posto sul traghetto per Ponza.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Laggiù, vicino al porto di Olbia, c'è il nostro campo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Cantù il basket è una passione.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Sempre più ragazze giocano a calcio.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Giù al molo di Trieste soffia la bora.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Più tardi ti mando la foto.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mia madre è nata in Perù e parla spagnolo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 34 (+y (QZERTY 34)) ──
  { text: "A Torino Yuri gioca a rugby in carrozzina.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Mia cugina di Matera fa la babysitter.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Facciamo graffiti con lo spray su un muro autorizzato.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Oney Tapia lancia il disco.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La mia playlist per studiare dura due ore.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Faccio yoga con mia madre il sabato.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Rovigo il rugby è molto seguito.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Stasera c'è il derby di Genova.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Yasmine fa video sui libri per il suo canale.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Con la prof parliamo di cyberbullismo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il mio hobby è costruire modellini di treni.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Lo yogurt con le fragole è la mia merenda.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La squadra di hockey di Ambrì è famosa in Ticino.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Lucca faccio cosplay con le mie amiche.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Nessuno legge la privacy delle app.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "A Bolzano si gioca a hockey su ghiaccio.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 35 (+w (QZERTY 35)) ──
  { text: "Nel weekend facciamo un torneo di videogiochi a Cagliari.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Prepariamo lo show di fine anno.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La webcam del computer non va.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il wifi della scuola non funziona mai.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Nel weekend facciamo windsurf sul Garda.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Wolfgang di Silandro mi scrive in italiano e io gli rispondo in tedesco.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Intorno a Latina si coltivano molti kiwi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il sito web della nostra classe è pronto.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Facciamo un workshop di robotica a Pisa.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Nel weekend lavoro in una gelateria di Senigallia.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il download del gioco dura un'ora.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Werner allena la squadra di hockey di Brunico.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Nel weekend andiamo in Valle Maggia con le tende.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  // ── Sprosse 36 (+x - die letzte Buchstaben-Sprosse (QZERTY 36)) ──
  { text: "Felix suona il basso in una band di Bressanone.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ho trovato un lavoretto extra in una pizzeria di Lecce.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Il Bernina Express passa da Tirano.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Alex fa boxe a Catania.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Max installa Linux sul vecchio computer.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Prendiamo un taxi dalla stazione di Bari.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Ho fatto un'ora extra di nuoto.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Dopo la verifica, un po' di relax.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "La mia ex compagna di banco ora vive in Mesolcina.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Alla radio del liceo uso il mixer.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
  { text: "Nel box di casa ripariamo le bici.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "it" },
];
