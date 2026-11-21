/**
 * Korpus des Weges „pt" (Portugiesisch (Portugal)), Charge 1 - Kinder (K-PT, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_PT_WEG_CHARGE1_KIDS: CorpusItem[] = [
  { text: "Em Braga, a Inês vai de bicicleta para a escola todas as manhãs.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Schule" }, // pt-PT-c1-001
  { text: "O avô do Tiago mora no Gerês e sabe o nome de todas as árvores.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-002
  { text: "No Porto, na noite de São João, o Rui e a família dançam na rua com os vizinhos.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Fest" }, // pt-PT-c1-003
  { text: "Em Guimarães, a Leonor, que é cega, lê histórias em braille aos colegas.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Schule/Inklusion" }, // pt-PT-c1-004
  { text: "Em Aveiro, o Duarte e a irmã contam os barcos moliceiros no canal.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Natur" }, // pt-PT-c1-005
  { text: "Na Serra da Estrela, a Sofia fez um boneco de neve com o pai.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-006
  { text: "Numa escola de Coimbra, a turma cuida de um aquário com três peixes.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Schule/Tiere" }, // pt-PT-c1-007
  { text: "Em Viseu, o Gonçalo usa cadeira de rodas e defende a baliza nos jogos do recreio.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Spiel/Inklusion" }, // pt-PT-c1-008
  { text: "A Matilde vai de elétrico até à casa da avó, em Lisboa.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie" }, // pt-PT-c1-009
  { text: "Numa escola de Setúbal, a Beatriz e o Martim jogam à macaca até tocar a campainha.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Spiel" }, // pt-PT-c1-010
  { text: "Em Sintra, o Afonso descobriu um caracol enorme no muro do jardim.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Tiere" }, // pt-PT-c1-011
  { text: "Em Évora, a Carolina ajuda o pai a fazer migas para o jantar.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Essen/Familie" }, // pt-PT-c1-012
  { text: "Perto de Beja, a Alice viu cavalos a correr no campo depois da chuva.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Tiere" }, // pt-PT-c1-013
  { text: "Em Mértola, o Lourenço tem baixa visão e lê o mapa com uma lupa grande.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Schule/Inklusion" }, // pt-PT-c1-014
  { text: "No Alqueva, a família do Salvador ficou a contar estrelas no céu escuro.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Natur/Familie" }, // pt-PT-c1-015
  { text: "Em Lagos, a Margarida aprendeu a nadar com a treinadora do clube.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Sport" }, // pt-PT-c1-016
  { text: "Na Ria Formosa, perto de Tavira, o Rodrigo viu um bando de flamingos.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Tiere" }, // pt-PT-c1-017
  { text: "Em Faro, a turma plantou uma amendoeira no pátio da escola.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Schule/Natur" }, // pt-PT-c1-018
  { text: "Em Loulé, o Vicente, que é cego, ouve as horas no relógio falante e nunca se atrasa.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Alltag/Inklusion" }, // pt-PT-c1-019
  { text: "Nas Furnas, em São Miguel, a Clara viu vapor quente a sair da terra.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Natur" }, // pt-PT-c1-020
  { text: "O Tomás e a avó foram ver baleias num barco que saiu da Horta.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Tiere/Familie" }, // pt-PT-c1-021
  { text: "Na ilha do Pico, o Simão subiu ao miradouro com a turma e o professor.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Schule/Natur" }, // pt-PT-c1-022
  { text: "Nas Sete Cidades, a Mafalda viu uma lagoa verde e outra azul.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Natur" }, // pt-PT-c1-023
  { text: "No Funchal, o Guilherme e o pai caminham ao lado de uma levada.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-024
  { text: "No Porto Santo, a Lara faz castelos de areia com a prima.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Spiel" }, // pt-PT-c1-025
  { text: "No Caniço, a avó da Diana faz bolo do caco para o lanche de sábado.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Essen/Familie" }, // pt-PT-c1-026
  { text: "No passeio da escola, a Joana, que anda de cadeira de rodas, mostra o caminho à turma.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Schule/Inklusion" }, // pt-PT-c1-027
  { text: "Escreve o teu nome devagar e depois tenta outra vez mais depressa.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Tippen" }, // pt-PT-c1-028
  { text: "O gato da Rita dorme em cima do teclado quando ela faz os trabalhos de casa.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Tiere" }, // pt-PT-c1-029
  { text: "Hoje é a minha vez de regar as plantas da sala de aula.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Schule" }, // pt-PT-c1-030
  { text: "No sábado de manhã, o Henrique e a irmã foram ao mercado do Bolhão, no Porto, com o avô.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Alltag" }, // pt-PT-c1-031.1
  { text: "Compraram laranjas, pão e um ramo de flores para a vizinha.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Alltag" }, // pt-PT-c1-031.2
  { text: "No regresso, o Henrique levou o saco mais pesado sem se queixar.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Alltag" }, // pt-PT-c1-031.3
  { text: "«Para a semana, escolho eu o caminho», disse ele.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Familie/Alltag" }, // pt-PT-c1-031.4
  { text: "Na Nazaré, a Eva tem aulas de surf todas as quintas.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Sport" }, // pt-PT-c1-032.1
  { text: "Primeiro aquece na areia, depois entra na água com a prancha.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Sport" }, // pt-PT-c1-032.2
  { text: "Ainda cai muitas vezes, mas já consegue ficar de pé durante alguns segundos.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Sport" }, // pt-PT-c1-032.3
  { text: "A treinadora diz que cair também faz parte de aprender.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Sport" }, // pt-PT-c1-032.4
  { text: "Na turma do Miguel, em Lisboa, há um colega novo, o Kofi, que chegou há pouco tempo a Portugal.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Schule/Freundschaft" }, // pt-PT-c1-033.1
  { text: "No primeiro dia, foi o Miguel quem lhe mostrou a biblioteca, o refeitório e o melhor banco do recreio.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Schule/Freundschaft" }, // pt-PT-c1-033.2
  { text: "Agora jogam à bola juntos em todos os intervalos, e o Kofi já ensinou à turma três palavras na língua dele.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Schule/Freundschaft" }, // pt-PT-c1-033.3
  { text: "A avó da Catarina vive numa aldeia perto de Évora.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-034.1
  { text: "Nas férias, a Catarina acorda cedo para regar a horta com ela.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-034.2
  { text: "Depois colhem tomates e pimentos para a salada do almoço.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-034.3
  { text: "À tarde faz muito calor, por isso ficam à sombra de um sobreiro a jogar às cartas.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-034.4
  { text: "O Dinis tem baixa visão e vai muitas vezes à praia de Albufeira com o pai e o irmão mais novo.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Inklusion" }, // pt-PT-c1-035.1
  { text: "Usa óculos de sol especiais, porque a luz forte o incomoda.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Inklusion" }, // pt-PT-c1-035.2
  { text: "Na água, conta as ondas pelo som e avisa o irmão quando vem uma maior.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Familie/Inklusion" }, // pt-PT-c1-035.3
  { text: "Ao fim do dia, os três constroem um castelo com torres altas.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Inklusion" }, // pt-PT-c1-035.4
  { text: "Na ilha Terceira, a escola da Laura organizou uma visita a uma quinta de gado leiteiro.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Schule/Tiere" }, // pt-PT-c1-036.1
  { text: "As crianças viram como se ordenham as vacas e provaram queijo fresco feito ali mesmo.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Schule/Tiere" }, // pt-PT-c1-036.2
  { text: "A Laura fez muitas perguntas à agricultora e escreveu tudo no caderno para contar à família ao jantar.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Schule/Tiere" }, // pt-PT-c1-036.3
  { text: "Em Ponta Delgada, a mãe do Pedro é cega e tem um cão de guia chamado Farol.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Familie/Inklusion" }, // pt-PT-c1-037.1
  { text: "De manhã, os três vão juntos até à escola.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Inklusion" }, // pt-PT-c1-037.2
  { text: "O Pedro sabe que não deve fazer festas ao Farol quando ele está a trabalhar.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Inklusion" }, // pt-PT-c1-037.3
  { text: "Ao fim da tarde, já em casa, o Farol pode brincar à vontade no quintal.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Inklusion" }, // pt-PT-c1-037.4
  { text: "No domingo, a família do Rafael fez uma caminhada ao longo de uma levada, no norte da Madeira.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-038.1
  { text: "O caminho era estreito e cheio de verde.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-038.2
  { text: "Passaram por um túnel escuro e o Rafael acendeu a lanterna.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-038.3
  { text: "No fim, havia uma cascata e todos molharam os pés na água fria.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Familie/Natur" }, // pt-PT-c1-038.4
  { text: "Na escola da Íris, no Funchal, cada turma tem um canteiro de flores.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Schule/Natur" }, // pt-PT-c1-039.1
  { text: "A turma dela escolheu estrelícias.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Schule/Natur" }, // pt-PT-c1-039.2
  { text: "Todas as semanas, duas crianças ficam responsáveis por regar e tirar as ervas daninhas.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Schule/Natur" }, // pt-PT-c1-039.3
  { text: "Na primavera, o canteiro ficou tão bonito que as famílias vieram tirar fotografias.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Schule/Natur" }, // pt-PT-c1-039.4
  { text: "Quando escreves sem olhar para o teclado, os dedos aprendem o caminho sozinhos.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Tippen" }, // pt-PT-c1-040.1
  { text: "No início parece difícil, mas cada dia é um bocadinho mais fácil.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Tippen" }, // pt-PT-c1-040.2
  { text: "Começa pelas teclas da fila do meio e respira com calma.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pt", topic: "Tippen" }, // pt-PT-c1-040.3
  { text: "Se errares, não faz mal: tenta outra vez.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "pt", topic: "Tippen" }, // pt-PT-c1-040.4
];
