/**
 * Korpus des Weges „pt" (Portugiesisch (Portugal)), Charge 1 - Erwachsene (K-PT, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_PT_WEG_CHARGE1_ERWACHSENE: CorpusItem[] = [
  { text: "A enfermeira do centro de saúde de Braga marcou a minha consulta para terça de manhã.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Gesundheit" }, // pt-PT-c1-081
  { text: "Em Vila Real, o casal arrendou um apartamento com varanda virada para a serra.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Wohnen" }, // pt-PT-c1-082
  { text: "O senhorio aceitou baixar a renda do nosso apartamento no Porto depois de uma longa conversa.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Wohnen" }, // pt-PT-c1-083
  { text: "Em Guimarães, o Carlos trabalha numa empresa têxtil e faz turnos rotativos.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit" }, // pt-PT-c1-084
  { text: "O Jorge abriu uma pastelaria em Aveiro e já tem clientes fiéis aos ovos moles.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Essen" }, // pt-PT-c1-085
  { text: "A Teresa, que é cega, requisitou dois audiolivros na biblioteca municipal da Guarda.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Kultur/Inklusion" }, // pt-PT-c1-086
  { text: "Em Leiria, a empresa da Helena permite teletrabalho dois dias por semana.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit" }, // pt-PT-c1-087
  { text: "Em Lisboa, fui à Loja do Cidadão renovar o cartão de cidadão e esperei menos do que pensava.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Behörden" }, // pt-PT-c1-088
  { text: "O Nuno é arquiteto em Lisboa e vai todos os dias de bicicleta para o escritório.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Alltag" }, // pt-PT-c1-089
  { text: "A Ana e a Sílvia procuram um T2 em Almada perto da estação de comboios.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "pt", topic: "Wohnen" }, // pt-PT-c1-090
  { text: "Em Beja, a médica de família atende alguns doentes por videoconsulta às sextas.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Gesundheit" }, // pt-PT-c1-091
  { text: "O Manuel deixou Lisboa e abriu uma oficina de bicicletas em Estremoz.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit" }, // pt-PT-c1-092
  { text: "Na vindima deste ano, a adega da família da Rosa, em Reguengos, contratou pessoas de vários países.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Migration" }, // pt-PT-c1-093
  { text: "Em Portalegre, a Fátima entregou a declaração de IRS no Portal das Finanças antes do prazo.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Behörden" }, // pt-PT-c1-094
  { text: "Em Faro, o restaurante da Joana fecha às segundas para descanso da equipa.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit" }, // pt-PT-c1-095
  { text: "O André é intérprete de Língua Gestual Portuguesa num hospital de Portimão.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Gesundheit" }, // pt-PT-c1-096
  { text: "Depois da época alta, a Cláudia aproveita o inverno para fazer um curso de inglês em Lagos.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Bildung" }, // pt-PT-c1-097
  { text: "Em Ponta Delgada, o Paulo trabalha à distância para uma empresa de Lisboa.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit/Technik" }, // pt-PT-c1-098
  { text: "A Filipa é veterinária na ilha Terceira e visita as explorações de gado de carro.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit/Tiere" }, // pt-PT-c1-099
  { text: "O voo para Lisboa foi cancelado por causa do vento e os passageiros ficaram num hotel da Horta.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Reisen/Alltag" }, // pt-PT-c1-100
  { text: "Na Graciosa, a Olga marcou uma teleconsulta com um especialista de Ponta Delgada.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Gesundheit" }, // pt-PT-c1-101
  { text: "No Funchal, o Sérgio trabalha num hotel e tem dois dias de folga por semana.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit" }, // pt-PT-c1-102
  { text: "A Patrícia veio da Venezuela para a Madeira e abriu um atelier de costura em Santa Cruz.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Migration/Arbeit" }, // pt-PT-c1-103
  { text: "O Marco usa cadeira de rodas e é contabilista numa empresa de Câmara de Lobos.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit/Inklusion" }, // pt-PT-c1-104
  { text: "No Porto Santo, a câmara municipal procura pessoas para trabalhar na época de verão.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit" }, // pt-PT-c1-105
  { text: "Para marcar uma consulta no SNS, pode ligar para o centro de saúde ou ir ao balcão.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Gesundheit/Behörden" }, // pt-PT-c1-106
  { text: "Guardei os recibos da renda numa pasta para preparar o IRS do próximo ano.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Behörden/Wohnen" }, // pt-PT-c1-107
  { text: "A reunião de condomínio ficou marcada para a próxima quinta, às nove da noite.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Wohnen" }, // pt-PT-c1-108
  { text: "Nos Jogos Paralímpicos de Paris 2024, Portugal conquistou sete medalhas.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "pt", topic: "Sport/Paralympics" }, // pt-PT-c1-109
  { text: "O leitor de ecrã lê em voz alta tudo o que aparece no computador, linha a linha.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Technik/Inklusion" }, // pt-PT-c1-110
  { text: "A Graça é motorista de autocarro no Porto há doze anos.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit" }, // pt-PT-c1-111.1
  { text: "Começa o turno às seis da manhã e conhece de cor os passageiros habituais.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit" }, // pt-PT-c1-111.2
  { text: "Há um senhor que lhe deixa sempre o jornal dobrado no banco da frente.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit" }, // pt-PT-c1-111.3
  { text: "Quando ela está de férias, os colegas dizem que os passageiros perguntam logo por ela.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit" }, // pt-PT-c1-111.4
  { text: "Depois de vinte anos em França, o Armando voltou para a aldeia dos pais, perto de Viseu.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Migration/Wohnen" }, // pt-PT-c1-112.1
  { text: "Recuperou a casa de pedra com a ajuda dos filhos e abriu um pequeno alojamento local.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Migration/Wohnen" }, // pt-PT-c1-112.2
  { text: "No inverno, a aldeia fica quase vazia, mas em agosto os emigrantes regressam e as ruas ficam cheias de vozes.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Migration/Wohnen" }, // pt-PT-c1-112.3
  { text: "A Sandra é cega e trabalha num banco em Lisboa como analista de dados.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Inklusion" }, // pt-PT-c1-113.1
  { text: "Usa um leitor de ecrã e um teclado normal, sem marcas especiais, porque sabe onde fica cada tecla.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Inklusion" }, // pt-PT-c1-113.2
  { text: "Os colegas já se habituaram a ouvir a voz rápida do computador dela.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit/Inklusion" }, // pt-PT-c1-113.3
  { text: "Quando chega alguém novo à equipa, é ela quem explica as folhas de cálculo.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit/Inklusion" }, // pt-PT-c1-113.4
  { text: "A Ana Rita é enfermeira numa unidade de saúde móvel no interior do Alentejo.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Gesundheit/Arbeit" }, // pt-PT-c1-114.1
  { text: "Duas vezes por semana, percorre aldeias onde já não há centro de saúde.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Gesundheit/Arbeit" }, // pt-PT-c1-114.2
  { text: "Mede a tensão, faz pensos e trata das receitas com o médico por videochamada.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Gesundheit/Arbeit" }, // pt-PT-c1-114.3
  { text: "Muitas pessoas mais velhas esperam por ela à porta de casa, com um café já pronto.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Gesundheit/Arbeit" }, // pt-PT-c1-114.4
  { text: "A Helena e o marido têm um pequeno restaurante em Tavira.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit/Familie" }, // pt-PT-c1-115.1
  { text: "No verão, trabalham quase todos os dias e passam pouco tempo com os filhos.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Familie" }, // pt-PT-c1-115.2
  { text: "Por isso, em novembro, fecham durante duas semanas e viajam pelo país.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Familie" }, // pt-PT-c1-115.3
  { text: "Este ano foram à Serra da Estrela ver a neve, que as crianças nunca tinham visto.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit/Familie" }, // pt-PT-c1-115.4
  { text: "Quando o tempo está mau, os barcos entre as ilhas não saem e a vida muda de planos.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Alltag/Arbeit" }, // pt-PT-c1-116.1
  { text: "A Susana, que vive em São Jorge, já se habituou a ter sempre um plano B.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Alltag/Arbeit" }, // pt-PT-c1-116.2
  { text: "Nesses dias trabalha a partir de casa e aproveita para tratar dos papéis das Finanças.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Alltag/Arbeit" }, // pt-PT-c1-116.3
  { text: "«Aqui, quem manda é o mar», diz ela a rir.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Alltag/Arbeit" }, // pt-PT-c1-116.4
  { text: "O José é pescador no Faial e, há alguns anos, começou também a levar turistas a ver baleias.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Natur" }, // pt-PT-c1-117.1
  { text: "Conhece o mar como ninguém e explica tudo com calma, em português e em inglês.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit/Natur" }, // pt-PT-c1-117.2
  { text: "Pede aos visitantes que respeitem a distância aos animais e não façam barulho.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit/Natur" }, // pt-PT-c1-117.3
  { text: "Nos dias de mar calmo, a filha vai com ele e trata das fotografias.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Natur" }, // pt-PT-c1-117.4
  { text: "A Lúcia é guia de montanha na Madeira e acompanha grupos pelas levadas e veredas da ilha.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Natur" }, // pt-PT-c1-118.1
  { text: "Antes de cada passeio, consulta a meteorologia e confirma se os caminhos estão abertos.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Natur" }, // pt-PT-c1-118.2
  { text: "Leva sempre água a mais, um estojo de primeiros socorros e uma lanterna.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Arbeit/Natur" }, // pt-PT-c1-118.3
  { text: "Diz que o melhor do trabalho é ver as pessoas chegarem ao miradouro em silêncio.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Arbeit/Natur" }, // pt-PT-c1-118.4
  { text: "O Ricardo tem baixa visão e trabalha no atendimento ao público da câmara municipal do Funchal.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Behörden/Inklusion" }, // pt-PT-c1-119.1
  { text: "No computador, usa letras grandes e cores com muito contraste.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Behörden/Inklusion" }, // pt-PT-c1-119.2
  { text: "Quando alguém chega ao balcão com dúvidas sobre a água ou a recolha do lixo, ele encontra a resposta em poucos minutos.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Behörden/Inklusion" }, // pt-PT-c1-119.3
  { text: "Os colegas dizem que é o mais paciente da equipa.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Behörden/Inklusion" }, // pt-PT-c1-119.4
  { text: "Muitas pessoas aprenderam a escrever no computador com dois dedos e nunca mudaram.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Tippen/Arbeit" }, // pt-PT-c1-120.1
  { text: "Aprender a escrever com os dez dedos depois dos quarenta anos é possível: basta paciência e um pouco de treino diário.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "pt", topic: "Tippen/Arbeit" }, // pt-PT-c1-120.2
  { text: "Ao fim de algumas semanas, a velocidade sobe e as mãos ficam menos cansadas no fim do dia de trabalho.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pt", topic: "Tippen/Arbeit" }, // pt-PT-c1-120.3
];
