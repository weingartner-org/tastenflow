/**
 * TN-E12 (Nachzügler-Charge): die restlichen Befunde des Prüfberichts 27.07. —
 * acht falsche/irreführende Fakten, zehn Sprachfehler, vier Fehl-Sorten, vier
 * Erstleser-Fehlvorstellungen (DE) und acht Grammatik-/Sinnfehler (EN).
 *
 * Der Test prüft beides: dass die alte Fassung nicht mehr serviert wird UND
 * dass die korrigierte da ist (kein stiller Inhaltsverlust).
 */
import { describe, expect, it } from "vitest";
import { CORPUS, CORPUS_EN } from "../src/lib/typing/corpus";
import { isDeactivated } from "../src/lib/typing/corpusDeactivated";
import { KORREKTUR_CORPUS } from "../src/lib/typing/corpusKorrekturen";
import { EN_KORREKTUR_CORPUS } from "../src/lib/typing/corpusEnKorrekturen";
import { validateHerkunft } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { corpusManifest } from "../src/lib/typing/corpusManifest";
import { bausteinId } from "../src/lib/typing/ledger";

const aktivDe = CORPUS.filter((e) => !isDeactivated(e.kind, e.text)).map((e) => e.text);
const aktivEn = CORPUS_EN.filter((e) => !isDeactivated(e.kind, e.text)).map((e) => e.text);

/** [alte Fassung (raus), Merkmal der neuen Fassung (drin)] */
const DE_PAARE: Array<[string, RegExp]> = [
  ["Eine Schnecke kann zwei Jahre am Stück schlafen.", /trockene Zeiten in einer Art Starre/],
  ["Ein Hund riecht millionenfach besser als ein Mensch.", /Hund riecht um ein Tausendfaches/],
  ["Ein Marienkäfer kann an einem Tag hunderte Blattläuse fressen.", /etwa fünfzig Blattläuse/],
  ["Eine Sonnenblume dreht sich mit der Sonne mit.", /Junge Sonnenblumen wandern mit der Sonne/],
  ["Bäume tauschen über ihre Wurzeln und Pilze Botschaften aus.", /Baumwurzeln sind im Boden eng mit feinen Pilzgeflechten/],
  ["Die kürzeste Schlacht der Geschichte dauerte rund 38 Minuten.", /kürzeste Krieg der Geschichte/],
  ["Mische 23 Menschen, und meist teilen zwei davon denselben Geburtstag.", /wahrscheinlicher als keiner/],
  ["Ein Skelett geht nicht zur Party: es hat einfach niemanden dabei.", /Party: Es hat einfach niemanden/],
  ["Anna, Otto und Hannah heißen rücklings genauso wie vorwärts.", /rückwärts gelesen genauso wie vorwärts/],
  ["Was sagt der große zum kleinen Stift? Wachs mal nach, du Knirps.", /Was sagt der Große zum kleinen Stift/],
  // R2 (14.08.): Die TN-E12-Fassung hieß „Abendrot, Gutwetterbote."; sie ist
  // selbst stillgelegt worden (unflektiert, Reim gebrochen) und kommt als
  // „Abendrot, Gutwetterbot." zurück. Das Muster deckt beide Fassungen ab.
  ["Abendrot, gut Wetter bot.", /Abendrot, Gutwetterbot/],
  ["Ein Fisch lebt im Wasser und holt dort Luft.", /Fisch lebt im Wasser und atmet mit Kiemen/],
  ["Eine Wolke ist nasse Luft. Daraus wird der Regen.", /Wolke besteht aus feinem Wasser/],
  ["Eine Ente hat an den Fingern eine Haut.", /Ente hat an den Beinen eine Schwimmhaut/],
  ["Ein Hai hat im Mund Reihe an Reihe.", /Hai hat im Mund viele Reihen von Zähnen/],
];

const EN_PAARE: Array<[string, RegExp]> = [
  ["A week feels short, an hour feels not.", /A week feels short and an hour feels long/],
  ["It looks a lot smaller once we started.", /It looked a lot smaller before we started/],
  ["The football rolls into the neighbour garden.", /into the garden beside ours/],
  ["The bread in the bag is a bit late.", /bread in the bag is a bit stale/],
  ["The oat cake broke and it was clean.", /oat cake broke into two clean bits/],
  ["We are ten and we need one more.", /There are ten of us and we need one more/],
  ["We hang a small torch in the front window.", /a small lantern in the front window/],
  ["The class hut is cold, so we all sing.", /The cabin is cold, so we all sing/],
];

describe("TN-E12 Korrekturen Deutsch", () => {
  it("keine der beanstandeten Fassungen wird noch serviert", () => {
    for (const [alt] of DE_PAARE) expect(aktivDe, alt).not.toContain(alt);
  });

  it("jede beanstandete Zeile hat einen korrigierten Ersatz", () => {
    const alle = aktivDe.join(" | ");
    for (const [alt, neu] of DE_PAARE) expect(alle, `Ersatz fehlt für: ${alt}`).toMatch(neu);
  });

  it("die vier Fehl-Sorten laufen jetzt als satz, nicht als sprichwort", () => {
    for (const t of ["Kater Karl mag warme Milch.", "Mein Hut ist im Garten."]) {
      expect(isDeactivated("sprichwort", t), t).toBe(true);
      expect(
        CORPUS.some((e) => e.text === t && e.kind === "satz" && !isDeactivated(e.kind, e.text)),
        t,
      ).toBe(true);
    }
    // Die beiden verblosen Fragmente sind zu ganzen Sätzen geworden:
    expect(aktivDe).toContain("Im Gras liegen eine Ente, ein Igel und ein Hund.");
    expect(aktivDe).toContain("Im alten Haus wohnt eine Maus.");
  });

  it("Erstleser-Korrekturen bleiben früh servierbar (kein Tier-Rückschritt)", () => {
    // Die Originale lagen im T2-Satz; die Korrekturen dürfen Siebenjährige nicht
    // später erreichen als vorher.
    for (const t of [
      "Eine Wolke besteht aus feinem Wasser. Daraus wird der Regen.",
      "Eine Ente hat an den Beinen eine Schwimmhaut.",
      "Im Gras liegen eine Ente, ein Igel und ein Hund.",
      "Ein Hund riecht um ein Tausendfaches besser als ein Mensch.",
      "Junge Sonnenblumen wandern mit der Sonne, alte stehen nach Osten.",
    ])
      expect(minTierFor(t, "de"), t).toBeLessThanOrEqual(2);
  });
});

describe("TN-E12 Korrekturen Englisch", () => {
  it("keine der beanstandeten Fassungen wird noch serviert", () => {
    for (const [alt] of EN_PAARE) expect(aktivEn, alt).not.toContain(alt);
  });

  it("jede beanstandete Zeile hat einen korrigierten Ersatz", () => {
    const alle = aktivEn.join(" | ");
    for (const [alt, neu] of EN_PAARE) expect(alle, `Ersatz fehlt für: ${alt}`).toMatch(neu);
  });

  it("Korrekturen bleiben im T2-Satz (wie die Originale) und ohne Apostroph", () => {
    for (const e of EN_KORREKTUR_CORPUS) {
      expect(minTierFor(e.text, "de"), e.text).toBeLessThanOrEqual(2);
      expect(e.text, e.text).not.toMatch(/['’]/);
    }
  });
});

describe("TN-E12 Sorgfalt", () => {
  it("alle Korrekturen tragen Herkunft, Länge und Zeichensatz sind sauber", () => {
    for (const e of [...KORREKTUR_CORPUS, ...EN_KORREKTUR_CORPUS]) {
      expect(validateHerkunft(e.herkunft!), e.text).toEqual([]);
      expect(e.text.length, e.text).toBeLessThanOrEqual(85);
      expect(e.text, e.text).not.toMatch(/[„“”"«»…–—]/);
      expect(minTierFor(e.text, "de"), e.text).not.toBeNull();
    }
  });

  it("append-only: die stillgelegten Fassungen bleiben im Manifest", () => {
    const m = corpusManifest();
    for (const [alt] of DE_PAARE)
      expect(
        [...m.indexOf.keys()].some((id) =>
          ["fakt", "wissen", "wortspiel", "witz", "sprichwort", "satz"].some(
            (k) => bausteinId(k, alt) === id,
          ),
        ),
        alt,
      ).toBe(true);
  });
});
