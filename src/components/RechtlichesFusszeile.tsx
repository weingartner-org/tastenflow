import { useEffect, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { unterstuetzenFreigegeben } from "@/lib/unterstuetzen";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import type { BedienSprache } from "@/lib/bedienSprache/sprache";

/*
 * ★ EN8 (19.09.2026): Die Verweise folgen der Bedienungssprache von
 * Tastenflow - denn seit EN8 gibt es die Rechtstexte dahinter auch englisch.
 * Ohne aktiven Sprach-Anbieter (alle anderen Apps) und in deutscher
 * Bedienung bleibt die Fußzeile Zeichen für Zeichen, wie sie war.
 * Namen nach Glossar §3.13: Impressum = „Legal notice" (nie „Imprint"),
 * Datenschutz = „Privacy", Erklärung zur Barrierefreiheit = „Accessibility".
 */
/**
 * ★ E11a-2 (26.09.2026, Weichen-Zähler §2.3): Tabelle statt Ternäre - Deutsch
 * bekommt bewusst KEIN Attribut (das DOM bleibt, wie es vor EN8 war, siehe
 * Kommentar am `<footer>` unten).
 */
const LANG_ATTRIBUT: Record<BedienSprache, string | undefined> = {
  de: undefined,
  en: "en",
  fr: "fr",
  // ★ ES-O (27.09.2026): `T` hat jetzt eine spanische Fassung - das Attribut
  // passt wieder zum angezeigten Text (bis dahin stand hier „en").
  es: "es",
  // ★ O-IT (02.10.2026): `T` hat eine italienische Fassung.
  it: "it",
  // ★ O-PL (02.10.2026): `T` hat eine polnische Fassung.
  pl: "pl",
  // ★ O-TR (02.10.2026): `T` hat eine türkische Fassung.
  tr: "tr",
  // ★ O-CS (03.10.2026): `T` hat eine tschechische Fassung.
  cs: "cs",
  bg: "bg",
  el: "el",
  hu: "hu",
  nl: "nl",
  pt: "pt-PT",
  br: "pt-BR",
  ro: "ro",
  sv: "sv",
  uk: "uk",
};

const T = texte({
  de: {
    landmarke: "Rechtliches",
    datenschutz: "Datenschutz",
    impressum: "Impressum",
    barrierefreiheit: "Barrierefreiheit",
    unterstuetzen: "Unterstützen",
  },
  en: {
    landmarke: "Legal",
    datenschutz: "Privacy",
    impressum: "Legal notice",
    barrierefreiheit: "Accessibility",
    unterstuetzen: "Support us",
  },
  fr: {
    landmarke: "Informations légales",
    datenschutz: "Confidentialité",
    impressum: "Mentions légales",
    barrierefreiheit: "Accessibilité",
    unterstuetzen: "Soutenir",
  },
  // ★ ES-O (27.09.2026): Glossar Bauplan §7 (Aviso legal, Política de privacidad).
  es: {
    landmarke: "Información legal",
    datenschutz: "Política de privacidad",
    impressum: "Aviso legal",
    barrierefreiheit: "Accesibilidad",
    unterstuetzen: "Apoyar",
  },
  // ★ O-IT (02.10.2026): Glossar Italienisch §2.7.
  it: {
    landmarke: "Informazioni legali",
    datenschutz: "Privacy",
    impressum: "Note legali",
    barrierefreiheit: "Accessibilità",
    unterstuetzen: "Sostieni il progetto",
  },
  // ★ O-PL (02.10.2026): Glossar Polnisch §2.7.
  pl: {
    landmarke: "Kwestie prawne",
    datenschutz: "Polityka prywatności",
    impressum: "Informacja prawna",
    barrierefreiheit: "Dostępność",
    unterstuetzen: "Wesprzyj projekt",
  },
  // ★ O-TR (02.10.2026): Glossar Türkisch §2.7 (Künye, Gizlilik, Erişilebilirlik, Projeyi destekle).
  tr: {
    landmarke: "Yasal bilgiler",
    datenschutz: "Gizlilik",
    impressum: "Künye",
    barrierefreiheit: "Erişilebilirlik",
    unterstuetzen: "Projeyi destekle",
  },
  // ★ O-CS (03.10.2026): Glossar Tschechisch §2.7 (Právní informace, Osobní údaje, Provozovatel, Přístupnost, Podpořit projekt).
  cs: {
    landmarke: "Právní informace",
    datenschutz: "Osobní údaje",
    impressum: "Provozovatel",
    barrierefreiheit: "Přístupnost",
    unterstuetzen: "Podpořit projekt",
  },
  bg: {
    landmarke: "Правна информация",
    datenschutz: "Лични данни",
    impressum: "Издател на сайта",
    barrierefreiheit: "Достъпност",
    unterstuetzen: "Подкрепи проекта",
  },
  el: {
    landmarke: "Νομικές πληροφορίες",
    datenschutz: "Προσωπικά δεδομένα",
    impressum: "Στοιχεία παρόχου",
    barrierefreiheit: "Προσβασιμότητα",
    unterstuetzen: "Στήριξη του έργου",
  },
  hu: {
    landmarke: "Jogi információk",
    datenschutz: "Adatvédelem",
    impressum: "Impresszum",
    barrierefreiheit: "Akadálymentesség",
    unterstuetzen: "A projekt támogatása",
  },
  nl: {
    landmarke: "Juridische informatie",
    datenschutz: "Privacy",
    impressum: "Colofon",
    barrierefreiheit: "Toegankelijkheid",
    unterstuetzen: "Steun het project",
  },
  pt: {
    landmarke: "Informações legais",
    datenschutz: "Privacidade",
    impressum: "Aviso legal",
    barrierefreiheit: "Acessibilidade",
    unterstuetzen: "Apoiar o projeto",
  },
  br: {
    landmarke: "Informações legais",
    datenschutz: "Privacidade",
    impressum: "Responsável pelo site",
    barrierefreiheit: "Acessibilidade",
    unterstuetzen: "Apoiar o projeto",
  },
  ro: {
    landmarke: "Informații legale",
    datenschutz: "Confidențialitate",
    impressum: "Date de identificare",
    barrierefreiheit: "Accesibilitate",
    unterstuetzen: "Susțineți proiectul",
  },
  sv: {
    landmarke: "Juridisk information",
    datenschutz: "Personuppgifter",
    impressum: "Kontaktuppgifter",
    barrierefreiheit: "Tillgänglighet",
    unterstuetzen: "Stöd projektet",
  },
  uk: {
    landmarke: "Правова інформація",
    datenschutz: "Захист даних",
    impressum: "Власник сайту",
    barrierefreiheit: "Доступність",
    unterstuetzen: "Підтримати проєкт",
  },
});

/*
 * ★★★ DIE FUSSZEILE RUHT, SOLANGE GEARBEITET WIRD (Johannes, 25.09.2026).
 *
 * Anlass, aus dem Unterricht: Kinder mit Blindheit standen „plötzlich im
 * Impressum". Mit Tab wandert der Fokus aus einer kurzen Übungsseite nach zwei,
 * drei Schritten in diese Fußzeile, und im Lesemodus von NVDA landet der
 * Lesecursor nach einem Tastendruck am Seitenende - die nächste Eingabe öffnet
 * dann das Impressum. Johannes: „eine unsichtbare 2. Ebene … wer im Arbeiten in
 * der App ist, springt mit Tab nicht in die Fußzeile, nur wer im Hauptmenü ist
 * … bleibt aber immer sichtbar".
 *
 * Darum: Ein Arbeitsbildschirm meldet sich mit `useFusszeileRuht(true)`. Solange
 * EINER das tut, bleibt die Fußzeile sichtbar und mit der Maus anklickbar, ist
 * aber kein Tab-Halt (`tabIndex={-1}`) und für Screenreader ausgeblendet
 * (`aria-hidden`) - auch der Lesemodus kann dort nicht mehr landen. Im
 * Hauptmenü meldet sich niemand, und die Fußzeile ist wie immer erreichbar.
 *
 * ⚠️ Nur wer den Haken selbst setzt, bekommt das Verhalten. Die Seiten, die ihn
 * nicht benutzen, bleiben Zeichen für Zeichen, wie sie waren.
 */
let ruhendeBildschirme = 0;
const zuhoerer = new Set<() => void>();
function melde() {
  for (const z of zuhoerer) z();
}
function abonnieren(z: () => void) {
  zuhoerer.add(z);
  return () => {
    zuhoerer.delete(z);
  };
}
function ruhtJetzt() {
  return ruhendeBildschirme > 0;
}

/**
 * Ein Arbeitsbildschirm (Übung, Aufgabe, Blatt) ruft das auf. Die Fußzeile
 * ruht, solange er steht und `aktiv` gilt.
 */
export function useFusszeileRuht(aktiv: boolean): void {
  useEffect(() => {
    if (!aktiv) return;
    ruhendeBildschirme += 1;
    melde();
    return () => {
      ruhendeBildschirme -= 1;
      melde();
    };
  }, [aktiv]);
}

/**
 * FUSSZEILE „Rechtliches" - Pflicht auf jeder Seite, und sonst nichts.
 * ======================================================================
 * Impressum und Datenschutzerklärung müssen von JEDER Seite aus unmittelbar
 * erreichbar sein (§ 25 MedienG, § 5 ECG, Art. 13 DSGVO). Auf der Plattform
 * unter weingartner.org erledigt das die Fußzeile in `Layout.tsx` - aber nur
 * für die Seiten INNERHALB des Layouts. Die Lernprogramme und der
 * Lehrkraft-Bereich „Meine Klassen" hängen als eigene Routen daneben und
 * hatten deshalb keinen Weg dorthin (gemessen 02.09.2026: auf der ganzen
 * Plattform gab es genau zwei Fußzeilen).
 *
 * Sie steht GANZ UNTEN, hinter allem Inhalt: eine Zeile, kleine Schrift, kein
 * Rahmen, keine Farbe, kein eigener Kasten. Vom Arbeiten zieht sie damit
 * nichts weg. Sie ist normaler Tab-Weg-Inhalt (kein `aria-hidden`) und wird
 * beim Durchgehen zuletzt erreicht - genau dort gehört Rechtliches hin.
 * `aria-label` gibt der Landmarke einen Namen, damit sie in der Regionen-Liste
 * eines Screenreaders nicht bloß „Fußzeile" heißt.
 *
 * ⚠️ Die beiden Verweise bleiben RELATIV. Dieselbe Anwendung beantwortet sie
 * unter beiden Adressen (weingartner.org und tastenflow.org); ein absoluter
 * Verweis würde den Rechnernamen wechseln - und mit ihm die Sitzung
 * (www-Falle, siehe `src/lib/adressen.ts`).
 *
 * ★ Reihenfolge „Datenschutz · Impressum": Acht der neun Stellen, die es am
 * 02.09.2026 gab, schrieben es so - nur die Tastenflow-Fußzeile andersherum.
 * Eine Fußzeile, die überall gleich aussteht, ist leichter wiederzufinden als
 * eine, deren Reihenfolge von der Seite abhängt.
 *
 * ★ EIN Baustein, nicht je Seite einer. Bis zum 02.09.2026 stand dieselbe
 * Fußzeile als Abschrift in `TippenTrainerPage`. Zwei Stellen, die dieselbe
 * Frage getrennt beantworten, laufen auseinander - in diesem Projekt
 * mehrfach belegt ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export function RechtlichesFusszeile({
  className = "mt-10 text-center text-xs text-ink-muted",
  unterstuetzenApp,
  barrierefreiheit = false,
}: {
  /** Nur der Abstand nach oben ändert sich je Seite; der Rest bleibt gleich. */
  className?: string;
  /**
   * ★★★ Hängt „Unterstützen" als DRITTEN Verweis an - aber nur, wenn diese App
   * dafür freigegeben ist (`src/lib/unterstuetzen.ts`).
   *
   * ⚠️ **Ohne diese Angabe ändert sich nichts.** Das ist die ganze Sicherung:
   * Von den 24 Seiten, die diese Fußzeile einbinden, geben genau die etwas mit,
   * die den Verweis haben sollen - `MathecoachPage` (dreimal eingebunden) und
   * alle anderen bleiben Zeichen für Zeichen wie vorher. Eine Verbotsliste
   * („überall ausser Mathecoach") wäre am Tag ihrer Entstehung richtig und beim
   * nächsten Zuwachs still falsch.
   *
   * ★ Warum hier überhaupt ein dritter Verweis steht, obwohl Johannes am
   * 23.08.2026 „KEIN dritter Verweis" gesagt hatte: Diese Regel galt einem
   * Verweis auf die Plattform - dorthin führt das Sensorik-Zeichen oben links.
   * Am 02.09.2026 hat er sie für diesen einen Fall aufgehoben: *„mach einen
   * link mit ‚unterstützen' rechts neben dem impressum"*, nachdem der
   * Spendenblock direkt auf der Einstiegsseite zu aufdringlich war.
   */
  unterstuetzenApp?: string;
  /**
   * Hängt „Barrierefreiheit" (die Erklärung zur Barrierefreiheit) hinter das
   * Impressum - auf Wunsch von Johannes am 12.09.2026, als Voraussetzung für
   * die Qualitätsprüfung Lernapps des OeAD.
   *
   * ⚠️ **Nur wer es ausdrücklich mitgibt, bekommt den Verweis.** Die Erklärung
   * unter `/barrierefreiheit` gilt bisher allein für Tastenflow - nur dort ist
   * gemessen, was sie behauptet. Stünde der Verweis in allen 24 Seiten, gäbe er
   * für Programme Auskunft, die niemand geprüft hat. Bekommt ein weiteres
   * Programm seine eigene, belegte Erklärung, gibt es hier `barrierefreiheit`
   * mit - dieselbe Erlaubnisliste wie bei „Unterstützen".
   */
  barrierefreiheit?: boolean;
}) {
  const zeigeUnterstuetzen =
    unterstuetzenApp !== undefined && unterstuetzenFreigegeben(unterstuetzenApp);
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const ruht = useSyncExternalStore(abonnieren, ruhtJetzt, ruhtJetzt);
  /** Im Arbeiten kein Tab-Halt (siehe `useFusszeileRuht`). */
  const tab = ruht ? -1 : undefined;

  return (
    /*
     * `lang="en"` nur in der englischen Bedienung: Die Übungsseite hüllt die
     * Fußzeile bis zur Abnahme von EN8 noch in `<DeutschBleibt>` (lang="de",
     * aus der Zeit, als die Rechtstexte nur deutsch waren) - ohne eigenes
     * `lang` läse eine Sprachausgabe „Privacy" dort mit deutscher Stimme.
     * In der deutschen Bedienung kein Attribut: das DOM bleibt, wie es war.
     */
    <footer
      aria-label={t.landmarke}
      aria-hidden={ruht || undefined}
      className={className}
      lang={LANG_ATTRIBUT[sprache]}
    >
      <Link to="/datenschutz" className="underline underline-offset-2" tabIndex={tab}>
        {t.datenschutz}
      </Link>
      {" · "}
      <Link to="/impressum" className="underline underline-offset-2" tabIndex={tab}>
        {t.impressum}
      </Link>
      {barrierefreiheit && (
        <>
          {" · "}
          <Link to="/barrierefreiheit" className="underline underline-offset-2" tabIndex={tab}>
            {t.barrierefreiheit}
          </Link>
        </>
      )}
      {zeigeUnterstuetzen && (
        <>
          {" · "}
          <Link to="/unterstuetzen" className="underline underline-offset-2" tabIndex={tab}>
            {t.unterstuetzen}
          </Link>
        </>
      )}
    </footer>
  );
}
