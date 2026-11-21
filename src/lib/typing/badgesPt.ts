/**
 * ★★★ DER ABZEICHEN-KATALOG PORTUGIESISCH (PORTUGAL) (O-INHALT-PT, 29.10.2026).
 *
 * Bis 29.10.2026 ein leerer Einhängepunkt (G3c-VERTEILER, 25.10.2026 - leer hiess: der englische Katalog). Jetzt das Gegenstück zu
 * `badgesCs.ts` - dieselbe Bauart, dieselben Schlüssel, NEU AUF EUROPÄISCHEM PORTUGIESISCH GESCHRIEBEN, nicht übersetzt (Glossar
 * `recherche-portugiesisch-2026-10-25/GLOSSAR-pt.md` §2.4): übertragen ist die IDEE des Namens. Wo das Portugiesische eine eigene
 * Wendung zum Motiv hat, steht sie da („Rato de biblioteca", „Firme como uma rocha", „Como um relógio", „O fio à meada",
 * „De pedra e cal", „Tudo num brinco", „Quem cedo madruga", „A todo o vapor!", „Passagem de ano", „Mil e uma rondas");
 * sonst ein Stabreim wie im Deutschen („Pinguim preciso", „Texugo teimoso", „Lebre ligeira", „Veado veloz", „Castor constante").
 * Verteiler: `badges.ts` (`ABZEICHEN_JE_SPRACHE`, `GRUPPEN_JE_SPRACHE`, `eintraegeOderEn`).
 *
 * ★★★ Geschlecht nie raten (Glossar Regel 2): KEINE Personenwörter für das Kind („Mestre", „Campeão", „Vencedor",
 * „Explorador", „Construtor" wären gegendert), Adjektive und Partizipien nur an einem Tier oder Ding („Formiga incansável",
 * „Tempestade vencida", „Letras domadas"), nie am Kind. Die zwei Vergleiche „Firme como uma rocha" und „Leve como uma pena"
 * tragen Adjektive, die in beiden Geschlechtern gleich lauten. Die Beschreibungen sind Sätze über die Sache - Hauptwort mit
 * Partizip („5 lições concluídas"), Partizip am Ding („Desbloqueados o ponto e a vírgula") oder Zahl + Hauptwort („100 rondas
 * de prática") - nie eine Vergangenheit der 2. Person mit Geschlecht.
 *
 * ★ Zahlen (Glossar Regel 5, §2.10, gemessen `Intl` „pt-PT"): Tausender-Leerzeichen erst AB FÜNF STELLEN, als geschütztes
 * Leerzeichen („10 000", „250 000"), vierstellig ohne („1000", „2000"); Prozent ohne Leerzeichen („95%"), Dezimalkomma
 * („0,5%"). Mehrzahl (§2.11): Die festen Zahlen stehen mit ihrer Form; wo eine Zahl von aussen kommt (`z.fische` usw.), wählt
 * {@link pt} die Form über `Intl.PluralRules("pt-PT")` - 0 ist dort Mehrzahl, `many` (eine Million) bekommt „de".
 * Ordnungszahlen nie als „2.º" (Glossar §4 Falle 2); Uhrzeiten in Worten („depois das nove da noite").
 *
 * Satzschreibung wie im ganzen Tastenflow, Eigennamen der Expedition gross (A Gruta do Eco, A Tempestade de Neve, A Estação
 * Polar, Expedição polar). Glossar: medalha, ronda, toque, precisão, erro, posição inicial, fila de base, fila dos números,
 * parte (Geschichte), círculo de pontos, nível de dificuldade, ponto de partida, história, Blocos de gelo, dominada,
 * em consolidação; „objetivo" bleibt dem Wochenziel. „fila" ist die Tastenreihe - darum „seguidas", nie „em fila".
 * Keine Wörter aus Brasilien (prêmio, ônibus, trem, tela), nichts aus der Sperrliste des Bauplans §3.
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - jede ID braucht einen portugiesischen Eintrag und einen Zweitnamen
 * (`nameNeutral`, ab 11 Jahren) genau dort, wo es ihn im Deutschen gibt. Ungeprüft von Muttersprachlern (Glossar §5).
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextPt = AbzeichenTextEn;

/** Die Mehrzahl-Regel des europäischen Portugiesisch (CLDR, gemessen): one · many · other (Glossar §2.11). */
const PLURAL_PT = new Intl.PluralRules("pt-PT");

/**
 * Zahl mit der passenden Form: `pt(5, "dia", "dias")`. 1 ist `one`, 0 und alle anderen `other`; `many` (1 000 000) braucht
 * „de" vor dem Hauptwort („1 000 000 de dias", Glossar §2.11).
 */
function pt(n: number, one: string, other: string): string {
  const k = PLURAL_PT.select(n);
  const form = k === "one" ? one : k === "many" ? `de ${other}` : other;
  return `${n.toLocaleString("pt-PT")} ${form}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesCs.ts`), „a, b e c". */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} e ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_PT: Readonly<Record<string, string>> = {
  Fehlerfrei: "Sem erros",
  "Saubere Serie": "Rondas perfeitas",
  Fleiß: "Empenho",
  Anschläge: "Toques",
  Dranbleiben: "Persistência",
  Übungswochen: "Semanas de prática",
  Sterne: "Estrelas",
  Lektionen: "Lições",
  Stufen: "Níveis",
  Tastenwelt: "O mundo do teclado",
  "Sitzt!": "Já sei!",
  Tempo: "Velocidade",
  "Am Stück": "De uma assentada",
  Meisterprüfung: "Mestria",
  Abenteuer: "Aventuras",
  "Abenteuer-Kunststücke": "Proezas de aventura",
  Expedition: "Expedição",
  Geschichten: "Histórias",
  Lesestunde: "Hora da leitura",
  "Lese-Kunststücke": "Proezas de leitura",
  Geheim: "Segredos",
};

/** Der ganze Katalog portugiesisch, je Abzeichen-ID. */
export const ABZEICHEN_PT: Readonly<Record<string, AbzeichenTextPt>> = {
  // ── Sem erros ────────────────────────────────────────────────────────────
  // „Em cheio" = mitten ins Ziel.
  volltreffer: { name: "Em cheio", description: "Uma ronda inteira sem nenhum erro.", bildbeschreibung: "um alvo com uma seta mesmo no centro" },
  "null-fehler-ninja": { name: "Ninja sem erros", description: "5 rondas sem nenhum erro.", bildbeschreibung: "um ninja" },
  "makellos-meister": { name: "Estrelas sem mancha", description: "15 rondas sem nenhum erro.", bildbeschreibung: "três estrelas a brilhar" },
  "diamant-finger": { name: "Dedos de diamante", description: "40 rondas sem nenhum erro.", bildbeschreibung: "uma pedra preciosa azul" },
  // „Sem mácula" = ohne Flecken (die weisse Weste); nicht „Ficha limpa" - „ficha" ist in Portugal die Klassenarbeit.
  "weisse-weste": { name: "Sem mácula", description: "80 rondas sem nenhum erro.", bildbeschreibung: "uma pomba branca" },
  "einhorn-finger": { name: "Dedos de unicórnio", nameNeutral: "150 rondas sem erros", description: "150 rondas sem nenhum erro.", bildbeschreibung: "um unicórnio" },
  // ── Rondas perfeitas ─────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Pinguim preciso", nameNeutral: "Três seguidas", description: "3 rondas perfeitas seguidas (precisão de pelo menos 95%).", bildbeschreibung: "um pinguim" },
  adlerauge: { name: "Olho de águia", description: "7 rondas perfeitas seguidas (precisão de pelo menos 95%).", bildbeschreibung: "uma águia" },
  "laser-lama": { name: "Lama laser", nameNeutral: "Modo laser", description: "15 rondas perfeitas seguidas (precisão de pelo menos 95%).", bildbeschreibung: "um lama" },
  // „Sangue-frio" = kühler Kopf - die eiskalte Serie.
  "eiskalte-serie": { name: "Sangue-frio", description: "25 rondas perfeitas seguidas (precisão de pelo menos 95%).", bildbeschreibung: "um cubo de gelo" },
  // ── Empenho ──────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Pintainho das teclas", nameNeutral: "Primeira ronda", description: "A primeira ronda terminada.", bildbeschreibung: "um pintainho a sair do ovo" },
  "ausdauer-ameise": { name: "Formiga incansável", nameNeutral: "Aquecimento feito", description: "25 rondas de prática.", bildbeschreibung: "uma formiga" },
  "marathon-maus": { name: "Ratinho maratonista", nameNeutral: "Cem rondas", description: "100 rondas de prática.", bildbeschreibung: "a cabeça de um ratinho" },
  "munteres-murmeltier": { name: "Castor constante", nameNeutral: "Maratona", description: "250 rondas de prática.", bildbeschreibung: "um castor" },
  // „Corrida de fundo" = Langstreckenlauf.
  dauerlaeufer: { name: "Corrida de fundo", description: "500 rondas de prática.", bildbeschreibung: "uma pessoa a correr" },
  // Wie „As mil e uma noites".
  tausendsassa: { name: "Mil e uma rondas", nameNeutral: "Mil rondas", description: "1000 rondas de prática.", bildbeschreibung: "uma baleia a deitar água" },
  // ── Toques ───────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Tigre das mil teclas", nameNeutral: "Mil toques certos", description: "1000 toques certos.", bildbeschreibung: "a cabeça de um tigre" },
  "tasten-t-rex": { name: "T-rex das teclas", nameNeutral: "Dez mil toques certos", description: "10 000 toques certos.", bildbeschreibung: "um tiranossauro" },
  "galaktische-fingerspitzen": { name: "Dedos galácticos", description: "50 000 toques certos.", bildbeschreibung: "um foguetão a levantar voo" },
  "hunderttausend-held": { name: "Cem mil relâmpagos", nameNeutral: "Cem mil toques certos", description: "100 000 toques certos.", bildbeschreibung: "um relâmpago amarelo" },
  viertelmillion: { name: "Um quarto de milhão", description: "250 000 toques certos - tantas letras como um livro inteiro.", bildbeschreibung: "um satélite" },
  // ── Persistência ─────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Texugo teimoso", nameNeutral: "Persistência", description: "3 dias diferentes de prática.", bildbeschreibung: "um texugo" },
  gewohnheitstier: { name: "Tartaruga fiel", description: "7 dias diferentes de prática.", bildbeschreibung: "uma tartaruga" },
  // „Funciona como um relógio."
  "wie-ein-uhrwerk": { name: "Como um relógio", description: "20 dias diferentes de prática.", bildbeschreibung: "um despertador vermelho" },
  // „Sem travões" = ohne Bremsen, nicht aufzuhalten.
  unaufhaltsam: { name: "Sem travões", description: "50 dias diferentes de prática.", bildbeschreibung: "uma montanha com o cume nevado" },
  "tief-verwurzelt": { name: "Raízes fundas", description: "100 dias diferentes de prática.", bildbeschreibung: "uma grande árvore verde" },
  // „firme" ist in beiden Geschlechtern gleich (Glossar §2.4 nennt die Wendung).
  "fels-in-der-brandung": { name: "Firme como uma rocha", description: "200 dias diferentes de prática - quase todos os dias de um ano letivo.", bildbeschreibung: "uma estátua de pedra da Ilha de Páscoa" },
  // ── Semanas de prática ───────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Já lá vai um trimestre", description: "12 semanas diferentes de prática.", bildbeschreibung: "uma folha castanha de outono" },
  "halbes-jahr-dabei": { name: "Já lá vai meio ano", description: "26 semanas diferentes de prática.", bildbeschreibung: "uma nuvem a deitar neve" },
  "ganzes-jahr-dabei": { name: "Um ano inteiro", description: "52 semanas diferentes de prática.", bildbeschreibung: "um bolo de aniversário com uma vela" },
  // ── Estrelas ─────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Estrela cadente", description: "A primeira ronda com 3 estrelas.", bildbeschreibung: "uma estrela cadente no céu noturno" },
  "sternen-sammler": { name: "Mão-cheia de estrelas", description: "10 rondas com 3 estrelas.", bildbeschreibung: "uma estrela amarela a brilhar" },
  sternenhimmel: { name: "Céu estrelado", description: "30 rondas com 3 estrelas.", bildbeschreibung: "a Via Láctea no céu noturno" },
  sternenmeer: { name: "Mar de estrelas", description: "75 rondas com 3 estrelas.", bildbeschreibung: "uma estrela cor de laranja de oito pontas" },
  // ── Lições ───────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Leão das lições", nameNeutral: "Cinco lições", description: "5 lições concluídas.", bildbeschreibung: "um leão" },
  "kapitel-kaeptn": { name: "A todo o vapor!", description: "15 lições concluídas.", bildbeschreibung: "uma âncora" },
  // Die Zahl der Lektionen DES WEGES in Klammern.
  "lehrgangs-legende": { name: "Lenda do curso", description: (z) => `Todas as lições do curso concluídas (${lektionenFuer(z.lernweg).length} ao todo).`, bildbeschreibung: "uma taça dourada" },
  // ── Níveis (círculo de pontos) ───────────────────────────────────────────
  "kletter-koala": { name: "Coala trepador", nameNeutral: "Nível 5", description: "Nível 5 alcançado no círculo de pontos.", bildbeschreibung: "um coala" },
  "punkte-rakete": { name: "Foguetão de pontos", description: "Nível 10 alcançado no círculo de pontos.", bildbeschreibung: "um balão vermelho" },
  "gipfel-gaemse": { name: "Camurça no cume", nameNeutral: "Nível 20", description: "Nível 20 alcançado no círculo de pontos.", bildbeschreibung: "uma cabra" },
  hoehenflug: { name: "Voo alto", nameNeutral: "Nível 50", description: "Nível 50 alcançado no círculo de pontos.", bildbeschreibung: "um helicóptero" },
  "ueber-den-wolken": { name: "Acima das nuvens", nameNeutral: "Nível 100", description: "Nível 100 alcançado no círculo de pontos.", bildbeschreibung: "um disco voador" },
  sternenreise: { name: "Viagem às estrelas", nameNeutral: "Nível 200", description: "Nível 200 alcançado no círculo de pontos.", bildbeschreibung: "um cometa com uma cauda comprida" },
  // ── O mundo do teclado ───────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „pt": f j d k s l a ç.
  "grundstellungs-gorilla": {
    name: "Gorila da fila de base",
    nameNeutral: "Fila de base completa",
    description: (z) =>
      `Desbloqueadas as oito teclas da posição inicial: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "um gorila",
  },
  "gross-baumeister": { name: "Castelo de maiúsculas", nameNeutral: "Maiúsculas", description: "A tecla Shift dominada - maiúsculas a sério, escritas pelas tuas próprias mãos.", bildbeschreibung: "quatro letras maiúsculas em teclas azuis" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „pt" nicht zu verdienen - der Eintrag steht trotzdem da, weil das
  // Regal jedes beschreibt.
  "puenktchen-panda": { name: "Panda às pintas", nameNeutral: "Tremas alemães", description: "Desbloqueadas as letras ä, ö e ü - as letras alemãs com dois pontos.", bildbeschreibung: "um panda" },
  "schlangen-s": { name: "S de serpente", nameNeutral: "O s duplo alemão", description: "Desbloqueado o ß, o s duplo alemão - a última letra do teclado alemão.", bildbeschreibung: "uma serpente" },
  "alphabet-as": { name: "O alfabeto inteiro", description: "Desbloqueadas todas as letras de A a Z.", bildbeschreibung: "letras minúsculas em teclas azuis" },
  // Nicht „Ponto e vírgula" - so heisst das Zeichen „;".
  "punkt-und-komma": { name: "O ponto e a vírgula", description: "Desbloqueados o ponto e a vírgula - os primeiros sinais de pontuação a sério.", bildbeschreibung: "uma caneta preta" },
  "satzzeichen-sammler": { name: "Coleção de sinais", nameNeutral: "Pontuação completa", description: "Desbloqueados os sinais de pontuação: . , - ? ! : ;", bildbeschreibung: "um grande ponto de exclamação vermelho" },
  "zahlen-zebra": { name: "Zebra dos números", nameNeutral: "Metade dos algarismos", description: "Desbloqueados cinco algarismos da fila dos números.", bildbeschreibung: "uma zebra" },
  "zahlen-zauberer": { name: "Magia dos números", nameNeutral: "Fila dos números completa", description: "Desbloqueados todos os algarismos do 1 ao 0 - a fila dos números inteira.", bildbeschreibung: "uma tecla azul com o número dez" },
  "klammer-krokodil": { name: "Crocodilo entre parêntesis", nameNeutral: "Abrir e fechar parêntesis", description: "Desbloqueados os parêntesis ( ) - os primeiros símbolos.", bildbeschreibung: "um crocodilo" },
  "alltags-ass": { name: "Sinais do dia a dia", nameNeutral: "Sinais de todos os dias", description: (z) => `Desbloqueados: ${alltagsZeichen(z)} - sinais dos e-mails e do dinheiro.`, bildbeschreibung: "um envelope" },
  "tastatur-krone": { name: "Coroa do teclado", nameNeutral: "O teclado inteiro", description: "Desbloqueadas TODAS as teclas do teclado - até ao último símbolo.", bildbeschreibung: "uma coroa dourada" },
  // ── Já sei! ──────────────────────────────────────────────────────────────
  "feste-burg": { name: "Castelo bem firme", nameNeutral: "Fila de base dominada", description: "Todas as teclas da posição inicial dominadas.", bildbeschreibung: "uma casa" },
  "buchstaben-baendiger": { name: "Letras domadas", nameNeutral: "Todas as letras dominadas", description: "Cada letra está dominada - já nenhuma está em consolidação.", bildbeschreibung: "um quadrado vermelho com um A grande" },
  // „De pedra e cal" = felsenfest.
  "zahlen-fels": { name: "Números de pedra e cal", nameNeutral: "Todos os algarismos dominados", description: "A fila dos números inteira dominada.", bildbeschreibung: "um ábaco com bolas coloridas" },
  "nichts-wackelt": { name: "Nada abana", description: "Cada tecla do teclado dominada - o teclado inteiro, não só as teclas desbloqueadas.", bildbeschreibung: "um losango azul com um ponto no meio" },
  // ── Velocidade ───────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Raposa rápida", nameNeutral: "Velocidade com precisão", description: "A velocidade pedida E, ao mesmo tempo, precisão de pelo menos 95% - a velocidade só conta quando a escrita é precisa.", bildbeschreibung: "uma raposa" },
  "tempo-60": { name: "Lebre ligeira", nameNeutral: "60 por minuto, com precisão", description: "Uma ronda a 60 toques por minuto com precisão de pelo menos 95%.", bildbeschreibung: "uma lebre" },
  "tempo-90": { name: "Veado veloz", nameNeutral: "90 por minuto, com precisão", description: "Uma ronda a 90 toques por minuto com precisão de pelo menos 95%.", bildbeschreibung: "um veado" },
  "tempo-120": { name: "Cavalo a galope", nameNeutral: "120 por minuto, com precisão", description: "Uma ronda a 120 toques por minuto com precisão de pelo menos 98%.", bildbeschreibung: "um cavalo a galope" },
  "tempo-160": { name: "Locomotiva a vapor", nameNeutral: "160 por minuto, com precisão", description: "Uma ronda a 160 toques por minuto com precisão de pelo menos 98%.", bildbeschreibung: "uma locomotiva a vapor" },
  "tempo-200": { name: "Comboio veloz", nameNeutral: "200 por minuto, com precisão", description: "Uma ronda a 200 toques por minuto com precisão de pelo menos 98%.", bildbeschreibung: "um comboio rápido" },
  "tempo-300": { name: "Avião a jato", nameNeutral: "300 por minuto, com precisão", description: "Uma ronda a 300 toques por minuto com precisão de pelo menos 99% - nível profissional.", bildbeschreibung: "um avião pequeno" },
  // ── De uma assentada ─────────────────────────────────────────────────────
  "kette-100": { name: "Reação em cadeia", nameNeutral: "100 seguidos", description: "100 toques certos seguidos, sem nenhum erro.", bildbeschreibung: "dois elos de uma corrente" },
  "kette-250": { name: "Sem tropeçar", description: "250 toques certos seguidos.", bildbeschreibung: "uma corrente com vários elos" },
  // „Não perder o fio à meada" = den roten Faden nicht verlieren.
  "kette-500": { name: "O fio à meada", nameNeutral: "500 seguidos", description: "500 toques certos seguidos - mais do que uma ronda inteira.", bildbeschreibung: "um carrinho de linha" },
  "kette-1000": { name: "Mil sem falhas", description: "1000 toques certos seguidos.", bildbeschreibung: "o monte Fuji com o cume nevado" },
  "kette-2000": { name: "Corrente de ferro", nameNeutral: "2000 seguidos", description: "2000 toques certos seguidos - quatro a cinco rondas sem a menor hesitação.", bildbeschreibung: "um vulcão a deitar lava" },
  // ── Aventuras (jogo „Blocos de gelo", Glossar §2.3) ──────────────────────
  "erste-expedition": { name: "Primeira aventura", description: "A primeira aventura nos blocos de gelo, no jogo livre - até ao iglu.", bildbeschreibung: "uma bússola" },
  // Nicht „Explorador polar" (Personenwort, männlich).
  polarforscher: { name: "Descobertas polares", description: "10 aventuras concluídas nos blocos de gelo, no jogo livre.", bildbeschreibung: "um floco de neve" },
  "eismeer-legende": { name: "Lenda do mar gelado", description: "30 aventuras concluídas nos blocos de gelo, no jogo livre.", bildbeschreibung: "uma onda azul alta" },
  // Nicht „A Banquisa" - so heisst schon eine Etappe der Expedition.
  "packeis-profi": { name: "Gelo dominado", nameNeutral: "60 aventuras", description: "60 aventuras concluídas nos blocos de gelo, no jogo livre.", bildbeschreibung: "uma mala de viagem" },
  // ── Proezas de aventura ──────────────────────────────────────────────────
  // „Trockener Frack": der Frack ist der Pinguin selbst - portugiesisch „fraque".
  "trockener-frack": { name: "Fraque seco", description: "Uma aventura inteira sem cair nem uma vez na água ou na neve.", bildbeschreibung: "uma cartola preta" },
  "immer-trocken": { name: "Sempre em seco", description: (z) => `${pt(z.trockeneAbenteuer, "aventura", "aventuras")} sem cair nem uma vez na água.`, bildbeschreibung: "um guarda-chuva fechado" },
  fischfaenger: { name: "Boa pescaria", description: (z) => `${pt(z.fische, "peixe bónus apanhado", "peixes bónus apanhados")} nos blocos de gelo.`, bildbeschreibung: "um peixe azul" },
  // ── Expedição ────────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (Glossar §2.3): A Gruta do Eco, A Tempestade de Neve, A Estação Polar.
  "hoehlen-lauscher": { name: "Ouvido de morcego", description: "A Gruta do Eco inteira, até à saída - às escuras, só de ouvido.", bildbeschreibung: "um morcego" },
  "sturm-trotzer": { name: "Tempestade vencida", description: "A Tempestade de Neve superada - sequências de carateres escritas de cor.", bildbeschreibung: "uma cara a soprar vento" },
  "funker-freund": { name: "Amizade pelo rádio", description: "Uma mensagem de rádio inteira decifrada e enviada para a Estação Polar.", bildbeschreibung: "um rádio" },
  "polarlicht-entdecker": { name: "Debaixo da aurora polar", description: "A Expedição polar inteira sem nenhum erro - a aurora polar dança.", bildbeschreibung: "uma estrela com uma cauda de faíscas" },
  // ── Histórias ────────────────────────────────────────────────────────────
  "lese-luchs": { name: "Lince leitor", nameNeutral: "Primeira história", description: "A primeira história lida e escrita até ao fim.", bildbeschreibung: "um leopardo" },
  // „Rato de biblioteca" = Bücherwurm (Glossar §2.4).
  buecherwurm: { name: "Rato de biblioteca", description: "3 histórias lidas até ao fim.", bildbeschreibung: "uma lagarta verde" },
  "buecherei-baer": { name: "Urso da biblioteca", nameNeutral: "Oito histórias", description: "8 histórias lidas até ao fim.", bildbeschreibung: "um urso" },
  vielleser: { name: "Montanha de livros", description: "15 histórias lidas até ao fim.", bildbeschreibung: "uma pilha de livros coloridos" },
  // ── Hora da leitura (parte = Etappe einer Geschichte) ────────────────────
  "seiten-spatz": { name: "Pardal da primeira página", nameNeutral: "Primeira página", description: "A primeira parte de uma história escrita.", bildbeschreibung: "um passarinho azul" },
  "kapitel-krake": { name: "Polvo letrado", nameNeutral: "Dez partes", description: "10 partes lidas e escritas.", bildbeschreibung: "um polvo" },
  "geschichten-gigant": { name: "Elefante de histórias", description: "30 partes lidas e escritas.", bildbeschreibung: "um elefante" },
  leseratte: { name: "Leitura sem fim", nameNeutral: "75 partes", description: "75 partes lidas e escritas.", bildbeschreibung: "um rolo de pergaminho" },
  // ── Proezas de leitura ───────────────────────────────────────────────────
  // „leve" ist in beiden Geschlechtern gleich.
  federleicht: { name: "Leve como uma pena", description: "Uma parte inteira escrita sem nenhum erro.", bildbeschreibung: "uma pena branca" },
  // Nicht „De uma assentada" - so heisst schon die Familie „Am Stück".
  "in-einem-rutsch": { name: "Num só fôlego", description: "Uma história inteira lida até ao fim num só dia.", bildbeschreibung: "uma espiral azul" },
  "lesezeichen-held": { name: "O marcador no sítio certo", description: "A leitura continuada noutro dia, exatamente onde tinha ficado.", bildbeschreibung: "um marcador de livro" },
  // ── Mestria (Glossar §2.4: „Mestria", nie „exame") ───────────────────────
  "zehn-minuten-abschrift": { name: "Cópia de dez minutos", description: "Dez minutos a copiar um texto sem pausa e no máximo 0,5% de erros - como num verdadeiro concurso de escrita.", bildbeschreibung: "um cronómetro" },
  "lehrgangs-meister": { name: "Curso dominado", description: (z) => `Todas as lições do curso concluídas, cada uma com três estrelas (${lektionenFuer(z.lernweg).length} ao todo).`, bildbeschreibung: "um capelo preto de fim de curso" },
  "goldene-tastatur": { name: "Teclado de ouro", description: "Todas as teclas desbloqueadas e dominadas - e, além disso, uma vez 160 toques por minuto com 98% de precisão. A última medalha.", bildbeschreibung: "uma medalha desportiva com fita" },
  // ── Segredos ─────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Preguiça sem pressa", description: "Bem devagar, mas sem nenhum erro - a precisão vale mais do que a velocidade!", bildbeschreibung: "uma preguiça" },
  "comeback-kaenguru": { name: "Salto de canguru", description: "Uma ronda com 3 estrelas logo a seguir a uma ronda com 1 estrela.", bildbeschreibung: "um canguru" },
  // Uhrzeiten in Worten.
  nachteule: { name: "Coruja da noite", description: "Uma ronda terminada depois das nove da noite.", bildbeschreibung: "uma coruja" },
  // „Deus ajuda quem cedo madruga."
  "frueher-vogel": { name: "Quem cedo madruga", description: "Uma ronda terminada antes das sete da manhã.", bildbeschreibung: "um galo" },
  nimmersatt: { name: "Fome de leitura", description: "3 partes de uma história devoradas num só dia.", bildbeschreibung: "uma maçã verde" },
  "ferien-held": { name: "Férias ao teclado", description: "Prática nas férias de verão - em julho ou em agosto.", bildbeschreibung: "uma praia com um chapéu de sol" },
  "wochenend-schreiber": { name: "Escrita de fim de semana", description: "Prática ao sábado e ao domingo.", bildbeschreibung: "uma folha de calendário" },
  "zurueck-im-sattel": { name: "De volta à sela", description: (z) => `Regresso à prática depois de uma pausa de mais de ${pt(z.pauseTage, "dia", "dias")} - voltar também conta.`, bildbeschreibung: "duas setas em círculo" },
  "doppelt-genaeht": { name: "Dose dupla", description: "Duas rondas sem erros, uma logo a seguir à outra.", bildbeschreibung: "uma agulha com linha" },
  winterkind: { name: "Teclas de inverno", description: "Prática em pleno inverno - em dezembro ou em janeiro.", bildbeschreibung: "um boneco de neve" },
  jahreswechsel: { name: "Passagem de ano", description: "Prática no último dia do ano ou no primeiro dia do ano novo.", bildbeschreibung: "fogo de artifício no céu noturno" },
  "tages-marathon": { name: "Maratona de um dia", description: "Dez rondas num só dia.", bildbeschreibung: "uma pessoa num cavalo de corrida" },
  sternentag: { name: "Dia de estrelas", description: "Três rondas com três estrelas num só dia.", bildbeschreibung: "um sol com cara" },
  // „Estar num brinco" = blitzsauber.
  blitzsauber: { name: "Tudo num brinco", description: "Três rondas sem erros num só dia.", bildbeschreibung: "um sabonete com espuma" },
  "volle-woche": { name: "Semana cheia", description: "Cinco dias diferentes de prática numa ÚNICA semana.", bildbeschreibung: "um livro verde" },
  // „Blindflug" ⇒ „Sem espreitar": zum Äffchen, das sich die Augen zuhält. Glossar Regel 4: nie „às cegas".
  blindflug: { name: "Sem espreitar", description: "Uma ronda inteira sem erros - com o teclado no ecrã escondido. É disso que se trata na escrita com os dez dedos.", bildbeschreibung: "um macaquinho a tapar os olhos" },
  sprachwechsler: { name: "Viagem entre línguas", description: "Prática em duas línguas - por exemplo em português e em inglês.", bildbeschreibung: "um globo com a Europa e a África" },
  lesenacht: { name: "Leitura noturna", description: "Uma parte de uma história lida depois das oito da noite.", bildbeschreibung: "uma lua com cara" },
  "zaehe-taste": { name: "Tecla teimosa", description: "Uma tecla que deu luta durante muito tempo está agora dominada.", bildbeschreibung: "um caracol" },
  aufsteiger: { name: "Sempre a subir", description: "Cinco níveis de dificuldade acima do ponto de partida.", bildbeschreibung: "um gráfico com uma linha a subir" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine portugiesische Bedienung auf diesem Weg; dieselben Gedanken wie dort.
  "akzente-ziffernreihe": { name: "Acrobacias de acentos", nameNeutral: "é, è, ç e à", description: "Desbloqueadas as letras é, è, ç e à - as letras que moram na fila dos números.", bildbeschreibung: "os algarismos 1 2 3 4 numa tecla azul" },
  "accent-circonflexe": { name: "Chapelinho", nameNeutral: "Circunflexo francês", description: "A tecla de acento ^ dominada: ê, â, î, ô e û.", bildbeschreibung: "um chapéu de palha com fita" },
  trema: { name: "Joaninha de dois pontos", nameNeutral: "Trema", description: "A tecla de acento ¨ dominada: ë, ï e ü.", bildbeschreibung: "uma joaninha" },
};
