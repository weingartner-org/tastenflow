import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Sym, SymbolKnopf, type SymbolName, type HinweisOrt } from "@/components/gemeinsam/Symbole";

/**
 * Kleines Menü hinter einem Symbol-Knopf ("Mehr"). Tastatur: Enter/Leertaste/Pfeil unten
 * öffnet, Pfeile wandern, Esc schließt und der Fokus kehrt zum Knopf zurück. Ein Eintrag
 * kann ein Untermenü sein (z. B. "Verschieben nach ..."): es erscheint im selben Menü,
 * ein Eintrag "Zurück" führt wieder heraus.
 */
export interface MenuEintrag {
  label: string;
  symbol?: SymbolName;
  onClick?: () => void;
  gefahr?: boolean;
  /** Untermenü: statt `onClick`. */
  unter?: MenuEintrag[];
  /** Nur Anzeige (z. B. "Keine Ziele"). */
  inaktiv?: boolean;
}

export function MenuKnopf({
  symbol = "mehr",
  hinweis,
  name,
  eintraege,
  ort = "oben",
  groesse = 36,
  extra,
  rechts = true,
  nachOben = false,
  className = "",
}: {
  symbol?: SymbolName;
  hinweis: string;
  name?: string;
  eintraege: MenuEintrag[];
  ort?: HinweisOrt;
  groesse?: 30 | 32 | 36 | 40 | 44;
  extra?: React.ReactNode;
  /** Menü am rechten Rand des Knopfes ausrichten (sonst links). */
  rechts?: boolean;
  /** Menü über dem Knopf aufklappen (für Knöpfe am unteren Rand, z. B. im Chat). */
  nachOben?: boolean;
  className?: string;
}) {
  const [offen, setOffen] = useState(false);
  const [ebene, setEbene] = useState<MenuEintrag[] | null>(null);
  const wurzel = useRef<HTMLSpanElement>(null);
  const liste = useRef<HTMLUListElement>(null);
  const menuId = useId();

  function schliessen(zumKnopf: boolean) {
    setOffen(false);
    setEbene(null);
    if (zumKnopf) wurzel.current?.querySelector("button")?.focus();
  }

  // Klick daneben und Hinaustabben schließen.
  useEffect(() => {
    if (!offen) return;
    const beiKlick = (e: MouseEvent) => {
      if (!wurzel.current?.contains(e.target as Node)) schliessen(false);
    };
    const beiFokus = (e: FocusEvent) => {
      if (e.target instanceof Node && !wurzel.current?.contains(e.target)) schliessen(false);
    };
    document.addEventListener("mousedown", beiKlick);
    document.addEventListener("focusin", beiFokus);
    return () => {
      document.removeEventListener("mousedown", beiKlick);
      document.removeEventListener("focusin", beiFokus);
    };
  }, [offen]);

  // Beim Öffnen und beim Ebenenwechsel: ersten Eintrag fokussieren.
  useEffect(() => {
    if (offen) liste.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus();
  }, [offen, ebene]);

  function beiTaste(e: ReactKeyboardEvent<HTMLUListElement>) {
    const items = [...(liste.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      schliessen(true);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Tab") {
      schliessen(false);
    }
  }

  const aktuell = ebene ?? eintraege;
  return (
    <span ref={wurzel} className={`relative inline-flex ${className}`}>
      <SymbolKnopf
        symbol={symbol}
        hinweis={hinweis}
        name={name}
        ort={ort}
        groesse={groesse}
        aufgeklappt={offen}
        extra={extra}
        onClick={() => (offen ? schliessen(true) : setOffen(true))}
      />
      {offen ? (
        <ul
          ref={liste}
          id={menuId}
          role="menu"
          aria-label={name ?? hinweis}
          onKeyDown={beiTaste}
          className={`absolute z-40 max-h-72 min-w-[13rem] overflow-y-auto rounded-xl border border-hairline bg-surface p-1 text-sm shadow-lg ${
            nachOben ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } ${rechts ? "right-0" : "left-0"}`}
        >
          {ebene ? (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => setEbene(null)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-ink-muted hover:bg-surface-sunken focus-visible:bg-surface-sunken"
              >
                <Sym name="zurueck" size={16} />
                Zurück
              </button>
            </li>
          ) : null}
          {aktuell.map((e) => (
            <li key={e.label} role="none">
              <button
                type="button"
                role="menuitem"
                aria-disabled={e.inaktiv ? "true" : undefined}
                aria-haspopup={e.unter ? "menu" : undefined}
                onClick={() => {
                  if (e.inaktiv) return;
                  if (e.unter) {
                    setEbene(e.unter);
                    return;
                  }
                  schliessen(true);
                  e.onClick?.();
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left ${
                  e.inaktiv
                    ? "cursor-default text-ink-muted"
                    : e.gefahr
                      ? "text-danger hover:bg-danger-soft focus-visible:bg-danger-soft"
                      : "text-ink hover:bg-surface-sunken focus-visible:bg-surface-sunken"
                }`}
              >
                {e.symbol ? <Sym name={e.symbol} size={16} /> : <span className="w-4" aria-hidden="true" />}
                <span className="min-w-0 flex-1 truncate">{e.label}</span>
                {e.unter ? <Sym name="weiter" size={14} /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </span>
  );
}
