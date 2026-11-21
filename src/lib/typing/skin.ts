/**
 * DREI „Profile" (Skins) für den 10-Finger-Trainer „Tastenflow" auf EINEM
 * Lern-Kern - eines je Altersstufe (Charge S2, 15.08.2026, Bauplan §0.2 +
 * §0b.2; davor vier: die 10- bis 12-Jährigen hatten zwischen 29.07. und 15.08.
 * ein eigenes, mittleres Profil):
 *
 *   • `kind` (Stufe kids, 7-10): verspielt - du, Sterne, Jubel, Maskottchen,
 *     Polar-Expedition als Belohnung nach jeder neuen Taste. Johannes'
 *     Begründung für den lauten Jubel: „Kind sein ist schön."
 *   • `jugend` (Stufe teens, 11-15): ernst genommen, aber per Du - trocken,
 *     kein Jubel, kein Ausrufezeichen, kein Maskottchen; als Belohnung nach
 *     einer neuen Taste standardmäßig gar nichts, im Zahnrad das
 *     Eisschollen-Spiel wählbar. Seit 31.08.2026 aber wieder mit dem freien
 *     Spiel-Einstieg („🐧 Spielen"), den man selbst drückt. „Nicht kindlich"
 *     heißt hier NICHT nüchtern-humorlos, sondern knapp und auf Augenhöhe.
 *   • `erwachsen` (ab 16): sachlich, trocken-augenzwinkernd, keine
 *     Belohnungs-Runde. Bis 19.09.2026 per „Sie" - seither per Du wie alle
 *     Lernenden; gesiezt wird nur noch die Lehrkraft ({@link anredeFuer}).
 *
 * ★ Das WEGGEFALLENE mittlere Profil und was an seine Stelle trat: Johannes'
 * Weiche vom 30.07. („mit 11 ist ein Spiel kein Kinderkram, sondern der Grund
 * weiterzumachen") ist nicht widerrufen - sie wird nur nicht mehr über ein
 * Profil bedient, sondern über eine WAHL: Die Jugend-Stufe stellt im Zahnrad
 * zwischen KEINEM Spiel (Vorgabe) und dem Eisschollen-Spiel um (§0b.4, siehe
 * {@link ./belohnungsspiel}). Das ist ehrlicher als eine Altersgrenze: Ob ein
 * Spiel motiviert oder peinlich ist, weiß nur die Person selbst. Der dritte
 * Wert „Tipp-Sprint" ist am 22.08.2026 ersatzlos entfallen (Charge
 * „SCHLANK"): Er wiederholte die wackligsten Zeichen - genau das, was „Mein
 * Training" ohnehin bevorzugt übt.
 *
 * Hier liegen nur die Oberflächen-Texte (Anrede + Tonfall). Die Lern-Mechanik,
 * Tastatur, Töne und Barrierefreiheit sind in allen Profilen identisch. Siehe
 * [[project_zehnfinger_trainer]], [[feedback_du_ansprache]].
 *
 * WARUM DIE HELFER UNTEN EINZELN EXISTIEREN: Die Profile unterscheiden sich in
 * MEHREREN, voneinander unabhängigen Achsen. Ein einziger Schalter („ist es ein
 * Kind?") war genau der Fehler, der »zu kindlich für die Älteren« hat wachsen
 * lassen - er koppelt Dinge, die nichts miteinander zu tun haben. Auch bei nur
 * noch drei Profilen bleiben sie getrennt: Die Belohnungs-Achse hängt seit S2
 * zusätzlich an einer Person-Entscheidung, die Sprach-Achse nie.
 */
import type { Lang, Stufe, TypingRole } from "./account";
import type { BedienSprache } from "../bedienSprache/sprache";
import type { BelohnungsSpiel } from "./belohnungsspiel";
import { sterneStufe, waehle } from "./rundenAbwechslung";
import {
  ERWACHSEN_BEMERKUNG_EN,
  ERWACHSEN_GESPROCHEN_DE,
  ERWACHSEN_GESPROCHEN_EN,
  ERWACHSEN_TITEL_DE,
  ERWACHSEN_TITEL_EN,
  JUGEND_BEMERKUNG_DE,
  JUGEND_BEMERKUNG_EN,
  JUGEND_GESPROCHEN_DE,
  JUGEND_GESPROCHEN_EN,
  JUGEND_TITEL_DE,
  JUGEND_TITEL_EN,
  KIND_GESPROCHEN_DE,
  KIND_GESPROCHEN_EN,
  KIND_TITEL_DE,
  KIND_TITEL_EN,
  erwachsenBemerkungDe,
} from "./rundenSaetze";

export type Skin = "kind" | "jugend" | "erwachsen";

/**
 * ★★★ DIE ANREDE - „du" oder „Sie" - an EINER Stelle (19.09.2026).
 *
 * Johannes: *„Lehrer mit Sie ansprechen und Schüler und Selbstlernende mit
 * du"* - und auf die Nachfrage, ob auch Erwachsene ab 16, die selbst üben,
 * „du" lesen sollen: *„ja"*.
 *
 * Bis dahin hing das „Sie" am ALTER (Profil `erwachsen`); seither hängt es an
 * der ROLLE. Geduzt wird, wer lernt: Kinder, Jugendliche, Erwachsene mit
 * eigenem Konto, Gäste ohne Anmeldung. Gesiezt wird nur die Lehrkraft - auch
 * dann, wenn sie unter „Selbst üben" selbst tippt.
 *
 * ★ DIE ANREDE IST EINE EIGENE ACHSE, wie Spiel, Maskottchen und Konfetti
 * (siehe den Kopf dieser Datei). Der TON bleibt am Alter: Erwachsene lesen
 * weiter trocken, ohne Jubel, ohne Maskottchen, ohne Belohnungs-Spiel - nur
 * eben per Du. Die Erwachsenen-Texte gibt es darum in zwei Fassungen: per Du
 * (die Regel) und per Sie (nur die Lehrkraft, {@link isFormal}).
 *
 * ⚠️ Wer eine Anrede wählen will, fragt HIER - nicht `role === "lehrkraft"` an
 * der Aufrufstelle. Zwei Stellen, die dieselbe Frage getrennt beantworten,
 * laufen früher oder später auseinander
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]). In Bauteilen
 * liest `useAnrede()` (`components/typing/useAnrede.ts`) das angemeldete
 * Konto und fragt dann genau diese Funktion.
 */
export type Anrede = "du" | "Sie";

export function anredeFuer(
  konto: { role?: TypingRole } | null | undefined,
): Anrede {
  return konto?.role === "lehrkraft" ? "Sie" : "du";
}

/**
 * Stufe → Profil.
 *
 * DREI STUFEN (Bauplan §0b.2): `kids` bekommt den KIND-Ton, `teens` den
 * jugend-Ton. Die ALTEN Werte a/b/c laufen weiter durch diese Funktion, weil
 * sie als Inhalts-Etiketten (Korpus, Serien, Skripte, Tests) noch existieren -
 * sie folgen dabei genau der Konto-Migration aus `account.ts`:
 * a → kids → kind, b und c → teens → jugend.
 */
export function skinForStufe(stufe: Stufe): Skin {
  switch (stufe) {
    case "erwachsen":
      return "erwachsen";
    case "teens":
    case "b":
    case "c":
      return "jugend";
    default: // "kids" und der alte Wert "a"
      return "kind";
  }
}

/**
 * Steht ein Text in der „Sie"-Fassung? Nur, wer gesiezt wird (die Lehrkraft,
 * {@link anredeFuer}), UND nur im Erwachsenen-Ton - Kinder- und Jugendtexte
 * gibt es ausschliesslich per Du.
 *
 * ★ Die Anrede ist ABSICHTLICH ein Pflicht-Argument (dieselbe Überlegung wie
 * bei {@link gateModeFor}): Bis 19.09.2026 hiess diese Funktion „ist es das
 * Erwachsenen-Profil?". Hätte die Anrede eine Vorgabe bekommen, wäre jede alte
 * Aufrufstelle still auf „du" gekippt - auch dort, wo eine Lehrkraft liest. So
 * muss jede sichtbar sagen, wen sie meint.
 *
 * ⚠️ Nur für DEUTSCHE Texte. Englisch kennt kein Du/Sie; wo die englische
 * Fassung für Erwachsene förmlicher klingt („you have" statt „you've"), ist
 * das der TON und hängt weiter an `skin === "erwachsen"`.
 */
export function isFormal(skin: Skin, anrede: Anrede): boolean {
  return skin === "erwachsen" && anrede === "Sie";
}

/**
 * Welches Spiel wird nach einer neu freigeschalteten Taste ANGEBOTEN? (Weiche 2,
 * Johannes 29.07.; seit 14.08. eine freiwillige Belohnung statt eines Tors, seit
 * S2 mit Wahlmöglichkeit für die Jugend-Stufe.)
 *
 * kind bekommt immer die Polar-Expedition, erwachsen gar nichts - dazwischen
 * entscheidet die Person selbst (`wahl`, Geräte-Einstellung aus
 * {@link ./belohnungsspiel}; Vorgabe: keins).
 *
 * ★ Die Wahl ist ABSICHTLICH ein Pflicht-Argument: Nach dem Wegfall eines
 * Profils schweigt `tsc` bei Verzweigungen (bekannte Falle, Bauplan §4 S2) - so
 * muss jede Aufrufstelle sichtbar sagen, welche Wahl sie meint.
 *
 * ★★ 31.08.2026 (Johannes): „bei einem buchstaben bekommen es aber nur die
 * kinder" - DIESE Weiche bleibt also unverändert. Die Jugend-Stufe bekommt
 * seit demselben Tag zwar den freien Spiel-Einstieg zurück
 * ({@link showsFreePlay}), aber ausdrücklich NICHT die Unterbrechung nach jeder
 * neu freigeschalteten Taste: Wer mit 13 spielen will, holt sich das Spiel -
 * es wird ihm nicht vor die Nase gestellt.
 */
export type GateMode = "expedition" | "keins";

export function gateModeFor(skin: Skin, wahl: BelohnungsSpiel): GateMode {
  if (skin === "kind") return "expedition";
  if (skin === "erwachsen") return "keins";
  return wahl;
}

/**
 * Steht der Knopf „🐧 Spielen" da - der FREIE Einstieg ins Eisschollen-Spiel,
 * jederzeit startbar und ohne Anlass? (Johannes 31.08.2026: „Spiel auch für
 * jugentliche anbieten, nicht für erwachsene".)
 *
 * ★★ Das ist eine ANDERE Achse als {@link gateModeFor}, und die beiden werden
 * leicht verwechselt: Hier geht es um den Knopf, den man selbst drückt; dort um
 * das Spiel, das nach einer neuen Taste von selbst angeboten wird. Johannes hat
 * am 31.08. genau diese Trennung verlangt - die Jugend-Stufe bekommt den
 * Zugang, aber nicht die Unterbrechung.
 *
 * Vorgeschichte: Am 22.08.2026 (Charge „SCHLANK") war der freie Einstieg auf
 * die Kinder-Stufe zusammengestrichen und der damalige Helfer `freiesSpielFor`
 * ersatzlos gelöscht worden - die Aufrufstellen fragten seither einzeln
 * `skinForStufe(stufe) === "kind"` ab. Mit der Rücknahme ist die Achse wieder
 * eine echte Achse und steht darum wieder hier, an EINER Stelle: Zwei
 * Aufrufstellen, die dieselbe Frage getrennt beantworten, laufen früher oder
 * später auseinander ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export function showsFreePlay(skin: Skin): boolean {
  return skin !== "erwachsen";
}

/**
 * Tier-Abzeichen mit Namen wie „Präzisions-Pinguin" — oder die trockenen
 * Zweitnamen („Dreimal sauber")? Die Maskottchen gehören zum Kinder-Profil; ab
 * der Jugend-Stufe die neutralen Namen (die IDs bleiben in beiden Fällen
 * gleich, verdiente Abzeichen bleiben verdient).
 */
export function usesMascots(skin: Skin): boolean {
  return skin === "kind";
}

/**
 * Konfetti bei der Freischalt-Feier? Bewusst NICHT an die Sprache gekoppelt:
 * Konfetti sieht nur, wer selbst vor dem Bildschirm sitzt — der gesprochene
 * Jubel dagegen ist das, was die Sitznachbarn hören. Die Achse bleibt darum
 * eigenständig, auch wenn beide Helfer seit S2 dasselbe Profil meinen.
 */
export function showsConfetti(skin: Skin): boolean {
  return skin === "kind";
}

export interface UiCopy {
  /** Untertitel der Seite. */
  subtitle: string;
  /** Beschriftung des Stufen-Pulldowns. */
  textstufeLabel: string;
  /** Beschriftung der Fortschrittsanzeige (Sidebar). */
  progressLabel: string;
  /** Einheit der Punkte (XP). */
  xpUnit: string;
  /** Knopf am Rundenende. */
  retry: string;
  /** Hinweis bei gesperrter Lektion. */
  locked: string;
  /**
   * Überschrift der Abschluss-Karte (abhängig von der Sternzahl 0 bis 3).
   * ★ 29.10.2026: `variante` wählt aus mehreren Sätzen je Sternzahl
   * (`rundenAbwechslung.ts`); ohne Nummer der erste. Sprachen ohne eigene
   * Auswahl ignorieren sie.
   */
  summaryTitle: (stars: number, variante?: number) => string;
  /** Kurzer Kommentar darunter (leer = keiner). `variante` wie oben. */
  summaryRemark: (stars: number, variante?: number) => string;
  /**
   * Gesprochene/angesagte Sterne-Rückmeldung am Rundenende, altersgerecht
   * (z. B. „Super! 3 Sterne erreicht!" für Kinder, sachlicher für Erwachsene).
   */
  starsSpoken: (stars: number, variante?: number) => string;
  /**
   * Dieselbe Sterne-Rückmeldung auf ENGLISCH - für Kinder, die englische Texte
   * mit englischer Stimme üben (Entscheidung Johannes 29.08.2026, nach Jens'
   * Rückmeldung). Sie steht bewusst NEBEN der deutschen: Der Ton ist je Alters-
   * stufe verschieden, und eine getrennte Datei würde genau diesen Unterschied
   * verlieren. Nur die STIMME spricht englisch - die sichtbare Karte bleibt
   * deutsch.
   */
  starsSpokenEn: (stars: number, variante?: number) => string;
  /**
   * ★ E11a-5 (26.09.2026): dieselbe Rückmeldung FRANZÖSISCH - für Kinder auf
   * dem Weg „fr" (Vorlese-Sprache). Bis dahin fiel „fr" in
   * {@link starsSpokenFor} still auf den deutschen Satz (Falle 30).
   */
  starsSpokenFr: (stars: number) => string;
  /** ★ ES-O (27.09.2026): dieselbe Rückmeldung spanisch, tú. */
  starsSpokenEs: (stars: number) => string;
  /**
   * ★ O-IT (02.10.2026): dieselbe Rückmeldung italienisch, tu - Kinder
   * höchstens ein Ausrufezeichen, ab 11 keines (Glossar Regel 1); Lob ohne
   * Geschlechtsendung („Ottimo lavoro", nie „Bravo/Brava").
   */
  starsSpokenIt: (stars: number) => string;
  /**
   * ★ O-PL (02.10.2026): dieselbe Rückmeldung polnisch, ty - Kinder höchstens
   * ein Ausrufezeichen, ab 11 keines (Glossar Regel 1); Lob über die Sache
   * („Świetna robota"), nie „Brawo, zrobiłeś" (Regel 2); „1 gwiazdka ·
   * 2 gwiazdki · 3 gwiazdki" (§2.10a).
   */
  starsSpokenPl: (stars: number) => string;
  /**
   * ★ O-TR (02.10.2026): dieselbe Rückmeldung türkisch, sen - Kinder höchstens
   * ein Ausrufezeichen, ab 11 keines (Glossar Regel 1); nach der Zahl Einzahl
   * ("3 yıldız", Regel 5), keine Endung an der Zahl (Regel 6).
   */
  starsSpokenTr: (stars: number) => string;
  /**
   * ★ O-CS (03.10.2026): dieselbe Rückmeldung tschechisch, ty - Kinder
   * höchstens ein Ausrufezeichen, ab 11 keines (Glossar Regel 1); Lob über die
   * Sache, nie „Dokázal jsi" (Regel 2); „1 hvězdička · 2 hvězdičky ·
   * 3 hvězdičky" (§2.11).
   */
  starsSpokenCs: (stars: number) => string;
  starsSpokenBg: (stars: number) => string;
  starsSpokenEl: (stars: number) => string;
  starsSpokenHu: (stars: number) => string;
  starsSpokenNl: (stars: number) => string;
  starsSpokenPt: (stars: number) => string;
  starsSpokenBr: (stars: number) => string;
  starsSpokenRo: (stars: number) => string;
  starsSpokenSv: (stars: number) => string;
  starsSpokenUk: (stars: number) => string;
}

export const UI_COPY: Record<Skin, UiCopy> = {
  kind: {
    subtitle:
      "Schritt für Schritt blind tippen: von der Grundstellung (F und J) bis zum ganzen " +
      "Alphabet, mit Zahlen und Satzzeichen.",
    textstufeLabel: "Texte passend für:",
    progressLabel: "Spielstufe",
    xpUnit: "XP",
    retry: "Nochmal üben",
    locked: "Diese Lektion ist noch gesperrt. Schließe zuerst die vorige ab.",
    // ★ 29.10.2026: mehrere Sätze je Sternzahl, die von Runde zu Runde wechseln.
    summaryTitle: (stars, v) => waehle(KIND_TITEL_DE[sterneStufe(stars)], v),
    summaryRemark: () => "", // Kinder: keine Bemerkung unter den Sternen (bewusst, siehe rundenSaetze.ts)
    starsSpoken: (stars, v) => waehle(KIND_GESPROCHEN_DE[sterneStufe(stars)], v),
    starsSpokenEn: (stars, v) => waehle(KIND_GESPROCHEN_EN[sterneStufe(stars)], v),
    // ★ E11a-5: dieselbe Rückmeldung französisch (Vorlese-Sprache „fr").
    starsSpokenFr: (stars) =>
      stars >= 3
        ? "Super ! 3 étoiles !"
        : stars >= 2
          ? "Bravo ! 2 étoiles !"
          : "1 étoile ! Continue comme ça !",
    starsSpokenEs: (stars) =>
      stars >= 3
        ? "¡Genial! ¡3 estrellas!"
        : stars >= 2
          ? "¡Muy bien! ¡2 estrellas!"
          : "¡1 estrella! ¡Sigue así!",
    starsSpokenIt: (stars) =>
      stars >= 3
        ? "Fantastico, 3 stelle!"
        : stars >= 2
          ? "Ottimo lavoro, 2 stelle!"
          : "1 stella, continua così!",
    starsSpokenPl: (stars) =>
      stars >= 3
        ? "Super, 3 gwiazdki!"
        : stars >= 2
          ? "Świetna robota, 2 gwiazdki!"
          : "1 gwiazdka, tak trzymaj!",
    // ★ O-TR (02.10.2026): Lob ohne Religion (Glossar §2.11: Harika, Çok iyi).
    starsSpokenTr: (stars) =>
      stars >= 3
        ? "Harika, 3 yıldız!"
        : stars >= 2
          ? "Çok iyi, 2 yıldız!"
          : "1 yıldız, böyle devam!",
    // ★ O-CS (03.10.2026)
    starsSpokenCs: (stars) =>
      stars >= 3
        ? "Paráda, 3 hvězdičky!"
        : stars >= 2
          ? "Moc dobře, 2 hvězdičky!"
          : "1 hvězdička, jen tak dál!",
    starsSpokenBg: (stars) =>
      stars >= 3
        ? "Страхотно, 3 звездички!"
        : stars >= 2
          ? "Много добре, 2 звездички!"
          : "1 звездичка, само така!",
    starsSpokenEl: (stars) =>
      stars >= 3
        ? "Τέλεια, 3 αστέρια!"
        : stars >= 2
          ? "Μπράβο, 2 αστέρια!"
          : "1 αστέρι, συνέχισε έτσι!",
    starsSpokenHu: (stars) =>
      stars >= 3
        ? "Szuper, 3 csillag!"
        : stars >= 2
          ? "Erős, 2 csillag!"
          : "1 csillag, így tovább!",
    starsSpokenNl: (stars) =>
      stars >= 3
        ? "Top, 3 sterren!"
        : stars >= 2
          ? "Sterk, 2 sterren!"
          : "1 ster, ga zo door!",
    starsSpokenPt: (stars) =>
      stars >= 3
        ? "Fantástico! 3 estrelas!"
        : stars >= 2
          ? "Muito bem! 2 estrelas!"
          : "1 estrela! Continua assim!",
    starsSpokenBr: (stars) =>
      stars >= 3
        ? "Ótimo, 3 estrelas!"
        : stars >= 2
          ? "Muito bem, 2 estrelas!"
          : "1 estrela, continue assim!",
    starsSpokenRo: (stars) =>
      stars >= 3
        ? "Grozav, trei stele!"
        : stars >= 2
          ? "Foarte bine, două stele!"
          : "O stea, mergi mai departe!",
    starsSpokenSv: (stars) =>
      stars >= 3
        ? "Toppen, 3 stjärnor!"
        : stars >= 2
          ? "Starkt, 2 stjärnor!"
          : "1 stjärna, fortsätt så!",
    starsSpokenUk: (stars) =>
      stars >= 3
        ? "Чудово, 3 зірки!"
        : stars >= 2
          ? "Дуже добре, 2 зірки!"
          : "1 зірка, так тримати!",
  },
  // 11-15: per Du, aber trocken. Kein „Super!", kein Ausrufezeichen, kein
  // Maskottchen — und trotzdem nicht humorlos (Weiche 1, Johannes 29.07.).
  // Seit S2 gilt diese Fassung ab 11 (vorher ab 13); die eigene, wärmere
  // Zwischenfassung für 10-12 ist mit dem Profil entfallen. Der Maßstab bleibt
  // „ernst genommen", nicht „nüchtern" - darum die kurzen, anerkennenden
  // Rückmeldungen statt bloßer Zahlen.
  jugend: {
    subtitle:
      "Blind tippen lernen: von der Grundstellung bis zum ganzen Alphabet, mit Zahlen " +
      "und Satzzeichen, in deinem Tempo.",
    textstufeLabel: "Texte passend für:",
    progressLabel: "Übungsstufe",
    xpUnit: "XP",
    retry: "Nochmal",
    locked: "Diese Lektion ist noch gesperrt. Schließ zuerst die vorige ab.",
    // ★ 29.10.2026: mehrere Sätze je Sternzahl (Fassung 1 = der Wortlaut von vorher).
    summaryTitle: (stars, v) => waehle(JUGEND_TITEL_DE[sterneStufe(stars)], v),
    summaryRemark: (stars, v) => waehle(JUGEND_BEMERKUNG_DE[sterneStufe(stars)], v),
    starsSpoken: (stars, v) => waehle(JUGEND_GESPROCHEN_DE[sterneStufe(stars)], v),
    starsSpokenEn: (stars, v) => waehle(JUGEND_GESPROCHEN_EN[sterneStufe(stars)], v),
    starsSpokenFr: (stars) =>
      stars >= 3
        ? "3 étoiles. Frappe impeccable."
        : stars >= 2
          ? "2 étoiles."
          : "1 étoile.",
    starsSpokenEs: (stars) =>
      stars >= 3
        ? "3 estrellas. Escritura impecable."
        : stars >= 2
          ? "2 estrellas."
          : "1 estrella.",
    starsSpokenIt: (stars) =>
      stars >= 3
        ? "3 stelle. Scrittura impeccabile."
        : stars >= 2
          ? "2 stelle."
          : "1 stella.",
    starsSpokenPl: (stars) =>
      stars >= 3
        ? "3 gwiazdki. Pisanie bez zarzutu."
        : stars >= 2
          ? "2 gwiazdki."
          : "1 gwiazdka.",
    // ★ O-TR (02.10.2026)
    starsSpokenTr: (stars) =>
      stars >= 3
        ? "3 yıldız. Tertemiz yazım."
        : stars >= 2
          ? "2 yıldız."
          : "1 yıldız.",
    // ★ O-CS (03.10.2026)
    starsSpokenCs: (stars) =>
      stars >= 3
        ? "3 hvězdičky. Bezvadné psaní."
        : stars >= 2
          ? "2 hvězdičky."
          : "1 hvězdička.",
    starsSpokenBg: (stars) =>
      stars >= 3
        ? "3 звездички. Чисто писане."
        : stars >= 2
          ? "2 звездички."
          : "1 звездичка.",
    starsSpokenEl: (stars) =>
      stars >= 3
        ? "3 αστέρια. Καθαρό γράψιμο."
        : stars >= 2
          ? "2 αστέρια."
          : "1 αστέρι.",
    starsSpokenHu: (stars) =>
      stars >= 3
        ? "3 csillag. Tiszta gépelés."
        : stars >= 2
          ? "2 csillag."
          : "1 csillag.",
    starsSpokenNl: (stars) =>
      stars >= 3
        ? "3 sterren. Netjes getypt."
        : stars >= 2
          ? "2 sterren."
          : "1 ster.",
    starsSpokenPt: (stars) =>
      stars >= 3
        ? "3 estrelas. Escrita limpa."
        : stars >= 2
          ? "2 estrelas."
          : "1 estrela.",
    starsSpokenBr: (stars) =>
      stars >= 3
        ? "3 estrelas. Digitação limpa."
        : stars >= 2
          ? "2 estrelas."
          : "1 estrela.",
    starsSpokenRo: (stars) =>
      stars >= 3
        ? "Trei stele. Scriere curată."
        : stars >= 2
          ? "Două stele."
          : "O stea.",
    starsSpokenSv: (stars) =>
      stars >= 3
        ? "3 stjärnor. Felfritt skrivet."
        : stars >= 2
          ? "2 stjärnor."
          : "1 stjärna.",
    starsSpokenUk: (stars) =>
      stars >= 3
        ? "3 зірки. Чистий друк."
        : stars >= 2
          ? "2 зірки."
          : "1 зірка.",
  },
  // Ab 16: sachlich und trocken - seit 19.09.2026 per Du (Johannes: „Schüler
  // und Selbstlernende mit du", auch ab 16). Die Sie-Fassung für die Lehrkraft
  // steht darunter in `UI_COPY_ERWACHSEN_SIE`; sie unterscheidet sich NUR in
  // der Anrede, nie im Ton.
  erwachsen: {
    subtitle:
      "Tastschreiben mit dem Zehnfingersystem: strukturiert von der Grundstellung bis zu " +
      "Zahlen und Satzzeichen. In deinem Tempo, ganz ohne auf die Tasten zu sehen.",
    textstufeLabel: "Textauswahl:",
    // „Übungsstufe", NICHT „Niveau": der Ring zählt gesammelte Übungspunkte
    // (Fleiß), nicht Können/Schwierigkeit — „Niveau" wurde sonst mit der
    // (versteckten) Leistungsstufe verwechselt. Siehe stars/level/progress.
    progressLabel: "Übungsstufe",
    xpUnit: "Punkte",
    retry: "Noch einmal",
    locked: "Diese Lektion ist noch gesperrt. Schließ zuerst die vorige ab.",
    // ★ 29.10.2026: mehrere Sätze je Sternzahl (Fassung 1 = der Wortlaut von vorher).
    summaryTitle: (stars, v) => waehle(ERWACHSEN_TITEL_DE[sterneStufe(stars)], v),
    summaryRemark: (stars, v) => waehle(erwachsenBemerkungDe(false)[sterneStufe(stars)], v),
    starsSpoken: (stars, v) => waehle(ERWACHSEN_GESPROCHEN_DE[sterneStufe(stars)], v),
    starsSpokenEn: (stars, v) => waehle(ERWACHSEN_GESPROCHEN_EN[sterneStufe(stars)], v),
    starsSpokenFr: (stars) =>
      stars >= 3
        ? "3 étoiles."
        : stars >= 2
          ? "2 étoiles."
          : "1 étoile.",
    starsSpokenEs: (stars) =>
      stars >= 3
        ? "3 estrellas."
        : stars >= 2
          ? "2 estrellas."
          : "1 estrella.",
    starsSpokenIt: (stars) =>
      stars >= 3
        ? "3 stelle."
        : stars >= 2
          ? "2 stelle."
          : "1 stella.",
    starsSpokenPl: (stars) =>
      stars >= 3
        ? "3 gwiazdki."
        : stars >= 2
          ? "2 gwiazdki."
          : "1 gwiazdka.",
    // ★ O-TR (02.10.2026)
    starsSpokenTr: (stars) =>
      stars >= 3
        ? "3 yıldız."
        : stars >= 2
          ? "2 yıldız."
          : "1 yıldız.",
    // ★ O-CS (03.10.2026)
    starsSpokenCs: (stars) =>
      stars >= 3
        ? "3 hvězdičky."
        : stars >= 2
          ? "2 hvězdičky."
          : "1 hvězdička.",
    starsSpokenBg: (stars) =>
      stars >= 3
        ? "3 звездички."
        : stars >= 2
          ? "2 звездички."
          : "1 звездичка.",
    starsSpokenEl: (stars) =>
      stars >= 3
        ? "3 αστέρια."
        : stars >= 2
          ? "2 αστέρια."
          : "1 αστέρι.",
    starsSpokenHu: (stars) =>
      stars >= 3
        ? "3 csillag."
        : stars >= 2
          ? "2 csillag."
          : "1 csillag.",
    starsSpokenNl: (stars) =>
      stars >= 3
        ? "3 sterren."
        : stars >= 2
          ? "2 sterren."
          : "1 ster.",
    starsSpokenPt: (stars) =>
      stars >= 3
        ? "3 estrelas."
        : stars >= 2
          ? "2 estrelas."
          : "1 estrela.",
    starsSpokenBr: (stars) =>
      stars >= 3
        ? "3 estrelas."
        : stars >= 2
          ? "2 estrelas."
          : "1 estrela.",
    starsSpokenRo: (stars) =>
      stars >= 3
        ? "Trei stele."
        : stars >= 2
          ? "Două stele."
          : "O stea.",
    starsSpokenSv: (stars) =>
      stars >= 3
        ? "3 stjärnor."
        : stars >= 2
          ? "2 stjärnor."
          : "1 stjärna.",
    starsSpokenUk: (stars) =>
      stars >= 3
        ? "3 зірки."
        : stars >= 2
          ? "2 зірки."
          : "1 зірка.",
  },
};

/**
 * Die Erwachsenen-Oberfläche per SIE - nur für die Lehrkraft, die unter
 * „Selbst üben" mit der Textstufe „ab 16" tippt ({@link isFormal}).
 *
 * ⚠️ Nur die drei Felder, in denen eine Anrede vorkommt, sind hier eigens
 * geschrieben; alles andere ist das Erwachsenen-Profil selbst. So kann der
 * Ton zwischen Du- und Sie-Fassung nicht auseinanderlaufen.
 */
const UI_COPY_ERWACHSEN_SIE: UiCopy = {
  ...UI_COPY.erwachsen,
  subtitle:
    "Tastschreiben mit dem Zehnfingersystem: strukturiert von der Grundstellung bis zu " +
    "Zahlen und Satzzeichen. In Ihrem Tempo, ganz ohne auf die Tasten zu sehen.",
  locked: "Diese Lektion ist noch gesperrt. Bitte schließen Sie zuerst die vorige ab.",
  summaryRemark: (stars, v) => waehle(erwachsenBemerkungDe(true)[sterneStufe(stars)], v),
};

/**
 * Die Oberflächen-Texte zur Stufe - per Du, ausser `anrede` ist „Sie" UND die
 * Stufe ist die der Erwachsenen ({@link isFormal}).
 *
 * Die Vorgabe „du" ist hier Absicht (anders als bei `isFormal`): Die meisten
 * Aufrufer lesen nur `progressLabel` oder `xpUnit`, und die tragen keine
 * Anrede. Wer einen Satz mit Anrede zeigt (`summaryRemark`, `subtitle`,
 * `locked`), reicht die Anrede der Person durch (`useAnrede()`).
 */
export function copyFor(stufe: Stufe, anrede: Anrede = "du"): UiCopy {
  const skin = skinForStufe(stufe);
  return isFormal(skin, anrede) ? UI_COPY_ERWACHSEN_SIE : UI_COPY[skin];
}

/**
 * ★★ DIE SICHTBAREN PROFIL-TEXTE DER ÜBUNGSSEITE in der Bedienungssprache
 * (Probestück „englische Bedienung", 12.09.2026).
 *
 * ⚠️ BEWUSST NUR FÜNF FELDER. Das Probestück machte die Übungsseite englisch -
 * Untertitel und Sperr-Hinweis stehen dort nicht; die Textstufen-Beschriftung
 * kam mit EN2 (19.09.2026) fürs Zahnrad dazu. Ein
 * vollständiges `UiCopy` auf Englisch mit deutschen Resten wäre eine Falle:
 * Wer `.locked` läse, bekäme still Deutsch. Der enge Typ lässt nur lesen, was
 * übersetzt ist. Die gesprochenen Sterne bleiben in `starsSpokenEn` (Übungssprache).
 */
export type BedienCopy = Pick<
  UiCopy,
  "progressLabel" | "retry" | "summaryTitle" | "summaryRemark" | "textstufeLabel"
>;

const UI_COPY_EN: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Game level",
    // ★ EN2 (19.09.2026): die Beschriftung der Textstufe im Zahnrad (Glossar §3.4).
    textstufeLabel: "Texts suitable for:",
    retry: "Practise again",
    // ★ 29.10.2026: mehrere Sätze je Sternzahl, die von Runde zu Runde wechseln.
    summaryTitle: (stars, v) => waehle(KIND_TITEL_EN[sterneStufe(stars)], v),
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Level",
    textstufeLabel: "Texts suitable for:",
    retry: "Again",
    summaryTitle: (stars, v) => waehle(JUGEND_TITEL_EN[sterneStufe(stars)], v),
    summaryRemark: (stars, v) => waehle(JUGEND_BEMERKUNG_EN[sterneStufe(stars)], v),
  },
  erwachsen: {
    progressLabel: "Level",
    textstufeLabel: "Choice of texts:",
    retry: "Once more",
    summaryTitle: (stars, v) => waehle(ERWACHSEN_TITEL_EN[sterneStufe(stars)], v),
    summaryRemark: (stars, v) => waehle(ERWACHSEN_BEMERKUNG_EN[sterneStufe(stars)], v),
  },
};

/**
 * ★ E11a-4 (26.09.2026): dieselben fünf Felder auf Französisch - neu
 * geschrieben (Bauplan §9.1: „nicht übersetzen"), „tu" (F9: Kinder und
 * Selbstlernende), kurz und einfach. Kein „vous" - wie Englisch kennt auch
 * diese Tabelle keine formelle Fassung (`bedienCopy` nimmt für „fr" darum
 * ebenfalls nie `UI_COPY_ERWACHSEN_SIE`).
 */
const UI_COPY_FR: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Niveau de jeu",
    textstufeLabel: "Textes adaptés à :",
    retry: "Recommencer",
    summaryTitle: () => "Série réussie !",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Niveau",
    textstufeLabel: "Textes adaptés à :",
    retry: "Encore",
    summaryTitle: (stars) =>
      stars >= 3 ? "Frappe impeccable." : stars >= 2 ? "Série solide." : "Série réussie.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Tes doigts savent ce qu'ils font."
        : stars >= 2
          ? "La vitesse, oui - la précision, d'abord."
          : "Ça compte quand même. La prochaine fois, un peu plus tranquille.",
  },
  erwachsen: {
    progressLabel: "Niveau",
    textstufeLabel: "Choix des textes :",
    retry: "Encore une fois",
    summaryTitle: (stars) =>
      stars >= 3 ? "Frappe impeccable." : stars >= 2 ? "Série solide." : "Série terminée.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Tes doigts savent ce qu'ils font."
        : stars >= 2
          ? "La vitesse, oui - la précision, d'abord."
          : "C'est fait. La prochaine fois, un peu plus tranquille.",
  },
};

/**
 * ★ ES-O (27.09.2026): dieselben fünf Felder auf Spanisch - neu geschrieben,
 * tú (Bauplan S9), kurz. Wie Englisch und Französisch ohne formelle Fassung.
 */
const UI_COPY_ES: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Nivel de juego",
    textstufeLabel: "Textos adecuados para:",
    retry: "Practicar otra vez",
    summaryTitle: () => "¡Serie conseguida!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Nivel",
    textstufeLabel: "Textos adecuados para:",
    retry: "Otra vez",
    summaryTitle: (stars) =>
      stars >= 3 ? "Escritura impecable." : stars >= 2 ? "Serie sólida." : "Serie conseguida.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Tus dedos saben lo que hacen."
        : stars >= 2
          ? "La velocidad está bien; la precisión, primero."
          : "Cuenta igual. La próxima vez, un poco más despacio.",
  },
  erwachsen: {
    progressLabel: "Nivel",
    textstufeLabel: "Elección de textos:",
    retry: "Una vez más",
    summaryTitle: (stars) =>
      stars >= 3 ? "Escritura impecable." : stars >= 2 ? "Serie sólida." : "Serie terminada.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Tus dedos saben lo que hacen."
        : stars >= 2
          ? "La velocidad está bien; la precisión, primero."
          : "Hecho. La próxima vez, un poco más despacio.",
  },
};

/**
 * ★ O-IT (02.10.2026): die Profil-Texte italienisch - „livello di gioco" /
 * „livello" (Glossar §2.2), „giro" für Runde, tu; ab 11 ohne Ausrufezeichen.
 */
const UI_COPY_IT: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Livello di gioco",
    textstufeLabel: "Testi adatti a:",
    retry: "Esercitati ancora",
    summaryTitle: () => "Giro completato!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Livello",
    textstufeLabel: "Testi adatti a:",
    retry: "Ancora",
    summaryTitle: (stars) =>
      stars >= 3 ? "Scrittura impeccabile." : stars >= 2 ? "Giro solido." : "Giro completato.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Le tue dita sanno quello che fanno."
        : stars >= 2
          ? "La velocità va bene; prima viene la precisione."
          : "Conta lo stesso. La prossima volta un po' più piano.",
  },
  erwachsen: {
    progressLabel: "Livello",
    textstufeLabel: "Scelta dei testi:",
    retry: "Ancora una volta",
    summaryTitle: (stars) =>
      stars >= 3 ? "Scrittura impeccabile." : stars >= 2 ? "Giro solido." : "Sezione completata.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Le tue dita sanno quello che fanno."
        : stars >= 2
          ? "La velocità va bene; prima viene la precisione."
          : "Fatto. La prossima volta un po' più piano.",
  },
};

/**
 * ★ O-PL (02.10.2026): die Profil-Texte polnisch - „Poziom gry" / „Poziom"
 * (Glossar §2.2), „runda", „Teksty dla:" (§2.5), ty; ab 11 ohne
 * Ausrufezeichen; Sätze über die Sache, nie über das Geschlecht (Regel 2).
 */
const UI_COPY_PL: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Poziom gry",
    textstufeLabel: "Teksty dla:",
    retry: "Poćwicz jeszcze raz",
    summaryTitle: () => "Runda ukończona!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Poziom",
    textstufeLabel: "Teksty dla:",
    retry: "Jeszcze raz",
    summaryTitle: (stars) =>
      stars >= 3 ? "Pisanie bez zarzutu." : stars >= 2 ? "Solidna runda." : "Runda ukończona.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Twoje palce wiedzą, co robią."
        : stars >= 2
          ? "Tempo jest dobre; najpierw jednak dokładność."
          : "To też się liczy. Następnym razem trochę wolniej.",
  },
  erwachsen: {
    progressLabel: "Poziom",
    textstufeLabel: "Wybór tekstów:",
    retry: "Jeszcze raz",
    summaryTitle: (stars) =>
      stars >= 3 ? "Pisanie bez zarzutu." : stars >= 2 ? "Solidna runda." : "Runda ukończona.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Palce wiedzą, co robią."
        : stars >= 2
          ? "Tempo w porządku; dokładność jest ważniejsza."
          : "Gotowe. Następnym razem trochę wolniej.",
  },
};

/**
 * ★ O-TR (02.10.2026): die Profil-Texte türkisch - "Oyun seviyesi" / "Seviye"
 * (Glossar §2.2), "tur" für Runde, "Metinler:" (§2.5), sen; ab 11 ohne
 * Ausrufezeichen (Regel 1).
 */
const UI_COPY_TR: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Oyun seviyesi",
    textstufeLabel: "Metinler:",
    retry: "Tekrar çalış",
    summaryTitle: () => "Tur bitti!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Seviye",
    textstufeLabel: "Metinler:",
    retry: "Tekrar",
    summaryTitle: (stars) =>
      stars >= 3 ? "Tertemiz yazım." : stars >= 2 ? "Sağlam bir tur." : "Tur bitti.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Parmakların ne yaptığını biliyor."
        : stars >= 2
          ? "Hız iyi; ama önce doğruluk."
          : "Bu da sayılır. Bir dahaki sefere biraz daha sakin.",
  },
  erwachsen: {
    progressLabel: "Seviye",
    textstufeLabel: "Metin seçimi:",
    retry: "Bir kez daha",
    summaryTitle: (stars) =>
      stars >= 3 ? "Tertemiz yazım." : stars >= 2 ? "Sağlam bir tur." : "Tur bitti.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Parmaklar ne yaptığını biliyor."
        : stars >= 2
          ? "Hız iyi; doğruluk daha önemli."
          : "Tamam. Bir dahaki sefere biraz daha sakin.",
  },
};

/**
 * ★ O-CS (03.10.2026): die Profil-Texte tschechisch - „Úroveň hry" / „Úroveň"
 * (Glossar §2.2), „kolo" für Runde, „Texty pro věk:" (§2.5), ty; ab 11 ohne
 * Ausrufezeichen; Sätze über die Sache, nie über das Geschlecht (Regel 2:
 * „Kolo je hotové", nie „Dokončil jsi kolo").
 */
const UI_COPY_CS: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Úroveň hry",
    textstufeLabel: "Texty pro věk:",
    retry: "Procvičit znovu",
    summaryTitle: () => "Kolo je hotové!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Úroveň",
    textstufeLabel: "Texty pro věk:",
    retry: "Ještě jednou",
    summaryTitle: (stars) =>
      stars >= 3 ? "Bezvadné psaní." : stars >= 2 ? "Solidní kolo." : "Kolo je hotové.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Tvoje prsty vědí, co dělají."
        : stars >= 2
          ? "Rychlost je dobrá; přednost má ale přesnost."
          : "I to se počítá. Příště trochu pomaleji.",
  },
  erwachsen: {
    progressLabel: "Úroveň",
    textstufeLabel: "Výběr textů:",
    retry: "Ještě jednou",
    summaryTitle: (stars) =>
      stars >= 3 ? "Bezvadné psaní." : stars >= 2 ? "Solidní kolo." : "Kolo je hotové.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Prsty vědí, co dělají."
        : stars >= 2
          ? "Rychlost je v pořádku; přesnost je důležitější."
          : "Hotovo. Příště trochu pomaleji.",
  },
};

/**
 * ★ O2-LIB (29.10.2026): die Profil-Texte bulgarisch - „Ниво в играта" / „Ниво" (Glossar §2.2),
 * „кръг" für Runde, „Текстове за възраст:" (§2.5), ти; ab 11 ohne Ausrufezeichen; Sätze über
 * die Sache, nie über das Geschlecht (Regel 2: „Кръгът е готов", nie „Завърши кръга").
 */
const UI_COPY_BG: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Ниво в играта",
    textstufeLabel: "Текстове за възраст:",
    retry: "Упражнявай пак",
    summaryTitle: () => "Кръгът е готов!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Ниво",
    textstufeLabel: "Текстове за възраст:",
    retry: "Още веднъж",
    summaryTitle: (stars) =>
      stars >= 3 ? "Чисто писане." : stars >= 2 ? "Стабилен кръг." : "Кръгът е готов.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Пръстите ти знаят какво правят."
        : stars >= 2
          ? "Скоростта е хубава, но точността е по-важна."
          : "И това се брои. Следващия път малко по-бавно.",
  },
  erwachsen: {
    progressLabel: "Ниво",
    textstufeLabel: "Избор на текстове:",
    retry: "Още веднъж",
    summaryTitle: (stars) =>
      stars >= 3 ? "Чисто писане." : stars >= 2 ? "Стабилен кръг." : "Кръгът е готов.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Пръстите знаят какво правят."
        : stars >= 2
          ? "Скоростта е добра; точността е по-важна."
          : "Готово. Следващия път малко по-бавно.",
  },
};

/**
 * ★ O-EL-LIB (30.10.2026): die Profil-Texte griechisch - „Επίπεδο παιχνιδιού" / „Επίπεδο" (Glossar §2.2), „γύρος" für
 * Runde, „Κείμενα για ηλικίες:" (§2.5), εσύ; ab 11 ohne Ausrufezeichen; Sätze über die Sache, nie über das Geschlecht.
 */
const UI_COPY_EL: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Επίπεδο παιχνιδιού",
    textstufeLabel: "Κείμενα για ηλικίες:",
    retry: "Εξάσκηση ξανά",
    summaryTitle: () => "Ο γύρος τελείωσε!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Επίπεδο",
    textstufeLabel: "Κείμενα για ηλικίες:",
    retry: "Άλλη μία φορά",
    summaryTitle: (stars) =>
      stars >= 3 ? "Καθαρό γράψιμο." : stars >= 2 ? "Σταθερός γύρος." : "Ο γύρος τελείωσε.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Τα δάχτυλά σου ξέρουν τι κάνουν."
        : stars >= 2
          ? "Η ταχύτητα είναι ωραία, η ακρίβεια όμως έχει προτεραιότητα."
          : "Μετράει κι αυτό. Την επόμενη φορά λίγο πιο αργά.",
  },
  erwachsen: {
    progressLabel: "Επίπεδο",
    textstufeLabel: "Επιλογή κειμένων:",
    retry: "Άλλη μία φορά",
    summaryTitle: (stars) =>
      stars >= 3 ? "Καθαρό γράψιμο." : stars >= 2 ? "Σταθερός γύρος." : "Ο γύρος τελείωσε.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Τα δάχτυλα ξέρουν τι κάνουν."
        : stars >= 2
          ? "Η ταχύτητα είναι καλή, η ακρίβεια όμως είναι πιο σημαντική."
          : "Ολοκληρώθηκε. Την επόμενη φορά λίγο πιο αργά.",
  },
};

/**
 * ★ O2-LIB (29.10.2026): die Profil-Texte ungarisch - „Játékszint" / „Szint" (Glossar §2.2),
 * „kör" für Runde, te; ab 11 ohne Ausrufezeichen; Sätze über die Sache, nie über die Person.
 */
const UI_COPY_HU: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Játékszint",
    textstufeLabel: "A szövegek korosztálya:",
    retry: "Gyakorlás újra",
    summaryTitle: () => "Kész a kör!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Szint",
    textstufeLabel: "A szövegek korosztálya:",
    retry: "Még egyszer",
    summaryTitle: (stars) =>
      stars >= 3 ? "Tiszta gépelés." : stars >= 2 ? "Szilárd kör." : "Kész a kör.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Az ujjaid tudják, mit csinálnak."
        : stars >= 2
          ? "A sebesség jó, de a pontosság az első."
          : "Ez is számít. Legközelebb egy kicsit lassabban.",
  },
  erwachsen: {
    progressLabel: "Szint",
    textstufeLabel: "Szövegválasztás:",
    retry: "Még egyszer",
    summaryTitle: (stars) =>
      stars >= 3 ? "Tiszta gépelés." : stars >= 2 ? "Szilárd kör." : "Kész a kör.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Az ujjak tudják, mit csinálnak."
        : stars >= 2
          ? "A sebesség rendben van; a pontosság fontosabb."
          : "Kész. Legközelebb egy kicsit lassabban.",
  },
};

/**
 * ★ O2-LIB (29.10.2026): die Profil-Texte niederländisch - "Level" (Glossar nl §2.2), "ronde",
 * "Teksten voor:" (§2.5), je; ab 11 ohne Ausrufezeichen; Sätze über die Sache, nie über die Person.
 */
const UI_COPY_NL: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Level van het spel",
    textstufeLabel: "Teksten voor:",
    retry: "Nog een keer oefenen",
    summaryTitle: () => "Ronde klaar!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Level",
    textstufeLabel: "Teksten voor:",
    retry: "Nog een keer",
    summaryTitle: (stars) =>
      stars >= 3 ? "Foutloos getypt." : stars >= 2 ? "Stevige ronde." : "Ronde klaar.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Je vingers weten wat ze doen."
        : stars >= 2
          ? "Snelheid is mooi, nauwkeurigheid gaat voor."
          : "Het telt toch mee. Ga de volgende keer iets rustiger.",
  },
  erwachsen: {
    progressLabel: "Level",
    textstufeLabel: "Keuze van teksten:",
    retry: "Nog een keer",
    summaryTitle: (stars) =>
      stars >= 3 ? "Foutloos getypt." : stars >= 2 ? "Stevige ronde." : "Onderdeel afgerond.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "De vingers weten wat ze doen."
        : stars >= 2
          ? "Snelheid is mooi, nauwkeurigheid gaat voor."
          : "Gelukt. Ga de volgende keer iets rustiger.",
  },
};

/**
 * ★ O-LIB (30.10.2026): os textos do perfil em português - „Nível de jogo" / „Nível" (Glossar §2.2), „ronda",
 * „Textos para:" (§2.5), tu; a partir dos 11 anos sem ponto de exclamação; frases sobre a coisa, nunca sobre
 * o género („Ronda concluída", nunca um particípio na pessoa).
 */
const UI_COPY_PT: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Nível de jogo",
    textstufeLabel: "Textos para:",
    retry: "Praticar outra vez",
    summaryTitle: () => "Ronda concluída!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Nível",
    textstufeLabel: "Textos para:",
    retry: "Outra vez",
    summaryTitle: (stars) =>
      stars >= 3 ? "Escrita limpa." : stars >= 2 ? "Boa ronda." : "Ronda concluída.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Os teus dedos sabem o que fazem."
        : stars >= 2
          ? "A velocidade é boa; a precisão é que conta."
          : "Também conta. Da próxima vez, um pouco mais devagar.",
  },
  erwachsen: {
    progressLabel: "Nível",
    textstufeLabel: "Escolha de textos:",
    retry: "Mais uma vez",
    summaryTitle: (stars) =>
      stars >= 3 ? "Escrita limpa." : stars >= 2 ? "Boa ronda." : "Secção concluída.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Os dedos sabem o que fazem."
        : stars >= 2
          ? "A velocidade é boa; a precisão é mais importante."
          : "Concluído. Da próxima vez, um pouco mais devagar.",
  },
};

/**
 * ★ O2-LIB (29.10.2026): die Profil-Texte, Portugiesisch (Brasilien) - "Nível de jogo" / "Nível",
 * "Rodada", você; ab 11 ohne Ausrufezeichen; Sätze über die Sache, nie über das Geschlecht
 * ("Rodada concluída", nie ein Partizip am Kind).
 */
const UI_COPY_BR: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Nível de jogo",
    textstufeLabel: "Textos para:",
    retry: "Praticar de novo",
    summaryTitle: () => "Rodada concluída!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Nível",
    textstufeLabel: "Textos para:",
    retry: "De novo",
    summaryTitle: (stars) =>
      stars >= 3 ? "Digitação limpa." : stars >= 2 ? "Rodada sólida." : "Rodada concluída.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Seus dedos sabem o que fazem."
        : stars >= 2
          ? "Velocidade é bom, mas precisão vem primeiro."
          : "Ainda conta. Da próxima vez, um pouco mais devagar.",
  },
  erwachsen: {
    progressLabel: "Nível",
    textstufeLabel: "Escolha de textos:",
    retry: "Mais uma vez",
    summaryTitle: (stars) =>
      stars >= 3 ? "Digitação limpa." : stars >= 2 ? "Rodada sólida." : "Rodada concluída.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Os dedos sabem o que fazem."
        : stars >= 2
          ? "A velocidade é boa; a precisão é indispensável."
          : "Concluído. Da próxima vez, um pouco mais devagar.",
  },
};

/**
 * ★ O2-LIB (29.10.2026): die Profil-Texte rumänisch - „Nivel de joc“ / „Nivel“ (Glossar §2.2),
 * „rundă“, „Texte pentru:“, tu; ab 11 ohne Ausrufezeichen; Sätze über die Sache, nicht über die Person.
 */
const UI_COPY_RO: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Nivel de joc",
    textstufeLabel: "Texte pentru:",
    retry: "Exersează din nou",
    summaryTitle: () => "Runda este gata!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Nivel",
    textstufeLabel: "Texte pentru:",
    retry: "Încă o dată",
    summaryTitle: (stars) =>
      stars >= 3 ? "Scriere curată." : stars >= 2 ? "Rundă solidă." : "Runda este gata.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Degetele tale știu ce fac."
        : stars >= 2
          ? "Viteza e bună, dar precizia contează mai mult."
          : "Se numără și asta. Data viitoare, puțin mai încet.",
  },
  erwachsen: {
    progressLabel: "Nivel",
    textstufeLabel: "Alegerea textelor:",
    retry: "Încă o dată",
    summaryTitle: (stars) =>
      stars >= 3 ? "Scriere curată." : stars >= 2 ? "Rundă solidă." : "Runda este gata.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Degetele știu ce fac."
        : stars >= 2
          ? "Viteza este în regulă; precizia este mai importantă."
          : "Gata. Data viitoare, puțin mai încet.",
  },
};

/**
 * ★ O2-LIB (30.10.2026): die Profil-Texte schwedisch - "Spelnivå" / "Nivå" (Glossar sv §2.2), "omgång",
 * "Texter för:" (§2.5), du; ab 11 ohne Ausrufezeichen; Sätze über die Sache, nie über die Person.
 */
const UI_COPY_SV: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Spelnivå",
    textstufeLabel: "Texter för:",
    retry: "Öva igen",
    summaryTitle: () => "Omgången är klar!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Nivå",
    textstufeLabel: "Texter för:",
    retry: "En gång till",
    summaryTitle: (stars) =>
      stars >= 3 ? "Felfritt skrivet." : stars >= 2 ? "Stadig omgång." : "Omgången är klar.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Dina fingrar vet vad de gör."
        : stars >= 2
          ? "Fart är bra, men noggrannhet kommer först."
          : "Den räknas ändå. Ta det lite lugnare nästa gång.",
  },
  erwachsen: {
    progressLabel: "Nivå",
    textstufeLabel: "Val av texter:",
    retry: "En gång till",
    summaryTitle: (stars) =>
      stars >= 3 ? "Felfritt skrivet." : stars >= 2 ? "Stadig omgång." : "Avsnittet är klart.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Fingrarna vet vad de gör."
        : stars >= 2
          ? "Fart är bra, men noggrannhet kommer först."
          : "Klart. Ta det lite lugnare nästa gång.",
  },
};

/**
 * ★ O2-LIB (30.10.2026): die Profil-Texte ukrainisch - „Рівень гри" / „Рівень" (Glossar §2.2), „раунд" für Runde,
 * „Тексти для віку:" (§2.5), ти; ab 11 ohne Ausrufezeichen; Sätze über die Sache, nie über das Geschlecht (Regel 2:
 * „Раунд завершено", nie „Ти завершив раунд").
 */
const UI_COPY_UK: Record<Skin, BedienCopy> = {
  kind: {
    progressLabel: "Рівень гри",
    textstufeLabel: "Тексти для віку:",
    retry: "Тренуватися ще раз",
    summaryTitle: () => "Раунд завершено!",
    summaryRemark: () => "",
  },
  jugend: {
    progressLabel: "Рівень",
    textstufeLabel: "Тексти для віку:",
    retry: "Ще раз",
    summaryTitle: (stars) =>
      stars >= 3 ? "Чистий друк." : stars >= 2 ? "Впевнений раунд." : "Раунд завершено.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Твої пальці знають, що роблять."
        : stars >= 2
          ? "Швидкість - це добре, але точність важливіша."
          : "Це теж зараховується. Наступного разу трохи повільніше.",
  },
  erwachsen: {
    progressLabel: "Рівень",
    textstufeLabel: "Добір текстів:",
    retry: "Ще раз",
    summaryTitle: (stars) =>
      stars >= 3 ? "Чистий друк." : stars >= 2 ? "Впевнений раунд." : "Раунд завершено.",
    summaryRemark: (stars) =>
      stars >= 3
        ? "Пальці знають, що роблять."
        : stars >= 2
          ? "Швидкість - це добре, але точність важливіша."
          : "Готово. Наступного разу трохи повільніше.",
  },
};

/**
 * Die sichtbaren Profil-Texte in der Bedienungssprache. `anrede` wirkt nur im
 * Deutschen (siehe {@link copyFor}); Englisch und Französisch kennen kein
 * Du/Sie.
 * ★ E11a-4: Tabellen-Zugriff statt der alten `=== "en"`-Weiche (Falle 30) -
 * sonst bekäme „fr" hier still die deutsche Copy.
 */
const UI_COPY_JE_SPRACHE: Record<Exclude<BedienSprache, "de">, Record<Skin, BedienCopy>> = {
  en: UI_COPY_EN,
  fr: UI_COPY_FR,
  es: UI_COPY_ES,
  it: UI_COPY_IT,
  pl: UI_COPY_PL, // ★ O-PL
  tr: UI_COPY_TR, // ★ O-TR
  cs: UI_COPY_CS, // ★ O-CS (03.10.2026)
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: UI_COPY_BG,
  el: UI_COPY_EL,
  hu: UI_COPY_HU,
  nl: UI_COPY_NL,
  pt: UI_COPY_PT,
  br: UI_COPY_BR,
  ro: UI_COPY_RO,
  sv: UI_COPY_SV,
  uk: UI_COPY_UK,
};

export function bedienCopy(
  stufe: Stufe,
  sprache: BedienSprache,
  anrede: Anrede = "du",
): BedienCopy {
  return sprache === "de"
    ? copyFor(stufe, anrede)
    : UI_COPY_JE_SPRACHE[sprache][skinForStufe(stufe)];
}

/** Die Sterne-Rückmeldung in der Vorlese-Sprache. */
export function starsSpokenFor(copy: UiCopy, stars: number, lang: Lang = "de", variante?: number): string {
  // ★ E11a-5: Tabelle je Sprache statt `lang === "en" ? … : …` (Falle 30).
  const feld: Record<Lang, "starsSpoken" | "starsSpokenEn" | "starsSpokenFr" | "starsSpokenEs" | "starsSpokenIt" | "starsSpokenPl" | "starsSpokenTr" | "starsSpokenCs" | "starsSpokenBg" | "starsSpokenEl" | "starsSpokenHu" | "starsSpokenNl" | "starsSpokenPt" | "starsSpokenBr" | "starsSpokenRo" | "starsSpokenSv" | "starsSpokenUk"> = {
    de: "starsSpoken",
    en: "starsSpokenEn",
    fr: "starsSpokenFr",
    es: "starsSpokenEs",
    it: "starsSpokenIt",
    pl: "starsSpokenPl", // ★ O-PL
    tr: "starsSpokenTr", // ★ O-TR
    cs: "starsSpokenCs", // ★ O-CS (03.10.2026)
    // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
    bg: "starsSpokenBg",
    el: "starsSpokenEl",
    hu: "starsSpokenHu",
    nl: "starsSpokenNl",
    pt: "starsSpokenPt",
    br: "starsSpokenBr",
    ro: "starsSpokenRo",
    sv: "starsSpokenSv",
    uk: "starsSpokenUk",
  };
  // ★ 29.10.2026: `variante` wirkt nur in Deutsch und Englisch; die anderen Sprachen ignorieren sie.
  return copy[feld[lang]](stars, variante);
}
