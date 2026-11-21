/**
 * ★★★★★ WÄCHTER: `setClassEinstellungen` schreibt `startUnits` an den Server
 * (Nachbesserung 23.09.2026, Johannes' Meldung).
 *
 * Befund: `TastenflowReiter.stufeSetzen` (~3490-3528) ruft
 * `backend.setClassEinstellungen(klasse.code, teacherId, { startUnits: units })`
 * auf und meldete danach „gilt" - aber im PocketBase-Weg
 * (`PocketBaseTypingBackend.setClassEinstellungen`, `pbBackend.ts`) fehlte
 * `startUnits` im lokal nachgebauten Parametertyp UND im Update-Rumpf. Der
 * Wert kam am Server nie an, obwohl `tt_classes.startUnits`/`startUnitsAt` das
 * Feld längst kennt (`setup.mjs`) - live hatten 24 von 43 Klassen einen Wert,
 * aber nur vom ANLEGEN (`createClass` schreibt es dort korrekt), nie vom
 * nachträglichen Ändern.
 *
 * Behoben, indem der Parametertyp jetzt das gemeinsame
 * `KlassenEinstellungenAenderung` (`account.ts`) ist - dieselbe Bauart wie am
 * lokalen Mock-Backend (`account.setClassEinstellungen`) - und der Rumpf
 * `startUnits`/`startUnitsAt` genauso setzt wie dort: Wert und
 * Beschluss-Zeitpunkt gehören zusammen, `0` löscht beide.
 *
 * Muster für den nachgebauten `pb`:
 * `tests/tastenflow-klassen-kinder-grenze-meldung.test.ts`
 * (`Object.create(PocketBaseTypingBackend.prototype)`).
 */
import { describe, expect, it } from "vitest";
import { PocketBaseTypingBackend } from "@/lib/typing/pbBackend";

function backendMit(pb: unknown): PocketBaseTypingBackend {
  const b = Object.create(PocketBaseTypingBackend.prototype) as PocketBaseTypingBackend;
  (b as unknown as { pb: unknown }).pb = pb;
  return b;
}

/** Merkt den zuletzt an `update` übergebenen Rumpf, ohne echtes PocketBase. */
function pbMitMerker(merker: { body?: Record<string, unknown> }) {
  const rec = { id: "rec1", code: "3B", name: "3b", teacherUid: "t1" };
  return {
    filter: (s: string) => s,
    collection(name: string) {
      if (name !== "tt_classes") throw new Error("unerwartete Sammlung: " + name);
      return {
        async getFirstListItem() {
          return rec;
        },
        async update(_id: string, body: Record<string, unknown>) {
          merker.body = body;
          return { ...rec, ...body };
        },
      };
    },
  };
}

describe("★★★★★ setClassEinstellungen(startUnits) - kommt jetzt am Server an", () => {
  it("startUnits gesetzt ⇒ der Rumpf trägt startUnits UND startUnitsAt", async () => {
    const merker: { body?: Record<string, unknown> } = {};
    const vorher = Date.now();
    const neu = await backendMit(pbMitMerker(merker)).setClassEinstellungen("3B", "t1", {
      startUnits: 12,
    });
    expect(merker.body?.startUnits).toBe(12);
    expect(typeof merker.body?.startUnitsAt).toBe("number");
    expect(merker.body!.startUnitsAt as number).toBeGreaterThanOrEqual(vorher);
    expect(neu?.startUnits).toBe(12);
  });

  it("startUnits = 0 löscht die Vorgabe ⇒ startUnitsAt geht auf 0 (der leere Wert am Server)", async () => {
    const merker: { body?: Record<string, unknown> } = {};
    await backendMit(pbMitMerker(merker)).setClassEinstellungen("3B", "t1", { startUnits: 0 });
    expect(merker.body?.startUnits).toBe(0);
    expect(merker.body?.startUnitsAt).toBe(0);
  });

  it("Gegenprobe: ohne startUnits in der Änderung steht keines der beiden Felder im Rumpf", async () => {
    const merker: { body?: Record<string, unknown> } = {};
    await backendMit(pbMitMerker(merker)).setClassEinstellungen("3B", "t1", { lang: "en" });
    expect(merker.body).not.toHaveProperty("startUnits");
    expect(merker.body).not.toHaveProperty("startUnitsAt");
    expect(merker.body?.lang).toBe("en");
  });
});
