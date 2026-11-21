import type { ReactNode } from "react";

/*
 * Ersatzteil im Paket „Tastenflow": Die Spendenbitte der Originalplattform
 * führt zu deren Spendenkonto. Wer das Paket selbst betreibt, hat ein eigenes
 * Konto - die Bitte gehört dann hierher. Standard: keine.
 */
export function SpendenBanner(_props: {
  app: string;
  zielgruppe: unknown;
  kontoId: string | null | undefined;
  stundenGesamt: number | null | undefined;
  stundenHalbjahr?: number | null;
  name?: string | null;
  [weitere: string]: unknown;
}): ReactNode {
  return null;
}
