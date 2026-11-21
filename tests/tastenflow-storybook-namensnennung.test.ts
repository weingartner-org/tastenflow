/**
 * ★★ AFRICAN STORYBOOK - die Namensnennung auch auf Englisch (23.09.2026).
 * Anlass: Die Afrika-Recherche fand, dass die Quellenzeile der sechzehn
 * Storybook-Serien in der ENGLISCHEN Bedienung deutsch war („über Storybooks
 * Canada", „Nacherzählung") und nur Autorinnen/Autoren nannte. Die Lizenz des
 * African Storybook verlangt „writers, illustrators, translators".
 *  1. Jede Storybook-Serie nennt Titel des Originals, Autor/in und Illustration.
 *  2. Jede hat eine englische Fassung ohne deutsche Wörter.
 *  3. GEGENPROBE: DEUTSCHE Serien (lang "de") haben keine englische Angabe -
 *     dort gäbe es nichts zu übersetzen, das eine englische Bedienung braucht.
 *
 * ★ Nachtrag (24.09.2026, Nachtlauf englischer Lehrgang): „(noch)" im Satz
 * oben hat sich erledigt - die GEGENPROBE galt bis dahin für ALLE Serien
 * ausser den African-Storybook-Nacherzählungen und deckte damit einen echten
 * Fund der Nacht auf: die selbst verfassten ENGLISCHEN Serien/Korpora
 * (`quelle: "Sensorik"`, `lizenz: "Eigenes Werk …"`) zeigten in der
 * englischen Bedienung ohne `.en`-Feld ihre DEUTSCHE Eigenangabe („Eigenes
 * Werk (selbst verfasst)" · „mit KI-Unterstützung, redaktionell geprüft").
 * Jetzt haben auch sie ein `.en`-Feld (SerienTrainer.tsx zeigt es, samt dem
 * englischen KI-Hinweis) - die Gegenprobe gilt seither nur noch für echte
 * DEUTSCHE Serien (`lang !== "en"`), die nie eine englische Angabe brauchen.
 */
import { describe, expect, it } from "vitest";
import { SERIEN } from "@/lib/typing/serien";

const asb = SERIEN.filter((s) => s.herkunft?.quelle.startsWith("African Storybook"));

describe("African Storybook - Namensnennung", () => {
  it("es sind sechzehn englische (G1) und vier deutsche Serien", () => {
    expect(asb.length).toBe(20);
    expect(asb.filter((s) => s.lang === "en").length).toBe(16);
  });
  it("die deutschen nennen auch die Übersetzung und die RICHTIGE Lizenz (3.0 bei drei von vier)", () => {
    const de = asb.filter((s) => s.lang === "de");
    expect(de.length).toBe(4);
    for (const s of de) expect(s.herkunft!.autor, s.slug).toMatch(/Übersetzung \S/);
    expect(de.filter((s) => s.herkunft!.lizenz.startsWith("CC BY 3.0")).length).toBe(3);
  });
  it("jede nennt Originaltitel, Autor/in und Illustration - deutsch und englisch", () => {
    for (const s of asb) {
      const h = s.herkunft!;
      expect(h.quelle, s.slug).toMatch(/African Storybook \(„.+"\)/);
      expect(h.autor, s.slug).toMatch(/Illustration \S/);
      expect(h.en, s.slug).toBeDefined();
      expect(h.en!.quelle, s.slug).toMatch(/^African Storybook \(".+"\), via Storybooks (Canada|Deutschland)$/);
      expect(h.en!.autor, s.slug).toMatch(/^(Written by .+, illustrated by|.+folktale.*; illustrated by) .+; retold for typing practice by Sensorik$/);
      expect(h.en!.autor, s.slug).not.toMatch(/Written by .*folktale|Volksmärchen/i);
      expect(h.en!.lizenz, s.slug).toMatch(/^CC BY [34]\.0/);
    }
  });
  it("die englische Fassung enthält kein deutsches Wort", () => {
    for (const s of asb) {
      const text = Object.values(s.herkunft!.en!).join(" ");
      expect(text, s.slug).not.toMatch(/über|Nacherzählung|gekürzt|Tippzeilen|wörtliche|Illustration /);
    }
  });
  it("Sakima: Ursula Nafula, illustriert von Peris Wachuka (von der Originalseite abgelesen)", () => {
    const s = asb.find((x) => x.slug === "en-g1-sakimas-song")!;
    expect(s.herkunft!.en!.autor).toBe(
      "Written by Ursula Nafula, illustrated by Peris Wachuka (original); retold for typing practice by Sensorik",
    );
  });
  it("Lizenz je Geschichte wie auf der Originalseite: 9 x 3.0, 7 x 4.0 bei den englischen", () => {
    const en = asb.filter((s) => s.lang === "en");
    expect(en.filter((s) => s.herkunft!.lizenz.startsWith("CC BY 3.0")).length).toBe(9);
    expect(en.filter((s) => s.herkunft!.lizenz.startsWith("CC BY 4.0")).length).toBe(7);
    for (const s of en) expect(s.herkunft!.en!.lizenz.slice(0, 9), s.slug).toBe(s.herkunft!.lizenz.slice(0, 9));
  });
  it("GEGENPROBE: echte DEUTSCHE Serien haben keine englische Angabe", () => {
    const deutsche = SERIEN.filter(
      (s) => s.herkunft && !s.herkunft.quelle.startsWith("African Storybook") && s.lang !== "en",
    );
    expect(deutsche.length).toBeGreaterThan(0);
    expect(deutsche.some((s) => s.herkunft!.en)).toBe(false);
  });
});
