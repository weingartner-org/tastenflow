/**
 * Die Zeilen zu Brailletabelle und JAWS-Rückweg in den Hilfen (31.10.2026).
 * Die Texte stehen an einer Stelle: `lib/typing/screenreaderHinweise.ts`.
 */
import type { Lernweg } from "@/lib/typing/lernweg";
import { brailleTabellenSatz, SCREENREADER_HINWEISE } from "@/lib/typing/screenreaderHinweise";
import { wahlText } from "@/lib/typing/wahltaste";

/** Für die Liste der Lehrkraft-Hilfe. */
export function BrailleTabellenPunkte({ weg }: { weg: Lernweg }) {
  return (
    <>
      <li>{brailleTabellenSatz(weg)}</li>
      <li>{wahlText(SCREENREADER_HINWEISE[weg].jawsRueckweg, weg)}</li>
    </>
  );
}

/** Für die Kinder-Hilfe, unter dem Satz zu Alt + E. */
export function JawsRueckweg({ weg }: { weg: Lernweg }) {
  return <p className="m-0">{wahlText(SCREENREADER_HINWEISE[weg].jawsRueckweg, weg)}</p>;
}
