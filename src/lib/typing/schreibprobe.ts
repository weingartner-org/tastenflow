/**
 * ★★★★★ DIE SCHREIBPROBE - eine Prüfung für eine ganze Klasse.
 *
 * Auftrag Johannes, 09.09.2026 (nachts, wörtlich):
 * *„in der Klassenverwaltung »Meine Klasse« brauchen wir einen weiteren Bereich
 * mit Prüfung … Gilt für die ganze Klasse … Alle texte für alle schüler müssen
 * genau gleich sein! niemand darf in einer Prüfung in einer Klasse andere texte
 * bekommen."*
 *
 * ── Warum das Wort „Schreibprobe" und nicht „Prüfung" ───────────────────────
 * Johannes hat ausdrücklich um ein besseres Wort gebeten. Gewählt ist
 * **Schreibprobe**, aus drei Gründen:
 *  1. Es ist der FACHBEGRIFF des Maschinen-/Tastschreibens für genau diese
 *     Sache: fester Text, feste Zeit, ausgewertet nach Anschlägen je Minute und
 *     Treffsicherheit. Wir erfinden also nichts, sondern benennen es richtig.
 *  2. Es steht nicht gegen das Kind ([[feedback_nie_gegen_das_kind]]). Eine
 *     Probe zeigt, was jemand kann; eine Prüfung fragt, ob es reicht.
 *  3. Es ist auf der Braillezeile kurz genug, um neben dem Zeitstand zu stehen.
 *
 * ⚠️ **Das Wort steht an GENAU EINER Stelle** ({@link PRUEFUNG_WORT}). Johannes
 * kann es morgen mit einer Zeile auf „Prüfung" zurückdrehen, ohne dass irgendwo
 * ein zweiter Wortlaut übrig bleibt.
 *
 * ── Was hier NICHT steht ────────────────────────────────────────────────────
 * Die Prüfungstexte selbst. Die liegen in `schreibproben/` und werden NACHGELADEN
 * (dynamisches `import`): 6 Niveaus × 15 Texte × 6000 Zeichen sind gut 540 KB -
 * die dürfen nicht in jedem Kinder-Bündel mitreisen, nur weil es die Schreibprobe
 * gibt. Geladen wird genau ein Niveau, und nur wenn wirklich eine läuft.
 *
 * ── Die drei Uhren, die man auseinanderhalten muss ──────────────────────────
 *  1. **Startzeitpunkt** (`startMs`): der Augenblick, in dem die Lehrkraft
 *     „Jetzt starten" drückt (Johannes 10.09.2026: gestartet wird nur
 *     sofort). Die Lehrkraft steht im Raum und startet, wenn die Klasse so
 *     weit ist - ein Termin im Voraus brächte nur eine Uhr mehr.
 *  2. **Einstiegsfenster** ({@link EINSTIEGSFENSTER_MIN} Minuten ab `startMs`):
 *     so lange kann ein Kind noch einsteigen. Wer später kommt, ist zu spät.
 *  3. **Prüfungszeit** (`dauerMin`): läuft für JEDES KIND EINZELN, und zwar erst
 *     ab seinem ERSTEN TASTENDRUCK. Zwei Kinder derselben Klasse haben also
 *     verschiedene Enden - das ist Absicht (Johannes: „die prüfung beginnt bei
 *     jedem kind erst mit dem ersten tastendruck").
 *
 * Siehe auch: `schreibproben/index.ts` (die Texte), `schreibprobeAuswertung.ts`
 * (das Rechenwerk), `components/typing/SchreibprobeLauf.tsx` (der Ablauf).
 */
import { SHIFT_UNIT, achteGrundtasteFuerLayout } from "./letters";
import type { LayoutId } from "./layouts";
// ★ E1 (24.09.2026): Die Niveaus hängen am Lernweg (Bauplan englischer
// Lehrgang §5.3) - `niveauDefs(lernweg)` statt einer festen Liste.
import { istLernweg, lernwegDef, type Lernweg, type LernwegDef } from "./lernweg";
// ★ EN5 (19.09.2026): die englische Bedienung. Direkt aus den Modulen, nicht
// über `@/lib/bedienSprache` - das Sammelmodul zieht den React-Provider mit,
// und diese Datei wird auch vom Handbuch-Skript (Node, ohne React) gelesen.
import type { BedienSprache } from "../bedienSprache/sprache";
import { mehrzahl, texte } from "../bedienSprache/texte";
import { mitRueckfallEn } from "./sprachRegister";
// ★ G3c-VERTEILER (25.10.2026): die eigenen Bänke der neun Gerüst-Wege (heute leer ⇒ wie Englisch).
import { geruestBank } from "./schreibproben/geruestBanken";

// ── Das eine Wort ───────────────────────────────────────────────────────────

/**
 * Wie die Sache heißt - für Kinder, Lehrkräfte, Mails und Braillezeile.
 *
 * **Johannes hat sie am 10.09.2026 benannt: „Tippchallenge".** (Er schrieb
 * „Tippchalenge"; geschrieben steht sie mit zwei l, wie „Challenge".) In der
 * Nacht davor hiess sie versuchsweise „Schreibprobe" - dass ein einziges Wort
 * dafür ausreicht, war der Zweck dieser Konstante.
 *
 * ⚠️ NUR HIER ÄNDERN. Wer das Wort an einer zweiten Stelle hinschreibt, baut
 * die Fehlerklasse ein, an der wir schon mehrfach hängen geblieben sind:
 * zwei Stellen, die voneinander nichts wissen
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ★★★ WARUM DIE DATEIEN UND DIE SERVER-SAMMLUNG WEITER `schreibprobe` HEISSEN.
 * Der Bezeichner ist NICHT der Name. `SchreibprobeLauf.tsx`,
 * `tt_schreibproben`, `useSchreibprobe` - das sind Adressen im Code, und ihre
 * Umbenennung wäre eine Wanderung durch ein Dutzend Dateien und eine
 * Datenbank-Sammlung, die schon am Server steht. Der Gegenwert wäre null: Kein
 * Kind und keine Lehrkraft sieht diese Namen je.
 * Was ein Mensch liest, kommt AUSNAHMSLOS von hier - und genau darum konnte
 * das Wort in einer Zeile wechseln.
 */
export const PRUEFUNG_WORT = "Tippchallenge";

/** Mehrzahl - dieselbe Regel wie oben. */
export const PRUEFUNG_WORT_MEHRZAHL = "Tippchallenges";

/**
 * ★★★ DER ENGLISCHE ZWILLING (EN5, 19.09.2026) - dieselbe Regel: NUR HIER.
 *
 * „Typing Challenge", gross geschrieben wie ein Name (Glossar §3.7 ★). Wer
 * eine Oberfläche in beiden Sprachen baut, holt das Wort über
 * {@link pruefungWort} - nie ein zweites Mal hingeschrieben.
 */
export const PRUEFUNG_WORT_EN = "Typing Challenge";
export const PRUEFUNG_WORT_MEHRZAHL_EN = "Typing Challenges";

/**
 * ★ E11a (25.09.2026): der französische Zwilling - Glossar §9.2 wörtlich
 * (*le Défi*, *Défi dactylo*).
 */
export const PRUEFUNG_WORT_FR = "Défi";
export const PRUEFUNG_WORT_MEHRZAHL_FR = "Défis";

/**
 * ★ ES-F2 (27.09.2026, Bauplan S12): der spanische Zwilling - „Reto" (*Reto
 * de mecanografía*), kurz und in Spanien wie Amerika gleich verständlich.
 * Anders als bei „vorerst Englisch" ist das hier keine Platzhalter-Übersetzung,
 * sondern eine feste Namens-Entscheidung aus dem Bauplan.
 */
export const PRUEFUNG_WORT_ES = "Reto";
export const PRUEFUNG_WORT_MEHRZAHL_ES = "Retos";

/**
 * ★ O-IT (02.10.2026, Bauplan I14, Glossar §2.3): der italienische Zwilling -
 * „Sfida", gross wie ein Name; nie „esame/prova/verifica" (die Klassenarbeit).
 */
export const PRUEFUNG_WORT_IT = "Sfida";
export const PRUEFUNG_WORT_MEHRZAHL_IT = "Sfide";

/**
 * ★ O-PL (02.10.2026, Glossar §2.3): der polnische Zwilling - „Wyzwanie",
 * gross wie ein Name; nie „sprawdzian/kartkówka/egzamin" (benotete Arbeiten).
 * ⚠️ Polnisch beugt: diese Konstante ist der NOMINATIV. In Sätzen steht das
 * Wort darum nur in Nominativ-Stellen oder nach Doppelpunkt; wo ein anderer
 * Fall nötig ist, schreibt der polnische Satz die Form selbst aus.
 */
export const PRUEFUNG_WORT_PL = "Wyzwanie";
export const PRUEFUNG_WORT_MEHRZAHL_PL = "Wyzwania";

/**
 * ★ O-TR (02.10.2026, Glossar §2.3): der türkische Zwilling - "Yarışma",
 * gross wie ein Name; nie "sınav" (die Klassenarbeit), nie "Challenge".
 * ⚠️ Nach einer Zahl steht die EINZAHL ("3 yarışma"), und an das Wort kommt
 * in Sätzen keine Endung, die von einem Platzhalter abhängt.
 */
export const PRUEFUNG_WORT_TR = "Yarışma";
export const PRUEFUNG_WORT_MEHRZAHL_TR = "Yarışmalar";

/**
 * ★ O-CS (03.10.2026, Glossar §2.3): der tschechische Zwilling - „Výzva",
 * gross wie ein Name; nie „zkouška/test/písemka" (benotete Arbeiten).
 * ⚠️ Tschechisch beugt (7 Fälle): diese Konstante ist der NOMINATIV. In Sätzen
 * steht das Wort nur in Nominativ-Stellen oder nach Doppelpunkt; wo ein
 * anderer Fall nötig ist, schreibt der tschechische Satz die Form selbst aus.
 */
export const PRUEFUNG_WORT_CS = "Výzva";
export const PRUEFUNG_WORT_MEHRZAHL_CS = "Výzvy";

const PRUEFUNG_WORT_TABELLE: Record<BedienSprache, string> = {
  de: PRUEFUNG_WORT,
  en: PRUEFUNG_WORT_EN,
  fr: PRUEFUNG_WORT_FR,
  es: PRUEFUNG_WORT_ES,
  it: PRUEFUNG_WORT_IT,
  pl: PRUEFUNG_WORT_PL,
  tr: PRUEFUNG_WORT_TR,
  cs: PRUEFUNG_WORT_CS,
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: "Предизвикателство",
  el: "Πρόκληση",
  hu: "Kihívás",
  nl: "Uitdaging",
  pt: "Desafio",
  br: "Desafio",
  ro: "Provocare",
  sv: "Utmaningen",
  uk: "Виклик",
};
const PRUEFUNG_WORT_MEHRZAHL_TABELLE: Record<BedienSprache, string> = {
  de: PRUEFUNG_WORT_MEHRZAHL,
  en: PRUEFUNG_WORT_MEHRZAHL_EN,
  fr: PRUEFUNG_WORT_MEHRZAHL_FR,
  es: PRUEFUNG_WORT_MEHRZAHL_ES,
  it: PRUEFUNG_WORT_MEHRZAHL_IT,
  pl: PRUEFUNG_WORT_MEHRZAHL_PL,
  tr: PRUEFUNG_WORT_MEHRZAHL_TR,
  cs: PRUEFUNG_WORT_MEHRZAHL_CS,
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: "Предизвикателства",
  el: "Προκλήσεις",
  hu: "Kihívások",
  nl: "Uitdagingen",
  pt: "Desafios",
  br: "Desafios",
  ro: "Provocări",
  sv: "Utmaningar",
  uk: "Виклики",
};

/** Das Wort in der Bedienungssprache - ohne Angabe Deutsch. */
export function pruefungWort(sprache: BedienSprache = "de"): string {
  return PRUEFUNG_WORT_TABELLE[sprache];
}

/** Die Mehrzahl in der Bedienungssprache - ohne Angabe Deutsch. */
export function pruefungWortMehrzahl(sprache: BedienSprache = "de"): string {
  return PRUEFUNG_WORT_MEHRZAHL_TABELLE[sprache];
}

// ── Zeiten ──────────────────────────────────────────────────────────────────

/**
 * So lange nach dem Startzeitpunkt kann ein Kind noch einsteigen (Minuten).
 * Vorgabe Johannes: *„Ab dem startpunkt haben schüler 10min zeit die prüfung zu
 * starten"*.
 */
export const EINSTIEGSFENSTER_MIN = 10;

/** Kürzeste einstellbare Prüfungszeit (Minuten). */
export const DAUER_MIN_KLEINST = 1;

/**
 * Längste einstellbare Prüfungszeit (Minuten).
 *
 * 60 Minuten, weil die Texte mit 6000 Zeichen selbst bei 200 Anschlägen je
 * Minute erst nach 30 Minuten zu Ende wären - eine längere Probe hätte keinen
 * Text mehr. Wer mehr braucht, schreibt zwei.
 */
export const DAUER_MIN_GROESST = 60;

/** Vorgabe beim Anlegen einer neuen Schreibprobe (Minuten). */
export const DAUER_VORGABE = 10;

/**
 * ★★★ DEN ZEITZUSCHLAG GIBT ES SEIT 10.09.2026 NICHT MEHR.
 *
 * Er stand erst auf geratenen 50 %, dann auf 0 als Notnagel für stilles Lesen
 * auf der Braillezeile (gemessen: `BEFUND-2026-09-10-VORLESEZEIT-GEMESSEN.md`).
 * Johannes am Abend: *„den Zeitzuschlag … und die Häkchen unten brauchen wir
 * nicht. Blinde verwenden Vorlesen."* Den Ausgleich macht allein die gemessene
 * Vorlesezeit - seit 11.09.2026 (D4) für JEDES Kind, das sein eigenes
 * Vorlesen eingeschaltet hat (kein Häkchen der Lehrkraft mehr, siehe
 * {@link VORLESEN_ERLAUBT_WORT}).
 *
 * Diese Grenze bleibt nur, damit ältere Pläne mit Zuschlag beim Einlesen
 * geprüft werden (`planAusEinstellungen`). Neue Pläne tragen immer 0.
 */
export const ZUSCHLAG_GROESST = 200;

/**
 * ★★★ DIE ZWEI SÄTZE, DIE DEN ZUSCHLAG ÜBERFLÜSSIG MACHEN (Johannes 10.09.2026).
 *
 * Sie stehen hier und nicht in den Bauteilen, weil sie an DREI Stellen
 * gebraucht werden - Lehrkraft-Bereich, Kind-Bildschirm und beide Hilfen - und
 * weil ein Satz, der an drei Stellen getippt wird, an zwei davon veraltet.
 */
export const RAT_VORLESEN_STATT_SCREENREADER =
  "Wer auf der Braillezeile liest, benutzt am besten die Vorlesefunktion der App " +
  "und nicht die Sprachausgabe des Screenreaders. Nur dann kann die Zeit fair " +
  "abgezogen werden - einen Screenreader sieht der Browser nicht.";

export const RAT_TEMPO_BRINGT_NICHTS =
  "Ein hohes Vorlese-Tempo bringt keinen Vorteil: Die vorgelesene Zeit wird " +
  "ohnehin abgezogen. Stell es so ein, dass du gut mitkommst.";

/**
 * ★ Dieselben zwei Sätze englisch (EN5, 19.09.2026). Sie stehen auf dem
 * Startbildschirm des Kindes UND in Lehrkraft-Bereich und Hilfe - das
 * englische „you" trägt beide Orte (Glossar §1.5), darum EINE Fassung.
 * „Vorlesefunktion der App" ⇒ *the app's own read aloud* (Glossar: Vorlesen =
 * read aloud ★), „Sprachausgabe des Screenreaders" ⇒ *your screen reader's
 * speech*, „Vorlese-Tempo" ⇒ *speech rate*.
 */
export const RAT_VORLESEN_STATT_SCREENREADER_EN =
  "If you read on a braille display, it is best to use the app's own read aloud " +
  "rather than your screen reader's speech. Only then can the read-aloud time be " +
  "taken off fairly - the browser cannot tell that a screen reader is running.";

export const RAT_TEMPO_BRINGT_NICHTS_EN =
  "A fast speech rate gives you no advantage: the read-aloud time is taken off " +
  "anyway. Set it to a speed you can follow comfortably.";

/**
 * ★ E11a-5 (26.09.2026): dieselben zwei Sätze französisch - neu geschrieben,
 * „tu" (sie stehen auf dem Startbildschirm des Kindes). Glossar §9.2:
 * „plage braille", „lecteur d'écran", „lecture à voix haute".
 */
export const RAT_VORLESEN_STATT_SCREENREADER_FR =
  "Si tu lis sur une plage braille, utilise plutôt la lecture à voix haute de " +
  "l'application que la voix de ton lecteur d'écran. C'est la seule façon de retirer " +
  "le temps de lecture de manière juste - le navigateur ne voit pas le lecteur d'écran.";

export const RAT_TEMPO_BRINGT_NICHTS_FR =
  "Une lecture très rapide ne donne aucun avantage : le temps de lecture est " +
  "retiré de toute façon. Règle-la pour pouvoir bien suivre.";

/** ★ ES-O (27.09.2026): dieselben zwei Sätze spanisch, tú (Startbildschirm des Kindes). */
export const RAT_VORLESEN_STATT_SCREENREADER_ES =
  "Si lees en una línea braille, usa mejor la lectura en voz alta de la aplicación " +
  "que la voz de tu lector de pantalla. Solo así se puede descontar el tiempo de " +
  "lectura de forma justa - el navegador no ve el lector de pantalla.";

export const RAT_TEMPO_BRINGT_NICHTS_ES =
  "Una lectura muy rápida no te da ninguna ventaja: el tiempo de lectura se " +
  "descuenta de todos modos. Ponla a una velocidad que puedas seguir bien.";

/** ★ O-IT (02.10.2026): dieselben zwei Sätze italienisch, tu (Startbildschirm des Kindes). */
export const RAT_VORLESEN_STATT_SCREENREADER_IT =
  "Se leggi su un display braille, usa piuttosto la lettura ad alta voce dell'app " +
  "che la voce del tuo lettore di schermo. Solo così il tempo di lettura si può " +
  "togliere in modo giusto - il browser non vede il lettore di schermo.";

export const RAT_TEMPO_BRINGT_NICHTS_IT =
  "Una lettura molto veloce non dà nessun vantaggio: il tempo di lettura viene " +
  "tolto comunque. Regolala in modo da seguire bene.";

/** ★ O-PL (02.10.2026): dieselben zwei Sätze polnisch, ty (Startbildschirm des Kindes). */
export const RAT_VORLESEN_STATT_SCREENREADER_PL =
  "Jeśli czytasz na monitorze brajlowskim, używaj raczej czytania na głos w tym " +
  "programie niż mowy swojego czytnika ekranu. Tylko wtedy czas czytania można odjąć " +
  "sprawiedliwie - przeglądarka nie widzi czytnika ekranu.";

export const RAT_TEMPO_BRINGT_NICHTS_PL =
  "Szybkie tempo mowy nie daje żadnej przewagi: czas czytania i tak jest odejmowany. " +
  "Ustaw je tak, żeby wygodnie nadążać.";

/** ★ O-TR (02.10.2026): dieselben zwei Sätze türkisch, sen (Startbildschirm des Kindes). */
export const RAT_VORLESEN_STATT_SCREENREADER_TR =
  "Braille ekranda okuyorsan ekran okuyucunun sesi yerine bu programın sesli " +
  "okumasını kullan. Okuma süresi ancak o zaman adil biçimde düşülebilir - tarayıcı " +
  "ekran okuyucuyu göremez.";

export const RAT_TEMPO_BRINGT_NICHTS_TR =
  "Konuşma hızını yüksek tutmak sana avantaj sağlamaz: okuma süresi her durumda " +
  "düşülür. Rahatça takip edebileceğin bir hız seç.";

/** ★ O-CS (03.10.2026): dieselben zwei Sätze tschechisch, ty (Startbildschirm des Kindes), ohne Vergangenheit. */
export const RAT_VORLESEN_STATT_SCREENREADER_CS =
  "Pokud čteš na braillském řádku, používej raději předčítání v této aplikaci než " +
  "hlas svého odečítače obrazovky. Jen tak se dá čas čtení spravedlivě odečíst - " +
  "prohlížeč odečítač obrazovky nevidí.";

export const RAT_TEMPO_BRINGT_NICHTS_CS =
  "Rychlé předčítání ti žádnou výhodu nepřinese: čas čtení se odečítá tak jako tak. " +
  "Nastav si rychlost řeči, kterou pohodlně stíháš sledovat.";

/**
 * ★★ E11a-5 (Leitfaden, Falle 30): eine TABELLE statt `sprache === "en" ? … :
 * Deutsch` - die Ternäre gab für „fr" still die deutschen Sätze.
 */
const RAT_VORLESEN: Record<BedienSprache, { stattScreenreader: string; tempoBringtNichts: string }> = mitRueckfallEn({
  de: {
    stattScreenreader: RAT_VORLESEN_STATT_SCREENREADER,
    tempoBringtNichts: RAT_TEMPO_BRINGT_NICHTS,
  },
  en: {
    stattScreenreader: RAT_VORLESEN_STATT_SCREENREADER_EN,
    tempoBringtNichts: RAT_TEMPO_BRINGT_NICHTS_EN,
  },
  fr: {
    stattScreenreader: RAT_VORLESEN_STATT_SCREENREADER_FR,
    tempoBringtNichts: RAT_TEMPO_BRINGT_NICHTS_FR,
  },
  es: {
    stattScreenreader: RAT_VORLESEN_STATT_SCREENREADER_ES,
    tempoBringtNichts: RAT_TEMPO_BRINGT_NICHTS_ES,
  },
  it: {
    stattScreenreader: RAT_VORLESEN_STATT_SCREENREADER_IT,
    tempoBringtNichts: RAT_TEMPO_BRINGT_NICHTS_IT,
  },
  pl: {
    stattScreenreader: RAT_VORLESEN_STATT_SCREENREADER_PL,
    tempoBringtNichts: RAT_TEMPO_BRINGT_NICHTS_PL,
  },
  tr: {
    stattScreenreader: RAT_VORLESEN_STATT_SCREENREADER_TR,
    tempoBringtNichts: RAT_TEMPO_BRINGT_NICHTS_TR,
  },
  cs: {
    stattScreenreader: RAT_VORLESEN_STATT_SCREENREADER_CS,
    tempoBringtNichts: RAT_TEMPO_BRINGT_NICHTS_CS,
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    stattScreenreader:
      "Ако четеш на брайлов дисплей, използвай по-добре четенето на глас в това приложение, а не гласа на " +
      "екранния си четец. Само така времето за четене може да се извади честно - браузърът не вижда екранния четец.",
    tempoBringtNichts:
      "По-бързото четене на глас не ти дава предимство: времето за четене се изважда така или иначе. " +
      "Избери скорост на речта, която следиш спокойно.",
  },
  el: {
    stattScreenreader:
      "Αν διαβάζεις σε οθόνη Braille, χρησιμοποίησε καλύτερα την ανάγνωση φωναχτά αυτής της εφαρμογής και όχι τη φωνή " +
      "του αναγνώστη οθόνης σου. Μόνο έτσι αφαιρείται δίκαια ο χρόνος ανάγνωσης - ο φυλλομετρητής δεν βλέπει τον αναγνώστη οθόνης.",
    tempoBringtNichts:
      "Η γρήγορη ανάγνωση δεν σου δίνει κανένα πλεονέκτημα: ο χρόνος ανάγνωσης αφαιρείται έτσι κι αλλιώς. " +
      "Διάλεξε μια ταχύτητα ομιλίας που παρακολουθείς άνετα.",
  },
  hu: {
    stattScreenreader:
      "Ha Braille-kijelzőn olvasol, inkább ennek az alkalmazásnak a felolvasását használd, ne a képernyőolvasód " +
      "hangját. Csak így lehet az olvasási időt igazságosan levonni - a böngésző nem látja a képernyőolvasót.",
    tempoBringtNichts:
      "A gyors felolvasás nem ad előnyt: az olvasási időt így is, úgy is levonjuk. " +
      "Olyan beszédsebességet állíts be, amelyet kényelmesen követni tudsz.",
  },
  nl: {
    stattScreenreader:
      "Lees je op een brailleleesregel, gebruik dan liever het voorlezen van deze app dan de stem van je " +
      "schermlezer. Alleen zo kan de leestijd eerlijk worden afgetrokken - de browser ziet de schermlezer niet.",
    tempoBringtNichts:
      "Sneller voorlezen levert je geen voordeel op: de leestijd wordt hoe dan ook afgetrokken. " +
      "Kies een spreeksnelheid die je rustig kunt volgen.",
  },
  pt: {
    stattScreenreader:
      "Se lês numa linha braille, usa de preferência a leitura em voz alta desta aplicação e não a voz do teu " +
      "leitor de ecrã. Só assim o tempo de leitura pode ser descontado de forma justa - o navegador não vê o leitor de ecrã.",
    tempoBringtNichts:
      "Ler em voz alta mais depressa não te dá vantagem: o tempo de leitura é descontado de qualquer forma. " +
      "Escolhe uma velocidade de fala que consigas acompanhar com calma.",
  },
  br: {
    stattScreenreader:
      "Se você lê numa linha braille, use de preferência a leitura em voz alta deste aplicativo e não a voz do seu " +
      "leitor de tela. Só assim o tempo de leitura pode ser descontado de forma justa - o navegador não vê o leitor de tela.",
    tempoBringtNichts:
      "Ler em voz alta mais rápido não traz vantagem: o tempo de leitura é descontado de qualquer jeito. " +
      "Escolha uma velocidade de fala que você consiga acompanhar com calma.",
  },
  ro: {
    stattScreenreader:
      "Dacă citești pe un afișaj Braille, folosește mai bine citirea cu voce tare a acestei aplicații decât vocea " +
      "cititorului tău de ecran. Doar așa timpul de citire poate fi scăzut corect - browserul nu vede cititorul de ecran.",
    tempoBringtNichts:
      "Citirea mai rapidă nu îți aduce niciun avantaj: timpul de citire se scade oricum. " +
      "Alege o viteză a vocii pe care o poți urmări în liniște.",
  },
  sv: {
    stattScreenreader:
      "Om du läser på en punktskriftsskärm, använd hellre uppläsningen i den här appen än rösten i din " +
      "skärmläsare. Bara då kan lästiden räknas av rättvist - webbläsaren ser inte skärmläsaren.",
    tempoBringtNichts:
      "Snabbare uppläsning ger dig ingen fördel: lästiden räknas av ändå. " +
      "Välj en talhastighet som du lugnt hinner följa.",
  },
  uk: {
    stattScreenreader:
      "Якщо ти читаєш на брайлівському дисплеї, краще користуйся читанням уголос у цьому застосунку, а не голосом " +
      "свого екранного читача. Лише так час читання можна чесно відняти - браузер не бачить екранного читача.",
    tempoBringtNichts:
      "Швидше читання уголос не дає тобі переваги: час читання віднімається в будь-якому разі. " +
      "Вибери швидкість мовлення, за якою тобі зручно стежити.",
  },
});

/** Die zwei Sätze in der Bedienungssprache - ohne Angabe Deutsch. */
export function ratVorlesen(sprache: BedienSprache = "de"): {
  stattScreenreader: string;
  tempoBringtNichts: string;
} {
  return RAT_VORLESEN[sprache];
}

/**
 * ★★★ DAS HÄKCHEN „VORLESEN BEI PRÜFUNGEN ERLAUBT" IST SEIT 11.09.2026 (D4)
 * ABGESCHAFFT - Johannes: *„schaff das Häkchen ab, es verwirrt nur."* Die App
 * liest in der Tippchallenge jetzt vor, wenn ein Kind sein eigenes Vorlesen
 * eingeschaltet hat, genau wie beim Üben - keine zweite Einstellung mehr.
 *
 * Diese Zeichenkette bleibt als BENENNUNG bestehen, weil `scripts/erzeuge-
 * tastenflow-handbuch.mts` sie an vielen Stellen zitiert (der Text dort
 * beschreibt derzeit noch das abgeschaffte Häkchen und muss beim Nachziehen
 * des Handbuchs mit umgebaut werden). `TypingAccount.vorlesenPruefung` gibt
 * es am Server weiter (alte Datensätze) - die App liest das Feld nirgends
 * mehr.
 */
export const VORLESEN_ERLAUBT_WORT = "Vorlesen bei Prüfungen erlaubt";

// ── Niveaus ─────────────────────────────────────────────────────────────────

/**
 * Die Tastaturniveaus der Schreibprobe - *„von grundreie bis alles"*.
 *
 * Sie sind DIESELBEN Landmarken wie die Startpunkte im Lehrkraft-Menü
 * (`letters.startPoints()`), nur ohne den Anfängerpunkt „nur F und J": Auf zwei
 * Tasten lässt sich keine Schreibprobe schreiben.
 */
export type ProbenNiveau =
  | "start"
  | "gross"
  | "buchstaben"
  | "satz"
  | "zahlen"
  | "alles"
  | "code"
  | "eigen";

/**
 * ⚠️ „eigen" (Tippchallenge mit eigener Datei, 17.09.2026) steht ABSICHTLICH
 * NICHT in dieser Liste. `PROBEN_NIVEAUS` ist die Grundlage der Text-ROTATION
 * (`verbrauchtAusEinstellungen`/`zeigerAusEinstellungen` iterieren nur
 * darüber) UND der Fortschritts-Reihenfolge in den eigenen Wächtern (jedes
 * Niveau ein STRENGER Zeichen-Obermenge des vorigen). Eine eigene Datei ist
 * beides nicht - sie hat keine Bank von 15 Texten, über die zu rotieren wäre,
 * und keinen festen Zeichenvorrat, der „mehr als Programmcode" wäre. Genau
 * DIESES Fernbleiben ist der Grund, warum `naechsterStart` für „eigen" ganz
 * ohne Sonderfall auskommt (siehe dort): Ohne Eintrag in `PROBEN_NIVEAUS`
 * bekommt „eigen" nie einen Zeiger und nie eine Verbrauchsliste - jede
 * Challenge mit einer eigenen Datei beginnt darum von selbst an deren Anfang.
 */
export const PROBEN_NIVEAUS: readonly ProbenNiveau[] = [
  "start",
  "gross",
  "buchstaben",
  "satz",
  "zahlen",
  "alles",
  "code",
];

/**
 * ★ E9 (24.09.2026): Welche Niveaus haben auf Weg „en" schon eine ECHTE,
 * gefüllte Bank von 15 Texten (Bauplan §5, §10 Etappe E7)?
 *
 * `start` und `gross` sind erzeugt (wie ihre deutschen Geschwister, siehe
 * `scripts/erzeuge-schreibproben-start-en.mts`/`-gross-en.mts`). `code` hat
 * jetzt eine EIGENE englische Bank (`texteCodeEnA.ts`/`texteCodeEnB.ts`) -
 * vorher teilte sie sich mit Weg „de" und enthielt darum echte ä/ö/ü sowie
 * Zeichen, deren Griff zwischen US- und UK-Tastatur wechselt
 * (`" @ # £ $ \ | ~ ^ \``, siehe `GRIFF_VERSCHIEDEN` in
 * `scripts/pruefe-schreibproben.mts`). Die neue Bank ist eigens geschrieben,
 * mit vier statt zehn Sprachen (die übrigen brauchen für jede Zeichenkette
 * ein doppeltes Anführungszeichen) und ohne jedes dieser Zeichen - siehe den
 * Dateikopf von `texteCodeEnA.ts`.
 *
 * Die übrigen vier (`buchstaben`, `satz`, `zahlen`, `alles`) sind vorbereitete
 * LEERE Dateien für E7b (Schreibende Chargen) - siehe `schreibproben/index.ts`
 * und die dortigen `texte*En.ts`-Platzhalter.
 */
export const EN_NIVEAUS_GEFUELLT: ReadonlySet<ProbenNiveau> = new Set(["start", "gross", "buchstaben", "satz", "zahlen", "alles", "code"]);

/**
 * ★ E13a (26.09.2026): Welche Niveaus haben auf Weg „fr" schon eine ECHTE,
 * gefüllte Bank von 15 Texten (Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §7.1, §14 Etappe E13, Teil 1)?
 *
 * Nur `start` („Rangée de base + e") und `gross` („Premières lettres") sind
 * erzeugt (wie ihre deutschen/englischen Geschwister, siehe
 * `scripts/erzeuge-schreibproben-start-fr.mts`/`-gross-fr.mts`). Die übrigen
 * fünf (`buchstaben`, `satz`, `zahlen`, `alles`, `code`) sind auf „fr" LEERE
 * Platzhalterdateien für eine spätere Etappe (E13b) - siehe
 * `schreibproben/index.ts` und die dortigen `texte*Fr.ts`-Platzhalter.
 *
 * ★ E13b-1 (26.09.2026): `buchstaben` („Toutes les lettres") ist jetzt
 * GESCHRIEBEN - 15 französische Texte in `texteBuchstabenFrA.ts`/`…FrB.ts`
 * (Bauplan §7.1: „geschrieben / Originale").
 *
 * ★ E13b-2 (26.09.2026): `satz` („+ ponctuation") ist gefüllt - 15
 * geschriebene Texte in `texteSatzFrA.ts`/`texteSatzFrB.ts`.
 *
 * ★ E13b-3 (26.09.2026): `zahlen` („+ chiffres") ist gefüllt - 15
 * geschriebene Texte in `texteZahlenFrA.ts`/`texteZahlenFrB.ts`.
 *
 * ★ E13b-4 (26.09.2026): `alles` („Toutes les touches") ist gefüllt - 15
 * geschriebene Texte in `texteAllesFrA.ts`/`texteAllesFrB.ts`, nur mit
 * Sonderzeichen, die auf allen drei Pflicht-Tastaturen einen Griff haben.
 *
 * ★ E13b-5 (26.09.2026): `code` („Code") ist gefüllt - 15 selbst
 * geschriebene, ausgeführte Programme (Python, JavaScript, SQL) mit
 * französischen Bezeichnern und Kommentaren in `texteCodeFrA.ts`/
 * `texteCodeFrB.ts`. Damit hat Weg „fr" alle sieben Niveaus.
 */
export const FR_NIVEAUS_GEFUELLT: ReadonlySet<ProbenNiveau> = new Set(["start", "gross", "buchstaben", "satz", "zahlen", "alles", "code"]);

/**
 * ★★★★★ ES-P7a-Behebung (27.09.2026, M7, Prüfbericht Fundament es): Welche
 * Niveaus haben auf Weg „es" schon eine ECHTE, gefüllte Bank von 15 Texten?
 *
 * Sieben Niveaus - ALLE gefüllt (seit ES-R0, 27.09.2026): `buchstaben`
 * („Todas las letras"), `satz` („Con puntuación"), `zahlen` („Números"),
 * `alles` („Todo") - siehe `texteBuchstabenEs.ts`/`texteSatzEs.ts`/
 * `texteZahlenEs.ts`/`texteAllesEs.ts` und ihre Wächter
 * `tests/tastenflow-reto-es-*.test.ts`.
 *
 * ★ ES-Reto-Code (27.09.2026): `code` („Código informático") ist gefüllt -
 * 15 selbst geschriebene, ausgeführte Programme (Python, JavaScript, SQLite)
 * mit spanischen Bezeichnern und Kommentaren in `texteCodeEsA.ts`/
 * `texteCodeEsB.ts`, Wächter `tests/tastenflow-reto-es-code.test.ts`.
 *
 * ★★★★★ ES-R0 (27.09.2026): `start` („Fila guía") und `gross" („Primeras
 * letras") sind jetzt EBENFALLS gefüllt - erzeugt wie ihre französischen
 * Geschwister (`scripts/erzeuge-schreibproben-start-es.mts`/
 * `-gross-es.mts`), 15 Texte je Niveau, siehe `texteStartEs.ts`/
 * `texteGrossEs.ts` und `BEFUND-2026-09-27-ES-R0-RETO-START.md`. Damit hat
 * Weg „es" als erster Weg NACH „de" alle sieben Niveaus wirklich gefüllt.
 */
export const ES_NIVEAUS_GEFUELLT: ReadonlySet<ProbenNiveau> = new Set([
  "start",
  "gross",
  "buchstaben",
  "satz",
  "zahlen",
  "alles",
  "code",
]);

/**
 * ★★★★★ IT-RETO (02.10.2026): Welche Niveaus haben auf Weg „it" schon eine ECHTE, gefüllte Bank von 15 Texten
 * (Auftrag „IT-RETO start/gross", `BEFUND-2026-10-02-IT-RETO-START-GROSS-WOERTER.md`)?
 *
 * Alle sieben. Zwei ERZEUGT (wie auf „es"/„fr"): `start` („Riga di base", `texteStartIt.ts`) und `gross` („Prime
 * lettere", `texteGrossIt.ts`), siehe `scripts/erzeuge-schreibproben-start-it.mts`/`-gross-it.mts`. Fünf GESCHRIEBEN
 * (`buchstaben`, `satz`, `zahlen`, `alles`, `code`), eingehängt am 03.10.2026 (IT-RETO-VERDRAHTEN).
 *
 * ★ EIN NIVEAU EINHÄNGEN, sobald seine Bank-Datei da ist - zwei Zeilen, ein Wächter fängt das Vergessen:
 *   1. HIER die auskommentierte Zeile des Niveaus freischalten (`"buchstaben"`, …);
 *   2. in `schreibproben/index.ts` im Zweig `lernweg === "it"` den `case` des Niveaus freischalten.
 * Danach `npx tsx scripts/erzeuge-schreibproben-woerter-it.mts <niveau>` (die Vorlese-Wörter) und
 * `npx tsx scripts/pruefe-schreibproben.mts <niveau>`. Der Wächter `tests/tastenflow-reto-it-start-gross.test.ts`
 * (Abschnitt „Einhängen") schlägt an, wenn eine der zwei Stellen fehlt. Ein Niveau OHNE Bank bleibt draussen: es wird
 * im Auswahlmenü der Lehrkraft nicht angeboten und `ladeTexte` liefert für „it" dort NICHTS - nie still die
 * englischen Texte (der `RÜCKFALL-EN` von G2b-2 gilt für „it" nicht mehr).
 */
export const IT_NIVEAUS_GEFUELLT: ReadonlySet<ProbenNiveau> = new Set<ProbenNiveau>([
  "start",
  "gross",
  // ★ IT-RETO-VERDRAHTEN (03.10.2026): die fünf GESCHRIEBENEN Bänke sind eingehängt - jede mit eigenem Wächter
  // (`tests/tastenflow-reto-it-<niveau>.test.ts`), gegeneinander, gegen den Korpus und die Serien sauber
  // (`tests/tastenflow-reto-it-verdrahtet.test.ts`, `BEFUND-2026-10-02-IT-RETO-VERDRAHTET.md`). Weg „it" ist damit
  // wie „es" auf allen sieben Niveaus gefüllt - und bleibt unsichtbar, solange der Weg selbst abgeschaltet ist.
  "buchstaben",
  "satz",
  "zahlen",
  "alles",
  "code",
]);

/**
 * ★★★★★ TR-RETO (10.10.2026): Welche Niveaus haben auf Weg „tr" schon eine ECHTE, gefüllte Bank von 15 Texten
 * (türkisch „Sınav"/Tippchallenge; Vorbild: {@link IT_NIVEAUS_GEFUELLT}, Befund `BEFUND-2026-10-10-TR-RETO.md`)?
 *
 * ★ EIN NIVEAU EINHÄNGEN - zwei Stellen, ein Wächter fängt das Vergessen:
 *   1. HIER die Zeile des Niveaus freischalten;
 *   2. in `schreibproben/index.ts` im Zweig `lernweg === "tr"` den `case` des Niveaus freischalten.
 * Danach `npx tsx scripts/erzeuge-schreibproben-woerter-tr.mts <niveau>` (die Vorlese-Wörter) und
 * `npx tsx scripts/pruefe-schreibproben.mts <niveau>`. Ein Niveau OHNE Bank bleibt draussen: es wird im Auswahlmenü
 * der Lehrkraft nicht angeboten und `ladeTexte` liefert für „tr" dort NICHTS - nie still die englischen Texte.
 */
export const TR_NIVEAUS_GEFUELLT: ReadonlySet<ProbenNiveau> = new Set<ProbenNiveau>([
  // TR-RETO: alle sieben Bänke eingehängt (10.10.2026).
  "start",
  "gross",
  "buchstaben",
  "satz",
  "zahlen",
  "alles",
  "code",
]);

/**
 * ★★★★★ CS-RETO (10.10.2026): Welche Niveaus haben auf Weg „cs" schon eine ECHTE, gefüllte Bank von 15 Texten
 * (tschechisch „Výzva", `PRUEFUNG_WORT_CS`; Befund `BEFUND-2026-10-10-CS-RETO.md`)? Wie „it": ein Niveau ohne Bank wird
 * im Menü nicht angeboten und `ladeTexte` liefert dort NICHTS - nie still die englischen Texte.
 *
 * ★ EIN NIVEAU EINHÄNGEN, sobald seine Bank-Datei da ist - zwei Stellen, ein Wächter fängt das Vergessen:
 *   1. HIER die Zeile des Niveaus freischalten;
 *   2. in `schreibproben/index.ts` im Zweig `lernweg === "cs"` den `case` des Niveaus freischalten.
 * Danach `npx tsx scripts/erzeuge-schreibproben-woerter-cs.mts` (Vorlese-Wörter aus der Belegliste) und
 * `npx tsx scripts/pruefe-schreibproben.mts <niveau>`.
 */
export const CS_NIVEAUS_GEFUELLT: ReadonlySet<ProbenNiveau> = new Set<ProbenNiveau>([
  // CS-RETO-start: eingehängt (10.10.2026)
  "start",
  // CS-RETO-gross: eingehängt (10.10.2026)
  "gross",
  // CS-RETO-buchstaben: eingehängt (10.10.2026)
  "buchstaben",
  // CS-RETO-satz: eingehängt (10.10.2026)
  "satz",
  // CS-RETO-zahlen: eingehängt (10.10.2026)
  "zahlen",
  // CS-RETO-alles: eingehängt (10.10.2026)
  "alles",
  // CS-RETO-code: eingehängt (10.10.2026)
  "code",
]);

/**
 * ★★★★★ PL-RETO (09.10.2026): Welche Niveaus haben auf Weg „pl" eine ECHTE, gefüllte Bank von 15 Texten
 * (`BEFUND-2026-10-09-PL-RETO.md`)? Alle sieben, nach dem Vorbild von „it":
 * zwei ERZEUGT - `start` („Rząd podstawowy", `texteStartPl.ts`) und `gross` („Pierwsze litery", `texteGrossPl.ts`),
 * siehe `scripts/erzeuge-schreibproben-start-pl.mts`/`-gross-pl.mts` -, fünf GESCHRIEBEN (`buchstaben`, `satz`,
 * `zahlen`, `alles`, `code`, je `texte<Niveau>PlA.ts`/`…PlB.ts`, Wächter `tests/tastenflow-reto-pl-<niveau>.test.ts`).
 * Der Name der Tippchallenge ist auf Polnisch „Wyzwanie" (Glossar Z 174).
 *
 * Ein Niveau OHNE Bank bliebe draussen (Menü, `ladeTexte` liefert `[]`) - nie still die englischen Texte: der
 * `RÜCKFALL-EN` von G2b-2 gilt für „pl" nicht mehr. Der Weg selbst bleibt hinter `?polnisch-lehrgang=1` unsichtbar.
 * Einhängen eines Niveaus: hier UND in `schreibproben/index.ts` (`ladeTexte`, Zweig „pl") - der Wächter
 * `tests/tastenflow-reto-pl-verdrahtet.test.ts` prüft, dass beide Stellen zusammenpassen.
 */
export const PL_NIVEAUS_GEFUELLT: ReadonlySet<ProbenNiveau> = new Set<ProbenNiveau>([
  "start",
  "gross",
  "buchstaben",
  "satz",
  "zahlen",
  "alles",
  "code",
]);

/**
 * Hat dieses Niveau auf diesem Weg eine echte Bank, aus der eine Klasse
 * wirklich eine Tippchallenge starten kann? „eigen" hat nie eine Bank (der
 * Text kommt aus der Datei, siehe {@link SchreibprobePlan.eigeneDateiId}) und
 * gilt darum immer als verfügbar. Weg „de" hat auf allen sieben Bank-Niveaus
 * seit jeher 15 Texte.
 *
 * ★ E13a: VORHER fiel jeder Weg ausser „de" hier auf {@link EN_NIVEAUS_GEFUELLT}
 * zurück, EGAL ob „en" oder „fr" gemeint war - für „fr" hätte das (weil die
 * englische Liste inzwischen alle sieben Niveaus enthält) sämtliche Niveaus
 * als „gefüllt" gemeldet, obwohl „fr" heute nur zwei wirklich hat. Jeder Weg
 * bekommt jetzt seine EIGENE Liste.
 *
 * ★★★★★ M7: „es" bekommt ebenfalls seine eigene Liste ({@link ES_NIVEAUS_GEFUELLT})
 * statt auf die englische zurückzufallen - NIE ein Rückfall auf eine andere
 * Sprache (Prüfbericht M7, Bauplan §2.3).
 */
export function niveauHatBank(niveau: ProbenNiveau, lernweg: Lernweg): boolean {
  if (niveau === "eigen") return true;
  if (lernweg === "de") return true;
  if (lernweg === "fr") return FR_NIVEAUS_GEFUELLT.has(niveau);
  if (lernweg === "es") return ES_NIVEAUS_GEFUELLT.has(niveau);
  // ★ IT-RETO (02.10.2026): „it" bekommt ebenfalls seine eigene Liste ({@link IT_NIVEAUS_GEFUELLT}) - der Rückfall
  // auf die englische Liste (alle sieben Niveaus „gefüllt") entfällt.
  if (lernweg === "it") return IT_NIVEAUS_GEFUELLT.has(niveau);
  // ★ TR-RETO (10.10.2026): „tr" ebenso - eigene Liste ({@link TR_NIVEAUS_GEFUELLT}), kein Rückfall auf Englisch.
  if (lernweg === "tr") return TR_NIVEAUS_GEFUELLT.has(niveau);
  // ★ CS-RETO (10.10.2026): „cs" hat ebenfalls eine eigene Liste ({@link CS_NIVEAUS_GEFUELLT}).
  if (lernweg === "cs") return CS_NIVEAUS_GEFUELLT.has(niveau);
  // ★ PL-RETO (09.10.2026): „pl" ebenfalls mit eigener Liste ({@link PL_NIVEAUS_GEFUELLT}) - kein Rückfall auf Englisch.
  if (lernweg === "pl") return PL_NIVEAUS_GEFUELLT.has(niveau);
  // ★ G3c-VERTEILER (25.10.2026): ein Gerüst-Weg mit eigener Bank bietet nur die Niveaus an, für die er einen Lader hat.
  const geruest = geruestBank(lernweg);
  if (geruest) return geruest.texte[niveau] !== undefined;
  return EN_NIVEAUS_GEFUELLT.has(niveau);
}

/**
 * ★★★ W2b (28.09.2026, Weg je Kind): AUS WELCHEM WEG EIN KIND SEINEN
 * CHALLENGE-TEXT BEKOMMT - in einer gemischten Klasse.
 *
 * Bis hierher schrieb die ganze Klasse den Text des PLANS (Weg der Klasse,
 * Bauplan englischer Lehrgang §5.3). Seit die Lehrkraft den Weg je Kind
 * einstellt, sitzt in einer Klasse auf Weg „de" auch ein Kind auf Weg „fr" -
 * es bekäme deutsche Texte auf seiner französischen Tastatur, und das
 * verbietet Entscheidung Nr. 18 („nie Deutsch auf fr/es"). Auch umgekehrt
 * passt es nicht: Die Niveaus („Grundreihe", „erste Buchstaben") sind Tasten
 * EINER Tastatur, der Text eines anderen Weges liegt auf fremden Tasten.
 *
 * Die Regel: Steht das Kind auf einem ANDEREN Weg als der Plan, schreibt es
 * dasselbe NIVEAU aus der Bank SEINES Weges (alle vier Wege haben alle sieben
 * Niveaus gefüllt). Ausnahmen: „eigen" (die Datei der Lehrkraft gilt für alle,
 * sie hat sie bewusst gewählt) und ein Niveau ohne Bank auf dem Weg des Kindes
 * (dann der Plan, wie bisher). Kinder auf dem Weg der Klasse: unverändert.
 * Gewertet wird wie immer je Kind (Leistungswert aus Zeichen, Fehlern, Zeit);
 * die Rangliste vergleicht also dasselbe Niveau, nicht denselben Wortlaut.
 */
export function textWegFuerKind(
  planWeg: Lernweg,
  kindWeg: Lernweg,
  niveau: ProbenNiveau | null | undefined,
): Lernweg {
  if (!niveau || niveau === "eigen" || kindWeg === planWeg) return planWeg;
  return niveauHatBank(niveau, kindWeg) ? kindWeg : planWeg;
}

export interface NiveauDef {
  key: ProbenNiveau;
  /** Volle Beschriftung im Auswahlmenü der Lehrkraft. */
  label: string;
  /** Kurzform für Tabellen, Mail und Braillezeile. */
  kurz: string;
  /**
   * Die Einheiten, die in diesem Niveau vorkommen dürfen - in der
   * Einführungsreihenfolge, inklusive `⇧`, wenn die Umschalttaste dazugehört.
   *
   * ⚠️ **Bewusst OHNE Tastatur-Filter** (`onlyExistingKeys`): Die Prüfungstexte
   * werden EINMAL geschrieben und gelten für alle. Würde der erlaubte Satz von
   * der eingestellten Tastatur abhängen, hätte dasselbe Niveau je nach Gerät
   * einen anderen Umfang - und der Wächter, der die Texte prüft, hinge daran,
   * auf welchem Rechner er gerade läuft.
   */
  einheiten: readonly string[];
  /** Ist die Umschalttaste in diesem Niveau gelernt? */
  shift: boolean;
  /** Was hier neu dazukommt - ein Satz für die Lehrkraft. */
  erklaerung: string;
  /**
   * ★ EN5 (19.09.2026): dieselben drei Texte englisch. Das Niveau heisst dort
   * *key range* (Glossar §3.7) - „Home row" … „All keys". Gelesen über
   * {@link niveauTexte}, nie direkt, damit Deutsch der Weg ohne Angabe bleibt.
   */
  en: { label: string; kurz: string; erklaerung: string };
  /**
   * ★ E11a-5 (26.09.2026): dieselben drei Texte französisch - „niveau de
   * touches", die Namen wie in `LehrerHilfe.fr.tsx`/`MeineKlasseHilfe.fr.tsx`
   * („Rangée de base" … „Toutes les touches"). Gelesen über {@link niveauTexte}.
   */
  fr: { label: string; kurz: string; erklaerung: string };
  /** ★ ES-O (27.09.2026): dieselben Wörter spanisch (Bauplan §6). */
  es: { label: string; kurz: string; erklaerung: string };
  /** ★ O-IT (02.10.2026): dieselben Wörter italienisch (Glossar §2.3 „tasti usati"). */
  it: { label: string; kurz: string; erklaerung: string };
  /** ★ O-PL (02.10.2026): dieselben Wörter polnisch (Glossar §2.3 „używane klawisze"). */
  pl: { label: string; kurz: string; erklaerung: string };
  /** ★ O-TR (02.10.2026): dieselben Wörter türkisch (Glossar §2.3 "kullanılan tuşlar"). */
  tr: { label: string; kurz: string; erklaerung: string };
  /** ★ O-CS (03.10.2026): dieselben Wörter tschechisch (Glossar §2.3 „použité klávesy"). */
  cs: { label: string; kurz: string; erklaerung: string };
  /** ★ O2-LIB (29.10.2026): dieselben Wörter in den neun Sprachen des Gerüsts (Glossare 25.10.2026 §2.3). */
  bg: { label: string; kurz: string; erklaerung: string };
  el: { label: string; kurz: string; erklaerung: string };
  hu: { label: string; kurz: string; erklaerung: string };
  nl: { label: string; kurz: string; erklaerung: string };
  pt: { label: string; kurz: string; erklaerung: string };
  br: { label: string; kurz: string; erklaerung: string };
  ro: { label: string; kurz: string; erklaerung: string };
  sv: { label: string; kurz: string; erklaerung: string };
  uk: { label: string; kurz: string; erklaerung: string };
  /** Zeilenlänge, in der die Texte dieses Niveaus geschrieben sind (Zeichen). */
  zeileVon: number;
  zeileBis: number;
  /**
   * Zeichen, die es ZUSÄTZLICH zu {@link einheiten} geben darf.
   *
   * Bisher braucht das nur „Programmcode": Der Unterstrich `_` steht in keiner
   * Lern-Einheit (er ist Umschalt + Bindestrich), gehört aber in fast jeden
   * Bezeichner. Die App kennt ihn vollständig - rechter kleiner Finger, mit
   * Umschalt - er ist nur nie eigens eingeführt worden.
   */
  extra?: readonly string[];
}

/**
 * Die Niveaus eines Weges, aus seiner Einführungsreihenfolge gebaut.
 *
 * ★ E1 (24.09.2026): vorher eine feste Liste über die deutschen Konstanten;
 * seither je Lernweg. Auf Weg „de" wortgleich wie vorher (Wächter
 * `tastenflow-lernweg-de-unveraendert.test.ts`). ⚠️ E7: Die englischen Texte
 * dieser Liste (`en: …`) beschreiben heute noch die deutsche Reihenfolge.
 */
function baueNiveauDefs(
  weg: LernwegDef,
  lernweg: Lernweg,
  grundreihe: DefiGrundreihe | undefined,
): readonly NiveauDef[] {
  /*
   * ★ M4 (Mechanik-Prüfung fr, 27.09.2026): Auf Weg „fr" gilt die Folge DER
   * GEWÄHLTEN Grundreihe - Schweiz-Französisch/Luxemburg `a … é`, Kanada
   * `a … ;` statt AZERTY `q … m` (`achteGrundtasteFuerLayout`). Vorher
   * rechnete jedes Niveau aus der AZERTY-Folge; auf ch-fr stand „q m" in der
   * Rangée de base, und „Premières lettres" reichte bis zum „b".
   * Ungefiltert wie bisher (siehe `einheiten`): auf den fünf fr-Tastaturen
   * gibt es jede der 72 Einheiten.
   */
  /*
   * ★★★★★ D-1 (28.09.2026): die Niveaus der Tippchallenge werden in der
   * STARTPUNKT-ZÄHLUNG gebaut (Reihenfolge vor D-1, `weg.startpunktFolge`) -
   * sie sind Landmarken wie die Startpunkte („Alle Buchstaben", „mit
   * Satzzeichen"), keine Freischalt-Folge. In der neuen Folge stünde die
   * erste Satzzeichen-Stelle direkt nach ⇧, und „Alle Buchstaben" hätte nur
   * noch die Buchstaben vor der Umschalttaste gemeint. Die 105 Prüfungstexte
   * und jede laufende Challenge gelten damit unverändert.
   */
  const INTRO_ORDER: readonly string[] =
    lernweg === "fr" && grundreihe
      ? achteGrundtasteFuerLayout(weg.startpunktFolge, "fr", DEFI_GRUNDREIHE_VERTRETER[grundreihe])
      : weg.startpunktFolge;
  const HOME_ROW_LETTERS = weg.homeRowLetters;
  const PUNCT_ORDER = weg.punctOrder;
  const SYMBOL_ORDER = weg.symbolOrder;
  /** Die ersten `n` Einheiten der Einführungsreihenfolge (ungefiltert, siehe oben). */
  const bis = (n: number): readonly string[] => INTRO_ORDER.slice(0, n);
  /*
   * ★ M4: Die Grenzen AM WERT, nicht an der Stelle (Falle 41). Vorher hiess
   * „mit Satzzeichen" `ALLE_BUCHSTABEN + PUNCT_ORDER.length` - auf Kanada
   * steht „;" schon in der Grundreihe, der Block ist eins kürzer, und die
   * Rechnung griff eine Ziffer mit. Auf de/en/AZERTY rechnerisch gleich
   * (Wächter `tastenflow-*-unveraendert*`, `tastenflow-defi-fr-tastaturen`).
   */
  const PUNKT = new Set(PUNCT_ORDER);
  const ZIFFER = new Set(weg.digitOrder);
  const letzteStelle = (menge: ReadonlySet<string>): number => {
    let i = -1;
    INTRO_ORDER.forEach((u, j) => {
      if (j >= HOME_ROW_LETTERS && menge.has(u)) i = j;
    });
    return i;
  };
  const NACH_SHIFT = INTRO_ORDER.indexOf(SHIFT_UNIT) + 1;
  const ALLE_BUCHSTABEN = INTRO_ORDER.findIndex((u, j) => j >= HOME_ROW_LETTERS && PUNKT.has(u));
  const MIT_SATZZEICHEN = letzteStelle(PUNKT) + 1;
  const MIT_ZAHLEN = letzteStelle(ZIFFER) + 1;
  /** Die Tasten der Grundreihe und die Buchstaben bis zur Umschalttaste - aus DIESER Folge. */
  const GRUNDREIHE = bis(HOME_ROW_LETTERS);
  const VOR_SHIFT = INTRO_ORDER.slice(HOME_ROW_LETTERS, NACH_SHIFT - 1);
  /*
   * ★ M4: Auf Weg „fr" gehört die neunte Einheit („e") zur Rangée de base -
   * das Etikett sagte es seit S5 („+ e"), die Einheiten nicht; ein Défi-Text
   * war darum mit den Einheiten seines eigenen Niveaus nicht tippbar.
   */
  const START_EINHEITEN = lernweg === "fr" ? bis(HOME_ROW_LETTERS + 1) : GRUNDREIHE;
  /*
   * Nur Weg „fr": die neunte Einheit aus der Folge, und auf Kanada nur die
   * Buchstaben der Grundreihe („;" liegt dort, ist aber kein Buchstabe - die
   * Texte haben es nicht). Die anderen Wege behalten ihren französischen
   * Wortlaut Byte für Byte (Golden „en").
   */
  const NEUNTE = lernweg === "fr" ? INTRO_ORDER[HOME_ROW_LETTERS] : "e";
  const GRUNDREIHE_BUCHSTABEN =
    lernweg === "fr" ? GRUNDREIHE.filter((u) => u.toLowerCase() !== u.toUpperCase()) : GRUNDREIHE;
  const ohneSatzzeichen = GRUNDREIHE_BUCHSTABEN.length < GRUNDREIHE.length;
  return [
    {
      key: "start",
      label: `Grundreihe (${GRUNDREIHE.join(" ")})`,
      kurz: "Grundreihe",
      einheiten: START_EINHEITEN,
      shift: false,
      erklaerung: "Nur die acht Tasten der Grundstellung, alles klein geschrieben.",
      en: {
        label: `Home row (${GRUNDREIHE.join(" ")})`,
        kurz: "Home row",
        erklaerung: "Only the eight keys of the home position, all in small letters.",
      },
      fr: {
        // ★ S5 (Mechanik-Prüfung fr, 26.09.2026): die Texte dieses Niveaus haben
        // NEUN Tasten - die Grundreihe und „e" (AZERTY hat keinen Vokal in der
        // Grundreihe, `scripts/pruefe-schreibproben.mts`). Etikett und Erklärung
        // sagten „huit touches".
        // ★ M4: Tasten und neunte Einheit aus der Folge DIESER Grundreihe. Auf
        // Kanada nennt das Etikett nur die Buchstaben - „;" ist Grundtaste,
        // aber kein Buchstabe, und die Texte haben es nicht.
        label: `Rangée de base + ${NEUNTE} (${GRUNDREIHE_BUCHSTABEN.join(" ")} ${NEUNTE})`,
        kurz: `Rangée de base + ${NEUNTE}`,
        erklaerung: ohneSatzzeichen
          ? `Les lettres de la position de départ et le ${NEUNTE}, tout en minuscules - sans le point-virgule, qui n'est pas une lettre.`
          : `Les huit touches de la position de départ et le ${NEUNTE}, tout en minuscules.`,
      },
      es: {
        label: `Fila guía (${GRUNDREIHE.join(" ")})`,
        kurz: "Fila guía",
        erklaerung: "Solo las ocho teclas de la posición inicial, todo en minúsculas.",
      },
      it: {
        label: `Riga di base (${GRUNDREIHE.join(" ")})`,
        kurz: "Riga di base",
        erklaerung: "Solo gli otto tasti della posizione base, tutto in minuscolo.",
      },
      // ★ O-PL (02.10.2026): nur die Wörter - Einheiten unverändert.
      pl: {
        label: `Rząd podstawowy (${GRUNDREIHE.join(" ")})`,
        kurz: "Rząd podstawowy",
        erklaerung: "Tylko osiem klawiszy pozycji podstawowej, wszystko małymi literami.",
      },
      // ★ O-TR (02.10.2026): nur die Wörter - Einheiten unverändert (Glossar §2.3 "kullanılan tuşlar").
      tr: {
        label: `Temel sıra (${GRUNDREIHE.join(" ")})`,
        kurz: "Temel sıra",
        erklaerung: "Yalnızca temel konumdaki sekiz tuş, hepsi küçük harf.",
      },
      // ★ O-CS (03.10.2026): nur die Wörter - Einheiten unverändert (Glossar §2.3 „použité klávesy").
      cs: {
        label: `Základní řada (${GRUNDREIHE.join(" ")})`,
        kurz: "Základní řada",
        erklaerung: "Jen osm kláves základního postavení, všechno malými písmeny.",
      },
      zeileVon: 20,
      zeileBis: 32,
      // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
      bg: {
        label: `Основен ред (${GRUNDREIHE.join(" ")})`,
        kurz: "Основен ред",
        erklaerung: "Само осемте клавиша на изходната позиция, всичко с малки букви.",
      },
      el: {
        label: `Βασική σειρά (${GRUNDREIHE.join(" ")})`,
        kurz: "Βασική σειρά",
        erklaerung: "Μόνο τα οκτώ πλήκτρα της βασικής θέσης, όλα με μικρά γράμματα.",
      },
      hu: {
        label: `Alapsor (${GRUNDREIHE.join(" ")})`,
        kurz: "Alapsor",
        erklaerung: "Csak az alapállás nyolc billentyűje, minden kisbetűvel.",
      },
      nl: {
        label: `Basisrij (${GRUNDREIHE.join(" ")})`,
        kurz: "Basisrij",
        erklaerung: "Alleen de acht toetsen van de basishouding, alles in kleine letters.",
      },
      pt: {
        label: `Fila de base (${GRUNDREIHE.join(" ")})`,
        kurz: "Fila de base",
        erklaerung: "Só as oito teclas da posição inicial, tudo em minúsculas.",
      },
      br: {
        label: `Fileira central (${GRUNDREIHE.join(" ")})`,
        kurz: "Fileira central",
        erklaerung: "Só as oito teclas da posição inicial, tudo em letras minúsculas.",
      },
      ro: {
        label: `Șirul de bază (${GRUNDREIHE.join(" ")})`,
        kurz: "Șirul de bază",
        erklaerung: "Doar cele opt taste ale poziției de bază, totul cu litere mici.",
      },
      sv: {
        label: `Grundraden (${GRUNDREIHE.join(" ")})`,
        kurz: "Grundraden",
        erklaerung: "Bara de åtta tangenterna i grundställningen, allt med små bokstäver.",
      },
      uk: {
        label: `Основний ряд (${GRUNDREIHE.join(" ")})`,
        kurz: "Основний ряд",
        erklaerung: "Лише вісім клавіш основного положення, усе малими літерами.",
      },
    },
    {
      key: "gross",
      label: "Erste Buchstaben + Großschreibung",
      kurz: "Erste Buchstaben",
      einheiten: bis(NACH_SHIFT),
      shift: true,
      erklaerung: `Die Grundreihe und ${VOR_SHIFT.join(" ")}, dazu die Umschalttaste.`,
      en: {
        label: "First letters + capitals",
        kurz: "First letters",
        erklaerung: `The home row and ${VOR_SHIFT.join(" ")}, plus the Shift key.`,
      },
      fr: {
        label: "Premières lettres + majuscules",
        kurz: "Premières lettres",
        erklaerung: `La rangée de base et ${VOR_SHIFT.join(" ")}, avec la touche Maj.`,
      },
      es: {
        label: "Primeras letras + mayúsculas",
        kurz: "Primeras letras",
        erklaerung: `La fila guía y ${VOR_SHIFT.join(" ")}, más la tecla Mayús.`,
      },
      it: {
        label: "Prime lettere + maiuscole",
        kurz: "Prime lettere",
        erklaerung: `La riga di base e ${VOR_SHIFT.join(" ")}, più il tasto Maiusc.`,
      },
      pl: {
        label: "Pierwsze litery + wielkie litery",
        kurz: "Pierwsze litery",
        erklaerung: `Rząd podstawowy i ${VOR_SHIFT.join(" ")}, do tego klawisz Shift.`,
      },
      tr: {
        label: "İlk harfler + büyük harfler",
        kurz: "İlk harfler",
        erklaerung: `Temel sıra ve ${VOR_SHIFT.join(" ")}, ayrıca Shift tuşu.`,
      },
      cs: {
        label: "První písmena + velká písmena",
        kurz: "První písmena",
        erklaerung: `Základní řada a ${VOR_SHIFT.join(" ")}, k tomu klávesa Shift.`,
      },
      zeileVon: 24,
      zeileBis: 38,
      // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
      bg: {
        label: "Първи букви + главни букви",
        kurz: "Първи букви",
        erklaerung: `Основният ред и ${VOR_SHIFT.join(" ")}, плюс клавиша Shift.`,
      },
      el: {
        label: "Πρώτα γράμματα + κεφαλαία",
        kurz: "Πρώτα γράμματα",
        erklaerung: `Η βασική σειρά και ${VOR_SHIFT.join(" ")}, μαζί με το πλήκτρο Shift.`,
      },
      hu: {
        label: "Első betűk + nagybetűk",
        kurz: "Első betűk",
        erklaerung: `Az alapsor és ${VOR_SHIFT.join(" ")}, hozzá a Shift billentyű.`,
      },
      nl: {
        label: "Eerste letters + hoofdletters",
        kurz: "Eerste letters",
        erklaerung: `De basisrij en ${VOR_SHIFT.join(" ")}, plus de Shift-toets.`,
      },
      pt: {
        label: "Primeiras letras + maiúsculas",
        kurz: "Primeiras letras",
        erklaerung: `A fila de base e ${VOR_SHIFT.join(" ")}, mais a tecla Shift.`,
      },
      br: {
        label: "Primeiras letras + maiúsculas",
        kurz: "Primeiras letras",
        erklaerung: `A fileira central e ${VOR_SHIFT.join(" ")}, mais a tecla Shift.`,
      },
      ro: {
        label: "Primele litere + majuscule",
        kurz: "Primele litere",
        erklaerung: `Șirul de bază și ${VOR_SHIFT.join(" ")}, plus tasta Shift.`,
      },
      sv: {
        label: "Första bokstäverna + versaler",
        kurz: "Första bokstäverna",
        erklaerung: `Grundraden och ${VOR_SHIFT.join(" ")}, plus Skift-tangenten.`,
      },
      uk: {
        label: "Перші літери + великі літери",
        kurz: "Перші літери",
        erklaerung: `Основний ряд і ${VOR_SHIFT.join(" ")}, а також клавіша Shift.`,
      },
    },
    {
      key: "buchstaben",
      label: "Alle Buchstaben (mit Großschreibung)",
      kurz: "Alle Buchstaben",
      einheiten: bis(ALLE_BUCHSTABEN),
      shift: true,
      erklaerung: "Das ganze Alphabet - noch ohne Satzzeichen und ohne Zahlen.",
      en: {
        label: "All letters (with capitals)",
        kurz: "All letters",
        erklaerung: "The whole alphabet - no punctuation or numbers yet.",
      },
      fr: {
        label: "Toutes les lettres (avec majuscules)",
        kurz: "Toutes les lettres",
        erklaerung: "Tout l'alphabet - encore sans ponctuation ni chiffres.",
      },
      es: {
        label: "Todas las letras (con mayúsculas)",
        kurz: "Todas las letras",
        erklaerung: "Todo el alfabeto - todavía sin signos de puntuación ni números.",
      },
      it: {
        label: "Tutte le lettere (con maiuscole)",
        kurz: "Tutte le lettere",
        erklaerung: "Tutto l'alfabeto - ancora senza punteggiatura e senza numeri.",
      },
      pl: {
        label: "Wszystkie litery (z wielkimi)",
        kurz: "Wszystkie litery",
        erklaerung: "Cały alfabet - jeszcze bez znaków interpunkcyjnych i bez cyfr.",
      },
      tr: {
        label: "Tüm harfler (büyük harflerle)",
        kurz: "Tüm harfler",
        erklaerung: "Alfabenin tamamı - henüz noktalama işaretleri ve rakamlar yok.",
      },
      cs: {
        label: "Všechna písmena (i velká)",
        kurz: "Všechna písmena",
        erklaerung: "Celá abeceda - zatím bez interpunkce a bez číslic.",
      },
      zeileVon: 28,
      zeileBis: 40,
      // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
      bg: {
        label: "Всички букви (и главни)",
        kurz: "Всички букви",
        erklaerung: "Цялата азбука - още без препинателни знаци и цифри.",
      },
      el: {
        label: "Όλα τα γράμματα (και κεφαλαία)",
        kurz: "Όλα τα γράμματα",
        erklaerung: "Όλο το αλφάβητο - ακόμη χωρίς σημεία στίξης και αριθμούς.",
      },
      hu: {
        label: "Minden betű (nagybetűvel is)",
        kurz: "Minden betű",
        erklaerung: "Az egész ábécé - még írásjelek és számok nélkül.",
      },
      nl: {
        label: "Alle letters (ook hoofdletters)",
        kurz: "Alle letters",
        erklaerung: "Het hele alfabet - nog zonder leestekens en cijfers.",
      },
      pt: {
        label: "Todas as letras (com maiúsculas)",
        kurz: "Todas as letras",
        erklaerung: "O alfabeto inteiro - ainda sem pontuação nem números.",
      },
      br: {
        label: "Todas as letras (com maiúsculas)",
        kurz: "Todas as letras",
        erklaerung: "O alfabeto inteiro - ainda sem pontuação nem números.",
      },
      ro: {
        label: "Toate literele (și majuscule)",
        kurz: "Toate literele",
        erklaerung: "Tot alfabetul - încă fără semne de punctuație și fără cifre.",
      },
      sv: {
        label: "Alla bokstäver (även versaler)",
        kurz: "Alla bokstäver",
        erklaerung: "Hela alfabetet - ännu utan skiljetecken och siffror.",
      },
      uk: {
        label: "Усі літери (і великі)",
        kurz: "Усі літери",
        erklaerung: "Уся абетка - ще без розділових знаків і цифр.",
      },
    },
    {
      key: "satz",
      label: "+ Satzzeichen",
      kurz: "Mit Satzzeichen",
      einheiten: bis(MIT_SATZZEICHEN),
      shift: true,
      erklaerung: `Alle Buchstaben und ${PUNCT_ORDER.join(" ")}`,
      en: {
        label: "+ punctuation",
        kurz: "With punctuation",
        erklaerung: `All letters and ${PUNCT_ORDER.join(" ")}`,
      },
      fr: {
        label: "+ ponctuation",
        kurz: "Avec ponctuation",
        erklaerung: `Toutes les lettres et ${PUNCT_ORDER.join(" ")}`,
      },
      es: {
        label: "+ signos de puntuación",
        kurz: "Con puntuación",
        erklaerung: `Todas las letras y ${PUNCT_ORDER.join(" ")}`,
      },
      it: {
        label: "Con punteggiatura",
        kurz: "Con punteggiatura",
        erklaerung: `Tutte le lettere e ${PUNCT_ORDER.join(" ")}`,
      },
      pl: {
        label: "Z interpunkcją",
        kurz: "Z interpunkcją",
        erklaerung: `Wszystkie litery i ${PUNCT_ORDER.join(" ")}`,
      },
      tr: {
        label: "Noktalama ile",
        kurz: "Noktalama ile",
        erklaerung: `Tüm harfler ve ${PUNCT_ORDER.join(" ")}`,
      },
      cs: {
        label: "S interpunkcí",
        kurz: "S interpunkcí",
        erklaerung: `Všechna písmena a ${PUNCT_ORDER.join(" ")}`,
      },
      zeileVon: 30,
      zeileBis: 40,
      // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
      bg: {
        label: "+ препинателни знаци",
        kurz: "С препинателни знаци",
        erklaerung: `Всички букви и ${PUNCT_ORDER.join(" ")}`,
      },
      el: {
        label: "+ σημεία στίξης",
        kurz: "Με σημεία στίξης",
        erklaerung: `Όλα τα γράμματα και ${PUNCT_ORDER.join(" ")}`,
      },
      hu: {
        label: "+ írásjelek",
        kurz: "Írásjelekkel",
        erklaerung: `Minden betű és ${PUNCT_ORDER.join(" ")}`,
      },
      nl: {
        label: "+ leestekens",
        kurz: "Met leestekens",
        erklaerung: `Alle letters en ${PUNCT_ORDER.join(" ")}`,
      },
      pt: {
        label: "+ pontuação",
        kurz: "Com pontuação",
        erklaerung: `Todas as letras e ${PUNCT_ORDER.join(" ")}`,
      },
      br: {
        label: "+ pontuação",
        kurz: "Com pontuação",
        erklaerung: `Todas as letras e ${PUNCT_ORDER.join(" ")}`,
      },
      ro: {
        label: "+ semne de punctuație",
        kurz: "Cu semne de punctuație",
        erklaerung: `Toate literele și ${PUNCT_ORDER.join(" ")}`,
      },
      sv: {
        label: "+ skiljetecken",
        kurz: "Med skiljetecken",
        erklaerung: `Alla bokstäver och ${PUNCT_ORDER.join(" ")}`,
      },
      uk: {
        label: "+ розділові знаки",
        kurz: "З розділовими знаками",
        erklaerung: `Усі літери і ${PUNCT_ORDER.join(" ")}`,
      },
    },
    {
      key: "zahlen",
      label: "+ Zahlen",
      kurz: "Mit Zahlen",
      einheiten: bis(MIT_ZAHLEN),
      shift: true,
      erklaerung: "Alles bisherige und die Ziffernreihe 1 bis 0.",
      en: {
        label: "+ numbers",
        kurz: "With numbers",
        erklaerung: "Everything so far plus the number row, 1 to 0.",
      },
      fr: {
        label: "+ chiffres",
        kurz: "Avec chiffres",
        erklaerung: "Tout ce qui précède et la rangée des chiffres, de 1 à 0.",
      },
      es: {
        label: "+ números",
        kurz: "Con números",
        erklaerung: "Todo lo anterior y la fila de los números, del 1 al 0.",
      },
      it: {
        label: "Con numeri",
        kurz: "Con numeri",
        erklaerung: "Tutto quello che c'era prima e la riga dei numeri, da 1 a 0.",
      },
      pl: {
        label: "Z cyframi",
        kurz: "Z cyframi",
        erklaerung: "Wszystko dotychczasowe i rząd cyfr od 1 do 0.",
      },
      tr: {
        label: "Sayılarla",
        kurz: "Sayılarla",
        erklaerung: "Önceki her şey ve sayı sırası (1 2 3 4 5 6 7 8 9 0).",
      },
      // ★ O-CS (03.10.2026): auf der tschechischen Tastatur kommen die Ziffern
      // MIT Shift (Glossar §4 Falle 1) - der Satz sagt es, und er endet nicht
      // mit einer Ziffer vor dem Punkt (Falle 4).
      cs: {
        label: "S číslicemi",
        kurz: "S číslicemi",
        erklaerung: "Vše dosavadní a k tomu číslice - na české klávesnici se píšou s klávesou Shift.",
      },
      zeileVon: 30,
      zeileBis: 40,
      // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
      bg: {
        label: "+ цифри",
        kurz: "С цифри",
        erklaerung: "Всичко досега и редът с цифрите, от 1 до 0.",
      },
      el: {
        label: "+ αριθμοί",
        kurz: "Με αριθμούς",
        erklaerung: "Όλα όσα υπήρχαν και η σειρά αριθμών, από 1 έως 0.",
      },
      hu: {
        label: "+ számok",
        kurz: "Számokkal",
        erklaerung: "Minden eddigi és a számsor, 1-től 0-ig.",
      },
      nl: {
        label: "+ cijfers",
        kurz: "Met cijfers",
        erklaerung: "Alles tot nu toe plus de cijferrij, 1 tot 0.",
      },
      pt: {
        label: "+ números",
        kurz: "Com números",
        erklaerung: "Tudo o que veio antes e a fila dos números, de 1 a 0.",
      },
      br: {
        label: "+ números",
        kurz: "Com números",
        erklaerung: "Tudo o que veio antes e a fileira dos números, de 1 a 0.",
      },
      ro: {
        label: "+ cifre",
        kurz: "Cu cifre",
        erklaerung: "Tot ce a fost până acum și șirul de cifre, de la 1 la 0.",
      },
      sv: {
        label: "+ siffror",
        kurz: "Med siffror",
        erklaerung: "Allt hittills plus sifferraden, 1 till 0.",
      },
      uk: {
        label: "+ цифри",
        kurz: "З цифрами",
        erklaerung: "Усе попереднє і ряд цифр, від 1 до 0.",
      },
    },
    {
      key: "alles",
      label: "Alles (auch Sonderzeichen)",
      kurz: "Alles",
      einheiten: INTRO_ORDER,
      shift: true,
      erklaerung: `Der volle Zeichenvorrat, auch ${SYMBOL_ORDER.slice(0, 8).join(" ")} und die übrigen Sonderzeichen.`,
      en: {
        label: "All keys (symbols too)",
        kurz: "All keys",
        erklaerung: `Every character, including ${SYMBOL_ORDER.slice(0, 8).join(" ")} and the other symbols.`,
      },
      fr: {
        label: "Toutes les touches (symboles aussi)",
        kurz: "Toutes les touches",
        erklaerung: `Tous les caractères, y compris ${SYMBOL_ORDER.slice(0, 8).join(" ")} et les autres symboles.`,
      },
      es: {
        label: "Todas las teclas (también símbolos)",
        kurz: "Todas las teclas",
        erklaerung: `Todos los caracteres, también ${SYMBOL_ORDER.slice(0, 8).join(" ")} y los demás símbolos.`,
      },
      it: {
        label: "Tutti i tasti (anche simboli)",
        kurz: "Tutti i tasti",
        erklaerung: `Tutti i caratteri, anche ${SYMBOL_ORDER.slice(0, 8).join(" ")} e gli altri simboli.`,
      },
      pl: {
        label: "Wszystkie klawisze (także symbole)",
        kurz: "Wszystkie klawisze",
        erklaerung: `Wszystkie znaki, także ${SYMBOL_ORDER.slice(0, 8).join(" ")} i pozostałe symbole.`,
      },
      tr: {
        label: "Tüm tuşlar (simgeler de)",
        kurz: "Tüm tuşlar",
        erklaerung: `Tüm karakterler: ${SYMBOL_ORDER.slice(0, 8).join(" ")} ve diğer simgeler de.`,
      },
      cs: {
        label: "Všechny klávesy (i symboly)",
        kurz: "Všechny klávesy",
        erklaerung: `Všechny znaky, také ${SYMBOL_ORDER.slice(0, 8).join(" ")} a další speciální znaky.`,
      },
      zeileVon: 30,
      zeileBis: 40,
      // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
      bg: {
        label: "Всички клавиши (и символите)",
        kurz: "Всички клавиши",
        erklaerung: `Всички знаци, включително ${SYMBOL_ORDER.slice(0, 8).join(" ")} и останалите символи.`,
      },
      el: {
        label: "Όλα τα πλήκτρα (και σύμβολα)",
        kurz: "Όλα τα πλήκτρα",
        erklaerung: `Όλοι οι χαρακτήρες, μαζί με ${SYMBOL_ORDER.slice(0, 8).join(" ")} και τα άλλα σύμβολα.`,
      },
      hu: {
        label: "Minden billentyű (szimbólumok is)",
        kurz: "Minden billentyű",
        erklaerung: `Minden karakter, köztük ${SYMBOL_ORDER.slice(0, 8).join(" ")} és a többi szimbólum.`,
      },
      nl: {
        label: "Alle toetsen (ook symbolen)",
        kurz: "Alle toetsen",
        erklaerung: `Elk teken, ook ${SYMBOL_ORDER.slice(0, 8).join(" ")} en de andere symbolen.`,
      },
      pt: {
        label: "Todas as teclas (também símbolos)",
        kurz: "Todas as teclas",
        erklaerung: `Todos os carateres, incluindo ${SYMBOL_ORDER.slice(0, 8).join(" ")} e os outros símbolos.`,
      },
      br: {
        label: "Todas as teclas (também símbolos)",
        kurz: "Todas as teclas",
        erklaerung: `Todos os caracteres, incluindo ${SYMBOL_ORDER.slice(0, 8).join(" ")} e os outros símbolos.`,
      },
      ro: {
        label: "Toate tastele (și simbolurile)",
        kurz: "Toate tastele",
        erklaerung: `Toate caracterele, inclusiv ${SYMBOL_ORDER.slice(0, 8).join(" ")} și celelalte simboluri.`,
      },
      sv: {
        label: "Alla tangenter (även symboler)",
        kurz: "Alla tangenter",
        erklaerung: `Alla tecken, även ${SYMBOL_ORDER.slice(0, 8).join(" ")} och de andra symbolerna.`,
      },
      uk: {
        label: "Усі клавіші (і символи)",
        kurz: "Усі клавіші",
        erklaerung: `Усі знаки, зокрема ${SYMBOL_ORDER.slice(0, 8).join(" ")} та інші символи.`,
      },
    },
    {
      /**
       * ★★★ PROGRAMMCODE (10.09.2026, Wunsch Johannes: *„da brauchen wir noch
       * eine besonders anspruchsvolle textserie, Programmcode … nimm echten code
       * von opensource projekten"*).
       *
       * Das schwerste Niveau, und zwar aus einem anderen Grund als „alles": Nicht
       * der Zeichenvorrat ist grösser, sondern die DICHTE. In Prosa sind rund
       * sieben Prozent der Zeichen Sonderzeichen, in Code das Drei- bis Vierfache
       * - und sie stehen in Ketten (`});`, `=>`, `!==`), in denen kein Wort mehr
       * hilft, den nächsten Anschlag zu erraten.
       *
       * ⚠️ ZWEI ZEICHEN FEHLEN, und beide fehlen mit Absicht:
       *  • **kein Backslash `\`** - auf der deutschen Tastatur sitzt er auf
       *    AltGr + ß, und **die ß-Taste gibt es auf der Schweizer Tastatur
       *    nicht**. Ein Text mit Backslash wäre dort nicht schreibbar. Also
       *    keine Maskierungen in Zeichenketten.
       *  • **kein Backtick `` ` ``** - den gibt es auf der deutschen Tastatur
       *    überhaupt nicht (nur als Totaste ´). Also keine Vorlagen-Zeichenketten
       *    in JavaScript.
       * Beides ist eine echte Einschränkung an die Auswahl des Codes, keine an
       * die Kinder.
       */
      key: "code",
      label: "Programmcode",
      kurz: "Programmcode",
      einheiten: INTRO_ORDER,
      /*
       * ★ ES-Reto-Code (27.09.2026): Auf Weg „es" ist der Apostroph KEINE
       * Einheit des Lehrgangs (Bauplan §4.3) - eine SQL-Zeichenkette braucht
       * ihn aber (`'Quito'`; doppelte Anführungszeichen sind in SQLite ein
       * Spaltenname). Er liegt auf `es` und `latam` auf derselben Taste rechts
       * neben der 0 - wie `_` auf „de" ein Zeichen, das nur dieses Niveau
       * mitbringt. Die anderen Wege bleiben Byte für Byte.
       */
      extra: lernweg === "es" ? ["_", "'"] : ["_"],
      shift: true,
      erklaerung:
        "Echter Quelltext aus offenen Projekten, in zehn Programmiersprachen - " +
        "dieselben Zeichen wie beim Niveau Alles, aber viel dichter.",
      en: {
        label: "Program code",
        kurz: "Program code",
        erklaerung:
          "Real source code from open-source projects, in ten programming languages - " +
          "the same characters as “All keys”, but far more tightly packed.",
      },
      // ★★★★★ (27.09.2026) fr/es sind ANDERS als de/en: dort ist der Code
      // ECHTER Quelltext aus zehn Sprachen von echten Open-Source-Projekten
      // (Johannes' Wunsch vom 10.09.2026, siehe oben) - die Beschreibung
      // stimmte dafür. Die Bänke „fr" (BEFUND-2026-09-26-E13B5-DEFI-CODE.md)
      // und „es" (BEFUND-2026-09-27-ES-RETO-CODE.md) sind dagegen SELBST
      // GESCHRIEBEN, nicht von echten Projekten übernommen, und in nur DREI
      // Sprachen (Python, JavaScript, SQLite) - „dix langages"/„diez
      // lenguajes" und „vrai code … de projets libres"/„código … real de
      // proyectos libres" waren darum sachlich falsch. de/en bleiben
      // unverändert (dort stimmt beides weiter).
      fr: {
        label: "Code informatique",
        kurz: "Code informatique",
        erklaerung:
          "Des programmes écrits pour ce niveau, dans trois langages de programmation " +
          "(Python, JavaScript, SQLite) - " +
          'les mêmes caractères que "Toutes les touches", mais bien plus serrés.',
      },
      es: {
        label: "Código informático",
        kurz: "Código informático",
        erklaerung:
          "Programas escritos para este nivel, en tres lenguajes de programación " +
          "(Python, JavaScript, SQL) - " +
          'los mismos caracteres que "Todas las teclas", pero mucho más apretados.',
      },
      // ★ O-IT (02.10.2026): beschreibt die Bank der Wege „de"/„en" (echter
      // Quelltext, zehn Sprachen) - eine italienische Lehrkraft verwaltet bis zu
      // Etappe T Klassen auf diesen Wegen.
      // ★ IT-RETO-VERDRAHTEN (03.10.2026): Weg „it" hat jetzt seine EIGENE Bank
      // (`texteCodeIt.ts`) - selbst geschrieben, drei Sprachen (Python,
      // JavaScript, SQL), wie „fr"/„es". Für DIESEN Weg wäre „vero codice … in
      // dieci linguaggi" sachlich falsch (Befund IT-RETO-CODE §8 Nr. 2); für eine
      // italienische Lehrkraft einer Klasse auf „de"/„en" stimmt es weiter.
      // Name „Codice" bleibt (Glossar Z 160).
      it: {
        label: "Codice",
        kurz: "Codice",
        erklaerung:
          lernweg === "it"
            ? "Programmi scritti per questo livello, in tre linguaggi di programmazione " +
              "(Python, JavaScript, SQL) - " +
              `gli stessi caratteri di "Tutti i tasti", ma molto più fitti.`
            : "Vero codice sorgente da progetti open source, in dieci linguaggi di programmazione - " +
              `gli stessi caratteri di "Tutti i tasti", ma molto più fitti.`,
      },
      // ★ O-PL (02.10.2026): wie it - beschreibt die Bank der Wege „de"/„en".
      // ★ PL-RETO (09.10.2026): Weg „pl" hat seine EIGENE Bank (`texteCodePl.ts`) - selbst geschrieben, drei Sprachen
      // (Python, JavaScript, SQL), wie „it"/„es"/„fr". Für DIESEN Weg wäre „prawdziwy kod … w dziesięciu językach"
      // sachlich falsch; für eine polnische Lehrkraft einer Klasse auf „de"/„en" stimmt es weiter. Name „Kod" bleibt.
      pl: {
        label: "Kod",
        kurz: "Kod",
        erklaerung:
          lernweg === "pl"
            ? "Programy napisane dla tego poziomu, w trzech językach programowania (Python, JavaScript, SQL) - " +
              "te same znaki co „Wszystkie klawisze”, ale dużo gęściej."
            : "Prawdziwy kod źródłowy z otwartych projektów, w dziesięciu językach programowania - " +
              "te same znaki co „Wszystkie klawisze”, ale dużo gęściej.",
      },
      // ★ O-TR (02.10.2026): wie it/pl - beschreibt die Bank der Wege "de"/"en".
      tr: {
        label: "Kod",
        kurz: "Kod",
        // ★ TR-RETO (10.10.2026): Weg "tr" hat seine EIGENE Bank (selbst geschrieben, drei Sprachen) - "on programlama dilinde"
        // wäre dafür falsch; für eine türkische Lehrkraft einer Klasse auf "de"/"en" stimmt es weiter.
        erklaerung:
          lernweg === "tr"
            ? "Bu seviye için yazılmış programlar, üç programlama dilinde (Python, JavaScript, SQL) - " +
              `"Tüm tuşlar" ile aynı karakterler, ama çok daha yoğun.`
            : "Açık kaynak projelerden gerçek kaynak kodu, on programlama dilinde - " +
              `"Tüm tuşlar" ile aynı karakterler, ama çok daha yoğun.`,
      },
      // ★ O-CS (03.10.2026): wie it/pl/tr - beschreibt die Bank der Wege „de"/„en".
      cs: {
        label: "Kód",
        kurz: "Kód",
        // ★ CS-RETO (10.10.2026): Weg „cs" hat seine EIGENE Bank (selbst geschrieben, drei Sprachen) - „v deseti jazycích"
        // wäre dafür falsch; für eine tschechische Lehrkraft einer Klasse auf „de"/„en" stimmt es weiter.
        erklaerung:
          lernweg === "cs"
            ? "Programy napsané pro tuto úroveň, ve třech programovacích jazycích (Python, JavaScript, SQL) - " +
              "stejné znaky jako u úrovně Všechny klávesy, ale mnohem hustěji."
            : "Skutečný zdrojový kód z otevřených projektů, v deseti programovacích jazycích - " +
              "stejné znaky jako u úrovně Všechny klávesy, ale mnohem hustěji.",
      },
      // ⚠️ Kurze Zeilen sind hier SINNVOLL, nicht nachlässig: `}` allein ist eine
      // vollwertige Code-Zeile. Die Vergleichbarkeit hängt darum nicht an der
      // einzelnen Zeile, sondern an der Zeichenzahl und der Zeilenzahl je Text -
      // beides prüft der Wächter.
      zeileVon: 2,
      zeileBis: 40,
      // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
      bg: {
        label: "Програмен код",
        kurz: "Програмен код",
        // ★ W3 (30.10.2026): Weg „bg" hat seine EIGENE Bank (ohne lateinische Buchstaben, die Tastatur hat keine); für eine Lehrkraft einer Klasse auf „de"/„en" stimmt der alte Satz weiter.
        erklaerung:
          lernweg === "bg"
            ? "Програми, написани за това ниво: сметки с имена на български, без нито една латинска буква - същите знаци като при нивото Всички клавиши, но много по-нагъсто."
            : "Истински програмен код от отворени проекти, на десет езика за програмиране - същите знаци като при нивото Всички клавиши, но много по-нагъсто.",
      },
      el: {
        label: "Κώδικας",
        kurz: "Κώδικας",
        // ★ W3 (30.10.2026): Weg „el" - eigene Bank, ohne λατινικά (siehe bg).
        erklaerung:
          lernweg === "el"
            ? "Προγράμματα γραμμένα για αυτό το επίπεδο: υπολογισμοί με ελληνικά ονόματα, χωρίς κανένα λατινικό γράμμα - οι ίδιοι χαρακτήρες με το επίπεδο Όλα τα πλήκτρα, αλλά πολύ πιο πυκνά."
            : "Πραγματικός κώδικας από ανοιχτά έργα, σε δέκα γλώσσες προγραμματισμού - οι ίδιοι χαρακτήρες με το επίπεδο Όλα τα πλήκτρα, αλλά πολύ πιο πυκνά.",
      },
      hu: {
        label: "Programkód",
        kurz: "Programkód",
        // ★ W3 (30.10.2026): Weg „hu" hat seine EIGENE Bank (drei Sprachen); für eine Lehrkraft einer Klasse auf „de"/„en" stimmt der alte Satz.
        erklaerung: lernweg === "hu" ? "Ehhez a szinthez írt programok, három programozási nyelven (Python, JavaScript, SQL) - ugyanazok a karakterek, mint a Minden billentyű szinten, csak sokkal sűrűbben." : "Valódi forráskód nyílt projektekből, tíz programozási nyelven - ugyanazok a karakterek, mint a Minden billentyű szinten, csak sokkal sűrűbben.",
      },
      nl: {
        label: "Programmacode",
        kurz: "Code",
        // ★ W3 (30.10.2026): Weg „nl" hat seine EIGENE Bank (drei Sprachen); für eine Lehrkraft einer Klasse auf „de"/„en" stimmt der alte Satz.
        erklaerung: lernweg === "nl" ? "Programma's die voor dit niveau zijn geschreven, in drie programmeertalen (Python, JavaScript, SQL) - dezelfde tekens als bij het niveau Alle toetsen, maar veel dichter op elkaar." : "Echte broncode uit opensourceprojecten, in tien programmeertalen - dezelfde tekens als bij het niveau Alle toetsen, maar veel dichter op elkaar.",
      },
      pt: {
        label: "Código",
        kurz: "Código",
        erklaerung: "Programas escritos para este nível, em três linguagens de programação (Python, JavaScript, SQL) - os mesmos carateres do nível Todas as teclas, mas muito mais densos.",
      },
      br: {
        label: "Código",
        kurz: "Código",
        erklaerung: "Programas escritos para este nível, em três linguagens de programação (Python, JavaScript, SQL) - os mesmos caracteres do nível Todas as teclas, mas bem mais densos.",
      },
      ro: {
        label: "Cod",
        kurz: "Cod",
        // ★ W3 (30.10.2026): Weg „ro" hat seine EIGENE Bank (drei Sprachen).
        erklaerung: lernweg === "ro" ? "Programe scrise pentru acest nivel, în trei limbaje de programare (Python, JavaScript, SQL) - aceleași caractere ca la nivelul Toate tastele, dar mult mai dese." : "Cod-sursă adevărat din proiecte deschise, în zece limbaje de programare - aceleași caractere ca la nivelul Toate tastele, dar mult mai dese.",
      },
      sv: {
        label: "Programkod",
        kurz: "Kod",
        erklaerung: "Program skrivna för den här nivån, i tre programspråk (Python, JavaScript, SQL) - samma tecken som på nivån Alla tangenter, men mycket tätare.",
      },
      uk: {
        label: "Програмний код",
        kurz: "Код",
        // ★ W3 (30.10.2026): Weg „uk" - eigene Bank, ohne lateinische Buchstaben (siehe bg).
        erklaerung:
          lernweg === "uk"
            ? "Програми, написані для цього рівня: обчислення з українськими назвами, без жодної латинської літери - ті самі знаки, що й на рівні Усі клавіші, але значно щільніше."
            : "Справжній програмний код із відкритих проєктів, десятьма мовами програмування - ті самі знаки, що й на рівні Усі клавіші, але значно щільніше.",
      },
    },
    {
      /**
       * ★★★ EIGENE DATEI (17.09.2026) - die Lehrkraft lädt einen eigenen Text
       * hoch statt eines Niveaus aus der Bank zu wählen (siehe
       * `SchreibprobePlan.eigeneDateiId`). Bewusst OHNE `PROBEN_NIVEAUS` (siehe
       * dort) - `einheiten`/`zeileVon`/`zeileBis` dienen hier nur der Anzeige
       * (z. B. der Tastatur-Darstellung), nicht der Text-Auswahl: Welche
       * Zeichen vorkommen, bestimmt die Datei, nicht dieses Niveau.
       */
      key: "eigen",
      label: "Eigene Datei",
      kurz: "Eigene Datei",
      einheiten: INTRO_ORDER,
      extra: ["_"],
      shift: true,
      erklaerung: "Der Text einer von Ihnen hochgeladenen Datei.",
      // ★ *Custom file*, nicht *your own file*: Das Kind liest dieselbe Kurzform
      // im Ergebnis, und die Datei ist nicht seine (Glossar §3.8, Eigene Übung ⇒
      // *custom exercise*).
      en: {
        label: "Custom file",
        kurz: "Custom file",
        erklaerung: "The text of a file you uploaded.",
      },
      fr: {
        label: "Fichier personnel",
        kurz: "Fichier personnel",
        erklaerung: "Le texte d'un fichier que vous avez chargé.",
      },
      es: {
        label: "Archivo propio",
        kurz: "Archivo propio",
        erklaerung: "El texto de un archivo que usted ha subido.",
      },
      it: {
        label: "File personale",
        kurz: "File personale",
        erklaerung: "Il testo di un file caricato dall'insegnante.",
      },
      pl: {
        label: "Własny plik",
        kurz: "Własny plik",
        erklaerung: "Tekst z pliku przesłanego przez osobę prowadzącą klasę.",
      },
      tr: {
        label: "Kendi dosyan",
        kurz: "Kendi dosyan",
        erklaerung: "Öğretmenin yüklediği bir dosyadaki metin.",
      },
      // ★ O-CS (03.10.2026): ohne Vergangenheit („který jste nahráli") - das Kind
      // liest dieselbe Kurzform, die Datei ist nicht seine.
      cs: {
        label: "Vlastní soubor",
        kurz: "Vlastní soubor",
        erklaerung: "Text z nahraného souboru.",
      },
      // Rein informativ (siehe oben) - `zeileUmbrechen` in `eigenerText.ts`
      // bestimmt die tatsächliche Zeilenlänge einer hochgeladenen Datei.
      zeileVon: 1,
      zeileBis: 10_000,
      // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
      bg: {
        label: "Собствен файл",
        kurz: "Собствен файл",
        erklaerung: "Текстът от качения файл.",
      },
      el: {
        label: "Δικό σου αρχείο",
        kurz: "Δικό σου αρχείο",
        erklaerung: "Το κείμενο ενός αρχείου που ανέβασες.",
      },
      hu: {
        label: "Saját fájl",
        kurz: "Saját fájl",
        erklaerung: "Egy feltöltött fájl szövege.",
      },
      nl: {
        label: "Eigen bestand",
        kurz: "Eigen bestand",
        erklaerung: "De tekst van een bestand dat je hebt geüpload.",
      },
      pt: {
        label: "Ficheiro próprio",
        kurz: "Ficheiro próprio",
        erklaerung: "O texto de um ficheiro que carregaste.",
      },
      br: {
        label: "Arquivo próprio",
        kurz: "Arquivo próprio",
        erklaerung: "O texto de um arquivo que você enviou.",
      },
      ro: {
        label: "Fișier propriu",
        kurz: "Fișier propriu",
        erklaerung: "Textul unui fișier pe care l-ai încărcat.",
      },
      sv: {
        label: "Egen fil",
        kurz: "Egen fil",
        erklaerung: "Texten i en fil som du har laddat upp.",
      },
      uk: {
        label: "Власний файл",
        kurz: "Власний файл",
        erklaerung: "Текст із завантаженого файлу.",
      },
    },
  ];
}

const NIVEAUS_JE_WEG = new Map<string, readonly NiveauDef[]>();

/**
 * Die Tastaturniveaus eines Lernweges (einmal gebaut, dann gemerkt).
 *
 * @param grundreihe ★ M4 (27.09.2026): nur auf Weg „fr" wirksam - die
 *   Grundreihen-Familie der Défi-Bank ({@link defiGrundreihe}). Fehlt sie,
 *   gilt AZERTY (Frankreich/Belgien), wie bisher. Auf „de"/„en" ohne Wirkung.
 */
export function niveauDefs(lernweg: Lernweg, grundreihe?: DefiGrundreihe): readonly NiveauDef[] {
  const gr = lernweg === "fr" ? grundreihe : undefined;
  const schluessel = `${lernweg}:${gr ?? ""}`;
  let defs = NIVEAUS_JE_WEG.get(schluessel);
  if (!defs) {
    defs = baueNiveauDefs(lernwegDef(lernweg), lernweg, gr);
    NIVEAUS_JE_WEG.set(schluessel, defs);
  }
  return defs;
}

/**
 * ★★★ M4 (Mechanik-Prüfung fr, 27.09.2026): die GRUNDREIHEN-FAMILIE einer
 * Défi-Bank auf Weg „fr". AZERTY (Frankreich, Belgien) hat `q s d f j k l m`
 * und heisst hier „kein Wert" - wie `modus`/`lernweg` im Plan wird nur das
 * Abweichende geschrieben. Schweiz-Französisch (auch Luxemburg) hat
 * `a s d f j k l é`, Kanada (CSA und „Canadien français") `a s d f j k l ;`.
 *
 * Die Niveaus „Rangée de base" und „Premières lettres" haben je Familie eine
 * EIGENE Bank (`schreibproben/index.ts`); die übrigen fünf Niveaus brauchen
 * alle Buchstaben und teilen sich die Bank. Der Défi läuft mit der Tastatur
 * der Lehrkraft beim Start ({@link SchreibprobePlan.grundreihe}) - eine
 * Klasse schreibt denselben Text.
 */
export type DefiGrundreihe = "ch" | "ca";

/** Die Tastatur, deren Folge eine Familie vertritt (ca-csa und ca-fr haben dieselbe Folge). */
const DEFI_GRUNDREIHE_VERTRETER: Record<DefiGrundreihe, LayoutId> = { ch: "ch-fr", ca: "ca-fr" };

/**
 * Die Grundreihen-Familie einer Tastatur auf einem Weg - `undefined` für
 * AZERTY und für jeden Weg ausser „fr". Andere Tastaturen mit Weg „fr"
 * (de/us/…, Prüfbericht S6) bleiben bei AZERTY wie bisher.
 */
export function defiGrundreihe(lernweg: Lernweg, layout: LayoutId | string): DefiGrundreihe | undefined {
  if (lernweg !== "fr") return undefined;
  if (layout === "ch-fr") return "ch";
  if (layout === "ca-csa" || layout === "ca-fr") return "ca";
  return undefined;
}

/** Wehrhaft lesen: nur genau „ch" oder „ca" zählt. */
export function istDefiGrundreihe(x: unknown): x is DefiGrundreihe {
  return x === "ch" || x === "ca";
}

/**
 * Die Niveaus des Weges „de" - als Konstante erhalten, weil Handbuch-Skripte
 * und Wächter sie so lesen. Wer einen Weg meint, nimmt {@link niveauDefs}.
 */
export const NIVEAU_DEFS: readonly NiveauDef[] = niveauDefs("de");

/** ★ E1: `lernweg` ist Pflicht - der Weg der Klasse bzw. des Plans. */
export function niveauDef(
  key: string | undefined | null,
  lernweg: Lernweg,
  grundreihe?: DefiGrundreihe,
): NiveauDef | null {
  return niveauDefs(lernweg, grundreihe).find((n) => n.key === key) ?? null;
}

/**
 * Beschriftung, Kurzform und Erklärung eines Niveaus in der Bedienungssprache
 * (EN5, 19.09.2026) - ohne Angabe Deutsch, also genau `label`/`kurz`/`erklaerung`.
 */
export function niveauTexte(
  def: NiveauDef,
  sprache: BedienSprache = "de",
): { label: string; kurz: string; erklaerung: string } {
  // ★ E11a-5 (Falle 30): Tabelle statt `sprache === "en" ? def.en : Deutsch`.
  const je: Record<BedienSprache, { label: string; kurz: string; erklaerung: string }> = {
    de: { label: def.label, kurz: def.kurz, erklaerung: def.erklaerung },
    en: def.en,
    fr: def.fr,
    // ★ ES-O (27.09.2026): eigene spanische Niveau-Namen.
    es: def.es,
    it: def.it,
    pl: def.pl,
    tr: def.tr,
    cs: def.cs,
    // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
    bg: def.bg,
    el: def.el,
    hu: def.hu,
    nl: def.nl,
    pt: def.pt,
    br: def.br,
    ro: def.ro,
    sv: def.sv,
    uk: def.uk,
  };
  return je[sprache];
}

/**
 * Der Zeichensatz eines Niveaus, wie ihn ein Text benutzen darf: Kleinbuchstaben,
 * Ziffern, gelernte Satz- und Sonderzeichen. Das Leerzeichen ist IMMER dabei
 * (die Leertaste ist von Anfang an gelernt), `⇧` steht NICHT drin - die
 * Umschalttaste ist keine Textzeichen, sondern eine Bedingung (`shift`).
 */
export function zeichenVorrat(
  niveau: ProbenNiveau,
  lernweg: Lernweg,
  grundreihe?: DefiGrundreihe,
): Set<string> {
  const def = niveauDef(niveau, lernweg, grundreihe);
  const set = new Set<string>([" "]);
  if (!def) return set;
  for (const e of def.einheiten) if (e !== SHIFT_UNIT) set.add(e);
  for (const e of def.extra ?? []) set.add(e);
  return set;
}

/**
 * ⚠️ Das ß ist in den Prüfungstexten VERBOTEN - auch im Niveau „alles".
 *
 * Grund: Auf der Schweizer Tastatur gibt es kein ß; die App schreibt „Straße"
 * dort richtig als „Strasse" ({@link import("./layouts").toLayoutText}). Für den
 * Lehrgang ist das genau richtig - für eine Schreibprobe wäre es ein Verstoß
 * gegen Johannes' erste Regel: Der Text hätte je nach Gerät eine andere Länge,
 * und zwei Kinder derselben Klasse bekämen verschiedene Texte.
 *
 * Ohne ß sind der deutsche und der Schweizer Text Zeichen für Zeichen derselbe.
 */
export const VERBOTEN_IN_PROBEN: readonly string[] = ["ß"];

// ── Der Plan (was die Lehrkraft einstellt) ──────────────────────────────────

export interface SchreibprobePlan {
  /** Eindeutig je Schreibprobe - Schlüssel für die Ergebnisse. */
  id: string;
  niveau: ProbenNiveau;
  /** Startzeitpunkt (ms seit 1970). Ab hier zählt das Einstiegsfenster. */
  startMs: number;
  /** Prüfungszeit je Kind in Minuten - ab dessen erstem Tastendruck. */
  dauerMin: number;
  /** 0-basierter Index des Textes innerhalb seines Niveaus (0 … 14). */
  textNr: number;
  /**
   * ★★ Ab welcher Zeile dieses Textes geschrieben wird (0-basiert). Johannes
   * 10.09.2026: Die Texte haben rund 200 Zeilen, das schnellste Kind schreibt
   * ein Viertel davon - die nächste Challenge beginnt darum dort, wo das
   * weiteste Kind der letzten aufgehört hat ({@link naechsterStart}).
   */
  startZeile: number;
  /** Zeitzuschlag in Prozent für Kinder, die ihn brauchen (0 = keiner). */
  zuschlagProzent: number;
  /** Wann die Lehrkraft sie angelegt hat (nur für die Anzeige). */
  angelegtMs: number;
  /**
   * ★★★ Die Zeile in `tt_eigene_texte`, wenn `niveau === "eigen"` ist
   * (17.09.2026) - der Text kommt dann NICHT aus der Bank
   * (`schreibproben/index.ts`), sondern aus dieser hochgeladenen Datei.
   * `textNr` ist für „eigen" immer 0 (genau ein Text), `startZeile` gilt
   * unverändert.
   */
  eigeneDateiId?: string;
  /** Nur für die Anzeige („Text: gedicht.txt") - ohne eigene Abfrage der Zeile. */
  eigeneDateiname?: string;
  /**
   * ★★★ DIE ART DER TIPPCHALLENGE (23.09.2026, „Freies Schreiben" -
   * `BAUPLAN-2026-09-23-FREIES-SCHREIBEN.md` §5, §7).
   *
   * Fehlt das Feld, gilt STRENG - wie bisher: eine falsche Taste rückt nicht
   * vor, jeder Fehlgriff zählt (`FEHLER_GEWICHT` in `schreibprobeWertung.ts`).
   * Geschrieben wird darum AUSSCHLIESSLICH `"frei"`, nie `"streng"` - ein
   * zweiter, überflüssiger Wert für denselben Normalfall würde nur die
   * 2000-Byte-Grenze von `tt_classes.settings` unnötig belasten.
   *
   * Nachgerechnet: `,"modus":"frei"` sind 15 Byte. Ein voller Plan mit
   * `eigeneDateiId`/`eigeneDateiname` UND `modus` liegt bei rund 280 Byte -
   * weit unter der Grenze (siehe `eigeneUebungReihe.ts` für die übrigen
   * Verbraucher desselben Feldes).
   *
   * Im freien Modus bleiben Fehler beim Schreiben stehen, die Rücktaste
   * bessert in der aktuellen Zeile aus, und gewertet wird ein GRÖSSERES
   * Fehlergewicht (`FEHLER_GEWICHT_FREI`), weil ein stehender Fehler - anders
   * als ein sofort ausgebesserter Fehlgriff im strengen Modus - keine eigene
   * Zeit gekostet hat. Siehe {@link istFreiesSchreiben}.
   */
  modus?: "frei";
  /**
   * ★ E1 (24.09.2026): der Lernweg, aus dem Niveau und Texte stammen (Bauplan
   * englischer Lehrgang §5.3). Fehlt das Feld, gilt „de" - jeder Plan vor E1.
   * Geschrieben wird darum nur `"en"` (wie bei `modus`: kein zweiter Wert für
   * den Normalfall, die 2000-Byte-Grenze von `tt_classes.settings`).
   * Gelesen über `lernwegVon(plan)` (lernweg.ts).
   */
  lernweg?: Lernweg;
  /**
   * ★★★ M4 (27.09.2026): die Grundreihen-Familie der Défi-Bank auf Weg „fr"
   * ({@link DefiGrundreihe}) - festgehalten beim Start, aus der Tastatur der
   * Lehrkraft. Fehlt das Feld, gilt AZERTY (jeder Plan vor M4). Geschrieben
   * wird nur „ch" oder „ca" (wie `modus`/`lernweg`: kein Wert für den
   * Normalfall). Das Kind lädt die Bank aus dem PLAN, nicht aus seinem Gerät
   * - die ganze Klasse schreibt denselben Text.
   */
  grundreihe?: DefiGrundreihe;
}

/**
 * Die verbrauchten Texte je Niveau (Johannes 09.09.2026: *„Wenn eine Klasse
 * die nächste Prüfung hat weiß das programm welcher Prüfungstext schon gewesen
 * ist und nimmt einen anderen!"*).
 *
 * ⚠️ Wird nur noch GELESEN - für Klassen, die für ein Niveau noch keinen
 * {@link ProbenZeiger} haben. Für sie beginnt die nächste Challenge am Anfang
 * des nächsten unverbrauchten Textes, genau wie bisher.
 */
export type VerbrauchteTexte = Partial<Record<ProbenNiveau, number[]>>;

// (Bis 11.09.2026 stand hier `interface SchreibprobeEinstellungen` als
// Sammel-Typ für die Schreibprobe-Anteile der Klassen-Einstellungen, entfernt
// weil ungenutzt - jede Stelle liest `schreibprobe`/`schreibprobeVerbraucht`/
// `schreibprobeZeiger` einzeln.)

/**
 * Den Plan aus den Klassen-Einstellungen lesen - **wehrhaft**.
 *
 * Dem JSON vom Server wird nichts blind geglaubt: Ein kaputter Wert darf
 * keinem Kind eine Schreibprobe vor die Nase setzen (und schon gar nicht eine,
 * die nie endet). Im Zweifel `null` - und `null` heißt „es ist keine
 * Schreibprobe geplant", also genau das bisherige Verhalten.
 */
export function planAusEinstellungen(settings: unknown): SchreibprobePlan | null {
  if (!settings || typeof settings !== "object") return null;
  const roh = (settings as { schreibprobe?: unknown }).schreibprobe;
  if (!roh || typeof roh !== "object") return null;
  const p = roh as Record<string, unknown>;

  const id = typeof p.id === "string" ? p.id.trim() : "";
  if (!id) return null;

  // ★ „eigen" steht ABSICHTLICH nicht in `PROBEN_NIVEAUS` (siehe dort) -
  // hier darum als einzige Ausnahme zugelassen, aber nur MIT einer echten
  // Datei-Id (siehe unten). Ohne diese Zeile käme aus `cls.settings`
  // zurückgelesen für „eigen" immer `null` heraus, obwohl der Plan beim
  // Schreiben korrekt war - dieselbe Falle wie beim „wehrhaften Lesen" jedes
  // anderen Feldes hier.
  const niveau = p.niveau === "eigen" ? "eigen" : PROBEN_NIVEAUS.find((n) => n === p.niveau);
  if (!niveau) return null;

  const eigeneDateiId = typeof p.eigeneDateiId === "string" ? p.eigeneDateiId.trim() : "";
  const eigeneDateiname = typeof p.eigeneDateiname === "string" ? p.eigeneDateiname : "";
  // Ein „eigen"-Plan OHNE Datei-Id ist keine gültige Challenge - er hätte
  // keinen Text, den ein Kind schreiben könnte.
  if (niveau === "eigen" && !eigeneDateiId) return null;

  const startMs = zahl(p.startMs);
  if (!(startMs > 0)) return null;

  const dauerMin = Math.round(zahl(p.dauerMin));
  if (!(dauerMin >= DAUER_MIN_KLEINST) || dauerMin > DAUER_MIN_GROESST) return null;

  // Aus demselben Grund wie in `verbrauchtAusEinstellungen`: Unsinn darf hier
  // nicht still zu 0 werden - sonst schriebe eine Klasse mit kaputtem Eintrag
  // immer Text 1.
  if (typeof p.textNr !== "number" || !Number.isFinite(p.textNr)) return null;
  const textNr = Math.round(p.textNr);
  if (!(textNr >= 0) || textNr >= PROBEN_JE_NIVEAU) return null;

  // ★ Anders als die Textnummer macht eine kaputte Startzeile KEINE Challenge
  // ungültig: Sie gilt für alle Kinder gleich, die Klasse schreibt also weiter
  // denselben Text - nur von vorne. Fehlt sie ganz (ältere Pläne), ebenso.
  const startZeile = ganzeZahlIm(p.startZeile, ZEILE_GROESST) ?? 0;

  const zuschlagRoh = Math.round(zahl(p.zuschlagProzent));
  const zuschlagProzent = Math.min(
    ZUSCHLAG_GROESST,
    Math.max(0, Number.isFinite(zuschlagRoh) ? zuschlagRoh : 0),
  );

  const angelegtMs = zahl(p.angelegtMs) || startMs;

  // ★ 23.09.2026: wehrhaft wie jedes andere Feld - ALLES ausser genau "frei"
  // (auch "streng", auch Unsinn, auch ein alter Datensatz ohne das Feld) wird
  // zu „kein modus" und damit zum strengen Verhalten von heute. Nur ein
  // exaktes „frei" schaltet den freien Modus ein.
  const modus = p.modus === "frei" ? ("frei" as const) : undefined;
  // ★ E2a: wie `modus` - ein gültiger Weg AUSSER „de" zählt (jetzt auch
  // „fr"), alles andere ist „de". Vorher: nur ein exaktes „en" zählte.
  const lernweg = istLernweg(p.lernweg) && p.lernweg !== "de" ? p.lernweg : undefined;
  // ★ M4: nur ein exaktes „ch"/„ca" UND nur auf Weg „fr" - alles andere ist AZERTY.
  const grundreihe = lernweg === "fr" && istDefiGrundreihe(p.grundreihe) ? p.grundreihe : undefined;

  return {
    id,
    niveau,
    startMs,
    dauerMin,
    textNr,
    startZeile,
    zuschlagProzent,
    angelegtMs,
    ...(eigeneDateiId ? { eigeneDateiId } : {}),
    ...(eigeneDateiname ? { eigeneDateiname } : {}),
    ...(modus ? { modus } : {}),
    ...(lernweg ? { lernweg } : {}),
    ...(grundreihe ? { grundreihe } : {}),
  };
}

/**
 * Ist dieser Plan „Freies Schreiben"? Fehlt der Plan oder das Feld, gilt
 * STRENG - der bisherige Normalfall (siehe {@link SchreibprobePlan.modus}).
 */
export function istFreiesSchreiben(plan: SchreibprobePlan | null | undefined): boolean {
  return plan?.modus === "frei";
}

/** Eine ganze Zahl von 0 bis `bis` - oder `null`, wenn es keine ist. */
function ganzeZahlIm(x: unknown, bis: number): number | null {
  if (typeof x !== "number" || !Number.isInteger(x) || x < 0 || x > bis) return null;
  return x;
}

/**
 * ★ E7a (24.09.2026): der SCHLÜSSEL in `tt_classes.settings`, unter dem die
 * Verbrauchsliste eines Weges steht (Bauplan §5.3, „neue Schlüssel nur für
 * en" - Falle 9 §11: `tt_classes.settings` hat 2000 Byte).
 *
 * ⚠️ Weg „de" bleibt beim ALTEN, unpräfigierten Schlüssel - jede heute
 * gespeicherte Klasse hat genau den, und ihn umzubenennen würfe die ganze
 * Rotation weg (`tests/tastenflow-lernweg-de-unveraendert.test.ts`). Weg „en"
 * bekommt einen ZWEITEN, eigenen Schlüssel - niemals denselben wie „de": Die
 * Textnummern der beiden Banken haben nichts miteinander zu tun, und ein
 * gemischter Eintrag würde niemandem sagen, welcher Weg gemeint war.
 *
 * ★ GEMESSEN (24.09.2026): Alle sieben Niveaus voll (Zeiger UND die alte
 * Verbrauchsliste mit allen 15 Nummern), einmal für „de" UND einmal für „en"
 * gleichzeitig in DERSELBEN Klasse - der theoretische Höchstfall - sind
 * **1.633 Byte** (`JSON.stringify`). Das lässt nur rund 370 Byte für alles
 * Übrige im 2000-Byte-Feld (den `schreibprobe`-Plan selbst - rund 280 Byte
 * laut `SchreibprobePlan.modus` -, `eigeneUebungReihe.ts` und was sonst noch
 * dort wohnt). ⚠️ Dieser Höchstfall ist aber unrealistisch: Eine Klasse
 * wechselt ihren Lernweg praktisch nie (D2), braucht also über ihr ganzes
 * Leben nur EINE der beiden Schlüsselgruppen - realistisch sind das rund
 * 820 Byte für Zeiger+Verbrauchsliste eines einzigen Weges. Wird das eng
 * (z. B. durch einen künftigen dritten Weg), ist der erste Schritt, die alte
 * Verbrauchsliste ganz zu streichen, sobald jedes Niveau einen Zeiger hat -
 * sie wird ohnehin nur noch gelesen, nie mehr geschrieben (siehe
 * {@link VerbrauchteTexte}).
 */
// ★ E2a: BEIDE Funktionen BEWUSST nicht um „fr" erweitert - ein dritter
// Feldname sprengt vermutlich die 2.000-Byte-Grenze von `tt_classes.settings`
// (Bauplan §15.6, E1 gemessen: 2.145 Byte). Gehört zu E13. „fr" teilt sich
// bis dahin den Schlüssel von „de" - harmlos, solange der Lernweg „fr" ohne
// Inhalte unerreichbar ist.
function verbrauchtSchluessel(lernweg: Lernweg): "schreibprobeVerbraucht" | "schreibprobeVerbrauchtEn" {
  return lernweg === "en" ? "schreibprobeVerbrauchtEn" : "schreibprobeVerbraucht";
}

/** Derselbe Gedanke für den Zeiger (`schreibprobeZeiger`/`schreibprobeZeigerEn"). */
function zeigerSchluessel(lernweg: Lernweg): "schreibprobeZeiger" | "schreibprobeZeigerEn" {
  return lernweg === "en" ? "schreibprobeZeigerEn" : "schreibprobeZeiger";
}

/**
 * Die Verbrauchsliste aus den Einstellungen lesen - ebenso wehrhaft.
 *
 * ★ E7a: `lernweg` ist optional - fehlt es (jeder Aufrufer vor E7a), gilt
 * „de" und damit GENAU der alte, unpräfigierte Schlüssel (byte-identisches
 * Verhalten für Weg „de").
 */
export function verbrauchtAusEinstellungen(
  settings: unknown,
  lernweg: Lernweg = "de",
): VerbrauchteTexte {
  const out: VerbrauchteTexte = {};
  if (!settings || typeof settings !== "object") return out;
  const roh = (settings as Record<string, unknown>)[verbrauchtSchluessel(lernweg)];
  if (!roh || typeof roh !== "object") return out;
  for (const niveau of PROBEN_NIVEAUS) {
    const liste = (roh as Record<string, unknown>)[niveau];
    if (!Array.isArray(liste)) continue;
    // ⚠️ NUR ECHTE ZAHLEN (Befund des eigenen Wächters, 09.09.2026).
    // `zahl()` gibt bei Unsinn 0 zurück - und 0 ist eine GÜLTIGE Textnummer.
    // Ein kaputter Eintrag hätte damit still Text 1 als „schon geschrieben"
    // vermerkt, und die Klasse hätte ihn nie bekommen.
    const nummern = liste
      .filter((x) => typeof x === "number" && Number.isFinite(x))
      .map((x) => Math.round(x as number))
      .filter((n) => Number.isInteger(n) && n >= 0 && n < PROBEN_JE_NIVEAU);
    if (nummern.length) out[niveau] = [...new Set(nummern)];
  }
  return out;
}

function zahl(x: unknown): number {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n : 0;
}

// ── Texte: wie viele, wie lang, welcher als nächster ────────────────────────

/** So viele Prüfungstexte gibt es je Niveau (Vorgabe Johannes). */
export const PROBEN_JE_NIVEAU = 15;

/**
 * So viele Zeichen hat mindestens jeder Prüfungstext (Vorgabe Johannes: 6000).
 *
 * Warum so viel für eine Probe von 10 Minuten: Der Text darf NIE ausgehen. Bei
 * 200 Anschlägen je Minute - schneller tippt kein Kind dieser Altersgruppe -
 * sind 6000 Zeichen 30 Minuten Vorrat. Wer den Text doch zu Ende schreibt, ist
 * fertig; das Ergebnis vermerkt es.
 */
export const MIND_ZEICHEN = 6000;

/**
 * Welcher Text kommt dran, wenn eine Klasse für dieses Niveau noch keinen
 * {@link ProbenZeiger} hat? Der kleinste noch nicht verbrauchte - aus der
 * alten Verbrauchsliste.
 *
 * Die Regel ist bewusst STUR und nicht zufällig: So kann die Lehrkraft im
 * Voraus sehen, welcher Text kommt („Text 4 von 15"), und zwei Klassen mit
 * demselben Stand schreiben denselben. Sind alle 15 verbraucht, beginnt der
 * Zyklus wieder bei 0.
 */
export function naechsterText(
  niveau: ProbenNiveau,
  verbraucht: VerbrauchteTexte,
): number {
  const schon = new Set(verbraucht[niveau] ?? []);
  if (schon.size >= PROBEN_JE_NIVEAU) return 0;
  for (let i = 0; i < PROBEN_JE_NIVEAU; i++) if (!schon.has(i)) return i;
  return 0;
}

// ── Texte sparen: wo die nächste Challenge beginnt (10.09.2026) ─────────────
/*
 * ★★★ Johannes, 10.09.2026: Die Texte haben rund 200 Zeilen und 6200 Zeichen,
 * das schnellste Kind schreibt in zehn Minuten etwa 1500. Mit „ein Text je
 * Challenge" wäre ein Niveau nach 15 Challenges zu drei Vierteln ungelesen
 * durch. Darum:
 *  1. Die nächste Challenge eines Niveaus beginnt an der Zeile NACH der, an
 *     der das WEITESTE Kind der letzten war - bei Erzähl- und Sachtexten am
 *     nächsten Satzanfang ({@link satzweise}).
 *  2. Geht der Text während einer Challenge aus, geht es nahtlos in Zeile 1
 *     des nächsten Textes weiter, nach Text 15 wieder Text 1
 *     ({@link baueFolge}) - ohne Pause, ohne Hinweis, die Uhr läuft weiter.
 *
 * Gemerkt wird je Niveau ein ZEIGER: wo die letzte Challenge begann und welche
 * es war. Wie weit die Kinder kamen, steht in ihren Ergebnissen
 * (`Probenergebnis.endeTextNr`/`endeZeile`); gerechnet wird beim nächsten
 * „Jetzt starten". So muss niemand die Klasse beschreiben, wenn ein Kind
 * abgibt - das darf ein Kind auch gar nicht.
 *
 * ⚠️ Die Rechnung braucht die Zeilen der Texte, kennt aber das Nachladen
 * nicht: Wer rechnet, reicht sie herein ({@link TextZeilen}).
 */

/** Eine Stelle in den Texten eines Niveaus: Text (0 … 14) und Zeile (0-basiert). */
export interface TextStelle {
  textNr: number;
  zeile: number;
}

/** Wo die letzte Challenge eines Niveaus begonnen hat - und welche es war. */
export interface ZeigerEintrag extends TextStelle {
  probeId: string;
}

/** Die Zeiger je Niveau (`tt_classes.settings.schreibprobeZeiger`). */
export type ProbenZeiger = Partial<Record<ProbenNiveau, ZeigerEintrag>>;

/** Wo ein Kind aufgehört hat - die Zeile, an der es zuletzt stand. */
export interface ProbenEnde extends TextStelle {
  probeId: string;
}

/**
 * Höchste Zeilennummer, die beim Einlesen geglaubt wird. Die Texte haben
 * unter 250 Zeilen; die Grenze fängt nur Unsinn ab.
 */
export const ZEILE_GROESST = 10_000;

/** Was die Rechnung von einem Text braucht - ein `Probentext` passt hinein. */
export interface TextZeilen {
  nr: number;
  zeilen: readonly string[];
}

/**
 * So viele Anschläge je Minute hält der bereitgelegte Text mindestens aus.
 * Das schnellste Kind der Klasse MSWEIN schrieb am 10.09.2026 rund 150;
 * geübte Erwachsene kommen auf 400 bis 500. 800 lässt also niemanden ans Ende
 * kommen, und mehr als zwei, drei Texte liegen dafür selten bereit.
 */
export const VORRAT_ANSCHLAEGE_JE_MIN = 800;

/**
 * Die Zeiger aus den Einstellungen lesen - wehrhaft wie der Plan.
 *
 * ★ E7a: `lernweg` optional, fehlt es gilt „de" - der alte Schlüssel
 * (siehe {@link verbrauchtAusEinstellungen}).
 */
export function zeigerAusEinstellungen(settings: unknown, lernweg: Lernweg = "de"): ProbenZeiger {
  const out: ProbenZeiger = {};
  if (!settings || typeof settings !== "object") return out;
  const roh = (settings as Record<string, unknown>)[zeigerSchluessel(lernweg)];
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return out;
  for (const niveau of PROBEN_NIVEAUS) {
    const e = (roh as Record<string, unknown>)[niveau];
    if (!e || typeof e !== "object") continue;
    const o = e as Record<string, unknown>;
    const textNr = ganzeZahlIm(o.textNr, PROBEN_JE_NIVEAU - 1);
    const zeile = ganzeZahlIm(o.zeile, ZEILE_GROESST);
    const probeId = typeof o.probeId === "string" ? o.probeId.trim() : "";
    // ⚠️ Ein halber Eintrag gilt als KEIN Eintrag: Dann entscheidet die alte
    // Verbrauchsliste. Lieber einen ganzen neuen Text als eine erfundene
    // Stelle, an der die Klasse vielleicht schon war.
    if (textNr === null || zeile === null || !probeId) continue;
    out[niveau] = { textNr, zeile, probeId };
  }
  return out;
}

/**
 * Beginnt die nächste Challenge dieses Niveaus an einem SATZANFANG?
 *
 * Nachgezählt an den Texten (10.09.2026): Nur „Mit Satzzeichen", „Mit
 * Zahlen" und „Alles" sind Sach- und Erzähltexte, deren Zeilen mit Punkt,
 * Frage- oder Ausrufezeichen enden. Die Grundreihe sind Übungszeilen, „Erste
 * Buchstaben" und „Alle Buchstaben" haben noch kein Satzzeichen - einen
 * Satzanfang gibt es dort nicht zu erkennen. Programmcode hat keine Sätze.
 * Der Wächter prüft beides an den echten Texten.
 */
export function satzweise(niveau: ProbenNiveau): boolean {
  return niveau === "satz" || niveau === "zahlen" || niveau === "alles";
}

/** Endet diese Zeile mit einem Satz (. ! ?, dahinter höchstens Klammer oder Anführung)? */
export function endetMitSatz(zeile: string): boolean {
  return /[.!?][)"'»«“”]*\s*$/.test(zeile);
}

function zeilenVon(texte: readonly TextZeilen[], nr: number): readonly string[] {
  return (texte.find((t) => t.nr === nr) ?? texte[nr])?.zeilen ?? [];
}

/**
 * Eine Stelle auf einen echten Text und eine echte Zeile bringen: Wer über
 * das Ende eines Textes hinaus zählt, landet im nächsten, und nach Text 15
 * wieder in Text 1.
 */
export function normiereStelle(texte: readonly TextZeilen[], stelle: TextStelle): TextStelle {
  const n = PROBEN_JE_NIVEAU;
  let textNr = Number.isFinite(stelle.textNr) ? ((Math.trunc(stelle.textNr) % n) + n) % n : 0;
  let zeile = Number.isFinite(stelle.zeile) ? Math.max(0, Math.trunc(stelle.zeile)) : 0;
  let gesamt = 0;
  for (let i = 0; i < n; i++) gesamt += zeilenVon(texte, i).length;
  // Ohne Zeilen (die Texte fehlen) gibt es nur den Textanfang.
  if (gesamt === 0) return { textNr, zeile: 0 };
  zeile %= gesamt;
  for (let i = 0; i <= n; i++) {
    const laenge = zeilenVon(texte, textNr).length;
    if (zeile < laenge) break;
    zeile -= laenge;
    textNr = (textNr + 1) % n;
  }
  return { textNr, zeile };
}

/**
 * Die erste Stelle ab `stelle`, an der eine Challenge beginnen darf: bei
 * {@link satzweise} Niveaus der nächste Satzanfang (Zeile 1 eines Textes oder
 * die Zeile nach einem Satzende), sonst die Stelle selbst.
 */
export function anfangAb(
  texte: readonly TextZeilen[],
  stelle: TextStelle,
  satzAnfang: boolean,
): TextStelle {
  const s = normiereStelle(texte, stelle);
  if (!satzAnfang) return s;
  const zeilen = zeilenVon(texte, s.textNr);
  for (let i = s.zeile; i < zeilen.length; i++) {
    if (i === 0 || endetMitSatz(zeilen[i - 1])) return { textNr: s.textNr, zeile: i };
  }
  // Im Rest dieses Textes beginnt kein Satz mehr - der nächste Text beginnt mit einem.
  return normiereStelle(texte, { textNr: s.textNr + 1, zeile: 0 });
}

/**
 * Wie weit liegt `bis` hinter `von`? Eine Vergleichszahl, keine Zeilenzahl:
 * erst ganze Texte, dann Zeilen. Beide Stellen müssen normiert sein.
 */
function abstand(von: TextStelle, bis: TextStelle): number {
  const n = PROBEN_JE_NIVEAU;
  const texteWeiter = (bis.textNr - von.textNr + n) % n;
  // Derselbe Text, aber VOR der Startzeile: einmal durch alle 15 Texte.
  const umlauf = texteWeiter === 0 && bis.zeile < von.zeile ? n : texteWeiter;
  return umlauf * (ZEILE_GROESST + 1) + bis.zeile;
}

/** Woher die nächste Startstelle kommt - für den Satz, den die Lehrkraft liest. */
export type StartHerkunft =
  /** Nach dem weitesten Kind der letzten Challenge dieses Niveaus. */
  | "weiter"
  /** Die letzte Challenge hat niemand abgegeben - dieselbe Stelle noch einmal. */
  | "wiederholt"
  /** Kein Zeiger: der nächste unverbrauchte Text, von vorne. */
  | "neu";

export interface NaechsterStart extends TextStelle {
  herkunft: StartHerkunft;
}

/**
 * ★★★ WO BEGINNT DIE NÄCHSTE CHALLENGE DIESES NIVEAUS?
 *
 *  • Kein (gültiger) Zeiger ⇒ die alte Verbrauchsliste: der nächste
 *    unverbrauchte Text, Zeile 1 („neu").
 *  • Zeiger, und Kinder der Challenge, auf die er zeigt, haben abgegeben ⇒ die
 *    Zeile nach der, an der das weiteste Kind stand, am nächsten Satzanfang
 *    („weiter").
 *  • Zeiger, aber niemand hat abgegeben ⇒ dieselbe Stelle noch einmal
 *    („wiederholt"). ⚠️ Das trifft auch eine ABGESAGTE Challenge, bei der
 *    Kinder schon schrieben: Wer nicht abgegeben hat, hinterlässt keine Spur.
 *
 * ★ E7a: `lernweg` optional (fehlt ⇒ „de") - er wählt den Schlüssel in
 * `settings`, unter dem Zeiger und Verbrauchsliste dieses Weges stehen
 * ({@link verbrauchtAusEinstellungen}). `texte` muss selbst schon die Bank
 * DIESES Weges sein (`ladeTexte(niveau, lernweg)`) - diese Funktion lädt
 * nichts nach.
 */
export function naechsterStart(
  niveau: ProbenNiveau,
  settings: unknown,
  enden: readonly ProbenEnde[],
  texte: readonly TextZeilen[],
  lernweg: Lernweg = "de",
): NaechsterStart {
  const zeiger = zeigerAusEinstellungen(settings, lernweg)[niveau];
  if (!zeiger) {
    return {
      textNr: naechsterText(niveau, verbrauchtAusEinstellungen(settings, lernweg)),
      zeile: 0,
      herkunft: "neu",
    };
  }
  const satz = satzweise(niveau);
  const start = normiereStelle(texte, zeiger);
  let weitest: TextStelle | null = null;
  for (const e of enden) {
    if (e.probeId !== zeiger.probeId) continue;
    const ende = normiereStelle(texte, e);
    if (!weitest || abstand(start, ende) > abstand(start, weitest)) weitest = ende;
  }
  if (!weitest) return { ...anfangAb(texte, start, satz), herkunft: "wiederholt" };
  return {
    ...anfangAb(texte, { textNr: weitest.textNr, zeile: weitest.zeile + 1 }, satz),
    herkunft: "weiter",
  };
}

/** Die Zeilen, die ein Kind in einer Challenge vor sich hat - und woher jede stammt. */
export interface Folge {
  zeilen: string[];
  stellen: TextStelle[];
}

/**
 * ★★ DIE ZEILEN EINER CHALLENGE: ab der Startstelle bis zum Ende des Textes,
 * danach nahtlos der nächste Text von Zeile 1 an (nach Text 15 Text 1) - so
 * lange, bis mindestens `mindZeichen` Zeichen bereitliegen.
 *
 * Für die Session ist das EINE Zeilenliste: Sie kennt keinen Textwechsel, also
 * gibt es keinen „Text zu Ende", keine Pause und keinen Hinweis - das Kind
 * schreibt einfach die nächste Zeile. Höchstens einmal durch alle 15 Texte;
 * die Zeilen des Starttextes VOR der Startstelle kommen nicht wieder dran.
 */
/**
 * @param anzahlTexte Modulo für den Textwechsel - bei den 15er-Bänken
 * {@link PROBEN_JE_NIVEAU} (Vorgabe), bei einer eigenen Datei `1` (genau ein
 * Text, siehe unten).
 * @param maxLaeufe Harte Obergrenze der Aussenschleife - bei den 15er-Bänken
 * dieselbe Zahl wie `anzahlTexte` (Vorgabe: höchstens einmal ganz herum, nie
 * eine Zeile doppelt - siehe `tests/tastenflow-schreibprobe-logik.test.ts`).
 *
 * ⚠️ ZWEI VERSCHIEDENE ZAHLEN, gemessen 17.09.2026: Vor der Tippchallenge mit
 * eigener Datei genügte hier EINE Zahl, weil sie immer gleich waren
 * (`PROBEN_JE_NIVEAU`). Eine einzelne kurze Datei muss aber, anders als die
 * Bank, oft VIELE Male hintereinander wiederholt werden, um eine lange
 * Prüfungszeit zu füllen (bis 60 Min. × 800 Anschläge/Min. -
 * {@link DAUER_MIN_GROESST}, {@link VORRAT_ANSCHLAEGE_JE_MIN}) - mit `anzahlTexte`
 * ALLEIN als Obergrenze bräche die Schleife nach genau einem Durchlauf ab,
 * lange bevor `mindZeichen` erreicht ist.
 */
export function baueFolge(
  texte: readonly TextZeilen[],
  start: TextStelle,
  mindZeichen: number,
  anzahlTexte: number = PROBEN_JE_NIVEAU,
  maxLaeufe: number = anzahlTexte,
): Folge {
  const zeilen: string[] = [];
  const stellen: TextStelle[] = [];
  const s = normiereStelle(texte, start);
  let zeichen = 0;
  for (let i = 0; i < maxLaeufe && (zeichen < mindZeichen || zeilen.length === 0); i++) {
    const textNr = (s.textNr + i) % anzahlTexte;
    const z = zeilenVon(texte, textNr);
    for (let k = i === 0 ? s.zeile : 0; k < z.length; k++) {
      zeilen.push(z[k]);
      stellen.push({ textNr, zeile: k });
      zeichen += z[k].length + 1;
    }
  }
  return { zeilen, stellen };
}

// ── Die Phasen (was gerade gilt) ────────────────────────────────────────────

/**
 * In welchem Zustand ist die Schreibprobe für DIESES Kind?
 *
 * ⚠️ Die Phase hängt an drei Dingen: dem Plan der Klasse, der Uhr - und dem,
 * was dieses Kind schon getan hat. Sie ist deshalb NICHT allein aus dem Plan
 * ablesbar; wer das versucht, zeigt einem Kind, das längst abgegeben hat,
 * wieder den Startbildschirm.
 */
export type ProbenPhase =
  /** Keine Schreibprobe geplant (der Normalfall). */
  | "keine"
  /** Das Einstiegsfenster läuft - dieses Kind darf jetzt beginnen. */
  | "offen"
  /** Dieses Kind hat begonnen, seine Zeit läuft. */
  | "laeuft"
  /** Dieses Kind ist fertig (Zeit abgelaufen oder Text zu Ende). */
  | "abgegeben"
  /** Das Einstiegsfenster ist zu, dieses Kind hat nie begonnen. */
  | "verpasst";

export interface KindStand {
  /** Wann dieses Kind den ersten Tastendruck gemacht hat (0 = noch nicht). */
  beginnMs: number;
  /** Hat es die Probe schon abgegeben? */
  abgegeben: boolean;
  /** Hat es „ich schreibe nicht mit" gewählt? */
  abgemeldet: boolean;
  /** Bekommt dieses Kind den Zeitzuschlag? */
  zuschlag: boolean;
  /**
   * Hat es seine Auswertung mit „Weiter üben" oder Escape geschlossen?
   * Dann übernimmt die Challenge den Bildschirm nicht mehr (Johannes
   * 10.09.2026) - die Zahlen stehen in der eigenen Statistik.
   */
  gesehen: boolean;
}

export const LEERER_STAND: KindStand = {
  beginnMs: 0,
  abgegeben: false,
  abgemeldet: false,
  zuschlag: false,
  gesehen: false,
};

/** Ende des Einstiegsfensters (ms). */
export function einstiegBisMs(plan: SchreibprobePlan): number {
  return plan.startMs + EINSTIEGSFENSTER_MIN * 60_000;
}

/**
 * Wie lange dieses Kind schreiben darf (ms) - Prüfungszeit plus sein
 * Zeitzuschlag. ★ Das ist seit 15.09.2026 auch die ECHTE Wanduhrzeit der
 * Prüfung - siehe {@link restMs}, das Vorlesen verlängert sie nicht mehr.
 */
export function dauerMsFuer(plan: SchreibprobePlan, stand: KindStand): number {
  const grund = plan.dauerMin * 60_000;
  if (!stand.zuschlag || plan.zuschlagProzent <= 0) return grund;
  return Math.round(grund * (1 + plan.zuschlagProzent / 100));
}

/**
 * ★ So weit darf die Uhr eines Kind-Geräts gegenüber der Uhr der Lehrkraft
 * nachgehen, und die Challenge gilt trotzdem schon als offen (ms).
 *
 * Gestartet wird immer „jetzt" - ein Start in der Zukunft ist also fast immer
 * eine Schuluhr, die ein, zwei Minuten falsch geht. Das Kind soll deswegen
 * nicht warten müssen. Liegt der Start WEITER in der Zukunft, ist es kein
 * Uhrenfehler, sondern ein Termin aus einem älteren Datensatz: Der zeigt sich
 * erst zu seiner Zeit - bis dahin übt das Kind ungestört weiter.
 */
export const UHR_SPIELRAUM_MS = 5 * 60_000;

export function phaseVon(
  plan: SchreibprobePlan | null,
  stand: KindStand,
  jetztMs: number,
): ProbenPhase {
  if (!plan) return "keine";
  if (stand.abgegeben) return "abgegeben";
  if (stand.abgemeldet) return "keine";
  if (stand.beginnMs > 0) return "laeuft";
  if (jetztMs < plan.startMs - UHR_SPIELRAUM_MS) return "keine";
  if (jetztMs <= einstiegBisMs(plan)) return "offen";
  return "verpasst";
}

/**
 * Wie viel Zeit bleibt diesem Kind noch (ms, nie negativ)?
 *
 * ★★★★★ SEIT 15.09.2026 EINE REINE WANDUHR - die Vorlesezeit pausiert sie
 * NICHT mehr (Johannes: „die tippchallenge soll auch exakt die zeit tippen,
 * die der lehrer vorgibt, und das so werten wie beim klassenmatch"). Bis
 * 14.09. zog `restMs` die gemessene Wartezeit von der verstrichenen Zeit ab
 * und verlängerte die Prüfung dadurch real - genau das Gegenteil von
 * Klassenmatch, wo das gemeinsame Zeitfenster für alle starr ist. Jetzt
 * endet die Tippchallenge für jedes Kind exakt nach `plan.dauerMin`, so wie
 * die Lehrkraft es eingestellt hat.
 *
 * Der Ausgleich für die Wartezeit passiert darum nicht mehr HIER, sondern
 * allein in der WERTUNG: `schreibMs` ({@link anschlaegeProMinute} in
 * `schreibprobeAuswertung.ts`) ist seit F1c (18.09.2026) die Prüfungsuhr minus
 * Zuhören minus Zeilenwechsel (`eineMessart.ts`) - bei gleichbleibender
 * Prüfungsdauer wird sie bei viel Vorlesen kleiner, nicht die Prüfung länger.
 * Dieselbe Rechnung wie `matchApm` in `klassenmatch.ts`: festes Zeitfenster,
 * bereinigte Rate.
 */
export function restMs(plan: SchreibprobePlan, stand: KindStand, jetztMs: number): number {
  const gesamt = dauerMsFuer(plan, stand);
  if (stand.beginnMs <= 0) return gesamt;
  return Math.max(0, gesamt - (jetztMs - stand.beginnMs));
}

/**
 * Bleibt vom Einstiegsfenster noch Zeit? (Für die Anzeige „noch 4 Minuten, um
 * zu beginnen".)
 *
 * Nach oben gedeckelt auf das ganze Fenster: Geht die Uhr des Geräts nach
 * (siehe {@link UHR_SPIELRAUM_MS}), stünde sonst „noch 12:00" da, obwohl es
 * nie mehr als {@link EINSTIEGSFENSTER_MIN} Minuten gibt.
 */
export function einstiegRestMs(plan: SchreibprobePlan, jetztMs: number): number {
  return Math.min(EINSTIEGSFENSTER_MIN * 60_000, Math.max(0, einstiegBisMs(plan) - jetztMs));
}

/**
 * Wann ist die Schreibprobe für die ganze Klasse sicher vorbei?
 *
 * Spätester Einstieg + längste mögliche Prüfungszeit (also mit Zuschlag). Erst
 * danach darf die Sammel-Mail an die Lehrkraft raus - vorher wäre sie
 * unvollständig, und eine zweite Mail „diesmal wirklich alle" will niemand.
 */
export function klasseVorbeiMs(plan: SchreibprobePlan): number {
  const mitZuschlag = plan.dauerMin * 60_000 * (1 + Math.max(0, plan.zuschlagProzent) / 100);
  return einstiegBisMs(plan) + Math.round(mitZuschlag);
}

// ── Bereit? (10.09.2026) ────────────────────────────────────────────────────

/**
 * ★★ WER IST BEREIT? Johannes, 10.09.2026: Das Fenster der Tippchallenge soll
 * bei allen Kindern schnell kommen - und die Lehrkraft soll sehen, bei wem es
 * schon da ist, bevor sie „los" sagt.
 *
 * „Bereit" heisst: Das GERÄT des Kindes kennt den Plan DIESER Challenge und
 * hat das vor kurzem gemeldet (`tt_pupils.probeBereit`). Es heisst nicht, dass
 * das Kind schon sitzt - das sieht die Lehrkraft im Raum. Ein Kind, das schon
 * abgegeben hat, zählt als bereit: Sein Gerät hatte den Plan.
 */

/** So lange gilt eine Meldung als frisch (ms) - zwei Lebenszeichen Spielraum. */
export const BEREIT_FRISCH_MS = 120_000;

/** So oft meldet ein Gerät, solange die Challenge läuft (ms). */
export const LEBENSZEICHEN_MS = 60_000;

export interface BereitMeldung {
  probeId: string;
  ms: number;
}

/** Die Meldung vom Server lesen - wehrhaft wie der Plan. */
export function bereitMeldungAus(roh: unknown): BereitMeldung | null {
  if (!roh || typeof roh !== "object") return null;
  const o = roh as Record<string, unknown>;
  const probeId = typeof o.probeId === "string" ? o.probeId.trim() : "";
  const ms = zahl(o.ms);
  if (!probeId || !(ms > 0)) return null;
  return { probeId, ms };
}

export interface Bereitschaft {
  /** Namen in der Reihenfolge der Klassenliste. */
  bereit: string[];
  nochNicht: string[];
}

/**
 * Wer ist bereit, wer noch nicht - für GENAU diese Challenge und JETZT.
 * Die Namen bleiben in der Reihenfolge der Klassenliste.
 */
export function bereitschaft(
  kinder: readonly { id: string; name: string; probeBereit?: BereitMeldung | null }[],
  probeId: string,
  abgegeben: ReadonlySet<string>,
  jetztMs: number,
): Bereitschaft {
  const bereit: string[] = [];
  const nochNicht: string[] = [];
  for (const k of kinder) {
    const m = k.probeBereit;
    const frisch = !!m && m.probeId === probeId && jetztMs - m.ms <= BEREIT_FRISCH_MS;
    (frisch || abgegeben.has(k.id) ? bereit : nochNicht).push(k.name);
  }
  return { bereit, nochNicht };
}

/**
 * „Bereit: 12 von 14 - noch nicht: Said, Jano" bzw. „Bereit: 14 von 14".
 * Englisch (EN5, Glossar §3.7): „Ready: 12 of 14 - not yet: Said, Jano".
 */
export function bereitSatz(b: Bereitschaft, sprache: BedienSprache = "de"): string {
  const alle = b.bereit.length + b.nochNicht.length;
  const t = ANZEIGE_TEXTE[sprache];
  const kopf = t.bereitKopf(b.bereit.length, alle);
  return b.nochNicht.length ? t.bereitNochNicht(kopf, b.nochNicht.join(", ")) : kopf;
}

// ── Anzeige-Helfer ──────────────────────────────────────────────────────────

/**
 * ★ Die Sätze der Anzeige-Helfer in beiden Bedienungssprachen (EN5,
 * 19.09.2026). Deutsch wortgleich wie vorher - auch dort, wo das Deutsche
 * keine Einzahl kennt („Noch 1 Sekunden" kommt nie vor: angesagt wird bei
 * 300, 60 und 10 Sekunden). Englisch mit echter Einzahl über `mehrzahl`.
 */
const ANZEIGE_TEXTE = texte({
  de: {
    bereitKopf: (bereit: number, alle: number) => `Bereit: ${bereit} von ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - noch nicht: ${namen}`,
    zeitUm: "Die Zeit ist um.",
    nochSekunden: (s: number) => `Noch ${s} Sekunden.`,
    nochMinuten: (m: number) => `Noch ${m} Minuten.`,
    text: (nr: number, von: number) => `Text ${nr} von ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Text ${nr}, ab Zeile ${zeile}`,
  },
  en: {
    bereitKopf: (bereit: number, alle: number) => `Ready: ${bereit} of ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - not yet: ${namen}`,
    zeitUm: "Time's up.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "en", { one: (z) => `${z} second left.`, other: (z) => `${z} seconds left.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "en", { one: (z) => `${z} minute left.`, other: (z) => `${z} minutes left.` }),
    text: (nr: number, von: number) => `Text ${nr} of ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Text ${nr}, from line ${zeile}`,
  },
  fr: {
    bereitKopf: (bereit: number, alle: number) => `Prêts : ${bereit} sur ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - pas encore : ${namen}`,
    zeitUm: "Le temps est écoulé.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "fr", { one: (z) => `Encore ${z} seconde.`, other: (z) => `Encore ${z} secondes.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "fr", { one: (z) => `Encore ${z} minute.`, other: (z) => `Encore ${z} minutes.` }),
    text: (nr: number, von: number) => `Texte ${nr} sur ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Texte ${nr}, à partir de la ligne ${zeile}`,
  },
  es: {
    bereitKopf: (bereit: number, alle: number) => `Preparados: ${bereit} de ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - todavía no: ${namen}`,
    zeitUm: "Se acabó el tiempo.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "es", { one: (z) => `Queda ${z} segundo.`, other: (z) => `Quedan ${z} segundos.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "es", { one: (z) => `Queda ${z} minuto.`, other: (z) => `Quedan ${z} minutos.` }),
    text: (nr: number, von: number) => `Texto ${nr} de ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Texto ${nr}, desde la línea ${zeile}`,
  },
  // ★ O-IT (02.10.2026): „persone pronte" (ohne Geschlecht), „Tempo scaduto",
  // „Mancano 5 minuti" (Glossar §2.3, §2.10).
  it: {
    bereitKopf: (bereit: number, alle: number) => `Persone pronte: ${bereit} su ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - non ancora: ${namen}`,
    zeitUm: "Tempo scaduto.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "it", { one: (z) => `Manca ${z} secondo.`, other: (z) => `Mancano ${z} secondi.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "it", { one: (z) => `Manca ${z} minuto.`, other: (z) => `Mancano ${z} minuti.` }),
    text: (nr: number, von: number) => `Testo ${nr} di ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Testo ${nr}, dalla riga ${zeile}`,
  },
  // ★ O-PL (02.10.2026): „Gotowość: 12 z 14" (nie „gotowy/gotowa" über eine
  // Person), Namen nach Doppelpunkt im Nominativ, „Koniec czasu." und die
  // Restzeit mit allen vier Formen - das Verb beugt mit (Glossar §2.3, §2.10a).
  pl: {
    bereitKopf: (bereit: number, alle: number) => `Gotowość: ${bereit} z ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - jeszcze nie: ${namen}`,
    zeitUm: "Koniec czasu.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "pl", {
        one: (z) => `Została ${z} sekunda.`,
        few: (z) => `Zostały ${z} sekundy.`,
        many: (z) => `Zostało ${z} sekund.`,
        other: (z) => `Zostało ${z} sekundy.`,
      }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "pl", {
        one: (z) => `Została ${z} minuta.`,
        few: (z) => `Zostały ${z} minuty.`,
        many: (z) => `Zostało ${z} minut.`,
        other: (z) => `Zostało ${z} minuty.`,
      }),
    text: (nr: number, von: number) => `Tekst ${nr} z ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Tekst ${nr}, od wiersza ${zeile}`,
  },
  // ★ O-TR (02.10.2026): "Hazır: 12 kişi, toplam 14" (nie "12 / 14", Glossar
  // §1 Regel 6), Einzahl nach der Zahl ("5 dakika kaldı."), keine Endung an
  // einer Zahl - "Metin 2, toplam 6".
  tr: {
    bereitKopf: (bereit: number, alle: number) => `Hazır: ${bereit} kişi, toplam ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - henüz hazır değil: ${namen}`,
    zeitUm: "Süre doldu.",
    nochSekunden: (s: number) => `${s} saniye kaldı.`,
    nochMinuten: (m: number) => `${m} dakika kaldı.`,
    text: (nr: number, von: number) => `Metin ${nr}, toplam ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Metin ${nr}, başlangıç: satır ${zeile}`,
  },
  // ★ O-CS (03.10.2026): „Připraveno: 12/14" (Doppelpunkt + Schrägstrich - kein
  // Geschlecht, keine Präposition vor der Zahl), Namen nach Doppelpunkt, die
  // Restzeit mit allen vier Formen - das Verb zieht mit (Glossar §2.11).
  cs: {
    bereitKopf: (bereit: number, alle: number) => `Připraveno: ${bereit}/${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - zatím ne: ${namen}`,
    zeitUm: "Čas vypršel.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "cs", {
        one: (z) => `Zbývá ${z} sekunda.`,
        few: (z) => `Zbývají ${z} sekundy.`,
        many: (z) => `Zbývá ${z} sekundy.`,
        other: (z) => `Zbývá ${z} sekund.`,
      }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "cs", {
        one: (z) => `Zbývá ${z} minuta.`,
        few: (z) => `Zbývají ${z} minuty.`,
        many: (z) => `Zbývá ${z} minuty.`,
        other: (z) => `Zbývá ${z} minut.`,
      }),
    text: (nr: number, von: number) => `Text ${nr}/${von}`,
    textAbZeile: (nr: number, zeile: number) => `Text ${nr}, od řádku ${zeile}`,
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    bereitKopf: (bereit: number, alle: number) => `Готови: ${bereit} от ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - още не: ${namen}`,
    zeitUm: "Времето изтече.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "bg", { one: (z) => `Остава ${z} секунда.`, other: (z) => `Остават ${z} секунди.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "bg", { one: (z) => `Остава ${z} минута.`, other: (z) => `Остават ${z} минути.` }),
    text: (nr: number, von: number) => `Текст ${nr} от ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Текст ${nr}, от ред ${zeile}`,
  },
  el: {
    bereitKopf: (bereit: number, alle: number) => `Έτοιμοι: ${bereit} από ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - όχι ακόμη: ${namen}`,
    zeitUm: "Ο χρόνος τελείωσε.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "el", { one: (z) => `Απομένει ${z} δευτερόλεπτο.`, other: (z) => `Απομένουν ${z} δευτερόλεπτα.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "el", { one: (z) => `Απομένει ${z} λεπτό.`, other: (z) => `Απομένουν ${z} λεπτά.` }),
    text: (nr: number, von: number) => `Κείμενο ${nr} από ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Κείμενο ${nr}, από τη γραμμή ${zeile}`,
  },
  hu: {
    bereitKopf: (bereit: number, alle: number) => `Kész: ${bereit}/${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - még nem: ${namen}`,
    zeitUm: "Lejárt az idő.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "hu", { one: (z) => `Még ${z} másodperc.`, other: (z) => `Még ${z} másodperc.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "hu", { one: (z) => `Még ${z} perc.`, other: (z) => `Még ${z} perc.` }),
    text: (nr: number, von: number) => `${nr}. szöveg (összesen ${von})`,
    textAbZeile: (nr: number, zeile: number) => `${nr}. szöveg, a(z) ${zeile}. sortól`,
  },
  nl: {
    bereitKopf: (bereit: number, alle: number) => `Klaar: ${bereit} van ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - nog niet: ${namen}`,
    zeitUm: "De tijd is om.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "nl", { one: (z) => `Nog ${z} seconde.`, other: (z) => `Nog ${z} seconden.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "nl", { one: (z) => `Nog ${z} minuut.`, other: (z) => `Nog ${z} minuten.` }),
    text: (nr: number, von: number) => `Tekst ${nr} van ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Tekst ${nr}, vanaf regel ${zeile}`,
  },
  pt: {
    bereitKopf: (bereit: number, alle: number) => `Prontos: ${bereit} de ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - ainda não: ${namen}`,
    zeitUm: "O tempo acabou.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "pt", { one: (z) => `Falta ${z} segundo.`, many: (z) => `Faltam ${z} de segundos.`, other: (z) => `Faltam ${z} segundos.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "pt", { one: (z) => `Falta ${z} minuto.`, many: (z) => `Faltam ${z} de minutos.`, other: (z) => `Faltam ${z} minutos.` }),
    text: (nr: number, von: number) => `Texto ${nr} de ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Texto ${nr}, a partir da linha ${zeile}`,
  },
  br: {
    bereitKopf: (bereit: number, alle: number) => `Prontos: ${bereit} de ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - ainda não: ${namen}`,
    zeitUm: "O tempo acabou.",
    nochSekunden: (s: number) =>
      s === 0 ? "Faltam 0 segundos." : mehrzahl(s, "br", { one: (z) => `Falta ${z} segundo.`, many: (z) => `Faltam ${z} de segundos.`, other: (z) => `Faltam ${z} segundos.` }),
    nochMinuten: (m: number) =>
      m === 0 ? "Faltam 0 minutos." : mehrzahl(m, "br", { one: (z) => `Falta ${z} minuto.`, many: (z) => `Faltam ${z} de minutos.`, other: (z) => `Faltam ${z} minutos.` }),
    text: (nr: number, von: number) => `Texto ${nr} de ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Texto ${nr}, a partir da linha ${zeile}`,
  },
  ro: {
    bereitKopf: (bereit: number, alle: number) => `Pregătiți: ${bereit} din ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - încă nu: ${namen}`,
    zeitUm: "Timpul a expirat.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "ro", { one: (z) => `A mai rămas ${z} secundă.`, few: (z) => `Au mai rămas ${z} secunde.`, other: (z) => `Au mai rămas ${z} de secunde.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "ro", { one: (z) => `A mai rămas ${z} minut.`, few: (z) => `Au mai rămas ${z} minute.`, other: (z) => `Au mai rămas ${z} de minute.` }),
    text: (nr: number, von: number) => `Textul ${nr} din ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Textul ${nr}, de la rândul ${zeile}`,
  },
  sv: {
    bereitKopf: (bereit: number, alle: number) => `Redo: ${bereit} av ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - inte än: ${namen}`,
    zeitUm: "Tiden är ute.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "sv", { one: (z) => `${z} sekund kvar.`, other: (z) => `${z} sekunder kvar.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "sv", { one: (z) => `${z} minut kvar.`, other: (z) => `${z} minuter kvar.` }),
    text: (nr: number, von: number) => `Text ${nr} av ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Text ${nr}, från rad ${zeile}`,
  },
  uk: {
    bereitKopf: (bereit: number, alle: number) => `Готові: ${bereit} з ${alle}`,
    bereitNochNicht: (kopf: string, namen: string) => `${kopf} - ще ні: ${namen}`,
    zeitUm: "Час вийшов.",
    nochSekunden: (s: number) =>
      mehrzahl(s, "uk", { one: (z) => `Залишилася ${z} секунда.`, few: (z) => `Залишилося ${z} секунди.`, many: (z) => `Залишилося ${z} секунд.`, other: (z) => `Залишилося ${z} секунди.` }),
    nochMinuten: (m: number) =>
      mehrzahl(m, "uk", { one: (z) => `Залишилася ${z} хвилина.`, few: (z) => `Залишилося ${z} хвилини.`, many: (z) => `Залишилося ${z} хвилин.`, other: (z) => `Залишилося ${z} хвилини.` }),
    text: (nr: number, von: number) => `Текст ${nr} з ${von}`,
    textAbZeile: (nr: number, zeile: number) => `Текст ${nr}, з рядка ${zeile}`,
  },
});

/**
 * ★★★ DER ZEITSTAND FÜR DIE BRAILLEZEILE - immer gleich breit, dann drei
 * Leerzeichen (Johannes 10.09.2026: *„kann man den zeitstand links auf der
 * zeile mitlaufen lassen und dann 3 leerzeichen machen und dann beginnt der
 * text"*).
 *
 * ⚠️ `mmss` taugt dafür NICHT: „9:59" hat vier Zeichen, „10:00" fünf. Beim
 * Übergang wanderte der ganze Text um eine Stelle nach rechts - unter den
 * lesenden Fingern. Hier steht die Minute darum immer zweistellig.
 *
 * Ergebnis: `"07:04   "` - acht Zellen, unveränderlich.
 */
export function zeilenZeitstand(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.min(99, Math.floor(s / 60));
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}   `;
}

/** So viele Zellen belegt {@link zeilenZeitstand} - fest. */
export const ZEITSTAND_BREITE = 8;

/** „7:04" - Zeitstand für die Uhr über dem Tippfeld. */
export function mmss(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * „noch 7 Minuten" / „noch 40 Sekunden" - für die SPRACHAUSGABE.
 *
 * ⚠️ Bewusst grob: Eine Ansage „noch 6 Minuten 43 Sekunden" ist auf der
 * Braillezeile eine Blitzmeldung, die die Zeile vier Sekunden lang verdrängt
 * ([[reference_live_region_ist_braille_blitzmeldung]]). Angesagt wird deshalb
 * selten und rund.
 */
export function restGesprochen(ms: number, sprache: BedienSprache = "de"): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const t = ANZEIGE_TEXTE[sprache];
  if (s <= 0) return t.zeitUm;
  if (s < 90) return t.nochSekunden(s);
  return t.nochMinuten(Math.round(s / 60));
}

/**
 * Bei welchen Restzeiten wird angesagt (Sekunden) - und nur dann.
 *
 * Fünf Minuten, eine Minute, zehn Sekunden. Mehr wäre Lärm; weniger ließe ein
 * Kind, das nichts sieht, ohne jede Vorwarnung in den Schluss laufen.
 */
export const ANSAGE_BEI_SEKUNDEN: readonly number[] = [300, 60, 10];

/**
 * Datum + Uhrzeit, wie es die Lehrkraft in der Klasse liest.
 *
 * ★ EN3 (19.09.2026): englisch „Sat 5 Sept 2026, 08:05" (Glossar §1.2:
 * Wochentag ohne Komma dahinter, Tag vor Monat, 24 Stunden in Tabellen) -
 * zusammengesetzt, weil `Intl` mit `en-GB` nach dem Wochentag ein Komma setzt.
 */
export function startGeschrieben(ms: number, sprache: BedienSprache = "de"): string {
  return START_GESCHRIEBEN[sprache](new Date(ms));
}

/**
 * ★ E11a-5 (26.09.2026, Falle 30): je Sprache eine Funktion statt
 * `if (sprache === "en") … sonst Deutsch`. Französisch „sam. 05/09/2026,
 * 8 h 05" (Bauplan §9.1: Datum `25/09/2026`, Zeit `14 h 30`) - von Hand
 * gebaut wie `uhrzeitAusMs` in `TastenflowReiter.tsx`, weil `fr-FR` in den
 * ICU-Daten dieser Plattform „08:05" liefert.
 */
const START_GESCHRIEBEN: Record<BedienSprache, (d: Date) => string> = mitRueckfallEn({
  de: (d) => {
    const datum = d.toLocaleDateString("de-AT", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const zeit = d.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" });
    return `${datum}, ${zeit} Uhr`;
  },
  en: (d) => {
    const tag = d.toLocaleDateString("en-GB", { weekday: "short" });
    const datumEn = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const zeitEn = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datumEn}, ${zeitEn}`;
  },
  fr: (d) => {
    const tag = d.toLocaleDateString("fr-FR", { weekday: "short" });
    const zwei = (n: number) => String(n).padStart(2, "0");
    const datum = `${zwei(d.getDate())}/${zwei(d.getMonth() + 1)}/${d.getFullYear()}`;
    return `${tag} ${datum}, ${uhrzeitFr(d)}`;
  },
  // ★ ES-O (27.09.2026): „lun 14/09/2026, 10:55" - Tag/Monat/Jahr mit
  // Schrägstrich, 24 Stunden; so lesen es Spanien und Amerika gleich.
  es: (d) => {
    const zwei = (n: number) => String(n).padStart(2, "0");
    const tag = d.toLocaleDateString("es-ES", { weekday: "short" });
    const datum = `${zwei(d.getDate())}/${zwei(d.getMonth() + 1)}/${d.getFullYear()}`;
    return `${tag} ${datum}, ${zwei(d.getHours())}:${zwei(d.getMinutes())}`;
  },
  // ★ O-IT (02.10.2026): „lun 14/09/2026, 10:55" (Glossar §2.10: Ziffern-Datum
  // mit Schrägstrich, 24 Stunden).
  it: (d) => {
    const zwei = (n: number) => String(n).padStart(2, "0");
    const tag = d.toLocaleDateString("it-IT", { weekday: "short" });
    const datum = `${zwei(d.getDate())}/${zwei(d.getMonth() + 1)}/${d.getFullYear()}`;
    return `${tag} ${datum}, ${zwei(d.getHours())}:${zwei(d.getMinutes())}`;
  },
  // ★ O-PL (02.10.2026): „pon. 14.09.2026, 08:05" - alles aus Intl pl-PL
  // (Glossar §2.10: Ziffern-Datum mit Punkt, 24 Stunden, nicht von Hand).
  pl: (d) => {
    const tag = d.toLocaleDateString("pl-PL", { weekday: "short" });
    const datum = d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
    const zeit = d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
  // ★ O-TR (02.10.2026): "14.09.2026 Pazartesi, 08:05" - Wochentag NACH dem
  // Datum (Glossar §2.10), alles aus Intl tr-TR, keine Endung an der Uhrzeit.
  tr: (d) => {
    const datum = d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const tag = d.toLocaleDateString("tr-TR", { weekday: "long" });
    const zeit = d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    return `${datum} ${tag}, ${zeit}`;
  },
  // ★ O-CS (03.10.2026): „po 14. 9. 2026, 8:05" - alles aus Intl cs-CZ
  // (Glossar §2.10: Datum mit Leerzeichen, Wochentag klein, Stunde ohne Null).
  cs: (d) => {
    const tag = d.toLocaleDateString("cs-CZ", { weekday: "short" });
    const datum = d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });
    const zeit = d.toLocaleTimeString("cs-CZ", { hour: "numeric", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: (d) => {
    const tag = d.toLocaleDateString("bg-BG", { weekday: "short" });
    const datum = d.toLocaleDateString("bg-BG", { day: "numeric", month: "numeric", year: "numeric" });
    const zeit = d.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
  el: (d) => {
    const tag = d.toLocaleDateString("el-GR", { weekday: "short" });
    const datum = d.toLocaleDateString("el-GR", { day: "numeric", month: "numeric", year: "numeric" });
    const zeit = d.toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
  hu: (d) => {
    const tag = d.toLocaleDateString("hu-HU", { weekday: "short" });
    const datum = d.toLocaleDateString("hu-HU", { day: "numeric", month: "numeric", year: "numeric" });
    const zeit = d.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
  nl: (d) => {
    const tag = d.toLocaleDateString("nl-NL", { weekday: "short" });
    const datum = d.toLocaleDateString("nl-NL", { day: "numeric", month: "numeric", year: "numeric" });
    const zeit = d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
  pt: (d) => {
    const tag = d.toLocaleDateString("pt-PT", { weekday: "short" });
    const datum = d.toLocaleDateString("pt-PT", { day: "numeric", month: "numeric", year: "numeric" });
    const zeit = d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
  br: (d) => {
    const tag = d.toLocaleDateString("pt-BR", { weekday: "short" });
    const datum = d.toLocaleDateString("pt-BR", { day: "numeric", month: "numeric", year: "numeric" });
    const zeit = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
  ro: (d) => {
    const tag = d.toLocaleDateString("ro-RO", { weekday: "short" });
    const datum = d.toLocaleDateString("ro-RO", { day: "numeric", month: "numeric", year: "numeric" });
    const zeit = d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
  sv: (d) => {
    const tag = d.toLocaleDateString("sv-SE", { weekday: "short" });
    const datum = d.toLocaleDateString("sv-SE", { day: "numeric", month: "numeric", year: "numeric" });
    const zeit = d.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
  uk: (d) => {
    const tag = d.toLocaleDateString("uk-UA", { weekday: "short" });
    const datum = d.toLocaleDateString("uk-UA", { day: "numeric", month: "numeric", year: "numeric" });
    const zeit = d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
    return `${tag} ${datum}, ${zeit}`;
  },
});

/** „14 h 30" - die französische Uhrzeit (Bauplan §9.1), von Hand gebaut. */
export function uhrzeitFr(d: Date): string {
  return `${d.getHours()} h ${String(d.getMinutes()).padStart(2, "0")}`;
}

/** „Text 4 von 15" (englisch „Text 4 of 15") */
export function textBezeichnung(textNr: number, sprache: BedienSprache = "de"): string {
  return ANZEIGE_TEXTE[sprache].text(textNr + 1, PROBEN_JE_NIVEAU);
}

/**
 * „Text 4 von 15" am Textanfang, sonst „Text 4, ab Zeile 58" - die Zeilen
 * zählen ab 1, wie „Zeile 3 von 40" im Tippfeld. (Englisch „Text 4, from
 * line 58".)
 */
export function stelleBezeichnung(
  textNr: number,
  zeile: number,
  sprache: BedienSprache = "de",
): string {
  return zeile > 0
    ? ANZEIGE_TEXTE[sprache].textAbZeile(textNr + 1, zeile + 1)
    : textBezeichnung(textNr, sprache);
}

/**
 * Eine neue Kennung. Zeitstempel plus Zufall - der Zeitstempel macht sie im
 * Log lesbar, der Zufall verhindert eine Kollision, wenn zwei Lehrkräfte in
 * derselben Millisekunde anlegen.
 */
export function neueProbenId(jetztMs: number = Date.now()): string {
  const zufall = Math.random().toString(36).slice(2, 8);
  return `sp${jetztMs.toString(36)}${zufall}`;
}
