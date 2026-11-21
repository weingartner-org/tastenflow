/**
 * Übezeit-Uhr. Zeigt als Digitaluhr (M:SS) die HEUTE geübte Zeit: Sie startet
 * um Mitternacht bei null,
 * überlebt ein Neuladen und zählt Übezeit anderer Geräte desselben Tages mit
 * (siehe `practiceClock.ts`, `primePracticeClock`). Nach mehr als 5 s Tipp-Pause
 * hält sie an und läuft beim nächsten Anschlag weiter.
 *
 * ★ Dieselbe HEUTE-Zeit (plus die laufende, noch nicht gespeicherte Zeile,
 * `pendingPracticeMs`) füllt auch den Wochenziel-Ring ([[WeeklyGoalRings]]) -
 * seit dem Umbau auf Minuten je KALENDERWOCHE (W4, 19.09.2026, `wochenziel.ts`)
 * rechnet der Ring zwar über die ganze Woche, nicht mehr nur über den Tag,
 * bleibt aber an derselben Sekunden-Uhr wie diese hier - Uhr und Ring können
 * darum nicht auseinanderlaufen. Die Beschriftung heißt deshalb „Heute"
 * (vorher „Übezeit", und die Ansage behauptete sogar „dieser Lernsession",
 * obwohl die Uhr längst den ganzen Tag zählte). Bewusst EIN kurzes Wort - die
 * Uhr steht überall dort, wo wenig Platz ist.
 *
 * ⚠️ Wo sie hängt, hat sich am 25.08.2026 geändert: Der dreispaltige
 * Trainer-Kopf in [[AdaptiveTrainer]], für den diese Uhr ursprünglich gebaut
 * wurde, ist mit der Stand-Zeile weggefallen. Sie sitzt jetzt in
 * [[StandZeile]] (als `kompakt`, blass und klein) und im [[SerienTrainer]].
 * Der Umbruch-Befund vom 26.08. (Überschrift legte sich 17,4 px über diesen
 * Kasten) betraf den alten Kopf und ist damit gegenstandslos - die Stand-Zeile
 * ist eine eigene Bauform und bei 320 px eigens nachzumessen.
 * Siehe [[project_zehnfinger_trainer]].
 */
import { useEffect, useState } from "react";
import { formatPracticeTime, getPracticeMs } from "@/lib/typing";
import { Tipp } from "@/components/Tipp";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/** Die Texte der Uhr in beiden Bedienungssprachen (12.09.2026). Deutsch wortgleich wie vorher. */
const UHR_TEXTE = texte({
  de: {
    tipp: "Heute geübte Zeit. Hält bei einer Pause an.",
    name: (zeit: string) => `Heute geübt: ${zeit}. Pausiert nach 5 Sekunden Tipp-Pause.`,
    heute: "Heute",
  },
  en: {
    tipp: "Time practised today. It stops when you pause.",
    name: (zeit: string) => `Practised today: ${zeit}. Pauses after 5 seconds without typing.`,
    heute: "Today",
  },
  fr: {
    tipp: "Temps exercé aujourd'hui. S'arrête en cas de pause.",
    name: (zeit: string) => `Exercé aujourd'hui : ${zeit}. Se met en pause après 5 secondes sans frappe.`,
    heute: "Aujourd'hui",
  },
  es: {
    tipp: "Tiempo practicado hoy. Se detiene en las pausas.",
    name: (zeit: string) => `Practicado hoy: ${zeit}. Se pausa tras 5 segundos sin pulsar ninguna tecla.`,
    heute: "Hoy",
  },
  it: {
    tipp: "Tempo di esercizio di oggi. Si ferma durante le pause.",
    name: (zeit: string) => `Esercizio di oggi: ${zeit}. Si ferma dopo 5 secondi senza premere nessun tasto.`,
    heute: "Oggi",
  },
  // ★ O-PL (02.10.2026): „czas ćwiczeń" (Glossar §2.2), Satz über die Uhr.
  pl: {
    tipp: "Dzisiejszy czas ćwiczeń. Zatrzymuje się podczas przerwy.",
    name: (zeit: string) => `Czas ćwiczeń dzisiaj: ${zeit}. Zatrzymuje się po 5 sekundach bez pisania.`,
    heute: "Dzisiaj",
  },
  // ★ O-TR (02.10.2026): "çalışma süresi" (Glossar §2.2), Satz über die Uhr,
  // Einzahl nach der Zahl ("5 saniye").
  tr: {
    tipp: "Bugünkü çalışma süresi. Ara verince durur.",
    name: (zeit: string) => `Bugünkü çalışma süresi: ${zeit}. 5 saniye tuşa basılmazsa durur.`,
    heute: "Bugün",
  },
  // ★ O-CS (03.10.2026): „čas procvičování" (Glossar §2.2), Satz über die Uhr,
  // ohne Anrede (Kind und Lehrkraft sehen sie).
  cs: {
    tipp: "Dnešní čas procvičování. Při přestávce se zastaví.",
    name: (zeit: string) => `Dnešní čas procvičování: ${zeit}. Zastaví se po 5 sekundách bez psaní.`,
    heute: "Dnes",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      tipp: "Време за упражнения днес. Спира, когато правиш пауза.",
      name: (zeit: string) => `Упражнения днес: ${zeit}. Спира след 5 секунди без писане.`,
      heute: "Днес",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      tipp: "Χρόνος εξάσκησης σήμερα. Σταματά όταν κάνεις παύση.",
      name: (zeit: string) => `Εξάσκηση σήμερα: ${zeit}. Σταματά μετά από 5 δευτερόλεπτα χωρίς γράψιμο.`,
      heute: "Σήμερα",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      tipp: "A ma gyakorolt idő. Szünetnél megáll.",
      name: (zeit: string) => `Mai gyakorlási idő: ${zeit}. 5 másodperc gépelési szünet után megáll.`,
      heute: "Ma",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      tipp: "Vandaag geoefende tijd. Stopt als je pauzeert.",
      name: (zeit: string) => `Vandaag geoefend: ${zeit}. Pauzeert na 5 seconden zonder typen.`,
      heute: "Vandaag",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      tipp: "Tempo de prática hoje. Para quando fazes uma pausa.",
      name: (zeit: string) => `Praticado hoje: ${zeit}. Para ao fim de 5 segundos sem escrever.`,
      heute: "Hoje",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      tipp: "Tempo de prática hoje. Para quando você faz uma pausa.",
      name: (zeit: string) => `Tempo de prática hoje: ${zeit}. Pausa depois de 5 segundos sem digitar.`,
      heute: "Hoje",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      tipp: "Timpul exersat azi. Se oprește când faci o pauză.",
      name: (zeit: string) => `Exersat azi: ${zeit}. Se oprește după cinci secunde fără scris.`,
      heute: "Azi",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      tipp: "Övningstid i dag. Stannar när du gör en paus.",
      name: (zeit: string) => `Övat i dag: ${zeit}. Pausar efter 5 sekunder utan skrivande.`,
      heute: "I dag",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      tipp: "Час тренування сьогодні. Зупиняється під час паузи.",
      name: (zeit: string) => `Час тренування сьогодні: ${zeit}. Зупиняється після 5 секунд без друку.`,
      heute: "Сьогодні",
    },
});

export function PracticeClock({ kompakt = false }: { kompakt?: boolean } = {}) {
  const t = UHR_TEXTE[useBedienSprache().sprache];
  const [ms, setMs] = useState(() => getPracticeMs());

  useEffect(() => {
    const id = window.setInterval(() => setMs(getPracticeMs()), 500);
    return () => window.clearInterval(id);
  }, []);

  const text = formatPracticeTime(ms);

  return (
    // ★ 30.08.2026: Hinweis aus dem Tipp-Baustein statt aus `title` (Johannes:
    //   der native kam „sehr verzögert und viel kleiner"). `ausrichtung=links`,
    //   weil die Uhr in der Stand-Zeile links der Mitte steht. Die Id wird
    //   nicht angehängt - das `aria-label` sagt schon alles.
    <Tipp text={t.tipp} ausrichtung="links">
      {() => (
    <div
      className="flex shrink-0 items-center gap-2"
      role="timer"
      aria-label={t.name(text)}
    >
      <p
        className={
          "m-0 leading-tight " +
          // ★ 30.08.2026 (Johannes): kompakt KEINE eigene Schriftgröße mehr -
          //   „Heute" erbt die der Stand-Zeile (text-base), statt als einziges
          //   Wort klein zu bleiben.
          (kompakt ? "text-ink-soft" : "text-sm font-semibold text-ink")
        }
        aria-hidden="true"
      >
        {t.heute}
      </p>
      {/* Kompakt (Stand-Zeile unter dem Feld): dieselbe Zahl, aber in der
          Schriftgröße der Zeile - die große Digitaluhr war so hoch wie eine
          Überschrift und stand mitten im Blickfeld. */}
      <span
        className={
          kompakt
            ? "font-mono text-base font-semibold tabular-nums tracking-wide text-ink"
            // ★ E7 (11.09.2026): `text-xl` statt `text-2xl`.
            : "rounded-lg border border-hairline bg-surface-sunken px-2.5 py-1 font-mono text-xl font-bold tabular-nums tracking-wide text-ink"
        }
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
      )}
    </Tipp>
  );
}
