/**
 * ════════════════════════════════════════════════════════════════════════════
 * EIN SPRACH-KONTEXT FÜR JEDE APP, HINTER IHREM EIGENEN PROBE-SCHALTER
 * (Bauplan 2026-11-06 §0 Nr. 4; verallgemeinert aus `simSprache.tsx` für
 * Klangpunkte, Schritt 2)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * `appSpracheBauen({ schalter, merker, sprachen })` liefert Provider, Hooks und
 * Wähler für EINE App. Jede App hat ihren eigenen Kontext und ihren eigenen
 * Speicher-Schlüssel: Eine Sprachwahl in den Sims stellt Klangpunkte nicht um
 * (und umgekehrt) - und keine stellt Tastenflow um (`tastenflow-bedienung`).
 *
 * Wahl, in dieser Reihenfolge: `?sprache=xx` · gemerkte Wahl · Browser-Sprache
 * · Deutsch. Ohne Probe-Schalter: immer Deutsch, kein Wähler, kein Blick auf
 * die Browser-Sprache, kein eigenes `lang` (die Seite bleibt Byte für Byte).
 *
 * Die Sims benutzen diese Fabrik (`simSprache.tsx`) mit unveränderten Namen.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { Icon } from "@/components/Icon";
import { FesteBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { SPRACHE_GEWECHSELT } from "@/lib/bedienSprache/BedienSpracheProvider";
import { useAnnounce } from "@/lib/a11y";
import { sprachKennung } from "@/lib/sprechen/stimmeFuer";
import { probeSchalterAn, type ProbeSchalter } from "@/lib/probeSchalter";

/** Alle 17 Sprachen von Tastenflow, in der Reihenfolge des Sprachwählers. */
export const ALLE_SPRACHEN: readonly BedienSprache[] = [
  "de", "en", "fr", "es", "it", "pt", "br", "nl", "sv", "pl", "cs", "hu", "ro", "bg", "el", "tr", "uk",
];

/** Wie jede Sprache sich selbst nennt (gleich wie der Sprachwähler von Tastenflow). */
export const SPRACH_SELBSTNAME: Readonly<Record<BedienSprache, string>> = {
  de: "Deutsch", en: "English", fr: "Français", es: "Español", it: "Italiano", pl: "Polski",
  tr: "Türkçe", cs: "Čeština", bg: "Български", el: "Ελληνικά", hu: "Magyar", nl: "Nederlands",
  pt: "Português (Portugal)", br: "Português (Brasil)", ro: "Română", sv: "Svenska", uk: "Українська",
};

/** Beschriftung des Wählers - in der gerade gewählten Sprache. */
export const WAEHLER_NAME: Readonly<Record<BedienSprache, string>> = {
  de: "Sprache", en: "Language", fr: "Langue", es: "Idioma", it: "Lingua", pl: "Język",
  tr: "Dil", cs: "Jazyk", bg: "Език", el: "Γλώσσα", hu: "Nyelv", nl: "Taal",
  pt: "Idioma", br: "Idioma", ro: "Limbă", sv: "Språk", uk: "Мова",
};

/** Eine Browser-Sprache (`pt-BR`, `fr-CA`, `uk`) auf eine der erlaubten abbilden. */
export function browserSpracheAus(tag: string, erlaubt: readonly BedienSprache[]): BedienSprache | null {
  const t = tag.toLowerCase().replace("_", "-");
  if (t === "pt-br") return erlaubt.includes("br") ? "br" : null;
  const grund = t.slice(0, 2) as BedienSprache;
  return erlaubt.includes(grund) ? grund : null;
}

export function anfangsSpracheAus(
  opts: { suche: string; gemerkt: string | null; browser: readonly string[] },
  erlaubt: readonly BedienSprache[],
): BedienSprache {
  const ist = (x: string | null | undefined): x is BedienSprache => !!x && (erlaubt as readonly string[]).includes(x);
  const adresse = new URLSearchParams(opts.suche).get("sprache");
  if (ist(adresse)) return adresse;
  if (ist(opts.gemerkt)) return opts.gemerkt;
  for (const b of opts.browser) {
    const s = browserSpracheAus(b, erlaubt);
    if (s) return s;
  }
  // ★ 10.11.2026: im Zweifel Englisch (nicht Deutsch) - auch wenn der Browser keine Sprache meldet.
  // Hat die App kein Englisch (Punktgenau), bleibt es Deutsch: nie eine Sprache wählen, die es dort nicht gibt.
  return ist("en") ? "en" : "de";
}

/**
 * ★ 10.11.2026: EINE Wahl für die ganze Plattform. Wer in einer App (oder auf der
 * Startseite) eine Sprache wählt, bekommt sie in jeder anderen App, in der er noch
 * nicht selbst gewählt hat. Die eigene Merkstelle der App geht vor.
 */
export const GEMEINSAMER_SPRACH_MERKER = "weingartner-sprache";

export interface AppSpracheWert {
  sprache: BedienSprache;
  /** Ist der Probe-Schalter an? Nur dann gibt es den Sprachwähler. */
  an: boolean;
  setSprache: (s: BedienSprache) => void;
  /** Welche Sprachen der Wähler hier anbietet (Vorgabe: alle der App; eine Seite darf weniger anbieten). */
  sprachen?: readonly BedienSprache[];
}

export interface AppSpracheEinstellung {
  schalter: ProbeSchalter;
  /** Schlüssel im localStorage für die gemerkte Wahl. */
  merker: string;
  /** Die fertigen Sprachen - der Wähler bietet nur diese an. */
  sprachen: readonly BedienSprache[];
  /** Wird bei jedem Rendern des Providers aufgerufen, bevor die Kinder zeichnen. */
  beiSprache?: (s: BedienSprache) => void;
}

export function appSpracheBauen(cfg: AppSpracheEinstellung) {
  const Kontext = createContext<AppSpracheWert>({ sprache: "de", an: false, setSprache: () => {} });

  function schalterAn(suche?: string): boolean {
    return probeSchalterAn(cfg.schalter, suche);
  }

  /**
   * `sprachen`: Seiten, die nur einen Teil der Sprachen wirklich haben (Plattform-Startseite: de, en),
   * bieten im Wähler auch nur diese an - nie eine Sprache, in der der Seitentext englisch bliebe.
   */
  function Provider({ children, sprachen }: { children: ReactNode; sprachen?: readonly BedienSprache[] }) {
    const erlaubt = sprachen ?? cfg.sprachen;
    const [an] = useState(() => {
      try {
        // ★ 10.11.2026: Die feste Einbettung `?bare=1` (Workshop-Arbeitshefte) bleibt Deutsch, solange
        // niemand `?sprache=xx` mitgibt - sonst schaltete ein englischer Browser ein Arbeitsblatt um.
        const q = new URLSearchParams(window.location.search);
        if (q.get("bare") === "1" && !q.get("sprache")) return false;
        return schalterAn(window.location.search);
      } catch {
        return false;
      }
    });
    const [sprache, setRoh] = useState<BedienSprache>(() => {
      if (!an) return "de";
      let gemerkt: string | null = null;
      try {
        gemerkt = window.localStorage.getItem(cfg.merker) ?? window.localStorage.getItem(GEMEINSAMER_SPRACH_MERKER);
      } catch {
        /* Speicher gesperrt */
      }
      let browser: readonly string[] = [];
      try {
        browser = navigator.languages?.length ? navigator.languages : [navigator.language];
      } catch {
        /* kein navigator */
      }
      return anfangsSpracheAus({ suche: window.location.search, gemerkt, browser }, erlaubt);
    });
    const announce = useAnnounce();
    const setSprache = useCallback((s: BedienSprache) => {
      setRoh(s);
      try {
        window.localStorage.setItem(cfg.merker, s);
        window.localStorage.setItem(GEMEINSAMER_SPRACH_MERKER, s);
      } catch {
        /* Speicher gesperrt - dann gilt die Wahl nur bis zum Neuladen */
      }
    }, []);
    // Der Sprachwähler der Kopfzeile: umstellen, merken und es in der NEUEN Sprache sagen (Live-Region).
    const wechsle = useCallback(
      (s: BedienSprache) => {
        setSprache(s);
        announce(SPRACHE_GEWECHSELT[s]);
      },
      [setSprache, announce],
    );
    const wert = useMemo(() => ({ sprache: an ? sprache : ("de" as const), an, setSprache, sprachen: erlaubt }), [an, sprache, setSprache, erlaubt]);
    cfg.beiSprache?.(wert.sprache);
    // Ohne Schalter: kein eigenes `lang`, die Seite bleibt Byte für Byte wie bisher.
    if (!an) return <Kontext.Provider value={wert}>{children}</Kontext.Provider>;
    return (
      <Kontext.Provider value={wert}>
        {/* Kopfzeile, Melden, Fusszeile und Hilfe (gemeinsame Teile) sprechen dieselbe Sprache. */}
        <FesteBedienSprache sprache={wert.sprache} onWechsel={wechsle} optionen={erlaubt}>
          <div lang={sprachKennung(wert.sprache)}>{children}</div>
        </FesteBedienSprache>
      </Kontext.Provider>
    );
  }

  const useWert = () => useContext(Kontext);
  const useSprache = (): BedienSprache => useContext(Kontext).sprache;

  /**
   * Der Sprachwähler für die Kopfzeile. Ohne Schalter erscheint er nicht. Eine
   * Auswahlliste: mit Tastatur bedienbar, der Screenreader nennt Name und Wert;
   * jeder Eintrag trägt sein eigenes `lang`.
   */
  function Waehler() {
    const { an, sprache, setSprache, sprachen } = useWert();
    const [offen, setOffen] = useState(false);
    const knopf = useRef<HTMLButtonElement>(null);
    const liste = useRef<HTMLDivElement>(null);
    const alle = sprachen ?? cfg.sprachen;

    // Schliessen mit Esc (Fokus zurück auf den Knopf) und beim Klick daneben.
    useEffect(() => {
      if (!offen) return;
      const taste = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOffen(false);
          knopf.current?.focus();
        }
      };
      const klick = (e: MouseEvent) => {
        const ziel = e.target as Node;
        if (!liste.current?.contains(ziel) && !knopf.current?.contains(ziel)) setOffen(false);
      };
      document.addEventListener("keydown", taste);
      document.addEventListener("mousedown", klick);
      // Der Fokus geht auf die gewählte Sprache.
      liste.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
      return () => {
        document.removeEventListener("keydown", taste);
        document.removeEventListener("mousedown", klick);
      };
    }, [offen]);

    if (!an) return null;

    /** Pfeiltasten bewegen den Fokus in der Liste. */
    const listeTaste = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const eintraege = Array.from(liste.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
      const i = eintraege.indexOf(document.activeElement as HTMLElement);
      if (e.key === "ArrowDown") eintraege[(i + 1) % eintraege.length]?.focus();
      else if (e.key === "ArrowUp") eintraege[(i - 1 + eintraege.length) % eintraege.length]?.focus();
      else if (e.key === "Home") eintraege[0]?.focus();
      else if (e.key === "End") eintraege[eintraege.length - 1]?.focus();
      else return;
      e.preventDefault();
    };

    // ★ 10.11.2026 (Johannes): nur ein Sinnbild - Weltkugel und Kürzel, rund wie die anderen Kopfzeilen-Knöpfe.
    return (
      <div className="relative inline-flex">
        <button
          ref={knopf}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={offen}
          aria-label={`${WAEHLER_NAME[sprache]} (${SPRACH_SELBSTNAME[sprache]})`}
          onClick={() => setOffen((o) => !o)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-raised text-ink transition-colors hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span aria-hidden="true" className="flex flex-col items-center leading-none">
            <Icon name="globe" className="h-4 w-4" />
            <span className="mt-px text-[11px] font-bold">{sprache === "br" ? "PT-BR" : sprache.toUpperCase()}</span>
          </span>
        </button>
        {offen && (
          <div
            ref={liste}
            role="listbox"
            aria-label={WAEHLER_NAME[sprache]}
            onKeyDown={listeTaste}
            className="absolute right-0 top-full z-30 mt-1 w-52 rounded-xl border border-hairline bg-surface-raised p-1.5 shadow-lg"
          >
            {alle.map((s) => (
              <button
                key={s}
                type="button"
                role="option"
                lang={sprachKennung(s)}
                aria-selected={s === sprache}
                onClick={() => {
                  setOffen(false);
                  setSprache(s);
                  knopf.current?.focus();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span className="min-w-0 flex-1">{SPRACH_SELBSTNAME[s]}</span>
                {s === sprache && <span aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return { Provider, Waehler, useWert, useSprache, schalterAn, sprachen: cfg.sprachen };
}
