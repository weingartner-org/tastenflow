import { describe, it, expect } from "vitest";
import { freshAsAdmin } from "./_helpers";
import { BackendError } from "@/backend/types";

/**
 * „Passwort zuweisen" durch Admin + erzwungener Wechsel beim ersten Login
 * (2026-06-08). Weg an blockierten Schul-Mailservern vorbei.
 */
describe("Admin-Start-Passwort + erzwungener Erstwechsel", () => {
  it("aktiviert das Konto und erzwingt den Wechsel beim ersten Login", async () => {
    const admin = await freshAsAdmin();
    const created = await admin.adminCreateUser(
      "opfer@test.edu",
      "Test Person",
      "student",
    );
    // Frisch angelegt: unverified, kein erzwungener Wechsel.
    expect(created.verified).toBe(false);
    expect(created.mustChangePassword ?? false).toBe(false);

    await admin.adminSetPassword(created.uid, "Start-Pass-99!");

    // Konto ist jetzt aktiv + zum Wechsel markiert.
    const prof = await admin.getProfile(created.uid);
    expect(prof?.verified).toBe(true);
    expect(prof?.mustChangePassword).toBe(true);
    // Admin-Sitzung bleibt unangetastet.
    expect(admin.currentUser()?.role).toBe("admin");

    // Person meldet sich mit dem Start-Passwort an → Flag ist sichtbar.
    await admin.signOut();
    const loggedIn = await admin.signIn("opfer@test.edu", "Start-Pass-99!");
    expect(loggedIn.verified).toBe(true);
    expect(loggedIn.mustChangePassword).toBe(true);
    expect(admin.currentUser()?.mustChangePassword).toBe(true);

    // Eigenes Passwort festlegen → Flag verschwindet, Sitzung bleibt.
    await admin.finishForcedPasswordChange("Mein-Eigenes-12!");
    expect(admin.currentUser()?.mustChangePassword).toBe(false);

    // Neues Passwort gilt, das alte Start-Passwort nicht mehr.
    await admin.signOut();
    const again = await admin.signIn("opfer@test.edu", "Mein-Eigenes-12!");
    expect(again.mustChangePassword).toBe(false);
    await admin.signOut();
    await expect(
      admin.signIn("opfer@test.edu", "Start-Pass-99!"),
    ).rejects.toBeInstanceOf(BackendError);
  });

  it("weist zu kurze Passwörter ab", async () => {
    const admin = await freshAsAdmin();
    const u = await admin.adminCreateUser("kurz@test.edu", "Kurz", "student");
    await expect(admin.adminSetPassword(u.uid, "1234")).rejects.toThrow();
  });

  it("wirft bei unbekanntem Konto", async () => {
    const admin = await freshAsAdmin();
    await expect(
      admin.adminSetPassword("nichtda", "Lang-Genug-1!"),
    ).rejects.toBeInstanceOf(BackendError);
  });
});
