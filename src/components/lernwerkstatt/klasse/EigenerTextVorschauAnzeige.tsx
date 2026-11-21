/**
 * Die Vorschau einer hochgeladenen Datei - geteilt zwischen „Eigene Übung"
 * und der Tippchallenge mit eigener Datei (17.09.2026), damit beide dieselbe
 * Auskunft in denselben Worten geben (siehe `useEigenerTextUpload.ts`).
 *
 * ★ EN6b (19.09.2026): in beiden Bedienungssprachen; Deutsch Textknoten für
 * Textknoten wie vorher. Die Zeichen und die erste Zeile sind INHALT - sie
 * stehen, wie die Datei sie bringt (die erste Zeile in der Sprache des Textes).
 */
import type { Lang } from "@/lib/typing/account";
import type { EigenerTextVorschau } from "@/lib/typing/eigenerText";
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";
import type { Teil } from "@/lib/bedienSprache/texte";
import { AnsehenKnopf, zeilenAlsTextdatei } from "./AnsehenKnopf";

// Null nie über mehrzahl (Glossar Regel 13: pt-BR zählt 0 als one).
function linhasBr(n: number): string {
  if (n === 0) return "nenhuma linha";
  return mehrzahl(n, "br", {
    one: (z) => `${z} linha`,
    other: (z) => `${z} linhas`,
  });
}

function caracteresBr(n: number): string {
  if (n === 0) return "nenhum caractere";
  return mehrzahl(n, "br", {
    one: (z) => `${z} caractere`,
    other: (z) => `${z} caracteres`,
  });
}

const T = texte({
  de: {
    zitat: (name: string): readonly Teil[] => ["„", name, '"'],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      " - ",
      zeilen,
      " ",
      zeilen === 1 ? "Zeile" : "Zeilen",
      ", ",
      zeichen,
      " Zeichen.",
    ],
    zeichenZitat: (z: string) => `„${z}"`,
    angepasst: "Automatisch angepasst: ",
    entfernt: "Diese Zeichen liegen auf keiner Taste und werden beim Start aus dem Text entfernt:",
    ersteZeile: "Erste Zeile: ",
  },
  en: {
    zitat: (name: string): readonly Teil[] => ["“", name, "”"],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "en", { one: (z) => `${z} line`, other: (z) => `${z} lines` })}, ${mehrzahl(
        zeichen,
        "en",
        { one: (z) => `${z} character`, other: (z) => `${z} characters` },
      )}.`,
    ],
    zeichenZitat: (z: string) => `“${z}”`,
    angepasst: "Adjusted automatically: ",
    entfernt: "These characters aren't on any key and will be removed from the text when it starts:",
    ersteZeile: "First line: ",
  },
  fr: {
    zitat: (name: string): readonly Teil[] => ['"', name, '"'],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "fr", { one: (z) => `${z} ligne`, other: (z) => `${z} lignes` })}, ${mehrzahl(
        zeichen,
        "fr",
        { one: (z) => `${z} caractère`, other: (z) => `${z} caractères` },
      )}.`,
    ],
    zeichenZitat: (z: string) => `"${z}"`,
    angepasst: "Adapté automatiquement : ",
    entfernt: "Ces caractères ne se trouvent sur aucune touche et seront retirés du texte au démarrage :",
    ersteZeile: "Première ligne : ",
  },
  es: {
    zitat: (name: string): readonly Teil[] => ['"', name, '"'],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "es", { one: (z) => `${z} línea`, other: (z) => `${z} líneas` })}, ${mehrzahl(
        zeichen,
        "es",
        { one: (z) => `${z} carácter`, other: (z) => `${z} caracteres` },
      )}.`,
    ],
    zeichenZitat: (z: string) => `"${z}"`,
    angepasst: "Adaptado automáticamente: ",
    entfernt: "Estos caracteres no están en ninguna tecla y se quitarán del texto al iniciarlo:",
    ersteZeile: "Primera línea: ",
  },
  it: {
    zitat: (name: string): readonly Teil[] => ['"', name, '"'],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "it", { one: (z) => `${z} riga`, other: (z) => `${z} righe` })}, ${mehrzahl(
        zeichen,
        "it",
        { one: (z) => `${z} carattere`, other: (z) => `${z} caratteri` },
      )}.`,
    ],
    zeichenZitat: (z: string) => `"${z}"`,
    angepasst: "Adattato automaticamente: ",
    entfernt: "Questi caratteri non sono su nessun tasto e vengono tolti dal testo all'avvio:",
    ersteZeile: "Prima riga: ",
  },
  // ★ O-PL (02.10.2026): vier Mehrzahlformen (Glossar §2.10a: wiersz, znak),
  // polnische Anführungszeichen (Regel 8).
  pl: {
    zitat: (name: string): readonly Teil[] => ["„", name, "”"],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "pl", {
        one: (z) => `${z} wiersz`,
        few: (z) => `${z} wiersze`,
        many: (z) => `${z} wierszy`,
        other: (z) => `${z} wiersza`,
      })}, ${mehrzahl(zeichen, "pl", {
        one: (z) => `${z} znak`,
        few: (z) => `${z} znaki`,
        many: (z) => `${z} znaków`,
        other: (z) => `${z} znaku`,
      })}.`,
    ],
    zeichenZitat: (z: string) => `„${z}”`,
    angepasst: "Dopasowano automatycznie: ",
    entfernt: "Tych znaków nie ma na żadnym klawiszu - przy starcie zostaną usunięte z tekstu:",
    ersteZeile: "Pierwszy wiersz: ",
  },
  // ★ O-TR (02.10.2026): nach einer Zahl Einzahl (Glossar Regel 5: "3 satır",
  // "120 karakter"), gerade Anführungszeichen (Regel 7).
  tr: {
    zitat: (name: string): readonly Teil[] => ['"', name, '"'],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "tr", { one: (z) => `${z} satır`, other: (z) => `${z} satır` })}, ${mehrzahl(
        zeichen,
        "tr",
        { one: (z) => `${z} karakter`, other: (z) => `${z} karakter` },
      )}.`,
    ],
    zeichenZitat: (z: string) => `"${z}"`,
    angepasst: "Otomatik olarak düzeltildi: ",
    entfernt: "Bu karakterler hiçbir tuşta yok, başlatılınca metinden çıkarılır:",
    ersteZeile: "İlk satır: ",
  },
  // ★ O-CS (03.10.2026): vier Mehrzahlformen (Glossar §2.11: řádek, znak - die
  // Einheit steht hinter der Zahl, kein Satzende auf einer Ziffer), tschechische
  // Anführungszeichen (Regel 7).
  cs: {
    zitat: (name: string): readonly Teil[] => ["„", name, "“"],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "cs", {
        one: (z) => `${z} řádek`,
        few: (z) => `${z} řádky`,
        many: (z) => `${z} řádku`,
        other: (z) => `${z} řádků`,
      })}, ${mehrzahl(zeichen, "cs", {
        one: (z) => `${z} znak`,
        few: (z) => `${z} znaky`,
        many: (z) => `${z} znaku`,
        other: (z) => `${z} znaků`,
      })}.`,
    ],
    zeichenZitat: (z: string) => `„${z}“`,
    angepasst: "Automaticky upraveno: ",
    entfernt: "Tyto znaky nejsou na žádné klávese - při spuštění se z textu odstraní:",
    ersteZeile: "První řádek: ",
  },
  bg: {
    zitat: (name: string): readonly Teil[] => ["„", name, "“"],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "bg", {
        one: (z) => `${z} ред`,
        other: (z) => `${z} реда`,
      })}, ${mehrzahl(zeichen, "bg", {
        one: (z) => `${z} знак`,
        other: (z) => `${z} знака`,
      })}.`,
    ],
    zeichenZitat: (z: string) => `„${z}“`,
    angepasst: "Променено автоматично: ",
    entfernt: "Тези знаци не са на нито един клавиш - при започване ще бъдат премахнати от текста:",
    ersteZeile: "Първи ред: ",
  },
  el: {
    zitat: (name: string): readonly Teil[] => ["«", name, "»"],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "el", {
        one: (z) => `${z} γραμμή`,
        other: (z) => `${z} γραμμές`,
      })}, ${mehrzahl(zeichen, "el", {
        one: (z) => `${z} χαρακτήρας`,
        other: (z) => `${z} χαρακτήρες`,
      })}.`,
    ],
    zeichenZitat: (z: string) => `«${z}»`,
    angepasst: "Προσαρμόστηκε αυτόματα: ",
    entfernt: "Αυτοί οι χαρακτήρες δεν βρίσκονται σε κανένα πλήκτρο - κατά την έναρξη αφαιρούνται από το κείμενο:",
    ersteZeile: "Πρώτη γραμμή: ",
  },
  hu: {
    zitat: (name: string): readonly Teil[] => ["„", name, "”"],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "hu", {
        one: (z) => `${z} sor`,
        other: (z) => `${z} sor`,
      })}, ${mehrzahl(zeichen, "hu", {
        one: (z) => `${z} karakter`,
        other: (z) => `${z} karakter`,
      })}.`,
    ],
    zeichenZitat: (z: string) => `„${z}”`,
    angepasst: "Automatikusan módosítva: ",
    entfernt: "Ezek a karakterek egyik billentyűn sincsenek rajta - indításkor kikerülnek a szövegből:",
    ersteZeile: "Első sor: ",
  },
  nl: {
    zitat: (name: string): readonly Teil[] => ["\"", name, "\""],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "nl", { one: (z) => `${z} regel`, other: (z) => `${z} regels` })}, ${mehrzahl(
        zeichen,
        "nl",
        { one: (z) => `${z} teken`, other: (z) => `${z} tekens` },
      )}.`,
    ],
    zeichenZitat: (z: string) => `"${z}"`,
    angepasst: "Automatisch aangepast: ",
    entfernt: "Deze tekens staan op geen enkele toets en worden bij het starten uit de tekst verwijderd:",
    ersteZeile: "Eerste regel: ",
  },
  pt: {
    zitat: (name: string): readonly Teil[] => ["\"", name, "\""],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "pt", {
        one: (z) => `${z} linha`,
        other: (z) => `${z} linhas`,
        many: (z) => `${z} de linhas`,
      })}, ${mehrzahl(zeichen, "pt", {
        one: (z) => `${z} caráter`,
        other: (z) => `${z} carateres`,
        many: (z) => `${z} de carateres`,
      })}.`,
    ],
    zeichenZitat: (z: string) => `"${z}"`,
    angepasst: "Ajustado automaticamente: ",
    entfernt: "Estes carateres não estão em nenhuma tecla e são removidos do texto ao começar:",
    ersteZeile: "Primeira linha: ",
  },
  br: {
    zitat: (name: string): readonly Teil[] => ['"', name, '"'],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${linhasBr(zeilen)}, ${caracteresBr(zeichen)}.`,
    ],
    zeichenZitat: (z: string) => `"${z}"`,
    angepasst: "Ajustado automaticamente: ",
    entfernt: "Estes caracteres não estão em nenhuma tecla - ao começar, serão removidos do texto:",
    ersteZeile: "Primeira linha: ",
  },
  ro: {
    zitat: (name: string): readonly Teil[] => ["„", name, "”"],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "ro", {
        one: (z) => `${z} rând`,
        few: (z) => `${z} rânduri`,
        other: (z) => `${z} de rânduri`,
      })}, ${mehrzahl(zeichen, "ro", {
        one: (z) => `${z} caracter`,
        few: (z) => `${z} caractere`,
        other: (z) => `${z} de caractere`,
      })}.`,
    ],
    zeichenZitat: (z: string) => `„${z}”`,
    angepasst: "Ajustat automat: ",
    entfernt: "Aceste caractere nu se află pe nicio tastă - la pornire sunt eliminate din text:",
    ersteZeile: "Primul rând: ",
  },
  sv: {
    zitat: (name: string): readonly Teil[] => ["\"", name, "\""],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "sv", {
        one: (z) => `${z} rad`,
        other: (z) => `${z} rader`,
      })}, ${mehrzahl(zeichen, "sv", {
        one: (z) => `${z} tecken`,
        other: (z) => `${z} tecken`,
      })}.`,
    ],
    zeichenZitat: (z: string) => `"${z}"`,
    angepasst: "Automatiskt anpassat: ",
    entfernt: "De här tecknen finns inte på någon tangent och tas bort ur texten när övningen börjar:",
    ersteZeile: "Första raden: ",
  },
  uk: {
    zitat: (name: string): readonly Teil[] => ["«", name, "»"],
    umfang: (zeilen: number, zeichen: number): readonly Teil[] => [
      ` - ${mehrzahl(zeilen, "uk", {
        one: (z) => `${z} рядок`,
        few: (z) => `${z} рядки`,
        many: (z) => `${z} рядків`,
        other: (z) => `${z} рядка`,
      })}, ${mehrzahl(zeichen, "uk", {
        one: (z) => `${z} знак`,
        few: (z) => `${z} знаки`,
        many: (z) => `${z} знаків`,
        other: (z) => `${z} знака`,
      })}.`,
    ],
    zeichenZitat: (z: string) => `«${z}»`,
    angepasst: "Автоматично змінено: ",
    entfernt: "Цих знаків немає на жодній клавіші - на початку їх буде прибрано з тексту:",
    ersteZeile: "Перший рядок: ",
  },
});

export function EigenerTextVorschauAnzeige({
  dateiname,
  vorschau,
  textLang,
  datei,
}: {
  dateiname: string;
  vorschau: EigenerTextVorschau;
  /**
   * Die gerade hochgeladene Datei (08.11.2026): Mit ihr zeigt „Ansehen" das
   * Original, ohne sie (Meine Texte, Vorlagen) die Zeilen als Text.
   */
  datei?: File | null;
  /**
   * ★ EN10 (19.09.2026): die Sprache des TEXTES - die Übungssprache der
   * Klasse, in der er geübt wird. Die erste Zeile ist Inhalt: In der
   * englischen Bedienung las eine englische Stimme „Warum geht der Hase zur
   * Schule?" (Vorlage „Witze", im Browser gefunden). Gesetzt wird `lang` nur
   * in der englischen Bedienung - die deutsche bleibt Zeichen für Zeichen.
   */
  textLang?: Lang;
}) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  return (
    <div className="space-y-2 rounded-lg border border-hairline p-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="m-0 flex-auto text-sm text-ink">
          <strong>{t.zitat(dateiname)}</strong>
          {t.umfang(vorschau.zeilen.length, vorschau.zeichenGesamt)}
        </p>
        <AnsehenKnopf
          name={datei?.name ?? dateiname}
          ausrichtung="rechts"
          hole={async () => (datei ? { name: datei.name, blob: datei } : zeilenAlsTextdatei(dateiname, vorschau.zeilen))}
        />
      </div>
      {vorschau.ersetzt.length > 0 && (
        <p className="text-sm text-ink-muted">
          {t.angepasst}
          {vorschau.ersetzt.map((z) => t.zeichenZitat(z)).join(", ")}.
        </p>
      )}
      {vorschau.unbekannt.length > 0 && (
        <p role="alert" className="text-sm text-warning-ink">
          {t.entfernt}{" "}
          {vorschau.unbekannt.map((z) => t.zeichenZitat(z)).join(", ")}.
        </p>
      )}
      <p className="text-sm text-ink-muted">
        {t.ersteZeile}
        {/* ★ E11a-5: auch in der französischen Bedienung trägt ein Text in
            einer anderen Sprache sein eigenes `lang` (bis dahin nur „en"). */}
        <em lang={sprache !== "de" && textLang && textLang !== sprache ? textLang : undefined}>
          {vorschau.zeilen[0]}
        </em>
      </p>
    </div>
  );
}
