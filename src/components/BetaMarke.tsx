/**
 * ════════════════════════════════════════════════════════════════════════════
 * „BETA" - die Marke für ein Programm, das noch nicht fertig ist
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 04.09.2026: *„kennzeichne die apps Klangpunkte Punktgenau und im
 * griff als BETA, damit die leute wissen das ist noch nicht fertig."*
 *
 * WELCHE Programme sie tragen, steht in `ALL_PROGRAMS` (`beta: true`) - hier
 * steht nur, WIE sie aussieht. Wer ein Programm für fertig erklärt, ändert
 * eine Zeile in `allPrograms.ts`, und die Marke verschwindet überall zugleich.
 *
 * ── ⚠️ Was hier vorsichtig sein muss ──────────────────────────────────────
 * 1. **Nicht nur Farbe.** Die Marke steht als WORT da. Ein farbiger Punkt oder
 *    ein andersfarbiger Titel wäre für ein Kind mit Sehbehinderung keine
 *    Auskunft (WCAG 1.4.1).
 * 2. **Kein `aria-hidden`, aber auch kein Lärm.** „BETA" allein ist als
 *    Ansage dünn - eine Sprachausgabe liest vier Buchstaben vor, und niemand
 *    weiss, was gemeint ist. Darum trägt sie einen unsichtbaren Nachsatz, der
 *    den Sinn ausspricht. Sichtbarer Text bleibt vollständig im zugänglichen
 *    Namen enthalten (WCAG 2.5.3).
 * 3. **Nicht in den Namen eines Schalters hinein.** In der `AppKopfzeile` ist
 *    die Überschrift ein Schalter („zurück ins Programm"). Läge die Marke
 *    darin, hiesse der Schalter „Punktgenau BETA" - der Name eines Bedienteils
 *    soll sagen, was es TUT. Sie steht deshalb daneben, nicht darin.
 * 4. **Keine Wertung.** „BETA" sagt etwas über das PROGRAMM, nie über das
 *    Kind, das damit übt ([[feedback_nie_gegen_das_kind]]).
 */
import { texte, useBedienSprache } from "@/lib/bedienSprache";

const T = texte({
  de: { nachsatz: "- dieses Programm ist noch nicht fertig und wird weiter gebaut" },
  en: { nachsatz: "- this programme is not finished yet and is still being built" },
  fr: { nachsatz: "- ce programme n'est pas encore terminé et continue d'être construit" },
  es: { nachsatz: "- este programa aún no está terminado y se sigue construyendo" },
  it: { nachsatz: "- questo programma non è ancora finito e continua a essere costruito" },
  sv: { nachsatz: "- det här programmet är inte färdigt än och byggs vidare" },
  nl: { nachsatz: "- dit programma is nog niet af en wordt verder gebouwd" },
  pt: { nachsatz: "- este programa ainda não está concluído e continua a ser construído" },
  br: { nachsatz: "- este programa ainda não está pronto e continua sendo construído" },
  // ★ 07.11.2026: Tastenflow verlangt zu jeder Tabelle mit „fr" auch pl, cs, tr (Wächter tastenflow-*-alles).
  pl: { nachsatz: "- ten program nie jest jeszcze gotowy i wciąż jest rozbudowywany" },
  cs: { nachsatz: "- tento program ještě není hotový a dál se na něm pracuje" },
  tr: { nachsatz: "- bu program henüz bitmedi ve geliştirilmeye devam ediyor" },
  hu: { nachsatz: "- ez a program még nincs kész, és tovább fejlesztjük" },
  ro: { nachsatz: "- acest program nu este încă gata și este în continuare dezvoltat" },
  bg: { nachsatz: "- тази програма още не е готова и продължава да се разработва" },
  el: { nachsatz: "- αυτό το πρόγραμμα δεν έχει ολοκληρωθεί ακόμη και συνεχίζει να αναπτύσσεται" },
  uk: { nachsatz: "- ця програма ще не готова і далі розробляється" },
});

export function BetaMarke({ className = "" }: { className?: string }) {
  // ★ Sprachen-Apps (06.11.2026): der unsichtbare Nachsatz spricht die Sprache der Bedienung.
  //   Deutsch bleibt Byte für Byte; Sprachen ohne eigene Zeile bekommen die englische.
  const { sprache } = useBedienSprache();
  return (
    <span
      className={
        "inline-flex shrink-0 items-center rounded-full border border-hairline " +
        "bg-surface-sunken px-2 py-0.5 text-xs font-semibold uppercase " +
        "tracking-wide text-ink-soft " +
        className
      }
    >
      Beta
      {/* Der Sinn, ausgesprochen - nur für die Sprachausgabe. */}
      <span className="sr-only">
        {" "}
        {T[sprache].nachsatz}
      </span>
    </span>
  );
}
