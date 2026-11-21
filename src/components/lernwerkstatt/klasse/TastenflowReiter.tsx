/**
 * Reiter „Tastenflow" in „Meine Klassen" (MK-E3).
 *
 * Übernimmt aus dem früheren TypingTeacherDashboard genau die programm-eigenen
 * Teile. ★ Seit dem Umbau vom 11.09.2026 (B8-B11) stehen sie auf ZWEI Ebenen:
 * für die ganze KLASSE Schulstufe (⇒ Textstufe), Sprache samt Sperre,
 * Startniveau und Klassenmatch (Kasten „Einstellungen der Klasse"); je KIND
 * „Womit anfangen?", „Einhand schreiben", „Zeit lassen" (Tempo zählt für
 * dieses Kind nirgends) und das Wochenziel. Dazu die Auswertung je Kind und
 * den Eigenständigkeits-Check. Klasse, Kinder, Passwörter und Co-Lehrkräfte werden
 * nicht mehr hier verwaltet, sondern einmal zentral im Reiter „Klasse & Konten".
 *
 * Grundsatz [[feedback_data_transparency]]: nie mehr, als die Lernenden über
 * sich selbst sehen. Anrede „Sie" (K21).
 *
 * ── „Ziel speichern" ist nicht mehr `disabled` (28.08.2026) ────────────────
 * Regel R5 (FOKUSZIELE-TASTENFLOW.md §0.5): Am Knopf „Ziel speichern" stand
 * `disabled={!dirty}`. Das war der heimtückischste Fall dieser Charge, denn
 * die Sperre schnappte AUSGERECHNET NACH dem Speichern zu: Ist der neue Wert
 * erst übernommen, ist nichts mehr geändert - der Knopf, auf dem der Fokus
 * gerade stand, verschwand also im selben Augenblick aus der Fokus-Ordnung.
 * Wer mit Braillezeile arbeitet, stand danach im Nichts und wusste nicht
 * einmal, ob gespeichert wurde. Jetzt: `aria-disabled`, Sperre im Handler,
 * und wer ohne Änderung drückt, hört warum.
 */
import { altAnzeige, istMacSystem } from "@/lib/altTaste";
import { WAHLTASTE } from "@/lib/typing/wahltaste";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { SpendenBanner } from "@/components/SpendenBanner";
import { spendenBannerImHalbjahr } from "@/lib/spendenbanner";
import {
  TypingAccount,
  computePupilStats,
  currentLevel,
  earnedBadges,
  emptyProgress,
  ensureIntroduced,
  startpunktStand,
  fmtPercent,
  letterMs,
  masteredCount,
  masteryForLevel,
  skinForStufe,
  stufeFuer,
  typingBackend,
  unitLabel,
  unitGlyph,
  naechsteTasten,
  weakestKeys,
  // ★ W3a (18.09.2026): das neue Minuten-Modell (`wochenziel.ts`, W1/W2) -
  // die EINE Übersetzung Speicherform → Rechnung (`kindWochenzielAusFeldern`),
  // die feste Wochengrenze (`WOCHENZIEL_GRENZE`, ersetzt den Klassenrhythmus
  // für die ganze Tabelle) und die Prozent-Anzeige (`prozentAnzeige`).
  kindWochenzielAusFeldern,
  prozentAnzeige,
  WOCHENZIEL_GRENZE,
  // ★ E4 (18.09.2026): dieselben drei für die aufgeklappte Zeile -
  // `aktuelleWocheKey`/`zielFuerWoche` für die Einstellungen-Kennzahl (Ziel
  // der LAUFENDEN Woche), `wochenzielGeschichte` für den Wochenziel-Stand
  // neben jeder Übungswoche.
  aktuelleWocheKey,
  zielFuerWoche,
  wochenzielGeschichte,
  // ★ W3b (18.09.2026): die Lehrkraft-Bedienung selbst - Popup-Text
  // (`zielAenderungsText`), anstehende Änderung, laufende Woche des Kindes,
  // und die beiden Zeitpunkt-Umrechner fürs Popup „ab Montag, DD.MM.".
  zielAenderungsText,
  anstehendeAenderung,
  aktuelleWoche,
  naechsteWocheKey,
  wochenStartFuerSchluessel,
  // „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026) - siehe `zeichenabstand.ts`.
  ZEICHENABSTAND_FAKTOREN,
  // ★ ES-O (27.09.2026): EINE Tabelle je Sprache statt de/en/fr einzeln.
  ZEICHENABSTAND_LABELS_JE_SPRACHE,
  type GesperrteZeit,
  PRUEFUNG_WORT_EN,
  PRUEFUNG_WORT_MEHRZAHL_EN,
  hinweiseChallenge,
  langLabel,
  stufeLabel,
  unitLabelEn,
  unitLabelFr,
  unitLabelEs,
  weekLabelJeSprache,
} from "@/lib/typing";
// ★ B1/B2 (11.09.2026): der Übungs-Score - Leiste, Spalte und Erklärung.
import { scoreAusStats } from "@/lib/typing/score";
// ★ B8/B9: Schulstufe der Klasse ⇒ Alter ⇒ Textstufe (wächst mit).
import {
  SCHULSTUFE_ERWACHSEN,
  aktuelleSchulstufe,
  klassenStufe,
  schuljahrStartjahr,
  schulstufeSchuljahrUmrechnen,
  schulstufeText,
  schulstufeLabelEn,
  schulstufeLabelFr,
  schulstufeLabelEs,
  schulstufeLabelIt,
  schulstufeLabelPl,
  schulstufeLabelTr,
  // ★ O-CS (03.10.2026): der tschechische ročník aus EINER Stelle (vorher stand hier eine eigene Kopie).
  schulstufeLabelCs,
  SCHULSTUFEN_WAHL,
  hatEigeneSchulstufe,
  startAnzeige,
  startpunktMitKlasse,
} from "@/lib/typing/klassenEinstellungen";
// ★ D2 (28.09.2026): der Beginn des Schuljahres je Klasse.
import { MONATE_JE_SPRACHE, schuljahrBeginnVon } from "@/lib/typing/schuljahrBeginn";
// ★ 11.09.2026 (Nacht): Die Felder der Klasse sind EIN Bauteil - dasselbe steht
// beim Anlegen einer Klasse in der Verwaltung (`KlasseUndKinder.tsx`).
import {
  Feld,
  KlassenEinstellungsFelder,
} from "@/components/typing/KlassenEinstellungsFelder";
import { VORGABE_STUFE, klassenUebungsSprache } from "@/lib/typing/account";
// ★ Gezielt üben, Etappe C (13.11.2026): Lehrkraft-Bauteile, Herkunft des Wertes, Texte.
import {
  GezieltKindZeile,
  GezieltMehrfachLeiste,
  GezieltSpalte,
} from "@/components/typing/GezieltLehrkraft";
import { gezieltHerkunft } from "@/lib/typing/gezieltLehrkraft";
import { GEZIELT_LEHRKRAFT_TEXTE } from "@/lib/typing/gezieltTexte";
import type { Gezielt } from "@/lib/typing/gezielt";
import { WACKLIG_MIND_ANSCHLAEGE, prozentText, wackligProzent } from "@/lib/typing/wacklig";
import { mitKlassenVorrang } from "@/components/typing/useTypingAuth";
import { useStatistikSchriftTasten } from "@/lib/typing/statistikSchrift";
import { Modal } from "@/components/Modal";
import {
  PupilData,
  SuspicionChip,
  fmtDauer,
} from "@/components/typing/PupilStatsPanel";
import { BadgeShelf } from "@/components/typing/BadgeShelf";
// ★ E4 (18.09.2026): die aufgeklappte Zeile gruppiert die Übezeit nach
// UNTERRICHTSPERIODE statt nach Kalendertag - eigene, unit-getestete
// Rechnung, siehe `uebungsperioden.ts` (dieselbe Wochengrenze wie das
// Wochenziel, `wochenStartFuerTag`).
import {
  UEBUNGSZEIT_PAUSE_MIN,
  fmtWochentagDatum,
  uebungsperioden,
  type Uebungsart,
  type Uebungssitzung,
} from "@/lib/typing/uebungsperioden";
// ★ M3 (19.09.2026): der Zähler „Hat an 15 Klassenmatches teilgenommen" nennt
// in seinem Hinweis, seit wann gezählt wird - siehe `MATCH_VERLAUF_SEIT_MS`.
import { MATCH_VERLAUF_SEIT_MS } from "@/lib/typing/klassenmatch";
import { fmtTagMonat, fmtTagMonatJahr } from "@/lib/typing/datum";
import { Erklaert } from "@/components/typing/Erklaert";
import { Hinweisflaeche } from "@/components/typing/Zeigerhinweis";
// ★ E9 (19.09.2026): derselbe ISO-Wochenschlüssel wie beim Wochenziel - jede
// Übungsperiode (`uebungsperioden`) beginnt schon am Montag-08:00-Zeitpunkt
// (`WOCHENZIEL_GRENZE`), `isoWeekKey` macht daraus denselben Schlüssel wie
// der Server (`isoWochenKey` in tt_wochenziel_lib.pb.js) - siehe
// `AufgeklappteZeile`, Abschnitt „Übungszeiten".
import { isoWeekKey } from "@/lib/typing/goals";
import { Jahreskarte } from "@/components/typing/Jahreskarte";
// ★ K3 (19.09.2026): der Klassenüberblick über der Tabelle - eigenes Bauteil.
import { Klassenueberblick } from "./Klassenueberblick";
import {
  ZeitraumKopf,
  blaettereZeitraum,
  wochenBlaetternTaste,
} from "@/components/typing/ZeitraumKopf";
import {
  Spaltenkopf,
  type Sortierung,
} from "@/components/typing/Spaltenkopf";
import { Tipp } from "@/components/Tipp";
import { AufklappKnopf } from "@/components/lernwerkstatt/klasse/AufklappKnopf";
import { FilmKnopf } from "@/components/FilmKnopf";
import { Aufklappen } from "@/components/Aufklappen";
import {
  SchreibprobenKennzahl,
  SchreibprobenTabelle,
} from "@/components/typing/SchreibprobenTabelle";
import {
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_FR,
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
  PRUEFUNG_WORT_MEHRZAHL,
  PRUEFUNG_WORT_MEHRZAHL_FR,
  probenUebersicht,
  type Probenergebnis,
} from "@/lib/typing";
import {
  ZEITRAUM_START,
  ZEITRAUM_VORGABE_TABELLE,
  ereignisseIm,
  grenzen,
  ereignisseZwischen,
  vergleichsGrenzen,
  vergleichsName,
  schuljahrIstAlles,
  schuljahrVersetzt,
  wochenBereichKompakt,
  monatBereichKompakt,
  zeitraumTitel,
  type Zeitraum,
} from "@/lib/typing/zeitraum";
import {
  jahreskarte,
  klassenStartwoche,
  schuljahrVon,
  type Bezug,
  type Startwoche,
} from "@/lib/typing/jahreskarte";
import { WeekMultiSelect } from "@/components/typing/WeekMultiSelect";
import { ExcusedWeeksSelect } from "@/components/typing/ExcusedWeeksSelect";
import type { TypingClass } from "@/lib/typing";
import type { PupilStats } from "@/lib/typing/account";
// ★ `LwClassMessageButton` steht seit 11.09.2026 (Nacht) rechts in der Kopfzeile
// des Klassenüberblicks (seit K3 `Klassenueberblick.tsx`) - vorher kurz im
// Klassenkopf von `MeineKlassePage.tsx`.
import {
  LwClassMessageButton,
  LwPupilMessageButton,
} from "@/components/lernwerkstatt/LwTeacherCompose";
import {
  wochenzielHilfe,
  wochenzielImZeitraum,
  type WochenzielStand,
} from "@/lib/typing/wochenzielZeitraum";
import {
  entwicklungImZeitraum,
  entwicklungsGrund,
  entwicklungsGrundKurz,
  spaltenHilfe,
  veraenderung,
  MINDESTZEILEN,
  type Veraenderung,
} from "@/lib/typing/veraenderung";
import { Veraenderungspfeil } from "@/components/typing/Veraenderungspfeil";
import { SchreibprobeKasten } from "./SchreibprobeKasten";
import { EigeneUebungKasten } from "./EigeneUebungKasten";
import { EigenstaendigkeitsMarke } from "./EigenstaendigkeitsMarke";
import {
  EIGENE_UEBUNG_WORT,
  EIGENE_UEBUNG_WORT_EN,
  EIGENE_UEBUNG_WORT_FR,
  EIGENE_UEBUNG_WORT_ES,
  EIGENE_UEBUNG_WORT_IT,
  EIGENE_UEBUNG_WORT_PL,
} from "@/lib/typing/eigenerText";
import { unitLabelIt } from "@/lib/typing/tastenErklaerungIt";
import { unitLabelPl } from "@/lib/typing/tastenErklaerungPl";
import { unitLabelTr } from "@/lib/typing/tastenErklaerungTr";
import { unitLabelCs } from "@/lib/typing/tastenErklaerungCs";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Sprachen aus ihrer eigenen Datei (heute die englischen Namen).
import { unitLabelBg } from "@/lib/typing/tastenErklaerungBg";
import { unitLabelEl } from "@/lib/typing/tastenErklaerungEl";
import { unitLabelHu } from "@/lib/typing/tastenErklaerungHu";
import { unitLabelNl } from "@/lib/typing/tastenErklaerungNl";
import { unitLabelPt } from "@/lib/typing/tastenErklaerungPt";
import { unitLabelBr } from "@/lib/typing/tastenErklaerungBr";
import { unitLabelRo } from "@/lib/typing/tastenErklaerungRo";
import { unitLabelSv } from "@/lib/typing/tastenErklaerungSv";
import { unitLabelUk } from "@/lib/typing/tastenErklaerungUk";
import { itPrepTag } from "@/lib/typing/datum";
// ★ O-IT (02.10.2026): die Startpunkte über `startPunkte` - italienisch beschriftet (letters.ts bleibt unberührt).
import { startPunkte } from "@/lib/typing/startpunkteIt";
// ★ E3 (18.09.2026), seit Z1 (19.09.2026) die REIHE: derselbe Kurzstand, den
// `EigeneUebungKasten` zugeklappt zeigt - für den Stand am Aussen-Schalter der
// Aufgaben-Zeile, ohne ihn zweimal zu rechnen
// ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]). Vorher las diese
// Stelle noch den alten EINZEL-Zeiger (`settings.eigeneUebung`) - der ist nach
// einem Start mit der Reihe leer, und hier stand „nicht zugewiesen".
import { eigeneUebungKurzstand } from "@/lib/typing/eigeneUebungReihe";
// ★ 12.09.2026: der Excel-Export der Leistungstabelle. ★ 13.09.2026: mit
// exceljs neu gestaltet - Übersicht mit Legende, dann Schuljahr, Gesamt, Woche.
import {
  LEISTUNG_BLAETTER,
  leistungDateiname,
  leistungHerunterladen,
  leistungTitel,
  leistungsBlatt,
  type LeistungsBlatt,
} from "@/lib/typing/leistungExport";
// ★ 18.09.2026 (Bauplan E1): „Klasse 3b" - dieselbe Bezeichnung wie in der
// Excel-Datei, damit die Überschrift und die Datei nie auseinanderlaufen.
import { klassenBezeichnung } from "@/lib/typing/excelMarke";
import { Icon } from "@/components/Icon";
// ★ 13.09.2026: Die Hinweise an den Spaltenköpfen stehen seitdem an EINER
// Stelle - die Legende der Excel-Datei nimmt dieselben Sätze.
// ★ EN6a (19.09.2026): in beiden Sprachen über `leistungSpaltenHilfen(sprache)`.
import { leistungSpaltenHilfen } from "@/lib/typing/leistungSpaltenTexte";
// ★ EN6a (19.09.2026): die Bedienungssprache - siehe `REITER_TEXTE` unten.
import { GEBIET, mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { istGeruestSprache } from "@/lib/typing/sprachRegister";
// ★ E1 (24.09.2026): der Lernweg DES KINDES bzw. der Klasse, nie der Lehrkraft.
import { istLernweg, lernwegAus, lernwegVon, type Lernweg } from "@/lib/typing/lernweg";
// ★ W2b (28.09.2026): der Weg je Kind (Feld + Rückfrage, Parken des Standes).
import { WEG_TEXTE, WegJeKind, wegName } from "@/components/typing/WegJeKind";
import { fortschrittImWeg, startpunktImWeg } from "@/lib/typing/wegWechsel";

/** „21 September" - für ganze Sätze („from 8am on Monday 21 September", Glossar §1.2). */
function datumLangEn(ms: number): string {
  return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

/** „21 Sept" - kurz, für Anzeigen (Glossar §1.2). */
function datumKurzEn(ms: number): string {
  return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Montag der NÄCHSTEN Ziel-Woche englisch, „21 September" - dieselbe Rechnung wie {@link naechsterMontagKurz}. */
function naechsterMontagEn(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined ? "" : datumLangEn(ms);
}

/** „60 minutes" / „1 minute". */
function minutenEn(n: number): string {
  return mehrzahl(n, "en", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` });
}

/** „3 pupils" / „1 pupil" - Kind in der Lehrkraft-Sicht (Glossar §3.8, §5 Nr 7). */
function kinderEn(n: number): string {
  return mehrzahl(n, "en", { one: (z) => `${z} pupil`, other: (z) => `${z} pupils` });
}

/** ★ E11a: „21 septembre" - dieselbe Rechnung wie {@link naechsterMontagKurz}/{@link naechsterMontagEn}. */
function datumLangFr(ms: number): string {
  return new Date(ms).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

/** ★ E11a-3: „21 sept." - kurz, für Anzeigen, dieselbe Rechnung wie {@link datumKurzEn}. */
function datumKurzFr(ms: number): string {
  return new Date(ms).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/** Montag der NÄCHSTEN Ziel-Woche französisch. */
function naechsterMontagFr(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined ? "" : datumLangFr(ms);
}

/** ★ ES-O (27.09.2026): „21 de septiembre" - dieselbe Rechnung wie {@link datumLangFr}. */
function datumLangEs(ms: number): string {
  return new Date(ms).toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}

/** ★ ES-O: „21 sept" - kurz, für Anzeigen. */
function datumKurzEs(ms: number): string {
  return new Date(ms).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

/** Montag der NÄCHSTEN Ziel-Woche spanisch. */
function naechsterMontagEs(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined ? "" : datumLangEs(ms);
}

/** „60 minutos" / „1 minuto". */
function minutenEs(n: number): string {
  return mehrzahl(n, "es", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` });
}

/** „3 estudiantes" / „1 estudiante". */
function estudiantesEs(n: number): string {
  return mehrzahl(n, "es", { one: (z) => `${z} estudiante`, other: (z) => `${z} estudiantes` });
}

/** ★ O-IT (02.10.2026): „21 settembre" - dieselbe Rechnung wie {@link datumLangEs}. */
function datumLangIt(ms: number): string {
  return new Date(ms).toLocaleDateString("it-IT", { day: "numeric", month: "long" });
}

/** ★ O-IT: „21 set" - kurz, für Anzeigen. */
function datumKurzIt(ms: number): string {
  return new Date(ms).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

/** Montag der NÄCHSTEN Ziel-Woche italienisch, „21 settembre" (hinter „da lunedì", ohne Artikel). */
function naechsterMontagIt(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined ? "" : datumLangIt(ms);
}

/** „60 minuti" / „1 minuto". */
function minutenIt(n: number): string {
  return mehrzahl(n, "it", { one: (z) => `${z} minuto`, other: (z) => `${z} minuti` });
}

/** „3 alunni" / „1 persona" (Glossar Regel 2). */
function alunniIt(n: number): string {
  return n === 1 ? "1 persona" : `${n} alunni`;
}

/** „dal 14 set" / „dall'8 set" - die Präposition richtet sich nach dem Tag vorn im Datum. */
function dalIt(datum: string, prep: "dal" | "del" = "dal"): string {
  return `${itPrepTag(prep, parseInt(datum, 10))}${datum}`;
}

/** ★ O-PL (02.10.2026): „21 września" - Monat im Genitiv (Intl, Glossar §2.10). */
function datumLangPl(ms: number): string {
  return new Date(ms).toLocaleDateString("pl-PL", { day: "numeric", month: "long" });
}

/** ★ O-PL: „21 wrz" - kurz, für Anzeigen. */
function datumKurzPl(ms: number): string {
  return new Date(ms).toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

/** Montag der NÄCHSTEN Ziel-Woche polnisch, „21 września" (hinter „od poniedziałku"). */
function naechsterMontagPl(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined ? "" : datumLangPl(ms);
}

/** „1 minuta" · „2 minuty" · „60 minut" - Nominativ, alle vier Formen (Glossar §2.10a). */
function minutenPl(n: number): string {
  return mehrzahl(n, "pl", {
    one: (z) => `${z} minuta`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minut`,
    other: (z) => `${z} minuty`,
  });
}

/** „1 osoba" · „2 osoby" · „5 osób" (Glossar Regel 2: Kinder als „osoba"). */
function osobyPl(n: number): string {
  return mehrzahl(n, "pl", {
    one: (z) => `${z} osoba`,
    few: (z) => `${z} osoby`,
    many: (z) => `${z} osób`,
    other: (z) => `${z} osoby`,
  });
}

/** ★ O-TR (02.10.2026): "21 Eyl" - kurz, für Anzeigen (Intl tr-TR, Glossar §2.10). */
function datumKurzTr(ms: number): string {
  return new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

/**
 * ★ O-TR: Montag der NÄCHSTEN Ziel-Woche türkisch, "21 Eylül Pazartesi" -
 * Wochentag NACH dem Datum (Glossar §2.10); steht nach "Başlangıç:" ohne Endung.
 */
function naechsterMontagTr(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
}

/** ★ O-TR: "Kişisel alıştırma" - die Eigene Übung in der Lehrkraft-Sicht (Glossar §2.6). */
const EIGENE_UEBUNG_WORT_TR_LEHRKRAFT = "Kişisel alıştırma";

/** ★ O-CS (03.10.2026): „21. 9." - kurz, für Anzeigen (Intl cs-CZ, Glossar §2.10). */
function datumKurzCs(ms: number): string {
  return new Date(ms).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });
}

/**
 * ★ O-CS: Montag der NÄCHSTEN Ziel-Woche tschechisch, „pondělí 21. září" -
 * Monat im Genitiv, Wochentag klein (Intl, Glossar §2.10, §4 Falle 7); steht
 * hinter „od" (pondělí bleibt im 2. Fall gleich).
 */
function naechsterMontagCs(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long" });
}

/** ★ O-CS: „1 minuta" · „2 minuty" · „5 minut" · „1,5 minuty" - alle vier Formen (Glossar §2.11). */
function minutenCs(n: number): string {
  return mehrzahl(n, "cs", {
    one: (z) => `${z} minuta`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minuty`,
    other: (z) => `${z} minut`,
  });
}

/** ★ O-CS: „1 osoba" · „2 osoby" · „5 osob" (Glossar Regel 2: Kinder als „osoba"). */
function osobyCs(n: number): string {
  return mehrzahl(n, "cs", {
    one: (z) => `${z} osoba`,
    few: (z) => `${z} osoby`,
    many: (z) => `${z} osoby`,
    other: (z) => `${z} osob`,
  });
}

/** ★ O-CS: „Vlastní cvičení" - die Eigene Übung in der Lehrkraft-Sicht (Glossar §2.6). */
const EIGENE_UEBUNG_WORT_CS_LEHRKRAFT = "Vlastní cvičení";

/** „60 minutes" / „1 minute". */
function minutenFr(n: number): string {
  return mehrzahl(n, "fr", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` });
}

/** „3 élèves" / „1 élève". */
function elevesFr(n: number): string {
  return mehrzahl(n, "fr", { one: (z) => `${z} élève`, other: (z) => `${z} élèves` });
}

/** Tippchallenge bulgarisch (Glossar §2.3): Einzahl und Mehrzahl. */
const PRUEFUNG_WORT_BG = "Предизвикателство";
const PRUEFUNG_WORT_MEHRZAHL_BG = "Предизвикателства";

/** Eigene Übung in der Lehrkraft-Sicht (Glossar §2.6). */
const EIGENE_UEBUNG_WORT_BG_LEHRKRAFT = "Собствено упражнение";

/** Montag der NÄCHSTEN Ziel-Woche bulgarisch, „понеделник, 26 октомври" (Intl bg-BG, Monat klein). */
function naechsterMontagBg(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long" });
}

/** „1 минута" · „5 минути" (минута ist weiblich, keine Zählform). */
function minutenBg(n: number): string {
  return mehrzahl(n, "bg", {
    one: (z) => `${z} минута`,
    other: (z) => `${z} минути`,
  });
}

/** „1 ученик" · „5 ученици" (Glossar Regel 2: generische Mehrzahl, Personenwort ohne Zählform). */
function uchenitsiBg(n: number): string {
  return mehrzahl(n, "bg", {
    one: (z) => `${z} ученик`,
    other: (z) => `${z} ученици`,
  });
}

/** Schulstufe bulgarisch: „3. клас" · „Възрастни" (Glossar §2.6, Zählung 1-12 durchgehend). */
function schulstufeLabelBg(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Възрастни";
  return `${stufe}. клас`;
}

/** Tippchallenge griechisch (Glossar §2.3): Einzahl und Mehrzahl, weiblich. */
const PRUEFUNG_WORT_EL = "Πρόκληση";
const PRUEFUNG_WORT_MEHRZAHL_EL = "Προκλήσεις";

/** Eigene Übung in der Lehrkraft-Sicht (Glossar §2.6). */
const EIGENE_UEBUNG_WORT_EL_LEHRKRAFT = "Προσαρμοσμένη άσκηση";

/** Montag der NÄCHSTEN Ziel-Woche griechisch, „Δευτέρα 2 Νοεμβρίου" (Intl el-GR, Monat im Genitiv, groß). */
function naechsterMontagEl(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("el-GR", { weekday: "long", day: "numeric", month: "long" });
}

/** „1 λεπτό" · „5 λεπτά" (Glossar §2.11). */
function minutenEl(n: number): string {
  return mehrzahl(n, "el", {
    one: (z) => `${z} λεπτό`,
    other: (z) => `${z} λεπτά`,
  });
}

/** „1 άτομο" · „5 άτομα" (Glossar Regel 2: sächlich, ungegendert). */
function atomaEl(n: number): string {
  return mehrzahl(n, "el", {
    one: (z) => `${z} άτομο`,
    other: (z) => `${z} άτομα`,
  });
}

/**
 * Schulstufe griechisch (Glossar §2.6): 1-6 Δημοτικό, 7-9 Γυμνάσιο, 10-12 Λύκειο,
 * Buchstabe mit Keraia U+0384 („Γ΄ Δημοτικού"); „Erwachsen" ⇒ „Ενήλικες".
 */
function schulstufeLabelEl(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Ενήλικες";
  const buchstabe = ["Α΄", "Β΄", "Γ΄", "Δ΄", "Ε΄", "ΣΤ΄"];
  if (stufe >= 1 && stufe <= 6) return `${buchstabe[stufe - 1]} Δημοτικού`;
  if (stufe >= 7 && stufe <= 9) return `${buchstabe[stufe - 7]} Γυμνασίου`;
  if (stufe >= 10 && stufe <= 12) return `${buchstabe[stufe - 10]} Λυκείου`;
  return `Τάξη ${stufe}`;
}

/** Tippchallenge ungarisch (Glossar §2.3): Einzahl und Mehrzahl. */
const PRUEFUNG_WORT_HU = "Kihívás";
const PRUEFUNG_WORT_MEHRZAHL_HU = "Kihívások";

/** Eigene Übung in der Lehrkraft-Sicht (Glossar §2.6). */
const EIGENE_UEBUNG_WORT_HU_LEHRKRAFT = "Saját gyakorlat";

/**
 * Montag der NÄCHSTEN Ziel-Woche ungarisch, „október 26., hétfő" (Intl hu-HU).
 * Steht immer nach Doppelpunkt, nie mit Endung (Glossar Regel 12, §4 Falle 7).
 */
function naechsterMontagHu(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("hu-HU", { weekday: "long", day: "numeric", month: "long" });
}

/** „1 perc" · „5 perc" - nach der Zahl Einzahl (Glossar Regel 13). */
function minutenHu(n: number): string {
  return mehrzahl(n, "hu", {
    one: (z) => `${z} perc`,
    other: (z) => `${z} perc`,
  });
}

/** „1 tanuló" · „5 tanuló" - nach der Zahl Einzahl (Glossar Regel 13). */
function tanulokHu(n: number): string {
  return mehrzahl(n, "hu", {
    one: (z) => `${z} tanuló`,
    other: (z) => `${z} tanuló`,
  });
}

/** Schulstufe ungarisch: „3. évfolyam" · „Felnőttek" (Glossar §2.6, Zählung durchgehend). */
function schulstufeLabelHu(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Felnőttek";
  return `${stufe}. évfolyam`;
}

const PRUEFUNG_WORT_NL = "Uitdaging";
const PRUEFUNG_WORT_MEHRZAHL_NL = "Uitdagingen";
const EIGENE_UEBUNG_WORT_LEHRKRAFT_NL = "Eigen oefening";

function naechsterMontagNl(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
}

function minutenNl(n: number): string {
  return mehrzahl(n, "nl", {
    one: (z) => `${z} minuut`,
    other: (z) => `${z} minuten`,
  });
}

function leerlingenNl(n: number): string {
  return mehrzahl(n, "nl", {
    one: (z) => `${z} leerling`,
    other: (z) => `${z} leerlingen`,
  });
}

// NL (groep) und Flandern (leerjaar) zählen verschieden - darum das Alter, wie schulstufeLabelEs.
function schulstufeLabelNl(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "volwassenen";
  return `${stufe + 5}-${stufe + 6} jaar`;
}

const PRUEFUNG_WORT_PT = "Desafio";
const PRUEFUNG_WORT_MEHRZAHL_PT = "Desafios";
const EIGENE_UEBUNG_WORT_LEHRKRAFT_PT = "Exercício personalizado";

function naechsterMontagPt(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" });
}

function minutenPt(n: number): string {
  return mehrzahl(n, "pt", {
    one: (z) => `${z} minuto`,
    other: (z) => `${z} minutos`,
  });
}

function pessoasPt(n: number): string {
  return mehrzahl(n, "pt", {
    one: (z) => `${z} pessoa`,
    other: (z) => `${z} pessoas`,
  });
}

// Ausgeschrieben, weil es als Statusmeldung vorgelesen wird (Glossar Regel 7: kein "3.º" in Ansagen).
const SCHULSTUFEN_PT = [
  "primeiro",
  "segundo",
  "terceiro",
  "quarto",
  "quinto",
  "sexto",
  "sétimo",
  "oitavo",
  "nono",
  "décimo",
  "décimo primeiro",
  "décimo segundo",
  "décimo terceiro",
];

function schulstufeLabelPt(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "pessoas adultas";
  const wort = SCHULSTUFEN_PT[stufe - 1];
  return wort === undefined ? `ano ${stufe}` : `${wort} ano`;
}

// Wort für die Tippchallenge und die Eigene Übung (Glossar pt-BR).
const PRUEFUNG_WORT_BR = "Desafio";
const PRUEFUNG_WORT_MEHRZAHL_BR = "Desafios";
const EIGENE_UEBUNG_WORT_BR_LEHRKRAFT = "Exercício personalizado";

function naechsterMontagBr(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}

// Null nie über mehrzahl (Glossar Regel 13: pt-BR zählt 0 als one).
function minutenBr(n: number): string {
  if (n === 0) return "0 min";
  return mehrzahl(n, "br", {
    one: (z) => `${z} minuto`,
    other: (z) => `${z} minutos`,
  });
}

function pessoasBr(n: number): string {
  if (n === 0) return "nenhuma pessoa";
  return mehrzahl(n, "br", {
    one: (z) => `${z} pessoa`,
    other: (z) => `${z} pessoas`,
  });
}

// Glossar §2.6: 1-9 ensino fundamental, danach ensino médio; º = U+00BA.
function schulstufeLabelBr(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Pessoas adultas";
  if (stufe <= 9) return `${stufe}º ano do ensino fundamental`;
  return `${stufe - 9}º ano do ensino médio`;
}

// Rumänische Helfer für die Klassen-Ansicht (Glossar §2.3, §2.6, §2.11, Regel 5).
const PRUEFUNG_WORT_RO = "Provocare";
const PRUEFUNG_WORT_MEHRZAHL_RO = "Provocări";
const EIGENE_UEBUNG_LEHRKRAFT_WORT_RO = "Exercițiu propriu";

function naechsterMontagRo(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" });
}

// „un minut" · „2 minute" · „20 de minute"
function minutenRo(n: number): string {
  return mehrzahl(n, "ro", {
    one: () => "un minut",
    few: (z) => `${z} minute`,
    other: (z) => `${z} de minute`,
  });
}

// „o persoană" · „2 persoane" · „20 de persoane"
function persoaneRo(n: number): string {
  return mehrzahl(n, "ro", {
    one: () => "o persoană",
    few: (z) => `${z} persoane`,
    other: (z) => `${z} de persoane`,
  });
}

// „clasa I" · „clasa a III-a" · „Adulți" (Glossar §2.6); was keine Schulstufe 1-13 ist, gilt als Erwachsen.
function schulstufeLabelRo(stufe: number): string {
  const roemisch = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"][stufe - 1];
  if (!roemisch) return "Adulți";
  return stufe === 1 ? "clasa I" : `clasa a ${roemisch}-a`;
}

/** Tippchallenge schwedisch (Glossar §2.3): als Name immer gross. */
const PRUEFUNG_WORT_SV = "Utmaningen";
const PRUEFUNG_WORT_MEHRZAHL_SV = "Utmaningar";

/** Eigene Übung in der Lehrkraft-Sicht (Glossar §2.6). */
const EIGENE_UEBUNG_WORT_LEHRKRAFT_SV = "Egna övningar";

/** Montag der NÄCHSTEN Ziel-Woche schwedisch, „måndag 2 november" (Intl sv-SE, klein). */
function naechsterMontagSv(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });
}

/** „1 minut" · „5 minuter" (Glossar §2.11). */
function minutenSv(n: number): string {
  return mehrzahl(n, "sv", {
    one: (z) => `${z} minut`,
    other: (z) => `${z} minuter`,
  });
}

/** „1 elev" · „5 elever" (Glossar §2.11). */
function eleverSv(n: number): string {
  return mehrzahl(n, "sv", {
    one: (z) => `${z} elev`,
    other: (z) => `${z} elever`,
  });
}

/** Schulstufe schwedisch: „årskurs 3" · „gymnasiet år 1" · „Vuxna" (Glossar §2.6). */
function schulstufeLabelSv(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Vuxna";
  if (stufe <= 9) return `årskurs ${stufe}`;
  return `gymnasiet år ${stufe - 9}`;
}

// Ukrainische Wörter und Helfer für REITER_TEXTE (Glossar §2.2, §2.3, §2.6, §2.11).
const PRUEFUNG_WORT_UK = "Виклик";
const PRUEFUNG_WORT_MEHRZAHL_UK = "Виклики";
const EIGENE_UEBUNG_LEHRKRAFT_UK = "Власна вправа";

// Montag der nächsten Ziel-Woche: "21 вересня" - Monat im Genitiv, ohne "р.". Der Wochentag steht im Satz.
function naechsterMontagUk(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
}

function minutenUk(n: number): string {
  return mehrzahl(n, "uk", {
    one: (z) => `${z} хвилина`,
    few: (z) => `${z} хвилини`,
    many: (z) => `${z} хвилин`,
    other: (z) => `${z} хвилини`,
  });
}

function ditiUk(n: number): string {
  return mehrzahl(n, "uk", {
    one: (z) => `${z} дитина`,
    few: (z) => `${z} дитини`,
    many: (z) => `${z} дітей`,
    other: (z) => `${z} дитини`,
  });
}

// Schulstufe: "3 клас" (Kardinalzahl, Glossar §2.6), Erwachsene "дорослі".
function schulstufeAnzeigeUk(stufe: number): string {
  return stufe === SCHULSTUFE_ERWACHSEN ? "дорослі" : `${stufe} клас`;
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ EN6a (19.09.2026): DIE TEXTE DER KLASSEN-ANSICHT IN BEIDEN SPRACHEN
 * ════════════════════════════════════════════════════════════════════════════
 * Deutsch Zeichen für Zeichen wie vorher (auch die Aufteilung in Textknoten:
 * Wo JSX Stücke nebeneinander schrieb, steht hier ein `Teil[]`). Englisch nach
 * dem Glossar: §3.3 Wochenziel (*weekly goal*, *goal weeks*, *catch up*,
 * *excuse weeks*, *Clear overdue minutes*, „Stunde sperren" ⇒ *Pause goal for
 * 1 hour* - nie *lock*), §3.8 Lehrkraft-Bereich (*pupil*, *Class settings*,
 * *Custom exercise*), §3.2 Zahlen (*difficulty level*, *accuracy*,
 * *keystrokes*, *practice time*), §3.15 die Knopfnamen, die das Handbuch
 * zitiert. Die Lehrkraft liest plain *you*, ohne Ausrufezeichen (§1.2, §1.5).
 */
export const REITER_TEXTE = texte({
  de: {
    // ── Rückfragen zum Wochenziel ───────────────────────────────────────
    zielNeu: (minuten: number, jetztMs: number) => zielAenderungsText(minuten, jetztMs),
    keinZielMehr: (jetztMs: number) =>
      `Ab Montag, ${naechsterMontagKurz(jetztMs)}, 8:00 Uhr gilt kein Wochenziel mehr. ` +
      `Bis dahin gilt das bisherige Ziel.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const kinderSatz =
        anzahlKinder === 1
          ? minuten > 0
            ? `Das eine Kind bekommt ${minuten} Minuten pro Woche.`
            : "Das eine Kind bekommt kein Wochenziel mehr."
          : minuten > 0
            ? `Alle ${anzahlKinder} Kinder bekommen ${minuten} Minuten pro Woche.`
            : `Alle ${anzahlKinder} Kinder bekommen kein Wochenziel mehr.`;
      return (
        `${kinderSatz} Das gilt ab Montag, ${naechsterMontagKurz(jetztMs)}, 8:00 Uhr - bis dahin ` +
        `bleibt das bisherige Ziel. Einzeln eingestellte Ziele werden dabei überschrieben. Kinder, ` +
        `die später dazukommen, bekommen dieses Ziel auch.`
      );
    },
    // ── Wochenziel eines Kindes (GoalEditor) ────────────────────────────
    wochenziel: "Wochenziel",
    minutenProWoche: "Minuten pro Woche",
    nullKeinZiel: "0 = kein Wochenziel.",
    zielKalenderwochen: "Ziel-Kalenderwochen",
    speichernTipp: (name: string) =>
      `Speichert Minuten, Kalenderwochen und Nachholen zusammen für ${name} - erst nach einer Rückfrage. Die Änderung gilt ab der nächsten Woche.`,
    nichtsGeaendert: "Am Wochenziel ist nichts geändert - es ist schon gespeichert.",
    speichern: "Speichern",
    nachholenTipp:
      "Überschüssig geübte Minuten füllen offene Wochenziele früherer Wochen auf - die älteste zuerst.",
    // ★ L5 (19.09.2026, Johannes): „statt ‚Verpasste Minuten nachholen' soll
    //   das stehen: ‚Verpasste Minuten der vergangenen Wochen nachholen'".
    nachholen: "Verpasste Minuten der vergangenen Wochen nachholen",
    dieseWoche: "Diese Woche:",
    min: "Min.",
    keinWochenziel: "kein Wochenziel",
    anstehend: (datum: string, minuten: number) => [" · ab Mo ", datum, ": ", minuten, " Min."],
    ueberfaelligTipp:
      "Setzt den Rückstand aus früheren Wochen auf null - ab dieser Woche zählt das Wochenziel neu. Die geübte Zeit bleibt erhalten.",
    ueberfaelligZuruecksetzen: "Überfällige zurücksetzen",
    zuletztZurueckgesetzt: (ab: string) => ["zuletzt zurückgesetzt ab ", ab],
    erlassenTipp:
      "Die gewählten Wochen zählen nie als versäumt oder nachzuholen - unabhängig davon, ob dort ein Ziel-Wochen-Häkchen steht. Die geübte Zeit bleibt erhalten.",
    wochenzielErlassen: "Wochenziel erlassen",
    wochenzielFuer: (name: string) => `Wochenziel für ${name}`,
    uebernehmen: "Übernehmen",
    abbrechen: "Abbrechen",
    // ── Einstellungen je Kind (PupilEinstellungen) ──────────────────────
    einstellungen: "Einstellungen",
    womitAnfangen: "Womit anfangen?",
    womitTipp:
      "was das Kind schon kann - eine niedrigere Stufe stuft zurück (mit Rückfrage), Statistik und Abzeichen bleiben.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `${name} steht bei „${label}".\n\n` +
      `Wirklich auf „${ziel}" zurückstufen?\n\n` +
      `Geübt wird danach wieder bis dorthin. Anschlag-Statistik, ` +
      `Übezeit und Abzeichen bleiben erhalten - wer später wieder ` +
      `hochstellt, findet sie unverändert vor.\n\n` +
      `Wirksam, sobald ${name} Tastenflow das nächste Mal öffnet.`,
    womitName: (name: string) => `Womit ${name} anfängt`,
    ausstehend: (name: string) => ["Wird wirksam, sobald ", name, " Tastenflow das nächste Mal öffnet."],
    einhandTipp:
      "Großbuchstaben und Sonderzeichen werden mit beliebiger Umschalttaste (oder der Feststelltaste) angenommen - die Umschalt-Gegenhand-Regel ist für dieses Kind aus.",
    einhandName: (name: string) => `Einhand schreiben für ${name}: Umschalt-Gegenhand-Regel aus`,
    einhand: "Einhand schreiben",
    tempoTipp:
      "Für dieses Kind zählt die Geschwindigkeit nirgends - kein Zeitfenster im Spiel, kein Tempo-Ziel bei den Sternen, kein Auf- und Abstieg der Leistungsstufe, und die Übezeit läuft auch bei langen Pausen weiter. Für Kinder, die sorgfältig, aber sehr langsam tippen.",
    tempoName: (name: string) =>
      `Tempo zählt nicht für ${name}: Geschwindigkeit wird nirgends bewertet`,
    tempoZaehltNicht: "Tempo zählt nicht",
    abstand: "Zeichenabstand groß (CVI)",
    abstandTipp: `Grösserer Abstand zwischen JEDEM Zeichen beim Abschreiben - für Kinder mit zerebraler Sehbehinderung (CVI), bei denen eng stehende Zeichen ineinanderlaufen. „Doppelt" nimmt die doppelte, „dreifach" die dreifache, „vierfach" die vierfache Laufweite je Zeichen. Beim Schreiben wird alles außer dem Feld abgedunkelt, in dem gerade geschrieben wird (Übungszeile oder Spielfeld); nach 5 Sekunden ohne Tippen wird es wieder hell. Die Übungszeile gleitet dabei im Schreibtakt des Kindes zum nächsten Zeichen - langsam, wenn es langsam schreibt - statt zu springen. „Einfach" lässt die Zeichen im gewohnten Abstand stehen und schaltet nur die Verdunkelung, das Gleiten der Zeile und die Lesezeile ein. Das Kind kann den Abstand auch selbst in seinen Einstellungen (Zahnrad, Alt + O) ändern, so oft es will - und Sie jederzeit wieder hier. Es gilt, was zuletzt gewählt wurde.`,
    // ★ 25.09.2026 (Johannes): eigene Schulstufe je Kind.
    schulstufeKind: "Schulstufe",
    schulstufeKindName: (name: string) => `Schulstufe von ${name}`,
    wieDieKlasse: (klasse: string) => `wie die Klasse (${klasse})`,
    schulstufeKindTipp:
      "Nur für dieses Kind: Die Schulstufe bestimmt, welche Texte es bekommt, und gilt statt der Schulstufe der Klasse. Sie wächst jedes Schuljahr mit. „Wie die Klasse“ nimmt die Ausnahme wieder zurück.",
    schulstufeKindGesetzt: (name: string, stufe: string) =>
      `${name} bekommt jetzt Texte für die ${stufe}.`,
    schulstufeKindErwachsen: (name: string) => `${name} bekommt jetzt Texte für Erwachsene.`,
    schulstufeKindWieKlasse: (name: string) =>
      `${name} bekommt wieder die Texte der Klasse.`,
    abstandName: (name: string) => `Zeichenabstand groß (CVI) für ${name}`,
    // ── Die Tabelle ─────────────────────────────────────────────────────
    /**
     * Die Beschriftung der Tabelle. Eine Sprachausgabe kündigt sie damit an,
     * noch bevor die erste Zeile gelesen wird.
     */
    listenTitel: "Lernende der Klasse mit Leistungsstand und Wochenziel",
    tastenSr: (sitzen: number, frei: number) => [
      sitzen,
      " von ",
      frei,
      " freigeschalteten Tasten sitzen",
    ],
    bezugBlock: (datum: string) => `den 4 Übungswochen ab ${datum}`,
    bezugWoche: (datum: string) => `der Woche ab ${datum}`,
    gruppePerson: "Person",
    gruppeStand: "Stand und Übezeit",
    gruppeUeben: "Üben",
    gruppePruefung: "Prüfung",
    kopfName: "Name",
    kopfStufe: "Leistungsstufe",
    kopfTasten: "Tasten",
    // ★ 25.09.2026 (Testerin): die nächsten zwei Tasten je Kind.
    kopfNaechste: "Nächste Tasten",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "alle Tasten gelernt" : `als Nächstes ${namen.join(", dann ")}`,
    kopfUebezeit: "Übezeit",
    kopfWochenziel: "Wochenziel",
    kopfWochenziele: "Wochenziele",
    kopfTreffer: "Treffsicherheit",
    kopfTempo: "Anschl./Min",
    kopfScore: "Score",
    // ── Die aufgeklappte Zeile ──────────────────────────────────────────
    uebungszeiten: "Übungszeiten",
    nochKeineUebung: "noch keine Übung erfasst",
    uebungszeitenKennzahl: (dauer: string, wochen: number) =>
      `${dauer} · ${wochen} Woche${wochen === 1 ? "" : "n"}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " ·",
      " ",
      dauer,
      " · an ",
      tage,
      " Tag",
      tage === 1 ? "" : "en",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` · ${erfuellt} von ${ziel} Min.`,
    periodeMatches: (n: number) => ` · ${n} Klassenmatch${n === 1 ? "" : "es"}`,
    // ── ★ M3 (19.09.2026): Zähler + einzelne Übungszeiten je Woche ──────
    // ★ Klassenmatch-Zähler (21.09.2026, Johannes: „nicht wer gewonnen hat,
    //   sondern wer wie viele Klassenmatch beendet hat, also wirklich
    //   durchgespielt hat - abgebrochene zählen nicht"): gezählt wird, wer bis
    //   zum Ende mitgespielt hat. Dieselbe Zahl steht in der Tabellenspalte.
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Hat noch kein Klassenmatch bis zum Ende gespielt"
        : `Hat ${n} Klassenmatch${n === 1 ? "" : "es"} bis zum Ende gespielt`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Gezählt wird jedes Klassenmatch in dieser Klasse, bei dem ${name} bis zum Ende ` +
      `mitgespielt hat - seit dem ${seit}, davor wurden Klassenmatches nicht aufgezeichnet. ` +
      `Abgebrochene Matches und vorzeitig verlassene zählen nicht. Ein Match zählt etwa ` +
      `eine Stunde nach seinem Ende mit. Nur die Anzahl: kein Ranking, und wer gewonnen ` +
      `hat, wird nicht gezählt.`,
    // ★ Die Spalte „Klassenmatch" in der Klassentabelle (Kopf, Gruppe, Hinweis).
    kopfKlassenmatch: "Klassenmatch",
    klassenmatchOhneZahl: "Klassenmatch: keine Angabe",
    gruppeKlassenmatch: "Klassenmatch",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Wie viele Klassenmatches das Kind bis zum Ende mitgespielt hat. Abgebrochene ` +
      `Matches und vorzeitig verlassene zählen nicht; wer gewonnen hat, wird nicht ` +
      `gezählt. Aufgezeichnet seit dem ${seit}. Ein Strich heißt: Das Klassenmatch ` +
      `ist für diese Klasse abgeschaltet oder die Anzahl konnte nicht geladen werden.`,
    wocheHilfe: (pauseMin: number) =>
      `Aufgeklappt steht jede einzelne Übungszeit dieser Woche da: Tag, Uhrzeit von-bis, ` +
      `die geübte Zeit und was geübt wurde. Geübte Zeit heißt reine Tippzeit - Pausen ` +
      `zählen nicht, darum ist sie oft kürzer als von-bis. Nach mehr als ${pauseMin} ` +
      `Minuten ohne Tippen beginnt eine neue Übungszeit.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} · ${dauer}` : `${tag}, ${von}-${bis} · ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Mein Training",
        lektion: "Lektionen",
        geschichte: "Geschichten",
        wortspiel: "Wortspiele",
        tippchallenge: PRUEFUNG_WORT,
        klassenmatch: "Klassenmatch",
        "eigene-uebung": EIGENE_UEBUNG_WORT,
      })[art],
    wackligeTasten: "Wacklige Tasten",
    nochZuWenigGeuebt: "noch zu wenig geübt",
    zuWenigUmZuSagen: "Noch zu wenig geübt, um das zu sagen.",
    wackligCaption: (name: string) => ["Wacklige Tasten von ", name],
    tasteKopf: "Taste",
    // ★ D-4/D-5 (28.09.2026): Mindestzahl und Schwelle aus wacklig.ts - die
    // Schwelle dieses Kindes (Weg und Stufe), nicht eine feste Zahl.
    tasteHilfe: (prozent: number) =>
      `Eine Taste, die noch nicht sicher sitzt - mindestens ${WACKLIG_MIND_ANSCHLAEGE}-mal dran, dabei unter ${prozentText(prozent, "de")} getroffen.`,
    trefferKopf: "Treffsicherheit",
    trefferHilfe: "Wie oft diese Taste seither getroffen wurde.",
    tempoKopf: "Tempo",
    tempoHilfe: "Wie schnell diese eine Taste zuletzt kam - Anschläge dieser Taste je Minute.",
    abzeichen: (n: number) => ["Abzeichen - ", n],
    tippchallenges: (n: number) => ["Tippchallenges - ", n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL} von ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Einstellungen für ",
      name,
      " - ",
      label,
      " ·",
      " ",
      zielMin > 0 ? `Wochenziel ${zielMin} Min.` : "kein Wochenziel",
    ],
    eigenstaendigkeit: (n: number) => ["Eigenständigkeit -", " ", n, " Hinweis", n === 1 ? "" : "e"],
    knopfTipp: (name: string) =>
      `Einstellungen und Auswertung von ${name} - Einstellungen, Übungszeiten, wacklige Tasten und Abzeichen; alles Weitere in „Meine Statistik" von ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `Einstellungen und Auswertung von ${name} ${offen ? "einklappen" : "ausklappen"}`,
    // ── Der Wochenziel-Stand in der Zelle ───────────────────────────────
    keinZielGesetzt: "kein Wochenziel gesetzt",
    keineAbgeschlossene: "noch keine abgeschlossene Ziel-Woche",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      prozent,
      " Prozent der Wochenaufgaben erledigt, in ",
      ganz,
      " von",
      " ",
      gesamt,
      " Wochen ganz",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["in ", ganz, "/", gesamt, " Wochen ganz"],
    wocheErlassen: "diese Woche wurde erlassen",
    keineZielwoche: "keine Ziel-Woche",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " Min."],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " von ", nenner, " Minuten"],
    offenSr: (minuten: number) => `, davon ${minuten} Minuten offen aus früheren Wochen`,
    erreichtSr: ", Wochenziel erreicht",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " Min. Vorwochen"],
    // ── Einstellungen der Klasse ────────────────────────────────────────
    klasseNichtGespeichert: "Die Einstellung der Klasse konnte nicht gespeichert werden.",
    kinderEingetragen: (n: number) =>
      ` Für ${n} ${n === 1 ? "Kind" : "Kinder"} eingetragen - ` +
      `wirksam, sobald Tastenflow das nächste Mal geöffnet wird. Statistik und Abzeichen bleiben.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Startniveau „${label}" gilt jetzt für die Klasse - auch für Kinder, die später beitreten.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Die Vorgabe der Klasse konnte nicht gespeichert werden.${kinderSatz}`,
    gesperrtZusatz: " (gesperrt)",
    stufeWaehlen: "Stufe wählen",
    vorgabeKlasse: (label: string) => `Vorgabe der Klasse: „${label}"`,
    dieMeisten: (label: string) => `die meisten stehen bei „${label}"`,
    bezugKlasse: (name: string) => `der Klasse ${name}`,
    startHinweis:
      "was die Klasse schon kann - gilt für alle Kinder dieser Klasse, auch für die, die später beitreten",
    startSrHinweis:
      "Der erste Eintrag nennt die Vorgabe der Klasse und die Stufe, auf der die meisten Kinder gerade stehen. " +
      "Wer eine Stufe wählt, speichert sie als Vorgabe der Klasse - sie gilt auch für Kinder, die später beitreten - " +
      "und trägt sie für die vorhandenen Kinder ein; sind welche schon weiter, fragt die App vorher nach. " +
      "Wirksam, sobald ein Kind Tastenflow das nächste Mal öffnet; Statistik und Abzeichen bleiben.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Schulstufe entfernt. Es gilt wieder die Vorgabe ${vorgabe}.`,
    schulstufeErwachsen: (label: string) =>
      `Schulstufe Erwachsen. Die Texte passen jetzt für Erwachsene (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Schulstufe ${wert}. Die Texte passen jetzt zum Alter ` + `${label}.`,
    spracheDerKlasse: (sprache: string) => `Sprache der Klasse: ${sprache}.`,
    spracheGesperrt: "Die Sprache ist für die Kinder dieser Klasse gesperrt.",
    spracheFrei: "Die Sprache ist wieder frei wählbar.",
    matchNichtUmgestellt: "Das Klassenmatch konnte nicht umgestellt werden.",
    matchErlaubt: "Das Klassenmatch ist für diese Klasse erlaubt.",
    matchAus: "Das Klassenmatch ist für diese Klasse abgeschaltet.",
    // ★ Zeilenende mit Enter (23.09.2026).
    zeilenEndeAn:
      "Jede Zeile wird jetzt mit der Eingabetaste abgeschlossen - für alle Kinder dieser Klasse.",
    zeilenEndeAus: "Das Zeilenende mit Enter ist für diese Klasse abgeschaltet.",
    // ★ D2 (28.09.2026): der Beginn des Schuljahres.
    schuljahrBeginnGesetzt: (monat: string) =>
      `Das Schuljahr dieser Klasse beginnt jetzt am 1. ${monat}.`,
    // ★ E9 (24.09.2026, Bauplan §8.2).
    schreibweiseGesetzt: (label: string) => `Schreibweise: ${label} - für alle Kinder dieser Klasse.`,
    schreibweiseAutoLabel: "automatisch",
    schreibweiseGbLabel: "britisch",
    schreibweiseUsLabel: "amerikanisch",
    startFrageTitel: "Startniveau für die ganze Klasse",
    frageVor: (n: number) => ["In Ihrer Klasse ", n === 1 ? "ist" : "sind", " "],
    frageStark: (n: number) => [n, " ", n === 1 ? "Kind" : "Kinder"],
    frageNach: (_n: number) => [
      " ",
      "schon weiter als die eingestellte Stufe. Soll die ganze Klasse wirklich auf dieses Niveau eingestuft werden?",
    ],
    detailVor: "Gewählt: ",
    detailNach: (namen: string) => [
      ". Schon weiter:",
      " ",
      namen,
      ". Ein Kind zurückzustufen nimmt ihm Übungsstoff, den es schon hat - Anschlag-Statistik, Übezeit und Abzeichen bleiben in jedem Fall erhalten. Wirksam, sobald ein Kind Tastenflow das nächste Mal öffnet.",
    ],
    alleEinstufen: "Alle einstufen",
    nurNochNicht: "Nur die, die noch nicht so weit sind",
    // ── Rückmeldungen der Ansicht ───────────────────────────────────────
    startZurueck: (name: string, label: string) =>
      `${name} wird auf „${label}" zurückgestuft - wirksam beim nächsten Öffnen. ` +
      `Statistik und Abzeichen bleiben.`,
    startpunktVon: (name: string, label: string) => `Startpunkt von ${name}: „${label}".`,
    wochenzielNichtGespeichert: (name: string) =>
      `Das Wochenziel von ${name} konnte nicht gespeichert werden.`,
    wochenzielGespeichert: (name: string) => `Wochenziel von ${name} gespeichert.`,
    ueberfaelligFrage: (name: string) =>
      `Überfällige Wochenziel-Einheiten von ${name} zurücksetzen?\n\n` +
      `Der bis jetzt aufgelaufene Rückstand wird gestrichen; ab dieser Woche zählt ` +
      `das Wochenziel wieder frisch. Bereits geübte Zeit und die Statistik bleiben erhalten.`,
    ueberfaelligErledigt: (name: string) => `Überfällige Einheiten von ${name} zurückgesetzt.`,
    erlasseneGespeichert: "Erlassene Wochen gespeichert.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Wochenziel (${minuten} Minuten)` : "Kein Wochenziel mehr"} für ${ok} von ${gesamt} Lernenden gespeichert - gilt ab Montag, ` +
      `${naechsterMontagKurz(jetztMs)}, 8:00 Uhr.`,
    klassenZielFehler: (namen: string) =>
      ` Bei ${namen} hat es nicht geklappt - bitte erneut versuchen.`,
    sperreNichtAufgehoben: "Die Sperre konnte nicht aufgehoben werden.",
    sperreAufgehoben:
      "Die Sperre ist aufgehoben - geübte Zeit zählt ab sofort wieder fürs Wochenziel.",
    stundeNichtGesperrt: "Die Stunde konnte nicht gesperrt werden.",
    gesperrtBisStatus: (zeit: string) =>
      `Wochenziel für die Klasse gesperrt bis ${zeit} - ` +
      `Übezeit und Statistik zählen weiter, nur nicht das Wochenziel.`,
    stundeGesperrt: "Die Stunde ist gesperrt.",
    excelLaeuft: "Die Excel-Datei wird gerade erstellt - einen Augenblick bitte.",
    excelFertig: (datei: string) =>
      `„${datei}“ heruntergeladen - mit einer Übersicht samt Legende und vier Blättern: Schuljahr, Gesamt, Monat und Woche.`,
    excelFehler:
      "Die Excel-Datei konnte nicht erstellt werden. Bitte versuchen Sie es " +
      "noch einmal; bleibt es so, melden Sie es bitte.",
    laedt: "Lädt …",
    lesefehlerStark: "Der Stand konnte nicht gelesen werden",
    lesefehlerFuer: (namen: string) => [
      " für",
      " ",
      namen,
      ". Die Zahlen in diesen Zeilen sind deshalb leer und bedeuten ",
    ],
    lesefehlerNicht: "nicht",
    lesefehlerSchluss:
      ", dass nicht geübt wurde. Bitte laden Sie die Seite neu; bleibt es so, melden Sie es bitte.",
    // ── Die Aufgaben-Zeile ──────────────────────────────────────────────
    aufgabenGruppe: "Aufgaben für die Klasse",
    tippchallengeTipp:
      "Öffnet die Prüfung für die ganze Klasse: Text und Zeit festlegen - danach hier auch die Ergebnisse.",
    tippchallenge: PRUEFUNG_WORT,
    eigeneUebungTipp:
      "Weist der Klasse eine hochgeladene Datei als Pflichttext zu - jedes Kind übt sie in seinem eigenen Tempo, keine neue Taste wird dadurch freigeschaltet.",
    eigeneUebung: EIGENE_UEBUNG_WORT,
    wochenzielTipp:
      "Stellt ein, wie viele Minuten die Klasse in der Woche üben soll - für jedes Kind einzeln oder für alle auf einmal.",
    zielStatusMin: (minuten: string) => `${minuten} Min.`,
    zielGesetzt: "gesetzt",
    keinZiel: "kein Ziel",
    einstellungenTipp:
      "Schulstufe, Sprache, Startniveau und Klassenmatch für die ganze Klasse einstellen.",
    einstellungenDerKlasse: "Einstellungen der Klasse",
    sperreBeendenTipp:
      "Beendet die Sperre sofort - ab dann zählt geübte Zeit wieder fürs Wochenziel.",
    sperrenTipp:
      "Sperrt das Wochenziel für 60 Minuten, für die ganze Klasse. Geübt wird trotzdem - Übezeit und Statistik zählen weiter, nur nicht das Wochenziel.",
    gesperrtBisKnopf: (zeit: string) => `Gesperrt bis ${zeit} - aufheben`,
    stundeSperren: "Stunde sperren",
    // ── „Wochenziel - Aufgabe" ──────────────────────────────────────────
    wochenzielAufgabe: "Wochenziel - Aufgabe",
    zielFuerKlasseGesetzt: "· für Kinder dieser Klasse gesetzt",
    nochKeinZielGesetzt: "· noch kein Ziel gesetzt",
    minutenZuerst: "Minuten pro Woche zuerst eintragen - 0 bis 600.",
    klassenZielTipp:
      "Setzt dieses Wochenziel ab der nächsten Woche für jedes Kind dieser Klasse - auch für Kinder, die später dazukommen. Einzeln gesetzte Ziele werden dabei überschrieben.",
    fuerKlasseUebernehmen: "Für die Klasse übernehmen",
    wochenzielFuerKlasse: (bezeichnung: string) => `Wochenziel für die ${bezeichnung}`,
    // ── Excel ───────────────────────────────────────────────────────────
    excelTipp: (datei: string) =>
      `Als Excel herunterladen: Lädt die Tabelle als Excel-Datei ` +
      `„${datei}“ herunter - vorn eine ` +
      `Übersicht mit Legende, dahinter vier Blätter: das laufende Schuljahr, ` +
      `Gesamt, der Monat (die letzten 4 Wochen) und diese Woche, egal, ` +
      `welcher Zeitraum hier gewählt ist.`,
    alsExcel: "Als Excel herunterladen",
  },
  // ★ E11a (25.09.2026): durchgehend „vous" - die Klassentabelle ist reine
  // Lehrkraft-Ansicht (F9). Glossar §9.2: Wochenziel ⇒ objectif de la
  // semaine, Klassenmatch ⇒ Match de la classe, Eigene Übung ⇒ Texte de la
  // classe, Tippchallenge ⇒ le Défi.
  fr: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Le nouvel objectif de ${minutenFr(Math.round(minuten))} par semaine s'applique à partir de ` +
      `8 h le lundi ${naechsterMontagFr(jetztMs)}. Jusque-là, l'objectif actuel reste valable.`,
    keinZielMehr: (jetztMs: number) =>
      `À partir de 8 h le lundi ${naechsterMontagFr(jetztMs)}, il n'y aura plus d'objectif de la semaine. ` +
      `Jusque-là, l'objectif actuel reste valable.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const eleveSatz =
        anzahlKinder === 1
          ? minuten > 0
            ? `L'unique élève de cette classe reçoit ${minutenFr(minuten)} par semaine.`
            : "L'unique élève de cette classe n'a plus d'objectif de la semaine."
          : minuten > 0
            ? `Les ${anzahlKinder} élèves reçoivent ${minutenFr(minuten)} par semaine.`
            : `Les ${anzahlKinder} élèves n'ont plus d'objectif de la semaine.`;
      return (
        `${eleveSatz} Cela s'applique à partir de 8 h le lundi ${naechsterMontagFr(jetztMs)} - jusque-là, ` +
        `l'objectif actuel reste valable. Les objectifs réglés individuellement sont alors remplacés. ` +
        (minuten > 0
          ? "Les élèves qui arrivent plus tard reçoivent aussi cet objectif."
          : "Les élèves qui arrivent plus tard n'en reçoivent pas non plus.")
      );
    },
    wochenziel: "Objectif de la semaine",
    minutenProWoche: "Minutes par semaine",
    nullKeinZiel: "0 = pas d'objectif de la semaine.",
    zielKalenderwochen: "Semaines de l'objectif",
    speichernTipp: (name: string) =>
      `Enregistre ensemble les minutes, les semaines de l'objectif et le rattrapage pour ${name} - après confirmation. Le changement s'applique à partir de la semaine prochaine.`,
    nichtsGeaendert: "Rien n'a changé dans l'objectif de la semaine - il est déjà enregistré.",
    speichern: "Enregistrer",
    nachholenTipp:
      "Les minutes exercées en trop comblent les objectifs de la semaine non atteints des semaines précédentes - la plus ancienne en premier.",
    nachholen: "Rattraper les minutes manquées des semaines précédentes",
    dieseWoche: "Cette semaine :",
    min: "min",
    keinWochenziel: "pas d'objectif de la semaine",
    anstehend: (datum: string, minuten: number) => [" - à partir du lun ", datum, " : ", minuten, " min"],
    ueberfaelligTipp:
      "Remet à zéro le retard des semaines précédentes - à partir de cette semaine, l'objectif de la semaine repart de zéro. Le temps déjà exercé est conservé.",
    ueberfaelligZuruecksetzen: "Réinitialiser les minutes en retard",
    zuletztZurueckgesetzt: (ab: string) => ["dernière réinitialisation le ", ab],
    erlassenTipp:
      "Les semaines choisies ne comptent jamais comme manquées ou à rattraper - que la case de la semaine-objectif soit cochée ou non. Le temps déjà exercé est conservé.",
    wochenzielErlassen: "Dispenser de l'objectif de la semaine",
    wochenzielFuer: (name: string) => `Objectif de la semaine pour ${name}`,
    uebernehmen: "Appliquer",
    abbrechen: "Annuler",
    einstellungen: "Réglages",
    womitAnfangen: "Par où commencer ?",
    womitTipp:
      "ce que l'élève sait déjà faire - un niveau plus bas rétrograde (après confirmation), statistiques et badges restent.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `${name} en est à "${label}".\n\n` +
      `Vraiment rétrograder à "${ziel}" ?\n\n` +
      `Les exercices se limitent ensuite aux touches jusqu'à ce niveau. Statistiques de frappe, ` +
      `temps d'exercice et badges sont conservés - qui remonte plus tard ` +
      `les retrouve intacts.\n\n` +
      `Prend effet la prochaine fois que ${name} ouvre Tastenflow.`,
    womitName: (name: string) => `Par où ${name} commence`,
    ausstehend: (name: string) => ["Prend effet la prochaine fois que ", name, " ouvre Tastenflow."],
    einhandTipp:
      "Les majuscules et les caractères spéciaux sont acceptés avec n'importe quelle touche Majuscule (ou Verr. Maj) - la règle de la main opposée pour la touche Majuscule est désactivée pour cet élève.",
    // ★ E11a-5: derselbe Name wie in Hilfe, Zahnrad und Ansage („d'une seule main").
    einhandName: (name: string) =>
      `Écrire d'une seule main pour ${name} : règle de la main opposée désactivée`,
    einhand: "Écrire d'une seule main",
    tempoTipp:
      "Pour cet élève, la vitesse ne compte nulle part - pas de minuterie dans le jeu, pas d'objectif de vitesse pour les étoiles, pas de montée ni de descente de niveau, et le temps d'exercice continue même en cas de longues pauses. Pour les élèves qui tapent avec soin mais très lentement.",
    tempoName: (name: string) =>
      `La vitesse ne compte pas pour ${name} : la vitesse n'est évaluée nulle part`,
    tempoZaehltNicht: "La vitesse ne compte pas",
    abstand: "Grand espacement des caractères (CVI)",
    abstandTipp: `Espacement plus grand entre CHAQUE caractère en recopiant - pour les élèves avec une déficience visuelle cérébrale (CVI), chez qui des caractères rapprochés se confondent. "Double" prend le double, "triple" le triple, "quadruple" le quadruple de l'espacement par caractère. En écrivant, tout est assombri sauf le champ où l'élève écrit (ligne d'exercice ou aire de jeu) ; après 5 secondes sans frappe, tout redevient clair. La ligne d'exercice glisse alors au rythme d'écriture de l'élève vers le caractère suivant - lentement s'il écrit lentement - au lieu de sauter. "Simple" laisse les caractères à l'espacement habituel et n'active que l'assombrissement, le glissement de la ligne et la ligne de lecture. L'élève peut aussi changer l'espacement lui-même dans ses réglages (roue crantée, Alt + O), aussi souvent qu'il le veut - et vous pouvez le refaire ici à tout moment. C'est le dernier choix qui compte.`,
    abstandName: (name: string) => `Grand espacement des caractères (CVI) pour ${name}`,
    listenTitel: "Élèves de la classe avec niveau et objectif de la semaine",
    tastenSr: (sitzen: number, frei: number) => [
      sitzen,
      " sur ",
      frei,
      " touches débloquées sont acquises",
    ],
    bezugBlock: (datum: string) => `les 4 semaines d'exercice à partir du ${datum}`,
    bezugWoche: (datum: string) => `la semaine à partir du ${datum}`,
    gruppePerson: "Personne",
    gruppeStand: "Niveau et temps d'exercice",
    gruppeUeben: "Exercice",
    gruppePruefung: "Défi",
    kopfName: "Nom",
    kopfStufe: "Niveau",
    kopfTasten: "Touches",
    kopfNaechste: "Prochaines touches",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "toutes les touches apprises" : `ensuite ${namen.join(", puis ")}`,
    kopfUebezeit: "Temps d'exercice",
    kopfWochenziel: "Objectif de la semaine",
    kopfWochenziele: "Objectifs de la semaine",
    kopfTreffer: "Précision",
    kopfTempo: "Frappes/min",
    kopfScore: "Score",
    uebungszeiten: "Temps d'exercice",
    nochKeineUebung: "pas encore d'exercice enregistré",
    uebungszeitenKennzahl: (dauer: string, wochen: number) =>
      `${dauer} - ${wochen} semaine${wochen === 1 ? "" : "s"}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - sur ",
      tage,
      " jour",
      tage === 1 ? "" : "s",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt} sur ${ziel} min`,
    periodeMatches: (n: number) => ` - ${n} Match${n === 1 ? "" : "s"} de la classe`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "N'a encore terminé aucun Match de la classe"
        : `A terminé ${n} Match${n === 1 ? "" : "s"} de la classe`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Compte chaque Match de la classe que ${name} a joué jusqu'au bout dans cette classe ` +
      `- depuis le ${seit} ; avant cette date, les Matchs n'étaient pas enregistrés. ` +
      `Les matchs abandonnés ou quittés avant la fin ne comptent pas. Un match compte environ ` +
      `une heure après sa fin. Seulement le nombre : aucun classement, et qui a gagné ` +
      `n'est pas compté.`,
    kopfKlassenmatch: "Match de la classe",
    klassenmatchOhneZahl: "Match de la classe : aucune donnée",
    gruppeKlassenmatch: "Match de la classe",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Combien de Matchs de la classe l'élève a joués jusqu'au bout. Les matchs abandonnés ` +
      `ou quittés avant la fin ne comptent pas ; qui a gagné n'est pas compté. Enregistré ` +
      `depuis le ${seit}. Un tiret signifie : le Match de la classe est désactivé pour cette ` +
      `classe, ou le nombre n'a pas pu être chargé.`,
    wocheHilfe: (pauseMin: number) =>
      `Une fois déplié, chaque temps d'exercice de cette semaine apparait : jour, heure de ` +
      `début à fin, le temps exercé et ce qui a été exercé. Le temps exercé est le temps de ` +
      `frappe pur - les pauses ne comptent pas, c'est pourquoi il est souvent plus court que ` +
      `l'intervalle affiché. Après plus de ${pauseMin} minutes sans frappe, un nouveau temps ` +
      `d'exercice commence.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Mon entrainement",
        lektion: "Leçons",
        geschichte: "Histoires",
        wortspiel: "Jeux de lettres",
        tippchallenge: PRUEFUNG_WORT_FR,
        klassenmatch: "Match de la classe",
        "eigene-uebung": EIGENE_UEBUNG_WORT_FR,
      })[art],
    wackligeTasten: "Touches instables",
    nochZuWenigGeuebt: "pas encore assez d'exercice",
    zuWenigUmZuSagen: "Pas encore assez d'exercice pour le dire.",
    wackligCaption: (name: string) => ["Touches instables de ", name],
    tasteKopf: "Touche",
    tasteHilfe: (prozent: number) =>
      `Une touche qui n'est pas encore sûre - au moins ${WACKLIG_MIND_ANSCHLAEGE} essais, avec moins de ${prozentText(prozent, "fr")} de réussite.`,
    trefferKopf: "Précision",
    trefferHilfe: "La part des frappes réussies sur cette touche.",
    tempoKopf: "Vitesse",
    tempoHilfe: "À quelle vitesse cette touche est venue la dernière fois - frappes de cette touche par minute.",
    abzeichen: (n: number) => ["Badges - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_FR} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_FR,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_FR} de ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Réglages pour ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Objectif de la semaine ${zielMin} min` : "pas d'objectif de la semaine",
    ],
    eigenstaendigkeit: (n: number) => ["Autonomie -", " ", n, " signal", n === 1 ? "" : "aux"],
    knopfTipp: (name: string) =>
      `Réglages et bilan de ${name} - réglages, temps d'exercice, touches instables et badges ; tout le reste dans "Mes progrès" de ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Replier" : "Déplier"} les réglages et le bilan de ${name}`,
    keinZielGesetzt: "aucun objectif de la semaine réglé",
    keineAbgeschlossene: "pas encore de semaine-objectif terminée",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      prozent,
      " pour cent des objectifs de la semaine atteints, ",
      ganz,
      " sur",
      " ",
      gesamt,
      " semaines en entier",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["sur ", ganz, "/", gesamt, " semaines en entier"],
    wocheErlassen: "cette semaine a été dispensée",
    keineZielwoche: "pas de semaine-objectif",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " sur ", nenner, " minutes"],
    offenSr: (minuten: number) => `, dont ${minuten} minutes en attente des semaines précédentes`,
    erreichtSr: ", objectif de la semaine atteint",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min sem. préc."],
    klasseNichtGespeichert: "Le réglage de la classe n'a pas pu être enregistré.",
    kinderEingetragen: (n: number) =>
      ` Enregistré pour ${elevesFr(n)} - ` +
      `prend effet à la prochaine ouverture de Tastenflow. Statistiques et badges restent.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Le niveau de départ "${label}" vaut maintenant pour la classe - aussi pour les élèves qui la rejoignent plus tard.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `La valeur par défaut de la classe n'a pas pu être enregistrée.${kinderSatz}`,
    gesperrtZusatz: " (verrouillé)",
    stufeWaehlen: "Choisir un niveau",
    vorgabeKlasse: (label: string) => `Valeur par défaut de la classe : "${label}"`,
    dieMeisten: (label: string) => `la plupart en sont à "${label}"`,
    bezugKlasse: (name: string) => `de la classe ${name}`,
    startHinweis:
      "ce que la classe sait déjà faire - vaut pour tous les élèves de cette classe, aussi pour ceux qui la rejoignent plus tard",
    startSrHinweis:
      "La première entrée indique la valeur par défaut de la classe et le niveau où en sont la plupart des élèves. " +
      "Qui choisit un niveau l'enregistre comme valeur par défaut de la classe - il vaut aussi pour les élèves qui la rejoignent plus tard - " +
      "et l'inscrit pour les élèves déjà présents ; si certains sont déjà plus avancés, l'application le demande d'abord. " +
      "Prend effet la prochaine fois qu'un élève ouvre Tastenflow ; statistiques et badges restent.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Niveau scolaire retiré. La valeur par défaut (${vorgabe}) s'applique à nouveau.`,
    schulstufeErwachsen: (label: string) =>
      `Niveau scolaire : adultes. Les textes conviennent maintenant à des adultes (${label}).`,
    // ★ E11a-3 (26.09.2026): wie im Englischen `schulstufeLabelEn(wert)` statt
    // der rohen Zahl - im Auswahlfeld stand für „fr" schon der Alterstext
    // (`schulstufeLabelFr`, Glossar §9.2 „nie CE2/P3/3H"), die Rückmeldung
    // greift ihn wieder auf statt eine Zahl zu nennen, die dort nie stand.
    schulstufeGesetzt: (wert: number, label: string) =>
      `Niveau scolaire : ${schulstufeLabelFr(wert)}. Les textes conviennent maintenant à la tranche d'âge ` +
      `${label}.`,
    spracheDerKlasse: (sprache: string) => `Langue de la classe : ${sprache}.`,
    spracheGesperrt: "La langue est verrouillée pour les élèves de cette classe.",
    spracheFrei: "La langue est à nouveau libre.",
    matchNichtUmgestellt: "Le Match de la classe n'a pas pu être modifié.",
    matchErlaubt: "Le Match de la classe est autorisé pour cette classe.",
    matchAus: "Le Match de la classe est désactivé pour cette classe.",
    zeilenEndeAn:
      "Chaque ligne se termine maintenant par la touche Entrée - pour tous les élèves de cette classe.",
    zeilenEndeAus: "La fin de ligne avec Entrée est désactivée pour cette classe.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `L'année scolaire de cette classe commence maintenant le 1er ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Orthographe : ${label} - pour tous les élèves de cette classe.`,
    schreibweiseAutoLabel: "automatique",
    schreibweiseGbLabel: "britannique",
    schreibweiseUsLabel: "américaine",
    startFrageTitel: "Niveau de départ pour toute la classe",
    frageVor: (n: number) => ["Dans votre classe, ", n === 1 ? "il y a" : "il y a", " "],
    frageStark: (n: number) => [n, " ", n === 1 ? "élève" : "élèves"],
    frageNach: (n: number) => [
      " ",
      (n === 1 ? "déjà plus avancé" : "déjà plus avancés") + " que le niveau réglé. La classe entière doit-elle vraiment être ramenée à ce niveau ?",
    ],
    detailVor: "Choisi : ",
    detailNach: (namen: string) => [
      ". Déjà plus loin :",
      " ",
      namen,
      ". Rétrograder un élève lui retire du contenu déjà acquis - statistiques de frappe, temps d'exercice et badges restent dans tous les cas. Prend effet la prochaine fois qu'un élève ouvre Tastenflow.",
    ],
    // ★ E11a-5 (Feinschliff-Liste): „Ramener" hiess „alle zurückholen".
    alleEinstufen: "Définir le niveau de toute la classe",
    nurNochNicht: "Seulement ceux qui n'en sont pas encore là",
    startZurueck: (name: string, label: string) =>
      `Niveau de ${name} ramené à "${label}" - prend effet à la prochaine ouverture. ` +
      `Statistiques et badges restent.`,
    startpunktVon: (name: string, label: string) => `Point de départ de ${name} : "${label}".`,
    wochenzielNichtGespeichert: (name: string) =>
      `L'objectif de la semaine de ${name} n'a pas pu être enregistré.`,
    wochenzielGespeichert: (name: string) => `Objectif de la semaine de ${name} enregistré.`,
    ueberfaelligFrage: (name: string) =>
      `Réinitialiser les minutes en retard de l'objectif de la semaine de ${name} ?\n\n` +
      `Le retard accumulé jusqu'ici est effacé ; à partir de cette semaine, ` +
      `l'objectif de la semaine repart de zéro. Le temps déjà exercé et les statistiques sont conservés.`,
    ueberfaelligErledigt: (name: string) => `Minutes en retard de ${name} réinitialisées.`,
    erlasseneGespeichert: "Semaines dispensées enregistrées.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Objectif de la semaine (${minutenFr(minuten)})` : "Plus d'objectif de la semaine"} enregistré pour ${ok} élève${ok === 1 ? "" : "s"} sur ${gesamt} - s'applique à partir de 8 h le lundi ` +
      `${naechsterMontagFr(jetztMs)}.`,
    klassenZielFehler: (namen: string) =>
      ` Cela n'a pas fonctionné pour ${namen} - merci de réessayer.`,
    sperreNichtAufgehoben: "Le verrouillage n'a pas pu être levé.",
    sperreAufgehoben:
      "Le verrouillage est levé - le temps exercé compte à nouveau pour l'objectif de la semaine dès maintenant.",
    stundeNichtGesperrt: "L'heure n'a pas pu être verrouillée.",
    gesperrtBisStatus: (zeit: string) =>
      `Objectif de la semaine verrouillé pour la classe jusqu'à ${zeit} - ` +
      `le temps d'exercice et les statistiques continuent de compter, seul l'objectif de la semaine est suspendu.`,
    stundeGesperrt: "L'heure est verrouillée.",
    excelLaeuft: "Le fichier Excel est en cours de création - un instant.",
    excelFertig: (datei: string) =>
      `"${datei}" téléchargé - avec un aperçu et sa légende, plus quatre feuilles : année scolaire, total, mois et semaine.`,
    excelFehler:
      "Le fichier Excel n'a pas pu être créé. Merci de réessayer ; " +
      "si cela persiste, merci de le signaler.",
    laedt: "Chargement …",
    lesefehlerStark: "Le niveau n'a pas pu être lu",
    lesefehlerFuer: (namen: string) => [
      " pour",
      " ",
      namen,
      ". Les chiffres de ces lignes sont donc vides et ne signifient ",
    ],
    lesefehlerNicht: "pas",
    lesefehlerSchluss:
      " que personne n'a tapé. Merci de recharger la page ; si cela persiste, merci de le signaler.",
    aufgabenGruppe: "Activités pour la classe",
    tippchallengeTipp:
      "Ouvre le Défi pour toute la classe : définir le texte et la durée - puis les résultats ici aussi.",
    tippchallenge: PRUEFUNG_WORT_FR,
    eigeneUebungTipp:
      "Attribue à la classe un fichier chargé comme texte obligatoire - chaque élève l'exerce à son propre rythme, aucune nouvelle touche n'est débloquée par ce biais.",
    eigeneUebung: EIGENE_UEBUNG_WORT_FR,
    wochenzielTipp:
      "Règle combien de minutes la classe doit s'exercer par semaine - pour chaque élève individuellement ou pour tous à la fois.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "réglé",
    keinZiel: "aucun objectif",
    einstellungenTipp:
      "Régler le niveau scolaire, la langue, le niveau de départ et le Match de la classe pour toute la classe.",
    einstellungenDerKlasse: "Réglages de la classe",
    sperreBeendenTipp:
      "Met fin au verrouillage immédiatement - le temps exercé compte ensuite à nouveau pour l'objectif de la semaine.",
    sperrenTipp:
      "Verrouille l'objectif de la semaine pendant 60 minutes, pour toute la classe. L'exercice continue quand même - le temps d'exercice et les statistiques continuent de compter, seul l'objectif de la semaine est suspendu.",
    gesperrtBisKnopf: (zeit: string) => `Verrouillé jusqu'à ${zeit} - lever`,
    stundeSperren: "Verrouiller l'heure",
    wochenzielAufgabe: "Objectif de la semaine - activité",
    zielFuerKlasseGesetzt: "- réglé pour les élèves de cette classe",
    nochKeinZielGesetzt: "- pas encore d'objectif réglé",
    minutenZuerst: "Indiquez d'abord les minutes par semaine - 0 à 600.",
    klassenZielTipp:
      "Règle cet objectif de la semaine à partir de la semaine prochaine pour chaque élève de cette classe - aussi pour les élèves qui arrivent plus tard. Les objectifs réglés individuellement sont alors remplacés.",
    fuerKlasseUebernehmen: "Appliquer à la classe",
    wochenzielFuerKlasse: (bezeichnung: string) => `Objectif de la semaine pour ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Télécharger en Excel : télécharge le tableau comme fichier Excel ` +
      `"${datei}" - avec d'abord un ` +
      `aperçu et sa légende, puis quatre feuilles : l'année scolaire en cours, ` +
      `le total, le mois (les 4 dernières semaines) et cette semaine, quelle que ` +
      `soit la période choisie ici.`,
    alsExcel: "Télécharger en Excel",
    // ★ Nachgezogen beim Zusammenführen (Schulstufe je Kind, 67530ff2).
    schulstufeKind: "Niveau scolaire",
    schulstufeKindName: (name: string) => `Niveau scolaire de ${name}`,
    wieDieKlasse: (klasse: string) => `comme la classe (${klasse})`,
    schulstufeKindTipp:
      'Seulement pour cet élève : le niveau scolaire détermine les textes et remplace celui de la classe. Il avance tout seul à chaque année scolaire. "Comme la classe" supprime l\'exception.',
    schulstufeKindGesetzt: (name: string, stufe: string) =>
      `${name} reçoit maintenant des textes pour ${stufe}.`,
    schulstufeKindErwachsen: (name: string) => `${name} reçoit maintenant des textes pour adultes.`,
    schulstufeKindWieKlasse: (name: string) => `${name} reçoit de nouveau les textes de la classe.`,
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft - usted; „estudiante" ist
  // geschlechtsneutral (Bauplan S10), die Gruppe heisst „el alumnado".
  es: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `El nuevo objetivo de ${minutenEs(Math.round(minuten))} por semana se aplica a partir del ` +
      `lunes ${naechsterMontagEs(jetztMs)} a las 8. Hasta entonces sigue vigente el objetivo actual.`,
    keinZielMehr: (jetztMs: number) =>
      `A partir del lunes ${naechsterMontagEs(jetztMs)} a las 8 ya no habrá objetivo semanal. ` +
      `Hasta entonces sigue vigente el objetivo actual.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `La única persona de esta clase recibe ${minutenEs(minuten)} por semana.`
            : "La única persona de esta clase ya no tiene objetivo semanal."
          : minuten > 0
            ? `Los ${anzahlKinder} estudiantes reciben ${minutenEs(minuten)} por semana.`
            : `Los ${anzahlKinder} estudiantes ya no tienen objetivo semanal.`;
      return (
        `${satz} Se aplica a partir del lunes ${naechsterMontagEs(jetztMs)} a las 8 - hasta entonces ` +
        `sigue vigente el objetivo actual. Los objetivos fijados por separado se sustituyen. ` +
        (minuten > 0
          ? "Quienes se incorporen más tarde también reciben este objetivo."
          : "Quienes se incorporen más tarde tampoco lo reciben.")
      );
    },
    wochenziel: "Objetivo semanal",
    minutenProWoche: "Minutos por semana",
    nullKeinZiel: "0 = sin objetivo semanal.",
    zielKalenderwochen: "Semanas del objetivo",
    speichernTipp: (name: string) =>
      `Guarda juntos los minutos, las semanas del objetivo y la recuperación para ${name} - tras una confirmación. El cambio se aplica a partir de la semana que viene.`,
    nichtsGeaendert: "No ha cambiado nada en el objetivo semanal - ya está guardado.",
    speichern: "Guardar",
    nachholenTipp:
      "Los minutos practicados de más completan los objetivos semanales no alcanzados de semanas anteriores - primero el más antiguo.",
    nachholen: "Recuperar los minutos que faltaron en semanas anteriores",
    dieseWoche: "Esta semana:",
    min: "min",
    keinWochenziel: "sin objetivo semanal",
    anstehend: (datum: string, minuten: number) => [" - a partir del lun ", datum, ": ", minuten, " min"],
    ueberfaelligTipp:
      "Pone a cero lo pendiente de semanas anteriores - a partir de esta semana, el objetivo semanal empieza de cero. El tiempo ya practicado se conserva.",
    ueberfaelligZuruecksetzen: "Poner a cero los minutos pendientes",
    zuletztZurueckgesetzt: (ab: string) => ["última puesta a cero el ", ab],
    erlassenTipp:
      "Las semanas elegidas nunca cuentan como no cumplidas ni pendientes - tanto si la casilla de semana del objetivo está marcada como si no. El tiempo ya practicado se conserva.",
    wochenzielErlassen: "Eximir del objetivo semanal",
    wochenzielFuer: (name: string) => `Objetivo semanal para ${name}`,
    uebernehmen: "Aplicar",
    abbrechen: "Cancelar",
    einstellungen: "Configuración",
    womitAnfangen: "¿Por dónde empieza?",
    womitTipp:
      "lo que cada estudiante ya sabe hacer - si elige un nivel más bajo, la persona retrocede (tras una confirmación); las estadísticas y las insignias se mantienen.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `${name} está en "${label}".\n\n` +
      `¿Bajar de verdad a "${ziel}"?\n\n` +
      `Los ejercicios se limitan entonces a las teclas hasta ese nivel. Las estadísticas de escritura, ` +
      `el tiempo de práctica y las insignias se conservan - quien vuelva a subir más tarde ` +
      `los encuentra intactos.\n\n` +
      `Tiene efecto la próxima vez que ${name} abra Tastenflow.`,
    womitName: (name: string) => `Por dónde empieza ${name}`,
    ausstehend: (name: string) => ["Tiene efecto la próxima vez que ", name, " abra Tastenflow."],
    einhandTipp:
      "Las mayúsculas y los caracteres especiales se aceptan con cualquier tecla Mayús (o Bloq Mayús) - la regla de la mano contraria para la tecla Mayús queda desactivada para esta persona.",
    einhandName: (name: string) =>
      `Escribir con una mano para ${name}: regla de la mano contraria desactivada`,
    einhand: "Escribir con una mano",
    tempoTipp:
      "Para esta persona la velocidad no cuenta en ninguna parte - sin reloj en el juego, sin meta de velocidad para las estrellas, sin subir ni bajar de nivel, y el tiempo de práctica sigue contando aunque haga pausas largas. Para estudiantes que escriben con cuidado pero muy despacio.",
    tempoName: (name: string) =>
      `La velocidad no cuenta para ${name}: la velocidad no se valora en ninguna parte`,
    tempoZaehltNicht: "La velocidad no cuenta",
    abstand: "Espacio grande entre caracteres (CVI)",
    abstandTipp: `Más espacio entre CADA carácter al copiar - para estudiantes con discapacidad visual cerebral (CVI; en español también DVC), a quienes los caracteres muy juntos se les mezclan. "Doble" da el doble, "triple" el triple y "cuádruple" el cuádruple de espacio por carácter. Al escribir, todo se oscurece salvo el campo donde se escribe (línea de práctica o zona de juego); tras 5 segundos sin pulsar ninguna tecla, todo vuelve a verse claro. La línea de práctica se desliza entonces al ritmo de escritura de la persona hasta el siguiente carácter - despacio si escribe despacio - en lugar de saltar. "Sencillo" deja los caracteres a su distancia normal y solo activa el oscurecimiento, el deslizamiento de la línea y la línea de lectura. Cada estudiante también puede cambiar el espacio en su configuración (rueda dentada, Alt + O), tantas veces como quiera - y usted puede volver a cambiarlo aquí en cualquier momento. Cuenta la última elección.`,
    abstandName: (name: string) => `Espacio grande entre caracteres (CVI) para ${name}`,
    listenTitel: "Estudiantes de la clase con nivel y objetivo semanal",
    tastenSr: (sitzen: number, frei: number) => [
      sitzen,
      " de ",
      frei,
      " teclas desbloqueadas están aprendidas",
    ],
    bezugBlock: (datum: string) => `las 4 semanas de práctica a partir del ${datum}`,
    bezugWoche: (datum: string) => `la semana a partir del ${datum}`,
    gruppePerson: "Persona",
    gruppeStand: "Nivel y tiempo de práctica",
    gruppeUeben: "Práctica",
    gruppePruefung: PRUEFUNG_WORT_ES,
    kopfName: "Nombre",
    kopfStufe: "Nivel",
    kopfTasten: "Teclas",
    kopfNaechste: "Próximas teclas",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "todas las teclas aprendidas" : `después ${namen.join(", luego ")}`,
    kopfUebezeit: "Tiempo de práctica",
    kopfWochenziel: "Objetivo semanal",
    kopfWochenziele: "Objetivos semanales",
    kopfTreffer: "Precisión",
    kopfTempo: "Pulsaciones por minuto",
    kopfScore: "Puntuación",
    uebungszeiten: "Tiempos de práctica",
    nochKeineUebung: "todavía no hay práctica registrada",
    uebungszeitenKennzahl: (dauer: string, wochen: number) =>
      `${dauer} - ${wochen} semana${wochen === 1 ? "" : "s"}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - en ",
      tage,
      tage === 1 ? " día" : " días",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt} de ${ziel} min`,
    periodeMatches: (n: number) => ` - ${n} ${n === 1 ? "Competición" : "Competiciones"} de la clase`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Todavía no ha terminado ninguna Competición de la clase"
        : `Ha terminado ${n} ${n === 1 ? "Competición" : "Competiciones"} de la clase`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Cuenta cada Competición de la clase que ${name} ha jugado hasta el final en esta clase ` +
      `- desde el ${seit}; antes de esa fecha no se registraban. ` +
      `Las competiciones interrumpidas o abandonadas antes del final no cuentan. Una competición cuenta ` +
      `aproximadamente una hora después de terminar. Solo el número: ninguna clasificación, y quién ganó ` +
      `no se cuenta.`,
    kopfKlassenmatch: "Competición de la clase",
    klassenmatchOhneZahl: "Competición de la clase: sin datos",
    gruppeKlassenmatch: "Competición de la clase",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Cuántas Competiciones de la clase ha jugado hasta el final. Las interrumpidas ` +
      `o abandonadas antes del final no cuentan; quién ganó no se cuenta. Registrado ` +
      `desde el ${seit}. Un guion significa: la Competición de la clase está desactivada para esta ` +
      `clase, o no se pudo cargar el número.`,
    wocheHilfe: (pauseMin: number) =>
      `Al desplegarlo aparece cada tiempo de práctica de esta semana: día, hora de ` +
      `inicio y de fin, el tiempo practicado y qué se practicó. El tiempo practicado es el tiempo ` +
      `puro de escritura - las pausas no cuentan, por eso suele ser más corto que ` +
      `el intervalo mostrado. Tras más de ${pauseMin} minutos sin pulsar ninguna tecla, empieza un nuevo tiempo ` +
      `de práctica.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Mi entrenamiento",
        lektion: "Lecciones",
        geschichte: "Cuentos",
        wortspiel: "Juegos de palabras",
        tippchallenge: PRUEFUNG_WORT_ES,
        klassenmatch: "Competición de la clase",
        "eigene-uebung": EIGENE_UEBUNG_WORT_ES,
      })[art],
    wackligeTasten: "Teclas inseguras",
    nochZuWenigGeuebt: "todavía poca práctica",
    zuWenigUmZuSagen: "Todavía hay poca práctica para decirlo.",
    wackligCaption: (name: string) => ["Teclas inseguras de ", name],
    tasteKopf: "Tecla",
    tasteHilfe: (prozent: number) =>
      `Una tecla que todavía no es segura - al menos ${WACKLIG_MIND_ANSCHLAEGE} intentos, con menos del ${prozentText(prozent, "es")} de aciertos.`,
    trefferKopf: "Precisión",
    trefferHilfe: "El porcentaje de pulsaciones acertadas en esta tecla.",
    tempoKopf: "Velocidad",
    tempoHilfe: "Con qué rapidez salió esta tecla la última vez - pulsaciones de esta tecla por minuto.",
    abzeichen: (n: number) => ["Insignias - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_ES} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_ES,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_ES} de ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Configuración para ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Objetivo semanal ${zielMin} min` : "sin objetivo semanal",
    ],
    eigenstaendigkeit: (n: number) => ["Autonomía -", " ", n, n === 1 ? " señal" : " señales", ""],
    knopfTipp: (name: string) =>
      `Configuración y balance de ${name} - configuración, tiempos de práctica, teclas inseguras e insignias; todo lo demás en "Mi progreso" de ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Plegar" : "Desplegar"} la configuración y el balance de ${name}`,
    keinZielGesetzt: "ningún objetivo semanal fijado",
    keineAbgeschlossene: "todavía ninguna semana del objetivo terminada",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      prozent,
      " por ciento de los objetivos semanales alcanzados, ",
      ganz,
      " de",
      " ",
      gesamt,
      " semanas completas",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["de ", ganz, "/", gesamt, " semanas completas"],
    wocheErlassen: "esta semana se eximió",
    keineZielwoche: "no es semana del objetivo",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " de ", nenner, " minutos"],
    offenSr: (minuten: number) => `, de ellos ${minuten} minutos pendientes de semanas anteriores`,
    erreichtSr: ", objetivo semanal alcanzado",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min sem. ant."],
    klasseNichtGespeichert: "No se pudo guardar la configuración de la clase.",
    kinderEingetragen: (n: number) =>
      ` Guardado para ${estudiantesEs(n)} - ` +
      `tiene efecto la próxima vez que abran Tastenflow. Las estadísticas y las insignias se mantienen.`,
    startGilt: (label: string, kinderSatz: string) =>
      `El nivel de partida "${label}" se aplica ahora a la clase - también a quienes se incorporen más tarde.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `No se pudo guardar el valor predeterminado de la clase.${kinderSatz}`,
    gesperrtZusatz: " (bloqueado)",
    stufeWaehlen: "Elegir un nivel",
    vorgabeKlasse: (label: string) => `Valor predeterminado de la clase: "${label}"`,
    dieMeisten: (label: string) => `la mayoría está en "${label}"`,
    bezugKlasse: (name: string) => `de la clase ${name}`,
    startHinweis:
      "lo que la clase ya sabe hacer - se aplica a todo el alumnado de esta clase, también a quienes se incorporen más tarde",
    startSrHinweis:
      "La primera entrada indica el valor predeterminado de la clase y el nivel en el que está la mayoría. " +
      "Quien elige un nivel lo guarda como valor predeterminado de la clase - se aplica también a quienes se incorporen más tarde - " +
      "y lo anota para el alumnado que ya está; si alguien ya va más adelantado, la aplicación lo pregunta antes. " +
      "Tiene efecto la próxima vez que cada estudiante abra Tastenflow; las estadísticas y las insignias se mantienen.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Curso quitado. Vuelve a aplicarse el valor predeterminado (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Curso: personas adultas. Los textos son ahora adecuados para personas adultas (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Curso: ${schulstufeLabelEs(wert)}. Los textos son ahora adecuados para la edad ` +
      `${label}.`,
    spracheDerKlasse: (sprache: string) => `Idioma de la clase: ${sprache}.`,
    spracheGesperrt: "El idioma está bloqueado para el alumnado de esta clase.",
    spracheFrei: "El idioma vuelve a estar libre.",
    matchNichtUmgestellt: "No se pudo cambiar la Competición de la clase.",
    matchErlaubt: "La Competición de la clase está permitida en esta clase.",
    matchAus: "La Competición de la clase está desactivada en esta clase.",
    zeilenEndeAn:
      "Cada línea termina ahora con la tecla Intro - para todo el alumnado de esta clase.",
    zeilenEndeAus: "El final de línea con Intro está desactivado en esta clase.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `El curso escolar de esta clase empieza ahora el 1 de ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Ortografía: ${label} - para todo el alumnado de esta clase.`,
    schreibweiseAutoLabel: "automática",
    schreibweiseGbLabel: "británica",
    schreibweiseUsLabel: "estadounidense",
    startFrageTitel: "Nivel de partida para toda la clase",
    frageVor: (n: number) => ["En su clase ", n === 1 ? "hay" : "hay", " "],
    frageStark: (n: number) => [n, " ", n === 1 ? "estudiante" : "estudiantes"],
    frageNach: (n: number) => [
      " ",
      (n === 1 ? "que ya va más adelantado" : "que ya van más adelantados") +
        " que el nivel elegido. ¿Seguro que quiere llevar a toda la clase a ese nivel?",
    ],
    detailVor: "Elegido: ",
    detailNach: (namen: string) => [
      ". Ya van más adelante:",
      " ",
      namen,
      ". Bajar de nivel a alguien le quita contenido ya aprendido - las estadísticas de escritura, el tiempo de práctica y las insignias se mantienen en todo caso. Tiene efecto la próxima vez que cada estudiante abra Tastenflow.",
    ],
    alleEinstufen: "Fijar el nivel de toda la clase",
    nurNochNicht: "Solo quienes todavía no han llegado",
    startZurueck: (name: string, label: string) =>
      `Nivel de ${name} bajado a "${label}" - tiene efecto la próxima vez que abra Tastenflow. ` +
      `Las estadísticas y las insignias se mantienen.`,
    startpunktVon: (name: string, label: string) => `Punto de partida de ${name}: "${label}".`,
    wochenzielNichtGespeichert: (name: string) =>
      `No se pudo guardar el objetivo semanal de ${name}.`,
    wochenzielGespeichert: (name: string) => `Objetivo semanal de ${name} guardado.`,
    ueberfaelligFrage: (name: string) =>
      `¿Poner a cero los minutos pendientes del objetivo semanal de ${name}?\n\n` +
      `Se borra lo pendiente acumulado hasta ahora; a partir de esta semana ` +
      `el objetivo semanal empieza de cero. El tiempo ya practicado y las estadísticas se conservan.`,
    ueberfaelligErledigt: (name: string) => `Minutos pendientes de ${name} puestos a cero.`,
    erlasseneGespeichert: "Semanas eximidas guardadas.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Objetivo semanal (${minutenEs(minuten)})` : "Sin objetivo semanal"} guardado para ${ok} de ${gesamt} estudiante${gesamt === 1 ? "" : "s"} - se aplica a partir del lunes ` +
      `${naechsterMontagEs(jetztMs)} a las 8.`,
    klassenZielFehler: (namen: string) =>
      ` No ha funcionado para ${namen} - vuelva a intentarlo, por favor.`,
    sperreNichtAufgehoben: "No se pudo quitar el bloqueo.",
    sperreAufgehoben:
      "El bloqueo se ha quitado - desde ahora el tiempo practicado vuelve a contar para el objetivo semanal.",
    stundeNichtGesperrt: "No se pudo bloquear la hora.",
    gesperrtBisStatus: (zeit: string) =>
      `Objetivo semanal bloqueado para la clase hasta las ${zeit} - ` +
      `el tiempo de práctica y las estadísticas siguen contando, solo el objetivo semanal queda en pausa.`,
    stundeGesperrt: "La hora está bloqueada.",
    excelLaeuft: "Se está creando el archivo de Excel - un momento.",
    excelFertig: (datei: string) =>
      `"${datei}" descargado - con un resumen y su leyenda, más cuatro hojas: curso escolar, total, mes y semana.`,
    excelFehler:
      "No se pudo crear el archivo de Excel. Vuelva a intentarlo, por favor; " +
      "si sigue ocurriendo, avísenos.",
    laedt: "Cargando …",
    lesefehlerStark: "No se pudo leer el nivel",
    lesefehlerFuer: (namen: string) => [
      " de",
      " ",
      namen,
      ". Por eso las cifras de estas filas están vacías y ",
    ],
    lesefehlerNicht: "no",
    lesefehlerSchluss:
      " significan que nadie haya escrito. Vuelva a cargar la página, por favor; si sigue ocurriendo, avísenos.",
    aufgabenGruppe: "Actividades para la clase",
    tippchallengeTipp:
      "Abre el Reto para toda la clase: fijar el texto y la duración - y después también aquí los resultados.",
    tippchallenge: PRUEFUNG_WORT_ES,
    eigeneUebungTipp:
      "Asigna a la clase un archivo subido como texto obligatorio - cada estudiante lo practica a su propio ritmo; así no se desbloquea ninguna tecla nueva.",
    eigeneUebung: EIGENE_UEBUNG_WORT_ES,
    wochenzielTipp:
      "Fija cuántos minutos por semana debe practicar la clase - para cada estudiante por separado o para todos a la vez.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "fijado",
    keinZiel: "sin objetivo",
    einstellungenTipp:
      "Fijar el curso, el idioma, el nivel de partida y la Competición de la clase para toda la clase.",
    einstellungenDerKlasse: "Configuración de la clase",
    sperreBeendenTipp:
      "Termina el bloqueo al instante - después, el tiempo practicado vuelve a contar para el objetivo semanal.",
    sperrenTipp:
      "Bloquea el objetivo semanal durante 60 minutos, para toda la clase. Se sigue practicando - el tiempo de práctica y las estadísticas siguen contando, solo el objetivo semanal queda en pausa.",
    gesperrtBisKnopf: (zeit: string) => `Bloqueado hasta las ${zeit} - quitar`,
    stundeSperren: "Bloquear la hora",
    wochenzielAufgabe: "Objetivo semanal - actividad",
    zielFuerKlasseGesetzt: "- fijado para el alumnado de esta clase",
    nochKeinZielGesetzt: "- todavía sin objetivo fijado",
    minutenZuerst: "Indique primero los minutos por semana - de 0 a 600.",
    klassenZielTipp:
      "Fija este objetivo semanal a partir de la semana que viene para cada estudiante de esta clase - también para quienes se incorporen más tarde. Los objetivos fijados por separado se sustituyen.",
    fuerKlasseUebernehmen: "Aplicar a toda la clase",
    wochenzielFuerKlasse: (bezeichnung: string) => `Objetivo semanal para ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Descargar en Excel: descarga la tabla como archivo de Excel ` +
      `"${datei}" - primero con un ` +
      `resumen y su leyenda, después cuatro hojas: el curso escolar actual, ` +
      `el total, el mes (las últimas 4 semanas) y esta semana, sea cual sea ` +
      `el periodo elegido aquí.`,
    alsExcel: "Descargar en Excel",
    schulstufeKind: "Curso",
    schulstufeKindName: (name: string) => `Curso de ${name}`,
    wieDieKlasse: (klasse: string) => `como la clase (${klasse})`,
    schulstufeKindTipp:
      'Solo para esta persona: el curso determina los textos y sustituye al de la clase. Avanza solo con cada curso escolar. "Como la clase" quita la excepción.',
    schulstufeKindGesetzt: (name: string, stufe: string) =>
      `${name} recibe ahora textos para ${stufe}.`,
    schulstufeKindErwachsen: (name: string) => `${name} recibe ahora textos para personas adultas.`,
    schulstufeKindWieKlasse: (name: string) => `${name} vuelve a recibir los textos de la clase.`,
  },
  // ★ O-IT (02.10.2026): liest nur die Lehrkraft - neutral, Infinitiv oder „si",
  // nie „Lei" (Glossar Regel 1); „alunni" als Sammelwort, die einzelne „persona"
  // (Regel 2). „obiettivo settimanale", „esonerare", „Sospendere l'obiettivo",
  // „Gara di classe", „Sfida" (weiblich), „battute al minuto" (Glossar §2.6).
  it: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Il nuovo obiettivo di ${minutenIt(Math.round(minuten))} alla settimana vale da lunedì ` +
      `${naechsterMontagIt(jetztMs)} alle 8:00. Fino ad allora resta l'obiettivo attuale.`,
    keinZielMehr: (jetztMs: number) =>
      `Da lunedì ${naechsterMontagIt(jetztMs)} alle 8:00 non c'è più un obiettivo settimanale. ` +
      `Fino ad allora resta l'obiettivo attuale.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `L'unica persona di questa classe riceve ${minutenIt(minuten)} alla settimana.`
            : "L'unica persona di questa classe non ha più un obiettivo settimanale."
          : minuten > 0
            ? `Tutti i ${anzahlKinder} alunni ricevono ${minutenIt(minuten)} alla settimana.`
            : `Tutti i ${anzahlKinder} alunni non hanno più un obiettivo settimanale.`;
      return (
        `${satz} Vale da lunedì ${naechsterMontagIt(jetztMs)} alle 8:00 - fino ad allora ` +
        `resta l'obiettivo attuale. Gli obiettivi impostati per una sola persona vengono sostituiti. ` +
        (minuten > 0
          ? "Anche chi arriva più tardi riceve questo obiettivo."
          : "Anche chi arriva più tardi non lo riceve.")
      );
    },
    wochenziel: "Obiettivo settimanale",
    minutenProWoche: "Minuti alla settimana",
    nullKeinZiel: "0 = nessun obiettivo settimanale.",
    zielKalenderwochen: "Settimane con obiettivo",
    speichernTipp: (name: string) =>
      `Salva insieme i minuti, le settimane con obiettivo e il recupero per ${name} - dopo una conferma. La modifica vale dalla prossima settimana.`,
    nichtsGeaendert: "Nell'obiettivo settimanale non è cambiato niente - è già salvato.",
    speichern: "Salva",
    nachholenTipp:
      "I minuti in più completano gli obiettivi settimanali non raggiunti delle settimane precedenti - prima il più vecchio.",
    nachholen: "Recuperare i minuti mancanti delle settimane precedenti",
    dieseWoche: "Questa settimana:",
    min: "min",
    keinWochenziel: "nessun obiettivo settimanale",
    anstehend: (datum: string, minuten: number) => [" - da lun ", datum, ": ", minuten, " min"],
    ueberfaelligTipp:
      "Azzera i minuti arretrati delle settimane precedenti - da questa settimana l'obiettivo settimanale riparte da zero. Il tempo di esercizio già fatto resta.",
    ueberfaelligZuruecksetzen: "Azzerare i minuti arretrati",
    zuletztZurueckgesetzt: (ab: string) => ["ultimo azzeramento: ", ab],
    erlassenTipp:
      "Le settimane scelte non contano mai come non raggiunte né come arretrate - che la casella della settimana con obiettivo sia selezionata o no. Il tempo di esercizio già fatto resta.",
    wochenzielErlassen: "Esonerare dall'obiettivo settimanale",
    wochenzielFuer: (name: string) => `Obiettivo settimanale per ${name}`,
    uebernehmen: "Applica",
    abbrechen: "Annulla",
    einstellungen: "Impostazioni",
    womitAnfangen: "Da dove iniziare?",
    womitTipp:
      "quello che ogni persona sa già fare - se si sceglie un livello più basso, la persona torna indietro (dopo una conferma); statistiche e medaglie restano.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `${name} è a "${label}".\n\n` +
      `Riportare davvero a "${ziel}"?\n\n` +
      `Gli esercizi si limitano poi ai tasti fino a quel punto. Le statistiche di scrittura, ` +
      `il tempo di esercizio e le medaglie restano - chi più tardi torna avanti ` +
      `li ritrova intatti.\n\n` +
      `Vale dalla prossima volta che ${name} apre Tastenflow.`,
    womitName: (name: string) => `Da dove inizia ${name}`,
    ausstehend: (name: string) => ["Vale dalla prossima volta che ", name, " apre Tastenflow."],
    einhandTipp:
      "Maiuscole e caratteri speciali si accettano con qualsiasi tasto Maiusc (o Bloc Maiusc) - la regola della mano opposta per il tasto Maiusc è disattivata per questa persona.",
    einhandName: (name: string) =>
      `Scrivere con una mano per ${name}: regola della mano opposta disattivata`,
    einhand: "Scrivere con una mano",
    tempoTipp:
      "Per questa persona la velocità non conta da nessuna parte - nessun cronometro nel gioco, nessun traguardo di velocità per le stelle, nessun passaggio di livello in su o in giù, e il tempo di esercizio continua a contare anche con pause lunghe. Per chi scrive con cura ma molto lentamente.",
    tempoName: (name: string) =>
      `La velocità non conta per ${name}: la velocità non viene valutata da nessuna parte`,
    tempoZaehltNicht: "La velocità non conta",
    abstand: "Spaziatura ampia (CVI)",
    abstandTipp: `Più spazio tra OGNI carattere quando si ricopia - per chi ha una disabilità visiva di origine cerebrale (CVI), quando i caratteri troppo vicini si confondono. "Doppia" dà il doppio, "tripla" il triplo e "quadrupla" il quadruplo dello spazio per carattere. Mentre si scrive, tutto si scurisce tranne il campo in cui si scrive (riga di esercizio o zona di gioco); dopo 5 secondi senza premere nessun tasto, tutto torna chiaro. La riga di esercizio scorre poi al ritmo di scrittura della persona fino al carattere successivo - piano se scrive piano - invece di saltare. "Semplice" lascia i caratteri alla distanza normale e attiva solo lo scurimento, lo scorrimento della riga e la riga di lettura. Ogni persona può anche cambiare la spaziatura nelle proprie impostazioni (ingranaggio, Alt + O), tutte le volte che vuole - e qui la si può ricambiare in qualsiasi momento. Conta l'ultima scelta.`,
    abstandName: (name: string) => `Spaziatura ampia (CVI) per ${name}`,
    listenTitel: "Alunni della classe con livello e obiettivo settimanale",
    tastenSr: (sitzen: number, frei: number) => [
      sitzen,
      " di ",
      frei,
      " tasti sbloccati sono imparati",
    ],
    bezugBlock: (datum: string) => `le 4 settimane di esercizio ${dalIt(datum)}`,
    bezugWoche: (datum: string) => `la settimana ${dalIt(datum, "del")}`,
    gruppePerson: "Persona",
    gruppeStand: "Livello e tempo di esercizio",
    gruppeUeben: "Esercizio",
    gruppePruefung: PRUEFUNG_WORT_IT,
    kopfName: "Nome",
    kopfStufe: "Livello",
    kopfTasten: "Tasti",
    kopfNaechste: "Prossimi tasti",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "tutti i tasti imparati" : `poi ${namen.join(", poi ")}`,
    kopfUebezeit: "Tempo di esercizio",
    kopfWochenziel: "Obiettivo settimanale",
    kopfWochenziele: "Obiettivi settimanali",
    kopfTreffer: "Precisione",
    kopfTempo: "Battute al minuto",
    kopfScore: "Punteggio",
    uebungszeiten: "Tempi di esercizio",
    nochKeineUebung: "ancora nessun esercizio registrato",
    uebungszeitenKennzahl: (dauer: string, wochen: number) =>
      `${dauer} - ${wochen} ${wochen === 1 ? "settimana" : "settimane"}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - in ",
      tage,
      tage === 1 ? " giorno" : " giorni",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt} su ${ziel} min`,
    periodeMatches: (n: number) => ` - ${n} ${n === 1 ? "Gara" : "Gare"} di classe`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Ancora nessuna Gara di classe giocata fino alla fine"
        : `${n} ${n === 1 ? "Gara di classe giocata" : "Gare di classe giocate"} fino alla fine`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Conta ogni Gara di classe che ${name} ha giocato fino alla fine in questa classe ` +
      `- ${dalIt(seit)}; prima di quella data non venivano registrate. ` +
      `Le gare interrotte o lasciate prima della fine non contano. Una gara conta ` +
      `circa un'ora dopo la fine. Solo il numero: nessuna classifica, e chi ha vinto ` +
      `non viene contato.`,
    kopfKlassenmatch: "Gara di classe",
    klassenmatchOhneZahl: "Gara di classe: nessun dato",
    gruppeKlassenmatch: "Gara di classe",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Quante Gare di classe sono state giocate fino alla fine. Quelle interrotte ` +
      `o lasciate prima della fine non contano; chi ha vinto non viene contato. Registrato ` +
      `${dalIt(seit)}. Un trattino significa: la Gara di classe è disattivata per questa ` +
      `classe, oppure non è stato possibile caricare il numero.`,
    wocheHilfe: (pauseMin: number) =>
      `Aprendo si vede ogni tempo di esercizio di questa settimana: giorno, ora di ` +
      `inizio e di fine, il tempo esercitato e che cosa si è esercitato. Il tempo esercitato è il tempo ` +
      `di scrittura vero e proprio - le pause non contano, per questo di solito è più breve ` +
      `dell'intervallo mostrato. Dopo più di ${pauseMin} minuti senza premere nessun tasto, inizia un nuovo tempo ` +
      `di esercizio.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Il mio allenamento",
        lektion: "Lezioni",
        geschichte: "Storie",
        wortspiel: "Giochi di parole",
        tippchallenge: PRUEFUNG_WORT_IT,
        klassenmatch: "Gara di classe",
        "eigene-uebung": EIGENE_UEBUNG_WORT_IT,
      })[art],
    wackligeTasten: "Tasti incerti",
    nochZuWenigGeuebt: "ancora poco esercizio",
    zuWenigUmZuSagen: "C'è ancora troppo poco esercizio per dirlo.",
    wackligCaption: (name: string) => ["Tasti incerti di ", name],
    tasteKopf: "Tasto",
    tasteHilfe: (prozent: number) =>
      `Un tasto ancora incerto - almeno ${WACKLIG_MIND_ANSCHLAEGE} tentativi, con meno del ${prozentText(prozent, "it")} di battute giuste.`,
    trefferKopf: "Precisione",
    trefferHilfe: "La percentuale di battute giuste su questo tasto.",
    tempoKopf: "Velocità",
    tempoHilfe: "Quanto velocemente è venuto questo tasto l'ultima volta - battute di questo tasto al minuto.",
    abzeichen: (n: number) => ["Medaglie - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_IT} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_IT,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_IT} di ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Impostazioni per ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Obiettivo settimanale ${zielMin} min` : "nessun obiettivo settimanale",
    ],
    eigenstaendigkeit: (n: number) => ["Lavoro autonomo -", " ", n, n === 1 ? " indizio" : " indizi", ""],
    knopfTipp: (name: string) =>
      `Impostazioni e resoconto di ${name} - impostazioni, tempi di esercizio, tasti incerti e medaglie; tutto il resto in "I miei progressi" di ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Chiudi" : "Apri"} le impostazioni e il resoconto di ${name}`,
    keinZielGesetzt: "nessun obiettivo settimanale impostato",
    keineAbgeschlossene: "ancora nessuna settimana con obiettivo conclusa",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      prozent,
      " per cento degli obiettivi settimanali raggiunti, ",
      ganz,
      " su",
      " ",
      gesamt,
      " settimane complete",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["su ", ganz, "/", gesamt, " settimane complete"],
    wocheErlassen: "questa settimana è esonerata",
    keineZielwoche: "non è una settimana con obiettivo",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " su ", nenner, " minuti"],
    offenSr: (minuten: number) => `, di cui ${minuten} minuti da recuperare dalle settimane precedenti`,
    erreichtSr: ", obiettivo settimanale raggiunto",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min da recuperare"],
    klasseNichtGespeichert: "Non è stato possibile salvare le impostazioni della classe.",
    kinderEingetragen: (n: number) =>
      ` Salvato per ${alunniIt(n)} - ` +
      `vale dalla prossima apertura di Tastenflow. Statistiche e medaglie restano.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Il punto di partenza "${label}" ora vale per la classe - anche per chi arriva più tardi.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Non è stato possibile salvare il valore predefinito della classe.${kinderSatz}`,
    gesperrtZusatz: " (bloccato)",
    stufeWaehlen: "Scegliere un livello",
    vorgabeKlasse: (label: string) => `Valore predefinito della classe: "${label}"`,
    dieMeisten: (label: string) => `la maggior parte è a "${label}"`,
    bezugKlasse: (name: string) => `della classe ${name}`,
    startHinweis:
      "quello che la classe sa già fare - vale per tutti gli alunni di questa classe, anche per chi arriva più tardi",
    startSrHinweis:
      "La prima voce indica il valore predefinito della classe e il livello a cui è la maggior parte. " +
      "Chi sceglie un livello lo salva come valore predefinito della classe - vale anche per chi arriva più tardi - " +
      "e lo registra per gli alunni che ci sono già; se qualcuno è già più avanti, il programma lo chiede prima. " +
      "Vale dalla prossima volta che ogni persona apre Tastenflow; statistiche e medaglie restano.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Classe frequentata tolta. Vale di nuovo il valore predefinito (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Classe frequentata: persone adulte. I testi ora sono adatti a persone adulte (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Classe frequentata: ${schulstufeLabelIt(wert)}. I testi ora sono adatti all'età ` +
      `${label}.`,
    spracheDerKlasse: (sprache: string) => `Lingua della classe: ${sprache}.`,
    spracheGesperrt: "La lingua è bloccata per gli alunni di questa classe.",
    spracheFrei: "La lingua è di nuovo libera.",
    matchNichtUmgestellt: "Non è stato possibile cambiare la Gara di classe.",
    matchErlaubt: "La Gara di classe è permessa in questa classe.",
    matchAus: "La Gara di classe è disattivata in questa classe.",
    zeilenEndeAn:
      "Ogni riga ora finisce con il tasto Invio - per tutti gli alunni di questa classe.",
    zeilenEndeAus: "La fine della riga con Invio è disattivata in questa classe.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `L'anno scolastico di questa classe ora inizia il primo ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Ortografia: ${label} - per tutti gli alunni di questa classe.`,
    schreibweiseAutoLabel: "automatica",
    schreibweiseGbLabel: "britannica",
    schreibweiseUsLabel: "statunitense",
    startFrageTitel: "Punto di partenza per tutta la classe",
    frageVor: (n: number) => ["Nella classe ", n === 1 ? "c'è" : "ci sono", " "],
    frageStark: (n: number) => [n, " ", n === 1 ? "persona" : "alunni"],
    frageNach: (n: number) => [
      " ",
      (n === 1 ? "che è già più avanti" : "che sono già più avanti") +
        " del livello scelto. Portare davvero tutta la classe a questo livello?",
    ],
    detailVor: "Scelto: ",
    detailNach: (namen: string) => [
      ". Già più avanti:",
      " ",
      namen,
      ". Riportare indietro qualcuno toglie contenuti già imparati - le statistiche di scrittura, il tempo di esercizio e le medaglie restano in ogni caso. Vale dalla prossima volta che ogni persona apre Tastenflow.",
    ],
    alleEinstufen: "Impostare il livello di tutta la classe",
    nurNochNicht: "Solo chi non ci è ancora arrivato",
    startZurueck: (name: string, label: string) =>
      `Livello di ${name} riportato a "${label}" - vale dalla prossima apertura di Tastenflow. ` +
      `Statistiche e medaglie restano.`,
    startpunktVon: (name: string, label: string) => `Punto di partenza di ${name}: "${label}".`,
    wochenzielNichtGespeichert: (name: string) =>
      `Non è stato possibile salvare l'obiettivo settimanale di ${name}.`,
    wochenzielGespeichert: (name: string) => `Obiettivo settimanale di ${name} salvato.`,
    ueberfaelligFrage: (name: string) =>
      `Azzerare i minuti arretrati dell'obiettivo settimanale di ${name}?\n\n` +
      `Si cancellano gli arretrati accumulati finora; da questa settimana ` +
      `l'obiettivo settimanale riparte da zero. Il tempo di esercizio già fatto e le statistiche restano.`,
    ueberfaelligErledigt: (name: string) => `Minuti arretrati di ${name} azzerati.`,
    erlasseneGespeichert: "Settimane esonerate salvate.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Obiettivo settimanale (${minutenIt(minuten)})` : "Nessun obiettivo settimanale"} salvato per ${ok} su ${alunniIt(gesamt)} - vale da lunedì ` +
      `${naechsterMontagIt(jetztMs)} alle 8:00.`,
    klassenZielFehler: (namen: string) =>
      ` Non ha funzionato per ${namen} - riprovare, per favore.`,
    sperreNichtAufgehoben: "Non è stato possibile riprendere l'obiettivo.",
    sperreAufgehoben:
      "L'obiettivo è ripreso - da adesso il tempo di esercizio conta di nuovo per l'obiettivo settimanale.",
    stundeNichtGesperrt: "Non è stato possibile sospendere l'obiettivo per un'ora.",
    gesperrtBisStatus: (zeit: string) =>
      `Obiettivo settimanale sospeso per la classe fino alle ${zeit} - ` +
      `il tempo di esercizio e le statistiche continuano a contare, solo l'obiettivo settimanale è in pausa.`,
    stundeGesperrt: "L'obiettivo è sospeso per un'ora.",
    excelLaeuft: "Il file Excel è in preparazione - un momento.",
    excelFertig: (datei: string) =>
      `"${datei}" scaricato - con una panoramica e la sua legenda, più quattro fogli: anno scolastico, dall'inizio, mese e settimana.`,
    excelFehler:
      "Non è stato possibile creare il file Excel. Riprovare, per favore; " +
      "se succede ancora, segnalarlo.",
    laedt: "Caricamento in corso...",
    lesefehlerStark: "Non è stato possibile leggere il livello",
    lesefehlerFuer: (namen: string) => [
      " di",
      " ",
      namen,
      ". Per questo i numeri di queste righe sono vuoti e ",
    ],
    lesefehlerNicht: "non",
    lesefehlerSchluss:
      " significano che nessuno ha scritto. Ricaricare la pagina, per favore; se succede ancora, segnalarlo.",
    aufgabenGruppe: "Attività per la classe",
    tippchallengeTipp:
      "Apre la Sfida per tutta la classe: scegliere testo e durata - e poi, sempre qui, i risultati.",
    tippchallenge: PRUEFUNG_WORT_IT,
    eigeneUebungTipp:
      "Assegna alla classe un file caricato come testo da esercitare - ogni persona lo esercita al proprio ritmo; così non si sblocca nessun tasto nuovo.",
    eigeneUebung: EIGENE_UEBUNG_WORT_IT,
    wochenzielTipp:
      "Imposta quanti minuti alla settimana si esercita la classe - per ogni persona o per tutti insieme.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "impostato",
    keinZiel: "nessun obiettivo",
    einstellungenTipp:
      "Impostare classe frequentata, lingua, punto di partenza e Gara di classe per tutta la classe.",
    einstellungenDerKlasse: "Impostazioni della classe",
    sperreBeendenTipp:
      "Riprende subito l'obiettivo - poi il tempo di esercizio conta di nuovo per l'obiettivo settimanale.",
    sperrenTipp:
      "Sospende l'obiettivo settimanale per 60 minuti, per tutta la classe. Ci si esercita lo stesso - il tempo di esercizio e le statistiche continuano a contare, solo l'obiettivo settimanale è in pausa.",
    gesperrtBisKnopf: (zeit: string) => `Sospeso fino alle ${zeit} - riprendere`,
    stundeSperren: "Sospendere per 1 ora",
    wochenzielAufgabe: "Obiettivo settimanale - attività",
    zielFuerKlasseGesetzt: "- impostato per gli alunni di questa classe",
    nochKeinZielGesetzt: "- ancora nessun obiettivo impostato",
    minutenZuerst: "Prima indicare i minuti alla settimana - da 0 a 600.",
    klassenZielTipp:
      "Imposta questo obiettivo settimanale dalla prossima settimana per ogni persona di questa classe - anche per chi arriva più tardi. Gli obiettivi impostati per una sola persona vengono sostituiti.",
    fuerKlasseUebernehmen: "Applica a tutta la classe",
    wochenzielFuerKlasse: (bezeichnung: string) => `Obiettivo settimanale per ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Scaricare in Excel: scarica la tabella come file Excel ` +
      `"${datei}" - prima con una ` +
      `panoramica e la sua legenda, poi quattro fogli: l'anno scolastico in corso, ` +
      `dall'inizio, il mese (le ultime 4 settimane) e questa settimana, qualunque sia ` +
      `il periodo scelto qui.`,
    alsExcel: "Scarica in Excel",
    schulstufeKind: "Classe frequentata",
    schulstufeKindName: (name: string) => `Classe frequentata di ${name}`,
    wieDieKlasse: (klasse: string) => `come la classe (${klasse})`,
    schulstufeKindTipp:
      `Solo per questa persona: la classe frequentata decide i testi e sostituisce quella della classe. Avanza da sola a ogni anno scolastico. "Come la classe" toglie l'eccezione.`,
    schulstufeKindGesetzt: (name: string, stufe: string) =>
      `${name} ora riceve testi per ${stufe}.`,
    schulstufeKindErwachsen: (name: string) => `${name} ora riceve testi per persone adulte.`,
    schulstufeKindWieKlasse: (name: string) => `${name} riceve di nuovo i testi della classe.`,
  },
  // ★ O-PL (02.10.2026): Lehrkraft ty-Befehlsform und unpersönlich, nie
  // Pan/Pani (Glossar Regel 1); Kinder als „osoba"/„uczniowie" (Regel 2),
  // Namen nur nach Doppelpunkt oder als Subjekt im Präsens (Regel 11), Zahl +
  // Hauptwort mit allen vier Formen; Wochenziel nach §2.6 (cel tygodniowy,
  // nadrobić, zwolnić z celu, Wstrzymaj na godzinę), Vergleiche im Miejscownik
  // („w tygodniu od 10 sie"), wie `vergleichsName` sie für pl baut.
  pl: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Nowy cel (${minutenPl(Math.round(minuten))} tygodniowo) obowiązuje od poniedziałku ` +
      `${naechsterMontagPl(jetztMs)}, od 8:00. Do tego czasu obowiązuje dotychczasowy cel.`,
    keinZielMehr: (jetztMs: number) =>
      `Od poniedziałku ${naechsterMontagPl(jetztMs)}, od 8:00, nie będzie już celu tygodniowego. ` +
      `Do tego czasu obowiązuje dotychczasowy cel.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `Jedyna osoba w tej klasie dostaje cel: ${minutenPl(minuten)} tygodniowo.`
            : "Jedyna osoba w tej klasie nie ma już celu tygodniowego."
          : minuten > 0
            ? `Uczniowie tej klasy (${anzahlKinder}) dostają cel: ${minutenPl(minuten)} tygodniowo.`
            : `Uczniowie tej klasy (${anzahlKinder}) nie mają już celu tygodniowego.`;
      return (
        `${satz} Obowiązuje od poniedziałku ${naechsterMontagPl(jetztMs)}, od 8:00 - do tego czasu ` +
        `obowiązuje dotychczasowy cel. Cele ustawione dla pojedynczych osób zostaną zastąpione. ` +
        (minuten > 0
          ? "Osoby, które dołączą później, też dostaną ten cel."
          : "Osoby, które dołączą później, też nie dostaną celu.")
      );
    },
    wochenziel: "Cel tygodniowy",
    minutenProWoche: "Minuty tygodniowo",
    nullKeinZiel: "0 = bez celu tygodniowego.",
    zielKalenderwochen: "Tygodnie z celem",
    speichernTipp: (name: string) =>
      `Zapisuje razem minuty, tygodnie z celem i nadrabianie - po potwierdzeniu. Osoba: ${name}. Zmiana obowiązuje od następnego tygodnia.`,
    nichtsGeaendert: "W celu tygodniowym nic się nie zmieniło - jest już zapisany.",
    speichern: "Zapisz",
    nachholenTipp:
      "Dodatkowe minuty uzupełniają nieosiągnięte cele z poprzednich tygodni - najpierw najstarszy.",
    nachholen: "Nadrób brakujące minuty z poprzednich tygodni",
    dieseWoche: "Ten tydzień:",
    min: "min",
    keinWochenziel: "bez celu tygodniowego",
    anstehend: (datum: string, minuten: number) => [" - od pon. ", datum, ": ", minuten, " min"],
    ueberfaelligTipp:
      "Zeruje zaległe minuty z poprzednich tygodni - od tego tygodnia cel tygodniowy zaczyna się od zera. Przećwiczony czas zostaje.",
    ueberfaelligZuruecksetzen: "Wyzeruj zaległe minuty",
    zuletztZurueckgesetzt: (ab: string) => ["ostatnio wyzerowano: ", ab],
    erlassenTipp:
      "Wybrane tygodnie nigdy nie liczą się jako nieosiągnięte ani zaległe - niezależnie od tego, czy tydzień z celem jest zaznaczony. Przećwiczony czas zostaje.",
    wochenzielErlassen: "Zwolnij z celu tygodniowego",
    wochenzielFuer: (name: string) => `Cel tygodniowy: ${name}`,
    uebernehmen: "Zastosuj",
    abbrechen: "Anuluj",
    einstellungen: "Ustawienia",
    womitAnfangen: "Od czego zacząć?",
    womitTipp:
      "to, co dana osoba już umie - wybór niższego poziomu cofa ją (po potwierdzeniu); statystyki i odznaki zostają.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `Osoba: ${name}. Obecny poziom: „${label}”.\n\n` +
      `Naprawdę cofnąć do „${ziel}”?\n\n` +
      `Ćwiczenia ograniczą się wtedy do klawiszy do tego miejsca. Statystyki pisania, ` +
      `czas ćwiczeń i odznaki zostają - kto później znów pójdzie dalej, ` +
      `zastanie je nienaruszone.\n\n` +
      `Obowiązuje od następnego otwarcia programu Tastenflow przez tę osobę.`,
    womitName: (name: string) => `Od czego zaczyna: ${name}`,
    ausstehend: (name: string) => ["Obowiązuje od następnego otwarcia programu Tastenflow (", name, ")."],
    einhandTipp:
      "Wielkie litery i symbole są przyjmowane z dowolnym klawiszem Shift (albo Caps Lock) - zasada drugiej ręki dla klawisza Shift jest dla tej osoby wyłączona.",
    einhandName: (name: string) => `Pisanie jedną ręką: ${name} - zasada drugiej ręki wyłączona`,
    einhand: "Pisanie jedną ręką",
    tempoTipp:
      "Dla tej osoby tempo nigdzie się nie liczy - bez stopera w grze, bez progu tempa przy gwiazdkach, bez zmiany poziomu w górę ani w dół, a czas ćwiczeń liczy się dalej także przy długich przerwach. Dla osób, które piszą starannie, ale bardzo wolno.",
    tempoName: (name: string) => `Bez pośpiechu: ${name} - tempo nigdzie nie jest oceniane`,
    tempoZaehltNicht: "Bez pośpiechu",
    abstand: "Duże odstępy (CVI)",
    abstandTipp: `Więcej miejsca między KAŻDYM znakiem przy przepisywaniu - dla osób z mózgowymi zaburzeniami widzenia (CVI), gdy zbyt bliskie znaki zlewają się. „Podwójne” daje dwa razy, „potrójne” trzy razy, a „poczwórne” cztery razy więcej miejsca na znak. Podczas pisania wszystko ciemnieje oprócz pola, w którym się pisze (wiersza ćwiczenia albo pola gry); po 5 sekundach bez naciśnięcia klawisza wszystko znów się rozjaśnia. Wiersz ćwiczenia przesuwa się wtedy w tempie pisania tej osoby do następnego znaku - wolno, gdy pisze wolno - zamiast przeskakiwać. „Pojedyncze” zostawia znaki w zwykłej odległości i włącza tylko przyciemnianie, przesuwanie wiersza i wiersz do czytania. Każda osoba może też zmienić odstępy we własnych ustawieniach (koło zębate, Alt + O), tyle razy, ile chce - a tutaj można je w każdej chwili zmienić z powrotem. Liczy się ostatni wybór.`,
    abstandName: (name: string) => `Duże odstępy (CVI): ${name}`,
    listenTitel: "Uczniowie klasy z poziomem i celem tygodniowym",
    tastenSr: (sitzen: number, frei: number) => [
      "Opanowane klawisze: ",
      sitzen,
      " z ",
      frei,
      " odblokowanych",
    ],
    bezugBlock: (datum: string) => `w 4 tygodniach ćwiczeń od ${datum}`,
    bezugWoche: (datum: string) => `w tygodniu od ${datum}`,
    gruppePerson: "Osoba",
    gruppeStand: "Postępy i czas ćwiczeń",
    gruppeUeben: "Ćwiczenia",
    gruppePruefung: PRUEFUNG_WORT_PL,
    kopfName: "Imię",
    kopfStufe: "Poziom",
    kopfTasten: "Klawisze",
    kopfNaechste: "Następne klawisze",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "wszystkie klawisze opanowane" : `potem ${namen.join(", potem ")}`,
    kopfUebezeit: "Czas ćwiczeń",
    kopfWochenziel: "Cel tygodniowy",
    kopfWochenziele: "Cele tygodniowe",
    kopfTreffer: "Dokładność",
    kopfTempo: "Uderzenia/min",
    kopfScore: "Wynik",
    uebungszeiten: "Czasy ćwiczeń",
    nochKeineUebung: "nie zapisano jeszcze żadnych ćwiczeń",
    uebungszeitenKennzahl: (dauer: string, wochen: number) => `${dauer} - tygodnie: ${wochen}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - dni: ",
      tage,
      "",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt} z ${ziel} min`,
    periodeMatches: (n: number) => ` - Wyścigi klasowe: ${n}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Nie ma jeszcze Wyścigu klasowego rozegranego do końca"
        : `Wyścigi klasowe rozegrane do końca: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Liczy każdy Wyścig klasowy rozegrany do końca w tej klasie - od ${seit}; ` +
      `wcześniejszych nie zapisywano. Osoba: ${name}. ` +
      `Wyścigi przerwane albo opuszczone przed końcem się nie liczą. Wyścig liczy się ` +
      `mniej więcej godzinę po końcu. Tylko liczba: bez rankingu, zwycięstwa ` +
      `nie są liczone.`,
    kopfKlassenmatch: "Wyścig klasowy",
    klassenmatchOhneZahl: "Wyścig klasowy: brak danych",
    gruppeKlassenmatch: "Wyścig klasowy",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Ile Wyścigów klasowych rozegrano do końca. Przerwane albo opuszczone ` +
      `przed końcem się nie liczą; zwycięstwa nie są liczone. Zapisywane ` +
      `od ${seit}. Kreska oznacza: Wyścig klasowy jest w tej klasie wyłączony ` +
      `albo nie udało się wczytać liczby.`,
    wocheHilfe: (pauseMin: number) =>
      `Po rozwinięciu widać każdy czas ćwiczeń z tego tygodnia: dzień, godzinę ` +
      `początku i końca, przećwiczony czas i to, co było ćwiczone. Przećwiczony czas ` +
      `to samo pisanie - przerwy się nie liczą, dlatego zwykle jest krótszy ` +
      `niż pokazany przedział. Po ponad ${pauseMin} min bez naciśnięcia klawisza zaczyna się ` +
      `nowy czas ćwiczeń.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Mój trening",
        lektion: "Lekcje",
        geschichte: "Opowiadania",
        wortspiel: "Gry słowne",
        tippchallenge: PRUEFUNG_WORT_PL,
        klassenmatch: "Wyścig klasowy",
        "eigene-uebung": EIGENE_UEBUNG_WORT_PL,
      })[art],
    wackligeTasten: "Niepewne klawisze",
    nochZuWenigGeuebt: "jeszcze za mało ćwiczeń",
    zuWenigUmZuSagen: "Na razie jest za mało ćwiczeń, żeby to ocenić.",
    wackligCaption: (name: string) => ["Niepewne klawisze: ", name],
    tasteKopf: "Klawisz",
    tasteHilfe: (prozent: number) =>
      `Klawisz jeszcze niepewny - prób co najmniej ${WACKLIG_MIND_ANSCHLAEGE}, trafnych uderzeń mniej niż ${prozentText(prozent, "pl")}.`,
    trefferKopf: "Dokładność",
    trefferHilfe: "Odsetek trafnych uderzeń w ten klawisz.",
    tempoKopf: "Tempo",
    tempoHilfe: "Jak szybko szedł ostatnio ten klawisz - uderzenia w ten klawisz na minutę.",
    abzeichen: (n: number) => ["Odznaki - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_PL} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_PL,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_PL}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Ustawienia: ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Cel tygodniowy ${zielMin} min` : "bez celu tygodniowego",
    ],
    eigenstaendigkeit: (n: number) => ["Samodzielność pracy - wskazówki:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Ustawienia i podsumowanie - ustawienia, czasy ćwiczeń, niepewne klawisze i odznaki; wszystko inne w części „Moje postępy” tej osoby. Osoba: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Zamknij" : "Otwórz"} ustawienia i podsumowanie: ${name}`,
    keinZielGesetzt: "nie ustawiono celu tygodniowego",
    keineAbgeschlossene: "nie zakończono jeszcze żadnego tygodnia z celem",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      prozent,
      " procent celów tygodniowych osiągnięto, pełne tygodnie: ",
      ganz,
      " z",
      " ",
      gesamt,
      "",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["pełne tygodnie: ", ganz, "/", gesamt, ""],
    wocheErlassen: "ten tydzień jest zwolniony z celu",
    keineZielwoche: "to nie jest tydzień z celem",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " z ", nenner, " min"],
    offenSr: (minuten: number) => `, w tym do nadrobienia z poprzednich tygodni: ${minuten} min`,
    erreichtSr: ", cel tygodniowy osiągnięty",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min do nadrobienia"],
    klasseNichtGespeichert: "Nie udało się zapisać ustawień klasy.",
    kinderEingetragen: (n: number) =>
      ` Zapisano dla: ${osobyPl(n)} - obowiązuje od następnego otwarcia programu ` +
      `Tastenflow. Statystyki i odznaki zostają.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Punkt startowy „${label}” obowiązuje teraz dla klasy - także dla osób, które dołączą później.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Nie udało się zapisać ustawienia domyślnego klasy.${kinderSatz}`,
    gesperrtZusatz: " (zablokowany)",
    stufeWaehlen: "Wybierz poziom",
    vorgabeKlasse: (label: string) => `Domyślnie dla klasy: „${label}”`,
    dieMeisten: (label: string) => `większość jest na poziomie „${label}”`,
    bezugKlasse: (name: string) => `klasy ${name}`,
    startHinweis:
      "to, co klasa już umie - dotyczy wszystkich uczniów tej klasy, także osób, które dołączą później",
    startSrHinweis:
      "Pierwsza pozycja pokazuje ustawienie domyślne klasy i poziom, na którym jest większość. " +
      "Wybór poziomu zapisuje go jako ustawienie domyślne klasy - dotyczy też osób, które dołączą później - " +
      "i wpisuje go uczniom, którzy już są w klasie; jeśli ktoś jest już dalej, program najpierw zapyta. " +
      "Obowiązuje od następnego otwarcia programu Tastenflow przez każdą osobę; statystyki i odznaki zostają.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Usunięto klasę, do której chodzą uczniowie. Znów obowiązuje ustawienie domyślne (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Klasa, do której chodzą uczniowie: osoby dorosłe. Teksty pasują teraz do osób dorosłych (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Klasa, do której chodzą uczniowie: ${schulstufeLabelPl(wert)}. Teksty pasują teraz do wieku ` +
      `${label}.`,
    spracheDerKlasse: (sprache: string) => `Język klasy: ${sprache}.`,
    spracheGesperrt: "Język jest zablokowany dla uczniów tej klasy.",
    spracheFrei: "Język jest znowu do wyboru.",
    matchNichtUmgestellt: "Nie udało się przełączyć Wyścigu klasowego.",
    matchErlaubt: "Wyścig klasowy jest w tej klasie dozwolony.",
    matchAus: "Wyścig klasowy jest w tej klasie wyłączony.",
    zeilenEndeAn:
      "Każdy wiersz kończy się teraz klawiszem Enter - dla wszystkich uczniów tej klasy.",
    zeilenEndeAus: "Koniec wiersza klawiszem Enter jest w tej klasie wyłączony.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `Rok szkolny tej klasy zaczyna się teraz pierwszego dnia miesiąca: ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Pisownia: ${label} - dla wszystkich uczniów tej klasy.`,
    schreibweiseAutoLabel: "automatyczna",
    schreibweiseGbLabel: "brytyjska",
    schreibweiseUsLabel: "amerykańska",
    startFrageTitel: "Punkt startowy dla całej klasy",
    frageVor: (_n: number) => ["Dalej niż wybrany poziom", ":", " "],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "pl", { one: () => "osoba", few: () => "osoby", many: () => "osób", other: () => "osoby" }),
    ],
    frageNach: (_n: number) => [
      ".",
      " Naprawdę ustawić całą klasę na tym poziomie?",
    ],
    detailVor: "Wybrano: ",
    detailNach: (namen: string) => [
      ". Już dalej:",
      " ",
      namen,
      ". Cofnięcie zabiera już poznane treści - statystyki pisania, czas ćwiczeń i odznaki zostają w każdym przypadku. Obowiązuje od następnego otwarcia programu Tastenflow przez każdą osobę.",
    ],
    alleEinstufen: "Ustaw całą klasę na tym poziomie",
    nurNochNicht: "Tylko osoby, które jeszcze tu nie doszły",
    startZurueck: (name: string, label: string) =>
      `Cofnięto do „${label}”: ${name} - obowiązuje od następnego otwarcia programu Tastenflow. ` +
      `Statystyki i odznaki zostają.`,
    startpunktVon: (name: string, label: string) => `Punkt startowy - ${name}: „${label}”.`,
    wochenzielNichtGespeichert: (name: string) =>
      `Nie udało się zapisać celu tygodniowego. Osoba: ${name}.`,
    wochenzielGespeichert: (name: string) => `Cel tygodniowy zapisany: ${name}.`,
    ueberfaelligFrage: (name: string) =>
      `Wyzerować zaległe minuty celu tygodniowego? Osoba: ${name}.\n\n` +
      `Zaległości zebrane do tej pory zostaną skasowane; od tego tygodnia ` +
      `cel tygodniowy zaczyna się od zera. Przećwiczony czas i statystyki zostają.`,
    ueberfaelligErledigt: (name: string) => `Zaległe minuty wyzerowane: ${name}.`,
    erlasseneGespeichert: "Zwolnione tygodnie zapisane.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Cel tygodniowy (${minutenPl(minuten)})` : "Brak celu tygodniowego"} - zapisano dla ${ok} z ${gesamt}; obowiązuje od poniedziałku ` +
      `${naechsterMontagPl(jetztMs)}, od 8:00.`,
    klassenZielFehler: (namen: string) =>
      ` Nie udało się dla: ${namen} - spróbuj jeszcze raz.`,
    sperreNichtAufgehoben: "Nie udało się wznowić celu.",
    sperreAufgehoben:
      "Cel wznowiony - od teraz czas ćwiczeń znów liczy się do celu tygodniowego.",
    stundeNichtGesperrt: "Nie udało się wstrzymać celu na godzinę.",
    gesperrtBisStatus: (zeit: string) =>
      `Cel tygodniowy klasy wstrzymany do ${zeit} - ` +
      `czas ćwiczeń i statystyki liczą się dalej, wstrzymany jest tylko cel tygodniowy.`,
    stundeGesperrt: "Cel jest wstrzymany na godzinę.",
    excelLaeuft: "Plik Excel jest przygotowywany - chwileczkę.",
    excelFertig: (datei: string) =>
      `Pobrano „${datei}” - z przeglądem i jego legendą oraz czterema arkuszami: rok szkolny, od początku, miesiąc i tydzień.`,
    excelFehler:
      "Nie udało się utworzyć pliku Excel. Spróbuj jeszcze raz; " +
      "jeśli to się powtórzy, zgłoś to.",
    laedt: "Wczytywanie...",
    lesefehlerStark: "Nie udało się odczytać postępów",
    lesefehlerFuer: (namen: string) => [
      " tych osób:",
      " ",
      namen,
      ". Dlatego liczby w tych wierszach są puste i ",
    ],
    lesefehlerNicht: "nie",
    lesefehlerSchluss:
      " oznaczają, że nikt nie pisał. Odśwież stronę; jeśli to się powtórzy, zgłoś to.",
    aufgabenGruppe: "Zadania dla klasy",
    tippchallengeTipp:
      "Otwiera Wyzwanie dla całej klasy: wybierz tekst i czas - a potem, też tutaj, wyniki.",
    tippchallenge: PRUEFUNG_WORT_PL,
    eigeneUebungTipp:
      "Przydziela klasie przesłany plik jako tekst do ćwiczenia - każda osoba ćwiczy go we własnym tempie; nie odblokowuje to nowych klawiszy.",
    eigeneUebung: EIGENE_UEBUNG_WORT_PL,
    wochenzielTipp:
      "Ustala, ile minut tygodniowo ćwiczy klasa - dla każdej osoby albo dla wszystkich naraz.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "ustawiony",
    keinZiel: "bez celu",
    einstellungenTipp:
      "Ustaw dla całej klasy: klasę, do której chodzą uczniowie, język, punkt startowy i Wyścig klasowy.",
    einstellungenDerKlasse: "Ustawienia klasy",
    sperreBeendenTipp:
      "Od razu wznawia cel - potem czas ćwiczeń znów liczy się do celu tygodniowego.",
    sperrenTipp:
      "Wstrzymuje cel tygodniowy na 60 minut dla całej klasy. Ćwiczyć można dalej - czas ćwiczeń i statystyki liczą się dalej, wstrzymany jest tylko cel tygodniowy.",
    gesperrtBisKnopf: (zeit: string) => `Wstrzymany do ${zeit} - wznów`,
    stundeSperren: "Wstrzymaj na godzinę",
    wochenzielAufgabe: "Cel tygodniowy - zadanie",
    zielFuerKlasseGesetzt: "- ustawiony dla uczniów tej klasy",
    nochKeinZielGesetzt: "- nie ustawiono jeszcze celu",
    minutenZuerst: "Najpierw podaj minuty tygodniowo - od 0 do 600.",
    klassenZielTipp:
      "Ustawia ten cel tygodniowy od następnego tygodnia dla każdej osoby w tej klasie - także dla osób, które dołączą później. Cele ustawione dla pojedynczych osób zostaną zastąpione.",
    fuerKlasseUebernehmen: "Zastosuj dla całej klasy",
    wochenzielFuerKlasse: (bezeichnung: string) => `Cel tygodniowy ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Pobierz jako plik Excel: pobiera tabelę jako plik Excel ` +
      `„${datei}” - najpierw z przeglądem i jego legendą, ` +
      `potem cztery arkusze: bieżący rok szkolny, od początku, miesiąc (ostatnie ` +
      `4 tygodnie) i ten tydzień, niezależnie od okresu wybranego tutaj.`,
    alsExcel: "Pobierz jako plik Excel",
    schulstufeKind: "Klasa, do której chodzi",
    schulstufeKindName: (name: string) => `Klasa, do której chodzi: ${name}`,
    wieDieKlasse: (klasse: string) => `jak klasa (${klasse})`,
    schulstufeKindTipp:
      "Tylko dla tej osoby: klasa, do której chodzi, decyduje o tekstach i zastępuje ustawienie klasy. Rośnie sama z każdym rokiem szkolnym. „Jak klasa” usuwa ten wyjątek.",
    schulstufeKindGesetzt: (name: string, stufe: string) => `${name} dostaje teraz teksty dla: ${stufe}.`,
    schulstufeKindErwachsen: (name: string) => `${name} dostaje teraz teksty dla osób dorosłych.`,
    schulstufeKindWieKlasse: (name: string) => `${name} znów dostaje teksty klasy.`,
  },
  // ★ O-TR (02.10.2026): Lehrkraft siz mit -(y)In (Glossar Regel 1), Knöpfe im
  // Stamm; Kinder = "öğrenci" (Regel 2); Namen, Daten, Uhrzeiten und Zahlen nur
  // nach Doppelpunkt oder vor einem eigenen Wort, nie mit Endung (Regel 6); nach
  // einer Zahl Einzahl (Regel 5); Wochenziel nach §2.6 (haftalık hedef, telafi,
  // haftayı muaf tut, Hedefi 1 saat durdur); Vergleiche als blosses Hauptwort
  // ("10 Ağu haftası"), wie `veraenderungSatzTr` sie erwartet.
  tr: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Yeni hedef: haftada ${Math.round(minuten)} dakika. Başlangıç: ${naechsterMontagTr(jetztMs)}, 08:00. ` +
      `O zamana kadar şimdiki hedef geçerlidir.`,
    keinZielMehr: (jetztMs: number) =>
      `Haftalık hedef kaldırılıyor. Geçerlilik başlangıcı: ${naechsterMontagTr(jetztMs)}, 08:00. ` +
      `O zamana kadar şimdiki hedef geçerlidir.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `Bu sınıftaki tek öğrencinin haftalık hedefi: ${minuten} dakika.`
            : "Bu sınıftaki tek öğrencinin artık haftalık hedefi olmaz."
          : minuten > 0
            ? `Bu sınıftaki ${anzahlKinder} öğrencinin tümünün haftalık hedefi: ${minuten} dakika.`
            : `Bu sınıftaki ${anzahlKinder} öğrencinin hiçbirinin artık haftalık hedefi olmaz.`;
      return (
        `${satz} Başlangıç: ${naechsterMontagTr(jetztMs)}, 08:00 - o zamana kadar ` +
        `şimdiki hedef geçerlidir. Tek tek belirlenmiş hedeflerin yerine bu hedef geçer. ` +
        (minuten > 0
          ? "Sınıfa sonradan katılan öğrenciler de bu hedefi alır."
          : "Sınıfa sonradan katılan öğrenciler de hedef almaz.")
      );
    },
    wochenziel: "Haftalık hedef",
    minutenProWoche: "Haftalık dakika",
    nullKeinZiel: "0 = haftalık hedef yok.",
    zielKalenderwochen: "Hedefli haftalar",
    speichernTipp: (name: string) =>
      `Dakikaları, hedefli haftaları ve telafiyi birlikte kaydeder - önce onayınız istenir. Öğrenci: ${name}. Değişiklik bir sonraki haftadan itibaren geçerlidir.`,
    nichtsGeaendert: "Haftalık hedefte bir değişiklik yok - hedef zaten kayıtlı.",
    speichern: "Kaydet",
    nachholenTipp:
      "Fazladan çalışılan dakikalar, önceki haftaların ulaşılmamış hedeflerini tamamlar - önce en eskisi.",
    nachholen: "Geçmiş haftaların eksik dakikalarını telafi et",
    dieseWoche: "Bu hafta:",
    min: "dk.",
    keinWochenziel: "haftalık hedef yok",
    anstehend: (datum: string, minuten: number) => [" - ", datum, " Pazartesi itibarıyla: ", minuten, " dk."],
    ueberfaelligTipp:
      "Önceki haftalardan biriken eksik dakikaları sıfırlar - haftalık hedef bu haftadan itibaren yeniden başlar. Çalışılan süre korunur.",
    ueberfaelligZuruecksetzen: "Biriken dakikaları sıfırla",
    zuletztZurueckgesetzt: (ab: string) => ["son sıfırlama: ", ab],
    erlassenTipp:
      "Seçilen haftalar, hedefli hafta olarak işaretli olsun ya da olmasın, hiçbir zaman ulaşılmadı veya telafi edilecek sayılmaz. Çalışılan süre korunur.",
    wochenzielErlassen: "Haftayı muaf tut",
    wochenzielFuer: (name: string) => `Haftalık hedef: ${name}`,
    uebernehmen: "Uygula",
    abbrechen: "İptal",
    einstellungen: "Ayarlar",
    womitAnfangen: "Nereden başlansın?",
    womitTipp:
      "öğrencinin zaten bildikleri - daha düşük bir düzey seçmek öğrenciyi geri alır (önce onayınız istenir); istatistikler ve rozetler korunur.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `Öğrenci: ${name}. Şimdiki düzey: "${label}".\n\n` +
      `Öğrenci gerçekten "${ziel}" düzeyine geri alınsın mı?\n\n` +
      `Alıştırmalar bundan sonra yine bu noktaya kadar olan tuşlarla yapılır. Vuruş istatistikleri, ` +
      `çalışma süresi ve rozetler korunur - düzey daha sonra yeniden yükseltilirse ` +
      `hepsi olduğu gibi durur.\n\n` +
      `Öğrenci Tastenflow programını bir sonraki açışında geçerli olur.`,
    womitName: (name: string) => `Nereden başlıyor: ${name}`,
    ausstehend: (name: string) => ["Öğrenci Tastenflow programını bir sonraki açışında geçerli olur (", name, ")."],
    einhandTipp:
      "Büyük harfler ve simgeler herhangi bir Shift tuşuyla (veya Caps Lock tuşuyla) kabul edilir - bu öğrenci için Shift tuşunda diğer el kuralı kapalıdır.",
    einhandName: (name: string) => `Tek elle yazma: ${name} - diğer el kuralı kapalı`,
    einhand: "Tek elle yazma",
    tempoTipp:
      "Bu öğrenci için hız hiçbir yerde sayılmaz - oyunda süre sınırı yok, yıldızlarda hız hedefi yok, zorluk seviyesi yükselmez ve düşmez; çalışma süresi uzun aralarda da sayılmaya devam eder. Özenli ama çok yavaş yazan öğrenciler için.",
    tempoName: (name: string) => `Acele yok: ${name} - hız hiçbir yerde değerlendirilmez`,
    tempoZaehltNicht: "Acele yok",
    abstand: "Geniş harf aralığı (CVI)",
    abstandTipp: `Bakarak yazarken HER karakterin arasında daha geniş aralık - serebral görme bozukluğu (CVI) olan öğrenciler için; bu öğrencilerde birbirine yakın karakterler birbirine karışır. "İki kat" iki, "üç kat" üç, "dört kat" dört kat genişlik verir. Yazarken, yazılan alan (alıştırma satırı veya oyun alanı) dışındaki her şey karartılır; 5 saniye tuşa basılmazsa her şey yeniden aydınlanır. Alıştırma satırı da atlamak yerine öğrencinin yazma hızıyla bir sonraki karaktere kayar - yavaş yazan öğrencide yavaşça. "Tek kat" karakterleri normal aralıkta bırakır ve yalnızca karartmayı, satırın kaymasını ve okuma satırını açar. Öğrenci aralığı kendi ayarlarında da (dişli simgesi, Alt + O) istediği kadar değiştirebilir - siz de burada istediğiniz zaman yeniden değiştirebilirsiniz. Son seçim geçerlidir.`,
    abstandName: (name: string) => `Geniş harf aralığı (CVI): ${name}`,
    listenTitel: "Sınıfın öğrencileri: zorluk seviyesi ve haftalık hedef",
    tastenSr: (sitzen: number, frei: number) => [
      "Kilidi açık ",
      frei,
      " tuştan ",
      sitzen,
      " tanesi oturdu",
    ],
    bezugBlock: (datum: string) => `${datum} haftasından başlayan 4 alıştırma haftası`,
    bezugWoche: (datum: string) => `${datum} haftası`,
    gruppePerson: "Öğrenci",
    gruppeStand: "Durum ve çalışma süresi",
    gruppeUeben: "Alıştırma",
    gruppePruefung: PRUEFUNG_WORT_TR,
    kopfName: "Ad",
    kopfStufe: "Zorluk seviyesi",
    kopfTasten: "Tuşlar",
    kopfNaechste: "Sıradaki tuşlar",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "tüm tuşlar öğrenildi" : `sırada: ${namen.join(", sonra ")}`,
    kopfUebezeit: "Çalışma süresi",
    kopfWochenziel: "Haftalık hedef",
    kopfWochenziele: "Haftalık hedefler",
    kopfTreffer: "Doğruluk",
    kopfTempo: "Vuruş/dk",
    kopfScore: "Puan",
    uebungszeiten: "Çalışma süreleri",
    nochKeineUebung: "henüz kayıtlı alıştırma yok",
    uebungszeitenKennzahl: (dauer: string, wochen: number) => `${dauer} - ${wochen} hafta`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - ",
      tage,
      " gün",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt} dk. (hedef: ${ziel} dk.)`,
    periodeMatches: (n: number) => ` - ${n} Sınıf Maçı`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Henüz sonuna kadar oynanmış Sınıf Maçı yok"
        : `Sonuna kadar oynanan Sınıf Maçı: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Bu sınıfta öğrencinin sonuna kadar oynadığı her Sınıf Maçı sayılır. Kayıt başlangıcı: ${seit}; ` +
      `daha önceki maçlar kaydedilmedi. Öğrenci: ${name}. ` +
      `Yarıda kesilen veya erken bırakılan maçlar sayılmaz. Bir maç, bitişinden yaklaşık ` +
      `bir saat sonra sayıma eklenir. Yalnızca sayı: sıralama yok, kimin kazandığı ` +
      `sayılmaz.`,
    kopfKlassenmatch: "Sınıf Maçı",
    klassenmatchOhneZahl: "Sınıf Maçı: bilgi yok",
    gruppeKlassenmatch: "Sınıf Maçı",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Öğrencinin sonuna kadar oynadığı Sınıf Maçı sayısı. Yarıda kesilen veya erken ` +
      `bırakılan maçlar sayılmaz; kimin kazandığı sayılmaz. Kayıt başlangıcı: ${seit}. ` +
      `Çizgi şu anlama gelir: Sınıf Maçı bu sınıf için kapalı ya da sayı ` +
      `yüklenemedi.`,
    wocheHilfe: (pauseMin: number) =>
      `Açıldığında bu haftanın her çalışma süresi tek tek görünür: gün, başlangıç ve ` +
      `bitiş saati, çalışılan süre ve neyin çalışıldığı. Çalışılan süre yalnızca yazma ` +
      `süresidir - aralar sayılmaz; bu yüzden çoğu zaman başlangıç ile bitiş arasındaki ` +
      `süreden kısadır. ${pauseMin} dakikadan uzun süre tuşa basılmazsa yeni bir ` +
      `çalışma süresi başlar.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Antrenmanım",
        lektion: "Dersler",
        geschichte: "Öyküler",
        wortspiel: "Kelime oyunları",
        tippchallenge: PRUEFUNG_WORT_TR,
        klassenmatch: "Sınıf Maçı",
        "eigene-uebung": EIGENE_UEBUNG_WORT_TR_LEHRKRAFT,
      })[art],
    wackligeTasten: "Henüz oturmamış tuşlar",
    nochZuWenigGeuebt: "henüz yeterince çalışılmadı",
    zuWenigUmZuSagen: "Bunu söylemek için henüz yeterince çalışılmadı.",
    wackligCaption: (name: string) => ["Henüz oturmamış tuşlar: ", name],
    tasteKopf: "Tuş",
    tasteHilfe: (prozent: number) =>
      `Henüz oturmamış bir tuş - en az ${WACKLIG_MIND_ANSCHLAEGE} kez basıldı ve doğruluk sınırın altında kaldı (sınır: ${prozentText(prozent, "tr")}).`,
    trefferKopf: "Doğruluk",
    trefferHilfe: "Bu tuşa ne kadar sıklıkla doğru basıldığı.",
    tempoKopf: "Hız",
    tempoHilfe: "Bu tuşun son zamanlarda ne kadar hızlı geldiği - bu tuşta dakikada vuruş.",
    abzeichen: (n: number) => ["Rozetler - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_TR} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_TR,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_TR}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Ayarlar: ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Haftalık hedef: ${zielMin} dk.` : "haftalık hedef yok",
    ],
    eigenstaendigkeit: (n: number) => ["Bağımsız çalışma - ipuçları:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Ayarlar ve değerlendirme - ayarlar, çalışma süreleri, henüz oturmamış tuşlar ve rozetler; diğer her şey öğrencinin "İlerlemem" sayfasında. Öğrenci: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `Ayarları ve değerlendirmeyi ${offen ? "kapat" : "aç"}: ${name}`,
    keinZielGesetzt: "haftalık hedef belirlenmedi",
    keineAbgeschlossene: "henüz tamamlanmış hedefli hafta yok",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      "Haftalık hedeflere ulaşma: yüzde ",
      prozent,
      "; tamamına ulaşılan hafta: ",
      ganz,
      ", toplam",
      " ",
      gesamt,
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["tam hafta: ", ganz, "/", gesamt, ""],
    wocheErlassen: "bu hafta muaf",
    keineZielwoche: "hedefli hafta değil",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " dk."],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " dakika, hedef: ", nenner, " dakika"],
    offenSr: (minuten: number) => `, önceki haftalardan kalan: ${minuten} dakika`,
    erreichtSr: ", haftalık hedefe ulaşıldı",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " dk. önceki haftalardan"],
    klasseNichtGespeichert: "Sınıf ayarı kaydedilemedi.",
    kinderEingetragen: (n: number) =>
      ` Kaydedilen öğrenci: ${n} - Tastenflow bir sonraki açıldığında geçerli olur. ` +
      `İstatistikler ve rozetler korunur.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Başlangıç noktası artık sınıf için geçerli: "${label}" - sonradan katılacak öğrenciler için de.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Sınıfın varsayılan ayarı kaydedilemedi.${kinderSatz}`,
    gesperrtZusatz: " (kilitli)",
    stufeWaehlen: "Düzey seçin",
    vorgabeKlasse: (label: string) => `Sınıfın varsayılanı: "${label}"`,
    dieMeisten: (label: string) => `öğrencilerin çoğu şu düzeyde: "${label}"`,
    bezugKlasse: (name: string) => `${name} sınıfı`,
    startHinweis:
      "sınıfın zaten bildikleri - bu sınıftaki tüm öğrenciler için, sonradan katılacaklar için de geçerlidir",
    startSrHinweis:
      "İlk seçenek, sınıfın varsayılanını ve öğrencilerin çoğunun bulunduğu düzeyi gösterir. " +
      "Bir düzey seçerseniz bu düzey sınıfın varsayılanı olarak kaydedilir - sonradan katılan öğrenciler için de geçerlidir - " +
      "ve sınıftaki öğrencilere işlenir; daha ileride olan öğrenciler varsa program önce sorar. " +
      "Her öğrenci Tastenflow programını bir sonraki açışında geçerli olur; istatistikler ve rozetler korunur.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Sınıf düzeyi kaldırıldı. Yeniden varsayılan geçerli: ${vorgabe}.`,
    schulstufeErwachsen: (label: string) =>
      `Sınıf düzeyi: Yetişkin. Metinler artık yetişkinlere uygun (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Sınıf düzeyi: ${schulstufeLabelTr(wert)}. Metinler artık bu yaşa uygun: ` +
      `${label}.`,
    spracheDerKlasse: (sprache: string) => `Sınıfın dili: ${sprache}.`,
    spracheGesperrt: "Dil, bu sınıftaki öğrenciler için kilitlendi.",
    spracheFrei: "Dil yeniden serbestçe seçilebilir.",
    matchNichtUmgestellt: "Sınıf Maçı ayarı değiştirilemedi.",
    matchErlaubt: "Sınıf Maçı bu sınıf için açık.",
    matchAus: "Sınıf Maçı bu sınıf için kapalı.",
    zeilenEndeAn:
      "Her satır artık Enter tuşuyla bitiriliyor - bu sınıftaki tüm öğrenciler için.",
    zeilenEndeAus: "Satır sonunda Enter bu sınıf için kapalı.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `Bu sınıfın öğretim yılı artık şu ayın ilk gününde başlıyor: ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Yazım: ${label} - bu sınıftaki tüm öğrenciler için.`,
    schreibweiseAutoLabel: "otomatik",
    schreibweiseGbLabel: "İngiliz",
    schreibweiseUsLabel: "Amerikan",
    startFrageTitel: "Tüm sınıf için başlangıç noktası",
    frageVor: (_n: number) => ["Sınıfınızda", "", " "],
    frageStark: (n: number) => [n, " ", "öğrenci"],
    frageNach: (_n: number) => [
      " ",
      "seçilen düzeyden daha ileride. Tüm sınıf gerçekten bu düzeye ayarlansın mı?",
    ],
    detailVor: "Seçilen: ",
    detailNach: (namen: string) => [
      ". Daha ileride olanlar:",
      " ",
      namen,
      ". Bir öğrenciyi geri almak, onun daha önce açılmış alıştırmalarını kapatır - vuruş istatistikleri, çalışma süresi ve rozetler her durumda korunur. Her öğrenci Tastenflow programını bir sonraki açışında geçerli olur.",
    ],
    alleEinstufen: "Tüm sınıfı bu düzeye ayarla",
    nurNochNicht: "Yalnızca henüz bu düzeye gelmemiş olanları",
    startZurueck: (name: string, label: string) =>
      `Geri alındı: ${name} - yeni düzey: "${label}". Öğrenci Tastenflow programını bir sonraki açışında geçerli olur. ` +
      `İstatistikler ve rozetler korunur.`,
    startpunktVon: (name: string, label: string) => `Başlangıç noktası - ${name}: "${label}".`,
    wochenzielNichtGespeichert: (name: string) =>
      `Haftalık hedef kaydedilemedi. Öğrenci: ${name}.`,
    wochenzielGespeichert: (name: string) => `Haftalık hedef kaydedildi: ${name}.`,
    ueberfaelligFrage: (name: string) =>
      `Haftalık hedefte biriken dakikalar sıfırlansın mı? Öğrenci: ${name}.\n\n` +
      `Şimdiye kadar biriken eksik silinir; haftalık hedef bu haftadan itibaren ` +
      `yeniden başlar. Çalışılan süre ve istatistikler korunur.`,
    ueberfaelligErledigt: (name: string) => `Biriken dakikalar sıfırlandı: ${name}.`,
    erlasseneGespeichert: "Muaf tutulan haftalar kaydedildi.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Haftalık hedef (${minuten} dakika)` : "Haftalık hedef yok"} - kaydedilen öğrenci: ${ok}, toplam ${gesamt}. ` +
      `Başlangıç: ${naechsterMontagTr(jetztMs)}, 08:00.`,
    klassenZielFehler: (namen: string) =>
      ` Şu öğrencilerde olmadı: ${namen} - lütfen tekrar deneyin.`,
    sperreNichtAufgehoben: "Hedefe devam edilemedi.",
    sperreAufgehoben:
      "Hedefe devam ediliyor - çalışılan süre şimdiden itibaren yeniden haftalık hedefe sayılıyor.",
    stundeNichtGesperrt: "Hedef 1 saat durdurulamadı.",
    gesperrtBisStatus: (zeit: string) =>
      `Sınıfın haftalık hedefi durduruldu. Bitiş: ${zeit}. ` +
      `Çalışma süresi ve istatistikler sayılmaya devam eder, yalnızca haftalık hedef durur.`,
    stundeGesperrt: "Hedef 1 saat durduruldu.",
    excelLaeuft: "Excel dosyası hazırlanıyor - lütfen bekleyin.",
    excelFertig: (datei: string) =>
      `"${datei}" indirildi - açıklamalı bir genel bakış ve dört sayfa ile: öğretim yılı, başından beri, ay ve hafta.`,
    excelFehler:
      "Excel dosyası oluşturulamadı. Lütfen tekrar deneyin; " +
      "sorun sürerse lütfen bildirin.",
    laedt: "Yükleniyor...",
    lesefehlerStark: "İlerleme okunamadı",
    lesefehlerFuer: (namen: string) => [
      " - öğrenciler:",
      " ",
      namen,
      ". Bu yüzden bu satırlardaki sayılar boştur; bu, çalışılmadığı ",
    ],
    lesefehlerNicht: "anlamına gelmez",
    lesefehlerSchluss: ". Lütfen sayfayı yenileyin; sorun sürerse lütfen bildirin.",
    aufgabenGruppe: "Sınıfın görevleri",
    tippchallengeTipp:
      "Tüm sınıf için Yarışmayı açar: metni ve süreyi belirleyin - sonuçlar da daha sonra burada.",
    tippchallenge: PRUEFUNG_WORT_TR,
    eigeneUebungTipp:
      "Yüklenen bir dosyayı sınıfa zorunlu metin olarak verir - her öğrenci kendi hızında çalışır; bu yolla yeni tuşların kilidi açılmaz.",
    eigeneUebung: EIGENE_UEBUNG_WORT_TR_LEHRKRAFT,
    wochenzielTipp:
      "Sınıfın haftada kaç dakika çalışacağını belirler - her öğrenci için ayrı ayrı veya hepsi için birden.",
    zielStatusMin: (minuten: string) => `${minuten} dk.`,
    zielGesetzt: "belirlendi",
    keinZiel: "hedef yok",
    einstellungenTipp:
      "Tüm sınıf için sınıf düzeyini, dili, başlangıç noktasını ve Sınıf Maçını ayarlayın.",
    einstellungenDerKlasse: "Sınıf ayarları",
    sperreBeendenTipp:
      "Hedefe hemen devam eder - sonra çalışılan süre yeniden haftalık hedefe sayılır.",
    sperrenTipp:
      "Haftalık hedefi tüm sınıf için 60 dakika durdurur. Öğrenciler çalışmaya devam eder - çalışma süresi ve istatistikler sayılmaya devam eder, yalnızca haftalık hedef durur.",
    gesperrtBisKnopf: (zeit: string) => `Durduruldu (bitiş: ${zeit}) - Hedefe devam et`,
    stundeSperren: "Hedefi 1 saat durdur",
    wochenzielAufgabe: "Haftalık hedef - görev",
    zielFuerKlasseGesetzt: "- bu sınıfın öğrencileri için belirlendi",
    nochKeinZielGesetzt: "- henüz hedef belirlenmedi",
    minutenZuerst: "Önce haftalık dakikayı yazın - 0 ile 600 arası.",
    klassenZielTipp:
      "Bu haftalık hedefi bir sonraki haftadan itibaren bu sınıftaki her öğrenci için belirler - sonradan katılan öğrenciler için de. Tek tek belirlenmiş hedeflerin yerine bu hedef geçer.",
    fuerKlasseUebernehmen: "Tüm sınıfa uygula",
    wochenzielFuerKlasse: (bezeichnung: string) => `Haftalık hedef: ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Excel olarak indir: tabloyu "${datei}" Excel dosyası olarak indirir - ` +
      `önde açıklamalı bir genel bakış, arkasında dört sayfa: bu öğretim yılı, ` +
      `başından beri, ay (son 4 hafta) ve bu hafta; burada hangi dönem seçili ` +
      `olursa olsun.`,
    alsExcel: "Excel olarak indir",
    schulstufeKind: "Sınıf düzeyi",
    schulstufeKindName: (name: string) => `Sınıf düzeyi: ${name}`,
    wieDieKlasse: (klasse: string) => `sınıf gibi (${klasse})`,
    schulstufeKindTipp:
      "Yalnızca bu öğrenci için: sınıf düzeyi, öğrencinin hangi metinleri alacağını belirler ve sınıfın düzeyi yerine geçer. Her öğretim yılında kendiliğinden bir artar. \"Sınıf gibi\" bu istisnayı kaldırır.",
    schulstufeKindGesetzt: (name: string, stufe: string) =>
      `Metinler artık bu düzeye göre: ${stufe}. Öğrenci: ${name}.`,
    schulstufeKindErwachsen: (name: string) => `Öğrenci artık yetişkinler için metinler alıyor: ${name}.`,
    schulstufeKindWieKlasse: (name: string) => `Öğrenci yeniden sınıfın metinlerini alıyor: ${name}.`,
  },
  // ★ O-CS (03.10.2026): Lehrkraft vy-Mehrzahl, Knöpfe im Infinitiv (Glossar
  // Regel 1); Kinder = „osoba"/„žáci", Lehrkraft = „vyučující" (Regel 2), keine
  // Vergangenheit über eine Person; Namen, Daten und Zahlen nach Doppelpunkt
  // oder hinter einem Kopfwort, nie gebeugt (Regel 12); Mehrzahl mit vier
  // Formen (§2.11); Wochenziel nach §2.6 (týdenní cíl, dohnat, prominout týden,
  // Pozastavit na hodinu); Vergleiche mit „v"/„ve" im 6. Fall („v týdnu od
  // 14. 9."), wie `veraenderungSatzCs` sie erwartet.
  cs: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Nový cíl (${minutenCs(Math.round(minuten))} týdně) platí od ${naechsterMontagCs(jetztMs)}, 8:00 ráno. ` +
      `Do té doby platí dosavadní cíl.`,
    keinZielMehr: (jetztMs: number) =>
      `Od ${naechsterMontagCs(jetztMs)}, 8:00 ráno, už nebude žádný týdenní cíl. ` +
      `Do té doby platí dosavadní cíl.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `Jediná osoba v této třídě dostane cíl: ${minutenCs(minuten)} týdně.`
            : "Jediná osoba v této třídě už nebude mít týdenní cíl."
          : minuten > 0
            ? `Všichni žáci této třídy (${anzahlKinder}) dostanou cíl: ${minutenCs(minuten)} týdně.`
            : `Všichni žáci této třídy (${anzahlKinder}) už nebudou mít týdenní cíl.`;
      return (
        `${satz} Platí od ${naechsterMontagCs(jetztMs)}, 8:00 ráno - do té doby ` +
        `platí dosavadní cíl. Cíle nastavené jednotlivým osobám se přepíšou. ` +
        (minuten > 0
          ? "Kdo přibude později, dostane tento cíl také."
          : "Kdo přibude později, také nedostane žádný cíl.")
      );
    },
    wochenziel: "Týdenní cíl",
    minutenProWoche: "Minuty týdně",
    nullKeinZiel: "0 = bez týdenního cíle.",
    zielKalenderwochen: "Týdny s cílem",
    speichernTipp: (name: string) =>
      `Uloží najednou minuty, týdny s cílem a dohánění - až po potvrzení. Osoba: ${name}. Změna platí od příštího týdne.`,
    nichtsGeaendert: "Na týdenním cíli se nic nezměnilo - už je uložený.",
    speichern: "Uložit",
    nachholenTipp:
      "Minuty navíc doplní nesplněné cíle z minulých týdnů - nejdřív ten nejstarší.",
    nachholen: "Dohnat minuty z minulých týdnů",
    dieseWoche: "Tento týden:",
    min: "min",
    keinWochenziel: "bez týdenního cíle",
    anstehend: (datum: string, minuten: number) => [" - od pondělí ", datum, ": ", minuten, " min"],
    ueberfaelligTipp:
      "Vynuluje minuty k dohnání z minulých týdnů - týdenní cíl začíná od tohoto týdne znovu od nuly. Odcvičený čas zůstává.",
    ueberfaelligZuruecksetzen: "Vynulovat minuty k dohnání",
    zuletztZurueckgesetzt: (ab: string) => ["naposledy vynulováno: ", ab],
    erlassenTipp:
      "Vybrané týdny se nikdy nepočítají jako nesplněné ani k dohnání - bez ohledu na to, zda je týden s cílem zaškrtnutý. Odcvičený čas zůstává.",
    wochenzielErlassen: "Prominout týden",
    wochenzielFuer: (name: string) => `Týdenní cíl: ${name}`,
    uebernehmen: "Použít",
    abbrechen: "Zrušit",
    einstellungen: "Nastavení",
    womitAnfangen: "Kde začít?",
    womitTipp:
      "co tato osoba už umí - výběr nižší úrovně ji vrátí zpět (až po potvrzení); statistika a odznaky zůstávají.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `Osoba: ${name}. Současná úroveň: ${label}.\n\n` +
      `Opravdu vrátit zpět na úroveň: ${ziel}?\n\n` +
      `Cvičení se pak omezí na klávesy až po toto místo. Statistika psaní, ` +
      `čas procvičování a odznaky zůstávají - když se později zase postoupí dál, ` +
      `všechno tu bude nedotčené.\n\n` +
      `Platí od chvíle, kdy tato osoba příště otevře Tastenflow.`,
    womitName: (name: string) => `Kde začíná: ${name}`,
    ausstehend: (name: string) => ["Platí od příštího otevření Tastenflow (", name, ")."],
    einhandTipp:
      "Velká písmena a znaky se přijímají s kteroukoli klávesou Shift (nebo s klávesou Caps Lock) - pravidlo Shift druhou rukou je pro tuto osobu vypnuté.",
    einhandName: (name: string) => `Psaní jednou rukou: ${name} - pravidlo druhé ruky vypnuté`,
    einhand: "Psaní jednou rukou",
    tempoTipp:
      "Pro tuto osobu se rychlost nikde nepočítá - ve hře žádné stopky, u hvězdiček žádná hranice rychlosti, úroveň se nemění nahoru ani dolů a čas procvičování se počítá i při dlouhých přestávkách. Pro ty, kdo píšou pečlivě, ale velmi pomalu.",
    tempoName: (name: string) => `V klidu: ${name} - rychlost se nikde nehodnotí`,
    tempoZaehltNicht: "V klidu",
    abstand: "Větší mezery (CVI)",
    abstandTipp: `Větší mezera mezi KAŽDÝM znakem při opisování - pro osoby s cerebrálním zrakovým postižením (CVI), kterým těsně stojící znaky splývají. „Dvojnásobné“ dává dvakrát, „trojnásobné“ třikrát a „čtyřnásobné“ čtyřikrát větší šířku na znak. Při psaní se ztmaví vše kromě pole, do kterého se právě píše (řádek cvičení nebo herní plocha); po 5 sekundách bez stisku klávesy se vše zase rozjasní. Řádek cvičení přitom plynule klouže k dalšímu znaku v tempu psaní dané osoby - pomalu, když píše pomalu - místo aby skákal. „Jednoduché“ nechává znaky v obvyklé vzdálenosti a zapne jen ztmavení, klouzání řádku a čtecí řádek. Osoba si mezery může změnit i sama ve svém Nastavení (ozubené kolečko, Alt + O), kolikrát chce - a vy zde kdykoli zpět. Platí to, co bylo vybráno naposledy.`,
    abstandName: (name: string) => `Větší mezery (CVI): ${name}`,
    listenTitel: "Žáci třídy s úrovní a týdenním cílem",
    tastenSr: (sitzen: number, frei: number) => [
      "Jisté klávesy: ",
      sitzen,
      ", odemčené klávesy: ",
      frei,
      "",
    ],
    bezugBlock: (datum: string) => `ve 4 týdnech cvičení od ${datum}`,
    bezugWoche: (datum: string) => `v týdnu od ${datum}`,
    gruppePerson: "Osoba",
    gruppeStand: "Pokrok a čas procvičování",
    gruppeUeben: "Cvičení",
    gruppePruefung: PRUEFUNG_WORT_CS,
    kopfName: "Jméno",
    kopfStufe: "Úroveň",
    kopfTasten: "Klávesy",
    kopfNaechste: "Další klávesy",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "všechny klávesy jsou jisté" : `pak ${namen.join(", pak ")}`,
    kopfUebezeit: "Čas procvičování",
    kopfWochenziel: "Týdenní cíl",
    kopfWochenziele: "Týdenní cíle",
    kopfTreffer: "Přesnost",
    kopfTempo: "Úhozů/min",
    kopfScore: "Skóre",
    uebungszeiten: "Časy procvičování",
    nochKeineUebung: "zatím žádné uložené cvičení",
    uebungszeitenKennzahl: (dauer: string, wochen: number) => `${dauer} - týdny: ${wochen}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - dny: ",
      tage,
      "",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt}/${ziel} min`,
    periodeMatches: (n: number) => ` - Třídní závody: ${n}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Zatím žádný Třídní závod dohraný do konce"
        : `Třídní závody dohrané do konce: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Počítá každý Třídní závod v této třídě, který se dohrál do konce - od ${seit}; ` +
      `dřívější se nezaznamenávaly. Osoba: ${name}. ` +
      `Přerušené nebo předčasně opuštěné závody se nepočítají. Závod se započítá ` +
      `zhruba hodinu po skončení. Jen počet: žádné pořadí, vítězství se ` +
      `nepočítají.`,
    kopfKlassenmatch: "Třídní závod",
    klassenmatchOhneZahl: "Třídní závod: bez údajů",
    gruppeKlassenmatch: "Třídní závod",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Kolik Třídních závodů se dohrálo do konce. Přerušené nebo předčasně opuštěné ` +
      `se nepočítají; vítězství se nepočítají. Zaznamenává se ` +
      `od ${seit}. Znak „-“ znamená: Třídní závod je v této třídě vypnutý, ` +
      `nebo se počet nepodařilo načíst.`,
    wocheHilfe: (pauseMin: number) =>
      `Po rozbalení je vidět každý čas procvičování v tomto týdnu: den, čas ` +
      `začátku a konce, odcvičený čas a co se cvičilo. Odcvičený čas je jen ` +
      `samotné psaní - přestávky se nepočítají, proto bývá kratší než zobrazený ` +
      `úsek. Po více než ${pauseMin} min bez stisku klávesy začíná ` +
      `nový čas procvičování.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Můj trénink",
        lektion: "Lekce",
        geschichte: "Příběhy",
        wortspiel: "Slovní hry",
        tippchallenge: PRUEFUNG_WORT_CS,
        klassenmatch: "Třídní závod",
        "eigene-uebung": EIGENE_UEBUNG_WORT_CS_LEHRKRAFT,
      })[art],
    wackligeTasten: "Nejisté klávesy",
    nochZuWenigGeuebt: "zatím málo procvičeno",
    zuWenigUmZuSagen: "Na posouzení je zatím málo cvičení.",
    wackligCaption: (name: string) => ["Nejisté klávesy: ", name],
    tasteKopf: "Klávesa",
    tasteHilfe: (prozent: number) =>
      `Klávesa je ještě nejistá - pokusů aspoň ${WACKLIG_MIND_ANSCHLAEGE}, správných úhozů méně než ${prozentText(prozent, "cs")}.`,
    trefferKopf: "Přesnost",
    trefferHilfe: "Podíl správných úhozů na tuto klávesu.",
    tempoKopf: "Rychlost",
    tempoHilfe: "Jak rychle tato klávesa v poslední době šla - úhozy na tuto klávesu za minutu.",
    abzeichen: (n: number) => ["Odznaky - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_CS} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_CS,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_CS}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Nastavení: ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Týdenní cíl: ${zielMin} min` : "bez týdenního cíle",
    ],
    eigenstaendigkeit: (n: number) => ["Samostatná práce - upozornění:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Nastavení a přehled - nastavení, časy procvičování, nejisté klávesy a odznaky; vše ostatní je v části Můj pokrok této osoby. Osoba: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Zavřít" : "Otevřít"} nastavení a přehled: ${name}`,
    keinZielGesetzt: "týdenní cíl není nastavený",
    keineAbgeschlossene: "zatím žádný ukončený týden s cílem",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      "Splněné týdenní cíle: ",
      prozent,
      " %, celé týdny: ",
      ganz,
      "/",
      gesamt,
      "",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["celé týdny: ", ganz, "/", gesamt, ""],
    wocheErlassen: "tento týden je prominutý",
    keineZielwoche: "není to týden s cílem",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " min, cíl: ", nenner, " min"],
    offenSr: (minuten: number) => `, z toho k dohnání z minulých týdnů: ${minuten} min`,
    erreichtSr: ", týdenní cíl splněn",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min k dohnání"],
    klasseNichtGespeichert: "Nastavení třídy se nepodařilo uložit.",
    kinderEingetragen: (n: number) =>
      ` Uloženo pro: ${osobyCs(n)} - platí od příštího otevření ` +
      `Tastenflow. Statistika a odznaky zůstávají.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Výchozí bod pro třídu: ${label}. Platí i pro ty, kdo přibudou později.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Výchozí nastavení třídy se nepodařilo uložit.${kinderSatz}`,
    gesperrtZusatz: " (zamčeno)",
    stufeWaehlen: "Vyberte úroveň",
    vorgabeKlasse: (label: string) => `Výchozí pro třídu: ${label}`,
    dieMeisten: (label: string) => `většina je na úrovni: ${label}`,
    bezugKlasse: (name: string) => `třídy ${name}`,
    startHinweis:
      "co třída už umí - platí pro všechny žáky této třídy, i pro ty, kdo přibudou později",
    startSrHinweis:
      "První položka ukazuje výchozí nastavení třídy a úroveň, na které je většina. " +
      "Výběr úrovně ji uloží jako výchozí nastavení třídy - platí i pro ty, kdo přibudou později - " +
      "a zapíše ji žákům, kteří už ve třídě jsou; je-li někdo už dál, program se nejdřív zeptá. " +
      "Platí pro každou osobu od příštího otevření Tastenflow; statistika a odznaky zůstávají.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Ročník je odstraněný. Znovu platí výchozí nastavení (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Ročník: Dospělí. Texty jsou teď pro dospělé (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Ročník: ${schulstufeLabelCs(wert)}. Texty jsou teď přizpůsobené věku ` +
      `(${label}).`,
    spracheDerKlasse: (sprache: string) => `Jazyk třídy: ${sprache}.`,
    spracheGesperrt: "Jazyk je pro žáky této třídy zamčený.",
    spracheFrei: "Jazyk lze znovu volně vybrat.",
    matchNichtUmgestellt: "Třídní závod se nepodařilo přepnout.",
    matchErlaubt: "Třídní závod je v této třídě povolený.",
    matchAus: "Třídní závod je v této třídě vypnutý.",
    zeilenEndeAn:
      "Každý řádek teď končí klávesou Enter - pro všechny žáky této třídy.",
    zeilenEndeAus: "Konec řádku klávesou Enter je v této třídě vypnutý.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `Školní rok této třídy teď začíná prvním dnem měsíce: ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Pravopis: ${label} - pro všechny žáky této třídy.`,
    schreibweiseAutoLabel: "automaticky",
    schreibweiseGbLabel: "britský",
    schreibweiseUsLabel: "americký",
    startFrageTitel: "Výchozí bod pro celou třídu",
    frageVor: (_n: number) => ["Dál než vybraná úroveň", ":", " "],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "cs", { one: () => "osoba", few: () => "osoby", many: () => "osoby", other: () => "osob" }),
    ],
    frageNach: (_n: number) => [
      ".",
      " Opravdu nastavit celou třídu na tuto úroveň?",
    ],
    detailVor: "Vybráno: ",
    detailNach: (namen: string) => [
      ". Už dál:",
      " ",
      namen,
      ". Vrácení zpět odebere už probraný obsah - statistika psaní, čas procvičování a odznaky zůstávají v každém případě. Platí pro každou osobu od příštího otevření Tastenflow.",
    ],
    alleEinstufen: "Nastavit celou třídu na tuto úroveň",
    nurNochNicht: "Jen osoby, které sem ještě nedošly",
    startZurueck: (name: string, label: string) =>
      `Vráceno na úroveň: ${label}. Osoba: ${name}. Platí od příštího otevření Tastenflow. ` +
      `Statistika a odznaky zůstávají.`,
    startpunktVon: (name: string, label: string) => `Výchozí bod - ${name}: ${label}.`,
    wochenzielNichtGespeichert: (name: string) =>
      `Týdenní cíl se nepodařilo uložit. Osoba: ${name}.`,
    wochenzielGespeichert: (name: string) => `Týdenní cíl uložen: ${name}.`,
    ueberfaelligFrage: (name: string) =>
      `Vynulovat minuty k dohnání z týdenního cíle? Osoba: ${name}.\n\n` +
      `Dosud nasbírané minuty k dohnání se smažou; od tohoto týdne začíná ` +
      `týdenní cíl znovu od nuly. Odcvičený čas a statistika zůstávají.`,
    ueberfaelligErledigt: (name: string) => `Minuty k dohnání vynulovány: ${name}.`,
    erlasseneGespeichert: "Prominuté týdny jsou uložené.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Týdenní cíl (${minutenCs(minuten)})` : "Bez týdenního cíle"} - uloženo: ${ok}/${gesamt}; platí od ` +
      `${naechsterMontagCs(jetztMs)}, 8:00 ráno.`,
    klassenZielFehler: (namen: string) =>
      ` Nepodařilo se u: ${namen} - zkuste to prosím znovu.`,
    sperreNichtAufgehoben: "Cíl se nepodařilo obnovit.",
    sperreAufgehoben:
      "Cíl je obnovený - čas procvičování se od teď znovu počítá do týdenního cíle.",
    stundeNichtGesperrt: "Cíl se nepodařilo pozastavit na hodinu.",
    gesperrtBisStatus: (zeit: string) =>
      `Týdenní cíl třídy je pozastavený do ${zeit} - ` +
      `čas procvičování a statistika se počítají dál, pozastavený je jen týdenní cíl.`,
    stundeGesperrt: "Cíl je pozastavený na hodinu.",
    excelLaeuft: "Soubor Excel se připravuje - okamžik.",
    excelFertig: (datei: string) =>
      `Staženo: ${datei} - s přehledem a jeho legendou a se čtyřmi listy: školní rok, od začátku, měsíc a týden.`,
    excelFehler:
      "Soubor Excel se nepodařilo vytvořit. Zkuste to znovu; " +
      "pokud se to opakuje, nahlaste to.",
    laedt: "Načítání...",
    lesefehlerStark: "Pokrok se nepodařilo načíst",
    lesefehlerFuer: (namen: string) => [
      " u těchto osob:",
      " ",
      namen,
      ". Proto jsou čísla v těchto řádcích prázdná a ",
    ],
    lesefehlerNicht: "neznamenají",
    lesefehlerSchluss:
      ", že se nepsalo. Obnovte stránku; pokud se to opakuje, nahlaste to.",
    aufgabenGruppe: "Úkoly pro třídu",
    tippchallengeTipp:
      "Otevře Výzvu pro celou třídu: vyberte text a čas - a potom, také tady, výsledky.",
    tippchallenge: PRUEFUNG_WORT_CS,
    eigeneUebungTipp:
      "Přidělí třídě nahraný soubor jako text ke cvičení - každá osoba ho cvičí svým tempem; nové klávesy se tím neodemykají.",
    eigeneUebung: EIGENE_UEBUNG_WORT_CS_LEHRKRAFT,
    wochenzielTipp:
      "Určí, kolik minut týdně třída cvičí - pro každou osobu zvlášť, nebo pro všechny najednou.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "nastavený",
    keinZiel: "bez cíle",
    einstellungenTipp:
      "Nastavte pro celou třídu: ročník, jazyk, výchozí bod a Třídní závod.",
    einstellungenDerKlasse: "Nastavení třídy",
    sperreBeendenTipp:
      "Hned obnoví cíl - čas procvičování se pak znovu počítá do týdenního cíle.",
    sperrenTipp:
      "Pozastaví týdenní cíl na 60 minut pro celou třídu. Cvičit se dá dál - čas procvičování a statistika se počítají dál, pozastavený je jen týdenní cíl.",
    gesperrtBisKnopf: (zeit: string) => `Pozastaveno do ${zeit} - obnovit`,
    stundeSperren: "Pozastavit na hodinu",
    wochenzielAufgabe: "Týdenní cíl - úkol",
    zielFuerKlasseGesetzt: "- nastavený pro žáky této třídy",
    nochKeinZielGesetzt: "- cíl zatím není nastavený",
    minutenZuerst: "Nejdřív zadejte minuty týdně (0 až 600 minut).",
    klassenZielTipp:
      "Nastaví tento týdenní cíl od příštího týdne každé osobě v této třídě - i těm, kdo přibudou později. Cíle nastavené jednotlivým osobám se přepíšou.",
    fuerKlasseUebernehmen: "Použít pro celou třídu",
    wochenzielFuerKlasse: (bezeichnung: string) => `Týdenní cíl ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Stáhnout jako Excel: stáhne tabulku jako soubor Excel ` +
      `${datei} - nejdřív s přehledem a jeho legendou, ` +
      `potom čtyři listy: aktuální školní rok, od začátku, měsíc (poslední ` +
      `4 týdny) a tento týden, bez ohledu na zde vybrané období.`,
    alsExcel: "Stáhnout jako Excel",
    schulstufeKind: "Ročník",
    schulstufeKindName: (name: string) => `Ročník: ${name}`,
    wieDieKlasse: (klasse: string) => `jako třída (${klasse})`,
    schulstufeKindTipp:
      "Jen pro tuto osobu: ročník určuje texty a nahrazuje nastavení třídy. S každým školním rokem se sám zvýší. Volba „jako třída“ tuto výjimku zruší.",
    schulstufeKindGesetzt: (name: string, stufe: string) => `Texty teď odpovídají ročníku: ${stufe}. Osoba: ${name}.`,
    schulstufeKindErwachsen: (name: string) => `Texty teď odpovídají dospělým. Osoba: ${name}.`,
    schulstufeKindWieKlasse: (name: string) => `Texty teď zase odpovídají třídě. Osoba: ${name}.`,
  },
  bg: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Новата цел (${minutenBg(Math.round(minuten))} седмично) важи от ${naechsterMontagBg(jetztMs)}, 8:00 ч. ` +
      `Дотогава важи досегашната цел.`,
    keinZielMehr: (jetztMs: number) =>
      `От ${naechsterMontagBg(jetztMs)}, 8:00 ч., вече няма седмична цел. ` +
      `Дотогава важи досегашната цел.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `Единственият ученик в този клас получава цел: ${minutenBg(minuten)} седмично.`
            : "Единственият ученик в този клас вече няма да има седмична цел."
          : minuten > 0
            ? `Всички ученици в този клас (${anzahlKinder}) получават цел: ${minutenBg(minuten)} седмично.`
            : `Всички ученици в този клас (${anzahlKinder}) вече няма да имат седмична цел.`;
      return (
        `${satz} Важи от ${naechsterMontagBg(jetztMs)}, 8:00 ч. - дотогава ` +
        `важи досегашната цел. Целите, зададени поотделно, се заменят. ` +
        (minuten > 0
          ? "Който се присъедини по-късно, също получава тази цел."
          : "Който се присъедини по-късно, също няма да получи цел.")
      );
    },
    wochenziel: "Седмична цел",
    minutenProWoche: "Минути седмично",
    nullKeinZiel: "0 = без седмична цел.",
    zielKalenderwochen: "Седмици с цел",
    speichernTipp: (name: string) =>
      `Записва заедно минутите, седмиците с цел и наваксването - след потвърждение. Ученик: ${name}. Промяната важи от следващата седмица.`,
    nichtsGeaendert: "В седмичната цел няма промяна - тя вече е записана.",
    speichern: "Запиши",
    nachholenTipp:
      "Минутите в повече попълват неизпълнените цели от минали седмици - първо най-старата.",
    nachholen: "Наваксай минутите от минали седмици",
    dieseWoche: "Тази седмица:",
    min: "мин",
    keinWochenziel: "без седмична цел",
    anstehend: (datum: string, minuten: number) => [" - от понеделник, ", datum, ": ", minuten, " мин"],
    ueberfaelligTipp:
      "Нулира минутите за наваксване от минали седмици - от тази седмица седмичната цел започва отначало. Времето за упражнения остава.",
    ueberfaelligZuruecksetzen: "Нулирай минутите за наваксване",
    zuletztZurueckgesetzt: (ab: string) => ["последно нулиране: ", ab],
    erlassenTipp:
      "Избраните седмици никога не се броят като неизпълнени или за наваксване - независимо дали седмицата е отбелязана като седмица с цел. Времето за упражнения остава.",
    wochenzielErlassen: "Освободи седмицата",
    wochenzielFuer: (name: string) => `Седмична цел: ${name}`,
    uebernehmen: "Приложи",
    abbrechen: "Отказ",
    einstellungen: "Настройки",
    womitAnfangen: "Откъде да започне?",
    womitTipp:
      "какво вече може ученикът - по-ниско ниво го връща назад (след потвърждение); статистиката и значките остават.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `Ученик: ${name}. Сегашно ниво: ${label}.\n\n` +
      `Наистина ли да се върне на ниво: ${ziel}?\n\n` +
      `След това упражненията стигат само до това място. Статистиката на писането, ` +
      `времето за упражнения и значките остават - ако по-късно нивото се вдигне отново, ` +
      `всичко ще е непроменено.\n\n` +
      `Важи от следващото отваряне на Tastenflow от този ученик.`,
    womitName: (name: string) => `Откъде започва: ${name}`,
    ausstehend: (name: string) => ["Важи от следващото отваряне на Tastenflow (", name, ")."],
    einhandTipp:
      "Главните букви и символите се приемат с който и да е клавиш Shift (или с Caps Lock) - правилото Shift с другата ръка е изключено за този ученик.",
    einhandName: (name: string) => `Писане с една ръка: ${name} - правилото за другата ръка е изключено`,
    einhand: "Писане с една ръка",
    tempoTipp:
      "За този ученик скоростта не се брои никъде - без ограничение на времето в играта, без граница на скоростта при звездичките, нивото на трудност не се качва и не се сваля, а времето за упражнения тече и при дълги паузи. За тези, които пишат внимателно, но много бавно.",
    tempoName: (name: string) => `Спокойно: ${name} - скоростта не се оценява никъде`,
    tempoZaehltNicht: "Спокойно",
    abstand: "По-голямо разстояние (CVI)",
    abstandTipp: `По-голямо разстояние между ВСЕКИ два знака при преписване - за деца с церебрално зрително увреждане (CVI), при които близките знаци се сливат. „Двойно“ дава двойна, „тройно“ - тройна, а „четворно“ - четворна ширина на знак. При писане всичко освен полето, в което се пише в момента (редът за упражнение или полето на играта), се затъмнява; след 5 секунди без натискане на клавиш всичко отново просветлява. Редът за упражнение при това плавно се плъзга към следващия знак в темпото на ученика - бавно, когато пише бавно - вместо да подскача. „Единично“ оставя знаците на обичайното разстояние и включва само затъмняването, плъзгането на реда и реда за четене. Ученикът може сам да промени разстоянието в своите Настройки (зъбното колело, Alt + O), колкото пъти иска - а вие по всяко време отново тук. Важи последният избор.`,
    abstandName: (name: string) => `По-голямо разстояние (CVI): ${name}`,
    listenTitel: "Ученици в класа с нивото и седмичната цел",
    tastenSr: (sitzen: number, frei: number) => [
      "Сигурни клавиши: ",
      sitzen,
      ", отключени клавиши: ",
      frei,
      "",
    ],
    bezugBlock: (datum: string) => `за 4-те седмици на упражнения от ${datum}`,
    bezugWoche: (datum: string) => `за седмицата от ${datum}`,
    gruppePerson: "Ученик",
    gruppeStand: "Напредък и време за упражнения",
    gruppeUeben: "Упражнения",
    gruppePruefung: PRUEFUNG_WORT_BG,
    kopfName: "Име",
    kopfStufe: "Ниво",
    kopfTasten: "Клавиши",
    kopfNaechste: "Следващи клавиши",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "всички клавиши са сигурни" : `следва ${namen.join(", после ")}`,
    kopfUebezeit: "Време за упражнения",
    kopfWochenziel: "Седмична цел",
    kopfWochenziele: "Седмични цели",
    kopfTreffer: "Точност",
    kopfTempo: "Знаци/мин",
    kopfScore: "Резултат",
    uebungszeiten: "Време за упражнения",
    nochKeineUebung: "още няма записано упражнение",
    uebungszeitenKennzahl: (dauer: string, wochen: number) => `${dauer} - седмици: ${wochen}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - дни: ",
      tage,
      "",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt}/${ziel} мин`,
    periodeMatches: (n: number) => ` - Състезания в класа: ${n}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Още няма Състезание в класа, изиграно до края"
        : `Състезания в класа, изиграни до края: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Брои се всяко Състезание в класа в този клас, изиграно до края - от ${seit}; ` +
      `по-ранните не са записвани. Ученик: ${name}. ` +
      `Прекъснатите или напуснатите преди края състезания не се броят. Състезанието се отчита ` +
      `около час след края му. Само броят: без класиране, победите не се ` +
      `броят.`,
    kopfKlassenmatch: "Състезание в класа",
    klassenmatchOhneZahl: "Състезание в класа: няма данни",
    gruppeKlassenmatch: "Състезание в класа",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Колко Състезания в класа са изиграни до края. Прекъснатите или напуснатите преди края ` +
      `не се броят; победите не се броят. Записва се ` +
      `от ${seit}. Знакът „-“ означава: Състезанието в класа е изключено за този клас ` +
      `или броят не можа да се зареди.`,
    wocheHilfe: (pauseMin: number) =>
      `Разгънато се вижда всяко време за упражнения през тази седмица: ден, час ` +
      `на начало и край, времето за упражнения и какво е упражнявано. Времето за упражнения е само ` +
      `самото писане - паузите не се броят, затова то често е по-кратко от показания ` +
      `период. След повече от ${pauseMin} мин без натискане на клавиш започва ` +
      `ново време за упражнения.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Моята тренировка",
        lektion: "Уроци",
        geschichte: "Истории",
        wortspiel: "Игри с думи",
        tippchallenge: PRUEFUNG_WORT_BG,
        klassenmatch: "Състезание в класа",
        "eigene-uebung": EIGENE_UEBUNG_WORT_BG_LEHRKRAFT,
      })[art],
    wackligeTasten: "Несигурни клавиши",
    nochZuWenigGeuebt: "още малко упражнения",
    zuWenigUmZuSagen: "Още е рано за преценка - упражненията са малко.",
    wackligCaption: (name: string) => ["Несигурни клавиши: ", name],
    tasteKopf: "Клавиш",
    tasteHilfe: (prozent: number) =>
      `Клавишът още е несигурен - опити: поне ${WACKLIG_MIND_ANSCHLAEGE}, верни натискания: под ${prozentText(prozent, "bg")}.`,
    trefferKopf: "Точност",
    trefferHilfe: "Делът на верните натискания на този клавиш.",
    tempoKopf: "Скорост",
    tempoHilfe: "Колко бързо е вървял този клавиш напоследък - натискания на този клавиш в минута.",
    abzeichen: (n: number) => ["Значки - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_BG} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_BG,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_BG}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Настройки: ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Седмична цел: ${zielMin} мин` : "без седмична цел",
    ],
    eigenstaendigkeit: (n: number) => ["Самостоятелна работа - забележки:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Настройки и преглед - настройки, време за упражнения, несигурни клавиши и значки; всичко останало е в „Моят напредък“ на този ученик. Ученик: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Затвори" : "Отвори"} настройките и прегледа: ${name}`,
    keinZielGesetzt: "няма зададена седмична цел",
    keineAbgeschlossene: "още няма приключила седмица с цел",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      "Изпълнени седмични цели: ",
      prozent,
      "%, изцяло изпълнени седмици: ",
      ganz,
      "/",
      gesamt,
      "",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["цели седмици: ", ganz, "/", gesamt, ""],
    wocheErlassen: "тази седмица е освободена",
    keineZielwoche: "не е седмица с цел",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " мин"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " мин, цел: ", nenner, " мин"],
    offenSr: (minuten: number) => `, от тях за наваксване от минали седмици: ${minuten} мин`,
    erreichtSr: ", седмичната цел е изпълнена",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " мин за наваксване"],
    klasseNichtGespeichert: "Настройката на класа не можа да се запише.",
    kinderEingetragen: (n: number) =>
      ` Записано за: ${uchenitsiBg(n)} - важи от следващото отваряне на ` +
      `Tastenflow. Статистиката и значките остават.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Начална точка за класа: ${label}. Важи и за тези, които се присъединят по-късно.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Настройката по подразбиране на класа не можа да се запише.${kinderSatz}`,
    gesperrtZusatz: " (заключено)",
    stufeWaehlen: "Изберете ниво",
    vorgabeKlasse: (label: string) => `По подразбиране за класа: ${label}`,
    dieMeisten: (label: string) => `повечето са на ниво: ${label}`,
    bezugKlasse: (name: string) => `на клас ${name}`,
    startHinweis:
      "какво вече може класът - важи за всички ученици в този клас, и за тези, които се присъединят по-късно",
    startSrHinweis:
      "Първият запис показва настройката по подразбиране на класа и нивото, на което са повечето ученици. " +
      "Изборът на ниво го записва като настройка по подразбиране на класа - важи и за тези, които се присъединят по-късно - " +
      "и го задава на учениците, които вече са в класа; ако някой е стигнал по-далеч, програмата първо пита. " +
      "Важи за всеки ученик от следващото отваряне на Tastenflow; статистиката и значките остават.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Класът в училище е премахнат. Отново важи настройката по подразбиране (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Клас в училище: Възрастни. Текстовете вече са за възрастни (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Клас в училище: ${schulstufeLabelBg(wert)}. Текстовете вече са според възрастта ` +
      `(${label}).`,
    spracheDerKlasse: (sprache: string) => `Език на класа: ${sprache}.`,
    spracheGesperrt: "Езикът е заключен за учениците в този клас.",
    spracheFrei: "Езикът отново може да се избира свободно.",
    matchNichtUmgestellt: "Състезанието в класа не можа да се превключи.",
    matchErlaubt: "Състезанието в класа е разрешено за този клас.",
    matchAus: "Състезанието в класа е изключено за този клас.",
    zeilenEndeAn:
      "Всеки ред вече завършва с клавиша Enter - за всички ученици в този клас.",
    zeilenEndeAus: "Краят на реда с Enter е изключен за този клас.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `Учебната година на този клас вече започва на първия ден от месеца: ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Правопис: ${label} - за всички ученици в този клас.`,
    schreibweiseAutoLabel: "автоматично",
    schreibweiseGbLabel: "британски",
    schreibweiseUsLabel: "американски",
    startFrageTitel: "Начална точка за целия клас",
    frageVor: (_n: number) => ["По-напред от избраното ниво", ":", " "],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "bg", { one: () => "ученик", other: () => "ученици" }),
    ],
    frageNach: (_n: number) => [
      ".",
      " Наистина ли да се зададе това ниво на целия клас?",
    ],
    detailVor: "Избрано: ",
    detailNach: (namen: string) => [
      ". Вече по-напред:",
      " ",
      namen,
      ". Връщането назад отнема вече преминато съдържание - статистиката на писането, времето за упражнения и значките остават във всеки случай. Важи за всеки ученик от следващото отваряне на Tastenflow.",
    ],
    alleEinstufen: "Задай нивото на целия клас",
    nurNochNicht: "Само на тези, които още не са стигнали дотук",
    startZurueck: (name: string, label: string) =>
      `Върнато на ниво: ${label}. Ученик: ${name}. Важи от следващото отваряне на Tastenflow. ` +
      `Статистиката и значките остават.`,
    startpunktVon: (name: string, label: string) => `Начална точка - ${name}: ${label}.`,
    wochenzielNichtGespeichert: (name: string) =>
      `Седмичната цел не можа да се запише. Ученик: ${name}.`,
    wochenzielGespeichert: (name: string) => `Седмичната цел е записана: ${name}.`,
    ueberfaelligFrage: (name: string) =>
      `Да се нулират ли минутите за наваксване от седмичната цел? Ученик: ${name}.\n\n` +
      `Събраните досега минути за наваксване се изтриват; от тази седмица ` +
      `седмичната цел започва отначало. Времето за упражнения и статистиката остават.`,
    ueberfaelligErledigt: (name: string) => `Минутите за наваксване са нулирани: ${name}.`,
    erlasseneGespeichert: "Освободените седмици са записани.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Седмична цел (${minutenBg(minuten)})` : "Без седмична цел"} - записано: ${ok}/${gesamt}; важи от ` +
      `${naechsterMontagBg(jetztMs)}, 8:00 ч.`,
    klassenZielFehler: (namen: string) =>
      ` Не се получи при: ${namen} - моля, опитайте отново.`,
    sperreNichtAufgehoben: "Целта не можа да се възобнови.",
    sperreAufgehoben:
      "Целта е възобновена - времето за упражнения отново се брои към седмичната цел.",
    stundeNichtGesperrt: "Целта не можа да се спре за един час.",
    gesperrtBisStatus: (zeit: string) =>
      `Седмичната цел на класа е спряна до ${zeit} - ` +
      `времето за упражнения и статистиката се броят, спряна е само седмичната цел.`,
    stundeGesperrt: "Целта е спряна за един час.",
    excelLaeuft: "Файлът на Excel се подготвя - момент.",
    excelFertig: (datei: string) =>
      `Изтеглено: ${datei} - с преглед и обяснение към него и с четири листа: учебна година, от началото, месец и седмица.`,
    excelFehler:
      "Файлът на Excel не можа да се създаде. Опитайте отново; " +
      "ако това се повтаря, съобщете за проблема.",
    laedt: "Зареждане...",
    lesefehlerStark: "Напредъкът не можа да се зареди",
    lesefehlerFuer: (namen: string) => [
      " за тези ученици:",
      " ",
      namen,
      ". Затова числата в тези редове са празни и ",
    ],
    lesefehlerNicht: "не означават",
    lesefehlerSchluss:
      ", че не е писано. Обновете страницата; ако това се повтаря, съобщете за проблема.",
    aufgabenGruppe: "Задачи за класа",
    tippchallengeTipp:
      "Отваря Предизвикателството за целия клас: изберете текст и време - а после, също тук, и резултатите.",
    tippchallenge: PRUEFUNG_WORT_BG,
    eigeneUebungTipp:
      "Дава на класа качен файл като текст за упражнение - всеки ученик го упражнява в свое темпо; така не се отключват нови клавиши.",
    eigeneUebung: EIGENE_UEBUNG_WORT_BG_LEHRKRAFT,
    wochenzielTipp:
      "Определя колко минути седмично се упражнява класът - за всеки ученик поотделно или за всички наведнъж.",
    zielStatusMin: (minuten: string) => `${minuten} мин`,
    zielGesetzt: "зададена",
    keinZiel: "без цел",
    einstellungenTipp:
      "Задайте за целия клас: клас в училище, език, начална точка и Състезание в класа.",
    einstellungenDerKlasse: "Настройки на класа",
    sperreBeendenTipp:
      "Веднага възобновява целта - след това времето за упражнения отново се брои към седмичната цел.",
    sperrenTipp:
      "Спира седмичната цел за 60 минути за целия клас. Упражненията продължават - времето за упражнения и статистиката се броят, спряна е само седмичната цел.",
    gesperrtBisKnopf: (zeit: string) => `Спряно до ${zeit} - възобнови`,
    stundeSperren: "Спри за 1 час",
    wochenzielAufgabe: "Седмична цел - задача",
    zielFuerKlasseGesetzt: "- зададена за учениците в този клас",
    nochKeinZielGesetzt: "- още няма зададена цел",
    minutenZuerst: "Първо въведете минути седмично (от 0 до 600).",
    klassenZielTipp:
      "Задава тази седмична цел от следващата седмица на всеки ученик в този клас - и на тези, които се присъединят по-късно. Целите, зададени поотделно, се заменят.",
    fuerKlasseUebernehmen: "Приложи за целия клас",
    wochenzielFuerKlasse: (bezeichnung: string) => `Седмична цел ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Изтегли като Excel: изтегля таблицата като файл на Excel ` +
      `${datei} - отначало с преглед и обяснение към него, ` +
      `после четири листа: текущата учебна година, от началото, месец (последните ` +
      `4 седмици) и тази седмица, независимо от избрания тук период.`,
    alsExcel: "Изтегли като Excel",
    schulstufeKind: "Клас в училище",
    schulstufeKindName: (name: string) => `Клас в училище: ${name}`,
    wieDieKlasse: (klasse: string) => `като класа (${klasse})`,
    schulstufeKindTipp:
      "Само за този ученик: класът в училище определя текстовете и заменя настройката на класа. С всяка учебна година се вдига сам. Изборът „като класа“ отменя това изключение.",
    schulstufeKindGesetzt: (name: string, stufe: string) => `Текстовете вече отговарят на: ${stufe}. Ученик: ${name}.`,
    schulstufeKindErwachsen: (name: string) => `Текстовете вече са за възрастни. Ученик: ${name}.`,
    schulstufeKindWieKlasse: (name: string) => `Текстовете отново отговарят на класа. Ученик: ${name}.`,
  },
  el: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Ο νέος στόχος (${minutenEl(Math.round(minuten))} την εβδομάδα) ισχύει από τη ${naechsterMontagEl(jetztMs)}, 8:00. ` +
      `Ως τότε ισχύει ο προηγούμενος στόχος.`,
    keinZielMehr: (jetztMs: number) =>
      `Από τη ${naechsterMontagEl(jetztMs)}, 8:00, δεν θα υπάρχει πια εβδομαδιαίος στόχος. ` +
      `Ως τότε ισχύει ο προηγούμενος στόχος.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `Το μοναδικό άτομο αυτού του τμήματος παίρνει στόχο: ${minutenEl(minuten)} την εβδομάδα.`
            : "Το μοναδικό άτομο αυτού του τμήματος δεν θα έχει πια εβδομαδιαίο στόχο."
          : minuten > 0
            ? `Όλα τα άτομα αυτού του τμήματος (${anzahlKinder}) παίρνουν στόχο: ${minutenEl(minuten)} την εβδομάδα.`
            : `Όλα τα άτομα αυτού του τμήματος (${anzahlKinder}) δεν θα έχουν πια εβδομαδιαίο στόχο.`;
      return (
        `${satz} Ισχύει από τη ${naechsterMontagEl(jetztMs)}, 8:00 - ως τότε ` +
        `ισχύει ο προηγούμενος στόχος. Οι στόχοι που ορίστηκαν για μεμονωμένα άτομα αντικαθίστανται. ` +
        (minuten > 0
          ? "Όσοι προστεθούν αργότερα θα πάρουν κι αυτοί αυτόν τον στόχο."
          : "Όσοι προστεθούν αργότερα δεν θα έχουν κι αυτοί στόχο.")
      );
    },
    wochenziel: "Εβδομαδιαίος στόχος",
    minutenProWoche: "Λεπτά την εβδομάδα",
    nullKeinZiel: "0 = χωρίς εβδομαδιαίο στόχο.",
    zielKalenderwochen: "Εβδομάδες με στόχο",
    speichernTipp: (name: string) =>
      `Αποθηκεύει μαζί τα λεπτά, τις εβδομάδες με στόχο και την αναπλήρωση - μόνο μετά από επιβεβαίωση. Όνομα: ${name}. Η αλλαγή ισχύει από την επόμενη εβδομάδα.`,
    nichtsGeaendert: "Ο εβδομαδιαίος στόχος δεν άλλαξε - είναι ήδη αποθηκευμένος.",
    speichern: "Αποθήκευση",
    nachholenTipp:
      "Τα επιπλέον λεπτά εξάσκησης συμπληρώνουν τους ανοιχτούς εβδομαδιαίους στόχους προηγούμενων εβδομάδων - πρώτα τον παλαιότερο.",
    nachholen: "Αναπλήρωση λεπτών από προηγούμενες εβδομάδες",
    dieseWoche: "Αυτή την εβδομάδα:",
    min: "λεπτά",
    keinWochenziel: "χωρίς εβδομαδιαίο στόχο",
    anstehend: (datum: string, minuten: number) => [" - από τη Δευτέρα ", datum, ", λεπτά: ", minuten],
    ueberfaelligTipp:
      "Μηδενίζει τα λεπτά για αναπλήρωση από προηγούμενες εβδομάδες - από αυτή την εβδομάδα ο εβδομαδιαίος στόχος ξεκινά ξανά από το μηδέν. Ο χρόνος εξάσκησης μένει.",
    ueberfaelligZuruecksetzen: "Μηδενισμός λεπτών για αναπλήρωση",
    zuletztZurueckgesetzt: (ab: string) => ["τελευταίος μηδενισμός: ", ab],
    erlassenTipp:
      "Οι εβδομάδες που επιλέγετε δεν μετρούν ποτέ ως χαμένες ή για αναπλήρωση - ανεξάρτητα από το αν είναι σημειωμένες ως εβδομάδες με στόχο. Ο χρόνος εξάσκησης μένει.",
    wochenzielErlassen: "Απαλλαγή από την εβδομάδα",
    wochenzielFuer: (name: string) => `Εβδομαδιαίος στόχος: ${name}`,
    uebernehmen: "Εφαρμογή",
    abbrechen: "Άκυρο",
    einstellungen: "Ρυθμίσεις",
    womitAnfangen: "Σημείο εκκίνησης",
    womitTipp:
      "τι ξέρει ήδη αυτό το άτομο - ένα προηγούμενο σημείο εκκίνησης το επιστρέφει πίσω (μόνο μετά από επιβεβαίωση), τα στατιστικά και τα μετάλλια μένουν.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `Όνομα: ${name}. Τωρινό σημείο: ${label}.\n\n` +
      `Θέλετε σίγουρα να γίνει επιστροφή στο σημείο: ${ziel};\n\n` +
      `Η εξάσκηση θα περιοριστεί τότε στα πλήκτρα ως αυτό το σημείο. Τα στατιστικά πατημάτων, ` +
      `ο χρόνος εξάσκησης και τα μετάλλια μένουν - αν αργότερα γίνει ξανά πρόοδος, ` +
      `όλα θα είναι εδώ όπως ήταν.\n\n` +
      `Ισχύει μόλις αυτό το άτομο ανοίξει την επόμενη φορά το Tastenflow.`,
    womitName: (name: string) => `Σημείο εκκίνησης: ${name}`,
    ausstehend: (name: string) => ["Ισχύει από το επόμενο άνοιγμα του Tastenflow (", name, ")."],
    einhandTipp:
      "Τα κεφαλαία και τα σύμβολα γίνονται δεκτά με οποιοδήποτε πλήκτρο Shift (ή με το Caps Lock) - ο κανόνας «Shift με το άλλο χέρι» είναι απενεργοποιημένος για αυτό το άτομο.",
    einhandName: (name: string) => `Γραφή με ένα χέρι: ${name} - ο κανόνας του άλλου χεριού είναι απενεργοποιημένος`,
    einhand: "Γραφή με ένα χέρι",
    tempoTipp:
      "Για αυτό το άτομο η ταχύτητα δεν μετρά πουθενά - στο παιχνίδι κανένα χρονικό όριο, στα αστέρια κανένα όριο ταχύτητας, το επίπεδο δυσκολίας δεν ανεβαίνει ούτε κατεβαίνει, και ο χρόνος εξάσκησης μετρά και στις μεγάλες παύσεις. Για όσους γράφουν προσεκτικά, αλλά πολύ αργά.",
    tempoName: (name: string) => `Με την ησυχία σου: ${name} - η ταχύτητα δεν αξιολογείται πουθενά`,
    tempoZaehltNicht: "Με την ησυχία σου",
    abstand: "Μεγαλύτερη απόσταση γραμμάτων (CVI)",
    abstandTipp: `Μεγαλύτερη απόσταση ανάμεσα σε ΚΑΘΕ χαρακτήρα κατά την αντιγραφή - για άτομα με εγκεφαλική οπτική αναπηρία (CVI), για τα οποία οι χαρακτήρες που στέκονται κοντά μπερδεύονται μεταξύ τους. Η «διπλή» δίνει διπλάσιο, η «τριπλή» τριπλάσιο και η «τετραπλή» τετραπλάσιο πλάτος ανά χαρακτήρα. Κατά τη γραφή σκοτεινιάζουν όλα εκτός από το πεδίο όπου γράφει το άτομο εκείνη τη στιγμή (γραμμή άσκησης ή πεδίο παιχνιδιού). Μετά από 5 δευτερόλεπτα χωρίς πάτημα όλα φωτίζονται ξανά. Η γραμμή άσκησης γλιστράει ομαλά στον επόμενο χαρακτήρα με τον ρυθμό γραφής του ατόμου - αργά, όταν γράφει αργά - αντί να πηδάει. Η «απλή» αφήνει τους χαρακτήρες στη συνηθισμένη απόσταση και ενεργοποιεί μόνο το σκοτείνιασμα, το γλίστρημα της γραμμής και τη γραμμή ανάγνωσης. Το άτομο μπορεί να αλλάξει την απόσταση και το ίδιο στις Ρυθμίσεις του (γρανάζι, Alt + O), όσες φορές θέλει - κι εσείς εδώ οποιαδήποτε στιγμή. Ισχύει η τελευταία επιλογή.`,
    abstandName: (name: string) => `Μεγαλύτερη απόσταση γραμμάτων (CVI): ${name}`,
    listenTitel: "Μαθητές του τμήματος με επίπεδο και εβδομαδιαίο στόχο",
    tastenSr: (sitzen: number, frei: number) => [
      "Σίγουρα πλήκτρα: ",
      sitzen,
      ", ξεκλειδωμένα πλήκτρα: ",
      frei,
      "",
    ],
    bezugBlock: (datum: string) => `στις 4 εβδομάδες εξάσκησης από ${datum}`,
    bezugWoche: (datum: string) => `στην εβδομάδα από ${datum}`,
    gruppePerson: "Άτομο",
    gruppeStand: "Πρόοδος και χρόνος εξάσκησης",
    gruppeUeben: "Εξάσκηση",
    gruppePruefung: PRUEFUNG_WORT_EL,
    kopfName: "Όνομα",
    kopfStufe: "Επίπεδο δυσκολίας",
    kopfTasten: "Πλήκτρα",
    kopfNaechste: "Επόμενα πλήκτρα",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "όλα τα πλήκτρα είναι σίγουρα" : `πρώτα ${namen.join(", μετά ")}`,
    kopfUebezeit: "Χρόνος εξάσκησης",
    kopfWochenziel: "Εβδομαδιαίος στόχος",
    kopfWochenziele: "Εβδομαδιαίοι στόχοι",
    kopfTreffer: "Ακρίβεια",
    kopfTempo: "Πατήματα/λεπτό",
    kopfScore: "Σκορ",
    uebungszeiten: "Χρόνοι εξάσκησης",
    nochKeineUebung: "δεν έχει καταγραφεί ακόμα εξάσκηση",
    uebungszeitenKennzahl: (dauer: string, wochen: number) => `${dauer} - εβδομάδες: ${wochen}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - ημέρες: ",
      tage,
      "",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - λεπτά: ${erfuellt} από ${ziel}`,
    periodeMatches: (n: number) => ` - Αγώνες τμήματος: ${n}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Κανένας Αγώνας τμήματος ως το τέλος ακόμα"
        : `Αγώνες τμήματος ως το τέλος: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Μετρά κάθε Αγώνα τμήματος σε αυτό το τμήμα που ολοκληρώθηκε ως το τέλος - από ${seit}. ` +
      `Οι προηγούμενοι δεν καταγράφονταν. Όνομα: ${name}. ` +
      `Οι αγώνες που διακόπηκαν ή εγκαταλείφθηκαν νωρίτερα δεν μετρούν. Ένας αγώνας μετρά ` +
      `περίπου μία ώρα μετά το τέλος του. Μόνο το πλήθος: καμία κατάταξη, οι νίκες δεν ` +
      `μετρούν.`,
    kopfKlassenmatch: "Αγώνας τμήματος",
    klassenmatchOhneZahl: "Αγώνας τμήματος: χωρίς στοιχεία",
    gruppeKlassenmatch: "Αγώνας τμήματος",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Πόσοι Αγώνες τμήματος ολοκληρώθηκαν ως το τέλος. Όσοι διακόπηκαν ή εγκαταλείφθηκαν νωρίτερα ` +
      `δεν μετρούν, οι νίκες δεν μετρούν. Καταγράφεται ` +
      `από ${seit}. Η παύλα «-» σημαίνει: ο Αγώνας τμήματος είναι απενεργοποιημένος σε αυτό το τμήμα ` +
      `ή δεν ήταν δυνατή η φόρτωση του πλήθους.`,
    wocheHilfe: (pauseMin: number) =>
      `Όταν ανοίξει, φαίνεται κάθε χρόνος εξάσκησης αυτής της εβδομάδας: ημέρα, ώρα ` +
      `έναρξης και λήξης, ο χρόνος εξάσκησης και τι εξασκήθηκε. Ο χρόνος εξάσκησης είναι μόνο ` +
      `η καθαρή γραφή - οι παύσεις δεν μετρούν, επομένως είναι συχνά μικρότερος από το διάστημα ` +
      `που φαίνεται. Μετά από περισσότερο από ${minutenEl(pauseMin)} χωρίς πάτημα ξεκινά ` +
      `νέος χρόνος εξάσκησης.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Η εξάσκησή μου",
        lektion: "Μαθήματα",
        geschichte: "Ιστορίες",
        wortspiel: "Παιχνίδια λέξεων",
        tippchallenge: PRUEFUNG_WORT_EL,
        klassenmatch: "Αγώνας τμήματος",
        "eigene-uebung": EIGENE_UEBUNG_WORT_EL_LEHRKRAFT,
      })[art],
    wackligeTasten: "Αβέβαια πλήκτρα",
    nochZuWenigGeuebt: "λίγη εξάσκηση ακόμα",
    zuWenigUmZuSagen: "Η εξάσκηση είναι ακόμα πολύ λίγη για εκτίμηση.",
    wackligCaption: (name: string) => ["Αβέβαια πλήκτρα: ", name],
    tasteKopf: "Πλήκτρο",
    tasteHilfe: (prozent: number) =>
      `Το πλήκτρο είναι ακόμα αβέβαιο - προσπάθειες τουλάχιστον ${WACKLIG_MIND_ANSCHLAEGE}, σωστά πατήματα κάτω από ${prozentText(prozent, "el")}.`,
    trefferKopf: "Ακρίβεια",
    trefferHilfe: "Ποσοστό σωστών πατημάτων σε αυτό το πλήκτρο.",
    tempoKopf: "Ταχύτητα",
    tempoHilfe: "Πόσο γρήγορα πήγε αυτό το πλήκτρο τελευταία - πατήματα σε αυτό το πλήκτρο ανά λεπτό.",
    abzeichen: (n: number) => ["Μετάλλια - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_EL} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_EL,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_EL}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Ρυθμίσεις: ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Εβδομαδιαίος στόχος: ${minutenEl(zielMin)}` : "χωρίς εβδομαδιαίο στόχο",
    ],
    eigenstaendigkeit: (n: number) => ["Αυτόνομη εργασία - ενδείξεις:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Ρυθμίσεις και επισκόπηση - ρυθμίσεις, χρόνοι εξάσκησης, αβέβαια πλήκτρα και μετάλλια. Όλα τα υπόλοιπα βρίσκονται στην ενότητα «Η πρόοδός μου» αυτού του ατόμου. Όνομα: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Κλείσιμο" : "Άνοιγμα"} ρυθμίσεων και επισκόπησης: ${name}`,
    keinZielGesetzt: "δεν έχει οριστεί εβδομαδιαίος στόχος",
    keineAbgeschlossene: "καμία ολοκληρωμένη εβδομάδα με στόχο ακόμα",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      "Ολοκληρωμένοι εβδομαδιαίοι στόχοι: ",
      prozent,
      "%, πλήρεις εβδομάδες: ",
      ganz,
      " από ",
      gesamt,
      "",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["πλήρεις εβδομάδες: ", ganz, "/", gesamt, ""],
    wocheErlassen: "απαλλαγή για αυτή την εβδομάδα",
    keineZielwoche: "δεν είναι εβδομάδα με στόχο",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " λεπτά"],
    wocheSr: (zaehler: number, nenner: number) => ["Λεπτά: ", zaehler, ", στόχος: ", nenner],
    offenSr: (minuten: number) => `, από τα οποία για αναπλήρωση από προηγούμενες εβδομάδες: ${minutenEl(minuten)}`,
    erreichtSr: ", ο εβδομαδιαίος στόχος ολοκληρώθηκε",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " λεπτά για αναπλήρωση"],
    klasseNichtGespeichert: "Δεν ήταν δυνατή η αποθήκευση της ρύθμισης του τμήματος.",
    kinderEingetragen: (n: number) =>
      ` Αποθηκεύτηκε για: ${atomaEl(n)} - ισχύει από το επόμενο άνοιγμα του ` +
      `Tastenflow. Τα στατιστικά και τα μετάλλια μένουν.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Σημείο εκκίνησης για το τμήμα: ${label}. Ισχύει και για όσους προστεθούν αργότερα.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Δεν ήταν δυνατή η αποθήκευση της προεπιλογής του τμήματος.${kinderSatz}`,
    gesperrtZusatz: " (κλειδωμένο)",
    stufeWaehlen: "Επιλέξτε σημείο εκκίνησης",
    vorgabeKlasse: (label: string) => `Προεπιλογή του τμήματος: ${label}`,
    dieMeisten: (label: string) => `τα περισσότερα άτομα είναι στο: ${label}`,
    bezugKlasse: (name: string) => `του τμήματος ${name}`,
    startHinweis:
      "τι ξέρει ήδη το τμήμα - ισχύει για όλους τους μαθητές αυτού του τμήματος, και για όσους προστεθούν αργότερα",
    startSrHinweis:
      "Η πρώτη επιλογή δείχνει την προεπιλογή του τμήματος και το σημείο όπου βρίσκονται τα περισσότερα άτομα. " +
      "Η επιλογή ενός σημείου το αποθηκεύει ως προεπιλογή του τμήματος - ισχύει και για όσους προστεθούν αργότερα - " +
      "και το καταχωρίζει στους μαθητές που είναι ήδη στο τμήμα. Αν κάποιοι είναι ήδη πιο μπροστά, το πρόγραμμα ρωτά πρώτα. " +
      "Ισχύει για κάθε άτομο από το επόμενο άνοιγμα του Tastenflow. Τα στατιστικά και τα μετάλλια μένουν.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Η τάξη αφαιρέθηκε. Ισχύει ξανά η προεπιλογή (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Τάξη: Ενήλικες. Τα κείμενα είναι τώρα για ενήλικες (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Τάξη: ${schulstufeLabelEl(wert)}. Τα κείμενα είναι τώρα προσαρμοσμένα στην ηλικία ` +
      `(${label}).`,
    spracheDerKlasse: (sprache: string) => `Γλώσσα του τμήματος: ${sprache}.`,
    spracheGesperrt: "Η γλώσσα είναι κλειδωμένη για τους μαθητές αυτού του τμήματος.",
    spracheFrei: "Η γλώσσα μπορεί ξανά να επιλεγεί ελεύθερα.",
    matchNichtUmgestellt: "Δεν ήταν δυνατή η αλλαγή του Αγώνα τμήματος.",
    matchErlaubt: "Ο Αγώνας τμήματος επιτρέπεται σε αυτό το τμήμα.",
    matchAus: "Ο Αγώνας τμήματος είναι απενεργοποιημένος σε αυτό το τμήμα.",
    zeilenEndeAn:
      "Κάθε γραμμή τελειώνει τώρα με το πλήκτρο Enter - για όλους τους μαθητές αυτού του τμήματος.",
    zeilenEndeAus: "Το «Τέλος γραμμής με Enter» είναι απενεργοποιημένο σε αυτό το τμήμα.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `Το σχολικό έτος αυτού του τμήματος ξεκινά τώρα την πρώτη ημέρα του μήνα: ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Ορθογραφία: ${label} - για όλους τους μαθητές αυτού του τμήματος.`,
    schreibweiseAutoLabel: "αυτόματη",
    schreibweiseGbLabel: "βρετανική",
    schreibweiseUsLabel: "αμερικανική",
    startFrageTitel: "Σημείο εκκίνησης για όλο το τμήμα",
    frageVor: (_n: number) => ["Πιο μπροστά από το επιλεγμένο σημείο", ":", " "],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "el", { one: () => "άτομο", other: () => "άτομα" }),
    ],
    frageNach: (_n: number) => [
      ".",
      " Θέλετε σίγουρα να ορίσετε όλο το τμήμα σε αυτό το σημείο;",
    ],
    detailVor: "Επιλογή: ",
    detailNach: (namen: string) => [
      ". Ήδη πιο μπροστά:",
      " ",
      namen,
      ". Η επιστροφή πίσω αφαιρεί περιεχόμενο που έχει ήδη γίνει - τα στατιστικά πατημάτων, ο χρόνος εξάσκησης και τα μετάλλια μένουν σε κάθε περίπτωση. Ισχύει για κάθε άτομο από το επόμενο άνοιγμα του Tastenflow.",
    ],
    alleEinstufen: "Όλο το τμήμα σε αυτό το σημείο",
    nurNochNicht: "Μόνο όσοι δεν έχουν φτάσει ακόμα εδώ",
    startZurueck: (name: string, label: string) =>
      `Επιστροφή στο σημείο: ${label}. Όνομα: ${name}. Ισχύει από το επόμενο άνοιγμα του Tastenflow. ` +
      `Τα στατιστικά και τα μετάλλια μένουν.`,
    startpunktVon: (name: string, label: string) => `Σημείο εκκίνησης - ${name}: ${label}.`,
    wochenzielNichtGespeichert: (name: string) =>
      `Δεν ήταν δυνατή η αποθήκευση του εβδομαδιαίου στόχου. Όνομα: ${name}.`,
    wochenzielGespeichert: (name: string) => `Ο εβδομαδιαίος στόχος αποθηκεύτηκε: ${name}.`,
    ueberfaelligFrage: (name: string) =>
      `Θέλετε να μηδενίσετε τα λεπτά για αναπλήρωση του εβδομαδιαίου στόχου; Όνομα: ${name}.\n\n` +
      `Τα λεπτά για αναπλήρωση που έχουν συγκεντρωθεί ως τώρα διαγράφονται. Από αυτή την εβδομάδα ` +
      `ο εβδομαδιαίος στόχος ξεκινά ξανά από το μηδέν. Ο χρόνος εξάσκησης και τα στατιστικά μένουν.`,
    ueberfaelligErledigt: (name: string) => `Τα λεπτά για αναπλήρωση μηδενίστηκαν: ${name}.`,
    erlasseneGespeichert: "Οι εβδομάδες με απαλλαγή αποθηκεύτηκαν.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Εβδομαδιαίος στόχος (${minutenEl(minuten)})` : "Χωρίς εβδομαδιαίο στόχο"} - αποθηκεύτηκε: ${ok} από ${gesamt}. Ισχύει από τη ` +
      `${naechsterMontagEl(jetztMs)}, 8:00.`,
    klassenZielFehler: (namen: string) =>
      ` Δεν έγινε για: ${namen} - δοκιμάστε ξανά.`,
    sperreNichtAufgehoben: "Δεν ήταν δυνατή η συνέχιση του στόχου.",
    sperreAufgehoben:
      "Ο στόχος συνεχίζεται - ο χρόνος εξάσκησης μετρά από τώρα ξανά για τον εβδομαδιαίο στόχο.",
    stundeNichtGesperrt: "Δεν ήταν δυνατή η παύση του στόχου για μία ώρα.",
    gesperrtBisStatus: (zeit: string) =>
      `Ο εβδομαδιαίος στόχος του τμήματος είναι σε παύση έως: ${zeit} - ` +
      `ο χρόνος εξάσκησης και τα στατιστικά μετρούν κανονικά, σε παύση είναι μόνο ο εβδομαδιαίος στόχος.`,
    stundeGesperrt: "Ο στόχος είναι σε παύση για μία ώρα.",
    excelLaeuft: "Το αρχείο Excel ετοιμάζεται - μια στιγμή.",
    excelFertig: (datei: string) =>
      `Λήψη: ${datei} - με επισκόπηση και υπόμνημα, και με τέσσερα φύλλα: σχολικό έτος, από την αρχή, μήνας και εβδομάδα.`,
    excelFehler:
      "Δεν ήταν δυνατή η δημιουργία του αρχείου Excel. Δοκιμάστε ξανά. " +
      "Αν συμβεί πάλι, κάντε αναφορά.",
    laedt: "Φόρτωση...",
    lesefehlerStark: "Δεν ήταν δυνατή η φόρτωση της προόδου",
    lesefehlerFuer: (namen: string) => [
      " για αυτά τα άτομα:",
      " ",
      namen,
      ". Επομένως οι αριθμοί σε αυτές τις γραμμές είναι κενοί και ",
    ],
    lesefehlerNicht: "δεν σημαίνουν",
    lesefehlerSchluss:
      " ότι δεν έγινε εξάσκηση. Ανανεώστε τη σελίδα. Αν συμβεί πάλι, κάντε αναφορά.",
    aufgabenGruppe: "Εργασίες για το τμήμα",
    tippchallengeTipp:
      "Ανοίγει την Πρόκληση για όλο το τμήμα: επιλέξτε κείμενο και διάρκεια - και μετά, επίσης εδώ, τα αποτελέσματα.",
    tippchallenge: PRUEFUNG_WORT_EL,
    eigeneUebungTipp:
      "Αναθέτει στο τμήμα ένα αρχείο που ανεβάσατε ως κείμενο άσκησης - κάθε άτομο το εξασκεί με τον δικό του ρυθμό, έτσι δεν ξεκλειδώνονται νέα πλήκτρα.",
    eigeneUebung: EIGENE_UEBUNG_WORT_EL_LEHRKRAFT,
    wochenzielTipp:
      "Ορίζει πόσα λεπτά την εβδομάδα κάνει εξάσκηση το τμήμα - για κάθε άτομο χωριστά ή για όλους μαζί.",
    zielStatusMin: (minuten: string) => `λεπτά: ${minuten}`,
    zielGesetzt: "ορίστηκε",
    keinZiel: "χωρίς στόχο",
    einstellungenTipp:
      "Ορίστε για όλο το τμήμα: τάξη, γλώσσα, σημείο εκκίνησης και Αγώνα τμήματος.",
    einstellungenDerKlasse: "Ρυθμίσεις τμήματος",
    sperreBeendenTipp:
      "Συνεχίζει αμέσως τον στόχο - ο χρόνος εξάσκησης μετρά τότε ξανά για τον εβδομαδιαίο στόχο.",
    sperrenTipp:
      "Παύση του εβδομαδιαίου στόχου για 60 λεπτά, για όλο το τμήμα. Η εξάσκηση συνεχίζεται - ο χρόνος εξάσκησης και τα στατιστικά μετρούν κανονικά, σε παύση είναι μόνο ο εβδομαδιαίος στόχος.",
    gesperrtBisKnopf: (zeit: string) => `Παύση έως: ${zeit} - Συνέχιση στόχου`,
    stundeSperren: "Παύση για 1 ώρα",
    wochenzielAufgabe: "Εβδομαδιαίος στόχος - εργασία",
    zielFuerKlasseGesetzt: "- ορίστηκε για τους μαθητές αυτού του τμήματος",
    nochKeinZielGesetzt: "- δεν έχει οριστεί ακόμα στόχος",
    minutenZuerst: "Συμπληρώστε πρώτα τα λεπτά την εβδομάδα (0 έως 600).",
    klassenZielTipp:
      "Ορίζει αυτόν τον εβδομαδιαίο στόχο από την επόμενη εβδομάδα για κάθε άτομο αυτού του τμήματος - και για όσους προστεθούν αργότερα. Οι στόχοι που ορίστηκαν για μεμονωμένα άτομα αντικαθίστανται.",
    fuerKlasseUebernehmen: "Εφαρμογή σε όλο το τμήμα",
    wochenzielFuerKlasse: (bezeichnung: string) => `Εβδομαδιαίος στόχος: ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Λήψη ως Excel: κατεβάζει τον πίνακα ως αρχείο Excel ` +
      `${datei} - πρώτα με επισκόπηση και υπόμνημα, ` +
      `μετά τέσσερα φύλλα: το τρέχον σχολικό έτος, από την αρχή, ο μήνας (οι τελευταίες ` +
      `4 εβδομάδες) και αυτή η εβδομάδα, ανεξάρτητα από την περίοδο που έχει επιλεγεί εδώ.`,
    alsExcel: "Λήψη ως Excel",
    schulstufeKind: "Τάξη",
    schulstufeKindName: (name: string) => `Τάξη: ${name}`,
    wieDieKlasse: (klasse: string) => `όπως το τμήμα (${klasse})`,
    schulstufeKindTipp:
      "Μόνο για αυτό το άτομο: η τάξη καθορίζει τα κείμενα και ισχύει αντί για τη ρύθμιση του τμήματος. Ανεβαίνει μόνη της κάθε σχολικό έτος. Η επιλογή «όπως το τμήμα» καταργεί αυτή την εξαίρεση.",
    schulstufeKindGesetzt: (name: string, stufe: string) => `Τα κείμενα ταιριάζουν τώρα στην τάξη: ${stufe}. Όνομα: ${name}.`,
    schulstufeKindErwachsen: (name: string) => `Τα κείμενα ταιριάζουν τώρα σε ενήλικες. Όνομα: ${name}.`,
    schulstufeKindWieKlasse: (name: string) => `Τα κείμενα ταιριάζουν ξανά στο τμήμα. Όνομα: ${name}.`,
  },
  hu: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Az új cél (heti ${minutenHu(Math.round(minuten))}) érvényes ettől: ${naechsterMontagHu(jetztMs)}, 8:00. ` +
      `Addig a mostani cél marad érvényben.`,
    keinZielMehr: (jetztMs: number) =>
      `Nem lesz többé heti cél - érvényes ettől: ${naechsterMontagHu(jetztMs)}, 8:00. ` +
      `Addig a mostani cél marad érvényben.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `Az osztály egyetlen tanulója heti ${minutenHu(minuten)} célt kap.`
            : "Az osztály egyetlen tanulójának nem lesz többé heti célja."
          : minuten > 0
            ? `Az osztály minden tanulója (${anzahlKinder}) heti ${minutenHu(minuten)} célt kap.`
            : `Az osztály tanulóinak (${anzahlKinder}) nem lesz többé heti céljuk.`;
      return (
        `${satz} Érvényes ettől: ${naechsterMontagHu(jetztMs)}, 8:00 - addig ` +
        `a mostani cél marad érvényben. Az egyénileg beállított célok felülíródnak. ` +
        (minuten > 0
          ? "Aki később csatlakozik, szintén ezt a célt kapja."
          : "Aki később csatlakozik, szintén nem kap célt.")
      );
    },
    wochenziel: "Heti cél",
    minutenProWoche: "Perc hetente",
    nullKeinZiel: "0 = nincs heti cél.",
    zielKalenderwochen: "Hetek heti céllal",
    speichernTipp: (name: string) =>
      `Együtt menti a perceket, a heti céllal rendelkező heteket és a pótlást - csak megerősítés után. Tanuló: ${name}. A módosítás a jövő héttől érvényes.`,
    nichtsGeaendert: "A heti cél nem változott - már mentve van.",
    speichern: "Mentés",
    nachholenTipp:
      "A többletpercek feltöltik a korábbi hetek teljesítetlen céljait - elsőként a legrégebbit.",
    nachholen: "Elmaradt percek pótlása az előző hetekből",
    dieseWoche: "Ezen a héten:",
    min: "perc",
    keinWochenziel: "nincs heti cél",
    anstehend: (datum: string, minuten: number) => [" · hétfőtől (", datum, "): ", minuten, " perc"],
    ueberfaelligTipp:
      "Nullázza a korábbi hetekből pótlandó perceket - a heti cél ettől a héttől újra nulláról indul. A gyakorlással töltött idő megmarad.",
    ueberfaelligZuruecksetzen: "Pótlandó percek nullázása",
    zuletztZurueckgesetzt: (ab: string) => ["utoljára nullázva: ", ab],
    erlassenTipp:
      "A kiválasztott hetek soha nem számítanak elmaradtnak vagy pótlandónak - attól függetlenül, hogy heti céllal rendelkező hétként be vannak-e jelölve. A gyakorlással töltött idő megmarad.",
    wochenzielErlassen: "Hét elengedése",
    wochenzielFuer: (name: string) => `Heti cél: ${name}`,
    uebernehmen: "Alkalmaz",
    abbrechen: "Mégse",
    einstellungen: "Beállítások",
    womitAnfangen: "Honnan induljon?",
    womitTipp:
      "amit a tanuló már tud - alacsonyabb szint választása visszaléptet (megerősítés után); a statisztika és a jelvények megmaradnak.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `Tanuló: ${name}. Jelenlegi szint: ${label}.\n\n` +
      `Biztosan visszalépteti erre a szintre: ${ziel}?\n\n` +
      `A gyakorlás ezután ismét csak eddig a pontig tart. A leütésstatisztika, ` +
      `a gyakorlási idő és a jelvények megmaradnak - ha később újra feljebb lépteti, ` +
      `mindent változatlanul talál.\n\n` +
      `Akkor lép érvénybe, amikor a tanuló legközelebb megnyitja a Tastenflow programot.`,
    womitName: (name: string) => `Kiindulópont: ${name}`,
    ausstehend: (name: string) => ["A Tastenflow program következő megnyitásakor lép érvénybe (", name, ")."],
    einhandTipp:
      "A nagybetűket és a szimbólumokat bármelyik Shift billentyűvel (vagy a Caps Lock billentyűvel) elfogadja - a „Shift a másik kézzel” szabály ennél a tanulónál ki van kapcsolva.",
    einhandName: (name: string) => `Gépelés egy kézzel: ${name} - a Shift a másik kézzel szabály kikapcsolva`,
    einhand: "Gépelés egy kézzel",
    tempoTipp:
      "Ennél a tanulónál a sebesség sehol sem számít - a játékban nincs időkorlát, a csillagoknál nincs sebességcél, a nehézségi szint nem változik felfelé vagy lefelé, és a gyakorlási idő hosszú szünetek alatt is tovább számít. Azoknak, akik gondosan, de nagyon lassan gépelnek.",
    tempoName: (name: string) => `Nyugodtan: ${name} - a sebességet sehol nem értékeli a program`,
    tempoZaehltNicht: "Nyugodtan",
    abstand: "Nagyobb betűköz (CVI)",
    abstandTipp: `Nagyobb köz MINDEN karakter között másoláskor - cerebrális látássérüléssel (CVI) élő tanulóknak, akiknél az egymáshoz közel álló karakterek összefolynak. A „kétszeres” kétszeres, a „háromszoros” háromszoros, a „négyszeres” négyszeres szélességet ad karakterenként. Gépelés közben minden elsötétül, kivéve azt a mezőt, amelybe éppen gépel (a gyakorlósort vagy a játékteret); 5 másodpercnyi szünet után újra kivilágosodik. A gyakorlósor eközben a tanuló gépelési ütemében csúszik a következő karakterhez - lassan, ha lassan gépel - ugrálás helyett. Az „egyszeres” a megszokott távolságban hagyja a karaktereket, és csak az elsötétítést, a sor csúszását és az olvasósort kapcsolja be. A tanuló a közt maga is módosíthatja a saját beállításaiban (fogaskerék, Alt + O), ahányszor csak akarja - és itt bármikor visszaállítható. Mindig a legutóbb választott érték érvényes.`,
    abstandName: (name: string) => `Nagyobb betűköz (CVI): ${name}`,
    listenTitel: "Az osztály tanulói szinttel és heti céllal",
    tastenSr: (sitzen: number, frei: number) => [
      "Biztos billentyűk: ",
      sitzen,
      ", feloldott billentyűk: ",
      frei,
      "",
    ],
    bezugBlock: (datum: string) => `a 4 gyakorlóhéten (kezdete: ${datum})`,
    bezugWoche: (datum: string) => `a héten (kezdete: ${datum})`,
    gruppePerson: "Tanuló",
    gruppeStand: "Haladás és gyakorlási idő",
    gruppeUeben: "Gyakorlás",
    gruppePruefung: PRUEFUNG_WORT_HU,
    kopfName: "Név",
    kopfStufe: "Nehézségi szint",
    kopfTasten: "Billentyűk",
    kopfNaechste: "Következő billentyűk",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "minden billentyű megtanulva" : `következik: ${namen.join(", majd ")}`,
    kopfUebezeit: "Gyakorlási idő",
    kopfWochenziel: "Heti cél",
    kopfWochenziele: "Heti célok",
    kopfTreffer: "Pontosság",
    kopfTempo: "Leütés/perc",
    kopfScore: "Pontszám",
    uebungszeiten: "Gyakorlási idők",
    nochKeineUebung: "még nincs rögzített gyakorlás",
    uebungszeitenKennzahl: (dauer: string, wochen: number) =>
      `${dauer} · ${mehrzahl(wochen, "hu", { one: (z) => `${z} hét`, other: (z) => `${z} hét` })}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " · ",
      dauer,
      " · ",
      mehrzahl(tage, "hu", { one: (z) => `${z} napon`, other: (z) => `${z} napon` }),
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` · ${erfuellt}/${ziel} perc`,
    periodeMatches: (n: number) => ` · Osztályversenyek: ${n}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Még nem játszott végig Osztályversenyt"
        : `Végigjátszott Osztályversenyek: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Minden olyan Osztályverseny számít ebben az osztályban, amelyet a tanuló végigjátszott - ${seit} óta; ` +
      `korábban nem rögzítette őket a program. Tanuló: ${name}. ` +
      `A megszakított és az idő előtt elhagyott versenyek nem számítanak. Egy verseny ` +
      `körülbelül egy órával a vége után számít bele. Csak a szám: nincs rangsor, a győzelmeket ` +
      `nem számolja.`,
    kopfKlassenmatch: "Osztályverseny",
    klassenmatchOhneZahl: "Osztályverseny: nincs adat",
    gruppeKlassenmatch: "Osztályverseny",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Hány Osztályversenyt játszott végig a tanuló. A megszakított és az idő előtt elhagyott ` +
      `versenyek nem számítanak; a győzelmeket nem számolja. Rögzítés ` +
      `${seit} óta. A „-” jel azt jelenti: az Osztályverseny ebben az osztályban ki van kapcsolva, ` +
      `vagy a számot nem sikerült betölteni.`,
    wocheHilfe: (pauseMin: number) =>
      `Kinyitva látható a hét minden egyes gyakorlási ideje: a nap, a kezdés és a ` +
      `befejezés időpontja, a gyakorlással töltött idő és az, hogy mit gyakorolt. A gyakorlással ` +
      `töltött idő csak a tiszta gépelés - a szünetek nem számítanak, ezért gyakran rövidebb, ` +
      `mint a kezdés és a befejezés közötti idő. Több mint ${pauseMin} perc gépelés nélküli ` +
      `szünet után új gyakorlási idő kezdődik.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} · ${dauer}` : `${tag}, ${von}-${bis} · ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Saját gyakorlás",
        lektion: "Leckék",
        geschichte: "Történetek",
        wortspiel: "Szójátékok",
        tippchallenge: PRUEFUNG_WORT_HU,
        klassenmatch: "Osztályverseny",
        "eigene-uebung": EIGENE_UEBUNG_WORT_HU_LEHRKRAFT,
      })[art],
    wackligeTasten: "Bizonytalan billentyűk",
    nochZuWenigGeuebt: "még kevés a gyakorlás",
    zuWenigUmZuSagen: "Még kevés a gyakorlás ahhoz, hogy ezt meg lehessen ítélni.",
    wackligCaption: (name: string) => ["Bizonytalan billentyűk: ", name],
    tasteKopf: "Billentyű",
    tasteHilfe: (prozent: number) =>
      `Még bizonytalan billentyű - legalább ${WACKLIG_MIND_ANSCHLAEGE} próbálkozás, a helyes leütések aránya ${prozentText(prozent, "hu")} alatt.`,
    trefferKopf: "Pontosság",
    trefferHilfe: "A helyes leütések aránya ennél a billentyűnél.",
    tempoKopf: "Sebesség",
    tempoHilfe: "Milyen gyorsan ment ez a billentyű az utóbbi időben - ennek a billentyűnek a leütései percenként.",
    abzeichen: (n: number) => ["Jelvények - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_HU} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_HU,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_HU}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Beállítások: ",
      name,
      " - ",
      label,
      " ·",
      " ",
      zielMin > 0 ? `Heti cél: ${zielMin} perc` : "nincs heti cél",
    ],
    eigenstaendigkeit: (n: number) => ["Önálló munka - jelzések:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Beállítások és áttekintés - beállítások, gyakorlási idők, bizonytalan billentyűk és jelvények; minden más a tanuló „Fejlődésem” oldalán található. Tanuló: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `Beállítások és áttekintés ${offen ? "bezárása" : "megnyitása"}: ${name}`,
    keinZielGesetzt: "nincs beállított heti cél",
    keineAbgeschlossene: "még nincs lezárt hét heti céllal",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      "Teljesített heti célok: ",
      prozent,
      "%, teljes hetek: ",
      ganz,
      "/",
      gesamt,
      "",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["teljes hetek: ", ganz, "/", gesamt, ""],
    wocheErlassen: "ez a hét el van engedve",
    keineZielwoche: "ezen a héten nincs cél",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " perc"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " perc, cél: ", nenner, " perc"],
    offenSr: (minuten: number) => `, ebből a korábbi hetekből pótlandó: ${minuten} perc`,
    erreichtSr: ", heti cél teljesítve",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " perc pótlandó"],
    klasseNichtGespeichert: "Az osztály beállítását nem sikerült menteni.",
    kinderEingetragen: (n: number) =>
      ` Mentve ${tanulokHu(n)} számára - a Tastenflow program következő megnyitásakor ` +
      `lép érvénybe. A statisztika és a jelvények megmaradnak.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Az osztály kiindulópontja: ${label}. A később csatlakozókra is érvényes.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Az osztály alapbeállítását nem sikerült menteni.${kinderSatz}`,
    gesperrtZusatz: " (zárolva)",
    stufeWaehlen: "Szint kiválasztása",
    vorgabeKlasse: (label: string) => `Az osztály alapbeállítása: ${label}`,
    dieMeisten: (label: string) => `a legtöbben ezen a szinten vannak: ${label}`,
    bezugKlasse: (name: string) => `az osztályban (${name})`,
    startHinweis:
      "amit az osztály már tud - az osztály minden tanulójára érvényes, a később csatlakozókra is",
    startSrHinweis:
      "Az első elem az osztály alapbeállítását és azt a szintet mutatja, amelyen a legtöbben éppen vannak. " +
      "Egy szint kiválasztása az osztály alapbeállításaként menti - ez a később csatlakozókra is érvényes - " +
      "és beállítja a már az osztályban lévő tanulóknak; ha valaki már előrébb tart, a program előbb rákérdez. " +
      "Minden tanulónál a Tastenflow program következő megnyitásakor lép érvénybe; a statisztika és a jelvények megmaradnak.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Évfolyam eltávolítva. Újra az alapbeállítás érvényes (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Évfolyam: Felnőttek. A szövegek most felnőtteknek szólnak (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Évfolyam: ${schulstufeLabelHu(wert)}. A szövegek most az életkorhoz igazodnak ` +
      `(${label}).`,
    spracheDerKlasse: (sprache: string) => `Az osztály nyelve: ${sprache}.`,
    spracheGesperrt: "A nyelv az osztály tanulói számára zárolva van.",
    spracheFrei: "A nyelv újra szabadon választható.",
    matchNichtUmgestellt: "Az Osztályversenyt nem sikerült átállítani.",
    matchErlaubt: "Az Osztályverseny ebben az osztályban engedélyezve van.",
    matchAus: "Az Osztályverseny ebben az osztályban ki van kapcsolva.",
    zeilenEndeAn:
      "Minden sor végén most az Enter billentyűt kell megnyomni - az osztály minden tanulójának.",
    zeilenEndeAus: "A „Sor vége az Enter billentyűvel” ebben az osztályban ki van kapcsolva.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `Az osztály tanéve mostantól a hónap első napján kezdődik: ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Helyesírás: ${label} - az osztály minden tanulójának.`,
    schreibweiseAutoLabel: "automatikus",
    schreibweiseGbLabel: "brit",
    schreibweiseUsLabel: "amerikai",
    startFrageTitel: "Kiindulópont az egész osztálynak",
    frageVor: (_n: number) => ["A kiválasztott szintnél előrébb tart", ":", " "],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "hu", { one: () => "tanuló", other: () => "tanuló" }),
    ],
    frageNach: (_n: number) => [
      ".",
      " Biztosan erre a szintre állítja az egész osztályt?",
    ],
    detailVor: "Kiválasztva: ",
    detailNach: (namen: string) => [
      ". Már előrébb tart:",
      " ",
      namen,
      ". A visszaléptetés elvesz olyan tananyagot, amelyet a tanuló már elsajátított - a leütésstatisztika, a gyakorlási idő és a jelvények minden esetben megmaradnak. Minden tanulónál a Tastenflow program következő megnyitásakor lép érvénybe.",
    ],
    alleEinstufen: "Beállítás mindenkinek",
    nurNochNicht: "Csak akik még nem tartanak itt",
    startZurueck: (name: string, label: string) =>
      `Visszaléptetve erre a szintre: ${label}. Tanuló: ${name}. A Tastenflow program következő megnyitásakor lép érvénybe. ` +
      `A statisztika és a jelvények megmaradnak.`,
    startpunktVon: (name: string, label: string) => `Kiindulópont - ${name}: ${label}.`,
    wochenzielNichtGespeichert: (name: string) =>
      `A heti célt nem sikerült menteni. Tanuló: ${name}.`,
    wochenzielGespeichert: (name: string) => `Heti cél mentve: ${name}.`,
    ueberfaelligFrage: (name: string) =>
      `Nullázza a heti cél pótlandó perceit? Tanuló: ${name}.\n\n` +
      `Az eddig összegyűlt pótlandó percek törlődnek; ettől a héttől a heti cél ` +
      `újra nulláról indul. A már gyakorolt idő és a statisztika megmarad.`,
    ueberfaelligErledigt: (name: string) => `Pótlandó percek nullázva: ${name}.`,
    erlasseneGespeichert: "Az elengedett hetek mentve.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Heti cél (${minutenHu(minuten)})` : "Nincs heti cél"} - mentve: ${ok}/${gesamt}; érvényes ettől: ` +
      `${naechsterMontagHu(jetztMs)}, 8:00.`,
    klassenZielFehler: (namen: string) =>
      ` Nem sikerült ezeknél: ${namen} - próbálja újra.`,
    sperreNichtAufgehoben: "A célt nem sikerült visszaállítani.",
    sperreAufgehoben:
      "A cél visszaállítva - a gyakorlási idő mostantól újra beleszámít a heti célba.",
    stundeNichtGesperrt: "A célt nem sikerült egy órára szüneteltetni.",
    gesperrtBisStatus: (zeit: string) =>
      `Az osztály heti célja szünetel eddig: ${zeit} - ` +
      `a gyakorlási idő és a statisztika tovább számít, csak a heti cél szünetel.`,
    stundeGesperrt: "A cél egy órára szünetel.",
    excelLaeuft: "Az Excel-fájl készül - egy pillanat.",
    excelFertig: (datei: string) =>
      `Letöltve: ${datei} - áttekintéssel és jelmagyarázattal, valamint négy munkalappal: tanév, kezdettől, hónap és hét.`,
    excelFehler:
      "Az Excel-fájlt nem sikerült létrehozni. Próbálja újra; " +
      "ha ez ismétlődik, jelentse be.",
    laedt: "Betöltés...",
    lesefehlerStark: "Az állapotot nem sikerült betölteni",
    lesefehlerFuer: (namen: string) => [
      " ezeknél a tanulóknál:",
      " ",
      namen,
      ". Ezért a számok ezekben a sorokban üresek, és ",
    ],
    lesefehlerNicht: "nem",
    lesefehlerSchluss:
      " azt jelentik, hogy nem volt gyakorlás. Töltse be újra az oldalt; ha ez ismétlődik, jelentse be.",
    aufgabenGruppe: "Feladatok az osztálynak",
    tippchallengeTipp:
      "Megnyitja a Kihívást az egész osztálynak: szöveg és idő kiválasztása - utána itt láthatók az eredmények is.",
    tippchallenge: PRUEFUNG_WORT_HU,
    eigeneUebungTipp:
      "Egy feltöltött fájlt rendel az osztályhoz gyakorlandó szövegként - minden tanuló a saját ütemében gyakorolja; új billentyűket ez nem old fel.",
    eigeneUebung: EIGENE_UEBUNG_WORT_HU_LEHRKRAFT,
    wochenzielTipp:
      "Beállítja, hány percet gyakoroljon az osztály hetente - minden tanulónak külön vagy mindenkinek egyszerre.",
    zielStatusMin: (minuten: string) => `${minuten} perc`,
    zielGesetzt: "beállítva",
    keinZiel: "nincs cél",
    einstellungenTipp:
      "Az egész osztályra vonatkozó beállítások: évfolyam, nyelv, kiindulópont és Osztályverseny.",
    einstellungenDerKlasse: "Az osztály beállításai",
    sperreBeendenTipp:
      "Azonnal visszaállítja a célt - utána a gyakorlási idő újra beleszámít a heti célba.",
    sperrenTipp:
      "Az egész osztálynak 60 percre szünetelteti a heti célt. A gyakorlás folytatható - a gyakorlási idő és a statisztika tovább számít, csak a heti cél szünetel.",
    gesperrtBisKnopf: (zeit: string) => `Szünetel eddig: ${zeit} - visszaállítás`,
    stundeSperren: "Szünet 1 órára",
    wochenzielAufgabe: "Heti cél - feladat",
    zielFuerKlasseGesetzt: "· beállítva az osztály tanulóinak",
    nochKeinZielGesetzt: "· még nincs beállított cél",
    minutenZuerst: "Előbb adja meg a heti perceket (0-600 perc).",
    klassenZielTipp:
      "A jövő héttől beállítja ezt a heti célt az osztály minden tanulójának - a később csatlakozóknak is. Az egyénileg beállított célok felülíródnak.",
    fuerKlasseUebernehmen: "Beállítás az osztálynak",
    wochenzielFuerKlasse: (bezeichnung: string) => `Heti cél: ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Letöltés Excel-fájlként: a táblázatot ${datei} nevű Excel-fájlként tölti le - ` +
      `elöl áttekintéssel és jelmagyarázattal, ` +
      `utána négy munkalappal: az aktuális tanév, kezdettől, a hónap (az utolsó ` +
      `4 hét) és ez a hét, függetlenül az itt kiválasztott időszaktól.`,
    alsExcel: "Letöltés Excel-fájlként",
    schulstufeKind: "Évfolyam",
    schulstufeKindName: (name: string) => `Évfolyam: ${name}`,
    wieDieKlasse: (klasse: string) => `mint az osztály (${klasse})`,
    schulstufeKindTipp:
      "Csak ennek a tanulónak: az évfolyam határozza meg a szövegeket, és az osztály beállítása helyett érvényes. Minden tanévvel magától növekszik. A „mint az osztály” választás visszavonja ezt a kivételt.",
    schulstufeKindGesetzt: (name: string, stufe: string) => `A szövegek most ehhez az évfolyamhoz igazodnak: ${stufe}. Tanuló: ${name}.`,
    schulstufeKindErwachsen: (name: string) => `A szövegek most felnőtteknek szólnak. Tanuló: ${name}.`,
    schulstufeKindWieKlasse: (name: string) => `A szövegek most újra az osztályhoz igazodnak. Tanuló: ${name}.`,
  },
  nl: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Het nieuwe doel van ${minutenNl(Math.round(minuten))} per week geldt vanaf ${naechsterMontagNl(jetztMs)} om 8.00 uur. ` +
      `Tot dan geldt het huidige doel.`,
    keinZielMehr: (jetztMs: number) =>
      `Vanaf ${naechsterMontagNl(jetztMs)} om 8.00 uur geldt er geen weekdoel meer. ` +
      `Tot dan geldt het huidige doel.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `De enige leerling van deze klas krijgt ${minutenNl(minuten)} per week.`
            : "De enige leerling van deze klas krijgt geen weekdoel meer."
          : minuten > 0
            ? `Alle ${anzahlKinder} leerlingen krijgen ${minutenNl(minuten)} per week.`
            : `Alle ${anzahlKinder} leerlingen krijgen geen weekdoel meer.`;
      return (
        `${satz} Dit geldt vanaf ${naechsterMontagNl(jetztMs)} om 8.00 uur - tot dan ` +
        `geldt het huidige doel. Apart ingestelde doelen worden overschreven. ` +
        (minuten > 0
          ? "Wie later bijkomt, krijgt dit doel ook."
          : "Wie later bijkomt, krijgt ook geen doel.")
      );
    },
    wochenziel: "Weekdoel",
    minutenProWoche: "Minuten per week",
    nullKeinZiel: "0 = geen weekdoel.",
    zielKalenderwochen: "Weken met een weekdoel",
    speichernTipp: (name: string) =>
      `Slaat minuten, weken met een weekdoel en inhalen samen op voor ${name} - pas na een bevestiging. De wijziging geldt vanaf volgende week.`,
    nichtsGeaendert: "Aan het weekdoel is niets gewijzigd - het is al opgeslagen.",
    speichern: "Opslaan",
    nachholenTipp:
      "Minuten die extra zijn geoefend, vullen openstaande weekdoelen van eerdere weken aan - de oudste eerst.",
    nachholen: "Gemiste minuten van vorige weken inhalen",
    dieseWoche: "Deze week:",
    min: "min",
    keinWochenziel: "geen weekdoel",
    anstehend: (datum: string, minuten: number) => [" - vanaf maandag ", datum, ": ", minuten, " min"],
    ueberfaelligTipp:
      "Zet de achterstand van eerdere weken op nul - vanaf deze week telt het weekdoel opnieuw. De geoefende tijd blijft bewaard.",
    ueberfaelligZuruecksetzen: "Achterstallige minuten wissen",
    zuletztZurueckgesetzt: (ab: string) => ["laatst gewist vanaf ", ab],
    erlassenTipp:
      "De gekozen weken tellen nooit als gemist of als in te halen - ook niet als ze zijn aangevinkt als week met een weekdoel. De geoefende tijd blijft bewaard.",
    wochenzielErlassen: "Vrijstellen van het weekdoel",
    wochenzielFuer: (name: string) => `Weekdoel voor ${name}`,
    uebernehmen: "Toepassen",
    abbrechen: "Annuleren",
    einstellungen: "Instellingen",
    womitAnfangen: "Waar beginnen?",
    womitTipp:
      "wat deze leerling al kan - een lager niveau zet de leerling terug (na een bevestiging); de statistiek en de medailles blijven bewaard.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `${name} staat bij "${label}".\n\n` +
      `Echt terugzetten naar "${ziel}"?\n\n` +
      `Daarna wordt er weer tot daar geoefend. De statistiek van de aanslagen, ` +
      `de oefentijd en de medailles blijven bewaard - bij een latere verhoging ` +
      `staan ze er nog onveranderd.\n\n` +
      `Dit geldt zodra ${name} Tastenflow de volgende keer opent.`,
    womitName: (name: string) => `Waar ${name} begint`,
    ausstehend: (name: string) => ["Dit geldt zodra ", name, " Tastenflow de volgende keer opent."],
    einhandTipp:
      "Hoofdletters en speciale tekens worden aanvaard met elke Shift-toets (of met de toets Caps Lock) - de regel Shift met de andere hand staat voor deze leerling uit.",
    einhandName: (name: string) => `Met één hand typen voor ${name}: de regel Shift met de andere hand staat uit`,
    einhand: "Met één hand typen",
    tempoTipp:
      "Voor deze leerling telt de snelheid nergens - geen tijdslimiet in het spel, geen snelheidsdoel bij de sterren, geen stijging of daling van het moeilijkheidsniveau, en de oefentijd loopt ook door bij lange pauzes. Voor wie zorgvuldig maar heel langzaam typt.",
    tempoName: (name: string) => `Snelheid telt niet voor ${name}: snelheid wordt nergens beoordeeld`,
    tempoZaehltNicht: "Snelheid telt niet",
    abstand: "Brede letterafstand (CVI)",
    abstandTipp: `Meer ruimte tussen ELK teken bij het overtypen - voor leerlingen met CVI (cerebrale visuele inperking), bij wie tekens die dicht op elkaar staan in elkaar overlopen. "Twee keer" neemt de dubbele, "drie keer" de driedubbele en "vier keer" de vierdubbele breedte per teken. Tijdens het typen wordt alles donkerder behalve het veld waarin wordt getypt (de oefenregel of het speelveld); na 5 seconden zonder typen wordt alles weer licht. De oefenregel glijdt daarbij op de typsnelheid van de leerling naar het volgende teken - langzaam bij langzaam typen - in plaats van te springen. "Normaal" laat de tekens op de gewone afstand staan en schakelt alleen het donkerder maken, het glijden van de regel en de leesstrook in. De leerling kan de afstand ook zelf wijzigen in de eigen instellingen (tandwiel, Alt + O), zo vaak als nodig - en jij kunt dat hier altijd weer doen. Wat het laatst is gekozen, geldt.`,
    abstandName: (name: string) => `Brede letterafstand (CVI) voor ${name}`,
    listenTitel: "Leerlingen van de klas met voortgang en weekdoel",
    tastenSr: (sitzen: number, frei: number) => [
      "Zeker: ",
      sitzen,
      " van ",
      frei,
      " vrijgespeelde toetsen",
    ],
    bezugBlock: (datum: string) => `de 4 oefenweken vanaf ${datum}`,
    bezugWoche: (datum: string) => `de week van ${datum}`,
    gruppePerson: "Leerling",
    gruppeStand: "Voortgang en oefentijd",
    gruppeUeben: "Oefenen",
    gruppePruefung: PRUEFUNG_WORT_NL,
    kopfName: "Naam",
    kopfStufe: "Moeilijkheidsniveau",
    kopfTasten: "Toetsen",
    kopfNaechste: "Volgende toetsen",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "alle toetsen geleerd" : `volgende: ${namen.join(", dan ")}`,
    kopfUebezeit: "Oefentijd",
    kopfWochenziel: "Weekdoel",
    kopfWochenziele: "Weekdoelen",
    kopfTreffer: "Nauwkeurigheid",
    kopfTempo: "Aanslagen/min",
    kopfScore: "Score",
    uebungszeiten: "Oefentijden",
    nochKeineUebung: "nog geen oefening vastgelegd",
    uebungszeitenKennzahl: (dauer: string, wochen: number) =>
      `${dauer} - ${mehrzahl(wochen, "nl", { one: (z) => `${z} week`, other: (z) => `${z} weken` })}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - op ",
      mehrzahl(tage, "nl", { one: (z) => `${z} dag`, other: (z) => `${z} dagen` }),
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt} van ${ziel} min`,
    periodeMatches: (n: number) =>
      ` - ${mehrzahl(n, "nl", { one: (z) => `${z} klassenwedstrijd`, other: (z) => `${z} klassenwedstrijden` })}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Heeft nog geen klassenwedstrijd tot het einde gespeeld"
        : `Heeft ${mehrzahl(n, "nl", {
            one: (z) => `${z} klassenwedstrijd`,
            other: (z) => `${z} klassenwedstrijden`,
          })} tot het einde gespeeld`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Telt elke klassenwedstrijd in deze klas die ${name} tot het einde heeft meegespeeld - sinds ${seit}; ` +
      `daarvoor werden klassenwedstrijden niet vastgelegd. Afgebroken wedstrijden en wedstrijden die iemand ` +
      `vroegtijdig heeft verlaten, tellen niet. Een wedstrijd telt ongeveer een uur na het einde mee. ` +
      `Alleen het aantal: geen stand, en wie heeft gewonnen, wordt niet geteld.`,
    kopfKlassenmatch: "Klassenwedstrijd",
    klassenmatchOhneZahl: "Klassenwedstrijd: geen gegevens",
    gruppeKlassenmatch: "Klassenwedstrijd",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Hoeveel klassenwedstrijden de leerling tot het einde heeft meegespeeld. Afgebroken wedstrijden en ` +
      `wedstrijden die iemand vroegtijdig heeft verlaten, tellen niet; wie heeft gewonnen, wordt niet geteld. ` +
      `Vastgelegd sinds ${seit}. Het teken "-" betekent: de klassenwedstrijd staat uit voor deze klas, ` +
      `of het aantal kon niet worden geladen.`,
    wocheHilfe: (pauseMin: number) =>
      `Na het openen zie je elke oefentijd van deze week: de dag, de begin- en eindtijd, ` +
      `de geoefende tijd en wat er is geoefend. Geoefende tijd is zuivere typtijd - pauzes ` +
      `tellen niet, daarom is die vaak korter dan van begin tot eind. Na meer dan ${pauseMin} ` +
      `minuten zonder typen begint een nieuwe oefentijd.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Mijn training",
        lektion: "Lessen",
        geschichte: "Verhalen",
        wortspiel: "Woordspelletjes",
        tippchallenge: PRUEFUNG_WORT_NL,
        klassenmatch: "Klassenwedstrijd",
        "eigene-uebung": EIGENE_UEBUNG_WORT_LEHRKRAFT_NL,
      })[art],
    wackligeTasten: "Onzekere toetsen",
    nochZuWenigGeuebt: "nog te weinig geoefend",
    zuWenigUmZuSagen: "Nog te weinig geoefend om dat te zeggen.",
    wackligCaption: (name: string) => ["Onzekere toetsen van ", name],
    tasteKopf: "Toets",
    tasteHilfe: (prozent: number) =>
      `Een toets die nog niet zeker is - minstens ${WACKLIG_MIND_ANSCHLAEGE} keer aan de beurt geweest, nauwkeurigheid lager dan ${prozentText(prozent, "nl")}.`,
    trefferKopf: "Nauwkeurigheid",
    trefferHilfe: "Hoe vaak deze toets tot nu toe goed is getypt.",
    tempoKopf: "Snelheid",
    tempoHilfe: "Hoe snel deze ene toets de laatste tijd kwam - aanslagen van deze toets per minuut.",
    abzeichen: (n: number) => ["Medailles - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_NL} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_NL,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_NL} van ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Instellingen voor ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Weekdoel ${zielMin} min` : "geen weekdoel",
    ],
    eigenstaendigkeit: (n: number) => ["Zelfstandig werk - aanwijzingen:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Instellingen en resultaten van ${name} - instellingen, oefentijden, onzekere toetsen en medailles; al het andere staat in "Mijn voortgang" van ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `Instellingen en resultaten van ${name} ${offen ? "sluiten" : "openen"}`,
    keinZielGesetzt: "geen weekdoel ingesteld",
    keineAbgeschlossene: "nog geen afgeronde week met een weekdoel",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      prozent,
      "% van de weekdoelen gehaald, helemaal in ",
      ganz,
      " van ",
      gesamt,
      " weken",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["helemaal: ", ganz, "/", gesamt, " weken"],
    wocheErlassen: "deze week is vrijgesteld",
    keineZielwoche: "geen week met een weekdoel",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " van ", nenner, " minuten"],
    offenSr: (minuten: number) => `, waarvan ${minutenNl(minuten)} in te halen uit vorige weken`,
    erreichtSr: ", weekdoel gehaald",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min in te halen"],
    klasseNichtGespeichert: "De instelling van de klas kon niet worden opgeslagen.",
    kinderEingetragen: (n: number) =>
      ` Ingesteld voor ${leerlingenNl(n)} - dit geldt zodra Tastenflow de volgende keer wordt geopend. ` +
      `De statistiek en de medailles blijven bewaard.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Startpunt "${label}" geldt nu voor de klas - ook voor wie later bijkomt.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `De instelling van de klas kon niet worden opgeslagen.${kinderSatz}`,
    gesperrtZusatz: " (vastgezet)",
    stufeWaehlen: "Startpunt kiezen",
    vorgabeKlasse: (label: string) => `Instelling van de klas: "${label}"`,
    dieMeisten: (label: string) => `de meesten staan bij "${label}"`,
    bezugKlasse: (name: string) => `klas ${name}`,
    startHinweis:
      "wat de klas al kan - geldt voor alle leerlingen van deze klas, ook voor wie later bijkomt.",
    startSrHinweis:
      "De eerste keuze noemt de instelling van de klas en het niveau waarop de meeste leerlingen nu staan. " +
      "Wie een niveau kiest, slaat het op als instelling van de klas - het geldt ook voor wie later bijkomt - " +
      "en stelt het in voor de leerlingen die er al zijn; zijn sommigen al verder, dan vraagt het programma het eerst. " +
      "Dit geldt zodra een leerling Tastenflow de volgende keer opent; de statistiek en de medailles blijven bewaard.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Leerjaar verwijderd. De standaardinstelling geldt weer: ${vorgabe}.`,
    schulstufeErwachsen: (label: string) =>
      `Leerjaar: volwassenen. De teksten passen nu bij volwassenen (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Leerjaar: ${schulstufeLabelNl(wert)}. De teksten passen nu bij deze leeftijd ` +
      `(${label}).`,
    spracheDerKlasse: (sprache: string) => `Taal van de klas: ${sprache}.`,
    spracheGesperrt: "De taal ligt vast voor de leerlingen van deze klas.",
    spracheFrei: "De taal is weer vrij te kiezen.",
    matchNichtUmgestellt: "De klassenwedstrijd kon niet worden omgeschakeld.",
    matchErlaubt: "De klassenwedstrijd is toegestaan in deze klas.",
    matchAus: "De klassenwedstrijd staat uit voor deze klas.",
    zeilenEndeAn:
      "Elke regel wordt nu afgesloten met Enter - voor alle leerlingen van deze klas.",
    zeilenEndeAus: "Regel afsluiten met Enter staat uit voor deze klas.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `Het schooljaar van deze klas begint nu op 1 ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Spelling: ${label} - voor alle leerlingen van deze klas.`,
    schreibweiseAutoLabel: "automatisch",
    schreibweiseGbLabel: "Brits",
    schreibweiseUsLabel: "Amerikaans",
    startFrageTitel: "Startpunt voor de hele klas",
    frageVor: (n: number) => [
      "In je klas ",
      mehrzahl(n, "nl", { one: () => "is", other: () => "zijn" }),
      " ",
    ],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "nl", { one: () => "leerling", other: () => "leerlingen" }),
    ],
    frageNach: (_n: number) => [
      " ",
      "al verder dan het gekozen niveau. Wil je de hele klas echt op dit startpunt zetten?",
    ],
    detailVor: "Gekozen: ",
    detailNach: (namen: string) => [
      ". Al verder:",
      " ",
      namen,
      ". Een leerling terugzetten neemt oefenstof weg die er al is - de statistiek van de aanslagen, de oefentijd en de medailles blijven altijd bewaard. Dit geldt zodra een leerling Tastenflow de volgende keer opent.",
    ],
    alleEinstufen: "Iedereen instellen",
    nurNochNicht: "Alleen wie nog niet zo ver is",
    startZurueck: (name: string, label: string) =>
      `${name} wordt teruggezet naar "${label}" - dit geldt bij de volgende keer openen. ` +
      `De statistiek en de medailles blijven bewaard.`,
    startpunktVon: (name: string, label: string) => `Startpunt van ${name}: "${label}".`,
    wochenzielNichtGespeichert: (name: string) =>
      `Het weekdoel van ${name} kon niet worden opgeslagen.`,
    wochenzielGespeichert: (name: string) => `Weekdoel van ${name} opgeslagen.`,
    ueberfaelligFrage: (name: string) =>
      `Achterstallige minuten van ${name} wissen?\n\n` +
      `De achterstand tot nu toe wordt geschrapt; vanaf deze week telt het weekdoel ` +
      `opnieuw. De al geoefende tijd en de statistiek blijven bewaard.`,
    ueberfaelligErledigt: (name: string) => `Achterstallige minuten van ${name} gewist.`,
    erlasseneGespeichert: "Vrijgestelde weken opgeslagen.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Weekdoel (${minutenNl(minuten)})` : "Geen weekdoel meer"} opgeslagen voor ${ok} van ` +
      `${leerlingenNl(gesamt)} - geldt vanaf ${naechsterMontagNl(jetztMs)} om 8.00 uur.`,
    klassenZielFehler: (namen: string) =>
      ` Bij ${namen} is het niet gelukt - probeer het nog eens.`,
    sperreNichtAufgehoben: "Het weekdoel kon niet worden hervat.",
    sperreAufgehoben:
      "Het weekdoel is hervat - geoefende tijd telt vanaf nu weer mee voor het weekdoel.",
    stundeNichtGesperrt: "Het weekdoel kon niet 1 uur worden gepauzeerd.",
    gesperrtBisStatus: (zeit: string) =>
      `Weekdoel van de klas gepauzeerd tot ${zeit} - ` +
      `oefentijd en statistiek tellen door, alleen het weekdoel niet.`,
    stundeGesperrt: "Het weekdoel is 1 uur gepauzeerd.",
    excelLaeuft: "Het Excel-bestand wordt gemaakt - een ogenblik.",
    excelFertig: (datei: string) =>
      `"${datei}" gedownload - met een overzicht en legenda en vier werkbladen: Schooljaar, Vanaf het begin, Maand en Week.`,
    excelFehler:
      "Het Excel-bestand kon niet worden gemaakt. Probeer het nog eens; " +
      "blijft het zo, meld het dan.",
    laedt: "Laden...",
    lesefehlerStark: "De voortgang kon niet worden gelezen",
    lesefehlerFuer: (namen: string) => [
      " voor",
      " ",
      namen,
      ". De getallen bij deze leerlingen zijn daarom leeg en betekenen ",
    ],
    lesefehlerNicht: "niet",
    lesefehlerSchluss:
      " dat er niet is geoefend. Laad de pagina opnieuw; blijft het zo, meld het dan.",
    aufgabenGruppe: "Opdrachten voor de klas",
    tippchallengeTipp:
      "Opent de Uitdaging voor de hele klas: kies de tekst en de duur - daarna staan de resultaten ook hier.",
    tippchallenge: PRUEFUNG_WORT_NL,
    eigeneUebungTipp:
      "Geeft de klas een geüpload bestand als verplichte tekst - elke leerling oefent op de eigen snelheid; er worden geen nieuwe toetsen vrijgespeeld.",
    eigeneUebung: EIGENE_UEBUNG_WORT_LEHRKRAFT_NL,
    wochenzielTipp:
      "Stelt in hoeveel minuten de klas per week oefent - per leerling of voor iedereen tegelijk.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "ingesteld",
    keinZiel: "geen doel",
    einstellungenTipp:
      "Stel voor de hele klas in: leerjaar, taal, startpunt en klassenwedstrijd.",
    einstellungenDerKlasse: "Klasinstellingen",
    sperreBeendenTipp:
      "Hervat het weekdoel meteen - daarna telt geoefende tijd weer mee voor het weekdoel.",
    sperrenTipp:
      "Pauzeert het weekdoel 60 minuten voor de hele klas. Er wordt gewoon geoefend - oefentijd en statistiek tellen door, alleen het weekdoel niet.",
    gesperrtBisKnopf: (zeit: string) => `Gepauzeerd tot ${zeit} - weekdoel hervatten`,
    stundeSperren: "1 uur pauzeren",
    wochenzielAufgabe: "Weekdoel - opdracht",
    zielFuerKlasseGesetzt: "- ingesteld voor leerlingen van deze klas",
    nochKeinZielGesetzt: "- nog geen doel ingesteld",
    minutenZuerst: "Vul eerst de minuten per week in - 0 tot 600.",
    klassenZielTipp:
      "Stelt dit weekdoel vanaf volgende week in voor elke leerling van deze klas - ook voor wie later bijkomt. Apart ingestelde doelen worden overschreven.",
    fuerKlasseUebernehmen: "Toepassen op de hele klas",
    wochenzielFuerKlasse: (bezeichnung: string) => `Weekdoel voor ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Downloaden als Excel: downloadt de tabel als Excel-bestand ` +
      `"${datei}" - eerst een overzicht met legenda, ` +
      `daarna vier werkbladen: het lopende schooljaar, vanaf het begin, de maand (de laatste ` +
      `4 weken) en deze week, ongeacht welke periode hier is gekozen.`,
    alsExcel: "Downloaden als Excel",
    schulstufeKind: "Leerjaar",
    schulstufeKindName: (name: string) => `Leerjaar van ${name}`,
    wieDieKlasse: (klasse: string) => `zoals de klas (${klasse})`,
    schulstufeKindTipp:
      "Alleen voor deze leerling: het leerjaar bepaalt welke teksten de leerling krijgt en geldt in plaats van het leerjaar van de klas. Het groeit elk schooljaar mee. \"Zoals de klas\" maakt de uitzondering weer ongedaan.",
    schulstufeKindGesetzt: (name: string, stufe: string) =>
      `${name} krijgt nu teksten voor ${stufe}.`,
    schulstufeKindErwachsen: (name: string) => `${name} krijgt nu teksten voor volwassenen.`,
    schulstufeKindWieKlasse: (name: string) => `${name} krijgt weer de teksten van de klas.`,
  },
  pt: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `O novo objetivo (${minutenPt(Math.round(minuten))} por semana) aplica-se a partir de ${naechsterMontagPt(jetztMs)}, às 08:00. ` +
      `Até lá, mantém-se o objetivo atual.`,
    keinZielMehr: (jetztMs: number) =>
      `A partir de ${naechsterMontagPt(jetztMs)}, às 08:00, deixa de haver objetivo semanal. ` +
      `Até lá, mantém-se o objetivo atual.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `A única pessoa desta turma recebe o objetivo: ${minutenPt(minuten)} por semana.`
            : "A única pessoa desta turma deixa de ter objetivo semanal."
          : minuten > 0
            ? `As ${anzahlKinder} pessoas desta turma recebem o objetivo: ${minutenPt(minuten)} por semana.`
            : `As ${anzahlKinder} pessoas desta turma deixam de ter objetivo semanal.`;
      return (
        `${satz} Aplica-se a partir de ${naechsterMontagPt(jetztMs)}, às 08:00 - até lá, ` +
        `mantém-se o objetivo atual. Os objetivos definidos individualmente são substituídos. ` +
        (minuten > 0
          ? "Quem entrar mais tarde também recebe este objetivo."
          : "Quem entrar mais tarde também fica sem objetivo.")
      );
    },
    wochenziel: "Objetivo semanal",
    minutenProWoche: "Minutos por semana",
    nullKeinZiel: "0 = sem objetivo semanal.",
    zielKalenderwochen: "Semanas com objetivo",
    speichernTipp: (name: string) =>
      `Guarda em conjunto os minutos, as semanas com objetivo e a recuperação - só depois de confirmar. Pessoa: ${name}. A alteração aplica-se a partir da próxima semana.`,
    nichtsGeaendert: "O objetivo semanal não mudou - já está guardado.",
    speichern: "Guardar",
    nachholenTipp:
      "Os minutos a mais preenchem os objetivos por cumprir das semanas anteriores - primeiro o mais antigo.",
    nachholen: "Recuperar os minutos das semanas anteriores",
    dieseWoche: "Esta semana:",
    min: "min",
    keinWochenziel: "sem objetivo semanal",
    anstehend: (datum: string, minuten: number) => [" - a partir de segunda-feira, ", datum, ": ", minuten, " min"],
    ueberfaelligTipp:
      "Repõe a zero os minutos em atraso das semanas anteriores - a partir desta semana, o objetivo semanal volta a contar do zero. O tempo praticado mantém-se.",
    ueberfaelligZuruecksetzen: "Repor a zero os minutos em atraso",
    zuletztZurueckgesetzt: (ab: string) => ["última reposição a zero: ", ab],
    erlassenTipp:
      "As semanas escolhidas nunca contam como não cumpridas nem como minutos a recuperar - quer estejam ou não marcadas como semanas com objetivo. O tempo praticado mantém-se.",
    wochenzielErlassen: "Dispensar semanas",
    wochenzielFuer: (name: string) => `Objetivo semanal: ${name}`,
    uebernehmen: "Aplicar",
    abbrechen: "Cancelar",
    einstellungen: "Definições",
    womitAnfangen: "Por onde começar?",
    womitTipp:
      "o que esta pessoa já sabe - escolher um nível mais baixo faz voltar atrás (só depois de confirmar); as estatísticas e as medalhas mantêm-se.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `Pessoa: ${name}. Nível atual: ${label}.\n\n` +
      `Quer mesmo voltar ao nível: ${ziel}?\n\n` +
      `Os exercícios passam a ir só até esse ponto. As estatísticas de toques, ` +
      `o tempo de prática e as medalhas mantêm-se - se o nível voltar a subir mais tarde, ` +
      `estará tudo na mesma.\n\n` +
      `Aplica-se quando esta pessoa voltar a abrir o Tastenflow.`,
    womitName: (name: string) => `Por onde começar: ${name}`,
    ausstehend: (name: string) => ["Aplica-se da próxima vez que o Tastenflow for aberto (", name, ")."],
    einhandTipp:
      "As maiúsculas e os símbolos são aceites com qualquer tecla Shift (ou com a tecla Caps Lock) - a regra do Shift com a outra mão está desligada para esta pessoa.",
    einhandName: (name: string) => `Escrever com uma mão: ${name} - regra do Shift com a outra mão desligada`,
    einhand: "Escrever com uma mão",
    tempoTipp:
      "Para esta pessoa, a velocidade não conta em lado nenhum - sem limite de tempo no jogo, sem meta de velocidade nas estrelas, sem subir nem descer de nível de dificuldade, e o tempo de prática continua a contar mesmo em pausas longas. Para quem escreve com cuidado, mas muito devagar.",
    tempoName: (name: string) => `Com calma: ${name} - a velocidade não é avaliada em lado nenhum`,
    tempoZaehltNicht: "Com calma",
    abstand: "Espaçamento largo (CVI)",
    abstandTipp: `Mais espaço entre CADA caráter ao copiar o texto - para pessoas com deficiência visual cerebral (CVI), para quem os carateres muito juntos se confundem. "Duplo" dá a cada caráter o dobro da largura, "triplo" o triplo e "quádruplo" o quádruplo. Durante a escrita, tudo escurece exceto o campo em que se está a escrever (a linha de exercício ou a área de jogo); após 5 segundos sem escrever, volta a ficar claro. A linha de exercício desliza para o caráter seguinte ao ritmo de escrita da pessoa - devagar, se escrever devagar - em vez de saltar. "Simples" mantém os carateres no espaçamento habitual e liga apenas o escurecimento, o deslizar da linha e a linha de leitura. A pessoa também pode mudar o espaçamento nas suas próprias definições (roda dentada, Alt + O), as vezes que quiser - e aqui pode voltar a mudá-lo em qualquer altura. Aplica-se o que tiver sido escolhido por último.`,
    abstandName: (name: string) => `Espaçamento largo (CVI): ${name}`,
    listenTitel: "Estudantes da turma com nível de dificuldade e objetivo semanal",
    tastenSr: (sitzen: number, frei: number) => [
      "Teclas dominadas: ",
      sitzen,
      ", teclas desbloqueadas: ",
      frei,
      "",
    ],
    bezugBlock: (datum: string) => `as 4 semanas de prática a partir de ${datum}`,
    bezugWoche: (datum: string) => `a semana de ${datum}`,
    gruppePerson: "Pessoa",
    gruppeStand: "Progressos e tempo de prática",
    gruppeUeben: "Prática",
    gruppePruefung: PRUEFUNG_WORT_PT,
    kopfName: "Nome",
    kopfStufe: "Nível de dificuldade",
    kopfTasten: "Teclas",
    kopfNaechste: "Próximas teclas",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "todas as teclas aprendidas" : `a seguir ${namen.join(", depois ")}`,
    kopfUebezeit: "Tempo de prática",
    kopfWochenziel: "Objetivo semanal",
    kopfWochenziele: "Objetivos semanais",
    kopfTreffer: "Precisão",
    kopfTempo: "Toques/min",
    kopfScore: "Pontuação",
    uebungszeiten: "Períodos de prática",
    nochKeineUebung: "ainda sem prática registada",
    uebungszeitenKennzahl: (dauer: string, wochen: number) => `${dauer} - semanas: ${wochen}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - dias: ",
      tage,
      "",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt} de ${ziel} min`,
    periodeMatches: (n: number) => ` - Corridas da turma: ${n}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Ainda nenhuma Corrida da turma jogada até ao fim"
        : `Corridas da turma jogadas até ao fim: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Conta cada Corrida da turma nesta turma jogada até ao fim - desde ${seit}; ` +
      `antes disso não eram registadas. Pessoa: ${name}. ` +
      `As corridas interrompidas ou abandonadas antes do fim não contam. Uma corrida é contada ` +
      `cerca de uma hora depois de terminar. Só o número: sem classificação, e as vitórias ` +
      `não são contadas.`,
    kopfKlassenmatch: "Corrida da turma",
    klassenmatchOhneZahl: "Corrida da turma: sem dados",
    gruppeKlassenmatch: "Corrida da turma",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Quantas Corridas da turma foram jogadas até ao fim. As interrompidas ou abandonadas antes do fim ` +
      `não contam; as vitórias não são contadas. Registado ` +
      `desde ${seit}. Um hífen significa: a Corrida da turma está desligada nesta turma, ` +
      `ou não foi possível carregar o número.`,
    wocheHilfe: (pauseMin: number) =>
      `Ao abrir, aparece cada período de prática desta semana: o dia, a hora de ` +
      `início e de fim, o tempo praticado e o que foi praticado. O tempo praticado é só o ` +
      `tempo de escrita - as pausas não contam, por isso costuma ser mais curto do que o ` +
      `intervalo indicado. Após mais de ${pauseMin} min sem escrever, começa ` +
      `um novo período de prática.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "O meu treino",
        lektion: "Lições",
        geschichte: "Histórias",
        wortspiel: "Jogos de palavras",
        tippchallenge: PRUEFUNG_WORT_PT,
        klassenmatch: "Corrida da turma",
        "eigene-uebung": EIGENE_UEBUNG_WORT_LEHRKRAFT_PT,
      })[art],
    wackligeTasten: "Teclas em consolidação",
    nochZuWenigGeuebt: "ainda pouca prática",
    zuWenigUmZuSagen: "Ainda há pouca prática para o dizer.",
    wackligCaption: (name: string) => ["Teclas em consolidação: ", name],
    tasteKopf: "Tecla",
    tasteHilfe: (prozent: number) =>
      `Uma tecla ainda em consolidação - pelo menos ${WACKLIG_MIND_ANSCHLAEGE} tentativas, com menos de ${prozentText(prozent, "pt")} de toques certos.`,
    trefferKopf: "Precisão",
    trefferHilfe: "A percentagem de toques certos nesta tecla.",
    tempoKopf: "Velocidade",
    tempoHilfe: "A rapidez desta tecla nos últimos tempos - toques nesta tecla por minuto.",
    abzeichen: (n: number) => ["Medalhas - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_PT} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_PT,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_PT}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Definições: ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Objetivo semanal: ${zielMin} min` : "sem objetivo semanal",
    ],
    eigenstaendigkeit: (n: number) => ["Trabalho autónomo - sinais:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Definições e resultados - definições, períodos de prática, teclas em consolidação e medalhas; tudo o resto está em "Os meus progressos" desta pessoa. Pessoa: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Fechar" : "Abrir"} definições e resultados: ${name}`,
    keinZielGesetzt: "objetivo semanal não definido",
    keineAbgeschlossene: "ainda nenhuma semana com objetivo concluída",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      "Objetivos semanais cumpridos: ",
      prozent,
      "%, semanas completas: ",
      ganz,
      " de ",
      gesamt,
      "",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["semanas completas: ", ganz, " de ", gesamt, ""],
    wocheErlassen: "esta semana foi dispensada",
    keineZielwoche: "não é semana com objetivo",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, " de ", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " min, objetivo: ", nenner, " min"],
    offenSr: (minuten: number) => `, dos quais por recuperar das semanas anteriores: ${minuten} min`,
    erreichtSr: ", objetivo semanal cumprido",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min por recuperar"],
    klasseNichtGespeichert: "Não foi possível guardar a definição da turma.",
    kinderEingetragen: (n: number) =>
      ` Guardado para: ${pessoasPt(n)} - aplica-se da próxima vez que o ` +
      `Tastenflow for aberto. As estatísticas e as medalhas mantêm-se.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Ponto de partida da turma: ${label}. Aplica-se também a quem entrar mais tarde.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Não foi possível guardar a predefinição da turma.${kinderSatz}`,
    gesperrtZusatz: " (bloqueado)",
    stufeWaehlen: "Escolha o nível",
    vorgabeKlasse: (label: string) => `Predefinição da turma: ${label}`,
    dieMeisten: (label: string) => `a maioria está no nível: ${label}`,
    bezugKlasse: (name: string) => `da turma ${name}`,
    startHinweis:
      "o que a turma já sabe - aplica-se a toda a turma, também a quem entrar mais tarde",
    startSrHinweis:
      "A primeira opção indica a predefinição da turma e o nível em que está a maioria. " +
      "Escolher um nível guarda-o como predefinição da turma - aplica-se também a quem entrar mais tarde - " +
      "e regista-o para quem já está na turma; se alguém já estiver mais à frente, o programa pergunta primeiro. " +
      "Aplica-se a cada pessoa da próxima vez que o Tastenflow for aberto; as estatísticas e as medalhas mantêm-se.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Ano de escolaridade removido. Volta a aplicar-se a predefinição (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Ano de escolaridade: pessoas adultas. Os textos são agora para pessoas adultas (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Ano de escolaridade: ${schulstufeLabelPt(wert)}. Os textos adequam-se agora à idade ` +
      `(${label}).`,
    spracheDerKlasse: (sprache: string) => `Língua da turma: ${sprache}.`,
    spracheGesperrt: "A língua está bloqueada para esta turma.",
    spracheFrei: "A língua volta a poder ser escolhida livremente.",
    matchNichtUmgestellt: "Não foi possível alterar a Corrida da turma.",
    matchErlaubt: "A Corrida da turma está permitida nesta turma.",
    matchAus: "A Corrida da turma está desligada nesta turma.",
    zeilenEndeAn:
      "Cada linha termina agora com a tecla Enter - para toda a turma.",
    zeilenEndeAus: "O fim de linha com a tecla Enter está desligado nesta turma.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `O ano letivo desta turma começa agora a 1 de ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Ortografia: ${label} - para toda a turma.`,
    schreibweiseAutoLabel: "automática",
    schreibweiseGbLabel: "britânica",
    schreibweiseUsLabel: "americana",
    startFrageTitel: "Ponto de partida para toda a turma",
    frageVor: (_n: number) => ["Mais à frente do que o nível escolhido", ":", " "],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "pt", { one: () => "pessoa", other: () => "pessoas" }),
    ],
    frageNach: (_n: number) => [
      ".",
      " Quer mesmo colocar toda a turma neste nível?",
    ],
    detailVor: "Escolhido: ",
    detailNach: (namen: string) => [
      ". Já mais à frente:",
      " ",
      namen,
      ". Voltar atrás retira matéria já praticada - as estatísticas de toques, o tempo de prática e as medalhas mantêm-se em qualquer caso. Aplica-se a cada pessoa da próxima vez que o Tastenflow for aberto.",
    ],
    alleEinstufen: "Colocar toda a turma neste nível",
    nurNochNicht: "Só quem ainda não chegou aqui",
    startZurueck: (name: string, label: string) =>
      `De volta ao nível: ${label}. Pessoa: ${name}. Aplica-se da próxima vez que o Tastenflow for aberto. ` +
      `As estatísticas e as medalhas mantêm-se.`,
    startpunktVon: (name: string, label: string) => `Ponto de partida - ${name}: ${label}.`,
    wochenzielNichtGespeichert: (name: string) =>
      `Não foi possível guardar o objetivo semanal. Pessoa: ${name}.`,
    wochenzielGespeichert: (name: string) => `Objetivo semanal guardado: ${name}.`,
    ueberfaelligFrage: (name: string) =>
      `Repor a zero os minutos em atraso do objetivo semanal? Pessoa: ${name}.\n\n` +
      `Os minutos em atraso acumulados até agora são removidos; a partir desta semana, o ` +
      `objetivo semanal volta a contar do zero. O tempo praticado e as estatísticas mantêm-se.`,
    ueberfaelligErledigt: (name: string) => `Minutos em atraso repostos a zero: ${name}.`,
    erlasseneGespeichert: "Semanas dispensadas guardadas.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Objetivo semanal (${minutenPt(minuten)})` : "Sem objetivo semanal"} - guardado: ${ok} de ${gesamt}; aplica-se a partir de ` +
      `${naechsterMontagPt(jetztMs)}, às 08:00.`,
    klassenZielFehler: (namen: string) =>
      ` Não foi possível para: ${namen} - tente outra vez.`,
    sperreNichtAufgehoben: "Não foi possível retomar o objetivo.",
    sperreAufgehoben:
      "O objetivo foi retomado - o tempo de prática volta a contar para o objetivo semanal a partir de agora.",
    stundeNichtGesperrt: "Não foi possível suspender o objetivo durante 1 hora.",
    gesperrtBisStatus: (zeit: string) =>
      `Objetivo semanal da turma suspenso até às ${zeit} - ` +
      `o tempo de prática e as estatísticas continuam a contar, só o objetivo semanal fica suspenso.`,
    stundeGesperrt: "O objetivo está suspenso durante 1 hora.",
    excelLaeuft: "O ficheiro Excel está a ser criado - um momento.",
    excelFertig: (datei: string) =>
      `Transferido: ${datei} - com uma visão geral e a respetiva legenda, e quatro folhas: ano letivo, desde o início, mês e semana.`,
    excelFehler:
      "Não foi possível criar o ficheiro Excel. Tente outra vez; " +
      "se continuar assim, comunique o problema.",
    laedt: "A carregar...",
    lesefehlerStark: "Não foi possível ler os progressos",
    lesefehlerFuer: (namen: string) => [
      " destas pessoas:",
      " ",
      namen,
      ". Por isso, os números nestas linhas estão vazios e ",
    ],
    lesefehlerNicht: "não",
    lesefehlerSchluss:
      " significam que não houve prática. Volte a carregar a página; se continuar assim, comunique o problema.",
    aufgabenGruppe: "Tarefas para a turma",
    tippchallengeTipp:
      "Abre o Desafio para toda a turma: escolher o texto e a duração - e depois, também aqui, os resultados.",
    tippchallenge: PRUEFUNG_WORT_PT,
    eigeneUebungTipp:
      "Atribui à turma um ficheiro carregado como texto de exercício - cada pessoa pratica-o ao seu ritmo; não desbloqueia novas teclas.",
    eigeneUebung: EIGENE_UEBUNG_WORT_LEHRKRAFT_PT,
    wochenzielTipp:
      "Define quantos minutos por semana a turma pratica - para cada pessoa ou para toda a turma de uma vez.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "definido",
    keinZiel: "sem objetivo",
    einstellungenTipp:
      "Definir para toda a turma: ano de escolaridade, língua, ponto de partida e Corrida da turma.",
    einstellungenDerKlasse: "Definições da turma",
    sperreBeendenTipp:
      "Retoma o objetivo de imediato - o tempo de prática volta a contar para o objetivo semanal.",
    sperrenTipp:
      "Suspende o objetivo semanal durante 60 minutos, para toda a turma. A prática continua - o tempo de prática e as estatísticas continuam a contar, só o objetivo semanal fica suspenso.",
    gesperrtBisKnopf: (zeit: string) => `Suspenso até às ${zeit} - retomar`,
    stundeSperren: "Suspender 1 hora",
    wochenzielAufgabe: "Objetivo semanal - tarefa",
    zielFuerKlasseGesetzt: "- definido para esta turma",
    nochKeinZielGesetzt: "- objetivo ainda não definido",
    minutenZuerst: "Introduza primeiro os minutos por semana (0 a 600).",
    klassenZielTipp:
      "Define este objetivo semanal a partir da próxima semana para cada pessoa desta turma - também para quem entrar mais tarde. Os objetivos definidos individualmente são substituídos.",
    fuerKlasseUebernehmen: "Aplicar a toda a turma",
    wochenzielFuerKlasse: (bezeichnung: string) => `Objetivo semanal: ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Transferir em Excel: transfere a tabela como ficheiro Excel ` +
      `${datei} - primeiro uma visão geral com legenda, ` +
      `depois quatro folhas: o ano letivo atual, desde o início, o mês (as últimas ` +
      `4 semanas) e esta semana, seja qual for o período aqui escolhido.`,
    alsExcel: "Transferir em Excel",
    schulstufeKind: "Ano de escolaridade",
    schulstufeKindName: (name: string) => `Ano de escolaridade: ${name}`,
    wieDieKlasse: (klasse: string) => `como a turma (${klasse})`,
    schulstufeKindTipp:
      "Só para esta pessoa: o ano de escolaridade determina os textos e substitui a definição da turma. Sobe sozinho em cada ano letivo. A opção \"como a turma\" anula esta exceção.",
    schulstufeKindGesetzt: (name: string, stufe: string) => `Os textos correspondem agora a: ${stufe}. Pessoa: ${name}.`,
    schulstufeKindErwachsen: (name: string) => `Os textos são agora para pessoas adultas. Pessoa: ${name}.`,
    schulstufeKindWieKlasse: (name: string) => `Os textos voltam a ser os da turma. Pessoa: ${name}.`,
  },
  br: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `A nova meta (${minutenBr(Math.round(minuten))} por semana) vale a partir de ${naechsterMontagBr(jetztMs)}, às 8:00. ` +
      `Até lá, continua valendo a meta atual.`,
    keinZielMehr: (jetztMs: number) =>
      `A partir de ${naechsterMontagBr(jetztMs)}, às 8:00, não haverá mais meta semanal. ` +
      `Até lá, continua valendo a meta atual.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `A única pessoa desta turma recebe a meta: ${minutenBr(minuten)} por semana.`
            : "A única pessoa desta turma não terá mais meta semanal."
          : minuten > 0
            ? `Todas as pessoas desta turma (${anzahlKinder}) recebem a meta: ${minutenBr(minuten)} por semana.`
            : `Todas as pessoas desta turma (${anzahlKinder}) não terão mais meta semanal.`;
      return (
        `${satz} Vale a partir de ${naechsterMontagBr(jetztMs)}, às 8:00 - até lá, ` +
        `continua valendo a meta atual. As metas definidas individualmente serão substituídas. ` +
        (minuten > 0
          ? "Quem entrar depois também recebe esta meta."
          : "Quem entrar depois também não recebe meta.")
      );
    },
    wochenziel: "Meta semanal",
    minutenProWoche: "Minutos por semana",
    nullKeinZiel: "0 = sem meta semanal.",
    zielKalenderwochen: "Semanas com meta",
    speichernTipp: (name: string) =>
      `Salva juntos os minutos, as semanas com meta e a recuperação - só depois de confirmar. Pessoa: ${name}. A mudança vale a partir da próxima semana.`,
    nichtsGeaendert: "Nada mudou na meta semanal - ela já está salva.",
    speichern: "Salvar",
    nachholenTipp:
      "Os minutos a mais completam as metas não cumpridas de semanas anteriores - primeiro a mais antiga.",
    nachholen: "Recuperar os minutos das semanas anteriores",
    dieseWoche: "Esta semana:",
    min: "min",
    keinWochenziel: "sem meta semanal",
    anstehend: (datum: string, minuten: number) => [" - a partir de segunda-feira, ", datum, ": ", minuten, " min"],
    ueberfaelligTipp:
      "Zera os minutos atrasados de semanas anteriores - a partir desta semana, a meta semanal recomeça do zero. O tempo de prática continua salvo.",
    ueberfaelligZuruecksetzen: "Zerar os minutos atrasados",
    zuletztZurueckgesetzt: (ab: string) => ["zerados pela última vez a partir de: ", ab],
    erlassenTipp:
      "As semanas escolhidas nunca contam como não cumpridas nem para recuperar - esteja a semana marcada como semana com meta ou não. O tempo de prática continua salvo.",
    wochenzielErlassen: "Dispensar a semana",
    wochenzielFuer: (name: string) => `Meta semanal: ${name}`,
    uebernehmen: "Aplicar",
    abbrechen: "Cancelar",
    einstellungen: "Configurações",
    womitAnfangen: "Por onde começar?",
    womitTipp:
      "o que esta pessoa já sabe - escolher um nível mais baixo faz voltar (só depois de confirmar); a estatística e as medalhas continuam salvas.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `Pessoa: ${name}. Nível atual: ${label}.\n\n` +
      `Voltar mesmo para o nível: ${ziel}?\n\n` +
      `Os exercícios voltam a ir só até esse ponto. A estatística de toques, ` +
      `o tempo de prática e as medalhas continuam salvos - se o nível subir de novo ` +
      `mais tarde, tudo estará como antes.\n\n` +
      `Vale a partir da próxima vez que esta pessoa abrir o Tastenflow.`,
    womitName: (name: string) => `Por onde começar: ${name}`,
    ausstehend: (name: string) => ["Vale a partir da próxima abertura do Tastenflow (", name, ")."],
    einhandTipp:
      "Letras maiúsculas e símbolos são aceitos com qualquer tecla Shift (ou com a tecla Caps Lock) - a regra do Shift com a outra mão está desligada para esta pessoa.",
    einhandName: (name: string) => `Digitar com uma mão: ${name} - regra da outra mão desligada`,
    einhand: "Digitar com uma mão",
    tempoTipp:
      "Para esta pessoa, a velocidade não conta em lugar nenhum - sem limite de tempo no jogo, sem meta de velocidade nas estrelas, sem subir ou descer de nível de dificuldade por causa da velocidade, e o tempo de prática continua contando mesmo em pausas longas. Para quem digita com cuidado, mas muito devagar.",
    tempoName: (name: string) => `Com calma: ${name} - a velocidade não é avaliada em lugar nenhum`,
    tempoZaehltNicht: "Com calma",
    abstand: "Espaço maior entre letras (DVC)",
    abstandTipp: `Mais espaço entre CADA caractere ao copiar o texto - para pessoas com deficiência visual cortical (DVC), para quem caracteres muito próximos se misturam. "Duplo" dá o dobro da largura a cada caractere, "triplo" o triplo e "quádruplo" o quádruplo. Durante a digitação, tudo escurece, menos o campo em que se está digitando (a linha de exercício ou a área do jogo); depois de 5 segundos sem digitar, tudo volta a clarear. A linha de exercício desliza até o próximo caractere no ritmo de digitação da pessoa - devagar, se ela digita devagar - em vez de pular. "Simples" mantém os caracteres no espaço habitual e liga só o escurecimento, o deslizar da linha e a linha de leitura. A pessoa também pode mudar o espaço nas próprias Configurações (a engrenagem, Alt + O), quantas vezes quiser - e você pode mudar de novo aqui a qualquer momento. Vale o que foi escolhido por último.`,
    abstandName: (name: string) => `Espaço maior entre letras (DVC): ${name}`,
    listenTitel: "Estudantes da turma com nível e meta semanal",
    tastenSr: (sitzen: number, frei: number) => [
      "Teclas seguras: ",
      sitzen,
      ", teclas desbloqueadas: ",
      frei,
      "",
    ],
    bezugBlock: (datum: string) => `nas 4 semanas de prática a partir de ${datum}`,
    bezugWoche: (datum: string) => `na semana de ${datum}`,
    gruppePerson: "Pessoa",
    gruppeStand: "Progresso e tempo de prática",
    gruppeUeben: "Prática",
    gruppePruefung: PRUEFUNG_WORT_BR,
    kopfName: "Nome",
    kopfStufe: "Nível de dificuldade",
    kopfTasten: "Teclas",
    kopfNaechste: "Próximas teclas",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "todas as teclas aprendidas" : `a seguir ${namen.join(", depois ")}`,
    kopfUebezeit: "Tempo de prática",
    kopfWochenziel: "Meta semanal",
    kopfWochenziele: "Metas semanais",
    kopfTreffer: "Precisão",
    kopfTempo: "Toques/min",
    kopfScore: "Pontuação",
    uebungszeiten: "Tempos de prática",
    nochKeineUebung: "ainda nenhuma prática registrada",
    uebungszeitenKennzahl: (dauer: string, wochen: number) => `${dauer} - semanas: ${wochen}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - dias: ",
      tage,
      "",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt}/${ziel} min`,
    periodeMatches: (n: number) => ` - Competições da turma: ${n}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Ainda nenhuma Competição da turma jogada até o fim"
        : `Competições da turma jogadas até o fim: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Conta cada Competição da turma nesta turma que foi jogada até o fim - desde ${seit}; ` +
      `antes disso, elas não eram registradas. Pessoa: ${name}. ` +
      `Competições interrompidas ou abandonadas antes do fim não contam. Uma competição entra na ` +
      `contagem cerca de uma hora depois de terminar. Só o número: sem classificação, e as ` +
      `vitórias não são contadas.`,
    kopfKlassenmatch: "Competição da turma",
    klassenmatchOhneZahl: "Competição da turma: sem dados",
    gruppeKlassenmatch: "Competição da turma",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Quantas Competições da turma foram jogadas até o fim. As interrompidas ou abandonadas ` +
      `antes do fim não contam; as vitórias não são contadas. Registrado ` +
      `desde ${seit}. Um traço significa: a Competição da turma está desligada nesta turma, ` +
      `ou não foi possível carregar o número.`,
    wocheHilfe: (pauseMin: number) =>
      `Ao abrir, aparece cada tempo de prática desta semana: o dia, o horário de ` +
      `início e fim, o tempo praticado e o que foi praticado. O tempo praticado é só ` +
      `a digitação - as pausas não contam, por isso ele costuma ser menor que o ` +
      `intervalo mostrado. Depois de mais de ${pauseMin} min sem digitar, começa ` +
      `um novo tempo de prática.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Meu treino",
        lektion: "Lições",
        geschichte: "Histórias",
        wortspiel: "Jogos de palavras",
        tippchallenge: PRUEFUNG_WORT_BR,
        klassenmatch: "Competição da turma",
        "eigene-uebung": EIGENE_UEBUNG_WORT_BR_LEHRKRAFT,
      })[art],
    wackligeTasten: "Teclas inseguras",
    nochZuWenigGeuebt: "ainda pouca prática",
    zuWenigUmZuSagen: "Ainda há pouca prática para dizer.",
    wackligCaption: (name: string) => ["Teclas inseguras: ", name],
    tasteKopf: "Tecla",
    tasteHilfe: (prozent: number) =>
      `Uma tecla ainda insegura - pelo menos ${WACKLIG_MIND_ANSCHLAEGE} tentativas, com menos de ${prozentText(prozent, "br")} de toques certos.`,
    trefferKopf: "Precisão",
    trefferHilfe: "A proporção de toques certos nesta tecla.",
    tempoKopf: "Velocidade",
    tempoHilfe: "Com que velocidade esta tecla saiu nos últimos tempos - toques nesta tecla por minuto.",
    abzeichen: (n: number) => ["Medalhas - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_BR} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_BR,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_BR}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Configurações: ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Meta semanal: ${zielMin} min` : "sem meta semanal",
    ],
    eigenstaendigkeit: (n: number) => ["Trabalho autônomo - indícios:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Configurações e resultados - configurações, tempos de prática, teclas inseguras e medalhas; todo o resto está em Meu progresso desta pessoa. Pessoa: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Fechar" : "Abrir"} configurações e resultados: ${name}`,
    keinZielGesetzt: "meta semanal não definida",
    keineAbgeschlossene: "ainda nenhuma semana com meta concluída",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      "Metas semanais cumpridas: ",
      prozent,
      "%, semanas completas: ",
      ganz,
      "/",
      gesamt,
      "",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["semanas completas: ", ganz, "/", gesamt, ""],
    wocheErlassen: "esta semana foi dispensada",
    keineZielwoche: "não é uma semana com meta",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " min, meta: ", nenner, " min"],
    offenSr: (minuten: number) => `, destes, para recuperar de semanas anteriores: ${minuten} min`,
    erreichtSr: ", meta semanal cumprida",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min para recuperar"],
    klasseNichtGespeichert: "Não foi possível salvar a configuração da turma.",
    kinderEingetragen: (n: number) =>
      ` Salvo para: ${pessoasBr(n)} - vale a partir da próxima abertura do ` +
      `Tastenflow. A estatística e as medalhas continuam salvas.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Ponto de partida da turma: ${label}. Vale também para quem entrar depois.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Não foi possível salvar o padrão da turma.${kinderSatz}`,
    gesperrtZusatz: " (bloqueado)",
    stufeWaehlen: "Escolha o nível",
    vorgabeKlasse: (label: string) => `Padrão da turma: ${label}`,
    dieMeisten: (label: string) => `a maioria está em: ${label}`,
    bezugKlasse: (name: string) => `da turma ${name}`,
    startHinweis:
      "o que a turma já sabe - vale para todas as pessoas desta turma, também para quem entrar depois",
    startSrHinweis:
      "O primeiro item mostra o padrão da turma e o nível em que está a maioria. " +
      "Escolher um nível salva esse nível como padrão da turma - vale também para quem entrar depois - " +
      "e o aplica às pessoas que já estão na turma; se alguém já estiver mais à frente, o programa pergunta antes. " +
      "Vale para cada pessoa a partir da próxima abertura do Tastenflow; a estatística e as medalhas continuam salvas.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Ano escolar removido. Volta a valer o padrão (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Ano escolar: Pessoas adultas. Agora os textos são para pessoas adultas (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Ano escolar: ${schulstufeLabelBr(wert)}. Agora os textos são adequados à idade ` +
      `(${label}).`,
    spracheDerKlasse: (sprache: string) => `Idioma da turma: ${sprache}.`,
    spracheGesperrt: "O idioma está bloqueado para as pessoas desta turma.",
    spracheFrei: "O idioma pode ser escolhido livremente de novo.",
    matchNichtUmgestellt: "Não foi possível alterar a Competição da turma.",
    matchErlaubt: "A Competição da turma está permitida nesta turma.",
    matchAus: "A Competição da turma está desligada nesta turma.",
    zeilenEndeAn:
      "Agora cada linha termina com a tecla Enter - para todas as pessoas desta turma.",
    zeilenEndeAus: "O fim de linha com Enter está desligado nesta turma.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `O ano letivo desta turma agora começa em 1º de ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Grafia: ${label} - para todas as pessoas desta turma.`,
    schreibweiseAutoLabel: "automática",
    schreibweiseGbLabel: "britânica",
    schreibweiseUsLabel: "americana",
    startFrageTitel: "Ponto de partida para toda a turma",
    frageVor: (_n: number) => ["Já à frente do nível escolhido", ":", " "],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "br", { one: () => "pessoa", other: () => "pessoas" }),
    ],
    frageNach: (_n: number) => [
      ".",
      " Colocar mesmo toda a turma neste nível?",
    ],
    detailVor: "Escolhido: ",
    detailNach: (namen: string) => [
      ". Já à frente:",
      " ",
      namen,
      ". Voltar de nível retira conteúdo já visto - a estatística de toques, o tempo de prática e as medalhas continuam salvos em qualquer caso. Vale para cada pessoa a partir da próxima abertura do Tastenflow.",
    ],
    alleEinstufen: "Colocar toda a turma neste nível",
    nurNochNicht: "Só quem ainda não chegou aqui",
    startZurueck: (name: string, label: string) =>
      `Voltou para o nível: ${label}. Pessoa: ${name}. Vale a partir da próxima abertura do Tastenflow. ` +
      `A estatística e as medalhas continuam salvas.`,
    startpunktVon: (name: string, label: string) => `Ponto de partida - ${name}: ${label}.`,
    wochenzielNichtGespeichert: (name: string) =>
      `Não foi possível salvar a meta semanal. Pessoa: ${name}.`,
    wochenzielGespeichert: (name: string) => `Meta semanal salva: ${name}.`,
    ueberfaelligFrage: (name: string) =>
      `Zerar os minutos atrasados da meta semanal? Pessoa: ${name}.\n\n` +
      `Os minutos acumulados até agora para recuperar são retirados; a partir desta semana, ` +
      `a meta semanal recomeça do zero. O tempo de prática e a estatística continuam salvos.`,
    ueberfaelligErledigt: (name: string) => `Minutos atrasados zerados: ${name}.`,
    erlasseneGespeichert: "Semanas dispensadas salvas.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Meta semanal (${minutenBr(minuten)})` : "Sem meta semanal"} - salvo: ${ok}/${gesamt}; vale a partir de ` +
      `${naechsterMontagBr(jetztMs)}, às 8:00.`,
    klassenZielFehler: (namen: string) =>
      ` Não foi possível para: ${namen} - tente de novo.`,
    sperreNichtAufgehoben: "Não foi possível retomar a meta.",
    sperreAufgehoben:
      "A meta foi retomada - o tempo de prática volta a contar para a meta semanal a partir de agora.",
    stundeNichtGesperrt: "Não foi possível pausar a meta por 1 hora.",
    gesperrtBisStatus: (zeit: string) =>
      `Meta semanal da turma pausada até ${zeit} - ` +
      `o tempo de prática e a estatística continuam contando, só a meta semanal fica pausada.`,
    stundeGesperrt: "A meta está pausada por 1 hora.",
    excelLaeuft: "O arquivo Excel está sendo criado - um momento.",
    excelFertig: (datei: string) =>
      `Baixado: ${datei} - com um resumo e sua legenda, e quatro planilhas: Ano letivo, Desde o início, Mês e Semana.`,
    excelFehler:
      "Não foi possível criar o arquivo Excel. Tente de novo; " +
      "se continuar assim, relate o problema.",
    laedt: "Carregando...",
    lesefehlerStark: "Não foi possível ler o progresso",
    lesefehlerFuer: (namen: string) => [
      " destas pessoas:",
      " ",
      namen,
      ". Por isso, os números nestas linhas estão vazios e ",
    ],
    lesefehlerNicht: "não significam",
    lesefehlerSchluss:
      " que não houve prática. Atualize a página; se continuar assim, relate o problema.",
    aufgabenGruppe: "Atividades para a turma",
    tippchallengeTipp:
      "Abre o Desafio para toda a turma: escolha o texto e o tempo - e depois, também aqui, os resultados.",
    tippchallenge: PRUEFUNG_WORT_BR,
    eigeneUebungTipp:
      "Atribui à turma um arquivo carregado como texto de exercício - cada pessoa pratica no próprio ritmo; isso não desbloqueia teclas novas.",
    eigeneUebung: EIGENE_UEBUNG_WORT_BR_LEHRKRAFT,
    wochenzielTipp:
      "Define quantos minutos por semana a turma pratica - para cada pessoa separadamente ou para todas de uma vez.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "definida",
    keinZiel: "sem meta",
    einstellungenTipp:
      "Define para toda a turma: ano escolar, idioma, ponto de partida e Competição da turma.",
    einstellungenDerKlasse: "Configurações da turma",
    sperreBeendenTipp:
      "Retoma a meta na hora - o tempo de prática volta a contar para a meta semanal.",
    sperrenTipp:
      "Pausa a meta semanal por 60 minutos para toda a turma. A prática continua - o tempo de prática e a estatística continuam contando, só a meta semanal fica pausada.",
    gesperrtBisKnopf: (zeit: string) => `Pausada até ${zeit} - retomar`,
    stundeSperren: "Pausar por 1 hora",
    wochenzielAufgabe: "Meta semanal - atividade",
    zielFuerKlasseGesetzt: "- definida para as pessoas desta turma",
    nochKeinZielGesetzt: "- meta ainda não definida",
    minutenZuerst: "Primeiro digite os minutos por semana (de 0 a 600).",
    klassenZielTipp:
      "Define esta meta semanal a partir da próxima semana para cada pessoa desta turma - também para quem entrar depois. As metas definidas individualmente serão substituídas.",
    fuerKlasseUebernehmen: "Aplicar a toda a turma",
    wochenzielFuerKlasse: (bezeichnung: string) => `Meta semanal ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Baixar em Excel: baixa a tabela como o arquivo Excel ` +
      `${datei} - primeiro com um resumo e sua legenda, ` +
      `depois quatro planilhas: o ano letivo atual, desde o início, o mês (as últimas ` +
      `4 semanas) e esta semana, seja qual for o período escolhido aqui.`,
    alsExcel: "Baixar em Excel",
    schulstufeKind: "Ano escolar",
    schulstufeKindName: (name: string) => `Ano escolar: ${name}`,
    wieDieKlasse: (klasse: string) => `como a turma (${klasse})`,
    schulstufeKindTipp:
      "Só para esta pessoa: o ano escolar define os textos e substitui a configuração da turma. Ele sobe automaticamente a cada ano letivo. A opção Como a turma retira esta exceção.",
    schulstufeKindGesetzt: (name: string, stufe: string) => `Agora os textos correspondem a: ${stufe}. Pessoa: ${name}.`,
    schulstufeKindErwachsen: (name: string) => `Agora os textos são para pessoas adultas. Pessoa: ${name}.`,
    schulstufeKindWieKlasse: (name: string) => `Agora os textos voltam a ser os da turma. Pessoa: ${name}.`,
  },
  ro: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Noul obiectiv (${minutenRo(Math.round(minuten))} pe săptămână) se aplică începând de ${naechsterMontagRo(jetztMs)}, ora 8:00. ` +
      `Până atunci rămâne obiectivul actual.`,
    keinZielMehr: (jetztMs: number) =>
      `Începând de ${naechsterMontagRo(jetztMs)}, ora 8:00, nu va mai exista obiectiv săptămânal. ` +
      `Până atunci rămâne obiectivul actual.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `Singura persoană din această clasă primește obiectivul: ${minutenRo(minuten)} pe săptămână.`
            : "Singura persoană din această clasă nu va mai avea obiectiv săptămânal."
          : minuten > 0
            ? `Toți elevii acestei clase (${anzahlKinder}) primesc obiectivul: ${minutenRo(minuten)} pe săptămână.`
            : `Elevii acestei clase (${anzahlKinder}) nu vor mai avea obiectiv săptămânal.`;
      return (
        `${satz} Se aplică începând de ${naechsterMontagRo(jetztMs)}, ora 8:00 - până atunci ` +
        `rămâne obiectivul actual. Obiectivele stabilite individual se înlocuiesc. ` +
        (minuten > 0
          ? "Cine se alătură mai târziu primește același obiectiv."
          : "Nici cine se alătură mai târziu nu primește obiectiv.")
      );
    },
    wochenziel: "Obiectiv săptămânal",
    minutenProWoche: "Minute pe săptămână",
    nullKeinZiel: "0 = fără obiectiv săptămânal.",
    zielKalenderwochen: "Săptămâni cu obiectiv",
    speichernTipp: (name: string) =>
      `Salvează deodată minutele, săptămânile cu obiectiv și recuperarea - după confirmare. Persoană: ${name}. Modificarea se aplică de săptămâna viitoare.`,
    nichtsGeaendert: "Nu s-a modificat nimic la obiectivul săptămânal - este deja salvat.",
    speichern: "Salvați",
    nachholenTipp:
      "Minutele suplimentare acoperă obiectivele neatinse din săptămânile trecute - mai întâi pe cel mai vechi.",
    nachholen: "Recuperați minutele din săptămânile trecute",
    dieseWoche: "Săptămâna aceasta:",
    min: "min",
    keinWochenziel: "fără obiectiv săptămânal",
    anstehend: (datum: string, minuten: number) => [" - de luni, ", datum, ": ", minuten, " min"],
    ueberfaelligTipp:
      "Resetează minutele de recuperat din săptămânile trecute - din această săptămână, obiectivul săptămânal începe din nou de la zero. Timpul exersat rămâne.",
    ueberfaelligZuruecksetzen: "Resetați minutele restante",
    zuletztZurueckgesetzt: (ab: string) => ["ultima resetare: ", ab],
    erlassenTipp:
      "Săptămânile alese nu se socotesc niciodată ca neatinse sau de recuperat - indiferent dacă sunt marcate ca săptămâni cu obiectiv. Timpul exersat rămâne.",
    wochenzielErlassen: "Scutiți săptămâna",
    wochenzielFuer: (name: string) => `Obiectiv săptămânal: ${name}`,
    uebernehmen: "Aplicați",
    abbrechen: "Anulați",
    einstellungen: "Setări",
    womitAnfangen: "De unde începeți?",
    womitTipp:
      "ce știe deja această persoană - alegerea unui nivel mai mic o duce înapoi (după confirmare); statistica și medaliile rămân.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `Persoană: ${name}. Nivelul actual: ${label}.\n\n` +
      `Sigur reveniți la nivelul: ${ziel}?\n\n` +
      `Exercițiile se limitează apoi la tastele până la acest loc. Statistica scrierii, ` +
      `timpul de exersare și medaliile rămân - dacă se avansează din nou mai târziu, ` +
      `totul va fi neschimbat.\n\n` +
      `Se aplică de la următoarea deschidere a Tastenflow de către această persoană.`,
    womitName: (name: string) => `De unde începe: ${name}`,
    ausstehend: (name: string) => ["Se aplică de la următoarea deschidere a Tastenflow (", name, ")."],
    einhandTipp:
      "Literele mari și simbolurile sunt acceptate cu oricare tastă Shift (sau cu tasta Caps Lock) - regula Shift cu cealaltă mână este oprită pentru această persoană.",
    einhandName: (name: string) => `Scriere cu o mână: ${name} - regula celeilalte mâini este oprită`,
    einhand: "Scriere cu o mână",
    tempoTipp:
      "Pentru această persoană, viteza nu se socotește nicăieri - fără cronometru în joc, fără limită de viteză la stele, nivelul nu se schimbă nici în sus, nici în jos, iar timpul de exersare se socotește și la pauze lungi. Pentru cei care scriu cu grijă, dar foarte încet.",
    tempoName: (name: string) => `În ritmul tău: ${name} - viteza nu se evaluează nicăieri`,
    tempoZaehltNicht: "În ritmul tău",
    abstand: "Spațiere mare între caractere (CVI)",
    abstandTipp:
      "Spațiu mai mare între FIECARE caracter la copierea textului - pentru persoane cu deficiență de vedere de origine cerebrală (CVI), pentru care caracterele apropiate se contopesc. „Dublă” dă fiecărui caracter o lățime de două ori mai mare, „triplă” de trei ori, iar „cvadruplă” de patru ori. În timpul scrierii se întunecă totul, în afară de câmpul în care se scrie (rândul de exersare sau suprafața de joc); după 5 secunde fără apăsare de tastă, totul se luminează din nou. Rândul de exersare alunecă lin spre caracterul următor, în ritmul de scriere al persoanei - încet, când scrie încet - în loc să sară. „Simplă” lasă caracterele la distanța obișnuită și pornește doar întunecarea, alunecarea rândului și rândul de citire. Persoana își poate schimba spațierea și în Setările proprii (rotița dințată, Alt + O), de câte ori dorește - iar dumneavoastră o puteți schimba aici oricând. Se aplică ultima alegere.",
    abstandName: (name: string) => `Spațiere mare între caractere (CVI): ${name}`,
    listenTitel: "Elevii clasei, cu nivelul și obiectivul săptămânal",
    tastenSr: (sitzen: number, frei: number) => [
      "Taste sigure: ",
      sitzen,
      ", taste deblocate: ",
      frei,
      "",
    ],
    bezugBlock: (datum: string) => `în cele 4 săptămâni de exersare de la ${datum}`,
    bezugWoche: (datum: string) => `în săptămâna de la ${datum}`,
    gruppePerson: "Persoană",
    gruppeStand: "Progres și timp de exersare",
    gruppeUeben: "Exersare",
    gruppePruefung: PRUEFUNG_WORT_RO,
    kopfName: "Nume",
    kopfStufe: "Nivel",
    kopfTasten: "Taste",
    kopfNaechste: "Tastele următoare",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "toate tastele sunt sigure" : `apoi ${namen.join(", apoi ")}`,
    kopfUebezeit: "Timp de exersare",
    kopfWochenziel: "Obiectiv săptămânal",
    kopfWochenziele: "Obiective săptămânale",
    kopfTreffer: "Precizie",
    kopfTempo: "Car./min",
    kopfScore: "Scor",
    uebungszeiten: "Timpi de exersare",
    nochKeineUebung: "încă nu există exerciții salvate",
    uebungszeitenKennzahl: (dauer: string, wochen: number) => `${dauer} - săptămâni: ${wochen}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - zile: ",
      tage,
      "",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt}/${ziel} min`,
    periodeMatches: (n: number) => ` - Întreceri ale clasei: ${n}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Încă nicio Întrecere a clasei dusă până la capăt"
        : `Întreceri ale clasei duse până la capăt: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Numără fiecare Întrecere a clasei din această clasă dusă până la capăt - din ${seit}; ` +
      `cele dinainte nu au fost înregistrate. Persoană: ${name}. ` +
      `Întrecerile întrerupte sau părăsite înainte de sfârșit nu se socotesc. O întrecere se socotește ` +
      `la aproximativ o oră după încheiere. Doar numărul: fără clasament, victoriile nu se ` +
      `socotesc.`,
    kopfKlassenmatch: "Întrecerea clasei",
    klassenmatchOhneZahl: "Întrecerea clasei: fără date",
    gruppeKlassenmatch: "Întrecerea clasei",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Câte Întreceri ale clasei au fost duse până la capăt. Cele întrerupte sau părăsite înainte de sfârșit ` +
      `nu se socotesc; victoriile nu se socotesc. Se înregistrează ` +
      `din ${seit}. Semnul „-” înseamnă: Întrecerea clasei este oprită în această clasă ` +
      `sau numărul nu a putut fi încărcat.`,
    wocheHilfe: (pauseMin: number) =>
      `La deschidere se vede fiecare timp de exersare din această săptămână: ziua, ora de ` +
      `început și de sfârșit, timpul exersat și ce s-a exersat. Timpul exersat înseamnă doar ` +
      `scrierea propriu-zisă - pauzele nu se socotesc, de aceea este adesea mai scurt decât intervalul ` +
      `afișat. După mai mult de ${pauseMin} min fără apăsare de tastă începe ` +
      `un nou timp de exersare.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Antrenamentul meu",
        lektion: "Lecții",
        geschichte: "Povești",
        wortspiel: "Jocuri cu cuvinte",
        tippchallenge: PRUEFUNG_WORT_RO,
        klassenmatch: "Întrecerea clasei",
        "eigene-uebung": EIGENE_UEBUNG_LEHRKRAFT_WORT_RO,
      })[art],
    wackligeTasten: "Taste nesigure",
    nochZuWenigGeuebt: "exersat încă prea puțin",
    zuWenigUmZuSagen: "Deocamdată prea puțin exercițiu pentru o concluzie.",
    wackligCaption: (name: string) => ["Taste nesigure: ", name],
    tasteKopf: "Tastă",
    tasteHilfe: (prozent: number) =>
      `Tastă încă nesigură - încercări: cel puțin ${WACKLIG_MIND_ANSCHLAEGE}, apăsări corecte: sub ${prozentText(prozent, "ro")}.`,
    trefferKopf: "Precizie",
    trefferHilfe: "Ponderea apăsărilor corecte pentru această tastă.",
    tempoKopf: "Viteză",
    tempoHilfe: "Cât de repede a mers această tastă în ultima vreme - apăsări ale acestei taste pe minut.",
    abzeichen: (n: number) => ["Medalii - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_RO} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_RO,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_RO}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Setări: ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Obiectiv săptămânal: ${zielMin} min` : "fără obiectiv săptămânal",
    ],
    eigenstaendigkeit: (n: number) => ["Lucru independent - semnale:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Setări și rezultate - setări, timpi de exersare, taste nesigure și medalii; restul este în Progresul meu al acestei persoane. Persoană: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Închideți" : "Deschideți"} setările și rezultatele: ${name}`,
    keinZielGesetzt: "obiectiv săptămânal nestabilit",
    keineAbgeschlossene: "încă nicio săptămână cu obiectiv încheiată",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      "Obiective săptămânale atinse: ",
      prozent,
      " %, săptămâni întregi: ",
      ganz,
      "/",
      gesamt,
      "",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["săptămâni întregi: ", ganz, "/", gesamt, ""],
    wocheErlassen: "această săptămână este scutită",
    keineZielwoche: "nu este săptămână cu obiectiv",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " min, obiectiv: ", nenner, " min"],
    offenSr: (minuten: number) => `, din care de recuperat din săptămânile trecute: ${minuten} min`,
    erreichtSr: ", obiectiv săptămânal atins",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min de recuperat"],
    klasseNichtGespeichert: "Setarea clasei nu a putut fi salvată.",
    kinderEingetragen: (n: number) =>
      ` Salvat pentru: ${persoaneRo(n)} - se aplică de la următoarea deschidere a ` +
      `Tastenflow. Statistica și medaliile rămân.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Punct de plecare pentru clasă: ${label}. Se aplică și celor care se alătură mai târziu.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Setarea implicită a clasei nu a putut fi salvată.${kinderSatz}`,
    gesperrtZusatz: " (blocat)",
    stufeWaehlen: "Alegeți nivelul",
    vorgabeKlasse: (label: string) => `Implicit pentru clasă: ${label}`,
    dieMeisten: (label: string) => `cei mai mulți sunt la nivelul: ${label}`,
    bezugKlasse: (name: string) => `pentru clasa ${name}`,
    startHinweis:
      "ce știe deja clasa - se aplică tuturor elevilor din această clasă, inclusiv celor care se alătură mai târziu",
    startSrHinweis:
      "Prima intrare arată setarea implicită a clasei și nivelul la care se află cei mai mulți. " +
      "Alegerea unui nivel îl salvează ca setare implicită a clasei - se aplică și celor care se alătură mai târziu - " +
      "și îl înscrie la elevii care sunt deja în clasă; dacă cineva este deja mai departe, programul întreabă mai întâi. " +
      "Se aplică pentru fiecare persoană de la următoarea deschidere a Tastenflow; statistica și medaliile rămân.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Anul de studiu a fost eliminat. Se aplică din nou setarea implicită (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Anul de studiu: Adulți. Textele sunt acum pentru adulți (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Anul de studiu: ${schulstufeLabelRo(wert)}. Textele sunt acum adaptate vârstei ` +
      `(${label}).`,
    spracheDerKlasse: (sprache: string) => `Limba clasei: ${sprache}.`,
    spracheGesperrt: "Limba este blocată pentru elevii acestei clase.",
    spracheFrei: "Limba poate fi aleasă din nou liber.",
    matchNichtUmgestellt: "Întrecerea clasei nu a putut fi modificată.",
    matchErlaubt: "Întrecerea clasei este permisă în această clasă.",
    matchAus: "Întrecerea clasei este oprită în această clasă.",
    zeilenEndeAn:
      "Fiecare rând se încheie acum cu tasta Enter - pentru toți elevii acestei clase.",
    zeilenEndeAus: "Sfârșitul de rând cu tasta Enter este oprit în această clasă.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `Anul școlar al acestei clase începe acum în prima zi a lunii: ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Ortografie: ${label} - pentru toți elevii acestei clase.`,
    schreibweiseAutoLabel: "automat",
    schreibweiseGbLabel: "britanică",
    schreibweiseUsLabel: "americană",
    startFrageTitel: "Punct de plecare pentru toată clasa",
    frageVor: (_n: number) => ["Mai departe decât nivelul ales", ":", " "],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "ro", { one: () => "persoană", few: () => "persoane", other: () => "de persoane" }),
    ],
    frageNach: (_n: number) => [
      ".",
      " Sigur setați toată clasa la acest nivel?",
    ],
    detailVor: "Ales: ",
    detailNach: (namen: string) => [
      ". Deja mai departe:",
      " ",
      namen,
      ". Revenirea înapoi elimină conținut deja parcurs - statistica scrierii, timpul de exersare și medaliile rămân în orice caz. Se aplică pentru fiecare persoană de la următoarea deschidere a Tastenflow.",
    ],
    alleEinstufen: "Setați toată clasa la acest nivel",
    nurNochNicht: "Doar persoanele care nu au ajuns încă aici",
    startZurueck: (name: string, label: string) =>
      `Revenire la nivelul: ${label}. Persoană: ${name}. Se aplică de la următoarea deschidere a Tastenflow. ` +
      `Statistica și medaliile rămân.`,
    startpunktVon: (name: string, label: string) => `Punct de plecare - ${name}: ${label}.`,
    wochenzielNichtGespeichert: (name: string) =>
      `Obiectivul săptămânal nu a putut fi salvat. Persoană: ${name}.`,
    wochenzielGespeichert: (name: string) => `Obiectiv săptămânal salvat: ${name}.`,
    ueberfaelligFrage: (name: string) =>
      `Resetați minutele restante ale obiectivului săptămânal? Persoană: ${name}.\n\n` +
      `Minutele de recuperat adunate până acum se șterg; din această săptămână, ` +
      `obiectivul săptămânal începe din nou de la zero. Timpul exersat și statistica rămân.`,
    ueberfaelligErledigt: (name: string) => `Minute restante resetate: ${name}.`,
    erlasseneGespeichert: "Săptămânile scutite sunt salvate.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Obiectiv săptămânal (${minutenRo(minuten)})` : "Fără obiectiv săptămânal"} - salvat: ${ok}/${gesamt}; se aplică începând de ` +
      `${naechsterMontagRo(jetztMs)}, ora 8:00.`,
    klassenZielFehler: (namen: string) =>
      ` Nu a reușit la: ${namen} - încercați din nou.`,
    sperreNichtAufgehoben: "Obiectivul nu a putut fi reluat.",
    sperreAufgehoben:
      "Obiectivul a fost reluat - timpul de exersare se socotește din nou la obiectivul săptămânal.",
    stundeNichtGesperrt: "Obiectivul nu a putut fi suspendat pentru o oră.",
    gesperrtBisStatus: (zeit: string) =>
      `Obiectivul săptămânal al clasei este suspendat până la ${zeit} - ` +
      `timpul de exersare și statistica se socotesc în continuare, suspendat este doar obiectivul săptămânal.`,
    stundeGesperrt: "Obiectivul este suspendat pentru o oră.",
    excelLaeuft: "Fișierul Excel se pregătește - un moment.",
    excelFertig: (datei: string) =>
      `Descărcat: ${datei} - cu prezentarea generală și legenda ei, plus patru foi: an școlar, de la început, lună și săptămână.`,
    excelFehler:
      "Fișierul Excel nu a putut fi creat. Încercați din nou; " +
      "dacă se repetă, raportați problema.",
    laedt: "Se încarcă...",
    lesefehlerStark: "Progresul nu a putut fi citit",
    lesefehlerFuer: (namen: string) => [
      " la aceste persoane:",
      " ",
      namen,
      ". De aceea cifrele din aceste rânduri sunt goale și ",
    ],
    lesefehlerNicht: "nu înseamnă",
    lesefehlerSchluss:
      " că nu s-a scris. Reîmprospătați pagina; dacă se repetă, raportați problema.",
    aufgabenGruppe: "Sarcini pentru clasă",
    tippchallengeTipp:
      "Deschide Provocarea pentru toată clasa: alegeți textul și timpul - apoi, tot aici, rezultatele.",
    tippchallenge: PRUEFUNG_WORT_RO,
    eigeneUebungTipp:
      "Atribuie clasei un fișier încărcat ca text de exersat - fiecare persoană îl exersează în ritmul ei; nu se deblochează taste noi.",
    eigeneUebung: EIGENE_UEBUNG_LEHRKRAFT_WORT_RO,
    wochenzielTipp:
      "Stabilește câte minute pe săptămână exersează clasa - pentru fiecare persoană separat sau pentru toți deodată.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "stabilit",
    keinZiel: "fără obiectiv",
    einstellungenTipp:
      "Stabiliți pentru toată clasa: anul de studiu, limba, punctul de plecare și Întrecerea clasei.",
    einstellungenDerKlasse: "Setările clasei",
    sperreBeendenTipp:
      "Reia imediat obiectivul - timpul de exersare se socotește apoi din nou la obiectivul săptămânal.",
    sperrenTipp:
      "Suspendă obiectivul săptămânal pentru 60 de minute, pentru toată clasa. Se poate exersa în continuare - timpul de exersare și statistica se socotesc mai departe, suspendat este doar obiectivul săptămânal.",
    gesperrtBisKnopf: (zeit: string) => `Suspendat până la ${zeit} - reluați`,
    stundeSperren: "Suspendați o oră",
    wochenzielAufgabe: "Obiectiv săptămânal - sarcină",
    zielFuerKlasseGesetzt: "- stabilit pentru elevii acestei clase",
    nochKeinZielGesetzt: "- obiectiv încă nestabilit",
    minutenZuerst: "Introduceți mai întâi minutele pe săptămână (de la 0 la 600 de minute).",
    klassenZielTipp:
      "Stabilește acest obiectiv săptămânal, de săptămâna viitoare, pentru fiecare persoană din această clasă - și pentru cei care se alătură mai târziu. Obiectivele stabilite individual se înlocuiesc.",
    fuerKlasseUebernehmen: "Aplicați pentru toată clasa",
    wochenzielFuerKlasse: (bezeichnung: string) => `Obiectiv săptămânal: ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Descărcați în format Excel: descarcă tabelul ca fișier Excel ` +
      `${datei} - mai întâi prezentarea generală și legenda ei, ` +
      `apoi patru foi: anul școlar curent, de la început, luna (ultimele ` +
      `4 săptămâni) și această săptămână, indiferent de perioada aleasă aici.`,
    alsExcel: "Descărcați în format Excel",
    schulstufeKind: "Anul de studiu",
    schulstufeKindName: (name: string) => `Anul de studiu: ${name}`,
    wieDieKlasse: (klasse: string) => `ca la clasă (${klasse})`,
    schulstufeKindTipp:
      "Doar pentru această persoană: anul de studiu stabilește textele și înlocuiește setarea clasei. Crește singur cu fiecare an școlar. Opțiunea „ca la clasă” anulează această excepție.",
    schulstufeKindGesetzt: (name: string, stufe: string) => `Textele corespund acum anului de studiu: ${stufe}. Persoană: ${name}.`,
    schulstufeKindErwachsen: (name: string) => `Textele corespund acum adulților. Persoană: ${name}.`,
    schulstufeKindWieKlasse: (name: string) => `Textele corespund din nou clasei. Persoană: ${name}.`,
  },
  sv: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Det nya målet (${minutenSv(Math.round(minuten))} per vecka) gäller från ${naechsterMontagSv(jetztMs)} klockan 08:00. ` +
      `Till dess gäller det nuvarande målet.`,
    keinZielMehr: (jetztMs: number) =>
      `Från ${naechsterMontagSv(jetztMs)} klockan 08:00 finns inget veckomål längre. ` +
      `Till dess gäller det nuvarande målet.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `Den enda eleven i klassen får målet: ${minutenSv(minuten)} per vecka.`
            : "Den enda eleven i klassen har inte längre något veckomål."
          : minuten > 0
            ? `Alla ${anzahlKinder} elever i klassen får målet: ${minutenSv(minuten)} per vecka.`
            : `Alla ${anzahlKinder} elever i klassen har inte längre något veckomål.`;
      return (
        `${satz} Det gäller från ${naechsterMontagSv(jetztMs)} klockan 08:00 - till dess ` +
        `gäller det nuvarande målet. Mål som har ställts in för enskilda elever skrivs över. ` +
        (minuten > 0
          ? "Elever som kommer till senare får också det här målet."
          : "Elever som kommer till senare får inte heller något mål.")
      );
    },
    wochenziel: "Veckomål",
    minutenProWoche: "Minuter per vecka",
    nullKeinZiel: "0 = inget veckomål.",
    zielKalenderwochen: "Veckor med mål",
    speichernTipp: (name: string) =>
      `Sparar minuter, veckor med mål och Ta igen samtidigt - först efter en bekräftelse. Elev: ${name}. Ändringen gäller från nästa vecka.`,
    nichtsGeaendert: "Inget har ändrats i veckomålet - det är redan sparat.",
    speichern: "Spara",
    nachholenTipp:
      "Extra övade minuter fyller på ouppnådda veckomål från tidigare veckor - det äldsta först.",
    nachholen: "Ta igen minuter från tidigare veckor",
    dieseWoche: "Den här veckan:",
    min: "min",
    keinWochenziel: "inget veckomål",
    anstehend: (datum: string, minuten: number) => [" - från måndag ", datum, ": ", minuten, " min"],
    ueberfaelligTipp:
      "Nollställer minuter att ta igen från tidigare veckor - från och med den här veckan börjar veckomålet om. Den övade tiden finns kvar.",
    ueberfaelligZuruecksetzen: "Nollställ minuter att ta igen",
    zuletztZurueckgesetzt: (ab: string) => ["senast nollställt: ", ab],
    erlassenTipp:
      "De valda veckorna räknas aldrig som missade eller som minuter att ta igen - oavsett om de är markerade som veckor med mål. Den övade tiden finns kvar.",
    wochenzielErlassen: "Undanta veckan",
    wochenzielFuer: (name: string) => `Veckomål: ${name}`,
    uebernehmen: "Använd",
    abbrechen: "Avbryt",
    einstellungen: "Inställningar",
    womitAnfangen: "Var vill du börja?",
    womitTipp:
      "vad eleven redan kan - en lägre nivå flyttar tillbaka eleven (först efter en bekräftelse); statistik och märken finns kvar.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `${name} är på nivån: ${label}.\n\n` +
      `Vill du flytta tillbaka till nivån: ${ziel}?\n\n` +
      `Övningarna går sedan bara fram till den nivån igen. Statistik över anslag, ` +
      `övningstid och märken finns kvar - om nivån höjs igen senare ` +
      `finns allt kvar oförändrat.\n\n` +
      `Ändringen gäller när ${name} öppnar Tastenflow nästa gång.`,
    womitName: (name: string) => `Var ${name} börjar`,
    ausstehend: (name: string) => ["Gäller när ", name, " öppnar Tastenflow nästa gång."],
    einhandTipp:
      "Stora bokstäver och specialtecken godtas med vilken Skift-tangent som helst (eller med Caps Lock) - regeln Skift med andra handen är avstängd för den här eleven.",
    einhandName: (name: string) => `Skriva med en hand: ${name} - regeln Skift med andra handen är avstängd`,
    einhand: "Skriva med en hand",
    tempoTipp:
      "För den här eleven räknas hastigheten ingenstans - ingen tidsgräns i spelet, inget hastighetsmål för stjärnorna, svårighetsnivån ändras inte upp eller ned, och övningstiden räknas även under långa pauser. För elever som skriver noggrant men mycket långsamt.",
    tempoName: (name: string) => `I lugn och ro: ${name} - hastigheten bedöms inte någonstans`,
    tempoZaehltNicht: "I lugn och ro",
    abstand: "Större avstånd mellan tecknen (CVI)",
    abstandTipp: `Större avstånd mellan VARJE tecken när texten skrivs av - för elever med CVI (cerebral synnedsättning), för vilka tecken som står tätt flyter ihop. Dubbelt ger dubbel, Tredubbelt tredubbel och Fyrdubbelt fyrdubbel bredd per tecken. Under skrivandet tonas allt ned utom fältet där eleven skriver (övningsraden eller spelplanen); efter 5 sekunder utan skrivande blir det ljust igen. Övningsraden glider då till nästa tecken i elevens egen skrivtakt - långsamt när eleven skriver långsamt - i stället för att hoppa. Enkelt låter tecknen stå med vanligt avstånd och slår bara på nedtoningen, den glidande raden och Läsrad. Eleven kan också själv ändra avståndet i sina inställningar (kugghjulet, Alt + O), så ofta eleven vill - och du kan när som helst ändra det här igen. Det som valdes senast gäller.`,
    schulstufeKind: "Årskurs",
    schulstufeKindName: (name: string) => `Årskurs: ${name}`,
    wieDieKlasse: (klasse: string) => `som klassen (${klasse})`,
    schulstufeKindTipp:
      "Bara för den här eleven: årskursen bestämmer vilka texter eleven får och gäller i stället för klassens årskurs. Den ökar av sig själv varje läsår. Som klassen tar bort undantaget igen.",
    schulstufeKindGesetzt: (name: string, stufe: string) =>
      `${name} får nu texter för ${stufe}.`,
    schulstufeKindErwachsen: (name: string) => `${name} får nu texter för vuxna.`,
    schulstufeKindWieKlasse: (name: string) => `${name} får klassens texter igen.`,
    abstandName: (name: string) => `Större avstånd mellan tecknen (CVI): ${name}`,
    listenTitel: "Elever i klassen med nivå och veckomål",
    tastenSr: (sitzen: number, frei: number) => [
      "Säkra tangenter: ",
      sitzen,
      ", upplåsta tangenter: ",
      frei,
      "",
    ],
    bezugBlock: (datum: string) => `de 4 övningsveckorna från ${datum}`,
    bezugWoche: (datum: string) => `veckan från ${datum}`,
    gruppePerson: "Elev",
    gruppeStand: "Framsteg och övningstid",
    gruppeUeben: "Övning",
    gruppePruefung: PRUEFUNG_WORT_SV,
    kopfName: "Namn",
    kopfStufe: "Svårighetsnivå",
    kopfTasten: "Tangenter",
    kopfNaechste: "Nästa tangenter",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "alla tangenter är inlärda" : `härnäst ${namen.join(", sedan ")}`,
    kopfUebezeit: "Övningstid",
    kopfWochenziel: "Veckomål",
    kopfWochenziele: "Veckomål",
    kopfTreffer: "Träffsäkerhet",
    kopfTempo: "Anslag/min",
    kopfScore: "Poäng",
    uebungszeiten: "Övningstider",
    nochKeineUebung: "ingen övning registrerad än",
    uebungszeitenKennzahl: (dauer: string, wochen: number) =>
      `${dauer} - ${mehrzahl(wochen, "sv", { one: (z) => `${z} vecka`, other: (z) => `${z} veckor` })}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - dagar: ",
      tage,
      "",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt}/${ziel} min`,
    periodeMatches: (n: number) => ` - Klasstävlingar: ${n}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Har ännu inte spelat någon Klasstävling till slutet"
        : `Klasstävlingar spelade till slutet: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Räknar varje Klasstävling i den här klassen som ${name} har spelat till slutet - sedan ${seit}; ` +
      `tidigare tävlingar registrerades inte. Avbrutna tävlingar och tävlingar som lämnades ` +
      `i förtid räknas inte. En tävling räknas med ungefär en timme efter att den är slut. ` +
      `Bara antalet: ingen placering, och vem som vann räknas inte.`,
    kopfKlassenmatch: "Klasstävlingen",
    klassenmatchOhneZahl: "Klasstävlingen: ingen uppgift",
    gruppeKlassenmatch: "Klasstävlingen",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Hur många Klasstävlingar eleven har spelat till slutet. Avbrutna tävlingar och tävlingar ` +
      `som lämnades i förtid räknas inte; vem som vann räknas inte. Registreras ` +
      `sedan ${seit}. Tecknet "-" betyder: Klasstävlingen är avstängd i den här klassen, ` +
      `eller så gick det inte att läsa in antalet.`,
    wocheHilfe: (pauseMin: number) =>
      `När raden är öppen visas varje övningstid den här veckan: dag, klockslag från och till, ` +
      `den övade tiden och vad som övades. Övad tid är bara själva skrivandet - pauser ` +
      `räknas inte, därför är den ofta kortare än tiden från och till. Efter mer än ${pauseMin} ` +
      `min utan skrivande börjar en ny övningstid.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Min träning",
        lektion: "Lektioner",
        geschichte: "Berättelser",
        wortspiel: "Ordlekar",
        tippchallenge: PRUEFUNG_WORT_SV,
        klassenmatch: "Klasstävlingen",
        "eigene-uebung": EIGENE_UEBUNG_WORT_LEHRKRAFT_SV,
      })[art],
    wackligeTasten: "Osäkra tangenter",
    nochZuWenigGeuebt: "inte tillräckligt med övning än",
    zuWenigUmZuSagen: "Inte tillräckligt med övning än för att kunna säga något.",
    wackligCaption: (name: string) => ["Osäkra tangenter: ", name],
    tasteKopf: "Tangent",
    tasteHilfe: (prozent: number) =>
      `En tangent som ännu inte är säker - minst ${WACKLIG_MIND_ANSCHLAEGE} anslag, träffsäkerhet under ${prozentText(prozent, "sv")}.`,
    trefferKopf: "Träffsäkerhet",
    trefferHilfe: "Andelen rätta anslag på den här tangenten.",
    tempoKopf: "Hastighet",
    tempoHilfe: "Hur snabbt den här tangenten har kommit på sista tiden - anslag på den här tangenten per minut.",
    abzeichen: (n: number) => ["Märken - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_SV} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_SV,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_SV}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Inställningar: ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Veckomål: ${zielMin} min` : "inget veckomål",
    ],
    eigenstaendigkeit: (n: number) => ["Självständigt arbete - noteringar:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Inställningar och resultat - inställningar, övningstider, osäkra tangenter och märken; allt annat finns i Mina framsteg för den här eleven. Elev: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Stäng" : "Öppna"} inställningar och resultat: ${name}`,
    keinZielGesetzt: "inget veckomål inställt",
    keineAbgeschlossene: "ingen avslutad vecka med mål än",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      "Uppnådda veckomål: ",
      prozent,
      " procent, hela veckor: ",
      ganz,
      "/",
      gesamt,
      "",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["hela veckor: ", ganz, "/", gesamt, ""],
    wocheErlassen: "den här veckan är undantagen",
    keineZielwoche: "ingen vecka med mål",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " min, mål: ", nenner, " min"],
    offenSr: (minuten: number) => `, varav att ta igen från tidigare veckor: ${minuten} min`,
    erreichtSr: ", veckomålet uppnått",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min att ta igen"],
    klasseNichtGespeichert: "Det gick inte att spara klassens inställning.",
    kinderEingetragen: (n: number) =>
      ` Sparat för ${eleverSv(n)} - gäller när Tastenflow öppnas nästa gång. ` +
      `Statistik och märken finns kvar.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Klassens startpunkt: ${label}. Gäller även för elever som kommer till senare.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Det gick inte att spara klassens startpunkt.${kinderSatz}`,
    gesperrtZusatz: " (låst)",
    stufeWaehlen: "Välj nivå",
    vorgabeKlasse: (label: string) => `Klassens startpunkt: ${label}`,
    dieMeisten: (label: string) => `de flesta är på: ${label}`,
    bezugKlasse: (name: string) => `i klassen ${name}`,
    startHinweis:
      "vad klassen redan kan - gäller för alla elever i klassen, även för dem som kommer till senare",
    startSrHinweis:
      "Det första alternativet visar klassens startpunkt och nivån där de flesta elever är just nu. " +
      "Väljer du en nivå sparas den som klassens startpunkt - den gäller även för elever som kommer till senare - " +
      "och ställs in för eleverna som redan finns i klassen; om någon redan har kommit längre frågar programmet först. " +
      "Gäller när en elev öppnar Tastenflow nästa gång; statistik och märken finns kvar.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Årskursen är borttagen. Standardvärdet gäller igen (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Årskurs: Vuxna. Texterna är nu för vuxna (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Vald: ${schulstufeLabelSv(wert)}. Texterna är nu anpassade efter åldern ` +
      `(${label}).`,
    spracheDerKlasse: (sprache: string) => `Klassens språk: ${sprache}.`,
    spracheGesperrt: "Språket är låst för eleverna i den här klassen.",
    spracheFrei: "Språket kan väljas fritt igen.",
    matchNichtUmgestellt: "Det gick inte att ändra Klasstävlingen.",
    matchErlaubt: "Klasstävlingen är tillåten i den här klassen.",
    matchAus: "Klasstävlingen är avstängd i den här klassen.",
    zeilenEndeAn:
      "Varje rad avslutas nu med Retur - för alla elever i den här klassen.",
    zeilenEndeAus: "Radslut med Retur är avstängt i den här klassen.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `Läsåret för den här klassen börjar nu den 1 ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Stavning: ${label} - för alla elever i den här klassen.`,
    schreibweiseAutoLabel: "automatisk",
    schreibweiseGbLabel: "brittisk",
    schreibweiseUsLabel: "amerikansk",
    startFrageTitel: "Startpunkt för hela klassen",
    frageVor: (_n: number) => ["Redan längre än den valda nivån", ":", " "],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "sv", { one: () => "elev", other: () => "elever" }),
    ],
    frageNach: (_n: number) => [
      ".",
      " Vill du ställa in hela klassen på den här nivån?",
    ],
    detailVor: "Valt: ",
    detailNach: (namen: string) => [
      ". Redan längre:",
      " ",
      namen,
      ". Att flytta tillbaka tar bort övningsstoff som eleven redan har gått igenom - statistik över anslag, övningstid och märken finns kvar i alla fall. Gäller när en elev öppnar Tastenflow nästa gång.",
    ],
    alleEinstufen: "Ställ in för alla",
    nurNochNicht: "Bara de som inte har kommit så långt än",
    startZurueck: (name: string, label: string) =>
      `${name} flyttas tillbaka till nivån: ${label}. Gäller när Tastenflow öppnas nästa gång. ` +
      `Statistik och märken finns kvar.`,
    startpunktVon: (name: string, label: string) => `Startpunkt för ${name}: ${label}.`,
    wochenzielNichtGespeichert: (name: string) =>
      `Det gick inte att spara veckomålet för ${name}.`,
    wochenzielGespeichert: (name: string) => `Veckomålet för ${name} är sparat.`,
    ueberfaelligFrage: (name: string) =>
      `Vill du nollställa minuter att ta igen för ${name}?\n\n` +
      `Allt som har samlats hittills tas bort; från och med den här veckan börjar ` +
      `veckomålet om. Redan övad tid och statistiken finns kvar.`,
    ueberfaelligErledigt: (name: string) => `Minuter att ta igen för ${name} är nollställda.`,
    erlasseneGespeichert: "Undantagna veckor är sparade.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Veckomål (${minutenSv(minuten)})` : "Inget veckomål"} - sparat: ${ok}/${gesamt}; gäller från ` +
      `${naechsterMontagSv(jetztMs)} klockan 08:00.`,
    klassenZielFehler: (namen: string) =>
      ` Det gick inte för ${namen} - försök igen.`,
    sperreNichtAufgehoben: "Det gick inte att återuppta målet.",
    sperreAufgehoben:
      "Målet är återupptaget - övad tid räknas från och med nu mot veckomålet igen.",
    stundeNichtGesperrt: "Det gick inte att pausa målet i en timme.",
    gesperrtBisStatus: (zeit: string) =>
      `Klassens veckomål är pausat till ${zeit} - ` +
      `övningstid och statistik räknas vidare, bara inte veckomålet.`,
    stundeGesperrt: "Målet är pausat i en timme.",
    excelLaeuft: "Excel-filen skapas - ett ögonblick.",
    excelFertig: (datei: string) =>
      `Nedladdad: ${datei} - med en översikt och teckenförklaring och fyra blad: Läsår, Från början, Månad och Vecka.`,
    excelFehler:
      "Det gick inte att skapa Excel-filen. Försök igen; " +
      "om det fortsätter, rapportera det.",
    laedt: "Läser in...",
    lesefehlerStark: "Det gick inte att läsa framstegen",
    lesefehlerFuer: (namen: string) => [
      " för",
      " ",
      namen,
      ". Siffrorna i de här raderna är därför tomma och betyder ",
    ],
    lesefehlerNicht: "inte",
    lesefehlerSchluss:
      " att ingen övning har skett. Ladda om sidan; om det fortsätter, rapportera det.",
    aufgabenGruppe: "Uppgifter för klassen",
    tippchallengeTipp:
      "Öppnar Utmaningen för hela klassen: välj text och tid - sedan finns även resultaten här.",
    tippchallenge: PRUEFUNG_WORT_SV,
    eigeneUebungTipp:
      "Ger klassen en uppladdad fil som text att öva på - varje elev övar i sin egen takt, och inga nya tangenter låses upp.",
    eigeneUebung: EIGENE_UEBUNG_WORT_LEHRKRAFT_SV,
    wochenzielTipp:
      "Ställer in hur många minuter klassen ska öva per vecka - för varje elev för sig eller för alla på en gång.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "inställt",
    keinZiel: "inget mål",
    einstellungenTipp:
      "Ställ in årskurs, språk, startpunkt och Klasstävlingen för hela klassen.",
    einstellungenDerKlasse: "Klassens inställningar",
    sperreBeendenTipp:
      "Återupptar målet direkt - sedan räknas övad tid mot veckomålet igen.",
    sperrenTipp:
      "Pausar veckomålet i 60 minuter för hela klassen. Eleverna kan öva vidare - övningstid och statistik räknas vidare, bara inte veckomålet.",
    gesperrtBisKnopf: (zeit: string) => `Pausat till ${zeit} - återuppta`,
    stundeSperren: "Pausa en timme",
    wochenzielAufgabe: "Veckomål - uppgift",
    zielFuerKlasseGesetzt: "- inställt för elever i den här klassen",
    nochKeinZielGesetzt: "- inget mål inställt än",
    minutenZuerst: "Ange först minuter per vecka (0 till 600 minuter).",
    klassenZielTipp:
      "Ställer in det här veckomålet från nästa vecka för varje elev i den här klassen - även för elever som kommer till senare. Mål som har ställts in för enskilda elever skrivs över.",
    fuerKlasseUebernehmen: "Använd för hela klassen",
    wochenzielFuerKlasse: (bezeichnung: string) => `Veckomål för ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Ladda ned som Excel-fil: laddar ned tabellen som Excel-filen ` +
      `${datei} - först en översikt med teckenförklaring, ` +
      `sedan fyra blad: det pågående läsåret, från början, månaden (de senaste ` +
      `4 veckorna) och den här veckan, oavsett vilken period som är vald här.`,
    alsExcel: "Ladda ned som Excel-fil",
  },
  uk: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `Нова мета (${minutenUk(Math.round(minuten))} на тиждень) почне діяти в понеділок, ${naechsterMontagUk(jetztMs)}, о 8:00. ` +
      `До цього часу діє попередня мета.`,
    keinZielMehr: (jetztMs: number) =>
      `У понеділок, ${naechsterMontagUk(jetztMs)}, о 8:00 тижнева мета перестане діяти. ` +
      `До цього часу діє попередня мета.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const satz =
        anzahlKinder === 1
          ? minuten > 0
            ? `Єдина дитина в цьому класі отримає мету: ${minutenUk(minuten)} на тиждень.`
            : "Єдина дитина в цьому класі більше не матиме тижневої мети."
          : minuten > 0
            ? `Усі учні цього класу (${anzahlKinder}) отримають мету: ${minutenUk(minuten)} на тиждень.`
            : `Усі учні цього класу (${anzahlKinder}) більше не матимуть тижневої мети.`;
      return (
        `${satz} Це почне діяти в понеділок, ${naechsterMontagUk(jetztMs)}, о 8:00 - до цього часу ` +
        `діє попередня мета. Мету, встановлену окремим дітям, буде замінено. ` +
        (minuten > 0
          ? "Ті, хто приєднається пізніше, теж отримають цю мету."
          : "Ті, хто приєднається пізніше, теж не матимуть мети.")
      );
    },
    wochenziel: "Тижнева мета",
    minutenProWoche: "Хвилини на тиждень",
    nullKeinZiel: "0 = без тижневої мети.",
    zielKalenderwochen: "Тижні з метою",
    speichernTipp: (name: string) =>
      `Зберігає разом хвилини, тижні з метою та надолуження - лише після підтвердження. Дитина: ${name}. Зміна діє з наступного тижня.`,
    nichtsGeaendert: "Тижневу мету не змінено - її вже збережено.",
    speichern: "Зберегти",
    nachholenTipp:
      "Додаткові хвилини доповнюють недосягнуті тижневі мети попередніх тижнів - спершу найстарішу.",
    nachholen: "Надолужити хвилини попередніх тижнів",
    dieseWoche: "Цього тижня:",
    min: "хв",
    keinWochenziel: "без тижневої мети",
    anstehend: (datum: string, minuten: number) => [" - з понеділка ", datum, ": ", minuten, " хв"],
    ueberfaelligTipp:
      "Скидає хвилини для надолуження з попередніх тижнів - із цього тижня відлік тижневої мети починається заново. Час тренування зберігається.",
    ueberfaelligZuruecksetzen: "Скинути хвилини для надолуження",
    zuletztZurueckgesetzt: (ab: string) => ["востаннє скинуто: ", ab],
    erlassenTipp:
      "Вибрані тижні ніколи не вважаються пропущеними чи такими, що їх треба надолужити - незалежно від того, чи позначено їх як тижні з метою. Час тренування зберігається.",
    wochenzielErlassen: "Звільнити від тижневої мети",
    wochenzielFuer: (name: string) => `Тижнева мета: ${name}`,
    uebernehmen: "Застосувати",
    abbrechen: "Скасувати",
    einstellungen: "Налаштування",
    womitAnfangen: "З чого почати?",
    womitTipp:
      "що дитина вже вміє - нижчий рівень повертає назад (після підтвердження); статистика й медалі залишаються.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `Дитина: ${name}. Поточна точка старту: ${label}.\n\n` +
      `Справді повернути до такої точки старту: ${ziel}?\n\n` +
      `Вправи після цього знову обмежаться клавішами до цього місця. Статистика натискань, ` +
      `час тренування і медалі залишаються - якщо згодом знову вибрати вищий рівень, ` +
      `усе буде на місці.\n\n` +
      `Діє з наступного відкриття Tastenflow цією дитиною.`,
    womitName: (name: string) => `З чого почати: ${name}`,
    ausstehend: (name: string) => ["Діє з наступного відкриття Tastenflow (", name, ")."],
    einhandTipp:
      "Великі літери й символи приймаються з будь-якою клавішею Shift (або з клавішею Caps Lock) - правило Shift другою рукою для цієї дитини вимкнено.",
    einhandName: (name: string) => `Друк однією рукою: ${name} - правило Shift другою рукою вимкнено`,
    einhand: "Друк однією рукою",
    tempoTipp:
      "Для цієї дитини швидкість ніде не враховується - у грі немає обмеження часу, у зірок немає мети швидкості, рівень складності не змінюється ні вгору, ні вниз, а час тренування йде далі навіть під час довгих пауз. Для дітей, які друкують уважно, але дуже повільно.",
    tempoName: (name: string) => `Швидкість не важлива: ${name} - швидкість ніде не оцінюється`,
    tempoZaehltNicht: "Швидкість не важлива",
    abstand: "Широкі інтервали (CVI)",
    abstandTipp: `Більший інтервал між КОЖНИМ знаком під час переписування - для дітей з церебральним порушенням зору (CVI), у яких близько розташовані знаки зливаються. «Удвічі» дає вдвічі, «утричі» - утричі, а «учетверо» - учетверо більшу ширину на знак. Під час друку затемнюється все, крім поля, у якому зараз друкують (рядок вправи або ігрове поле); через 5 секунд без натискань усе знову стає світлим. Рядок вправи при цьому плавно рухається до наступного знака зі швидкістю друку дитини - повільно, коли дитина друкує повільно, - а не стрибає. «Звичайний» залишає знаки на звичній відстані й вмикає лише затемнення, плавний рух рядка та рядок читання. Дитина може й сама змінити інтервали у своїх Налаштуваннях (⚙, Alt + O), скільки завгодно разів - а ви можете будь-коли змінити їх тут. Діє те, що вибрано останнім.`,
    abstandName: (name: string) => `Широкі інтервали (CVI): ${name}`,
    listenTitel: "Учні класу з рівнем складності й тижневою метою",
    tastenSr: (sitzen: number, frei: number) => [
      "Впевнені клавіші: ",
      sitzen,
      ", відкриті клавіші: ",
      frei,
      "",
    ],
    bezugBlock: (datum: string) => `у 4 тижнях тренувань із ${datum}`,
    bezugWoche: (datum: string) => `у тижні з ${datum}`,
    gruppePerson: "Особа",
    gruppeStand: "Поступ і час тренування",
    gruppeUeben: "Тренування",
    gruppePruefung: PRUEFUNG_WORT_UK,
    kopfName: "Ім'я",
    kopfStufe: "Рівень складності",
    kopfTasten: "Клавіші",
    kopfNaechste: "Наступні клавіші",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "усі клавіші вивчено" : `далі ${namen.join(", потім ")}`,
    kopfUebezeit: "Час тренування",
    kopfWochenziel: "Тижнева мета",
    kopfWochenziele: "Тижневі мети",
    kopfTreffer: "Точність",
    kopfTempo: "Знаків/хв",
    kopfScore: "Бали",
    uebungszeiten: "Тренування",
    nochKeineUebung: "тренувань ще не зафіксовано",
    uebungszeitenKennzahl: (dauer: string, wochen: number) => `${dauer} - тижні: ${wochen}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " -",
      " ",
      dauer,
      " - дні: ",
      tage,
      "",
      "",
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` - ${erfuellt}/${ziel} хв`,
    periodeMatches: (n: number) => ` - Перегони класу: ${n}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Ще немає Перегонів класу, зіграних до кінця"
        : `Перегони класу, зіграні до кінця: ${n}`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Зараховуються всі Перегони класу в цьому класі, зіграні до кінця - від ${seit}; ` +
      `раніші не записувалися. Дитина: ${name}. ` +
      `Перервані або передчасно покинуті перегони не зараховуються. Перегони зараховуються ` +
      `приблизно через годину після завершення. Лише кількість: без рейтингу, перемоги не ` +
      `рахуються.`,
    kopfKlassenmatch: "Перегони класу",
    klassenmatchOhneZahl: "Перегони класу: немає даних",
    gruppeKlassenmatch: "Перегони класу",
    klassenmatchSpalteHilfe: (seit: string) =>
      `Скільки Перегонів класу зіграно до кінця. Перервані або передчасно покинуті ` +
      `не зараховуються; перемоги не рахуються. Записується ` +
      `від ${seit}. Знак «-» означає: Перегони класу в цьому класі вимкнено ` +
      `або кількість не вдалося завантажити.`,
    wocheHilfe: (pauseMin: number) =>
      `Якщо розгорнути, видно кожне тренування цього тижня: день, час початку й кінця, ` +
      `час тренування і що тренувалося. Час тренування - це лише сам друк: паузи не ` +
      `рахуються, тому він часто коротший за показаний проміжок. Після понад ${pauseMin} хв ` +
      `без натискань починається нове тренування.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} - ${dauer}` : `${tag}, ${von}-${bis} - ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "Моє тренування",
        lektion: "Уроки",
        geschichte: "Історії",
        wortspiel: "Ігри зі словами",
        tippchallenge: PRUEFUNG_WORT_UK,
        klassenmatch: "Перегони класу",
        "eigene-uebung": EIGENE_UEBUNG_LEHRKRAFT_UK,
      })[art],
    wackligeTasten: "Непевні клавіші",
    nochZuWenigGeuebt: "ще замало тренувань",
    zuWenigUmZuSagen: "Для висновків ще замало тренувань.",
    wackligCaption: (name: string) => ["Непевні клавіші: ", name],
    tasteKopf: "Клавіша",
    tasteHilfe: (prozent: number) =>
      `Клавіша ще непевна - спроб щонайменше ${WACKLIG_MIND_ANSCHLAEGE}, правильних натискань менше ніж ${prozentText(prozent, "uk")}.`,
    trefferKopf: "Точність",
    trefferHilfe: "Частка правильних натискань цієї клавіші.",
    tempoKopf: "Швидкість",
    tempoHilfe: "Як швидко цю клавішу натискали останнім часом - натискання цієї клавіші за хвилину.",
    abzeichen: (n: number) => ["Медалі - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_UK} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_UK,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_UK}: ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Налаштування: ",
      name,
      " - ",
      label,
      " -",
      " ",
      zielMin > 0 ? `Тижнева мета: ${zielMin} хв` : "без тижневої мети",
    ],
    eigenstaendigkeit: (n: number) => ["Самостійна робота - підказки:", " ", n, "", ""],
    knopfTipp: (name: string) =>
      `Налаштування та огляд - налаштування, тренування, непевні клавіші та медалі; усе інше є в розділі Мій поступ цієї дитини. Дитина: ${name}.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Згорнути" : "Розгорнути"} налаштування та огляд: ${name}`,
    keinZielGesetzt: "тижневу мету не встановлено",
    keineAbgeschlossene: "ще немає завершеного тижня з метою",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      "Досягнуті тижневі мети: ",
      prozent,
      "%, повні тижні: ",
      ganz,
      "/",
      gesamt,
      "",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => ["повні тижні: ", ganz, "/", gesamt, ""],
    wocheErlassen: "від цього тижня звільнено",
    keineZielwoche: "це не тиждень із метою",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " хв"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " хв, мета: ", nenner, " хв"],
    offenSr: (minuten: number) => `, з них для надолуження з попередніх тижнів: ${minuten} хв`,
    erreichtSr: ", тижневу мету досягнуто",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " хв для надолуження"],
    klasseNichtGespeichert: "Не вдалося зберегти налаштування класу.",
    kinderEingetragen: (n: number) =>
      ` Збережено для: ${ditiUk(n)} - діє з наступного відкриття ` +
      `Tastenflow. Статистика й медалі залишаються.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Точка старту для класу: ${label}. Діє і для тих, хто приєднається пізніше.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `Не вдалося зберегти типову точку старту класу.${kinderSatz}`,
    gesperrtZusatz: " (заблоковано)",
    stufeWaehlen: "Виберіть точку старту",
    vorgabeKlasse: (label: string) => `Типово для класу: ${label}`,
    dieMeisten: (label: string) => `більшість тут: ${label}`,
    bezugKlasse: (name: string) => `класу ${name}`,
    startHinweis:
      "що клас уже вміє - діє для всіх дітей цього класу, також для тих, хто приєднається пізніше",
    startSrHinweis:
      "Перший пункт показує типову точку старту класу і рівень, на якому зараз більшість дітей. " +
      "Вибір рівня зберігає його як типову точку старту класу - вона діє і для тих, хто приєднається пізніше, - " +
      "і записує її дітям, які вже є в класі; якщо хтось уже далі, програма спершу запитає. " +
      "Діє для кожної дитини з наступного відкриття Tastenflow; статистика й медалі залишаються.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Рік навчання видалено. Знову діє типове значення (${vorgabe}).`,
    schulstufeErwachsen: (label: string) =>
      `Рік навчання: дорослі. Тексти тепер для дорослих (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Рік навчання: ${schulstufeAnzeigeUk(wert)}. Тексти тепер відповідають віку ` +
      `(${label}).`,
    spracheDerKlasse: (sprache: string) => `Мова класу: ${sprache}.`,
    spracheGesperrt: "Мову для учнів цього класу заблоковано.",
    spracheFrei: "Мову знову можна вибирати вільно.",
    matchNichtUmgestellt: "Не вдалося змінити налаштування Перегонів класу.",
    matchErlaubt: "Перегони класу для цього класу дозволено.",
    matchAus: "Перегони класу для цього класу вимкнено.",
    zeilenEndeAn:
      "Тепер кожен рядок завершується клавішею Enter - для всіх учнів цього класу.",
    zeilenEndeAus: "Кінець рядка клавішею Enter для цього класу вимкнено.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `Навчальний рік цього класу тепер починається першого дня місяця: ${monat}.`,
    schreibweiseGesetzt: (label: string) => `Правопис: ${label} - для всіх учнів цього класу.`,
    schreibweiseAutoLabel: "автоматично",
    schreibweiseGbLabel: "британський",
    schreibweiseUsLabel: "американський",
    startFrageTitel: "Точка старту для всього класу",
    frageVor: (_n: number) => ["Далі за вибрану точку старту", ":", " "],
    frageStark: (n: number) => [
      n,
      " ",
      mehrzahl(n, "uk", { one: () => "дитина", few: () => "дитини", many: () => "дітей", other: () => "дитини" }),
    ],
    frageNach: (_n: number) => [
      ".",
      " Справді встановити цю точку старту для всього класу?",
    ],
    detailVor: "Вибрано: ",
    detailNach: (namen: string) => [
      ". Уже далі:",
      " ",
      namen,
      ". Повернення назад прибирає вже пройдений матеріал - статистика натискань, час тренування і медалі залишаються в будь-якому разі. Діє для кожної дитини з наступного відкриття Tastenflow.",
    ],
    alleEinstufen: "Встановити для всього класу",
    nurNochNicht: "Лише для тих, хто ще не дійшов сюди",
    startZurueck: (name: string, label: string) =>
      `Повернено до такої точки старту: ${label}. Дитина: ${name}. Діє з наступного відкриття Tastenflow. ` +
      `Статистика й медалі залишаються.`,
    startpunktVon: (name: string, label: string) => `Точка старту - ${name}: ${label}.`,
    wochenzielNichtGespeichert: (name: string) =>
      `Не вдалося зберегти тижневу мету. Дитина: ${name}.`,
    wochenzielGespeichert: (name: string) => `Тижневу мету збережено: ${name}.`,
    ueberfaelligFrage: (name: string) =>
      `Скинути хвилини для надолуження? Дитина: ${name}.\n\n` +
      `Накопичені досі хвилини для надолуження буде видалено; із цього тижня відлік ` +
      `тижневої мети починається заново. Час тренування і статистика залишаються.`,
    ueberfaelligErledigt: (name: string) => `Хвилини для надолуження скинуто: ${name}.`,
    erlasseneGespeichert: "Тижні зі звільненням збережено.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Тижнева мета (${minutenUk(minuten)})` : "Без тижневої мети"} - збережено: ${ok}/${gesamt}; почне діяти в понеділок, ` +
      `${naechsterMontagUk(jetztMs)}, о 8:00.`,
    klassenZielFehler: (namen: string) =>
      ` Не вдалося для: ${namen} - спробуйте ще раз.`,
    sperreNichtAufgehoben: "Не вдалося зняти паузу.",
    sperreAufgehoben:
      "Паузу знято - час тренування знову зараховується до тижневої мети.",
    stundeNichtGesperrt: "Не вдалося поставити мету на паузу.",
    gesperrtBisStatus: (zeit: string) =>
      `Тижнева мета класу на паузі до ${zeit} - ` +
      `час тренування і статистика рахуються далі, на паузі лише тижнева мета.`,
    stundeGesperrt: "Мету поставлено на паузу на 1 годину.",
    excelLaeuft: "Файл Excel створюється - хвилинку.",
    excelFertig: (datei: string) =>
      `Завантажено: ${datei} - з оглядом, легендою і чотирма аркушами: навчальний рік, від початку, місяць і тиждень.`,
    excelFehler:
      "Не вдалося створити файл Excel. Спробуйте ще раз; " +
      "якщо це повторюється, повідомте про це.",
    laedt: "Завантаження...",
    lesefehlerStark: "Не вдалося прочитати поступ",
    lesefehlerFuer: (namen: string) => [
      " для таких дітей:",
      " ",
      namen,
      ". Тому числа в цих рядках порожні і ",
    ],
    lesefehlerNicht: "не означають",
    lesefehlerSchluss:
      ", що тренування не було. Оновіть сторінку; якщо це повторюється, повідомте про це.",
    aufgabenGruppe: "Завдання для класу",
    tippchallengeTipp:
      "Відкриває Виклик для всього класу: виберіть текст і тривалість - потім тут же будуть і результати.",
    tippchallenge: PRUEFUNG_WORT_UK,
    eigeneUebungTipp:
      "Призначає класу доданий файл як текст для вправи - кожна дитина тренує його зі своєю швидкістю; нові клавіші цим не відкриваються.",
    eigeneUebung: EIGENE_UEBUNG_LEHRKRAFT_UK,
    wochenzielTipp:
      "Визначає, скільки хвилин на тиждень клас тренується - для кожної дитини окремо або для всіх одразу.",
    zielStatusMin: (minuten: string) => `${minuten} хв`,
    zielGesetzt: "встановлено",
    keinZiel: "без мети",
    einstellungenTipp:
      "Налаштуйте для всього класу: рік навчання, мову, точку старту й Перегони класу.",
    einstellungenDerKlasse: "Налаштування класу",
    sperreBeendenTipp:
      "Одразу знімає паузу - час тренування знову зараховується до тижневої мети.",
    sperrenTipp:
      "Ставить тижневу мету на паузу на 60 хвилин для всього класу. Тренуватися можна далі - час тренування і статистика рахуються далі, на паузі лише тижнева мета.",
    gesperrtBisKnopf: (zeit: string) => `На паузі до ${zeit} - зняти паузу`,
    stundeSperren: "Пауза на 1 годину",
    wochenzielAufgabe: "Тижнева мета - завдання",
    zielFuerKlasseGesetzt: "- встановлено для дітей цього класу",
    nochKeinZielGesetzt: "- мету ще не встановлено",
    minutenZuerst: "Спочатку введіть хвилини на тиждень (від 0 до 600).",
    klassenZielTipp:
      "Встановлює цю тижневу мету з наступного тижня для кожної дитини цього класу - також для тих, хто приєднається пізніше. Мету, встановлену окремим дітям, буде замінено.",
    fuerKlasseUebernehmen: "Застосувати до класу",
    wochenzielFuerKlasse: (bezeichnung: string) => `Тижнева мета: ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Завантажити в Excel: завантажує таблицю як файл Excel ` +
      `${datei} - спочатку огляд із легендою, ` +
      `потім чотири аркуші: поточний навчальний рік, від початку, місяць (останні ` +
      `4 тижні) і цей тиждень, незалежно від вибраного тут періоду.`,
    alsExcel: "Завантажити в Excel",
    schulstufeKind: "Рік навчання",
    schulstufeKindName: (name: string) => `Рік навчання: ${name}`,
    wieDieKlasse: (klasse: string) => `як у класі (${klasse})`,
    schulstufeKindTipp:
      "Лише для цієї дитини: рік навчання визначає тексти й замінює налаштування класу. Він сам зростає щороку. Варіант «як у класі» скасовує цей виняток.",
    schulstufeKindGesetzt: (name: string, stufe: string) => `Тексти тепер відповідають року навчання: ${stufe}. Дитина: ${name}.`,
    schulstufeKindErwachsen: (name: string) => `Тексти тепер для дорослих. Дитина: ${name}.`,
    schulstufeKindWieKlasse: (name: string) => `Тексти тепер знову як у класі. Дитина: ${name}.`,
  },
  en: {
    zielNeu: (minuten: number, jetztMs: number) =>
      `The new goal of ${minutenEn(Math.round(minuten))} per week applies from 8am on Monday ` +
      `${naechsterMontagEn(jetztMs)}. Until then, the current goal stays in place.`,
    keinZielMehr: (jetztMs: number) =>
      `From 8am on Monday ${naechsterMontagEn(jetztMs)}, there will be no weekly goal. ` +
      `Until then, the current goal stays in place.`,
    klassenZiel: (anzahlKinder: number, minuten: number, jetztMs: number) => {
      const wer =
        anzahlKinder === 1
          ? minuten > 0
            ? `The one pupil in this class gets ${minutenEn(minuten)} per week.`
            : "The one pupil in this class will no longer have a weekly goal."
          : minuten > 0
            ? `All ${anzahlKinder} pupils get ${minutenEn(minuten)} per week.`
            : `All ${anzahlKinder} pupils will no longer have a weekly goal.`;
      return (
        `${wer} This applies from 8am on Monday ${naechsterMontagEn(jetztMs)} - until then, ` +
        `the current goal stays in place. Goals set for individual pupils will be replaced. ` +
        (minuten > 0
          ? "Pupils who join later get this goal too."
          : "Pupils who join later won't get one either.")
      );
    },
    wochenziel: "Weekly goal",
    minutenProWoche: "Minutes per week",
    nullKeinZiel: "0 = no weekly goal.",
    zielKalenderwochen: "Goal weeks",
    speichernTipp: (name: string) =>
      `Saves the minutes, goal weeks and catch-up setting for ${name} together - after asking you to confirm. The change applies from next week.`,
    nichtsGeaendert: "Nothing has changed in the weekly goal - it is already saved.",
    speichern: "Save",
    nachholenTipp:
      "Extra minutes practised fill up unmet weekly goals from earlier weeks - the oldest first.",
    nachholen: "Catch up on missed minutes from previous weeks",
    dieseWoche: "This week:",
    min: "min",
    keinWochenziel: "no weekly goal",
    anstehend: (datum: string, minuten: number) => [" · from Mon ", datum, ": ", minuten, " min"],
    ueberfaelligTipp:
      "Clears what is still outstanding from earlier weeks - from this week on, the weekly goal starts afresh. The time practised is kept.",
    ueberfaelligZuruecksetzen: "Clear overdue minutes",
    zuletztZurueckgesetzt: (ab: string) => ["last cleared from ", ab],
    erlassenTipp:
      "The weeks you choose never count as missed or as minutes to catch up - whether or not they are ticked as goal weeks. The time practised is kept.",
    wochenzielErlassen: "Excuse weeks",
    wochenzielFuer: (name: string) => `Weekly goal for ${name}`,
    uebernehmen: "Apply",
    abbrechen: "Cancel",
    einstellungen: "Settings",
    womitAnfangen: "Where to start",
    womitTipp:
      "What this pupil can already do - a lower stage moves them back (after a confirmation); statistics and badges are kept.",
    zurueckstufenFrage: (name: string, label: string, ziel: string) =>
      `${name} is at “${label}”.\n\n` +
      `Really move ${name} back to “${ziel}”?\n\n` +
      `From then on, the exercises only go up to that stage again. Keystroke statistics, ` +
      `practice time and badges are kept - if you move ${name} up again later, ` +
      `they will all still be there.\n\n` +
      `This takes effect the next time ${name} opens Tastenflow.`,
    womitName: (name: string) => `Where ${name} starts`,
    ausstehend: (name: string) => ["Takes effect the next time ", name, " opens Tastenflow."],
    einhandTipp:
      "Capital letters and symbols are accepted with either Shift key (or Caps Lock) - the opposite-hand Shift rule is off for this pupil.",
    einhandName: (name: string) => `One-handed typing for ${name}: opposite-hand Shift rule off`,
    einhand: "One-handed typing",
    tempoTipp:
      "For this pupil, speed doesn't count anywhere - no time limit in the game, no speed goal for the stars, no change in the difficulty level because of speed, and practice time keeps counting even during long pauses. For pupils who type carefully but very slowly.",
    tempoName: (name: string) => `Take your time for ${name}: speed is not assessed anywhere`,
    tempoZaehltNicht: "Take your time",
    abstand: "Wide letter spacing (CVI)",
    abstandTipp:
      "More space between EVERY character while copying the text - for pupils with cerebral visual impairment (CVI), for whom characters that stand close together run into each other. “Double” gives each character twice its usual width, “triple” three times and “four times” four times. While the pupil types, everything except the field they are typing in (the practice line or the game area) is dimmed; after 5 seconds without typing it turns bright again. The practice line glides to the next character at the pupil's own typing pace - slowly for a slow typist - instead of jumping. “Simple” leaves the characters at their usual spacing and only switches on the dimming, the gliding line and the reading line. The pupil can also change the spacing in their own settings (the cog, Alt + O) as often as they like - and you can change it back here at any time. Whichever was chosen last applies.",
    schulstufeKind: "Year group",
    schulstufeKindName: (name: string) => `Year group of ${name}`,
    wieDieKlasse: (klasse: string) => `same as the class (${klasse})`,
    schulstufeKindTipp:
      "Only for this pupil: the year group decides which texts they get and replaces the year group of the class. It moves up by itself every school year. “Same as the class” removes the exception again.",
    schulstufeKindGesetzt: (name: string, stufe: string) =>
      `${name} now gets texts for ${stufe}.`,
    schulstufeKindErwachsen: (name: string) => `${name} now gets texts for adults.`,
    schulstufeKindWieKlasse: (name: string) => `${name} gets the class texts again.`,
    abstandName: (name: string) => `Wide letter spacing (CVI) for ${name}`,
    listenTitel: "Pupils in the class with their progress and weekly goal",
    tastenSr: (sitzen: number, frei: number) => [
      sitzen,
      " of ",
      frei,
      " unlocked keys mastered",
    ],
    bezugBlock: (datum: string) => `the 4 practice weeks from ${datum}`,
    bezugWoche: (datum: string) => `the week of ${datum}`,
    gruppePerson: "Pupil",
    gruppeStand: "Progress and practice time",
    gruppeUeben: "Practice",
    gruppePruefung: "Challenge",
    kopfName: "Name",
    kopfStufe: "Difficulty level",
    kopfTasten: "Keys",
    kopfNaechste: "Next keys",
    naechsteSr: (namen: string[]) =>
      namen.length === 0 ? "all keys learnt" : `next ${namen.join(", then ")}`,
    kopfUebezeit: "Practice time",
    kopfWochenziel: "Weekly goal",
    kopfWochenziele: "Weekly goals",
    kopfTreffer: "Accuracy",
    kopfTempo: "Keystrokes/min",
    kopfScore: "Score",
    uebungszeiten: "Practice times",
    nochKeineUebung: "no practice recorded yet",
    uebungszeitenKennzahl: (dauer: string, wochen: number) =>
      `${dauer} · ${mehrzahl(wochen, "en", { one: (z) => `${z} week`, other: (z) => `${z} weeks` })}`,
    periode: (von: string, bis: string, dauer: string, tage: number) => [
      von,
      " - ",
      bis,
      " · ",
      dauer,
      " · on ",
      mehrzahl(tage, "en", { one: (z) => `${z} day`, other: (z) => `${z} days` }),
    ],
    periodeZiel: (erfuellt: number, ziel: number) => ` · ${erfuellt} of ${ziel} min`,
    periodeMatches: (n: number) => ` · ${n} Class Match${n === 1 ? "" : "es"}`,
    klassenmatchZaehler: (n: number) =>
      n === 0
        ? "Hasn't played a Class Match to the end yet"
        : `Has played ${mehrzahl(n, "en", {
            one: (z) => `${z} Class Match`,
            other: (z) => `${z} Class Matches`,
          })} to the end`,
    klassenmatchZaehlerHilfe: (name: string, seit: string) =>
      `Counts every Class Match in this class that ${name} played to the end - since ${seit}; ` +
      `Class Matches weren't recorded before that. Matches that were cancelled and ` +
      `matches someone left early don't count. A match is counted about an hour after it ` +
      `ends. Only the number: no ranking, and who won is not counted.`,
    kopfKlassenmatch: "Class Match",
    klassenmatchOhneZahl: "Class Match: no figure available",
    gruppeKlassenmatch: "Class Match",
    klassenmatchSpalteHilfe: (seit: string) =>
      `How many Class Matches the pupil played to the end. Cancelled matches and ` +
      `matches someone left early don't count; who won is not counted. Recorded ` +
      `since ${seit}. A dash means: Class Match is switched off for this class, or ` +
      `the number could not be loaded.`,
    wocheHilfe: (pauseMin: number) =>
      `Open it to see every practice time in this week: the day, when it started and ` +
      `ended, the time practised and what was practised. Time practised is pure typing ` +
      `time - pauses don't count, so it is often shorter than start to end. After more ` +
      `than ${pauseMin} minutes without typing, a new practice time begins.`,
    sitzung: (tag: string, von: string, bis: string, bisTag: string | null, dauer: string) =>
      bisTag ? `${tag}, ${von} - ${bisTag}, ${bis} · ${dauer}` : `${tag}, ${von}-${bis} · ${dauer}`,
    uebungsart: (art: Uebungsart) =>
      ({
        training: "My training",
        lektion: "Lessons",
        geschichte: "Stories",
        wortspiel: "Word games",
        tippchallenge: PRUEFUNG_WORT_EN,
        klassenmatch: "Class Match",
        "eigene-uebung": EIGENE_UEBUNG_WORT_EN,
      })[art],
    wackligeTasten: "Wobbly keys",
    nochZuWenigGeuebt: "not practised enough yet",
    zuWenigUmZuSagen: "Not enough practice yet to tell.",
    wackligCaption: (name: string) => ["Wobbly keys for ", name],
    tasteKopf: "Key",
    tasteHilfe: (prozent: number) =>
      `A key that isn't secure yet - it came up at least ${WACKLIG_MIND_ANSCHLAEGE} times and was typed correctly less than ${prozentText(prozent, "en")} of the time.`,
    trefferKopf: "Accuracy",
    trefferHilfe: "How often this key has been typed correctly so far.",
    tempoKopf: "Speed",
    tempoHilfe: "How quickly this one key has been typed lately - keystrokes of this key per minute.",
    abzeichen: (n: number) => ["Badges - ", n],
    tippchallenges: (n: number) => [`${PRUEFUNG_WORT_MEHRZAHL_EN} - `, n],
    challengesTitel: PRUEFUNG_WORT_MEHRZAHL_EN,
    challengesBeschriftung: (name: string) => `${PRUEFUNG_WORT_MEHRZAHL_EN} by ${name}`,
    einstellungenFuer: (name: string, label: string, zielMin: number) => [
      "Settings for ",
      name,
      " - ",
      label,
      " · ",
      zielMin > 0 ? `weekly goal ${zielMin} min` : "no weekly goal",
    ],
    eigenstaendigkeit: (n: number) => [
      "Independent work - ",
      mehrzahl(n, "en", { one: (z) => `${z} indicator`, other: (z) => `${z} indicators` }),
    ],
    knopfTipp: (name: string) =>
      `Settings and results for ${name} - settings, practice times, wobbly keys and badges; for everything else, see ${name}'s “My statistics”.`,
    knopfName: (name: string, offen: boolean) =>
      `${offen ? "Collapse" : "Expand"} settings and results for ${name}`,
    keinZielGesetzt: "no weekly goal set",
    keineAbgeschlossene: "no goal week finished yet",
    prozentSr: (prozent: number, ganz: number, gesamt: number) => [
      prozent,
      " per cent of weekly goals done, met in full in ",
      ganz,
      " of ",
      gesamt,
      " weeks",
    ],
    prozentSichtbar: (ganz: number, gesamt: number) => [ganz, "/", gesamt, " weeks in full"],
    wocheErlassen: "this week was excused",
    keineZielwoche: "not a goal week",
    wocheSichtbar: (zaehler: number, nenner: number) => [zaehler, "/", nenner, " min"],
    wocheSr: (zaehler: number, nenner: number) => [zaehler, " of ", nenner, " minutes"],
    offenSr: (minuten: number) => `, plus ${minutenEn(minuten)} to catch up from earlier weeks`,
    erreichtSr: ", weekly goal reached",
    offenSichtbar: (minuten: number) => ["+ ", minuten, " min to catch up"],
    klasseNichtGespeichert: "The class setting could not be saved.",
    kinderEingetragen: (n: number) =>
      ` Set for ${kinderEn(n)} - it takes effect the next time Tastenflow is opened. ` +
      `Statistics and badges are kept.`,
    startGilt: (label: string, kinderSatz: string) =>
      `Starting point “${label}” now applies to the class - including pupils who join later.${kinderSatz}`,
    vorgabeNichtGespeichert: (kinderSatz: string) =>
      `The class setting could not be saved.${kinderSatz}`,
    gesperrtZusatz: " (locked)",
    stufeWaehlen: "Choose a starting point",
    vorgabeKlasse: (label: string) => `class setting: “${label}”`,
    dieMeisten: (label: string) => `most pupils are at “${label}”`,
    bezugKlasse: (name: string) => `class ${name}`,
    // ★ Mit Schlusspunkt: `KlassenEinstellungsFelder` hängt `startSrHinweis`
    //   mit einem Leerzeichen dahinter (im Deutschen fehlt der Punkt - dort
    //   bleibt es, wie es ist).
    startHinweis:
      "What the class can already do - applies to all pupils in this class, including those who join later.",
    startSrHinweis:
      "The first entry names the class setting and the stage most pupils are at right now. " +
      "Choosing a stage saves it as the class setting - it also applies to pupils who join later - " +
      "and sets it for the pupils already in the class; if some are already further on, the app asks first. " +
      "Takes effect as soon as a pupil next opens Tastenflow; statistics and badges are kept.",
    schulstufeEntfernt: (vorgabe: string) =>
      `Year group removed. The default text age group applies again: ${vorgabe}.`,
    schulstufeErwachsen: (label: string) =>
      `Year group: Adults. The texts are now suitable for adults (${label}).`,
    schulstufeGesetzt: (wert: number, label: string) =>
      `Year group: ${schulstufeLabelEn(wert)}. The texts are now suitable for ${label}.`,
    spracheDerKlasse: (sprache: string) => `Practice language of the class: ${sprache}.`,
    spracheGesperrt: "The language is now locked for the pupils in this class.",
    spracheFrei: "Pupils can choose the language themselves again.",
    matchNichtUmgestellt: "Class Match could not be changed.",
    matchErlaubt: "Class Match is now allowed for this class.",
    matchAus: "Class Match is now switched off for this class.",
    // ★ Finish each line with Enter (23.09.2026).
    zeilenEndeAn:
      "Every line is now finished with the Enter key - for all pupils in this class.",
    zeilenEndeAus: "Finishing each line with Enter is now switched off for this class.",
    schuljahrBeginnGesetzt: (monat: string) =>
      `The school year for this class now starts on 1 ${monat}.`,
    // ★ E9 (24.09.2026, Bauplan §8.2).
    schreibweiseGesetzt: (label: string) => `Spelling: ${label} - for all pupils in this class.`,
    schreibweiseAutoLabel: "automatic",
    schreibweiseGbLabel: "British",
    schreibweiseUsLabel: "American",
    startFrageTitel: "Starting point for the whole class",
    frageVor: (_n: number) => ["In your class, "],
    frageStark: (n: number) => [n, " ", n === 1 ? "pupil" : "pupils"],
    frageNach: (n: number) => [
      " ",
      n === 1 ? "is" : "are",
      " already further on than the stage you chose. Do you really want to set the whole class to this starting point?",
    ],
    detailVor: "Chosen: ",
    detailNach: (namen: string) => [
      ". Already further on: ",
      namen,
      ". Moving a pupil back takes away practice material they already have - keystroke statistics, practice time and badges are kept in every case. Takes effect as soon as a pupil next opens Tastenflow.",
    ],
    alleEinstufen: "Set for everyone",
    nurNochNicht: "Only those who aren't that far yet",
    startZurueck: (name: string, label: string) =>
      `${name} will be moved back to “${label}” - this takes effect the next time they open Tastenflow. ` +
      `Statistics and badges are kept.`,
    startpunktVon: (name: string, label: string) => `Starting point for ${name}: “${label}”.`,
    wochenzielNichtGespeichert: (name: string) =>
      `The weekly goal for ${name} could not be saved.`,
    wochenzielGespeichert: (name: string) => `Weekly goal for ${name} saved.`,
    ueberfaelligFrage: (name: string) =>
      `Clear ${name}'s overdue minutes?\n\n` +
      `Everything still outstanding up to now is removed; from this week on, the weekly goal ` +
      `starts afresh. Time already practised and the statistics are kept.`,
    ueberfaelligErledigt: (name: string) => `${name}'s overdue minutes cleared.`,
    erlasseneGespeichert: "Excused weeks saved.",
    klassenZielGespeichert: (minuten: number, ok: number, gesamt: number, jetztMs: number) =>
      `${minuten > 0 ? `Weekly goal of ${minutenEn(minuten)}` : "No weekly goal"} saved for ${ok} of ` +
      `${kinderEn(gesamt)} - it applies from 8am on Monday ${naechsterMontagEn(jetztMs)}.`,
    klassenZielFehler: (namen: string) => ` It did not work for ${namen} - please try again.`,
    sperreNichtAufgehoben: "The pause could not be ended.",
    sperreAufgehoben:
      "The pause has ended - time practised counts towards the weekly goal again from now on.",
    stundeNichtGesperrt: "The weekly goal could not be paused.",
    gesperrtBisStatus: (zeit: string) =>
      `Weekly goal paused for the class until ${zeit} - ` +
      `practice time and statistics still count, just not the weekly goal.`,
    stundeGesperrt: "The weekly goal is paused for an hour.",
    excelLaeuft: "The Excel file is being created - one moment, please.",
    excelFertig: (datei: string) =>
      `“${datei}” downloaded - with an overview including a legend, and four sheets: School year, All time, Month and Week.`,
    excelFehler:
      "The Excel file could not be created. Please try again; if it keeps happening, please report it.",
    laedt: "Loading …",
    lesefehlerStark: "The progress could not be read",
    lesefehlerFuer: (namen: string) => [
      " for ",
      namen,
      ". The figures in these rows are therefore empty and do ",
    ],
    lesefehlerNicht: "not",
    lesefehlerSchluss:
      " mean that no practice took place. Please reload the page; if it keeps happening, please report it.",
    aufgabenGruppe: "Tasks for the class",
    // ★ Der deutsche Hinweis nennt noch den Zeitzuschlag - den gibt es seit
    //   10.09.2026 nicht mehr (Glossar §3.7). Englisch darum nur, was es gibt.
    tippchallengeTipp:
      "Opens the challenge for the whole class: choose the key range and the time limit - the results appear here afterwards too.",
    tippchallenge: PRUEFUNG_WORT_EN,
    eigeneUebungTipp:
      "Assigns an uploaded file to the class as a set text - every pupil practises it at their own pace; it doesn't unlock any new keys.",
    eigeneUebung: EIGENE_UEBUNG_WORT_EN,
    wochenzielTipp:
      "Sets how many minutes the class should practise each week - for each pupil individually or for everyone at once.",
    zielStatusMin: (minuten: string) => `${minuten} min`,
    zielGesetzt: "set",
    keinZiel: "no goal",
    einstellungenTipp:
      "Set the year group, language, starting point and Class Match for the whole class.",
    einstellungenDerKlasse: "Class settings",
    sperreBeendenTipp:
      "Ends the pause straight away - from then on, time practised counts towards the weekly goal again.",
    sperrenTipp:
      "Pauses the weekly goal for 60 minutes, for the whole class. Pupils still practise - practice time and statistics keep counting, just not the weekly goal.",
    gesperrtBisKnopf: (zeit: string) => `Paused until ${zeit} - end the pause`,
    stundeSperren: "Pause goal for 1 hour",
    wochenzielAufgabe: "Weekly goal - task",
    zielFuerKlasseGesetzt: "· set for pupils in this class",
    nochKeinZielGesetzt: "· no goal set yet",
    minutenZuerst: "Enter the minutes per week first - 0 to 600.",
    klassenZielTipp:
      "Sets this weekly goal from next week for every pupil in this class - including pupils who join later. Goals set for individual pupils will be replaced.",
    fuerKlasseUebernehmen: "Apply to the class",
    wochenzielFuerKlasse: (bezeichnung: string) => `Weekly goal for ${bezeichnung}`,
    excelTipp: (datei: string) =>
      `Download as Excel: downloads the table as the Excel file “${datei}” - an overview ` +
      `with a legend at the front, then four sheets: the current school year, all time, ` +
      `the month (the last 4 weeks) and this week, whichever period is chosen here.`,
    alsExcel: "Download as Excel",
  },
});

type ReiterTexte = (typeof REITER_TEXTE)["de"];

/** Die Texte der Ansicht in der Bedienungssprache - EIN Haken für jedes Bauteil dieser Datei. */
// ★ E11a-3 (26.09.2026): `sprache` kommt jetzt aus `spracheGewaehlt` - der
// WIRKLICHEN Sprachwahl, nicht mehr aus der auf „de"/„en" gekappten
// `sprache` von `useBedienSprache()`. Möglich, weil diese Datei seit E11a
// (`REITER_TEXTE.fr`) und E11a-3 (dieser Umbau) jede Stelle kennt, die
// „fr" braucht - siehe `BEFUND-2026-09-26-E11A3-OBERFLAECHE-BAUTEILE.md`.
/** Tastenname in der Sprache der Oberfläche - EINE Tabelle für alle Stellen im
 *  Reiter (Weichen-Zähler, Bauplan französisch §2.3). */
const TASTEN_NAME_JE_SPRACHE: Record<BedienSprache, (unit: string) => string> = {
  de: unitLabel,
  en: unitLabelEn,
  fr: unitLabelFr,
  es: unitLabelEs,
  it: unitLabelIt,
  pl: unitLabelPl,
  tr: unitLabelTr,
  cs: unitLabelCs,
  bg: unitLabelBg,
  el: unitLabelEl,
  hu: unitLabelHu,
  nl: unitLabelNl,
  pt: unitLabelPt,
  br: unitLabelBr,
  ro: unitLabelRo,
  sv: unitLabelSv,
  uk: unitLabelUk,
};
function tastenNameIn(unit: string, sprache: BedienSprache): string {
  return TASTEN_NAME_JE_SPRACHE[sprache](unit);
}

function useReiterTexte(): { t: ReiterTexte; sprache: BedienSprache } {
  const { spracheGewaehlt } = useBedienSprache();
  return { t: REITER_TEXTE[spracheGewaehlt], sprache: spracheGewaehlt };
}

/**
 * ★★ EN6a (19.09.2026): DIE GRÜNDE DES EIGENSTÄNDIGKEITS-CHECKS ENGLISCH.
 *
 * `suspicionScore` (`lib/typing/account.ts`) liefert fertige deutsche Sätze -
 * sie werden beim Rechnen der Statistik gebaut, lange bevor eine Sprache
 * feststeht. Übersetzt wird darum HIER, an der einen Stelle, die sie der
 * Lehrkraft zeigt (Namenszeile und aufgeklappte Zeile), Satz für Satz nach
 * ihrem festen Muster. ⚠️ Wer in `suspicionScore` einen Satz ändert oder
 * ergänzt, ergänzt ihn hier - der Wächter
 * `tests/tastenflow-englisch-lehrkraft-ansicht.test.tsx` rechnet jeden Satz
 * einmal durch. Ein unbekannter Satz liefert `null` und bleibt deutsch (in
 * der Liste in `lang="de"`, damit die Sprachausgabe ihn deutsch liest).
 * Glossar §3.8: *independent work*; nie gegen das Kind (§1.4).
 */
export function eigenstaendigkeitsGrundEn(grund: string): string | null {
  if (grund === "Noch zu wenige Daten.") return "Not enough data yet.";
  if (grund === "Unauffällig.") return "Nothing unusual.";
  if (grund === "Makellose Genauigkeit bei hohem Tempo, kein Lernverlauf.")
    return "Flawless accuracy at high speed, with no learning curve.";
  let m = /^(\d+)× Einfügen \(Paste\) erkannt\.$/.exec(grund);
  if (m)
    return Number(m[1]) === 1 ? "Pasted text detected once." : `Pasted text detected ${m[1]} times.`;
  m =
    /^In (\d+) (?:Zeile|Zeilen) kamen Tasten von einem Programm im Browser statt von der Tastatur \(ein Skript oder eine Browser-Erweiterung - auch eine Bildschirmtastatur als Erweiterung kann das auslösen\)\.$/.exec(
      grund,
    );
  if (m)
    return (
      `In ${m[1]} ${Number(m[1]) === 1 ? "line" : "lines"}, keys came from a program in the ` +
      `browser rather than from the keyboard (a script or a browser extension - an on-screen ` +
      `keyboard installed as an extension can cause this too).`
    );
  m = /^Häufiger Fokus-\/Fensterwechsel \((\d+) %\)\.$/.exec(grund);
  if (m) return `Frequent switching of focus or window (${m[1]}%).`;
  m = /^Sehr viele unplausibel schnelle Übungen \((\d+) %\)\.$/.exec(grund);
  if (m) return `A very large number of implausibly fast exercises (${m[1]}%).`;
  return null;
}

/**
 * ★ E11a-3 (26.09.2026): dieselben Gründe französisch - Satz für Satz nach
 * demselben festen Muster wie {@link eigenstaendigkeitsGrundEn}. Ein
 * unbekannter Satz liefert `null` und bleibt deutsch (siehe dort).
 */
export function eigenstaendigkeitsGrundFr(grund: string): string | null {
  if (grund === "Noch zu wenige Daten.") return "Pas encore assez de données.";
  if (grund === "Unauffällig.") return "Rien à signaler.";
  if (grund === "Makellose Genauigkeit bei hohem Tempo, kein Lernverlauf.")
    return "Précision irréprochable à vitesse élevée, sans réelle progression.";
  let m = /^(\d+)× Einfügen \(Paste\) erkannt\.$/.exec(grund);
  if (m)
    return Number(m[1]) === 1
      ? "Un collage (paste) détecté."
      : `Un collage (paste) détecté ${m[1]} fois.`;
  m =
    /^In (\d+) (?:Zeile|Zeilen) kamen Tasten von einem Programm im Browser statt von der Tastatur \(ein Skript oder eine Browser-Erweiterung - auch eine Bildschirmtastatur als Erweiterung kann das auslösen\)\.$/.exec(
      grund,
    );
  if (m)
    return (
      `Sur ${m[1]} ${Number(m[1]) === 1 ? "ligne" : "lignes"}, des touches sont arrivées d'un ` +
      `programme du navigateur plutôt que du clavier (un script ou une extension de navigateur - ` +
      `un clavier virtuel installé comme extension peut aussi en être la cause).`
    );
  m = /^Häufiger Fokus-\/Fensterwechsel \((\d+) %\)\.$/.exec(grund);
  if (m) return `Changements fréquents de fenêtre ou de focus (${m[1]} %).`;
  m = /^Sehr viele unplausibel schnelle Übungen \((\d+) %\)\.$/.exec(grund);
  if (m) return `Un très grand nombre d'exercices anormalement rapides (${m[1]} %).`;
  return null;
}

/**
 * ★ O-IT (02.10.2026): dieselben Gründe italienisch - Satz für Satz nach
 * demselben festen Muster; „lavoro autonomo", nie gegen das Kind (Glossar
 * §2.6, Regel 7). Ein unbekannter Satz liefert `null` und bleibt deutsch.
 */
export function eigenstaendigkeitsGrundIt(grund: string): string | null {
  if (grund === "Noch zu wenige Daten.") return "Ancora troppo pochi dati.";
  if (grund === "Unauffällig.") return "Niente di insolito.";
  if (grund === "Makellose Genauigkeit bei hohem Tempo, kein Lernverlauf.")
    return "Precisione perfetta ad alta velocità, senza un percorso di apprendimento.";
  let m = /^(\d+)× Einfügen \(Paste\) erkannt\.$/.exec(grund);
  if (m)
    return Number(m[1]) === 1
      ? "Testo incollato rilevato una volta."
      : `Testo incollato rilevato ${m[1]} volte.`;
  m =
    /^In (\d+) (?:Zeile|Zeilen) kamen Tasten von einem Programm im Browser statt von der Tastatur \(ein Skript oder eine Browser-Erweiterung - auch eine Bildschirmtastatur als Erweiterung kann das auslösen\)\.$/.exec(
      grund,
    );
  if (m)
    return (
      `In ${m[1]} ${Number(m[1]) === 1 ? "riga" : "righe"} i tasti sono arrivati da un ` +
      `programma nel browser invece che dalla tastiera (uno script o un'estensione del browser - ` +
      `anche una tastiera sullo schermo installata come estensione può causarlo).`
    );
  m = /^Häufiger Fokus-\/Fensterwechsel \((\d+) %\)\.$/.exec(grund);
  if (m) return `Cambi frequenti di focus o di finestra (${m[1]}%).`;
  m = /^Sehr viele unplausibel schnelle Übungen \((\d+) %\)\.$/.exec(grund);
  if (m) return `Moltissimi esercizi troppo veloci per essere plausibili (${m[1]}%).`;
  return null;
}

/**
 * ★ O-PL (02.10.2026): dieselben Gründe polnisch - Satz für Satz nach
 * demselben festen Muster; „samodzielność pracy", nie gegen das Kind (Glossar
 * §2.6). Zahlen nach Doppelpunkt oder in Klammern, damit nichts mitbeugen muss.
 * Ein unbekannter Satz liefert `null` und bleibt deutsch.
 */
export function eigenstaendigkeitsGrundPl(grund: string): string | null {
  if (grund === "Noch zu wenige Daten.") return "Na razie za mało danych.";
  if (grund === "Unauffällig.") return "Nic nietypowego.";
  if (grund === "Makellose Genauigkeit bei hohem Tempo, kein Lernverlauf.")
    return "Bezbłędna dokładność przy wysokim tempie, bez widocznego postępu w nauce.";
  let m = /^(\d+)× Einfügen \(Paste\) erkannt\.$/.exec(grund);
  if (m)
    return Number(m[1]) === 1
      ? "Wykryto wklejenie tekstu jeden raz."
      : `Wykryto wklejenie tekstu, liczba razy: ${m[1]}.`;
  m =
    /^In (\d+) (?:Zeile|Zeilen) kamen Tasten von einem Programm im Browser statt von der Tastatur \(ein Skript oder eine Browser-Erweiterung - auch eine Bildschirmtastatur als Erweiterung kann das auslösen\)\.$/.exec(
      grund,
    );
  if (m)
    return (
      `Wiersze, w których klawisze przyszły od programu w przeglądarce, a nie z klawiatury: ${m[1]} ` +
      `(skrypt albo rozszerzenie przeglądarki - może to też wywołać klawiatura ekranowa ` +
      `zainstalowana jako rozszerzenie).`
    );
  m = /^Häufiger Fokus-\/Fensterwechsel \((\d+) %\)\.$/.exec(grund);
  if (m) return `Częste zmiany fokusu lub okna (${m[1]}%).`;
  m = /^Sehr viele unplausibel schnelle Übungen \((\d+) %\)\.$/.exec(grund);
  if (m) return `Bardzo dużo nieprawdopodobnie szybkich ćwiczeń (${m[1]}%).`;
  return null;
}

/**
 * ★ O-TR (02.10.2026): dieselben Gründe türkisch - Satz für Satz nach demselben
 * festen Muster; "bağımsız çalışma", nie "kopya", nie gegen das Kind (Glossar
 * §2.6). Zahlen nur nach Doppelpunkt oder in Klammern, ohne Endung (Regel 6),
 * Prozent vor der Zahl (Regel 5). Ein unbekannter Satz liefert `null` und bleibt deutsch.
 */
export function eigenstaendigkeitsGrundTr(grund: string): string | null {
  if (grund === "Noch zu wenige Daten.") return "Henüz yeterli veri yok.";
  if (grund === "Unauffällig.") return "Alışılmadık bir şey yok.";
  if (grund === "Makellose Genauigkeit bei hohem Tempo, kein Lernverlauf.")
    return "Yüksek hızda kusursuz doğruluk, öğrenme sürecinde gelişim görünmüyor.";
  let m = /^(\d+)× Einfügen \(Paste\) erkannt\.$/.exec(grund);
  if (m)
    return Number(m[1]) === 1
      ? "Bir kez metin yapıştırma (paste) algılandı."
      : `Metin yapıştırma (paste) algılandı, sayı: ${m[1]}.`;
  m =
    /^In (\d+) (?:Zeile|Zeilen) kamen Tasten von einem Programm im Browser statt von der Tastatur \(ein Skript oder eine Browser-Erweiterung - auch eine Bildschirmtastatur als Erweiterung kann das auslösen\)\.$/.exec(
      grund,
    );
  if (m)
    return (
      `Tuşların klavyeden değil, tarayıcıdaki bir programdan geldiği satır: ${m[1]} ` +
      `(bir betik veya tarayıcı eklentisi - eklenti olarak kurulmuş bir ekran klavyesi ` +
      `de buna yol açabilir).`
    );
  m = /^Häufiger Fokus-\/Fensterwechsel \((\d+) %\)\.$/.exec(grund);
  if (m) return `Sık odak veya pencere değişikliği (%${m[1]}).`;
  m = /^Sehr viele unplausibel schnelle Übungen \((\d+) %\)\.$/.exec(grund);
  if (m) return `Çok sayıda olağan dışı hızlı alıştırma (%${m[1]}).`;
  return null;
}

/**
 * ★ O-CS (03.10.2026): dieselben Gründe tschechisch - Satz für Satz nach
 * demselben festen Muster; „samostatná práce", nie „podvádění", nie gegen das
 * Kind (Glossar §2.6). Zahlen in Klammern oder mit „×", nie am Satzende vor dem
 * Punkt (§4 Falle 4); Prozent mit geschütztem Leerzeichen (Regel 5). Ein
 * unbekannter Satz liefert `null` und bleibt deutsch.
 */
export function eigenstaendigkeitsGrundCs(grund: string): string | null {
  if (grund === "Noch zu wenige Daten.") return "Zatím málo údajů.";
  if (grund === "Unauffällig.") return "Nic neobvyklého.";
  if (grund === "Makellose Genauigkeit bei hohem Tempo, kein Lernverlauf.")
    return "Bezchybná přesnost při vysoké rychlosti, bez viditelného průběhu učení.";
  let m = /^(\d+)× Einfügen \(Paste\) erkannt\.$/.exec(grund);
  if (m) return `Rozpoznané vložení textu (paste): ${m[1]}×.`;
  m =
    /^In (\d+) (?:Zeile|Zeilen) kamen Tasten von einem Programm im Browser statt von der Tastatur \(ein Skript oder eine Browser-Erweiterung - auch eine Bildschirmtastatur als Erweiterung kann das auslösen\)\.$/.exec(
      grund,
    );
  if (m)
    return (
      `Řádky, ve kterých klávesy přišly z programu v prohlížeči, a ne z klávesnice: ${m[1]} ` +
      `(skript nebo rozšíření prohlížeče - může to způsobit i klávesnice na obrazovce ` +
      `nainstalovaná jako rozšíření).`
    );
  m = /^Häufiger Fokus-\/Fensterwechsel \((\d+) %\)\.$/.exec(grund);
  if (m) return `Časté přepínání fokusu nebo okna (${m[1]}\u00A0%).`;
  m = /^Sehr viele unplausibel schnelle Übungen \((\d+) %\)\.$/.exec(grund);
  if (m) return `Velmi mnoho nepravděpodobně rychlých cvičení (${m[1]}\u00A0%).`;
  return null;
}

/**
 * ★ O2-SONST (30.10.2026): die Gründe der neun Sprachen als DATEN, gelesen an denselben festen Mustern wie
 * {@link eigenstaendigkeitsGrundCs}. Wer in `suspicionScore` einen Satz ändert, ändert ihn auch hier.
 */
interface GruendeTexte {
  zuWenig: string;
  unauffaellig: string;
  makellos: string;
  paste: (n: number) => string;
  programm: (n: number) => string;
  fokus: (prozent: string) => string;
  schnell: (prozent: string) => string;
}

function eigenstaendigkeitsGrundAus(t: GruendeTexte): (grund: string) => string | null {
  return (grund) => {
    if (grund === "Noch zu wenige Daten.") return t.zuWenig;
    if (grund === "Unauffällig.") return t.unauffaellig;
    if (grund === "Makellose Genauigkeit bei hohem Tempo, kein Lernverlauf.") return t.makellos;
    let m = /^(\d+)× Einfügen \(Paste\) erkannt\.$/.exec(grund);
    if (m) return t.paste(Number(m[1]));
    m =
    /^In (\d+) (?:Zeile|Zeilen) kamen Tasten von einem Programm im Browser statt von der Tastatur \(ein Skript oder eine Browser-Erweiterung - auch eine Bildschirmtastatur als Erweiterung kann das auslösen\)\.$/.exec(
        grund,
      );
    if (m) return t.programm(Number(m[1]));
    m = /^Häufiger Fokus-\/Fensterwechsel \((\d+) %\)\.$/.exec(grund);
    if (m) return t.fokus(m[1]);
    m = /^Sehr viele unplausibel schnelle Übungen \((\d+) %\)\.$/.exec(grund);
    if (m) return t.schnell(m[1]);
    return null;
  };
}

const GRUENDE_BG: GruendeTexte = {
  zuWenig: "Засега данните са малко.",
  unauffaellig: "Нищо необичайно.",
  makellos: "Безгрешна точност при висока скорост, без видим ход на ученето.",
  paste: (n: number) =>
    mehrzahl(n, "bg", {
      one: (z) => `Разпознато поставяне на текст: ${z} път.`,
      other: (z) => `Разпознато поставяне на текст: ${z} пъти.`,
    }),
  programm: (n: number) =>
    mehrzahl(n, "bg", {
      one: (z) =>
        `Редове, в които клавишите дойдоха от програма в браузъра, а не от клавиатурата: ${z} ` +
        `(скрипт или разширение на браузъра - това може да предизвика и екранна клавиатура, ` +
        `инсталирана като разширение).`,
      other: (z) =>
        `Редове, в които клавишите дойдоха от програма в браузъра, а не от клавиатурата: ${z} ` +
        `(скрипт или разширение на браузъра - това може да предизвика и екранна клавиатура, ` +
        `инсталирана като разширение).`,
    }),
  fokus: (prozent: string) => `Често превключване на фокуса или прозореца (${prozent}%).`,
  schnell: (prozent: string) => `Много неправдоподобно бързи упражнения (${prozent}%).`,
};

const GRUENDE_EL: GruendeTexte = {
  zuWenig: "Τα δεδομένα είναι ακόμα λίγα.",
  unauffaellig: "Τίποτα ασυνήθιστο.",
  makellos: "Τέλεια ακρίβεια σε υψηλή ταχύτητα, χωρίς ορατή πορεία μάθησης.",
  paste: (n: number) =>
    mehrzahl(n, "el", {
      one: (z) => `Αναγνωρίστηκε επικόλληση κειμένου: ${z} φορά.`,
      other: (z) => `Αναγνωρίστηκε επικόλληση κειμένου: ${z} φορές.`,
    }),
  programm: (n: number) =>
    `Γραμμές όπου τα πλήκτρα ήρθαν από πρόγραμμα στο πρόγραμμα περιήγησης και όχι από το πληκτρολόγιο: ${n} ` +
    `(δέσμη ενεργειών ή επέκταση του προγράμματος περιήγησης - αυτό μπορεί να το προκαλέσει και ένα πληκτρολόγιο ` +
    `οθόνης εγκατεστημένο ως επέκταση).`,
  fokus: (prozent: string) => `Συχνή αλλαγή εστίασης ή παραθύρου (${prozent}%).`,
  schnell: (prozent: string) => `Πάρα πολλές ασκήσεις με απίθανα υψηλή ταχύτητα (${prozent}%).`,
};

const GRUENDE_HU: GruendeTexte = {
  zuWenig: "Még kevés az adat.",
  unauffaellig: "Semmi szokatlan.",
  makellos: "Hibátlan pontosság nagy sebességnél, látható tanulási folyamat nélkül.",
  paste: (n: number) =>
    mehrzahl(n, "hu", {
      one: (z) => `Szövegbeillesztés felismerve, ${z} alkalommal.`,
      other: (z) => `Szövegbeillesztés felismerve, ${z} alkalommal.`,
    }),
  programm: (n: number) =>
    mehrzahl(n, "hu", {
      one: (z) =>
        `Sorok, amelyekben a billentyűk egy böngészőben futó programtól érkeztek, nem a billentyűzetről: ${z} ` +
        `(szkript vagy böngészőbővítmény - ezt egy bővítményként telepített képernyő-billentyűzet ` +
        `is okozhatja).`,
      other: (z) =>
        `Sorok, amelyekben a billentyűk egy böngészőben futó programtól érkeztek, nem a billentyűzetről: ${z} ` +
        `(szkript vagy böngészőbővítmény - ezt egy bővítményként telepített képernyő-billentyűzet ` +
        `is okozhatja).`,
    }),
  fokus: (prozent: string) => `Gyakori fókusz- vagy ablakváltás (${prozent}%).`,
  schnell: (prozent: string) => `Nagyon sok valószínűtlenül gyors gyakorlat (${prozent}%).`,
};

const GRUENDE_NL: GruendeTexte = {
  zuWenig: "Nog te weinig gegevens.",
  unauffaellig: "Niets ongebruikelijks.",
  makellos: "Foutloze nauwkeurigheid bij hoge snelheid, zonder zichtbaar leerverloop.",
  paste: (n: number) => `Geplakte tekst herkend: ${n} keer.`,
  programm: (n: number) =>
    mehrzahl(n, "nl", {
      one: (z) => `In ${z} regel`,
      other: (z) => `In ${z} regels`,
    }) +
    " kwamen de toetsen van een programma in de browser en niet van het toetsenbord " +
    "(een script of een browserextensie - ook een schermtoetsenbord als extensie kan dat veroorzaken).",
  fokus: (prozent: string) => `Vaak wisselen van focus of venster (${prozent}%).`,
  schnell: (prozent: string) => `Heel veel onwaarschijnlijk snelle oefeningen (${prozent}%).`,
};

const GRUENDE_PT: GruendeTexte = {
  zuWenig: "Ainda há poucos dados.",
  unauffaellig: "Nada de invulgar.",
  makellos: "Precisão impecável a alta velocidade, sem percurso de aprendizagem visível.",
  paste: (n: number) =>
    mehrzahl(n, "pt", {
      one: (z) => `Texto colado detetado: ${z} vez.`,
      other: (z) => `Texto colado detetado: ${z} vezes.`,
    }),
  programm: (n: number) =>
    mehrzahl(n, "pt", {
      one: (z) => `Em ${z} linha`,
      other: (z) => `Em ${z} linhas`,
    }) +
    ", as teclas vieram de um programa no navegador e não do teclado " +
    "(um script ou uma extensão do navegador - um teclado no ecrã instalado como extensão também pode causar isto).",
  fokus: (prozent: string) => `Mudanças frequentes de foco ou de janela (${prozent}%).`,
  schnell: (prozent: string) => `Muitos exercícios invulgarmente rápidos (${prozent}%).`,
};

const GRUENDE_BR: GruendeTexte = {
  zuWenig: "Ainda há poucos dados.",
  unauffaellig: "Nada incomum.",
  makellos: "Precisão impecável em alta velocidade, sem um percurso de aprendizagem visível.",
  paste: (n: number) =>
    n === 1 ? "Texto colado detectado uma vez." : `Texto colado detectado ${n} vezes.`,
  programm: (n: number) =>
    `Linhas em que as teclas vieram de um programa no navegador, e não do teclado: ${n} ` +
    `(um script ou uma extensão do navegador - um teclado na tela instalado como extensão ` +
    `também pode causar isso).`,
  fokus: (prozent: string) => `Mudanças frequentes de foco ou de janela (${prozent}%).`,
  schnell: (prozent: string) => `Muitos exercícios rápidos demais para serem plausíveis (${prozent}%).`,
};

const GRUENDE_RO: GruendeTexte = {
  zuWenig: "Încă prea puține date.",
  unauffaellig: "Nimic neobișnuit.",
  makellos: "Precizie impecabilă la viteză mare, fără un parcurs vizibil de învățare.",
  paste: (n: number) =>
    mehrzahl(n, "ro", {
      one: () => "Text inserat (paste) detectat o dată.",
      few: (z) => `Text inserat (paste) detectat de ${z} ori.`,
      other: (z) => `Text inserat (paste) detectat de ${z} de ori.`,
    }),
  programm: (n: number) =>
    `Rânduri în care tastele au venit de la un program din browser, nu de la tastatură: ${n} ` +
    `(un script sau o extensie de browser - poate cauza asta și o tastatură de pe ecran ` +
    `instalată ca extensie).`,
  fokus: (prozent: string) => `Schimbări frecvente de focalizare sau de fereastră (${prozent} %).`,
  schnell: (prozent: string) => `Foarte multe exerciții neobișnuit de rapide (${prozent} %).`,
};

const GRUENDE_SV: GruendeTexte = {
  zuWenig: "Än så länge för lite data.",
  unauffaellig: "Inget ovanligt.",
  makellos: "Felfri träffsäkerhet vid hög hastighet, utan synlig inlärningskurva.",
  paste: (n: number) =>
    mehrzahl(n, "sv", {
      one: () => "Inklistrad text upptäcktes en gång.",
      other: (z) => `Inklistrad text upptäcktes ${z} gånger.`,
    }),
  programm: (n: number) =>
    mehrzahl(n, "sv", {
      one: (z) => `På ${z} rad`,
      other: (z) => `På ${z} rader`,
    }) +
    " kom tangenter från ett program i webbläsaren i stället för från tangentbordet " +
    "(ett skript eller ett webbläsartillägg - även ett skärmtangentbord som är installerat som tillägg kan orsaka det).",
  fokus: (prozent: string) => `Täta byten av fokus eller fönster (${prozent} %).`,
  schnell: (prozent: string) => `Mycket många osannolikt snabba övningar (${prozent} %).`,
};

const GRUENDE_UK: GruendeTexte = {
  zuWenig: "Поки що замало даних.",
  unauffaellig: "Нічого незвичного.",
  makellos: "Бездоганна точність за високої швидкості, без видимого поступу в навчанні.",
  paste: (n: number) => `Виявлено вставлення тексту: ${n}×.`,
  programm: (n: number) =>
    `Рядки, у яких клавіші надходили від програми в браузері, а не з клавіатури: ${n} ` +
    `(скрипт або розширення браузера - це може спричинити й екранна клавіатура, ` +
    `встановлена як розширення).`,
  fokus: (prozent: string) => `Часте перемикання фокуса або вікна (${prozent}%).`,
  schnell: (prozent: string) => `Дуже багато неправдоподібно швидких вправ (${prozent}%).`,
};

/** ★ 06.11.2026: dieselben Gründe spanisch (fehlten - Lehrkräfte mit spanischer Bedienung sahen sie deutsch). „trabajo autónomo", nie gegen das Kind. */
const GRUENDE_ES: GruendeTexte = {
  zuWenig: "Todavía hay pocos datos.",
  unauffaellig: "Nada fuera de lo normal.",
  makellos: "Precisión impecable a alta velocidad, sin un proceso de aprendizaje visible.",
  paste: (n: number) => (n === 1 ? "Se detectó un pegado de texto." : `Se detectó un pegado de texto ${n} veces.`),
  programm: (n: number) =>
    `En ${n} ${n === 1 ? "línea" : "líneas"} las teclas llegaron de un programa del navegador y no del teclado ` +
    `(un script o una extensión del navegador - también puede causarlo un teclado en pantalla instalado como extensión).`,
  fokus: (prozent: string) => `Cambios frecuentes de ventana o de foco (${prozent} %).`,
  schnell: (prozent: string) => `Muchísimos ejercicios demasiado rápidos para ser creíbles (${prozent} %).`,
};

/** Die Übersetzung eines Grundes, je Sprache - `null` heisst „unbekannt, bleibt deutsch". */
const EIGENSTAENDIGKEITS_GRUND_JE_SPRACHE: Partial<
  Record<BedienSprache, (grund: string) => string | null>
> = {
  en: eigenstaendigkeitsGrundEn,
  fr: eigenstaendigkeitsGrundFr,
  es: eigenstaendigkeitsGrundAus(GRUENDE_ES),
  it: eigenstaendigkeitsGrundIt,
  pl: eigenstaendigkeitsGrundPl,
  tr: eigenstaendigkeitsGrundTr,
  cs: eigenstaendigkeitsGrundCs,
  bg: eigenstaendigkeitsGrundAus(GRUENDE_BG),
  el: eigenstaendigkeitsGrundAus(GRUENDE_EL),
  hu: eigenstaendigkeitsGrundAus(GRUENDE_HU),
  nl: eigenstaendigkeitsGrundAus(GRUENDE_NL),
  pt: eigenstaendigkeitsGrundAus(GRUENDE_PT),
  br: eigenstaendigkeitsGrundAus(GRUENDE_BR),
  ro: eigenstaendigkeitsGrundAus(GRUENDE_RO),
  sv: eigenstaendigkeitsGrundAus(GRUENDE_SV),
  uk: eigenstaendigkeitsGrundAus(GRUENDE_UK),
};

/** Die Gründe in der Bedienungssprache - unbekannte bleiben, wie sie sind. */
export function gruendeIn(gruende: readonly string[], sprache: BedienSprache): string[] {
  const uebersetze = EIGENSTAENDIGKEITS_GRUND_JE_SPRACHE[sprache];
  return uebersetze ? gruende.map((g) => uebersetze(g) ?? g) : [...gruende];
}

/** „21.09." - Tag.Monat. mit führender Null (dasselbe Format wie `zielAenderungsText`
 *  in `wochenziel.ts`, dort privat - hier nur für die Anzeige gebraucht). */
function fmtDatumKurz(ms: number): string {
  const d = new Date(ms);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.`;
}

/** ★ O2-SONST (30.10.2026): das kurze Datum der neun, Reihenfolge und Trennzeichen aus Intl (hu „09. 21.", sv „21/9", nl „21-9"). */
function datumKurzGebiet(sprache: BedienSprache): (ms: number) => string {
  return (ms) => new Date(ms).toLocaleDateString(GEBIET[sprache], { day: "numeric", month: "numeric" });
}

/** ★ E11a-3: das kurze Datum „anstehend: …" je Bedienungssprache. */
const DATUM_KURZ_JE_SPRACHE: Record<BedienSprache, (ms: number) => string> = {
  de: fmtDatumKurz,
  en: datumKurzEn,
  fr: datumKurzFr,
  es: datumKurzEs,
  it: datumKurzIt,
  pl: datumKurzPl,
  tr: datumKurzTr,
  cs: datumKurzCs,
  bg: datumKurzGebiet("bg"),
  el: datumKurzGebiet("el"),
  hu: datumKurzGebiet("hu"),
  nl: datumKurzGebiet("nl"),
  pt: datumKurzGebiet("pt"),
  br: datumKurzGebiet("br"),
  ro: datumKurzGebiet("ro"),
  sv: datumKurzGebiet("sv"),
  uk: datumKurzGebiet("uk"),
};

/** ★ O2-SONST (30.10.2026): die Blattnamen der neun, nach dem deutschen Namen aus `LEISTUNG_BLAETTER` (die Tabelle dort gehört `lib/typing`). */
export const LEISTUNG_BLATT_NAMEN_NEUN: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  bg: { Schuljahr: "Учебна година", Gesamt: "От началото", Monat: "Месец", Woche: "Седмица" },
  el: { Schuljahr: "Σχολικό έτος", Gesamt: "Από την αρχή", Monat: "Μήνας", Woche: "Εβδομάδα" },
  hu: { Schuljahr: "Tanév", Gesamt: "Kezdettől", Monat: "Hónap", Woche: "Hét" },
  nl: { Schuljahr: "Schooljaar", Gesamt: "Vanaf het begin", Monat: "Maand", Woche: "Week" },
  pt: { Schuljahr: "Ano letivo", Gesamt: "Desde o início", Monat: "Mês", Woche: "Semana" },
  br: { Schuljahr: "Ano letivo", Gesamt: "Desde o início", Monat: "Mês", Woche: "Semana" },
  ro: { Schuljahr: "An școlar", Gesamt: "De la început", Monat: "Lună", Woche: "Săptămână" },
  sv: { Schuljahr: "Läsår", Gesamt: "Från början", Monat: "Månad", Woche: "Vecka" },
  uk: { Schuljahr: "Навчальний рік", Gesamt: "Від початку", Monat: "Місяць", Woche: "Тиждень" },
};

/** Montag der NÄCHSTEN Ziel-Woche, schon als „21.09." - für Popup-Texte und die „anstehend"-Anzeige. */
function naechsterMontagKurz(jetztMs: number): string {
  const ms = wochenStartFuerSchluessel(naechsteWocheKey(jetztMs));
  return ms === undefined ? "" : fmtDatumKurz(ms);
}

/** „10:55" - für „Gesperrt bis …" am Knopf „Eine Stunde sperren". */
function uhrzeitAusMs(ms: number, sprache: BedienSprache = "de"): string {
  const sp = sprache;
  // ★ O5 (30.10.2026): die neun nach ihrem Gebiet (bis dahin österreichisch-deutsch).
  if (istGeruestSprache(sp)) return new Date(ms).toLocaleTimeString(GEBIET[sp], { hour: "2-digit", minute: "2-digit" });
  // ★ O-CS (03.10.2026): „8:05", 24 Stunden, Stunde ohne führende Null (Intl cs-CZ, Glossar §2.10).
  if (sp === "cs")
    return new Date(ms).toLocaleTimeString("cs-CZ", { hour: "numeric", minute: "2-digit" });
  // ★ O-TR (02.10.2026): "08:00", 24 Stunden (Intl tr-TR, Glossar §2.10).
  if (sp === "tr")
    return new Date(ms).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  // ★ O-PL (02.10.2026): „14:30", 24 Stunden (Intl pl-PL, Glossar §2.10).
  if (sp === "pl")
    return new Date(ms).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  // ★ O-IT (02.10.2026): „14:30", 24 Stunden.
  if (sp === "it")
    return new Date(ms).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  sprache = sp;
  // ★ E11a-3: „14 h 30" (Bauplan §9.1) - von Hand gebaut, nicht über
  // `toLocaleTimeString("fr-FR", …)`: die ICU-Daten dieser Plattform liefern
  // dort „14:30" (Doppelpunkt), nicht die im Bauplan verlangte Schreibweise.
  if (sprache === "fr") {
    const d = new Date(ms);
    return `${d.getHours()} h ${String(d.getMinutes()).padStart(2, "0")}`;
  }
  // ★ EN6a: britisch ebenfalls 24 Stunden in Anzeigen (Glossar §1.2, „10:55").
  return new Date(ms).toLocaleTimeString(sprache === "en" ? "en-GB" : "de-AT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * ★★★ Der Satz im Rückfrage-Popup vor dem Speichern (Johannes 18.09.2026
 * nachts: „ja, aber mit Popup und Erklärung für den Lehrer"). Für ein Ziel
 * über 0 sagt das schon {@link zielAenderungsText} (`wochenziel.ts`) - hier
 * nur der Sonderfall ergänzt: 0 heisst „kein Wochenziel mehr", nicht „ein
 * Ziel von null Minuten" (Johannes: 0 = kein Wochenziel, das muss im Popup
 * so heissen).
 */
function zielPopupSatz(minuten: number, jetztMs: number, sprache: BedienSprache = "de"): string {
  const t = REITER_TEXTE[sprache];
  if (minuten > 0) return t.zielNeu(minuten, jetztMs);
  return t.keinZielMehr(jetztMs);
}

/**
 * ★★★ Der Satz im Rückfrage-Popup vor „Für die Klasse übernehmen" (Johannes
 * 18.09.2026 nachts, wörtliches Beispiel: „Alle 14 Kinder bekommen 60 Minuten
 * pro Woche. Das gilt ab Montag, 21.09., 8:00 Uhr - bis dahin bleibt das
 * bisherige Ziel. Einzeln eingestellte Ziele werden dabei überschrieben.
 * Kinder, die später dazukommen, bekommen dieses Ziel auch."). Für 0 Minuten
 * gilt derselbe Sonderfall wie beim einzelnen Kind: „kein Wochenziel mehr",
 * nicht „ein Ziel von null Minuten".
 */
function klassenZielPopupText(
  anzahlKinder: number,
  minuten: number,
  jetztMs: number,
  sprache: BedienSprache = "de",
): string {
  // ★ EN6a: die Sätze stehen in `REITER_TEXTE` (`klassenZiel`), deutsch unverändert.
  return REITER_TEXTE[sprache].klassenZiel(anzahlKinder, minuten, jetztMs);
}

/**
 * ★★★ W3b (18.09.2026): Editor der Lehrkraft für das Wochenziel EINES Kindes -
 * neu auf dem Minuten-Modell (`wochenziel.ts`, W1/W2), OHNE Einheiten und
 * OHNE Klassenrhythmus (feste Grenze Montag 08:00, `WOCHENZIEL_GRENZE`).
 *
 * ★ Johannes 18.09.2026 nachts: „ja, aber mit Popup und Erklärung für den
 * Lehrer" - eine Änderung gilt erst ab der nächsten Woche, und genau das
 * erklärt das `Modal` VOR dem Schreiben (`zielAenderungsText`). Erst der
 * Druck auf „Übernehmen" dort ruft {@link onSetWochenziel}; „Speichern" allein
 * öffnet nur die Erklärung.
 *
 * ★ Johannes 18.09.2026: „Halte die Seite jetzt extrem schlank … das geht mit
 * Mouseover." - keine stehende Erklärung mehr unter den Feldern (die alte
 * Fassung nannte hier `wochenzielErklaerung.ts` ein drittes Mal); was zu
 * sagen ist, steht in den `Tipp`s der Bedienelemente selbst.
 */
function GoalEditor({
  data,
  gesperrt,
  onSetWochenziel,
  onResetOverdue,
  onSetExcusedWeeks,
  onMeldung,
}: {
  data: PupilData;
  /** ★ W3a: die gesperrten Zeiten der Klasse - fürs „Diese Woche"-Feld. */
  gesperrt: readonly GesperrteZeit[];
  /** Speichert wirklich (nach der Rückfrage) - meldet Erfolg/Fehler selbst. */
  onSetWochenziel: (
    id: string,
    name: string,
    ziel: { minuten: number; wochen: string[]; nachholen: boolean },
  ) => Promise<void>;
  onResetOverdue: (id: string, name: string) => void;
  onSetExcusedWeeks: (id: string, weeks: string[]) => void;
  /** Höfliche Ansage in der Statuszeile des Reiters (R5, siehe Dateikopf). */
  onMeldung: (text: string) => void;
}) {
  const { pupil } = data;
  const { t, sprache } = useReiterTexte();
  const jetztMs = Date.now();
  const ziel = kindWochenzielAusFeldern(pupil);
  const curMin = zielFuerWoche(ziel.verlauf, aktuelleWocheKey(jetztMs));
  const curWeeks = ziel.wochen;
  const curCatch = ziel.nachholen;
  const curReset = ziel.zurueckgesetztAb;
  const curExcused = ziel.erlasseneWochen;
  const [min, setMin] = useState(String(curMin));
  const [weeks, setWeeks] = useState<string[]>(curWeeks);
  const [catchUp, setCatchUp] = useState(curCatch);
  const catchUpId = useId();
  const dirty =
    Number(min) !== curMin ||
    weeks.join(",") !== curWeeks.join(",") ||
    catchUp !== curCatch;

  // „Diese Woche: 25 von 60 Min." - dieselbe Rechnung wie die Tabellenspalte
  // und die Kind-Ansicht (`aktuelleWoche`, `wochenziel.ts`).
  const woche = aktuelleWoche(data.events, ziel, jetztMs, gesperrt);
  // Steht eine Änderung noch aus? „ab Mo 21.09.: 60 Min." (Johannes: die
  // laufende Woche behält ihr Ziel, das muss sichtbar bleiben).
  const anstehend = anstehendeAenderung(ziel.verlauf, jetztMs);
  const anstehendMs = anstehend ? wochenStartFuerSchluessel(anstehend.ab) : undefined;
  // ★ EN6a/E11a-3: „zuletzt zurückgesetzt ab 2026-W38" - in Englisch/Französisch
  // als Woche mit Datum (Glossar §3.3: *Week 38 (w/c 14 Sept)*, „Semaine 38
  // (à partir du 15 sept.)", nie die Nummer allein).
  const resetMs = sprache !== "de" && curReset ? wochenStartFuerSchluessel(curReset) : undefined;
  const resetAnzeige =
    resetMs !== undefined ? weekLabelJeSprache(resetMs, sprache) : curReset;

  // ── Die Rückfrage vorm Speichern (Johannes: „mit Popup und Erklärung") ────
  const [frage, setFrage] = useState<{
    minuten: number;
    wochen: string[];
    nachholen: boolean;
  } | null>(null);
  const [speichertBusy, setSpeichertBusy] = useState(false);
  const wirklichSpeichern = async () => {
    if (!frage) return;
    setSpeichertBusy(true);
    try {
      await onSetWochenziel(pupil.id, pupil.name, frage);
    } finally {
      setSpeichertBusy(false);
      setFrage(null);
    }
  };

  return (
    // ★ R6 (11.09.2026): ein Unterbereich der aufgeklappten Zeile - Haarlinie
    // statt eigenem Kasten (Begründung an der Zeile in `PupilRow`).
    <div className="space-y-2 border-t border-hairline pt-3">
      <h3 className="m-0 text-sm font-semibold text-ink">{t.wochenziel}</h3>
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label className="field-label" htmlFor={`gm-${pupil.id}`}>
            {t.minutenProWoche}
          </label>
          <Tipp text={t.nullKeinZiel} ausrichtung="links">
            {(hinweisId) => (
              <input
                id={`gm-${pupil.id}`}
                type="number"
                min={0}
                max={600}
                className="field-input feld-schlank w-24"
                aria-describedby={hinweisId}
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
            )}
          </Tipp>
        </div>
        <div>
          <span className="field-label">{t.zielKalenderwochen}</span>
          <WeekMultiSelect value={weeks} onChange={setWeeks} nowMs={jetztMs} />
        </div>
        {/* ★ R5: `aria-disabled` statt `disabled` - siehe Dateikopf. Die
            Sperre steckt jetzt im Handler und nennt ihren Grund. */}
        {/* ⚠️ `ausrichtung="rechts"` (12.09.2026, gemessen bei 320 bis 1024 px):
            Der Knopf steht immer als Letzter in der Reihe, rund 455 bis 574 px
            vom linken Tabellenrand. Linksbündig lief der Hinweis bis 775 px und
            damit über die Tabelle (653 px bei schmalem Fenster) hinaus - der
            Rollkasten wurde auch ZUGEKLAPPT 122 px breiter, weil ein unsichtbarer
            Hinweis mitzählt. Rechtsbündig liegt er bei 254 bis 574 px, bei jeder
            Breite ganz in der Tabelle.
            ⚠️ Ganz SICHTBAR ist er damit bei 320 px trotzdem nicht: Der Hinweis
            (bis 320 px) ist dort breiter als der sichtbare Kasten (254 px) und
            wird in JEDER Ausrichtung angeschnitten - gemessen bei Fokus 133 px
            am linken Rand. Das kann nur `Tipp` selbst lösen (Breite kappen wie
            `Zeigerhinweis` mit `maxBreite`), und `Tipp` gehört fünf Apps
            (`apps/GEMEINSAM.md`) - also erst mit Johannes. */}
        <Tipp text={t.speichernTipp(pupil.name)} ausrichtung="rechts">
          {(hinweisId) => (
            <button
              type="button"
              className="btn-secondary btn-toggle btn-umriss aria-disabled:opacity-40"
              aria-disabled={!dirty}
              aria-describedby={hinweisId}
              onClick={() => {
                if (!dirty) {
                  onMeldung(t.nichtsGeaendert);
                  return;
                }
                setFrage({ minuten: Number(min), wochen: weeks, nachholen: catchUp });
              }}
            >
              {t.speichern}
            </button>
          )}
        </Tipp>
      </div>
      {/* ★ E12 (19.09.2026): Kästchen und Beschriftung als GESCHWISTER
          (`htmlFor`/`id`), nicht das Kästchen im `<label>` verschachtelt -
          ein `Tipp` darin bricht `getByLabelText` (gemessen, siehe
          `EigenerTextQuelle.tsx`). */}
      <div className="flex items-center gap-2 text-sm text-ink">
        {/* ★ E12, Browser-Messung (700 px): das Kästchen steht am LINKEN Rand
            seiner Zeile - `ausrichtung="links"` läuft nach rechts auf. */}
        <Tipp text={t.nachholenTipp} ausrichtung="links">
          {(hinweisId) => (
            <span className="flex items-center gap-2">
              <input
                id={catchUpId}
                type="checkbox"
                className="h-4 w-4 accent-[rgb(var(--c-accent))]"
                checked={catchUp}
                aria-describedby={hinweisId}
                onChange={(e) => setCatchUp(e.target.checked)}
              />
              <label htmlFor={catchUpId}>{t.nachholen}</label>
            </span>
          )}
        </Tipp>
      </div>
      <p className="m-0 text-sm text-ink-muted">
        {t.dieseWoche}{" "}
        {woche.zielMin > 0 ? (
          <>
            <strong>
              {Math.round(woche.geuebtMin)}/{woche.zielMin}
            </strong>{" "}
            {t.min}
          </>
        ) : (
          <em>{t.keinWochenziel}</em>
        )}
        {anstehend && anstehendMs !== undefined && (
          <>
            {t.anstehend(
              DATUM_KURZ_JE_SPRACHE[sprache](anstehendMs),
              anstehend.minuten,
            )}
          </>
        )}
      </p>
      {/* Überfällige Wochenziele zurücksetzen (Johannes 15.07.): streicht den aufgelaufenen
          Rückstand; ab dieser Woche zählt das Wochenziel wieder frisch. */}
      <div className="flex flex-wrap items-center gap-2">
        <Tipp text={t.ueberfaelligTipp} ausrichtung="links">
          {(hinweisId) => (
            <button
              type="button"
              className="btn-secondary btn-toggle btn-umriss"
              aria-describedby={hinweisId}
              onClick={() => onResetOverdue(pupil.id, pupil.name)}
            >
              {t.ueberfaelligZuruecksetzen}
            </button>
          )}
        </Tipp>
        {curReset && (
          <span className="text-sm text-ink-muted">
            {t.zuletztZurueckgesetzt(resetAnzeige ?? curReset)}
          </span>
        )}
      </div>
      {/*
        ★★★★★ EINZELNE WOCHEN ERLASSEN (Befund 16.09.2026, Johannes: „ich
        brauch als Lehrer die Möglichkeit nicht erledigte Wochenziele zu
        löschen wenn jemand krank war"). Anders als „Überfällige zurücksetzen"
        (EIN Stichtag, streicht alles davor) trifft das gezielt EINE Woche
        dazwischen - dieselbe Wochenauswahl wie oben bei „Ziel-Kalenderwochen",
        nur mit einer anderen Bedeutung: nicht „wann gilt das Ziel", sondern
        „welche Woche zählt trotzdem nicht als versäumt". Schreibt sofort,
        ohne eigenen Speichern-Knopf - wie „Überfällige zurücksetzen" auch.
      */}
      <div className="flex flex-wrap items-center gap-2">
        <Tipp text={t.erlassenTipp} ausrichtung="links">
          {(hinweisId) => (
            <div>
              <span className="field-label">{t.wochenzielErlassen}</span>
              <ExcusedWeeksSelect
                value={curExcused}
                onChange={(weeks) => onSetExcusedWeeks(pupil.id, weeks)}
                nowMs={jetztMs}
                ariaDescribedby={hinweisId}
              />
            </div>
          )}
        </Tipp>
      </div>

      {/* ★ Die Rückfrage - Bauart wie „Startniveau für die ganze Klasse"
          weiter unten (`Klasseneinstellungen`): ein `Modal`, kein
          `window.confirm`, mit Erklärung UND einem Vorgabe-Knopf. */}
      {frage && (
        <Modal title={t.wochenzielFuer(pupil.name)} onClose={() => setFrage(null)}>
          <div className="space-y-3 text-sm text-ink">
            <p className="m-0">{zielPopupSatz(frage.minuten, jetztMs, sprache)}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-primary aria-disabled:opacity-40"
                aria-disabled={speichertBusy}
                onClick={() => void wirklichSpeichern()}
              >
                {t.uebernehmen}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setFrage(null)}>
                {t.abbrechen}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/*
 * ★★★ B10 (11.09.2026): DAS FELD „GEBURTSJAHR" IST HIER WEG.
 *
 * Johannes: *„Jede Klasse hat also nur eine Textstufe."* Textstufe, Geburtsjahr,
 * Sprache und Sperre gelten seit diesem Umbau für die ganze KLASSE (Kasten
 * „Einstellungen der Klasse" weiter unten, `klassenEinstellungen.ts`) - je Kind
 * gab es sie damit doppelt, und zwei Stellen, die dasselbe verschieden
 * beantworten, sind genau die Doppelung, die diese Seite meidet
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ⚠️ Die Backend-Wege `setGeburtsjahr`, `setStufe` und `setLang` BLEIBEN -
 * selbstlernende Konten ohne Klasse stellen das weiterhin selbst im Zahnrad
 * ein (`TippenTrainerPage` ⇒ `TypingSettings`). Entfallen ist nur die
 * Bedienung durch die Lehrkraft je Kind.
 *
 * `setLangLocked` je Kind ist mit diesem Umbau entfallen (11.09.2026): Die
 * Sperre setzt nur noch die Klasse (`setClassEinstellungen`), und ein
 * selbstlernendes Konto sperrt sich die Sprache nicht selbst.
 */

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EINE TABELLE - Layout A, zweiter Durchgang (01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes wörtlich: *„ich möchte nicht zwei tabellen sondern eine, die zeilen
 * sollen leicht unterschiedlich gefärbt sein damit man nicht die zeile
 * verliert"* - *„beim nach links scrollen soll der nahme (erste spalte) stehen
 * bleiben"* - *„der ganze text oben ist viel zu viel … nur mouse over bei der
 * spaltenüberschrift"*.
 *
 * Die Seite trug bis dahin ZWEI Tabellen mit je einer Namensspalte: den
 * Wochenstreifen (Ziel · Übezeit · Anschläge · Treffsicherheit) und die
 * Lernenden-Tabelle (Stufe · Lektionen · Tasten · Anschläge · Treffer ·
 * Wochenziel · Zuletzt). Wer eine Person suchte, fand sie zweimal mit
 * verschiedenen Zahlen und musste erst herausfinden, welche welche ist.
 *
 * Jetzt gibt es genau eine:
 *
 *     ⌄  ·  Name  ·  Leistungsstufe  ·  Übezeit  ·  Wochenziel  ·
 *     Treffsicherheit  ·  Anschl./Min
 *
 * ── ★ Welcher Zeitraum? EINER, und er steht darüber ────────────────────────
 * Alle Zahlen der Tabelle gelten für den Zeitraum aus dem `ZeitraumKopf`
 * (Woche blättern · Schuljahr · Gesamt). Der Wochenstreifen hatte dafür eigene
 * Pfeile - zwei Bedienungen für dieselbe Frage, und auf der Braillezeile
 * zweimal derselbe Schaltername. Es ist jetzt eine.
 *
 * ── ★ Die Spalte „Wochenziel" steht nur da, wenn eines gesetzt ist ─────────
 * Wörtlich beauftragt. Eine Spalte voller Striche ist keine Auskunft, sondern
 * Platz, den die anderen Zahlen brauchen.
 *
 * ── ★★ DIE ERSTE SPALTE BLEIBT STEHEN ─────────────────────────────────────
 * Knopf und Name kleben beim seitlichen Schieben am linken Rand
 * (`sticky left-0`). Darum trägt die klebende Zelle eine DECKENDE Farbe: eine
 * durchscheinende liesse die Zahlen darunter durchwandern.
 *
 * ⚠️ Weil zwei Spalten kleben, muss die erste eine FESTE Breite haben - die
 * zweite dockt mit `left-14` genau daran an. Wer die Breite der Knopfspalte
 * ändert, ändert beide Zahlen.
 *
 * ── ★ Zebra: die Zeile geht nicht verloren ────────────────────────────────
 * Jede zweite Person bekommt einen leicht abgesetzten Grund. Er hängt am
 * INDEX der Person, nicht an `nth-child`: Zwischen zwei Personen kann eine
 * aufgeklappte Zeile stehen, und `nth-child` zählte die mit - der Wechsel
 * geriete genau dort durcheinander, wo man ihn braucht.
 *
 * ⚠️ Der Zebra-Grund ist NIE der einzige Träger einer Aussage (WCAG 1.4.1). Er
 * sagt nur „dies ist eine Zeile", und das sagt die Tabellenstruktur der
 * Sprachausgabe ohnehin.
 *
 * ── ★ Die Erklärungen stehen am Ort, nicht oben ───────────────────────────
 * Johannes: *„leistungsstufe und andere dinge verstehen lehrer nur wenn es
 * erklärt wird und nicht oben eine lange liste sondern direkt am ort."*
 * ⇒ Jeder Spaltenkopf trägt seinen Satz selbst (`Spaltenkopf.tsx`); über der
 * Tabelle steht keine Liste mehr.
 */

/*
 * Die Beschriftung der Tabelle steht seit EN6a (19.09.2026) in `REITER_TEXTE`
 * (`listenTitel`), deutsch unverändert „Lernende der Klasse mit
 * Leistungsstand und Wochenziel".
 */

/**
 * Die Angaben EINER Zeile - an einer Stelle gerechnet.
 *
 * ⚠️ Lektionen, sitzende Tasten und „zuletzt geübt" stehen seit dem 01.09.2026
 * nicht mehr in der Tabelle (Johannes hat die Spalten benannt, und diese drei
 * sind nicht dabei). Verloren ist nichts: Sie stehen im aufgeklappten Bereich,
 * in `PupilStatsPanel` - dort ausführlicher, als eine Spalte es je könnte.
 */
interface ZeilenWerte {
  /**
   * ★ T1 (19.09.2026): die blosse Zahl „12" - der Entwurf „Meine Klassen"
   * zeigt keine Pille „12/50" mehr. Dass die Stufe von 1 bis 50 geht, sagt
   * der Hinweis am Spaltenkopf (`LEISTUNGSSTUFE_HILFE`).
   */
  stufe: string;
  /**
   * ★ „12 / 31" (seit T1 mit Leerzeichen wie im Entwurf) - wie viele der
   * freigeschalteten Tasten sitzen (Johannes 01.09.2026: *„die Tasten zB
   * 12/31 gehören noch in die tabelle rechts neben leistungsstufe"*).
   *
   * ⚠️ Der Nenner ist die Zahl der FREIGESCHALTETEN Tasten, nicht die der
   * Tastatur: Ein Kind in der dritten Woche hat 31 Tasten offen, nicht 60.
   * „12 von 31" heisst also „von dem, was du schon kennst" - und die Zahl
   * wächst mit, statt ein Kind an einem Ziel zu messen, das es noch gar nicht
   * angeboten bekommen hat ([[feedback_nie_gegen_das_kind]]).
   */
  tasten: string;
  /**
   * ★ 25.09.2026 (Testerin, Entscheidung Johannes): die nächsten ZWEI Tasten des
   * Kindes, in der Reihenfolge, in der sie kommen - leer, wenn alles gelernt
   * ist. Im Lernweg DES KINDES; die Tastatur ist die dieses Geräts (sie steht
   * nirgends am Server), wie schon bei „Tasten".
   */
  naechste: string[];
  /**
   * Die geübte Zeit im gewählten Zeitraum - „38 Min.", seit T1 ab einer
   * Stunde kurz „2 Std. 05" wie im Entwurf ({@link uebezeitKurz}).
   */
  uebezeit: string;
  /**
   * ★ T1: dieselbe Zeit ausgeschrieben („2 Std. 5 Min.", `fmtDuration`) - für
   * die Sprachausgabe, die die Kurzform ohne „Min." hören würde.
   */
  uebezeitLang: string;
  anschlaege: string;
  /** Die Treffsicherheit in Prozent. */
  treffer: string;
  /**
   * ★ W3a (18.09.2026): der Wochenziel-Stand im gewählten Zeitraum - Minuten
   * bei einer Woche, Prozent bei Schuljahr/Gesamt (`wochenzielZeitraum.ts`).
   * `Wochenzielstand` formatiert daraus Text UND Sprachausgabe; der
   * Excel-Export (`leistungsBlaetter`) liest dieselben Zahlen.
   */
  wochenzielStand: WochenzielStand;
  /**
   * ★ B2 (11.09.2026): Der Übungs-Score des ZEITRAUMS - „78" oder „-".
   * Derselbe Rechenweg wie die Tippchallenge, angewandt auf die Übungsdaten
   * (`score.ts`); unter `MIND_ZEICHEN_WERTUNG` Zeichen steht ein Strich.
   */
  score: string;
  /** Die Veränderung. `null` = kein Vergleich möglich. */
  trefferAenderung: Veraenderung | null;
  tempoAenderung: Veraenderung | null;
  scoreAenderung: Veraenderung | null;
  /** Nur bei Schuljahr/Gesamt/Monat: ab welcher Woche gerechnet wird. */
  ausgangswoche: number | null;
  /**
   * ★ K4 (19.09.2026): `true`, wenn `ausgangswoche` der Anfang eines
   * 4-Wochen-BLOCKS ist (ab 5 Übungswochen, siehe `veraenderung.ts`), nicht
   * der Anfang einer einzelnen Übungswoche - entscheidet, ob der Bezugstext
   * „den 4 Übungswochen ab …" oder „der Woche ab …" heisst.
   */
  vierWochenBlock: boolean;
  /**
   * ★ B3 (11.09.2026): Warum bei Schuljahr/Gesamt KEINE Veränderung dasteht -
   * „erst eine Übungswoche". `null` = es gibt eine. Der lange Satz geht in den
   * Zeigerhinweis, das kurze Wort steht als „·" in der Zelle.
   */
  veraenderungsGrund: string | null;
  veraenderungsGrundKurz: string | null;
  /**
   * ★ 12.09.2026: Die ZAHLEN hinter den Texten oben - für den Excel-Export
   * (`leistungsBlaetter`, `leistungExport.ts`). `null` = kein Wert, dort steht
   * ein Strich.
   * ⚠️ Die Texte werden aus GENAU diesen Zahlen gebaut (siehe unten). So können
   * Datei und Schirm nicht auseinanderlaufen.
   */
  zahlen: {
    stufe: number;
    tastenSitzen: number;
    tastenFrei: number;
    uebezeitMinuten: number | null;
    treffsicherheit: number | null;
    anschlaege: number | null;
    score: number | null;
  };
}

/**
 * ★ T1 (19.09.2026): die Übezeit so kurz wie im Entwurf „Meine Klassen" -
 * „6 Std. 20", „8 Std. 05". Unter einer Stunde bleibt es bei `fmtDuration`
 * („38 Min.", „20 Sek."), dort ist die Einheit das einzige, was die Zahl
 * erklärt. Dieselbe Rundung wie `fmtDuration` (erst Sekunden, dann Minuten),
 * damit Kurz- und Langform nie verschiedene Minuten nennen.
 */
function uebezeitKurz(ms: number, sprache: BedienSprache = "de"): string {
  const m = Math.round(Math.round(ms / 1000) / 60);
  if (m < 60) return fmtDauer(ms, sprache);
  // ★ EN6a: englisch „6 h 20" - dieselbe Kurzform, Glossar §1.2 (*3 h 36 min*).
  // ★ E11a-5: französisch ebenso „6 h 20" (Bauplan §9.1) - bis dahin „Std.".
  return `${Math.floor(m / 60)} ${sprache === "de" ? "Std." : "h"} ${String(m % 60).padStart(2, "0")}`;
}

function zeilenWerte(
  data: PupilData,
  jetztMs: number,
  /** ★ W3a: die gesperrten Zeiten der KLASSE - siehe `wochenziel.ts` „Eine Stunde sperren". */
  gesperrt: readonly GesperrteZeit[] = [],
  zeitraum: Zeitraum = ZEITRAUM_START,
  /** Die Werte des Zeitraums DAVOR - für die Pfeile. */
  vergleich: PupilStats | null = null,
  /**
   * ★ K4-Folge (19.09.2026, Klassenüberblick-Abgleich): wie viele Zeilen
   * (Zeichen UND Zeit, wie überall) im VERGLEICHSZEITRAUM liegen - nur für
   * „Monat" gebraucht (siehe unten, `vergleichGueltig`). Für jeden anderen
   * Zeitraum ohne Wirkung.
   */
  vergleichsZeilen = 0,
  /** ★ EN6a (19.09.2026): die Bedienungssprache der Texte - die Zahlen bleiben dieselben. */
  sprache: BedienSprache = "de",
): ZeilenWerte {
  const { pupil, stats, progress } = data;
  const level = currentLevel(progress, pupil.tempo);
  /*
   * ★★ Das Wochenziel folgt jetzt dem Zeitraum-Kopf (Johannes 01.09.2026:
   * „die Wochenziele müssen sich auch anpassen wenn auf schuljahr oder gesamt
   * geklickt wird"). Die Rechnung steht in `wochenzielZeitraum.ts`, damit die
   * laufende Woche weiter die EINE Live-Rechnung behält.
   *
   * ⚠️ `data.events` ist hier UNGEFILTERT - das muss so sein: Nachhol-Soll und
   * die Frage „welche Wochen waren Ziel-Wochen" brauchen die ganze
   * Geschichte, nicht den Ausschnitt.
   *
   * ★ W3a: Minuten statt Einheiten - `kindWochenzielAusFeldern` liest dabei
   * lazy den neuen Verlauf ODER (solange er leer ist) rechnet ihn aus den
   * alten Feldern um; nichts davon wird hier ein zweites Mal entschieden.
   */
  const wz = wochenzielImZeitraum(
    data.events,
    kindWochenzielAusFeldern(pupil),
    gesperrt,
    zeitraum,
    jetztMs,
  );
  /*
   * ★★ DREI FRAGEN, ZWEI RECHNUNGEN (K4-Folge, 19.09.2026).
   *
   *   Woche             „wie war diese Woche gegenüber der letzten?"
   *   Monat             „wie waren die letzten 4 Wochen gegenüber den 4
   *                     davor?" - dieselbe Frage wie bei Woche, nur mit einem
   *                     4-mal so breiten Fenster (dieselben Grenzen wie der
   *                     Klassenüberblick, `klassenueberblick.ts`).
   *                     ⇒ BEIDE: Zeitraum gegen Vorzeitraum (`vergleich`),
   *                       angezeigt als Pfeil.
   *   Schuljahr/Gesamt  „wie weit ist dieses Kind gekommen?"
   *                     ⇒ erste gegen letzte Übungswoche (bzw. ab 5 Wochen:
   *                       Block gegen Block) IM Zeitraum selbst, angezeigt
   *                       als Zahl (Johannes: „92% +3%").
   *
   * ⚠️ „Gesamt" hat kein Davor - dort GIBT es die erste Rechnung gar nicht.
   * Das ist der Grund, warum die zweite existiert, nicht bloss ein anderes
   * Aussehen. „Monat" HAT ein gleich breites Davor (`vergleichsGrenzen`,
   * K4) - deshalb gehört es zur ERSTEN Frage, nicht zur zweiten.
   */
  const zeigtBlockTrend = zeitraum.art === "schuljahr" || zeitraum.art === "gesamt";
  // ★ W3a: WOCHENZIEL_GRENZE statt Klassenrhythmus - siehe Kopf-Kommentar
  // der Datei „Die weeks der Tastenflow-Tabelle" bei `datasImZeitraum`.
  const ent = zeigtBlockTrend
    ? entwicklungImZeitraum(data.events, grenzen(zeitraum, jetztMs, WOCHENZIEL_GRENZE))
    : null;
  /*
   * ★ K4-Folge: „Monat" braucht zusätzlich MINDESTZEILEN im
   * VERGLEICHSZEITRAUM (den 4 Wochen davor). Ohne diese Schranke bekäme ein
   * Kind, das in den 4 Wochen davor kaum geübt hat, einen Pfeil aus
   * Zufallsrauschen - genau das, was Johannes mit „sagen einfach wenig aus"
   * meinte, nur eine Fensterbreite kleiner. „Woche" bekommt KEINE solche
   * Schranke - das bleibt wie bisher (dort entscheidet ein einzelner Tag
   * schon lange über den Pfeil).
   */
  const vergleichGueltig = zeitraum.art !== "monat" || vergleichsZeilen >= MINDESTZEILEN;
  // ⚠️ Ohne gemessene Zeile gibt es keinen Wert - und ohne Wert keinen Pfeil.
  // `null` heisst „nicht geübt", nicht „null Prozent".
  const jetztTreffer = stats.tasks ? stats.accuracy * 100 : null;
  const vorherTreffer = vergleichGueltig && vergleich?.tasks ? vergleich.accuracy * 100 : null;
  const jetztTempo = stats.avgCpm ? stats.avgCpm : null;
  const vorherTempo = vergleichGueltig && vergleich?.avgCpm ? vergleich.avgCpm : null;
  /*
   * ★ B2: Der Übungs-Score des Zeitraums. `stats` ist hier schon der
   * zeitraumgefilterte Stand (`zeitraumDatas`) - dieselbe Grundlage wie
   * Treffsicherheit und Tempo daneben, nicht der Gesamtstand.
   */
  const jetztScore = scoreAusStats(stats).wert;
  const vorherScore = vergleichGueltig && vergleich ? scoreAusStats(vergleich).wert : null;
  // ★ Dieselbe Rechnung wie im aufgeklappten Bereich (`PupilStatsPanel`) -
  // dort steht sie als „Tasten sitzen" gross da. Zwei Stellen, die dasselbe
  // verschieden rechnen, wären genau die Doppelung, die diese Seite meidet;
  // darum kommen beide aus `masteredCount`.
  // ⚠️ „Zeit lassen" senkt den Massstab mit - sonst zeigte die Tabelle Tasten
  // als offen, die das Programm für dieses Kind längst als sitzend führt.
  // ★ E1 (24.09.2026): im Weg DES KINDES, nicht der Lehrkraft.
  const lernweg = lernwegAus(pupil, progress);
  const introduced = ensureIntroduced(progress.introduced, lernweg);
  const sitzen = masteredCount(
    introduced,
    progress.letters,
    lernweg,
    masteryForLevel(level, !!pupil.noTimePressure),
  );
  /*
   * ★ 12.09.2026: erst die Zahlen, dann die Texte DARAUS. Der Excel-Export
   * braucht Zahlen, mit denen man rechnen kann; bauten Datei und Schirm sie
   * getrennt, stünde irgendwann in der Datei etwas anderes als in der Zeile.
   * ⚠️ `null` heisst „nicht geübt" bzw. „keine Wertung" - nie 0.
   */
  const zahlen: ZeilenWerte["zahlen"] = {
    stufe: level,
    tastenSitzen: sitzen,
    tastenFrei: introduced.length,
    // ⚠️ Eine Nachkommastelle, keine ganzen Minuten: Wer 20 Sekunden geübt hat,
    // stünde sonst mit 0 in der Datei - das sähe aus wie „nicht geübt".
    uebezeitMinuten: stats.tasks ? Math.round(stats.totalMs / 6_000) / 10 : null,
    treffsicherheit: stats.tasks ? Math.round(stats.accuracy * 100) : null,
    anschlaege: stats.avgCpm ? Math.round(stats.avgCpm) : null,
    score: jetztScore === null ? null : Math.round(jetztScore),
  };
  return {
    zahlen,
    stufe: String(zahlen.stufe),
    tasten: `${zahlen.tastenSitzen} / ${zahlen.tastenFrei}`,
    naechste: naechsteTasten(introduced, lernweg, 2),
    // ⚠️ Ohne eine einzige Übung steht ein Strich, keine „0 Min." - eine Null
    // sähe aus wie ein gemessener Wert.
    uebezeit: zahlen.uebezeitMinuten === null ? "-" : uebezeitKurz(stats.totalMs, sprache),
    uebezeitLang: zahlen.uebezeitMinuten === null ? "-" : fmtDauer(stats.totalMs, sprache),
    anschlaege: zahlen.anschlaege === null ? "-" : String(zahlen.anschlaege),
    // `fmtPercent` rundet genauso (`Math.round(x * 100)`) - dieselbe Zahl.
    treffer: zahlen.treffsicherheit === null ? "-" : fmtPercent(stats.accuracy, sprache),
    // ★ W3a: der ganze Stand kommt roh mit - `Wochenzielstand` (Anzeige) und
    // `leistungsBlaetter` (Excel) formatieren ihn je für sich, siehe dort.
    wochenzielStand: wz,
    // ⚠️ Ohne Wertung ein Strich, keine Null: „0 Punkte" sähe aus wie ein
    // gemessenes Ergebnis, dabei ist es zu wenig Text für eine Rechnung.
    score: zahlen.score === null ? "-" : String(zahlen.score),
    trefferAenderung: ent
      ? ent.treffer
      : veraenderung(jetztTreffer, vorherTreffer, "treffer"),
    tempoAenderung: ent ? ent.tempo : veraenderung(jetztTempo, vorherTempo, "tempo"),
    scoreAenderung: ent ? ent.score : veraenderung(jetztScore, vorherScore, "score"),
    ausgangswoche: ent?.ausgangswoche ?? null,
    vierWochenBlock: ent?.vierWochenBlock ?? false,
    veraenderungsGrund: entwicklungsGrund(ent, sprache),
    veraenderungsGrundKurz: entwicklungsGrundKurz(ent, sprache),
  };
}

/**
 * ★ 12.09.2026: Die Kinder mit dem Stand EINES Zeitraums. Stand bis dahin nur
 * im `useMemo` der Tabelle (`zeitraumDatas`) - der Excel-Export braucht
 * denselben Filter für vier Zeiträume auf einmal, und ein zweiter Filter
 * daneben wäre genau die Doppelung, die auseinanderläuft. Begründung des
 * Filters selbst am `useMemo`.
 */
function datasImZeitraum(
  datas: PupilData[],
  zeitraum: Zeitraum,
  jetztMs: number,
): PupilData[] {
  // ★ W3a: WOCHENZIEL_GRENZE statt Klassenrhythmus - die Wochen der ganzen
  // Tabelle folgen seither derselben festen Grenze wie das Wochenziel selbst
  // (Montag 08:00), nicht mehr der Unterrichtsstunde der Klasse (die mit
  // diesem Umbau stirbt, ihre Bedienung geht erst in W3b).
  return zeitraum.art === "gesamt"
    ? datas
    : datas.map((d) => ({
        ...d,
        stats: computePupilStats(ereignisseIm(d.events, zeitraum, jetztMs, WOCHENZIEL_GRENZE)),
      }));
}

/**
 * ★ 12.09.2026: Ist in der Klasse ein Wochenziel gesetzt? Dieselbe Frage für
 * die Spalte auf dem Schirm und für die Spalte in der Datei (Begründung am
 * `useMemo` `zeigeWochenziel`).
 *
 * ★ W3a: gefragt wird jetzt über {@link kindWochenzielAusFeldern} - sie liest
 * lazy den neuen Verlauf ODER (solange er leer ist) die alten Felder, genau
 * wie die Spalte selbst. Ein Kind mit einem neuen, aber noch leeren Verlauf
 * UND ohne alte Felder hat schlicht kein Ziel - dieselbe Antwort wie vorher.
 */
function wochenzielGesetzt(datas: readonly PupilData[]): boolean {
  return datas.some((d) => kindWochenzielAusFeldern(d.pupil).verlauf.length > 0);
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ DIE BLÄTTER DES EXCEL-EXPORTS (12.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 * Johannes: *„Ich brauche eine Exportmöglichkeit für die Leistungstabelle, in
 * Klassenname_datum.xlsx."* - drei Zeiträume (laufendes Schuljahr, Gesamt,
 * diese Woche), UNABHÄNGIG vom Zeitraum, der oben gewählt ist.
 * ★ 13.09.2026: in DIESER Reihenfolge (Johannes: „dann Schuljahr, dann Gesamt
 * und dann erst Woche"); die Übersicht davor baut `leistungExport.ts`.
 *
 * ⚠️ Keine zweite Rechnung: Jede Zeile geht durch `datasImZeitraum` und
 * `zeilenWerte` - dieselben Wege wie die Zeile auf dem Schirm -, die
 * Tippchallenge durch `probenUebersicht` wie `SchreibprobenKennzahl`. Titel,
 * Spalten, Reihenfolge und Aussehen ordnet `leistungExport.ts`.
 *
 * Rein (kein Zustand, kein Datum von selbst): `jetztMs` kommt herein, damit ein
 * Test die Woche festhalten kann.
 */
/**
 * ★ W3a (18.09.2026): die Wochenziel-Zahlen EINER Excel-Zeile aus demselben
 * `WochenzielStand` wie die Spalte auf dem Schirm (`Wochenzielstand`) - nie
 * eine zweite Rechnung. Minuten im Blatt „Woche", Prozent in „Schuljahr"/
 * „Gesamt"; die jeweils andere Zahl bleibt `null` (Strich in der Datei).
 */
function wochenzielFuerExcel(stand: WochenzielStand): {
  minuten: number | null;
  erledigtMinuten: number | null;
  prozent: number | null;
} {
  if (stand.art === "woche" && stand.zielwoche) {
    const zaehler = stand.laufend ? stand.geuebtMin : stand.erfuelltMin;
    return {
      minuten: Math.round(stand.zielMin),
      erledigtMinuten: Math.round(zaehler),
      prozent: null,
    };
  }
  if (stand.art === "prozent" && stand.anteil !== null)
    return { minuten: null, erledigtMinuten: null, prozent: Math.round(stand.anteil * 100) };
  return { minuten: null, erledigtMinuten: null, prozent: null };
}

export function leistungsBlaetter(
  datas: PupilData[],
  proben: Readonly<Record<string, readonly Probenergebnis[]>>,
  /** ★ W3a: die gesperrten Zeiten der Klasse - siehe `wochenziel.ts` „Eine Stunde sperren". */
  gesperrt: readonly GesperrteZeit[],
  jetztMs: number,
  klassenname?: string | null,
  /**
   * ★ EN6a (19.09.2026): die Sprache der Mappe - dieselbe wie die der
   * Bedienung. Ohne Angabe Deutsch, genau wie vorher.
   */
  sprache: BedienSprache = "de",
  /** ★ D2 (28.09.2026): der Beginn des Schuljahres der Klasse (1-12) - ohne Angabe August. */
  schuljahrBeginn?: number,
): LeistungsBlatt[] {
  const zeigeWochenziel = wochenzielGesetzt(datas);
  return LEISTUNG_BLAETTER.map(({ name, nameEn, nameFr, nameEs, nameIt, namePl, nameTr, nameCs, zeitraum: blattZeitraum }) => {
    const zeitraum: Zeitraum =
      schuljahrBeginn === undefined ? blattZeitraum : { ...blattZeitraum, schuljahrBeginn };
    return leistungsBlatt({
      // ★ E11a-5: Auswahl über alle drei Namen (bis dahin nur „en").
      // ★ ES-O (27.09.2026): und „es".
      name: (
        {
          de: name,
          en: nameEn,
          fr: nameFr,
          es: nameEs,
          it: nameIt,
          pl: namePl,
          tr: nameTr,
          cs: nameCs,
          bg: LEISTUNG_BLATT_NAMEN_NEUN.bg[name] ?? nameEn,
          el: LEISTUNG_BLATT_NAMEN_NEUN.el[name] ?? nameEn,
          hu: LEISTUNG_BLATT_NAMEN_NEUN.hu[name] ?? nameEn,
          nl: LEISTUNG_BLATT_NAMEN_NEUN.nl[name] ?? nameEn,
          pt: LEISTUNG_BLATT_NAMEN_NEUN.pt[name] ?? nameEn,
          br: LEISTUNG_BLATT_NAMEN_NEUN.br[name] ?? nameEn,
          ro: LEISTUNG_BLATT_NAMEN_NEUN.ro[name] ?? nameEn,
          sv: LEISTUNG_BLATT_NAMEN_NEUN.sv[name] ?? nameEn,
          uk: LEISTUNG_BLATT_NAMEN_NEUN.uk[name] ?? nameEn,
        } satisfies Record<BedienSprache, string>
      )[sprache],
      art: zeitraum.art,
      // ★ W3a: WOCHENZIEL_GRENZE statt Klassenrhythmus, wie überall in der Tabelle.
      titel: leistungTitel(
        klassenname,
        zeitraumTitel(zeitraum, jetztMs, WOCHENZIEL_GRENZE, sprache),
        sprache,
      ),
      zeitraumTitel: zeitraumTitel(zeitraum, jetztMs, WOCHENZIEL_GRENZE, sprache),
      jetztMs,
      zeigeWochenziel,
      sprache,
      zeilen: datasImZeitraum(datas, zeitraum, jetztMs).map((d) => {
        const w = zeilenWerte(d, jetztMs, gesperrt, zeitraum, null, 0, sprache);
        const u = probenUebersicht(proben[d.pupil.id] ?? KEINE_PROBEN);
        const wz = wochenzielFuerExcel(w.wochenzielStand);
        return {
          name: d.pupil.name,
          stufe: w.zahlen.stufe,
          tastenSitzen: w.zahlen.tastenSitzen,
          tastenFrei: w.zahlen.tastenFrei,
          uebezeitMinuten: w.zahlen.uebezeitMinuten,
          wochenzielMinuten: wz.minuten,
          wochenzielErledigtMinuten: wz.erledigtMinuten,
          wochenaufgabenProzent: wz.prozent,
          treffsicherheit: w.zahlen.treffsicherheit,
          anschlaegeProMinute: w.zahlen.anschlaege,
          score: w.zahlen.score,
          // ⚠️ Ohne Challenge ein Strich wie in `SchreibprobenKennzahl` - eine
          // leere Liste kann auch ein Lesefehler sein, dann wäre 0 eine Behauptung.
          challenges: u.anzahl === 0 ? null : u.anzahl,
          challengeSchnitt: u.schnitt,
        };
      }),
    });
  });
}

/**
 * Die Einstellungen, die je KIND bleiben (B10, 11.09.2026).
 *
 * ⚠️ Weggefallen sind `onSetStufe`, `onSetStufeWaechstMit`, `onSetGeburtsjahr`,
 * `onSetLang` und `onSetLangLocked`: Textstufe, Geburtsjahr, Sprache und Sperre
 * gelten seit diesem Umbau für die ganze Klasse (Kasten „Einstellungen der
 * Klasse"). Die Backend-Wege bleiben - Selbstlernende stellen das weiter selbst
 * ein; nur die Bedienung je Kind ist weg.
 */
interface EinstellHandler {
  onMeldung: (text: string) => void;
  onSetOneHand: (id: string, oneHand: boolean) => void;
  /** ★ Gezielt üben (13.11.2026): `null` = wie die Klasse; `{zeichen: []}` = aus für dieses Kind. */
  onSetGezielt: (id: string, name: string, g: Gezielt | null) => void;
  onSetNoTimePressure: (id: string, on: boolean) => void;
  /** „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026): 1 = aus, 2 = doppelt, 3 = dreifach, 4 = vierfach. */
  onSetZeichenabstand: (id: string, faktor: number) => void;
  /** ★ 25.09.2026: eigene Schulstufe des Kindes (0 = wie die Klasse). */
  onSetSchulstufe: (id: string, name: string, schulstufe: number) => void;
  /**
   * Startpunkt setzen. `label` und `zurueck` sind nur für die Rückmeldung da:
   * Ein Zurückstufen wirkt erst, wenn das Kind das nächste Mal öffnet - das
   * muss dastehen, sonst sucht eine Lehrkraft die Wirkung sofort und findet
   * sie nicht.
   */
  onSetStartUnits: (
    id: string,
    name: string,
    units: number,
    label: string,
    zurueck: boolean,
  ) => void;
  /**
   * ★ W2b (28.09.2026, Weg je Kind): den Lernweg eines Kindes umstellen -
   * gerufen erst NACH der Rückfrage in `WegJeKind`. Schreibt nur das Konto;
   * das Kind parkt seinen bisherigen Stand beim nächsten Öffnen.
   */
  onSetLernweg: (id: string, name: string, weg: Lernweg) => void;
}

/* `Feld` (Beschriftung DARÜBER, auf schmalen Geräten untereinander) steht seit
   11.09.2026 (Nacht) in `KlassenEinstellungsFelder.tsx` - dieselbe Hülle trägt
   dort auch das Anlege-Formular der Verwaltung. */

/**
 * Die Einstellungen einer Person - sie standen bis 31.08.2026 als sechs
 * Tabellenspalten immer sichtbar da. Seit Layout A stehen sie hier, hinter dem
 * Knopf „Einstellungen", und die Zeile zeigt stattdessen die Leistung.
 *
 * ★★★ B10 (11.09.2026): SCHLANK. Weg sind Textstufe, Geburtsjahr, Sprache samt
 * Sperre und „Diese Einstellungen für alle übernehmen" - alle vier gelten jetzt
 * für die ganze Klasse (Kasten „Einstellungen der Klasse", seit 11.09.2026
 * ganz unten nach der Tabelle).
 * Der Knopf „für alle" war ihr Werkzeug: Er übertrug genau diese vier Werte von
 * einem Kind auf alle anderen. Was die Klasse als Ganzes trägt, braucht ihn
 * nicht mehr.
 *
 * Geblieben ist, was WIRKLICH je Kind gilt: „Womit anfangen?" (der Stand dieses
 * einen Kindes), „Einhand schreiben" und „Tempo zählt nicht" - zwei
 * Arbeitsweisen, die an der Person hängen und nicht an der Klasse.
 *
 * Auf schmalen Geräten steht ein Feld je Zeile mit seiner Beschriftung darüber
 * (§4.5a, letzter Absatz) - das macht `flex-wrap` mit `min-w` von selbst.
 */
/**
 * Der WIRKSAME Stand von „Womit anfangen?" (siehe {@link startAnzeige}) samt
 * seiner Beschriftung - EINE Stelle für das Auswahlfeld UND die Kennzahl der
 * Ausklapp-Zeile „Einstellungen für …" (E4, 18.09.2026), statt zweier
 * Rechnungen, die sich unbemerkt auseinanderleben könnten
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ★ „Womit anfangen?" zeigt, wo das Kind WIRKLICH steht - nicht, was zuletzt
 *   eingetragen wurde. Ein Kind, das sich längst weitergeübt hat, stünde
 *   sonst ewig auf „Anfänger: nur F und J", und die Lehrkraft läse eine Zahl,
 *   die niemanden mehr beschreibt. Genommen wird die höchste benannte Stufe,
 *   die der Stand schon trägt (dieselbe Rechnung wie im Zahnrad der Kinder,
 *   TippenTrainerPage).
 */
function womitAnfangenStand(
  data: PupilData,
  klasse: TypingClass | null,
  /** ★ EN6a: Die Beschriftung folgt der Bedienung (`startPoints(sprache)`). */
  sprache: BedienSprache = "de",
) {
  // ★ S1 (28.09.2026): der Startpunkt, wie er auf dem Weg des Kindes gilt -
  // ein Beschluss von einem anderen Weg zählt hier nicht (`wegWechsel.ts`).
  const pupil = startpunktImWeg(data.pupil, data.progress);
  // ★ E1 (24.09.2026): die Startpunkte im Weg DES KINDES - `startUnits` ist
  // eine Anzahl in ihm (Bauplan englischer Lehrgang §2.4).
  const kindWeg = lernwegAus(pupil, data.progress);
  const starts = startPunkte(sprache, kindWeg);
  /*
   * ★★★ MIT DER VORGABE DER KLASSE (11.09.2026, Nacht - Prüfbefund). Bis dahin
   * stand hier nur `pupil.startUnits`: Die Lehrkraft sah „Anfänger", während
   * das Kind beim nächsten Öffnen die höhere Vorgabe der Klasse bekam - zwei
   * Stellen, die dieselbe Frage verschieden beantworten
   * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]). Jetzt dieselbe
   * Regel wie beim Kind (`startpunktMitKlasse`): Die vorgewählte Stufe ist die
   * wirksame. Damit fragt auch „zurückstufen?" nur, wenn es wirklich zurückgeht.
   *
   * ★★★★★ Befund 18.09.2026: Ein Zurückstufen WIRKT sofort (das Kind bekommt
   * es beim nächsten Öffnen), nur die ANZEIGE hier hinkte hinterher - sie las
   * `introduced`, und das schrumpft erst, wenn das Kind die Seite selbst lädt.
   * `startAnzeige` sagt darum auch, ob ein eigener Beschluss noch AUSSTEHT.
   */
  const anzeige = startAnzeige(
    pupil,
    klasse,
    // ★ D-1 (28.09.2026): in der Startpunkt-Zählung, nicht die Länge (letters.ts).
    startpunktStand(data.progress.introduced, kindWeg),
    data.progress.startAngewandtAm,
  );
  const startWahl = (starts.filter((sp) => sp.units <= anzeige.stand).pop() ?? starts[0]).units;
  const label = starts.find((sp) => sp.units === startWahl)?.label ?? "";
  return { starts, startWahl, stand: anzeige.stand, label, ausstehend: anzeige.ausstehend };
}

function PupilEinstellungen({
  data,
  h,
  klasse,
}: {
  data: PupilData;
  h: EinstellHandler;
  /** Die Klasse - ihre Vorgabe gehört zu dem, was das Kind wirklich bekommt. */
  klasse: TypingClass | null;
}) {
  const { pupil } = data;
  const { t, sprache } = useReiterTexte();
  const { starts, startWahl, stand, label, ausstehend } = womitAnfangenStand(
    data,
    klasse,
    sprache,
  );
  const ausstehendId = `mk-tf-start-ausstehend-${pupil.id}`;
  // ★ Gezielt üben: der Vorschlag im Dialog sind die wackligen Tasten dieses Kindes (dieselbe Auswahl wie die Zeile
  // „Wacklige Tasten"), soweit aus seinen geladenen Daten berechenbar.
  const gezieltVorschlag = useMemo(() => {
    try {
      const weg = lernwegAus(pupil, data.progress);
      const eingefuehrt = ensureIntroduced(data.progress.introduced, weg);
      return weakestKeys(
        data.progress.letters,
        eingefuehrt,
        { lernweg: weg, stufe: stufeFuer(mitKlassenVorrang(pupil, klasse)) },
        8,
      )
        .map((wt) => wt.unit)
        .filter((u) => [...u].length === 1 && u.trim() !== "");
    } catch {
      return [];
    }
  }, [pupil, data.progress, klasse]);
  // ★ E11a-5: Tabelle - bis dahin bekam „fr" die DEUTSCHEN Stufen (Falle 30).
  // ★ ES-O (27.09.2026): die gemeinsame Tabelle aus `zeichenabstand.ts`.
  const abstandLabels = ZEICHENABSTAND_LABELS_JE_SPRACHE[sprache];

  return (
    // ★ R6 (11.09.2026): ein Unterbereich der aufgeklappten Zeile - Haarlinie
    // statt eigenem Kasten (Begründung an der Zeile in `PupilRow`).
    <div className="space-y-2 border-t border-hairline pt-3">
      <h3 className="m-0 text-sm font-semibold text-ink">{t.einstellungen}</h3>
      <div className="flex flex-wrap items-start gap-3">
        {/*
          ════════════════════════════════════════════════════════════════════
          ★★★ VORKENNTNISSE - „Womit anfangen?" (01.09.2026)
          ════════════════════════════════════════════════════════════════════
          Testerin: *„Klassiker bei uns ist, dass Schüler zwar die Buchstaben
          können, aber nicht die Ziffern. Das hätte ich gern zum Auswählen."*

          ★ DIESELBE Beschriftung wie im Zahnrad der Kinder („Womit
            anfangen?"). Zwei Wörter für eine Sache wären genau die Doppelung,
            die sich am zweiten Tag auseinanderlebt.

          ★ B8 (11.09.2026): Für die GANZE Klasse steht dieselbe Wahl jetzt
            im Kasten „Einstellungen der Klasse" (seit 11.09.2026 abends ganz
            unten, nach der Tabelle) - mit Rückfrage, weil sie
            dort 24 Kinder auf einmal betrifft. Hier bleibt sie für das eine
            Kind, das eine Ausnahme braucht.
        */}
        <Feld beschriftung={t.womitAnfangen}>
          {/*
            ★★★ ZURÜCKSTUFEN, MIT RÜCKFRAGE (04.09.2026, Johannes: „Lehrer
            dürfen ihre Schüler auch downgraden … hatten gerade das Problem mit
            dem Schüler Said, das Startlevel war zu hoch eingestellt").

            ⚠️ Die Rückfrage steht hier, weil der Grund für die alte Sperre
            weiterbesteht: Ein Kind, das sich weit geübt hat, verlöre durch
            einen Fehlgriff seinen Übungsstoff. Nur ist die Antwort darauf
            nicht mehr „geht nicht", sondern „nicht aus Versehen". Sie nennt
            deshalb beides: was zurückgeht und was bleibt.

            ★ E12 (19.09.2026): der Hinweis hing bis dahin als eigener Absatz
            unter dem Feld (`Feld`s alte `hinweis`-Eigenschaft) - jetzt an der
            Auswahl selbst (`Tipp`). Ist ein Beschluss noch ausstehend, trägt
            die Auswahl BEIDE Beschreibungen (`hinweisId` UND `ausstehendId`).
          */}
          <Tipp text={t.womitTipp}>
            {(hinweisId) => (
              <select
                className="field-input feld-schlank"
                value={String(startWahl)}
                onChange={(e) => {
                  const units = Number(e.target.value);
                  const ziel = starts.find((sp) => sp.units === units);
                  if (units < stand) {
                    if (
                      !window.confirm(
                        t.zurueckstufenFrage(pupil.name, label, String(ziel?.label ?? units)),
                      )
                    )
                      return;
                  }
                  h.onSetStartUnits(
                    pupil.id,
                    pupil.name,
                    units,
                    ziel?.label ?? "",
                    units < stand,
                  );
                }}
                aria-label={t.womitName(pupil.name)}
                aria-describedby={ausstehend ? `${hinweisId} ${ausstehendId}` : hinweisId}
              >
                {starts.map((sp) => (
                  <option key={sp.key} value={sp.units}>
                    {sp.label}
                  </option>
                ))}
              </select>
            )}
          </Tipp>
          {/*
            ★★★★★ 18.09.2026: Ein eigener Beschluss steht noch aus - das Feld
            zeigt schon die niedrigere Stufe (siehe `startAnzeige`), aber das
            Kind hat Tastenflow seither nicht geöffnet. Ohne diesen Satz sähe
            die Lehrkraft eine Zahl, ohne zu wissen, dass sie noch nicht gilt.
            ⚠️ Keine Live-Region: Der Satz hängt an der Auswahl selbst
            (`aria-describedby`), nicht an einer Stelle, die vorgelesen wird,
            sobald sie erscheint. Das ist ein STATUS, kein Absatz, der die
            Bedienung erklärt - er bleibt darum sichtbar (siehe „Immer" oben).
          */}
          {ausstehend && (
            <p id={ausstehendId} className="m-0 mt-0.5 text-sm text-ink-muted">
              {t.ausstehend(pupil.name)}
            </p>
          )}
        </Feld>
        {/*
          ★★★ EIGENE SCHULSTUFE (25.09.2026, Johannes: „ich brauch bei
          einzelnen Schülern auch die Möglichkeit, die Schulstufe noch
          anzupassen"). Die Klasse hat EINE Schulstufe (B9, 11.09.); hier die
          Ausnahme für das eine Kind - dasselbe Muster wie „Womit anfangen?".
          Erste Wahl „wie die Klasse (…)" nimmt die Ausnahme zurück. Gezeigt
          wird die HEUTIGE Stufe (sie wächst mit, wie die der Klasse).
        */}
        <Feld beschriftung={t.schulstufeKind}>
          <Tipp text={t.schulstufeKindTipp}>
            {(hinweisId) => (
              <select
                className="field-input feld-schlank"
                value={String(
                  hatEigeneSchulstufe(pupil)
                    ? (aktuelleSchulstufe({
                        schulstufe: pupil.schulstufe,
                        schulstufeSchuljahr: pupil.schulstufeSchuljahr,
                        // ★ D2: das Schuljahr der Klasse zählt auch für das Kind.
                        settings: klasse?.settings,
                      }) ?? 0)
                    : 0,
                )}
                onChange={(e) => h.onSetSchulstufe(pupil.id, pupil.name, Number(e.target.value))}
                aria-label={t.schulstufeKindName(pupil.name)}
                aria-describedby={hinweisId}
              >
                <option value="0">
                  {t.wieDieKlasse(schulstufeText(aktuelleSchulstufe(klasse), sprache))}
                </option>
                {SCHULSTUFEN_WAHL.map((s) => (
                  <option key={s.wert} value={s.wert}>
                    {sprache === "cs"
                      ? // ★ O-CS (03.10.2026): „7. ročník ZŠ" (vorher fiel cs auf das deutsche Label).
                        schulstufeLabelCs(s.wert)
                      : sprache === "pl"
                      ? schulstufeLabelPl(s.wert)
                      : sprache === "tr"
                      ? schulstufeLabelTr(s.wert)
                      : sprache === "it"
                      ? schulstufeLabelIt(s.wert)
                      : sprache === "fr"
                      ? schulstufeLabelFr(s.wert)
                      : sprache === "es"
                        ? schulstufeLabelEs(s.wert)
                        : sprache === "en"
                          ? schulstufeLabelEn(s.wert)
                          : sprache === "de"
                            ? s.label
                            : schulstufeText(s.wert, sprache) /* ★ SPRACHEN-9 (30.10.2026): die neun, sonst deutscher Name */}
                  </option>
                ))}
              </select>
            )}
          </Tipp>
        </Feld>
        {/*
          ★★★ W2b (28.09.2026, Johannes: gemischte Klassen): der LEHRGANG je
          Kind - Deutsch, Englisch, Französisch (Spanisch mit Schalter). Mit
          Rückfrage (Tastatur, bisheriger Stand bleibt) in `WegJeKind`.
        */}
        <Feld beschriftung={WEG_TEXTE[sprache].feld}>
          <WegJeKind pupil={pupil} onSetLernweg={h.onSetLernweg} />
        </Feld>
      </div>

      {/*
        ★ E12 (19.09.2026): Die drei Sätze, die hier bis dahin als eigene
        Absätze UNTER den drei Feldern standen, hängen jetzt an jedem Feld
        selbst (`Tipp` an Kästchen/Auswahl, nicht am `<label>` - ein Hinweis
        im Label bricht `getByLabelText`, UEBERGABE-2026-09-10-ABEND §5).
      */}
      <div className="flex flex-wrap gap-x-6 gap-y-1.5">
        {/*
          ★ 19.09.2026, Johannes: „es fehlt die Mouse-over-Erklärung bei ‚Tempo
          zählt nicht'; ‚Einhand schreiben'". Der Hinweis hing nur am 16-px-
          Kästchen - wer auf den TEXT zeigte, sah nichts. Seither umschliesst
          der `Tipp` das ganze Feld (Kästchen + Text). Die alte Sorge „ein
          Hinweis im Label bricht getByLabelText" gilt seit K1 nicht mehr: der
          Kasten steht im Portal `#hinweis-ebene`, nicht im Label.
          `ausrichtung="links"` (E12, 700 px): das Feld steht am linken Rand.
        */}
        <Tipp text={t.einhandTipp} ausrichtung="links">
          {(hinweisId) => (
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={!!pupil.oneHand}
                onChange={(e) => h.onSetOneHand(pupil.id, e.target.checked)}
                aria-label={t.einhandName(pupil.name)}
                aria-describedby={hinweisId}
              />
              {t.einhand}
            </label>
          )}
        </Tipp>
        <Tipp text={t.tempoTipp} ausrichtung="links">
          {(hinweisId) => (
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={!!pupil.noTimePressure}
                onChange={(e) => h.onSetNoTimePressure(pupil.id, e.target.checked)}
                aria-label={t.tempoName(pupil.name)}
                aria-describedby={hinweisId}
              />
              {t.tempoZaehltNicht}
            </label>
          )}
        </Tipp>
        {/*
          ════════════════════════════════════════════════════════════════════
          ★★★ „ZEICHENABSTAND GROSS (CVI)" (E11, 18./19.09.2026)
          ════════════════════════════════════════════════════════════════════
          Johannes: *„neben dem Schalter 'Zeit lassen' und 'Einhand' brauchen
          wir noch 'Zeichenabstand groß (CVI)', und alle Abstände werden
          dreimal so groß"* - dann: *„machen wir vielleicht 3 Stufen: doppelt,
          dreifach, vierfache Laufweite"*. Ein Auswahlfeld statt eines
          Häkchens, weil es VIER Werte sind, nicht zwei - dieselbe Arbeitsweise
          wie „Womit anfangen?" oben.
          ★ Seit 19.09.2026 stellt das Kind ihn AUCH selbst im Zahnrad ein
          (Johannes: „Kinder dürfen es ändern wie sie möchten") - wer zuletzt
          stellt, gilt; der Tipp `abstandTipp` sagt das der Lehrkraft.
        */}
        <label className="flex items-center gap-2 text-sm text-ink">
          {t.abstand}
          <Tipp text={altAnzeige(t.abstandTipp, istMacSystem(), WAHLTASTE[sprache])}>
            {(hinweisId) => (
              <select
                className="field-input feld-schlank"
                value={String(pupil.zeichenabstand ?? 1)}
                onChange={(e) => h.onSetZeichenabstand(pupil.id, Number(e.target.value))}
                aria-label={t.abstandName(pupil.name)}
                aria-describedby={hinweisId}
              >
                {ZEICHENABSTAND_FAKTOREN.map((f) => (
                  <option key={f} value={f}>
                    {abstandLabels[f]}
                  </option>
                ))}
              </select>
            )}
          </Tipp>
        </label>
      </div>
      {/* ★ Gezielt üben (13.11.2026, Bauplan §5): eine Zeile je Kind - eigener Wert, wie die Klasse oder aus. */}
      <GezieltKindZeile
        name={pupil.name}
        kind={pupil.gezielt}
        klasse={klasse?.gezielt}
        vorschlag={gezieltVorschlag}
        onSpeichern={(g) => h.onSetGezielt(pupil.id, pupil.name, g)}
      />
    </div>
  );
}

/**
 * ★★ Die klebende erste Spalte (01.09.2026).
 *
 * Johannes: *„beim nach links scrollen soll der nahme (erste spalte) stehen
 * bleiben."* Knopf und Name kleben am linken Rand; die Zahlen wandern darunter
 * durch.
 *
 * ⚠️ Die Knopfspalte hat eine FESTE Breite (`w-14` = 3,5 rem), weil die
 * Namensspalte mit `left-14` genau daran andockt. Wer die eine ändert, muss
 * die andere mitändern - sonst entsteht eine Lücke oder eine Überdeckung.
 *
 * ⚠️ `bg-*` ist Pflicht und muss DECKEND sein: Eine durchscheinende Farbe
 * liesse die durchwandernden Zahlen unter dem Namen sichtbar werden.
 */
/*
 * ★ A5 (11.09.2026): Der Grundwert bleibt `z-10` - der Aufstieg auf `z-20`
 * beim Zeigen und beim Fokus steht in `KLEBT_HINWEIS_OBEN` darunter und gilt
 * NUR für die Zellen der Zeilen, nicht für die Ecken der Kopfzeile.
 */
const KLEBT_KNOPF = "sticky left-0 z-10 w-14 min-w-14 !pr-0";
const KLEBT_NAME = "sticky left-14 z-10";

/**
 * ★★ A5 (11.09.2026): `hover:z-20 focus-within:z-20` gegen die Falle der
 * klebenden Zellen. Jede klebende Zelle ist ein EIGENER Stapelkontext
 * (`z-10`, alle gleich); im DOM steht die Zeile darunter später und malt mit
 * demselben `z-10` über den Glocken-Hinweis der Zeile davor - im Screenshot
 * vom 11.09. war die linke Hälfte des Hinweises verdeckt. Die Zeile mit
 * offenem Hinweis bekommt darum kurzzeitig einen höheren Stapel als ihre
 * Nachbarn.
 *
 * ⚠️ `focus-within`, nicht `[&:has(:focus-visible)]`: `Tipp.tsx` öffnet den
 * Hinweis schon beim gewöhnlichen `focus` (Absicht dort, siehe die
 * Begründung an `Tipp`, „bei `focus`, nicht nur bei `focus-visible`") - ein
 * `:has(:focus-visible)` liesse den Hinweis dann OHNE das nötige `z-20`
 * offen stehen, sobald der Fokus per Mausklick kommt.
 *
 * Der Aufstieg gehört an die Zellen der ZEILEN - und nur dorthin.
 *
 * ⚠️ Er stand zuerst in `KLEBT_KNOPF`/`KLEBT_NAME` und lief damit auch an den
 * beiden ECKEN der Kopfzeile mit. Das ist keine Kleinigkeit: `hover:z-20`
 * (Klasse + Pseudoklasse) schlägt die Kopf-Regel `[&>th]:z-30` (Klasse +
 * Element), die Ecke fiele beim blossen Zeigen also von 30 auf 20 zurück -
 * unter die übrigen Kopfzellen, die dann beim seitlichen Schieben über sie
 * hinweggingen. Gemessen im Browser am 11.09.2026.
 */
const KLEBT_HINWEIS_OBEN = "hover:z-20 focus-within:z-20";

/**
 * ★ T1 (19.09.2026): Die beiden klebenden Zellen tragen ihren Zebra-Grund
 * SELBST (deckend, siehe `zebra`) - der Grund der Zeile beim Zeigen käme bei
 * ihnen nie an. Sie hören darum auf die Gruppe `zeile` am `<tr>`.
 * ⚠️ Derselbe deckende Ton wie `hover:bg-accent-soft` an der Zeile - ein
 * durchscheinender liesse beim seitlichen Schieben die Zahlen durchwandern.
 */
const ZEILE_ZEIGEN = "group-hover/zeile:bg-accent-soft";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ DIE KOPFZEILE KLEBT AUCH NACH OBEN (Johannes, 01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 * *„setze die Tabellenüberschriften genauso wie die Namensspalte als fix beim
 * Scrollen."*
 *
 * ⚠️ DAS GEHT NUR ZUSAMMEN MIT EINER HÖHE AM KASTEN. `position: sticky` misst
 * am nächsten SCROLLENDEN Vorfahren. Der Kasten um die Tabelle trägt
 * `overflow-x: auto` (für das seitliche Schieben) und ist damit schon ein
 * solcher Vorfahre - nur scrollt er senkrecht gar nicht, weil er keine Höhe
 * hat. Ein `top-0` daran wäre wirkungslos: Die Kopfzeile klebte an einem
 * Kasten, der selbst mit der Seite wegwandert.
 *
 * ⇒ Der Kasten bekommt `max-h-[70vh]`. Ab da scrollt die TABELLE in ihm, und
 *   die Kopfzeile bleibt stehen - genau wie die Namensspalte beim seitlichen
 *   Schieben. Bei wenigen Kindern greift die Höhe nicht; die Tabelle ist dann
 *   so hoch wie ihr Inhalt.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ B12 (11.09.2026): DIE STAPELORDNUNG STEHT AN DEN ZELLEN, NICHT AN DER
 * ZEILE (bis T1 am 19.09.2026 mit ZWEI sichtbaren Kopfzeilen, seither einer)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Befund des E1-Prüfers (Punkt 8, im Browser mit `elementFromPoint` gemessen):
 * Beim seitlichen Schieben wanderte die Spalte „Tasten" ÜBER die klebende Ecke
 * „Name". Ursache: Die Regel `[&>th]:z-30` an der Kopfzeile (Klasse + Element)
 * ist stärker als ein `z-30` an der Zelle selbst - alle Kopfzellen lagen damit
 * auf demselben Wert, und bei Gleichstand entscheidet die Reihenfolge im DOM.
 * „Tasten" steht später als „Name".
 *
 * ⇒ Die Zeile setzt kein `z` und keinen Grund mehr. Jede Kopfzelle bringt beides
 *   selbst mit, und die beiden ECKEN liegen ausdrücklich höher:
 *
 *     Zellen der Zeilen      z-10, beim Zeigen/Fokus z-20 (`KLEBT_HINWEIS_OBEN`)
 *     Kopfzellen             z-30            ({@link KOPF_ZELLE})
 *     die beiden Ecken       z-[35]          ({@link KLEBT_KNOPF_KOPF})
 *     Seiten-Kopfzeile       z-40            (`Layout.tsx` - nicht überholen)
 *
 * ⚠️ DECKEND, nicht durchscheinend: Eine klebende Zelle verlässt beim Scrollen
 * ihren Platz in der Zeile; der Grund der `<tr>` wandert NICHT mit. Ein
 * durchsichtiger Kopf liesse die Zahlen unter sich durchscheinen.
 *
 * ★ T1 (19.09.2026): Seither gibt es nur noch EINE sichtbare Kopfzeile (bei
 * `top-0`). Die Gruppenzeile „Üben"/„Prüfung" steht weiter im Baum, aber nur
 * für die Sprachausgabe und ohne Höhe - sie klebt nicht und braucht darum
 * kein `top` (siehe {@link GRUPPEN_TRENNER}).
 */
/**
 * Was JEDE sichtbare Kopfzelle trägt - ausser `z` (Ecken liegen höher) und
 * `left` (nur die Ecken).
 *
 * ★ T1 (19.09.2026), Johannes zum Entwurf „Meine Klassen": *„die Tabelle in
 * deinem Entwurfsvorschlag ist viel schlanker und schöner"* - fette,
 * schlichte Beschriftung, keine Tönung, keine gepunktete Unterlinie; die
 * Linie darunter hängt an der Zelle und klebt darum mit.
 *
 * Seit T1 tragen ALLE Kopfzellen denselben deckenden Grund - die getönte
 * Gruppe „Üben" gibt es nicht mehr. Die frühere Warnung („der Grund steht
 * bewusst nicht hier", 11.09.2026: zwei `bg-*` an einem Element entscheidet
 * die Reihenfolge im Stylesheet, nicht die im `class`) gilt weiter: Wer einer
 * einzelnen Kopfzelle einen ANDEREN Grund geben will, nimmt ihn hier heraus.
 */
const KOPF_GRUND =
  "sticky top-0 border-b border-hairline bg-surface-raised px-3 py-2.5 font-bold text-ink-soft";
const KOPF_ZELLE = `${KOPF_GRUND} z-30`;
/** Die beiden Ecken der Kopfzeile: kleben nach oben UND nach links, über allem. */
const KLEBT_KNOPF_KOPF = `${KOPF_GRUND} left-0 z-[35] w-14 min-w-14 !pr-0`;
const KLEBT_NAME_KOPF = `${KOPF_GRUND} left-14 z-[35]`;
/**
 * ★ T1: Die Zellen der unsichtbaren Gruppenzeile - ohne Innenabstand, ohne
 * Linie, ohne Höhe. Ihr Inhalt steht `sr-only` (absolut, nimmt keinen Platz),
 * darum ist die ganze Zeile 0 px hoch (im Browser gemessen).
 */
const GRUPPE_UNSICHTBAR = "h-0 border-0 p-0";

/**
 * Der Zebra-Grund einer Zeile. Zwei Töne des Hauses, die sich nur leicht
 * unterscheiden: Er soll die Zeile halten, nicht die Aufmerksamkeit auf sich
 * ziehen.
 *
 * ⚠️⚠️ BEIDE MÜSSEN DECKEND SEIN - gemessen am 01.09.2026 im Browser.
 * Hier stand zuerst `bg-surface-sunken/60`. Das ist zu 40 % durchsichtig, und
 * weil derselbe Ton auch die KLEBENDEN Zellen trägt, wanderten beim seitlichen
 * Schieben die Zahlen sichtbar unter dem Namen durch. In jsdom fällt das nie
 * auf: Die Klasse steht ja da, gerechnet wird nichts. ⇒ Kein `/40`, `/60`,
 * `/80` an dieser Stelle, nie.
 */
/** Keine Tippchallenge - ein fester Wert, damit keine Zeile bei jedem Bild neu rechnet. */
const KEINE_PROBEN: readonly Probenergebnis[] = [];
/** ★ W3a: keine gesperrten Zeiten - derselbe Grund wie {@link KEINE_PROBEN}. */
const EMPTY_GESPERRT: readonly GesperrteZeit[] = [];
/** ★ E9: keine Klassenmatch-Anzahl geladen - derselbe Grund wie {@link KEINE_PROBEN}. */
const KEIN_MATCH_ANZAHL: Readonly<Record<string, number>> = {};

/**
 * ★ Klassenmatch-Zahl (21.09.2026): wie viele Klassenmatches ein Kind bis zum
 * Ende gespielt hat - die Summe ALLER Wochen, die der Server liefert. EINE
 * Rechnung für die Tabellenspalte, die Sortierung und den Zähler in der
 * aufgeklappten Zeile, damit die drei nie auseinanderlaufen.
 *
 *   - `wochen === null` ⇒ `null`: unbekannt (nicht geladen oder nicht abrufbar).
 *     Eine Null wäre hier eine Behauptung.
 *   - Geladen, aber das Kind steht nicht in der Antwort ⇒ 0: Der Server führt
 *     nur Kinder mit mindestens einem Match (`tt_match_anzahl_lib.pb.js`); wer
 *     fehlt, hat keins gespielt. Der Aufrufer reicht dafür `KEIN_MATCH_ANZAHL`.
 *   - Summe 0 in einer Klasse mit abgeschaltetem Klassenmatch ⇒ `null`: dort
 *     wäre „0" Lärm, nicht Auskunft.
 */
function klassenmatchSumme(
  wochen: Readonly<Record<string, number>> | null,
  matchAus: boolean,
): number | null {
  if (wochen === null) return null;
  const summe = Object.values(wochen).reduce((a, n) => a + n, 0);
  return summe === 0 && matchAus ? null : summe;
}

function zebra(index: number): string {
  return index % 2 === 1 ? "bg-surface-sunken" : "bg-surface-raised";
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ DIE GRUPPE „ÜBEN" (B2, Johannes am 11.09.2026; schlank seit T1)
 * ════════════════════════════════════════════════════════════════════════════
 * *„die drei spalten so gestalten, vielleicht farbig, dass sie zusammengehören."*
 *
 * Treffsicherheit · Anschl./Min · Score kommen aus DERSELBEN Quelle: dem Üben
 * im gewählten Zeitraum. Der Score ist sogar aus den beiden anderen gerechnet.
 * Die Spalte „Tippchallenge" daneben ist etwas anderes - eine Prüfung an einem
 * bestimmten Tag -, und wer beide nebeneinander liest, soll das sehen.
 *
 * ── ★ T1 (19.09.2026): NUR NOCH ZWEI FEINE LINIEN ──────────────────────────
 * Johannes zum Entwurf „Meine Klassen": *„viel schlanker und schöner"* - dort
 * trennt nur je eine senkrechte Haarlinie die Gruppen (vor „Treffsicherheit"
 * und vor „Tippchallenge"); die blaue Gruppenzeile und die Tönung sind weg.
 *
 * Die Farbe trug schon vorher nie allein (WCAG 1.4.1). Übrig sind zwei Träger:
 *   1. die Linie - auch im Windows-Kontrastmodus (`forced-colors` färbt
 *      Rahmen in der Systemfarbe, er löscht sie nicht);
 *   2. die Gruppen-Überschrift „Üben"/„Prüfung" für die Sprachausgabe: eine
 *      eigene Kopfzeile OHNE Höhe mit `scope="colgroup"` über den echten
 *      `<colgroup>`-Zeilen (ohne sie wäre `scope="colgroup"` ein Zeiger ins
 *      Leere, Prüfer 11.09.2026). Ihr Hinweis bleibt über `aria-describedby`
 *      erreichbar - dieselben Sätze wie in der Legende der Excel-Datei.
 */
const GRUPPEN_TRENNER = "border-l border-hairline";

function PupilRow({
  data,
  h,
  index,
  spalten,
  zeigeWochenziel,
  onSetWochenziel,
  onResetOverdue,
  onSetExcusedWeeks,
  bezug,
  onBezug,
  startwoche,
  zeitraum,
  vergleich,
  vergleichsZeilen,
  vergleichsName,
  proben,
  matchAnzahl,
  klasse,
  markiert,
  onMarkieren,
}: {
  /** ★ Gezielt üben (13.11.2026): ist dieses Kind für die Sammelaktion markiert? */
  markiert: boolean;
  onMarkieren: (id: string, an: boolean) => void;
  data: PupilData;
  h: EinstellHandler;
  /** Die Klasse - für den wirksamen Startpunkt in „Womit anfangen?" (11.09.2026, Nacht). */
  klasse: TypingClass | null;
  /** Die wievielte Person - entscheidet über den Zebra-Grund. */
  index: number;
  /** Wie viele Spalten die Tabelle hat - für den `colSpan` der Aufklapp-Zeile. */
  spalten: number;
  /** Steht die Spalte „Wochenziel" überhaupt da? */
  zeigeWochenziel: boolean;
  /** F13 - womit verglichen wird. Kommt von oben, damit alle Karten gleich sind. */
  bezug: Bezug;
  onBezug: (b: Bezug) => void;
  /** Die Startwoche der KLASSE (F19) - einmal gerechnet, an alle gereicht. */
  startwoche: Startwoche | null;
  /** Welcher Ausschnitt oben im Zeitraum-Kopf steht. */
  zeitraum: Zeitraum;
  /** Die Werte des Zeitraums DAVOR - Grundlage der Pfeile. */
  vergleich: PupilStats | null;
  /**
   * ★ K4-Folge (19.09.2026): wie viele Zeilen im Zeitraum DAVOR liegen - nur
   * für „Monat" gebraucht (siehe `zeilenWerte`, `vergleichGueltig`).
   */
  vergleichsZeilen: number;
  /** „der Woche davor", „Schuljahr 2025/26" - oder leer bei „Gesamt". */
  vergleichsName: string;
  /**
   * ★ Die Tippchallenges dieses Kindes (Johannes 10.09.2026: *„»Tippchallenge«
   * 3 / 82 … bei jedem schüler (wen man ausklappt) sieht man dann genau an
   * welchem Tag eine challenge war"*). Unabhängig vom Zeitraum-Kopf: Eine
   * Challenge ist ein Ereignis, kein Übungsstand einer Woche.
   */
  proben: readonly Probenergebnis[];
  /**
   * ★ E9 (19.09.2026): Klassenmatch-Anzahl DIESES Kindes, Woche → Zahl -
   * derselbe Schlüssel wie {@link uebungsperioden}. Einmal je Klassenansicht
   * geladen (siehe `TastenflowReiter`), hier nur durchgereicht.
   * ★ M3: `null` = (noch) unbekannt - nicht geladen oder nicht abrufbar.
   */
  matchAnzahl: Readonly<Record<string, number>> | null;
  onSetWochenziel: (
    id: string,
    name: string,
    ziel: { minuten: number; wochen: string[]; nachholen: boolean },
  ) => Promise<void>;
  onResetOverdue: (id: string, name: string) => void;
  onSetExcusedWeeks: (id: string, weeks: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const { pupil } = data;
  const { t, sprache } = useReiterTexte();
  const gezieltTexte = GEZIELT_LEHRKRAFT_TEXTE[sprache];
  const gesperrt = klasse?.gesperrteZeiten ?? EMPTY_GESPERRT;
  /** ★ Die Zahl der Spalte „Klassenmatch" - `null` = Strich (siehe `klassenmatchSumme`). */
  const matchSummeZeile = klassenmatchSumme(matchAnzahl, !!klasse?.klassenmatchAus);
  const w = useMemo(
    () =>
      zeilenWerte(data, Date.now(), gesperrt, zeitraum, vergleich, vergleichsZeilen, sprache),
    [data, gesperrt, zeitraum, vergleich, vergleichsZeilen, sprache],
  );
  /*
    ★ EN6a (19.09.2026): Die Gründe des Eigenständigkeits-Checks in der
    Bedienungssprache - für die Marke in der Namenszeile (E10) UND die
    aufgeklappte Zeile. Übersetzt an EINER Stelle, siehe
    `eigenstaendigkeitsGrundEn`.
  */
  const gruende = useMemo(
    () => gruendeIn(data.stats.suspicion.reasons, sprache),
    [data.stats.suspicion.reasons, sprache],
  );
  const grund = zebra(index);
  /*
    Womit verglichen wird - der Satz am Hinweis muss es benennen, sonst ist
    „+3 %" eine Zahl ohne Bezug. Bei Woche UND Monat (K4-Folge, 19.09.2026)
    kommt er von oben (Vorwoche bzw. den 4 Wochen davor) - beide vergleichen
    den Zeitraum mit einem gleich breiten Davor. Bei Schuljahr/Gesamt kommt er
    aus der Ausgangswoche dieser Person - sie ist je Kind eine andere.

    ★ K4: Ab 5 Übungswochen vergleicht `entwicklungImZeitraum` (nur noch bei
    Schuljahr/Gesamt) nicht mehr Woche gegen Woche, sondern die ersten 4
    Übungswochen gegen die letzten 4 (`w.vierWochenBlock`) - der Satz muss
    sagen, WELCHER Vergleich gemeint ist, sonst liest sich „den 4 Wochen" wie
    eine einzelne Woche.
  */
  const bezugstext =
    zeitraum.art === "woche" || zeitraum.art === "monat"
      ? vergleichsName
      : w.ausgangswoche
        ? (w.vierWochenBlock ? t.bezugBlock : t.bezugWoche)(
            // ★ EN6a: englisch „10 Aug" - so passt der Name hinter *than in …*
            // (*the week of 10 Aug*, Glossar §3.2). ★ E11a-5: französisch
            // „10 aout" (bis dahin das deutsche „10.08.").
            // ★ O-TR (02.10.2026): "10 Ağu" (fmtTagMonat kennt tr).
            // ★ O-CS (03.10.2026): „14. 9." (fmtTagMonat kennt cs).
            // ★ O5 (30.10.2026): die neun ebenso (`fmtTagMonat` kennt sie).
            istGeruestSprache(sprache) || sprache === "fr" || sprache === "es" || sprache === "it" || sprache === "pl" || sprache === "tr" || sprache === "cs"
              ? fmtTagMonat(w.ausgangswoche, sprache)
              : sprache === "en"
                ? datumKurzEn(w.ausgangswoche)
                : new Date(w.ausgangswoche).toLocaleDateString("de-AT", {
                    day: "2-digit",
                    month: "2-digit",
                  }),
          )
        : "";
  /*
    ★ K4-Folge: „Monat" zeigt den Pfeil wie „Woche" - Wert und die Richtung
    dahinter reichen (Zeitraum gegen gleich breites Davor), keine zweite
    Zahl. Nur Schuljahr/Gesamt zeigen „Wert | Veränderung" - dort GIBT es
    kein gleich breites Davor, das die zweite Zahl liefern könnte.
  */
  const alsPfeil = zeitraum.art === "woche" || zeitraum.art === "monat";
  return (
    <>
      {/*
        ★ T1 (19.09.2026): `whitespace-nowrap` und die hochlesbare Schrift des
        Entwurfs (`font-legible`, Atkinson Hyperlegible, mitgeliefert - siehe
        `index.css`) an der ZEILE (beides vererbt sich auf alle Zellen) statt
        am `tbody` - die aufgeklappte Zeile darunter soll umbrechen dürfen und
        bleibt in der Schrift der Seite. `group/zeile`: Beim Zeigen hebt sich die ganze Zeile
        ab, auch die beiden klebenden Zellen (sie tragen ihren Grund selbst
        und hören darum auf die Gruppe, nicht auf die Zeile).
      */}
      <tr className={`group/zeile ${grund} whitespace-nowrap font-legible hover:bg-accent-soft`}>
        <td className={`${KLEBT_KNOPF} ${KLEBT_HINWEIS_OBEN} ${grund} ${ZEILE_ZEIGEN}`}>
          <EinstellungenKnopf
            name={pupil.name}
            open={open}
            onToggle={() => setOpen((o) => !o)}
          />
        </td>
        {/*
          ★ T1: der Name fett, die Zeichen gleich daneben (Glocke mit
          Nachrichten-Zahl) - wie im Entwurf. Mittig bleibt er trotzdem
          (Johannes 10.09.2026: „alle Tabellenspalten überall mittig").
        */}
        <th
          scope="row"
          className={`${KLEBT_NAME} ${KLEBT_HINWEIS_OBEN} ${grund} ${ZEILE_ZEIGEN} font-bold text-ink`}
        >
          <span className="inline-flex items-center gap-1.5">
            {/* ★ Gezielt üben (13.11.2026): Kästchen für die Mehrfachauswahl. Ein echtes Kontrollkästchen mit
                Namen; das Kästchen hat keinen Text, die Spalte „Name" liest sich unverändert. */}
            {/* Kein `Tipp` um das Kästchen: ein Hinweiskasten (`span > span`) im Namenskopf der Zeile würde den
                Namen für jede Stelle verfälschen, die ihn dort liest. Der Name des Kästchens sagt alles. */}
            <input
              type="checkbox"
              data-gezielt-markieren=""
              className="h-4 w-4 accent-accent"
              checked={markiert}
              aria-label={gezieltTexte.markieren(pupil.name)}
              onChange={(e) => onMarkieren(pupil.id, e.target.checked)}
            />
            <span>{pupil.name}</span>
            {/* ★ E10: „prüfen" orange/rot neben dem Namen (EigenstaendigkeitsMarke.tsx). */}
            <EigenstaendigkeitsMarke score={data.stats.suspicion.score} reasons={gruende} />
            <LwPupilMessageButton
              pupilId={pupil.id}
              pupilName={pupil.name}
              classCode={pupil.classCode ?? ""}
              iconOnly
            />
          </span>
        </th>
        {/* ★ T1: die blosse Zahl - dass sie bis 50 geht, sagt der Kopf. */}
        <td>{w.stufe}</td>
        <td>
          <span aria-hidden="true">{w.tasten}</span>
          <span className="sr-only">{t.tastenSr(w.zahlen.tastenSitzen, w.zahlen.tastenFrei)}</span>
        </td>
        <td>
          {/* Sichtbar das Zeichen wie auf der Tastenkappe, für die Sprachausgabe
              der Name („Komma", „Großschreibung"). Ohne nächste Taste ein Strich. */}
          <span aria-hidden="true">
            {w.naechste.length === 0 ? "-" : w.naechste.map((u) => unitGlyph(u)).join(" ")}
          </span>
          <span className="sr-only">
            {t.naechsteSr(w.naechste.map((u) => tastenNameIn(u, sprache)))}
          </span>
        </td>
        <td>
          {w.uebezeit === w.uebezeitLang ? (
            w.uebezeit
          ) : (
            <>
              <span aria-hidden="true">{w.uebezeit}</span>
              <span className="sr-only">{w.uebezeitLang}</span>
            </>
          )}
        </td>
        {zeigeWochenziel && (
          <td>
            <Wochenzielstand stand={w.wochenzielStand} />
          </td>
        )}
        {/* ★ Gezielt üben (13.11.2026): letzte Spalte der Gruppe „Stand und Übezeit". */}
        <td>
          <GezieltSpalte herkunft={gezieltHerkunft(pupil.gezielt, klasse?.gezielt, new Date())} />
        </td>
        {/*
          ★★ DIE GRUPPE „ÜBEN" - die feine Linie links an der ersten Zelle
          (siehe `GRUPPEN_TRENNER`). Die Veränderung steht klein und gedämpft
          gleich hinter der Zahl (`schlank`, T1).
        */}
        <td className={GRUPPEN_TRENNER}>
          <Veraenderungspfeil
            wert={w.treffer}
            veraenderung={w.trefferAenderung}
            groesse="treffer"
            vergleichsName={bezugstext}
            darstellung={alsPfeil ? "pfeil" : "wert"}
            grund={w.veraenderungsGrund}
            grundKurz={w.veraenderungsGrundKurz}
            schlank
          />
        </td>
        <td>
          <Veraenderungspfeil
            wert={w.anschlaege}
            veraenderung={w.tempoAenderung}
            groesse="tempo"
            vergleichsName={bezugstext}
            darstellung={alsPfeil ? "pfeil" : "wert"}
            grund={w.veraenderungsGrund}
            grundKurz={w.veraenderungsGrundKurz}
            schlank
          />
        </td>
        {/* ★ B2: die Spalte „Score" - links neben „Tippchallenge". */}
        <td>
          <Veraenderungspfeil
            wert={w.score}
            veraenderung={w.scoreAenderung}
            groesse="score"
            vergleichsName={bezugstext}
            darstellung={alsPfeil ? "pfeil" : "wert"}
            ausrichtung="rechts"
            grund={w.veraenderungsGrund}
            grundKurz={w.veraenderungsGrundKurz}
            schlank
          />
        </td>
        {/* ★ Die Gruppe „Prüfung" - wieder durch die feine Linie getrennt. */}
        <td className={GRUPPEN_TRENNER}>
          <SchreibprobenKennzahl ergebnisse={proben} />
        </td>
        {/* ★ Die Gruppe „Klassenmatch" (21.09.2026): wie viele bis zum Ende
            gespielt wurden. Nur die Zahl - nicht, wer gewonnen hat.
            Unbekannt (nicht geladen) oder abgeschaltet: ein Strich. Sichtbar
            steht die Zahl, für die Sprachausgabe der ganze Satz - dieselbe
            Bauart wie `SchreibprobenKennzahl`. */}
        <td className={GRUPPEN_TRENNER}>
          {matchSummeZeile === null ? (
            <>
              <span aria-hidden="true" className="whitespace-nowrap tabular-nums text-ink">
                -
              </span>
              <span className="sr-only">{t.klassenmatchOhneZahl}</span>
            </>
          ) : (
            <>
              <span aria-hidden="true" className="whitespace-nowrap tabular-nums text-ink">
                {matchSummeZeile}
              </span>
              <span className="sr-only">{t.klassenmatchZaehler(matchSummeZeile)}</span>
            </>
          )}
        </td>
      </tr>
      {/*
        ★ AUFKLAPPEN MIT BEWEGUNG (Johannes 19.09.2026: „der Rest rutscht nach
        unten und der andere kommt nach"). Die Tabellenzeile selbst lässt sich
        nicht in der Höhe bewegen - `Aufklappen` bringt sie darum als Hülle
        mit, und der Kasten IN der Zelle wächst. Zugeklappt steht wie bisher
        keine zweite Zeile im Baum.
      */}
      <Aufklappen
        offen={open}
        huelle={(kasten) => (
          <tr className={grund}>
            {/* ⚠️ `spalten` kommt von oben - die Zahl der Köpfe hängt daran, ob
                die Wochenziel-Spalte dasteht. Eine hier hineingeschriebene
                Zahl liefe genau dann auseinander, wenn niemand hinsieht.
                ★ `!p-0`: Der Innenabstand, den der Tabellenrumpf jeder Zelle
                gibt, steckt hier im wachsenden Kasten (siehe unten) - an der
                Zelle stünde er sofort da, und der Rest spränge um 12 px, bevor
                die Bewegung beginnt. */}
            <td colSpan={spalten} className="bg-surface-sunken/40 !p-0">
              {kasten}
            </td>
          </tr>
        )}
      >
        {/*
          ★★★ E4 (18.09.2026, `BAUPLAN-2026-09-18-MEINE-KLASSEN-UMBAU.md`):
          FÜNF (HÖCHSTENS SECHS) EINKLAPPBARE ZEILEN STATT EINER LANGEN LISTE.

          Johannes: *„Bei der Ausklappübersicht der einzelnen Schüler kommt
          viel zu viel. Alles, was oben in der Tabelle steht, gehört unten
          weg. … vielleicht einfach ausklappbare Zeilen mit 1. Übungszeiten
          … 2. wacklige Tasten 3. Abzeichen."*

          Bis zum 18.09.2026 stand hier eine LANGE, offene Liste
          (Jahreskarte → Einstellungen → Wochenziel → die ganze
          `PupilStatsPanel`-Statistik, elf Abschnitte). `AufgeklappteZeile`
          baut die neuen sechs Zeilen aus genau denselben Bauteilen -
          `PupilStatsPanel` selbst bleibt unverändert und unbenutzt HIER
          (sie gehört weiter allein dem Kind in „Meine Statistik" -
          [[feedback_data_transparency]]: nicht mehr zeigen, nicht die
          gemeinsame Komponente für zwei verschiedene Ansichten ausdünnen).
          R6 gilt unverändert: keine dieser sechs Zeilen bekommt einen
          eigenen Rahmen, nur die Haarlinie über der `<details>`.
        */}
        {/* Linksbündig am INNEREN Bereich, nicht an der Zelle: Die Tabelle
            zentriert ihre Zellen (Johannes 10.09.2026) - in der
            aufgeklappten Zeile standen die kleinen Überschriften dadurch
            mittig, die Aufklapp-Zeilen daneben links (im Browser gesehen
            11.09.2026). Ein Abschnitt, eine Kante.
            ⚠️ Den Klassennamen der Ausrichtung in Kommentaren an `td`/`tr`
            NICHT ausschreiben: Der Wächter
            `tippchallenge-tabellen-mittig-und-anrede` liest vom `td` bis
            zum nächsten Tag-Anfang (am 11.09.2026 genau so rot geworden).
            ★ 19.09.2026: `px-6 py-[18px]` = der Innenabstand der Zelle
            (12/6 px, jetzt `!p-0` an der Zelle) plus der bisherige des
            Bereichs (12/12 px) - dasselbe Bild wie vorher, nur wächst der
            Abstand jetzt mit. */}
        <div className="px-6 py-[18px] text-left">
          <AufgeklappteZeile
            data={data}
            gruende={gruende}
            h={h}
            klasse={klasse}
            bezug={bezug}
            onBezug={onBezug}
            startwoche={startwoche}
            gesperrt={gesperrt}
            proben={proben}
            matchAnzahl={matchAnzahl}
            onSetWochenziel={onSetWochenziel}
            onResetOverdue={onResetOverdue}
            onSetExcusedWeeks={onSetExcusedWeeks}
          />
        </div>
      </Aufklappen>
    </>
  );
}

/**
 * ★ E4 (18.09.2026): EINE Zeile der Ausklapp-Zusammenfassung - `<details>`,
 * Haarlinie statt Rahmen (R6), Kennzahl schon in der `<summary>` (Johannes:
 * *„vielleicht einfach ausklappbare Zeilen … kommt in einer späteren Etappe,
 * NICHT jetzt"*), 36 px hohe Kopfzeile wie jeder andere Schalter der Seite
 * (R1/R7). Dieselbe Bauart wie „Wochenziele"/„Steigerung im Verlauf" in
 * `WeeklyGoalStats`/`LevelTrend` - EIN Muster statt einer sechsten, eigenen
 * Fassung derselben Klassen.
 *
 * ⚠️ Höchstens zwei Klapp-Ebenen: diese Zeile selbst und die Zeile der
 * Tabelle darüber - `children` bringt darum keine weitere `<details>` mit.
 * ★ Die EINE Ausnahme seit M3 (19.09.2026): In „Übungszeiten" klappt jede
 * Woche ihre einzelnen Übungszeiten auf - Johannes wollte ausdrücklich „eine
 * Unterliste mit allen Übungszeiten genau erfasst", und zwanzig Wochen mit je
 * fünf Übungszeiten offen untereinander wären genau das „viel zu viel", das
 * E4 abgeschafft hat.
 */
function AufklappZeile({
  titel,
  children,
}: {
  /**
   * Titel + Kennzahl, schon fertig beschriftet - als `<h3>` nur, wenn der
   * Inhalt darunter selbst KEINE eigene Überschrift mitbringt. Sonst nennt
   * die Sprachausgabe dieselbe Auskunft zweimal hintereinander (`BadgeShelf`
   * und `SchreibprobenTabelle` bringen ihre eigene `<h3>`/`<h4>` schon mit).
   */
  titel: ReactNode;
  children: ReactNode;
}) {
  return (
    <details className="group border-t border-hairline pt-1">
      <summary className="flex min-h-9 cursor-pointer list-none flex-wrap content-center items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
        <span aria-hidden="true" className="text-ink-muted transition group-open:rotate-90">
          ▸
        </span>
        {titel}
      </summary>
      <div className="space-y-2 pt-2">{children}</div>
    </details>
  );
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ E4: DIE AUFGEKLAPPTE ZEILE DER LEHRKRAFT - GENAU SECHS ZEILEN
 * ════════════════════════════════════════════════════════════════════════════
 *
 * `BAUPLAN-2026-09-18-MEINE-KLASSEN-UMBAU.md` E4, Johannes am 18.09.2026:
 *
 *   „Bei der Ausklappübersicht der einzelnen Schüler kommt viel zu viel.
 *    Alles, was oben in der Tabelle steht, gehört unten weg. … vielleicht
 *    einfach ausklappbare Zeilen mit 1. Übungszeiten … 2. wacklige Tasten
 *    3. Abzeichen."*
 *
 * Reihenfolge und Inhalt (seit 19.09.2026, Johannes): 1 Einstellungen für
 * {Name} · 2 Tippchallenges (nur mit mindestens einer) · 3 Übungszeiten
 * (+ Jahreskarte darunter) · 4 Wacklige Tasten · 5 Abzeichen · 6
 * Eigenständigkeit (nur ab einem auffälligen Wert). Bis dahin standen die
 * Einstellungen an fünfter Stelle.
 *
 * ★★★ „Meine Statistik" bleibt VOLLSTÄNDIG (dasselbe Bauteil zeigt dem Kind
 * alles): Diese Funktion baut die Lehrkraft-Zeile aus den EINZELNEN
 * Bausteinen (`BadgeShelf`, `SchreibprobenTabelle`, `PupilEinstellungen`,
 * `GoalEditor`) neu zusammen, statt `PupilStatsPanel` (das die Kind-Ansicht
 * mitträgt) Abschnitte wegzunehmen ([[feedback_data_transparency]]). Werte im
 * Überblick, Steigerung im Verlauf, Wochenziele-Statistik, Als Nächstes /
 * Tasten-Stand, Übt gerade, Geschichten & Wissen und der alte
 * Eigenständigkeits-Abschnitt fallen darum HIER weg - sie stehen in „Meine
 * Statistik" des Kindes (den Lektionen-Stand gibt es seit 19.09.2026 auch
 * dort nicht mehr, Johannes: „den versteht jetzt niemand mehr").
 *
 * ★ Nachtrag (Bauplan §„W · Wochenziel neu", nach diesem ersten Entwurf der
 * Zeile): „Übungszeiten" zählt seit W1-W3a je WOCHE (Montag 08:00,
 * `WOCHENZIEL_GRENZE`), nicht mehr je Unterrichtsperiode - die Klasse hat
 * seither keinen eigenen Unterrichtstag/-ende mehr, darum keine Spalte „im
 * Unterricht" (Johannes: *„davon im Unterricht können wir ja nicht erfassen,
 * weil die ganze Unterrichtseinheit wegfällt"*). War eine Woche eine
 * Ziel-Woche, steht ihr Stand („25 von 60 Min.", nach Nachholen) gleich
 * daneben.
 *
 * ★ Nachtrag E9 (19.09.2026, Johannes 18.09.: „Klassenmatch-Anzahl ja" -
 * dreht die frühere Entscheidung F10 NUR für diesen einen Punkt um): Hatte
 * ein Kind in einer Woche mindestens ein Klassenmatch gespielt, steht die
 * Anzahl NACH dem Wochenziel-Stand in derselben Zeile („· 2 Klassenmatches",
 * Einzahl „· 1 Klassenmatch") - sonst nichts, kein Platzhalter, keine
 * Platzierung. Die Zahl kommt aus `tt_match_verlauf` über den Zähl-Hook
 * `/api/tt/klassenmatch-anzahl` (E9), einmal je Klassenansicht geladen
 * (`TastenflowReiter`, dieselbe Bauart wie `proben`) und hier nur je Woche
 * nachgeschlagen - derselbe ISO-Wochenschlüssel wie {@link uebungsperioden}
 * (`isoWeekKey` auf `p.startMs`, schon der Montag-08:00-Zeitpunkt).
 *
 * ★ Nachtrag M3 (19.09.2026, Johannes: „Bei der Ausklappliste der Übezeiten
 * fehlen noch eine Unterliste mit allen Übungszeiten genau erfasst, und es
 * fehlt noch ein Zähler mit: hat an 15 Klassenmatch teilgenommen"): Oben in
 * „Übungszeiten" steht der Zähler (Summe über ALLE Wochen, die der Server
 * liefert; sein Hinweis sagt, was die Zahl umfasst), und jede Woche klappt
 * ihre einzelnen Übungszeiten auf (`Uebungsperiode.sitzungen` - dieselbe
 * Sitzungs-Regel wie „Meine Statistik", `sitzungsGruppen` in `goals.ts`).
 */
function AufgeklappteZeile({
  data,
  gruende,
  h,
  klasse,
  bezug,
  onBezug,
  startwoche,
  gesperrt,
  proben,
  matchAnzahl,
  onSetWochenziel,
  onResetOverdue,
  onSetExcusedWeeks,
}: {
  data: PupilData;
  /** ★ EN6a: die Gründe des Eigenständigkeits-Checks, schon in der Bedienungssprache. */
  gruende: readonly string[];
  h: EinstellHandler;
  klasse: TypingClass | null;
  bezug: Bezug;
  onBezug: (b: Bezug) => void;
  startwoche: Startwoche | null;
  /** ★ W3a: die gesperrten Zeiten der Klasse - siehe `wochenziel.ts` „Eine Stunde sperren". */
  gesperrt: readonly GesperrteZeit[];
  proben: readonly Probenergebnis[];
  /**
   * ★ E9: Klassenmatch-Anzahl DIESES Kindes, Woche → Zahl - siehe oben.
   * ★ M3: `null` = unbekannt (nicht geladen, nicht abrufbar) - dann steht
   * weder der Zähler noch eine Wochenzahl da, statt eine falsche Null.
   */
  matchAnzahl: Readonly<Record<string, number>> | null;
  onSetWochenziel: (
    id: string,
    name: string,
    ziel: { minuten: number; wochen: string[]; nachholen: boolean },
  ) => Promise<void>;
  onResetOverdue: (id: string, name: string) => void;
  onSetExcusedWeeks: (id: string, weeks: string[]) => void;
}) {
  const { pupil } = data;
  const { t, sprache } = useReiterTexte();
  /** ★ EN6a: „Mo 14.09." / „Mon 14 Sept". ★ E11a-5: „lun. 14 sept.". */
  const wochentag = (ms: number) =>
    // ★ O5 (30.10.2026): die neun nach ihrem Gebiet - bis dahin stand hier der deutsche Wochentag („Mo 21.09.").
    istGeruestSprache(sprache)
      ? new Date(ms).toLocaleDateString(GEBIET[sprache], { weekday: "short", day: "numeric", month: "short" })
      : // ★ O-PL (02.10.2026): „pon., 21 wrz" (Intl pl-PL).
      sprache === "pl"
      ? new Date(ms).toLocaleDateString("pl-PL", { weekday: "short", day: "numeric", month: "short" })
      : // ★ O-TR (02.10.2026): "21 Eyl Pzt" (Intl tr-TR, Wochentag nach dem Datum).
      sprache === "tr"
      ? new Date(ms).toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" })
      : // ★ O-CS (03.10.2026): „po 21. 9." (Intl cs-CZ, Wochentag klein).
      sprache === "cs"
      ? new Date(ms).toLocaleDateString("cs-CZ", { weekday: "short", day: "numeric", month: "numeric" })
      : sprache === "it"
      ? new Date(ms).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })
      : sprache === "fr"
      ? new Date(ms).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })
      : sprache === "es"
        ? new Date(ms).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })
        : sprache === "en"
        ? new Date(ms).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
        : fmtWochentagDatum(ms);
  const tasteName = (unit: string) => tastenNameIn(unit, sprache);

  // ★ W3a/E4: EINE Übersetzung Speicherform → Rechnung, für die Einstellungen-
  //   Kennzahl UND die Wochenziel-Zeile in „Übungszeiten" (`wochenziel.ts`).
  const ziel = kindWochenzielAusFeldern(pupil);
  const jetztMs = Date.now();

  // 1 · Übungszeiten - je Woche (Montag 08:00, `WOCHENZIEL_GRENZE` -
  //     dieselbe Wochengrenze wie das Wochenziel, siehe `uebungsperioden.ts`),
  //     NICHT je Kalendertag und NICHT je Unterrichtsperiode - die gibt es
  //     seit demselben Umbau nicht mehr.
  const perioden = uebungsperioden(data.events);
  const gesamtMs = perioden.reduce((summe, p) => summe + p.ms, 0);
  // ★ M3 (19.09.2026, Johannes: „es fehlt noch ein Zähler mit: hat an 15
  //   Klassenmatch teilgenommen"): die Summe über ALLE Wochen, die der Server
  //   liefert - nicht nur über die Wochen mit Übung darunter. Was die Zahl
  //   umfasst (diese Klasse, seit `MATCH_VERLAUF_SEIT_MS`), sagt ihr Hinweis.
  //   `null` = unbekannt ⇒ kein Zähler (siehe `matchAnzahl`).
  //   ★ 21.09.2026: gezählt wird, was bis zum Ende gespielt wurde - dieselbe
  //   Rechnung wie die Tabellenspalte (`klassenmatchSumme`). Eine Null nur dort,
  //   wo Klassenmatches überhaupt erlaubt sind - in einer Klasse ohne
  //   Klassenmatch wäre „noch keins bis zum Ende gespielt" bloss Lärm.
  const matchSumme = klassenmatchSumme(matchAnzahl, !!klasse?.klassenmatchAus);
  /** ★ M3: „10:02" - 24 Stunden, in beiden Sprachen (Glossar §1.2). ★ E11a-5: französisch „10 h 02". */
  const uhrzeit = (ms: number) =>
    // ★ O5 (30.10.2026): die neun nach ihrem Gebiet.
    // ★ O-CS (03.10.2026): „8:05" (uhrzeitAusMs kennt cs).
    istGeruestSprache(sprache)
      ? uhrzeitAusMs(ms, sprache)
      : sprache === "cs"
      ? uhrzeitAusMs(ms, "cs")
      : sprache === "pl"
      ? uhrzeitAusMs(ms, "pl")
      : sprache === "tr"
      ? uhrzeitAusMs(ms, "tr")
      : sprache === "it"
      ? uhrzeitAusMs(ms, "it")
      : sprache === "fr"
      ? uhrzeitAusMs(ms, "fr")
      : new Date(ms).toLocaleTimeString(sprache === "en" ? "en-GB" : "de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        });
  /** ★ M3: eine Übungszeit als Zeile - „Mo 14.09., 10:02-10:31 · 12 Min. · Mein Training". */
  const sitzungsZeile = (s: Uebungssitzung) => {
    const tagVon = wochentag(s.startMs);
    const tagBis = wochentag(s.endMs);
    const arten = s.arten.map((a) => t.uebungsart(a)).join(", ");
    return (
      t.sitzung(
        tagVon,
        uhrzeit(s.startMs),
        uhrzeit(s.endMs),
        tagBis === tagVon ? null : tagBis,
        fmtDauer(s.ms, sprache),
      ) + (arten ? ` · ${arten}` : "")
    );
  };
  // Wochenziel-Stand je Woche (nur wo es einen gibt) - dieselbe Rechnung wie
  // die Spalte „Wochenziel" der Tabelle (`wochenzielGeschichte`), nur über
  // ALLE geübten Wochen statt nur den Zeitraum-Kopf.
  const wochenBericht = wochenzielGeschichte(data.events, ziel, jetztMs, gesperrt);
  const wocheNachStart = new Map(wochenBericht.map((w) => [w.startMs, w]));

  // 2 · Wacklige Tasten - dieselbe Auswahl wie „Meine Statistik" (weakestKeys),
  //     hier bis zu acht statt sechs (mehr Platz, eigene Zeile statt Chips).
  const introduced = ensureIntroduced(
    data.progress.introduced,
    lernwegAus(data.pupil, data.progress),
  );
  // ★ D-5 (28.09.2026): die Schwelle dieses Kindes - sein Weg und seine
  // Textstufe mit dem Vorrang der Klasse (dieselbe Regel wie beim Kind selbst).
  const wackligRahmen = {
    lernweg: lernwegAus(data.pupil, data.progress),
    stufe: stufeFuer(mitKlassenVorrang(data.pupil, klasse)),
  };
  const weak = weakestKeys(data.progress.letters, introduced, wackligRahmen, 8);
  const weakTop3 = weak
    .slice(0, 3)
    .map((wt) => tasteName(wt.unit))
    .join(", ");

  // 3 · Abzeichen.
  const badgeCount = earnedBadges(data.progress).length;

  // 5 · Einstellungen - dieselbe Stufen-Rechnung wie das Auswahlfeld selbst
  //     (`womitAnfangenStand`, EINE Stelle für beide). Das Wochenziel der
  //     KENNZAHL ist die LAUFENDE Woche im neuen Minuten-Modell - dieselbe
  //     Zahl, die die Tabellenspalte „Wochenziel" für „diese Woche" zeigt
  //     ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]); der
  //     GoalEditor selbst bleibt bis W3b beim alten Einheiten-Modell.
  const womitAnfangen = womitAnfangenStand(data, klasse, sprache);
  const wochenzielMin = zielFuerWoche(ziel.verlauf, aktuelleWocheKey(jetztMs));

  // 6 · Eigenständigkeit - nur wenn der heutige Check wirklich etwas anzeigt.
  const suspicion = data.stats.suspicion;

  return (
    <div className="space-y-3">
      {/*
        ★ Reihenfolge seit 19.09.2026 (Johannes: „die Reihenfolge in der
        Schülertabelle - Ausklappliste von oben nach unten: Einstellungen …;
        Tippchall…; Übungszeiten; wacklige Tasten; Abzeichen"). Die
        Eigenständigkeit bleibt zuletzt - sie steht nur da, wenn der Check
        etwas anzeigt.
      */}
      <AufklappZeile
        titel={
          <span className="text-sm font-semibold text-ink">
            {t.einstellungenFuer(pupil.name, womitAnfangen.label, wochenzielMin)}
          </span>
        }
      >
        <PupilEinstellungen data={data} h={h} klasse={klasse} />
        <GoalEditor
          data={data}
          gesperrt={gesperrt}
          onSetWochenziel={onSetWochenziel}
          onResetOverdue={onResetOverdue}
          onSetExcusedWeeks={onSetExcusedWeeks}
          onMeldung={h.onMeldung}
        />
      </AufklappZeile>

      {proben.length > 0 && (
        <AufklappZeile
          titel={
            <span className="text-sm font-semibold text-ink">{t.tippchallenges(proben.length)}</span>
          }
        >
          <SchreibprobenTabelle
            ergebnisse={proben}
            titel={t.challengesTitel}
            beschriftung={t.challengesBeschriftung(pupil.name)}
            // ★ Die Lehrkraft liest über ein Kind - die Hinweise sagen „Sie".
            anrede="Sie"
          />
        </AufklappZeile>
      )}

      <AufklappZeile
        titel={
          <h3 className="m-0 text-sm font-semibold text-ink">
            {t.uebungszeiten}{" "}
            <span className="font-normal text-ink-muted">
              -{" "}
              {perioden.length === 0
                ? t.nochKeineUebung
                : t.uebungszeitenKennzahl(fmtDauer(gesamtMs, sprache), perioden.length)}
              {/* ★ M3: die Summe der Klassenmatches, nur wenn es welche gab -
                  dieselbe Form wie in der Wochenzeile („· 15 Klassenmatches"). */}
              {matchSumme !== null && matchSumme > 0 && t.periodeMatches(matchSumme)}
            </span>
          </h3>
        }
      >
        {matchSumme !== null && (
          <p className="m-0 text-sm text-ink">
            <Erklaert
              hilfe={t.klassenmatchZaehlerHilfe(
                pupil.name,
                fmtTagMonatJahr(MATCH_VERLAUF_SEIT_MS, sprache),
              )}
            >
              {t.klassenmatchZaehler(matchSumme)}
            </Erklaert>
          </p>
        )}
        {perioden.length > 0 && (
          <ul className="m-0 list-none space-y-1 p-0 text-sm text-ink">
            {perioden.map((p) => {
              // ★ E4: war es eine Ziel-Woche, steht der Wochenziel-Stand
              //   gleich daneben („25 von 60 Min.") - dieselbe Zahl, die die
              //   Tabellenspalte für eine vergangene Woche zeigt
              //   (`wochenzielGeschichte`, nach Nachholen).
              const woche = wocheNachStart.get(p.startMs);
              // ★ E9: die Klassenmatch-Anzahl DIESER Woche - derselbe
              //   ISO-Schlüssel wie am Server (`p.startMs` ist schon der
              //   Montag-08:00-Zeitpunkt). Nichts bei 0, „1 Klassenmatch"
              //   in der Einzahl.
              const matches = matchAnzahl?.[isoWeekKey(p.startMs)] ?? 0;
              const wochenzeile = (
                <>
                  {t.periode(wochentag(p.startMs), wochentag(p.bisMs), fmtDauer(p.ms, sprache), p.tage)}
                  {woche?.zielwoche && t.periodeZiel(Math.round(woche.erfuellt), woche.ziel)}
                  {matches > 0 && t.periodeMatches(matches)}
                </>
              );
              if (p.sitzungen.length === 0) return <li key={p.startMs}>{wochenzeile}</li>;
              return (
                <li key={p.startMs}>
                  {/*
                    ★★ M3 (19.09.2026): JEDE WOCHE KLAPPT IHRE ÜBUNGSZEITEN AUF.
                    Johannes: „Bei der Ausklappliste der Übezeiten fehlen noch
                    eine Unterliste mit allen Übungszeiten genau erfasst".
                    Dieselbe Bauart wie die Zeilen darüber (`AufklappZeile`):
                    ein `<details>`, zu bis zum ersten Druck auf Eingabe oder
                    Leertaste, die Sprachausgabe sagt „reduziert/erweitert".
                    Die Wochenzeile selbst IST die Zusammenfassung - keine
                    zusätzliche Zeile „Einzelne Übungszeiten" je Woche.
                    ⚠️ Eigene Gruppe `group/woche`: ein blosses `group-open:`
                    am Pfeil träfe das `<details>` von „Übungszeiten" darüber,
                    und der Pfeil stünde gedreht, obwohl die Woche zu ist.
                  */}
                  <details className="group/woche">
                    <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                      <span
                        aria-hidden="true"
                        className="text-ink-muted transition group-open/woche:rotate-90"
                      >
                        ▸
                      </span>
                      <Hinweisflaeche hilfe={t.wocheHilfe(UEBUNGSZEIT_PAUSE_MIN)}>
                        {wochenzeile}
                      </Hinweisflaeche>
                    </summary>
                    {/* Jüngste zuerst - wie die Wochen selbst. Zusammen genau
                        die Zeit der Woche (`uebungsperioden.ts`, Dateikopf). */}
                    <ul className="m-0 list-none space-y-1 pb-1 pl-6 text-ink-soft">
                      {p.sitzungen.map((sz) => (
                        <li key={sz.startMs}>{sitzungsZeile(sz)}</li>
                      ))}
                    </ul>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
        {/* Die Jahreskarte zeigt dieselbe Übezeit übers ganze Schuljahr -
           Johannes 18.09.: sie „gehört hierher", nicht mehr als eigene Zeile. */}
        <PersonJahreskarte
          data={data}
          bezug={bezug}
          onBezug={onBezug}
          startwoche={startwoche}
          gesperrt={gesperrt}
          schuljahrBeginn={schuljahrBeginnVon(klasse)}
        />
      </AufklappZeile>

      <AufklappZeile
        titel={
          <h3 className="m-0 text-sm font-semibold text-ink">
            {t.wackligeTasten}{" "}
            <span className="font-normal text-ink-muted">
              - {weakTop3 || t.nochZuWenigGeuebt}
            </span>
          </h3>
        }
      >
        {weak.length === 0 ? (
          <p className="m-0 text-sm text-ink-muted">{t.zuWenigUmZuSagen}</p>
        ) : (
          <table className="w-full border-separate border-spacing-0 text-sm">
            <caption className="sr-only">{t.wackligCaption(pupil.name)}</caption>
            <thead>
              <tr className="text-center text-ink-muted">
                {/* ★ E12 (19.09.2026): auch dieser kleine Tabellenkopf trägt
                    jetzt seine Hinweise - Johannes: „vergiss nicht die
                    mousover infos bei allen bereichen". */}
                <Spaltenkopf className="px-2 py-1" hilfe={t.tasteHilfe(wackligProzent(wackligRahmen))}>
                  {t.tasteKopf}
                </Spaltenkopf>
                <Spaltenkopf className="px-2 py-1" hilfe={t.trefferHilfe}>
                  {t.trefferKopf}
                </Spaltenkopf>
                <Spaltenkopf className="px-2 py-1" hilfe={t.tempoHilfe}>
                  {t.tempoKopf}
                </Spaltenkopf>
              </tr>
            </thead>
            <tbody className="text-center [&_td]:border-t [&_td]:border-hairline/60 [&_td]:px-2 [&_td]:py-1 [&_th]:border-t [&_th]:border-hairline/60 [&_th]:px-2 [&_th]:py-1">
              {weak.map((wt) => {
                const ms = letterMs(data.progress.letters?.[wt.unit]);
                return (
                  <tr key={wt.unit}>
                    <th scope="row" className="font-normal text-ink">
                      {tasteName(wt.unit)}
                    </th>
                    <td className="tabular-nums text-ink">{fmtPercent(wt.acc, sprache)}</td>
                    <td className="tabular-nums text-ink">
                      {ms ? `${Math.round(60_000 / ms)}/min` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </AufklappZeile>

      <AufklappZeile
        titel={<span className="text-sm font-semibold text-ink">{t.abzeichen(badgeCount)}</span>}
      >
        <BadgeShelf
          progress={data.progress}
          selfView={false}
          skin={skinForStufe(stufeFuer(pupil))}
          flach
        />
      </AufklappZeile>

      {suspicion.score > 1 && (
        <AufklappZeile
          titel={
            <h3 className="m-0 text-sm font-semibold text-ink">
              {t.eigenstaendigkeit(suspicion.reasons.length)}
            </h3>
          }
        >
          <SuspicionChip score={suspicion.score} reasons={[...gruende]} />
          <ul className="m-0 mt-1 list-disc pl-5 text-sm text-ink-muted">
            {suspicion.reasons.map((r, i) => (
              // ★ EN6a/E11a-3: Ein Grund ohne Fassung in der Bedienungssprache
              // bleibt deutsch - und wird dann auch deutsch gelesen (`lang="de"`).
              <li
                key={i}
                lang={
                  sprache !== "de" &&
                  (EIGENSTAENDIGKEITS_GRUND_JE_SPRACHE[sprache]?.(r) ?? null) === null
                    ? "de"
                    : undefined
                }
              >
                {gruende[i] ?? r}
              </li>
            ))}
          </ul>
        </AufklappZeile>
      )}
    </div>
  );
}

/**
 * Die Jahreskarte EINER Person (bis K3, 19.09.2026, dieselbe Bauform wie die
 * der Klasse - die hat seither ihren eigenen Überblick, `Klassenueberblick`).
 *
 * ★★★ Sie rechnet keine Note. Sie liefert drei Werte samt Steigerung und legt
 * mit der Zeile „Grundlage" offen, woraus sie entstanden sind. Was daraus eine
 * Note wird, entscheidet die Lehrkraft.
 */
function PersonJahreskarte({
  data,
  bezug,
  onBezug,
  startwoche,
  gesperrt,
  schuljahrBeginn,
}: {
  data: PupilData;
  bezug: Bezug;
  onBezug: (b: Bezug) => void;
  startwoche: Startwoche | null;
  /** ★ W3a: die gesperrten Zeiten der Klasse - siehe `wochenziel.ts` „Eine Stunde sperren". */
  gesperrt: readonly GesperrteZeit[];
  /** ★ D2: der Beginn des Schuljahres der Klasse (1-12). */
  schuljahrBeginn: number;
}) {
  const { pupil } = data;
  const werte = useMemo(
    () =>
      jahreskarte(data.events, Date.now(), {
        goalMinutes: pupil.goalMinutes,
        goalUnits: pupil.goalUnits,
        goalWeeks: pupil.goalWeeks ?? [],
        goalCatchUp: !!pupil.goalCatchUp,
        goalResetWeek: pupil.goalResetWeek,
        goalExcusedWeeks: pupil.goalExcusedWeeks,
        // ★ W3a: das neue Minuten-Modell für „Wochenaufgaben" - siehe `jahreskarte.ts`.
        wochenzielVerlauf: pupil.wochenzielVerlauf,
        gesperrt,
        bezug,
        startwoche,
        schuljahrBeginn,
      }),
    [data.events, pupil, gesperrt, bezug, startwoche, schuljahrBeginn],
  );
  return (
    <Jahreskarte
      // ★ Ohne „· Tastenflow" (11.09.2026, Bauplan R11): Der Reiter darüber
      // sagt das Programm schon; die Zeile gehört zu genau diesem Kind.
      titel={pupil.name}
      werte={werte}
      bezug={bezug}
      onBezug={onBezug}
    />
  );
}

/**
 * ★ DER PFEIL - ein runder Knopf ohne Wort (01.09.2026).
 *
 * Johannes: *„Einstellungen (ohne das Wort „Einstellungen" nur ein dicker
 * Runder schalter mit einem Pfeil)."* Bis zum Vormittag stand das Wort daneben
 * (N3, 31.08.); in einer Tabelle mit sieben Spalten kostete es die halbe
 * Breite der ersten Spalte.
 *
 * ── ⚠️ Was dabei NICHT verloren gehen darf ────────────────────────────────
 * Ein Knopf ohne sichtbares Wort ist für die Sprachausgabe nur so gut wie sein
 * `aria-label` - das bleibt unverändert und sagt den Namen der Person mit.
 * Und wer Sehrest hat und mit der Maus arbeitet, bekommt den Hinweis von
 * `Tipp` zu sehen: derselbe Weg wie bei den runden Knöpfen der Kopfzeile, die
 * seit dem 30.08.2026 genauso gebaut sind.
 *
 * ★ 36 × 36 Punkte seit 11.09.2026 (bis dahin 44 × 44): Die Kinderzeile trug
 * drei Höhen - 28 px „Nachricht an …", 44 px dieser Knopf, dazwischen der Text.
 * Johannes: *„ich glaube es gibt 5 verschiedene höhen … bitte gestalte diese
 * wichtige seite richtig ansprechend übersichtlich und schlank"*. Jetzt sind
 * beide Knöpfe 36 px und rund wie die Sinnbild-Knöpfe der Kopfzeile, die Zeilen
 * werden niedriger - und 36 liegt klar über der Mindestgrösse von 24 px (WCAG
 * 2.5.8). Bauplan `BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md`, R1/R2.
 *
 * ★ Der Fokus bleibt beim Auf- und Zuklappen AUF DEM KNOPF. Er wird nicht neu
 * aufgebaut und nicht ausgetauscht; nur `aria-expanded` wechselt. Das ist die
 * Abnahme-Bedingung aus N3 und gilt unverändert.
 */
function EinstellungenKnopf({
  name,
  open,
  onToggle,
}: {
  name: string;
  open: boolean;
  onToggle: () => void;
}) {
  const { t } = useReiterTexte();
  // ★ E4 (18.09.2026, Johannes: „halte die Seite jetzt extrem schlank und mach
  // keine dauerhaften Erklärungen unter den Schaltern, das geht mit
  // Mouseover"): Der Satz, dass „Meine Statistik" mehr zeigt, steht am
  // Schalter. ★ 20.10.2026: der Knopf selbst ist `AufklappKnopf` - dasselbe
  // Bauteil benutzen jetzt alle Programm-Reiter.
  return (
    <AufklappKnopf
      open={open}
      onToggle={onToggle}
      label={t.knopfName(name, open)}
      tipp={t.knopfTipp(name)}
    />
  );
}

/**
 * ★ W3a (18.09.2026): Der Wochenstand als Text - „25/60 Min. ✓" bei einer
 * Woche, „87 %" bei Schuljahr/Gesamt. Farbe ist NIE der einzige Träger; das
 * Häkchen steht als Zeichen da und die Sprachausgabe bekommt einen ganzen
 * Satz, mit dem ausgeschriebenen Wort „Minuten" bzw. „Prozent" statt der
 * blossen Kurzform.
 */
function Wochenzielstand({ stand }: { stand: WochenzielStand }) {
  const { t, sprache } = useReiterTexte();
  const ohneWert = (grund: string) => (
    <span className="text-ink-muted">
      <span aria-hidden="true">-</span>
      <span className="sr-only">{grund}</span>
    </span>
  );

  if (stand.art === "keins") return ohneWert(t.keinZielGesetzt);

  if (stand.art === "prozent") {
    if (stand.anteil === null) return ohneWert(t.keineAbgeschlossene);
    const prozent = Math.round(stand.anteil * 100);
    return (
      <span className="text-ink">
        <span aria-hidden="true">{prozentAnzeige(stand.anteil, sprache)}</span>
        <span className="sr-only">
          {t.prozentSr(prozent, stand.wochenGanz, stand.wochenGesamt)}
        </span>
        {/*
          ★ Wie zuvor bei „25/34 ges: 93/102": zwei Zahlen, die zusammengehören,
          stehen nebeneinander, nicht untereinander.
        */}
        <span aria-hidden="true" className="ml-1.5 text-sm font-normal text-ink-muted">
          {t.prozentSichtbar(stand.wochenGanz, stand.wochenGesamt)}
        </span>
      </span>
    );
  }

  // stand.art === "woche"
  if (!stand.zielwoche)
    return ohneWert(stand.erlassen ? t.wocheErlassen : t.keineZielwoche);

  const geuebtOderErfuellt = stand.laufend ? stand.geuebtMin : stand.erfuelltMin;
  const zaehler = Math.round(geuebtOderErfuellt);
  const nenner = Math.round(stand.zielMin);
  const offenVorher =
    stand.offenVorherMin !== null && stand.offenVorherMin > 0
      ? Math.round(stand.offenVorherMin)
      : null;
  return (
    <span className={stand.erreicht ? "font-semibold text-ink" : "text-ink"}>
      <span aria-hidden="true">
        {t.wocheSichtbar(zaehler, nenner)}
        {stand.erreicht ? " ✓" : ""}
      </span>
      <span className="sr-only">
        {t.wocheSr(zaehler, nenner)}
        {offenVorher !== null ? t.offenSr(offenVorher) : ""}
        {stand.erreicht ? t.erreichtSr : ""}
      </span>
      {/*
        ★ Nachholen an, laufende Woche, noch Rückstand: die offenen Minuten
        früherer Wochen stehen als EIGENE Zahl daneben - siehe
        `wochenzielZeitraum.ts`, warum das eine zweite Zahl braucht statt in
        der ersten mitgezählt zu werden.
      */}
      {offenVorher !== null && (
        <span aria-hidden="true" className="ml-1.5 text-sm font-normal text-ink-muted">
          {t.offenSichtbar(offenVorher)}
        </span>
      )}
    </span>
  );
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ EINSTELLUNGEN DER KLASSE (B8, Umbau 11.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„Jede Klasse hat also nur eine Textstufe … Auch oben für die ganze
 * Klasse kann man die Sprache einstellen und ob man sie sperrt."* Und: *„In
 * Ihrer Klasse sind 3 Kinder schon weiter als die eingestellte Stufe - soll die
 * ganze Klasse wirklich auf dieses Niveau eingestuft werden?"*
 *
 * Vier Felder in EINER Reihe, jedes mit seinem Hinweis am Ort:
 *
 *   Schulstufe · Sprache (+ Sperre) · Startniveau der Klasse · Klassenmatch
 *
 * ★ Die Felder selbst kommen seit 11.09.2026 (Nacht) aus EINEM Bauteil
 * (`KlassenEinstellungsFelder.tsx`) - dasselbe steht beim Anlegen einer Klasse
 * (Johannes: *„Alles was im Bereich ‚Einstellungen der Klasse' vorkommt muss
 * beim Erstellen einer neuen Klasse abgefragt werden"*). Hier bleibt, was nur
 * hier gilt: sofort speichern, die Meldungen, die Rückfrage zum Startniveau.
 *
 * ── ★★★ VIER DAUERWERTE - UND BEIM STARTNIVEAU DAZU EIN BESCHLUSS ─────────
 * Schulstufe, Sprache und Sperre stehen an der KLASSE und gelten von da an für
 * jedes Kind - auch für die, die später dazukommen; gerechnet wird beim Laden
 * (`klassenEinstellungen.ts`), nichts wird in ein Konto kopiert.
 *
 * Das **Startniveau** war bis 11.09.2026 (Nacht) NUR ein Beschluss, einmal je
 * Kind geschrieben. Johannes wählte dann „Startniveau als Vorgabe an der Klasse
 * speichern": Es steht seither AUCH an der Klasse (`startUnits` +
 * `startUnitsAt`) und gilt für jedes Kind, das später beitritt. Die Vorgabe
 * nimmt aber nur DAZU (`startpunktMitKlasse`) - Freigeschaltetes gehört dem
 * Kind, und ein Kind, das sich weitergeübt hat, verliert nichts. Zurückstufen
 * kann weiter nur der Beschluss je Kind; darum schreibt `stufeSetzen` erst die
 * Vorgabe und DANACH die Kinder (der neuere Beschluss des Kindes gilt).
 *
 * ── ⚠️ Was das Feld „Startniveau" DANACH zeigt ────────────────────────────
 * Die Stufe, auf der die MEISTEN Kinder stehen - nicht die zuletzt gewählte.
 * Eine zuletzt gewählte Stufe wäre eine Erinnerung an einen Knopfdruck; die
 * häufigste Stufe ist eine Auskunft über die Klasse und stimmt auch dann noch,
 * wenn die Kinder sich seither weitergeübt haben. Genau dieselbe Überlegung
 * steht bei „Womit anfangen?" je Kind.
 */
function Klasseneinstellungen({
  cls,
  datas,
  teacherId,
  busy,
  setBusy,
  setStatus,
  onChanged,
  ziehKontoNach,
  onStatus,
}: {
  cls: TypingClass;
  datas: PupilData[];
  teacherId: string;
  busy: boolean;
  setBusy: (b: boolean) => void;
  setStatus: (s: string) => void;
  onChanged: () => void;
  /** Ein geändertes Konto in seiner Zeile nachziehen - ohne Neuaufbau. */
  ziehKontoNach: (neu: TypingAccount | null) => void;
  /**
   * ★★★★★ E3 (18.09.2026): Der Kasten steht seither im Panel des
   * Aussen-Schalters „Einstellungen der Klasse" - der öffnet und schliesst,
   * nicht mehr das eigene `<details>` hier (das mit diesem Umbau ganz
   * wegfällt). `onStatus` meldet die Zeile, die bisher in der zugeklappten
   * `<summary>` stand („7. Schulstufe · Deutsch · Klassenmatch erlaubt"), an
   * den Aussen-Schalter weiter - REIN als Weitergabe, gerechnet wird sie
   * unverändert nur hier (`zusammenfassung`).
   */
  onStatus?: (kurz: string) => void;
}) {
  const backend = typingBackend();
  const { t, sprache } = useReiterTexte();
  const jetztMs = Date.now();
  // ★ E1 (24.09.2026): das Startniveau der KLASSE ist eine Anzahl in ihrem Weg.
  const klassenWeg = lernwegVon(cls);
  const starts = startPunkte(sprache, klassenWeg);
  /**
   * ★★ DIE ANTWORT DES SERVERS STEHT SOFORT IM FELD.
   *
   * Dieselbe Regel wie in der Tabelle („eine Einstellung tauscht nie den
   * Reiter aus"): Jeder Setzer gibt die aktualisierte Klasse zurück, und die
   * wird hier nachgezogen. Ohne das zeigte das Auswahlfeld bis zum nächsten
   * Laden der Seite noch den ALTEN Wert - die Lehrkraft hielte die Einstellung
   * für wirkungslos und drückte noch einmal.
   *
   * ⚠️ Der Effekt zieht nach, wenn die Seite eine frische Klasse hereinreicht
   * (Klassenwechsel, stilles Nachladen). Er läuft nur, wenn sich der Datensatz
   * wirklich ändert, und fährt niemandem ins Tippen.
   */
  const [klasse, setKlasse] = useState<TypingClass>(cls);
  useEffect(() => setKlasse(cls), [cls]);
  /**
   * ★ Wie weit ein Kind WIRKLICH ist - dieselbe Rechnung wie in
   * `PupilEinstellungen` („Womit anfangen?"): die freigeschalteten Einheiten,
   * mindestens aber der eingetragene Startpunkt.
   */
  // ★ 11.09.2026 (Nacht): mit der Vorgabe der Klasse - dieselbe Regel wie beim
  // Kind und in „Womit anfangen?". Ein Kind, das die höhere Vorgabe erbt, IST
  // schon so weit, auch wenn an seinem Konto noch „Anfänger" steht.
  const standVon = (d: PupilData) =>
    Math.max(
      startpunktStand(d.progress.introduced, lernwegAus(d.pupil, d.progress)), // ★ D-1
      startpunktMitKlasse(startpunktImWeg(d.pupil, d.progress), klasse).startUnits ?? 0, // ★ S1
    );
  /**
   * Der Startpunkt, den ein Kind NUR über die bisherige Vorgabe der Klasse hat
   * (noch nicht freigeschaltet, nicht am eigenen Konto) - sonst 0.
   */
  const nurGeerbt = (d: PupilData) => {
    const eigen = startpunktImWeg(d.pupil, d.progress); // ★ S1
    const wirksam = startpunktMitKlasse(eigen, klasse).startUnits ?? 0;
    return wirksam > (eigen.startUnits ?? 0) &&
      wirksam > startpunktStand(d.progress.introduced, lernwegAus(d.pupil, d.progress)) // ★ D-1
      ? wirksam
      : 0;
  };
  /**
   * ★ E8 (24.09.2026, Bauplan englischer Lehrgang §11 Falle 1): NUR Kinder im
   * WEG DER KLASSE zählen hier mit. `starts` ist die Einheiten-Tabelle DIESES
   * Weges - der Stand eines Kindes auf einem ANDEREN Weg ist eine Anzahl in
   * einem anderen Zahlenraum (z. B. „en" hat andere Stufengrenzen als „de")
   * und würde hier wie eine Anzahl DIESES Weges gelesen: die Anzahlen-Falle.
   * Eine gemischte Klasse ist mit dem Probe-Schalter erreichbar; „die meisten
   * stehen bei …" bleibt darum auf die Kinder beschränkt, für die die Zahl
   * wirklich etwas bedeutet.
   */
  const gleicherWeg = useMemo(
    () => datas.filter((d) => lernwegAus(d.pupil, d.progress) === klassenWeg),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datas, klassenWeg],
  );
  /**
   * Die Stufe, auf der die MEISTEN stehen - der Anzeigewert des Feldes.
   * Bei Gleichstand die niedrigere: Sie beschreibt die Klasse vorsichtiger,
   * und eine zu hoch angezeigte Stufe verleitet zum Einstufen nach oben.
   */
  const haeufigsteStufe = useMemo(() => {
    if (gleicherWeg.length === 0) return starts[0].units;
    const zaehler = new Map<number, number>();
    for (const d of gleicherWeg) {
      const s = standVon(d);
      const stufe = (starts.filter((sp) => sp.units <= s).pop() ?? starts[0]).units;
      zaehler.set(stufe, (zaehler.get(stufe) ?? 0) + 1);
    }
    let beste = starts[0].units;
    let anzahl = -1;
    for (const sp of starts) {
      const n = zaehler.get(sp.units) ?? 0;
      if (n > anzahl) {
        anzahl = n;
        beste = sp.units;
      }
    }
    return beste;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gleicherWeg, sprache]);
  /** Beschriftung der häufigsten Stufe - steht im Platzhalter des Feldes. */
  const haeufigsteLabel =
    gleicherWeg.length > 0 ? starts.find((sp) => sp.units === haeufigsteStufe)?.label : undefined;

  /**
   * Der offene Dialog des Startniveaus. `null` = keiner. Er merkt sich, welche
   * Stufe gewählt wurde und wie viele Kinder schon weiter sind.
   */
  const [frage, setFrage] = useState<{
    units: number;
    label: string;
    weiter: string[];
  } | null>(null);

  const stufe = aktuelleSchulstufe(klasse, jetztMs);
  const gezieltTexte = GEZIELT_LEHRKRAFT_TEXTE[sprache];

  const setzeKlasse = async (
    aenderung: Parameters<typeof backend.setClassEinstellungen>[2],
    meldung: string,
  ) => {
    if (busy) return;
    setBusy(true);
    try {
      const neu = await backend.setClassEinstellungen(klasse.code, teacherId, aenderung);
      if (!neu) {
        setStatus(t.klasseNichtGespeichert);
        return;
      }
      // ⚠️ Die Antwort des Servers SOFORT ins Feld - sonst zeigte es bis zum
      // nächsten Laden den alten Wert (siehe `klasse`/`setKlasse` oben).
      setKlasse(neu);
      setStatus(meldung);
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  /**
   * Das Startniveau wirklich setzen - für ALLE oder nur für die, die noch
   * nicht so weit sind.
   *
   * ⚠️ Erst NACH allen Schreibvorgängen wird EINMAL gemeldet: Meldete jeder
   * Durchgang für sich, löste eine Klasse mit 25 Kindern 25 Nachladungen
   * hintereinander aus (dieselbe Falle wie beim Wochenziel für alle).
   */
  const stufeSetzen = async (units: number, label: string, nurZurueckliegende: boolean) => {
    if (busy) return;
    setBusy(true);
    try {
      /*
        ★★★ ERST DIE VORGABE DER KLASSE, DANN DIE KINDER (11.09.2026, Nacht).
        Die Vorgabe gilt für jedes Kind, das später beitritt. Die Reihenfolge
        ist die Regel: `startpunktMitKlasse` lässt einem Kind seinen EIGENEN
        Beschluss, wenn er mindestens so neu ist wie der der Klasse - so stuft
        „Alle einstufen" wirklich zurück, und wer bei „Nur die, die noch nicht
        so weit sind" nicht geschrieben wird, behält seinen Stand (die Vorgabe
        nimmt nur dazu).
      */
      /*
        ⚠️ Vor dem Schreiben gerechnet - mit der BISHERIGEN Vorgabe. Ein Kind,
        das bei „Nur die, die noch nicht so weit sind" übersprungen wird, weil
        es die höhere Vorgabe erbt, verlöre sie sonst mit der neuen, niedrigeren
        Vorgabe still. Es bekommt darum seinen wirksamen Stand als eigenen
        Beschluss festgehalten - „unberührt" heisst: Es bekommt weiter, was es
        vorher bekam (Prüfbefund 11.09.2026 Nacht, nachgestellt).
      */
      const ziel = nurZurueckliegende
        ? datas.filter((d) => standVon(d) < units)
        : datas;
      const festhalten = nurZurueckliegende
        ? datas
            .filter((d) => standVon(d) >= units)
            .map((d) => ({ d, geerbt: nurGeerbt(d) }))
            .filter((x) => x.geerbt > 0)
        : [];
      const neu = await backend.setClassEinstellungen(klasse.code, teacherId, {
        startUnits: units,
      });
      if (neu) setKlasse(neu);
      for (const d of ziel) ziehKontoNach(await backend.setStartUnits(d.pupil.id, units));
      for (const { d, geerbt } of festhalten)
        ziehKontoNach(await backend.setStartUnits(d.pupil.id, geerbt));
      const kinderSatz = ziel.length > 0 ? t.kinderEingetragen(ziel.length) : "";
      setStatus(neu ? t.startGilt(label, kinderSatz) : t.vorgabeNichtGespeichert(kinderSatz));
      onChanged();
    } finally {
      setBusy(false);
      setFrage(null);
    }
  };

  const startGewaehlt = (units: number) => {
    const ziel = starts.find((sp) => sp.units === units);
    const label = ziel?.label ?? String(units);
    const weiter = datas.filter((d) => standVon(d) > units).map((d) => d.pupil.name);
    // ⚠️ Ohne ein einziges Kind, das schon weiter ist, gibt es nichts zu
    // warnen - dann wird gesetzt und in einem Satz gesagt, was geschah. Eine
    // Rückfrage ohne Inhalt lehrt nur, Rückfragen wegzuklicken.
    if (weiter.length === 0) {
      void stufeSetzen(units, label, false);
      return;
    }
    setFrage({ units, label, weiter });
  };

  /** Die gespeicherte Vorgabe der Klasse (11.09.2026, Nacht) - als Wort. */
  const vorgabeLabel = klasse.startUnits
    ? starts.find((sp) => sp.units === klasse.startUnits)?.label
    : undefined;
  /*
   * ★ Der Stand am Schalter „Einstellungen der Klasse" (R7: ein zugeklappter
   * Bereich verschweigt seinen Inhalt nicht, Regel vom 01.09.2026).
   * Abnahme E3 (18.09.2026, im Browser gemessen): nur Schulstufe und Sprache.
   * Die volle Zeile („… · Startniveau … · Klassenmatch erlaubt") machte die
   * Reihe der vier Schalter bei 1366 px zweizeilig und schob die Tabelle
   * wieder nach unten - genau das, was E3 beheben soll. Startniveau und
   * Klassenmatch stehen im geöffneten Kasten selbst.
   */
  const kurzStand = [
    schulstufeText(stufe, sprache),
    // ★ ES-M2: die Sprache, die in der Klasse wirklich gilt (Weg „fr"/„es" gebunden).
    `${langLabel(klassenUebungsSprache(klasse), sprache)}${klasse.langLocked ? t.gesperrtZusatz : ""}`,
  ].join(" · ");
  useEffect(() => {
    onStatus?.(kurzStand);
  }, [onStatus, kurzStand]);
  /*
    ⚠️ Prüfbefund E3 (11.09.2026) gilt weiter: Als WERT steht im Auswahlfeld ein
    Platzhalter, sonst liesse sich die Stufe, die schon dasteht, nie wählen
    (ein Auswahlfeld feuert kein `change` für den Eintrag, der schon gewählt
    ist) - und die Wahl ist ein Beschluss, auch wenn sie gleich bleibt. Der
    Platzhalter NENNT darum beides: die Vorgabe der Klasse und die Stufe, auf
    der die meisten stehen.
  */
  const startPlatzhalter =
    t.stufeWaehlen +
    ((vorgabeLabel || haeufigsteLabel)
      ? " - " +
        [
          vorgabeLabel ? t.vorgabeKlasse(vorgabeLabel) : null,
          haeufigsteLabel ? t.dieMeisten(haeufigsteLabel) : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : "");

  return (
    /*
      ════════════════════════════════════════════════════════════════════════
      ★★★ E3 (18.09.2026): DER KASTEN STEHT IM PANEL DES AUSSEN-SCHALTERS
      ════════════════════════════════════════════════════════════════════════
      Bis dahin (R7 des Bauplans `BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md`)
      war dieser Bereich ein eigenes `<details>`, zugeklappt beim Laden, ganz
      am Ende der Seite. Mit der Aufgaben-Zeile (`BAUPLAN-2026-09-18-MEINE-
      KLASSEN-UMBAU.md`, E3) übernimmt der vierte Schalter „Einstellungen der
      Klasse" das Auf-/Zuklappen samt Überschrift und Fokus-Rückgabe - dieser
      Bereich liefert nur noch den Inhalt, unverändert. Der Stand
      („7. Schulstufe · Deutsch · Klassenmatch erlaubt"), der bisher in der
      zugeklappten `<summary>` stand, geht über `onStatus` an den Schalter.
      ⚠️ Kein Fokus-Ziel führt in diesen Bereich (siehe der Kommentar beim
      Einbau weiter unten), und die Rückfrage zum Startniveau ist ein `Modal`,
      das an `body` hängt - vom Schliessen des Panels unberührt.
    */
    <>
      <div className="space-y-2">
          <KlassenEinstellungsFelder
            bezug={t.bezugKlasse(klasse.name)}
            werte={{
              schulstufe: stufe,
              lang: klassenUebungsSprache(klasse),
              langLocked: !!klasse.langLocked,
              klassenmatchAus: !!klasse.klassenmatchAus,
              zeilenEndeEnter: !!klasse.zeilenEndeEnter,
              gezielt: klasse.gezielt ?? null,
              schreibweise: klasse.schreibweise ?? "",
              schuljahrBeginn: schuljahrBeginnVon(klasse),
            }}
            jetztMs={jetztMs}
            startniveau={{
              lernweg: klassenWeg,
              wert: "",
              platzhalter: startPlatzhalter,
              // ★ 11.09.2026 (Nacht): Der Satz „wird einmal für alle eingetragen,
              // nicht dauerhaft gespeichert" stimmt nicht mehr - die Vorgabe
              // steht jetzt an der Klasse.
              hinweis: t.startHinweis,
              srHinweis: t.startSrHinweis,
            }}
            onSchulstufe={(wert) =>
              void setzeKlasse(
                {
                  schulstufe: wert,
                  // ★ Das Schuljahr des EINTRAGS - ohne es wüsste niemand, wie
                  // oft weitergezählt werden muss.
                  // ★ D2: im Schuljahr DIESER Klasse (ihr Beginn-Monat).
                  schulstufeSchuljahr: schuljahrStartjahr(jetztMs, schuljahrBeginnVon(klasse)),
                },
                wert === 0
                  ? t.schulstufeEntfernt(stufeLabel(VORGABE_STUFE, sprache))
                  : wert === SCHULSTUFE_ERWACHSEN
                    ? t.schulstufeErwachsen(stufeLabel("erwachsen", sprache))
                    : t.schulstufeGesetzt(
                        wert,
                        stufeLabel(
                          klassenStufe(
                            {
                              schulstufe: wert,
                              schulstufeSchuljahr: schuljahrStartjahr(jetztMs, schuljahrBeginnVon(klasse)),
                              settings: klasse.settings,
                            },
                            jetztMs,
                          ),
                          sprache,
                        ),
                      ),
              )
            }
            onSprache={(lang) =>
              void setzeKlasse({ lang }, t.spracheDerKlasse(langLabel(lang, sprache)))
            }
            onSperre={(gesperrt) =>
              void setzeKlasse(
                {
                  langLocked: gesperrt,
                  /*
                    ⚠️ Die angezeigte Sprache wird MITGESCHRIEBEN (Prüfer
                    11.09.2026). Wer nur das Schloss drückte, ohne die Liste je
                    anzufassen, sperrte eine Klasse OHNE eigene Sprache - dann
                    galt weiter die Sprache des einzelnen Kindes
                    (`cls.lang ?? konto.lang`), und die Sperre hing allein an der
                    Oberfläche: Am Server entscheidet über das Kind-Feld `lang`
                    sein EIGENES `langLocked`, und das steht bei Klassenkindern
                    auf „frei". Mit der mitgeschriebenen Sprache gibt es nichts
                    mehr, das die Sperre umgehen könnte.
                  */
                  // ★ ES-M2: die GELTENDE Sprache - auf Weg „fr"/„es" die des Weges.
                  lang: klassenUebungsSprache(klasse),
                },
                gesperrt ? t.spracheGesperrt : t.spracheFrei,
              )
            }
            onStartniveau={(units) => startGewaehlt(units)}
            onKlassenmatch={(an) => {
              if (busy) return;
              setBusy(true);
              void backend
                .setClassKlassenmatchAus(klasse.code, teacherId, !an)
                .then((neu) => {
                  if (!neu) {
                    setStatus(t.matchNichtUmgestellt);
                    return;
                  }
                  setKlasse(neu);
                  setStatus(an ? t.matchErlaubt : t.matchAus);
                  onChanged();
                })
                .finally(() => setBusy(false));
            }}
            onZeilenEnde={(an) =>
              void setzeKlasse({ zeilenEndeEnter: an }, an ? t.zeilenEndeAn : t.zeilenEndeAus)
            }
            onGezielt={(g) =>
              void setzeKlasse(
                { gezielt: g },
                (g ? gezieltTexte.gespKlasse : gezieltTexte.klasseAus),
              )
            }
            onSchuljahrBeginn={(monat) => {
              const bisher = schuljahrBeginnVon(klasse);
              if (monat === bisher) return;
              /*
                ★ D2 (28.09.2026): Das Eintragsjahr der Schulstufe wird im
                SELBEN Aufruf umgerechnet - sonst sprünge die heutige
                Schulstufe beim Umstellen um eine Stufe
                (`schulstufeSchuljahrUmrechnen`). „Erwachsen" und „nicht
                gesetzt" zählen nicht weiter, dort gibt es nichts umzurechnen.
              */
              const eingetragen = klasse.schulstufeSchuljahr;
              const mitStufe =
                typeof klasse.schulstufe === "number" &&
                klasse.schulstufe !== SCHULSTUFE_ERWACHSEN &&
                typeof eingetragen === "number";
              void setzeKlasse(
                {
                  schuljahrBeginn: monat,
                  ...(mitStufe
                    ? {
                        schulstufeSchuljahr: schulstufeSchuljahrUmrechnen(
                          eingetragen,
                          jetztMs,
                          bisher,
                          monat,
                        ),
                      }
                    : {}),
                },
                t.schuljahrBeginnGesetzt(MONATE_JE_SPRACHE[sprache][monat - 1]),
              );
            }}
            onSchreibweise={(v) =>
              void setzeKlasse(
                { schreibweise: v },
                t.schreibweiseGesetzt(
                  v === "us" ? t.schreibweiseUsLabel : v === "gb" ? t.schreibweiseGbLabel : t.schreibweiseAutoLabel,
                ),
              )
            }
          />
      </div>

      {/*
        ════════════════════════════════════════════════════════════════════
        ★★★ DIE RÜCKFRAGE ZUM STARTNIVEAU (Johannes: „so ist es gut, eine
        Möglichkeit mehr" - DREI Knöpfe)
        ════════════════════════════════════════════════════════════════════
        ⚠️ Ein `Modal`, kein `window.confirm`: Ein Bestätigungsfenster des
        Browsers kann nur ja und nein, und hier gibt es drei Wege. Das
        gemeinsame Bauteil bringt Fokus-Falle, Escape und die Rückgabe des
        Fokus mit.

        ⚠️ Escape und „Abbrechen" ändern NICHTS - das ist der Sinn der Frage.
      */}
      {frage && (
        <Modal title={t.startFrageTitel} onClose={() => setFrage(null)}>
          <div className="space-y-3 text-sm text-ink">
            <p className="m-0">
              {t.frageVor(frage.weiter.length)}
              <strong>{t.frageStark(frage.weiter.length)}</strong>
              {t.frageNach(frage.weiter.length)}
            </p>
            <p className="m-0 text-ink-muted">
              {t.detailVor}
              <strong>{frage.label}</strong>
              {t.detailNach(frage.weiter.join(", "))}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary aria-disabled:opacity-40"
                aria-disabled={busy}
                onClick={() => void stufeSetzen(frage.units, frage.label, false)}
              >
                {t.alleEinstufen}
              </button>
              <button
                type="button"
                className="btn-primary aria-disabled:opacity-40"
                aria-disabled={busy}
                onClick={() => void stufeSetzen(frage.units, frage.label, true)}
              >
                {t.nurNochNicht}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setFrage(null)}
              >
                {t.abbrechen}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export function TastenflowReiter({
  pupils,
  onChanged,
  cls,
  teacherId,
}: {
  pupils: TypingAccount[];
  onChanged: () => void;
  /**
   * ★ Die Klasse - trägt seit W2/W3b die Wochenziel-Vorgabe
   * (`wochenzielVorgabe`) und die gesperrten Zeiten (`gesperrteZeiten`,
   * „Eine Stunde sperren"). Das Wochenziel selbst bleibt je Person. Fehlt
   * die Klasse, verhält sich alles wie vorher: Woche von Montag 08:00 bis
   * zum nächsten Montag 08:00 (`WOCHENZIEL_GRENZE`), keine Sperre möglich.
   */
  cls?: TypingClass | null;
  teacherId?: string;
}) {
  const backend = typingBackend();
  const { t, sprache } = useReiterTexte();
  // ★ 29.10.2026 (Wunsch einer Lehrerin: „Schriftgröße bei der Statistik
  // größer"): Alt + Plus / Minus / 0 vergrößert die ganze Klassenstatistik,
  // mit derselben Stufe wie „Meine Statistik" - siehe `statistikSchrift.tsx`.
  const { wurzel: schrift, ansage: schriftAnsage } = useStatistikSchriftTasten();
  const [datas, setDatas] = useState<PupilData[]>([]);
  /**
   * Für WELCHE Kinder-Liste `datas` gilt (die Kennungen, aneinandergereiht).
   * Anker für die Regel weiter unten: „Lädt …" nur, solange für diese Klasse
   * noch gar nichts da ist - beim Nachladen bleibt das Bisherige stehen.
   */
  const [datasFuer, setDatasFuer] = useState<string | null>(null);
  const [nachladend, setNachladend] = useState(false);
  const [status, setStatus] = useState("");
  /** ★ Gezielt üben (13.11.2026): die markierten Kinder (Mehrfachauswahl) - nur diese eine Sammelaktion. */
  const [markiert, setMarkiert] = useState<ReadonlySet<string>>(() => new Set());
  /** Namen der Konten, deren Stand gerade NICHT gelesen werden konnte. */
  const [lesefehler, setLesefehler] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  /*
   * ★ W3b (18.09.2026): Der frühere „still nachladen" - Weg (`ladeStandNach`,
   * ein Zähler `refresh` in den Ladeeffekten unten) ist ersatzlos weg. Er war
   * nötig, solange das Wochenziel einen Merker in `lw_events` schrieb (altes
   * Modell); die fünfte Review-Runde von `wochenziel.ts` hat diesen Merker
   * gestrichen (Lost-Update-Gefahr, siehe dort). Seither ändert JEDE
   * Wochenziel-Einstellung nur noch Konten (`uebernimmKonto`/`ziehKontoNach`
   * ziehen sie sofort in ihre Zeile) - ein voller Reload von Fortschritt und
   * Telemetrie bringt nichts mehr, was nicht schon da ist.
   */

  /**
   * ★★★ W3b (18.09.2026): Der Klassen-Datensatz, sofort nachgezogen nach
   * „Stunde sperren"/„aufheben" - dieselbe Regel wie überall in dieser Datei
   * („die Antwort des Servers steht sofort im Feld", siehe
   * `Klasseneinstellungen`). Beide Backend-Wege geben die frische Klasse
   * zurück; ein eigener, schmaler Spiegel des Props `cls` erspart eine
   * Wartezeit bis zum nächsten Nachladen durch die Seite „Meine Klassen".
   */
  const [klasseStand, setKlasseStand] = useState<TypingClass | null>(cls ?? null);
  useEffect(() => setKlasseStand(cls ?? null), [cls]);

  /**
   * ★★★ W3b: Wochenziel-Vorgabe der Klasse (Minuten-Modell, `wochenziel.ts`) -
   * vorbelegt aus `cls.wochenzielVorgabe` (leer, wenn noch keine gesetzt ist).
   * Die Felder synchronisieren nur auf einen ECHTEN Wechsel der Vorgabe (ihr
   * Zeitstempel `am`) nach - nicht auf jedes Neuladen der Klasse, sonst
   * nähme ein Zwischenstand der Lehrkraft beim Tippen den halb eingegebenen
   * Wert weg.
   */
  const [classGoalMin, setClassGoalMin] = useState(
    cls?.wochenzielVorgabe ? String(cls.wochenzielVorgabe.minuten) : "",
  );
  const [classGoalWeeks, setClassGoalWeeks] = useState<string[]>(
    cls?.wochenzielVorgabe?.wochen ?? [],
  );
  const [classGoalCatchUp, setClassGoalCatchUp] = useState(!!cls?.wochenzielVorgabe?.nachholen);
  const classGoalCatchUpId = useId();
  const vorgabeAm = klasseStand?.wochenzielVorgabe?.am;
  useEffect(() => {
    const v = klasseStand?.wochenzielVorgabe;
    setClassGoalMin(v ? String(v.minuten) : "");
    setClassGoalWeeks(v?.wochen ?? []);
    setClassGoalCatchUp(!!v?.nachholen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vorgabeAm]);

  /*
    ════════════════════════════════════════════════════════════════════════
    ★★★★★ E3 (18.09.2026, Bauplan „Meine Klassen" - Aufgaben-Zeile)
    ════════════════════════════════════════════════════════════════════════
    Johannes 18.09.2026: die Seite ist „unübersichtlich" - fünf gestapelte
    Kästen standen vor der Tabelle. Jetzt EINE Reihe von vier Schaltern
    (Tippchallenge · Eigene Übung · Wochenziel · Einstellungen der Klasse),
    ihr Panel öffnet sich direkt darunter - IMMER höchstens eines.

    ⚠️ Die vier Kästen bleiben, sobald ihre Voraussetzung (`cls`, `teacherId`)
    da ist, IMMER im Baum - nur ihr PANEL trägt `hidden`, kein bedingtes
    Rendern. Zwei Gründe:
     1. `SchreibprobeKasten` tickt seine eigene Uhr und meldet über `onStatus`
        laufend den Stand („läuft · Bereit: 12 von 14") - würde der Kasten
        beim Zuklappen abgebaut, verstummte die Meldung mit ihm, und genau
        die soll ja OHNE Aufklappen sichtbar bleiben (Auftrag Johannes).
     2. Ein halb ausgefülltes Formular (Eigene Übung, Wochenziel,
        Einstellungen) übersteht das Umschalten zu einem anderen Schalter.
  */
  type AufgabenPanel = "tippchallenge" | "eigene-uebung" | "wochenziel" | "einstellungen-klasse";
  const [offenesPanel, setOffenesPanel] = useState<AufgabenPanel | null>(null);
  const tippchallengeBtnRef = useRef<HTMLButtonElement>(null);
  const eigeneUebungBtnRef = useRef<HTMLButtonElement>(null);
  const wochenzielBtnRef = useRef<HTMLButtonElement>(null);
  const einstellungenBtnRef = useRef<HTMLButtonElement>(null);
  /** Die Überschrift des gerade offenen Panels - Fokus-Ziel nach dem Öffnen. */
  const panelUeberschriftRef = useRef<HTMLHeadingElement>(null);

  /**
   * ★ Abnahme 18.09.2026: Der Fokus wandert NUR nach einem Druck auf den
   * Schalter in das Panel - nicht, wenn es sich von selbst öffnet (laufende
   * Tippchallenge beim Laden oder von einer Co-Lehrkraft gestartet). Sonst
   * risse ein fremdes Ereignis einer Person mit Sprachausgabe den Fokus weg,
   * mitten in dem, was sie gerade liest.
   */
  const fokusNachOeffnen = useRef(false);

  /** Schalter drücken: dasselbe Panel schliesst, ein anderes tauscht es aus. */
  const schaltePanel = useCallback((p: AufgabenPanel) => {
    fokusNachOeffnen.current = true;
    setOffenesPanel((vorher) => (vorher === p ? null : p));
  }, []);

  /**
   * Escape schliesst das offene Panel und gibt den Fokus an seinen Schalter
   * zurück (R-Fokus, [[feedback_fokus_pflicht_alle_apps]]). Ein `Modal`
   * (Rückfrage Startniveau) und `window.confirm` (Tippchallenge absagen)
   * fangen Escape schon vorher ab (`Modal.tsx`: `stopPropagation` in der
   * Erfassungsphase an `document`) - diese Zeile hier sieht die Taste in
   * beiden Fällen nie.
   */
  const escapeSchliesst =
    (schalter: React.RefObject<HTMLButtonElement>) => (e: React.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOffenesPanel(null);
      schalter.current?.focus();
    };

  useEffect(() => {
    if (!fokusNachOeffnen.current) return;
    fokusNachOeffnen.current = false;
    if (offenesPanel) panelUeberschriftRef.current?.focus();
  }, [offenesPanel]);

  /** „Tippchallenge · läuft · Bereit: 12 von 14" - siehe `SchreibprobeKasten`. */
  const [tippchallengeStatus, setTippchallengeStatus] = useState("");
  /** War beim letzten Stand eine Tippchallenge im Gang? Für den Übergang unten. */
  const tippchallengeLiefVorher = useRef(false);
  /**
   * ★ „Eine laufende Tippchallenge darf nicht übersehen werden" (Auftrag
   * Johannes 18.09.2026): Beginnt eine Runde - beim ersten Laden schon im
   * Gang oder frisch gestartet -, öffnet sich ihr Panel von selbst. Einmal
   * geöffnet, darf die Lehrkraft es wieder schliessen, ohne dass es sich
   * erneut aufdrängt, solange dieselbe Runde weiterläuft (der Übergang
   * `false → true` feuert je Runde genau einmal).
   */
  const handleTippchallengeStatus = useCallback((kurz: string) => {
    setTippchallengeStatus(kurz);
    const laeuft = kurz.length > 0;
    if (laeuft && !tippchallengeLiefVorher.current) setOffenesPanel("tippchallenge");
    tippchallengeLiefVorher.current = laeuft;
  }, []);

  /**
   * „Eigene Übung · nicht zugewiesen" / „· zugewiesen: Herbstgedicht.txt" /
   * „· 2 zugewiesen, der Reihe nach" - dieselbe reine Funktion wie in
   * `EigeneUebungKasten` (`eigeneUebungKurzstand`, Z1), hier nur ein zweites
   * Mal AUFGERUFEN, nicht ein zweites Mal GERECHNET.
   */
  const eigeneUebungStatus = cls ? eigeneUebungKurzstand(cls, sprache) : "";

  /** Der Stand von „Einstellungen der Klasse" - gemeldet aus dem Kasten selbst. */
  const [einstellungenStatus, setEinstellungenStatus] = useState("");

  /*
   * Fortschritt + Telemetrie je Kind laden (nur Tastenflow-Daten).
   *
   * ★ FOKUS-FÜHRUNG: still nachladen statt austauschen.
   *
   * Früher stieß jede Einstellung diesen Lauf an, er schaltete `ladend` auf
   * wahr, und die ganze Tabelle wich einem „Lädt …" - das Auswahlfeld unter
   * dem Fokus war damit aus dem Baum, und die Lehrkraft stand nach JEDER
   * Einstellung wieder am Seitenanfang ([[feedback_fokus_pflicht_alle_apps]]).
   *
   * Zwei Änderungen zusammen heilen das: Die Einstellungen unten ziehen ihr
   * Ergebnis direkt in die Zeile nach und stoßen diesen Lauf gar nicht mehr
   * an; und wo er doch nötig ist (Wochenziel), bleiben die bisherigen Zeilen
   * stehen, bis die neuen da sind. Die Zeilen tragen `key` = Konto-Kennung,
   * React tauscht die Eingabeelemente also nicht aus - und auch das
   * Aufgeklappt-Sein einer Zeile überlebt.
   */
  const ids = pupils.map((p) => p.id).join(",");
  useEffect(() => {
    let alive = true;
    setNachladend(true);
    void (async () => {
      /*
       * ★★★ EINE FALSCHE NULL IST SCHLIMMER ALS EINE FEHLERMELDUNG (31.08.2026).
       *
       * Bis dahin lief dieser Lauf ohne `catch`, und `findLwRow` im Backend
       * verschluckte JEDEN Lesefehler zu `null`. Wird der Lesezugriff auf
       * `lw_progress` abgewiesen, stand hier deshalb still „Stufe 1 von 50,
       * 0 von 73 Lektionen, keine Abzeichen" - und die Lehrkraft glaubte es.
       * Genau das ist der ungelöste Befund §4.1 der Übergabe vom 31.08.
       *
       * Jetzt wird je Kind gefangen: Was gelesen werden konnte, steht da; was
       * nicht, sagt es. `fehler` trägt die Zeile, in der es hakt.
       */
      const geladen = await Promise.all(
        pupils.map(async (pupil) => {
          try {
            const [progress, events] = await Promise.all([
              backend.getProgress(pupil.id),
              backend.getEvents(pupil.id),
            ]);
            return {
              pupil,
              // ★ W2b (28.09.2026): Hat die Lehrkraft den Weg umgestellt und
              // das Kind seither nicht geöffnet, liegt am Server noch der Stand
              // des alten Weges. Gezeigt wird, was das Kind beim Öffnen haben
              // WIRD - dieselbe Funktion wie beim Kind (`wegWechsel.ts`), sonst
              // stünden die Tasten des alten Weges als Anzahl im neuen da.
              progress: istLernweg(pupil.lernweg)
                ? fortschrittImWeg(progress ?? emptyProgress(), pupil.lernweg, pupil)
                : (progress ?? emptyProgress()),
              events,
              stats: computePupilStats(events),
            } satisfies PupilData;
          } catch {
            return {
              pupil,
              progress: emptyProgress(),
              events: [],
              stats: computePupilStats([]),
              fehler: true,
            } satisfies PupilData;
          }
        }),
      );
      if (alive) {
        const kaputt = geladen.filter((d) => d.fehler).map((d) => d.pupil.name);
        setLesefehler(kaputt);
        // Schon bekannte Konten behalten: Sie sind die Antwort des Servers auf
        // die Einstellung, die gerade eben gesetzt wurde, und damit frischer
        // als das, was die Seite in `pupils` hält (die lädt zeitgleich nach).
        // Sonst spränge ein Auswahlfeld für einen Wimpernschlag auf den alten
        // Wert zurück. Beim Öffnen des Reiters wird ohnehin neu gesetzt.
        setDatas((alt) => {
          const bekannt = new Map(alt.map((d) => [d.pupil.id, d.pupil]));
          return geladen.map((d) => ({
            ...d,
            pupil: bekannt.get(d.pupil.id) ?? d.pupil,
          }));
        });
        setDatasFuer(ids);
        setNachladend(false);
      }
    })();
    return () => {
      alive = false;
    };
    // `ids` statt `pupils`: sonst lädt jeder Eltern-Render neu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend, ids]);

  /** Erstes Laden dieser Kinder-Liste - nur dann darf die Tabelle weichen. */
  const ladend = datasFuer !== ids;

  /**
   * ★ SPENDENBANNER (18.09.2026): der Klassen-DURCHSCHNITT der echten Übezeit,
   * in Stunden - über ALLE Kinder dieser Klasse, nicht nur den gewählten
   * Zeitraum (`stats.totalMs` ist die Summe über die ganze Geschichte des
   * Kontos, siehe `computePupilStats`). `null`, solange noch geladen wird oder
   * die Klasse kein Kind hat - dann zeigt `SpendenBanner` nichts, statt mit
   * einer falschen 0 einen Zustand zu merken.
   */
  const spendenbannerStundenGesamt =
    !ladend && datas.length > 0
      ? datas.reduce((s, d) => s + d.stats.totalMs, 0) / datas.length / 3_600_000
      : null;
  /**
   * ★★★★★ 21.09.2026: derselbe Durchschnitt, aber nur die letzten SECHS MONATE - für die
   * Bitte nach einem Jahr (`spendenBannerErneuerungFaellig`).
   */
  const spendenbannerStundenHalbjahr = useMemo(
    () =>
      !ladend && datas.length > 0
        ? datas.reduce(
            (s, d) => s + computePupilStats(spendenBannerImHalbjahr(d.events)).totalMs,
            0,
          ) /
          datas.length /
          3_600_000
        : null,
    [ladend, datas],
  );

  /*
   * ★ DIE TIPPCHALLENGES DER KLASSE (10.09.2026) - für die Spalte „3 / 82" und
   * die Tabelle beim Aufklappen. Eine Abfrage für die ganze Klasse, nicht je
   * Kind: `tt_schreibproben` trägt den Klassencode.
   *
   * ⚠️ Ein Lesefehler lässt die Liste LEER und die Spalte zeigt „-". Das ist
   * hier vertretbar, weil die Spalte nichts behauptet, was ein Kind betrifft -
   * die Ergebnisse selbst stehen weiter im Bereich „Tippchallenge".
   */
  const klassenCode = cls?.code ?? pupils[0]?.classCode ?? "";
  const [proben, setProben] = useState<Record<string, Probenergebnis[]>>({});
  useEffect(() => {
    if (!klassenCode) {
      setProben({});
      return;
    }
    let lebt = true;
    void backend
      .leseKlassenProben(klassenCode)
      .then((r) => {
        if (lebt) setProben(r);
      })
      .catch(() => {
        // Stehen lassen, was da ist - siehe oben.
      });
    return () => {
      lebt = false;
    };
  }, [backend, klassenCode]);

  /**
   * ★ E9 (19.09.2026): Klassenmatch-Anzahl je Kind und Woche - EINMAL je
   * Klassenansicht geladen (dieselbe Bauart wie `proben` oben), nicht je
   * Zeile: Sonst wären das 30 Abfragen für dieselbe Antwort. Scheitert der
   * Aufruf (kein Netz, `klassenmatchAnzahl` fängt selbst ab und meldet
   * `null`), bleibt die Anzahl UNBEKANNT - „Übungszeiten" zeigt dann weder
   * eine Wochenzahl noch den Zähler, statt etwas Falsches zu behaupten.
   *
   * ★ M3 (19.09.2026): `null` = unbekannt - bis die Antwort da ist, und wenn
   * sie scheitert. Vorher stand hier `{}`, und der neue Zähler hätte bis zum
   * Laden (oder bei einem Fehler für immer) „noch an keinem Klassenmatch
   * teilgenommen" behauptet.
   */
  const [matchAnzahl, setMatchAnzahl] = useState<Record<string, Record<string, number>> | null>(
    null,
  );
  useEffect(() => {
    setMatchAnzahl(null);
    if (!klassenCode) return;
    let lebt = true;
    void backend
      .klassenmatchAnzahl(klassenCode)
      .then((r) => {
        if (lebt && r) setMatchAnzahl(r);
      })
      .catch(() => {
        // Unbekannt lassen - siehe oben.
      });
    return () => {
      lebt = false;
    };
  }, [backend, klassenCode]);

  /*
   * ★ EINE EINSTELLUNG TAUSCHT NIE DEN REITER AUS.
   *
   * Früher meldete jedes `onSet…` die Änderung mit `bump()` an die Seite
   * „Meine Klassen", lud alles neu und zeigte währenddessen „Lädt …" - der
   * ganze Reiter wich also einem Absatz. Beim SCHREIBFELD „Geburtsjahr" fiel
   * das zuerst auf (wer die Jahreszahl tippt und mit der Tabulatortaste
   * weitergeht, verlor mitten in der Tabelle den Fokus), es galt aber für
   * jedes Auswahlfeld in dieser Tabelle genauso
   * ([[feedback_fokus_pflicht_alle_apps]]).
   *
   * Jetzt gilt für ALLE Einstellungen, was bisher nur für das Geburtsjahr
   * galt: Jeder Setzer gibt das aktualisierte Konto zurück, und genau das
   * ziehen wir an Ort und Stelle in die Zeile nach. Kein Neuaufbau, kein
   * Zurückspringen des Feldes auf den alten Wert. `onChanged()` meldet die
   * Änderung trotzdem an die Seite - die lädt still nach, damit die anderen
   * Reiter dasselbe sehen, ohne hier etwas auszutauschen.
   */
  /**
   * Das Konto NUR in seiner Zeile nachziehen - ohne die Seite zu behelligen.
   * Getrennt von `uebernimmKonto`, weil „Für alle übernehmen" die Konten in
   * einer Schleife setzt: Meldete jeder Durchgang für sich, löste eine Klasse
   * mit 25 Kindern 25 Nachladungen der Kinder-Liste hintereinander aus.
   */
  const ziehKontoNach = (neu: TypingAccount | null) => {
    if (!neu) return;
    setDatas((ds) =>
      ds.map((d) =>
        d.pupil.id === neu.id
          ? {
              ...d,
              pupil: neu,
              // ★ W2b: ein neuer Weg zeigt sofort den Stand, den das Kind
              // beim nächsten Öffnen bekommt (siehe Laden oben).
              progress:
                istLernweg(neu.lernweg) && neu.lernweg !== d.pupil.lernweg
                  ? fortschrittImWeg(d.progress, neu.lernweg, neu)
                  : d.progress,
            }
          : d,
      ),
    );
  };
  /** Eine einzelne Einstellung: nachziehen und der Seite einmal Bescheid geben. */
  const uebernimmKonto = (neu: TypingAccount | null) => {
    if (!neu) return;
    ziehKontoNach(neu);
    onChanged();
  };
  /*
   * ★ B10 (11.09.2026): `onSetStufe`, `onSetStufeWaechstMit`,
   * `onSetGeburtsjahr`, `onSetLang` und `onSetLangLocked` sind hier weg - es
   * gibt keine Bedienung mehr, die sie ruft (Textstufe, Geburtsjahr, Sprache
   * und Sperre gelten für die ganze Klasse). Die Backend-Methoden selbst
   * bleiben: Selbstlernende Konten stellen das weiter im Zahnrad ein.
   */
  const onSetOneHand = (id: string, oneHand: boolean) => {
    void backend.setOneHand(id, oneHand).then(uebernimmKonto);
  };
  const onSetNoTimePressure = (id: string, on: boolean) => {
    void backend.setNoTimePressure(id, on).then(uebernimmKonto);
  };
  /**
   * ★ Gezielt üben (13.11.2026): schreibt das Feld am Konto des Kindes - derselbe Weg wie Einhand (die Lehrkraft
   * der Klasse darf es, das Kind selbst nicht). `null` = wie die Klasse, `{zeichen: []}` = aus für dieses Kind.
   */
  const gezieltT = GEZIELT_LEHRKRAFT_TEXTE[sprache];
  const onSetGezielt = (id: string, name: string, g: Gezielt | null) => {
    void backend
      .setGezielt(id, g)
      .then((neu) => {
        if (!neu) {
          setStatus(gezieltT.fehler);
          return;
        }
        uebernimmKonto(neu);
        setStatus(
          g === null
            ? gezieltT.kindWieKlasse(name)
            : g.zeichen.length === 0
              ? gezieltT.kindAusMeld(name)
              : gezieltT.gespKind(name),
        );
      })
      .catch(() => setStatus(gezieltT.fehler));
  };
  /** Mehrfachauswahl: denselben Wert jedem markierten Kind setzen - und nur diesen. */
  const onSetGezieltMarkierte = (g: Gezielt | null) => {
    const ids = datas.filter((d) => markiert.has(d.pupil.id)).map((d) => d.pupil.id);
    void Promise.all(ids.map((id) => backend.setGezielt(id, g).catch(() => null))).then((konten) => {
      const geschafft = konten.filter((k): k is TypingAccount => !!k);
      for (const k of geschafft) ziehKontoNach(k);
      if (geschafft.length > 0) onChanged();
      setStatus(
        geschafft.length === ids.length ? gezieltT.gespMehrere(geschafft.length) : gezieltT.fehler,
      );
    });
  };
  const anzahlMarkiert = datas.filter((d) => markiert.has(d.pupil.id)).length;
  const markierenUm = (id: string, an: boolean) =>
    setMarkiert((alt) => {
      const neu = new Set(alt);
      if (an) neu.add(id);
      else neu.delete(id);
      return neu;
    });
  const onSetZeichenabstand = (id: string, faktor: number) => {
    void backend.setZeichenabstand(id, faktor).then(uebernimmKonto);
  };
  /**
   * ★ 25.09.2026 (Johannes): eigene Schulstufe eines Kindes. Mit dem
   * Schuljahr von heute, damit sie mitwächst wie die der Klasse. Die
   * Rückmeldung sagt, welche Texte das Kind jetzt bekommt.
   */
  const onSetSchulstufe = (id: string, name: string, schulstufe: number) => {
    void backend
      // ★ D2: im Schuljahr der Klasse - gelesen wird es ebenso (`useTypingAuth`).
      .setSchulstufe(id, schulstufe, schuljahrStartjahr(Date.now(), schuljahrBeginnVon(klasseStand)))
      .then((konto) => {
        uebernimmKonto(konto);
        if (!konto) return;
        setStatus(
          schulstufe === 0
            ? t.schulstufeKindWieKlasse(name)
            : schulstufe === SCHULSTUFE_ERWACHSEN
              ? t.schulstufeKindErwachsen(name)
              : t.schulstufeKindGesetzt(name, schulstufeText(schulstufe, sprache)),
        );
      });
  };
  /**
   * Vorkenntnisse setzen. Schreibt nur das Konto - wirksam wird es beim
   * nächsten Laden durch das Kind (`letters.startpunktAnwenden`, siehe
   * TippenTrainerPage). Höher schaltet frei, niedriger stuft zurück.
   *
   * ★ Die Rückmeldung nennt beim Zurückstufen ausdrücklich, WANN es wirkt: Den
   * Fortschritt darf nur das Kind selbst schreiben (Regel `lw_progress.update`),
   * die Lehrkraft trägt hier den Beschluss ein. Ohne diesen Satz sähe eine
   * Lehrkraft in der Tabelle weiter den alten Stand und hielte das Feld für
   * kaputt.
   */
  const onSetStartUnits = (
    id: string,
    name: string,
    units: number,
    label: string,
    zurueck: boolean,
  ) => {
    void backend.setStartUnits(id, units).then((neu) => {
      uebernimmKonto(neu);
      setStatus(zurueck ? t.startZurueck(name, label) : t.startpunktVon(name, label));
    });
  };
  /**
   * ★ W2b (28.09.2026, Weg je Kind): den Lernweg eines Kindes umstellen, nach
   * der Rückfrage in `WegJeKind`. Lehnt der Server ab (keine Lehrkraft dieser
   * Klasse, kein Netz), sagt die Statuszeile es - kein stilles „geklappt".
   */
  const onSetLernweg = (id: string, name: string, weg: Lernweg) => {
    const setzer = backend.setLernwegDurchLehrkraft;
    const wt = WEG_TEXTE[sprache];
    if (!setzer) {
      setStatus(wt.nichtGesetzt(name));
      return;
    }
    void setzer
      .call(backend, id, weg)
      .then((neu) => {
        if (!neu) {
          setStatus(wt.nichtGesetzt(name));
          return;
        }
        uebernimmKonto(neu);
        setStatus(wt.gesetzt(name, wegName(weg, sprache)));
      })
      .catch(() => setStatus(wt.nichtGesetzt(name)));
  };
  /**
   * ★★★ W3b (18.09.2026): das Wochenziel EINES Kindes wirklich speichern -
   * gerufen erst NACH der Rückfrage im `Modal` von `GoalEditor` (Johannes:
   * „mit Popup und Erklärung für den Lehrer"). Kein `ladeStandNach()`-Weg
   * mehr nötig (siehe Kopf-Kommentar oben) - `uebernimmKonto` zieht das
   * frische Konto sofort in seine Zeile nach.
   */
  const onSetWochenziel = async (
    id: string,
    name: string,
    ziel: { minuten: number; wochen: string[]; nachholen: boolean },
  ) => {
    const neu = await backend.setWochenziel(id, ziel);
    if (!neu) {
      setStatus(t.wochenzielNichtGespeichert(name));
      return;
    }
    uebernimmKonto(neu);
    setStatus(t.wochenzielGespeichert(name));
  };
  const onResetOverdue = (id: string, name: string) => {
    if (!window.confirm(t.ueberfaelligFrage(name))) return;
    void backend.resetGoalOverdue(id).then((neu) => {
      uebernimmKonto(neu);
      setStatus(t.ueberfaelligErledigt(name));
    });
  };
  /**
   * ★★★★★ EINE EINZELNE WOCHE ERLASSEN (Befund 16.09.2026, z. B. bei
   * Krankheit): anders als „Überfällige zurücksetzen" (streicht ALLES vor
   * einem Stichtag) trifft das gezielt eine Woche dazwischen - schreibt sofort,
   * ohne eigenen „Speichern"-Knopf, wie „Überfällige zurücksetzen" auch.
   */
  const onSetExcusedWeeks = (id: string, weeks: string[]) => {
    void backend.setGoalExcusedWeeks(id, weeks).then((neu) => {
      uebernimmKonto(neu);
      setStatus(t.erlasseneGespeichert);
    });
  };
  /*
   * ★ F13: Womit die Steigerung der Jahreskarte eines Kindes (aufgeklappte
   * Zeile) verglichen wird - Vorwoche (Grundstellung) oder Schuljahresbeginn.
   * Der Zustand liegt HIER und nicht in der Karte, damit jede aufgeklappte
   * Zeile dasselbe zeigt. ★ K3 (19.09.2026): Der Klassenüberblick hat diesen
   * Umschalter nicht mehr - er vergleicht „Monat" mit den 4 Wochen davor und
   * „Schuljahr" in sich (`klassenueberblick.ts`).
   */
  const [bezug, setBezug] = useState<Bezug>("vorwoche");
  /**
   * ★★ Der Zeitraum der LERNENDEN-TABELLE (01.09.2026, Johannes: „dieser kopf
   * soll bei der schülerstatistik-Tabelle sein, nicht beim streifen").
   *
   * ⚠️ Bewusst NICHT derselbe Zustand wie `bezug`: `bezug` beantwortet „womit
   * wird verglichen" (Vorwoche oder Schuljahresbeginn) und gehört der
   * Jahreskarte; dies hier beantwortet „welcher Ausschnitt" und gehört der
   * Tabelle. Der Wochenstreifen hat wieder seinen eigenen - er bleibt beim
   * Schuljahr und steht nur bei der ganzen Klasse.
   *
   * ★ 18.09.2026, Johannes: „Bei der Bewertung der Schülertabelle soll
   * standardmäßig immer das Schuljahr und nicht die Woche ausgewählt sein."
   * Darum `ZEITRAUM_VORGABE_TABELLE` statt `ZEITRAUM_START` - umschalten auf
   * „Woche" bleibt jederzeit möglich, nur eben nicht mehr der Ausgangspunkt.
   */
  const [zeitraumRoh, setZeitraum] = useState<Zeitraum>(ZEITRAUM_VORGABE_TABELLE);
  /*
    ★ D2 (28.09.2026): der Beginn des Schuljahres der KLASSE gehört zu jedem
    Zeitraum dazu - `grenzen`, Titel, Vergleich und die Excel-Mappe lesen ihn
    von dort (`Zeitraum.schuljahrBeginn`). Ohne Angabe August wie bisher.
  */
  const schuljahrBeginn = schuljahrBeginnVon(klasseStand);
  const zeitraum = useMemo<Zeitraum>(
    () => ({ ...zeitraumRoh, schuljahrBeginn }),
    [zeitraumRoh, schuljahrBeginn],
  );
  /**
   * ════════════════════════════════════════════════════════════════════════
   * ★★ SORTIEREN NACH SPALTE (Johannes, 01.09.2026)
   * ════════════════════════════════════════════════════════════════════════
   * *„alle Tabellenüberschriften können angeklickt werden um nach dieser
   * Spalte zu sortieren."*
   *
   * `null` = die Reihenfolge, in der die Klasse angelegt wurde. Sie ist der
   * Ausgangszustand und muss erreichbar bleiben: Ein dritter Druck auf
   * denselben Kopf hebt die Sortierung wieder auf. Sonst gäbe es keinen Weg
   * zurück, und die Lehrkraft müsste die Seite neu laden.
   */
  const [sortierung, setSortierung] = useState<Sortierung>(null);
  const sortiereNach = (spalte: string) =>
    setSortierung((s) => {
      if (s?.spalte !== spalte) return { spalte, ab: true };
      return s.ab ? { spalte, ab: false } : null;
    });
  /**
   * ★★★ W3a (18.09.2026): Die gesperrten Zeiten der Klasse - siehe
   * `wochenziel.ts` „Eine Stunde sperren". Übung darin zählt überall sonst,
   * nur nicht fürs Wochenziel - jeder Aufruf einer wochenziel.ts-Funktion
   * bekommt sie darum gereicht. ★ W3b: aus `klasseStand`, nicht mehr aus dem
   * rohen Prop `cls` - so steht eine frische Sperre sofort hier, ohne auf das
   * nächste Nachladen durch „Meine Klassen" zu warten.
   */
  const gesperrt = useMemo(
    () => klasseStand?.gesperrteZeiten ?? EMPTY_GESPERRT,
    [klasseStand?.gesperrteZeiten],
  );
  /**
   * ★★★ W3b: Läuft „Eine Stunde sperren" gerade? Und ein Zeitgeber, der die
   * Ansicht GENAU dann neu rechnet, wenn die Sperre von selbst endet (Brief:
   * „re-render when it ends, a timer to the end time is fine") - ohne ihn
   * bliebe der Knopf „Gesperrt bis …" stehen, bis irgendetwas anderes die
   * Seite ohnehin neu zeichnet.
   */
  const [sperrPuls, setSperrPuls] = useState(0);
  const laufendeSperre = useMemo(() => {
    const jetzt = Date.now();
    return gesperrt.find((z) => z.abMs <= jetzt && z.bisMs > jetzt) ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gesperrt, sperrPuls]);
  useEffect(() => {
    if (!laufendeSperre) return;
    const wartenMs = Math.max(250, laufendeSperre.bisMs - Date.now() + 250);
    const timer = setTimeout(() => setSperrPuls((n) => n + 1), wartenMs);
    return () => clearTimeout(timer);
  }, [laufendeSperre]);
  /*
   * ★★ Die Startwoche der KLASSE (F19) - EINMAL gerechnet und an alle
   * gereicht. Rechnete jede Karte sie selbst, sähe sie je Person eine andere
   * Klasse: Die Funktion braucht die Ereignisse ALLER, und in einer Karte
   * liegen nur die einer Person. Genau so entsteht die Doppelung, bei der
   * zwei Stellen dasselbe verschieden beantworten.
   */
  const klassenStart = useMemo(
    () => klassenStartwoche(datas.map((d) => d.events), schuljahrVon(Date.now(), schuljahrBeginn)),
    [datas, schuljahrBeginn],
  );

  /**
   * ★★ DIE LERNENDEN-TABELLE FÜR DEN GEWÄHLTEN ZEITRAUM (01.09.2026).
   *
   * Der ganze Umbau ist ein FILTER - mehr braucht es nicht, weil
   * `computePupilStats` eine reine Funktion über die Übungs-Ereignisse ist.
   * Anschläge, Treffsicherheit, geübte Zeit und „zuletzt" gelten damit von
   * selbst für den Ausschnitt, und es entsteht keine zweite Rechnung, die mit
   * der ersten auseinanderlaufen könnte.
   *
   * ⚠️ `events` bleibt UNGEFILTERT. Was hinter dem Pfeil aufklappt, ist
   * ausdrücklich eine Jahresansicht (Jahreskarte mit eigenem Bezug-Umschalter);
   * die darf sich nicht mitverstellen, nur weil die Zeile darüber gerade eine
   * einzelne Woche zeigt.
   */
  const jetztMs = Date.now();
  const zeitraumDatas = useMemo(
    // ★ 12.09.2026: der Filter steht in `datasImZeitraum` - der Excel-Export
    // benutzt denselben. ★ W3a: sie rechnet seither immer mit
    // WOCHENZIEL_GRENZE (Montag 08:00), nicht mehr mit `rhythmus`.
    () => datasImZeitraum(datas, zeitraum, jetztMs),
    // `jetztMs` bewusst nicht in der Liste: Es ändert sich bei jedem Bild und
    // würde die Tabelle unablässig neu rechnen. Die Wochengrenze wandert
    // ohnehin nur einmal in der Woche.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datas, zeitraum],
  );

  /*
   * ★★ DIE WERTE DES ZEITRAUMS DAVOR - Grundlage der Pfeile (01.09.2026).
   *
   * Genau derselbe Filter, nur eine Woche bzw. ein Schuljahr zurück. Es
   * entsteht damit KEINE zweite Rechnung: Beide Seiten des Vergleichs gehen
   * durch `computePupilStats`, und wenn sich die eine ändert, ändert sich die
   * andere mit ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
   *
   * ⚠️ Bei „Gesamt" ist die Liste leer - dort gibt es kein Davor, und ein
   * erfundener Vergleich wäre schlimmer als keiner.
   */
  const vergleichsStats = useMemo(() => {
    // ★ W3a: WOCHENZIEL_GRENZE statt Klassenrhythmus, wie überall in der Tabelle.
    const g = vergleichsGrenzen(zeitraum, jetztMs, WOCHENZIEL_GRENZE);
    const out = new Map<string, PupilStats>();
    if (!g) return out;
    for (const d of datas)
      out.set(d.pupil.id, computePupilStats(ereignisseZwischen(d.events, g)));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datas, zeitraum]);
  /*
   * ★ K4-Folge (19.09.2026): wie viele Zeilen (Zeichen UND Zeit) im
   * VERGLEICHSZEITRAUM liegen - nur für „Monat" gebraucht
   * (`zeilenWerte`/`vergleichGueltig`). Eine ZWEITE Map statt eines dritten
   * Feldes an `vergleichsStats`, damit „Woche" (das diese Zahl nicht
   * braucht) unverändert bleibt.
   */
  const vergleichsZeilen = useMemo(() => {
    const g = vergleichsGrenzen(zeitraum, jetztMs, WOCHENZIEL_GRENZE);
    const out = new Map<string, number>();
    if (!g) return out;
    for (const d of datas)
      out.set(
        d.pupil.id,
        ereignisseZwischen(d.events, g).filter((e) => e.chars > 0 && e.ms > 0).length,
      );
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datas, zeitraum]);
  const vergleichsBenennung = vergleichsName(zeitraum, jetztMs, sprache);

  /*
   * ★★ Die Zeilen in der gewählten Reihenfolge.
   *
   * ⚠️ Sortiert wird über die GERECHNETEN Werte, nicht über den angezeigten
   * Text: „2 Std. 5 Min." und „38 Min." kämen als Zeichenketten in der
   * falschen Reihenfolge, und „12/31" wäre gar nicht vergleichbar.
   *
   * ⚠️ Wer noch nichts geübt hat, hat keinen Wert - und keine Null. Solche
   * Zeilen landen IMMER am Ende, in beiden Richtungen: Ein Kind, das noch
   * nicht angefangen hat, gehört nicht an die Spitze der Bestenliste und
   * genauso wenig an die Spitze der Sorgenliste
   * ([[feedback_nie_gegen_das_kind]]).
   */
  const sortierteDatas = useMemo(() => {
    if (!sortierung) return zeitraumDatas;
    const wert = (d: PupilData): number | string | null => {
      switch (sortierung.spalte) {
        case "name":
          return d.pupil.name.toLocaleLowerCase("de-AT");
        case "stufe":
          return currentLevel(d.progress, d.pupil.tempo);
        case "tasten": {
          const weg = lernwegAus(d.pupil, d.progress);
          return masteredCount(
            ensureIntroduced(d.progress.introduced, weg),
            d.progress.letters,
            weg,
            masteryForLevel(
              currentLevel(d.progress, d.pupil.tempo),
              !!d.pupil.noTimePressure,
            ),
          );
        }
        case "naechste":
          // ★ 25.09.2026: nach dem Weg im Lehrgang - wer gleich weit ist, hat
          // dieselben nächsten Tasten und steht damit beieinander.
          return ensureIntroduced(d.progress.introduced, lernwegAus(d.pupil, d.progress)).length;
        case "uebezeit":
          return d.stats.tasks ? d.stats.totalMs : null;
        case "treffer":
          return d.stats.tasks ? d.stats.accuracy : null;
        case "tempo":
          return d.stats.avgCpm || null;
        case "score":
          // ⚠️ Ohne Wertung (unter der Mindestmenge) KEIN Wert - und damit ans
          // Ende, in beiden Richtungen. Eine Null stünde sonst an der Spitze
          // der Sorgenliste ([[feedback_nie_gegen_das_kind]]).
          return scoreAusStats(d.stats).wert;
        case "challenge":
          // Nach dem Leistungswert im Schnitt. Ohne gewertete Challenge kein
          // Wert - und damit ans Ende, in beiden Richtungen (siehe oben).
          return probenUebersicht(proben[d.pupil.id] ?? KEINE_PROBEN).schnitt;
        case "gezielt": {
          // ★ Gezielt üben (13.11.2026): die Zeichen als Text - wer nichts übt, ohne Wert ans Ende (beide Richtungen).
          const w = gezieltHerkunft(d.pupil.gezielt, klasseStand?.gezielt, new Date()).wirksam;
          return w ? w.zeichen.join("") : null;
        }
        case "klassenmatch":
          // ★ 21.09.2026: dieselbe Zahl wie die Spalte (`klassenmatchSumme`).
          // Unbekannt oder abgeschaltet ohne Wert - ans Ende, in beiden
          // Richtungen (siehe oben).
          return klassenmatchSumme(
            matchAnzahl === null ? null : (matchAnzahl[d.pupil.id] ?? KEIN_MATCH_ANZAHL),
            !!klasseStand?.klassenmatchAus,
          );
        // ★ W3a: Minuten- bzw. Prozent-Anteil - dieselbe Zahl, die
        // `Wochenzielstand` zeigt, hier nur unverrundet zum Vergleichen.
        case "wochenziel": {
          const wz = wochenzielImZeitraum(
            d.events,
            kindWochenzielAusFeldern(d.pupil),
            gesperrt,
            zeitraum,
            jetztMs,
          );
          if (wz.art === "keins") return null;
          if (wz.art === "prozent") return wz.anteil;
          if (!wz.zielwoche) return null;
          const zaehler = wz.laufend ? wz.geuebtMin : wz.erfuelltMin;
          return wz.zielMin > 0 ? zaehler / wz.zielMin : 0;
        }
        default:
          return null;
      }
    };
    const richtung = sortierung.ab ? -1 : 1;
    return [...zeitraumDatas].sort((a, b) => {
      const x = wert(a);
      const y = wert(b);
      if (x === null && y === null) return 0;
      if (x === null) return 1; // ohne Wert immer ans Ende
      if (y === null) return -1;
      if (typeof x === "string" || typeof y === "string")
        return String(x).localeCompare(String(y), "de-AT") * richtung;
      return (x - y) * richtung;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zeitraumDatas, sortierung, zeitraum, gesperrt, proben, matchAnzahl, klasseStand?.klassenmatchAus, klasseStand?.gezielt]);

  /**
   * ★ Steht die Spalte „Wochenziel" überhaupt da? Johannes: *„Wochenziehl (nur
   * anzeigen wenn gesetzt)."*
   *
   * ⚠️ Gefragt wird nach dem GESETZTEN Ziel am Konto, nicht nach dem Stand der
   * laufenden Woche. Sonst verschwände die Spalte am Montagmorgen, wenn noch
   * niemand geübt hat - und die Tabelle sähe je nach Wochentag anders aus.
   */
  const zeigeWochenziel = useMemo(
    // ★ 12.09.2026: dieselbe Frage stellt der Excel-Export (`wochenzielGesetzt`).
    () => wochenzielGesetzt(datas),
    [datas],
  );
  /**
   * Knopf · Name · Leistungsstufe · Tasten · Nächste · Übezeit · [Wochenziel] · Gezielt ·
   * **Treffsicherheit · Anschl./Min · Score** · Tippchallenge · Klassenmatch
   *
   * ⚠️ Die drei fett gesetzten sind die Gruppe „Üben" (B2) - ihre Zahl steht
   * unten auch im `colSpan` der Gruppenzeile. Wer hier eine Spalte ergänzt,
   * muss sagen, ob sie zur Gruppe gehört.
   */
  const spaltenzahl = zeigeWochenziel ? 13 : 12; // ★ 25.09.: + „Nächste Tasten"; 13.11.: + „Gezielt"
  /** ★ EN6a: die Hinweise an den Spaltenköpfen in der Bedienungssprache. */
  const spaltenTexte = leistungSpaltenHilfen(sprache);

  /** Zeigen „Schuljahr" und „Gesamt" hier dasselbe? Dann sagt der Kopf es. */
  const alleEreignisseImSchuljahr = useMemo(
    () => schuljahrIstAlles(datas.flatMap((d) => d.events), jetztMs, schuljahrBeginn),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datas, schuljahrBeginn],
  );

  const einstellHandler: EinstellHandler = {
    onMeldung: setStatus,
    onSetOneHand,
    onSetGezielt,
    onSetNoTimePressure,
    onSetZeichenabstand,
    onSetSchulstufe,
    onSetStartUnits,
    onSetLernweg,
  };

  /*
   * ★★★ B10 (11.09.2026): „DIESE EINSTELLUNGEN FÜR ALLE ÜBERNEHMEN" IST WEG.
   *
   * Der Knopf übertrug genau vier Werte von einem Kind auf alle anderen:
   * Textstufe, Geburtsjahr-Regel, Sprache samt Sperre, „Einhand schreiben" und
   * „Tempo zählt nicht". Die ersten vier gehören seit diesem Umbau der KLASSE
   * (Kasten „Einstellungen der Klasse") - ein zweiter Weg, sie über die Klasse
   * zu verteilen, wäre genau die Doppelung, die sich am zweiten Tag
   * auseinanderlebt. Die beiden letzten sind Arbeitsweisen EINES Kindes; sie
   * für alle zu setzen war nie die Absicht.
   *
   * Mit dem Knopf fallen `busy` in der Zeile („für alle läuft gerade") und die
   * Schleife über alle Konten weg; `busy` selbst bleibt - Wochenziel und
   * Unterrichtszeit setzen es weiter.
   */

  /**
   * ★★★ W3b (18.09.2026): „Für die Klasse übernehmen" - Rückfrage im `Modal`
   * (Johannes: „mit Popup und Erklärung für den Lehrer"), erst danach
   * `backend.setKlassenWochenziel`. `classGoalMin` darf leer sein (noch nichts
   * eingetragen) oder ausserhalb 0-600 liegen - beides macht den Knopf
   * `aria-disabled` (siehe unten), 0 selbst ist ein gültiger Wert („kein
   * Wochenziel", Johannes: das muss man setzen dürfen, nicht nur raten).
   */
  const classGoalMinZahl = classGoalMin.trim() === "" ? null : Number(classGoalMin);
  const classGoalMinGueltig =
    classGoalMinZahl !== null &&
    Number.isFinite(classGoalMinZahl) &&
    classGoalMinZahl >= 0 &&
    classGoalMinZahl <= 600;
  const [klassenFrage, setKlassenFrage] = useState<{
    minuten: number;
    wochen: string[];
    nachholen: boolean;
  } | null>(null);
  const onKlassenWochenzielOeffnen = () => {
    if (!cls || busy || !classGoalMinGueltig || classGoalMinZahl === null) return;
    setKlassenFrage({ minuten: classGoalMinZahl, wochen: classGoalWeeks, nachholen: classGoalCatchUp });
  };
  const onKlassenWochenzielUebernehmen = async () => {
    if (!cls || !klassenFrage) return;
    setBusy(true);
    try {
      const { ok, fehler } = await backend.setKlassenWochenziel(cls.code, klassenFrage);
      // ★ „Die Antwort des Servers steht sofort im Feld": `setKlassenWochenziel`
      // gibt selbst keine Konten zurück (das Schreiben läuft für die ganze
      // Klasse in einem Aufruf) - frisch nachgelesen, statt auf das nächste
      // Nachladen durch „Meine Klassen" zu warten.
      const frisch = await backend.listPupils(cls.code);
      for (const p of frisch) ziehKontoNach(p);
      setStatus(
        t.klassenZielGespeichert(klassenFrage.minuten, ok, datas.length, Date.now()) +
          (fehler.length > 0 ? t.klassenZielFehler(fehler.join(", ")) : ""),
      );
      onChanged();
    } finally {
      setBusy(false);
      setKlassenFrage(null);
    }
  };

  /**
   * ★★★ W3b: „Eine Stunde sperren" - Johannes: „der Lehrer bekommt einen
   * Schalter für eine Stunde sperren". Direkte Handlung, keine Rückfrage
   * (anders als das Wochenziel: eine Sperre wirkt nur 60 Minuten und lässt
   * sich mit demselben Knopf sofort wieder aufheben - siehe „Gesperrt
   * bis …" unten). `busy` ist derselbe geteilte Zustand wie bei jeder
   * anderen Einstellung dieser Seite.
   */
  const onStundeSperren = async () => {
    if (!cls || busy) return;
    setBusy(true);
    try {
      if (laufendeSperre) {
        const neu = await backend.sperreAufheben(cls.code);
        if (!neu) {
          setStatus(t.sperreNichtAufgehoben);
          return;
        }
        setKlasseStand(neu);
        setStatus(t.sperreAufgehoben);
      } else {
        const neu = await backend.stundeSperren(cls.code);
        if (!neu) {
          setStatus(t.stundeNichtGesperrt);
          return;
        }
        setKlasseStand(neu);
        const jetzt = Date.now();
        const zeile = neu.gesperrteZeiten?.find((z) => z.abMs <= jetzt && z.bisMs > jetzt);
        setStatus(
          zeile ? t.gesperrtBisStatus(uhrzeitAusMs(zeile.bisMs, sprache)) : t.stundeGesperrt,
        );
      }
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  /*
   * ★★ „ALS EXCEL SPEICHERN" (12.09.2026). Vier Zeiträume, egal, was oben
   * gewählt ist (`leistungsBlaetter`). ★ 13.09.2026: Blätter „Übersicht",
   * „Schuljahr", „Gesamt", „Woche" - geschrieben mit exceljs
   * (`leistungHerunterladen`). ★ K4 (19.09.2026): „Monat" kam dazu, zwischen
   * „Gesamt" und „Woche" (siehe `leistungExport.ts`, `LEISTUNG_BLAETTER`).
   *
   * ⚠️ Fokus: Der Schalter wird weder gesperrt noch ausgetauscht, und das
   * Herunterladen über einen unsichtbaren Link nimmt ihm den Fokus nicht - er
   * bleibt also ohne eigenes Zutun stehen (gemessen im UI-Test). Die Sperre
   * gegen doppeltes Auslösen sitzt im Handler (`aria-disabled`, Hausregel R10).
   * Rückmeldung in der vorhandenen Statuszeile, keine neue Live-Region.
   */
  const [exportLaeuft, setExportLaeuft] = useState(false);
  const onExport = async () => {
    if (exportLaeuft) {
      setStatus(t.excelLaeuft);
      return;
    }
    setExportLaeuft(true);
    const jetzt = Date.now();
    try {
      // ★ EN6a: die Mappe in der Sprache der Bedienung (`leistungExport.ts`).
      const dateiname = await leistungHerunterladen(
        leistungsBlaetter(datas, proben, gesperrt, jetzt, cls?.name, sprache, schuljahrBeginn),
        { klassenname: cls?.name, jetztMs: jetzt, sprache },
      );
      setStatus(t.excelFertig(dateiname));
    } catch {
      setStatus(t.excelFehler);
    } finally {
      setExportLaeuft(false);
    }
  };

  if (ladend)
    return (
      <p role="status" aria-live="polite" className="text-ink-muted">
        {t.laedt}
      </p>
    );

  return (
    <div
      // ★ `flex flex-col gap-4` statt `space-y-5` (11.09.2026, R5): Die erste
      // Zeile hier ist die `sr-only`-Statuszeile - `space-y` gab der Karte
      // darunter trotzdem 20 px nach oben, ein `gap` zählt nur Kinder im Fluss.
      className="flex flex-col gap-4"
      {...schrift}
      // ★ E11a-3 (26.09.2026): `<html lang>` folgt weiter der gekappten
      // Sprache (bis der globale Einzeiler kommt, siehe `sprache.ts`) - diese
      // Ansicht zeigt jetzt aber wirklich Französisch, wenn `spracheGewaehlt`
      // „fr" ist, und trägt darum ihr eigenes `lang` (dieselbe Regel wie
      // `KlassenmatchLobby.tsx`/`KlassenmatchEinladung.tsx`, E11a-2).
      lang={sprache === "de" ? undefined : sprache}
      // Still nachladen: Der Inhalt bleibt stehen (und damit der Fokus), die
      // Sprachausgabe erfährt trotzdem, dass gerade Zahlen nachkommen.
      aria-busy={nachladend ? true : undefined}
      /*
        ★★★ ALT + ← / ALT + → BLÄTTERT DIE WOCHEN - in der ganzen Ansicht.
        Johannes 01.09.2026: *„mit alt pfeil links und rechts schaltet man die
        wochen vor und rückwärts."* Der Horcher hängt HIER und nicht am
        `window`: Wer mit Sprachausgabe oder Braillezeile liest, soll die Taste
        nur haben, solange er in dieser Ansicht steht - und die blanken
        Pfeiltasten bleiben frei für die Tabelle (siehe `ZeitraumKopf.tsx`).
      */
      onKeyDown={wochenBlaetternTaste((schritt) =>
        setZeitraum((z) => blaettereZeitraum(z, schritt)),
      )}
    >
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>
      {schriftAnsage}

      {teacherId && (
        <SpendenBanner
          app="tastenflow"
          zielgruppe="lehrkraft"
          kontoId={teacherId}
          stundenGesamt={spendenbannerStundenGesamt}
          stundenHalbjahr={spendenbannerStundenHalbjahr}
        />
      )}

      {/*
        ★ Der Stand dieser Konten konnte nicht gelesen werden. Die Zeilen
        stehen trotzdem da (die Einstellungen sind ja lesbar) - aber ihre
        Zahlen sind KEINE Messung, und das muss dastehen, statt eine Null zu
        zeigen, die niemand als Fehler erkennt.
      */}
      {lesefehler.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border-2 border-warning bg-warning-soft px-4 py-3 text-sm text-ink"
        >
          <strong>{t.lesefehlerStark}</strong>
          {t.lesefehlerFuer(lesefehler.join(", "))}
          <em>{t.lesefehlerNicht}</em>
          {t.lesefehlerSchluss}
        </div>
      )}

      {/* ★ R5 (11.09.2026): `flex flex-col gap-4` statt `space-y-4` - das erste
          Kind ist die `sr-only`-Überschrift (R11), und `space-y` gab der
          Tippchallenge dahinter trotzdem 16 px nach oben: 32 statt 16 px unter
          der Kartenkante (Begründung an der Überschrift). */}
      <div className="card flex flex-col gap-4 p-4">
        {/*
          ★ Johannes, 01.09.2026: *„der ganze text oben ist viel zu viel …
          Einstellungen, textstufe und geburtsjehr braucht man da nicht
          erklären, nur mouse over bei der spaltenüberschrift."*
          Was hier stand - drei Absätze über die Spalten, über den
          Einstellungen-Knopf und über Textstufe/Geburtsjahr - steht jetzt
          dort, wo es gebraucht wird: am Spaltenkopf und im aufgeklappten
          Bereich. Der eine Satz, der bleibt, ist keine Erklärung, sondern die
          Zusage, wie weit dieser Einblick reicht.
        */}
        {/*
          ★★★ DIE ÜBERSCHRIFT IST NUR NOCH FÜR SPRACHAUSGABEN DA (R11, 11.09.2026).
          Johannes, 11.09.2026 abends, auf die Frage, ob „Zuhaus - Tastenflow"
          bleiben soll: *„ja zweiter überschrift weg"*. Direkt darüber stehen
          schon die Klassenauswahl und der Programm-Reiter - die Überschrift
          sagte beides ein zweites Mal. (Seit 01.09.2026 nannte sie Klasse und
          Programm statt „Stand in Tastenflow".)

          ⚠️ Sie bleibt als `h2` im Baum (`sr-only`): Wer mit der Sprachausgabe
          von Überschrift zu Überschrift springt, findet den Bereich weiter.
          Ohne Klasse bleibt der Programmname stehen - eine Überschrift, die je
          nach Zustand verschwindet, lässt eine Sprachausgabe im Leeren.
          ⚠️ Darum trägt die Karte `flex flex-col gap-4` statt `space-y-4`:
          `space-y` gäbe dem nächsten Kind 16 px nach oben, obwohl die
          `sr-only`-Überschrift keinen Platz einnimmt - oben stünden 32 statt
          16 px. Ein `gap` gilt nur zwischen Kindern, die im Fluss stehen.

          ★★ „NACHRICHT AN DIE KLASSE" steht seit 11.09.2026 (Nacht) rechts in
          der Kopfzeile des Klassenüberblicks - siehe `Klassenueberblick` weiter
          unten.
        */}
        <h2 className="sr-only">{cls?.name ? `${cls.name} - Tastenflow` : "Tastenflow"}</h2>

        {/*
          ════════════════════════════════════════════════════════════════════
          ★★★★★ E3 (18.09.2026, Bauplan „Meine Klassen" - Aufgaben-Zeile)
          ════════════════════════════════════════════════════════════════════
          Johannes 18.09.2026: die Seite ist „unübersichtlich" - die Tabelle
          soll ohne Scrollen sichtbar sein. Bis dahin standen hier VIER
          gestapelte Kästen (Tippchallenge, Eigene Übung, Wochenziel,
          zuunterst Einstellungen der Klasse); jetzt EINE Reihe von vier
          Schaltern, ihr Panel öffnet darunter - immer höchstens eines
          (`schaltePanel`, oben im Bauteil). Jeder Schalter trägt seinen Stand
          als zweiten, unbetonten Teil - „Tippchallenge · läuft" ist damit
          auch zugeklappt nicht zu übersehen (Auftrag Johannes, siehe
          `handleTippchallengeStatus` oben: eine laufende Runde öffnet ihr
          Panel von selbst).

          Die vier Kästen selbst - `SchreibprobeKasten`, `EigeneUebungKasten`,
          das Wochenziel-Formular, `Klasseneinstellungen` - sind UNVERÄNDERT
          (Formulare, Handler, Texte); nur ihr eigener Rahmen/Kopf/Zuklapp-
          Mechanismus entfällt (`eingebettet`, siehe dort), weil die Reihe hier
          genau das jetzt übernimmt.
        */}
        <div
          data-rundgang="aufgaben"
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={t.aufgabenGruppe}
        >
          {cls && (
            <Tipp text={t.tippchallengeTipp}>
              {(hinweisId) => (
                <button
                  ref={tippchallengeBtnRef}
                  type="button"
                  className="btn-secondary btn-toggle btn-umriss aria-expanded:bg-accent-soft"
                  aria-expanded={offenesPanel === "tippchallenge"}
                  aria-controls="mk-tf-panel-tippchallenge"
                  aria-describedby={hinweisId}
                  onClick={() => schaltePanel("tippchallenge")}
                >
                  {t.tippchallenge}
                  {tippchallengeStatus && (
                    <span className="font-normal text-ink-muted"> · {tippchallengeStatus}</span>
                  )}
                </button>
              )}
            </Tipp>
          )}
          {cls && (
            <Tipp text={t.eigeneUebungTipp}>
              {(hinweisId) => (
                <button
                  ref={eigeneUebungBtnRef}
                  type="button"
                  className="btn-secondary btn-toggle btn-umriss aria-expanded:bg-accent-soft"
                  aria-expanded={offenesPanel === "eigene-uebung"}
                  aria-controls="mk-tf-panel-eigene-uebung"
                  aria-describedby={hinweisId}
                  onClick={() => schaltePanel("eigene-uebung")}
                >
                  {t.eigeneUebung}
                  <span className="font-normal text-ink-muted"> · {eigeneUebungStatus}</span>
                </button>
              )}
            </Tipp>
          )}
          <Tipp text={t.wochenzielTipp}>
            {(hinweisId) => (
              <button
                ref={wochenzielBtnRef}
                type="button"
                className="btn-secondary btn-toggle btn-umriss aria-expanded:bg-accent-soft"
                aria-expanded={offenesPanel === "wochenziel"}
                aria-controls="mk-tf-panel-wochenziel"
                aria-describedby={hinweisId}
                onClick={() => schaltePanel("wochenziel")}
              >
                {t.wochenziel}
                {/* ★ Kurz, wie am Schalter selbst (36 px Zeile) - die volle
                    Fassung steht unverändert in der Überschrift des Panels
                    darunter. ⚠️ `classGoalMin` ist das FORMULAR (die zuletzt für
                    die Klasse gesetzte Vorgabe, leer ohne eine) - hat ein Kind
                    sein Ziel nur EINZELN bekommen, bleibt das Formular leer,
                    obwohl `zeigeWochenziel` schon zutrifft; „gesetzt" deckt genau
                    diesen Fall ab, statt eine leere Zahl zu zeigen. */}
                <span className="font-normal text-ink-muted">
                  {" "}
                  ·{" "}
                  {zeigeWochenziel
                    ? classGoalMin !== ""
                      ? t.zielStatusMin(classGoalMin)
                      : t.zielGesetzt
                    : t.keinZiel}
                </span>
              </button>
            )}
          </Tipp>
          {/*
            ════════════════════════════════════════════════════════════════
            ★★★ „EINE STUNDE SPERREN" (W3b, Bauplan §W, Johannes: „der Lehrer
            bekommt einen Schalter für eine Stunde sperren")
            ════════════════════════════════════════════════════════════════
            Vierter Schalter (Johannes 19.09.2026: „tausche die Schalter
            ‚Stunde sperren' mit ‚Einstellungen der Klasse'"), kein Panel -
            eine DIREKTE Handlung, jede Stunde
            gebraucht, darum immer sichtbar (sobald eine echte Klasse mit
            Lehrkraft da ist). 60 Minuten für die ganze Klasse; Übung darin
            zählt weiter als Übezeit und Statistik, nur nicht fürs Wochenziel.
            Läuft eine Sperre, liest der Knopf „Gesperrt bis …" und hebt sie
            mit demselben Druck wieder auf. Fokus bleibt am Knopf - er wird
            nie ausgehängt, nur seine Beschriftung wechselt.
          */}
          {cls && teacherId && (
            <Tipp
              text={laufendeSperre ? t.sperreBeendenTipp : t.sperrenTipp}
            >
              {(hinweisId) => (
                <button
                  type="button"
                  className="btn-secondary btn-toggle btn-umriss aria-disabled:opacity-40"
                  aria-disabled={busy}
                  aria-describedby={hinweisId}
                  onClick={() => void onStundeSperren()}
                >
                  {laufendeSperre
                    ? t.gesperrtBisKnopf(uhrzeitAusMs(laufendeSperre.bisMs, sprache))
                    : t.stundeSperren}
                </button>
              )}
            </Tipp>
          )}
          {cls && teacherId && (
            <Tipp text={t.einstellungenTipp}>
              {(hinweisId) => (
                <button
                  ref={einstellungenBtnRef}
                  type="button"
                  className="btn-secondary btn-toggle btn-umriss aria-expanded:bg-accent-soft"
                  aria-expanded={offenesPanel === "einstellungen-klasse"}
                  aria-controls="mk-tf-panel-einstellungen-klasse"
                  aria-describedby={hinweisId}
                  onClick={() => schaltePanel("einstellungen-klasse")}
                >
                  {t.einstellungenDerKlasse}
                  {einstellungenStatus && (
                    <span className="font-normal text-ink-muted"> · {einstellungenStatus}</span>
                  )}
                </button>
              )}
            </Tipp>
          )}
        </div>

        {/*
          ★ „Panels bleiben gemountet, nur `hidden` wechselt" - Begründung am
          State-Block weiter oben (`AufgabenPanel`). Seit 19.09.2026 öffnen und
          schliessen alle vier SICHTBAR (`Aufklappen … bleibt`, Johannes: „der
          Rest rutscht nach unten und der andere kommt nach"): `hidden` kommt
          aus `verborgen` und greift erst, wenn das Panel ganz zu ist; die `id`
          für `aria-controls` bleibt an der `section`. `onKeyDown` fängt Escape
          nur AUF dem Panel ab (Erfassungsphase des `Modal` bzw. der native
          `window.confirm` sind vorher am Zug, siehe `escapeSchliesst`).
        */}
        {cls && (
          <Aufklappen offen={offenesPanel === "tippchallenge"} bleibt>
          {(verborgen) => (
          <section
            id="mk-tf-panel-tippchallenge"
            aria-label={t.tippchallenge}
            hidden={verborgen}
            className="rounded-xl border border-hairline bg-surface-sunken px-3 py-2"
            onKeyDown={escapeSchliesst(tippchallengeBtnRef)}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3
              ref={offenesPanel === "tippchallenge" ? panelUeberschriftRef : undefined}
              tabIndex={-1}
              className="m-0 text-sm font-semibold text-ink outline-none"
            >
              {t.tippchallenge}
            </h3>
            <FilmKnopf nr="T-L11" />
            </div>
            <SchreibprobeKasten
              cls={cls}
              pupils={pupils}
              onClassChange={onChanged}
              eingebettet
              onStatus={handleTippchallengeStatus}
              onFokusSchalter={() => tippchallengeBtnRef.current?.focus()}
            />
          </section>
          )}
          </Aufklappen>
        )}

        {cls && (
          <Aufklappen offen={offenesPanel === "eigene-uebung"} bleibt>
          {(verborgen) => (
          <section
            id="mk-tf-panel-eigene-uebung"
            aria-label={t.eigeneUebung}
            hidden={verborgen}
            className="rounded-xl border border-hairline bg-surface-sunken px-3 py-2"
            onKeyDown={escapeSchliesst(eigeneUebungBtnRef)}
          >
            {/*
              ★ Z1: die Fortschritte, die diese Seite ohnehin geladen hat -
              damit steht an jeder Übung der Reihe „n von m Kindern fertig".
              Solange noch geladen wird, keine Zahl (sonst stünde kurz
              „0 von 0" da).
              ★ L4 (EN6b, 19.09.2026, Johannes: „die drei Schalter in die obere
              Zeile, also: ‚Eigene Übung:' |Datei hochladen|..."): Die
              Überschrift des Panels steht VORN in der Zeile der drei Wege -
              `EigeneUebungKasten` setzt sie dorthin (`titel`). Fokus-Ziel bleibt sie.
            */}
            <EigeneUebungKasten
              cls={cls}
              onClassChange={onChanged}
              eingebettet
              kinderFortschritt={ladend ? undefined : datas.map((d) => d.progress)}
              titel={
                <div className="flex flex-wrap items-center gap-2">
                <h3
                  ref={offenesPanel === "eigene-uebung" ? panelUeberschriftRef : undefined}
                  tabIndex={-1}
                  className="m-0 text-sm font-semibold text-ink outline-none"
                >
                  {t.eigeneUebung}
                  <span aria-hidden="true">:</span>
                </h3>
                <FilmKnopf nr="T-L10" />
                </div>
              }
            />
          </section>
          )}
          </Aufklappen>
        )}

        {/*
          ════════════════════════════════════════════════════════════════════
          ★★ „WOCHENZIEL - AUFGABE" (Johannes, 01.09.2026; Panel seit E3)
          ════════════════════════════════════════════════════════════════════
          *„verschlanke den Bereich Wochenziel und gib ihm eine Überschrift:
          Wochenziel - Aufgabe."* Verschlankt heisst hier zweierlei: die Felder
          auf die Höhe der Umschalter (`feld-schlank`, ~32 px statt 44), und
          die drei Absätze Kleingedrucktes auf EINE Zeile. Was dort stand - was
          0 bedeutet, was eine leere Wochenauswahl bedeutet, dass man einzelne
          danach feinjustieren kann - steht jetzt dort, wo es gebraucht wird:
          am Feld selbst.
        */}
        <Aufklappen offen={offenesPanel === "wochenziel"} bleibt>
        {(verborgen) => (
        <section
          id="mk-tf-panel-wochenziel"
          aria-label={t.wochenziel}
          hidden={verborgen}
          className="rounded-xl border border-hairline bg-surface-sunken px-3 py-2"
          onKeyDown={escapeSchliesst(wochenzielBtnRef)}
        >
          <div className="flex flex-wrap items-center gap-2">
          <h3
            ref={offenesPanel === "wochenziel" ? panelUeberschriftRef : undefined}
            tabIndex={-1}
            className="m-0 text-sm font-semibold text-ink outline-none"
          >
            {t.wochenzielAufgabe}
            <span className="font-normal text-ink-muted">
              {" "}
              {zeigeWochenziel ? t.zielFuerKlasseGesetzt : t.nochKeinZielGesetzt}
            </span>
          </h3>
          <FilmKnopf nr="T-L07" />
          <FilmKnopf nr="T-L13" />
          </div>
          {/*
            ════════════════════════════════════════════════════════════════
            ★★★ W3b (18.09.2026): NUR NOCH MINUTEN - KEINE UNTERRICHTSZEIT MEHR
            ════════════════════════════════════════════════════════════════
            Johannes 18.09.2026 nachts: „ich möchte einfach Wochenziel in
            Minuten und fertig, wir lassen das mit der Unterrichtsstunde aus".
            Der Kasten „Unterrichtszeit der Klasse" (Unterrichtstag,
            Unterrichtsende) ist damit ERSATZLOS weg - die Wochengrenze ist
            jetzt überall dieselbe feste Montag-08:00-Grenze
            (`WOCHENZIEL_GRENZE`). „Eine Stunde sperren" (Schalter in der
            Reihe darüber) übernimmt, was die Unterrichtsstunde bisher tun
            sollte, ohne eine zweite Wochengrenze zu brauchen.

            ★ „Halte die Seite extrem schlank … das geht mit Mouseover" -
            keine stehenden Absätze mehr; jede Erklärung steckt in einem
            `Tipp` am jeweiligen Feld.
          */}
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label className="field-label" htmlFor="mk-cls-goal-min">
                  {t.minutenProWoche}
                </label>
                <Tipp text={t.nullKeinZiel} ausrichtung="links">
                  {(hinweisId) => (
                    <input
                      id="mk-cls-goal-min"
                      type="number"
                      min={0}
                      max={600}
                      className="field-input feld-schlank w-24"
                      aria-describedby={hinweisId}
                      value={classGoalMin}
                      onChange={(e) => setClassGoalMin(e.target.value)}
                    />
                  )}
                </Tipp>
              </div>
              <div>
                <span className="field-label">{t.zielKalenderwochen}</span>
                <WeekMultiSelect
                  value={classGoalWeeks}
                  onChange={setClassGoalWeeks}
                  nowMs={Date.now()}
                />
              </div>
              {/*
                ★ Fokus-Pflicht (WCAG 2.4.3, [[feedback_fokus_pflicht_alle_apps]]):
                `aria-disabled` statt `disabled` - ein Knopf, der sich beim
                Drücken selbst ausschaltet, nimmt den Fokus mit. Der Schutz
                gegen das doppelte Auslösen sitzt im Handler.
              */}
              {/* ⚠️ `ausrichtung="rechts"` (11.09.2026, im Browser gemessen): Links
                  angedockt ragte der Hinweis bei 700 px Fensterbreite über den
                  Rand - auch unsichtbar machte er die Seite 804 px breit, sobald
                  „Wochenziel - Aufgabe" aufgeklappt war. */}
              <Tipp
                text={!classGoalMinGueltig ? t.minutenZuerst : t.klassenZielTipp}
                ausrichtung="rechts"
              >
                {(hinweisId) => (
                  <button
                    type="button"
                    className="btn-secondary btn-toggle btn-umriss whitespace-nowrap aria-disabled:opacity-40"
                    aria-disabled={busy || !classGoalMinGueltig}
                    aria-describedby={hinweisId}
                    onClick={onKlassenWochenzielOeffnen}
                  >
                    {t.fuerKlasseUebernehmen}
                  </button>
                )}
              </Tipp>
              {/* ★ E12: siehe die Begründung an der Person-Fassung oben
                  (Kästchen/Beschriftung als Geschwister, nicht verschachtelt;
                  „links" - Browser-Messung 700 px, das Kästchen steht ganz
                  links in seiner Zeile). */}
              <div className="flex w-full items-center gap-2 text-sm text-ink">
                <Tipp text={t.nachholenTipp} ausrichtung="links">
                  {(hinweisId) => (
                    <span className="flex items-center gap-2">
                      <input
                        id={classGoalCatchUpId}
                        type="checkbox"
                        className="h-4 w-4 accent-[rgb(var(--c-accent))]"
                        checked={classGoalCatchUp}
                        aria-describedby={hinweisId}
                        onChange={(e) => setClassGoalCatchUp(e.target.checked)}
                      />
                      <label htmlFor={classGoalCatchUpId}>{t.nachholen}</label>
                    </span>
                  )}
                </Tipp>
              </div>
            </div>
          </div>
        </section>
        )}
        </Aufklappen>

        {/*
          ★★★ Die Rückfrage vorm „Für die Klasse übernehmen" (Johannes: „mit
          Popup und Erklärung für den Lehrer") - Bauart wie „Startniveau für
          die ganze Klasse" weiter unten (`Klasseneinstellungen`).
        */}
        {klassenFrage && cls && (
          <Modal
            title={t.wochenzielFuerKlasse(klassenBezeichnung(cls.name, sprache))}
            onClose={() => setKlassenFrage(null)}
          >
            <div className="space-y-3 text-sm text-ink">
              <p className="m-0">
                {klassenZielPopupText(datas.length, klassenFrage.minuten, Date.now(), sprache)}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-primary aria-disabled:opacity-40"
                  aria-disabled={busy}
                  onClick={() => void onKlassenWochenzielUebernehmen()}
                >
                  {t.uebernehmen}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setKlassenFrage(null)}
                >
                  {t.abbrechen}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {cls && teacherId && (
          <Aufklappen offen={offenesPanel === "einstellungen-klasse"} bleibt>
          {(verborgen) => (
          <section
            id="mk-tf-panel-einstellungen-klasse"
            aria-label={t.einstellungenDerKlasse}
            hidden={verborgen}
            className="rounded-xl border border-hairline bg-surface-sunken px-3 py-2"
            onKeyDown={escapeSchliesst(einstellungenBtnRef)}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3
              ref={offenesPanel === "einstellungen-klasse" ? panelUeberschriftRef : undefined}
              tabIndex={-1}
              className="m-0 text-sm font-semibold text-ink outline-none"
            >
              {t.einstellungenDerKlasse}
            </h3>
            <FilmKnopf nr="T-L08" />
            <FilmKnopf nr="T-L09" />
            <FilmKnopf nr="T-L12" />
            </div>
            <Klasseneinstellungen
              cls={cls}
              datas={datas}
              teacherId={teacherId}
              busy={busy}
              setBusy={setBusy}
              setStatus={setStatus}
              onChanged={onChanged}
              ziehKontoNach={ziehKontoNach}
              onStatus={setEinstellungenStatus}
            />
          </section>
          )}
          </Aufklappen>
        )}

        {/*
          ════════════════════════════════════════════════════════════════════
          ★★★★ K3 (19.09.2026): DER KLASSENÜBERBLICK STEHT SCHLANK ÜBER DER
          TABELLE - immer sichtbar, kein Aufklapper mehr
          ════════════════════════════════════════════════════════════════════
          Johannes: *„der Klassenüberblick wird schlank und steht über der
          Tabelle"*. Seit E3 (18.09.) stand er zugeklappt UNTER der Tabelle -
          damals, weil die alte Jahreskarte der Klasse so hoch war, dass die
          Tabelle erst nach viel Scrollen kam. Jetzt ist er drei Zeilen hoch
          (Kopf, Kennzahlen, Leiste + Linie) und darf darum zurück nach oben,
          direkt vor den Zeitraum-Kopf der Tabelle. Er hat seinen EIGENEN
          Umschalter (Monat | Schuljahr) - der Zeitraum-Kopf darunter gehört
          der Tabelle. Ohne Kinder gibt er `null` zurück.

          ★★★ „NACHRICHT AN DIE KLASSE" steht rechts in seiner Kopfzeile
          (Johannes 11.09.2026, Nacht: *„Bringe den Schalter ‚Nachricht an die
          Klasse' rechts auf gleiche Höhe"*). Derselbe Baustein wie in der
          Verwaltung (`KlasseUndKinder.tsx`), keine zweite Fassung
          ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
          ⚠️ Nur mit Klasse (ohne gibt es niemanden, dem man schreibt).
          ⚠️ `key` an der Klasse: Ein halb geschriebener Text darf beim
          Klassenwechsel nicht in das Fenster der anderen Klasse wandern.
          ⚠️ NIE die Kinder einer ANDEREN Klasse: Solange eine gewählte Klasse
          lädt, trug `pupils` im Klassenkopf die Liste der VORIGEN Klasse
          (Regel aus `MeineKlassePage.tsx`).
        */}
        <Klassenueberblick
          film="T-L06"
          datas={datas}
          gesperrt={gesperrt}
          schuljahrBeginn={schuljahrBeginn}
          kopfRechts={
            cls ? (
              <LwClassMessageButton
                key={cls.code}
                classCode={cls.code}
                pupils={(pupils.some((p) => p.classCode !== cls.code) ? [] : pupils).map(
                  (p) => ({ id: p.id, name: p.name }),
                )}
              />
            ) : undefined
          }
        />

        {/*
          ★★ DER ZEITRAUM-KOPF (01.09.2026, neu geordnet 18.09.2026, Bauplan
          „Meine Klassen" E1). Links die Klasse, rechts EINE Gruppe: Blättern,
          Woche, Schuljahr, Gesamt, Blättern, Excel. Er steht über BEIDEN
          Darstellungen, weil beide dieselben Zahlen zeigen.
        */}
        {datas.length > 0 && (
          <ZeitraumKopf
            zeitraum={zeitraum}
            onZeitraum={setZeitraum}
            klasse={klassenBezeichnung(cls?.name, sprache)}
            titel={zeitraumTitel(zeitraum, jetztMs, WOCHENZIEL_GRENZE, sprache)}
            wocheKompakt={wochenBereichKompakt(
              zeitraum.wochenVersatz,
              jetztMs,
              WOCHENZIEL_GRENZE,
              sprache,
            )}
            // ★ K4 (19.09.2026): derselbe kurze Bereich für „Monat".
            monatKompakt={monatBereichKompakt(
              zeitraum.monatVersatz ?? 0,
              jetztMs,
              WOCHENZIEL_GRENZE,
              sprache,
            )}
            // ★ 18.09.2026: Die gezeigte Jahreszahl folgt dem Blättern
            // (`jahrVersatz`) - vorher stand hier immer das AKTUELLE
            // Schuljahr, auch wenn schon ein anderes Jahr aufgeblättert war.
            schuljahrLabel={schuljahrVersetzt(jetztMs, zeitraum.jahrVersatz ?? 0).label}
            gleichbedeutend={alleEreignisseImSchuljahr}
            titelId="mk-tf-zeitraum"
            /*
              ★★ 12.09.2026: „Als Excel herunterladen" rechts nach „Gesamt" - dort,
              wo man den Zeitraum wählt, weil die Datei ALLE vier Zeiträume
              enthält. Das sagt der Hinweis, samt Dateiname. Schlank wie die
              Zeitraum-Schalter daneben (`btn-toggle`).

              ★ 18.09.2026: „zeitraum-aktion" - der Container-Schalter, der bei
              wenig Platz rund und wortlos wird (`index.css`, `@container
              zeitraum-kopf`). Das Wort bleibt sr-only im Baum stehen
              (`zeitraum-aktion-wort`), der Name für die Sprachausgabe ändert
              sich also nicht.
            */
            aktion={
              <Tipp text={t.excelTipp(leistungDateiname(cls?.name, jetztMs))}>
                {(hinweisId) => (
                  <button
                    type="button"
                    className="zeitraum-aktion btn-secondary btn-toggle btn-umriss inline-flex items-center gap-1.5 whitespace-nowrap text-sm aria-disabled:opacity-40"
                    aria-disabled={exportLaeuft}
                    aria-describedby={hinweisId}
                    onClick={() => void onExport()}
                  >
                    <Icon name="download" className="h-4 w-4 shrink-0" />
                    {/* ⚠️ „herunterladen", nicht „speichern": Die Einstellungen
                        dieser Seite speichern sofort, und `Ziel speichern` ist
                        laut Wächter der EINE Speichern-Knopf
                        (`tastenflow-einstellungen-speichern.test.tsx`). */}
                    <span className="zeitraum-aktion-wort">{t.alsExcel}</span>
                  </button>
                )}
              </Tipp>
            }
          />
        )}

        {/* ★ Gezielt üben (13.11.2026): die Leiste der Mehrfachauswahl - nur, solange Kinder markiert sind. */}
        <GezieltMehrfachLeiste
          anzahl={anzahlMarkiert}
          onSpeichern={onSetGezieltMarkierte}
          onAufheben={() => {
            setMarkiert(new Set());
            // Die Leiste verschwindet - der Fokus geht an die erste Markierung der Tabelle, nicht ins Leere.
            window.setTimeout(
              () => document.querySelector<HTMLElement>("[data-gezielt-markieren]")?.focus(),
              0,
            );
          }}
        />

        {/*
          ★★ EINE Tabelle - siehe den Kopf dieser Datei. Der Zebra-Grund und
          die klebende erste Spalte stecken in `PupilRow`.
        */}
        {/*
          ⚠️ `min-w-0` (11.09.2026, gemessen mit `npm run pruefstand:seitenbreite`):
          Ohne es machte die Tabelle bei 320 px die GANZE SEITE 635 px breit -
          der Kasten hat zwar `overflow-auto`, wächst aber selbst mit seinem
          Inhalt, solange er nicht ausdrücklich schrumpfen darf. Mit `min-w-0`
          schiebt man die Tabelle in ihrem Kasten seitlich, statt die Seite
          seitlich zu schieben. Der Befund ist älter als dieser Umbau (er stand
          schon im Protokoll vom 11.09. vormittags); die zusätzliche Spalte
          „Score" hätte ihn nur vergrössert.

          ⚠️⚠️ `relative` (12.09.2026, gemessen): `min-w-0` allein reichte NICHT -
          die Seite blieb bei 320 px 632 px breit. Der Täter stand in keiner
          Täterliste, weil er 1 px schmal ist: das `sr-only` „Noch keine
          Tippchallenge" in der letzten Spalte. `sr-only` ist `position:
          absolute`, und ein absolutes Element wird von `overflow-auto` nur
          geklippt, wenn sein Bezugsblock INNERHALB des Kastens liegt. Zellen
          und Kasten waren `static`, der Bezugsblock also die ganze Seite - die
          vier `sr-only`-Texte der Tabelle ragten an ihr vorbei. Mit `relative`
          ist der Kasten selbst der Bezugsblock. Gegenprobe per DOM: ohne 632 px,
          mit 394 px (der Rest war der Zeitraum-Kopf, siehe `ZeitraumKopf.tsx`).
          Die klebenden Zellen stört das nicht: `sticky` richtet sich nach dem
          rollenden Vorfahren, nicht nach dem Bezugsblock.

          ★ T1 (19.09.2026): der Rahmen des Entwurfs („tabellen-rahmen") -
          Haarlinie und runde Ecken. Er macht zugleich sichtbar, WO seitlich
          geschoben wird. Die runden Ecken schneiden die klebende Kopfzeile
          mit ab (`overflow-auto` klippt an der Rundung).
        */}
        <div data-rundgang="tabelle" className="relative min-w-0 max-h-[calc(70vh/var(--statistik-schrift,1))] overflow-auto rounded-xl border border-hairline bg-surface-raised">
          {/*
            ⚠️⚠️ `border-separate` IST PFLICHT, nicht Geschmack.
            Tailwind setzt Tabellen von sich aus auf `border-collapse: collapse`
            - und damit ist `position: sticky` an einer Tabellenzelle in Chrome
            und Safari WIRKUNGSLOS (nur Firefox hält sich daran). Die klebende
            Namensspalte wäre also genau in den beiden Browsern tot gewesen, in
            denen die Schulen arbeiten, und kein Test hätte es gemerkt: jsdom
            rechnet kein Layout, die Klasse steht ja da.

            ⚠️ Folge davon: Die Trennlinien hängen an den ZELLEN, nicht an der
            Zeile. Mit `border-separate` zeichnet kein Browser einen Rahmen an
            einem <tr>.
          */}
          <table
            /*
              ★ T1 (19.09.2026): Ziffern gleich breit (`tabular-nums`), damit
              die Zahlen einer Spalte ruhig untereinander stehen (die Schrift
              der Zeilen setzt `PupilRow`).
            */
            className="w-full border-separate border-spacing-0 text-sm tabular-nums"
            /*
              ★ 18.09.2026 (Bauplan E1): Die Überschrift über der Tabelle
              nennt seither nur noch die Klasse, nicht mehr den Zeitraum (der
              steht jetzt am gedrückten Schalter). Damit eine Sprachausgabe
              beim Auffinden dieser Tabelle trotzdem BEIDES hört - welche
              Klasse UND welcher Zeitraum -, beschreiben die beiden
              unsichtbaren Sätze aus `ZeitraumKopf` sie zusätzlich zum
              `<caption>` unten (`titelId` = Klasse, `${titelId}-periode` =
              Zeitraum).
            */
            aria-describedby="mk-tf-zeitraum mk-tf-zeitraum-periode"
          >
            <caption className="sr-only">{t.listenTitel}</caption>
            {/*
              ════════════════════════════════════════════════════════════════
              ★★★ DIE SPALTENGRUPPEN - ohne sie ist `scope="colgroup"` ein
              Zeiger ins Leere (Prüfer 11.09.2026)
              ════════════════════════════════════════════════════════════════
              Die Gruppen-Überschrift „Üben" trägt `scope="colgroup"`. Der
              Zuordnungs-Algorithmus des HTML-Standards sagt dazu: Eine solche
              Überschrift gilt „für alle Zellen DERSELBEN SPALTENGRUPPE" - und
              eine Spaltengruppe entsteht ausschliesslich durch ein
              `<colgroup>`. Ohne diese vier Zeilen gibt es in der Tabelle GAR
              KEINE Spaltengruppe; die Überschrift gälte dann für nichts, und
              ob eine Sprachausgabe „Üben" vor „Score" ansagt, hinge allein an
              der Hausregel des jeweiligen Programms.

              ⚠️ Die Spannweiten müssen zu den `colSpan` der Gruppenzeile
              unten passen - auch die Wochenziel-Spalte, die es nur manchmal
              gibt. Wer dort eine Spalte ergänzt, ergänzt sie hier mit.

              ⚠️ Kein `style`, keine Breite: `<colgroup>` ohne Angaben ändert
              an der Darstellung nichts (im Browser gemessen, 11.09.2026 -
              Spaltenbreiten und Zeilenhöhen unverändert).
            */}
            <colgroup span={2} />
            <colgroup span={zeigeWochenziel ? 6 : 5} />
            <colgroup span={3} />
            <colgroup span={1} />
            <colgroup span={1} />
            <thead>
              {/*
                ════════════════════════════════════════════════════════════
                ★★★ T1 (19.09.2026): EINE SICHTBARE KOPFZEILE
                ════════════════════════════════════════════════════════════
                Johannes zum Entwurf „Meine Klassen": *„die Tabelle in deinem
                Entwurfsvorschlag ist viel schlanker und schöner wie die
                jetzige? … aber nach Spalten muss ich trotzdem sortieren
                können"* - und: *„natürlich auch fixierte
                Zeilenüberschriften (1. Spalte) und Spaltenüberschriften
                (erste Zeile)"*.

                Die GRUPPENZEILE („Üben"/„Prüfung", B2 11.09.2026) bleibt im
                Baum, aber nur für die Sprachausgabe: Ihre Zellen stehen
                `sr-only`, die Zeile ist 0 px hoch und klebt nicht. Sie ist
                es, die über den `<colgroup>`-Zeilen oben „Üben" vor „Score"
                ansagen lässt; sichtbar trennt je eine feine Linie
                (`GRUPPEN_TRENNER`).

                ⚠️ JEDE Spalte bekommt weiter eine Gruppenzelle - eine
                Kopfzeile mit Lücken ist für eine Sprachausgabe eine Tabelle
                mit fehlenden Zellen. Die Spannweiten passen zu den
                `<colgroup>` oben.

                Die sichtbare Kopfzeile klebt bei `top-0`. Stapelordnung wie
                seit B12 an den ZELLEN (siehe `KOPF_ZELLE`): Kopf z-30, die
                beiden Ecken z-35, Zeilen z-10/z-20, Seiten-Kopfzeile z-40.
                ★ Alle Spalten mittig (Johannes 10.09.2026).
              */}
              <tr className="text-center">
                <th scope="colgroup" colSpan={2} className={GRUPPE_UNSICHTBAR}>
                  <span className="sr-only">{t.gruppePerson}</span>
                </th>
                <th
                  scope="colgroup"
                  colSpan={zeigeWochenziel ? 6 : 5}
                  className={GRUPPE_UNSICHTBAR}
                >
                  <span className="sr-only">{t.gruppeStand}</span>
                </th>
                <Spaltenkopf
                  scope="colgroup"
                  colSpan={3}
                  className={GRUPPE_UNSICHTBAR}
                  hilfe={spaltenTexte.uebenGruppe}
                  nurSprachausgabe
                >
                  {t.gruppeUeben}
                </Spaltenkopf>
                <Spaltenkopf
                  scope="colgroup"
                  colSpan={1}
                  ausrichtung="rechts"
                  className={GRUPPE_UNSICHTBAR}
                  hilfe={spaltenTexte.pruefungGruppe}
                  nurSprachausgabe
                >
                  {t.gruppePruefung}
                </Spaltenkopf>
                <Spaltenkopf
                  scope="colgroup"
                  colSpan={1}
                  ausrichtung="rechts"
                  className={GRUPPE_UNSICHTBAR}
                  nurSprachausgabe
                >
                  {t.gruppeKlassenmatch}
                </Spaltenkopf>
              </tr>
              {/*
                ★ Sortieren (Johannes 01.09.2026) bleibt: jeder Kopf mit
                Schlüssel ist ein Schalter, `aria-sort` am sortierenden `th`,
                ▲/▼ nur an dieser einen Spalte. `schlank`: keine gepunktete
                Unterlinie mehr - der Hinweis öffnet sich beim Zeigen UND beim
                Tastaturfokus auf dem Schalter (`Spaltenkopf.tsx`).
              */}
              <tr className="text-center">
                {/* Die Knopfspalte trägt keinen sichtbaren Kopf - der Knopf
                    sagt selbst, was er tut. Für die Sprachausgabe muss sie
                    trotzdem einen Namen haben, sonst ist es eine namenlose
                    Spalte. */}
                <th scope="col" className={KLEBT_KNOPF_KOPF}>
                  <span className="sr-only">{t.einstellungen}</span>
                </th>
                <Spaltenkopf
                  scope="col"
                  className={KLEBT_NAME_KOPF}
                  sortSchluessel="name"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={spaltenTexte.name}
                  schlank
                >
                  {t.kopfName}
                </Spaltenkopf>
                <Spaltenkopf
                  className={KOPF_ZELLE}
                  sortSchluessel="stufe"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={spaltenTexte.leistungsstufe}
                  schlank
                >
                  {t.kopfStufe}
                </Spaltenkopf>
                <Spaltenkopf
                  className={KOPF_ZELLE}
                  sortSchluessel="tasten"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={spaltenTexte.tasten}
                  schlank
                >
                  {t.kopfTasten}
                </Spaltenkopf>
                <Spaltenkopf
                  className={KOPF_ZELLE}
                  sortSchluessel="naechste"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={spaltenTexte.naechste}
                  schlank
                >
                  {t.kopfNaechste}
                </Spaltenkopf>
                <Spaltenkopf
                  className={KOPF_ZELLE}
                  sortSchluessel="uebezeit"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={spaltenTexte.uebezeit}
                  schlank
                >
                  {t.kopfUebezeit}
                </Spaltenkopf>
                {zeigeWochenziel && (
                  <Spaltenkopf
                    className={KOPF_ZELLE}
                    sortSchluessel="wochenziel"
                    sortierung={sortierung}
                    onSortieren={sortiereNach}
                    hilfe={wochenzielHilfe(zeitraum, sprache)}
                    schlank
                  >
                    {zeitraum.art === "woche" ? t.kopfWochenziel : t.kopfWochenziele}
                  </Spaltenkopf>
                )}
                {/* ★ Gezielt üben (13.11.2026): die letzte Spalte der Gruppe „Stand und Übezeit" (neben „Nächste Tasten") - sortierbar. */}
                <Spaltenkopf
                  className={KOPF_ZELLE}
                  sortSchluessel="gezielt"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={gezieltT.kopfHilfe}
                  schlank
                >
                  {gezieltT.kopf}
                </Spaltenkopf>
                <Spaltenkopf
                  className={`${KOPF_ZELLE} ${GRUPPEN_TRENNER}`}
                  sortSchluessel="treffer"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={spaltenHilfe(
                    "treffer",
                    zeitraum.art === "schuljahr" || zeitraum.art === "gesamt",
                    sprache,
                  )}
                  schlank
                >
                  {t.kopfTreffer}
                </Spaltenkopf>
                <Spaltenkopf
                  className={KOPF_ZELLE}
                  ausrichtung="rechts"
                  sortSchluessel="tempo"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={spaltenHilfe(
                    "tempo",
                    zeitraum.art === "schuljahr" || zeitraum.art === "gesamt",
                    sprache,
                  )}
                  schlank
                >
                  {t.kopfTempo}
                </Spaltenkopf>
                {/*
                  ★★★ B2 (Johannes 11.09.2026): *„Übungsscore und Prüfungsscore
                  jeweils eine Spalte, Prüfungsscore ganz rechts."* Die Spalte
                  „Score" ist der ÜBUNGS-Score des gewählten Zeitraums - aus
                  Treffsicherheit und Tempo daneben gerechnet, mit derselben
                  Formel wie die Tippchallenge.
                */}
                <Spaltenkopf
                  className={KOPF_ZELLE}
                  ausrichtung="rechts"
                  sortSchluessel="score"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={spaltenHilfe(
                    "score",
                    zeitraum.art === "schuljahr" || zeitraum.art === "gesamt",
                    sprache,
                  )}
                  schlank
                >
                  {t.kopfScore}
                </Spaltenkopf>
                {/* ★ Johannes 10.09.2026: „es braucht eine neue spalte …
                    »Tippchallenge« 3 / 82". Rechts am Rand (seit 21.09.2026 vor
                    „Klassenmatch"), darum dockt der Hinweis rechts an; die
                    feine Linie davor trennt die Gruppe „Prüfung" ab. */}
                <Spaltenkopf
                  className={`${KOPF_ZELLE} ${GRUPPEN_TRENNER}`}
                  ausrichtung="rechts"
                  sortSchluessel="challenge"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={hinweiseChallenge(sprache).spalte}
                  schlank
                >
                  {t.tippchallenge}
                </Spaltenkopf>
                {/* ★ 21.09.2026 (Johannes: „Die Klassenmatch gehören als Zahl
                    auch in die Statistik"): wie viele Klassenmatches bis zum
                    Ende gespielt wurden - nicht, wer gewonnen hat. Die letzte
                    Spalte, darum dockt der Hinweis rechts an; die feine Linie
                    davor trennt die Gruppe ab. */}
                <Spaltenkopf
                  className={`${KOPF_ZELLE} ${GRUPPEN_TRENNER}`}
                  ausrichtung="rechts"
                  sortSchluessel="klassenmatch"
                  sortierung={sortierung}
                  onSortieren={sortiereNach}
                  hilfe={t.klassenmatchSpalteHilfe(
                    fmtTagMonatJahr(MATCH_VERLAUF_SEIT_MS, sprache),
                  )}
                  schlank
                >
                  {t.kopfKlassenmatch}
                </Spaltenkopf>
              </tr>
            </thead>
            {/*
              ★ T1: Linien und Abstände der Zellen mit `>` (nur die Zellen
              DIESER Tabelle) - die kleinen Tabellen in der aufgeklappten
              Zeile bringen ihre eigenen mit und bekamen vorher über `_` die
              hiesigen noch dazu. Die letzte Zeile ohne Linie: dort schliesst
              der Rahmen. Die Linien tragen im Windows-Kontrastmodus, wo der
              Zebra-Grund verschwindet (Rahmen färbt `forced-colors` in der
              Systemfarbe, er löscht sie nicht).
            */}
            <tbody className="text-center text-ink [&>tr>td]:border-b [&>tr>td]:border-hairline/60 [&>tr>td]:px-3 [&>tr>td]:py-1.5 [&>tr>th]:border-b [&>tr>th]:border-hairline/60 [&>tr>th]:px-3 [&>tr>th]:py-1.5 [&>tr:last-child>td]:border-b-0 [&>tr:last-child>th]:border-b-0">
              {sortierteDatas.map((d, i) => (
                <PupilRow
                  key={d.pupil.id}
                  data={d}
                  index={i}
                  spalten={spaltenzahl}
                  zeigeWochenziel={zeigeWochenziel}
                  h={einstellHandler}
                  klasse={klasseStand ?? null}
                  markiert={markiert.has(d.pupil.id)}
                  onMarkieren={markierenUm}
                  onSetWochenziel={onSetWochenziel}
                  onResetOverdue={onResetOverdue}
                  onSetExcusedWeeks={onSetExcusedWeeks}
                  bezug={bezug}
                  onBezug={setBezug}
                  startwoche={klassenStart}
                  zeitraum={zeitraum}
                  vergleich={vergleichsStats.get(d.pupil.id) ?? null}
                  vergleichsZeilen={vergleichsZeilen.get(d.pupil.id) ?? 0}
                  vergleichsName={vergleichsBenennung}
                  proben={proben[d.pupil.id] ?? KEINE_PROBEN}
                  matchAnzahl={
                    matchAnzahl === null ? null : (matchAnzahl[d.pupil.id] ?? KEIN_MATCH_ANZAHL)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
