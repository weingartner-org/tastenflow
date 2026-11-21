/**
 * ★ F58 (29.10.2026): die Ansagen der Sprachausgabe auf Ungarisch (Weg „hu") - nach Glossar
 * `recherche-ungarisch-2026-10-25/GLOSSAR-hu.md`; ⚠️ Lese-Abnahme durch eine Person mit Ungarisch als Erstsprache steht aus.
 *
 * Grundsätze (Glossar §1): Kinder werden geduzt (te), kurze Sätze für Stimme UND Braillezeile. Nach einer Zahl steht das Hauptwort in der
 * EINZAHL („9 sor", „120 leütés", Regel 13) - darum braucht diese Datei kein `mehrzahl`. Namen, Zahlen und Tastennamen bekommen keine
 * Endung (Regel 11/12): Name nach Doppelpunkt, Tasten immer mit dem Kopfwort „billentyű". Im Ungarischen ist „7." immer die
 * Ordnungszahl („hetedik", §4 Falle 4): hinter einer Zahl steht nie ein Punkt - `schritt` und `stand` setzen Doppelpunkt/Komma, und die
 * Hilfsfunktion `abschluss` lässt den Schlusspunkt weg, wenn ein eingesetzter Wert auf eine Ziffer endet.
 */
import type { VorleseTexteNeun } from "./vorleseTexteNeun";

/** Schlusspunkt nur, wenn der Satz nicht auf eine Ziffer endet (sonst läse die Stimme die Ordnungszahl, §4 Falle 4). */
function abschluss(satz: string): string {
  return /\d$/.test(satz) ? satz : `${satz}.`;
}

/** Erster Buchstabe gross (Satzanfang), der Rest bleibt. */
function gross(text: string): string {
  return text.length === 0 ? text : text.slice(0, 1).toLocaleUpperCase("hu") + text.slice(1);
}

export const VORLESE_TEXTE_HU: VorleseTexteNeun = {
  ansagen: {
    // --- Vorlesen selbst --- (Glossar §2.8: Felolvasás, beszédtempó, hang; Schalter mit „bekapcsolva/kikapcsolva")
    vorlesenAn: "Felolvasás: bekapcsolva.",
    vorlesenAnMitFeldern:
      "Felolvasás: bekapcsolva. Alatta: szavak, mondatok, billentyűről billentyűre, beszédtempó és hang.",
    vorlesenAus: "Felolvasás: kikapcsolva. Az alatta lévő beállítások eltűntek.",
    woerterAn: "Szavak felolvasása: bekapcsolva.",
    woerterAus: "Szavak felolvasása: kikapcsolva.",
    saetzeAn: "Mondatok felolvasása: bekapcsolva.",
    saetzeAus: "Mondatok felolvasása: kikapcsolva.",
    tempoProbe: "Most ilyen gyorsan olvasok fel.",
    stimmeProbe: "Szia! Így hangzik ez a hang.",

    // --- Inhaltswechsel mitten in der Runde ---
    jetztEchteWoerter: "Figyelem, most igazi szavak.",
    jetztUnsinnwoerter: "Figyelem, most értelmetlen szavak.",
    jetztZahlen: "Figyelem, most számok.",

    // --- Ton und Anzeige --- (Glossar §2.8: billentyűkattogás für Tipp-Klick, ujjszínek)
    tonAn: "Hang: bekapcsolva.",
    tonAus: "Hang: kikapcsolva.",
    tippKlickAn: "Billentyűkattogás: bekapcsolva.",
    tippKlickAus: "Billentyűkattogás: kikapcsolva.",
    melodieAn: "Dallam: bekapcsolva. A jobb fülben szól.",
    melodieAus: "Dallam: kikapcsolva.",
    fingerFarbenAn: "Ujjszínek: bekapcsolva.",
    fingerFarbenAus: "Ujjszínek: kikapcsolva.",
    kleinsteGroesse: "Ez a legkisebb méret.",
    groessteGroesse: "Ez a legnagyobb méret.",
    // Glossar §2.2: Zeit lassen = Nyugodtan
    zeitLassenAn: "Nyugodtan: bekapcsolva.",
    zeitLassenAus: "Nyugodtan: kikapcsolva.",
    einhandAn: "Gépelés egy kézzel: bekapcsolva.",
    einhandAus: "Gépelés egy kézzel: kikapcsolva.",

    // --- Bereiche und Wege ---
    einstellungenGeoeffnet: "Beállítások megnyitva.",
    einstellungenGeschlossen: "Beállítások bezárva.",
    // Glossar §2.6: Meine Statistik = Fejlődésem; §2.4: jelvény
    statistik: "Fejlődésem. A jelvényeid.",
    podcastGeoeffnet: "Bemutató podcast megnyitva.",
    // Glossar §2.3: Eisschollen-Spiel = Jégtáblák
    eisschollenSpiel: "Jégtáblák.",
    // Glossar §2.5: „Sikeres kijelentkezés." (keine Vergangenheit der 2. Person nötig)
    abgemeldet: "Sikeres kijelentkezés.",
    passwortGeaendert: "A jelszó megváltozott.",
    // Drei Punkte nur, weil DE „…" hat; kein Leerzeichen davor (Glossar Regel 7)
    wirdGesendet: "Küldés...",
    kontoErstellen: "Fiók létrehozása: név, e-mail-cím, jelszó, jelszó újra.",
    anmelden: "Bejelentkezés: e-mail-cím, jelszó.",
    belohnungKeins: "Jutalomjáték: nincs.",

    // --- Übungsarten --- (Glossar §2.2: Saját gyakorlás, Történetek és érdekességek, Szójátékok)
    modusAdaptiv: "Saját gyakorlás.",
    modusBuecherei: "Történetek és érdekességek.",
    modusWortspiele: "Szójátékok.",

    // --- Zeit und Fortschritt ---
    letzteZeile: "Utolsó sor.",
  },

  // „Lépés 2/5: Titel" - Schrägstrich und Doppelpunkt, nie ein Punkt hinter der Zahl (Ordnungszahl, Glossar §4 Falle 4).
  schritt: (nummer, gesamt, titel) => `Lépés ${nummer}/${gesamt}: ${titel}`,

  tastatur: (kurz) => abschluss(`Billentyűzet: ${kurz}`),

  // Glossar §2.2: Startpunkt = kiindulópont
  start: (label) => abschluss(`Kiindulópont: ${label}`),

  // Glossar Regel 12 und §2.12: Name nach Doppelpunkt, nie mit Endung
  angemeldet: (name) => abschluss(`Bejelentkezett fiók: ${name}`),

  // Glossar §2.3: Belohnungs-Spiel = jutalomjáték
  belohnungsspiel: (label) => abschluss(`Jutalomjáték: ${label}`),

  // Glossar §2.12 und §4 Falle 4: „Sor 3/12, hátravan 9 sor." / „Sor 3/12, utolsó sor." - Komma hinter der Gesamtzahl, Einzahl nach der
  // Zahl (Regel 13); eine Aufgabe heisst „feladat" (nicht „sor", denn „sor" ist die Übungszeile).
  stand: (aktuell, gesamt, art) => {
    const wort = art === "zeile" ? "sor" : "feladat";
    const rest = Math.max(0, gesamt - aktuell);
    const schwanz = rest > 0 ? `hátravan ${rest} ${wort}.` : `utolsó ${wort}.`;
    return `${gross(wort)} ${aktuell}/${gesamt}, ${schwanz}`;
  },

  // Glossar §2.2: Übezeit = gyakorlási idő; `zeit` kommt fertig formatiert („12 perc"), Zahl + Einzahl
  uebezeit: (zeit) => `Gyakorlási idő: ${zeit}`,

  // Glossar §2.2: Übungsstufe = szint; höchstens ein Ausrufezeichen, kein Geschlecht des Kindes (Regel 2)
  aufstieg: (sober) =>
    sober ? "Szintlépés: következő gyakorlási szint. " : "Szintlépés! Egyre ügyesebb vagy. ",

  // Glossar §2.4: Abzeichen = jelvény; Name nach Doppelpunkt; „és 2 további" - Einzahl, ohne Hauptwort nach der Zahl; kein Komma vor „és"
  neueAbzeichen: (namen, gesamt, rest, ende) => {
    if (namen.length === 0) return "";
    const kopf = gesamt === 1 ? "Új jelvény: " : "Új jelvények: ";
    let liste: string;
    if (rest > 0 || namen.length === 1) {
      liste = namen.join(", ");
    } else {
      liste = `${namen.slice(0, -1).join(", ")} és ${namen[namen.length - 1]}`;
    }
    const mehr = rest > 0 ? ` és ${rest} további` : "";
    return ` ${kopf}${liste}${mehr}${ende}`;
  },

  // Glossar §2.2/§2.12: pontosság, sebesség (nie „tempó", §4 Falle 9), „leütés percenként" (Regel 6). Der Wert kommt als „95%" (Regel 5);
  // das Satzende ist ein Wort, nie die Zahl.
  werte: (treffsicherheit, tempo) =>
    ` Pontosság: ${treffsicherheit}, sebesség: ${tempo} leütés percenként.`,

  // Glossar Regel 11 und §2.9: Tastennamen nie mit Endung, immer mit „billentyű"; „esetén" ist unveränderlich (keine Vokalharmonie).
  umschaltSeite: (zeichenName, seiteLinks) =>
    `Majdnem! ${gross(zeichenName)} esetén a ${seiteLinks ? "bal" : "jobb"} Shift billentyűt nyomd meg, ne a másikat, és ne a Caps Lock billentyűt.`,
};
