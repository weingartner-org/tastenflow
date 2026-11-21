/**
 * ★★★★★ ES-F8 (27.09.2026, Bauplan spanischer Lehrgang §4.4/§7, allgemeiner
 * Bauplan P4 F8): DER WÄCHTER ZU DIESER ETAPPE - je Auftragspunkt ein
 * Abschnitt. Vorbild: `tests/tastenflow-e12-sprachausgabe-franzoesisch.test.ts`
 * (dieselbe Etappe für Französisch).
 *
 * ⚠️ Was hier BEWUSST NICHT geprüft wird: die harten Paare ¿/¡ in `fitText`
 * und die Tastaturen selbst - die haben ihren eigenen Wächter aus ES-F3/F4
 * (`tests/tastenflow-lernweg-es-tastaturen.test.ts`).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { fingerGuideEs, spokenLabel } from "@/lib/typing/fingers";
import {
  ANSAGEN,
  ansage,
  ansageAngemeldet,
  ansageAufgabenstand,
  ansageAufstieg,
  ansageBelohnungsspiel,
  ansageNeueAbzeichen,
  ansageSchritt,
  ansageStart,
  ansageTastatur,
  ansageUmschaltSeite,
  ansageWerte,
  ansageZeilenstand,
  setVorleseSprache,
  sprachTagFuer,
  vorleseSprache,
} from "@/lib/typing/vorlesen";
import { readPlanAt } from "@/lib/typing/voice";
import {
  isRealWord,
  lexikonGroesse,
  lexikonWoerter,
  normalizeWord,
} from "@/lib/typing/lexicon";
import {
  bestimmeEsVariante,
  erkenneEsVarianteAusLayout,
  erkenneEsVarianteAusSprachen,
  esVariante,
  esVarianteMerken,
} from "@/lib/typing/esVariante";
import { vorschlagLayout } from "@/lib/typing/layouts";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

/* ══ Punkt 1: die Zeichennamen ═══════════════════════════════════════════ */

describe("Auftrag Punkt 1: die Zeichennamen - kein Zeichen ohne spanischen Namen", () => {
  it.each(Array.from("¿?¡!´¨.,;:\"-()'"))("%s hat einen Namen (kein nacktes Zeichen)", (z) => {
    const n = spokenLabel(z, "es");
    expect(n).not.toBe(z);
    expect(n.length).toBeGreaterThan(1);
  });

  it("¿/¡ tragen den Bauplan-Wortlaut (§4.4 Punkt 3)", () => {
    expect(spokenLabel("¿", "es")).toBe("signo de apertura de interrogación");
    expect(spokenLabel("?", "es")).toBe("signo de cierre de interrogación");
    expect(spokenLabel("¡", "es")).toBe("signo de apertura de exclamación");
    expect(spokenLabel("!", "es")).toBe("signo de cierre de exclamación");
  });

  it("ñ heisst eñe, Ñ heisst mayúscula eñe - ñ bleibt ein EIGENER Buchstabe", () => {
    expect(spokenLabel("ñ", "es")).toBe("eñe");
    expect(spokenLabel("Ñ", "es")).toBe("mayúscula eñe");
  });

  it("die Totasten heissen tilde/diéresis, die Akzentbuchstaben ausgeschrieben", () => {
    expect(spokenLabel("´", "es")).toBe("tilde");
    expect(spokenLabel("¨", "es")).toBe("diéresis");
    expect(spokenLabel("á", "es")).toBe("a con tilde");
    expect(spokenLabel("é", "es")).toBe("e con tilde");
    expect(spokenLabel("í", "es")).toBe("i con tilde");
    expect(spokenLabel("ó", "es")).toBe("o con tilde");
    expect(spokenLabel("ú", "es")).toBe("u con tilde");
    expect(spokenLabel("ü", "es")).toBe("u con diéresis");
    expect(spokenLabel("Á", "es")).toBe("mayúscula a con tilde");
  });

  it("Satzzeichen ohne AltGr auf Spanisch (punto, coma, guion, comillas, paréntesis, apóstrofo)", () => {
    expect(spokenLabel(".", "es")).toBe("punto");
    expect(spokenLabel(",", "es")).toBe("coma");
    expect(spokenLabel("-", "es")).toBe("guion");
    expect(spokenLabel(":", "es")).toBe("dos puntos");
    expect(spokenLabel(";", "es")).toBe("punto y coma");
    expect(spokenLabel('"', "es")).toBe("comillas");
    expect(spokenLabel("(", "es")).toBe("paréntesis de apertura");
    expect(spokenLabel(")", "es")).toBe("paréntesis de cierre");
    expect(spokenLabel("'", "es")).toBe("apóstrofo");
  });

  it("Leertaste und Intro (Bauplan §7 Glossar)", () => {
    expect(spokenLabel(" ", "es")).toBe("espacio");
    expect(spokenLabel("\n", "es")).toBe("intro");
  });

  it("ohne Sprachangabe bleibt spokenLabel deutsch - alle Alt-Aufrufer unverändert", () => {
    expect(spokenLabel("¿")).not.toBe("signo de apertura de interrogación");
    expect(spokenLabel("ä")).toBe("a Umlaut");
  });

  it("★ ES-O: auch die generischen Sonderzeichen (@ # &) haben spanische Namen - kein englischer Rückfall mehr", () => {
    // Bis ES-O stand hier die dokumentierte Etappen-Grenze (englische Namen).
    expect(spokenLabel("@", "es")).toBe("arroba");
    expect(spokenLabel("#", "es")).toBe("numeral");
    expect(spokenLabel("&", "es")).toBe("y comercial");
    for (const z of ["@", "#", "&", "%", "*", "/", "=", "+", "_", "<", ">", "$"]) {
      expect(spokenLabel(z, "es"), z).not.toBe(spokenLabel(z, "en"));
    }
    // ★ S3 (28.09.2026): „€" heisst seither auch auf Englisch „euro" - dasselbe
    // Wort in beiden Sprachen, kein Rückfall. Darum ausdrücklich statt im Vergleich.
    expect(spokenLabel("€", "es")).toBe("euro");
  });

  // ★★★★★ ES-P7a-Behebung (27.09.2026, S2, Prüfbericht Fundament es): diese
  // acht Zeichen waren „ohne Namen" (nacktes Zeichen statt einer Ansage,
  // gemessen e7: % & < > _ · º ª ç auf „es", zusätzlich # auf „latam") -
  // JETZT mit echtem spanischen Namen, keine Lücke mehr.
  it("S2: % & < > _ · º ª ç # haben jetzt einen spanischen Namen (vorher: nacktes Zeichen)", () => {
    expect(spokenLabel("%", "es")).toBe("por ciento");
    expect(spokenLabel("&", "es")).toBe("y comercial");
    expect(spokenLabel("<", "es")).toBe("menor que");
    expect(spokenLabel(">", "es")).toBe("mayor que");
    expect(spokenLabel("_", "es")).toBe("guion bajo");
    expect(spokenLabel("·", "es")).toBe("punto medio");
    expect(spokenLabel("º", "es")).toBe("ordinal masculino");
    expect(spokenLabel("ª", "es")).toBe("ordinal femenino");
    expect(spokenLabel("ç", "es")).toBe("ce cedilla");
    expect(spokenLabel("#", "es")).toBe("numeral");
  });

  // ★★★★★ S2: JEDER Grossbuchstabe bekommt „mayúscula …" - vorher galt das
  // nur für Zeichen mit einem eigenen SPOKEN_ES-Eintrag (á é í ó ú ü ñ), ein
  // gewöhnliches „Q" fiel mangels Eintrag ganz auf Englisch zurück
  // ("capital Q", gemessen e7: jeder Grossbuchstabe ohne AltGr betroffen).
  it("S2: jeder Grossbuchstabe ohne eigenen Eintrag bekommt trotzdem „mayúscula …“, nicht „capital …“", () => {
    for (const c of ["Q", "W", "K", "X"]) {
      expect(spokenLabel(c, "es")).toBe(`mayúscula ${c.toLowerCase()}`);
    }
  });
});

/* ══ Punkt 2: die Ansagen und die Finger-Ansage ═══════════════════════════ */

describe("Auftrag Punkt 2: die Ansagen auf Spanisch", () => {
  it("ANSAGEN.es trägt dieselben Schlüssel wie de/en/fr, nichts bleibt leer", () => {
    expect(Object.keys(ANSAGEN.es).sort()).toEqual(Object.keys(ANSAGEN.de).sort());
    for (const [key, satz] of Object.entries(ANSAGEN.es)) {
      expect(satz.trim(), key).not.toBe("");
    }
  });

  it("jeder Satz ist wirklich NEU geschrieben - kein deutscher/englischer/französischer Satz im spanischen Fach", () => {
    for (const key of Object.keys(ANSAGEN.de) as (keyof typeof ANSAGEN.de)[]) {
      expect(ANSAGEN.es[key], `wie Deutsch: ${key}`).not.toBe(ANSAGEN.de[key]);
      expect(ANSAGEN.es[key], `wie Englisch: ${key}`).not.toBe(ANSAGEN.en[key]);
      expect(ANSAGEN.es[key], `wie Französisch: ${key}`).not.toBe(ANSAGEN.fr[key]);
    }
  });

  it("keine deutschen Umlaute im spanischen Fach", () => {
    for (const [key, satz] of Object.entries(ANSAGEN.es)) {
      expect(/[äöüß]/.test(satz), `${key}: „${satz}“`).toBe(false);
    }
  });

  it("die Vorlese-Sprache: ansage() folgt setVorleseSprache(\"es\")", () => {
    expect(vorleseSprache()).toBe("de");
    setVorleseSprache("es");
    expect(ansage("vorlesenAn")).toBe(ANSAGEN.es.vorlesenAn);
    expect(ansage("vorlesenAn")).toBe("Lectura en voz alta activada.");
    setVorleseSprache("de");
  });

  it("ansageSchritt/-Tastatur/-Start/-Angemeldet/-Belohnungsspiel: ganze spanische Sätze", () => {
    expect(ansageSchritt(2, 5, "Teclado", "es")).toBe("Paso 2 de 5. Teclado");
    expect(ansageTastatur("España", "es")).toBe("Teclado: España.");
    expect(ansageStart("posición de partida", "es")).toBe("Punto de partida: posición de partida.");
    expect(ansageAngemeldet("Mira", "es")).toBe("Sesión iniciada como Mira.");
    expect(ansageBelohnungsspiel("Banquisa", "es")).toBe("Juego de recompensa: Banquisa.");
  });

  it("ansageAufstieg: beide Tonlagen (sober/nicht) auf Spanisch", () => {
    expect(ansageAufstieg(true, "es")).toBe("Subida de nivel: siguiente nivel de práctica. ");
    expect(ansageAufstieg(false, "es")).toBe("¡Subida de nivel! Cada vez lo haces mejor. ");
  });

  it("ansageNeueAbzeichen: insignia (Glossar), Einzahl/Mehrzahl", () => {
    expect(ansageNeueAbzeichen(["Rayo"], 1, true, "es")).toBe(" Nueva insignia: Rayo.");
    expect(ansageNeueAbzeichen(["Rayo", "Búho"], 3, false, "es")).toBe(
      " Nuevas insignias: Rayo, Búho y 1 más!",
    );
  });

  it("ansageWerte: pulsaciones por minuto ausgeschrieben (Bauplan §7 - ppm doppeldeutig)", () => {
    expect(ansageWerte("95 %", 120, "es")).toBe(" Precisión 95 %, 120 pulsaciones por minuto.");
  });

  it("ansageUmschaltSeite: Mayús izquierda/derecha, Bloq Mayús", () => {
    expect(ansageUmschaltSeite("Á", true, "es")).toBe(
      "¡Casi! Á necesita la tecla Mayús izquierda, no la otra ni Bloq Mayús.",
    );
    expect(ansageUmschaltSeite("Á", false, "es")).toMatch(/Mayús derecha/);
  });

  it("ansageZeilenstand/ansageAufgabenstand: línea(s)/ejercicio(s), Komma statt Ordnungszahl-Punkt", () => {
    expect(ansageZeilenstand(3, 12, "es")).toBe("Línea 3 de 12, quedan 9 líneas.");
    expect(ansageZeilenstand(11, 12, "es")).toBe("Línea 11 de 12, queda 1 línea.");
    expect(ansageZeilenstand(12, 12, "es")).toBe("Línea 12 de 12, última línea.");
    expect(ansageAufgabenstand(1, 3, "es")).toBe("Ejercicio 1 de 3, quedan 2 ejercicios.");
  });

  it("fingerGuideEs: pulgar/meñique derecho, tú-Anrede-taugliche Sprache (keine Höflichkeitsform)", () => {
    expect(fingerGuideEs(" ", false, "de")).toBe("Barra espaciadora con el pulgar.");
    expect(fingerGuideEs("\n", false, "de")).toBe("Intro con el meñique derecho.");
  });
});

/* ══ Punkt 3: die spanische Landesvariante und die Stimmen ══════════════════ */

describe("Auftrag Punkt 3: esVariante() - es-ES/es-419", () => {
  it("ohne den Probe-Schalter bleibt es UNBEDINGT bei es-ES", () => {
    esVarianteMerken("es-419");
    window.history.replaceState(null, "", "/?spanisch-lehrgang=0");
    expect(esVariante()).toBe("es-ES");
    expect(sprachTagFuer("es")).toBe("es-ES");
  });

  it("mit dem Schalter: die gemerkte Variante gilt, und ist auch der Sprach-Tag", () => {
    window.history.replaceState(null, "", "/?spanisch-lehrgang=1");
    esVarianteMerken("es-419");
    expect(esVariante()).toBe("es-419");
    expect(sprachTagFuer("es")).toBe("es-419");
  });

  it("erkenneEsVarianteAusSprachen: es-ES bleibt Grundform, jedes Länderkürzel ausser -ES ist Lateinamerika", () => {
    expect(erkenneEsVarianteAusSprachen(["es-ES", "en"])).toBe("es-ES");
    expect(erkenneEsVarianteAusSprachen(["es-MX"])).toBe("es-419");
    expect(erkenneEsVarianteAusSprachen(["es-419"])).toBe("es-419");
    expect(erkenneEsVarianteAusSprachen(["de-DE"])).toBe("es-ES");
    expect(erkenneEsVarianteAusSprachen([])).toBe("es-ES");
    // Blosses „es" ist Spanien (Bauplan S2) - Gegenprobe: „es-AR" bleibt Lateinamerika.
    expect(erkenneEsVarianteAusSprachen(["es", "en"])).toBe("es-ES");
    expect(erkenneEsVarianteAusSprachen(["es_ES"])).toBe("es-ES");
    expect(erkenneEsVarianteAusSprachen(["es-AR", "es"])).toBe("es-419");
    expect(vorschlagLayout("es", ["es"])).toBe("es");
    expect(vorschlagLayout("es", ["es-CO"])).toBe("latam");
  });

  it("erkenneEsVarianteAusLayout: Tastatur latam/es entscheidet vor dem Browser", () => {
    expect(erkenneEsVarianteAusLayout("latam")).toBe("es-419");
    expect(erkenneEsVarianteAusLayout("es")).toBe("es-ES");
    expect(erkenneEsVarianteAusLayout("de")).toBeNull();
  });

  it("bestimmeEsVariante: gespeichert > Klasse > Tastatur > Browser", () => {
    expect(
      bestimmeEsVariante({ gespeichert: "es-419", klassenVorgabe: "es-ES", sprachen: ["es-ES"] }),
    ).toBe("es-419");
    expect(
      bestimmeEsVariante({ gespeichert: null, klassenVorgabe: "es-419", sprachen: ["es-ES"] }),
    ).toBe("es-419");
    expect(
      bestimmeEsVariante({ gespeichert: null, layout: "latam", sprachen: ["es-ES"] }),
    ).toBe("es-419");
    expect(bestimmeEsVariante({ gespeichert: null, sprachen: ["es-AR"] })).toBe("es-419");
  });

  it("Deutsch/Englisch/Französisch bleiben von der spanischen Variante unberührt", () => {
    window.history.replaceState(null, "", "/?spanisch-lehrgang=1");
    esVarianteMerken("es-419");
    expect(sprachTagFuer("de")).toBe("de-DE");
    expect(sprachTagFuer("en")).toBe("en-GB");
  });
});

describe("Auftrag Punkt 3: die Stimmenwahl bevorzugt die geltende esVariante", () => {
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

  it("mit es-419 gewählt: eine mexikanische/lateinamerikanische Stimme, wenn es sie gibt", async () => {
    const { speakSequence, useVoice } = await import("@/lib/typing/voice");
    VOICES = [stimme("Mónica", "es-ES", true), stimme("Paulina", "es-MX")];
    useVoice.setState({ enabled: true, voiceURI: "" });
    setVorleseSprache("es");
    window.history.replaceState(null, "", "/?spanisch-lehrgang=1");
    esVarianteMerken("es-419");
    abgesetzt.length = 0;
    speakSequence(["Hola."], "sofort");
    expect(abgesetzt).toHaveLength(1);
    expect(abgesetzt[0].voice?.name).toBe("Paulina");
    setVorleseSprache("de");
  });

  it("mit es-ES (Grundform): irgendeine spanische Stimme, keine Region bevorzugt", async () => {
    const { speakSequence, useVoice } = await import("@/lib/typing/voice");
    VOICES = [stimme("Mónica", "es-ES", true), stimme("Paulina", "es-MX")];
    useVoice.setState({ enabled: true, voiceURI: "" });
    setVorleseSprache("es");
    window.history.replaceState(null, "", "/?spanisch-lehrgang=0");
    abgesetzt.length = 0;
    speakSequence(["Hola."], "sofort");
    expect(abgesetzt).toHaveLength(1);
    expect(abgesetzt[0].voice?.lang.toLowerCase().startsWith("es")).toBe(true);
    setVorleseSprache("de");
  });

  it("eine Stimme fuer Zeilenansage UND Rueckmeldung - dieselbe Stimme, keine Doppelansage (W14)", async () => {
    const { speakSequence, speakUiAlways, useVoice } = await import("@/lib/typing/voice");
    VOICES = [stimme("Helena", "es-ES", true)];
    useVoice.setState({ enabled: true, voiceURI: "" });
    setVorleseSprache("es");
    window.history.replaceState(null, "", "/?spanisch-lehrgang=0");
    abgesetzt.length = 0;
    speakSequence(["Hola."], "sofort");
    speakUiAlways("Bien hecho.", undefined, "es", "sofort");
    expect(abgesetzt).toHaveLength(2);
    expect(abgesetzt[0].voice?.name).toBe(abgesetzt[1].voice?.name);
    setVorleseSprache("de");
  });
});

/* ══ Punkt 4: das Lexikon fürs Vorlesen ══════════════════════════════════════ */

describe("Auftrag Punkt 4/5: normalizeWord - ñ und Akzente bleiben, ñ wird NICHT zu n", () => {
  it("ohne lang bleibt es BYTE-IDENTISCH zu vorher - de/en/fr unverändert", () => {
    expect(normalizeWord("Café")).toBe("caf");
    expect(normalizeWord("don't")).toBe("dont");
  });

  it("mit lang=\"es\" bleiben ñ und Akzente stehen", () => {
    expect(normalizeWord("Año", "es")).toBe("año");
    expect(normalizeWord("MAÑANA", "es")).toBe("mañana");
    expect(normalizeWord("qué", "es")).toBe("qué");
    expect(normalizeWord("está", "es")).toBe("está");
  });

  it("die alte Falle: [^a-z] hätte ñ/á/é verschluckt - jetzt nicht mehr", () => {
    expect(normalizeWord("año", "es")).not.toBe("ao");
    expect(normalizeWord("está", "es")).not.toBe("est");
  });
});

describe("Auftrag Punkt 4: das spanische Wortfach in isRealWord/lexikonWoerter/lexikonGroesse", () => {
  it("kennt echte spanische Wörter mit ñ/Akzent als GANZES Wort", () => {
    expect(isRealWord("año", "es")).toBe(true);
    expect(isRealWord("mañana", "es")).toBe(true);
    expect(isRealWord("está", "es")).toBe(true);
    expect(isRealWord("qué", "es")).toBe(true);
  });

  it("fällt NICHT still in den de+en-Rückfalltopf - ein deutsches Wort ist auf es kein Treffer", () => {
    expect(isRealWord("öl", "de")).toBe(true);
    expect(isRealWord("öl", "es")).toBe(false);
  });

  it("ein französisches Wort ist auf es ebensowenig ein Treffer (eigenes Fach, kein Rückfall)", () => {
    expect(isRealWord("garçon", "fr")).toBe(true);
    expect(isRealWord("garçon", "es")).toBe(false);
  });

  it("lexikonGroesse kennt jetzt ein eigenes es-Fach", () => {
    const g = lexikonGroesse();
    expect(g.es).toBeGreaterThan(1000);
    expect(isRealWord("año")).toBe(false); // "beide" bleibt nur de+en
  });

  it("lexikonWoerter(\"es\") liefert spanische Wörter, keine deutschen/englischen/französischen", () => {
    const woerter = lexikonWoerter("es");
    expect(woerter.length).toBeGreaterThan(1000);
    expect(woerter).toContain("año");
    expect(woerter).not.toContain("hello");
    expect(woerter).not.toContain("garçon");
  });
});

/* ══ Punkt 5: das "M2"-Verhalten - ein Wort mit Akzent wird GANZ gesprochen ══ */

describe("Auftrag Punkt 5: readPlanAt - Akzentwörter werden GANZ gesprochen, nicht buchstabiert", () => {
  const isWord = (t: string) => isRealWord(t, "es");

  it("ein Wort mit Akzent AM ANFANG: das ganze Wort, keine Zeichennamen-Ansage", () => {
    const plan = readPlanAt(
      "está aquí",
      0,
      { letters: true, words: true, sentences: false, lang: "es" },
      isWord,
    );
    expect(plan).toContain("está");
    expect(plan.join(" ")).not.toMatch(/con tilde/);
  });

  it("ein Wort mit Akzent IN DER MITTE: der Akzentbuchstabe zählt als Buchstabe (isAlpha), keine Satzzeichen-Ansage", () => {
    // Index 2 = "á" in "está".
    const plan = readPlanAt(
      "está aquí",
      2,
      { letters: true, words: false, sentences: false, lang: "es" },
      isWord,
    );
    expect(plan.join(" ")).not.toMatch(/a con tilde/);
  });

  it("Gegenprobe ohne lang=\"es\" (Deutsch): dieselbe Stelle würde weiterhin als Satzzeichen benannt", () => {
    const plan = readPlanAt(
      "está aquí",
      2,
      { letters: true, words: false, sentences: false, lang: "de" },
      () => false,
    );
    // Auf Deutsch ist "á" kein Buchstabe (BUCHSTABE_ODER_ZIFFER.de kennt ihn
    // nicht) - die Stelle bekommt den blossen Zeichennamen, nicht das Wort.
    expect(plan.join(" ")).not.toBe("está");
  });
});

/* ══ M5 (ES-P7a-Behebung, 27.09.2026, Prüfbericht Fundament es) ══ */

describe("★★★★★ M5: das Wort NACH ¿ ¡ \" wird GANZ gesprochen, nicht buchstabiert oder übersprungen", () => {
  const isWord = (t: string) => isRealWord(t, "es");
  const m = { letters: false, words: true, sentences: false, lang: "es" as const };

  it('"¿Qué hora es?" - an "Q" (Index 1) kommt das ganze Wort "Qué", nicht nur der Buchstabe', () => {
    const plan = readPlanAt("¿Qué hora es?", 1, m, isWord);
    expect(plan).toEqual(["Qué"]);
  });

  it('"¿Qué hora es?" - an "¿" selbst weiterhin nur der Zeichenname (unverändert)', () => {
    const plan = readPlanAt("¿Qué hora es?", 0, m, isWord);
    expect(plan.join(" ")).toMatch(/apertura de interrogación/);
    expect(plan).not.toContain("Qué");
  });

  it('"Él pregunta: ¿dónde está?" - "¿" MITTEN in der Zeile: an "d" das ganze Wort "dónde"', () => {
    const plan = readPlanAt("Él pregunta: ¿dónde está?", 14, m, isWord);
    expect(plan).toEqual(["dónde"]);
  });

  it('"¡Qué día más bonito!" - dasselbe für das öffnende Ausrufezeichen', () => {
    const plan = readPlanAt("¡Qué día más bonito!", 1, m, isWord);
    expect(plan).toEqual(["Qué"]);
  });

  it('Anführungszeichen: "Ñandú" es un ave - an "Ñ" (Index 1) das ganze Wort ohne die Anführungszeichen', () => {
    const plan = readPlanAt('"Ñandú" es un ave.', 1, m, isWord);
    // ★ ES-M2 (27.09.2026, Prüfbericht ES-P2 S2): seither auch OHNE das
    // schliessende Anführungszeichen, wie der Titel es sagt (bis dahin „Ñandú"").
    expect(plan).toEqual(["Ñandú"]);
  });

  it('mitten im Wort nach ¿ bleibt es beim gewöhnlichen Verhalten (kein Wort, nur ggf. Buchstabe)', () => {
    const mitBuchstaben = { ...m, letters: true };
    const plan = readPlanAt("¿Qué hora es?", 2, mitBuchstaben, isWord); // "u" von "Qué"
    expect(plan).not.toContain("Qué");
  });

  it("de/en/fr unverändert: dieselbe Stelle mit lang \"de\" verschiebt den Wortanfang NICHT", () => {
    // Kein „¿"/„¡" auf de/en/fr - nur „\"" könnte betroffen sein, und genau
    // dafür bleibt die Erweiterung ausdrücklich auf „es" beschränkt (offene
    // Frage an Johannes, Prüfbericht M5 - siehe Befund).
    const plan = readPlanAt('"Hallo" sagte sie', 1, { ...m, lang: "de" }, () => true);
    expect(plan).not.toEqual(["Hallo\""]);
  });
});
