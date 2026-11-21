/**
 * ★★★ DER SPRACHBEREICH VON TASTENFLOW - der EINE Ort, an dem die
 * Bedienungssprache eingehängt wird (EN0, 18.09.2026).
 * ============================================================================
 *
 * Auftrag Johannes 18.09.2026: *„die komplette Übersetzung auf Englisch. die
 * gesamte Oberfläche, Bedienung, Popups, Handbücher, Hilfen,
 * Datenschutzerklärungen usw."* - dafür muss JEDE Seite, die ein
 * Tastenflow-Mensch erreicht, dieselbe Sprache kennen. Bis EN0 kannte sie nur
 * die Übungsseite (Provider in `TippenTrainerPage`); schon „Meine Klassen"
 * wäre deutsch geblieben, und jede Navigation hätte den Provider neu gebaut.
 *
 * ── WO ER HÄNGT, UND WARUM GENAU DORT ──────────────────────────────────────
 * In `Root` (`src/App.tsx`), ÜBER dem `<div key={location.key}>`. `Root`
 * baut jede Seite bei jeder Navigation neu auf (Fehlerklasse K33); ein
 * Provider darunter verlöre seinen Zustand bei jedem Wechsel. Darüber bleibt
 * er für die ganze Sitzung derselbe - er liest die gemerkte Wahl,
 * `?bedienung=` und die Merker eines bekannten Geräts genau einmal, beim
 * Laden der App.
 *
 * ── WELCHE ADRESSEN ER ABDECKT (Stand EN0) ─────────────────────────────────
 *
 *  A · TASTENFLOW SELBST - immer, unter jedem Rechnernamen
 *      `/programme/tastenflow`             der Trainer mit allem, was darin
 *                                          aufgeht: Hilfe (Alt + H), Zahnrad,
 *                                          Statistik, Wortspiele, Geschichten,
 *                                          Lektionen, Abzeichen-Regal,
 *                                          Expedition/Eisschollen, Tippchallenge,
 *                                          Klassenmatch, Einrichtung, Anmelde-
 *                                          Fenster, Tasten erkunden/finden
 *      `/` unter tastenflow.org            derselbe Trainer (`StartSeite`)
 *      `/programme/tippen`                 Alt-Adresse, leitet auf den Trainer
 *      `/lernwerkstatt/tippen/klasse`      Meine Klassen, aus Tastenflow
 *      `/meine-klasse?app=tippen`          Meine Klassen (tastenflow.org-Form)
 *      `/meine-klasse/verwalten?app=tippen`  Kinder und Zugänge
 *      `/lernwerkstatt/klasse?app=tippen`  Alt-Adresse von Meine Klassen
 *      `/meine-klasse`, `/meine-klasse/verwalten`, `/lernwerkstatt/klasse`
 *                                          OHNE `app=` - nur unter
 *                                          tastenflow.org (sonst Gruppe B)
 *
 *  B · GEMEINSAME SEITEN - wenn man unter tastenflow.org ist ODER in diesem
 *      Fenster zuletzt in Tastenflow war (aus Tastenflow hergekommen)
 *      `/datenschutz` · `/impressum` · `/barrierefreiheit`   Rechtliches
 *      `/unterstuetzen`                    Spendenseite (Fusszeile)
 *      `/unterstuetzen/danke`              Dankesseite nach einer Spende
 *                                          (neuer Tab: die Sprache bringt
 *                                          dort zur Not der Merker mit)
 *      `/lernwerkstatt/konto`              Meine Zugangsdaten (Selbstlernende)
 *      `/lernprogramm-passwort`            Passwort vergessen / neu setzen
 *      `/lernprogramm-bestaetigen`         Bestätigungs-Links aus den Mails
 *      `/lernwerkstatt-einladung`          Einladung als Co-Lehrkraft
 *      `/meine-klasse` ohne `app=` unter weingartner.org
 *
 *  C · ALLES ANDERE - nie: die anderen Programme (Punktgenau, Klangpunkte,
 *      »Im Griff«, Mathecoach, Hörbuch-Studio, die Simulationen), ihre
 *      Klassenseiten (`app=braille` usw.), die Lernwerkstatt-Übersicht
 *      `/lernwerkstatt`, `/` unter weingartner.org, `/programme`, die
 *      Uni-Welt (`/kurs…`, `/login`, `/admin` …) und die Fehlerseite `*`.
 *      Dort liefert der Provider exakt den Wert „ohne Provider": Deutsch,
 *      kein Schalter, `<html lang>` unberührt.
 *
 * ⚠️ Wer eine NEUE Seite baut, die Tastenflow-Menschen erreichen, trägt sie
 *    hier ein (A oder B) - sonst bleibt sie in der englischen Bedienung still
 *    deutsch. Der Wächter: `tests/tastenflow-sprachbereich.test.tsx`.
 * ⚠️ Gruppe B ist bewusst „zuletzt in Tastenflow", nicht „kam direkt aus
 *    Tastenflow": Wer aus Tastenflow ins Impressum und von dort in den
 *    Datenschutz geht, bleibt in seiner Sprache.
 *
 * ── WAS NICHT HIER ENTSCHIEDEN WIRD ─────────────────────────────────────────
 * WELCHE Sprache gilt (gemerkte Wahl, bekanntes Gerät, Sprache des Browsers) -
 * das steht in `lib/bedienSprache/sprache.ts`. Hier steht nur, WO sie gilt.
 * Seit 19.09.2026 gilt sie für jeden, der Sprachschalter steht auf jeder
 * Tastenflow-Seite mit Kopfzeile (Übungsseite und Meine Klassen).
 */
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BedienSpracheProvider, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import {
  KLASSE_VERWALTEN_PFAD,
  MEINE_KLASSE_PFAD,
  MEINE_KLASSE_PFAD_ALT,
  TASTENFLOW_PFAD,
  hierIstTastenflow,
} from "@/lib/adressen";
import {
  GERUEST_EINSTIEGSPFADE,
  geruestLehrgangProben,
  franzoesischLehrgangProbeAn,
  italienischLehrgangProbeAn,
  polnischLehrgangProbeAn,
  spanischLehrgangProbeAn,
  tschechischLehrgangProbeAn,
  tuerkischLehrgangProbeAn,
} from "@/lib/typing/lehrgangSchalter";
// ⚠️ Stimme und Konto-Anbindung von Tastenflow werden hier NUR per `import()`
// geholt (seit 28.09.2026): Dieser Bereich hängt über JEDER Seite der Plattform.
// Statisch importiert, zögen sie den halben Tastenflow-Code samt allen Texten
// in den gemeinsamen Kern, den jede Seite jeder App lädt - und jede
// Tastenflow-Änderung liesse dann alle neu laden (scripts/buendel-aufteilung.ts).
// Auf einer Tastenflow-Seite sind beide ohnehin schon geladen.

/** Der Programm-Schlüssel von Tastenflow (`ALL_PROGRAMS`) - NIE ändern. */
const TASTENFLOW_SCHLUESSEL = "tippen";

/** Gruppe A ohne Rechnernamen-Frage: die eigenen Pfade des Trainers. */
const TRAINER_PFADE: readonly string[] = [TASTENFLOW_PFAD, "/programme/tippen"];

/** Die englische Einstiegsadresse - wie die Wurzel nur unter tastenflow.org Tastenflow. */
const ENGLISCH_PFAD = "/en";

/** Die französische Einstiegsadresse (E11c, 26.09.2026) - dieselbe Regel wie `/en`. */
const FRANZOESISCH_PFAD = "/fr";

/** Die spanische Einstiegsadresse (scharf seit 27.09.2026) - dieselbe Regel wie `/en`/`/fr`. */
const SPANISCH_PFAD = "/es";

/** ★ 10.10.2026: die Einstiegsadressen der vier neuen Sprachen - dieselbe Regel. */
// ★ G2-NEUN (25.10.2026): dazu die neun Adressen des Gerüsts (`/pt-br` ⇒ „br") - die Bedienung stellen sie nur mit
// dem Schalter der Sprache um (`adressWahlLesen`).
const NEUE_SPRACH_PFADE: readonly string[] = ["/it", "/pl", "/tr", "/cs", ...Object.values(GERUEST_EINSTIEGSPFADE)];

/** Die Klassenseite - welche App sie meint, sagt `app=` (oder der Pfad). */
const KLASSEN_PFADE: readonly string[] = [
  MEINE_KLASSE_PFAD,
  KLASSE_VERWALTEN_PFAD,
  MEINE_KLASSE_PFAD_ALT,
];

/** Gruppe B: Seiten, die allen Apps gehören - sie folgen der Herkunft. */
export const GEMEINSAME_PFADE: readonly string[] = [
  "/datenschutz",
  "/impressum",
  "/barrierefreiheit",
  "/unterstuetzen",
  "/unterstuetzen/danke",
  "/lernwerkstatt/konto",
  "/lernprogramm-passwort",
  "/lernprogramm-bestaetigen",
  "/lernwerkstatt-einladung",
];

export type Bereichsart = "tastenflow" | "gemeinsam" | "fremd";

/**
 * Zu wem gehört eine Adresse? Rein und ohne Browser prüfbar.
 *
 * @param pfad          `location.pathname` (Gross-/Kleinschreibung und ein
 *                      Schrägstrich am Ende zählen nicht - wie beim Router)
 * @param suche         `location.search` (für `app=`)
 * @param aufTastenflow läuft die Seite unter tastenflow.org?
 */
export function bereichsart(pfad: string, suche: string, aufTastenflow: boolean): Bereichsart {
  const p = pfad.toLowerCase().replace(/\/+$/, "") || "/";
  if (p === "/" || p === ENGLISCH_PFAD || p === FRANZOESISCH_PFAD || p === SPANISCH_PFAD ||
    NEUE_SPRACH_PFADE.includes(p))
    return aufTastenflow ? "tastenflow" : "fremd";
  if (TRAINER_PFADE.includes(p)) return "tastenflow";

  // `/lernwerkstatt/<programm>/klasse` - das Programm steht im Pfad.
  const imPfad = /^\/lernwerkstatt\/([^/]+)\/klasse$/.exec(p);
  if (imPfad) return imPfad[1] === TASTENFLOW_SCHLUESSEL ? "tastenflow" : "fremd";

  if (KLASSEN_PFADE.includes(p)) {
    const app = new URLSearchParams(suche).get("app");
    if (app) return app === TASTENFLOW_SCHLUESSEL ? "tastenflow" : "fremd";
    return aufTastenflow ? "tastenflow" : "gemeinsam";
  }
  if (GEMEINSAME_PFADE.includes(p)) return "gemeinsam";
  return "fremd";
}

/**
 * Die Ansage des Sprachschalters mit der Stimme von Tastenflow, in der
 * ZIELSPRACHE (sonst läse eine deutsche Stimme „Buttons and menus …").
 * `speakUi` achtet den Vorlesen-Schalter selbst.
 */
function sprichBedienung(satz: string, sprache: BedienSprache) {
  void import("@/lib/typing/voice")
    .then(({ speakUi }) => speakUi(satz, undefined, undefined, sprache))
    .catch(() => {});
}

/**
 * ★ EN9 (19.09.2026): Die neue Sprache am ANGEMELDETEN Konto merken - danach
 * richten sich die Mails an dieses Konto (Wochenbericht, Tippchallenge,
 * Konto-Mails; `pocketbase/pb_hooks/tt_mail_texte_lib.pb.js`). Ohne Anmeldung
 * tut es nichts. EIN kleiner Aufruf, dessen Scheitern niemand merkt: Die
 * Bedienung ist schon umgeschaltet, und eine Mail in der alten Sprache ist
 * kein Grund für eine Fehlermeldung.
 */
function merkeAmKonto(sprache: BedienSprache) {
  void import("@/lib/typing/backend")
    .then(({ typingBackend }) => {
      try {
        void typingBackend()
          .merkeBedienSprache?.(sprache)
          ?.catch(() => {});
      } catch {
        /* kein Backend (Test ohne Konten) - nichts zu merken */
      }
    })
    .catch(() => {});
}

/**
 * ★ EN10 (19.09.2026, im Browser gefunden): DER TITEL DES BROWSER-TABS.
 *
 * Den setzt nicht die App, sondern der Server (`link_previews_lib.pb.js`,
 * unter tastenflow.org „Tastenflow — 10-Fingersystem barrierefrei lernen")
 * bzw. `index.html` - beide deutsch. In der englischen Bedienung stand er
 * darum deutsch im Tab, und NVDA zeigt ihn als Fokuskontext auch auf der
 * Braillezeile vor der Übungszeile (Übergabe 09.09., §4a) - dort mit
 * `<html lang="en">`, also in englischer Aussprache.
 *
 * Englisch: der Titel unten (Glossar §3.12); zurück auf Deutsch kommt GENAU
 * der Titel wieder, der vorher dastand. Solange die Bedienung deutsch ist,
 * wird `document.title` nie angefasst.
 */
export const TAB_TITEL_EN = "Tastenflow - learn touch typing, accessible to all";

/**
 * ★ E11a-5 (26.09.2026): der Tab-Titel der französischen Bedienung - bis
 * dahin blieb dort der DEUTSCHE Titel stehen (die Weiche prüfte nur „en"), mit
 * `<html lang="fr">` also in französischer Aussprache auf der Braillezeile.
 */
export const TAB_TITEL_FR = "Tastenflow - apprendre la frappe à dix doigts, accessible à tout le monde";

/** ★ ES-O (27.09.2026): der Tab-Titel der spanischen Bedienung. */
export const TAB_TITEL_ES = "Tastenflow - aprende mecanografía, accesible para todo el mundo";

/** ★ O-IT (02.10.2026): der Tab-Titel der italienischen Bedienung (Glossar Regel 4: nie „alla cieca"). */
export const TAB_TITEL_IT = "Tastenflow - imparare la dattilografia a dieci dita, accessibile a tutti";

/** ★ O-PL (02.10.2026): der Tab-Titel der polnischen Bedienung (Glossar §2.11). */
export const TAB_TITEL_PL = "Tastenflow - nauka pisania dziesięcioma palcami, dostępna dla wszystkich";

/** ★ O-TR (02.10.2026): der Tab-Titel der türkischen Bedienung (Glossar §2.11, Name ohne Endung). */
export const TAB_TITEL_TR = "Tastenflow - on parmak klavye, herkes için erişilebilir";

/** ★ O-CS (03.10.2026): der Tab-Titel der tschechischen Bedienung (Glossar Regel 4: nie „naslepo"). */
export const TAB_TITEL_CS = "Tastenflow - psaní všemi deseti, přístupné pro všechny";

/** ★ O2-SONST (30.10.2026): die Tab-Titel der neun. */
export const TAB_TITEL_BG = "Tastenflow - писане с десет пръста, достъпно за всички";
export const TAB_TITEL_EL = "Tastenflow - δακτυλογράφηση με δέκα δάχτυλα, προσβάσιμη σε όλους";
export const TAB_TITEL_HU = "Tastenflow - tízujjas gépelés, mindenkinek akadálymentesen";
export const TAB_TITEL_NL = "Tastenflow - met tien vingers leren typen, toegankelijk voor iedereen";
export const TAB_TITEL_PT = "Tastenflow - aprender a escrever com os dez dedos, acessível a todas as pessoas";
export const TAB_TITEL_BR = "Tastenflow - digitação com os dez dedos, acessível para todas as pessoas";
export const TAB_TITEL_RO = "Tastenflow - scriere cu zece degete, accesibilă tuturor";
export const TAB_TITEL_SV = "Tastenflow - lär dig skriva med alla tio fingrar, tillgängligt för alla";
export const TAB_TITEL_UK = "Tastenflow - десятипальцевий метод друку, доступний для всіх";

/** Der Titel je Bedienungssprache - `null` heisst: der Titel von Server/`index.html` bleibt. */
const TAB_TITEL: Record<BedienSprache, string | null> = {
  de: null,
  en: TAB_TITEL_EN,
  fr: TAB_TITEL_FR,
  es: TAB_TITEL_ES,
  it: TAB_TITEL_IT,
  pl: TAB_TITEL_PL,
  tr: TAB_TITEL_TR,
  // ★ O-CS (03.10.2026).
  cs: TAB_TITEL_CS,
  bg: TAB_TITEL_BG,
  el: TAB_TITEL_EL,
  hu: TAB_TITEL_HU,
  nl: TAB_TITEL_NL,
  pt: TAB_TITEL_PT,
  br: TAB_TITEL_BR,
  ro: TAB_TITEL_RO,
  sv: TAB_TITEL_SV,
  uk: TAB_TITEL_UK,
};

function TabTitel() {
  const { sprache } = useBedienSprache();
  const vorher = useRef<string | null>(null);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const titel = TAB_TITEL[sprache];
    if (titel !== null) {
      if (vorher.current === null) vorher.current = document.title;
      document.title = titel;
    } else if (vorher.current !== null) {
      document.title = vorher.current;
      vorher.current = null;
    }
  }, [sprache]);
  return null;
}

export function TastenflowSprachBereich({ children }: { children: ReactNode }) {
  const { pathname, search } = useLocation();
  const aufTastenflow = hierIstTastenflow();
  const art = bereichsart(pathname, search, aufTastenflow);

  /*
   * Die zuletzt besuchte App dieses Fensters - für Gruppe B. Nachgeführt
   * WÄHREND des Renderns (Reacts Muster „Zustand aus dem vorigen Rendern"):
   * Über einen Effekt käme der Wert einen Durchlauf zu spät, und eine
   * gemeinsame Seite stünde einen Augenblick in der falschen Sprache.
   */
  const [zuletzt, setZuletzt] = useState<Bereichsart | null>(null);
  if (art !== "gemeinsam" && art !== zuletzt) setZuletzt(art);

  const aktiv =
    art === "tastenflow" || (art === "gemeinsam" && (aufTastenflow || zuletzt === "tastenflow"));

  // ★ E2b (25.09.2026, Bauplan D9/§9.3): EINMAL gelesen, wie `lernwegProbe` in
  // `TippenTrainerPage.tsx` - derselbe Grund: der Adress-Zusatz
  // `?franzoesisch-lehrgang=` steht nur in der ersten Adresse, ein Wert, der
  // mitten in der Sitzung von selbst kippt, wäre ein Schalter, den niemand
  // gedrückt hat.
  const franzoesischAn = useMemo(() => franzoesischLehrgangProbeAn(), []);
  // ★ ES-F2 (27.09.2026): derselbe Gedanke, für den spanischen Lehrgang.
  const spanischAn = useMemo(() => spanischLehrgangProbeAn(), []);
  // ★ 10.10.2026 (Freigabe): derselbe Gedanke für it/pl/tr/cs.
  const neueAn = useMemo(
    () => ({
      it: italienischLehrgangProbeAn(),
      pl: polnischLehrgangProbeAn(),
      tr: tuerkischLehrgangProbeAn(),
      cs: tschechischLehrgangProbeAn(),
      // ★ G2-NEUN (25.10.2026): die neun Schalter des Gerüsts (Vorgabe aus).
      ...geruestLehrgangProben(),
    }),
    [],
  );

  return (
    <BedienSpracheProvider
      aktiv={aktiv}
      sprich={sprichBedienung}
      beimWechsel={merkeAmKonto}
      franzoesischAn={franzoesischAn}
      spanischAn={spanischAn}
      neueAn={neueAn}
    >
      <TabTitel />
      {children}
    </BedienSpracheProvider>
  );
}
