/**
 * ★ O-PL (02.10.2026): NAME, KURZNAME UND ERKLÄRUNG JEDER TASTATUR POLNISCH.
 *
 * Bauart wie `tastaturTexteIt.ts`: `layouts.ts` bleibt in Etappe O unberührt,
 * die polnische Tabelle steht HIER, und `layoutTexteIn` (`tastaturTexteIt.ts`)
 * ist der eine Weg, den die Oberfläche geht. Eine Tabelle je `LayoutId`, damit
 * `tsc` für jede Tastatur einen Eintrag verlangt.
 *
 * Namen nach dem Glossar (`recherche-polnisch-2026-10-02/GLOSSAR-pl.md` §2.9):
 * „Polska (programisty)", „Niemiecka (Niemcy i Austria)", „Angielska (USA)" …
 * - das Adjektiv richtet sich nach „klawiatura"; kurz „Klawiatura polska".
 * Tastennamen wie auf der Kappe: Shift, Caps Lock, prawy Alt (beim ersten
 * Vorkommen „prawy Alt (AltGr)"), *klawisz martwy*; Mac: Option. Windows- und
 * Mac-Namen in „…” (Glossar Regel 8). Die Erklärungen sagen dasselbe wie die
 * englischen (`layout.en.hinweis`), Satz für Satz an ihnen geprüft.
 */
import { layoutTexteEnglisch, type LayoutId } from "./layouts";

type Texte = { label: string; kurz: string; hinweis?: string };

const ANGIELSKA =
  "Klawiatury angielskie nie mają ä, ö, ü ani ß. Dlatego teksty niemieckie używają " +
  "zwykłych zamienników (ä → ae, ß → ss) - do angielskiego ta klawiatura nadaje się w sam raz.";

export const LAYOUT_TEXTE_PL: Record<LayoutId, Texte> = {
  de: { label: "Niemiecka (Niemcy i Austria)", kurz: "Klawiatura niemiecka" },
  ch: {
    label: "Szwajcarska (niemiecka)",
    kurz: "Klawiatura szwajcarska",
    hinweis:
      "Klawiatura szwajcarska nie ma klawisza ß, dlatego niemieckie słowa z ß pisze się tu " +
      "przez ss - tak jak w Szwajcarii. Wielkie Ä, Ö i Ü daje klawisz martwy ¨ (na prawo od ü), " +
      "a potem Shift i litera (Shift na ä, ö i ü daje à, é i è). Na Macu działa też Caps Lock.",
  },
  us: { label: "Angielska (USA)", kurz: "Klawiatura amerykańska", hinweis: ANGIELSKA },
  uk: { label: "Angielska (Wielka Brytania)", kurz: "Klawiatura brytyjska", hinweis: ANGIELSKA },
  fr: {
    label: "Francuska (Francja, AZERTY)",
    kurz: "Klawiatura francuska",
    hinweis:
      "Francuska klawiatura AZERTY (Windows) nie ma É, Ç, Œ ani « » - teksty z É lub Ç są " +
      "pomijane, Œ i « » mają zwykłe zamienniki (Œ → Oe, « » → \"). À, È i Ù daje klawisz " +
      "martwy akcentu grave (prawy Alt (AltGr) + 7), Ê, Î, Ô i Û klawisz ^ - a potem Shift i litera.",
  },
  be: {
    label: "Francuska (Belgia, AZERTY)",
    kurz: "Klawiatura belgijska",
    hinweis:
      "Belgijska klawiatura AZERTY (Windows) nie ma wielkiego Ç, Œ ani « » - teksty z Ç są " +
      "pomijane, Œ i « » mają zwykłe zamienniki. É daje klawisz martwy akcentu ostrego " +
      "(prawy Alt (AltGr) + ù), À, È i Ù klawisz martwy akcentu grave (prawy Alt + µ), Ê, Î, Ô " +
      "i Û klawisz ^ - a potem Shift i litera.",
  },
  "ch-fr": {
    label: "Szwajcarska (francuska; Szwajcaria i Luksemburg)",
    kurz: "Klawiatura szwajcarska francuska",
    hinweis:
      "Szwajcarska klawiatura francuska nie ma wielkiego Ç, Œ ani « » - teksty z Ç są " +
      "pomijane, Œ i « » mają zwykłe zamienniki. É daje klawisz martwy akcentu ostrego " +
      "(prawy Alt (AltGr) + '), À, È i Ù klawisz martwy akcentu grave (Shift + ^) - a potem " +
      "Shift i litera. Shift na é, à i è daje ö, ä i ü. Na Macu dla É, À i È działa też Caps Lock.",
  },
  "ca-csa": {
    label: "Kanadyjska francuska (Canadien multilingue standard)",
    kurz: "Klawiatura kanadyjska wielojęzyczna (CSA)",
    hinweis:
      "Kanadyjska klawiatura wielojęzyczna (CSA) nie ma Œ - teksty używają zwykłego " +
      "zamiennika (Œ → Oe). É, À, È, Ç i Ù pisze się bezpośrednio z klawiszem Shift, Ê, Î, Ô " +
      "i Û przez ^ (potem Shift i litera), « » przez prawy Alt (AltGr) + Z i prawy Alt + X, " +
      "€ przez prawy Alt + E.",
  },
  "ca-fr": {
    label: "Kanadyjska francuska („Français (Canada)”, standard Windows)",
    kurz: "Klawiatura kanadyjska francuska",
    hinweis:
      "Standardowa klawiatura systemu Windows do francuskiego w Kanadzie. Nie ma Œ - teksty " +
      "używają zwykłego zamiennika. É pisze się bezpośrednio z klawiszem Shift; ç i Ç daje " +
      "klawisz martwy cedylli (potem c albo Shift + C), à, è i ù klawisz martwy akcentu " +
      "grave, Ê, Î, Ô i Û klawisz ^. « » mają własny klawisz.",
  },
  es: {
    label: "Hiszpańska (Hiszpania, ISO)",
    kurz: "Klawiatura hiszpańska",
    hinweis:
      "Na klawiaturze hiszpańskiej akcent ostry (á é í ó ú) to klawisz martwy na prawo od ñ; " +
      "Shift na tym samym klawiszu daje dierezę (ü). ¡ jest bezpośrednio, ¿ wymaga klawisza " +
      "Shift - DOKŁADNIE ODWROTNIE niż na klawiaturze latynoamerykańskiej.",
  },
  latam: {
    label: "Hiszpańska (Ameryka Łacińska)",
    kurz: "Klawiatura latynoamerykańska",
    hinweis:
      "Na klawiaturze latynoamerykańskiej akcent ostry (á é í ó ú) to klawisz martwy na prawo " +
      "od p; Shift na tym samym klawiszu daje dierezę (ü). ¿ jest bezpośrednio, ¡ wymaga " +
      "klawisza Shift - DOKŁADNIE ODWROTNIE niż na klawiaturze hiszpańskiej (Hiszpania). " +
      "Znak euro na tym układzie nie jest potwierdzony.",
  },
  it: {
    label: "Włoska (Włochy, Windows Italiano / Mac Italiano - Pro)",
    kurz: "Klawiatura włoska",
    hinweis:
      "Na klawiaturze włoskiej à, è, ì, ò i ù mają własne klawisze; é to Shift + è. Wielkich " +
      "À È É Ì Ò Ù w systemie Windows nie ma (tylko przez kod Alt), dlatego tam teksty z nimi " +
      "są pomijane; na Macu daje je Option + Shift.",
  },
  "it-qzerty": {
    label: "Włoska (Mac Italiano, QZERTY)",
    kurz: "Klawiatura włoska Maca (QZERTY)",
    hinweis:
      "Klawiatura Maca „Italiano” to QZERTY: z i w są zamienione, m jest na prawo od l, a " +
      "cyfry wymagają klawisza Shift (w rzędzie cyfr widać & \" ' ( ç è ) £ à é). à, è, é, ì, " +
      "ò i ù mają własne klawisze.",
  },
  // Glossar §2.9: „Polska (programisty)". Windows „Polski (programisty)", Mac „Polski Pro"
  // (R1 §2.1, §3). Die NVDA-Falle (prawy Alt + N = Ctrl + Alt + N) wie im englischen Text.
  pl: {
    label: "Polska (programisty)",
    kurz: "Klawiatura polska",
    hinweis:
      "Na polskiej klawiaturze programisty (Windows: „Polski (programisty)”, Mac: „Polski Pro”) " +
      "polskie litery pisze się z prawym Altem (AltGr; Mac: Option) i literą podstawową: ą = a, " +
      "ć = c, ę = e, ł = l, ń = n, ó = o, ś = s, ź = x, ż = z. Do wielkiej litery dochodzi " +
      "klawisz Shift. Na klawiszu widać tylko literę podstawową. Z NVDA w systemie Windows " +
      "prawy Alt + N (ń) uruchamia NVDA ponownie, bo Ctrl + Alt + N to skrót NVDA: wyłącz ten " +
      "skrót w NVDA albo naciśnij Shift + Caps Lock + prawy Alt + N.",
  },
  "tr-q": {
    label: "Turecka Q (Türkçe Q)",
    kurz: "Klawiatura turecka Q",
    hinweis:
      "Na tureckiej klawiaturze Q litery ı, ğ, ş, ç, ö i ü mają własne klawisze, na prawo od p, " +
      "l i m. ı oraz i to dwa klawisze: i jest na prawo od ş, ı tam, gdzie niemiecka " +
      "klawiatura ma i. Apostrof to Shift + 2, cudzysłów jest na lewo od 1, ₺ to prawy Alt " +
      "(AltGr) + T (Mac: Option + T). â, î i û daje klawisz martwy ^ (Shift + 3), a potem samogłoska.",
  },
  "tr-f": {
    label: "Turecka F (Türkçe F)",
    kurz: "Klawiatura turecka F",
    hinweis:
      "Na tureckiej klawiaturze F rząd podstawowy to u i e a ü t k m l y ş (po lewej u i e a, " +
      "po prawej k m l y). Klawisze z wypustkami to a (po lewej) i k (po prawej). ı, ğ, ş, ç, " +
      "ö i ü mają własne klawisze. Apostrof to Shift + 7, cudzysłów Shift + 2, ₺ to prawy Alt " +
      "(AltGr) + T (Mac: Option + T). â, î i û daje w systemie Windows klawisz martwy ^ " +
      "(Shift + 3); na Macu to Option + a, i albo u.",
  },
  cs: {
    label: "Czeska (QWERTZ)",
    kurz: "Klawiatura czeska",
    hinweis:
      "Na czeskiej klawiaturze ě š č ř ž ý á í é są w rzędzie cyfr; cyfry daje Shift. Shift " +
      "na tych klawiszach daje cyfrę, nigdy wielką literę: wielkie Č Š Ř Ž Á É Í Ý Ě daje " +
      "klawisz martwy háček albo čárka (na prawo od klawisza =; háček to Shift + ten sam " +
      "klawisz), a potem Shift i litera - albo Caps Lock. ď ť ň to háček + d, t albo n, ó to " +
      "čárka + o. ú i ů mają własne klawisze. Wielkie Ů działa tylko z klawiszem Caps Lock.",
  },
  "cs-qwerty": {
    label: "Czeska (QWERTY)",
    kurz: "Klawiatura czeska QWERTY",
    hinweis:
      "Czeska klawiatura QWERTY ma y i z tam, gdzie klawiatura angielska, poza tym to " +
      "klawiatura czeska: ě š č ř ž ý á í é są w rzędzie cyfr, cyfry daje Shift, a Shift na " +
      "tych klawiszach nigdy nie daje wielkiej litery. Wielkie Č Š Ř Ž Á É Í Ý Ě daje klawisz " +
      "martwy háček albo čárka (na prawo od klawisza =; háček to Shift + ten sam klawisz), a " +
      "potem Shift i litera - albo Caps Lock. ď ť ň to háček + d, t albo n, ó to čárka + o. " +
      "Wielkie Ů działa tylko z klawiszem Caps Lock.",
  },
  // RÜCKFALL-EN (G3b): die bg-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "bg": layoutTexteEnglisch("bg"),
  "bg-schreibm": layoutTexteEnglisch("bg-schreibm"),
  "bg-phon": layoutTexteEnglisch("bg-phon"),
  "bg-phon-trad": layoutTexteEnglisch("bg-phon-trad"),
  // RÜCKFALL-EN (G3b): die el-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "el": layoutTexteEnglisch("el"),
  "el-220": layoutTexteEnglisch("el-220"),
  "el-319": layoutTexteEnglisch("el-319"),
  // RÜCKFALL-EN (G3b): die hu-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "hu": layoutTexteEnglisch("hu"),
  "hu-101": layoutTexteEnglisch("hu-101"),
  // RÜCKFALL-EN (G3b): die nl-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "nl-intl": layoutTexteEnglisch("nl-intl"),
  "nl-dutch": layoutTexteEnglisch("nl-dutch"),
  // RÜCKFALL-EN (G3b): die pt-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "pt": layoutTexteEnglisch("pt"),
  // RÜCKFALL-EN (G3b): die br-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "br-abnt2": layoutTexteEnglisch("br-abnt2"),
  // RÜCKFALL-EN (G3b): die ro-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "ro": layoutTexteEnglisch("ro"),
  "ro-prog": layoutTexteEnglisch("ro-prog"),
  // RÜCKFALL-EN (G3b): die sv-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "sv": layoutTexteEnglisch("sv"),
  // RÜCKFALL-EN (G3b): die uk-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "ua": layoutTexteEnglisch("ua"),
  "ua-std": layoutTexteEnglisch("ua-std"),
};
