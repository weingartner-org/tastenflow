/**
 * ARBEITSBLATT - beim Vergrößern die Lesestelle behalten.
 * ============================================================================
 * ★★★ GEHÖRT KEINEM PROGRAMM ALLEIN (Johannes, 25.08.2026): „Bitte speichere
 * das in einem extra Bereich, auf den andere Programme der Lernplattform auch
 * zugreifen können … im Griff soll genau auf dieses Wissen zugreifen können,
 * und auch andere Apps unserer Lernplattform."
 *
 * Die Regeln dahinter: `Sensorik/BAUART-ARBEITSBLATT-BARRIEREFREI.md`.
 * ⚠️ Wer hier etwas ändert, ändert es dort mit - sonst gibt es zwei Wahrheiten,
 * und die zweite ist irgendwann die falsche.
 *
 * ★★★★ UND SIE WÄCHST MIT (Johannes, 25.08.2026): „Immer wenn etwas an der
 * Bauart von Arbeitsblättern nachgebessert wird, soll es im allgemeinen Wissen
 * für alle Apps gespeichert werden." Drei Schritte: Regel ins Dokument,
 * Bauteil hierher, Eintrag in den Änderungsverlauf §18 - mit der Angabe,
 * welche Programme noch nachziehen müssen. Schritt 3 vergisst man, und er ist
 * der wichtigste.
 *
 * ★★★ ANLASS (Johannes, 24.08.2026 spätabends):
 *
 * > „Ist es möglich, beim Zoomen die Position zu merken? Zum Beispiel: Ich
 * > stehe auf Beispiel 3 und lese die Angabe, mir ists zu klein und ich zoome
 * > 2x - dann soll sich nicht alles so verändern, dass ich am Bildschirm einen
 * > anderen Text vor mir habe, sondern genau den gleichen Ausschnitt, nur
 * > größer."
 *
 * WARUM DAS PASSIERT: Vergrößern macht die Seite höher - bei achtfacher Schrift
 * achtmal so hoch. Der Bildlauf bleibt aber, wo er war. Wer bei Beispiel 3 auf
 * halber Höhe stand, steht danach irgendwo bei Beispiel 1, und muss sich neu
 * suchen. Genau in dem Augenblick, in dem er vergrößert hat, WEIL er etwas
 * schlecht gesehen hat.
 *
 * DER WEG: Vor der Änderung merken, welches Element gerade oben steht und wie
 * weit unter dem oberen Rand. Nach der Änderung so weit rollen, dass dasselbe
 * Element wieder genauso weit unter dem oberen Rand steht.
 *
 * ★ WELCHES ELEMENT: Zuerst das, in dem der Schreibzeiger steht - das ist die
 * Stelle, an der ein Kind arbeitet, und sie stimmt auch dann, wenn es gar nicht
 * die oberste ist. Nur wenn der Fokus woanders liegt (Kopfzeile, Fenster),
 * zählt das oberste sichtbare Stück.
 *
 * ★★★★ UND NUR, SOLANGE DER SCHREIBZEIGER IM FENSTER STEHT (11.09.2026). Wer
 * im Feld steht und weiterrollt, um nachzulesen, schaut nicht mehr auf sein
 * Feld - dann ist das Feld der falsche Anker. Der ganze Grund steht bei
 * Schritt 1 in `merkeStelle`; gemessen mit
 * `messwerkzeuge-2026-09-11/zoom-fokus-messen.mjs`.
 *
 * ⚠️ FEIN GENUG MUSS ES SEIN. Eine ganze Aufgabenkarte als Anker wäre zu grob:
 * Sie ist bei starker Vergrößerung mehrere Bildschirme hoch, und ihr oberer
 * Rand liegt dann längst außerhalb. Verankert wird darum an den kleinen Teilen -
 * Überschrift, Angabe, Rechnung, Übernahme-Zeile.
 */

import { useCallback, useEffect, useRef } from "react";

/**
 * Die Stellen, an denen verankert werden kann - in der Reihenfolge, in der sie
 * im Blatt vorkommen. Alles, was ein Kind tatsächlich liest.
 */
const ANKER =
  "[data-aufgabe] h3, [data-angabe], [data-rechnung], [data-uebernahme], [data-feld]";

/**
 * ⚠️ DIESE KENNZEICHEN SIND DIE GEMEINSAME SPRACHE ALLER PROGRAMME.
 *
 * `data-aufgabe` an der Karte eines Beispiels, `data-angabe` am Aufgabentext,
 * `data-rechnung` an der Beschriftung, `data-feld` an jedem Antwort-Element.
 * Wer ein Arbeitsblatt baut und sie setzt, bekommt Lesestelle und Fokus-Wächter
 * ohne eine weitere Zeile Code - wer sie weglässt, bekommt nichts davon.
 * Nachzulesen in `Sensorik/BAUART-ARBEITSBLATT-BARRIEREFREI.md` §Kennzeichen.
 */

export interface Lesestelle {
  el: HTMLElement;
  /** Wie weit unter dem oberen Rand des Fensters das Element stand. */
  obenPx: number;
  /**
   * ★★★ WIE GROSS EIN CSS-PUNKT DAMALS WAR (Johannes, 24.08.2026 spätabends:
   * „Kann es sein, dass die Alt + + Funktion jetzt nicht beim Zoomen springt,
   * aber die Strg + + Funktion schon?" - ja, genau so war es).
   *
   * Die BROWSER-Vergrößerung macht die CSS-Punkte selbst größer: Bei 200 %
   * ist ein Punkt doppelt so groß, und der Anzeigebereich hat nur noch halb so
   * viele davon. Ein Element, das 250 Punkte unter dem oberen Rand stand,
   * steht bei denselben 250 Punkten danach doppelt so weit unten AM
   * BILDSCHIRM. Wer nur die Punkte festhält, hält gar nichts fest.
   *
   * `devicePixelRatio` sagt, wie viele Bildschirmpunkte auf einen CSS-Punkt
   * kommen - und ändert sich bei der Browser-Vergrößerung mit. Aus dem
   * Verhältnis vorher zu nachher wird der Abstand umgerechnet.
   *
   * ⚠️ Bei UNSERER Vergrößerung (CSS `zoom`) ändert er sich NICHT - dort sind
   * die gemessenen Punkte schon die vergrößerten, und das Verhältnis ist 1.
   * Dieselbe Rechnung trägt also beide Fälle.
   */
  punktgroesse: number;
}

/**
 * Wo steht das Kind gerade?
 *
 * ⚠️ Gibt `null` zurück, wenn nichts Sichtbares gefunden wird - dann wird eben
 * nicht gerollt. Ein Bildlauf ins Nichts wäre schlimmer als gar keiner.
 */
export function merkeStelle(wurzel: HTMLElement | null): Lesestelle | null {
  if (!wurzel) return null;

  // 1. Der Schreibzeiger - die Stelle, an der gearbeitet wird.
  //
  // ★★★★ ABER NUR, WENN ER ÜBERHAUPT IM FENSTER STEHT (gemessen 11.09.2026,
  // `messwerkzeuge-2026-09-11/zoom-fokus-messen.mjs`).
  //
  // Johannes am 11.09.2026: „Wenn Alt ++ oder Strg ++ gedrückt wird, muss der
  // Fokus und Bildausschnitt an derselben Stelle bleiben!" - und genau das tat
  // er nicht, sobald Schreibzeiger und Blick auseinanderlagen.
  //
  // DER FALL, DER ES ZEIGT: Ein Kind steht mit dem Schreibzeiger in Beispiel 2
  // und liest weiter unten nach - es rollt mit dem Rad, mit dem Trackpad, oder
  // die Sprachausgabe wandert mit ihrem eigenen Zeiger durch die Seite und
  // nimmt den Bildlauf mit. Der Fokus bleibt dabei, wo er war: weit ÜBER dem
  // oberen Rand. Drückt es jetzt Alt + Plus, verankerte sich die Lesestelle an
  // diesem unsichtbaren Feld und hielt dessen Abstand fest - und alles, was das
  // Kind tatsächlich vor sich hatte, wanderte um den ganzen Zuwachs davon.
  // Gemessen bei 1200 Punkten Abstand: schon bei 125 % 180 Punkte Versatz, bei
  // 800 % über 20.000. Dasselbe bei Strg + Plus.
  //
  // ⚠️ Die Regel darunter (Schritt 2) verlangt Sichtbarkeit seit jeher - hier
  // fehlte sie. Der Fokus ist der BESSERE Anker, aber nur, solange er auch die
  // Stelle ist, auf die das Kind schaut. Liegt er ausserhalb, zählt wieder das,
  // was wirklich zu sehen ist.
  const dpr = window.devicePixelRatio || 1;
  const fensterHoehe = window.innerHeight;
  const aktiv = document.activeElement as HTMLElement | null;
  if (aktiv && wurzel.contains(aktiv) && aktiv !== document.body) {
    const r = aktiv.getBoundingClientRect();
    if (r.bottom > 0 && r.top < fensterHoehe) {
      return { el: aktiv, obenPx: r.top, punktgroesse: dpr };
    }
  }

  // 2. Sonst das Stück, das dem oberen Rand am NÄCHSTEN ist.
  //
  // ⚠️ NICHT das erste sichtbare (so stand es zuerst, und es driftete):
  // Bei starker Vergrößerung reicht ein Absatz weit über den oberen Rand
  // hinaus. Er ist dann zwar „sichtbar", sein Anfang liegt aber mehrere
  // hundert Punkte darüber - und alles, was darunter steht, wandert beim
  // Vergrößern um genau diesen Abstand mal dem Zuwachs weiter. Gemessen am
  // 24.08.2026: 75 Punkte je Stufe.
  //
  // Der Anker mit dem kleinsten Abstand zum oberen Rand hält die Stelle
  // dagegen fest: Was direkt daneben steht, verschiebt sich fast gar nicht.
  const hoehe = fensterHoehe;
  let bester: Lesestelle | null = null;
  for (const el of Array.from(wurzel.querySelectorAll<HTMLElement>(ANKER))) {
    const r = el.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= hoehe) continue;
    if (!bester || Math.abs(r.top) < Math.abs(bester.obenPx)) {
      bester = { el, obenPx: r.top, punktgroesse: dpr };
    }
  }
  return bester;
}

/**
 * Dieselbe Stelle wieder an denselben Platz holen.
 *
 * ⚠️ MUSS NACH DEM NEUEN UMBRUCH LAUFEN und VOR dem Zeichnen - sonst sieht man
 * die Seite springen. In React heißt das `useLayoutEffect`, nicht `useEffect`.
 *
 * ★★★ `behavior: "instant"` UND NICHT `"auto"` - das ist kein Feinschliff,
 * sondern der Unterschied zwischen „funktioniert" und „funktioniert nicht"
 * (gemessen am 24.08.2026).
 *
 * Die Plattform setzt `scroll-behavior: smooth` auf das ganze Dokument. Und
 * `behavior: "auto"` heißt NICHT „sofort", sondern „nimm, was eingestellt ist" -
 * also weich. Die Seite wäre nach jedem Tastendruck sichtbar herumgerutscht,
 * und weil ein Kind die Tastenkombination mehrmals hintereinander drückt,
 * hätte jede neue Bewegung die vorige unterbrochen: Die Lesestelle wäre bei
 * jedem Druck ein Stück davongelaufen. Genau das, was hier verhindert werden
 * soll.
 */
export function haltStelle(stelle: Lesestelle | null): void {
  if (!stelle || !stelle.el.isConnected) return;
  const jetzt = stelle.el.getBoundingClientRect().top;
  // Der gemerkte Abstand, umgerechnet auf die Punktgröße von JETZT - siehe
  // `punktgroesse`. Bei unserer eigenen Vergrößerung ist das Verhältnis 1.
  const dpr = window.devicePixelRatio || 1;
  const soll = stelle.obenPx * (stelle.punktgroesse / dpr);
  const abstand = jetzt - soll;
  // Unter einem Punkt Unterschied ist nichts zu retten und nichts zu verlieren.
  if (Math.abs(abstand) < 1) return;
  window.scrollBy({ top: abstand, left: 0, behavior: "instant" });
}

// ---------------------------------------------------------------------------
// Beide Vergrößerungen, ein Weg
// ---------------------------------------------------------------------------

/**
 * ★★★ AUCH DIE BROWSER-VERGRÖSSERUNG MUSS DIE STELLE HALTEN (Johannes,
 * 24.08.2026 spätabends): „Kann es sein, dass die Alt + + Funktion jetzt nicht
 * beim Zoomen springt, aber die Strg + + Funktion schon?"
 *
 * Ja - und der Grund ist bauartbedingt: Unsere eigene Vergrößerung geht durch
 * unseren Code, also können wir davor merken und danach zurückrollen. Strg +
 * Plus macht der Browser allein; wir erfahren davon erst, wenn es passiert
 * IST. Vorher merken geht dann nicht mehr.
 *
 * DER AUSWEG: fortlaufend merken. Bei jedem Bildlauf und bei jedem
 * Fokuswechsel wird festgehalten, wo das Kind gerade steht - das kostet
 * nichts und ist immer aktuell. Ändert sich danach die Größe des
 * Anzeigebereichs (`resize`, und genau das tut die Browser-Vergrößerung), wird
 * dieselbe Stelle wiederhergestellt.
 *
 * ⚠️ Das gilt dann auch fürs Fenster-Ziehen - und das ist richtig so: Wer ein
 * Fenster schmäler macht, will auch nicht seine Zeile verlieren.
 *
 * ⚠️ DAS EIGENE ROLLEN DARF DEN ANKER NICHT ÜBERSCHREIBEN. Es löst selbst
 * einen Bildlauf aus; ohne die Sperre merkte sich die App danach den Stand
 * NACH dem Zurückrollen, und beim nächsten Mal wäre der Anker der falsche.
 *
 * ⚠️ Gemerkt wird höchstens einmal je Bild (`requestAnimationFrame`). Beim
 * Rollen kämen sonst Dutzende Messungen je Sekunde, und jede liest die Maße
 * von rund sechzig Elementen.
 */
export function useLesestelle(hole: () => HTMLElement | null) {
  const stelle = useRef<Lesestelle | null>(null);
  const wirRollen = useRef(false);
  const geplant = useRef(0);
  const holeRef = useRef(hole);
  holeRef.current = hole;

  const merken = useCallback(() => {
    stelle.current = merkeStelle(holeRef.current());
  }, []);

  /** Nach einer Größenänderung dieselbe Stelle wieder an denselben Platz. */
  const halten = useCallback(() => {
    wirRollen.current = true;
    haltStelle(stelle.current);
    // Erst im nächsten Takt wieder zuhören: Das eigene Rollen meldet sich als
    // Bildlauf, und der würde den Anker mit dem Stand danach überschreiben.
    window.setTimeout(() => {
      wirRollen.current = false;
      merken();
    }, 0);
  }, [merken]);

  useEffect(() => {
    const beobachten = () => {
      if (wirRollen.current || geplant.current) return;
      geplant.current = window.requestAnimationFrame(() => {
        geplant.current = 0;
        merken();
      });
    };
    merken();
    window.addEventListener("scroll", beobachten, { passive: true });
    document.addEventListener("focusin", beobachten);
    window.addEventListener("resize", halten);
    return () => {
      if (geplant.current) window.cancelAnimationFrame(geplant.current);
      window.removeEventListener("scroll", beobachten);
      document.removeEventListener("focusin", beobachten);
      window.removeEventListener("resize", halten);
    };
  }, [merken, halten]);

  return { merken, halten };
}
