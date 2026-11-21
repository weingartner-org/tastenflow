/**
 * Ersatzteil im Paket „Tastenflow": Das Zeichen eines Lernprogramms. In der
 * Plattform gibt es je Programm ein eigenes Zeichen; das Paket enthält nur
 * Tastenflow. Die Programm-Liste der Klassenverwaltung (`LW_PROGRAMS`) kennt
 * ebenfalls nur Tastenflow - die übrigen Schlüssel sind hier nur eingetragen,
 * damit der Typ stimmt, und zeigen das Tastenflow-Zeichen.
 */
import { TastenflowLogo } from "@/components/TastenflowLogo";
import type { LwProgramKey } from "@/lib/lernwerkstatt/klassen";

type ZeichenBauteil = (p: {
  className?: string;
  beschreibung?: boolean | string;
}) => JSX.Element;

/** Welches Zeichen zu welchem Programm gehört - die EINE Zuordnung. */
export const PROGRAMM_ZEICHEN: Record<LwProgramKey, ZeichenBauteil> = {
  tippen: TastenflowLogo,
  braille: TastenflowLogo,
  klangpunkte: TastenflowLogo,
  computer: TastenflowLogo,
  plus: TastenflowLogo,
  lexami: TastenflowLogo,
};

export function ProgrammZeichen({
  programm,
  className = "h-5 w-5 shrink-0",
  beschreibung,
}: {
  programm: LwProgramKey;
  className?: string;
  /** Nur setzen, wo KEIN Name danebensteht. */
  beschreibung?: boolean | string;
}) {
  const Zeichen = PROGRAMM_ZEICHEN[programm];
  return <Zeichen className={className} beschreibung={beschreibung} />;
}
