/**
 * ★ G3c-VERTEILER (25.10.2026): DIE WURZEL-VORLAGE DES WEGES „pt" (Portugiesisch (Portugal)) - woher die Wörter kommen, zum Abschreiben. Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `radiciIt.ts` (mit `beleg`) und `korenyCs.ts`: drei Altersstufen, Themen mit Paaren `<Hinweis> - <Wort>`. Die Feldnamen sind
 * die von `radiciIt.ts` (`indizio`, `parola`, `origine`, `beleg`) - genau die Schlüssel der Quelle, iCloud
 * `sprachen-2026-10-25/tf-fest-neu/pt-PT/tf-fest-pt-PT.json`: `wurzeln` (`{ kids, teens, erwachsen }`) und `wurzelKategorien` (die Themen).
 * `raetsel` dort ist KEINE Wurzel-Zeile (Rezept D „Befund raetsel") und gehört nicht hierher.
 *
 * Zeilenregeln (Wächter: `tests/tastenflow-lerndaten-pt.test.ts`, Vorbild `tastenflow-vorlage-koreny-cs`): höchstens 40 Zeichen,
 * genau ein ` - `, `parola` ein Einzelwort, klein, nicht im Hinweis; kein Wort doppelt; keine Sperrwörter (`sperrlistePt.ts`); nur Zeichen
 * aller Tastaturen des Weges. Mengen: der Wächter misst die eigene Grösse (cs/it verlangen 80 je Stufe, die neuen Daten haben weniger).
 *
 * ★ D-LERNDATEN (25.10.2026): gefüllt aus `tf-fest-pt-PT.json` (`wurzeln`, `wurzelKategorien`), geprüft im `PRUEFBERICHT.md`
 * desselben Ordners. Paare je Stufe: Kinder 68, Jugend 59, Erwachsene 55 (Ziel wie cs/it: 80 - der
 * Wächter führt die gelieferte Menge als benannte Mindestzahl). Die Themen-Namen auf Deutsch und Englisch (`titelJe`) sind in
 * D-LERNDATEN übersetzt (die übrigen Bedienungen lesen das Englische). `raetsel` (240 Zeilen) ist NICHT eingehängt - es hat im
 * Code keinen Platz (Rezept D, Erkenntnis 3; Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * Wächter: `tests/tastenflow-lerndaten-pt.test.ts`.
 *
 * Verteiler: `vorlagen.ts` (`GERUEST_WURZELN`, Art `"wortherkunft"`; Gruppe in `EigenerTextQuelle.tsx`). Solange {@link WURZEL_THEMEN_PT}
 * leer ist, gibt es KEINE Vorlage (weder „Eigene Übung" noch Tippchallenge); mit dem ersten Thema erscheint sie für Weg UND Übungssprache „pt".
 *
 * ⚠️ DATENBLATT: nur `import type`, kein Code-Import.
 */

export type WurzelStufePt = "kids" | "teens" | "erwachsen";

/** Woher ein Wort kommt - GESCHLOSSENE Liste (gemessen in `tf-fest-pt-PT.json`, 25.10.2026); nur für die Lehrkraft, wird nicht abgetippt. */
export type WurzelOriginePt = "alemão" | "chinês" | "espanhol" | "francês" | "grego" | "inglês" | "italiano" | "japonês" | "latim" | "língua aborígene australiana" | "malaiala" | "malaio" | "neerlandês" | "náuatle" | "quíchua" | "taíno" | "tupi" | "turco" | "árabe";

export interface WurzelPaarPt {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  indizio: string;
  /** Das Wort selbst - ein Einzelwort, klein. */
  parola: string;
  origine: WurzelOriginePt;
  /** Wo die Herkunft nachgelesen wurde (Quelle aus `tf-fest`, z. B. eine Wiktionary-Seite). */
  beleg: string;
}

export interface WurzelThemaPt {
  id: string;
  titel: string;
  paare: WurzelPaarPt[];
}

/** Die Themen (aus `wurzelKategorien`): `titel` in Portugiesisch (Portugal), `titelJe` der Name in den Bedienungssprachen (fehlt einer: englisch, sonst `titel`). */
export const WURZEL_THEMEN_PT: readonly { id: string; titel: string; titelJe?: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> }[] = [
  { id: "grego-latim", titel: "Raízes gregas e latinas", titelJe: { de: "Griechische und lateinische Wurzeln", en: "Greek and Latin roots" } },
  { id: "arabe", titel: "Palavras que vêm do árabe", titelJe: { de: "Wörter aus dem Arabischen", en: "Words from Arabic" } },
  { id: "frances", titel: "Palavras que vêm do francês", titelJe: { de: "Wörter aus dem Französischen", en: "Words from French" } },
  { id: "europa", titel: "Palavras de outras línguas da Europa", titelJe: { de: "Wörter aus anderen Sprachen Europas", en: "Words from other European languages" } },
  { id: "longe", titel: "Palavras que chegaram de longe", titelJe: { de: "Wörter, die von weit her kamen", en: "Words that came from far away" } },
];

/** Die Paare je Stufe und Thema. */
export const WURZELN_PT: Record<WurzelStufePt, WurzelThemaPt[]> = {
  kids: [
    {
      id: "grego-latim",
      titel: "Raízes gregas e latinas",
      paare: [
        { indizio: "falas com quem está longe", parola: "telefone", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/telefone" },
        { indizio: "réptil gigante de antigamente", parola: "dinossauro", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/dinossauro" },
        { indizio: "cavalo do rio africano", parola: "hipopótamo", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/hipopótamo" },
        { indizio: "mostra o que é minúsculo", parola: "microscópio", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/microscópio" },
        { indizio: "figura com três ângulos", parola: "triângulo", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/triângulo" },
        { indizio: "forma das células dos favos de mel", parola: "hexágono", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/hexágono" },
        { indizio: "a Terra é um deles", parola: "planeta", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/planeta" },
        { indizio: "sala cheia de livros", parola: "biblioteca", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/biblioteca" },
        { indizio: "réptil de boca enorme do rio", parola: "crocodilo", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/crocodilo" },
        { indizio: "imagem feita com a luz", parola: "fotografia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/fotografia" },
        { indizio: "casa de vidro para peixes", parola: "aquário", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/aquário" },
        { indizio: "sete dias seguidos", parola: "semana", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/semana" },
        { indizio: "o dia do Senhor", parola: "domingo", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/domingo" },
      ],
    },
    {
      id: "arabe",
      titel: "Palavras que vêm do árabe",
      paare: [
        { indizio: "adoça o chá", parola: "açúcar", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/açúcar" },
        { indizio: "grãos brancos que se cozem", parola: "arroz", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/arroz" },
        { indizio: "óleo das azeitonas", parola: "azeite", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/azeite" },
        { indizio: "fruto da oliveira", parola: "azeitona", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/azeitona" },
        { indizio: "folhas verdes da salada", parola: "alface", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/alface" },
        { indizio: "fruto redondo com gomos", parola: "laranja", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/laranja" },
        { indizio: "fruto amarelo e azedo", parola: "limão", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/limão" },
        { indizio: "nela encostas a cabeça na cama", parola: "almofada", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/almofada" },
        { indizio: "povoação pequena no campo", parola: "aldeia", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/aldeia" },
        { indizio: "ladrilho pintado de azul e branco", parola: "azulejo", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/azulejo" },
        { indizio: "remédio doce para a tosse", parola: "xarope", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/xarope#Portuguese" },
        { indizio: "erva cheirosa de flor azul", parola: "alecrim", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/alecrim" },
        { indizio: "tem o pescoço mais comprido", parola: "girafa", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/girafa" },
      ],
    },
    {
      id: "frances",
      titel: "Palavras que vêm do francês",
      paare: [
        { indizio: "guarda-se lá o carro", parola: "garagem", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/garagem" },
        { indizio: "chapéu com pala", parola: "boné", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/boné" },
        { indizio: "terreno com flores e relva", parola: "jardim", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/jardim" },
        { indizio: "criança muito pequenina", parola: "bebé", origine: "francês", beleg: "https://en.wiktionary.org/wiki/bebé#Portuguese" },
        { indizio: "ovos batidos e fritos na frigideira", parola: "omelete", origine: "francês", beleg: "https://en.wiktionary.org/wiki/omelete#Portuguese" },
        { indizio: "escola para os mais pequeninos", parola: "creche", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/creche" },
        { indizio: "leva a carta pelo correio", parola: "envelope", origine: "francês", beleg: "https://en.wiktionary.org/wiki/envelope#Portuguese" },
        { indizio: "veículo grande de mercadorias", parola: "camião", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/camião" },
        { indizio: "cobre a cabeça e tem aba", parola: "chapéu", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/chapéu" },
        { indizio: "doce pequeno de chocolate", parola: "bombom", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/bombom" },
        { indizio: "quem manda na cozinha", parola: "chefe", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/chefe" },
        { indizio: "pinturas na cara para o teatro", parola: "maquilhagem", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/maquilhagem" },
        { indizio: "panqueca fina com recheio", parola: "crepe", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/crepe" },
        { indizio: "batata esmagada com leite", parola: "puré", origine: "francês", beleg: "https://en.wiktionary.org/wiki/puré#Portuguese" },
        { indizio: "anda nos carris com muitas carruagens", parola: "comboio", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/comboio" },
      ],
    },
    {
      id: "europa",
      titel: "Palavras de outras línguas da Europa",
      paare: [
        { indizio: "desporto com bola e duas balizas", parola: "futebol", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/futebol" },
        { indizio: "associação de quem joga junto", parola: "clube", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/clube" },
        { indizio: "desporto com raquetes e rede", parola: "ténis", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/ténis" },
        { indizio: "pão com recheio", parola: "sanduíche", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/sanduíche" },
        { indizio: "fatia de carne grelhada", parola: "bife", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/bife" },
        { indizio: "a bola entra na baliza", parola: "golo", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/golo" },
        { indizio: "instrumento de teclas", parola: "piano", origine: "italiano", beleg: "https://pt.wiktionary.org/wiki/piano" },
        { indizio: "massa redonda com tomate e queijo no forno", parola: "pizza", origine: "italiano", beleg: "https://pt.wiktionary.org/wiki/pizza" },
        { indizio: "massa comprida e fininha", parola: "esparguete", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/esparguete#Portuguese" },
        { indizio: "toca-se com um arco", parola: "violino", origine: "italiano", beleg: "https://en.wiktionary.org/wiki/violino#Portuguese" },
        { indizio: "desporto com cestos", parola: "basquetebol", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/basquetebol" },
        { indizio: "barco de recreio à vela ou a motor", parola: "iate", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/iate" },
      ],
    },
    {
      id: "longe",
      titel: "Palavras que chegaram de longe",
      paare: [
        { indizio: "fruto com coroa de folhas", parola: "ananás", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/ananás" },
        { indizio: "fruto com a semente por fora", parola: "caju", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/caju#Portuguese" },
        { indizio: "réptil dos rios do Brasil", parola: "jacaré", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/jacaré" },
        { indizio: "ave de bico enorme e colorido", parola: "tucano", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/tucano" },
        { indizio: "papagaio grande e colorido", parola: "arara", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/arara" },
        { indizio: "fruto da flor-da-paixão", parola: "maracujá", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/maracujá" },
        { indizio: "doce escuro feito com cacau", parola: "chocolate", origine: "náuatle", beleg: "https://pt.wiktionary.org/wiki/chocolate" },
        { indizio: "fruto vermelho da salada", parola: "tomate", origine: "náuatle", beleg: "https://pt.wiktionary.org/wiki/tomate" },
        { indizio: "fruto verde e cremoso", parola: "abacate", origine: "náuatle", beleg: "https://pt.wiktionary.org/wiki/abacate" },
        { indizio: "tubérculo para fazer puré", parola: "batata", origine: "taíno", beleg: "https://pt.wiktionary.org/wiki/batata" },
        { indizio: "barco estreito a remos", parola: "canoa", origine: "taíno", beleg: "https://pt.wiktionary.org/wiki/canoa" },
        { indizio: "vento fortíssimo que gira", parola: "furacão", origine: "taíno", beleg: "https://pt.wiktionary.org/wiki/furacão" },
        { indizio: "bebida quente de folhas", parola: "chá", origine: "chinês", beleg: "https://pt.wiktionary.org/wiki/chá" },
        { indizio: "fruto seco que nasce debaixo da terra", parola: "amendoim", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/amendoim" },
        { indizio: "farinha de mandioca", parola: "tapioca", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/tapioca" },
      ],
    },
  ],
  teens: [
    {
      id: "grego-latim",
      titel: "Raízes gregas e latinas",
      paare: [
        { indizio: "as plantas usam a luz para viver", parola: "fotossíntese", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/fotossíntese" },
        { indizio: "ciência do ambiente", parola: "ecologia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/ecologia" },
        { indizio: "o poder nas mãos do povo", parola: "democracia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/democracia" },
        { indizio: "estuda os restos antigos", parola: "arqueologia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/arqueologia" },
        { indizio: "estuda os fósseis", parola: "paleontologia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/paleontologia" },
        { indizio: "palavra com o mesmo sentido", parola: "sinónimo", origine: "grego", beleg: "https://en.wiktionary.org/wiki/sinónimo#Portuguese" },
        { indizio: "estuda a superfície da Terra", parola: "geografia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/geografia" },
        { indizio: "gás que respiramos", parola: "oxigénio", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/oxigénio" },
        { indizio: "governar-se a si próprio", parola: "autonomia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/autonomia" },
        { indizio: "animal que se alimenta de carne", parola: "carnívoro", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/carnívoro" },
        { indizio: "animal que se alimenta de plantas", parola: "herbívoro", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/herbívoro" },
        { indizio: "animal com coluna", parola: "vertebrado", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/vertebrado" },
        { indizio: "quase uma ilha", parola: "península", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/península" },
      ],
    },
    {
      id: "arabe",
      titel: "Palavras que vêm do árabe",
      paare: [
        { indizio: "grande depósito de mercadorias", parola: "armazém", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/armazém#Portuguese" },
        { indizio: "faz roupa por medida", parola: "alfaiate", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/alfaiate" },
        { indizio: "matemática com letras", parola: "álgebra", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/álgebra" },
        { indizio: "sinal que escreve um número", parola: "algarismo", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/algarismo" },
        { indizio: "controla as mercadorias na fronteira", parola: "alfândega", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alfândega#Portuguese" },
        { indizio: "bolinha de carne picada", parola: "almôndega", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/almôndega" },
        { indizio: "legume verde em forma de flor", parola: "alcachofra", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alcachofra#Portuguese" },
        { indizio: "tempero amarelo e caro", parola: "açafrão", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/açafrão#Portuguese" },
        { indizio: "vagem doce do Algarve", parola: "alfarroba", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/alfarroba" },
        { indizio: "se Deus quiser", parola: "oxalá", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/oxalá" },
        { indizio: "porco selvagem", parola: "javali", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/javali" },
        { indizio: "trabalho a fazer", parola: "tarefa", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/tarefa" },
        { indizio: "ferramenta que aperta e corta", parola: "alicate", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/alicate" },
      ],
    },
    {
      id: "frances",
      titel: "Palavras que vêm do francês",
      paare: [
        { indizio: "paragem do trabalho como protesto", parola: "greve", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/greve" },
        { indizio: "ameaça para obter algo", parola: "chantagem", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/chantagem" },
        { indizio: "o que se faz todos os dias", parola: "rotina", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/rotina" },
        { indizio: "boneco movido por fios", parola: "marioneta", origine: "francês", beleg: "https://en.wiktionary.org/wiki/marioneta#Portuguese" },
        { indizio: "alivia os músculos", parola: "massagem", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/massagem" },
        { indizio: "modelo pequeno de um projeto", parola: "maqueta", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/maqueta" },
        { indizio: "banho de chuveiro", parola: "duche", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/duche" },
        { indizio: "aquece o pescoço", parola: "cachecol", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/cachecol" },
        { indizio: "papelinho com o preço", parola: "etiqueta", origine: "francês", beleg: "https://en.wiktionary.org/wiki/etiqueta#Portuguese" },
        { indizio: "notícia longa feita no local", parola: "reportagem", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/reportagem" },
        { indizio: "estrago feito de propósito", parola: "sabotagem", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/sabotagem" },
      ],
    },
    {
      id: "europa",
      titel: "Palavras de outras línguas da Europa",
      paare: [
        { indizio: "passagem por baixo da montanha", parola: "túnel", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/túnel" },
        { indizio: "refeição ligeira a meio da tarde", parola: "lanche", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/lanche" },
        { indizio: "quem comanda o grupo", parola: "líder", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/líder" },
        { indizio: "admirador de um artista", parola: "fã", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/fã" },
        { indizio: "dirige a orquestra", parola: "maestro", origine: "italiano", beleg: "https://pt.wiktionary.org/wiki/maestro" },
        { indizio: "poema de catorze versos", parola: "soneto", origine: "italiano", beleg: "https://pt.wiktionary.org/wiki/soneto" },
        { indizio: "frente de um edifício", parola: "fachada", origine: "italiano", beleg: "https://pt.wiktionary.org/wiki/fachada" },
        { indizio: "quem conduz o avião", parola: "piloto", origine: "italiano", beleg: "https://pt.wiktionary.org/wiki/piloto" },
        { indizio: "luta de pequenos grupos armados", parola: "guerrilha", origine: "espanhol", beleg: "https://en.wiktionary.org/wiki/guerrilha#Portuguese" },
        { indizio: "cadeia de montanhas", parola: "cordilheira", origine: "espanhol", beleg: "https://pt.wiktionary.org/wiki/cordilheira" },
      ],
    },
    {
      id: "longe",
      titel: "Palavras que chegaram de longe",
      paare: [
        { indizio: "o maior roedor do mundo", parola: "capivara", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/capivara" },
        { indizio: "serpente grande que aperta as presas", parola: "jiboia", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/jiboia" },
        { indizio: "milho que salta no tacho", parola: "pipoca", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/pipoca#Portuguese" },
        { indizio: "raiz de onde se faz a tapioca", parola: "mandioca", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/mandioca" },
        { indizio: "semente do chocolate", parola: "cacau", origine: "náuatle", beleg: "https://pt.wiktionary.org/wiki/cacau" },
        { indizio: "parente do lobo nas pradarias", parola: "coiote", origine: "náuatle", beleg: "https://pt.wiktionary.org/wiki/coiote" },
        { indizio: "animal de lã dos Andes", parola: "lhama", origine: "quíchua", beleg: "https://pt.wiktionary.org/wiki/lhama" },
        { indizio: "salta e leva o filho na bolsa", parola: "canguru", origine: "língua aborígene australiana", beleg: "https://pt.wiktionary.org/wiki/canguru" },
        { indizio: "fruto cor de laranja, mole e doce", parola: "caqui", origine: "japonês", beleg: "https://pt.wiktionary.org/wiki/caqui" },
        { indizio: "divisória dobrável", parola: "biombo", origine: "japonês", beleg: "https://pt.wiktionary.org/wiki/biombo" },
        { indizio: "leite fermentado e cremoso", parola: "iogurte", origine: "turco", beleg: "https://pt.wiktionary.org/wiki/iogurte" },
        { indizio: "roupa tradicional do Japão", parola: "quimono", origine: "japonês", beleg: "https://pt.wiktionary.org/wiki/quimono" },
      ],
    },
  ],
  erwachsen: [
    {
      id: "grego-latim",
      titel: "Raízes gregas e latinas",
      paare: [
        { indizio: "amor pela sabedoria", parola: "filosofia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/filosofia" },
        { indizio: "amor pela humanidade", parola: "filantropia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/filantropia" },
        { indizio: "estudo do ser humano", parola: "antropologia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/antropologia" },
        { indizio: "governo de poucos", parola: "oligarquia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/oligarquia" },
        { indizio: "mudança de forma", parola: "metamorfose", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/metamorfose" },
        { indizio: "vida em comum com vantagem", parola: "simbiose", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/simbiose" },
        { indizio: "ideia ainda por provar", parola: "hipótese", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/hipótese" },
        { indizio: "sentir o que o outro sente", parola: "empatia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/empatia" },
        { indizio: "lugar ideal que não existe", parola: "utopia", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/utopia" },
        { indizio: "coisa fora do seu tempo", parola: "anacronismo", origine: "grego", beleg: "https://pt.wiktionary.org/wiki/anacronismo" },
        { indizio: "pagamento mensal do trabalho", parola: "salário", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/salário" },
        { indizio: "vestido de branco para pedir votos", parola: "candidato", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/candidato" },
        { indizio: "a coisa pública", parola: "república", origine: "latim", beleg: "https://pt.wiktionary.org/wiki/república" },
      ],
    },
    {
      id: "arabe",
      titel: "Palavras que vêm do árabe",
      paare: [
        { indizio: "licença passada pela câmara", parola: "alvará", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alvará#Portuguese" },
        { indizio: "antiga medida de peso, hoje o sinal @", parola: "arroba", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/arroba" },
        { indizio: "antigo governador de um castelo", parola: "alcaide", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/alcaide" },
        { indizio: "antiga medida de cereais", parola: "alqueire", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/alqueire" },
        { indizio: "uma pessoa qualquer", parola: "fulano", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/fulano" },
        { indizio: "planta de flor roxa e perfumada", parola: "alfazema", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/alfazema#Portuguese" },
        { indizio: "colheita de um ano", parola: "safra", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/safra" },
        { indizio: "o leiloeiro vende a quem der mais", parola: "leilão", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/leilão#Portuguese" },
        { indizio: "pobre de espírito, avarento", parola: "mesquinho", origine: "árabe", beleg: "https://pt.wiktionary.org/wiki/mesquinho" },
        { indizio: "bolso da roupa, em linguagem antiga", parola: "algibeira", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/algibeira#Portuguese" },
        { indizio: "torre de vigia", parola: "atalaia", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/atalaia#Portuguese" },
        { indizio: "material das presas do elefante", parola: "marfim", origine: "árabe", beleg: "https://en.wiktionary.org/wiki/marfim#Portuguese" },
      ],
    },
    {
      id: "frances",
      titel: "Palavras que vêm do francês",
      paare: [
        { indizio: "excesso de papéis e regras", parola: "burocracia", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/burocracia" },
        { indizio: "os melhores de um grupo", parola: "elite", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/elite" },
        { indizio: "elegante e na moda", parola: "chique", origine: "francês", beleg: "https://en.wiktionary.org/wiki/chique#Portuguese" },
        { indizio: "contorno escuro de uma figura", parola: "silhueta", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/silhueta" },
        { indizio: "máquina que cortava cabeças", parola: "guilhotina", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/guilhotina" },
        { indizio: "conspiração secreta", parola: "complô", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/complô" },
        { indizio: "disfarce para não ser visto", parola: "camuflagem", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/camuflagem" },
        { indizio: "deslize embaraçoso", parola: "gafe", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/gafe" },
        { indizio: "mesa de iguarias onde cada um se serve", parola: "bufete", origine: "francês", beleg: "https://en.wiktionary.org/wiki/bufete#Portuguese" },
        { indizio: "pormenor", parola: "detalhe", origine: "francês", beleg: "https://pt.wiktionary.org/wiki/detalhe" },
      ],
    },
    {
      id: "europa",
      titel: "Palavras de outras línguas da Europa",
      paare: [
        { indizio: "recusa organizada de comprar", parola: "boicote", origine: "inglês", beleg: "https://pt.wiktionary.org/wiki/boicote" },
        { indizio: "falência de uma empresa", parola: "bancarrota", origine: "italiano", beleg: "https://pt.wiktionary.org/wiki/bancarrota" },
        { indizio: "bairro onde se isola uma minoria", parola: "gueto", origine: "italiano", beleg: "https://pt.wiktionary.org/wiki/gueto" },
        { indizio: "soldado de vigia", parola: "sentinela", origine: "italiano", beleg: "https://pt.wiktionary.org/wiki/sentinela" },
        { indizio: "fracasso total", parola: "fiasco", origine: "italiano", beleg: "https://pt.wiktionary.org/wiki/fiasco" },
        { indizio: "grupo de favoritos à volta do poder", parola: "camarilha", origine: "espanhol", beleg: "https://en.wiktionary.org/wiki/camarilha#Portuguese" },
        { indizio: "sonhador e idealista, como Dom Quixote", parola: "quixotesco", origine: "espanhol", beleg: "https://pt.wiktionary.org/wiki/quixotesco" },
        { indizio: "mineral transparente e duro", parola: "quartzo", origine: "alemão", beleg: "https://pt.wiktionary.org/wiki/quartzo" },
        { indizio: "metal que dá um azul intenso", parola: "cobalto", origine: "alemão", beleg: "https://pt.wiktionary.org/wiki/cobalto" },
        { indizio: "metal cinzento das caleiras", parola: "zinco", origine: "alemão", beleg: "https://pt.wiktionary.org/wiki/zinco" },
        { indizio: "muro que trava as águas", parola: "dique", origine: "neerlandês", beleg: "https://pt.wiktionary.org/wiki/dique" },
      ],
    },
    {
      id: "longe",
      titel: "Palavras que chegaram de longe",
      paare: [
        { indizio: "espada ou faca grande de lâmina curva", parola: "catana", origine: "japonês", beleg: "https://en.wiktionary.org/wiki/catana#Portuguese" },
        { indizio: "sopa de frango com arroz", parola: "canja", origine: "malaiala", beleg: "https://pt.wiktionary.org/wiki/canja" },
        { indizio: "barco feito de troncos", parola: "jangada", origine: "malaiala", beleg: "https://pt.wiktionary.org/wiki/jangada" },
        { indizio: "antigo funcionário da China", parola: "mandarim", origine: "malaio", beleg: "https://pt.wiktionary.org/wiki/mandarim" },
        { indizio: "onda gigante depois de um sismo", parola: "tsunami", origine: "japonês", beleg: "https://pt.wiktionary.org/wiki/tsunami" },
        { indizio: "chefe de uma tribo", parola: "cacique", origine: "taíno", beleg: "https://pt.wiktionary.org/wiki/cacique" },
        { indizio: "animal com carapaça que se enrola", parola: "tatu", origine: "tupi", beleg: "https://pt.wiktionary.org/wiki/tatu" },
        { indizio: "macaquinho de cauda comprida", parola: "sagui", origine: "tupi", beleg: "https://en.wiktionary.org/wiki/sagui#Portuguese" },
        { indizio: "taça pequena com asa para o chá", parola: "chávena", origine: "malaio", beleg: "https://en.wiktionary.org/wiki/chávena#Portuguese" },
      ],
    },
  ],
};

/** Der Name der Tippchallenge-Dateien je Bedienungssprache, mit `{i}` und `{n}` („Bulgarian word origins, alphabetical: file {i} of {n}"). */
export const WURZEL_CHALLENGE_TITEL_PT: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> = {
  de: "Herkunft portugiesischer Wörter, alphabetisch: Datei {i} von {n}",
  en: "Portuguese word origins, alphabetical: file {i} of {n}",
};

/** Die Zeile eines Paares: zuerst der Hinweis, dann das Wort. */
export function wurzelZeilePt(x: { indizio: string; parola: string }): string {
  return `${x.indizio} - ${x.parola}`;
}

/** Dieselben Wörter, alphabetisch nach dem Hinweis (Sortierung „pt-PT") - für die Tippchallenge, wie `KORENY_ABECEDNE`. */
export const WURZELN_PT_ALPHABETISCH: Record<WurzelStufePt, string[]> = Object.fromEntries(
  (Object.keys(WURZELN_PT) as WurzelStufePt[]).map((stufe) => [
    stufe,
    WURZELN_PT[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indizio.localeCompare(b.indizio, "pt-PT"))
      .map(wurzelZeilePt),
  ]),
) as Record<WurzelStufePt, string[]>;
