/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ STRG MACHT SOFORT STILL - eine Regel für ALLE Programme
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 04.09.2026: *„egal an welcher Stelle gelesen wird, mit Strg muss es
 * sofort leise werden"* - und danach: *„mach das auch für die anderen Apps."*
 *
 * Es ist die Geste jedes Screenreaders (JAWS, NVDA, VoiceOver): Strg schweigt.
 * Wer sie nicht findet, hat keinen zweiten Weg - eine Ansage läuft aus, egal
 * wie lang sie ist. In der Grundreihe von Tastenflow wird jeder Buchstabe
 * einzeln gesagt; in »im Griff« liest eine Etappe ganze Absätze.
 *
 * ── WARUM DIESE DATEI UND NICHT DREIMAL DIESELBEN ZEILEN ───────────────────
 *
 * Die Plattform hat DREI Vorlese-Motoren, je einer für seine Programme:
 *
 *   `lib/typing/voice.ts`      Tastenflow
 *   `lib/braille/voice.ts`     Punktgenau · Klangpunkte
 *   `lib/computer/vorlesen.ts` »im Griff«
 *
 * Jeder hat seinen eigenen Abbruch - die Motoren wissen voneinander nichts, und
 * das ist richtig so. Die REGEL aber ist überall dieselbe, und drei Abschriften
 * derselben Regel wären genau die Doppelung, die sich am zweiten Tag
 * auseinanderlebt: Wer die AltGr-Ausnahme unten in einer Datei ändert und in
 * den anderen vergisst, hat ein Programm, das sich anders verhält als seine
 * Geschwister - und merkt es nicht
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ⇒ Die Regel steht hier EINMAL. Jeder Motor sagt nur, was bei ihm „still"
 *   heisst.
 *
 * ── ⚠️ ALTGR IST STRG + ALT ────────────────────────────────────────────────
 *
 * Auf deutschen Windows-Tastaturen meldet der Browser für `@` (AltGr + Q)
 * `ctrlKey === true` UND `altKey === true`. Würde jede Strg-Kombination stumm
 * schalten, verlöre ein Kind die Ansage genau der Zeichen, die es gerade lernt.
 * Darum: Alt daneben ⇒ es ist AltGr, kein Stummschalten. Die Gegenprobe dazu
 * ist der Kern der Wächter.
 *
 * ── ⚠️⚠️ ALTGR SCHICKT VORHER EIN EIGENES STRG (gemessen 28.10.2026) ────────
 *
 * Am Windows-PC mit echten Tastendrücken (Edge, deutsche Tastatur): Beim
 * Druck auf AltGr kommt 0,1-0,2 ms VOR `AltRight` ein eigenes keydown
 * `Control`/`ControlLeft` - OHNE altKey. Die Ausnahme oben sah es darum nicht,
 * und jedes AltGr (@ € { [ ...) machte die laufende Ansage still. Strg LINKS
 * wartet deshalb {@link ALTGR_STRG_FENSTER_MS}; kommt in der Zeit `AltRight`,
 * war es kein Strg. Ohne `code` (manche Bildschirmtastaturen) und Strg rechts
 * bleibt es sofort - dort gibt es dieses Doppel nicht.
 *
 * ── Was NICHT passiert ─────────────────────────────────────────────────────
 *
 * Das Vorlesen wird nicht ABGESCHALTET. Die nächste Ansage spricht wieder - so
 * wie bei einem Screenreader. Ein Stummschalter, der heimlich den Schalter
 * umlegt, wäre für ein Kind mit Blindheit eine kaputte App.
 */

/**
 * Hängt den Stumm-Zuhörer ans Dokument. Wird von jedem Vorlese-Motor beim Laden
 * genau einmal aufgerufen.
 *
 * ★ CAPTURE (`true`): Der Zuhörer läuft VOR den Tastenwegen der Bildschirme.
 *   Wer danach etwas sagen will - „Tasten erkunden" sagt „Strg" an, wenn ein
 *   Kind die Taste erkundet -, spricht nach dem Abbruch und wird nicht selbst
 *   abgeschnitten.
 *
 * @param stillMachen was bei diesem Motor „sofort still" heisst (sein Abbruch).
 */
/**
 * So lange wartet Strg links auf ein `AltRight` (siehe Kopf). Auch „Tasten
 * erkunden" wartet genau so lange - mit DERSELBEN Zahl, damit sein Zeitgeber
 * nach diesem läuft und die Ansage „Strg" nicht vom eigenen Abbruch erwischt wird.
 */
export const ALTGR_STRG_FENSTER_MS = 30;

export function installStummTaste(stillMachen: () => void): void {
  if (typeof document === "undefined" || typeof document.addEventListener !== "function")
    return;
  let strgWartet: ReturnType<typeof setTimeout> | undefined;
  document.addEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      // Gehaltene Taste: einmal still ist still. Ein Dauerfeuer von Abbrüchen
      // würde jede folgende Ansage im Ansatz erwürgen.
      if (e.repeat) return;
      // Das AltRight zum wartenden Strg: es war AltGr, nicht Strg.
      if (e.code === "AltRight" && strgWartet !== undefined) {
        clearTimeout(strgWartet);
        strgWartet = undefined;
        return;
      }
      const altGr = e.altKey; // Strg + Alt = AltGr, siehe Kopf
      if (e.key === "Control" && e.code === "ControlLeft" && !altGr) {
        clearTimeout(strgWartet);
        strgWartet = setTimeout(() => {
          strgWartet = undefined;
          stillMachen();
        }, ALTGR_STRG_FENSTER_MS);
        return;
      }
      if (e.key === "Control" || (e.ctrlKey && !altGr)) stillMachen();
    },
    true,
  );
}
