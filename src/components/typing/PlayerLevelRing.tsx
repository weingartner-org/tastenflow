/**
 * Spielstufe als RING: eine große Zahl (die Stufe) in der Mitte, drum herum ein
 * Ring, der sich mit den gesammelten Punkten füllt und bei 100 Punkten voll ist
 * — dann steigt die Stufe um eins (Wunsch von Johannes statt der reinen
 * Text-Anzeige „Spielstufe 1 · 59 XP"). Rein dekorativ-motivierend; macht das
 * Üben nicht schwerer. Nutzt den gemeinsamen [[RingGauge]], damit die
 * Wochenziel-Ringe ([[WeeklyGoalRings]]) GENAU gleich aussehen.
 * Siehe [[project_zehnfinger_trainer]].
 */
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { RingGauge } from "./RingGauge";
import { Hinweisflaeche } from "./Zeigerhinweis";
import { zZe } from "../../lib/bedienSprache/predlozkyCs";

/**
 * Der Name des Rings in beiden Bedienungssprachen (EN3, 19.09.2026).
 * Beschriftung und Einheit reicht der Aufrufer herein (Glossar §3.6: *Game
 * level* / *Level* ★, *XP* / *points*). ⚠️ Der Ring hängt auch in »Im Griff«
 * (`FortschrittSpirale`) - dort gibt es keinen aktiven Sprach-Anbieter, also
 * bleibt er deutsch.
 */
const RING_NAME: Record<
  BedienSprache,
  (label: string, level: number, into: number, need: number, xpUnit: string) => string
> = {
  de: (label, level, into, need, xpUnit) =>
    `${label} ${level}. ${into} von ${need} ${xpUnit} bis zur nächsten Stufe.`,
  en: (label, level, into, need, xpUnit) =>
    `${label} ${level}. ${into} of ${need} ${xpUnit} to the next level.`,
  // ★ E11a-5 (26.09.2026): „fr" nur in Tastenflow - »Im Griff« hat keinen
  // aktiven Sprach-Anbieter und bleibt deutsch.
  fr: (label, level, into, need, xpUnit) =>
    `${label} ${level}. ${into} ${xpUnit} sur ${need} avant le niveau suivant.`,
  // ★ ES-O (27.09.2026): spanisch.
  es: (label, level, into, need, xpUnit) =>
    `${label} ${level}. ${into} de ${need} ${xpUnit} hasta el siguiente nivel.`,
  // ★ O-IT (02.10.2026): italienisch.
  it: (label, level, into, need, xpUnit) =>
    `${label} ${level}. ${into} di ${need} ${xpUnit} fino al livello successivo.`,
  // ★ O-PL (02.10.2026): Komma statt Punkt hinter der Stufe („3." läse eine
  // polnische Stimme als Ordnungszahl); die Einheit steht nach „z" im Genitiv
  // (der Aufrufer reicht „XP" oder „punktów" herein).
  pl: (label, level, into, need, xpUnit) =>
    `${label} ${level}, ${into} z ${need} ${xpUnit} do następnego poziomu.`,
  // ★ O-TR (02.10.2026): Glossar Regel 6 - nie "40 / 100" (Schrägstrich, die
  // Stimme liest "bölü"), nie eine Endung an Zahl oder "XP": der REST bis zur
  // nächsten Stufe, die Endung an "seviye". Komma hinter der Stufe - "3." ist im
  // Türkischen die Ordnungszahl ("üçüncü").
  tr: (label, level, into, need, xpUnit) =>
    `${label} ${level}, sonraki seviyeye ${Math.max(0, need - into)} ${xpUnit} kaldı.`,
  // ★ O-CS (03.10.2026): „Úroveň hry 3, 40 ze 100 XP do další úrovně." - Komma
  // hinter der Stufe („3." wäre die Ordnungszahl), „z/ze" nach dem Zahlwort
  // (zZe, Glossar Regel 13); die Einheit steht nach der Zahl im Genitiv
  // Mehrzahl (der Aufrufer reicht „XP" oder „bodů" herein); am Ende das
  // Hauptwort, nie die Zahl.
  cs: (label, level, into, need, xpUnit) =>
    `${label} ${level}, ${into} ${zZe(need)} ${need} ${xpUnit} do další úrovně.`,
  // ★ O2-COMP (30.10.2026): bg eigene Fassung.
  bg: (label, level, into, need, xpUnit) =>
      `${label} ${level}, ${into} от ${need} ${xpUnit} до следващото ниво.`,
  // ★ O2-COMP (30.10.2026): el eigene Fassung.
  el: (label, level, into, need, xpUnit) =>
      `${label} ${level}, ${into} από ${need} ${xpUnit} για το επόμενο επίπεδο.`,
  // ★ O2-COMP (30.10.2026): hu eigene Fassung.
  hu: (label, level, into, need, xpUnit) =>
      `${label}: ${level}, ${xpUnit}: ${into}/${need} a következő szintig.`,
  // ★ O2-COMP (30.10.2026): nl eigene Fassung.
  nl: (label, level, into, need, xpUnit) =>
      `${label} ${level}, ${into} van ${need} ${xpUnit} tot het volgende level.`,
  // ★ O2-COMP (30.10.2026): pt eigene Fassung.
  pt: (label, level, into, need, xpUnit) =>
      `${label} ${level}, ${into} de ${need} ${xpUnit} até ao próximo nível.`,
  // ★ O2-COMP (30.10.2026): br eigene Fassung.
  br: (label, level, into, need, xpUnit) =>
      `${label} ${level}, ${into} de ${need} ${xpUnit} até o próximo nível.`,
  // ★ O2-COMP (30.10.2026): ro eigene Fassung.
  ro: (label, level, into, need, xpUnit) =>
      `${label} ${level}, ${into} din ${need} ${xpUnit} până la nivelul următor.`,
  // ★ O2-COMP (30.10.2026): sv eigene Fassung.
  sv: (label, level, into, need, xpUnit) =>
      `${label} ${level}, ${into} av ${need} ${xpUnit} till nästa nivå.`,
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: (label, level, into, need, xpUnit) =>
      `${label} ${level}, ${into}/${need} ${xpUnit} до наступного рівня.`,
};

export interface PlayerLevelRingProps {
  /** Aktuelle Spielstufe (Zahl in der Mitte). */
  level: number;
  /** Schon gesammelte Punkte in der laufenden Stufe (0..need). */
  into: number;
  /** Punkte bis zur nächsten Stufe (i. d. R. 100). */
  need: number;
  /** Beschriftung: „Spielstufe" (Kind) bzw. „Niveau" (Erwachsene). */
  label: string;
  /** Einheit der Punkte: „XP" bzw. „Punkte". */
  xpUnit: string;
  /** Durchmesser in px. */
  size?: number;
  /** Beschriftung neben dem Ring ausblenden (für sehr enge Leisten). */
  hideCaption?: boolean;
}

export function PlayerLevelRing({
  level,
  into,
  need,
  label,
  xpUnit,
  size = 56,
  hideCaption = false,
}: PlayerLevelRingProps) {
  const { sprache } = useBedienSprache();
  const frac = need > 0 ? into / need : 0;
  const aria = RING_NAME[sprache](label, level, into, need, xpUnit);

  return (
    // ★ Statt `title` (N15b, 19.09.2026): Der Ring ist kein Tabstopp - dieselbe
    // Bauart wie die anderen nicht-interaktiven Anzeigen der Seite
    // (`Hinweisflaeche`, siehe z. B. `PupilStatsPanel.tsx`). Der Hinweistext ist
    // wortgleich mit `aria-label` und darum selbst `aria-hidden` - eine
    // Sprachausgabe bekommt die Auskunft schon über den Namen dieses Bereichs,
    // nur Augen und Maus brauchen den grossen, schnellen Kasten.
    <Hinweisflaeche
      className="flex shrink-0 items-center gap-2"
      role="img"
      aria-label={aria}
      hilfe={aria}
    >
      <RingGauge size={size} frac={frac}>
        {level}
      </RingGauge>
      {!hideCaption && (
        <p
          className="m-0 text-sm font-semibold leading-tight text-ink"
          aria-hidden="true"
        >
          {label}
        </p>
      )}
    </Hinweisflaeche>
  );
}
