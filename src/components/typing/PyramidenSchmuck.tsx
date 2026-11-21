/**
 * Die gemauerte PYRAMIDE über der Tippzeile - von Johannes am 01.09.2026
 * abgenommen: *„die pyramide ist schick, wenn du das so bauen kannst super."*
 *
 * ```
 *               [K]                fertige Stufen: klein, gedämpft,
 *             [K][a]               aria-hidden - reiner Schmuck
 *           [K][a][s]
 *        [ K ][ a ][ s ][ s ]      aktive Stufe: die gewohnte Tippzeile,
 *         ⌐ ⌐ ⌐ ⌐ ⌐ (leer) ⌐      nur größer gesetzt
 * ```
 *
 * ★★★ Die Regel, die für ALLE Übungsformen gilt: **Die Grafik darf nie die
 * Aufgabe tragen.** Sie ist eine kostenlose Dreingabe für Sehende, solange die
 * Aufgabe streng Zeile für Zeile lösbar bleibt. Deshalb:
 *
 * - Die **aktive** Stufe steht NICHT hier, sondern ist die ganz normale
 *   Tippzeile darunter. An der Eingabe ändert sich nichts.
 * - Die **fertigen** Stufen sind `aria-hidden` - sie waren schon dran, ihre
 *   Wiederholung wäre für eine Sprachausgabe nur Lärm.
 * - Die **kommende** Stufe steht als leerer Umriss da: Form ja, Buchstaben
 *   nein. ⇒ Niemand hat die Übersicht voraus, auch das sehende Kind nicht.
 *
 * Das Einzige, was die Sprachausgabe hier bekommt, ist der Stand („Stufe 4 von
 * 5") - dieselbe Auskunft, die ein sehendes Kind aus der Form abliest.
 *
 * „Steine" ist Testerin Wort für die Bausteine einer Stufe.
 */
import type { Lang } from "@/lib/typing";
import { texte } from "@/lib/bedienSprache";
import { laufweiteAttrs, type ZeichenabstandFaktor } from "@/lib/typing/zeichenabstand";
import { useWortspielSprache } from "./wortspielSprache";

/**
 * Die eine Zeile, die die Sprachausgabe hier bekommt - in beiden
 * Bedienungssprachen (EN4, 18.09.2026), Deutsch wortgleich wie vorher.
 * „Stufe" ist hier die Stufe der PYRAMIDE, nicht die Übungsstufe (Glossar:
 * *step*, nicht *level*).
 */
const PYRAMIDEN_TEXTE = texte({
  de: { stand: (stufe: number, von: number) => `Pyramide: Stufe ${stufe} von ${von}` },
  en: { stand: (stufe: number, von: number) => `Pyramid: step ${stufe} of ${von}` },
  fr: { stand: (stufe: number, von: number) => `Pyramide : étape ${stufe} sur ${von}` },
  es: { stand: (stufe: number, von: number) => `Pirámide: escalón ${stufe} de ${von}` },
  it: { stand: (stufe: number, von: number) => `Piramide: gradino ${stufe} di ${von}` },
  // ★ O-PL (02.10.2026): „stopień 2 z 5" (Zählweise „z", Glossar §2.2).
  pl: { stand: (stufe: number, von: number) => `Piramida: stopień ${stufe} z ${von}` },
  // ★ O-TR (02.10.2026): "basamak 2, toplam 5" (Glossar Regel 6, nie "2 / 5").
  tr: { stand: (stufe: number, von: number) => `Piramit: basamak ${stufe}, toplam ${von}` },
  // ★ O-CS (03.10.2026): „patro 2/5" (Schrägstrich, Glossar Regel 13; „stupeň" ist die Schulstufe).
  cs: { stand: (stufe: number, von: number) => `Pyramida: patro ${stufe}/${von}` },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: { stand: (stufe: number, von: number) => `Пирамида: етаж ${stufe}/${von}` },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: { stand: (stufe: number, von: number) => `Πυραμίδα: όροφος ${stufe} από ${von}` },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: { stand: (stufe: number, von: number) => `Piramis: emelet ${stufe}/${von}` },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: { stand: (stufe: number, von: number) => `Piramide: laag ${stufe} van ${von}` },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: { stand: (stufe: number, von: number) => `Pirâmide: andar ${stufe} de ${von}` },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: { stand: (stufe: number, von: number) => `Pirâmide: andar ${stufe} de ${von}` },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: { stand: (stufe: number, von: number) => `Piramida: treapta ${stufe}/${von}` },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: { stand: (stufe: number, von: number) => `Pyramid: våning ${stufe}/${von}` },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: { stand: (stufe: number, von: number) => `Піраміда: щабель ${stufe}/${von}` },
});

/** Welche Pyramide und welche Stufe gehört zu dieser Zeilennummer? */
export function stufeFuerZeile(
  pyramiden: readonly (readonly string[])[],
  zeile: number,
): { pyramide: number; stufe: number } | null {
  if (zeile < 0) return null;
  let rest = zeile;
  for (let p = 0; p < pyramiden.length; p++) {
    if (rest < pyramiden[p].length) return { pyramide: p, stufe: rest };
    rest -= pyramiden[p].length;
  }
  return null;
}

function Steine({
  text,
  leer,
  zeichenabstand = 1,
}: {
  text: string;
  leer?: boolean;
  zeichenabstand?: ZeichenabstandFaktor;
}) {
  // ★ CVI (19.09.2026, „überall"): dieselbe Laufweite wie die Tippzeile
  // darunter - die Steine sind Flex-Elemente wie deren Zeichen.
  const laufweite = laufweiteAttrs(zeichenabstand);
  return (
    <div
      className={"flex justify-center " + (laufweite.className || "gap-0.5")}
      style={laufweite.style}
    >
      {[...text].map((ch, i) => (
        <span
          key={i}
          className={
            leer
              ? "inline-block h-6 w-5 rounded border border-dashed border-ink-muted"
              : "inline-block h-6 w-5 rounded bg-surface-raised text-center text-base leading-6 text-ink"
          }
        >
          {leer ? "" : ch === " " ? "" : ch}
        </span>
      ))}
    </div>
  );
}

export function PyramidenSchmuck({
  pyramiden,
  zeile,
  lang = "de",
  zeichenabstand = 1,
}: {
  pyramiden: readonly (readonly string[])[];
  /** Die laufende Zeilennummer der Runde (0-basiert). */
  zeile: number;
  /** Die Übungssprache - ohne aktiven Sprachbereich wählt sie, wie vor EN4, auch die Sprache der Zeile. */
  lang?: Lang;
  /** „Zeichenabstand groß (CVI)" - derselbe Wert wie die Tippzeile (19.09.2026). */
  zeichenabstand?: ZeichenabstandFaktor;
}) {
  const { ui } = useWortspielSprache(lang);
  const stand = stufeFuerZeile(pyramiden, zeile);
  if (!stand) return null;
  const stufen = pyramiden[stand.pyramide];
  const fertig = stufen.slice(0, stand.stufe);
  const kommend = stand.stufe + 1 < stufen.length ? stufen[stand.stufe + 1] : null;

  return (
    <div className="mb-2">
      <p className="text-center text-base text-ink">
        {/* ★ Abnahme 02.09.2026 im Browser: Hier stand nur „Stufe 4 von 5" -
            und 60 Pixel darunter steht in der Stand-Zeile „Übungsstufe 2".
            Zwei Stufen nebeneinander, die nichts miteinander zu tun haben.
            Für ein Kind mit Blindheit ist der Unterschied im Ohr noch
            kleiner, also nennt die Zeile jetzt, WOVON sie die Stufe ist. */}
        {PYRAMIDEN_TEXTE[ui].stand(stand.stufe + 1, stufen.length)}
      </p>
      <div aria-hidden="true" className="mt-1 space-y-0.5">
        {fertig.map((s, i) => (
          <Steine key={i} text={s} zeichenabstand={zeichenabstand} />
        ))}
        {/* Die aktive Stufe fehlt hier mit Absicht - sie IST die Tippzeile. */}
        {kommend ? <Steine text={kommend} leer zeichenabstand={zeichenabstand} /> : null}
      </div>
    </div>
  );
}
