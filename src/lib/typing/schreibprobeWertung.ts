/**
 * ★★★ DIE WERTUNG DER TIPPCHALLENGE - ein Prozentrang, vom Besten ausgehend.
 *
 * Johannes, 10.09.2026: *„ein Prozentranking vom besten ausgehend, genauigkeit
 * schlägt zeit, bitte recherciere für die auswertung gängige
 * tastschreibwettkämpfe um hier ähnlich zu werten"*
 *
 * Die Recherche steht in `RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md` - mit
 * Fundstellen, zwölf durchgerechneten Beispielen und den zwei verworfenen
 * Alternativen. Hier steht nur, was daraus geworden ist, und warum.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * DIE FORMEL
 * ════════════════════════════════════════════════════════════════════════════
 *
 *     Güte    G = Zeichen / (Zeichen + 5 × Fehlgriffe)          0 … 1
 *     Tempo   V = Wurzel( min(1, Anschläge/Bezug) )             0 … 1
 *     Wert    L = 100 × G × V                                   0 … 100
 *     Rang    R = 100 × L / L(bestes Kind)                      0 … 100
 *
 * ── Warum die Güte ein BRUCH ist und keine Subtraktion ──────────────────────
 * Die klassische Wettschreib-Formel lautet „Zeichen minus fünf je Fehlgriff"
 * und kann **negativ werden**. Eine negative Leistungszahl ist eine Aussage
 * gegen ein Kind ([[feedback_nie_gegen_das_kind]]); die schreiben wir nicht hin.
 *
 * `Zeichen / (Zeichen + 5 × Fehlgriffe)` sagt DASSELBE - ein Fehlgriff ist fünf
 * Zeichen wert - liegt aber immer zwischen 0 und 1. Im ganzen sinnvollen
 * Bereich sind beide fast gleich; erst dort, wo die klassische Formel ins
 * Negative kippt, geht diese sanft gegen null. **Dieselbe Regel, nur ohne den
 * Boden, der gegen ein Kind spricht.**
 *
 * ── Warum die WURZEL beim Tempo - das ist der eigentliche Auftrag ───────────
 * ★★★★★ Sie ist es, die „Genauigkeit schlägt Zeit" wahr macht, nicht der
 * Faktor 5. Mit ihr hat mehr Tempo einen abnehmenden Ertrag: doppelt so schnell
 * zählt nicht doppelt, sondern 1,4-fach (Wurzel aus 2).
 *
 * Gegenprobe aus der Recherche (§4.4): OHNE die Wurzel rutscht ein Kind mit 300
 * Anschlägen und 90 % Treffsicherheit vor ein Kind mit 120 Anschlägen und
 * 99,5 % - dann schlüge Zeit die Genauigkeit, also genau das Gegenteil des
 * Auftrags.
 *
 * MIT der Wurzel gilt: 120 Anschläge bei 99,5 % liegen vor 300 bei 90 %. Das
 * schnelle Kind ist zweieinhalbmal so schnell und verliert trotzdem.
 *
 * ── Warum das Bezugstempo weniger heikel ist, als es aussieht ───────────────
 * Solange kein Kind darüber liegt, **kürzt es sich im Rang vollständig weg**.
 * Es ist nur die Deckelung nach oben und der Maßstab für den gespeicherten
 * Wert `L`. ⚠️ Die 240 sind eine gewählte Zahl (Intersteno-Mindesttempo für
 * Erwachsene), keine zitierte Vorschrift.
 *
 * ── Seit 23.09.2026: „Freies Schreiben" hat ein EIGENES Fehlergewicht ───────
 * Der Faktor 5 gilt nur im STRENGEN Modus (heute, Vorgabe). Im freien Modus
 * (Fehler bleiben stehen, Rücktaste bessert aus - `SchreibprobePlan.modus`)
 * gilt {@link FEHLER_GEWICHT_FREI} = 50 - Begründung dort. Die Formel selbst
 * (Bruch, Wurzel, Deckelung) bleibt in BEIDEN Modi gleich; nur der Faktor
 * wechselt ({@link fehlerGewicht}). Siehe
 * `BAUPLAN-2026-09-23-FREIES-SCHREIBEN.md` §2 und
 * `RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md`.
 *
 * ⚠️⚠️ QUERVERWEIS - ZWEI STELLEN, DIE VONEINANDER NICHTS WISSEN: Dieselbe
 * Formel (Güte, Tempo, `FEHLER_GEWICHT=5`, `FEHLER_GEWICHT_FREI=50`,
 * `BEZUGSTEMPO=240`, `MIND_ZEICHEN_WERTUNG=200`) steht UNABHÄNGIG noch einmal
 * in `pocketbase/pb_hooks/tt_schreibprobe_mail.pb.js` (Funktion `wertVon`) -
 * als JavaScript, weil PocketBase-Hooks kein TypeScript aus `src/`
 * importieren können. Ändert sich die Formel HIER, muss sie dort von Hand
 * nachgezogen werden, und umgekehrt (siehe
 * [[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */

/**
 * Was ein Fehlgriff kostet, ausgedrückt in Zeichen.
 *
 * ★★ Der einzige HERGELEITETE Faktor der ganzen Recherche: Er fällt aus der
 * Netto-WPM-Konvention heraus (ein „Wort" sind dort fünf Anschläge), er wurde
 * nicht beschlossen. Alle anderen Zahlen hier sind gesetzt.
 *
 * ⚠️ Die Wettkampf-Ordnungen kennen weit höhere Werte (Intersteno 50 Punkte je
 * Fehler). Die sind aber auf einen ANDEREN Fehlerbegriff geeicht: dort zählen
 * nur die Fehler, die am Ende noch im Text stehen. Bei uns steht am Ende IMMER
 * der richtige Text - „erst richtig, dann weiter" - und gezählt wird jeder
 * Fehlgriff unterwegs. Unser Fehlerbegriff ist also viel umfassender, und ein
 * Wettkampf-Faktor darauf angewandt würde jedes Kind vernichten.
 */
export const FEHLER_GEWICHT = 5;

/**
 * ★★★ Was ein STEHENDER Fehler im freien Modus kostet, ausgedrückt in Zeichen
 * (23.09.2026, „Freies Schreiben" - Entscheidung Johannes, Bauplan §7:
 * „k = 50 je stehendem Fehler").
 *
 * Im freien Modus zählt NUR, was am Ende falsch im Text steht - dieselbe
 * Zählweise wie beim Intersteno-Internetwettbewerb und beim
 * Rheinland-Pfälzischen Schülerleistungsschreiben, die beide mit k = 50
 * rechnen (`RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md` §1.1, §1.5, §1.10).
 * Anders als im strengen Modus ({@link FEHLER_GEWICHT}) ist ein stehender
 * Fehler NICHT schon durch die Uhr bestraft: Wer ihn stehen lässt, verliert
 * dafür keine Zeit. Der Faktor muss darum so gross sein wie in den
 * Regelwerken selbst, die genau diese Zählweise verwenden.
 *
 * Nachgerechnet (Bauplan §2): 0,5 % stehende Fehler ergeben G = 0,80 - fast
 * genau so viel wie 95 % Treffsicherheit im strengen Modus (G ≈ 0,79). Die
 * Werte beider Modi bleiben damit vergleichbar gross, obwohl sie ganz
 * verschiedene Dinge zählen.
 */
export const FEHLER_GEWICHT_FREI = 50;

/**
 * Das Fehlergewicht des Modus - streng (Vorgabe, {@link FEHLER_GEWICHT}) oder
 * frei ({@link FEHLER_GEWICHT_FREI}). Fehlt `modus`, gilt streng - wie bei
 * {@link SchreibprobePlan.modus}.
 */
export function fehlerGewicht(modus?: "frei"): number {
  return modus === "frei" ? FEHLER_GEWICHT_FREI : FEHLER_GEWICHT;
}

/**
 * Bezugstempo (Anschläge je Minute), an dem der Tempo-Anteil gedeckelt wird.
 * Je Tippchallenge einstellbar; hier die Vorgabe.
 */
export const BEZUGSTEMPO = 240;

/**
 * So viele Zeichen braucht es mindestens für eine Wertung.
 *
 * ★★ Darunter gibt es KEINEN Rangwert - und ausdrücklich auch keinen letzten
 * Platz, sondern „zu kurz für eine Wertung". Bei 100 Zeichen entscheidet ein
 * einziger Fehlgriff über einen Prozentpunkt Treffsicherheit; das ist Rauschen
 * und darf nicht wie ein Ergebnis aussehen.
 */
export const MIND_ZEICHEN_WERTUNG = 200;

/**
 * Güte 0..1 - Zeichen gegen Zeichen plus gewichtete Fehler.
 *
 * `gewicht`: Vorgabe {@link FEHLER_GEWICHT} (streng) - im freien Modus reicht
 * man {@link FEHLER_GEWICHT_FREI} herein (über {@link fehlerGewicht}).
 */
export function guete(zeichen: number, fehler: number, gewicht: number = FEHLER_GEWICHT): number {
  const z = Math.max(0, zeichen);
  const f = Math.max(0, fehler);
  const nenner = z + gewicht * f;
  if (!(nenner > 0)) return 0;
  return z / nenner;
}

/** Tempo-Anteil 0..1 - gedeckelt und mit abnehmendem Ertrag. */
export function tempoAnteil(anschlaege: number, bezug: number = BEZUGSTEMPO): number {
  if (!(bezug > 0)) return 0;
  return Math.sqrt(Math.min(1, Math.max(0, anschlaege) / bezug));
}

/**
 * ★★★ WIE DER ZEITZUSCHLAG IN DIE WERTUNG KOMMT - und warum das eine
 * Entscheidung ist, keine Rechnung.
 *
 * Die Recherche hat einen Fehler in der ersten Fassung gefunden: **In einer
 * Raten-Formel ist ein Zeitzuschlag wirkungslos.** Mehr Zeit heisst mehr
 * Zeichen in mehr Zeit - die Anschläge je Minute bleiben gleich. Das Häkchen im
 * Lehrbereich hätte für die Rangliste also gar nichts getan.
 *
 * Damit es etwas tut, muss der Zuschlag auf die RATE wirken:
 * `Anschläge × (1 + Zuschlag/100)`. Das sagt: Die Lesezeit auf der Braillezeile
 * ist keine Schreibzeit.
 *
 * ⚠️⚠️ **ABER NUR, WO NICHTS GEMESSEN WURDE.** Hat die App vorgelesen, ist die
 * Wartezeit bereits exakt aus der Schreibzeit heraus - die Rate ist dadurch
 * schon gestiegen. Käme der pauschale Zuschlag oben drauf, zählte dieselbe
 * Lesezeit zweimal. Darum: gemessene Wartezeit über null ⇒ kein Zuschlag.
 *
 * Das ist zugleich die Antwort auf die Frage, warum die Vorgabe seit dem
 * 10.09.2026 auf 0 steht: Der gemessene Abzug ist der Weg, der Zuschlag der
 * Notnagel (`BEFUND-2026-09-10-VORLESEZEIT-GEMESSEN.md`).
 */
export function wirksamerZuschlag(
  zuschlagProzent: number,
  bekommtZuschlag: boolean,
  gemesseneWartezeitMs: number,
): number {
  if (!bekommtZuschlag) return 0;
  if (gemesseneWartezeitMs > 0) return 0;
  return Math.max(0, zuschlagProzent);
}

export interface WertungsEingang {
  zeichen: number;
  fehler: number;
  /** Anschläge je Minute, wie sie im Ergebnis stehen. */
  anschlaege: number;
  /** Prozent, schon durch {@link wirksamerZuschlag} gegangen. */
  zuschlagProzent?: number;
  bezug?: number;
  /**
   * ★ 23.09.2026: „frei" = Freies Schreiben, wertet mit
   * {@link FEHLER_GEWICHT_FREI}. Fehlt das Feld, gilt streng
   * ({@link FEHLER_GEWICHT}) - wie bisher.
   */
  modus?: "frei";
}

export interface Wertung {
  /** Güte 0..1. */
  guete: number;
  /** Tempo-Anteil 0..1. */
  tempo: number;
  /**
   * Der Leistungswert 0..100. **Er wird gespeichert**, nicht der Rang: Ein Kind
   * soll seinen eigenen Fortschritt über mehrere Tippchallenges sehen können,
   * und dafür taugt ein Rang nicht - der hängt davon ab, wer sonst mitschrieb.
   */
  wert: number;
  /** Für die Anzeige gewertete Anschläge (mit wirksamem Zuschlag). */
  anschlaegeGewertet: number;
  /** false = unter {@link MIND_ZEICHEN_WERTUNG} Zeichen, keine Wertung. */
  gewertet: boolean;
}

export function werte(e: WertungsEingang): Wertung {
  const g = guete(e.zeichen, e.fehler, fehlerGewicht(e.modus));
  const apm = Math.max(0, e.anschlaege) * (1 + Math.max(0, e.zuschlagProzent ?? 0) / 100);
  const v = tempoAnteil(apm, e.bezug ?? BEZUGSTEMPO);
  return {
    guete: g,
    tempo: v,
    wert: Math.round(100 * g * v * 10) / 10,
    anschlaegeGewertet: Math.round(apm),
    gewertet: e.zeichen >= MIND_ZEICHEN_WERTUNG,
  };
}

/**
 * Der Rang in Prozent, gemessen am besten Kind dieser Tippchallenge.
 *
 * `null`, wenn es keinen Vergleich gibt (niemand gewertet, oder der beste Wert
 * ist null). Ein Rang von 100 heisst „bestes Ergebnis dieser Runde", nicht
 * „fehlerfrei" - das ist der Unterschied zu einer Note, und er gehört in jede
 * Anzeige daneben.
 */
export function rangProzent(wert: number, bester: number): number | null {
  if (!(bester > 0)) return null;
  return Math.round((100 * Math.max(0, wert)) / bester * 10) / 10;
}

/** Der beste Leistungswert einer Liste (nur gewertete Ergebnisse zählen). */
export function bestenWert(werte: readonly Wertung[]): number {
  let best = 0;
  for (const w of werte) if (w.gewertet && w.wert > best) best = w.wert;
  return best;
}
