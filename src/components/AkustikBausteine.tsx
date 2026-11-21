/**
 * Die Bausteine des Akustik-Menüs unter dem Lautsprecher der Kopfzeile -
 * EINMAL für alle Apps (Plus, Punktgenau, Klangpunkte, »Im Griff«).
 *
 * ★ Johannes, 17.10.2026: „unter dem runden Lautsprecher-Schalter ein Menü mit
 * allen Akustik-Einstellungen mit Schiebereglern und Erklärung beim
 * Darüberfahren" - zuerst für Plus, am selben Abend für alle Apps der
 * Lernwerkstatt. Was hier steht, wurde in Plus gemessen und gilt überall:
 *
 *  - Schalter sind `role="switch"` - die Sprachausgabe sagt „an" oder „aus".
 *  - Regler sagen ihren Wert in Worten (`aria-valuetext`), Pfeiltasten
 *    verschieben in kleinen Schritten. Nach dem Loslassen kommt eine Hörprobe,
 *    die die App bestimmt (nur, wenn das Geprobte an ist).
 *  - Die Erklärung kommt aus dem `Tipp`-Baustein und hängt per
 *    `aria-describedby` am Element. ★ Gemessen: Beim Aufklappen setzt die
 *    Kopfzeile den Fokus auf den ersten Schalter - und dessen Erklärung ging
 *    sofort auf und deckte die Regler zu. Darum erscheint sie beim
 *    Darüberfahren genau unter dem Zeiger, beim Fokus erst, wenn im Menü eine
 *    Taste gedrückt wurde (`AkustikRahmen`).
 *
 * Den Inhalt (welche Einstellungen) bestimmt jede App selbst; die Kopfzeile
 * zeichnet nur Knopf, Aufklappen, Escape und Fokus-Rückkehr
 * (`akustikMenue` in `AppKopfzeile.tsx`).
 */
import { altAnzeige } from "@/lib/altTaste";
import { createContext, useContext, useId, useState, type ReactNode } from "react";
import { Tipp } from "@/components/Tipp";

/**
 * ★ Der Name des Lautsprecher-Knopfs, wenn er das Menü öffnet - in ALLEN Apps
 * gleich (Johannes, 18.10.2026: „der Lautsprecher-Knopf heißt in allen Apps
 * Klang und Vorlesen wie in Tastenflow"). Tastenflow hat ihn mehrsprachig in
 * `AKUSTIK_TEXTE`; der deutsche Wortlaut dort ist dieser.
 */
export const AKUSTIK_KNOPF_NAME = "Klang und Vorlesen";

/** Der Hinweis am Knopf - mit dem Kürzel in der Schreibweise der Plattform. */
export const akustikKnopfTipp = (vorlesenKuerzel = "Alt + V") =>
  `Klang und Vorlesen einstellen (${vorlesenKuerzel} schaltet das Vorlesen)`;

/** Wurde im Menü schon eine Taste gedrückt? Erst dann zeigt der Fokus Erklärungen. */
const TastaturBenutzt = createContext(true);

/** „1,2-fach" - mit Komma, wie man es sagt. */
export function tempoText(t: number): string {
  const zahl = t.toFixed(1).replace(".", ",");
  return Math.abs(t - 1) < 0.001 ? `${zahl}-fach, normal` : `${zahl}-fach`;
}

export function prozentText(v: number): string {
  return `${Math.round(v * 100)} Prozent`;
}

/** Der kurze sichtbare Wert der schlanken Regler: „70 %". Gesagt wird `prozentText`. */
export function kurzProzent(v: number): string {
  return `${Math.round(v * 100)} %`;
}

/** Der Rahmen um den Inhalt: Überschrift und die Tastatur-Regel für die Erklärungen. */
export function AkustikRahmen({
  titel = AKUSTIK_KNOPF_NAME,
  titelSichtbar = true,
  children,
}: {
  titel?: string;
  /**
   * `false` (Tastenflow, 18.10.2026): schlankes Menü ohne Kopfzeile - der Knopf
   * trägt den Namen schon. Die Überschrift bleibt für Screenreader im Baum.
   */
  titelSichtbar?: boolean;
  children: ReactNode;
}) {
  const [tastatur, setTastatur] = useState(false);
  return (
    <div className={titelSichtbar ? "space-y-1" : "flex flex-col gap-2"} onKeyDown={() => setTastatur(true)}>
      <p
        className={
          titelSichtbar
            ? "m-0 px-2 pb-1 pt-0.5 text-sm font-semibold uppercase tracking-wide text-ink-muted"
            : "sr-only"
        }
      >
        {titel}
      </p>
      <TastaturBenutzt.Provider value={tastatur}>{children}</TastaturBenutzt.Provider>
    </div>
  );
}

/** Eine feine Linie zwischen Gruppen - reine Optik. */
export function AkustikTrenner() {
  return <div aria-hidden="true" className="mx-2 my-1 h-px bg-hairline" />;
}

/** Die Erklärung: beim Darüberfahren sofort, beim Fokus erst nach der ersten Taste. */
function useErklaerungZeigen() {
  const tastatur = useContext(TastaturBenutzt);
  const [zeiger, setZeiger] = useState(false);
  return {
    unterdruecken: !tastatur && !zeiger,
    zeigerProps: { onPointerEnter: () => setZeiger(true), onPointerLeave: () => setZeiger(false) },
  };
}

/**
 * ★ Symbole für das schlanke Menü (Tastenflow, 18.10.2026). Johannes: „mit
 * Symbolen bei Lautstärke und nicht immer den ganzen Text". Rein dekorativ
 * (`aria-hidden`) - der Name steht am Bedienelement (`aria-label`).
 */
export type AkustikSymbolName =
  | "lautsprecher"
  | "lautsprecherLeise"
  | "vorlesen"
  | "glocke"
  | "tastatur"
  | "note"
  | "tempo"
  | "stimme"
  | "welle"
  | "liste";

const SYMBOL_PFADE: Record<AkustikSymbolName, ReactNode> = {
  lautsprecher: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 9a4 4 0 010 6" />
      <path d="M19 6.5a8 8 0 010 11" />
    </>
  ),
  lautsprecherLeise: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 9a4 4 0 010 6" />
    </>
  ),
  vorlesen: (
    <>
      <path d="M5 5h14a1 1 0 011 1v9a1 1 0 01-1 1H10l-5 4v-4a1 1 0 01-1-1V6a1 1 0 011-1z" />
      <path d="M8.5 9.5h7" />
      <path d="M8.5 12.5h4" />
    </>
  ),
  glocke: (
    <>
      <path d="M6 16v-5a6 6 0 1112 0v5l2 2H4l2-2z" />
      <path d="M10 21a2 2 0 004 0" />
    </>
  ),
  tastatur: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01" />
      <path d="M7.5 14h9" />
    </>
  ),
  note: (
    <>
      <path d="M9 18V6l11-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  tempo: (
    <>
      <path d="M4 17a8 8 0 1116 0" />
      <path d="M12 17l4-5" />
    </>
  ),
  stimme: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0116 0" />
    </>
  ),
  welle: <path d="M3 12h2l2-6 4 12 3-9 2 3h5" />,
  liste: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
};

export function AkustikSymbol({ name, groesse = 20 }: { name: AkustikSymbolName; groesse?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={groesse}
      height={groesse}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {SYMBOL_PFADE[name]}
    </svg>
  );
}

/**
 * ★ Eine KARTE je Bereich (Tastenflow, 18.10.2026): Symbol, Name und der
 * Schalter in einer Zeile, darunter die Regler und Auswahlen des Bereichs.
 * Die Erklärung hängt an der ganzen Kopfzeile - Darüberfahren irgendwo auf ihr
 * zeigt sie. Der Schalter bleibt `role="switch"`, nie `disabled`.
 */
export function AkustikKarte({ symbol, titel, an = false, onWechsel, erklaerung, wirkungslos = false, children }: {
  symbol: AkustikSymbolName; titel: string;
  /**
   * Ohne `onWechsel` hat die Karte KEINEN Schalter (Klangpunkte, 18.10.2026:
   * die Musik ist dort Inhalt, nicht abschaltbar - nur leiser). Dann steht
   * nur Symbol und Name da; die Erklärung hängt an der Überschrift.
   */
  an?: boolean; onWechsel?: () => void; erklaerung: string;
  wirkungslos?: boolean;
  children?: ReactNode;
}) {
  const { unterdruecken, zeigerProps } = useErklaerungZeigen();
  return (
    <section className="flex flex-col gap-1.5 rounded-xl border border-hairline bg-surface-sunken px-3 py-2">
      <div {...zeigerProps}>
        <Tipp text={altAnzeige(erklaerung)} className="flex w-full" unterdruecken={unterdruecken}>
          {(tippId) => (
            <div className="flex min-h-9 w-full items-center gap-2.5">
              <span className="text-accent"><AkustikSymbol name={symbol} groesse={22} /></span>
              <h3 className="m-0 min-w-0 flex-1 text-base font-bold text-ink">{titel}</h3>
              {/* Ohne Schalter erklärt jeder Regler der Karte sich selbst
                  (`aria-describedby`) - die Überschrift braucht dann keinen. */}
              {onWechsel && (
              <button
                type="button"
                role="switch"
                aria-checked={an}
                aria-label={titel}
                aria-disabled={wirkungslos || undefined}
                aria-describedby={tippId}
                onClick={onWechsel}
                className={`akustik-spur relative inline-flex h-7 w-[46px] shrink-0 items-center rounded-full border border-accent transition-colors ${
                  an ? "bg-accent" : "bg-hairline"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`akustik-knopf absolute top-[3px] h-5 w-5 rounded-full bg-surface-raised shadow transition-all ${an ? "left-[22px]" : "left-[3px]"}`}
                />
              </button>
              )}
            </div>
          )}
        </Tipp>
      </div>
      {children}
    </section>
  );
}

/** Ein Schalter an/aus - `role="switch"`, damit „an" oder „aus" mitgesagt wird. */
export function AkustikSchalter({ name, an, onWechsel, erklaerung, wirkungslos = false }: {
  name: string; an: boolean; onWechsel: () => void; erklaerung: string;
  /**
   * Der Schalter kann gerade nichts bewirken (»Im Griff« ohne deutsche Stimme).
   * Er bleibt bedienbar - nie `disabled` - und die App sagt beim Druck, warum.
   */
  wirkungslos?: boolean;
}) {
  const { unterdruecken, zeigerProps } = useErklaerungZeigen();
  return (
    <div {...zeigerProps}>
      <Tipp text={altAnzeige(erklaerung)} className="flex w-full" unterdruecken={unterdruecken}>
        {(tippId) => (
          <button
            type="button"
            role="switch"
            aria-checked={an}
            aria-disabled={wirkungslos || undefined}
            aria-describedby={tippId}
            onClick={onWechsel}
            className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-ink hover:bg-surface-sunken"
          >
            <span className="font-medium">{name}</span>
            <span
              aria-hidden="true"
              className={`akustik-spur relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
                an ? "border-accent bg-accent" : "border-hairline bg-surface-sunken"
              }`}
            >
              <span className={`akustik-knopf absolute h-4 w-4 rounded-full bg-surface-raised shadow transition-all ${an ? "left-6" : "left-1"}`} />
            </span>
          </button>
        )}
      </Tipp>
    </div>
  );
}

/**
 * Ein Schieberegler mit Beschriftung, Wert in Worten und Erklärung.
 *
 * ★ Mit `symbol` (Tastenflow, 18.10.2026) die SCHLANKE Form: Symbol, Regler und
 * Prozentwert in einer Zeile, ohne sichtbare Beschriftung - der Name steht als
 * `aria-label`, die Erklärung hängt an der ganzen Zeile. `gedimmt`: der Bereich
 * ist aus; der Regler bleibt bedienbar (nie `disabled`). Ohne `symbol` bleibt
 * alles wie bisher (Plus, Punktgenau, Klangpunkte, »Im Griff«).
 */
export function AkustikRegler({ name, wert, min, max, schritt, wertText, erklaerung, onWert, onProbe, symbol, kurzText, gedimmt = false }: {
  name: string; wert: number; min: number; max: number; schritt: number;
  wertText: string; erklaerung: string;
  onWert: (w: number) => void;
  /** Nach dem Loslassen oder einer Taste: einmal anhören, wie es jetzt klingt. */
  onProbe?: () => void;
  symbol?: AkustikSymbolName;
  /** Sichtbarer Wert der schlanken Form (kurz, z. B. „70 %"); sonst `wertText`. */
  kurzText?: string;
  gedimmt?: boolean;
}) {
  const id = useId();
  const { unterdruecken, zeigerProps } = useErklaerungZeigen();
  if (symbol) {
    return (
      <div {...zeigerProps}>
        <Tipp text={altAnzeige(erklaerung)} className="flex w-full" unterdruecken={unterdruecken}>
          {(tippId) => (
            <div className={`flex w-full items-center gap-2.5 ${gedimmt ? "opacity-50" : ""}`}>
              <span className="text-ink-soft"><AkustikSymbol name={symbol} /></span>
              <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={schritt}
                value={wert}
                aria-label={name}
                aria-valuetext={wertText}
                aria-describedby={tippId}
                onChange={(e) => onWert(Number(e.target.value))}
                onPointerUp={onProbe}
                onKeyUp={(e) => { if (onProbe && /^(Arrow|Page|Home|End)/.test(e.key)) onProbe(); }}
                className="m-0 h-6 min-w-0 flex-1 cursor-pointer accent-accent"
              />
              <span aria-hidden="true" className="w-[46px] shrink-0 text-right text-sm tabular-nums text-ink-muted">
                {kurzText ?? wertText}
              </span>
            </div>
          )}
        </Tipp>
      </div>
    );
  }
  return (
    <div className="px-2 py-1.5" {...zeigerProps}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-medium text-ink">{name}</label>
        {/* Sichtbar für die Augen; die Sprachausgabe hört dasselbe über `aria-valuetext`. */}
        <span aria-hidden="true" className="text-sm text-ink-muted">{wertText}</span>
      </div>
      <Tipp text={altAnzeige(erklaerung)} className="flex w-full" unterdruecken={unterdruecken}>
        {(tippId) => (
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={schritt}
            value={wert}
            aria-valuetext={wertText}
            aria-describedby={tippId}
            onChange={(e) => onWert(Number(e.target.value))}
            onPointerUp={onProbe}
            onKeyUp={(e) => { if (onProbe && /^(Arrow|Page|Home|End)/.test(e.key)) onProbe(); }}
            className="h-6 w-full cursor-pointer accent-accent"
          />
        )}
      </Tipp>
    </div>
  );
}

/**
 * Eine Auswahl (Stimme, Instrument) mit Beschriftung und Erklärung.
 * ★ Mit `symbol` die schlanke Form (Tastenflow): Symbol vor dem Feld, Name als
 * `aria-label`, Erklärung an der ganzen Zeile.
 */
export function AkustikAuswahl({ name, wert, optionen, erklaerung, onWert, symbol }: {
  name: string; wert: string; optionen: readonly { wert: string; name: string }[];
  erklaerung: string; onWert: (w: string) => void;
  symbol?: AkustikSymbolName;
}) {
  const id = useId();
  const { unterdruecken, zeigerProps } = useErklaerungZeigen();
  const feld = (tippId: string) => (
    <select
      id={id}
      aria-label={symbol ? name : undefined}
      aria-describedby={tippId}
      value={wert}
      onChange={(e) => onWert(e.target.value)}
      className={`rounded-lg border border-hairline bg-surface-raised px-2 text-sm text-ink ${
        symbol ? "h-[34px] min-w-0 flex-1" : "w-full py-1.5"
      }`}
    >
      {optionen.map((o) => (
        <option key={o.wert} value={o.wert}>{o.name}</option>
      ))}
    </select>
  );
  if (symbol) {
    return (
      <div {...zeigerProps}>
        <Tipp text={altAnzeige(erklaerung)} className="flex w-full" unterdruecken={unterdruecken}>
          {(tippId) => (
            <div className="flex w-full items-center gap-2.5">
              <span className="text-ink-soft"><AkustikSymbol name={symbol} /></span>
              {feld(tippId)}
            </div>
          )}
        </Tipp>
      </div>
    );
  }
  return (
    <div className="px-2 py-1.5" {...zeigerProps}>
      <label htmlFor={id} className="mb-1 block font-medium text-ink">{name}</label>
      <Tipp text={altAnzeige(erklaerung)} className="flex w-full" unterdruecken={unterdruecken}>
        {(tippId) => feld(tippId)}
      </Tipp>
    </div>
  );
}
