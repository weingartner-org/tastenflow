/**
 * Der Wächter-Aufbau der TÜRKISCHEN Serien (TR-S, 09.10.2026), einmal geschrieben und von den drei Wächtern
 * `tastenflow-serien-tr-{kids,teens,erwachsen}-1.test.ts` mit ihren gemessenen Zahlen aufgerufen. Aufbau wie die IT-S-Wächter
 * (Form · eingehängt · Tastaturen und Öffnung · Grosswörter auch gekürzt · Wortschatz · Kopien · Regionen), Regeln aus
 * `trSerienRegeln.ts`. Jede Regel hat eine Gegenprobe - ein Wächter, der nie anschlägt, beweist nichts.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../../src/lib/typing/layouts";
import { SERIEN } from "../../src/lib/typing/serien";
import { SERIEN_TR } from "../../src/lib/typing/serienTr";
import { SERIEN_TR_KIDS_1 } from "../../src/lib/typing/serienTrKids1";
import { SERIEN_TR_TEENS_1 } from "../../src/lib/typing/serienTrTeens1";
import { SERIEN_TR_ERWACHSEN_1 } from "../../src/lib/typing/serienTrErwachsen1";
import { computeSerieMinTier, validateSerie, type Serie } from "../../src/lib/typing/serie";
import { bausteinId } from "../../src/lib/typing/ledger";
import { KORPUS_ANKER } from "../../src/lib/typing/corpusAnker";
import { fitText } from "../../src/lib/typing/corpus";
import type { SerieEntwurfTr } from "../../src/lib/typing/serienTrTyp";
import * as R from "./trSerienRegeln";

export interface TrSerienAuftrag {
  name: string;
  charge: SerieEntwurfTr[];
  stufe: "kids" | "teens" | "erwachsen";
  vorsilbe: string;
  /** Gemessen beim Bau - gleich den italienischen Vorbildern (Kinder 616, Jugend 613, Erwachsene 615). */
  zeilen: number;
  minZeilenJeEtappe: number;
  maxZeilenJeEtappe: number;
  /** Einheit auf `tr-q`, ab der jede Zeile der Serie (gekürzt) serviert wird - gemessen. */
  oeffnet: Record<string, string>;
}

const ALLE_CHARGEN = [...SERIEN_TR_KIDS_1, ...SERIEN_TR_TEENS_1, ...SERIEN_TR_ERWACHSEN_1];

export function trSerienWaechter(a: TrSerienAuftrag): void {
  const CH = a.charge;
  const ZEILEN = CH.flatMap(R.zeilenVon);
  const SLUGS = new Set(CH.map((s) => s.slug));
  const NAMEN = new Set(CH.flatMap((s) => [...R.namenVon(s)]));

  afterEach(() => setLayout("de"));

  describe(`${a.name} · 1 · Form jeder Zeile, jeder Etappe, jeder Serie`, () => {
    it("jede Zeile besteht die Form-Regeln und die Regeln aller tr-Zeilen", () => {
      const fehler = ZEILEN.flatMap((z) => R.formFehler(z).map((f) => `${f}: ${z}`));
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it(`20 Serien, ${a.zeilen} Zeilen, eine mit drei Etappen, ${a.minZeilenJeEtappe}-${a.maxZeilenJeEtappe} Zeilen je Etappe, jede endet auf ? oder !`, () => {
      expect(CH.length).toBe(20);
      expect(ZEILEN.length).toBe(a.zeilen);
      expect(CH.filter((s) => s.etappen.length === 3).length).toBe(1);
      const fehler = CH.flatMap((s) => R.serienFormFehler(s, a.stufe, a.minZeilenJeEtappe, a.maxZeilenJeEtappe));
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it(`Slugs eindeutig mit Vorsilbe ${a.vorsilbe}`, () => {
      expect(CH.filter((s) => !s.slug.startsWith(a.vorsilbe)).map((s) => s.slug)).toEqual([]);
      expect(SLUGS.size).toBe(CH.length);
      expect(new Set(ALLE_CHARGEN.map((s) => s.slug)).size).toBe(ALLE_CHARGEN.length);
    });

    it.each([
      ["Kedi uyuyor.", "2 Wörter"],
      ["kedi koltukta uyuyor bugün.", "kein Grossbuchstabe am Anfang"],
      ["Kedi koltukta mışıl mışıl uyuyor", "kein Satzschluss am Ende"],
      ["Kedi koltukta uyuyor. Sonra uyanıyor.", "mehr als ein Satz"],
      ["\"Gel!\" Elif bağırıyor bahçeden.", "mehr als ein Satz"],
      ["Kedi koltukta uyuyor,bütün gün.", "kein Leerzeichen nach , ; :"],
      ["Kedi 3 saat koltukta uyuyor.", "Zeichen ausserhalb von Buchstaben und . , ; : ? ! \" '"],
      ["Kedi koltukta uyuyor - sonra uyanıyor.", "Zeichen ausserhalb von Buchstaben und . , ; : ? ! \" '"],
      ["Kedi \"miyav diyor koltukta.", "Anführungszeichen ungerade"],
      ["Kedi koltukta tatlı tatlı uyuyor ve rüyasında uzun bir bahçede kelebekleri kovalıyor ama hiç birini yakalayamıyor bugün.", "17 Wörter"],
    ])("Gegenprobe Zeile rot: %s", (zeile, erwartet) => {
      expect(R.formFehler(zeile)).toContain(erwartet);
    });

    it("Gegenprobe: Regeln aller tr-Zeilen (Iki statt İki, Ankara'da gegen ankara'da, Anrede, Maus) schlagen an; gute Zeilen grün", () => {
      expect(R.formFehler("Iki kedi bahçede oynuyor.").some((f) => f.includes("„I“"))).toBe(true);
      expect(R.formFehler("Bugün okul'da kimse yok.").some((f) => f.includes("Apostroph"))).toBe(true);
      expect(R.formFehler("Ayşe Hanım çay demliyor.").some((f) => f.includes("Anrede"))).toBe(true);
      expect(R.formFehler("Fareyle düğmeye tıkla lütfen.").some((f) => f.includes("Maus"))).toBe(true);
      for (const z of ['"Bak, martılar geliyor!" diye bağırıyor Elif.', "Ankara'da kar yağıyor mu?", "Hâlâ bekliyoruz: tren gecikti."]) {
        expect(R.formFehler(z), z).toEqual([]);
      }
    });
  });

  describe(`${a.name} · 2 · eingehängt: validateSerie, minTier gerechnet, nur Weg tr`, () => {
    it("jede Serie besteht validateSerie(s, \"tr\") und trägt ihr gerechnetes minTier", () => {
      const fehler: string[] = [];
      for (const s of CH) {
        const serie = s as unknown as Serie;
        const { ok, problems } = validateSerie(serie, "tr");
        if (!ok) fehler.push(`${s.slug}: ${problems.join("; ")}`);
        if (s.minTier === undefined || computeSerieMinTier(serie, "tr") !== s.minTier) fehler.push(`${s.slug}: minTier`);
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it("jede Serie steht genau einmal in SERIEN_TR und in SERIEN, keine unter einer anderen Sprache", () => {
      for (const s of CH) {
        expect(SERIEN_TR.filter((t) => t.slug === s.slug).length, s.slug).toBe(1);
        expect(SERIEN.filter((t) => t.slug === s.slug).length, s.slug).toBe(1);
      }
      expect(SERIEN.filter((s) => s.lang !== "tr" && SLUGS.has(s.slug))).toEqual([]);
      expect(SERIEN.filter((s) => SLUGS.has(s.slug)).every((s) => s.lang === "tr" && s.nurWeg === "tr")).toBe(true);
    });

    it("Serien tragen keine Korpus-Anker-ID (der Anker liest nur den Korpus)", () => {
      const anker = new Set(KORPUS_ANKER);
      expect(ZEILEN.filter((z) => anker.has(bausteinId("satz", z)))).toEqual([]);
    });

    it("Gegenprobe: ein falsch eingetragenes minTier wird abgelehnt", () => {
      const s = CH[0] as unknown as Serie;
      const falsch = { ...s, minTier: (((s.minTier as number) + 1) % 6) as Serie["minTier"] };
      expect(validateSerie(falsch, "tr").problems.some((p) => p.includes("minTier"))).toBe(true);
    });
  });

  describe(`${a.name} · 3 · jedes Zeichen hat einen Griff, jede Zeile wird serviert, Öffnung gemessen`, () => {
    it("jedes Zeichen ist auf jeder türkischen Tastatur greifbar (tr-q und tr-f)", () => {
      const fehler: string[] = [];
      for (const id of ["tr-q", "tr-f"]) {
        const lay = R.layoutById(id);
        for (const ch of new Set(ZEILEN.join(""))) if (!R.hatGriff(lay, ch)) fehler.push(`„${ch}" fehlt auf ${id}`);
      }
      expect(fehler).toEqual([]);
    });

    it("die Tastaturen des Weges sind bekannt (heute tr-q) - jede Zeile kommt dort an und am Ende vollständig", () => {
      expect(R.WEG_TASTATUREN).toEqual(["tr-q"]);
      const fehler: string[] = [];
      for (const l of R.WEG_TASTATUREN) {
        for (const s of CH) if (R.oeffnet(s, l) === null) fehler.push(`${l}: ${s.slug}`);
        for (const z of ZEILEN) if (R.volleSprosse(z, l) === null) fehler.push(`${l} nie vollständig: ${z}`);
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it("jede Serie öffnet an der gemessenen Einheit (tr-q) - nie vor dem Apostroph (Sprosse 33)", () => {
      const ist = Object.fromEntries(CH.map((s) => [s.slug, R.oeffnetEinheit(s, "tr-q")]));
      expect(ist).toEqual(a.oeffnet);
      for (const s of CH) expect(R.oeffnet(s, "tr-q")!, s.slug).toBeGreaterThanOrEqual(R.ordnung("tr-q").indexOf("'") + 1);
    });

    it("Gegenprobe: ñ hat keinen Griff, ı und â schon; eine Zeile mit Ziffer kommt erst mit der Ziffer vollständig", () => {
      expect(R.hatGriff(R.layoutById("tr-q"), "ñ")).toBe(false);
      expect(R.hatGriff(R.layoutById("tr-q"), "ı")).toBe(true);
      expect(R.hatGriff(R.layoutById("tr-q"), "â")).toBe(true);
      expect(R.volleSprosse("Elif 7 yaşında.", "tr-q")).toBe(R.ordnung("tr-q").indexOf("7") + 1);
      expect(R.ersteSprosse("Mañana yağmur yağacak.", "tr-q")).toBeNull();
    });
  });

  describe(`${a.name} · 4 · Grosswörter nur als Eigennamen - auch gekürzt; Apostroph nur am Namen`, () => {
    it("vollständig: jedes Grosswort mitten im Satz ist ein Eigenname der Serie (oder Land/Sprache/Braille)", () => {
      const fehler = CH.flatMap((s) => R.zeilenVon(s).flatMap((z) => R.fremdeGrosswoerter(z, R.namenVon(s)).map((w) => `${s.slug}: ${w} in ${z}`)));
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it("gekürzt serviert (tr-q): keine Naht macht ein Grosswort mitten im Satz", () => {
      const fehler = CH.flatMap((s) => R.zeilenVon(s).flatMap((z) => R.gekuerztFehler(z, R.namenVon(s)).map((f) => `${s.slug}: ${z} @ ${f}`)));
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it("jeder Apostroph steht zwischen einem Eigennamen der Serie und seiner Endung - Harmonie und Angleichung stimmen", () => {
      const fehler = CH.flatMap((s) => R.zeilenVon(s).flatMap((z) => R.apostrophFehler(z, R.namenVon(s)).map((f) => `${s.slug}: ${f} in ${z}`)));
      expect(fehler, fehler.join("\n")).toEqual([]);
      expect(ZEILEN.filter((z) => z.includes("'")).length).toBeGreaterThan(40);
    });

    it("Gegenprobe: Naht nach dem Doppelpunkt, fremdes Grosswort, falsche Endung am Namen", () => {
      const namen = new Set(["elif"]);
      expect(R.gekuerztFehler('Elif seslendi: "Gel buraya!"', namen).length).toBeGreaterThan(0);
      expect(R.gekuerztFehler('"Gel buraya!" diye seslendi Elif.', namen)).toEqual([]);
      expect(R.fremdeGrosswoerter("Elif bahçede Kedi gördü.", namen)).toEqual(["Kedi"]);
      expect(R.fremdeGrosswoerter("Elif Türkçede iyi.", namen)).toEqual([]);
      expect(R.apostrophFehler("Elif'ın kedisi uyuyor.", namen).length).toBeGreaterThan(0);
      expect(R.apostrophFehler("Elif'in kedisi uyuyor.", namen)).toEqual([]);
      expect(R.apostrophFehler("Kars'de kar var.", new Set(["kars"])).length).toBeGreaterThan(0);
      expect(R.apostrophFehler("Kemal'in kitabı burada.", new Set(["kemal"]))).toEqual([]);
    });
  });

  describe(`${a.name} · 5 · keine Feste, keine Politik, kein Geschlecht der tippenden Person, kein Etikett`, () => {
    it("keine Zeile trägt Fest, Feiertag, Staat, Religion, Politik, Geschlechtswort oder Etikett", () => {
      const fehler = ZEILEN.filter((z) => R.festIn(z) || R.politikIn(z) || R.geschlechtIn(z) || R.etikettIn(z));
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it("Gegenprobe: Bayram, İftar, seçim, kocaman, gelinim, görme engelli schlagen an; gelince, kocaeli, Braille okuyor nicht", () => {
      expect(R.festIn("Bayramda dedemlere gittik.")).toBe(true);
      expect(R.festIn("İftar sofrası kuruldu.")).toBe(true);
      expect(R.politikIn("Seçim yaklaşınca herkes konuştu.")).toBe(true);
      expect(R.geschlechtIn("Kocaman bir kek pişirdik.")).toBe(true);
      expect(R.geschlechtIn("Gelinim bugün geliyor.")).toBe(true);
      expect(R.etikettIn("Görme engelli bir çocuk.")).toBe(true);
      expect(R.geschlechtIn("Yağmur gelince eve döndük.")).toBe(false);
      expect(R.geschlechtIn("Kocaeli'ye gidiyoruz.")).toBe(false);
      expect(R.etikettIn("Defne parmaklarıyla Braille okuyor.")).toBe(false);
    });
  });

  describe(`${a.name} · 6 · Wortschatz`, () => {
    it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Eigennamen und Sprachnamen ausgenommen)", () => {
      const fehler = R.zuHaeufig(ZEILEN, NAMEN);
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort und ein Name nicht", () => {
      const neun = Array.from({ length: 9 }, (_, i) => `Kedi ${"abcçdefgğ"[i]} için Elif bekliyor.`);
      expect(R.zuHaeufig(neun, new Set(["elif"]))).toEqual(['"kedi": 9 Zeilen', '"bekliyor": 9 Zeilen']);
      expect(R.zuHaeufig(neun.slice(0, 8), new Set(["elif"]))).toEqual([]);
    });

    it("kein Wort der Sperrliste - Kern, Wortbasis, gefaltet (ı→i ş→s …), unerwünschte Themenwörter", () => {
      const fehler = ZEILEN.flatMap((z) => R.gesperrteWoerter(z).map((w) => `${w}: ${z}`));
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it("Gegenprobe: şık und sık (gefaltet sik), sıkıştı, ata, zarar, mal werden gefunden - fındık, sıcak, malzeme nicht", () => {
      for (const z of ["Elbisesi çok şık.", "Sık sık gelir.", "Trafik sıkıştı.", "Ata bindik.", "Zarar yok.", "Mal sahibi geldi."]) {
        expect(R.gesperrteWoerter(z).length, z).toBeGreaterThan(0);
      }
      expect(R.gesperrteWoerter("Sıcak fındık ve malzeme aldık.")).toEqual([]);
    });

    it("jedes Wort steht im Wortschatz (WORDS_TR, Stufen, Lexikon, tr-Korpus T1-T9) oder ist belegt (Grundform, Form, Name)", () => {
      expect(R.ungeprueft(ZEILEN, NAMEN)).toEqual([]);
    });

    it("jede belegte Form: Stamm + Endung = Wort, Stamm bekannt (oder Lautwandel), Harmonie und Angleichung stimmen, Endung zerlegbar", () => {
      const fehler = R.formenFehler();
      expect(fehler, fehler.slice(0, 20).join("\n")).toEqual([]);
    });

    it("die Belege tragen nur, was eine der drei Chargen braucht und nicht schon bekannt war (sonst wüchsen sie still)", () => {
      const zeilen = ALLE_CHARGEN.flatMap(R.zeilenVon);
      const benutzt = new Set(zeilen.flatMap((z) => R.woerterKlein(z)));
      const staemme = new Set(Object.values(R.NEUE_FORMEN).flatMap((f) => [f[0], f[2] ?? f[0]]));
      expect(Object.keys(R.NEUE_FORMEN).filter((w) => !benutzt.has(w) || R.BASIS.has(w))).toEqual([]);
      expect(Object.keys(R.NEUE_GRUNDFORMEN).filter((w) => !benutzt.has(w) && !staemme.has(w))).toEqual([]);
      expect(Object.keys(R.NEUE_GRUNDFORMEN).filter((w) => R.BASIS.has(w) || R.BASIS.has(`${w}mak`) || R.BASIS.has(`${w}mek`))).toEqual([]);
    });

    it("Gegenprobe: falsche Harmonie, falsche Angleichung, falscher Lautwandel, unzerlegbare Endung, erfundenes Wort", () => {
      expect(R.endungFehler("tuş", "ında")).toHaveLength(1);
      expect(R.endungFehler("tuş", "unda")).toEqual([]);
      expect(R.endungFehler("kitap", "da")).toHaveLength(1);
      expect(R.endungFehler("saat", "ı")).toHaveLength(1);
      expect(R.endungFehler("saat", "i")).toEqual([]);
      expect(R.endungFehler("yap", "abiliyor")).toEqual([]);
      expect(R.endungFehler("sabah", "leyin")).toEqual([]);
      expect(R.lautwandel("kitap", "kitab", "ı")).toBe(true);
      expect(R.lautwandel("omuz", "omz", "una")).toBe(true);
      expect(R.lautwandel("kapı", "kap", "ıyor")).toBe(false);
      expect(R.lautwandel("anla", "anl", "ıyor")).toBe(true);
      expect(R.endungZerlegbar("larından")).toBe(true);
      expect(R.endungZerlegbar("s")).toBe(false);
      expect(R.formenFehler({ kafes: ["kafe", "s"] }).length).toBeGreaterThan(0);
      expect(R.ungeprueft(["Pazarda bir kilo mandalinaa aldık."], new Set())).toEqual(["mandalinaa"]);
    });
  });

  describe(`${a.name} · 7 · keine Kopien, keine Paare, nichts fast gleich`, () => {
    const ANDERE_TR = R.andereTrZeilen(SLUGS);
    const FREMD = R.alleFremdenZeilen(SLUGS);

    it("die Vergleichsmengen sind voll (tr-Korpus T1-T9, andere tr-Serien, alle anderen Korpora, Serien und Banken)", () => {
      expect(ANDERE_TR.length).toBeGreaterThan(3000);
      expect(FREMD.length).toBeGreaterThan(20000);
      expect(R.bankZeilen().length).toBeGreaterThan(1000);
    });

    it("keine Zeile doppelt - auch nicht ohne Satzzeichen", () => {
      expect(new Set(ZEILEN.map(R.ohneSatzzeichen)).size).toBe(ZEILEN.length);
    });

    it("keine Zeile gleicht einer tr-Zeile, einer fremden Zeile oder ihrem Ledger-Schlüssel", () => {
      expect(R.kopienGegen(ZEILEN, [...ANDERE_TR, ...FREMD])).toEqual([]);
    });

    it("keine Paare (nur Person oder Zahl getauscht) - untereinander und gegen jede andere tr-Zeile", () => {
      const fehler = R.paare(ZEILEN, ANDERE_TR);
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it("nichts fast gleich (Jaccard ≥ 0,6) - untereinander, gegen andere tr-Zeilen und gegen alles Fremde", () => {
      const fehler = [...R.fastGleichUntereinander(ZEILEN, 0.6), ...R.fastGleich(ZEILEN, ANDERE_TR, 0.6), ...R.fastGleich(ZEILEN, FREMD, 0.6)];
      expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
    });

    it("Gegenprobe: Kopie mit anderen Satzzeichen, Paar, fast gleich; der Präfix-Filter findet, was der volle Vergleich findet", () => {
      const z = ZEILEN[0];
      expect(R.kopienGegen([`${z.replace(/[.!?]$/, "")}?`], [z])).toHaveLength(1);
      expect(R.paare(["Kuşlar ağaçta öter.", "Kuş ağaçta öter."])).toHaveLength(1);
      expect(R.paare(["Ben de geldim.", "Sen de geldim."])).toHaveLength(1);
      const probe = ["Kedi bahçede güneşte uyuyor.", "Kedi bahçede güneşte uyuyor bugün.", "Köpek kapıda havlıyor."];
      expect(R.fastGleich(probe, probe, 0.6)).toEqual(R.fastGleichVoll(probe, probe, 0.6));
      expect(R.fastGleich(probe, probe, 0.6).length).toBe(2);
      const stich = ZEILEN.slice(0, 40);
      expect(R.fastGleich(stich, ANDERE_TR.slice(0, 2000), 0.5)).toEqual(R.fastGleichVoll(stich, ANDERE_TR.slice(0, 2000), 0.5));
    });
  });

  describe(`${a.name} · 8 · die Türkei in ihren sieben Regionen`, () => {
    const TUERKEI = R.BOELGELER_TR.filter((b) => b !== "Yurt dışı");
    it("jede der sieben Regionen trägt 2 oder 3 Serien, Yurt dışı genau eine", () => {
      const m = R.proBoelge(CH);
      const fehler = TUERKEI.filter((b) => (m.get(b) ?? 0) < 2 || (m.get(b) ?? 0) > 3).map((b) => `${b}: ${m.get(b)}`);
      expect(fehler).toEqual([]);
      expect(m.get("Yurt dışı")).toBe(1);
      expect([...m.values()].reduce((x, y) => x + y, 0)).toBe(CH.length);
    });

    it("Gegenprobe: zehn Serien in Marmara und eine unbekannte Region schlagen an", () => {
      const m = R.proBoelge([...Array.from({ length: 10 }, () => ({ land: "Marmara" })), { land: "Atlantis" }]);
      expect(m.get("Marmara")).toBe(10);
      expect(m.get("Ege")).toBe(0);
      expect(R.serienFormFehler({ ...CH[0], land: "Atlantis" as never }, a.stufe, 12, 16).some((f) => f.includes("land"))).toBe(true);
    });
  });

  it(`${a.name} · Gegenprobe Kürzen: fitText lässt vor ihrer Sprosse ? ! : " ; weg`, () => {
    const vorFrage = R.allowedAt(R.ordnung("tr-q").indexOf("?"), "tr-q");
    expect(fitText("Neden geldin, Elif?", vorFrage, "tr")).toBe("Neden geldin, Elif");
  });
}
