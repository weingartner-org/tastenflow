/**
 * Abzeichen-Regal des Tipptrainers — sitzt GANZ OBEN in der Statistik (Wunsch
 * Johannes 2026-07-07): verdiente Abzeichen als richtige MEDAILLEN in einer
 * Vitrinen-Reihe ([[BadgeMedal]], Wunsch 08.07.), dazu die zwei am ehesten
 * erreichbaren „nächsten Ziele" (TypingClub-Muster: immer ein klares
 * nächstes Ziel — auch per Screenreader ansagbar). Eine aufklappbare Liste
 * zeigt ALLE Abzeichen-Familien; noch nicht verdiente Medaillen hängen
 * entsättigt da, Geheim-Abzeichen bis zum Verdienen nur als graue „?"-Medaille
 * (Khan-Academy-Prinzip).
 *
 * Jede Medaille lässt sich BETÄTIGEN (Wunsch 10.07.) und öffnet die Groß-Ansicht
 * mit Effekt ([[BadgeZoomDialog]] — SVG bleibt in jeder Größe gestochen
 * scharf).
 *
 * Wird in der geteilten Statistik (PupilStatsPanel) gezeigt — Kind und
 * Lehrkraft sehen dieselben Abzeichen ([[feedback_data_transparency]]).
 *
 * ★ Seit 28.08.2026 ist dieses Regal auch das FOKUS-ZIEL beim Öffnen von
 * „Meine Statistik" (Johannes 22.08.2026 abends, `FOKUSZIELE-TASTENFLOW.md`
 * §0.5: „die Abzeichen sind extrem wichtig für die Kinder"). Das Regal holt
 * sich den Fokus nicht von selbst - es löst eine ANFORDERUNG ein, die der
 * Öffner gestellt hat (`src/lib/typing/focusStats.ts`). Nur so trifft der
 * Fokus auch dann, wenn die Statistik ihre Daten erst nachlädt und das Regal
 * im nächsten Takt noch gar nicht existiert.
 */
import { useEffect, useRef, useState } from "react";
import { Tipp } from "@/components/Tipp";
import { Aufklappen } from "@/components/Aufklappen";
import {
  BADGES,
  BadgeDef,
  FIRST_BADGE_FOCUS_EVENT,
  Skin,
  TypingProgress,
  badgeBeschreibung,
  badgeGruppe,
  badgeName,
  clearFirstBadgeFocusRequest,
  earnedBadges,
  fmtTagMonatJahr,
  itPrepTag,
  nextGoalUnit,
  nextGoals,
  takeFirstBadgeFocusRequest,
} from "@/lib/typing";
import { texte, useBedienSprache, zahlGebiet, type BedienSprache } from "@/lib/bedienSprache";
import { BadgeMedal, datumAbzeichenNeun, datumOdznaki, datumOdznaku, datumRozet, medaillenBeschreibung } from "./BadgeMedal";
import { BadgeZoomDialog, BadgeZoomState } from "./BadgeZoomDialog";
// ★ E1 (24.09.2026): der Lernweg des Kindes steht in seinem Fortschritt.
import { lernwegVon, type Lernweg } from "@/lib/typing/lernweg";
// ★ O-CS (03.10.2026): „z" oder „ze" vor einer Zahl („3 ze 116").
import { zZe } from "@/lib/bedienSprache/predlozkyCs";
import { istGeruestSprache } from "@/lib/typing/sprachRegister";

function fmtBadgeDate(ts: number, sprache: BedienSprache = "de"): string {
  // ★ O-CS (03.10.2026): „21. září 2026".
  // ★ O2-COMP (30.10.2026): die neun Sprachen ausgeschrieben nach ihrem Gebiet.
  if (istGeruestSprache(sprache)) return datumAbzeichenNeun(ts, sprache);
  if (sprache === "cs") return datumOdznaku(ts);
  // ★ O-TR (02.10.2026): "21 Eylül 2026".
  if (sprache === "tr") return datumRozet(ts);
  // ★ O-PL (02.10.2026): „5 września 2026".
  if (sprache === "pl") return datumOdznaki(ts);
  // ★ O-IT (02.10.2026): „5 set 2026" über dieselbe Stelle (`datum.ts`).
  if (sprache === "it") return fmtTagMonatJahr(ts, "it");
  // ★ EN3: englisch „5 Sept 2026" (Glossar §1.2) - `fmtTagMonatJahr` kennt beide.
  if (sprache === "en") return fmtTagMonatJahr(ts, "en");
  // ★ E11a-5: französisch über dieselbe Stelle (`datum.ts` führt das Format
  // „5 sept. 2026") - nie still die deutsche Schreibweise „05.09.2026".
  if (sprache === "fr") return fmtTagMonatJahr(ts, "fr");
  // ★ ES-O: spanisch über dieselbe Stelle (`datum.ts`).
  if (sprache === "es") return fmtTagMonatJahr(ts, "es");
  return new Date(ts).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const FMT_GEBIET: Record<BedienSprache, string> = {
  de: "de-DE",
  en: "en-GB",
  fr: "fr-FR",
  es: "es-ES", // es: der Sprachcode ist schon final (SPRACH_TAG, vorlesen.ts)
  // G2a (02.10.2026): echte Gebiete, kein Rückfall.
  it: "it-IT",
  pl: "pl-PL",
  tr: "tr-TR",
  cs: "cs-CZ",
  // ★ G2-NEUN (25.10.2026): echte Gebiete, kein Rückfall.
  bg: "bg-BG",
  el: "el-GR",
  hu: "hu-HU",
  nl: "nl-NL",
  pt: "pt-PT",
  br: "pt-BR",
  ro: "ro-RO",
  sv: "sv-SE",
  uk: "uk-UA",
};
function fmtCount(n: number, sprache: BedienSprache = "de"): string {
  // ★ D1 (28.09.2026, Nr. 15): Spanisch nach dem Land der Browsersprache
  // (`zahlGebiet`) - wie `zahl(n, "es")` und die Übungszeilen.
  return n.toLocaleString(sprache === "es" ? zahlGebiet("es") : FMT_GEBIET[sprache]);
}

/**
 * ★ Das Abzeichen-Regal in beiden Bedienungssprachen (EN3, 19.09.2026).
 * Deutsch wortgleich wie vorher (Teil-Listen, wo JSX mehrere Textknoten hatte).
 * Die Namen, Bedingungen und Familien der Abzeichen kommen aus `badgesEn.ts`
 * (`badgeName`/`badgeBeschreibung`/`badgeGruppe` mit der Sprache).
 * Glossar §3.6: *badge* ★, *badge shelf*, *earned on*; „Groß anzeigen" ⇒ *large
 * view*. Ohne Maus-Wörter (§1.3): *opens*, nie *click*.
 */
const REGAL_TEXTE = texte({
  de: {
    verdientTitel: (beschreibung: string, datum: string) =>
      `${beschreibung} (verdient am ${datum}), öffnet die große Ansicht`,
    verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
      name,
      ": ",
      beschreibung,
      " ",
      medaille,
      " Verdient am",
      " ",
      datum,
      ". Groß anzeigen.",
    ],
    titel: (selbst: boolean) => (selbst ? "Meine Abzeichen" : "Abzeichen"),
    zaehler: (n: number, gesamt: number) => ["(", n, " von ", gesamt, ")"],
    verdienteListe: (selbst: boolean) => (selbst ? "Deine verdienten Abzeichen" : "Verdiente Abzeichen"),
    keine: (selbst: boolean) =>
      selbst
        ? "Noch keine Abzeichen - schon die erste Runde bringt dir eines!"
        : "Noch keine Abzeichen - die erste Übungsrunde bringt das erste.",
    zieleListe: "Nächste Ziele",
    zielTitel: (name: string) => `${name}, öffnet die große Ansicht`,
    zielName: (name: string) => `Medaille ${name} groß anzeigen`,
    naechstesZiel: "Nächstes Ziel:",
    zielStand: (einheit: string, hat: string, braucht: string) => [
      " - ",
      einheit,
      ":",
      " ",
      hat,
      " von ",
      braucht,
    ],
    alleTitel: "Alle Abzeichen-Familien mit Bedingungen ein-/ausblenden",
    alle: "Alle Abzeichen anzeigen",
    familie: (n: number, gesamt: number) => ["(", n, " von", " ", gesamt, ")"],
    grossTitel: "Öffnet die große Ansicht",
    geheim: "Ein Geheim-Abzeichen. Finde selbst heraus, wie es zu holen ist!",
    zustand: (verdient: boolean) => (verdient ? " (verdient)" : " (noch nicht verdient)"),
    grossAnzeigen: " Groß anzeigen.",
  },
  en: {
    verdientTitel: (beschreibung: string, datum: string) =>
      `${beschreibung} (earned on ${datum}), opens the large view`,
    verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
      name,
      ": ",
      beschreibung,
      " ",
      medaille,
      " Earned on ",
      datum,
      ". Opens the large view.",
    ],
    titel: (selbst: boolean) => (selbst ? "My badges" : "Badges"),
    zaehler: (n: number, gesamt: number) => ["(", n, " of ", gesamt, ")"],
    verdienteListe: (selbst: boolean) => (selbst ? "Badges you have earned" : "Badges earned"),
    keine: (selbst: boolean) =>
      selbst
        ? "No badges yet - your very first round will earn you one!"
        : "No badges yet - the first practice round earns the first one.",
    zieleListe: "Next goals",
    zielTitel: (name: string) => `${name}, opens the large view`,
    zielName: (name: string) => `Show the ${name} medal in the large view`,
    naechstesZiel: "Next goal:",
    zielStand: (einheit: string, hat: string, braucht: string) => [
      " - ",
      einheit,
      ": ",
      hat,
      " of ",
      braucht,
    ],
    alleTitel: "Show or hide all badge families and what earns each badge",
    alle: "Show all badges",
    familie: (n: number, gesamt: number) => ["(", n, " of ", gesamt, ")"],
    grossTitel: "Opens the large view",
    geheim: "A secret badge. Find out for yourself how to earn it!",
    zustand: (verdient: boolean) => (verdient ? " (earned)" : " (not earned yet)"),
    grossAnzeigen: " Opens the large view.",
  },
  fr: {
    verdientTitel: (beschreibung: string, datum: string) =>
      `${beschreibung} (obtenu le ${datum}), ouvre la vue agrandie`,
    verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
      name,
      " : ",
      beschreibung,
      " ",
      medaille,
      " Obtenu le",
      " ",
      datum,
      ". Afficher en grand.",
    ],
    titel: (selbst: boolean) => (selbst ? "Mes badges" : "Badges"),
    zaehler: (n: number, gesamt: number) => ["(", n, " sur ", gesamt, ")"],
    verdienteListe: (selbst: boolean) => (selbst ? "Tes badges obtenus" : "Badges obtenus"),
    keine: (selbst: boolean) =>
      selbst
        ? "Pas encore de badge - ta toute première série t'en rapportera un !"
        : "Pas encore de badge - la première série d'exercice rapporte le premier.",
    zieleListe: "Prochains objectifs",
    zielTitel: (name: string) => `${name}, ouvre la vue agrandie`,
    zielName: (name: string) => `Afficher la médaille ${name} en grand`,
    naechstesZiel: "Prochain objectif :",
    zielStand: (einheit: string, hat: string, braucht: string) => [
      " - ",
      einheit,
      " :",
      " ",
      hat,
      " sur ",
      braucht,
    ],
    alleTitel: "Afficher ou masquer toutes les familles de badges et comment les obtenir",
    alle: "Afficher tous les badges",
    familie: (n: number, gesamt: number) => ["(", n, " sur", " ", gesamt, ")"],
    grossTitel: "Ouvre la vue agrandie",
    geheim: "Un badge secret. Trouve toi-même comment l'obtenir !",
    zustand: (verdient: boolean) => (verdient ? " (obtenu)" : " (pas encore obtenu)"),
    grossAnzeigen: " Afficher en grand.",
  },
  // ★ ES-O (27.09.2026): tú (das Regal gehört der lernenden Person).
  es: {
    verdientTitel: (beschreibung: string, datum: string) =>
      `${beschreibung} (conseguida el ${datum}), abre la vista grande`,
    verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
      name,
      ": ",
      beschreibung,
      " ",
      medaille,
      " Conseguida el",
      " ",
      datum,
      ". Ver en grande.",
    ],
    titel: (selbst: boolean) => (selbst ? "Mis insignias" : "Insignias"),
    zaehler: (n: number, gesamt: number) => ["(", n, " de ", gesamt, ")"],
    verdienteListe: (selbst: boolean) => (selbst ? "Tus insignias conseguidas" : "Insignias conseguidas"),
    keine: (selbst: boolean) =>
      selbst
        ? "Todavía no hay ninguna insignia - ¡tu primerísima serie te dará una!"
        : "Todavía no hay ninguna insignia - la primera serie de práctica da la primera.",
    zieleListe: "Próximas metas",
    zielTitel: (name: string) => `${name}, abre la vista grande`,
    zielName: (name: string) => `Ver en grande la medalla ${name}`,
    naechstesZiel: "Próxima meta:",
    zielStand: (einheit: string, hat: string, braucht: string) => [
      " - ",
      einheit,
      ":",
      " ",
      hat,
      " de ",
      braucht,
    ],
    alleTitel: "Mostrar u ocultar todas las familias de insignias y cómo conseguirlas",
    alle: "Mostrar todas las insignias",
    familie: (n: number, gesamt: number) => ["(", n, " de", " ", gesamt, ")"],
    grossTitel: "Abre la vista grande",
    geheim: "Una insignia secreta. ¡Descubre tú cómo conseguirla!",
    zustand: (verdient: boolean) => (verdient ? " (conseguida)" : " (todavía no conseguida)"),
    grossAnzeigen: " Ver en grande.",
  },
  // ★ O-IT (02.10.2026): „medaglia" für Abzeichen und Medaille, „ottenuta"
  // (Glossar §2.4); „il 5 set" / „l'8 set" über `itPrepTag`.
  it: {
    verdientTitel: (beschreibung: string, datum: string) =>
      `${beschreibung} (ottenuta ${itPrepTag("il", parseInt(datum, 10))}${datum}), apre la vista grande`,
    verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
      name,
      ": ",
      beschreibung,
      " ",
      medaille,
      " Ottenuta",
      " ",
      `${itPrepTag("il", parseInt(datum, 10))}${datum}`,
      ". Vedi in grande.",
    ],
    titel: (selbst: boolean) => (selbst ? "Le mie medaglie" : "Medaglie"),
    zaehler: (n: number, gesamt: number) => ["(", n, " di ", gesamt, ")"],
    verdienteListe: (selbst: boolean) => (selbst ? "Le medaglie che hai ottenuto" : "Medaglie ottenute"),
    keine: (selbst: boolean) =>
      selbst
        ? "Ancora nessuna medaglia - il tuo primissimo giro te ne darà una!"
        : "Ancora nessuna medaglia - il primo giro di esercizio dà la prima.",
    zieleListe: "Prossimi obiettivi",
    zielTitel: (name: string) => `${name}, apre la vista grande`,
    zielName: (name: string) => `Vedi in grande la medaglia ${name}`,
    naechstesZiel: "Prossimo obiettivo:",
    zielStand: (einheit: string, hat: string, braucht: string) => [
      " - ",
      einheit,
      ":",
      " ",
      hat,
      " di ",
      braucht,
    ],
    alleTitel: "Mostra o nasconde tutte le famiglie di medaglie e come ottenerle",
    alle: "Mostra tutte le medaglie",
    familie: (n: number, gesamt: number) => ["(", n, " di", " ", gesamt, ")"],
    grossTitel: "Apre la vista grande",
    geheim: "Una medaglia segreta. Scopri tu come ottenerla!",
    zustand: (verdient: boolean) => (verdient ? " (ottenuta)" : " (non ancora ottenuta)"),
    grossAnzeigen: " Vedi in grande.",
  },
  // ★ O-PL (02.10.2026): „odznaka", zdobyta / jeszcze niezdobyta (Partizip an
  // „odznaka", nie am Kind - Glossar §2.4); „Następny krok", weil „cel" das
  // Wochenziel ist. Datum nach Doppelpunkt nicht nötig: „Zdobyta 5 września 2026".
  pl: {
    verdientTitel: (beschreibung: string, datum: string) =>
      `${beschreibung} (zdobyta ${datum}), otwiera powiększenie`,
    verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
      name,
      ": ",
      beschreibung,
      " ",
      medaille,
      " Zdobyta",
      " ",
      datum,
      ". Pokaż w powiększeniu.",
    ],
    titel: (selbst: boolean) => (selbst ? "Moje odznaki" : "Odznaki"),
    zaehler: (n: number, gesamt: number) => ["(", n, " z ", gesamt, ")"],
    verdienteListe: (selbst: boolean) => (selbst ? "Twoje zdobyte odznaki" : "Zdobyte odznaki"),
    keine: (selbst: boolean) =>
      selbst
        ? "Nie ma jeszcze odznak - już pierwsza runda przyniesie ci jedną!"
        : "Nie ma jeszcze odznak - pierwsza runda ćwiczeń przynosi pierwszą.",
    zieleListe: "Następne kroki",
    zielTitel: (name: string) => `${name}, otwiera powiększenie`,
    zielName: (name: string) => `Pokaż w powiększeniu odznakę: ${name}`,
    naechstesZiel: "Następny krok:",
    zielStand: (einheit: string, hat: string, braucht: string) => [
      " - ",
      einheit,
      ":",
      " ",
      hat,
      " z ",
      braucht,
    ],
    alleTitel: "Pokaż lub ukryj wszystkie rodziny odznak i warunki ich zdobycia",
    alle: "Pokaż wszystkie odznaki",
    familie: (n: number, gesamt: number) => ["(", n, " z", " ", gesamt, ")"],
    grossTitel: "Otwiera powiększenie",
    geheim: "Tajna odznaka. Odkryj, jak ją zdobyć!",
    zustand: (verdient: boolean) => (verdient ? " (zdobyta)" : " (jeszcze niezdobyta)"),
    grossAnzeigen: " Pokaż w powiększeniu.",
  },
  // ★ O-TR (02.10.2026): "rozet", "Rozetlerim", kazanıldı / henüz kazanılmadı,
  // "Sıradaki hedef" (Glossar §2.4). Kind sen; Datum und Zahlen nach Doppelpunkt
  // oder vor einem festen Wort, nie mit Endung (Regel 6): "Kazanıldığı tarih:
  // 21 Eylül 2026", "(3 rozet, toplam 116)", "3 (gereken: 5)".
  tr: {
    verdientTitel: (beschreibung: string, datum: string) =>
      `${beschreibung} (kazanıldığı tarih: ${datum}) - büyük görünümü açar`,
    verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
      name,
      ": ",
      beschreibung,
      " ",
      medaille,
      " Kazanıldığı tarih:",
      " ",
      datum,
      ". Büyük göster.",
    ],
    titel: (selbst: boolean) => (selbst ? "Rozetlerim" : "Rozetler"),
    zaehler: (n: number, gesamt: number) => ["(", n, " rozet, toplam ", gesamt, ")"],
    verdienteListe: (selbst: boolean) => (selbst ? "Kazandığın rozetler" : "Kazanılan rozetler"),
    keine: (selbst: boolean) =>
      selbst
        ? "Henüz rozet yok - ilk turda hemen bir tane kazanacaksın!"
        : "Henüz rozet yok - ilk alıştırma turu ilk rozeti getirir.",
    zieleListe: "Sıradaki hedefler",
    zielTitel: (name: string) => `${name} - büyük görünümü açar`,
    zielName: (name: string) => `Rozeti büyük göster: ${name}`,
    naechstesZiel: "Sıradaki hedef:",
    zielStand: (einheit: string, hat: string, braucht: string) => [
      " - ",
      einheit,
      ":",
      " ",
      hat,
      " (gereken: ",
      braucht,
      ")",
    ],
    alleTitel: "Bütün rozet ailelerini ve kazanma koşullarını göster ya da gizle",
    alle: "Bütün rozetleri göster",
    familie: (n: number, gesamt: number) => ["(", n, ",", " toplam ", gesamt, ")"],
    grossTitel: "Büyük görünümü açar",
    geheim: "Gizli rozet. Nasıl kazanılacağını kendin bul!",
    zustand: (verdient: boolean) => (verdient ? " (kazanıldı)" : " (henüz kazanılmadı)"),
    grossAnzeigen: " Büyük göster.",
  },
  // ★ O-CS (03.10.2026): „odznak", získaný / zatím nezískaný (am odznak, nie
  // am Kind - Glossar §2.4), „Další meta", weil „cíl" das Wochenziel ist. Kind
  // ty. Das Datum steht nie am Satzende (Falle 4: „2026." wäre eine
  // Ordnungszahl); „z/ze" vor der Zahl über `zZe` (Falle 5).
  cs: {
    verdientTitel: (beschreibung: string, datum: string) =>
      `${beschreibung} (získáno ${datum}) - otevře velké zobrazení`,
    verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
      name,
      ": ",
      beschreibung,
      " ",
      medaille,
      " Získáno",
      " ",
      datum,
      " - zobrazit ve velkém.",
    ],
    titel: (selbst: boolean) => (selbst ? "Moje odznaky" : "Odznaky"),
    zaehler: (n: number, gesamt: number) => ["(", n, ` ${zZe(gesamt)} `, gesamt, ")"],
    verdienteListe: (selbst: boolean) => (selbst ? "Tvoje získané odznaky" : "Získané odznaky"),
    keine: (selbst: boolean) =>
      selbst
        ? "Zatím žádné odznaky - hned první kolo ti jeden přinese!"
        : "Zatím žádné odznaky - první kolo cvičení přinese první odznak.",
    zieleListe: "Další mety",
    zielTitel: (name: string) => `${name} - otevře velké zobrazení`,
    zielName: (name: string) => `Zobrazit odznak ve velkém: ${name}`,
    naechstesZiel: "Další meta:",
    zielStand: (einheit: string, hat: string, braucht: string) => [
      " - ",
      einheit,
      ":",
      " ",
      hat,
      "/",
      braucht,
    ],
    alleTitel: "Zobrazit nebo skrýt všechny skupiny odznaků a podmínky jejich získání",
    alle: "Zobrazit všechny odznaky",
    familie: (n: number, gesamt: number) => ["(", n, ` ${zZe(gesamt)}`, " ", gesamt, ")"],
    grossTitel: "Otevře velké zobrazení",
    geheim: "Tajný odznak. Jak ho získat? To zjistíš!",
    zustand: (verdient: boolean) => (verdient ? " (získaný)" : " (zatím nezískaný)"),
    grossAnzeigen: " Zobrazit ve velkém.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      verdientTitel: (beschreibung: string, datum: string) =>
        `${beschreibung} (спечелена на ${datum}), отваря големия изглед`,
      verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
        name,
        ": ",
        beschreibung,
        " ",
        medaille,
        " Спечелена на ",
        datum,
        ". Отваря големия изглед.",
      ],
      titel: (selbst: boolean) => (selbst ? "Моите значки" : "Значки"),
      zaehler: (n: number, gesamt: number) => ["(", n, "/", gesamt, ")"],
      verdienteListe: (selbst: boolean) => (selbst ? "Твоите спечелени значки" : "Спечелени значки"),
      keine: (selbst: boolean) =>
        selbst
          ? "Още няма значки - още първият кръг ще ти донесе една!"
          : "Още няма значки - първият кръг с упражнения носи първата.",
      zieleListe: "Следващи награди",
      zielTitel: (name: string) => `${name}, отваря големия изглед`,
      zielName: (name: string) => `Покажи значката ${name} в голям изглед`,
      naechstesZiel: "Следваща награда:",
      zielStand: (einheit: string, hat: string, braucht: string) => [
        " - ",
        einheit,
        ": ",
        hat,
        "/",
        braucht,
      ],
      alleTitel: "Покажи или скрий всички семейства значки и какво носи всяка значка",
      alle: "Покажи всички значки",
      familie: (n: number, gesamt: number) => ["(", n, "/", gesamt, ")"],
      grossTitel: "Отваря големия изглед",
      geheim: "Тайна значка. Открий как се печели!",
      zustand: (verdient: boolean) => (verdient ? " (спечелена)" : " (още не е спечелена)"),
      grossAnzeigen: " Отваря големия изглед.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      verdientTitel: (beschreibung: string, datum: string) =>
        `${beschreibung} (κερδήθηκε στις ${datum}), ανοίγει τη μεγάλη προβολή`,
      verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
        name,
        ": ",
        beschreibung,
        " ",
        medaille,
        " Κερδήθηκε στις ",
        datum,
        ". Ανοίγει τη μεγάλη προβολή.",
      ],
      titel: (selbst: boolean) => (selbst ? "Τα μετάλλιά μου" : "Μετάλλια"),
      zaehler: (n: number, gesamt: number) => ["(", n, " από ", gesamt, ")"],
      verdienteListe: (selbst: boolean) => (selbst ? "Τα μετάλλια που κέρδισες" : "Κερδισμένα μετάλλια"),
      keine: (selbst: boolean) =>
        selbst
          ? "Δεν έχεις ακόμα μετάλλια - ήδη ο πρώτος γύρος σού φέρνει ένα!"
          : "Δεν υπάρχουν ακόμα μετάλλια - ο πρώτος γύρος εξάσκησης φέρνει το πρώτο.",
      zieleListe: "Επόμενοι στόχοι",
      zielTitel: (name: string) => `${name}, ανοίγει τη μεγάλη προβολή`,
      zielName: (name: string) => `Μετάλλιο ${name}: μεγάλη προβολή`,
      naechstesZiel: "Επόμενος στόχος:",
      zielStand: (einheit: string, hat: string, braucht: string) => [
        " - ",
        einheit,
        ": ",
        hat,
        " από ",
        braucht,
      ],
      alleTitel: "Εμφάνιση ή απόκρυψη όλων των οικογενειών μεταλλίων και του τι χρειάζεται για το καθένα",
      alle: "Εμφάνιση όλων των μεταλλίων",
      familie: (n: number, gesamt: number) => ["(", n, " από ", gesamt, ")"],
      grossTitel: "Ανοίγει τη μεγάλη προβολή",
      geheim: "Ένα μυστικό μετάλλιο. Ανακάλυψε εσύ πώς κερδίζεται!",
      zustand: (verdient: boolean) => (verdient ? " (κερδισμένο)" : " (δεν κερδήθηκε ακόμα)"),
      grossAnzeigen: " Ανοίγει τη μεγάλη προβολή.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      // Glossar hu §2.4: Abzeichen/Medaille = jelvény; Regel 12: Name/Datum nur nach Doppelpunkt, nie mit Endung.
      verdientTitel: (beschreibung: string, datum: string) =>
        `${beschreibung} (megszerezve: ${datum}), megnyitja a nagy nézetet`,
      verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
        name,
        ": ",
        beschreibung,
        " ",
        medaille,
        " Megszerezve: ",
        datum,
        " - megnyitás nagy nézetben.",
      ],
      titel: (selbst: boolean) => (selbst ? "Jelvényeim" : "Jelvények"),
      zaehler: (n: number, gesamt: number) => ["(", n, "/", gesamt, ")"],
      verdienteListe: (selbst: boolean) => (selbst ? "Megszerzett jelvényeid" : "Megszerzett jelvények"),
      keine: (selbst: boolean) =>
        selbst
          ? "Még nincs jelvényed - már az első kör hoz egyet!"
          : "Még nincs jelvény - az első gyakorlókör hozza az elsőt.",
      zieleListe: "Következő célok",
      zielTitel: (name: string) => `${name}, megnyitja a nagy nézetet`,
      zielName: (name: string) => `Jelvény nagy nézetben: ${name}`,
      naechstesZiel: "Következő cél:",
      zielStand: (einheit: string, hat: string, braucht: string) => [
        " - ",
        einheit,
        ": ",
        hat,
        "/",
        braucht,
      ],
      alleTitel: "Az összes jelvénycsalád és feltételeik megjelenítése vagy elrejtése",
      alle: "Az összes jelvény megjelenítése",
      familie: (n: number, gesamt: number) => ["(", n, "/", gesamt, ")"],
      grossTitel: "Megnyitja a nagy nézetet",
      geheim: "Titkos jelvény. Fedezd fel magad, hogyan szerezheted meg!",
      zustand: (verdient: boolean) => (verdient ? " (megszerezve)" : " (még nincs megszerezve)"),
      grossAnzeigen: " Megnyitás nagy nézetben.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      verdientTitel: (beschreibung: string, datum: string) =>
        `${beschreibung} (behaald op ${datum}), opent de grote weergave`,
      verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
        name,
        ": ",
        beschreibung,
        " ",
        medaille,
        " Behaald op ",
        datum,
        ". Opent de grote weergave.",
      ],
      titel: (selbst: boolean) => (selbst ? "Mijn medailles" : "Medailles"),
      zaehler: (n: number, gesamt: number) => ["(", n, " van ", gesamt, ")"],
      verdienteListe: (selbst: boolean) => (selbst ? "Jouw behaalde medailles" : "Behaalde medailles"),
      keine: (selbst: boolean) =>
        selbst
          ? "Nog geen medailles - je allereerste ronde levert je er al een op!"
          : "Nog geen medailles - de eerste oefenronde levert de eerste op.",
      zieleListe: "Volgende mijlpalen",
      zielTitel: (name: string) => `${name}, opent de grote weergave`,
      zielName: (name: string) => `De medaille ${name} groot weergeven`,
      naechstesZiel: "Volgende mijlpaal:",
      zielStand: (einheit: string, hat: string, braucht: string) => [
        " - ",
        einheit,
        ": ",
        hat,
        " van ",
        braucht,
      ],
      alleTitel: "Alle medaillefamilies tonen of verbergen, met wat je voor elke medaille moet doen",
      alle: "Alle medailles tonen",
      familie: (n: number, gesamt: number) => ["(", n, " van ", gesamt, ")"],
      grossTitel: "Opent de grote weergave",
      geheim: "Een geheime medaille. Ontdek zelf hoe je die haalt!",
      zustand: (verdient: boolean) => (verdient ? " (behaald)" : " (nog niet behaald)"),
      grossAnzeigen: " Opent de grote weergave.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      verdientTitel: (beschreibung: string, datum: string) =>
        `${beschreibung} (conquistada a ${datum}), abre a vista grande`,
      verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
        name,
        ": ",
        beschreibung,
        " ",
        medaille,
        " Conquistada a ",
        datum,
        ". Abre a vista grande.",
      ],
      titel: (selbst: boolean) => (selbst ? "As minhas medalhas" : "Medalhas"),
      zaehler: (n: number, gesamt: number) => ["(", n, " de ", gesamt, ")"],
      verdienteListe: (selbst: boolean) => (selbst ? "As medalhas que conquistaste" : "Medalhas conquistadas"),
      keine: (selbst: boolean) =>
        selbst
          ? "Ainda não há medalhas - logo a primeira ronda te dá uma!"
          : "Ainda não há medalhas - a primeira ronda de prática traz a primeira.",
      zieleListe: "Próximas metas",
      zielTitel: (name: string) => `${name}, abre a vista grande`,
      zielName: (name: string) => `Mostrar a medalha ${name} na vista grande`,
      naechstesZiel: "Próxima meta:",
      zielStand: (einheit: string, hat: string, braucht: string) => [
        " - ",
        einheit,
        ": ",
        hat,
        " de ",
        braucht,
      ],
      alleTitel: "Mostrar ou ocultar todas as famílias de medalhas e o que é preciso para cada uma",
      alle: "Mostrar todas as medalhas",
      familie: (n: number, gesamt: number) => ["(", n, " de ", gesamt, ")"],
      grossTitel: "Abre a vista grande",
      geheim: "Uma medalha secreta. Descobre por ti como a conquistar!",
      zustand: (verdient: boolean) => (verdient ? " (conquistada)" : " (ainda não conquistada)"),
      grossAnzeigen: " Abre a vista grande.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      verdientTitel: (beschreibung: string, datum: string) =>
        `${beschreibung} (conquistada em ${datum}), abre a visualização ampliada`,
      verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
        name,
        ": ",
        beschreibung,
        " ",
        medaille,
        " Conquistada em ",
        datum,
        ". Abre a visualização ampliada.",
      ],
      titel: (selbst: boolean) => (selbst ? "Minhas medalhas" : "Medalhas"),
      zaehler: (n: number, gesamt: number) => ["(", n, " de ", gesamt, ")"],
      verdienteListe: (selbst: boolean) => (selbst ? "Suas medalhas conquistadas" : "Medalhas conquistadas"),
      keine: (selbst: boolean) =>
        selbst
          ? "Ainda nenhuma medalha - a sua primeira rodada já traz uma!"
          : "Ainda nenhuma medalha - a primeira rodada de prática traz a primeira.",
      zieleListe: "Próximos objetivos",
      zielTitel: (name: string) => `${name}, abre a visualização ampliada`,
      zielName: (name: string) => `Mostrar a medalha ${name} na visualização ampliada`,
      naechstesZiel: "Próximo objetivo:",
      zielStand: (einheit: string, hat: string, braucht: string) => [
        " - ",
        einheit,
        ": ",
        hat,
        " de ",
        braucht,
      ],
      alleTitel: "Mostrar ou ocultar todas as famílias de medalhas e o que é preciso para conquistar cada uma",
      alle: "Mostrar todas as medalhas",
      familie: (n: number, gesamt: number) => ["(", n, " de ", gesamt, ")"],
      grossTitel: "Abre a visualização ampliada",
      geheim: "Uma medalha secreta. Descubra por conta própria como conquistá-la!",
      zustand: (verdient: boolean) => (verdient ? " (conquistada)" : " (ainda não conquistada)"),
      grossAnzeigen: " Abre a visualização ampliada.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      verdientTitel: (beschreibung: string, datum: string) =>
        `${beschreibung} (obținută pe ${datum}), deschide vizualizarea mare`,
      verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
        name,
        ": ",
        beschreibung,
        " ",
        medaille,
        " Obținută pe ",
        datum,
        ". Deschide vizualizarea mare.",
      ],
      titel: (selbst: boolean) => (selbst ? "Medaliile mele" : "Medalii"),
      zaehler: (n: number, gesamt: number) => ["(", n, " din ", gesamt, ")"],
      verdienteListe: (selbst: boolean) => (selbst ? "Medaliile pe care le-ai obținut" : "Medalii obținute"),
      keine: (selbst: boolean) =>
        selbst
          ? "Încă nicio medalie - chiar prima rundă îți aduce una!"
          : "Încă nicio medalie - prima rundă de exersare aduce prima medalie.",
      zieleListe: "Următoarele ținte",
      zielTitel: (name: string) => `${name}, deschide vizualizarea mare`,
      zielName: (name: string) => `Vizualizare mare pentru medalia ${name}`,
      naechstesZiel: "Următoarea țintă:",
      zielStand: (einheit: string, hat: string, braucht: string) => [
        " - ",
        einheit,
        ": ",
        hat,
        " din ",
        braucht,
      ],
      alleTitel: "Afișați sau ascundeți toate familiile de medalii și ce aduce fiecare medalie",
      alle: "Afișați toate medaliile",
      familie: (n: number, gesamt: number) => ["(", n, " din ", gesamt, ")"],
      grossTitel: "Deschide vizualizarea mare",
      geheim: "O medalie secretă. Descoperă tu cum se obține!",
      zustand: (verdient: boolean) => (verdient ? " (obținută)" : " (încă neobținută)"),
      grossAnzeigen: " Deschide vizualizarea mare.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      verdientTitel: (beschreibung: string, datum: string) =>
        `${beschreibung} (taget ${datum}), öppnar den stora visningen`,
      verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
        name,
        ": ",
        beschreibung,
        " ",
        medaille,
        " Taget ",
        datum,
        ". Öppnar den stora visningen.",
      ],
      titel: (selbst: boolean) => (selbst ? "Mina märken" : "Märken"),
      zaehler: (n: number, gesamt: number) => ["(", n, " av ", gesamt, ")"],
      verdienteListe: (selbst: boolean) => (selbst ? "Märken som du har tagit" : "Tagna märken"),
      keine: (selbst: boolean) =>
        selbst
          ? "Inga märken än - redan din första omgång ger dig ett!"
          : "Inga märken än - den första övningsomgången ger det första.",
      zieleListe: "Nästa mål",
      zielTitel: (name: string) => `${name}, öppnar den stora visningen`,
      zielName: (name: string) => `Visa märket ${name} i den stora visningen`,
      naechstesZiel: "Nästa mål:",
      zielStand: (einheit: string, hat: string, braucht: string) => [
        " - ",
        einheit,
        ": ",
        hat,
        " av ",
        braucht,
      ],
      alleTitel: "Visa eller dölj alla märkesfamiljer och vad som ger varje märke",
      alle: "Visa alla märken",
      familie: (n: number, gesamt: number) => ["(", n, " av ", gesamt, ")"],
      grossTitel: "Öppnar den stora visningen",
      geheim: "Ett hemligt märke. Ta själv reda på hur du tar det!",
      zustand: (verdient: boolean) => (verdient ? " (taget)" : " (inte taget än)"),
      grossAnzeigen: " Öppnar den stora visningen.",
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      verdientTitel: (beschreibung: string, datum: string) =>
        `${beschreibung} (здобуто ${datum}), відкриває великий перегляд`,
      verdientSr: (name: string, beschreibung: string, medaille: string, datum: string) => [
        name,
        ": ",
        beschreibung,
        " ",
        medaille,
        " Здобуто ",
        datum,
        ". Відкриває великий перегляд.",
      ],
      titel: (selbst: boolean) => (selbst ? "Мої медалі" : "Медалі"),
      zaehler: (n: number, gesamt: number) => ["(", n, " з ", gesamt, ")"],
      verdienteListe: (selbst: boolean) => (selbst ? "Твої здобуті медалі" : "Здобуті медалі"),
      keine: (selbst: boolean) =>
        selbst
          ? "Медалей ще немає - уже перший раунд принесе тобі одну!"
          : "Медалей ще немає - перший раунд тренування принесе першу.",
      zieleListe: "Наступні цілі",
      zielTitel: (name: string) => `${name}, відкриває великий перегляд`,
      zielName: (name: string) => `Показати медаль ${name} у великому перегляді`,
      naechstesZiel: "Наступна ціль:",
      zielStand: (einheit: string, hat: string, braucht: string) => [
        " - ",
        einheit,
        ": ",
        hat,
        " з ",
        braucht,
      ],
      alleTitel: "Показати або сховати всі родини медалей і умови кожної медалі",
      alle: "Показати всі медалі",
      familie: (n: number, gesamt: number) => ["(", n, " з ", gesamt, ")"],
      grossTitel: "Відкриває великий перегляд",
      geheim: "Таємна медаль. Дізнайся, як її здобути!",
      zustand: (verdient: boolean) => (verdient ? " (здобута)" : " (ще не здобута)"),
      grossAnzeigen: " Відкриває великий перегляд.",
    },
});

/** Ein verdientes Abzeichen als Medaille mit Namensschild (Vitrinen-Kärtchen). */
function EarnedMedal({
  def,
  name,
  ts,
  onZoom,
  lernweg,
}: {
  def: BadgeDef;
  /** Anzeigename je Tonlage (badgeName) — die Medaille selbst bleibt gleich. */
  name: string;
  ts: number;
  onZoom: () => void;
  /** ★ E2 (24.09.2026): nur für „grundstellungs-gorilla" - siehe `badgeBeschreibung`. */
  lernweg: Lernweg;
}) {
  const { sprache } = useBedienSprache();
  const t = REGAL_TEXTE[sprache];
  const beschreibung = badgeBeschreibung(def, sprache, lernweg);
  return (
    <span role="listitem" className="inline-flex w-[4.7rem]">
      <Tipp
        text={t.verdientTitel(beschreibung, fmtBadgeDate(ts, sprache))}
        className="w-full"
      >
        {(tippId) => (
          <button
            type="button"
            data-abzeichen-fokus="verdient"
            className="inline-flex w-full flex-col items-center gap-0.5 rounded-lg text-center"
            aria-describedby={tippId}
            onClick={onZoom}
          >
            <BadgeMedal def={def} size={56} />
            {/* ★ E7 (11.09.2026): `text-sm` statt der Sondergrösse `text-[0.68rem]`
                (10,9 px) - unter der Mindestgrösse des Reviers (14 px). */}
            {/* ★ Testerin 19.11.2026: lange Namen („Gewohnheitstier") liefen in die Nachbar-
                Kachel. Die Kachel ist 4,7 rem breit: Silbentrennung (lang nötig) und,
                wenn der Browser keine Trennstelle kennt, Umbruch an jeder Stelle. */}
            <span
              aria-hidden="true"
              lang={sprache}
              data-abzeichen-name
              className="min-w-0 max-w-full text-sm font-semibold leading-tight text-ink [hyphens:auto] [overflow-wrap:anywhere]"
            >
              {name}
            </span>
            {/* Die Medaille selbst ist aria-hidden — ohne diesen Satz gäbe es sie
                für ein Kind mit Blindheit nicht. Er steht bewusst HINTER Name und
                Bedingung: Zuerst die Auskunft, dann das Bild. */}
            <span className="sr-only">
              {t.verdientSr(name, beschreibung, medaillenBeschreibung(def, false, sprache), fmtBadgeDate(ts, sprache))}
            </span>
          </button>
        )}
      </Tipp>
    </span>
  );
}

export function BadgeShelf({
  progress,
  selfView = false,
  skin = "kind",
  flach = false,
}: {
  progress: TypingProgress;
  selfView?: boolean;
  /** Tonlage für die Abzeichen-Namen (Kinder sehen Maskottchen, ab 11 neutral). */
  skin?: Skin;
  /**
   * ★ R6 (11.09.2026): ohne eigenen Rahmen, mit Haarlinie - in der
   * aufgeklappten Zeile eines Kindes bei der Lehrkraft. Begründung bei
   * `WeeklyGoalStats` (dieselbe Eigenschaft). Das Regal des Kindes behält den
   * Kasten.
   */
  flach?: boolean;
}) {
  const { sprache } = useBedienSprache();
  const t = REGAL_TEXTE[sprache];
  const [allOpen, setAllOpen] = useState(false);
  const [zoom, setZoom] = useState<BadgeZoomState | null>(null);
  const regalRef = useRef<HTMLDivElement>(null);
  const earned = earnedBadges(progress);
  const earnedIds = new Set(earned.map((e) => e.def.id));
  const earnedTs = new Map(earned.map((e) => [e.def.id, e.ts]));
  // ★ E2 (24.09.2026): der Lernweg DES KINDES - für „grundstellungs-gorilla"
  // (Bauplan §6.3, siehe `badgeBeschreibung`) und wie bisher für `nextGoals`.
  const lernweg = lernwegVon(progress);
  // Drei statt zwei nächste Ziele (seit dem Ausbau auf 105 Abzeichen, 09.08.2026):
  // Mit fünf zusätzlichen Familien wären zwei Ziele oft dreimal dieselbe Sorte —
  // drei zeigen zuverlässig auch ein Lernstoff-Ziel („noch 3 Zeichen bis …").
  const goals = nextGoals(progress, lernweg).slice(0, 3);

  const zoomBadge = (def: BadgeDef) => {
    const has = earnedIds.has(def.id);
    setZoom({
      def,
      earned: has,
      ts: earnedTs.get(def.id),
      secretHidden: !!def.secret && !has,
    });
  };

  /**
   * ★ Fokus-Ziel beim Öffnen von „Meine Statistik" (28.08.2026, §0.5).
   *
   * Das Regal holt den Fokus NICHT von sich aus - es löst nur eine
   * Anforderung ein, die der Öffner gestellt hat. Zwei Wege, genau wie bei der
   * Eingabezeile (`focusField.ts`): Beim Erscheinen einmal nachfragen (der
   * Normalfall - die Anforderung kam, während hier noch „Lädt …" stand) und
   * zusätzlich auf das Ereignis hören (falls das Regal schon steht).
   *
   * Die Rangfolge steht im Kopf von `focusStats.ts`: verdientes Abzeichen,
   * sonst nächstes Ziel, sonst „Alle Abzeichen anzeigen". Findet sich hier
   * gar nichts, bleibt die Anforderung ausdrücklich OFFEN - dann setzt die
   * Statistik selbst ihren letzten Halt, die Überschrift. Ein Kind darf nie
   * auf `body` landen.
   */
  useEffect(() => {
    const zielSuchen = (): HTMLElement | null => {
      const regal = regalRef.current;
      if (!regal) return null;
      return (
        regal.querySelector<HTMLElement>('[data-abzeichen-fokus="verdient"]') ??
        regal.querySelector<HTMLElement>('[data-abzeichen-fokus="ziel"]') ??
        regal.querySelector<HTMLElement>('[data-abzeichen-fokus="alle"]')
      );
    };
    const holeErstesAbzeichen = () => {
      const ziel = zielSuchen();
      if (!ziel) return;
      clearFirstBadgeFocusRequest();
      ziel.focus();
    };
    window.addEventListener(FIRST_BADGE_FOCUS_EVENT, holeErstesAbzeichen);
    // ⚠️ Erst suchen, dann verbrauchen: `takeFirstBadgeFocusRequest` löscht die
    // Anforderung beim Lesen. Gäbe es hier kein Ziel, hätte das Regal sie
    // stillschweigend geschluckt - und die Statistik käme nie zu ihrem letzten
    // Halt. Stilles Weglassen ist im Haus die schlimmste Antwort.
    if (zielSuchen() && takeFirstBadgeFocusRequest()) holeErstesAbzeichen();
    return () =>
      window.removeEventListener(FIRST_BADGE_FOCUS_EVENT, holeErstesAbzeichen);
  }, []);

  // Für die volle Liste: Familien in Definitions-Reihenfolge gruppieren.
  const groups: Array<{ group: string; defs: BadgeDef[] }> = [];
  for (const b of BADGES) {
    const g = groups[groups.length - 1];
    if (g && g.group === b.group) g.defs.push(b);
    else groups.push({ group: b.group, defs: [b] });
  }

  return (
    <div
      ref={regalRef}
      className={
        // ★ R6 (11.09.2026): `flach` - Haarlinie statt Rahmen, siehe Eigenschaft.
        flach
          ? "border-t border-hairline pt-3"
          : "rounded-lg border border-hairline bg-surface-raised px-3 py-2.5"
      }
    >
      <h3 className="m-0 mb-1.5 text-sm font-semibold text-ink">
        {t.titel(selfView)}{" "}
        <span className="font-normal text-ink-muted">{t.zaehler(earned.length, BADGES.length)}</span>
      </h3>

      {earned.length > 0 ? (
        <div
          className="flex flex-wrap items-start gap-x-1.5 gap-y-2"
          role="list"
          aria-label={t.verdienteListe(selfView)}
        >
          {earned.map((e) => (
            <EarnedMedal
              key={e.def.id}
              def={e.def}
              name={badgeName(e.def, skin, sprache)}
              ts={e.ts}
              onZoom={() => zoomBadge(e.def)}
              lernweg={lernweg}
            />
          ))}
        </div>
      ) : (
        <p className="m-0 text-sm text-ink-muted">{t.keine(selfView)}</p>
      )}

      {/* Die zwei am ehesten erreichbaren nächsten Ziele — Motivation mit klarem
         Zählerstand („fehlerfreie Runden: 3 von 5") und der Medaille, um die es geht. */}
      {goals.length > 0 && (
        <div className="mt-2 space-y-1" role="list" aria-label={t.zieleListe}>
          {goals.map((g) => (
            <p
              key={g.def.id}
              role="listitem"
              className="m-0 flex items-center gap-1.5 text-sm text-ink-soft"
            >
              <Tipp text={t.zielTitel(badgeName(g.def, skin, sprache))} className="shrink-0">
                {(tippId) => (
                  <button
                    type="button"
                    data-abzeichen-fokus="ziel"
                    className="shrink-0 rounded-md"
                    aria-label={t.zielName(badgeName(g.def, skin, sprache))}
                    aria-describedby={tippId}
                    onClick={() => zoomBadge(g.def)}
                  >
                    <BadgeMedal def={g.def} earned={false} size={26} />
                  </button>
                )}
              </Tipp>
              <span>
                <span className="font-medium text-ink-muted">{t.naechstesZiel}</span>{" "}
                <strong>{badgeName(g.def, skin, sprache)}</strong>
                {t.zielStand(
                  nextGoalUnit(g, sprache),
                  fmtCount(Math.min(g.have, g.need), sprache),
                  fmtCount(g.need, sprache),
                )}
              </span>
            </p>
          ))}
        </div>
      )}

      {/* Alle Abzeichen (aufklappbar): verdiente Medaillen bunt, offene entsättigt,
         Geheime als graue „?"-Medaille. Jede Zeile öffnet die Groß-Ansicht. */}
      <Tipp text={t.alleTitel} className="mt-2">
        {(tippId) => (
          <button
            type="button"
            data-abzeichen-fokus="alle"
            className={
              "flex items-center gap-1.5 text-left text-sm font-semibold text-ink-soft" +
              // ★ R7 (11.09.2026): In der Lehrkraft-Zeile ist jede Aufklapp-Zeile
              // mindestens 36 px hoch - gemessen stand diese mit 20 px daneben.
              (flach ? " min-h-9" : "")
            }
            aria-expanded={allOpen}
            aria-describedby={tippId}
            onClick={() => setAllOpen((o) => !o)}
          >
            <span aria-hidden className="text-ink-muted">
              {allOpen ? "▾" : "▸"}
            </span>
            {t.alle}
          </button>
        )}
      </Tipp>
      {/* ★ Bewegung beim Aufklappen (Johannes 19.09.2026: „der Rest rutscht
          nach unten und der andere kommt nach"): Die volle Liste ist lang -
          sie wächst sichtbar auf, und was darunter steht, gleitet mit. */}
      <Aufklappen offen={allOpen}>
        <div className="mt-1.5 space-y-2">
          {groups.map((g) => (
            <div key={g.group}>
              {/* Zähler je Familie: Bei 105 Abzeichen in 21 Familien ist „3 von
                  12" die Auskunft, die ein Kind sucht — sonst muss es zählen. */}
              <h4 className="m-0 mb-1 text-sm font-semibold text-ink-muted">
                {badgeGruppe(g.group, sprache)}{" "}
                <span className="font-normal">
                  {t.familie(g.defs.filter((b) => earnedIds.has(b.id)).length, g.defs.length)}
                </span>
              </h4>
              <ul className="m-0 grid list-none grid-cols-1 gap-1 p-0 sm:grid-cols-2">
                {g.defs.map((b) => {
                  const has = earnedIds.has(b.id);
                  const hidden = b.secret && !has; // Geheim: nur „?"
                  return (
                    <li
                      key={b.id}
                      className={
                        "rounded-lg border text-sm " +
                        (has
                          ? "border-accent bg-accent-soft text-ink"
                          : "border-hairline bg-surface-sunken text-ink-muted")
                      }
                    >
                      <Tipp text={t.grossTitel} className="w-full">
                        {(tippId) => (
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left"
                            aria-describedby={tippId}
                            onClick={() => zoomBadge(b)}
                          >
                            <BadgeMedal
                              def={b}
                              earned={has}
                              secretHidden={hidden}
                              size={34}
                              className="shrink-0"
                            />
                            <span>
                              <strong>{hidden ? "???" : badgeName(b, skin, sprache)}</strong>
                              {" - "}
                              {hidden ? t.geheim : badgeBeschreibung(b, sprache, lernweg)}
                              <span className="sr-only">
                                {" "}
                                {medaillenBeschreibung(b, !!hidden, sprache)}
                                {t.zustand(has)}
                                {t.grossAnzeigen}
                              </span>
                            </span>
                          </button>
                        )}
                      </Tipp>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Aufklappen>

      <BadgeZoomDialog zoom={zoom} onClose={() => setZoom(null)} selfView={selfView} skin={skin} lernweg={lernweg} />
    </div>
  );
}
