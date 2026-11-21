import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useSimSprache } from "@/lib/simSprache";
import { SIM_GEMEINSAM_TEXTE } from "@/components/SimGemeinsam.texte";

/**
 * Rundgang für die Simulationen: Der Schirm wird abgedunkelt, EIN Bereich bleibt
 * hell, daneben steht ein kurzer Text mit »Weiter«. Überspringbar, und nach dem
 * ersten Mal kommt er nicht wieder.
 *
 * Anlass (Johannes, 05.09.2026): „die menschen kommen nicht drauf, dass man den
 * Ausschnitt mit den Pfeiltasten verschieben kann". Der erste Versuch war eine
 * Zeile in der unteren Leiste - sein Befund am selben Tag: „die einführung in der
 * leiste unten übersieht man und bringt auch wenig". Darum jetzt die Form, die
 * man aus Apps beim ersten Start kennt: Nur der Bereich, um den es geht, ist
 * hell; das Textfenster springt mit.
 *
 * ⚠️ Die Auflage ist DURCHLÄSSIG (`pointer-events: none` auf der Abdunklung).
 * Wer im hellen Bereich gleich etwas ausprobieren will, kann das - genau darum
 * geht es bei den Pfeiltasten. Nur das Textfenster selbst nimmt Klicks an.
 *
 * ⚠️ Sie STIEHLT DEN FOKUS NICHT. Der Schritt-Text steht in einem
 * `aria-live`-Bereich, und »Weiter« geht auch mit der Eingabetaste, ohne dass die
 * Hände die Pfeiltasten verlassen. Ein Fokussprung in den Kasten würde genau die
 * Übung verhindern, um die es geht.
 *
 * ⚠️ Ein Leuchtrahmen allein trägt für einen Screenreader nichts (er sieht ihn
 * nicht) - darum nennt jeder Schritt seinen Bereich im TEXT („Oben", „Im Bild",
 * „Unten", „Rechts") und nicht nur über die Hervorhebung.
 */
export type EinfuehrungSchritt = {
  /** Der Bereich, der hell bleibt. Wird bei jedem Schritt frisch gesucht. */
  ziel: () => HTMLElement | null | undefined;
  /** Was hier zu sehen/tun ist. WENIG Text - ein bis zwei Zeilen. */
  text: ReactNode;
  /**
   * Ein Wert, der sich ändert, sobald die Handlung passiert ist - z. B.
   * `${pan.x},${pan.y}`. Beim Betreten des Schritts wird er gemerkt und danach
   * verglichen. Ohne Angabe ist der Schritt nur zum Lesen.
   */
  beobachte?: string | number;
  /** Die kurze Bestätigung, sobald es geklappt hat. */
  danach?: ReactNode;
};

/**
 * ★ Z4 (19.09.2026, Tastenflow-Rundgang): die Wörter des Kastens. Ohne Angabe
 * die bisherigen - die Simulationen reichen nichts herein und bleiben
 * wortgleich.
 */
export type EinfuehrungBeschriftung = {
  /** Name der Region (`aria-label`). */
  name: string;
  /** Die Zeile oben links, z. B. „Einführung 1/4". */
  zaehler: (nr: number, von: number) => string;
  ueberspringen: string;
  weiter: string;
  fertig: string;
  /** Für Sprachausgaben vor der Bestätigung eines geschafften Schritts. */
  geschafft: string;
};

/** Die Wörter des Kastens in der Sprache der Seite (außerhalb der öffentlichen Seiten: Deutsch). */
function standardBeschriftung(sprache: ReturnType<typeof useSimSprache>): EinfuehrungBeschriftung {
  const e = SIM_GEMEINSAM_TEXTE[sprache].einfuehrung;
  return {
    name: e.name,
    zaehler: e.zaehler,
    ueberspringen: e.ueberspringen,
    weiter: e.weiter,
    fertig: e.fertig,
    geschafft: e.geschafft,
  };
}

/**
 * ★ Z4 (19.09.2026): Welche Tasten die Einführung selbst behandelt.
 *  · `"enter"` (Vorgabe, die Simulationen): Eingabetaste = Weiter, ausser in
 *    Formularfeldern und auf Knöpfen. Sonst nichts.
 *  · `"seite"` (Tastenflow, „Meine Klassen"): dazu Escape = Rundgang beenden.
 *  · `"uebung"` (Tastenflow, Übungsseite): Solange der Rundgang zu sehen ist,
 *    darf kein Anschlag das Üben starten. Eingabe- und Leertaste = Weiter,
 *    Escape = beenden, jede andere Taste wird geschluckt (zählt nicht als
 *    Anschlag). Durch bleiben nur Tab (der Weg zu den Knöpfen), reine
 *    Umschalt-/Strg-/Alt-/Befehlstasten (Strg macht sofort still) und alles,
 *    was IM Kasten selbst gedrückt wird (seine Knöpfe). Abgefangen wird in der
 *    ERFASSUNGSPHASE am `window` - vor jedem Horcher der Seite und vor dem
 *    Übungsfeld.
 */
export type EinfuehrungTasten = "enter" | "seite" | "uebung";

/** Warum die Einführung endete - für den Aufrufer, der danach den Fokus setzt. */
export type EinfuehrungEnde = {
  grund: "fertig" | "ueberspringen" | "escape";
  /** Stand der Fokus auf einem Knopf des Kastens, der jetzt verschwindet? */
  fokusWarImKasten: boolean;
};

const PRAEFIX = "sensorik:sim-einfuehrung:";
/** Abstand zwischen Leuchtrahmen und Textfenster. */
const LUFT = 12;

/** Wurde die Einführung dieser Simulation schon einmal zu Ende gesehen? */
export function einfuehrungGesehen(schluessel: string): boolean {
  try {
    return localStorage.getItem(PRAEFIX + schluessel) === "1";
  } catch {
    // Privates Fenster, gesperrte Website-Daten: dann eben jedes Mal zeigen.
    return false;
  }
}

export function einfuehrungMerken(schluessel: string) {
  try {
    localStorage.setItem(PRAEFIX + schluessel, "1");
  } catch {
    /* Ein Merker ist nie den Absturz einer Seite wert. */
  }
}

type Kasten = { x: number; y: number; w: number; h: number };

/**
 * Der Rundgang einer Simulations-SEITE: beim ersten Besuch von selbst, danach
 * nur noch über den Knopf in der Kopfzeile.
 *
 * ⚠️ Bewusst in der Seite und nicht im Simulations-Baustein: Dieselben Bausteine
 * stecken in Lektionen (`@@WIDGET:…@@`) und in Arbeitsheften - dort soll kein
 * Rundgang aufgehen. Die Seite kennt ihre Bereiche über die `data-sim…`-Marker,
 * die die Bausteine setzen.
 */
export function useRundgang(schluessel: string) {
  const [offen, setOffen] = useState(false);
  useEffect(() => {
    if (!einfuehrungGesehen(schluessel)) setOffen(true);
  }, [schluessel]);
  return {
    offen,
    starten: () => setOffen(true),
    beenden: () => setOffen(false),
  };
}

/** Der Knopf, der den Rundgang zurückholt - gehört neben Hilfe und Melden. */
export function RundgangKnopf({ onClick }: { onClick: () => void }) {
  const t = SIM_GEMEINSAM_TEXTE[useSimSprache()].einfuehrung;
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-sm font-medium text-ink-soft hover:text-ink"
    >
      <span aria-hidden="true">👉</span> {t.knopf}
    </button>
  );
}

/** Ein Bereich der Seite, den ein Schritt hervorhebt. */
export const simBereich = (marke: string) => () =>
  typeof document === "undefined" ? null : document.querySelector<HTMLElement>(`[${marke}]`);

export function SimEinfuehrung({
  schluessel,
  schritte,
  onEnde,
  beschriftung: beschriftungEingabe,
  tasten = "enter",
  verborgen = false,
  eigeneAnsage = false,
  onSchritt,
}: {
  /** Programm-Schlüssel für den Merker, z. B. „sehsimulation". */
  schluessel: string;
  schritte: EinfuehrungSchritt[];
  /** Wird bei „Fertig", „Überspringen" und am letzten Schritt gerufen. */
  onEnde: (ende: EinfuehrungEnde) => void;
  // ── ★ Z4 (19.09.2026) - alles Folgende ist optional; ohne Angabe genau wie
  //    bisher (die sieben Simulationen reichen nichts davon herein). ──────────
  /** Die Wörter des Kastens (Sprache, „Rundgang" statt „Einführung"). */
  beschriftung?: EinfuehrungBeschriftung;
  /** Welche Tasten die Einführung behandelt - siehe {@link EinfuehrungTasten}. */
  tasten?: EinfuehrungTasten;
  /**
   * Tritt zurück, solange ein Fenster offen ist: nichts zu sehen, keine Taste
   * abgefangen - aber der Schritt bleibt, wo er war.
   */
  verborgen?: boolean;
  /**
   * Der Aufrufer sagt den Schritt selbst an (eigener Live-Bereich, der schon
   * steht, bevor der erste Text kommt - ein Live-Bereich, der MIT seinem Text
   * erscheint, wird oft gar nicht angesagt). Dann trägt der Satz im Kasten
   * kein `aria-live`, sonst käme jeder Schritt zweimal.
   */
  eigeneAnsage?: boolean;
  /** Bei jedem Schritt, der zu sehen ist - einmal je Schritt (auch dem ersten). */
  onSchritt?: (index: number) => void;
}) {
  const sprache = useSimSprache();
  const beschriftung = beschriftungEingabe ?? standardBeschriftung(sprache);
  const [i, setI] = useState(0);
  const schritt = schritte[Math.min(i, schritte.length - 1)];
  // Wert beim BETRETEN des Schritts - erst eine Abweichung davon zählt.
  const startwert = useRef<string | number | undefined>(schritt?.beobachte);
  const [geschafft, setGeschafft] = useState(false);
  const [loch, setLoch] = useState<Kasten | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textMasse, setTextMasse] = useState({ w: 340, h: 150 });

  useEffect(() => {
    startwert.current = schritte[i]?.beobachte;
    setGeschafft(false);
    // Nur beim Schrittwechsel neu merken - nicht bei jeder Bewegung.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  useEffect(() => {
    if (geschafft) return;
    if (schritt?.beobachte === undefined) return;
    if (schritt.beobachte !== startwert.current) setGeschafft(true);
  }, [schritt?.beobachte, geschafft, schritt]);

  // Den hellen Bereich messen - beim Schrittwechsel und wenn sich das Fenster
  // ändert. Der Bereich wird bei JEDER Messung neu gesucht: Im Vollbild wechseln
  // Leisten ihre Größe, und eine gemerkte Referenz zeigte dann ins Leere.
  useLayoutEffect(() => {
    // ★ Z4: Solange die Einführung zurücktritt, wird weder gemessen noch gerollt.
    if (verborgen) return;
    const messen = () => {
      const el = schritte[i]?.ziel();
      if (!el) return setLoch(null);
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return setLoch(null);
      setLoch({ x: r.x, y: r.y, w: r.width, h: r.height });
    };
    // Bereich ausserhalb des Bildschirms ⇒ hinscrollen. In der Seh-Simulation
    // (Vollbild) passt immer alles; die übrigen Simulationen sind lange Seiten,
    // und dort zeigte der Leuchtrahmen sonst auf etwas, das man nicht sieht.
    const el = schritte[i]?.ziel();
    if (el) {
      const r = el.getBoundingClientRect();
      const drin = r.top >= 0 && r.bottom <= window.innerHeight;
      if (!drin && r.height > 0) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    messen();
    window.addEventListener("resize", messen);
    const t = window.setInterval(messen, 400); // Leisten brechen um, Bereiche wandern
    return () => {
      window.removeEventListener("resize", messen);
      window.clearInterval(t);
    };
  }, [i, schritte, verborgen]);

  // Das Textfenster nachmessen, damit es nicht über den Rand rutscht.
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTextMasse((alt) =>
      Math.abs(alt.w - r.width) < 2 && Math.abs(alt.h - r.height) < 2
        ? alt
        : { w: r.width, h: r.height },
    );
  }, [i, geschafft, loch]);

  // »Weiter« mit der Eingabetaste - ohne die Hände von den Pfeiltasten zu nehmen.
  // Formularelemente behalten ihre Eingabetaste (Auswahllisten, Regler).
  useEffect(() => {
    if (tasten !== "enter" || verborgen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      e.preventDefault();
      weiter();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, schritte.length, tasten, verborgen]);

  // ★ Z4: „seite" - wie oben, dazu Escape = beenden. Nicht in Formularfeldern,
  // Links und Knöpfen (die haben ihre eigene Eingabetaste), und nichts, was
  // die Seite schon selbst behandelt hat (`defaultPrevented`).
  useEffect(() => {
    if (tasten !== "seite" || verborgen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "Escape") {
        e.preventDefault();
        beenden("escape");
        return;
      }
      if (e.key !== "Enter") return;
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest("input, select, textarea, button, a, summary, [contenteditable]")) return;
      e.preventDefault();
      weiter();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, schritte.length, tasten, verborgen]);

  // ★ Z4: „uebung" - siehe {@link EinfuehrungTasten}. Erfassungsphase am
  // `window`: Das Übungsfeld und die Kürzel der Seite hören sonst zuerst.
  useEffect(() => {
    if (tasten !== "uebung" || verborgen) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as Node | null;
      // Die Knöpfe des Kastens selbst behalten ihre Tasten (Tab, Eingabe, Leer).
      if (t && textRef.current?.contains(t) && e.key !== "Escape") return;
      if (e.key === "Tab") return;
      if (["Shift", "Control", "Alt", "AltGraph", "Meta", "CapsLock"].includes(e.key)) return;
      if (e.isComposing) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.repeat) return;
      if (e.key === "Escape") beenden("escape");
      else if (e.key === "Enter" || e.key === " ") weiter();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, schritte.length, tasten, verborgen]);

  // ★ Z4: jeder Schritt einmal gemeldet - erst, wenn er auch zu sehen ist.
  const gemeldet = useRef(-1);
  useEffect(() => {
    if (verborgen || !onSchritt || gemeldet.current === i) return;
    gemeldet.current = i;
    onSchritt(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, verborgen]);

  if (!schritt || verborgen) return null;
  const letzter = i >= schritte.length - 1;

  function beenden(grund: EinfuehrungEnde["grund"] = "ueberspringen") {
    einfuehrungMerken(schluessel);
    const aktiv = typeof document === "undefined" ? null : document.activeElement;
    onEnde({ grund, fokusWarImKasten: !!aktiv && !!textRef.current?.contains(aktiv) });
  }
  function weiter() {
    if (letzter) beenden("fertig");
    else setI((n) => n + 1);
  }

  // Wohin das Textfenster gehört: unter den hellen Bereich, sonst darüber, sonst
  // hinein (bei einem Bereich, der fast den ganzen Schirm füllt - dem Bild).
  const vw = typeof window === "undefined" ? 1024 : window.innerWidth;
  const vh = typeof window === "undefined" ? 768 : window.innerHeight;
  const breite = Math.min(360, vw - 2 * LUFT);
  let tx = LUFT;
  let ty = vh - textMasse.h - LUFT;
  let innen = false;
  if (loch) {
    const passtDrunter = loch.y + loch.h + LUFT + textMasse.h + LUFT <= vh;
    const passtDrueber = loch.y - LUFT - textMasse.h - LUFT >= 0;
    if (passtDrunter) ty = loch.y + loch.h + LUFT;
    else if (passtDrueber) ty = loch.y - LUFT - textMasse.h;
    else {
      // Kein Platz aussen (der Bereich füllt fast den Schirm) ⇒ innen, und zwar
      // OBEN: Unten links steht der Tastenhinweis „← ↑ ↓ → Ausschnitt", unten
      // rechts die Zoom-Knöpfe - beide würde ein Kasten am unteren Rand genau in
      // dem Schritt verdecken, in dem sie erklärt werden (05.09.2026 gemessen).
      // ★ Z4: nie über den oberen Rand hinaus - ein Bereich, der höher ist als
      // der Schirm (die Kinderliste in „Meine Klassen"), beginnt oft darüber.
      ty = Math.max(LUFT, loch.y + LUFT);
      innen = true;
    }
    tx = Math.min(Math.max(LUFT, loch.x), vw - breite - LUFT);
  }

  return (
    <>
      {/* Abdunklung mit Loch: EIN Element, dessen riesiger Schlagschatten alles
          ausserhalb verdeckt. Durchlässig für Klicks und Tasten. */}
      {loch && (
        <div
          aria-hidden="true"
          // ★ Z4: die Marke für den Kontrastmodus (`index.css`, `forced-colors`):
          // Dort fällt der Schlagschatten weg, und der Rahmen trägt allein.
          data-einfuehrung-rahmen=""
          className="pointer-events-none fixed z-[70] rounded-xl text-accent outline outline-[3px] outline-current"
          style={{
            left: loch.x - 6,
            top: loch.y - 6,
            width: loch.w + 12,
            height: loch.h + 12,
            marginTop: 0,
            boxShadow: "0 0 0 9999px rgba(8, 10, 16, 0.66)",
            transition: "left 220ms ease, top 220ms ease, width 220ms ease, height 220ms ease",
          }}
        />
      )}
      {/* Ohne messbaren Bereich (sehr kleines Fenster) dunkelt nichts ab - das
          Textfenster steht dann allein. Lieber kein Loch als ein falsches. */}
      <div
        ref={textRef}
        role="region"
        aria-label={beschriftung.name}
        data-einfuehrung=""
        className={
          "fixed z-[71] rounded-xl border border-accent/50 bg-surface-raised px-4 py-3 text-sm shadow-card " +
          (innen ? "backdrop-blur" : "")
        }
        style={{ left: tx, top: ty, width: breite, marginTop: 0 }}
      >
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {beschriftung.zaehler(i + 1, schritte.length)}
          </span>
          <button
            type="button"
            onClick={() => beenden("ueberspringen")}
            className="rounded-lg px-2 py-0.5 text-xs font-medium text-ink-muted underline underline-offset-2 hover:text-ink"
          >
            {beschriftung.ueberspringen}
          </button>
        </div>
        {/* Der Wechsel wird angesagt, OHNE den Fokus zu holen - die Hände bleiben
            auf den Tasten, um die es gerade geht. */}
        <p className="text-ink" aria-live={eigeneAnsage ? undefined : "polite"}>
          {geschafft && schritt.danach ? (
            <>
              <span aria-hidden="true">✓ </span>
              <span className="sr-only">{beschriftung.geschafft} </span>
              {schritt.danach}
            </>
          ) : (
            schritt.text
          )}
        </p>
        <div className="mt-2.5 flex items-center justify-end">
          <button type="button" onClick={weiter} className="btn-primary px-4 py-1 text-sm">
            {letzter ? beschriftung.fertig : beschriftung.weiter}
            <span className="ml-1.5 text-xs opacity-70" aria-hidden="true">
              ⏎
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
