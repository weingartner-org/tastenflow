/**
 * ════════════════════════════════════════════════════════════════════════════
 * DER PFEIL NEBEN DER ZAHL (01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„zB Treffsicherheit 95% und daneben einen Pfeil nach schräg nach
 * oben, gerade oder schräg nach unten. das gleiche auch bei geschw. und wenn
 * die maus darüber kommt kurze erklärung (auch für braille)."*
 *
 * Damit kommt die Veränderung zurück, die mit dem Wochenstreifen verschwunden
 * war - ohne eine einzige neue Spalte.
 *
 * ── ⚠️ WAS AUF DER BRAILLEZEILE ANKOMMT ────────────────────────────────────
 * „↗" ist dort ein Zeichen ohne Bedeutung, und manche Sprachausgaben lesen es
 * gar nicht. Der Pfeil ist darum `aria-hidden`; getragen wird die Aussage von
 * einem ausgeschriebenen Satz, der IMMER dasteht - beim Überfahren sichtbar,
 * für die Sprachausgabe über `aria-describedby` an der Zelle.
 *
 * ── ⚠️ WARUM DIE ZAHL UND DER PFEIL EINE ZELLE SIND ────────────────────────
 * Johannes ausdrücklich: *„nicht neue spalten."* Eine eigene Spalte je Wert
 * hätte die Tabelle auf elf Spalten gebracht - und wer sie mit einer
 * Sprachausgabe Zelle für Zelle durchgeht, hörte doppelt so viele
 * Spaltenüberschriften für dieselbe Auskunft.
 */
import {
  PFEIL,
  ohneVergleichSatz,
  veraenderungKurz,
  veraenderungSatz,
  veraenderungWert,
  type Groesse,
  type Veraenderung,
} from "@/lib/typing/veraenderung";
import { useBedienSprache } from "@/lib/bedienSprache";
import { Hinweiskasten, useZeigerhinweis } from "./Zeigerhinweis";

export function Veraenderungspfeil({
  wert,
  veraenderung,
  groesse,
  vergleichsName,
  darstellung = "pfeil",
  ausrichtung = "links",
  grund = null,
  grundKurz = null,
  schlank = false,
}: {
  /** Die Zahl, wie sie dasteht - „95 %" oder „180". Ein Strich, wenn es keine gibt. */
  wert: string;
  /** `null` = es gibt nichts zu vergleichen (siehe `veraenderung.ts`). */
  veraenderung: Veraenderung | null;
  groesse: Groesse;
  /** „der Woche davor", „Schuljahr 2025/26" - oder leer bei „Gesamt". */
  vergleichsName: string;
  /**
   * ★★ Wie die Veränderung dasteht (Johannes 01.09.2026): *„bei der
   * Wochenübersicht mach Tendenz … mit dem Pfeil, beim Schuljahr und Gesamt
   * mach ihn mit Werten: zB Treffsicherheit 92% +3%; Anschl./Min 154 +14."*
   *
   * ⚠️ Das ist kein Geschmack, sondern eine Frage der Auflösung: Über eine
   * Woche gegen die Vorwoche sagt „+1" wenig - da ist die Richtung die
   * Auskunft. Über ein Schuljahr ist die Zahl die Auskunft; ein Pfeil nach
   * oben verschweigt, ob aus 40 Anschlägen 45 oder 180 geworden sind.
   */
  darstellung?: "pfeil" | "wert";
  ausrichtung?: "links" | "rechts";
  /**
   * ★★ B3 (11.09.2026): WARUM hier keine Veränderung steht - „erst eine
   * Übungswoche". Nur für die lange Ansicht („Wert | Veränderung"): Dort ist
   * die leere Stelle neben der Zahl auffällig und liest sich wie ein Fehler,
   * und `ohneVergleichSatz` trifft es nicht - im Schuljahr WURDE geübt, nur
   * nicht in zwei Wochen mit genug Zeilen.
   *
   * Fehlt der Grund, bleibt alles wie bisher.
   */
  grund?: string | null;
  /** Das kurze Wort, das statt der Veränderung dasteht („erst eine Übungswoche"). */
  grundKurz?: string | null;
  /**
   * ★★ T1 (19.09.2026): die SCHLANKE Fassung der Klassentabelle in „Meine
   * Klassen" (Entwurf vom 18.09., Johannes: *„viel schlanker und schöner"*).
   * Kein Trennstrich „|" mehr; die Veränderung steht klein und gedämpft
   * gleich hinter der Zahl - bei „wert" als „↗ 3" ({@link veraenderungKurz}),
   * bei „pfeil" nur der Pfeil. Der ganze Satz bleibt unverändert im Hinweis
   * und über `aria-describedby` bei der Sprachausgabe.
   *
   * ⚠️ „klein" heisst hier gedämpft und nicht fett - kleiner als `text-sm`
   * darf es nicht werden (kleinste Schrift des Reviers 14 px,
   * `tests/tastenflow-schriftgroessen.test.ts`).
   *
   * Ohne `schlank` bleibt alles wie bisher (Punktgenau benutzt denselben
   * Baustein).
   */
  schlank?: boolean;
}) {
  // ★ EN3 (19.09.2026): Die Sätze kommen in der Bedienungssprache. ⚠️ Der
  // `vergleichsName` und der `grund` kommen vom Aufrufer (Lehrkraft-Bereich,
  // EN6) und müssen dieselbe Sprache haben - siehe `veraenderungSatz`.
  const { sprache } = useBedienSprache();
  const satz = veraenderung
    ? veraenderungSatz(veraenderung, groesse, vergleichsName, sprache)
    : (grund ?? ohneVergleichSatz(vergleichsName, sprache));
  const { id, offen, nachOben, seite, maxBreite, huelle, setZeiger, betreten } =
    useZeigerhinweis(satz, ausrichtung);

  // Ohne gemessenen Wert gibt es auch keine Veränderung - dort steht der
  // Strich allein, ohne Hinweis, der nichts zu sagen hätte.
  if (wert === "-") return <>{wert}</>;

  return (
    <span
      ref={huelle}
      className={`relative inline-flex items-baseline ${schlank ? "gap-1.5" : "gap-1"}`}
      aria-describedby={id}
      onMouseEnter={betreten}
      onMouseLeave={() => setZeiger(false)}
    >
      <span>{wert}</span>
      {/*
        ★ Der Trennstrich (Johannes 01.09.2026): *„mach einen | und dann ein
        Vorzeichen. Also zB: Treffs. 95% | +2%."* Ohne ihn lasen sich „95 %"
        und „+2 %" wie eine einzige Angabe; mit ihm sieht man auf einen Blick,
        dass es zwei Zahlen sind - der Stand und die Veränderung.
        ⚠️ `aria-hidden`: Auf der Braillezeile wäre ein senkrechter Strich ein
        Zeichen ohne Bedeutung. Dort trägt der ausgeschriebene Satz die
        Trennung ohnehin.
      */}
      {!schlank &&
        (veraenderung || (darstellung === "wert" && grundKurz)) &&
        darstellung === "wert" && (
          <span aria-hidden="true" className="text-ink-muted">
            |
          </span>
        )}
      {/*
        ★ B3: Kein Vergleich möglich, aber die Zahl steht da - dann steht statt
        der Veränderung ein Mittelpunkt. Er ist `aria-hidden` wie der Pfeil; die
        Auskunft trägt der ausgeschriebene Satz am `aria-describedby` der Zelle
        („Erst eine Übungswoche … für eine Veränderung braucht es zwei").
        Eine leere Stelle liest sich dagegen wie ein Fehler.

        ⚠️ KEIN `title` - im Lehrbereich trägt den Hinweis ausschliesslich
        `Zeigerhinweis`/`Tipp` (gemessen 10.09.2026: `[title]` = 0). Der
        Kasten dieser Zelle hängt schon am umgebenden `span`.
      */}
      {!veraenderung && darstellung === "wert" && grundKurz && (
        <span aria-hidden="true" className="text-sm text-ink-muted">
          ·
        </span>
      )}
      {veraenderung && (
        <span
          aria-hidden="true"
          /*
            ⚠️ KEINE Farbe nach Richtung. Ein roter Pfeil (oder ein rotes
            Minus) wäre ein Urteil über das Kind, und „langsamer" heisst beim
            Lernen oft „schwerer Text" ([[feedback_nie_gegen_das_kind]]).
            Unterschieden wird am Zeichen, nicht am Farbton (WCAG 1.4.1).
          */
          className={
            schlank
              ? "whitespace-nowrap text-sm font-normal tabular-nums text-ink-muted"
              : darstellung === "wert"
                ? "text-sm tabular-nums text-ink-muted"
                : "text-base leading-none text-ink-muted"
          }
        >
          {darstellung === "wert"
            ? schlank
              ? veraenderungKurz(veraenderung)
              : veraenderungWert(veraenderung, groesse, sprache)
            : PFEIL[veraenderung.richtung]}
        </span>
      )}
      <Hinweiskasten
        id={id}
        offen={offen}
        ausrichtung={seite}
        nachOben={nachOben}
        maxBreite={maxBreite}
        ohneBreiteWennZu
      >
        {satz}
      </Hinweiskasten>
    </span>
  );
}
