import { LegalShell } from "./LegalShell";

/*
 * Ersatzteil im Paket „Tastenflow": Die Datenschutzerklärung beschreibt den
 * Betrieb EINER Installation (Server, Mailversand, Aufbewahrung). Wer das
 * Paket betreibt, schreibt seine eigene. Was die App selbst speichert:
 * Konten von Lehrkräften (E-Mail, Name), Kinder-Konten (Anmeldename, Passwort
 * verschlüsselt, Übungsstand) und Klassen. Kinder-Konten brauchen keine
 * E-Mail-Adresse.
 */
export function Datenschutz() {
  return (
    <LegalShell title="Datenschutz">
      <p>
        Hier steht die Datenschutzerklärung der Person oder Einrichtung, die diese Installation betreibt.
        Sie gehört in die Datei <code>src/features/legal/Datenschutz.tsx</code>.
      </p>
      <p lang="en">
        This is where the operator publishes the privacy notice of this installation. Edit{" "}
        <code>src/features/legal/Datenschutz.tsx</code>.
      </p>
    </LegalShell>
  );
}
