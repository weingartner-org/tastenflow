/**
 * Finger- und Tastenmodell für den 10-Finger-Trainer „Tastenflow".
 *
 * Jede Taste ist genau EINEM Finger zugeordnet — das ist die motorische Kernidee
 * des Tastschreibens und für blinde/sehbehinderte Lernende von Anfang an
 * verbindlich (kein „Schummeln mit zwei Fingern"). Die Grundstellung wird über
 * die Tasthöcker auf F und J ertastet. Siehe [[project_zehnfinger_trainer]].
 *
 * WELCHE Tastatur gilt, steht in `layouts.ts` (Deutschland/Österreich, Schweiz,
 * USA, Großbritannien) — dort liegen Tastenreihen, Finger-Zuordnung und
 * Zusatztasten-Belegung. Alle Funktionen hier fragen das eingestellte Layout,
 * damit es keine zweite, konkurrierende Tastenliste gibt.
 */
import { GRIECHISCHES_FRAGEZEICHEN, activeLayout, activeLayoutId, bottomLabelsFuer, layoutIndex, layoutSprache, needsCapsLock, zugangFuer } from "./layouts";
import { grossFuer, kappeFuer, kleinFuer } from "./sprachRegister";
import { kombizeichenZu } from "./totasten";
import type { Lang } from "./account";
import type { Lernweg } from "./lernweg";
import { geruestAufEn, istGeruestSprache, type GeruestSprache } from "./sprachRegister";
import { FINGER_ANSAGE_TEILE, FINGER_NEUN, REIHEN_NEUN } from "./fingerNamenNeun";
import { ZEICHEN_ERGAENZUNG } from "./zeichenNamenErgaenzung";
import { ZEICHENNAMEN_BG } from "./zeichenNamenBg";
import { ZEICHENNAMEN_EL } from "./zeichenNamenEl";
import { ZEICHENNAMEN_HU } from "./zeichenNamenHu";
import { ZEICHENNAMEN_NL } from "./zeichenNamenNl";
import { ZEICHENNAMEN_PT } from "./zeichenNamenPt";
import { ZEICHENNAMEN_BR } from "./zeichenNamenBr";
import { ZEICHENNAMEN_RO } from "./zeichenNamenRo";
import { ZEICHENNAMEN_SV } from "./zeichenNamenSv";
import { ZEICHENNAMEN_UK } from "./zeichenNamenUk";

export type Hand = "links" | "rechts";

/** Die zehn Finger (Daumen geteilt: beide bedienen die Leertaste). */
export type FingerId =
  | "kleiner-links"
  | "ring-links"
  | "mittel-links"
  | "zeige-links"
  | "daumen"
  | "zeige-rechts"
  | "mittel-rechts"
  | "ring-rechts"
  | "kleiner-rechts";

export interface FingerInfo {
  id: FingerId;
  /** Anzeigename, z. B. „linker Mittelfinger". */
  name: string;
  /** Kurzname für enge Stellen, z. B. „Mittel L". */
  kurz: string;
  hand: Hand;
  /** Grundstellungs-Taste (Heimatplatz) dieses Fingers. */
  homeKey: string;
  /**
   * Farbe für die Bildschirm-Tastatur und die Buchstaben-Rahmen der Tippzeile.
   * GLEICHE Farbe für gleichen Fingertyp beider Hände (klassisches Schema): links
   * vs. rechts ergibt sich schon aus der Tastenhälfte, deshalb genügen fünf Farben
   * — kleiner Finger, Ring-, Mittel-, Zeigefinger, Daumen.
   *
   * Farbwahl aus der Okabe-Ito-Palette (2008), dem etablierten Standard für
   * Qualitativ-Farben, die auch bei Farbfehlsichtigkeit (Rot-Grün-, Blau-Gelb-
   * Schwäche) UND bei geringer Sehschärfe möglichst gut auseinanderzuhalten sind:
   * Purpur, Blaugrün, Orange und Blau unterscheiden sich in Farbton UND Helligkeit;
   * der Daumen (nur Leertaste) bleibt neutral-grau. AUSNAHME von „links = rechts":
   * Die beiden ZEIGEFINGER bekommen zwei verschiedene Blautöne (links dunkelblau,
   * rechts hellblau/himmelblau) — sie greifen in die mittleren Spalten hinein und
   * sind sonst schwer auseinanderzuhalten (Wunsch Johannes). Nur eine Lese-Hilfe:
   * die „nächste Taste" wird zusätzlich über Rahmen/Form hervorgehoben.
   */
  farbe: string;
}

export const FINGERS: Record<FingerId, FingerInfo> = {
  "kleiner-links": { id: "kleiner-links", name: "linker kleiner Finger", kurz: "klein L", hand: "links", homeKey: "a", farbe: "#cc79a7" },
  "ring-links": { id: "ring-links", name: "linker Ringfinger", kurz: "Ring L", hand: "links", homeKey: "s", farbe: "#009e73" },
  "mittel-links": { id: "mittel-links", name: "linker Mittelfinger", kurz: "Mittel L", hand: "links", homeKey: "d", farbe: "#e69f00" },
  "zeige-links": { id: "zeige-links", name: "linker Zeigefinger", kurz: "Zeige L", hand: "links", homeKey: "f", farbe: "#0072b2" },
  daumen: { id: "daumen", name: "Daumen", kurz: "Daumen", hand: "links", homeKey: " ", farbe: "#8d99ae" },
  "zeige-rechts": { id: "zeige-rechts", name: "rechter Zeigefinger", kurz: "Zeige R", hand: "rechts", homeKey: "j", farbe: "#56b4e9" },
  "mittel-rechts": { id: "mittel-rechts", name: "rechter Mittelfinger", kurz: "Mittel R", hand: "rechts", homeKey: "k", farbe: "#e69f00" },
  "ring-rechts": { id: "ring-rechts", name: "rechter Ringfinger", kurz: "Ring R", hand: "rechts", homeKey: "l", farbe: "#009e73" },
  "kleiner-rechts": { id: "kleiner-rechts", name: "rechter kleiner Finger", kurz: "klein R", hand: "rechts", homeKey: "ö", farbe: "#cc79a7" },
};

/**
 * ★ E8 (24.09.2026, Bauplan englischer Lehrgang §7): Die Grundstellungs-Taste
 * des rechten kleinen Fingers ist in {@link FINGERS} fest „ö" - richtig für
 * Weg „de" (jede Tastatur) UND für Weg „en" auf einer DEUTSCHEN/SCHWEIZER
 * Tastatur (dort liegt „ö" physisch dort, siehe `achteGrundtasteFuerLayout`,
 * letters.ts). Auf Weg „en" mit US/UK-Tastatur ist es stattdessen „;" - der
 * Fingeranker der 8. Grundtaste (F2, kein Buchstabe eines echten Wortes).
 *
 * ⚠️ Diese Datei darf `letters.ts` NICHT importieren (`letters.ts` importiert
 * bereits von HIER, ein Rückimport wäre ein Zirkel) - die Regel wird darum
 * unabhängig nachgebaut, nur mit dem, was `fingers.ts` ohnehin schon von
 * `layouts.ts` bezieht (Layout-Typen sind dort auch nur type-only von hier
 * abhängig, siehe Kopf von `layouts.ts`).
 *
 * ★ E3 (25.09.2026, Bauplan §3.1): Weg „fr" hat jetzt eine ECHTE AZERTY-
 * Grundreihe (`q s d f j k l m`, `lernweg.ts#FR_LETTER_ORDER`) - anders als
 * bei „en" reicht darum ein Austausch an der 8. Taste nicht mehr: Auf
 * AZERTY-Tastaturen (fr/be) sitzt auch die ERSTE Grundtaste (linker kleiner
 * Finger) physisch woanders („q" statt „a"). Auf Schweiz-Französisch/Kanada
 * bleibt „a" die erste Grundtaste (wie bisher) - nur die ACHTE unterscheidet
 * sich dort weiterhin („é" bzw. „;"). Ohne gewählte französische Tastatur
 * (Übergang, bevor E5/E6 die Einrichtung verdrahten) gilt die alte,
 * geliehene Regel unverändert weiter (de/ch ⇒ „ö", sonst „;").
 */
// ★ O-TR (02.10.2026): gilt auch für tr ohne eigenen Zweig - `tr-q`/`tr-f` tragen ihre Heimtasten
// selbst (`KeyboardLayout.heimtasten`: „ş" bzw. „y"), {@link homeKeyFor} fragt sie vor dieser Funktion.
// ★ O-CS (03.10.2026): gilt auch für cs ohne eigenen Zweig - `cs`/`cs-qwerty` tragen ihre Heimtasten selbst
// (`KeyboardLayout.heimtasten`: die achte ist „ů"), {@link homeKeyFor} fragt sie vor dieser Funktion.
function achteGrundtasteHomeKey(lernweg: Lernweg): string {
  if (lernweg === "de") return "ö";
  const layout = activeLayoutId();
  if (lernweg === "fr") {
    if (layout === "fr" || layout === "be") return "m";
    if (layout === "ch-fr") return "é";
    if (layout === "ca-csa" || layout === "ca-fr") return ";";
  }
  // ★★★★★ ES-P7a-Behebung (27.09.2026, M4, Bauplan §4.3 Fassung A): „ñ" ist
  // die 8. Grundtaste des Weges „es" - auf ES UND LatAm dieselbe Stelle
  // (Bauplan §3: Grundreihe „a s d f g h j k l ñ" bzw. „a s d f g h j k l ñ").
  // Vorher fiel „es" in den `en`-Zweig unten und bekam „;" - eine Taste, die
  // dort gar nicht liegt (Umschalt+Komma). Betroffen: jede Ansage dieses
  // Fingers (p, ñ, ¿ ?, ¡, ´, 0, ', -) in Übung, Fingerdiktat und Expedition.
  if (lernweg === "es") return "ñ";
  // ★ F3-it (02.10.2026, R1 §2): die ACHTE Grundtaste (rechter kleiner Finger) ist auf Weg „it" je
  // Tastatur ein Buchstabe: „ò" auf Italien (Windows 141/142, Mac „Pro"), „m" auf der Mac-QZERTY
  // (Apple-Hardware, dort sitzt ò unten rechts), „é" auf Schweiz-Französisch und „ö" auf der
  // Schweizer Tastatur (Tessin, Graubünden) - nie das „;" des englischen Rückfalls unten. Nur Weg „it".
  if (lernweg === "it") {
    if (layout === "it") return "ò";
    if (layout === "it-qzerty") return "m";
    if (layout === "ch-fr") return "é";
    if (layout === "ch") return "ö";
  }
  // ★ F3-pl (02.10.2026, R1 §2.2): Polnisch hat die US-Grundreihe - die achte Heimtaste (rechter kleiner
  // Finger) ist das „;" (kein Buchstabe eines polnischen Wortes, der Fingeranker wie auf Weg „en").
  if (lernweg === "pl" && layout === "pl") return ";";
  // ★ F4-NL (25.10.2026, Bauplan NL N2): Weg „nl" auf der belgischen AZERTY-Tastatur (Flandern) - sie trägt keine eigenen
  // Heimtasten (`be` ist auch die französische Tastatur, unverändert): die achte Grundtaste ist dort „m" wie auf Weg „fr"
  // (`lernweg.ts`: `achteGrundtasten`; Wächter `tastenflow-lernweg-nl-reihenfolge`).
  if (lernweg === "nl" && layout === "be") return "m";
  return layout === "de" || layout === "ch" ? "ö" : ";";
}

/**
 * ★ E3 (25.09.2026): die ERSTE Grundtaste (linker kleiner Finger) des Weges
 * „fr" auf einer AZERTY-Tastatur (Frankreich/Belgien) ist „q", nicht „a" -
 * siehe Kopf-Kommentar von {@link achteGrundtasteHomeKey}. Für jeden anderen
 * Weg und jede andere Tastatur bleibt „a" richtig (auch für „fr" auf
 * Schweiz-Französisch/Kanada/Übergangs-Tastaturen, wo „a" physisch an
 * derselben Stelle liegt).
 */
function ersteGrundtasteHomeKey(lernweg: Lernweg): string {
  // ★ F4-NL (25.10.2026): Weg „nl" auf Belgisch AZERTY - der linke kleine Finger liegt auf „q" (wie Weg „fr" auf `be`).
  if (lernweg === "nl") return activeLayoutId() === "be" ? "q" : "a";
  if (lernweg !== "fr") return "a";
  const layout = activeLayoutId();
  return layout === "fr" || layout === "be" ? "q" : "a";
}

/** Die acht Finger der Grundstellung in der Reihenfolge von `KeyboardLayout.heimtasten` (links nach rechts). */
const HEIMTASTEN_FINGER: readonly FingerId[] = [
  "kleiner-links", "ring-links", "mittel-links", "zeige-links",
  "zeige-rechts", "mittel-rechts", "ring-rechts", "kleiner-rechts",
];

/**
 * ★ F3-tr: die Heimtaste, die die EINGESTELLTE Tastatur für diesen Finger selbst festlegt
 * (`KeyboardLayout.heimtasten`) - oder `undefined`, wenn sie keine trägt (alle Tastaturen bis auf die
 * türkischen) oder der Finger keine Heimtaste hat (Daumen). Auch für Stellen, die `FingerInfo.homeKey`
 * direkt lasen (Polarstation, englischer Kurz-Hinweis).
 */
export function heimtasteDerTastatur(f: FingerInfo): string | undefined {
  const eigene = activeLayout().heimtasten;
  if (!eigene) return undefined;
  const i = HEIMTASTEN_FINGER.indexOf(f.id);
  return i < 0 ? undefined : eigene[i];
}

/**
 * Die WIRKLICHE Grundstellungs-Taste eines Fingers, je Lernweg - für jeden
 * Finger AUSSER dem linken und dem rechten kleinen identisch mit
 * {@link FingerInfo.homeKey}; für sie siehe {@link ersteGrundtasteHomeKey}
 * bzw. {@link achteGrundtasteHomeKey}.
 */
export function homeKeyFor(f: FingerInfo, lernweg: Lernweg): string {
  // ★★★ F3-tr (02.10.2026, Teil C): trägt die EINGESTELLTE Tastatur ihre Heimtasten selbst
  // (`KeyboardLayout.heimtasten`: türkisch F `u i e a | k m l y`, türkisch Q `a s d f | j k l ş`), gelten
  // die - für jeden Weg, ohne Sprach- oder Tastatur-Kennung zu fragen (Falle 50). Alle bisherigen
  // Tastaturen tragen das Feld nicht: dann läuft es wie bisher über die Regeln darunter.
  const eigene = heimtasteDerTastatur(f);
  if (eigene !== undefined) return eigene;
  if (f.id === "kleiner-rechts") return achteGrundtasteHomeKey(lernweg);
  if (f.id === "kleiner-links") return ersteGrundtasteHomeKey(lernweg);
  return f.homeKey;
}

/** Welche Zusatztaste ein Zeichen braucht. */
export type KeyMod = "shift" | "altgr";

/**
 * Zugang zu Zeichen, die NICHT direkt auf einer eigenen Taste liegen, sondern
 * über eine Zusatztaste (Umschalt oder AltGr/„Alt Gr") bzw. eine Akzent-/Totaste
 * erreicht werden. `base` ist die physische Taste, `mod` die nötige Zusatztaste,
 * `dead` markiert eine Totaste (erst die Taste, dann die Leertaste).
 *
 * WELCHE Belegung gilt, hängt am eingestellten Tastatur-Layout (layouts.ts): auf
 * der deutschen Tastatur ist `@` = AltGr+Q, auf der Schweizer AltGr+2, auf der
 * amerikanischen Umschalt+2. Nachgeschlagen wird immer über {@link charAccess}.
 */
export interface KeyAccess {
  base: string;
  mod?: KeyMod;
  dead?: boolean;
  /**
   * ★★★ F3-pl (02.10.2026, R1 §8.1): ein BUCHSTABE des Alphabets, der auf AltGr (Mac: Option) + der
   * Taste seines Grundbuchstabens liegt - Polnisch `ą ć ę ł ń ó ś ź ż` auf Windows „Polski
   * (programisty)" und Mac „Polish - Pro". Bisher stand `mod: "altgr"` NUR für Symbole (`@ € { } [ ] | ~`
   * auf de/ch/es/it/latam), deren Zeichen mit dem Aufdruck der Taste nichts zu tun hat. Ein
   * AltGr-Buchstabe ist dagegen ein ANSCHLAG wie jeder andere im Wort (EIN `keydown`, `key` = der
   * fertige Buchstabe, kein `Dead`) und gehört in den Lehrgang als Buchstabe, nicht als
   * „Sonderzeichen" - `mod` bleibt `"altgr"`, damit jede Stelle, die „braucht AltGr" fragt
   * (`needsAltGr`, Anzeige, Ansage), ihn weiter richtig behandelt; wer den Unterschied braucht,
   * liest dieses Merkmal. Der Großbuchstabe ist ein EIGENER Eintrag (`Ą` ist nicht „Umschalt + die
   * ą-Taste" - es gibt keine ą-Taste), siehe {@link KeyAccess.mitUmschalt}.
   */
  buchstabe?: true;
  /**
   * ★ F3-pl: zusätzlich zu `mod` die UMSCHALTtaste - der Großbuchstabe eines AltGr-Buchstabens (`Ą` =
   * AltGr + Umschalt + a; Feststell + AltGr + a geht auf Windows ebenfalls, ist aber kein Weg der Lehre).
   * Bewusst ein Merkmal NEBEN `mod` und kein dritter Wert in {@link KeyMod}: die vielen Stellen, die
   * `mod === "altgr"` abfragen, würden `"altgr-shift"` nicht kennen und `Ą` als „direkte Taste A"
   * behandeln. Die Umschalttaste selbst wählt die Gegenhand-Regel ({@link shiftHandFor}); für
   * `needsShift` zählt `Ą` ohnehin als Großbuchstabe.
   */
  mitUmschalt?: true;
}

/**
 * Der Zugangsweg eines Zeichens auf der EINGESTELLTEN Tastatur (Umschalt, AltGr,
 * Totaste) — sonst `undefined`, dann liegt es auf einer eigenen Taste.
 */
export function charAccess(ch: string): KeyAccess | undefined {
  return zugangFuer(activeLayout(), ch);
}

/**
 * ★★★ G2b-1 (02.10.2026, Türkisch T7): in WELCHER Sprache gross/klein gerechnet
 * wird - die ausdrücklich übergebene (die des Weges), sonst die der eingestellten
 * Tastatur (`KeyboardLayout.sprache`, Vorgabe Deutsch = die gewöhnliche
 * `toLowerCase()`). Türkisch hat vier i-Buchstaben: „I" ist die Grossform von
 * „ı", „İ" die von „i" - `"İ".toLowerCase()` wären zwei Zeichen.
 */
function rechenSprache(sprache?: Lang): Lang {
  return sprache ?? layoutSprache();
}

/**
 * Die physische Grund-Taste für ein Zeichen (für Tastatur-Hervorhebung).
 *
 * ★ G2b-1: Hat die Tastatur für das Zeichen einen `access`-Eintrag (türkisch
 * `I` = Umschalt + `ı`, `İ` = Umschalt + `i`), gilt der. Sonst rechnet der
 * Rückfall in der Sprache des Weges/der Tastatur klein: `I` ⇒ `ı`, `İ` ⇒ `i`
 * (nicht „i" und nicht die zwei Zeichen `i̇`).
 */
export function baseKeyForChar(ch: string, sprache?: Lang): string {
  if (!ch) return "";
  const acc = charAccess(ch);
  if (acc) return acc.base;
  return kleinFuer(ch, rechenSprache(sprache));
}

/** Braucht das Zeichen die AltGr-/„Alt Gr"-Taste? */
export function needsAltGr(ch: string): boolean {
  return charAccess(ch)?.mod === "altgr";
}

/** Welcher Finger ist für dieses Zeichen zuständig? (Groß → wie Klein.) */
export function fingerForChar(ch: string, sprache?: Lang): FingerInfo | null {
  if (!ch) return null;
  const keys = layoutIndex(activeLayout()).finger;
  const lower = kleinFuer(ch, rechenSprache(sprache));
  let id = keys.get(lower) ?? keys.get(ch);
  // Sonderzeichen über Zusatz-/Totaste: Finger der physischen Grund-Taste.
  if (!id) {
    const acc = charAccess(ch);
    if (acc) id = keys.get(acc.base);
  }
  return id ? FINGERS[id] : null;
}

/**
 * Braucht das Zeichen die Umschalttaste? (Großbuchstabe oder Shift-Sonderzeichen.)
 * Auf der Schweizer Tastatur kommen Ä Ö Ü über die FESTSTELLTASTE — Umschalt + ä
 * ergibt dort à. Solche Zeichen zählen hier bewusst NICHT als Umschalt-Zeichen,
 * sonst würde die Gegenhand-Regel einen Fehler melden, obwohl richtig getippt wurde.
 */
export function needsShift(ch: string, sprache?: Lang): boolean {
  if (ch.length !== 1) return false;
  if (needsCapsLock(ch)) return false;
  const sp = rechenSprache(sprache);
  if (ch !== kleinFuer(ch, sp) && ch === grossFuer(ch, sp)) return true; // Großbuchstabe
  return charAccess(ch)?.mod === "shift";
}

/**
 * Welche Umschalttaste (Gegenhand-Prinzip): Großzeichen der rechten Hand →
 * LINKE Umschalttaste (linker kleiner Finger) und umgekehrt.
 */
export function shiftHandFor(ch: string, sprache?: Lang): Hand | null {
  if (!needsShift(ch, sprache)) return null;
  /*
   * ★ W1 (27.09.2026): Ein Grossbuchstabe über eine Totaste („À" auf
   * Frankreich: Gravis, dann Umschalt + A; „Ä" auf der Schweizer Tastatur: ¨,
   * dann Umschalt + A) braucht die Umschalttaste gegen die Hand des
   * BUCHSTABENS - nicht gegen die Hand der Taste, auf der sein Kleinbuchstabe
   * liegt (à rechts, A links). Sonst verlangte die Gegenhand-Regel die falsche
   * Seite.
   */
  const kombi = kombizeichenZu(ch, activeLayout());
  const finger = fingerForChar(kombi ? kombi.dann : ch, sprache);
  if (!finger) return null;
  return finger.hand === "links" ? "rechts" : "links";
}

/**
 * Gesprochene Finger-Wegweisung für ein Zeichen — für blinde Lernende, die den
 * zuständigen Finger nicht sehen können. Nennt Finger, Heimattaste (Ausgangs-
 * punkt der Bewegung) und ob die Umschalttaste der Gegenhand dazugehört. Wird im
 * Tippfeld über zweimaliges Drücken der Umschalttaste abgerufen.
 */
/** Reihen-Namen der Tastatur (für Ortsangaben ohne Hinsehen). */
const ROW_NAMES = ["Zahlenreihe", "obere Reihe", "Grundreihe", "untere Reihe"];

/**
 * Wo liegt eine Taste? Gesagt wird die Nachbartaste links davon — das ist für
 * blinde Lernende der brauchbarste Anhaltspunkt („rechts neben der 0"). Die
 * Angabe kommt aus dem eingestellten Layout, gilt also auch für die Schweizer und
 * die englischen Tastaturen.
 */
export function keyPlaceHint(key: string): string {
  const rows = activeLayout().rows;
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r].keys.indexOf(key);
    if (i < 0) continue;
    if (i === 0) return `ganz links in der ${ROW_NAMES[r]}`;
    const left = rows[r].keys[i - 1];
    return `rechts neben ${/^[0-9]$/.test(left) ? "der " + left : charLabel(left).length > 1 ? "dem " + charLabel(left) : grossFuer(left, layoutSprache())}`;
  }
  return `in der ${ROW_NAMES[0]}`;
}

/**
 * ★ E8 (24.09.2026): `lernweg` ist Pflicht - der Weg DES KINDES (Bauplan §2.3:
 * kein stiller Rückfall auf „de" in der Signatur, sonst übersieht man eine
 * Stelle). Er wirkt nur an der Heimattaste des rechten kleinen Fingers
 * (siehe {@link homeKeyFor}) - auf Weg „de" ändert sich nichts.
 */
export function fingerGuide(ch: string, oneHand: boolean, lernweg: Lernweg): string {
  if (!ch) return "";
  if (ch === " ") return "Leertaste mit dem Daumen.";
  // ★ Zeilenende mit Enter (23.09.2026) - derselbe einfache Aufbau wie bei der
  // Leertaste: EIN fester Finger, keine Heimattaste, kein Umschalt-Anteil.
  if (ch === "\n") return "Eingabetaste mit dem rechten kleinen Finger.";
  /*
   * ★ K2 (28.09.2026, Schlussprüfung Nachtlauf): Zeichen, die auf DIESER
   * Tastatur über eine Totaste entstehen - „Ä Ö Ü" auf der Schweizer Tastatur
   * unter Windows (¨, dann Umschalt + A), „À" (Gravis, dann A). Seit W1 kam
   * für Ä hier „dazu die rechte Umschalttaste" - Umschalt + ä ergibt unter
   * Windows aber „à". Jetzt dieselben zwei Schritte wie der Totasten-Hinweis
   * der Übungsseite (`TypingSession`, `totastenHinweisFuer`): die Totaste mit
   * ihrem Finger (und AltGr/Umschalt, falls nötig), dann der Buchstabe mit
   * der Umschalttaste gegen seine Hand (`shiftHandFor`). Auf dem Mac entsteht
   * „Ä" über die Feststelltaste (`kombizeichenZu` findet dort nichts) - das
   * bleibt der Fall darunter.
   */
  const kombi = kombizeichenZu(ch, activeLayout());
  if (kombi) {
    const fTot = fingerForChar(kombi.tot, lernweg);
    const mod = activeLayout().access[kombi.tot]?.mod;
    const zusatz =
      mod === "altgr" ? ` + ${bottomLabelsFuer(activeLayout())[2]}-Taste` : mod === "shift" ? " + Umschalttaste" : "";
    // Derselbe Name wie `totasteName(tot, "de")` (`totastenTexte.ts`) - von
    // hier aus nicht importierbar (Kreis über `bedienSprache/texte`, gemessen:
    // „texte is not a function"). `charLabel` nennt ¨ ` ´ schon gleich, nur
    // „^" heisst als Taste „Dach". Der Wächter vergleicht beide.
    const totName = kombi.tot === "^" ? "Zirkumflex" : charLabel(kombi.tot);
    const fDann = fingerForChar(kombi.dann, lernweg);
    const seite = shiftHandFor(ch, lernweg);
    const shiftTxt = seite
      ? `, dazu die ${oneHand ? "Umschalttaste" : `${seite === "links" ? "linke" : "rechte"} Umschalttaste`}`
      : "";
    return (
      `${charLabel(ch)}: ${totName} (${fTot?.name ?? ""}${zusatz}), ` +
      `dann ${charLabel(kombi.dann)}, ${fDann?.name ?? ""}${shiftTxt}.`
    );
  }

  const f = fingerForChar(ch, lernweg);
  if (!f) return charLabel(ch);
  const heimtaste = homeKeyFor(f, lernweg);

  // „Einhand schreiben": Es wird keine bestimmte Umschalt-Seite verlangt →
  // neutraler Hinweis „die Umschalttaste" statt „linke/rechte".
  const shiftWord = (side: Hand | null) =>
    oneHand ? "Umschalttaste" : `${side === "links" ? "linke" : "rechte"} Umschalttaste`;

  // Großbuchstaben, die auf dieser Tastatur die Feststelltaste brauchen
  // (Schweiz auf dem Mac: Ä Ö Ü — Umschalt ergibt dort à é è).
  if (needsCapsLock(ch)) {
    const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
    const where = home ? `, Heimattaste ${home}` : "";
    return `${charLabel(ch)}: ${f.name}${where}, dazu die Feststelltaste.`;
  }

  // Sonderzeichen über Zusatz-/Totaste: Finger + physische Grund-Taste + Zusatztaste.
  const acc = charAccess(ch);
  if (acc) {
    const baseLabel = acc.base === " " ? "Leertaste" : grossFuer(acc.base, lernweg);
    let how: string;
    if (acc.dead) {
      how = `Akzenttaste ${keyPlaceHint(acc.base)}, danach die Leertaste`;
    } else if (acc.mod === "altgr") {
      // ★ F3-pl: ein AltGr-BUCHSTABE (Polnisch ą ć ę ł ń ó ś ź ż) greift der rechte Daumen - die Taste
      // liegt rechts neben der Leertaste; beim Großbuchstaben kommt die Umschalttaste der Gegenhand dazu
      // (R0 §4.2, R1 §2.5: so kollidiert der kleine Finger nicht mit der Umschalttaste).
      const altgr = bottomLabelsFuer(activeLayout())[2];
      if (acc.buchstabe) {
        const daumen = oneHand ? "" : " mit dem rechten Daumen";
        const mitShift = acc.mitUmschalt ? `, dazu die ${shiftWord(shiftHandFor(ch, lernweg))},` : "";
        how = `${altgr}-Taste (rechts neben der Leertaste)${daumen} halten${mitShift} und ${baseLabel}`;
      } else {
        how = `${altgr}-Taste (rechts neben der Leertaste) halten und ${baseLabel}`;
      }
    } else if (acc.mod === "shift") {
      how = `${shiftWord(shiftHandFor(ch, lernweg))} halten und ${baseLabel}`;
    } else {
      how = `Taste ${baseLabel}`;
    }
    return `${charLabel(ch)}: ${f.name}, ${how}.`;
  }

  const onHome = kleinFuer(ch, lernweg) === heimtaste;
  const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const where = onHome
    ? ", auf der Grundstellung"
    : home
      ? `, Heimattaste ${home}`
      : "";
  const shift = shiftHandFor(ch, lernweg);
  const shiftTxt = shift ? `, dazu die ${shiftWord(shift)}` : "";
  return `${charLabel(ch)}: ${f.name}${where}${shiftTxt}.`;
}

/** Die Reihen auf Englisch - Glossar §3.5 (*number row*, *top row*, *home row*, *bottom row*). */
const ROW_NAMES_EN = ["number row", "top row", "home row", "bottom row"];

/** {@link keyPlaceHint} auf Englisch: „at the far left of the number row", „to the right of 0". */
function keyPlaceHintEn(key: string): string {
  const rows = activeLayout().rows;
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r].keys.indexOf(key);
    if (i < 0) continue;
    if (i === 0) return `at the far left of the ${ROW_NAMES_EN[r]}`;
    const left = rows[r].keys[i - 1];
    const name = spokenLabel(left, "en");
    return `to the right of ${/^[0-9]$/.test(left) ? left : name.length > 1 ? "the " + name : grossFuer(left, layoutSprache())}`;
  }
  return `in the ${ROW_NAMES_EN[0]}`;
}

/**
 * ★ {@link fingerGuide} in der englischen BEDIENUNG (EN1, 19.09.2026) - der
 * Satz auf zweimal Umschalt. Derselbe Aufbau Zweig für Zweig, damit beide
 * Fassungen dasselbe sagen: Zeichen, Finger, woher er greift, welche
 * Zusatztaste. Glossar §3.5: *Shift*, *Caps Lock*, *space bar*, *little
 * finger*. „Heimattaste" heisst hier *reaching from F* - „home key" wäre mit
 * der Taste Pos1 (*Home*) zu verwechseln.
 */
/** ★ E8 (24.09.2026): `lernweg` Pflicht - siehe {@link fingerGuide}. */
export function fingerGuideEn(ch: string, oneHand: boolean, lernweg: Lernweg): string {
  if (!ch) return "";
  if (ch === " ") return "Space bar with your thumb.";
  // ★ Finish each line with Enter (23.09.2026) - same simple shape as space.
  if (ch === "\n") return "Enter with your right little finger.";
  const f = fingerForChar(ch, lernweg);
  const label = spokenLabel(ch, "en");
  if (!f) return label;
  const heimtaste = homeKeyFor(f, lernweg);
  const finger = fingerName(f, "en");
  const shiftWord = (side: Hand | null) =>
    oneHand ? "Shift" : `the ${side === "links" ? "left" : "right"} Shift`;

  if (needsCapsLock(ch)) {
    const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
    const where = home ? `, reaching from ${home}` : "";
    return `${label}: ${finger}${where}, plus Caps Lock.`;
  }

  const acc = charAccess(ch);
  if (acc) {
    const baseLabel = acc.base === " " ? "the space bar" : grossFuer(acc.base, lernweg);
    let how: string;
    if (acc.dead) {
      how = `the accent key ${keyPlaceHintEn(acc.base)}, then the space bar`;
    } else if (acc.mod === "altgr") {
      const altgr = bottomLabelsFuer(activeLayout())[2];
      if (acc.buchstabe) {
        const daumen = oneHand ? "" : " with your right thumb";
        const mitShift = acc.mitUmschalt ? `, plus ${shiftWord(shiftHandFor(ch, lernweg))},` : "";
        how = `hold ${altgr} (to the right of the space bar)${daumen}${mitShift} and press ${baseLabel}`;
      } else {
        how = `hold ${altgr} (to the right of the space bar) and press ${baseLabel}`;
      }
    } else if (acc.mod === "shift") {
      how = `hold ${shiftWord(shiftHandFor(ch, lernweg))} and press ${baseLabel}`;
    } else {
      how = `the ${baseLabel} key`;
    }
    return `${label}: ${finger}, ${how}.`;
  }

  const onHome = kleinFuer(ch, lernweg) === heimtaste;
  const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const where = onHome ? ", in the home position" : home ? `, reaching from ${home}` : "";
  const shift = shiftHandFor(ch, lernweg);
  const shiftTxt = shift ? `, plus ${shiftWord(shift)}` : "";
  return `${label}: ${finger}${where}${shiftTxt}.`;
}

/**
 * ★ E11a-5 (26.09.2026): {@link keyPlaceHint} auf Französisch - „tout à
 * gauche de la rangée des chiffres", „à droite du 0". Die Reihennamen stehen
 * weiter unten in `ROW_NAMES_FR` (E10a); hier als eigene kleine Liste, weil
 * `const` erst nach dieser Stelle gilt und die Funktion beim Laden nicht läuft.
 */
function keyPlaceHintFr(key: string): string {
  const reihen = ["rangée des chiffres", "rangée du haut", "rangée de base", "rangée du bas"];
  const rows = activeLayout().rows;
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r].keys.indexOf(key);
    if (i < 0) continue;
    if (i === 0) return `tout à gauche de la ${reihen[r]}`;
    const left = rows[r].keys[i - 1];
    const name = spokenLabel(left, "fr");
    return `à droite ${/^[0-9]$/.test(left) ? "du " + left : name.length > 1 ? "de la touche " + name : "du " + grossFuer(left, layoutSprache())}`;
  }
  return `dans la ${reihen[0]}`;
}

/**
 * ★★ E11a-5 (26.09.2026, Johannes F18: alles auf Französisch): die
 * Finger-Ansage nach zweimal Umschalttaste auf Französisch - bis dahin bekam
 * die französische Bedienung hier die DEUTSCHE Ansage (`englischeBedienung ?
 * fingerGuideEn : fingerGuide`, Falle 30). Derselbe Aufbau wie
 * {@link fingerGuideEn}, neu auf Französisch formuliert (Glossar §9.2:
 * Maj, Verr. Maj, Espace, Entrée, « position de départ »; Finger: index,
 * majeur, annulaire, auriculaire, pouce). Die Heimattaste kommt aus dem
 * Lernweg - auf AZERTY (Weg „fr") also Q … M.
 */
export function fingerGuideFr(ch: string, oneHand: boolean, lernweg: Lernweg): string {
  if (!ch) return "";
  if (ch === " ") return "Espace avec le pouce.";
  if (ch === "\n") return "Entrée avec l'auriculaire droit.";
  const f = fingerForChar(ch, lernweg);
  const label = spokenLabel(ch, "fr");
  if (!f) return label;
  const heimtaste = homeKeyFor(f, lernweg);
  const finger = fingerName(f, "fr");
  const shiftWord = (side: Hand | null) =>
    oneHand ? "Maj" : `la touche Maj ${side === "links" ? "de gauche" : "de droite"}`;

  if (needsCapsLock(ch)) {
    const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
    const where = home ? `, depuis ${home}` : "";
    return `${label} : ${finger}${where}, avec Verr. Maj.`;
  }

  const acc = charAccess(ch);
  if (acc) {
    const baseLabel = acc.base === " " ? "Espace" : grossFuer(acc.base, lernweg);
    let how: string;
    if (acc.dead) {
      how = `la touche d'accent ${keyPlaceHintFr(acc.base)}, puis Espace`;
    } else if (acc.mod === "altgr") {
      const altgr = bottomLabelsFuer(activeLayout())[2];
      if (acc.buchstabe) {
        const pouce = oneHand ? "" : " avec le pouce droit";
        const mitMaj = acc.mitUmschalt ? `, avec ${shiftWord(shiftHandFor(ch, lernweg))},` : "";
        how = `garde ${altgr} (à droite d'Espace)${pouce} enfoncée${mitMaj} et appuie sur ${baseLabel}`;
      } else {
        how = `garde ${altgr} (à droite d'Espace) enfoncée et appuie sur ${baseLabel}`;
      }
    } else if (acc.mod === "shift") {
      how = `garde ${shiftWord(shiftHandFor(ch, lernweg))} enfoncée et appuie sur ${baseLabel}`;
    } else {
      how = `la touche ${baseLabel}`;
    }
    return `${label} : ${finger}, ${how}.`;
  }

  const onHome = kleinFuer(ch, lernweg) === heimtaste;
  const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const where = onHome ? ", en position de départ" : home ? `, depuis ${home}` : "";
  const shift = shiftHandFor(ch, lernweg);
  const shiftTxt = shift ? `, avec ${shiftWord(shift)}` : "";
  return `${label} : ${finger}${where}${shiftTxt}.`;
}

/**
 * ★★★ ES-F8 (27.09.2026, Bauplan spanischer Lehrgang §4.4/§7, Auftrag Punkt
 * 2): {@link keyPlaceHint} auf Spanisch - „a la izquierda del todo en la fila
 * de los números", „a la derecha del 0". Reihennamen siehe {@link ROW_NAMES_ES}
 * weiter unten; hier als eigene kleine Liste aus demselben Grund wie bei
 * {@link keyPlaceHintFr} (`const` gilt erst nach dieser Stelle).
 */
function keyPlaceHintEs(key: string): string {
  const filas = ["fila de los números", "fila superior", "fila guía", "fila inferior"];
  const rows = activeLayout().rows;
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r].keys.indexOf(key);
    if (i < 0) continue;
    if (i === 0) return `a la izquierda del todo en la ${filas[r]}`;
    const left = rows[r].keys[i - 1];
    const name = spokenLabel(left, "es");
    return `a la derecha ${/^[0-9]$/.test(left) ? "del " + left : name.length > 1 ? "de la tecla " + name : "del " + grossFuer(left, layoutSprache())}`;
  }
  return `en la ${filas[0]}`;
}

/**
 * ★★★ ES-F8 (27.09.2026, Bauplan §4.4/§7, Auftrag Punkt 2): die
 * Finger-Ansage auf SPANISCH - derselbe Aufbau wie {@link fingerGuideFr},
 * neu auf Spanisch formuliert (Bauplan §7 Glossar: Mayús, Bloq Mayús, Intro,
 * Retroceso, barra espaciadora, tecla muerta; Finger: índice, medio, anular,
 * meñique, pulgar). Kind-Anrede „tú" (Bauplan S9). Die Heimattaste kommt aus
 * dem Lernweg - Weg „es" hat auf BEIDEN Pflicht-Tastaturen dieselbe physische
 * Grundreihe (BEFUND ES-F3/F4 §1), darum ändert sich hier nichts an
 * `homeKeyFor`.
 */
export function fingerGuideEs(ch: string, oneHand: boolean, lernweg: Lernweg): string {
  if (!ch) return "";
  if (ch === " ") return "Barra espaciadora con el pulgar.";
  if (ch === "\n") return "Intro con el meñique derecho.";
  const f = fingerForChar(ch, lernweg);
  const label = spokenLabel(ch, "es");
  if (!f) return label;
  const heimtaste = homeKeyFor(f, lernweg);
  const finger = fingerName(f, "es");
  const shiftWord = (side: Hand | null) =>
    oneHand ? "Mayús" : `la tecla Mayús ${side === "links" ? "izquierda" : "derecha"}`;

  if (needsCapsLock(ch)) {
    const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
    const where = home ? `, desde ${home}` : "";
    return `${label}: ${finger}${where}, con Bloq Mayús.`;
  }

  const acc = charAccess(ch);
  if (acc) {
    const baseLabel = acc.base === " " ? "la barra espaciadora" : grossFuer(acc.base, lernweg);
    let how: string;
    if (acc.dead) {
      how = `la tecla de acento ${keyPlaceHintEs(acc.base)}, luego la barra espaciadora`;
    } else if (acc.mod === "altgr") {
      const altgr = bottomLabelsFuer(activeLayout())[2];
      if (acc.buchstabe) {
        const pulgar = oneHand ? "" : " con el pulgar derecho";
        const conMayus = acc.mitUmschalt ? `, con ${shiftWord(shiftHandFor(ch, lernweg))},` : "";
        how = `mantén ${altgr} (a la derecha de la barra espaciadora)${pulgar}${conMayus} y pulsa ${baseLabel}`;
      } else {
        how = `mantén ${altgr} (a la derecha de la barra espaciadora) y pulsa ${baseLabel}`;
      }
    } else if (acc.mod === "shift") {
      how = `mantén ${shiftWord(shiftHandFor(ch, lernweg))} y pulsa ${baseLabel}`;
    } else {
      how = `la tecla ${baseLabel}`;
    }
    return `${label}: ${finger}, ${how}.`;
  }

  const onHome = kleinFuer(ch, lernweg) === heimtaste;
  const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const where = onHome ? ", en la posición inicial" : home ? `, desde ${home}` : "";
  const shift = shiftHandFor(ch, lernweg);
  const shiftTxt = shift ? `, con ${shiftWord(shift)}` : "";
  return `${label}: ${finger}${where}${shiftTxt}.`;
}

/**
 * ★ O-IT (02.10.2026): {@link keyPlaceHint} auf Italienisch - „tutto a
 * sinistra nella riga dei numeri", „a destra dello 0" (Artikel vor Ziffern:
 * dello 0, dell'1, dell'8, sonst del). Reihennamen wie {@link ROW_NAMES_IT}
 * (Glossar §2.1 „riga di base").
 */
function keyPlaceHintIt(key: string): string {
  const righe = ["riga dei numeri", "riga superiore", "riga di base", "riga inferiore"];
  const rows = activeLayout().rows;
  const vorZiffer = (z: string) => (z === "0" ? "dello 0" : z === "1" || z === "8" ? `dell'${z}` : `del ${z}`);
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r].keys.indexOf(key);
    if (i < 0) continue;
    if (i === 0) return `tutto a sinistra nella ${righe[r]}`;
    const left = rows[r].keys[i - 1];
    const name = spokenLabel(left, "it");
    return `a destra ${/^[0-9]$/.test(left) ? vorZiffer(left) : name.length > 1 ? "del tasto " + name : "della " + grossFuer(left, layoutSprache())}`;
  }
  return `nella ${righe[0]}`;
}

/**
 * ★ O-IT (02.10.2026): die Finger-Ansage auf ITALIENISCH - derselbe Aufbau
 * wie {@link fingerGuideEs}, neu formuliert. Glossar §2.1/§2.9: Maiusc,
 * Bloc Maiusc, Invio, barra spaziatrice, tasto morto, posizione base;
 * Finger mignolo, anulare, medio, indice, pollice. Kind „tu".
 */
export function fingerGuideIt(ch: string, oneHand: boolean, lernweg: Lernweg): string {
  if (!ch) return "";
  if (ch === " ") return "Barra spaziatrice con il pollice.";
  if (ch === "\n") return "Invio con il mignolo destro.";
  /*
   * ★★★ F8-it (02.10.2026, F4-Befund §10 Punkt 5): `ì ò ù` (und `à è`, die grossen `Ì Ò Ù`) entstehen auf der Schweizer
   * Belegung (Tessin, Graubünden: `ch-fr`, `ch`) über die GRAVIS-Totaste - Umschalt + ^, dann der Vokal. Die Ansage nannte dort
   * bis hierher nur den Namen („i con accento grave", ohne Finger, ohne Weg): ein Kind mit Blindheit erfuhr nicht, WIE
   * es geschrieben wird. Jetzt zwei Schritte, wie `fingerGuide` (K2, 28.09.2026) sie auf Deutsch sagt: die Totaste mit ihrem
   * Finger (und Maiusc/Alt Gr, falls nötig), dann der Buchstabe - bei einem Grossbuchstaben mit der Maiusc-Taste der
   * Gegenhand. Auf `it`/`it-qzerty` hat jeder Akzentbuchstabe eine eigene Taste (`kombizeichenZu` findet dort nichts).
   */
  const kombi = kombizeichenZu(ch, activeLayout());
  if (kombi) {
    const fTot = fingerForChar(kombi.tot, lernweg);
    const mod = activeLayout().access[kombi.tot]?.mod;
    const zusatz =
      mod === "altgr"
        ? `, con ${bottomLabelsFuer(activeLayout())[2]}`
        : mod === "shift"
          ? ", con Maiusc"
          : "";
    const fDann = fingerForChar(kombi.dann, lernweg);
    const seite = shiftHandFor(ch, lernweg);
    const maiusc = seite ? `, con ${oneHand ? "Maiusc" : `il tasto Maiusc ${seite === "links" ? "sinistro" : "destro"}`}` : "";
    return (
      `${spokenLabel(ch, "it")}: prima il tasto morto ${spokenLabel(kombi.tot, "it")} (${fTot ? fingerName(fTot, "it") : ""}${zusatz}), ` +
      `poi ${grossFuer(kombi.dann, lernweg)}${fDann ? `, ${fingerName(fDann, "it")}` : ""}${maiusc}.`
    );
  }
  const f = fingerForChar(ch, lernweg);
  const label = spokenLabel(ch, "it");
  if (!f) return label;
  const heimtaste = homeKeyFor(f, lernweg);
  const finger = fingerName(f, "it");
  const shiftWord = (side: Hand | null) =>
    oneHand ? "Maiusc" : `il tasto Maiusc ${side === "links" ? "sinistro" : "destro"}`;

  if (needsCapsLock(ch)) {
    const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
    const where = home ? `, da ${home}` : "";
    return `${label}: ${finger}${where}, con Bloc Maiusc.`;
  }

  const acc = charAccess(ch);
  if (acc) {
    const baseLabel = acc.base === " " ? "la barra spaziatrice" : grossFuer(acc.base, lernweg);
    let how: string;
    if (acc.dead) {
      how = `il tasto dell'accento ${keyPlaceHintIt(acc.base)}, poi la barra spaziatrice`;
    } else if (acc.mod === "altgr") {
      const altgr = bottomLabelsFuer(activeLayout())[2];
      if (acc.buchstabe) {
        const pollice = oneHand ? "" : " con il pollice destro";
        const conMaiusc = acc.mitUmschalt ? `, con ${shiftWord(shiftHandFor(ch, lernweg))},` : "";
        how = `tieni premuto ${altgr} (a destra della barra spaziatrice)${pollice}${conMaiusc} e premi ${baseLabel}`;
      } else {
        how = `tieni premuto ${altgr} (a destra della barra spaziatrice) e premi ${baseLabel}`;
      }
    } else if (acc.mod === "shift") {
      how = `tieni premuto ${shiftWord(shiftHandFor(ch, lernweg))} e premi ${baseLabel}`;
    } else {
      how = `il tasto ${baseLabel}`;
    }
    return `${label}: ${finger}, ${how}.`;
  }

  const onHome = kleinFuer(ch, lernweg) === heimtaste;
  const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const where = onHome ? ", in posizione base" : home ? `, da ${home}` : "";
  const shift = shiftHandFor(ch, lernweg);
  const shiftTxt = shift ? `, con ${shiftWord(shift)}` : "";
  return `${label}: ${finger}${where}${shiftTxt}.`;
}

/**
 * ★ O-PL (02.10.2026): {@link keyPlaceHint} auf Polnisch - „całkiem po lewej
 * w rzędzie cyfr", „na prawo od cyfry 0", „na prawo od klawisza L". Der Rang
 * der Reihe im Lokativ (Glossar §2.1: rząd cyfr, rząd górny, rząd podstawowy,
 * rząd dolny); der Nachbar nach „od" im Genitiv, darum mit „cyfry"/„klawisza"
 * davor (Glossar Regel 11) - sein Name bleibt ungebeugt.
 */
function keyPlaceHintPl(key: string): string {
  const rzedy = ["rzędzie cyfr", "rzędzie górnym", "rzędzie podstawowym", "rzędzie dolnym"];
  const rows = activeLayout().rows;
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r].keys.indexOf(key);
    if (i < 0) continue;
    if (i === 0) return `całkiem po lewej w ${rzedy[r]}`;
    const left = rows[r].keys[i - 1];
    const name = spokenLabel(left, "pl");
    return `na prawo od ${/^[0-9]$/.test(left) ? "cyfry " + left : name.length > 1 ? "klawisza " + name : "klawisza " + grossFuer(left, layoutSprache())}`;
  }
  return `w ${rzedy[0]}`;
}

/**
 * ★ O-PL (02.10.2026): die Finger-Ansage auf POLNISCH - derselbe Aufbau wie
 * {@link fingerGuideIt}, neu formuliert. Glossar §2.1/§2.9: Shift, Caps Lock,
 * Enter, spacja, prawy Alt (Mac: Option), klawisz martwy, pozycja podstawowa;
 * Finger aus {@link FINGER_PL}. Ty-Befehlsform, kein Geschlecht. Gezählt wird
 * nach dem Doppelpunkt im Nominativ („ą: lewy mały, …"), damit kein Fingername
 * gebeugt werden muss. Die AltGr-Buchstaben (ą ć ę ł ń ó ś ź ż) greift der
 * rechte Kciuk (R0 §4.2, R1 §2.5) - wie in {@link fingerGuide}.
 */
export function fingerGuidePl(ch: string, oneHand: boolean, lernweg: Lernweg): string {
  if (!ch) return "";
  if (ch === " ") return "Spacja: kciuk.";
  if (ch === "\n") return "Enter: prawy mały.";
  const f = fingerForChar(ch, lernweg);
  const label = spokenLabel(ch, "pl");
  if (!f) return label;
  const heimtaste = homeKeyFor(f, lernweg);
  const finger = fingerName(f, "pl");
  const shiftWord = (side: Hand | null) =>
    oneHand ? "Shift" : `${side === "links" ? "lewy" : "prawy"} Shift`;

  if (needsCapsLock(ch)) {
    const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
    const where = home ? `, od klawisza ${home}` : "";
    return `${label}: ${finger}${where}, do tego Caps Lock.`;
  }

  const acc = charAccess(ch);
  if (acc) {
    // Buchstaben und Ziffern wie auf der Kappe, Zeichen beim Namen („klawisz średnik").
    const baseLabel =
      acc.base === " "
        ? "spację"
        : `klawisz ${/^[\p{L}\p{N}]$/u.test(acc.base) ? grossFuer(acc.base, lernweg) : spokenLabel(acc.base, "pl")}`;
    let how: string;
    if (acc.dead) {
      how = `klawisz martwy ${keyPlaceHintPl(acc.base)}, potem spacja`;
    } else if (acc.mod === "altgr") {
      // Rechts neben der Leertaste: unter Windows „prawy Alt" (auch wo die Kappe
      // „Alt Gr" heisst), am Mac „Option" (Glossar §2.9).
      const altgr = bottomLabelsFuer(activeLayout())[2] === "Option" ? "klawisz Option" : "prawy Alt";
      if (acc.buchstabe) {
        const kciuk = oneHand ? "" : " prawym kciukiem";
        const mitShift = acc.mitUmschalt ? `, do tego ${shiftWord(shiftHandFor(ch, lernweg))},` : "";
        how = `przytrzymaj ${altgr} (na prawo od spacji)${kciuk}${mitShift} i naciśnij ${baseLabel}`;
      } else {
        how = `przytrzymaj ${altgr} (na prawo od spacji) i naciśnij ${baseLabel}`;
      }
    } else if (acc.mod === "shift") {
      how = `przytrzymaj ${shiftWord(shiftHandFor(ch, lernweg))} i naciśnij ${baseLabel}`;
    } else {
      how = acc.base === " " ? "spacja" : baseLabel;
    }
    return `${label}: ${finger}, ${how}.`;
  }

  const onHome = kleinFuer(ch, lernweg) === heimtaste;
  const home = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const where = onHome ? ", w pozycji podstawowej" : home ? `, od klawisza ${home}` : "";
  const shift = shiftHandFor(ch, lernweg);
  const shiftTxt = shift ? `, do tego ${shiftWord(shift)}` : "";
  return `${label}: ${finger}${where}${shiftTxt}.`;
}

/**
 * ★ O-TR (02.10.2026): eine Taste im türkischen Satz - die Endung hängt an
 * „tuş" (bzw. „çubuk"), NIE an den Namen (Glossar §1 Regel 6): „F tuşu",
 * „F tuşuna", „boşluk çubuğuna". Buchstaben wie auf der Kappe DER Tastatur
 * (`layoutSprache`: auf `tr-q` „İ" für die i-Taste, „I" für die ı-Taste),
 * Zeichen beim Namen („virgül tuşu").
 */
function tusTr(key: string): { nom: string; dat: string; abl: string } {
  if (key === " ") return { nom: "boşluk çubuğu", dat: "boşluk çubuğuna", abl: "boşluk çubuğundan" };
  const k = /^[\p{L}\p{N}]$/u.test(key) ? grossFuer(key, layoutSprache()) : spokenLabel(key, "tr");
  return { nom: `${k} tuşu`, dat: `${k} tuşuna`, abl: `${k} tuşundan` };
}

/**
 * ★ O-TR (02.10.2026): {@link keyPlaceHint} auf Türkisch - „sayı sırasının en
 * solunda", „2 tuşunun sağında", „noktalı i tuşunun sağında". Die Reihe im
 * Genitiv (Glossar §2.1: sayı sırası, üst sıra, temel sıra, alt sıra), der
 * Nachbar mit „tuşunun" dahinter - sein Name bleibt ohne Endung.
 */
function keyPlaceHintTr(key: string): string {
  const siralar = ["sayı sırasının", "üst sıranın", "temel sıranın", "alt sıranın"];
  const rows = activeLayout().rows;
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r].keys.indexOf(key);
    if (i < 0) continue;
    if (i === 0) return `${siralar[r]} en solunda`;
    const left = rows[r].keys[i - 1];
    const name = spokenLabel(left, "tr");
    const k = /^[0-9]$/.test(left) ? left : name.length > 1 ? name : grossFuer(left, layoutSprache());
    return `${k} tuşunun sağında`;
  }
  return "sayı sırasında";
}

/**
 * ★ O-TR (02.10.2026): die Finger-Ansage auf TÜRKISCH - derselbe Aufbau wie
 * {@link fingerGuidePl}, neu formuliert. Glossar §2.1/§2.9: Shift, Caps Lock,
 * Enter, boşluk çubuğu, Alt Gr (Mac: Option), ölü tuş, temel konum; Finger aus
 * {@link FINGER_TR}. Sen-Befehlsform („basılı tut", „bas"). Zeichen und Finger
 * nach dem Doppelpunkt ohne Endung („büyük A: sol serçe parmak, temel konumda,
 * ayrıca sağ Shift tuşu."). Ein Alt-Gr-BUCHSTABE greift der rechte Daumen -
 * wie in {@link fingerGuide}.
 */
export function fingerGuideTr(ch: string, oneHand: boolean, lernweg: Lernweg): string {
  if (!ch) return "";
  if (ch === " ") return "Boşluk çubuğu: başparmak.";
  if (ch === "\n") return "Enter: sağ serçe parmak.";
  /*
   * ★★★ F8-tr (03.10.2026, F4-Befund §3 „offen"): `â î û` entstehen auf `tr-q` über die Totaste `^` (Umschalt + 3, dann der Vokal) -
   * die Ansage nannte dort bis hierher nur den Namen („şapkalı a", ohne Finger, ohne Weg): ein Kind mit Blindheit erfuhr nicht, WIE es
   * geschrieben wird. Jetzt zwei Schritte, wie `fingerGuide` (K2) und `fingerGuideIt` sie sagen: die Totaste mit ihrem Finger (und Shift,
   * falls nötig), dann der Vokal - bei einem Grossbuchstaben mit der Shift-Taste der Gegenhand. Auf Tastaturen ohne Totaste findet
   * `kombizeichenZu` nichts - dort bleibt es bei der eigenen Taste. Der Name der Totaste und des Vokals ohne Endung (Regel 6).
   */
  const kombi = kombizeichenZu(ch, activeLayout());
  if (kombi) {
    const fTot = fingerForChar(kombi.tot, lernweg);
    const mod = activeLayout().access[kombi.tot]?.mod;
    const zusatz = mod === "altgr" ? `, ${bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : "Alt Gr"} tuşuyla` : mod === "shift" ? ", Shift tuşuyla" : "";
    const fDann = fingerForChar(kombi.dann, lernweg);
    const seite = shiftHandFor(ch, lernweg);
    const shiftTxt = seite ? `, ayrıca ${oneHand ? "" : seite === "links" ? "sol " : "sağ "}Shift tuşu` : "";
    return (
      `${spokenLabel(ch, "tr")}: önce ölü tuş ${spokenLabel(kombi.tot, "tr")} (${fTot ? fingerName(fTot, "tr") : ""}${zusatz}), ` +
      `sonra ${tusTr(kombi.dann).nom}${fDann ? `: ${fingerName(fDann, "tr")}` : ""}${shiftTxt}.`
    );
  }
  const f = fingerForChar(ch, lernweg);
  const label = spokenLabel(ch, "tr");
  if (!f) return label;
  const heimtaste = homeKeyFor(f, lernweg);
  const finger = fingerName(f, "tr");
  // „sol Shift tuşu" / „sağ Shift tuşu" - bei „Tek elle yazma" ohne Seite.
  const shiftSeite = (side: Hand | null) => (oneHand ? "" : side === "links" ? "sol " : "sağ ");
  const home = heimtaste === " " ? "" : tusTr(heimtaste).abl;

  if (needsCapsLock(ch)) {
    const where = home ? `, ${home}` : "";
    return `${label}: ${finger}${where}, ayrıca Caps Lock tuşu.`;
  }

  const acc = charAccess(ch);
  if (acc) {
    const base = tusTr(acc.base);
    let how: string;
    if (acc.dead) {
      how = `ölü tuş (${keyPlaceHintTr(acc.base)}), sonra boşluk çubuğu`;
    } else if (acc.mod === "altgr") {
      // Rechts neben der Leertaste: unter Windows „Alt Gr", am Mac „Option" (Glossar §2.9).
      const altgr = bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : "Alt Gr";
      if (acc.buchstabe) {
        const bas = oneHand ? "" : " sağ başparmakla";
        how = acc.mitUmschalt
          ? `${altgr} tuşunu${bas} ve ${shiftSeite(shiftHandFor(ch, lernweg))}Shift tuşunu basılı tut, sonra ${base.dat} bas`
          : `${altgr} tuşunu (boşluk çubuğunun sağında)${bas} basılı tut ve ${base.dat} bas`;
      } else {
        how = `${altgr} tuşunu (boşluk çubuğunun sağında) basılı tut ve ${base.dat} bas`;
      }
    } else if (acc.mod === "shift") {
      how = `${shiftSeite(shiftHandFor(ch, lernweg))}Shift tuşunu basılı tut ve ${base.dat} bas`;
    } else {
      how = base.nom;
    }
    return `${label}: ${finger}, ${how}.`;
  }

  const onHome = kleinFuer(ch, lernweg) === heimtaste;
  const where = onHome ? ", temel konumda" : home ? `, ${home}` : "";
  const shift = shiftHandFor(ch, lernweg);
  const shiftTxt = shift ? `, ayrıca ${shiftSeite(shift)}Shift tuşu` : "";
  return `${label}: ${finger}${where}${shiftTxt}.`;
}

/**
 * ★ O-CS (03.10.2026): wie eine Taste im tschechischen Satz heisst - IMMER nach dem Kopfwort „klávesa" (Glossar
 * Regel 11), damit der Name nie gebeugt wird („stiskni klávesu D", „z klávesy F"). Die lateinischen Buchstaben gross
 * wie auf der Kappe, Ziffern als Ziffer, alles andere beim gesprochenen Namen: die Buchstaben der číselná řada
 * „e s háčkem" (ein Kind muss e, é und ě unterscheiden), Zeichen „rovná se", „čárka nad písmenem".
 */
export function kappeCs(key: string): string {
  if (/^[a-zA-Z]$/.test(key)) return key.toUpperCase();
  // ★★★ G3b (25.10.2026): ein kyrillischer oder griechischer Buchstabe gross wie auf der Kappe - aber nur, wenn die Grossform
  // zu DIESER Taste gehört (ς ⇒ Σ wäre die Taste σ); sonst die Taste, wie sie ist. Lateinische Tasten: unverändert oben.
  // ★ G4-NAHT (25.10.2026): über `kappeFuer` in der Sprache der Tastatur (EINE Regel mit den Lektionstexten der neun Wege;
  // `kappeFuer` fragt die Eigenschaft `kappenAlleGross`). Lateinische Buchstaben mit Zeichen (ő, ș, å …) behalten hier ihren
  // gesprochenen Namen (Glossar cs Regel 11: ein Kind muss e, é und ě unterscheiden) - darum nur nicht-lateinische Schrift.
  if (/^[\p{Script=Cyrillic}\p{Script=Greek}]$/u.test(key)) return kappeFuer(key, layoutSprache(), activeLayout().kleineKappen);
  if (/^[0-9]$/.test(key)) return key;
  return spokenLabel(key, "cs");
}

/** ★ O-CS: die Taste rechts neben der Leertaste - unter Windows „AltGr" (Glossar §2.9), am Mac „Option". */
function altGrKappeCs(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : "AltGr";
}

/**
 * ★ O-CS (03.10.2026): {@link keyPlaceHint} auf Tschechisch - „úplně vlevo na číselné řadě", „vpravo od klávesy
 * rovná se". Die Reihe im Lokativ (Glossar §2.1: číselná, horní, základní, dolní řada), der Nachbar nach „od klávesy"
 * - sein Name bleibt ungebeugt.
 */
export function keyPlaceHintCs(key: string): string {
  const rady = ["na číselné řadě", "na horní řadě", "na základní řadě", "na dolní řadě"];
  const rows = activeLayout().rows;
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r].keys.indexOf(key);
    if (i < 0) continue;
    if (i === 0) return `úplně vlevo ${rady[r]}`;
    return `vpravo od klávesy ${kappeCs(rows[r].keys[i - 1])}`;
  }
  return rady[0];
}

/**
 * ★ O-CS (03.10.2026): die Finger-Ansage auf TSCHECHISCH - derselbe Aufbau wie {@link fingerGuidePl}, neu
 * formuliert. Glossar §2.1/§2.9: Shift, Caps Lock, Enter, mezerník, AltGr (Mac: Option), mrtvá klávesa, základní
 * postavení; Finger aus {@link FINGER_CS}. Ty-Befehlsform („podrž", „stiskni"), kein Geschlecht; Finger und Tasten
 * nach dem Doppelpunkt im Nominativ, jede Taste mit „klávesa" davor.
 *
 * ★★★ Glossar §4 Falle 1: auf der tschechischen Tastatur gibt Shift auf der číselná řada die ZIFFER, nie den
 * Grossbuchstaben. Darum zuerst der Weg über die Totaste (wie {@link fingerGuide} K2): „velké c s háčkem: nejdřív
 * mrtvá klávesa háček (...), potom klávesa C, ..., k tomu pravá klávesa Shift." - nie „Shift + č". Die Ziffern kommen
 * über `access` („2: ..., podrž pravou klávesu Shift a stiskni klávesu e s háčkem.").
 */
export function fingerGuideCs(ch: string, oneHand: boolean, lernweg: Lernweg): string {
  if (!ch) return "";
  if (ch === " ") return "Mezerník: palec.";
  if (ch === "\n") return "Enter: pravý malíček.";
  // „levá klávesa Shift" (nach „k tomu") und „levou klávesu Shift" (nach „podrž") - bei „Psaní jednou rukou" ohne Seite.
  const shiftNom = (side: Hand | null) =>
    oneHand ? "klávesa Shift" : `${side === "links" ? "levá" : "pravá"} klávesa Shift`;
  const shiftAkk = (side: Hand | null) =>
    oneHand ? "klávesu Shift" : `${side === "links" ? "levou" : "pravou"} klávesu Shift`;

  const kombi = kombizeichenZu(ch, activeLayout());
  if (kombi) {
    const fTot = fingerForChar(kombi.tot, lernweg);
    const mod = activeLayout().access[kombi.tot]?.mod;
    const zusatz =
      mod === "altgr" ? `, s klávesou ${altGrKappeCs()}` : mod === "shift" ? ", s klávesou Shift" : "";
    const fDann = fingerForChar(kombi.dann, lernweg);
    const seite = shiftHandFor(ch, lernweg);
    const shiftTxt = seite ? `, k tomu ${shiftNom(seite)}` : "";
    return (
      `${spokenLabel(ch, "cs")}: nejdřív mrtvá klávesa ${spokenLabel(kombi.tot, "cs")} ` +
      `(${fTot ? fingerName(fTot, "cs") : ""}${zusatz}), ` +
      `potom klávesa ${kappeCs(kombi.dann)}${fDann ? `, ${fingerName(fDann, "cs")}` : ""}${shiftTxt}.`
    );
  }

  const f = fingerForChar(ch, lernweg);
  const label = spokenLabel(ch, "cs");
  if (!f) return label;
  const heimtaste = homeKeyFor(f, lernweg);
  const finger = fingerName(f, "cs");
  const home = heimtaste === " " ? "" : `z klávesy ${kappeCs(heimtaste)}`;

  if (needsCapsLock(ch)) {
    return `${label}: ${finger}${home ? `, ${home}` : ""}, k tomu klávesa Caps Lock.`;
  }

  const acc = charAccess(ch);
  if (acc) {
    const base = acc.base === " " ? "mezerník" : `klávesu ${kappeCs(acc.base)}`;
    let how: string;
    if (acc.dead) {
      // Eine Totaste mit Shift oder AltGr sagt den Zusatz („stupeň": Shift + die Taste links von „+").
      const mit =
        acc.mod === "shift" ? " s klávesou Shift" : acc.mod === "altgr" ? ` s klávesou ${altGrKappeCs()}` : "";
      how = `mrtvá klávesa ${keyPlaceHintCs(acc.base)}${mit}, potom mezerník`;
    } else if (acc.mod === "altgr") {
      const altgr = altGrKappeCs();
      if (acc.buchstabe) {
        const palec = oneHand ? "" : " pravým palcem";
        how = acc.mitUmschalt
          ? `podrž klávesu ${altgr}${palec} a k tomu ${shiftAkk(shiftHandFor(ch, lernweg))}, potom stiskni ${base}`
          : `podrž klávesu ${altgr} (vpravo od mezerníku)${palec} a stiskni ${base}`;
      } else {
        how = `podrž klávesu ${altgr} (vpravo od mezerníku) a stiskni ${base}`;
      }
    } else if (acc.mod === "shift") {
      how = `podrž ${shiftAkk(shiftHandFor(ch, lernweg))} a stiskni ${base}`;
    } else {
      how = acc.base === " " ? "mezerník" : `klávesa ${kappeCs(acc.base)}`;
    }
    return `${label}: ${finger}, ${how}.`;
  }

  const onHome = kleinFuer(ch, lernweg) === heimtaste;
  const where = onHome ? ", v základním postavení" : home ? `, ${home}` : "";
  const shift = shiftHandFor(ch, lernweg);
  const shiftTxt = shift ? `, k tomu ${shiftNom(shift)}` : "";
  return `${label}: ${finger}${where}${shiftTxt}.`;
}

/**
 * ★ O2-TASTATUR (30.10.2026): die Taste im Satz einer der neun Sprachen - lateinische und kyrillische/griechische Buchstaben wie
 * auf der Kappe, Ziffern als Ziffer, alles andere beim gesprochenen Namen (auch ő, ș, å: ein Kind muss o, ó und ő unterscheiden).
 */
function kappeNeun(key: string, sprache: GeruestSprache): string {
  if (/^[a-zA-Z]$/.test(key)) return key.toUpperCase();
  if (/^[\p{Script=Cyrillic}\p{Script=Greek}]$/u.test(key) && /^\p{L}$/u.test(key)) {
    return kappeFuer(key, layoutSprache(), activeLayout().kleineKappen);
  }
  if (/^[0-9]$/.test(key)) return key;
  return spokenLabel(key, sprache);
}

/**
 * ★ O2-TASTATUR (30.10.2026): die Finger-Ansage der neun Sprachen - derselbe Aufbau wie {@link fingerGuideCs}, die Satzteile je
 * Sprache in `fingerNamenNeun.ts`. Bis hierher sagte die Stimme auf diesen Wegen Englisch („f: left index finger, home position").
 */
export function fingerGuideNeun(sprache: GeruestSprache, ch: string, oneHand: boolean, lernweg: Lernweg): string {
  if (!ch) return "";
  const t = FINGER_ANSAGE_TEILE[sprache];
  const daumen = fingerName(FINGERS.daumen, sprache);
  if (ch === " ") return `${t.leer}: ${daumen}.`;
  if (ch === "\n") return `Enter: ${fingerName(FINGERS["kleiner-rechts"], sprache)}.`;
  const altGrKappe = () => (bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : t.altGr);
  const seiteVon = (s: Hand | null) => (oneHand ? null : s);

  const kombi = kombizeichenZu(ch, activeLayout());
  if (kombi) {
    const fTot = fingerForChar(kombi.tot, lernweg);
    const mod = activeLayout().access[kombi.tot]?.mod;
    const zusatz = mod === "altgr" ? `, ${t.zusatz(altGrKappe())}` : mod === "shift" ? `, ${t.zusatz(t.shift)}` : "";
    const fDann = fingerForChar(kombi.dann, lernweg);
    const seite = shiftHandFor(ch, lernweg);
    const shiftTxt = seite ? `, ${t.mitShift(seiteVon(seite))}` : "";
    return (
      `${spokenLabel(ch, sprache)}: ${t.zuerstTot(spokenLabel(kombi.tot, sprache))} ` +
      `(${fTot ? fingerName(fTot, sprache) : ""}${zusatz}), ` +
      `${t.dann(kappeNeun(kombi.dann, sprache))}${fDann ? `, ${fingerName(fDann, sprache)}` : ""}${shiftTxt}.`
    );
  }

  const f = fingerForChar(ch, lernweg);
  const label = spokenLabel(ch, sprache);
  if (!f) return label;
  const heimtaste = homeKeyFor(f, lernweg);
  const finger = fingerName(f, sprache);
  const home = heimtaste === " " ? "" : t.von(kappeNeun(heimtaste, sprache));

  if (needsCapsLock(ch)) return `${label}: ${finger}${home ? `, ${home}` : ""}, ${t.mitCaps}.`;

  const acc = charAccess(ch);
  if (acc) {
    const base = acc.base === " " ? t.leerObjekt : t.taste(kappeNeun(acc.base, sprache));
    let wie: string;
    if (acc.dead) {
      const mit = acc.mod === "shift" ? ` ${t.zusatz(t.shift)}` : acc.mod === "altgr" ? ` ${t.zusatz(altGrKappe())}` : "";
      wie = `${t.tot(kappeNeun(acc.base, sprache))}${mit}, ${t.dannLeer}`;
    } else if (acc.mod === "altgr") {
      const altgr = t.taste(altGrKappe());
      wie = acc.buchstabe && acc.mitUmschalt
        ? t.halteZwei(altgr, t.shiftObjekt(seiteVon(shiftHandFor(ch, lernweg))), base)
        : t.halte(altgr, base);
    } else if (acc.mod === "shift") {
      wie = t.halte(t.shiftObjekt(seiteVon(shiftHandFor(ch, lernweg))), base);
    } else {
      wie = base;
    }
    return `${label}: ${finger}, ${wie}.`;
  }

  const aufHeim = kleinFuer(ch, lernweg) === heimtaste;
  const wo = aufHeim ? `, ${t.grundstellung}` : home ? `, ${home}` : "";
  const shift = shiftHandFor(ch, lernweg);
  const shiftTxt = shift ? `, ${t.mitShift(seiteVon(shift))}` : "";
  return `${label}: ${finger}${wo}${shiftTxt}.`;
}

/**
 * ★ E11a-5: die Finger-Ansage je Bedienungssprache - eine Tabelle statt der
 * Weiche `englischeBedienung ? fingerGuideEn : fingerGuide` in der
 * Übungsseite.
 *
 * ★★★ ES-F8 (27.09.2026): „es" bekommt jetzt {@link fingerGuideEs} - vorher
 * (ES-F2) stand hier der englische Rückfall.
 */
export const FINGER_ANSAGE_JE_SPRACHE: Record<
  Lang,
  (ch: string, oneHand: boolean, lernweg: Lernweg) => string
> = {
  de: fingerGuide,
  en: fingerGuideEn,
  fr: fingerGuideFr,
  es: fingerGuideEs,
  it: fingerGuideIt,
  pl: fingerGuidePl, // ★ O-PL (02.10.2026)
  tr: fingerGuideTr, // ★ O-TR (02.10.2026)
  cs: fingerGuideCs, // ★ O-CS (03.10.2026)
  // ★ O2-TASTATUR (30.10.2026): die neun Sprachen haben eigene Satzteile (`FINGER_ANSAGE_TEILE`).
  bg: (ch, oneHand, lernweg) => fingerGuideNeun("bg", ch, oneHand, lernweg),
  el: (ch, oneHand, lernweg) => fingerGuideNeun("el", ch, oneHand, lernweg),
  hu: (ch, oneHand, lernweg) => fingerGuideNeun("hu", ch, oneHand, lernweg),
  nl: (ch, oneHand, lernweg) => fingerGuideNeun("nl", ch, oneHand, lernweg),
  pt: (ch, oneHand, lernweg) => fingerGuideNeun("pt", ch, oneHand, lernweg),
  br: (ch, oneHand, lernweg) => fingerGuideNeun("br", ch, oneHand, lernweg),
  ro: (ch, oneHand, lernweg) => fingerGuideNeun("ro", ch, oneHand, lernweg),
  sv: (ch, oneHand, lernweg) => fingerGuideNeun("sv", ch, oneHand, lernweg),
  uk: (ch, oneHand, lernweg) => fingerGuideNeun("uk", ch, oneHand, lernweg),
};

/**
 * Der Fingername auf ENGLISCH - nur für die Sprachausgabe. Die SICHTBARE
 * Oberfläche bleibt deutsch (`FINGERS[..].name`); wer englische Texte tippt,
 * bedient trotzdem ein deutsches Programm.
 */
const FINGER_EN: Record<FingerId, string> = {
  "kleiner-links": "left little finger",
  "ring-links": "left ring finger",
  "mittel-links": "left middle finger",
  "zeige-links": "left index finger",
  daumen: "thumb",
  "zeige-rechts": "right index finger",
  "mittel-rechts": "right middle finger",
  "ring-rechts": "right ring finger",
  "kleiner-rechts": "right little finger",
};

/**
 * ★ E10a (25.09.2026, Bauplan §8.3): dieselben Fingernamen auf FRANZÖSISCH -
 * *index gauche, majeur droit, annulaire, auriculaire, pouce* (Auftrag E10a
 * Punkt 6). Nur für die Sprachausgabe, wie {@link FINGER_EN}.
 */
const FINGER_FR: Record<FingerId, string> = {
  "kleiner-links": "auriculaire gauche",
  "ring-links": "annulaire gauche",
  "mittel-links": "majeur gauche",
  "zeige-links": "index gauche",
  daumen: "pouce",
  "zeige-rechts": "index droit",
  "mittel-rechts": "majeur droit",
  "ring-rechts": "annulaire droit",
  "kleiner-rechts": "auriculaire droit",
};

/**
 * ★★★ ES-F8 (27.09.2026, Bauplan §7 Glossar): dieselben Fingernamen auf
 * SPANISCH - *índice, medio, anular, meñique, pulgar*, mit *izquierdo/
 * izquierda* bzw. *derecho/derecha* (der Daumen ist neutral, wie überall).
 * Nur für die Sprachausgabe, wie {@link FINGER_EN}/{@link FINGER_FR}.
 */
const FINGER_ES: Record<FingerId, string> = {
  "kleiner-links": "meñique izquierdo",
  "ring-links": "anular izquierdo",
  "mittel-links": "medio izquierdo",
  "zeige-links": "índice izquierdo",
  daumen: "pulgar",
  "zeige-rechts": "índice derecho",
  "mittel-rechts": "medio derecho",
  "ring-rechts": "anular derecho",
  "kleiner-rechts": "meñique derecho",
};

/** ★ O-IT (02.10.2026): die Fingernamen italienisch (Glossar §2.1, `FINGER_IT`). */
const FINGER_IT: Record<FingerId, string> = {
  "kleiner-links": "mignolo sinistro",
  "ring-links": "anulare sinistro",
  "mittel-links": "medio sinistro",
  "zeige-links": "indice sinistro",
  daumen: "pollice",
  "zeige-rechts": "indice destro",
  "mittel-rechts": "medio destro",
  "ring-rechts": "anulare destro",
  "kleiner-rechts": "mignolo destro",
};

/**
 * ★ O-PL (02.10.2026): die Fingernamen polnisch - Glossar §2.1, die kurze Form
 * „lewy wskazujący" (bezwzrokowo.pl „lewy mały", „prawy wskazujący"); der
 * Daumen ist „kciuk". Nur für die Sprachausgabe, wie {@link FINGER_EN}.
 */
const FINGER_PL: Record<FingerId, string> = {
  "kleiner-links": "lewy mały",
  "ring-links": "lewy serdeczny",
  "mittel-links": "lewy środkowy",
  "zeige-links": "lewy wskazujący",
  daumen: "kciuk",
  "zeige-rechts": "prawy wskazujący",
  "mittel-rechts": "prawy środkowy",
  "ring-rechts": "prawy serdeczny",
  "kleiner-rechts": "prawy mały",
};

/**
 * ★ O-TR (02.10.2026): die Fingernamen türkisch - Glossar §2.1 (MEGEP):
 * „serçe parmak" (nie „küçük parmak"), „yüzük parmağı", „orta parmak",
 * „işaret parmağı", „başparmak"; die Seite vorn („sol işaret parmağı"). Nur
 * für die Sprachausgabe, wie {@link FINGER_EN}.
 */
const FINGER_TR: Record<FingerId, string> = {
  "kleiner-links": "sol serçe parmak",
  "ring-links": "sol yüzük parmağı",
  "mittel-links": "sol orta parmak",
  "zeige-links": "sol işaret parmağı",
  daumen: "başparmak",
  "zeige-rechts": "sağ işaret parmağı",
  "mittel-rechts": "sağ orta parmak",
  "ring-rechts": "sağ yüzük parmağı",
  "kleiner-rechts": "sağ serçe parmak",
};

/**
 * ★ O-CS (03.10.2026): die Fingernamen tschechisch - Glossar §2.1: die Verkleinerung, wie Kinder sie kennen
 * („malíček", „prsteníček", „prostředníček", „ukazováček", „palec"; nie das derbe „malík"/„ukazovák"), die Seite
 * vorn („levý ukazováček"). Nur für die Sprachausgabe, wie {@link FINGER_EN}.
 */
const FINGER_CS: Record<FingerId, string> = {
  "kleiner-links": "levý malíček",
  "ring-links": "levý prsteníček",
  "mittel-links": "levý prostředníček",
  "zeige-links": "levý ukazováček",
  daumen: "palec",
  "zeige-rechts": "pravý ukazováček",
  "mittel-rechts": "pravý prostředníček",
  "ring-rechts": "pravý prsteníček",
  "kleiner-rechts": "pravý malíček",
};

/**
 * ★ E10a (25.09.2026, Bauplan §8.1 Punkt 3): eine WEG-TABELLE statt der
 * bisherigen verschachtelten Bedingung - Deutsch braucht keine eigene Tabelle
 * (`null`: es gilt der sichtbare Name aus {@link FINGERS} selbst), Englisch
 * und Französisch je eine. Entfernt zugleich eine der gezählten Weichen
 * (`tests/tastenflow-sprach-weichen.test.ts`), statt eine neue anzulegen.
 *
 * ★★★ ES-F8: „es" bekommt jetzt {@link FINGER_ES} statt des englischen
 * Rückfalls aus ES-F2.
 */
const FINGER_NAME_JE_SPRACHE: Record<Lang, Record<FingerId, string> | null> = {
  de: null,
  en: FINGER_EN,
  fr: FINGER_FR,
  es: FINGER_ES,
  it: FINGER_IT,
  pl: FINGER_PL, // ★ O-PL (02.10.2026)
  tr: FINGER_TR, // ★ O-TR (02.10.2026)
  cs: FINGER_CS, // ★ O-CS (03.10.2026)
  // ★ O2-TASTATUR (30.10.2026): die neun Sprachen aus `fingerNamenNeun.ts` (dieselben Namen wie in `freischaltung<Xx>.ts`).
  bg: FINGER_NEUN.bg as Record<FingerId, string>,
  el: FINGER_NEUN.el as Record<FingerId, string>,
  hu: FINGER_NEUN.hu as Record<FingerId, string>,
  nl: FINGER_NEUN.nl as Record<FingerId, string>,
  pt: FINGER_NEUN.pt as Record<FingerId, string>,
  br: FINGER_NEUN.br as Record<FingerId, string>,
  ro: FINGER_NEUN.ro as Record<FingerId, string>,
  sv: FINGER_NEUN.sv as Record<FingerId, string>,
  uk: FINGER_NEUN.uk as Record<FingerId, string>,
};

/** Der Name eines Fingers in der Vorlese-Sprache. */
export function fingerName(f: FingerInfo, lang: Lang = "de"): string {
  return FINGER_NAME_JE_SPRACHE[lang]?.[f.id] ?? f.name;
}

/**
 * ★★★ G3b (25.10.2026, Falle 24): die Namen der Zeichen, die erst mit den Tastaturen der neun neuen Sprachen auf eine Taste
 * kamen (№ ₴ „ “ ” ‘ ’ ΄ ΅ ± ¦ ― ...) - in den vier Sprachen mit eigener Namenstabelle (Deutsch `charLabel`, Englisch, Französisch,
 * Spanisch). Ohne sie sagte die Stimme das nackte Zeichen (Wächter: `tastenflow-tastaturen-<sprache>`, „jedes Zeichen hat einen
 * Namen"). Die Tabellen unten setzen ihre eigenen Einträge DANACH - kein bestehender Name ändert sich.
 * Halb- und Geviertstrich als Zeichencode (Strich-Wächter: das Zeichen ist hier die Sache selbst, kein vorgelesener Text).
 */
const ZEICHEN_G3B: Readonly<Record<"de" | "en" | "fr" | "es", Readonly<Record<string, string>>>> = {
  de: {
    "№": "Nummernzeichen", "„": "Anführungszeichen unten", "“": "Anführungszeichen oben", "”": "schließendes Anführungszeichen",
    "‘": "einfaches Anführungszeichen oben", "’": "Apostroph rechts", [String.fromCharCode(0x2013)]: "Gedankenstrich",
    "΄": "Tonos", "΅": "Dialytika mit Tonos", "±": "Plusminus", "²": "hoch zwei", "³": "hoch drei", "¦": "unterbrochener Strich",
    "―": "waagrechter Strich", "©": "Copyright-Zeichen", "¬": "Negationszeichen", "¤": "Währungszeichen",
    "º": "Ordinalzeichen o", "ª": "Ordinalzeichen a", "₴": "Hrywnja-Zeichen", "µ": "Mikro", [GRIECHISCHES_FRAGEZEICHEN]: "griechisches Fragezeichen",
  },
  en: {
    "№": "numero sign", "„": "low double quotation mark", "“": "left double quotation mark", "”": "right double quotation mark",
    "‘": "left single quotation mark", "’": "right single quotation mark", [String.fromCharCode(0x2013)]: "en dash",
    "΄": "tonos", "΅": "dialytika tonos", "±": "plus-minus sign", "²": "superscript two", "³": "superscript three",
    "¦": "broken bar", "―": "horizontal bar", "©": "copyright sign", "¬": "not sign", "¤": "currency sign",
    "º": "masculine ordinal indicator", "ª": "feminine ordinal indicator", "₴": "hryvnia sign", "µ": "micro sign", [GRIECHISCHES_FRAGEZEICHEN]: "Greek question mark",
  },
  fr: {
    "№": "signe numéro", "„": "guillemet bas", "“": "guillemet anglais ouvrant", "”": "guillemet anglais fermant",
    "‘": "apostrophe ouvrante", "’": "apostrophe typographique", [String.fromCharCode(0x2013)]: "tiret demi-cadratin",
    "΄": "tonos", "΅": "dialytika tonos", "±": "plus ou moins", "³": "exposant trois", "¦": "barre interrompue",
    "―": "barre horizontale", "©": "copyright", "¬": "signe de négation", "¤": "symbole monétaire",
    "º": "indicateur ordinal masculin", "ª": "indicateur ordinal féminin", "₴": "symbole de la hryvnia", [GRIECHISCHES_FRAGEZEICHEN]: "point d'interrogation grec",
  },
  es: {
    "№": "signo de número", "„": "comillas bajas", "“": "comillas altas de apertura", "”": "comillas altas de cierre",
    "‘": "comilla simple de apertura", "’": "comilla simple de cierre", [String.fromCharCode(0x2013)]: "raya corta",
    "΄": "tonos", "΅": "dialytika tonos", "±": "más menos", "³": "elevado al cubo", "¦": "barra partida",
    "―": "barra horizontal", "©": "signo de copyright", "¤": "signo monetario", "₴": "signo de la grivna", [GRIECHISCHES_FRAGEZEICHEN]: "signo de interrogación griego",
  },
};

/** Lesbarer Name eines Zeichens für Sprachausgabe/Hinweise. */
export function charLabel(ch: string): string {
  if (ch === " ") return "Leertaste";
  if (ch === "\n") return "Eingabetaste";
  const map: Record<string, string> = {
    ...ZEICHEN_G3B.de, // ★★★ G3b (25.10.2026)
    ".": "Punkt", ",": "Komma", "-": "Bindestrich", "?": "Fragezeichen",
    "!": "Ausrufezeichen", ":": "Doppelpunkt", ";": "Strichpunkt", "ß": "scharfes s",
    "[": "eckige Klammer auf", "]": "eckige Klammer zu",
    "{": "geschweifte Klammer auf", "}": "geschweifte Klammer zu",
    "|": "senkrechter Strich", "^": "Dach", "~": "Tilde", "°": "Grad",
    // Tasten, die es nur auf der Schweizer bzw. den englischen Tastaturen gibt
    "´": "Akzent", "¨": "Trema", "§": "Paragraf", $: "Dollar", "£": "Pfund",
    "`": "Gravis", "\\": "umgekehrter Schrägstrich", "/": "Schrägstrich",
    "=": "Gleich", "'": "Apostroph", "+": "Plus", "*": "Stern", "@": "At-Zeichen",
    /*
     * ★ Ergänzt 20.09.2026 (Testerin Durchgang, Punkt 3): Johannes fragte fürs
     * Höhlenwesen „kann das Höhlenwesen alles sagen?" - gemessen fehlten genau
     * diese neun `SYMBOL_ORDER`-Zeichen hier UND im Stimmen-Renderer
     * (scripts/expedition-voices.mjs). Ohne einen Namen hier hätte selbst der
     * TTS-Notweg (falls das Monster-Sample fehlt) nur das nackte Zeichen
     * gesagt, nicht sein Wort - halte diese Liste mit dem Skript deckungsgleich.
     */
    "(": "runde Klammer auf", ")": "runde Klammer zu", "\"": "Anführungszeichen",
    "%": "Prozent", "&": "Und-Zeichen", "€": "Euro", "#": "Raute",
    "<": "kleiner als", ">": "größer als",
    // ★ 28.09.2026: „Tasten finden - Alle Tasten" fragt jetzt jedes Zeichen der
    // Tastatur; diese liegen auf Kanada (« ») und Spanien (¡ ¿ ·) - ohne Namen
    // sagte die Stimme das nackte Zeichen.
    "«": "spitzes Anführungszeichen auf", "»": "spitzes Anführungszeichen zu",
    "¡": "umgekehrtes Ausrufezeichen", "¿": "umgekehrtes Fragezeichen", "·": "Mittelpunkt",
    // ★ K3 (28.09.2026): „_" ist eine Einheit auf Weg fr und es - ohne Namen
    // hiess die Feier in deutscher Bedienung „das Sonderzeichen _".
    "_": "Unterstrich",
    // ★ F3-tr (02.10.2026): `₺` (AltGr + T) und `½` (AltGr + 5) liegen auf der türkischen Q-Tastatur - ohne Namen
    // sagte die Stimme das nackte Zeichen, „Tasten finden - Alle Tasten" fragte „Finde ₺."
    "₺": "Lira-Zeichen", "½": "ein halb",
    // ★ F3-cs (02.10.2026): die Háček-Totaste der tschechischen Tastatur (Umschalt + letzte Taste der Zahlenreihe) -
    // ohne Namen sagte die Ansage „ˇ, dann d". Gleicher Name wie `totasteName("ˇ", "de")` (`totastenTexte.ts`).
    "ˇ": "Hatschek",
  };
  if (map[ch]) return map[ch];
  if (ch >= "0" && ch <= "9") return ch;
  const sp = rechenSprache(); // G2b-1: Erkennung eines Großbuchstabens in der Sprache der Tastatur
  if (ch !== kleinFuer(ch, sp) && ch === grossFuer(ch, sp)) return "großes " + ch;
  return ch;
}

/**
 * Name eines Zeichens speziell für die SPRACHAUSGABE (Vorlesen) — eindeutiger
 * als {@link charLabel}, das für SICHTBARE Hinweise gedacht ist und deshalb
 * unverändert bleibt. Hintergrund: der nackte deutsche Buchstabenname „ä" klingt
 * fast wie „e", „ö"/„ü" ähneln sich ebenso — selbst eine gute Stimme bleibt da
 * mehrdeutig. Kinder mit Sehbehinderung, die sich allein auf die Stimme
 * verlassen, hören die Umlaute deshalb als „a Umlaut" usw. ausgeschrieben.
 * Alles andere wird wie bei {@link charLabel} benannt.
 */
const SPOKEN_OVERRIDES: Record<string, string> = {
  ä: "a Umlaut",
  ö: "o Umlaut",
  ü: "u Umlaut",
  Ä: "großes a Umlaut",
  Ö: "großes o Umlaut",
  Ü: "großes u Umlaut",
};

/**
 * Dieselben Namen auf ENGLISCH - für Kinder, die englische Texte mit einer
 * englischen Stimme üben.
 *
 * ★ Anlass (Jens, 29.08.2026): „Wörter werden englisch vorgelesen, aber
 * Leertaste und Satzzeichen haben ihre deutschen Bezeichnungen, die dann mit
 * falscher Aussprache vorgelesen werden (z. B. Pankt für Punkt). Hier müsste
 * das System ja eigentlich full stop oder period sagen." Gemessen lösten
 * **21,7 % aller Anschläge einer englischen Zeile** einen deutschen Namen aus -
 * mit Abstand am häufigsten die Leertaste nach jedem Wort.
 *
 * Gewählt ist durchgehend britisches Englisch (`en-GB`, siehe `SPRACH_TAG`):
 * „full stop", nicht „period" - der englische Korpus schreibt „harbour" und
 * rechnet in Pfund. Die Tabelle spiegelt {@link charLabel} Eintrag für Eintrag
 * und nennt dazu die Zeichen der Wege fr/es (`_ « » ¿ ¡`), die ein Kind mit
 * Übungssprache Englisch tippt. Wächter: `tastenflow-s3-englische-namen`.
 */
const SPOKEN_EN: Record<string, string> = {
  ...ZEICHEN_G3B.en, // ★★★ G3b (25.10.2026)
  " ": "space",
  "\n": "enter",
  ".": "full stop", ",": "comma", "-": "hyphen", "?": "question mark",
  "!": "exclamation mark", ":": "colon", ";": "semicolon", "ß": "sharp s",
  "[": "open square bracket", "]": "close square bracket",
  "{": "open curly bracket", "}": "close curly bracket",
  "|": "vertical bar", "^": "caret", "~": "tilde", "°": "degrees",
  "´": "acute accent", "¨": "diaeresis", "§": "section sign",
  $: "dollar", "£": "pound",
  // ★ F3-tr (02.10.2026): die Zeichen der türkischen Q-Tastatur (AltGr + T, AltGr + 5).
  "₺": "lira sign", "½": "one half",
  // ★ F3-cs (02.10.2026): die Háček-Totaste der tschechischen Tastatur.
  "ˇ": "caron",
  "`": "grave accent", "\\": "backslash", "/": "slash",
  "=": "equals", "'": "apostrophe", "+": "plus", "*": "asterisk", "@": "at sign",
  // ★ S3 (28.09.2026, Schlussprüfung Nachtlauf): diese Zeichen hatten keinen
  // englischen Namen - die Stimme las das nackte Zeichen (Zufall je Stimme).
  // `" ( ) % & # < >` sind Einheiten des Weges en, `€` die letzte Sprosse auf
  // UK, und seit D1 Nr. 18 üben auch Kinder auf fr/es mit Übungssprache
  // Englisch `_ « » ¿ ¡`. Dieselben Wörter wie `unitLabelEn` (letters.ts) und
  // die englische Tasten-Erklärung (`tastenErklaerungEn.ts`), britisch
  // („per cent", „hash", „bracket" für die runde Klammer).
  "(": "open bracket", ")": "close bracket", "\"": "quotation mark",
  "%": "per cent", "&": "ampersand", "#": "hash", "€": "euro",
  "<": "less than", ">": "greater than", "_": "underscore",
  "«": "open guillemet", "»": "close guillemet",
  "¿": "inverted question mark", "¡": "inverted exclamation mark", "·": "middle dot",
  // Umlaute klingen auch für eine englische Stimme mehrdeutig - ausgeschrieben.
  ä: "a umlaut", ö: "o umlaut", ü: "u umlaut",
};

/** Der englische Name eines Zeichens für die Sprachausgabe. */
function spokenLabelEn(ch: string, sprache: Lang = "en"): string {
  const treffer = SPOKEN_EN[ch];
  if (treffer) return treffer;
  if (ch >= "0" && ch <= "9") return ch;
  if (ch !== kleinFuer(ch, sprache) && ch === grossFuer(ch, sprache)) {
    const klein = SPOKEN_EN[kleinFuer(ch, sprache)];
    return "capital " + (klein ?? ch);
  }
  return ch;
}

/**
 * ★ E12 (26.09.2026, Bauplan §11.2 Punkt 3, Auftrag Punkt 2): dieselben Namen
 * auf FRANZÖSISCH - und zwar so, dass ein Kind `e é è ê ë` AM OHR
 * auseinanderhalten kann. Ohne diese Tabelle wäre `spokenLabel(ch, "fr")` für
 * jedes hier nicht gelistete Zeichen still auf die DEUTSCHEN Namen
 * zurückgefallen (`SPOKEN_OVERRIDES`/`charLabel`) - genau die Falle, vor der
 * der Bauplan warnt (§15 Falle 1: „für fr nicht rot, sondern still Deutsch").
 *
 * Jeder Akzent-Buchstabe wird ausgeschrieben (Grundbuchstabe + Akzent-Name),
 * nicht nur das blosse Zeichen genannt - dieselbe Regel wie bei den deutschen
 * Umlauten (`SPOKEN_OVERRIDES`) und aus demselben Grund: „é" klingt gesprochen
 * fast wie „e", „è" und „ê" sind sich noch ähnlicher.
 */
const SPOKEN_FR: Record<string, string> = {
  ...ZEICHEN_G3B.fr, // ★★★ G3b (25.10.2026)
  " ": "espace",
  "\n": "entrée",
  ".": "point", ",": "virgule", "-": "tiret", "?": "point d'interrogation",
  "!": "point d'exclamation", ":": "deux-points", ";": "point-virgule",
  "[": "crochet ouvrant", "]": "crochet fermant",
  "{": "accolade ouvrante", "}": "accolade fermante",
  "|": "barre verticale", "^": "accent circonflexe", "~": "tilde", "°": "degré",
  "´": "accent aigu", "¨": "tréma", "§": "paragraphe",
  $: "dollar", "£": "livre",
  // ★ F3-tr (02.10.2026): die Zeichen der türkischen Q-Tastatur (AltGr + T, AltGr + 5).
  "₺": "symbole de la lire turque", "½": "un demi",
  // ★ F3-cs (02.10.2026): die Háček-Totaste der tschechischen Tastatur.
  "ˇ": "caron",
  "`": "accent grave", "\\": "barre oblique inversée", "/": "barre oblique",
  "=": "égal", "'": "apostrophe", "+": "plus", "*": "astérisque", "@": "arobase",
  "«": "guillemet ouvrant", "»": "guillemet fermant",
  // ★ Chat-Abnahme E12 (26.09.): ohne Namen liest die Stimme das nackte Zeichen - Zufall.
  "\"": "guillemets", "(": "parenthèse ouvrante", ")": "parenthèse fermante",
  "#": "dièse", "&": "esperluette", "%": "pour cent", "_": "tiret bas",
  "<": "plus petit que", ">": "plus grand que", "€": "euro", "µ": "micro",
  "²": "exposant deux",
  // ★ 28.09.2026: Zeichen der spanischen Tastatur („Tasten finden - Alle Tasten").
  "¡": "point d'exclamation inversé", "¿": "point d'interrogation inversé", "·": "point médian",
  // ★★★★ die Zeichennamen, die ein Kind unterscheiden muss (Bauplan §11.2.3):
  é: "e accent aigu",
  è: "e accent grave",
  ê: "e accent circonflexe",
  ë: "e tréma",
  à: "a accent grave",
  â: "a accent circonflexe",
  î: "i accent circonflexe",
  ï: "i tréma",
  ô: "o accent circonflexe",
  ù: "u accent grave",
  û: "u accent circonflexe",
  ü: "u tréma",
  ÿ: "y tréma",
  ç: "c cédille",
  œ: "e dans l'o", // so heisst es im Französischen (Chat-Abnahme E12)
};

/** Der französische Name eines Zeichens für die Sprachausgabe. */
function spokenLabelFr(ch: string, sprache: Lang = "fr"): string {
  const treffer = SPOKEN_FR[ch];
  if (treffer) return treffer;
  if (ch >= "0" && ch <= "9") return ch;
  if (ch !== kleinFuer(ch, sprache) && ch === grossFuer(ch, sprache)) {
    const klein = SPOKEN_FR[kleinFuer(ch, sprache)];
    return "majuscule " + (klein ?? kleinFuer(ch, sprache));
  }
  return ch;
}

/**
 * ★★★ ES-F4 (27.09.2026, Bauplan spanischer Lehrgang §4.4 Punkt 3, Falle 24):
 * die Namen der mechanisch NEUEN spanischen Zeichen - vor allem `¿`/`¡`
 * („signo de apertura/cierre de interrogación/exclamación", genau der
 * Bauplan-Wortlaut), dazu `ñ` und die Akzent-/Trema-Buchstaben (á é í ó ú ü)
 * und die zwei Totasten selbst (´ ¨), ohne die eine Stimme das nackte Zeichen
 * läse - Zufall (dieselbe Begründung wie bei {@link SPOKEN_FR}).
 * ★ ES-O (27.09.2026): die generischen Sonderzeichen (`@ # &` …) haben jetzt
 * ebenfalls spanische Namen - der englische Rückfall (`spokenLabelEn`) ist weg.
 */
const SPOKEN_ES: Record<string, string> = {
  ...ZEICHEN_G3B.es, // ★★★ G3b (25.10.2026)
  " ": "espacio",
  "\n": "intro",
  ".": "punto", ",": "coma", "-": "guion", ":": "dos puntos", ";": "punto y coma",
  "\"": "comillas", "(": "paréntesis de apertura", ")": "paréntesis de cierre",
  // ★ ES-F8 (27.09.2026): der Apostroph liegt auf BEIDEN Pflicht-Tastaturen
  // auf einer eigenen Taste ohne AltGr (Bauplan §3, Zeile „' ?") - ohne Namen
  // bliebe er die letzte Lücke im „kein Zeichen ohne Namen"-Wächter.
  "'": "apóstrofo",
  // ★★★★ die vier neuen Bauplan-Namen (§4.4 Punkt 3, wörtlich).
  "¿": "signo de apertura de interrogación",
  "?": "signo de cierre de interrogación",
  "¡": "signo de apertura de exclamación",
  "!": "signo de cierre de exclamación",
  "´": "tilde", "¨": "diéresis",
  ñ: "eñe",
  á: "a con tilde", é: "e con tilde", í: "i con tilde", ó: "o con tilde", ú: "u con tilde",
  ü: "u con diéresis",
  // ★ ES-O (27.09.2026): die übrigen Zeichen - bis dahin englisch (siehe
  // Kopf-Doku). Namen nach dem üblichen Sprachgebrauch in Spanien und Amerika.
  "[": "corchete de apertura", "]": "corchete de cierre",
  "{": "llave de apertura", "}": "llave de cierre",
  "|": "barra vertical", "^": "acento circunflejo", "~": "virgulilla", "°": "grado",
  "`": "acento grave", "\\": "barra invertida", "/": "barra",
  "=": "igual", "+": "más", "*": "asterisco", "@": "arroba",
  "#": "numeral", "&": "y comercial", "%": "por ciento", "_": "guion bajo",
  "<": "menor que", ">": "mayor que", "€": "euro", "$": "dólar", "£": "libra",
  "§": "párrafo", "µ": "micro", "²": "elevado al cuadrado",
  // ★ F3-tr (02.10.2026): die Zeichen der türkischen Q-Tastatur (AltGr + T, AltGr + 5).
  "₺": "símbolo de la lira turca", "½": "un medio",
  // ★ F3-cs (02.10.2026): die Háček-Totaste der tschechischen Tastatur.
  "ˇ": "caron",
  "«": "comillas angulares de apertura", "»": "comillas angulares de cierre",
  "ç": "ce cedilla", "º": "ordinal masculino", "ª": "ordinal femenino",
  "·": "punto medio", "¬": "signo de negación",
};

/** Der spanische Name eines Zeichens für die Sprachausgabe (siehe {@link SPOKEN_ES}). */
function spokenLabelEs(ch: string, sprache: Lang = "es"): string {
  const treffer = SPOKEN_ES[ch];
  if (treffer) return treffer;
  if (ch >= "0" && ch <= "9") return ch;
  if (ch !== kleinFuer(ch, sprache) && ch === grossFuer(ch, sprache)) {
    // ★★★★★ ES-P7a-Behebung (S2): JEDER Grossbuchstabe bekommt „mayúscula …"
    // - vorher galt das nur für die paar Zeichen mit eigenem SPOKEN_ES-
    // Eintrag; ein gewöhnliches „Q" fiel mangels Eintrag ganz auf
    // `spokenLabelEn` zurück und wurde „capital Q" (gemessen e7: JEDER
    // Grossbuchstabe ohne AltGr betroffen). Dieselbe Bauart wie
    // `spokenLabelFr`s „majuscule " + (klein ?? ch.toLowerCase())" unten.
    const klein = SPOKEN_ES[kleinFuer(ch, sprache)];
    return "mayúscula " + (klein ?? kleinFuer(ch, sprache));
  }
  // ★ ES-O (27.09.2026): kein englischer Rückfall mehr - ein unbekanntes
  // Zeichen bleibt das Zeichen selbst (wie bei „fr").
  return ch;
}

/**
 * ★ O-IT (02.10.2026, Glossar §2.8 „Zeichennamen der Sprachausgabe"): die
 * italienischen Namen - Akzentbuchstaben AUSGESCHRIEBEN, damit ein Kind è und
 * é am Ohr unterscheidet (Bauplan I3, Falle 4): „e con accento grave",
 * „e con accento acuto". Grossbuchstaben „A maiuscola" (Buchstabe zuerst,
 * italienische Wortstellung; Glossar §4 Nr. 10 - NVDA-Messung A6 steht aus).
 */
const SPOKEN_IT: Record<string, string> = {
  " ": "spazio",
  "\n": "invio",
  ".": "punto", ",": "virgola", "-": "trattino", ":": "due punti", ";": "punto e virgola",
  "?": "punto interrogativo", "!": "punto esclamativo", "'": "apostrofo",
  "\"": "virgolette", "«": "virgolette basse aperte", "»": "virgolette basse chiuse",
  "(": "parentesi aperta", ")": "parentesi chiusa",
  "[": "parentesi quadra aperta", "]": "parentesi quadra chiusa",
  "{": "parentesi graffa aperta", "}": "parentesi graffa chiusa",
  "/": "barra", "\\": "barra rovesciata", "|": "barra verticale",
  "@": "chiocciola", "#": "cancelletto", "&": "e commerciale", "%": "percento",
  "_": "trattino basso", "<": "minore", ">": "maggiore", "=": "uguale", "+": "più",
  "*": "asterisco", "€": "euro", $: "dollaro", "£": "sterlina", "§": "paragrafo",
  "°": "grado", "^": "accento circonflesso", "~": "tilde", "`": "accento grave",
  "´": "accento acuto", "¨": "dieresi", "µ": "micro", "²": "elevato al quadrato",
  "¿": "punto interrogativo capovolto", "¡": "punto esclamativo capovolto", "·": "punto mediano",
  "º": "ordinale maschile", "ª": "ordinale femminile", "¬": "segno di negazione",
  "₺": "simbolo della lira turca", "½": "un mezzo", "ˇ": "caron",
  // ★★★★ die Akzentbuchstaben der italienischen Tastatur (Bauplan I3).
  à: "a con accento grave",
  è: "e con accento grave",
  é: "e con accento acuto",
  ì: "i con accento grave",
  ò: "o con accento grave",
  ù: "u con accento grave",
  // Zeichen anderer Tastaturen (Tessin, Schweiz, Deutschland, Spanien).
  ç: "c con cediglia", ä: "a con dieresi", ö: "o con dieresi", ü: "u con dieresi",
  ß: "esse tedesca", ñ: "enne con tilde",
  á: "a con accento acuto", í: "i con accento acuto", ó: "o con accento acuto", ú: "u con accento acuto",
  â: "a con accento circonflesso", ê: "e con accento circonflesso", î: "i con accento circonflesso",
  ô: "o con accento circonflesso", û: "u con accento circonflesso", ë: "e con dieresi", ï: "i con dieresi",
};

/** Der italienische Name eines Zeichens für die Sprachausgabe (siehe {@link SPOKEN_IT}). */
function spokenLabelIt(ch: string, sprache: Lang = "it"): string {
  const treffer = SPOKEN_IT[ch];
  if (treffer) return treffer;
  if (ch >= "0" && ch <= "9") return ch;
  if (ch !== kleinFuer(ch, sprache) && ch === grossFuer(ch, sprache)) {
    // „A maiuscola"; bei einem Akzentbuchstaben „E maiuscola con accento grave".
    const klein = SPOKEN_IT[kleinFuer(ch, sprache)];
    const m = klein ? /^(\S) (con .+)$/.exec(klein) : null;
    if (m) return `${grossFuer(m[1], sprache)} maiuscola ${m[2]}`;
    return `${ch} maiuscola`;
  }
  return ch;
}

/**
 * ★ O-PL (02.10.2026, Glossar §2.8 „Zeichennamen der Sprachausgabe"): die
 * polnischen Namen, wo möglich wie NVDA `symbols.dic` pl. Die neun polnischen
 * Buchstaben AUSGESCHRIEBEN, damit ein Kind a und ą am Ohr unterscheidet („a z
 * ogonkiem", „z z kropką"; „ł" gesprochen „eł"). Grossbuchstaben „duże A" -
 * Adjektiv vorn wie bei NVDA („duże a z ogonkiem"). Abweichungen von NVDA
 * (ukośnik statt slesz, krzyżyk statt hasz, znak zapytania statt pytajnik,
 * ampersand statt and) sind Absicht (Glossar §4 Nr. 10). Was §2.8 nicht nennt
 * (´ ¨ « » und die Buchstaben anderer Tastaturen), steht im Schlussbericht
 * als Glossar-Ergänzung.
 */
const SPOKEN_PL: Record<string, string> = {
  " ": "spacja",
  "\n": "enter",
  "\t": "tabulator",
  ".": "kropka", ",": "przecinek", ";": "średnik", ":": "dwukropek",
  "?": "znak zapytania", "!": "wykrzyknik", "-": "minus", "'": "apostrof",
  "\"": "cudzysłów", "„": "cudzysłów otwierający", "”": "cudzysłów zamykający",
  "«": "cudzysłów kątowy otwierający", "»": "cudzysłów kątowy zamykający",
  "(": "lewy nawias", ")": "prawy nawias",
  "[": "lewy nawias kwadratowy", "]": "prawy nawias kwadratowy",
  "{": "lewy nawias klamrowy", "}": "prawy nawias klamrowy",
  "/": "ukośnik", "\\": "ukośnik wsteczny", "|": "kreska pionowa",
  "@": "małpa", "#": "krzyżyk", "&": "ampersand", "%": "procent", "_": "podkreślnik",
  "<": "mniejsze", ">": "większe", "=": "równa się", "+": "plus", "*": "gwiazdka",
  "€": "euro", $: "dolar", "£": "funt", "§": "paragraf", "°": "stopień",
  "^": "daszek", "~": "tylda", "`": "akcent", "´": "akcent ostry", "¨": "umlaut",
  "µ": "mikro", "²": "do kwadratu", "³": "do sześcianu",
  "¿": "odwrócony znak zapytania", "¡": "odwrócony wykrzyknik", "·": "kropka środkowa",
  "º": "o w indeksie górnym", "ª": "a w indeksie górnym", "¬": "znak negacji",
  "₺": "znak liry tureckiej", "½": "jedna druga", "ˇ": "haczek",
  // ★★★★ die neun polnischen Buchstaben (Glossar §2.8).
  ą: "a z ogonkiem",
  ę: "e z ogonkiem",
  ć: "c z kreską",
  ń: "n z kreską",
  ó: "o z kreską",
  ś: "s z kreską",
  ź: "z z kreską",
  ż: "z z kropką",
  ł: "eł",
  // Buchstaben anderer Tastaturen (Deutschland, Schweiz, Frankreich, Spanien, Italien).
  ä: "a z umlautem", ö: "o z umlautem", ü: "u z umlautem", ë: "e z umlautem", ï: "i z umlautem",
  ß: "eszet", ç: "c z cedyllą", ñ: "n z tyldą",
  á: "a z akcentem ostrym", é: "e z akcentem ostrym", í: "i z akcentem ostrym", ú: "u z akcentem ostrym",
  à: "a z akcentem ciężkim", è: "e z akcentem ciężkim", ì: "i z akcentem ciężkim",
  ò: "o z akcentem ciężkim", ù: "u z akcentem ciężkim",
  â: "a z daszkiem", ê: "e z daszkiem", î: "i z daszkiem", ô: "o z daszkiem", û: "u z daszkiem",
};

/** Der polnische Name eines Zeichens für die Sprachausgabe (siehe {@link SPOKEN_PL}). */
function spokenLabelPl(ch: string, sprache: Lang = "pl"): string {
  const treffer = SPOKEN_PL[ch];
  if (treffer) return treffer;
  if (ch >= "0" && ch <= "9") return ch;
  if (ch !== kleinFuer(ch, sprache) && ch === grossFuer(ch, sprache)) {
    // „duże A"; bei einem polnischen Buchstaben „duże a z ogonkiem", „duże eł".
    const klein = kleinFuer(ch, sprache);
    return `duże ${SPOKEN_PL[klein] ?? ch}`;
  }
  return ch;
}

/**
 * ★ O-TR (02.10.2026, Glossar §2.8 „Zeichennamen (`SPOKEN_TR`)", Satzzeichen
 * nach der TDK-Liste): JEDES Zeichen, das `tr-q` liefert (auch über Shift,
 * Alt Gr und die Totaste ^), hat einen Namen. ★★★ i und ı tragen IMMER ihren
 * Zusatz - „noktalı i", „noktasız ı" (Glossar §4 Nr. 1: ılık/ilik sind zwei
 * Wörter); „ğ" heisst „yumuşak ge" (sein Name im Alphabet), sonst sagte die
 * Stimme womöglich das nackte Zeichen. â î û (und ê ô) „şapkalı …".
 * Grossbuchstaben „büyük A" - Adjektiv vorn, türkische Wortstellung
 * („büyük noktalı i" für İ, „büyük noktasız ı" für I). Ziffern als Ziffer.
 * Die Buchstaben ş ç ö ü liest eine türkische Stimme richtig - sie bleiben
 * das Zeichen selbst. ⚠️ Gesprochen am Gerät NICHT gemessen (Glossar §4 Nr. 12).
 */
const SPOKEN_TR: Record<string, string> = {
  " ": "boşluk",
  "\n": "enter",
  "\t": "tab",
  ".": "nokta", ",": "virgül", ";": "noktalı virgül", ":": "iki nokta",
  "?": "soru işareti", "!": "ünlem işareti", "-": "kısa çizgi", "'": "kesme işareti",
  "\"": "tırnak işareti",
  "«": "sol açılı tırnak", "»": "sağ açılı tırnak",
  "(": "parantez aç", ")": "parantez kapat",
  "[": "köşeli parantez aç", "]": "köşeli parantez kapat",
  "{": "süslü parantez aç", "}": "süslü parantez kapat",
  "/": "eğik çizgi", "\\": "ters eğik çizgi", "|": "dikey çizgi",
  "@": "et işareti", "#": "diyez", "&": "ve işareti", "%": "yüzde", "_": "alt çizgi",
  "<": "küçüktür", ">": "büyüktür", "=": "eşittir", "+": "artı", "*": "yıldız",
  "€": "avro", "₺": "Türk lirası", $: "dolar", "£": "sterlin", "§": "paragraf", "°": "derece",
  "^": "şapka", "~": "tilde", "`": "ters kesme", "´": "akut aksan", "¨": "umlaut",
  "½": "yarım", "µ": "mikro", "²": "kare", "³": "küp",
  "¿": "ters soru işareti", "¡": "ters ünlem işareti", "·": "orta nokta",
  "º": "üst simge o", "ª": "üst simge a", "¬": "değil işareti", "ˇ": "ters şapka",
  // ★★★★ die türkischen Buchstaben, die eine Stimme verwechseln kann (Glossar §2.1, §2.8).
  ı: "noktasız ı",
  i: "noktalı i",
  ğ: "yumuşak ge",
  â: "şapkalı a", î: "şapkalı i", û: "şapkalı u", ê: "şapkalı e", ô: "şapkalı o",
  // Buchstaben anderer Tastaturen (Deutschland, Schweiz, Frankreich, Spanien, Italien, Polen).
  ä: "iki noktalı a", ë: "iki noktalı e", ï: "iki noktalı i", ß: "Almanca keskin s",
  ñ: "tildeli n",
  é: "akut aksanlı e", á: "akut aksanlı a", í: "akut aksanlı i", ó: "akut aksanlı o", ú: "akut aksanlı u",
  à: "ters aksanlı a", è: "ters aksanlı e", ì: "ters aksanlı i", ò: "ters aksanlı o", ù: "ters aksanlı u",
  ą: "kuyruklu a", ę: "kuyruklu e", ł: "çizgili l",
};

/** Der türkische Name eines Zeichens für die Sprachausgabe (siehe {@link SPOKEN_TR}). */
function spokenLabelTr(ch: string, sprache: Lang = "tr"): string {
  const treffer = SPOKEN_TR[ch];
  if (treffer) return treffer;
  if (ch >= "0" && ch <= "9") return ch;
  if (ch !== kleinFuer(ch, sprache) && ch === grossFuer(ch, sprache)) {
    // „büyük A"; bei i/ı und den Şapka-Buchstaben „büyük noktalı i", „büyük şapkalı a".
    const klein = kleinFuer(ch, sprache);
    return `büyük ${SPOKEN_TR[klein] ?? ch}`;
  }
  return ch;
}

/**
 * ★ O-CS (03.10.2026, Glossar §2.8 „Zeichennamen (`SPOKEN_CS`)"): JEDES Zeichen, das `cs`/`cs-qwerty` liefert (auch
 * über Shift, AltGr und die Totasten), hat einen Namen. ★★★ „čárka" ALLEIN ist nur das Komma - die Akut-Totaste heisst
 * „čárka nad písmenem" (Glossar §4 Falle 2). `-` heisst „spojovník", nie „pomlčka" (das wäre der Gedankenstrich).
 * Die Buchstaben mit Zeichen sagen ihr Zeichen, wie in der Schule („dlouhé á", „e s háčkem", „u s kroužkem") - ein
 * Kind muss e, é und ě unterscheiden. Grossbuchstaben „velké A" (Adjektiv vorn, tschechische Wortstellung). Ziffern als
 * Ziffer. ⚠️ Gesprochen am Gerät NICHT gemessen (NVDA cs, Stimme Zuzana - Glossar §5 Nr. 8).
 */
const SPOKEN_CS: Record<string, string> = {
  " ": "mezera",
  "\n": "Enter",
  "\t": "tabulátor",
  ".": "tečka", ",": "čárka", ";": "středník", ":": "dvojtečka",
  "?": "otazník", "!": "vykřičník", "-": "spojovník", "'": "apostrof",
  "\"": "uvozovky", "„": "dolní uvozovky", "“": "horní uvozovky",
  "«": "lomené uvozovky vlevo", "»": "lomené uvozovky vpravo",
  "(": "levá závorka", ")": "pravá závorka",
  "[": "levá hranatá závorka", "]": "pravá hranatá závorka",
  "{": "levá složená závorka", "}": "pravá složená závorka",
  "/": "lomítko", "\\": "zpětné lomítko", "|": "svislá čára",
  "@": "zavináč", "#": "mřížka", "&": "ampersand", "%": "procento", "_": "podtržítko",
  "<": "menší než", ">": "větší než", "=": "rovná se", "+": "plus", "*": "hvězdička",
  "€": "euro", $: "dolar", "£": "libra", "§": "paragraf", "°": "stupeň",
  "^": "stříška", "~": "vlnovka", "`": "obrácený apostrof",
  // Die Totasten (Glossar §2.8): Háček, Čárka (nie „čárka" allein), Trema.
  "ˇ": "háček", "´": "čárka nad písmenem", "¨": "dvě tečky",
  "÷": "děleno", "×": "krát", "¤": "znak měny", "½": "jedna polovina", "²": "na druhou", "³": "na třetí",
  "µ": "mikro", "¿": "obrácený otazník", "¡": "obrácený vykřičník", "·": "tečka uprostřed", "₺": "turecká lira",
  // ★★★★ die tschechischen Buchstaben mit Zeichen (Glossar §2.8).
  á: "dlouhé á", é: "dlouhé é", ě: "e s háčkem", í: "dlouhé í", ó: "dlouhé ó", ú: "dlouhé ú", ů: "u s kroužkem",
  ý: "dlouhé ý", č: "c s háčkem", ď: "d s háčkem", ň: "n s háčkem", ř: "r s háčkem", š: "s s háčkem",
  ť: "t s háčkem", ž: "z s háčkem",
  // Buchstaben anderer Tastaturen (Deutschland, Schweiz, Frankreich, Spanien, Italien, Polen, Türkei, Slowakei).
  ä: "a s dvěma tečkami", ö: "o s dvěma tečkami", ü: "u s dvěma tečkami", ë: "e s dvěma tečkami",
  ï: "i s dvěma tečkami", ß: "ostré s", ç: "c s ocáskem", ñ: "n s vlnovkou",
  à: "a s obrácenou čárkou", è: "e s obrácenou čárkou", ì: "i s obrácenou čárkou", ò: "o s obrácenou čárkou",
  ù: "u s obrácenou čárkou",
  â: "a se stříškou", ê: "e se stříškou", î: "i se stříškou", ô: "o se stříškou", û: "u se stříškou",
  ą: "a s ocáskem", ę: "e s ocáskem", ł: "přeškrtnuté l", ć: "c s čárkou", ń: "n s čárkou", ś: "s s čárkou",
  ź: "z s čárkou", ż: "z s tečkou", ğ: "g s obloučkem", ş: "s s ocáskem", ı: "i bez tečky",
};

/** Der tschechische Name eines Zeichens für die Sprachausgabe (siehe {@link SPOKEN_CS}). */
function spokenLabelCs(ch: string, sprache: Lang = "cs"): string {
  const treffer = SPOKEN_CS[ch];
  if (treffer) return treffer;
  if (ch >= "0" && ch <= "9") return ch;
  if (ch !== kleinFuer(ch, sprache) && ch === grossFuer(ch, sprache)) {
    // „velké A"; bei den Buchstaben mit Zeichen „velké c s háčkem", „velké dlouhé á".
    const klein = kleinFuer(ch, sprache);
    return `velké ${SPOKEN_CS[klein] ?? ch}`;
  }
  return ch;
}

/**
 * ★★★ G3b (25.10.2026): die Zeichennamen der neun neuen Sprachen - je Sprache EINE eigene Datei (`zeichenNamen<Xx>.ts`), heute
 * leer (⇒ englischer Name). `Record<GeruestSprache, …>`: keine Sprache fehlt, und eine Etappe füllt nur ihre eigene Datei.
 */
const ZEICHENNAMEN_DER_NEUEN_SPRACHEN: Readonly<Record<GeruestSprache, Readonly<Record<string, string>>>> = {
  bg: ZEICHENNAMEN_BG, el: ZEICHENNAMEN_EL, hu: ZEICHENNAMEN_HU, nl: ZEICHENNAMEN_NL, pt: ZEICHENNAMEN_PT,
  br: ZEICHENNAMEN_BR, ro: ZEICHENNAMEN_RO, sv: ZEICHENNAMEN_SV, uk: ZEICHENNAMEN_UK,
};

/**
 * Name eines Zeichens für die SPRACHAUSGABE, in der Vorlese-Sprache.
 *
 * Ohne `lang` bleibt es beim Deutschen - so verhalten sich alle Alt-Aufrufer und
 * alle bestehenden Tests unverändert; wer englisch vorlesen lässt, reicht die
 * Sprache durch (siehe `ReadModes.lang` in voice.ts).
 */
export function spokenLabel(ch: string, lang: Lang = "de"): string {
  // ★ G2b-1: die Sprache geht auch in die Gross-/Klein-Rechnung der Namen
  // (türkisch „İ" ⇒ „capital i", nicht „capital i̇" mit Kombinationspunkt).
  // RÜCKFALL-EN (G2b-1): it, pl, tr, cs sagten bis hierher die DEUTSCHEN Namen
  // („großes Ł") - Falle 30; jetzt ausdrücklich die englischen, bis ihre
  // Sprachausgabe (Phase E12 der Sprache) eigene Namen trägt.
  // ★ O-IT (02.10.2026): Italienisch hat eigene Namen (SPOKEN_IT).
  if (lang === "it") return spokenLabelIt(ch, lang);
  // ★ O-PL (02.10.2026): Polnisch hat eigene Namen (SPOKEN_PL).
  if (lang === "pl") return spokenLabelPl(ch, lang);
  // ★ O-TR (02.10.2026): Türkisch hat eigene Namen (SPOKEN_TR).
  if (lang === "tr") return spokenLabelTr(ch, lang);
  // ★ O-CS (03.10.2026): Tschechisch hat eigene Namen (SPOKEN_CS) - damit fällt keine Sprache mehr auf Englisch.
  // RÜCKFALL-EN (G2-NEUN): die neun Sprachen des Gerüsts bekommen Englisch - nie den deutschen Rest der Kette.
  // ★★★ G3b (25.10.2026): der Einhängepunkt der neun Sprachen - ihr Eintrag schlägt den englischen Rückfall.
  if (istGeruestSprache(lang)) {
    const eigen = ZEICHENNAMEN_DER_NEUEN_SPRACHEN[lang][ch];
    if (eigen !== undefined) return eigen;
    // ★ O2-TASTATUR (30.10.2026): Zeichen fremder Tastaturen - nie mehr der englische Name.
    const ergaenzt = ZEICHEN_ERGAENZUNG[lang][ch];
    if (ergaenzt !== undefined) return ergaenzt;
  }
  lang = geruestAufEn(lang);
  if (lang === "cs") return spokenLabelCs(ch, lang);
  if (lang === "en") return spokenLabelEn(ch, lang);
  if (lang === "fr") return spokenLabelFr(ch, lang);
  // ★ ES-F4/ES-O: alle Zeichen spanisch (SPOKEN_ES) - siehe dort.
  if (lang === "es") return spokenLabelEs(ch, lang);
  return SPOKEN_OVERRIDES[ch] ?? charLabel(ch);
}

/**
 * Auf welcher der vier Tastenreihen liegt die BASIS-Taste eines Zeichens? (0
 * Zahlenreihe … 3 untere Reihe, siehe {@link ROW_NAMES}.) `null`, wenn das
 * Zeichen auf keiner Reihe des eingestellten Layouts vorkommt (z. B. die
 * Leertaste).
 *
 * ★ Für das Fingerdiktat ausserhalb der Grundreihe gebaut (20.09.2026, Punkt
 * 13 aus Testerin Durchgang): Ausserhalb der Grundreihe nennt „linker
 * Mittelfinger" nicht mehr genau eine Taste - der FINGER kommt aus
 * `fingerForChar`, die REIHE von hier, und erst beide zusammen grenzen die
 * Ansage so weit ein wie es das Tastaturbild erlaubt (siehe
 * `zeichenDerAnsage` in `fingerdiktatAufgaben.ts`, wo Zeigefinger-Spalten
 * trotzdem zweideutig bleiben).
 */
export function rowForChar(ch: string): number | null {
  if (!ch) return null;
  const base = baseKeyForChar(ch);
  const rows = activeLayout().rows;
  for (let r = 0; r < rows.length; r++) {
    if (rows[r].keys.includes(base)) return r;
  }
  return null;
}

/**
 * ★ E10a (25.09.2026, Bauplan §8.1 Punkt 3/§8.3): *rangée des chiffres,
 * rangée du haut, rangée de base, rangée du bas* - dieselbe Reihenfolge wie
 * {@link ROW_NAMES}/{@link ROW_NAMES_EN} (Zahlenreihe/obere Reihe/
 * Grundreihe/untere Reihe). Auf AZERTY besonders wichtig, weil `é è ç à '`
 * Buchstaben der ZIFFERNREIHE sind (Bauplan §8.3 Punkt 1) - die Freischalt-
 * Karte nennt hier zum ersten Mal auch für diese Zeichen die richtige Reihe.
 */
const ROW_NAMES_FR = ["rangée des chiffres", "rangée du haut", "rangée de base", "rangée du bas"];

/**
 * ★★★ ES-F8 (27.09.2026, Bauplan §7 Glossar „fila guía"): *fila de los
 * números, fila superior, fila guía, fila inferior* - dieselbe Reihenfolge
 * wie {@link ROW_NAMES}/{@link ROW_NAMES_EN}/{@link ROW_NAMES_FR}. Muss mit
 * den Reihennamen in {@link keyPlaceHintEs} übereinstimmen.
 */
const ROW_NAMES_ES = ["fila de los números", "fila superior", "fila guía", "fila inferior"];

/** ★ O-IT (02.10.2026): Glossar §2.1 - „riga di base" (nie „fila"). Muss zu {@link keyPlaceHintIt} passen. */
const ROW_NAMES_IT = ["riga dei numeri", "riga superiore", "riga di base", "riga inferiore"];

/** ★ O-PL (02.10.2026): Glossar §2.1 - „rząd podstawowy" (nie „wiersz", das ist die Textzeile). Muss zu {@link keyPlaceHintPl} passen. */
const ROW_NAMES_PL = ["rząd cyfr", "rząd górny", "rząd podstawowy", "rząd dolny"];

/** ★ O-TR (02.10.2026): Glossar §2.1 - „temel sıra" (nie „satır", das ist die Übungszeile). Muss zu {@link keyPlaceHintTr} passen. */
const ROW_NAMES_TR = ["sayı sırası", "üst sıra", "temel sıra", "alt sıra"];

/**
 * ★ O-CS (03.10.2026): Glossar §2.1 - „základní řada" (nie „řádek", das ist die Übungszeile). Muss zu
 * {@link keyPlaceHintCs} passen. ⚠️ Auf der tschechischen Tastatur trägt die číselná řada Buchstaben (Falle 1).
 */
const ROW_NAMES_CS = ["číselná řada", "horní řada", "základní řada", "dolní řada"];

/**
 * ★ E10a (25.09.2026, Bauplan §8.1 Punkt 3): eine WEG-TABELLE statt der
 * bisherigen verschachtelten Bedingung (dieselbe Begründung wie bei
 * {@link FINGER_NAME_JE_SPRACHE} - der Weichen-Zähler darf nicht steigen).
 *
 * ★★★ ES-F8: „es" bekommt jetzt {@link ROW_NAMES_ES}.
 */
const ROW_NAMES_JE_SPRACHE: Record<Lang, string[]> = {
  de: ROW_NAMES,
  en: ROW_NAMES_EN,
  fr: ROW_NAMES_FR,
  es: ROW_NAMES_ES,
  it: ROW_NAMES_IT,
  pl: ROW_NAMES_PL, // ★ O-PL (02.10.2026)
  tr: ROW_NAMES_TR, // ★ O-TR (02.10.2026)
  cs: ROW_NAMES_CS, // ★ O-CS (03.10.2026)
  // ★ O2-TASTATUR (30.10.2026): die neun Sprachen aus `fingerNamenNeun.ts`.
  bg: REIHEN_NEUN.bg as string[],
  el: REIHEN_NEUN.el as string[],
  hu: REIHEN_NEUN.hu as string[],
  nl: REIHEN_NEUN.nl as string[],
  pt: REIHEN_NEUN.pt as string[],
  br: REIHEN_NEUN.br as string[],
  ro: REIHEN_NEUN.ro as string[],
  sv: REIHEN_NEUN.sv as string[],
  uk: REIHEN_NEUN.uk as string[],
};

/**
 * Der NAME dieser Reihe, in der Vorlese-Sprache - „Grundreihe"/„home row"/
 * „rangée de base" usw. `null` wie bei {@link rowForChar}.
 */
export function rowName(ch: string, lang: Lang = "de"): string | null {
  const r = rowForChar(ch);
  if (r === null) return null;
  return ROW_NAMES_JE_SPRACHE[lang][r];
}

/** Der Index der Grundreihe in {@link ROW_NAMES} - für den Vergleich „ausserhalb der Grundreihe?". */
export const GRUNDREIHE_INDEX = 2;
