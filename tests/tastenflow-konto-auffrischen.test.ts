/**
 * ★★ L2 (19.09.2026): Das Konto wird beim Start FRISCH vom Server geholt.
 *
 * Johannes: *„ich habe den CVI-Zeichenabstand bei Jano getestet … entweder
 * die Abstände sind auch bei 4-fach extrem gering oder da aktualisiert etwas
 * nicht, den Browser von Jano hab ich aktualisiert"*. Gemessen (nur lesend):
 * am Server stand bei Jano `zeichenabstand = 4`. Auf dem Gerät galt der
 * Stand der ANMELDUNG - `currentAccount` liest nur den gespeicherten
 * `authStore`, und ein Neuladen fragte den Server nie.
 *
 * Nachgestellt: gespeichert ist Abstand 1, der Server kennt 4. Vorher blieb
 * es bei 1 (die Gegenprobe unten: ohne `kontoAuffrischen` genau das).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import type { TypingAccount } from "@/lib/typing";

const GEMERKT: TypingAccount = {
  id: "kind-jano",
  role: "schueler",
  name: "Jano",
  classCode: "",
  zeichenabstand: 1,
} as TypingAccount;

async function ladeStore(auffrischen?: () => Promise<TypingAccount | null>) {
  vi.resetModules();
  const backendModul = await import("@/lib/typing/backend");
  const b = backendModul.typingBackend() as unknown as Record<string, unknown>;
  b.currentAccount = () => GEMERKT;
  if (auffrischen) b.kontoAuffrischen = vi.fn(auffrischen);
  else delete b.kontoAuffrischen;
  // Vor dem Import: das Auffrischen läuft schon, während der Import aufgeht.
  b.logout = vi.fn();
  const { useTypingAuth } = await import("@/components/typing/useTypingAuth");
  return { useTypingAuth, b };
}

/** Die Mikroaufgaben und den ausstehenden Server-Aufruf durchlaufen lassen. */
async function warte() {
  for (let i = 0; i < 5; i++) await Promise.resolve();
  await new Promise((r) => setTimeout(r, 0));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("★★ L2 - das Konto kommt beim Start frisch vom Server", () => {
  it("gespeichert Abstand 1, am Server 4 - nach dem Start gilt 4", async () => {
    const { useTypingAuth, b } = await ladeStore(async () => ({ ...GEMERKT, zeichenabstand: 4 }));
    // (Der gemerkte Stand steht synchron zuerst da - hier nicht messbar, weil
    // der Import selbst schon die Mikroaufgaben durchlaufen lässt.)
    await warte();
    expect(b.kontoAuffrischen).toHaveBeenCalledTimes(1);
    expect(useTypingAuth.getState().account?.zeichenabstand).toBe(4);
  });

  it("Gegenprobe: ohne Auffrischen (so war es bis heute) bleibt der alte Stand", async () => {
    const { useTypingAuth } = await ladeStore(undefined);
    await warte();
    expect(useTypingAuth.getState().account?.zeichenabstand).toBe(1);
  });

  it("offline / abgelaufen (null) oder Fehler: nichts wird weggenommen", async () => {
    const leer = await ladeStore(async () => null);
    await warte();
    expect(leer.useTypingAuth.getState().account?.zeichenabstand).toBe(1);

    const kaputt = await ladeStore(async () => {
      throw new Error("offline");
    });
    await warte();
    expect(kaputt.useTypingAuth.getState().account?.name).toBe("Jano");
  });

  it("ein anderes Konto in der Antwort wird nicht übernommen", async () => {
    const { useTypingAuth } = await ladeStore(async () => ({
      ...GEMERKT,
      id: "jemand-anderes",
      zeichenabstand: 4,
    }));
    await warte();
    expect(useTypingAuth.getState().account?.id).toBe("kind-jano");
    expect(useTypingAuth.getState().account?.zeichenabstand).toBe(1);
  });

  it("kommt das Fenster wieder nach vorn: neu fragen - höchstens einmal je Minute", async () => {
    let jetzt = 1_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => jetzt);
    const { b } = await ladeStore(async () => ({ ...GEMERKT, zeichenabstand: 4 }));
    await warte();
    expect(b.kontoAuffrischen).toHaveBeenCalledTimes(1);

    const sichtbar = () => {
      Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    };
    jetzt += 30_000;
    sichtbar();
    await warte();
    expect(b.kontoAuffrischen).toHaveBeenCalledTimes(1);

    jetzt += 31_000;
    sichtbar();
    await warte();
    expect(b.kontoAuffrischen).toHaveBeenCalledTimes(2);
  });
});

describe("★★ L2b - Änderungen am eigenen Konto kommen sofort (Realtime)", () => {
  /** Ein Backend mit Abo: `melde` spielt die Änderung der Lehrkraft nach. */
  async function mitAbo() {
    let melde: ((k: TypingAccount) => void) | null = null;
    const beendet = vi.fn();
    vi.resetModules();
    const backendModul = await import("@/lib/typing/backend");
    const b = backendModul.typingBackend() as unknown as Record<string, unknown>;
    b.currentAccount = () => GEMERKT;
    delete b.kontoAuffrischen;
    b.kontoBeobachten = vi.fn((_id: string, cb: (k: TypingAccount) => void) => {
      melde = cb;
      return beendet;
    });
    b.logout = () => {};
    const { useTypingAuth } = await import("@/components/typing/useTypingAuth");
    await warte();
    return { useTypingAuth, b, melde: (k: TypingAccount) => melde!(k), beendet };
  }

  it("Lehrkraft stellt um (4 ⇒ 1 ⇒ 3): das Gerät folgt jedes Mal, ohne Neuladen", async () => {
    const { useTypingAuth, b, melde } = await mitAbo();
    expect(b.kontoBeobachten).toHaveBeenCalledTimes(1);
    expect((b.kontoBeobachten as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe("kind-jano");
    melde({ ...GEMERKT, zeichenabstand: 4 });
    expect(useTypingAuth.getState().account?.zeichenabstand).toBe(4);
    melde({ ...GEMERKT, zeichenabstand: 1 });
    expect(useTypingAuth.getState().account?.zeichenabstand).toBe(1);
    melde({ ...GEMERKT, zeichenabstand: 3 });
    expect(useTypingAuth.getState().account?.zeichenabstand).toBe(3);
  });

  it("Abmelden beendet das Abo; eine späte Meldung ändert nichts mehr", async () => {
    const { useTypingAuth, melde, beendet } = await mitAbo();
    useTypingAuth.getState().logout();
    expect(beendet).toHaveBeenCalledTimes(1);
    melde({ ...GEMERKT, zeichenabstand: 4 });
    expect(useTypingAuth.getState().account).toBeNull();
  });
});

/**
 * ★★★★★ DIE ANMELDUNG IST ABGELAUFEN (3. Klasse HAS, 23.09.2026).
 *
 * Gemessen am Server: Eine Schülerin, angemeldet am 16.09. um 08:2x Uhr
 * (sieben Tage gültig), lud am 23.09. um 08:21 Uhr die Seite. `auth-refresh`
 * antwortete 401 - und die App machte weiter, als wäre sie angemeldet. Drei
 * Minuten lang wurde jeder Schreibversuch abgewiesen („Dein Lernstand kann
 * gerade nicht gespeichert werden"), dann stürzte die Seite ab.
 *
 * Jetzt: Lehnt der Server ab, endet die Anmeldung - mit der Rolle im Store,
 * damit die Seite den passenden Satz sagt. Kein Netz meldet NIEMANDEN ab.
 */
describe("★★★★★ 23.09. - eine abgelaufene Anmeldung wird beendet, nicht weitergeschleppt", () => {
  it("Server lehnt ab (401): abgemeldet, `abgelaufen` nennt die Rolle", async () => {
    const { SitzungAbgelaufenFehler } = await import("@/lib/typing/sitzung");
    const { useTypingAuth, b } = await ladeStore(async () => {
      throw new SitzungAbgelaufenFehler();
    });
    await warte();
    expect(useTypingAuth.getState().account).toBeNull();
    expect(useTypingAuth.getState().abgelaufen).toBe("schueler");
    expect(b.logout).toHaveBeenCalledTimes(1);
  });

  it("Gegenprobe: kein Netz (irgendein anderer Fehler) meldet niemanden ab", async () => {
    const { useTypingAuth } = await ladeStore(async () => {
      throw new TypeError("Failed to fetch");
    });
    await warte();
    expect(useTypingAuth.getState().account?.id).toBe("kind-jano");
    expect(useTypingAuth.getState().abgelaufen).toBeNull();
  });

  it("eine neue Anmeldung räumt die Meldung weg", async () => {
    const { SitzungAbgelaufenFehler } = await import("@/lib/typing/sitzung");
    const { useTypingAuth, b } = await ladeStore(async () => {
      throw new SitzungAbgelaufenFehler();
    });
    await warte();
    expect(useTypingAuth.getState().abgelaufen).toBe("schueler");
    b.kontoBeobachten = () => () => {};
    useTypingAuth.getState().login(GEMERKT);
    expect(useTypingAuth.getState().abgelaufen).toBeNull();
    expect(useTypingAuth.getState().account?.id).toBe("kind-jano");
  });

  it("läuft sie ab, WÄHREND die Seite offen ist: beim nächsten Nachsehen beendet", async () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
    try {
      let ende = Date.now() + 5 * 60 * 60_000; // noch fünf Stunden
      const { useTypingAuth, b } = await ladeStore(async () => null);
      b.sitzungEndetMs = () => ende;
      await warte();
      const { SITZUNG_PRUEFEN_MS } = await import("@/components/typing/useTypingAuth");
      vi.advanceTimersByTime(SITZUNG_PRUEFEN_MS);
      expect(useTypingAuth.getState().account?.id).toBe("kind-jano");

      ende = Date.now() - 1_000; // die Wochenstunde: vor einer Sekunde abgelaufen
      vi.advanceTimersByTime(SITZUNG_PRUEFEN_MS);
      expect(useTypingAuth.getState().account).toBeNull();
      expect(useTypingAuth.getState().abgelaufen).toBe("schueler");
    } finally {
      vi.useRealTimers();
    }
  });

  it("endet sie in weniger als einer Stunde: wird sie VERLÄNGERT, nicht beendet", async () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
    let jetzt = 5_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => jetzt);
    try {
      const { useTypingAuth, b } = await ladeStore(async () => ({ ...GEMERKT }));
      b.sitzungEndetMs = () => jetzt + 20 * 60_000; // noch 20 Minuten
      await warte();
      expect(b.kontoAuffrischen).toHaveBeenCalledTimes(1); // beim Laden
      const { SITZUNG_PRUEFEN_MS } = await import("@/components/typing/useTypingAuth");
      jetzt += 61_000; // über die Sperre „höchstens einmal je Minute"
      vi.advanceTimersByTime(SITZUNG_PRUEFEN_MS);
      await warte();
      expect(b.kontoAuffrischen).toHaveBeenCalledTimes(2);
      expect(useTypingAuth.getState().account?.id).toBe("kind-jano");
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("★★★★★ 23.09. - pbBackend: abgelehnt ist nicht offline", () => {
  /** Muster wie `tastenflow-klassen-kinder-grenze-meldung.test.ts`: ein nachgebauter `pb`. */
  async function backendMit(fehler: unknown) {
    vi.resetModules();
    const { PocketBaseTypingBackend } = await import("@/lib/typing/pbBackend");
    const b = Object.create(PocketBaseTypingBackend.prototype) as InstanceType<typeof PocketBaseTypingBackend>;
    (b as unknown as { pb: unknown }).pb = {
      authStore: {
        isValid: true,
        token: `${btoa("{}")}.${btoa(JSON.stringify({ exp: 1_790_000_000 }))}.x`,
        record: { id: "kind-elisa", collectionName: "tt_pupils" },
      },
      collection: () => ({
        authRefresh: async () => {
          throw fehler;
        },
      }),
    };
    return b;
  }

  it("401 vom Server ⇒ SitzungAbgelaufenFehler", async () => {
    const { ClientResponseError } = await import("pocketbase");
    const b = await backendMit(new ClientResponseError({ status: 401 }));
    await expect(b.kontoAuffrischen()).rejects.toMatchObject({ name: "SitzungAbgelaufenFehler" });
  });

  it("404 (Konto gelöscht) ⇒ ebenso", async () => {
    const { ClientResponseError } = await import("pocketbase");
    const b = await backendMit(new ClientResponseError({ status: 404 }));
    await expect(b.kontoAuffrischen()).rejects.toMatchObject({ name: "SitzungAbgelaufenFehler" });
  });

  it("Gegenprobe: kein Netz (Status 0) und Serverfehler (500) ⇒ `null`, niemand wird abgemeldet", async () => {
    const { ClientResponseError } = await import("pocketbase");
    expect(await (await backendMit(new ClientResponseError({ status: 0 }))).kontoAuffrischen()).toBeNull();
    expect(await (await backendMit(new ClientResponseError({ status: 500 }))).kontoAuffrischen()).toBeNull();
    expect(await (await backendMit(new TypeError("Failed to fetch"))).kontoAuffrischen()).toBeNull();
  });

  it("das Ende der Anmeldung steht im Token (exp, Sekunden ⇒ ms)", async () => {
    const b = await backendMit(null);
    expect(b.sitzungEndetMs()).toBe(1_790_000_000_000);
  });
});
