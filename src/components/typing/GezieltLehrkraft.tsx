/**
 * ★ GEZIELT ÜBEN, ETAPPE C (13.11.2026, Bauplan §5): die Bauteile der LEHRKRAFT-Seite.
 *
 *   • `GezieltKlassenZeile` - die Zeile „Gezielt üben (alle)" im Kasten „Einstellungen der Klasse".
 *   • `GezieltKindZeile`    - die Zeile je Kind (aufgeklappte Zeile, „Einstellungen"): eigener Wert, „Wie die Klasse",
 *                             „Für dieses Kind aus".
 *   • `GezieltSpalte`       - der Inhalt der Tabellenzelle „Gezielt".
 *   • `GezieltMehrfachLeiste` - die Leiste „N Kinder markiert · Gezielt üben für diese …" (die EINE Sammelaktion).
 *
 * Der Dialog ist derselbe wie beim Lernenden (`GezieltDialog`, `modus="lehrkraft"`). Gespeichert wird nicht hier -
 * jede Stelle bekommt ihr `onSpeichern` von aussen (Klasse: `setClassEinstellungen`, Kind: `setGezielt`).
 *
 * ★ Fokus: Der Dialog gibt den Fokus an seinen Öffner zurück (gemeinsames `Modal`). Verschwindet ein Knopf, weil seine
 * Aktion ihn überflüssig macht („Ausschalten", „Wie die Klasse"), geht der Fokus auf den Knopf, der bleibt - nie ins Leere.
 * Nichts wird `disabled`.
 */
import { useRef, useState, type Ref } from "react";
import { useBedienSprache } from "@/lib/bedienSprache";
import { useContrast } from "@/lib/contrast";
import { spokenLabel } from "@/lib/typing/fingers";
import { useTypingA11y } from "@/lib/typing/a11y";
import { gezieltHerkunft, type GezieltHerkunft } from "@/lib/typing/gezieltLehrkraft";
import { GEZIELT_TEXTE, GEZIELT_LEHRKRAFT_TEXTE } from "@/lib/typing/gezieltTexte";
import { gezieltWirksam, type Gezielt } from "@/lib/typing/gezielt";
import { Tipp } from "@/components/Tipp";
import { GezieltDialog } from "./GezieltDialog";
import { GezieltKaestchen, gezieltZusammenfassung } from "./GezieltZeile";

/** Das Gezielt, das „aus für dieses Kind" bedeutet (Bauplan §2). */
export const GEZIELT_KIND_AUS: Gezielt = { zeichen: [], anteil: "viel", bis: null };

/** Ein Knopf MIT Mouseover-Hinweis (Hausregel: kein Schalter ohne Hinweis, `aria-describedby` → Hinweiskasten). */
function HinweisKnopf({
  hinweis,
  onClick,
  primaer = false,
  knopfRef,
  children,
}: {
  hinweis: string;
  onClick: () => void;
  primaer?: boolean;
  knopfRef?: Ref<HTMLButtonElement>;
  children: React.ReactNode;
}) {
  return (
    <Tipp text={hinweis} ausrichtung="links">
      {(hinweisId) => (
        <button
          ref={knopfRef}
          type="button"
          aria-describedby={hinweisId}
          className={(primaer ? "btn-primary" : "btn-secondary") + " btn-toggle"}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </Tipp>
  );
}

function useFarben(): boolean {
  const fingerFarben = useTypingA11y((s) => s.fingerFarben);
  const kontrast = useContrast((s) => s.mode);
  return fingerFarben && (kontrast === "hell" || kontrast === "dunkel");
}

/** Die Zeile für die ganze Klasse. `wert` ist, was an der Klasse gespeichert ist. */
export function GezieltKlassenZeile({
  wert,
  onSpeichern,
}: {
  wert: Gezielt | null;
  onSpeichern: (g: Gezielt | null) => void;
}) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = GEZIELT_TEXTE[sprache];
  const l = GEZIELT_LEHRKRAFT_TEXTE[sprache];
  const farben = useFarben();
  const [offen, setOffen] = useState(false);
  const waehlenRef = useRef<HTMLButtonElement>(null);
  const wirksam = gezieltWirksam(wert, new Date());

  return (
    <div className="flex basis-full flex-wrap items-center gap-x-3 gap-y-2" data-gezielt-klasse="">
      <span className="text-sm font-semibold text-ink">{l.klasse}</span>
      {wirksam ? (
        <>
          <GezieltKaestchen zeichen={wirksam.zeichen} sprache={sprache} farben={farben} />
          <span className="text-sm text-ink-soft">{gezieltZusammenfassung(wirksam, t, sprache, true)}</span>
        </>
      ) : (
        <span className="text-sm text-ink-soft">{l.aus}</span>
      )}
      <HinweisKnopf knopfRef={waehlenRef} hinweis={l.tastenHinweis} onClick={() => setOffen(true)}>
        {l.tasten}
      </HinweisKnopf>
      {wirksam && (
        <HinweisKnopf
          hinweis={l.ausschaltenHinweis}
          onClick={() => {
            onSpeichern(null);
            waehlenRef.current?.focus();
          }}
        >
          {l.ausschalten}
        </HinweisKnopf>
      )}
      {offen && (
        <GezieltDialog
          modus="lehrkraft"
          titel={l.titelKlasse}
          start={wirksam}
          onSpeichern={onSpeichern}
          onSchliessen={() => setOffen(false)}
        />
      )}
    </div>
  );
}

/** Die Zeile je Kind in der aufgeklappten Einstellungs-Zeile. */
export function GezieltKindZeile({
  name,
  kind,
  klasse,
  vorschlag,
  onSpeichern,
}: {
  name: string;
  /** Der Wert am Kind (`null` = wie die Klasse). */
  kind: Gezielt | null | undefined;
  /** Der Wert an der Klasse. */
  klasse: Gezielt | null | undefined;
  /** Die wackligen Tasten dieses Kindes als einzelne Zeichen - leer, wenn nichts berechenbar ist. */
  vorschlag: readonly string[];
  onSpeichern: (g: Gezielt | null) => void;
}) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = GEZIELT_TEXTE[sprache];
  const l = GEZIELT_LEHRKRAFT_TEXTE[sprache];
  const farben = useFarben();
  const [offen, setOffen] = useState(false);
  const aendernRef = useRef<HTMLButtonElement>(null);
  const heute = new Date();
  const h = gezieltHerkunft(kind, klasse, heute);
  const klasseWirksam = gezieltWirksam(klasse, heute);
  const eigen = h.quelle === "kind" || h.quelle === "kind-aus";

  return (
    <div className="flex basis-full flex-wrap items-center gap-x-3 gap-y-2" data-gezielt-kind="">
      <span className="text-sm font-semibold text-ink">{l.kind}</span>
      {h.quelle === "kind-aus" ? (
        <span className="text-sm text-ink-soft">{l.kindAusText}</span>
      ) : h.wirksam ? (
        <>
          <GezieltKaestchen zeichen={h.wirksam.zeichen} sprache={sprache} farben={farben} />
          <span className="text-sm text-ink-soft">{gezieltZusammenfassung(h.wirksam, t, sprache, true)}</span>
          <span className="text-sm text-ink-muted">
            {h.quelle === "kind" ? l.giltStatt : l.spalteWieKlasse}
          </span>
        </>
      ) : (
        <span className="text-sm text-ink-soft">{l.aus}</span>
      )}
      <HinweisKnopf knopfRef={aendernRef} hinweis={l.aendernHinweis} onClick={() => setOffen(true)}>
        {l.aendern}
      </HinweisKnopf>
      {eigen && (
        <HinweisKnopf
          hinweis={l.wieKlasseHinweis}
          onClick={() => {
            onSpeichern(null);
            aendernRef.current?.focus();
          }}
        >
          {l.wieKlasse}
        </HinweisKnopf>
      )}
      {klasseWirksam && h.quelle !== "kind-aus" && (
        <HinweisKnopf
          hinweis={l.kindAusHinweis}
          onClick={() => {
            onSpeichern(GEZIELT_KIND_AUS);
            aendernRef.current?.focus();
          }}
        >
          {l.kindAus}
        </HinweisKnopf>
      )}
      {offen && (
        <GezieltDialog
          modus="lehrkraft"
          titel={l.titelKind(name)}
          start={h.wirksam}
          vorschlag={vorschlag}
          onSpeichern={onSpeichern}
          onSchliessen={() => setOffen(false)}
        />
      )}
    </div>
  );
}

/** Die Tabellenzelle „Gezielt": Zeichen (mit Abstand), „wie die Klasse" oder „aus". */
export function GezieltSpalte({ herkunft }: { herkunft: GezieltHerkunft }) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const l = GEZIELT_LEHRKRAFT_TEXTE[sprache];
  const { wirksam, quelle } = herkunft;
  if (!wirksam || quelle === "keine" || quelle === "kind-aus") {
    return (
      <span className="text-ink-muted">
        <span aria-hidden="true">{l.spalteAus}</span>
        <span className="sr-only">{`${l.kopf}: ${l.spalteAus}`}</span>
      </span>
    );
  }
  const namen = wirksam.zeichen.map((z) => spokenLabel(z, sprache)).join(", ");
  return (
    <span>
      <span aria-hidden="true" className="font-legible font-semibold tracking-[0.2em]">
        {wirksam.zeichen.join("")}
      </span>
      {quelle === "klasse" && (
        <span aria-hidden="true" className="ml-1.5 text-sm text-ink-muted">
          {l.spalteWieKlasse}
        </span>
      )}
      <span className="sr-only">
        {`${l.kopf}: ${quelle === "klasse" ? `${l.spalteWieKlasse}, ` : ""}${namen}`}
      </span>
    </span>
  );
}

/** Die Leiste der Mehrfachauswahl - steht nur da, solange mindestens ein Kind markiert ist. */
export function GezieltMehrfachLeiste({
  anzahl,
  onSpeichern,
  onAufheben,
}: {
  anzahl: number;
  /** Der Wert, der jedem markierten Kind gesetzt wird. */
  onSpeichern: (g: Gezielt | null) => void;
  onAufheben: () => void;
}) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const l = GEZIELT_LEHRKRAFT_TEXTE[sprache];
  const [offen, setOffen] = useState(false);
  if (anzahl < 1) return null;
  return (
    <div
      role="group"
      aria-label={l.kind}
      className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-hairline bg-surface-sunken/40 px-3 py-2"
      data-gezielt-leiste=""
    >
      <p role="status" className="m-0 text-sm font-semibold text-ink">
        {l.markiertN(anzahl)}
      </p>
      <HinweisKnopf primaer hinweis={l.fuerDieseHinweis} onClick={() => setOffen(true)}>
        {l.fuerDiese}
      </HinweisKnopf>
      <HinweisKnopf hinweis={l.aufhebenHinweis} onClick={onAufheben}>
        {l.aufheben}
      </HinweisKnopf>
      {offen && (
        <GezieltDialog
          modus="lehrkraft"
          titel={l.titelMehrere(anzahl)}
          start={null}
          onSpeichern={onSpeichern}
          onSchliessen={() => setOffen(false)}
        />
      )}
    </div>
  );
}
