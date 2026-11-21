/**
 * ★★★★★ DIE EINE SPERRLISTE FÜR WEG „it" (F5-F8 Italienisch, 02.10.2026).
 *
 * Vorbild: `sperrlisteEs.ts` (27.09.2026). Die Lehre von dort gilt hier wörtlich: EINE Quelle für jede Stelle, die
 * Wörter für Kinder auswählt (Wortlisten `wordsIt.ts`, Pseudowort-Werkstatt des Generators, Lexikon-Nachtrag,
 * künftig jeder Text-Wächter der T-Chargen) - nicht fünf Listen, die einander widersprechen.
 *
 * Grundlage (Bauplan Italienisch §3 „Sperrliste", `recherche-italienisch-2026-10-02/texte-quellen.md` §3):
 *  · **mona** (Treccani: venetisch-volkstümlich, Vulva, übertragen „dumm") und **passera** (toskanisch auch Vulva)
 *    sind belegt [O]/[L]; **sega, pisello, patata, uccello, fico/figa …** sind Doppelsinn je Region [G] - nicht
 *    belegt, darum für die Übungswortlisten gesperrt (ein Kind bekommt dort Wörter in ZUFÄLLIGER Reihenfolge,
 *    „pisello patata" wäre ein Witz auf seine Kosten), in einem Text mit Zusammenhang dagegen erlaubt (Küche:
 *    *piselli*, *patate*).
 *  · Die Standard-Sperrliste (Treccani „Parole oscene": cazzo, coglione, stronzo, culo, puttana, bastardo, merda …),
 *    Regionalbeschimpfungen (terrone, polentone, pirla) und Wörter, die gegen ein KIND oder gegen Menschen mit
 *    Behinderung gehen (Hausregel: nie gegen ein Kind; Person zuerst: nicht „ciechi", nicht „handicappato").
 *
 * ── ZWEI STUFEN ─────────────────────────────────────────────────────────────
 * KERN ({@link IT_SPERR_KERN_STAEMME}, {@link IT_SPERR_KERN_WOERTER}): nie, nirgends - weder in Wortlisten noch im
 *   Lexikon, noch als Pseudowort, noch in einem Text. Die langen Schimpfwörter prüft ein STAMM (Teilzeichenkette):
 *   `cazz` trifft `cazzo`, `cazzata`, `incazzato` und kein gewöhnliches Wort. Kurze Wörter, die in harmlosen Wörtern
 *   stecken (`mona` ⇒ `monaco`, `troia` ⇒ `introiti`), stehen als EXAKTE Formen (Lehre aus `sperrlisteEs.ts`: der
 *   Stamm „cog" traf `recoger`). Eine exakte Form bekommt jede Beugung einzeln.
 * WORTBASIS ({@link IT_SPERR_WORTBASIS}): Doppelsinn, regional heikel, gegen ein Kind, Blasphemie-Bestandteile -
 *   NICHT in Übungswortlisten, NICHT im Vorlese-Lexikon (dort spräche die Stimme sie ganz), NICHT als Pseudowort; in
 *   einem Text mit Zusammenhang erlaubt, mit Prüfung. Nur exakte Formen.
 *
 * ⚠️ `cazzuola` (Maurerkelle) fällt unter den Stamm `cazz`: ein Wort, das kein Kind braucht - bewusst mitgesperrt.
 * ⚠️ `mongoli` (Mongolen) ist KEIN Schimpfwort und nicht gesperrt; gesperrt ist nur der Stamm `mongoloid`.
 */

/** Stämme (Teilzeichenketten, klein, ohne Akzent): jede Form, die sie enthält, ist gesperrt. */
export const IT_SPERR_KERN_STAEMME: readonly string[] = [
  "cazz", // cazzo, cazzata, incazzato (incazzarsi) …
  "coglion", // coglione, coglionata, coglioni
  "stronz", // stronzo, stronzata
  "puttan", // puttana, puttanata, puttaniere (auch die Pasta „puttanesca" - nicht für Kinder)
  "merd", // merda, merdoso
  "vaffanc", // vaffanculo
  "fottut", "fotter", "fottiti", // fottuto, fottere
  "pompin", // pompino
  "sborr", // sborrata
  "minchi", // minchia, minchione
  "frocio", "froci", // Schimpfwort gegen Menschen
  "ricchion", // dasselbe, süditalienisch
  "terron", // terrone/terroni (Nord gegen Süd)
  "polentone", // (Süd gegen Nord)
  "pirlon", // pirlone
  "mongoloid", // Beschimpfung gegen Menschen mit Behinderung
  "handicappat", // handicappato - Person zuerst: „persona con disabilità"
  "bestemmi", // bestemmia, bestemmiare
  "diocane", "dioporco",
];

/** Exakte Formen, nie und nirgends: kurze Wörter, die in harmlosen Wörtern stecken (monaco, introiti …). */
export const IT_SPERR_KERN_WOERTER: readonly string[] = [
  "mona", "monona", // belegt [O]: Treccani „móna" - nie verwenden
  "passera", "passere", "passerina", "passerine", // belegt [L]: toskanisch auch Vulva (der Vogel heisst `passero`)
  "culo", "culi", "culone", "culetto",
  "figa", "fighe", "fica",
  "troia", "troie", "troiaio", "troiata", "troiate",
  "scopare", "scopata", "scopate", // (die `scopa` - Besen, Kartenspiel - ist ein gewöhnliches Wort und nicht gesperrt)
  "bastardo", "bastarda", "bastardi", "bastarde",
  "cesso", "cessi", "zoccola", "zoccole", "baldracca", "baldracche", "checca", "checche",
  "negro", "negri", "negra", "negre", "negretto", // Beschimpfung (die Farbe heisst `nero`)
  "zingaro", "zingara", "zingari", "zingare", // Fremdbezeichnung, abwertend (Rom, Sinti)
  "pirla", "pirle", // Regionalbeschimpfung (Mailand)
];

/**
 * Nur für Übungswortlisten, Vorlese-Lexikon und Pseudowörter gesperrt (Doppelsinn, gegen ein Kind, regional heikel,
 * Blasphemie-Bestandteile, Themen, die ein Wortsalat nicht tragen soll). In einem Text mit Zusammenhang erlaubt.
 */
export const IT_SPERR_WORTBASIS: readonly string[] = [
  // Doppelsinn je Region [G] - die `sega`, der `pisello`, die `patata` stehen im Küchen- und Werkzeugtext zu Recht
  "sega", "seghe", "pisello", "piselli", "patata", "patate", "patatina", "patatine",
  "uccello", "uccelli", "uccellino", "uccellini", "banana", "banane",
  "fico", "fichi", "tette", "tetta", "zinne", "zinna",
  "palle", // „che palle" - die `palla` (Ball) bleibt erlaubt
  "pippa", "pippe", "tromba", "trombare", "marocchino", "marocchina", "marocchini", "marocchine",
  // Toilettenhumor: im Wortsalat ein Witz auf Kosten des Kindes
  "cacca", "caccole", "caccola", "cacare", "piscia", "pisciare", "pisciata", "scorreggia", "scorregge", "rutto", "rutti",
  // gegen ein Kind (Hausregel: nie gegen ein Kind) - als Wort im Wortsalat
  "stupido", "stupida", "stupidi", "stupide", "scemo", "scema", "scemi", "sceme",
  "idiota", "idioti", "cretino", "cretina", "cretini", "cretine", "imbecille", "imbecilli",
  "deficiente", "deficienti", "ritardato", "ritardata", "ritardati", "ritardate",
  "brutto", "brutta", "brutti", "brutte", "ciccione", "ciccia", "grasso", "grassa", "grassi", "grasse",
  "pazzo", "pazza", "pazzi", "pazze", "matto", "matta", "matti", "matte",
  // Person zuerst: nicht als Bezeichnung von Menschen
  "cieco", "cieca", "ciechi", "cieche", "sordo", "sorda", "sordi", "sorde", "zoppo", "zoppa", "storpio", "storpia",
  "finocchio", "finocchi", "disabile", "disabili",
  // Blasphemie-Bestandteile und Religion als Zufallswort
  "porco", "porca", "porci", "porche", "madonna", "cristo", "dio", "diavolo", "inferno",
  // Themen, die ein Wortsalat nicht tragen soll
  "sesso", "sessuale", "sessuali", "stupro", "stuprare", "porno", "pornografia",
  "droga", "droghe", "cocaina", "eroina", "spinello", "spinelli", "suicidio", "suicidarsi",
];

const AKZENT_WEG = /[̀-ͯ]/g;

function klein(wort: string): string {
  return wort.toLowerCase();
}

/** Klein und ohne Akzente: die Form, in der Stämme verglichen werden (`è` ⇒ `e`). */
function ohneAkzent(wort: string): string {
  return klein(wort).normalize("NFD").replace(AKZENT_WEG, "");
}

const KERN_EXAKT: ReadonlySet<string> = new Set(IT_SPERR_KERN_WOERTER);
const WORTBASIS_EXAKT: ReadonlySet<string> = new Set(IT_SPERR_WORTBASIS);

/** Die Teile eines Wortes mit Elision: `un'amica` ⇒ `un`, `amica`; ohne Apostroph das Wort selbst. */
function teile(wort: string): string[] {
  return klein(wort).split("'").filter((t) => t.length > 0);
}

/**
 * Ist dieses WORT (eine Wortform, ggf. mit Apostroph: `l'amico`) für Kinder überall gesperrt - auch in Texten?
 * Geprüft wird jede Teilform vor und nach einem Apostroph einzeln, damit `dell'amica` nicht an `dellamica` scheitert.
 */
export function istKernGesperrtIt(wort: string): boolean {
  for (const t of teile(wort)) {
    if (KERN_EXAKT.has(t)) return true;
    const k = ohneAkzent(t);
    if (IT_SPERR_KERN_STAEMME.some((s) => k.includes(s))) return true;
  }
  return false;
}

/**
 * Ist dieses Wort aus den ÜBUNGSWORTLISTEN, dem Vorlese-Lexikon und den Pseudowörtern des Generators ausgeschlossen?
 * (Kern + Wortbasis.) Texte mit Zusammenhang prüfen nur {@link istKernGesperrtIt}.
 */
export function gesperrtIt(wort: string): boolean {
  if (istKernGesperrtIt(wort)) return true;
  return teile(wort).some((t) => WORTBASIS_EXAKT.has(t));
}
