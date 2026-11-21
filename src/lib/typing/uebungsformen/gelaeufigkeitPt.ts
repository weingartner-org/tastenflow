/**
 * ★ D-LERNDATEN (25.10.2026): DIE BUCHSTABENVERBINDUNGEN FÜR DAS GELÄUFIGKEITSSCHREIBEN des Weges „pt" (Portugiesisch (Portugal)) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/pt-PT/tf-fest-pt-PT.json`, Schlüssel `buchstabenFolgen` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja (für den Bau) - Vorbehalt: Lese-Abnahme durch eine Person aus Portugal; Wurzeln und Buchstabenfolgen liegen mengenmäßig unter der Vorlage.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `gelaeufigkeitCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Portugiesisch (Portugal) als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * Verteiler: `gelaeufigkeit.ts` (prüft jedes Wort mit dem Weg über `fitText`) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?portugiesisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-pt.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_PT: Verbindung[] = [
  { folge: "lh", stelle: "mitte", woerter: ["filho", "filha", "folha", "palha", "abelha", "coelho", "olho", "orelha", "ovelha", "toalha", "telhado", "colher", "trabalho", "joelho"] },
  { folge: "nh", stelle: "mitte", woerter: ["ninho", "minha", "manhã", "sonho", "vinho", "cozinha", "banho", "caminho", "linha", "senhora", "montanha", "sardinha", "amanhã", "rainha"] },
  { folge: "ch", stelle: "anfang", woerter: ["chave", "chuva", "chão", "chá", "chávena", "chapéu", "cheio", "chegar", "chorar", "chocolate", "chefe", "chinelos", "chaminé"] },
  { folge: "ch", stelle: "mitte", woerter: ["cacho", "mochila", "fechar", "machado", "salchicha", "flecha", "encher", "bolacha", "racha", "cachecol", "bochecha", "prancha", "concha"] },
  { folge: "rr", stelle: "mitte", woerter: ["carro", "terra", "serra", "ferro", "torre", "corrida", "barriga", "correio", "arroz", "guerra", "garrafa", "cigarra", "bairro"] },
  { folge: "ss", stelle: "mitte", woerter: ["massa", "osso", "passo", "pessoa", "pássaro", "assado", "nosso", "missão", "passeio", "isso", "tosse", "depressa"] },
  { folge: "ç", stelle: "mitte", woerter: ["caça", "maçã", "praça", "taça", "laço", "poço", "açúcar", "cabeça", "braço", "almoço", "pescoço", "calçada", "cortiça"] },
  { folge: "qu", stelle: "anfang", woerter: ["que", "quem", "quando", "quase", "quatro", "quarto", "queijo", "quente", "quinta", "quilo", "quiosque", "quinze", "querer"] },
  { folge: "qu", stelle: "mitte", woerter: ["aqui", "pequeno", "esquilo", "esquerda", "máquina", "parque", "mosquito", "aquário", "tanque", "arquiteto", "basquetebol", "bosque"] },
  { folge: "gu", stelle: "mitte", woerter: ["água", "foguete", "fogueira", "língua", "seguir", "sangue", "amiguinho", "mangueira", "preguiça", "formiguinha"] },
  { folge: "gu", stelle: "anfang", woerter: ["guarda", "guardanapo", "guitarra", "guia", "guiar", "gulodice", "guloso", "guerreiro", "guiché", "gume"] },
  { folge: "ão", stelle: "ende", woerter: ["mão", "pão", "cão", "chão", "irmão", "avião", "limão", "balão", "feijão", "verão", "botão", "leão", "coração", "algodão"] },
  { folge: "ões", stelle: "ende", woerter: ["botões", "balões", "limões", "leões", "aviões", "corações", "canções", "lições", "feijões", "portões", "camiões", "melões"] },
  { folge: "ã", stelle: "ende", woerter: ["irmã", "maçã", "manhã", "lã", "romã", "ecrã", "avelã", "hortelã", "amanhã", "alemã", "campeã"] },
  { folge: "ção", stelle: "ende", woerter: ["canção", "lição", "estação", "atenção", "informação", "natação", "refeição", "ligação", "educação", "direção", "ação"] },
  { folge: "inho", stelle: "ende", woerter: ["ninho", "caminho", "vinho", "golfinho", "passarinho", "carrinho", "bocadinho", "pinho", "moinho", "vizinho", "padrinho", "sobrinho"] },
  { folge: "inha", stelle: "ende", woerter: ["minha", "linha", "cozinha", "sardinha", "joaninha", "vizinha", "madrinha", "sobrinha", "andorinha", "farinha", "rainha"] },
  { folge: "mente", stelle: "ende", woerter: ["rapidamente", "finalmente", "exatamente", "lentamente", "felizmente", "realmente", "simplesmente", "certamente", "calmamente", "facilmente"] },
  { folge: "eiro", stelle: "ende", woerter: ["dinheiro", "primeiro", "padeiro", "carteiro", "bombeiro", "pinheiro", "sobreiro", "chuveiro", "cozinheiro", "companheiro", "marinheiro"] },
  { folge: "eira", stelle: "ende", woerter: ["feira", "cadeira", "bandeira", "lareira", "fogueira", "oliveira", "amendoeira", "banheira", "geleira", "primeira", "brincadeira"] },
  { folge: "dade", stelle: "ende", woerter: ["cidade", "verdade", "idade", "saudade", "liberdade", "realidade", "felicidade", "igualdade", "humidade", "unidade", "novidade", "atividade"] },
  { folge: "agem", stelle: "ende", woerter: ["viagem", "coragem", "paisagem", "mensagem", "garagem", "bagagem", "portagem", "reciclagem", "aterragem", "homenagem"] },
  { folge: "ês", stelle: "ende", woerter: ["três", "mês", "inglês", "francês", "português", "chinês", "japonês", "holandês", "freguês", "camponês"] },
  { folge: "esa", stelle: "ende", woerter: ["mesa", "surpresa", "empresa", "francesa", "portuguesa", "inglesa", "defesa", "princesa", "chinesa", "duquesa"] },
  { folge: "ável", stelle: "ende", woerter: ["agradável", "confortável", "saudável", "amável", "responsável", "notável", "adorável", "provável", "estável", "razoável"] },
  { folge: "ível", stelle: "ende", woerter: ["possível", "incrível", "impossível", "nível", "disponível", "sensível", "invisível", "terrível", "imprevisível"] },
  { folge: "ância", stelle: "ende", woerter: ["infância", "distância", "importância", "ambulância", "ganância", "tolerância", "elegância", "abundância", "substância"] },
  { folge: "ência", stelle: "ende", woerter: ["ciência", "paciência", "experiência", "emergência", "frequência", "agência", "urgência", "residência", "aparência"] },
  { folge: "x", stelle: "mitte", woerter: ["peixe", "caixa", "baixo", "lixo", "roxo", "mexer", "bexiga", "ameixa", "puxar", "queixo", "deixar", "faixa"] },
  { folge: "ex", stelle: "anfang", woerter: ["exame", "exemplo", "exercício", "exato", "extra", "exterior", "exposição", "excursão", "explicar", "existir"] },
  { folge: "sc", stelle: "mitte", woerter: ["nascer", "crescer", "descer", "piscina", "disciplina", "consciência", "fascinante", "ascensor", "descida", "adolescente"] },
  { folge: "des", stelle: "anfang", woerter: ["desenho", "desfile", "descer", "desporto", "desafio", "desculpa", "desligar", "desmaiar", "descobrir", "despedida"] },
  { folge: "pr", stelle: "anfang", woerter: ["praia", "prato", "prémio", "primo", "prima", "prenda", "presépio", "prova", "primavera", "professor"] },
  { folge: "br", stelle: "anfang", woerter: ["braço", "branco", "brincar", "bruxa", "brilho", "brisa", "broa", "brinquedo", "bravo", "brando"] },
  { folge: "tr", stelle: "anfang", woerter: ["três", "trabalho", "treino", "trigo", "trovoada", "troféu", "trotinete", "tremoço", "trinta", "truta"] },
  { folge: "gr", stelle: "anfang", woerter: ["grande", "grupo", "gruta", "grão", "grilo", "granizo", "gravata", "grito", "grosso", "gratidão"] },
  { folge: "cr", stelle: "anfang", woerter: ["cravo", "criança", "crescer", "cruz", "cru", "creme", "crocodilo", "crista", "cristal", "crónica"] },
  { folge: "fl", stelle: "anfang", woerter: ["flor", "floresta", "flecha", "flauta", "floco", "florista", "fluxo", "flamingo", "flutuar"] },
  { folge: "pl", stelle: "anfang", woerter: ["plano", "planeta", "planta", "plástico", "pluma", "plateia", "plural", "planície"] },
  { folge: "ei", stelle: "mitte", woerter: ["leite", "queijo", "peixe", "feira", "cheiro", "beijo", "meio", "sereia", "ameixa", "madeira"] },
  { folge: "ou", stelle: "mitte", woerter: ["pouco", "louça", "roupa", "touro", "dourado", "couve", "cenoura", "vassoura", "tesoura", "tesouro"] },
  { folge: "oi", stelle: "mitte", woerter: ["noite", "boia", "coisa", "dois", "joia", "moinho", "biscoito", "coitado", "boiar"] },
  { folge: "ar", stelle: "ende", woerter: ["falar", "jantar", "nadar", "brincar", "cantar", "saltar", "andar", "jogar", "dançar", "desenhar"] },
  { folge: "er", stelle: "ende", woerter: ["ler", "ver", "beber", "escrever", "correr", "crescer", "aprender", "saber", "fazer", "mexer"] },
  { folge: "ir", stelle: "ende", woerter: ["ir", "rir", "dormir", "abrir", "subir", "partir", "sorrir", "ouvir", "sair", "sentir"] },
  { folge: "á", stelle: "ende", woerter: ["lá", "já", "cá", "chá", "sofá", "está", "dá", "vá", "irá", "será", "maracujá"] },
  { folge: "é", stelle: "ende", woerter: ["café", "pé", "bebé", "até", "maré", "jacaré", "boné", "chaminé", "pontapé", "karaté", "guiché"] },
  { folge: "ó", stelle: "ende", woerter: ["avó", "só", "nó", "pó", "dó", "bisavó", "filhó", "trenó", "dominó"] },
  { folge: "ú", stelle: "mitte", woerter: ["açúcar", "música", "miúdo", "saúde", "número", "público", "rúcula", "miúda", "dúvida", "túnel"] },
  { folge: "í", stelle: "mitte", woerter: ["família", "polícia", "ruído", "juízo", "saída", "sítio", "país", "início", "vídeo", "líder"] },
  { folge: "õe", stelle: "mitte", woerter: ["põem", "limões", "balões", "botões", "leões", "lições", "canções", "aviões", "portões"] },
  { folge: "ui", stelle: "mitte", woerter: ["muito", "cuidado", "ruivo", "cuidar", "circuito", "gratuito", "intuito", "fluido", "construir", "destruir"] },
];
