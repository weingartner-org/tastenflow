/**
 * ★ O-CS (03.10.2026): NAME, KURZNAME UND ERKLÄRUNG JEDER TASTATUR TSCHECHISCH.
 *
 * Bauart wie `tastaturTextePl.ts`/`tastaturTexteTr.ts`: `layouts.ts` bleibt in
 * Etappe O unberührt, die tschechische Tabelle steht HIER, und `layoutTexteIn`
 * (`tastaturTexteIt.ts`) ist der eine Weg, den die Oberfläche geht. Eine
 * Tabelle je `LayoutId`, damit `tsc` für jede Tastatur einen Eintrag verlangt.
 *
 * Namen nach dem Glossar (`recherche-tschechisch-2026-10-02/GLOSSAR-cs.md`
 * §2.9 `LAYOUT_TEXTE_CS`): „Česká (QWERTZ)", „Česká (QWERTY)", „Německá
 * (Německo a Rakousko)", „Anglická (USA)", „Anglická (Spojené království)";
 * die übrigen nach demselben Muster (Adjektiv zu „klávesnice", dann Land in
 * Klammern). Der Kurzname klein - er steht nach „Klávesnice:" (`ansageTastatur`).
 * Tastennamen wie auf der Kappe (Glossar §2.9: Tschechisch übersetzt sie
 * nicht): Shift, Caps Lock, AltGr, Mac: Option; „mrtvá klávesa" für die
 * Totaste, „háček", „čárka nad písmenem" (§2.1, §4 Falle 2: „čárka" allein
 * wäre auch das Komma). Im Satz mit Kopfwort („s klávesou Shift", Regel 11).
 * Die Erklärungen sagen dasselbe wie die englischen (`layout.en.hinweis`),
 * Satz für Satz an ihnen geprüft; sie sind unpersönlich („se píše"), weil Kind
 * und Lehrkraft sie lesen (ty und vy nie mischen, Regel 1). Keine
 * französischen Anführungszeichen im Text - sie hiessen auf der Braillezeile
 * etwas anderes.
 */
import { layoutTexteEnglisch, type LayoutId } from "./layouts";

type Texte = { label: string; kurz: string; hinweis?: string };

const ANGLICKA =
  "Anglické klávesnice nemají ä, ö, ü ani ß. Německé texty proto místo nich používají obvyklý " +
  "zápis (ä → ae, ß → ss) - pro angličtinu se tato klávesnice hodí bez omezení.";

export const LAYOUT_TEXTE_CS: Record<LayoutId, Texte> = {
  de: { label: "Německá (Německo a Rakousko)", kurz: "německá klávesnice" },
  ch: {
    label: "Švýcarská (německá)",
    kurz: "švýcarská klávesnice",
    hinweis:
      "Švýcarská klávesnice nemá klávesu ß; v německých slovech se proto místo ß píše ss - jako ve " +
      "Švýcarsku. Velká Ä, Ö a Ü se píší mrtvou klávesou ¨ (vpravo od klávesy ü), potom Shift a písmeno " +
      "(Shift na klávesách ä, ö a ü dává à, é a è). Na Macu funguje i Caps Lock.",
  },
  us: { label: "Anglická (USA)", kurz: "americká klávesnice", hinweis: ANGLICKA },
  uk: { label: "Anglická (Spojené království)", kurz: "britská klávesnice", hinweis: ANGLICKA },
  fr: {
    label: "Francouzská (Francie, AZERTY)",
    kurz: "francouzská klávesnice",
    hinweis:
      "Francouzská klávesnice AZERTY (Windows) nemá É, Ç, Œ ani francouzské uvozovky - texty s É nebo Ç " +
      "se vynechávají, pro Œ a francouzské uvozovky se používá obvyklý zápis (Œ → Oe, francouzské " +
      "uvozovky → rovné uvozovky). À, È a Ù se píší mrtvou klávesou pro gravis (AltGr + 7), Ê, Î, Ô a Û " +
      "klávesou ^ - potom Shift a písmeno.",
  },
  be: {
    label: "Francouzská (Belgie, AZERTY)",
    kurz: "belgická klávesnice",
    hinweis:
      "Belgická klávesnice AZERTY (Windows) nemá velké Ç, Œ ani francouzské uvozovky - texty s Ç se " +
      "vynechávají, pro Œ a francouzské uvozovky se používá obvyklý zápis. É se píše mrtvou klávesou " +
      "pro akut (AltGr + ù), À, È a Ù mrtvou klávesou pro gravis (AltGr + µ), Ê, Î, Ô a Û klávesou ^ - " +
      "potom Shift a písmeno.",
  },
  "ch-fr": {
    label: "Švýcarská (francouzská; Švýcarsko a Lucembursko)",
    kurz: "švýcarská francouzská klávesnice",
    hinweis:
      "Švýcarská francouzská klávesnice nemá velké Ç, Œ ani francouzské uvozovky - texty s Ç se " +
      "vynechávají, pro Œ a francouzské uvozovky se používá obvyklý zápis. É se píše mrtvou klávesou " +
      "pro akut (AltGr + '), À, È a Ù mrtvou klávesou pro gravis (Shift + ^) - potom Shift a písmeno. " +
      "Shift na klávesách é, à a è dává ö, ä a ü. Na Macu funguje pro É, À a È i Caps Lock.",
  },
  "ca-csa": {
    label: "Kanadská francouzská (Canadien multilingue standard)",
    kurz: "kanadská vícejazyčná klávesnice (CSA)",
    hinweis:
      "Kanadská vícejazyčná klávesnice (CSA) nemá Œ - texty používají obvyklý zápis (Œ → Oe). É, À, " +
      "È, Ç a Ù se píší přímo s klávesou Shift; Ê, Î, Ô a Û s klávesou ^ (potom Shift a písmeno), " +
      "francouzské uvozovky s AltGr + Z a AltGr + X, € s AltGr + E.",
  },
  "ca-fr": {
    label: "Kanadská francouzská (Français (Canada), standard Windows)",
    kurz: "kanadská francouzská klávesnice",
    hinweis:
      "Standardní francouzská klávesnice pro Kanadu ve Windows. Nemá Œ - texty používají obvyklý " +
      "zápis. É se píše přímo s klávesou Shift; ç a Ç se píší mrtvou klávesou pro cedilu (potom c nebo " +
      "Shift + C), à, è a ù mrtvou klávesou pro gravis, Ê, Î, Ô a Û klávesou ^. Pro francouzské " +
      "uvozovky má klávesnice vlastní klávesu.",
  },
  es: {
    label: "Španělská (Španělsko, ISO)",
    kurz: "španělská klávesnice",
    hinweis:
      "Na španělské klávesnici je akut (á é í ó ú) mrtvá klávesa vpravo od klávesy ñ; Shift na stejné " +
      "klávese dává přehlásku (ü). ¡ se píše přímo, ¿ s klávesou Shift - PŘESNĚ OPAČNĚ než na " +
      "latinskoamerické klávesnici.",
  },
  latam: {
    label: "Španělská (Latinská Amerika)",
    kurz: "latinskoamerická klávesnice",
    hinweis:
      "Na latinskoamerické klávesnici je akut (á é í ó ú) mrtvá klávesa vpravo od klávesy p; Shift na " +
      "stejné klávese dává přehlásku (ü). ¿ se píše přímo, ¡ s klávesou Shift - PŘESNĚ OPAČNĚ než na " +
      "španělské klávesnici. Znak eura není na tomto rozložení ověřený.",
  },
  it: {
    label: "Italská (Itálie, Windows Italiano / Mac Italiano - Pro)",
    kurz: "italská klávesnice",
    hinweis:
      "Na italské klávesnici mají à, è, ì, ò a ù vlastní klávesy; é se píše jako Shift + è. Velká À È " +
      "É Ì Ò Ù ve Windows nejsou (jen přes kódy s klávesou Alt), proto se tam texty s nimi vynechávají; " +
      "na Macu se píší s Option + Shift.",
  },
  "it-qzerty": {
    label: "Italská (Mac Italiano, QZERTY)",
    kurz: "italská klávesnice Mac (QZERTY)",
    hinweis:
      "Klávesnice Mac Italiano má rozložení QZERTY: z a w jsou prohozené, m je vpravo od l a číslice " +
      "se píší s klávesou Shift (na číselné řadě je vidět & \" ' ( ç è ) £ à é). à, è, é, ì, ò a ù " +
      "mají vlastní klávesy.",
  },
  // NVDA-Falle (AltGr + N = Ctrl + Alt + N) wie im englischen Text.
  pl: {
    label: "Polská (programátorská)",
    kurz: "polská klávesnice",
    hinweis:
      "Na polské programátorské klávesnici (Windows: Polski (programisty), Mac: Polski Pro) se polská " +
      "písmena píší s AltGr (Mac: Option) a základním písmenem: ą = a, ć = c, ę = e, ł = l, ń = n, " +
      "ó = o, ś = s, ź = x, ż = z. Pro velké písmeno se přidá Shift. Na klávese je vidět jen základní " +
      "písmeno. Ve Windows se zapnutým NVDA spustí AltGr + N (ń) NVDA znovu, protože Ctrl + Alt + N je " +
      "klávesová zkratka NVDA: tu lze v nastavení NVDA vypnout, nebo použít Shift + Caps Lock + AltGr + N.",
  },
  "tr-q": {
    label: "Turecká (Q)",
    kurz: "turecká klávesnice Q",
    hinweis:
      "Na turecké klávesnici Q mají ı, ğ, ş, ç, ö a ü vlastní klávesy: vpravo od p, l a m. i s tečkou " +
      "a ı bez tečky jsou dvě různé klávesy: i s tečkou je vpravo od ş, ı bez tečky mezi u a o. Apostrof " +
      "je Shift + 2, uvozovky vlevo od klávesy 1, ₺ AltGr + T (Mac: Option + T). â, î a û se píší mrtvou " +
      "klávesou ^ (Shift + 3) a potom samohláskou.",
  },
  "tr-f": {
    label: "Turecká (F)",
    kurz: "turecká klávesnice F",
    hinweis:
      "Na turecké klávesnici F tvoří základní řadu písmena u i e a ü t k m l y ş (vlevo u i e a, " +
      "vpravo k m l y). Hmatové výstupky mají klávesy a (vlevo) a k (vpravo). ı, ğ, ş, ç, ö a ü mají " +
      "vlastní klávesy. Apostrof je Shift + 7, uvozovky Shift + 2, ₺ AltGr + T (Mac: Option + T). â, î " +
      "a û se ve Windows píší mrtvou klávesou ^ (Shift + 3); na Macu s Option + a, i nebo u.",
  },
  // Glossar §2.9: die Ziffernreihe trägt Buchstaben, Ziffern kommen mit Shift (§4 Falle 1).
  cs: {
    label: "Česká (QWERTZ)",
    kurz: "česká klávesnice",
    hinweis:
      "Na české klávesnici jsou na číselné řadě písmena ě š č ř ž ý á í é; číslice se píší s klávesou " +
      "Shift. Shift na těchto klávesách dává číslici, nikdy velké písmeno: velká Č Š Ř Ž Á É Í Ý Ě se " +
      "píší mrtvou klávesou s háčkem nebo s čárkou nad písmenem (vpravo od klávesy =; háček je Shift + " +
      "stejná klávesa), potom Shift a písmeno - nebo s klávesou Caps Lock. ď ť ň jsou háček + d, t nebo " +
      "n, ó je čárka nad písmenem + o. ú a ů mají vlastní klávesy. Velké Ů jde napsat jen s klávesou " +
      "Caps Lock. Proti anglické klávesnici jsou prohozené z a y.",
  },
  "cs-qwerty": {
    label: "Česká (QWERTY)",
    kurz: "česká klávesnice QWERTY",
    hinweis:
      "Česká klávesnice QWERTY má y a z tam, kde je má anglická klávesnice, jinak je stejná jako česká: " +
      "na číselné řadě jsou písmena ě š č ř ž ý á í é, číslice se píší s klávesou Shift a Shift na " +
      "těchto klávesách nikdy nedává velké písmeno. Velká Č Š Ř Ž Á É Í Ý Ě se píší mrtvou klávesou s " +
      "háčkem nebo s čárkou nad písmenem (vpravo od klávesy =; háček je Shift + stejná klávesa), potom " +
      "Shift a písmeno - nebo s klávesou Caps Lock. ď ť ň jsou háček + d, t nebo n, ó je čárka nad " +
      "písmenem + o. Velké Ů jde napsat jen s klávesou Caps Lock.",
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
