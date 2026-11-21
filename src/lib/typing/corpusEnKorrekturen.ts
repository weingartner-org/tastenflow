/**
 * TN-E12 (Nachzügler-Charge, 27.07.2026) — die acht Grammatik-/Sinnfehler der
 * englischen Seite aus dem Prüfbericht 27.07. („Sprachqualität", Teil 2).
 *
 * Wie immer append-only: alte Fassung in `corpusDeactivatedEn.ts` stillgelegt,
 * korrigierte hier neu angehängt (eine Textänderung an alter Manifest-Position
 * würde das No-Repeat-Ledger aller Kinder zurücksetzen).
 *
 * Sprachregeln: britisches Englisch, keine Apostrophe, keine Anführungszeichen,
 * Ziffern ausgeschrieben. Alle Zeilen bleiben im T2-Zeichensatz, damit sie —
 * wie die Originale — schon für Anfänger servierbar sind.
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
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

const s = (text: string, stufen: Stufe[] = KIDS_TEENS): CorpusItem => ({
  text,
  kind: "satz",
  stufen,
  herkunft: EIGEN,
});

export const EN_KORREKTUR_CORPUS: CorpusItem[] = [
  // „an hour feels not" ist ungrammatisch (es fehlt „does not").
  s("A week feels short and an hour feels long.", ALLE_DREI),
  // Zeitform-Bruch: Präsens + „once we started".
  s("It looked a lot smaller before we started."),
  // Fehlendes Genitiv-s; mit dem Apostroph-Verbot elegant umgangen.
  s("The football rolls into the garden beside ours."),
  // Gemeint war „stale" — „late" ergab keinen Sinn.
  s("The bread in the bag is a bit stale."),
  // Der alte Satz war unverständlich („broke and it was clean").
  s("The oat cake broke into two clean bits."),
  // „We are ten" ist die deutsche Struktur; im Englischen klingt es nach Alter.
  s("There are ten of us and we need one more."),
  // BrE „torch" heißt Taschenlampe — gemeint war eine Laterne.
  s("We hang a small lantern in the front window."),
  // „class hut" ist keine englische Fügung; gemeint war eine Hütte/Cabin.
  s("The cabin is cold, so we all sing."),
];
