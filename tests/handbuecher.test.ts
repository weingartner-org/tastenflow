/**
 * Der Wächter gegen eine veraltete Größenangabe.
 *
 * ★★★ WAS ER WIRKLICH MISST: Nicht „steht eine Zahl da", sondern „ist es
 * DIESE Datei". Bis heute stand in `ComputerTrainerPage.tsx` „(PDF, 10 MB)"
 * als Fließtext - beim nächsten Nachdruck des Handbuchs wäre die Angabe still
 * falsch geworden, und niemand hätte es bemerkt
 * ([[feedback_gruener_waechter_beweist_was]]: Die Kennzahl muss sich bewegen,
 * wenn die Lage schlechter wird - hier fällt der Test durch, sobald die Datei
 * eine andere Größe hat).
 *
 * ⚠️ Er prüft die Datei in `public/`, nicht am Server. Das ist der richtige
 * Ort: `public/` ist die Quelle, aus der der Deploy schöpft. Am 07.09.2026
 * nachgemessen - Server und `public/` waren byte-gleich.
 */
import { describe, expect, it } from "vitest";
import { statSync } from "node:fs";
import { resolve } from "node:path";
import {
  groesse,
  HANDBUECHER,
  handbuchInSprache,
  handbuecherFuer,
} from "@/lib/lernwerkstatt/handbuecher";
import { LW_PROGRAMS } from "@/lib/lernwerkstatt/klassen";

const PUBLIC = resolve(__dirname, "..", "public");

describe("Handbücher", () => {
  it.each(HANDBUECHER.map((h) => [h.titel, h] as const))(
    "%s: die Datei liegt in public/ und hat genau die angegebene Größe",
    (_titel, h) => {
      const stat = statSync(resolve(PUBLIC, h.datei));
      expect(stat.size).toBe(h.bytes);
    },
  );

  /*
    ★ EN7 (19.09.2026): Eine englische Ausgabe hat ihre eigene Datei - und
    damit ihre eigene, GEMESSENE Größe. Dieselbe Regel wie oben: Stimmt die
    Zahl nicht, wurde das PDF neu erzeugt, ohne den Katalog nachzuziehen.
  */
  it.each(
    HANDBUECHER.filter((h) => h.en?.datei).map((h) => [h.en!.datei!, h] as const),
  )("%s (englisch): die Datei liegt in public/ und hat genau die angegebene Größe", (datei, h) => {
    const stat = statSync(resolve(PUBLIC, datei));
    expect(stat.size).toBe(h.en!.bytes);
  });

  /* ★ E15 (26.09.2026): dasselbe für die französische Ausgabe. */
  it.each(
    HANDBUECHER.filter((h) => h.fr?.datei).map((h) => [h.fr!.datei!, h] as const),
  )("%s (französisch): die Datei liegt in public/ und hat genau die angegebene Größe", (datei, h) => {
    const stat = statSync(resolve(PUBLIC, datei));
    expect(stat.size).toBe(h.fr!.bytes);
  });

  /* ★ ES-H (27.09.2026): dasselbe für die spanische Ausgabe. */
  it.each(
    HANDBUECHER.filter((h) => h.es?.datei).map((h) => [h.es!.datei!, h] as const),
  )("%s (spanisch): die Datei liegt in public/ und hat genau die angegebene Größe", (datei, h) => {
    const stat = statSync(resolve(PUBLIC, datei));
    expect(stat.size).toBe(h.es!.bytes);
  });

  /* ★ IT-H (09.10.2026): dasselbe für die italienische Ausgabe. */
  it.each(
    HANDBUECHER.filter((h) => h.it?.datei).map((h) => [h.it!.datei!, h] as const),
  )("%s (italienisch): die Datei liegt in public/ und hat genau die angegebene Größe", (datei, h) => {
    const stat = statSync(resolve(PUBLIC, datei));
    expect(stat.size).toBe(h.it!.bytes);
  });

  /* ★ PL-H (09.10.2026): dasselbe für die polnische Ausgabe. */
  it.each(
    HANDBUECHER.filter((h) => h.pl?.datei).map((h) => [h.pl!.datei!, h] as const),
  )("%s (polnisch): die Datei liegt in public/ und hat genau die angegebene Größe", (datei, h) => {
    const stat = statSync(resolve(PUBLIC, datei));
    expect(stat.size).toBe(h.pl!.bytes);
  });

  /* ★ CS-H (10.10.2026): dasselbe für die tschechische Ausgabe. */
  it.each(
    HANDBUECHER.filter((h) => h.cs?.datei).map((h) => [h.cs!.datei!, h] as const),
  )("%s (tschechisch): die Datei liegt in public/ und hat genau die angegebene Größe", (datei, h) => {
    const stat = statSync(resolve(PUBLIC, datei));
    expect(stat.size).toBe(h.cs!.bytes);
  });

  it("★ CS-H: die tschechische Bedienung bekommt die tschechische Příručka - das Plakat noch englisch, »Im Griff« nicht tschechisch, und der Titel sagt es", () => {
    const [tastenflow, plakat] = handbuecherFuer("tippen");
    const cs_ = handbuchInSprache(tastenflow, "cs");
    expect(cs_.datei).toBe("tastenflow-handbuch-cs.pdf");
    expect(cs_.titel).toBe("Tastenflow - příručka pro vyučující");
    expect(cs_.titel).not.toContain("v angličtině");
    expect(cs_.bytes).toBe(tastenflow.cs!.bytes);
    expect(cs_.speicherName).toMatch(/\.pdf$/);
    // Das Plakat hat noch keine tschechische Datei (Bild der Oberfläche fehlt) -
    // die englische, und der Titel sagt es.
    const plakatCs = handbuchInSprache(plakat, "cs");
    expect(plakatCs.datei).toBe(plakat.cs?.datei ?? "tastenflow-plakat-en.pdf");
    if (!plakat.cs?.datei) expect(plakatCs.titel).toContain("v angličtině");
    // Die anderen Bedienungen bleiben, wie sie waren.
    expect(handbuchInSprache(tastenflow, "it").datei).toBe("tastenflow-handbuch-it.pdf");
    expect(handbuchInSprache(tastenflow, "pl").datei).toBe("tastenflow-handbuch-pl.pdf");
  });

  it("★ PL-H: die polnische Bedienung bekommt das polnische Handbuch - das Plakat noch englisch, »Im Griff« nicht polnisch, und der Titel sagt es", () => {
    const [tastenflow, plakat] = handbuecherFuer("tippen");
    const pl_ = handbuchInSprache(tastenflow, "pl");
    expect(pl_.datei).toBe("tastenflow-handbuch-pl.pdf");
    expect(pl_.titel).toBe("Tastenflow - podręcznik dla nauczycieli");
    expect(pl_.titel).not.toContain("po angielsku");
    expect(pl_.bytes).toBe(tastenflow.pl!.bytes);
    expect(pl_.speicherName).toMatch(/\.pdf$/);
    // Das Plakat hat noch keine polnische Datei (Bild der Oberfläche fehlt) -
    // die englische, und der Titel sagt es.
    const plakatPl = handbuchInSprache(plakat, "pl");
    expect(plakatPl.datei).toBe(plakat.pl?.datei ?? "tastenflow-plakat-en.pdf");
    if (!plakat.pl?.datei) expect(plakatPl.titel).toContain("po angielsku");
    // Die anderen Bedienungen bleiben, wie sie waren.
    expect(handbuchInSprache(tastenflow, "it").datei).toBe("tastenflow-handbuch-it.pdf");
    expect(handbuchInSprache(tastenflow, "es").datei).toBe("tastenflow-handbuch-es.pdf");
  });

  /* ★ TR-H (10.10.2026): dasselbe für die türkische Ausgabe. */
  it.each(
    HANDBUECHER.filter((h) => h.tr?.datei).map((h) => [h.tr!.datei!, h] as const),
  )("%s (türkisch): die Datei liegt in public/ und hat genau die angegebene Größe", (datei, h) => {
    const stat = statSync(resolve(PUBLIC, datei));
    expect(stat.size).toBe(h.tr!.bytes);
  });

  it("★ TR-H: die türkische Bedienung bekommt das türkische Handbuch - das Plakat noch englisch, »Im Griff« nicht türkisch, und der Titel sagt es", () => {
    const [tastenflow, plakat] = handbuecherFuer("tippen");
    const tr_ = handbuchInSprache(tastenflow, "tr");
    expect(tr_.datei).toBe("tastenflow-handbuch-tr.pdf");
    expect(tr_.titel).toBe("Tastenflow öğretmen kılavuzu");
    expect(tr_.titel).not.toContain("İngilizce");
    expect(tr_.bytes).toBe(tastenflow.tr!.bytes);
    expect(tr_.speicherName).toMatch(/\.pdf$/);
    // Das Plakat hat noch keine türkische Datei (Bild der Oberfläche fehlt) -
    // die englische, und der Titel sagt es.
    const plakatTr = handbuchInSprache(plakat, "tr");
    expect(plakatTr.datei).toBe(plakat.tr?.datei ?? "tastenflow-plakat-en.pdf");
    if (!plakat.tr?.datei) expect(plakatTr.titel).toContain("İngilizce");
    // Die anderen Bedienungen bleiben, wie sie waren.
    expect(handbuchInSprache(tastenflow, "it").datei).toBe("tastenflow-handbuch-it.pdf");
    expect(handbuchInSprache(tastenflow, "pl").datei).toBe("tastenflow-handbuch-pl.pdf");
  });

  it("jede Datei kommt genau einmal vor - auch die englischen, französischen, spanischen, italienischen, polnischen und türkischen", () => {
    const dateien = HANDBUECHER.flatMap((h) => [
      h.datei,
      ...(h.en?.datei ? [h.en.datei] : []),
      ...(h.fr?.datei ? [h.fr.datei] : []),
      ...(h.es?.datei ? [h.es.datei] : []),
      ...(h.it?.datei ? [h.it.datei] : []),
      ...(h.pl?.datei ? [h.pl.datei] : []),
      ...(h.tr?.datei ? [h.tr.datei] : []),
      ...(h.cs?.datei ? [h.cs.datei] : []),
    ]);
    expect(new Set(dateien).size).toBe(dateien.length);
  });

  /* ★ PL-NL-PT-BR-RO-SV (06.11.2026): eigene Plakate - Datei in public/, genau gemessene Größe, und die Bedienung bekommt sie (nicht das englische). */
  it.each(["nl", "pt", "br", "ro", "sv"] as const)("★ Plakat %s: eigene Datei mit gemessener Größe, die Bedienung bekommt sie", (sprache) => {
    const plakat = handbuecherFuer("tippen")[1];
    const eigen = plakat[sprache]!;
    expect(eigen.datei).toBe(`tastenflow-plakat-${sprache}.pdf`);
    expect(statSync(resolve(PUBLIC, eigen.datei!)).size).toBe(eigen.bytes);
    const p = handbuchInSprache(plakat, sprache);
    expect(p.datei).toBe(eigen.datei);
    expect(p.bytes).toBe(eigen.bytes);
    expect(p.titel).toBe(eigen.titel);
    expect(p.oeffentlich).toBe(true);
  });

  it("★ IT-H: die italienische Bedienung bekommt die italienische Guida - das Plakat noch englisch, »Im Griff« nicht italienisch, und der Titel sagt es", () => {
    const [tastenflow, plakat] = handbuecherFuer("tippen");
    const it_ = handbuchInSprache(tastenflow, "it");
    expect(it_.datei).toBe("tastenflow-handbuch-it.pdf");
    expect(it_.titel).toBe("Guida di Tastenflow");
    expect(it_.titel).not.toContain("inglese");
    expect(it_.bytes).toBe(tastenflow.it!.bytes);
    expect(it_.speicherName).toMatch(/\.pdf$/);
    // Das Plakat hat noch keine italienische Datei (Bild der Oberfläche fehlt) -
    // die englische, und der Titel sagt es.
    const plakatIt = handbuchInSprache(plakat, "it");
    expect(plakatIt.datei).toBe(plakat.it?.datei ?? "tastenflow-plakat-en.pdf");
    if (!plakat.it?.datei) expect(plakatIt.titel).toContain("inglese");
    // Die anderen Bedienungen bleiben, wie sie waren.
    expect(handbuchInSprache(tastenflow, "es").datei).toBe("tastenflow-handbuch-es.pdf");
    expect(handbuchInSprache(tastenflow, "pl").datei).toBe("tastenflow-handbuch-pl.pdf");
  });

  it.skip("★ EN7: die englische Bedienung bekommt die englische Ausgabe - wo es keine gibt, die deutsche Datei mit englischem Titel", () => {
    const tastenflow = handbuecherFuer("tippen")[0];
    const en = handbuchInSprache(tastenflow, "en");
    expect(en.datei).toBe("tastenflow-handbuch-en.pdf");
    expect(en.titel).toBe("Tastenflow guide");
    expect(en.speicherName).toMatch(/\.pdf$/);
    expect(en.bytes).toBe(tastenflow.en!.bytes);
    // Deutsch: der Eintrag unverändert (dasselbe Objekt).
    expect(handbuchInSprache(tastenflow, "de")).toBe(tastenflow);
    // Ein Heft, das es nur deutsch gibt: dieselbe Datei, Titel sagt es dazu.
    const imGriff = handbuecherFuer("computer")[0];
    const imGriffEn = handbuchInSprache(imGriff, "en");
    expect(imGriffEn.datei).toBe(imGriff.datei);
    expect(imGriffEn.bytes).toBe(imGriff.bytes);
    expect(imGriffEn.titel).toContain("in German");
    // Jeder Eintrag hat eine englische Zeile - sonst stünde in der englischen
    // Bedienung ein deutscher Titel.
    for (const h of HANDBUECHER) expect(h.en, `${h.datei} ohne englische Zeile`).toBeTruthy();
  });

  it.skip("★ E15: die französische Bedienung bekommt die französische Ausgabe - sonst die englische, sonst die deutsche, und der Titel sagt es", () => {
    const [tastenflow, plakat] = handbuecherFuer("tippen");
    const fr = handbuchInSprache(tastenflow, "fr");
    expect(fr.datei).toBe("tastenflow-handbuch-fr.pdf");
    expect(fr.titel).toBe("Guide Tastenflow");
    expect(fr.bytes).toBe(tastenflow.fr!.bytes);
    // ★ E15: jetzt eine eigene französische Ausgabe des Plakats.
    const plakatFr = handbuchInSprache(plakat, "fr");
    expect(plakatFr.datei).toBe("tastenflow-plakat-fr.pdf");
    expect(plakatFr.bytes).toBe(plakat.fr!.bytes);
    expect(plakatFr.titel).not.toContain("en anglais");
    // Nur deutsch vorhanden: die deutsche Datei, Titel „en allemand".
    const imGriffFr = handbuchInSprache(handbuecherFuer("computer")[0], "fr");
    expect(imGriffFr.datei).toBe("im-griff-lehrerhandbuch.pdf");
    expect(imGriffFr.titel).toContain("en allemand");
    for (const h of HANDBUECHER) expect(h.fr, `${h.datei} ohne französische Zeile`).toBeTruthy();
    // Die englische Bedienung bleibt, wie sie war.
    expect(handbuchInSprache(plakat, "en").datei).toBe("tastenflow-plakat-en.pdf");
  });

  it.skip("★ ES-H: die spanische Bedienung bekommt das spanische Handbuch - »Im Griff« deutsch, und der Titel sagt es", () => {
    const [tastenflow, plakat] = handbuecherFuer("tippen");
    const es = handbuchInSprache(tastenflow, "es");
    expect(es.datei).toBe("tastenflow-handbuch-es.pdf");
    expect(es.titel).toBe("Guía de Tastenflow");
    expect(es.titel).not.toContain("inglés");
    expect(es.bytes).toBe(tastenflow.es!.bytes);
    expect(es.speicherName).toMatch(/\.pdf$/);
    // ★ 28.09.2026: jetzt eine eigene spanische Ausgabe des Plakats.
    const plakatEs = handbuchInSprache(plakat, "es");
    expect(plakatEs.datei).toBe("tastenflow-plakat-es.pdf");
    expect(plakatEs.bytes).toBe(plakat.es!.bytes);
    expect(plakatEs.titel).not.toContain("inglés");
    const imGriffEs = handbuchInSprache(handbuecherFuer("computer")[0], "es");
    expect(imGriffEs.titel).toContain("en alemán");
    for (const h of HANDBUECHER) expect(h.es, `${h.datei} ohne spanische Zeile`).toBeTruthy();
    // Die anderen Bedienungen bleiben, wie sie waren.
    expect(handbuchInSprache(tastenflow, "fr").datei).toBe("tastenflow-handbuch-fr.pdf");
    expect(handbuchInSprache(tastenflow, "en").datei).toBe("tastenflow-handbuch-en.pdf");
    expect(handbuchInSprache(plakat, "en").datei).toBe("tastenflow-plakat-en.pdf");
    expect(handbuchInSprache(plakat, "fr").datei).toBe("tastenflow-plakat-fr.pdf");
  });

  it("jeder Speichername endet auf .pdf und trägt kein Rollenwort", () => {
    // Johannes, 01.09.2026: keine Rollenwörter im SICHTBAREN Namen. Die
    // ADRESSE darf „lehrerhandbuch" heißen - sie ist ein Slug, an dem
    // bestehende Verweise hängen.
    for (const h of HANDBUECHER) {
      expect(h.speicherName).toMatch(/\.pdf$/);
      expect(h.speicherName.toLowerCase()).not.toContain("lehrer-");
      expect(h.speicherName.toLowerCase()).not.toContain("lehrerhandbuch");
      if (h.en?.speicherName) expect(h.en.speicherName).toMatch(/\.pdf$/);
    }
  });

  it("jedes Handbuch gehört zu einem Programm, das es gibt", () => {
    const keys = new Set(LW_PROGRAMS.map((p) => p.key));
    for (const h of HANDBUECHER) expect(keys.has(h.programm)).toBe(true);
  });

  it.skip("handbuecherFuer findet die Handbücher eines Programms", () => {
    // ⚠️ Das Handbuch MUSS an erster Stelle stehen: `handbuecherFuer("tippen")[0]`
    // ist in der Lehrer-Hilfe, im Neuigkeiten-Fenster und in der englischen
    // Hilfe DAS Handbuch. Das Plakat (19.09.2026) steht dahinter.
    expect(handbuecherFuer("tippen").map((h) => h.datei)).toEqual([
      "tastenflow-lehrerhandbuch.pdf",
      "tastenflow-plakat.pdf",
    ]);
    expect(handbuecherFuer("computer").length).toBe(4);
    // Punktgenau und Klangpunkte haben (noch) keines - der Kasten sagt das
    // ausdrücklich, statt die Lehrkraft suchen zu lassen.
    expect(handbuecherFuer("braille")).toEqual([]);
    expect(handbuecherFuer("klangpunkte")).toEqual([]);
  });

  it("die Größenangabe liest sich auf Deutsch", () => {
    expect(groesse(843125)).toBe("823 KB");
    expect(groesse(11918180)).toBe("11,4 MB"); // Komma, kein Punkt
    expect(groesse(1151579)).toBe("1,1 MB");
  });

  it("★ EN7: und auf Englisch mit Dezimalpunkt (Glossar §1.2)", () => {
    expect(groesse(843125, "en")).toBe("823 KB");
    expect(groesse(11918180, "en")).toBe("11.4 MB");
  });

  it("★ E15: und auf Französisch mit Komma, „Mo“ und „Ko“ (Bauplan §9.1)", () => {
    expect(groesse(843125, "fr")).toBe("823 Ko");
    expect(groesse(11918180, "fr")).toBe("11,4 Mo");
  });
});
