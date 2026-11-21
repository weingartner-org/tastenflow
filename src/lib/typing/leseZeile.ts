/**
 * ★★★★★ DIE LESEZEILE - GENAU EINE ZEILE HELL BEIM MEHRZEILIGEN LESEN
 * (E12, 20.09.2026). Reine Rechnung für `components/typing/CviLesezeile.tsx`.
 * ============================================================================
 *
 * Testerin hat ein Bild geschickt vom Lückentext „Was fehlt hier?": Bei grosser
 * Laufweite (Zeichenabstand CVI) lief die Frage über fünf Zeilen, und ihr
 * Schüler (CVI - zerebrale Sehbeeinträchtigung) verlor beim Lesen die Zeile.
 * Johannes, wörtlich: *„bei einstellung CVI und mehrzeiligen Texten wie im
 * bild oben brauchen wir ein weiteres feature: es wird nur eine 'Lesezeile'
 * hell und das eingabefeld. mit Pfeil ab kann man von zeile zu zeile springen
 * mit Pfeil auf wieder hinauf, alle anderen zeilen sind 80% Verdunkelt"*.
 *
 * ── WARUM EIN EIGENES BAUTEIL, NICHT `CviAbdunkeln` ERWEITERT ───────────────
 * `CviAbdunkeln` dunkelt GENAU EIN Rechteck ab (die ganze Übungskarte) und tut
 * das nur, SOLANGE getippt wird (Schreibtakt, 5 s Frist danach wieder hell).
 * Die Lesezeile dunkelt MEHRERE Rechtecke gleichzeitig ab (alle Zeilen einer
 * Frage ausser einer) und tut das IMMER, sobald CVI an ist und der Text
 * wirklich umbricht - auch VOR dem ersten Tastendruck, denn genau dann wird
 * die Frage gelesen. Zwei verschiedene Fragen, zwei verschiedene Antworten -
 * derselbe Geist (rein sichtbar, `aria-hidden`, kein Fokus, kein
 * `preventDefault` auf Zeichen-Tasten - siehe `CviAbdunkeln.tsx`).
 *
 * ── ZEILEN ERMITTELN, NICHT RATEN ────────────────────────────────────────────
 * Wo ein umbrochener Text seine Zeilen hat, weiss nur der Browser:
 * `Range.getClientRects()` über den Textinhalt liefert je sichtbarer ZEILE ein
 * oder mehrere Rechtecke - mehrere, wenn mehrere Textknoten/`<span>` auf
 * derselben Zeile landen (EN4 mischt Bedienung und Übungssprache genau so).
 * {@link zeilenAusRechtecken} fasst sie zu ZEILEN zusammen, indem sie nach der
 * MITTE ihrer senkrechten Lage gruppiert werden - eine REINE Funktion, ohne
 * DOM: Rechtecke rein, Zeilen raus. Darum ohne Browser testbar - jsdom rechnet
 * kein Layout und liefert bei `getClientRects()` nichts.
 *
 * ── PFEILTASTEN, OHNE DAS TIPPEN ZU STÖREN ──────────────────────────────────
 * Pfeil ab/auf dürfen die Lesezeile nur bewegen, wenn der Fokus in einem ECHT
 * EINZEILIGEN Textfeld steht ({@link istEinzeiligesTextfeld}) - dort bewegen
 * Pfeil auf/ab den Schreibzeiger ohnehin nicht (anders als in einem
 * `<textarea>`, einem Zahlen-/Datumsfeld, einem Schieberegler oder einer
 * Liste/einem Menü, wo sie eine eigene Bedeutung haben). An den Enden
 * passiert nichts (kein Sprung, kein Umlauf - {@link naechsteZeile}/
 * {@link vorherigeZeile}).
 */

/** Ein Rechteck in Bildschirm- oder Container-Koordinaten (px). */
export interface LesezeileRechteck {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Zwei Rechtecke gelten als „dieselbe Zeile", wenn ihre senkrechte MITTE nicht
 * weiter auseinanderliegt als die halbe grössere Höhe - robust gegen leicht
 * unterschiedliche Randmasse einzelner Text-Fragmente auf derselben Zeile
 * (verschiedene `<span>`, verschiedene Schriftgrösse einer eingebetteten
 * Stelle).
 */
function selbeZeile(a: LesezeileRechteck, b: LesezeileRechteck): boolean {
  const mitteA = a.y + a.h / 2;
  const mitteB = b.y + b.h / 2;
  return Math.abs(mitteA - mitteB) <= Math.max(a.h, b.h) / 2;
}

/**
 * Rechtecke (aus `Range.getClientRects()`) zu ZEILEN zusammenfassen, top-nach-
 * unten sortiert. Nullflächen-Rechtecke (leere Textknoten, jsdom ohne Layout)
 * zählen nicht mit - sie sind kein Umbruch, sie sind nichts.
 */
export function zeilenAusRechtecken(
  rechtecke: readonly LesezeileRechteck[],
): LesezeileRechteck[] {
  const gueltig = rechtecke.filter((r) => r.w > 0 && r.h > 0);
  const sortiert = [...gueltig].sort((a, b) => a.y - b.y || a.x - b.x);
  const gruppen: LesezeileRechteck[][] = [];
  for (const r of sortiert) {
    const gruppe = gruppen.find((g) => selbeZeile(g[0], r));
    if (gruppe) gruppe.push(r);
    else gruppen.push([r]);
  }
  return gruppen.map((gruppe) => {
    const links = Math.min(...gruppe.map((g) => g.x));
    const oben = Math.min(...gruppe.map((g) => g.y));
    const rechts = Math.max(...gruppe.map((g) => g.x + g.w));
    const unten = Math.max(...gruppe.map((g) => g.y + g.h));
    return { x: links, y: oben, w: rechts - links, h: unten - oben };
  });
}

/** Eine Zeile weiter (Pfeil ab) - an der letzten Zeile passiert nichts. */
export function naechsteZeile(aktuell: number, anzahlZeilen: number): number {
  if (anzahlZeilen <= 0) return 0;
  return Math.min(anzahlZeilen - 1, aktuell + 1);
}

/** Eine Zeile zurück (Pfeil auf) - vor der ersten Zeile passiert nichts. */
export function vorherigeZeile(aktuell: number): number {
  return Math.max(0, aktuell - 1);
}

/**
 * Den Zeilen-Index in die gültige Spanne zwingen - z. B. wenn ein Umbruch
 * nach einer Fenstergrössen-Änderung plötzlich weniger Zeilen hat.
 */
export function zeilenIndexKlemmen(index: number, anzahlZeilen: number): number {
  if (anzahlZeilen <= 0) return 0;
  return Math.min(Math.max(0, index), anzahlZeilen - 1);
}

/**
 * ★★★★★ NUR EIN ECHT EINZEILIGES TEXTFELD (Pflicht Nr 3, 20.09.2026): Pfeil
 * auf/ab bewegen dort den Schreibzeiger NICHT - anders als in einem
 * `<textarea>` (mehrzeilig), einem Zahlenfeld (Pfeil = Spinner), einem
 * Datumsfeld (Pfeil = Segment), einem Schieberegler (Pfeil = Wert) oder einer
 * Liste/einem Menü (Pfeil = Auswahl). Nur GENAU diese Feldtypen gelten als
 * sicher; alles andere - auch ein unbekannter neuer Typ - lässt die Funktion
 * in Ruhe (Vorgabe „nein", nicht „ja").
 */
const SICHERE_FELDTYPEN = new Set([
  "text",
  "search",
  "email",
  "url",
  "tel",
  "password",
]);

/** Steht der Fokus in einem echt einzeiligen Textfeld? */
export function istEinzeiligesTextfeld(
  el: EventTarget | null,
): el is HTMLInputElement {
  return (
    typeof HTMLInputElement !== "undefined" &&
    el instanceof HTMLInputElement &&
    SICHERE_FELDTYPEN.has(el.type)
  );
}

/**
 * ★★★★★ DIE KORREKTUR VOM 20.09.2026 - NICHT NUR DIE ANDEREN ZEILEN, DER GANZE
 * BILDSCHIRM. Johannes, wörtlich: *„nein es sollen nicht nur die anderen
 * Zeilen geschwärzt werden sondern der ganze Bildschirm außer der Lesezeile
 * und der Eingabezeile"*.
 *
 * Verdunkelt wird von jetzt an der GANZE Bildschirm (Kopfzeile, Überschrift,
 * Knöpfe, Fusszeile - alles), hell bleiben genau zwei Löcher: die Lesezeile
 * und das Eingabefeld. Ein Schlagschatten (wie bei `CviAbdunkeln`, EIN Loch)
 * kann das nicht - er kennt nur ein Rechteck, das hell bleibt. Darum hier die
 * WAAGRECHTE BANDZERLEGUNG: den Bildschirm in Streifen schneiden, in jedem
 * Streifen die Löcher aussparen, die dort tatsächlich liegen.
 *
 * Bei genau zwei nicht überlappenden Löchern (das übliche Bild: Lesezeile
 * über dem Eingabefeld) entstehen so das Band darüber, links/rechts vom
 * oberen Loch, das Band dazwischen, links/rechts vom unteren Loch, das Band
 * darunter. Die Rechnung geht aber nicht von GENAU zwei Löchern aus, sondern
 * von beliebig vielen (auch null oder überlappenden) - dieselbe Formel
 * deckt jeden Sonderfall aus Punkt 3 mit ab, ohne eine Ausnahme im Code:
 * Ein Loch ausserhalb des Bildschirms trägt nach dem Zuschneiden nichts mehr
 * bei (als gäbe es das Loch nicht), zwei überlappende Löcher werden vor dem
 * Zerschneiden zu einer Fläche verschmolzen.
 */

/** Die Grösse der Fläche, die abgedeckt werden soll (der sichtbare Bildschirm). */
export interface Bildschirmgroesse {
  w: number;
  h: number;
}

/**
 * ★ Damit die Lesezeile und das Eingabefeld nicht an der Kante ihres eigenen
 * Lochs kleben (Punkt 4, 20.09.2026) - dieselbe Grössenordnung wie die Luft
 * um den Leuchtrahmen in `CviAbdunkeln.tsx` (dort 6 px).
 */
export const LESEZEILE_LUFT = 6;

/** Ein Rechteck um ein paar Pixel nach allen Seiten vergrössern. */
export function mitLuft(r: LesezeileRechteck, luft: number): LesezeileRechteck {
  return { x: r.x - luft, y: r.y - luft, w: r.w + 2 * luft, h: r.h + 2 * luft };
}

/**
 * Ein Loch auf die Bildschirmfläche zuschneiden. Liegt es (nach dem
 * Zuschneiden) nicht mehr auf dem Bildschirm - ganz ausserhalb, oder auf
 * einer Kante mit Nullfläche -, gibt es `null` zurück: ein Loch, das man
 * ohnehin nie sieht, spart auch nichts aus.
 */
function geklemmtesLoch(
  loch: LesezeileRechteck,
  bildschirm: Bildschirmgroesse,
): LesezeileRechteck | null {
  const links = Math.max(0, loch.x);
  const oben = Math.max(0, loch.y);
  const rechts = Math.min(bildschirm.w, loch.x + loch.w);
  const unten = Math.min(bildschirm.h, loch.y + loch.h);
  if (rechts <= links || unten <= oben) return null;
  return { x: links, y: oben, w: rechts - links, h: unten - oben };
}

/** Die Lücken zwischen (bereits sortierten, ggf. überlappenden) Intervallen einer Achse. */
function luecken(
  intervalle: readonly { von: number; bis: number }[],
  von: number,
  bis: number,
): { von: number; bis: number }[] {
  const ergebnis: { von: number; bis: number }[] = [];
  let zeiger = von;
  for (const iv of intervalle) {
    if (iv.von > zeiger) ergebnis.push({ von: zeiger, bis: iv.von });
    zeiger = Math.max(zeiger, iv.bis);
  }
  if (zeiger < bis) ergebnis.push({ von: zeiger, bis });
  return ergebnis;
}

/**
 * Rechnet aus, welche Rechtecke zusammen die gesamte Bildschirmfläche
 * abdecken, ohne dabei eines der übergebenen Löcher zu berühren - siehe
 * Erklärung oben. Eine REINE Funktion: Löcher + Bildschirmgrösse rein,
 * Abdeck-Rechtecke raus, kein DOM.
 *
 * Verfahren (waagrechte Bandzerlegung): Jedes Loch liefert seine obere und
 * seine untere Kante als waagrechte Schnittlinie. Zwischen zwei benachbarten
 * Schnittlinien ändert sich nie, welche Löcher in diesem Streifen liegen -
 * darum genügt es, in jedem Streifen EINMAL die (waagrecht zusammengefassten)
 * Löcher auszusparen, die ihn an seiner Mitte wirklich schneiden.
 */
export function abdeckRechtecke(
  loecher: readonly LesezeileRechteck[],
  bildschirm: Bildschirmgroesse,
): LesezeileRechteck[] {
  if (bildschirm.w <= 0 || bildschirm.h <= 0) return [];
  const geklemmt = loecher
    .map((l) => geklemmtesLoch(l, bildschirm))
    .filter((l): l is LesezeileRechteck => l !== null);

  if (geklemmt.length === 0) return [{ x: 0, y: 0, w: bildschirm.w, h: bildschirm.h }];

  // Alle waagrechten Schnittlinien (Bildschirmrand + jede Lochkante), sortiert,
  // doppelte entfernt - das sind die Grenzen der Streifen.
  const kanten = Array.from(
    new Set([0, bildschirm.h, ...geklemmt.flatMap((l) => [l.y, l.y + l.h])]),
  ).sort((a, b) => a - b);

  const ergebnis: LesezeileRechteck[] = [];
  for (let i = 0; i < kanten.length - 1; i++) {
    const oben = kanten[i];
    const unten = kanten[i + 1];
    if (unten <= oben) continue;
    const mitte = (oben + unten) / 2;
    // Die Löcher, die DIESEN Streifen wirklich schneiden (an seiner Mitte -
    // robust gegenüber Kanten, die genau auf einer Streifengrenze liegen).
    const intervalle = geklemmt
      .filter((l) => l.y <= mitte && l.y + l.h >= mitte)
      .map((l) => ({ von: l.x, bis: l.x + l.w }))
      .sort((a, b) => a.von - b.von);
    for (const { von, bis } of luecken(intervalle, 0, bildschirm.w)) {
      if (bis > von) ergebnis.push({ x: von, y: oben, w: bis - von, h: unten - oben });
    }
  }
  return ergebnis;
}

/**
 * ★ Verdunkelungsgrad - dieselbe Zahl an EINER Stelle, nicht im Code
 * verstreut. Johannes, 19.09.2026: „verdunkle die Umgebung noch etwas
 * stärker" (0,8 statt 0,66); gilt seither für `CviAbdunkeln` UND (20.09.2026)
 * für die Lesezeile - beide sollen gleich dunkel wirken.
 */
export const CVI_VERDUNKELUNG = 0.8;
