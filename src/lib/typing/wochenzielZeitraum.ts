/**
 * ════════════════════════════════════════════════════════════════════════════
 * DAS WOCHENZIEL IM GEWÄHLTEN ZEITRAUM - MINUTEN-MODELL (W3a, 18.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Ersetzt die Einheiten-Fassung vom 01.09.2026 (Johannes damals: „die
 * Wochenziele müssen sich auch anpassen wenn auf schuljahr oder gesamt
 * geklickt wird, und auch die maus over erklärung") durch das neue
 * Minuten-Modell aus `wochenziel.ts` (W1/W2) - dieselbe Frage, dieselbe
 * Antwort-FORM, nur andere Zahlen darunter:
 *
 *   Diese Woche       „25/60 Min."  - LIVE: geübt/Ziel dieser Woche, dazu
 *                                     (bei „Nachholen" an) die noch offenen
 *                                     Minuten früherer Wochen als EIGENE
 *                                     Zahl daneben.
 *   Eine andere Woche  „48/60 Min." - erfüllt/Ziel DIESER Woche, NACH
 *                                     Nachholen (eine vergangene Woche kann
 *                                     durch eine spätere längst gefüllt sein).
 *   Schuljahr/Gesamt   „87 %"       - Anteil der geschafften an den
 *                                     geforderten Minuten, über alle
 *                                     ABGESCHLOSSENEN Ziel-Wochen des
 *                                     Zeitraums (die laufende Woche zählt
 *                                     noch nicht, eine offene Woche ist
 *                                     nicht „verpasst"), dazu „in 5 von 7
 *                                     Wochen ganz".
 *
 * ── ★★★ Warum PROZENT und nicht mehr Minuten-Summen (Bauplan §7g) ─────────
 * Johannes, in der Nacht des Umbaus: *„es kann dann ja in % ausgegeben
 * werden: Kind A hat 87 % der Wochenaufgaben erledigt."* Eine Minutensumme
 * über mehrere Wochen bräuchte ein FESTES Ziel, um etwas zu bedeuten - sobald
 * sich das Ziel ändern darf (Zieländerung ab der Folgewoche, ein neues Kind
 * zählt erst ab seiner Beitrittswoche), ist „93 von 102 Minuten" keine feste
 * Grösse mehr. Ein Prozentsatz bleibt vergleichbar, eine Minutensumme über
 * wechselnde Ziele nicht.
 *
 * ── Woher die Zahlen kommen ─────────────────────────────────────────────
 * Reine Weiterverarbeitung von {@link wochenzielGeschichte} (dem vollen
 * Wochen-Bericht eines Kindes, von seinem ersten Zielabschnitt bis
 * mindestens zur laufenden Woche, aus `wochenziel.ts`) - diese Datei rechnet
 * selbst nichts über Minuten, Nachholen oder Erlass; sie sucht nur die
 * passende(n) Zeile(n) heraus und benennt sie fürs jeweilige Bild
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
import type { TaskEvent } from "./account";
import { wochenStart } from "./wochenrhythmus";
import {
  WOCHENZIEL_GRENZE,
  erfuellungProzent,
  wochenzielGeschichte,
  type GesperrteZeit,
  type KindWochenziel,
  type WochenErgebnis,
} from "./wochenziel";
import { grenzen, type Zeitraum } from "./zeitraum";
import type { BedienSprache } from "@/lib/bedienSprache";
import { istGeruestSprache } from "./sprachRegister";
import { KETTEN_NEUN } from "./kettenNeun";

/**
 * Der Wochenziel-Stand für EINE Zelle der Tabelle - drei Formen, je nachdem,
 * was `zeitraum` gerade zeigt (siehe Kopf-Kommentar). Eine „discriminated
 * union" statt eines einzigen Objekts mit vielen `| null`-Feldern: Wer `art`
 * kennt, kennt auch, welche Felder es überhaupt gibt.
 */
export type WochenzielStand =
  | { art: "keins" }
  | {
      art: "woche";
      /**
       * Ist DIESE Woche überhaupt eine Ziel-Woche (gewählt, nicht erlassen,
       * nicht zurückgesetzt, Ziel > 0)? `false` ⇒ die übrigen Zahlen sind 0
       * und ohne Aussage - siehe {@link erlassen}, um „nicht gewählt" von
       * „erlassen" zu unterscheiden.
       */
      zielwoche: boolean;
      /** Einzeln für dieses Kind erlassen? (dann ist `zielwoche` immer `false`.) */
      erlassen: boolean;
      /** Ist es die LAUFENDE Woche - live, noch nicht abgeschlossen? */
      laufend: boolean;
      zielMin: number;
      /** Tatsächlich geübte Minuten (ohne gesperrte Zeit), IMMER echt. */
      geuebtMin: number;
      /** min(geuebtMin, zielMin) - bei einer vergangenen Woche ggf. durch Nachholen erhöht. */
      erfuelltMin: number;
      /** zielMin - erfuelltMin, nie negativ. */
      offenMin: number;
      /** `zielwoche && offenMin === 0`. */
      erreicht: boolean;
      /**
       * NUR bei der LAUFENDEN Woche UND „Nachholen" an: wie viele Minuten aus
       * FRÜHEREN Wochen noch offen sind - eine eigene Zahl (siehe Kopf-
       * Kommentar). `null` sonst (kein Nachholen, oder keine laufende Woche).
       */
      offenVorherMin: number | null;
    }
  | {
      art: "prozent";
      /** Σ erfuellt ÷ Σ ziel über die abgeschlossenen Ziel-Wochen im Zeitraum. `null` ohne eine einzige. */
      anteil: number | null;
      /** Wie viele davon GANZ erfüllt waren. */
      wochenGanz: number;
      /** Wie viele abgeschlossene Ziel-Wochen es im Zeitraum überhaupt gab. */
      wochenGesamt: number;
    };

/**
 * Der Wochenziel-Stand eines Kindes für den gewählten `zeitraum` - siehe
 * {@link WochenzielStand}. `ziel` kommt aus `kindWochenzielAusFeldern` (die
 * EINE Übersetzung Speicherform → Rechnung, `wochenziel.ts`), `gesperrt` aus
 * der Klasse (`TypingClass.gesperrteZeiten`) - Übung darin zählt überall
 * sonst, nur nicht fürs Wochenziel.
 */
export function wochenzielImZeitraum(
  events: readonly TaskEvent[],
  ziel: KindWochenziel,
  gesperrt: readonly GesperrteZeit[],
  zeitraum: Zeitraum,
  jetztMs: number,
): WochenzielStand {
  if (ziel.verlauf.length === 0) return { art: "keins" };
  const laufendeWoche = wochenStart(jetztMs, WOCHENZIEL_GRENZE);

  if (zeitraum.art === "woche") {
    /*
     * ★ WOCHENZIEL_GRENZE statt der Klassen-Unterrichtsstunde: Die eigene
     * Wochengrenze der Klasse (Unterrichtstag/-ende) stirbt mit diesem Umbau
     * - das Wochenziel kennt seit W1 nur noch Montag 08:00, für jede Klasse
     * gleich (siehe `TastenflowReiter.tsx`, wo dieselbe Grenze jetzt auch die
     * Wochen der ganzen Tabelle bestimmt).
     */
    const g = grenzen(zeitraum, jetztMs, WOCHENZIEL_GRENZE)!;
    const bericht = wochenzielGeschichte(events, ziel, jetztMs, gesperrt, g.vonMs);
    // `g.vonMs` ist selbst ein gültiger Wochenanfang (dieselbe Rechnung wie
    // in `wochenzielGeschichte`/`wochenStart`) - die Zeile ist darum immer
    // dabei, der Bericht wurde ja genau bis mindestens dorthin gespannt.
    const zeile = bericht.find((w) => w.startMs === g.vonMs)!;
    const laufend = zeile.startMs === laufendeWoche;
    const offenVorherMin =
      laufend && ziel.nachholen
        ? bericht
            .filter((w) => w.startMs < zeile.startMs)
            .reduce((summe, w) => summe + w.offen, 0)
        : null;
    return {
      art: "woche",
      zielwoche: zeile.zielwoche,
      erlassen: zeile.erlassen,
      laufend,
      zielMin: zeile.ziel,
      geuebtMin: zeile.geuebt,
      erfuelltMin: zeile.erfuellt,
      offenMin: zeile.offen,
      erreicht: zeile.zielwoche && zeile.offen === 0,
      offenVorherMin,
    };
  }

  // ── Monat / Schuljahr / Gesamt: nur ABGESCHLOSSENE Ziel-Wochen ──────────
  const zielwochen = abgeschlosseneZielwochen(events, ziel, gesperrt, zeitraum, jetztMs);
  if (zielwochen.length === 0)
    return { art: "prozent", anteil: null, wochenGanz: 0, wochenGesamt: 0 };
  return {
    art: "prozent",
    anteil: erfuellungProzent(zielwochen),
    wochenGanz: zielwochen.filter((w) => w.offen === 0).length,
    wochenGesamt: zielwochen.length,
  };
}

/**
 * Die ABGESCHLOSSENEN Ziel-Wochen eines Kindes im `zeitraum` - die Zeilen,
 * aus denen {@link wochenzielImZeitraum} bei Monat/Schuljahr/Gesamt seinen
 * Prozentsatz bildet.
 *
 * ★ K3 (19.09.2026): herausgelöst, weil der Klassenüberblick
 * (`klassenueberblick.ts`) dieselben Zeilen ALLER Kinder zusammenzählt
 * (Σ erfüllt ÷ Σ Ziel - hier zählt die Minute, nicht der Kopf) und für den
 * Trend im Schuljahr nach Wochen ordnet. Ein zweiter Filter daneben liefe
 * irgendwann auseinander ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ⚠️ Die laufende und jede zukünftige Woche zählen nicht mit - eine Woche,
 * die noch nicht vorbei ist, ist nicht „nicht erreicht", sie ist noch nicht
 * dran ([[feedback_nie_gegen_das_kind]]). Bei `woche` gibt es keine
 * „abgeschlossenen Wochen im Zeitraum" in diesem Sinn - dort ist die Antwort
 * die eine Wochenzeile ({@link wochenzielImZeitraum}), hier `[]`.
 */
export function abgeschlosseneZielwochen(
  events: readonly TaskEvent[],
  ziel: KindWochenziel,
  gesperrt: readonly GesperrteZeit[],
  zeitraum: Zeitraum,
  jetztMs: number,
): WochenErgebnis[] {
  if (ziel.verlauf.length === 0 || zeitraum.art === "woche") return [];
  const laufendeWoche = wochenStart(jetztMs, WOCHENZIEL_GRENZE);
  const g = grenzen(zeitraum, jetztMs, WOCHENZIEL_GRENZE); // `null` bei „gesamt"
  return wochenzielGeschichte(events, ziel, jetztMs, gesperrt).filter(
    (w) =>
      w.zielwoche &&
      w.startMs < laufendeWoche &&
      (!g || (w.startMs >= g.vonMs && w.startMs <= g.bisMs)),
  );
}

/**
 * Der Satz am Spaltenkopf - ändert sich mit dem Zeitraum mit (Johannes:
 * „und auch die maus over erklärung"), jetzt fürs Minuten-/Prozent-Bild.
 */
export function wochenzielHilfe(
  zeitraum: Zeitraum,
  /** ★ EN6a (19.09.2026): die Bedienungssprache - ohne Angabe Deutsch, wie vorher. */
  sprache: BedienSprache = "de",
): string {
  // ★ O4 (30.10.2026): die neun eigen.
  if (istGeruestSprache(sprache)) {
    const w = KETTEN_NEUN[sprache].wochenziel;
    const lang = (wo: string) => w.imZeitraum(wo) + w.nichtGezaehlt + w.spalteErscheint;
    if (zeitraum.art === "gesamt") return lang(w.woGesamt);
    if (zeitraum.art === "schuljahr") return lang(w.woSchuljahr);
    if (zeitraum.art === "monat") return lang(w.woMonat);
    return (zeitraum.wochenVersatz === 0 ? w.laufend : w.andere) + w.haekchen + w.spalteErscheint;
  }
  if (sprache === "cs") return wochenzielHilfeCs(zeitraum); // ★ O-CS (03.10.2026)
  if (sprache === "tr") return wochenzielHilfeTr(zeitraum);
  if (sprache === "pl") return wochenzielHilfePl(zeitraum);
  if (sprache === "it") return wochenzielHilfeIt(zeitraum);
  if (sprache === "fr") return wochenzielHilfeFr(zeitraum);
  // ★ ES-O (27.09.2026): vorher still Deutsch (Falle 30).
  if (sprache === "es") return wochenzielHilfeEs(zeitraum);
  if (sprache === "en") return wochenzielHilfeEn(zeitraum);
  const spalteErscheint =
    " Die Spalte erscheint nur, solange mindestens ein Kind der Klasse ein Wochenziel hat.";
  const haekchen = " Das Häkchen steht, sobald das Ziel ganz erfüllt ist.";
  if (zeitraum.art === "gesamt")
    return (
      "Anteil der geschafften an den geforderten Minuten, über alle" +
      " ABGESCHLOSSENEN Ziel-Wochen zusammen, seit es dieses Konto gibt - die" +
      " laufende Woche zählt noch nicht mit, eine noch offene Woche ist nicht" +
      " „verpasst“. Dahinter steht, in wie vielen dieser Wochen das Ziel" +
      " GANZ erfüllt war. Nicht gewählte, erlassene und zurückgesetzte Wochen" +
      " zählen nicht mit." +
      spalteErscheint
    );
  if (zeitraum.art === "schuljahr")
    return (
      "Anteil der geschafften an den geforderten Minuten, über alle" +
      " ABGESCHLOSSENEN Ziel-Wochen dieses Schuljahres - die laufende Woche" +
      " zählt noch nicht mit, eine noch offene Woche ist nicht „verpasst“." +
      " Dahinter steht, in wie vielen dieser Wochen das Ziel GANZ erfüllt war." +
      " Nicht gewählte, erlassene und zurückgesetzte Wochen zählen nicht mit." +
      spalteErscheint
    );
  // ★ K4 (19.09.2026): „Monat" = die letzten 4 Wochen - ohne diesen Fall
  // fiele „Monat" in den Wochen-Fallback unten und zeigte das Minuten-Bild
  // einer einzelnen Woche statt des Prozent-Bilds über die 4 Wochen.
  if (zeitraum.art === "monat")
    return (
      "Anteil der geschafften an den geforderten Minuten, über alle" +
      " ABGESCHLOSSENEN Ziel-Wochen der letzten 4 Wochen - die laufende Woche" +
      " zählt noch nicht mit, eine noch offene Woche ist nicht „verpasst“." +
      " Dahinter steht, in wie vielen dieser Wochen das Ziel GANZ erfüllt war." +
      " Nicht gewählte, erlassene und zurückgesetzte Wochen zählen nicht mit." +
      spalteErscheint
    );
  if (zeitraum.wochenVersatz === 0)
    return (
      "Geübte von den geforderten Minuten dieser Woche - der laufende Stand." +
      " Ist „Nachholen“ an, kommen die noch offenen Minuten früherer" +
      " Wochen als eigene Zahl dazu." +
      haekchen +
      spalteErscheint
    );
  return (
    "Erfüllte von den geforderten Minuten der Woche, die oben steht - nach" +
    " Nachholen, falls es an ist. Eine Woche ohne gewähltes, erlassenes oder" +
    " zurückgesetztes Ziel zeigt einen Strich." +
    haekchen +
    spalteErscheint
  );
}

/**
 * ★ EN6a (19.09.2026): derselbe Satz englisch - Glossar §3.3 (*weekly goal*,
 * *goal weeks*, *catch up*, *excuse*, „zurücksetzen" ⇒ *clear*). Wie im
 * Deutschen je Zeitraum ein eigener Satz; das betonte „ABGESCHLOSSEN" bleibt
 * betont (*COMPLETED*), „GANZ" nicht - *IN FULL* läse eine Sprachausgabe
 * womöglich Buchstabe für Buchstabe.
 */
function wochenzielHilfeEn(zeitraum: Zeitraum): string {
  const spalteErscheint =
    " This column only appears while at least one pupil in the class has a weekly goal.";
  const haekchen = " The tick appears as soon as the goal has been met in full.";
  const nichtGezaehlt =
    " Weeks that are not goal weeks, or that were excused or cleared, don't count.";
  const imZeitraum = (wo: string) =>
    "The share of the minutes set that were actually done, across all" +
    ` COMPLETED goal weeks ${wo} - the current week doesn't count yet, and a` +
    " week that is still running is not “missed”. After it: in how many of" +
    " these weeks the goal was met in full." +
    nichtGezaehlt +
    spalteErscheint;
  if (zeitraum.art === "gesamt") return imZeitraum("since this account was created");
  if (zeitraum.art === "schuljahr") return imZeitraum("of this school year");
  if (zeitraum.art === "monat") return imZeitraum("of the last 4 weeks");
  if (zeitraum.wochenVersatz === 0)
    return (
      "Minutes practised out of the minutes set for this week - where things" +
      " stand right now. If “catch up” is on, minutes still open from earlier" +
      " weeks appear as a separate figure." +
      haekchen +
      spalteErscheint
    );
  return (
    "Minutes met out of the minutes set for the week shown above - after" +
    " catch-up, if it is on. A week that is not a goal week, or that was" +
    " excused or cleared, shows a dash." +
    haekchen +
    spalteErscheint
  );
}

/**
 * ★ E11a-3 (26.09.2026): derselbe Satz französisch - Glossar §9.2 (objectif
 * de la semaine, rattraper, dispensé, remis à zéro).
 */
function wochenzielHilfeFr(zeitraum: Zeitraum): string {
  const spalteErscheint =
    " Cette colonne n'apparait que si au moins un élève de la classe a un objectif de la semaine.";
  const haekchen = " La coche apparait dès que l'objectif est entièrement atteint.";
  const nichtGezaehlt =
    " Les semaines qui ne sont pas des semaines à objectif, ou qui ont été dispensées ou remises à zéro, ne comptent pas.";
  const imZeitraum = (wo: string) =>
    "La part des minutes demandées réellement faites, sur toutes les" +
    ` semaines à objectif TERMINÉES ${wo} - la semaine en cours ne compte` +
    " pas encore, et une semaine encore en cours n'est pas \"manquée\"." +
    " Ensuite : dans combien de ces semaines l'objectif a été entièrement" +
    " atteint." +
    nichtGezaehlt +
    spalteErscheint;
  if (zeitraum.art === "gesamt") return imZeitraum("depuis la création de ce compte");
  if (zeitraum.art === "schuljahr") return imZeitraum("de cette année scolaire");
  if (zeitraum.art === "monat") return imZeitraum("des 4 dernières semaines");
  if (zeitraum.wochenVersatz === 0)
    return (
      "Minutes exercées sur les minutes demandées pour cette semaine - le" +
      " état actuel. Si \"rattraper\" est activé, les minutes encore" +
      " ouvertes des semaines précédentes s'ajoutent comme un chiffre à part." +
      haekchen +
      spalteErscheint
    );
  return (
    "Minutes atteintes sur les minutes demandées de la semaine indiquée" +
    " ci-dessus - après rattrapage, si activé. Une semaine sans objectif" +
    " choisi, dispensée ou remise à zéro affiche un tiret." +
    haekchen +
    spalteErscheint
  );
}

/**
 * ★ O-IT (02.10.2026): dieselbe Hilfe italienisch - liest nur die Lehrkraft,
 * neutral (Glossar Regel 1). „Recuperare", „esonerata", „azzerata" (§2.6);
 * eine offene Woche ist nicht „non raggiunta" (nie „mancata/fallita").
 */
function wochenzielHilfeIt(zeitraum: Zeitraum): string {
  const spalteErscheint =
    " Questa colonna compare solo se almeno una persona della classe ha un obiettivo settimanale.";
  const haekchen = " Il segno di spunta compare appena l'obiettivo è raggiunto del tutto.";
  const nichtGezaehlt =
    " Le settimane senza obiettivo, esonerate o azzerate non contano.";
  const imZeitraum = (wo: string) =>
    "La quota dei minuti richiesti che sono stati davvero svolti, su tutte le" +
    ` settimane con obiettivo CONCLUSE ${wo} - la settimana in corso non conta` +
    ` ancora, e una settimana ancora aperta non è "non raggiunta".` +
    " Dopo: in quante di queste settimane l'obiettivo è stato raggiunto del tutto." +
    nichtGezaehlt +
    spalteErscheint;
  if (zeitraum.art === "gesamt") return imZeitraum("da quando esiste questo account");
  if (zeitraum.art === "schuljahr") return imZeitraum("di questo anno scolastico");
  if (zeitraum.art === "monat") return imZeitraum("delle ultime 4 settimane");
  if (zeitraum.wochenVersatz === 0)
    return (
      "Minuti svolti sui minuti richiesti per questa settimana - la situazione" +
      ` attuale. Se "Recuperare" è attivo, i minuti ancora da fare delle` +
      " settimane precedenti compaiono come numero a parte." +
      haekchen +
      spalteErscheint
    );
  return (
    "Minuti raggiunti sui minuti richiesti nella settimana indicata sopra -" +
    " dopo il recupero, se è attivo. Una settimana senza obiettivo scelto," +
    " esonerata o azzerata mostra un trattino." +
    haekchen +
    spalteErscheint
  );
}

/**
 * ★ O-PL (02.10.2026): dieselbe Hilfe polnisch - liest nur die Lehrkraft,
 * unpersönlich (Glossar Regel 1). cel tygodniowy, tygodnie z celem, nadrobić,
 * zwolniony, wyzerować, nieosiągnięty (§2.6); eine offene Woche ist nicht
 * „nieosiągnięty" - Partizipien an „tydzień"/„cel", nie an der Person.
 */
function wochenzielHilfePl(zeitraum: Zeitraum): string {
  const spalteErscheint =
    " Ta kolumna jest widoczna tylko wtedy, gdy co najmniej jedna osoba z klasy ma cel tygodniowy.";
  const haekchen = " Znacznik pojawia się, gdy cel jest w pełni osiągnięty.";
  const nichtGezaehlt =
    " Tygodnie bez celu, tygodnie zwolnione i wyzerowane się nie liczą.";
  const imZeitraum = (wo: string) =>
    "Odsetek wymaganych minut, które naprawdę przećwiczono, ze wszystkich" +
    ` ZAKOŃCZONYCH tygodni z celem ${wo} - bieżący tydzień jeszcze się nie liczy,` +
    " a tydzień, który jeszcze trwa, nie jest „nieosiągnięty”." +
    " Dalej: w ilu z tych tygodni cel został w pełni osiągnięty." +
    nichtGezaehlt +
    spalteErscheint;
  if (zeitraum.art === "gesamt") return imZeitraum("od założenia tego konta");
  if (zeitraum.art === "schuljahr") return imZeitraum("w tym roku szkolnym");
  if (zeitraum.art === "monat") return imZeitraum("w ciągu ostatnich 4 tygodni");
  if (zeitraum.wochenVersatz === 0)
    return (
      "Przećwiczone minuty z minut wymaganych w tym tygodniu - stan na teraz." +
      " Jeśli nadrabianie jest włączone, brakujące minuty z wcześniejszych" +
      " tygodni pojawiają się jako osobna liczba." +
      haekchen +
      spalteErscheint
    );
  return (
    "Osiągnięte minuty z minut wymaganych w tygodniu pokazanym powyżej -" +
    " po nadrobieniu, jeśli jest włączone. Tydzień bez wybranego celu," +
    " zwolniony lub wyzerowany pokazuje kreskę." +
    haekchen +
    spalteErscheint
  );
}

/**
 * ★ O-TR (02.10.2026): dieselbe Hilfe türkisch - liest nur die Lehrkraft,
 * beschreibend ohne Befehlsform (Glossar Regel 1); haftalık hedef, hedefli
 * haftalar, telafi, muaf, sıfırlanmış, ulaşılmadı (§2.6) - nie ein Wort für "gescheitert";
 * eine offene Woche ist nicht "ulaşılmadı".
 */
function wochenzielHilfeTr(zeitraum: Zeitraum): string {
  const spalteErscheint =
    " Bu sütun yalnızca sınıfta en az bir öğrencinin haftalık hedefi olduğunda görünür.";
  const haekchen = " Hedefe tamamen ulaşıldığında onay işareti görünür.";
  const nichtGezaehlt =
    " Hedef seçilmemiş, muaf tutulmuş ve sıfırlanmış haftalar sayılmaz.";
  const imZeitraum = (wo: string) =>
    "Gerçekten çalışılan sürenin hedeflenen süreye oranı -" +
    ` ${wo} TAMAMLANMIŞ tüm hedefli haftalar birlikte. İçinde bulunulan hafta henüz` +
    ' sayılmaz; süren bir hafta "ulaşılmadı" değildir.' +
    " Yanında: bu haftaların kaçında hedefe tamamen ulaşıldığı." +
    nichtGezaehlt +
    spalteErscheint;
  if (zeitraum.art === "gesamt") return imZeitraum("bu hesap açıldığından beri");
  if (zeitraum.art === "schuljahr") return imZeitraum("bu öğretim yılındaki");
  if (zeitraum.art === "monat") return imZeitraum("son 4 haftadaki");
  if (zeitraum.wochenVersatz === 0)
    return (
      "Bu hafta hedeflenen sürenin şimdiye kadar çalışılan kısmı - şu anki durum." +
      ' "Telafi" açıksa, önceki haftalardan kalan dakika ayrı bir sayı olarak' +
      " eklenir." +
      haekchen +
      spalteErscheint
    );
  return (
    "Yukarıda gösterilen haftada hedeflenen sürenin tamamlanan kısmı - açıksa" +
    " telafiden sonra. Hedef seçilmemiş, muaf tutulmuş ya da sıfırlanmış bir hafta" +
    " çizgi gösterir." +
    haekchen +
    spalteErscheint
  );
}

/**
 * ★ O-CS (03.10.2026): dieselbe Hilfe tschechisch - liest nur die Lehrkraft,
 * beschreibend ohne Befehlsform; týdenní cíl, splněno, nesplněno, prominutý,
 * vynulovaný, dohánění minut (Glossar §2.6) - eine offene Woche ist nicht
 * „nesplněná". Der Strich in der Zelle heisst „vodorovná čára" (nie „čárka",
 * Glossar §4 Falle 2). Ohne Anführung um Werte - der Satz kann auf die
 * Braillezeile.
 */
function wochenzielHilfeCs(zeitraum: Zeitraum): string {
  const spalteErscheint =
    " Sloupec je vidět jen tehdy, když má aspoň jedna osoba ve třídě týdenní cíl.";
  const haekchen = " Zaškrtnutí se objeví, jakmile je cíl splněn celý.";
  const nichtGezaehlt = " Týdny bez cíle, prominuté a vynulované týdny se nepočítají.";
  const imZeitraum = (wo: string) =>
    "Podíl skutečně nacvičených minut z požadovaných, za všechny UKONČENÉ týdny" +
    ` s cílem ${wo} - probíhající týden se zatím nepočítá a týden, který ještě běží,` +
    " není nesplněný. Za tím stojí, v kolika z těchto týdnů byl cíl splněn celý." +
    nichtGezaehlt +
    spalteErscheint;
  if (zeitraum.art === "gesamt") return imZeitraum("od založení tohoto účtu");
  if (zeitraum.art === "schuljahr") return imZeitraum("v tomto školním roce");
  if (zeitraum.art === "monat") return imZeitraum("za poslední 4 týdny");
  if (zeitraum.wochenVersatz === 0)
    return (
      "Nacvičené minuty z minut požadovaných v tomto týdnu - aktuální stav." +
      " Pokud je zapnuté dohánění minut, přibudou ještě chybějící minuty" +
      " z dřívějších týdnů jako samostatné číslo." +
      haekchen +
      spalteErscheint
    );
  return (
    "Splněné minuty z minut požadovaných v týdnu uvedeném nahoře - po dohnání," +
    " pokud je zapnuté. Týden bez zvoleného cíle, prominutý nebo vynulovaný" +
    " týden ukazuje vodorovnou čáru." +
    haekchen +
    spalteErscheint
  );
}

/** ★ ES-O (27.09.2026): dieselbe Hilfe spanisch - liest nur die Lehrkraft. */
function wochenzielHilfeEs(zeitraum: Zeitraum): string {
  const spalteErscheint =
    " Esta columna solo aparece si al menos una persona de la clase tiene un objetivo semanal.";
  const haekchen = " La marca aparece en cuanto el objetivo se ha cumplido del todo.";
  const nichtGezaehlt =
    " Las semanas que no son semanas del objetivo, o que se eximieron o se pusieron a cero, no cuentan.";
  const imZeitraum = (wo: string) =>
    "El porcentaje de los minutos pedidos que se hicieron de verdad, en todas las" +
    ` semanas del objetivo TERMINADAS ${wo} - la semana en curso todavía no` +
    " cuenta, y una semana todavía abierta no está \"perdida\"." +
    " Después: en cuántas de esas semanas se cumplió el objetivo del todo." +
    nichtGezaehlt +
    spalteErscheint;
  if (zeitraum.art === "gesamt") return imZeitraum("desde que existe esta cuenta");
  if (zeitraum.art === "schuljahr") return imZeitraum("de este curso escolar");
  if (zeitraum.art === "monat") return imZeitraum("de las últimas 4 semanas");
  if (zeitraum.wochenVersatz === 0)
    return (
      "Minutos practicados de los minutos pedidos para esta semana - cómo están" +
      " las cosas ahora. Si \"recuperar\" está activado, los minutos todavía" +
      " pendientes de semanas anteriores se añaden como una cifra aparte." +
      haekchen +
      spalteErscheint
    );
  return (
    "Minutos alcanzados de los minutos pedidos en la semana indicada" +
    " arriba - tras la recuperación, si está activada. Una semana sin objetivo" +
    " elegido, eximida o puesta a cero muestra un guion." +
    haekchen +
    spalteErscheint
  );
}
