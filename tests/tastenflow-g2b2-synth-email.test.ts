/**
 * ★ G2b-2 (02.10.2026): `synthEmail` (die erfundene Login-Adresse eines Kindes) kann die
 * Sonderbuchstaben der neuen Sprachen - und verändert für KEINEN bisherigen Namen auch
 * nur ein Zeichen (sonst fände die Anmeldung eines bestehenden Kindes es nicht mehr).
 */
import { describe, expect, it } from "vitest";
import { SYNTH_UMSCHRIFT, synthEmail } from "@/lib/typing/pbBackend";
import { SPRACHREGISTER } from "@/lib/typing/sprachRegister";
import { neueLaufzeit } from "./helfer/pbHookLaufzeit";

interface KlasseLib {
  synthEmail: (c: string, n: string) => string;
  SYNTH_UMSCHRIFT: Record<string, string>;
}
const server = neueLaufzeit({ jetzt: 0 }).lib<KlasseLib>("tt_klasse_lib.pb.js");

/** Die Adresse, wie `synthEmail` sie VOR G2b-2 rechnete (Kopie der alten Fassung). */
function alteAdresse(classCode: string, name: string): string {
  const code = classCode.trim().toLowerCase();
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${code}__${slug || "x"}@tt.local`;
}

describe("bestehende Namen: Adresse Zeichen für Zeichen wie vorher", () => {
  const NAMEN = [
    "Mia", "Anna Lena", "Jürgen Groß", "Ärger-Öl", "O'Brien", "", "  ",
    // französisch und spanisch (live): die Sonderbuchstaben fallen wie bisher heraus
    "José", "Zoé", "François", "Noël", "Chloé Müller", "Ramón", "Núria", "Nuño", "Íñigo", "Ángel",
    "Æmilia", "Œdipe", "Ÿvonne", "Hélène",
  ];
  it.each(NAMEN)("„%s“", (name) => {
    expect(synthEmail("3B", name)).toBe(alteAdresse("3B", name));
  });
});

describe("die Buchstaben der neuen Sprachen werden zu ihrem Grundbuchstaben", () => {
  it.each([
    ["Łukasz", "lukasz"],
    ["Żaneta Gąsiorek", "zaneta-gasiorek"],
    ["Wojciech Świątek", "wojciech-swiatek"],
    ["Şule", "sule"],
    ["ILKER", "ilker"],
    ["İlker", "ilker"],
    ["Işık", "isik"],
    ["Ağaç", "aga"],
    // á é í ó ú ñ … tragen auch Namen in fr und es: sie fallen WIE BISHER heraus (bewusst)
    ["Dvořák", "dvor-k"],
    ["Žofie Šťastná", "zofie-stastn"],
    ["Tomáš Čech", "tom-s-cech"],
    ["Cecilì", "cecili"],
    ["Niccolò", "niccolo"],
  ])("„%s“ ⇒ %s", (name, slug) => {
    expect(synthEmail("3B", name)).toBe(`3b__${slug}@tt.local`);
  });

  it("zwei verschiedene Namen fallen nicht mehr zusammen (vorher: Łukasz und ukasz)", () => {
    expect(synthEmail("3B", "Łukasz")).not.toBe(synthEmail("3B", "ukasz"));
    expect(alteAdresse("3B", "Łukasz")).toBe(alteAdresse("3B", "ukasz"));
  });
});

describe("★ der Server rechnet Zeichen für Zeichen wie der Client", () => {
  it("die Umschrift-Tabellen sind gleich", () => {
    expect(server.SYNTH_UMSCHRIFT).toEqual({ ...SYNTH_UMSCHRIFT });
  });

  it("jedes Zeichen der Register-Tabellen von it, pl, tr, cs (klein und gross) ergibt dieselbe Adresse", () => {
    for (const s of ["it", "pl", "tr", "cs"] as const) {
      for (const z of Object.keys(SPRACHREGISTER[s].klassencodeUmschrift)) {
        for (const name of [z, `A${z}b`, `${z}${z}`]) {
          expect(server.synthEmail("3B", name), `${s}: ${name}`).toBe(synthEmail("3B", name));
        }
      }
    }
  });

  it("und für die Namen oben, alt wie neu", () => {
    for (const name of ["Łukasz", "İlker", "Žofie Šťastná", "José", "Jürgen Groß", "", "O'Brien"]) {
      expect(server.synthEmail("3B", name), name).toBe(synthEmail("3B", name));
    }
  });

  it("★ die Umschrift enthält NUR Buchstaben, die vorher als „-“ herausfielen (nichts Bestehendes ändert sich)", () => {
    for (const z of Object.keys(SYNTH_UMSCHRIFT)) {
      // „İ" ist klein „i" + Punkt (zwei Zeichen): vorher „i-" - ein türkischer Name war nie live.
      expect(alteAdresse("X", `a${z}b`), z).toBe(z === "İ" ? "x__ai-b@tt.local" : "x__a-b@tt.local");
    }
  });
});
