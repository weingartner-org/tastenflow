/**
 * Ersatzteil im Paket „Tastenflow": die Rollen-Prüfungen der Plattform-Konten.
 * Das Original enthält zusätzlich Listen mit E-Mail-Adressen von Personen, die
 * in der Originalplattform besondere Rechte haben (Workshop-Leitung,
 * Entwickler-Werkzeuge). Sie gehören nicht in ein öffentliches Paket.
 *
 * Tastenflow selbst kennt zwei eigene Konto-Arten (Lehrkraft und Kind); die
 * Rollen hier gelten nur für das Plattform-Konto, das die App beim Start
 * abfragt.
 */
import type { UserProfile } from "@/backend";

/** Staff = Lehrperson oder Admin. */
export function isStaff(u: UserProfile | null | undefined): boolean {
  return !!u && (u.role === "teacher" || u.role === "admin");
}

export function isObserver(u: UserProfile | null | undefined): boolean {
  return !!u && u.role === "course_observer";
}

export function isAdmin(u: UserProfile | null | undefined): boolean {
  return !!u && u.role === "admin";
}
