/**
 * „GRUNDSTELLUNG PRÜFEN" (D-8, Didaktik-Entscheidung 27./28.09.2026) - das
 * Bauteil. Die Logik und alle Sätze stehen in `lib/typing/grundstellung.ts`.
 *
 * Das Kind legt die Finger auf die Grundreihe und drückt alle acht Grundtasten
 * zugleich; das Programm sagt, ob alle acht Finger richtig liegen - oder
 * welcher daneben liegt. Ohne Zeitdruck, beliebig oft: Jeder neue Griff ist
 * ein neuer Versuch.
 *
 * Wo es steht (kein neuer Menüpunkt):
 *  • im Regal „Wortspiele" als erster Platz - immer, auch bevor ein Wortspiel
 *    offen ist (gerade dann);
 *  • in „Mein Training" als Angebot auf der ersten Abschluss-Karte einer
 *    Sitzung, solange ein Kind noch an der Grundreihe übt.
 *
 * ── Barrierefreiheit (BAUART-ARBEITSBLATT-BARRIEREFREI §16, Tasten erkunden) ──
 *  • Die Zeile steht im Wert eines `<textarea rows={1} wrap="off">`, das den
 *    Fokus hat - dieselbe gemessene Bauart wie „Tasten erkunden": NVDA setzt
 *    ein mehrzeiliges Feld hart links an die Braillezeile, der Inhalt bleibt
 *    stehen, bis das nächste Ergebnis kommt. KEIN Live-Bereich - der gäbe eine
 *    Blitzmeldung, und die Braillezeile spränge.
 *  • Nach jedem neuen Satz die Schreibmarke über einen kleinen Umweg auf
 *    Zelle 1 (erst 1, dann 0): NVDA liest das Feld nur neu, wenn sie sich
 *    BEWEGT (gemessen für „Tasten erkunden", 12.09.2026).
 *  • Gesprochen wird über `speakUi` - achtet den Vorlesen-Schalter. Während
 *    der Finger-Griff läuft, wird NICHTS gesagt; erst das Ergebnis.
 *  • Esc führt zurück (Fokus-Ziel bestimmt die Aufrufstelle: in „Mein
 *    Training" die Eingabezeile, im Regal der Platz „Grundstellung prüfen").
 *    Tab führt zum Schalter „Zurück". Alt-Kürzel der Seite laufen durch
 *    (`data-kuerzel="an"`), Strg macht wie überall still.
 *  • Nichts ist `disabled`.
 */
import { htmlLang } from "./htmlLang";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { speakUi, type Lang } from "@/lib/typing";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import {
  GrundstellungsPruefung,
  befundSatz,
  grundstellungAnleitung,
  grundstellungTitel,
  grundtastenFuer,
  type Befund,
} from "@/lib/typing/grundstellung";
import { useKeyboardLayout } from "./useKeyboardLayout";

const TEXTE = texte({
  de: {
    zurueckEsc: "Zurück mit Esc.",
    zurueck: "Zurück",
    nochmal: "Noch einmal? Einfach wieder alle acht Tasten drücken.",
  },
  en: {
    zurueckEsc: "Go back with Esc.",
    zurueck: "Back",
    nochmal: "Again? Just press all eight keys once more.",
  },
  fr: {
    zurueckEsc: "Retour avec Échap.",
    zurueck: "Retour",
    nochmal: "Encore une fois ? Appuie simplement de nouveau sur les huit touches.",
  },
  es: {
    zurueckEsc: "Volver con Esc.",
    zurueck: "Volver",
    nochmal: "¿Otra vez? Pulsa de nuevo las ocho teclas.",
  },
  it: {
    zurueckEsc: "Torna indietro con Esc.",
    zurueck: "Indietro",
    nochmal: "Ancora una volta? Premi di nuovo gli otto tasti.",
  },
  // ★ O-PL (02.10.2026): ty; Knopf „Wstecz" (Glossar Regel 12), Kürzel nach dem Doppelpunkt.
  pl: {
    zurueckEsc: "Powrót: Esc.",
    zurueck: "Wstecz",
    nochmal: "Jeszcze raz? Po prostu naciśnij znowu wszystkie osiem klawiszy.",
  },
  // ★ O-TR (02.10.2026): sen; Knopf „Geri dön" - „Geri" allein ist mehrdeutig
  // (Glossar Regel 10); das Kürzel nach dem Doppelpunkt, ohne Endung an „Esc".
  tr: {
    zurueckEsc: "Geri dönmek için: Esc.",
    zurueck: "Geri dön",
    nochmal: "Tekrar mı? Sekiz tuşa yeniden bas, yeter.",
  },
  // ★ O-CS (03.10.2026): ty; Knopf „Zpět" (Glossar Regel 10 - Tastenflow hat kein
  // Rückgängig), das Kürzel nach dem Doppelpunkt.
  cs: {
    zurueckEsc: "Zpět: Esc.",
    zurueck: "Zpět",
    nochmal: "Ještě jednou? Prostě znovu stiskni všech osm kláves.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      zurueckEsc: "Обратно с Esc.",
      zurueck: "Обратно",
      nochmal: "Още веднъж? Просто натисни пак всичките осем клавиша.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      zurueckEsc: "Επιστροφή με Esc.",
      zurueck: "Πίσω",
      nochmal: "Ξανά; Απλώς πάτησε πάλι και τα οκτώ πλήκτρα.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      zurueckEsc: "Vissza az Esc billentyűvel.",
      zurueck: "Vissza",
      nochmal: "Még egyszer? Nyomd meg újra mind a nyolc billentyűt.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      zurueckEsc: "Terug met Esc.",
      zurueck: "Terug",
      nochmal: "Nog een keer? Druk gewoon weer alle acht toetsen in.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      zurueckEsc: "Voltar com Esc.",
      zurueck: "Voltar",
      nochmal: "Outra vez? É só premir de novo as oito teclas ao mesmo tempo.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      zurueckEsc: "Voltar com Esc.",
      zurueck: "Voltar",
      nochmal: "De novo? É só pressionar as oito teclas mais uma vez.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      zurueckEsc: "Înapoi cu tasta Esc.",
      zurueck: "Înapoi",
      nochmal: "Încă o dată? Apasă din nou toate cele opt taste.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      zurueckEsc: "Tillbaka med Esc.",
      zurueck: "Tillbaka",
      nochmal: "En gång till? Tryck bara på alla åtta tangenterna igen.",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      zurueckEsc: "Назад - клавіша Esc.",
      zurueck: "Назад",
      nochmal: "Ще раз? Просто знову натисни всі вісім клавіш.",
    },
});

export function GrundstellungPruefen({
  onZurueck,
  lang = "de",
}: {
  /** Esc oder „Zurück". Die Aufrufstelle setzt das Fokus-Ziel. */
  onZurueck: () => void;
  /** Sprache ohne aktiven Sprachbereich (wie im Regal: die Übungssprache). */
  lang?: Lang;
}) {
  const { spracheGewaehlt, bereichAktiv } = useBedienSprache();
  const sprache: Lang = bereichAktiv ? spracheGewaehlt : lang;
  const t = TEXTE[sprache];
  const layout = useKeyboardLayout();
  const pruefung = useMemo(() => new GrundstellungsPruefung(layout), [layout]);
  const grund = useMemo(() => grundtastenFuer(layout), [layout]);
  const anleitung = grundstellungAnleitung(layout, sprache);

  const [zeile, setZeile] = useState(anleitung);
  const [befund, setBefund] = useState<Befund | null>(null);
  /** Zählt bei jedem Tastenereignis hoch - die Tastenkappen zeichnen neu. */
  const [, setTakt] = useState(0);
  /** Hat das Feld den Fokus (nimmt die Prüfung Tasten an)? */
  const [bereit, setBereit] = useState(false);
  const feldRef = useRef<HTMLTextAreaElement>(null);

  const sprich = useCallback(
    (satz: string) => {
      if (bereichAktiv) speakUi(satz, undefined, undefined, sprache);
      else speakUi(satz);
    },
    [bereichAktiv, sprache],
  );

  // Beim Öffnen: Fokus ins Feld (die nächste Taste gehört schon der Prüfung)
  // und die Anleitung EINMAL sagen.
  useEffect(() => {
    feldRef.current?.focus();
    sprich(`${grundstellungTitel(sprache)}. ${anleitung} ${t.zurueckEsc}`);
    // Nur beim Öffnen - ein Tastatur- oder Sprachwechsel mitten drin spricht nicht neu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Schreibmarke nach jedem neuen Satz über den Umweg 1 → 0 (siehe Kopf).
  useEffect(() => {
    const f = feldRef.current;
    if (!f) return;
    f.setSelectionRange(Math.min(1, f.value.length), Math.min(1, f.value.length));
    const id = window.setTimeout(() => {
      f.setSelectionRange(0, 0);
      f.scrollLeft = 0;
    }, 30);
    return () => window.clearTimeout(id);
  }, [zeile]);

  const melde = (b: Befund) => {
    const satz = befundSatz(b, layout, sprache);
    setBefund(b);
    setZeile(satz);
    sprich(satz);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      // Die Seite hört Esc ebenfalls (Fenster zu, Fokus zurück) - hier nur
      // unser eigener Ausweg.
      pruefung.zuruecksetzen();
      onZurueck();
      return;
    }
    // Kürzel der Seite (Alt), Strg (macht still), Befehlstaste und Tab
    // (zum Schalter „Zurück") laufen durch.
    if (e.altKey || e.ctrlKey || e.metaKey || e.key === "Tab") return;
    e.preventDefault();
    const b = pruefung.taste({
      art: "down",
      code: e.code,
      key: e.key,
      repeat: e.repeat,
      zeit: Date.now(),
    });
    setTakt((n) => n + 1);
    if (b) melde(b);
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const b = pruefung.taste({ art: "up", code: e.code, key: e.key, zeit: Date.now() });
    setTakt((n) => n + 1);
    if (b) melde(b);
  };

  const gut = befund?.art === "richtig";

  return (
    <div
      className="card space-y-4 p-6"
      lang={htmlLang(sprache)}
      // Wer mit dem Zeiger irgendwo in die Karte geht, landet wieder im Feld -
      // sonst kämen die acht Tasten nirgends an (der Schalter behält seinen).
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        e.preventDefault();
        feldRef.current?.focus();
      }}
    >
      <h2 className="m-0 text-xl font-semibold text-ink">{grundstellungTitel(sprache)}</h2>
      <p className="m-0 text-base text-ink-soft" aria-hidden="true">
        {anleitung}
      </p>

      {/* Die acht Tasten - rein optisch (die Braillezeile hat den Satz). Eine
          gehaltene Taste wird hervorgehoben; der Rahmen zeigt Sehenden, dass
          die Prüfung Tasten annimmt (das Feld selbst ist unsichtbar). */}
      <div
        className={
          "flex flex-wrap items-center justify-center gap-2 rounded-xl p-3 " +
          (bereit ? "ring-2 ring-accent" : "ring-1 ring-hairline")
        }
        aria-hidden="true"
      >
        {grund.map((g, i) => (
          <span key={`${g.reihe}:${g.spalte}`} className="flex items-center">
            {i === 4 && <span className="mx-3" />}
            <span
              className={
                "flex h-12 w-12 items-center justify-center rounded-lg border-2 font-legible text-xl font-semibold " +
                (pruefung.haelt(g)
                  ? "border-accent bg-accent-soft text-ink ring-2 ring-accent"
                  : "border-hairline bg-surface-sunken text-ink")
              }
            >
              {g.zeichen}
            </span>
          </span>
        ))}
      </div>

      {/* Das Ergebnis für Sehende - dieselben Wörter wie auf der Braillezeile. */}
      <p
        aria-hidden="true"
        className={
          "m-0 rounded-xl border-2 p-4 text-center text-lg font-semibold " +
          (gut ? "border-success bg-success-soft text-ink" : "border-hairline bg-surface text-ink")
        }
      >
        {befund ? zeile : t.nochmal}
      </p>

      {/* Die Braillezeile: EIN Feld, eine Zeile, kein Umbruch. */}
      <textarea
        ref={feldRef}
        data-grundstellung-zeile
        data-kuerzel="an"
        aria-label={grundstellungTitel(sprache)}
        className="sr-only"
        rows={1}
        wrap="off"
        value={zeile}
        onChange={() => {}}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onFocus={() => setBereit(true)}
        onBlur={() => {
          setBereit(false);
          pruefung.zuruecksetzen();
          setTakt((n) => n + 1);
        }}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        style={{ whiteSpace: "pre", resize: "none" }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-sm font-medium text-ink-muted">{t.zurueckEsc}</p>
        <button type="button" className="btn-secondary" onClick={onZurueck}>
          {t.zurueck}
        </button>
      </div>
    </div>
  );
}
