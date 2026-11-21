import { describe, it, expect, beforeEach } from "vitest";
import { freshAsAdmin } from "./_helpers";

// Mock-2FA-Fluss (Etappe 6 Schritt 2). Der Mock simuliert TOTP mit dem
// Demo-Code „123456"; echte RFC-6238-Prüfung deckt tests/totp-lib.test.ts +
// der pb-dev-E2E-Lauf ab.
describe("Admin-TOTP (Mock) — Etappe 6 Schritt 2", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Status initial: nicht eingerichtet, nicht freigeschaltet", async () => {
    const b = await freshAsAdmin();
    const st = await b.getTotpStatus();
    expect(st.enabled).toBe(false);
    expect(st.unlocked).toBe(false);
  });

  it("Einrichtung: setup → confirm(123456) → enabled + Wiederherstellungs-Codes", async () => {
    const b = await freshAsAdmin();
    const setup = await b.setupTotp();
    expect(setup.secret.length).toBeGreaterThan(0);
    expect(setup.otpauthUri).toContain("otpauth://");

    const conf = await b.confirmTotp("123456");
    expect(conf.recoveryCodes).toHaveLength(10);

    const st = await b.getTotpStatus();
    expect(st.enabled).toBe(true);
    expect(st.unlocked).toBe(true);
  });

  it("confirm mit falschem Code wirft", async () => {
    const b = await freshAsAdmin();
    await b.setupTotp();
    await expect(b.confirmTotp("000000")).rejects.toThrow();
  });

  it("verify mit falschem Code wirft, mit 123456 schaltet frei", async () => {
    const b = await freshAsAdmin();
    await b.setupTotp();
    await b.confirmTotp("123456");
    await expect(b.verifyTotp("999999")).rejects.toThrow();
    await expect(b.verifyTotp("123456")).resolves.toBeUndefined();
  });

  it("Wiederherstellungs-Code funktioniert einmal, dann nicht mehr", async () => {
    const b = await freshAsAdmin();
    await b.setupTotp();
    const { recoveryCodes } = await b.confirmTotp("123456");
    const rc = recoveryCodes[0];
    await expect(b.verifyTotp(rc)).resolves.toBeUndefined();
    await expect(b.verifyTotp(rc)).rejects.toThrow();
  });
});
