/**
 * Korpus nur für Lernweg "it", frühe Sprossen 7-19 - Altersstufe Teens,
 * Jugendliche 11-16 (IT-T2, 03.10.2026, Bauplan
 * `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §1 D2-D4, §3; Befund
 * `BEFUND-2026-10-02-IT-T2-TEENS-FRUEH.md`). Vorgehen nach dem Piloten IT-T1
 * (`BEFUND-2026-10-02-IT-T1-KIDS-FRUEH.md` §6).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF ITALIENISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz
 * (darum auch kein `herkunft`). Tatoeba (nur Originalsätze) diente als WORTLISTE
 * je Sprosse. Keine Zeile der Kinder-Charge (`corpusItWegFruehKids.ts`) ist
 * kopiert oder nur abgewandelt - der Wächter prüft Text, Ledger-Schlüssel und
 * Paare auch gegen sie.
 *
 * ALTERSGEMÄSS 11-16, Register natürlich, nicht kindlich, nicht belehrend:
 * Sport (calcetto, curva, trasferta, salto in alto, lancio del disco, nuoto,
 * vela, pallavolo femminile, corsa campestre, arrampicata, sci und Atletica
 * paralimpici), Musik von heute (cantautrice, rap in napoletano, festival in
 * tv, concerto tutto esaurito, musica in cuffia, coro), Technik ohne
 * Moralkeule (online, link, file, sfondo nero, storie, social, livello,
 * podcast, app, sito per la classe), Schule und Berufswahl (diario, slide,
 * dieci e lode, un sei in matematica, verifica, esame orale, liceo classico o
 * scientifico, la scelta della scuola, orientamento, studia da cuoca,
 * elettricista, apprendista, un mestiere, il primo lavoretto estivo),
 * Freundschaft (fidati di lei, conta su di me, ti ascolto, sa dire di no,
 * amici per la pelle), Umwelt (crisi climatica, fiume in secca, estate
 * rovente, plastica in mare, pannelli solari, sciopero per il clima, riciclo,
 * meno rifiuti, monopattino), Reisen mit dem Zug (andata e ritorno, ritardo,
 * treno notturno, cuccetta, posto al finestrino, prenotare, il treno sale
 * sulla nave - die Fähre über die Meerenge nach Sizilien).
 *
 * BEZUG ZU LAND UND SPRACHE - Süden, Inseln, Tessin/Graubünden und Südtirol so
 * stark wie der Norden: le coste sarde, la cassata (Sizilien), le saline al
 * tramonto, mi piace assai, rap in napoletano, dormire in un trullo (Apulien),
 * pendolari al confine (Tessin), tedesco francese italiano e romancio (die vier
 * Landessprachen der Schweiz), panino con lo speck (Südtirol), in vaporetto
 * fino a scuola (Venedig), a spasso sotto i portici (Bologna), il pane toscano;
 * die Sprache selbst: dare del tu o del lei, accenti del nord e del sud,
 * parole straniere. (Sechs wortgleiche Zeilen mit IT-T3 und eine Paar-Zeile
 * sind beim Merge 03.10. ersetzt worden - Befund §7.)
 *
 * ZEICHENSATZ wie IT-T1 - die zwei Pflicht-Tastaturen rechnen VERSCHIEDEN:
 *   Sprosse    `it` (Windows/Mac Pro)        `it-qzerty` (Mac „Italian")
 *    7         + a                             + a
 *    8         + ò  - nur „dal falò alla sala" + m  - „ama la salsa", „ama la fama"
 *    9-16      + i e o n r t c u               + i e o n r t c u
 *   17         + m                             + v
 *   18         + v                             + p   (danach Maiusc)
 *   19         + p   (danach Maiusc)           -
 * Eine Zeile mit `ò` („dal falò alla sala", „lo farò io") hat auf der QZERTY VOR Maiusc
 * keine Sprosse (sie kommt dort nach `ì`), eine Zeile mit `m` eine frühere.
 * `minTier` (0 bis Sprosse 8, 1 für 9-16, 2 für 17-19) rechnet
 * `minTierFor(text, "it")`, nicht die Hand.
 *
 * VOR MAIUSC: jede Zeile klein, keine Satzzeichen, keine Namen, keine Frage;
 * es fehlen noch `g h b z q`, `è à é ì ù` und der Apostroph - kein „è", kein
 * „che", kein „ho/ha", keine Elision, kein „gli". JEDE ZEILE ist eine Wortgruppe
 * aus echten Wörtern ODER ein grammatisch richtiger kleiner Satz (Leitfaden
 * Falle 26) - nie Wortsalat. „e" ist hier immer „und" (der Wächter führt die
 * gelesenen Zeilen). An Sprosse 7-10 (nur Vokale a, ò, i, e) stehen darum nur
 * wenige Zeilen (Befund §2).
 *
 * Sperrliste `sperrlisteIt.ts` (Kern UND Wortbasis), keine Blasphemie-Bestandteile
 * (auch kein „oddio", „addio"), keine Nord-Süd-Klischees, Person zuerst (kein
 * „cieco"/„disabile" als Bezeichnung).
 *
 * Wächter: `tests/tastenflow-texte-it-teens-frueh.test.ts`. Nur anhängen -
 * Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_IT_WEG_FRUEH_TEENS: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: Tanz und Säle ─────────────────────
  { text: "fa salsa", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "it" },
  { text: "da sala a sala", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "it" },
  // ── Sprosse 8 (+ò) - mit dem einzigen Vokal „a" nur „falò" (QZERTY: keine Sprosse vor Maiusc); „dal falò" gehört
  // IT-T3, „falò", „al falò", „dalla sala al falò" gehören IT-T1 ──
  { text: "dal falò alla sala", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "it" },
  // ── Sprosse 9 (+i) - Saldi, Challenge, Anfeuern ───────────────────────────
  { text: "ai saldi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "fai la sfida", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "dai dai dai", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "sfidali", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 10 (+e) - Selfie, Slide, Laufsteg ─────────────────────────────
  { text: "lei fa selfie", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "fai le slide", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "lei sfila", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 11 (+o) - kurze Sätze unter Freunden ──────────────────────────
  { text: "adesso lo so", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "dillo se lo sai", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "ok dai", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "dillo a lei", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "io lo sfido", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "lei lo sa", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 12 (+n) - online, Finale, Nervosität ──────────────────────────
  { text: "sono online", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "sono in finale", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "sono in ansia", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "no dai", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "adesso no", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "le fasi finali", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "fino in fondo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "il link nel file", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 13 (+r) - Serien, Radio, das Schultagebuch ────────────────────
  { text: "adoro le serie", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "alla radio", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "nel diario", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "lo sfondo nero", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "sa dire di no", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "sono fiera di lei", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "fra sei ore", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "lo farò io", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "rido da solo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "forse no", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 14 (+t) - der Zug, Tore auswärts, Storys ──────────────────────
  { text: "il treno in ritardo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "andata e ritorno", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "nelle storie", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "la tastiera sotto le dita", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "tifosi in festa", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "tre reti in trasferta", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "tante risate", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "tiro da tre", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "salto in alto", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "fidati di lei", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "tre a tre", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "notte insonne", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 15 (+c) - Calcetto, Liceo, Sardinien und Sizilien ─────────────
  { text: "torneo di calcetto", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "carica il telefono", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "liceo classico o scientifico", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "esco con loro", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "le coste sarde", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "dieci e lode", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "tocca a te", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "lancio del disco", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "la cassata", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "cartellino rosso", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "sedici candeline", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "ti ascolto", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 16 (+u) - Zukunft, Schulwahl, tu oder Lei, der Nachtzug ───────
  { text: "sui social", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "il nostro futuro", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "suona la tastiera", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "concerto tutto esaurito", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "scusa il ritardo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "la scelta della scuola", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "dare del tu o del lei", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "sul serio", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "studia da cuoca", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "il treno notturno", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "accenti del nord e del sud", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "una cantautrice", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "a turno", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "tutto da rifare", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  { text: "la cuccetta in alto", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 17 (+m; QZERTY: die zwei „ama"-Zeilen schon an Sprosse 8) ─────
  { text: "ama la salsa", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "ama la fama", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "dormire in un trullo", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "tedesco francese italiano e romancio", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "la mia sfida", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "un film al cinema", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "un sei in matematica", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "corso di informatica", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "esame orale domani", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "allenamento di nuoto", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "il fine settimana", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "ci sentiamo", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "musica in cuffia", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "sei il mio idolo", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "crisi climatica", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "meno rifiuti", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "le saline al tramonto", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "conta su di me", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "studiare insieme", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "manca un minuto", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "fumetti in edicola", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "orientamento a scuola", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "il fiume in secca", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 18 (+v; QZERTY 17) - Video, Level, Kurve, die Fähre ───────────
  { text: "riavvia il telefono", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "ci vediamo in centro", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "salire di livello", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "verifica di matematica", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "condividi il video", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "i commenti sotto il video", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "volontari al canile", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "corso di vela", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "conto alla rovescia", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "tutti in curva", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "il treno sale sulla nave", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "diventare elettricista", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "musica dal vivo", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "il festival in tv", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "riciclo creativo", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "vietato arrendersi", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "estate rovente", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 19 (+p; QZERTY 18) - die letzte vor Maiusc: Beruf, Umwelt, Regionen ──
  { text: "la partita in diretta", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "creo un sito per la classe", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "a presto", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "prenotare il treno", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "il posto al finestrino", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "rap in napoletano", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "mi piace assai", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "le prove del coro", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "sci paralimpico", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "atleti paralimpici in pista", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "plastica in mare", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "pannelli solari sul tetto", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "sciopero per il clima", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "a scuola a piedi", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "in monopattino", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "imparare un mestiere", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "apprendista in officina", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "pendolari al confine", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "panino con lo speck", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "il primo lavoretto estivo", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "corsa campestre", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "arrampicata in parete", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "sport per tutti", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "la pallavolo femminile", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "ti aspetto fuori", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "un podcast sul calcio", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "le app sul telefono", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "parole straniere", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "in vaporetto fino a scuola", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "a spasso sotto i portici", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "il pane toscano", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
  { text: "amici per la pelle", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "it" },
];
