/**
 * ★ D-LERNDATEN (25.10.2026): DIE BUCHSTABENVERBINDUNGEN FÜR DAS GELÄUFIGKEITSSCHREIBEN des Weges „br" (Portugiesisch (Brasilien)) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/pt-BR/tf-fest-pt-BR.json`, Schlüssel `buchstabenFolgen` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - sprachlich sauber, strikt brasilianisch, tippbar (0 Fehler), Reihenfolge 0 Verstöße, Sperrliste 0 Treffer.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `gelaeufigkeitCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Portugiesisch (Brasilien) als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * Verteiler: `gelaeufigkeit.ts` (prüft jedes Wort mit dem Weg über `fitText`) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?brasilianisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-br.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_BR: Verbindung[] = [
  { folge: "ch", stelle: "anfang", woerter: ["chave", "chuva", "chão", "chá", "chocolate", "chinelo", "chapéu", "chefe", "chegar", "chimarrão", "churrasco", "chiclete"] },
  { folge: "ch", stelle: "mitte", woerter: ["bicho", "mochila", "cachoeira", "fechar", "acho", "bolacha", "flecha", "salsicha", "prancha", "mancha", "rocha", "cochilo"] },
  { folge: "lh", stelle: "mitte", woerter: ["filho", "folha", "milho", "olho", "abelha", "coelho", "ovelha", "joelho", "trabalho", "colher", "velho", "palhaço", "orelha"] },
  { folge: "nh", stelle: "mitte", woerter: ["ninho", "banho", "sonho", "minha", "manhã", "vinho", "caminho", "cozinha", "unha", "aranha", "sonhar"] },
  { folge: "rr", stelle: "mitte", woerter: ["carro", "terra", "ferro", "torre", "barriga", "corrida", "barro", "serra", "garrafa", "arroz", "morro", "gorro", "correio"] },
  { folge: "ss", stelle: "mitte", woerter: ["osso", "passo", "massa", "assim", "pássaro", "nosso", "isso", "pessoa", "assunto", "vassoura", "tosse", "missão"] },
  { folge: "ç", stelle: "mitte", woerter: ["praça", "moça", "poço", "pescoço", "criança", "cabeça", "braço", "açúcar", "laço", "peça", "abraço", "caçula"] },
  { folge: "qu", stelle: "anfang", woerter: ["que", "quem", "quero", "quente", "queijo", "quadro", "quatro", "quintal", "quindim", "quarto", "quase", "qualquer"] },
  { folge: "gu", stelle: "mitte", woerter: ["pinguim", "aguentar", "fogueira", "mangueira", "foguete", "sangue", "figura", "preguiça", "seguir", "alguém", "amiguinho"] },
  { folge: "sc", stelle: "mitte", woerter: ["piscina", "nascer", "crescer", "descer", "consciência", "adolescente", "fascinante", "disciplina", "descida", "nascimento"] },
  { folge: "xc", stelle: "mitte", woerter: ["exceção", "excelente", "exceto", "excesso", "excursão", "exceder", "excelência", "excepcional"] },
  { folge: "x", stelle: "anfang", woerter: ["xícara", "xadrez", "xarope", "xampu", "xodó", "xilofone", "xerife", "xará"] },
  { folge: "ex", stelle: "anfang", woerter: ["exame", "exemplo", "exercício", "explicar", "extra", "exato", "existe", "exposição", "experiência", "excelente"] },
  { folge: "ão", stelle: "ende", woerter: ["mão", "pão", "cão", "chão", "irmão", "coração", "avião", "limão", "feijão", "balão", "violão", "sabão", "tubarão"] },
  { folge: "ões", stelle: "ende", woerter: ["limões", "balões", "corações", "aviões", "lições", "canções", "leões", "botões", "mamões", "portões", "milhões", "estações"] },
  { folge: "ção", stelle: "ende", woerter: ["canção", "lição", "ação", "atenção", "educação", "natação", "estação", "oração", "refeição", "eleição", "função", "coleção"] },
  { folge: "dade", stelle: "ende", woerter: ["cidade", "idade", "verdade", "saudade", "felicidade", "liberdade", "realidade", "universidade", "bondade", "novidade"] },
  { folge: "mente", stelle: "ende", woerter: ["finalmente", "realmente", "exatamente", "somente", "rapidamente", "certamente", "novamente", "totalmente", "simplesmente", "lentamente"] },
  { folge: "inho", stelle: "ende", woerter: ["carrinho", "passarinho", "sozinho", "caminho", "vizinho", "cantinho", "baixinho", "bonzinho", "golfinho", "padrinho"] },
  { folge: "inha", stelle: "ende", woerter: ["minha", "cozinha", "linha", "vizinha", "joaninha", "farinha", "rainha", "sozinha", "andorinha", "bandeirinha"] },
  { folge: "eiro", stelle: "ende", woerter: ["dinheiro", "primeiro", "banheiro", "bombeiro", "pandeiro", "coqueiro", "inteiro", "verdadeiro", "cozinheiro", "brasileiro", "janeiro", "fevereiro"] },
  { folge: "eira", stelle: "ende", woerter: ["cadeira", "bandeira", "fogueira", "geladeira", "mangueira", "cachoeira", "capoeira", "feira", "lareira", "brincadeira", "primeira"] },
  { folge: "agem", stelle: "ende", woerter: ["viagem", "coragem", "mensagem", "garagem", "paisagem", "passagem", "imagem", "bagagem", "homenagem", "tatuagem"] },
  { folge: "oso", stelle: "ende", woerter: ["famoso", "perigoso", "curioso", "maravilhoso", "cheiroso", "preguiçoso", "nervoso", "charmoso", "orgulhoso"] },
  { folge: "ência", stelle: "ende", woerter: ["ciência", "paciência", "experiência", "emergência", "frequência", "aparência", "agência", "inteligência", "violência"] },
  { folge: "ância", stelle: "ende", woerter: ["infância", "distância", "importância", "ambulância", "tolerância", "abundância", "elegância", "substância"] },
  { folge: "ável", stelle: "ende", woerter: ["agradável", "responsável", "saudável", "confortável", "provável", "amável", "adorável", "notável"] },
  { folge: "ível", stelle: "ende", woerter: ["possível", "incrível", "impossível", "horrível", "terrível", "nível", "sensível", "combustível", "invisível"] },
  { folge: "des", stelle: "anfang", woerter: ["desde", "desenho", "desafio", "desculpa", "descer", "descanso", "desfile", "desejo", "despertar", "desligar"] },
  { folge: "pre", stelle: "anfang", woerter: ["preto", "preço", "presente", "prefeito", "prego", "prestar", "precisar", "presidente", "prefeitura", "preguiça"] },
  { folge: "pro", stelle: "anfang", woerter: ["professor", "professora", "problema", "prova", "programa", "projeto", "proteção", "procurar", "proibido"] },
  { folge: "tr", stelle: "anfang", woerter: ["trem", "três", "trabalho", "trazer", "triste", "trator", "trigo", "trovão", "troféu", "trânsito"] },
  { folge: "br", stelle: "anfang", woerter: ["brincar", "branco", "braço", "brigadeiro", "brinquedo", "brasileiro", "bruxa", "brilho", "brisa", "broa"] },
  { folge: "pl", stelle: "anfang", woerter: ["planta", "planeta", "plano", "plástico", "placa", "plateia", "plural", "plantão", "pluma"] },
  { folge: "cl", stelle: "anfang", woerter: ["claro", "classe", "clima", "clube", "clínica", "cliente", "clássico", "clarinete"] },
  { folge: "fl", stelle: "anfang", woerter: ["flor", "flores", "floresta", "flauta", "flecha", "flamingo", "floco", "fluxo"] },
  { folge: "gr", stelle: "anfang", woerter: ["grande", "grama", "grupo", "grilo", "gritar", "graça", "gravata", "grão", "gravidade", "grosso"] },
  { folge: "es", stelle: "anfang", woerter: ["escola", "estrela", "escada", "espelho", "esporte", "estudo", "esquerda", "estrada", "espaço", "escrever"] },
  { folge: "ou", stelle: "mitte", woerter: ["touca", "couro", "tesoura", "vassoura", "couve", "dourado", "roupa", "pouco", "louça", "pouso"] },
  { folge: "ei", stelle: "mitte", woerter: ["queijo", "peixe", "beijo", "feijão", "leite", "cheiro", "ameixa", "beira", "deitar", "feira"] },
  { folge: "oi", stelle: "mitte", woerter: ["noite", "coisa", "doido", "biscoito", "afoito", "noivo", "dois", "goiaba", "boiada"] },
  { folge: "ai", stelle: "mitte", woerter: ["praia", "caixa", "baixo", "saia", "vaidade", "raiva", "paixão", "faixa", "baile", "gaivota"] },
  { folge: "im", stelle: "ende", woerter: ["jardim", "pudim", "capim", "sim", "fim", "quindim", "marfim", "pinguim", "latim", "alecrim"] },
  { folge: "om", stelle: "ende", woerter: ["bom", "som", "tom", "batom", "marrom", "garçom", "com", "bombom"] },
  { folge: "ns", stelle: "ende", woerter: ["viagens", "homens", "jovens", "nuvens", "garagens", "imagens", "mensagens", "bons", "sons", "parabéns"] },
  { folge: "am", stelle: "ende", woerter: ["falam", "cantam", "brincam", "andam", "estudam", "pulam", "jogam", "moram", "gostam"] },
  { folge: "á", stelle: "ende", woerter: ["sofá", "já", "lá", "maracujá", "sabiá", "guaraná", "tamanduá", "cajá", "vatapá", "tacacá"] },
  { folge: "é", stelle: "ende", woerter: ["café", "pé", "jacaré", "boné", "maré", "até", "filé", "acarajé"] },
  { folge: "ô", stelle: "ende", woerter: ["avô", "vovô", "robô", "metrô", "camelô", "bisavô", "maiô", "alô"] },
  { folge: "ê", stelle: "ende", woerter: ["você", "bebê", "ipê", "purê", "buquê", "comitê", "porquê", "crochê"] },
  { folge: "ó", stelle: "ende", woerter: ["avó", "vovó", "só", "jiló", "forró", "cipó", "dominó", "xodó", "bisavó", "nó"] },
  { folge: "í", stelle: "mitte", woerter: ["família", "polícia", "país", "saída", "baía", "juíza", "sítio", "difícil", "cuíca", "veículo"] },
  { folge: "â", stelle: "mitte", woerter: ["câmera", "lâmpada", "pântano", "dinâmica", "cerâmica", "lâmina", "atlântico", "triângulo"] },
  { folge: "ã", stelle: "ende", woerter: ["manhã", "irmã", "maçã", "fã", "amanhã", "campeã", "cidadã", "lã"] },
  { folge: "ú", stelle: "mitte", woerter: ["saúde", "açúcar", "música", "número", "túnel", "músculo", "dúvida", "público"] },
];
