/**
 * ★★★ DIE TIPPCHALLENGES EINES KINDES IN ZWEI ZAHLEN - „3 / 82" (10.09.2026).
 *
 * Johannes: *„es braucht eine neue spalte bei der lehreransicht »meine
 * Klassen« - »Tippchallenge« 3 / 82 ... die erste zahl ist die anzahl der
 * challenges und die zweite zahl ist der durchschnittswert der bewertung"*.
 *
 * Reine Rechnung an EINER Stelle: Die Spalte der Lehrkraft, ihre Sortierung
 * und die Statistik des Kindes sehen dieselbe Zahl
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── Welcher Schnitt ─────────────────────────────────────────────────────────
 * Gemittelt wird der LEISTUNGSWERT (0 bis 100) - die Zahl, die Tempo und
 * Treffsicherheit zusammenfasst. Nicht der Rang: Der gilt nur innerhalb einer
 * Runde und sagt über mehrere nichts.
 *
 * ⚠️ Nur GEWERTETE Challenges gehen in den Schnitt. Eine zu kurze Arbeit hat
 * keinen belastbaren Wert und zöge den Schnitt ohne Aussage nach unten - das
 * wäre eine Zahl gegen ein Kind ([[feedback_nie_gegen_das_kind]]). Gezählt
 * (die erste Zahl) wird trotzdem jede.
 *
 * Ganzzahlig gerundet, so wie Johannes die Spalte beschrieben hat.
 */
import {
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_EN,
  PRUEFUNG_WORT_MEHRZAHL,
  PRUEFUNG_WORT_MEHRZAHL_EN,
  PRUEFUNG_WORT_FR,
  PRUEFUNG_WORT_MEHRZAHL_FR,
  PRUEFUNG_WORT_ES,
  PRUEFUNG_WORT_MEHRZAHL_ES,
  PRUEFUNG_WORT_IT,
  PRUEFUNG_WORT_MEHRZAHL_IT,
  PRUEFUNG_WORT_PL,
  PRUEFUNG_WORT_MEHRZAHL_PL,
  PRUEFUNG_WORT_TR,
  PRUEFUNG_WORT_MEHRZAHL_TR,
  PRUEFUNG_WORT_CS,
  PRUEFUNG_WORT_MEHRZAHL_CS,
} from "./schreibprobe";
import type { BedienSprache } from "../bedienSprache/sprache";
import { mehrzahl } from "../bedienSprache/texte";
import type { Probenergebnis } from "./schreibprobeAuswertung";
import { werte, wirksamerZuschlag, type Wertung } from "./schreibprobeWertung";

/**
 * Die {@link Wertung} eines Ergebnisses - notfalls neu gerechnet.
 *
 * `ergebnisAusJson` rechnet sie beim Zurücklesen ohnehin neu, statt dem
 * gespeicherten Datensatz zu glauben: Ändert sich die Formel, sollen ALTE
 * Ergebnisse nach der NEUEN dastehen und nicht zwei Jahrgänge nach zwei
 * Regeln. Hier gilt dasselbe eine Ebene höher - ein Ergebnis, das auf einem
 * anderen Weg hierher kommt und das Feld nicht trägt, bekommt dieselbe
 * Rechnung aus demselben Modul und keine zweite.
 *
 * (Bis 10.09.2026 stand diese Funktion in `SchreibprobeErgebnis.tsx`; seit die
 * Übersicht sie braucht, gehört sie in die Bibliothek. Das Bauteil reicht sie
 * weiter, damit keine Einbindung bricht.)
 */
export function wertungVon(e: Probenergebnis): Wertung {
  // Das Feld ist im Typ Pflicht - aber was von aussen kommt, hält sich nicht an
  // Typen. Darum die Frage, ob es wirklich da ist.
  const gespeichert = (e as Partial<Probenergebnis>).wertung;
  return (
    gespeichert ??
    werte({
      zeichen: e.zeichen,
      fehler: e.fehler,
      anschlaege: e.anschlaege,
      // ⚠️ Genau wie im Rechenwerk: Wo die Wartezeit gemessen wurde, greift der
      // pauschale Zuschlag NICHT - sonst zählte dieselbe Lesezeit zweimal.
      zuschlagProzent: wirksamerZuschlag(e.zuschlagProzent, true, e.wartezeitMs),
      // ★ 23.09.2026 („Freies Schreiben"): dasselbe Fehlergewicht wie überall -
      // fehlt der Modus (streng, der Normalfall), rechnet `werte` wie bisher.
      modus: e.modus,
    })
  );
}

export interface ProbenUebersicht {
  /** Wie viele Tippchallenges geschrieben wurden - jede zählt. */
  anzahl: number;
  /** Wie viele davon lang genug für eine Wertung waren. */
  gewertet: number;
  /** Leistungswert im Schnitt, ganzzahlig - `null`, wenn keine gewertet ist. */
  schnitt: number | null;
}

export function probenUebersicht(liste: readonly Probenergebnis[]): ProbenUebersicht {
  const werteListe = liste
    .map(wertungVon)
    .filter((w) => w.gewertet)
    .map((w) => w.wert);
  const schnitt = werteListe.length
    ? Math.round(werteListe.reduce((s, x) => s + x, 0) / werteListe.length)
    : null;
  return { anzahl: liste.length, gewertet: werteListe.length, schnitt };
}

/**
 * Dieselbe Auskunft als Satz - für die Sprachausgabe hinter „3 / 82" und als
 * Zeile über der Tabelle. Ohne Anrede: Lehrkraft und Kind lesen ihn.
 */
export function uebersichtSatz(u: ProbenUebersicht, sprache: BedienSprache = "de"): string {
  const t = UEBERSICHT_TEXTE[sprache];
  if (u.anzahl === 0) return t.keine;
  // ★ O-PL (02.10.2026): Sprachen mit mehr als zwei Formen zählen selbst.
  const wieviele = t.wieviele
    ? t.wieviele(u.anzahl)
    : u.anzahl === 1 ? `1 ${t.wort}` : `${u.anzahl} ${t.mehrzahl}`;
  return u.schnitt === null ? t.ohneWert(wieviele) : t.mitWert(wieviele, u.schnitt);
}

/**
 * ★ E11a-5 (26.09.2026, Falle 30): eine Tabelle statt `if (sprache === "en")
 * … sonst Deutsch` - Deutsch und Englisch Zeichen für Zeichen die Sätze von
 * vorher. ★ EN3 (19.09.2026): englisch „3 Typing Challenges, average score
 * 82" - in der Tabelle der Challenge genügt *score* (Glossar §3.2).
 * Französisch: „3 Défis, score moyen 82".
 */
const UEBERSICHT_TEXTE: Record<
  BedienSprache,
  {
    keine: string;
    wort: string;
    mehrzahl: string;
    ohneWert: (wieviele: string) => string;
    mitWert: (wieviele: string, schnitt: number) => string;
    /** ★ O-PL: „3 Wyzwania · 5 Wyzwań" - fehlt es, gilt Einzahl/Mehrzahl wie bisher. */
    wieviele?: (n: number) => string;
  }
> = {
  de: {
    keine: `Noch keine ${PRUEFUNG_WORT}`,
    wort: PRUEFUNG_WORT,
    mehrzahl: PRUEFUNG_WORT_MEHRZAHL,
    ohneWert: (w) => `${w}, noch ohne Leistungswert`,
    mitWert: (w, s) => `${w}, Leistungswert im Schnitt ${s}`,
  },
  en: {
    keine: `No ${PRUEFUNG_WORT_EN} yet`,
    wort: PRUEFUNG_WORT_EN,
    mehrzahl: PRUEFUNG_WORT_MEHRZAHL_EN,
    ohneWert: (w) => `${w}, no score yet`,
    mitWert: (w, s) => `${w}, average score ${s}`,
  },
  fr: {
    keine: `Pas encore de ${PRUEFUNG_WORT_FR}`,
    wort: PRUEFUNG_WORT_FR,
    mehrzahl: PRUEFUNG_WORT_MEHRZAHL_FR,
    ohneWert: (w) => `${w}, pas encore de score`,
    mitWert: (w, s) => `${w}, score moyen ${s}`,
  },
  // ★ ES-O (27.09.2026): spanisch, mit dem festen Namen "Reto" (Bauplan S12).
  es: {
    keine: `Todavía ningún ${PRUEFUNG_WORT_ES}`,
    wort: PRUEFUNG_WORT_ES,
    mehrzahl: PRUEFUNG_WORT_MEHRZAHL_ES,
    ohneWert: (w) => `${w}, todavía sin puntuación`,
    mitWert: (w, s) => `${w}, puntuación media ${s}`,
  },
  // ★ O-IT (02.10.2026): „la Sfida" (Glossar §2.3), „punteggio" in der Sfida-Tabelle.
  it: {
    keine: `Ancora nessuna ${PRUEFUNG_WORT_IT}`,
    wort: PRUEFUNG_WORT_IT,
    mehrzahl: PRUEFUNG_WORT_MEHRZAHL_IT,
    ohneWert: (w) => `${w}, ancora senza punteggio`,
    mitWert: (w, s) => `${w}, punteggio medio ${s}`,
  },
  // ★ O-PL (02.10.2026): „Wyzwanie" (Glossar §2.3), „wynik" in der Wyzwanie-
  // Tabelle; die Zahl mit allen vier Formen (Wyzwanie · Wyzwania · Wyzwań).
  pl: {
    keine: "Jeszcze nie ma Wyzwań",
    wort: PRUEFUNG_WORT_PL,
    mehrzahl: PRUEFUNG_WORT_MEHRZAHL_PL,
    ohneWert: (w) => `${w}, jeszcze bez wyniku`,
    mitWert: (w, s) => `${w}, średni wynik: ${s}`,
    wieviele: (n) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} ${PRUEFUNG_WORT_PL}`,
        few: (z) => `${z} ${PRUEFUNG_WORT_MEHRZAHL_PL}`,
        many: (z) => `${z} Wyzwań`,
        other: (z) => `${z} ${PRUEFUNG_WORT_MEHRZAHL_PL}`,
      }),
  },
  // ★ O-TR (02.10.2026): nach der Zahl die Einzahl, klein im Satz ("3 yarışma",
  // Glossar §1 Regel 5); "yarışma puanı" (Glossar §2.2).
  tr: {
    keine: "Henüz yarışma yok",
    wort: PRUEFUNG_WORT_TR,
    mehrzahl: PRUEFUNG_WORT_MEHRZAHL_TR,
    ohneWert: (w) => `${w}, henüz puan yok`,
    mitWert: (w, s) => `${w}, ortalama yarışma puanı: ${s}`,
    wieviele: (n) => `${n} yarışma`,
  },
  // ★ O-CS (03.10.2026): „Výzva" (Glossar §2.3), gross wie ein Name, gezählt mit
  // allen vier Formen (1 Výzva · 2 Výzvy · 5 Výzev, Glossar §2.11); Wert nach
  // Doppelpunkt.
  cs: {
    keine: "Zatím žádná Výzva",
    wort: PRUEFUNG_WORT_CS,
    mehrzahl: PRUEFUNG_WORT_MEHRZAHL_CS,
    ohneWert: (w) => `${w}, zatím bez skóre`,
    mitWert: (w, s) => `${w}, průměrné skóre: ${s}`,
    wieviele: (n) =>
      mehrzahl(n, "cs", {
        one: (z) => `${z} ${PRUEFUNG_WORT_CS}`,
        few: (z) => `${z} ${PRUEFUNG_WORT_MEHRZAHL_CS}`,
        many: (z) => `${z} ${PRUEFUNG_WORT_MEHRZAHL_CS}`,
        other: (z) => `${z} Výzev`,
      }),
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    keine: "Още няма предизвикателства",
    wort: "Предизвикателство",
    mehrzahl: "Предизвикателства",
    ohneWert: (w) => `${w}, още без резултат`,
    mitWert: (w, s) => `${w}, среден резултат: ${s}`,
  },
  el: {
    keine: "Καμία Πρόκληση ακόμα",
    wort: "Πρόκληση",
    mehrzahl: "Προκλήσεις",
    ohneWert: (w) => `${w}, χωρίς σκορ ακόμα`,
    mitWert: (w, s) => `${w}, μέσο σκορ: ${s}`,
  },
  hu: {
    keine: "Még nincs Kihívás",
    wort: "Kihívás",
    mehrzahl: "Kihívások",
    ohneWert: (w) => `${w}, még pontszám nélkül`,
    mitWert: (w, s) => `${w}, átlagos pontszám: ${s}`,
    wieviele: (n) =>
      mehrzahl(n, "hu", {
        one: (z) => `${z} Kihívás`,
        other: (z) => `${z} Kihívás`,
      }),
  },
  nl: {
    keine: "Nog geen Uitdaging",
    wort: "Uitdaging",
    mehrzahl: "Uitdagingen",
    ohneWert: (w) => `${w}, nog zonder score`,
    mitWert: (w, s) => `${w}, gemiddelde score ${s}`,
    wieviele: (n) =>
      mehrzahl(n, "nl", {
        one: (z) => `${z} Uitdaging`,
        other: (z) => `${z} Uitdagingen`,
      }),
  },
  pt: {
    keine: "Ainda sem Desafios",
    wort: "Desafio",
    mehrzahl: "Desafios",
    ohneWert: (w) => `${w}, ainda sem pontuação`,
    mitWert: (w, s) => `${w}, pontuação média: ${s}`,
    wieviele: (n) =>
      mehrzahl(n, "pt", {
        one: (z) => `${z} Desafio`,
        other: (z) => `${z} Desafios`,
        many: (z) => `${z} de Desafios`,
      }),
  },
  br: {
    keine: "Nenhum Desafio ainda",
    wort: "Desafio",
    mehrzahl: "Desafios",
    ohneWert: (w) => `${w}, ainda sem pontuação`,
    mitWert: (w, s) => `${w}, pontuação média: ${s}`,
    wieviele: (n) =>
      n === 0
        ? "Nenhum Desafio"
        : mehrzahl(n, "br", {
            one: (z) => `${z} Desafio`,
            other: (z) => `${z} Desafios`,
          }),
  },
  ro: {
    keine: "Încă nicio Provocare",
    wort: "Provocare",
    mehrzahl: "Provocări",
    ohneWert: (w) => `${w}, încă fără scor`,
    mitWert: (w, s) => `${w}, scor mediu: ${s}`,
    wieviele: (n) =>
      mehrzahl(n, "ro", {
        one: (z) => `${z} Provocare`,
        few: (z) => `${z} Provocări`,
        other: (z) => `${z} de Provocări`,
      }),
  },
  sv: {
    keine: "Ingen Utmaning än",
    wort: "Utmaning",
    mehrzahl: "Utmaningar",
    ohneWert: (w) => `${w}, ännu utan poäng`,
    mitWert: (w, s) => `${w}, genomsnittlig poäng: ${s}`,
    wieviele: (n) =>
      mehrzahl(n, "sv", {
        one: (z) => `${z} Utmaning`,
        other: (z) => `${z} Utmaningar`,
      }),
  },
  uk: {
    keine: "Поки що жодного Виклику",
    wort: "Виклик",
    mehrzahl: "Виклики",
    ohneWert: (w) => `${w}, поки без балів`,
    mitWert: (w, s) => `${w}, середній бал: ${s}`,
    wieviele: (n) =>
      mehrzahl(n, "uk", {
        one: (z) => `${z} Виклик`,
        few: (z) => `${z} Виклики`,
        many: (z) => `${z} Викликів`,
        other: (z) => `${z} Виклику`,
      }),
  },
};

/**
 * Die gewährte Prüfungszeit in Minuten, auf eine Stelle gerundet - mit
 * Zeitzuschlag kann sie krumm sein (8 Minuten und 56 % sind 12,5).
 */
export function minutenVon(e: Probenergebnis): number {
  return Math.round((e.zeitMs / 60_000) * 10) / 10;
}
