/**
 * ARBEITSBLATT - die Stelle, an der gearbeitet wird, in die Mitte rollen.
 * ============================================================================
 * ★★★ GEHÖRT KEINEM PROGRAMM ALLEIN (Johannes, 25.08.2026): „Bitte speichere
 * das in einem extra Bereich, auf den andere Programme der Lernplattform auch
 * zugreifen können."
 *
 * Die Regeln dahinter: `Sensorik/BAUART-ARBEITSBLATT-BARRIEREFREI.md`.
 * ⚠️ Wer hier etwas ändert, ändert es dort mit - sonst gibt es zwei Wahrheiten,
 * und die zweite ist irgendwann die falsche.
 *
 * ★★★★★ ANLASS (Johannes, 09.09.2026):
 *
 * > „wenn tab gedückt wird soll der Fokus (aufgabe des aktuellen Beispiels) in
 * > die mitte des monitores scrollen, automatisch (geht das, das wäre eine
 * > rießige unterstützung für menschen mit sehbehinderung)"
 *
 * Ja, das geht - und es ist mehr als Bequemlichkeit.
 *
 * WARUM DER BROWSER ES NICHT SCHON TUT: Er rollt ein neu fokussiertes Element
 * **so wenig wie möglich** ins Bild. Das Ergebnis ist, dass die Arbeitsstelle
 * fast immer am RAND klebt - beim Vorwärts-Tabben unten, beim Rückwärts-Tabben
 * oben. Wer mit 400 oder 800 Prozent arbeitet, sieht dann von seiner Aufgabe
 * nur die eine Zeile, in der er steht: Die Rechnung darüber und die Einheit
 * darunter liegen ausserhalb. Und wer eine Bildschirmlupe benutzt, muss nach
 * jedem Tab-Druck erst suchen, wo die Lupe gelandet ist.
 *
 * In der Mitte ist die Stelle **vorhersagbar**. Das ist der eigentliche
 * Gewinn: nicht, dass mehr zu sehen ist, sondern dass man nicht mehr suchen
 * muss. Dieselbe Überlegung wie bei der Lesestelle beim Vergrössern
 * (`lesestelle.ts`) - der Blick soll nicht wandern müssen.
 *
 * ⚠️ FÜR EIN KIND MIT BLINDHEIT ÄNDERT SICH NICHTS. Der Bildlauf berührt weder
 * den Fokus noch die Braillezeile; es merkt davon nichts. Genau so soll es
 * sein - eine Hilfe für die einen darf für die anderen nichts kosten.
 *
 * ── DREI ENTSCHEIDUNGEN, DIE HIER GETROFFEN SIND ──────────────────────────
 *
 *  1. **Nur bei der Tastatur, nicht beim Zeigen.** Wer mit dem Zeiger auf ein
 *     Feld geht, weiss, wo es liegt - unter seinem Finger. Die Seite darunter
 *     wegzuziehen wäre in diesem Augenblick das Gegenteil einer Hilfe.
 *     Gemessen wird das nicht an der Taste, sondern am Zeiger: Kam kurz vorher
 *     ein `pointerdown`, ist der Fokuswechsel seiner - alles andere zählt als
 *     Tastatur. **Das ist Absicht**: Ein Screenreader setzt den Fokus über die
 *     Schnittstelle, ohne dass ein Tastendruck die Seite je erreicht
 *     ([[reference_screenreader_nicht_abfragbar]]). Wer auf `keydown` prüfte,
 *     liesse genau die Kinder aussen vor, um die es geht.
 *
 *  2. ★★★★★ **Ohne Bewegung - und `instant`, nie `auto`.** Das ist kein
 *     Feinschliff, sondern der Unterschied zwischen „funktioniert" und
 *     „funktioniert nicht" - **am 09.09.2026 in einem echten Browser
 *     gemessen**, mit `auto` in der ersten Fassung:
 *
 *       | Vergrösserung | grösste Abweichung von der Mitte |
 *       |---|---|
 *       | 100 % | 96 px - sah richtig aus |
 *       | 800 % | 24.441 px - es rollte überhaupt nicht |
 *
 *     Der Wert `auto` heisst NICHT „sofort", sondern „nimm, was in CSS steht" -
 *     und die Plattform setzt `scroll-behavior: smooth` auf das ganze Dokument
 *     (`src/index.css`). Bei kurzen Wegen ist die Bewegung in einem Augenblick
 *     vorbei und fällt nicht auf; bei 800 Prozent sind es Tausende von
 *     Punkten, und der nächste Tab-Druck bricht sie ab, bevor sie ankommt -
 *     **genau bei den Kindern, für die das Ganze gebaut ist, tat es nichts.**
 *     Dieselbe Falle steht seit dem 24.08.2026 in `lesestelle.ts`; sie ist
 *     hier ein zweites Mal zugeschnappt
 *     ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 *     Hart ist ausserdem das richtige Verhalten: Ein gleitender Bildlauf über
 *     mehrere Bildschirmhöhen dauert länger als der nächste Tab-Druck. Der
 *     Browser selbst rollt den Fokus ebenfalls hart ins Bild; wir ändern nur,
 *     WOHIN.
 *
 *  3. **Ein zu hohes Element kommt nach OBEN, nicht in die Mitte.** Bei starker
 *     Vergrösserung ist eine Aufgabenkarte mehrere Bildschirme hoch. „Mitte"
 *     hiesse dann: die Karte beginnt oberhalb des Randes, und das Kind steht
 *     mitten im Text, ohne den Anfang zu sehen. Oben ausgerichtet ist die
 *     einzige Lage, die bei jeder Höhe stimmt.
 */

/**
 * So lange nach einem Zeiger-Druck gilt ein Fokuswechsel als seiner.
 *
 * Grosszügig genug für einen Klick, der über `mousedown → focus → mouseup`
 * läuft, und kurz genug, dass ein Tab-Druck unmittelbar danach schon wieder
 * zählt.
 */
const ZEIGER_RUHE_MS = 400;

/**
 * Wie weit die Stelle von der Mitte abweichen darf, ohne dass gerollt wird -
 * als Anteil der Fensterhöhe.
 *
 * ⚠️ OHNE DIESE TOLERANZ ROLLT JEDER TAB-DRUCK. Zwischen a) und b) liegt eine
 * Zeile; die Seite würde bei gewöhnlicher Schriftgrösse bei jedem Feldwechsel
 * um diese eine Zeile zucken. Das ist keine Hilfe, sondern Unruhe - und für
 * jemanden mit Sehrest die schlechteste Sorte Unruhe, weil sie das Bild
 * verschiebt, ohne etwas zu zeigen.
 *
 * 12 Prozent der Fensterhöhe sind bei 900 px etwa 108 px - zwei bis drei
 * Zeilen bei gewöhnlicher Schrift, bei starker Vergrösserung weniger als eine.
 * Genau so soll es wirken: Je grösser die Schrift, desto strenger die Mitte.
 */
const TOLERANZ_ANTEIL = 0.12;

/**
 * Was ein Element zu hoch macht: mehr als so viel der Fensterhöhe.
 *
 * ⚠️ Fast die ganze Höhe, nicht vier Fünftel: Ein Element von 750 Punkten in
 * einem Fenster von 900 lässt sich sehr wohl mitteln (oben bleiben 75 Punkte
 * frei) - und die Mitte ist die Zusage. Erst wenn es NICHT MEHR HINEINPASST,
 * wird „Mitte" sinnlos, weil der Anfang dann oberhalb des Randes läge.
 */
const ZU_HOCH_ANTEIL = 0.9;

export interface FokusMitteOptionen {
  /**
   * Ist die Hilfe eingeschaltet? Wird bei JEDEM Fokuswechsel gefragt, damit
   * ein Umschalten im Zahnrad sofort wirkt und der Wächter nicht neu
   * aufgehängt werden muss.
   */
  an?: () => boolean;
}

/**
 * Den Bildlauf an ein Blatt hängen. Gibt die Abmelde-Funktion zurück.
 *
 * ⚠️ `focusin` und nicht `focus`: Nur `focusin` steigt auf, ein Fokuswechsel
 * tief in einer Aufgabenkarte käme sonst nie an der Wurzel an.
 */
export function fokusMitteStarten(
  wurzel: HTMLElement,
  { an = () => true }: FokusMitteOptionen = {},
): () => void {
  let zeigerBis = 0;

  const beiZeiger = () => {
    zeigerBis = Date.now() + ZEIGER_RUHE_MS;
  };

  const beiFokus = (e: FocusEvent) => {
    if (!an()) return;
    if (Date.now() < zeigerBis) return;
    const ziel = e.target as HTMLElement | null;
    if (!ziel || typeof ziel.getBoundingClientRect !== "function") return;
    if (!wurzel.contains(ziel)) return;
    // ⚠️ Ein offener Dialog hat seinen eigenen Bildlauf. Die Seite dahinter zu
    // verschieben, während das Kind in einem Fenster steht, verschöbe genau
    // das, was es beim Schliessen wiederfinden will
    // ([[feedback_nvda_focus_pattern]], Dialog-Guard).
    if (ziel.closest('[role="dialog"]')) return;

    /**
     * ⚠️ ERST IM NÄCHSTEN TAKT. Der Browser rollt selbst noch, während dieses
     * Ereignis läuft - wer jetzt misst, misst die Lage von vorher und rechnet
     * daraus einen falschen Weg.
     *
     * ⚠️⚠️ `setTimeout`, NICHT `requestAnimationFrame` - gemessen am
     * 09.09.2026. Der Bild-Takt läuft nur, solange die Seite SICHTBAR ist
     * (`document.visibilityState`); in einem verborgenen Tab kommt er nie.
     * Mit `requestAnimationFrame` täte dieser Baustein dort still gar nichts -
     * und „tut still gar nichts" ist genau die Sorte Fehler, die niemandem
     * auffällt ([[feedback_gruener_waechter_beweist_was]]). Der Bildlauf ist
     * echter Zustand, kein Bild: Er darf auch im Hintergrund gestellt werden
     * und stimmt dann, sobald hingesehen wird.
     * ⚠️ Der eigene Bildlauf des Browsers ist zu diesem Zeitpunkt längst
     * angewandt - er geschieht innerhalb der Fokus-Behandlung.
     */
    window.setTimeout(() => {
      if (!ziel.isConnected) return;
      if (document.activeElement !== ziel) return;
      const hoehe = window.innerHeight || document.documentElement.clientHeight;
      if (!hoehe) return;
      const r = ziel.getBoundingClientRect();
      // Ein Element ohne Ausdehnung hat keine Lage, die sich mitteln liesse.
      if (r.height === 0 && r.width === 0) return;

      if (r.height > hoehe * ZU_HOCH_ANTEIL) {
        // Zu hoch für die Mitte - siehe Entscheidung 3 oben.
        ziel.scrollIntoView({ block: "start", behavior: "instant" });
        return;
      }
      const mitteZiel = r.top + r.height / 2;
      if (Math.abs(mitteZiel - hoehe / 2) <= hoehe * TOLERANZ_ANTEIL) return;
      ziel.scrollIntoView({ block: "center", behavior: "instant" });
    }, 0);
  };

  // ⚠️ Der Zeiger wird am DOKUMENT beobachtet, nicht an der Wurzel: Ein Klick
  // daneben - der einen Aufklapper schliesst und den Fokus verschiebt - ist
  // genauso ein Zeiger-Vorgang wie einer im Blatt.
  document.addEventListener("pointerdown", beiZeiger, true);
  document.addEventListener("mousedown", beiZeiger, true);
  document.addEventListener("touchstart", beiZeiger, true);
  wurzel.addEventListener("focusin", beiFokus);

  return () => {
    document.removeEventListener("pointerdown", beiZeiger, true);
    document.removeEventListener("mousedown", beiZeiger, true);
    document.removeEventListener("touchstart", beiZeiger, true);
    wurzel.removeEventListener("focusin", beiFokus);
  };
}
