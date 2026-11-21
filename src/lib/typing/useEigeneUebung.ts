/**
 * ★★★ „EIGENE ÜBUNG" AUS DER SICHT DES KINDES (17.09.2026, Reihe seit Z1,
 * 19.09.2026).
 *
 * Der Haken beantwortet drei Fragen und sonst keine:
 *  1. **An welcher Übung arbeite ICH jetzt?** Die Klasse trägt eine REIHE
 *     (`eigeneUebungReihe.ts`); dran ist die älteste, die DIESES Kind noch
 *     nicht fertig hat. Ist sie fertig, kommt die nächste - jede mit ihrem
 *     eigenen Fenster (`useEigeneUebungAnkuendigung.ts`). Wer Tastenflow Tage
 *     später öffnet oder erst später in die Klasse kommt, bekommt alle noch
 *     laufenden der Reihe nach.
 *  2. **Bei welcher Zeile geht es weiter?** (Eigener Stand je Text, über
 *     Sitzungen und Geräte hinweg am Konto gemerkt.)
 *  3. **Habe ich das Fenster für diese Übung schon bestätigt?** (Z1: je Kind
 *     und Text am Konto, nicht mehr am Gerät - siehe `merkfenster.ts`.)
 *
 * Angezeigt wird hier nichts - das tun `EigeneUebungAnkuendigung` und
 * `EigeneUebungLauf`.
 *
 * ── „Festgehalten": wer mitten in einer Übung ist, darf sie fertig schreiben ──
 * Beendet die Lehrkraft eine Übung, verschwindet sie aus der Reihe. Ein Kind,
 * das GERADE darin schreibt (Fenster bestätigt), wird dadurch nicht mitten in
 * der Zeile herausgerissen: Die Übung bleibt für dieses Kind bis zum Ende
 * stehen - in dieser Sitzung. Wer sie noch nicht begonnen hat, bekommt sie
 * nicht mehr. Dasselbe Festhalten trägt auch die Abschluss-Karte: Sie bleibt
 * stehen, bis das Kind sie schliesst, auch wenn die Übung am Server schon als
 * fertig gilt (siehe unten).
 *
 * ── Warum „frisch lesen, dann schreiben" (Z1, 19.09.2026) ────────────────────
 * Bis dahin las dieser Haken den Fortschritt EINMAL beim Öffnen und schrieb
 * danach bei jeder Zeile den GANZEN, im Speicher gehaltenen Stand zurück.
 * Übte das Kind vorher 20 Minuten im normalen Training (das speichert
 * selbst) und startete die Lehrkraft dann per Realtime eine Übung, überschrieb
 * die erste Zeile der Übung diese 20 Minuten - Tastenstatistik und
 * freigeschaltete Tasten mit dem Stand vom Öffnen. Jetzt liest jeder
 * Schreibvorgang den Stand vom Server, rechnet NUR das Eigene ein (die
 * Anschläge dieser Übung, den Stand je Text) und schreibt dann - eins nach dem
 * anderen, nie zwei zugleich. Scheitert ein Schreibvorgang, bleiben seine
 * Anschläge vorgemerkt und gehen mit dem nächsten mit.
 *
 * ── „Fertig" steht am Server schon nach der letzten Zeile ─────────────────────
 * Die Abschluss-Karte (`TypingSession`) muss stehen bleiben, bis das Kind sie
 * schliesst - dafür sorgt das Festhalten. Am Server steht `fertig` aber schon
 * nach der LETZTEN ZEILE: Bis das Kind die Karte schliesst, ist das Speichern
 * durch, und das normale Training, das danach aufgebaut wird, liest den Stand
 * MIT „fertig" (sonst las es ihn womöglich davor, schrieb ihn beim nächsten
 * Speichern zurück, und die Übung kam beim nächsten Öffnen wieder). Beim
 * Schliessen wartet der Haken zusätzlich auf das Speichern (höchstens
 * {@link FERTIG_WARTET_HOECHSTENS_MS}).
 *
 * ── Wehrhaft in EINE Richtung ─────────────────────────────────────────────
 * Scheitert die Fortschritts-Abfrage, gilt „noch nicht fertig" - ein
 * Ladefehler darf einem Kind eine zugewiesene Übung nie WEGNEHMEN (dasselbe
 * Prinzip wie bei `useKlassenmatch`, nur umgekehrte Richtung). Und der Stand je
 * Text wächst nur (`vereinigeTextStand`): `zeile` nie zurück, `fertig`/
 * `angekuendigt` nie wieder `false` - zwei Geräte oder ein verspätetes
 * Speichern können sich damit nicht gegenseitig zurückwerfen.
 *
 * ── Ein Text, der sich nicht lesen lässt (Z1, 19.09.2026) ───────────────────
 * Bis dahin stand ein Kind, dessen Übungstext nicht zu lesen war, für immer
 * vor „Der zugewiesene Text wird geladen …" - ohne normales Training, Alt + B
 * gesperrt. Mit einer REIHE hielte so eine Übung zudem alle späteren auf.
 * Gemessen ist ein Weg dahin: `/api/tt/klassencode-aendern` stellt
 * `tt_eigene_texte` NICHT auf den neuen Code um (`UMBENENNEN` in
 * `tt_klasse_lib.pb.js`), und die Leseregel verlangt den Klassencode des
 * Kindes. Jetzt wird einmal nachgefragt ({@link TEXT_NOCHMAL_MS}); bleibt der
 * Text weg, wird die Übung für DIESE Sitzung übersprungen - nicht als fertig
 * gemerkt, beim nächsten Öffnen wird wieder gefragt.
 *
 * ── Was hier NICHT passiert ───────────────────────────────────────────────
 * Keine Tastenfreischaltung wird geprüft oder verändert - das ist Absicht
 * (siehe `tastenfreischaltung.ts`: `wendeRundenendeAn` wird von hier nie
 * aufgerufen). Was diese Übung an echter Tastenstatistik UND Übezeit
 * schreibt, macht `EigeneUebungLauf` über dieselben Wege wie eine gewöhnliche
 * Übungsrunde ({@link mergeLetters}).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { TypingAccount, TypingClass } from "./account";
import { gehoertEinerKlasse, stufeFuer } from "./account";
import { typingBackend } from "./backend";
import { useKlassenBeobachtung } from "./useKlassenBeobachtung";
import type { EigenerTextGelesen } from "./eigenerText";
import {
  eigeneUebungReihe,
  naechsteOffeneUebung,
  type EigeneUebungEintrag,
} from "./eigeneUebungReihe";
import { SHIFT_UNIT, ensureIntroduced, mergeLetters, type KeyEvent } from "./letters";
import { emptyProgress, loadProgress, saveProgress, type TypingProgress } from "./progress";
import { lernwegAus } from "./lernweg";
import { wackeligeTastenAus } from "./zeilenMessung";

/** Wie oft im Takt nach einer neuen/beendeten Übung gesehen wird (ms). */
export const EIGENE_UEBUNG_NACHFRAGE_MS = 45_000;

/**
 * Wie lange das Schliessen der Abschluss-Karte höchstens auf das Speichern
 * von „fertig" wartet (ms) - ohne Netz geht es danach trotzdem weiter.
 */
export const FERTIG_WARTET_HOECHSTENS_MS = 2_000;

/**
 * Lässt sich der Text einer Übung nicht lesen, wird nach so vielen ms noch
 * EINMAL gefragt - danach gilt er für diese Sitzung als unlesbar (siehe
 * „Ein Text, der sich nicht lesen lässt" im Dateikopf).
 */
export const TEXT_NOCHMAL_MS = 2_000;

type TextStaende = NonNullable<TypingProgress["customTextProgress"]>;

/**
 * Zwei Stände je Text zusammenführen - es gilt immer der WEITERE: die höhere
 * Zeile, `fertig`/`angekuendigt` sobald einer von beiden es sagt. So kann ein
 * älterer Stand (anderes Gerät, verspätetes Speichern, normales Training mit
 * altem Stand) einen neueren nie zurückwerfen.
 */
export function vereinigeTextStand(
  a: TextStaende | undefined,
  b: TextStaende | undefined,
): TextStaende | undefined {
  if (!a && !b) return undefined;
  const out: TextStaende = { ...(a ?? {}) };
  for (const [id, s] of Object.entries(b ?? {})) {
    const x = out[id];
    if (!x) {
      out[id] = s;
      continue;
    }
    out[id] = {
      zeile: Math.max(x.zeile ?? 0, s.zeile ?? 0),
      ...(x.fertig || s.fertig ? { fertig: true } : {}),
      ...(x.angekuendigt || s.angekuendigt ? { angekuendigt: true } : {}),
    };
  }
  return out;
}

export interface EigeneUebungStand {
  /**
   * Die Übung, an der DIESES Kind jetzt arbeitet - die älteste offene der
   * Reihe, oder die festgehaltene (siehe Dateikopf). `null` = nichts offen.
   */
  zeiger: EigeneUebungEintrag | null;
  /** Ist DIESES Kind gerade in einer eigenen Übung (`zeiger` gesetzt)? */
  dran: boolean;
  /** Ist der erste Ladeversuch (Klasse + eigener Fortschritt) durch? */
  geladen: boolean;
  /** Der Text zu `zeiger`, sobald geladen - nie der einer anderen Übung. */
  text: EigenerTextGelesen | null;
  /** Zeile, an der dieses Kind zuletzt stand - 0, wenn es zum ersten Mal beginnt. */
  startZeile: number;
  /** Die gelernten Tasten dieses Kindes - rein kosmetisch für die Tastatur-Darstellung. */
  unlocked: Set<string>;
  /** Ist die Umschalttaste bei diesem Kind schon gelernt - wie im normalen Training. */
  shiftLearned: boolean;
  /**
   * Schritt M (19.09.2026): die wackligen Tasten dieses Kindes - die Session
   * zählt je Zeile, wie sie gingen (nur gemessen, `zeilenMessung.ts`).
   */
  wackeligeTasten?: readonly string[];
  /**
   * Z1: Hat DIESES Kind das Fenster „Weiter geht es mit einer Übung von
   * deiner Lehrkraft" für `zeiger` schon bestätigt (am Konto, nicht am Gerät)?
   */
  angekuendigt: boolean;
  /** Z1: Fenster bestätigt - am Konto merken, die Übung für diese Sitzung festhalten. */
  bestaetigeAnkuendigung: () => void;
  /**
   * Nach einer fertig geschriebenen Zeile: Stand UND echte Tastenstatistik in
   * EINEM Schreibvorgang festhalten. Nach der letzten Zeile steht die Übung am
   * Server als fertig; `fertig: true` (beim Schliessen der Abschluss-Karte)
   * gibt sie auch auf dem Bildschirm frei - danach kommt die nächste der
   * Reihe oder das normale Training.
   */
  meldeFortschritt: (info: { zeile: number; anschlaege: readonly KeyEvent[]; fertig?: boolean }) => void;
}

/** Den vollen Fortschritt lesen - Konto oder Gerät, je nachdem. */
async function leseVollenFortschritt(account: TypingAccount | null | undefined): Promise<TypingProgress> {
  return account ? typingBackend().getProgress(account.id) : loadProgress();
}

export function useEigeneUebung(account: TypingAccount | null | undefined): EigeneUebungStand {
  const istKlassenkind = gehoertEinerKlasse(account);
  const classCode = istKlassenkind ? (account?.classCode ?? "") : "";
  const accountKey = account?.id ?? "";
  const accountRef = useRef(account);
  accountRef.current = account;

  // ── Die Klasse: welche Übungen laufen? ────────────────────────────────────
  const klasse = useKlassenBeobachtung<TypingClass | null>(
    useMemo(
      () => ({
        aktiv: !!classCode,
        taktMs: EIGENE_UEBUNG_NACHFRAGE_MS,
        hole: () => typingBackend().getClass(classCode),
        beobachte: ({ einrechnen }) =>
          typingBackend().beobachteKlasse(classCode, (cls) => {
            if (cls.code === classCode) einrechnen(() => cls);
          }),
      }),
      [classCode],
    ),
  );
  const reihe = useMemo(() => eigeneUebungReihe(klasse.daten), [klasse.daten]);

  // ── Der eigene Fortschritt ────────────────────────────────────────────────
  const [fortschritt, setFortschritt] = useState<TypingProgress | null>(null);
  const [fortschrittGeladen, setFortschrittGeladen] = useState(false);
  /**
   * Der Stand, auf dem jede Änderung aufbaut - SOFORT fortgeschrieben, nicht
   * erst nach dem nächsten Rendern: Zwei Meldungen kurz hintereinander dürfen
   * sich sonst gegenseitig überschreiben.
   */
  const fortschrittRef = useRef<TypingProgress | null>(null);
  /** Anschläge, die noch an keinem Server-Stand angekommen sind. */
  const ausstehend = useRef<KeyEvent[]>([]);
  /** Die Schreibvorgänge, eins nach dem anderen. */
  const kette = useRef<Promise<void>>(Promise.resolve());
  const lebt = useRef(true);
  useEffect(() => {
    lebt.current = true;
    return () => {
      lebt.current = false;
    };
  }, []);

  const setzeLokal = (p: TypingProgress) => {
    fortschrittRef.current = p;
    setFortschritt(p);
  };
  /** Einen frischen Server-Stand übernehmen, ohne Eigenes zu verlieren. */
  const mitEigenem = (server: TypingProgress): TypingProgress => ({
    ...server,
    letters: mergeLetters(server.letters, ausstehend.current),
    customTextProgress: vereinigeTextStand(
      server.customTextProgress,
      fortschrittRef.current?.customTextProgress,
    ),
  });

  const [festgehalten, setFestgehalten] = useState<EigeneUebungEintrag | null>(null);
  /** Übungen, deren Text sich in dieser Sitzung nicht lesen liess (siehe Dateikopf). */
  const [unlesbar, setUnlesbar] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    let aktiv = true;
    setFortschrittGeladen(false);
    fortschrittRef.current = null;
    setFortschritt(null);
    setFestgehalten(null);
    setUnlesbar(new Set());
    ausstehend.current = [];
    void leseVollenFortschritt(account)
      .then((p) => {
        if (aktiv) setzeLokal(p);
      })
      .catch(() => undefined)
      .finally(() => {
        if (aktiv) setFortschrittGeladen(true);
      });
    return () => {
      aktiv = false;
    };
    // Nur beim Kontowechsel neu laden - eine neue Übung allein ändert den
    // Fortschritt dieses Kindes nicht (frisch gelesen wird beim Einstieg,
    // siehe unten, und vor jedem Schreiben).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountKey]);

  /**
   * Speichern: frisch lesen, Eigenes einrechnen, schreiben - eins nach dem
   * anderen (siehe Dateikopf). Gibt das Ende DIESES Vorgangs zurück.
   */
  const sichere = (): Promise<void> => {
    const konto = accountRef.current;
    kette.current = kette.current.then(async () => {
      if (!konto) {
        const p = fortschrittRef.current;
        if (p) saveProgress(p);
        ausstehend.current = [];
        return;
      }
      try {
        const server = await typingBackend().getProgress(konto.id);
        const mitgenommen = ausstehend.current.length;
        const neu = mitEigenem(server);
        await typingBackend().saveProgress(konto.id, neu);
        ausstehend.current = ausstehend.current.slice(mitgenommen);
        // `neu` trägt die eben gespeicherten Anschläge schon - dazu nur, was
        // während des Speicherns noch dazukam.
        if (lebt.current && accountRef.current?.id === konto.id) setzeLokal(mitEigenem(neu));
      } catch {
        // Kein Netz oder abgewiesen: Die Anschläge bleiben vorgemerkt, der
        // Stand je Text steht im Speicher - der nächste Vorgang nimmt beides mit.
      }
    });
    return kette.current;
  };

  // ── Welche Übung ist jetzt dran? ─────────────────────────────────────────
  const offen = naechsteOffeneUebung(
    unlesbar.size > 0 ? reihe.filter((e) => !unlesbar.has(e.textId)) : reihe,
    fortschritt,
  );
  const aktuell = festgehalten && !unlesbar.has(festgehalten.textId) ? festgehalten : offen;
  const meinStand = aktuell ? fortschritt?.customTextProgress?.[aktuell.textId] : undefined;
  const angekuendigt = meinStand?.angekuendigt === true;
  // ★ Ohne geladenen Fortschritt gilt „noch nicht fertig" - siehe Dateikopf.
  const dran = !!aktuell;
  const geladen = klasse.geladen && fortschrittGeladen;

  // Eine schon bestätigte Übung (auch von gestern, auch von einem anderen
  // Gerät) gilt als begonnen - sie wird festgehalten, falls die Lehrkraft sie
  // gerade beendet.
  useEffect(() => {
    if (!festgehalten && offen && angekuendigt) setFestgehalten(offen);
  }, [festgehalten, offen, angekuendigt]);

  // Beginnt eine Übung MITTEN in der Sitzung (Realtime), hat das Kind vorher
  // womöglich normal geübt - dann den Stand frisch lesen (gelernte Tasten,
  // wacklige Tasten), ohne Eigenes zu verlieren.
  const vorherDran = useRef<boolean | null>(null);
  useEffect(() => {
    vorherDran.current = null;
  }, [accountKey]);
  useEffect(() => {
    if (!geladen) return;
    const vorher = vorherDran.current;
    vorherDran.current = dran;
    if (vorher !== false || !dran) return;
    const konto = accountRef.current;
    // In die Kette der Schreibvorgänge - nie zwischen Lesen und Schreiben.
    kette.current = kette.current.then(() =>
      leseVollenFortschritt(konto)
        .then((p) => {
          if (lebt.current && accountRef.current?.id === konto?.id) setzeLokal(mitEigenem(p));
        })
        .catch(() => undefined),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geladen, dran]);

  // ★ E1 (24.09.2026): der Weg des Kindes (Konto vor Fortschritts-Kopie).
  const lernweg = lernwegAus(account, fortschritt);
  const introduced = useMemo(
    () => new Set(ensureIntroduced(fortschritt?.introduced, lernweg)),
    [fortschritt?.introduced, lernweg],
  );
  const wackeligeTasten = useMemo(
    // ★ D-5: Weg und Stufe des Kindes bestimmen die Schwelle.
    () => wackeligeTastenAus(fortschritt?.letters, [...introduced], { lernweg, stufe: stufeFuer(account) }),
    [fortschritt?.letters, introduced, lernweg, account],
  );

  // ── Der Text der aktuellen Übung ─────────────────────────────────────────
  const [geladenerText, setGeladenerText] = useState<{
    textId: string;
    text: EigenerTextGelesen | null;
  } | null>(null);
  const aktuelleTextId = aktuell?.textId ?? null;
  useEffect(() => {
    if (!aktuelleTextId) return;
    let aktiv = true;
    let nochmal: number | undefined;
    const lade = (zweiterVersuch: boolean) => {
      void typingBackend()
        .leseEigenenText(aktuelleTextId)
        .catch(() => null)
        .then((t) => {
          if (!aktiv) return;
          if (t && t.zeilen.length > 0) {
            setGeladenerText({ textId: aktuelleTextId, text: t });
          } else if (!zweiterVersuch) {
            nochmal = window.setTimeout(() => lade(true), TEXT_NOCHMAL_MS);
          } else {
            setUnlesbar((u) => new Set(u).add(aktuelleTextId));
            setFestgehalten((f) => (f?.textId === aktuelleTextId ? null : f));
          }
        });
    };
    lade(false);
    return () => {
      aktiv = false;
      if (nochmal !== undefined) window.clearTimeout(nochmal);
    };
  }, [aktuelleTextId]);
  // ★ Nie den Text der VORIGEN Übung unter der neuen zeigen.
  const text =
    geladenerText && geladenerText.textId === aktuelleTextId ? geladenerText.text : null;

  /** Den Stand eines Textes im Speicher fortschreiben (wächst nur). */
  const schreibeTextStand = (
    textId: string,
    stand: { zeile: number; fertig?: boolean; angekuendigt?: boolean },
    anschlaege: readonly KeyEvent[] = [],
  ) => {
    const voller = fortschrittRef.current ?? emptyProgress();
    setzeLokal({
      ...voller,
      letters: anschlaege.length > 0 ? mergeLetters(voller.letters, anschlaege) : voller.letters,
      customTextProgress: vereinigeTextStand(voller.customTextProgress, { [textId]: stand }),
    });
    if (anschlaege.length > 0) ausstehend.current = [...ausstehend.current, ...anschlaege];
  };

  return {
    zeiger: aktuell,
    dran,
    geladen,
    text,
    startZeile: meinStand?.zeile ?? 0,
    unlocked: introduced,
    shiftLearned: introduced.has(SHIFT_UNIT),
    wackeligeTasten,
    angekuendigt,
    bestaetigeAnkuendigung: () => {
      if (!aktuell) return;
      const alt = fortschrittRef.current?.customTextProgress?.[aktuell.textId];
      schreibeTextStand(aktuell.textId, { zeile: alt?.zeile ?? 0, angekuendigt: true });
      setFestgehalten((f) => f ?? aktuell);
      void sichere();
    },
    meldeFortschritt: ({ zeile, anschlaege, fertig }) => {
      if (!aktuell) return;
      const gesamt = text?.zeilen.length ?? 0;
      // Am Server gilt die Übung schon nach der letzten Zeile als fertig -
      // siehe Dateikopf („Fertig steht am Server schon nach der letzten Zeile").
      const amServerFertig = fertig === true || (gesamt > 0 && zeile >= gesamt);
      schreibeTextStand(
        aktuell.textId,
        { zeile, angekuendigt: true, ...(amServerFertig ? { fertig: true } : {}) },
        anschlaege,
      );
      const gespeichert = sichere();
      if (!fertig) {
        // Wer schreibt, ist mittendrin - auch wenn die Lehrkraft jetzt beendet.
        setFestgehalten((f) => f ?? aktuell);
        return;
      }
      // Die Abschluss-Karte ist geschlossen: erst freigeben, wenn „fertig" am
      // Server steht (höchstens FERTIG_WARTET_HOECHSTENS_MS).
      const textId = aktuell.textId;
      void Promise.race([
        gespeichert,
        new Promise<void>((r) => window.setTimeout(r, FERTIG_WARTET_HOECHSTENS_MS)),
      ]).then(() => {
        if (!lebt.current) return;
        setFestgehalten((f) => (f && f.textId !== textId ? f : null));
      });
      // Falls sie (noch) nicht festgehalten war, gilt „fertig" im Speicher schon.
    },
  };
}
