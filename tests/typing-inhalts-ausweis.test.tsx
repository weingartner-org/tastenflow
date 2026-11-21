/**
 * Datei-Ausweis in der eigenständigen Tastenflow-Seite (Befund 23.08.2026):
 * Das Handbuch hinter /handbuecher/... verlangt das Cookie aus
 * /api/sensorik/inhalt/ausweis. Die LMS-Hülle holt es zentral - Tastenflow
 * (auch tastenflow.org) muss es selbst tun. Diese Tests prüfen VERHALTEN:
 * angemeldet wird der Ausweis geholt, als Gast nicht.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("Der Datei-Ausweis der Tastenflow-Seite", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  it("lokales Backend: inhaltsAusweisSichern existiert und wirft nicht", async () => {
    const { typingBackend } = await import("@/lib/typing");
    const b = typingBackend();
    expect(typeof b.inhaltsAusweisSichern).toBe("function");
    await expect(b.inhaltsAusweisSichern()).resolves.toBeUndefined();
  });

  it("PB-Backend: ohne Anmeldung KEIN Abruf, mit gültiger Sitzung genau einer (mit Erneuerungs-Sperre)", async () => {
    const { PocketBaseTypingBackend } = await import("@/lib/typing/pbBackend");
    const b = new PocketBaseTypingBackend() as any;
    const send = vi.fn().mockResolvedValue({});
    b.pb.send = send;
    // Gast: authStore ungültig
    await b.inhaltsAusweisSichern();
    expect(send).not.toHaveBeenCalled();
    // Angemeldet: authStore gültig stellen
    Object.defineProperty(b.pb.authStore, "isValid", { get: () => true });
    await b.inhaltsAusweisSichern();
    await b.inhaltsAusweisSichern(); // innerhalb der 10 Minuten: kein zweiter Abruf
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(
      "/api/sensorik/inhalt/ausweis",
      expect.objectContaining({ method: "POST" }),
    );
  });

  /**
   * ★★★ GEMESSEN am 23.09.2026 (Mail einer Lehrerin aus der Schweiz, Server-
   * Protokoll): 08:21 angemeldet, Ausweis ausgestellt - er gilt am Server für
   * `tt_teachers` nur 180 s. 08:27 Handbuch ⇒ 404, weil der Browser erst nach
   * 10 Minuten erneuert. 08:28 ab- und wieder angemeldet ⇒ KEIN neuer Ausweis,
   * die Sperre lief weiter. 08:30 wieder 404.
   */
  it("nach dem Abmelden holt die nächste Anmeldung einen NEUEN Ausweis", async () => {
    const { PocketBaseTypingBackend } = await import("@/lib/typing/pbBackend");
    const b = new PocketBaseTypingBackend() as any;
    const send = vi.fn().mockResolvedValue({});
    b.pb.send = send;
    let angemeldet = true;
    Object.defineProperty(b.pb.authStore, "isValid", { get: () => angemeldet });
    await b.inhaltsAusweisSichern();
    b.logout();
    angemeldet = true; // gleich wieder angemeldet
    await b.inhaltsAusweisSichern();
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("„frisch“: vor einem Download IMMER einen neuen Ausweis - auch innerhalb der 10 Minuten", async () => {
    const { PocketBaseTypingBackend } = await import("@/lib/typing/pbBackend");
    const b = new PocketBaseTypingBackend() as any;
    const send = vi.fn().mockResolvedValue({});
    b.pb.send = send;
    Object.defineProperty(b.pb.authStore, "isValid", { get: () => true });
    await b.inhaltsAusweisSichern();
    await b.inhaltsAusweisSichern({ frisch: true });
    expect(send).toHaveBeenCalledTimes(2);
  });
});

