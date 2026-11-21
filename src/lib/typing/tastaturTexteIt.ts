/**
 * ★ O-IT (02.10.2026): NAME, KURZNAME UND ERKLÄRUNG JEDER TASTATUR ITALIENISCH.
 *
 * `layoutTexte(layout, sprache)` in `layouts.ts` kennt de/en/fr/es; für „it"
 * lieferte es bis hierher Englisch (`altSpracheOderEn`). `layouts.ts` bleibt in
 * Etappe O unberührt - darum steht die italienische Tabelle HIER, und
 * {@link layoutTexteIn} ist der eine Weg, den die Oberfläche geht. Für
 * de/en/fr/es reicht sie `layoutTexte` unverändert durch.
 *
 * Eine Tabelle je `LayoutId` wie `LAYOUT_TEXTE_ES`, damit `tsc` für jede
 * Tastatur einen Eintrag verlangt. Tastennamen nach dem Glossar
 * (`recherche-italienisch-2026-10-02/GLOSSAR-it.md` §2.9): Maiusc, Bloc Maiusc,
 * Alt Gr, *tasto morto*; Mac: Opzione. Die Erklärungen sagen dasselbe wie die
 * englischen (`layout.en.hinweis`), Wort für Wort am Sachstand geprüft.
 */
import type { Lang } from "./account";
import { layoutTexte, type KeyboardLayout, type LayoutId, layoutTexteEnglisch } from "./layouts";
import { LAYOUT_TEXTE_PL } from "./tastaturTextePl";
// ★ O-TR (02.10.2026): die türkischen Namen.
import { LAYOUT_TEXTE_TR } from "./tastaturTexteTr";
// ★ O-CS (03.10.2026): die tschechischen Namen.
import { LAYOUT_TEXTE_CS } from "./tastaturTexteCs";
// ★ O2-TASTATUR (29.10.2026): die neun neuen Bedienungssprachen.
import { LAYOUT_TEXTE_BG } from "./tastaturTexteBg";
import { LAYOUT_TEXTE_EL } from "./tastaturTexteEl";
import { LAYOUT_TEXTE_HU } from "./tastaturTexteHu";
import { LAYOUT_TEXTE_NL } from "./tastaturTexteNl";
import { LAYOUT_TEXTE_PT } from "./tastaturTextePt";
import { LAYOUT_TEXTE_BR } from "./tastaturTexteBr";
import { LAYOUT_TEXTE_RO } from "./tastaturTexteRo";
import { LAYOUT_TEXTE_SV } from "./tastaturTexteSv";
import { LAYOUT_TEXTE_UK } from "./tastaturTexteUk";

type Texte = { label: string; kurz: string; hinweis?: string };

const INGLESE =
  "Le tastiere inglesi non hanno ä, ö, ü né ß. Per questo i testi tedeschi usano le " +
  "sostituzioni abituali (ä → ae, ß → ss) - per l'inglese questa tastiera va benissimo.";

export const LAYOUT_TEXTE_IT: Record<LayoutId, Texte> = {
  de: { label: "Tedesco (Germania e Austria)", kurz: "Tastiera tedesca" },
  ch: {
    label: "Svizzero tedesco (Svizzera)",
    kurz: "Tastiera svizzera tedesca",
    hinweis:
      "La tastiera svizzera tedesca non ha il tasto ß: per questo le parole tedesche con ß " +
      "qui si scrivono con ss, come in Svizzera. Ä, Ö e Ü maiuscole si ottengono con il " +
      "tasto morto ¨ (a destra della ü), poi Maiusc e la lettera (Maiusc su ä, ö e ü dà " +
      "à, é ed è). Sul Mac funziona anche Bloc Maiusc.",
  },
  us: { label: "Inglese (Stati Uniti, QWERTY)", kurz: "Tastiera statunitense", hinweis: INGLESE },
  uk: { label: "Inglese (Regno Unito, QWERTY)", kurz: "Tastiera britannica", hinweis: INGLESE },
  fr: {
    label: "Francese (Francia, AZERTY)",
    kurz: "Tastiera francese",
    hinweis:
      "La tastiera AZERTY francese (Windows) non ha É, Ç, Œ né « »: i testi con É o Ç non " +
      "vengono proposti, Œ e « » usano le sostituzioni abituali (Œ → Oe, « » → \"). À, È " +
      "e Ù si ottengono con il tasto morto dell'accento grave (Alt Gr + 7), Ê, Î, Ô e Û " +
      "con ^ - poi Maiusc e la lettera.",
  },
  be: {
    label: "Francese (Belgio, AZERTY)",
    kurz: "Tastiera belga",
    hinweis:
      "La tastiera AZERTY belga (Windows) non ha Ç maiuscola, Œ né « »: i testi con Ç non " +
      "vengono proposti, Œ e « » usano le sostituzioni abituali. É si ottiene con il tasto " +
      "morto dell'accento acuto (Alt Gr + ù), À, È e Ù con quello dell'accento grave " +
      "(Alt Gr + µ), Ê, Î, Ô e Û con ^ - poi Maiusc e la lettera.",
  },
  "ch-fr": {
    label: "Svizzero francese (Svizzera/Lussemburgo)",
    kurz: "Tastiera svizzera francese",
    hinweis:
      "La tastiera svizzera francese non ha Ç maiuscola, Œ né « »: i testi con Ç non " +
      "vengono proposti, Œ e « » usano le sostituzioni abituali. É si ottiene con il tasto " +
      "morto dell'accento acuto (Alt Gr + '), À, È e Ù con quello dell'accento grave " +
      "(Maiusc + ^) - poi Maiusc e la lettera. Maiusc su é, à ed è dà ö, ä e ü. Sul Mac " +
      "funziona anche Bloc Maiusc per É, À ed È.",
  },
  "ca-csa": {
    label: "Francese (Canada, Canadien multilingue standard)",
    kurz: "Tastiera canadese multilingue (CSA)",
    hinweis:
      "La tastiera canadese multilingue non ha Œ: si sostituisce come d'abitudine " +
      "(Œ → Oe). É, À, È, Ç e Ù si scrivono direttamente con Maiusc, Ê, Î, Ô e Û con ^ " +
      "(poi Maiusc e la lettera), « » con Alt Gr + Z e Alt Gr + X, € con Alt Gr + E.",
  },
  "ca-fr": {
    label: "Francese (Canada, \"Français (Canada)\", standard di Windows)",
    kurz: "Tastiera canadese francese",
    hinweis:
      "La tastiera standard di Windows per il francese in Canada. Non ha Œ: si sostituisce " +
      "come d'abitudine. É si scrive direttamente con Maiusc; ç e Ç si ottengono con il " +
      "tasto morto della cediglia (poi c o Maiusc + C), à, è e ù con quello dell'accento " +
      "grave, Ê, Î, Ô e Û con ^. « » hanno un tasto proprio.",
  },
  es: {
    label: "Spagnolo (Spagna, ISO)",
    kurz: "Tastiera spagnola",
    hinweis:
      "Sulla tastiera spagnola l'accento acuto (á é í ó ú) è un tasto morto a destra della " +
      "ñ; con Maiusc lo stesso tasto dà la dieresi (ü). ¡ è diretto e ¿ ha bisogno di " +
      "Maiusc - proprio AL CONTRARIO della tastiera latinoamericana.",
  },
  latam: {
    label: "Spagnolo (America Latina)",
    kurz: "Tastiera latinoamericana",
    hinweis:
      "Sulla tastiera latinoamericana l'accento acuto (á é í ó ú) è un tasto morto a destra " +
      "della p; con Maiusc lo stesso tasto dà la dieresi (ü). ¿ è diretto e ¡ ha bisogno di " +
      "Maiusc - proprio AL CONTRARIO della tastiera spagnola (Spagna). Il simbolo dell'euro " +
      "non si esercita con questa tastiera.",
  },
  it: {
    label: "Italiano (Italia, Windows Italiano / Mac Italiano - Pro)",
    kurz: "Tastiera italiana",
    hinweis:
      "Sulla tastiera italiana à, è, ì, ò e ù hanno tasti propri; é è Maiusc + è. Le " +
      "maiuscole À È É Ì Ò Ù su Windows non esistono (solo con un codice Alt), per questo " +
      "lì i testi che le contengono non vengono proposti; sul Mac si ottengono con " +
      "Opzione + Maiuscole.",
  },
  "it-qzerty": {
    label: "Italiano (Mac Italiano, QZERTY)",
    kurz: "Tastiera italiana del Mac (QZERTY)",
    hinweis:
      "La tastiera del Mac \"Italiano\" è QZERTY: z e w sono scambiate, m sta a destra della " +
      "l, e i numeri hanno bisogno di Maiuscole (la riga dei numeri mostra & \" ' ( ç è ) " +
      "£ à é). à, è, é, ì, ò e ù hanno tasti propri.",
  },
  pl: {
    label: "Polacco (programmatori, QWERTY)",
    kurz: "Tastiera polacca per programmatori",
    hinweis:
      "Sulla tastiera polacca per programmatori (Windows \"Polski (programisty)\", Mac " +
      "\"Polish - Pro\") le lettere polacche si scrivono con Alt Gr (Mac: Opzione) e la " +
      "lettera di base: ą = a, ć = c, ę = e, ł = l, ń = n, ó = o, ś = s, ź = x, ż = z. Per " +
      "la maiuscola si aggiunge Maiusc.",
  },
  "tr-q": {
    label: "Turco Q (Türkçe Q)",
    kurz: "Tastiera turca Q",
    hinweis:
      "Sulla tastiera turca Q ı, ğ, ş, ç, ö e ü hanno tasti propri, a destra di p, l e m. ı " +
      "e i sono due tasti: i sta a destra di ş, ı dove la tastiera tedesca ha la i. " +
      "L'apostrofo è Maiusc + 2, le virgolette stanno a sinistra dell'1, ₺ è Alt Gr + T " +
      "(Mac: Opzione + T). â, î e û si ottengono con il tasto morto ^ (Maiusc + 3), poi la " +
      "vocale.",
  },
  "tr-f": {
    label: "Turco F (Türkçe F)",
    kurz: "Tastiera turca F",
    hinweis:
      "Sulla tastiera turca F la riga di base è u i e a ü t k m l y ş (a sinistra u i e a, a " +
      "destra k m l y). I tasti con i segni tattili sono a (sinistra) e k (destra). ı, ğ, " +
      "ş, ç, ö e ü hanno tasti propri. L'apostrofo è Maiusc + 7, le virgolette Maiusc + 2, " +
      "₺ è Alt Gr + T (Mac: Opzione + T). â, î e û si ottengono su Windows con il tasto " +
      "morto ^ (Maiusc + 3); sul Mac sono Opzione + a, i o u.",
  },
  cs: {
    label: "Ceco (QWERTZ)",
    kurz: "Tastiera ceca",
    hinweis:
      "Sulla tastiera ceca ě š č ř ž ý á í é stanno sulla riga dei numeri; i numeri si " +
      "ottengono con Maiusc. Maiusc su quei tasti dà il numero, mai la maiuscola: Č Š Ř Ž " +
      "Á É Í Ý Ě maiuscole si ottengono con il tasto morto háček o čárka (a destra del " +
      "tasto =; háček è Maiusc + lo stesso tasto), poi Maiusc e la lettera - oppure con " +
      "Bloc Maiusc. ď ť ň sono háček + d, t o n, ó è čárka + o. ú e ů hanno tasti propri. " +
      "Ů maiuscola funziona solo con Bloc Maiusc.",
  },
  "cs-qwerty": {
    label: "Ceco (QWERTY)",
    kurz: "Tastiera ceca QWERTY",
    hinweis:
      "La tastiera ceca QWERTY ha y e z dove le ha la tastiera inglese, per il resto è la " +
      "tastiera ceca: ě š č ř ž ý á í é stanno sulla riga dei numeri, i numeri si ottengono " +
      "con Maiusc, e Maiusc su quei tasti non dà mai la maiuscola. Č Š Ř Ž Á É Í Ý Ě " +
      "maiuscole si ottengono con il tasto morto háček o čárka (a destra del tasto =; háček " +
      "è Maiusc + lo stesso tasto), poi Maiusc e la lettera - oppure con Bloc Maiusc. ď ť ň " +
      "sono háček + d, t o n, ó è čárka + o. Ů maiuscola funziona solo con Bloc Maiusc.",
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

/**
 * Name, Kurzname und Erklärung einer Tastatur in der Sprache der Bedienung - „it" von
 * hier, „pl" aus `tastaturTextePl.ts` (★ O-PL, 02.10.2026).
 */
export function layoutTexteIn(layout: KeyboardLayout, sprache: Lang = "de"): Texte {
  if (sprache === "it") return LAYOUT_TEXTE_IT[layout.id];
  if (sprache === "pl") return LAYOUT_TEXTE_PL[layout.id];
  // ★ O-TR (02.10.2026): "tr" aus `tastaturTexteTr.ts`.
  if (sprache === "tr") return LAYOUT_TEXTE_TR[layout.id];
  // ★ O-CS (03.10.2026): „cs" aus `tastaturTexteCs.ts`.
  if (sprache === "cs") return LAYOUT_TEXTE_CS[layout.id];
  // ★ O2-TASTATUR (29.10.2026): bg el hu nl pt br ro sv uk aus `tastaturTexte<Xx>.ts` (bis dahin RÜCKFALL-EN über `layoutTexte`).
  if (sprache === "bg") return LAYOUT_TEXTE_BG[layout.id];
  if (sprache === "el") return LAYOUT_TEXTE_EL[layout.id];
  if (sprache === "hu") return LAYOUT_TEXTE_HU[layout.id];
  if (sprache === "nl") return LAYOUT_TEXTE_NL[layout.id];
  if (sprache === "pt") return LAYOUT_TEXTE_PT[layout.id];
  if (sprache === "br") return LAYOUT_TEXTE_BR[layout.id];
  if (sprache === "ro") return LAYOUT_TEXTE_RO[layout.id];
  if (sprache === "sv") return LAYOUT_TEXTE_SV[layout.id];
  if (sprache === "uk") return LAYOUT_TEXTE_UK[layout.id];
  return layoutTexte(layout, sprache);
}
