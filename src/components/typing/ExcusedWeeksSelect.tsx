/**
 * Pulldown mit anklickbaren Kalenderwochen - Lehrkraft ERLÄSST einzelne Wochen
 * (Befund 16.09.2026: „ich brauch als Lehrer die Möglichkeit nicht erledigte
 * Wochenziele zu löschen wenn jemand krank war"). EIGENE Komponente statt
 * `WeekMultiSelect`: Dort heisst eine LEERE Auswahl „jede Woche (laufend)" -
 * hier muss eine leere Auswahl „keine erlassen" heissen. Dieselbe Optik mit
 * der GEGENTEILIGEN Bedeutung an derselben Stelle wäre die gefährlichste Sorte
 * Fehler: Ein Häkchen sässe an der immer gleichen Stelle, aber „nichts
 * angehakt" bedeutete hier „nichts erlassen" - im Wochenziel-Feld daneben
 * aber „jede Woche". Deshalb zwei Bauteile, keine geteilte Wildcard-Logik.
 */
import { useEffect, useRef, useState } from "react";
import { listSelectableWeeks, weekLabelJeSprache } from "@/lib/typing";
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★ EN6a (19.09.2026): die Texte in beiden Bedienungssprachen. Glossar §3.3:
 * erlassen ⇒ *excuse* (*excused weeks*, *No weeks excused*) - nicht *waive*,
 * nicht *skip*. Wochen englisch als *Week 38 (w/c 14 Sept)*.
 */
const ERLASS_TEXTE = texte({
  de: {
    keine: "Keine Woche erlassen",
    anzahl: (n: number) => `${n} erlassene Woche${n === 1 ? "" : "n"}`,
    name: (label: string) => `Erlassene Wochen: ${label}`,
    gruppe: "Erlassene Wochen",
    keineMehr: "Keine mehr erlassen",
  },
  en: {
    keine: "No weeks excused",
    anzahl: (n: number) => `${n} excused ${n === 1 ? "week" : "weeks"}`,
    name: (label: string) => `Excused weeks: ${label}`,
    gruppe: "Excused weeks",
    keineMehr: "Excuse none",
  },
  fr: {
    keine: "Aucune semaine dispensée",
    anzahl: (n: number) => `${n} semaine${n === 1 ? "" : "s"} dispensée${n === 1 ? "" : "s"}`,
    name: (label: string) => `Semaines dispensées : ${label}`,
    gruppe: "Semaines dispensées",
    keineMehr: "Ne plus dispenser",
  },
  es: {
    keine: "Ninguna semana eximida",
    anzahl: (n: number) => `${n} ${n === 1 ? "semana eximida" : "semanas eximidas"}`,
    name: (label: string) => `Semanas eximidas: ${label}`,
    gruppe: "Semanas eximidas",
    keineMehr: "Dejar de eximir",
  },
  // ★ O-IT (02.10.2026): „esonerare una settimana" (Glossar §2.6).
  it: {
    keine: "Nessuna settimana esonerata",
    anzahl: (n: number) => `${n} ${n === 1 ? "settimana esonerata" : "settimane esonerate"}`,
    name: (label: string) => `Settimane esonerate: ${label}`,
    gruppe: "Settimane esonerate",
    keineMehr: "Non esonerare più",
  },
  // ★ O-PL (02.10.2026): „zwolnić z celu na tydzień" · „tydzień zwolniony"
  // (Glossar §2.6); das Partizip gehört zur Woche, vier Formen (§2.10a).
  pl: {
    keine: "Brak tygodni zwolnionych z celu",
    anzahl: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} tydzień zwolniony`,
        few: (z) => `${z} tygodnie zwolnione`,
        many: (z) => `${z} tygodni zwolnionych`,
        other: (z) => `${z} tygodnia zwolnionego`,
      }),
    name: (label: string) => `Tygodnie zwolnione z celu: ${label}`,
    gruppe: "Tygodnie zwolnione z celu",
    keineMehr: "Cofnij wszystkie zwolnienia",
  },
  // ★ O-TR (02.10.2026): "haftayı muaf tut" · "muaf" (Glossar §2.6); Zahl nach
  // dem Doppelpunkt, Einzahl; Knopf mit "Kaldır" (Glossar Regel 10).
  tr: {
    keine: "Muaf tutulan hafta yok",
    anzahl: (n: number) => `Muaf tutulan hafta: ${n}`,
    name: (label: string) => `Muaf tutulan haftalar: ${label}`,
    gruppe: "Muaf tutulan haftalar",
    keineMehr: "Tüm muafiyetleri kaldır",
  },
  // ★ O-CS (03.10.2026): „prominout týden" · „prominuté" (Glossar §2.6); Zahl
  // nach dem Doppelpunkt - nichts zu beugen (§2.11); Knopf im Infinitiv (Regel 1).
  cs: {
    keine: "Žádný prominutý týden",
    anzahl: (n: number) => `Prominuté týdny: ${n}`,
    name: (label: string) => `Prominuté týdny: ${label}`,
    gruppe: "Prominuté týdny",
    keineMehr: "Zrušit všechna prominutí",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      keine: "Няма освободени седмици",
      anzahl: (n: number) => `${n} ${n === 1 ? "освободена седмица" : "освободени седмици"}`,
      name: (label: string) => `Освободени седмици: ${label}`,
      gruppe: "Освободени седмици",
      keineMehr: "Без освободени седмици",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      keine: "Καμία εβδομάδα με απαλλαγή",
      anzahl: (n: number) =>
        mehrzahl(n, "el", {
          one: (z) => `${z} εβδομάδα με απαλλαγή`,
          other: (z) => `${z} εβδομάδες με απαλλαγή`,
        }),
      name: (label: string) => `Εβδομάδες με απαλλαγή: ${label}`,
      gruppe: "Εβδομάδες με απαλλαγή",
      keineMehr: "Καμία απαλλαγή",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      keine: "Nincs elengedett hét",
      anzahl: (n: number) => `${n} elengedett hét`,
      name: (label: string) => `Elengedett hetek: ${label}`,
      gruppe: "Elengedett hetek",
      keineMehr: "Egyik hét se legyen elengedve",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      keine: "Geen week vrijgesteld",
      anzahl: (n: number) =>
        mehrzahl(n, "nl", { one: (z) => `${z} vrijgestelde week`, other: (z) => `${z} vrijgestelde weken` }),
      name: (label: string) => `Vrijgestelde weken: ${label}`,
      gruppe: "Vrijgestelde weken",
      keineMehr: "Geen week meer vrijstellen",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      keine: "Nenhuma semana dispensada",
      anzahl: (n: number) => `${n} ${n === 1 ? "semana dispensada" : "semanas dispensadas"}`,
      name: (label: string) => `Semanas dispensadas: ${label}`,
      gruppe: "Semanas dispensadas",
      keineMehr: "Não dispensar nenhuma",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      keine: "Nenhuma semana dispensada",
      anzahl: (n: number) => `${n} ${n === 1 ? "semana dispensada" : "semanas dispensadas"}`,
      name: (label: string) => `Semanas dispensadas: ${label}`,
      gruppe: "Semanas dispensadas",
      keineMehr: "Não dispensar nenhuma",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      keine: "Nicio săptămână scutită",
      anzahl: (n: number) =>
        mehrzahl(n, "ro", {
          one: () => "o săptămână scutită",
          few: (z) => `${z} săptămâni scutite`,
          other: (z) => `${z} de săptămâni scutite`,
        }),
      name: (label: string) => `Săptămâni scutite: ${label}`,
      gruppe: "Săptămâni scutite",
      keineMehr: "Fără scutiri",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      keine: "Ingen vecka undantagen",
      anzahl: (n: number) => `${n} ${n === 1 ? "undantagen vecka" : "undantagna veckor"}`,
      name: (label: string) => `Undantagna veckor: ${label}`,
      gruppe: "Undantagna veckor",
      keineMehr: "Undanta ingen",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      keine: "Немає звільнених тижнів",
      anzahl: (n: number) =>
        mehrzahl(n, "uk", {
          one: (z) => `${z} звільнений тиждень`,
          few: (z) => `${z} звільнені тижні`,
          many: (z) => `${z} звільнених тижнів`,
          other: (z) => `${z} звільненого тижня`,
        }),
      name: (label: string) => `Звільнені тижні: ${label}`,
      gruppe: "Звільнені тижні",
      keineMehr: "Не звільняти жодного тижня",
    },
});

export function ExcusedWeeksSelect({
  value,
  onChange,
  nowMs,
  count = 20,
  id,
  ariaDescribedby,
}: {
  /** Erlassene Wochen (ISO-Schlüssel). Leer = keine erlassen. */
  value: string[];
  onChange: (weeks: string[]) => void;
  nowMs: number;
  count?: number;
  id?: string;
  ariaDescribedby?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { sprache } = useBedienSprache();
  const t = ERLASS_TEXTE[sprache];
  const weeks = listSelectableWeeks(nowMs, count).map((w) => ({
    ...w,
    label: weekLabelJeSprache(w.startMs, sprache),
  }));
  const sel = new Set(value);

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
    const next = new Set(sel);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange([...next].sort());
  };

  const label = value.length === 0 ? t.keine : t.anzahl(value.length);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        className="flex h-9 w-full min-w-[12rem] items-center justify-between gap-2 rounded-lg border border-hairline bg-surface-raised px-3 py-0 text-sm text-ink"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t.name(label)}
        aria-describedby={ariaDescribedby}
      >
        <span className="truncate">
          <span aria-hidden="true">🩹 </span>
          {label}
        </span>
        <span aria-hidden className="text-ink-muted">
          ▾
        </span>
      </button>
      {open && (
        <div
          role="group"
          aria-label={t.gruppe}
          className="absolute z-30 mt-1 max-h-64 w-72 overflow-auto rounded-xl border border-hairline bg-surface-raised p-1 shadow-lg"
        >
          {value.length > 0 && (
            <div className="flex justify-end border-b border-hairline px-2 py-1">
              <button
                type="button"
                className="text-sm text-accent underline"
                onClick={() => onChange([])}
              >
                {t.keineMehr}
              </button>
            </div>
          )}
          {weeks.map((w) => {
            const checked = sel.has(w.key);
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
