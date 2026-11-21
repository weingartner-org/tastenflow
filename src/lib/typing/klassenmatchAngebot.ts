/**
 * ★ STEHT DER SCHALTER „⚔️ Klassenmatch" IN DER STAND-ZEILE? (F1, 11.09.2026)
 *
 * Ein winziger Speicher, den die Seite (`TippenTrainerPage`) füllt und den die
 * Stand-Zeile liest.
 *
 * ── Warum ein Speicher und keine Eigenschaft ────────────────────────────────
 * Die Stand-Zeile steht in DREI Trainern („Mein Training", „Lektionen",
 * Bücherei), und jeder von ihnen bekäme die Eigenschaft nur, um sie
 * weiterzureichen - vier Dateien, damit ein Schalter erscheint. Die Frage, die
 * hier beantwortet wird, gehört aber keinem Trainer: Sie lautet „gehört dieses
 * Kind einer Klasse, und hat die Lehrkraft das Match erlaubt" und ist in jedem
 * der drei dieselbe.
 *
 * Das ist dieselbe Bauart wie bei der Übezeit-Uhr (`practiceClock.ts`), die in
 * derselben Zeile steht und ihre Zahl ebenfalls aus einem Speicher holt statt
 * durch drei Trainer gereicht zu bekommen.
 *
 * ⚠️ Der Speicher beschreibt nur die SICHTBARKEIT. Was beim Drücken passiert,
 * entscheidet `useKlassenmatch` - und am Ende der Server, der eine Einladung
 * abweist, wenn die Lehrkraft das Match abgeschaltet hat oder schon zwei offen
 * sind. Ein Speicher im Browser ist keine Berechtigung.
 */
import { create } from "zustand";

interface KlassenmatchAngebotState {
  /** true = der Schalter steht in der Stand-Zeile. */
  offen: boolean;
  /**
   * ★ Warum er gerade nicht einlädt („Klassenmatch läuft gerade", „Zwei
   * Matches laufen") - leer, wenn er einlädt.
   *
   * Er steht trotzdem da und trägt diesen Satz als Beschriftung: Ein Schalter,
   * der ohne Grund verschwindet, lässt ein Kind suchen (§2.6, 11.09.2026).
   */
  hinweis: string;
  setAngebot: (offen: boolean, hinweis: string) => void;
}

export const useKlassenmatchAngebot = create<KlassenmatchAngebotState>((set) => ({
  offen: false,
  hinweis: "",
  setAngebot: (offen, hinweis) =>
    set((s) => (s.offen === offen && s.hinweis === hinweis ? s : { ...s, offen, hinweis })),
}));

/** Das Ereignis, mit dem die Stand-Zeile ein Match ausschreibt. */
export const KLASSENMATCH_EREIGNIS = "tippen-open-klassenmatch";
