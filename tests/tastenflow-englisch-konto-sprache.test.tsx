/**
 * ★★★★ DIE SPRACHE AM KONTO UND DIE HOOK-MELDUNGEN (EN9, 19.09.2026).
 *
 * Zwei Hälften der Etappe EN9, die im BROWSER liegen (die Mails selbst prüft
 * `tests/tastenflow-englisch-mails.test.ts`):
 *
 *  1. ★★★ `bedienSprache` am Konto - danach richten sich die Mails. Der Client
 *     schreibt es (a) beim Umschalten über den Sprachschalter, angemeldet,
 *     (b) beim Anlegen eines Kontos in englischer Bedienung, (c) nach der
 *     Anmeldung einer Lehrkraft / eines selbstlernenden Kontos, wenn das Gerät
 *     eine andere Sprache zeigt. ⚠️ In deutscher Bedienung bleibt jeder Rumpf,
 *     der an den Server geht, Zeichen für Zeichen wie vorher (nur das neue
 *     selbstlernende Konto trägt seine Übungssprache, seit 19.09.2026).
 *  2. ★★★ Die Meldungen der Hooks, die die Oberfläche wörtlich zeigt (Kind
 *     verschieben, Klassencode, Co-Lehrkräfte, Klassenmatch) - englisch über
 *     die EINE Tabelle `src/lib/typing/serverMeldungen.ts` (EN2), deutsch
 *     unverändert.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speakSequence: vi.fn() };
});

import { AnnounceProvider } from "@/lib/a11y";
import {
  BedienSpracheProvider,
  aktuelleBedienSprache,
  useBedienSprache,
  type BedienSprache,
} from "../src/lib/bedienSprache";
import { TastenflowSprachBereich } from "@/features/public/TastenflowSprachBereich";
import { ClassTeachers } from "@/components/lernwerkstatt/klasse/ClassTeachers";
import { PocketBaseTypingBackend, ZEITZONE_AM_SERVER } from "@/lib/typing/pbBackend";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { _mockMatchesZuruecksetzen } from "@/lib/typing/matchMock";
import { useKlassenmatch } from "@/lib/typing/useKlassenmatch";
import { serverMeldung, serverMeldungEnglisch } from "@/lib/typing/serverMeldungen";
import type { TypingAccount } from "@/lib/typing/account";
import { findeDeutsch, pruefeText } from "./helfer/deutschFaenger";

/** Bedienung gewählt - so, wie der Sprachschalter oder `?bedienung=…` es tut. */
function stelleBedienung(sprache: BedienSprache) {
  localStorage.setItem("tastenflow-bedienung", sprache);
}

beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// 1. Die Sprache am Konto
// ---------------------------------------------------------------------------

interface Schreibvorgang {
  collection: string;
  id?: string;
  body: Record<string, unknown>;
}

/** Ein PocketBase-Ersatz: merkt sich jedes `create`/`update`, meldet an wie verlangt. */
function fakePb(record: Record<string, unknown> | null) {
  const creates: Schreibvorgang[] = [];
  const updates: Schreibvorgang[] = [];
  const authStore = { record, isValid: !!record };
  return {
    creates,
    updates,
    authStore,
    filter: (s: string) => s,
    collection(collection: string) {
      return {
        async create(body: Record<string, unknown>) {
          creates.push({ collection, body });
          return { id: "neu", collectionName: collection, ...body };
        },
        async update(id: string, body: Record<string, unknown>) {
          updates.push({ collection, id, body });
          return { id, collectionName: collection, ...body };
        },
        async requestVerification() {},
        async authWithPassword(email: string) {
          const rec = { id: "konto1", collectionName: collection, email, name: "Anna", ...(record ?? {}) };
          authStore.record = rec;
          authStore.isValid = true;
          return { record: rec };
        },
        async getFirstListItem() {
          throw new Error("nicht gebraucht");
        },
        async getFullList() {
          return [];
        },
      };
    },
  };
}

function backendMit(pb: unknown): PocketBaseTypingBackend {
  const b = new PocketBaseTypingBackend();
  (b as unknown as { pb: unknown }).pb = pb;
  // Die Lernzeilen eines Kindes anzulegen gehört nicht hierher.
  (b as unknown as { ensureRows: () => Promise<void> }).ensureRows = async () => {};
  return b;
}

/** `bedienSpracheAbgleichen` schreibt ohne `await` - einmal die Warteschlange leeren. */
const nachlaufen = () => new Promise((r) => setTimeout(r, 0));

describe("★★★ aktuelleBedienSprache - dieselbe Quelle wie der Provider", () => {
  it("ohne gemerkte Wahl: neues Gerät ⇒ Sprache des Browsers, bekanntes Gerät ⇒ Deutsch", () => {
    const englisch = vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-GB"]);
    expect(aktuelleBedienSprache()).toBe("en");
    localStorage.setItem("tippen-einrichtung", "v1");
    expect(aktuelleBedienSprache()).toBe("de");
    englisch.mockRestore();
  });
  it("die gemerkte Wahl gilt", () => {
    stelleBedienung("en");
    expect(aktuelleBedienSprache()).toBe("en");
    stelleBedienung("de");
    expect(aktuelleBedienSprache()).toBe("de");
  });
});

describe("★★★ Der Sprachschalter merkt die Sprache am angemeldeten Konto", () => {
  it("Lehrkraft: „en“ wird geschrieben - „de“ bei leerem Feld nicht (nichts geändert)", async () => {
    const pb = fakePb({ id: "t1", collectionName: "tt_teachers", bedienSprache: "" });
    const b = backendMit(pb);
    await b.merkeBedienSprache("de");
    expect(pb.updates).toEqual([]);
    await b.merkeBedienSprache("en");
    expect(pb.updates).toEqual([{ collection: "tt_teachers", id: "t1", body: { bedienSprache: "en" } }]);
  });

  it("Kind einer Klasse: mit der unveränderten teacherUid (die updateRule verlangt sie)", async () => {
    const pb = fakePb({ id: "k1", collectionName: "tt_pupils", teacherUid: "t1", bedienSprache: "en" });
    await backendMit(pb).merkeBedienSprache("de");
    expect(pb.updates).toEqual([
      { collection: "tt_pupils", id: "k1", body: { bedienSprache: "de", teacherUid: "t1" } },
    ]);
  });

  it("ohne Anmeldung: kein Aufruf", async () => {
    const pb = fakePb(null);
    await backendMit(pb).merkeBedienSprache("en");
    expect(pb.updates).toEqual([]);
  });

  it("ein Fehler am Server bleibt still - die Bedienung ist trotzdem umgeschaltet", async () => {
    const pb = fakePb({ id: "t1", collectionName: "tt_teachers" });
    pb.collection = () =>
      ({
        async update() {
          throw new Error("offline");
        },
      }) as never;
    await expect(backendMit(pb).merkeBedienSprache("en")).resolves.toBeUndefined();
  });
});

describe("★★★ Neues Konto: die Sprache geht beim Anlegen mit - nur englisch", () => {
  it("Lehrkraft, Bedienung englisch: `bedienSprache: \"en\"` im Rumpf (Begrüssung + Bestätigung englisch)", async () => {
    stelleBedienung("en");
    const pb = fakePb(null);
    await backendMit(pb).registerTeacher("Anna", "anna@schule.at", "geheim1");
    expect(pb.creates[0].body.bedienSprache).toBe("en");
  });

  it("★ deutscher Browser, nichts gemerkt: der Rumpf wie vor EN9 - KEIN neues Feld", async () => {
    const pb = fakePb(null);
    await backendMit(pb).registerTeacher("Anna", "anna@schule.at", "geheim1");
    expect(Object.keys(pb.creates[0].body).sort()).toEqual(
      ["createdAtMs", "email", "name", "password", "passwordConfirm"].sort(),
    );
    expect(pb.updates).toEqual([]);
  });

  it("selbstlernendes Konto, Bedienung englisch: ebenso", async () => {
    stelleBedienung("en");
    const pb = fakePb(null);
    await backendMit(pb).registerPupilSelf("Mia", "mia@familie.at", "geheim12");
    expect(pb.creates[0].body.bedienSprache).toBe("en");
    expect(pb.creates[0].body.selfManaged).toBe(true);
  });

  it("★★ selbstlernendes Konto: die ÜBUNGSSPRACHE folgt der Bedienung beim Anlegen (19.09.2026)", async () => {
    stelleBedienung("en");
    const en = fakePb(null);
    await backendMit(en).registerPupilSelf("Mia", "mia@familie.at", "geheim12");
    expect(en.creates[0].body.lang).toBe("en");
    stelleBedienung("de");
    const de = fakePb(null);
    await backendMit(de).registerPupilSelf("Mia", "mia@familie.at", "geheim12");
    expect(de.creates[0].body.lang).toBe("de");
  });

  it("Bedienung deutsch (gemerkt): kein Feld - Deutsch ist der leere Wert", async () => {
    stelleBedienung("de");
    const pb = fakePb(null);
    await backendMit(pb).registerTeacher("Anna", "anna@schule.at", "geheim1");
    expect("bedienSprache" in pb.creates[0].body).toBe(false);
  });
});

/**
 * ★ D2 (28.09.2026): Bei derselben Anmeldung schreibt der Abgleich auch die
 * ZEITZONE (`zeitzone`, eigener Aufruf, nur bei einer Änderung). Diese Tests
 * hier gehören der Sprache - sie sehen darum nur die Aufrufe mit
 * `bedienSprache`; die Zone prüft der Block „Zeitzone" weiter unten.
 */
function sprachUpdates(pb: ReturnType<typeof fakePb>) {
  return pb.updates.filter((u) => "bedienSprache" in u.body);
}

describe("★★★ Nach der Anmeldung: das Gerät gewinnt - aber nicht bei Kindern einer Klasse", () => {
  it("Lehrkraft schaltet VOR der Anmeldung auf Englisch - danach steht „en“ am Konto", async () => {
    stelleBedienung("en");
    const pb = fakePb(null);
    await backendMit(pb).loginTeacher("anna@schule.at", "geheim1");
    await nachlaufen();
    expect(sprachUpdates(pb)).toEqual([
      { collection: "tt_teachers", id: "konto1", body: { bedienSprache: "en" } },
    ]);
  });

  it("selbstlernendes Konto: ebenso", async () => {
    stelleBedienung("en");
    const pb = fakePb({ selfManaged: true, teacherUid: "" });
    await backendMit(pb).loginPupilSelf("mia@familie.at", "geheim12");
    await nachlaufen();
    expect(sprachUpdates(pb).map((u) => u.body.bedienSprache)).toEqual(["en"]);
  });

  it("★ Kind einer Klasse (geteiltes Schulgerät): KEIN Abgleich", async () => {
    stelleBedienung("en");
    const pb = fakePb({ teacherUid: "t1", classCode: "3B" });
    await backendMit(pb).loginPupil("3B", "Mia", "Kiwi47");
    await nachlaufen();
    expect(pb.updates).toEqual([]);
  });

  it("★ deutsche Bedienung: kein Aufruf, solange das Konto nie „en“ hatte", async () => {
    const pb = fakePb(null);
    await backendMit(pb).loginTeacher("anna@schule.at", "geheim1");
    await nachlaufen();
    expect(sprachUpdates(pb)).toEqual([]);
  });

  it("deutsche Bedienung: „en“ am Konto wird „de“ (das Gerät gewinnt)", async () => {
    stelleBedienung("de");
    const pb = fakePb({ bedienSprache: "en" });
    await backendMit(pb).loginTeacher("anna@schule.at", "geheim1");
    await nachlaufen();
    expect(sprachUpdates(pb).map((u) => u.body)).toEqual([{ bedienSprache: "de" }]);
  });
});

describe("★★★ D2: die Zeitzone des Geräts kommt bei der Anmeldung ans Konto", () => {
  // Solange das Feld am Server fehlt (Schalter aus), schreibt die Anmeldung NICHTS.
  it.runIf(!ZEITZONE_AM_SERVER)("Schalter aus: die Anmeldung schreibt keine Zone", async () => {
    const pb = fakePb(null);
    await backendMit(pb).loginTeacher("anna@schule.at", "geheim1");
    await nachlaufen();
    expect(pb.updates.filter((u) => "zeitzone" in u.body)).toEqual([]);
  });
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonenUpdates = (pb: ReturnType<typeof fakePb>) =>
    pb.updates.filter((u) => "zeitzone" in u.body);

  it.runIf(ZEITZONE_AM_SERVER)("Lehrkraft: die Zone wird geschrieben", async () => {
    const pb = fakePb(null);
    await backendMit(pb).loginTeacher("anna@schule.at", "geheim1");
    await nachlaufen();
    expect(zonenUpdates(pb)).toEqual([
      { collection: "tt_teachers", id: "konto1", body: { zeitzone: zone } },
    ]);
  });

  it.runIf(ZEITZONE_AM_SERVER)("selbstlernendes Konto: ebenso, mit der unveränderten teacherUid", async () => {
    const pb = fakePb({ selfManaged: true, teacherUid: "" });
    await backendMit(pb).loginPupilSelf("mia@familie.at", "geheim12");
    await nachlaufen();
    expect(zonenUpdates(pb).map((u) => u.body)).toEqual([{ zeitzone: zone, teacherUid: "" }]);
  });

  it("steht dieselbe Zone schon am Konto: kein Aufruf", async () => {
    const pb = fakePb({ zeitzone: zone });
    await backendMit(pb).loginTeacher("anna@schule.at", "geheim1");
    await nachlaufen();
    expect(zonenUpdates(pb)).toEqual([]);
  });

  it("★ Kind einer Klasse: KEIN Abgleich (geteiltes Schulgerät)", async () => {
    const pb = fakePb({ teacherUid: "t1", classCode: "3B" });
    await backendMit(pb).loginPupil("3B", "Mia", "Kiwi47");
    await nachlaufen();
    expect(zonenUpdates(pb)).toEqual([]);
  });
});

describe("★★★ Der Provider meldet jedes Umschalten weiter (beimWechsel)", () => {
  function Schalter() {
    const { wechsle } = useBedienSprache();
    return (
      <button type="button" onClick={() => wechsle("en")}>
        umschalten
      </button>
    );
  }

  it("beimWechsel bekommt die neue Sprache", () => {
    stelleBedienung("de");
    const beimWechsel = vi.fn();
    render(
      <AnnounceProvider>
        <BedienSpracheProvider beimWechsel={beimWechsel}>
          <Schalter />
        </BedienSpracheProvider>
      </AnnounceProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "umschalten" }));
    expect(beimWechsel).toHaveBeenCalledWith("en");
  });

  it("auf einer fremden Adresse (nicht aktiv): nichts (es gibt dort auch keinen Schalter)", () => {
    const beimWechsel = vi.fn();
    render(
      <AnnounceProvider>
        <BedienSpracheProvider aktiv={false} beimWechsel={beimWechsel}>
          <Schalter />
        </BedienSpracheProvider>
      </AnnounceProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "umschalten" }));
    expect(beimWechsel).not.toHaveBeenCalled();
  });

  it("★ Tastenflow reicht es ans Konto weiter (TastenflowSprachBereich → merkeBedienSprache)", async () => {
    stelleBedienung("de");
    const merke = vi.fn(async () => {});
    (typingBackend() as unknown as { merkeBedienSprache: typeof merke }).merkeBedienSprache = merke;
    render(
      <AnnounceProvider>
        <MemoryRouter initialEntries={["/programme/tastenflow"]}>
          <TastenflowSprachBereich>
            <Schalter />
          </TastenflowSprachBereich>
        </MemoryRouter>
      </AnnounceProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "umschalten" }));
    // Seit 28.09.2026 holt der Sprachbereich die Konto-Anbindung per `import()`
    // (sonst läge sie im Kern jeder Seite) - der Aufruf kommt einen Takt später.
    await waitFor(() => expect(merke).toHaveBeenCalledWith("en"));
  });
});

// ---------------------------------------------------------------------------
// 2. Die Hook-Meldungen
// ---------------------------------------------------------------------------

describe("★★★ Die Hook-Meldungen der Klassenverwaltung (tt_klasse_lib.pb.js)", () => {
  it("Sätze mit Code, Namen und Zahl kommen über Muster - Code und Name bleiben", () => {
    expect(
      serverMeldungEnglisch("Eine Klasse mit dem Klassencode „4B“ gibt es nicht. Bitte den Code prüfen."),
    ).toBe("There is no class with the class code “4B”. Please check the code.");
    expect(
      serverMeldungEnglisch("In der Klasse „4B Tastschreiben“ sind bereits 30 Kinder. Mehr als 30 sind je Klasse nicht vorgesehen."),
    ).toBe("The class “4B Tastschreiben” already has 30 pupils. A class can have no more than 30.");
    expect(
      serverMeldungEnglisch(
        "In der neuen Klasse gibt es schon ein Kind mit dem Namen „Mia“. Ändern Sie zuerst den Namen eines der beiden Kinder.",
      ),
    ).toBe(
      "There is already a pupil called “Mia” in the new class. Please change the name of one of the two pupils first.",
    );
  });

  it("★ die Muster passen auf den WORTLAUT im Hook (sonst greifen sie nie)", async () => {
    const { readFileSync } = await import("node:fs");
    const quelle = readFileSync("pocketbase/pb_hooks/tt_klasse_lib.pb.js", "utf8");
    expect(quelle).toContain('"Eine Klasse mit dem Klassencode „" + ziel + "“ gibt es nicht. Bitte den Code prüfen."');
    expect(quelle).toContain('" Kinder. Mehr als " + MAX_KINDER + " sind je Klasse nicht vorgesehen."');
    expect(quelle).toContain('"“. Ändern Sie zuerst den Namen eines der beiden Kinder."');
  });

  it("jeder englische Satz ohne Deutsch; die deutsche Bedienung bekommt den Satz unverändert", () => {
    for (const satz of [
      "Dieses Kind gehört nicht zu einer Ihrer Klassen.",
      "Das Kind ist schon in der Klasse mit diesem Klassencode.",
      "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.",
      "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.",
    ]) {
      const en = serverMeldung(satz, "en");
      expect(en.lang, satz).toBeUndefined();
      expect(pruefeText("en", en.text)).toBeNull();
      expect(serverMeldung(satz, "de")).toEqual({ text: satz });
    }
  });
});

describe("★★★ Co-Lehrkräfte: die Meldung des Servers in der Sprache der Bedienung", () => {
  async function fuegeHinzu(sprache: BedienSprache | null) {
    if (sprache) stelleBedienung(sprache);
    const b = typingBackend();
    vi.spyOn(b, "listClassTeachers").mockResolvedValue([]);
    vi.spyOn(b, "addTeacherToClass").mockResolvedValue({
      ok: false,
      error: "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.",
    });
    render(
      <AnnounceProvider>
        <MemoryRouter>
          <BedienSpracheProvider>
            <ClassTeachers classCode="3B" meId="t1" />
          </BedienSpracheProvider>
        </MemoryRouter>
      </AnnounceProvider>,
    );
    fireEvent.click(screen.getByRole("button", { expanded: false }));
    fireEvent.change(document.getElementById("addteach-3B")!, { target: { value: "kollegin@schule.at" } });
    fireEvent.submit(document.getElementById("addteach-3B")!.closest("form")!);
    // Die Zeile des Bauteils - nicht die Live-Region des AnnounceProvider.
    return waitFor(() => {
      const p = [...document.querySelectorAll('p[role="alert"]')].find((x) => x.textContent);
      if (!p) throw new Error("noch keine Meldung");
      return p as HTMLElement;
    });
  }

  it("englisch: „This teacher already owns the class.“", async () => {
    const alarm = await fuegeHinzu("en");
    expect(alarm.textContent).toBe("This teacher already owns the class.");
    expect(findeDeutsch(alarm)).toEqual([]);
  });

  it("★ deutsch: derselbe Satz, EIN Textknoten wie vorher", async () => {
    const alarm = await fuegeHinzu(null);
    expect(alarm.textContent).toBe("Diese Lehrkraft ist bereits Eigentümer:in der Klasse.");
    expect(alarm.childNodes).toHaveLength(1);
    expect(alarm.firstChild?.nodeType).toBe(Node.TEXT_NODE);
  });
});

describe("★★★ Klassenmatch: der Grund des Servers wird übersetzt (tt_match.pb.js)", () => {
  const SARAH: TypingAccount = { id: "sarah", role: "schueler", name: "Sarah", classCode: "K1", createdAt: 1 };
  const Huelle = ({ children }: { children: ReactNode }) => (
    <AnnounceProvider>
      <BedienSpracheProvider>{children}</BedienSpracheProvider>
    </AnnounceProvider>
  );
  async function warte(ms: number) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms);
    });
  }
  beforeEach(() => {
    _mockMatchesZuruecksetzen();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    _mockMatchesZuruecksetzen();
  });

  async function abgewiesen(): Promise<string> {
    const { result } = renderHook(() => useKlassenmatch(SARAH), { wrapper: Huelle });
    await warte(50);
    vi.spyOn(typingBackend(), "erstelleMatch").mockRejectedValueOnce(
      new Error("Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet."),
    );
    await act(async () => {
      result.current.einladen();
    });
    await warte(50);
    return result.current.meldung;
  }

  it("englisch: der ganze Satz englisch", async () => {
    stelleBedienung("en");
    expect(await abgewiesen()).toBe(
      "The Class Match invitation couldn't be sent: Your teacher has switched off Class Match for this class.",
    );
  });

  it("★ deutsch: wortgleich wie vor EN9", async () => {
    expect(await abgewiesen()).toBe(
      "Das Klassenmatch konnte nicht ausgeschrieben werden: Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.",
    );
  });
});
