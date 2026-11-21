/**
 * ENGLISCHE WITZ-VIELFALT (Textwelt-Nachlage §9, englische Seite).
 *
 * Befund aus der Bestandsprüfung: Der englische Witz-Bestand ist formal
 * monoton — 39 Zeilen beginnen mit „What do you call …", 34 mit „Why did the …".
 * Wer übt, tippt also immer wieder dieselbe Schablone. Diese Charge bringt
 * bewusst ANDERE Formen: Knock-knock, Arzt- und Kellner-Dialoge, Lehrer-Schüler,
 * Einzeiler und Sprach-/Buchstabenspiele. Damit sinkt der Anteil der
 * Frage-Antwort-Schablone deutlich, ohne dass ein Bestand gelöscht werden muss.
 *
 * Rechte (§10): eigenes Werk bzw. frei umlaufendes englisches Witzgut ohne
 * Einzelurheber (klassische Knock-knock- und Kellner-Dialoge sind Gemeingut).
 *
 * Wahrheitsgehalt der `wortspiel`-Zeilen: Alle Behauptungen über Wörter
 * (Anagramme, Palindrome, Doppelbuchstaben) wurden nachgerechnet.
 *
 * Apostrophe werden vermieden (fitText streicht sie unter T5 ersatzlos) — daher
 * durchgehend „do not", „it is", „cannot". Append-only an CORPUS_EN →
 * Ledger-Indizes stabil.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
/** Knock-knock — die klassische englische Form, im Bestand bisher gar nicht da. */
const EN_KNOCK_KNOCK: CorpusItem[] = [
  { text: "Knock knock. Who is there? Lettuce. Lettuce who? Lettuce in, it is cold out here!", kind: "witz", stufen: ALLE_DREI },
  { text: "Knock knock. Who is there? Boo. Boo who? Do not cry, it is only a joke.", kind: "witz", stufen: ALLE_DREI },
  { text: "Knock knock. Who is there? Cows go. Cows go who? No, cows go moo.", kind: "witz", stufen: KIDS_TEENS },
  { text: "Knock knock. Who is there? Olive. Olive who? Olive right next door.", kind: "witz", stufen: ALLE_DREI },
  { text: "Knock knock. Who is there? Tank. Tank who? You are welcome.", kind: "witz", stufen: ALLE_DREI },
  { text: "Knock knock. Who is there? Needle. Needle who? Needle little help with the door.", kind: "witz", stufen: ALLE_DREI },
];

/** Dialog-Witze: Arzt, Kellner, Bar, Schule. */
const EN_DIALOG: CorpusItem[] = [
  { text: "Doctor, I feel like a pair of curtains. Then pull yourself together.", kind: "witz", stufen: ALLE_DREI },
  { text: "Doctor, I keep thinking I am a bell. Take these and ring me in the morning.", kind: "witz", stufen: ALLE_DREI },
  { text: "Doctor, nobody ever listens to me. Next patient, please.", kind: "witz", stufen: TEENS_ERW },
  { text: "Waiter, there is a fly in my drink. Do not shout, everyone will want one.", kind: "witz", stufen: ALLE_DREI },
  { text: "Waiter, this bread is stale. So is that joke, but here we are.", kind: "witz", stufen: TEENS_ERW },
  // R2-Doppelpunkt-Sweep: Ein Doppelpunkt, der wörtliche Rede oder eine
  // Sprecher-Zeile einleitet, wird auch im Englischen groß fortgesetzt
  // (Chicago 6.61 / New Hart's Rules). Fragmente nach Doppelpunkt bleiben klein
  // — deshalb ist z. B. „I invented a new word: plagiarism." unverändert.
  { text: "A horse walks into a bar. The barman asks: So, long face?", kind: "witz", stufen: TEENS_ERW },
  { text: "A sandwich walks into a bar. Sorry, we do not serve food here.", kind: "witz", stufen: TEENS_ERW },
  { text: "Teacher: Name two days that start with T. Pupil: Today and tomorrow.", kind: "witz", stufen: ALLE_DREI },
  { text: "Teacher: Where is the English Channel? Pupil: Not on our television.", kind: "witz", stufen: ALLE_DREI },
  { text: "Teacher: How do you spell crocodile? Pupil: K R O K O D I L E. Teacher: That is wrong. Pupil: You asked how I spell it.", kind: "witz", stufen: ALLE_DREI },
  { text: "Two fish are in a tank. One says: Do you know how to drive this thing?", kind: "witz", stufen: ALLE_DREI },
  { text: "Two windmills stand in a field. One asks: What music do you like? The other says: I am a big metal fan.", kind: "witz", stufen: ALLE_DREI },
];

/** Einzeiler — die zweite große englische Witzform. */
const EN_EINZEILER: CorpusItem[] = [
  { text: "I told my suitcase we are not going on holiday. Now I am dealing with emotional baggage.", kind: "witz", stufen: TEENS_ERW },
  { text: "I stayed up all night wondering where the sun went. Then it dawned on me.", kind: "witz", stufen: ALLE_DREI },
  { text: "I only know twenty-five letters of the alphabet. I do not know y.", kind: "witz", stufen: ALLE_DREI },
  { text: "I would tell you a joke about the roof, but it is over your head.", kind: "witz", stufen: ALLE_DREI },
  { text: "I asked the librarian for books on paranoia. She whispered: They are right behind you.", kind: "witz", stufen: TEENS_ERW },
  { text: "My friend keeps saying cheer up, it could be worse. So I did, and it was.", kind: "witz", stufen: TEENS_ERW },
  { text: "The past, the present and the future walked into a bar. It was tense.", kind: "witz", stufen: TEENS_ERW },
  { text: "Two aerials met on a roof and got married. The wedding was poor, but the reception was excellent.", kind: "witz", stufen: TEENS_ERW },
  { text: "A clean desk is a sign of a cluttered drawer.", kind: "witz", stufen: TEENS_ERW },
  { text: "I have a joke about time travel, but you did not like it.", kind: "witz", stufen: ALLE_DREI },
  { text: "My dog used to chase people on a bike. I had to take the bike away.", kind: "witz", stufen: ALLE_DREI },
  { text: "The rotation of the earth really makes my day.", kind: "witz", stufen: ALLE_DREI },
  { text: "I used to be indecisive, but now I am not so sure.", kind: "witz", stufen: ALLE_DREI },
  { text: "I once had a job crushing cans. It was soda pressing.", kind: "witz", stufen: ALLE_DREI },
  { text: "My friend told me to stop impersonating a flamingo. I had to put my foot down.", kind: "witz", stufen: ALLE_DREI },
  { text: "Singing in the shower is fine until you get soap in your mouth. Then it is a soap opera.", kind: "witz", stufen: ALLE_DREI },
  { text: "I invented a new word: plagiarism.", kind: "witz", stufen: TEENS_ERW },
  { text: "A cheese factory exploded in France. There was nothing left but de brie.", kind: "witz", stufen: TEENS_ERW },
  { text: "I was going to look for my missing watch, but I could never find the time.", kind: "witz", stufen: ALLE_DREI },
  { text: "The shovel was a ground breaking invention.", kind: "witz", stufen: ALLE_DREI },
  { text: "A snail bought a fast car and painted a big S on it. Now people shout: Look at that S car go.", kind: "witz", stufen: ALLE_DREI },
  { text: "My friend went to a fancy dress party as a bruise. He turned up black and blue.", kind: "witz", stufen: ALLE_DREI },
  { text: "I tried to write a joke about pizza, but it was too cheesy.", kind: "witz", stufen: ALLE_DREI },
  { text: "The best thing about a boomerang joke is that it always comes back.", kind: "witz", stufen: ALLE_DREI },
  { text: "My bed and I are perfect for each other, but the alarm clock keeps trying to break us up.", kind: "witz", stufen: ALLE_DREI },
  { text: "I have an inferiority complex, but it is not a very good one.", kind: "witz", stufen: TEENS_ERW },
  { text: "A bicycle cannot stand on its own. It is two tired to try.", kind: "witz", stufen: ALLE_DREI },
  { text: "I would avoid the sushi if I were you. It is a little fishy.", kind: "witz", stufen: TEENS_ERW },
];

/** Sprach- und Buchstabenspiele (nachgerechnet). */
const EN_WORTSPIEL: CorpusItem[] = [
  { text: "Broken pencils are pointless.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "A backwards poet writes inverse.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "The word swims looks the same when you turn it upside down.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "Listen and silent use exactly the same letters.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "The word bookkeeper hides three double letters in a row.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "Stressed is desserts spelled backwards, which explains a lot.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "A palindrome: never odd or even.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "A palindrome: step on no pets.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "The word queue is just a Q with four silent letters waiting in line.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "Dormitory rearranges neatly into dirty room.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "The word uncopyrightable uses no letter twice.", kind: "wortspiel", stufen: TEENS_ERW },
  { text: "Astronomer and moon starer are made of the same letters.", kind: "wortspiel", stufen: ALLE_DREI },
  { text: "A pun is its own reword.", kind: "wortspiel", stufen: TEENS_ERW },
  { text: "Almost is the longest common word with its letters in alphabetical order.", kind: "wortspiel", stufen: TEENS_ERW },
  { text: "The word rhythm gets by without a single normal vowel.", kind: "wortspiel", stufen: ALLE_DREI },
];


/**
 * Umzug aus der falschen Sorte: Diese sechs Witze standen bisher NUR als
 * `spruch` bzw. `satz` im Bestand (siehe corpusDeactivated.ts, DEACTIVATED_EN)
 * und liefen damit unter den Weisheiten mit. Hier stehen sie sauber als `witz` —
 * es geht kein Inhalt verloren, nur die Fehl-Kategorie.
 */
const EN_WITZ_UMZUG: CorpusItem[] = [
  { text: "What did the cookie say at the doctor? I feel crummy!", kind: "witz", stufen: ALLE_DREI },
  { text: "Why did the orange stop? It ran out of juice!", kind: "witz", stufen: ALLE_DREI },
  { text: "What is a cat on ice? One cool cat!", kind: "witz", stufen: ALLE_DREI },
  { text: "What runs but never walks? A river!", kind: "witz", stufen: ALLE_DREI },
  { text: "How do trees get online? They simply log in!", kind: "witz", stufen: ALLE_DREI },
  { text: "Why did the bee get good marks? It was a real spelling bee!", kind: "witz", stufen: ALLE_DREI },
];

export const EN_WITZ_CORPUS: CorpusItem[] = [
  ...EN_KNOCK_KNOCK,
  ...EN_WITZ_UMZUG,
  ...EN_DIALOG,
  ...EN_EINZEILER,
  ...EN_WORTSPIEL,
];
