/**
 * ★ GEZIELT ÜBEN (13.11.2026, Bauplan §4): der Dialog „Tasten wählen".
 *
 * Zwei Wege zum selben Ziel, beide mit der Tastatur zu bedienen:
 *   1. das Feld „Taste drücken": die Taste drücken, die geübt werden soll (noch einmal drücken nimmt sie weg);
 *   2. die Auswahl-Tastatur (`GezieltTastatur`) mit den Ebenen Normal · Umschalt · AltGr - für alles, was sich nicht
 *      einfach drücken lässt, und für Tablets.
 * Dazu: „Wie oft?" (ein wenig / viel / nur diese), „Wie lange?" (bis ich es ausschalte / nur heute) und - wo das
 * Konto Daten hat - der Vorschlag „Hier greifst du oft daneben".
 *
 * ★ Fokus: Das gemeinsame `Modal` gibt den Fokus beim Schliessen an den Öffner zurück (der Knopf „Tasten wählen …" im
 * Zahnrad, das Schildchen in der Stand-Zeile, oder - bei Alt + 2 - die Übungszeile). Der Dialog steht oft über dem
 * Zahnrad-Fenster, das SELBST ein `Modal` ist: Zwei Modale hören beide am `document` auf Escape und Tab - das äussere
 * hielte Tab im eigenen Rahmen und schlösse sich mit Escape gleich mit. Darum fängt dieser Dialog beide Tasten schon
 * am `window` ab (`useDialogTasten`), solange der Fokus in ihm liegt.
 *
 * ★ Nichts wird `disabled`. Das neunte Zeichen wird einfach nicht aufgenommen - und der Dialog sagt warum.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@/components/Modal";
import { useBedienSprache } from "@/lib/bedienSprache";
import { useTypingA11y } from "@/lib/typing";
import { useContrast } from "@/lib/contrast";
import { FINGERS, fingerForChar, spokenLabel } from "@/lib/typing/fingers";
import { activeLayout, layoutSprache } from "@/lib/typing/layouts";
import { kleinFuer } from "@/lib/typing/sprachRegister";
import { anschlagAus, deuteAnschlag, type OffeneTotaste } from "@/lib/typing/anschlagDeuten";
import { GEZIELT_MAX, datumLokal, type Gezielt, type GezieltAnteil } from "@/lib/typing/gezielt";
import { GEZIELT_LEHRKRAFT_TEXTE, GEZIELT_TEXTE } from "@/lib/typing/gezieltTexte";
import { istMacSystem } from "@/lib/altTaste";
import { GezieltTastatur } from "./GezieltTastatur";
import { htmlLang } from "./htmlLang";
import { useBedienStimme } from "./useBedienStimme";
import { useKeyboardLayout } from "./useKeyboardLayout";

/** Escape und Tab des Dialogs schon am `window` abfangen (siehe Kopf): gilt nur, solange der Fokus im Dialog liegt. */
function useDialogTasten(wurzel: React.RefObject<HTMLElement | null>, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const dialog = wurzel.current?.closest<HTMLElement>('[role="dialog"]');
      if (!dialog) return;
      const aktiv = document.activeElement as HTMLElement | null;
      if (!aktiv || !dialog.contains(aktiv)) return;
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      // Das äussere Modal darf diesen Tab nicht sehen (es zöge den Fokus zurück in sein eigenes Fenster).
      e.stopImmediatePropagation();
      const knoepfe = [
        ...dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ];
      if (knoepfe.length === 0) return;
      const erster = knoepfe[0];
      const letzter = knoepfe[knoepfe.length - 1];
      if (e.shiftKey && aktiv === erster) {
        e.preventDefault();
        letzter.focus();
      } else if (!e.shiftKey && aktiv === letzter) {
        e.preventDefault();
        erster.focus();
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [wurzel]);
}

export interface GezieltDialogProps {
  /** Der gespeicherte eigene Wert (oder `null`). */
  start: Gezielt | null;
  /** Die wackligen Tasten dieser Person als einzelne Zeichen - leer, wenn nichts berechenbar ist. */
  vorschlag?: readonly string[];
  /** „Fertig": der neue Wert (`null` = ausgeschaltet). */
  onSpeichern: (g: Gezielt | null) => void;
  onSchliessen: () => void;
  /**
   * ★ Etappe C (13.11.2026): „lehrkraft" = die Lehrkraft stellt für die Klasse, ein Kind oder mehrere Kinder ein.
   * Dann heisst „Wie lange?" „bis es ausgeschaltet wird" oder „bis zu diesem Datum" (statt „nur heute"), und die
   * Sätze sprechen über das Kind, nicht zum Kind.
   */
  modus?: "selbst" | "lehrkraft";
  /** Eigener Titel (z. B. „Gezielt üben - Anna"); ohne ihn der Standard-Titel. */
  titel?: string;
}

/** Das Datum in `tage` Tagen als „JJJJ-MM-TT" (Vorgabe für „bis zu diesem Datum"). */
function datumIn(tage: number): string {
  const d = new Date();
  d.setDate(d.getDate() + tage);
  return datumLokal(d);
}

export function GezieltDialog({
  start,
  vorschlag = [],
  onSpeichern,
  onSchliessen,
  modus = "selbst",
  titel,
}: GezieltDialogProps) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const lk = modus === "lehrkraft";
  const tt = GEZIELT_TEXTE[sprache];
  const l = GEZIELT_LEHRKRAFT_TEXTE[sprache];
  // Für die Lehrkraft sprechen drei Sätze über das Kind statt zum Kind.
  const t = lk ? { ...tt, feldHinweis: l.feldHinweis, vorschlag: l.vorschlag } : tt;
  const stimme = useBedienStimme();
  const layout = useKeyboardLayout();
  const fingerFarben = useTypingA11y((s) => s.fingerFarben);
  const kontrast = useContrast((s) => s.mode);
  const farben = fingerFarben && (kontrast === "hell" || kontrast === "dunkel");

  const [zeichen, setZeichen] = useState<string[]>(() =>
    (start?.zeichen ?? []).filter((z) => fingerForChar(z) !== null).slice(0, GEZIELT_MAX),
  );
  const [anteil, setAnteil] = useState<GezieltAnteil>(start?.anteil ?? "viel");
  const [lange, setLange] = useState<"ohne" | "heute" | "datum">(start?.bis ? (lk ? "datum" : "heute") : "ohne");
  const [datum, setDatum] = useState<string>(start?.bis ?? datumIn(7));
  const [meldung, setMeldung] = useState("");
  const zeichenRef = useRef(zeichen);
  zeichenRef.current = zeichen;
  const offeneTotaste = useRef<OffeneTotaste | null>(null);
  const feldRef = useRef<HTMLInputElement>(null);
  const wurzelRef = useRef<HTMLDivElement>(null);
  useDialogTasten(wurzelRef, onSchliessen);

  const name = useCallback((z: string) => spokenLabel(z, sprache), [sprache]);

  /** Ein Zeichen wählen oder wegnehmen. */
  const umschalten = useCallback(
    (roh: string) => {
      const z = kleinFuer(roh, layoutSprache());
      const jetzt = zeichenRef.current;
      if (jetzt.includes(z)) {
        setZeichen(jetzt.filter((x) => x !== z));
        setMeldung("");
        stimme.sprich(t.angesagtWeg(name(z)));
        return;
      }
      if (fingerForChar(z) === null) {
        setMeldung(t.nichtDa);
        stimme.sprich(t.nichtDa);
        return;
      }
      if (jetzt.length >= GEZIELT_MAX) {
        const satz = t.maxHinweis(GEZIELT_MAX);
        setMeldung(satz);
        stimme.sprich(satz);
        return;
      }
      setZeichen([...jetzt, z]);
      setMeldung("");
      stimme.sprich(t.angesagtGewaehlt(name(z)));
    },
    [name, stimme, t],
  );

  /** Ein Tastendruck im Feld „Taste drücken": Tote Tasten und AltGr wie im Übungsfeld deuten (`anschlagDeuten`). */
  const imFeld = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ev = e.nativeEvent;
    // Tab, Escape und Enter gehören dem Dialog; Strg-/Alt-Kombinationen den Kürzeln der Seite.
    if (e.key === "Tab" || e.key === "Escape" || e.key === "Enter") return;
    const altGr = typeof e.getModifierState === "function" && e.getModifierState("AltGraph");
    const strgAlt = e.ctrlKey && e.altKey;
    if ((e.ctrlKey || e.metaKey) && !altGr && !strgAlt) return;
    if (e.altKey && !altGr && !strgAlt && !istMacSystem()) return;
    e.preventDefault();
    const { deutung, offen } = deuteAnschlag(anschlagAus(ev), offeneTotaste.current, activeLayout());
    offeneTotaste.current = offen;
    if (deutung.art === "zeichen" && deutung.zeichen.trim() !== "" && [...deutung.zeichen].length === 1) {
      umschalten(deutung.zeichen);
    }
  };

  const vorschlagNeu = useMemo(
    () => vorschlag.filter((z) => !zeichen.includes(z) && fingerForChar(z) !== null),
    [vorschlag, zeichen],
  );
  const vorschlagNehmen = () => {
    const frei = GEZIELT_MAX - zeichen.length;
    const neu = vorschlagNeu.slice(0, Math.max(0, frei));
    if (neu.length === 0) {
      const satz = t.maxHinweis(GEZIELT_MAX);
      setMeldung(satz);
      stimme.sprich(satz);
      return;
    }
    setZeichen([...zeichen, ...neu]);
    setMeldung("");
    stimme.sprich(t.angesagtGewaehlt(neu.map(name).join(", ")));
  };

  const fertig = () => {
    if (zeichen.length === 0) {
      onSpeichern(null);
    } else {
      const bis =
        lange === "heute"
          ? datumLokal(new Date())
          : lange === "datum" && /^\d{4}-\d{2}-\d{2}$/.test(datum)
            ? datum
            : null;
      onSpeichern({ zeichen, anteil, bis });
    }
    onSchliessen();
  };

  // ★ Bauart §4: keine Auswahlknöpfe (type="radio") in Tastenflow - die Wahl
  // ist eine Reihe Umschaltknöpfe mit aria-pressed, wie überall in den Einstellungen.
  const radio = (gruppe: string, wert: string, an: boolean, beschriftung: string, wahl: () => void) => (
    <button
      key={`${gruppe}-${wert}`}
      type="button"
      aria-pressed={an}
      onClick={() => {
        wahl();
        stimme.sprich(beschriftung);
      }}
      className={(an ? "btn-primary" : "btn-secondary") + " btn-toggle"}
    >
      {beschriftung}
    </button>
  );

  return (
    <Modal title={titel ?? t.dialogTitel} onClose={onSchliessen} size="lg" initialFocus={feldRef}>
      <div ref={wurzelRef} className="flex flex-col gap-4" lang={htmlLang(sprache)}>
        <div className="flex flex-col gap-1">
          <label htmlFor="gezielt-taste-druecken" className="text-sm font-semibold text-ink">
            {t.feld}
          </label>
          <input
            id="gezielt-taste-druecken"
            ref={feldRef}
            type="text"
            value=""
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby="gezielt-taste-hinweis"
            className="w-40 rounded-lg border border-hairline bg-surface px-3 py-2 font-legible text-base text-ink"
            onChange={() => {}}
            onKeyDown={imFeld}
            onBeforeInput={(e) => e.preventDefault()}
          />
          <p id="gezielt-taste-hinweis" className="m-0 text-sm text-ink-muted">
            {t.feldHinweis}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="m-0 text-sm font-semibold text-ink">{t.gewaehlt(zeichen.length, GEZIELT_MAX)}</p>
          {zeichen.length === 0 ? (
            <p className="m-0 text-sm text-ink-muted">{t.nochNichts}</p>
          ) : (
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {zeichen.map((z) => {
                const finger = fingerForChar(z);
                return (
                  <li key={z}>
                    <button
                      type="button"
                      className="btn-secondary btn-toggle inline-flex !min-h-0 h-10 min-w-10 items-center justify-center font-legible text-lg font-semibold"
                      aria-label={t.entfernen(name(z))}
                      style={
                        farben && finger
                          ? { borderBottomColor: FINGERS[finger.id].farbe, borderBottomWidth: 4 }
                          : undefined
                      }
                      onClick={() => {
                        setZeichen(zeichen.filter((x) => x !== z));
                        setMeldung("");
                        stimme.sprich(t.angesagtWeg(name(z)));
                        feldRef.current?.focus();
                      }}
                    >
                      <span aria-hidden="true">{z}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {/* Sichtbar UND für die Sprachausgabe: dasselbe Muster wie die übrigen Hinweise der Zeile. */}
          <p role="status" className="m-0 min-h-5 text-sm text-ink-soft">
            {meldung}
          </p>
        </div>

        {vorschlagNeu.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-hairline p-3">
            <span className="text-sm text-ink-soft">{t.vorschlag}</span>
            <span className="font-legible text-lg font-semibold text-ink" aria-label={vorschlagNeu.map(name).join(", ")}>
              {vorschlagNeu.join(" ")}
            </span>
            <button type="button" className="btn-secondary btn-toggle" onClick={vorschlagNehmen}>
              {t.vorschlagKnopf}
            </button>
          </div>
        )}

        <GezieltTastatur
          layout={layout}
          sprache={sprache}
          gewaehlt={zeichen}
          onUmschalten={umschalten}
          texte={t}
          farben={farben}
        />

        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <fieldset className="m-0 flex min-w-0 flex-col gap-1 border-0 p-0">
            <legend className="mb-1 text-sm font-semibold text-ink">{t.wieOft}</legend>
            {radio("gezielt-anteil", "wenig", anteil === "wenig", t.wenig, () => setAnteil("wenig"))}
            {radio("gezielt-anteil", "viel", anteil === "viel", t.viel, () => setAnteil("viel"))}
            {radio("gezielt-anteil", "nur", anteil === "nur", t.nur, () => setAnteil("nur"))}
          </fieldset>
          <fieldset className="m-0 flex min-w-0 flex-col gap-1 border-0 p-0">
            <legend className="mb-1 text-sm font-semibold text-ink">{t.wieLange}</legend>
            {radio("gezielt-lange", "ohne", lange === "ohne", lk ? l.langeOhne : t.langeOhne, () => setLange("ohne"))}
            {lk ? (
              <>
                {radio("gezielt-lange", "datum", lange === "datum", l.langeBis, () => setLange("datum"))}
                {lange === "datum" && (
                  <input
                    type="date"
                    aria-label={l.datum}
                    value={datum}
                    min={datumLokal(new Date())}
                    className="w-44 rounded-lg border border-hairline bg-surface px-3 py-1.5 font-legible text-base text-ink"
                    onChange={(e) => setDatum(e.target.value)}
                  />
                )}
              </>
            ) : (
              radio("gezielt-lange", "heute", lange === "heute", t.langeHeute, () => setLange("heute"))
            )}
          </fieldset>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary btn-toggle"
            onClick={() => {
              setZeichen([]);
              setMeldung("");
              feldRef.current?.focus();
            }}
          >
            {t.alleEntfernen}
          </button>
          <button type="button" className="btn-primary btn-toggle" onClick={fertig}>
            {t.fertig}
          </button>
        </div>
      </div>
    </Modal>
  );
}
