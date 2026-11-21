/**
 * ARBEITSBLATT - der Wächter gegen den Sprung an den Dokumentenanfang.
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
 * ★★★ ANLASS (Johannes, 25.08.2026):
 *
 * > „Die Schüler haben bei den alten HTML-Arbeitsblättern immer wieder
 * > geklagt, dass sie beim Navigieren mit Pfeil- oder Tabtasten plötzlich am
 * > Dokumentenanfang standen. Das war unheimlich nervig, weil es total viel
 * > Zeit kostet, seine Aufgabe in einem längeren Dokument wieder zu finden.
 * > Kannst du ausschließen, dass es solche falschen Sprungmarken in den
 * > Arbeitsblättern gibt? Kannst du einen Wächter dafür bauen?"
 *
 * ⚠️ AUSSCHLIESSEN KANN MAN ES NICHT DURCH HINSEHEN. Der Fokus fällt nicht
 * wegen einer „falschen Sprungmarke" an den Anfang - er fällt, weil er sein
 * Element VERLIERT und der Browser dann keinen besseren Platz kennt als
 * `<body>`. Und `<body>` ist für eine Sprachausgabe der Dokumentenanfang.
 *
 * DIE VIER WEGE, AUF DENEN EIN ELEMENT SEINEN FOKUS VERLIERT:
 *
 *  1. Es wird **ausgeschaltet** (`disabled`). Der Browser nimmt den Fokus
 *     sofort weg. ⚠️ Genau das ist am 25.08.2026 in dieser App gefunden
 *     worden: Kontrollkästchen und Auswahllisten wurden beim Abgeben
 *     `disabled` - wer dabei in der letzten Aufgabe stand, landete ganz oben.
 *     Geheilt mit `aria-disabled` (siehe `Antwortfeld.tsx`).
 *  2. Es wird **aus dem Baum genommen** - ein Aufklapper schließt sich, eine
 *     Bedingung kippt, ein Dialog geht zu, ohne den Fokus zurückzugeben.
 *  3. Es wird **versteckt** (`display: none`, `hidden`, `inert`).
 *  4. Es wird **neu gebaut** statt geändert - in React genügt ein anderer
 *     `key`, und aus demselben Feld wird ein neues ohne Fokus.
 *
 * WAS DIESER WÄCHTER TUT - zwei Dinge, und beide sind nötig:
 *
 *  • **Er holt den Fokus zurück.** Landet er auf `<body>`, obwohl er eben noch
 *    im Blatt war, setzt der Wächter ihn dorthin zurück - oder, wenn es das
 *    Element nicht mehr gibt, auf das nächstgelegene im selben Beispiel. Ein
 *    Kind merkt davon nichts, außer dass es nicht mehr passiert.
 *  • **Er meldet es.** Zurückholen heilt das Sichtbare, nicht die Ursache.
 *    Jeder Vorfall wird gezählt und beschrieben; auf der Muster-Seite steht er
 *    dann rot da, solange gebaut wird. Ein Wächter, der still repariert,
 *    verbirgt genau die Fehler, die er finden soll.
 *
 * ⚠️ ER GREIFT NUR EIN, WENN DER FOKUS IM NICHTS IST. Ein Kind, das absichtlich
 * in die Kopfzeile oder aus dem Fenster geht, wird nicht zurückgezerrt - das
 * wäre schlimmer als das Problem. Geprüft wird ausdrücklich auf `<body>` und
 * `<html>`, also auf „nirgends".
 *
 * ⚠️ UND NICHT, SOLANGE EIN DIALOG OFFEN IST. Der hat seinen eigenen
 * Fokus-Käfig; ihn zu übersteuern wäre der zweite Fehler
 * ([[feedback_nvda_focus_pattern]], Dialog-Guard).
 */

export interface Fokusvorfall {
  /** Wie das Element hieß, das den Fokus verloren hat. */
  woher: string;
  /** Wohin der Wächter ihn gesetzt hat - oder was er nicht mehr fand. */
  wohin: string;
  /** Warum er weg war, soweit erkennbar. */
  grund: string;
}

/** Ein Element so benennen, dass die Meldung brauchbar ist. */
function benenne(el: Element | null): string {
  if (!el) return "(nichts)";
  const feld = el.getAttribute?.("data-feld");
  const aufgabe = el.closest?.("[data-aufgabe]")?.getAttribute("data-aufgabe");
  const teile = [el.tagName.toLowerCase()];
  if (aufgabe) teile.push(aufgabe);
  if (feld) teile.push(feld + ")");
  const name = el.getAttribute?.("aria-label");
  if (name) teile.push(`„${name}"`);
  return teile.join(" ");
}

/**
 * Warum hat das Element den Fokus verloren? Die Antwort steht in der Meldung
 * und spart beim Suchen die halbe Arbeit.
 */
function grundVon(el: HTMLElement): string {
  if (!el.isConnected) return "das Element wurde aus der Seite genommen";
  if (el.hasAttribute("disabled")) return "das Element wurde ausgeschaltet (disabled)";
  if (el.hasAttribute("hidden")) return "das Element wurde versteckt (hidden)";
  if (el.closest("[inert]")) return "das Element liegt in einem inerten Bereich";
  if (el.offsetParent === null && getComputedStyle(el).position !== "fixed") {
    return "das Element wird nicht mehr angezeigt (display: none)";
  }
  return "unbekannt - das Element ist noch da und bedienbar";
}

/** Steht der Fokus gerade nirgends? */
function imNichts(): boolean {
  const a = document.activeElement;
  return !a || a === document.body || a === document.documentElement;
}

/**
 * Das nächstbeste Ziel, wenn es das alte Element nicht mehr gibt.
 *
 * ⚠️ In DERSELBEN Aufgabe bleiben. Ein Kind, das in Beispiel 7 stand, will
 * nicht in Beispiel 1 aufwachen - das ist genau die Klage, um die es geht.
 * Nur wenn auch die Aufgabe verschwunden ist, zählt das erste Feld des Blattes.
 */
function ersatzziel(wurzel: HTMLElement, letzteAufgabe: string | null): HTMLElement | null {
  // ⚠️ `:not([disabled])` MUSS hier stehen. Sonst kann das Ersatzziel genau
  // das Element sein, das gerade ausgeschaltet wurde - der Wächter setzt den
  // Fokus dorthin, der Browser lehnt ab, und der Fokus bleibt im Nichts. Beim
  // Nachbauen am 25.08.2026 ist er genau darauf hereingefallen: gerettet, und
  // trotzdem am Dokumentenanfang.
  //
  // ★★★★ UND DAS ANTWORT-ELEMENT IST NICHT IMMER EIN `input` (gefunden am
  // 25.08.2026 abends, beim Nachziehen von Punktgenau). Dort wird die Antwort
  // in eine Fläche mit `role="application"` getippt - sechs Punkttasten
  // gleichzeitig, das kann kein Textfeld -, und in Klangpunkte genauso. Ein
  // `div` mit `tabindex` steht in KEINER der obigen Klammern: Der Wächter
  // meldete den Vorfall und fand kein Ziel („wohin: (nichts)"), das Kind blieb
  // am Dokumentenanfang. Gemessen am laufenden Programm.
  //
  // ★★★ DAS KENNZEICHEN AUS §13 IST DIE ANTWORT DARAUF. `data-feld` steht an
  // JEDEM Antwort-Element - gleich, aus welchem HTML es gebaut ist. Es wird
  // darum ZUERST gesucht: Es ist die Stelle, an der ein Kind gearbeitet hat,
  // und damit ein besseres Ziel als der erste Knopf der Aufgabe.
  const antwortfeld = "[data-feld]:not([disabled])";
  const bedienbar = ":is(input, textarea, select, button):not([disabled])";
  const suche = (bereich: string): HTMLElement | null =>
    wurzel.querySelector<HTMLElement>(`${bereich} ${antwortfeld}`) ??
    wurzel.querySelector<HTMLElement>(`${bereich} ${bedienbar}`);

  if (letzteAufgabe) {
    const karte = wurzel.querySelector<HTMLElement>(
      `[data-aufgabe="${CSS.escape(letzteAufgabe)}"]`,
    );
    const inAufgabe = suche(`[data-aufgabe="${CSS.escape(letzteAufgabe)}"]`);
    if (inAufgabe) return inAufgabe;
    // ★★★ DER LETZTE HALT IN DERSELBEN AUFGABE, und er ist mehr wert, als er
    // aussieht: Ist das letzte Feld der Aufgabe verschwunden, ist die ANGABE
    // immer noch die richtige Stelle - dort steht, worum es geht, und ein Kind
    // liest von da aus weiter. Der Sprung an den Dokumentenanfang wäre die
    // Alternative, und genau der ist die alte Klage.
    const halt = karte?.querySelector<HTMLElement>("[data-angabe]") ?? karte;
    if (halt) return anspringbar(halt);
  }
  return suche("[data-aufgabe]");
}

/**
 * Ein Stück Text, das keinen Fokus tragen kann, anspringbar machen.
 *
 * ⚠️ `focus()` auf ein Element ohne `tabindex` tut GAR NICHTS - stillschweigend.
 * Die Braillezeile bliebe im Nichts stehen, und der Wächter hätte gemeldet, er
 * habe gerettet. Ein `tabindex="-1"` macht es anspringbar, ohne es zu einem
 * Tab-Halt zu machen: Wer mit der Tabtaste durchgeht, merkt nichts davon.
 *
 * ★ Es bleibt stehen, und das ist Absicht - es kostet nichts, und beim nächsten
 * Mal ist der Weg schon gebahnt.
 */
function anspringbar(el: HTMLElement): HTMLElement {
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  return el;
}

/**
 * Den Wächter an ein Blatt hängen. Gibt die Abmelde-Funktion zurück.
 *
 * `melde` bekommt jeden Vorfall - auf der Muster-Seite landet er in einem roten
 * Kasten, in der echten App später in der Fehlerliste.
 */
export function fokuswacheStarten(
  wurzel: HTMLElement,
  melde: (v: Fokusvorfall) => void,
): () => void {
  /** Wo der Fokus zuletzt IM BLATT stand - der Anker für die Rettung. */
  let letztes: HTMLElement | null = null;
  /** In welcher Aufgabe das war - das Ersatzziel bleibt dort. */
  let letzteAufgabe: string | null = null;
  let geplant = false;
  /**
   * ★★★★★ WANN ZULETZT DIE MAUS GEDRÜCKT WURDE (Johannes, 07.11.2026, Jano klickt mit der Maus:
   * „man kann gar nicht klicken, man springt irgendwo hin"). Ein Klick auf eine freie Stelle -
   * Kartenrand, Angabetext, Lücke neben dem Feld - nimmt dem Feld den Fokus, und er landet auf
   * `<body>`. Das ist kein verlorener Fokus, sondern ein Kind, das woanders hingeklickt hat. Bis
   * heute hat der Wächter ihn ins alte Feld zurückgeholt, und der Browser rollte dorthin - beim
   * letzten Feld ans Seitenende (gemessen 01.10. und 07.11.: 500 ⇒ 7620).
   */
  let mausZeit = 0;
  const beiMaus = () => {
    mausZeit = Date.now();
  };

  /**
   * Sich merken, wo der Fokus GERADE steht.
   *
   * ★★★ ER WIRD ABGELESEN, NICHT NUR ABGEWARTET (25.08.2026, beim Nachbauen am
   * laufenden Blatt): Ein Wächter, der allein auf `focusin` hört, weiß nichts,
   * wenn dieses Ereignis ausbleibt - und es bleibt aus, sobald die Ansicht des
   * Browsers nicht vorne ist ([[reference_screenreader_nicht_abfragbar]],
   * dieselbe Ecke). Dann steht `letztes` auf nichts, und der Wächter schweigt
   * genau dann, wenn er reden sollte.
   *
   * `document.activeElement` dagegen stimmt immer. Es wird darum bei jeder
   * Änderung im Blatt mitgelesen - das kostet eine einzige Abfrage.
   */
  const merkeAktuellen = () => {
    const a = document.activeElement as HTMLElement | null;
    if (!a || a === document.body || a === document.documentElement) return;
    if (!wurzel.contains(a)) {
      // Absichtlich hinausgegangen - ab hier ist der Fokus nicht mehr unsere
      // Sache, bis er wiederkommt.
      letztes = null;
      return;
    }
    letztes = a;
    letzteAufgabe = a.closest("[data-aufgabe]")?.getAttribute("data-aufgabe") ?? null;
  };

  const beiFokus = () => merkeAktuellen();

  /**
   * Nachsehen, ob der Fokus im Nichts steht - und ihn zurückholen.
   *
   * ⚠️ IMMER ERST IM NÄCHSTEN TAKT. In dem Augenblick, in dem ein Element den
   * Fokus abgibt, steht er kurz nirgends - auch bei einem ganz gewöhnlichen
   * Wechsel. Wer sofort nachsieht, „rettet" bei jedem Tab-Druck.
   */
  const pruefe = () => {
    if (geplant) return;
    geplant = true;
    window.setTimeout(() => {
      geplant = false;
      const weg = letztes;
      if (!weg) return;
      if (!imNichts()) return;
      // Ein Dialog hat seinen eigenen Fokus-Käfig - ihn zu übersteuern wäre
      // der zweite Fehler ([[feedback_nvda_focus_pattern]], Dialog-Guard).
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;

      const grund = grundVon(weg);
      const brauchbar = weg.isConnected && !weg.hasAttribute("disabled");
      // Weggeklickt: das Feld ist noch da und bedienbar, und eben wurde die Maus gedrückt.
      // Dann hat das Kind das so gewollt - nicht zurückholen, nicht melden.
      if (brauchbar && Date.now() - mausZeit < 1500) {
        letztes = null;
        letzteAufgabe = null;
        return;
      }
      const ziel = brauchbar ? weg : ersatzziel(wurzel, letzteAufgabe);
      melde({ woher: benenne(weg), wohin: benenne(ziel), grund });
      if (ziel) {
        ziel.focus();
        letztes = ziel;
      }
    }, 0);
  };

  const beiVerlust = (e: FocusEvent) => {
    // ⚠️ `relatedTarget` sagt, wohin der Fokus GEHT. Ist es ein echtes
    // Element, war es ein gewöhnlicher Wechsel und geht uns nichts an.
    if (e.relatedTarget) return;
    pruefe();
  };

  /**
   * ★★★ DER ZWEITE FÜHLER - und er ist der wichtigere.
   *
   * `focusout` feuert NICHT verlässlich, wenn ein Element einfach aus der
   * Seite verschwindet. Genau das ist aber der häufigste Weg, auf dem ein Kind
   * am Dokumentenanfang landet: Das Feld, in dem es stand, wird beim
   * Neuzeichnen ersetzt oder entfernt, und der Browser lässt den Fokus
   * kommentarlos fallen. Ein Wächter, der nur auf `focusout` hört, sieht davon
   * nichts - beim Nachbauen am 25.08.2026 fiel er zweimal darauf herein.
   *
   * ⚠️ Der Beobachter läuft bei JEDEM Tastendruck mit (React zeichnet neu).
   * Deshalb tut er nichts als eine einzige Abfrage - erst wenn der Fokus
   * WIRKLICH nirgends steht, beginnt die eigentliche Arbeit.
   */
  const beobachter = new MutationObserver(() => {
    // ⚠️ ERST ABLESEN, DANN PRÜFEN. Die Änderung, die den Fokus gleich kostet,
    // meldet sich hier - und in diesem Augenblick steht er meist noch auf dem
    // Element. Genau das ist die Gelegenheit, es festzuhalten.
    merkeAktuellen();
    if (!letztes) return;
    // ⚠️ HIER NICHT SCHON NACHSEHEN, ob der Fokus weg ist. Der Beobachter
    // meldet sich, sobald sich der Baum ändert - und in diesem Augenblick
    // steht der Fokus oft noch auf dem alten Element; erst danach nimmt der
    // Browser ihn weg. Eine Abfrage an dieser Stelle war deshalb immer „alles
    // in Ordnung", und der Wächter schwieg genau dann, wenn er hätte reden
    // sollen (gemessen am laufenden Blatt, 25.08.2026). `pruefe()` sieht
    // ohnehin erst im nächsten Takt nach - und tut bis dahin nichts.
    pruefe();
  });

  wurzel.addEventListener("focusin", beiFokus);
  wurzel.addEventListener("focusout", beiVerlust);
  document.addEventListener("focusin", beiFokus);
  document.addEventListener("pointerdown", beiMaus, true);
  document.addEventListener("mousedown", beiMaus, true);
  beobachter.observe(wurzel, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["disabled", "hidden", "inert"],
  });

  return () => {
    beobachter.disconnect();
    wurzel.removeEventListener("focusin", beiFokus);
    wurzel.removeEventListener("focusout", beiVerlust);
    document.removeEventListener("focusin", beiFokus);
    document.removeEventListener("pointerdown", beiMaus, true);
    document.removeEventListener("mousedown", beiMaus, true);
  };
}
