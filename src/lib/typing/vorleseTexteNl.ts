/**
 * ★ F58 (29.10.2026): die Ansagen der Sprachausgabe auf Niederländisch (Weg „nl") - nach Glossar
 * `recherche-niederländisch-2026-10-25/GLOSSAR-nl.md`; ⚠️ Lese-Abnahme durch eine Person mit Niederländisch als Erstsprache steht aus.
 *
 * Ton: je/jij, kurze Sätze für Stimme UND Braillezeile (Glossar §1 Regel 1); Schalter mit „aan/uit" (Infinitiv-/Zustandsstil, §2.8);
 * ohne Geschlecht des Kindes (Regel 2); nur Bindestrich; nie ein Punkt direkt hinter einer Zahl (Regel 7/8) - „van" statt Schrägstrich,
 * Komma hinter der Gesamtzahl.
 */
import type { VorleseTexteNeun } from "./vorleseTexteNeun";

/** Einzahl/Mehrzahl: Niederländisch kennt nur one/other (Glossar §2.11). */
function mz(n: number, eins: string, viele: string): string {
  return n === 1 ? eins : viele;
}

function gross(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const VORLESE_TEXTE_NL: VorleseTexteNeun = {
  ansagen: {
    // --- Vorlesen selbst ---
    // Glossar §2.8: „Voorlezen" (Schalter), „leest: woorden · zinnen".
    vorlesenAn: "Voorlezen aan.",
    vorlesenAnMitFeldern: "Voorlezen aan. Hieronder: letters, woorden, zinnen, snelheid en stem.",
    vorlesenAus: "Voorlezen uit. De instellingen eronder zijn weg.",
    woerterAn: "Woorden voorlezen aan.",
    woerterAus: "Woorden voorlezen uit.",
    saetzeAn: "Zinnen voorlezen aan.",
    saetzeAus: "Zinnen voorlezen uit.",
    tempoProbe: "Zo snel lees ik nu voor.",
    stimmeProbe: "Hallo! Zo klinkt deze stem.",

    // --- Inhaltswechsel mitten in der Runde ---
    jetztEchteWoerter: "Let op, nu echte woorden.",
    jetztUnsinnwoerter: "Let op, nu nonsenswoorden.",
    jetztZahlen: "Let op, nu cijfers.", // Glossar §2.1: cijfer (Ziffer)

    // --- Ton und Anzeige ---
    tonAn: "Geluid aan.", // Glossar §2.8: Geluid
    tonAus: "Geluid uit.",
    tippKlickAn: "Toetsklik aan.", // Glossar §2.8: toetsklik
    tippKlickAus: "Toetsklik uit.",
    melodieAn: "Melodie aan. Ze speelt in het rechteroor.",
    melodieAus: "Melodie uit.",
    fingerFarbenAn: "Vingerkleuren: aan.", // Glossar §2.8: vingerkleuren
    fingerFarbenAus: "Vingerkleuren: uit.",
    kleinsteGroesse: "Kleinste grootte bereikt.",
    groessteGroesse: "Grootste grootte bereikt.",
    zeitLassenAn: "Snelheid telt niet: aan.", // Glossar §2.2
    zeitLassenAus: "Snelheid telt niet: uit.",
    einhandAn: "Met één hand typen: aan.", // Glossar §2.1
    einhandAus: "Met één hand typen: uit.",

    // --- Bereiche und Wege ---
    einstellungenGeoeffnet: "Instellingen geopend.",
    einstellungenGeschlossen: "Instellingen gesloten.",
    statistik: "Mijn voortgang. Jouw medailles.", // Glossar §2.6, §2.4
    podcastGeoeffnet: "Introductiepodcast geopend.",
    eisschollenSpiel: "IJsschotsenspel.", // Glossar §2.3, Regel 10: IJ groot
    abgemeldet: "Je bent uitgelogd.", // Glossar §2.5
    passwortGeaendert: "Wachtwoord gewijzigd.",
    wirdGesendet: "Bezig met verzenden...",
    kontoErstellen: "Account aanmaken: naam, e-mailadres, wachtwoord, herhaling.",
    anmelden: "Inloggen: e-mailadres, wachtwoord.",
    belohnungKeins: "Beloningsspel: geen.", // Glossar §2.3, §2.12

    // --- Übungsarten ---
    modusAdaptiv: "Mijn training.",
    modusBuecherei: "Verhalen en weetjes.",
    modusWortspiele: "Woordspelletjes.",

    // --- Zeit und Fortschritt ---
    letzteZeile: "Laatste regel.", // Glossar §2.2 (regel = Übungszeile)
  },

  // Glossar §2.5: „Stap 2 van 7"; Doppelpunkt statt Punkt hinter der Zahl.
  schritt: (nummer, gesamt, titel) => `Stap ${nummer} van ${gesamt}: ${titel}`,

  tastatur: (kurz) => `Toetsenbord: ${kurz}.`, // Glossar §2.1

  start: (label) => `Startpunkt: ${label}.`, // Glossar §2.2

  // Glossar §2.5/Regel 12: Name nach „als", nie gebeugt.
  angemeldet: (name) => `Ingelogd als ${name}.`,

  belohnungsspiel: (label) => `Beloningsspel: ${label}.`,

  // Glossar §2.12: „Regel 3 van 12, nog 9 regels" · „laatste regel" · „Vraag 5 van 6, nog 1 vraag".
  // Komma hinter der Gesamtzahl; Verb nötig ist hier nicht, nur das Hauptwort in der richtigen Zahl.
  stand: (aktuell, gesamt, art) => {
    const eins = art === "zeile" ? "regel" : "vraag";
    const viele = art === "zeile" ? "regels" : "vragen";
    const rest = Math.max(0, gesamt - aktuell);
    const schwanz = rest > 0 ? `nog ${rest} ${mz(rest, eins, viele)}.` : `laatste ${eins}.`;
    return `${gross(eins)} ${aktuell} van ${gesamt}, ${schwanz}`;
  },

  // Glossar §2.2: „oefentijd".
  uebezeit: (zeit) => `Oefentijd: ${zeit}`,

  // Ohne Geschlecht („Het gaat steeds beter"); Glossar §2.2 „niveau"; höchstens ein Ausrufezeichen.
  aufstieg: (sober) =>
    sober ? "Naar het volgende niveau: volgend oefenniveau. " : "Een niveau hoger! Het gaat steeds beter. ",

  // Glossar §2.4: „medaille"; Name nach Doppelpunkt; „en nog 2" ohne Hauptwort hinter der Zahl.
  neueAbzeichen: (namen, gesamt, rest, ende) => {
    const kopf = gesamt === 1 ? "Nieuwe medaille: " : "Nieuwe medailles: ";
    // F58-Abnahme: ein Hauptwort hinter der Zahl - „… 3." am Ende wäre eine Ordnungszahl (Wächter F58 §7).
    const mehr = rest > 0 ? ` en nog ${rest} ${rest === 1 ? "medaille" : "medailles"}` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  },

  // Glossar Regel 6 und §2.12: „Nauwkeurigheid: 95%, snelheid: 120 aanslagen per minuut."
  werte: (treffsicherheit, tempo) =>
    ` Nauwkeurigheid: ${treffsicherheit}, snelheid: ${tempo} ${mz(tempo, "aanslag", "aanslagen")} per minuut.`,

  // Glossar §2.9/Regel 12: Tastenname nie gebeugt, mit Bindestrich („Shift-toets"); Caps Lock mit Kopfwort.
  umschaltSeite: (zeichenName, seiteLinks) =>
    `Bijna! ${gross(zeichenName)} heeft de ${seiteLinks ? "linker" : "rechter"} Shift-toets nodig, ` +
    "niet de andere en niet de toets Caps Lock.",
};
