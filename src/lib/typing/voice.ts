/**
 * Sprachausgabe (Self-Voicing) des Tipptrainers über die Web-Speech-API.
 *
 * Gedacht für Kinder mit Sehbehinderung, die (noch) keinen Screenreader
 * eingerichtet haben: Die App kann das zu tippende Zeichen/Wort und bei Fehlern
 * das richtige Zeichen ansagen. STANDARD AUS — denn läuft bereits NVDA/JAWS/
 * VoiceOver, würde die App-Stimme doppelt sprechen. Wer einen Screenreader
 * nutzt, lässt das aus; das Feedback kommt dann über die ARIA-Live-Region.
 *
 * WICHTIG (Grund, warum es vorher „nicht funktioniert" hat): Browser (Chrome,
 * Safari, Firefox) sperren `speechSynthesis.speak()`, bis es EINMAL aus einer
 * echten Nutzer-Geste heraus angestoßen wurde. Unsere Ansagen passieren aber in
 * React-Effekten (nach dem Tastendruck), also NICHT in der Geste — sie wurden
 * deshalb stumm verschluckt. Lösung: Beim Einschalten (Klick = Geste) wird die
 * Stimme einmal „freigeschaltet" (`primeSpeech`). Siehe [[project_zehnfinger_trainer]].
 *
 * EBENSO WICHTIG (wiederkehrender Bug-Report „App friert ein, nur Neuladen
 * hilft" — nacheinander von Brave/Linux, Brave/macOS und iOS): Die Sprach-
 * Engines ALLER Plattformen verklemmen sich, wenn sie im Anschlagtakt mit
 * cancel()+speak() befeuert werden. Für Kinder, die auf die Stimme angewiesen
 * sind, IST eine dauerhaft stumme Stimme eine eingefrorene App. Darum gilt in
 * dieser Datei überall: Ruhefenster statt Dauerfeuer (runSpeech), Atempause
 * nach jedem cancel (speakAfterCancel), Hänger-Wächter mit Selbstheilung
 * (watchEngineStart/registerStall) und Abbruch beim Wechsel in den Hintergrund
 * (visibilitychange — der klassische iOS-Verklemmer).
 */
import { create } from "zustand";
import { useEffect, useState } from "react";
import { spokenLabel } from "./fingers";
import type { Lang } from "./account";
import { kleinFuer } from "./sprachRegister";
import { SPRACH_TAG, sprachTagFuer, vorleseSprache } from "./vorlesen";
// ★ F58 (29.10.2026): Sprachkürzel und Region der Stimmen (Weg „br" hat Stimmen „pt-BR", nicht „br-…").
import { stimmeInRegion, stimmKuerzel, stimmRegion } from "./stimmKuerzel";
import { installStummTaste } from "@/lib/stummTaste";
import { englischVariante } from "./schreibweise";
import { franzVariante } from "./franzVariante";
import { esVariante } from "./esVariante";

const KEY = "tippen-voice";

interface VoiceSettings {
  enabled: boolean;
  rate: number; // 0.6 .. 2.0
  /**
   * Sprechlautstärke 0.1 .. 1 (Regler im Menü unter dem Lautsprecher-Schalter,
   * 17.10.2026). 1 = so laut, wie das Gerät es hergibt - die Web-Speech-API
   * kann nicht lauter als das Gerät (siehe `reference_lautstaerke_sprachausgabe_messen`);
   * der Regler kann die Stimme darum nur LEISER machen.
   */
  volume: number;
  /**
   * voiceURI der gewählten System-Stimme; "" = automatisch (die App sucht selbst
   * eine passende Stimme, siehe {@link stimmeFuer}). Geräte-spezifisch in
   * localStorage gemerkt — verfügbare Stimmen unterscheiden sich je nach
   * Windows/Mac/Browser, deshalb NICHT im Server-Konto.
   */
  voiceURI: string;
  /** Was vorgelesen wird — frei kombinierbar (Mehrfachauswahl). */
  /**
   * ⚠️ `readLetters` GIBT ES NICHT MEHR (03.09.2026 abends). Der Schalter
   * „Buchstaben" ist in `tastenAnsage` aufgegangen (`lib/typing/a11y.ts`,
   * Johannes: „Buchstaben und den neuen Schalter zusammenführen").
   *
   * Beide sagten dasselbe - welches Zeichen als Nächstes dran ist -, nur auf
   * verschiedenen Wegen: dieser hier über die eigene Stimme, der andere über
   * den Live-Bereich für den Screenreader. Zwei Schalter für einen Wunsch
   * sind zwei Gelegenheiten, das Falsche einzustellen. `readPlanAt` bekommt
   * `letters` jetzt aus `tastenAnsage`; der Parameter selbst bleibt, damit
   * die Funktion ohne Zustand prüfbar ist.
   *
   * ★ Ein gespeicherter Alt-Wert schadet nicht: Er wird beim Lesen einfach
   *   nicht mehr beachtet.
   */
  readWords: boolean; // jedes Wort (am Wortanfang)
  readSentences: boolean; // die ganze Zeile als Satz (am Zeilenanfang)
  /** Wort und anschliessend buchstabieren („Saal: großes S, a, a, l"). */
  setEnabled: (v: boolean) => void;
  setRate: (r: number) => void;
  setVolume: (v: number) => void;
  /** `ohneAbbruch`: die Stimme gilt ab der nächsten Ansage, die laufende darf ausreden. */
  setVoiceURI: (uri: string, optionen?: { ohneAbbruch?: boolean }) => void;
  setReadWords: (v: boolean) => void;
  setReadSentences: (v: boolean) => void;
}

interface VoiceStored {
  enabled: boolean;
  rate: number;
  volume: number;
  voiceURI: string;
  readWords: boolean;
  readSentences: boolean;
}

/** Sprechlautstärke in [0.1, 1]; leer, NaN oder Text wird zur vollen Lautstärke. */
export function sprechLautstaerkeBegrenzen(v: unknown): number {
  if (typeof v !== "number" || !Number.isFinite(v)) return 1;
  return Math.max(0.1, Math.min(1, v));
}

/** Für die Stellen, die eine Utterance bauen: so laut spricht die Stimme. */
export function sprechLautstaerke(): number {
  return useVoice.getState().volume;
}

function read(): VoiceStored {
  // Standard: Wörter + Sätze vorlesen (Wunsch). Einzelne Buchstaben werden für
  // Nicht-Wörter automatisch ergänzt (siehe readPlanAt) — der Buchstaben-Schalter
  // ist daher standardmäßig aus. Stimme automatisch.
  const def: VoiceStored = {
    enabled: false,
    rate: 1,
    volume: 1,
    voiceURI: "",
    readWords: true,
    readSentences: true,
    // Buchstabieren ist ab Werk AUS: Es verlangsamt das Vorlesen deutlich und
    // hilft nur denen, die es brauchen (Wunsch aus Marburg). Die Lehrkraft
    // schaltet es je Kind ein.
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as Partial<VoiceStored>;
      return {
        enabled: !!d.enabled,
        rate: typeof d.rate === "number" ? d.rate : 1,
        volume: sprechLautstaerkeBegrenzen(d.volume),
        voiceURI: typeof d.voiceURI === "string" ? d.voiceURI : "",
        // Altstände ohne die Felder → neue Vorgabe (Wörter + Sätze an).
        readWords: d.readWords ?? true,
        readSentences: d.readSentences ?? true,
      };
    }
  } catch {
    /* ignore */
  }
  return def;
}

function persist(s: VoiceStored): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export const useVoice = create<VoiceSettings>((set, get) => {
  const init = read();
  /*
   * ★ D4 (Umbau 11.09.2026): Bis dahin stand hier `pruefungStumm` - eine
   * Stummschaltung für die Dauer einer Tippchallenge ohne das Häkchen
   * „Vorlesen bei Prüfungen erlaubt". Johannes: „schaff das Häkchen ab, es
   * verwirrt nur." Die App liest jetzt in der Tippchallenge vor, wenn das
   * Kind sein eigenes Vorlesen eingeschaltet hat - wie beim Üben
   * (`SchreibprobeLauf.tsx`) - und braucht diese zweite Stummschaltung
   * nicht mehr.
   */
  const snapshot = (): VoiceStored => {
    const s = get();
    return {
      enabled: s.enabled,
      rate: s.rate,
      volume: s.volume,
      voiceURI: s.voiceURI,
      readWords: s.readWords,
      readSentences: s.readSentences,
    };
  };
  return {
    ...init,
    setEnabled: (v) => {
      if (v) {
        // Beim Einschalten standardmäßig Wörter + Sätze vorlesen (Wunsch). Die
        // App ergänzt für Nicht-Wörter automatisch die Buchstaben (readPlanAt).
        persist({ ...snapshot(), enabled: true, readWords: true, readSentences: true });
        set({ enabled: true, readWords: true, readSentences: true });
        // Wird aus dem Klick-Handler (Geste) gerufen → JETZT freischalten.
        primeSpeech();
      } else {
        persist({ ...snapshot(), enabled: false });
        cancelSpeech();
        stopKeepAlive();
        set({ enabled: false });
      }
    },
    setRate: (r) => {
      const rate = Math.max(0.6, Math.min(2, r));
      persist({ ...snapshot(), rate });
      set({ rate });
    },
    setVolume: (v) => {
      const volume = sprechLautstaerkeBegrenzen(v);
      persist({ ...snapshot(), volume });
      set({ volume });
    },
    setVoiceURI: (uri, optionen) => {
      persist({ ...snapshot(), voiceURI: uri });
      // Laufende Ansage abbrechen, damit die neue Stimme sofort beim nächsten
      // Zeichen greift (sonst spräche die Warteschlange noch mit der alten).
      // ★ NVDA-Lauf 31.10.2026: nicht beim Einschalten des Vorlesens - dort
      // würgte das „Vorlesen an" und die nächste Taste ab (erstes Alt + V stumm).
      if (!optionen?.ohneAbbruch) cancelSpeech();
      set({ voiceURI: uri });
    },
    setReadWords: (v) => {
      persist({ ...snapshot(), readWords: v });
      set({ readWords: v });
    },
    setReadSentences: (v) => {
      persist({ ...snapshot(), readSentences: v });
      set({ readSentences: v });
    },
  };
});

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

/** Alle auf diesem Gerät verfügbaren System-Stimmen (kann anfangs leer sein). */
export function availableVoices(): SpeechSynthesisVoice[] {
  const s = synth();
  return s ? s.getVoices() : [];
}

/**
 * ★★★★★ EINE REGEL FÜR DIE STIMME - und je Sprache eine eigene Liste
 * (07.09.2026, gemeldet von den Schülerinnen und Schülern: „die Stimmen der
 * Zeilenansage sind extrem leise").
 *
 * ── WAS GEMESSEN WURDE ────────────────────────────────────────────────────
 *
 * Am Live-Stand im Browser nachgerechnet: Die Zeilenansage und die
 * Rückmeldungen sprachen mit ZWEI VERSCHIEDENEN Stimmen.
 *
 *   Zeilenansage  (`resolveVoice`)   Anna (premium)
 *   Rückmeldung   (`ansageStimme`)   Markus (erweitert)
 *
 * Die Ursache war ein Zufall: In der Vorzugsliste stand „Mark" - der Name
 * einer WINDOWS-Stimme - und wurde als Teilwort gegen die deutschen Stimmen
 * geprüft. „Markus" enthält „Mark". Eine englische Liste hat so die deutsche
 * Stimme bestimmt, und zwar nur auf einem der beiden Wege. Ein Kind hörte den
 * Übungstext mit der einen und das Lob mit der anderen Stimme.
 *
 * ⚠️ DIE LAUTSTÄRKE ERKLÄRT DAS NICHT - auch das ist gemessen. Mit `say`
 * ausgespielt und mit ffmpeg nachgerechnet liegen alle deutschen
 * macOS-Stimmen innerhalb von gut einem Dezibel (Anna premium -17,4 LUFS,
 * Markus erweitert -18,5 LUFS). `u.volume` stand damals nirgends und damit auf
 * dem Höchstwert 1 (seit 17.10.2026 setzt ihn der Regler im Menü unter dem
 * Lautsprecher-Schalter; Vorgabe bleibt 1): **Die Web-Speech-API kann nicht lauter
 * als das Gerät.** Die einzige Schraube, die es für die Lautstärke überhaupt
 * gibt, ist die WAHL der Stimme - und genau die hat bisher nur den halben Weg
 * erreicht (siehe Punkt 2).
 *
 * ── WAS DARAUS FOLGT ──────────────────────────────────────────────────────
 *
 * 1. EINE Funktion wählt die Stimme - für den Übungstext wie für jede Ansage.
 * 2. Die im Zahnrad GEWÄHLTE Stimme gilt jetzt auch für die Ansagen, solange
 *    sie zur Sprache des Satzes passt. Vorher galt sie nur für den Inhalt:
 *    Wer eine leise Stimme gegen eine lautere tauschte, hörte jede
 *    Rückmeldung unverändert leise weiter - die Einstellung tat die Hälfte.
 * 3. Die Vorzugsnamen stehen JE SPRACHE. Deutsche Stimmen werden nur noch
 *    mit deutschen Namen verglichen.
 * 4. Verglichen wird mit Wortgrenze statt als Teilwort: „Anna" trifft weiter
 *    „Anna (premium)" und „Microsoft Anna", „Mark" trifft „Markus" nicht mehr.
 *
 * ⚠️ Punkt 2 nimmt Jens' Befund vom 29.08.2026 NICHTS weg: Die gewählte
 * Stimme gilt nur, wenn ihre Sprache zum Satz passt. Ein englischer Satz
 * bekommt nie eine deutsche Stimme („Pankt"), auch wenn im Pulldown eine
 * deutsche steht.
 */
const VORZUGS_STIMMEN: Record<string, readonly string[]> = {
  de: [
    "Anna", "Petra", "Markus", "Yannick", "Helena", "Viktor", // macOS / iOS
    "Katja", "Hedda", "Stefan", // Windows
    "Google Deutsch", // Chrome
  ],
  // ★ 19.09.2026, Johannes: britisches Englisch gilt - auch für die Stimme
  // (Frage 18: „ja"). Britische Namen zuerst; `beste` nimmt ohnehin zuerst
  // jede en-GB-Stimme des Geräts, diese Reihenfolge entscheidet nur unter ihnen.
  en: [
    "Daniel", "Kate", "Serena", "Oliver", "Arthur", "Martha", // macOS / iOS (en-GB)
    "Hazel", "George", "Susan", // Windows (en-GB)
    "Google UK English", // Chrome (en-GB)
    "Samantha", "Alex", "Karen", "Moira", "Tessa", "Rishi", "Aaron", "Nicky", // macOS, andere Englisch
    "Zira", "David", "Mark", // Windows (en-US)
    "Google US English", // Chrome (en-US)
  ],
  // ★ E12 (26.09.2026, Bauplan §10.1, §14 E12): bekannte Stimmen-Namen der
  // vier Landesvarianten - `beste()` bevorzugt ohnehin zuerst jede Stimme der
  // GERADE geltenden Region (siehe die Erweiterung von `stimmeFuer` unten),
  // diese Reihenfolge entscheidet nur unter mehreren Treffern derselben Region.
  fr: [
    "Thomas", "Aurélie", "Audrey", // macOS / iOS (fr-FR)
    "Amélie", // macOS / iOS (fr-CA)
    "Hortense", "Paul", // Windows (fr-FR)
    "Julie", "Caroline", // Windows (fr-CA)
    "Google français", // Chrome
  ],
  // ★★★ ES-F8 (27.09.2026, Bauplan §1.2 S2, §7): dieselbe Bauart wie „fr" -
  // `beste()` bevorzugt ohnehin zuerst jede Stimme der GERADE geltenden
  // Region (siehe die Erweiterung von `stimmeFuer` unten), diese Reihenfolge
  // entscheidet nur unter mehreren Treffern derselben Region.
  es: [
    "Mónica", "Marisol", "Jorge", // macOS / iOS (es-ES)
    "Paulina", "Juan", "Angélica", // macOS / iOS (es-419/es-MX)
    "Helena", "Laura", "Pablo", // Windows (es-ES)
    "Sabina", "Raul", // Windows (es-419/es-MX)
    "Google español", // Chrome (es-ES)
    "Google español de Estados Unidos", // Chrome (es-419)
  ],
  // ★★★ F8-it (02.10.2026, Bauplan vier Sprachen §3 „Stimmen", §7): Italienisch. GEMESSEN ist nur die Stimme auf dem Mac -
  // `say -v '?'` (macOS 27.2) nennt für it_IT: Alice (die eigentliche Stimme), dazu Eddy, Flo, Grandma, Grandpa, Reed,
  // Rocko, Sandy, Shelley (mehrsprachige Familie, im Browser „Eddy (Italienisch (Italien))" - keine Scherzstimmen, aber
  // auch nicht die Vorgabe). Windows (Elsa/Cosimo?), iOS, Chrome: UNGEMESSEN (Messliste A7 für den PC) - dort gilt, wie
  // für jede Sprache ohne Namen hier, `beste()`: irgendeine nicht mehrsprachige, nicht scherzhafte Stimme mit dem
  // Sprachkürzel „it", die des Geräts zuerst. Namen werden NICHT erfunden (Falle 62: Namen nie aus dem Gedächtnis).
  it: ["Alice"],
  // ★★★ F8-tr (03.10.2026, Bauplan vier Sprachen §3 „Stimmen"): Türkisch. GEMESSEN ist nur die Stimme auf dem Mac - `say -v '?'`
  // (macOS 27.2) nennt für tr_TR genau EINE: Yelda („Merhaba, benim adım Yelda."), keine mehrsprachige Familie dazu. Windows
  // (Tolga/Emel?), iOS, Chrome: UNGEMESSEN (Messliste Z4 für den PC) - dort gilt, wie für jede Sprache ohne gemessenen Namen, `beste()`:
  // irgendeine nicht mehrsprachige, nicht scherzhafte Stimme mit dem Sprachkürzel „tr", die des Geräts zuerst; gibt es keine, setzt der
  // Aufrufer nur `u.lang` („tr-TR") und überlässt der Engine die Wahl (`stimmeFuer`, Stufe 5) - nichts wird erfunden (Falle 62: Namen nie aus dem Gedächtnis).
  tr: ["Yelda"],
  // ★★★ F8-pl (03.10.2026, Bauplan vier Sprachen §3 „Stimmen"): Polnisch. GEMESSEN ist nur die Stimme auf dem Mac - `say -v '?'`
  // (macOS 27.2) nennt für pl_PL genau EINE: Zosia (kein Mann, keine zweite Wahl). Windows (die Messliste Z4 fragt nach
  // „Paulina/Adam"), iOS und Chrome: UNGEMESSEN - dort gilt, wie für jede Sprache ohne Namen hier, `beste()`: irgendeine nicht
  // mehrsprachige, nicht scherzhafte Stimme mit dem Sprachkürzel „pl", die des Geräts zuerst; gibt es keine, spricht das Gerät
  // mit seiner Standardstimme (`SPRACH_TAG.pl` = pl-PL als Rückfall). Namen werden NICHT erfunden (Falle 62).
  pl: ["Zosia"],
  // ★★★ F8-cs (03.10.2026, Bauplan vier Sprachen §3 „Stimmen", §7): Tschechisch. GEMESSEN ist nur die Stimme auf dem Mac - `say -v '?'`
  // (macOS 27.2) nennt für cs_CZ genau EINE: Zuzana (keine mehrsprachige Familie wie bei Italienisch). Windows (laut Messung des PC
  // keine tschechische Stimme installiert; Name und Verfügbarkeit ungemessen), iOS, Chrome: UNGEMESSEN (Messliste A7) - dort gilt, wie
  // für jede Sprache ohne Namen hier, `beste()`: irgendeine nicht mehrsprachige, nicht scherzhafte Stimme mit dem Sprachkürzel „cs", die
  // des Geräts zuerst; gibt es keine, setzt der Aufrufer nur `u.lang = "cs-CZ"` und überlässt es dem Gerät. Namen werden NICHT erfunden
  // (Falle 62: Namen nie aus dem Gedächtnis; kein „Jakub"/„Zuzana (Premium)" ohne Messung).
  cs: ["Zuzana"],
  // ★★★ F58 (29.10.2026): die neun Wege bg, el, hu, nl, pt, br, ro, sv, uk haben BEWUSST KEINE Namen. GEMESSEN am Windows-PC
  // (Registry `Speech_OneCore\Voices\Tokens` und `Speech\Voices\Tokens`, 29.10.2026): installiert sind nur Stimmen für Deutsch,
  // Englisch und Französisch - keine einzige der neun Sprachen. Mac, iOS, Chrome-Netzstimmen: in dieser Etappe nicht messbar. Die
  // Baupläne nennen Namen aus der Recherche („Ivan" bg) - ungemessen, darum nicht hier (Falle 62: Namen nie aus dem Gedächtnis). Es gilt
  // `beste()`: eine Stimme mit dem Kürzel der Sprache (`stimmKuerzel`: „br" ⇒ „pt"), die des Geräts zuerst, keine mehrsprachige, keine
  // Scherzstimme; Portugal und Brasilien zuerst in ihrer eigenen Region (`stimmRegion`). Gibt es keine, setzt der Aufrufer nur
  // `u.lang` („bg-BG") - und `TippenTrainerPage` zeigt beim Sprachwechsel und beim Einschalten des Vorlesens die Anleitung
  // „Stimme installieren" (`firstVoiceURIForLang` ⇒ `null`). Eine deutsche oder englische Stimme wird NIE gewählt (gefiltert nach Kürzel).
};

/**
 * ★★★★ MEHRSPRACHIGE STIMMEN sind für Tastenflow ungeeignet (23.09.2026).
 *
 * Edge meldet unter Windows Netz-Stimmen wie „Microsoft SeraphinaMultilingual
 * Online (Natural) - German (Germany)". Sie raten bei JEDEM Text selbst, welche
 * Sprache es ist - bei einem einzelnen Buchstaben raten sie falsch. Julian
 * Iriogbe (obvita St. Gallen): *„Die von mir getestete hat die Einzelbuchstaben
 * mal in Englisch und mal in Französisch gelesen."* Tastenflow spricht aber
 * genau das: einzelne Buchstaben.
 *
 * Darum: nicht im Pulldown, nie automatisch gewählt, und eine schon GEWÄHLTE
 * fällt auf „automatisch" zurück (`stimmeFuer`).
 */
export function istMehrsprachigeStimme(v: Pick<SpeechSynthesisVoice, "name">): boolean {
  return /multilingual|mehrsprachig/i.test(v.name);
}

/** macOS-Scherzstimmen (auch deutsch lokalisiert) - beim Auto-Wechsel meiden. */
const NOVELTY_VOICE =
  /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|organ|pipe organ|superstar|trinoids|whisper|wobble|zarvox|monster|fl(ü|ue)stern|glocken|orgel|seifenblasen|spa(ß|ss)vogel|gute neuigkeiten|schlechte neuigkeiten)/i;

/**
 * Trifft ein Vorzugsname den Stimmennamen? Mit WORTGRENZE, nicht als Teilwort.
 *
 * ⚠️ Das ist die Zeile, an der die zwei Stimmen hingen: `includes("mark")`
 * trifft „Markus". Geprüft wird darum, ob links und rechts vom Treffer kein
 * Buchstabe und keine Ziffer steht - „Anna" trifft „Anna (premium)" weiter,
 * „Mark" trifft „Markus" nicht mehr.
 */
function nameTrifft(stimmenName: string, wunsch: string): boolean {
  const n = stimmenName.toLowerCase();
  const w = wunsch.toLowerCase();
  if (!w) return false;
  const grenze = (c: string | undefined) => c === undefined || !/[\p{L}\p{N}]/u.test(c);
  for (let i = n.indexOf(w); i >= 0; i = n.indexOf(w, i + 1)) {
    if (grenze(n[i - 1]) && grenze(n[i + w.length])) return true;
  }
  return false;
}

/**
 * Aus einer Liste gleichsprachiger Stimmen die brauchbarste: bevorzugt eine
 * bekannte Standard-Stimme dieser Sprache, sonst irgendeine, die keine
 * Scherzstimme ist (die Vorgabe des Geräts zuerst), sonst die erste.
 */
function beste(
  passend: readonly SpeechSynthesisVoice[],
  sprachKuerzel: string,
): SpeechSynthesisVoice | null {
  if (!passend.length) return null;
  /*
   * ★★★★ ZUERST DIE STIMMEN AUF DEM GERÄT - Netz-Stimmen nur, wenn es
   * KEINE eigene gibt (07.09.2026).
   *
   * Edge und Chrome melden unter Windows neben den eingebauten Stimmen auch
   * „Microsoft Katja Online (Natural)" und Geschwister. Die klingen besser,
   * kommen aber über das Netz: Sie brauchen Internet, sie kosten Anlaufzeit,
   * und im Schulnetz können sie ausfallen - dann sagt die App gar nichts,
   * ohne dass jemand merkt, warum.
   *
   * ⚠️ Das ist eine Falle, die erst mit der Namensliste oben entstanden ist:
   * „Katja" trifft „Microsoft Katja Online (Natural)" genauso wie
   * „Microsoft Katja Desktop". Ohne diese Zeile hätte ein Kind an einem
   * Windows-Rechner ab sofort womöglich eine Netz-Stimme bekommen.
   *
   * Eine ausdrücklich GEWÄHLTE Stimme ist davon nicht betroffen - die wird in
   * `stimmeFuer` vorher zurückgegeben. Wer die Netz-Stimme will, bekommt sie.
   */
  const eigene = passend.filter((v) => v.localService);
  let feld = eigene.length ? eigene : passend;
  /*
   * ★ 19.09.2026 (Johannes, Frage 18: „ja"): Englisch spricht BRITISCH, wo es
   * eine britische Stimme gibt - unabhängig von ihrem Namen. Gemessen im
   * EN10-Durchgang: am Mac sprach „Samantha" (en-US), obwohl „Daniel" (en-GB)
   * installiert war. Ohne en-GB-Stimme bleibt es bei der übrigen Auswahl.
   */
  if (sprachKuerzel === "en") {
    const britisch = feld.filter((v) => /^en[-_]gb\b/i.test(v.lang));
    if (britisch.length) feld = britisch;
  }
  for (const want of VORZUGS_STIMMEN[sprachKuerzel] ?? []) {
    const hit = feld.find((v) => nameTrifft(v.name, want));
    if (hit) return hit;
  }
  const normal = feld.filter((v) => !NOVELTY_VOICE.test(v.name.trim()));
  return (normal.find((v) => v.default) ?? normal[0] ?? feld[0]) ?? null;
}

/**
 * voiceURI einer auf diesem Gerät installierten Stimme zu einer Sprache
 * (z. B. "en" → englische Stimme), oder null, wenn keine installiert ist. Für
 * den automatischen Stimmenwechsel beim Umschalten der Inhaltssprache.
 */
export function firstVoiceURIForLang(langPrefix: string): string | null {
  // ★ F58 (29.10.2026): das Kürzel der STIMMEN, nicht die ersten zwei Buchstaben der Programm-Sprache - „br" fand vorher keine
  // einzige brasilianische Stimme (`pt-BR`), und „pt" nahm die erste portugiesische, gleich aus welchem Land.
  const p = stimmKuerzel(langPrefix);
  const matches = availableVoices().filter(
    (vc) => vc.lang.toLowerCase().slice(0, 2) === p && !istMehrsprachigeStimme(vc),
  );
  return (regionalOderAlle(matches, langPrefix, p) ?? beste(matches, p))?.voiceURI ?? null;
}

/**
 * ★ F58 (29.10.2026): Portugal und Brasilien teilen das Kürzel „pt". Gibt es Stimmen der eigenen Region, wird unter IHNEN gewählt;
 * sonst `null` (dann gilt die breite Auswahl - eine brasilianische Stimme für Portugal ist besser als keine, nie aber eine deutsche).
 */
function regionalOderAlle(
  passend: readonly SpeechSynthesisVoice[],
  lang: string,
  p: string,
): SpeechSynthesisVoice | null {
  const region = stimmRegion(lang);
  if (!region) return null;
  const regional = passend.filter((v) => stimmeInRegion(v.lang, region));
  return regional.length ? beste(regional, p) : null;
}

/**
 * ★★★★★ DIE EINE STELLE, an der entschieden wird, WER spricht - für den
 * Übungstext genauso wie für jede Ansage. Reihenfolge:
 *
 *   1. die im Zahnrad GEWÄHLTE Stimme - wenn es sie hier gibt UND ihre
 *      Sprache zum Satz passt
 *   2. eine bekannte Standard-Stimme dieser Sprache (`VORZUGS_STIMMEN`)
 *   3. irgendeine Stimme dieser Sprache, die keine Scherzstimme ist
 *   4. irgendeine Stimme dieser Sprache
 *   5. `null` - dann setzt der Aufrufer nur `u.lang` und überlässt der Engine
 *      die Wahl
 *
 * Wird bei JEDER Ansage frisch aufgelöst, damit ein Stimmenwechsel sofort
 * greift und eine auf einem anderen Gerät gewählte (hier fehlende) Stimme
 * sauber auf „automatisch" zurückfällt.
 */
function stimmeFuer(s: SpeechSynthesis, lang: Lang): SpeechSynthesisVoice | null {
  const voices = s.getVoices();
  if (!voices.length) return null; // noch nicht geladen → nächster Versuch
  const p = SPRACH_TAG[lang].slice(0, 2).toLowerCase();
  // (★ F58: für „br" ist `p` hier „pt" - SPRACH_TAG.br = „pt-BR"; dieselbe Antwort wie `stimmKuerzel`, Wächter F58.)
  const passend = voices.filter(
    (v) => v.lang.toLowerCase().slice(0, 2) === p && !istMehrsprachigeStimme(v),
  );
  const uri = useVoice.getState().voiceURI;
  if (uri) {
    const gewaehlt = passend.find((v) => v.voiceURI === uri);
    if (gewaehlt) return gewaehlt;
    // Gewählte Stimme fehlt hier oder spricht eine andere Sprache → automatisch.
  }
  // ★ E9 (24.09.2026, Bauplan §8.2): bei Englisch die REGION der Schreibweise
  // bevorzugen - „us" sucht zuerst unter den `en-US`-Stimmen, „gb" ändert
  // nichts (weiter irgendeine englische Stimme, wie vor E9). Gibt es keine
  // passende Region, gilt die bisherige, breite Auswahl unverändert.
  if (lang === "en" && englischVariante() === "us") {
    const usPassend = passend.filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("en-us"));
    if (usPassend.length) return beste(usPassend, p);
  }
  /**
   * ★ E12 (26.09.2026, Bauplan §10.1, §14 E12, Auftrag Punkt 4): dieselbe
   * Regel für Französisch - `franzVariante()` liefert `fr-FR` als Grundform
   * ODER die Region der geltenden Landesvariante (Belgien/Schweiz/Kanada,
   * `franzVariante.ts`). Bei „fr-FR" ändert sich nichts (weiter irgendeine
   * französische Stimme); ist eine ANDERE Variante gewählt, wird zuerst unter
   * IHREN Stimmen gesucht, sonst bleibt die bisherige breite Auswahl.
   */
  if (lang === "fr") {
    const variante = franzVariante();
    if (variante !== "fr-FR") {
      const regional = passend.filter((v) =>
        v.lang.toLowerCase().replace("_", "-").startsWith(variante.toLowerCase()),
      );
      if (regional.length) return beste(regional, p);
    }
  }
  /**
   * ★★★ ES-F8 (27.09.2026, Bauplan §1.2 S2, §7): dieselbe Regel für
   * Spanisch - `esVariante()` liefert `es-ES` als Grundform ODER `es-419`
   * (Lateinamerika, `esVariante.ts`). Bei „es-ES" ändert sich nichts (weiter
   * irgendeine spanische Stimme); ist Lateinamerika gewählt, wird zuerst
   * unter dessen Stimmen gesucht (deren `lang` steht meist als Länderkürzel,
   * z. B. „es-MX"/„es-AR", nicht wörtlich „es-419" - darum reicht ein Test
   * auf „nicht es-ES" statt eines Präfix-Vergleichs mit „es-419").
   */
  if (lang === "es") {
    const variante = esVariante();
    if (variante === "es-419") {
      const regional = passend.filter(
        (v) => !v.lang.toLowerCase().replace("_", "-").startsWith("es-es"),
      );
      if (regional.length) return beste(regional, p);
    } else {
      const regional = passend.filter((v) =>
        v.lang.toLowerCase().replace("_", "-").startsWith("es-es"),
      );
      if (regional.length) return beste(regional, p);
    }
  }
  // ★ F58 (29.10.2026): Portugal („pt-PT") und Brasilien („pt-BR") zuerst unter den Stimmen ihrer Region.
  const regional = regionalOderAlle(passend, lang, p);
  if (regional) return regional;
  return beste(passend, p);
}

/**
 * React-Hook: die verfügbaren Stimmen, aktualisiert sich bei `voiceschanged`
 * (Browser laden die Liste asynchron nach). Versorgt das Stimmen-Pulldown.
 */
export function useAvailableVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() =>
    availableVoices(),
  );
  useEffect(() => {
    const s = synth();
    if (!s) return;
    const update = () => setVoices(s.getVoices());
    update(); // direkt einmal — manche Browser haben die Liste schon
    s.addEventListener("voiceschanged", update);
    return () => s.removeEventListener("voiceschanged", update);
  }, []);
  return voices;
}

// --- Lesezeit-Messung (faire Anschlagfrequenz fürs Selbst-Vorlesen) ----------
// Echte Sprechdauer der Vorlese-Stimme, damit der Tipplauf sie aus Tempo und
// Statistik herausrechnen kann. Sonst zahlen Braille-Arbeiter, die das Vorlesen
// brauchen, mit künstlich langsamem Tempo: Die Zeit, die sie auf die Ansage
// warten, würde sonst als langsames Tippen zählen.
//
// Gemessen wird per POLLING von `speechSynthesis.speaking` (alle ~120 ms), NICHT
// über die Utterance-Events `onstart`/`onend` — die feuern in manchen Browsern/
// Automations-Umgebungen unzuverlässig, `speaking` ist verlässlich. Monoton
// wachsend; es zählt nur Zeit, in der wirklich gesprochen wird.
let spokenMsAccum = 0;
let speakTickAt: number | null = null; // Zeitpunkt des letzten Ticks, solange gesprochen wird
let speakTicker: ReturnType<typeof setInterval> | null = null;

function speakTick(): void {
  const s = synth();
  const now = Date.now();
  if (s && s.speaking) {
    if (speakingCapAt !== 0 && now > speakingCapAt) {
      // `speaking` hängt LÄNGER, als der eingereichte Text überhaupt dauern
      // kann → Engine verklemmt (bekannter Chromium-Wedge: speaking bleibt für
      // immer true, kein Ton). Nicht als Lesezeit zählen, sondern heilen.
      speakingCapAt = now + 4000; // Backoff — nicht jeden Tick erneut zählen
      speakTickAt = null;
      registerStall();
      return;
    }
    if (speakTickAt !== null) spokenMsAccum += now - speakTickAt;
    speakTickAt = now;
    // Die Engine spricht hörbar → sie ist gesund (für den Hänger-Wächter).
    lastSpokeAt = now;
    stallCount = 0;
  } else {
    // Nichts (mehr) zu sprechen → Ticker schlafen legen (spart den Timer).
    speakingCapAt = 0;
    stopSpeakTicker();
  }
}

function startSpeakTicker(): void {
  if (speakTicker !== null) return;
  speakTickAt = null; // erster Tick zählt noch nichts dazu (kein Vorlauf)
  speakTicker = setInterval(speakTick, 120);
}

function stopSpeakTicker(): void {
  if (speakTicker !== null) {
    clearInterval(speakTicker);
    speakTicker = null;
  }
  speakTickAt = null;
}

/**
 * Gesamte bisher hörbar gesprochene Zeit (ms), inklusive einer gerade laufenden
 * Ansage. Die DIFFERENZ zweier Aufrufe ist die Sprechzeit dazwischen — so
 * rechnet {@link TypingSession} die Vorlese-/Lesezeit aus dem Tipptempo heraus.
 */
export function spokenMs(): number {
  const s = synth();
  if (s && s.speaking && speakTickAt !== null) {
    return spokenMsAccum + (Date.now() - speakTickAt); // laufenden Abschnitt mitzählen
  }
  return spokenMsAccum;
}

/** Spricht die Vorlese-Stimme gerade? (Für die faire Tippzeit, siehe unten.) */
export function isSpeaking(): boolean {
  const s = synth();
  return !!(s && s.speaking);
}

/**
 * Reine Tipp-Zeit eines Anschlag-Abstands — FAIR zwischen „sieht den Text" und
 * „ist auf das Vorlesen angewiesen" (Wunsch Johannes):
 *
 *  • Wird der Anschlag gemacht, WÄHREND die Stimme noch spricht (`speakingNow`),
 *    hat die Person den Text offensichtlich gesehen und parallel getippt — dann
 *    zählt die VOLLE Tippzeit (kein Vorteil durchs Vorlesen). Die Tippzeit ist
 *    vorrangig.
 *  • Hat die Stimme dagegen aufgehört und die Person tippt erst DANACH, hat sie
 *    auf die Ansage gewartet — diese Wartezeit (die vorgelesene Zeit im Abstand)
 *    wird abgezogen, damit sie nicht als langsames Tippen zählt (z. B. blinde
 *    Kinder, die das Vorlesen brauchen).
 *
 * Nie negativ. Pure Funktion (testbar). `speakingNow` ist optional (Standard
 * false = altes Verhalten „Vorlesezeit immer abziehen").
 */
export function typingGapMs(
  rawDeltaMs: number,
  spokenInGapMs: number,
  speakingNow = false,
): number {
  if (speakingNow) return Math.max(0, rawDeltaMs); // parallel getippt → volle Tippzeit
  return Math.max(0, rawDeltaMs - Math.max(0, spokenInGapMs));
}

// --- Ruhefenster gegen die „cancel→speak bei JEDEM Anschlag"-Flut -------------
// Ein cancel()+speak()-Sturm im Anschlagtakt verklemmt die Sprach-Engines ALLER
// Plattformen (wiederkehrender Bug-Report „App friert ein, nur Neuladen hilft"):
// Linux/speech-dispatcher fror den Renderer ein, Brave/macOS verstummt dauerhaft
// (brave-browser #45423, Chromium-130+-Wedge), und WebKit/iOS hat einen (erst in
// Safari TP 241, 04/2026 gefixten) Bug, bei dem cancel() nachfolgend eingereihte
// speak()-Aufrufe mit verschluckt. Darum überall dieselbe Gangart:
//   • Ruhefenster (trailing): Beim flüssigen Tippen wird die Engine GAR NICHT
//     befeuert — nur der JÜNGSTE Auftrag überlebt und spricht erst, wenn kurz
//     kein neuer kam. Ist die Engine still und das Fenster längst verstrichen,
//     spricht eine einzelne Ansage sofort (keine hörbare Latenz im Lerntempo).
//   • Atempause nach jedem echten cancel() vor dem nächsten speak() — das
//     synchrone speak-nach-cancel ist der dokumentierte Verschlucker-Auslöser
//     (Chromium #335907, Mozilla #1522074, WebKit bis TP 241).
const SETTLE_MS = 150;
const LINUX_SETTLE_MS = 220; // speech-dispatcher ist am fragilsten → mehr Ruhe
const CANCEL_GAP_MS = 90;
const LINUX_CANCEL_GAP_MS = 60;
let lastEngineAt = 0;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let cancelGapTimer: ReturnType<typeof setTimeout> | null = null;

// --- Zwei Klassen von Ansagen (Befund F21, Vollaudit 30./31.08.2026) ----------
//
// Bis zum 31.08. hielt die Drossel EINEN modulweiten Warteplatz, und den bekam
// immer der jüngste Auftrag. Gemessen (`pruefstand/kind/protokolle/beweis-92-rueckkehr.json`):
// Nach dem Rundenende war „Mein Training." angeschlossen und stand trotzdem in
// KEINER Protokollzeile — der frisch aufgebaute Trainer schickte im selben
// Ruhefenster seinen Aufgabentext hinterher und überschrieb sie. Dasselbe beim
// Geschichten-Direktstart mit dem Titel („Das Licht in der Höhle.").
//
// ⚠️ Die naheliegende Behebung wäre falsch: Eine schlichte FIFO-Reihe für ALLES
// spräche beim flüssigen Tippen jeden einzelnen Anschlag nach (Abnahmeregel
// R-A9, „kein Dauerfeuer"). Der eine Platz ist DORT Absicht. Darum zwei Klassen:
//
//   • "ersetzbar" (Vorgabe) — Zeichen, Wörter, Zeilen beim Tippen. Ein neuer
//     Auftrag dieser Klasse verdrängt einen wartenden derselben Klasse. Genau
//     das Verhalten von vorher, unverändert.
//   • "ereignis" — sagt dem Kind, was gerade GESCHEHEN ist: „Mein Training.",
//     ein Geschichtentitel, eine Medaille, die Antwort auf ein Tastenkürzel.
//     Diese Ansagen werden nicht verdrängt und verdrängen auch nichts; sie
//     reihen sich ein und werden NACHEINANDER gesprochen.
//
// Der Deckel ist derselbe Gedanke wie bei `speakQueued`: Bei einem Ansage-Sturm
// darf die Reihe nicht endlos wachsen, sonst hört das Kind minutenlang alte
// Sätze. Läuft sie über, fällt der ÄLTESTE wartende heraus — nie der laufende.
type Ansageart = "ersetzbar" | "ereignis" | "sofort";
type WartenderAuftrag = { job: () => void; art: Ansageart };

const PENDING_MAX = 3; // wartende Aufträge insgesamt (der laufende zählt nicht mit)
let pendingJobs: WartenderAuftrag[] = [];

/**
 * Hat die Sprachausgabe gerade einen Auftrag - sprechend ODER noch wartend
 * (Ruhefenster, Atempause nach einem Abbruch, Reihe)?
 *
 * `isSpeaking` allein reicht dafür nicht: Ein Satz, der noch im Ruhefenster
 * oder in der Atempause steht, spricht noch nicht - und ein Anschlag in genau
 * diesem Augenblick verwürfe ihn, bevor er begonnen hat.
 *
 * Gebraucht von `TypingSession` für `satzAusreden` (Tippchallenge, Johannes
 * 10.09.2026: *„Sprachausgabe soll weitersprechen wenn schon getippt wird"*).
 */
export function sprachausgabeBeschaeftigt(): boolean {
  const s = synth();
  if (s && (s.speaking || s.pending)) return true;
  return flushTimer !== null || cancelGapTimer !== null || pendingJobs.length > 0;
}

// --- Hänger-Wächter (Selbstheilung + Notbremse) -------------------------------
// Zwei Verklemm-Formen werden auf ALLEN Plattformen erkannt:
//   1. Die Engine beginnt nach einem Auftrag nachweislich NICHT zu sprechen
//      (der 120-ms-Ticker sieht binnen STALL_MS nie `speaking`).
//   2. `speaking` hängt LÄNGER, als der eingereichte Text dauern kann
//      (speakingCapAt in speakTick — der Chromium-„für immer speaking"-Wedge).
// Jeder Hänger versucht zuerst die Selbstheilung: cancel() löst die Verstopfung,
// die nächste Ansage startet frisch. Erst nach STALL_LIMIT Hängern IN FOLGE legt
// sich das Vorlesen still (Schalter geht sichtbar aus, die Screenreader-Live-
// Region übernimmt wieder), statt die Engine weiter zu füttern. Eine bewusste
// Nutzer-Geste (primeSpeech, z. B. „Vorlesen an") gibt ihr eine neue Chance.
const STALL_MS = 3000;
const STALL_LIMIT = 3;
let lastSpokeAt = 0;
let stallCount = 0;
let engineHalted = false;
let stallTimer: ReturnType<typeof setTimeout> | null = null;
// Späteste plausible Sprech-Endzeit des eingereichten Textes (großzügig: selbst
// rate 0.6 braucht keine 200 ms je Zeichen). Echtes Sprechen ist vom Wedge per
// API sonst nicht unterscheidbar — die Utterance-Events feuern unzuverlässig.
let speakingCapAt = 0;

function noteEngineSubmit(chars: number): void {
  const cap = Date.now() + 4000 + chars * 200;
  if (cap > speakingCapAt) speakingCapAt = cap;
}

function registerStall(): void {
  if (engineHalted) return;
  stallCount += 1;
  try {
    // Selbstheilung: Verstopfung lösen — die nächste Ansage startet frisch.
    synth()?.cancel();
  } catch {
    /* ignore */
  }
  if (stallCount >= STALL_LIMIT) haltEngine();
}

function haltEngine(): void {
  engineHalted = true;
  clearPendingSpeech();
  resetSpeechQueue();
  stopSpeakTicker();
  try {
    synth()?.cancel();
  } catch {
    /* ignore */
  }
  // Schalter sichtbar auf AUS — ab jetzt übernimmt die Live-Region die
  // Meldungen (announce in TypingSession spricht nur bei ausgeschaltetem
  // Self-Voicing über den Screenreader).
  useVoice.getState().setEnabled(false);
  console.warn(
    "Tastenflow: Die Sprachausgabe des Browsers reagiert nicht mehr. " +
      "Vorlesen wurde zum Schutz vor dem Einfrieren ausgeschaltet - " +
      "über den Vorlesen-Schalter lässt es sich erneut versuchen.",
  );
}

function watchEngineStart(): void {
  const jobAt = Date.now();
  if (stallTimer !== null) clearTimeout(stallTimer);
  stallTimer = setTimeout(() => {
    stallTimer = null;
    if (engineHalted) return;
    if (lastSpokeAt >= jobAt) return; // hat gesprochen → gesund
    registerStall();
  }, STALL_MS);
}

function clearPendingSpeech(): void {
  if (flushTimer !== null) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (cancelGapTimer !== null) {
    clearTimeout(cancelGapTimer);
    cancelGapTimer = null;
  }
  stopNachrueckWatch();
  pendingJobs = [];
}

// --- Nachrücken: die zweite Ansage erst, wenn die erste fertig ist ------------
//
// Ohne das wäre die Klassen-Trennung wirkungslos: Beide Aufträge kämen zwar
// durch, aber der zweite ruft `cancelIfBusy()` und schnitte den ersten nach
// wenigen Millisekunden ab — der Fehler wäre nur seitenverkehrt. Deshalb wird
// der nächste Auftrag erst abgesetzt, wenn die Engine wirklich still ist.
//
// Die Fertig-Erkennung ist dieselbe wie bei `speakQueued` und aus demselben
// Grund ein Ticker statt `onend`: Die Events feuern in manchen Browsern
// unzuverlässig. Bleibt die Engine stumm oder hängt sie, rückt die Reihe nach
// spätestens NACHRUECK_NO_SPEECH_MS bzw. NACHRUECK_CAP_MS weiter, statt zu
// verklemmen.
const NACHRUECK_POLL_MS = 120;
const NACHRUECK_NO_SPEECH_MS = 2500; // Engine hat NIE zu sprechen begonnen
const NACHRUECK_CAP_MS = 60000; // Notbremse gegen ein hängendes `speaking`

let nachrueckWatch: ReturnType<typeof setInterval> | null = null;
let nachrueckStartedAt = 0;
let nachrueckSawSpeech = false;

function stopNachrueckWatch(): void {
  if (nachrueckWatch !== null) {
    clearInterval(nachrueckWatch);
    nachrueckWatch = null;
  }
}

/** Den nächsten wartenden Auftrag absetzen und, falls nötig, erneut nachrücken. */
function sprichNaechsten(): void {
  stopNachrueckWatch();
  const next = pendingJobs.shift();
  if (!next) return;
  lastEngineAt = Date.now();
  next.job();
  if (pendingJobs.length) planeNachruecken();
}

/** Warten, bis die laufende Ansage fertig ist — dann den nächsten absetzen. */
function planeNachruecken(): void {
  stopNachrueckWatch();
  nachrueckStartedAt = Date.now();
  nachrueckSawSpeech = false;
  nachrueckWatch = setInterval(() => {
    if (!pendingJobs.length || engineHalted) return void stopNachrueckWatch();
    const s = synth();
    if (!s) return void stopNachrueckWatch();
    const elapsed = Date.now() - nachrueckStartedAt;
    if (s.speaking || s.pending) {
      nachrueckSawSpeech = true;
      if (elapsed >= NACHRUECK_CAP_MS) sprichNaechsten(); // hängendes `speaking`
      return;
    }
    // Nichts (mehr) in der Engine: entweder fertig gesprochen …
    if (nachrueckSawSpeech) return void sprichNaechsten();
    // … oder sie hat nie begonnen (Fehlstart/stumm) → nach der Karenz weiter.
    if (elapsed >= NACHRUECK_NO_SPEECH_MS) sprichNaechsten();
  }, NACHRUECK_POLL_MS);
}

function runSpeech(job: () => void, art: Ansageart = "ersetzbar"): void {
  if (engineHalted) return; // Engine verklemmt → nichts mehr absetzen
  const settle = isLinuxChromium() ? LINUX_SETTLE_MS : SETTLE_MS;
  const s = synth();
  // Freie Bahn (nicht auf Linux — speech-dispatcher bekommt IMMER das volle
  // Ruhefenster): Engine still, kein Auftrag wartet und das Fenster ist längst
  // verstrichen → sofort sprechen, damit einzelne Ansagen nicht künstlich
  // verzögert werden (Fehler-Hinweis, Zeilenstart im Lerntempo).
  //
  // ⚠️ `pendingJobs.length === 0` gehört dazu (F21): Zwischen zwei Ansagen einer
  // Reihe ist die Engine kurz still und der `flushTimer` schon abgelaufen — ohne
  // diese Bedingung überholte ein neuer Auftrag die wartende Reihe und die
  // Reihenfolge wäre wieder dahin.
  /*
   * ★★★★★ „sofort" - DIE ANSAGE DER NÄCHSTEN TASTE (03.09.2026 abends).
   *
   * Johannes am iPad: *„sofort wenn eine Taste gedrückt wird muss die nächste
   * angesagt werden."* Gemessen hatte er fast eine Sekunde.
   *
   * ── WARUM DAS RUHEFENSTER HIER FALSCH IST ────────────────────────────
   * Es ist gegen DAUERFEUER gebaut: Beim flüssigen Vorlesen einer Zeile soll
   * die Engine nicht bei jedem Anschlag angefasst werden. Für die Ansage der
   * NÄCHSTEN Taste ist genau das aber der Zweck - sie gehört zum Anschlag und
   * ist eine Zehntelsekunde später schon veraltet. Sprach die vorige Ansage
   * noch, landete die neue im Fenster und wartete, bis 150 ms lang kein
   * Auftrag mehr kam; auf iOS kam die Anlaufzeit der Engine dazu.
   *
   * ── ⚠️ WAS DABEI NICHT ANGETASTET WIRD ───────────────────────────────
   * Die Einfrier-Sicherung. Sie sitzt NICHT im Ruhefenster, sondern IM
   * AUFTRAG: `cancelIfBusy` + `speakAfterCancel` (90 ms Atempause nach einem
   * echten cancel). Das synchrone speak-direkt-nach-cancel ist der
   * dokumentierte Auslöser (Chromium #335907, Mozilla #1522074, WebKit/iOS
   * bis Safari TP 241) - und der bleibt vermieden. Übersprungen wird allein
   * die Dauerfeuer-Drossel.
   *
   * ⚠️ Auf LINUX bleibt auch „sofort" im Fenster: speech-dispatcher ist die
   * fragilste Engine, dort hat das Dauerfeuer die Seite eingefroren. Ein
   * Kind an einem Linux-Rechner hört die Ansage also weiterhin beim
   * Innehalten - langsamer, aber die Seite lebt.
   */
  if (art === "sofort" && !isLinuxChromium() && s) {
    if (flushTimer !== null) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    // Wartende ersetzbare UND wartende sofortige verwerfen: Eine veraltete
    // „nächste Taste" ist schlimmer als keine.
    pendingJobs = pendingJobs.filter((p) => p.art === "ereignis");
    lastEngineAt = Date.now();
    job();
    /*
     * ⚠️⚠️ WARTENDE EREIGNIS-ANSAGEN MÜSSEN NACHRÜCKEN.
     *
     * Die erste Fassung dieses Zweiges hörte hier auf - und liess damit eine
     * wartende Ereignis-Ansage („Mein Training.", ein Geschichtentitel, eine
     * Medaille) für immer liegen: Das Ruhefenster war gerade abgeräumt, also
     * kam kein Flush mehr. Das ist wortwörtlich Befund F21, gegen den die
     * Drossel gebaut wurde - und mein eigener Test hat ihn gefangen, bevor er
     * live ging.
     */
    if (pendingJobs.length) planeNachruecken();
    return;
  }

  const idle =
    !isLinuxChromium() &&
    !!s &&
    !s.speaking &&
    !s.pending &&
    flushTimer === null &&
    pendingJobs.length === 0 &&
    Date.now() - lastEngineAt >= settle;
  if (idle) {
    lastEngineAt = Date.now();
    job();
    return;
  }
  // Ruhefenster: gesprochen wird erst, wenn `settle` lang kein neuer Auftrag kam.
  // Beim flüssigen Tippen fasst das die Engine gar nicht an — erst beim Innehalten
  // kommt die Ansage.
  //
  // Wer sich wie einreiht (F21, siehe die Klassen oben):
  //   • "ersetzbar" wirft die wartenden ERSETZBAREN weg und stellt sich hin.
  //     Beim Tippen bleibt so höchstens einer übrig — Verhalten wie vorher.
  //   • "ereignis" wirft nichts weg, sondern stellt sich hinten an.
  if (art === "ersetzbar") {
    pendingJobs = pendingJobs.filter((p) => p.art !== "ersetzbar");
  }
  pendingJobs.push({ job, art });
  while (pendingJobs.length > PENDING_MAX) pendingJobs.shift(); // ältester fliegt

  if (flushTimer !== null) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    sprichNaechsten();
  }, settle);
}

/**
 * Chromium unter Linux (Brave/Mint) hat eine berüchtigt fragile Sprach-Engine
 * (speech-dispatcher). Der 15-s-Weckruf `pause()/resume()` ist DORT schädlich —
 * er kann den Engine-Zustand zerschießen und die Seite einfrieren — und für
 * unsere kurzen Ansagen ohnehin unnötig. Darum dort weglassen (ebenso das
 * inline-`resume()` vor jeder Ansage und das blinde `cancel()`).
 */
function isLinuxChromium(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Linux/.test(ua) && !/Android/.test(ua);
}

/**
 * Bricht Laufendes/Wartendes ab — aber NUR, wenn die Engine wirklich beschäftigt
 * ist. Das blinde `cancel()` vor jeder Ansage war auf Linux der halbe Freeze:
 * Im Lerntempo (Ansage längst fertig, bevor der nächste Anschlag kommt) entfällt
 * der riskante IPC zum speech-dispatcher jetzt komplett.
 * Liefert true, wenn abgebrochen wurde (→ auf Linux Atempause vor dem speak()).
 */
/**
 * Wann zuletzt WEGEN BESCHÄFTIGUNG abgebrochen wurde. Nur danach wird eine
 * verschluckte Ansage nachgefasst - siehe `submitUtterance`.
 */
let letzterAbbruchAt = 0;

function cancelIfBusy(s: SpeechSynthesis): boolean {
  let busy = false;
  try {
    busy = s.speaking || s.pending || (!isLinuxChromium() && s.paused);
    if (busy) {
      s.cancel();
      letzterAbbruchAt = Date.now();
    }
  } catch {
    /* ignore */
  }
  return busy;
}

/**
 * Nach einem echten cancel() kurz durchatmen lassen, sonst sofort sprechen.
 * Gilt auf ALLEN Plattformen: Das synchrone speak-direkt-nach-cancel ist der
 * dokumentierte Auslöser dafür, dass die neue Ansage verschluckt wird oder die
 * Engine verklemmt (Chromium #335907, Mozilla #1522074; WebKit/iOS verschluckt
 * bis Safari TP 241 sogar ALLE nach einem cancel eingereihten Utterances).
 */
function speakAfterCancel(didCancel: boolean, fn: () => void): void {
  if (!didCancel) return fn();
  if (cancelGapTimer !== null) clearTimeout(cancelGapTimer);
  cancelGapTimer = setTimeout(
    () => {
      cancelGapTimer = null;
      fn();
    },
    isLinuxChromium() ? LINUX_CANCEL_GAP_MS : CANCEL_GAP_MS,
  );
}

// iOS-GC-Schutz: WebKit kann eine Utterance einsammeln, BEVOR sie fertig
// gesprochen ist — ihre Events (end/error) gehen dann verloren und Warteschlangen
// verklemmen. Referenz bis end/error festhalten; ein Größen-Deckel verhindert
// Ansammlung, falls die Events (bekanntes Safari-Verhalten bei cancel) nie feuern.
const liveUtterances = new Set<SpeechSynthesisUtterance>();

function holdUtterance(u: SpeechSynthesisUtterance): void {
  liveUtterances.add(u);
  if (liveUtterances.size > 8) {
    for (const oldest of liveUtterances) {
      liveUtterances.delete(oldest);
      break;
    }
  }
  const drop = (): void => {
    liveUtterances.delete(u);
  };
  if (typeof u.addEventListener === "function") {
    u.addEventListener("end", drop);
    u.addEventListener("error", drop);
  }
}

/** Utterance an die Engine geben — mit GC-Schutz, Sprechzeit-Messung und Wächter. */
/**
 * ★★★★★ EINE VERSCHLUCKTE ANSAGE NICHT VERSCHLUCKT LASSEN (04.09.2026).
 *
 * ── DIE MESSUNG ───────────────────────────────────────────────────────────
 *
 * Vierzig Ansagen am iPad im laufenden Trainer (`?ansagemessung=1`):
 *
 *   Sprechbeginn NACH Abbruch   89 ms   ·   Fehlstarts  7 von 31  = 23 %
 *   Sprechbeginn OHNE Abbruch   10 ms   ·   Fehlstarts  0 von  9  =  0 %
 *
 * **Fast jede vierte Ansage nach einem `cancel()` beginnt gar nicht.** Alle
 * sieben Fehlstarts standen hinter einem Abbruch, keiner ohne. WebKit/iOS
 * verschluckt die Utterance nach einem Abbruch - genau der Grund, aus dem es
 * die 90-ms-Atempause gibt; sie reicht nur nicht immer.
 *
 * Für ein Kind ist eine ausgefallene Ansage dasselbe wie eine unendlich
 * langsame: Es wartet auf etwas, das nie kommt. Johannes' Meldung
 * *„es dauert unglaublich lange"* war zum Teil genau das.
 *
 * ── WARUM EIN ZWEITER VERSUCH UND NICHT EIN UMBAU ─────────────────────────
 *
 * Johannes hat am 04.09. drei andere Wege verworfen, jeden mit Grund:
 *   • die laufende Ansage ausreden lassen ⇒ stört den Schreibfluss
 *   • ohne Atempause abbrechen ⇒ holt die lange Wartezeit auf allen anderen
 *     Geräten zurück, und das iPad ist das am wenigsten benutzte
 *   • weniger sprechen ⇒ ändert, was ein Kind hört
 *
 * Der zweite Versuch löst keinen dieser Einwände aus: Er ändert nicht, WAS
 * gesprochen wird, nicht den Schreibfluss (die Ansage kommt, statt
 * auszufallen), und auf Geräten ohne Fehlstarts greift er NIE - dort hat die
 * Ansage längst begonnen, bevor nachgesehen wird.
 *
 * ⚠️ ERKANNT AN `lastSpokeAt`, NICHT an `onstart` - die Begründung steht unten
 * im Rumpf. Und NUR nach einem Abbruch, weil nur dort gemessen wurde.
 *
 * ⚠️ GENAU EINMAL. Ein zweiter Fehlversuch wird nicht noch einmal versucht -
 * sonst stapeln sich bei einer verklemmten Engine die Aufträge, und dafür ist
 * der Stall-Wächter da (`watchEngineStart`, `STALL_MS`), der nach drei Hängern
 * das Vorlesen sichtbar abschaltet.
 *
 * ⚠️ NUR SOLANGE DIE ANSAGE NOCH AKTUELL IST. Ist inzwischen etwas anderes
 * abgesetzt worden (`u` ist nicht mehr der jüngste Auftrag), wird NICHT
 * wiederholt - eine veraltete „nächste Taste" ist schlimmer als keine. Das ist
 * dieselbe Regel wie bei `"sofort"`.
 */
const NACHFASSEN_MS = 300;
/** Der jüngste abgesetzte Auftrag - nur er darf nachgefasst werden. */
let juengsterAuftrag: SpeechSynthesisUtterance | null = null;

function submitUtterance(
  s: SpeechSynthesis,
  u: SpeechSynthesisUtterance,
  zweiterVersuch = false,
): void {
  holdUtterance(u);
  if (!zweiterVersuch) juengsterAuftrag = u;
  /*
   * ★★★★★ WORAN „VERSCHLUCKT" ERKANNT WIRD - und warum NICHT an `onstart`.
   *
   * Die erste Fassung hing an `u.addEventListener("start", …)`. Das ist genau
   * die Quelle, die diese Datei an anderer Stelle selbst als unzuverlässig
   * bezeichnet („die Utterance-Events feuern unzuverlässig", siehe
   * `speakingCapAt`). Der Wächter `typing-voice-drossel` hat es prompt
   * vorgeführt: Eine VOLLSTÄNDIG gesprochene Ansage wurde 300 ms später ein
   * zweites Mal gesagt, weil kein `start` gemeldet worden war. Eine doppelte
   * Ansage ist für ein Kind nicht besser als eine fehlende.
   *
   * Genommen wird darum dasselbe Signal, mit dem der Stall-Wächter arbeitet:
   * `lastSpokeAt`. Der 120-ms-Ticker setzt ihn, sobald er die Engine
   * TATSÄCHLICH sprechen sieht. Wurde seit dem Absetzen gesprochen, war nichts
   * verschluckt - egal, welche Events gefeuert haben.
   */
  const abgesetztAt = Date.now();
  /*
   * ★★★★★ VIER UNABHÄNGIGE ZEUGEN DAFÜR, DASS GESPROCHEN WURDE.
   *
   * Jeder einzelne genügt - und keiner allein ist verlässlich:
   *
   *   1. `start` gefeuert          - der direkte Weg, aber laut dieser Datei
   *                                  selbst unzuverlässig (`speakingCapAt`)
   *   2. `end` gefeuert            - wer geendet hat, hat gesprochen
   *   3. `lastSpokeAt`             - der 120-ms-Ticker hat die Engine sprechen
   *                                  GESEHEN (dasselbe Signal wie der Stall-Wächter)
   *   4. `speaking` beim Nachsehen - sie spricht in diesem Augenblick
   *
   * ⚠️ Warum vier und nicht einer: Der Wächter `typing-voice-drossel` hat mit
   * jedem einzelnen eine doppelte Ansage erzeugt - einmal, weil das Fake-
   * Utterance kein `addEventListener` hat, einmal, weil der Ticker nach einem
   * Timer-Wechsel nie wieder startet. **Eine doppelte Ansage ist für ein Kind
   * nicht besser als eine fehlende**; die Beweislast liegt darum beim
   * Nachfassen, nicht beim Schweigen.
   */
  let gesprochen = false;
  const bezeugen = () => {
    gesprochen = true;
  };
  if (typeof u.addEventListener === "function") {
    u.addEventListener("start", bezeugen);
    u.addEventListener("end", bezeugen);
  }
  const vorherigesOnend = u.onend;
  u.onend = (ev) => {
    bezeugen();
    vorherigesOnend?.call(u, ev as SpeechSynthesisEvent);
  };
  s.speak(u);
  noteEngineSubmit(u.text.length);
  startSpeakTicker(); // Sprechzeit messen (faire Anschlagfrequenz)
  watchEngineStart(); // Hänger-Wächter (alle Plattformen)

  if (zweiterVersuch) return;
  /*
   * ★★★★★ NUR NACH EINEM ABBRUCH - genau der gemessene Fall.
   *
   * Die erste Fassung fasste bei JEDEM Fehlstart nach. Zwei Wächter haben das
   * zu Recht abgelehnt (`typing-voice-drossel`: „nur die jüngste überlebt" und
   * „deckelt die Reihe"): Eine Engine, die aus anderen Gründen still bleibt,
   * bekäme jede Ansage zweimal - und für die stillen Engines gibt es schon den
   * Stall-Wächter, der nach drei Hängern das Vorlesen sichtbar abschaltet.
   *
   * Gemessen am iPad war der Abbruch die EINZIGE Quelle: 7 von 31 Ansagen nach
   * einem `cancel()` begannen nie, 0 von 9 ohne. Genau darauf ist das
   * Nachfassen jetzt zugeschnitten.
   */
  if (Date.now() - letzterAbbruchAt > NACHFASSEN_MS * 2) return;
  setTimeout(() => {
    if (engineHalted || gesprochen) return;
    if (lastSpokeAt >= abgesetztAt) return; // der Ticker hat sie sprechen gesehen
    // Inzwischen etwas Neueres abgesetzt? Dann ist diese Ansage veraltet.
    if (juengsterAuftrag !== u) return;
    // Spricht die Engine gerade etwas ANDERES, war der Auftrag nicht
    // verschluckt, sondern steht in ihrer eigenen Reihe - dann nicht dazwischen.
    try {
      if (s.speaking || s.pending) return;
    } catch {
      return;
    }
    // Verschluckt. Dieselben Worte, dieselbe Stimme, ein zweites Mal.
    try {
      const zwei = new SpeechSynthesisUtterance(u.text);
      zwei.rate = u.rate;
      zwei.pitch = u.pitch;
      zwei.volume = u.volume;
      if (u.voice) zwei.voice = u.voice;
      zwei.lang = u.lang;
      submitUtterance(s, zwei, true);
    } catch {
      /* Sprachausgabe nicht verfügbar — unkritisch */
    }
  }, NACHFASSEN_MS);
}

// --- Freischaltung + Weckruf (gegen die Browser-Sperren) ---------------------

let primed = false;
let keepAlive: ReturnType<typeof setInterval> | null = null;

/**
 * Desktop-Chromium (Chrome/Brave/Edge auf Windows/macOS)? Nur dort läuft der
 * resume()-Weckruf gegen den alten Chrome-Bug „NETZWERK-Stimme schläft nach
 * ~15 s ein" (crbug 41294170 — lokale Systemstimmen sind nicht betroffen).
 * iOS-Browser tragen „CriOS"/kein „Chrome/" im userAgent und fallen sauber raus.
 */
function isDesktopChromium(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    /Chrome\//.test(ua) &&
    !/Android|iPhone|iPad|iPod/.test(ua) &&
    !isLinuxChromium()
  );
}

function startKeepAlive(): void {
  if (keepAlive !== null) return;
  // Der frühere pause()+resume()-Weckruf lief überall außer Linux — pause()
  // verklemmt aber auch die Engines von iOS/Android (dort ist pause faktisch
  // ein Stop) und stand beim Mac/iOS-Einfrieren mit im Verdacht. Jetzt: NUR
  // Desktop-Chromium, NUR resume() (ohne pause ein No-op, solange nichts
  // pausiert ist — weckt aber die nach ~15 s eingeschlafene Netzwerk-Stimme).
  if (!isDesktopChromium()) return;
  keepAlive = setInterval(() => {
    const s = synth();
    if (!s) return;
    try {
      if (s.speaking) s.resume();
    } catch {
      /* ignore */
    }
  }, 10000);
}

function stopKeepAlive(): void {
  if (keepAlive !== null) {
    clearInterval(keepAlive);
    keepAlive = null;
  }
}

/**
 * Schaltet die Sprachausgabe frei. MUSS aus einer echten Nutzer-Geste (Klick/
 * Tastendruck auf einen Schalter) heraus aufgerufen werden — dann darf der
 * Browser eine (hier lautlose) Probe-Ansage starten, und ab da funktionieren
 * auch die späteren, automatisch ausgelösten Ansagen.
 */
export function primeSpeech(): void {
  const s = synth();
  if (!s) return;
  // Bewusste Nutzer-Geste: einer still­gelegten Engine (Hänger-Wächter) eine
  // neue Chance geben — vielleicht hat sie sich inzwischen gefangen.
  engineHalted = false;
  stallCount = 0;
  speakingCapAt = 0;
  startKeepAlive();
  try {
    if (!isLinuxChromium() && s.paused) s.resume();
    // Stimmenliste anstoßen (manche Browser laden sie erst bei getVoices()).
    void s.getVoices();
    if (!primed) {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0; // lautlos — schaltet nur frei
      u.rate = 1;
      holdUtterance(u);
      s.speak(u);
      primed = true;
    }
  } catch {
    /* ignore */
  }
}

export function cancelSpeech(): void {
  clearPendingSpeech(); // auch einen noch wartenden (gedrosselten) Auftrag verwerfen
  resetSpeechQueue(); // und die FIFO-Warteschlange (speakQueued) leeren
  speakingCapAt = 0; // kein Text mehr eingereicht → kein Sprech-Deckel offen
  const s = synth();
  if (s) cancelIfBusy(s); // cancel nur, wenn wirklich etwas spricht/ansteht
  // Nach dem Abbruch ist nichts mehr zu sprechen → den nächsten Tick die
  // Messung sauber abschließen lassen (der Ticker legt sich dann selbst schlafen).
}

// Hintergrund-Wechsel: Wird die Seite MITTEN im Sprechen unsichtbar (Tab-/App-
// Wechsel, iPad-Sperre), verklemmt sich die iOS/WebKit-Sprachausgabe dauerhaft
// (dokumentiert: „stumm bis zum Neuladen"). Darum beim Verstecken sauber
// abbrechen; beim Zurückkommen Hänger-Zähler und eine hängende Pause lösen.
if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      cancelSpeech();
      return;
    }
    stallCount = 0;
    speakingCapAt = 0;
    const s = synth();
    try {
      if (s && !isLinuxChromium() && s.paused) s.resume();
    } catch {
      /* ignore */
    }
  });
  window.addEventListener("pagehide", () => cancelSpeech());
}

/**
 * ★★★★★ DIE STIMMENLISTE FRÜH ANSTOSSEN (20.09.2026, Punkt 11 aus Testerin
 * Durchgang: *„die Sprachausgabe wechselte einmal nach Englisch … War nur an
 * einer Stelle und dann ging es auch deutsch weiter."*).
 *
 * ── DIE HYPOTHESE, AM CODE GEPRÜFT (nicht geraten) ──────────────────────────
 * `stimmeFuer` (oben) gibt `null` zurück, „noch nicht geladen → nächster
 * Versuch" - wörtlich der Kommentar dort. Browser laden `getVoices()`
 * ASYNCHRON nach; ist die Liste beim ALLERERSTEN Sprechversuch einer Sitzung
 * noch leer, setzt jeder Aufrufer (`speak`, `speakSequence`, `speakUiAlways`,
 * `speakFishVoice`, `speakMonsterVoice`, `pumpQueue`) nur `u.lang` - WELCHE
 * Stimme die Engine dafür nimmt, entscheidet sie selbst. Auf einem System mit
 * englischer Standardstimme ist das genau der einmalige Ausrutscher, den
 * Johannes gehört hat: Bestätigt, weil `stimmeFuer` `s.getVoices()` bei JEDER
 * Ansage FRISCH abfragt (kein Cache) - sobald der Browser die Liste einmal
 * gefüllt hat, trifft jede SPÄTERE Ansage die richtige Stimme von selbst
 * („nur an einer Stelle, dann ging es wieder deutsch weiter" passt exakt).
 *
 * ── WARUM DIE NAHELIEGENDE BEHEBUNG HIER FALSCH WÄRE ────────────────────────
 * Die Ansage selbst auf `voiceschanged` warten zu lassen, bevor sie spricht,
 * würde JEDEN Aufruf von `speak`/`speakSequence` verzögern, auch wenn die
 * Liste dauerhaft leer bleibt (kein Sprachausgabe-Motor installiert) - und
 * genau DAGEGEN ist die „keine künstliche Latenz"-Garantie von `runSpeech`
 * gebaut (Befund F21, gepinnt in `tests/typing-voice-engine.test.ts` und
 * `tests/typing-voice-drossel.test.ts`: die Ansage der NÄCHSTEN TASTE darf
 * nicht auf irgendetwas warten). Ein Warten IM Sprechpfad hätte diese
 * Garantie gebrochen, um einen Ausrutscher zu beheben, den Johannes einmal
 * in mehreren Wochen gehört hat.
 *
 * ── DIE BEHEBUNG: FRÜHER ANSTOSSEN STATT SPÄTER WARTEN ──────────────────────
 * `s.getVoices()` fragt hier - beim IMPORT dieses Moduls, lange bevor ein
 * Kind die erste Taste drückt - schon einmal ab, statt es dem ersten
 * Sprechversuch zu überlassen. Ist die Liste dann schon da, ist nichts zu
 * tun. Ist sie leer, meldet ein einmaliger `voiceschanged`-Zuhörer nur, dass
 * es sich gelohnt hat nachzusehen (er tut sonst nichts - `stimmeFuer` fragt
 * ohnehin bei jeder Ansage neu ab, hier wird nichts zwischengespeichert).
 * Der GEWINN ist reine ZEIT: Zwischen App-Start und der ersten echten Ansage
 * liegen mindestens ein Render und eine Kind-Handlung - ein Zeitvorsprung,
 * den ein erst beim ersten Sprechversuch gestellter Aufruf nicht hätte.
 *
 * ⚠️ KEINE NOTBREMSE NÖTIG: Es wird nirgends gewartet, also kann auch nichts
 * hängen bleiben - bleibt die Liste dauerhaft leer, bleibt es wie bisher bei
 * `u.lang` allein (Punkt 5 der Reihenfolge in `stimmeFuer`), nur eben ohne
 * diesen frühen Versuch verschenkt zu haben.
 */
(function stimmenlisteFruehAnstossen(): void {
  const s = synth();
  if (!s) return;
  try {
    if (s.getVoices().length > 0) return; // schon da - nichts zu tun
    const einmalig = () => s.removeEventListener("voiceschanged", einmalig);
    s.addEventListener("voiceschanged", einmalig);
  } catch {
    /* Sprachausgabe nicht verfügbar - unkritisch */
  }
})();

/*
 * ★★★★★ STRG MACHT SOFORT STILL - an JEDER Stelle (Johannes, 04.09.2026:
 * „egal an welcher Stelle gelesen wird, mit Strg muss es sofort leise werden").
 *
 * Der Zuhörer sitzt HIER am Motor und nicht in einer Ansicht: Jede Oberfläche,
 * die spricht, geht durch diese Datei - einer je Bildschirm wäre die Doppelung,
 * bei der ausgerechnet der vergessene Bildschirm der ist, auf dem das Kind
 * sitzt. Die REGEL selbst (AltGr-Ausnahme, gehaltene Taste, Capture) steht
 * einmal für alle drei Vorlese-Motoren in `lib/stummTaste.ts` - dort steht
 * auch, warum.
 */
installStummTaste(cancelSpeech);

/** Spricht den Text — nur wenn Self-Voicing aktiv ist. Bricht Laufendes ab. */
export function speak(text: string): void {
  const { enabled, rate } = useVoice.getState();
  if (!enabled || !text) return;
  const s = synth();
  if (!s) return;
  runSpeech(() => {
    try {
      // Falls (z. B. nach längerer Sitzung / Tab-Wechsel) eingefroren: aufwecken.
      // Auf Linux NICHT — pause()/resume() kann dort die Engine zerschießen.
      if (!isLinuxChromium() && s.paused) s.resume();
      const didCancel = cancelIfBusy(s);
      speakAfterCancel(didCancel, () => {
        try {
          const u = new SpeechSynthesisUtterance(fuerSprachausgabe(text));
          u.volume = sprechLautstaerke();
          u.rate = rate;
          const sprache = vorleseSprache();
          const v = stimmeFuer(s, sprache);
          if (v) {
            u.voice = v;
            u.lang = v.lang; // Aussprache folgt der gewählten Stimme
          } else {
            u.lang = sprachTagFuer(sprache);
          }
          submitUtterance(s, u);
        } catch {
          /* Sprachausgabe nicht verfügbar — unkritisch */
        }
      });
    } catch {
      /* Sprachausgabe nicht verfügbar — unkritisch */
    }
  });
}

/**
 * Spricht mehrere Teile NACHEINANDER (in die Warteschlange gestellt) — anders als
 * {@link speak}, das Laufendes abbricht. Gebraucht am Zeilenanfang, damit „erst
 * der ganze Satz, dann das erste Wort" hörbar hintereinander kommt, statt dass das
 * Wort den Satz sofort abschneidet. Nur wenn Self-Voicing aktiv ist.
 */
/**
 * ★★★★★ EIN PUNKT HINTER EINER ZAHL WIRD ZUR ORDNUNGSZAHL (04.09.2026).
 *
 * Testerin am 03.09.2026: *„Beim Zahlendiktat Zahlwort 73. wird der Satzpunkt als
 * Ordnungszahl gelesen, also 73-ter gesagt. Das ist auch bei den ganzen
 * Meldungen Satz 1 von 10(-ter) so, weil danach auch ein Punkt kommt."*
 *
 * Sie hat recht, und es ist keine Eigenheit einer Stimme: Im Deutschen IST
 * „73." die Ordnungszahl. Jede Sprachausgabe liest das so - richtig gelesen,
 * falsch gemeint. Ein Kind, das das Zahlwort zu 73 schreiben soll, hört
 * „dreiundsiebzigster".
 *
 * ── WARUM DIE BEHEBUNG HIER STEHT UND NICHT AN DEN FUNDSTELLEN ────────────
 *
 * Testerin sagt ausdrücklich „bei den ganzen Meldungen". Es ist keine Stelle,
 * sondern eine Form: überall, wo eine Zahl am Satzende steht. An zehn
 * Fundstellen zu flicken hiesse, die elfte zu übersehen - und die schreibt
 * morgen jemand.
 *
 * ── ⚠️ WARUM NUR AM SATZENDE ──────────────────────────────────────────────
 *
 * Ein Punkt hinter einer Zahl ist nicht immer ein Versehen: „am 3. Oktober",
 * „1. Etappe" - dort IST die Ordnungszahl gemeint, und ein pauschaler Sweep
 * hätte sie zerstört. Vor dem Einbau nachgesehen: In den gesprochenen Texten
 * gibt es derzeit **weder ein Datum noch eine gewollte Ordnungszahl**
 * (gemessen 04.09.2026). Trotzdem greift die Regel bewusst NUR am Satzende -
 * dort ist der Punkt reine Zeichensetzung und für die Ansage entbehrlich,
 * mitten im Satz bleibt er unangetastet.
 * Dieselbe Frage wie bei jedem Zeichen-Sweep: Ist das Zeichen hier
 * GEGENSTAND? Am Satzende nicht, mitten im Satz sehr wohl.
 *
 * Der sichtbare Text bleibt unberührt - geändert wird nur, was gesprochen wird.
 */
export function fuerSprachausgabe(text: string): string {
  // Punkt am Ende, unmittelbar hinter einer Ziffer → weg. Nachlaufende
  // Leerzeichen zählen als Ende (\s*$), mehrere Punkte („73..") ebenso.
  return text.replace(/(\d)\.+(\s*)$/, "$1$2");
}

export function speakSequence(parts: readonly string[], art: Ansageart = "ersetzbar"): void {
  const { enabled, rate } = useVoice.getState();
  if (!enabled) return;
  const texts = parts.filter((t) => t && t.trim().length > 0);
  if (!texts.length) return;
  const s = synth();
  if (!s) return;
  runSpeech(() => {
    try {
      if (!isLinuxChromium() && s.paused) s.resume();
      const didCancel = cancelIfBusy(s); // alte Reste verwerfen, dann frisch in Reihe
      speakAfterCancel(didCancel, () => {
        try {
          const sprache = vorleseSprache();
          const v = stimmeFuer(s, sprache);
          // Als EINE Utterance (durch Satzpunkte getrennt) — früher nur auf
          // Linux, jetzt überall: Die Mehrfach-Warteschlange ist auf allen
          // Engines fragiler als ein einzelner Auftrag (WebKit/iOS verschluckt
          // nach einem cancel sogar die eingereihten Utterances) und klingt
          // praktisch gleich.
          const u = new SpeechSynthesisUtterance(fuerSprachausgabe(texts.join(". ")));
          u.volume = sprechLautstaerke();
          u.rate = rate;
          if (v) {
            u.voice = v;
            u.lang = v.lang;
          } else {
            u.lang = sprachTagFuer(sprache);
          }
          submitUtterance(s, u);
        } catch {
          /* Sprachausgabe nicht verfügbar — unkritisch */
        }
      });
    } catch {
      /* Sprachausgabe nicht verfügbar — unkritisch */
    }
  }, art);
}


/**
 * Spricht eine ANSAGE der App — mit einer Stimme in der VORLESE-SPRACHE,
 * unabhängig davon, welche Stimme im Pulldown steht. Gebraucht für alle
 * Rückmeldungen: Sterne-Ansage, Fortschritt, Übezeit, Fingerhilfe,
 * Fehler-Meldung.
 *
 * ★ 29.08.2026 (Rückmeldung Jens): Bis dahin nahm diese Funktion IMMER eine
 * deutsche Stimme. Das war richtig, solange die App nur deutsch sprach - die
 * Ansage klang auch bei englischem Inhalt sauber. Seit die ganze Vorlese-Schicht
 * zweisprachig ist (Entscheidung Johannes), muss die Stimme der Sprache des
 * SATZES folgen: ein englischer Ansage-Satz mit deutscher Stimme wäre genau der
 * Fehler, den wir gerade abstellen, nur seitenverkehrt.
 *
 * ⚠️ Der Text muss also zur Vorlese-Sprache passen. Wer deutschen INHALT
 * spricht (die Polar-Expedition erzählt deutsch), nimmt {@link speakUiDe}.
 */
export function speakUi(
  text: string,
  pitch?: number,
  art?: Ansageart,
  /**
   * ★ Probestück „englische Bedienung" (12.09.2026): Eine Ansage der BEDIENUNG
   * (Sprachschalter, Farbwahl) ist in der Bedienungssprache geschrieben und
   * braucht deren Stimme - sonst läse eine deutsche Stimme „Yellow on blue".
   * Ohne Angabe bleibt es bei der Vorlese-Sprache, also bei allen bisherigen
   * Aufrufern unverändert.
   */
  lang?: Lang,
): void {
  if (!useVoice.getState().enabled) return;
  speakUiAlways(text, pitch, lang ?? vorleseSprache(), art);
}

/**
 * ★★★★★ ERST SPRECHEN, WENN DIE LAUFENDE ANSAGE AUSGEREDET HAT (04.09.2026).
 *
 * Testerin am 03.09.2026: *„beim Eisschollenspiel wird die letzte Ansage
 * abgewürgt, das wirkt merkwürdig."*
 *
 * ── WAS DA PASSIERT IST ───────────────────────────────────────────────────
 *
 * Am Ende der Reise treffen zwei Ansagen zusammen: der Schluss-Jubel
 * („Zuhause am Iglu - die ganze Reise ohne einen einzigen Fehler. Sehen Sie:
 * das Polarlicht tanzt." - rund fünf Sekunden) und die Abzeichen-Ansage, die
 * `FloeFreePlay` **1200 ms später** absetzte. Die 1200 ms waren als „kurz nach
 * dem Finale-Jubel" gedacht - sie sind aber kürzer als der Jubel selbst, und
 * jede Ansage bricht die laufende ab (`cancelIfBusy`). Das Kind hörte den
 * ersten Satz und mitten im zweiten das Abzeichen.
 *
 * ── WARUM NICHT DIE ANSAGE-KLASSE GEÄNDERT WURDE ──────────────────────────
 *
 * Der erste Versuch war, `"ereignis"` generell warten zu lassen. Der Wächter
 * `typing-voice-drossel` hat das zu Recht abgelehnt: F21 heisst „ein Ereignis
 * darf nicht VERSCHWINDEN", nicht „darf nicht unterbrechen". Es ist Absicht,
 * dass „Mein Training." eine laufende Belohnungsansage abschneidet - dort ist
 * die neue Nachricht die wichtigere.
 *
 * Hier ist es umgekehrt: Das Abzeichen ist eine ZUGABE zum Jubel, keine
 * Ablösung. Das weiss nur der Aufrufer - darum steht die Entscheidung bei ihm.
 *
 * ⚠️ Mit Deckel: Nach `WARTE_HOECHST_MS` wird gesprochen, komme was will. Eine
 * verklemmte Engine (`speaking` bleibt hängen - der bekannte Chromium-Wedge)
 * darf eine Ansage nicht für immer verschlucken.
 */
const WARTE_POLL_MS = 150;
const WARTE_HOECHST_MS = 12_000;

export function speakUiNachLaufender(
  text: string,
  pitch?: number,
  /**
   * ★ EN3 (19.09.2026): die Sprache der Stimme für eine Ansage der BEDIENUNG
   * (Abzeichen-Namen in der englischen Bedienung) - wie `speakUi`s viertes
   * Argument. Ohne Angabe unverändert die Vorlese-Sprache.
   */
  lang?: Lang,
): void {
  if (!useVoice.getState().enabled || !text) return;
  const s = synth();
  if (!s) return;
  const start = Date.now();
  const sieheNach = () => {
    let spricht = false;
    try {
      spricht = s.speaking || s.pending;
    } catch {
      spricht = false;
    }
    if (!spricht || Date.now() - start >= WARTE_HOECHST_MS) {
      if (lang) speakUi(text, pitch, undefined, lang);
      else speakUi(text, pitch);
      return;
    }
    setTimeout(sieheNach, WARTE_POLL_MS);
  };
  sieheNach();
}

/**
 * Wie {@link speakUi}, aber fest auf DEUTSCH — für deutschsprachigen INHALT, der
 * nicht mit übersetzt wird: die Erzählung der Polar-Expedition. Sie ist Inhalt,
 * kein Etikett; sie mit englischer Stimme zu sprechen wäre derselbe Fehler wie
 * „Pankt".
 */
export function speakUiDe(text: string, pitch?: number): void {
  if (!useVoice.getState().enabled) return;
  speakUiAlways(text, pitch, "de");
}

/**
 * Wie speakUi, aber OHNE An/Aus-Prüfung — einzig für die Abschalt-Ansage
 * („Vorlesen aus."): sie muss noch hörbar sein, obwohl der Schalter in dem
 * Moment schon aus ist. Für alles andere speakUi verwenden.
 */
export function speakUiAlways(
  text: string,
  pitch?: number,
  lang: Lang = vorleseSprache(),
  /**
   * ★★★★★ WIE SICH DIESE ANSAGE EINREIHT (04.09.2026).
   *
   * Vorgabe bleibt `"ereignis"`: Was geschehen ist, darf nicht verdrängt
   * werden (F21) - eine Medaille, ein Geschichtentitel, „Vorlesen aus.".
   *
   * `"sofort"` ist für Ansagen, die zum ANSCHLAG gehören und eine
   * Zehntelsekunde später veraltet sind - die Korrektur nach einem Fehlgriff
   * genauso wie die Ansage der nächsten Taste. Am iPad gemessen (04.09.):
   * Eine „ereignis"-Ansage reiht sich HINTER der laufenden ein und wartet auf
   * das Ruhefenster; drei Werte lagen bei 736, 815 und 816 ms.
   */
  art: Ansageart = "ereignis",
): void {
  const { rate } = useVoice.getState();
  if (!text) return;
  const s = synth();
  if (!s) return;
  runSpeech(() => {
    try {
      if (!isLinuxChromium() && s.paused) s.resume();
      const didCancel = cancelIfBusy(s);
      speakAfterCancel(didCancel, () => {
        try {
          const u = new SpeechSynthesisUtterance(fuerSprachausgabe(text));
          u.volume = sprechLautstaerke();
          u.rate = rate;
          if (pitch !== undefined) u.pitch = Math.max(0, Math.min(2, pitch));
          const v = stimmeFuer(s, lang);
          if (v) {
            u.voice = v;
            u.lang = v.lang;
          } else {
            u.lang = sprachTagFuer(lang);
          }
          submitUtterance(s, u);
        } catch {
          /* Sprachausgabe nicht verfügbar — unkritisch */
        }
      });
    } catch {
      /* Sprachausgabe nicht verfügbar — unkritisch */
    }
  }, art);
}

/**
 * Wie {@link speakUi}, aber mit einer VIEL HÖHEREN, quietschigen „Fisch-Stimme"
 * (Bauplan §4.1, Johannes 13.07.: der Fisch muss beim Sprechen klar anders klingen).
 * Höchste Tonhöhe (`pitch = 2`) + etwas flotter — deutsche UI-Stimme wie speakUi.
 * Respektiert den Vorlesen-Schalter; bei „aus" trägt die Live-Region den Text.
 */
export function speakFishVoice(
  text: string,
  /**
   * ★ EN3 (19.09.2026): Die Expedition erzählt in der BEDIENUNGSSPRACHE
   * (Glossar §4/§6 Nr. 5, entschieden in EN3) - in der englischen Bedienung
   * quietscht der Fisch darum englisch. Ohne Angabe deutsch wie bisher.
   */
  lang: Lang = "de",
): void {
  if (!useVoice.getState().enabled || !text) return;
  const { rate } = useVoice.getState();
  const s = synth();
  if (!s) return;
  runSpeech(() => {
    try {
      if (!isLinuxChromium() && s.paused) s.resume();
      const didCancel = cancelIfBusy(s);
      speakAfterCancel(didCancel, () => {
        try {
          const u = new SpeechSynthesisUtterance(fuerSprachausgabe(text));
          u.volume = sprechLautstaerke();
          u.rate = Math.min(2, rate * 1.1);
          u.pitch = 2; // Maximum — „viel viel höher" als die normale Stimme
          const voices = s.getVoices();
          // ★ E11a-5 (26.09.2026): die Sprache selbst als Präfix - bis dahin
          // quietschte der Fisch in der französischen Bedienung mit einer
          // DEUTSCHEN Stimme (die Zeile prüfte nur „en", Falle 30).
          const praefix = lang;
          const deAll = voices.filter((v) => v.lang.toLowerCase().startsWith(praefix));
          let v: SpeechSynthesisVoice | null = null;
          if (deAll.length) {
            const normal = deAll.filter((dv) => !NOVELTY_VOICE.test(dv.name.trim()));
            v = (normal.find((dv) => dv.default) ?? normal[0] ?? deAll[0]) ?? null;
          }
          if (v) {
            u.voice = v;
            u.lang = v.lang;
          } else {
            u.lang = lang === "de" ? "de-DE" : sprachTagFuer(lang);
          }
          submitUtterance(s, u);
        } catch {
          /* Sprachausgabe nicht verfügbar — unkritisch */
        }
      });
    } catch {
      /* Sprachausgabe nicht verfügbar — unkritisch */
    }
  });
}


/**
 * Stimme + Sprache einer Utterance für eine beliebige Sprache (EN3, 19.09.2026) -
 * dieselbe Auflösung wie {@link applyGermanVoice}, nur mit der Sprache als Wert.
 */
function applyVoiceFor(u: SpeechSynthesisUtterance, s: SpeechSynthesis, lang: Lang): void {
  const v = stimmeFuer(s, lang);
  if (v) {
    u.voice = v;
    u.lang = v.lang;
  } else {
    u.lang = sprachTagFuer(lang);
  }
}

/** Stimme + Sprache einer Utterance setzen (deutsche UI-Stimme, sonst de-DE). */
function applyGermanVoice(u: SpeechSynthesisUtterance, s: SpeechSynthesis): void {
  const v = stimmeFuer(s, "de");
  if (v) {
    u.voice = v;
    u.lang = v.lang; // Aussprache folgt der gewählten Stimme
  } else {
    u.lang = "de-DE";
  }
}

/**
 * Spricht das Höhlenwesen (Polar-Expedition §4.3) — TIEF und langsam, klar
 * abgesetzt von der Erzählerin und vom (hohen) Fisch: niedrigste Tonhöhe
 * (`pitch = 0.2`) und leicht gebremstes Tempo (×0.85). Deutsche UI-Stimme wie
 * {@link speakUiAlways}.
 *
 * BEWUSST OHNE An/Aus-Prüfung (wie speakUiAlways): In der Echo-Höhle ist die
 * Monster-Ansage der EINZIGE Träger der Information „welche Taste" (Blindschreiben,
 * kein Glyph im DOM). Sie muss auch bei ausgeschaltetem Vorlesen hörbar sein — das
 * war schon vor dieser Stimme so (dort sprach speakUiAlways), nur klang das Monster
 * dabei exakt wie die Erzählerin (Johannes 14.07.).
 */
export function speakMonsterVoice(text: string): void {
  if (!text) return;
  const { rate } = useVoice.getState();
  const s = synth();
  if (!s) return;
  runSpeech(() => {
    try {
      if (!isLinuxChromium() && s.paused) s.resume();
      const didCancel = cancelIfBusy(s);
      speakAfterCancel(didCancel, () => {
        try {
          const u = new SpeechSynthesisUtterance(fuerSprachausgabe(text));
          u.volume = sprechLautstaerke();
          u.rate = Math.max(0.1, Math.min(2, rate * 0.85)); // schwerfällig, aber verständlich
          u.pitch = 0.2; // fast das Minimum — dunkles Höhlenwesen
          applyGermanVoice(u, s);
          submitUtterance(s, u);
        } catch {
          /* Sprachausgabe nicht verfügbar — unkritisch */
        }
      });
    } catch {
      /* Sprachausgabe nicht verfügbar — unkritisch */
    }
  });
}

// --- Warteschlange: Ansagen zu Ende sprechen lassen (speakQueued) --------------
//
// Problem (Johannes 14.07.): Bei hohem Sprechtempo/schneller Spielabfolge wurden
// Textzeilen „geköpft" — jede Ansage rief `cancelIfBusy()` auf die noch laufende,
// und die Drossel `runSpeech` verwarf ältere Aufträge (nur der jüngste überlebt).
//
// `speakQueued` bricht NICHTS ab: Die laufende Ansage darf zu Ende sprechen, der
// neue Text reiht sich dahinter ein (FIFO). Damit die Reihe bei einem Ansage-Sturm
// nicht endlos anwächst (das Kind hörte sonst minutenlang alte Sätze), warten
// höchstens {@link QUEUE_MAX_WAITING} Aufträge; kommt ein weiterer, fällt der
// ÄLTESTE WARTENDE heraus — der gerade LAUFENDE nie.
//
// Fertig-Erkennung: primär `onend`/`onerror` der Utterance, zusätzlich ein
// Wächter-Ticker (die Events feuern in manchen Browsern unzuverlässig — dieselbe
// Erfahrung wie bei der Lesezeit-Messung oben, die deshalb `speaking` pollt).
// Bleibt die Engine stumm (kein Sprechbeginn) oder hängt sie, rückt die Reihe
// nach spätestens QUEUE_NO_SPEECH_MS bzw. QUEUE_CAP_MS weiter, statt zu verklemmen.

const QUEUE_MAX_WAITING = 2; // wartende Aufträge (der laufende zählt nicht mit)
const QUEUE_POLL_MS = 120;
const QUEUE_NO_SPEECH_MS = 2500; // Engine hat NIE zu sprechen begonnen → weiterrücken
const QUEUE_CAP_MS = 60000; // Notbremse gegen ein hängendes `speaking`

let speechQueue: { text: string; lang: Lang }[] = []; // die WARTENDEN Texte (samt Stimme, EN3)
let queueSpeaking = false; // ein Auftrag ist an die Engine übergeben
let queueStartedAt = 0;
let queueSawSpeech = false;
let queueWatch: ReturnType<typeof setInterval> | null = null;

function stopQueueWatch(): void {
  if (queueWatch !== null) {
    clearInterval(queueWatch);
    queueWatch = null;
  }
}

/** Warteschlange verwerfen (ohne die Engine anzufassen) — für cancelSpeech/Stall. */
function resetSpeechQueue(): void {
  speechQueue = [];
  queueSpeaking = false;
  queueSawSpeech = false;
  stopQueueWatch();
}

/** Laufenden Auftrag als erledigt verbuchen und den nächsten starten. */
function finishQueued(): void {
  if (!queueSpeaking) return;
  queueSpeaking = false;
  queueSawSpeech = false;
  stopQueueWatch();
  pumpQueue();
}

/** Wächter: erkennt das Ende auch ohne `onend` und löst Hänger auf. */
function startQueueWatch(): void {
  stopQueueWatch();
  queueStartedAt = Date.now();
  queueSawSpeech = false;
  queueWatch = setInterval(() => {
    if (!queueSpeaking) return void stopQueueWatch();
    const s = synth();
    if (!s) return void finishQueued();
    const elapsed = Date.now() - queueStartedAt;
    if (s.speaking || s.pending) {
      queueSawSpeech = true;
      if (elapsed >= QUEUE_CAP_MS) finishQueued(); // hängendes `speaking` → weiter
      return;
    }
    // Nichts (mehr) in der Engine: entweder fertig gesprochen …
    if (queueSawSpeech) return void finishQueued();
    // … oder sie hat nie begonnen (Fehlstart / stumm) → nach der Karenz weiterrücken.
    if (elapsed >= QUEUE_NO_SPEECH_MS) finishQueued();
  }, QUEUE_POLL_MS);
}

/** Den nächsten wartenden Text an die Engine geben (falls gerade nichts von uns läuft). */
function pumpQueue(): void {
  if (queueSpeaking) return;
  const auftrag = speechQueue.shift();
  if (auftrag === undefined) return;
  const { text, lang } = auftrag;
  const s = synth();
  if (!s || engineHalted) {
    resetSpeechQueue();
    return;
  }
  const { rate } = useVoice.getState();
  queueSpeaking = true;
  // Wächter schon JETZT starten: Die Drossel (runSpeech) kann den Auftrag
  // verzögern. VERWERFEN kann sie ihn seit dem 31.08.2026 nicht mehr — er geht
  // als "ereignis" in die Reihe (F21); bis dahin nahm ihm jede dazwischenkommende
  // Ansage den einen Warteplatz weg und die Reihe blieb stehen. Der Wächter
  // bleibt trotzdem: Er fängt auch eine Engine ab, die gar nicht zu sprechen
  // beginnt.
  startQueueWatch();
  runSpeech(() => {
    try {
      if (!isLinuxChromium() && s.paused) s.resume();
      const u = new SpeechSynthesisUtterance(fuerSprachausgabe(text));
      u.volume = sprechLautstaerke();
      u.rate = rate;
      if (lang === "de") applyGermanVoice(u, s);
      else applyVoiceFor(u, s, lang);
      u.onend = () => finishQueued();
      u.onerror = () => finishQueued();
      // KEIN cancelIfBusy: Läuft noch eine Ansage, hängt sich diese hier in der
      // Engine dahinter — genau das ist der Sinn der Warteschlange.
      submitUtterance(s, u);
      startQueueWatch();
    } catch {
      finishQueued(); // Sprachausgabe nicht verfügbar → Reihe nicht verklemmen
    }
  }, "ereignis"); // F21: sonst verwirft die Drossel den Auftrag und die Reihe steht
}

/**
 * Spricht UI-Text mit der deutschen Stimme — wie {@link speakUi}, aber OHNE die
 * laufende Ansage abzuschneiden: Der Text stellt sich hinten an (FIFO). Für
 * Spiel-Ansagen, die zu Ende gesprochen werden müssen (Polar-Expedition).
 * Höchstens {@link QUEUE_MAX_WAITING} Aufträge warten; ein weiterer verdrängt den
 * ältesten WARTENDEN (nie den laufenden). Respektiert den Vorlesen-Schalter.
 */
export function speakQueued(
  text: string,
  /**
   * ★ EN3 (19.09.2026): Die Expedition erzählt in der BEDIENUNGSSPRACHE - in der
   * englischen Bedienung mit englischer Stimme. Ohne Angabe deutsch wie bisher.
   */
  lang: Lang = "de",
): void {
  const { enabled } = useVoice.getState();
  if (!enabled || !text || !text.trim()) return;
  if (engineHalted) return; // Engine verklemmt (Stall-Wächter) → nichts absetzen
  if (!synth()) return;
  speechQueue.push({ text, lang });
  while (speechQueue.length > QUEUE_MAX_WAITING) speechQueue.shift(); // ältester wartender fliegt
  pumpQueue();
}

/** Warteschlange leeren und die Ausgabe stoppen (Zonenwechsel, Bühne schließen). */
export function cancelQueued(): void {
  resetSpeechQueue();
  clearPendingSpeech(); // einen noch gedrosselten Auftrag gar nicht erst absetzen
  const s = synth();
  if (s) cancelIfBusy(s);
}

/** Wartende Ansagen (ohne die laufende) — nur für Tests/Diagnose. */
export function queuedCount(): number {
  return speechQueue.length;
}

/**
 * Höhere Stimmlage für einen echten Großbuchstaben — wie es JAWS macht (Wunsch
 * aus Marburg, Testerin 28.08.2026).
 *
 * ⚠️ Das geht NUR bei einem ALLEIN gesprochenen Zeichen. {@link speakSequence}
 * fasst eine ganze Lese-Reihe bewusst zu EINER Äußerung zusammen (mehrere
 * Utterances in der Warteschlange sind auf WebKit/iOS unzuverlässig — nach einem
 * `cancel` verschluckt die Engine sie), und eine Äußerung hat genau eine
 * Tonhöhe. Innerhalb von „Saal: großes S, a, a, l" trägt deshalb das gesprochene
 * Wort „großes" die Information, nicht die Tonhöhe. Dazu kommt: Systemstimmen
 * setzen `pitch` unterschiedlich stark um - die Tonhöhe ist eine Zugabe, nie der
 * einzige Hinweis.
 */
export const GROSS_PITCH = 1.5;

/** Spricht den Namen eines einzelnen Zeichens („Komma", „großes A" / „comma", „capital A"). */
export function speakChar(
  ch: string,
  shiftLearned = true,
  lang: Lang = vorleseSprache(),
  /**
   * ★★★★ „sofort" für die KORREKTUR nach einem Fehlgriff (04.09.2026,
   * Johannes' Entscheidung d).
   *
   * Sie gehört zum Anschlag, genau wie die Ansage der nächsten Taste - und ist
   * eine Zehntelsekunde später veraltet. Als `"ereignis"` reihte sie sich
   * hinter der laufenden Ansage ein und wartete zusätzlich auf das
   * Ruhefenster.
   */
  art?: Ansageart,
): void {
  const gross = ch !== ch.toLowerCase() && ch === ch.toUpperCase();
  // Solange die Umschalttaste nicht gelernt ist, tippt das Kind die kleine
  // Taste — dann weder „großes …" sagen noch die Stimmlage heben.
  const echtGross = gross && shiftLearned;
  speakUi(spokenLabelFor(ch, shiftLearned, lang), echtGross ? GROSS_PITCH : undefined, art);
}

// --- Lese-Granularität: Wort-/Satz-Helfer (rein, testbar) --------------------

/** Beginnt an Stelle `i` ein neues Wort? (Zeilenanfang oder direkt nach Leerzeichen.) */
export function isWordStart(line: string, i: number): boolean {
  if (i <= 0) return true;
  return line[i - 1] === " ";
}

/** Das Wort, das an Stelle `i` beginnt (bis zum nächsten Leerzeichen). */
export function wordAt(line: string, i: number): string {
  let end = i;
  while (end < line.length && line[end] !== " ") end++;
  return line.slice(i, end);
}

/**
 * ★ ES-M2 (27.09.2026, Prüfbericht ES-P2 S2): Zeichen, die VOR einem Wort
 * stehen und nicht zu ihm gehören - der Wortanfang für das Vorlesen liegt
 * dahinter ({@link readPlanAt}).
 *
 * ★★★ Punkt 2 „vier Reste" (28.09.2026, Johannes: jede Behebung in ALLEN
 * Sprachwegen): gilt seither für JEDE Sprache - bis dahin nur für „es" (die
 * Liste hiess `ES_OEFFNEND`). Dazu die öffnenden Zeichen der anderen Sprachen:
 * „ ‚ (deutsch unten), » › (deutsch »so«), ‹. Die Prüfung sitzt am Wortanfang,
 * darum darf ein Zeichen in beiden Listen stehen („»" öffnet im Deutschen und
 * schliesst im Französischen).
 */
export const OEFFNEND_VOR_WORT: ReadonlySet<string> = new Set([
  "¿", "¡", '"', "(", "[", "{", "-", "*", "#", "'", "«", "“", "‘",
  "„", "‚", "»", "‹", "›",
  // „@Martina" im Chat - seit das Lexikon Vornamen kennt (27.09.), sonst buchstabiert.
  "@",
]);
/** … und die, die HINTER einem Wort stehen und beim Vorlesen des Wortes wegfallen. */
export const SCHLIESSEND_NACH_WORT: ReadonlySet<string> = new Set([
  ")", "]", "}", '"', "'", "»", "”", "’",
  // Deutsch schliesst mit “ ‘ und «, dazu ‹ ›.
  "“", "‘", "«", "‹", "›",
]);

/** Index des Wortanfangs, zu dem Position `i` gehört (0 oder nach Leerzeichen). */
export function wordStartIndex(line: string, i: number): number {
  let s = Math.min(Math.max(i, 0), line.length);
  while (s > 0 && line[s - 1] !== " ") s--;
  return s;
}

/**
 * ★★★ M2 (Mechanik-Prüfung fr, 26.09.2026 - Leitfaden Falle 7, zum dritten
 * Mal): Welche Zeichen sind in einer Sprache BUCHSTABEN (und Ziffern)? Bis
 * hierher kannte der Vorlese-Plan nur das Deutsche: ein „é" galt als
 * Satzzeichen - an „élèves", „été", „écrit" wurde nie das Wort gesprochen,
 * sondern nur „e accent aigu", und mitten im Wort wurde JEDER Akzentbuchstabe
 * benannt, auch mit ausgeschaltetem Buchstaben-Schalter. Deutsch/Englisch:
 * dieselben Muster wie vorher (Byte für Byte).
 */
// ★★★ ES-F8 (27.09.2026, Bauplan §4.4 Falle 4, Leitfaden Falle 7/43, Auftrag
// Punkt 5): „es" bekommt jetzt SEINE eigene Zeichen-Klasse, wie „fr" seit M2 -
// ñ ist ein BUCHSTABE (keine Sonderform), á é í ó ú ü ebenso. Vorher (ES-F2)
// stand hier bewusst „wie en", weil es noch keinen spanischen Inhalt gab, an
// dem sich der Fehler zeigen könnte (NACHTRAG_ES/isRealWord("es") gab es noch
// nicht) - das ist mit ES-F8 nachgeholt, siehe {@link isRealWord}.
const BUCHSTABE_ODER_ZIFFER: Record<Lang, RegExp> = {
  de: /[a-zA-Z0-9äöüÄÖÜß]/,
  en: /[a-zA-Z0-9äöüÄÖÜß]/,
  fr: /[a-zA-Z0-9àâäçéèêëîïôöùûüÿœæÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸŒÆ]/,
  es: /[a-zA-Z0-9ñáéíóúüÑÁÉÍÓÚÜ]/,
  // ★ G2b-1 (02.10.2026, Befund G1c §3 Nr. 4): it, pl, tr, cs - JEDER Buchstabe
  // (Unicode `\p{L}`) und jede Ziffer, keine Liste von Sonderbuchstaben. Vorher
  // (G2a, RÜCKFALL-EN) die englische Klasse: ein „ı", „ł" oder „č" wäre als
  // „Satzzeichen" mit Namen angesagt worden (Leitfaden Falle 7).
  it: /[\p{L}0-9]/u,
  pl: /[\p{L}0-9]/u,
  tr: /[\p{L}0-9]/u,
  cs: /[\p{L}0-9]/u,
  // ★ G2-NEUN (25.10.2026): wie it/pl/tr/cs - jeder Buchstabe (`\p{L}`) und jede Ziffer.
  bg: /[\p{L}0-9]/u,
  el: /[\p{L}0-9]/u,
  hu: /[\p{L}0-9]/u,
  nl: /[\p{L}0-9]/u,
  pt: /[\p{L}0-9]/u,
  br: /[\p{L}0-9]/u,
  ro: /[\p{L}0-9]/u,
  sv: /[\p{L}0-9]/u,
  uk: /[\p{L}0-9]/u,
};
const KEIN_BUCHSTABE: Record<Lang, RegExp> = {
  de: /[^a-zäöüß]/g,
  en: /[^a-zäöüß]/g,
  fr: /[^a-zàâäçéèêëîïôöùûüÿœæ]/g,
  es: /[^a-zñáéíóúü]/g,
  // ★ G2b-1: wie oben - jeder Buchstabe (`\p{L}`), nicht die englische Klasse.
  it: /[^\p{L}]/gu,
  pl: /[^\p{L}]/gu,
  tr: /[^\p{L}]/gu,
  cs: /[^\p{L}]/gu,
  // ★ G2-NEUN (25.10.2026): wie it/pl/tr/cs - jeder Buchstabe (`\p{L}`).
  bg: /[^\p{L}]/gu,
  el: /[^\p{L}]/gu,
  hu: /[^\p{L}]/gu,
  nl: /[^\p{L}]/gu,
  pt: /[^\p{L}]/gu,
  br: /[^\p{L}]/gu,
  ro: /[^\p{L}]/gu,
  sv: /[^\p{L}]/gu,
  // ★ G3a-SCHRIFT (25.10.2026): wie `normalizeWord` (lexicon.ts) - auch der Apostroph U+02BC (`Lm`) fällt weg, sonst
  // hätte „сімʼя" eine andere Form als „сім'я".
  uk: /[^\p{L}]|ʼ/gu,
};

/** Auf reine Buchstaben reduzieren — für die „echtes Wort?"-Prüfung. */
function letterCore(token: string, lang: Lang = "de"): string {
  // G2b-1: klein in der Sprache des Wortes (türkisch „IŞIK" ⇒ „ışık").
  return kleinFuer(token, lang).replace(KEIN_BUCHSTABE[lang], "");
}

/**
 * Ist die Zeile „echter Text" (Satz/Spruch/Witz) statt eines Silben-/Zahlen-
 * Drills? Nur dann lohnt es, die GANZE Zeile als Satz vorzulesen — eine
 * Drill-Zeile mit Pseudowörtern klänge als „Satz" wie Kauderwelsch. Erkannt an
 * Satzzeichen ODER daran, dass ALLE wortartigen Tokens echte Wörter sind (ist
 * auch nur ein Pseudowort dabei, wird die Zeile nicht als Satz gelesen).
 */
function lineIsProse(line: string, isWord: (t: string) => boolean, lang: Lang = "de"): boolean {
  if (/[.!?:]/.test(line)) return true;
  const toks = line.split(" ").filter((t) => letterCore(t, lang).length >= 2);
  if (!toks.length) return false;
  return toks.every((t) => isWord(t));
}

/** Standard ohne Wörterbuch: alles als echtes Wort behandeln (Tests/Abwärtskompat). */
const ALWAYS_WORD = (): boolean => true;

/** Welche Granularitäten gerade aktiv sind (Mehrfachauswahl). */
export interface ReadModes {
  letters: boolean;
  words: boolean;
  sentences: boolean;
  /**
   * „Wort und anschließend buchstabieren" (Wunsch aus Marburg, Testerin 28.08.2026):
   * „Für Schüler, denen es schwer fällt, wäre es vermutlich besser zu sagen
   * ‚Saal: S-a-a-l'." Löst zugleich den zweiten Punkt derselben Rückmeldung —
   * am Anfang eines echten Wortes war der GROSSBUCHSTABE nicht zu hören, weil
   * nur das ganze Wort gesprochen wurde.
   */
  spell?: boolean;
  /**
   * ★★★ „Mein Training": die GANZE Zeile am Zeilenanfang vorlesen, auch wenn
   * sie kein Satz ist, sondern Zahlen oder Sonderzeichen enthält (Sara,
   * 21.10.2026: *„auch bei Zahlen soll die ganze Zeile gelesen werden, wie in
   * Klassenmatch"*, *„Sprachausgabe liest keine Sonderzeichen"*). Reine
   * Übungssilben (nur Buchstaben, keine echten Wörter) bleiben beim
   * Buchstabieren - Johannes' Regel für die Grundreihe.
   */
  zeileGanz?: boolean;
  /**
   * Ist die Umschalttaste schon gelernt? Solange nicht, erscheinen Großbuchstaben
   * durch die Auto-Großschreibung, ohne dass das Kind etwas anderes tut — es
   * tippt die kleine Taste. Dann darf die Stimme auch NICHT „großes S" sagen
   * (Entscheidung Johannes 28.08.2026): angezeigt groß, gesprochen klein. Fehlt
   * das Feld, gilt „gelernt" — so bleibt jeder Alt-Aufruf (und jeder Test)
   * unverändert.
   */
  shiftLearned?: boolean;
  /**
   * Vorlese-Sprache der ZEICHENNAMEN („Leertaste" gegen „space", „Punkt" gegen
   * „full stop"). Fehlt sie, gilt Deutsch - so bleibt jeder Alt-Aufruf und jeder
   * bestehende Test unverändert.
   *
   * ★ Anlass (Jens, 29.08.2026): Englische Texte wurden mit englischer Stimme
   * gelesen, die Zeichennamen blieben deutsch und klangen dadurch falsch
   * („Pankt"). Gemessen betraf das 21,7 % aller Anschläge einer englischen
   * Zeile - vor allem die „Leertaste" nach jedem Wort.
   */
  lang?: Lang;
}

/**
 * Wie ein Zeichen VORGELESEN wird, mit Rücksicht auf die Auto-Großschreibung:
 * Solange die Umschalttaste nicht gelernt ist, drückt das Kind die kleine Taste —
 * „großes S" wäre dann eine Ansage über etwas, das es gar nicht tut.
 */
export function spokenLabelFor(
  ch: string,
  shiftLearned = true,
  lang: Lang = "de",
): string {
  const gross = ch !== ch.toLowerCase() && ch === ch.toUpperCase();
  return spokenLabel(gross && !shiftLearned ? kleinFuer(ch, lang) : ch, lang);
}

/** Hat die Zeile Ziffern oder Sonderzeichen (alles ausser Buchstabe/Ziffer/Leerzeichen)? */
export function zeileHatZahlOderSonderzeichen(line: string): boolean {
  return /\d|[^\p{L}\p{N}\s]/u.test(line);
}

/**
 * Sprechtext einer Zahlen-/Sonderzeichen-Zeile: ganz, Sonderzeichen beim Namen
 * (eine Stimme spricht „;" oder „(" sonst gar nicht).
 */
export function zeileGanzSprechtext(line: string, shiftLearned = true, lang: Lang = "de"): string {
  return [...line]
    .map((c) => (/[\p{L}\p{N}\s]/u.test(c) ? c : ` ${spokenLabelFor(c, shiftLearned, lang)} `))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Was an Position `index` der Zeile vorgelesen werden soll — als Reihenfolge von
 * Texten (leer = nichts). Pure + testbar; die Sprachausgabe ruft das Ergebnis
 * über {@link speakSequence} auf.
 *  • Zeilenanfang (index 0): bei echtem Text (Satz) erst die ganze Zeile.
 *  • Echtes Wort (laut `isWord`): am Wortanfang das ganze Wort; mitten im Wort nur
 *    bei aktivem Buchstaben-Schalter der einzelne Buchstabe.
 *  • „Wort", das keins ist (Übungssilbe/Pseudowort/Einzelzeichen/Zahl): IMMER
 *    Buchstabe für Buchstabe — auch wenn der Buchstaben-Schalter AUS ist (Wunsch:
 *    in der Grundreihe sollen Nicht-Wörter buchstabiert werden).
 *  • Wörter-Modus aus: Buchstaben nach Buchstaben-Schalter.
 * (Das Vertippen wird separat angesagt — immer der zu tippende Buchstabe.)
 *
 * `isWord` entscheidet „echtes Wort?" (Lexikon). Fehlt es (Tests), gilt jedes
 * Token als echtes Wort — das alte Verhalten.
 */
export function readPlanAt(
  line: string,
  index: number,
  m: ReadModes,
  isWord: (token: string) => boolean = ALWAYS_WORD,
): string[] {
  const ch = line[index];
  if (ch === undefined) return [];

  const parts: string[] = [];
  if (index === 0 && m.sentences && lineIsProse(line, isWord, m.lang ?? "de")) parts.push(line);
  else if (index === 0 && m.sentences && m.zeileGanz && zeileHatZahlOderSonderzeichen(line)) {
    parts.push(zeileGanzSprechtext(line, m.shiftLearned ?? true, m.lang ?? "de"));
  }

  // Satzzeichen und Sonderzeichen werden immer beim Namen genannt — blinde
  // Lernende müssen wissen, welche Taste als Nächstes gedrückt werden muss.
  // Das gilt unabhängig davon, welche Lese-Granularität eingestellt ist.
  const isAlpha = BUCHSTABE_ODER_ZIFFER[m.lang ?? "de"].test(ch);
  const sag = (c: string) => spokenLabelFor(c, m.shiftLearned ?? true, m.lang ?? "de");
  if (!isAlpha) {
    const label = sag(ch);
    if (!parts.includes(label)) parts.push(label);
    return parts;
  }

  let start = wordStartIndex(line, index);
  // ★★★★★ ES-P7a-Behebung (27.09.2026, M5, Prüfbericht Fundament es): Auf
  // Weg „es" beginnt fast jeder Frage-/Ausrufesatz mit ¿/¡, und Zitate mit
  // „"" - der Wortanfang lag darum auf dem ÖFFNENDEN ZEICHEN, nie auf dem
  // ersten echten Buchstaben: „¿Qué" wurde an „Q" als MITTEN IM WORT
  // behandelt (kein ganzes Wort, nur der Buchstabe „Q" oder gar nichts), und
  // an „¿" selbst gibt es ohnehin nur den Zeichennamen. Gemessen (e7): 274
  // von 19.154 Wörtern der Platzhalter nie ganz gesprochen (¿ 97, ¡ 6, „"" 171).
  // Im Spanischen ist das erste Wort nach ¿/¡ fast immer das wichtigste
  // (qué, cómo, dónde, cuándo) - genau das blieb stumm bzw. buchstabiert.
  //
  // Der Wortanfang verschiebt sich hinter jedes führende ¿/¡/„"" (auch
  // mehrere davon) - zuerst nur für „es", seit 28.09. für alle (unten).
  //
  // ★★★ ES-M2 (27.09.2026, Prüfbericht ES-P2 S2 - derselbe Fehler, Rest der
  // Klasse): nicht nur ¿ ¡ ", sondern JEDES öffnende Zeichen vor einem Wort -
  // ( [ { und der Gesprächsstrich „-", dazu * # ' und die typografischen
  // Anführungszeichen. Gemessen (p2-sprache): Korpus 81, Reto 372 Wörter nie
  // ganz gesprochen, z. B. „Mi mascota (una tortuga)": an „u" von „una"
  // nichts. Und das Wort wird ohne sein SCHLIESSENDES Zeichen gesprochen:
  // „tortuga", nicht „tortuga)".
  //
  // ★★★ Punkt 2 „vier Reste" (28.09.2026, Johannes: jede Behebung in ALLEN
  // Sprachwegen): die Regel gilt für JEDE Sprache, eine Stelle, keine Weiche.
  // Bis dahin NUR „es" - gemessen (`pruefstand/vier-reste/p2-woerter-nach-
  // oeffnenden.mts`), echte Wörter nie ganz gesprochen: fr Korpus 301,
  // Serien 358, Tippchallenge 1783 („"Bonjour," ⇒ an „B" nichts); de
  // Tippchallenge 230, en 630 („(the" ⇒ buchstabiert). Wächter:
  // `tests/tastenflow-woerter-nach-oeffnenden-alle-wege.test.ts`.
  while (start < line.length && OEFFNEND_VOR_WORT.has(line[start])) start++;
  let token = wordAt(line, start);
  // Hinten: schliessende Zeichen weg, Satzzeichen bleiben („tortuga)." ⇒
  // „tortuga."). Ein Wort ohne schliessendes Zeichen bleibt Zeichen für
  // Zeichen, wie es war („casa," ⇒ „casa,").
  let ende = token.length;
  while (ende > 0 && (SCHLIESSEND_NACH_WORT.has(token[ende - 1]) || ".,;:?!…".includes(token[ende - 1]))) ende--;
  const schwanz = [...token.slice(ende)].filter((c) => !SCHLIESSEND_NACH_WORT.has(c)).join("");
  if (ende > 0) token = token.slice(0, ende) + schwanz;
  const real = m.words && isWord(token);

  if (real) {
    if (index === start) {
      parts.push(token);
      // „Wort und anschließend buchstabieren": „Saal: großes S, a, a, l."
      if (m.spell) for (const c of token) parts.push(sag(c));
      // ⚠️ Ohne den Buchstabier-Modus fehlte der ERSTE Buchstabe ganz: Wer
      // Wörter UND Buchstaben eingeschaltet hatte, hörte „Saal, a, a, l" — der
      // Anfangsbuchstabe wurde nie genannt, weil an dieser Stelle nur das Wort
      // kam. Gemeldet aus Marburg (Testerin, 28.08.2026), am Code belegt.
      else if (m.letters) parts.push(sag(ch));
    } else if (m.letters && !m.spell) parts.push(sag(ch));
    return parts;
  }
  if (m.words) {
    // Nicht-Wort → immer buchstabieren (unabhängig vom Buchstaben-Schalter).
    parts.push(sag(ch));
    return parts;
  }
  if (m.letters) parts.push(sag(ch));
  return parts;
}
