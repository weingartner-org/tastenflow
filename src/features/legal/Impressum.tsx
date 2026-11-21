import { LegalShell } from "./LegalShell";

/*
 * Ersatzteil im Paket „Tastenflow": Das Impressum der Originalplattform nennt
 * den Betreiber dieser Plattform. Wer das Paket selbst betreibt, ist ein
 * anderer Betreiber und trägt seine eigenen Angaben ein (Betreiber,
 * Anschrift, Kontakt) - das verlangt das Recht des jeweiligen Landes.
 */
export function Impressum() {
  return (
    <LegalShell title="Impressum">
      <p>
        Hier stehen die Angaben der Person oder Einrichtung, die diese Installation betreibt
        (Name, Anschrift, Kontakt). Sie gehören in die Datei <code>src/features/legal/Impressum.tsx</code>.
      </p>
      <p lang="en">
        This is where the operator of this installation lists name, address and contact. Edit{" "}
        <code>src/features/legal/Impressum.tsx</code>.
      </p>
    </LegalShell>
  );
}
