/**
 * ★★★★★ DIE EINE SPERRLISTE FÜR WEG „cs" (F6-cs, 03.10.2026).
 *
 * Vorbild: `sperrlisteIt.ts` und `sperrlisteEs.ts`. Die Lehre von dort gilt hier wörtlich: EINE Quelle für jede Stelle, die
 * Wörter für Kinder auswählt (Wortlisten `wordsCs.ts`, Pseudowort-Werkstatt des Generators, Lexikon-Nachtrag, künftig jeder
 * Text-Wächter der T-Chargen) - nicht fünf Listen, die einander widersprechen.
 *
 * ⚠️ UNGEPRÜFT von einer Person mit Tschechisch als Erstsprache: Die Liste ist aus eigenem Sprachwissen und den
 * Hausregeln (Glossar §1 Regel 2/3, §4: nie gegen ein Kind, Person zuerst) gebaut, NICHT an einer amtlichen Liste belegt
 * (es gibt keine für Tschechisch, und das macOS-Wörterbuch prüft nichts, Falle 61). Sie gehört in den Prüfbericht P7 der
 * Wörter (Leitfaden Falle 59). Lieber ein harmloses Wort zu viel gesperrt als ein Witz auf Kosten eines Kindes.
 *
 * ── ZWEI STUFEN ─────────────────────────────────────────────────────────────
 * KERN ({@link CS_SPERR_KERN_STAEMME}, {@link CS_SPERR_KERN_WOERTER}): nie, nirgends - weder in Wortlisten noch im Lexikon,
 *   noch als Pseudowort, noch in einem Text. Die langen Wörter prüft ein STAMM (Teilzeichenkette, MIT Diakritika - anders
 *   als Italienisch: `píč` trifft nicht `pic`, `čur` nicht `cur`): `kurv` trifft `kurva`, `kurvit`, `zkurvený` und kein
 *   gewöhnliches Wort. Kurze Wörter, die in harmlosen Wörtern stecken (`mongol` ⇒ `mongolský`), stehen als EXAKTE Formen.
 *   Eine exakte Form bekommt jede Beugung einzeln.
 * WORTBASIS ({@link CS_SPERR_WORTBASIS_STAEMME}, {@link CS_SPERR_WORTBASIS}): Doppelsinn, gegen ein Kind, Toilettenhumor,
 *   Themen, die ein Wortsalat nicht tragen soll - NICHT in Übungswortlisten, NICHT im Vorlese-Lexikon (dort spräche die
 *   Stimme sie ganz), NICHT als Pseudowort; in einem Text mit Zusammenhang erlaubt, mit Prüfung.
 *
 * ⚠️ `židle` (Stuhl) trägt den Stamm `žid` - darum steht dort kein Stamm, und `žid`/`Žid` ist ohnehin kein Schimpfwort
 *    (IJP: Religion klein, Volk gross). ⚠️ `pero` (Stift) ist erlaubt, `péro` (Feder, Slangwort) gesperrt. ⚠️ `kozy` ist
 *    die Mehrzahl von Ziege UND Slang - gesperrt für Wortlisten (die Ziege heisst dort `koza`).
 */

/** Stämme (Teilzeichenketten, klein, MIT Diakritika): jede Form, die sie enthält, ist gesperrt - auch im Text. */
export const CS_SPERR_KERN_STAEMME: readonly string[] = [
  "kurv", // kurva, kurvy, kurvit, zkurvený
  "kurev", // kurevský
  "prdel", // prdel, prdele, prdelka
  "píč", // píča, píčo, píčovina
  "čurák", // čurák, čuráci
  "zmrd", // zmrd, zmrdi
  "mrdat", "mrdá", "mrdal", "mrdn",
  "jebat", "jebe", "jebu", "jebl", "jebn", "zjeb", "pojeb", "vyjeb", "rozjeb", "nejeb",
  "sračk", "sraček", // sračka, sračky
  "kokot", // kokot, kokotina
  "debil", "kretén", "idiot", // Beschimpfungen gegen Menschen
  "hajzl", // hajzl, hajzlík (auch Toilette, vulgär)
  "šuká", "šukat", "šukn", "šoust", // Geschlechtsverkehr, vulgär
  "ptákovin", // ptákovina
  "buzer", "buzík", "buzna", "teplouš", // Schimpfwörter gegen Schwule
  "cikán", // Fremdbezeichnung, abwertend (Roma)
  "mongoloid", // Beschimpfung gegen Menschen mit Behinderung
  "děvk", // děvka (die `děvče` bleibt: Mädchen)
];

/** Exakte Formen, nie und nirgends: kurze Wörter, die in harmlosen Wörtern stecken. */
export const CS_SPERR_KERN_WOERTER: readonly string[] = [
  "srát", "sere", "seru", "sereš", "serou", "srala", "sral", "srali", "srani", "sraní",
  "posral", "posrat", "posranej", "posraný", "nasral", "nasrat", "nasranej", "nasraný",
  "vysral", "vysrat", "zasral", "zasranej", "zasraný", "zasrat",
  "mongol", "mongoli", // Schimpfwort klein geschrieben (Mongolei: `mongolský`, `Mongol`)
  "retard", "retardi", "retarde",
  "čůze", "čuně", "pizda",
  "zkurvit", "zkurvený",
  // ⚠️ KEINE Stämme: `hovn` träfe `knihovna` (Bücherei!) und `duchovní`, `kund` träfe `sekunda`, `negr` träfe `negramotný` -
  // gemessen an den Tatoeba-Wortformen (`tests/tastenflow-cs-woerter.test.ts`). Darum nur die ganzen Formen.
  "hovno", "hovna", "hovnu", "hovnem", "hovny", "hovnech", "hovnům", "hovnivál", "hovnivala", "hovnař",
  "kunda", "kundy", "kundu", "kundo", "kundou", "kundě",
  "negr", "negři", "negra", "negru", "negrem", "negrů", "negrovi", // Beschimpfung (die Farbe heisst `černý`)
];

/** Stämme nur für Übungswortlisten, Vorlese-Lexikon und Pseudowörter (in einem Text mit Zusammenhang erlaubt). */
export const CS_SPERR_WORTBASIS_STAEMME: readonly string[] = [
  "blb", // blbý, blbost, blbec
  "hloup", "hlupák", "hlupác", // gegen ein Kind
  "pitom", // pitomý, pitomec
  "vražd", // vražda, vraždu
  "znásil", // znásilnit, znásilnění
  "sebevraž", // sebevražda, sebevražedný
  "sexuál", // sexuální
  "pornogr", "porno",
  "ošklivý", "škared", // gegen ein Kind
  "tlusť", "tlouštík",
  "slepec", "slepc", // Person zuerst
  "hluchoně",
  "kripl",
  "narkoman",
];

/** Exakte Formen nur für Wortlisten, Lexikon und Pseudowörter. */
export const CS_SPERR_WORTBASIS: readonly string[] = [
  // Doppelsinn [G]: Slang für Geschlechtsteile und Körperteile
  "péro", "péra", "pérem", "pérům", "ptáček", "ptáčci", "ptáčka", "ptáčku", "ptáčky",
  "prsa", "prsy", "prsou", "prsům", "kozy",
  "vůl", "vole", "voli", "hovado", "hovada",
  // Toilettenhumor: im Wortsalat ein Witz auf Kosten des Kindes
  "prd", "prdy", "prdět", "prdí", "prdla", "prdl", "kaka", "kakat", "kaká", "kakání",
  "čůrat", "čůrá", "čurat", "čurá", "čůrek", "moč", "moči", "močit",
  "smrad", "smrdí", "smrdět", "smrdutý", "smradlavý",
  "hnusný", "hnusná", "hnusné", "hnusní",
  "svině", "sviní", "sviň",
  // Nacharbeit 10.10.2026 (zuvor nur im Buchstabensalat ausgeschlossen): Doppelsinn, gegen ein Kind, Alkohol.
  // BEWUSST NICHT hier: husa, koza, osel, tele - Tiernamen, die in Wortliste (husa), Serie (Frgál a koza) und Zeilen (osel, tele) harmlos
  // gebraucht werden und von denen es keine eigene Schimpfform gibt; der Wächter hält koza/kozel ausdrücklich frei. Sie bleiben im Salat gesperrt.
  "panic", "panice", "drzá", "chlast", "opít",
  // gegen ein Kind (Hausregel: nie gegen ein Kind) - als Wort im Wortsalat
  "šílený", "šílená", "šílené", "šílení", "blázen", "blázni", "bláznivý", "bláznivá", "bláznivé",
  "líný", "líná", "líné", "líní", "lenoch", "nemehlo", "hňup", "hňupové",
  "tlustý", "tlustá", "tlusté", "tlustí", "škaredý", "škaredá", "škaredé", "škaredí",
  "ošklivý", "ošklivá", "ošklivé", "ošklivěji",
  // Person zuerst: nicht als Bezeichnung von Menschen
  "slepý", "slepá", "slepé", "slepí", "slepou", "slepého", "slepému", "slepých",
  "hluchý", "hluchá", "hluché", "hluší", "hluchého", "hluchoněmý",
  "chromý", "chromá", "chromé", "kulhavý", "mrzák", "mrzáci", "invalida", "invalidé", "invalid",
  "postižený", "postižená", "postižené", "postižení", "postiženého", "postiženému", "postiženým",
  // Geschlechtsverkehr, Themen, die ein Wortsalat nicht tragen soll
  "sex", "sexu", "sexy", "sexem", "sexuální", "erotika", "erotický", "úchyl", "úchylák", "pervert",
  "píchat", "píchá", "píchal", "píchala", "píchnout", "píchne", "kouřit", "kouří", "kouřil", "kouřila",
  "droga", "drogy", "drogu", "drogou", "drogách", "drogami", "kokain", "heroin", "marihuana", "hašiš", "pervitin",
  "alkohol", "alkoholu", "alkoholik", "opilý", "opilá", "opilí", "opilec", "cigareta", "cigarety", "cigaret",
  "zabít", "zabil", "zabila", "zabili", "zabilo", "zabije", "zabiju", "zabijí", "zabíjet", "zabíjí",
  "vrah", "vraha", "vrahy", "vrahů", "vrahem", "mrtvola", "mrtvoly",
  "umřít", "umřel", "umřela", "umřeli", "zemřít", "zemřel", "zemřela", "zemřeli",
  // Blasphemie-Bestandteile und Religion als Zufallswort
  "bože", "bůh", "boha", "bohu", "bohem", "ježíš", "ježíši", "satan", "satana", "ďábel", "ďábla", "peklo", "pekla", "pekle",
];

function klein(wort: string): string {
  return wort.normalize("NFC").toLowerCase();
}

const KERN_EXAKT: ReadonlySet<string> = new Set(CS_SPERR_KERN_WOERTER);
const WORTBASIS_EXAKT: ReadonlySet<string> = new Set(CS_SPERR_WORTBASIS);

/**
 * Ist dieses WORT (eine Wortform) für Kinder überall gesperrt - auch in Texten? Verglichen wird klein und MIT Diakritika
 * (`pic` ist nicht `píč`).
 */
export function istKernGesperrtCs(wort: string): boolean {
  const k = klein(wort);
  if (KERN_EXAKT.has(k)) return true;
  return CS_SPERR_KERN_STAEMME.some((s) => k.includes(s));
}

/**
 * Ist dieses Wort aus den ÜBUNGSWORTLISTEN, dem Vorlese-Lexikon und den Pseudowörtern des Generators ausgeschlossen?
 * (Kern + Wortbasis.) Texte mit Zusammenhang prüfen nur {@link istKernGesperrtCs}.
 */
export function gesperrtCs(wort: string): boolean {
  if (istKernGesperrtCs(wort)) return true;
  const k = klein(wort);
  if (WORTBASIS_EXAKT.has(k)) return true;
  return CS_SPERR_WORTBASIS_STAEMME.some((s) => k.includes(s));
}
