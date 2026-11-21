/**
 * ★★ EIN HINWEIS, DER AUCH BEI FOKUS ERSCHEINT (30.08.2026).
 *
 * Gemessen am 30.08.2026: Der native `title` ist für die Tastatur taub. Kein
 * Browser zeigt ihn beim Hineintabben - er hängt allein am Mauszeiger. Solange
 * die Knöpfe der Kopfzeile ihr Wort danebenstehen hatten, war das verkraftbar.
 * Seit sie nur noch ihr Sinnbild tragen, ist der Hinweis die EINZIGE sichtbare
 * Beschriftung: Wer mit der Tastatur arbeitet und Sehrest hat, stünde sonst vor
 * sechs runden Knöpfen, die nichts sagen.
 *
 * Darum dieser Baustein. Er erscheint bei Mauszeiger UND bei Fokus - bewusst
 * bei `focus`, nicht nur bei `focus-visible`: Beides ist recht, aber der Fokus
 * MUSS ihn zeigen.
 *
 * ── Was er NICHT tut ───────────────────────────────────────────────────────
 * ⚠️ Er ersetzt den NAMEN des Knopfes nicht. Der Knopf behält sein `aria-label`
 * (bei „Hilfe" beginnt es mit dem sichtbaren Wort, WCAG 2.5.3); der Hinweis ist
 * eine ZWEITE Auskunft und hängt darum an `aria-describedby`, nie an
 * `aria-labelledby`. Ein Name aus zwei Quellen wäre auf der Braillezeile ein
 * doppelter Knopf.
 *
 * ⚠️ Und der Knopf trägt daneben KEIN `title` mehr. Beides zusammen liest eine
 * Sprachausgabe als Name plus zwei Beschreibungen vor.
 *
 * ── Warum der Hinweis immer im Baum steht ──────────────────────────────────
 * Er wird nicht ein- und ausgehängt, sondern nur sichtbar/unsichtbar geschaltet
 * (`invisible`, also `visibility: hidden`). Grund: `aria-describedby` zeigt
 * dann immer auf ein vorhandenes Element. Würde der Hinweis erst beim Fokus
 * entstehen, zeigte die Verweisung im Augenblick des Fokus noch ins Leere - und
 * ob die Sprachausgabe den Nachtrag eine Millisekunde später noch mitnimmt, ist
 * von Programm zu Programm verschieden. Ein `visibility: hidden`-Element, auf
 * das `aria-describedby` direkt zeigt, wird dagegen zuverlässig vorgelesen und
 * steht trotzdem in keinem Lesemodus-Fluss.
 *
 * ── Er darf nichts verschieben ─────────────────────────────────────────────
 * Bis 19.09.2026: absolut positioniert unter dem Knopf, `z-30`,
 * `pointer-events-none`, und `right-0`, nicht mittig: Ein Hinweis, der nach
 * rechts überliefe, schöbe die Seite waagrecht auf - genau das, was
 * Vergrößerung unbrauchbar macht (Befund 24.08.2026 an der Kopfzeile).
 *
 * ★★★ Seit K1 (19.09.2026) liegt er IMMER OBEN - für alle fünf Apps.
 * Johannes: *„dieses Problem gibt es ganz oft: die Einblendung von Mouseover
 * ist halb verdeckt, also nicht im Vordergrund"*. Gemessen: Kasten `z-30`
 * gegen die klebenden Tabellenköpfe `z-30`, bei Gleichstand gewinnt der
 * spätere im DOM - die Tabelle. Und „Melden" stand bei 375 px 61 px links aus
 * dem Bild. Der Kasten hängt darum per Portal unter `<body>`, `fixed` am
 * Knopf, über allem ausser einem offenen Fenster, und wird waagrecht ins
 * Fenster geklemmt. Befund, Zahlen und Stapelordnung: Kopf von
 * `typing/Zeigerhinweis.tsx`. `ausrichtung` bleibt die Vorgabe, die Seite
 * kann er nicht mehr aufschieben (ein `fixed`-Kasten trägt keine Breite bei).
 * ⚠️ Am Verhalten für Tastatur und Sprachausgabe hat sich nichts geändert:
 * Fokus, Escape, `aria-describedby`, `role="tooltip"`, immer im Baum.
 *
 * Farben nur über die Kürzel (`bg-surface-raised`, `text-ink`,
 * `border-hairline`) - es gibt sieben Kontrastmodi (`src/lib/contrast.ts`), ein
 * fester Farbwert stimmt in höchstens einem davon.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  Hinweiskasten,
  fokusIstSichtbar,
  passtUntenNicht,
  useZeigerWeg,
} from "@/components/typing/Zeigerhinweis";

/*
 * ★★★ GROSS UND SCHNELL (10.09.2026). Johannes: *„mouse over über jeden
 * schalter, aber das schnelle und große mouse over, kontrolliere das auf jeder
 * seite"*.
 *
 * Bis dahin trug dieser Hinweis Winzschrift (`text-xs`) und einen eigenen
 * Kasten - neben dem grossen der Spaltenköpfe (`Zeigerhinweis.tsx`) also eine
 * ZWEITE Gestalt für dieselbe Sache. Jetzt zeichnet er denselben Kasten und
 * klappt wie dieser nach oben, wo unten ein Rollkasten abschneidet.
 * ⚠️ Am Verhalten für die Tastatur (Fokus, Escape ohne `stopPropagation`) hat
 * sich nichts geändert - nur am Aussehen.
 */

export function Tipp({
  text,
  children,
  unterdruecken,
  ausrichtung = "rechts",
  className,
}: {
  /** Was vorher im `title` stand, samt Kürzel - z. B. „Hilfe (Alt + H)". */
  text: string;
  /**
   * Wo der Hinweis andockt (30.08.2026, seit er auch links in der Kopfzeile
   * und in der Stand-Zeile steht): „rechts" (Vorgabe) = rechtsbündig, läuft
   * nach links über - richtig für Elemente am rechten Rand. „links" =
   * linksbündig, läuft nach rechts über - für Elemente am LINKEN Rand, wo
   * ein rechtsbündiger Hinweis aus dem Fenster liefe.
   */
  ausrichtung?: "rechts" | "links";
  /**
   * Hinweis unterdrücken, obwohl Zeiger oder Fokus da sind.
   *
   * ★ Wofür (gemessen 30.08.2026 im Browser): Klappt der Knopf eine LISTE auf,
   * wandert der Fokus in diese Liste - und die steckt im selben Kasten wie der
   * Hinweis, also bleibt er offen und legt sich über den ersten Eintrag. Wer
   * die Liste sieht, braucht den Hinweis in dem Moment ohnehin nicht mehr: Sie
   * sagt mehr, als er je sagen könnte. Farbschalter und Konto reichen darum
   * ihren Aufklapp-Zustand herein.
   */
  unterdruecken?: boolean;
  /**
   * Bekommt die Id des Hinweises. Sie gehört an das `aria-describedby` des
   * Knopfes.
   *
   * ★ Warum eine Funktion und kein einfaches Kind: Der Hinweis muss sich an
   * genau EIN Element hängen, und bei der Nachrichten-Glocke ist das ein Knopf
   * TIEF INNEN in einem eigenen Baustein. Ein `cloneElement` auf das Kind
   * träfe dort die Komponente statt des Knopfes und liefe still ins Leere.
   * So sagt der Aufrufer, wohin die Verweisung gehört.
   */
  children: (beschreibungId: string) => ReactNode;
  /** Zusätzliche Klassen für die Hülle - etwa `flex-1`, wenn der Knopf die Breite füllen soll. */
  className?: string;
}) {
  const roh = useId();
  const id = `tipp-${roh.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [zeiger, setZeiger] = useState(false);
  const [fokus, setFokus] = useState(false);
  // Escape hat den Hinweis weggeschickt - er bleibt weg, bis Zeiger und Fokus
  // den Knopf einmal verlassen haben.
  const [abgewiesen, setAbgewiesen] = useState(false);
  const offen = (zeiger || fokus) && !abgewiesen && !unterdruecken;
  const [nachOben, setNachOben] = useState(false);
  // Die Vorgabe für oben/unten. Seit K1 hat das Fenster das letzte Wort
  // (`platziereHinweis` in `Zeigerhinweis.tsx`).
  const messen = () => {
    if (rahmenRef.current) setNachOben(passtUntenNicht(rahmenRef.current));
  };

  useEffect(() => {
    if (!zeiger && !fokus) setAbgewiesen(false);
  }, [zeiger, fokus]);

  /* ★★ WO STEHT DER FOKUS WIRKLICH? (gemessen 30.08.2026 im Browser)
     `focusout` ist nicht verlässlich: Wird das fokussierte Element aus dem Baum
     GENOMMEN - genau das passiert, wenn der Farbschalter oder das Konto-Menü
     zuklappt, während der Fokus in der Liste steht -, feuert kein Ereignis
     mehr. `fokus` bliebe für immer wahr, und der Hinweis stünde offen, obwohl
     der Fokus längst in der Eingabezeile ist. Beobachtet genau so, bevor diese
     Prüfung da war.
     Darum nach JEDEM Rendern nachsehen, statt einem Ereignis zu vertrauen, das
     manchmal ausbleibt. Kostet einen `contains`-Aufruf. */
  // Ein <span>, kein <div>: Der Baustein steht seit 30.08.2026 auch IM <h1>
  // (Titel-Schalter der Kopfzeile), und dort ist ein <div> kein gültiges HTML.
  // `inline-flex` verhält sich auf beiden gleich.
  const rahmenRef = useRef<HTMLSpanElement>(null);
  // Sicherheitsnetz, falls `mouseleave` ausbleibt (Kopf von `useZeigerWeg`).
  useZeigerWeg(zeiger, rahmenRef, () => setZeiger(false));
  useEffect(() => {
    if (!fokus) return;
    const rahmen = rahmenRef.current;
    if (rahmen && !rahmen.contains(document.activeElement)) setFokus(false);
  });

  /* Escape schließt den Hinweis (WCAG 1.4.13: was bei Fokus erscheint, muss
     sich wegschicken lassen).
     ⚠️ Der Horcher hängt NUR, solange der Hinweis offen ist. Sonst verschluckte
     dieser Baustein das Escape der ganzen Seite - in Tastenflow holt Escape
     immer die Eingabezeile zurück, und das darf ein Hinweis nicht kosten, der
     gerade gar nicht zu sehen ist.

     ── ★★★ Warum hier KEIN `stopPropagation()` mehr steht (31.08.2026) ───────
     Bis dahin rief dieser Horcher `e.stopPropagation()`. Sein Zweck war der
     Zusatz „ohne Fokuswechsel" aus WCAG 1.4.13: Der Druck, der den Hinweis
     wegschickt, sollte sonst nichts auslösen.

     Gemessen (Befund F15, `pruefstand/kind/befunde/f15-zweistufig-nicht-tot.md`,
     Reichweite in `befunde/tipp-reichweite.md`): Der Schutz griff viel weiter,
     als gedacht. Der Hinweis geht schon bei FOKUS auf - wer mit der Tabtaste
     arbeitet, also die ganze Zielgruppe, hat auf jedem Kopfzeilen-Knopf einen
     solchen Horcher am Hals. Der Baustein verschluckte damit den ERSTEN
     Escape-Druck der Seite: Zahnrad und Konto blieben offen, erst der zweite
     Druck schloss sie (`protokolle/f15-behebung-vorher.txt`). Ein Kind, das
     einmal drückt und nichts hört, hat keinen Anlass, ein zweites Mal zu
     drücken - es weiß nichts von einem Hinweis, den es nicht sieht. Der
     Verfasser hatte den Fall schon geahnt (Absatz oben), aber unterschätzt,
     wie DAUERND ein Tastatur-Fokus einen Hinweis offen hält.

     Der Zweck bleibt trotzdem erfüllt, nur ohne Sperre für alle anderen:
     · Escape schickt den Hinweis weiterhin weg - `setAbgewiesen(true)` steht
       unverändert da, und der Horcher hängt weiterhin in der ABFANGPHASE
       (`true`). Gerade das erhält den Zweck am zuverlässigsten: Selbst wenn
       ein anderer Baustein den Druck abfängt und anhält (`Modal.tsx`,
       `useAufklapper`), hört dieser hier ihn noch und schickt den Hinweis weg.
     · „Ohne Fokuswechsel" gilt unverändert in Punktgenau, Klangpunkte,
       »im Griff« und Mathecoach: Deren Escape-Regel tut nichts, solange nichts
       offen ist - der Fokus bleibt auf dem Knopf stehen.
     · In Tastenflow gewinnt Johannes' Hausregel vom 14.08.2026 (R6): Escape
       holt IMMER die Eingabezeile zurück. Ein Hinweis, der nur erscheint, weil
       ein Knopf gerade den Fokus hat, darf diese Regel nicht aushebeln. Der
       Hinweis verschwindet dabei genauso - nur eben als Teil des Rückwegs.
     Nachgemessen: `protokolle/f15-behebung-nachher.txt`, Läufer
     `pruefstand/kind/szenarien/f15-behebung.mjs`. */
  useEffect(() => {
    if (!offen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbgewiesen(true);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [offen]);

  return (
    <span
      ref={rahmenRef}
      className={"relative inline-flex" + (className ? ` ${className}` : "")}
      onMouseEnter={() => {
        messen();
        setZeiger(true);
      }}
      onMouseLeave={() => setZeiger(false)}
      // `onFocus`/`onBlur` steigen in React aus dem Knopf hierher auf
      // (focusin/focusout) - der Knopf selbst bleibt unangetastet.
      onFocus={(e) => {
        // ★★ 28.09.2026: nur TASTATUR-Fokus. Johannes: „mouse over muss
        // wieder verschwinden, wenn du die Maus wegfährst". Ein Mausklick
        // gibt dem Knopf ebenfalls den Fokus - bis dahin blieb der Hinweis
        // darum nach jedem Klick stehen, bis man woanders hinklickte.
        // `:focus-visible` unterscheidet genau das; Tab zeigt ihn weiter.
        if (!fokusIstSichtbar(e.target)) return;
        messen();
        setFokus(true);
      }}
      onBlur={() => setFokus(false)}
    >
      {children(id)}
      <Hinweiskasten id={id} offen={offen} ausrichtung={ausrichtung} nachOben={nachOben}>
        {text}
      </Hinweiskasten>
    </span>
  );
}
