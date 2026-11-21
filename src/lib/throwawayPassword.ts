/**
 * Phase C / Welcome-Mail (2026-05-22): erzeugt eine lange (64 Zeichen)
 * zufällige Wegwerf-Passwort für roster-importierte Konten. Niemand
 * soll sie jemals kennen, lesen oder nutzen — die Studi setzt ihre
 * eigene Passwort über den Reset-Link aus der Welcome-Mail. Wir
 * brauchen sie nur, damit `users.create` (Mock und PB) formal eine
 * Passwort hat.
 *
 * Sicherheits-Eigenschaft: das ausgehende PW darf NIE im UI oder
 * Backend-Response auftauchen, nie geloggt, nie in einem ImportResult
 * gespeichert werden. Dies hier ist die einzige Quelle.
 */
export function genThrowawayPassword(): string {
  const ALPHA =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!#$%&*+";
  const n = 64;
  const c = globalThis.crypto;
  let s = "";
  if (c?.getRandomValues) {
    const buf = new Uint32Array(n);
    c.getRandomValues(buf);
    for (let i = 0; i < n; i++) s += ALPHA[buf[i] % ALPHA.length];
  } else {
    for (let i = 0; i < n; i++)
      s += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  }
  return s;
}
