/**
 * ★★★★★ E12 (26.09.2026, Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md`
 * §14 E12, Auftrag „die französische Sprachausgabe"): DER WÄCHTER ZU DIESER
 * ETAPPE - je Auftragspunkt ein Abschnitt.
 *
 * ⚠️ Was hier BEWUSST NICHT geprüft wird: die Totasten-Ansage
 * (`totastenTexte.ts`, „accent circonflexe, puis e") - die kommt aus E4 und
 * hat dort schon einen eigenen Wächter (`tastenflow-totaste-ansage.test.tsx`).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ladeKuerzelKatalog } from "../src/lib/typing/kuerzelKatalog";
import { spokenLabel } from "@/lib/typing/fingers";
import { erkundeTaste, zeichenName } from "@/lib/typing/tastenErklaerung";
import type { KeyEventLike } from "@/lib/computer/chord";
import {
  ANSAGEN,
  ansage,
  ansageAngemeldet,
  ansageAufstieg,
  ansageBelohnungsspiel,
  ansageNeueAbzeichen,
  ansageSchritt,
  ansageStart,
  ansageTastatur,
  ansageUmschaltSeite,
  ansageWerte,
  setVorleseSprache,
  sprachTagFuer,
  vorleseSprache,
} from "@/lib/typing/vorlesen";
import { feinesLangAttribut } from "@/lib/typing/schreibweise";
import { franzVariante, franzVarianteMerken } from "@/lib/typing/franzVariante";
import { isRealWord, lexikonGroesse, lexikonWoerter, normalizeWord } from "@/lib/typing/lexicon";

function ev(key: string, code = key, extra: Partial<KeyEventLike> = {}): KeyEventLike {
  return { key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...extra };
}

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

/* ══ Punkt 1+2: tastenErklaerungFr.ts und die Zeichennamen ══════════════════ */

// ★ 28.09.2026: Der Kürzel-Katalog von »Im Griff« wird nachgeladen
// (`lib/typing/kuerzelKatalog.ts`); im Fenster ist er da, sobald die Begrüßung
// gesprochen ist. Diese Tests prüfen die Sätze MIT Katalog - den Weg davor
// prüft `tests/tasten-erkunden-katalog-nachladen.test.tsx`.
beforeAll(() => ladeKuerzelKatalog());

describe("Auftrag Punkt 1: tastenErklaerungFr - Tasten erkunden auf Französisch", () => {
  it("nennt Sondertasten auf Französisch, nie deutsch oder englisch", () => {
    expect(erkundeTaste(ev("Tab"), "windows", { sprache: "fr" }).zeile).toMatch(
      /^Tab - touche de tabulation - /,
    );
    expect(erkundeTaste(ev("Escape", "Escape"), "windows", { sprache: "fr" }).zeile).toBe(
      "Échap - touche Échap - annule. Elle ferme les menus, les fenêtres et les messages. Dans Tastenflow, elle te ramène dans la zone d'écriture.",
    );
    expect(erkundeTaste(ev(" ", "Space"), "windows", { sprache: "fr" }).zeile).toMatch(
      /^barre d'espace - /,
    );
  });

  it("Maj/Verr. Maj/Alt Gr/Retour arrière wie im Glossar (Bauplan §9.2)", () => {
    expect(erkundeTaste(ev("Shift", "ShiftLeft"), "windows", { sprache: "fr" }).zeile).toMatch(
      /^Maj - touche Majuscule - /,
    );
    expect(erkundeTaste(ev("CapsLock", "CapsLock"), "windows", { sprache: "fr" }).zeile).toMatch(
      /^Verr\. Maj - touche Verrouillage majuscule - /,
    );
    expect(erkundeTaste(ev("Backspace", "Backspace"), "windows", { sprache: "fr" }).zeile).toMatch(
      /^touche Retour arrière - /,
    );
  });

  it.skip("Tastenkombinationen: Ctrl statt Strg, eigene Wirkungen auf Französisch", () => {
    const kombi = erkundeTaste(ev("c", "KeyC", { ctrlKey: true }), "windows", { sprache: "fr" });
    expect(kombi.zeile).toMatch(/^Ctrl \+ C - combinaison de touches - /);
    expect(kombi.ansage).toMatch(/Copier/);
  });

  it("eine Totaste mit bekanntem Akzent: accent circonflexe statt Zirkumflex", () => {
    const aus = erkundeTaste(ev("Dead", "BracketLeft"), "windows", {
      sprache: "fr",
      layout: "fr",
    });
    expect(aus.zeile).toBe("^ - accent circonflexe - touche accent - pose un petit chapeau sur la lettre suivante, par exemple ê. Le signe n'apparait qu'avec la lettre suivante.");
  });

  it("eine unbekannte Taste bleibt französisch, nicht deutsch", () => {
    expect(erkundeTaste(ev("", ""), "windows", { sprache: "fr" }).zeile).toBe(
      "Je ne reconnais pas cette touche.",
    );
  });
});

describe("Auftrag Punkt 2: die Zeichennamen - am Ohr unterscheidbar", () => {
  it("e / é / è / ê / ë sind fünf verschiedene Namen", () => {
    const namen = ["e", "é", "è", "ê", "ë"].map((ch) => spokenLabel(ch, "fr"));
    expect(new Set(namen).size).toBe(5);
    expect(spokenLabel("e", "fr")).toBe("e");
    expect(spokenLabel("é", "fr")).toBe("e accent aigu");
    expect(spokenLabel("è", "fr")).toBe("e accent grave");
    expect(spokenLabel("ê", "fr")).toBe("e accent circonflexe");
    expect(spokenLabel("ë", "fr")).toBe("e tréma");
  });

  it("à, ù, ç und der Apostroph haben eigene, französische Namen", () => {
    expect(spokenLabel("à", "fr")).toBe("a accent grave");
    expect(spokenLabel("ù", "fr")).toBe("u accent grave");
    expect(spokenLabel("ç", "fr")).toBe("c cédille");
    expect(spokenLabel("'", "fr")).toBe("apostrophe");
  });

  it("Grossbuchstaben mit Akzent: majuscule e accent aigu", () => {
    expect(spokenLabel("É", "fr")).toBe("majuscule e accent aigu");
  });

  it("Satzzeichen auf Französisch (point, virgule, point-virgule, ...)", () => {
    expect(spokenLabel(".", "fr")).toBe("point");
    expect(spokenLabel(",", "fr")).toBe("virgule");
    expect(spokenLabel(";", "fr")).toBe("point-virgule");
    expect(spokenLabel(":", "fr")).toBe("deux-points");
    expect(spokenLabel("!", "fr")).toBe("point d'exclamation");
    expect(spokenLabel("?", "fr")).toBe("point d'interrogation");
    expect(spokenLabel("«", "fr")).toBe("guillemet ouvrant");
  });

  it("ohne Sprachangabe bleibt spokenLabel deutsch - alle Alt-Aufrufer unverändert", () => {
    expect(spokenLabel("é")).not.toBe("e accent aigu");
    expect(spokenLabel("ä")).toBe("a Umlaut");
  });

  it("zeichenName (Tasten erkunden/Tasten finden) nennt Zeichen ebenso französisch", () => {
    expect(zeichenName(".", "fr")).toBe("point");
    expect(zeichenName("œ", "fr")).toBe("e dans l'o");
    expect(zeichenName(".", "de")).toBe("Punkt");
    expect(zeichenName(".", "en")).toBe("full stop");
  });
});

/* ══ Punkt 3: die Ansagen in vorlesen.ts ═════════════════════════════════════ */

describe("Auftrag Punkt 3: die Ansagen auf Französisch", () => {
  it("ANSAGEN.fr trägt dieselben Schlüssel wie de/en, nichts bleibt leer", () => {
    expect(Object.keys(ANSAGEN.fr).sort()).toEqual(Object.keys(ANSAGEN.de).sort());
    for (const [key, satz] of Object.entries(ANSAGEN.fr)) {
      expect(satz.trim(), key).not.toBe("");
    }
  });

  it("jeder Satz ist wirklich NEU geschrieben - kein deutscher oder englischer Satz im französischen Fach", () => {
    for (const key of Object.keys(ANSAGEN.de) as (keyof typeof ANSAGEN.de)[]) {
      expect(ANSAGEN.fr[key], `wie Deutsch: ${key}`).not.toBe(ANSAGEN.de[key]);
      expect(ANSAGEN.fr[key], `wie Englisch: ${key}`).not.toBe(ANSAGEN.en[key]);
    }
  });

  it("keine Umlaute im französischen Fach (die gibt es auf Französisch nicht)", () => {
    for (const [key, satz] of Object.entries(ANSAGEN.fr)) {
      expect(/[äöüß]/.test(satz), `${key}: „${satz}“`).toBe(false);
    }
  });

  it("die Vorlese-Sprache: ansage() folgt setVorleseSprache(\"fr\")", () => {
    expect(vorleseSprache()).toBe("de");
    setVorleseSprache("fr");
    expect(ansage("vorlesenAn")).toBe(ANSAGEN.fr.vorlesenAn);
    expect(ansage("vorlesenAn")).toBe("Lecture à voix haute activée.");
    setVorleseSprache("de");
  });

  it("ansageSchritt/-Tastatur/-Start/-Angemeldet/-Belohnungsspiel: ganze französische Sätze", () => {
    expect(ansageSchritt(2, 5, "Clavier", "fr")).toBe("Étape 2 sur 5. Clavier");
    expect(ansageTastatur("Suisse", "fr")).toBe("Clavier : Suisse.");
    expect(ansageStart("position de départ", "fr")).toBe("Départ : position de départ.");
    expect(ansageAngemeldet("Mira", "fr")).toBe("Connexion en tant que Mira.");
    expect(ansageBelohnungsspiel("Banquise", "fr")).toBe("Jeu de récompense : Banquise.");
  });

  it("ansageAufstieg: beide Tonlagen (sober/nicht) auf Französisch", () => {
    expect(ansageAufstieg(true, "fr")).toBe("Niveau supérieur : palier suivant. ");
    // ★ 26.09.2026 (E11a-5, Feinschliff): „fort" ist männlich - jetzt geschlechtsneutral.
    expect(ansageAufstieg(false, "fr")).toBe("Niveau supérieur ! Tu progresses de plus en plus. ");
  });

  it("ansageNeueAbzeichen: Einzahl, Mehrzahl und der Rest auf Französisch", () => {
    expect(ansageNeueAbzeichen(["Éclair"], 1, true, "fr")).toBe(" Nouveau badge : Éclair.");
    expect(ansageNeueAbzeichen(["Éclair", "Hibou"], 3, false, "fr")).toBe(
      " Nouveaux badges : Éclair, Hibou et 1 de plus!",
    );
  });

  it("ansageWerte und ansageUmschaltSeite auf Französisch", () => {
    expect(ansageWerte("95 %", 120, "fr")).toBe(" Précision 95 %, 120 frappes par minute.");
    expect(ansageUmschaltSeite("É", true, "fr")).toBe(
      "Presque ! É a besoin de la touche Maj de gauche, pas de l'autre et pas de Verr. Maj.",
    );
    expect(ansageUmschaltSeite("É", false, "fr")).toMatch(/Maj de droite/);
  });
});

/* ══ Punkt 4+5: Stimmen und lang-Attribut je Landesvariante ═════════════════ */

describe("Auftrag Punkt 4: sprachTagFuer folgt der Landesvariante", () => {
  it("ohne den Probe-Schalter bleibt es bei fr-FR, unbesehen jeder Wahl", () => {
    franzVarianteMerken("fr-CA");
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=0");
    expect(sprachTagFuer("fr")).toBe("fr-FR");
  });

  it("mit dem Schalter: die gemerkte Landesvariante ist auch der Sprach-Tag", () => {
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=1");
    franzVarianteMerken("fr-CA");
    expect(franzVariante()).toBe("fr-CA");
    expect(sprachTagFuer("fr")).toBe("fr-CA");
    franzVarianteMerken("fr-BE");
    expect(sprachTagFuer("fr")).toBe("fr-BE");
  });

  it("Deutsch und Englisch bleiben von der Landesvariante unberührt", () => {
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=1");
    franzVarianteMerken("fr-CA");
    expect(sprachTagFuer("de")).toBe("de-DE");
    expect(sprachTagFuer("en")).toBe("en-GB");
  });
});

describe("Auftrag Punkt 5: feinesLangAttribut je Landesvariante (lang am Tippfeld/Live-Region)", () => {
  it("ohne den Probe-Schalter: fr bleibt fr-FR (Grundform)", () => {
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=0");
    expect(feinesLangAttribut("fr")).toBe("fr-FR");
  });

  it("mit dem Schalter: dieselbe Landesvariante wie franzVariante()", () => {
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=1");
    franzVarianteMerken("fr-CH");
    expect(feinesLangAttribut("fr")).toBe("fr-CH");
  });

  it("de, en und undefined bleiben unverändert (keine neue Weiche für fr hat sie verändert)", () => {
    expect(feinesLangAttribut("de")).toBe("de");
    expect(feinesLangAttribut(undefined)).toBe(undefined);
  });
});

/* ══ Punkt 4: die Stimmenwahl - eine Stimme der GERADE geltenden Region ═════ */

describe("Auftrag Punkt 4: Stimmenwahl bevorzugt die Landesvariante", () => {
  class FakeUtterance {
    text: string;
    rate = 1;
    pitch = 1;
    volume = 1;
    lang = "";
    voice: SpeechSynthesisVoice | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(text: string) {
      this.text = text;
    }
    addEventListener(): void {}
    removeEventListener(): void {}
  }

  const stimme = (name: string, lang: string, isDefault = false) =>
    ({ name, lang, voiceURI: name, default: isDefault, localService: true }) as SpeechSynthesisVoice;

  let VOICES: SpeechSynthesisVoice[] = [];
  const abgesetzt: FakeUtterance[] = [];
  const fakeSynth = {
    speaking: false,
    pending: false,
    paused: false,
    getVoices: () => VOICES,
    speak(u: FakeUtterance) {
      abgesetzt.push(u);
    },
    cancel() {},
    resume() {},
    pause() {},
    addEventListener() {},
    removeEventListener() {},
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.speechSynthesis = fakeSynth;
  w.SpeechSynthesisUtterance = FakeUtterance;

  it("mit fr-CA gewählt: eine kanadische Stimme, wenn es sie gibt", async () => {
    const { speakSequence, useVoice } = await import("@/lib/typing/voice");
    VOICES = [
      stimme("Thomas", "fr-FR", true),
      stimme("Amélie", "fr-CA"),
    ];
    useVoice.setState({ enabled: true, voiceURI: "" });
    setVorleseSprache("fr");
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=1");
    franzVarianteMerken("fr-CA");
    abgesetzt.length = 0;
    speakSequence(["Bonjour."], "sofort");
    expect(abgesetzt).toHaveLength(1);
    expect(abgesetzt[0].voice?.name).toBe("Amélie");
    setVorleseSprache("de");
  });

  it("mit fr-FR (Grundform): irgendeine französische Stimme, keine Region bevorzugt", async () => {
    const { speakSequence, useVoice } = await import("@/lib/typing/voice");
    VOICES = [stimme("Thomas", "fr-FR", true), stimme("Amélie", "fr-CA")];
    useVoice.setState({ enabled: true, voiceURI: "" });
    setVorleseSprache("fr");
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=0");
    abgesetzt.length = 0;
    speakSequence(["Bonjour."], "sofort");
    expect(abgesetzt).toHaveLength(1);
    expect(abgesetzt[0].voice?.lang.toLowerCase().startsWith("fr")).toBe(true);
    setVorleseSprache("de");
  });

  it("eine gewählte Stimme gilt weiter über die Sprachgrenze hinweg nicht (Befund 29.08.2026)", async () => {
    const { speakUiAlways, useVoice } = await import("@/lib/typing/voice");
    VOICES = [stimme("Thomas", "fr-FR", true), stimme("Anna", "de-DE")];
    useVoice.setState({ enabled: true, voiceURI: "Thomas" });
    setVorleseSprache("de");
    abgesetzt.length = 0;
    speakUiAlways("Geschafft.", undefined, undefined, "sofort");
    expect(abgesetzt).toHaveLength(1);
    expect(abgesetzt[0].voice?.name).not.toBe("Thomas");
    expect(abgesetzt[0].voice?.lang.slice(0, 2)).toBe("de");
  });
});

/* ══ Punkt 6: das Lexikon fürs Vorlesen ══════════════════════════════════════ */

describe("Auftrag Punkt 6: normalizeWord - Akzente und Apostroph nur mit lang=\"fr\"", () => {
  it("ohne lang bleibt es BYTE-IDENTISCH zu vorher - de/en unverändert", () => {
    expect(normalizeWord("Café")).toBe("caf");
    expect(normalizeWord("don't")).toBe("dont");
    // Bindestrich und Ziffern verschwinden weiter - unverändert wie vor E12.
    expect(normalizeWord("Wärme-Insel 3!")).toBe("wärmeinsel");
  });

  it("mit lang=\"fr\" bleiben Akzente UND der Apostroph stehen", () => {
    expect(normalizeWord("Élève", "fr")).toBe("élève");
    expect(normalizeWord("l'école", "fr")).toBe("l'école");
    expect(normalizeWord("garçon", "fr")).toBe("garçon");
    expect(normalizeWord("Où", "fr")).toBe("où");
  });

  it("die alte Falle: [^a-z] hätte é/à/ç verschluckt - jetzt nicht mehr", () => {
    // Vorher (Bauplan §15 Falle 7) wäre "élève" zu "lve" verstümmelt worden.
    expect(normalizeWord("élève", "fr")).not.toBe("lve");
  });
});

describe("Auftrag Punkt 6: das französische Wortfach in isRealWord/lexikonWoerter", () => {
  it("kennt echte französische Wörter mit Akzent als GANZES Wort", () => {
    expect(isRealWord("garçon", "fr")).toBe(true);
    expect(isRealWord("école", "fr")).toBe(true);
    expect(isRealWord("où", "fr")).toBe(true);
  });

  it("fällt NICHT still in den de+en-Rückfalltopf - ein deutsches Wort ist auf fr kein Treffer", () => {
    expect(isRealWord("öl", "de")).toBe(true);
    expect(isRealWord("öl", "fr")).toBe(false);
  });

  it("lexikonGroesse kennt jetzt ein eigenes fr-Fach, beide bleibt de+en", () => {
    const g = lexikonGroesse();
    expect(g.fr).toBeGreaterThan(1000);
    // „beide" ist weiterhin NUR der deutsch-englische Rückfalltopf (Bauplan
    // §15: „fr" bekommt sein eigenes Fach, nicht den beide-Rückfall) - ein
    // rein französisches Wort taucht darum in „beide" nicht als Treffer auf.
    expect(isRealWord("garçon")).toBe(false);
  });

  it("lexikonWoerter(\"fr\") liefert französische Wörter, keine deutschen/englischen", () => {
    const woerter = lexikonWoerter("fr");
    expect(woerter.length).toBeGreaterThan(1000);
    expect(woerter).toContain("garçon");
    expect(woerter).not.toContain("hello");
  });
});

// ★ E9a (26.09.2026, Rückmeldung Défi-Auftrag E13b-2): der Bindestrich beim
// VORLESEN - bisher zerfiel "peut-être" beim Normalisieren in "peutre" (kein
// Lexikon-Treffer, IMMER buchstabiert), obwohl "peut" und "être" je für sich
// längst bekannte Wörter sind.
describe("E9a: der Bindestrich bleibt beim Normalisieren für „fr\" stehen", () => {
  it("normalizeWord(_, \"fr\") wirft den Bindestrich nicht mehr weg", () => {
    expect(normalizeWord("peut-être", "fr")).toBe("peut-être");
    expect(normalizeWord("Est-ce", "fr")).toBe("est-ce");
    expect(normalizeWord("qu'est-ce-que", "fr")).toBe("qu'est-ce-que");
  });

  it("de/en bleiben BYTE-IDENTISCH - der Bindestrich verschwindet dort weiterhin", () => {
    expect(normalizeWord("Wärme-Insel")).toBe("wärmeinsel");
    expect(normalizeWord("check-in", "en")).toBe("checkin");
  });

  it("isRealWord: „peut-être\" & Co. sind jetzt ganze Wörter, kein Buchstabieren mehr", () => {
    for (const wort of ["peut-être", "est-ce", "grand-père", "grand-mère", "arc-en-ciel"]) {
      expect(isRealWord(wort, "fr"), wort).toBe(true);
    }
  });

  it("Gegenprobe: vor der Ergänzung wäre die zerlegte Form „peutre\" kein eigener Treffer gewesen", () => {
    // „peutre" selbst ist KEIN französisches Wort - nur die alte, fehlerhafte
    // Normalisierung hätte es erzeugt. Dieser Test hält fest, wonach das
    // Lexikon NICHT sucht, damit ein künftiger Rückbau des Bindestrichs auffällt.
    expect(isRealWord("peutre", "fr")).toBe(false);
  });
});

// ★ Chat-Abnahme E12 (26.09.): jedes Zeichen, das eine französische Tastatur
// ohne AltGr liefert, hat einen französischen Namen - kein nacktes Zeichen.
import { spokenLabel as nameFuerAbnahme } from "../src/lib/typing/fingers";
describe("Abnahme E12 - kein Zeichen ohne französischen Namen", () => {
  it.each(Array.from("\"()#&%_<>€µ²*œ'.,;:!?-"))("%s hat einen Namen", (z) => {
    const n = nameFuerAbnahme(z, "fr");
    expect(n).not.toBe(z);
    expect(n.length).toBeGreaterThan(1);
  });
  it("œ heisst e dans l'o, * heisst astérisque", () => {
    expect(nameFuerAbnahme("œ", "fr")).toBe("e dans l'o");
    expect(nameFuerAbnahme("*", "fr")).toBe("astérisque");
  });
});
