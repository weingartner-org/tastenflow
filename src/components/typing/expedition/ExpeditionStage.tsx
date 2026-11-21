/**
 * Die Vollbild-Bühne der Polar-Expedition (Neubau, Bauplan §2). Zwei Betriebsarten:
 *
 *  • SPIELMODUS (ein `course` ist gesetzt, ab E2): die Packeis-Mechanik über den
 *    Hook {@link useExpedition} — Schollen springen, adaptives Zeitfenster (§5),
 *    Eisknacken-Countdown und Bonus-Fisch (§4.1/§6), als Tor oder freies Spiel.
 *  • VORSCHAU (kein `course`, E1-Abnahme-Werkzeug): die statische Kulisse mit dem
 *    Pinguin-Rig; die Debug-Leiste (`debug`) schaltet die sechs Posen und schwenkt
 *    die Kamera.
 *
 * Gemeinsames Gerüst (Bauplan §7): Vollbild-Overlay als `role="dialog" aria-modal`
 * mit Fokus-Falle und Fokus-Rückgabe an den Öffner (WCAG 2.4.3), Spielfeld als
 * `role="application"` (NVDA-Fokusmodus: Tasten kommen durch), Escape bricht ab,
 * Alt-Kürzel bleiben unberührt, weiche rAF-Kamera (springt bei reduced-motion),
 * Live-Regionen nach der Doppelsprech-Regel. Als Portal an `<body>`.
 *
 * ⚠️ Der ursprüngliche Grund für das Portal ist seit dem 04.09.2026 WEG: Bis
 * dahin sperrte `.page-transition` jedes `position: fixed` ein, weil die
 * Animation mit `fill-mode: both` ihren Endzustand (`transform: translateY(0)`)
 * festhielt - die Begründung steht jetzt vollständig in `src/index.css` bei
 * `.page-transition`. Das Portal bleibt trotzdem, und zwar aus dem Grund, aus
 * dem ein modaler Dialog immer eines braucht: Es hängt die Bühne aus dem
 * Stapelkontext der Route heraus, sodass kein `z-index` einer Seite sie
 * überdecken kann. Wer hier aufräumen will, hat also nichts gewonnen.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  cancelSpeech,
  courseSpots,
  speakUi,
  speakUiDe,
  type FloeCourse,
  type LetterStat,
  type Mastery,
} from "@/lib/typing";
import { masteryFor } from "@/lib/typing";
import type { Lernweg } from "@/lib/typing/lernweg";
import { zoneName as zoneNameIn, zoneOf, zoneTrains, type TimeOfDay } from "@/lib/typing/expedition/course";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { useFocusTrap } from "../useFocusTrap";
import { CviAbdunkeln } from "../CviAbdunkeln";
import type { ZeichenabstandFaktor } from "@/lib/typing/zeichenabstand";
import { Hinweisflaeche } from "../Zeigerhinweis";
import { PenguinRig, type PenguinPose } from "./PenguinRig";
import { useExpedition } from "./useExpedition";
import { DiaryCard } from "./DiaryCard";
import { Hud, type HudZone } from "./Hud";
import {
  PACKEIS_GROUND_Y,
  PACKEIS_SHORE_X,
  VIEW_W,
  PackeisScene,
  packeisLayout,
} from "./scenes/PackeisScene";
import { SteilwandScene } from "./scenes/SteilwandScene";
import { SlideScene } from "./scenes/SlideScene";
import { CaveScene } from "./scenes/CaveScene";
import { StormScene } from "./scenes/StormScene";
import { StationScene } from "./scenes/StationScene";
import "./expedition.css";

/** Skalierung des Rigs auf ~190 px Figurhöhe in der 720er-Welt (Bauplan §2). */
const PENGUIN_SCALE = 0.56;

/** Leerer Kurs → der Hook bleibt inert (Vorschaumodus). */
const EMPTY_COURSE: FloeCourse = { stages: [] };
/** Feste Demo-Schollen für die statische Vorschau (E1-Abnahme). */
const PREVIEW_COURSE: FloeCourse = { stages: [{ kind: "water", units: ["F", "J", "D", "K"] }] };
const PREVIEW_SPOTS = courseSpots(PREVIEW_COURSE);
const PREVIEW_LAYOUT = packeisLayout(PREVIEW_SPOTS);

/**
 * Die Posen der Debug-Leiste (nur Vorschau-Abnahme). ★ E11a-5 (26.09.2026): die
 * Beschriftung als Tabelle je Bedienungssprache statt `label`/`labelEn` und einer
 * Weiche, die „fr" still deutsch gelassen hätte (Leitfaden Falle 30).
 */
// ★ ES-O (27.09.2026): auch die interne Vorschau-Leiste spanisch.
export const POSES: { p: PenguinPose; label: Record<BedienSprache, string> }[] = [
  { p: "idle", label: { de: "Stehen & atmen", en: "Stand & breathe", fr: "Debout et respirer", es: "De pie y respirar", it: "In piedi e respirare", pl: "Stanie i oddychanie", tr: "Durmak ve nefes almak", cs: "Stát a dýchat", bg: "Стоене и дишане", el: "Στάση και ανάσα", hu: "Állás és légzés", nl: "Staan en ademen", pt: "Parar e respirar", br: "Parar e respirar", ro: "Stă și respiră", sv: "Stå och andas", uk: "Стояти й дихати" /* ★ O-PL (02.10.2026): pl; ★ O-TR (02.10.2026): tr; ★ O-CS (03.10.2026): cs */ } },
  { p: "walk", label: { de: "Watscheln", en: "Waddle", fr: "Se dandiner", es: "Andar como un pato", it: "Camminare dondolando", pl: "Kaczy chód", tr: "Paytak yürümek", cs: "Kolébat se", bg: "Клатушкане", el: "Βάδισμα πιγκουίνου", hu: "Totyogás", nl: "Waggelen", pt: "Bambolear-se", br: "Andar gingando", ro: "Merge legănat", sv: "Vagga", uk: "Перевалюватися" /* ★ O-PL (02.10.2026): pl; ★ O-TR (02.10.2026): tr; ★ O-CS (03.10.2026): cs */ } },
  { p: "jump", label: { de: "Springen", en: "Jump", fr: "Sauter", es: "Saltar", it: "Saltare", pl: "Skok", tr: "Zıplamak", cs: "Skákat", bg: "Скачане", el: "Άλμα", hu: "Ugrás", nl: "Springen", pt: "Saltar", br: "Pular", ro: "Sare", sv: "Hoppa", uk: "Стрибати" /* ★ O-PL (02.10.2026): pl; ★ O-TR (02.10.2026): tr; ★ O-CS (03.10.2026): cs */ } },
  { p: "slide", label: { de: "Bauchrutsche", en: "Belly slide", fr: "Glisser sur le ventre", es: "Deslizarse sobre la barriga", it: "Scivolare sulla pancia", pl: "Ślizg na brzuchu", tr: "Karın üstü kaymak", cs: "Klouzat po bříšku", bg: "Пързаляне по корем", el: "Τσουλήθρα με την κοιλιά", hu: "Hasoncsúszás", nl: "Buikglijden", pt: "Escorregar de barriga", br: "Escorregar de barriga", ro: "Alunecă pe burtă", sv: "Magåka", uk: "Ковзати на животику" /* ★ O-PL (02.10.2026): pl; ★ O-TR (02.10.2026): tr; ★ O-CS (03.10.2026): cs */ } },
  { p: "scare", label: { de: "Erschrecken", en: "Startle", fr: "Sursauter", es: "Asustarse", it: "Spaventarsi", pl: "Przestrach", tr: "İrkilmek", cs: "Leknout se", bg: "Стряскане", el: "Ξάφνιασμα", hu: "Ijedtség", nl: "Schrikken", pt: "Assustar-se", br: "Levar um susto", ro: "Se sperie", sv: "Bli rädd", uk: "Злякатися" /* ★ O-PL (02.10.2026): pl; ★ O-TR (02.10.2026): tr; ★ O-CS (03.10.2026): cs */ } },
  { p: "cheer", label: { de: "Jubeln", en: "Cheer", fr: "Se réjouir", es: "Celebrar", it: "Esultare", pl: "Radość", tr: "Sevinmek", cs: "Radovat se", bg: "Ликуване", el: "Πανηγυρισμός", hu: "Ujjongás", nl: "Juichen", pt: "Festejar", br: "Comemorar", ro: "Se bucură", sv: "Jubla", uk: "Радіти" /* ★ O-PL (02.10.2026): pl; ★ O-TR (02.10.2026): tr; ★ O-CS (03.10.2026): cs */ } },
];

/**
 * ★ Die Bühne der Polar-Expedition in beiden Bedienungssprachen (EN3,
 * 19.09.2026). Die Expedition ist Spiel-BEDIENUNG und folgt der
 * Bedienungssprache (Glossar §4, §6 Nr. 5 - entschieden in EN3). Deutsch
 * wortgleich wie vorher. Glossar §3.6: *Polar Expedition*, *expedition
 * diary*, *floe*, *zone*; §1.6: *Done*, *Close*; Leertaste ⇒ *space bar* ★.
 * Ton wie im Deutschen: „Nochmal spielen!" fürs Kind, „Noch eine Runde"
 * für Erwachsene.
 */
export const BUEHNE_TEXTE = texte({
  de: {
    vorschauAnsage: (zone: string) => `Polar-Expedition. Zone: ${zone}. Escape schließt die Bühne.`,
    geschuetzt: (erwachsen: boolean) =>
      erwachsen
        ? " Der erste Schritt ist geschützt."
        : " Der erste Schritt ist geschützt - hier kann nichts schiefgehen.",
    tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
      `Expeditionstagebuch. ${zone}. ${aufgabe} Beispiel: ${beispiel}${geschuetzt} Drück die Leertaste, um zu starten.`,
    dialogName: (zone: string) => `Polar-Expedition: ${zone}`,
    spur: "Anflugspur",
    herzen: "Herzen dieser Zone",
    helleHoehle: (an: boolean) => (an ? "🔆 Helle Höhle: an" : "🔅 Helle Höhle: aus"),
    art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Freies Spiel" : "Tor: neue Taste") : "Vorschau"),
    spielfeld:
      "Spielfeld der Polar-Expedition. Drück die Taste der leuchtenden Scholle. Escape bricht ab.",
    rueckenwind: "Rückenwind: gleichmäßiges Tippen",
    weiterReise: (erwachsen: boolean) => (erwachsen ? "Weiter zur nächsten Zone …" : "Weiter geht die Reise …"),
    reiseAbbrechen: "Reise abbrechen (Esc)",
    nochmal: (erwachsen: boolean) => (erwachsen ? "Noch eine Runde" : "Nochmal spielen!"),
    fertig: "Fertig",
    beenden: (frei: boolean, erwachsen: boolean) =>
      frei ? "Spiel beenden (Esc)" : erwachsen ? "Später wiederholen (Esc)" : "Vielleicht später (Esc)",
    vorschauStatus: "Vorschau · Bühne & Pinguin-Rig - ",
    schliessen: "Schließen",
    debug: "Debug: Posen und Kamera",
    schwenken: "Blick schwenken",
  },
  en: {
    vorschauAnsage: (zone: string) => `Polar Expedition. Zone: ${zone}. Escape closes the game.`,
    geschuetzt: (erwachsen: boolean) =>
      erwachsen ? " The first step is protected." : " The first step is protected - nothing can go wrong here.",
    tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
      `Expedition diary. ${zone}. ${aufgabe} Example: ${beispiel}${geschuetzt} Press the space bar to start.`,
    dialogName: (zone: string) => `Polar Expedition: ${zone}`,
    spur: "Flight path",
    herzen: "Hearts in this zone",
    helleHoehle: (an: boolean) => (an ? "🔆 Bright cave: on" : "🔅 Bright cave: off"),
    art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Free play" : "Gate: new key") : "Preview"),
    spielfeld:
      "Polar Expedition game area. Press the key on the floe that lights up. Escape stops the game.",
    rueckenwind: "Tailwind: steady typing",
    weiterReise: (erwachsen: boolean) => (erwachsen ? "On to the next zone …" : "The journey goes on …"),
    reiseAbbrechen: "Stop the journey (Esc)",
    nochmal: (erwachsen: boolean) => (erwachsen ? "One more round" : "Play again!"),
    fertig: "Done",
    beenden: (frei: boolean, erwachsen: boolean) =>
      frei ? "End the game (Esc)" : erwachsen ? "Try again later (Esc)" : "Maybe later (Esc)",
    vorschauStatus: "Preview · stage & penguin rig - ",
    schliessen: "Close",
    debug: "Debug: poses and camera",
    schwenken: "Pan the view",
  },
  fr: {
    vorschauAnsage: (zone: string) => `Expédition polaire. Zone : ${zone}. Échap ferme le jeu.`,
    geschuetzt: (erwachsen: boolean) =>
      erwachsen ? " Le premier pas est protégé." : " Le premier pas est protégé - rien ne peut mal tourner ici.",
    tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
      `Journal de l'Expédition. ${zone}. ${aufgabe} Exemple : ${beispiel}${geschuetzt} Appuie sur Espace pour commencer.`,
    dialogName: (zone: string) => `Expédition polaire : ${zone}`,
    spur: "Trajectoire d'approche",
    herzen: "Cœurs de cette zone",
    helleHoehle: (an: boolean) => (an ? "🔆 Grotte claire : activée" : "🔅 Grotte claire : désactivée"),
    art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Jeu libre" : "Palier : nouvelle touche") : "Aperçu"),
    spielfeld:
      "Aire de jeu de l'Expédition polaire. Appuie sur la touche du bloc de glace qui s'allume. Échap arrête le jeu.",
    rueckenwind: "Vent arrière : frappe régulière",
    weiterReise: (erwachsen: boolean) => (erwachsen ? "Vers la zone suivante …" : "Le voyage continue …"),
    reiseAbbrechen: "Arrêter le voyage (Échap)",
    nochmal: (erwachsen: boolean) => (erwachsen ? "Encore un tour" : "Rejouer !"),
    fertig: "Terminé",
    beenden: (frei: boolean, erwachsen: boolean) =>
      frei ? "Terminer le jeu (Échap)" : erwachsen ? "Réessayer plus tard (Échap)" : "Peut-être plus tard (Échap)",
    vorschauStatus: "Aperçu - scène et rig du pingouin - ",
    schliessen: "Fermer",
    debug: "Debug : poses et caméra",
    schwenken: "Faire pivoter la vue",
  },
  es: {
    vorschauAnsage: (zone: string) => `Expedición polar. Zona: ${zone}. Esc cierra el juego.`,
    geschuetzt: (erwachsen: boolean) =>
      erwachsen ? " El primer paso está protegido." : " El primer paso está protegido - aquí no puede salir nada mal.",
    tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
      `Diario de la Expedición. ${zone}. ${aufgabe} Ejemplo: ${beispiel}${geschuetzt} Pulsa la barra espaciadora para empezar.`,
    dialogName: (zone: string) => `Expedición polar: ${zone}`,
    spur: "Trayectoria de llegada",
    herzen: "Corazones de esta zona",
    helleHoehle: (an: boolean) => (an ? "🔆 Cueva clara: activada" : "🔅 Cueva clara: desactivada"),
    art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Juego libre" : "Escalón: tecla nueva") : "Vista previa"),
    spielfeld:
      "Zona de juego de la Expedición polar. Pulsa la tecla del bloque de hielo que se enciende. Esc detiene el juego.",
    rueckenwind: "Viento a favor: escritura regular",
    weiterReise: (erwachsen: boolean) => (erwachsen ? "A la zona siguiente …" : "El viaje continúa …"),
    reiseAbbrechen: "Detener el viaje (Esc)",
    nochmal: (erwachsen: boolean) => (erwachsen ? "Otra vuelta" : "¡Otra vez!"),
    fertig: "Terminado",
    beenden: (frei: boolean, erwachsen: boolean) =>
      frei ? "Terminar el juego (Esc)" : erwachsen ? "Intentarlo más tarde (Esc)" : "Quizá más tarde (Esc)",
    vorschauStatus: "Vista previa - escena y figura del pingüino - ",
    schliessen: "Cerrar",
    debug: "Depuración: posturas y cámara",
    schwenken: "Girar la vista",
  },
  // ★ O-IT (02.10.2026): „Spedizione polare", „Interrompi il viaggio", „Esci dal gioco",
  // „Gioca ancora!" / „Un altro giro", „vento in poppa", „Gioco libero" (Glossar §2.3).
  it: {
    vorschauAnsage: (zone: string) => `Spedizione polare. Tappa: ${zone}. Esc chiude il gioco.`,
    geschuetzt: (erwachsen: boolean) =>
      erwachsen ? " Il primo passo è protetto." : " Il primo passo è protetto - qui non può andare storto niente.",
    tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
      `Diario di spedizione. ${zone}. ${aufgabe} Esempio: ${beispiel}${geschuetzt} Premi la barra spaziatrice per iniziare.`,
    dialogName: (zone: string) => `Spedizione polare: ${zone}`,
    spur: "Traiettoria di arrivo",
    herzen: "Cuori di questa tappa",
    helleHoehle: (an: boolean) => (an ? "🔆 Grotta chiara: sì" : "🔅 Grotta chiara: no"),
    art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Gioco libero" : "Gradino: tasto nuovo") : "Anteprima"),
    spielfeld:
      "Zona di gioco della Spedizione polare. Premi il tasto del blocco di ghiaccio che si illumina. Esc ferma il gioco.",
    rueckenwind: "Vento in poppa: scrittura regolare",
    weiterReise: (erwachsen: boolean) => (erwachsen ? "Alla tappa successiva..." : "Il viaggio continua..."),
    reiseAbbrechen: "Interrompi il viaggio (Esc)",
    nochmal: (erwachsen: boolean) => (erwachsen ? "Un altro giro" : "Gioca ancora!"),
    fertig: "Fatto",
    beenden: (frei: boolean, erwachsen: boolean) =>
      frei ? "Esci dal gioco (Esc)" : erwachsen ? "Riprova più tardi (Esc)" : "Magari più tardi (Esc)",
    vorschauStatus: "Anteprima - scena e figura del pinguino - ",
    schliessen: "Chiudi",
    debug: "Debug: pose e telecamera",
    schwenken: "Ruota la vista",
  },
  // ★ O-PL (02.10.2026): „Wyprawa polarna", „etap", „Przerwij wyprawę", „Zakończ grę",
  // „Zagraj jeszcze raz!" / „Jeszcze jedna runda", „wiatr w plecy", „Swobodna gra",
  // „dziennik wyprawy", „serduszka" (Glossar §2.3); spacja im Akkusativ „spację".
  pl: {
    vorschauAnsage: (zone: string) => `Wyprawa polarna. Etap: ${zone}. Klawisz Esc zamyka grę.`,
    geschuetzt: (erwachsen: boolean) =>
      erwachsen ? " Pierwszy krok jest chroniony." : " Pierwszy krok jest chroniony - tu nic nie może pójść źle.",
    tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
      `Dziennik wyprawy. ${zone}. ${aufgabe} Przykład: ${beispiel}${geschuetzt} Naciśnij spację, aby zacząć.`,
    dialogName: (zone: string) => `Wyprawa polarna: ${zone}`,
    spur: "Tor lotu",
    herzen: "Serduszka na tym etapie",
    helleHoehle: (an: boolean) => (an ? "🔆 Jasna jaskinia: włączona" : "🔅 Jasna jaskinia: wyłączona"),
    art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Swobodna gra" : "Brama: nowy klawisz") : "Podgląd"),
    spielfeld:
      "Pole gry Wyprawy polarnej. Naciśnij klawisz na krze, która świeci. Klawisz Esc przerywa grę.",
    rueckenwind: "Wiatr w plecy: równe tempo pisania",
    weiterReise: (erwachsen: boolean) => (erwachsen ? "Dalej, do następnego etapu..." : "Wyprawa trwa dalej..."),
    reiseAbbrechen: "Przerwij wyprawę (Esc)",
    nochmal: (erwachsen: boolean) => (erwachsen ? "Jeszcze jedna runda" : "Zagraj jeszcze raz!"),
    fertig: "Gotowe",
    beenden: (frei: boolean, erwachsen: boolean) =>
      frei ? "Zakończ grę (Esc)" : erwachsen ? "Spróbuj później (Esc)" : "Może później (Esc)",
    vorschauStatus: "Podgląd - scena i figura pingwina - ",
    schliessen: "Zamknij",
    debug: "Debug: pozy i kamera",
    schwenken: "Obróć widok",
  },
  // ★ O-TR (02.10.2026): "Kutup Keşfi", "aşama", "Yolculuğu bitir (Esc)", "Oyundan çık
  // (Esc)", "Tekrar oyna!" / "Bir tur daha", "arka rüzgâr", "Serbest oyun", "keşif
  // günlüğü", "kalpler" (Glossar §2.3); Tasten mit "tuşu" (Regel 6).
  tr: {
    vorschauAnsage: (zone: string) => `Kutup Keşfi. Aşama: ${zone}. Esc tuşu oyunu kapatır.`,
    geschuetzt: (erwachsen: boolean) =>
      erwachsen ? " İlk adım korumalı." : " İlk adım korumalı - burada hiçbir şey ters gidemez.",
    tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
      `Keşif günlüğü. ${zone}. ${aufgabe} Örnek: ${beispiel}${geschuetzt} Başlamak için boşluk çubuğuna bas.`,
    dialogName: (zone: string) => `Kutup Keşfi: ${zone}`,
    spur: "Uçuş yolu",
    herzen: "Bu aşamadaki kalpler",
    helleHoehle: (an: boolean) => (an ? "🔆 Aydınlık mağara: açık" : "🔅 Aydınlık mağara: kapalı"),
    art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Serbest oyun" : "Kapı: yeni tuş") : "Önizleme"),
    spielfeld:
      "Kutup Keşfi oyun alanı. Yanan buz kütlesinin tuşuna bas. Esc tuşu oyunu durdurur.",
    rueckenwind: "Arka rüzgâr: düzenli yazma",
    weiterReise: (erwachsen: boolean) => (erwachsen ? "Sıradaki aşamaya geçiliyor..." : "Yolculuk devam ediyor..."),
    reiseAbbrechen: "Yolculuğu bitir (Esc)",
    nochmal: (erwachsen: boolean) => (erwachsen ? "Bir tur daha" : "Tekrar oyna!"),
    fertig: "Bitti",
    beenden: (frei: boolean, erwachsen: boolean) =>
      frei ? "Oyundan çık (Esc)" : erwachsen ? "Sonra tekrarla (Esc)" : "Belki sonra (Esc)",
    vorschauStatus: "Önizleme - sahne ve penguen figürü - ",
    schliessen: "Kapat",
    debug: "Hata ayıklama: pozlar ve kamera",
    schwenken: "Görünümü çevir",
  },
  // ★ O-CS (03.10.2026): „Polární výprava", „etapa", „Přerušit výpravu (Esc)", „Ukončit hru
  // (Esc)", „Zahrát znovu" / „Ještě jedno kolo", „vítr v zádech", „Volná hra", „deník
  // výpravy", „srdíčka" (Glossar §2.3); Knöpfe im Infinitiv (Regel 1), „mezerník" im Akkusativ.
  cs: {
    vorschauAnsage: (zone: string) => `Polární výprava. Etapa: ${zone}. Klávesa Esc hru zavře.`,
    geschuetzt: (erwachsen: boolean) =>
      erwachsen ? " První krok je chráněný." : " První krok je chráněný - tady se nic pokazit nemůže.",
    tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
      `Deník výpravy. ${zone}. ${aufgabe} Příklad: ${beispiel}${geschuetzt} Stiskni mezerník a začni.`,
    dialogName: (zone: string) => `Polární výprava: ${zone}`,
    spur: "Dráha letu",
    herzen: "Srdíčka v této etapě",
    helleHoehle: (an: boolean) => (an ? "🔆 Světlá jeskyně: zapnuto" : "🔅 Světlá jeskyně: vypnuto"),
    art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Volná hra" : "Brána: nová klávesa") : "Náhled"),
    spielfeld:
      "Hrací plocha Polární výpravy. Stiskni klávesu na kře, která svítí. Klávesa Esc hru přeruší.",
    rueckenwind: "Vítr v zádech: rovnoměrné psaní",
    weiterReise: (erwachsen: boolean) => (erwachsen ? "Dál do další etapy..." : "Výprava pokračuje..."),
    reiseAbbrechen: "Přerušit výpravu (Esc)",
    nochmal: (erwachsen: boolean) => (erwachsen ? "Ještě jedno kolo" : "Zahrát znovu"),
    fertig: "Hotovo",
    beenden: (frei: boolean, erwachsen: boolean) =>
      frei ? "Ukončit hru (Esc)" : erwachsen ? "Zopakovat později (Esc)" : "Možná později (Esc)",
    vorschauStatus: "Náhled - scéna a postavička tučňáka - ",
    schliessen: "Zavřít",
    debug: "Ladění: pózy a kamera",
    schwenken: "Otočit pohled",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      vorschauAnsage: (zone: string) => `Полярна експедиция. Етап: ${zone}. Esc затваря играта.`,
      geschuetzt: (erwachsen: boolean) =>
        erwachsen ? " Първата стъпка е защитена." : " Първата стъпка е защитена - тук нищо не може да се обърка.",
      tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
        `Дневник на експедицията. ${zone}. ${aufgabe} Пример: ${beispiel}${geschuetzt} Натисни интервал, за да започнеш.`,
      dialogName: (zone: string) => `Полярна експедиция: ${zone}`,
      spur: "Траектория на полета",
      herzen: "Сърчица в този етап",
      helleHoehle: (an: boolean) => (an ? "🔆 Светла пещера: вкл." : "🔅 Светла пещера: изкл."),
      art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Свободна игра" : "Врата: нов клавиш") : "Преглед"),
      spielfeld:
        "Игрално поле на Полярната експедиция. Натисни клавиша на светещия леден къс. Esc прекъсва играта.",
      rueckenwind: "Попътен вятър: равномерно писане",
      weiterReise: (erwachsen: boolean) => (erwachsen ? "Към следващия етап …" : "Пътуването продължава …"),
      reiseAbbrechen: "Прекъсни пътуването (Esc)",
      nochmal: (erwachsen: boolean) => (erwachsen ? "Още един кръг" : "Играй пак!"),
      fertig: "Готово",
      beenden: (frei: boolean, erwachsen: boolean) =>
        frei ? "Изход от играта (Esc)" : erwachsen ? "Опитай пак по-късно (Esc)" : "Може би по-късно (Esc)",
      vorschauStatus: "Преглед · сцена и модел на пингвина - ",
      schliessen: "Затвори",
      debug: "Отстраняване на грешки: пози и камера",
      schwenken: "Завърти изгледа",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      vorschauAnsage: (zone: string) => `Πολική εξερεύνηση. Σταθμός: ${zone}. Με το Esc κλείνει το παιχνίδι.`,
      geschuetzt: (erwachsen: boolean) =>
        erwachsen
          ? " Το πρώτο βήμα είναι προστατευμένο."
          : " Το πρώτο βήμα είναι προστατευμένο - εδώ δεν μπορεί να πάει τίποτα στραβά.",
      tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
        `Ημερολόγιο εξερεύνησης. ${zone}. ${aufgabe} Παράδειγμα: ${beispiel}${geschuetzt} Πάτησε το πλήκτρο διαστήματος για να ξεκινήσεις.`,
      dialogName: (zone: string) => `Πολική εξερεύνηση: ${zone}`,
      spur: "Διαδρομή πτήσης",
      herzen: "Καρδούλες σε αυτόν τον σταθμό",
      helleHoehle: (an: boolean) => (an ? "🔆 Φωτεινή σπηλιά: ενεργή" : "🔅 Φωτεινή σπηλιά: ανενεργή"),
      art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Ελεύθερο παιχνίδι" : "Πύλη: νέο πλήκτρο") : "Προεπισκόπηση"),
      spielfeld:
        "Πεδίο παιχνιδιού της Πολικής εξερεύνησης. Πάτησε το πλήκτρο του παγοκομματιού που φωτίζεται. Με το Esc σταματά το παιχνίδι.",
      rueckenwind: "Ούριος άνεμος: σταθερό γράψιμο",
      weiterReise: (erwachsen: boolean) => (erwachsen ? "Στον επόμενο σταθμό..." : "Το ταξίδι συνεχίζεται..."),
      reiseAbbrechen: "Διακοπή εξερεύνησης (Esc)",
      nochmal: (erwachsen: boolean) => (erwachsen ? "Άλλος ένας γύρος" : "Ξανά παιχνίδι!"),
      fertig: "Τέλος",
      beenden: (frei: boolean, erwachsen: boolean) =>
        frei ? "Έξοδος από το παιχνίδι (Esc)" : erwachsen ? "Ξανά αργότερα (Esc)" : "Ίσως αργότερα (Esc)",
      vorschauStatus: "Προεπισκόπηση · σκηνή και πιγκουίνος - ",
      schliessen: "Κλείσιμο",
      debug: "Αποσφαλμάτωση: στάσεις και κάμερα",
      schwenken: "Περιστροφή της θέας",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      vorschauAnsage: (zone: string) => `Sarki expedíció. Szakasz: ${zone}. Az Esc billentyű bezárja a játékot.`,
      geschuetzt: (erwachsen: boolean) =>
        erwachsen ? " Az első lépés védett." : " Az első lépés védett - itt semmi sem romolhat el.",
      tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
        `Expedíciós napló. ${zone}. ${aufgabe} Példa: ${beispiel}${geschuetzt} Nyomd meg a szóköz billentyűt az induláshoz.`,
      dialogName: (zone: string) => `Sarki expedíció: ${zone}`,
      spur: "Repülési útvonal",
      herzen: "Szívek ebben a szakaszban",
      helleHoehle: (an: boolean) => (an ? "🔆 Világos barlang: be" : "🔅 Világos barlang: ki"),
      art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Szabad játék" : "Kapu: új billentyű") : "Előnézet"),
      spielfeld:
        "A Sarki expedíció játéktere. Nyomd meg a világító jégtábla billentyűjét. Az Esc billentyű megszakítja a játékot.",
      rueckenwind: "Hátszél: egyenletes gépelés",
      weiterReise: (erwachsen: boolean) => (erwachsen ? "Tovább a következő szakaszba…" : "Folytatódik az utazás…"),
      reiseAbbrechen: "Expedíció megszakítása (Esc)",
      nochmal: (erwachsen: boolean) => (erwachsen ? "Még egy kör" : "Újra!"),
      fertig: "Kész",
      beenden: (frei: boolean, erwachsen: boolean) =>
        frei ? "Kilépés a játékból (Esc)" : erwachsen ? "Később újra (Esc)" : "Talán később (Esc)",
      vorschauStatus: "Előnézet · színpad és pingvinmodell - ",
      schliessen: "Bezárás",
      debug: "Hibakeresés: pózok és kamera",
      schwenken: "Nézet forgatása",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      vorschauAnsage: (zone: string) => `Poolexpeditie. Etappe: ${zone}. Met Escape sluit je het spel.`,
      geschuetzt: (erwachsen: boolean) =>
        erwachsen ? " De eerste stap is beschermd." : " De eerste stap is beschermd - hier kan niets misgaan.",
      tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
        `Expeditiedagboek. ${zone}. ${aufgabe} Voorbeeld: ${beispiel}${geschuetzt} Druk op de spatiebalk om te beginnen.`,
      dialogName: (zone: string) => `Poolexpeditie: ${zone}`,
      spur: "Aanvliegroute",
      herzen: "Hartjes in deze etappe",
      helleHoehle: (an: boolean) => (an ? "🔆 Lichte grot: aan" : "🔅 Lichte grot: uit"),
      art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Vrij spel" : "Poort: nieuwe toets") : "Voorvertoning"),
      spielfeld:
        "Speelveld van de Poolexpeditie. Druk op de toets van de ijsschots die oplicht. Met Escape stop je het spel.",
      rueckenwind: "Rugwind: gelijkmatig typen",
      weiterReise: (erwachsen: boolean) => (erwachsen ? "Door naar de volgende etappe …" : "De tocht gaat verder …"),
      reiseAbbrechen: "Tocht afbreken (Esc)",
      nochmal: (erwachsen: boolean) => (erwachsen ? "Nog een ronde" : "Opnieuw spelen!"),
      fertig: "Klaar",
      beenden: (frei: boolean, erwachsen: boolean) =>
        frei ? "Spel stoppen (Esc)" : erwachsen ? "Later opnieuw proberen (Esc)" : "Misschien later (Esc)",
      vorschauStatus: "Voorvertoning · decor en pinguïnmodel - ",
      schliessen: "Sluiten",
      debug: "Debug: houdingen en camera",
      schwenken: "Rondkijken",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      vorschauAnsage: (zone: string) => `Expedição polar. Etapa: ${zone}. Esc fecha o jogo.`,
      geschuetzt: (erwachsen: boolean) =>
        erwachsen ? " O primeiro passo está protegido." : " O primeiro passo está protegido - aqui nada pode correr mal.",
      tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
        `Diário da expedição. ${zone}. ${aufgabe} Exemplo: ${beispiel}${geschuetzt} Prime a barra de espaço para começar.`,
      dialogName: (zone: string) => `Expedição polar: ${zone}`,
      spur: "Rota de voo",
      herzen: "Corações desta etapa",
      helleHoehle: (an: boolean) => (an ? "🔆 Gruta clara: ligada" : "🔅 Gruta clara: desligada"),
      art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Jogo livre" : "Porta: tecla nova") : "Pré-visualização"),
      spielfeld:
        "Área de jogo da Expedição polar. Prime a tecla do bloco de gelo que se acende. Esc interrompe o jogo.",
      rueckenwind: "Vento a favor: escrita regular",
      weiterReise: (erwachsen: boolean) => (erwachsen ? "Para a próxima etapa..." : "A viagem continua..."),
      reiseAbbrechen: "Interromper a viagem (Esc)",
      nochmal: (erwachsen: boolean) => (erwachsen ? "Mais uma ronda" : "Jogar outra vez!"),
      fertig: "Concluído",
      beenden: (frei: boolean, erwachsen: boolean) =>
        frei ? "Sair do jogo (Esc)" : erwachsen ? "Tentar mais tarde (Esc)" : "Talvez mais tarde (Esc)",
      vorschauStatus: "Pré-visualização · cenário e pinguim - ",
      schliessen: "Fechar",
      debug: "Depuração: poses e câmara",
      schwenken: "Rodar a vista",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      vorschauAnsage: (zone: string) => `Expedição polar. Etapa: ${zone}. Esc fecha o jogo.`,
      geschuetzt: (erwachsen: boolean) =>
        erwachsen ? " O primeiro passo é protegido." : " O primeiro passo é protegido - aqui nada pode dar errado.",
      tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
        `Diário da expedição. ${zone}. ${aufgabe} Exemplo: ${beispiel}${geschuetzt} Pressione a barra de espaço para começar.`,
      dialogName: (zone: string) => `Expedição polar: ${zone}`,
      spur: "Rota de voo",
      herzen: "Corações desta etapa",
      helleHoehle: (an: boolean) => (an ? "🔆 Caverna clara: ligada" : "🔅 Caverna clara: desligada"),
      art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Jogo livre" : "Portão: tecla nova") : "Prévia"),
      spielfeld:
        "Área de jogo da Expedição polar. Pressione a tecla da placa de gelo que se acende. Esc interrompe o jogo.",
      rueckenwind: "Vento a favor: digitação constante",
      weiterReise: (erwachsen: boolean) => (erwachsen ? "Para a próxima etapa..." : "A viagem continua..."),
      reiseAbbrechen: "Interromper a viagem (Esc)",
      nochmal: (erwachsen: boolean) => (erwachsen ? "Mais uma rodada" : "Jogar de novo"),
      fertig: "Concluir",
      beenden: (frei: boolean, erwachsen: boolean) =>
        frei ? "Sair do jogo (Esc)" : erwachsen ? "Tentar mais tarde (Esc)" : "Talvez mais tarde (Esc)",
      vorschauStatus: "Prévia · cenário e boneco do pinguim - ",
      schliessen: "Fechar",
      debug: "Debug: poses e câmera",
      schwenken: "Girar a vista",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      vorschauAnsage: (zone: string) => `Expediția polară. Etapa: ${zone}. Tasta Esc închide jocul.`,
      geschuetzt: (erwachsen: boolean) =>
        erwachsen
          ? " Primul pas este protejat."
          : " Primul pas este protejat - aici nu se poate întâmpla nimic rău.",
      tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
        `Jurnalul expediției. ${zone}. ${aufgabe} Exemplu: ${beispiel}${geschuetzt} Apasă bara de spațiu ca să începi.`,
      dialogName: (zone: string) => `Expediția polară: ${zone}`,
      spur: "Traseul de zbor",
      herzen: "Inimioarele acestei etape",
      helleHoehle: (an: boolean) => (an ? "🔆 Peșteră luminoasă: pornită" : "🔅 Peșteră luminoasă: oprită"),
      art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Joc liber" : "Poartă: tastă nouă") : "Previzualizare"),
      spielfeld:
        "Terenul de joc al Expediției polare. Apasă tasta de pe sloiul care se luminează. Tasta Esc oprește jocul.",
      rueckenwind: "Vânt din spate: scris constant",
      weiterReise: (erwachsen: boolean) => (erwachsen ? "Mai departe, la etapa următoare …" : "Călătoria continuă …"),
      reiseAbbrechen: "Întrerupeți expediția (Esc)",
      nochmal: (erwachsen: boolean) => (erwachsen ? "Încă o rundă" : "Jucați din nou!"),
      fertig: "Gata",
      beenden: (frei: boolean, erwachsen: boolean) =>
        frei ? "Ieșiți din joc (Esc)" : erwachsen ? "Reluați mai târziu (Esc)" : "Poate mai târziu (Esc)",
      vorschauStatus: "Previzualizare · scenă și pinguin - ",
      schliessen: "Închideți",
      debug: "Depanare: poziții și cameră",
      schwenken: "Rotiți imaginea",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      vorschauAnsage: (zone: string) => `Polarexpeditionen. Etapp: ${zone}. Escape stänger spelet.`,
      geschuetzt: (erwachsen: boolean) =>
        erwachsen ? " Det första steget är skyddat." : " Det första steget är skyddat - här kan inget gå fel.",
      tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
        `Expeditionsdagbok. ${zone}. ${aufgabe} Exempel: ${beispiel}${geschuetzt} Tryck på Mellanslag för att börja.`,
      dialogName: (zone: string) => `Polarexpeditionen: ${zone}`,
      spur: "Inflygningsspår",
      herzen: "Hjärtan i den här etappen",
      helleHoehle: (an: boolean) => (an ? "🔆 Ljus grotta: på" : "🔅 Ljus grotta: av"),
      art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Fritt spel" : "Port: ny tangent") : "Förhandsvisning"),
      spielfeld:
        "Spelplanen för Polarexpeditionen. Tryck på tangenten på isflaket som lyser. Escape avbryter.",
      rueckenwind: "Medvind: jämn skrivtakt",
      weiterReise: (erwachsen: boolean) => (erwachsen ? "Vidare till nästa etapp..." : "Resan fortsätter..."),
      reiseAbbrechen: "Avbryt expeditionen (Esc)",
      nochmal: (erwachsen: boolean) => (erwachsen ? "En omgång till" : "Spela igen!"),
      fertig: "Klar",
      beenden: (frei: boolean, erwachsen: boolean) =>
        frei ? "Avsluta spelet (Esc)" : erwachsen ? "Försök igen senare (Esc)" : "Kanske senare (Esc)",
      vorschauStatus: "Förhandsvisning · scen och pingvinrigg - ",
      schliessen: "Stäng",
      debug: "Felsökning: poser och kamera",
      schwenken: "Panorera vyn",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      vorschauAnsage: (zone: string) => `Полярна експедиція. Зона: ${zone}. Esc закриває гру.`,
      geschuetzt: (erwachsen: boolean) =>
        erwachsen ? " Перший крок захищений." : " Перший крок захищений - тут нічого не може піти не так.",
      tagebuchAnsage: (zone: string, aufgabe: string, beispiel: string, geschuetzt: string) =>
        `Щоденник експедиції. ${zone}. ${aufgabe} Приклад: ${beispiel}${geschuetzt} Натисни пробіл, щоб почати.`,
      dialogName: (zone: string) => `Полярна експедиція: ${zone}`,
      spur: "Траєкторія польоту",
      herzen: "Сердечка цієї зони",
      helleHoehle: (an: boolean) => (an ? "🔆 Світла печера: увімкнено" : "🔅 Світла печера: вимкнено"),
      art: (spiel: boolean, frei: boolean) => (spiel ? (frei ? "Вільна гра" : "Ворота: нова клавіша") : "Попередній перегляд"),
      spielfeld:
        "Ігрове поле Полярної експедиції. Натисни клавішу на крижині, що світиться. Esc перериває гру.",
      rueckenwind: "Попутний вітер: рівномірний друк",
      weiterReise: (erwachsen: boolean) => (erwachsen ? "До наступної зони..." : "Подорож триває..."),
      reiseAbbrechen: "Перервати подорож (Esc)",
      nochmal: (erwachsen: boolean) => (erwachsen ? "Ще один раунд" : "Зіграти ще раз"),
      fertig: "Готово",
      beenden: (frei: boolean, erwachsen: boolean) =>
        frei ? "Завершити гру (Esc)" : erwachsen ? "Повторити пізніше (Esc)" : "Можливо, пізніше (Esc)",
      vorschauStatus: "Попередній перегляд · сцена й модель пінгвіна - ",
      schliessen: "Закрити",
      debug: "Налагодження: пози й камера",
      schwenken: "Повернути погляд",
    },
});

export interface ExpeditionStageProps {
  open: boolean;
  /**
   * Schließen. `grund === "escape"` sagt dem Aufrufer, dass die ESCAPE-TASTE
   * geschlossen hat - dann gilt Johannes' Regel R6 (22.08.2026): Escape endet
   * IMMER in der Eingabezeile, nie auf dem Auslöser. Über die Knöpfe der
   * Steuerleiste bleibt es beim jeweiligen Rückweg des Aufrufers.
   */
  onClose: (grund?: "escape") => void;
  /** App-Vorlesen an? Steuert die Doppelsprech-Regel (Stimme ODER Live-Region). */
  voiceEnabled?: boolean;
  /** Debug-Posenleiste + Kamera-Schwenk einblenden (nur Vorschaumodus). */
  debug?: boolean;

  // --- Spielmodus (ab E2) ------------------------------------------------------
  /** Der zu spielende Kurs; gesetzt = Spielmodus, sonst statische Vorschau. */
  course?: FloeCourse;
  /** Freies Spiel (kein Freischalten, Bonus-Fische) vs. Tor vor neuer Taste. */
  free?: boolean;
  /** Erwachsenen-Profil (sachliche Texte, kein Tor). */
  isAdult?: boolean;
  /** Buchstaben groß anzeigen (erst nach gelernter Umschalttaste). */
  uppercase?: boolean;
  /** Zeitdruck abgeschaltet (WCAG) — nichts versinkt je. */
  noTimePressure?: boolean;
  /** Pro-Zeichen-Messwerte (für das adaptive Zeitfenster, §5). */
  letters?: Record<string, LetterStat>;
  /** Anforderungs-Schwellen (ignoreSpeed = kein Zeitdruck). */
  mastery?: Mastery;
  /** Ziel im Tor-Modus erreicht → Freischaltung übernehmen. */
  onWin?: () => void;
  /** Freies Spiel geschafft (Abenteuer-Bilanz). */
  onFinished?: (result: { clean: boolean; flawless: boolean; fish: number }) => void;

  // --- Reise-Modus (E7): Tagebuch + Mini-Reisekarte + Tag→Nacht ----------------
  /**
   * Reise-Modus: das Expeditionstagebuch vor DIESER Zone + Reisekarte-Daten (Bauplan §4.7/§2).
   * Gesetzt = die Zone ist Teil einer durchgehenden Reise (Orchestrator {@link ExpeditionJourney});
   * die Bühne zeigt erst das Tagebuch (Leertaste startet), danach spielt die Zone, und beim
   * Zielerreichen übernimmt der Orchestrator (kein „Nochmal/Fertig"-Endscreen).
   */
  journey?: JourneyStageInfo | null;
  /** Tageszeit dieser Zone → Letterbox-Farbe (Tag→Nacht-Bogen, Bauplan §4.5). */
  timeOfDay?: TimeOfDay;
  /** Erstbesuch der Zone → geschützter Probe-Schritt (Bauplan §4.7). */
  protectFirst?: boolean;
  /**
   * „Zeichenabstand groß (CVI)" - DERSELBE Wert wie in `TypingSession`
   * (19.09.2026, Johannes: *„… bei Tippchallenges, Klassenmatch, Übungen und
   * Spielen, überall"*). Die Zeichen-Reihen der Szenen (Steilwand-Tafel,
   * Schneesturm-Tafel und -Kästen, Funk-Kärtchen und -Anzeige) rücken
   * auseinander, und beim Tippen bleibt nur das Spielfeld hell - Kopf- und
   * Steuerleiste treten zurück, nach 5 s ohne Anschlag ist alles wieder hell.
   */
  zeichenabstand?: ZeichenabstandFaktor;
  /**
   * ★ E6c (24.09.2026, Bauplan §6.3): der Lernweg des Kindes - auf Weg „en"
   * spricht das Höhlenwesen nicht mit der deutschen Aufnahme/Stimme (kein
   * Aufnahme-Vorrat, keine unbesprochene neue Stimme), sondern nur mit einem
   * Ton, und das gelöste Funkspruch-Wort der Polarstation wird mit der
   * englischen statt der deutschen Stimme vorgelesen (es ist ja englischer
   * Inhalt). Vorgabe „de" (wie vor dieser Etappe), falls ein Aufrufer den Weg
   * (noch) nicht kennt.
   */
  lernweg?: Lernweg;
}

/** Reise-Daten für eine Zone: Position, Reisekarte-Punkte und das Tagebuch-Blatt. */
export interface JourneyStageInfo {
  index: number;
  total: number;
  zones: HudZone[];
  diary: { zoneName: string; task: string; example: string; firstVisit: boolean };
}

/** Liest die System-Einstellung „Bewegung reduzieren" (für die rAF-Kamera). */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/** Weiches Nachziehen der Kamera zu `targetX` (springt bei reduced-motion). */
function useCamera(targetX: number, reduced: boolean): number {
  const [camX, setCamX] = useState(targetX);
  const posRef = useRef(targetX);
  const targetRef = useRef(targetX);
  targetRef.current = targetX;
  useEffect(() => {
    if (reduced) {
      posRef.current = targetX;
      setCamX(targetX);
      return;
    }
    let raf = 0;
    const step = () => {
      const d = targetRef.current - posRef.current;
      if (Math.abs(d) < 0.4) {
        posRef.current = targetRef.current;
        setCamX(targetRef.current);
        return;
      }
      posRef.current += d * 0.12; // lerp — weiches Nachziehen
      setCamX(posRef.current);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetX, reduced]);
  return camX;
}

export function ExpeditionStage({
  open,
  onClose,
  voiceEnabled = false,
  debug = false,
  course,
  free = false,
  isAdult = false,
  uppercase = false,
  noTimePressure = false,
  letters,
  mastery,
  onWin,
  onFinished,
  journey = null,
  timeOfDay,
  protectFirst = false,
  zeichenabstand = 1,
  lernweg = "de",
}: ExpeditionStageProps) {
  const game = !!course;
  const { sprache, bereichAktiv } = useBedienSprache();
  const t = BUEHNE_TEXTE[sprache];
  /** In Tastenflow spricht die Stimme der Bedienung, sonst genau wie vorher (deutsch). */
  const sprich = (text: string) => {
    if (bereichAktiv) speakUi(text, undefined, undefined, sprache);
    else speakUiDe(text);
  };
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const doneBtnRef = useRef<HTMLButtonElement>(null);

  // Reise-Modus: Vor der Zone steht das Tagebuch (Bauplan §4.7). Bis die Leertaste es
  // startet, bleibt der Spiel-Hook inert (unten `open`-Gate) — die Leertaste ist zugleich
  // die erste Nutzergeste, die das Audio entsperrt (K28 §6.1.2). Ohne Reise-Modus: kein
  // Tagebuch, das Spiel läuft sofort (Einzelzonen-Demo, Tor, freies Einzelspiel).
  const [started, setStarted] = useState(!journey);
  const showDiary = !!journey && !started;

  const [previewPose, setPreviewPose] = useState<PenguinPose>("idle");
  const [previewPan, setPreviewPan] = useState(0);
  /** Kontrastschalter „helle Höhle" (Pflicht, Bauplan §4.3/§7). Merkt sich die Wahl. */
  const [brightCave, setBrightCave] = useState(false);
  const reduced = usePrefersReducedMotion();

  const voiceRef = useRef(voiceEnabled);
  voiceRef.current = voiceEnabled;

  // Der Spiel-Hook läuft immer (React-Hook-Regel); ohne Kurs — oder solange das Tagebuch
  // steht (Reise-Modus) — bleibt er inert.
  const view = useExpedition({
    open: open && !showDiary,
    course: course ?? EMPTY_COURSE,
    free,
    isAdult,
    voiceEnabled,
    noTimePressure,
    letters,
    mastery: mastery ?? masteryFor("normal"),
    protectFirst,
    // Reise-Modus: das Tagebuch erklärt die Zone schon — keine zweite volle Intro-Ansage.
    announceIntro: !journey,
    onWin: onWin ?? (() => {}),
    onFinished,
    sprache,
    bereichAktiv,
    lernweg,
  });

  // Zone aus dem laufenden Kurs (Spielmodus) bzw. Packeis für die statische Vorschau.
  const playZone = game ? view.zone : "water";
  const zone = zoneOf(playZone) ?? zoneOf("water");
  // ★ EN3: der Name der Zone in der Bedienungssprache.
  // ★ E11a-5: über die Tabelle je Sprache (`zoneNameIn`), nicht mehr über eine Weiche.
  const zoneName = zone ? zoneNameIn(zone, sprache) : "";
  // Tag→Nacht-Bogen (§4.5): die Letterbox-Farbe folgt der Tageszeit dieser Zone.
  const stageTime: TimeOfDay = timeOfDay ?? zone?.timeOfDay ?? "morning";

  const camTarget = game ? view.camTarget : previewPan;
  const camX = useCamera(camTarget, reduced);

  // ★ Nr 19 der Fokusziele (22.08.2026): KEIN `restoreFocus`. Wer die Bühne
  // geöffnet hat, ist von Fall zu Fall verschieden - beim Belohnungs-Lauf ist
  // es die Feier-Karte, die es beim Schließen längst nicht mehr gibt. Den
  // Rückweg setzt darum der Aufrufer (`FloeFreePlay` bzw. die Trainer), und er
  // setzt genau EINEN. Die Falle selbst bleibt: Tab hält in der Bühne.
  useFocusTrap(open, rootRef, { initialFocus: viewportRef });

  // Vorschaumodus: die Zone genau EINMAL ansagen (App-Stimme ODER Braille-Alarm —
  // Doppelsprech-Regel). Im Spielmodus übernimmt das der Hook.
  useEffect(() => {
    if (game || !open || !zone) return;
    const intro = t.vorschauAnsage(zoneName);
    if (voiceRef.current) sprich(intro);
    else if (view.brailleRef.current) view.brailleRef.current.textContent = intro;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, game]);

  // Reise-Modus: das Tagebuch-Blatt automatisch vorlesen (Doppelsprech-Regel §7 — App-Stimme
  // ODER Live-Region, nie beides). Die Leertaste startet danach die Zone (nativer Listener oben).
  useEffect(() => {
    if (!showDiary || !open || !journey) return;
    const d = journey.diary;
    const probe = d.firstVisit ? t.geschuetzt(isAdult) : "";
    const text = t.tagebuchAnsage(d.zoneName, d.task, d.example, probe);
    if (voiceRef.current) sprich(text);
    else if (view.brailleRef.current) view.brailleRef.current.textContent = text;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDiary, open]);

  // Der Fokus-Rückgabe-Anker beim Zielerreichen im freien Einzelspiel: auf „Fertig".
  // Im Reise-Modus gibt es keinen Endscreen (der Orchestrator zieht weiter).
  //
  // ★ Nr 18 der Fokusziele (22.08.2026): Der Sieg tauscht die Steuerleiste aus -
  // „Spiel beenden (Esc)" verschwindet in genau dem Augenblick, in dem
  // „Nochmal spielen!" und „Fertig" erscheinen. Stand der Fokus auf dem
  // entfernten Knopf, hing er 400 Millisekunden auf `body`, und eine
  // Braillezeile stand im Nichts. Darum: War der Fokus in der Bühne und ist er
  // jetzt draußen, kommt „Fertig" SOFORT. War der Fokus dagegen (wie sonst
  // immer) auf dem Spielfeld, bleibt der ruhige 400-ms-Zug - dort verschwindet
  // nichts unter dem Fokus.
  useEffect(() => {
    if (game && free && view.won && !journey) {
      const drin =
        !!document.activeElement &&
        document.activeElement !== document.body &&
        !!rootRef.current?.contains(document.activeElement);
      if (!drin) doneBtnRef.current?.focus();
      const id = window.setTimeout(() => doneBtnRef.current?.focus(), 400);
      return () => window.clearTimeout(id);
    }
  }, [game, free, view.won, journey]);

  // Tastatur über einen NATIVEN Listener am Bühnen-Root — NICHT über React-
  // onKeyDown: Die Bühne ist ein Portal an <body> (außerhalb von #root, s. o.),
  // und Reacts Event-Delegation hängt am #root — echte keydown-Events im Portal
  // erreichen sie nie (im echten Browser feuert onKeyDown dort nicht, jsdom
  // maskiert das). Ein nativer Listener am px-stage fängt alle Tasten der Bühne
  // (Escape schließt; Spiel-Tasten gehen an handleKey; Alt-Kürzel bleiben durch,
  // weil handleKey sie unberührt weiterbubbeln lässt). Refs halten den Listener
  // stabil, ohne ihn bei jedem Zug neu zu registrieren.
  // Leertaste startet die Zone — und BRICHT die laufende Tagebuch-Ansage ab (Johannes 13.07.:
  // „wenn man leer drückt, sollen die Erklärungen abgebrochen werden").
  const startGame = useCallback(() => {
    cancelSpeech();
    setStarted(true);
  }, []);
  const handleKeyRef = useRef(view.handleKey);
  handleKeyRef.current = view.handleKey;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const gameRef = useRef(game);
  gameRef.current = game;
  const showDiaryRef = useRef(showDiary);
  showDiaryRef.current = showDiary;
  const startRef = useRef(startGame);
  startRef.current = startGame;
  useEffect(() => {
    const root = rootRef.current;
    if (!open || !root) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        // R6: Escape endet in der Eingabezeile - der Aufrufer erfährt hier,
        // dass es Escape war und nicht der Knopf „Fertig".
        closeRef.current("escape");
        return;
      }
      // Tagebuch (Reise-Modus, §4.7): Leertaste/Enter startet die Zone — und ist die
      // erste Nutzergeste fürs Audio (K28). Andere Tasten schluckt das Tagebuch.
      if (showDiaryRef.current) {
        if (e.key === " " || e.key === "Spacebar" || e.key === "Space" || e.key === "Enter") {
          e.preventDefault();
          startRef.current();
        }
        return;
      }
      if (gameRef.current) handleKeyRef.current(e as unknown as React.KeyboardEvent);
    };
    // Der Fokus bleibt IMMER auf dem Spielfeld — egal, wohin geklickt wird (Johannes
    // 13.07.): Ein Klick auf eine nicht-fokussierbare Fläche (Szene, Statuszeile,
    // Ränder, Letterbox) darf den Fokus nicht ans <body> verlieren, sonst reagiert die
    // Tastatur nicht mehr. Echte Bedienknöpfe (Escape/Fertig/„helle Höhle" …) fangen
    // wir aus — sie bekommen den Fokus wie gewohnt; ihre Klicks laufen normal.
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('button, a[href], input, select, textarea, [contenteditable="true"]')) return;
      e.preventDefault(); // kein Fokuswechsel ans <body>
      if (document.activeElement !== viewportRef.current) viewportRef.current?.focus();
    };
    root.addEventListener("keydown", onKey);
    root.addEventListener("mousedown", onMouseDown);
    return () => {
      root.removeEventListener("keydown", onKey);
      root.removeEventListener("mousedown", onMouseDown);
    };
  }, [open]);

  if (!open || !zone || typeof document === "undefined") return null;

  const spots = game ? view.spots : PREVIEW_SPOTS;
  const pts = game ? view.pts : PREVIEW_LAYOUT.pts;
  const worldW = game ? view.worldW : PREVIEW_LAYOUT.worldW;
  const penguinX = game ? view.penguin.x : (pts[1]?.x ?? PACKEIS_SHORE_X);
  const penguinY = game ? view.penguin.y : PACKEIS_GROUND_Y;
  const penguinPose = game ? view.penguin.pose : previewPose;

  const previewMax = Math.max(0, PREVIEW_LAYOUT.worldW - VIEW_W);

  // Die Kulisse der aktuellen Zone. Gemeinsame Requisiten + Pinguin, dann je Zone die
  // Szene (Packeis: Schollen+Fisch; Steilwand: Tritte+Folgen; Rutsche: Nacht-Hang).
  const penguinNode = (
    <PenguinRig
      pose={penguinPose}
      transform={`translate(${penguinX} ${penguinY}) scale(${PENGUIN_SCALE})`}
    />
  );
  const sharedScene = {
    camX,
    worldW,
    spots,
    pts,
    pos: game ? view.pos : 1,
    targetIdx: game ? view.targetIdx : 2,
    uppercase: game ? uppercase : true,
    aurora: game ? view.aurora : false,
    penguin: penguinNode,
  };
  const sceneNode =
    playZone === "climb" ? (
      <SteilwandScene
        {...sharedScene}
        seqPos={game ? view.seqPos : 0}
        cracking={game ? view.cracking : false}
        zeichenabstand={zeichenabstand}
      />
    ) : playZone === "slide" ? (
      <SlideScene
        {...sharedScene}
        slideLetter={game ? view.slideLetter : "f"}
        slideProgress={game ? view.slideProgress : 0.5}
        slideHot={game ? view.slideHot : false}
      />
    ) : playZone === "storm" ? (
      <StormScene
        {...sharedScene}
        showSeq={game ? view.showSeq : null}
        seqLen={game ? view.seqLen : 0}
        typedSeq={game ? view.typedSeq : ""}
        zeichenabstand={zeichenabstand}
      />
    ) : playZone === "station" ? (
      <StationScene
        {...sharedScene}
        word={game ? view.stationWord : "funk"}
        typed={game ? view.typedSeq : undefined}
        scrambled={game ? view.scrambled : undefined}
        seqPos={game ? view.seqPos : 0}
        signal={game ? view.signal : 3}
        solved={game ? view.solved : false}
        sentPulse={game ? view.sentPulse : 0}
        wobble={game ? view.wobble : 0}
        zeichenabstand={zeichenabstand}
      />
    ) : playZone === "cave" ? (
      <CaveScene {...sharedScene} cracking={game ? view.cracking : false} bright={brightCave} />
    ) : (
      <PackeisScene
        {...sharedScene}
        sunk={game ? view.sunk : false}
        sinkOffset={game ? view.sinkOffset : 0}
        fish={game ? view.fish : null}
        rings={game ? view.rings : null}
      />
    );

  return createPortal(
    <div
      ref={rootRef}
      className="px-stage"
      data-time={stageTime}
      role="dialog"
      aria-modal="true"
      aria-label={t.dialogName(zoneName)}
    >
      {/* Braille-Alarm beim Öffnen (role=alert). Im Spielmodus zusätzlich die
          laufende Status-Region (role=status) — beide über den Hook. */}
      <div ref={view.brailleRef} className="sr-only" role="alert" />
      {game && <div ref={view.statusRef} className="sr-only" role="status" />}
      {/* Bauchrutsche: die Braille-Spur, auf der der Buchstabe nach LINKS auf die Ziel-Position
          wandert (Johannes 14.07.). Bewusst `aria-live="off"` — sie wird NICHT gesprochen (zehn
          Aktualisierungen je Sekunde), sondern abgetastet; den Druck-Moment gibt der Zielton. */}
      {game && playZone === "slide" && (
        <div ref={view.trackRef} className="px-track" aria-live="off" aria-label={t.spur} />
      )}

      {/* Schmale Kopfzeile: Zonenname + Mini-Reisekarte (Bauplan §2 Hud.tsx) */}
      <div className="px-hud">
        <span className="px-hud__zone">🐧 {zoneName}</span>
        <span className="px-hud__right">
          {/* Herzen der Zone (Johannes 14.07.): jeder Fehlgriff und jede abgelaufene Zeit kostet
              eines; bei null beginnt die Zone von vorn. Rein visuell — den Verlust sagt die
              Stimme an bzw. meldet die Live-Region (§7, keine Doppel-Ansage). */}
          {game && !showDiary && (
            // ★ N15c: Hinweisflaeche statt `title` - die Herzen sind kein
            // Tabstopp und bleiben aria-hidden (der Verlust wird über die
            // Stimme bzw. die Live-Region angesagt, siehe §7 oben).
            <Hinweisflaeche className="px-hud__lives" aria-hidden="true" hilfe={t.herzen}>
              {Array.from({ length: view.livesMax }, (_, i) => (
                <span
                  key={i}
                  className={`px-hud__heart${i < view.lives ? "" : " px-hud__heart--lost"}`}
                >
                  {i < view.lives ? "❤️" : "🤍"}
                </span>
              ))}
            </Hinweisflaeche>
          )}
          {/* Pflicht-Kontrastschalter „helle Höhle" — nur in der Echo-Höhle (Bauplan §4.3/§7). */}
          {game && playZone === "cave" && (
            <button
              type="button"
              className="px-hud__toggle"
              aria-pressed={brightCave}
              onClick={() => setBrightCave((b) => !b)}
            >
              {t.helleHoehle(brightCave)}
            </button>
          )}
          {journey ? (
            <Hud zones={journey.zones} index={journey.index} total={journey.total} />
          ) : (
            // ★ E7 (11.09.2026): `text-sm` (14 px) statt der festen Grösse
            // 0,85rem (13,6 px) - unter der Mindestgrösse des Reviers.
            // ★ Kontrast (29.10.2026): ohne die Abschwächung `opacity: 0.7`, eine Stufe grösser.
            <span aria-hidden="true" className="text-base">
              {t.art(game, free)}
            </span>
          )}
        </span>
      </div>

      {/* Spielfeld */}
      <div
        ref={viewportRef}
        className="px-viewport"
        role="application"
        tabIndex={0}
        aria-label={t.spielfeld}
      >
        {sceneNode}
        {/* Expeditionstagebuch vor der Zone (Reise-Modus, §4.7). Leertaste startet, Escape zurück. */}
        {showDiary && journey && (
          <DiaryCard
            zoneName={journey.diary.zoneName}
            task={journey.diary.task}
            example={journey.diary.example}
            firstVisit={journey.diary.firstVisit}
            index={journey.index}
            total={journey.total}
          />
        )}
      </div>

      {/* Steuerleiste */}
      <div className="px-controls">
        {game ? (
          <>
            <p className="px-status" aria-hidden="true">
              {view.statusText}
            </p>
            {view.timed && (
              <div className="px-timer" aria-hidden="true">
                <div style={{ width: `${view.timerPct}%` }} />
              </div>
            )}
            {/* Rückenwind-Meter (§4.8): füllt sich bei gleichmäßigem Tippen, nicht bei Hast. */}
            {!showDiary && !view.won && (
              // ★ N15c: Hinweisflaeche statt `title` - `.px-tailwind` setzt
              // `display: flex` selbst, das Bild ändert sich durch den
              // Wechsel von `<div>` auf den `<span>` der Hinweisflaeche nicht.
              <Hinweisflaeche className="px-tailwind" aria-hidden="true" hilfe={t.rueckenwind}>
                <span className="px-tailwind__label">🪁</span>
                <span className="px-tailwind__track">
                  <span className="px-tailwind__fill" style={{ width: `${Math.round(view.tailwind * 100)}%` }} />
                </span>
              </Hinweisflaeche>
            )}
            {journey ? (
              view.won ? (
                <p className="px-status px-status--soft" aria-hidden="true">
                  {t.weiterReise(isAdult)}
                </p>
              ) : (
                <button type="button" className="px-btn px-btn--action" onClick={() => onClose()}>
                  {t.reiseAbbrechen}
                </button>
              )
            ) : free && view.won ? (
              <div className="px-btnrow">
                {/* ★ Nr 17 der Fokusziele (22.08.2026): Der Neustart nimmt die
                    ganze Knopfreihe wieder aus dem Baum (`view.won` ist danach
                    falsch) - samt diesem Knopf. Ohne Ziel fiel der Fokus auf
                    `body`, und die nächste Scholle leuchtete für niemanden.
                    Ziel ist das Spielfeld, denn dort geht es weiter. */}
                <button
                  type="button"
                  className="px-btn px-btn--action"
                  onClick={() => {
                    view.restart();
                    window.setTimeout(() => viewportRef.current?.focus(), 0);
                  }}
                >
                  {t.nochmal(isAdult)}
                </button>
                <button ref={doneBtnRef} type="button" className="px-btn px-btn--action" onClick={() => onClose()}>
                  {t.fertig}
                </button>
              </div>
            ) : (
              <button type="button" className="px-btn px-btn--action" onClick={() => onClose()}>
                {t.beenden(free, isAdult)}
              </button>
            )}
          </>
        ) : (
          <>
            <p className="px-status" aria-hidden="true">
              {t.vorschauStatus}
              {zoneTrains(zone, sprache)}
            </p>
            <button type="button" className="px-btn px-btn--action" onClick={() => onClose()}>
              {t.schliessen}
            </button>
          </>
        )}
      </div>

      {/* ★ CVI (19.09.2026, „überall"): beim Tippen bleibt das SPIELFELD hell -
          dort stehen die Zeichen. Kopfleiste (Zone, Herzen) und Steuerleiste
          treten zurück, wie ausserhalb der Übungskarte. Die Schicht liegt über
          der Bühne (80), und die Bühne selbst gilt nicht als „Fenster mit
          Vorrang", weil das Spielfeld in ihr liegt (`CviAbdunkeln`). */}
      <CviAbdunkeln aktiv={zeichenabstand > 1 && game} zielRef={viewportRef} ebene={81} />

      {/* Debug: Posen schalten + Kamera schwenken (nur Vorschau-Abnahme) */}
      {debug && !game && (
        <div className="px-debugbar" role="group" aria-label={t.debug}>
          {POSES.map(({ p, label }) => (
            <button
              key={p}
              type="button"
              className="px-btn"
              aria-pressed={previewPose === p}
              onClick={() => setPreviewPose(p)}
            >
              {label[sprache]}
            </button>
          ))}
          <button
            type="button"
            className="px-btn"
            aria-pressed={previewPan !== 0}
            onClick={() => setPreviewPan((t) => (t === 0 ? previewMax : 0))}
          >
            {t.schwenken}
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
