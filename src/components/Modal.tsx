import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
// Bewusst direkt aus dem Modul, nicht über das Sammel-Modul `@/lib/typing`:
// `focusField.ts` hat selbst keine Abhängigkeiten, dieser gemeinsame Baustein
// zieht damit nichts aus einem einzelnen Programm nach (siehe Nr 16 unten).
import { focusPracticeField } from "@/lib/typing/focusField";
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";

/**
 * Barrierefreier modaler Dialog (bis 2026-06-03 gab es im Projekt keinen).
 * - role="dialog" + aria-modal, beschriftet über die Überschrift.
 * - Fokus wandert beim Öffnen in den Dialog und wird beim Schließen an das
 *   auslösende Element zurückgegeben; Tab bleibt im Dialog (Fokus-Trap).
 * - Escape und Klick auf den abgedunkelten Hintergrund schließen.
 * - body-Scroll wird gesperrt, solange der Dialog offen ist.
 */
export function Modal({
  title,
  onClose,
  children,
  size = "md",
  initialFocus,
  zurueck,
  kompakt = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /**
   * Breite: `md` 36 rem, `lg` 48 rem, `xl` 64 rem. ★ `xl` seit 19.09.2026
   * für die EINSTELLUNGEN aller Apps (Tastenflow, »Im Griff«, Mathecoach).
   * Johannes: „das Einstellungsfenster der User muss nicht so schmal sein,
   * es kann ruhig breiter sein, dann passt auch alles besser" - und dann:
   * „alle App-Einstellungsfenster können die breitere Breite bekommen,
   * einheitlich ist immer besser". Ein neues Einstellungsfenster nimmt
   * darum `xl`; Hilfe- und Nachrichten-Fenster bleiben bei `lg`/`md`.
   *
   * ★ `voll` (72 rem, 17.10.2026): so breit wie die Tastenflow-Seite selbst
   * (`max-w-6xl`). Neu und rein ADDITIV - die anderen Apps setzen es nicht,
   * ihr Fenster bleibt `xl`. Johannes: „passe die Breite dem restlichen
   * Tastenflow an".
   */
  size?: "md" | "lg" | "xl" | "voll";
  /** Element, das beim Öffnen den Fokus bekommt (statt des Dialog-Containers) —
   *  z. B. die Kapitel-Überschrift, bei der Lesende gerade stehen. */
  initialFocus?: RefObject<HTMLElement | null>;
  /**
   * ★★★ Beschriftung eines SICHTBAREN Zurück-Knopfes am Fuß des Dialogs
   * (07.09.2026, Johannes: „ein eigenes fester öffnen das mit esc und mit
   * zurück wieder zum programm wechselt").
   *
   * Warum nicht in jedem Dialog: Das ✕ oben rechts reicht, wo ein Dialog nur
   * etwas ZEIGT (Hilfe, Kürzelliste). Wo jemand etwas EINSTELLT und danach
   * weiterarbeiten will, ist der Weg zurück ein eigener Gedanke - und Escape
   * kennt nicht jeder, auf einem Tablet ohne Tastatur gibt es sie gar nicht.
   * Darum opt-in und nicht als Vorgabe: Ein Dialog mit zwei gleichwertigen
   * Ausgängen, wo einer genügt, ist ein Weg zu viel zum Durchtabben.
   */
  zurueck?: string;
  /**
   * ★ E6 (12.09.2026, Lupenprobe): Vorgabe `false` = GENAU das heutige
   * Aussehen (`my-8 p-5`, Kopfzeile `mb-4 gap-4`) - alle fünf Apps, die dieses
   * gemeinsame Bauteil nutzen, sehen ohne diese Option unverändert aus.
   * `true` (bisher nur von »im Griff« gesetzt) rückt Titel und Schliessen-
   * Knopf näher zusammen und schmälert den Rand: Bei 8-facher Bildschirmlupe
   * lagen sie 490-501 px auseinander, nie gemeinsam im selben ca.
   * 240×135-Ausschnitt sichtbar (Lupenprobe 12.09.2026, `EinstellungenModal`,
   * `ComputerHilfe`, `ComputerKuerzel`). Klassen-Option statt Umbau von
   * `Modal.tsx` selbst, weil sich der Abstand über reine Props/Klassen von
   * aussen sonst nicht ändern lässt - `Modal.tsx` nimmt keine `className` von
   * aussen entgegen.
   */
  kompakt?: boolean;
}) {
  // ★ Nachtlauf 19.09.2026 (Johannes: „die gesamte Oberfläche, Bedienung,
  // Popups … übersetzen"): Ohne AKTIVEN Sprach-Anbieter ist das immer „de" -
  // alle anderen Apps bekommen Zeichen für Zeichen den Knopf von vorher
  // (gleiches Muster wie AppKopfzeile, EN0). Aktiv ist er nur auf den
  // Tastenflow-Adressen (`TastenflowSprachBereich.tsx`).
  const { sprache } = useBedienSprache();
  const ref = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  // Neueste onClose in einem Ref halten, damit der Effekt NICHT von onClose
  // abhängen muss. Aufrufer übergeben onClose meist als frische Inline-Funktion;
  // stünde onClose in den Deps, liefe der Effekt bei JEDEM Render erneut und
  // ref.current.focus() würde beim Tippen in ein Feld nach jedem Zeichen den
  // Fokus zurück auf den Dialog reißen (Fokus-Bug 2026-06-04).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const initialFocusRef = useRef(initialFocus);
  initialFocusRef.current = initialFocus;

  useEffect(() => {
    prevFocus.current = document.activeElement as HTMLElement | null;
    (initialFocusRef.current?.current ?? ref.current)?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const focusables = ref.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      // Fokus liegt auf einem tabindex=-1-Ziel (Dialog-Container, Kapitel-
      // Überschrift via initialFocus) → Tab würde sonst aus dem Dialog
      // entkommen. In die Falle einreihen: Tab → erstes, Shift+Tab → letztes.
      if (!active || !Array.prototype.includes.call(focusables, active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      // ★ Nr 16 der Fokusziele (22.08.2026): Der Öffner bekommt den Fokus nur
      // zurück, wenn er ÜBERHAUPT NOCH IM BAUM STEHT.
      //
      // Der Fall, an dem es auffiel: „Passwort ändern" wird aus dem Konto-Menü
      // geöffnet - und das Menü schließt sich dabei. Der gemerkte Öffner ist
      // also längst entfernt, `focus()` darauf tut schlicht nichts, und der
      // Fokus bleibt auf `body`: eine Braillezeile steht im Nichts.
      // `useFocusTrap` prüft das seit jeher, dieser Dialog nicht.
      //
      // Ist der Öffner weg, geht die Anforderung in die Eingabezeile. Der Weg
      // dorthin hält sich kurz offen, falls das Feld erst noch aufgebaut wird
      // (siehe `focusField.ts`); in den drei anderen Programmen hört niemand
      // auf dieses Ereignis, dort ändert sich damit nichts.
      //
      // `document.body` zählt dabei NICHT als Öffner: Verschwindet der Knopf
      // im selben Rendern, in dem der Dialog aufgeht (React fasst beide
      // Zustandswechsel zusammen), steht beim Merken schon `body` da - genau
      // der Fall „Passwort ändern". Ein `focus()` auf `body` ist kein Ziel,
      // sondern das Nichts mit anderem Namen.
      const opener = prevFocus.current;
      const brauchbar =
        !!opener && opener !== document.body && document.contains(opener);
      if (brauchbar) opener.focus?.();
      else focusPracticeField();
    };
    // Bewusst nur beim Öffnen (mount) einrichten und beim Schließen (unmount)
    // aufräumen — KEINE Abhängigkeit von onClose (siehe onCloseRef oben), sonst
    // klaut der Fokus-Reset bei jedem Tastendruck den Fokus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[
          "card w-full shadow-xl outline-none",
          kompakt ? "my-4 p-3" : "my-8 p-5",
          size === "voll"
            ? "max-w-6xl"
            : size === "xl"
              ? "max-w-5xl"
              : size === "lg"
                ? "max-w-3xl"
                : "max-w-xl",
        ].join(" ")}
      >
        <div
          className={
            kompakt
              ? "mb-2 flex items-start gap-3"
              : "mb-4 flex items-start justify-between gap-4"
          }
        >
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            className="btn-secondary !min-h-0 !px-2.5 !py-1 text-sm"
            aria-label={SCHLIESSEN[sprache]}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {children}
        {zurueck && (
          <p className="m-0 mt-4">
            <button type="button" className="btn-secondary btn-umriss" onClick={onClose}>
              {zurueck}
            </button>
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}

/**
 * Name des Schliessen-Knopfs (✕) - englisch oder französisch nur im
 * Tastenflow-Sprachbereich. ★ E11a-5 (26.09.2026, Johannes F18: „wer
 * Französisch verwendet, bekommt alles in Französisch"): dritte Spalte. Die
 * anderen Apps bekommen weiter „de" (ohne aktiven Provider immer „de",
 * `BedienSpracheProvider.tsx`) - dort ändert sich kein Zeichen.
 */
const SCHLIESSEN: Record<BedienSprache, string> = {
  de: "Dialog schließen",
  en: "Close window",
  fr: "Fermer la fenêtre",
  // ★ ES-O (27.09.2026): Spanisch (Bauplan D6 - gemeinsame Teile in der Sprache).
  es: "Cerrar la ventana",
  // ★ O-IT (02.10.2026): Italienisch (Bauplan D6).
  it: "Chiudi la finestra",
  // ★ O-PL (02.10.2026): Polnisch (Bauplan D6).
  pl: "Zamknij okno",
  // ★ O-TR (02.10.2026): Türkisch (Bauplan D6) - Knopf im Stamm (Glossar Regel 10 "Kapat").
  tr: "Pencereyi kapat",
  // ★ O-CS (03.10.2026): Tschechisch (Bauplan D6) - Knopf im Infinitiv (Glossar Regel 10 "Zavřít").
  cs: "Zavřít okno",
  bg: "Затвори прозореца",
  el: "Κλείσιμο παραθύρου",
  hu: "Ablak bezárása",
  nl: "Venster sluiten",
  pt: "Fechar janela",
  br: "Fechar janela",
  ro: "Închideți fereastra",
  sv: "Stäng fönstret",
  uk: "Закрити вікно",
};
