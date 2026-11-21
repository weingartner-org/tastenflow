/**
 * ★ GEZIELT ÜBEN (13.11.2026, Bauplan §4): das Schildchen „Gezielt: ö ä ß ?" in der Stand-Zeile unter dem Übungsfeld,
 * dazu - nur wo die Person es selbst ändern darf - der Knopf „Ändern" (öffnet den Dialog, Fokus kommt dorthin zurück).
 *
 * Für Sprachausgabe und Braillezeile stehen die AUSGESCHRIEBENEN Namen da („Fragezeichen", nicht „?"); die Zeichen
 * selbst sind für sie unsichtbar. Gesprochen wird beim Rundenstart einmal (`useGezieltSteuerung`), nie bei jedem
 * Anschlag und nie in einem Live-Bereich (Braillezeile-Regel 09.09.2026).
 */
import { useBedienSprache } from "@/lib/bedienSprache";
import { FINGERS, fingerForChar, spokenLabel } from "@/lib/typing/fingers";
import { GEZIELT_TEXTE } from "@/lib/typing/gezieltTexte";

export function GezieltSchild({
  zeichen,
  darfAendern,
  onAendern,
  farben,
}: {
  zeichen: readonly string[];
  darfAendern: boolean;
  onAendern: () => void;
  farben: boolean;
}) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = GEZIELT_TEXTE[sprache];
  if (zeichen.length === 0) return null;
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1" data-gezielt-schild="">
      <span>{t.schild}</span>
      <span className="sr-only">{zeichen.map((z) => spokenLabel(z, sprache)).join(", ")}</span>
      <span aria-hidden="true" className="flex items-center gap-1">
        {zeichen.map((z) => {
          const finger = fingerForChar(z);
          return (
            <span
              key={z}
              className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-hairline bg-surface px-1 font-legible text-sm font-semibold text-ink"
              style={farben && finger ? { borderBottomColor: FINGERS[finger.id].farbe, borderBottomWidth: 3 } : undefined}
            >
              {z}
            </span>
          );
        })}
      </span>
      {darfAendern && (
        <button type="button" className="btn-secondary btn-toggle standzeile-schalter" onClick={onAendern}>
          {t.aendern}
        </button>
      )}
    </span>
  );
}
