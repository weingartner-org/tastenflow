/**
 * D-9 (28.09.2026): der Abschnitt „4b" der Lehrkraft-Hilfe in allen vier
 * Sprachen - wie oft, wie lange, wie schnell, warum diese Reihenfolge. Die
 * Sätze stehen EINMAL in `lib/typing/didaktikHinweise.ts`; dieselben stehen im
 * Handbuch.
 */
import type { Lang } from "@/lib/typing";
import { didaktikHinweise } from "@/lib/typing/didaktikHinweise";
import { wahlTexte } from "@/lib/typing/wahltaste";

/** Der Abschnittstitel mit Nummer - dieselbe Zählung in allen vier Hilfen. */
export function didaktikAbschnittTitel(lang: Lang): string {
  // ★ SPRACHEN-9 (30.10.2026): „·" liest eine griechische Stimme als Ano Teleia (Satzzeichen) - dort ein Bindestrich.
  return `4b ${lang === "el" ? "-" : "·"} ${didaktikHinweise(lang).titel}`;
}

export function DidaktikInhalt({ lang }: { lang: Lang }) {
  // ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): am Mac „Wahl" statt „Alt" im Text (`wahlTexte`).
  //   Das Handbuch liest dieselben Sätze unverändert (es erklärt die Wahltaste in Anhang D).
  const h = wahlTexte(didaktikHinweise(lang), lang);
  return (
    <>
      {h.punkte.map((p) => (
        <p key={p.id} className="m-0">
          <strong>{p.kopf}</strong> {p.text}
        </p>
      ))}
      <p className="m-0 text-sm text-ink-muted">
        {h.quellenKopf}: {h.quellen.join(lang === "el" ? " - " : " · ")}
      </p>
    </>
  );
}
