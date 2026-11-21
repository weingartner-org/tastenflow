/**
 * ★ F58 (29.10.2026): die Ansagen der Sprachausgabe auf Bulgarisch (Weg „bg") - nach Glossar
 * `recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md`; ⚠️ Lese-Abnahme durch eine Person mit Bulgarisch als Erstsprache steht aus.
 *
 * Vorbild für Aufbau und Ton: die tschechische Tabelle in `vorlesen.ts` (`CS`) und die Zweige dazu. Kinder werden geduzt; kein Satz
 * verrät das Geschlecht des Kindes (Präsens/Imperativ/Hauptwort-Sätze, Adjektive nur am Ding - Glossar §1 Regel 2); keine
 * Anführungszeichen; nur Bindestrich; nie eine Zahl mit Punkt (Ordnungszahl - Glossar §1 Regel 5); Tastennamen wie auf der Kappe
 * (Shift, Caps Lock - Glossar §2.9), vor dem Namen das Kopfwort „клавиш" (Regel 11).
 */
import type { VorleseTexteNeun } from "./vorleseTexteNeun";
import { mehrzahl } from "../bedienSprache/texte";

/** Großbuchstabe am Satzanfang (Kyrillisch). */
function gross(s: string): string {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

export const VORLESE_TEXTE_BG: VorleseTexteNeun = {
  ansagen: {
    // --- Vorlesen selbst --- (Glossar §2.8: „Четене на глас", Schalter mit „включено/изключено" - ausgeschrieben,
    // weil die Stimme „вкл./изкл." nicht sicher liest)
    vorlesenAn: "Четене на глас: включено.",
    vorlesenAnMitFeldern:
      "Четене на глас: включено. Под него: думи, изречения, клавиш по клавиш, скорост и глас.",
    vorlesenAus: "Четене на глас: изключено. Настройките под него са скрити.",
    woerterAn: "Четене на думи: включено.",
    woerterAus: "Четене на думи: изключено.",
    saetzeAn: "Четене на изречения: включено.",
    saetzeAus: "Четене на изречения: изключено.",
    tempoProbe: "Така бързо чета сега.",
    stimmeProbe: "Здравей! Така звучи този глас.",

    // --- Inhaltswechsel mitten in der Runde ---
    jetztEchteWoerter: "Внимание, сега истински думи.",
    jetztUnsinnwoerter: "Внимание, сега измислени думи.",
    jetztZahlen: "Внимание, сега числа.",

    // --- Ton und Anzeige ---
    tonAn: "Звук: включен.",
    tonAus: "Звук: изключен.",
    tippKlickAn: "Тракане на клавишите: включено.",
    tippKlickAus: "Тракане на клавишите: изключено.",
    melodieAn: "Мелодия: включена. Свири в дясното ухо.",
    melodieAus: "Мелодия: изключена.",
    fingerFarbenAn: "Цветове на пръстите: включени.",
    fingerFarbenAus: "Цветове на пръстите: изключени.",
    kleinsteGroesse: "Това е най-малкият размер.",
    groessteGroesse: "Това е най-големият размер.",
    // Glossar §2.2: „Спокойно" (Zeit lassen / Tempo zählt nicht)
    zeitLassenAn: "Спокойно: включено.",
    zeitLassenAus: "Спокойно: изключено.",
    einhandAn: "Писане с една ръка: включено.",
    einhandAus: "Писане с една ръка: изключено.",

    // --- Bereiche und Wege ---
    einstellungenGeoeffnet: "Настройките са отворени.",
    einstellungenGeschlossen: "Настройките са затворени.",
    statistik: "Моят напредък. Твоите значки.", // Glossar §2.6 „Моят напредък", §2.4 „значка"
    podcastGeoeffnet: "Подкастът за въвеждане е отворен.",
    eisschollenSpiel: "Ледени късове.",
    // Glossar §2.5: Aorist ohne Geschlecht („Излезе от акаунта."), nie „Излязъл си"
    abgemeldet: "Излезе от акаунта.",
    passwortGeaendert: "Паролата е променена.",
    wirdGesendet: "Изпраща се...",
    kontoErstellen: "Създай акаунт: име, имейл адрес, парола, парола отново.",
    anmelden: "Влез: имейл адрес, парола.",
    belohnungKeins: "Игра за награда: няма.",

    // --- Übungsarten --- (Glossar §2.2/§2.3)
    modusAdaptiv: "Моята тренировка.",
    modusBuecherei: "Истории и любопитни факти.",
    modusWortspiele: "Игри с думи.",

    // --- Zeit und Fortschritt ---
    letzteZeile: "Последен ред.",
  },

  // Glossar §1 Regel 5/§2.12: Schrägstrich, nie die Gesamtzahl mit Punkt vor dem Titel.
  schritt: (nummer, gesamt, titel) => `Стъпка ${nummer}/${gesamt}: ${titel}`,
  tastatur: (kurz) => `Клавиатура: ${kurz}.`,
  start: (label) => `Начална точка: ${label}.`,
  // Glossar §2.12: „Акаунт: …" - kein Vokativ, kein „Влязъл си като" (Geschlecht), Name nach Doppelpunkt.
  angemeldet: (name) => `Акаунт: ${name}.`,
  belohnungsspiel: (label) => `Игра за награда: ${label}.`,

  // Glossar §2.11: Zählform nach Zahl (ред: 1 ред · 2 реда; задача: 1 задача · 2 задачи), das Verb zieht mit
  // (остава 1 · остават 9). KOMMA hinter der Gesamtzahl: „3/12," - nie „12." (Ordnungszahl).
  stand: (aktuell, gesamt, art) => {
    const rest = Math.max(0, gesamt - aktuell);
    const kopf = art === "zeile" ? "Ред" : "Задача";
    const schwanz =
      art === "zeile"
        ? rest > 0
          ? mehrzahl(rest, "bg", {
              one: (z) => `остава ${z} ред`,
              other: (z) => `остават ${z} реда`,
            })
          : "последен ред"
        : rest > 0
          ? mehrzahl(rest, "bg", {
              one: (z) => `остава ${z} задача`,
              other: (z) => `остават ${z} задачи`,
            })
          : "последна задача";
    return `${kopf} ${aktuell}/${gesamt}, ${schwanz}.`;
  },

  // Glossar §2.2: „време за упражнения"
  uebezeit: (zeit) => `Време за упражнения: ${zeit}`,

  // Glossar §2.2: „ниво"; „Справяш се" ist Präsens und verrät kein Geschlecht (Regel 2).
  aufstieg: (sober) =>
    sober ? "Ново ниво: следващо ниво на упражненията. " : "Ново ниво! Справяш се все по-добре. ",

  // Glossar §2.4/§2.12: „значка", Name nach Doppelpunkt; „и още 2" ohne Hauptwort nach der Zahl (kein Beugungsproblem).
  neueAbzeichen: (namen, gesamt, rest, ende) => {
    const kopf = gesamt === 1 ? "Нова значка: " : "Нови значки: ";
    // F58-Abnahme: ein Hauptwort hinter der Zahl - „… 3." am Ende wäre eine Ordnungszahl (Wächter F58 §7).
    const mehr = rest > 0 ? ` и още ${mehrzahl(rest, "bg", { one: (z) => `${z} значка`, other: (z) => `${z} значки` })}` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  },

  // Glossar Regel 6: „знака в минута" (Zählform von „знак", §2.11); der Wert kommt fertig („95%"); am Ende „минута", nie die Zahl.
  werte: (treffsicherheit, tempo) =>
    ` Точност: ${treffsicherheit}, скорост: ${mehrzahl(tempo, "bg", {
      one: (z) => `${z} знак в минута`,
      other: (z) => `${z} знака в минута`,
    })}.`,

  // Glossar §2.9/Regel 11: Tastenname nie gebeugt, Kopfwort „клавиш"; Satzanfang groß („главно А" ⇒ „Главно А").
  umschaltSeite: (zeichenName, seiteLinks) =>
    `Почти! ${gross(zeichenName)} изисква ${seiteLinks ? "левия" : "десния"} клавиш Shift, ` +
    "не другия и не клавиша Caps Lock.",
};
