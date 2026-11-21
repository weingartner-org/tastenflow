/**
 * ★ F58 (29.10.2026): die Ansagen der Sprachausgabe auf Rumänisch (Weg „ro") - nach Glossar
 * `recherche-rumänisch-2026-10-25/GLOSSAR-ro.md`; ⚠️ Lese-Abnahme durch eine Person mit Rumänisch als Erstsprache steht aus.
 *
 * Regeln in Kürze: Anrede „tu" (Entscheidung Johannes 29.10., auch für Erwachsene); nur Komma-Formen ș ț (nie Cedille);
 * nie ein Punkt direkt hinter einer Zahl (Ordnungszahl); Namen nur im Nominativ nach Doppelpunkt (Glossar Regel 12);
 * Tastennamen mit Kopfwort „tasta" und ungebeugt (Regel 11); kein Adjektiv/Partizip am Kind (Regel 2).
 */
import type { VorleseTexteNeun } from "./vorleseTexteNeun";
import { mehrzahl } from "../bedienSprache/texte";

/** Erster Buchstabe groß (rumänisch: kein Sonderfall, ș ț ă â î gehen mit `toUpperCase`). */
function gross(text: string): string {
  return text.length ? `${text.slice(0, 1).toUpperCase()}${text.slice(1)}` : text;
}

export const VORLESE_TEXTE_RO: VorleseTexteNeun = {
  ansagen: {
    // --- Vorlesen selbst --- (Glossar §2.8: „Citire cu voce tare"; Schalter f. ⇒ „pornită/oprită")
    vorlesenAn: "Citire cu voce tare: pornită.",
    vorlesenAnMitFeldern:
      "Citire cu voce tare: pornită. Sub ea: litere, cuvinte, propoziții, viteza vocii și vocea.",
    vorlesenAus: "Citire cu voce tare: oprită. Setările de sub ea sunt ascunse.",
    woerterAn: "Citirea cuvintelor: pornită.",
    woerterAus: "Citirea cuvintelor: oprită.",
    // „propoziții" (nicht „fraze" = Satzgefüge, Glossar §2.2)
    saetzeAn: "Citirea propozițiilor: pornită.",
    saetzeAus: "Citirea propozițiilor: oprită.",
    tempoProbe: "Așa de repede citesc acum.",
    stimmeProbe: "Salut! Așa sună această voce.",

    // --- Inhaltswechsel mitten in der Runde ---
    jetztEchteWoerter: "Atenție, acum cuvinte adevărate.",
    jetztUnsinnwoerter: "Atenție, acum cuvinte inventate.",
    jetztZahlen: "Atenție, acum numere.",

    // --- Ton und Anzeige ---
    tonAn: "Sunet: pornit.",
    tonAus: "Sunet: oprit.",
    // „clic" als Geräusch erlaubt (Glossar §2.8, Regel 8)
    tippKlickAn: "Clicul tastelor: pornit.",
    tippKlickAus: "Clicul tastelor: oprit.",
    melodieAn: "Melodie: pornită. Se aude în urechea dreaptă.",
    melodieAus: "Melodie: oprită.",
    fingerFarbenAn: "Culorile degetelor: pornite.",
    fingerFarbenAus: "Culorile degetelor: oprite.",
    kleinsteGroesse: "Aceasta este cea mai mică dimensiune.",
    groessteGroesse: "Aceasta este cea mai mare dimensiune.",
    // „În ritmul tău" = Zeit lassen (Glossar §2.2)
    zeitLassenAn: "În ritmul tău: pornit.",
    zeitLassenAus: "În ritmul tău: oprit.",
    einhandAn: "Scriere cu o mână: pornită.",
    einhandAus: "Scriere cu o mână: oprită.",

    // --- Bereiche und Wege ---
    einstellungenGeoeffnet: "Setările sunt deschise.",
    einstellungenGeschlossen: "Setările sunt închise.",
    // „medalie" für Abzeichen (Glossar §2.4)
    statistik: "Progresul meu. Medaliile tale.",
    podcastGeoeffnet: "Podcastul de introducere este deschis.",
    eisschollenSpiel: "Sloiuri de gheață.",
    // „Te-ai deconectat." - Perfekt mit „a avea" ist neutral (Glossar §2.5, Regel 2)
    abgemeldet: "Te-ai deconectat.",
    passwortGeaendert: "Parola a fost schimbată.",
    wirdGesendet: "Se trimite...",
    kontoErstellen: "Creați un cont: nume, adresă de e-mail, parolă, parola din nou.",
    anmelden: "Conectați-vă: adresă de e-mail, parolă.",
    belohnungKeins: "Joc-recompensă: niciunul.",

    // --- Übungsarten ---
    modusAdaptiv: "Antrenamentul meu.",
    modusBuecherei: "Povești și curiozități.",
    modusWortspiele: "Jocuri cu cuvinte.",

    // --- Zeit und Fortschritt ---
    letzteZeile: "Ultimul rând.",
  },

  // Doppelpunkt statt Punkt: „7." wäre die Ordnungszahl.
  schritt: (nummer, gesamt, titel) => `Pasul ${nummer} din ${gesamt}: ${titel}`,

  tastatur: (kurz) => `Tastatură: ${kurz}.`,

  // Glossar §2.2: „punct de plecare" (nie „pornire" = Home-Taste)
  start: (label) => `Punct de plecare: ${label}.`,

  // Name nach Doppelpunkt, nie gebeugt (Regel 12); „Cont conectat" - Adjektiv am Konto, nicht am Kind (§2.12)
  angemeldet: (name) => `Cont conectat: ${name}.`,

  belohnungsspiel: (label) => `Joc-recompensă: ${label}.`,

  stand: (aktuell, gesamt, art) => {
    // Glossar §2.12: „Rândul 3/12, mai sunt 9 rânduri" · „ultimul rând" · „Întrebarea 5/6, mai este o întrebare".
    // Das Verb zieht mit der Zahl; „un/o" als Wort statt „1" (Regel 5, Falle 6). Komma hinter der Gesamtzahl.
    const rest = Math.max(0, gesamt - aktuell);
    if (art === "zeile") {
      const schwanz =
        rest > 0
          ? `${mehrzahl(rest, "ro", {
              one: () => "mai este un rând",
              few: (z) => `mai sunt ${z} rânduri`,
              other: (z) => `mai sunt ${z} de rânduri`,
            })}.`
          : "ultimul rând.";
      return `Rândul ${aktuell}/${gesamt}, ${schwanz}`;
    }
    const schwanz =
      rest > 0
        ? `${mehrzahl(rest, "ro", {
            one: () => "mai este o întrebare",
            few: (z) => `mai sunt ${z} întrebări`,
            other: (z) => `mai sunt ${z} de întrebări`,
          })}.`
        : "ultima întrebare.";
    return `Întrebarea ${aktuell}/${gesamt}, ${schwanz}`;
  },

  // Glossar §2.2: „timp de exersare"
  uebezeit: (zeit) => `Timp de exersare: ${zeit}`,

  // Kein Geschlecht: „Îți merge tot mai bine." (Glossar Regel 2); höchstens ein Ausrufezeichen
  aufstieg: (sober) =>
    sober ? "Avansare: următorul nivel. " : "Avansare! Îți merge tot mai bine. ",

  neueAbzeichen: (namen, gesamt, rest, ende) => {
    // Glossar §2.4/§2.12: „Medalie nouă: Name" - Name nach Doppelpunkt. Adjektiv an der Medaille (f.).
    const kopf = gesamt === 1 ? "Medalie nouă: " : "Medalii noi: ";
    // „și încă o medalie · 2 medalii · 20 de medalii" - endet auf dem Hauptwort, nie auf einer Zahl
    const mehr =
      rest > 0
        ? ` și încă ${mehrzahl(rest, "ro", {
            one: () => "o medalie",
            few: (z) => `${z} medalii`,
            other: (z) => `${z} de medalii`,
          })}`
        : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  },

  // Glossar §2.12: „Precizie: 95 %, viteză: 120 de caractere pe minut." („de" ab 20); Komma/Punkt nie direkt hinter der Zahl
  werte: (treffsicherheit, tempo) =>
    ` Precizie: ${treffsicherheit}, viteză: ${mehrzahl(tempo, "ro", {
      one: () => "un caracter pe minut",
      few: (z) => `${z} caractere pe minut`,
      other: (z) => `${z} de caractere pe minut`,
    })}.`,

  // Tastenname mit Kopfwort „tasta", ungebeugt (Regel 11); „Caps Lock" wie auf der Kappe (§2.9)
  umschaltSeite: (zeichenName, seiteLinks) =>
    `Aproape! ${gross(zeichenName)} necesită tasta Shift din ${seiteLinks ? "stânga" : "dreapta"}, ` +
    "nu pe cealaltă și nu tasta Caps Lock.",
};
