/**
 * ★★★ DER ABZEICHEN-KATALOG ITALIENISCH (O-IT, 02.10.2026).
 *
 * Gegenstück zu `badgesEs.ts` - dieselbe Bauart, dieselben Schlüssel, NEU AUF
 * ITALIENISCH GESCHRIEBEN, nicht übersetzt (Glossar Italienisch §2.4): übertragen
 * ist die IDEE des Namens. Wo das Italienische eine eigene Wendung zum Motiv
 * hat, steht sie da („Topo di biblioteca" zum Bücherstapel, „Solido come una
 * roccia", „Di nuovo in sella", „Tutto d'un fiato", „Occhio d'aquila"); sonst
 * ein Stabreim wie im Deutschen („Pinguino preciso", „Tasso tenace", „Lince
 * lettrice", „Castoro costante"). Regional neutral: keine Wendung nur aus einer
 * Region; keine Marken („Frecciarossa").
 *
 * Grossschreibung wie im Italienischen: nur das erste Wort und Eigennamen. Die
 * trockenen Zweitnamen (`nameNeutral`, ab 11 Jahren) genau dort, wo das
 * Deutsche einen hat.
 *
 * Glossar: « medaglia » (Abzeichen), Runde ⇒ « giro », Anschlag ⇒ « battuta »,
 * Treffsicherheit ⇒ « precisione », Fehler ⇒ « errore », Grundstellung ⇒
 * « posizione base », Grundreihe ⇒ « riga di base », Etappe ⇒ « tappa »,
 * Eisschollen-Spiel ⇒ « Gioco dei lastroni », Punktering ⇒ « cerchio dei punti »,
 * Leistungsstufe ⇒ « livello di difficoltà », Ziel ⇒ « traguardo » (« obiettivo »
 * bleibt dem Wochenziel). Zahlen wie `zahl(n, "it")`: vier Ziffern ohne Trenner
 * („1000"), ab fünf mit Punkt („10.000"); „95%" ohne Leerzeichen; Dezimalkomma
 * („0,5%"). Beschreibungen ohne Anrede, wie im Deutschen; Lob ohne
 * Geschlechtsendung an „tu" (Glossar Regel 2).
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - der Wächter
 * `tests/tastenflow-italienisch-alles.test.tsx` prüft, dass jede ID einen
 * italienischen Eintrag hat und einen Zweitnamen genau dort, wo es ihn im
 * Deutschen gibt.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextIt = AbzeichenTextEn;

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesEs.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} e ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_IT: Readonly<Record<string, string>> = {
  Fehlerfrei: "Senza errori",
  "Saubere Serie": "Giri perfetti",
  Fleiß: "Impegno",
  Anschläge: "Battute",
  Dranbleiben: "Costanza",
  Übungswochen: "Settimane di esercizio",
  Sterne: "Stelle",
  Lektionen: "Lezioni",
  Stufen: "Livelli",
  Tastenwelt: "Il mondo della tastiera",
  "Sitzt!": "Imparato!",
  Tempo: "Velocità",
  "Am Stück": "Tutto d'un fiato",
  Meisterprüfung: "Maestria",
  Abenteuer: "Avventure",
  "Abenteuer-Kunststücke": "Prodezze d'avventura",
  Expedition: "Spedizione",
  Geschichten: "Storie",
  Lesestunde: "Tempo di lettura",
  "Lese-Kunststücke": "Prodezze di lettura",
  Geheim: "Segreti",
};

/** Der ganze Katalog italienisch, je Abzeichen-ID. */
export const ABZEICHEN_IT: Readonly<Record<string, AbzeichenTextIt>> = {
  // ── Fehlerfrei ───────────────────────────────────────────────────────────
  volltreffer: { name: "Centro perfetto", description: "Un giro intero senza nemmeno un errore.", bildbeschreibung: "un bersaglio con una freccia al centro" },
  "null-fehler-ninja": { name: "Ninja zero errori", description: "5 giri senza nessun errore.", bildbeschreibung: "un ninja" },
  "makellos-meister": { name: "Stella impeccabile", description: "15 giri senza nessun errore.", bildbeschreibung: "tre stelle che brillano" },
  "diamant-finger": { name: "Dita di diamante", description: "40 giri senza nessun errore.", bildbeschreibung: "una pietra preziosa blu" },
  "weisse-weste": { name: "Bianco come la neve", description: "80 giri senza nessun errore.", bildbeschreibung: "una colomba bianca" },
  "einhorn-finger": { name: "Dita di unicorno", nameNeutral: "150 giri senza errori", description: "150 giri senza nessun errore.", bildbeschreibung: "un unicorno" },
  // ── Saubere Serie ────────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Pinguino preciso", nameNeutral: "Tre giri precisi", description: "3 giri precisi di fila (almeno 95% di precisione).", bildbeschreibung: "un pinguino" },
  adlerauge: { name: "Occhio d'aquila", description: "7 giri precisi di fila (almeno 95% di precisione).", bildbeschreibung: "un'aquila" },
  "laser-lama": { name: "Lama laser", nameNeutral: "Modalità laser", description: "15 giri precisi di fila (almeno 95% di precisione).", bildbeschreibung: "un lama" },
  "eiskalte-serie": { name: "Sangue freddo", description: "25 giri precisi di fila (almeno 95% di precisione).", bildbeschreibung: "un cubetto di ghiaccio" },
  // ── Fleiß ────────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Pulcino della tastiera", nameNeutral: "Primo giro", description: "Il primissimo giro completato.", bildbeschreibung: "un pulcino che esce dall'uovo" },
  "ausdauer-ameise": { name: "Formica operosa", nameNeutral: "Riscaldamento fatto", description: "25 giri di esercizio.", bildbeschreibung: "una formica" },
  "marathon-maus": { name: "Topo maratoneta", nameNeutral: "Cento giri", description: "100 giri di esercizio.", bildbeschreibung: "la testa di un topo" },
  "munteres-murmeltier": { name: "Castoro costante", nameNeutral: "Maratona", description: "250 giri di esercizio.", bildbeschreibung: "un castoro" },
  dauerlaeufer: { name: "Gran fondo", description: "500 giri di esercizio.", bildbeschreibung: "una persona che corre" },
  tausendsassa: { name: "Mille e un giro", nameNeutral: "Mille giri", description: "1000 giri di esercizio.", bildbeschreibung: "una balena che soffia uno spruzzo d'acqua" },
  // ── Anschläge ────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Tigre dei mille tasti", nameNeutral: "Mille battute giuste", description: "1000 battute giuste.", bildbeschreibung: "la testa di una tigre" },
  "tasten-t-rex": { name: "T-Rex della tastiera", nameNeutral: "Diecimila battute giuste", description: "10.000 battute giuste.", bildbeschreibung: "un T-Rex" },
  "galaktische-fingerspitzen": { name: "Dita galattiche", description: "50.000 battute giuste.", bildbeschreibung: "un razzo al decollo" },
  "hunderttausend-held": { name: "Asso delle centomila", nameNeutral: "Centomila battute giuste", description: "100.000 battute giuste.", bildbeschreibung: "un fulmine giallo" },
  viertelmillion: { name: "Un quarto di milione", description: "250.000 battute giuste - tante quante in un libro intero.", bildbeschreibung: "un satellite" },
  // ── Dranbleiben ──────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Tasso tenace", nameNeutral: "Costanza", description: "Esercizio in 3 giorni diversi.", bildbeschreibung: "un tasso" },
  gewohnheitstier: { name: "Tartaruga fedele", description: "Esercizio in 7 giorni diversi.", bildbeschreibung: "una tartaruga" },
  "wie-ein-uhrwerk": { name: "Preciso come un orologio", description: "Esercizio in 20 giorni diversi.", bildbeschreibung: "una sveglia rossa" },
  unaufhaltsam: { name: "Inarrestabile", description: "Esercizio in 50 giorni diversi.", bildbeschreibung: "una montagna con la cima innevata" },
  "tief-verwurzelt": { name: "Radici profonde", description: "Esercizio in 100 giorni diversi.", bildbeschreibung: "un albero grande, verde e folto" },
  "fels-in-der-brandung": { name: "Solido come una roccia", description: "Esercizio in 200 giorni diversi - più di tutti i giorni di scuola di un anno scolastico.", bildbeschreibung: "una statua di pietra dell'Isola di Pasqua" },
  // ── Übungswochen ─────────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Già tre mesi", description: "Esercizio in 12 settimane diverse.", bildbeschreibung: "una foglia d'autunno marrone" },
  "halbes-jahr-dabei": { name: "Già sei mesi", description: "Esercizio in 26 settimane diverse.", bildbeschreibung: "una nuvola da cui cade la neve" },
  "ganzes-jahr-dabei": { name: "Un anno intero", description: "Esercizio in 52 settimane diverse.", bildbeschreibung: "una torta di compleanno con una candelina" },
  // ── Sterne ───────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Stella cadente", description: "Il primo giro con 3 stelle.", bildbeschreibung: "una stella cadente nel cielo notturno" },
  "sternen-sammler": { name: "Raccolta di stelle", description: "10 giri con 3 stelle.", bildbeschreibung: "una stella gialla che brilla" },
  sternenhimmel: { name: "Cielo stellato", description: "30 giri con 3 stelle.", bildbeschreibung: "la Via Lattea nel cielo notturno" },
  sternenmeer: { name: "Mare di stelle", description: "75 giri con 3 stelle.", bildbeschreibung: "una stella arancione a otto punte" },
  // ── Lektionen ────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Leone delle lezioni", nameNeutral: "Cinque lezioni", description: "5 lezioni completate.", bildbeschreibung: "un leone" },
  "kapitel-kaeptn": { name: "Capitano dei capitoli", description: "15 lezioni completate.", bildbeschreibung: "un'ancora" },
  // Wie im Englischen, Französischen und Spanischen: die Lektionszahl DES WEGES.
  "lehrgangs-legende": { name: "Leggenda del corso", description: (z) => `Tutte le ${lektionenFuer(z.lernweg).length} lezioni completate.`, bildbeschreibung: "una coppa d'oro" },
  // ── Stufen (der Punktering) ──────────────────────────────────────────────
  "kletter-koala": { name: "Koala scalatore", nameNeutral: "Livello 5", description: "Livello 5 raggiunto nel cerchio dei punti.", bildbeschreibung: "un koala" },
  "punkte-rakete": { name: "Razzo dei punti", description: "Livello 10 raggiunto nel cerchio dei punti.", bildbeschreibung: "un palloncino rosso" },
  "gipfel-gaemse": { name: "Capra delle vette", nameNeutral: "Livello 20", description: "Livello 20 raggiunto nel cerchio dei punti.", bildbeschreibung: "una capra" },
  hoehenflug: { name: "Volo d'alta quota", nameNeutral: "Livello 50", description: "Livello 50 raggiunto nel cerchio dei punti.", bildbeschreibung: "un elicottero" },
  "ueber-den-wolken": { name: "Sopra le nuvole", nameNeutral: "Livello 100", description: "Livello 100 raggiunto nel cerchio dei punti.", bildbeschreibung: "un disco volante" },
  sternenreise: { name: "Viaggio tra le stelle", nameNeutral: "Livello 200", description: "Livello 200 raggiunto nel cerchio dei punti.", bildbeschreibung: "una cometa con una lunga coda" },
  // ── Tastenwelt ───────────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES (auf Weg „it" später „a s d f j k l ò", F4).
  "grundstellungs-gorilla": {
    name: "Gorilla della riga di base",
    nameNeutral: "Riga di base al suo posto",
    description: (z) =>
      `Gli otto tasti della posizione base sbloccati: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "un gorilla",
  },
  "gross-baumeister": { name: "Maestria nelle maiuscole", nameNeutral: "Maiuscole", description: "Il tasto Maiusc è imparato - maiuscole vere, scritte con le proprie mani.", bildbeschreibung: "quattro lettere maiuscole su tasti blu" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „it" nicht zu
  // verdienen - der Eintrag steht trotzdem da, weil das Regal jedes beschreibt.
  "puenktchen-panda": { name: "Panda a puntini", nameNeutral: "Le dieresi tedesche", description: "ä, ö e ü sbloccate.", bildbeschreibung: "un panda" },
  "schlangen-s": { name: "S serpente", nameNeutral: "La esse tedesca", description: "ß, la esse tedesca, sbloccata - l'ultima lettera della tastiera tedesca.", bildbeschreibung: "un serpente" },
  "alphabet-as": { name: "Asso dell'alfabeto", description: "Tutte le lettere dalla A alla Z sbloccate.", bildbeschreibung: "lettere minuscole su tasti blu" },
  "punkt-und-komma": { name: "Virgola e punto", description: "Il punto e la virgola sbloccati - i primi veri segni di punteggiatura.", bildbeschreibung: "una piuma nera da scrivere" },
  "satzzeichen-sammler": { name: "Raccolta di segni", nameNeutral: "Tutta la punteggiatura", description: "I segni di punteggiatura sbloccati: . , - ? ! : ;", bildbeschreibung: "un grande punto esclamativo rosso" },
  "zahlen-zebra": { name: "Zebra dei numeri", nameNeutral: "Metà dei numeri", description: "Cinque numeri della riga dei numeri sbloccati.", bildbeschreibung: "una zebra" },
  "zahlen-zauberer": { name: "Magia dei numeri", nameNeutral: "Riga dei numeri completa", description: "Tutta la riga dei numeri, da 1 a 0, sbloccata.", bildbeschreibung: "un tasto blu con il numero 10" },
  "klammer-krokodil": { name: "Coccodrillo delle parentesi", nameNeutral: "Parentesi aperta e chiusa", description: "Le parentesi ( ) sbloccate - i primi simboli.", bildbeschreibung: "un coccodrillo" },
  "alltags-ass": { name: "Asso del quotidiano", nameNeutral: "I segni di ogni giorno", description: (z) => `${alltagsZeichen(z)} sbloccati - i segni dell'email e del denaro.`, bildbeschreibung: "una busta" },
  "tastatur-krone": { name: "Corona della tastiera", nameNeutral: "Tutta la tastiera", description: "TUTTI i tasti della tastiera sbloccati - fino all'ultimo simbolo.", bildbeschreibung: "una corona d'oro" },
  // ── Sitzt! ───────────────────────────────────────────────────────────────
  "feste-burg": { name: "Casa solida", nameNeutral: "Riga di base imparata", description: "Gli otto tasti della posizione base sono sicuri.", bildbeschreibung: "una casa" },
  "buchstaben-baendiger": { name: "Lettere domate", nameNeutral: "Tutte le lettere imparate", description: "Ogni lettera è sicura - nessuna esita più.", bildbeschreibung: "un quadrato rosso con una grande A" },
  "zahlen-fels": { name: "Numeri di pietra", nameNeutral: "Tutti i numeri imparati", description: "Tutta la riga dei numeri è sicura.", bildbeschreibung: "un pallottoliere con perline colorate" },
  "nichts-wackelt": { name: "Niente vacilla", description: "Ogni tasto della tastiera è sicuro - tutta la tastiera, non solo sbloccata.", bildbeschreibung: "un rombo blu con un punto al centro" },
  // ── Tempo ────────────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Volpe veloce", nameNeutral: "Veloce e con precisione", description: "Traguardo di velocità raggiunto E almeno 95% di precisione - la velocità conta solo se si scrive con precisione.", bildbeschreibung: "una volpe" },
  "tempo-60": { name: "Lepre leggera", nameNeutral: "60 al minuto, con precisione", description: "Un giro a 60 battute al minuto con almeno 95% di precisione.", bildbeschreibung: "un coniglio" },
  "tempo-90": { name: "Cervo veloce", nameNeutral: "90 al minuto, con precisione", description: "Un giro a 90 battute al minuto con almeno 95% di precisione.", bildbeschreibung: "un cervo" },
  "tempo-120": { name: "Cavallo al galoppo", nameNeutral: "120 al minuto, con precisione", description: "Un giro a 120 battute al minuto con almeno 98% di precisione.", bildbeschreibung: "un cavallo al galoppo" },
  "tempo-160": { name: "Locomotiva a vapore", nameNeutral: "160 al minuto, con precisione", description: "Un giro a 160 battute al minuto con almeno 98% di precisione.", bildbeschreibung: "una locomotiva a vapore" },
  "tempo-200": { name: "Treno superveloce", nameNeutral: "200 al minuto, con precisione", description: "Un giro a 200 battute al minuto con almeno 98% di precisione.", bildbeschreibung: "un treno ad alta velocità" },
  "tempo-300": { name: "Aereo a reazione", nameNeutral: "300 al minuto, con precisione", description: "Un giro a 300 battute al minuto con almeno 99% di precisione - livello professionale.", bildbeschreibung: "un piccolo aereo" },
  // ── Am Stück ─────────────────────────────────────────────────────────────
  "kette-100": { name: "Reazione a catena", nameNeutral: "100 di fila", description: "100 battute giuste di fila, senza nemmeno un errore.", bildbeschreibung: "due anelli di catena" },
  "kette-250": { name: "Senza inciampi", description: "250 battute giuste di fila.", bildbeschreibung: "una catena di vari anelli" },
  "kette-500": { name: "Filo conduttore", nameNeutral: "500 di fila", description: "500 battute giuste di fila - un giro intero e anche di più.", bildbeschreibung: "un rocchetto di filo" },
  "kette-1000": { name: "Mille senza errori", description: "1000 battute giuste di fila.", bildbeschreibung: "il monte Fuji con la cima innevata" },
  "kette-2000": { name: "La catena di ferro", nameNeutral: "2000 di fila", description: "2000 battute giuste di fila - quattro o cinque giri senza il minimo inciampo.", bildbeschreibung: "un vulcano da cui esce la lava" },
  // ── Abenteuer (das Spiel heisst in der Hilfe „il Gioco dei lastroni") ────
  "erste-expedition": { name: "Prima spedizione", description: "La prima avventura sui lastroni in gioco libero, fino all'igloo.", bildbeschreibung: "una bussola" },
  polarforscher: { name: "Esplorazione polare", description: "10 avventure sui lastroni completate in gioco libero.", bildbeschreibung: "un fiocco di neve" },
  "eismeer-legende": { name: "Leggenda dei mari di ghiaccio", description: "30 avventure sui lastroni completate in gioco libero.", bildbeschreibung: "un'onda blu alta" },
  "packeis-profi": { name: "Asso dei lastroni", nameNeutral: "60 avventure", description: "60 avventure sui lastroni completate in gioco libero.", bildbeschreibung: "una valigia" },
  // ── Abenteuer-Kunststücke ────────────────────────────────────────────────
  // „Trockener Frack": Der Frack ist der Pinguin selbst - italienisch « il frac ».
  "trockener-frack": { name: "Frac asciutto", description: "Un'avventura intera senza cadere nemmeno una volta in acqua o nella neve.", bildbeschreibung: "un cappello a cilindro nero" },
  "immer-trocken": { name: "Sempre asciutto", description: (z) => `${z.trockeneAbenteuer} avventure senza nemmeno un tuffo.`, bildbeschreibung: "un ombrello chiuso" },
  fischfaenger: { name: "Bella pesca", description: (z) => `${z.fische} pesci bonus presi nell'avventura sui lastroni.`, bildbeschreibung: "un pesce blu" },
  // ── Expedition ───────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (Glossar §2.3): la Grotta dell'eco, la Bufera di
  // neve, la Stazione polare. Nie „cieco" als Tipp-Wort.
  "hoehlen-lauscher": { name: "In ascolto nella grotta", description: "La Grotta dell'eco attraversata fino all'uscita, al buio, solo con l'udito.", bildbeschreibung: "un pipistrello" },
  "sturm-trotzer": { name: "Più forte della bufera", description: "La Bufera di neve attraversata - le sequenze scritte a memoria.", bildbeschreibung: "una faccia che soffia vento" },
  "funker-freund": { name: "Amicizia via radio", description: "Un messaggio radio intero decifrato e inviato alla Stazione polare.", bildbeschreibung: "una radio" },
  "polarlicht-entdecker": { name: "Sotto l'aurora boreale", description: "Tutta la Spedizione polare senza nemmeno un errore - l'aurora boreale danza.", bildbeschreibung: "una stella con una scia di scintille" },
  // ── Geschichten ──────────────────────────────────────────────────────────
  "lese-luchs": { name: "Lince lettrice", nameNeutral: "Prima storia", description: "La prima storia letta e scritta fino alla fine.", bildbeschreibung: "un leopardo" },
  buecherwurm: { name: "Bruco lettore", description: "3 storie lette fino alla fine.", bildbeschreibung: "un bruco verde" },
  "buecherei-baer": { name: "Orso della biblioteca", nameNeutral: "Otto storie", description: "8 storie lette fino alla fine.", bildbeschreibung: "un orso" },
  vielleser: { name: "Topo di biblioteca", description: "15 storie lette fino alla fine.", bildbeschreibung: "una pila di libri colorati" },
  // ── Lesestunde ───────────────────────────────────────────────────────────
  "seiten-spatz": { name: "Passero delle pagine", nameNeutral: "Prima pagina", description: "La prima tappa di una storia scritta.", bildbeschreibung: "un uccellino blu" },
  "kapitel-krake": { name: "Polpo dei capitoli", nameNeutral: "Dieci tappe", description: "10 tappe lette e scritte.", bildbeschreibung: "un polpo" },
  "geschichten-gigant": { name: "Gigante delle storie", description: "30 tappe lette e scritte.", bildbeschreibung: "un elefante" },
  leseratte: { name: "Divoralibri", nameNeutral: "75 tappe", description: "75 tappe lette e scritte.", bildbeschreibung: "una pergamena" },
  // ── Lese-Kunststücke ─────────────────────────────────────────────────────
  federleicht: { name: "Leggero come una piuma", description: "Una tappa intera scritta senza nemmeno un errore.", bildbeschreibung: "una piuma bianca" },
  "in-einem-rutsch": { name: "Tutto d'un fiato", description: "Una storia intera letta fino alla fine in un solo giorno.", bildbeschreibung: "una spirale blu" },
  "lesezeichen-held": { name: "Asso del segnalibro", description: "Un altro giorno la lettura è ripresa proprio da dove si era fermata.", bildbeschreibung: "un segnalibro" },
  // ── Meisterprüfung (Glossar §2.4: „Maestria", nie „esame") ─────────────────
  "zehn-minuten-abschrift": { name: "La trascrizione di 10 minuti", description: "Dieci minuti di fila a copiare un testo con al massimo lo 0,5% di errori - come nelle vere gare di trascrizione.", bildbeschreibung: "un cronometro" },
  "lehrgangs-meister": { name: "Corso padroneggiato", description: (z) => `Tutte le ${lektionenFuer(z.lernweg).length} lezioni completate con tre stelle.`, bildbeschreibung: "un tocco universitario nero" },
  "goldene-tastatur": { name: "La tastiera d'oro", description: "Tutti i tasti sbloccati, tutti sicuri - e una volta 160 battute al minuto con il 98% di precisione. L'ultima medaglia.", bildbeschreibung: "una medaglia sportiva con il nastro" },
  // ── Geheim ───────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Bradipo tranquillo", description: "Molto piano, e senza nemmeno un errore - la precisione viene prima della velocità!", bildbeschreibung: "un bradipo" },
  "comeback-kaenguru": { name: "Il salto del canguro", description: "Un giro con 3 stelle subito dopo un giro con 1 stella.", bildbeschreibung: "un canguro" },
  nachteule: { name: "Gufo notturno", description: "Un giro completato dopo le 21.", bildbeschreibung: "un gufo" },
  "frueher-vogel": { name: "Al canto del gallo", description: "Un giro completato prima delle 7.", bildbeschreibung: "un gallo" },
  nimmersatt: { name: "Lettura golosa", description: "3 tappe divorate in un solo giorno.", bildbeschreibung: "una mela verde" },
  "ferien-held": { name: "Vacanze a tasti", description: "Esercizio a luglio o ad agosto.", bildbeschreibung: "una spiaggia con un ombrellone" },
  "wochenend-schreiber": { name: "Scrittura del fine settimana", description: "Esercizio di sabato e di domenica.", bildbeschreibung: "un foglio di calendario" },
  "zurueck-im-sattel": { name: "Di nuovo in sella", description: (z) => `Esercizio ripreso dopo una pausa di più di ${z.pauseTage} giorni - anche tornare conta.`, bildbeschreibung: "due frecce che girano in cerchio" },
  "doppelt-genaeht": { name: "Doppio colpo", description: "Due giri senza errori, uno subito dopo l'altro.", bildbeschreibung: "un ago con il filo" },
  winterkind: { name: "Tasti d'inverno", description: "Esercizio a dicembre o a gennaio.", bildbeschreibung: "un pupazzo di neve" },
  jahreswechsel: { name: "Capodanno", description: "Esercizio l'ultimo giorno dell'anno o il primo giorno dell'anno nuovo.", bildbeschreibung: "fuochi d'artificio nel cielo notturno" },
  "tages-marathon": { name: "Maratona di un giorno", description: "Dieci giri in un solo giorno.", bildbeschreibung: "un fantino su un cavallo da corsa" },
  sternentag: { name: "Giornata di stelle", description: "Tre giri con tre stelle in un solo giorno.", bildbeschreibung: "un sole con la faccia" },
  blitzsauber: { name: "Splendente", description: "Tre giri senza errori in un solo giorno.", bildbeschreibung: "una saponetta con le bolle" },
  "volle-woche": { name: "Settimana piena", description: "Esercizio in cinque giorni diversi in UNA settimana.", bildbeschreibung: "un libro verde" },
  // „Blindflug" ⇒ « Senza guardare »: zum Affen, der sich die Augen
  // zuhält - Glossar Regel 4, nie „alla cieca".
  blindflug: { name: "Senza guardare", description: "Un giro intero senza errori - con la tastiera sullo schermo nascosta. È tutta l'arte della dattilografia a dieci dita.", bildbeschreibung: "una scimmia che si copre gli occhi con le mani" },
  sprachwechsler: { name: "Viaggio tra le lingue", description: "Esercizio in due lingue - per esempio in italiano e in inglese.", bildbeschreibung: "il globo terrestre con l'Europa e l'Africa" },
  lesenacht: { name: "Lettura di notte", description: "Una tappa di una storia letta dopo le 20.", bildbeschreibung: "una luna con la faccia" },
  "zaehe-taste": { name: "Tasto testardo", description: "Un tasto che ha richiesto molto tempo ora è sicuro.", bildbeschreibung: "una lumaca" },
  aufsteiger: { name: "In salita", description: "Cinque livelli di difficoltà sopra l'inizio.", bildbeschreibung: "un grafico con una linea che sale" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine italienische Bedienung
  // auf diesem Weg; dieselben Gedanken wie dort.
  "akzente-ziffernreihe": { name: "Acrobata degli accenti", nameNeutral: "é, è, ç e à", description: "é, è, ç e à sbloccate - le lettere che abitano sulla riga dei numeri.", bildbeschreibung: "le cifre 1 2 3 4 su un tasto blu" },
  "accent-circonflexe": { name: "Il cappellino", nameNeutral: "L'accento circonflesso", description: "Il tasto morto ^ imparato: ê, â, î, ô e û.", bildbeschreibung: "un cappello di paglia con un nastro" },
  trema: { name: "Coccinella a due puntini", nameNeutral: "La dieresi", description: "La dieresi ¨ imparata: ë, ï e ü.", bildbeschreibung: "una coccinella" },
};
