/**
 * ★ Johannes 28.09.2026: „Quellen & Dank" zeigt nur die Quellen der Sprachen
 * des Kindes (Weg + Englisch). Dazu der Fund beim Bauen: die Korpus-Zeilen von
 * fr und es fehlten in der Liste ganz.
 */
import { describe, expect, it } from "vitest";
import { SERIEN, collectHerkunft } from "@/lib/typing/serien";
import { korpusFuer } from "@/lib/typing/corpus";
import { sprachPaketeFuer } from "@/lib/typing/sprachpaketBedarf";
import type { Lang } from "@/lib/typing/account";

const schluessel = (x: { quelle: string; lizenz: string; autor?: string }) => `${x.quelle}|${x.lizenz}|${x.autor ?? ""}`;

function quellenNurIn(sprache: Lang): Set<string> {
  const hier = new Set<string>();
  for (const s of SERIEN) if ((s.lang ?? "de") === sprache && s.herkunft) hier.add(schluessel(s.herkunft));
  for (const it of korpusFuer(sprache)) if (it.herkunft) hier.add(schluessel(it.herkunft));
  const anderswo = new Set<string>();
  for (const l of ["de", "en", "fr", "es"] as Lang[]) {
    if (l === sprache) continue;
    for (const s of SERIEN) if ((s.lang ?? "de") === l && s.herkunft) anderswo.add(schluessel(s.herkunft));
    for (const it of korpusFuer(l)) if (it.herkunft) anderswo.add(schluessel(it.herkunft));
  }
  return new Set([...hier].filter((k) => !anderswo.has(k)));
}

describe("★ Quellen & Dank je Weg", () => {
  it("Weg es: spanische Quellen da, rein deutsche und rein französische nicht", () => {
    const liste = new Set(collectHerkunft(sprachPaketeFuer("es")).map(schluessel));
    const es = quellenNurIn("es");
    expect(es.size).toBeGreaterThan(0);
    for (const k of es) expect(liste.has(k), k).toBe(true);
    for (const k of quellenNurIn("de")) expect(liste.has(k), k).toBe(false);
    for (const k of quellenNurIn("fr")) expect(liste.has(k), k).toBe(false);
  });

  it("die Korpus-Zeilen von fr und es sind in der vollen Liste (fehlten bis 28.09.)", () => {
    const voll = new Set(collectHerkunft().map(schluessel));
    for (const l of ["fr", "es"] as Lang[])
      for (const it of korpusFuer(l)) if (it.herkunft) expect(voll.has(schluessel(it.herkunft)), `${l}: ${it.herkunft.quelle}`).toBe(true);
  });
});
