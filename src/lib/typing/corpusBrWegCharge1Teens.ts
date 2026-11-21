/**
 * Korpus des Weges „br" (Portugiesisch (Brasilien)), Charge 1 - Jugendliche (K-BR, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_BR_WEG_CHARGE1_TEENS: CorpusItem[] = [
  { text: "A Kauane grava vídeos curtos sobre a limpeza das margens do rio Negro, em Manaus.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Umwelt/Technik" }, // pt-BR-c1-041
  { text: "O ônibus para Belém atrasou, então o Ícaro aproveitou para ouvir um podcast de ciências.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Reisen" }, // pt-BR-c1-042
  { text: "Na escola de Palmas, o grêmio estudantil organizou uma feira de profissões.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Berufswahl/Schule" }, // pt-BR-c1-043
  { text: "Em Porto Velho, a Thaís programou um sensor que mede a chuva no pátio da escola.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Technik" }, // pt-BR-c1-044
  { text: "O Ryan treina canoagem três vezes por semana no rio Branco, em Boa Vista.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Sport" }, // pt-BR-c1-045
  { text: "Em Macapá, a amiga da Jade é surda, e as duas conversam em Libras.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Freundschaft/Behinderung" }, // pt-BR-c1-046
  { text: "O Pedro Henrique aprendeu a tocar carimbó com o tio em Santarém.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Musik" }, // pt-BR-c1-047.1
  { text: "No início, ele errava o ritmo do curimbó, o tambor grande, mas gravava cada ensaio no celular e ouvia de novo à noite.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Musik" }, // pt-BR-c1-047.2
  { text: "Agora o grupo da escola convidou o Pedro para tocar na mostra cultural de novembro.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Musik" }, // pt-BR-c1-047.3
  { text: "Para o trabalho de geografia, a Rebeca entrevistou uma moradora de Abaetetuba que trabalha com açaí.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Umwelt/Schule" }, // pt-BR-c1-048.1
  { text: "A moradora contou como a maré muda o caminho dos barcos e por que a família só colhe os cachos maduros.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Umwelt/Schule" }, // pt-BR-c1-048.2
  { text: "A Rebeca transformou a entrevista em um podcast de dez minutos para a turma.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Umwelt/Schule" }, // pt-BR-c1-048.3
  { text: "Em Salvador, a banda da escola mistura axé com guitarra elétrica nos ensaios.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Musik" }, // pt-BR-c1-049
  { text: "O Davi estuda para o ENEM com um grupo de amigos na biblioteca pública de Teresina.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Schule/ENEM" }, // pt-BR-c1-050
  { text: "A Ester, que tem baixa visão, joga goalball em Natal e se orienta pelo som da bola.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Sport/Behinderung" }, // pt-BR-c1-051
  { text: "No sertão do Piauí, o Luan acompanha pelo celular a energia gerada pela placa solar da família.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Technik/Umwelt" }, // pt-BR-c1-052
  { text: "A Bruna e o Gabriel montaram uma playlist de forró para a viagem de ônibus até Aracaju.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Musik/Reisen" }, // pt-BR-c1-053
  { text: "Em Maceió, a turma do nono ano recolheu plástico da praia num sábado de manhã.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Umwelt" }, // pt-BR-c1-054
  { text: "Em João Pessoa, a professora de educação física mostrou para a turma os resultados do Brasil nos Jogos Paralímpicos de Paris 2024: 89 medalhas, 25 delas de ouro, e o quinto lugar no quadro de medalhas.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "br", topic: "Sport/Paralympics" }, // pt-BR-c1-055.1
  { text: "Depois, a turma experimentou o goalball com vendas nos olhos e descobriu como é difícil ouvir a bola chegando.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Sport/Paralympics" }, // pt-BR-c1-055.2
  { text: "A Yara se mudou para Petrolina no início do ano.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Freundschaft/Sport" }, // pt-BR-c1-056.1
  { text: "Na escola nova, ela não conhecia ninguém.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Freundschaft/Sport" }, // pt-BR-c1-056.2
  { text: "No segundo dia, o Kauã perguntou: \"Quer entrar no time de vôlei?\"", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Freundschaft/Sport" }, // pt-BR-c1-056.3
  { text: "A Yara aceitou na hora.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Freundschaft/Sport" }, // pt-BR-c1-056.4
  { text: "Agora os dois vão juntos de bicicleta para os treinos, na beira do rio.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Freundschaft/Sport" }, // pt-BR-c1-056.5
  { text: "Em Brasília, a Giovana apresentou um aplicativo que avisa quando o ônibus está chegando.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Technik" }, // pt-BR-c1-057
  { text: "O Vinícius faz trilha com os primos na Chapada dos Guimarães e leva o lixo de volta.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Umwelt" }, // pt-BR-c1-058
  { text: "A banda do Lorenzo toca sertanejo e rock nos fins de semana em Rio Verde.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Musik" }, // pt-BR-c1-059
  { text: "No Pantanal, a Agatha ajudou uma equipe de pesquisa a contar jacarés à noite.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Umwelt/Tiere" }, // pt-BR-c1-060
  { text: "Em Goiânia, o Otávio usa leitor de tela e estuda química com áudios dos colegas.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Schule/Behinderung" }, // pt-BR-c1-061
  { text: "A Pietra quer ser veterinária e passa as férias ajudando numa clínica de Dourados.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Berufswahl" }, // pt-BR-c1-062
  { text: "O Benício e a Marina se conheceram num torneio online de xadrez.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Freundschaft/Technik" }, // pt-BR-c1-063.1
  { text: "Ele mora em Cuiabá, ela em Campo Grande.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Freundschaft/Technik" }, // pt-BR-c1-063.2
  { text: "Durante meses, os dois jogaram pelo computador depois da aula.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Freundschaft/Technik" }, // pt-BR-c1-063.3
  { text: "Em julho, a escola da Marina levou o time para uma competição em Cuiabá, e eles finalmente jogaram frente a frente, num tabuleiro de verdade.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Freundschaft/Technik" }, // pt-BR-c1-063.4
  { text: "A turma do primeiro ano do ensino médio de Anápolis estudou o Cerrado durante um mês.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Umwelt/Schule" }, // pt-BR-c1-064.1
  { text: "Cada grupo escolheu uma planta: o pequi, o buriti, o ipê.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Umwelt/Schule" }, // pt-BR-c1-064.2
  { text: "A Ana Júlia e o Caíque visitaram uma reserva perto da cidade, fotografaram as árvores e apresentaram as fotos com descrição em áudio para quem não enxerga.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Umwelt/Schule" }, // pt-BR-c1-064.3
  { text: "Daniel Dias ganhou 27 medalhas paralímpicas na natação, 14 delas de ouro.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "br", topic: "Sport/Paralympics" }, // pt-BR-c1-065
  { text: "No Rio de Janeiro, a Camila e o Bruno ensaiam um samba novo para a roda de domingo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Musik" }, // pt-BR-c1-066
  { text: "Em São Carlos, o Felipe estuda para o vestibular ouvindo os resumos que ele mesmo gravou.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Schule" }, // pt-BR-c1-067
  { text: "Em Uberlândia, a Larissa consertou o notebook da avó e mostrou como fazer chamada de vídeo.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Technik/Familie" }, // pt-BR-c1-068
  { text: "Em Vitória, a equipe de remo feminino da escola treina antes das seis da manhã.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Sport" }, // pt-BR-c1-069
  { text: "No trem para Mogi das Cruzes, o Guilherme e a Nicole revisam a matéria de história.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Reisen/Schule" }, // pt-BR-c1-070
  { text: "A turma do oitavo ano de Betim pesquisou atletas da cidade para um trabalho de educação física.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Sport/Paralympics/Behinderung" }, // pt-BR-c1-071.1
  { text: "O grupo da Lorena escolheu Terezinha Guilhermina, velocista com deficiência visual que ganhou o ouro nos 100 e nos 200 metros nos Jogos Paralímpicos de Londres 2012.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "br", topic: "Sport/Paralympics/Behinderung" }, // pt-BR-c1-071.2
  { text: "No cartaz, o grupo explicou que ela compete na classe T11.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "br", topic: "Sport/Paralympics/Behinderung" }, // pt-BR-c1-071.3
  { text: "Na escola técnica de Itajubá, a Jaqueline e o Igor criaram um sistema simples para medir a umidade da horta.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Technik/Umwelt" }, // pt-BR-c1-072.1
  { text: "Um sensor envia os dados para o celular, e a turma só liga a irrigação quando a terra está seca.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Technik/Umwelt" }, // pt-BR-c1-072.2
  { text: "Em três meses, a escola gastou bem menos água, e o projeto foi para a feira de ciências da região.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Technik/Umwelt" }, // pt-BR-c1-072.3
  { text: "Em Porto Alegre, a Júlia, que é cega, treina futebol de cegos duas vezes por semana.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Sport/Behinderung" }, // pt-BR-c1-073
  { text: "O Eduardo surfa em Garopaba e participa de mutirões para limpar a areia da praia.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Sport/Umwelt" }, // pt-BR-c1-074
  { text: "A banda da Isabela gravou a primeira música num estúdio pequeno de Caxias do Sul.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Musik" }, // pt-BR-c1-075
  { text: "Na viagem de ônibus até Foz do Iguaçu, a turma fez uma lista de perguntas para o guia.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Reisen" }, // pt-BR-c1-076
  { text: "O Arthur e a Melissa criaram um jogo de celular sobre a mata de araucárias do Paraná.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Technik/Umwelt" }, // pt-BR-c1-077
  { text: "Em Londrina, a Sarah decidiu fazer o curso técnico de enfermagem junto com o ensino médio.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Berufswahl" }, // pt-BR-c1-078
  { text: "A família do Jean veio do Haiti e mora em Chapecó há dois anos.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Freundschaft/Migration" }, // pt-BR-c1-079.1
  { text: "No início, o Jean entendia pouco português, e a colega Manuela traduzia as palavras difíceis com ajuda do celular.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Freundschaft/Migration" }, // pt-BR-c1-079.2
  { text: "Hoje o Jean ensina crioulo haitiano para a Manuela nos intervalos, e os dois riem dos erros um do outro.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Freundschaft/Migration" }, // pt-BR-c1-079.3
  { text: "Nas férias de julho, a Lara viajou com a tia para os Campos de Cima da Serra.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Reisen/Umwelt" }, // pt-BR-c1-080.1
  { text: "De manhã, a grama estava branca de geada, e a Lara fotografou tudo com as mãos geladas.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "br", topic: "Reisen/Umwelt" }, // pt-BR-c1-080.2
  { text: "À tarde, as duas visitaram um produtor de queijo que explicou como cuida dos campos nativos sem usar veneno.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "br", topic: "Reisen/Umwelt" }, // pt-BR-c1-080.3
];
