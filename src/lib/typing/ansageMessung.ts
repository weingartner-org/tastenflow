/**
 * ★★★★★ DAS MESSGERÄT IM ECHTEN TRAINER - Anschlag bis Sprechbeginn.
 * ============================================================================
 *     https://tastenflow.org/?ansagemessung=1
 *
 * ── WARUM ES DIESES WERKZEUG GIBT (04.09.2026) ────────────────────────────
 *
 * Johannes am iPad: *„es dauert wieder unglaublich lange wenn ein wort
 * geschrieben wurde bis das nächste oder auch das leerzeichen angesagt wird."*
 *
 * Gemessen wurde daraufhin zweierlei, und beides war schnell:
 *   • `public/ansage-tempo-messung.html` am iPad: die Sprachausgabe beginnt
 *     nach **3 ms** zu sprechen - Mittelwert über vier Bauarten, zwanzig
 *     Läufe, kein einziger Fehlstart. Auch nach `cancel()`.
 *   • Dieselbe Kette in Chromium am Mac: 1 bis 4 ms.
 *
 * ⚠️⚠️ **UND GENAU DARIN LAG DER FEHLER DER MESSUNG.** Das Messblatt ruft
 * `speechSynthesis.speak()` DIREKT auf. Es überspringt damit alles, was
 * zwischen dem Anschlag eines Kindes und diesem Aufruf liegt: die beiden
 * Vorlese-Effekte in `TypingSession`, `readPlanAt`, `speakSequence`,
 * `runSpeech` mit seinem Ruhefenster, `cancelIfBusy` und die 90-ms-Atempause.
 *
 * **Das Blatt hat die Schicht ERSETZT, die es prüfen sollte** - dieselbe
 * Fehlerform wie der Bauteil-Test vom selben Tag, der eine falsche Bedingung
 * nicht finden konnte, weil er sie selbst hineinreichte
 * ([[feedback_gruener_waechter_beweist_was]]).
 *
 * Dieses Werkzeug misst deshalb im **laufenden Trainer**: vom `keydown` des
 * Kindes bis zu dem Augenblick, in dem die Ansage wirklich zu sprechen
 * beginnt - über die ganze eigene Kette.
 *
 * ── ★★★★★ DIE ZWEITE FRAGE, seit 04.09.2026 tagsüber ──────────────────────
 *
 * *„Mit Vorlesen kann man nicht üben, jeder nächste Buchstabe dauert ewig,
 * man kommt nicht in einen Schreibfluss."* Das ist nicht mehr die Frage
 * „wann beginnt sie", sondern „passt sie überhaupt hinein". Dafür misst das
 * Werkzeug zwei Zahlen mehr - die **Sprechdauer** und den **Tipprhythmus** -
 * und stellt sie in der Fluss-Zeile gegenüber. Dazu schreibt der Bericht
 * jetzt selbst mit, **was eingestellt war**: Ob je Anschlag ein Buchstabe
 * oder ein ganzes Wort gesprochen wird, ist der Unterschied zwischen 300 und
 * 800 ms, und von Hand nachgetragen wurde es genau einmal nicht.
 *
 * ── WAS ES NICHT TUT ──────────────────────────────────────────────────────
 *
 * Es greift **nirgends ein**. Es hängt sich vor `speechSynthesis.speak`, merkt
 * sich einen Zeitstempel und reicht den Auftrag unverändert weiter. Ohne den
 * URL-Zusatz wird nicht eine Zeile davon ausgeführt - ein Kind kann es weder
 * auslösen noch sehen.
 */
import { useTypingA11y } from "./a11y";
import { useVoice } from "./voice";
import { vorleseSprache } from "./vorlesen";

/** Eine gemessene Ansage. */
interface Zeile {
  /** Was gesprochen wurde (gekürzt). */
  text: string;
  /** Welche Taste ihr vorausging. */
  taste: string;
  /**
   * ★★★★★ WIE LANGE VOR DIESEM ANSCHLAG DER VORIGE LAG (04.09.2026 tagsüber).
   *
   * Johannes am iPad, nachdem die verschluckte Ansage behoben war:
   * *„mit Vorlesen kann man nicht üben, jeder nächste Buchstabe dauert ewig,
   * man kommt nicht in einen Schreibfluss."*
   *
   * Das ist eine ANDERE Frage als die der Nacht. Dort ging es um Ansagen, die
   * gar nicht begannen (23 % nach einem Abbruch). Hier geht es darum, dass
   * eine Ansage, die pünktlich beginnt, trotzdem zu lange DAUERT: Wer schneller
   * tippt, als die Stimme spricht, schneidet jede Ansage ab - und jeder
   * Schnitt kostet die 90-ms-Atempause und am iPad bis zu 1200 ms im Gerät.
   *
   * Ob das so ist, entscheidet ein Vergleich zweier Zahlen, und beide fehlten:
   * wie lange eine Ansage dauert (`dauer`) und wie schnell getippt wird
   * (dieses Feld). Ohne sie wäre jeder Umbau geraten - genau das, was Johannes
   * am 03.09. untersagt hat: erst messen, dann bauen.
   */
  abstand: number | null;
  /** Anschlag → `speak()` wurde gerufen. UNSERE Kette. */
  bisAufruf: number | null;
  /** `speak()` → die Engine beginnt zu sprechen. DAS GERÄT. */
  bisBeginn: number | null;
  /**
   * ★★★★★ WIE LANGE DIE ANSAGE GESPROCHEN HAT - Beginn bis Ende.
   *
   * Die Zahl, die den Schreibfluss entscheidet. Zusammen mit `abstand` sagt sie,
   * ob die Stimme in den Tipprhythmus PASST: Ist die Sprechdauer plus die
   * 90-ms-Atempause grösser als der Abstand zweier Anschläge, wird jede Ansage
   * abgeschnitten - dann ist die Stimme eine Geschwindigkeitsgrenze und kein
   * Tempo-Umbau der Welt hilft, nur ein kürzerer oder ein seltenerer Text.
   *
   * ⚠️ NUR die Zeilen mit `dauerVoll` zählen für „wie lange dauert eine Ansage".
   *    Eine abgeschnittene Ansage misst den Schnitt, nicht den Text - sie in
   *    denselben Topf zu werfen ergäbe eine Dauer, die umso kürzer aussieht,
   *    je schneller getippt wird. Das wäre ein Beleg für das Gegenteil des
   *    Wahren ([[feedback_gruener_waechter_beweist_was]]).
   */
  dauer: number | null;
  /**
   * Die Ansage lief durch und hat dabei WIRKLICH GESPROCHEN.
   *
   * ⚠️⚠️ ZWEI BEDINGUNGEN, und die zweite hat mich im ersten Probelauf am
   * Live-Stand erwischt (04.09.2026): Es genügt nicht, dass kein `cancel()`
   * dazwischenkam. Eine Ansage kann **enden, ohne gesprochen zu haben** -
   * `start` und `end` feuern im selben Augenblick, gemessen 0 ms und 5 ms.
   * Das ist dieselbe Verschluck-Erscheinung wie der Fehlstart, nur von der
   * anderen Seite gesehen.
   *
   * Zählten diese Zeilen mit, sänke die gemessene „Sprechdauer" genau dann,
   * wenn die Engine am meisten verschluckt - **die Zahl würde umso besser,
   * je schlechter die Lage ist.** Im ersten Lauf standen 0 ms und 5 ms im
   * selben Topf wie 957 ms und 2136 ms.
   *
   * Darum gilt eine Ansage erst ab {@link STUMM_MS} als gesprochen. Die
   * verschluckten verschwinden nicht - sie werden eigens gezählt und
   * ausgewiesen; sie sind ja selbst ein Befund.
   */
  dauerVoll: boolean;
  /** Die Engine hat binnen 4 s nie begonnen. */
  nieBegonnen: boolean;
  /**
   * ★★★★★ HAT DIESER AUFTRAG EINE LAUFENDE ANSAGE ABGESCHNITTEN? (04.09.2026)
   *
   * Das ist die Zahl, die im ersten Bericht gefehlt hat. Er zeigte in UNSERER
   * Kette einen Mittelwert von 98 ms - fast alle Werte lagen zwischen 95 und
   * 107 ms, also genau auf der 90-ms-Atempause nach einem `cancel()`
   * (`CANCEL_GAP_MS` in voice.ts). Und auf der GERAETE-Seite standen zehn von
   * vierzig Zeilen ueber 200 ms, eine bei 1200 ms.
   *
   * Beides zusammen ergibt nur dann einen Befund, wenn dabeisteht, ob
   * tatsaechlich abgebrochen wurde. Ohne diese Spalte bliebe offen, ob die
   * langen Werte vom Abbruch kommen oder von etwas anderem - und ein Umbau
   * auf Verdacht waere genau das, was Johannes am 03.09. untersagt hat:
   * erst messen, dann bauen.
   *
   * ★★ Weil `cancelIfBusy()` NUR abbricht, wenn die Engine wirklich spricht,
   * heisst diese Spalte zugleich „sie sprach noch" - beides in einer Zahl.
   */
  nachAbbruch: boolean;
  /*
   * ⚠️⚠️ `warBeschaeftigt` gibt es hier ABSICHTLICH NICHT MEHR (gefunden im
   * eigenen Probelauf, 04.09.2026).
   *
   * Die erste Fassung las an dieser Stelle `synth.speaking`. Das ist wertlos:
   * Unser Code ruft `cancelIfBusy()` VOR dem `speak()`, und nach einem
   * `cancel()` ist `speaking` bereits false. Die Spalte zeigte darum
   * "Engine war beschaeftigt: 0 von 3" fuer einen Lauf, in dem die Engine
   * nachweislich sprach - **ein Beleg fuer das Gegenteil des Wahren**
   * ([[feedback_gruener_waechter_beweist_was]]).
   *
   * Die Auskunft steckt ohnehin schon in `nachAbbruch`: `cancelIfBusy` bricht
   * NUR ab, wenn die Engine beschaeftigt war. ABBR heisst also genau
   * "sie sprach noch" - eine zweite Spalte dafuer waere eine zweite Wahrheit.
   */
}

const HOECHSTWARTE_MS = 4000;
/**
 * Unter dieser Dauer hat die Ansage NICHT gesprochen - sie wurde verschluckt.
 *
 * Die kürzeste echte Ansage ist ein einzelner Buchstabe; selbst beim schnellsten
 * einstellbaren Tempo (2,0) braucht der ein Vielfaches davon. Gemessen am
 * Live-Stand lagen die verschluckten bei 0 und 5 ms, die gesprochenen bei 957
 * und 2136 ms - dazwischen liegt keine Grauzone, in der die Grenze wackelt.
 */
const STUMM_MS = 80;
/** So lange nach einem Anschlag gilt eine Ansage noch als seine Antwort. */
const ZUORDNUNG_MS = 5000;
const MAX_ZEILEN = 40;

let aktiv = false;
let zeilen: Zeile[] = [];
let letzterAnschlag: { t: number; taste: string; abstand: number | null } | null = null;

/** Ist der Messmodus per URL angefordert? */
export function ansageMessungAngefordert(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("ansagemessung") === "1";
  } catch {
    return false;
  }
}

/**
 * Startet das Messgerät und blendet die Anzeige ein. Gibt die Abmeldung
 * zurück. Mehrfachaufrufe sind gutmütig - der zweite tut nichts.
 */
export function ansageMessungStarten(): () => void {
  if (aktiv || typeof window === "undefined") return () => {};
  aktiv = true;
  zeilen = [];

  const synth = window.speechSynthesis;
  const originalSpeak = synth ? synth.speak.bind(synth) : null;
  const originalCancel = synth ? synth.cancel.bind(synth) : null;
  /** Wann zuletzt abgebrochen wurde - fuer die Spalte `nachAbbruch`. */
  let letzterAbbruch = 0;
  /** So lange nach einem `cancel()` gilt ein `speak()` als dessen Folge. */
  const ABBRUCH_FENSTER_MS = 400;

  if (synth && originalCancel) {
    synth.cancel = function () {
      letzterAbbruch = performance.now();
      return originalCancel();
    };
  }

  const aufAnschlag = (e: KeyboardEvent) => {
    // Steuertasten sind keine Anschläge im Sinne des Trainers.
    if (e.key.length !== 1 && e.key !== " " && e.key !== "Enter") return;
    const t = performance.now();
    // Der Tipprhythmus: wie lange lag der vorige Anschlag zurück? Beim ersten
    // Anschlag einer Sitzung gibt es keinen - dann bleibt das Feld leer, statt
    // eine erfundene Null in den Mittelwert zu tragen.
    const abstand = letzterAnschlag ? Math.round(t - letzterAnschlag.t) : null;
    letzterAnschlag = { t, taste: e.key === " " ? "Leertaste" : e.key, abstand };
  };
  document.addEventListener("keydown", aufAnschlag, true);

  if (synth && originalSpeak) {
    synth.speak = function (u: SpeechSynthesisUtterance) {
      const gerufen = performance.now();
      const anschlag = letzterAnschlag;
      const bisAufruf =
        anschlag && gerufen - anschlag.t <= ZUORDNUNG_MS
          ? Math.round(gerufen - anschlag.t)
          : null;
      const zeile: Zeile = {
        text: (u.text || "").slice(0, 28),
        taste: bisAufruf === null ? "-" : (anschlag as { taste: string }).taste,
        abstand: bisAufruf === null ? null : (anschlag as { abstand: number | null }).abstand,
        bisAufruf,
        bisBeginn: null,
        dauer: null,
        dauerVoll: false,
        nieBegonnen: false,
        nachAbbruch: gerufen - letzterAbbruch <= ABBRUCH_FENSTER_MS,
      };
      // ★ Die Prüfmarke: Eine Ansage, die NIE begonnen hat, sieht sonst
      //   genauso aus wie eine, die sofort begann. Sie wird ausdrücklich als
      //   Fehlstart gezählt, statt still zu verschwinden.
      const wecker = window.setTimeout(() => {
        if (zeile.bisBeginn === null) {
          zeile.nieBegonnen = true;
          zeichne();
        }
      }, HOECHSTWARTE_MS);
      let beginnAt: number | null = null;
      u.addEventListener("start", () => {
        window.clearTimeout(wecker);
        beginnAt = performance.now();
        zeile.bisBeginn = Math.round(beginnAt - gerufen);
        zeichne();
      });
      /*
       * ★★ DAS ENDE - über `end` UND `error`.
       *
       * Ein `cancel()` beendet die Ansage je nach Engine über das eine oder das
       * andere Ereignis; wer nur auf `end` hört, verliert am iPad gerade die
       * abgeschnittenen Zeilen - also genau die, um die es geht.
       *
       * ⚠️ `dauerVoll` wird am ABBRUCH entschieden, nicht am Ereignisnamen:
       * Lief nach dem Sprechbeginn ein `cancel()`, war es ein Schnitt. Die
       * Utterance-Ereignisse selbst nennt `voice.ts` ausdrücklich unzuverlässig
       * - der Abbruch dagegen ist gemessen, wir haben ihn selbst gehängt.
       */
      const beenden = () => {
        if (beginnAt === null || zeile.dauer !== null) return;
        zeile.dauer = Math.round(performance.now() - beginnAt);
        // Zwei Bedingungen: kein Abbruch dazwischen UND wirklich gesprochen.
        // Die zweite fehlte in der ersten Fassung - siehe `dauerVoll`.
        zeile.dauerVoll = letzterAbbruch < beginnAt && zeile.dauer >= STUMM_MS;
        zeichne();
      };
      u.addEventListener("end", beenden);
      u.addEventListener("error", beenden);
      zeilen.push(zeile);
      if (zeilen.length > MAX_ZEILEN) zeilen.shift();
      zeichne();
      return originalSpeak(u);
    };
  }

  const kasten = baueAnzeige();
  document.body.appendChild(kasten);
  zeichne();

  return () => {
    aktiv = false;
    document.removeEventListener("keydown", aufAnschlag, true);
    if (synth && originalSpeak) synth.speak = originalSpeak;
    if (synth && originalCancel) synth.cancel = originalCancel;
    kasten.remove();
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   DIE ANZEIGE - eigenes DOM, damit sie den Baum des Trainers nicht berührt

   ★ Sie hängt UNTEN und nimmt den Fokus NIE von selbst. Wer misst, tippt -
     ein Kasten, der den Fokus zieht, hätte die Messung verfälscht, die er
     anzeigen soll.
   ══════════════════════════════════════════════════════════════════════════ */
let leibRef: HTMLElement | null = null;
let berichtRef: HTMLTextAreaElement | null = null;

function baueAnzeige(): HTMLElement {
  const kasten = document.createElement("section");
  kasten.setAttribute("aria-label", "Ansage-Messung");
  kasten.style.cssText =
    "position:fixed;left:0;right:0;bottom:0;z-index:9999;max-height:44vh;overflow:auto;" +
    "background:Canvas;color:CanvasText;border-top:3px solid currentColor;padding:.5rem .7rem;" +
    "font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;";

  const kopf = document.createElement("p");
  kopf.style.cssText = "margin:0 0 .3rem;font-weight:700;";
  kopf.textContent = "Ansage-Messung - Anschlag bis Sprechbeginn (im echten Trainer)";
  kasten.appendChild(kopf);

  const leib = document.createElement("div");
  leib.setAttribute("role", "status");
  leib.setAttribute("aria-live", "off"); // NICHT vorlesen - das wäre die dritte Stimme
  kasten.appendChild(leib);
  leibRef = leib;

  const bericht = document.createElement("textarea");
  bericht.readOnly = true;
  bericht.setAttribute("aria-label", "Bericht der Ansage-Messung");
  bericht.style.cssText =
    "width:100%;min-height:6rem;margin-top:.4rem;font:inherit;" +
    "background:Canvas;color:CanvasText;border:2px solid currentColor;border-radius:8px;padding:.4rem;";
  kasten.appendChild(bericht);
  berichtRef = bericht;

  const reihe = document.createElement("p");
  reihe.style.cssText = "margin:.3rem 0 0;display:flex;gap:.4rem;flex-wrap:wrap;";
  reihe.appendChild(knopf("Bericht markieren", () => {
    bericht.focus();
    bericht.select();
  }));
  reihe.appendChild(knopf("Messung zurücksetzen", () => {
    zeilen = [];
    letzterAnschlag = null;
    zeichne();
  }));
  kasten.appendChild(reihe);

  return kasten;
}

function knopf(text: string, tu: () => void): HTMLButtonElement {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = text;
  b.style.cssText =
    "font:inherit;min-height:44px;padding:.4rem .8rem;border:2px solid currentColor;" +
    "border-radius:8px;background:transparent;color:inherit;";
  b.addEventListener("click", tu);
  return b;
}

/** Der Mittelwert, der bei Ausreissern nicht lügt. */
function mitte(werte: number[]): number | null {
  if (!werte.length) return null;
  const s = [...werte].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

/**
 * ★★★★ WAS BEIM MESSEN EINGESTELLT WAR - vom Bericht selbst festgehalten.
 *
 * Bis zum 04.09.2026 stand am Ende des Berichts „Vorlese-Umfang und VoiceOver
 * bitte von Hand ergaenzen." Genau daran ist der erste Lauf gescheitert: Auf
 * die Frage, was eingestellt war, konnte Johannes nur „weiss ich nicht mehr"
 * antworten - und ohne diese Auskunft sagt keine Zeitmessung, WAS da so lange
 * gedauert hat. Ob je Anschlag ein Buchstabe oder ein ganzes Wort gesprochen
 * wird, ist der Unterschied zwischen 300 und 800 ms.
 *
 * Eine Angabe, die von Hand nachgetragen werden muss, wird irgendwann nicht
 * nachgetragen. Das Werkzeug kann sie selbst lesen - also liest es sie selbst.
 *
 * ⚠️ VoiceOver bleibt von Hand: Ein Screenreader ist aus dem Browser nicht
 * abfragbar ([[reference_screenreader_nicht_abfragbar]]). Lieber eine ehrlich
 * offene Zeile als eine geratene.
 */
function einstellungZeile(): string {
  try {
    const v = useVoice.getState();
    const buchstaben = useTypingA11y.getState().tastenAnsage === "naechste";
    const umfang = [
      buchstaben ? "Buchstaben" : null,
      v.readWords ? "Woerter" : null,
      v.readSentences ? "Saetze" : null,
    ].filter(Boolean);
    return (
      `Vorlesen: ${v.enabled ? "AN" : "aus"}` +
      ` · Umfang: ${umfang.length ? umfang.join(" + ") : "nichts"}` +
      ` · Tempo: ${v.rate}` +
      ` · Sprache: ${vorleseSprache()}`
    );
  } catch {
    return "Vorlese-Einstellung nicht lesbar";
  }
}

function zeichne(): void {
  if (!leibRef || !berichtRef) return;
  const gemessen = zeilen.filter((z) => z.bisAufruf !== null);
  const kette = mitte(gemessen.map((z) => z.bisAufruf as number));
  const engine = mitte(
    zeilen.filter((z) => z.bisBeginn !== null).map((z) => z.bisBeginn as number),
  );
  const fehlstarts = zeilen.filter((z) => z.nieBegonnen).length;
  const gesamt = gemessen
    .filter((z) => z.bisBeginn !== null)
    .map((z) => (z.bisAufruf as number) + (z.bisBeginn as number));
  const gesamtMitte = mitte(gesamt);

  /*
   * ★★★★★ DIE ZWEI TOEPFE, um die es geht: mit Abbruch und ohne.
   * Steht der eine bei 4 ms und der andere bei 600 ms, ist der Abbruch die
   * Ursache - und dann lohnt es, ihn zu vermeiden. Sind beide gleich, liegt es
   * an etwas anderem, und ein Umbau am Abbruch waere verschwendet.
   */
  const mitAbbruch = zeilen.filter((z) => z.nachAbbruch && z.bisBeginn !== null);
  const ohneAbbruch = zeilen.filter((z) => !z.nachAbbruch && z.bisBeginn !== null);
  const engineMit = mitte(mitAbbruch.map((z) => z.bisBeginn as number));
  const engineOhne = mitte(ohneAbbruch.map((z) => z.bisBeginn as number));
  // `cancelIfBusy` bricht nur ab, wenn die Engine sprach - die Zahl der
  // Abbrueche IST damit die Zahl der Ansagen, die eine laufende abgeschnitten
  // haben. Kein zweiter Messwert noetig, und keiner, der luegen kann.
  const abgeschnitten = zeilen.filter((z) => z.nachAbbruch).length;

  const kopfzeile =
    `Ansagen: ${zeilen.length} · zugeordnet: ${gemessen.length}` +
    ` · unsere Kette (Anschlag→speak): ${kette === null ? "-" : kette + " ms"}` +
    ` · Gerät (speak→Beginn): ${engine === null ? "-" : engine + " ms"}` +
    ` · zusammen: ${gesamtMitte === null ? "-" : gesamtMitte + " ms"}` +
    (fehlstarts ? ` · FEHLSTARTS: ${fehlstarts}` : "");
  const abbruchzeile =
    `Hat eine laufende Ansage abgeschnitten: ${abgeschnitten} von ${zeilen.length}` +
    ` · Sprechbeginn NACH Abbruch: ${engineMit === null ? "-" : engineMit + " ms"} (${mitAbbruch.length})` +
    ` · OHNE Abbruch: ${engineOhne === null ? "-" : engineOhne + " ms"} (${ohneAbbruch.length})`;

  /*
   * ★★★★★ DIE FLUSS-ZEILE - passt die Stimme in den Tipprhythmus?
   *
   * Johannes am 04.09.2026: *„mit Vorlesen kann man nicht üben, jeder nächste
   * Buchstabe dauert ewig, man kommt nicht in einen Schreibfluss."*
   *
   * Diese Zeile stellt die beiden Zahlen nebeneinander, die darüber
   * entscheiden, und rechnet den Vergleich aus, damit ihn niemand im Kopf
   * machen muss:
   *
   *   Sprechdauer + Atempause   gegen   Abstand zweier Anschläge
   *
   * Ist die linke Seite grösser, wird JEDE Ansage abgeschnitten - dann ist die
   * Stimme eine Geschwindigkeitsgrenze, und daran ändert kein Umbau am Abbruch
   * etwas. Nur ein kürzerer Text, ein höheres Tempo oder eine seltenere Ansage.
   *
   * ⚠️ Gerechnet wird mit `dauerVoll` - den Ansagen, die AUSGEREDET haben.
   * Eine abgeschnittene misst den Schnitt und würde die Dauer umso kürzer
   * erscheinen lassen, je schneller getippt wurde: ein Wert, der sein eigenes
   * Gegenteil belegt.
   */
  const vollGesprochen = zeilen.filter((z) => z.dauerVoll && z.dauer !== null);
  const dauerMitte = mitte(vollGesprochen.map((z) => z.dauer as number));
  const rhythmus = mitte(
    zeilen.filter((z) => z.abstand !== null).map((z) => z.abstand as number),
  );
  const ATEMPAUSE_MS = 90; // CANCEL_GAP_MS aus voice.ts
  const urteil =
    dauerMitte === null || rhythmus === null
      ? "noch nicht entschieden - es fehlt eine ausgeredete Ansage oder ein zweiter Anschlag"
      : dauerMitte + ATEMPAUSE_MS > rhythmus
        ? `NEIN - die Ansage braucht ${dauerMitte + ATEMPAUSE_MS} ms, der Anschlag kommt nach ${rhythmus} ms`
        : `ja - die Ansage ist ${rhythmus - dauerMitte - ATEMPAUSE_MS} ms vor dem nächsten Anschlag fertig`;
  /*
   * ⚠️ Die verschluckten Ansagen werden nicht weggerechnet, sondern GEZÄHLT.
   * Eine Ansage, die endet, ohne gesprochen zu haben, aus der Sprechdauer zu
   * nehmen ist richtig - sie dann auch aus dem Bericht zu nehmen wäre es nicht:
   * Sie ist genau der Befund, um den es seit der Nacht geht.
   */
  const stumm = zeilen.filter((z) => z.dauer !== null && z.dauer < STUMM_MS).length;
  const flusszeile =
    `Sprechdauer (nur gesprochene): ${dauerMitte === null ? "-" : dauerMitte + " ms"} (${vollGesprochen.length})` +
    (stumm ? ` · STUMM BEENDET (unter ${STUMM_MS} ms, nie gesprochen): ${stumm}` : "") +
    ` · Tipprhythmus: ${rhythmus === null ? "-" : rhythmus + " ms"}` +
    ` · passt die Stimme hinein? ${urteil}`;

  const letzte = zeilen.slice(-8).reverse();
  leibRef.textContent = kopfzeile + "\n" + abbruchzeile + "\n" + flusszeile;
  const liste = document.createElement("div");
  liste.style.cssText = "margin-top:.25rem;white-space:pre;";
  liste.textContent = letzte
    .map(
      (z) =>
        `  ${z.taste.padEnd(10)} nach ${String(z.abstand ?? "-").padStart(5)} ms` +
        ` → ${String(z.bisAufruf ?? "-").padStart(5)} ms` +
        ` → ${z.nieBegonnen ? "NIE BEGONNEN" : String(z.bisBeginn ?? "…").padStart(4) + " ms"}` +
        ` → ${z.dauer === null ? "  …  " : String(z.dauer).padStart(4) + " ms"}${z.dauerVoll ? " " : "×"}` +
        ` ${z.nachAbbruch ? "ABBR" : "    "}` +
        `  „${z.text}“`,
    )
    .join("\n");
  leibRef.appendChild(liste);

  berichtRef.value = [
    "ANSAGE-MESSUNG IM ECHTEN TRAINER",
    "Zeit: " + new Date().toISOString(),
    "Browser: " + navigator.userAgent,
    "Geraeteart: " +
      ((navigator.maxTouchPoints || 0) > 0
        ? "Beruehrungsgeraet (" + navigator.maxTouchPoints + " Punkte)"
        : "kein Beruehrungsgeraet"),
    einstellungZeile(),
    "",
    kopfzeile,
    abbruchzeile,
    flusszeile,
    "",
    "ABBR = hat eine laufende Ansage abgeschnitten (cancel ging voraus)",
    "x hinter der Dauer = diese Ansage hat nicht ausgeredet - abgeschnitten oder",
    "  stumm beendet. Sie zaehlt nicht fuer die Sprechdauer: sie misst den Schnitt",
    "  bzw. gar nichts, nicht den Text.",
    "Taste       Abstand   Anschlag→speak   speak→Beginn   Dauer   Lage   Text",
    ...zeilen.map(
      (z) =>
        `${z.taste.padEnd(11)} ${String(z.abstand ?? "-").padStart(5)} ms  ` +
        `${String(z.bisAufruf ?? "-").padStart(8)} ms   ` +
        `${z.nieBegonnen ? "NIE BEGONNEN" : String(z.bisBeginn ?? "-").padStart(6) + " ms"}   ` +
        `${String(z.dauer ?? "-").padStart(5)} ms${z.dauerVoll ? " " : "x"}  ` +
        `${z.nachAbbruch ? "ABBR" : "    "}   ${z.text}`,
    ),
    "",
    "VoiceOver bitte von Hand ergaenzen - ein Screenreader ist aus dem Browser",
    "nicht abfragbar. Der Vorlese-Umfang steht oben, er wird selbst gemessen.",
  ].join("\n");
}
