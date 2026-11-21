/**
 * Korpus des Weges „br" (Portugiesisch (Brasilien)), Charge 1 - Kinder (K-BR, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_BR_WEG_CHARGE1_KIDS: CorpusItem[] = [
  { text: "A Luana rema devagar no rio e conta os botos que aparecem perto da canoa.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Tiere" }, // pt-BR-c1-001
  { text: "Na hora do recreio, a turma de Manaus joga queimada no pátio coberto.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Schule/Spiel" }, // pt-BR-c1-002
  { text: "O Davi bate o açaí com a avó e depois lava o liquidificador sozinho.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Essen/Familie" }, // pt-BR-c1-003
  { text: "Em Belém, a Yasmin leva a capa de chuva para a escola, porque o céu ficou escuro.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Schule/Alltag" }, // pt-BR-c1-004
  { text: "Em Santarém, o Caio, que usa cadeira de rodas, chega primeiro à biblioteca.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Schule/Behinderung" }, // pt-BR-c1-005
  { text: "Na feira de Rio Branco, a Ana escolhe duas pencas de banana para a semana.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Essen/Alltag" }, // pt-BR-c1-006
  { text: "No fim de semana, a família da Raissa foi de barco até uma comunidade perto de Tefé.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Natur/Tiere" }, // pt-BR-c1-007.1
  { text: "A Raissa levou um caderno e desenhou tudo o que viu: uma garça branca, um peixe pulando e as casas sobre palafitas.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Natur/Tiere" }, // pt-BR-c1-007.2
  { text: "À noite, ela mostrou os desenhos para os primos e explicou cada um.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Natur/Tiere" }, // pt-BR-c1-007.3
  { text: "Em Parintins, a escola da Bianca prepara uma apresentação para o festival da cidade.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Feste/Schule/Behinderung" }, // pt-BR-c1-008.1
  { text: "A turma inteira ajuda: uns cortam papel colorido, outros ensaiam a dança, e o Thiago, que tem deficiência visual, toca o tambor e marca o ritmo para todo mundo.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Feste/Schule/Behinderung" }, // pt-BR-c1-008.2
  { text: "Na sexta, as famílias vêm assistir.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Feste/Schule/Behinderung" }, // pt-BR-c1-008.3
  { text: "A Maria Clara faz tapioca com coco no café da manhã de domingo em Fortaleza.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Essen/Familie" }, // pt-BR-c1-009
  { text: "Em Recife, o Pedro e a Lia soltam pipa na praia quando o vento fica forte.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Spiel" }, // pt-BR-c1-010
  { text: "Na praia de Natal, a turma observa de longe uma tartaruga que volta para o mar.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Tiere" }, // pt-BR-c1-011
  { text: "Em São Luís, o Heitor lê em braile e ensina as letras para a irmã mais nova.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Schule/Behinderung" }, // pt-BR-c1-012
  { text: "Na escola de Caruaru, cada criança traz uma fruta para a salada da turma.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Schule/Essen" }, // pt-BR-c1-013
  { text: "A Joana mora em Juazeiro e anda de bicicleta até a escola com o irmão.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Alltag/Familie" }, // pt-BR-c1-014
  { text: "Em junho, a escola da Sofia, em Campina Grande, faz uma festa junina no pátio.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Feste/Schule" }, // pt-BR-c1-015.1
  { text: "A Sofia ajudou a pendurar as bandeirinhas, e o Miguel escreveu os nomes das barracas.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Feste/Schule" }, // pt-BR-c1-015.2
  { text: "Na quadrilha, meninos e meninas trocam de par a cada música, e todo mundo ri quando alguém erra o passo.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Feste/Schule" }, // pt-BR-c1-015.3
  { text: "Nas férias, o Arthur viajou com os pais para os Lençóis Maranhenses.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Natur/Reisen" }, // pt-BR-c1-016.1
  { text: "Entre as dunas brancas havia lagoas de água clara, e ele nadou em três delas.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Natur/Reisen" }, // pt-BR-c1-016.2
  { text: "Na volta, o Arthur fez uma maquete com areia e papel azul para mostrar aos colegas como era o lugar.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Natur/Reisen" }, // pt-BR-c1-016.3
  { text: "No Pantanal, a Helena viu uma capivara com quatro filhotes perto da água.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Tiere" }, // pt-BR-c1-017
  { text: "O tuiuiú abriu as asas enormes, e o Enzo ficou em silêncio para não espantar o pássaro.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Tiere" }, // pt-BR-c1-018
  { text: "Em Goiânia, a Lara faz o dever de casa e depois arruma a mochila sozinha.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Schule" }, // pt-BR-c1-019
  { text: "A turma de Brasília plantou mudas de ipê na frente da escola.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Natur/Schule" }, // pt-BR-c1-020
  { text: "O Gael tem baixa visão e usa uma lupa grande para ler gibis na escola de Cuiabá.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Schule/Behinderung" }, // pt-BR-c1-021
  { text: "No sábado, o Bernardo aprende com o avô a fazer pamonha em Anápolis.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Essen/Familie" }, // pt-BR-c1-022
  { text: "A Alice mora numa chácara perto de Campo Grande.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Tiere/Alltag" }, // pt-BR-c1-023.1
  { text: "Antes da escola, ela dá água para as plantas da horta e confere se os ovos das codornas estão no ninho.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Tiere/Alltag" }, // pt-BR-c1-023.2
  { text: "Hoje encontrou seis.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Tiere/Alltag" }, // pt-BR-c1-023.3
  { text: "Ela anotou o número no caderno, porque quer saber quantos ovos aparecem até o fim do mês.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Tiere/Alltag" }, // pt-BR-c1-023.4
  { text: "No passeio da escola à Chapada dos Guimarães, a professora pediu silêncio na trilha.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Natur/Schule" }, // pt-BR-c1-024.1
  { text: "A Luna ouviu o barulho de uma cachoeira, e o Murilo descobriu uma borboleta azul numa pedra.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Natur/Schule" }, // pt-BR-c1-024.2
  { text: "Depois, cada criança desenhou o som mais bonito que ouviu no caminho.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Natur/Schule" }, // pt-BR-c1-024.3
  { text: "Em Belo Horizonte, a Cecília prepara pão de queijo com a mãe e mede o polvilho sozinha.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Essen/Familie" }, // pt-BR-c1-025
  { text: "Em Vitória, o Rafael leva a bola para o parque, e os amigos montam dois times na grama.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Spiel" }, // pt-BR-c1-026
  { text: "Na escola de Campinas, a Valentina cuida do aquário da sala nesta semana.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Tiere/Schule" }, // pt-BR-c1-027
  { text: "Em Niterói, a Manuela usa aparelho auditivo e se senta onde vê bem o rosto da professora.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Schule/Behinderung" }, // pt-BR-c1-028
  { text: "O Lucas e a vizinha montam um robô de sucata no quintal de casa em Juiz de Fora.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Technik/Spiel" }, // pt-BR-c1-029
  { text: "No sítio dos avós, no interior de Minas, o Antônio dá milho para os patos.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Tiere/Familie" }, // pt-BR-c1-030
  { text: "Na biblioteca da escola, em Santos, a Isadora escolheu um livro sobre tartarugas.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Schule/Behinderung" }, // pt-BR-c1-031.1
  { text: "O livro tem letras grandes e uma versão em braile, e a colega Beatriz, que não enxerga, leu um trecho para a turma.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Schule/Behinderung" }, // pt-BR-c1-031.2
  { text: "Depois, as duas fizeram juntas um cartaz com tudo o que aprenderam.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Schule/Behinderung" }, // pt-BR-c1-031.3
  { text: "Na rua da Gabriela, em Ribeirão Preto, as crianças organizaram um campeonato de bolinha de gude.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Spiel" }, // pt-BR-c1-032.1
  { text: "A Gabriela fez a tabela dos jogos, o Samuel desenhou o círculo de giz no chão e a pequena Laura foi a juíza.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Spiel" }, // pt-BR-c1-032.2
  { text: "No fim da tarde, todos dividiram um bolo de fubá que a vizinha trouxe.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Spiel" }, // pt-BR-c1-032.3
  { text: "Em Curitiba, a Clara veste o casaco e o gorro, porque a manhã está fria.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Alltag" }, // pt-BR-c1-033
  { text: "O Bento ajuda o pai a assar pinhão no fogão a lenha da casa na serra.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Essen/Familie" }, // pt-BR-c1-034
  { text: "Em Florianópolis, a Lívia aprende a nadar e já atravessa a piscina sozinha.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Sport" }, // pt-BR-c1-035
  { text: "A turma de Blumenau fez um mural com desenhos de todos os pássaros do bairro.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Tiere/Schule" }, // pt-BR-c1-036
  { text: "Em Pelotas, o Henrique usa bengala e conhece cada degrau do caminho até a escola.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Schule/Behinderung" }, // pt-BR-c1-037
  { text: "Nas Cataratas do Iguaçu, a Laís sentiu os pingos de água no rosto e deu risada.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Natur" }, // pt-BR-c1-038
  { text: "A avó do Matheus mora em Santa Maria e toma chimarrão toda manhã.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Familie" }, // pt-BR-c1-039.1
  { text: "Nas férias, o Matheus aprendeu a encher a cuia com erva e a usar a água quente sem deixar ferver.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Familie" }, // pt-BR-c1-039.2
  { text: "Ele ainda acha o chimarrão amargo, mas adora ouvir as histórias que a avó conta enquanto a cuia passa de mão em mão.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Familie" }, // pt-BR-c1-039.3
  { text: "Na escola de Chapecó, a professora Mariana trouxe uma caixa cheia de folhas secas.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "br", topic: "Schule/Natur" }, // pt-BR-c1-040.1
  { text: "Cada criança escolheu uma folha, mediu o tamanho com a régua e escreveu o resultado numa tabela.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Schule/Natur" }, // pt-BR-c1-040.2
  { text: "O Vicente achou a maior, e a Ester achou a menor de todas.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Schule/Natur" }, // pt-BR-c1-040.3
  { text: "Depois, a turma colou as folhas num painel.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "br", topic: "Schule/Natur" }, // pt-BR-c1-040.4
];
