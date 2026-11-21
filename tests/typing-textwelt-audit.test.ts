/**
 * TW-E4 (Textwelt): Bestands-Audit + Deaktivierungs-Mechanik („append-only,
 * deaktivieren statt löschen"). Dieser Test IST der reproduzierbare Audit:
 *  • jeder AKTIVE Baustein ist vollständig tippbar (kein nie-freischaltbares
 *    Zeichen → minTier ≠ null); das deckt auch Fremdzeichen ab,
 *  • keine Ersatzschreibung (ae/oe/ue/ss statt ä/ö/ü/ß) in aktiven Bausteinen,
 *  • fehl-kategorisierte Witz-Rätsel sind als `fakt` DEAKTIVIERT (Wissenswertes
 *    serviert nur echte Fakten), bleiben aber als `witz` erhalten,
 *  • Deaktivierung ist append-only-SICHER: aussortierte Bausteine bleiben im
 *    Manifest (Index stabil, Version unverändert) und werden nur beim Servieren
 *    übersprungen.
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md
 */
import { describe, it, expect } from "vitest";
import {
  CORPUS,
  CORPUS_EN,
  DEACTIVATED,
  allowedForTier,
  bausteinId,
  corpusEntriesFor,
  corpusItemsFor,
  corpusManifest,
  isDeactivated,
  minTierFor,
} from "../src/lib/typing";

const ALL = allowedForTier(5, "de");

describe("TW-E4 — Bestands-Audit (harte Gates)", () => {
  it("jeder AKTIVE Baustein ist vollständig tippbar (minTier ≠ null)", () => {
    const broken: string[] = [];
    for (const src of [CORPUS, CORPUS_EN])
      for (const it of src) {
        if (isDeactivated(it.kind, it.text)) continue;
        if (minTierFor(it.text, "de") === null) broken.push(`[${it.kind}] ${it.text}`);
      }
    expect(broken, broken.slice(0, 10).join(" | ")).toEqual([]);
  });

  it("keine Ersatzschreibung (ae/oe/ue statt ä/ö/ü) in aktiven Bausteinen", () => {
    const re =
      /\b(frueher|spaeter|ueber|fuer|gruen|schoen|moechte|koennen|muede|haeuser|baeume|groesser|fuesse|waere|maedchen|schluessel|tuer|buecher|fruehstueck|muell|gruesse)\w*/i;
    const hits: string[] = [];
    for (const it of CORPUS) {
      if (isDeactivated(it.kind, it.text)) continue;
      if (re.test(it.text)) hits.push(it.text);
    }
    expect(hits, hits.join(" | ")).toEqual([]);
  });

  it("Bestand hat die erwartete Größenordnung (Audit-Basislinie)", () => {
    // Sichert, dass keine Charge versehentlich Masse verliert (o. Ä.).
    expect(CORPUS.length).toBeGreaterThan(1000);
    expect(CORPUS_EN.length).toBeGreaterThan(700);
  });
});

describe("TW-E4 — Deaktivierung (append-only-sicher)", () => {
  // Die Liste wächst mit jeder Curation (TW-E4, P1-Prüfbericht, …) — die
  // TW-E4-spezifischen Zusicherungen gelten nur für die vier Ursprungs-Einträge.
  const WITZ_ALS_FAKT = DEACTIVATED.filter((d) => d.reason.includes("TW-E4"));

  it("die 4 fehl-kategorisierten Witz-als-fakt sind deaktiviert", () => {
    expect(WITZ_ALS_FAKT.length).toBe(4);
    for (const d of WITZ_ALS_FAKT) {
      expect(d.kind).toBe("fakt");
      expect(isDeactivated(d.kind, d.text)).toBe(true);
      // dieselbe Pointe als witz bleibt AKTIV (nur die Fehl-Kategorie fällt weg)
      expect(isDeactivated("witz", d.text)).toBe(false);
    }
  });

  it("jeder Listen-Eintrag ist wirksam deaktiviert und begründet", () => {
    for (const d of DEACTIVATED) {
      expect(isDeactivated(d.kind, d.text), d.text).toBe(true);
      expect(d.reason.length).toBeGreaterThan(10);
    }
  });

  it("P1-Sachfehler (Prüfbericht 2026-07-27) werden nicht mehr serviert", () => {
    // Braille-Tempo-Behauptung raus aus den Fakten, Benz-Marke raus aus den
    // Zungenbrechern; Alkohol-Zungenbrecher nur noch auf Stufe erwachsen.
    const fakten = corpusItemsFor({ lernweg: "de", stufe: "teens", allowed: ALL, kinds: ["fakt"] });
    expect(fakten.some((l) => l.includes("schneller als Sehen"))).toBe(false);
    for (const stufe of ["a", "b", "c"] as const) {
      const zungen = corpusItemsFor({ lernweg: "de", stufe, allowed: ALL, kinds: ["zungenbrecher"] });
      expect(zungen.some((l) => /Benz|Bierbrauer|Whisky/.test(l))).toBe(false);
    }
  });

  it("deaktivierte fakt-Rätsel werden NICHT mehr als fakt serviert", () => {
    // Verglichen wird der GANZE normalisierte Text, nicht ein 20-Zeichen-Präfix:
    // seit TN-E10 werden auch Varianten-Ketten gekappt, deren fast gleichlautende
    // Schwester-Fassung aktiv BLEIBT — ein Präfix-Vergleich schlug dort falsch an.
    const norm = (t: string) => t.replace(/[^a-zäöüßA-ZÄÖÜ0-9 ]+/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
    const factLines = corpusItemsFor({ lernweg: "de", stufe: "teens", allowed: ALL, kinds: ["fakt"] }).map(norm);
    for (const d of DEACTIVATED) {
      if (d.kind !== "fakt") continue; // andere Sorten prüft der jeweilige Test
      expect(factLines, d.text).not.toContain(norm(d.text));
    }
    // corpusEntriesFor (adaptiver/Lektions-Pfad) ebenso: kein deaktivierter Index.
    const entries = corpusEntriesFor({ lernweg: "de", stufe: "teens", allowed: ALL, kinds: ["fakt"] });
    const deadIdx = new Set(
      DEACTIVATED.map((d) => corpusManifest().indexOf.get(bausteinId(d.kind, d.text))),
    );
    expect(entries.some((e) => deadIdx.has(e.index))).toBe(false);
  });

  it("aussortierte Bausteine bleiben im MANIFEST (Index stabil, nicht gelöscht)", () => {
    const m = corpusManifest();
    for (const d of DEACTIVATED) {
      const id = bausteinId(d.kind, d.text);
      expect(m.indexOf.has(id)).toBe(true); // noch im Manifest → Ledger-Indizes stabil
    }
  });

  it("die Witz-Zwillinge der deaktivierten Rätsel bleiben servierbar", () => {
    // „Karotte" existiert als witz (Stufe c) und muss weiter serviert werden —
    // deaktiviert wurde nur die fakt-Kopie.
    const witzLines = (["kids", "teens", "erwachsen"] as const).flatMap((stufe) =>
      corpusItemsFor({ lernweg: "de", stufe, allowed: ALL, kinds: ["witz"] }),
    );
    expect(witzLines.some((l) => /Karotte/i.test(l))).toBe(true);
  });
});
