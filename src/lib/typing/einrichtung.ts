/**
 * Tastenflow — die EINRICHTUNG beim ersten Start (08.08.2026).
 *
 * Wunsch Johannes: „wir brauchen eine einführung wie bei »im Griff«, in der wir
 * Alter, Sprache, … die ganzen Einstellungen gemeinsam einrichten. Hier passt
 * der Podcast gut dazu."
 *
 * Vorbild ist der Im-Griff-Rundgang (`lib/computer/rundgang.ts`): eine feste
 * Schrittfolge, jeder Schritt eine echte Entscheidung, jederzeit überspringbar,
 * jederzeit neu startbar (Alt + R — dasselbe Kürzel wie dort,
 * [[feedback_shortcut_konzept]]).
 *
 * Diese Datei ist rein: kein React, kein Netz, keine DOM-Wirkung außer dem
 * localStorage-Merker. Damit ist die Schrittfolge testbar, ohne etwas zu
 * mocken.
 *
 * ── Die vier Regeln dieser Datei ────────────────────────────────────────────
 *
 * 1. **Nur Schritte, die es hier auch zu entscheiden gibt.** Wem die Lehrkraft
 *    die Sprache festgelegt hat, bekommt den Sprach-Schritt nicht zu sehen;
 *    den Startpunkt gibt es nur ohne Anmeldung (mit Konto setzt ihn die
 *    Lehrkraft in „Meine Klassen"). Ein Schritt, der nichts ändern kann, ist
 *    eine Sackgasse — genau die hat der Im-Griff-Rundgang gelehrt.
 *
 * 2. **Der Podcast kommt NACH dem Alter.** Es gibt drei Folgen für vier
 *    Stufen; welche die richtige ist, weiß man erst, wenn das Alter steht.
 *
 * 3. **Gemerkt wird im Browser, nicht im Spielstand.** Tastatur-Layout, Ton und
 *    Vorlesen sind Eigenschaften des GERÄTS, nicht der Person: Wer sich am
 *    Schul-Rechner neu anmeldet, soll sie neu bestätigen dürfen. Darum ein Bit
 *    in localStorage — und keine neue Spalte im Fortschritt (der
 *    Spielstand-Wächter `typing-stand-bleibt` bliebe sonst nicht ruhig).
 *
 * 4. **Kein Fortschritt, keine Übezeit.** Die Einrichtung ist Vorbereitung,
 *    keine Übung.
 */
import type { Stufe } from "./account";
import type { TypingProgress } from "./progress";
import type { BedienSprache } from "../bedienSprache/sprache";
import { EINRICHTUNG_TEXTE_NEUN } from "./einrichtungTexteNeun";

/**
 * Hat dieses Konto schon geübt? (Wunsch Johannes 09.08.2026: „bitte den
 * Einführungsdialog nicht bei Usern anzeigen, die schon angemeldet sind und
 * geübt haben.")
 *
 * Gemessen an dem, was Üben hinterlässt — Punkte, gespielte Runden, eine
 * abgeschlossene Lektion oder eine Anschlag-Statistik. NICHT gemessen an
 * `introduced`: Das setzt schon der Startpunkt, den eine Lehrkraft vergibt,
 * ohne dass das Kind je eine Taste gedrückt hätte.
 */
export function hatSchonGeuebt(p: TypingProgress | null | undefined): boolean {
  if (!p) return false;
  if ((p.xp ?? 0) > 0) return true;
  if ((p.rounds?.length ?? 0) > 0) return true;
  if (Object.keys(p.lessons ?? {}).length > 0) return true;
  if (Object.keys(p.letters ?? {}).length > 0) return true;
  return false;
}

/* ── Merker ────────────────────────────────────────────────────────────────*/

export const EINRICHTUNG_KEY = "tippen-einrichtung";
/** Die Fassung steckt im Wert: Kommen später Schritte dazu, die eine
 *  Entscheidung brauchen, darf sich die Einrichtung als `v2` neu zeigen. */
export const EINRICHTUNG_WERT = "v1";

export function einrichtungFertig(): boolean {
  try {
    return localStorage.getItem(EINRICHTUNG_KEY) === EINRICHTUNG_WERT;
  } catch {
    // Kein localStorage (Privatmodus) → lieber einmal zu viel fragen als beim
    // Start einen Fehler werfen.
    return false;
  }
}

export function einrichtungFertigMerken(): void {
  try {
    localStorage.setItem(EINRICHTUNG_KEY, EINRICHTUNG_WERT);
  } catch {
    /* dann eben nur für diese Sitzung */
  }
}

/** Nur für Tests und für „Einrichtung neu starten". */
export function einrichtungZuruecksetzen(): void {
  try {
    localStorage.removeItem(EINRICHTUNG_KEY);
  } catch {
    /* egal */
  }
}

/* ── Schrittfolge ──────────────────────────────────────────────────────────*/

export const EINRICHTUNG_STEP_ORDER = [
  "willkommen",
  "alter",
  "sprache",
  "tastatur",
  "start",
  "ton",
  "podcast",
  "fertig",
] as const;

export type EinrichtungStepId = (typeof EINRICHTUNG_STEP_ORDER)[number];

export interface EinrichtungLage {
  /** Die Lehrkraft hat die Sprache festgelegt → Schritt „sprache" entfällt. */
  langLocked?: boolean;
  /**
   * ★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M2): Die Übungssprache gehört zum
   * Weg (Weg „fr"/„es", `uebungsSprachenImWeg` in account.ts) → Schritt
   * „sprache" entfällt, wie bei der Sperre der Lehrkraft: ein Schritt mit
   * einer einzigen Wahl fragt nach nichts. Bis hierher bot er auf Weg „es"
   * „Alemán | Inglés" an, keine davon gewählt.
   */
  spracheGebunden?: boolean;
  /** Ohne Anmeldung wählt man den Startpunkt selbst; mit Konto nicht. */
  mitStartpunkt?: boolean;
  /** Gibt es zur gewählten Stufe eine Folge? Sonst entfällt „podcast". */
  mitPodcast?: boolean;
  /**
   * ★★★ B11/§2.3 (11.09.2026): Gehört das Konto einer KLASSE an? Dann entfällt
   * der Schritt „alter" ganz.
   *
   * Er fragte nach dem Geburtsjahr, aus dem die Textstufe wuchs. Für ein Kind
   * einer Klasse kommt die Textstufe seit dem Umbau aus der SCHULSTUFE der
   * Klasse (`klassenEinstellungen.ts`) - der Schritt hätte also nach einer
   * Zahl gefragt, die nichts mehr bewirkt. Bis dahin zeigte er stattdessen
   * einen Ersatztext („das hat deine Lehrkraft eingestellt"): ein ganzer
   * Schritt, der nur sagt, dass es hier nichts zu tun gibt.
   */
  klassenkind?: boolean;
}

/** Die Schritte, die in dieser Lage wirklich vorkommen — in fester Reihenfolge. */
export function einrichtungSchritte(lage: EinrichtungLage): EinrichtungStepId[] {
  return EINRICHTUNG_STEP_ORDER.filter((id) => {
    if (id === "alter") return !lage.klassenkind;
    if (id === "sprache") return !lage.langLocked && !lage.spracheGebunden;
    if (id === "start") return !!lage.mitStartpunkt;
    if (id === "podcast") return lage.mitPodcast !== false;
    return true;
  });
}

/** „Schritt 3 von 7" — 1-basiert, 0 wenn der Schritt hier nicht vorkommt. */
export function schrittNummer(
  id: EinrichtungStepId,
  lage: EinrichtungLage,
): number {
  return einrichtungSchritte(lage).indexOf(id) + 1;
}

/** Der nächste Schritt — oder `null`, wenn es der letzte war. */
export function naechsterSchritt(
  id: EinrichtungStepId,
  lage: EinrichtungLage,
): EinrichtungStepId | null {
  const alle = einrichtungSchritte(lage);
  const i = alle.indexOf(id);
  if (i < 0 || i === alle.length - 1) return null;
  return alle[i + 1];
}

/** Der vorige Schritt — oder `null` beim ersten (dann gibt es kein „Zurück"). */
export function vorigerSchritt(
  id: EinrichtungStepId,
  lage: EinrichtungLage,
): EinrichtungStepId | null {
  const alle = einrichtungSchritte(lage);
  const i = alle.indexOf(id);
  if (i <= 0) return null;
  return alle[i - 1];
}

/* ── Texte ────────────────────────────────────────────────────────────────*/

/**
 * Überschrift je Schritt. Bewusst als Frage formuliert, wo etwas zu
 * entscheiden ist — das ist die Einladung, die ein Titel („Textstufe") nicht
 * gibt. Der Ton ist per Du: Die Anrede der Oberfläche hängt (anders als bei den
 * Übungstexten) nicht an der Stufe, und beim ersten Schritt ist die Stufe noch
 * gar nicht gewählt.
 */
export const EINRICHTUNG_TITEL: Record<EinrichtungStepId, string> = {
  willkommen: "Willkommen bei Tastenflow",
  alter: "Für wen sind die Texte?",
  sprache: "In welcher Sprache willst du üben?",
  tastatur: "Welche Tastatur liegt vor dir?",
  start: "Womit fängst du an?",
  ton: "Ton und Vorlesen",
  podcast: "Kurz erklärt: dein Einführungs-Podcast",
  fertig: "Fertig: alles eingestellt",
};

/*
 * ★★ EN2 (19.09.2026): DIE ENGLISCHEN GEGENSTÜCKE - je Tabelle direkt neben
 * der deutschen, Glossar §3.4 (*setup*, *starting point*, *Where do you want
 * to start?*). Gelesen werden sie über {@link einrichtungTexte}; ohne Angabe
 * bleibt alles Deutsch.
 *
 * ⚠️ „podcast" steht auch englisch da, damit die Tabellen vollständig sind -
 * in der englischen Bedienung kommt der Schritt aber nie vor: Die Folgen sind
 * deutsch, und Johannes hat entschieden, sie dort wegzulassen (12.09.2026).
 * `Einrichtung.tsx` setzt darum `mitPodcast: false`.
 */
const EINRICHTUNG_TITEL_EN: Record<EinrichtungStepId, string> = {
  willkommen: "Welcome to Tastenflow",
  alter: "Who are the texts for?",
  sprache: "Which language do you want to practise in?",
  tastatur: "Which keyboard is in front of you?",
  start: "Where do you want to start?",
  ton: "Sound and reading aloud",
  podcast: "In a nutshell: your introduction podcast",
  fertig: "Done: everything is set up",
};

/**
 * ★ E11a-4 (26.09.2026): dieselben Titel auf Französisch - neu geschrieben
 * (Bauplan §9.1), „tu" (F9). „podcast" steht auch hier vollständig, obwohl er
 * für Weg „fr" nie erscheint (Bauplan §6.1: 0 Podcasts) - dieselbe
 * Begründung wie bei `EINRICHTUNG_TITEL_EN`.
 */
const EINRICHTUNG_TITEL_FR: Record<EinrichtungStepId, string> = {
  willkommen: "Bienvenue sur Tastenflow",
  alter: "Pour qui sont les textes ?",
  sprache: "Dans quelle langue veux-tu t'exercer ?",
  tastatur: "Quel clavier as-tu devant toi ?",
  start: "Par où commences-tu ?",
  ton: "Son et lecture à voix haute",
  podcast: "En bref : ton podcast d'introduction",
  fertig: "Terminé : tout est réglé",
};

/** ★ ES-O (27.09.2026): dieselben Titel auf Spanisch, „tú" (Bauplan S9). */
const EINRICHTUNG_TITEL_ES: Record<EinrichtungStepId, string> = {
  willkommen: "Te damos la bienvenida a Tastenflow",
  alter: "¿Para quién son los textos?",
  sprache: "¿En qué idioma quieres practicar?",
  tastatur: "¿Qué teclado tienes delante?",
  start: "¿Por dónde empiezas?",
  ton: "Sonido y lectura en voz alta",
  podcast: "En pocas palabras: tu pódcast de introducción",
  fertig: "Listo: todo está configurado",
};

/**
 * ★ O-IT (02.10.2026): dieselben Titel auf Italienisch, „tu" (Glossar Regel 1);
 * „Ti diamo il benvenuto" statt „Benvenuto/Benvenuta" (ohne Geschlecht, Regel 2).
 */
const EINRICHTUNG_TITEL_IT: Record<EinrichtungStepId, string> = {
  willkommen: "Ti diamo il benvenuto in Tastenflow",
  alter: "Per chi sono i testi?",
  sprache: "In quale lingua vuoi esercitarti?",
  tastatur: "Quale tastiera hai davanti?",
  start: "Da dove vuoi iniziare?",
  ton: "Suono e lettura ad alta voce",
  podcast: "In breve: il tuo podcast introduttivo",
  fertig: "Fatto: è tutto pronto",
};

/**
 * ★ O-PL (02.10.2026): dieselben Titel auf Polnisch, „ty" (Glossar Regel 1);
 * „Witamy" statt „Witaj, gotowy?" - ohne Geschlecht (Regel 2); „w programie
 * Tastenflow" (Regel 11: fremder Name mit beugbarem Nomen davor).
 */
const EINRICHTUNG_TITEL_PL: Record<EinrichtungStepId, string> = {
  willkommen: "Witamy w programie Tastenflow",
  alter: "Dla kogo są teksty?",
  sprache: "W jakim języku chcesz ćwiczyć?",
  tastatur: "Jaką klawiaturę masz przed sobą?",
  start: "Od czego chcesz zacząć?",
  ton: "Dźwięk i czytanie na głos",
  podcast: "W skrócie: podcast na początek",
  fertig: "Gotowe: wszystko ustawione",
};

/**
 * ★ O-TR (02.10.2026): dieselben Titel auf Türkisch, "sen" (Glossar Regel 1);
 * "Hoş geldin! Burası Tastenflow." - keine Endung an "Tastenflow" (Regel 6);
 * "Nereden başlamak istersin?" (§2.2), "Ses efektleri ve sesli okuma" (§2.8).
 */
const EINRICHTUNG_TITEL_TR: Record<EinrichtungStepId, string> = {
  willkommen: "Hoş geldin! Burası Tastenflow.",
  alter: "Metinler kimin için?",
  sprache: "Hangi dilde çalışmak istersin?",
  tastatur: "Önünde hangi klavye var?",
  start: "Nereden başlamak istersin?",
  ton: "Ses efektleri ve sesli okuma",
  podcast: "Kısaca: başlangıç için podcast",
  fertig: "Bitti: her şey hazır",
};

/**
 * ★ O-CS (03.10.2026): dieselben Titel auf Tschechisch, „ty" (Glossar Regel 1);
 * „Vítej v aplikaci Tastenflow" (Kopfwort vor dem Namen, Regel 12); „Odkud
 * začneš?" (§2.2: Zukunft ist ungegendert); „Hotovo: všechno je nastavené"
 * (das Adjektiv am Ding, nie am Kind).
 */
const EINRICHTUNG_TITEL_CS: Record<EinrichtungStepId, string> = {
  willkommen: "Vítej v aplikaci Tastenflow",
  alter: "Pro koho jsou texty?",
  sprache: "V jakém jazyce chceš cvičit?",
  tastatur: "Jakou klávesnici máš před sebou?",
  start: "Odkud začneš?",
  ton: "Zvuk a předčítání",
  podcast: "Krátce: podcast na začátek",
  fertig: "Hotovo: všechno je nastavené",
};

/**
 * ★ Das kurze Wort für die Aufzählung auf der Willkommens-Karte („… stellen
 * wir das Programm auf dich ein: Sprache, Tastatur, Ton und Vorlesen").
 *
 * ⚠️ Sie wird seit B11 (11.09.2026) AUS DER SCHRITTFOLGE gebaut und nicht mehr
 * fest hingeschrieben: Für ein Kind einer Klasse entfällt „Alter der Texte"
 * ganz, und ein Satz, der einen Schritt ankündigt, den es nicht gibt, ist
 * schlimmer als keiner - er lässt ein Kind auf etwas warten, das nie kommt.
 */
export const EINRICHTUNG_KURZ: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "Alter der Texte",
  sprache: "Sprache",
  tastatur: "Tastatur",
  start: "Womit du anfängst",
  ton: "Ton und Vorlesen",
  podcast: "Podcast",
  fertig: "",
};

const EINRICHTUNG_KURZ_EN: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "the age of your texts",
  sprache: "language",
  tastatur: "keyboard",
  start: "where you start",
  ton: "sound and reading aloud",
  podcast: "podcast",
  fertig: "",
};

/** ★ E11a-4 (26.09.2026): dasselbe kurze Wort auf Französisch. */
const EINRICHTUNG_KURZ_FR: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "l'âge des textes",
  sprache: "la langue",
  tastatur: "le clavier",
  start: "par où tu commences",
  ton: "le son et la lecture à voix haute",
  podcast: "le podcast",
  fertig: "",
};

/** ★ ES-O (27.09.2026): dasselbe kurze Wort auf Spanisch. */
const EINRICHTUNG_KURZ_ES: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "la edad de los textos",
  sprache: "el idioma",
  tastatur: "el teclado",
  start: "por dónde empiezas",
  ton: "el sonido y la lectura en voz alta",
  podcast: "el pódcast",
  fertig: "",
};

/** ★ O-IT (02.10.2026): dasselbe kurze Wort auf Italienisch. */
const EINRICHTUNG_KURZ_IT: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "l'età dei testi",
  sprache: "la lingua",
  tastatur: "la tastiera",
  start: "da dove inizi",
  ton: "il suono e la lettura ad alta voce",
  podcast: "il podcast",
  fertig: "",
};

/**
 * ★ O-PL (02.10.2026): dasselbe kurze Wort auf Polnisch - im Nominativ, denn
 * es steht nach einem Doppelpunkt („… ustawimy program dla ciebie: wiek
 * tekstów, język, klawiatura i dźwięk").
 */
const EINRICHTUNG_KURZ_PL: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "wiek tekstów",
  sprache: "język",
  tastatur: "klawiatura",
  start: "punkt startowy",
  ton: "dźwięk i czytanie na głos",
  podcast: "podcast",
  fertig: "",
};

/**
 * ★ O-TR (02.10.2026): dasselbe kurze Wort auf Türkisch - nach einem
 * Doppelpunkt, ohne Endung ("... programı sana göre ayarlıyoruz: metinlerin
 * yaşı, dil, klavye ve başlangıç noktası").
 */
const EINRICHTUNG_KURZ_TR: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "metinlerin yaşı",
  sprache: "dil",
  tastatur: "klavye",
  start: "başlangıç noktası",
  ton: "ses efektleri ve sesli okuma",
  podcast: "podcast",
  fertig: "",
};

/**
 * ★ O-CS (03.10.2026): dasselbe kurze Wort auf Tschechisch - nach einem
 * Doppelpunkt im Nominativ („... nastavíme program: věk textů, jazyk,
 * klávesnice a výchozí bod").
 */
const EINRICHTUNG_KURZ_CS: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "věk textů",
  sprache: "jazyk",
  tastatur: "klávesnice",
  start: "výchozí bod",
  ton: "zvuk a předčítání",
  podcast: "podcast",
  fertig: "",
};

/**
 * ★ O2-LIB (30.10.2026): dasselbe kurze Wort bulgarisch - nach einem Doppelpunkt im Grundform
 * („... настройваме програмата за теб: език, клавиатура, начална точка и звук").
 */
const EINRICHTUNG_KURZ_BG: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "възрастта на текстовете",
  sprache: "език",
  tastatur: "клавиатура",
  start: "начална точка",
  ton: "звук и четене на глас",
  podcast: "подкаст",
  fertig: "",
};

/**
 * ★ O-EL-LIB (30.10.2026): dasselbe kurze Wort griechisch - Nennform, die nach einem Doppelpunkt
 * steht («... ρυθμίζουμε το πρόγραμμα: ηλικία κειμένων, γλώσσα, πληκτρολόγιο ...»); ohne Anführungszeichen.
 */
const EINRICHTUNG_KURZ_EL: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "ηλικία κειμένων",
  sprache: "γλώσσα",
  tastatur: "πληκτρολόγιο",
  start: "σημείο εκκίνησης",
  ton: "ήχος και εκφώνηση",
  podcast: "podcast",
  fertig: "",
};

/**
 * ★ O2-LIB (30.10.2026): dasselbe kurze Wort ungarisch - Hauptwörter im Nominativ
 * nach dem Doppelpunkt („... a program beállítása: a szövegek életkora, nyelv, ...").
 */
const EINRICHTUNG_KURZ_HU: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "a szövegek életkora",
  sprache: "nyelv",
  tastatur: "billentyűzet",
  start: "kiindulópont",
  ton: "hang és felolvasás",
  podcast: "podcast",
  fertig: "",
};

/**
 * ★ O2-LIB (29.10.2026): dasselbe kurze Wort auf Niederländisch - Hauptwörter ohne Artikel,
 * damit die Aufzählung nach dem Doppelpunkt trägt ("... stellen we de app voor je in: ...").
 */
const EINRICHTUNG_KURZ_NL: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "leeftijd van de teksten",
  sprache: "taal",
  tastatur: "toetsenbord",
  start: "startpunt",
  ton: "geluid en voorlezen",
  podcast: "podcast",
  fertig: "",
};

/**
 * ★ O-LIB (30.10.2026): a mesma palavra curta em português - depois dos dois pontos, no singular ou em
 * grupo nominal ("... ajustamos o programa para ti: a idade dos textos, língua, teclado e ponto de partida").
 */
const EINRICHTUNG_KURZ_PT: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "a idade dos textos",
  sprache: "língua",
  tastatur: "teclado",
  start: "ponto de partida",
  ton: "som e leitura em voz alta",
  podcast: "podcast",
  fertig: "",
};

/**
 * ★ O2-LIB (29.10.2026): dasselbe kurze Wort, Portugiesisch (Brasilien) - nach einem
 * Doppelpunkt ("Vamos configurar o programa para você: idade dos textos, idioma, ...").
 */
const EINRICHTUNG_KURZ_BR: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "idade dos textos",
  sprache: "idioma",
  tastatur: "teclado",
  start: "ponto de partida",
  ton: "som e leitura em voz alta",
  podcast: "podcast",
  fertig: "",
};

/**
 * ★ O2-LIB (29.10.2026): dasselbe kurze Wort auf Rumänisch - nach einem Doppelpunkt
 * im Nominativ („… vârsta textelor, limba, tastatura și punctul de plecare“).
 */
const EINRICHTUNG_KURZ_RO: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "vârsta textelor",
  sprache: "limba",
  tastatur: "tastatura",
  start: "punctul de plecare",
  ton: "sunetul și citirea cu voce tare",
  podcast: "podcast",
  fertig: "",
};

/**
 * ★ O2-LIB (30.10.2026): dasselbe kurze Wort auf Schwedisch - Hauptwörter ohne Artikel, damit die
 * Aufzählung nach dem Doppelpunkt trägt ("... ställer vi in programmet: texternas ålder, språk, ...").
 */
const EINRICHTUNG_KURZ_SV: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "texternas ålder",
  sprache: "språk",
  tastatur: "tangentbord",
  start: "startpunkt",
  ton: "ljud och uppläsning",
  podcast: "podcast",
  fertig: "",
};

/**
 * ★ O2-LIB (30.10.2026): dasselbe kurze Wort ukrainisch - nach einem Doppelpunkt im Nominativ
 * („... налаштуємо програму: вік текстів, мова, клавіатура та точка старту").
 */
const EINRICHTUNG_KURZ_UK: Record<EinrichtungStepId, string> = {
  willkommen: "",
  alter: "вік текстів",
  sprache: "мова",
  tastatur: "клавіатура",
  start: "точка старту",
  ton: "звук і читання вголос",
  podcast: "подкаст",
  fertig: "",
};

/** ★ ES-O: eine Tabelle statt der Weiche (Falle 30 - „es" bekam sonst Deutsch). */
const EINRICHTUNG_KURZ_JE_SPRACHE: Record<BedienSprache, Record<EinrichtungStepId, string>> = {
  de: EINRICHTUNG_KURZ,
  en: EINRICHTUNG_KURZ_EN,
  fr: EINRICHTUNG_KURZ_FR,
  es: EINRICHTUNG_KURZ_ES,
  it: EINRICHTUNG_KURZ_IT,
  pl: EINRICHTUNG_KURZ_PL, // ★ O-PL
  tr: EINRICHTUNG_KURZ_TR, // ★ O-TR
  cs: EINRICHTUNG_KURZ_CS, // ★ O-CS (03.10.2026)
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: EINRICHTUNG_KURZ_BG,
  el: EINRICHTUNG_KURZ_EL,
  hu: EINRICHTUNG_KURZ_HU,
  nl: EINRICHTUNG_KURZ_NL,
  pt: EINRICHTUNG_KURZ_PT,
  br: EINRICHTUNG_KURZ_BR,
  ro: EINRICHTUNG_KURZ_RO,
  sv: EINRICHTUNG_KURZ_SV,
  uk: EINRICHTUNG_KURZ_UK,
};

/**
 * Die Aufzählung der Schritte dieser Lage - „Sprache, Tastatur und Ton".
 * ★ E11a-4 (26.09.2026): dritte Fassung statt der alten `=== "en"`-Weiche
 * (Falle 30) - sonst bekäme „fr" hier still das deutsche Wortmaterial.
 */
export function einrichtungAufzaehlung(
  lage: EinrichtungLage,
  sprache: BedienSprache = "de",
): string {
  const kurz = EINRICHTUNG_KURZ_JE_SPRACHE[sprache];
  const woerter = einrichtungSchritte(lage)
    .map((id) => kurz[id])
    .filter(Boolean);
  if (woerter.length === 0) return "";
  if (woerter.length === 1) return woerter[0];
  // ★ O2-LIB (30.10.2026): die neun Sprachen des Gerüsts mit eigenem Zweig - nie Englisch, nie Deutsch.
  if (sprache === "bg") {
    // ★ O2-LIB (30.10.2026): dieselbe Regel - trägt ein Glied schon ein „и", trennen Kommas.
    // Kein Komma vor „и" (Glossar: „a, b и c").
    if (woerter.some((w) => w.includes(" и "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} и ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "el") {
    // ★ O-EL-LIB (30.10.2026): dieselbe Regel - trägt ein Glied schon ein «και», trennen Kommas.
    if (woerter.some((w) => w.includes(" και "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} και ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "hu") {
    // ★ O2-LIB (30.10.2026): dieselbe Regel - trägt ein Glied schon ein „és", trennen Kommas.
    // Kein Komma vor „és" (Glossar §2.10 „a, b és c").
    if (woerter.some((w) => w.includes(" és "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} és ${woerter[woerter.length - 1]}`;
  }
  // ★ O2-LIB (29.10.2026): niederländisch - dieselbe Regel: trägt ein Glied schon ein "en", trennen Kommas. Kein Komma vor "en".
  if (sprache === "nl") {
  if (woerter.some((w) => w.includes(" en "))) return woerter.join(", ");
  return `${woerter.slice(0, -1).join(", ")} en ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "pt") {
    // ★ O-LIB (30.10.2026): a mesma regra - se um elemento já tiver um "e", separam-se com vírgulas.
    // Sem vírgula antes de "e" (Glossar §2.10 "a, b e c").
    if (woerter.some((w) => w.includes(" e "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} e ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "br") {
  // ★ O2-LIB (29.10.2026): dieselbe Regel - trägt ein Glied schon ein "e", trennen Kommas.
  // Kein Komma vor "e" (Glossar Regel 7: "a, b e c").
  if (woerter.some((w) => w.includes(" e "))) return woerter.join(", ");
  return `${woerter.slice(0, -1).join(", ")} e ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "ro") {
    // ★ O2-LIB (29.10.2026): dieselbe Regel - trägt ein Glied schon ein „și“, trennen Kommas.
    // Kein Komma vor „și“ (Glossar §2.10 „a, b și c“).
    if (woerter.some((w) => w.includes(" și "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} și ${woerter[woerter.length - 1]}`;
  }
  // ★ O2-LIB (30.10.2026): schwedisch - dieselbe Regel: trägt ein Glied schon ein "och", trennen Kommas. Kein Komma vor "och" (Glossar sv §2.10).
  if (sprache === "sv") {
  if (woerter.some((w) => w.includes(" och "))) return woerter.join(", ");
  return `${woerter.slice(0, -1).join(", ")} och ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "uk") {
    // ★ O2-LIB (30.10.2026): dieselbe Regel - trägt ein Glied schon ein „і", trennen Kommas.
    // Kein Komma vor „і" (Glossar §2.10 „а, б і в").
    if (woerter.some((w) => w.includes(" і "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} і ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "en") {
    // Dieselbe Regel wie unten: Trägt ein Glied selbst schon ein „and",
    // trennen Kommas sauberer als ein zweites.
    if (woerter.some((w) => w.includes(" and "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} and ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "fr") {
    // Dieselbe Regel wie bei „en"/„de": trägt ein Glied schon ein „et",
    // trennen Kommas sauberer als ein zweites.
    if (woerter.some((w) => w.includes(" et "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} et ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "cs") {
    // ★ O-CS (03.10.2026): dieselbe Regel - trägt ein Glied schon ein „a",
    // trennen Kommas. Kein Komma vor „a" (Glossar §2.10 „a, b a c").
    if (woerter.some((w) => w.includes(" a "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} a ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "tr") {
    // ★ O-TR: dieselbe Regel - trägt ein Glied schon ein "ve", trennen Kommas.
    // Kein Komma vor "ve" (Glossar §2.10 "a, b ve c").
    if (woerter.some((w) => w.includes(" ve "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} ve ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "pl") {
    // ★ O-PL: dieselbe Regel - trägt ein Glied schon ein „i", trennen Kommas.
    // Kein Komma vor „i" (Glossar §2.10 „Listen").
    if (woerter.some((w) => w.includes(" i "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} i ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "it") {
    // ★ O-IT: dieselbe Regel - trägt ein Glied schon ein „e", trennen Kommas.
    if (woerter.some((w) => w.includes(" e "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} e ${woerter[woerter.length - 1]}`;
  }
  if (sprache === "es") {
    // ★ ES-O: dieselbe Regel - trägt ein Glied schon ein „y", trennen Kommas.
    if (woerter.some((w) => w.includes(" y "))) return woerter.join(", ");
    return `${woerter.slice(0, -1).join(", ")} y ${woerter[woerter.length - 1]}`;
  }
  /*
    ⚠️ KEIN zweites „und" (Prüfer 11.09.2026, im Browser gemessen): Ein Kind
    einer Klasse bekommt die Schritte „Tastatur", „Ton und Vorlesen" und
    „Podcast" - mit dem gewöhnlichen Aufzählungs-„und" stand da „Tastatur, Ton
    und Vorlesen und Podcast". Trägt ein Glied selbst schon ein „und", trennen
    Kommas sauberer als ein zweites.
  */
  if (woerter.some((w) => w.includes(" und "))) return woerter.join(", ");
  return `${woerter.slice(0, -1).join(", ")} und ${woerter[woerter.length - 1]}`;
}

/** Beschriftung des Weiter-Knopfes je Schritt. */
export const EINRICHTUNG_WEITER: Record<EinrichtungStepId, string> = {
  willkommen: "Los geht's",
  alter: "Weiter",
  sprache: "Weiter",
  tastatur: "Weiter",
  start: "Weiter",
  ton: "Weiter",
  podcast: "Weiter",
  fertig: "Zur ersten Runde",
};

const EINRICHTUNG_WEITER_EN: Record<EinrichtungStepId, string> = {
  willkommen: "Let's go",
  alter: "Next",
  sprache: "Next",
  tastatur: "Next",
  start: "Next",
  ton: "Next",
  podcast: "Next",
  fertig: "Start the first round",
};

/** ★ E11a-4 (26.09.2026): derselbe Weiter-Knopf auf Französisch. */
const EINRICHTUNG_WEITER_FR: Record<EinrichtungStepId, string> = {
  willkommen: "C'est parti",
  alter: "Suivant",
  sprache: "Suivant",
  tastatur: "Suivant",
  start: "Suivant",
  ton: "Suivant",
  podcast: "Suivant",
  fertig: "Vers la première série",
};

/** ★ ES-O (27.09.2026): derselbe Weiter-Knopf auf Spanisch. */
const EINRICHTUNG_WEITER_ES: Record<EinrichtungStepId, string> = {
  willkommen: "Empezar",
  alter: "Siguiente",
  sprache: "Siguiente",
  tastatur: "Siguiente",
  start: "Siguiente",
  ton: "Siguiente",
  podcast: "Siguiente",
  fertig: "Ir a la primera serie",
};

/** ★ O-IT (02.10.2026): derselbe Weiter-Knopf auf Italienisch (Glossar Regel 10: „Avanti"). */
const EINRICHTUNG_WEITER_IT: Record<EinrichtungStepId, string> = {
  willkommen: "Iniziamo",
  alter: "Avanti",
  sprache: "Avanti",
  tastatur: "Avanti",
  start: "Avanti",
  ton: "Avanti",
  podcast: "Avanti",
  fertig: "Al primo giro",
};

/** ★ O-PL (02.10.2026): derselbe Weiter-Knopf auf Polnisch (Glossar Regel 12: „Dalej"; „Zacznij" statt „Start"). */
const EINRICHTUNG_WEITER_PL: Record<EinrichtungStepId, string> = {
  willkommen: "Zaczynamy",
  alter: "Dalej",
  sprache: "Dalej",
  tastatur: "Dalej",
  start: "Dalej",
  ton: "Dalej",
  podcast: "Dalej",
  fertig: "Do pierwszej rundy",
};

/** ★ O-TR (02.10.2026): derselbe Weiter-Knopf auf Türkisch (Glossar Regel 10: "İleri"). */
const EINRICHTUNG_WEITER_TR: Record<EinrichtungStepId, string> = {
  willkommen: "Başlayalım",
  alter: "İleri",
  sprache: "İleri",
  tastatur: "İleri",
  start: "İleri",
  ton: "İleri",
  podcast: "İleri",
  fertig: "İlk tura geç",
};

/** ★ O-CS (03.10.2026): derselbe Weiter-Knopf auf Tschechisch (Glossar Regel 10: „Další", „Začít" statt „Start"). */
const EINRICHTUNG_WEITER_CS: Record<EinrichtungStepId, string> = {
  willkommen: "Začít",
  alter: "Další",
  sprache: "Další",
  tastatur: "Další",
  start: "Další",
  ton: "Další",
  podcast: "Další",
  fertig: "K prvnímu kolu",
};

export const EINRICHTUNG_SKIP_LABEL = "Einrichtung überspringen";

/**
 * Alles lässt sich später ändern — dieser Satz steht in JEDEM Schritt. Er nimmt
 * die Angst vor der falschen Wahl, und er ist der Grund, warum die Einrichtung
 * ohne Rückfragen auskommt.
 */
// Backtick-Literal: der Satz enthält ein deutsches Anführungszeichen (…") — in
// einem doppelt gequoteten String beendete das " den Literal vorzeitig (die
// Falle, die am 07.08. dreimal zugeschlagen hat).
export const EINRICHTUNG_FUSSNOTE = `Alles lässt sich später jederzeit ändern - im Zahnrad „Einstellungen".`;

/** Ansage beim Start (Vorlesen/Screenreader). */
export function einrichtungStartAnsage(lage: EinrichtungLage): string {
  return `Einrichtung gestartet. Schritt 1 von ${einrichtungSchritte(lage).length}.`;
}

/** Ansage beim Überspringen. */
export const EINRICHTUNG_SKIP_ANSAGE =
  "Einrichtung übersprungen. Mit Alt und R kannst du sie jederzeit neu starten.";

/**
 * Die Zusammenfassung im letzten Schritt: knappe Paare aus Was und Gewählt.
 * Rein, damit der Wächter sie prüfen kann, ohne die Ansicht zu bauen.
 */
export interface EinrichtungZusammenfassung {
  was: string;
  gewaehlt: string;
}

/**
 * ★ E11a-4 (26.09.2026): dritte Fassung statt der alten binären `en`-Weiche
 * (Falle 30) - sonst bekäme „fr" hier still die deutschen Zeilennamen.
 */
// ★ O-TR (02.10.2026): die Weiche `sprache === "pl"` unten gilt auch für tr - "açık/kapalı" passt zu
// jeder Zeile (kein Geschlecht), tr nimmt `ANAUS` wie die anderen.
// ★ O-CS (03.10.2026): dasselbe gilt auch für cs - „zapnuto/vypnuto" (Neutrum ohne Bezug) passt zu
// „Zvuk" wie zu „Předčítání".
export function zusammenfassung(
  werte: {
    stufeLabel: string;
    sprachLabel: string;
    tastaturLabel: string;
    startLabel?: string;
    ton: boolean;
    vorlesen: boolean;
  },
  /** ★ EN2: die Sprache der Bedienung für die linke Spalte und „an/aus". */
  sprache: BedienSprache = "de",
): EinrichtungZusammenfassung[] {
  const WAS: Record<BedienSprache, Record<"texteFuer" | "sprache" | "tastatur" | "start" | "ton" | "vorlesen", string>> = {
    de: { texteFuer: "Texte für", sprache: "Sprache", tastatur: "Tastatur", start: "Start", ton: "Ton", vorlesen: "Vorlesen" },
    en: { texteFuer: "Texts for", sprache: "Language", tastatur: "Keyboard", start: "Starting point", ton: "Sound", vorlesen: "Read aloud" },
    fr: { texteFuer: "Textes pour", sprache: "Langue", tastatur: "Clavier", start: "Point de départ", ton: "Son", vorlesen: "Lecture à voix haute" },
    es: { texteFuer: "Textos para", sprache: "Idioma", tastatur: "Teclado", start: "Punto de partida", ton: "Sonido", vorlesen: "Lectura en voz alta" },
    it: { texteFuer: "Testi per", sprache: "Lingua", tastatur: "Tastiera", start: "Punto di partenza", ton: "Suono", vorlesen: "Lettura ad alta voce" },
    // ★ O-PL (02.10.2026): Glossar §2.5 „Teksty dla", §2.2 „punkt startowy", §2.8.
    pl: { texteFuer: "Teksty dla", sprache: "Język tekstów", tastatur: "Klawiatura", start: "Punkt startowy", ton: "Dźwięk", vorlesen: "Czytanie na głos" },
    // ★ O-TR (02.10.2026): Glossar §2.5 "Metinler: 7-10 yaş", "metinlerin dili", §2.2, §2.8.
    tr: { texteFuer: "Metinler", sprache: "Metinlerin dili", tastatur: "Klavye", start: "Başlangıç noktası", ton: "Ses efektleri", vorlesen: "Sesli okuma" },
    // ★ O-CS (03.10.2026): Glossar §2.5 „Texty pro věk", „jazyk textů", §2.2 „výchozí bod", §2.8.
    cs: { texteFuer: "Texty pro", sprache: "Jazyk textů", tastatur: "Klávesnice", start: "Výchozí bod", ton: "Zvuk", vorlesen: "Předčítání" },
    // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
    bg: { texteFuer: "Текстове за", sprache: "Език", tastatur: "Клавиатура", start: "Начална точка", ton: "Звук", vorlesen: "Четене на глас" },
    el: { texteFuer: "Κείμενα για", sprache: "Γλώσσα κειμένων", tastatur: "Πληκτρολόγιο", start: "Σημείο εκκίνησης", ton: "Ήχος", vorlesen: "Εκφώνηση" },
    hu: { texteFuer: "Szövegek korosztálya", sprache: "Szövegek nyelve", tastatur: "Billentyűzet", start: "Kiindulópont", ton: "Hang", vorlesen: "Felolvasás" },
    nl: { texteFuer: "Teksten voor", sprache: "Taal van de teksten", tastatur: "Toetsenbord", start: "Startpunt", ton: "Geluid", vorlesen: "Voorlezen" },
    pt: { texteFuer: "Textos para", sprache: "Língua", tastatur: "Teclado", start: "Ponto de partida", ton: "Som", vorlesen: "Leitura em voz alta" },
    br: { texteFuer: "Textos para", sprache: "Idioma dos textos", tastatur: "Teclado", start: "Ponto de partida", ton: "Som", vorlesen: "Leitura em voz alta" },
    ro: { texteFuer: "Texte pentru", sprache: "Limba textelor", tastatur: "Tastatura", start: "Punct de plecare", ton: "Sunet", vorlesen: "Citire cu voce tare" },
    sv: { texteFuer: "Texter för", sprache: "Språk för texterna", tastatur: "Tangentbord", start: "Startpunkt", ton: "Ljud", vorlesen: "Uppläsning" },
    uk: { texteFuer: "Тексти для", sprache: "Мова текстів", tastatur: "Розкладка", start: "Точка старту", ton: "Звук", vorlesen: "Читання вголос" },
  };
  const ANAUS: Record<BedienSprache, [string, string]> = {
    de: ["an", "aus"],
    en: ["on", "off"],
    fr: ["activé", "désactivé"],
    es: ["activado", "desactivado"],
    // ★ O-IT: „sì/no" wie im Glossar (§2.8 „Suono sì/no").
    it: ["sì", "no"],
    // ★ O-PL: Glossar §2.8 „Dźwięk: włączony / wyłączony" - die Form gehört zu
    // „dźwięk" (m.); für „Czytanie na głos" (n.) siehe `ANAUS_VORLESEN_PL`.
    pl: ["włączony", "wyłączony"],
    // ★ O-TR: Glossar §2.8 "Ses efektleri açık/kapalı".
    tr: ["açık", "kapalı"],
    // ★ O-CS (03.10.2026): Glossar §2.8 „vypnuto" - Neutrum ohne Bezug, passt zu jeder Zeile.
    cs: ["zapnuto", "vypnuto"],
    // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
    bg: ["вкл.", "изкл."],
    el: ["ενεργό", "ανενεργό"],
    hu: ["be", "ki"],
    nl: ["aan", "uit"],
    pt: ["ligado", "desligado"],
    br: ["ligado", "desligado"],
    ro: ["pornit", "oprit"],
    sv: ["på", "av"],
    uk: ["увімкнено", "вимкнено"],
  };
  const w = WAS[sprache];
  const anAus = (an: boolean) => (an ? ANAUS[sprache][0] : ANAUS[sprache][1]);
  const zeilen: EinrichtungZusammenfassung[] = [
    { was: w.texteFuer, gewaehlt: werte.stufeLabel },
    { was: w.sprache, gewaehlt: werte.sprachLabel },
    { was: w.tastatur, gewaehlt: werte.tastaturLabel },
  ];
  if (werte.startLabel) zeilen.push({ was: w.start, gewaehlt: werte.startLabel });
  zeilen.push({ was: w.ton, gewaehlt: anAus(werte.ton) });
  // ★ O-PL: „Czytanie na głos" ist sächlich - „włączone / wyłączone".
  const ANAUS_VORLESEN_PL: [string, string] = ["włączone", "wyłączone"];
  zeilen.push({
    was: w.vorlesen,
    gewaehlt: sprache === "pl" ? ANAUS_VORLESEN_PL[werte.vorlesen ? 0 : 1] : anAus(werte.vorlesen),
  });
  return zeilen;
}

/**
 * Die Alters-Auswahl mit einem Satz je Stufe — die reinen Altersspannen sagen
 * einer Lehrkraft nichts darüber, was sich dahinter ändert (Ton, Spiel, Texte).
 */
export const STUFEN_ERKLAERUNG: Record<Stufe, string> = {
  kids: "Verspielt, mit Pinguin und Eisschollen-Spiel nach jeder neuen Taste.",
  teens: "Auf Augenhöhe und trocken, ohne Belohnungs-Spiel - im Zahnrad ist das Eisschollen-Spiel zuschaltbar.",
  // ★ 19.09.2026: nicht mehr „per Sie" - ab 16 lesen Lernende „du" wie alle
  // anderen; gesiezt wird nur die Lehrkraft (`anredeFuer`, skin.ts). Der Ton
  // bleibt sachlich.
  erwachsen: "Sachlich und knapp, ohne Belohnungs-Spiel nach der neuen Taste.",
  // Die alten Werte stehen nur noch für gespeicherte Konten (Inhalte tragen sie
  // seit Charge S3 nicht mehr); wählen kann man sie nicht, STUFEN kennt sie
  // nicht. Sie zeigen darum den Text ihrer Nachfolgerin.
  a: "Verspielt, mit Pinguin und Eisschollen-Spiel nach jeder neuen Taste.",
  b: "Auf Augenhöhe und trocken, ohne Belohnungs-Spiel - im Zahnrad ist das Eisschollen-Spiel zuschaltbar.",
  c: "Auf Augenhöhe und trocken, ohne Belohnungs-Spiel - im Zahnrad ist das Eisschollen-Spiel zuschaltbar.",
};

/**
 * ★★★ DIE ERKLÄRUNG ZUM GEBURTSJAHR - und warum es seit 30.08.2026 zu einer
 * Anmeldung dazugehört (Johannes: „es ist wichtig dass die app mitwächst und
 * wenn jemand älter wird auch passende texte bekommt, erkläre das und es ist
 * bedingung für eine anmeldung").
 *
 * Der Gedanke, den dieser Satz tragen muss: **Eine von Hand gewählte Stufe
 * wächst nicht mit.** Wer mit neun „7 bis 9 Jahre" anklickt, bekommt mit zwölf
 * immer noch Texte für Siebenjährige - und merkt es nicht, weil nirgends
 * steht, dass die Wahl von damals noch gilt. Das Geburtsjahr ist die einzige
 * Angabe, aus der die App das von selbst richtig ableitet: `stufeFuer()`
 * rechnet sie bei JEDEM Aufruf neu aus dem Jahr aus (`lib/typing/account.ts`).
 *
 * Genau deshalb sind die vier Stufen-Schalter aus der Einrichtung
 * verschwunden. Sie waren nicht bloß überflüssig - sie waren die zweite
 * Stelle, die dem Jahr widerspricht, und im Vorrangmodell schlägt die Wahl das
 * Jahr [[feedback_zwei_stellen_die_voneinander_nichts_wissen]].
 *
 * Sprache: kurze Sätze, „du", kein Vorwurf. Der Text steht HIER und nicht in
 * den drei Oberflächen (Einrichtung, Zahnrad, Anmeldung), damit er nicht
 * dreimal auseinanderläuft.
 */
export const GEBURTSJAHR_ERKLAERUNG =
  "Die Texte passen sich deinem Alter an und wachsen mit dir mit. " +
  "Ohne dein Geburtsjahr kann die App das nicht: Sie weiß dann nicht, " +
  "wie alt du bist, und die Texte bleiben für immer so, wie sie am ersten " +
  "Tag waren.";

/**
 * ⚠️ NICHT MEHR „(freiwillig)" (30.08.2026). Wer sich selbst anmeldet, gibt das
 * Jahr an - siehe {@link GEBURTSJAHR_ERKLAERUNG}. Zwei Ausnahmen, und beide
 * sind keine Aufweichung:
 *   · Kinder MIT Lehrkraft setzen es nicht selbst; das tut die Lehrkraft in
 *     „Meine Klassen" (Server-Wächter `tt_pupils_field_guard`). Ihnen wird das
 *     Feld gar nicht erst gezeigt.
 *   · Gäste ohne Konto melden sich nicht an; bei ihnen bleibt es eine
 *     Einstellung dieses Geräts. Ohne Jahr gilt für sie die Vorgabe.
 */
export const GEBURTSJAHR_LABEL = "Geburtsjahr";

/**
 * ★★ EN2 (19.09.2026): ALLE Texte der Einrichtung in einer Sprache - die
 * deutschen sind genau die Konstanten oben (Tests und andere Aufrufer lesen
 * sie weiter direkt), die englischen stehen daneben.
 *
 * Die Erklärung zum Geburtsjahr trägt denselben Gedanken wie die deutsche
 * (siehe {@link GEBURTSJAHR_ERKLAERUNG}): Nur das Jahr lässt die Texte
 * mitwachsen - ohne es bleiben sie, wie sie am ersten Tag waren.
 */
export interface EinrichtungTexte {
  titel: Record<EinrichtungStepId, string>;
  weiter: Record<EinrichtungStepId, string>;
  skipLabel: string;
  skipAnsage: string;
  fussnote: string;
  geburtsjahrLabel: string;
  geburtsjahrErklaerung: string;
}

/**
 * ★ E11a-4 (26.09.2026): dritte Fassung statt der alten `=== "en"`-Weiche
 * (Falle 30) - sonst bekäme „fr" hier still Deutsch, und zwar für die ganze
 * Einrichtung: jeder Titel, jeder Weiter-Knopf, der Geburtsjahr-Text.
 */
export function einrichtungTexte(sprache: BedienSprache = "de"): EinrichtungTexte {
  // ★ NVDA-Lauf 31.10.2026: die neun neuen Sprachen fielen hier still auf Deutsch.
  const neun = EINRICHTUNG_TEXTE_NEUN[sprache];
  if (neun) return neun;
  // ★ O-CS (03.10.2026): tschechisch, „ty" (Glossar §2.5: úvodní nastavení, Přeskočit,
  // rok narození); ohne Vergangenheit 2. Person (Regel 2), Knopfname ohne Anführung (Regel 7).
  if (sprache === "cs")
    return {
      titel: EINRICHTUNG_TITEL_CS,
      weiter: EINRICHTUNG_WEITER_CS,
      skipLabel: "Přeskočit úvodní nastavení",
      skipAnsage: "Úvodní nastavení je přeskočené. Kdykoli ho můžeš spustit znovu klávesami Alt + R.",
      fussnote: "Všechno můžeš později kdykoli změnit - v Nastavení.",
      geburtsjahrLabel: "Rok narození",
      geburtsjahrErklaerung:
        "Texty se přizpůsobí tvému věku a rostou s tebou. Bez roku narození " +
        "to aplikace neumí: neví, kolik ti je let, a texty zůstanou navždy " +
        "takové jako první den.",
    };
  // ★ O-TR (02.10.2026): türkisch, "sen" (Glossar §2.5: kurulum, Atla, doğum yılı);
  // gerade Anführung um "Ayarlar" (Regel 7), keine Endung an "Alt + R" (Regel 6).
  if (sprache === "tr")
    return {
      titel: EINRICHTUNG_TITEL_TR,
      weiter: EINRICHTUNG_WEITER_TR,
      skipLabel: "Kurulumu atla",
      skipAnsage: "Kurulum atlandı. İstediğin zaman Alt + R ile yeniden başlatabilirsin.",
      fussnote: `Her şeyi daha sonra istediğin zaman değiştirebilirsin - "Ayarlar" bölümünde.`,
      geburtsjahrLabel: "Doğum yılı",
      geburtsjahrErklaerung:
        "Metinler yaşına uyar ve seninle birlikte büyür. Doğum yılın olmadan " +
        "program bunu yapamaz: kaç yaşında olduğunu bilmez ve metinler hep ilk " +
        "günkü gibi kalır.",
    };
  // ★ O-PL (02.10.2026): polnisch, „ty" (Glossar §2.5: konfiguracja, Pomiń konfigurację,
  // rok urodzenia); Fussnote mit „…” (Regel 8). Ohne Vergangenheit 2. Person (Regel 2).
  if (sprache === "pl")
    return {
      titel: EINRICHTUNG_TITEL_PL,
      weiter: EINRICHTUNG_WEITER_PL,
      skipLabel: "Pomiń konfigurację",
      skipAnsage: "Konfigurację pominięto. Możesz ją uruchomić ponownie w każdej chwili skrótem Alt + R.",
      fussnote: "Wszystko można później zmienić w każdej chwili - w „Ustawieniach”.",
      geburtsjahrLabel: "Rok urodzenia",
      geburtsjahrErklaerung:
        "Teksty dopasowują się do twojego wieku i rosną razem z tobą. Bez roku " +
        "urodzenia program tego nie potrafi: nie wie, ile masz lat, i teksty " +
        "zostają na zawsze takie jak pierwszego dnia.",
    };
  // ★ O-IT (02.10.2026): italienisch, „tu" (Glossar: configurazione, Salta la configurazione).
  if (sprache === "it")
    return {
      titel: EINRICHTUNG_TITEL_IT,
      weiter: EINRICHTUNG_WEITER_IT,
      skipLabel: "Salta la configurazione",
      skipAnsage: "Configurazione saltata. Puoi ricominciarla quando vuoi con Alt e R.",
      fussnote: `Puoi cambiare tutto più tardi, in qualsiasi momento - in "Impostazioni".`,
      geburtsjahrLabel: "Anno di nascita",
      geburtsjahrErklaerung:
        "I testi si adattano alla tua età e crescono con te. Senza il tuo anno di " +
        "nascita l'app non può farlo: non sa quanti anni hai, e i testi restano per " +
        "sempre come il primo giorno.",
    };
  if (sprache === "en")
    return {
      titel: EINRICHTUNG_TITEL_EN,
      weiter: EINRICHTUNG_WEITER_EN,
      skipLabel: "Skip the setup",
      skipAnsage: "Setup skipped. You can start it again any time with Alt and R.",
      fussnote: "You can change everything later at any time - under “Settings”.",
      geburtsjahrLabel: "Year of birth",
      geburtsjahrErklaerung:
        "The texts match your age and grow up with you. Without your year " +
        "of birth the app can't do that: it doesn't know how old you are, and " +
        "the texts stay exactly as they were on the first day, for good.",
    };
  if (sprache === "fr")
    return {
      titel: EINRICHTUNG_TITEL_FR,
      weiter: EINRICHTUNG_WEITER_FR,
      skipLabel: "Passer la configuration",
      skipAnsage: "Configuration passée. Tu peux la relancer à tout moment avec Alt et R.",
      fussnote: "Tout peut être modifié plus tard, à tout moment - dans les \"Réglages\".",
      geburtsjahrLabel: "Année de naissance",
      geburtsjahrErklaerung:
        "Les textes s'adaptent à ton âge et grandissent avec toi. Sans ton " +
        "année de naissance, l'application ne peut pas le faire : elle ne sait pas " +
        "quel âge tu as, et les textes restent pour toujours comme au premier " +
        "jour.",
    };
  if (sprache === "es")
    return {
      titel: EINRICHTUNG_TITEL_ES,
      weiter: EINRICHTUNG_WEITER_ES,
      skipLabel: "Saltar la configuración",
      skipAnsage: "Configuración saltada. Puedes volver a empezarla cuando quieras con Alt y R.",
      fussnote: "Todo se puede cambiar más tarde, en cualquier momento - en \"Configuración\".",
      geburtsjahrLabel: "Año de nacimiento",
      geburtsjahrErklaerung:
        "Los textos se adaptan a tu edad y crecen contigo. Sin tu año de " +
        "nacimiento la aplicación no puede hacerlo: no sabe cuántos años tienes, " +
        "y los textos se quedan para siempre como el primer día.",
    };
  return {
    titel: EINRICHTUNG_TITEL,
    weiter: EINRICHTUNG_WEITER,
    skipLabel: EINRICHTUNG_SKIP_LABEL,
    skipAnsage: EINRICHTUNG_SKIP_ANSAGE,
    fussnote: EINRICHTUNG_FUSSNOTE,
    geburtsjahrLabel: GEBURTSJAHR_LABEL,
    geburtsjahrErklaerung: GEBURTSJAHR_ERKLAERUNG,
  };
}
