/**
 * ★★★★★ KLASSENMATCH: NACH DEM MATCH NUR DIE OBERE HÄLFTE (Johannes 18.11.2026).
 *
 * „3 schüler werden nach dem match ganz normal aufgelistet, ab 4 werden nur
 * mehr die hälfte der Schüler aufgelistet ... bei 5 Schülern die ersten 3, bei
 * sechs auch die ersten 3, bei 7 die ersten 4, bei 22 nur die ersten 11 ...
 * es geht darum die letzten nicht zu beschämen."
 *
 * Gilt für JEDES Klassenmatch in JEDER App (Tastenflow, Punktgenau, Im Griff,
 * Lexami - und jedes künftige). Am 18.11. mit Johannes geklärt:
 *  - bei genau 4 Kindern werden 2 gelistet (Hälfte, aufgerundet);
 *  - ein Kind, das nicht gelistet ist, sieht KEINEN Platz, nur ein Lob
 *    ({@link lobSatz}) - mit seinen Punkten, wo die App Punkte hat;
 *  - gekürzt wird nur die Liste NACH dem Match; die laufende Liste während des
 *    Spiels bleibt, wie sie ist;
 *  - die Lehrkraft sieht keine dieser Listen (es gibt keine Lehrkraft-Ansicht).
 *
 * Ein Gleichstand an der Grenze wird nicht zerschnitten: Wer denselben Platz hat
 * wie das letzte gelistete Kind, steht auch da. Sonst stünde von zwei gleich
 * guten Kindern eines in der Liste und eines nicht.
 */

/** Wie viele Kinder nach dem Match gelistet werden: bis 3 alle, ab 4 die Hälfte (aufgerundet). */
export function sichtbareAnzahl(anzahl: number): number {
  if (anzahl <= 3) return Math.max(0, anzahl);
  return Math.ceil(anzahl / 2);
}

/** Die fertige Rangliste (Platz 1 zuerst), gekürzt auf die obere Hälfte. */
export function sichtbareRangliste<T extends { platz: number }>(liste: readonly T[]): T[] {
  const k = sichtbareAnzahl(liste.length);
  if (k >= liste.length) return [...liste];
  const grenze = liste[k - 1].platz;
  return liste.filter((e) => e.platz <= grenze);
}

/** Steht dieses Kind in der gekürzten Liste? */
export function istGelistet(
  sichtbar: readonly { stand: { pupilUid: string } }[],
  pupilUid: string,
): boolean {
  return sichtbar.some((e) => e.stand.pupilUid === pupilUid);
}

/**
 * Das Lob für ein Kind, das nicht gelistet ist - ohne Platz, ohne Vergleich.
 * Mit Punkten, wo die App Punkte zählt (Im Griff, Lexami); sonst und bei 0
 * Punkten: „Gut gemacht - du warst dabei!".
 */
export function lobSatz(punkte?: number): string {
  if (punkte === undefined || punkte <= 0) return "Gut gemacht - du warst dabei!";
  return `Gut gemacht - du hast ${punkte === 1 ? "1 Punkt" : `${punkte} Punkte`}.`;
}
