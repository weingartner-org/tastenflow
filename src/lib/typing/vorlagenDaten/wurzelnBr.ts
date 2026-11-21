/**
 * ★ G3c-VERTEILER (25.10.2026): DIE WURZEL-VORLAGE DES WEGES „br" (Portugiesisch (Brasilien)) - woher die Wörter kommen, zum Abschreiben. Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `radiciIt.ts` (mit `beleg`) und `korenyCs.ts`: drei Altersstufen, Themen mit Paaren `<Hinweis> - <Wort>`. Die Feldnamen sind
 * die von `radiciIt.ts` (`indizio`, `parola`, `origine`, `beleg`) - genau die Schlüssel der Quelle, iCloud
 * `sprachen-2026-10-25/tf-fest-neu/pt-BR/tf-fest-pt-BR.json`: `wurzeln` (`{ kids, teens, erwachsen }`) und `wurzelKategorien` (die Themen).
 * `raetsel` dort ist KEINE Wurzel-Zeile (Rezept D „Befund raetsel") und gehört nicht hierher.
 *
 * Zeilenregeln (Wächter: `tests/tastenflow-lerndaten-br.test.ts`, Vorbild `tastenflow-vorlage-koreny-cs`): höchstens 40 Zeichen,
 * genau ein ` - `, `parola` ein Einzelwort, klein, nicht im Hinweis; kein Wort doppelt; keine Sperrwörter (`sperrlisteBr.ts`); nur Zeichen
 * aller Tastaturen des Weges. Mengen: der Wächter misst die eigene Grösse (cs/it verlangen 80 je Stufe, die neuen Daten haben weniger).
 *
 * ★ D-LERNDATEN (25.10.2026): gefüllt aus `tf-fest-pt-BR.json` (`wurzeln`, `wurzelKategorien`), geprüft im `PRUEFBERICHT.md`
 * desselben Ordners. Paare je Stufe: Kinder 80, Jugend 80, Erwachsene 78 (Ziel wie cs/it: 80 - der
 * Wächter führt die gelieferte Menge als benannte Mindestzahl). Die Themen-Namen auf Deutsch und Englisch (`titelJe`) sind in
 * D-LERNDATEN übersetzt (die übrigen Bedienungen lesen das Englische). `raetsel` (240 Zeilen) ist NICHT eingehängt - es hat im
 * Code keinen Platz (Rezept D, Erkenntnis 3; Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * Wächter: `tests/tastenflow-lerndaten-br.test.ts`.
 *
 * Verteiler: `vorlagen.ts` (`GERUEST_WURZELN`, Art `"wortherkunft"`; Gruppe in `EigenerTextQuelle.tsx`). Solange {@link WURZEL_THEMEN_BR}
 * leer ist, gibt es KEINE Vorlage (weder „Eigene Übung" noch Tippchallenge); mit dem ersten Thema erscheint sie für Weg UND Übungssprache „br".
 *
 * ⚠️ DATENBLATT: nur `import type`, kein Code-Import.
 */

export type WurzelStufeBr = "kids" | "teens" | "erwachsen";

/** Woher ein Wort kommt - GESCHLOSSENE Liste (gemessen in `tf-fest-pt-BR.json`, 25.10.2026); nur für die Lehrkraft, wird nicht abgetippt. */
export type WurzelOrigineBr = "francês" | "grego" | "inglês" | "iorubá" | "italiano" | "latim" | "língua da Guiné" | "mandinga" | "quicongo" | "quimbundo" | "quimbundo e iorubá" | "tupi" | "árabe";

export interface WurzelPaarBr {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  indizio: string;
  /** Das Wort selbst - ein Einzelwort, klein. */
  parola: string;
  origine: WurzelOrigineBr;
  /** Wo die Herkunft nachgelesen wurde (Quelle aus `tf-fest`, z. B. eine Wiktionary-Seite). */
  beleg: string;
}

export interface WurzelThemaBr {
  id: string;
  titel: string;
  paare: WurzelPaarBr[];
}

/** Die Themen (aus `wurzelKategorien`): `titel` in Portugiesisch (Brasilien), `titelJe` der Name in den Bedienungssprachen (fehlt einer: englisch, sonst `titel`). */
export const WURZEL_THEMEN_BR: readonly { id: string; titel: string; titelJe?: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> }[] = [
  { id: "grego-latim", titel: "Raízes gregas e latinas", titelJe: { de: "Griechische und lateinische Wurzeln", en: "Greek and Latin roots" } },
  { id: "tupi", titel: "Palavras que vêm do tupi", titelJe: { de: "Wörter aus dem Tupi", en: "Words from Tupi" } },
  { id: "africa", titel: "Palavras que vêm de línguas africanas", titelJe: { de: "Wörter aus afrikanischen Sprachen", en: "Words from African languages" } },
  { id: "arabe", titel: "Palavras que vêm do árabe", titelJe: { de: "Wörter aus dem Arabischen", en: "Words from Arabic" } },
  { id: "europa", titel: "Palavras de outras línguas da Europa", titelJe: { de: "Wörter aus anderen Sprachen Europas", en: "Words from other European languages" } },
];

/** Die Paare je Stufe und Thema. */
export const WURZELN_BR: Record<WurzelStufeBr, WurzelThemaBr[]> = {
  kids: [
    {
      id: "grego-latim",
      titel: "Raízes gregas e latinas",
      paare: [
        { indizio: "fala com quem está longe", parola: "telefone", origine: "grego", beleg: "https://en.wiktionary.org/wiki/telefone#Portuguese" },
        { indizio: "réptil gigante de antigamente", parola: "dinossauro", origine: "grego", beleg: "https://en.wiktionary.org/wiki/dinossauro#Portuguese" },
        { indizio: "cavalo do rio, na África", parola: "hipopótamo", origine: "grego", beleg: "https://en.wiktionary.org/wiki/hipopótamo#Portuguese" },
        { indizio: "animal com chifre no nariz", parola: "rinoceronte", origine: "grego", beleg: "https://en.wiktionary.org/wiki/rinoceronte#Portuguese" },
        { indizio: "mede a febre", parola: "termômetro", origine: "grego", beleg: "https://en.wiktionary.org/wiki/termômetro#Portuguese" },
        { indizio: "imagem feita com a câmera", parola: "fotografia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/fotografia#Portuguese" },
        { indizio: "voa com hélices em cima", parola: "helicóptero", origine: "grego", beleg: "https://en.wiktionary.org/wiki/helicóptero#Portuguese" },
        { indizio: "forma dos favos das abelhas", parola: "hexágono", origine: "grego", beleg: "https://en.wiktionary.org/wiki/hexágono#Portuguese" },
        { indizio: "figura de cinco lados", parola: "pentágono", origine: "grego", beleg: "https://en.wiktionary.org/wiki/pentágono#Portuguese" },
        { indizio: "estuda rios, montanhas e países", parola: "geografia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/geografia#Portuguese" },
        { indizio: "muitos livros para emprestar", parola: "biblioteca", origine: "grego", beleg: "https://en.wiktionary.org/wiki/biblioteca#Portuguese" },
        { indizio: "viaja para o espaço", parola: "astronauta", origine: "grego", beleg: "https://en.wiktionary.org/wiki/astronauta#Portuguese" },
        { indizio: "todas as letras em ordem", parola: "alfabeto", origine: "grego", beleg: "https://en.wiktionary.org/wiki/alfabeto#Portuguese" },
        { indizio: "mar enorme entre continentes", parola: "oceano", origine: "grego", beleg: "https://en.wiktionary.org/wiki/oceano#Portuguese" },
        { indizio: "figura de três ângulos", parola: "triângulo", origine: "latim", beleg: "https://en.wiktionary.org/wiki/triângulo#Portuguese" },
        { indizio: "figura de quatro lados iguais", parola: "quadrado", origine: "latim", beleg: "https://en.wiktionary.org/wiki/quadrado#Portuguese" },
        { indizio: "animal que se alimenta de carne", parola: "carnívoro", origine: "latim", beleg: "https://en.wiktionary.org/wiki/carnívoro#Portuguese" },
        { indizio: "animal que se alimenta de plantas", parola: "herbívoro", origine: "latim", beleg: "https://en.wiktionary.org/wiki/herbívoro#Portuguese" },
        { indizio: "bebe leite da mãe quando filhote", parola: "mamífero", origine: "latim", beleg: "https://en.wiktionary.org/wiki/mamífero#Portuguese" },
        { indizio: "casa de vidro dos peixes", parola: "aquário", origine: "latim", beleg: "https://en.wiktionary.org/wiki/aquário#Portuguese" },
      ],
    },
    {
      id: "tupi",
      titel: "Palavras que vêm do tupi",
      paare: [
        { indizio: "maior roedor do mundo", parola: "capivara", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/capivara#Portuguese" },
        { indizio: "fruta com a castanha do lado de fora", parola: "caju", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/caju#Portuguese" },
        { indizio: "tartaruga que vive em terra", parola: "jabuti", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/jabuti#Portuguese" },
        { indizio: "fruta do suco que acalma", parola: "maracujá", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/maracujá#Portuguese" },
        { indizio: "raiz da tapioca", parola: "mandioca", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/mandioca#Portuguese" },
        { indizio: "bicho de casca dura que cava buracos", parola: "tatu", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/tatu#Portuguese" },
        { indizio: "réptil dos rios do Pantanal", parola: "jacaré", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/jacaré#Portuguese" },
        { indizio: "ave colorida de cauda longa", parola: "arara", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/arara#Portuguese" },
        { indizio: "bicho de língua comprida que pega formigas", parola: "tamanduá", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/tamanduá#Portuguese" },
        { indizio: "ave de bico enorme", parola: "tucano", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/tucano#Portuguese" },
        { indizio: "papa quente de milho ou aveia", parola: "mingau", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/mingau#Portuguese" },
        { indizio: "ave que canta, símbolo do Brasil", parola: "sabiá", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/sabiá#Portuguese" },
        { indizio: "brinquedo de penas jogado com a mão", parola: "peteca", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/peteca#Portuguese" },
        { indizio: "macaquinho de tufos nas orelhas", parola: "sagui", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/sagui#Portuguese" },
        { indizio: "frutinha vermelha e azedinha", parola: "pitanga", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/pitanga#Portuguese" },
      ],
    },
    {
      id: "africa",
      titel: "Palavras que vêm de línguas africanas",
      paare: [
        { indizio: "o filho mais novo", parola: "caçula", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/caçula#Portuguese" },
        { indizio: "carinho com os dedos no cabelo", parola: "cafuné", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/cafuné#Portuguese" },
        { indizio: "menino levado", parola: "moleque", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/moleque#Portuguese" },
        { indizio: "lojinha de frutas e verduras", parola: "quitanda", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/quitanda#Portuguese" },
        { indizio: "farinha de milho do angu", parola: "fubá", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/fubá#Portuguese" },
        { indizio: "dormir um pouquinho", parola: "cochilar", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/cochilar#Portuguese" },
        { indizio: "óleo de palmeira do acarajé", parola: "dendê", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/dendê#Portuguese" },
        { indizio: "vespa que faz casa de papel", parola: "marimbondo", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/marimbondo#Portuguese" },
        { indizio: "legume verde e amargo", parola: "jiló", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/jiló#Portuguese" },
        { indizio: "ensopado de peixe com coco", parola: "moqueca", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/moqueca#Portuguese" },
        { indizio: "ratinho pequeno da casa", parola: "camundongo", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/camundongo#Portuguese" },
        { indizio: "bolinho baiano de feijão", parola: "acarajé", origine: "iorubá", beleg: "https://en.wiktionary.org/wiki/acarajé#Portuguese" },
        { indizio: "fruta amarela que se descasca", parola: "banana", origine: "língua da Guiné", beleg: "https://en.wiktionary.org/wiki/banana#Portuguese" },
        { indizio: "docinho amarelo de coco e gema", parola: "quindim", origine: "quicongo", beleg: "https://en.wiktionary.org/wiki/quindim#Portuguese" },
        { indizio: "lagartinho que corre no sol", parola: "calango", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/calango#Portuguese" },
      ],
    },
    {
      id: "arabe",
      titel: "Palavras que vêm do árabe",
      paare: [
        { indizio: "grão branco do prato de todo dia", parola: "arroz", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/arroz#Portuguese" },
        { indizio: "óleo de oliva", parola: "azeite", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/azeite#Portuguese" },
        { indizio: "folha verde da salada", parola: "alface", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alface#Portuguese" },
        { indizio: "travesseiro do sofá", parola: "almofada", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/almofada#Portuguese" },
        { indizio: "fruta do suco do café da manhã", parola: "laranja", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/laranja#Portuguese" },
        { indizio: "planta branca que vira tecido", parola: "algodão", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/algodão#Portuguese" },
        { indizio: "fruta verde e azeda", parola: "limão", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/limão#Portuguese" },
        { indizio: "vidro para guardar bebida", parola: "garrafa", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/garrafa#Portuguese" },
        { indizio: "porco selvagem", parola: "javali", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/javali#Portuguese" },
        { indizio: "jogo de reis, torres e cavalos", parola: "xadrez", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/xadrez#Portuguese" },
        { indizio: "raiz laranja do bolo", parola: "cenoura", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/cenoura#Portuguese" },
        { indizio: "cor do céu limpo", parola: "azul", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/azul#Portuguese" },
        { indizio: "bolinha de carne moída", parola: "almôndega", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/almôndega#Portuguese" },
        { indizio: "ladrilho pintado na parede", parola: "azulejo", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/azulejo#Portuguese" },
        { indizio: "remédio doce para a tosse", parola: "xarope", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/xarope#Portuguese" },
      ],
    },
    {
      id: "europa",
      titel: "Palavras de outras línguas da Europa",
      paare: [
        { indizio: "jogo de bola com os pés", parola: "futebol", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/futebol#Portuguese" },
        { indizio: "pão com recheio", parola: "sanduíche", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/sanduíche#Portuguese" },
        { indizio: "a bola entrou na rede", parola: "gol", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/gol#Portuguese" },
        { indizio: "refeição rápida da tarde", parola: "lanche", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/lanche#Portuguese" },
        { indizio: "fatia de carne grelhada", parola: "bife", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/bife#Portuguese" },
        { indizio: "refeição ao ar livre", parola: "piquenique", origine: "francês", beleg: "https://en.wiktionary.org/wiki/piquenique#Portuguese" },
        { indizio: "dança na ponta dos pés", parola: "balé", origine: "francês", beleg: "https://en.wiktionary.org/wiki/balé#Portuguese" },
        { indizio: "chapéu com aba na frente", parola: "boné", origine: "francês", beleg: "https://en.wiktionary.org/wiki/boné#Portuguese" },
        { indizio: "roupa de banho inteira", parola: "maiô", origine: "francês", beleg: "https://en.wiktionary.org/wiki/maiô#Portuguese" },
        { indizio: "cavalinhos que giram no parque", parola: "carrossel", origine: "francês", beleg: "https://en.wiktionary.org/wiki/carrossel#Portuguese" },
        { indizio: "jeito de se despedir", parola: "tchau", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/tchau#Portuguese" },
        { indizio: "massa comprida ou em tubinhos", parola: "macarrão", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/macarrão#Portuguese" },
        { indizio: "massa redonda assada no forno", parola: "pizza", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/pizza#Portuguese" },
        { indizio: "artista de nariz vermelho", parola: "palhaço", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/palhaço#Portuguese" },
        { indizio: "instrumento de teclas pretas e brancas", parola: "piano", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/piano#Portuguese" },
      ],
    },
  ],
  teens: [
    {
      id: "grego-latim",
      titel: "Raízes gregas e latinas",
      paare: [
        { indizio: "as plantas usam a luz", parola: "fotossíntese", origine: "grego", beleg: "https://en.wiktionary.org/wiki/fotossíntese#Portuguese" },
        { indizio: "ciência do meio ambiente", parola: "ecologia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/ecologia#Portuguese" },
        { indizio: "o poder vem do povo", parola: "democracia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/democracia#Portuguese" },
        { indizio: "conhecimento das técnicas e máquinas", parola: "tecnologia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/tecnologia#Portuguese" },
        { indizio: "estuda os fósseis", parola: "paleontologia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/paleontologia#Portuguese" },
        { indizio: "fala de uma pessoa só no palco", parola: "monólogo", origine: "grego", beleg: "https://en.wiktionary.org/wiki/monólogo#Portuguese" },
        { indizio: "palavra de sentido contrário", parola: "antônimo", origine: "grego", beleg: "https://en.wiktionary.org/wiki/antônimo#Portuguese" },
        { indizio: "conversa entre duas pessoas", parola: "diálogo", origine: "grego", beleg: "https://en.wiktionary.org/wiki/diálogo#Portuguese" },
        { indizio: "assinatura de alguém famoso", parola: "autógrafo", origine: "grego", beleg: "https://en.wiktionary.org/wiki/autógrafo#Portuguese" },
        { indizio: "camada de ar em volta da Terra", parola: "atmosfera", origine: "grego", beleg: "https://en.wiktionary.org/wiki/atmosfera#Portuguese" },
        { indizio: "doença que se espalha muito", parola: "epidemia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/epidemia#Portuguese" },
        { indizio: "figura de muitos lados", parola: "polígono", origine: "grego", beleg: "https://en.wiktionary.org/wiki/polígono#Portuguese" },
        { indizio: "quem pratica esporte", parola: "atleta", origine: "grego", beleg: "https://en.wiktionary.org/wiki/atleta#Portuguese" },
        { indizio: "escrita correta das palavras", parola: "ortografia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/ortografia#Portuguese" },
        { indizio: "lugar onde se assiste a peças", parola: "teatro", origine: "grego", beleg: "https://en.wiktionary.org/wiki/teatro#Portuguese" },
        { indizio: "cultivo da terra", parola: "agricultura", origine: "latim", beleg: "https://en.wiktionary.org/wiki/agricultura#Portuguese" },
        { indizio: "que vive na água", parola: "aquático", origine: "latim", beleg: "https://en.wiktionary.org/wiki/aquático#Portuguese" },
        { indizio: "que se alimenta de frutas", parola: "frugívoro", origine: "latim", beleg: "https://en.wiktionary.org/wiki/frugívoro#Portuguese" },
        { indizio: "com o voto de todos", parola: "unânime", origine: "latim", beleg: "https://en.wiktionary.org/wiki/unânime#Portuguese" },
        { indizio: "uma vantagem, um bem", parola: "benefício", origine: "latim", beleg: "https://en.wiktionary.org/wiki/benefício#Portuguese" },
      ],
    },
    {
      id: "tupi",
      titel: "Palavras que vêm do tupi",
      paare: [
        { indizio: "onda forte do rio contra o mar", parola: "pororoca", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/pororoca#Portuguese" },
        { indizio: "caminho de canoa na floresta", parola: "igarapé", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/igarapé#Portuguese" },
        { indizio: "mata seca do sertão", parola: "caatinga", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/caatinga#Portuguese" },
        { indizio: "subida dos peixes para desovar", parola: "piracema", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/piracema#Portuguese" },
        { indizio: "cobra grande que aperta a presa", parola: "jiboia", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/jiboia#Portuguese" },
        { indizio: "serpente enorme da água", parola: "sucuri", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/sucuri#Portuguese" },
        { indizio: "inseto que destrói a madeira", parola: "cupim", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/cupim#Portuguese" },
        { indizio: "formiga que corta folhas", parola: "saúva", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/saúva#Portuguese" },
        { indizio: "fruta preta que nasce no tronco", parola: "jabuticaba", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/jabuticaba#Portuguese" },
        { indizio: "palmeira das veredas", parola: "buriti", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/buriti#Portuguese" },
        { indizio: "quem nasce na cidade do Rio", parola: "carioca", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/carioca#Portuguese" },
        { indizio: "mato que o boi pasta", parola: "capim", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/capim#Portuguese" },
        { indizio: "goma de mandioca feita na frigideira", parola: "tapioca", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/tapioca#Portuguese" },
        { indizio: "árvore de flores amarelas ou roxas", parola: "ipê", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/ipê#Portuguese" },
        { indizio: "cacto alto da caatinga", parola: "mandacaru", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/mandacaru#Portuguese" },
      ],
    },
    {
      id: "africa",
      titel: "Palavras que vêm de línguas africanas",
      paare: [
        { indizio: "comunidade de quem fugia da escravidão", parola: "quilombo", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/quilombo#Portuguese" },
        { indizio: "moradia dos escravizados nas fazendas", parola: "senzala", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/senzala#Portuguese" },
        { indizio: "morto-vivo dos filmes de terror", parola: "zumbi", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/zumbi#Portuguese" },
        { indizio: "falar palavrão contra alguém", parola: "xingar", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/xingar#Portuguese" },
        { indizio: "legume verde com espinhos moles", parola: "maxixe", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/maxixe#Portuguese" },
        { indizio: "selo de tinta em documentos", parola: "carimbo", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/carimbo#Portuguese" },
        { indizio: "instrumento de teclas de madeira", parola: "marimba", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/marimba#Portuguese" },
        { indizio: "poço cavado para pegar água", parola: "cacimba", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/cacimba#Portuguese" },
        { indizio: "grande recipiente de caminhão para entulho", parola: "caçamba", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/caçamba#Portuguese" },
        { indizio: "calção de banho", parola: "sunga", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/sunga#Portuguese" },
        { indizio: "chocalho cilíndrico de percussão", parola: "ganzá", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/ganzá#Portuguese" },
        { indizio: "sino duplo de metal", parola: "agogô", origine: "iorubá", beleg: "https://en.wiktionary.org/wiki/agogô#Portuguese" },
        { indizio: "bolinho de feijão cozido na folha", parola: "abará", origine: "iorubá", beleg: "https://en.wiktionary.org/wiki/abará#Portuguese" },
        { indizio: "creme baiano com camarão e amendoim", parola: "vatapá", origine: "iorubá", beleg: "https://en.wiktionary.org/wiki/vatapá#Portuguese" },
        { indizio: "papa de fubá cozido", parola: "angu", origine: "iorubá", beleg: "https://en.wiktionary.org/wiki/angu#Portuguese" },
      ],
    },
    {
      id: "arabe",
      titel: "Palavras que vêm do árabe",
      paare: [
        { indizio: "loja de carnes", parola: "açougue", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/açougue#Portuguese" },
        { indizio: "depósito de mercadorias", parola: "armazém", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/armazém#Portuguese" },
        { indizio: "matemática com letras", parola: "álgebra", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/álgebra#Portuguese" },
        { indizio: "pequeno povoado", parola: "aldeia", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/aldeia#Portuguese" },
        { indizio: "erva de cheiro do tempero", parola: "alecrim", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alecrim#Portuguese" },
        { indizio: "flor verde servida cozida", parola: "alcachofra", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alcachofra#Portuguese" },
        { indizio: "represa para guardar água no sertão", parola: "açude", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/açude#Portuguese" },
        { indizio: "ferramenta que corta arame", parola: "alicate", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alicate#Portuguese" },
        { indizio: "argola que prende os pulsos", parola: "algema", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/algema#Portuguese" },
        { indizio: "grupo de lobos", parola: "alcateia", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alcateia#Portuguese" },
        { indizio: "rochedo no mar perto da praia", parola: "recife", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/recife#Portuguese" },
        { indizio: "livro com o calendário do ano", parola: "almanaque", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/almanaque#Portuguese" },
        { indizio: "quem faz roupa sob medida", parola: "alfaiate", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alfaiate#Portuguese" },
        { indizio: "planta roxa de cheiro suave", parola: "alfazema", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alfazema#Portuguese" },
        { indizio: "colheita do ano", parola: "safra", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/safra#Portuguese" },
      ],
    },
    {
      id: "europa",
      titel: "Palavras de outras línguas da Europa",
      paare: [
        { indizio: "equipe de jogadores", parola: "time", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/time#Portuguese" },
        { indizio: "prática de atividade física", parola: "esporte", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/esporte#Portuguese" },
        { indizio: "vagões puxados nos trilhos", parola: "trem", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/trem#Portuguese" },
        { indizio: "quem viaja para conhecer lugares", parola: "turista", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/turista#Portuguese" },
        { indizio: "passagem por baixo da montanha", parola: "túnel", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/túnel#Portuguese" },
        { indizio: "veículo elétrico sobre trilhos na cidade", parola: "bonde", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/bonde#Portuguese" },
        { indizio: "sabão líquido para o cabelo", parola: "xampu", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/xampu#Portuguese" },
        { indizio: "cobrança de falta na área", parola: "pênalti", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/pênalti#Portuguese" },
        { indizio: "quem serve no restaurante", parola: "garçom", origine: "francês", beleg: "https://en.wiktionary.org/wiki/garçom#Portuguese" },
        { indizio: "luminária de mesa", parola: "abajur", origine: "francês", beleg: "https://en.wiktionary.org/wiki/abajur#Portuguese" },
        { indizio: "trabalho de agulha com gancho", parola: "crochê", origine: "francês", beleg: "https://en.wiktionary.org/wiki/crochê#Portuguese" },
        { indizio: "salgadinho frito e alongado", parola: "croquete", origine: "francês", beleg: "https://en.wiktionary.org/wiki/croquete#Portuguese" },
        { indizio: "doce gelado de fruta", parola: "sorvete", origine: "francês", beleg: "https://en.wiktionary.org/wiki/sorvete#Portuguese" },
        { indizio: "instrumento de corda tocado com arco", parola: "violino", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/violino#Portuguese" },
        { indizio: "bolinhas de massa de batata", parola: "nhoque", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/nhoque#Portuguese" },
      ],
    },
  ],
  erwachsen: [
    {
      id: "grego-latim",
      titel: "Raízes gregas e latinas",
      paare: [
        { indizio: "amor pela sabedoria", parola: "filosofia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/filosofia#Portuguese" },
        { indizio: "amor ao gênero humano", parola: "filantropia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/filantropia#Portuguese" },
        { indizio: "estudo do ser humano e das culturas", parola: "antropologia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/antropologia#Portuguese" },
        { indizio: "governo de poucos", parola: "oligarquia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/oligarquia#Portuguese" },
        { indizio: "governo de um monarca", parola: "monarquia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/monarquia#Portuguese" },
        { indizio: "mudança de forma", parola: "metamorfose", origine: "grego", beleg: "https://en.wiktionary.org/wiki/metamorfose#Portuguese" },
        { indizio: "ideia que ainda precisa ser testada", parola: "hipótese", origine: "grego", beleg: "https://en.wiktionary.org/wiki/hipótese#Portuguese" },
        { indizio: "origem das palavras", parola: "etimologia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/etimologia#Portuguese" },
        { indizio: "cidadão do mundo", parola: "cosmopolita", origine: "grego", beleg: "https://en.wiktionary.org/wiki/cosmopolita#Portuguese" },
        { indizio: "estudo da população", parola: "demografia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/demografia#Portuguese" },
        { indizio: "aversão a estrangeiros", parola: "xenofobia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/xenofobia#Portuguese" },
        { indizio: "coisa fora do seu tempo", parola: "anacronismo", origine: "grego", beleg: "https://en.wiktionary.org/wiki/anacronismo#Portuguese" },
        { indizio: "sangramento forte", parola: "hemorragia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/hemorragia#Portuguese" },
        { indizio: "estudo da mente", parola: "psicologia", origine: "grego", beleg: "https://en.wiktionary.org/wiki/psicologia#Portuguese" },
        { indizio: "que quer o bem", parola: "benévolo", origine: "latim", beleg: "https://en.wiktionary.org/wiki/benévolo#Portuguese" },
        { indizio: "de alma grande e generosa", parola: "magnânimo", origine: "latim", beleg: "https://en.wiktionary.org/wiki/magnânimo#Portuguese" },
        { indizio: "deixar sempre para depois", parola: "procrastinar", origine: "latim", beleg: "https://en.wiktionary.org/wiki/procrastinar#Portuguese" },
        { indizio: "que está em toda parte", parola: "ubíquo", origine: "latim", beleg: "https://en.wiktionary.org/wiki/ubíquo#Portuguese" },
        { indizio: "vida longa", parola: "longevidade", origine: "latim", beleg: "https://en.wiktionary.org/wiki/longevidade#Portuguese" },
        { indizio: "à mesma distância de dois pontos", parola: "equidistante", origine: "latim", beleg: "https://en.wiktionary.org/wiki/equidistante#Portuguese" },
      ],
    },
    {
      id: "tupi",
      titel: "Palavras que vêm do tupi",
      paare: [
        { indizio: "quem tem o mesmo nome", parola: "xará", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/xará#Portuguese" },
        { indizio: "armadilha para pegar aves", parola: "arapuca", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/arapuca#Portuguese" },
        { indizio: "espera escondida para atacar", parola: "tocaia", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/tocaia#Portuguese" },
        { indizio: "casa velha e abandonada", parola: "tapera", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/tapera#Portuguese" },
        { indizio: "trabalho coletivo e solidário", parola: "mutirão", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/mutirão#Portuguese" },
        { indizio: "tocar alguém com o dedo", parola: "cutucar", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/cutucar#Portuguese" },
        { indizio: "estar sem dinheiro", parola: "pindaíba", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/pindaíba#Portuguese" },
        { indizio: "doença infantil com bolhas", parola: "catapora", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/catapora#Portuguese" },
        { indizio: "casinha pobre e escondida", parola: "biboca", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/biboca#Portuguese" },
        { indizio: "vasilha do chimarrão", parola: "cuia", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/cuia#Portuguese" },
        { indizio: "líder espiritual de uma aldeia", parola: "pajé", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/pajé#Portuguese" },
        { indizio: "pequena ferida na pele", parola: "pereba", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/pereba#Portuguese" },
        { indizio: "cortejo pernambucano com reis e rainhas", parola: "maracatu", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/maracatu#Portuguese" },
        { indizio: "ser protetor das matas no folclore", parola: "caipora", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/caipora#Portuguese" },
        { indizio: "árvore de flores lilases", parola: "jacarandá", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/jacarandá#Portuguese" },
      ],
    },
    {
      id: "africa",
      titel: "Palavras que vêm de línguas africanas",
      paare: [
        { indizio: "pessoa que domina um assunto", parola: "bamba", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/bamba#Portuguese" },
        { indizio: "mercadoria contrabandeada", parola: "muamba", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/muamba#Portuguese" },
        { indizio: "trapo, roupa velha", parola: "molambo", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/molambo#Portuguese" },
        { indizio: "estalo de desdém com a boca", parola: "muxoxo", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/muxoxo#Portuguese" },
        { indizio: "antipatia, implicância", parola: "quizila", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/quizila#Portuguese" },
        { indizio: "peça mínima de roupa", parola: "tanga", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/tanga#Portuguese" },
        { indizio: "cabana africana", parola: "cubata", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/cubata#Portuguese" },
        { indizio: "petisco caprichado, iguaria", parola: "quitute", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/quitute#Portuguese" },
        { indizio: "segurança particular de um chefe", parola: "capanga", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/capanga#Portuguese" },
        { indizio: "manha, carinho", parola: "dengo", origine: "quimbundo", beleg: "https://en.wiktionary.org/wiki/dengo#Portuguese" },
        { indizio: "religião de matriz africana da Bahia", parola: "candomblé", origine: "quimbundo e iorubá", beleg: "https://en.wiktionary.org/wiki/candomblé#Portuguese" },
        { indizio: "feitiço, encanto", parola: "mandinga", origine: "mandinga", beleg: "https://en.wiktionary.org/wiki/mandinga#Portuguese" },
        { indizio: "energia, força vital", parola: "axé", origine: "iorubá", beleg: "https://en.wiktionary.org/wiki/axé#Portuguese" },
        { indizio: "divindade da religião iorubá", parola: "orixá", origine: "iorubá", beleg: "https://en.wiktionary.org/wiki/orixá#Portuguese" },
      ],
    },
    {
      id: "arabe",
      titel: "Palavras que vêm do árabe",
      paare: [
        { indizio: "repartição das mercadorias que entram no país", parola: "alfândega", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alfândega#Portuguese" },
        { indizio: "tomara que aconteça", parola: "oxalá", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/oxalá#Portuguese" },
        { indizio: "pessoa qualquer, sem nome", parola: "fulano", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/fulano#Portuguese" },
        { indizio: "medida do ouro e das pedras", parola: "quilate", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/quilate#Portuguese" },
        { indizio: "aparelho de destilar", parola: "alambique", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alambique#Portuguese" },
        { indizio: "antiga medida de terra", parola: "alqueire", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alqueire#Portuguese" },
        { indizio: "licença da prefeitura", parola: "alvará", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alvará#Portuguese" },
        { indizio: "medida de peso do gado", parola: "arroba", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/arroba#Portuguese" },
        { indizio: "dor de cabeça forte", parola: "enxaqueca", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/enxaqueca#Portuguese" },
        { indizio: "quem não gosta de dividir", parola: "mesquinho", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/mesquinho#Portuguese" },
        { indizio: "ameaça ao rei no xadrez", parola: "xeque", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/xeque#Portuguese" },
        { indizio: "piche escuro do asfalto", parola: "alcatrão", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alcatrão#Portuguese" },
        { indizio: "cada sinal que escreve um número", parola: "algarismo", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/algarismo#Portuguese" },
        { indizio: "posto mais alto da Marinha", parola: "almirante", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/almirante#Portuguese" },
      ],
    },
    {
      id: "europa",
      titel: "Palavras de outras línguas da Europa",
      paare: [
        { indizio: "golpe que derruba o lutador", parola: "nocaute", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/nocaute#Portuguese" },
        { indizio: "falta de luz na cidade", parola: "blecaute", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/blecaute#Portuguese" },
        { indizio: "tensão e cansaço da vida corrida", parola: "estresse", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/estresse#Portuguese" },
        { indizio: "apagar um arquivo", parola: "deletar", origine: "inglês", beleg: "https://en.wiktionary.org/wiki/deletar#Portuguese" },
        { indizio: "motorista particular", parola: "chofer", origine: "francês", beleg: "https://en.wiktionary.org/wiki/chofer#Portuguese" },
        { indizio: "mesa de pratos para se servir", parola: "bufê", origine: "francês", beleg: "https://en.wiktionary.org/wiki/bufê#Portuguese" },
        { indizio: "repolho azedo fermentado", parola: "chucrute", origine: "francês", beleg: "https://en.wiktionary.org/wiki/chucrute#Portuguese" },
        { indizio: "dança a três tempos", parola: "valsa", origine: "francês", beleg: "https://en.wiktionary.org/wiki/valsa#Portuguese" },
        { indizio: "cerveja tirada na pressão", parola: "chope", origine: "francês", beleg: "https://en.wiktionary.org/wiki/chope#Portuguese" },
        { indizio: "teatro todo cantado", parola: "ópera", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/ópera#Portuguese" },
        { indizio: "pintura com tinta e água", parola: "aquarela", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/aquarela#Portuguese" },
        { indizio: "agulha que aponta o norte", parola: "bússola", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/bússola#Portuguese" },
        { indizio: "frente de um prédio", parola: "fachada", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/fachada#Portuguese" },
        { indizio: "poema de catorze versos", parola: "soneto", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/soneto#Portuguese" },
        { indizio: "regente da orquestra", parola: "maestro", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/maestro#Portuguese" },
      ],
    },
  ],
};

/** Der Name der Tippchallenge-Dateien je Bedienungssprache, mit `{i}` und `{n}` („Bulgarian word origins, alphabetical: file {i} of {n}"). */
export const WURZEL_CHALLENGE_TITEL_BR: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> = {
  de: "Herkunft brasilianisch-portugiesischer Wörter, alphabetisch: Datei {i} von {n}",
  en: "Brazilian Portuguese word origins, alphabetical: file {i} of {n}",
};

/** Die Zeile eines Paares: zuerst der Hinweis, dann das Wort. */
export function wurzelZeileBr(x: { indizio: string; parola: string }): string {
  return `${x.indizio} - ${x.parola}`;
}

/** Dieselben Wörter, alphabetisch nach dem Hinweis (Sortierung „pt-BR") - für die Tippchallenge, wie `KORENY_ABECEDNE`. */
export const WURZELN_BR_ALPHABETISCH: Record<WurzelStufeBr, string[]> = Object.fromEntries(
  (Object.keys(WURZELN_BR) as WurzelStufeBr[]).map((stufe) => [
    stufe,
    WURZELN_BR[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indizio.localeCompare(b.indizio, "pt-BR"))
      .map(wurzelZeileBr),
  ]),
) as Record<WurzelStufeBr, string[]>;
