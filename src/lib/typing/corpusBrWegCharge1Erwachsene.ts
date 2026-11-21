/**
 * Korpus des Weges „br" (Portugiesisch (Brasilien)), Charge 1 - Erwachsene (K-BR, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
 *
 * Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/pt-BR.jsonl` (je Altersgruppe 30 Sätze und 10 Absätze, neu in der
 * Sprache verfasst, `quelle: "eigen"`), geprüft von einem zweiten Prüfer (`PRUEFBERICHT-pt-BR.md`: freigabefähig).
 * Der Text ist unverändert übernommen. Zuordnung: `alter` ⇒ `stufen`, `thema` ⇒ `topic`, `weg` ⇒ `nurWeg`; die Kennung
 * der Quelle steht als Kommentar hinter jeder Zeile.
 *  · Absätze (`art: "absatz"`) sind an den Satzgrenzen in ihre Sätze geteilt (`<id>.1`, `<id>.2` …): Korpus-Zeilen sind einzelne
 *    Übungszeilen (die längste der acht Wege davor hat 130 Zeichen), mehrsätzige Geschichten sind Serien. Kein Wort geändert.
 *  · Selbst verfasst ⇒ ohne `herkunft` (wie die Chargen von it/pl/tr/cs; `herkunft` ist für ÜBERNOMMENE Texte).
 *  · `minTier` = `minTierFor(text, "br")` nach der eigenen Lern-Folge des Weges (`lernweg.ts`, F4), Bezugstastatur `br-abnt2`.
 * Wächter: `tests/tastenflow-texte-br-charge1.test.ts`. Nur HINTEN anhängen (Anker, `corpusBr.ts`).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_BR_WEG_CHARGE1_ERWACHSENE: CorpusItem[] = [
  { text: "Em Manaus, a enfermeira Rosana atende pacientes de comunidades ribeirinhas pelo SUS.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Gesundheit/Arbeit" }, // pt-BR-c1-081
  { text: "O Raimundo regularizou o CPF pela internet antes de abrir a pequena loja em Belém.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Behörden" }, // pt-BR-c1-082
  { text: "No mercado de Belém, a dona Lúcia vende ervas e temperos e conversa com cada freguês.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Arbeit/Alltag" }, // pt-BR-c1-083
  { text: "O aluguel do apartamento em Porto Velho subiu, e o casal refez o orçamento do mês.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Wohnen" }, // pt-BR-c1-084
  { text: "Em Rio Branco, a técnica Jéssica usa cadeira de rodas e coordena o suporte de informática.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Arbeit/Behinderung" }, // pt-BR-c1-085
  { text: "Depois do trabalho, o Wellington faz aula de violão no centro cultural de Macapá.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Kultur" }, // pt-BR-c1-086
  { text: "A Yusleidy chegou da Venezuela a Boa Vista há um ano e trabalha numa padaria do bairro.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Migration/Behörden" }, // pt-BR-c1-087.1
  { text: "Nesta semana, ela foi ao posto de atendimento para ativar a carteira de trabalho digital.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Migration/Behörden" }, // pt-BR-c1-087.2
  { text: "A atendente explicou cada etapa com calma, e a Yusleidy saiu de lá com o documento funcionando no celular.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Migration/Behörden" }, // pt-BR-c1-087.3
  { text: "No dia do Círio de Nazaré, o Fábio acorda cedo e caminha com a família pelas ruas de Belém.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Feste/Familie" }, // pt-BR-c1-088.1
  { text: "Ele não segura a corda, mas distribui água para quem passa.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Feste/Familie" }, // pt-BR-c1-088.2
  { text: "À tarde, todos se reúnem na casa da tia para o almoço com pato no tucupi, prato que a família prepara há gerações.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Feste/Familie" }, // pt-BR-c1-088.3
  { text: "Em Fortaleza, a Francisca trabalha como programadora e faz reuniões com clientes de outros estados.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit/Technik" }, // pt-BR-c1-089
  { text: "O seu Severino se aposentou e agora dá aulas de xilogravura em Juazeiro do Norte.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Kultur" }, // pt-BR-c1-090
  { text: "A Adriana marcou a consulta no posto de saúde de Olinda pelo aplicativo da prefeitura.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Gesundheit" }, // pt-BR-c1-091
  { text: "Na casa nova em Aracaju, o Marcos instalou uma caixa d'água maior antes do verão.", kind: "satz", stufen: ["erwachsen"], minTier: 4, nurWeg: "br", topic: "Wohnen" }, // pt-BR-c1-092
  { text: "O Luiz, fisioterapeuta com deficiência visual, atende pacientes numa clínica de Mossoró.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit/Behinderung" }, // pt-BR-c1-093
  { text: "Na orla de Salvador, a Joelma vende acarajé e aceita pagamento por Pix.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit" }, // pt-BR-c1-094
  { text: "A cooperativa de mulheres de um povoado perto de Garanhuns produz doce de leite e queijo coalho.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit" }, // pt-BR-c1-095.1
  { text: "A Rita cuida das contas, a Silvana dos pedidos e a Neide da produção.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Arbeit" }, // pt-BR-c1-095.2
  { text: "Neste mês, o grupo vendeu R$ 4.800 numa feira regional e decidiu investir parte do dinheiro numa geladeira nova.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "br", topic: "Arbeit" }, // pt-BR-c1-095.3
  { text: "O Josué voltou para Caruaru depois de dez anos em São Paulo.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Kultur/Musik" }, // pt-BR-c1-096.1
  { text: "Hoje ele toca zabumba num trio de forró e dá oficinas gratuitas para adolescentes no centro cultural do bairro.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Kultur/Musik" }, // pt-BR-c1-096.2
  { text: "Ele conta que aprendeu a tocar com o avô e que agora quer passar o ritmo adiante.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Kultur/Musik" }, // pt-BR-c1-096.3
  { text: "Em Cuiabá, o Adilson trabalha de madrugada numa padaria e dorme à tarde com o ventilador ligado.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit" }, // pt-BR-c1-097
  { text: "A Valéria levou os documentos ao INSS de Rondonópolis para dar entrada no benefício depois do parto.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Behörden" }, // pt-BR-c1-098
  { text: "No condomínio de Águas Claras, os moradores decidiram separar o lixo reciclável.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Wohnen/Umwelt" }, // pt-BR-c1-099
  { text: "O Ramon, que tem deficiência auditiva, é chefe de cozinha num restaurante de Goiânia.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit/Behinderung" }, // pt-BR-c1-100
  { text: "A pedagoga Luzia mora em Corumbá e atravessa o rio de barco para dar aulas numa escola rural.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit" }, // pt-BR-c1-101
  { text: "Depois do plantão no hospital de Sinop, a médica Denise dorme até a hora do almoço.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Gesundheit/Arbeit" }, // pt-BR-c1-102
  { text: "Desde que se mudou para Brasília, a Cláudia caminha meia hora todos os dias no Parque da Cidade.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Gesundheit" }, // pt-BR-c1-103.1
  { text: "No início, ela ia sozinha; hoje um grupo de vizinhos encontra a Cláudia às seis e meia, perto da entrada.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Gesundheit" }, // pt-BR-c1-103.2
  { text: "No mês passado, a médica do posto de saúde disse que a pressão dela melhorou bastante.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Gesundheit" }, // pt-BR-c1-103.3
  { text: "O Gilmar é agrônomo e trabalha numa fazenda de soja perto de Rio Verde.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit/Umwelt" }, // pt-BR-c1-104.1
  { text: "Neste ano, ele testou faixas de vegetação nativa entre as plantações para atrair insetos que ajudam a controlar pragas.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit/Umwelt" }, // pt-BR-c1-104.2
  { text: "A Patrícia, gerente da fazenda, acompanha os resultados numa planilha e decide se o teste continua.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit/Umwelt" }, // pt-BR-c1-104.3
  { text: "A Fernanda trabalha em casa três dias por semana e vai ao escritório na Avenida Paulista.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Arbeit" }, // pt-BR-c1-105
  { text: "O Carlos montou uma oficina de bicicletas na garagem de casa em Petrópolis.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Arbeit" }, // pt-BR-c1-106
  { text: "Em Belo Horizonte, a Rosângela foi ao Detran renovar a carteira de motorista.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Behörden" }, // pt-BR-c1-107
  { text: "No Rio de Janeiro, o professor Sérgio leva a turma da EJA ao museu uma vez por mês.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Kultur/Bildung" }, // pt-BR-c1-108
  { text: "A advogada Mariana é cega e lê os processos com leitor de tela no escritório em Santos.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Arbeit/Behinderung" }, // pt-BR-c1-109
  { text: "Os vizinhos de um prédio em Vitória criaram um grupo para dividir ferramentas e caronas.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Wohnen" }, // pt-BR-c1-110
  { text: "Na periferia de São Paulo, a Dandara organiza um sarau de poesia na última sexta de cada mês.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Kultur" }, // pt-BR-c1-111.1
  { text: "Quem quiser pode ler um texto próprio, cantar ou só ouvir.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Kultur" }, // pt-BR-c1-111.2
  { text: "Na edição de outubro, um senhor de setenta anos leu pela primeira vez um poema que guardava havia décadas, e a plateia aplaudiu de pé.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Kultur" }, // pt-BR-c1-111.3
  { text: "A Priscila e o Rodrigo compraram um apartamento pequeno em Juiz de Fora.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Wohnen/Behörden" }, // pt-BR-c1-112.1
  { text: "Antes de assinar o contrato, os dois conferiram a matrícula do imóvel no cartório e pediram a vistoria de um engenheiro.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Wohnen/Behörden" }, // pt-BR-c1-112.2
  { text: "A mudança foi num sábado de chuva, mas os amigos ajudaram a carregar tudo, e à noite todos dividiram uma pizza no chão da sala.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Wohnen/Behörden" }, // pt-BR-c1-112.3
  { text: "Em Joinville, a operadora de máquinas Simone fez um curso de segurança no trabalho.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Arbeit" }, // pt-BR-c1-113
  { text: "Em Maringá, o Alex recebeu a conta de luz pelo aplicativo e pagou R$ 312,40 por Pix.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "br", topic: "Alltag/Wohnen" }, // pt-BR-c1-114
  { text: "A Gabriela é intérprete de Libras e trabalha nas audiências do fórum de Florianópolis.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Arbeit/Behinderung" }, // pt-BR-c1-115
  { text: "Depois da enchente, os moradores de Lajeado limparam juntos a escola do bairro.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Alltag/Umwelt" }, // pt-BR-c1-116
  { text: "O seu Valdir perdeu a visão aos cinquenta anos, aprendeu braile e hoje lê para os netos.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Familie/Behinderung" }, // pt-BR-c1-117
  { text: "Na colheita da uva em Bento Gonçalves, a Daiane coordena uma equipe de vinte pessoas.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Arbeit" }, // pt-BR-c1-118
  { text: "A Helena trabalha como agente comunitária de saúde em São Joaquim.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Gesundheit/Arbeit" }, // pt-BR-c1-119.1
  { text: "Ela visita as famílias da zona rural, confere as vacinas das crianças e lembra os mais velhos de medir a pressão.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Gesundheit/Arbeit" }, // pt-BR-c1-119.2
  { text: "No inverno, quando a estrada fica escorregadia, ela combina as visitas por telefone e leva tudo numa mochila.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Gesundheit/Arbeit" }, // pt-BR-c1-119.3
  { text: "Durante a Semana Farroupilha, o Tiago e a Débora montam um galpão de lona num parque de Porto Alegre.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Feste/Familie" }, // pt-BR-c1-120.1
  { text: "A Débora cuida da churrasqueira, e o Tiago prepara as saladas.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Feste/Familie" }, // pt-BR-c1-120.2
  { text: "A filha mais nova, a Bianca, apresenta danças tradicionais com o grupo da escola.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "br", topic: "Feste/Familie" }, // pt-BR-c1-120.3
  { text: "À noite, todos tomam chimarrão em volta do fogo.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "br", topic: "Feste/Familie" }, // pt-BR-c1-120.4
];
