/**
 * ★ O2-TASTATUR (29.10.2026): NAME, KURZNAME UND ERKLÄRUNG JEDER TASTATUR PORTUGIESISCH (PORTUGAL).
 *
 * Bauart wie `tastaturTexteCs.ts`: `layouts.ts` bleibt unberührt, die Tabelle für die Bedienungssprache `pt` steht HIER,
 * und `layoutTexteIn` (`tastaturTexteIt.ts`) ist der eine Weg, den die Oberfläche geht. Eine Tabelle je `LayoutId`, damit
 * `tsc` für jede Tastatur einen Eintrag verlangt. Anders als cs/it/pl/tr: auch die Tastaturen der neun neuen Wege (bg, el,
 * hu, nl, pt, br, ro, sv, uk) tragen eine EIGENE Übersetzung, keinen Rückfall auf Englisch.
 *
 * Namen nach dem Glossar (`recherche-portugiesisch-2026-10-25/GLOSSAR-pt.md` §2.9 `LAYOUT_TEXTE_PT`): „Portuguesa
 * (Portugal)", „Brasileira (ABNT2)", „Alemã (Alemanha e Áustria)", „Inglesa (Estados Unidos)", „Inglesa (Reino Unido)";
 * die übrigen nach demselben Muster (weibliches Adjektiv, dann Land in Klammern). Der Kurzname klein - er steht nach
 * „Teclado:". Tastennamen wie auf der Kappe (Glossar §2.9, `tastenErklaerungPt.ts`): Shift, Caps Lock, Alt Gr (mit
 * Leerzeichen), Mac: Opção; die Totaste heisst „tecla de acento" (Glossar §2.2, Oberfläche). Reihen: „fila de base",
 * „fila dos números" (nie „linha" - das ist die Übungszeile). Europäisches Portugiesisch: canadiano, chavetas, em baixo,
 * táteis. Die Erklärungen sagen dasselbe wie die englischen (`layout.en.hinweis`), Satz für Satz an ihnen geprüft; sie
 * sind unpersönlich („escreve-se", „obtém-se"), weil Kind und Lehrkraft sie lesen. « » heissen „aspas angulares" - das
 * Zeichen selbst steht nie im Text (Braillezeile).
 */
import type { LayoutId } from "./layouts";

type Texte = { label: string; kurz: string; hinweis?: string };

const INGLESA =
  "Os teclados ingleses não têm ä, ö, ü nem ß. Por isso, os textos alemães usam a forma habitual " +
  "(ä → ae, ß → ss) - para inglês, este teclado serve na perfeição.";

const CHECO_MAIUSCULAS =
  "As maiúsculas Č Š Ř Ž Á É Í Ý Ě obtêm-se com a tecla de acento háček ou čárka (à direita da tecla =; " +
  "o háček é Shift + a mesma tecla), seguida de Shift e da letra - ou com o Caps Lock. ď ť ň são háček + d, t " +
  "ou n, ó é čárka + o.";

export const LAYOUT_TEXTE_PT: Record<LayoutId, Texte> = {
  de: { label: "Alemã (Alemanha e Áustria)", kurz: "teclado alemão" },
  ch: {
    label: "Suíça (alemã)",
    kurz: "teclado suíço",
    hinweis:
      "O teclado suíço não tem a tecla ß; por isso, as palavras alemãs com ß escrevem-se aqui com ss - como na " +
      "Suíça. As maiúsculas Ä, Ö e Ü obtêm-se com a tecla de acento ¨ (à direita do ü), seguida de Shift e da " +
      "letra (Shift no ä, no ö e no ü dá à, é e è). O Caps Lock também funciona.",
  },
  us: { label: "Inglesa (Estados Unidos)", kurz: "teclado americano", hinweis: INGLESA },
  uk: { label: "Inglesa (Reino Unido)", kurz: "teclado britânico", hinweis: INGLESA },
  fr: {
    label: "Francesa (França, AZERTY)",
    kurz: "teclado francês",
    hinweis:
      "O teclado francês AZERTY (Windows) não tem É, Ç, Œ nem aspas angulares - os textos com É ou Ç ficam de " +
      "fora; para o Œ e as aspas angulares usa-se a forma habitual (Œ → Oe, aspas angulares → aspas retas). À, " +
      "È e Ù obtêm-se com a tecla de acento grave (Alt Gr + 7), Ê, Î, Ô e Û com o ^ - de cada vez seguido de " +
      "Shift e da letra.",
  },
  be: {
    label: "Francesa (Bélgica, AZERTY)",
    kurz: "teclado belga",
    hinweis:
      "O teclado belga AZERTY (Windows) não tem Ç maiúsculo, nem Œ, nem aspas angulares - os textos com Ç ficam " +
      "de fora; para o Œ e as aspas angulares usa-se a forma habitual. O É obtém-se com a tecla de acento agudo " +
      "(Alt Gr + ù), À, È e Ù com a tecla de acento grave (Alt Gr + µ), Ê, Î, Ô e Û com o ^ - de cada vez " +
      "seguido de Shift e da letra.",
  },
  "ch-fr": {
    label: "Suíça (francesa; Suíça e Luxemburgo)",
    kurz: "teclado suíço francês",
    hinweis:
      "O teclado suíço francês não tem Ç maiúsculo, nem Œ, nem aspas angulares - os textos com Ç ficam de fora; " +
      "para o Œ e as aspas angulares usa-se a forma habitual. O É obtém-se com a tecla de acento agudo " +
      "(Alt Gr + '), À, È e Ù com a tecla de acento grave (Shift + ^) - de cada vez seguido de Shift e da letra. " +
      "Shift no é, no à e no è dá ö, ä e ü. No Mac, o Caps Lock também funciona para É, À e È.",
  },
  "ca-csa": {
    label: "Francesa do Canadá (Canadien multilingue standard)",
    kurz: "teclado canadiano (CSA)",
    hinweis:
      "O teclado canadiano (CSA) não tem Œ - os textos usam a forma habitual (Œ → Oe). É, À, È, Ç e Ù " +
      "escrevem-se diretamente com Shift, Ê, Î, Ô e Û com o ^ (depois Shift e a letra), as aspas angulares com " +
      "Alt Gr + Z e Alt Gr + X, o € com Alt Gr + E.",
  },
  "ca-fr": {
    label: "Francesa do Canadá (Français (Canada), padrão do Windows)",
    kurz: "teclado francês do Canadá",
    hinweis:
      "O teclado padrão do Windows para francês no Canadá. Não tem Œ - os textos usam a forma habitual. O É " +
      "escreve-se diretamente com Shift; ç e Ç obtêm-se com a tecla de acento da cedilha (depois c ou Shift + C), " +
      "à, è e ù com a tecla de acento grave, Ê, Î, Ô e Û com o ^. As aspas angulares têm uma tecla própria.",
  },
  es: {
    label: "Espanhola (Espanha, ISO)",
    kurz: "teclado espanhol",
    hinweis:
      "No teclado espanhol, o acento agudo (á é í ó ú) é uma tecla de acento à direita do ñ; Shift na mesma " +
      "tecla dá o trema (ü). O ¡ escreve-se diretamente, o ¿ precisa de Shift - exatamente AO CONTRÁRIO do " +
      "teclado latino-americano.",
  },
  latam: {
    label: "Espanhola (América Latina)",
    kurz: "teclado latino-americano",
    hinweis:
      "No teclado latino-americano, o acento agudo (á é í ó ú) é uma tecla de acento à direita do p; Shift na " +
      "mesma tecla dá o trema (ü). O ¿ escreve-se diretamente, o ¡ precisa de Shift - exatamente AO CONTRÁRIO do " +
      "teclado espanhol (Espanha). O símbolo do euro não está confirmado neste teclado.",
  },
  it: {
    label: "Italiana (Itália, Windows Italiano / Mac Italiano - Pro)",
    kurz: "teclado italiano",
    hinweis:
      "No teclado italiano, à, è, ì, ò e ù têm teclas próprias; o é é Shift + è. As maiúsculas À È É Ì Ò Ù não " +
      "existem no Windows (só através de um código Alt), por isso os textos com elas ficam ali de fora; no Mac " +
      "obtêm-se com Opção + Shift.",
  },
  "it-qzerty": {
    label: "Italiana (Mac Italiano, QZERTY)",
    kurz: "teclado italiano Mac (QZERTY)",
    hinweis:
      "O teclado Mac Italiano é QZERTY: o z e o w estão trocados, o m fica à direita do l e os algarismos " +
      "precisam de Shift (a fila dos números mostra & \" ' ( ç è ) £ à é). à, è, é, ì, ò e ù têm teclas próprias.",
  },
  // NVDA-Falle (Alt Gr + N = Ctrl + Alt + N) wie im englischen Text.
  pl: {
    label: "Polaca (programadores, QWERTY)",
    kurz: "teclado polaco de programadores",
    hinweis:
      "No teclado polaco de programadores (Windows: Polski (programisty), Mac: Polski Pro), as letras polacas " +
      "escrevem-se com a tecla Alt Gr (Mac: Opção) e a letra base: ą = a, ć = c, ę = e, ł = l, ń = n, ó = o, " +
      "ś = s, ź = x, ż = z. Para a maiúscula, junta-se Shift. Com o NVDA no Windows, Alt Gr + N (ń) reinicia o " +
      "NVDA, porque Ctrl + Alt + N é o seu atalho: esse atalho pode ser desligado no NVDA, ou usa-se " +
      "Shift + Caps Lock + Alt Gr + N.",
  },
  "tr-q": {
    label: "Turca Q (Türkçe Q)",
    kurz: "teclado turco Q",
    hinweis:
      "No teclado turco Q, ı, ğ, ş, ç, ö e ü têm teclas próprias, à direita do p, do l e do m. O ı e o i são " +
      "duas teclas: o i fica à direita do ş, o ı onde o teclado alemão tem o i. O apóstrofo é Shift + 2, as " +
      "aspas ficam à esquerda do 1, o ₺ é Alt Gr + T (Mac: Opção + T). â, î e û obtêm-se com a tecla de " +
      "acento ^ (Shift + 3), seguida da vogal.",
  },
  "tr-f": {
    label: "Turca F (Türkçe F)",
    kurz: "teclado turco F",
    hinweis:
      "No teclado turco F, a fila de base é u i e a ü t k m l y ş (à esquerda u i e a, à direita k m l y). As " +
      "teclas com as marcas táteis são o a (à esquerda) e o k (à direita). ı, ğ, ş, ç, ö e ü têm teclas " +
      "próprias. O apóstrofo é Shift + 7, as aspas Shift + 2, o ₺ é Alt Gr + T (Mac: Opção + T). â, î e û " +
      "obtêm-se no Windows com a tecla de acento ^ (Shift + 3); no Mac são Opção + a, i ou u.",
  },
  cs: {
    label: "Checa (QWERTZ)",
    kurz: "teclado checo",
    hinweis:
      "No teclado checo, ě š č ř ž ý á í é estão na fila dos números; os algarismos obtêm-se com Shift. Shift " +
      "nessas teclas dá o algarismo, nunca a maiúscula. " + CHECO_MAIUSCULAS + " ú e ů têm teclas próprias. " +
      "O Ů maiúsculo só funciona com o Caps Lock.",
  },
  "cs-qwerty": {
    label: "Checa (QWERTY)",
    kurz: "teclado checo QWERTY",
    hinweis:
      "O teclado checo QWERTY tem o y e o z onde os tem o teclado inglês; de resto, é o teclado checo: ě š č ř " +
      "ž ý á í é estão na fila dos números, os algarismos obtêm-se com Shift, e Shift nessas teclas nunca dá a " +
      "maiúscula. " + CHECO_MAIUSCULAS + " O Ů maiúsculo só funciona com o Caps Lock.",
  },
  bg: {
    label: "Búlgara (BDS)",
    kurz: "teclado búlgaro",
    hinweis:
      "No teclado búlgaro BDS, a fila de base é ь я а о ж г т н в м ч. A vírgula fica na tecla onde o teclado " +
      "inglês tem o Q, o ponto final na ponta direita da fila dos números; os algarismos não precisam de Shift. " +
      "O ѝ fica à esquerda do ю (com Shift: Ѝ) e também é Shift + ь. O Ь maiúsculo só se obtém com o Caps Lock.",
  },
  "bg-schreibm": {
    label: "Búlgara (máquina de escrever)",
    kurz: "teclado búlgaro de máquina de escrever",
    hinweis:
      "O teclado búlgaro de máquina de escrever tem as letras do teclado BDS (fila de base ь я а о ж г т н в м), " +
      "a vírgula na tecla Q e o ponto final na ponta direita da fila dos números. Não tem ѝ, nem símbolo do " +
      "euro, nem aspas búlgaras: as linhas com eles não são propostas.",
  },
  "bg-phon": {
    label: "Búlgara (fonética)",
    kurz: "teclado búlgaro fonético",
    hinweis:
      "No teclado búlgaro fonético, as letras ficam onde estão os seus sons latinos: а no A, с no S, д no D, ф " +
      "no F e assim por diante; ч fica no Q, ш no W, я e щ à direita do п. A vírgula, o ponto final e os outros " +
      "sinais de pontuação estão onde estão no teclado inglês. O Ь maiúsculo só se obtém com o Caps Lock.",
  },
  "bg-phon-trad": {
    label: "Búlgara (fonética, tradicional)",
    kurz: "teclado búlgaro fonético tradicional",
    hinweis:
      "O teclado búlgaro fonético tradicional tem a fila de base а с д ф г х й к л, como o fonético mais " +
      "recente, mas я fica no Q, в no W, ч à esquerda do 1 e ь no X (com Shift: ѝ). Não tem travessão nem " +
      "aspas búlgaras: as linhas com eles não são propostas. O Ь maiúsculo só se obtém com o Caps Lock.",
  },
  el: {
    label: "Grega",
    kurz: "teclado grego",
    hinweis:
      "No teclado grego, as letras ficam onde estão os seus sons latinos: α no A, β no B e assim por diante. O " +
      "sigma final ς fica no W, o ponto de interrogação ; no Q. O tonos ΄ é uma tecla de acento à direita do λ: " +
      "primeiro o tonos, depois a vogal (ά). Com Shift, a mesma tecla dá o dialytika ¨ (ϊ). Para uma maiúscula " +
      "com tonos: tonos, depois Shift e a vogal (Ά).",
  },
  "el-220": {
    label: "Grega (220)",
    kurz: "teclado grego 220",
    hinweis:
      "O teclado grego 220 tem as letras do teclado grego (α no A, ς no W) e a tecla de acento do tonos ΄ à " +
      "direita do λ. O dialytika ¨ tem a sua própria tecla de acento, à direita dessa; o apóstrofo fica à " +
      "direita do 0, o hífen em baixo à direita, o ponto de interrogação ; no Q.",
  },
  "el-319": {
    label: "Grega (319)",
    kurz: "teclado grego 319",
    hinweis:
      "O teclado grego 319 tem as letras do teclado grego (α no A, ς no W) e a tecla de acento do tonos ΄ à " +
      "direita do λ. A ano teleia · fica no Q, o ponto de interrogação ; é Shift + vírgula, o apóstrofo " +
      "tipográfico ’ fica à direita da tecla do tonos. Não tem @, #, &, chavetas nem parênteses angulares.",
  },
  hu: {
    label: "Húngara (QWERTZ)",
    kurz: "teclado húngaro",
    hinweis:
      "No teclado húngaro, o 0 fica à esquerda do 1; onde costuma estar o 0, está o ö, depois o ü e o ó. ő e ú " +
      "ficam à direita do p, é á ű à direita do l, í à esquerda do y. Cada letra acentuada tem a sua própria " +
      "tecla, com Shift a sua maiúscula. ; @ € e os parênteses retos obtêm-se com Alt Gr.",
  },
  "hu-101": {
    label: "Húngara (QWERTY, 101 teclas)",
    kurz: "teclado húngaro QWERTY",
    hinweis:
      "O teclado húngaro de 101 teclas tem o y e o z como o teclado inglês. O í fica à esquerda do 1, o 0 é " +
      "Alt Gr + essa tecla; onde costuma estar o 0, está o ö. ő e ú ficam à direita do p, ű por cima do Enter, " +
      "é e á à direita do l.",
  },
  "nl-intl": {
    label: "Neerlandesa (Estados Unidos - Internacional)",
    kurz: "teclado internacional dos Estados Unidos",
    hinweis:
      "No teclado internacional dos Estados Unidos, ' e \" (a tecla à direita do ;) são teclas de acento: para " +
      "o próprio sinal, prime-se a barra de espaço a seguir. ë é \" e depois e, ï é \" e depois i. é é " +
      "Alt Gr + E (ou ' e depois e), o símbolo do euro Alt Gr + 5.",
  },
  "nl-dutch": {
    label: "Neerlandesa (Países Baixos)",
    kurz: "teclado neerlandês",
    hinweis:
      "No teclado neerlandês, o @ fica à esquerda do 1, o ' é Shift + 0 e o \" é Shift + 2. ë e ï obtêm-se com " +
      "a tecla de acento ¨ à direita do p, é com a tecla de acento ´ à direita do +: primeiro a tecla de acento, " +
      "depois a letra.",
  },
  // Glossar §2.9: der Hinweis nennt die Merkmale (ç rechts von l, « » neben dem Apostroph).
  pt: {
    label: "Portuguesa (Portugal)",
    kurz: "teclado português",
    hinweis:
      "No teclado português, o ç tem uma tecla própria à direita do l. O acento agudo ´ é uma tecla de acento à " +
      "direita do + (com Shift, o acento grave `), o til ~ uma tecla de acento à direita do º (com Shift, o " +
      "acento circunflexo ^): primeiro a tecla de acento, depois a vogal (á, ã, ê). As aspas angulares têm uma " +
      "tecla própria à direita do apóstrofo.",
  },
  "br-abnt2": {
    label: "Brasileira (ABNT2)",
    kurz: "teclado brasileiro",
    hinweis:
      "No teclado brasileiro ABNT2, o ç tem uma tecla própria à direita do l. O acento agudo ´ é uma tecla de " +
      "acento à direita do p (com Shift, o acento grave `), o til ~ uma tecla de acento à direita do ç (com " +
      "Shift, o acento circunflexo ^). Shift + 6 é a tecla de acento ¨, não um sinal. O ' fica à esquerda do 1 " +
      "(com Shift, \"), o ; em baixo à direita. / e ? estão na tecla extra à direita do ; ou em Alt Gr + Q e " +
      "Alt Gr + W.",
  },
  ro: {
    label: "Romena (padrão)",
    kurz: "teclado romeno",
    hinweis:
      "No teclado romeno padrão, ă e î ficam à direita do p, â por cima do Enter, ș e ț à direita do l - ș e ț " +
      "com vírgula por baixo, como deve ser. As aspas „ e ” ficam à esquerda do 1 (” com Shift). O apóstrofo é " +
      "Alt Gr + ț, o símbolo do euro Alt Gr + E.",
  },
  "ro-prog": {
    label: "Romena (programadores, QWERTY)",
    kurz: "teclado romeno de programadores",
    hinweis:
      "No teclado romeno de programadores, as letras romenas escrevem-se com a tecla Alt Gr e a letra base: " +
      "ă = a, â = q, î = i, ș = s, ț = t; para a maiúscula, junta-se Shift. De resto, é o teclado inglês " +
      "(Estados Unidos).",
  },
  sv: {
    label: "Sueca (Suécia, Finlândia)",
    kurz: "teclado sueco",
    hinweis:
      "No teclado sueco, o å fica à direita do p, o ö e o ä à direita do l - cada um tem a sua própria tecla, " +
      "com Shift a sua maiúscula. O é obtém-se com a tecla de acento ´ (à direita do +), depois o e. O @ é " +
      "Alt Gr + 2, o € Alt Gr + E. O teclado finlandês é igual.",
  },
  ua: {
    label: "Ucraniana (alargada)",
    kurz: "teclado ucraniano",
    hinweis:
      "No teclado ucraniano, a fila de base é ф і в а п р о л д ж є. O apóstrofo ' fica à esquerda do 1 (com " +
      "Shift, o símbolo da hryvnia ₴). O ponto final fica em baixo à direita, a vírgula é Shift + a mesma " +
      "tecla. O ґ fica à esquerda do я, ou em Alt Gr + г.",
  },
  "ua-std": {
    label: "Ucraniana (padrão)",
    kurz: "teclado ucraniano padrão",
    hinweis:
      "O teclado ucraniano padrão é o teclado ucraniano sem o apóstrofo: à esquerda do 1 está o ё russo. As " +
      "palavras com apóstrofo não são propostas - o teclado ucraniano alargado tem-no.",
  },
};
