/**
 * Korpus nur für Lernweg "it", frühe Sprossen 7-19 - Altersstufe Erwachsene
 * (IT-T3, 03.10.2026, Bauplan `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §1
 * D2-D4, §3, §5; Befund `BEFUND-2026-10-02-IT-T3-ERWACHSENE-FRUEH.md`). Vorgehen
 * nach dem Piloten IT-T1 (`BEFUND-2026-10-02-IT-T1-KIDS-FRUEH.md` §6).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF ITALIENISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz
 * (darum kein `herkunft`). Tatoeba (nur Originalsätze) diente als WORTLISTE je
 * Sprosse. Keine Zeile der Kinder-Charge (`corpusItWegFruehKids.ts`) ist kopiert
 * oder nur abgewandelt - der Wächter prüft Text, Ledger-Schlüssel und Paare.
 *
 * ZEICHENSATZ wie IT-T1 (`lernweg.ts` `IT_LETTER_ORDER`). ⚠️ Die zwei
 * Pflicht-Tastaturen rechnen VERSCHIEDEN:
 *   Sprosse    `it` (Windows/Mac Pro)            `it-qzerty` (Mac „Italian")
 *    7         + a  - nur „salda la falla"         + a
 *    8         + ò  - nur „falò"                   + m  - „alla mamma"
 *    9-16      + i e o n r t c u                   + i e o n r t c u
 *   17         + m                                 + v
 *   18         + v                                 + p   (danach Maiusc)
 *   19         + p   (danach Maiusc)               -
 * Eine Zeile mit `ò` hat auf der QZERTY VOR Maiusc keine Sprosse (sie kommt dort
 * nach `ì`), eine Zeile mit `m` eine frühere. `minTier` rechnet
 * `minTierFor(text, "it")`, nicht die Hand.
 *
 * VOR MAIUSC: alles klein, keine Satzzeichen (auch kein Komma in Aufzählungen:
 * „carta plastica e vetro"), keine Namen (Orte, Feste, Firmen, Personen kommen
 * nach Maiusc), keine Frage. Es fehlen noch `g h b z q`, `è à é ì ù` und der
 * Apostroph: kein „è", kein „ho/ha", kein „che", kein „gli", keine Elision, kein
 * Passato prossimo mit „avere", kein Wochentag ausser „domenica", kein Monat.
 * Vor Vokal darum nur „un" (männlich) oder Mehrzahl; „lo" vor s+Konsonant
 * („lo sciopero", „lo speck", „allo sportello"); nie „i" vor s+Konsonant.
 *
 * ERWACHSENENWELT, sachlich, nie kindlich, nie belehrend: Arbeit (Schicht,
 * Überstunden, Sitzung, Vertrag, „la tredicesima", „il posto fisso", Streik,
 * Gewerkschaft, Lebenslauf), Ämter (codice fiscale, tessera sanitaria, nulla
 * osta, Geburtsurkunde, Konsulat, Schalter der Gemeinde, „si riceve su
 * appuntamento"), Wohnen (Miete, Umzug, Heizkessel, Zähler, Nebenkosten,
 * Gegensprechanlage), Geld (Konto, Steuern, Hypothek, „arrivare a fine mese"),
 * Gesundheit (Analysen, Rezept, Hausarzt, Notaufnahme, Blutdruck, Grauer Star,
 * Augenarzt), Migration (Konsulat, Dokumente übersetzen, Kulturvermittlerin,
 * Italienischkurs für Erwachsene, „in estate torno al paese"), Weiterbildung
 * (Abendkurs, Studium), Nachrichten-Ton (Stau, Streik, Krise, Tourismus).
 * Wer neu oder nach einer Erblindung tippen lernt: Tastatur, „il tasto invio",
 * „la sintesi vocale", „ascolto le mail", Dateien, Gross- und Kleinbuchstaben.
 *
 * BEZUG ZU LAND UND SPRACHE - Süden und Inseln so stark wie der Norden, dazu
 * Tessin, Graubünden und Südtirol:
 *  · Süden/Inseln: le saline, le serre, la tonnara, „arancine o arancini"
 *    (Palermo/Catania), il canto a tenore, il cantastorie, il mirto, un trullo,
 *    il frantoio, il caciocavallo, la caponata, la pastiera, il peperoncino.
 *  · Mitte: olive ascolane, „strofinaccio o cencio" (Geosynonym, Recherche
 *    `texte-quellen.md` §3.1), le contrade del palio, cacio e pepe.
 *  · Norden: il lesso, il risotto, una cascina in pianura, trofie al pesto,
 *    „friulano e sloveno", il fieno nella stalla.
 *  · Südtirol: un maso in valle, lo speck. Tessin/Graubünden: i frontalieri,
 *    un rustico ticinese, la cassa malati, „italiano tedesco e romancio".
 *  · Die Sprache selbst: dialetto e italiano, accento acuto, accenti e
 *    apostrofi, maiuscole e minuscole, la tastiera italiana.
 * Sachangaben stehen keine in den Zeilen (keine Zahl, kein Name, kein Datum).
 * Sperrliste `sperrlisteIt.ts` (Kern UND Wortbasis), auch kein Doppelsinn-Wort.
 *
 * Wächter: `tests/tastenflow-texte-it-erwachsene-frueh.test.ts` (Sprosse je
 * Zeile AUSGERECHNET auf `it` UND `it-qzerty`, Kleinschreibung, Wortgrenze 8,
 * Sperrliste, Wortschatz, keine Kopien/Paare - auch gegen IT-T1 -, jede Einheit
 * hat an ihrer Sprosse eine Zeile). Nur anhängen - Korpus-Anker im selben Commit
 * (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_IT_WEG_FRUEH_ERWACHSENE: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: eine Wortgruppe (Werkstatt) ────────
  { text: "salda la falla", kind: "satz", stufen: ["erwachsen"], minTier: 0, nurWeg: "it" },
  // ── Sprosse 8 (+ò) - mit „a" nur „falò" (QZERTY: keine Sprosse vor Maiusc) ──
  { text: "dal falò", kind: "satz", stufen: ["erwachsen"], minTier: 0, nurWeg: "it" },
  // ── Sprosse 9 (+i) - Schlussverkauf, Streit, Ampulle ─────────────────────
  { text: "i saldi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "i dissidi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "la fiala", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "sa di falò", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 10 (+e) - Büro: Sitz, Filialen, Dateien, Folien ──────────────
  { text: "il sedile", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "le slide", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "i file della sede", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "la sede e le filiali", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 11 (+o) - Haus, Küche, Geld, Dosis ───────────────────────────
  { text: "la dose", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il solaio", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il lesso", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "lo dissi io", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "idee solide", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "i soldi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 12 (+n) - Büro, Gesundheit, Salinen, Heu ─────────────────────
  { text: "sono in sede", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "sono in fila", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "le analisi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "ansia e insonnia", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "le saline", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "lo so da anni", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il fieno", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "fino alle sei", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "i fondi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "i danni", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 13 (+r) - Arbeitszeit, Gewächshäuser, Schnupfen ──────────────
  { text: "orari fissi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "le serre", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il raffreddore", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "dire di no", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il fornaio", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "fare affari", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "le risorse", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 14 (+t) - Steuern, Termine, Urlaub, Miete, Thunfisch, Dialekt ─
  { text: "la tastiera italiana", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "le tasse arretrate", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "sono in ritardo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "resti in linea", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "dalla dottoressa", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "le date delle ferie", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il rientro dalle ferie", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "affitti alti", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "i dati", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "otto ore di fila", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il risotto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "dal notaio", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "dal dentista", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il ferro da stiro", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "la tonnara", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "dialetto e italiano", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il fieno nella stalla", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il sarto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "internet lento", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "tre ore di straordinario", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "la tessera sanitaria", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 15 (+c) - Ämter, Konto, Vertrag, Rezept, Umzug, Sprachvarianten ─
  { text: "lo dicono alla radio", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il codice fiscale", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il conto corrente", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il contratto scade", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "la ricetta elettronica", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il corso serale", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il certificato di nascita", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "i conti tornano", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "cerco casa", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "ascolto la radio", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "accedi al sito", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "traffico intenso", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "i clienti fissi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "nonostante la crisi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "arancine o arancini", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "i crediti del corso", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "la sede del sindacato", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "fare ricorso", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "in fila al consolato", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "le radici", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il canto a tenore", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il cantastorie", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "la cassiera", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "la caldaia non si accende", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il trasloco", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "dieci scatoloni in cantina", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il colesterolo alto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "strofinaccio o cencio", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "la seconda a destra", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il fisco", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 16 (+u) - Sitzung, Schicht, Studium, Stau, Trullo, Rustico ────
  { text: "la riunione dura due ore", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il turno di notte", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "una laurea in lettere", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il cellulare scarico", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "la cuoca del ristorante", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "studenti fuori sede", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "code in autostrada", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "tutti in riunione", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il nulla osta", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "il contatore della luce", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "un trullo in affitto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "un rustico ticinese", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "i cantautori", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "accento acuto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  { text: "fuori orario", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "it" },
  // ── Sprosse 17 (+m; QZERTY: „alla mamma" schon an Sprosse 8) - Kredit, Vermittlung, Graubünden ──
  { text: "alla mamma", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il mutuo a tasso fisso", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la mediatrice culturale", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "maiuscole e minuscole", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il medico curante", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "una mail al comune", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "ci sentiamo domani", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la cassa malati", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il mirto", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "italiano tedesco e romancio", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la tredicesima", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il mercato rionale", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "tradurre i documenti", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "mi manca il mare", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "dal commercialista", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "domani in fiera", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "ascolto le mail", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "i moduli da firmare", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 18 (+v; QZERTY 17) - Tastatur, Sprachausgabe, Arbeit, Rechte, Friaul ──
  { text: "le olive al frantoio", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il caciocavallo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "olive ascolane", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il tasto invio", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la sintesi vocale", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "salva il file", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "scrivo una mail", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "cerco lavoro", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "lavoro da casa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "diritti e doveri", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "serve un idraulico", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "friulano e sloveno", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "un intervento alla cataratta", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "arrivare a fine mese", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la nuova sindaca", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "un maso in valle", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la vendemmia", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la visita oculistica", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il diritto di voto", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "invio il curriculum", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il vicino di casa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  // ── Sprosse 19 (+p; QZERTY 18) - die letzte vor Maiusc: Streik, Grenze, Ämter, Küche der Regionen ──
  { text: "il posto fisso", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "lo sciopero dei treni", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "i frontalieri passano il confine", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "le spese del condominio", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "troppi turisti in centro", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "al pronto soccorso", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la pressione alta", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "apri il file", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "rispondo al citofono", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "cornetto e cappuccino", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "trofie al pesto", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "lo speck", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la caponata", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "in pensione da poco", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "nessuno risponde", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "accenti e apostrofi", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "una cascina in pianura", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il rinnovo del passaporto", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "allo sportello del comune", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la stampante non stampa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "prenotare la visita", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "carta plastica e vetro", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il treno dei pendolari", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "in estate torno al paese", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il computer portatile", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "si riceve su appuntamento", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "i volontari della pro loco", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il corso di italiano per adulti", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "le contrade del palio", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "cacio e pepe", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la pastiera", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "il peperoncino", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
  { text: "la casa di riposo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "it" },
];
