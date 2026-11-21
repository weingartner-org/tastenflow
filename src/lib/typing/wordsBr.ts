/**
 * ★ D-LERNDATEN (25.10.2026): DER ÜBUNGSWORTSCHATZ des Weges „br" (Portugiesisch (Brasilien)) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/pt-BR/tf-fest-pt-BR.json`, Schlüssel `stufenWoerter` und `wortschatz` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - sprachlich sauber, strikt brasilianisch, tippbar (0 Fehler), Reihenfolge 0 Verstöße, Sperrliste 0 Treffer.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wordsCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Portugiesisch (Brasilien) als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ REIHENFOLGE: Die Wörter stehen in der Reihenfolge der Quelle - sortiert nach der Lern-Folge des Bauplans
 * (`BAUPLAN-2026-10-25-PT.md`), Stufe für Stufe. Die endgültige `BR_LETTER_ORDER` kommt erst mit F4 (`lernweg.ts`); bis dahin ist
 * der Weg ein Alias von „en", und `filterWords` lässt nur durch, was mit den englischen Einheiten tippbar ist. Nach F4: neu nach
 * Sprosse sortieren und die Kontingente je Sprosse prüfen (der Wächter „jedes Wort einer Stufe ist tippbar" liest die Folge aus
 * `lernweg.ts` und läuft, sobald sie dort steht). Das Vorlese-Lexikon liest diese Liste noch nicht (eigenes Fach: F8).
 *
 * Verteiler: `geruestWoerter.ts` ⇒ `generator.ts` (`WORD_BASE`, `STUFE_VOCAB_TABLE`), `uebungsformen/hilfen.ts` (`wortquelle`), `uebungsformen/pyramide.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?brasilianisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-br.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { InhaltsStufe } from "./account";

/** Die Übungswörter des Weges „br", klein, in der Lern-Folge der Quelle (1151 Wörter). */
export const WORDS_BR: string[] = [
  "da", "as", "das", "asa", "asas", "sala", "salas", "fala", "falas", "falsa", "falsas", "salsa", "salada", "saladas", "fada",
  "fadas", "alfa", "ala", "alas", "dada", "dadas", "assada", "faça", "faças", "de", "se", "ele", "ela", "eles", "esse", "essa",
  "dele", "seja", "dela", "deles", "desde", "essas", "esses", "elas", "dessa", "desse", "fale", "desses", "delas", "dessas",
  "defesa", "deseja", "sede", "fase", "lealdade", "leal", "seda", "sela", "do", "os", "ao", "dos", "lado", "fosse", "aos", "faço",
  "sol", "loja", "falo", "desejo", "dado", "dados", "dedo", "dedos", "falso", "solo", "osso", "ossos", "lados", "falado", "fofo",
  "fofa", "dose", "aço", "lojas", "selo", "laço", "laços", "assado", "elo", "soda", "soja", "ser", "era", "falar", "fora", "dar",
  "errado", "força", "real", "dor", "ar", "erro", "ler", "adoro", "ora", "errada", "flores", "flor", "redor", "lar", "rosa",
  "erros", "rede", "ferro", "esforço", "sofrer", "raça", "frase", "rodas", "roda", "solar", "raro", "desejar", "forças", "isso",
  "foi", "sei", "disse", "ir", "dia", "dois", "disso", "oi", "sair", "seria", "dias", "sido", "ali", "ideia", "ia", "saia",
  "iria", "faria", "seis", "rei", "falei", "ai", "sai", "idade", "farei", "diria", "lei", "dei", "frio", "lidar", "rio",
  "realidade", "desafio", "rir", "raio", "sorriso", "fila", "areia", "ideias", "leis", "feio", "aldeia", "fria", "fio", "ideal",
  "risos", "feira", "fiel", "sorrir", "ferida", "feijoada", "sejam", "em", "me", "mas", "sim", "mais", "mim", "mesmo", "assim",
  "sem", "amor", "foram", "somos", "meio", "medo", "forma", "demais", "mesma", "maior", "meses", "dormir", "mil", "filme", "mesa",
  "modo", "fome", "mar", "alma", "jamais", "meia", "som", "tem", "te", "ter", "todos", "temos", "estamos", "esta", "este", "isto",
  "todo", "estar", "toda", "todas", "jeito", "sorte", "feito", "terra", "tarde", "festa", "forte", "falta", "direito", "mostrar",
  "resto", "alto", "alta", "tio", "tia", "rosto", "foto", "fotos", "lista", "metade", "triste", "sete", "time", "estrada",
  "teste", "trem", "oito", "arte", "estrela", "direita", "no", "na", "nos", "nada", "onde", "ainda", "noite", "anos", "ano",
  "antes", "nem", "nossa", "nome", "nosso", "menos", "entre", "frente", "dentro", "momento", "tanto", "semana", "entrar", "ontem",
  "maneira", "jantar", "telefone", "sentir", "diferente", "final", "linda", "lindo", "mente", "menina", "menino", "entender",
  "sinal", "andar", "normal", "terminar", "monte", "destino", "norte", "sentar", "animais", "janela", "inteiro", "tanta",
  "mentira", "enorme", "entrada", "nomes", "sanfona", "eu", "um", "uma", "meu", "seu", "muito", "sua", "estou", "tudo", "ou",
  "sou", "seus", "mundo", "suas", "outro", "meus", "outra", "ajudar", "duas", "outros", "ajuda", "juntos", "minutos", "minuto",
  "usar", "muitas", "muita", "muitos", "durante", "ruim", "mudar", "futuro", "rua", "fundo", "lutar", "luta", "assunto", "junto",
  "duro", "aula", "lua", "sul", "junina", "junino", "não", "então", "são", "estão", "tão", "mãe", "irmão", "irmã", "irmãos",
  "irmãs", "mãos", "mão", "mamãe", "atenção", "situação", "reunião", "missão", "informação", "relação", "ação", "direção",
  "estação", "sensação", "lição", "ladrão", "solução", "fã", "fãs", "reação", "salão", "nação", "mães", "união", "refeição",
  "tradição", "emoção", "leão", "maçã", "eleição", "função", "oração", "mutirão", "informações", "ações", "relações",
  "instruções", "emoções", "situações", "nações", "eleições", "estações", "missões", "com", "como", "certo", "coisa", "nunca",
  "casa", "cara", "ficar", "claro", "coisas", "carro", "cidade", "cada", "encontrar", "crianças", "criança", "cima", "contar",
  "cuidado", "começar", "escola", "causa", "cinco", "acontecer", "acordo", "cama", "cedo", "controle", "local", "acidente",
  "carta", "cair", "centro", "carne", "cliente", "costas", "correr", "doce", "cerca", "cena", "cantar", "cor", "cocada",
  "acerola", "tucano", "canjica", "coração", "decisão", "cartão", "cão", "cães", "canção", "condição", "educação", "construção",
  "coleção", "cidadão", "criação", "macarrão", "condições", "decisões", "corações", "cartões", "canções", "comunicações", "para",
  "por", "pode", "posso", "tempo", "pai", "sempre", "parece", "depois", "pessoas", "pouco", "pelo", "preciso", "apenas",
  "precisa", "podemos", "pela", "tipo", "primeiro", "primeira", "parte", "pessoa", "perto", "papai", "porta", "pronto",
  "importante", "passar", "parar", "corpo", "poder", "pois", "pensar", "esperar", "culpa", "plano", "ponto", "passado", "pedir",
  "especial", "comprar", "presente", "perfeito", "respeito", "partir", "simples", "professor", "campo", "surpresa", "resposta",
  "espaço", "roupas", "roupa", "papel", "apartamento", "procurar", "peça", "planeta", "passo", "aprender", "empresa", "paçoca",
  "peteca", "praia", "posição", "pressão", "opinião", "perdão", "operação", "proteção", "pão", "apresentação", "opção", "padrão",
  "porão", "campeão", "portão", "preocupação", "respiração", "população", "profissão", "capitão", "pirão", "põe", "opções",
  "operações", "posições", "preocupações", "opiniões", "portões", "apresentações", "vai", "vamos", "vou", "ver", "favor", "vida",
  "verdade", "deve", "novo", "nova", "volta", "voltar", "veja", "levar", "vir", "ouvir", "viver", "vivo", "conversar", "jovem",
  "palavra", "palavras", "livro", "livros", "livre", "salvar", "vontade", "povo", "conversa", "serviço", "divertido", "prova",
  "verdadeiro", "cavalo", "vestido", "escrever", "resolver", "capivara", "frevo", "vão", "avião", "verão", "visão", "televisão",
  "versão", "avaliação", "evolução", "aviões", "tamanduá", "está", "já", "lá", "até", "será", "olá", "sério", "atrás", "rápido",
  "rápida", "dá", "fácil", "além", "café", "médico", "médica", "pé", "pés", "aniversário", "céu", "área", "através", "época",
  "várias", "vários", "necessário", "contrário", "série", "rádio", "responsável", "árvore", "árvores", "prédio", "fé", "férias",
  "fantástico", "espécie", "armário", "crédito", "século", "confortável", "sofá", "pássaro", "remédio", "saudável", "diário",
  "mistério", "salário", "médio", "palácio", "secretária", "matéria", "provável", "máscara", "matemática", "técnica",
  "espetáculo", "média", "análise", "prática", "plástico", "clássico", "células", "satélite", "estátua", "cenário", "método",
  "cajá", "acarajé", "vatapá", "tacacá", "só", "nós", "aí", "ótimo", "ótima", "família", "difícil", "polícia", "última", "único",
  "única", "música", "número", "possível", "incrível", "último", "país", "escritório", "após", "própria", "próprio", "daí",
  "notícia", "notícias", "impossível", "terrível", "saúde", "nível", "líder", "espírito", "dúvida", "vídeo", "início", "memória",
  "política", "avó", "vitória", "príncipe", "dói", "útil", "inútil", "óculos", "mínimo", "período", "músicas", "estúdio", "cópia",
  "física", "açúcar", "paraíso", "clínica", "pó", "edifício", "território", "veículo", "óleo", "título", "túnel", "sensível",
  "círculo", "princípio", "países", "petróleo", "mídia", "capítulo", "típico", "específico", "açaí", "jiló", "forró", "cipó",
  "cuíca", "tuiuiú", "vovó", "júri", "saída", "você", "vocês", "três", "têm", "dê", "vê", "mês", "silêncio", "prêmio", "ciência",
  "ciências", "francês", "consciência", "aparência", "paciência", "tênis", "influência", "conferência", "japonês", "residência",
  "ausência", "inocência", "referência", "assistência", "independência", "tendência", "vêm", "lê", "crê", "comitê", "ipê", "ipês",
  "câmera", "pôr", "avô", "vovô", "pôde", "pânico", "importância", "romântico", "cerimônia", "trânsito", "metrô", "colônia",
  "lâmpada", "mecânico", "incômodo", "lâmina", "pântano", "alô", "camelô", "que", "aqui", "quando", "quer", "quem", "quero",
  "porque", "qual", "queria", "quanto", "qualquer", "enquanto", "quase", "quarto", "quatro", "equipe", "pequeno", "pequena",
  "quente", "esquerda", "quindim", "questão", "máquina", "porquê", "frequência", "sequência", "química", "quilômetros",
  "questões", "minha", "tenho", "acho", "melhor", "senhor", "senhora", "tinha", "homem", "hoje", "dinheiro", "filho", "filha",
  "hora", "horas", "mulher", "venha", "olha", "olhar", "nenhum", "minhas", "caminho", "olhos", "chefe", "velho", "velha",
  "chamar", "escolha", "linha", "sonho", "hotel", "conselho", "chave", "chuva", "folha", "folhas", "humor", "hospital", "ilha",
  "joelho", "julho", "junho", "mochila", "milho", "rainha", "vermelho", "coelho", "chocolate", "pamonha", "manhã", "chão",
  "caminhão", "milhão", "amanhã", "chimarrão", "pinhão", "há", "chá", "chapéu", "horário", "chinês", "história", "horrível",
  "herói", "histórico", "sanduíche", "milhões", "manteiga", "agora", "algo", "lugar", "comigo", "alguma", "grande", "algum",
  "amigo", "amiga", "amigos", "alguns", "gosto", "gente", "logo", "legal", "algumas", "chegar", "jogo", "jogar", "longe",
  "sangue", "segundo", "pergunta", "perguntar", "segurança", "pagar", "ligar", "fogo", "ganhar", "engraçado", "seguro", "grupo",
  "viagem", "emprego", "energia", "governo", "igreja", "segredo", "igual", "gato", "gata", "gelo", "garrafa", "geladeira",
  "grama", "tigre", "jogador", "pitanga", "ligação", "dragão", "imaginação", "região", "alguém", "ninguém", "água", "agradável",
  "gás", "página", "colégio", "mágico", "estratégia", "guaraná", "emergência", "inglês", "gênio", "inteligência", "agência",
  "gênero", "gêmeos", "negócio", "código", "relógio", "língua", "glória", "estômago", "ligações", "ângulo", "gerações", "fôlego",
  "bem", "sabe", "bom", "sobre", "obrigado", "obrigada", "boa", "trabalho", "saber", "problema", "cabeça", "boca", "bastante",
  "descobrir", "cabelo", "bonito", "bonita", "beber", "abrir", "banco", "banheiro", "barco", "bebida", "bola", "branco", "branca",
  "bolo", "braço", "banda", "bolsa", "trabalhar", "cobra", "bicicleta", "bairro", "biblioteca", "brincar", "brincadeira",
  "brinquedo", "bandeira", "futebol", "batucada", "berimbau", "bandeirinha", "botão", "tubarão", "também", "parabéns", "cérebro",
  "sábado", "fábrica", "lábios", "sábio", "hábito", "sabiá", "bebê", "sobrevivência", "bebês", "público", "pública",
  "laboratório", "óbvio", "combustível", "símbolo", "república", "ônibus", "ambulância", "robô", "robôs", "bônus", "botões",
  "substância", "fazer", "dizer", "talvez", "vez", "vezes", "faz", "fez", "certeza", "diz", "feliz", "fiz", "sozinho", "sozinha",
  "prazer", "paz", "luz", "voz", "dez", "trazer", "rapaz", "beleza", "capaz", "cozinha", "cozinhar", "azul", "juiz", "natureza",
  "nariz", "luzes", "traz", "vazio", "vazia", "amizade", "fazenda", "pizza", "zero", "zona", "vizinho", "vizinhos", "cruz",
  "arroz", "atriz", "doze", "vozes", "tristeza", "limpeza", "razão", "organização", "armazém", "dúzia", "razões", "deixar",
  "deixe", "exatamente", "trouxe", "baixo", "baixa", "existe", "caixa", "explicar", "lixo", "exemplo", "excelente", "peixe",
  "peixes", "abaixo", "debaixo", "exato", "exame", "extra", "mexer", "puxar", "bruxa", "sexta", "mexerica", "paixão",
  "explicação", "máximo", "táxi", "galáxia", "experiência", "oxigênio", "existência", "êxito", "próximo", "próxima", "xícara",
  "exercício", "xodó", "à", "às", "àquela", "àquele", "àqueles", "àquelas", "yoga", "hobby", "byte", "bytes", "show", "shows",
  "kiwi", "kiwis", "web", "software", "download", "downloads", "watt",
];

/** Der Themenwortschatz je Inhaltsstufe (Kinder 128, Jugend 70, Erwachsene 59). */
export const STUFE_VOCAB_BR: Record<InhaltsStufe, string[]> = {
  kids: [
    "escola", "sala", "professora", "professor", "caderno", "lápis", "borracha", "caneta", "mochila", "estojo", "régua", "lousa",
    "recreio", "merenda", "quadra", "turma", "colega", "amigo", "amiga", "livro", "história", "desenho", "pintura", "brinquedo",
    "boneca", "bola", "pipa", "peteca", "pião", "bicicleta", "patinete", "balanço", "escorregador", "gangorra", "esconde-esconde",
    "amarelinha", "capivara", "onça", "tatu", "tamanduá", "tucano", "arara", "jacaré", "tuiuiú", "sabiá", "papagaio", "tartaruga",
    "golfinho", "boto", "preguiça", "jabuti", "borboleta", "formiga", "abelha", "joaninha", "vaga-lume", "sapo", "peixe", "gato",
    "cão", "coelho", "pássaro", "banana", "manga", "caju", "goiaba", "maracujá", "abacaxi", "melancia", "mamão", "laranja", "açaí",
    "pitanga", "jabuticaba", "brigadeiro", "pipoca", "pamonha", "canjica", "bolo", "suco", "sorvete", "picolé", "tapioca", "pão",
    "arroz", "feijão", "praia", "mar", "onda", "areia", "concha", "coqueiro", "rio", "floresta", "árvore", "flor", "chuva", "sol",
    "lua", "estrela", "nuvem", "arco-íris", "vento", "carnaval", "fantasia", "confete", "quadrilha", "fogueira", "bandeirinha",
    "aniversário", "presente", "vela", "família", "mãe", "pai", "avó", "avô", "irmão", "irmã", "tio", "tia", "primo", "prima",
    "bebê", "casa", "quintal", "rede", "varanda",
  ],
  teens: [
    "amizade", "confiança", "respeito", "segredo", "turma", "grupo", "trabalho", "prova", "nota", "boletim", "redação", "pesquisa",
    "projeto", "feira", "laboratório", "experiência", "biblioteca", "vestibular", "matemática", "geografia", "história", "física",
    "química", "biologia", "música", "banda", "show", "violão", "bateria", "samba", "sertanejo", "funk", "forró", "podcast",
    "celular", "aplicativo", "internet", "senha", "mensagem", "vídeo", "jogo", "computador", "futebol", "vôlei", "skate", "surfe",
    "natação", "capoeira", "medalha", "campeonato", "torcida", "paralimpíada", "atleta", "treino", "reciclagem", "ambiente",
    "floresta", "desmatamento", "clima", "energia", "solar", "viagem", "ônibus", "mochila", "acampamento", "futuro", "profissão",
    "estágio", "curso", "sonho",
  ],
  erwachsen: [
    "trabalho", "empresa", "reunião", "cliente", "salário", "contrato", "carteira", "imposto", "aluguel", "condomínio", "boleto",
    "conta", "banco", "cartório", "documento", "identidade", "posto", "consulta", "exame", "vacina", "farmácia", "receita",
    "aposentadoria", "previdência", "prefeitura", "benefício", "currículo", "sindicato", "eleição", "urna", "cidadania",
    "democracia", "direitos", "igualdade", "inclusão", "acessibilidade", "transporte", "metrô", "rodoviária", "trânsito", "obra",
    "mercado", "feira", "agricultura", "cooperativa", "comércio", "turismo", "economia", "inflação", "notícia", "jornal",
    "entrevista", "cultura", "museu", "teatro", "cinema", "patrimônio", "universidade", "migração",
  ],
};
