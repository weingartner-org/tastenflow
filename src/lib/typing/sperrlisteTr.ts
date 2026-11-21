/**
 * ★★★★★ DIE EINE SPERRLISTE FÜR WEG „tr" (F5-F8 Türkisch, 03.10.2026).
 *
 * Vorbild: `sperrlisteIt.ts` und `sperrlisteEs.ts`. Die Lehre von dort gilt hier wörtlich: EINE Quelle für jede Stelle,
 * die Wörter für Kinder auswählt (Wortlisten `wordsTr.ts`, Pseudowort-Werkstatt des Generators, Lexikon-Nachtrag, die
 * Wortspiele, die ihren Vorrat über `wortquelle()` ziehen, künftig jeder Text-Wächter der T-Chargen).
 *
 * Grundlage (Glossar `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md` §4 Nr. 5/6, `texte-quellen.md` §3): ALLE Wörter dieser
 * Datei sind [G] - eigenes Sprachwissen, NICHT an einer Quelle belegt; vor dem Einschalten des Weges von einer Person mit
 * Türkisch als Erstsprache zu lesen (offener Punkt im Befund). Die Liste fängt ab, was ein Wort-Drill, ein Pseudowort oder
 * ein umgedrehtes Wort einem Kind in die Zeile legen könnte - sie ist ein Netz, keine Zensur von Texten mit Zusammenhang.
 *
 * ── Was Türkisch anders macht ───────────────────────────────────────────────
 *  1. **Agglutination.** Ein Stamm trägt viele Endungen (`sik-ti-r`, `göt-ün-e`). Eine reine Wortliste fängt das nicht,
 *     ein reiner Teilstring-Stamm trifft zu viel (`yarak` steckt in `ayarlayarak`, `kıyarak`, `çük` in `küçük`, `sikim` in
 *     `klasikimiz`, `amına` in `tamına`). Darum drei Prüfarten: Teilzeichenkette (nur lange, eindeutige Stämme), WORTANFANG
 *     (der Stamm steht am Wortanfang - die Endungen kommen dahinter) und EXAKTE Formen (kurze Wörter).
 *  2. **i/ı, ş/s, ğ/g …: die Zeichen sind Wörter.** Der belegte Fall (Texte-Recherche §3.3): `sıkışınca` ohne Punkt-
 *     Unterschied wird `sikişince`. Darum wird jedes Kern-Wort ZWEIMAL geprüft - in der richtigen Schreibung und im
 *     „gefalteten" Text (`ı→i ş→s ğ→g ç→c ö→o ü→u â→a î→i û→u`, {@link faltenTr}). Die gefaltete Prüfung gilt für Wortlisten,
 *     Pseudowörter, Wortspiele und das Lexikon NICHT (Vorlesen), siehe unten; sie ist {@link gesperrtGefaltetTr}.
 *  3. **Gross-/Kleinschreibung nur mit dem Gebietsschema `tr`** (`kleinFuer`): `İ ⇒ i`, `I ⇒ ı` - `toLowerCase()` ohne
 *     Sprache machte aus `İÇ` ein `i̇ç` mit Kombinationspunkt und fände das Kern-Wort nie.
 *  4. **Der Apostroph steht nur an Eigennamen** (`Ali'nin`): jede Teilform vor und nach ihm wird einzeln geprüft.
 *
 * ── DREI STUFEN ─────────────────────────────────────────────────────────────
 * KERN ({@link TR_SPERR_KERN_TEILE}, {@link TR_SPERR_KERN_ANFAENGE}, {@link TR_SPERR_KERN_WOERTER}): nie, nirgends - weder
 *   in Wortlisten noch im Lexikon, noch als Pseudowort, noch in einem Text. Schimpf-, Sexual- und Vulgärwörter, Schimpfwörter
 *   gegen Menschen (Herkunft, Behinderung), Fluch-Formeln.
 * WORTBASIS ({@link TR_SPERR_WORTBASIS_WOERTER}, {@link TR_SPERR_WORTBASIS_ANFAENGE}): Doppelsinn, Toilettenhumor, Wörter
 *   gegen ein Kind (Hausregel: nie gegen ein Kind), Person zuerst (nicht `kör` als Bezeichnung), Religion als Zufallswort,
 *   Politik/Konflikt, Themen, die ein Wortsalat nicht tragen soll - NICHT in Übungswortlisten, NICHT im Vorlese-Lexikon,
 *   NICHT als Pseudowort; in einem Text mit Zusammenhang erlaubt (Küche: `kaşar peyniri`, `hıyar`).
 * STAATSSYMBOLE (in der Wortbasis): `atatürk`, Bayrak, İstiklal, Andımız - NIE in einer erzeugten Zeile, einem Wortspiel,
 *   einem umgedrehten oder vertauschten Wort (Gesetz 5816 bestraft die öffentliche Herabsetzung seines Andenkens;
 *   Glossar §4 Nr. 6). In einem würdigen Sachtext ist der Name erlaubt - Wortbasis, nicht Kern.
 *
 * ⚠️ Die gefaltete Prüfung gilt NUR dem Kern: `kör ⇒ kor` (ein harmloses Wort) und `ölü ⇒ olu` (Anfang von `olur`) dürften
 *    die Wortbasis nie so treffen.
 * ⚠️ Wörter, die ein Kind braucht und die der Kern im gefalteten Zustand trifft, gibt es nicht: `sık`, `şık` (gefaltet `sik`)
 *    stehen darum nicht in den Wortlisten - bewusst, kein Verlust (Bauplan Türkisch Q, Glossar §4 Nr. 2).
 */
import { kleinFuer } from "./sprachRegister";

/** Kleinschreibung in der Sprache des Wortes (`İ ⇒ i`, `I ⇒ ı`); Alt-Aufrufer ohne Sprache wären hier falsch. */
function klein(wort: string): string {
  return kleinFuer(wort, "tr");
}

/** Die Zeichen, die ein türkischer Text ohne türkische Tastatur durch Grundbuchstaben ersetzt. */
const FALTUNG: Readonly<Record<string, string>> = {
  ı: "i", ş: "s", ğ: "g", ç: "c", ö: "o", ü: "u", â: "a", î: "i", û: "u",
};

/**
 * Klein UND gefaltet: `ı ş ğ ç ö ü â î û` ⇒ `i s g c o u a i u` (der Text ohne Sonderzeichen, wie ihn ein Kind schreibt,
 * dessen Tastatur sie nicht liefert - `sıkışınca ⇒ sikisinca`, Texte-Recherche §3.3).
 */
export function faltenTr(wort: string): string {
  let aus = "";
  for (const z of klein(wort)) aus += FALTUNG[z] ?? z;
  return aus;
}

/**
 * Teilzeichenketten (klein, mit Sonderzeichen), die in KEINEM gewöhnlichen Wort stecken: jede Form, die sie enthält, ist
 * überall gesperrt. Jede Länge wurde gegen die 12.000 häufigsten Wortformen der Tatoeba-Originale geprüft
 * (`tests/tastenflow-tr-woerter.test.ts`, Abschnitt 1): kein Fund.
 */
export const TR_SPERR_KERN_TEILE: readonly string[] = [
  "orospu", "orspu", "orosbu", // Hure (Schimpfwort)
  "amcık", // Vulva (Schimpfwort; `amca` - der Onkel - und `amcı` stehen NICHT darin)
  "yarrak", "yarrağ", "dalyarak", // Penis (Schimpfwort; `yarrağım` trägt `ğ`), Fluch-Zusammensetzung
  "pezevenk", "gavat", // Zuhälter (Schimpfwort)
  "kahpe", "kaltak", "sürtük", "yavşak", // Schimpfwörter gegen Frauen/Menschen
  "fahişe", "kerhane", "genelev", // Prostitution
  "siktir", "sikiş", "sikik", "sikeyim", "sikerim", // Verb `sikmek` und seine Fluchformen (vulgär)
  "götveren", "götlek", "götoş", // Zusammensetzungen mit `göt`
  "gerizekalı", "gerizekâlı", // Beschimpfung gegen Menschen mit Behinderung
  "koduğum", // Fluchformel („amına koduğumun"); `kodu`, `kodum` (mein Code) sind harmlos
  "mongoloid", // dasselbe
  "dangalak", // Schimpfwort
];

/**
 * Wortanfänge (klein, mit Sonderzeichen): das Wort BEGINNT mit dem Stamm - die türkischen Endungen kommen dahinter
 * (`siktir`, `siktim`, `taşaklar`). Wo der Stamm als Teilzeichenkette ein gewöhnliches Wort träfe (`yarak` in `kıyarak`,
 * `amına` in `tamına`, `sikim` in `klasikimiz`), steht er hier.
 */
export const TR_SPERR_KERN_ANFAENGE: readonly string[] = [
  "sikt", "sikiş", "sikik", "sikeyim", "sikerim", "sikme", "sikim", "siker", // sikmek: vulgär
  "yarak", "yarağ", // Penis (Schimpfwort); die Verben `yarar`, `yaratmak` beginnen anders
  "taşak", "taşşak", "taşağ",
  "amına", "amını", // Fluchformel
  "sıçm", "sıçt", "sıçıp", "sıçıy", "sıçar", "sıçac", "sıçış", "sıçı", // `sıçmak` (vulgär); `sıçramak`, `sıçan` beginnen mit `sıçr`/`sıça`
  "ibne", "puşt", // Beschimpfung gegen Menschen
  "zenci", "çingene", "gavur", // Fremdbezeichnungen, abwertend (Herkunft, Religion)
];

/**
 * Exakte Formen (klein, mit Sonderzeichen): kurze Wörter, die in gewöhnlichen Wörtern stecken (`çük` in `küçük`,
 * `bok` in `boks`, `göt` in `götürmek`, `sik` in `klasik`). Jede Beugung bekommt ihre eigene Zeile.
 */
export const TR_SPERR_KERN_WOERTER: readonly string[] = [
  "sik", "sikler", // nur die Form `sik` selbst: `sikke` (Münze), `siklet`, `klasik` sind harmlos
  "göt", "götü", "götüm", "götün", "götünü", "götüne", "götünde", "götler", "götleri", // `götürmek` (mitnehmen) ist harmlos
  "bok", "boku", "bokum", "bokun", "bokunu", "boklar", "boktan", "boklu", "bokluk", // `boks`, `bokal` sind harmlos
  "piç", "piçi", "piçin", "piçler", "piçlik",
  "çük", "çükü", "çüküm", "çükler", // `küçük` ist harmlos
  "oç", "amk", "aq", "amq",
];

/**
 * Nur für Übungswortlisten, Vorlese-Lexikon, Pseudowörter und Wortspiele gesperrt: Doppelsinn, regional heikel, gegen
 * ein Kind, Person zuerst, Religion als Zufallswort, Konflikt, Staatssymbole. Exakte Formen (jede Beugung einzeln). In
 * einem Text mit Zusammenhang erlaubt.
 */
export const TR_SPERR_WORTBASIS_WOERTER: readonly string[] = [
  // Doppelsinn: Ware und Beschimpfung, Käse und Schimpfwort, Gurke und Schimpfwort, „Hund" als Schimpfwort
  "mal", "kaşar", "hıyar", "kancık", "salak", "aptal", "ahmak", "budala", "embesil", "enayi", "gerzek",
  "şerefsiz", "haysiyetsiz", "namussuz", "alçak", "rezil", "ukala", "mongol", "lan", "ulan",
  // gegen ein Kind (Hausregel: nie gegen ein Kind)
  "deli", "çirkin", "şişman", "hırsız", "yalancı", "korkak", "tembel", "cahil", "hain", "sapık", "katil",
  // Toilettenhumor: im Wortsalat ein Witz auf Kosten des Kindes
  "kaka", "çiş", "pipi", "kıç", "kıçı", "meme", "memeler", "döl", "popo", "osur", "osuruk", "geğir",
  // Person zuerst: nicht als Bezeichnung von Menschen (Glossar §1 Regel 3)
  "kör", "körler", "sağır", "topal", "dilsiz", "özürlü", "sakat", "âmâ", "cılız", "çolak", "kekeme",
  // Religion als Zufallswort und Flüche (Glossar §4 Nr. 7)
  "allah", "tanrı", "şeytan", "peygamber", "kuran", "cennet", "cehennem", "lanet", "kahretsin", "vallahi", "billahi",
  "inşallah", "maşallah", "domuz", "kafir", "kâfir", "melun",
  // Themen, die ein Wortsalat nicht tragen soll
  "seks", "cinsel", "tecavüz", "porno", "uyuşturucu", "esrar", "eroin", "kokain", "intihar", "cinayet",
  // Politik / Konflikt
  "terör", "terörist", "işgal", "soykırım", "katliam", "diktatör", "pkk", "fetö", "şehit", "gazi", "savaş", "silah", "tüfek",
  "bomba", "mermi",
  // Nacharbeit 10.10.2026 (Lexikon-Nachtrag, Wortbasis aus Tatoeba): Schimpf-/Abwertungswörter, Alkohol und Sucht, Volksgruppen als
  // Zufallswort (Konflikt). In einem Text mit Zusammenhang erlaubt. BEWUSST NICHT: Tiernamen (ayı, eşek, öküz, maymun, köpek, it:
  // harmlose Tierwörter, die Wortspiele behandeln sie selbst über SCHIMPF_TIERE), kaba/yatak/kan/bebek (gewöhnliche Wörter ohne eigene Schimpfform), çıplak und şarap (stehen harmlos in Texten und Banken: kahle Berge, bloßer Fuß, Wein),
  // pis, kel, bira (Anfänge von pişmek, kelime, biraz: die Pyramide schnitte echte Wörter ab).
  "pislik", "leş", "yobaz", "küfür", "içki", "rakı", "alkol", "kumar", "sütyen",
  "yahudi", "kürt", "ermeni",
];

/** Wortanfänge, nur für Wortlisten, Lexikon, Pseudowörter und Wortspiele gesperrt (Beugungen von Tod, Gewalt, Staatssymbolen). */
export const TR_SPERR_WORTBASIS_ANFAENGE: readonly string[] = [
  "öld", "ölü", "ölm", "ölen", "ölür", "öldür", // Tod: Wortspiele tragen es nicht
  "atatürk", "ataturk", // ★ Gesetz 5816: NIE in erzeugten Zeilen oder Wortspielen (Sachtext: erlaubt)
  "bayrak", "bayrağ", "istiklal", "andımız",
  "aptal", "salak", "gerizeka",
  "terör", "savaş", "katliam", "soykırım", "tecavüz", "intihar", "cinayet",
  "uyuşturucu",
];

/**
 * Wörter, die ein gewöhnliches Wort und KEIN Fund der Sperrliste sind, aber nicht in eine ÜBUNGSWORTLISTE gehören: sie
 * handeln von Gewalt, Strafe, Streit und Sucht, oder sie legen in einer Zufallsfolge einen Witz auf Kosten des Kindes nahe
 * („yalan hırsız"), oder sie tragen Militär und Staat. Nur für `wordsTr.ts` und seinen Wächter; im Text mit Zusammenhang und im
 * Vorlese-Lexikon erlaubt (dort sagt die Stimme `suç` ganz). Exakte Formen, gefaltet verglichen.
 */
export const TR_WORTLISTE_UNERWUENSCHT: readonly string[] = [
  "suç", "suçlu", "suçlar", "suçu", "düşman", "nefret", "kavga", "ihanet", "tehdit", "tehlikeli", "ceza", "cezası", "hasar",
  "zarar", "sarhoş", "sigara", "kriz", "mahkeme", "dava", "kabus", "yalan", "yalanlar", "ordu", "ata", "asker", "hapis",
  "hapishane", "ruh", "mücadele", "operasyon", "iktidar", "muhalefet", "hükümet", "hükümeti",
];

const UNERWUENSCHT_GEFALTET: ReadonlySet<string> = new Set(TR_WORTLISTE_UNERWUENSCHT.map((w) => faltenTr(w)));

const KERN_TEILE_GEFALTET: readonly string[] = TR_SPERR_KERN_TEILE.map((s) => faltenTr(s));
const KERN_ANFAENGE_GEFALTET: readonly string[] = TR_SPERR_KERN_ANFAENGE.map((s) => faltenTr(s));
const KERN_WOERTER_GEFALTET: ReadonlySet<string> = new Set(TR_SPERR_KERN_WOERTER.map((s) => faltenTr(s)));
const KERN_WOERTER: ReadonlySet<string> = new Set(TR_SPERR_KERN_WOERTER);
const WORTBASIS_WOERTER: ReadonlySet<string> = new Set(TR_SPERR_WORTBASIS_WOERTER);

/** Die Teile eines Wortes mit Apostroph: `Ali'nin` ⇒ `ali`, `nin`; ohne Apostroph das Wort selbst. */
function teile(wort: string): string[] {
  return klein(wort.replace(/[’ʼ]/g, "'"))
    .split("'")
    .filter((t) => t.length > 0);
}

function kernTreffer(t: string, teile_: readonly string[], anfaenge: readonly string[], exakt: ReadonlySet<string>): boolean {
  if (exakt.has(t)) return true;
  if (teile_.some((s) => t.includes(s))) return true;
  return anfaenge.some((s) => t.startsWith(s));
}

/**
 * Ist dieses WORT (eine Wortform, ggf. mit Apostroph: `Ali'nin`) für Kinder überall gesperrt - auch in Texten? Geprüft
 * wird die richtige Schreibung (`kleinFuer(…, "tr")`) und jede Teilform vor und nach einem Apostroph einzeln.
 */
export function istKernGesperrtTr(wort: string): boolean {
  return teile(wort).some((t) => kernTreffer(t, TR_SPERR_KERN_TEILE, TR_SPERR_KERN_ANFAENGE, KERN_WOERTER));
}

/**
 * Ist dieses Wort aus den ÜBUNGSWORTLISTEN, dem Vorlese-Lexikon und den Pseudowörtern des Generators ausgeschlossen
 * (richtige Schreibung)? Kern + Wortbasis. Texte mit Zusammenhang prüfen nur {@link istKernGesperrtTr}.
 */
export function gesperrtTr(wort: string): boolean {
  if (istKernGesperrtTr(wort)) return true;
  return teile(wort).some(
    (t) => WORTBASIS_WOERTER.has(t) || TR_SPERR_WORTBASIS_ANFAENGE.some((s) => t.startsWith(s)),
  );
}

/**
 * Wie {@link gesperrtTr}, und zusätzlich der KERN im gefalteten Text (`ı→i ş→s …`): ein Kind ohne türkische Tastatur oder
 * eine Stimme, die den Punkt überhört, macht aus `sıkışınca` ein `sikişince` (Texte-Recherche §3.3). Für Wortlisten, die
 * Pseudowort-Werkstatt, die umgedrehten Wörter und alles, was Zeichenfolgen ERZEUGT - nicht für das Vorlese-Lexikon
 * und nicht für Texte (dort wäre `sıkıntı` gesperrt).
 */
export function gesperrtGefaltetTr(wort: string): boolean {
  if (gesperrtTr(wort)) return true;
  return teile(wort).some((t) => kernTreffer(faltenTr(t), KERN_TEILE_GEFALTET, KERN_ANFAENGE_GEFALTET, KERN_WOERTER_GEFALTET));
}

/**
 * Darf dieses Wort in eine ÜBUNGSWORTLISTE (`wordsTr.ts`, Wort-Drill, Wortspiele)? Nein, wenn es gesperrt ist (Kern, Wortbasis,
 * gefaltet) oder zu den unerwünschten Themenwörtern gehört ({@link TR_WORTLISTE_UNERWUENSCHT}).
 */
export function fuerWortlisteUngeeignetTr(wort: string): boolean {
  return gesperrtGefaltetTr(wort) || teile(wort).some((t) => UNERWUENSCHT_GEFALTET.has(faltenTr(t)));
}
