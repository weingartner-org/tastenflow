/**
 * ★★★★★ „FREIES SCHREIBEN" - DIE ZEILE DER TIPPCHALLENGE OHNE SOFORTKORREKTUR
 * (23.09.2026, `BAUPLAN-2026-09-23-FREIES-SCHREIBEN.md` §7, Anlass 3. Klasse HAS).
 *
 * Die Tippchallenge schreibt heute über `TypingSession` nach „erst richtig,
 * dann weiter": eine falsche Taste rückt nicht vor. Im neuen Modus tippt das
 * Kind FREI - Fehler bleiben stehen, die Rücktaste bessert nur in der
 * AKTUELLEN Zeile aus, gewertet wird erst am Ende (`freiVergleich.ts`, über
 * `SchreibprobeLauf.beendenFrei`).
 *
 * ── Eine EIGENE, schlanke Komponente statt eines zweiten Modus in TypingSession
 * `TypingSession.tsx` hat 3300+ Zeilen, ist der Kern JEDES Übens (Lehrgang,
 * Klassenmatch, Wortspiele, …) und wird von fünf Nutzern gleichzeitig
 * verändert - ein zweiter Zustand darin wäre das teuerste aller Risiken.
 * Übernommen ist darum nur die MECHANIK, nicht der Code:
 *  - das `<textarea rows={1} wrap="off">` mit `data-feld="tippen"`, Wert
 *    `zeilenPraefix + sollZeile`, `onBeforeInput`/`onPaste`/`onDrop`
 *    geblockt (siehe `TypingSession.tsx`, Abschnitt „EIN TEXTAREA, KEIN
 *    INPUT" - NVDA setzt den Feldinhalt bei einem MEHRZEILIGEN Feld hart
 *    links, `BEFUND-2026-09-10-BRAILLEZEILE-OHNE-KONTEXT.md`),
 *  - die Schreibmarke über `setSelectionRange` (hier immer am Ende der
 *    Ist-Zeile, siehe unten - es gibt kein „aktives Zeichen in der Mitte"),
 *  - `focusPracticeField`/`FOCUS_FIELD_EVENT` (dieselbe EINE Stelle, die den
 *    Fokus ins Tippfeld holt - Escape, „Beginnen", „Weiterschreiben"),
 *  - „einfach losschreiben" (ein Tastendruck irgendwo auf der Seite holt
 *    sich das Feld und diesen ersten Anschlag gleich mit).
 *
 * ── Warum HIER keine Markierung, keine Ansage der nächsten Taste ───────────
 * Johannes, 23.09.2026 (entschieden): „Keine Markierung beim Schreiben - wie
 * in der 10-Minuten-Abschrift von Typewriter." Die Ist-Zeile zeigt darum IMMER
 * dieselbe Schriftfarbe, egal ob ein Zeichen zum Soll passt oder nicht - ein
 * Vergleich Zeichen für Zeichen wäre ohnehin falsch (ein vergessener
 * Buchstabe verschöbe den Rest der Zeile, siehe `freiVergleich.ts`). Gewertet
 * wird über den WORTSTROM, am Ende der ganzen Probe.
 *
 * ── Zeilenende: Enter ODER Leertaste, nie nach Länge ────────────────────────
 * Klassen-Einstellung „Zeilenende mit Enter" (`account.zeilenEndeEnter"):
 * Enter beendet die Zeile, die Leertaste ist dann ein ganz normales Zeichen.
 * Sonst beendet die Leertaste die Zeile, SOBALD die Ist-Zeile schon so viele
 * Wörter hat wie die Soll-Zeile - das Leerzeichen wird dann nicht angehängt,
 * Enter bleibt wirkungslos. Der Wechsel geschieht SOFORT, ohne Pause
 * („ein Tastendruck ohne Antwort ist eine kaputte Tastatur") - anders als
 * `TypingSession`, die zwischen zwei Zeilen kurz für den Erfolgsklang wartet.
 *
 * ── Wartezeit: vereinfacht gegenüber TypingSession ─────────────────────────
 * `TypingSession` misst JEDE Anschlags-Lücke einer Zeile fair gegen die
 * Sprechzeit (`zeilenLuecke`, Bauplan F1c) - das braucht ein Geflecht aus
 * Refs, das an jeden einzelnen Anschlag hängt. Hier wird NUR die Lücke VOR
 * dem ERSTEN Anschlag der Zeile so vermessen (die Zeilenansage) und über
 * `onZeilenWartezeit` gemeldet; hört ein Kind mitten in der Zeile per Alt+W
 * noch einmal hin, wird diese zweite Wartezeit NICHT gesondert abgezogen.
 * Siehe den Bericht des bauenden Agenten für die Einzelheiten.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FOCUS_FIELD_EVENT,
  clearPracticeFocusRequest,
  isSpeaking,
  laufweiteWirksamerFaktor,
  notePracticeActivity,
  practiceIdleCap,
  primeSpeech,
  speakUi,
  spokenMs,
  takePracticeDelta,
  takePracticeFocusRequest,
  useTypingA11y,
  zeilenLuecke,
  type Lang,
  type Stufe,
  type ZeichenabstandFaktor,
} from "@/lib/typing";
import { istAltGrBuchstabe, istKuerzel } from "@/lib/typing/zeichenTaste";
import { feinesLangAttribut } from "@/lib/typing/schreibweise";
import { texte, type BedienSprache } from "@/lib/bedienSprache";
import { useFeststelltasteWarnung } from "./FeststelltasteWarnung";
// ★ L7 (19.09.2026): beim Schreiben nur die Übungszeile hell (Teil von CVI) -
// derselbe eigenständige Baustein wie in TypingSession, unverändert übernommen
// (er hört nur zu, hält keinen eigenen Zustand der Übung).
import { CviAbdunkeln } from "./CviAbdunkeln";

/** Liegt gerade ein modaler Dialog (die Escape-Rückfrage) über dem Feld? */
function modalOffen(): boolean {
  return (
    typeof document !== "undefined" &&
    !!document.querySelector('[role="dialog"][aria-modal="true"]')
  );
}

/** Wortzahl einer Zeile - Leerraum trennt, mehrfacher Leerraum zählt als einer. */
function woerterZahl(zeile: string): number {
  return zeile.trim().split(/\s+/).filter(Boolean).length;
}

/** Tasten, die die Schreibmarke NICHT bewegen dürfen (Bauplan §7). */
const BEWEGUNGSTASTEN = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Delete",
  "Home",
  "End",
]);

/**
 * ★ E11a-5 (26.09.2026, Falle 30): der Satz zur Tabulatortaste je Sprache -
 * vorher `sprache === "en" ? … : "Das ist Tab."`, für „fr" also Deutsch.
 * Derselbe Wortlaut wie `DAS_IST_TAB` in `TypingSession.tsx` (Chat, E11a-5);
 * beim Zusammenführen wird es EINE Tabelle.
 */
const DAS_IST_TAB: Record<BedienSprache, string> = {
  de: "Das ist Tab.",
  en: "That's Tab.",
  fr: "C'est la touche Tab.",
  es: "Esa es la tecla Tab.",
  it: "Questo è il tasto Tab.",
  // ★ O-PL (02.10.2026): wortgleich mit `TypingSession.tsx`.
  pl: "To jest klawisz Tab.",
  // ★ O-TR (02.10.2026): Endung an "tuş", nie an der Kappe (Glossar §1 Regel 6);
  // `TypingSession.tsx` soll denselben Wortlaut tragen.
  tr: "Bu, Tab tuşu.",
  // ★ O-CS (03.10.2026): im Satz „Tabulátor" (Glossar §2.9); `TypingSession.tsx`
  // soll denselben Wortlaut tragen.
  cs: "To je Tabulátor.",
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "Това е Tab.",
  el: "Αυτό είναι το πλήκτρο Tab.",
  hu: "Ez a Tab billentyű.",
  nl: "Dat is Tab.",
  pt: "É a tecla de tabulação.",
  br: "Esta é a tecla Tab.",
  ro: "Aceasta este tasta Tab.",
  sv: "Det här är Tabb.",
  uk: "Це клавіша Tab.",
};

const ZEILE_TEXTE = texte({
  de: { zeileVon: (n: number, gesamt: number) => `Zeile ${n} von ${gesamt}` },
  en: { zeileVon: (n: number, gesamt: number) => `Line ${n} of ${gesamt}` },
  fr: { zeileVon: (n: number, gesamt: number) => `Ligne ${n} sur ${gesamt}` },
  es: { zeileVon: (n: number, gesamt: number) => `Línea ${n} de ${gesamt}` },
  it: { zeileVon: (n: number, gesamt: number) => `Riga ${n} di ${gesamt}` },
  // ★ O-PL (02.10.2026): „Wiersz 2 z 12" (Glossar §2.2).
  pl: { zeileVon: (n: number, gesamt: number) => `Wiersz ${n} z ${gesamt}` },
  // ★ O-TR (02.10.2026): "Satır 2, toplam 12" (Glossar §1 Regel 6, nie "2 / 12").
  tr: { zeileVon: (n: number, gesamt: number) => `Satır ${n}, toplam ${gesamt}` },
  // ★ O-CS (03.10.2026): „Řádek 2/12" - Schrägstrich, keine Präposition vor der
  // Zahl, kein Schlusspunkt (Glossar §1 Regel 13, §4 Falle 4).
  cs: { zeileVon: (n: number, gesamt: number) => `Řádek ${n}/${gesamt}` },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: { zeileVon: (n: number, gesamt: number) => `Ред ${n}/${gesamt}` },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: { zeileVon: (n: number, gesamt: number) => `Γραμμή ${n} από ${gesamt}` },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: { zeileVon: (n: number, gesamt: number) => `Sor: ${n}/${gesamt}` },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: { zeileVon: (n: number, gesamt: number) => `Regel ${n} van ${gesamt}` },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: { zeileVon: (n: number, gesamt: number) => `Linha ${n} de ${gesamt}` },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: { zeileVon: (n: number, gesamt: number) => `Linha ${n} de ${gesamt}` },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: { zeileVon: (n: number, gesamt: number) => `Rândul ${n}/${gesamt}` },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: { zeileVon: (n: number, gesamt: number) => `Rad ${n}/${gesamt}` },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: { zeileVon: (n: number, gesamt: number) => `Рядок ${n}/${gesamt}` },
});

/** Was beim Abschluss EINER Zeile gemeldet wird. */
export interface FreieZeileFertig {
  /** Die fertige Ist-Zeile - ohne das trennende Leerzeichen/die Eingabetaste. */
  ist: string;
  /** Wirksame Rücktasten in DIESER Zeile. */
  korrekturen: number;
  /** Zeit an dieser Zeile (Wanduhr) in ms. */
  ms: number;
  /** Reine Tipp-Zeit ohne lange Untätigkeit (siehe `practiceClock.ts`). */
  activeMs: number;
}

export interface FreieSchreibzeileProps {
  /** Die Soll-Zeilen dieser Challenge (`SchreibprobeLauf`s `folge.zeilen`). */
  items: readonly string[];
  stufe: Stufe;
  voiceEnabled: boolean;
  /** Sprache des PRÜFUNGSTEXTS (Glossar: bleibt deutsch, auch bei englischer Bedienung). */
  lang?: Lang;
  /** Bedienungssprache - nur für den sr-only Zeilenstand hier. */
  sprache?: BedienSprache;
  zeichenabstand: ZeichenabstandFaktor;
  /** Klassen-Einstellung „Zeilenende mit Enter" (`account.zeilenEndeEnter`). */
  zeilenEnde?: boolean;
  /** Der Zeitstand links im Feld - siehe `zeilenZeitstand` in `schreibprobe.ts`. */
  zeilenPraefix?: string;
  /** Bei welcher Zeile (0-basiert) begonnen wird - nach einem Neuladen. */
  initialQi?: number;
  topSlot?: React.ReactNode;
  fortschrittSlot?: React.ReactNode;
  /** Zähler von aussen (Zeit um, „Fertig - abgeben") - siehe `TypingSessionProps.stoppSignal`. */
  stoppSignal?: number;
  /** Was in der angefangenen Zeile stand, als `stoppSignal` kam - IMMER genau einmal je Erhöhung. */
  onStopp?: (rest: { ist: string; korrekturen: number }) => void;
  /** Alle Soll-Zeilen sind geschrieben (praktisch nie - `mindZeichen` legt genug bereit). */
  onSessionDone?: () => void;
  /** Je fertiger Zeile - der Aufrufer summiert `korrekturen`/`ist` und ruft `onTask`. */
  onZeileFertig: (e: FreieZeileFertig) => void;
  /** Die Wartezeit vor dem ERSTEN Anschlag einer Zeile (ms) - siehe Dateikopf. */
  onZeilenWartezeit?: (ms: number, zeilenwechselMs: number) => void;
}

/** Eine Zeile aus Zeichen-Spans - dieselbe Laufweite/Schrift wie `TypingSession`s `PromptText`. */
function ZeichenZeile({
  text,
  ton,
  zeichenabstand,
  fontSize,
  mitCaret,
  datenZeile,
}: {
  text: string;
  ton: string;
  zeichenabstand: ZeichenabstandFaktor;
  fontSize: string;
  mitCaret?: boolean;
  /** ★ Reiner Test-Anker (`soll`/`ist`) - berührt weder Darstellung noch a11y. */
  datenZeile: "soll" | "ist";
}) {
  const laufweiteFaktor = laufweiteWirksamerFaktor(zeichenabstand);
  return (
    <div
      data-zeile={datenZeile}
      className={
        "tt-uebungsschrift flex w-max shrink-0 items-stretch whitespace-nowrap font-legible font-semibold leading-snug tracking-wide " +
        ton +
        (laufweiteFaktor > 1 ? " tt-laufweite" : "")
      }
      style={{
        fontSize,
        ...(laufweiteFaktor > 1
          ? ({ "--tt-laufweite": laufweiteFaktor } as React.CSSProperties)
          : null),
      }}
    >
      {[...text].map((ch, i) => (
        <span key={i} className="rounded px-[0.06em]">
          {ch === " " ? " " : ch}
        </span>
      ))}
      {/* ★ Die dezente Schreibmarke - IMMER am Ende der Ist-Zeile (kein
          „aktives Zeichen in der Mitte" wie in TypingSession, weil im freien
          Modus nichts angesagt/markiert wird). `bg-current` statt einer
          eigenen Farbe: im Kontrastmodus übernimmt sie die Systemfarbe. */}
      {mitCaret && (
        <span aria-hidden="true" className="ml-px inline-block w-[2px] shrink-0 bg-current opacity-70" />
      )}
    </div>
  );
}

export function FreieSchreibzeile({
  items,
  stufe,
  voiceEnabled,
  lang = "de",
  sprache = "de",
  zeichenabstand,
  zeilenEnde = false,
  zeilenPraefix = "",
  initialQi = 0,
  topSlot,
  fortschrittSlot,
  stoppSignal,
  onStopp,
  onSessionDone,
  onZeileFertig,
  onZeilenWartezeit,
}: FreieSchreibzeileProps) {
  const t = ZEILE_TEXTE[sprache];
  const { pruefe: pruefeFeststelltaste, hinweis: feststelltasteHinweis } = useFeststelltasteWarnung(sprache);
  const zoom = useTypingA11y((s) => s.zoom);
  const promptSize = `${(2.4 * zoom).toFixed(2)}rem`;

  const [qi, setQi] = useState(() =>
    Math.min(Math.max(0, Math.round(initialQi)), Math.max(0, items.length - 1)),
  );
  const [ist, setIst] = useState("");
  const expected = items[qi] ?? "";

  const fieldRef = useRef<HTMLTextAreaElement>(null);
  /** Die ganze Karte (Zeilen + Feld) - bleibt hell, wenn CVI-Abdunkeln greift. */
  const karteRef = useRef<HTMLDivElement>(null);
  const istRef = useRef("");
  const qiRef = useRef(qi);
  qiRef.current = qi;
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const korrekturenInLineRef = useRef(0);
  const beendetRef = useRef(false);
  const stoppRef = useRef(stoppSignal ?? 0);

  // ── Wartezeit-Messung (vereinfacht, siehe Dateikopf) ──────────────────────
  const ersterAnschlagGemeldetRef = useRef(false);
  const zeileGezeigtAtRef = useRef(Date.now());
  const spokenBeiZeigenRef = useRef(0);
  const zeileStartRealMsRef = useRef(Date.now());

  /**
   * ★ Immer FRISCH, nie in einer Abhängigkeitsliste: `verarbeiteTaste` ist
   * über `useCallback([])` STABIL (sonst müsste der Dokument-Zuhörer
   * „einfach losschreiben" bei jedem Prüfungsuhr-Takt - jede Sekunde! - neu
   * angemeldet werden). Was sich ändert, liest die Funktion über diesen Ref.
   */
  const propsRef = useRef({ voiceEnabled, expected, zeilenEnde, onZeileFertig, onSessionDone });
  propsRef.current = { voiceEnabled, expected, zeilenEnde, onZeileFertig, onSessionDone };

  // ── Zeilenanfang: Wartezeit-Buchführung zurücksetzen, ggf. vorlesen ───────
  useEffect(() => {
    korrekturenInLineRef.current = 0;
    ersterAnschlagGemeldetRef.current = false;
    zeileGezeigtAtRef.current = Date.now();
    spokenBeiZeigenRef.current = spokenMs();
    zeileStartRealMsRef.current = Date.now();
    if (voiceEnabled && expected) speakUi(expected, undefined, undefined, lang);
    // Genau einmal je Zeile - wie in TypingSession (siehe dort).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi]);

  // ── Alt+W: die Soll-Zeile noch einmal (siehe Dateikopf zur Braillezeile). ─
  useEffect(() => {
    const onAnnounceTask = () => {
      const zeile = propsRef.current.expected;
      if (zeile) speakUi(zeile, undefined, undefined, lang);
    };
    window.addEventListener("tippen-announce-task", onAnnounceTask);
    return () => window.removeEventListener("tippen-announce-task", onAnnounceTask);
  }, [lang]);

  // ── Schreibmarke: praefix.length + min(ist.length, soll.length) ──────────
  const syncCaret = useCallback(() => {
    const el = fieldRef.current;
    if (!el) return;
    try {
      const ab = zeilenPraefix.length + Math.min(istRef.current.length, expected.length);
      el.setSelectionRange(ab, ab);
    } catch {
      /* Umgebung ohne Selektions-API (Test) */
    }
  }, [zeilenPraefix, expected]);

  // Neue Zeile: Fokus holen (ausser ein modaler Dialog hat ihn) + Zeiger setzen.
  useLayoutEffect(() => {
    const el = fieldRef.current;
    if (el && document.activeElement !== el && !modalOffen()) el.focus();
    syncCaret();
  }, [qi, syncCaret]);

  // Nur der Zeiger, ohne den Fokus zu stehlen (Getipptes, Zeitstand-Wechsel).
  useLayoutEffect(() => {
    syncCaret();
  }, [ist, zeilenPraefix, syncCaret]);

  // „Ins Eingabefeld springen" - dieselbe EINE Stelle wie in TypingSession.
  useEffect(() => {
    const focusField = () => {
      if (modalOffen()) return;
      const el = fieldRef.current;
      if (!el) return;
      clearPracticeFocusRequest();
      el.focus();
    };
    window.addEventListener(FOCUS_FIELD_EVENT, focusField);
    if (takePracticeFocusRequest()) focusField();
    return () => window.removeEventListener(FOCUS_FIELD_EVENT, focusField);
  }, []);

  /**
   * Der eigentliche Anschlag - siehe Bauplan §7: Zeichen/Leertaste hängen an,
   * Rücktaste löscht in der Zeile (leer: nichts), Bewegungstasten tun nichts,
   * Alt/Strg/Cmd gehören der Seite, Zeilenende per Enter ODER Leertaste nach
   * Wortzahl (nie beides, nie nach Länge).
   */
  const verarbeiteTaste = useCallback(
    (e: { key: string; code?: string; altKey: boolean; ctrlKey: boolean; metaKey: boolean; getModifierState?: (taste: "AltGraph" | "CapsLock") => boolean; preventDefault(): void; stopPropagation?(): void }) => {
      if (beendetRef.current) return;
      pruefeFeststelltaste(e);
      if (propsRef.current.voiceEnabled) primeSpeech();
      if (e.key === "Shift") return;
      // ★ E4 (25.09.2026): „Dead" braucht HIER keine eigene Ausnahme - anders
      // als in `useTypingItem.ts`/`useExpedition.ts` gibt es kein festes
      // Lernziel je Position (freies Schreiben, keine Wertung), darum wird
      // JEDES Zeichen genau so angehängt, wie es kommt (siehe unten, „Ein
      // normales Zeichen"). `Dead` fällt schon über den allgemeinen
      // `e.key.length !== 1`-Filter weiter unten heraus - wie „Shift" hier -
      // und das zusammengesetzte Zeichen (z. B. „ê") kommt danach im ZWEITEN
      // `keydown` an und wird ganz normal angehängt (BEFUND-2026-09-25-E1-
      // TOTASTEN-MAC/-WINDOWS.md: das fertige Zeichen steht im zweiten
      // `keydown`, kein Kompositions-Umbau nötig).
      // ★ 25.09.2026: Tab bleibt in der Zeile - wie in der Übungszeile
      // (`TypingSession`, dort die Begründung: Tab, Tab, Tab, Enter führte
      // die Kinder ins Impressum). Umschalt + Tab führt weiter hinaus.
      if (e.key === "Tab" && !(e as { shiftKey?: boolean }).shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // In der Bedienungssprache - `lang` ist die Sprache des Prüfungstexts.
        speakUi(DAS_IST_TAB[sprache], undefined, undefined, sprache);
        return;
      }
      // ★ AltGr (Windows: Strg + Alt) tippt `@ € { }` - kein Kürzel (`zeichenTaste.ts`).
      if (istKuerzel(e)) return;
      // ★ F3-pl (02.10.2026): Option + Buchstabe am Mac „Polish - Pro" (ą ć ę …) ist ein Zeichen - die
      // Alt-Kürzel der Seite am Fenster dürfen den Anschlag nicht auch bekommen (`istAltGrBuchstabe`).
      if (istAltGrBuchstabe(e)) e.stopPropagation?.();

      const merkeErstenAnschlag = () => {
        if (ersterAnschlagGemeldetRef.current) return;
        ersterAnschlagGemeldetRef.current = true;
        const rawDelta = Date.now() - zeileGezeigtAtRef.current;
        const spokenInGap = spokenMs() - spokenBeiZeigenRef.current;
        const luecke = zeilenLuecke(rawDelta, spokenInGap, isSpeaking(), practiceIdleCap());
        onZeilenWartezeit?.(luecke.zuhoerMs, 0);
      };

      const zeileAbschliessen = () => {
        const fertigIst = istRef.current;
        const korrekturen = korrekturenInLineRef.current;
        const ms = Math.max(0, Date.now() - zeileStartRealMsRef.current);
        const activeMs = Math.round(takePracticeDelta());
        korrekturenInLineRef.current = 0;
        propsRef.current.onZeileFertig({ ist: fertigIst, korrekturen, ms, activeMs });
        istRef.current = "";
        setIst("");
        const naechste = qiRef.current + 1;
        if (naechste >= itemsRef.current.length) {
          beendetRef.current = true;
          propsRef.current.onSessionDone?.();
          return;
        }
        qiRef.current = naechste;
        setQi(naechste);
      };

      if (BEWEGUNGSTASTEN.has(e.key)) {
        e.preventDefault();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        notePracticeActivity();
        merkeErstenAnschlag();
        // ★ Rücktaste NUR in der aktuellen Zeile - eine leere Zeile bleibt leer.
        if (istRef.current.length > 0) {
          korrekturenInLineRef.current += 1;
          istRef.current = istRef.current.slice(0, -1);
          setIst(istRef.current);
        }
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        notePracticeActivity();
        merkeErstenAnschlag();
        // Nur wirksam, wenn die Klasse „Zeilenende mit Enter" eingestellt hat -
        // sonst ignoriert (Bauplan §7: „Enter wird dann ignoriert").
        if (propsRef.current.zeilenEnde) zeileAbschliessen();
        return;
      }

      if (e.key.length !== 1) return; // Tab, F-Tasten, Escape u. ä. - der Seite überlassen

      if (e.key === " " && !propsRef.current.zeilenEnde) {
        const sollWoerter = woerterZahl(propsRef.current.expected);
        const bisher = woerterZahl(istRef.current);
        if (sollWoerter > 0 && bisher >= sollWoerter) {
          // Das Leerzeichen wird NICHT angehängt - es beendet die Zeile.
          e.preventDefault();
          notePracticeActivity();
          merkeErstenAnschlag();
          zeileAbschliessen();
          return;
        }
      }

      // Ein normales Zeichen - so, wie es kommt (kein Auto-Gross, keine Wertung hier).
      e.preventDefault();
      notePracticeActivity();
      merkeErstenAnschlag();
      istRef.current += e.key;
      setIst(istRef.current);
    },
    [onZeilenWartezeit, sprache, pruefeFeststelltaste],
  );

  // „Einfach losschreiben": ein Tastendruck irgendwo auf der Seite holt sich
  // das Feld UND diesen ersten Anschlag - dieselbe Regel wie in TypingSession.
  useEffect(() => {
    const onDocKey = (e: KeyboardEvent) => {
      if (beendetRef.current) return;
      // ★ AltGr (Windows: Strg + Alt) tippt `@ € { }` - kein Kürzel (`zeichenTaste.ts`).
      if (istKuerzel(e)) return;
      if (e.key.length !== 1 && e.key !== "Backspace" && e.key !== "Enter") return;
      if (modalOffen()) return;
      const field = fieldRef.current;
      if (!field) return;
      const ae = document.activeElement;
      if (ae === field) return;
      const tag = (ae?.tagName ?? "").toLowerCase();
      if (["input", "select", "textarea", "button"].includes(tag)) return;
      if (propsRef.current.voiceEnabled) primeSpeech();
      field.focus();
      verarbeiteTaste(e);
    };
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
  }, [verarbeiteTaste]);

  // ── Abbruch von aussen (Zeit um, „Fertig - abgeben") ──────────────────────
  useEffect(() => {
    const jetzt = stoppSignal ?? 0;
    if (jetzt === stoppRef.current) return;
    stoppRef.current = jetzt;
    if (beendetRef.current) return;
    beendetRef.current = true;
    onStopp?.({ ist: istRef.current, korrekturen: korrekturenInLineRef.current });
  }, [stoppSignal, onStopp]);

  return (
    <div
      ref={karteRef}
      className="card rounded-2xl focus-within:ring-4 focus-within:ring-accent"
      data-stufe={stufe}
    >
      {/* ★ L7 (19.09.2026): mit „Zeichenabstand gross (CVI)" wird beim
          Schreiben alles ausser dieser Karte abgedunkelt - siehe
          `CviAbdunkeln.tsx`. Dieselbe Bedingung wie in TypingSession
          (`zeichenabstand > 1`), rein sichtbar, hört nur mit. */}
      <CviAbdunkeln aktiv={zeichenabstand > 1} zielRef={karteRef} />
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-1.5">
        <span className="sr-only">{t.zeileVon(qi + 1, items.length)}</span>
        {fortschrittSlot}
      </div>
      {topSlot}
      {feststelltasteHinweis}
      {/* ⚠️ overflow-x-auto statt overflow-clip (wie TypingSession): Hier gibt
          es kein Gleiten/Zentrieren des aktiven Zeichens - eine sehr lange
          Zeile (z. B. bei starker Vergrösserung) bleibt so wenigstens per
          Scrollen erreichbar, statt am Kartenrand abgeschnitten zu werden. */}
      <div
        className="relative cursor-text overflow-x-auto overflow-y-clip rounded-b-2xl px-5 py-3"
        onClick={() => fieldRef.current?.focus()}
      >
        {/* Rein optisch - MUSS vor Screenreader/Braillezeile verborgen sein
            (aria-hidden): Der zugängliche Text kommt ausschliesslich aus dem
            Feld darunter, wie in TypingSession. */}
        <div aria-hidden="true" className="pointer-events-none flex flex-col gap-1">
          <ZeichenZeile
            text={expected}
            ton="text-ink-muted"
            zeichenabstand={zeichenabstand}
            fontSize={promptSize}
            datenZeile="soll"
          />
          <ZeichenZeile
            text={ist}
            ton="text-ink"
            zeichenabstand={zeichenabstand}
            fontSize={promptSize}
            mitCaret
            datenZeile="ist"
          />
        </div>
        {/* Das echte, für Screenreader/Braillezeile zugängliche Feld - siehe
            den Dateikopf („EIN TEXTAREA, KEIN INPUT"). Sein Wert ist IMMER
            Präfix + SOLL-Zeile (nie das Getippte) - so liest ein Kind mit
            Braillezeile die Vorlage wie beim strengen Modus; das Getippte
            steht nur sichtbar darüber/darunter (siehe die Zeilen oben). */}
        <textarea
          ref={fieldRef}
          data-typing-field="practice"
          // ★ E10: „en" wird nur mit dem Probe-Schalter zu „en-GB"/„en-US"
          // (feinesLangAttribut, `schreibweise.ts`) - ohne ihn byte-identisch „en".
          lang={feinesLangAttribut(lang)}
          data-feld="tippen"
          rows={1}
          wrap="off"
          value={zeilenPraefix + expected}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          onFocus={() => syncCaret()}
          style={{
            forcedColorAdjust: "none",
            fontSize: promptSize,
            resize: "none",
            overflow: "hidden",
            whiteSpace: "pre",
          }}
          onChange={() => {}}
          onBeforeInput={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          onKeyDown={verarbeiteTaste}
          className="absolute inset-0 h-full w-full rounded-2xl bg-transparent px-5 py-3 font-legible font-semibold leading-snug text-transparent caret-transparent outline-none"
        />
      </div>
    </div>
  );
}
