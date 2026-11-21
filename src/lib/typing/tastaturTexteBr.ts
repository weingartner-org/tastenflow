/**
 * ★ O2-TASTATUR (29.10.2026): NAME, KURZNAME UND ERKLÄRUNG JEDER TASTATUR PORTUGIESISCH (BRASILIEN, Bedienungssprache `br`).
 *
 * Bauart wie `tastaturTexteCs.ts`: `layouts.ts` bleibt unberührt, die Tabelle für `br` steht HIER, und `layoutTexteIn`
 * (`tastaturTexteIt.ts`) ist der eine Weg, den die Oberfläche geht. Eine Tabelle je `LayoutId`, damit `tsc` für jede
 * Tastatur einen Eintrag verlangt. Auch die Tastaturen der neun neuen Wege tragen eine EIGENE Übersetzung.
 *
 * Getrennt von `tastaturTextePt.ts` - Brasilien ist nicht Portugal. Namen nach dem Glossar
 * (`recherche-portugiesisch-brasilien-2026-10-25/GLOSSAR-pt-BR.md` §2.9 `LAYOUT_TEXTE_PT_BR`) im Muster von Windows pt-BR
 * (Sprache als Hauptwort, dann Land/Art in Klammern): „Português (Brasil ABNT2)", „Português (Portugal)", „Alemão
 * (Alemanha e Áustria)", „Inglês (Estados Unidos)", „Inglês (Reino Unido)", „Inglês (Estados Unidos - Internacional)".
 * Der Kurzname klein - er steht nach „Teclado:". Tastennamen wie auf der Kappe (`tastenErklaerungBr.ts`): Shift,
 * Caps Lock, Alt Gr (mit Leerzeichen), Mac: Option; die Totaste heisst „tecla de acento" (Glossar §2.2). Reihen:
 * „fileira central", „fileira dos números" (nie „fila" - in Brasilien die Warteschlange). Brasilianisch: canadense,
 * polonês, tcheco, holandês, chaves, embaixo, acima. Die Erklärungen sagen dasselbe wie die englischen
 * (`layout.en.hinweis`), Satz für Satz an ihnen geprüft; sie sind unpersönlich (Passiv, „fica", „dá"), weil Kind und
 * Lehrkraft sie lesen - kein „você". « » heissen „aspas angulares", das Zeichen selbst steht nie im Text.
 */
import type { LayoutId } from "./layouts";

type Texte = { label: string; kurz: string; hinweis?: string };

const INGLES =
  "Os teclados ingleses não têm ä, ö, ü nem ß. Por isso, os textos em alemão usam a forma usual " +
  "(ä → ae, ß → ss) - para inglês, este teclado é perfeito.";

const TCHECO_MAIUSCULAS =
  "As maiúsculas Č Š Ř Ž Á É Í Ý Ě são digitadas com a tecla de acento háček ou čárka (à direita da " +
  "tecla =; o háček é Shift + a mesma tecla), seguida de Shift e da letra - ou com Caps Lock. ď ť ň são " +
  "háček + d, t ou n, ó é čárka + o.";

export const LAYOUT_TEXTE_BR: Record<LayoutId, Texte> = {
  de: { label: "Alemão (Alemanha e Áustria)", kurz: "teclado alemão" },
  ch: {
    label: "Alemão (Suíça)",
    kurz: "teclado suíço",
    hinweis:
      "O teclado suíço não tem a tecla ß; por isso, as palavras em alemão com ß são escritas aqui com ss - como " +
      "na Suíça. As maiúsculas Ä, Ö e Ü são digitadas com a tecla de acento ¨ (à direita do ü), seguida de Shift " +
      "e da letra (Shift no ä, no ö e no ü dá à, é e è). Caps Lock também funciona.",
  },
  us: { label: "Inglês (Estados Unidos)", kurz: "teclado americano", hinweis: INGLES },
  uk: { label: "Inglês (Reino Unido)", kurz: "teclado britânico", hinweis: INGLES },
  fr: {
    label: "Francês (França, AZERTY)",
    kurz: "teclado francês",
    hinweis:
      "O teclado francês AZERTY (Windows) não tem É, Ç, Œ nem aspas angulares - os textos com É ou Ç ficam de " +
      "fora; para o Œ e as aspas angulares é usada a forma usual (Œ → Oe, aspas angulares → aspas retas). À, È e " +
      "Ù são digitados com a tecla de acento grave (Alt Gr + 7), Ê, Î, Ô e Û com o ^ - sempre seguidos de Shift " +
      "e da letra.",
  },
  be: {
    label: "Francês (Bélgica, AZERTY)",
    kurz: "teclado belga",
    hinweis:
      "O teclado belga AZERTY (Windows) não tem Ç maiúsculo, nem Œ, nem aspas angulares - os textos com Ç ficam " +
      "de fora; para o Œ e as aspas angulares é usada a forma usual. O É é digitado com a tecla de acento agudo " +
      "(Alt Gr + ù), À, È e Ù com a tecla de acento grave (Alt Gr + µ), Ê, Î, Ô e Û com o ^ - sempre seguidos " +
      "de Shift e da letra.",
  },
  "ch-fr": {
    label: "Francês (Suíça e Luxemburgo)",
    kurz: "teclado suíço francês",
    hinweis:
      "O teclado suíço francês não tem Ç maiúsculo, nem Œ, nem aspas angulares - os textos com Ç ficam de fora; " +
      "para o Œ e as aspas angulares é usada a forma usual. O É é digitado com a tecla de acento agudo " +
      "(Alt Gr + '), À, È e Ù com a tecla de acento grave (Shift + ^) - sempre seguidos de Shift e da letra. " +
      "Shift no é, no à e no è dá ö, ä e ü. No Mac, Caps Lock também funciona para É, À e È.",
  },
  "ca-csa": {
    label: "Francês canadense (Canadien multilingue standard)",
    kurz: "teclado canadense (CSA)",
    hinweis:
      "O teclado canadense (CSA) não tem Œ - os textos usam a forma usual (Œ → Oe). É, À, È, Ç e Ù são " +
      "digitados direto com Shift, Ê, Î, Ô e Û com o ^ (depois Shift e a letra), as aspas angulares com " +
      "Alt Gr + Z e Alt Gr + X, o € com Alt Gr + E.",
  },
  "ca-fr": {
    label: "Francês canadense (Français (Canada), padrão do Windows)",
    kurz: "teclado francês canadense",
    hinweis:
      "O teclado padrão do Windows para francês no Canadá. Não tem Œ - os textos usam a forma usual. O É é " +
      "digitado direto com Shift; ç e Ç são digitados com a tecla de acento da cedilha (depois c ou Shift + C), " +
      "à, è e ù com a tecla de acento grave, Ê, Î, Ô e Û com o ^. As aspas angulares têm uma tecla própria.",
  },
  es: {
    label: "Espanhol (Espanha, ISO)",
    kurz: "teclado espanhol",
    hinweis:
      "No teclado espanhol, o acento agudo (á é í ó ú) é uma tecla de acento à direita do ñ; Shift na mesma " +
      "tecla dá o trema (ü). O ¡ é digitado direto, o ¿ precisa de Shift - exatamente AO CONTRÁRIO do teclado " +
      "latino-americano.",
  },
  latam: {
    label: "Espanhol (América Latina)",
    kurz: "teclado latino-americano",
    hinweis:
      "No teclado latino-americano, o acento agudo (á é í ó ú) é uma tecla de acento à direita do p; Shift na " +
      "mesma tecla dá o trema (ü). O ¿ é digitado direto, o ¡ precisa de Shift - exatamente AO CONTRÁRIO do " +
      "teclado espanhol (Espanha). O símbolo do euro não está confirmado neste teclado.",
  },
  it: {
    label: "Italiano (Itália, Windows Italiano / Mac Italiano - Pro)",
    kurz: "teclado italiano",
    hinweis:
      "No teclado italiano, à, è, ì, ò e ù têm teclas próprias; o é é Shift + è. As maiúsculas À È É Ì Ò Ù não " +
      "existem no Windows (só por um código Alt), por isso os textos com elas ficam de fora ali; no Mac elas são " +
      "digitadas com Option + Shift.",
  },
  "it-qzerty": {
    label: "Italiano (Mac Italiano, QZERTY)",
    kurz: "teclado italiano Mac (QZERTY)",
    hinweis:
      "O teclado Mac Italiano é QZERTY: o z e o w estão trocados, o m fica à direita do l e os algarismos " +
      "precisam de Shift (a fileira dos números mostra & \" ' ( ç è ) £ à é). à, è, é, ì, ò e ù têm teclas " +
      "próprias.",
  },
  // NVDA-Falle (Alt Gr + N = Ctrl + Alt + N) wie im englischen Text.
  pl: {
    label: "Polonês (programadores, QWERTY)",
    kurz: "teclado polonês de programadores",
    hinweis:
      "No teclado polonês de programadores (Windows: Polski (programisty), Mac: Polski Pro), as letras " +
      "polonesas são digitadas com a tecla Alt Gr (Mac: Option) e a letra base: ą = a, ć = c, ę = e, ł = l, " +
      "ń = n, ó = o, ś = s, ź = x, ż = z. Para a maiúscula, acrescenta-se Shift. Com o NVDA no Windows, " +
      "Alt Gr + N (ń) reinicia o NVDA, porque Ctrl + Alt + N é o atalho dele: esse atalho pode ser desativado " +
      "no NVDA, ou então se usa Shift + Caps Lock + Alt Gr + N.",
  },
  "tr-q": {
    label: "Turco Q (Türkçe Q)",
    kurz: "teclado turco Q",
    hinweis:
      "No teclado turco Q, ı, ğ, ş, ç, ö e ü têm teclas próprias, à direita do p, do l e do m. O ı e o i são " +
      "duas teclas: o i fica à direita do ş, o ı onde o teclado alemão tem o i. O apóstrofo é Shift + 2, as " +
      "aspas ficam à esquerda do 1, o ₺ é Alt Gr + T (Mac: Option + T). â, î e û são digitados com a tecla de " +
      "acento ^ (Shift + 3), seguida da vogal.",
  },
  "tr-f": {
    label: "Turco F (Türkçe F)",
    kurz: "teclado turco F",
    hinweis:
      "No teclado turco F, a fileira central é u i e a ü t k m l y ş (à esquerda u i e a, à direita k m l y). " +
      "As teclas com as marcas táteis são o a (à esquerda) e o k (à direita). ı, ğ, ş, ç, ö e ü têm teclas " +
      "próprias. O apóstrofo é Shift + 7, as aspas Shift + 2, o ₺ é Alt Gr + T (Mac: Option + T). â, î e û são " +
      "digitados no Windows com a tecla de acento ^ (Shift + 3); no Mac são Option + a, i ou u.",
  },
  cs: {
    label: "Tcheco (QWERTZ)",
    kurz: "teclado tcheco",
    hinweis:
      "No teclado tcheco, ě š č ř ž ý á í é ficam na fileira dos números; os algarismos são digitados com " +
      "Shift. Shift nessas teclas dá o algarismo, nunca a maiúscula. " + TCHECO_MAIUSCULAS + " ú e ů têm teclas " +
      "próprias. O Ů maiúsculo só funciona com Caps Lock.",
  },
  "cs-qwerty": {
    label: "Tcheco (QWERTY)",
    kurz: "teclado tcheco QWERTY",
    hinweis:
      "O teclado tcheco QWERTY tem o y e o z onde o teclado inglês os tem; fora isso, é o teclado tcheco: ě š " +
      "č ř ž ý á í é ficam na fileira dos números, os algarismos são digitados com Shift, e Shift nessas teclas " +
      "nunca dá a maiúscula. " + TCHECO_MAIUSCULAS + " O Ů maiúsculo só funciona com Caps Lock.",
  },
  bg: {
    label: "Búlgaro (BDS)",
    kurz: "teclado búlgaro",
    hinweis:
      "No teclado búlgaro BDS, a fileira central é ь я а о ж г т н в м ч. A vírgula fica na tecla onde o " +
      "teclado inglês tem o Q, o ponto final na ponta direita da fileira dos números; os algarismos não precisam " +
      "de Shift. O ѝ fica à esquerda do ю (com Shift: Ѝ) e também é Shift + ь. O Ь maiúsculo só sai com Caps Lock.",
  },
  "bg-schreibm": {
    label: "Búlgaro (máquina de escrever)",
    kurz: "teclado búlgaro de máquina de escrever",
    hinweis:
      "O teclado búlgaro de máquina de escrever tem as letras do teclado BDS (fileira central ь я а о ж г т н в " +
      "м), a vírgula na tecla Q e o ponto final na ponta direita da fileira dos números. Não tem ѝ, nem símbolo " +
      "do euro, nem aspas búlgaras: as linhas com eles não são oferecidas.",
  },
  "bg-phon": {
    label: "Búlgaro (fonético)",
    kurz: "teclado búlgaro fonético",
    hinweis:
      "No teclado búlgaro fonético, as letras ficam onde estão os sons latinos delas: а no A, с no S, д no D, ф " +
      "no F e assim por diante; ч fica no Q, ш no W, я e щ à direita do п. A vírgula, o ponto final e os outros " +
      "sinais de pontuação ficam onde estão no teclado inglês. O Ь maiúsculo só sai com Caps Lock.",
  },
  "bg-phon-trad": {
    label: "Búlgaro (fonético, tradicional)",
    kurz: "teclado búlgaro fonético tradicional",
    hinweis:
      "O teclado búlgaro fonético tradicional tem a fileira central а с д ф г х й к л, como o fonético mais " +
      "novo, mas я fica no Q, в no W, ч à esquerda do 1 e ь no X (com Shift: ѝ). Não tem travessão nem aspas " +
      "búlgaras: as linhas com eles não são oferecidas. O Ь maiúsculo só sai com Caps Lock.",
  },
  el: {
    label: "Grego",
    kurz: "teclado grego",
    hinweis:
      "No teclado grego, as letras ficam onde estão os sons latinos delas: α no A, β no B e assim por diante. O " +
      "sigma final ς fica no W, o ponto de interrogação ; no Q. O tonos ΄ é uma tecla de acento à direita do λ: " +
      "primeiro o tonos, depois a vogal (ά). Com Shift, a mesma tecla dá o dialytika ¨ (ϊ). Para uma maiúscula " +
      "com tonos: tonos, depois Shift e a vogal (Ά).",
  },
  "el-220": {
    label: "Grego (220)",
    kurz: "teclado grego 220",
    hinweis:
      "O teclado grego 220 tem as letras do teclado grego (α no A, ς no W) e a tecla de acento do tonos ΄ à " +
      "direita do λ. O dialytika ¨ tem uma tecla de acento própria, à direita dela; o apóstrofo fica à direita " +
      "do 0, o hífen embaixo à direita, o ponto de interrogação ; no Q.",
  },
  "el-319": {
    label: "Grego (319)",
    kurz: "teclado grego 319",
    hinweis:
      "O teclado grego 319 tem as letras do teclado grego (α no A, ς no W) e a tecla de acento do tonos ΄ à " +
      "direita do λ. A ano teleia · fica no Q, o ponto de interrogação ; é Shift + vírgula, o apóstrofo " +
      "tipográfico ’ fica à direita da tecla do tonos. Não tem @, #, &, chaves nem sinais de menor e maior.",
  },
  hu: {
    label: "Húngaro (QWERTZ)",
    kurz: "teclado húngaro",
    hinweis:
      "No teclado húngaro, o 0 fica à esquerda do 1; onde o 0 costuma ficar, está o ö, depois o ü e o ó. ő e ú " +
      "ficam à direita do p, é á ű à direita do l, í à esquerda do y. Cada letra acentuada tem uma tecla " +
      "própria, com Shift a maiúscula dela. ; @ € e os colchetes são digitados com Alt Gr.",
  },
  "hu-101": {
    label: "Húngaro (QWERTY, 101 teclas)",
    kurz: "teclado húngaro QWERTY",
    hinweis:
      "O teclado húngaro de 101 teclas tem o y e o z como o teclado inglês. O í fica à esquerda do 1, o 0 é " +
      "Alt Gr + essa tecla; onde o 0 costuma ficar, está o ö. ő e ú ficam à direita do p, ű acima do Enter, é " +
      "e á à direita do l.",
  },
  "nl-intl": {
    label: "Holandês (Estados Unidos - Internacional)",
    kurz: "teclado Estados Unidos - Internacional",
    hinweis:
      "No teclado Estados Unidos - Internacional, ' e \" (a tecla à direita do ;) são teclas de acento: para o " +
      "próprio sinal, pressiona-se a barra de espaço logo depois. ë é \" e depois e, ï é \" e depois i. é é " +
      "Alt Gr + E (ou ' e depois e), o símbolo do euro Alt Gr + 5.",
  },
  "nl-dutch": {
    label: "Holandês (Holanda)",
    kurz: "teclado holandês",
    hinweis:
      "No teclado holandês, o @ fica à esquerda do 1, o ' é Shift + 0 e o \" é Shift + 2. ë e ï são digitados " +
      "com a tecla de acento ¨ à direita do p, é com a tecla de acento ´ à direita do +: primeiro a tecla de " +
      "acento, depois a letra.",
  },
  pt: {
    label: "Português (Portugal)",
    kurz: "teclado português",
    hinweis:
      "No teclado português, o ç tem uma tecla própria à direita do l. O acento agudo ´ é uma tecla de acento à " +
      "direita do + (com Shift, o acento grave `), o til ~ uma tecla de acento à direita do º (com Shift, o " +
      "acento circunflexo ^): primeiro a tecla de acento, depois a vogal (á, ã, ê). As aspas angulares têm uma " +
      "tecla própria à direita do apóstrofo.",
  },
  // Glossar §2.9 und Bauplan I9: Shift + 6 ist auf ABNT2 eine Akzent-Taste (¨), kein Zeichen.
  "br-abnt2": {
    label: "Português (Brasil ABNT2)",
    kurz: "teclado brasileiro",
    hinweis:
      "No teclado brasileiro ABNT2, o ç tem uma tecla própria à direita do l. O acento agudo ´ é uma tecla de " +
      "acento à direita do p (com Shift, o acento grave `), o til ~ uma tecla de acento à direita do ç (com " +
      "Shift, o acento circunflexo ^). Shift + 6 é a tecla de acento ¨, não um sinal. O ' fica à esquerda do 1 " +
      "(com Shift, \"), o ; embaixo à direita. / e ? ficam na tecla extra à direita do ; ou em Alt Gr + Q e " +
      "Alt Gr + W.",
  },
  ro: {
    label: "Romeno (padrão)",
    kurz: "teclado romeno",
    hinweis:
      "No teclado romeno padrão, ă e î ficam à direita do p, â acima do Enter, ș e ț à direita do l - ș e ț " +
      "com vírgula embaixo, como deve ser. As aspas „ e ” ficam à esquerda do 1 (” com Shift). O apóstrofo é " +
      "Alt Gr + ț, o símbolo do euro Alt Gr + E.",
  },
  "ro-prog": {
    label: "Romeno (programadores, QWERTY)",
    kurz: "teclado romeno de programadores",
    hinweis:
      "No teclado romeno de programadores, as letras romenas são digitadas com a tecla Alt Gr e a letra base: " +
      "ă = a, â = q, î = i, ș = s, ț = t; para a maiúscula, acrescenta-se Shift. Fora isso, é o teclado inglês " +
      "(Estados Unidos).",
  },
  sv: {
    label: "Sueco (Suécia, Finlândia)",
    kurz: "teclado sueco",
    hinweis:
      "No teclado sueco, o å fica à direita do p, o ö e o ä à direita do l - cada um tem uma tecla própria, com " +
      "Shift a maiúscula dele. O é é digitado com a tecla de acento ´ (à direita do +), depois o e. O @ é " +
      "Alt Gr + 2, o € Alt Gr + E. O teclado finlandês é igual.",
  },
  ua: {
    label: "Ucraniano (estendido)",
    kurz: "teclado ucraniano",
    hinweis:
      "No teclado ucraniano, a fileira central é ф і в а п р о л д ж є. O apóstrofo ' fica à esquerda do 1 " +
      "(com Shift, o símbolo da hryvnia ₴). O ponto final fica embaixo à direita, a vírgula é Shift + a mesma " +
      "tecla. O ґ fica à esquerda do я, ou em Alt Gr + г.",
  },
  "ua-std": {
    label: "Ucraniano (padrão)",
    kurz: "teclado ucraniano padrão",
    hinweis:
      "O teclado ucraniano padrão é o teclado ucraniano sem o apóstrofo: à esquerda do 1 fica o ё russo. As " +
      "palavras com apóstrofo não são oferecidas - o teclado ucraniano estendido tem esse sinal.",
  },
};
