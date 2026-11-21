/**
 * ★ Lade-Anzeige der Melodie (16.10.2026, [[feedback_nachladen_immer_animation]]).
 *
 * Solange Töne des LAUFENDEN Lieds noch geladen werden, spielt der erzeugte
 * Ersatzklang - das soll man sehen, nicht nur hören. Klein, in der Kopfzeile
 * des Übungsfelds, nur während des Ladens.
 *
 * `aria-hidden`: kein Live-Bereich - der würde auf der Braillezeile die
 * Übungszeile verdrängen ([[reference_live_region_ist_braille_blitzmeldung]]).
 * Wer nicht sieht, hört den Wechsel vom Ersatz zur Aufnahme.
 */
import { useMelodieLaden } from "@/lib/typing/melodieSampler";
import { useMelodie } from "@/lib/typing/melodie";

export function MelodieLadeanzeige({ text }: { text: string }) {
  const offen = useMelodieLaden((s) => s.offen);
  const an = useMelodie((s) => s.an);
  if (!an || offen === 0) return null;
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5 text-sm text-ink-muted" data-melodie-laedt>
      <span className="h-3.5 w-3.5 rounded-full border-2 border-hairline border-t-accent animate-spin motion-reduce:animate-none" />
      {text}
    </span>
  );
}
