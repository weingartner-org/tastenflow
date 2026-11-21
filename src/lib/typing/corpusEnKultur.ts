/**
 * ENGLISCHES KULTURGUT (Textwelt-Nachlage §9, englische Seite) — ÜBERNOMMENE,
 * gemeinfreie Texte englischen Ursprungs: Sprichwörter, Fabel-Moral aus Aesop
 * (Townsend-Übersetzung 1867), traditionelle Kinderreime (Mother Goose) und
 * klassische Zitate. Ausdrücklich KEINE Übersetzungen aus dem Deutschen — jede
 * Zeile hat ihren Ursprung im Englischen.
 *
 * Rechte (§10, Herkunft-Feld Pflicht bei übernommenen Texten): Alle Quellen sind
 * gemeinfrei (Volksgut bzw. Autoren, deren Werk seit weit über 70 Jahren
 * gemeinfrei ist). Die `herkunft`-Angaben speisen den Bereich „Quellen & Dank".
 *
 * Warum diese Ebene erst ab T3: Echte Quellentexte respektieren die
 * Buchstaben-Freischaltung nicht. Auf T1/T2 fehlen im Englischen „the", „you",
 * „day", „have" — dort wird getextet (siehe corpusEnErstleser/corpusEnT2), hier
 * wird zitiert.
 *
 * Wortlaut: Apostrophe und Anführungszeichen sind bewusst aufgelöst bzw.
 * weggelassen (fitText streicht sie unterhalb von T5 ersatzlos). Wo dadurch der
 * Wortlaut gekürzt ist, bleibt die Aussage unverändert.
 *
 * Entdoppelt gegen den GESAMTEN englischen Bestand — die bereits vorhandenen
 * Klassiker („A stitch in time saves nine", „Look before you leap" usw.) kommen
 * hier NICHT noch einmal vor. Append-only an CORPUS_EN → Ledger-Indizes stabil.
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

/** S3: Kinderreime sind Vorschul-Tonlage - sie bleiben bei kids. */
const NUR_KIDS: Stufe[] = ["kids"];
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
/** Englisches Sprichwort — Volksgut ohne Einzelurheber. */
const SPRICHWORT: Herkunft = {
  quelle: "Englisches Sprichwort (Volksgut)",
  lizenz: "gemeinfrei",
};

/** Fabel-Moral aus Aesop in der klassischen englischen Übersetzung. */
/** Frei umlaufende Nacherzählung eines Aesop-Gedankens (nicht Townsends Wortlaut). */
const AESOP_FREI: Herkunft = {
  quelle: "Nach Aesop, freie moderne Übertragung (nicht der Townsend-Wortlaut)",
  lizenz: "gemeinfreier Stoff; Formulierung frei umlaufend",
  autor: "Aesop (Stoff)",
};

const AESOP: Herkunft = {
  quelle: "Aesop's Fables, englische Übersetzung von George Fyler Townsend (1867)",
  lizenz: "gemeinfrei",
  autor: "Aesop / George Fyler Townsend",
  fundstelle: "Project Gutenberg, Aesop's Fables (Townsend)",
};

/** Traditioneller englischer Kinderreim. */
const REIM: Herkunft = {
  quelle: "Traditioneller englischer Kinderreim (Mother Goose)",
  lizenz: "gemeinfrei",
};

const SHAKESPEARE: Herkunft = {
  quelle: "William Shakespeare, Dramen",
  lizenz: "gemeinfrei",
  autor: "William Shakespeare",
};

const FRANKLIN: Herkunft = {
  quelle: "Benjamin Franklin, Poor Richard's Almanack",
  lizenz: "gemeinfrei",
  autor: "Benjamin Franklin",
};

const CARROLL: Herkunft = {
  quelle: "Lewis Carroll, Alice's Adventures in Wonderland (1865)",
  lizenz: "gemeinfrei",
  autor: "Lewis Carroll",
};

const DICKINSON: Herkunft = {
  quelle: "Emily Dickinson, Hope is the thing with feathers",
  lizenz: "gemeinfrei",
  autor: "Emily Dickinson",
};

const ALCOTT: Herkunft = {
  quelle: "Louisa May Alcott, Little Women (1868)",
  lizenz: "gemeinfrei",
  autor: "Louisa May Alcott",
};

const HALE: Herkunft = {
  quelle: "Sarah Josepha Hale, Mary had a Little Lamb (1830)",
  lizenz: "gemeinfrei",
  autor: "Sarah Josepha Hale",
};

const TAYLOR: Herkunft = {
  quelle: "Jane Taylor, The Star (1806)",
  lizenz: "gemeinfrei",
  autor: "Jane Taylor",
};

/** Englische Sprichwörter — Volksgut, im Bestand noch nicht vorhanden. */
const EN_SPRICHWOERTER: CorpusItem[] = [
  { text: "A chain is only as strong as its weakest link.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Every dog has its day.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Fortune favours the bold.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Never put off until tomorrow what you can do today.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "One good turn deserves another.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Blood is thicker than water.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "A fool and his money are soon parted.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Empty vessels make the most noise.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "He who hesitates is lost.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "If the shoe fits, wear it.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "It takes two to tango.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Least said, soonest mended.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Learn to walk before you run.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Money does not grow on trees.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Nothing ventured, nothing gained.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "One swallow does not make a summer.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "People in glass houses should not throw stones.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "There is no smoke without fire.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Time and tide wait for no man.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Waste not, want not.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "What goes around comes around.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "You can lead a horse to water but not make it drink.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "A friend to all is a friend to none.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Cut your coat according to your cloth.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "There is no rose without a thorn.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Hope for the best and prepare for the worst.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "If at first you do not succeed, try, try again.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Live and let live.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Once bitten, twice shy.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Prevention is better than cure.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Silence is golden.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "The more the merrier.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "There is a first time for everything.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Variety is the spice of life.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Well begun is half done.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "A change is as good as a rest.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Charity begins at home.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "Good things come to those who wait.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Great oaks from little acorns grow.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Out of sight, out of mind.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "There is no place like home.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Two wrongs do not make a right.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "You reap what you sow.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
  { text: "Absence makes the heart grow fonder.", kind: "sprichwort", stufen: TEENS_ERW, herkunft: SPRICHWORT },
  { text: "United we stand, divided we fall.", kind: "sprichwort", stufen: ALLE_DREI, herkunft: SPRICHWORT },
];

/** Fabel-Moral aus Aesop (Townsend 1867). */
const EN_AESOP: CorpusItem[] = [
  { text: "Little friends may prove great friends.", kind: "spruch", stufen: ALLE_DREI, herkunft: AESOP },
  // Nicht der Townsend-Wortlaut, sondern eine jüngere, frei umlaufende
  // Übertragung des Aesop-Gedankens — darum eigene Herkunft (TN-E13,
  // Prüfbericht 27.07.: „Ein Wackler" bei der Quellenangabe).
  { text: "No act of kindness, however small, is ever wasted.", kind: "spruch", stufen: ALLE_DREI, herkunft: AESOP_FREI },
  { text: "It is easy to despise what you cannot get.", kind: "spruch", stufen: ALLE_DREI, herkunft: AESOP },
  { text: "A liar will not be believed even when he speaks the truth.", kind: "spruch", stufen: ALLE_DREI, herkunft: AESOP },
  { text: "Familiarity breeds contempt.", kind: "spruch", stufen: TEENS_ERW, herkunft: AESOP },
  { text: "The gods help them that help themselves.", kind: "spruch", stufen: ALLE_DREI, herkunft: AESOP },
  { text: "Better a certain enemy than a doubtful friend.", kind: "spruch", stufen: TEENS_ERW, herkunft: AESOP },
  { text: "Persuasion is better than force.", kind: "spruch", stufen: ALLE_DREI, herkunft: AESOP },
  { text: "Appearances are often deceptive.", kind: "spruch", stufen: ALLE_DREI, herkunft: AESOP },
  { text: "Self-help is the best help.", kind: "spruch", stufen: ALLE_DREI, herkunft: AESOP },
  { text: "Gratitude is the sign of noble souls.", kind: "spruch", stufen: TEENS_ERW, herkunft: AESOP },
  { text: "Much wants more and loses all.", kind: "spruch", stufen: TEENS_ERW, herkunft: AESOP },
];

/** Traditionelle englische Kinderreime (erste Zeilen). */
const EN_REIME: CorpusItem[] = [
  { text: "Twinkle, twinkle, little star, how I wonder what you are.", kind: "spruch", stufen: NUR_KIDS, herkunft: TAYLOR },
  { text: "Hickory, dickory, dock, the mouse ran up the clock.", kind: "spruch", stufen: NUR_KIDS, herkunft: REIM },
  { text: "Jack and Jill went up the hill to fetch a pail of water.", kind: "spruch", stufen: NUR_KIDS, herkunft: REIM },
  { text: "Rain, rain, go away, come again another day.", kind: "spruch", stufen: NUR_KIDS, herkunft: REIM },
  { text: "Hey diddle diddle, the cat and the fiddle.", kind: "spruch", stufen: NUR_KIDS, herkunft: REIM },
  { text: "Little Bo Peep has lost her sheep.", kind: "spruch", stufen: NUR_KIDS, herkunft: REIM },
  { text: "Humpty Dumpty sat on a wall.", kind: "spruch", stufen: NUR_KIDS, herkunft: REIM },
  { text: "Row, row, row your boat, gently down the stream.", kind: "spruch", stufen: NUR_KIDS, herkunft: REIM },
  { text: "Star light, star bright, first star I see tonight.", kind: "spruch", stufen: NUR_KIDS, herkunft: REIM },
  { text: "Mary had a little lamb, its fleece was white as snow.", kind: "spruch", stufen: NUR_KIDS, herkunft: HALE },
];

/** Klassische englische Zitate (gemeinfrei). */
const EN_ZITATE: CorpusItem[] = [
  { text: "To be, or not to be, that is the question.", kind: "spruch", stufen: TEENS_ERW, herkunft: SHAKESPEARE },
  { text: "Brevity is the soul of wit.", kind: "spruch", stufen: TEENS_ERW, herkunft: SHAKESPEARE },
  { text: "The course of true love never did run smooth.", kind: "spruch", stufen: TEENS_ERW, herkunft: SHAKESPEARE },
  { text: "Well done is better than well said.", kind: "spruch", stufen: ALLE_DREI, herkunft: FRANKLIN },
  { text: "Lost time is never found again.", kind: "spruch", stufen: ALLE_DREI, herkunft: FRANKLIN },
  { text: "Early to bed and early to rise makes a man healthy, wealthy, and wise.", kind: "spruch", stufen: ALLE_DREI, herkunft: FRANKLIN },
  { text: "Begin at the beginning and go on till you come to the end.", kind: "spruch", stufen: ALLE_DREI, herkunft: CARROLL },
  { text: "Hope is the thing with feathers that perches in the soul.", kind: "spruch", stufen: TEENS_ERW, herkunft: DICKINSON },
  { text: "I am not afraid of storms, for I am learning how to sail my ship.", kind: "spruch", stufen: ALLE_DREI, herkunft: ALCOTT },
];

export const EN_KULTUR_CORPUS: CorpusItem[] = [
  ...EN_SPRICHWOERTER,
  ...EN_AESOP,
  ...EN_REIME,
  ...EN_ZITATE,
];
