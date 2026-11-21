import { describe, it, expect, beforeEach } from "vitest";
import { MockBackend } from "../src/backend/mock";

/**
 * Schritt 6 (2026-05-25): updateOwnProfile — Studi darf nur Bundesland,
 * Telefon und Inklusions-Liste-Zustimmung ändern. Email/uid/Rolle/
 * displayName bleiben unverändert. consentedAt wird beim Setzen auf
 * true gesetzt, beim Widerruf zurückgesetzt.
 */

async function freshSignedIn() {
  const b = new MockBackend();
  await b.init();
  await b.testKontoAnlegen("anna@example.edu", "Test1234!", "Anna Test");
  return b;
}

describe("Schritt 6 — updateOwnProfile (Profilfelder + Inklusions-Consent)", () => {
  beforeEach(() => localStorage.clear());

  it("Bundesland und Telefon werden gespeichert", async () => {
    const b = await freshSignedIn();
    const updated = await b.updateOwnProfile({
      bundesland: "stmk",
      phone: "+43 660 1234567",
    });
    expect(updated.bundesland).toBe("stmk");
    expect(updated.phone).toBe("+43 660 1234567");
  });

  it("Telefon-Whitespace wird getrimmt, leerer Wert löscht das Feld", async () => {
    const b = await freshSignedIn();
    await b.updateOwnProfile({ phone: "   +43 1 23   " });
    let me = b.currentUser()!;
    expect(me.phone).toBe("+43 1 23");
    await b.updateOwnProfile({ phone: "" });
    me = b.currentUser()!;
    expect(me.phone).toBeUndefined();
  });

  it("Bundesland leeren setzt das Feld auf undefined", async () => {
    const b = await freshSignedIn();
    await b.updateOwnProfile({ bundesland: "wien" });
    expect(b.currentUser()?.bundesland).toBe("wien");
    await b.updateOwnProfile({ bundesland: "" });
    expect(b.currentUser()?.bundesland).toBeUndefined();
  });

  it("Inklusions-Consent: erstes true setzt Timestamp, false löscht ihn", async () => {
    const b = await freshSignedIn();
    const before = Date.now();
    const set = await b.updateOwnProfile({ inkluListConsent: true });
    expect(set.inkluListConsent).toBe(true);
    expect(set.inkluListConsentedAt).toBeGreaterThanOrEqual(before);

    const off = await b.updateOwnProfile({ inkluListConsent: false });
    expect(off.inkluListConsent).toBe(false);
    expect(off.inkluListConsentedAt).toBeUndefined();
  });

  it("Wiederholtes true lässt den Original-Timestamp stehen (kein Reset)", async () => {
    const b = await freshSignedIn();
    const first = await b.updateOwnProfile({ inkluListConsent: true });
    const t1 = first.inkluListConsentedAt!;
    await new Promise((r) => setTimeout(r, 5));
    const again = await b.updateOwnProfile({ inkluListConsent: true });
    expect(again.inkluListConsentedAt).toBe(t1);
  });

  it("currentUser-Snapshot reflektiert die neuen Felder sofort", async () => {
    const b = await freshSignedIn();
    await b.updateOwnProfile({
      bundesland: "ooe",
      phone: "+43 732 999",
      inkluListConsent: true,
    });
    const me = b.currentUser()!;
    expect(me.bundesland).toBe("ooe");
    expect(me.phone).toBe("+43 732 999");
    expect(me.inkluListConsent).toBe(true);
  });

  it("Ohne Anmeldung wirft updateOwnProfile permission-denied", async () => {
    const b = new MockBackend();
    await b.init();
    await expect(
      b.updateOwnProfile({ phone: "+43 1 2" }),
    ).rejects.toMatchObject({ code: "permission-denied" });
  });

  it("Email/uid/Rolle/displayName bleiben unverändert (Whitelist-Schutz)", async () => {
    const b = await freshSignedIn();
    const before = b.currentUser()!;
    // Bewusster Versuch, gesperrte Felder über einen Cast mitzuschicken.
    // Backend prüft hart per Whitelist — Email/Rolle/uid bleiben gleich.
    await b.updateOwnProfile({
      bundesland: "wien",
      email: "evil@example.com",
      role: "admin",
    } as unknown as Parameters<typeof b.updateOwnProfile>[0]);
    const after = b.currentUser()!;
    expect(after.email).toBe(before.email);
    expect(after.role).toBe(before.role);
    expect(after.uid).toBe(before.uid);
    expect(after.displayName).toBe(before.displayName);
  });
});
