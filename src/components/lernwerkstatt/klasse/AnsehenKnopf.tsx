/**
 * „Ansehen" - das Vorschaufenster aus dem Teamraum für jeden Text in Tastenflow
 * (Johannes 08.11.2026: „genau diese Funktion für alle Dateien in Tastenflow -
 * wenn Lehrer ihre eigenen Dateien anschauen möchten, aber auch die schon
 * bestehenden Dateien, die man auswählen kann").
 *
 * Das Fenster selbst ist `useDateiVorschau` (Teamraum, 07.11.2026) und damit das
 * Fenster mit drei Größen, Esc schließt, der Fokus kehrt
 * zum Schalter zurück.
 *
 *  • Eine gerade HOCHGELADENE Datei zeigt es im Original - Word mit Formatierung.
 *  • „Meine Texte", Vorlagen und laufende Übungen bestehen nur aus Zeilen (die
 *    Datei selbst wird nirgends aufbewahrt) - sie erscheinen als Text, Zeile für Zeile.
 */
import { useState } from "react";
import { useDateiVorschau } from "@/components/dateien/useDateiVorschau";
import { Sym } from "@/components/gemeinsam/Symbole";
import { Tipp } from "@/components/Tipp";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

const T = texte({
  de: {
    ansehen: "Ansehen",
    fuer: (name: string) => `Ansehen: ${name}`,
    tipp: "Öffnet den Text in einem großen Fenster. Esc schließt es wieder.",
    fehler: "Der Text ließ sich nicht laden.",
  },
  en: {
    ansehen: "View",
    fuer: (name: string) => `View: ${name}`,
    tipp: "Opens the text in a large window. Esc closes it again.",
    fehler: "The text couldn't be loaded.",
  },
  fr: {
    ansehen: "Afficher",
    fuer: (name: string) => `Afficher : ${name}`,
    tipp: "Ouvre le texte dans une grande fenêtre. Échap la referme.",
    fehler: "Le texte n'a pas pu être chargé.",
  },
  es: {
    ansehen: "Ver",
    fuer: (name: string) => `Ver: ${name}`,
    tipp: "Abre el texto en una ventana grande. Esc la vuelve a cerrar.",
    fehler: "No se pudo cargar el texto.",
  },
  it: {
    ansehen: "Visualizza",
    fuer: (name: string) => `Visualizza: ${name}`,
    tipp: "Apre il testo in una finestra grande. Esc la richiude.",
    fehler: "Non è stato possibile caricare il testo.",
  },
  pl: {
    ansehen: "Podgląd",
    fuer: (name: string) => `Podgląd: ${name}`,
    tipp: "Otwiera tekst w dużym oknie. Esc je zamyka.",
    fehler: "Nie udało się wczytać tekstu.",
  },
  tr: {
    ansehen: "Görüntüle",
    fuer: (name: string) => `Görüntüle: ${name}`,
    tipp: "Metni büyük bir pencerede açar. Esc pencereyi kapatır.",
    fehler: "Metin yüklenemedi.",
  },
  cs: {
    ansehen: "Zobrazit",
    fuer: (name: string) => `Zobrazit: ${name}`,
    tipp: "Otevře text ve velkém okně. Esc ho zase zavře.",
    fehler: "Text se nepodařilo načíst.",
  },
  bg: {
    ansehen: "Преглед",
    fuer: (name: string) => `Преглед: ${name}`,
    tipp: "Отваря текста в голям прозорец. Esc го затваря.",
    fehler: "Текстът не можа да бъде зареден.",
  },
  el: {
    ansehen: "Προβολή",
    fuer: (name: string) => `Προβολή: ${name}`,
    tipp: "Ανοίγει το κείμενο σε μεγάλο παράθυρο. Το Esc το κλείνει.",
    fehler: "Δεν ήταν δυνατή η φόρτωση του κειμένου.",
  },
  hu: {
    ansehen: "Megtekintés",
    fuer: (name: string) => `Megtekintés: ${name}`,
    tipp: "Nagy ablakban nyitja meg a szöveget. Az Esc bezárja.",
    fehler: "A szöveget nem sikerült betölteni.",
  },
  nl: {
    ansehen: "Bekijken",
    fuer: (name: string) => `Bekijken: ${name}`,
    tipp: "Opent de tekst in een groot venster. Esc sluit het weer.",
    fehler: "De tekst kon niet worden geladen.",
  },
  pt: {
    ansehen: "Ver",
    fuer: (name: string) => `Ver: ${name}`,
    tipp: "Abre o texto numa janela grande. Esc fecha-a de novo.",
    fehler: "Não foi possível carregar o texto.",
  },
  br: {
    ansehen: "Ver",
    fuer: (name: string) => `Ver: ${name}`,
    tipp: "Abre o texto em uma janela grande. Esc fecha de novo.",
    fehler: "Não foi possível carregar o texto.",
  },
  ro: {
    ansehen: "Vizualizare",
    fuer: (name: string) => `Vizualizare: ${name}`,
    tipp: "Deschide textul într-o fereastră mare. Esc o închide.",
    fehler: "Textul nu a putut fi încărcat.",
  },
  sv: {
    ansehen: "Visa",
    fuer: (name: string) => `Visa: ${name}`,
    tipp: "Öppnar texten i ett stort fönster. Esc stänger det igen.",
    fehler: "Det gick inte att läsa in texten.",
  },
  uk: {
    ansehen: "Переглянути",
    fuer: (name: string) => `Переглянути: ${name}`,
    tipp: "Відкриває текст у великому вікні. Esc закриває його.",
    fehler: "Не вдалося завантажити текст.",
  },
});

/** Zeilen als Textdatei für das Fenster - der Name endet auf `.txt`, damit die Vorschau ihn als Text liest. */
export function zeilenAlsTextdatei(name: string, zeilen: readonly string[]): { name: string; blob: Blob } {
  const dateiName = /\.txt$/i.test(name) ? name : `${name.replace(/\.[a-z0-9]{1,5}$/i, "")}.txt`;
  return { name: dateiName, blob: new Blob([zeilen.join("\n")], { type: "text/plain;charset=utf-8" }) };
}

export function AnsehenKnopf({
  name,
  hole,
  ausrichtung,
}: {
  /** Name im Fenstertitel und in der Ansage des Schalters. */
  name: string;
  /** Liefert die Datei: das Original oder die Zeilen als Text. Darf werfen. */
  hole: () => Promise<{ name: string; blob: Blob }>;
  ausrichtung?: "links" | "rechts";
}) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const vorschau = useDateiVorschau();
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState(false);

  async function oeffnen() {
    if (laedt) return;
    setLaedt(true);
    setFehler(false);
    try {
      const d = await hole();
      await vorschau.zeige(d.name, async () => d.blob, d.blob.size);
    } catch {
      setFehler(true);
    } finally {
      setLaedt(false);
    }
  }

  return (
    <>
      <Tipp text={t.tipp} ausrichtung={ausrichtung}>
        {(hinweisId) => (
          <button
            type="button"
            className="btn-secondary inline-flex min-h-9 items-center gap-1"
            aria-label={t.fuer(name)}
            aria-describedby={hinweisId}
            aria-busy={laedt || undefined}
            onClick={() => void oeffnen()}
          >
            <Sym name="ansehen" size={16} />
            {t.ansehen}
          </button>
        )}
      </Tipp>
      {fehler && (
        <span role="alert" className="text-sm text-danger">
          {t.fehler}
        </span>
      )}
      {vorschau.fenster}
    </>
  );
}
