/**
 * ★ F58 (29.10.2026): die Ansagen der Sprachausgabe auf Schwedisch (Weg „sv") - nach Glossar
 * `recherche-schwedisch-2026-10-25/GLOSSAR-sv.md`; ⚠️ Lese-Abnahme durch eine Person mit Schwedisch als Erstsprache steht aus.
 *
 * Entscheidungen:
 * - du für alle (Glossar Regel 1), kurze Sätze, höchstens ein Ausrufezeichen.
 * - Schalter: „Ljud: på." / „Ljud: av." (Doppelpunkt-Muster wie cs, Glossar §2.12).
 * - Zahl nie mit Punkt (Glossar Regel 6): „Steg 2 av 5: Titel", „Rad 3 av 12, 9 rader kvar." (Komma hinter der Gesamtzahl).
 * - Tastennamen ungebeugt (Regel 12, §2.9): „Skift", „Caps Lock"; mit Kopfwort „tangenten".
 * - Abzeichen = „märke" (§2.4), Treffsicherheit = „träffsäkerhet", Tempo = „hastighet", Anschlag = „anslag" (§2.2, Regel 7).
 * - Mehrzahl: sv kennt nur one/other (§2.11); das Verb ändert sich nicht.
 */
import type { VorleseTexteNeun } from "./vorleseTexteNeun";

export const VORLESE_TEXTE_SV: VorleseTexteNeun = {
  ansagen: {
    // --- Vorlesen selbst ---
    // Glossar §2.8: Schalter „Uppläsning", „talhastighet", „röst".
    vorlesenAn: "Uppläsning: på.",
    vorlesenAnMitFeldern:
      "Uppläsning: på. Under den: ord, meningar, tangent för tangent, talhastighet och röst.",
    vorlesenAus: "Uppläsning: av. Inställningarna under den är borta.",
    woerterAn: "Läsa upp ord: på.",
    woerterAus: "Läsa upp ord: av.",
    saetzeAn: "Läsa upp meningar: på.",
    saetzeAus: "Läsa upp meningar: av.",
    tempoProbe: "Så snabbt läser jag nu.",
    stimmeProbe: "Hej! Så här låter den här rösten.",

    // --- Inhaltswechsel mitten in der Runde ---
    jetztEchteWoerter: "Observera, nu riktiga ord.",
    jetztUnsinnwoerter: "Observera, nu påhittade ord.",
    jetztZahlen: "Observera, nu siffror.",

    // --- Ton und Anzeige ---
    tonAn: "Ljud: på.",
    tonAus: "Ljud: av.",
    tippKlickAn: "Tangentklick: på.",
    tippKlickAus: "Tangentklick: av.",
    melodieAn: "Melodi: på. Den spelas i höger öra.",
    melodieAus: "Melodi: av.",
    fingerFarbenAn: "Fingerfärger: på.",
    fingerFarbenAus: "Fingerfärger: av.",
    kleinsteGroesse: "Det här är den minsta storleken.",
    groessteGroesse: "Det här är den största storleken.",
    // Glossar §2.2: „I lugn och ro" (Zeit lassen).
    zeitLassenAn: "I lugn och ro: på.",
    zeitLassenAus: "I lugn och ro: av.",
    einhandAn: "Skriva med en hand: på.",
    einhandAus: "Skriva med en hand: av.",

    // --- Bereiche und Wege ---
    einstellungenGeoeffnet: "Inställningarna är öppna.",
    einstellungenGeschlossen: "Inställningarna är stängda.",
    statistik: "Mina framsteg. Dina märken.",
    podcastGeoeffnet: "Introduktionspodden är öppen.",
    eisschollenSpiel: "Isflaken.",
    abgemeldet: "Du är utloggad.",
    passwortGeaendert: "Lösenordet är ändrat.",
    wirdGesendet: "Skickar...",
    kontoErstellen: "Skapa konto: namn, e-postadress, lösenord, lösenord igen.",
    anmelden: "Logga in: e-postadress, lösenord.",
    belohnungKeins: "Belöningsspel: inget.",

    // --- Übungsarten ---
    modusAdaptiv: "Min träning.",
    modusBuecherei: "Berättelser och fakta.",
    modusWortspiele: "Ordlekar.",

    // --- Zeit und Fortschritt ---
    letzteZeile: "Sista raden.",
  },

  // Doppelpunkt statt Punkt hinter der Gesamtzahl (Regel 6), „Steg" nach Glossar §2.5.
  schritt: (nummer, gesamt, titel) => `Steg ${nummer} av ${gesamt}: ${titel}`,

  tastatur: (kurz) => `Tangentbord: ${kurz}.`,

  start: (label) => `Startpunkt: ${label}.`,

  // Name nach Doppelpunkt, nie gebeugt (Regel 13); Partizip „inloggad" ist neutral (Regel 3).
  angemeldet: (name) => `Inloggad som: ${name}.`,

  belohnungsspiel: (label) => `Belöningsspel: ${label}.`,

  // „Rad 3 av 12, 9 rader kvar." - Komma hinter der Gesamtzahl; Verb unverändert (§2.11).
  // Aufgabe = „uppgift" (§2.2/§2.12), nie „läxa".
  stand: (aktuell, gesamt, art) => {
    const [eins, viele, letzte] =
      art === "zeile"
        ? (["rad", "rader", "sista raden"] as const)
        : (["uppgift", "uppgifter", "sista uppgiften"] as const);
    const rest = Math.max(0, gesamt - aktuell);
    const kopf = `${eins[0].toUpperCase()}${eins.slice(1)} ${aktuell} av ${gesamt}`;
    const schwanz = rest > 0 ? `${rest} ${rest === 1 ? eins : viele} kvar.` : `${letzte}.`;
    return `${kopf}, ${schwanz}`;
  },

  uebezeit: (zeit) => `Övningstid: ${zeit}`,

  // Präsens, kein „kommer att" (Regel 2); „Du blir bättre och bättre" verrät kein Geschlecht.
  aufstieg: (sober) =>
    sober ? "Ny nivå: nästa övningsnivå. " : "Ny nivå! Du blir bättre och bättre. ",

  // Glossar §2.4: „märke" (ett-Wort: märke / märken); Name nach Doppelpunkt, „och 2 till".
  neueAbzeichen: (namen, gesamt, rest, ende) => {
    if (!namen.length) return "";
    const kopf = gesamt === 1 ? "Nytt märke: " : "Nya märken: ";
    const mehr = rest > 0 ? ` och ${rest} till` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  },

  // Glossar Regel 7: „anslag per minut" ausgeschrieben; Satz endet auf dem Wort, nicht auf der Zahl.
  // Der Wert kommt fertig als „95 %" (U+00A0), Glossar Regel 6.
  werte: (treffsicherheit, tempo) =>
    ` Träffsäkerhet: ${treffsicherheit}, hastighet: ${tempo} anslag per minut.`,

  // Glossar §2.9/Regel 12: Tastenname ungebeugt, darum mit Kopfwort „tangenten Skift";
  // Satzanfang gross („stort A" ⇒ „Stort A").
  umschaltSeite: (zeichenName, seiteLinks) =>
    `Nästan! ${zeichenName.slice(0, 1).toUpperCase()}${zeichenName.slice(1)} behöver ` +
    `tangenten Skift till ${seiteLinks ? "vänster" : "höger"}, inte den andra och inte Caps Lock.`,
};
