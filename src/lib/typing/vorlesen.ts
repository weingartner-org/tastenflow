/**
 * DIE VORLESE-SPRACHE - was die App SAGT, folgt dem, was sie ZEIGT.
 *
 * Anlass (Jens, 29.08.2026, nach einer Testrunde mit englischen Texten und
 * englischer Stimme): „Wörter werden englisch vorgelesen, aber Leertaste und
 * Satzzeichen haben ihre deutschen Bezeichnungen, die dann mit falscher
 * Aussprache vorgelesen werden (z. B. Pankt für Punkt)."
 *
 * ★ Der Befund am Code: Die App schaltet die STIMME längst mit um - wer auf
 * englische Inhalte stellt, bekommt automatisch eine englische Systemstimme
 * (`changeLang` in TippenTrainerPage). Nur die NAMEN blieben deutsch, weil sie
 * in festen deutschen Tabellen standen. Gemessen (`scripts/_englisch.mts`):
 * **21,7 % aller Anschläge einer englischen Zeile lösten einen deutschen Namen
 * aus** - allein 18 Prozentpunkte davon die „Leertaste" nach jedem Wort.
 *
 * ★★ WAS HIER STEHT UND WAS NICHT:
 *  • HIER: alles, was die App VORLIEST - Zeichennamen, Rückmeldungen, Ansagen
 *    der Schalter. Beide Sprachen liegen nebeneinander, damit man sie zusammen
 *    liest und keine Fassung stillschweigend zurückbleibt.
 *  • NICHT hier: die SICHTBARE Oberfläche. Die bleibt deutsch (`charLabel`,
 *    `unitLabel`) - eine Lehrkraft in Österreich bedient ein deutsches Programm,
 *    auch wenn ihr Kind englische Texte tippt.
 *  • NICHT hier: die Polar-Expedition. Ihre Erzählung IST deutscher Inhalt,
 *    kein Etikett; sie spricht weiter deutsch (`speakUiDe`).
 *
 * Die Sprache wird NICHT gespeichert - sie folgt der Inhaltssprache des Kontos
 * bzw. der Gast-Einstellung und wird von `TippenTrainerPage` gesetzt. Siehe
 * [[project_zehnfinger_trainer]].
 */
import type { Lang } from "./account";
import { ansageGewaehlt as gemeinsamGewaehlt } from "../ansageGewaehlt";
import type { ZeilenArt } from "./generator";
import { englischVariante } from "./schreibweise";
import { franzVariante } from "./franzVariante";
import { esVariante } from "./esVariante";
import { grossFuer, kleinFuer, geruestAufEn, mitRueckfallEn, istGeruestSprache, type GeruestSprache } from "./sprachRegister";
// ★ F58 (29.10.2026): die Sätze der neun Wege (je Sprache eine Datei `vorleseTexte<Xx>.ts`).
import { VORLESE_TEXTE_NEUN } from "./vorleseTexteNeun";
import { mehrzahl } from "../bedienSprache/texte";

/**
 * Die Sprache, in der gerade vorgelesen wird. Modulweit statt als React-Zustand:
 * Die allermeisten Ansagen entstehen in Ereignis-Behandlern (Tastendruck,
 * Schalter), nicht beim Zeichnen - dort gibt es keinen Hook. Wer sie setzt, ist
 * genau eine Stelle (`TippenTrainerPage`), und die kennt die Inhaltssprache.
 */
let AKTUELLE_SPRACHE: Lang = "de";

/** Die Vorlese-Sprache setzen (folgt der Inhaltssprache). */
export function setVorleseSprache(lang: Lang): void {
  AKTUELLE_SPRACHE = lang;
}

/** In welcher Sprache gerade vorgelesen wird. */
export function vorleseSprache(): Lang {
  return AKTUELLE_SPRACHE;
}

/**
 * BCP-47-Kennung je Sprache - nur als RÜCKFALL, wenn auf dem Gerät gar keine
 * passende Stimme installiert ist. Englisch bewusst `en-GB`: Der englische
 * Korpus schreibt „harbour", „colour" und rechnet in Pfund.
 */
export const SPRACH_TAG: Record<Lang, string> = {
  de: "de-DE",
  en: "en-GB",
  // Frankreich als Grundform (Bauplan §10.1) - {@link sprachTagFuer} verfeinert
  // das auf die vier Landesvarianten, wie bei en-GB/en-US.
  fr: "fr-FR",
  // ★ ES-F2 (27.09.2026, Bauplan §7/S2): Spanien als Grundform - nur RÜCKFALL,
  // wenn {@link sprachTagFuer} (ES-F8: {@link esVariante}) keine passende
  // Stimme findet oder der Probe-Schalter aus ist.
  es: "es-ES",
  // G2a (02.10.2026): echte Sprachkennungen, kein Rückfall (Stimmenwahl: G2b).
  it: "it-IT",
  pl: "pl-PL",
  tr: "tr-TR",
  cs: "cs-CZ",
  // ★ G2-NEUN (25.10.2026): echte Sprachkennungen, kein Rückfall (Stimmenwahl: Etappe der Sprache).
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

/**
 * ★ E9 (24.09.2026, Bauplan §8.2/§8.3): wie {@link SPRACH_TAG}, aber bevorzugt
 * bei Englisch eine `en-US`-Stimme, wenn die gerade geltende Schreibweise
 * amerikanisch ist ({@link englischVariante}). „gb" (die Vorgabe) ändert
 * nichts - `SPRACH_TAG` bleibt für Deutsch und britisches Englisch die
 * einzige Quelle.
 *
 * ★ E12 (26.09.2026, Bauplan §10.1, §14 E12): bei Französisch ebenso - die
 * vier Landesvarianten (`FranzVariante`, `franzVariante()`) SIND schon
 * gültige BCP-47-Tags (`fr-FR`/`fr-BE`/`fr-CH`/`fr-CA`), darum reicht die
 * direkte Weitergabe. Ohne den Probe-Schalter des französischen Lehrgangs
 * liefert `franzVariante()` unbedingt „fr-FR" (dasselbe Tor wie überall).
 *
 * ★★★ ES-F8 (27.09.2026, Bauplan §1.2 S2, §7): dieselbe Regel für Spanisch -
 * `esVariante()` liefert `es-ES`/`es-419`, beides gültige BCP-47-Tags.
 */
export function sprachTagFuer(lang: Lang): string {
  if (lang === "en" && englischVariante() === "us") return "en-US";
  if (lang === "fr") return franzVariante();
  if (lang === "es") return esVariante();
  return SPRACH_TAG[lang];
}

// ---------------------------------------------------------------------------
// Die Ansagen
// ---------------------------------------------------------------------------

/**
 * Alle festen Ansage-Sätze auf Deutsch. Die englische Tabelle darunter muss
 * dieselben Schlüssel tragen - TypeScript besteht darauf, und
 * `tests/typing-vorlesen.test.ts` prüft zusätzlich, dass keine Fassung leer
 * bleibt oder versehentlich denselben deutschen Satz trägt.
 *
 * Ton: Kinder werden geduzt, Sätze bleiben kurz und einfach (Neunjährige mit
 * Sehbeeinträchtigung hören sie mitten im Üben). Im Englischen gilt dasselbe -
 * kurze Hauptsätze, kein Schulbuch-Englisch.
 */
const DE = {
  // --- Vorlesen selbst ---
  vorlesenAn: "Vorlesen an.",
  vorlesenAnMitFeldern:
    "Vorlesen an: Buchstaben, Wörter, Sätze, Tempo und Stimme darunter.",
  vorlesenAus: "Vorlesen aus. Die Einstellungen darunter sind weg.",
  woerterAn: "Wörter vorlesen an.",
  woerterAus: "Wörter vorlesen aus.",
  saetzeAn: "Sätze vorlesen an.",
  saetzeAus: "Sätze vorlesen aus.",
  tempoProbe: "So schnell lese ich jetzt vor.",
  stimmeProbe: "Hallo! So klingt diese Stimme.",

  // --- Inhaltswechsel mitten in der Runde ---
  jetztEchteWoerter: "Achtung, jetzt echte Wörter.",
  jetztUnsinnwoerter: "Achtung, jetzt Unsinnwörter.",
  jetztZahlen: "Achtung, jetzt Zahlen.",

  // --- Ton und Anzeige ---
  tonAn: "Ton an.",
  tonAus: "Ton aus.",
  tippKlickAn: "Tipp-Klick an.",
  tippKlickAus: "Tipp-Klick aus.",
  // ★ 15.10.2026: Melodie beim Tippen (Alt + 6). „an" wird nur gesprochen, wenn
  //   das Vorlesen läuft - und genau dann liegt die Melodie rechts.
  melodieAn: "Melodie an. Sie spielt auf dem rechten Ohr.",
  melodieAus: "Melodie aus.",
  fingerFarbenAn: "Finger-Farben: an.",
  fingerFarbenAus: "Finger-Farben: aus.",
  kleinsteGroesse: "Kleinste Größe erreicht.",
  groessteGroesse: "Größte Größe erreicht.",
  zeitLassenAn: "Zeit lassen an.",
  zeitLassenAus: "Zeit lassen aus.",
  einhandAn: "Einhand schreiben an.",
  einhandAus: "Einhand schreiben aus.",

  // --- Bereiche und Wege ---
  einstellungenGeoeffnet: "Einstellungen geöffnet.",
  einstellungenGeschlossen: "Einstellungen geschlossen.",
  statistik: "Meine Statistik. Deine Abzeichen.",
  podcastGeoeffnet: "Einführungs-Podcast geöffnet.",
  eisschollenSpiel: "Eisschollen-Spiel.",
  abgemeldet: "Abgemeldet.",
  passwortGeaendert: "Passwort geändert.",
  wirdGesendet: "Wird gesendet …",
  kontoErstellen: "Konto erstellen: Name, E-Mail, Passwort, Wiederholung.",
  anmelden: "Anmelden: E-Mail, Passwort.",
  belohnungKeins: "Belohnungs-Spiel: keins.",

  // --- Übungsarten ---
  modusAdaptiv: "Mein Training.",
  modusBuecherei: "Geschichten und Wissen.",
  modusWortspiele: "Wortspiele.",

  // --- Zeit und Fortschritt ---
  letzteZeile: "Letzte Zeile.",
} as const;

/** ★ F58 (29.10.2026): exportiert für `vorleseTexteNeun.ts` (die Ansagen der neun Wege). */
export type AnsageSchluessel = keyof typeof DE;

const EN: Record<AnsageSchluessel, string> = {
  // --- Vorlesen selbst ---
  vorlesenAn: "Reading aloud on.",
  // EN2 (19.09.2026): nennt, was WIRKLICH darunter steht (Wörter, Sätze,
  // Buchstabieren, Tempo, Stimme) - „letters" war der alte Schalter vom 03.09.
  vorlesenAnMitFeldern:
    "Reading aloud on. Below it: words, sentences, spell out, speed and voice.",
  vorlesenAus: "Reading aloud off. The settings below are gone.",
  woerterAn: "Reading words on.",
  woerterAus: "Reading words off.",
  saetzeAn: "Reading sentences on.",
  saetzeAus: "Reading sentences off.",
  tempoProbe: "This is how fast I read now.",
  stimmeProbe: "Hello! This is what this voice sounds like.",

  // --- Inhaltswechsel mitten in der Runde ---
  jetztEchteWoerter: "Careful, real words now.",
  jetztUnsinnwoerter: "Careful, made-up words now.",
  jetztZahlen: "Careful, numbers now.",

  // --- Ton und Anzeige ---
  tonAn: "Sound on.",
  tonAus: "Sound off.",
  tippKlickAn: "Key click on.",
  tippKlickAus: "Key click off.",
  melodieAn: "Melody on. It plays in your right ear.",
  melodieAus: "Melody off.",
  fingerFarbenAn: "Finger colours: on.",
  fingerFarbenAus: "Finger colours: off.",
  kleinsteGroesse: "Smallest size reached.",
  groessteGroesse: "Largest size reached.",
  zeitLassenAn: "Take your time: on.",
  zeitLassenAus: "Take your time: off.",
  einhandAn: "One-handed typing: on.",
  einhandAus: "One-handed typing: off.",

  // --- Bereiche und Wege ---
  einstellungenGeoeffnet: "Settings open.",
  einstellungenGeschlossen: "Settings closed.",
  statistik: "My statistics. Your badges.",
  podcastGeoeffnet: "Introduction podcast open.",
  eisschollenSpiel: "Ice Floe game.", // EN2: Glossar §3.6
  abgemeldet: "Signed out.",
  passwortGeaendert: "Password changed.",
  wirdGesendet: "Sending …",
  // EN2 (19.09.2026): Glossar §3.9 - *email* ohne Bindestrich.
  kontoErstellen: "Create account: name, email, password, password again.",
  anmelden: "Sign in: email, password.",
  belohnungKeins: "Reward game: none.",

  // --- Übungsarten ---
  modusAdaptiv: "My training.",
  // EN1 (19.09.2026): Glossar §3.6 - „Geschichten & Wissen" ⇒ *Stories & non-fiction*.
  modusBuecherei: "Stories and non-fiction.",
  modusWortspiele: "Word games.",

  // --- Zeit und Fortschritt ---
  letzteZeile: "Last line.",
};

/**
 * ★ E12 (26.09.2026, Bauplan §14 E12, Auftrag Punkt 3): dieselben Sätze auf
 * FRANZÖSISCH - NEU geschrieben, nicht aus Deutsch/Englisch übertragen.
 * **tu** (F9), kein Point médian (F10), kurz und einfach wie beim Deutschen.
 * Glossar §9.2: *lecture à voix haute* (Vorlesen), *Jeux de lettres*
 * (Wortspiele), *Banquise* (Eisschollen-Spiel).
 */
const FR: Record<AnsageSchluessel, string> = {
  // --- Vorlesen selbst ---
  vorlesenAn: "Lecture à voix haute activée.",
  vorlesenAnMitFeldern:
    "Lecture à voix haute activée : lettres, mots, phrases, vitesse et voix en dessous.",
  vorlesenAus: "Lecture à voix haute désactivée. Les réglages en dessous ont disparu.",
  woerterAn: "Lire les mots à voix haute : activé.",
  woerterAus: "Lire les mots à voix haute : désactivé.",
  saetzeAn: "Lire les phrases à voix haute : activé.",
  saetzeAus: "Lire les phrases à voix haute : désactivé.",
  tempoProbe: "Voilà à quelle vitesse je lis maintenant.",
  stimmeProbe: "Bonjour ! Voilà à quoi ressemble cette voix.",

  // --- Inhaltswechsel mitten in der Runde ---
  jetztEchteWoerter: "Attention, de vrais mots maintenant.",
  jetztUnsinnwoerter: "Attention, des mots inventés maintenant.",
  jetztZahlen: "Attention, des nombres maintenant.",

  // --- Ton und Anzeige ---
  tonAn: "Son activé.",
  tonAus: "Son désactivé.",
  tippKlickAn: "Clic de touche activé.",
  tippKlickAus: "Clic de touche désactivé.",
  melodieAn: "Mélodie activée. Elle joue dans l'oreille droite.",
  melodieAus: "Mélodie désactivée.",
  fingerFarbenAn: "Couleurs des doigts : activées.",
  fingerFarbenAus: "Couleurs des doigts : désactivées.",
  kleinsteGroesse: "Plus petite taille atteinte.",
  groessteGroesse: "Plus grande taille atteinte.",
  zeitLassenAn: "Prendre son temps : activé.",
  zeitLassenAus: "Prendre son temps : désactivé.",
  einhandAn: "Écrire d'une seule main : activé.",
  einhandAus: "Écrire d'une seule main : désactivé.",

  // --- Bereiche und Wege ---
  einstellungenGeoeffnet: "Réglages ouverts.",
  einstellungenGeschlossen: "Réglages fermés.",
  statistik: "Mes progrès. Tes badges.",
  podcastGeoeffnet: "Podcast d'introduction ouvert.",
  eisschollenSpiel: "Jeu de la Banquise.",
  abgemeldet: "Déconnecté.",
  passwortGeaendert: "Mot de passe changé.",
  wirdGesendet: "Envoi en cours …",
  kontoErstellen: "Créer un compte : nom, e-mail, mot de passe, répéter le mot de passe.",
  anmelden: "Se connecter : e-mail, mot de passe.",
  belohnungKeins: "Jeu de récompense : aucun.",

  // --- Übungsarten ---
  modusAdaptiv: "Mon entrainement.",
  modusBuecherei: "Histoires et savoirs.",
  modusWortspiele: "Jeux de lettres.",

  // --- Zeit und Fortschritt ---
  letzteZeile: "Dernière ligne.",
};

/**
 * ★★★ ES-F8 (27.09.2026, Bauplan §7, Auftrag Punkt 2): dieselben Sätze auf
 * SPANISCH - NEU geschrieben, nicht aus Deutsch/Englisch/Französisch
 * übertragen. **tú** (Bauplan S9: Kinder und Selbstlernende), kurz und
 * einfach wie beim Deutschen/Französischen. Glossar §7: *lector de pantalla*,
 * *insignia*, *Configuración* - „ajustes" hier bewusst als das ALLTAGS-Wort
 * für die kleinen Vorlese-Schalter (nicht die grosse „Configuración"-Seite).
 */
const ES: Record<AnsageSchluessel, string> = {
  // --- Vorlesen selbst ---
  vorlesenAn: "Lectura en voz alta activada.",
  vorlesenAnMitFeldern:
    "Lectura en voz alta activada: letras, palabras, frases, velocidad y voz debajo.",
  vorlesenAus: "Lectura en voz alta desactivada. Los ajustes de abajo han desaparecido.",
  woerterAn: "Leer las palabras en voz alta: activado.",
  woerterAus: "Leer las palabras en voz alta: desactivado.",
  saetzeAn: "Leer las frases en voz alta: activado.",
  saetzeAus: "Leer las frases en voz alta: desactivado.",
  tempoProbe: "Así de rápido leo ahora.",
  stimmeProbe: "¡Hola! Así suena esta voz.",

  // --- Inhaltswechsel mitten in der Runde ---
  jetztEchteWoerter: "Atención, ahora palabras de verdad.",
  jetztUnsinnwoerter: "Atención, ahora palabras inventadas.",
  jetztZahlen: "Atención, ahora números.",

  // --- Ton und Anzeige ---
  tonAn: "Sonido activado.",
  tonAus: "Sonido desactivado.",
  tippKlickAn: "Clic de tecla activado.",
  tippKlickAus: "Clic de tecla desactivado.",
  melodieAn: "Melodía activada. Suena en el oído derecho.",
  melodieAus: "Melodía desactivada.",
  fingerFarbenAn: "Colores de los dedos: activados.",
  fingerFarbenAus: "Colores de los dedos: desactivados.",
  kleinsteGroesse: "Tamaño más pequeño alcanzado.",
  groessteGroesse: "Tamaño más grande alcanzado.",
  zeitLassenAn: "Tomarse tiempo: activado.",
  zeitLassenAus: "Tomarse tiempo: desactivado.",
  einhandAn: "Escribir con una mano: activado.",
  einhandAus: "Escribir con una mano: desactivado.",

  // --- Bereiche und Wege ---
  // ★ ES-O (27.09.2026): wie der Knopf in der Kopfzeile („Configuración",
  // „Mi progreso") - eine Ansage, die anders heisst als der Knopf, findet
  // niemand wieder.
  einstellungenGeoeffnet: "Configuración abierta.",
  einstellungenGeschlossen: "Configuración cerrada.",
  statistik: "Mi progreso. Tus insignias.",
  podcastGeoeffnet: "Pódcast de introducción abierto.",
  eisschollenSpiel: "Juego de la Banquisa.",
  abgemeldet: "Sesión cerrada.",
  passwortGeaendert: "Contraseña cambiada.",
  wirdGesendet: "Enviando…",
  kontoErstellen: "Crear cuenta: nombre, correo electrónico, contraseña, repetir contraseña.",
  anmelden: "Iniciar sesión: correo electrónico, contraseña.",
  belohnungKeins: "Juego de recompensa: ninguno.",

  // --- Übungsarten ---
  modusAdaptiv: "Mi entrenamiento.",
  modusBuecherei: "Cuentos y saberes.",
  modusWortspiele: "Juegos de palabras.",

  // --- Zeit und Fortschritt ---
  letzteZeile: "Última línea.",
};

/**
 * ★ O-IT (02.10.2026): dieselben Sätze auf ITALIENISCH - neu geschrieben, tu,
 * kurz. Glossar: „Lettura ad alta voce", „Con calma", „Scrivere con una mano",
 * „Impostazioni", „I miei progressi", „medaglie", „Gioco dei lastroni",
 * „Il mio allenamento", „Storie e curiosità", „Giochi di parole"; Schalter mit
 * „sì/no" (Glossar §2.8 „Suono sì/no").
 */
const IT: Record<AnsageSchluessel, string> = {
  // --- Vorlesen selbst ---
  vorlesenAn: "Lettura ad alta voce attiva.",
  vorlesenAnMitFeldern:
    "Lettura ad alta voce attiva. Sotto: parole, frasi, tasto per tasto, velocità e voce.",
  vorlesenAus: "Lettura ad alta voce disattivata. Le impostazioni sotto non ci sono più.",
  woerterAn: "Lettura delle parole: sì.",
  woerterAus: "Lettura delle parole: no.",
  saetzeAn: "Lettura delle frasi: sì.",
  saetzeAus: "Lettura delle frasi: no.",
  tempoProbe: "Ecco quanto leggo veloce adesso.",
  stimmeProbe: "Ciao! Ecco come suona questa voce.",

  // --- Inhaltswechsel mitten in der Runde ---
  jetztEchteWoerter: "Attenzione, ora parole vere.",
  jetztUnsinnwoerter: "Attenzione, ora parole inventate.",
  jetztZahlen: "Attenzione, ora numeri.",

  // --- Ton und Anzeige ---
  tonAn: "Suono: sì.",
  tonAus: "Suono: no.",
  tippKlickAn: "Clic dei tasti: sì.",
  tippKlickAus: "Clic dei tasti: no.",
  melodieAn: "Melodia: sì. Suona nell'orecchio destro.",
  melodieAus: "Melodia: no.",
  fingerFarbenAn: "Colori delle dita: sì.",
  fingerFarbenAus: "Colori delle dita: no.",
  kleinsteGroesse: "Raggiunta la dimensione più piccola.",
  groessteGroesse: "Raggiunta la dimensione più grande.",
  zeitLassenAn: "Con calma: sì.",
  zeitLassenAus: "Con calma: no.",
  einhandAn: "Scrivere con una mano: sì.",
  einhandAus: "Scrivere con una mano: no.",

  // --- Bereiche und Wege ---
  einstellungenGeoeffnet: "Impostazioni aperte.",
  einstellungenGeschlossen: "Impostazioni chiuse.",
  statistik: "I miei progressi. Le tue medaglie.",
  podcastGeoeffnet: "Podcast introduttivo aperto.",
  eisschollenSpiel: "Gioco dei lastroni.",
  abgemeldet: "Disconnessione eseguita.",
  passwortGeaendert: "Password cambiata.",
  wirdGesendet: "Invio in corso...",
  kontoErstellen: "Crea un account: nome, email, password, ripeti la password.",
  anmelden: "Accedi: email, password.",
  belohnungKeins: "Gioco premio: nessuno.",

  // --- Übungsarten ---
  modusAdaptiv: "Il mio allenamento.",
  modusBuecherei: "Storie e curiosità.",
  modusWortspiele: "Giochi di parole.",

  // --- Zeit und Fortschritt ---
  letzteZeile: "Ultima riga.",
};

/**
 * ★ O-PL (02.10.2026): dieselben Sätze auf POLNISCH - neu geschrieben, „ty",
 * kurz, ohne Vergangenheitsform der 2. Person („Wylogowano.", -no-Form).
 * Glossar §2.8: „Czytanie na głos", Schalter mit „włączone/wyłączone" (nie
 * abgekürzt, §2.8 „Dźwięk: włączony / wyłączony"), „Bez pośpiechu",
 * „Pisanie jedną ręką", „stukot klawiszy"; §2.2/§2.3: „Mój trening",
 * „Opowiadania i ciekawostki", „Gry słowne", „Skoki po krach"; Zeile = „wiersz".
 */
const PL: Record<AnsageSchluessel, string> = {
  // --- Vorlesen selbst ---
  vorlesenAn: "Czytanie na głos włączone.",
  vorlesenAnMitFeldern:
    "Czytanie na głos włączone. Poniżej: słowa, zdania, klawisz po klawiszu, tempo mowy i głos.",
  vorlesenAus: "Czytanie na głos wyłączone. Ustawień poniżej już nie ma.",
  woerterAn: "Czytanie słów: włączone.",
  woerterAus: "Czytanie słów: wyłączone.",
  saetzeAn: "Czytanie zdań: włączone.",
  saetzeAus: "Czytanie zdań: wyłączone.",
  tempoProbe: "Tak szybko teraz czytam.",
  stimmeProbe: "Cześć! Tak brzmi ten głos.",

  // --- Inhaltswechsel mitten in der Runde ---
  jetztEchteWoerter: "Uwaga, teraz prawdziwe słowa.",
  jetztUnsinnwoerter: "Uwaga, teraz wymyślone słowa.",
  jetztZahlen: "Uwaga, teraz liczby.",

  // --- Ton und Anzeige ---
  tonAn: "Dźwięk: włączony.",
  tonAus: "Dźwięk: wyłączony.",
  tippKlickAn: "Stukot klawiszy: włączony.",
  tippKlickAus: "Stukot klawiszy: wyłączony.",
  melodieAn: "Melodia: włączona. Gra w prawym uchu.",
  melodieAus: "Melodia: wyłączona.",
  fingerFarbenAn: "Kolory palców: włączone.",
  fingerFarbenAus: "Kolory palców: wyłączone.",
  kleinsteGroesse: "To najmniejszy rozmiar.",
  groessteGroesse: "To największy rozmiar.",
  zeitLassenAn: "Bez pośpiechu: włączone.",
  zeitLassenAus: "Bez pośpiechu: wyłączone.",
  einhandAn: "Pisanie jedną ręką: włączone.",
  einhandAus: "Pisanie jedną ręką: wyłączone.",

  // --- Bereiche und Wege ---
  einstellungenGeoeffnet: "Ustawienia otwarte.",
  einstellungenGeschlossen: "Ustawienia zamknięte.",
  statistik: "Moje postępy. Twoje odznaki.",
  podcastGeoeffnet: "Podcast wprowadzający otwarty.",
  eisschollenSpiel: "Skoki po krach.",
  abgemeldet: "Wylogowano.",
  passwortGeaendert: "Hasło zmienione.",
  wirdGesendet: "Wysyłanie...",
  kontoErstellen: "Załóż konto: imię, e-mail, hasło, powtórzenie hasła.",
  anmelden: "Zaloguj się: e-mail, hasło.",
  belohnungKeins: "Gra w nagrodę: brak.",

  // --- Übungsarten ---
  modusAdaptiv: "Mój trening.",
  modusBuecherei: "Opowiadania i ciekawostki.",
  modusWortspiele: "Gry słowne.",

  // --- Zeit und Fortschritt ---
  letzteZeile: "Ostatni wiersz.",
};

/**
 * ★ O-TR (02.10.2026): dieselben Sätze auf TÜRKISCH - neu geschrieben, "sen",
 * kurz, für die Stimme. Glossar §2.8: "Sesli okuma", Schalter mit "açık/kapalı",
 * "Ses efektleri" (Ton), "tuş sesi" (Tipp-Klick), "okuma sesi" (Stimme, nie
 * "ses" allein), "konuşma hızı"; §2.2: "Acele yok", "Harf harf", "Antrenmanım",
 * "Öyküler ve bilgiler"; §2.3 "Kelime oyunları", "Buz Kütlesi Oyunu";
 * §2.5 "Giriş yap", "Çıkış yapıldı.", "şifre", "e-posta"; Zeile = "satır".
 */
const TR: Record<AnsageSchluessel, string> = {
  // --- Vorlesen selbst ---
  vorlesenAn: "Sesli okuma açık.",
  vorlesenAnMitFeldern:
    "Sesli okuma açık. Altında: kelimeler, cümleler, harf harf, konuşma hızı ve okuma sesi.",
  vorlesenAus: "Sesli okuma kapalı. Altındaki ayarlar artık görünmüyor.",
  woerterAn: "Kelimeleri okuma: açık.",
  woerterAus: "Kelimeleri okuma: kapalı.",
  saetzeAn: "Cümleleri okuma: açık.",
  saetzeAus: "Cümleleri okuma: kapalı.",
  tempoProbe: "Şimdi bu hızla okuyorum.",
  stimmeProbe: "Merhaba! Bu okuma sesi kulağa böyle geliyor.",

  // --- Inhaltswechsel mitten in der Runde ---
  jetztEchteWoerter: "Dikkat, şimdi gerçek kelimeler.",
  jetztUnsinnwoerter: "Dikkat, şimdi uydurma kelimeler.",
  jetztZahlen: "Dikkat, şimdi sayılar.",

  // --- Ton und Anzeige ---
  tonAn: "Ses efektleri: açık.",
  tonAus: "Ses efektleri: kapalı.",
  tippKlickAn: "Tuş sesi: açık.",
  tippKlickAus: "Tuş sesi: kapalı.",
  melodieAn: "Melodi: açık. Sağ kulakta çalar.",
  melodieAus: "Melodi: kapalı.",
  fingerFarbenAn: "Parmak renkleri: açık.",
  fingerFarbenAus: "Parmak renkleri: kapalı.",
  kleinsteGroesse: "En küçük boyuta ulaşıldı.",
  groessteGroesse: "En büyük boyuta ulaşıldı.",
  zeitLassenAn: "Acele yok: açık.",
  zeitLassenAus: "Acele yok: kapalı.",
  einhandAn: "Tek elle yazma: açık.",
  einhandAus: "Tek elle yazma: kapalı.",

  // --- Bereiche und Wege ---
  einstellungenGeoeffnet: "Ayarlar açıldı.",
  einstellungenGeschlossen: "Ayarlar kapandı.",
  statistik: "İlerlemem. Rozetlerin.",
  // Keine Endung an das Lehnwort "podcast" (Regel 6) - sie geht an "yayın".
  podcastGeoeffnet: "Tanıtım podcast yayını açıldı.",
  eisschollenSpiel: "Buz Kütlesi Oyunu.",
  abgemeldet: "Çıkış yapıldı.",
  passwortGeaendert: "Şifre değiştirildi.",
  wirdGesendet: "Gönderiliyor...",
  kontoErstellen: "Hesap oluştur: ad, e-posta, şifre, şifre tekrarı.",
  anmelden: "Giriş yap: e-posta, şifre.",
  belohnungKeins: "Ödül oyunu: yok.",

  // --- Übungsarten ---
  modusAdaptiv: "Antrenmanım.",
  modusBuecherei: "Öyküler ve bilgiler.",
  modusWortspiele: "Kelime oyunları.",

  // --- Zeit und Fortschritt ---
  letzteZeile: "Son satır.",
};

/**
 * ★ O-CS (03.10.2026): dieselben Sätze auf TSCHECHISCH - neu geschrieben, ty,
 * kurz, für die Stimme und die Braillezeile (keine Anführungszeichen). Keine
 * Vergangenheit der 2. Person (Glossar Regel 2: „Odhlášení proběhlo."). Glossar
 * §2.8: „Předčítání", Schalter mit „zapnuto/vypnuto", „Zvuk", „cvakání kláves",
 * „hlas", „rychlost řeči"; §2.2: „V klidu", „Klávesa po klávese", „Můj
 * trénink", „Příběhy a zajímavosti"; §2.3 „Slovní hry", „Ledové kry";
 * §2.5 „Přihlásit se", „e-mailová adresa", „heslo"; Zeile = „řádek".
 */
const CS: Record<AnsageSchluessel, string> = {
  // --- Vorlesen selbst ---
  vorlesenAn: "Předčítání: zapnuto.",
  vorlesenAnMitFeldern:
    "Předčítání: zapnuto. Pod ním: slova, věty, klávesa po klávese, rychlost řeči a hlas.",
  vorlesenAus: "Předčítání: vypnuto. Nastavení pod ním jsou skrytá.",
  woerterAn: "Čtení slov: zapnuto.",
  woerterAus: "Čtení slov: vypnuto.",
  saetzeAn: "Čtení vět: zapnuto.",
  saetzeAus: "Čtení vět: vypnuto.",
  tempoProbe: "Takhle rychle teď čtu.",
  stimmeProbe: "Ahoj! Takhle zní tento hlas.",

  // --- Inhaltswechsel mitten in der Runde ---
  jetztEchteWoerter: "Pozor, teď skutečná slova.",
  jetztUnsinnwoerter: "Pozor, teď vymyšlená slova.",
  jetztZahlen: "Pozor, teď čísla.",

  // --- Ton und Anzeige ---
  tonAn: "Zvuk: zapnuto.",
  tonAus: "Zvuk: vypnuto.",
  tippKlickAn: "Cvakání kláves: zapnuto.",
  tippKlickAus: "Cvakání kláves: vypnuto.",
  melodieAn: "Melodie: zapnuto. Hraje v pravém uchu.",
  melodieAus: "Melodie: vypnuto.",
  fingerFarbenAn: "Barvy prstů: zapnuto.",
  fingerFarbenAus: "Barvy prstů: vypnuto.",
  kleinsteGroesse: "Toto je nejmenší velikost.",
  groessteGroesse: "Toto je největší velikost.",
  zeitLassenAn: "V klidu: zapnuto.",
  zeitLassenAus: "V klidu: vypnuto.",
  einhandAn: "Psaní jednou rukou: zapnuto.",
  einhandAus: "Psaní jednou rukou: vypnuto.",

  // --- Bereiche und Wege ---
  einstellungenGeoeffnet: "Nastavení je otevřené.",
  einstellungenGeschlossen: "Nastavení je zavřené.",
  statistik: "Můj pokrok. Tvoje odznaky.",
  podcastGeoeffnet: "Úvodní podcast je otevřený.",
  eisschollenSpiel: "Ledové kry.",
  abgemeldet: "Odhlášení proběhlo.",
  passwortGeaendert: "Heslo je změněné.",
  wirdGesendet: "Odesílá se...",
  kontoErstellen: "Vytvořit účet: jméno, e-mailová adresa, heslo, heslo znovu.",
  anmelden: "Přihlásit se: e-mailová adresa, heslo.",
  belohnungKeins: "Odměnová hra: žádná.",

  // --- Übungsarten ---
  modusAdaptiv: "Můj trénink.",
  modusBuecherei: "Příběhy a zajímavosti.",
  modusWortspiele: "Slovní hry.",

  // --- Zeit und Fortschritt ---
  letzteZeile: "Poslední řádek.",
};

/**
 * Alle Fassungen - für den Wächter-Test und für Werkzeuge.
 *
 * ★★★ ES-F8: „es" bekommt jetzt {@link ES} - vorher (ES-O-Vermerk aus ES-F2)
 * stand hier der englische Rückfall.
 */
export const ANSAGEN: Record<Lang, Record<AnsageSchluessel, string>> = {
  de: DE,
  en: EN,
  fr: FR,
  es: ES,
  it: IT,
  pl: PL,
  tr: TR,
  // ★ O-CS (03.10.2026): die tschechischen Sätze.
  cs: CS,
  // ★ F58 (29.10.2026): die neun Wege sprechen ihre eigene Sprache (vorher RÜCKFALL-EN).
  bg: VORLESE_TEXTE_NEUN.bg.ansagen,
  el: VORLESE_TEXTE_NEUN.el.ansagen,
  hu: VORLESE_TEXTE_NEUN.hu.ansagen,
  nl: VORLESE_TEXTE_NEUN.nl.ansagen,
  pt: VORLESE_TEXTE_NEUN.pt.ansagen,
  br: VORLESE_TEXTE_NEUN.br.ansagen,
  ro: VORLESE_TEXTE_NEUN.ro.ansagen,
  sv: VORLESE_TEXTE_NEUN.sv.ansagen,
  uk: VORLESE_TEXTE_NEUN.uk.ansagen,
};

/** Ein fester Ansage-Satz in der Vorlese-Sprache. */
export function ansage(
  schluessel: AnsageSchluessel,
  lang: Lang = vorleseSprache(),
): string {
  return ANSAGEN[lang][schluessel];
}

/** Ein Satz, der von einem Schalter-Zustand abhängt (an/aus). */
export function ansageSchalter(
  an: AnsageSchluessel,
  aus: AnsageSchluessel,
  wert: boolean,
  lang: Lang = vorleseSprache(),
): string {
  return ansage(wert ? an : aus, lang);
}

// ---------------------------------------------------------------------------
// Sätze mit eingesetzten Werten
// ---------------------------------------------------------------------------

/**
 * „Schritt 2 von 5. Sprache."
 *
 * ★ E12 (26.09.2026): eine Tabelle je Sprache statt einer weiteren
 * Zwei-Wege-Ternäre - dieselbe Begründung wie beim Weichen-Zähler
 * (Bauplan §2.3 Punkt 3): „fr" bekäme sonst still den deutschen Satz.
 */
export function ansageSchritt(
  nummer: number,
  gesamt: number,
  titel: string,
  lang: Lang = vorleseSprache(),
): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].schritt(nummer, gesamt, titel);
  const saetze: Record<Lang, string> = {
    de: `Schritt ${nummer} von ${gesamt}. ${titel}`,
    en: `Step ${nummer} of ${gesamt}. ${titel}`,
    fr: `Étape ${nummer} sur ${gesamt}. ${titel}`,
    es: `Paso ${nummer} de ${gesamt}. ${titel}`,
    it: `Passo ${nummer} di ${gesamt}. ${titel}`,
    // ★ O-PL (02.10.2026): Doppelpunkt statt Punkt - „7." läse eine polnische
    // Stimme als Ordnungszahl („siódmy"); Glossar §2.5 „Krok 2 z 7".
    pl: `Krok ${nummer} z ${gesamt}: ${titel}`,
    // ★ O-TR (02.10.2026): Glossar §2.5 "Adım 2, toplam 7"; Doppelpunkt statt
    // Punkt - "7." ist im Türkischen die Ordnungszahl ("yedinci").
    tr: `Adım ${nummer}, toplam ${gesamt}: ${titel}`,
    // ★ O-CS (03.10.2026): Glossar §2.5 „Krok 2/7" - Schrägstrich statt „z/ze"
    // (Regel 13), Doppelpunkt statt Punkt („7." wäre die Ordnungszahl).
    cs: `Krok ${nummer}/${gesamt}: ${titel}`,
    // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
    bg: `Step ${nummer} of ${gesamt}. ${titel}`,
    el: `Step ${nummer} of ${gesamt}. ${titel}`,
    hu: `Step ${nummer} of ${gesamt}. ${titel}`,
    nl: `Step ${nummer} of ${gesamt}. ${titel}`,
    pt: `Step ${nummer} of ${gesamt}. ${titel}`,
    br: `Step ${nummer} of ${gesamt}. ${titel}`,
    ro: `Step ${nummer} of ${gesamt}. ${titel}`,
    sv: `Step ${nummer} of ${gesamt}. ${titel}`,
    uk: `Step ${nummer} of ${gesamt}. ${titel}`,
  };
  return saetze[lang];
}

/**
 * „Englisch gewählt." / „English selected."
 *
 * ★ E2a (25.09.2026): der öffentliche Parameter bleibt `Lang` (alle
 * Aufrufer reichen ihre eigene, teils dreiwertige Sprache herein) -
 * `gemeinsamGewaehlt` ist aber EINE gemeinsame, abhängigkeitsfreie Datei für
 * ALLE Apps (`lib/ansageGewaehlt.ts`, `AnsageSprache = "de" | "en"`); ihr Typ
 * wird hier NICHT angefasst (gehört besprochen, siehe `apps/GEMEINSAM.md`).
 * „fr" wird darum ERST HIER, unmittelbar vor der Weitergabe, auf „en"
 * abgebildet (nicht auf „de" - dieselbe Begründung wie bei `rueckmeldung.ts`).
 *
 * ★ ES-F2 (27.09.2026): „es" ebenso - `AnsageSprache` bleibt
 * `"de" | "en" | "fr"` (kein Gerüst-Auftrag, dieselbe Datei anzufassen), also
 * bildet dieselbe Stelle „es" auf „en" ab (vorerst Englisch, ES-O).
 * ⇒ Überholt seit ES-O (siehe unten): „es" geht unverändert durch.
 */
// ★ ES-O (27.09.2026, Bauplan D6 - gemeinsame Teile in der Sprache): die
// gemeinsame Datei `lib/ansageGewaehlt.ts` kennt jetzt „es" („Elegido: …").
const GEWAEHLT_NEUN: Readonly<Record<GeruestSprache, string>> = {
  bg: "Избрано:",
  el: "Επιλογή:",
  hu: "Kiválasztva:",
  nl: "Gekozen:",
  pt: "Selecionado:",
  br: "Selecionado:",
  ro: "Selectat:",
  sv: "Valt:",
  uk: "Вибрано:",
};

export function ansageGewaehlt(was: string, lang: Lang = vorleseSprache()): string {
  // ★ 31.08.2026: Der Satz steht seither in `src/lib/ansageGewaehlt.ts` -
  //   einer abhängigkeitsfreien Datei, die ALLE Apps benutzen können. Diese
  //   hier bleibt als Tür für Tastenflow stehen (sie kennt die aktuelle
  //   Vorlese-Sprache), gibt den Wortlaut aber nur noch weiter.
  // ★ E11a-5: die gemeinsame Datei kennt jetzt „fr" - kein Rückfall mehr.
  // ★ ES-O: und seit ES-O auch „es" - kein Rückfall mehr.
  // ★ G2a: die gemeinsame Datei (mehrere Apps) kennt nur de/en/fr/es - it/pl/tr/cs
  // sprechen vorerst englisch.
  // ★ O-IT (02.10.2026): sie kennt jetzt auch „it" („Scelta: …").
  // ★ O-PL (02.10.2026): und „pl" („Wybrano: ...").
  // ★ O-TR (02.10.2026): und "tr" ("Seçildi: ...").
  // ★ O-CS (03.10.2026): und „cs" („Vybráno: ...") - alle Sprachen gehen durch.
  // ★ O4 (30.10.2026): die neun hier (die gemeinsame Datei gehört mehreren Apps und kennt sie nicht).
  // Ohne Geschlechtsendung am Etikett: Wort, Doppelpunkt, das Etikett ungebeugt.
  if (istGeruestSprache(lang)) return `${GEWAEHLT_NEUN[lang]} ${was}.`;
  return gemeinsamGewaehlt(was, lang);
}

/** „Tastatur: Österreich." */
export function ansageTastatur(kurz: string, lang: Lang = vorleseSprache()): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].tastatur(kurz);
  const saetze: Record<Lang, string> = {
    de: `Tastatur: ${kurz}.`,
    en: `Keyboard: ${kurz}.`,
    fr: `Clavier : ${kurz}.`,
    es: `Teclado: ${kurz}.`,
    it: `Tastiera: ${kurz}.`,
    pl: `Klawiatura: ${kurz}.`,
    tr: `Klavye: ${kurz}.`,
    // ★ O-CS (03.10.2026): Glossar §2.1 „klávesnice".
    cs: `Klávesnice: ${kurz}.`,
    // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
    bg: `Keyboard: ${kurz}.`,
    el: `Keyboard: ${kurz}.`,
    hu: `Keyboard: ${kurz}.`,
    nl: `Keyboard: ${kurz}.`,
    pt: `Keyboard: ${kurz}.`,
    br: `Keyboard: ${kurz}.`,
    ro: `Keyboard: ${kurz}.`,
    sv: `Keyboard: ${kurz}.`,
    uk: `Keyboard: ${kurz}.`,
  };
  return saetze[lang];
}

/** „Start: Grundstellung." */
export function ansageStart(label: string, lang: Lang = vorleseSprache()): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].start(label);
  // EN2 (19.09.2026): Glossar §3.4 - Startpunkt = *starting point*.
  const saetze: Record<Lang, string> = {
    de: `Start: ${label}.`,
    en: `Starting point: ${label}.`,
    // Glossar §9.2: „Start" = *position de départ*.
    fr: `Départ : ${label}.`,
    es: `Punto de partida: ${label}.`,
    it: `Punto di partenza: ${label}.`,
    // ★ O-PL: Glossar §2.2 „punkt startowy".
    pl: `Punkt startowy: ${label}.`,
    // ★ O-TR: Glossar §2.2 "başlangıç noktası".
    tr: `Başlangıç noktası: ${label}.`,
    // ★ O-CS (03.10.2026): Glossar §2.2 „výchozí bod".
    cs: `Výchozí bod: ${label}.`,
    // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
    bg: `Starting point: ${label}.`,
    el: `Starting point: ${label}.`,
    hu: `Starting point: ${label}.`,
    nl: `Starting point: ${label}.`,
    pt: `Starting point: ${label}.`,
    br: `Starting point: ${label}.`,
    ro: `Starting point: ${label}.`,
    sv: `Starting point: ${label}.`,
    uk: `Starting point: ${label}.`,
  };
  return saetze[lang];
}

/** „Angemeldet als Mira." */
export function ansageAngemeldet(name: string, lang: Lang = vorleseSprache()): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].angemeldet(name);
  const saetze: Record<Lang, string> = {
    de: `Angemeldet als ${name}.`,
    en: `Signed in as ${name}.`,
    fr: `Connexion en tant que ${name}.`,
    es: `Sesión iniciada como ${name}.`,
    it: `Accesso effettuato come ${name}.`,
    // ★ O-PL: -no-Form und Name nach Doppelpunkt (Glossar §2.5, Regel 11).
    pl: `Zalogowano jako: ${name}.`,
    // ★ O-TR: Name nach Doppelpunkt, keine Endung an den Namen (Glossar Regel 6).
    tr: `Giriş yapıldı: ${name}.`,
    // ★ O-CS (03.10.2026): Name nach Doppelpunkt, nie gebeugt, kein Partizip am
    // Kind (Glossar Regel 2 und 12) - das Adjektiv steht am Konto.
    cs: `Přihlášený účet: ${name}.`,
    // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
    bg: `Signed in as ${name}.`,
    el: `Signed in as ${name}.`,
    hu: `Signed in as ${name}.`,
    nl: `Signed in as ${name}.`,
    pt: `Signed in as ${name}.`,
    br: `Signed in as ${name}.`,
    ro: `Signed in as ${name}.`,
    sv: `Signed in as ${name}.`,
    uk: `Signed in as ${name}.`,
  };
  return saetze[lang];
}

/** „Belohnungs-Spiel: Eisschollen." */
export function ansageBelohnungsspiel(
  label: string,
  lang: Lang = vorleseSprache(),
): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].belohnungsspiel(label);
  const saetze: Record<Lang, string> = {
    de: `Belohnungs-Spiel: ${label}.`,
    en: `Reward game: ${label}.`,
    fr: `Jeu de récompense : ${label}.`,
    es: `Juego de recompensa: ${label}.`,
    it: `Gioco premio: ${label}.`,
    pl: `Gra w nagrodę: ${label}.`,
    tr: `Ödül oyunu: ${label}.`,
    // ★ O-CS (03.10.2026): Glossar §2.3 „odměnová hra".
    cs: `Odměnová hra: ${label}.`,
    // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
    bg: `Reward game: ${label}.`,
    el: `Reward game: ${label}.`,
    hu: `Reward game: ${label}.`,
    nl: `Reward game: ${label}.`,
    pt: `Reward game: ${label}.`,
    br: `Reward game: ${label}.`,
    ro: `Reward game: ${label}.`,
    sv: `Reward game: ${label}.`,
    uk: `Reward game: ${label}.`,
  };
  return saetze[lang];
}

// (Bis 11.09.2026 stand hier `ansageAbzeichen()`, entfernt weil ungenutzt.)

/**
 * ★★★★ EIN PUNKT HINTER EINER ZAHL MACHT SIE ZUR ORDNUNGSZAHL (20.09.2026).
 *
 * Johannes, wörtlich, nach Testerin Durchgang: *„Beim Fingerdiktat sagt es immer
 * noch 2 von 12-te."* Hier stand `Zeile 2 von 12. Noch 10 Zeilen.` - und jede
 * deutsche Sprachausgabe liest „12." als „zwölfte", weil genau so eine
 * Ordnungszahl geschrieben wird. Das Kind hört „zwei von zwölfte".
 *
 * Die Behebung ist ein KOMMA statt des Punktes: Die Pause bleibt, die Zahl
 * bleibt eine Grundzahl. Die Regel gilt überall, wo eine Ansage mit einer
 * Zahl endet - der Wächter `tests/tastenflow-ansage-ordnungszahl.test.ts`
 * hält sie fest.
 *
 * ★ E12 (26.09.2026, Bauplan §11.1, Auftrag Punkt 3): dieselbe Falle gilt auf
 * Französisch - „2." läse eine französische Stimme sonst möglicherweise als
 * „deuxième" statt „deux". Das Komma umgeht sie genau wie im Deutschen und
 * Englischen (ungemessen mit einer echten Stimme, E14 misst nach - §11.2).
 *
 * ★★★ ES-F8 (27.09.2026): dieselbe Falle auf Spanisch - „2." läse eine
 * spanische Stimme womöglich als „segunda" statt „dos". Dasselbe Komma.
 */
function standSatz(
  wort: {
    de: [string, string];
    en: [string, string];
    fr: [string, string];
    es: [string, string];
    it: [string, string];
    /** ★ O-PL: vier Formen - one (1), few (2-4), many (5+), other (Bruchzahl, Genitiv). */
    pl: [string, string, string, string];
    /** ★ O-TR: ein Wort - nach einer Zahl steht im Türkischen die Einzahl ("9 satır"). */
    tr: string;
    /**
     * ★ O-CS (03.10.2026): vier Formen (Glossar §2.11) - one (1), few (2-4),
     * many (Bruchzahl, Genitiv Einzahl), other (0, 5+, Genitiv Mehrzahl).
     */
    cs: { one: string; few: string; many: string; other: string };
  },
  aktuell: number,
  gesamt: number,
  lang: Lang,
): string {
  // ★ O-CS (03.10.2026): „Řádek 3/12, zbývá 9 řádků." - Schrägstrich statt
  // „z/ze" (Glossar Regel 13, die Präposition hinge am Zahlwort), das Verb zieht
  // mit der Zahl mit (zbývá 1 řádek · zbývají 2 řádky · zbývá 5 řádků, §2.11),
  // am Ende steht das Hauptwort - nie eine Zahl mit Punkt (§4 Falle 4).
  // RÜCKFALL-EN (G2-NEUN): die neun Sprachen des Gerüsts bekommen Englisch - nie den deutschen Rest der Kette.
  lang = geruestAufEn(lang);
  if (lang === "cs") {
    const w = wort.cs;
    const restCs = Math.max(0, gesamt - aktuell);
    const schwanz =
      restCs > 0
        ? `${mehrzahl(restCs, "cs", {
            one: (z) => `zbývá ${z} ${w.one}`,
            few: (z) => `zbývají ${z} ${w.few}`,
            many: (z) => `zbývá ${z} ${w.many}`,
            other: (z) => `zbývá ${z} ${w.other}`,
          })}.`
        : `poslední ${w.one}.`; // hinter dem Komma klein; „poslední" passt zu jedem Geschlecht
    const kopf = `${grossFuer(w.one.slice(0, 1), "cs")}${w.one.slice(1)}`;
    return `${kopf} ${aktuell}/${gesamt}, ${schwanz}`;
  }
  // ★ O-TR (02.10.2026): "Satır 3, toplam 12, 9 satır kaldı." - Glossar Regel 6
  // (nie "3 / 12", nie "12'den 3'ü": keine Endung an eine Zahl). KOMMA hinter
  // "12" wie oben: im Türkischen IST "12." die Ordnungszahl ("on ikinci").
  // Nach der Zahl die Einzahl ("9 satır"); am Ende "son satır." bzw. "son soru."
  // (mit dem Wort des Bildschirms - eine Aufgabe ist keine Zeile).
  if (lang === "tr") {
    const restTr = Math.max(0, gesamt - aktuell);
    const schwanz =
      restTr > 0 ? `${restTr} ${wort.tr} kaldı.` : `son ${kleinFuer(wort.tr, "tr")}.`; // hinter dem Komma klein
    const kopf = `${grossFuer(wort.tr.slice(0, 1), "tr")}${wort.tr.slice(1)}`;
    return `${kopf} ${aktuell}, toplam ${gesamt}, ${schwanz}`;
  }
  // ★ O-PL (02.10.2026): „Wiersz 3 z 12, jeszcze 9 wierszy." - ohne Verb (das
  // müsste mit der Zahl mitbeugen: został/zostały/zostało), die Form des Wortes
  // nach der Zahl (Glossar §2.10a). Dasselbe Komma wie oben.
  if (lang === "pl") {
    const [one, few, many, other] = wort.pl;
    const restPl = Math.max(0, gesamt - aktuell);
    const schwanz =
      restPl > 0
        ? `jeszcze ${mehrzahl(restPl, "pl", {
            one: (z) => `${z} ${one}`,
            few: (z) => `${z} ${few}`,
            many: (z) => `${z} ${many}`,
            other: (z) => `${z} ${other}`,
          })}.`
        : ansage("letzteZeile", lang).toLowerCase(); // hinter dem Komma klein
    const kopf = `${one[0].toUpperCase()}${one.slice(1)}`;
    return `${kopf} ${aktuell} z ${gesamt}, ${schwanz}`;
  }
  // ★ O-IT (02.10.2026): „Riga 3 di 12, mancano 9 righe." - dasselbe Komma wie
  // oben („12." läse eine italienische Stimme sonst womöglich als „dodicesima").
  if (lang === "it") {
    const [eins, viele] = wort.it;
    const rest2 = Math.max(0, gesamt - aktuell);
    const schwanz =
      rest2 > 0
        ? rest2 === 1
          ? `manca ${rest2} ${eins}.`
          : `mancano ${rest2} ${viele}.`
        : ansage("letzteZeile", lang).toLowerCase(); // hinter dem Komma klein
    const kopf = `${eins[0].toUpperCase()}${eins.slice(1)}`;
    return `${kopf} ${aktuell} di ${gesamt}, ${schwanz}`;
  }
  const rest = Math.max(0, gesamt - aktuell);
  // Der Schwanz steht hinter einem Komma und beginnt darum klein - ausser er
  // ist ein eigener Satz aus dem Ansagen-Vorrat („Letzte Zeile.").
  if (lang === "en") {
    const [eins, viele] = wort.en;
    const schwanz =
      rest > 0 ? `${rest} ${rest === 1 ? eins : viele} to go.` : ansage("letzteZeile", lang);
    const kopf = `${eins[0].toUpperCase()}${eins.slice(1)}`;
    // Komma statt Punkt - siehe oben („12." wird sonst zur Ordnungszahl).
    return `${kopf} ${aktuell} of ${gesamt}, ${schwanz}`;
  }
  if (lang === "fr") {
    const [eins, viele] = wort.fr;
    const schwanz =
      rest > 0 ? `encore ${rest} ${rest === 1 ? eins : viele}.` : ansage("letzteZeile", lang);
    const kopf = `${eins[0].toUpperCase()}${eins.slice(1)}`;
    return `${kopf} ${aktuell} sur ${gesamt}, ${schwanz}`;
  }
  if (lang === "es") {
    const [eins, viele] = wort.es;
    const schwanz =
      rest > 0
        ? rest === 1
          ? `queda ${rest} ${eins}.`
          : `quedan ${rest} ${viele}.`
        : ansage("letzteZeile", lang).toLowerCase(); // hinter dem Komma klein
    const kopf = `${eins[0].toUpperCase()}${eins.slice(1)}`;
    return `${kopf} ${aktuell} de ${gesamt}, ${schwanz}`;
  }
  const [eins, viele] = wort.de;
  const schwanz =
    rest > 0 ? `noch ${rest} ${rest === 1 ? eins : viele}.` : ansage("letzteZeile", lang);
  return `${eins} ${aktuell} von ${gesamt}, ${schwanz}`;
}

/** „Zeile 3 von 12, noch 9 Zeilen." */
export function ansageZeilenstand(
  aktuell: number,
  gesamt: number,
  lang: Lang = vorleseSprache(),
): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].stand(aktuell, gesamt, "zeile");
  return standSatz(
    {
      de: ["Zeile", "Zeilen"],
      en: ["line", "lines"],
      fr: ["ligne", "lignes"],
      es: ["línea", "líneas"],
      it: ["riga", "righe"],
      pl: ["wiersz", "wiersze", "wierszy", "wiersza"],
      tr: "satır",
      // ★ O-CS: Glossar §2.11 „1 řádek · 2 řádky · 5 řádků · 1,5 řádku".
      cs: { one: "řádek", few: "řádky", many: "řádku", other: "řádků" },
    },
    aktuell,
    gesamt,
    lang,
  );
}

/**
 * „Aufgabe 3 von 12, noch 9 Aufgaben." - für die Bildschirme, auf denen
 * AUFGABEN stehen und keine Zeilen (Rätsel, Fingerdiktat, Lückentext).
 * Bis 20.09.2026 sagten auch sie „Zeile", während daneben sichtbar „Aufgabe 3
 * von 12" stand.
 */
export function ansageAufgabenstand(
  aktuell: number,
  gesamt: number,
  lang: Lang = vorleseSprache(),
): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].stand(aktuell, gesamt, "aufgabe");
  return standSatz(
    {
      de: ["Aufgabe", "Aufgaben"],
      en: ["question", "questions"],
      fr: ["exercice", "exercices"],
      es: ["ejercicio", "ejercicios"],
      it: ["domanda", "domande"],
      pl: ["zadanie", "zadania", "zadań", "zadania"],
      // ★ O-TR: Glossar §2.2 "Soru 3, toplam 6".
      tr: "soru",
      // ★ O-CS: Glossar §2.2 „Úloha 3/6" (nie „úkol" = Hausaufgabe).
      cs: { one: "úloha", few: "úlohy", many: "úlohy", other: "úloh" },
    },
    aktuell,
    gesamt,
    lang,
  );
}

/** „Übezeit: 12 Minuten. Noch 8 Minuten bis zum Wochenziel." */
export function ansageUebezeit(
  zeit: string,
  wochenziel: string | null,
  lang: Lang = vorleseSprache(),
): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].uebezeit(zeit) + (wochenziel ? `. ${wochenziel}` : "");
  const koepfe: Record<Lang, string> = {
    de: `Übezeit: ${zeit}`,
    en: `Practice time: ${zeit}`,
    fr: `Temps d'exercice : ${zeit}`,
    es: `Tiempo de práctica: ${zeit}`,
    it: `Tempo di esercizio: ${zeit}`,
    // ★ O-PL: Glossar §2.2 „czas ćwiczeń".
    pl: `Czas ćwiczeń: ${zeit}`,
    // ★ O-TR: Glossar §2.2 "çalışma süresi".
    tr: `Çalışma süresi: ${zeit}`,
    // ★ O-CS (03.10.2026): Glossar §2.2 „čas procvičování".
    cs: `Čas procvičování: ${zeit}`,
    // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
    bg: `Practice time: ${zeit}`,
    el: `Practice time: ${zeit}`,
    hu: `Practice time: ${zeit}`,
    nl: `Practice time: ${zeit}`,
    pt: `Practice time: ${zeit}`,
    br: `Practice time: ${zeit}`,
    ro: `Practice time: ${zeit}`,
    sv: `Practice time: ${zeit}`,
    uk: `Practice time: ${zeit}`,
  };
  return koepfe[lang] + (wochenziel ? `. ${wochenziel}` : "");
}

/** „Aufstieg! Du wirst immer besser. " - der Vorspann der Abschluss-Ansage. */
export function ansageAufstieg(sober: boolean, lang: Lang = vorleseSprache()): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].aufstieg(sober);
  const saetze: Record<Lang, string> = /* RÜCKFALL-EN (G2-NEUN) */ mitRueckfallEn({
    de: sober ? "Aufstieg: nächste Übungsstufe. " : "Aufstieg! Du wirst immer besser. ",
    en: sober
      ? "Level up: next practice level. "
      : "Level up! You are getting better and better. ",
    fr: sober ? "Niveau supérieur : palier suivant. " : "Niveau supérieur ! Tu progresses de plus en plus. ",
    es: sober
      ? "Subida de nivel: siguiente nivel de práctica. "
      : "¡Subida de nivel! Cada vez lo haces mejor. ",
    it: sober
      ? "Livello superiore: prossimo livello. "
      : "Livello superiore! Stai migliorando sempre di più. ",
    // ★ O-PL (02.10.2026): „Idzie ci coraz lepiej" - verrät kein Geschlecht.
    pl: sober ? "Awans: następny poziom. " : "Awans! Idzie ci coraz lepiej. ",
    // ★ O-TR (02.10.2026): sen; Glossar §2.2 "seviye", höchstens ein Ausrufezeichen.
    tr: sober
      ? "Yeni seviye: sonraki alıştırma seviyesi. "
      : "Seviye atladın! Gittikçe daha iyi oluyorsun. ",
    // ★ O-CS (03.10.2026): „Jde ti to čím dál líp" verrät kein Geschlecht
    // (Glossar Regel 2); Glossar §2.2 „úroveň", höchstens ein Ausrufezeichen.
    cs: sober
      ? "Postup: další úroveň cvičení. "
      : "Postup na další úroveň! Jde ti to čím dál líp. ",
  });
  return saetze[lang];
}

/**
 * „ Neue Abzeichen: Schnellzug, Eule und 2 weitere!" - höchstens drei werden
 * genannt, sonst wird die Ansage ein Vortrag.
 */
export function ansageNeueAbzeichen(
  namen: string[],
  gesamt: number,
  sober: boolean,
  lang: Lang = vorleseSprache(),
): string {
  if (!namen.length) return "";
  const ende = sober ? "." : "!";
  const rest = gesamt - namen.length;
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].neueAbzeichen(namen, gesamt, rest, ende);
  // ★ O-CS (03.10.2026): Glossar §2.4 - „odznak", Name nach Doppelpunkt („Nový
  // odznak: Knihomol"); „a 2 další · a 5 dalších" mit vier Formen (§2.11).
  // RÜCKFALL-EN (G2-NEUN): die neun Sprachen des Gerüsts bekommen Englisch - nie den deutschen Rest der Kette.
  lang = geruestAufEn(lang);
  if (lang === "cs") {
    const kopf = mehrzahl(gesamt, "cs", {
      one: () => "Nový odznak: ",
      few: () => "Nové odznaky: ",
      many: () => "Nové odznaky: ",
      other: () => "Nové odznaky: ",
    });
    const mehr =
      rest > 0
        ? ` a ${mehrzahl(rest, "cs", {
            one: (z) => `${z} další`,
            few: (z) => `${z} další`,
            many: (z) => `${z} dalšího`,
            other: (z) => `${z} dalších`,
          })}`
        : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  }
  // ★ O-TR (02.10.2026): Glossar §2.4 - "rozet"; "ve 2 rozet daha" - Einzahl
  // nach der Zahl, keine Endung an die Zahl (Regel 6).
  if (lang === "tr") {
    const kopf = gesamt === 1 ? "Yeni rozet: " : "Yeni rozetler: ";
    const mehr = rest > 0 ? ` ve ${rest} rozet daha` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  }
  // ★ O-PL (02.10.2026): Glossar §2.4 - „odznaka"; „i jeszcze 2" ohne Hauptwort
  // nach der Zahl (sonst müsste es sich beugen).
  if (lang === "pl") {
    const kopf = gesamt === 1 ? "Nowa odznaka: " : "Nowe odznaki: ";
    const mehr = rest > 0 ? ` i jeszcze ${rest}` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  }
  // ★ O-IT (02.10.2026): Glossar §2.4 - „medaglia" für Abzeichen.
  if (lang === "it") {
    const kopf = gesamt === 1 ? "Nuova medaglia: " : "Nuove medaglie: ";
    const mehr = rest > 0 ? ` e altre ${rest}` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  }
  if (lang === "en") {
    const kopf = gesamt === 1 ? "New badge: " : "New badges: ";
    const mehr = rest > 0 ? ` and ${rest} more` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  }
  if (lang === "fr") {
    const kopf = gesamt === 1 ? "Nouveau badge : " : "Nouveaux badges : ";
    const mehr = rest > 0 ? ` et ${rest} de plus` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  }
  // ★ ES-F8 (27.09.2026): Glossar §7 - „insignia" statt „Abzeichen"/„badge".
  if (lang === "es") {
    const kopf = gesamt === 1 ? "Nueva insignia: " : "Nuevas insignias: ";
    const mehr = rest > 0 ? ` y ${rest} más` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  }
  const kopf = gesamt === 1 ? "Neues Abzeichen: " : "Neue Abzeichen: ";
  const mehr = rest > 0 ? ` und ${rest} weitere` : "";
  return " " + kopf + namen.join(", ") + mehr + ende;
}

/** „ Treffsicherheit 95 %, 120 Anschläge pro Minute." */
export function ansageWerte(
  treffsicherheit: string,
  tempo: number,
  lang: Lang = vorleseSprache(),
): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].werte(treffsicherheit, tempo);
  // ★ ES-F8 (27.09.2026, Bauplan §7): „pulsaciones por minuto" ausgeschrieben
  // (wie im Oberflächen-Glossar - „ppm" wäre doppeldeutig).
  const saetze: Record<Lang, string> = /* RÜCKFALL-EN (G2-NEUN) */ mitRueckfallEn({
    de: ` Treffsicherheit ${treffsicherheit}, ${tempo} Anschläge pro Minute.`,
    en: ` Accuracy ${treffsicherheit}, ${tempo} keystrokes per minute.`,
    fr: ` Précision ${treffsicherheit}, ${tempo} frappes par minute.`,
    es: ` Precisión ${treffsicherheit}, ${tempo} pulsaciones por minuto.`,
    it: ` Precisione ${treffsicherheit}, ${tempo} battute al minuto.`,
    // ★ O-PL (02.10.2026): Glossar Regel 7 - „uderzeń na minutę", vier Formen.
    pl: ` Dokładność ${treffsicherheit}, ${mehrzahl(tempo, "pl", {
      one: (z) => `${z} uderzenie na minutę`,
      few: (z) => `${z} uderzenia na minutę`,
      many: (z) => `${z} uderzeń na minutę`,
      other: (z) => `${z} uderzenia na minutę`,
    })}.`,
    // ★ O-TR (02.10.2026): Glossar §2.2 "doğruluk", "dakikada vuruş" (Einzahl nach
    // der Zahl); der Wert kommt schon als "%95" (fmtPercent). Komma statt Punkt
    // hinter "%95" - "95." wäre die Ordnungszahl.
    tr: ` Doğruluk: ${treffsicherheit}, dakikada ${tempo} vuruş.`,
    // ★ O-CS (03.10.2026): Glossar Regel 6 - „přesnost", „rychlost", „úhozy za
    // minutu" mit vier Formen (§2.11); der Wert kommt schon als „95 %"
    // (fmtPercent, geschütztes Leerzeichen); am Satzende „minutu", nie die Zahl.
    cs: ` Přesnost: ${treffsicherheit}, rychlost: ${mehrzahl(tempo, "cs", {
      one: (z) => `${z} úhoz za minutu`,
      few: (z) => `${z} úhozy za minutu`,
      many: (z) => `${z} úhozu za minutu`,
      other: (z) => `${z} úhozů za minutu`,
    })}.`,
  });
  return saetze[lang];
}

/**
 * Der Umschalt-Hinweis bei falscher Umschalt-Seite - „Fast! Das große A braucht
 * die linke Umschalttaste, nicht die andere und nicht die Feststelltaste."
 */
export function ansageUmschaltSeite(
  zeichenName: string,
  seiteLinks: boolean,
  lang: Lang = vorleseSprache(),
): string {
  // ★ F58 (29.10.2026): die neun Wege aus `vorleseTexte<Xx>.ts` (vorher RÜCKFALL-EN).
  if (istGeruestSprache(lang)) return VORLESE_TEXTE_NEUN[lang].umschaltSeite(zeichenName, seiteLinks);
  // ★ O-CS (03.10.2026): Glossar §2.1/§2.9 - Tastenname nie gebeugt, darum mit
  // Kopfwort „klávesu Shift" (Regel 11); Satzanfang gross („velké A" ⇒ „Velké A").
  if (lang === "cs")
    return (
      `Skoro! ${grossFuer(zeichenName.slice(0, 1), "cs")}${zeichenName.slice(1)} vyžaduje ` +
      `${seiteLinks ? "levou" : "pravou"} klávesu Shift, ne tu druhou a ne Caps Lock.`
    );
  // ★ O-TR (02.10.2026): Glossar §2.1/§2.9 - die Endung an "tuş".
  if (lang === "tr")
    return (
      `Neredeyse! ${grossFuer(zeichenName.slice(0, 1), "tr")}${zeichenName.slice(1)} için ${seiteLinks ? "sol" : "sağ"} Shift tuşu gerekir; ` +
      "diğeri ve Caps Lock olmaz."
    );
  // ★ O-PL (02.10.2026): Glossar §2.9 - „Shift".
  if (lang === "pl")
    return (
      `Prawie! ${zeichenName} wymaga ${seiteLinks ? "lewego" : "prawego"} klawisza Shift, ` +
      "nie drugiego i nie Caps Lock."
    );
  // ★ O-IT (02.10.2026): Glossar §2.9 - „Maiusc".
  if (lang === "it")
    return (
      `Quasi! ${zeichenName} richiede il tasto Maiusc ${seiteLinks ? "sinistro" : "destro"}, ` +
      "non l'altro e non Bloc Maiusc."
    );
  if (lang === "en")
    return (
      `Almost! ${zeichenName} needs the ${seiteLinks ? "left" : "right"} shift key, ` +
      "not the other one and not the caps lock key."
    );
  if (lang === "fr")
    return (
      `Presque ! ${zeichenName} a besoin de la touche Maj de ${seiteLinks ? "gauche" : "droite"}, ` +
      "pas de l'autre et pas de Verr. Maj."
    );
  // ★ ES-F8 (27.09.2026, Bauplan §7 Glossar: Mayús, Bloq Mayús).
  if (lang === "es")
    return (
      `¡Casi! ${zeichenName} necesita la tecla Mayús ${seiteLinks ? "izquierda" : "derecha"}, ` +
      "no la otra ni Bloq Mayús."
    );
  return (
    `Fast! ${zeichenName} braucht die ${seiteLinks ? "linke" : "rechte"} Umschalttaste ` +
    ", nicht die andere und nicht die Feststelltaste."
  );
}

/**
 * Welche Ansage gehört zu einer Zeilen-Art? Drei Klassen genügen dem Kind:
 * echte Wörter (ob ganzer Satz oder Wort-Übung), Unsinnwörter, Zahlen.
 *
 * ★★ Hier endet die Doppelung, die Jens gefunden hat: Der Generator etikettiert
 * die Zeile ({@link ZeilenArt}), diese Funktion übersetzt das Etikett in einen
 * Satz - und niemand rät mehr am fertigen Text herum.
 */
export function ansageFuerZeilenart(
  art: ZeilenArt,
  lang: Lang = vorleseSprache(),
): string {
  return ansage(
    art === "unsinn"
      ? "jetztUnsinnwoerter"
      : art === "zahlen"
        ? "jetztZahlen"
        : "jetztEchteWoerter",
    lang,
  );
}

/** Dieselbe Zuordnung, aber als Schlüssel - für den Wechsel-Vergleich. */
export function ansageSchluesselFuerZeilenart(art: ZeilenArt): string {
  return art === "unsinn"
    ? "jetztUnsinnwoerter"
    : art === "zahlen"
      ? "jetztZahlen"
      : "jetztEchteWoerter";
}
