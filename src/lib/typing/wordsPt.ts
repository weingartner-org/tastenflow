/**
 * ★ D-LERNDATEN (25.10.2026): DER ÜBUNGSWORTSCHATZ des Weges „pt" (Portugiesisch (Portugal)) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/pt-PT/tf-fest-pt-PT.json`, Schlüssel `stufenWoerter` und `wortschatz` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja (für den Bau) - Vorbehalt: Lese-Abnahme durch eine Person aus Portugal; Wurzeln und Buchstabenfolgen liegen mengenmäßig unter der Vorlage.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wordsCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Portugiesisch (Portugal) als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ REIHENFOLGE: Die Wörter stehen in der Reihenfolge der Quelle - sortiert nach der Lern-Folge des Bauplans
 * (`BAUPLAN-2026-10-25-PT.md`), Stufe für Stufe. Die endgültige `PT_LETTER_ORDER` kommt erst mit F4 (`lernweg.ts`); bis dahin ist
 * der Weg ein Alias von „en", und `filterWords` lässt nur durch, was mit den englischen Einheiten tippbar ist. Nach F4: neu nach
 * Sprosse sortieren und die Kontingente je Sprosse prüfen (der Wächter „jedes Wort einer Stufe ist tippbar" liest die Folge aus
 * `lernweg.ts` und läuft, sobald sie dort steht). Das Vorlese-Lexikon liest diese Liste noch nicht (eigenes Fach: F8).
 *
 * Verteiler: `geruestWoerter.ts` ⇒ `generator.ts` (`WORD_BASE`, `STUFE_VOCAB_TABLE`), `uebungsformen/hilfen.ts` (`wortquelle`), `uebungsformen/pyramide.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?portugiesisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-pt.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { InhaltsStufe } from "./account";

/** Die Übungswörter des Weges „pt", klein, in der Lern-Folge der Quelle (1168 Wörter). */
export const WORDS_PT: string[] = [
  "a", "da", "as", "das", "sala", "salas", "fala", "falas", "asa", "asas", "sal", "salada", "saladas", "falsa", "falsas", "alfa",
  "ala", "alas", "fada", "fadas", "dada", "dadas", "assada", "assadas", "salsa", "alça", "alças", "faça", "faças", "de", "e",
  "se", "ele", "ela", "eles", "dele", "essa", "esse", "dela", "seja", "desde", "deles", "elas", "essas", "esses", "dessa",
  "desse", "delas", "fale", "fase", "fases", "deseja", "leal", "seda", "sela", "sede", "o", "do", "os", "ao", "dos", "lado",
  "aos", "fosse", "faço", "sol", "loja", "falo", "dados", "dado", "desejo", "dedo", "dedos", "falso", "solo", "lados", "soa",
  "falado", "aço", "lojas", "laço", "laços", "selo", "selos", "fofo", "fofa", "assado", "elo", "soda", "sola", "desejos", "soja",
  "ser", "era", "falar", "fora", "dar", "força", "errado", "ar", "adoro", "real", "erro", "ler", "dor", "ora", "seres", "errada",
  "flores", "forças", "rede", "lar", "erros", "adorar", "ferro", "adora", "rosa", "esforço", "raça", "frase", "desejar", "rodas",
  "redor", "flor", "doer", "solar", "raro", "rosas", "ares", "forçar", "isso", "foi", "sei", "disse", "ir", "dia", "dois",
  "disso", "sair", "ali", "dias", "ideia", "sido", "seria", "raio", "sai", "seis", "rei", "raios", "faria", "iria", "ai", "idade",
  "lei", "falei", "diria", "saia", "frio", "lidar", "ideias", "irei", "realidade", "dei", "rio", "farei", "serei", "rir",
  "aldeia", "fila", "sorriso", "leis", "areia", "desafio", "fio", "fria", "feio", "daria", "reais", "sorrir", "ideal", "feira",
  "feia", "florida", "lido", "reis", "fiel", "fios", "loira", "adiar", "desfile", "mas", "em", "sim", "mais", "me", "mesmo",
  "mim", "assim", "sem", "mal", "forma", "amor", "somos", "foram", "mesma", "dormir", "fim", "eram", "maior", "meio", "meses",
  "mil", "demais", "filme", "ordem", "mesa", "mar", "almoço", "jardim", "mel", "amarelo", "isto", "tem", "te", "ter", "esta",
  "todos", "este", "temos", "ti", "estamos", "estar", "toda", "todo", "tarde", "tal", "desta", "estes", "feito", "sorte", "estas",
  "terra", "deste", "festa", "teria", "tomar", "tirar", "falta", "forte", "direito", "lista", "alto", "tio", "tia", "tomate",
  "leite", "metro", "kit", "no", "na", "onde", "nada", "nos", "tens", "ainda", "noite", "nem", "anos", "antes", "nosso", "nossa",
  "nome", "tentar", "menos", "nas", "dentro", "anda", "entre", "momento", "frente", "entrar", "tanto", "maneira", "sinto",
  "neste", "ano", "nossos", "semana", "ontem", "andar", "nesta", "jantar", "telefone", "menina", "nossas", "sentir", "diferente",
  "semanas", "manter", "entendo", "final", "normal", "janela", "dente", "dentes", "nadar", "sinal", "linda", "laranja",
  "laranjas", "um", "eu", "uma", "meu", "muito", "estou", "tudo", "tu", "ou", "sou", "seu", "sua", "tua", "teu", "outra", "num",
  "meus", "outro", "mundo", "numa", "seus", "duas", "uns", "ajudar", "durante", "outros", "suas", "ajuda", "minutos", "teus",
  "juntos", "usar", "altura", "umas", "muitas", "muitos", "tuas", "muita", "outras", "mudar", "minuto", "rua", "futuro", "fundo",
  "sul", "sumo", "fruta", "lua", "aluno", "aluna", "alunos", "turma", "atum", "outono", "não", "então", "são", "estão", "tão",
  "mãe", "irmão", "mãos", "mão", "irmã", "atenção", "situação", "informação", "reunião", "serão", "irmãos", "estação", "solução",
  "intenção", "lição", "irmãs", "nação", "mães", "união", "salão", "direção", "multidão", "tradição", "formação", "alemão",
  "limão", "feijão", "natação", "refeição", "melão", "salmão", "lã", "romã", "informações", "relações", "instruções", "emoções",
  "reuniões", "intenções", "instalações", "situações", "nações", "lições", "funções", "refeições", "sessões", "leões", "limões",
  "com", "como", "coisa", "casa", "nunca", "certo", "coisas", "ficar", "claro", "carro", "caso", "fica", "cidade", "encontrar",
  "cima", "contra", "cada", "acontecer", "causa", "conta", "cuidado", "cinco", "escola", "calma", "acordo", "crianças", "contar",
  "cama", "continuar", "criança", "facto", "carta", "caneta", "caderno", "cadeira", "caracol", "cantar", "cortiça", "cinema",
  "oceano", "castelo", "doce", "manjerico", "manjericos", "coração", "cão", "decisão", "cartão", "cães", "canção", "educação",
  "comunicação", "condição", "construção", "ecrã", "camião", "condições", "cartões", "corações", "canções", "recordações",
  "camiões", "para", "por", "pode", "posso", "tempo", "pai", "depois", "sempre", "pessoas", "pelo", "parece", "tipo", "preciso",
  "podes", "apenas", "espera", "podemos", "pouco", "pois", "pela", "desculpa", "pensar", "passa", "parte", "primeiro", "pensei",
  "podem", "pessoa", "podia", "pronto", "passar", "precisa", "primeira", "porta", "espero", "pessoal", "perto", "corpo",
  "procura", "parar", "pais", "perder", "esperar", "pena", "penso", "pedir", "plano", "passado", "depressa", "partir", "especial",
  "roupa", "professor", "professora", "papel", "sopa", "pato", "copo", "sapatos", "praia", "piscina", "pera", "pescar", "pastel",
  "padaria", "porto", "ponte", "computador", "posição", "opinião", "pressão", "pão", "campeão", "portão", "produção",
  "competição", "população", "capitão", "pião", "põe", "opções", "posições", "portões", "opiniões", "põem", "vamos", "vai", "vou",
  "estava", "ver", "favor", "vida", "vais", "verdade", "deve", "volta", "novo", "voltar", "vem", "vi", "nova", "vir", "ouvir",
  "levar", "viver", "vejo", "vivo", "livro", "livros", "palavra", "visto", "escrever", "cavalo", "vento", "verde", "polvo",
  "voar", "vela", "cravo", "cravos", "caravela", "primavera", "inverno", "nuvem", "vão", "avião", "televisão", "verão", "visão",
  "diversão", "versão", "revolução", "aviões", "verões", "é", "está", "já", "estás", "lá", "até", "és", "olá", "cá", "vá",
  "sério", "será", "atrás", "dá", "rápido", "fácil", "além", "trás", "médico", "médica", "irá", "café", "pé", "fantástico",
  "através", "céu", "pés", "aniversário", "área", "contrário", "responsável", "necessário", "série", "rádio", "várias", "férias",
  "simpático", "simpática", "árvore", "árvores", "época", "secretária", "prédio", "prémio", "século", "sofá", "confortável",
  "diário", "saudável", "papéis", "pássaro", "pássaros", "máscara", "mistério", "palácio", "matemática", "porém", "média",
  "plástico", "satélite", "salário", "técnica", "espetáculo", "amável", "ténis", "pátio", "lápis", "estádio", "maré", "jacaré",
  "pastéis", "karaté", "académico", "só", "nós", "aí", "família", "polícia", "ótimo", "difícil", "última", "única", "número",
  "possível", "único", "próprio", "país", "sítio", "música", "miúda", "último", "miúdo", "própria", "notícias", "após", "miúdos",
  "incrível", "telemóvel", "impossível", "daí", "saída", "avó", "saúde", "nível", "dúvida", "início", "memória", "vídeo",
  "edifício", "líder", "notícia", "números", "príncipe", "vitória", "útil", "famílias", "princípio", "óculos", "mínimo",
  "episódio", "pó", "dúvidas", "memórias", "estúdio", "superfície", "açúcar", "física", "veículo", "disponível", "túnel",
  "cerimónia", "músicas", "vídeos", "lençóis", "ópera", "sótão", "económico", "fenómeno", "rúcula", "cópia", "que", "aqui",
  "porque", "quando", "quem", "quero", "quer", "queres", "qualquer", "qual", "queria", "daqui", "quanto", "aquele", "querida",
  "aquilo", "quase", "enquanto", "aquela", "quarto", "equipa", "quatro", "pequeno", "parque", "queijo", "quinta", "quente",
  "questão", "máquina", "quilómetro", "questões", "minha", "tenho", "acho", "melhor", "tinha", "homem", "senhor", "senhora",
  "dinheiro", "hoje", "mulher", "filho", "filha", "olha", "hora", "homens", "horas", "nenhum", "minhas", "caminho", "olhos",
  "chefe", "mulheres", "filhos", "olhar", "velho", "hospital", "haver", "chamar", "melhores", "linha", "escolha", "conhecer",
  "hotel", "olho", "sonho", "chave", "ilha", "vermelho", "chuva", "ovelha", "coelho", "mochila", "chocolate", "sardinha",
  "sardinhas", "horta", "amanhã", "manhã", "chão", "hortelã", "há", "chá", "chapéu", "horário", "chávena", "história", "hipótese",
  "herói", "histórias", "sanduíche", "milhões", "agora", "alguma", "algo", "comigo", "grande", "consigo", "amigo", "amiga",
  "contigo", "lugar", "algum", "gosto", "amigos", "gente", "chegar", "alguns", "algumas", "jogo", "logo", "segurança", "segundo",
  "chega", "longe", "conseguir", "pergunta", "gostava", "gosta", "pagar", "seguir", "gostaria", "ligar", "fogo", "ganhar",
  "jogar", "perguntas", "grandes", "perguntar", "grupo", "viagem", "emprego", "programa", "gostar", "energia", "segunda",
  "proteger", "segundos", "segredo", "gelo", "golfinho", "golfinhos", "gaivota", "gaivotas", "gato", "gatos", "golo", "legumes",
  "cegonha", "morango", "ligação", "região", "imaginação", "algodão", "alguém", "ninguém", "água", "agradável", "género",
  "página", "mágico", "ginásio", "águia", "negócio", "código", "relógio", "língua", "glória", "frigorífico", "vírgula",
  "ligações", "gerações", "bem", "bom", "sobre", "obrigado", "obrigada", "sabes", "boa", "sabe", "trabalho", "saber", "embora",
  "problema", "cabeça", "trabalhar", "sabemos", "acabar", "brincar", "descobrir", "bastante", "beber", "boca", "banho", "ambos",
  "cabelo", "bonito", "bonita", "bocado", "abrir", "barco", "banco", "lembro", "bela", "bola", "clube", "comboio", "borboleta",
  "baleia", "abelha", "bicicleta", "biblioteca", "borracha", "bolo", "bolacha", "banana", "bilhete", "batata", "cebola", "botão",
  "tubarão", "balão", "sabão", "também", "bebé", "parabéns", "cérebro", "sábado", "fábrica", "boné", "público", "laboratório",
  "óbvio", "pública", "baú", "sílaba", "botões", "fazer", "dizer", "vez", "talvez", "faz", "certeza", "diz", "vezes", "fez",
  "fiz", "feliz", "rapaz", "rapazes", "prazer", "paz", "sozinho", "dizem", "fazem", "luz", "fazemos", "dez", "capaz", "sozinha",
  "voz", "trazer", "zona", "cozinha", "traz", "azul", "natureza", "nariz", "felizes", "beleza", "luzes", "zero", "amizade",
  "vizinhos", "cozinhar", "limpeza", "vazio", "azuis", "onze", "quinze", "catorze", "treze", "dezanove", "dezassete", "dezasseis",
  "dezoito", "arroz", "dezembro", "zebra", "zangado", "azeite", "azeitona", "azeitonas", "azulejo", "azulejos", "cozido",
  "cozinheiro", "razão", "organização", "armazém", "razões", "cêntimo", "quê", "têm", "três", "porquê", "vê", "vês", "mês", "vêm",
  "silêncio", "inglês", "emergência", "ciência", "francês", "incêndio", "agência", "paciência", "inteligência", "resistência",
  "conferência", "lê", "frequência", "chinês", "influência", "aparência", "residência", "ausência", "sequência", "português",
  "assistência", "urgência", "holandês", "pêssego", "amêndoa", "amêndoas", "amêijoa", "amêijoas", "japonês", "freguês",
  "ciências", "pôr", "câmara", "avô", "distância", "pôs", "importância", "estômago", "infância", "romântico", "trânsito",
  "lâmina", "ângulo", "romântica", "lâmpada", "fôlego", "câmbio", "mecânico", "lâmpadas", "champô", "bisavô", "avôs", "deixar",
  "baixo", "exatamente", "deixa", "existe", "deixou", "caixa", "trouxe", "explicar", "debaixo", "abaixo", "exemplo", "lixo",
  "peixe", "mexer", "extra", "queixa", "caixas", "exterior", "exame", "exames", "xadrez", "xarope", "xaile", "explicação",
  "paixão", "máximo", "táxi", "experiência", "existência", "excelência", "êxito", "próxima", "próximo", "exercício", "à", "às",
  "àquele", "àquela", "àqueles", "àquelas", "àquilo", "yoga", "hobby", "rugby", "kiwi", "web", "show", "shows", "watt",
  "workshop", "software",
];

/** Der Themenwortschatz je Inhaltsstufe (Kinder 140, Jugend 71, Erwachsene 67). */
export const STUFE_VOCAB_PT: Record<InhaltsStufe, string[]> = {
  kids: [
    "escola", "turma", "professora", "caderno", "lápis", "borracha", "mochila", "estojo", "régua", "recreio", "intervalo", "lanche",
    "sumo", "gelado", "rebuçado", "bolacha", "pastel", "bolo", "pão", "queijo", "sopa", "fruta", "maçã", "pera", "laranja",
    "morango", "cereja", "banana", "uva", "melancia", "gato", "cão", "coelho", "tartaruga", "peixe", "pássaro", "golfinho",
    "baleia", "gaivota", "cegonha", "lince", "ouriço", "esquilo", "coruja", "raposa", "lobo", "abelha", "borboleta", "joaninha",
    "caracol", "polvo", "sardinha", "praia", "areia", "onda", "concha", "mar", "barco", "farol", "ilha", "sol", "lua", "estrela",
    "nuvem", "chuva", "neve", "vento", "árvore", "flor", "jardim", "parque", "baloiço", "escorrega", "bola", "bicicleta",
    "trotinete", "boneca", "puzzle", "jogo", "brinquedo", "papagaio", "pião", "berlinde", "corda", "golo", "futebol", "natação",
    "piscina", "avó", "avô", "mãe", "pai", "irmão", "irmã", "primo", "prima", "tio", "tia", "bebé", "amigo", "amiga", "casa",
    "quarto", "cama", "janela", "porta", "cozinha", "sala", "mesa", "cadeira", "televisão", "livro", "história", "desenho", "cor",
    "azul", "verde", "vermelho", "amarelo", "branco", "preto", "rosa", "roxo", "castanho", "aniversário", "prenda", "festa", "vela",
    "balão", "manjerico", "arraial", "carnaval", "máscara", "presépio", "comboio", "autocarro", "elétrico", "castelo", "moinho",
    "ponte",
  ],
  teens: [
    "amizade", "confiança", "respeito", "segredo", "telemóvel", "mensagem", "ecrã", "aplicação", "internet", "computador",
    "teclado", "rato", "ficheiro", "pasta", "utilizador", "auscultadores", "música", "concerto", "banda", "guitarra", "fado",
    "festival", "cinema", "série", "filme", "desporto", "treino", "equipa", "campeonato", "adepto", "surf", "prancha", "viagem",
    "exame", "teste", "nota", "matemática", "português", "inglês", "ciências", "geografia", "biblioteca", "projeto", "trabalho",
    "apresentação", "explicações", "secundário", "ensino", "futuro", "profissão", "curso", "universidade", "ambiente", "reciclagem",
    "clima", "energia", "floresta", "incêndio", "voluntariado", "opinião", "debate", "notícia", "jornal", "fotografia",
    "ilustração", "sonho", "emoção", "coragem", "liberdade", "igualdade", "cidadania",
  ],
  erwachsen: [
    "emprego", "empresa", "escritório", "reunião", "cliente", "salário", "contrato", "fatura", "recibo", "imposto", "finanças",
    "contribuinte", "banco", "conta", "crédito", "renda", "senhorio", "condomínio", "mudança", "consulta", "farmácia", "receita",
    "urgência", "saúde", "câmara", "junta", "freguesia", "município", "cartão", "cidadão", "documento", "certidão", "requerimento",
    "formulário", "seguro", "pensão", "reforma", "eleições", "governo", "parlamento", "tribunal", "advogado", "notário", "economia",
    "inflação", "mercado", "supermercado", "talho", "peixaria", "despesa", "orçamento", "poupança", "transporte", "portagem",
    "autoestrada", "estacionamento", "combustível", "eletricidade", "condutor", "habitação", "inquilino", "agricultura", "turismo",
    "cortiça", "pesca", "vindima", "azeite",
  ],
};
