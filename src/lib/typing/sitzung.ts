/**
 * ★★★★★ DIE ANMELDUNG IST ABGELAUFEN (23.09.2026, 3. Klasse HAS).
 *
 * Bis heute sah eine Sitzung, die der Server ablehnt, genauso aus wie ein
 * kurzer Netzaussetzer: `kontoAuffrischen` lieferte `null`, und „ein
 * Ladefehler nimmt nie etwas weg" - das Kind blieb angemeldet. Nur konnte ab
 * da nichts mehr gespeichert werden. Gemessen am Server: eine Schülerin,
 * angemeldet am 16.09. um 08:2x Uhr (die Anmeldung gilt sieben Tage), lud die
 * Seite am 23.09. um 08:21 Uhr. Der Server antwortete 401, die App machte
 * weiter; drei Minuten lang wurde jeder Schreibversuch abgewiesen, das Kind
 * sah „Dein Lernstand kann gerade nicht gespeichert werden" - und kurz darauf
 * stürzte die Seite ab (die Nachrichten-Glocke, siehe `LwMessageBell`).
 *
 * Dieser Fehler trennt die beiden Fälle: Er heisst „der Server kennt diese
 * Anmeldung nicht mehr", nie „kein Netz".
 */
export class SitzungAbgelaufenFehler extends Error {
  constructor() {
    super("Die Anmeldung ist abgelaufen.");
    this.name = "SitzungAbgelaufenFehler";
  }
}

/**
 * Am NAMEN erkannt, nicht mit `instanceof`: Nach einem Neuladen einzelner
 * Module (Entwicklungsserver, Tests mit `vi.resetModules`) gibt es die Klasse
 * zweimal, und `instanceof` sagte dann still „nein" - genau der Fall, den
 * dieser Fehler auffangen soll, ginge wieder als „kein Netz" durch.
 */
export function istSitzungAbgelaufen(e: unknown): boolean {
  return e instanceof Error && e.name === "SitzungAbgelaufenFehler";
}

/**
 * Welche Antworten des Servers eine Sitzung ablehnen: 401 (Token ungültig
 * oder abgelaufen - auch nach einem neuen Passwort), 403, 404 (Konto
 * gelöscht). Alles andere - 0 (kein Netz), 5xx, Abbruch - ist KEIN Grund,
 * jemanden abzumelden.
 */
export function lehntSitzungAb(status: number): boolean {
  return status === 401 || status === 403 || status === 404;
}
