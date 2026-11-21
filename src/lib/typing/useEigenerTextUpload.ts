/**
 * ★★★ DER GEMEINSAME UPLOAD-WEG für „Eigene Übung" UND die Tippchallenge mit
 * eigener Datei (17.09.2026).
 *
 * Beide Kästen (`EigeneUebungKasten.tsx`, `SchreibprobeKasten.tsx`) brauchen
 * WÖRTLICH dieselbe Kette: Datei wählen → Endung/Grösse prüfen → lesen
 * (`.txt`/`.docx`) → glätten, Zeichen-Bericht, umbrechen
 * (`eigenerText.verarbeiteEigenenText`). Zwei Kopien dieser Kette wären genau
 * die Fehlerklasse, an der dieses Repository schon mehrfach hängen geblieben
 * ist: Eine Reparatur (z. B. an der Dateigrössen-Grenze oder am Zeichen-
 * Bericht) träfe nur eine Stelle, die andere schriebe weiter mit der alten
 * Regel ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * Was NICHT hier passiert: das eigentliche „starten" (Text ablegen, Klasse
 * zuweisen bzw. Prüfung planen) - das unterscheidet sich zwischen den beiden
 * Kästen und bleibt dort.
 */
import { useState } from "react";
import { fileExtension } from "@/lib/filePreview";
import { extractDocxText } from "@/lib/filePreview";
import { dateiBytes } from "@/lib/lernwerkstatt/kinderImport";
import {
  dekodiereTextdatei,
  verarbeiteEigenenText,
  type EigenerTextVorschau,
} from "./eigenerText";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import type { Lernweg } from "./lernweg";

const ERLAUBTE_ENDUNGEN = new Set(["txt", "docx"]);

/**
 * ★ EN6b (19.09.2026): die Meldungen beim Hochladen in beiden
 * Bedienungssprachen - die Lehrkraft liest sie in „Eigene Übung" und in der
 * Tippchallenge mit eigener Datei. Deutsch wortgleich wie vorher.
 */
const UPLOAD_TEXTE = texte({
  de: {
    nurTxtDocx: "Nur .txt- und .docx-Dateien werden angenommen.",
    zuGross: "Die Datei ist grösser als 2 MB - das ist für einen Übungstext ungewöhnlich viel.",
    leer: "In dieser Datei steht kein Text.",
    nichtLesbar: "Die Datei konnte nicht gelesen werden.",
  },
  en: {
    nurTxtDocx: "Only .txt and .docx files can be used.",
    zuGross: "The file is larger than 2 MB - that is unusually large for a practice text.",
    leer: "There is no text in this file.",
    nichtLesbar: "The file couldn't be read.",
  },
  fr: {
    nurTxtDocx: "Seuls les fichiers .txt et .docx sont acceptés.",
    zuGross: "Le fichier dépasse 2 Mo - c'est inhabituellement volumineux pour un texte d'exercice.",
    leer: "Ce fichier ne contient aucun texte.",
    nichtLesbar: "Le fichier n'a pas pu être lu.",
  },
  es: {
    nurTxtDocx: "Solo se aceptan archivos .txt y .docx.",
    zuGross: "El archivo pasa de 2 MB - es un tamaño poco habitual para un texto de práctica.",
    leer: "Este archivo no contiene texto.",
    nichtLesbar: "No se pudo leer el archivo.",
  },
  it: {
    nurTxtDocx: "Si accettano solo file .txt e .docx.",
    zuGross: "Il file supera 2 MB - è molto per un testo di esercizio.",
    leer: "In questo file non c'è testo.",
    nichtLesbar: "Non è stato possibile leggere il file.",
  },
  // ★ O-PL (02.10.2026): die Lehrkraft liest es - unpersönlich (Glossar Regel 1).
  pl: {
    nurTxtDocx: "Przyjmowane są tylko pliki .txt i .docx.",
    zuGross: "Plik ma więcej niż 2 MB - to nietypowo dużo jak na tekst do ćwiczeń.",
    leer: "W tym pliku nie ma tekstu.",
    nichtLesbar: "Nie udało się odczytać pliku.",
  },
  // ★ O-TR (02.10.2026): die Lehrkraft liest es - ohne Anrede (Glossar Regel 1).
  tr: {
    nurTxtDocx: "Yalnızca .txt ve .docx dosyaları kabul edilir.",
    zuGross: "Dosya 2 MB boyutundan büyük - bir alıştırma metni için alışılmadık derecede fazla.",
    leer: "Bu dosyada metin yok.",
    nichtLesbar: "Dosya okunamadı.",
  },
  // ★ O-CS (03.10.2026): die Lehrkraft liest es - ohne Anrede, „se"-Sätze (Glossar Regel 1, 2).
  cs: {
    nurTxtDocx: "Lze použít jen soubory .txt a .docx.",
    zuGross: "Soubor je větší než 2 MB - na text k procvičování je to neobvykle mnoho.",
    leer: "V tomto souboru není žádný text.",
    nichtLesbar: "Soubor se nepodařilo přečíst.",
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    nurTxtDocx: "Могат да се използват само файлове .txt и .docx.",
    zuGross: "Файлът е по-голям от 2 MB - за текст за упражнение това е необичайно много.",
    leer: "В този файл няма текст.",
    nichtLesbar: "Файлът не можа да бъде прочетен.",
  },
  el: {
    nurTxtDocx: "Επιτρέπονται μόνο αρχεία .txt και .docx.",
    zuGross: "Το αρχείο είναι μεγαλύτερο από 2 MB - για κείμενο εξάσκησης είναι ασυνήθιστα μεγάλο.",
    leer: "Σε αυτό το αρχείο δεν υπάρχει κείμενο.",
    nichtLesbar: "Δεν ήταν δυνατή η ανάγνωση του αρχείου.",
  },
  hu: {
    nurTxtDocx: "Csak .txt és .docx fájl használható.",
    zuGross: "A fájl túl nagy (több mint 2 MB) - gyakorlószövegnek szokatlanul sok.",
    leer: "Ebben a fájlban nincs szöveg.",
    nichtLesbar: "A fájlt nem sikerült beolvasni.",
  },
  nl: {
    nurTxtDocx: "Alleen .txt- en .docx-bestanden kunnen worden gebruikt.",
    zuGross: "Het bestand is groter dan 2 MB - dat is ongebruikelijk veel voor een oefentekst.",
    leer: "In dit bestand staat geen tekst.",
    nichtLesbar: "Het bestand kon niet worden gelezen.",
  },
  pt: {
    nurTxtDocx: "Só podem ser usados ficheiros .txt e .docx.",
    zuGross: "O ficheiro tem mais de 2 MB - para um texto de prática, é invulgarmente grande.",
    leer: "Este ficheiro não tem texto.",
    nichtLesbar: "Não foi possível ler o ficheiro.",
  },
  br: {
    nurTxtDocx: "Só são aceitos arquivos .txt e .docx.",
    zuGross: "O arquivo tem mais de 2 MB - isso é muito grande para um texto de prática.",
    leer: "Não há texto neste arquivo.",
    nichtLesbar: "Não foi possível ler o arquivo.",
  },
  ro: {
    nurTxtDocx: "Se pot folosi doar fișiere .txt și .docx.",
    zuGross: "Fișierul are peste 2 MB - pentru un text de exersare este neobișnuit de mult.",
    leer: "În acest fișier nu există text.",
    nichtLesbar: "Fișierul nu a putut fi citit.",
  },
  sv: {
    nurTxtDocx: "Bara filer av typen .txt och .docx kan användas.",
    zuGross: "Filen är större än 2 MB - det är ovanligt mycket för en övningstext.",
    leer: "Det finns ingen text i den här filen.",
    nichtLesbar: "Det gick inte att läsa filen.",
  },
  uk: {
    nurTxtDocx: "Можна використовувати лише файли .txt і .docx.",
    zuGross: "Файл більший за 2 МБ - для тексту вправи це незвично багато.",
    leer: "У цьому файлі немає тексту.",
    nichtLesbar: "Не вдалося прочитати файл.",
  },
});
/** Grosszügig, aber nicht grenzenlos - ein Tipptext ist Fliesstext, kein Archiv. */
export const MAX_DATEIGROESSE = 2 * 1024 * 1024;

/**
 * ⚠️ NICHT `file.text()`/`file.arrayBuffer()` direkt - `dateiBytes` (schon
 * vorhanden für den Teilnehmer-Import) weicht auf `FileReader` aus, wo
 * `Blob.arrayBuffer` fehlt (ältere Browser UND der Test-Unterbau selbst,
 * gemessen 17.09.2026: „file.text is not a function" in jsdom).
 */
async function leseDatei(file: File): Promise<string> {
  const bytes = new Uint8Array(await dateiBytes(file));
  const ext = fileExtension(file.name);
  if (ext === "docx") return extractDocxText(bytes);
  // ★ Nicht blind UTF-8: Eine Windows-Datei („ANSI") verlor so alle Umlaute
  // (23.09.2026) - siehe `dekodiereTextdatei`.
  return dekodiereTextdatei(bytes);
}

export interface EigenerTextUploadStand {
  dateiname: string;
  vorschau: EigenerTextVorschau | null;
  ladeFehler: string;
  /**
   * Die hochgeladene Datei selbst (07.11./08.11.2026, Vorschaufenster wie im
   * Teamraum): Mit ihr zeigt „Ansehen" das Original - Word mit Formatierung.
   * `null` bei „Meine Texte" und „Vorlagen" (dort gibt es nur die Zeilen).
   */
  datei: File | null;
  /** Datei gewählt (oder `null`, z. B. Auswahl abgebrochen) - liest und verarbeitet sie. */
  waehleDatei: (file: File | null) => Promise<void>;
  /**
   * ★★★ E7/E8 (19.09.2026): Vorschau OHNE Datei setzen - für „Meine Texte"
   * und „Vorlagen". Beide bringen ihre Zeilen schon fertig mit (aus der
   * eigenen Ablage bzw. aus dem Korpus, siehe `vorlagen.ts`); es wäre falsch,
   * dafür eine zweite Kette neben {@link waehleDatei} nachzubauen, wenn schon
   * ab hier - Vorschau + Titel - alles WEITERE (Anzeige, „Eigene Übung
   * starten") ohnehin dieselbe Bahn nimmt
   * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
   */
  setzeVorschau: (titel: string, vorschau: EigenerTextVorschau) => void;
  /** Vorschau UND Fehler zurücksetzen - nach einem erfolgreichen Start. */
  zuruecksetzen: () => void;
}

/**
 * @param verbietenSs ß im Zeichen-Bericht melden? `true` für die
 * Tippchallenge (Fairness zwischen DE-/CH-Tastatur bei der Rangliste),
 * `false` für „Eigene Übung" (keine Rangliste, keine Fairness-Pflicht).
 * @param weg der Lernweg der Klasse (G2b-2): welche Zeichen auf einer Taste
 * liegen, hängt vom Weg ab (é auf Weg „fr", ñ und ¿ auf Weg „es"). Ohne Weg
 * gilt der Vorrat von de und en wie bisher.
 */
export function useEigenerTextUpload(verbietenSs: boolean, weg?: Lernweg): EigenerTextUploadStand {
  const t = UPLOAD_TEXTE[useBedienSprache().sprache];
  const [dateiname, setDateiname] = useState("");
  const [vorschau, setVorschau] = useState<EigenerTextVorschau | null>(null);
  const [ladeFehler, setLadeFehler] = useState("");
  const [datei, setDatei] = useState<File | null>(null);

  async function waehleDatei(file: File | null) {
    setVorschau(null);
    setLadeFehler("");
    setDatei(null);
    if (!file) return;
    const ext = fileExtension(file.name);
    if (!ERLAUBTE_ENDUNGEN.has(ext)) {
      setLadeFehler(t.nurTxtDocx);
      return;
    }
    if (file.size > MAX_DATEIGROESSE) {
      setLadeFehler(t.zuGross);
      return;
    }
    setDateiname(file.name);
    try {
      const rohtext = await leseDatei(file);
      const ergebnis = verarbeiteEigenenText(rohtext, { verbietenSs, weg });
      if (ergebnis.zeilen.length === 0) {
        setLadeFehler(t.leer);
        return;
      }
      setVorschau(ergebnis);
      setDatei(file);
    } catch {
      setLadeFehler(t.nichtLesbar);
    }
  }

  function setzeVorschau(titel: string, v: EigenerTextVorschau) {
    setLadeFehler("");
    setDateiname(titel);
    setVorschau(v);
    setDatei(null);
  }

  function zuruecksetzen() {
    setDateiname("");
    setVorschau(null);
    setLadeFehler("");
    setDatei(null);
  }

  return { dateiname, vorschau, ladeFehler, datei, waehleDatei, setzeVorschau, zuruecksetzen };
}
