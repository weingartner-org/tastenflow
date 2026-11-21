/**
 * Wohin ein Fokus-Vorfall gemeldet wird.
 *
 * ★★★ GEHÖRT KEINEM PROGRAMM ALLEIN (Johannes, 25.08.2026): „Bitte speichere
 * das in einem extra Bereich, auf den andere Programme der Lernplattform auch
 * zugreifen können."
 *
 * ⚠️ DIE REGELN DAHINTER STEHEN IN
 * `Sensorik/BAUART-ARBEITSBLATT-BARRIEREFREI.md` §3.
 *
 * ---------------------------------------------------------------------------
 *
 * ★★★ WARUM ES DIESE DATEI GIBT: EIN WÄCHTER, DER STILL REPARIERT, VERBIRGT
 * GENAU DIE FEHLER, DIE ER FINDEN SOLL.
 *
 * `fokuswacheStarten` holt den Fokus zurück, wenn er ins Nichts gefallen ist -
 * das ist die Rettung. Aber die Rettung ist nicht die Heilung: Dass der Fokus
 * überhaupt verlorenging, ist ein Fehler im Blatt, und der gehört behoben. Wer
 * den Wächter ohne Meldung laufen lässt, hat ein Programm, das sich unbemerkt
 * schlecht benimmt und dabei gut aussieht.
 *
 * Auf der Mathecoach-Muster-Seite landen die Vorfälle in einem roten Kasten -
 * dort baut jemand und schaut hin. In den vier Lernprogrammen sitzt ein Kind
 * davor; ihm einen roten Kasten hinzustellen, wäre nur Schrecken ohne Nutzen.
 * Darum gehen sie hier hin:
 *
 * | Wohin | Für wen |
 * |---|---|
 * | `console.warn` mit fester Vorsilbe | wer gerade misst oder einen Fehler sucht |
 * | `window.__fokusvorfaelle` | die Gegenprobe im echten Fenster (Bauart §18) |
 * | `vorfaelle()` | ein Test, der wissen will, ob es still blieb |
 *
 * ★ DIE GEGENPROBE, DIE IN §18 DER BAUART OFFEN STEHT, wird damit zu einer
 * Zeile: einmal mit der Tabtaste durch ein Blatt gehen, abgeben, dann in der
 * Konsole `__fokusvorfaelle` eintippen. Bleibt die Liste leer, ist kein Feld
 * unter den Fingern verschwunden.
 */
import type { Fokusvorfall } from "./fokuswache";

/**
 * Wie viele Vorfälle aufgehoben werden.
 *
 * ⚠️ Begrenzt, und zwar aus einem echten Grund: Ein Blatt, das bei jedem
 * Tastendruck einen Vorfall macht, füllte sonst in einer Unterrichtsstunde den
 * Speicher. Die ersten sind ohnehin die aufschlussreichen - wer die Ursache
 * sucht, will den ERSTEN sehen, nicht den tausendsten.
 */
const HOECHSTENS = 50;

const gesammelt: Fokusvorfall[] = [];

/** Die Vorfälle dieser Sitzung, in der Reihenfolge ihres Auftretens. */
export function vorfaelle(): readonly Fokusvorfall[] {
  return gesammelt;
}

/** Vor einer Messung aufräumen. */
export function vorfaelleLeeren(): void {
  gesammelt.length = 0;
}

/**
 * Einen Vorfall melden. Genau diese Funktion gehört als zweites Argument in
 * `fokuswacheStarten`.
 */
export function meldeVorfall(v: Fokusvorfall): void {
  if (gesammelt.length < HOECHSTENS) gesammelt.push(v);

  // ⚠️ Die Vorsilbe steht fest und ist absichtlich unverwechselbar: Sie ist
  // das, wonach jemand in einer vollen Konsole sucht.
  console.warn(
    `[Fokus-Wächter] Der Fokus stand im Nichts. ` +
      `Weg von: ${v.woher}. Gesetzt auf: ${v.wohin}. Grund: ${v.grund}`,
  );

  // Für die Gegenprobe von Hand im echten Fenster.
  try {
    (globalThis as { __fokusvorfaelle?: readonly Fokusvorfall[] }).__fokusvorfaelle =
      gesammelt;
  } catch {
    /* In einer Umgebung ohne beschreibbares `globalThis` ist das kein Fehler. */
  }
}
