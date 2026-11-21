/**
 * Pulldown mit anklickbaren Kalenderwochen (Mehrfachauswahl) für die Wochenziele
 * des Tipptrainers — die Lehrkraft wählt, in welchen KW das Ziel erreicht werden
 * muss. Leere Auswahl = jede Woche (laufend). Siehe goals.ts (listSelectableWeeks).
 *
 * ★★★★★ „LAUFEND" SIEHT AUCH SO AUS (Befund 16.09.2026): Bis dahin stand bei
 * leerer Auswahl zwar im GESCHLOSSENEN Knopf „Jede Woche (laufend)", aber
 * öffnete man die Liste, war KEIN einziges Kästchen angehakt - das wirkte wie
 * „nichts gewählt", nicht wie „alles gewählt", und verunsicherte Lehrkräfte
 * genau in dem Moment, in dem sie nachsehen wollten, was „Für alle
 * übernehmen" eigentlich tun würde. Jetzt zeigen bei leerer Auswahl ALLE
 * angezeigten Wochen als angehakt (echtes `checked`, nicht nur Optik - sonst
 * hörte eine Sprachausgabe etwas anderes, als das Auge sieht). Ein Abwählen
 * EINER Woche aus diesem Zustand bedeutet dann „jede Woche ausser dieser" -
 * die restlichen bleiben angehakt, statt dass nur die eine übrig bliebe.
 */
import { useEffect, useRef, useState } from "react";
import { listSelectableWeeks, weekLabelJeSprache } from "@/lib/typing";
import { Tipp } from "@/components/Tipp";
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★ EN6a (19.09.2026): die Texte der Wochenauswahl in beiden
 * Bedienungssprachen - GEMEINSAMER TEIL (auch Punktgenau): englisch nur über
 * den Provider. Glossar §3.3: *goal weeks*, eine Woche nie als Nummer allein,
 * sondern *Week 38 (w/c 14 Sept)* (`weekLabelEn`). „laufend" ⇒ *ongoing*;
 * „angehakt" ⇒ *ticked* (§3.12).
 */
const WOCHEN_TEXTE = texte({
  de: {
    jedeWoche: "Jede Woche (laufend)",
    jedeWocheAusser: (woche: string) => `Jede Woche außer ${woche}`,
    wochenGewaehlt: (n: number) => `${n} Kalenderwoche${n === 1 ? "" : "n"}`,
    tipp: "Legt fest, in welchen Kalenderwochen das Ziel gilt. Leer oder alle angehakt heisst: jede Woche, laufend.",
    name: (label: string) => `Ziel-Kalenderwochen: ${label}`,
    gruppe: "Ziel-Kalenderwochen",
    alle: "Alle (laufend)",
    alleKlein: "alle (laufend)",
    gewaehlt: (n: number) => `${n} gewählt`,
  },
  en: {
    jedeWoche: "Every week (ongoing)",
    jedeWocheAusser: (woche: string) => `Every week except ${woche}`,
    wochenGewaehlt: (n: number) => `${n} ${n === 1 ? "week" : "weeks"}`,
    tipp: "Sets the weeks in which the goal applies. None ticked or all ticked means: every week, ongoing.",
    name: (label: string) => `Goal weeks: ${label}`,
    gruppe: "Goal weeks",
    alle: "All (ongoing)",
    alleKlein: "all (ongoing)",
    gewaehlt: (n: number) => `${n} chosen`,
  },
  fr: {
    jedeWoche: "Chaque semaine (en continu)",
    jedeWocheAusser: (woche: string) => `Chaque semaine sauf ${woche}`,
    wochenGewaehlt: (n: number) => `${n} semaine${n === 1 ? "" : "s"} calendaire${n === 1 ? "" : "s"}`,
    tipp: "Définit les semaines calendaires où l'objectif s'applique. Rien coché ou tout coché signifie : chaque semaine, en continu.",
    name: (label: string) => `Semaines calendaires de l'objectif : ${label}`,
    gruppe: "Semaines calendaires de l'objectif",
    alle: "Toutes (en continu)",
    alleKlein: "toutes (en continu)",
    gewaehlt: (n: number) => `${n} choisie${n === 1 ? "" : "s"}`,
  },
  es: {
    jedeWoche: "Cada semana (sin interrupción)",
    jedeWocheAusser: (woche: string) => `Cada semana salvo ${woche}`,
    wochenGewaehlt: (n: number) => `${n} ${n === 1 ? "semana" : "semanas"}`,
    tipp: "Fija en qué semanas cuenta el objetivo. Nada marcado o todo marcado significa: cada semana, sin interrupción.",
    name: (label: string) => `Semanas del objetivo: ${label}`,
    gruppe: "Semanas del objetivo",
    alle: "Todas (sin interrupción)",
    alleKlein: "todas (sin interrupción)",
    gewaehlt: (n: number) => `${n} ${n === 1 ? "elegida" : "elegidas"}`,
  },
  // ★ O-IT (02.10.2026): „settimane con obiettivo" (Glossar §2.6), Lehrkraft neutral.
  it: {
    jedeWoche: "Ogni settimana (senza interruzioni)",
    jedeWocheAusser: (woche: string) => `Ogni settimana tranne ${woche}`,
    wochenGewaehlt: (n: number) => `${n} ${n === 1 ? "settimana" : "settimane"}`,
    tipp: "Stabilisce in quali settimane conta l'obiettivo. Niente selezionato o tutto selezionato significa: ogni settimana, senza interruzioni.",
    name: (label: string) => `Settimane con obiettivo: ${label}`,
    gruppe: "Settimane con obiettivo",
    alle: "Tutte (senza interruzioni)",
    alleKlein: "tutte (senza interruzioni)",
    gewaehlt: (n: number) => `${n} ${n === 1 ? "scelta" : "scelte"}`,
  },
  // ★ O-PL (02.10.2026): „tygodnie z celem" (Glossar §2.6), Woche als
  // „Tydzień 14-20 września" (`weekLabelPl`) nach Doppelpunkt; vier Formen.
  pl: {
    jedeWoche: "Każdy tydzień (bez przerw)",
    jedeWocheAusser: (woche: string) => `Każdy tydzień oprócz: ${woche}`,
    wochenGewaehlt: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} tydzień`,
        few: (z) => `${z} tygodnie`,
        many: (z) => `${z} tygodni`,
        other: (z) => `${z} tygodnia`,
      }),
    tipp: "Określa, w których tygodniach obowiązuje cel. Brak zaznaczenia albo zaznaczenie wszystkich oznacza: każdy tydzień, bez przerw.",
    name: (label: string) => `Tygodnie z celem: ${label}`,
    gruppe: "Tygodnie z celem",
    alle: "Wszystkie (bez przerw)",
    alleKlein: "wszystkie (bez przerw)",
    gewaehlt: (n: number) => `Wybrane: ${n}`,
  },
  // ★ O-TR (02.10.2026): "hedefli haftalar" (Glossar §2.6), Woche als
  // "14-20 Eylül haftası" (`weekLabelTr`, nie mit Nummer); Einzahl nach der Zahl.
  tr: {
    jedeWoche: "Her hafta (sürekli)",
    jedeWocheAusser: (woche: string) => `Her hafta (hariç: ${woche})`,
    wochenGewaehlt: (n: number) => `${n} hafta`,
    tipp: "Hedefin hangi haftalarda geçerli olduğunu belirler. Hiçbiri ya da hepsi işaretliyse: her hafta, sürekli.",
    name: (label: string) => `Hedefli haftalar: ${label}`,
    gruppe: "Hedefli haftalar",
    alle: "Tümü (sürekli)",
    alleKlein: "tümü (sürekli)",
    gewaehlt: (n: number) => `Seçilen: ${n}`,
  },
  // ★ O-CS (03.10.2026): „Týdny s cílem" (Glossar §2.6), Woche als „Týden
  // 14.-20. září" (`weekLabelCs`, nie mit Nummer) nach Doppelpunkt; vier Formen
  // (§2.11); liest die Lehrkraft - beschreibend.
  cs: {
    jedeWoche: "Každý týden (průběžně)",
    jedeWocheAusser: (woche: string) => `Každý týden kromě: ${woche}`,
    wochenGewaehlt: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `${z} týden`,
        few: (z) => `${z} týdny`,
        many: (z) => `${z} týdne`,
        other: (z) => `${z} týdnů`,
      }),
    tipp: "Určuje, ve kterých týdnech cíl platí. Když není zaškrtnuté nic nebo je zaškrtnuté všechno, platí cíl každý týden, průběžně.",
    name: (label: string) => `Týdny s cílem: ${label}`,
    gruppe: "Týdny s cílem",
    alle: "Všechny (průběžně)",
    alleKlein: "všechny (průběžně)",
    gewaehlt: (n: number) => `Vybráno: ${n}`,
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      jedeWoche: "Всяка седмица (постоянно)",
      jedeWocheAusser: (woche: string) => `Всяка седмица освен ${woche}`,
      wochenGewaehlt: (n: number) => `${n} ${n === 1 ? "седмица" : "седмици"}`,
      tipp: "Определя в кои седмици важи целта. Нищо отметнато или всичко отметнато означава: всяка седмица, постоянно.",
      name: (label: string) => `Седмици с цел: ${label}`,
      gruppe: "Седмици с цел",
      alle: "Всички (постоянно)",
      alleKlein: "всички (постоянно)",
      gewaehlt: (n: number) => `Избрани: ${n}`,
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      jedeWoche: "Κάθε εβδομάδα (συνεχώς)",
      jedeWocheAusser: (woche: string) => `Κάθε εβδομάδα εκτός από: ${woche}`,
      wochenGewaehlt: (n: number) => `${n} ${n === 1 ? "εβδομάδα" : "εβδομάδες"}`,
      tipp: "Ορίζει σε ποιες εβδομάδες ισχύει ο στόχος. Καμία ή όλες επιλεγμένες σημαίνει: κάθε εβδομάδα, συνεχώς.",
      name: (label: string) => `Εβδομάδες με στόχο: ${label}`,
      gruppe: "Εβδομάδες με στόχο",
      alle: "Όλες (συνεχώς)",
      alleKlein: "όλες (συνεχώς)",
      gewaehlt: (n: number) => `Επιλεγμένες: ${n}`,
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      jedeWoche: "Minden hét (folyamatosan)",
      jedeWocheAusser: (woche: string) => `Minden hét, kivéve: ${woche}`,
      wochenGewaehlt: (n: number) => `${n} hét`,
      tipp: "Meghatározza, mely heteken érvényes a cél. Ha egy sincs bejelölve, vagy mind be van jelölve: minden hét, folyamatosan.",
      name: (label: string) => `Hetek heti céllal: ${label}`,
      gruppe: "Hetek heti céllal",
      alle: "Mind (folyamatosan)",
      alleKlein: "mind (folyamatosan)",
      gewaehlt: (n: number) => `${n} kiválasztva`,
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      jedeWoche: "Elke week (doorlopend)",
      jedeWocheAusser: (woche: string) => `Elke week behalve ${woche}`,
      wochenGewaehlt: (n: number) =>
        mehrzahl(n, "nl", { one: (z) => `${z} week`, other: (z) => `${z} weken` }),
      tipp: "Bepaalt in welke weken het doel geldt. Niets of alles aangevinkt betekent: elke week, doorlopend.",
      name: (label: string) => `Weken met een weekdoel: ${label}`,
      gruppe: "Weken met een weekdoel",
      alle: "Alle (doorlopend)",
      alleKlein: "alle (doorlopend)",
      gewaehlt: (n: number) => `${n} gekozen`,
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      jedeWoche: "Todas as semanas (contínuo)",
      jedeWocheAusser: (woche: string) => `Todas as semanas exceto ${woche}`,
      wochenGewaehlt: (n: number) => `${n} ${n === 1 ? "semana" : "semanas"}`,
      tipp: "Define em que semanas o objetivo se aplica. Nenhuma ou todas marcadas quer dizer: todas as semanas, de forma contínua.",
      name: (label: string) => `Semanas com objetivo: ${label}`,
      gruppe: "Semanas com objetivo",
      alle: "Todas (contínuo)",
      alleKlein: "todas (contínuo)",
      gewaehlt: (n: number) => `${n} ${n === 1 ? "escolhida" : "escolhidas"}`,
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      jedeWoche: "Toda semana (contínuo)",
      jedeWocheAusser: (woche: string) => `Toda semana, exceto ${woche}`,
      wochenGewaehlt: (n: number) => `${n} ${n === 1 ? "semana" : "semanas"}`,
      tipp: "Define em quais semanas a meta vale. Nenhuma ou todas marcadas quer dizer: toda semana, de forma contínua.",
      name: (label: string) => `Semanas com meta: ${label}`,
      gruppe: "Semanas com meta",
      alle: "Todas (contínuo)",
      alleKlein: "todas (contínuo)",
      gewaehlt: (n: number) => `Selecionadas: ${n}`,
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      jedeWoche: "În fiecare săptămână (permanent)",
      jedeWocheAusser: (woche: string) => `În fiecare săptămână, în afară de ${woche}`,
      wochenGewaehlt: (n: number) =>
        mehrzahl(n, "ro", {
          one: () => "o săptămână",
          few: (z) => `${z} săptămâni`,
          other: (z) => `${z} de săptămâni`,
        }),
      tipp: "Stabilește în ce săptămâni se aplică obiectivul. Nicio bifă sau toate bifate înseamnă: în fiecare săptămână, permanent.",
      name: (label: string) => `Săptămâni cu obiectiv: ${label}`,
      gruppe: "Săptămâni cu obiectiv",
      alle: "Toate (permanent)",
      alleKlein: "toate (permanent)",
      gewaehlt: (n: number) => `Alese: ${n}`,
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      jedeWoche: "Varje vecka (löpande)",
      jedeWocheAusser: (woche: string) => `Varje vecka utom ${woche}`,
      wochenGewaehlt: (n: number) => `${n} ${n === 1 ? "vecka" : "veckor"}`,
      tipp: "Bestämmer under vilka veckor målet gäller. Inga eller alla veckor valda betyder: varje vecka, löpande.",
      name: (label: string) => `Veckor med mål: ${label}`,
      gruppe: "Veckor med mål",
      alle: "Alla (löpande)",
      alleKlein: "alla (löpande)",
      gewaehlt: (n: number) => `${n} valda`,
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      jedeWoche: "Щотижня (постійно)",
      jedeWocheAusser: (woche: string) => `Щотижня, крім: ${woche}`,
      wochenGewaehlt: (n: number) =>
        mehrzahl(n, "uk", {
          one: (z) => `${z} тиждень`,
          few: (z) => `${z} тижні`,
          many: (z) => `${z} тижнів`,
          other: (z) => `${z} тижня`,
        }),
      tipp: "Визначає, у які тижні діє мета. Нічого не позначено або позначено все - це означає: щотижня, постійно.",
      name: (label: string) => `Тижні з метою: ${label}`,
      gruppe: "Тижні з метою",
      alle: "Усі (постійно)",
      alleKlein: "усі (постійно)",
      gewaehlt: (n: number) => `Вибрано: ${n}`,
    },
});

export function WeekMultiSelect({
  value,
  onChange,
  nowMs,
  count = 20,
  id,
}: {
  value: string[];
  onChange: (weeks: string[]) => void;
  nowMs: number;
  count?: number;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { sprache } = useBedienSprache();
  const t = WOCHEN_TEXTE[sprache];
  // ★ EN6a: englisch „Week 38 (w/c 14 Sept)" statt „KW 38 · 14.-20.09.".
  const weeks = listSelectableWeeks(nowMs, count).map((w) => ({
    ...w,
    label: weekLabelJeSprache(w.startMs, sprache),
  }));
  const sel = new Set(value);

  // Klick außerhalb schließt das Pulldown; Escape schließt + Fokus zurück.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (key: string) => {
    // ★ Aus der Wildcard heraus (leere Auswahl, optisch „alle angehakt") heisst
    // ein Klick auf eine angehakte Woche „diese eine abwählen" - die anderen
    // bleiben angehakt. Darum startet `next` hier bei ALLEN angezeigten
    // Wochen, nicht bei der leeren Auswahl selbst.
    const next = sel.size === 0 ? new Set(weeks.map((w) => w.key)) : new Set(sel);
    if (sel.size === 0) next.delete(key);
    else if (next.has(key)) next.delete(key);
    else next.add(key);
    // Sind danach wieder GENAU alle angezeigten Wochen drin (und nichts
    // ausserhalb des Fensters mehr) ist das wieder „laufend" - sonst liefe
    // eine von Hand komplett angehakte Liste lautlos am Fensterende aus.
    const jedeAngezeigte =
      next.size === weeks.length && weeks.every((w) => next.has(w.key));
    // ALLE gewählten behalten (auch solche außerhalb der angezeigten Wochen, z. B.
    // bereits vergangene Ziel-Wochen) und chronologisch sortieren — die ISO-Schlüssel
    // „YYYY-Www" sind in fester Breite, daher sortiert lexikografisch = zeitlich.
    onChange(jedeAngezeigte ? [] : [...next].sort());
  };

  /**
   * Fehlt aus der vollen, angezeigten Liste GENAU eine Woche (und nichts
   * ausserhalb des Fensters ist dabei), heisst die Auswahl „jede Woche ausser
   * dieser" - das sagt mehr als eine blosse Zahl und macht sichtbar, dass sie
   * (anders als echtes „laufend") am Fensterende endet.
   */
  const einzelnFehlend =
    value.length === weeks.length - 1 &&
    value.every((k) => weeks.some((w) => w.key === k))
      ? weeks.find((w) => !sel.has(w.key))
      : undefined;

  const label =
    value.length === 0
      ? t.jedeWoche
      : einzelnFehlend
        ? t.jedeWocheAusser(einzelnFehlend.label)
        : t.wochenGewaehlt(value.length);

  return (
    <div className="relative" ref={wrapRef}>
      {/* ★ K2 (19.09.2026): war ohne Hinweis - an BEIDEN Stellen, die dieses
          Bauteil einbinden (Kind und Klasse in `TastenflowReiter.tsx"), also
          hier am Bauteil selbst behoben, nicht zweimal am Aufrufer
          ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
          `unterdruecken`: offen steht die Liste selbst da - sie sagt mehr,
          als der Hinweis könnte (wie bei Farbschalter/Konto in `Tipp.tsx`). */}
      <Tipp text={t.tipp} unterdruecken={open}>
        {(hinweisId) => (
          <button
            ref={buttonRef}
            type="button"
            id={id}
            /*
              ★ Gleiche Höhe wie alles andere in dieser Zeile (Johannes 01.09.2026,
              nachgeschärft: *„mach alle Schalter, Eingabefelder und Pulldownmenüs
              genau so hoch wie den Schalter oben: ‚gegenüber Vorwoche'"*).

              Zuerst hatte ich alles auf die 44 px von `field-input` gehoben -
              Johannes hat es andersherum entschieden.

              ★★ 11.09.2026 (`BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md`, R1):
              36 px und GESETZT (`h-9 py-0`), nicht mehr aus `py-1.5` errechnet.
              Johannes: *„schaue dir die schalterhöhen an, ich glaube es gibt 5
              verschiedene höhen"* - dieses Feld war eine davon (34 px). Die
              Auswahl steht nur in den Lehrkraft-Reitern von „Meine Klassen", und
              dort ist jeder Schalter 36 px hoch (`.bedien-schlank` in `index.css`).
            */
            className="flex h-9 w-full min-w-[12rem] items-center justify-between gap-2 rounded-lg border border-hairline bg-surface-raised px-3 py-0 text-sm text-ink"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={open}
            aria-describedby={hinweisId}
            aria-label={t.name(label)}
          >
            <span className="truncate">
              <span aria-hidden="true">📅 </span>
              {label}
            </span>
            <span aria-hidden className="text-ink-muted">
              ▾
            </span>
          </button>
        )}
      </Tipp>
      {open && (
        <div
          role="group"
          aria-label={t.gruppe}
          className="absolute z-30 mt-1 max-h-64 w-72 overflow-auto rounded-xl border border-hairline bg-surface-raised p-1 shadow-lg"
        >
          <div className="flex justify-between gap-2 border-b border-hairline px-2 py-1">
            <button
              type="button"
              className="text-sm text-accent underline"
              onClick={() => onChange([])}
            >
              {t.alle}
            </button>
            <span className="text-sm text-ink-muted">
              {value.length === 0 ? t.alleKlein : t.gewaehlt(value.length)}
            </span>
          </div>
          {weeks.map((w) => {
            // ★ Wildcard: leere Auswahl heisst „jede Woche" - alle angezeigten
            // Wochen gelten darum als angehakt (siehe Dateikopf).
            const checked = sel.size === 0 || sel.has(w.key);
            return (
              <label
                key={w.key}
                className={
                  "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm " +
                  (checked ? "bg-accent-soft text-ink" : "text-ink-soft hover:bg-surface-sunken")
                }
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[rgb(var(--c-accent))]"
                  checked={checked}
                  onChange={() => toggle(w.key)}
                />
                {w.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
