/**
 * ★ F58 (29.10.2026): die Ansagen der Sprachausgabe auf Ukrainisch (Weg „uk") - nach Glossar
 * `recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md`; ⚠️ Lese-Abnahme durch eine Person mit Ukrainisch als Erstsprache steht aus.
 *
 * Regeln in Kürze: Kinder werden geduzt (ти, §1 Regel 1); keine Vergangenheit und keine Adjektive am Kind (Regel 2) - darum
 * -но-Formen („увімкнено", „змінено"); nur Bindestrich `-`; Apostroph U+0027 (Regel 7); nie ein Punkt direkt hinter einer Zahl
 * (Ordnungszahl) - Schrägstrich und Doppelpunkt bzw. Komma; Mehrzahl immer mit allen vier Formen über `mehrzahl` (§2.11); Namen und
 * Tastennamen nie gebeugt, Name nur nach Doppelpunkt (Regel 11, 12).
 */
import type { VorleseTexteNeun } from "./vorleseTexteNeun";
import { mehrzahl } from "../bedienSprache/texte";

/** Erster Buchstabe groß (für den Satzanfang nach dem Zeichennamen, z. B. „велика А"). */
function gross(s: string): string {
  return s.length ? s.slice(0, 1).toLocaleUpperCase("uk") + s.slice(1) : s;
}

export const VORLESE_TEXTE_UK: VorleseTexteNeun = {
  ansagen: {
    // --- Vorlesen selbst ---
    // „Читання вголос" = Schalter (Glossar §2.8); Zustand mit -но-Form, nie am Kind (Regel 2).
    vorlesenAn: "Читання вголос: увімкнено.",
    vorlesenAnMitFeldern:
      "Читання вголос: увімкнено. Нижче: літери, слова, речення, темп мовлення і голос.",
    vorlesenAus: "Читання вголос: вимкнено. Налаштування нижче сховано.",
    woerterAn: "Читання слів: увімкнено.",
    woerterAus: "Читання слів: вимкнено.",
    saetzeAn: "Читання речень: увімкнено.",
    saetzeAus: "Читання речень: вимкнено.",
    tempoProbe: "Так швидко я читаю зараз.",
    stimmeProbe: "Привіт! Так звучить цей голос.",

    // --- Inhaltswechsel mitten in der Runde ---
    jetztEchteWoerter: "Увага, тепер справжні слова.",
    jetztUnsinnwoerter: "Увага, тепер вигадані слова.",
    jetztZahlen: "Увага, тепер числа.",

    // --- Ton und Anzeige ---
    tonAn: "Звук: увімкнено.",
    tonAus: "Звук: вимкнено.",
    // „клацання" als Geräusch erlaubt (Glossar §2.8, Regel 8).
    tippKlickAn: "Клацання клавіш: увімкнено.",
    tippKlickAus: "Клацання клавіш: вимкнено.",
    melodieAn: "Мелодія: увімкнено. Вона грає в правому вусі.",
    melodieAus: "Мелодія: вимкнено.",
    fingerFarbenAn: "Кольори пальців: увімкнено.",
    fingerFarbenAus: "Кольори пальців: вимкнено.",
    kleinsteGroesse: "Це найменший розмір.",
    groessteGroesse: "Це найбільший розмір.",
    // „Швидкість не важлива" = Zeit lassen (Glossar §2.2).
    zeitLassenAn: "Швидкість не важлива: увімкнено.",
    zeitLassenAus: "Швидкість не важлива: вимкнено.",
    einhandAn: "Друк однією рукою: увімкнено.",
    einhandAus: "Друк однією рукою: вимкнено.",

    // --- Bereiche und Wege ---
    einstellungenGeoeffnet: "Налаштування відкрито.",
    einstellungenGeschlossen: "Налаштування закрито.",
    statistik: "Мій поступ. Твої медалі.", // §2.6 „Мій поступ", §2.4 Abzeichen = медаль
    podcastGeoeffnet: "Вступний подкаст відкрито.",
    eisschollenSpiel: "Крижини.", // §2.3
    abgemeldet: "Вихід виконано.", // §2.5, ohne „Ти вийшов" (Geschlecht)
    passwortGeaendert: "Пароль змінено.",
    wirdGesendet: "Надсилається...",
    kontoErstellen: "Створити обліковий запис: ім'я, електронна пошта, пароль, пароль ще раз.",
    anmelden: "Увійти: електронна пошта, пароль.",
    belohnungKeins: "Гра-нагорода: немає.",

    // --- Übungsarten ---
    modusAdaptiv: "Моє тренування.",
    modusBuecherei: "Історії й цікавинки.",
    modusWortspiele: "Ігри зі словами.",

    // --- Zeit und Fortschritt ---
    letzteZeile: "Останній рядок.",
  },

  // Schrägstrich und Doppelpunkt: keine Zahl mit Punkt davor (Ordnungszahl), keine Präposition am Zahlwort (Regel 13).
  schritt: (nummer, gesamt, titel) => `Крок ${nummer}/${gesamt}: ${titel}`,
  tastatur: (kurz) => `Клавіатура: ${kurz}.`,
  start: (label) => `Точка старту: ${label}.`,
  // Name nur nach Doppelpunkt, nie gebeugt (Regel 12); „Вхід виконано" ohne Personalform (Regel 2).
  angemeldet: (name) => `Вхід виконано: ${name}.`,
  belohnungsspiel: (label) => `Гра-нагорода: ${label}.`,

  // Wie pl: ohne Verb („ще 9 рядків"), das Hauptwort nach der Zahl in der richtigen Form (§2.11); Komma hinter der Gesamtzahl.
  stand: (aktuell, gesamt, art) => {
    const w =
      art === "zeile"
        ? { one: "рядок", few: "рядки", many: "рядків", other: "рядка", letzte: "останній рядок" }
        : { one: "завдання", few: "завдання", many: "завдань", other: "завдання", letzte: "останнє завдання" };
    const rest = Math.max(0, gesamt - aktuell);
    const schwanz =
      rest > 0
        ? `ще ${mehrzahl(rest, "uk", {
            one: (z) => `${z} ${w.one}`,
            few: (z) => `${z} ${w.few}`,
            many: (z) => `${z} ${w.many}`,
            other: (z) => `${z} ${w.other}`,
          })}.`
        : `${w.letzte}.`;
    return `${gross(w.one)} ${aktuell}/${gesamt}, ${schwanz}`;
  },

  uebezeit: (zeit) => `Час тренування: ${zeit}`, // §2.2

  // „У тебе виходить дедалі краще" verrät kein Geschlecht (Regel 2); höchstens ein Ausrufezeichen.
  aufstieg: (sober) =>
    sober ? "Новий рівень: наступний рівень вправ. " : "Новий рівень! У тебе виходить дедалі краще. ",

  // Abzeichen = медаль (§2.4); wie pl: „і ще 2" ohne Hauptwort, damit nichts gebeugt werden muss.
  neueAbzeichen: (namen, gesamt, rest, ende) => {
    if (!namen.length) return "";
    const kopf = gesamt === 1 ? "Нова медаль: " : "Нові медалі: ";
    // F58-Abnahme: ein Hauptwort hinter der Zahl - „… 3." am Ende wäre eine Ordnungszahl (Wächter F58 §7).
    const mehr =
      rest > 0
        ? ` і ще ${mehrzahl(rest, "uk", { one: (z) => `${z} медаль`, few: (z) => `${z} медалі`, many: (z) => `${z} медалей`, other: (z) => `${z} медалі` })}`
        : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  },

  // §1 Regel 6: „знаків за хвилину"; die Prozentzahl kommt fertig („95%"); Komma statt Punkt dahinter.
  werte: (treffsicherheit, tempo) =>
    ` Точність: ${treffsicherheit}, швидкість: ${mehrzahl(tempo, "uk", {
      one: (z) => `${z} знак за хвилину`,
      few: (z) => `${z} знаки за хвилину`,
      many: (z) => `${z} знаків за хвилину`,
      other: (z) => `${z} знака за хвилину`,
    })}.`,

  // §2.9 / Regel 11: Tastennamen nie gebeugt, darum mit Kopfwort „клавіші Shift"; Caps Lock bleibt stehen.
  umschaltSeite: (zeichenName, seiteLinks) =>
    `Майже! ${gross(zeichenName)} потребує ${seiteLinks ? "лівої" : "правої"} клавіші Shift, ` +
    "а не другої й не клавіші Caps Lock.",
};
