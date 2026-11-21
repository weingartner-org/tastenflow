/**
 * ★★ Die Punktleiste: ein gefüllter Kreis je Person auf einer Linie.
 *
 * Johannes am 01.09.2026, wörtlich: *„statt dem boxplot mach die punkte der
 * schüler auf der leiste"* · *„ich möchte auf der linie einfach gefüllte kleine
 * kreise, wer mit der maus darüber kommt sieht den namen"* · *„mit tastatur
 * machen wir eine tab pfeil navigation"*.
 *
 * ── Was sie ersetzt ────────────────────────────────────────────────────────
 * Bis heute früh stand hier der Verteilungsbalken mit vier Töpfen (F20,
 * 31.08.). Ein Topf „85-92 %" verrät nicht, ob dort sechs Personen dicht bei
 * 92 liegen oder über die ganze Spanne verteilt. Ein Punkt je Person verrät es.
 *
 * ── ⚠️⚠️ DIE TASTATUR HAT VORRANG, NICHT DIE MAUS ─────────────────────────
 * Johannes 01.09.: *„es gibt blinde und sehende Lehrer, diesen Überblick müssen
 * beide Gruppen gut bedienen können."* Der Verteilungsbalken trug seine Aussage
 * in vier Zahlen als Text; Punkte auf einer Linie haben so etwas nicht von
 * selbst. Diese Leiste löst das über die Bedienung statt über eine zweite
 * Liste daneben:
 *
 *  • **Ein** Tab-Halt für die ganze Leiste - nicht einer je Person. Bei 24
 *    Lernenden und drei Leisten wären das sonst 72 Tab-Halte, und die Seite
 *    wäre gerade für die unbedienbar, für die sie gedacht ist.
 *  • Innen gehen die **Pfeiltasten** von Person zu Person, Pos1/Ende an die
 *    Enden. Jeder Halt wird angesagt: „Mia, 92 Prozent".
 *  • **Tab führt wieder heraus** zum nächsten Inhalt - man muss sich nicht
 *    durch die Klasse tippen, um weiterzukommen (Johannes: „mit tab überspringt
 *    man die leiste zum nächsten inhalt").
 *
 * ★ Die Überschrift ist Pflicht und wird per `aria-labelledby` mit der Gruppe
 * verbunden (Johannes: „ganz wichtig, Überschriften der Bereiche müssen
 * definiert sein"). Wer mit der Überschriften-Navigation springt, landet
 * genau hier und weiss, worauf er steht.
 *
 * ⚠️ Die Kreise liegen an ihrer ECHTEN Stelle. Wo Werte zusammenfallen, wird
 * der Fleck dichter - das ist ehrlich und für die Maus manchmal fummelig. Über
 * die Pfeiltasten ist trotzdem JEDE Person erreichbar, auch eine verdeckte.
 * Darum ist die Tastatur hier nicht der Ersatzweg, sondern der vollständigere.
 */
import { useId, useMemo, useState } from "react";
import { GEBIET, mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";
import { istGeruestSprache } from "@/lib/typing/sprachRegister";
import { Hinweiskasten, fokusIstSichtbar, useZeigerhinweis } from "./Zeigerhinweis";

/**
 * Der Name der Leiste in beiden Bedienungssprachen (EN3, 19.09.2026). Titel
 * und Einheit kommen vom Aufrufer (Lehrkraft-Bereich, EN6). Englisch *people*
 * (nicht *persons*) und die Tastenwege ohne Maus (Glossar §1.3).
 */
const LEISTE_TEXTE = texte({
  de: {
    name: (titel: string, anzahl: number, von: string, bis: string) =>
      `${titel}: ${anzahl} ${anzahl === 1 ? "Person" : "Personen"}, von ${von} bis ${bis}. ` +
      `Mit den Pfeiltasten von Person zu Person.`,
  },
  en: {
    name: (titel: string, anzahl: number, von: string, bis: string) =>
      `${titel}: ${anzahl} ${anzahl === 1 ? "person" : "people"}, from ${von} to ${bis}. ` +
      `Use the arrow keys to go from one person to the next.`,
  },
  fr: {
    name: (titel: string, anzahl: number, von: string, bis: string) =>
      `${titel} : ${anzahl} ${anzahl === 1 ? "personne" : "personnes"}, de ${von} à ${bis}. ` +
      `Avec les flèches, d'une personne à l'autre.`,
  },
  es: {
    name: (titel: string, anzahl: number, von: string, bis: string) =>
      `${titel}: ${anzahl} ${anzahl === 1 ? "persona" : "personas"}, de ${von} a ${bis}. ` +
      `Con las flechas, de una persona a otra.`,
  },
  it: {
    name: (titel: string, anzahl: number, von: string, bis: string) =>
      `${titel}: ${anzahl} ${anzahl === 1 ? "persona" : "persone"}, da ${von} a ${bis}. ` +
      `Con le frecce, da una persona all'altra.`,
  },
  // ★ O-PL (02.10.2026): „osoba" mit vier Formen nach dem Doppelpunkt (Glossar
  // §2.10a, Personen bevorzugt als „osoba").
  pl: {
    name: (titel: string, anzahl: number, von: string, bis: string) =>
      `${titel}: ${mehrzahl(anzahl, "pl", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osób`,
        other: (z) => `${z} osoby`,
      })}, od ${von} do ${bis}. ` + `Strzałki przechodzą od osoby do osoby.`,
  },
  // ★ O-TR (02.10.2026): nur die Lehrkraft sieht die Leiste (Klassenüberblick) -
  // siz mit -In, "öğrenci" (Glossar Regel 1/2), Einzahl nach der Zahl, keine
  // Endung an den Werten ("${von} ile ${bis} arası", Regel 6).
  tr: {
    name: (titel: string, anzahl: number, von: string, bis: string) =>
      `${titel}: ${anzahl} öğrenci, ${von} ile ${bis} arası. ` +
      `Ok tuşlarıyla bir öğrenciden diğerine geçin.`,
  },
  // ★ O-CS (03.10.2026): nur die Lehrkraft sieht die Leiste - vy, „osoba" mit
  // allen vier Formen nach dem Doppelpunkt (Glossar Regel 2, §2.11); „od ... do ..."
  // ändert sich vor keiner Zahl; ohne Maus (Regel 8).
  cs: {
    name: (titel: string, anzahl: number, von: string, bis: string) =>
      `${titel}: ${mehrzahl(anzahl, "cs", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osoby`,
        other: (z) => `${z} osob`,
      })}, od ${von} do ${bis} - šipkami přejdete od jedné osoby k další.`,
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      name: (titel: string, anzahl: number, von: string, bis: string) =>
        `${titel}: ${anzahl} ${anzahl === 1 ? "човек" : "души"}, от ${von} до ${bis}. ` +
        `Със стрелките от човек на човек.`,
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      name: (titel: string, anzahl: number, von: string, bis: string) =>
        `${titel}: ${anzahl} ${anzahl === 1 ? "άτομο" : "άτομα"}, από ${von} ως ${bis}. ` +
        `Με τα πλήκτρα βέλους από άτομο σε άτομο.`,
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      name: (titel: string, anzahl: number, von: string, bis: string) =>
        `${titel}: ${anzahl} személy, ${von} és ${bis} között. ` +
        `A nyílbillentyűkkel lehet személyről személyre lépni.`,
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      name: (titel: string, anzahl: number, von: string, bis: string) =>
        `${titel}: ${mehrzahl(anzahl, "nl", { one: (z) => `${z} persoon`, other: (z) => `${z} personen` })}, van ${von} tot ${bis}. ` +
        `Met de pijltoetsen van persoon naar persoon.`,
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      name: (titel: string, anzahl: number, von: string, bis: string) =>
        `${titel}: ${anzahl} ${anzahl === 1 ? "pessoa" : "pessoas"}, de ${von} a ${bis}. ` +
        `Use as teclas de seta para passar de uma pessoa à seguinte.`,
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      name: (titel: string, anzahl: number, von: string, bis: string) =>
        `${titel}: ${anzahl} ${anzahl === 1 ? "pessoa" : "pessoas"}, de ${von} a ${bis}. ` +
        `Use as teclas de seta para ir de uma pessoa a outra.`,
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      name: (titel: string, anzahl: number, von: string, bis: string) =>
        `${titel}: ` +
        mehrzahl(anzahl, "ro", {
          one: () => "o persoană",
          few: (z) => `${z} persoane`,
          other: (z) => `${z} de persoane`,
        }) +
        `, de la ${von} până la ${bis}. ` +
        `Săgețile duc de la o persoană la alta.`,
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      name: (titel: string, anzahl: number, von: string, bis: string) =>
        `${titel}: ${anzahl} ${anzahl === 1 ? "person" : "personer"}, från ${von} till ${bis}. ` +
        `Gå från person till person med piltangenterna.`,
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      name: (titel: string, anzahl: number, von: string, bis: string) =>
        `${titel}: ${mehrzahl(anzahl, "uk", {
          one: (z) => `${z} особа`,
          few: (z) => `${z} особи`,
          many: (z) => `${z} осіб`,
          other: (z) => `${z} особи`,
        })}, від ${von} до ${bis}. ` +
        `Клавішами зі стрілками - від однієї особи до наступної.`,
    },
});

export interface PunktPerson {
  name: string;
  wert: number;
}

/**
 * Enden der Achse: auf 5 gerundet, mindestens 10 breit - sonst sitzen bei einer
 * engen Klasse alle Punkte aufeinander. Die Enden stehen als Text darunter, die
 * Leiste behauptet also nie eine Spanne, die man nicht nachlesen kann.
 */
function achse(werte: readonly number[]): { von: number; bis: number } {
  const min = Math.min(...werte);
  const max = Math.max(...werte);
  let von = Math.floor(min / 5) * 5;
  let bis = Math.ceil(max / 5) * 5;
  if (bis - von < 10) {
    const mitte = (von + bis) / 2;
    von = Math.floor((mitte - 5) / 5) * 5;
    bis = von + 10;
  }
  return { von, bis };
}

export function Punktleiste({
  titel,
  hilfe,
  personen,
  einheit,
  /** „92 %" gegen „137 Anschläge/Min" - für die Ansage der Sprachausgabe. */
  einheitGesprochen,
  zusammenfassung,
  onWaehlen,
}: {
  titel: string;
  /**
   * ★ B4 (11.09.2026): Die Erklärung der Zahl, beim Überfahren und beim Fokus
   * an der Überschrift - derselbe Weg wie am Spaltenkopf (`Zeigerhinweis`).
   * Ohne sie bleibt die Überschrift eine gewöhnliche Überschrift.
   */
  hilfe?: string;
  personen: readonly PunktPerson[];
  einheit: string;
  einheitGesprochen: string;
  /**
   * ★★ Der Überblick als TEXT, unter der Leiste - z. B. die vier Töpfe.
   * Kein Beiwerk: Die Punkte sagen „wer", diese Zeile sagt „wie steht die
   * Klasse". Wer die Leiste nicht sehen kann, bekäme das Zweite sonst erst
   * nach so vielen Pfeiltasten-Anschlägen, wie die Klasse Köpfe hat.
   */
  zusammenfassung?: React.ReactNode;
  /** Enter oder Klick auf einen Punkt - z. B. „diese Person in der Liste aufklappen". */
  onWaehlen?: (name: string) => void;
}) {
  const titelId = useId();
  const { sprache } = useBedienSprache();
  const [aktiv, setAktiv] = useState<number | null>(null);
  const [imFokus, setImFokus] = useState(false);
  const {
    id: hinweisId,
    offen,
    nachOben,
    seite,
    maxBreite,
    huelle,
    setZeiger,
    betreten,
  } = useZeigerhinweis(hilfe, "links");

  // Nach Wert sortiert: Die Pfeiltasten gehen damit der Leiste entlang und
  // nicht in der Reihenfolge, in der die Konten angelegt wurden.
  // ★ O-PL (02.10.2026): polnische Namen nach polnischem Alphabet („Łukasz"
  // vor „Zuzanna", Glossar §3 Falle 11); alle anderen Sprachen wie bisher.
  // ★ O-TR (02.10.2026): türkische Namen nach türkischem Alphabet ("Çağla" vor "Deniz").
  // ★ O-CS (03.10.2026): tschechische Namen nach tschechischem Alphabet („Čeněk"
  // nach „Cyril", „Chrudoš" nach „Hana").
  // ★ O2-COMP (30.10.2026): die neun über ihr Gebiet (die Kennung „br" allein wäre Bretonisch).
  const sortierSprache = istGeruestSprache(sprache)
    ? GEBIET[sprache]
    : sprache === "pl" || sprache === "tr" || sprache === "cs"
      ? sprache
      : "de";
  const sortiert = useMemo(
    () => [...personen].sort((a, b) => a.wert - b.wert || a.name.localeCompare(b.name, sortierSprache)),
    [personen, sortierSprache],
  );
  const { von, bis } = useMemo(
    () => achse(sortiert.map((p) => p.wert)),
    [sortiert],
  );

  if (sortiert.length === 0) return null;

  const anteil = (w: number) => ((w - von) / (bis - von)) * 100;
  const zeige = aktiv !== null ? sortiert[aktiv] : undefined;

  function springe(zu: number) {
    const i = Math.max(0, Math.min(sortiert.length - 1, zu));
    setAktiv(i);
  }

  function beiTaste(e: React.KeyboardEvent) {
    const i = aktiv ?? -1;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        springe(i + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        springe(i <= 0 ? 0 : i - 1);
        break;
      case "Home":
        e.preventDefault();
        springe(0);
        break;
      case "End":
        e.preventDefault();
        springe(sortiert.length - 1);
        break;
      case "Enter":
      case " ":
        if (zeige && onWaehlen) {
          e.preventDefault();
          onWaehlen(zeige.name);
        }
        break;
      default:
        break;
    }
  }

  return (
    <section className="space-y-1 pt-1">
      {/*
        ★ B4: Die Überschrift trägt die Erklärung der Zahl selbst - beim
        Überfahren sichtbar, über `aria-describedby` auch auf der Braillezeile.
        Die gepunktete Unterlinie ist das sichtbare Zeichen dafür, dass hier
        etwas zu holen ist (Farbe allein wäre keins, WCAG 1.4.1) - genau wie am
        Spaltenkopf, damit man es nicht zweimal lernen muss.
      */}
      <h4
        id={titelId}
        className="m-0 text-sm font-semibold text-ink"
        aria-describedby={hilfe ? hinweisId : undefined}
      >
        {hilfe ? (
          <span
            ref={huelle}
            className="relative inline-flex items-baseline underline decoration-dotted underline-offset-4"
            onMouseEnter={betreten}
            onMouseLeave={() => setZeiger(false)}
          >
            {titel}
            <Hinweiskasten
              id={hinweisId}
              offen={offen}
              ausrichtung={seite}
              nachOben={nachOben}
              maxBreite={maxBreite}
              ohneBreiteWennZu
            >
              {hilfe}
            </Hinweiskasten>
          </span>
        ) : (
          titel
        )}
      </h4>

      {/*
        ★ EIN Tab-Halt für die ganze Gruppe. `aria-label` sagt beim Betreten,
        wie viele Personen darauf liegen und wie man sie durchgeht - sonst ist
        die Leiste für eine Sprachausgabe ein Kasten ohne Inhalt.
      */}
      <div
        tabIndex={0}
        role="group"
        aria-labelledby={titelId}
        aria-label={LEISTE_TEXTE[sprache].name(
          titel,
          sortiert.length,
          `${sortiert[0].wert}${einheit}`,
          `${sortiert[sortiert.length - 1].wert}${einheit}`,
        )}
        onKeyDown={beiTaste}
        onFocus={(e) => {
          // ★ 28.09.2026: Ein Mausklick auf einen Punkt fokussiert ihn auch -
          // dann hielte `imFokus` den Punkt nach dem Wegfahren fest. Nur ein
          // Tastatur-Fokus gehört der Tastatur (`fokusIstSichtbar`).
          if (fokusIstSichtbar(e.target)) setImFokus(true);
          if (aktiv === null) setAktiv(0);
        }}
        onBlur={() => {
          setImFokus(false);
          setAktiv(null);
        }}
        onMouseLeave={() => {
          if (!imFokus) setAktiv(null);
        }}
        className="relative rounded-md px-1 py-4 outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {/* Die Linie selbst - reine Optik, die Aussage tragen die Punkte. */}
        <div className="relative h-px w-full bg-hairline" aria-hidden="true">
          {sortiert.map((p, i) => (
            <button
              key={`${p.name}-${i}`}
              type="button"
              /*
                ⚠️ tabIndex=-1: Der Punkt ist mit der MAUS anklickbar und
                bekommt beim Durchgehen den sichtbaren Zustand - aber er ist
                KEIN eigener Tab-Halt. Genau das ist der Unterschied zwischen
                24 Halten und einem.
              */
              tabIndex={-1}
              aria-hidden="true"
              onMouseEnter={() => setAktiv(i)}
              onClick={() => onWaehlen?.(p.name)}
              style={{ left: `${anteil(p.wert)}%` }}
              className={
                "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-0 p-0 " +
                (aktiv === i
                  ? "h-4 w-4 bg-accent ring-2 ring-accent ring-offset-2 ring-offset-surface"
                  : "h-2.5 w-2.5 bg-accent/70 hover:bg-accent")
              }
            />
          ))}
        </div>

        {/*
          Die Einblendung folgt dem Fokus UND der Maus - dieselbe Anzeige, wie
          Johannes es verlangt hat („beide Gruppen gut bedienen"). Grosse
          Schrift, weil sie im Vorbeigehen gelesen wird.
        */}
        {zeige && (
          <div
            aria-hidden="true"
            style={{ left: `${anteil(zeige.wert)}%` }}
            className="pointer-events-none absolute bottom-full z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-hairline bg-surface px-2 py-1 text-base font-semibold text-ink shadow-md"
          >
            {zeige.name} · {zeige.wert}
            {einheit}
          </div>
        )}
      </div>

      {/* Die Enden der Achse - damit die Leiste keine Spanne behauptet, die
          man nicht nachlesen kann. */}
      <div className="flex justify-between text-sm text-ink-muted" aria-hidden="true">
        <span>
          {von}
          {einheit}
        </span>
        <span>
          {bis}
          {einheit}
        </span>
      </div>

      {zusammenfassung}

      {/*
        ★★ Die Ansage. Ein Bereich, der sich ändert, statt 24 Elementen im
        Baum: Die Sprachausgabe liest genau den Halt vor, auf dem man steht.
      */}
      <p className="sr-only" aria-live="polite">
        {zeige ? `${zeige.name}, ${zeige.wert} ${einheitGesprochen}` : ""}
      </p>
    </section>
  );
}
