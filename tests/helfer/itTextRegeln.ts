/**
 * Die Regeln für JEDE italienische Textzeile (F5-it, 02.10.2026) - eine Funktion, die der Wächter
 * `tests/tastenflow-it-texte-regeln.test.ts` und jeder Wächter einer Text-Charge (T1-T9) gemeinsam benutzt.
 */
import { istKernGesperrtIt } from "../../src/lib/typing/sperrlisteIt";
import { MAX_ZAHL_IT, zahlwortIt } from "../../src/lib/typing/zahlwort";

/** Zeichen, die auf keiner der vier italienischen Tastaturen ohne Umweg liegen oder gegen die Hausregeln verstossen. */
const VERBOTENE_ZEICHEN = /[’‘“”«»–—…º°ª\u00A0áíóúäöüñçß]/u;

/** Wörter mit Akzent, bei denen „Buchstabe + Apostroph“ ein häufiger Fehler ist (Crusca: grafischer Fehler, `perche'` statt `perché`). */
const FALSCHER_AKZENT = /\b(perche|piu|cosi|citta|puo|gia|pero|cioe|caffe|universita|liberta|verita|societa|qualita|ventitre|trentatre)'(?!\p{L})/iu;

/** `un'` steht nur vor weiblichen Wörtern (un'amica), nie vor männlichen (*un'amico*). */
const UN_APOSTROPH_MAENNLICH = /\bun'(amico|uomo|albero|anno|aereo|ospedale|inverno|orso|elefante|ombrello|autobus|esame|errore|insegnante maschio)\b/i;

/**
 * Alle Verstösse einer Zeile gegen die Regeln des Weges „it" - leere Liste = in Ordnung.
 * (Jede Regel mit ihrer Quelle; die Meldung nennt sie, damit der Autor weiss, was er ändern soll.)
 */
export function zeilenFehler(zeile: string): string[] {
  const fehler: string[] = [];
  const m = VERBOTENE_ZEICHEN.exec(zeile);
  if (m) fehler.push(`Zeichen „${m[0]}“ (nur gerade Anführung/Apostroph, nur Bindestrich, keine º ª °, nichts, was auf keiner it-Tastatur liegt)`);
  if (/^\s*[-–—]\s/.test(zeile)) fehler.push("Dialogstrich am Anfang (I8: wörtliche Rede mit \"…\")");
  if (/\s[?!:;]/.test(zeile)) fehler.push("Leerzeichen vor ? ! : ; (im Italienischen kein Leerzeichen, GLOSSAR §1 Nr. 7)");
  if (/^[ÀÈÉÌÒÙ]/.test(zeile)) fehler.push("beginnt mit einem grossen Akzentbuchstaben - unter Windows nie tippbar (I4); anders anfangen („Ormai è tardi.“)");
  if (FALSCHER_AKZENT.test(zeile)) fehler.push("Buchstabe + Apostroph statt Akzent (perche' ⇒ perché; Crusca: grafischer Fehler)");
  if (/\b[Ee]'(?=\s)/.test(zeile)) fehler.push("„E'“ statt „È“ (I5)");
  if (/\bqual'è(?!\p{L})/iu.test(zeile)) fehler.push("„qual'è“ ist falsch - es heisst „qual è“ (Crusca)");
  if (UN_APOSTROPH_MAENNLICH.test(zeile)) fehler.push("„un'“ vor einem männlichen Wort (un'amico ⇒ un amico)");
  // Ein Apostroph steht zwischen zwei Buchstaben (l'amico, dell'acqua) - nur „po'“ (poco) darf am Wortende stehen.
  // ★ IT-RETO-VERDRAHTEN (03.10.2026): auch die Elision vor einer ZAHL ist richtig (l'8%, dell'1%, l'11 settembre) -
  // die Sfida „Tutti i tasti" schreibt sie, der Korpus hatte bis dahin keinen Fall. Erlaubt ist sie nur, wenn das
  // Zahlwort mit einem Vokal beginnt (l'8 = l'otto; *l'5 = l'cinque ist falsch); ein loser Apostroph bleibt ein Fehler.
  if (/(?<!\p{L})'|'(?![\p{L}\d])/u.test(zeile.replace(/\b(po)'/gi, "$1"))) fehler.push("Apostroph ohne Buchstaben auf beiden Seiten (Elision: l'amico, l'8%; Anführung: \"…\")");
  for (const m of zeile.matchAll(/\p{L}'(\d+)/gu)) {
    const n = Number(m[1]);
    const wort = n <= MAX_ZAHL_IT ? zahlwortIt(n) : "";
    if (!/^[aeiouàèéìòù]/.test(wort)) fehler.push(`Elision vor ${m[1]} - das Zahlwort („${wort || "?"}“) beginnt nicht mit einem Vokal (l'8%, dell'1%; nicht *l'5)`);
  }
  for (const wort of zeile.split(/[\s,.;:!?"()]+/)) {
    if (wort && istKernGesperrtIt(wort)) fehler.push(`Sperrwort „${wort}“ (sperrlisteIt.ts)`);
  }
  if (/\s{2,}/.test(zeile) || zeile !== zeile.trim()) fehler.push("doppelte oder umgebende Leerzeichen");
  return fehler;
}
