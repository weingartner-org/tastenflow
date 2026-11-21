/**
 * Das ANGEBOT einer Übungsform auf der Abschluss-Karte - Schwesterstück zu
 * {@link StoryOffer}, mit voller Absicht in derselben Bauart.
 *
 * ★★★ Die Entscheidung dahinter (Johannes, 01.09.2026): *„warum nicht in mein
 * training, so wie steht: und jetzt eine geschichte (mit optionalem
 * überspringen)? Ich möchte dass wer nur meintraining macht an allem vorbei
 * kommt!"* - deshalb KEIN vierter Reiter. Die Übungsformen aus Testerin
 * Unterricht werden hier angeboten, nach jeder Runde in „Mein Training" und
 * nach jeder Lektion.
 *
 * Ankündigung statt beiläufigem Angebot: „Jetzt kommen drei Pyramidenwörter."
 * Für ein Kind mit Blindheit ist dieser Satz die ganze Information über das,
 * was kommt - deshalb steht er auf dem Knopf und nicht daneben. Der Knopf ist
 * der Hauptknopf der Karte und ihr erster Tabstopp: ein Tab, eine Eingabetaste,
 * auch mit Screenreader und Braillezeile.
 *
 * ★ Den Fokus holt sich dieser Knopf NICHT selbst - das tut die Abschluss-Karte,
 * die ihn auf ihre Überschrift setzt (F1, 31.08.2026). Zwei Stellen, die
 * denselben Fokus setzen, wären genau die Doppelung, die einander nicht kennt.
 *
 * Erzwungen wird nichts: Wer lieber weiterübt, nimmt „lieber weiter üben" -
 * das ist der `retryLabel`-Knopf der Session, genau wie beim Geschichten-Angebot.
 */
export function UebungsformAngebot({
  ankuendigung,
  onStart,
}: {
  /**
   * Der ganze Ankündigungssatz aus der Form selbst - seit EN4 (18.09.2026)
   * schon in der Bedienungssprache (`ctx.sprache` aus `useUebungsform`).
   */
  ankuendigung: string;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button type="button" className="btn-primary" onClick={onStart}>
        <span aria-hidden>✏️ </span>
        {ankuendigung}
      </button>
    </div>
  );
}
