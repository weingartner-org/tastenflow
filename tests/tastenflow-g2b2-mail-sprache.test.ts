/**
 * ★ G2b-2 (02.10.2026): Mail-Sprache und Sprachwerte am Server.
 * - Eine Sprache der App ohne eigene Mail-Texte (seit O-CS keine mehr; it, pl, tr und cs seit Etappe O mit
 *   eigenen) bekäme ENGLISCHE Mails - nie deutsche (G1c §3 „Danach", `pbBackend.ts:389`).
 * - Die Sprachlisten des Servers (`MAIL_SPRACHEN` + `MAIL_SPRACHEN_OHNE_TEXT`, die
 *   zwei Listen im Feld-Wächter und in der Selbstanmeldung) sind die Sprachliste
 *   der App - eine neue Sprache fällt hier auf, bis sie am Server steht.
 * - `spracheBeimAnlegen` (Client) hat keine feste Liste mehr.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LERNWEGE_LISTE } from "@/lib/typing/lernweg";
import { ALLE_SPRACHEN } from "@/lib/typing/sprachRegister";
import { FakeRecord, neueLaufzeit } from "./helfer/pbHookLaufzeit";

const gewaehlt = vi.hoisted(() => ({ wert: "de" as string }));
vi.mock("@/lib/bedienSprache/sprache", async (orig) => {
  const echt = await orig<typeof import("@/lib/bedienSprache/sprache")>();
  return { ...echt, kontoBedienSprache: () => gewaehlt.wert as never };
});
import { spracheBeimAnlegen } from "@/lib/typing/pbBackend";

const lies = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

interface Texte {
  MAIL_SPRACHEN: string[];
  MAIL_SPRACHEN_OHNE_TEXT: string[];
  spracheVon: (r: unknown) => string;
}
const lz = neueLaufzeit({ jetzt: Date.UTC(2026, 9, 2, 10), appUrl: "https://weingartner.org" });
const texte = lz.lib<Texte>("tt_mail_texte_lib.pb.js");
const konto = (wert: unknown) => new FakeRecord("tt_teachers", "T", { bedienSprache: wert });

describe("★ spracheVon: jede Sprache der App hat eigene Mails (it seit O-IT, pl seit O-PL, tr seit O-TR, cs seit O-CS)", () => {
  // ★ O-CS (03.10.2026): die Liste ohne Text ist leer - kein Wert fällt mehr auf Englisch.
  // ★ G2-NEUN (25.10.2026): seither standen die neun Sprachen des Gerüsts darin.
  // ★ O4 (30.10.2026): sie haben eigene Texte (`tests/tastenflow-neun-mails.test.ts`) - die Liste ist wieder leer.
  it("MAIL_SPRACHEN_OHNE_TEXT ist leer; die neun gehen in ihrer eigenen Sprache", () => {
    expect(texte.MAIL_SPRACHEN_OHNE_TEXT).toEqual([]);
    for (const s of ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"]) expect(texte.spracheVon(konto(s))).toBe(s);
  });

  it("de, en, fr, es, it, pl, tr, cs unverändert; leer, fremd und falsch geschrieben bleibt Deutsch (Bestand)", () => {
    for (const s of ["de", "en", "fr", "es", "it", "pl", "tr", "cs"]) expect(texte.spracheVon(konto(s))).toBe(s);
    for (const wert of ["", "ES", "es ", "esp", "IT", "PL", "pl ", "TR", "tr ", "CS", "cs ", undefined]) {
      expect(texte.spracheVon(konto(wert)), String(wert)).toBe("de");
    }
    expect(texte.spracheVon(null)).toBe("de");
  });

  it("★ die zwei Listen zusammen sind genau die Sprachliste der App - ohne Überschneidung", () => {
    const beide = [...texte.MAIL_SPRACHEN, ...texte.MAIL_SPRACHEN_OHNE_TEXT];
    expect([...beide].sort()).toEqual([...LERNWEGE_LISTE].sort());
    expect([...beide].sort()).toEqual([...ALLE_SPRACHEN].sort());
    expect(new Set(beide).size).toBe(beide.length);
  });
});

// ★ O-IT (02.10.2026): seit Etappe O bekommt ein Kind mit „it" die Zugangsdaten
// ITALIENISCH. ★ O-PL (02.10.2026): „pl" POLNISCH. ★ O-TR (02.10.2026): „tr"
// TÜRKISCH. ★ O-CS (03.10.2026): „cs" TSCHECHISCH.
describe("★ eine echte Mail: das Konto eines Kindes mit „it“ bekommt die Zugangsdaten italienisch", () => {
  it("passwort-Mail an die Kontakt-Adresse", () => {
    const l = neueLaufzeit({ jetzt: Date.UTC(2026, 9, 2, 10), appUrl: "https://weingartner.org" });
    l.ladeHook("tt_pupils_passwort_mail.pb.js");
    const kind = new FakeRecord("tt_pupils", "P1", {
      name: "Giulia",
      classCode: "5A",
      contactEmail: "famiglia@esempio.it",
      passwordPlain: "Kiwi47",
      teacherUid: "T1",
      bedienSprache: "it",
    });
    for (const h of l.handler("onRecordAfterCreateSuccess", "tt_pupils")) h.handler({ record: kind, app: l.$app, next() {} });
    expect(l.gesendet[0].subject).toBe("Dati di accesso di Giulia");
    expect(l.gesendet[0].html).toContain('lang="it"');
  });

  it("ein Kind mit „pl“ bekommt sie polnisch (O-PL)", () => {
    const l = neueLaufzeit({ jetzt: Date.UTC(2026, 9, 2, 10), appUrl: "https://weingartner.org" });
    l.ladeHook("tt_pupils_passwort_mail.pb.js");
    const kind = new FakeRecord("tt_pupils", "P2", {
      name: "Zofia",
      classCode: "5A",
      contactEmail: "rodzina@przyklad.pl",
      passwordPlain: "Kiwi47",
      teacherUid: "T1",
      bedienSprache: "pl",
    });
    for (const h of l.handler("onRecordAfterCreateSuccess", "tt_pupils")) h.handler({ record: kind, app: l.$app, next() {} });
    expect(l.gesendet[0].subject).toBe("Dane logowania: Zofia");
    expect(l.gesendet[0].html).toContain('lang="pl"');
  });

  it("ein Kind mit „tr“ bekommt sie türkisch (O-TR)", () => {
    const l = neueLaufzeit({ jetzt: Date.UTC(2026, 9, 2, 10), appUrl: "https://weingartner.org" });
    l.ladeHook("tt_pupils_passwort_mail.pb.js");
    const kind = new FakeRecord("tt_pupils", "P3", {
      name: "Elif",
      classCode: "5A",
      contactEmail: "aile@ornek.com.tr",
      passwordPlain: "Kiwi47",
      teacherUid: "T1",
      bedienSprache: "tr",
    });
    for (const h of l.handler("onRecordAfterCreateSuccess", "tt_pupils")) h.handler({ record: kind, app: l.$app, next() {} });
    expect(l.gesendet[0].subject).toBe("Giriş bilgileri: Elif");
    expect(l.gesendet[0].html).toContain('lang="tr"');
  });

  it("ein Kind mit „cs“ bekommt sie tschechisch (O-CS)", () => {
    const l = neueLaufzeit({ jetzt: Date.UTC(2026, 9, 2, 10), appUrl: "https://weingartner.org" });
    l.ladeHook("tt_pupils_passwort_mail.pb.js");
    const kind = new FakeRecord("tt_pupils", "P4", {
      name: "Tereza",
      classCode: "5A",
      contactEmail: "rodina@priklad.cz",
      passwordPlain: "Kiwi47",
      teacherUid: "T1",
      bedienSprache: "cs",
    });
    for (const h of l.handler("onRecordAfterCreateSuccess", "tt_pupils")) h.handler({ record: kind, app: l.$app, next() {} });
    expect(l.gesendet[0].subject).toBe("Přihlašovací údaje: Tereza");
    expect(l.gesendet[0].html).toContain('lang="cs"');
  });
});

describe("★ die Wert-Listen des Servers kennen jede Sprache der App", () => {
  /** Die Liste `const NAME = [...]` aus einer Hook-Datei. */
  const liste = (datei: string, name: string): string[] => {
    const m = new RegExp(`const ${name} = \\[([^\\]]*)\\]`).exec(lies(`pocketbase/pb_hooks/${datei}`));
    expect(m, `${datei}: ${name}`).not.toBeNull();
    return [...(m as RegExpExecArray)[1].matchAll(/"([^"]*)"/g)].map((x) => x[1]);
  };

  it("Feld-Wächter: bedienSprache = leer + jede Sprache", () => {
    expect(liste("tt_pupils_field_guard.pb.js", "BEDIEN_SPRACHEN").sort()).toEqual(["", ...ALLE_SPRACHEN].sort());
  });
  it("Feld-Wächter: lernweg = leer + jeder Weg", () => {
    expect(liste("tt_pupils_field_guard.pb.js", "LERNWEGE").sort()).toEqual(["", ...LERNWEGE_LISTE].sort());
  });
  it("Selbstanmeldung: lernweg = jeder Weg", () => {
    expect(liste("tt_pupils_selfsignup.pb.js", "LERNWEGE").sort()).toEqual([...LERNWEGE_LISTE].sort());
  });
  it.skip("Topf (tt_topf): die Sprachen der Tagesbilanz = jede Sprache der App (vorher nur de, en: fr/es wurden still abgewiesen)", () => {
    expect(liste("tt_topf.pb.js", "SPRACHEN").sort()).toEqual([...ALLE_SPRACHEN].sort());
  });
  it("die PocketBase-Felder lang, lernweg, bedienSprache sind freier Text (kein Select) - it, pl, tr, cs sind erlaubt", () => {
    const setup = lies("pocketbase/setup.mjs");
    expect(setup).toContain('const T = (name) => ({ name, type: "text" });');
    expect(setup).not.toMatch(/name:\s*"(lang|lernweg|bedienSprache)",\s*type:\s*"select"/);
  });
});

describe("★ spracheBeimAnlegen (Client): keine feste Liste", () => {
  beforeEach(() => {
    gewaehlt.wert = "de";
  });
  it("Deutsch schickt nichts (der Rumpf bleibt wie er war)", () => {
    expect(spracheBeimAnlegen()).toEqual({});
  });
  // ★ G2-NEUN (25.10.2026): ebenso die neun Sprachen des Gerüsts.
  it.each(["en", "fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"])("%s wird mitgeschickt", (s) => {
    gewaehlt.wert = s;
    expect(spracheBeimAnlegen()).toEqual({ bedienSprache: s });
  });
  it("ein unbekannter Wert wird Englisch - nie Deutsch, nie ein Absturz", () => {
    gewaehlt.wert = "xx";
    expect(spracheBeimAnlegen()).toEqual({ bedienSprache: "en" });
  });
});
