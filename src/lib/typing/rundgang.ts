/**
 * ★★★ DER RUNDGANG BEIM ALLERERSTEN BETRETEN (Z4, 19.09.2026) - die REGEL.
 * ============================================================================
 *
 * Johannes, 19.09.2026, wörtlich: *„für Schüler und Lehrer und alle
 * Selbstlernenden, die das allererste Mal Tastenflow betreten, nicht nach dem
 * Neuladen! Wenn jemand zuerst ohne Anmeldung übt und sich dann irgendwann
 * anmeldet, bekommt er keine Einführung mehr. Sie brauchen eine Einführung mit
 * Bereichserklärungen genau wie bei ‚Mit anderen Augen sehen'. Bei Lehrkräften
 * ist die Erklärung der ganzen neuen Oberfläche wichtig!"*
 *
 * Diese Datei ist die Regel, ohne Oberfläche und ohne Netz. Die Rundgänge
 * selbst stehen in `components/typing/Rundgang.tsx` (sie benutzen den
 * Baustein der Simulationen, `components/SimEinfuehrung.tsx`), ihre Texte in
 * `lib/typing/rundgangTexte.ts`.
 *
 * ── DREI RUNDGÄNGE ──────────────────────────────────────────────────────────
 *  · {@link RUNDGANG_UEBEN} - die Übungsseite, für ALLE (Gäste, Kinder,
 *    Selbstlernende, übende Lehrkräfte).
 *  · {@link RUNDGANG_KINDER_UND_ZUGAENGE} - „Meine Klassen", Bildschirm
 *    „Kinder und Zugänge". Mit ihm beginnt jeder erste Besuch einer NEUEN
 *    Lehrkraft: Sie hat noch keine Klasse, und die Seite zeigt ihr darum genau
 *    diesen Bildschirm.
 *  · {@link RUNDGANG_MEINE_KLASSEN} - „Meine Klassen", Bildschirm „Lernstand"
 *    (die ganze neue Oberfläche). Er folgt, sobald die neue Lehrkraft zum
 *    ersten Mal den Lernstand ihrer Klasse vor sich hat.
 *
 * ── „GESEHEN" - AM GERÄT UND AM KONTO ─────────────────────────────────────
 * Ein Rundgang erscheint von selbst nur, wenn WEDER das Gerät NOCH das Konto
 * sagt, dass er schon gesehen wurde:
 *  · das GERÄT: der Merker der Simulationen im `localStorage`
 *    (`sensorik:sim-einfuehrung:<schlüssel>`, `einfuehrungGesehen`) - EIN
 *    Merker-Weg für alle Rundgänge der Plattform, kein zweiter;
 *  · das KONTO: `rundgaengeGesehen` an `tt_pupils`/`tt_teachers` (eine Liste
 *    von Schlüsseln).
 * ★ Gemerkt wird, sobald der Rundgang ZU SEHEN ist - nicht erst bei „Fertig".
 *   Johannes: *„nicht nach dem Neuladen!"* Wer mitten im Rundgang neu lädt,
 *   hat ihn gesehen; er kommt nicht wieder (aus der Hilfe jederzeit).
 * ★ Beim Anmelden trägt das Gerät nach, was es gesehen hat (Johannes: wer
 *   zuerst ohne Anmeldung übt und sich dann anmeldet, bekommt keine
 *   Einführung mehr) - {@link fuerKontoNachzutragen}. Dazu zählt auf der
 *   Übungsseite auch, dass auf dem Gerät schon als Gast GEÜBT wurde.
 *
 * ── WANN DIE ÜBUNGSSEITE „ZUM ERSTEN MAL" BETRETEN WIRD ────────────────────
 * Genau dann, wenn beim Laden die EINRICHTUNG fällig war (`tippen-einrichtung`
 * fehlt im Gerät) - dieselbe Frage, mit der die Einrichtung selbst entscheidet,
 * ob sie sich zeigt. Der Rundgang kommt darum immer NACH ihr (Auftrag: „die
 * Einrichtung kommt ZUERST, der Rundgang danach"). Ein Gerät, auf dem die
 * Einrichtung schon lief, hat Tastenflow schon betreten.
 * Dazu: nie für ein Konto, das schon geübt hat (dieselbe Messung wie bei der
 * Einrichtung, `hatSchonGeuebt`), und nie für eine BESTEHENDE Lehrkraft - die
 * bekommt „Was gibt's Neues" (Z3) mit dem Knopf „Rundgang durch die Seite".
 *
 * ── WER „NEU" IST ─────────────────────────────────────────────────────────
 * Eine Lehrkraft, deren Konto am oder nach dem Stichtag von Z3 angelegt wurde
 * - gefragt an EINER Stelle, `kontoNachStichtag` in `neuigkeiten.ts`.
 */
import { create } from "zustand";
import { kontoNachStichtag } from "./neuigkeiten";

/** Die Übungsseite. */
export const RUNDGANG_UEBEN = "tastenflow-ueben";
/** „Meine Klassen", Bildschirm „Lernstand". */
export const RUNDGANG_MEINE_KLASSEN = "tastenflow-meine-klassen";
/** „Meine Klassen", Bildschirm „Kinder und Zugänge". */
export const RUNDGANG_KINDER_UND_ZUGAENGE = "tastenflow-kinder-und-zugaenge";

export const ALLE_RUNDGAENGE = [
  RUNDGANG_UEBEN,
  RUNDGANG_MEINE_KLASSEN,
  RUNDGANG_KINDER_UND_ZUGAENGE,
] as const;
export type RundgangSchluessel = (typeof ALLE_RUNDGAENGE)[number];

export type KontoRolle = "lehrkraft" | "schueler";

/**
 * ★ Die Übungsseite: von selbst zeigen?
 *
 * @param einrichtungWarFaellig  beim Laden fehlte der Einrichtungs-Merker im Gerät
 * @param geraetGesehen          der Geräte-Merker dieses Rundgangs ist gesetzt
 * @param geraetGeuebt           auf diesem Gerät wurde schon ohne Anmeldung geübt
 * @param konto                  `null` = Gast. `gesehen: null` = Lesen gescheitert
 *                               (dann lieber nichts - wie bei Z3).
 */
export function rundgangUebenEntscheiden({
  einrichtungWarFaellig,
  geraetGesehen,
  geraetGeuebt,
  konto,
  stichtagMs,
}: {
  einrichtungWarFaellig: boolean;
  geraetGesehen: boolean;
  geraetGeuebt: boolean;
  konto: {
    rolle: KontoRolle;
    erstelltMs: number | null | undefined;
    gesehen: readonly string[] | null;
    geuebt: boolean;
  } | null;
  stichtagMs?: number;
}): boolean {
  if (!einrichtungWarFaellig) return false;
  if (geraetGesehen || geraetGeuebt) return false;
  if (!konto) return true;
  if (konto.gesehen === null) return false;
  if (konto.gesehen.includes(RUNDGANG_UEBEN)) return false;
  if (konto.geuebt) return false;
  if (konto.rolle === "lehrkraft" && !kontoNachStichtag(konto.erstelltMs, stichtagMs)) return false;
  return true;
}

/**
 * ★ „Meine Klassen": von selbst zeigen? Nur für NEUE Lehrkräfte.
 *
 * @param schluessel          der Rundgang des Bildschirms, der gerade offen ist
 * @param gesehen             Gerät ODER Konto kennt diesen Schlüssel schon
 *                            (für beide Rundgänge gefragt)
 * @param kontoLesbar         `false`, wenn die Liste am Konto nicht zu lesen war
 * @param ohneKlasseBeimLaden die Lehrkraft hatte beim Öffnen der Seite noch
 *                            KEINE Klasse - das Kennzeichen des ersten Besuchs
 */
export function rundgangLehrkraftEntscheiden({
  schluessel,
  erstelltMs,
  gesehen,
  kontoLesbar,
  ohneKlasseBeimLaden,
  stichtagMs,
}: {
  schluessel: typeof RUNDGANG_MEINE_KLASSEN | typeof RUNDGANG_KINDER_UND_ZUGAENGE;
  erstelltMs: number | null | undefined;
  gesehen: (k: RundgangSchluessel) => boolean;
  kontoLesbar: boolean;
  ohneKlasseBeimLaden: boolean;
  stichtagMs?: number;
}): boolean {
  // Bestehende Lehrkraft: „Was gibt's Neues" statt eines Rundgangs (Z3).
  if (!kontoNachStichtag(erstelltMs, stichtagMs)) return false;
  if (!kontoLesbar) return false;
  if (gesehen(schluessel)) return false;
  // Der erste Besuch beginnt ohne Klasse - also bei „Kinder und Zugänge".
  if (schluessel === RUNDGANG_KINDER_UND_ZUGAENGE) return ohneKlasseBeimLaden;
  // Der Lernstand folgt, sobald der erste Teil gesehen ist.
  return gesehen(RUNDGANG_KINDER_UND_ZUGAENGE);
}

/**
 * Was muss am Konto nachgetragen werden? Die vereinigte Liste - oder `null`,
 * wenn das Konto schon alles kennt, was das Gerät kennt (dann wird nicht
 * geschrieben).
 */
export function fuerKontoNachzutragen(
  geraet: readonly string[],
  konto: readonly string[],
): string[] | null {
  const fehlt = geraet.filter((k) => !konto.includes(k));
  if (fehlt.length === 0) return null;
  return [...konto, ...fehlt];
}

/**
 * ★ Ein Rundgang auf Wunsch - aus der Hilfe („Rundgang noch einmal",
 * „Rundgang durch Meine Klassen") oder aus „Was gibt's Neues".
 *
 * Ein kleiner Speicher statt eines Rückrufs: Der Knopf steht in einem
 * Fenster, das dem Rundgang nicht gehört, und der Wunsch muss einen
 * Seitenwechsel überleben (aus der Übungsseite nach „Meine Klassen" - `Root`
 * baut die Seite bei jeder Navigation neu auf, ein Speicher im Modul bleibt).
 * `"meine-klassen"` heisst: der Rundgang des Bildschirms, der dort offen ist.
 */
export type RundgangWunsch = "ueben" | "meine-klassen";

export const useRundgangWunsch = create<{
  wunsch: RundgangWunsch | null;
  wuenschen: (w: RundgangWunsch) => void;
  erledigt: () => void;
}>((set) => ({
  wunsch: null,
  wuenschen: (w) => set({ wunsch: w }),
  erledigt: () => set({ wunsch: null }),
}));
