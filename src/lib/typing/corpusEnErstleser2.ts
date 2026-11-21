/**
 * TN-E8 (Text-Nachschub §7) — englische Erstleser-Zeilen auf EFL-Grundwortschatz.
 *
 * Prüfbericht 27.07.: Die frühe englische Ebene war „de facto Lyrik, kein
 * Anfängertext" — der T1-Zeichenzwang (nur a d e f i j k l n r s t) hatte
 * seltene Wörter erzwungen („Nettles are near.", „Neil finds a flint.",
 * „Salt is fine and dear."), also genau NICHT den Wortschatz, den ein
 * deutschsprachiges Kind im ersten oder zweiten Englischjahr kennt.
 *
 * Diese Charge dreht das um: gebaut aus dem Kern-Grundwortschatz (Dolch- und
 * Oxford-Grundwortlisten als Leitplanke — Wortlisten selbst sind Fakten, die
 * Sätze hier sind eigene Formulierungen).
 *
 *  • T1 (a d e f i j k l n r s t): trägt bereits „I, a, an, and, is, it, at,
 *    in, as, are, like, need, said, little, red, ten, sit, tell, fast, late" —
 *    damit sind echte Anfängersätze möglich, ohne ein einziges Fantasiewort.
 *    (Bewusst NICHT möglich: „the", „he", „we", „you", „my" — daher kommen die
 *    ersten Sätze ohne Artikel und mit Namen aus, wie in echten Erstlesebüchern.)
 *  • T2 (+ h o u c g m b w): jetzt geht „the", „he", „she", „we", „look",
 *    „come", „good", „school", „house", „mother", „book" — Standard-EFL-Stoff.
 *
 * Zusätzlich verlassen die 16 Lyrik-Zeilen mit seltenem Vokabular die Stufe a
 * (siehe `corpusEnErstleser.ts` — sie bleiben für b/c erhalten, dort sind sie
 * hübsch). Kein Eintrag wird gelöscht: Ledger-Indizes bleiben stabil.
 *
 * Sprachregeln: britisches Englisch, KEINE Apostrophe, keine Anführungszeichen,
 * Ziffern ausgeschrieben. Append-only.
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const EIGEN: Herkunft = {
  quelle: "Sensorik (nach Dolch-/Oxford-Grundwortschatz)",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
  en: {
    quelle: "Sensorik (based on the Dolch/Oxford core vocabulary)",
    lizenz: "Own work (self-written)",
    autor: "Sensorik learning platform",
  },
};

const s = (text: string): CorpusItem => ({
  text,
  kind: "satz",
  stufen: KIDS_TEENS,
  herkunft: EIGEN,
});

/** T1: nur a d e f i j k l n r s t — Anfängersätze aus dem Kernwortschatz. */
export const EN_T1: CorpusItem[] = [
  s("I like it."),
  s("It is late."),
  s("It is a red kite."),
  s("I need a rest."),
  s("Sit still, Nina."),
  s("Nina and I are late."),
  s("Ten little stars."),
  s("I see a nest."),
  s("Dan is sad."),
  s("It is a fine idea."),
  s("I said it fast."),
  s("Tell it, Ida."),
  s("It is a real letter."),
  s("Nina likes tea."),
  s("A little kid, a little sled."),
  s("Sit, eat, rest."),
  s("I like fine art."),
  s("Little feet in a line."),
  s("It is a task and I like tasks."),
  s("Trains are late in rain."),
  s("I feel it in an instant."),
  s("A red lantern is lit."),
  s("Ida sits at a lake."),
  s("Alan is a real friend."),
  s("Nina eats a salad and I eat a date."),
  s("It is nine and I feel tired."),
];

/** T2: zusätzlich h o u c g m b w — jetzt geht „the/he/she/we/look/good". */
export const EN_T2: CorpusItem[] = [
  s("The cat is on the mat."),
  s("She has a good book."),
  s("He is at school."),
  s("We look at the moon."),
  s("Come here and look."),
  s("The dog runs to the house."),
  s("I go to school with Tom."),
  s("Mother makes a hot meal."),
  s("The little house is white."),
  s("Look at the big green tree."),
  s("He can come at one."),
  s("She likes the school bus."),
  s("The book is on the table."),
  s("We are in the same class."),
  s("It is cold and I want a hat."),
  s("The children eat the cake."),
  s("Come to the door, Hanna."),
  s("I can hold the small ball."),
  s("The old man has a good dog."),
  s("We can hear the rain."),
  s("She sits at the front."),
  s("The room is clean and warm."),
  s("I like the red one best."),
  s("The moon comes out at last."),
  s("Look, the milk is on the floor."),
  s("She reads the book to us."),
  s("I hear the school bell."),
  s("We climb the little hill."),
  s("The cat has a warm home."),
  s("Hold on to the hand rail."),
  s("The wind is loud tonight."),
  s("I am cold, so I close the door."),
  s("The good news comes at noon."),
  s("She turns the light on."),
  s("We walk home from school."),
  s("The hat is much too big for him."),
  s("Tom holds the cat with care."),
  s("It is time to look at the clock."),
  s("The old book smells of dust."),
  s("I comb the cat and it likes it."),
  s("Come on, the bus is coming."),
  s("She is the tallest in the class."),
];

export const EN_ERSTLESER2_CORPUS: CorpusItem[] = [...EN_T1, ...EN_T2];
