/**
 * TN-E9 (Text-Nachschub §7) — englische Humor-Offensive gegen die Schablone.
 *
 * Prüfbericht 27.07.: rund zwei Drittel der englischen Witze folgten dem
 * Frage-Antwort-Schema („What do you call …", „Why did …"). Diese Charge bringt
 * Dialoge, Einzeiler und Beobachtungen — Pointe am Satzende statt Rätselfrage.
 *
 * Sprachregeln: britisches Englisch, KEINE Apostrophe (fitText streicht sie
 * unterhalb T5 → „dont" wäre falsch geschriebenes Englisch; deshalb hier
 * durchweg Vollformen, die auch ohne Kontraktion natürlich klingen), keine
 * Anführungszeichen, Ziffern ausgeschrieben, Wortschatz für Lernende.
 *
 * Alle Zeilen selbst verfasst (§10). Append-only.
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
const EIGEN: Herkunft = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
  en: {
    quelle: "Sensorik",
    lizenz: "Own work (self-written)",
    autor: "Sensorik learning platform",
  },
};

const w = (text: string, stufen: Stufe[]): CorpusItem => ({
  text,
  kind: "witz",
  stufen,
  herkunft: EIGEN,
});

/** Mini-Dialoge — Pointe in der Antwort. */
const DIALOGUES: CorpusItem[] = [
  w("Mum, there is a ghost in the hall. Then ask it to close the door.", KIDS_TEENS),
  w("Waiter, this soup is cold. That is because it is ice cream, madam.", KIDS_TEENS),
  w("Are you tired? No, I am saving my strength for getting up.", KIDS_TEENS),
  w("How was the test? Short. I finished shaking after ten minutes.", TEENS_ERW),
  w("The cat is on the keyboard. So the cat wrote the letter today.", KIDS_TEENS),
  w("Can we share the bill? Of course, sir. Into how many parts?", TEENS_ERW),
  w("My watch runs fast. Then it is very well behaved.", KIDS_TEENS),
  w("Teacher, where is the Atlantic? On page eighty, said Tom.", KIDS_TEENS),
];

/** Einzeiler und Beobachtungen — die Pointe steht am Ende. */
const ONE_LINERS: CorpusItem[] = [
  w("My snowman moved out in the night. He left the scarf behind.", KIDS_TEENS),
  w("I wanted to be on time. Time was faster.", KIDS_TEENS),
  w("I have three plans. All of them are called plan B.", TEENS_ERW),
  w("The dog has learnt the word walk. Now we spell it out.", KIDS_TEENS),
  w("My calendar is full of things I have forgotten.", TEENS_ERW),
  w("I watered the flowers. The plastic ones look happiest.", KIDS_TEENS),
  w("The bus came early today, so I was later than ever.", KIDS_TEENS),
  w("I write everything down, and then where I wrote it down.", TEENS_ERW),
  w("The cake is soft in the middle. We call it pudding now.", KIDS_TEENS),
  w("The folder named Important is empty. The rest is on my desk.", TEENS_ERW),
  w("The rain waited until I had cleaned the windows.", KIDS_TEENS),
  w("My shadow was late today. It had no motivation either.", KIDS_TEENS),
];

/** Absurde Miniaturen mit innerer Logik. */
const ABSURD: CorpusItem[] = [
  w("The worm in the apple was offended. It lived there first.", KIDS_TEENS),
  w("Two socks met in the washing machine. Only one came home.", KIDS_TEENS),
  w("The hedgehog wanted a hug. The idea stayed popular with him alone.", KIDS_TEENS),
  w("The light turned green while I was getting a coffee.", TEENS_ERW),
  w("The seagull took my bread. It thought it was breakfast for two.", KIDS_TEENS),
  w("My alarm clock and I disagree about the morning.", KIDS_TEENS),
  w("The lift was full, so I took the stairs. It still got there first.", TEENS_ERW),
  w("The tightrope walker had a very tight schedule.", TEENS_ERW),
];

export const EN_HUMOR_CORPUS: CorpusItem[] = [...DIALOGUES, ...ONE_LINERS, ...ABSURD];
