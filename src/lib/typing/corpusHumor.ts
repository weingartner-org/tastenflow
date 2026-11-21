/**
 * TN-E9 (Text-Nachschub §7) — Humor-Offensive gegen die Schablone.
 *
 * Prüfbericht 27.07.: 88 % der deutschen Witze folgten dem Frage-Antwort-Schema
 * („Was ist …?", „Warum …?"), und für Kinder gab es KEINEN einzigen Witz
 * außerhalb der Rätselform. Diese Charge bringt bewusst andere Formen:
 *
 *  • Mini-Dialoge (zwei Sprechende, Pointe in der Antwort)
 *  • Einzeiler/Beobachtungen (Pointe am Satzende)
 *  • Absurde Miniaturen mit innerer Logik
 *  • Sprach-Stolperer und Wortspiele in Aussageform
 *
 * Zielwert §5: Schablonen-Anteil ≤ 60 % je Sprache. Zusätzlich werden fünf
 * pointenlose Alt-Witze stillgelegt (corpusDeactivated.ts).
 *
 * Alle Zeilen selbst verfasst (§10) — Witzbücher sind urheberrechtlich heikel
 * und klingen oft verstaubt. Wörtliche Rede ohne Anführungszeichen (wie im
 * gesamten Bestand, die Zeichen sind nicht tippbar).
 *
 * Append-only. Kinder-Humor bleibt bei a/b (TN-E4-Regel), trockener bei c/erwachsen.
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
const EIGEN: Herkunft = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
};

const w = (text: string, stufen: Stufe[]): CorpusItem => ({
  text,
  kind: "witz",
  stufen,
  herkunft: EIGEN,
});

/** Mini-Dialoge — Pointe in der Antwort, keine Rätselfrage. */
const DIALOGE: CorpusItem[] = [
  w("Mama, im Keller ist ein Gespenst! Sag ihm, es soll die Tür zumachen.", KIDS_TEENS),
  w("Papa, ich habe eine Eins! Zeig her. Sie ist aus Holz, ich habe sie gebaut.", KIDS_TEENS),
  w("Der Lehrer fragt: Wo liegt der Atlantik? Auf Seite achtzig, sagt Ben.", KIDS_TEENS),
  w("Kellner, mein Wasser ist trüb. Das ist kein Wasser, das ist Ihre Brille.", KIDS_TEENS),
  w("Meine Uhr geht falsch. Immer nach vorne. Dann ist sie sehr gut erzogen.", KIDS_TEENS),
  w("Der Zahnarzt sagt: Sie müssen weniger naschen. Ich nasche nur an Werktagen.", TEENS_ERW),
  w("Kann ich die Rechnung teilen? Gern, sagt der Kellner, in wie viele Teile?", TEENS_ERW),
  w("Bist du müde? Nein, ich sammle nur Kraft für das Aufstehen.", KIDS_TEENS),
  w("Die Katze sitzt auf der Tastatur. Jetzt hat sie den Text geschrieben.", KIDS_TEENS),
  w("Wie war die Prüfung? Kurz. Ich war nach zehn Minuten fertig mit Zittern.", TEENS_ERW),
];

/** Einzeiler und Beobachtungen — die Pointe steht am Ende. */
const EINZEILER: CorpusItem[] = [
  w("Mein Schneemann ist über Nacht ausgezogen. Er ließ nur den Schal zurück.", KIDS_TEENS),
  w("Ich wollte pünktlich sein. Die Zeit war schneller.", KIDS_TEENS),
  w("Der Aufzug war voll, also nahm ich die Treppe. Er kam trotzdem vor mir an.", TEENS_ERW),
  w("Ich habe drei Pläne. Alle heißen Plan B.", TEENS_ERW),
  w("Der Hund hat das Wort Spaziergang gelernt. Jetzt buchstabieren wir es.", KIDS_TEENS),
  w("Mein Kalender ist voll. Von lauter Dingen, die ich vergessen habe.", TEENS_ERW),
  w("Ich habe die Blumen gegossen. Die aus Plastik freuen sich am meisten.", KIDS_TEENS),
  w("Der Bus kam heute früher. Also war ich noch später als sonst.", KIDS_TEENS),
  w("Meine Pflanzen wachsen langsam. Sie warten wohl auf eine Anleitung.", KIDS_TEENS),
  w("Ich schreibe alles auf. Auch, wo ich es aufgeschrieben habe.", TEENS_ERW),
  w("Der Kuchen ist innen noch weich. Wir nennen das jetzt Pudding.", KIDS_TEENS),
  w("Im Ordner Wichtig liegt nichts. Alles Wichtige liegt auf dem Tisch.", TEENS_ERW),
];

/** Absurde Miniaturen mit innerer Logik. */
const ABSURD: CorpusItem[] = [
  w("Der Wurm im Apfel war beleidigt. Er wohnte da schon vor uns.", KIDS_TEENS),
  w("Zwei Socken trafen sich in der Waschmaschine. Nur eine kam heim.", KIDS_TEENS),
  w("Mein Wecker und ich haben verschiedene Ansichten über den Morgen.", KIDS_TEENS),
  w("Der Igel wollte kuscheln. Die Idee blieb bei ihm allein beliebt.", KIDS_TEENS),
  w("Die Ampel wurde grün, als ich schon Kaffee holen war.", TEENS_ERW),
  w("Der Regen wartete, bis ich das Fenster geputzt hatte.", KIDS_TEENS),
  w("Die Möwe nahm sich mein Brot. Sie hielt es für ihr Frühstück.", KIDS_TEENS),
  w("Mein Schatten kam heute später. Er hatte wohl auch keine Lust.", KIDS_TEENS),
];

/** Sprach-Stolperer und Wortspiele in Aussageform (statt Rätselfrage). */
const SPRACHSPIEL: CorpusItem[] = [
  w("Ein Bäcker in Not braucht dringend mehr Mehl und noch mehr Mut.", KIDS_TEENS),
  w("Der Seiltänzer hatte einen straffen Zeitplan.", TEENS_ERW),
  w("Der Uhrmacher nahm sich Zeit. Er hatte genug davon im Regal.", TEENS_ERW),
  w("Der Gärtner ging in die Knie. Die Erde war stärker.", KIDS_TEENS),
  w("Wer Kuchen backt und Kuchen isst, hat doppelt recht gehandelt.", KIDS_TEENS),
  w("Der Elektriker sagte, er sei unter Spannung. Wir glaubten ihm sofort.", TEENS_ERW),
  w("Der Angler wartete stundenlang. Der Fisch wartete besser.", KIDS_TEENS),
  w("Mein Kompass zeigt immer nach Hause. Ich habe ihn dorthin gedreht.", KIDS_TEENS),
];

export const HUMOR_CORPUS: CorpusItem[] = [
  ...DIALOGE,
  ...EINZEILER,
  ...ABSURD,
  ...SPRACHSPIEL,
];
