/**
 * Korpus des Weges „pt" (Portugiesisch (Portugal)), Charge 1 - Jugendliche (K-PT, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
 *
 * Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/pt-PT.jsonl` (je Altersgruppe 30 Sätze und 10 Absätze, neu in der
 * Sprache verfasst, `quelle: "eigen"`), geprüft von einem zweiten Prüfer (`PRUEFBERICHT-pt-PT.md`: freigabefähig).
 * Der Text ist unverändert übernommen. Zuordnung: `alter` ⇒ `stufen`, `thema` ⇒ `topic`, `weg` ⇒ `nurWeg`; die Kennung
 * der Quelle steht als Kommentar hinter jeder Zeile.
 *  · Absätze (`art: "absatz"`) sind an den Satzgrenzen in ihre Sätze geteilt (`<id>.1`, `<id>.2` …): Korpus-Zeilen sind einzelne
 *    Übungszeilen (die längste der acht Wege davor hat 130 Zeichen), mehrsätzige Geschichten sind Serien. Kein Wort geändert.
 *  · Selbst verfasst ⇒ ohne `herkunft` (wie die Chargen von it/pl/tr/cs; `herkunft` ist für ÜBERNOMMENE Texte).
 *  · `minTier` = `minTierFor(text, "pt")` nach der eigenen Lern-Folge des Weges (`lernweg.ts`, F4), Bezugstastatur `pt`.
 * Wächter: `tests/tastenflow-texte-pt-charge1.test.ts`. Nur HINTEN anhängen (Anker, `corpusPt.ts`).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_PT_WEG_CHARGE1_TEENS: CorpusItem[] = [
  { text: "Lenine Cunha, de Vila Nova de Gaia, ganhou o bronze no salto em comprimento em Londres 2012.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "pt", topic: "Sport/Paralympics" }, // pt-PT-c1-041
  { text: "A banda da escola de Guimarães vai tocar no festival de verão da cidade.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Musik" }, // pt-PT-c1-042
  { text: "No vale do Douro, o grupo de amigos fez a viagem de comboio com a janela aberta.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Reisen" }, // pt-PT-c1-043
  { text: "Em Coimbra, a Marta estuda para os exames nacionais na biblioteca da escola.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Schule" }, // pt-PT-c1-044
  { text: "Na Ria de Aveiro, a Patrícia treina remo três vezes por semana.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Sport" }, // pt-PT-c1-045
  { text: "Em Leiria, o Bruno criou uma aplicação que lembra a turma das datas dos testes.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Technik" }, // pt-PT-c1-046
  { text: "Em Castelo Branco, a turma do décimo ano limpou a margem do rio num sábado.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Umwelt" }, // pt-PT-c1-047
  { text: "Todos os dias, a Ana atravessa o Tejo de barco para ir à escola em Lisboa.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Schule/Reisen" }, // pt-PT-c1-048
  { text: "Em Almada, a Yara é surda e ensina Língua Gestual Portuguesa aos colegas no clube da escola.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Freundschaft/Inklusion" }, // pt-PT-c1-049
  { text: "Em Alfama, o Diogo toca guitarra portuguesa e quer juntar o fado ao rap.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Musik" }, // pt-PT-c1-050
  { text: "A turma de Setúbal foi ver golfinhos no Sado com uma bióloga marinha.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Umwelt/Tiere" }, // pt-PT-c1-051
  { text: "Em Évora, o Gabriel faz voluntariado no canil municipal aos sábados de manhã.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Freiwillig" }, // pt-PT-c1-052
  { text: "Em Beja, a Mariana quer ser engenheira agrónoma e ficar a trabalhar no Alentejo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Berufswahl" }, // pt-PT-c1-053
  { text: "Em Sines, a Joana e os amigos ouviram música de vários países num festival de verão.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Musik" }, // pt-PT-c1-054
  { text: "Em Portimão, o Leandro treina vela e sonha participar numa regata internacional.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Sport" }, // pt-PT-c1-055
  { text: "No verão, a Raquel trabalha num café de Tavira para juntar dinheiro para a viagem de finalistas.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Reisen" }, // pt-PT-c1-056
  { text: "O Tiago usa cadeira de rodas e joga basquetebol adaptado numa equipa de Faro.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Sport/Inklusion" }, // pt-PT-c1-057
  { text: "Em Loulé, a turma mediu a temperatura do mar durante um mês para um projeto de Ciências.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Umwelt/Schule" }, // pt-PT-c1-058
  { text: "Na ilha do Faial, a Rita está a aprender a observar e a registar golfinhos.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Umwelt/Tiere" }, // pt-PT-c1-059
  { text: "O Bernardo mora nas Flores e fala com os primos do Canadá por videochamada.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Technik/Familie" }, // pt-PT-c1-060
  { text: "Em Ponta Delgada, o grupo de teatro da escola ensaia uma peça escrita pela turma.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Kultur" }, // pt-PT-c1-061
  { text: "A Inês tem baixa visão e amplia o ecrã para ler os horários dos barcos entre as ilhas.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Technik/Inklusion" }, // pt-PT-c1-062
  { text: "No Funchal, o Rúben treina corrida de montanha nos caminhos da serra.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Sport" }, // pt-PT-c1-063
  { text: "A Carlota e o irmão gravam um podcast sobre a história das levadas da Madeira.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Technik" }, // pt-PT-c1-064
  { text: "Em Machico, a turma recolheu plástico na praia e separou tudo para reciclar.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Umwelt" }, // pt-PT-c1-065
  { text: "Em Câmara de Lobos, a Sara aprendeu a programar um pequeno robô no clube de robótica.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Technik" }, // pt-PT-c1-066
  { text: "Em Paris 2024, Miguel Monteiro ganhou a medalha de ouro no lançamento do peso.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "pt", topic: "Sport/Paralympics" }, // pt-PT-c1-067
  { text: "Cristina Gonçalves conquistou a medalha de ouro no boccia nos Jogos Paralímpicos de Paris.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Sport/Paralympics" }, // pt-PT-c1-068
  { text: "Antes de enviar uma mensagem, relê o que escreveste e pensa no que a outra pessoa vai sentir.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Freundschaft/Technik" }, // pt-PT-c1-069
  { text: "Hoje treinei vinte minutos e escrevi a frase toda sem olhar para o teclado.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Tippen" }, // pt-PT-c1-070
  { text: "No Porto, a Luísa e o Henrique formaram uma banda com dois amigos da escola.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Musik/Freundschaft" }, // pt-PT-c1-071.1
  { text: "Ensaiam na garagem do tio dela às sextas à noite.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Musik/Freundschaft" }, // pt-PT-c1-071.2
  { text: "Ainda só têm quatro canções, mas já foram convidados para tocar na festa de fim de ano.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Musik/Freundschaft" }, // pt-PT-c1-071.3
  { text: "O Henrique escreve as letras e a Luísa toca bateria.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Musik/Freundschaft" }, // pt-PT-c1-071.4
  { text: "A turma do nono ano de uma escola de Viseu decidiu medir o consumo de energia do edifício durante uma semana.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Umwelt/Schule" }, // pt-PT-c1-072.1
  { text: "Descobriu que muitas luzes ficavam acesas nas salas vazias.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Umwelt/Schule" }, // pt-PT-c1-072.2
  { text: "Fez cartazes, falou com a direção e propôs sensores de movimento.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Umwelt/Schule" }, // pt-PT-c1-072.3
  { text: "Agora a escola gasta menos e a turma quer continuar o projeto.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Umwelt/Schule" }, // pt-PT-c1-072.4
  { text: "O Francisco é cego e usa um leitor de ecrã no telemóvel.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Technik/Inklusion" }, // pt-PT-c1-073.1
  { text: "Com os auscultadores, ouve as mensagens do grupo da turma e responde mais depressa do que muitos colegas.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Technik/Inklusion" }, // pt-PT-c1-073.2
  { text: "Todas as manhãs vai de metro até à escola, em Lisboa, e conta as estações pelos anúncios.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Technik/Inklusion" }, // pt-PT-c1-073.3
  { text: "Às vezes, é ele quem avisa os amigos de que estão quase a chegar.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Technik/Inklusion" }, // pt-PT-c1-073.4
  { text: "Em Mértola, um grupo de jovens criou um clube de leitura que se reúne na biblioteca municipal.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Kultur/Freundschaft" }, // pt-PT-c1-074.1
  { text: "Todos os meses escolhem um livro diferente, de autores portugueses ou estrangeiros.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Kultur/Freundschaft" }, // pt-PT-c1-074.2
  { text: "Quem não pode ir participa por videochamada.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Kultur/Freundschaft" }, // pt-PT-c1-074.3
  { text: "No verão, as conversas passam para a esplanada, ao fim da tarde, quando o calor já diminuiu.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Kultur/Freundschaft" }, // pt-PT-c1-074.4
  { text: "Durante as férias, o Martim e a prima entraram num grupo de voluntários em Olhão.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Umwelt" }, // pt-PT-c1-075.1
  { text: "Todas as manhãs limpavam um pedaço da Ria Formosa e registavam o lixo que encontravam.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Umwelt" }, // pt-PT-c1-075.2
  { text: "O que mais aparecia eram tampas de garrafas e redes de pesca velhas.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Umwelt" }, // pt-PT-c1-075.3
  { text: "No fim, enviaram os resultados à câmara municipal.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Umwelt" }, // pt-PT-c1-075.4
  { text: "No verão, a Matilde fez a primeira viagem sozinha entre ilhas: de barco, do Pico até ao Faial.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Reisen" }, // pt-PT-c1-076.1
  { text: "A viagem é curta, mas para ela pareceu uma aventura.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Reisen" }, // pt-PT-c1-076.2
  { text: "Do convés viu a montanha do Pico a ficar cada vez mais pequena.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Reisen" }, // pt-PT-c1-076.3
  { text: "Na Horta, a tia estava à espera dela no cais com um cartaz cheio de corações.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Reisen" }, // pt-PT-c1-076.4
  { text: "Em Angra do Heroísmo, o professor de Educação Física levou para a aula uma bola com guizos.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Sport/Inklusion" }, // pt-PT-c1-077.1
  { text: "Explicou que o goalball se joga de olhos vendados e que nasceu para atletas cegos ou com baixa visão.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Sport/Inklusion" }, // pt-PT-c1-077.2
  { text: "A turma jogou em silêncio, sempre a ouvir a bola.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Sport/Inklusion" }, // pt-PT-c1-077.3
  { text: "A Sónia, que tem baixa visão, foi a melhor a defender.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Sport/Inklusion" }, // pt-PT-c1-077.4
  { text: "A Kiara canta num coro jovem do Funchal.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Musik" }, // pt-PT-c1-078.1
  { text: "Em dezembro, o coro dá concertos em várias igrejas e praças da cidade.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Musik" }, // pt-PT-c1-078.2
  { text: "Este ano, ela vai cantar um solo pela primeira vez.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Musik" }, // pt-PT-c1-078.3
  { text: "Está nervosa, mas ensaia todos os dias em casa, com o telemóvel a gravar, para perceber onde pode melhorar.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Musik" }, // pt-PT-c1-078.4
  { text: "O Gustavo vive no Porto Moniz e todas as semanas vai ao Funchal treinar natação.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Sport/Reisen" }, // pt-PT-c1-079.1
  { text: "A viagem de autocarro é longa, por isso aproveita para ouvir música e rever a matéria.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Sport/Reisen" }, // pt-PT-c1-079.2
  { text: "A treinadora diz que a disciplina dele é um exemplo para a equipa.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Sport/Reisen" }, // pt-PT-c1-079.3
  { text: "No próximo mês vai nadar pela primeira vez no campeonato regional.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Sport/Reisen" }, // pt-PT-c1-079.4
  { text: "Hoje em dia, quase todos os trabalhos da escola se fazem no computador.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Tippen/Schule" }, // pt-PT-c1-080.1
  { text: "Quem escreve com os dez dedos poupa tempo e mantém a atenção no que está a escrever, porque não precisa de procurar as teclas.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Tippen/Schule" }, // pt-PT-c1-080.2
  { text: "Quinze minutos por dia chegam para notar diferença ao fim de algumas semanas.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "pt", topic: "Tippen/Schule" }, // pt-PT-c1-080.3
  { text: "O segredo é treinar com regularidade, não com pressa.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pt", topic: "Tippen/Schule" }, // pt-PT-c1-080.4
];
