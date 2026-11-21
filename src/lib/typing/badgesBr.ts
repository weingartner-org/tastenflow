/**
 * ★★★ DER ABZEICHEN-KATALOG PORTUGIESISCH (BRASILIEN) (O-INHALT-BR, 29.10.2026).
 *
 * Gegenstück zu `badgesCs.ts` - dieselbe Bauart, dieselben Schlüssel, NEU
 * AUF BRASILIANISCHEM PORTUGIESISCH GESCHRIEBEN, nicht übersetzt (Glossar
 * `recherche-portugiesisch-brasilien-2026-10-25/GLOSSAR-pt-BR.md` §2.4):
 * übertragen ist die IDEE des Namens. Wo das Brasilianische eine eigene
 * Wendung zum Motiv hat, steht sie da („Na mosca" zur Zielscheibe, „Ficha
 * limpa", „Como um relógio", „Rato de biblioteca", „Firme como uma rocha",
 * „A todo vapor!", „Fio da meada", „Lar, doce lar", „Dose dupla", „Um
 * brinco", „Chapeuzinho" für den Zirkumflex); sonst ein Stabreim wie im
 * Deutschen („Castor constante", „Leopardo leitor", „Raposa rápida",
 * „Preguiça sem pressa", „Tigre das mil teclas").
 *
 * ★★★ Geschlecht nie raten (Glossar Regel 2): KEINE Personenwörter für das
 * Kind („Mestre", „Campeão", „Vencedor", „Explorador" wären gegendert),
 * Adjektive nur an einem Tier oder Ding („Castor constante", „Dedos de
 * diamante"), nie am Kind. „Firme como uma rocha" und „Leve como uma pena"
 * sind erlaubt: „firme" und „leve" haben nur EINE Form. Die Beschreibungen
 * sind Sätze über die Sache - Hauptwort mit Partizip („5 lições
 * concluídas"), Partizip am Ding vorn („Desbloqueadas as letras ...") oder
 * Zahl + Hauptwort („100 rodadas de prática") - nie „Você concluiu ..." mit
 * einem Adjektiv dahinter.
 *
 * ★ Mehrzahl (Glossar §2.11, Regel 13): Die festen Zahlen stehen mit der
 * Form, die zu IHR gehört. Wo eine Zahl von aussen kommt (`z.fische` usw.),
 * wählt {@link br} die Form über `Intl.PluralRules("pt-BR")` - dort sind 0
 * UND 1 „one"; die Null bekommt darum die Mehrzahl („0 aventuras"), nie
 * „0 aventura". Zahlen ab 1.000 mit Punkt wie `Intl` „pt-BR" („1.000",
 * „10.000"), Prozent ohne Leerzeichen („95%", „0,5%"), Dezimalkomma.
 *
 * ★ Keine Zahl mit Punkt am Satzende: Uhrzeiten in Worten („depois das nove
 * da noite"), Summen in Klammern („(12 no total)").
 *
 * Grossschreibung brasilianisch: nur das erste Wort und Eigennamen („A
 * caverna do eco", „A nevasca", „Expedição polar"). Die trockenen
 * Zweitnamen (`nameNeutral`, ab 11 Jahren) genau dort, wo das Deutsche einen
 * hat. Glossar: medalha, rodada, toque, precisão, erro, posição inicial,
 * fileira central, fileira dos números, parte (Etappe einer Geschichte),
 * círculo de pontos, nível de dificuldade, ponto de partida, história,
 * Placas de gelo, Expedição polar, troféu; „meta" bleibt dem Wochenziel,
 * „coleção" der Wissens-Reihe. „fileira" ist die Tastenreihe - darum
 * „seguidas", nie „em fileira".
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - jede ID braucht einen
 * brasilianischen Eintrag und einen Zweitnamen genau dort, wo es ihn im
 * Deutschen gibt. Verteiler: `badges.ts` (`ABZEICHEN_JE_SPRACHE`,
 * `GRUPPEN_JE_SPRACHE`): ein Schlüssel, der hier fehlt, bleibt ENGLISCH.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextBr = AbzeichenTextEn;

/** Die Mehrzahl-Regel des brasilianischen Portugiesisch (CLDR): 0 und 1 „one", sonst „other" (Glossar §2.11). */
const PLURAL_BR = new Intl.PluralRules("pt-BR");

/**
 * Zahl mit der passenden Form: `br(5, "dia", "dias")`. Die Null nie über
 * `one` (Glossar Regel 13: „0 dia" wäre falsch) - sie bekommt die Mehrzahl.
 */
function br(n: number, one: string, other: string): string {
  const form = n !== 0 && PLURAL_BR.select(n) === "one" ? one : other;
  return `${n.toLocaleString("pt-BR")} ${form}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesCs.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} e ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_BR: Readonly<Record<string, string>> = {
  Fehlerfrei: "Sem erros",
  "Saubere Serie": "Rodadas perfeitas",
  Fleiß: "Dedicação",
  Anschläge: "Toques",
  Dranbleiben: "Persistência",
  Übungswochen: "Semanas de prática",
  Sterne: "Estrelas",
  Lektionen: "Lições",
  Stufen: "Níveis",
  Tastenwelt: "Mundo do teclado",
  "Sitzt!": "Aprendi!",
  Tempo: "Velocidade",
  "Am Stück": "De uma vez só",
  Meisterprüfung: "Maestria",
  Abenteuer: "Aventuras",
  "Abenteuer-Kunststücke": "Façanhas de aventura",
  Expedition: "Expedição",
  Geschichten: "Histórias",
  Lesestunde: "Hora da leitura",
  "Lese-Kunststücke": "Façanhas de leitura",
  Geheim: "Secretas",
};

/** Der ganze Katalog brasilianisch, je Abzeichen-ID. */
export const ABZEICHEN_BR: Readonly<Record<string, AbzeichenTextBr>> = {
  // ── Sem erros ────────────────────────────────────────────────────────────
  // „Na mosca" = genau ins Schwarze.
  volltreffer: { name: "Na mosca", description: "Uma rodada inteira sem nenhum erro.", bildbeschreibung: "alvo com uma flecha bem no centro" },
  "null-fehler-ninja": { name: "Ninja sem erros", description: "5 rodadas sem nenhum erro.", bildbeschreibung: "ninja" },
  "makellos-meister": { name: "Estrelas sem mancha", description: "15 rodadas sem nenhum erro.", bildbeschreibung: "três estrelas brilhantes" },
  "diamant-finger": { name: "Dedos de diamante", description: "40 rodadas sem nenhum erro.", bildbeschreibung: "pedra preciosa azul" },
  // „Ficha limpa" = eine weisse Weste haben.
  "weisse-weste": { name: "Ficha limpa", description: "80 rodadas sem nenhum erro.", bildbeschreibung: "pomba branca" },
  "einhorn-finger": { name: "Dedos de unicórnio", nameNeutral: "150 rodadas sem erros", description: "150 rodadas sem nenhum erro.", bildbeschreibung: "unicórnio" },
  // ── Rodadas perfeitas ────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Pinguim preciso", nameNeutral: "Três rodadas perfeitas", description: "3 rodadas perfeitas seguidas (precisão de pelo menos 95%).", bildbeschreibung: "pinguim" },
  adlerauge: { name: "Olho de águia", description: "7 rodadas perfeitas seguidas (precisão de pelo menos 95%).", bildbeschreibung: "águia" },
  "laser-lama": { name: "Lhama laser", nameNeutral: "Modo laser", description: "15 rodadas perfeitas seguidas (precisão de pelo menos 95%).", bildbeschreibung: "lhama" },
  "eiskalte-serie": { name: "Calma de gelo", description: "25 rodadas perfeitas seguidas (precisão de pelo menos 95%).", bildbeschreibung: "cubo de gelo" },
  // ── Dedicação ────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Pintinho das teclas", nameNeutral: "Primeira rodada", description: "A primeira rodada concluída.", bildbeschreibung: "pintinho saindo do ovo" },
  "ausdauer-ameise": { name: "Formiga fiel", nameNeutral: "Depois do aquecimento", description: "25 rodadas de prática.", bildbeschreibung: "formiga" },
  "marathon-maus": { name: "Ratinho maratonista", nameNeutral: "Cem rodadas", description: "100 rodadas de prática.", bildbeschreibung: "cabeça de ratinho" },
  "munteres-murmeltier": { name: "Castor constante", nameNeutral: "Maratona", description: "250 rodadas de prática.", bildbeschreibung: "castor" },
  dauerlaeufer: { name: "Longa distância", description: "500 rodadas de prática.", bildbeschreibung: "pessoa correndo" },
  // Wie „As mil e uma noites".
  tausendsassa: { name: "Mil e uma rodadas", nameNeutral: "Mil rodadas", description: "1.000 rodadas de prática.", bildbeschreibung: "baleia soltando água" },
  // ── Toques ───────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Tigre das mil teclas", nameNeutral: "Mil toques certos", description: "1.000 toques certos.", bildbeschreibung: "cabeça de tigre" },
  "tasten-t-rex": { name: "Tiranossauro das teclas", nameNeutral: "Dez mil toques certos", description: "10.000 toques certos.", bildbeschreibung: "tiranossauro" },
  "galaktische-fingerspitzen": { name: "Dedos galácticos", description: "50.000 toques certos.", bildbeschreibung: "foguete decolando" },
  "hunderttausend-held": { name: "Cem mil raios", nameNeutral: "Cem mil toques certos", description: "100.000 toques certos.", bildbeschreibung: "raio amarelo" },
  viertelmillion: { name: "Um quarto de milhão", description: "250.000 toques certos - é o número de letras de um livro inteiro.", bildbeschreibung: "satélite" },
  // ── Persistência ─────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Texugo tenaz", nameNeutral: "Persistência", description: "3 dias diferentes de prática.", bildbeschreibung: "texugo" },
  gewohnheitstier: { name: "Tartaruga fiel", description: "7 dias diferentes de prática.", bildbeschreibung: "tartaruga" },
  "wie-ein-uhrwerk": { name: "Como um relógio", description: "20 dias diferentes de prática.", bildbeschreibung: "despertador vermelho" },
  unaufhaltsam: { name: "Sem parar", description: "50 dias diferentes de prática.", bildbeschreibung: "montanha com o pico nevado" },
  "tief-verwurzelt": { name: "Raízes profundas", description: "100 dias diferentes de prática.", bildbeschreibung: "árvore grande e verde, cheia de folhas" },
  // „firme" hat nur eine Form - das Adjektiv verrät kein Geschlecht (Glossar §2.4 nennt die Wendung).
  "fels-in-der-brandung": { name: "Firme como uma rocha", description: "200 dias diferentes de prática - quase todos os dias de um ano letivo inteiro.", bildbeschreibung: "estátua de pedra da Ilha de Páscoa" },
  // ── Semanas de prática ───────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Três meses de estrada", description: "12 semanas diferentes de prática.", bildbeschreibung: "folha marrom de outono" },
  "halbes-jahr-dabei": { name: "Meio ano de estrada", description: "26 semanas diferentes de prática.", bildbeschreibung: "nuvem com neve caindo" },
  "ganzes-jahr-dabei": { name: "Um ano inteiro", description: "52 semanas diferentes de prática.", bildbeschreibung: "bolo de aniversário com vela" },
  // ── Estrelas ─────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Estrela cadente", description: "A primeira rodada com 3 estrelas.", bildbeschreibung: "estrela cadente no céu noturno" },
  "sternen-sammler": { name: "Punhado de estrelas", description: "10 rodadas com 3 estrelas.", bildbeschreibung: "estrela amarela brilhante" },
  sternenhimmel: { name: "Céu estrelado", description: "30 rodadas com 3 estrelas.", bildbeschreibung: "Via Láctea no céu noturno" },
  sternenmeer: { name: "Mar de estrelas", description: "75 rodadas com 3 estrelas.", bildbeschreibung: "estrela laranja de oito pontas" },
  // ── Lições ───────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Leão das lições", nameNeutral: "Cinco lições", description: "5 lições concluídas.", bildbeschreibung: "leão" },
  "kapitel-kaeptn": { name: "A todo vapor!", description: "15 lições concluídas.", bildbeschreibung: "âncora" },
  // Die Lektionszahl DES WEGES in Klammern - keine Zahl mit Punkt am Satzende.
  "lehrgangs-legende": { name: "Lenda do curso", description: (z) => `Todas as lições do curso concluídas (${lektionenFuer(z.lernweg).length} no total).`, bildbeschreibung: "troféu dourado" },
  // ── Níveis (círculo de pontos) ───────────────────────────────────────────
  "kletter-koala": { name: "Coala escalador", nameNeutral: "Nível 5", description: "Nível 5 alcançado no círculo de pontos.", bildbeschreibung: "coala" },
  "punkte-rakete": { name: "Balão de pontos", description: "Nível 10 alcançado no círculo de pontos.", bildbeschreibung: "balão vermelho" },
  "gipfel-gaemse": { name: "Cabra no topo", nameNeutral: "Nível 20", description: "Nível 20 alcançado no círculo de pontos.", bildbeschreibung: "cabra" },
  hoehenflug: { name: "Voo alto", nameNeutral: "Nível 50", description: "Nível 50 alcançado no círculo de pontos.", bildbeschreibung: "helicóptero" },
  "ueber-den-wolken": { name: "Acima das nuvens", nameNeutral: "Nível 100", description: "Nível 100 alcançado no círculo de pontos.", bildbeschreibung: "disco voador" },
  sternenreise: { name: "Viagem às estrelas", nameNeutral: "Nível 200", description: "Nível 200 alcançado no círculo de pontos.", bildbeschreibung: "cometa com uma cauda longa" },
  // ── Mundo do teclado ─────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „br": a s d f j k l ç.
  "grundstellungs-gorilla": {
    name: "Gorila da fileira central",
    nameNeutral: "Fileira central completa",
    description: (z) =>
      `Desbloqueadas as oito teclas da posição inicial: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "gorila",
  },
  "gross-baumeister": { name: "Castelo de maiúsculas", nameNeutral: "Letras maiúsculas", description: "A tecla Shift dominada - letras maiúsculas de verdade, com as próprias mãos.", bildbeschreibung: "quatro letras maiúsculas em teclas azuis" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „br" nicht zu
  // verdienen - der Eintrag steht trotzdem da, weil das Regal jedes beschreibt.
  "puenktchen-panda": { name: "Panda de pontinhos", nameNeutral: "Tremas do alemão", description: "Desbloqueadas as letras ä, ö e ü - letras do alemão com dois pontinhos.", bildbeschreibung: "panda" },
  "schlangen-s": { name: "S de serpente", nameNeutral: "O s alemão", description: "Desbloqueado o ß, o s alemão - a última letra do teclado alemão.", bildbeschreibung: "cobra" },
  "alphabet-as": { name: "O alfabeto inteiro", description: "Desbloqueadas todas as letras de A a Z.", bildbeschreibung: "letras minúsculas em teclas azuis" },
  // Nicht „Ponto e vírgula" - so heisst das Zeichen ; (Glossar §2.8).
  "punkt-und-komma": { name: "O ponto e a vírgula", description: "Desbloqueados o ponto e a vírgula - os primeiros sinais de pontuação de verdade.", bildbeschreibung: "caneta-tinteiro preta" },
  // Nicht „Coleção" - das Wort gehört der Wissens-Reihe (Glossar §2.2).
  "satzzeichen-sammler": { name: "Caixa de sinais", nameNeutral: "Toda a pontuação", description: "Desbloqueados os sinais de pontuação: . , - ? ! : ;", bildbeschreibung: "grande ponto de exclamação vermelho" },
  "zahlen-zebra": { name: "Zebra dos números", nameNeutral: "Metade dos algarismos", description: "Desbloqueados cinco algarismos da fileira dos números.", bildbeschreibung: "zebra" },
  "zahlen-zauberer": { name: "Mágica dos números", nameNeutral: "Fileira dos números completa", description: "Desbloqueados todos os algarismos, do 1 ao 0 - a fileira dos números inteira.", bildbeschreibung: "tecla azul com o número dez" },
  "klammer-krokodil": { name: "Crocodilo entre parênteses", nameNeutral: "Parênteses", description: "Desbloqueados os parênteses ( ) - os primeiros símbolos.", bildbeschreibung: "crocodilo" },
  "alltags-ass": { name: "Sinais do dia a dia", nameNeutral: "Símbolos do cotidiano", description: (z) => `Desbloqueado: ${alltagsZeichen(z)} - sinais dos e-mails e do mundo do dinheiro.`, bildbeschreibung: "envelope" },
  "tastatur-krone": { name: "Coroa do teclado", nameNeutral: "O teclado inteiro", description: "Desbloqueadas TODAS as teclas do teclado - até o último símbolo.", bildbeschreibung: "coroa dourada" },
  // ── Aprendi! ─────────────────────────────────────────────────────────────
  "feste-burg": { name: "Lar, doce lar", nameNeutral: "Fileira central segura", description: "Todas as teclas da posição inicial estão seguras.", bildbeschreibung: "casa" },
  "buchstaben-baendiger": { name: "Letras domadas", nameNeutral: "Todas as letras seguras", description: "Todas as letras estão seguras - nenhuma está insegura.", bildbeschreibung: "quadrado vermelho com um A maiúsculo" },
  "zahlen-fels": { name: "Números de pedra", nameNeutral: "Todos os algarismos seguros", description: "A fileira dos números inteira está segura.", bildbeschreibung: "ábaco com bolinhas coloridas" },
  "nichts-wackelt": { name: "Nada balança", description: "Todas as teclas do teclado estão seguras - o teclado inteiro, não só as teclas desbloqueadas.", bildbeschreibung: "losango azul com um ponto no meio" },
  // ── Velocidade ───────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Raposa rápida", nameNeutral: "Velocidade com precisão", description: "A velocidade pedida E, junto, precisão de pelo menos 95% - a velocidade só conta quando a digitação é precisa.", bildbeschreibung: "raposa" },
  "tempo-60": { name: "Coelho saltitante", nameNeutral: "60 por minuto, com precisão", description: "Uma rodada a 60 toques por minuto com precisão de pelo menos 95%.", bildbeschreibung: "coelho" },
  "tempo-90": { name: "Corça ligeira", nameNeutral: "90 por minuto, com precisão", description: "Uma rodada a 90 toques por minuto com precisão de pelo menos 95%.", bildbeschreibung: "corça" },
  "tempo-120": { name: "Cavalo a galope", nameNeutral: "120 por minuto, com precisão", description: "Uma rodada a 120 toques por minuto com precisão de pelo menos 98%.", bildbeschreibung: "cavalo galopando" },
  "tempo-160": { name: "Locomotiva a vapor", nameNeutral: "160 por minuto, com precisão", description: "Uma rodada a 160 toques por minuto com precisão de pelo menos 98%.", bildbeschreibung: "locomotiva a vapor" },
  "tempo-200": { name: "Trem-bala", nameNeutral: "200 por minuto, com precisão", description: "Uma rodada a 200 toques por minuto com precisão de pelo menos 98%.", bildbeschreibung: "trem rápido" },
  "tempo-300": { name: "Avião a jato", nameNeutral: "300 por minuto, com precisão", description: "Uma rodada a 300 toques por minuto com precisão de pelo menos 99% - nível profissional.", bildbeschreibung: "avião pequeno" },
  // ── De uma vez só ────────────────────────────────────────────────────────
  "kette-100": { name: "Reação em cadeia", nameNeutral: "100 seguidos", description: "100 toques certos seguidos, sem nenhum erro.", bildbeschreibung: "dois elos de corrente" },
  "kette-250": { name: "Sem tropeço", description: "250 toques certos seguidos.", bildbeschreibung: "corrente de vários elos" },
  // „Não perder o fio da meada" = den roten Faden nicht verlieren.
  "kette-500": { name: "Fio da meada", nameNeutral: "500 seguidos", description: "500 toques certos seguidos - mais que uma rodada inteira.", bildbeschreibung: "carretel de linha" },
  "kette-1000": { name: "Mil sem erro", description: "1.000 toques certos seguidos.", bildbeschreibung: "monte Fuji com o pico nevado" },
  "kette-2000": { name: "Corrente de ferro", nameNeutral: "2.000 seguidos", description: "2.000 toques certos seguidos - quatro ou cinco rodadas sem a menor hesitação.", bildbeschreibung: "vulcão soltando lava" },
  // ── Aventuras (jogo „Placas de gelo", Glossar §2.3) ─────────────────────
  "erste-expedition": { name: "Primeira expedição", description: "A primeira aventura nas placas de gelo no jogo livre - até o iglu.", bildbeschreibung: "bússola" },
  // Nicht „Explorador polar" (Personenwort, gegendert).
  polarforscher: { name: "Descobertas polares", description: "10 aventuras concluídas nas placas de gelo no jogo livre.", bildbeschreibung: "floco de neve" },
  "eismeer-legende": { name: "Lenda do mar gelado", description: "30 aventuras concluídas nas placas de gelo no jogo livre.", bildbeschreibung: "onda azul alta" },
  "packeis-profi": { name: "Campo de gelo vencido", nameNeutral: "60 aventuras", description: "60 aventuras concluídas nas placas de gelo no jogo livre.", bildbeschreibung: "mala de viagem" },
  // ── Façanhas de aventura ─────────────────────────────────────────────────
  // „Trockener Frack": der Pinguin trägt „fraque" - brasilianisch „pinguim de fraque".
  "trockener-frack": { name: "Fraque sequinho", description: "Uma aventura inteira sem nenhuma queda na água ou na neve.", bildbeschreibung: "cartola preta" },
  "immer-trocken": { name: "Sempre no seco", description: (z) => `${br(z.trockeneAbenteuer, "aventura", "aventuras")} sem nenhuma queda na água.`, bildbeschreibung: "guarda-chuva fechado" },
  fischfaenger: { name: "Boa pescaria", description: (z) => `${br(z.fische, "peixe bônus pescado", "peixes bônus pescados")} nas placas de gelo.`, bildbeschreibung: "peixe azul" },
  // ── Expedição ────────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (Glossar §2.3): A caverna do eco, A nevasca,
  // A estação polar.
  "hoehlen-lauscher": { name: "Ouvido de morcego", description: "A caverna do eco inteira, até a saída - no escuro, só pelo som.", bildbeschreibung: "morcego" },
  "sturm-trotzer": { name: "A nevasca vencida", description: "A nevasca superada - sequências de caracteres digitadas de memória.", bildbeschreibung: "rosto soprando vento" },
  "funker-freund": { name: "Amigos pelo rádio", description: "Uma mensagem de rádio inteira decifrada e enviada para a estação polar.", bildbeschreibung: "rádio" },
  "polarlicht-entdecker": { name: "Sob a aurora polar", description: "A expedição polar inteira sem nenhum erro - a aurora polar dança.", bildbeschreibung: "estrela com um rastro de faíscas" },
  // ── Histórias ────────────────────────────────────────────────────────────
  "lese-luchs": { name: "Leopardo leitor", nameNeutral: "Primeira história", description: "A primeira história lida e digitada até o fim.", bildbeschreibung: "leopardo" },
  // „Rato de biblioteca" = Bücherwurm (Glossar §2.4).
  buecherwurm: { name: "Rato de biblioteca", description: "3 histórias lidas até o fim.", bildbeschreibung: "lagarta verde" },
  "buecherei-baer": { name: "Urso da biblioteca", nameNeutral: "Oito histórias", description: "8 histórias lidas até o fim.", bildbeschreibung: "urso" },
  vielleser: { name: "Montanha de livros", description: "15 histórias lidas até o fim.", bildbeschreibung: "pilha de livros coloridos" },
  // ── Hora da leitura (parte = Etappe einer Geschichte) ───────────────────
  "seiten-spatz": { name: "Pardal da primeira página", nameNeutral: "Primeira página", description: "A primeira parte de uma história digitada.", bildbeschreibung: "passarinho azul" },
  "kapitel-krake": { name: "Polvo de muitas páginas", nameNeutral: "Dez partes", description: "10 partes lidas e digitadas.", bildbeschreibung: "polvo" },
  "geschichten-gigant": { name: "Elefante de histórias", description: "30 partes lidas e digitadas.", bildbeschreibung: "elefante" },
  leseratte: { name: "Leitura sem fim", nameNeutral: "75 partes", description: "75 partes lidas e digitadas.", bildbeschreibung: "rolo de pergaminho" },
  // ── Façanhas de leitura ──────────────────────────────────────────────────
  // „leve" hat nur eine Form.
  federleicht: { name: "Leve como uma pena", description: "Uma parte inteira digitada sem nenhum erro.", bildbeschreibung: "pena branca" },
  // Nicht „De uma vez só" - so heisst schon die Familie „Am Stück".
  "in-einem-rutsch": { name: "Num fôlego só", description: "Uma história inteira lida até o fim num único dia.", bildbeschreibung: "espiral azul" },
  "lesezeichen-held": { name: "Marcador no lugar", description: "Leitura em outro dia, exatamente onde parou da última vez.", bildbeschreibung: "marcador de livro" },
  // ── Maestria (Glossar §2.4: „Maestria", nie „prova") ────────────────────
  "zehn-minuten-abschrift": { name: "Cópia de dez minutos", description: "Dez minutos copiando um texto sem pausa e com no máximo 0,5% de erros - como num campeonato de verdade.", bildbeschreibung: "cronômetro" },
  "lehrgangs-meister": { name: "Curso dominado", description: (z) => `Todas as lições do curso concluídas, cada uma com três estrelas (${lektionenFuer(z.lernweg).length} no total).`, bildbeschreibung: "chapéu de formatura preto" },
  "goldene-tastatur": { name: "Teclado de ouro", description: "Todas as teclas desbloqueadas e seguras - e, além disso, uma vez 160 toques por minuto com precisão de 98%. A última medalha.", bildbeschreibung: "medalha esportiva com fita" },
  // ── Secretas ─────────────────────────────────────────────────────────────
  // Wortspiel: „preguiça" ist das Faultier.
  "gemuetliches-faultier": { name: "Preguiça sem pressa", description: "Bem devagar, mas sem nenhum erro - a precisão vale mais que a velocidade!", bildbeschreibung: "bicho-preguiça" },
  "comeback-kaenguru": { name: "Salto de canguru", description: "Uma rodada com 3 estrelas logo depois de uma rodada com 1 estrela.", bildbeschreibung: "canguru" },
  // Uhrzeiten in Worten - keine Zahl mit Punkt am Satzende.
  nachteule: { name: "Coruja da noite", description: "Uma rodada concluída depois das nove da noite.", bildbeschreibung: "coruja" },
  "frueher-vogel": { name: "Galo madrugador", description: "Uma rodada concluída antes das sete da manhã.", bildbeschreibung: "galo" },
  nimmersatt: { name: "Fome de leitura", description: "3 partes de uma história devoradas num único dia.", bildbeschreibung: "maçã verde" },
  // Die Regel zählt Juli und August (in Brasilien die Ferien zur Jahresmitte, nicht der Sommer).
  "ferien-held": { name: "Férias no teclado", description: "Prática em julho ou em agosto.", bildbeschreibung: "praia com guarda-sol" },
  "wochenend-schreiber": { name: "Fim de semana no teclado", description: "Prática no sábado e também no domingo.", bildbeschreibung: "folha de calendário" },
  "zurueck-im-sattel": { name: "De volta à sela", description: (z) => `Volta à prática depois de uma pausa de mais de ${br(z.pauseTage, "dia", "dias")} - voltar também conta.`, bildbeschreibung: "duas setas em círculo" },
  "doppelt-genaeht": { name: "Dose dupla", description: "Duas rodadas sem erro, uma logo depois da outra.", bildbeschreibung: "agulha com linha" },
  // Dezember und Januar sind in Brasilien Sommer - darum der Monat, nicht „inverno".
  winterkind: { name: "Boneco de neve", description: "Prática em dezembro ou em janeiro, na virada do ano.", bildbeschreibung: "boneco de neve" },
  jahreswechsel: { name: "Réveillon", description: "Prática no último dia do ano ou no primeiro dia do ano novo.", bildbeschreibung: "fogos de artifício no céu noturno" },
  "tages-marathon": { name: "Maratona de um dia", description: "Dez rodadas num único dia.", bildbeschreibung: "jóquei montado num cavalo de corrida" },
  sternentag: { name: "Dia de estrelas", description: "Três rodadas com três estrelas num único dia.", bildbeschreibung: "sol com rosto" },
  // „Limpo como um brinco" = blitzsauber.
  blitzsauber: { name: "Um brinco", description: "Três rodadas sem erro num único dia.", bildbeschreibung: "sabonete com espuma" },
  "volle-woche": { name: "Semana cheia", description: "Cinco dias diferentes de prática em UMA semana.", bildbeschreibung: "livro verde" },
  // „Blindflug" ⇒ „Sem espiar": zum Äffchen, das sich die Augen zuhält.
  // Glossar Regel 4: nie „às cegas", nie „digitação cega".
  blindflug: { name: "Sem espiar", description: "Uma rodada inteira sem erro - com o teclado da tela escondido. É disso que se trata a digitação com os dez dedos.", bildbeschreibung: "macaquinho tapando os olhos" },
  sprachwechsler: { name: "Viagem entre idiomas", description: "Prática em dois idiomas - por exemplo, em português e em inglês.", bildbeschreibung: "globo com a Europa e a África" },
  lesenacht: { name: "Leitura noturna", description: "Uma parte de uma história lida depois das oito da noite.", bildbeschreibung: "lua com rosto" },
  "zaehe-taste": { name: "Tecla teimosa", description: "Uma tecla que deu trabalho por muito tempo agora está segura.", bildbeschreibung: "caracol" },
  aufsteiger: { name: "Ladeira acima", description: "Cinco níveis de dificuldade acima do ponto de partida.", bildbeschreibung: "gráfico com uma linha que sobe" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine brasilianische Bedienung
  // auf diesem Weg; dieselben Gedanken wie dort.
  "akzente-ziffernreihe": { name: "Acrobacia de acentos", nameNeutral: "é, è, ç e à", description: "Desbloqueadas as letras é, è, ç e à - letras que moram na fileira dos números do teclado francês.", bildbeschreibung: "algarismos 1 2 3 4 numa tecla azul" },
  // „Chapeuzinho" nennen Kinder in Brasilien den Zirkumflex.
  "accent-circonflexe": { name: "Chapeuzinho", nameNeutral: "Circunflexo do francês", description: "A tecla de acento ^ está segura: ê, â, î, ô e û.", bildbeschreibung: "chapéu de palha com fita" },
  trema: { name: "Joaninha de dois pontinhos", nameNeutral: "Trema", description: "A tecla de acento ¨ está segura: ë, ï e ü.", bildbeschreibung: "joaninha" },
};
