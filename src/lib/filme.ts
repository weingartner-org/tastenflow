/**
 * ★ Die EINE Liste der Einführungsfilme (17.11.2026).
 *
 * Knopf (`FilmKnopf`) und Hilfe-Abschnitt (`FilmeListe`) lesen nur hierher.
 * Ein neuer Film: eine Zeile eintragen - Stellen ohne Eintrag zeigen keinen Knopf.
 *
 * Ausgeliefert liegen die Dateien unter `/filme/<datei>`:
 * `.mp4` (Film), `.vtt` (Untertitel), `-hoerfassung.mp3` (Nur anhören) und
 * `.txt` (Sprechtext). Dieser Ordner kommt über `bash pocketbase/deploy-medien.sh filme` auf den
 * Server, nicht über git.
 */
export type FilmApp = "tastenflow" | "lexami";

export type Film = {
  /** Eindeutige Nummer, z. B. „T-L02" (T = Tastenflow, X = Lexami; L = Lehrkraft, S = Lernende). */
  nr: string;
  app: FilmApp;
  titel: string;
  /** Länge in Sekunden (ungefähr). */
  dauerSek: number;
  /** Dateiname ohne Endung. */
  datei: string;
};

export const FILME: readonly Film[] = [
  { nr: "T-S00", app: "tastenflow", titel: "Der erste Start", dauerSek: 167, datei: "01-erster-start" },
  { nr: "T-L01", app: "tastenflow", titel: "Konto und erste Klasse", dauerSek: 138, datei: "02-klasse-anlegen" },
  { nr: "T-L02", app: "tastenflow", titel: "Kinder und Zugangsdaten", dauerSek: 68, datei: "t-l02-kinder-und-zugangsdaten" },
  { nr: "T-L03", app: "tastenflow", titel: "Viele Kinder per Excel", dauerSek: 61, datei: "t-l03-excel-import" },
  { nr: "T-L07", app: "tastenflow", titel: "Wochenziel", dauerSek: 68, datei: "t-l07-wochenziel" },
  { nr: "T-L08", app: "tastenflow", titel: "Einstellungen der Klasse", dauerSek: 71, datei: "t-l08-einstellungen-der-klasse" },
  { nr: "X-L01", app: "lexami", titel: "Lexami für die Klasse", dauerSek: 92, datei: "x-l01-lexami-fuer-die-klasse" },
  { nr: "X-L02", app: "lexami", titel: "Vokabelliste für die ganze Klasse hochladen", dauerSek: 89, datei: "x-l02-klassenliste-hochladen" },
  { nr: "X-L04", app: "lexami", titel: "Lernaufgabe", dauerSek: 77, datei: "x-l04-lernaufgabe" },
  { nr: "T-S01", app: "tastenflow", titel: "Die Übungsseite", dauerSek: 123, datei: "t-s01-die-uebungsseite" },
  { nr: "T-S02", app: "tastenflow", titel: "Meine Statistik", dauerSek: 69, datei: "t-s02-meine-statistik" },
  { nr: "T-L04", app: "tastenflow", titel: "Kind verschieben oder löschen", dauerSek: 81, datei: "t-l04-kind-verschieben" },
  { nr: "T-L05", app: "tastenflow", titel: "Zweite Lehrkraft", dauerSek: 69, datei: "t-l05-zweite-lehrkraft" },
  { nr: "T-L06", app: "tastenflow", titel: "Den Lernstand lesen", dauerSek: 74, datei: "t-l06-lernstand-lesen" },
  { nr: "T-L09", app: "tastenflow", titel: "Gezielt üben", dauerSek: 109, datei: "t-l09-gezielt-ueben" },
  { nr: "T-L10", app: "tastenflow", titel: "Eigene Übung", dauerSek: 88, datei: "t-l10-eigene-uebung" },
  { nr: "T-L11", app: "tastenflow", titel: "Tippchallenge", dauerSek: 115, datei: "t-l11-tippchallenge" },
  { nr: "T-L12", app: "tastenflow", titel: "Klassenmatch", dauerSek: 125, datei: "t-l12-klassenmatch" },
  { nr: "T-L13", app: "tastenflow", titel: "Stunde sperren", dauerSek: 48, datei: "t-l13-stunde-sperren" },
  { nr: "T-L14", app: "tastenflow", titel: "Downloads und Excel", dauerSek: 78, datei: "t-l14-downloads-und-excel" },
  { nr: "T-L15", app: "tastenflow", titel: "Hilfe und Tastenwege", dauerSek: 65, datei: "t-l15-hilfe-und-tastenwege" },
  { nr: "X-L03", app: "lexami", titel: "Listen pflegen", dauerSek: 108, datei: "x-l03-listen-pflegen" },
  { nr: "X-L05", app: "lexami", titel: "Vokabelprobe", dauerSek: 131, datei: "x-l05-vokabelprobe" },
  { nr: "X-L06", app: "lexami", titel: "Klassenüberblick", dauerSek: 111, datei: "x-l06-klassenueberblick" },
  { nr: "X-S01a", app: "lexami", titel: "Nachschlagen", dauerSek: 62, datei: "x-s01a-nachschlagen" },
  { nr: "X-S01b", app: "lexami", titel: "Lernen", dauerSek: 104, datei: "x-s01b-lernen" },
  { nr: "X-S02", app: "lexami", titel: "Meine Statistik", dauerSek: 53, datei: "x-s02-meine-statistik" },
];

export const FILME_ORDNER = "/filme/";

export function filmVon(nr: string): Film | undefined {
  return FILME.find((f) => f.nr === nr);
}

/** Für wen ein Film ist - steht in der Nummer: „-L" Lehrkräfte, „-S" Lernende. */
export type FilmFuer = "lehrkraft" | "lernende";

export function filmFuer(f: Film): FilmFuer {
  return /-L\d/.test(f.nr) ? "lehrkraft" : "lernende";
}

/**
 * Filme einer App, auf Wunsch nur für eine Zielgruppe.
 * ★ Die Hilfe der Übungsseite lesen auch Kinder - dort keine Lehrkraft-Filme.
 */
export function filmeDerApp(app: FilmApp, fuer?: FilmFuer): Film[] {
  return FILME.filter((f) => f.app === app && (!fuer || filmFuer(f) === fuer));
}

/** „1:06" - Minuten:Sekunden. */
export function dauerText(sek: number): string {
  const m = Math.floor(sek / 60);
  const s = Math.round(sek % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function filmDateien(f: Film) {
  const b = FILME_ORDNER + f.datei;
  return { mp4: `${b}.mp4`, vtt: `${b}.vtt`, hoer: `${b}-hoerfassung.mp3`, txt: `${b}.txt` };
}
