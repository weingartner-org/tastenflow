/**
 * ★ GEZIELT ÜBEN (13.11.2026, Bauplan §4): die AUSWAHL-TASTATUR des Dialogs `GezieltDialog`.
 *
 * Bewusst ein EIGENES Bauteil und nicht `Keyboard.tsx`: Diese Tastatur zeigt nichts an (keine nächste Taste, keine
 * gedrückte Taste), sie WÄHLT. Jede Taste ist ein echter `<button aria-pressed>` mit dem Namen des Zeichens; leere
 * Stellen (auf dieser Ebene liegt dort nichts) sind kein Knopf. Gezeichnet wird aus der eingestellten Tastatur
 * (`layout.rows` + `layout.access`) - EINE Quelle, keine zweite Belegung.
 *
 * Drei Ebenen als Reiter (`role="tablist"`): Normal · Mit Umschalt · Mit AltGr. Die Umschalt-Ebene zeigt die
 * SYMBOLE (Buchstaben mit Umschalt sind dasselbe Zeichen wie ohne - die Runde rechnet Klein, `gezieltFuerRunde`); die
 * AltGr-Ebene alles, was dort liegt, auch Buchstaben (polnisch ą ę ł …). Der Reiter „Mit AltGr" fehlt, wo es nichts
 * auf AltGr gibt.
 */
import { useId, useMemo, useState } from "react";
import { FINGERS, fingerForChar, spokenLabel } from "@/lib/typing/fingers";
import type { KeyboardLayout } from "@/lib/typing/layouts";
import type { Lang } from "@/lib/typing/account";
import type { GezieltTexte } from "@/lib/typing/gezieltTexte";

export type GezieltEbene = "normal" | "umschalt" | "altgr";

interface TastenZelle {
  /** Das Zeichen auf dieser Ebene - `null` = dort liegt nichts. */
  zeichen: string | null;
}

/** Ein Zeichen ohne Gross-/Kleinform bzw. ein Symbol - sonst wäre Umschalt + Buchstabe nur ein Doppelgänger. */
function istBuchstabe(z: string): boolean {
  return /\p{L}/u.test(z);
}

/** Die Zellen jeder Reihe auf einer Ebene, aus den Daten der Tastatur gerechnet. */
export function ebenenZellen(layout: KeyboardLayout, ebene: GezieltEbene): TastenZelle[][] {
  const eintraege = Object.entries(layout.access);
  return layout.rows.map((reihe) =>
    reihe.keys.map((basis): TastenZelle => {
      if ([...basis].length !== 1) return { zeichen: null };
      if (ebene === "normal") return { zeichen: basis };
      if (ebene === "umschalt") {
        const treffer = eintraege.find(
          ([z, a]) => a.mod === "shift" && a.base === basis && [...z].length === 1 && !istBuchstabe(z),
        );
        return { zeichen: treffer ? treffer[0] : null };
      }
      const treffer = eintraege.find(
        ([z, a]) => a.mod === "altgr" && !a.mitUmschalt && a.base === basis && [...z].length === 1,
      );
      return { zeichen: treffer ? treffer[0] : null };
    }),
  );
}

/** Gibt es auf dieser Ebene überhaupt etwas zu wählen? */
export function ebeneHatZeichen(layout: KeyboardLayout, ebene: GezieltEbene): boolean {
  return ebenenZellen(layout, ebene).some((r) => r.some((z) => z.zeichen !== null && fingerForChar(z.zeichen) !== null));
}

const EBENEN: readonly GezieltEbene[] = ["normal", "umschalt", "altgr"];

export function GezieltTastatur({
  layout,
  sprache,
  gewaehlt,
  onUmschalten,
  texte,
  farben,
  ebeneAnfang = "normal",
}: {
  layout: KeyboardLayout;
  sprache: Lang;
  gewaehlt: readonly string[];
  /** Eine Taste wurde gewählt oder wieder weggenommen. */
  onUmschalten: (zeichen: string) => void;
  texte: GezieltTexte;
  /** Fingerfarben zeigen (nur in Hell/Dunkel; die Kontrast-Modi leben von ihren eigenen Paaren). */
  farben: boolean;
  ebeneAnfang?: GezieltEbene;
}) {
  const idBasis = useId();
  const sichtbar = useMemo(() => EBENEN.filter((e) => e === "normal" || ebeneHatZeichen(layout, e)), [layout]);
  const [ebeneWahl, setEbene] = useState<GezieltEbene>(ebeneAnfang);
  const ebene = sichtbar.includes(ebeneWahl) ? ebeneWahl : "normal";
  const zellen = useMemo(() => ebenenZellen(layout, ebene), [layout, ebene]);
  const reiterName: Record<GezieltEbene, string> = {
    normal: texte.reiterNormal,
    umschalt: texte.reiterUmschalt,
    altgr: texte.reiterAltgr,
  };

  return (
    <div>
      <div role="tablist" aria-label={texte.tastaturName} className="mb-2 flex flex-wrap gap-1">
        {sichtbar.map((e, i) => (
          <button
            key={e}
            type="button"
            role="tab"
            id={`${idBasis}-reiter-${e}`}
            aria-selected={ebene === e}
            aria-controls={`${idBasis}-tafel`}
            className={(ebene === e ? "btn-primary" : "btn-secondary") + " btn-toggle"}
            onClick={() => setEbene(e)}
            onKeyDown={(ev) => {
              // Pfeiltasten wechseln den Reiter (und nehmen den Fokus mit) - Tab geht weiter zu den Tasten.
              if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
              ev.preventDefault();
              const n = sichtbar[(i + (ev.key === "ArrowRight" ? 1 : sichtbar.length - 1)) % sichtbar.length];
              setEbene(n);
              requestAnimationFrame(() => document.getElementById(`${idBasis}-reiter-${n}`)?.focus());
            }}
          >
            {reiterName[e]}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${idBasis}-tafel`}
        aria-labelledby={`${idBasis}-reiter-${ebene}`}
        className="flex flex-col gap-1"
      >
        {zellen.map((reihe, ri) => (
          <div key={ri} className="flex flex-wrap gap-1" style={{ paddingLeft: `${ri * 0.9}rem` }}>
            {reihe.map((zelle, ki) => {
              const z = zelle.zeichen;
              const finger = z ? fingerForChar(z) : null;
              if (!z || !finger) {
                // Leere Stelle: kein Knopf (nichts wird `disabled`), nur Platz.
                return <span key={ki} aria-hidden="true" className="inline-block h-9 w-9" />;
              }
              const an = gewaehlt.includes(z);
              return (
                <button
                  key={ki}
                  type="button"
                  aria-pressed={an}
                  aria-label={spokenLabel(z, sprache)}
                  className={
                    (an ? "btn-primary" : "btn-secondary") +
                    " btn-toggle inline-flex !min-h-0 h-9 w-9 items-center justify-center !px-0 font-legible text-base font-semibold"
                  }
                  style={farben ? { borderBottomColor: FINGERS[finger.id].farbe, borderBottomWidth: 4 } : undefined}
                  data-zeichen={z}
                  onClick={() => onUmschalten(z)}
                >
                  <span aria-hidden="true">{z}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
