/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ZAHLWORT IN PORTUGIESISCH (PORTUGAL) - Einhängepunkt.
 *
 * ★ O-INHALT-PT (29.10.2026): geschrieben nach Glossar `GLOSSAR-pt.md` §2.10 („dezasseis · dezassete · dezanove · catorze · mil ·
 * um milhão"). 0 bis 1.000.000, männliche Zählform („um", „dois", „duzentos"), so wie ein Kind es schreiben lernt:
 * - „e" zwischen Hunderter, Zehner und Einer („cento e vinte e três"); 100 allein ist „cem", sonst „cento".
 * - „mil" ohne „um" („mil", „mil e um", „dois mil"); nach „mil" steht „e" nur vor einem Rest unter 100 oder einem runden Hunderter
 *   („mil e duzentos", aber „mil duzentos e trinta e quatro").
 * - 1.000.000 ist „um milhão".
 * Verteiler: `uebungsformen/zahlendiktat.ts` (`ZAHLWORT_GERUEST`). `zahlwort(n, "pt")` wirft weiter absichtlich.
 * Wächter: `tests/tastenflow-zahlwort-pt-br-sv.test.ts`.
 * ⚠️ Gegen das Sprachwissen des Baus gelesen, nicht von einer Person mit europäischem Portugiesisch als Erstsprache.
 */
import { zahlwortPortugiesisch } from "./zahlwortPortugiesischKern";

/** Ein Zahlwort je Zahl (0 bis 1.000.000) in Portugiesisch (Portugal). */
export const ZAHLWORT_PT: ((n: number) => string) | null = (n) => zahlwortPortugiesisch(n, "pt");
