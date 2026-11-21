/**
 * ★ 27.09.2026 (Johannes: „/es darf öffentlich werden" - wie „/fr" am
 * 26.09.: „ja, bau Möglichkeit 1"): Wer über `tastenflow.org/es` kommt,
 * bekommt den spanischen Lehrgang UND die spanische Bedienung - die Adresse
 * wirkt wie `?spanisch-lehrgang=1`. Vorher sah ein neuer Besucher dort eine
 * spanische Vorschau und dann eine deutsche App (ES-M, nur vorbereitet).
 * Muster: `tests/tastenflow-fr-adresse-schaltet-lehrgang.test.ts`.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { spanischLehrgangProbeAn, LEHRGANG_PROBE_MERKER_ES } from "../src/lib/typing/lernweg";
import { adressWahlLesen } from "../src/lib/bedienSprache/sprache";

beforeEach(() => localStorage.clear());

describe("/es schaltet den spanischen Lehrgang an", () => {
  it("/es und /es/ schalten an und merken es auf dem Gerät", () => {
    expect(spanischLehrgangProbeAn("", "/es")).toBe(true);
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_ES)).toBe("1");
    localStorage.clear();
    expect(spanischLehrgangProbeAn("", "/es/")).toBe(true);
  });

  it("danach gilt es auch auf anderen Seiten (gemerkt)", () => {
    spanischLehrgangProbeAn("", "/es");
    expect(spanischLehrgangProbeAn("", "/programme/tastenflow")).toBe(true);
  });

  it("die Bedienung wird spanisch", () => {
    const an = spanischLehrgangProbeAn("", "/es");
    expect(adressWahlLesen("", "/es", false, an)).toBe("es");
  });

  it("Not-Aus in derselben Adresse geht vor", () => {
    expect(spanischLehrgangProbeAn("?spanisch-lehrgang=0", "/es")).toBe(false);
  });

  // ★ 28.09.2026 (Freigabe fr/es): Seit der Schalter default AN ist, kann
  // „schaltet nichts an" nicht mehr am Rückgabewert hängen (der ist ohne
  // Merker ohnehin true). Die Aussage bleibt: andere Adressen wirken NICHT
  // wie diese - sie setzen keinen Merker und heben einen Not-Aus nicht auf.
  it("★ Gegenprobe: andere Adressen setzen den Merker nicht und schalten ein Not-Aus nicht wieder an", () => {
    for (const pfad of ["/", "/en", "/fr", "/programme/tastenflow", "/freunde"]) {
      localStorage.clear();
      spanischLehrgangProbeAn("", pfad);
      expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_ES), pfad).toBeNull();
      localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "0");
      expect(spanischLehrgangProbeAn("", pfad), pfad).toBe(false);
      expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_ES), pfad).toBe("0");
    }
    // Gegenprobe zur Gegenprobe: DIESE Adresse hebt den Not-Aus auf.
    localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "0");
    expect(spanischLehrgangProbeAn("", "/es")).toBe(true);
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_ES)).toBe("1");
  });
});
