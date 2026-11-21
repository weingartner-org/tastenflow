/**
 * Die EINE Kopfzeile aller vier Lernprogramme (Tastenflow · Punktgenau ·
 * Klangpunkte · im Griff) — Neugestaltung 09.08.2026 nach Johannes' Vorgabe.
 *
 * Vorher hatte jede App ihre eigene, handgebaute Zeile: mal stand „Abmelden"
 * links, mal rechts, mal hieß der Kürzel-Knopf „Kurzt.", mal „Kürzel"; Name und
 * Klasse standen in einer zweiten Zeile darunter, und in jeder App an einer
 * anderen Stelle. Jetzt gibt es EINE Reihenfolge, überall gleich
 * ([[feedback_platform_parity]]):
 *
 *   Sensorik-Logo · App-Name … Hilfe · Kurztasten · Glocke · Einstellungen
 *   · Konto ┊ Farbe · Vorlesen
 *
 * ★★★ SCHLANKER UND EINHEITLICH (30.08.2026, Johannes). Vier Änderungen, alle
 *   an derselben Reihe:
 *
 *   1. „❓ Hilfe" und „⚙ Einstellungen" sind runde Sinnbild-Knöpfe ohne Wort.
 *      Nicht wegen des Platzes, sondern wegen der FARBE: `❓` und `⚙` sind
 *      Emoji und malen sich in ihrer eigenen Farbe - `❓` gemessen in
 *      rgb(224,0,0) -, sie ignorieren alle sieben Kontrastmodi. Gemessen am
 *      30.08.2026 gegen den Untergrund: Schwarz auf Weiß 4,23:1 · Weiß auf
 *      Schwarz 4,17:1 · **Gelb auf Blau 2,05:1** - unter der 3:1-Schwelle von
 *      WCAG 1.4.11 für Bedien-Sinnbilder. Der Text daneben lag bei 7 bis 21:1.
 *      Als SVG in `currentColor` stimmt das Zeichen in jedem Modus - dieselbe
 *      Begründung, die beim Anmelden-Männchen weiter unten schon stand.
 *      ★ Am selben Tag, zweite Runde: auch „Kurztasten" wird rund und legt
 *      sein Wort ab. Es trägt die TASTENKAPPE „Alt" (am Mac ⌥), nicht ein
 *      „K" - denn direkt daneben steht der Knopf, der wirklich auf Alt + K
 *      hört.
 *      ★ Dritte Runde, derselbe Tag: der abgemeldete Konto-Knopf wird ein
 *      Kreis mit Männchen und heißt nur noch „Konto". Damit trägt KEIN Knopf
 *      dieser Reihe mehr ein Wort - sieben Kreise zu 36 px, jeder mit einem
 *      Zeichen in der Schriftfarbe, jeder mit einem `Tipp`. Die gemessene
 *      Umschaltung auf Symbole (25.08.) hatte damit nichts mehr zu tun und
 *      ist entfernt; die Begründung steht im Rumpf.
 *   2. Die Sinnbilder wachsen von ~16 px auf 22 px, der Knopf bleibt 36 px -
 *      größeres Zeichen, weniger Rand. Das gilt für ALLE runden Knöpfe der
 *      Reihe, auch Glocke und Konto-Zeichen, damit sie eine Familie sind.
 *   3. NEU: Farbschalter (Alt + K) und Vorlese-Schalter. Sie stehen als GRUPPE
 *      zusammen, durch einen dünnen senkrechten Strich von den übrigen
 *      abgesetzt: Hilfe, Kurztasten, Glocke, Einstellungen und Konto sind
 *      TÜREN - sie öffnen etwas. Farbe und Vorlesen sind SCHALTER - sie ändern
 *      sofort etwas. Zwei Sorten, die man nicht verwechseln soll.
 *   4. Jeder Knopf ohne sichtbares Wort trägt einen `Tipp` (siehe
 *      `src/components/Tipp.tsx`) - einen Hinweis, der auch BEI FOKUS
 *      erscheint. Der native `title` tut das nicht; er ist deshalb an genau
 *      diesen Knöpfen ersatzlos weg (beides zusammen läse eine Sprachausgabe
 *      doppelt vor).
 *
 * ★ Das ZAHNRAD kam am 22.08.2026 dazu (Charge „SCHLANK"): Es stand vorher in
 *   jeder App woanders — in »im Griff« als selbst gebauter Knopf ganz links,
 *   in „Tastenflow" in einer eigenen grauen Leiste UNTER der Kopfzeile, die
 *   vom Üben ablenkte. Jetzt zeichnet die Kopfzeile es, direkt links vom
 *   Konto-Zeichen, mit demselben Kürzel (Alt + O) in jeder App.
 *
 * ★ Der KONTO-Knopf ist ein rundes Zeichen mit dem ersten Buchstaben des Namens
 *   (bei Jano ein „J"). Er klappt eine Liste auf, in der ganz oben Name und
 *   Klasse stehen, darunter „Meine Statistik", bei Lehrkräften „Meine Klassen",
 *   und zuletzt „Abmelden". Damit verschwindet die zweite Zeile unter der
 *   Kopfzeile — der Name steht dort, wo man ihn sucht.
 *
 * ★★ Der Link „← Zur Lernwerkstatt" ist ERSATZLOS weg (Wunsch Johannes): Er
 *   sprang aus dem Programm heraus, mitten aus dem Üben. Wer wirklich hinaus
 *   will, klickt links oben auf „Sensorik" — das genügt.
 *
 * Barrierefreiheit: Die aufklappbare Liste ist bewusst KEIN `role="menu"`,
 * sondern ein schlichter Aufklapp-Schalter mit ganz normalen Knöpfen darin.
 * Ein echtes Menü verlangt Pfeiltasten-Steuerung; ein Kind mit Screenreader
 * kommt mit Tab und Enter zuverlässiger zurecht. Escape schließt und gibt den
 * Fokus an den Konto-Knopf zurück (K27), ein Klick daneben schließt ebenfalls.
 * Fokus per `setTimeout(0)` ([[feedback_fokus_pflicht_alle_apps]]).
 */
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { BetaMarke } from "@/components/BetaMarke";
import { Icon } from "@/components/Icon";
import { Tipp } from "@/components/Tipp";
import { MeldenMitBildKnopf } from "@/components/MeldenKuerzel";
import {
  RueckmeldungFenster,
  RueckmeldungKnopf,
} from "@/components/RueckmeldungKnopf";
import { LwMessageBell } from "@/components/lernwerkstatt/LwMessageBell";
import { hausApp, plattformStartHref } from "@/lib/adressen";
import { altAnzeige, ariaKuerzel, istMacSystem } from "@/lib/altTaste";
import {
  CONTRAST_MODES,
  CONTRAST_NAMEN_EN,
  CONTRAST_NAMEN_FR,
  CONTRAST_NAMEN_ES,
  CONTRAST_NAMEN_IT,
  CONTRAST_NAMEN_PL,
  CONTRAST_NAMEN_TR,
  CONTRAST_NAMEN_CS,
  CONTRAST_NAMEN_BG,
  CONTRAST_NAMEN_EL,
  CONTRAST_NAMEN_HU,
  CONTRAST_NAMEN_NL,
  CONTRAST_NAMEN_PT,
  CONTRAST_NAMEN_BR,
  CONTRAST_NAMEN_RO,
  CONTRAST_NAMEN_SV,
  CONTRAST_NAMEN_UK,
  contrastMuster,
  useContrast,
  type ContrastMode,
} from "@/lib/contrast";
import { mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { mitRueckfallEn } from "../lib/typing/sprachRegister";

/** Das Nötigste über das angemeldete Konto — jede App hat ihren eigenen Typ. */
export interface KopfKonto {
  id: string;
  name: string;
  /** Klassencode (Kinder mit Klasse). */
  classCode?: string;
  /** Lehrkraft? Dann steht „(Lehrkraft)" statt einer Klasse. */
  istLehrkraft?: boolean;
  /**
   * SELBSTLERNEND: Dieses Konto hat sich SELBST angelegt - mit einer echten
   * E-Mail-Adresse, ohne Klasse und ohne Lehrkraft (`selfManaged` in
   * `tt_pupils`, siehe `lib/typing/account.ts`).
   *
   * Die Kopfzeile braucht das für genau eine Entscheidung: WO „Melden" steht
   * (Johannes 02.09.2026). Lehrkraft ⇒ Schalter in der Werkzeug-Reihe ·
   * selbstlernend ⇒ Eintrag im Konto-Menü über „Abmelden" · Kind einer Klasse
   * ⇒ gar nicht. Die Begründung steht in `RueckmeldungKnopf.tsx`.
   */
  selbstlernend?: boolean;
}

export interface AppKopfzeileProps {
  /** Name des Programms — steht neben dem Sensorik-Zeichen. */
  titel: string;
  /**
   * Zusätzliche Klasse für den sichtbaren Titel (Lexami 14.11.2026: der Name steht immer in
   * Fredoka, der Schrift des Zeichens - egal, welche Schrift jemand für die App wählt).
   * Ohne die Prop bleibt alles wie bisher.
   */
  titelKlasse?: string;
  /**
   * App-Zeichen (Logo) — steht unmittelbar VOR dem Titel (30.08.2026, zuerst
   * für Tastenflow). Optional und bewusst als fertiges Element: Die App
   * entscheidet selbst, ob ihr Zeichen dekorativ ist oder eine
   * Bildbeschreibung trägt. Ohne `zeichen` ändert sich nichts — die anderen
   * Apps sehen aus wie bisher, bis sie ihr eigenes Zeichen mitbringen.
   */
  zeichen?: ReactNode;
  /**
   * ★ Ohne den Heim-Verweis „Sensorik" links oben (Johannes 28.09.2026: „der
   * Sensorik-Link soll nur in der deutschen URL zu sehen sein … die Seite
   * weingartner.org gibt es nur auf Deutsch"). Optional, Vorgabe `false`: Die
   * anderen Apps bleiben unverändert; Tastenflow setzt es, sobald die
   * Bedienung nicht Deutsch ist.
   */
  ohneHeimVerweis?: boolean;
  /**
   * ★ Heim-Verweis nur als Zeichen, ohne das sichtbare Wort „Sensorik" (Lexami, Johannes
   * 14.11.2026: „lass den text sensorik weg, das icon reicht"). Der Name bleibt für
   * Sprachausgabe und Braillezeile (`aria-label`). Ohne die Prop bleibt alles wie bisher.
   */
  heimNurZeichen?: boolean;
  /**
   * ★★★ „BETA" hinter dem Titel - das Programm ist noch nicht fertig
   * (Johannes, 04.09.2026). WELCHE Programme das sind, steht in
   * `ALL_PROGRAMS` (`beta: true`); die App reicht das Ergebnis herein, damit
   * die Kopfzeile den Katalog nicht selbst befragen muss.
   *
   * ⚠️ Die Marke steht NEBEN dem `h1`, nicht darin. Die Überschrift ist in den
   * meisten Apps ein Schalter („zurück ins Programm"), und der Name eines
   * Bedienteils soll sagen, was es tut - „Punktgenau BETA" wäre der Name eines
   * Schalters, der weder Punktgenau noch Beta auslöst (WCAG 2.5.3).
   */
  beta?: boolean;
  /** Id für `aria-labelledby` (im Griff verweist darauf). */
  titelId?: string;
  /**
   * Der Bereich, in dem gerade gearbeitet wird — steht klein hinter dem
   * Programmnamen, z. B. „Tastenflow · Mein Training" (Johannes 25.08.2026).
   *
   * Bei Tastenflow trug diesen Namen bis dahin die Karte über dem Übungsfeld.
   * Die Karte ist weg; der Name gehört aber weiterhin sichtbar hin, sonst weiß
   * niemand mehr, in welcher der drei Übungsarten er steckt (Alt + B wechselt).
   * Er steht IM h1 - eine Sprachausgabe liest damit „Tastenflow, Mein Training"
   * als eine Überschrift, statt zwei Dinge zu melden.
   */
  bereich?: string;
  /**
   * ★ Ein feiner senkrechter Strich zwischen der Sensorik-Marke und dem
   * App-Zeichen (Plus, Johannes 17.10.2026: „mach eine Trennung zwischen
   * Sensorik und dem Plus-Logo"). Derselbe Strich wie vor dem Farbschalter;
   * der Titel bleibt mittig im übrigen Platz. Ohne die Prop bleibt alles wie
   * bisher - die anderen Apps setzen sie nicht.
   */
  trennstrich?: boolean;
  /**
   * ★ Lexami am Handy (Johannes 16.11.2026 abends): „obenist farben und kontrast … dann kommt einstellungen
   * und dann hilfe … nach der hilfe den account". Die genannten Teile der Werkzeug-Reihe kommen in dieser
   * Reihenfolge ZUERST, alle anderen danach wie gewohnt. Es ändert die echte Reihenfolge (auch für Tab und
   * Screenreader), nicht nur die Anzeige. Ohne die Prop bleibt alles wie bisher - die anderen Apps setzen sie nicht.
   */
  menueReihenfolge?: readonly KopfTeil[];
  /**
   * ★ Der Hilfe-Knopf heißt nur „Hilfe" statt „Hilfe in einfacher Sprache" (Lexami, Johannes 16.11.2026
   * abends: „schreib nicht in einfacher sprache! sondern nur hilfe"). Ohne die Prop wie bisher.
   */
  hilfeKurz?: boolean;
  /**
   * ★ „Melden" (nur Lehrkräfte) als runder Sinnbild-Knopf wie die übrigen
   * Kopfzeilen-Knöpfe statt als Wort-Schalter (Lexami, Johannes 14.11.2026:
   * „der Melden-Schalter passt nicht zum Rest"). Ohne die Prop bleibt alles
   * wie bisher - die anderen Apps setzen sie nicht.
   */
  meldenRund?: boolean;
  /**
   * ★ „Melden" auch OHNE Anmeldung zeigen (Lexami, Johannes 14.11.2026: „in der kopfzeile braucht
   * die app wieder einen melden schalter"). Lexami wird fast nur ohne Konto benutzt - ein Schalter
   * nur für Lehrkräfte wäre dort für nahezu alle unsichtbar (dieselbe Lage wie bei den öffentlichen
   * Seiten, `MeldenKnopf`). Das Fenster arbeitet ohne Konto, die Bremse sitzt am Server
   * (`rueckmeldung_mail.pb.js`). Kinder einer Klasse sehen ihn weiterhin NICHT (Entscheidung vom
   * 02.09.2026), Selbstlernende melden wie bisher aus dem Konto-Menü. Ohne die Prop: wie bisher.
   */
  meldenOhneAnmeldung?: boolean;
  /**
   * ★ „Melden" mit Bild auch für Kinder einer Klasse (Lexami, Johannes 17.11.2026: „auch schüler brauchen
   * einen melden schalter mit screenshot!"). Ein runder Knopf, der dasselbe tut wie Alt + Umschalt + P:
   * Bild aufnehmen, ohne Namen melden. Ohne die Prop: wie bisher (Kinder sehen keinen Knopf).
   */
  meldenFuerKinder?: boolean;
  /** Hilfe öffnen. */
  onHilfe: () => void;
  /** Tastenkürzel-Liste auf-/zuklappen. */
  onKurztasten: () => void;
  kurztastenOffen?: boolean;
  /**
   * ★ „TASTEN ERKUNDEN" ALS RUNDER SCHALTER direkt rechts neben „Alt"
   * (Johannes 22.09.2026: „die Funktion findet niemand"). Optional nach dem
   * Vorbild von `onVorlesen`: Fehlt der Rückruf, erscheint der Knopf nicht -
   * Tastenflow und »Im Griff« reichen ihn herein, die anderen Apps bleiben gleich.
   */
  onTastenErkunden?: () => void;
  tastenErkundenOffen?: boolean;
  /** Anzeige des Kürzels („Alt + 3"); am Mac schreibt die App es um. */
  tastenErkundenKuerzel?: string;
  /** Anzeige der Kürzel („Alt + H"); am Mac schreibt die App sie um. */
  hilfeKuerzel?: string;
  kurztastenKuerzel?: string;
  /** Angemeldetes Konto (oder nichts). */
  account?: KopfKonto | null;
  onAbmelden?: () => void;
  onAnmelden?: () => void;
  /** Fokus-Rückkehr, wenn die Anmeldung abgebrochen wird. */
  anmeldenRef?: React.RefObject<HTMLButtonElement>;
  /**
   * „Meine Statistik" im Konto-Menü. Fehlt der Callback, hat die App keine
   * eigene Statistik-Ansicht und der Punkt erscheint nicht.
   */
  onStatistik?: () => void;
  /**
   * „Passwort ändern" im Konto-Menü. Es stand bis 10.08.2026 UNTEN IN DER
   * STATISTIK — dort sucht es niemand (Johannes). Fehlt der Callback, kennt die
   * App keinen Weg dafür und der Punkt erscheint nicht.
   */
  onPasswort?: () => void;
  /** Ziel von „Meine Klassen" (nur Lehrkräfte), z. B. „/lernwerkstatt/klasse?app=tippen". */
  klasseHref?: string;
  /** Fokus-Rückkehr nach dem Nachrichten-Fenster (je App verschieden). */
  bellAfterClose?: () => void;
  /**
   * Fokus-Rückkehr, wenn das Konto-Menü mit **Escape** geschlossen wird. Ohne
   * den Callback geht der Fokus wie üblich auf den Öffner zurück (K27). In
   * „Tastenflow" gilt seit 14.08.2026 die strengere Hausregel „Escape holt
   * IMMER die Eingabezeile" — die App reicht sie hier herein, ohne dass sich
   * für die anderen drei Programme etwas ändert.
   */
  escAfterClose?: () => void;
  /**
   * ⚙ EINSTELLUNGEN — der Zahnrad-Knopf, DIREKT LINKS VOM KONTO-ZEICHEN
   * (Charge „SCHLANK", Johannes 22.08.2026). Fehlt der Rückruf, hat die App
   * keinen Einstellungs-Bereich und das Zahnrad erscheint nicht.
   *
   * ★ WARUM ALS EIGENE PROP UND NICHT ÜBER `extra`: Bis dahin baute sich »Im
   * Griff« sein Zahnrad selbst und hängte es in den `extra`-Slot, während
   * „Tastenflow" ein zweites, ganz anders aussehendes Zahnrad in einer eigenen
   * grauen Leiste unter der Kopfzeile hatte. Zwei Programme, zwei Zahnräder,
   * zwei Plätze — genau das, was diese Datei abschaffen sollte
   * ([[feedback_platform_parity]]). Jetzt zeichnet die Kopfzeile es selbst,
   * überall gleich und an derselben Stelle.
   *
   * Darstellung: schmal nur das Zeichen als runder 36-px-Knopf wie das
   * Konto-Zeichen, ab `sm` zusätzlich das Wort „Einstellungen".
   */
  onEinstellungen?: () => void;
  /**
   * Steuert das Zahnrad einen AUFKLAPPBEREICH auf derselben Seite (Tastenflow)?
   * Dann sagt `aria-expanded` den Zustand an. Öffnet es ein FENSTER (»Im
   * Griff«), bleibt die Prop weg — dort meldet stattdessen
   * `aria-haspopup="dialog"`, dass ein Dialog kommt.
   */
  einstellungenOffen?: boolean;
  /** Id des gesteuerten Aufklappbereichs (nur zusammen mit `einstellungenOffen`). */
  einstellungenControls?: string;
  /** Anzeige des Kürzels („Alt + O"); am Mac schreibt die App es um. */
  einstellungenKuerzel?: string;
  /** Anzeige des Konto-Kürzels („Alt + J"); am Mac schreibt die App es um. */
  kontoKuerzel?: string;
  /**
   * VORLESEN AN/AUS - der zweite der beiden Schalter rechts (30.08.2026).
   *
   * Optional nach dem Vorbild von `onEinstellungen`: Fehlen die beiden Props,
   * hat die App keine Sprachausgabe und der Knopf erscheint nicht. Bisher
   * reicht nur Tastenflow sie herein.
   *
   * ⚠️ EIN ZUSTAND, DREI TÜREN - nie drei Zustände. Der Knopf, das Kürzel
   * Alt + V und der Schalter im Zahnrad schreiben in denselben Speicher
   * (`useVoice` in Tastenflow). Diese Kopfzeile legt darum KEINEN eigenen an:
   * Sie zeigt, was die App ihr sagt, und meldet den Druck zurück.
   */
  onVorlesen?: () => void;
  vorlesenAn?: boolean;
  /**
   * ★ Ein Menü unter dem Lautsprecher (Plus, Johannes 17.10.2026: „unter dem
   * runden Lautsprecher-Schalter ein Menü mit allen Akustik-Einstellungen").
   * Ist es da, klappt der Lautsprecher das Menü auf wie der Farbschalter seine
   * Liste - das Vorlesen selbst schaltet die App weiter mit Alt + V und im Menü.
   * Ohne die Prop bleibt der Knopf der reine Schalter von vorher; die anderen
   * Apps setzen sie nicht.
   */
  akustikMenue?: {
    inhalt: ReactNode;
    tipp: string;
    /**
     * Name des Knopfes für den Screenreader (Tastenflow: „Klang und
     * Vorlesen"). Fehlt er, bleibt es „Vorlesen (Alt + V)" wie bei Plus.
     * Das Kürzel gehört nicht in den Namen eines Knopfes, der ein Menü öffnet
     * und nicht das Vorlesen umschaltet.
     */
    name?: string;
  };
  /**
   * ★ DIE FARBWAHL ANSAGEN (31.08.2026, Zensus Nr 40 in
   * `pruefstand/kind/befunde/zensus-ansagen.md`).
   *
   * Gemessen: Wer im Farbmenü (Alt + K) einen Kontrastmodus wählt, bekommt
   * KEINE Bestätigung - der Modus greift sofort auf der ganzen Seite, aber
   * gesagt wird nichts. Ein Kind mit Sehrest, das den Kontrast an wechselndes
   * Licht anpasst, tut das unter Umständen mehrmals täglich und hört jedes Mal
   * nichts. Bis zum 30.08. nannte die Kinder-Hilfe für dieselbe Taste noch
   * etwas anderes - der Fehler in der Hilfe und die Stummheit des Schalters
   * haben sich gegenseitig gedeckt.
   *
   * ⚠️ WARUM EIN RÜCKRUF UND KEIN `speakUi` HIER DRIN: Diese Kopfzeile steckt
   * in FÜNF Apps, und jede hat ihre eigene Sprachausgabe mit eigenem An/Aus -
   * Tastenflow `src/lib/typing/voice.ts`, Punktgenau und Klangpunkte
   * `src/lib/braille/voice.ts`. Spräche die Kopfzeile selbst, redete in
   * Punktgenau der Tastenflow-Schalter mit. Darum dieselbe Bauart wie beim
   * Vorlese-Knopf darüber: Die Kopfzeile MELDET, welcher Modus gewählt wurde
   * (das Etikett, wie es im Menü steht), und die App sagt es mit ihrer eigenen
   * Stimme. Wer den Rückruf nicht hereinreicht, verhält sich wie bisher.
   * Bisher reicht ihn nur Tastenflow herein (`TippenTrainerPage.tsx`).
   */
  onFarbeGewaehlt?: (label: string) => void;
  /**
   * App-eigene Schalter GANZ LINKS in der Werkzeug-Reihe (vor „Hilfe").
   * Für das Zahnrad gibt es seit 22.08.2026 `onEinstellungen` — dieser Slot
   * bleibt für alles andere, was eine einzelne App braucht.
   */
  extra?: ReactNode;
  /**
   * ★★★ DER NAME DER APP IST DER HEIMWEG (Johannes 25.08.2026: „ich würde
   * gerne, wenn ich auf den Text Tastenflow klicke, immer wieder zum Programm
   * zurückkommen, z. B. wenn Einstellungen geöffnet sind — das gleiche wie bei
   * Esc").
   *
   * Ist der Rückruf da, wird aus der Überschrift im `h1` ein Schalter, der
   * GENAU DASSELBE tut wie Escape: jedes offene Fenster zu, Fokus zurück in
   * die Eingabezeile. Die App reicht dafür ihren eigenen Escape-Weg herein —
   * nicht eine zweite Nachbildung davon, sonst laufen die beiden Wege
   * auseinander, sobald einer erweitert wird.
   *
   * ★★ DIE GANZE ÜBERSCHRIFT IST DER HEIMWEG (Johannes 30.08.2026: „der text
   * tastenflow und mein training soll der gleiche link sein der menüs immer
   * schließt und zurück zur eingabezeile führt, genau so wie esc").
   *
   * Bis dahin stand hier das Gegenteil: Der `bereich` („· Mein Training") lag
   * ausdrücklich AUSSERHALB des Schalters, mit der Begründung, er sage, wo man
   * ist, und nicht, wohin es geht. Johannes nimmt diese Entscheidung zurück.
   * Sie war am Bildschirm nicht zu sehen: Titel und Bereich stehen in einer
   * Zeile, in derselben Schrift, ohne Fuge - wer den halben Satz anklickt,
   * trifft nichts, und wer mit Sehrest arbeitet, kann die unsichtbare Grenze
   * dazwischen nicht finden. Jetzt liegen beide in EINEM Schalter.
   *
   * Barrierefreiheit: Der Name des Schalters sind genau die sichtbaren Wörter
   * (WCAG 2.5.3 „Label in Name"), also „Tastenflow Mein Training" — der
   * Mittelpunkt bleibt `aria-hidden`, ihn sagt niemand. KEIN `aria-label`: Es
   * wanderte in den Namen der ÜBERSCHRIFT und würde bei jedem Seitenüberblick
   * mitgelesen. Die Erklärung steht im Hinweis am Schalter und in der
   * Kürzel-Liste.
   */
  onZumProgramm?: () => void;
  /**
   * ★★ DIE SPRACHE DER EIGENEN TEXTE (Probestück „englische Bedienung",
   * 12.09.2026, von Johannes für diesen gemeinsamen Teil freigegeben).
   *
   * Fehlt die Prop, gilt die Sprache des Providers (`useBedienSprache`) - und
   * OHNE (aktiven) Provider ist das „de": Wer nichts setzt und keinen Provider
   * hat, bekommt Zeichen für Zeichen die Kopfzeile von vorher. Einen aktiven
   * Provider gibt es seit EN0 (18.09.2026) nur auf den Adressen von Tastenflow
   * (`features/public/TastenflowSprachBereich.tsx`); welche Sprache dort gilt,
   * steht in `src/lib/bedienSprache`.
   *
   * ⚠️ Sie gilt für die Texte, die DIESE Datei schreibt. `RueckmeldungKnopf` und
   * `LwMessageBell` bleiben deutsch (Bauplan §3.5) - ihre Fenster sind es auch.
   */
  bedienSprache?: BedienSprache;
  /**
   * Der runde Sprachschalter ganz rechts. Fehlt die Prop, kommt er aus dem
   * Provider - aber NUR, wenn der aktiv ist (`bereichAktiv`, also auf einer
   * Tastenflow-Adresse). Ohne Provider und auf fremden Adressen gibt es ihn
   * nicht.
   * ★ EN0 (18.09.2026): Darum steht er auf JEDER Tastenflow-Seite mit dieser
   * Kopfzeile, ohne dass die Seite ihn einzeln verdrahten muss - seit
   * 19.09.2026 für jeden, ob Gast, Kind oder Lehrkraft.
   *
   * ⚠️ WARUM EIN RÜCKRUF: Die Kopfzeile spricht nicht selbst - dieselbe Bauart
   * wie `onFarbeGewaehlt`. Umgestellt und angesagt wird in `wechsle` des
   * Providers, mit der Stimme, die Tastenflow ihm hereinreicht; eine
   * Kopfzeile, die spräche, redete in Punktgenau mit.
   */
  sprachSchalter?: {
    sprache: BedienSprache;
    onWechsel: (neu: BedienSprache) => void;
  };
  /**
   * ★★★ E2b (25.09.2026, Bauplan D9/§9.3): WELCHE SPRACHEN DER SPRACHWÄHLER
   * ANBIETET - fehlt die Eigenschaft, bleibt der heutige runde Umschalter
   * DE/EN EXAKT wie er ist, Byte für Byte (§9.3: „Apps ohne sie behalten den
   * heutigen Schalter"). Erst `["de", "en", "fr"]` (drei oder mehr Einträge)
   * lässt den NEUEN Sprachwähler entstehen (Weltkugel + Kürzel, aufklappbare
   * Liste, Bauplan §9.3).
   *
   * Fehlt sie UND gibt es keine eigene `sprachSchalter`-Eigenschaft, kommt sie
   * aus dem Provider (`bereichSprache.spracheOptionen`) - genau wie
   * `sprachSchalter` selbst. Tastenflow setzt sie NUR, wenn der Probe-Schalter
   * des französischen Lehrgangs an ist (`franzoesischLehrgangProbeAn()`); jede
   * andere App reicht sie nie herein und bleibt unangetastet.
   */
  sprachen?: readonly BedienSprache[];
}

/** Der erste Buchstabe des Namens für das runde Konto-Zeichen („J"). */
/**
 * ★ Der Kurzname eines Knopfs ohne Tastenkürzel - „Hilfe in einfacher Sprache (Wahl + H)" →
 * „Hilfe in einfacher Sprache". Steht als `data-kopf-text` an den runden Knöpfen und ändert
 * NICHTS an Bild oder Ansage: Lexami zeigt ihn am Handy als Zeilentext, wenn die Knöpfe im
 * Menü als Liste stehen (15.11.2026). Andere Apps lesen ihn nicht.
 */
function ohneKuerzel(name: string): string {
  return name.replace(/\s*\([^)]*\+[^)]*\)/g, "").trim();
}

function initiale(name: string): string {
  const erster = name.trim()[0];
  return erster ? erster.toUpperCase() : "?";
}

/**
 * ★★ DIE TEXTE DER KOPFZEILE - beide Sprachen nebeneinander (12.09.2026).
 *
 * Die deutsche Spalte ist WORTGLEICH mit dem, was vorher an den Knöpfen stand;
 * ohne `bedienSprache` ändert sich also kein Zeichen. Ganze Sätze mit
 * Platzhaltern (`k` = das Kürzel, wie die App es anzeigt), nie Satzstücke.
 * Englisch: britisch, Glossar im Bauplan §4.
 */
const KOPF_TEXTE = texte({
  de: {
    zurLernplattform: "Zur Lernplattform",
    startseite: "Sensorik Lernplattform, zur Startseite",
    heimweg: "Zurück ins Programm - schließt alles Offene (wie Escape).",
    werkzeuge: "Werkzeuge",
    zuMeinenKlassen: "Zurück in den Bereich Meine Klassen (Alt + S)",
    meineKlassen: "Meine Klassen",
    hilfeTipp: (k: string) => `Hilfe (${k})`,
    hilfeName: (k: string) => `Hilfe in einfacher Sprache (${k})`,
    kurztastenTipp: (k: string) => `Alle Tastenkürzel (${k})`,
    kurztastenName: (k: string) => `Kurztasten - Tastenkürzel-Liste (${k})`,
    erkundenTipp: (k: string) => `Tasten erkunden (${k})`,
    erkundenName: (k: string) => `Tasten erkunden - jede Taste wird angesagt (${k})`,
    einstellungen: (k: string) => `Einstellungen (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - Konto und Statistik (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "de", { one: (z) => `${z} neue Nachricht`, other: (z) => `${z} neue Nachrichten` })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Mein Konto: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "de", { one: (z) => `${z} neue Nachricht`, other: (z) => `${z} neue Nachrichten` })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (Lehrkraft)`,
    klassenZeile: (name: string, klasse: string) => `${name}, Klasse ${klasse}`,
    nachrichten: "Nachrichten",
    // In Teilen wie vorher im JSX (`({posteingang} neu)`): gleiche Textknoten.
    nachrichtenNeu: (neu: number) => ["(", neu, " neu)"],
    meineStatistik: "Meine Statistik",
    passwortAendern: "Passwort ändern",
    melden: "Melden",
    abmelden: "Abmelden",
    konto: (k: string) => `Konto (${k})`,
    farben: (alt: string) => `Farben und Kontrast (${alt} + K)`,
    farbName: (_id: ContrastMode, deutsch: string) => deutsch,
    vorlesenTipp: (an: boolean, alt: string) =>
      `Vorlesen ${an ? "ausschalten" : "einschalten"} (${alt} + V)`,
    vorlesenName: (alt: string) => `Vorlesen (${alt} + V)`,
    wahltaste: "Wahl",
    // Führendes Leerzeichen wie vorher im JSX (`<span>✕</span> Statistik schließen`).
    statistikSchliessen: " Statistik schließen",
  },
  en: {
    zurLernplattform: "Go to the learning platform",
    startseite: "Sensorik learning platform, home page",
    heimweg: "Back to the app - closes everything that is open (like Escape).",
    werkzeuge: "Tools",
    zuMeinenKlassen: "Back to My classes (Alt + S)",
    meineKlassen: "My classes",
    hilfeTipp: (k: string) => `Help (${k})`,
    // EN1 (19.09.2026): Glossar §6 Nr 2 / §3.12 - britisch natürlicher als „plain language".
    hilfeName: (k: string) => `Help in plain English (${k})`,
    kurztastenTipp: (k: string) => `All keyboard shortcuts (${k})`,
    kurztastenName: (k: string) => `Keyboard shortcuts - the full list (${k})`,
    erkundenTipp: (k: string) => `Explore keys (${k})`,
    erkundenName: (k: string) => `Explore keys - every key is announced (${k})`,
    einstellungen: (k: string) => `Settings (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - account and statistics (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "en", { one: (z) => `${z} new message`, other: (z) => `${z} new messages` })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `My account: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "en", { one: (z) => `${z} new message`, other: (z) => `${z} new messages` })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (teacher)`,
    klassenZeile: (name: string, klasse: string) => `${name}, class ${klasse}`,
    nachrichten: "Messages",
    nachrichtenNeu: (neu: number) => ["(", neu, " new)"],
    meineStatistik: "My statistics",
    passwortAendern: "Change password",
    melden: "Send feedback",
    abmelden: "Sign out",
    konto: (k: string) => `Account (${k})`,
    farben: (alt: string) => `Colours and contrast (${alt} + K)`,
    // Die englischen Namen stehen seit EN8 neben den deutschen in `contrast.ts`.
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_EN[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `Turn reading aloud ${an ? "off" : "on"} (${alt} + V)`,
    vorlesenName: (alt: string) => `Read aloud (${alt} + V)`,
    wahltaste: "Option",
    // ★ EN10 (19.09.2026, im Browser gefunden): der Knopf über und unter
    // „My statistics" stand noch deutsch da.
    statistikSchliessen: " Close statistics",
  },
  // ★ E11a (25.09.2026, Bauplan §9): aus der FUNKTION geschrieben, nicht aus
  // dem Deutschen übersetzt - die Kopfzeile gehört fünf Apps, darum bleiben
  // Beschriftungen wo möglich Substantive/Infinitive statt einer Anrede
  // (tu/vous entfällt so für die meisten Zeilen; „Signaler" bleibt kurz wie
  // das deutsche „Melden").
  fr: {
    zurLernplattform: "Vers la plateforme d'apprentissage",
    startseite: "Plateforme d'apprentissage Sensorik, page d'accueil",
    heimweg: "Retour au programme - referme tout ce qui est ouvert (comme Échap).",
    werkzeuge: "Outils",
    zuMeinenKlassen: "Retour à Mes classes (Alt + S)",
    meineKlassen: "Mes classes",
    hilfeTipp: (k: string) => `Aide (${k})`,
    hilfeName: (k: string) => `Aide en français facile (${k})`,
    kurztastenTipp: (k: string) => `Tous les raccourcis clavier (${k})`,
    kurztastenName: (k: string) => `Raccourcis clavier - la liste complète (${k})`,
    erkundenTipp: (k: string) => `Explorer le clavier (${k})`,
    erkundenName: (k: string) => `Explorer le clavier - chaque touche est annoncée (${k})`,
    einstellungen: (k: string) => `Réglages (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - compte et progrès (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "fr", { one: (z) => `${z} nouveau message`, other: (z) => `${z} nouveaux messages` })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Mon compte : ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "fr", { one: (z) => `${z} nouveau message`, other: (z) => `${z} nouveaux messages` })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (enseignant ou enseignante)`,
    klassenZeile: (name: string, klasse: string) => `${name}, classe ${klasse}`,
    nachrichten: "Messages",
    nachrichtenNeu: (neu: number) => ["(", neu, neu > 1 ? " nouveaux)" : " nouveau)"],
    meineStatistik: "Mes progrès",
    passwortAendern: "Changer le mot de passe",
    melden: "Signaler",
    abmelden: "Se déconnecter",
    konto: (k: string) => `Compte (${k})`,
    farben: (alt: string) => `Couleurs et contraste (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_FR[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Désactiver" : "Activer"} la lecture à voix haute (${alt} + V)`,
    vorlesenName: (alt: string) => `Lire à voix haute (${alt} + V)`,
    wahltaste: "Option",
    statistikSchliessen: " Fermer mes progrès",
  },
  // ★ ES-O (27.09.2026, Bauplan D6/§7): wie „fr" aus der Funktion geschrieben -
  // Substantive und Infinitive, damit die Kopfzeile ohne tú/usted auskommt.
  es: {
    zurLernplattform: "Ir a la plataforma de aprendizaje",
    startseite: "Plataforma de aprendizaje Sensorik, página de inicio",
    heimweg: "Volver al programa - cierra todo lo que está abierto (como Esc).",
    werkzeuge: "Herramientas",
    zuMeinenKlassen: "Volver a Mis clases (Alt + S)",
    meineKlassen: "Mis clases",
    hilfeTipp: (k: string) => `Ayuda (${k})`,
    hilfeName: (k: string) => `Ayuda en lenguaje sencillo (${k})`,
    kurztastenTipp: (k: string) => `Todos los atajos de teclado (${k})`,
    kurztastenName: (k: string) => `Atajos de teclado - la lista completa (${k})`,
    erkundenTipp: (k: string) => `Explorar el teclado (${k})`,
    erkundenName: (k: string) => `Explorar el teclado - se anuncia cada tecla (${k})`,
    einstellungen: (k: string) => `Configuración (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - cuenta y progreso (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "es", { one: (z) => `${z} mensaje nuevo`, other: (z) => `${z} mensajes nuevos` })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Mi cuenta: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "es", { one: (z) => `${z} mensaje nuevo`, other: (z) => `${z} mensajes nuevos` })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (docente)`,
    klassenZeile: (name: string, klasse: string) => `${name}, clase ${klasse}`,
    nachrichten: "Mensajes",
    nachrichtenNeu: (neu: number) => ["(", neu, neu === 1 ? " nuevo)" : " nuevos)"],
    meineStatistik: "Mi progreso",
    passwortAendern: "Cambiar la contraseña",
    melden: "Enviar comentarios",
    abmelden: "Cerrar sesión",
    konto: (k: string) => `Cuenta (${k})`,
    farben: (alt: string) => `Colores y contraste (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_ES[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Desactivar" : "Activar"} la lectura en voz alta (${alt} + V)`,
    vorlesenName: (alt: string) => `Leer en voz alta (${alt} + V)`,
    wahltaste: "Opción",
    statistikSchliessen: " Cerrar mi progreso",
  },
  // ★ O-IT (02.10.2026): Glossar Italienisch (Le mie classi, Impostazioni,
  // Aiuto, I miei progressi, Segnala, Esci, lettura ad alta voce).
  it: {
    zurLernplattform: "Alla piattaforma di apprendimento",
    startseite: "Piattaforma di apprendimento Sensorik, alla pagina iniziale",
    heimweg: "Torna al programma - chiude tutto ciò che è aperto (come Esc).",
    werkzeuge: "Strumenti",
    zuMeinenKlassen: "Torna a Le mie classi (Alt + S)",
    meineKlassen: "Le mie classi",
    hilfeTipp: (k: string) => `Aiuto (${k})`,
    hilfeName: (k: string) => `Aiuto in parole semplici (${k})`,
    kurztastenTipp: (k: string) => `Tutte le scorciatoie da tastiera (${k})`,
    kurztastenName: (k: string) => `Scorciatoie da tastiera - l'elenco completo (${k})`,
    erkundenTipp: (k: string) => `Esplora i tasti (${k})`,
    erkundenName: (k: string) => `Esplora i tasti - ogni tasto viene annunciato (${k})`,
    einstellungen: (k: string) => `Impostazioni (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - account e progressi (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "it", { one: (z) => `${z} nuovo messaggio`, other: (z) => `${z} nuovi messaggi` })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Il mio account: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "it", { one: (z) => `${z} nuovo messaggio`, other: (z) => `${z} nuovi messaggi` })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (insegnante)`,
    klassenZeile: (name: string, klasse: string) => `${name}, classe ${klasse}`,
    nachrichten: "Messaggi",
    nachrichtenNeu: (neu: number) => ["(", neu, neu === 1 ? " nuovo)" : " nuovi)"],
    meineStatistik: "I miei progressi",
    passwortAendern: "Cambia la password",
    melden: "Segnala",
    abmelden: "Esci",
    konto: (k: string) => `Account (${k})`,
    farben: (alt: string) => `Colori e contrasto (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_IT[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Disattiva" : "Attiva"} la lettura ad alta voce (${alt} + V)`,
    vorlesenName: (alt: string) => `Lettura ad alta voce (${alt} + V)`,
    wahltaste: "Opzione",
    statistikSchliessen: " Chiudi i progressi",
  },
  // ★ O-PL (02.10.2026): Glossar §2.5/§2.6/§2.8 - Moje klasy, Pomoc, Ustawienia,
  // Moje postępy, Zgłoś, Wyloguj się, Czytanie na głos. Mehrzahl mit allen vier
  // Formen; die Lehrkraft-Zeile ohne Geschlecht („konto dla nauczycieli").
  pl: {
    zurLernplattform: "Do platformy edukacyjnej",
    startseite: "Platforma edukacyjna Sensorik, przejdź do strony głównej",
    heimweg: "Wróć do programu - zamyka wszystko, co jest otwarte (jak Esc).",
    werkzeuge: "Narzędzia",
    zuMeinenKlassen: "Wróć do sekcji Moje klasy (Alt + S)",
    meineKlassen: "Moje klasy",
    hilfeTipp: (k: string) => `Pomoc (${k})`,
    hilfeName: (k: string) => `Pomoc prostym językiem (${k})`,
    kurztastenTipp: (k: string) => `Wszystkie skróty klawiaturowe (${k})`,
    kurztastenName: (k: string) => `Skróty klawiaturowe - pełna lista (${k})`,
    erkundenTipp: (k: string) => `Odkrywaj klawisze (${k})`,
    erkundenName: (k: string) => `Odkrywaj klawisze - program mówi nazwę każdego klawisza (${k})`,
    einstellungen: (k: string) => `Ustawienia (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - konto i postępy (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "pl", {
            one: (z) => `${z} nowa wiadomość`,
            few: (z) => `${z} nowe wiadomości`,
            many: (z) => `${z} nowych wiadomości`,
            other: (z) => `${z} nowej wiadomości`,
          })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Moje konto: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "pl", {
            one: (z) => `${z} nowa wiadomość`,
            few: (z) => `${z} nowe wiadomości`,
            many: (z) => `${z} nowych wiadomości`,
            other: (z) => `${z} nowej wiadomości`,
          })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (konto dla nauczycieli)`,
    klassenZeile: (name: string, klasse: string) => `${name}, klasa ${klasse}`,
    nachrichten: "Wiadomości",
    // In Teilen wie im Deutschen: die Zahl bleibt ein eigener Textknoten.
    nachrichtenNeu: (neu: number) => [
      "(",
      neu,
      mehrzahl(neu, "pl", { one: () => " nowa)", few: () => " nowe)", many: () => " nowych)", other: () => " nowej)" }),
    ],
    meineStatistik: "Moje postępy",
    passwortAendern: "Zmień hasło",
    melden: "Zgłoś",
    abmelden: "Wyloguj się",
    konto: (k: string) => `Konto (${k})`,
    farben: (alt: string) => `Kolory i kontrast (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_PL[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Wyłącz" : "Włącz"} czytanie na głos (${alt} + V)`,
    vorlesenName: (alt: string) => `Czytanie na głos (${alt} + V)`,
    wahltaste: "Option",
    statistikSchliessen: " Zamknij postępy",
  },
  // ★ O-TR (02.10.2026): Glossar §2.5/§2.6/§2.8/§2.11 - Sınıflarım, Yardım, Ayarlar,
  // İlerlemem, Sorun bildir, Çıkış yap, Sesli okuma, Tuşları Keşfet. Die Kopfzeile
  // sehen Kind UND Lehrkraft: Hauptwörter und Knöpfe im Stamm. Einzahl nach der
  // Zahl ("3 yeni mesaj"), keine Endung an Platzhaltern (Regel 6).
  tr: {
    zurLernplattform: "Öğrenme platformuna git",
    startseite: "Sensorik öğrenme platformu, ana sayfaya git",
    heimweg: "Programa dön - açık olan her şeyi kapatır (Esc gibi).",
    werkzeuge: "Araçlar",
    zuMeinenKlassen: "Sınıflarım bölümüne dön (Alt + S)",
    meineKlassen: "Sınıflarım",
    hilfeTipp: (k: string) => `Yardım (${k})`,
    hilfeName: (k: string) => `Kolay dille yardım (${k})`,
    kurztastenTipp: (k: string) => `Tüm klavye kısayolları (${k})`,
    kurztastenName: (k: string) => `Klavye kısayolları - tam liste (${k})`,
    erkundenTipp: (k: string) => `Tuşları Keşfet (${k})`,
    erkundenName: (k: string) => `Tuşları Keşfet - her tuşun adı söylenir (${k})`,
    einstellungen: (k: string) => `Ayarlar (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - hesap ve ilerleme (${k})` + (neu > 0 ? ` - ${neu} yeni mesaj` : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Hesabım: ${zeile} (${k})` + (neu > 0 ? `, ${neu} yeni mesaj` : ""),
    lehrkraftZeile: (name: string) => `${name} (öğretmen)`,
    // "sınıfı" trägt die Endung, nie der Klassenname.
    klassenZeile: (name: string, klasse: string) => `${name}, ${klasse} sınıfı`,
    nachrichten: "Mesajlar",
    // In Teilen wie im Deutschen: die Zahl bleibt ein eigener Textknoten.
    nachrichtenNeu: (neu: number) => ["(", neu, " yeni)"],
    meineStatistik: "İlerlemem",
    passwortAendern: "Şifreyi değiştir",
    melden: "Sorun bildir",
    abmelden: "Çıkış yap",
    konto: (k: string) => `Hesap (${k})`,
    farben: (alt: string) => `Renkler ve karşıtlık (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_TR[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `Sesli okumayı ${an ? "kapat" : "aç"} (${alt} + V)`,
    vorlesenName: (alt: string) => `Sesli okuma (${alt} + V)`,
    wahltaste: "Option",
    statistikSchliessen: " İlerlemeyi kapat",
  },
  // ★ O-CS (03.10.2026): Glossar §2.5/§2.6/§2.8 - Moje třídy, Nápověda, Nastavení,
  // Můj pokrok, Nahlásit, Odhlásit se, Předčítání, Průzkum kláves (§2.9). Die
  // Kopfzeile sehen Kind UND Lehrkraft: Hauptwörter und Knöpfe im Infinitiv. Neue
  // Zprávy mit allen vier Mehrzahlformen (§2.11); Namen und Klasse ungebeugt
  // (nach Komma bzw. hinter dem Kopfwort "třída", Regel 12).
  cs: {
    zurLernplattform: "Přejít na vzdělávací platformu",
    startseite: "Vzdělávací platforma Sensorik, přejít na úvodní stránku",
    heimweg: "Zpět do programu - zavře vše otevřené (jako klávesa Esc).",
    werkzeuge: "Nástroje",
    zuMeinenKlassen: "Zpět do části Moje třídy (Alt + S)",
    meineKlassen: "Moje třídy",
    hilfeTipp: (k: string) => `Nápověda (${k})`,
    hilfeName: (k: string) => `Nápověda jednoduše (${k})`,
    kurztastenTipp: (k: string) => `Všechny klávesové zkratky (${k})`,
    kurztastenName: (k: string) => `Klávesové zkratky - celý seznam (${k})`,
    erkundenTipp: (k: string) => `Průzkum kláves (${k})`,
    erkundenName: (k: string) => `Průzkum kláves - program řekne název každé klávesy (${k})`,
    einstellungen: (k: string) => `Nastavení (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - účet a pokrok (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "cs", {
            one: (z) => `${z} nová zpráva`,
            few: (z) => `${z} nové zprávy`,
            many: (z) => `${z} nové zprávy`,
            other: (z) => `${z} nových zpráv`,
          })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Můj účet: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "cs", {
            one: (z) => `${z} nová zpráva`,
            few: (z) => `${z} nové zprávy`,
            many: (z) => `${z} nové zprávy`,
            other: (z) => `${z} nových zpráv`,
          })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (vyučující)`,
    klassenZeile: (name: string, klasse: string) => `${name}, třída ${klasse}`,
    nachrichten: "Zprávy",
    // In Teilen wie im Deutschen: die Zahl bleibt ein eigener Textknoten.
    nachrichtenNeu: (neu: number) => [
      "(",
      neu,
      mehrzahl(neu, "cs", { one: () => " nová)", few: () => " nové)", many: () => " nové)", other: () => " nových)" }),
    ],
    meineStatistik: "Můj pokrok",
    passwortAendern: "Změnit heslo",
    melden: "Nahlásit",
    abmelden: "Odhlásit se",
    konto: (k: string) => `Účet (${k})`,
    farben: (alt: string) => `Barvy a kontrast (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_CS[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Vypnout" : "Zapnout"} předčítání (${alt} + V)`,
    vorlesenName: (alt: string) => `Předčítání (${alt} + V)`,
    wahltaste: "Option",
    statistikSchliessen: " Zavřít pokrok",
  },
  bg: {
    zurLernplattform: "Към платформата за обучение",
    startseite: "Платформа за обучение Sensorik, към началната страница",
    heimweg: "Обратно в програмата - затваря всичко отворено (като Esc).",
    werkzeuge: "Инструменти",
    zuMeinenKlassen: "Обратно към Моите класове (Alt + S)",
    meineKlassen: "Моите класове",
    hilfeTipp: (k: string) => `Помощ (${k})`,
    hilfeName: (k: string) => `Помощ с прости думи (${k})`,
    kurztastenTipp: (k: string) => `Всички клавишни комбинации (${k})`,
    kurztastenName: (k: string) => `Клавишни комбинации - пълен списък (${k})`,
    erkundenTipp: (k: string) => `Разглеждане на клавишите (${k})`,
    erkundenName: (k: string) => `Разглеждане на клавишите - програмата казва името на всеки клавиш (${k})`,
    einstellungen: (k: string) => `Настройки (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - акаунт и напредък (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "bg", {
            one: (z) => `${z} ново съобщение`,
            other: (z) => `${z} нови съобщения`,
          })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Моят акаунт: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "bg", {
            one: (z) => `${z} ново съобщение`,
            other: (z) => `${z} нови съобщения`,
          })}`
        : ""),
    // Ohne Geschlecht: über das Konto, nicht über die Person (Glossar Regel 2).
    lehrkraftZeile: (name: string) => `${name} (учителски акаунт)`,
    klassenZeile: (name: string, klasse: string) => `${name}, клас ${klasse}`,
    nachrichten: "Съобщения",
    // In Teilen wie im Deutschen: die Zahl bleibt ein eigener Textknoten.
    nachrichtenNeu: (neu: number) => [
      "(",
      neu,
      mehrzahl(neu, "bg", { one: () => " ново)", other: () => " нови)" }),
    ],
    meineStatistik: "Моят напредък",
    passwortAendern: "Смени паролата",
    melden: "Съобщи",
    abmelden: "Излез",
    konto: (k: string) => `Акаунт (${k})`,
    farben: (alt: string) => `Цветове и контраст (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_BG[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Изключи" : "Включи"} четенето на глас (${alt} + V)`,
    vorlesenName: (alt: string) => `Четене на глас (${alt} + V)`,
    wahltaste: "Option",
    statistikSchliessen: " Затвори напредъка",
  },
  el: {
    zurLernplattform: "Μετάβαση στην εκπαιδευτική πλατφόρμα",
    startseite: "Εκπαιδευτική πλατφόρμα Sensorik, μετάβαση στην αρχική σελίδα",
    heimweg: "Πίσω στο πρόγραμμα - κλείνει ό,τι είναι ανοιχτό (όπως το πλήκτρο Esc).",
    werkzeuge: "Εργαλεία",
    zuMeinenKlassen: "Πίσω στην ενότητα Τα τμήματά μου (Alt + S)",
    meineKlassen: "Τα τμήματά μου",
    hilfeTipp: (k: string) => `Βοήθεια (${k})`,
    hilfeName: (k: string) => `Βοήθεια με απλά λόγια (${k})`,
    kurztastenTipp: (k: string) => `Όλες οι συντομεύσεις πληκτρολογίου (${k})`,
    kurztastenName: (k: string) => `Συντομεύσεις πληκτρολογίου - ολόκληρη η λίστα (${k})`,
    erkundenTipp: (k: string) => `Γνωριμία με τα πλήκτρα (${k})`,
    erkundenName: (k: string) => `Γνωριμία με τα πλήκτρα - το πρόγραμμα λέει το όνομα κάθε πλήκτρου (${k})`,
    einstellungen: (k: string) => `Ρυθμίσεις (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - λογαριασμός και πρόοδος (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "el", {
            one: (z) => `${z} νέο μήνυμα`,
            other: (z) => `${z} νέα μηνύματα`,
          })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Ο λογαριασμός μου: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "el", {
            one: (z) => `${z} νέο μήνυμα`,
            other: (z) => `${z} νέα μηνύματα`,
          })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (εκπαιδευτικός)`,
    klassenZeile: (name: string, klasse: string) => `${name}, τμήμα ${klasse}`,
    nachrichten: "Μηνύματα",
    // In Teilen wie im Deutschen: die Zahl bleibt ein eigener Textknoten.
    nachrichtenNeu: (neu: number) => [
      "(",
      neu,
      mehrzahl(neu, "el", { one: () => " νέο)", other: () => " νέα)" }),
    ],
    meineStatistik: "Η πρόοδός μου",
    passwortAendern: "Αλλαγή κωδικού πρόσβασης",
    melden: "Αναφορά",
    abmelden: "Αποσύνδεση",
    konto: (k: string) => `Λογαριασμός (${k})`,
    farben: (alt: string) => `Χρώματα και αντίθεση (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_EL[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Απενεργοποίηση" : "Ενεργοποίηση"} εκφώνησης (${alt} + V)`,
    vorlesenName: (alt: string) => `Εκφώνηση (${alt} + V)`,
    wahltaste: "Option",
    statistikSchliessen: " Κλείσιμο προόδου",
  },
  hu: {
    zurLernplattform: "Ugrás a tanulási platformra",
    startseite: "Sensorik tanulási platform, ugrás a főoldalra",
    heimweg: "Vissza a programhoz - bezár mindent, ami nyitva van (mint az Esc billentyű).",
    werkzeuge: "Eszközök",
    zuMeinenKlassen: "Vissza: Osztályaim (Alt + S)",
    meineKlassen: "Osztályaim",
    hilfeTipp: (k: string) => `Súgó (${k})`,
    hilfeName: (k: string) => `Súgó könnyen érthetően (${k})`,
    kurztastenTipp: (k: string) => `Minden billentyűparancs (${k})`,
    kurztastenName: (k: string) => `Billentyűparancsok - a teljes lista (${k})`,
    erkundenTipp: (k: string) => `Billentyűk felfedezése (${k})`,
    erkundenName: (k: string) => `Billentyűk felfedezése - a program minden billentyű nevét bemondja (${k})`,
    einstellungen: (k: string) => `Beállítások (${k})`,
    // Zahl + Hauptwort = Einzahl (Glossar Regel 13): beide Formen gleich.
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - fiók és fejlődés (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "hu", { one: (z) => `${z} új üzenet`, other: (z) => `${z} új üzenet` })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Saját fiók: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "hu", { one: (z) => `${z} új üzenet`, other: (z) => `${z} új üzenet` })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (tanár)`,
    klassenZeile: (name: string, klasse: string) => `${name}, osztály: ${klasse}`,
    nachrichten: "Üzenetek",
    // In Teilen wie im Deutschen: die Zahl bleibt ein eigener Textknoten.
    nachrichtenNeu: (neu: number) => [
      "(",
      neu,
      mehrzahl(neu, "hu", { one: () => " új)", other: () => " új)" }),
    ],
    meineStatistik: "Fejlődésem",
    passwortAendern: "Jelszó módosítása",
    melden: "Bejelentés",
    abmelden: "Kijelentkezés",
    konto: (k: string) => `Fiók (${k})`,
    farben: (alt: string) => `Színek és kontraszt (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_HU[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `Felolvasás ${an ? "kikapcsolása" : "bekapcsolása"} (${alt} + V)`,
    vorlesenName: (alt: string) => `Felolvasás (${alt} + V)`,
    wahltaste: "Option",
    statistikSchliessen: " Fejlődésem bezárása",
  },
  nl: {
    zurLernplattform: "Naar het leerplatform",
    startseite: "Leerplatform Sensorik, naar de beginpagina",
    heimweg: "Terug naar het programma - sluit alles wat open is (zoals Esc).",
    werkzeuge: "Extra",
    zuMeinenKlassen: "Terug naar Mijn klassen (Alt + S)",
    meineKlassen: "Mijn klassen",
    hilfeTipp: (k: string) => `Help (${k})`,
    hilfeName: (k: string) => `Help in eenvoudige taal (${k})`,
    kurztastenTipp: (k: string) => `Alle sneltoetsen (${k})`,
    kurztastenName: (k: string) => `Sneltoetsen - de hele lijst (${k})`,
    erkundenTipp: (k: string) => `Toetsen verkennen (${k})`,
    erkundenName: (k: string) => `Toetsen verkennen - elke toets wordt uitgesproken (${k})`,
    einstellungen: (k: string) => `Instellingen (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - account en voortgang (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "nl", { one: (z) => `${z} nieuw bericht`, other: (z) => `${z} nieuwe berichten` })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Mijn account: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "nl", { one: (z) => `${z} nieuw bericht`, other: (z) => `${z} nieuwe berichten` })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (leerkracht)`,
    klassenZeile: (name: string, klasse: string) => `${name}, klas ${klasse}`,
    nachrichten: "Berichten",
    // In Teilen wie im Deutschen: die Zahl bleibt ein eigener Textknoten.
    nachrichtenNeu: (neu: number) => ["(", neu, " nieuw)"],
    meineStatistik: "Mijn voortgang",
    passwortAendern: "Wachtwoord wijzigen",
    melden: "Melden",
    abmelden: "Uitloggen",
    konto: (k: string) => `Account (${k})`,
    farben: (alt: string) => `Kleuren en contrast (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_NL[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `Voorlezen ${an ? "uitzetten" : "aanzetten"} (${alt} + V)`,
    vorlesenName: (alt: string) => `Voorlezen (${alt} + V)`,
    wahltaste: "Option",
    statistikSchliessen: " Voortgang sluiten",
  },
  pt: {
    zurLernplattform: "Ir para a plataforma de aprendizagem",
    startseite: "Plataforma de aprendizagem Sensorik, ir para a página inicial",
    heimweg: "Voltar ao programa - fecha tudo o que estiver aberto (como a tecla Esc).",
    werkzeuge: "Ferramentas",
    zuMeinenKlassen: "Voltar à área As minhas turmas (Alt + S)",
    meineKlassen: "As minhas turmas",
    hilfeTipp: (k: string) => `Ajuda (${k})`,
    hilfeName: (k: string) => `Ajuda em palavras simples (${k})`,
    kurztastenTipp: (k: string) => `Todos os atalhos de teclado (${k})`,
    kurztastenName: (k: string) => `Atalhos de teclado - a lista completa (${k})`,
    erkundenTipp: (k: string) => `Explorar as teclas (${k})`,
    erkundenName: (k: string) => `Explorar as teclas - o programa diz o nome de cada tecla (${k})`,
    einstellungen: (k: string) => `Definições (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - conta e progressos (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "pt", {
            one: (z) => `${z} mensagem nova`,
            other: (z) => `${z} mensagens novas`,
            many: (z) => `${z} de mensagens novas`,
          })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `A minha conta: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "pt", {
            one: (z) => `${z} mensagem nova`,
            other: (z) => `${z} mensagens novas`,
            many: (z) => `${z} de mensagens novas`,
          })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (docente)`,
    klassenZeile: (name: string, klasse: string) => `${name}, turma ${klasse}`,
    nachrichten: "Mensagens",
    // In Teilen wie im Deutschen: die Zahl bleibt ein eigener Textknoten.
    nachrichtenNeu: (neu: number) => [
      "(",
      neu,
      mehrzahl(neu, "pt", { one: () => " nova)", other: () => " novas)", many: () => " novas)" }),
    ],
    meineStatistik: "Os meus progressos",
    passwortAendern: "Alterar palavra-passe",
    melden: "Comunicar",
    abmelden: "Terminar sessão",
    konto: (k: string) => `Conta (${k})`,
    farben: (alt: string) => `Cores e contraste (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_PT[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Desligar" : "Ligar"} a leitura em voz alta (${alt} + V)`,
    vorlesenName: (alt: string) => `Leitura em voz alta (${alt} + V)`,
    wahltaste: "Opção",
    statistikSchliessen: " Fechar progressos",
  },
  br: {
    zurLernplattform: "Ir para a plataforma de aprendizagem",
    startseite: "Plataforma de aprendizagem Sensorik, página inicial",
    heimweg: "Voltar ao aplicativo - fecha tudo o que estiver aberto (como a tecla Esc).",
    werkzeuge: "Ferramentas",
    zuMeinenKlassen: "Voltar para Minhas turmas (Alt + S)",
    meineKlassen: "Minhas turmas",
    hilfeTipp: (k: string) => `Ajuda (${k})`,
    hilfeName: (k: string) => `Ajuda em linguagem simples (${k})`,
    kurztastenTipp: (k: string) => `Todos os atalhos de teclado (${k})`,
    kurztastenName: (k: string) => `Atalhos de teclado - a lista completa (${k})`,
    erkundenTipp: (k: string) => `Explorar teclas (${k})`,
    erkundenName: (k: string) => `Explorar teclas - o programa diz o nome de cada tecla (${k})`,
    einstellungen: (k: string) => `Configurações (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - conta e progresso (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "br", {
            one: (z) => `${z} mensagem nova`,
            other: (z) => `${z} mensagens novas`,
          })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Minha conta: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "br", {
            one: (z) => `${z} mensagem nova`,
            other: (z) => `${z} mensagens novas`,
          })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (docente)`,
    klassenZeile: (name: string, klasse: string) => `${name}, turma ${klasse}`,
    nachrichten: "Mensagens",
    nachrichtenNeu: (neu: number) => [
      "(",
      neu,
      mehrzahl(neu, "br", { one: () => " nova)", other: () => " novas)" }),
    ],
    meineStatistik: "Meu progresso",
    passwortAendern: "Alterar senha",
    melden: "Relatar",
    abmelden: "Sair",
    konto: (k: string) => `Conta (${k})`,
    farben: (alt: string) => `Cores e contraste (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_BR[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Desligar" : "Ligar"} a leitura em voz alta (${alt} + V)`,
    vorlesenName: (alt: string) => `Leitura em voz alta (${alt} + V)`,
    wahltaste: "Option",
    statistikSchliessen: " Fechar Meu progresso",
  },
  ro: {
    zurLernplattform: "La platforma de învățare",
    startseite: "Platforma de învățare Sensorik, pagina principală",
    heimweg: "Înapoi în program - închide tot ce este deschis (ca tasta Esc).",
    werkzeuge: "Instrumente",
    zuMeinenKlassen: "Înapoi la Clasele mele (Alt + S)",
    meineKlassen: "Clasele mele",
    hilfeTipp: (k: string) => `Ajutor (${k})`,
    hilfeName: (k: string) => `Ajutor în cuvinte simple (${k})`,
    kurztastenTipp: (k: string) => `Toate comenzile rapide de la tastatură (${k})`,
    kurztastenName: (k: string) => `Comenzi rapide de la tastatură - lista completă (${k})`,
    erkundenTipp: (k: string) => `Explorarea tastelor (${k})`,
    erkundenName: (k: string) => `Explorarea tastelor - programul spune numele fiecărei taste (${k})`,
    einstellungen: (k: string) => `Setări (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - cont și progres (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "ro", {
            one: (z) => `${z} mesaj nou`,
            few: (z) => `${z} mesaje noi`,
            other: (z) => `${z} de mesaje noi`,
          })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Contul meu: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "ro", {
            one: (z) => `${z} mesaj nou`,
            few: (z) => `${z} mesaje noi`,
            other: (z) => `${z} de mesaje noi`,
          })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (cadru didactic)`,
    klassenZeile: (name: string, klasse: string) => `${name}, clasa ${klasse}`,
    nachrichten: "Mesaje",
    // In Teilen wie im Deutschen: die Zahl bleibt ein eigener Textknoten.
    nachrichtenNeu: (neu: number) => [
      "(",
      neu,
      mehrzahl(neu, "ro", { one: () => " nou)", few: () => " noi)", other: () => " noi)" }),
    ],
    meineStatistik: "Progresul meu",
    passwortAendern: "Schimbați parola",
    melden: "Raportați",
    abmelden: "Deconectați-vă",
    konto: (k: string) => `Cont (${k})`,
    farben: (alt: string) => `Culori și contrast (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_RO[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Dezactivați" : "Activați"} citirea cu voce tare (${alt} + V)`,
    vorlesenName: (alt: string) => `Citire cu voce tare (${alt} + V)`,
    wahltaste: "Opțiune",
    statistikSchliessen: " Închideți progresul",
  },
  sv: {
    zurLernplattform: "Gå till lärplattformen",
    startseite: "Lärplattformen Sensorik, gå till startsidan",
    heimweg: "Tillbaka till programmet - stänger allt som är öppet (som Esc).",
    werkzeuge: "Verktyg",
    zuMeinenKlassen: "Tillbaka till Mina klasser (Alt + S)",
    meineKlassen: "Mina klasser",
    hilfeTipp: (k: string) => `Hjälp (${k})`,
    hilfeName: (k: string) => `Hjälp på lätt svenska (${k})`,
    kurztastenTipp: (k: string) => `Alla kortkommandon (${k})`,
    kurztastenName: (k: string) => `Kortkommandon - hela listan (${k})`,
    erkundenTipp: (k: string) => `Utforska tangenterna (${k})`,
    erkundenName: (k: string) => `Utforska tangenterna - programmet säger namnet på varje tangent (${k})`,
    einstellungen: (k: string) => `Inställningar (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - konto och framsteg (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "sv", { one: (z) => `${z} nytt meddelande`, other: (z) => `${z} nya meddelanden` })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Mitt konto: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "sv", { one: (z) => `${z} nytt meddelande`, other: (z) => `${z} nya meddelanden` })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (lärare)`,
    klassenZeile: (name: string, klasse: string) => `${name}, klass ${klasse}`,
    nachrichten: "Meddelanden",
    // In Teilen wie im Deutschen: die Zahl bleibt ein eigener Textknoten.
    nachrichtenNeu: (neu: number) => [
      "(",
      neu,
      mehrzahl(neu, "sv", { one: () => " nytt)", other: () => " nya)" }),
    ],
    meineStatistik: "Mina framsteg",
    passwortAendern: "Ändra lösenord",
    melden: "Rapportera",
    abmelden: "Logga ut",
    konto: (k: string) => `Konto (${k})`,
    farben: (alt: string) => `Färger och kontrast (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_SV[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Stäng av" : "Slå på"} uppläsning (${alt} + V)`,
    vorlesenName: (alt: string) => `Uppläsning (${alt} + V)`,
    wahltaste: "Alternativ",
    statistikSchliessen: " Stäng Mina framsteg",
  },
  uk: {
    zurLernplattform: "Перейти на навчальну платформу",
    startseite: "Навчальна платформа Sensorik, перейти на головну сторінку",
    heimweg: "Назад до програми - закриває все відкрите (як клавіша Esc).",
    werkzeuge: "Інструменти",
    zuMeinenKlassen: "Назад до розділу Мої класи (Alt + S)",
    meineKlassen: "Мої класи",
    hilfeTipp: (k: string) => `Довідка (${k})`,
    hilfeName: (k: string) => `Довідка простими словами (${k})`,
    kurztastenTipp: (k: string) => `Усі сполучення клавіш (${k})`,
    kurztastenName: (k: string) => `Сполучення клавіш - повний список (${k})`,
    erkundenTipp: (k: string) => `Дослідити клавіші (${k})`,
    erkundenName: (k: string) => `Дослідити клавіші - програма називає кожну клавішу (${k})`,
    einstellungen: (k: string) => `Налаштування (${k})`,
    kontoTipp: (zeile: string, k: string, neu: number) =>
      `${zeile} - обліковий запис і поступ (${k})` +
      (neu > 0
        ? ` - ${mehrzahl(neu, "uk", {
            one: (z) => `${z} нове повідомлення`,
            few: (z) => `${z} нові повідомлення`,
            many: (z) => `${z} нових повідомлень`,
            other: (z) => `${z} нового повідомлення`,
          })}`
        : ""),
    kontoName: (zeile: string, k: string, neu: number) =>
      `Мій обліковий запис: ${zeile} (${k})` +
      (neu > 0
        ? `, ${mehrzahl(neu, "uk", {
            one: (z) => `${z} нове повідомлення`,
            few: (z) => `${z} нові повідомлення`,
            many: (z) => `${z} нових повідомлень`,
            other: (z) => `${z} нового повідомлення`,
          })}`
        : ""),
    lehrkraftZeile: (name: string) => `${name} (педагог)`,
    klassenZeile: (name: string, klasse: string) => `${name}, клас ${klasse}`,
    nachrichten: "Повідомлення",
    nachrichtenNeu: (neu: number) => [
      "(",
      neu,
      mehrzahl(neu, "uk", { one: () => " нове)", few: () => " нові)", many: () => " нових)", other: () => " нового)" }),
    ],
    meineStatistik: "Мій поступ",
    passwortAendern: "Змінити пароль",
    melden: "Повідомити",
    abmelden: "Вийти",
    konto: (k: string) => `Обліковий запис (${k})`,
    farben: (alt: string) => `Кольори й контраст (${alt} + K)`,
    farbName: (id: ContrastMode, _deutsch: string) => CONTRAST_NAMEN_UK[id],
    vorlesenTipp: (an: boolean, alt: string) =>
      `${an ? "Вимкнути" : "Увімкнути"} читання вголос (${alt} + V)`,
    vorlesenName: (alt: string) => `Читання вголос (${alt} + V)`,
    wahltaste: "Option",
    statistikSchliessen: " Закрити поступ",
  },
});

/**
 * Der Sprachschalter spricht die ZIELSPRACHE: Er muss auch lesen können, wer
 * die aktuelle Sprache nicht versteht. Darum hängen Name und Hinweis nicht an
 * der Bedienungssprache, sondern an der Sprache, in die er wechselt - und der
 * Hinweis ist zweisprachig (Bauplan §3.3).
 */
const SPRACHSCHALTER_ZIEL: Record<BedienSprache, { kuerzel: string; name: string; tipp: string }> = mitRueckfallEn(/* ★ O-CS (03.10.2026): alle Sprachen eingetragen */ {
  en: { kuerzel: "EN", name: "EN - English", tipp: "English - Bedienung auf Englisch" },
  de: { kuerzel: "DE", name: "DE - Deutsch", tipp: "Deutsch - switch to German" },
  // ★ E2b (25.09.2026): der ALTE Zwei-Wege-Umschalter erreicht „fr" weiterhin
  // NIE (er bleibt de/en, `ziel` unten wechselt nur zwischen den beiden). Der
  // NEUE Sprachwähler (Bauplan D9/§9.3, `sprachen`-Eigenschaft) liest aber nur
  // das `kuerzel` von hier, für die AKTIVE Sprache - `fr` ist darum jetzt
  // wirklich erreichbar, das `name`/`tipp` dieses Eintrags bleibt ungenutzt
  // (der neue Wähler hat seine eigenen Texte, `SPRACHWAHL_NAME`/`SPRACHWAHL_LABEL`).
  fr: { kuerzel: "FR", name: "FR - Français", tipp: "Français - Bedienung auf Französisch" },
  // ★ ES-F2: wie bei „fr" - der ALTE Zwei-Wege-Umschalter erreicht „es" nie,
  // dieser Eintrag bleibt ungenutzt; der neue Sprachwähler liest nur `kuerzel`.
  es: { kuerzel: "ES", name: "ES - Español", tipp: "Español - Bedienung auf Spanisch" },
  // G2a: wie „fr" und „es" - der alte Zwei-Wege-Umschalter erreicht sie nie; das
  // `kuerzel` liest der neue Wähler für die AKTIVE Sprache.
  it: { kuerzel: "IT", name: "IT - Italiano", tipp: "Italiano - Bedienung auf Italienisch" },
  pl: { kuerzel: "PL", name: "PL - Polski", tipp: "Polski - Bedienung auf Polnisch" },
  tr: { kuerzel: "TR", name: "TR - Türkçe", tipp: "Türkçe - Bedienung auf Türkisch" },
  cs: { kuerzel: "CS", name: "CS - Čeština", tipp: "Čeština - Bedienung auf Tschechisch" },
  // ★ G2-NEUN (25.10.2026): Selbstnamen und Kürzel (Ukrainisch „UA", nicht „UK" - das liest man als Vereinigtes Königreich).
  bg: { kuerzel: "BG", name: "BG - Български", tipp: "Български - Bedienung auf Bulgarisch" },
  el: { kuerzel: "EL", name: "EL - Ελληνικά", tipp: "Ελληνικά - Bedienung auf Griechisch" },
  hu: { kuerzel: "HU", name: "HU - Magyar", tipp: "Magyar - Bedienung auf Ungarisch" },
  nl: { kuerzel: "NL", name: "NL - Nederlands", tipp: "Nederlands - Bedienung auf Niederländisch" },
  pt: { kuerzel: "PT", name: "PT - Português (Portugal)", tipp: "Português (Portugal) - Bedienung auf Portugiesisch (Portugal)" },
  br: { kuerzel: "BR", name: "BR - Português (Brasil)", tipp: "Português (Brasil) - Bedienung auf Portugiesisch (Brasilien)" },
  ro: { kuerzel: "RO", name: "RO - Română", tipp: "Română - Bedienung auf Rumänisch" },
  sv: { kuerzel: "SV", name: "SV - Svenska", tipp: "Svenska - Bedienung auf Schwedisch" },
  uk: { kuerzel: "UA", name: "UA - Українська", tipp: "Українська - Bedienung auf Ukrainisch" },
});

/**
 * ★★ E2b (25.09.2026, Bauplan §9.3): DER NEUE SPRACHWÄHLER (drei oder mehr
 * Sprachen, `sprachen`-Eigenschaft) - jede Sprache genannt WIE SIE SICH
 * SELBST NENNT („Deutsch", „English", „Français"), mit `lang` am Eintrag.
 * Getrennt von {@link SPRACHSCHALTER_ZIEL} (das die ZIEL-Ansage des alten
 * ZWEI-Wege-Umschalters trägt, unverändert): Der neue Wähler zeigt alle
 * Sprachen auf einmal in einer Liste, nicht nur „die andere".
 */
const SPRACHWAHL_NAME: Record<BedienSprache, string> = {
  de: "Deutsch",
  en: "English",
  fr: "Français",
  // ★ ES-F2: nur sichtbar, wenn der Sprachwähler „es" überhaupt anbietet -
  // das tut er nur mit dem spanischen Probe-Schalter (`spanischAn`).
  es: "Español",
  // G2a: jede Sprache nennt sich, wie sie sich selbst nennt (echte Werte).
  it: "Italiano",
  pl: "Polski",
  tr: "Türkçe",
  cs: "Čeština",
  // ★ G2-NEUN (25.10.2026): jede Sprache nennt sich, wie sie sich selbst nennt (echte Werte; nur mit ihrem Schalter sichtbar).
  bg: "Български",
  el: "Ελληνικά",
  hu: "Magyar",
  nl: "Nederlands",
  pt: "Português (Portugal)",
  br: "Português (Brasil)",
  ro: "Română",
  sv: "Svenska",
  uk: "Українська",
};

/**
 * ★ E2b (Bauplan §9.3, wörtlich): „Name für Screenreader in allen drei
 * Sprachen zugleich - so findet jede Person den Schalter, auch wenn gerade
 * eine fremde Sprache eingestellt ist." Für den `aria-label` DES KNOPFS UND
 * den Tipp (kein `title`) - beide dreisprachig, wie gefordert.
 */
const SPRACHWAHL_LABEL = "Sprache - Language - Langue";

/**
 * ★ ES-O (27.09.2026): Bietet der Wähler auch „es" an, nennt der Name den
 * Schalter zusätzlich auf Spanisch. Ohne „es" bleibt es Byte für Byte
 * {@link SPRACHWAHL_LABEL}.
 */
const SPRACHWAHL_LABEL_MIT_ES = "Sprache - Language - Langue - Idioma";

/**
 * ★ 10.10.2026: Der Name nennt den Schalter zusätzlich in jeder angebotenen
 * neuen Sprache (Lingua, Język, Dil, Jazyk) - so findet ihn jede Person, auch
 * wenn gerade eine fremde Sprache eingestellt ist. Mit höchstens fr/es bleibt
 * es Byte für Byte wie vorher.
 */
const SPRACHWAHL_WORT_NEU: Readonly<Record<string, string>> = {
  it: "Lingua",
  pl: "Język",
  tr: "Dil",
  cs: "Jazyk",
  // ★ G2-NEUN (25.10.2026): das Wort „Sprache" in den neun Sprachen des Gerüsts (pt/br „Idioma" wie es - steht nur einmal im Namen).
  bg: "Език",
  el: "Γλώσσα",
  hu: "Nyelv",
  nl: "Taal",
  pt: "Idioma",
  br: "Idioma",
  ro: "Limbă",
  sv: "Språk",
  uk: "Мова",
};

/**
 * ★ 06.11.2026: das `lang` eines Eintrags im Sprachwähler. Brasilien heisst intern „br" - als `lang="br"` läse NVDA/JAWS
 * „Português (Brasil)" mit der bretonischen Stimme; richtig ist `pt-BR` (wie `<html lang>`, `GEBIET` in `bedienSprache/texte.ts`).
 */
function sprachwahlLang(code: string): string {
  return code === "br" ? "pt-BR" : code;
}

function sprachwahlLabel(sprachen: readonly string[]): string {
  let l = sprachen.includes("es") ? SPRACHWAHL_LABEL_MIT_ES : SPRACHWAHL_LABEL;
  // ★ G2-NEUN (25.10.2026): über die Tabelle (it, pl, tr, cs, dann die neun des Gerüsts) - ein Wort, das schon im
  // Namen steht („Idioma" von es, pt und br), nur einmal. Mit höchstens it/pl/tr/cs Byte für Byte wie vorher.
  for (const k of Object.keys(SPRACHWAHL_WORT_NEU)) {
    if (sprachen.includes(k) && !l.split(" - ").includes(SPRACHWAHL_WORT_NEU[k])) l += ` - ${SPRACHWAHL_WORT_NEU[k]}`;
  }
  return l;
}

/** Name + Klasse in EINER Zeile — überall gleich formuliert. */
export function kontoZeile(account: KopfKonto, sprache: BedienSprache = "de"): string {
  const t = KOPF_TEXTE[sprache];
  if (account.istLehrkraft) return t.lehrkraftZeile(account.name);
  return account.classCode ? t.klassenZeile(account.name, account.classCode) : account.name;
}

/**
 * ★★ DIE DREI SPERREN EINER ALT-TASTE - an EINER Stelle (30.08.2026).
 *
 * Alt + J (Konto) und Alt + K (Farbe) werden beide hier in der Kopfzeile
 * behandelt, weil hier die Knöpfe wohnen ([[feedback_shortcut_konzept]]). Beide
 * brauchen dieselben drei Sperren; als zwei Abschriften liefen sie beim
 * nächsten Nachbessern auseinander:
 *
 *  · Strg/Cmd dabei ⇒ nicht unseres.
 *  · Die Seite hat die Taste schon behandelt (`defaultPrevented`) ⇒ nicht mehr
 *    unsere.
 *  · Der Fokus steht in einem ECHTEN Formularfeld ⇒ Finger weg. Sonst frisst
 *    der Handler Tastendrücke, bevor NVDA/JAWS sie als Eingabe erkennen
 *    (NVDA-Test 01.07.2026). Ausgenommen ist allein das Tippfeld
 *    (`data-typing-field="practice"`), wo Alt-Kombis nie als Anschlag zählen.
 *  · Ein modaler Dialog ist offen ⇒ nichts tun. Die aufgeklappte Liste läge
 *    sonst HINTER dem Dialog: sichtbar unerreichbar, für die Sprachausgabe ein
 *    zweiter Ort, an dem der Fokus plötzlich steht. `Modal` kennzeichnet sich
 *    mit `role="dialog" aria-modal="true"`, das genügt als Erkennung.
 */
/**
 * ⚠️⚠️ SIE PRÜFT `e.code`, NICHT `e.key` - und darum wird sie seit dem
 * 05.09.2026 auch nach aussen gegeben (rein additiv, das Verhalten der
 * Kopfzeile ändert sich dadurch nicht).
 *
 * Gemessen an `BereichSchalter.tsx`: Der verglich `e.key.toLowerCase()` mit
 * dem Buchstaben. Auf dem Mac liefert die Wahltaste aber ein Sonderzeichen -
 * Alt + B ergibt `„∫"`, nicht `„b"`. Die Kurztaste für „Meine Blätter" war
 * also gebaut, dokumentiert, in `aria-keyshortcuts` angesagt - und konnte
 * niemals greifen. `e.code` ist der Name der TASTE und bleibt `„KeyB"`.
 * ⇒ Wer ein zweites Regelwerk daneben stellt, hat die Doppelung, die genau bis
 * zur ersten Nachbesserung gleich bleibt
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export function unsereAltTaste(
  e: KeyboardEvent,
  code: string,
  /**
   * ★★★★ DER EIGENE DIALOG DARF SICH MIT SEINER EIGENEN TASTE SCHLIESSEN
   * (09.09.2026, aus der Meldung „ALT+T funktioniert immer noch nicht").
   *
   * Ohne diese Ausnahme öffnet Alt + T die Kurztasten-Liste und bekommt sie
   * nie wieder zu: `Modal` setzt `aria-modal`, und die Sperre unten macht ab
   * diesem Augenblick JEDE Alt-Taste taub. Punktgenau, Klangpunkte und »Im
   * Griff« kennen die Ausnahme seit dem 02.07.2026 - nur schreibt sie dort
   * jede App für sich hin (`if (dialogOpen && !showShortcutsRef.current)`).
   *
   * ⚠️ Sie gilt NUR für das Fenster, dem die Taste gehört. Wer sie setzt, muss
   * wissen, dass sein eigenes offen ist; ein FREMDER Dialog macht die Taste
   * weiterhin taub - sonst spränge der Fokus aus ihm heraus.
   */
  eigenerDialogOffen = false,
): boolean {
  if (!e.altKey || e.ctrlKey || e.metaKey) return false;
  if (e.code !== code) return false;
  if (e.defaultPrevented) return false;
  const ziel = e.target as HTMLElement | null;
  const tag = ziel?.tagName;
  /**
   * ★★★★★ EIN FELD DARF DIE KÜRZEL DURCHLASSEN - gemessen am 07.09.2026.
   *
   * ⚠️⚠️ Johannes: „tastenkombinationen funktionieren in mathecoach nicht".
   * Sie waren gebaut, dokumentiert und in der Kurztastenliste versprochen -
   * und **konnten nie greifen**: Diese Wache schaltet jedes Alt-Kürzel ab,
   * sobald der Fokus in einem Eingabefeld steht. In Tastenflow ist das
   * richtig (dort ist das Feld die Übung, und `data-typing-field="practice"`
   * war die eine Ausnahme). In **Mathecoach steht ein Kind IMMER in einem
   * Feld** - es rechnet ja. Damit war jedes einzelne Kürzel tot, genau
   * solange gedrückt wurde.
   *
   * ⇒ `data-kuerzel="an"` ist die zweite, allgemeine Ausnahme. Sie sagt, was
   * gemeint ist („in diesem Feld gelten die Kürzel weiter"), statt ein Feld
   * zur Tipp-Übung zu erklären, das keine ist. Bestehende Apps ändern sich
   * dadurch nicht - es kommt nur etwas dazu.
   *
   * ⚠️ Der Preis ist bekannt und in Kauf genommen: Am Mac schreibt die
   * Wahltaste in einem Feld sonst ein Sonderzeichen. Wer diese Ausnahme
   * setzt, MUSS im Kürzel `preventDefault()` rufen.
   */
  /**
   * ⚠️⚠️ `dataset?.` MIT FRAGEZEICHEN - hier bin ich am 07.09.2026 hineingelaufen.
   * Das Ziel eines Tastendrucks ist nicht immer ein HTML-Element: Wer auf
   * `document` hört, bekommt ein Ziel ohne `dataset`. Vorher stand die Abfrage
   * HINTER der Tag-Prüfung und wurde deshalb nur für echte Felder ausgewertet;
   * herausgezogen wirft sie ohne dieses Fragezeichen - und riss die Kürzel in
   * VIER anderen Testdateien mit (7 Proben, auch Tastenflow und die Kopfzeile).
   */
  const laesstDurch =
    ziel?.dataset?.typingField === "practice" || ziel?.dataset?.kuerzel === "an";
  if ((tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") && !laesstDurch) return false;
  if (!eigenerDialogOffen && document.querySelector('[role="dialog"][aria-modal="true"]'))
    return false;
  return true;
}

/**
 * ★★ DIE EINE AUFKLAPP-MECHANIK der Kopfzeile (herausgezogen 30.08.2026).
 *
 * Sie war für das Konto-Menü gebaut; mit dem Farbschalter braucht sie ein
 * zweites Mal genau dasselbe Verhalten. Herausgezogen statt abgeschrieben - ein
 * zweites Fokus-Regelwerk daneben wäre die Doppelung, die genau bis zur ersten
 * Nachbesserung gleich bleibt.
 *
 * Bewusst KEIN `role="menu"`: Ein echtes Menü verlangt Pfeiltasten-Steuerung;
 * ein Kind mit Screenreader kommt mit Tab und Enter zuverlässiger zurecht.
 * Escape schließt und gibt den Fokus zurück (K27), ein Klick daneben schließt
 * ebenfalls, und frisch aufgeklappt steht der Fokus auf dem ersten Punkt.
 * Fokus per `setTimeout(0)` ([[feedback_fokus_pflicht_alle_apps]]).
 */
function useAufklapper(escAfterClose?: () => void) {
  const [offen, setOffen] = useState(false);
  const knopfRef = useRef<HTMLButtonElement>(null);
  const listeRef = useRef<HTMLDivElement>(null);
  const menuId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const escRef = useRef(escAfterClose);
  escRef.current = escAfterClose;
  const schliessen = useCallback((fokusZurueck: boolean) => {
    setOffen(false);
    if (!fokusZurueck) return;
    // App-eigene Rückkehr hat Vorrang (Tastenflow: in die Eingabezeile),
    // sonst der Öffner-Knopf (K27).
    const eigene = escRef.current;
    if (eigene) eigene();
    else window.setTimeout(() => knopfRef.current?.focus(), 0);
  }, []);

  // Escape schließt (K27: Fokus zurück auf den Öffner), ein Klick daneben auch.
  useEffect(() => {
    if (!offen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        schliessen(true);
      }
    };
    const onClick = (e: MouseEvent) => {
      const ziel = e.target as Node;
      if (listeRef.current?.contains(ziel) || knopfRef.current?.contains(ziel)) return;
      schliessen(false);
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("mousedown", onClick);
    };
  }, [offen, schliessen]);

  // Frisch aufgeklappt: Fokus auf den ersten Punkt (Tastatur-Bedienung) -
  // ★ 25.09.: in einer Auswahlliste (Sprachwähler) auf die GEWÄHLTE Option,
  // wie es das Listbox-Muster verlangt; Menüs ohne `aria-selected` wie bisher.
  useEffect(() => {
    if (!offen) return;
    const id = window.setTimeout(() => {
      const liste = listeRef.current;
      (liste?.querySelector<HTMLElement>('[aria-selected="true"]') ??
        liste?.querySelector<HTMLElement>("a, button"))?.focus();
    }, 0);
    return () => window.clearTimeout(id);
  }, [offen]);

  return { offen, setOffen, schliessen, knopfRef, listeRef, menuId };
}

/** Die Teile der Werkzeug-Reihe, in der Reihenfolge, in der sie sonst stehen. */
export type KopfTeil = "extra" | "melden" | "kurztasten" | "hilfe" | "nachrichten" | "einstellungen" | "konto" | "strich" | "farben" | "rest";

/** Die Teile in Wunsch-Reihenfolge: die genannten zuerst, die anderen danach wie gewohnt. */
function ordneKopfTeile(reihenfolge: readonly KopfTeil[] | undefined, teile: [KopfTeil, ReactNode][]): ReactNode[] {
  const geordnet = reihenfolge?.length
    ? [...reihenfolge.map((k) => teile.find(([n]) => n === k)).filter((x): x is [KopfTeil, ReactNode] => !!x),
      ...teile.filter(([n]) => !reihenfolge.includes(n))]
    : teile;
  return geordnet.map(([n, el]) => <Fragment key={n}>{el}</Fragment>);
}

export function AppKopfzeile({
  titel,
  titelKlasse,
  beta,
  titelId,
  zeichen,
  ohneHeimVerweis = false,
  heimNurZeichen = false,
  bereich,
  trennstrich = false,
  menueReihenfolge,
  hilfeKurz = false,
  meldenRund = false,
  meldenOhneAnmeldung = false,
  meldenFuerKinder = false,
  onHilfe,
  onKurztasten,
  kurztastenOffen,
  onTastenErkunden,
  tastenErkundenOffen,
  tastenErkundenKuerzel = "Alt + 3",
  hilfeKuerzel = "Alt + H",
  kurztastenKuerzel = "Alt + T",
  account,
  onAbmelden,
  onAnmelden,
  anmeldenRef,
  onStatistik,
  onPasswort,
  klasseHref,
  bellAfterClose,
  escAfterClose,
  onEinstellungen,
  einstellungenOffen,
  einstellungenControls,
  einstellungenKuerzel = "Alt + O",
  kontoKuerzel = "Alt + J",
  extra,
  onZumProgramm,
  onVorlesen,
  vorlesenAn,
  akustikMenue,
  onFarbeGewaehlt,
  bedienSprache: bedienSpracheProp,
  sprachSchalter: sprachSchalterProp,
  sprachen: sprachenProp,
}: AppKopfzeileProps) {
  // ★ EN0 (18.09.2026): ohne Props gilt der Provider - ohne (aktiven) Provider
  // „de" und kein Schalter, also genau die Kopfzeile von vorher.
  const bereichSprache = useBedienSprache();
  const bedienSprache = bedienSpracheProp ?? bereichSprache.sprache;
  // ★ E2b (25.09.2026): `spracheGewaehlt` statt `sprache` - die WIRKLICHE
  // Auswahl (kann „fr" sein), nicht die oberflächen-sichere. Ändert nichts,
  // solange der französische Schalter aus ist: dann ist `spracheGewaehlt`
  // immer gleich `sprache` (siehe `BedienSpracheProvider.tsx`).
  const sprachSchalter =
    sprachSchalterProp ??
    (bereichSprache.bereichAktiv
      ? { sprache: bereichSprache.spracheGewaehlt, onWechsel: bereichSprache.wechsle }
      : undefined);
  const sprachen =
    sprachenProp ?? (bereichSprache.bereichAktiv ? bereichSprache.spracheOptionen : undefined);
  const t = KOPF_TEXTE[bedienSprache];
  /*
   * ★ AM MAC HEISST DIE TASTE „WAHL" - in jeder App, an jedem Knopf (Johannes,
   * 18.10.2026: „beim Mac überall Wahl, wenn nicht, dann mit Fußnote"). Erkannt
   * wird das System, nicht eine Wahl der App (`lib/altTaste.ts`). Bis dahin
   * stand „Wahl" nur, wo eine App es selbst hereinreichte (»Im Griff«).
   * `aria-keyshortcuts` bleibt der technische Name „Alt+X" (`ariaKuerzel`).
   */
  const mac = istMacSystem();
  hilfeKuerzel = altAnzeige(hilfeKuerzel, mac, t.wahltaste);
  kurztastenKuerzel = altAnzeige(kurztastenKuerzel, mac, t.wahltaste);
  tastenErkundenKuerzel = altAnzeige(tastenErkundenKuerzel, mac, t.wahltaste);
  einstellungenKuerzel = altAnzeige(einstellungenKuerzel, mac, t.wahltaste);
  kontoKuerzel = altAnzeige(kontoKuerzel, mac, t.wahltaste);
  // Das Konto-Menü und der Farbschalter teilen sich EINE Mechanik (oben).
  const {
    offen,
    setOffen,
    schliessen,
    knopfRef,
    listeRef,
    menuId,
  } = useAufklapper(escAfterClose);

  /* ══════════════════════════════════════════════════════════════════════
     ALT + J - DER KONTO-SCHALTER (Johannes 25.08.2026: „wir brauchen ein
     Tastenkürzel für den Accountschalter/Benutzerschalter").
     ══════════════════════════════════════════════════════════════════════
     Abgemeldet führt die Taste zur Anmeldung, angemeldet öffnet und schließt
     sie das Konto-Menü. Warum J und nicht der Merkbuchstabe, steht im Kopf von
     `src/lib/shortcuts.ts` - kurz: „K" ist in vier Programmen verschieden
     belegt, „A" gehört seit 24.08.2026 der ANGABE (§12 der Arbeitsblatt-
     Bauart: der Ausgang aus dem Eingabefeld zum Nachlesen), und unter den
     verbliebenen freien Buchstaben ist J die Grundstellungstaste des rechten
     Zeigefingers - ohne Handbewegung zu treffen und auf QWERTZ wie QWERTY an
     derselben Stelle.

     Sie sitzt in der KOPFZEILE und nicht in den fünf Apps, weil der Knopf hier
     wohnt: Eine Belegung an einer Stelle kann nicht auseinanderlaufen
     ([[feedback_shortcut_konzept]]: gleiche Funktion = gleiche Taste in ALLEN
     Apps).

     Die drei Sperren stehen in `unsereAltTaste()` (oben) - sie gelten für
     Alt + K genauso. */
  const onAnmeldenRef = useRef(onAnmelden);
  onAnmeldenRef.current = onAnmelden;
  const offenRef = useRef(offen);
  offenRef.current = offen;
  const hatKonto = !!account;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!unsereAltTaste(e, "KeyJ")) return;
      e.preventDefault();
      if (hatKonto) {
        // ⚠️ Der Zustand kommt aus einem Ref, nicht aus einem `setOffen`-
        // Aktualisierer: `schliessen()` fasst Fokus an, und ein Aktualisierer
        // darf nichts nach außen tun - React ruft ihn im Strict-Modus zweimal.
        if (offenRef.current) schliessen(true); // zuklappen = Fokus zurück
        else setOffen(true);
        return;
      }
      // Abgemeldet: derselbe Weg wie der Knopf „Konto".
      onAnmeldenRef.current?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hatKonto, schliessen, setOffen]);

  /* ══════════════════════════════════════════════════════════════════════
     ALT + K - DER FARBSCHALTER (Entscheidung Johannes 30.08.2026).
     ══════════════════════════════════════════════════════════════════════
     Die Belegung räumte eine Abweichung auf: Das Hörbuch-Studio benutzte Alt + K
     für „Kontrast / Farbschema wechseln" (`HoerbuchStudioPage.tsx`; seit
     18.10.2026 hat es diese Kopfzeile, Alt + K ist dort jetzt dieses Menü), während in Tastenflow bis heute „Tasten
     erkunden" darauf saß - der zog am 30.08. auf Alt + 3 um, wo schon sein
     AUSGANG lag (rein und raus auf derselben Taste).

     ⚠️ OFFEN: In Klangpunkte sitzt auf Alt + K noch die Kapitelwahl
     (`KlangpunktePage.tsx`), in Punktgenau die Kapitel-Auswahl
     (`PunktgenauPage.tsx`). Beides wartet auf Johannes und wurde NICHT
     angefasst. Solange bleibt der Farbschalter dort ohne Kürzel - der Knopf
     selbst ist da und tut dasselbe.

     ★★ DARUM HÖRT DIESER EINE HANDLER AM `window` UND NICHT AM `document`.
     Gemessen am 30.08.2026: Alle fünf Apps hängen ihren Tastenwächter an
     `document`, und React führt die Effekte der KINDER zuerst aus - diese
     Kopfzeile ist ein Kind. Am `document` liefe sie also VOR der Seite, und
     die Sperre „hat die Seite die Taste schon behandelt" (`defaultPrevented`
     in `unsereAltTaste`) könnte nie greifen: In Klangpunkte und Punktgenau
     spränge Alt + K in die Kapitelwahl UND klappte die Farben auf. Das
     `window` steht in der Aufstiegskette hinter dem `document`; dieser Handler
     kommt damit als LETZTER dran und tritt zurück, wo eine Seite die Taste
     schon für sich beansprucht hat. Alt + J bleibt am `document` - dort gibt
     es keine Seite, die mitreden will.

     Ansonsten wird die Taste EINMAL behandelt, hier, genau wie Alt + J:
     derselbe Aufklapper, dieselben drei Sperren aus `unsereAltTaste()`. */
  const farbe = useAufklapper(escAfterClose);
  const akustik = useAufklapper(escAfterClose);
  const farbeOffenRef = useRef(farbe.offen);
  farbeOffenRef.current = farbe.offen;
  const farbeSchliessen = farbe.schliessen;
  const farbeSetOffen = farbe.setOffen;
  /**
   * ★ E2b (25.09.2026, Bauplan §9.3): DER SPRACHWÄHLER - OHNE `escAfterClose`,
   * anders als Konto und Farbe: „Escape schliesst und gibt den Fokus an den
   * Knopf zurück" (Auftrag E2b Punkt 1) statt in die Eingabezeile - ein
   * Sprachwähler ist eine Einstellung wie ein natives Auswahlfeld, kein
   * Fenster, aus dem man „zurück zur Arbeit" will. `useAufklapper()` ohne
   * Rückruf fällt von selbst auf genau dieses Verhalten zurück (siehe dort).
   */
  const sprachAufklapper = useAufklapper();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!unsereAltTaste(e, "KeyK")) return;
      e.preventDefault();
      if (farbeOffenRef.current) farbeSchliessen(true);
      else farbeSetOffen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [farbeSchliessen, farbeSetOffen]);

  /* ══════════════════════════════════════════════════════════════════════
     ALT + T - DIE KURZTASTEN-LISTE. Sie wohnt ab jetzt HIER.
     ══════════════════════════════════════════════════════════════════════
     > **Johannes, 09.09.2026:** „die tastenkombination ALT+t funktioniert
     > immer noch nicht! sie ist eine der wichtigsten!!!"

     ⚠️⚠️ WARUM SIE TOT WAR - und warum es kein Tippfehler war, sondern eine
     Lücke in der Bauart: `Alt + T` steht seit jeher in `UNIVERSAL_SHORTCUTS`
     (`src/lib/shortcuts.ts`) und wird damit in JEDER App versprochen. Behandelt
     hat die Taste aber **jede App für sich** - Tastenflow, Punktgenau,
     Klangpunkte, »Im Griff« und das Hörbuch-Studio je in ihrer eigenen
     `switch (e.code)`-Kette. Wer eine App baut, die das nicht abschreibt, hat
     ein Kürzel, das angesagt wird und nichts tut. Genau das war Mathecoach
     (Kind, Lehrkraft und Muster) und »Meine Klasse«.

     ⇒ Die Taste gehört dorthin, wo ihr Knopf steht: in die Kopfzeile. Genau
     wie Alt + J (Konto), Alt + K (Farben) und Alt + N (Nachrichten, in
     `LwMessageBell`). Danach kann keine neue App sie mehr vergessen.

     ★★ AM `window`, NICHT AM `document` - aus demselben Grund wie Alt + K:
     Die fünf Apps hängen ihren Tastenwächter an `document`, und React führt die
     Effekte der KINDER zuerst aus; diese Kopfzeile ist ein Kind. Am `window`
     kommt sie als LETZTE dran und tritt zurück, wo eine Seite die Taste schon
     für sich beansprucht hat (`defaultPrevented` in `unsereAltTaste`). **Ohne
     das schaltete die Taste zweimal um - also gar nicht.** Gegenprobe:
     `tests/kuerzel-alt-t.test.tsx` §3.

     ★★★ `kurztastenOffen` ist die Ausnahme, die das Schliessen erlaubt: Die
     Liste öffnet in den meisten Apps als `Modal`, und ein offenes `Modal` macht
     jede Alt-Taste taub. Ein FREMDER Dialog tut das weiterhin. */
  const onKurztastenRef = useRef(onKurztasten);
  onKurztastenRef.current = onKurztasten;
  const kurztastenOffenRef = useRef(kurztastenOffen);
  kurztastenOffenRef.current = kurztastenOffen;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!unsereAltTaste(e, "KeyT", !!kurztastenOffenRef.current)) return;
      e.preventDefault();
      onKurztastenRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /*
   * ★★ ALT + S - MEINE STATISTIK, IN JEDER APP (Johannes, 18.10.2026: „Alt + S
   * soll überall Meine Statistik sein"). Ein Kind kommt in seine Statistik
   * (`onStatistik`, derselbe Weg wie im Konto-Menü), eine Lehrkraft nach „Meine
   * Klassen" (`klasseHref`, derselbe Weg wie der Schalter - der Hinweis daran
   * versprach Alt + S schon lange, in Punktgenau und Klangpunkte tat die Taste
   * aber nichts). Behandelt wird sie HIER, am `window`, hinter den Seiten:
   * Eine App, die Alt + S schon selbst beansprucht (`preventDefault`), behält
   * sie - die Wache `unsereAltTaste` tritt dann zurück.
   */
  const navigate = useNavigate();
  const onStatistikRef = useRef(onStatistik);
  onStatistikRef.current = onStatistik;
  const klasseRef = useRef<string | undefined>(undefined);
  klasseRef.current = account?.istLehrkraft ? klasseHref : undefined;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!unsereAltTaste(e, "KeyS")) return;
      if (onStatistikRef.current) {
        e.preventDefault();
        onStatistikRef.current();
      } else if (klasseRef.current) {
        e.preventDefault();
        // Auf tastenflow.org führt der Weg hinüber zur Plattform (volle Adresse).
        if (/^https?:/.test(klasseRef.current)) window.location.assign(klasseRef.current);
        else navigate(klasseRef.current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const { mode: farbmodus, setMode: setFarbmodus } = useContrast();

  /**
   * ★ 30.08.2026 (Johannes): Die Nachrichten wohnen im KONTO - die Glocke ist
   * als eigener Knopf aus der Reihe verschwunden. Der Posteingang-Stand
   * kommt vom (unsichtbar weiterlaufenden) Nachrichten-Baustein und sitzt
   * als roter Zähler am Konto-Zeichen; geöffnet wird über den Eintrag
   * „Nachrichten" im Konto-Menü (oder wie immer mit Alt + N). Kein Blinken:
   * Ein blinkendes Zeichen wäre für viele Kinder eine Störquelle - der rote
   * Zähler sagt dasselbe, ohne zu zappeln.
   */
  const [posteingang, setPosteingang] = useState(0);
  const nachrichtenOeffnenRef = useRef<() => void>(() => {});

  /**
   * ★★ „MELDEN" IM KONTO-MENÜ - für Selbstlernende (Johannes, 02.09.2026):
   * *„gib den schalter bitte in das menü des benutzers oberhalb von abmelden."*
   *
   * ⚠️ Der Zustand wohnt HIER und nicht im Menü-Eintrag. Der Eintrag klappt
   * beim Drücken das Menü zu und ist danach nicht mehr im Baum - ein Fenster,
   * das ihm gehörte, ginge im selben Augenblick mit ihm unter. Es hängt darum
   * an der Kopfzeile, die stehen bleibt.
   */
  const [meldenOffen, setMeldenOffen] = useState(false);

  /* ══════════════════════════════════════════════════════════════════════
     DIE SCHMALE FASSUNG IST WEG - und warum das kein Verlust ist.
     ══════════════════════════════════════════════════════════════════════
     Hier stand von 25.08. bis 30.08.2026 eine Messung: Ein `ResizeObserver`
     verglich die Breite der Werkzeug-Reihe mit dem Platz neben dem Titel und
     schaltete die Knöpfe von Wörtern auf Symbole um, BEVOR die Kopfzeile
     umbrach. Gegen das Aufschaukeln (schmal → passt → breit → passt nicht →
     schmal → …) gab es eine Hysterese von 16 px und eine Kennung der
     Bestückung, die die Messung verwarf, wenn sich die Knöpfe änderten.

     Am 30.08.2026 hat sie ihre Aufgabe verloren, Knopf für Knopf: Hilfe und
     Einstellungen wurden runde Sinnbilder, dann Kurztasten, zuletzt das Konto.
     Seither trägt KEIN Knopf dieser Reihe mehr ein Wort, das man ablegen
     könnte - die Umschaltung hätte nichts mehr umzuschalten gehabt.

     Sie ist darum ersatzlos entfernt und nicht stillgelegt: Ein Zustand, den
     niemand mehr liest, ist eine Programmleiche, und die nächste Person hielte
     ihn für einen Weg, den es gibt. Was die Messung eigentlich verhindern
     sollte - dass die Kopfzeile bei 200 % Textgröße die Seite waagrecht
     aufschiebt -, erledigen weiterhin `flex-wrap` und `min-w-0` (Vermerk
     unten); die Reihe ist mit sieben 36-px-Kreisen ohnehin nur noch halb so
     breit wie vorher (gemessen: 546 → 300 px angemeldet).

     ⚠️ Wer wieder ein Wort in diese Reihe stellt, holt die Messung aus der
     Versionsgeschichte zurück (Commit vom 30.08.2026), statt sie neu zu
     erfinden. Der `extra`-Slot ist davon unberührt: Was eine App dort
     hineinstellt, hat diese Messung nie angefasst. */

  /**
   * ★ DIE FAMILIE DER RUNDEN KNÖPFE (30.08.2026): 36 px (`h-9 w-9`), rund, mit
   * einem 22 px großen Sinnbild darin - größeres Zeichen, weniger Rand
   * (Johannes). Maßgebend war das Konto-Zeichen, das schon immer so aussah;
   * Hilfe, Einstellungen, Glocke, Farbe und Vorlesen sind ihm nachgezogen,
   * damit die Reihe eine Familie ist und nicht fünf Einzelstücke.
   */
  const rundKlasse = (aktiv?: boolean) =>
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border " +
    "text-sm font-semibold transition-colors " +
    (aktiv
      ? "border-accent bg-accent-soft text-ink"
      : "border-hairline bg-surface-raised text-ink hover:bg-surface-sunken");

  /** Das Sinnbild in einem runden Knopf - 22 px statt der früheren ~16. */
  const SINNBILD = "h-[22px] w-[22px]";

  // Auf dem Mac heißen die Kürzel „Wahltaste (⌥)" - dann trägt das Zeichen für
  // die Kürzel-Liste auch ⌥ statt „Alt".
  const altZeichen = /⌥|Wahl/.test(kurztastenKuerzel) ? "⌥" : "Alt";
  /* ★ DASSELBE WORT AUCH FÜR DIE ZWEI NEUEN SCHALTER (30.08.2026). Farbe und
     Vorlesen haben keine eigene Kürzel-Prop - ihre Tasten hat Johannes
     festgelegt, nicht die App. Ohne diese Zeile stünde am Mac „Alt + K" neben
     „Wahl + H" in derselben Reihe: zwei Namen für dieselbe Taste, gemessen am
     30.08. in »im Griff«, das seine Kürzel für macOS umschreibt.
     ⚠️ Nur die BESCHRIFTUNG wechselt. `aria-keyshortcuts` bleibt „Alt+K" bzw.
     „Alt+V" - der Wert erwartet den technischen Tastennamen (dieselbe Regel
     wie beim Zahnrad weiter unten). */
  const altWort = mac || /Wahl/.test(kurztastenKuerzel) ? t.wahltaste : altZeichen;

  // ★ 30.08.2026: `flex` statt `block` - jeder Eintrag trägt sein Sinnbild
  //   (Wunsch Johannes). Die Sinnbilder sind dekorativ (aria-hidden im
  //   Icon-Baustein); der Name bleibt der Text.
  const eintrag =
    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-surface-sunken";
  const eintragSinnbild = "h-4 w-4 shrink-0 text-ink-muted";

  /**
   * ★ E2b (25.09.2026, Bauplan §9.3 „Pfeile wählen"): DIE PFEILTASTEN DES
   * SPRACHWÄHLERS - roving focus zwischen den `role="option"`-Knöpfen. Der
   * einzige Baustein der Kopfzeile mit echter Pfeiltasten-Steuerung (die
   * Farbe/Konto-Listen sind bewusst KEIN `role="menu"`, siehe
   * `useAufklapper` oben) - hier ausdrücklich verlangt (Auftrag E2b Punkt 1).
   * Enter/Leertaste und Escape branchen NICHT hier hinein: Enter/Leertaste
   * lösen den fokussierten `<button>` nativ aus, Escape hört
   * `useAufklapper` bereits am `document`.
   */
  function onSprachlisteTaste(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const knoepfe = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="option"]'),
    );
    const jetzt = knoepfe.indexOf(document.activeElement as HTMLButtonElement);
    if (jetzt === -1) return;
    const naechster =
      e.key === "ArrowDown" ? (jetzt + 1) % knoepfe.length : (jetzt - 1 + knoepfe.length) % knoepfe.length;
    knoepfe[naechster]?.focus();
  }

  return (
    /*
      ★★★ `bedien-schlank` (11.09.2026): EINE Bedienhöhe in der Kopfzeile ALLER
      Apps - 36 px, so hoch wie die runden Knöpfe. Johannes: *„auch in der
      Kopfzeile sind sie nicht alle gleich"* (gemessen: 32, 34 und 36 px in
      einer Reihe). Die Klasse sitzt am `<header>`, damit sie auch die Schalter
      erfasst, die eine App über `extra` hineinreicht. Die Regeln stehen in
      `index.css` (`.bedien-schlank`), der Auftrag in
      `apps/tastenflow/BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md` (R1, R10).
      ⚠️ Nur diese Klasse ist hier dazugekommen - kein Umbau des gemeinsamen Teils.
    */
    <header className="bedien-schlank flex flex-wrap items-center gap-3">
      {/* ⚠️ `flex-wrap` und `min-w-0` (24.08.2026, Johannes beim Mathecoach-
          Musterblatt): Bei 200 % Textgröße auf einem schmalen Schirm passten
          Sensorik-Zeichen und App-Name nicht mehr nebeneinander - und weil
          beides weder umbrechen noch schrumpfen durfte, schob die Kopfzeile
          die GANZE Seite waagrecht auf. Waagrechtes Scrollen ist genau das,
          was Vergrößerung unbrauchbar macht; für ein Kind mit Sehrest ist
          dann jede Zeile zweimal zu lesen. Gilt für alle vier Programme.

          ★ 30.08.2026 (Wunsch Johannes): DREI ZONEN statt zwei - links die
          Sensorik-Marke, in der MITTE App-Zeichen + Titel (`flex-1` +
          `justify-center`), rechts die Werkzeuge. Beim Umbruch (schmal,
          200 %) rutscht die Mitte als eigene Zeile darunter - zentriert,
          nie waagrecht aufschiebend. */}
      {/* Heim-Verweis. Auf tastenflow.org führt er BEWUSST hinüber zur
          Lernplattform - dort wohnen die übrigen Programme; „/" wäre dort
          Tastenflow selbst. Siehe plattformStartHref().
          ★ Der Hinweis kommt aus dem Tipp-Baustein, nicht aus `title`
          (Johannes 30.08.2026): sofort da, lesbare Größe, auch bei Fokus -
          wie bei den runden Knöpfen rechts. `ausrichtung="links"`, weil der
          Verweis am linken Rand steht. */}
      {/* ★ Johannes 16.11.2026: Auf tastenflow.org und lexami.org gibt es den
          Heim-Verweis nicht mehr - er führte nach weingartner.org, und wer dort
          landete, kannte sich nicht mehr aus. Die Mitte trägt Zeichen und Namen
          der App; die Seite bleibt auf ihrer Adresse. */}
      {!ohneHeimVerweis && !hausApp() && (
        <Tipp text={t.zurLernplattform} ausrichtung="links">
          {(beschreibungId) => (
            <Link
              to={plattformStartHref()}
              aria-label={t.startseite}
              aria-describedby={beschreibungId}
              className="flex min-w-0 shrink-0 items-center gap-1.5 hover:underline underline-offset-2"
            >
              <Logo className="h-9 w-9" />
              {/* ★ GESTUFTES AUSBLENDEN BEI GROSSEM ZOOM (Johannes 30.08.2026):
                  Browser-Zoom verkleinert die CSS-Breite - unter `md` verschwindet
                  zuerst der Bereich („Mein Training"), unter `sm` auch der übrige
                  Text; übrig bleiben die Zeichen. `sr-only` statt `hidden`: Für
                  Sprachausgabe und Braillezeile bleibt ALLES da, nur sichtbar
                  räumt der Text das Feld.
                  ★ „Sensorik" AUSGESCHRIEBEN (Johannes 30.08., Abend): Bis dahin
                  stand „ensorik" - das Zeichen sollte das S ersetzen. Neben dem
                  Tastenflow-Paar (T-Zeichen + voller Name „Tastenflow") waren
                  das aber zwei Layout-Prinzipien nebeneinander. Jetzt gilt EINES:
                  Zeichen + voller Name, und die Schrift ist eine Stufe größer. */}
              {/* `heimNurZeichen`: das Wort fällt weg, den Namen trägt das `aria-label` des Links. */}
              {!heimNurZeichen && (
                <span className="break-words text-lg font-medium leading-tight text-ink-muted sr-only sm:not-sr-only">
                  Sensorik
                </span>
              )}
            </Link>
          )}
        </Tipp>
      )}
      {/* ★★★ `flex-auto` STATT `flex-1` (07.09.2026, beim Mathecoach-Zeichen).
          Gemessen an der Mathecoach-Musterseite: Der Unterschied ist die
          Flex-Basis. `flex-1` heisst `flex: 1 1 0%` - die Mitte startet bei
          NULL Breite und bekommt nur, was Marke und Werkzeuge übriglassen.
          Bei voller Werkzeugleiste waren das 157 px, während Zeichen (36) und
          Titel (129) zusammen 165 brauchen. Ergebnis: Der Titel rutschte unter
          das Zeichen - obwohl der äussere `flex-wrap` genau dafür da ist, die
          MITTE als ganze Zeile darunterzusetzen. Er kam nie zum Zug, weil ein
          Element mit Basis 0 immer noch schrumpfen kann.
          ⇒ `flex-auto` (`flex: 1 1 auto`) startet bei der Inhaltsbreite. Die
          Mitte wächst weiterhin in freien Platz (die Zentrierung bleibt), gibt
          aber nicht mehr allein nach: Wird es eng, brechen zuerst die
          Werkzeuge um, dann die ganze Kopfzeile - beides ist gewollt.
          ⚠️ `min-w-0` bleibt: Ohne das schiebt ein langer Titel bei 200 %
          Textgrösse die Seite waagrecht auf (der Befund vom 24.08.2026). */}
      {/* Reine Optik, darum `aria-hidden` - wie der Strich vor dem Farbschalter. */}
      {trennstrich && !ohneHeimVerweis && (
        <span aria-hidden="true" data-trennstrich="" className="h-8 w-px shrink-0 self-center bg-hairline" />
      )}
      <div className="flex min-w-0 flex-auto flex-wrap items-center justify-center gap-2.5">
        {/* App-Zeichen VOR dem Titel (30.08.2026). `shrink-0`: Es darf beim
            Umbruch (200 % Textgröße) nicht zusammengedrückt werden - lieber
            bricht der Titel um. */}
        {zeichen && <span className="flex shrink-0 items-center">{zeichen}</span>}
        <h1
          id={titelId}
          className="m-0 min-w-0 break-words text-xl font-semibold tracking-tight text-ink sm:text-2xl"
        >
          {/* ★★ DIE GANZE ÜBERSCHRIFT ist der Heimweg - Titel UND Bereich in
              EINEM Schalter (Johannes 30.08.2026, siehe `onZumProgramm`). Ohne
              den Rückruf bleibt sie schlichter Text - keine App bekommt einen
              Schalter, der nichts tut.
              ⚠️ Der Mittelpunkt bleibt `aria-hidden`: Der Name des Schalters
              lautet damit „Tastenflow Mein Training", also genau die sichtbaren
              Wörter (WCAG 2.5.3). */}
          {onZumProgramm ? (
            // ★ Auch hier der Tipp-Baustein statt `title` (Johannes
            //   30.08.2026): sofort da, lesbare Größe, auch bei Fokus.
            // ★ 15.11.2026 (NVDA- und VoiceOver-Prüfung Lexami, Johannes: „ja, die Überschrift auch
            //   ändern, für alle Apps"): KEIN `aria-describedby` mehr. Die Erklärung „Zurück ins
            //   Programm - schließt alles Offene" wurde bei jedem Sprung zur ersten Überschrift und bei
            //   jedem Tab durch den Kopf mitgelesen. Der Name bleibt der Programmname; der Tipp
            //   erscheint weiter beim Zeigen und bei Fokus - nur für die Augen.
            <Tipp text={t.heimweg}>
              {() => (
                <button
                  type="button"
                  onClick={onZumProgramm}
                  // Der Schalter erbt Größe und Farbe der Überschrift; er darf
                  // nicht wie ein Knopf aussehen, sondern wie der Titel, der er
                  // ist. `text-left` und `break-words`, damit er bei 200 %
                  // Textgröße genauso umbricht wie vorher der reine Text.
                  className="m-0 inline break-words border-0 bg-transparent p-0 text-left font-semibold tracking-tight text-ink hover:underline underline-offset-4"
                >
                  {/* Zoom-Stufen wie beim Sensorik-Text: unter `md` geht zuerst
                      der Bereich, unter `sm` auch der Titel - sichtbar; im
                      Screenreader-Baum bleibt beides (sr-only). */}
                  <span className={`sr-only sm:not-sr-only ${titelKlasse ?? ""}`}>{titel}</span>
                  {bereich && (
                    <span className="font-medium text-ink-soft sr-only md:not-sr-only">
                      <span aria-hidden="true" className="px-1.5 text-ink-muted">
                        ·
                      </span>
                      {bereich}
                    </span>
                  )}
                </button>
              )}
            </Tipp>
          ) : (
            <>
              <span className={`sr-only sm:not-sr-only ${titelKlasse ?? ""}`}>{titel}</span>
              {bereich && (
                <span className="font-medium text-ink-soft sr-only md:not-sr-only">
                  <span aria-hidden="true" className="px-1.5 text-ink-muted">
                    ·
                  </span>
                  {bereich}
                </span>
              )}
            </>
          )}
        </h1>
        {/* Die Marke steht hinter der Überschrift und ausserhalb von ihr -
            die Begründung steht bei der Eigenschaft `beta` oben. */}
        {beta && <BetaMarke />}
      </div>

      <nav
        aria-label={t.werkzeuge}
        // `min-w-0`: siehe Vermerk oben - die Werkzeug-Reihe muss bei großer
        // Schrift schrumpfen dürfen, sonst schiebt sie die Seite waagrecht auf.
        className="flex min-w-0 flex-wrap items-center justify-end gap-2"
      >
        {ordneKopfTeile(menueReihenfolge, [
        ["extra", <>
        {extra}
        </>],
        ["melden", <>
        {/*
          ════════════════════════════════════════════════════════════════════
          ★★ „MEINE KLASSE" IST EIN SCHALTER, KEIN MENÜPUNKT (01.09.2026)
          ════════════════════════════════════════════════════════════════════
          Johannes: *„wenn der Lehrer auf ‚selbst üben' klickt soll ‚Meine
          Klasse' in der Kopfzeile als Schalter erscheinen, nicht im
          Benutzermenü."*

          Er hat recht, und der alte Ort war eine Falle: Eine Lehrkraft, die
          gerade selbst übt, ist genau EINEN Schritt vom Unterrichten entfernt -
          aber der Weg dorthin lag hinter dem Konto-Menü, zwischen „Passwort
          ändern" und „Abmelden". Wer ihn nicht kennt, findet ihn nicht.

          ⚠️ DIESE DATEI GEHÖRT FÜNF APPS (`apps/GEMEINSAM.md` §1). Die
          Änderung ist trotzdem hier richtig und nicht je App: `klasseHref`
          setzen Tastenflow, Punktgenau, Klangpunkte und »im Griff« - alle
          vier. Vier Nachbauten im `extra`-Slot wären vier Gelegenheiten,
          auseinanderzulaufen; Johannes am selben Tag: *„Was einheitlich geht
          machen wir immer einheitlich."*

          ★ Er steht VOR der Hilfe, weil er ein Weg ist und kein Werkzeug -
          und er erscheint nur für Lehrkräfte, die auch eine Klasse haben.

          ★★ 10.09.2026 (Johannes, ausdrücklich am gemeinsamen Teil gewählt):
          Er sieht aus wie der Schalter „Selbst üben" in „Meine Klassen" -
          dieselbe Fläche, dieselbe Schriftgrösse, ohne eigenen Umriss. Die
          zwei Wege zwischen Üben und Unterrichten sollen sich als Paar
          lesen. Er bleibt trotzdem ein LINK: Er wechselt die Seite, und ein
          Knopf, der navigiert, sagte der Sprachausgabe das Falsche.
        */}
        {/*
          ★★ „MELDEN" - Änderungswunsch oder Fehler (Johannes, 01.09.2026).
          Steht hier und damit in ALLEN Apps: Ein Fehler zeigt sich dort, wo er
          auftritt, und ein Melde-Weg, den es nur an einer Stelle gibt,
          verlangt, dass man ihn aus dem Gedächtnis beschreibt. Die volle
          Begründung samt Datenschutz steht in `RueckmeldungKnopf.tsx`.

          ★★ 02.09.2026 (Johannes): Der SCHALTER gehört der Lehrkraft. Bis
          dahin stand er bei jedem angemeldeten Konto - also auch bei jedem
          Kind einer Klasse. Ein Kind hat seine Lehrkraft; ein Mailweg zu einer
          fremden erwachsenen Person, den niemand begleitet, ist für es kein
          Meldeweg. Selbstlernende (eigenes Konto mit E-Mail-Adresse) melden
          weiterhin - aber aus dem Konto-Menü, siehe dort.
        */}
        <RueckmeldungKnopf sichtbar={!!account?.istLehrkraft || (meldenOhneAnmeldung && !account)} rund={meldenRund} />
        {meldenFuerKinder && account && !account.istLehrkraft && !account.selbstlernend && <MeldenMitBildKnopf />}
        {account?.istLehrkraft && klasseHref && (
          <Tipp text={altAnzeige(t.zuMeinenKlassen, mac, t.wahltaste)}>
            {(beschreibungId) => (
              <Link
                to={klasseHref}
                aria-describedby={beschreibungId}
                className="btn-secondary btn-toggle text-sm inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Icon name="users" className="h-4 w-4" aria-hidden="true" />
                {t.meineKlassen}
              </Link>
            )}
          </Tipp>
        )}
        </>],
        ["kurztasten", <>
        {/* 1. Kurztasten */}
        {/* Das Zeichen für die Kürzel-Liste ist die TASTE, um die es geht:
            Jedes Kürzel dieser Plattform ist „Alt + …" (am Mac die Wahltaste
            ⌥). Ein Tastenkappen-„Alt" sagt darum genau das, was die Liste
            enthält - anders als ein Tastatur-Zeichen, das schon die
            Bildschirm-Tastatur unter dem Übungsfeld trägt. */}
        {/* ★★ 30.08.2026: rund wie alle anderen, und das Wort „Kurztasten"
            fällt weg. Damit ist die ganze Reihe eine Familie - sieben runde
            Knöpfe, kein Wort mehr.
            ⚠️ WARUM DIE TASTENKAPPE „Alt" UND KEIN „K": Direkt daneben steht
            der Knopf, der WIRKLICH auf Alt + K hört (Farbe). Ein Kind sähe ein
            „K", drückte es und landete in der Farbwahl - und ein Kind mit
            Blindheit merkte den Wechsel nicht einmal. Kurztasten liegt auf
            Alt + T. Das „Alt" ist ohnehin das ehrlichere Zeichen: Jedes Kürzel
            dieser Plattform ist „Alt + …" (am Mac ⌥), die Kappe sagt also
            genau, was die Liste enthält. Es ist dasselbe Zeichen, das die
            schmale Fassung schon seit dem 25.08. zeigt.
            ★ Der NAME bleibt Wort für Wort, wie er war - er fängt mit
            „Kurztasten" an (WCAG 2.5.3): Wer per Sprache „Kurztasten" sagt,
            trifft diesen Knopf weiterhin. Der frühere `title` steht jetzt im
            `Tipp`, der auch bei Fokus erscheint. */}
        <Tipp text={t.kurztastenTipp(kurztastenKuerzel)}>
          {(tippId) => (
            <button
              type="button"
              className={rundKlasse(kurztastenOffen)}
              aria-pressed={kurztastenOffen}
              onClick={onKurztasten}
              aria-keyshortcuts={ariaKuerzel(kurztastenKuerzel)}
              aria-label={t.kurztastenName(kurztastenKuerzel)}
              data-kopf-text={ohneKuerzel(t.kurztastenName(kurztastenKuerzel))}
              aria-describedby={tippId}
            >
              <span aria-hidden="true" className="font-mono text-xs font-semibold">
                {altZeichen}
              </span>
            </button>
          )}
        </Tipp>
        {/* 1b. Tasten erkunden (nur, wenn die App es hereinreicht).
            ★ 22.09.2026 (Johannes): „die Funktion findet niemand" - bis dahin
            gab es sie nur über Alt + 3 und die Hilfe. Rund wie die Familie,
            Sinnbild: eine Taste unter der Lupe. */}
        {onTastenErkunden && (
          <Tipp text={t.erkundenTipp(tastenErkundenKuerzel)}>
            {(tippId) => (
              <button
                type="button"
                className={rundKlasse(tastenErkundenOffen)}
                aria-pressed={tastenErkundenOffen}
                onClick={onTastenErkunden}
                aria-keyshortcuts={ariaKuerzel(tastenErkundenKuerzel)}
                aria-label={t.erkundenName(tastenErkundenKuerzel)}
                data-kopf-text={ohneKuerzel(t.erkundenName(tastenErkundenKuerzel))}
                aria-describedby={tippId}
              >
                <Icon name="tasteLupe" className={SINNBILD} />
              </button>
            )}
          </Tipp>
        )}
        </>],
        ["hilfe", <>
        {/* 2. Hilfe.
            ★ 20.09.2026: Hilfe und Kurztasten haben die Plätze getauscht
            (Johannes). Vorher stand die Hilfe zuerst - auch das war seine
            Vorgabe; die neue gilt. Der Tausch wirkt in ALLEN neun Seiten, die
            sich diese Kopfzeile teilen: Punktgenau, Tastenflow, Mathecoach,
            Klangpunkte, Lernwerkstatt, Meine Klasse, Hörbuch-Studio,
            »Im Griff« und die Rechtsseiten. Genau dafür gibt es sie - die
            Schalter sollen überall am selben Platz liegen.
            ★ 30.08.2026: rund, nur das Sinnbild, kein `❓` mehr (Farbmessung
            im Kopf dieser Datei). Der NAME fängt weiter mit „Hilfe" an
            (WCAG 2.5.3), und was vorher im `title` stand, steht jetzt im
            `Tipp` - der erscheint auch bei Fokus. */}
        <Tipp text={t.hilfeTipp(hilfeKuerzel)}>
          {(tippId) => (
            <button
              type="button"
              className={rundKlasse()}
              onClick={onHilfe}
              aria-keyshortcuts={ariaKuerzel(hilfeKuerzel)}
              // `hilfeKurz`: nur das erste Wort („Hilfe", „Help", „Aide") - ohne „in einfacher Sprache".
              aria-label={hilfeKurz ? `${t.hilfeName(hilfeKuerzel).split(" ")[0]} (${hilfeKuerzel})` : t.hilfeName(hilfeKuerzel)}
              data-kopf-text={hilfeKurz ? t.hilfeName(hilfeKuerzel).split(" ")[0] : ohneKuerzel(t.hilfeName(hilfeKuerzel))}
              aria-describedby={tippId}
            >
              <Icon name="help" className={SINNBILD} />
            </button>
          )}
        </Tipp>
        </>],
        ["nachrichten", <>
        {/* 3. Nachrichten (nur angemeldet — sonst gibt es keine Post).
            ★ 30.08.2026: OHNE eigenen Knopf - sie wohnen im Konto-Menü. Der
            Baustein bleibt hier DAUERHAFT im Baum (Posteingang-Abfrage,
            Alt + N, Auto-Aufspringen beim Kind, aria-live-Ankündigung); er
            meldet nur noch den Zähler hoch und nimmt den Öffnen-Befehl
            entgegen. */}
        {account && (
          <LwMessageBell
            accountId={account.id}
            afterClose={bellAfterClose}
            ohneKnopf
            onUnreadChange={setPosteingang}
            oeffnenRef={nachrichtenOeffnenRef}
          />
        )}
        </>],
        ["einstellungen", <>
        {/* 4. ⚙ Einstellungen — direkt links vom Konto-Zeichen (22.08.2026).
            EIN Bedienelement, nicht zwei: schmal zeigt es nur das Zahnrad als
            runden Knopf wie das Konto-Zeichen daneben, ab `sm` wächst derselbe
            Knopf zum Schalter mit dem Wort. Zwei getrennte Knöpfe (einer je
            Breite) wären zwei Halte im Tab-Weg und zwei Ansagen — der Fokus
            darf nirgends ins Leere greifen ([[feedback_fokus_pflicht_alle_apps]]). */}
        {onEinstellungen && (
          <Tipp text={t.einstellungen(einstellungenKuerzel)}>
            {(tippId) => (
              <button
                type="button"
                onClick={onEinstellungen}
                aria-expanded={einstellungenOffen}
                aria-controls={
                  einstellungenOffen === undefined ? undefined : einstellungenControls
                }
                aria-haspopup={einstellungenOffen === undefined ? "dialog" : undefined}
                // Der ARIA-Wert bleibt „Alt+O" — auch am Mac, wo die Taste
                // Wahltaste heißt: `aria-keyshortcuts` erwartet den TECHNISCHEN
                // Namen der Taste, nicht die Beschriftung. Die Beschriftung steht
                // im Namen und im Hinweis.
                aria-keyshortcuts="Alt+O"
                aria-label={t.einstellungen(einstellungenKuerzel)}
                data-kopf-text={ohneKuerzel(t.einstellungen(einstellungenKuerzel))}
                aria-describedby={tippId}
                className={rundKlasse(einstellungenOffen)}
              >
                <Icon name="settings" className={SINNBILD} />
              </button>
            )}
          </Tipp>
        )}
        </>],
        ["konto", <>
        {/* 5. Konto: rundes Zeichen mit dem ersten Buchstaben + Aufklappliste.
            ★ 30.08.2026: Der Buchstabe wächst mit den Sinnbildern daneben
            (`text-base` statt `text-sm`) - 22 px Zeichen neben einem
            14-px-„J" sähen aus wie zwei verschiedene Leisten. */}
        {account ? (
          <Tipp
            text={t.kontoTipp(kontoZeile(account, bedienSprache), kontoKuerzel, posteingang)}
            unterdruecken={offen}
          >
            {(tippId) => (
          // `inline-flex` wie beim Farbschalter - siehe dort (1 px Unterlänge).
          <div className="relative inline-flex">
            <button
              ref={knopfRef}
              type="button"
              aria-expanded={offen}
              aria-controls={menuId}
              onClick={() => (offen ? schliessen(true) : setOffen(true))}
              aria-keyshortcuts={ariaKuerzel(kontoKuerzel)}
              aria-describedby={tippId}
              aria-label={t.kontoName(kontoZeile(account, bedienSprache), kontoKuerzel, posteingang)}
              data-kopf-text={kontoZeile(account, bedienSprache)}
              className={rundKlasse(offen) + " !text-base relative"}
            >
              <span aria-hidden="true">{initiale(account.name)}</span>
              {/* Der rote Zähler der früheren Glocke - jetzt am Konto-Zeichen
                  (30.08.2026). Rein visuell (aria-hidden): Die Zahl steht im
                  Namen des Knopfes. */}
              {posteingang > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none"
                  style={{
                    backgroundColor: "rgb(var(--c-danger))",
                    color: "rgb(var(--c-on-accent))",
                  }}
                >
                  {posteingang > 9 ? "9+" : posteingang}
                </span>
              )}
            </button>
            {offen && (
              <div
                ref={listeRef}
                id={menuId}
                className="absolute right-0 z-30 mt-1 w-60 rounded-xl border border-hairline bg-surface-raised p-1.5 shadow-lg"
              >
                {/* Ganz oben Name und Klasse — die Auskunft, die vorher in einer
                    eigenen Zeile unter der Kopfzeile stand.
                    ★ 30.08.2026 (Johannes): daneben das ALLGEMEINE Männchen
                    (dasselbe wie am abgemeldeten Konto-Knopf), nicht der
                    Großbuchstabe - im Menü bleibt das Zeichen immer gleich. */}
                <p className="m-0 flex items-center gap-2 border-b border-hairline px-3 pb-2 pt-1 text-sm font-semibold text-ink">
                  <Icon name="user" className={eintragSinnbild} />
                  {kontoZeile(account, bedienSprache)}
                </p>
                {/* ★ 30.08.2026: Die Nachrichten wohnen HIER (Wunsch Johannes)
                    - der Eintrag öffnet dasselbe Fenster wie Alt + N. Der
                    Zähler steht auch im Text, nicht nur im roten Punkt. */}
                <button
                  type="button"
                  className={eintrag}
                  aria-keyshortcuts="Alt+N"
                  onClick={() => {
                    schliessen(false);
                    nachrichtenOeffnenRef.current();
                  }}
                >
                  <Icon name="bell" className={eintragSinnbild} />
                  <span>
                    {t.nachrichten}
                    {posteingang > 0 && (
                      <strong className="text-danger">
                        {" "}
                        {t.nachrichtenNeu(posteingang)}
                      </strong>
                    )}
                  </span>
                </button>
                {onStatistik && (
                  <button
                    type="button"
                    className={eintrag}
                    onClick={() => {
                      schliessen(false);
                      onStatistik();
                    }}
                  >
                    <Icon name="stats" className={eintragSinnbild} />
                    {t.meineStatistik}
                  </button>
                )}
                {onPasswort && (
                  <button
                    type="button"
                    className={eintrag}
                    onClick={() => {
                      schliessen(false);
                      onPasswort();
                    }}
                  >
                    <Icon name="key" className={eintragSinnbild} />
                    {t.passwortAendern}
                  </button>
                )}
                {/*
                  ★★ „MELDEN" - ÜBER „Abmelden" (Johannes 02.09.2026, wörtlich:
                  „oberhalb von abmelden"). Nur für Selbstlernende: Die
                  Lehrkraft hat den Schalter in der Werkzeug-Reihe, ein Kind
                  einer Klasse hat seine Lehrkraft (Begründung im Kopf von
                  `RueckmeldungKnopf.tsx`).

                  ⚠️ `schliessen(false)` OHNE Fokus-Rückgabe: Der Fokus wandert
                  gleich ins Fenster, und zwei Bewerber um denselben Takt sind
                  genau der Fehler, den die Hausregel R3 verhindert. Zurück
                  kommt er beim Schließen - auf den Konto-Knopf, denn dieser
                  Eintrag ist dann nicht mehr da (siehe `meldenSchliessen`).
                */}
                {account.selbstlernend && (
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    className={eintrag}
                    onClick={() => {
                      schliessen(false);
                      setMeldenOffen(true);
                    }}
                  >
                    <Icon name="pencil" className={eintragSinnbild} />
                    {t.melden}
                  </button>
                )}
                {onAbmelden && (
                  <button
                    type="button"
                    className={eintrag}
                    onClick={() => {
                      schliessen(false);
                      onAbmelden();
                    }}
                  >
                    <Icon name="logout" className={eintragSinnbild} />
                    {t.abmelden}
                  </button>
                )}
              </div>
            )}
          </div>
            )}
          </Tipp>
        ) : (
          onAnmelden && (
            /* ★★ 30.08.2026 (Johannes: „mach aus dem anmelden/Konto schalter
               auch einen kreis wie die anderen mit mänchen drinnen, keinen text
               nur wenn man mit der Maus darüber fährt").
               Der letzte Knopf mit einem Wort - damit ist die ganze Reihe eine
               Familie: sieben Kreise zu 36 px, jeder mit einem Zeichen in der
               Schriftfarbe, jeder mit einem `Tipp`.
               ★ DER SCHÖNE NEBENEFFEKT, DER KEIN ZUFALL IST: Angemeldet steht
               an genau dieser Stelle ein Kreis derselben Größe mit dem
               Anfangsbuchstaben. Der Knopf wechselt beim An- und Abmelden also
               weder Form noch Breite. Die Leiste springt nicht mehr, und wer
               mit der Tastatur arbeitet, findet den Knopf danach an derselben
               Stelle im Tab-Weg - vorher wanderte alles rechts davon.
               ★ Der Name ist „Konto" (Johannes: „Konto alleine reicht") - er
               deckt beide Zustände, abgemeldet wie angemeldet.
               `anmeldenRef` bleibt: Über ihn kehrt der Fokus zurück, wenn die
               Anmeldung abgebrochen wird. */
            <Tipp text={t.konto(kontoKuerzel)}>
              {(tippId) => (
                <button
                  type="button"
                  ref={anmeldenRef}
                  className={rundKlasse()}
                  onClick={onAnmelden}
                  aria-keyshortcuts={ariaKuerzel(kontoKuerzel)}
                  aria-label={t.konto(kontoKuerzel)}
                  data-kopf-text={ohneKuerzel(t.konto(kontoKuerzel))}
                  aria-describedby={tippId}
                >
                  <Icon name="user" className={SINNBILD} />
                </button>
              )}
            </Tipp>
          )
        )}
        </>],
        ["strich", <>
        {/* ══════════════════════════════════════════════════════════════════
            DIE ZWEI SCHALTER - abgesetzt von den Türen (Johannes 30.08.2026).
            ══════════════════════════════════════════════════════════════════
            Alles links von diesem Strich ÖFFNET etwas (Hilfe, Kurztasten,
            Glocke, Einstellungen, Konto). Alles rechts davon ÄNDERT SOFORT
            etwas. Zwei Sorten, die man beim Suchen nicht verwechseln soll -
            und die einzige Stelle der Reihe, an der ein Druck nicht mehr
            rückgängig zu machen ist, ohne ihn zu bemerken.
            Der Strich ist reine Optik und darum `aria-hidden`. */}
        <span
          aria-hidden="true"
          className="mx-0.5 h-6 w-px shrink-0 self-center bg-hairline"
        />

        </>],
        ["farben", <>
        {/* 6. FARBE UND KONTRAST (Alt + K).
            ★ Er ersetzt NUR HIER den früheren `ThemeToggle` (ein Auswahlfeld,
            148 px breit). `ThemeToggle.tsx` selbst bleibt unangetastet - er
            steckt in 14 weiteren Dateien (Verwaltung, Anmeldung, Rechtstexte).
            ★★ JEDER EINTRAG TRÄGT SEIN EIGENES FARBMUSTER. Das ist der Punkt
            der ganzen Übung: Ein Kind mit Sehrest soll „Gelb auf Blau" SEHEN
            und nicht aus dem Namen erraten. Grund und Schrift kommen aus
            `contrastMuster()` - also aus derselben Palette, die der Modus
            später auf die ganze Seite legt, nicht aus einer Kopie.
            Der aktive Modus ist am Häkchen UND an `aria-current` erkennbar,
            nie nur an der Farbe. */}
        <Tipp text={t.farben(altWort)} unterdruecken={farbe.offen}>
          {(tippId) => (
            // `inline-flex`, nicht `block`: Sonst legt der Zeilenkasten unter
            // den 36 px des Knopfes noch einen Pixel Unterlänge - gemessen am
            // 30.08.2026 als 37 px hoher Knopf in einer 36-px-Reihe.
            <div className="relative inline-flex">
              <button
                ref={farbe.knopfRef}
                type="button"
                aria-expanded={farbe.offen}
                aria-controls={farbe.menuId}
                aria-keyshortcuts="Alt+K"
                aria-describedby={tippId}
                aria-label={t.farben(altWort)}
                data-kopf-text={ohneKuerzel(t.farben(altWort))}
                onClick={() =>
                  farbe.offen ? farbe.schliessen(true) : farbe.setOffen(true)
                }
                className={rundKlasse(farbe.offen)}
              >
                <Icon name="contrast" className={SINNBILD} />
              </button>
              {farbe.offen && (
                <div
                  ref={farbe.listeRef}
                  id={farbe.menuId}
                  className="absolute right-0 z-30 mt-1 w-60 rounded-xl border border-hairline bg-surface-raised p-1.5 shadow-lg"
                >
                  {CONTRAST_MODES.map((m) => {
                    const muster = contrastMuster(m.id);
                    const aktiv = m.id === farbmodus;
                    const name = t.farbName(m.id, m.label);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        aria-current={aktiv ? "true" : undefined}
                        className={eintrag + " flex items-center gap-2.5"}
                        onClick={() => {
                          setFarbmodus(m.id as ContrastMode);
                          farbe.schliessen(true);
                          // Zuletzt, nach dem Schließen: `schliessen(true)`
                          // holt den Fokus auf den Farb-Knopf zurück, und was
                          // die Sprachausgabe dabei über den Knopf sagt, soll
                          // die Bestätigung nicht überholen. Den Wortlaut baut
                          // die App - siehe `onFarbeGewaehlt` oben.
                          onFarbeGewaehlt?.(name);
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="inline-flex h-6 w-8 shrink-0 items-center justify-center rounded border text-xs font-bold"
                          style={{
                            backgroundColor: `rgb(${muster.grund})`,
                            color: `rgb(${muster.schrift})`,
                            borderColor: `rgb(${muster.schrift})`,
                          }}
                        >
                          Aa
                        </span>
                        <span className="min-w-0 flex-1">{name}</span>
                        {aktiv && (
                          <span aria-hidden="true" className="shrink-0">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </Tipp>

        </>],
        ["rest", <>
        {/* 7. VORLESEN AN/AUS - direkt neben der Farbe.
            Fehlen `onVorlesen`/`vorlesenAn`, hat die App keine Sprachausgabe
            und der Knopf erscheint gar nicht (Vorbild: das Zahnrad).
            ⚠️ Der Zustand gehört der App (`useVoice`), nicht dieser Zeile -
            ein Knopf, der sich selbst merkt, ob vorgelesen wird, wäre der
            dritte Zustand neben Alt + V und dem Schalter im Zahnrad.

            ★★★★★ EIN VERB, KEIN ZUSTAND (07.09.2026, gemeldet von den
            Schülerinnen und Schülern: „der Sprache an und Sprache aus Knopf
            sagt immer das Gegenteil von dem, was er tut").

            Am Live-Stand nachgesehen: Bei ausgeschaltetem Vorlesen stand
            `aria-pressed="false"` am Knopf - und daneben, als einzige
            sichtbare Beschriftung, „Vorlesen an". Ein Screenreader las beides
            in einem Atemzug: „nicht gedrückt … Vorlesen an."

            Gemeint war die HANDLUNG („drück mich, dann geht es an"), gelesen
            wurde der ZUSTAND - denn im Zahnrad und in der Einrichtung stehen
            genau dieselben zwei Wörter, dort aber als Zustand: „Vorlesen an"
            heisst dort, dass es AN IST. Dieselben zwei Wörter, entgegengesetzte
            Bedeutung, zwei Klicks voneinander entfernt.

            ⚠️ Ein Verb kann kein Zustand sein. Darum „einschalten" /
            „ausschalten" statt „an" / „aus": Damit ist die Kopfzeile
            unmissverständlich, ohne dass die Schalter im Zahnrad ihre
            Bedeutung ändern müssen (Entscheidung Johannes, 07.09.2026).

            ⚠️ Diese Zeile gehört FÜNF Apps. Sie sagt nur, was der Druck TUT -
            ob vorgelesen wird, sagt `aria-pressed`. */}
        {onVorlesen && akustikMenue ? (
          <Tipp text={altAnzeige(akustikMenue.tipp, mac, t.wahltaste)} unterdruecken={akustik.offen}>
            {(tippId) => (
              <div className="relative inline-flex">
                <button
                  ref={akustik.knopfRef}
                  type="button"
                  aria-expanded={akustik.offen}
                  aria-controls={akustik.menuId}
                  aria-describedby={tippId}
                  aria-label={akustikMenue.name ?? t.vorlesenName(altWort)}
                  data-kopf-text={ohneKuerzel(akustikMenue.name ?? t.vorlesenName(altWort))}
                  onClick={() => (akustik.offen ? akustik.schliessen(true) : akustik.setOffen(true))}
                  className={rundKlasse(akustik.offen || vorlesenAn)}
                >
                  <Icon name="volume" className={SINNBILD} />
                </button>
                {akustik.offen && (
                  <div
                    ref={akustik.listeRef}
                    id={akustik.menuId}
                    // Schmal (Tastenflow, 17.10.2026): über die ganze Breite - der Knopf steht
                    // dort nicht am rechten Rand, ein rechtsbündiges Menü liefe links aus
                    // dem Bild. Ab `sm` wie bei Plus: rechtsbündig unter dem Knopf.
                    className="absolute right-0 z-30 mt-1 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-hairline bg-surface-raised p-2 shadow-lg max-sm:fixed max-sm:inset-x-4 max-sm:right-auto max-sm:w-auto"
                  >
                    {akustikMenue.inhalt}
                  </div>
                )}
              </div>
            )}
          </Tipp>
        ) : onVorlesen && (
          <Tipp text={t.vorlesenTipp(!!vorlesenAn, altWort)}>
            {(tippId) => (
              <button
                type="button"
                onClick={onVorlesen}
                aria-pressed={vorlesenAn}
                aria-keyshortcuts="Alt+V"
                aria-describedby={tippId}
                aria-label={t.vorlesenName(altWort)}
                data-kopf-text={ohneKuerzel(t.vorlesenName(altWort))}
                className={rundKlasse(vorlesenAn)}
              >
                <Icon name="volume" className={SINNBILD} />
              </button>
            )}
          </Tipp>
        )}

        {/* 8. DER SPRACHSCHALTER.
            ★ E2b (25.09.2026, Bauplan D9/§9.3): OHNE die `sprachen`-Eigenschaft
              (oder mit höchstens zwei Sprachen, ihre heutige Grundform aus dem
              Provider) bleibt es GENAU der alte Zwei-Wege-Umschalter von vorher -
              kein einziges Byte anders (§9.3: „Apps ohne sie behalten den
              heutigen Schalter"). Erst DREI oder mehr Sprachen (Tastenflow, NUR
              mit dem Probe-Schalter des französischen Lehrgangs) lassen den
              NEUEN Sprachwähler entstehen. */}
        {sprachSchalter && sprachen && sprachen.length > 2 ? (
          (() => {
            const aktivesKuerzel = SPRACHSCHALTER_ZIEL[sprachSchalter.sprache].kuerzel;
            const wahlLabel = sprachwahlLabel(sprachen);
            return (
              <div className="relative inline-flex">
                <Tipp text={wahlLabel} unterdruecken={sprachAufklapper.offen}>
                  {(tippId) => (
                    <button
                      ref={sprachAufklapper.knopfRef}
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={sprachAufklapper.offen}
                      aria-controls={sprachAufklapper.menuId}
                      // Tastenflow erkennt ihn daran und lässt ihm den Fokus,
                      // wenn danach neue Übungszeilen kommen (`TypingSession`).
                      data-sprachschalter=""
                      onClick={() =>
                        sprachAufklapper.offen
                          ? sprachAufklapper.schliessen(true)
                          : sprachAufklapper.setOffen(true)
                      }
                      aria-label={wahlLabel}
                      aria-describedby={tippId}
                      className={rundKlasse(sprachAufklapper.offen)}
                    >
                      <span aria-hidden="true" className="flex flex-col items-center leading-none">
                        {/* ★ 25.09. (Chat-Abnahme): Kugel 16 px, Kürzel 11 px fett - bei 14/9 px
                            war das Kürzel für Kinder mit Sehbeeinträchtigung zu klein. */}
                        <Icon name="globe" className="h-4 w-4" />
                        <span className="mt-px text-[11px] font-bold">{aktivesKuerzel}</span>
                      </span>
                    </button>
                  )}
                </Tipp>
                {/* Tastenweg: Enter/Leertaste öffnet den Knopf (native
                    Knopf-Taste, kein eigener Code nötig); Pfeile wählen
                    ({@link onSprachlisteTaste} unten); Escape schliesst und
                    gibt den Fokus an DIESEN Knopf zurück
                    ({@link useAufklapper} ohne `escAfterClose}). */}
                {sprachAufklapper.offen && (
                  <div
                    ref={sprachAufklapper.listeRef}
                    id={sprachAufklapper.menuId}
                    role="listbox"
                    aria-label={wahlLabel}
                    onKeyDown={onSprachlisteTaste}
                    className="absolute right-0 z-30 mt-1 w-44 rounded-xl border border-hairline bg-surface-raised p-1.5 shadow-lg"
                  >
                    {sprachen.map((code) => {
                      const aktiv = code === sprachSchalter.sprache;
                      return (
                        <button
                          key={code}
                          type="button"
                          role="option"
                          lang={sprachwahlLang(code)}
                          aria-selected={aktiv ? "true" : "false"}
                          className={eintrag}
                          onClick={() => {
                            sprachSchalter.onWechsel(code);
                            sprachAufklapper.schliessen(true);
                          }}
                        >
                          <span className="min-w-0 flex-1">{SPRACHWAHL_NAME[code]}</span>
                          {aktiv && (
                            <span aria-hidden="true" className="shrink-0">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          /* Der Zwei-Wege-Umschalter (Probestück „englische Bedienung", 12.09.2026).
             ★ Sichtbar das Kürzel der ANDEREN Sprache („EN" in der deutschen
               Bedienung), `lang` = die Zielsprache, der Name beginnt mit dem
               sichtbaren Wort (WCAG 2.5.3). Der Hinweis ist zweisprachig - ihn
               muss auch lesen können, wer die aktuelle Sprache nicht versteht.
             ⚠️ KEIN `aria-pressed`: Er ist eine Handlung, kein Zustand (Regel
               07.09.2026, siehe den Vorlese-Knopf darüber).
             ⚠️ KEIN Alt-Kürzel: Frei sind nur noch C, G, X, Y, und ein selten
               gebrauchter Schalter bekommt keines (Johannes 25.08.2026).
             ★ Fokus-Ziel: Der Knopf selbst. Er bleibt stehen und zeigt danach
               die andere Sprache - ein zweiter Druck macht es rückgängig. */
          sprachSchalter &&
          (() => {
            const ziel: BedienSprache = sprachSchalter.sprache === "de" ? "en" : "de";
            const z = SPRACHSCHALTER_ZIEL[ziel];
            return (
              <Tipp text={z.tipp}>
                {(tippId) => (
                  <button
                    type="button"
                    lang={sprachwahlLang(ziel)}
                    // Tastenflow erkennt ihn daran und lässt ihm den Fokus,
                    // wenn danach neue Übungszeilen kommen (`TypingSession`).
                    data-sprachschalter=""
                    onClick={() => sprachSchalter.onWechsel(ziel)}
                    aria-label={z.name}
                    aria-describedby={tippId}
                    className={rundKlasse()}
                  >
                    <span aria-hidden="true" className="text-xs font-semibold">
                      {z.kuerzel}
                    </span>
                  </button>
                )}
              </Tipp>
            );
          })()
        )}

        {/*
          DAS MELDE-FENSTER der Selbstlernenden - hier und nicht im Konto-Menü
          (Begründung bei `meldenOffen` oben). `Modal` zeichnet sich ohnehin in
          ein Portal; der Ort im Baum bestimmt nur, wer es am Leben hält.
        */}
        {meldenOffen && (
          <RueckmeldungFenster
            onSchliessen={() => {
              setMeldenOffen(false);
              // K27: zurück auf den Konto-Knopf. Der Menü-Eintrag, von dem aus
              // geöffnet wurde, ist nicht mehr da - `Modal` fände beim
              // Aufräumen also niemanden und ließe den Fokus auf `body`.
              window.setTimeout(() => knopfRef.current?.focus(), 0);
            }}
          />
        )}
        </>],
        ])}
      </nav>
    </header>
  );
}

/**
 * „Statistik schließen" — steht ÜBER und UNTER der Statistik (Wunsch Johannes
 * 09.08.2026): Wer unten angekommen ist, soll nicht erst wieder hochscrollen.
 */
export function StatistikSchliessen({ onClose }: { onClose: () => void }) {
  // ★ EN10: Sprache des Anbieters - ausserhalb von Tastenflow immer „de".
  const { sprache } = useBedienSprache();
  return (
    <div className="flex justify-end">
      <button type="button" className="btn-secondary btn-toggle" onClick={onClose}>
        <span aria-hidden="true">✕</span>
        {KOPF_TEXTE[sprache].statistikSchliessen}
      </button>
    </div>
  );
}
