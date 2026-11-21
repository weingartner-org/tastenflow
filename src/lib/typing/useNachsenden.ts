/**
 * ★★★ Die Warteschlange im Gerät, an den Server angeschlossen (27.09.2026).
 *
 * `nachsenden.ts` hält fest, WAS wartet; diese Datei sagt, WIE es gesendet
 * wird und WANN:
 *  • beim Start / Anmelden des Kontos - auch Abgewiesenes, ohne Wartezeit,
 *  • beim Ereignis `online` (ebenso, gestreut),
 *  • im Takt alle {@link NACHSENDE_TAKT_MS}, solange etwas fällig ist,
 *  • nach jeder geübten Zeile - aber nur, was fällig ist (Wartezeit nach
 *    Fehlversuchen, nichts Abgewiesenes; Prüfbefund S3).
 * Beim Abmelden wird NICHT gesendet: Die Anmeldung wird sofort gelöscht
 * (geteilte Rechner); was wartet, kommt bei der nächsten Anmeldung DIESES
 * Kontos.
 *
 * Gestreut um bis zu {@link NACHSENDE_STREUUNG_MS}: Kommt in einer Klasse das
 * WLAN zurück, sollen nicht 30 Geräte in derselben Millisekunde senden
 * ([[feedback_seminarraum_ist_der_massstab]]).
 */
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { TaskEvent, TypingAccount } from "./account";
import { wirklichOffline } from "./pbBackend";
import { typingBackend } from "./backend";
import {
  beobachteNachsenden,
  istAusstehend,
  merkeVor,
  nachLaufendemDurchgang,
  sendeAusstehende,
  verbindungFehlt,
  wartetImTakt,
  type Absender,
  type NachsendeArt,
  type SendeAntwort,
  type SendeOptionen,
} from "./nachsenden";
import { ergebnisAusJson } from "./schreibprobeAuswertung";
import { meldeEreignisseGespeichert } from "./ereignisseGespeichert";

/** So oft wird im Takt nachgesendet, solange etwas fällig ist (ms). */
export const NACHSENDE_TAKT_MS = 30_000;

/** Über so viele ms wird das Nachsenden bei `online` gestreut. */
export const NACHSENDE_STREUUNG_MS = 2_000;


/** Aus einem gescheiterten Aufruf die Antwort der Schlange machen (S2). */
function antwortAusFehler(e: unknown): SendeAntwort {
  if (wirklichOffline(e)) return "netz";
  const st = (e as { status?: unknown })?.status;
  if (typeof st === "number" && st >= 400 && st < 500 && st !== 408 && st !== 429)
    return "abgewiesen";
  return "server";
}

/** Der Absender für EIN Konto - je Art der passende Weg zum Server. */
export function absenderFuer(account: TypingAccount): Absender {
  // ⚠️ `signal` geht an JEDE Anfrage - die Frist der Schlange bricht damit
  // wirklich ab (dritte Prüfung M1).
  return async (eintraege, signal) => {
    const erster = eintraege[0];
    if (!erster) return "ok";
    // ⚠️ Nie unter einem anderen Konto senden (Prüfbefund S1/K3).
    const jetzt = typingBackend().currentAccount();
    if (jetzt && jetzt.id !== account.id) return "abbruch";
    if (erster.art === "probe") {
      const ergebnis = ergebnisAusJson(erster.daten);
      if (!ergebnis) {
        // Nicht still: Ein Ergebnis, das sich nicht mehr lesen lässt, kann auch
        // kein Server annehmen - es bliebe sonst für immer in der Schlange.
        console.warn("[nachsenden] Tippchallenge-Ergebnis unlesbar - verworfen", erster);
        return "ok";
      }
      const a = await typingBackend().speichereProbenergebnis(account, ergebnis, signal);
      return a === "gespeichert" || a === "lag-schon" ? "ok" : a;
    }
    if (erster.art === "ereignis") {
      const ereignisse = eintraege.map((e) => e.daten as TaskEvent);
      let liste: TaskEvent[] | void;
      try {
        // ALLE wartenden Zeilen: eine Lesung, ein Schreiben (S3).
        liste = await typingBackend().recordEvents(account.id, ereignisse, signal);
      } catch (e) {
        return antwortAusFehler(e);
      }
      // Wochenziel-Kreise sofort nachziehen - ★ 28.09.2026 MIT der geschriebenen
      // Liste, damit sie nicht gleich noch einmal vom Server lesen.
      meldeEreignisseGespeichert(account.id, liste);
      return "ok";
    }
    return "ok";
  };
}

/** Alles Fällige dieses Kontos jetzt senden. */
export function nachsendenJetzt(
  account: TypingAccount,
  opt: SendeOptionen = {},
): Promise<void> {
  return sendeAusstehende(account.id, absenderFuer(account), opt);
}

/**
 * ★ Eine geübte Zeile vormerken und senden (27.09.2026). Ohne Gerätespeicher
 * der eine Versuch wie früher - nach einem laufenden Durchgang (K4).
 */
export function ereignisVormerken(account: TypingAccount, e: TaskEvent): void {
  if (merkeVor(account.id, "ereignis", `${e.ts}|${e.lesson}`, e)) {
    void nachsendenJetzt(account).catch(() => undefined);
    return;
  }
  void nachLaufendemDurchgang(account.id)
    .then(() => typingBackend().recordEvent(account.id, e))
    .then((liste) => meldeEreignisseGespeichert(account.id, liste))
    .catch(() => undefined);
}

/**
 * Der Haken, der das Nachsenden antreibt. Gehört EINMAL auf die Seite, auf der
 * ein Konto angemeldet ist.
 */
export function useNachsenden(account: TypingAccount | null | undefined): void {
  const id = account?.id ?? "";
  // Das jüngste Konto-Objekt (es wechselt bei jedem Auffrischen) - entscheidend
  // für den Effekt ist nur, WER angemeldet ist.
  const kontoRef = useRef(account);
  kontoRef.current = account;
  useEffect(() => {
    if (!id) return;
    let lebt = true;
    // Ein laufender Durchgang hört auf, sobald ein anderes Konto dran ist (K3).
    const abbrechen = () => !lebt || kontoRef.current?.id !== id;
    const senden = (opt: SendeOptionen) => {
      const konto = kontoRef.current;
      if (!lebt || !konto || konto.id !== id) return;
      void nachsendenJetzt(konto, { ...opt, abbrechen }).catch(() => undefined);
    };
    // Start / Anmelden: sofort, auch das früher Abgewiesene.
    senden({ auchAbgewiesene: true, sofort: true });

    let streuung: number | undefined;
    const online = () => {
      window.clearTimeout(streuung);
      streuung = window.setTimeout(
        () => senden({ auchAbgewiesene: true, sofort: true }),
        Math.floor(Math.random() * NACHSENDE_STREUUNG_MS),
      );
    };
    window.addEventListener("online", online);
    const takt = window.setInterval(() => {
      if (wartetImTakt(id)) senden({});
    }, NACHSENDE_TAKT_MS);
    return () => {
      lebt = false;
      window.removeEventListener("online", online);
      window.clearInterval(takt);
      window.clearTimeout(streuung);
    };
  }, [id]);
}

/**
 * Wartet dieser Eintrag noch im Gerät? - für eine ruhige Anzeige. Der
 * Schnappschuss ist das Ergebnis selbst (ein Wahrheitswert): Die Seite zeichnet
 * nur neu, wenn er sich ändert, nicht bei jeder geübten Zeile (K1).
 */
export function useAusstehend(
  accountId: string,
  art: NachsendeArt,
  schluessel: string | undefined,
): boolean {
  const lies = () => (!accountId || !schluessel ? false : istAusstehend(accountId, art, schluessel));
  return useSyncExternalStore(beobachteNachsenden, lies, lies);
}

/**
 * ★ Fehlt gerade WIRKLICH die Verbindung, und wartet etwas im Gerät? - für den
 * ruhigen Satz auf der Übungsseite (kein Live-Bereich, keine Ansage).
 */
export function useVerbindungFehlt(accountId: string): boolean {
  const lies = () => (accountId ? verbindungFehlt(accountId) : false);
  return useSyncExternalStore(beobachteNachsenden, lies, lies);
}
