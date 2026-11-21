/**
 * Barrierefreiheit des Tipptrainers: stufenlose Vergrößerung des Tippfeldes.
 * Kontrastmodi sind plattformweit in src/lib/contrast.ts — dort wird der
 * globale Zustand gehalten und auf :root angewendet.
 */
import { create } from "zustand";

// Vergrößerung NUR fürs Tippfeld — bis 800 % (8×) für sehr starke Sehbehinderung.
// Bei großem Zoom passt keine ganze Zeile mehr ins Feld; dann bleibt das aktuelle
// Zeichen mittig stehen und die Zeile wandert darunter durch (siehe PromptText).
//
// ★★★ DIE STUFEN STEHEN SEIT 25.08.2026 AN EINER EINZIGEN STELLE
// (`src/lib/arbeitsblatt/vergroesserung.ts`). Sie standen vorher zweimal im
// Projekt — hier und in Mathecoach — mit denselben zehn Werten. Zwei Kopien
// derselben Leiter sind zwei Wahrheiten, und die zweite wäre irgendwann die
// falsche: Ein Kind, das in Tastenflow siebenmal Alt + + drückt, soll in jedem
// Programm dieselbe Größe bekommen ([[feedback_platform_parity]]).
export { ZOOM_STUFEN as ZOOM_LEVELS } from "@/lib/arbeitsblatt/vergroesserung";
import { ZOOM_STUFEN as ZOOM_LEVELS } from "@/lib/arbeitsblatt/vergroesserung";

const KEY = "tippen-a11y";

/** Was die App nach einem richtigen Anschlag selbst ansagt. */
export type TastenAnsage = "aus" | "naechste";

export const TASTEN_ANSAGE_KEY = "tippen-tastenansage";

/**
 * Apple-System? Dort ist gemessen, dass die Leertaste ohne Wortlaut bleibt.
 *
 * ⚠️ Das ist eine VORGABE, keine Sperre - jede Person kann die Stufe in den
 * Einstellungen wechseln, und ihre Wahl gilt danach auf jedem System. Wir
 * erkennen hier auch keinen Screenreader: Das geht aus dem Browser nicht
 * ([[reference_screenreader_nicht_abfragbar]]), und ein Ratespiel wäre
 * schlechter als eine ehrliche Vorgabe.
 */
function appleSystem(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // iPadOS meldet sich seit Jahren als „Macintosh" mit Berührungspunkten -
  // beide Wege führen zur selben Vorgabe, also genügt die eine Prüfung.
  return /Mac|iPhone|iPad|iPod/.test(ua);
}

/**
 * Einen gespeicherten Wert in eine gültige Stufe übersetzen.
 *
 * ★★★ EIGENE, PRÜFBARE FUNKTION - und zwar mit Absicht. Sie trägt die
 * Umstellung der Bestandsgeräte, und die ist genau die Art Regel, die man
 * schweigend falsch macht: Am Vormittag des 03.09.2026 hiessen die Stufen
 * „sonderzeichen" und „jede" und sagten an, was GEDRÜCKT wurde. Wer eine
 * davon gewählt hatte, WOLLTE eine Ansage - ein stiller Rückfall auf „aus"
 * nähme sie ausgerechnet dem Kind, das sie eingeschaltet hatte.
 *
 * `null` (nichts gespeichert) ist etwas anderes als ein Alt-Wert: Dann gilt
 * die Vorgabe des Systems.
 */
export function tastenAnsageAus(roh: string | null): TastenAnsage {
  if (roh === "aus" || roh === "naechste") return roh;
  if (roh === "sonderzeichen" || roh === "jede") return "naechste";
  return appleSystem() ? "naechste" : "aus";
}

function leseTastenAnsage(): TastenAnsage {
  try {
    return tastenAnsageAus(localStorage.getItem(TASTEN_ANSAGE_KEY));
  } catch {
    return tastenAnsageAus(null); // kein Speicher - dann die Vorgabe
  }
}

interface A11yState {
  zoomIndex: number;
  zoom: number; // bequemer Multiplikator (= TIPP_ZOOM_STUFEN[zoomIndex])
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  /**
   * Finger-Farben (Tasten nach zuständigem Finger einfärben). Stand bis
   * 25.08.2026 als Häkchen unter der Tastatur; seither in den Einstellungen,
   * Gruppe „Anzeige" - eine Einmal-Entscheidung gehört nicht unter das
   * Übungsfeld. Eigener Speicher-Schlüssel wie bisher.
   */
  fingerFarben: boolean;
  setFingerFarben: (an: boolean) => void;
  /**
   * ★ Leerzeichen in der Übungszeile als „␣" zeigen oder als Lücke (Vorgabe)
   * (Johannes 13.11.2026). Geräte-Einstellung wie die Finger-Farben - jedes Kind
   * stellt es selbst ein, keine Lehrkraft nötig.
   */
  leerzeichenZeigen: boolean;
  setLeerzeichenZeigen: (an: boolean) => void;
  /**
   * ★★★★★ DIE APP SAGT DIE **NÄCHSTE** TASTE AN (03.09.2026 abends).
   *
   * ── DER BEFUND, DER DAZU GEFÜHRT HAT ───────────────────────────────────
   *
   * Johannes am iPad, mit Bluetooth-Tastatur und VoiceOver:
   *
   * > „er sagt beim Tastenecho immer, was gedrückt wurde. Das ist ja nicht
   * > das, was man hören will - man will ja die nächste Taste hören."
   *
   * Das trifft den Kern. Ein Kind, das blind schreiben LERNT, weiss selbst,
   * welche Taste es gerade gedrückt hat - es braucht die Anweisung, nicht die
   * Quittung. Die erste Fassung dieses Schalters (Vormittag desselben Tages)
   * sagte an, was gedrückt wurde, und wiederholte damit genau das, was der
   * Screenreader ohnehin schon sagt.
   *
   * ★ Wer mit BRAILLEZEILE arbeitet, hat das Problem nicht: Dort steht die
   *   ganze Übungszeile mit dem Schreibzeiger, das nächste Zeichen ist
   *   ertastbar. Es trifft die, die nur hören.
   *
   * ── WAS DABEI NEBENBEI GELÖST IST ─────────────────────────────────────
   *
   * Die Leertaste. Am 03.09. gemessen (drei Läufe, echtes VoiceOver): Sie
   * bleibt dort ohne Wortlaut - auch in einem ganz gewöhnlichen Textfeld.
   * Mit der Ansage der NÄCHSTEN Taste braucht sie keine Sonderbehandlung
   * mehr: Dass der Anschlag angekommen ist, hört das Kind daran, dass die
   * Ansage weitergerückt ist.
   *
   * ── ZWEI STUFEN, NICHT MEHR ───────────────────────────────────────────
   *
   *  • `aus`      - der Screenreader macht es allein. Vorgabe unter Windows:
   *                 NVDA sagt dort jeden Anschlag richtig an (gemessen,
   *                 15/15, dreimal identisch), und die Braillezeile trägt
   *                 das Nächste ohnehin. Was dort noch fehlt, ist nicht
   *                 gemessen - also wird es nicht verändert.
   *  • `naechste` - nach jedem richtigen Anschlag die nächste Taste.
   *                 Vorgabe auf Apple-Systemen.
   *
   * ⚠️ Die Ansage geht in den ASSERTIVEN Live-Bereich, unterbricht das
   * Tastenecho also. Das ist Absicht und folgt Johannes' Satz: Was gedrückt
   * wurde, ist nicht das, was man hören will.
   */
  tastenAnsage: TastenAnsage;
  setTastenAnsage: (a: TastenAnsage) => void;
  /**
   * Bildschirm-Tastatur eingeblendet? Der Schalter dazu steht seit 25.08.2026
   * in der Zeile mit „Umschalttaste zweimal drücken …"; die Tastatur selbst
   * liest den Zustand hier. Eigener Speicher-Schlüssel wie bisher
   * (`keyboardHidden()` für das Abzeichen „Blindflug" liest denselben).
   */
  tastaturOffen: boolean;
  setTastaturOffen: (offen: boolean) => void;
  /**
   * ★ AUSBLENDEN (Johannes 12.11.2026, nach mehreren Meldungen: „sie möchten
   * den schon geschriebenen Text nicht sehen"). Das Geschriebene blendet über
   * so viele Zeichen hinter dem Schreibzeiger aus; 0 = gar nicht (alles bleibt
   * stehen). Vorgabe {@link AUSBLENDEN_ZEICHEN}.
   *
   * ★ 13.11.2026 (Johannes): kein Schalter mehr in den Einstellungen, sondern
   * ein ZWEITER Anfasser unter der Übungszeile, links vom Schreibzeiger-Punkt.
   * Dicht am Schreibzeiger = weg nach einem Zeichen, ganz am linken Rand = aus.
   */
  ausblendZeichen: number;
  setAusblendZeichen: (zeichen: number) => void;
  /**
   * ★ SEITE STATT ZEILE (Johannes 13.11.2026): wie viele Zeilen das
   * Übungsfeld zeigt. 1 = die übliche eine Zeile (Teleprompter). Ab 2 steht der
   * Text wie in einem Word-Dokument: Er bricht um, der Schreibzeiger wandert
   * Zeile für Zeile nach rechts unten, danach kommt eine neue Seite. Eingestellt
   * mit dem Anfasser rechts unten am Feld - nur für Sehende, ohne Tastenweg.
   */
  seitenZeilen: number;
  setSeitenZeilen: (zeilen: number) => void;
  /**
   * ★ WO DER SCHREIBZEIGER STEHT (Johannes 12.11.2026): Anteil der Feldbreite,
   * 0,5 = Mitte (bis 12.11.2026 fest), Vorgabe der goldene Schnitt
   * (≈ 0,382), 0 = ganz links. Eingestellt mit dem
   * Anfasser unter der Übungszeile - nur für Sehende, darum ohne Tastenweg.
   */
  cursorStelle: number;
  setCursorStelle: (anteil: number) => void;
}

/** Vorgabe: über so viele Zeichen hinter dem Schreibzeiger blendet das Geschriebene aus. */
export const AUSBLENDEN_ZEICHEN = 6;
/** Weiter als so viele Zeichen zieht der Ausblend-Anfasser nicht - links davon ist „aus". */
export const AUSBLENDEN_ZEICHEN_MAX = 200;
/** Bis 12.11.2026: nur an/aus. Wird noch gelesen, damit ein „aus" erhalten bleibt. */
const AUSBLENDEN_KEY_ALT = "tippen-ausblenden";
const AUSBLENDEN_KEY = "tippen-ausblend-zeichen";
const CURSOR_STELLE_KEY = "tippen-cursor-stelle";
const SEITEN_ZEILEN_KEY = "tippen-seiten-zeilen";
/**
 * Nur eine Schutzgrenze für gespeicherte Werte. Die eigentliche Grenze ist der
 * untere Fensterrand (Johannes 13.11.2026: „so viele Zeilen wie der Benutzer
 * nach unten zieht … wird das Fenster kleiner gemacht, müssen die Zeilen
 * weniger werden") - die misst `TypingSession` (`seitenZeilenImFenster`).
 */
export const SEITEN_ZEILEN_MAX = 99;
/** Mitte - weiter rechts geht der Anfasser nicht. */
export const CURSOR_STELLE_MITTE = 0.5;
/**
 * ★ Die Vorgabe: der goldene Schnitt von links (1 - 0,618 ≈ 0,382). Johannes
 * 12.11.2026: „mach den Cursor standardmässig nicht in die Mitte, sondern
 * weiter nach links (goldener Schnitt)".
 */
export const CURSOR_STELLE_VORGABE = 1 - (Math.sqrt(5) - 1) / 2;

/** Einen gespeicherten Anteil in den gültigen Bereich 0 … 0,5 bringen. */
export function cursorStelleAus(roh: string | number | null): number {
  const n = typeof roh === "number" ? roh : roh === null ? NaN : Number(roh);
  if (!Number.isFinite(n)) return CURSOR_STELLE_VORGABE;
  return Math.min(CURSOR_STELLE_MITTE, Math.max(0, n));
}

/**
 * ★ „Sofort" (Johannes 13.11.2026): schon das gerade getippte Zeichen ist weg -
 * der hohle Ring steht dann direkt neben dem vollen Punkt. Ein eigener Wert,
 * weil 0 schon „aus" heisst.
 */
export const AUSBLENDEN_SOFORT = -1;

/** Eine gespeicherte Zeichenzahl in {@link AUSBLENDEN_SOFORT}, 0 (aus) oder 1 … {@link AUSBLENDEN_ZEICHEN_MAX} bringen. */
export function ausblendZeichenAus(roh: string | number | null): number {
  const n = typeof roh === "number" ? roh : roh === null || roh === "" ? NaN : Number(roh);
  if (!Number.isFinite(n)) return AUSBLENDEN_ZEICHEN;
  if (n < 0) return AUSBLENDEN_SOFORT;
  if (n === 0) return 0;
  return Math.min(AUSBLENDEN_ZEICHEN_MAX, Math.max(1, Math.round(n)));
}

/** Eine gespeicherte Zeilenzahl in 1 … {@link SEITEN_ZEILEN_MAX} bringen. */
export function seitenZeilenAus(roh: string | number | null): number {
  const n = typeof roh === "number" ? roh : roh === null || roh === "" ? NaN : Number(roh);
  if (!Number.isFinite(n)) return 1;
  return Math.min(SEITEN_ZEILEN_MAX, Math.max(1, Math.round(n)));
}

function leseAusblendZeichen(): number {
  try {
    const neu = localStorage.getItem(AUSBLENDEN_KEY);
    if (neu !== null) return ausblendZeichenAus(neu);
    // Wer gestern den Schalter ausgemacht hat, behält „aus".
    return localStorage.getItem(AUSBLENDEN_KEY_ALT) === "aus" ? 0 : AUSBLENDEN_ZEICHEN;
  } catch {
    return AUSBLENDEN_ZEICHEN;
  }
}

function leseSeitenZeilen(): number {
  try {
    return seitenZeilenAus(localStorage.getItem(SEITEN_ZEILEN_KEY));
  } catch {
    return 1;
  }
}

function leseCursorStelle(): number {
  try {
    return cursorStelleAus(localStorage.getItem(CURSOR_STELLE_KEY));
  } catch {
    return CURSOR_STELLE_VORGABE;
  }
}

/** Eigene Schlüssel, damit Bestandsgeräte ihre Wahl behalten. */
const FARBEN_KEY = "sensorik:tippen:fingerfarben";
const LEERZEICHEN_KEY = "tippen-leerzeichen-zeigen";

// ★ Vorgabe AUS (Johannes 13.11.2026: „schalte standardmässig die Leerzeichen auf
// nicht anzeigen") - nur wer es ausdrücklich eingeschaltet hat, sieht „␣".
function leseLeerzeichen(): boolean {
  try {
    return localStorage.getItem(LEERZEICHEN_KEY) === "an";
  } catch {
    return false;
  }
}
const TASTATUR_KEY = "tippen-keyboard-open";

function leseFarben(): boolean {
  try {
    return localStorage.getItem(FARBEN_KEY) !== "aus";
  } catch {
    return true;
  }
}

function leseTastatur(): boolean {
  try {
    // Vorgabe AUF: Nur ein ausdrückliches „0" klappt zu.
    return localStorage.getItem(TASTATUR_KEY) !== "0";
  } catch {
    return true;
  }
}

/**
 * Was unter `tippen-a11y` gespeichert liegt. Bis 09.09.2026 stand hier auch
 * `standAusblenden` (die Stand-Zeile beim Tippen blass machen) - der Schalter
 * ist gestrichen (Johannes: „lass die Leiste immer an, dann springt kein
 * Fokus"). Ein alter Eintrag im Speicher wird schlicht ignoriert.
 */
interface Gespeichert {
  zoomIndex: number;
}

/**
 * ★ Die Stufen der Übungsschrift in Tastenflow (Johannes 13.11.2026: „die Schrift
 * soll kleiner gehen als jetzt das kleinste"): vier kleinere Stufen VOR den
 * gemeinsamen `ZOOM_LEVELS`. Diese bleiben unverändert - Punktgenau und
 * Klangpunkte lesen sie über `ZOOM_LEVELS` mit.
 * `zoomIndex` zählt in DIESER Liste; gespeichert wird zusätzlich der Wert
 * (`zoom`), weil ein alter Eintrag nur die Nummer in `ZOOM_LEVELS` kennt.
 */
export const TIPP_ZOOM_STUFEN: readonly number[] = [0.5, 0.625, 0.75, 0.875, ...ZOOM_LEVELS];
/** Alt + 0: die Grundgrösse (100 %), nicht die kleinste Stufe. */
const TIPP_ZOOM_GRUND = TIPP_ZOOM_STUFEN.indexOf(1);

function read(): Gespeichert {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as { zoomIndex?: number; zoom?: number };
      // Neuer Eintrag: der Wert selbst.
      if (typeof d.zoom === "number") {
        const i = TIPP_ZOOM_STUFEN.indexOf(d.zoom);
        if (i >= 0) return { zoomIndex: i };
      }
      // Alter Eintrag (bis 13.11.2026): Nummer in `ZOOM_LEVELS`.
      if (typeof d.zoomIndex === "number" && d.zoomIndex >= 0 && d.zoomIndex < ZOOM_LEVELS.length) {
        return { zoomIndex: TIPP_ZOOM_STUFEN.indexOf(ZOOM_LEVELS[d.zoomIndex]) };
      }
    }
  } catch {
    /* ignore */
  }
  return { zoomIndex: TIPP_ZOOM_GRUND };
}

function persist(d: Gespeichert): void {
  try {
    const zoom = TIPP_ZOOM_STUFEN[d.zoomIndex];
    // `zoomIndex` bleibt für einen älteren Stand lesbar (Nummer in ZOOM_LEVELS, kleiner = 0).
    const alt = Math.max(0, ZOOM_LEVELS.indexOf(zoom as (typeof ZOOM_LEVELS)[number]));
    localStorage.setItem(KEY, JSON.stringify({ zoomIndex: alt, zoom }));
  } catch {
    /* ignore */
  }
}

export const useTypingA11y = create<A11yState>((set, get) => {
  const init = read();
  return {
    zoomIndex: init.zoomIndex,
    zoom: TIPP_ZOOM_STUFEN[init.zoomIndex],
    zoomIn: () => {
      const i = Math.min(get().zoomIndex + 1, TIPP_ZOOM_STUFEN.length - 1);
      persist({ zoomIndex: i });
      set({ zoomIndex: i, zoom: TIPP_ZOOM_STUFEN[i] });
    },
    zoomOut: () => {
      const i = Math.max(get().zoomIndex - 1, 0);
      persist({ zoomIndex: i });
      set({ zoomIndex: i, zoom: TIPP_ZOOM_STUFEN[i] });
    },
    resetZoom: () => {
      persist({ zoomIndex: TIPP_ZOOM_GRUND });
      set({ zoomIndex: TIPP_ZOOM_GRUND, zoom: 1 });
    },
    leerzeichenZeigen: leseLeerzeichen(),
    setLeerzeichenZeigen: (an: boolean) => {
      try {
        localStorage.setItem(LEERZEICHEN_KEY, an ? "an" : "aus");
      } catch {
        /* Speichern optional */
      }
      set({ leerzeichenZeigen: an });
    },
    fingerFarben: leseFarben(),
    setFingerFarben: (an: boolean) => {
      try {
        localStorage.setItem(FARBEN_KEY, an ? "an" : "aus");
      } catch {
        /* Speichern optional */
      }
      set({ fingerFarben: an });
    },
    tastenAnsage: leseTastenAnsage(),
    setTastenAnsage: (a: TastenAnsage) => {
      try {
        localStorage.setItem(TASTEN_ANSAGE_KEY, a);
      } catch {
        /* Speichern optional */
      }
      set({ tastenAnsage: a });
    },
    tastaturOffen: leseTastatur(),
    setTastaturOffen: (offen: boolean) => {
      try {
        localStorage.setItem(TASTATUR_KEY, offen ? "1" : "0");
      } catch {
        /* Speichern optional */
      }
      set({ tastaturOffen: offen });
    },
    ausblendZeichen: leseAusblendZeichen(),
    setAusblendZeichen: (zeichen: number) => {
      const z = ausblendZeichenAus(zeichen);
      try {
        localStorage.setItem(AUSBLENDEN_KEY, String(z));
      } catch {
        /* Speichern optional */
      }
      set({ ausblendZeichen: z });
    },
    seitenZeilen: leseSeitenZeilen(),
    setSeitenZeilen: (zeilen: number) => {
      const z = seitenZeilenAus(zeilen);
      try {
        localStorage.setItem(SEITEN_ZEILEN_KEY, String(z));
      } catch {
        /* Speichern optional */
      }
      set({ seitenZeilen: z });
    },
    cursorStelle: leseCursorStelle(),
    setCursorStelle: (anteil: number) => {
      const a = cursorStelleAus(anteil);
      try {
        localStorage.setItem(CURSOR_STELLE_KEY, String(a));
      } catch {
        /* Speichern optional */
      }
      set({ cursorStelle: a });
    },
  };
});
