/**
 * ★ O2 (29.10.2026): NAME, KURZNAME UND ERKLÄRUNG JEDER TASTATUR RUMÄNISCH.
 *
 * Bauart wie `tastaturTexteCs.ts`: `layouts.ts` bleibt unberührt, die rumänische Tabelle steht HIER, und
 * `layoutTexteIn` (`tastaturTexteIt.ts`) ist der eine Weg, den die Oberfläche geht. Eine Tabelle je `LayoutId`,
 * damit `tsc` für jede Tastatur einen Eintrag verlangt - anders als bei cs auch für die Tastaturen der neun neuen
 * Sprachen (bg, el, hu, nl, pt, br, ro, sv, uk): jede trägt eine echte Übersetzung, keinen englischen Rückfall.
 *
 * Namen nach dem Glossar (`recherche-rumänisch-2026-10-25/GLOSSAR-ro.md` §2.9 `LAYOUT_TEXTE_RO`): „Română
 * (standard)", „Română (programatori)", „Germană (Germania și Austria)", „Engleză (SUA)", „Engleză (Regatul Unit)";
 * die übrigen nach demselben Muster. Der Kurzname klein - er steht nach „Tastatură:". Tastennamen wie auf der Kappe
 * und wie in `tastenErklaerungRo.ts`: Shift, Caps Lock, **Alt Gr** (mit Leerzeichen, Glossar §2.9; nie „Alt
 * dreapta"), Enter, Mac: Opțiune; im Satz mit „tasta" (Regel 11). Totaste = „tastă moartă", Akzente nach
 * `tastenErklaerungRo.ts`: accent ascuțit, accent grav, circumflex, două puncte deasupra, sedilă, tildă.
 * Reihen: „șirul de cifre", „șirul de bază" (nie „rând" - das ist die Übungszeile, Glossar §4 Falle 3);
 * „rândurile" steht nur dort, wo wirklich Übungszeilen gemeint sind.
 * ș und ț immer mit Komma, nie mit Cedille - ausser im TÜRKISCHEN ş der tr-Tastaturen, dort ist die Cedille der
 * Buchstabe selbst. Die Erklärungen sagen dasselbe wie die englischen (`layout.en.hinweis`), Satz für Satz an ihnen
 * geprüft; sie sind unpersönlich („se scrie"), weil Kind und Lehrkraft sie lesen. Keine französischen
 * Anführungszeichen im Text - „ghilimele unghiulare". Kein Satz endet mit einer Ziffer und Punkt (Ordnungszahl).
 */
import type { LayoutId } from "./layouts";

type Texte = { label: string; kurz: string; hinweis?: string };

const ENGLEZA =
  "Tastaturile englezești nu au ä, ö, ü și ß. De aceea, textele germane folosesc înlocuirile obișnuite " +
  "(ä → ae, ß → ss) - pentru engleză, tastatura aceasta este exact potrivită.";

export const LAYOUT_TEXTE_RO: Record<LayoutId, Texte> = {
  de: { label: "Germană (Germania și Austria)", kurz: "tastatură germană" },
  ch: {
    label: "Elvețiană (germană)",
    kurz: "tastatură elvețiană",
    hinweis:
      "Tastatura elvețiană nu are tasta ß, așa că în cuvintele germane ß se scrie aici ss - ca în Elveția. Ä, Ö " +
      "și Ü mari se scriu cu tasta moartă ¨ (în dreapta lui ü), apoi tasta Shift și litera (tasta Shift pe ä, ö " +
      "și ü dă à, é și è). Merge și tasta Caps Lock.",
  },
  us: { label: "Engleză (SUA)", kurz: "tastatură americană", hinweis: ENGLEZA },
  uk: { label: "Engleză (Regatul Unit)", kurz: "tastatură britanică", hinweis: ENGLEZA },
  fr: {
    label: "Franceză (Franța, AZERTY)",
    kurz: "tastatură franceză",
    hinweis:
      "Tastatura franceză AZERTY (Windows) nu are É, Ç, Œ și ghilimele unghiulare - textele cu É sau Ç sunt " +
      "lăsate deoparte, pentru Œ și ghilimelele unghiulare se folosesc înlocuirile obișnuite (Œ → Oe, ghilimele " +
      "unghiulare → ghilimele drepte). À, È și Ù se scriu cu tasta moartă pentru accentul grav (Alt Gr + 7), Ê, " +
      "Î, Ô și Û cu ^ - de fiecare dată urmate de tasta Shift și litera.",
  },
  be: {
    label: "Franceză (Belgia, AZERTY)",
    kurz: "tastatură belgiană",
    hinweis:
      "Tastatura belgiană AZERTY (Windows) nu are Ç mare, Œ și ghilimele unghiulare - textele cu Ç sunt lăsate " +
      "deoparte, pentru Œ și ghilimelele unghiulare se folosesc înlocuirile obișnuite. É se scrie cu tasta moartă " +
      "pentru accentul ascuțit (Alt Gr + ù), À, È și Ù cu tasta moartă pentru accentul grav (Alt Gr + µ), Ê, Î, Ô " +
      "și Û cu ^ - de fiecare dată urmate de tasta Shift și litera.",
  },
  "ch-fr": {
    label: "Franceză elvețiană (Elveția și Luxemburg)",
    kurz: "tastatură elvețiană franceză",
    hinweis:
      "Tastatura elvețiană franceză nu are Ç mare, Œ și ghilimele unghiulare - textele cu Ç sunt lăsate " +
      "deoparte, pentru Œ și ghilimelele unghiulare se folosesc înlocuirile obișnuite. É se scrie cu tasta moartă " +
      "pentru accentul ascuțit (Alt Gr + '), À, È și Ù cu tasta moartă pentru accentul grav (Shift + ^) - de " +
      "fiecare dată urmate de tasta Shift și litera. Tasta Shift pe é, à și è dă ö, ä și ü. Pe Mac, pentru É, À " +
      "și È merge și tasta Caps Lock.",
  },
  "ca-csa": {
    label: "Franceză canadiană (standardul multilingv canadian)",
    kurz: "tastatură canadiană (CSA)",
    hinweis:
      "Tastatura canadiană (CSA) nu are Œ - textele folosesc înlocuirea obișnuită (Œ → Oe). É, À, È, Ç și Ù se " +
      "scriu direct cu tasta Shift, Ê, Î, Ô și Û cu ^ (apoi tasta Shift și litera), ghilimelele unghiulare cu Alt " +
      "Gr + Z și Alt Gr + X, semnul euro (€) cu Alt Gr + E.",
  },
  "ca-fr": {
    label: "Franceză canadiană (Français (Canada), standard Windows)",
    kurz: "tastatură franceză canadiană",
    hinweis:
      "Tastatura Windows standard pentru franceza din Canada. Nu are Œ - textele folosesc înlocuirea obișnuită. " +
      "É se scrie direct cu tasta Shift; ç și Ç cu tasta moartă pentru sedilă (apoi c sau Shift + C), à, è și ù " +
      "cu tasta moartă pentru accentul grav, Ê, Î, Ô și Û cu ^. Ghilimelele unghiulare au o tastă proprie.",
  },
  es: {
    label: "Spaniolă (Spania, ISO)",
    kurz: "tastatură spaniolă",
    hinweis:
      "Pe tastatura spaniolă, accentul ascuțit (á é í ó ú) este o tastă moartă în dreapta lui ñ; tasta Shift pe " +
      "aceeași tastă dă cele două puncte deasupra (ü). ¡ se scrie direct, ¿ cu tasta Shift - EXACT INVERS față de " +
      "tastatura latino-americană.",
  },
  latam: {
    label: "Spaniolă (America Latină)",
    kurz: "tastatură latino-americană",
    hinweis:
      "Pe tastatura latino-americană, accentul ascuțit (á é í ó ú) este o tastă moartă în dreapta lui p; tasta " +
      "Shift pe aceeași tastă dă cele două puncte deasupra (ü). ¿ se scrie direct, ¡ cu tasta Shift - EXACT " +
      "INVERS față de tastatura spaniolă din Spania. Semnul euro nu este confirmat pe acest aspect.",
  },
  it: {
    label: "Italiană (Italia, Windows Italiano / Mac Italiano - Pro)",
    kurz: "tastatură italiană",
    hinweis:
      "Pe tastatura italiană, à, è, ì, ò și ù au taste proprii; é este Shift + è. À È É Ì Ò Ù mari nu există pe " +
      "Windows (doar printr-un cod cu tasta Alt), așa că acolo textele cu ele sunt lăsate deoparte; pe Mac se " +
      "scriu cu Opțiune + Shift.",
  },
  "it-qzerty": {
    label: "Italiană (Mac Italiano, QZERTY)",
    kurz: "tastatură italiană Mac (QZERTY)",
    hinweis:
      "Tastatura Mac Italiano este QZERTY: z și w sunt inversate, m stă în dreapta lui l, iar cifrele se scriu cu " +
      "tasta Shift (pe șirul de cifre se văd & \" ' ( ç è ) £ à é). à, è, é, ì, ò și ù au taste proprii.",
  },
  // NVDA-Falle (Alt Gr + N = Ctrl + Alt + N) wie im englischen Text.
  pl: {
    label: "Poloneză (programatori, QWERTY)",
    kurz: "tastatură poloneză pentru programatori",
    hinweis:
      "Pe tastatura poloneză pentru programatori (Windows: Polski (programisty), Mac: Polski Pro), literele " +
      "poloneze se scriu cu tasta Alt Gr (Mac: Opțiune) și litera de bază: ą = a, ć = c, ę = e, ł = l, ń = n, " +
      "ó = o, ś = s, ź = x, ż = z. Pentru literă mare se adaugă tasta Shift. Pe Windows, cu NVDA pornit, Alt Gr " +
      "+ N (ń) repornește NVDA, pentru că Ctrl + Alt + N este scurtătura lui NVDA: scurtătura se poate opri în " +
      "NVDA sau se folosește Shift + Caps Lock + Alt Gr + N.",
  },
  "tr-q": {
    label: "Turcă Q (Türkçe Q)",
    kurz: "tastatură turcă Q",
    hinweis:
      "Pe tastatura turcă Q, ı, ğ, ş, ç, ö și ü au taste proprii, în dreapta lui p, l și m. ı și i sunt două " +
      "taste: i stă în dreapta lui ş, ı acolo unde tastatura germană are i. Apostroful este Shift + 2, ghilimelele " +
      "stau în stânga lui 1, ₺ este Alt Gr + T (Mac: Opțiune + T). â, î și û se scriu cu tasta moartă ^ (Shift + " +
      "3), apoi vocala.",
  },
  "tr-f": {
    label: "Turcă F (Türkçe F)",
    kurz: "tastatură turcă F",
    hinweis:
      "Pe tastatura turcă F, șirul de bază este u i e a ü t k m l y ş (în stânga u i e a, în dreapta k m l y). " +
      "Tastele cu liniuțele în relief sunt a (stânga) și k (dreapta). ı, ğ, ş, ç, ö și ü au taste proprii. " +
      "Apostroful este Shift + 7, ghilimelele Shift + 2, ₺ este Alt Gr + T (Mac: Opțiune + T). â, î și û se scriu " +
      "pe Windows cu tasta moartă ^ (Shift + 3); pe Mac cu Opțiune + a, i sau u.",
  },
  cs: {
    label: "Cehă (QWERTZ)",
    kurz: "tastatură cehă",
    hinweis:
      "Pe tastatura cehă, ě š č ř ž ý á í é stau pe șirul de cifre; cifrele se scriu cu tasta Shift. Tasta Shift " +
      "pe aceste taste dă cifra, niciodată litera mare: Č Š Ř Ž Á É Í Ý Ě mari se scriu cu tasta moartă háček sau " +
      "čárka (în dreapta tastei =; háček este Shift + aceeași tastă), apoi tasta Shift și litera - sau cu tasta " +
      "Caps Lock. ď ť ň sunt háček + d, t sau n, ó este čárka + o. ú și ů au taste proprii. Ů mare se scrie doar " +
      "cu tasta Caps Lock.",
  },
  "cs-qwerty": {
    label: "Cehă (QWERTY)",
    kurz: "tastatură cehă QWERTY",
    hinweis:
      "Tastatura cehă QWERTY are y și z unde le are tastatura englezească, în rest este tastatura cehă: ě š č ř ž " +
      "ý á í é stau pe șirul de cifre, cifrele se scriu cu tasta Shift, iar tasta Shift pe aceste taste nu dă " +
      "niciodată litera mare. Č Š Ř Ž Á É Í Ý Ě mari se scriu cu tasta moartă háček sau čárka (în dreapta tastei " +
      "=; háček este Shift + aceeași tastă), apoi tasta Shift și litera - sau cu tasta Caps Lock. ď ť ň sunt " +
      "háček + d, t sau n, ó este čárka + o. Ů mare se scrie doar cu tasta Caps Lock.",
  },
  bg: {
    label: "Bulgară (BDS)",
    kurz: "tastatură bulgară",
    hinweis:
      "Pe tastatura bulgară BDS, șirul de bază este ь я а о ж г т н в м ч. Virgula stă pe tasta unde tastatura " +
      "englezească are Q, punctul la capătul din dreapta al șirului de cifre; cifrele nu au nevoie de tasta Shift. " +
      "ѝ stă în stânga lui ю (cu tasta Shift: Ѝ) și este și Shift + ь. Ь mare se scrie doar cu tasta Caps Lock.",
  },
  "bg-schreibm": {
    label: "Bulgară (mașină de scris)",
    kurz: "tastatură bulgară de mașină de scris",
    hinweis:
      "Tastatura bulgară de mașină de scris are literele tastaturii BDS (șirul de bază ь я а о ж г т н в м), " +
      "virgula pe tasta Q și punctul la capătul din dreapta al șirului de cifre. Nu are ѝ, semnul euro și " +
      "ghilimelele bulgărești: rândurile cu ele nu sunt oferite.",
  },
  "bg-phon": {
    label: "Bulgară (fonetică)",
    kurz: "tastatură bulgară fonetică",
    hinweis:
      "Pe tastatura bulgară fonetică, literele stau unde sunt sunetele lor latine: а pe A, с pe S, д pe D, ф pe F " +
      "și așa mai departe; ч este pe Q, ш pe W, я și щ în dreapta lui п. Virgula, punctul și celelalte semne de " +
      "punctuație stau unde sunt pe tastatura englezească. Ь mare se scrie doar cu tasta Caps Lock.",
  },
  "bg-phon-trad": {
    label: "Bulgară (fonetică, tradițională)",
    kurz: "tastatură bulgară fonetică tradițională",
    hinweis:
      "Tastatura bulgară fonetică tradițională are șirul de bază а с д ф г х й к л ca tastatura fonetică mai " +
      "nouă, dar я este pe Q, в pe W, ч în stânga lui 1 și ь pe X (cu tasta Shift: ѝ). Nu are linie de pauză și " +
      "ghilimele bulgărești: rândurile cu ele nu sunt oferite. Ь mare se scrie doar cu tasta Caps Lock.",
  },
  el: {
    label: "Greacă",
    kurz: "tastatură greacă",
    hinweis:
      "Pe tastatura greacă, literele stau unde sunt sunetele lor latine: α pe A, β pe B și așa mai departe. Sigma " +
      "finală ς este pe W, semnul întrebării ; pe Q. Tonosul ΄ este o tastă moartă în dreapta lui λ: întâi " +
      "tonosul, apoi vocala (ά). Cu tasta Shift, aceeași tastă dă cele două puncte deasupra ¨ (ϊ). Pentru literă " +
      "mare cu tonos: tonosul, apoi tasta Shift și vocala (Ά).",
  },
  "el-220": {
    label: "Greacă (220)",
    kurz: "tastatură greacă 220",
    hinweis:
      "Tastatura greacă 220 are literele tastaturii grecești (α pe A, ς pe W) și tasta moartă tonos ΄ în dreapta " +
      "lui λ. Cele două puncte deasupra ¨ au o tastă moartă proprie, în dreapta ei; apostroful stă în dreapta lui " +
      "0, cratima jos în dreapta, semnul întrebării ; pe Q.",
  },
  "el-319": {
    label: "Greacă (319)",
    kurz: "tastatură greacă 319",
    hinweis:
      "Tastatura greacă 319 are literele tastaturii grecești (α pe A, ς pe W) și tasta moartă tonos ΄ în dreapta " +
      "lui λ. Ano teleia · este pe Q, semnul întrebării ; este Shift + virgulă, apostroful tipografic ’ stă în " +
      "dreapta tastei tonos. Nu are @, #, &, acolade și paranteze unghiulare.",
  },
  hu: {
    label: "Maghiară (QWERTZ)",
    kurz: "tastatură maghiară",
    hinweis:
      "Pe tastatura maghiară, 0 stă în stânga lui 1; unde stă de obicei 0 este ö, apoi ü și ó. ő și ú stau în " +
      "dreapta lui p, é á ű în dreapta lui l, í în stânga lui y. Fiecare literă cu accent are tasta ei, cu tasta " +
      "Shift litera mare. ; @ € și parantezele se scriu cu Alt Gr.",
  },
  "hu-101": {
    label: "Maghiară (QWERTY, 101 taste)",
    kurz: "tastatură maghiară QWERTY",
    hinweis:
      "Tastatura maghiară cu 101 taste are y și z ca tastatura englezească. í stă în stânga lui 1, 0 este Alt Gr " +
      "+ aceeași tastă; unde stă de obicei 0 este ö. ő și ú stau în dreapta lui p, ű deasupra tastei Enter, é și " +
      "á în dreapta lui l.",
  },
  "nl-intl": {
    label: "Neerlandeză (SUA internațional)",
    kurz: "tastatură SUA internațional",
    hinweis:
      "Pe tastatura SUA internațional, ' și \" (tasta din dreapta lui ;) sunt taste moarte: pentru semnul însuși " +
      "se apasă după ele bara de spațiu. ë este \" apoi e, ï este \" apoi i. Semnul euro este Alt Gr + 5, iar é " +
      "este Alt Gr + E (sau ' apoi e).",
  },
  "nl-dutch": {
    label: "Neerlandeză (aspect neerlandez)",
    kurz: "tastatură neerlandeză",
    hinweis:
      "Pe tastatura neerlandeză, ' este Shift + 0, \" este Shift + 2, iar @ stă în stânga lui 1 pe șirul de " +
      "cifre. ë și ï se scriu cu tasta moartă ¨ din dreapta lui p, é cu tasta moartă ´ din dreapta lui +: întâi " +
      "tasta moartă, apoi litera.",
  },
  pt: {
    label: "Portugheză (Portugalia)",
    kurz: "tastatură portugheză",
    hinweis:
      "Pe tastatura portugheză, ç are tasta ei în dreapta lui l. Accentul ascuțit ´ este o tastă moartă în " +
      "dreapta lui + (cu tasta Shift accentul grav `), tilda ~ o tastă moartă în dreapta lui º (cu tasta Shift " +
      "circumflexul ^): întâi tasta moartă, apoi vocala (á, ã, ê). Ghilimelele unghiulare au o tastă proprie în " +
      "dreapta apostrofului.",
  },
  "br-abnt2": {
    label: "Portugheză (Brazilia, ABNT2)",
    kurz: "tastatură braziliană",
    hinweis:
      "Pe tastatura braziliană ABNT2, ç are tasta ei în dreapta lui l. Accentul ascuțit ´ este o tastă moartă în " +
      "dreapta lui p (cu tasta Shift accentul grav `), tilda ~ o tastă moartă în dreapta lui ç (cu tasta Shift " +
      "circumflexul ^). Shift + 6 este tasta moartă ¨, nu un semn. Apostroful ' stă în stânga lui 1 (cu tasta " +
      "Shift \"), punctul și virgula ; jos în dreapta. / și ? sunt pe tasta suplimentară din dreapta lui ; sau " +
      "Alt Gr + Q și Alt Gr + W.",
  },
  ro: {
    label: "Română (standard)",
    kurz: "tastatură română",
    hinweis:
      "Pe tastatura română standard, ă și î stau în dreapta lui p, â deasupra tastei Enter, ș și ț în dreapta lui " +
      "l - ș și ț cu virgulă dedesubt, cum trebuie. Ghilimelele „ și ” stau în stânga lui 1 (” cu tasta Shift). " +
      "Apostroful este Alt Gr + ț, semnul euro Alt Gr + E.",
  },
  "ro-prog": {
    label: "Română (programatori)",
    kurz: "tastatură română pentru programatori",
    hinweis:
      "Pe tastatura română pentru programatori, literele românești se scriu cu tasta Alt Gr și litera de bază: " +
      "ă = a, â = q, î = i, ș = s, ț = t; pentru literă mare se adaugă tasta Shift. În rest este tastatura " +
      "englezească (SUA).",
  },
  sv: {
    label: "Suedeză (Suedia, Finlanda)",
    kurz: "tastatură suedeză",
    hinweis:
      "Pe tastatura suedeză, å stă în dreapta lui p, ö și ä în dreapta lui l - fiecare are tasta ei, cu tasta " +
      "Shift litera mare. é este tasta moartă ´ (în dreapta lui +), apoi e. @ este Alt Gr + 2, € este Alt Gr + E. " +
      "Tastatura finlandeză este la fel.",
  },
  ua: {
    label: "Ucraineană (extinsă)",
    kurz: "tastatură ucraineană",
    hinweis:
      "Pe tastatura ucraineană, șirul de bază este ф і в а п р о л д ж є. Apostroful ' stă în stânga lui 1 (cu " +
      "tasta Shift semnul grivnei ₴). Punctul stă jos în dreapta, virgula este Shift + aceeași tastă. ґ stă în " +
      "stânga lui я sau este Alt Gr + г.",
  },
  "ua-std": {
    label: "Ucraineană (standard)",
    kurz: "tastatură ucraineană standard",
    hinweis:
      "Tastatura ucraineană standard este tastatura ucraineană fără apostrof: în stânga lui 1 stă ё din rusă. " +
      "Cuvintele cu apostrof nu sunt oferite - tastatura ucraineană extinsă îl are.",
  },
};
