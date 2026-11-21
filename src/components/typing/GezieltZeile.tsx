/**
 * ★ GEZIELT ÜBEN (13.11.2026, Bauplan §4): die EINE Zeile „Gezielt üben" im Zahnrad, Gruppe „Was übst du?".
 *
 *   • Selbst einstellbar: Schalter (an/aus) · die gewählten Zeichen als Kästchen mit Fingerfarbe · „viel · bis ich es
 *     ausschalte" · „Tasten wählen …". Aus und ohne Zeichen: „Aus - alle Tasten wie im Lehrgang" + „Tasten wählen …".
 *   • Kind einer Klasse: NUR lesend („von deiner Lehrkraft eingestellt") - kein Knopf. Hat die Lehrkraft nichts
 *     eingestellt, gibt es die Zeile nicht (nichts, was das Kind nicht ändern kann und das nichts sagt).
 *
 * Der Schalter ist KEIN `disabled`-Knopf: Aus → an öffnet die Auswahl (an gibt es nur mit Tasten), an → aus
 * schaltet ab und sagt es.
 */
import { GEBIET, useBedienSprache } from "@/lib/bedienSprache";
import { FINGERS, fingerForChar, spokenLabel } from "@/lib/typing/fingers";
import { datumLokal, type Gezielt } from "@/lib/typing/gezielt";
import { GEZIELT_TEXTE, type GezieltTexte } from "@/lib/typing/gezieltTexte";
import type { BedienSprache } from "@/lib/bedienSprache";
import { Tipp } from "@/components/Tipp";
import { useBedienStimme } from "./useBedienStimme";

/** Das kurze Datum: „Fr 20.11." in der Schreibweise der Bedienungssprache. */
export function kurzesDatum(bis: string, sprache: BedienSprache): string {
  try {
    return new Date(`${bis}T12:00:00`).toLocaleDateString(GEBIET[sprache], {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    });
  } catch {
    return bis;
  }
}

/** „viel · bis ich es ausschalte" - der Text neben den Kästchen. */
export function gezieltZusammenfassung(
  g: Gezielt,
  t: GezieltTexte,
  sprache: BedienSprache,
  vonLehrkraft: boolean,
): string {
  const anteil = g.anteil === "wenig" ? t.kurzWenig : g.anteil === "nur" ? t.kurzNur : t.kurzViel;
  if (g.bis === null) return vonLehrkraft ? anteil : `${anteil} · ${t.dauerOhne}`;
  const dauer = g.bis === datumLokal(new Date()) ? t.dauerHeute : t.dauerBis(kurzesDatum(g.bis, sprache));
  return `${anteil} · ${dauer}`;
}

/** Die gewählten Zeichen als Kästchen mit Fingerfarbe. */
export function GezieltKaestchen({
  zeichen,
  sprache,
  farben,
}: {
  zeichen: readonly string[];
  sprache: BedienSprache;
  farben: boolean;
}) {
  return (
    <ul className="m-0 flex list-none flex-wrap items-center gap-1 p-0">
      {zeichen.map((z) => {
        const finger = fingerForChar(z);
        return (
          <li
            key={z}
            aria-label={spokenLabel(z, sprache)}
            className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-hairline bg-surface px-1 font-legible text-base font-semibold text-ink"
            style={farben && finger ? { borderBottomColor: FINGERS[finger.id].farbe, borderBottomWidth: 4 } : undefined}
          >
            <span aria-hidden="true">{z}</span>
          </li>
        );
      })}
    </ul>
  );
}

export interface GezieltZeileProps {
  /** Was heute gilt (Vorrang und Ablauf sind schon gerechnet) - `null` = aus. */
  wirksam: Gezielt | null;
  /** Die Lehrkraft hat es eingestellt: nur lesen. */
  vonLehrkraft: boolean;
  /** „Tasten wählen …" - öffnet den Dialog. */
  onWaehlen: () => void;
  /** Ausschalten. */
  onAus: () => void;
  farben: boolean;
}

export function GezieltZeile({ wirksam, vonLehrkraft, onWaehlen, onAus, farben }: GezieltZeileProps) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = GEZIELT_TEXTE[sprache];
  const stimme = useBedienStimme();
  const an = !!wirksam;

  if (vonLehrkraft) {
    if (!wirksam) return null;
    return (
      <div className="flex basis-full flex-wrap items-center gap-x-3 gap-y-1" data-gezielt-zeile="lehrkraft">
        <span className="text-sm font-semibold text-ink">{t.zeile}</span>
        <GezieltKaestchen zeichen={wirksam.zeichen} sprache={sprache} farben={farben} />
        <span className="text-sm text-ink-soft">{gezieltZusammenfassung(wirksam, t, sprache, true)}</span>
        <span className="text-sm text-ink-muted">{t.vonLehrkraft}</span>
      </div>
    );
  }

  return (
    <div className="flex basis-full flex-wrap items-center gap-x-3 gap-y-2" data-gezielt-zeile="selbst">
      <Tipp text={t.hinweis}>
        {(hinweisId) => (
          <button
            type="button"
            aria-pressed={an}
            aria-describedby={hinweisId}
            className={(an ? "btn-primary" : "btn-secondary") + " btn-toggle"}
            onClick={() => {
              if (an) {
                onAus();
                stimme.sprich(t.ansageAus);
              } else {
                onWaehlen();
              }
            }}
          >
            <span aria-hidden="true">🎯</span> {t.toggle(an)}
          </button>
        )}
      </Tipp>
      {wirksam ? (
        <>
          <GezieltKaestchen zeichen={wirksam.zeichen} sprache={sprache} farben={farben} />
          <span className="text-sm text-ink-soft">{gezieltZusammenfassung(wirksam, t, sprache, false)}</span>
        </>
      ) : (
        <span className="text-sm text-ink-soft">{t.zeileAus}</span>
      )}
      <button type="button" className="btn-secondary btn-toggle" onClick={onWaehlen}>
        {t.tastenWaehlen}
      </button>
    </div>
  );
}
