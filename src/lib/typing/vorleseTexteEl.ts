/**
 * ★ F58 (29.10.2026): die Ansagen der Sprachausgabe auf Griechisch (Weg „el") - nach Glossar
 * `recherche-griechisch-2026-10-25/GLOSSAR-el.md`; ⚠️ Lese-Abnahme durch eine Person mit Griechisch als Erstsprache steht aus.
 *
 * Regeln: Kinder werden geduzt (Glossar Regel 1); Verben statt Adjektive am Kind (Regel 2); keine Anführungszeichen in Live-Zeilen
 * (Regel 7); Fragezeichen wäre `;` - es gibt hier keine Fragen; Tastennamen unverändert und sächlich (Regel 11, §2.9); Name nur nach
 * Doppelpunkt (Regel 12); nie ein Punkt direkt hinter einer Zahl (im Griechischen keine Ordnungszahl-Falle, aber dieselbe Hausregel).
 */
import type { VorleseTexteNeun } from "./vorleseTexteNeun";
import { mehrzahl } from "../bedienSprache/texte";

export const VORLESE_TEXTE_EL: VorleseTexteNeun = {
  ansagen: {
    // --- Vorlesen selbst ---
    // Glossar §2.8: „Εκφώνηση" (NVDA-Wort) für den Schalter Vorlesen; „Πλήκτρο πλήκτρο" (§2.2) für Buchstabieren.
    vorlesenAn: "Εκφώνηση: ενεργή.",
    vorlesenAnMitFeldern:
      "Εκφώνηση: ενεργή. Από κάτω: λέξεις, προτάσεις, πλήκτρο πλήκτρο, ρυθμός ομιλίας και φωνή.",
    vorlesenAus: "Εκφώνηση: ανενεργή. Οι ρυθμίσεις από κάτω είναι κρυμμένες.",
    woerterAn: "Εκφώνηση λέξεων: ενεργή.",
    woerterAus: "Εκφώνηση λέξεων: ανενεργή.",
    saetzeAn: "Εκφώνηση προτάσεων: ενεργή.",
    saetzeAus: "Εκφώνηση προτάσεων: ανενεργή.",
    tempoProbe: "Με αυτή την ταχύτητα διαβάζω τώρα.",
    stimmeProbe: "Γεια σου! Έτσι ακούγεται αυτή η φωνή.",

    // --- Inhaltswechsel mitten in der Runde ---
    jetztEchteWoerter: "Προσοχή, τώρα πραγματικές λέξεις.",
    jetztUnsinnwoerter: "Προσοχή, τώρα φανταστικές λέξεις.",
    jetztZahlen: "Προσοχή, τώρα αριθμοί.",

    // --- Ton und Anzeige ---
    tonAn: "Ήχος: ενεργός.",
    tonAus: "Ήχος: ανενεργός.",
    tippKlickAn: "Ήχος πλήκτρων: ενεργός.",
    tippKlickAus: "Ήχος πλήκτρων: ανενεργός.",
    melodieAn: "Μελωδία: ενεργή. Παίζει στο δεξί αυτί.",
    melodieAus: "Μελωδία: ανενεργή.",
    fingerFarbenAn: "Χρώματα δαχτύλων: ενεργά.",
    fingerFarbenAus: "Χρώματα δαχτύλων: ανενεργά.",
    kleinsteGroesse: "Αυτό είναι το μικρότερο μέγεθος.",
    groessteGroesse: "Αυτό είναι το μεγαλύτερο μέγεθος.",
    // Glossar §2.2: „Με την ησυχία σου" (Z 17); „ενεργό" als Schalter-Zustand ist [G] - Lese-Abnahme.
    zeitLassenAn: "Με την ησυχία σου: ενεργό.",
    zeitLassenAus: "Με την ησυχία σου: ανενεργό.",
    einhandAn: "Γραφή με ένα χέρι: ενεργή.",
    einhandAus: "Γραφή με ένα χέρι: ανενεργή.",

    // --- Bereiche und Wege ---
    einstellungenGeoeffnet: "Οι ρυθμίσεις άνοιξαν.",
    einstellungenGeschlossen: "Οι ρυθμίσεις έκλεισαν.",
    // Glossar §2.6 „Η πρόοδός μου", §2.4 „μετάλλιο" (sächlich, ungegendert).
    statistik: "Η πρόοδός μου. Τα μετάλλιά σου.",
    podcastGeoeffnet: "Το εισαγωγικό podcast άνοιξε.",
    eisschollenSpiel: "Παγοκομμάτια.",
    // Glossar §2.5: «Η αποσύνδεση ολοκληρώθηκε.» (neutral, kein Partizip am Kind).
    abgemeldet: "Η αποσύνδεση ολοκληρώθηκε.",
    passwortGeaendert: "Ο κωδικός πρόσβασης άλλαξε.",
    wirdGesendet: "Γίνεται αποστολή...",
    kontoErstellen:
      "Δημιουργία λογαριασμού: όνομα, διεύθυνση e-mail, κωδικός πρόσβασης, επανάληψη του κωδικού.",
    anmelden: "Σύνδεση: διεύθυνση e-mail, κωδικός πρόσβασης.",
    belohnungKeins: "Παιχνίδι-επιβράβευση: κανένα.",

    // --- Übungsarten ---
    modusAdaptiv: "Η εξάσκησή μου.",
    modusBuecherei: "Ιστορίες και γνώσεις.",
    modusWortspiele: "Παιχνίδια λέξεων.",

    // --- Zeit und Fortschritt ---
    letzteZeile: "Τελευταία γραμμή.",
  },

  // Doppelpunkt statt Punkt hinter der Gesamtzahl (Hausregel); „από" bleibt unverändert (Glossar Regel 13).
  schritt: (nummer, gesamt, titel) => `Βήμα ${nummer} από ${gesamt}: ${titel}`,

  tastatur: (kurz) => `Πληκτρολόγιο: ${kurz}.`,

  start: (label) => `Σημείο εκκίνησης: ${label}.`,

  // Glossar Regel 2 und 12: „Σύνδεση ως: ..." - Name nach Doppelpunkt, nie gebeugt, kein Partizip am Kind.
  angemeldet: (name) => `Σύνδεση ως: ${name}.`,

  belohnungsspiel: (label) => `Παιχνίδι-επιβράβευση: ${label}.`,

  // Glossar §2.2: „γραμμή" (nie „σειρά" = Tastenreihe); „Ερώτηση" für Aufgaben (§2.2, nie „εργασία" = Hausübung).
  // Komma hinter der Gesamtzahl; Mehrzahl nach `Intl.PluralRules("el-GR")` (one/other).
  stand: (aktuell, gesamt, art) => {
    const eins = art === "zeile" ? "γραμμή" : "ερώτηση";
    const viele = art === "zeile" ? "γραμμές" : "ερωτήσεις";
    const kopf = art === "zeile" ? "Γραμμή" : "Ερώτηση";
    const rest = Math.max(0, gesamt - aktuell);
    const schwanz =
      rest > 0
        ? `${mehrzahl(rest, "el", {
            one: (z) => `ακόμα ${z} ${eins}`,
            other: (z) => `ακόμα ${z} ${viele}`,
          })}.`
        : `τελευταία ${eins}.`;
    return `${kopf} ${aktuell} από ${gesamt}, ${schwanz}`;
  },

  uebezeit: (zeit) => `Χρόνος εξάσκησης: ${zeit}`,

  // „Τα πας όλο και καλύτερα" verrät kein Geschlecht (Regel 2); höchstens ein Ausrufezeichen (Regel 1).
  aufstieg: (sober) =>
    sober ? "Επόμενο επίπεδο εξάσκησης. " : "Επόμενο επίπεδο! Τα πας όλο και καλύτερα. ",

  // Glossar §2.4: „μετάλλιο"; Name nach Doppelpunkt; „και ένα ακόμα" / „και 2 ακόμα" (sächlich, passt zu jedem Rest).
  neueAbzeichen: (namen, gesamt, rest, ende) => {
    const kopf = gesamt === 1 ? "Νέο μετάλλιο: " : "Νέα μετάλλια: ";
    const mehr = rest > 0 ? (rest === 1 ? " και ένα ακόμα" : ` και ${rest} ακόμα`) : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  },

  // Glossar Regel 6: „πατήματα ανά λεπτό" (Anschläge, nie „χαρακτήρες"); „ακρίβεια", „ταχύτητα" (§2.2).
  // `treffsicherheit` kommt als „95%" (Regel 5); am Ende steht das Hauptwort „λεπτό", nie die Zahl.
  werte: (treffsicherheit, tempo) =>
    ` Ακρίβεια: ${treffsicherheit}, ταχύτητα: ${mehrzahl(tempo, "el", {
      one: (z) => `${z} πάτημα ανά λεπτό`,
      other: (z) => `${z} πατήματα ανά λεπτό`,
    })}.`,

  // Glossar Regel 11 und §2.9: „Shift" und „Caps Lock" unverändert, sächlich, mit Kopfwort „πλήκτρο".
  // Der Zeichenname steht mitten im Satz (nie Großschreibung erzeugen, Regel 7: Tonos geht bei toLocaleUpperCase("el") verloren).
  umschaltSeite: (zeichenName, seiteLinks) =>
    `Σχεδόν! Για ${zeichenName} χρειάζεται το ${seiteLinks ? "αριστερό" : "δεξί"} πλήκτρο Shift, ` +
    "όχι το άλλο και όχι το πλήκτρο Caps Lock.",
};
