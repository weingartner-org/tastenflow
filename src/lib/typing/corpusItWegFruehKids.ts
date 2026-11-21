/**
 * Korpus nur für Lernweg "it", frühe Sprossen 7-19 - Altersstufe Kids (IT-T1,
 * 03.10.2026, Bauplan `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §1 D2-D4,
 * §3, §5; Befund `BEFUND-2026-10-02-IT-T1-KIDS-FRUEH.md`). Der PILOT der neun
 * italienischen Text-Chargen: das Vorgehen steht im Befund §6.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF ITALIENISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz
 * (darum auch kein `herkunft`). Tatoeba (nur Originalsätze) diente als WORTLISTE:
 * welche Wörter an welcher Sprosse schreibbar und in Gebrauch sind.
 *
 * ZEICHENSATZ (`lernweg.ts` `IT_LETTER_ORDER`; „Sprosse" = Anzahl gelernter
 * Einheiten von `introOrder("it")` - vor Maiusc dasselbe wie die Zahl der
 * Buchstaben). ⚠️ Die zwei Pflicht-Tastaturen rechnen VERSCHIEDEN:
 *   Sprosse    `it` (Windows/Mac Pro)        `it-qzerty` (Mac „Italian")
 *    7         + a  - erste Wörter (la, sala)  + a
 *    8         + ò  - nur „falò"               + m  - nur „mamma", „dama"
 *    9-16      + i e o n r t c u               + i e o n r t c u
 *   17         + m                             + v
 *   18         + v                             + p   (danach Maiusc)
 *   19         + p   (danach Maiusc)           -
 * Auf der QZERTY sitzt `m` in der Grundreihe, `ò` kommt erst nach `ì` (F4-it,
 * `achteGrundtasten`): eine Zeile mit `ò` hat dort VOR Maiusc keine Sprosse,
 * eine Zeile mit `m` eine frühere. Der Wächter rechnet jede Zeile auf beiden.
 * `minTier` (0 bis Sprosse 8, 1 für 9-16, 2 für 17-19) rechnet
 * `minTierFor(text, "it")`, nicht die Hand.
 *
 * VOR MAIUSC GIBT ES KEINE GROSSBUCHSTABEN UND KEINE SATZZEICHEN: jede Zeile ist
 * klein, ohne Punkt und Komma, darum auch keine Namen (Orte, Feste, Personen
 * kommen in den Chargen nach Maiusc) und keine Frage. Es fehlen noch `g h b z q`,
 * `è à é ì ù` und der Apostroph (Nr. 26): kein „è" (ist), kein „che", kein
 * „ho/ha", keine Elision - also kein „l'uva", kein „un'amica", kein „gli".
 * Wörter mit Vokal am Anfang stehen darum ohne Artikel oder mit „un", „una",
 * „le", Possessiv („la mia amica", „i miei nonni"); männliche s+Konsonant-
 * Wörter nur in der Einzahl mit „lo" („lo scoiattolo").
 *
 * JEDE ZEILE ist ENTWEDER eine kleine Wortgruppe aus echten Wörtern ODER ein
 * grammatisch richtiger, sinnvoller kleiner Satz (Leitfaden Falle 26) - nie
 * Wortsalat. Lieber wenige saubere Zeilen: an Sprosse 7 gibt es nur den Vokal
 * „a" (5 Zeilen), an Sprosse 8 die `ò` nur in „falò" (3 Zeilen), auf der QZERTY
 * an Sprosse 8 die `m` nur in „mamma" und „dama" (3 Zeilen).
 *
 * BEZUG ZU LAND UND SPRACHE, soweit die Buchstaben es erlauben - der Süden und
 * die Inseln, Tessin und Südtirol so stark wie der Norden:
 *  · Süden/Inseln: „fare la salsa" (Tomaten im Spätsommer), taralli, tarantella,
 *    cannoli con la ricotta, arance rosse, sardine/riso al forno, cicale,
 *    lucertola, limoni, raccolta delle olive, mandolino, pastori del presepe,
 *    teatro dei pupi, pecorino sardo, „il nonno parla sardo", la nave verso le
 *    isole, il vulcano.
 *  · Mitte/Norden: focaccia (Ligurien), torta della nonna (Toskana), piadina
 *    (Romagna), polenta nel paiolo (auch Tessin), panettone o pandoro,
 *    caldarroste (auch Tessin), il treno nel tunnel (Gotthard), camoscio,
 *    marmotta, cervo.
 *  · Südtirol: lo strudel di mele, „parlo italiano e tedesco", „in valle si
 *    parla ladino".
 *  · Die Sprache selbst: „nonno e nono" (le doppie), „effe ed esse", „vocali e
 *    consonanti", „riordina le frasi"; das Spiel „un due tre stella",
 *    nascondino, „mamma mia".
 * Sperrliste `sperrlisteIt.ts` (Kern UND Wortbasis - in frühen Kinderzeilen
 * auch kein Doppelsinn-Wort im Zusammenhang); Geosynonyme nur panitalienisch
 * („cocomero").
 *
 * Wächter: `tests/tastenflow-texte-it-kids-frueh.test.ts` (Sprosse je Zeile
 * AUSGERECHNET auf `it` UND `it-qzerty`, Kleinschreibung, Wortgrenze 8,
 * Sperrliste, Wortbasis, keine Kopien/Paare, jede Einheit hat an ihrer Sprosse
 * eine Zeile). Nur anhängen - Korpus-Anker im selben Commit
 * (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_IT_WEG_FRUEH_KIDS: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: kleine Wortgruppen ────────────────
  { text: "la sala", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "it" },
  { text: "fa la salsa", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "it" },
  { text: "sala la salsa", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "it" },
  { text: "dalla sala", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "it" },
  { text: "alla sala", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "it" },
  // ── Sprosse 8 (+ò) - mit dem einzigen Vokal „a" nur „falò" (QZERTY: keine Sprosse vor Maiusc) ──
  { text: "falò", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "it" },
  { text: "al falò", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "it" },
  { text: "dalla sala al falò", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "it" },
  // ── Sprosse 9 (+i) - il, i, di, fai: Spiel und Schule ─────────────────────
  { text: "i dadi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "fai la fila", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "la sfida", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "sa di salsa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "i sassi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il falò", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 10 (+e) - le, e, ed, sei: Klasse, Buchstabennamen ─────────────
  { text: "le file di sedie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "la sella", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "le idee", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "sei fedele", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "la difesa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "effe ed esse", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "sei sfide", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 11 (+o) - sole, isole, olio: erste kleine Sätze ───────────────
  { text: "il sole sale", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "olio e sale", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "le isole", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "le allodole", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "fallo da solo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "io e lei", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "la folla", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il filo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 12 (+n) - non, nonno, nanna, onde; le doppie ──────────────────
  { text: "il nonno fa la nanna", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "non lo so", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il sole e le onde", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il leone e la iena", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il nido delle allodole", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "io non sono solo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "nonno e nono", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "i delfini nelle onde", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "lei andò al falò", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "alla fine", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "sono io", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 13 (+r) - Wetter, Tiere, Essen aus dem Ofen ───────────────────
  { text: "fa freddo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "le rose rosse", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "le rane nel fosso", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il re leone", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il nonno ride", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "sardine al forno", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "riso al forno", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "loro sono in ferie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "riordina le frasi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "era sera", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "ieri sera", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 14 (+t) - Fest, Abend, Familie, der Zug ───────────────────────
  { text: "stasera si fa festa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "la torta della nonna", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "sotto il letto", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "tante stelle stasera", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "allo stadio", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "fratelli e sorelle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "non tornare tardi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "la tenda sotto le stelle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "torna il sole", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il treno delle sette", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "e ora a letto", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 15 (+c) - ciao, casa, classe; Essen aus Süd und Nord ──────────
  { text: "taralli fatti in casa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il cane corre", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "fa caldo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "conta fino a dieci", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "focaccia calda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "i cannoli con la ricotta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "le cicale cantano", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "entra in classe", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il cielo sereno", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "a cena con i nonni", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "le arance rosse", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "ecco il cane", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "torno a casa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il riccio si nasconde", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "ciao nonna", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "lo scoiattolo rosso", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 16 (+u) - un, una, tutti, scuola; Pause und Spiele ────────────
  { text: "la luna e le stelle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "tutti a scuola", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "in autunno si fanno le caldarroste", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "un tuffo nelle onde", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il succo di frutta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "un cucciolo di cane", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "tutti fuori in cortile", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "un due tre stella", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "suonano la tarantella", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "accendi la luce", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "la lucertola al sole", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il treno nel tunnel", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "il delfino nuota", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  { text: "ciao a tutti", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 17 (+m; QZERTY: Zeilen nur mit `m` und der Grundreihe an Sprosse 8) ──
  { text: "lo strudel di mele", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la mamma sa", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "dalla mamma", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la dama", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la merenda in cortile", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la maestra ci ascolta", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "domenica al mare", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il camoscio sale sulle rocce", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la marmotta dorme", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "mele e mirtilli", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "mamma mia", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "limoni al sole", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la cicala e la formica", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "al mercato con la mamma", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "matite colorate", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "tutti insieme", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "a domani", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "i miei nonni", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "facciamo musica", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "facciamo a nascondino", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "una fetta di cocomero", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "le corde del mandolino", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la mia amica ride", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 18 (+v; QZERTY 17) - Wetter, Tiere, Berge und Meer ────────────
  { text: "nevica sui tetti", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il vento soffia forte", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "le nuvole nere", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il cavallo trotta", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la raccolta delle olive", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la nave va verso le isole", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "vocali e consonanti", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "suona il violino", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il cervo nella valle", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "vado a scuola", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "veloce come il vento", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "vieni con me", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "in inverno si va a sciare", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la neve fresca", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "le rondini volano", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il vulcano erutta lava", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 19 (+p; QZERTY 18) - die letzte vor Maiusc: Feste, Sprachen, Alltag ──
  { text: "piove e fa freddo", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "suona la campanella", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "pasta al pomodoro", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il pecorino sardo", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "la polenta nel paiolo", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "i pastori del presepe", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il teatro dei pupi", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "andiamo al parco", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "passa il pallone", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "una piadina per merenda", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "parlo italiano e tedesco", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "in valle si parla ladino", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "le api e i fiori", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "una volpe nel prato", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "prima i compiti e poi il parco", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "panettone o pandoro", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "una pera matura", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "imparo a scrivere", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "un panino per favore", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il pastore e le pecore", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "in palestra con la tuta", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "metti le scarpe", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il pettirosso canta", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il nonno parla sardo", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
  { text: "il pescatore torna in porto", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "it" },
];
