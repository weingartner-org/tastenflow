/**
 * ★★★★★ DIE EINE SPERRLISTE FÜR WEG „pl" (F5-F8 Polnisch, 03.10.2026).
 *
 * Vorbild: `sperrlisteIt.ts` / `sperrlisteEs.ts`. Die Lehre von dort gilt hier wörtlich: EINE Quelle für jede Stelle, die
 * Wörter für Kinder auswählt (Wortlisten `wordsPl.ts`, Pseudowort-Werkstatt des Generators, Lexikon-Nachtrag, künftig
 * jeder Text-Wächter der T-Chargen) - nicht fünf Listen, die einander widersprechen.
 *
 * Grundlage (Recherche `recherche-polnisch-2026-10-02/texte-quellen.md` §3.2 und §3.4):
 *  · **Fünf Wurzel-Vulgarismen** (Grochowski: chuj, pizda, jebać, pierdolić, kurwa) - alle anderen Vulgarismen sind
 *    Ableitungen davon (Vorsilben po-, wy-, roz-, prze-, s-, za-, od-, przy-, Verkleinerungen). Darum prüft hier ein
 *    STAMM (Teilzeichenkette), nicht eine Wortliste: `jeb` trifft `jebać`, `zajebisty`, `wyjebany`.
 *  · **Schreibung ohne Ogonki** (R0 §6.2: viele Menschen schreiben „bez ogonków"): jede Prüfung vergleicht ohne
 *    Diakritika (`jebać` = `jebac`, `gówno` = `gowno`); das `ł` fällt dabei mit, es hat keine Zerlegung (Glossar §3 Nr. 12).
 *  · **Scunthorpe-Problem** (§3.4 Nr. 3): kurze Wörter, die in harmlosen Wörtern stecken (`cyc` ⇒ `cykl`, `dup` ⇒ `duplikat`,
 *    `sra` ⇒ `srebrny`), stehen als EXAKTE Formen, nicht als Stamm. Gemessen am 03.10.2026 gegen alle 55.886 Wortformen der
 *    Tatoeba-Sätze: jeder Stamm trifft nur Schimpfwörter (der Test `tastenflow-pl-woerter` hält das fest).
 *  · Doppelsinn je Region und Wörter, die ein Wortsalat nicht tragen soll (`jaja`, `kutas`, `pedał`, `szmata`),
 *    stehen in der Wortbasis: nicht in Übungswortlisten, nicht im Vorlese-Lexikon, nicht als Pseudowort - in einem Text
 *    mit Zusammenhang erlaubt, mit Prüfung („jajka" für Eier bleibt erlaubt, Recherche §3.2).
 *
 * ⚠️ NICHT von einer Muttersprachlerin gelesen (Recherche §3.4 Nr. 5: „Wer prüft: eine polnische Muttersprachlerin oder ein
 * Muttersprachler, nicht Claude allein"). Die Liste gehört in den Prüfbericht P7; sie ist bewusst eher zu streng als zu
 * milde - ein zu viel gesperrtes Wort kostet ein Wort im Wortsalat, ein zu wenig gesperrtes einen Satz gegen ein Kind.
 *
 * ── ZWEI STUFEN ─────────────────────────────────────────────────────────────
 * KERN ({@link PL_SPERR_KERN_STAEMME}, {@link PL_SPERR_KERN_WOERTER}): nie, nirgends - weder in Wortlisten noch im
 *   Lexikon, noch als Pseudowort, noch in einem Text.
 * WORTBASIS ({@link PL_SPERR_WORTBASIS}): Doppelsinn, regional heikel, gegen ein Kind, Themen, die ein Wortsalat nicht
 *   tragen soll - NICHT in Übungswortlisten, NICHT im Lexikon, NICHT als Pseudowort; in einem Text mit Zusammenhang
 *   erlaubt (z. B. „cholera" als Krankheit, „diabeł" im Märchen). Nur exakte Formen.
 */

/**
 * Anfänge (klein, OHNE Diakritika): jede Form, die damit BEGINNT, ist gesperrt. Für Wurzeln, die mitten in gewöhnlichen Wörtern
 * stecken: `chuj` steckt in `zakochuje`, `wymachując`, `nadmuchuje`, `przesłuchują`, `cechuje` (gemessen, Tatoeba), `porno` in
 * `odporność` - als Stamm hätte jede dieser Formen das Kind getroffen.
 */
export const PL_SPERR_KERN_ANFAENGE: readonly string[] = [
  "chuj", // chuj, chuja, chujowy, chujnia (Wurzel 2)
  "huj", // huj, huje (Schreibvariante)
  "porno", // porno, pornografia, pornograficzny (ein Anfang, kein Stamm: `odporność`)
];

/** Stämme (Teilzeichenketten, klein, OHNE Diakritika und ohne `ł`): jede Form, die sie enthält, ist gesperrt. */
export const PL_SPERR_KERN_STAEMME: readonly string[] = [
  "kurw", // kurwa, kurewski, skurwysyn, wkurwiać (Wurzel 1; `kurczak`, `kurort` treffen nicht)
  "pizd", // pizda, piździ, spierdolić …, (Wurzel 3)
  "jeb", // jebać, jebany, zajebisty, wyjebać, zjebany, odjebać … (Wurzel 4; der Test prüft, dass kein harmloses Wort getroffen wird)
  "pierd", // pierdolić, pierdzieć, pierdoła, spierdalaj, pierdnąć (Wurzel 5)
  "gown", // gówno, gówniarz, gównem (ohne Diakritika verglichen: „gowno")
  "dziwk", // dziwka, dziwki, dziwkarz
  "debil", // Beschimpfung gegen Menschen mit Behinderung, auch „debilny"
  "kretyn", // dito
  "imbecyl", // dito
  "uposledz", // upośledzony - Person zuerst: „osoba z niepełnosprawnością intelektualną"
  "mongoloid", // Beschimpfung
  "czarnuch", // Beschimpfung nach Herkunft
  "ciapat", // ciapaty (Beschimpfung nach Herkunft)
];

/** Exakte Formen (klein, OHNE Diakritika): kurze Wörter, die in harmlosen Wörtern stecken (`cyc` ⇒ `cykl`, `dup` ⇒ `duplikat`). */
export const PL_SPERR_KERN_WOERTER: readonly string[] = [
  // dupa & Co.: „Kinder-/Schultexte meiden" (Recherche §3.2)
  "dupa", "dupy", "dupie", "dupe", "dupek", "dupki", "dupcia", "dupsko", "dupci",
  // Brust (vulgär)
  "cyc", "cycki", "cyckow", "cycek", "cycka", "cyckach",
  // Schimpfwörter, kurz (vulgäre Bedeutung; `dymać` ist nicht `dym`, `srać` nicht `ssać`)
  "fiut", "fiuta", "fiuty", "fiucie", "cipa", "cipy", "cipie", "cipe", "cipka", "cipki", "cipke", "cipek",
  "szczac", "szczam", "szczasz", "szczaja", "szczal", "szczala",
  "srac", "sraka", "sraki", "srake", "sram", "srasz", "sraja", "sral", "srala",
  "dymac", "dymam", "dymasz", "dymaja", "dymal",
  "ciota", "cioty", "ciote", "cwel", "cwele", "cwela", "pizgac", "pizga",
  // Beschimpfungen nach Herkunft und gegen Menschen (Recherche §3.2: „nicht verwenden")
  "ciapaty", "ciapaci", "rusek", "szwab", "szwaby", "szwaba", "pepik", "pepiki", "pepika", "ukrop", "ukropy", "moskal", "moskale",
  "cygan", "cygana", "cyganie", "cyganka", "cyganki", "cyganskie",
  "kaleka", "kaleki", "kalekie", "ulomny", "ulomna", "ulomne",
  // milde Flüche (in Kindertexten weglassen, Recherche §3.2)
  "psiakrew", "kurde", "kurna", "cholernie", "cholerny", "cholerna", "cholerne",
  "skurczybyk", "sukinsyn", "sukinsyny",
];

/**
 * Nur für Übungswortlisten, Vorlese-Lexikon und Pseudowörter gesperrt (OHNE Diakritika verglichen). Doppelsinn, regional
 * heikel, gegen ein Kind, Blasphemie-Bestandteile, Themen, die ein Wortsalat nicht tragen soll. In einem Text mit
 * Zusammenhang erlaubt.
 *
 * ⚠️ Wegen des Vergleichs OHNE Ogonki darf hier kein Wort stehen, dessen Form ohne Ogonki ein anderes, gewöhnliches Wort
 * ist: nicht `pała` (= `palą`, „sie rauchen"), nicht `pieprzę` (= `pieprze`), nicht `kurczę` (= Küken, `kurczęta`). Der Test
 * `tastenflow-pl-woerter` prüft jede Form dieser Liste gegen die Tatoeba-Wortformen und nennt Treffer, die nicht gemeint sind.
 */
export const PL_SPERR_WORTBASIS: readonly string[] = [
  // Doppelsinn - „jajka" (Eier) bleibt erlaubt, `jaja` nicht (Recherche §3.2)
  "jaja", "kutas", "kutasy", "kutasa", "kutasem", "kutasie", "pedal", "pedaly", "pedale", "pedalem", "pedalu",
  "szmata", "szmaty", "szmate", "szmatami", "suka", "suki", "suke", "gnoj", "gnoje", "gnojek", "gnojki",
  "murzyn", "murzyna", "murzyni", "murzynek", "murzynka", "kartacz", "kartacze", "gorol", "gorole", "hanys", "hanysy", "ceper", "cepry",
  // Vulgäres und Schimpfwörter gegen Menschen (Nacharbeit 10.10.2026; zuvor nur im Buchstabensalat ausgeschlossen).
  // BEWUSST NICHT hier: `pysk` (Maul/Schnauze) - Tierwort in Serie Teens 1 und Schreibprobe, keine eigene Schimpfform; bleibt nur im Buchstabensalat gesperrt.
  // (Die Wächter der Serien und Bänke prüfen auch die Wortbasis auf jeden Text, deshalb wäre ein harmloses Vorkommen hier ein Fehler.)
  "suko", "loda", "durnia", "lenia", "sknera", "kutwa",
  "cholera", "cholery", "choleru", "choleze", "pieprzyc", "pieprzysz", "pieprzy", "pieprzyl",
  // Toilettenhumor: im Wortsalat ein Witz auf Kosten des Kindes
  "kupa", "kupy", "kupe", "kupka", "siusiu", "sikac", "bekac",
  // gegen ein Kind (Hausregel: nie gegen ein Kind) - als Wort im Wortsalat
  "glupi", "glupia", "glupie", "glupek", "glupcy", "glupota", "idiota", "idioci", "idiotka", "idiotyczny", "idiotyczna",
  "durny", "durna", "durne", "duren", "tepy", "tepa", "tepe", "tepak", "ciemniak", "ciemniaki",
  "brzydki", "brzydka", "brzydkie", "brzydal", "brzydula", "gruby", "gruba", "grube", "grubas", "grubasy", "tlusty", "tlusta", "tluste",
  "wariat", "wariaci", "wariatka", "szalony", "szalona", "szalone", "swir", "swiry", "psychol", "psychole",
  "leniwy", "leniwa", "leniwe", "leniuch", "leniuchy",
  // Person zuerst: nicht als Bezeichnung von Menschen
  "slepy", "slepa", "slepe", "slepi", "slepcy", "gluchy", "glucha", "gluche", "glusi", "gluchoniemy",
  "zboczeniec", "zboczency", "zboczona", "zboczony", "perwers", "perwersja",
  // Blasphemie-Bestandteile und Religion als Zufallswort
  "bog", "boga", "bogu", "bogiem", "boze", "jezus", "jezu", "jezusie", "jezusa", "chrystus", "chrystusa", "boska", "boski", "boskie",
  "diabel", "diabla", "diably", "diable", "diablem", "szatan", "szatana", "szatanie", "pieklo", "piekla", "piekle", "pieklem",
  "matko", "psiakosc",
  // Themen, die ein Wortsalat nicht tragen soll
  "seks", "sex", "seksu", "seksowny", "seksowna", "seksualny", "seksualna", "seksualne", "sperma", "spermy", "erotyka", "erotyczny",
  "gwalt", "gwaltu", "gwalty", "gwaltem",
  "narkotyk", "narkotyki", "narkotykow", "narkotykach", "kokaina", "heroina", "marihuana", "haszysz", "amfetamina", "dopalacze",
  "papieros", "papierosy", "papierosa", "papierosow", "alkoholik", "alkoholicy", "pijak", "pijacy", "pijany", "pijana", "pijane",
  "zabic", "zabij", "zabil", "zabila", "zabojca", "zabojstwo", "morderca", "morderstwo", "mordowac", "mordowal", "zwloki", "trup", "trupy",
];

/**
 * Themen, die ein Wortsalat und eine Übungswortliste nicht tragen sollen, deren Beugungsformen aber zu zahlreich sind für
 * eine exakte Liste: Stämme wie die des Kerns, aber nur für Wortlisten, Lexikon und Pseudowörter (nie für einen Text mit
 * Zusammenhang, z. B. ein Sachtext über „wózek inwalidzki" oder „samobójstwo" in einer Nachricht für die Lehrkraft).
 */
export const PL_SPERR_WORTBASIS_STAEMME: readonly string[] = [
  "pedofil", "pornogr", "gwalc", "samobojs",
  "inwalid", // inwalida, inwalidzki - Person zuerst: „osoba z niepełnosprawnością", „wózek"
];

/** Diakritika ab; das `ł` hat keine Zerlegung und fällt gesondert (Glossar §3 Nr. 12: `normalize("NFD")` allein lässt es stehen). */
const AKZENT_WEG = /[̀-ͯ]/g;

function klein(wort: string): string {
  return wort.toLowerCase();
}

/** Klein und ohne Ogonki, Kreska, Kropka und ohne Strich durch das `l`: die Form, in der alles verglichen wird (`jebać` ⇒ `jebac`). */
export function ohneOgonki(wort: string): string {
  return klein(wort).normalize("NFD").replace(AKZENT_WEG, "").replace(/ł/g, "l");
}

const KERN_EXAKT: ReadonlySet<string> = new Set(PL_SPERR_KERN_WOERTER.map(ohneOgonki));
const WORTBASIS_EXAKT: ReadonlySet<string> = new Set(PL_SPERR_WORTBASIS.map(ohneOgonki));

/**
 * Ist dieses WORT (eine Wortform) für Kinder überall gesperrt - auch in Texten? Verglichen wird mit und ohne Ogonki
 * (`ohneOgonki`): „jebać" und „jebac" sind dasselbe Wort, ein Kind schreibt vielleicht ohne.
 */
export function istKernGesperrtPl(wort: string): boolean {
  const k = ohneOgonki(wort);
  if (KERN_EXAKT.has(k)) return true;
  if (PL_SPERR_KERN_ANFAENGE.some((a) => k.startsWith(a))) return true;
  return PL_SPERR_KERN_STAEMME.some((s) => k.includes(s));
}

/**
 * Ist dieses Wort aus den ÜBUNGSWORTLISTEN, dem Vorlese-Lexikon und den Pseudowörtern des Generators ausgeschlossen?
 * (Kern + Wortbasis.) Texte mit Zusammenhang prüfen nur {@link istKernGesperrtPl}.
 */
export function gesperrtPl(wort: string): boolean {
  if (istKernGesperrtPl(wort)) return true;
  const k = ohneOgonki(wort);
  return WORTBASIS_EXAKT.has(k) || PL_SPERR_WORTBASIS_STAEMME.some((s) => k.includes(s));
}
