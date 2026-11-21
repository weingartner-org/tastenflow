import { describe, it, expect, beforeEach } from "vitest";
import { PocketBaseBackend } from "@/backend/pocketbase";

/**
 * Regression-Test für den Token-Ablauf-Fix (2026-05-30).
 *
 * Vorher: Bei abgelaufenem Token surfacte `PocketBaseBackend.init()` weiter
 * den gecachten `authStore.record` → die App zeigte die (Admin-)Oberfläche,
 * während jeder PB-Aufruf still scheiterte (Lesen → leer, Schreiben → HTTP
 * 400 „create rule failure"). Das hat eine Live-Diagnose stundenlang in die
 * Irre geführt.
 *
 * Erwartet jetzt: Ein vorhandenes, aber abgelaufenes Token wird verworfen,
 * sodass `currentUser()` null liefert (→ App landet sauber auf der Anmeldung).
 */

/** Baut ein strukturell gültiges, aber ABGELAUFENES JWT (exp in 2001). */
function expiredJwt(): string {
  const part = (o: object) =>
    Buffer.from(JSON.stringify(o)).toString("base64url");
  const header = part({ alg: "HS256", typ: "JWT" });
  const payload = part({
    id: "u_test",
    type: "auth",
    collectionId: "users",
    exp: 1_000_000_000, // 2001 – sicher abgelaufen
  });
  return `${header}.${payload}.sig`;
}

describe("PocketBaseBackend.init – abgelaufenes Token", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("verwirft ein abgelaufenes Token und meldet keinen User", async () => {
    // PocketBase LocalAuthStore liest beim Konstruieren aus localStorage.
    localStorage.setItem(
      "pocketbase_auth",
      JSON.stringify({
        token: expiredJwt(),
        record: {
          id: "u_test",
          collectionId: "users",
          collectionName: "users",
          email: "admin@example.edu",
          role: "admin",
          displayName: "Admin",
        },
      }),
    );

    const backend = new PocketBaseBackend();
    await backend.init();

    // Ohne den Fix wäre hier das gecachte Admin-Profil zurückgekommen.
    expect(backend.currentUser()).toBeNull();
  });
});
