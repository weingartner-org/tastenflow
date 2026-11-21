import { MockBackend } from "../src/backend/mock";
import type { Role } from "../src/backend/types";

/**
 * Liefert ein frisches MockBackend mit eingeloggter Admin-Session.
 * Notwendig seit der Admin/Teacher-Rollen-Trennung (2026-05-28):
 * strukturelle Schreibvorgänge (saveCourse, saveAuthoredLesson,
 * saveCompensationQuiz, …) setzen jetzt `role === "admin"` voraus.
 *
 * Das Backend seedet beim init() den Demo-Admin
 * (`admin@example.edu` / `Test1234!`). Wir loggen uns damit ein,
 * damit Tests strukturelle Backend-Operationen durchführen können.
 */
export async function freshAsAdmin(): Promise<MockBackend> {
  const b = new MockBackend();
  await b.init();
  await b.signIn("admin@example.edu", "Test1234!");
  return b;
}

/**
 * Liefert ein frisches MockBackend mit eingeloggter Session für die
 * angegebene Rolle. Workflow:
 *   1) Admin loggt sich ein
 *   2) adminCreateUser legt einen User mit Random-Passwort an
 *   3) confirmPasswordReset setzt ein bekanntes Passwort + verified
 *   4) Admin-Sitzung beenden, neue Sitzung mit der Zielrolle starten
 *
 * Für die Adversarial-Tests der Rollen-Trennung — wir wollen prüfen,
 * was eine eingeloggte Teacher- oder Observer-Sitzung am Backend
 * verändern darf bzw. nicht.
 */
export async function freshAs(
  role: Role,
  email = `${role}@test.edu`,
  password = "Test1234!",
): Promise<MockBackend> {
  const b = await freshAsAdmin();
  await b.adminCreateUser(email, role + " Test", role);
  // Reset-Token im Mock = die E-Mail des Kontos (vgl. confirmPasswordReset
  // in src/backend/mock.ts — akzeptiert uid oder E-Mail als Token).
  await b.confirmPasswordReset(email, password);
  await b.signOut();
  await b.signIn(email, password);
  return b;
}
