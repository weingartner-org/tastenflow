/**
 * ★★★ O-HILFE-BR (25.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN,
 * PORTUGIESISCH (BRASILIEN, `pt-BR`).
 * ===========================================================================
 * Aus der Funktion geschrieben, nach dem Aufbau von `TippenHilfe.es.tsx` und
 * `TippenHilfe.cs.tsx` (dieselben Abschnitte, `detail`-Stufen,
 * `isAdult`/`jugend`-Fälle), den Inhalt nach der deutschen
 * `TippenHilfeDeutsch` - nicht Satz für Satz übertragen. Wie die anderen
 * Übersetzungen ohne den Einführungs-Podcast (die brasilianische Bedienung
 * hat keinen). Eigenständig neben der Fassung für Portugal (`.pt.tsx`) -
 * nie ein gemeinsames „pt" (Glossar, Bauplan D6).
 *
 * ── ANREDE UND GESCHLECHT (Glossar `recherche-portugiesisch-brasilien-2026-10-25/GLOSSAR-pt-BR.md`) ──
 * Immer **você** mit dem Imperativ der 3. Person (Digite, Pressione,
 * Escolha) - Kinder, Jugendliche UND Selbstlernende (Regel 1); nie tu-Formen,
 * nie „te/teu" (§4 Falle 16). Nie das Geschlecht verraten (Regel 2): kein
 * Adjektiv und kein Partizip über das Kind („pronto", „sozinho",
 * „conectado"), Adjektive nur am Ding („tecla nova", „medalha
 * conquistada"). Die Lehrkraft heisst „quem dá aula" bzw. „pessoa docente",
 * nie „professor/professora". Tastennamen wie auf der Kappe (Shift, Enter,
 * Caps Lock, Alt Gr), übersetzt nur „barra de espaço" (Regel 11).
 *
 * ── WAS BRASILIEN ANDERS IST ───────────────────────────────────────────────
 *  · Die Tastatur: Português (Brasil ABNT2) (`layouts.ts`, `br-abnt2`, nur
 *    gelesen; „ABNT" hat dieselben Tasten). ç hat eine eigene Taste rechts
 *    neben L (achte Grundtaste). Akut ´ rechts neben P (mit Shift Gravis `),
 *    Tilde ~ rechts neben Ç (mit Shift Zirkumflex ^), Shift + 6 ist das Trema
 *    ¨ (Totaste). / und ? auf der Zusatztaste neben dem rechten Shift, sonst
 *    Alt Gr + Q / Alt Gr + W. Kein €. Mac ist ungemessen - darum hier kein
 *    Satz über den Mac ausser der Wahltaste (`AltOderWahl`).
 *  · Die Reihenfolge des Weges „br" entsteht parallel (F4): die Hilfe zeigt
 *    die Buchstaben des Weges (`layoutLetterOrder`) und nennt nur die
 *    Grobfolge (Grundreihe mit ç, häufige Buchstaben, Shift, Punkt/Komma,
 *    Akzent-Tasten, Rest).
 *  · Das Plakat gibt es seit 06.11.2026 auf brasilianischem Portugiesisch (`handbuchInSprache`).
 *  · Die Tippchallenge heisst „Desafio", das Klassenmatch „Competição da
 *    turma", das Eisschollen-Spiel „Placas de gelo" (Glossar §2.3).
 *
 * Gerade Anführungszeichen, nur Bindestrich, keine Maus-Wörter.
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, layoutLetterOrder, skinForStufe, unitGlyph } from "@/lib/typing";
import { mehrzahl } from "@/lib/bedienSprache";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
import { RundgangNochmalKnopf } from "./Rundgang";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";
import { downloadAdresse, groesse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

// ★ O-HILFE-BR (25.10.2026): das Wort der Tippchallenge (Glossar §2.3) - wie
// `VYZVA` in der tschechischen Hilfe. Steht hier, solange `schreibprobe.ts`
// kein `PRUEFUNG_WORT_BR` hat; danach von dort holen.
const DESAFIO = "Desafio";
const DESAFIOS = "Desafios";

export function TippenHilfeBrasilianisch({ open, onClose, stufe, lernweg = "br" }: TippenHilfeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";
  const kind = skin === "kind";
  const detail = detailFor(stufe);
  const letters = layoutLetterOrder(lernweg);
  // Das Höhlenwesen (deutsche Aufnahmen) gibt es nur auf Weg „de".
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  // Dasselbe Wort wie der Ring (Glossar §2.2: „nível de jogo" / „nível").
  const ringWort = kind ? "nível de jogo" : "nível";
  // Glossar §2.11: die Zahl ist hier immer 10 - nie 0 (Regel 13).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "br", {
    one: (z) => `${z} minuto`,
    other: (z) => `${z} minutos`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ajuda do Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Ajuda - como o Tastenflow funciona</h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Fechar a ajuda"
          >
            ✕ Fechar
          </button>
        </div>

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="É só começar a digitar">
          <p className="m-0">
            Você não precisa escolher nada antes. Comece a digitar na hora - a
            primeira letra já vai direto para o campo de digitação. Se o cursor
            estiver em outro lugar, <Kbd>Alt</Kbd> + <Kbd>E</Kbd> leva você de
            volta ao campo de digitação.
          </p>
          <JawsRueckweg weg="br" />
          {detail === 1 && (
            <p className="m-0">
              Digite sempre com o dedo certo - o teclado embaixo mostra qual
              tecla vem agora. Pressione <Kbd>Shift</Kbd> duas vezes rápido para
              ouvir qual dedo usar.
            </p>
          )}
        </Section>

        <Section title="Estes sinais aparecem no texto">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "separa duas informações que andam juntas - como uma vírgula." },
              { zeichen: "→", bedeutung: "depois, ou: vira isto." },
              { zeichen: "⏱", bedeutung: "o seu tempo de prática até agora." },
              {
                zeichen: "↵",
                bedeutung:
                  "aparece no fim de uma linha quando a sua turma ativou esta opção - então você termina a linha com a tecla Enter.",
              },
            ]}
          />
        </Section>

        <Section title="Ganhe estrelas 🌟">
          <p className="m-0">
            Depois de cada rodada você recebe <strong>de 1 a 3 estrelas</strong> -
            cada uma com um som próprio.{" "}
            <strong>Poucos erros valem muito mais do que a velocidade:</strong>{" "}
            digitar com calma e com cuidado dá estrelas garantidas - correr e
            pressionar muitas teclas erradas, não.
            {kind ? " Todo mundo pode ganhar estrelas!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Você ganha 3 estrelas com uma rodada muito boa - com cuidado e numa
              velocidade adequada, e <strong>com cuidado</strong> sempre vale
              mais do que <strong>rápido</strong>. Quem faz várias rodadas boas
              seguidas pode subir um <strong>nível de dificuldade</strong> - e
              aí a recompensa soa um pouco diferente.
            </p>
          )}
        </Section>

        <Section title="Ganhe medalhas 🏅">
          <p className="m-0">
            Por conquistas especiais você ganha <strong>medalhas</strong> - por
            exemplo, por uma rodada sem nenhum erro ou por várias rodadas
            perfeitas seguidas. Quando chega uma medalha nova, você ouve um{" "}
            <strong>"tcharam"</strong> só dela, e o nome da medalha é anunciado.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Todas as suas medalhas ficam em <strong>Meu progresso</strong>,
              logo depois das suas metas semanais e dos seus números - lá você
              também encontra sempre o seu <strong>próximo objetivo</strong>. A
              maioria das medalhas premia <strong>digitar com cuidado</strong> e{" "}
              <strong>não desistir</strong> - não a pressa. E algumas são{" "}
              <strong>secretas</strong>: o que as desbloqueia não está escrito em
              lugar nenhum - elas simplesmente aparecem.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Lá também está a sua <strong>pontuação</strong>: quanto mais
              cuidado e constância ao digitar, mais ela sobe.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Mais abaixo, Evolução ao longo do tempo (uma linha que se abre)
              mostra uma pequena curva.
            </p>
          )}
          <p className="m-0">
            Uma dica: escolha uma medalha nas suas estatísticas para vê-la{" "}
            <strong>em tamanho grande</strong> - com brilho e confete.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Depois de uma tecla nova">
            <p className="m-0">
              Uma <strong>tecla nova</strong> é sua assim que as anteriores
              estiverem seguras - você não precisa ganhar nada para isso. Ela é
              comemorada, e você continua. Só isso.
            </p>
            <p className="m-0">
              Se quiser, depois pode vir um jogo curto:{" "}
              <strong>Placas de gelo</strong>. Quem escolhe é você - nas{" "}
              <strong>configurações</strong> (<AltText>Alt + O</AltText>), em{" "}
              <strong>Jogo de recompensa</strong>. No começo está em{" "}
              <strong>Nenhum</strong>. Essa opção vale para este aparelho.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Placas de gelo 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Você pode <strong>começar o jogo quando quiser</strong> - com o
                  botão <strong>Jogar</strong> na linha acima do campo de
                  digitação. O pinguim pula de placa em placa, sobe o paredão de
                  letras e desce escorregando de barriga - sempre com as teclas
                  que mais dão trabalho para você agora. No caminho, pulam da
                  água <strong>peixes bônus</strong> (quem pressiona a tecla de um
                  peixe a tempo pega o peixe; deixar um escapar nunca conta como
                  erro), e na <strong>Caverna do eco</strong> cada tecla é apenas
                  anunciada. O jogo <strong>não conta</strong> como tempo de
                  prática e não é preciso para desbloquear teclas novas - mas tem
                  medalhas próprias.
                </p>
                <p className="m-0">
                  Depois de uma tecla nova, ele <strong>só</strong> começa se
                  você o escolheu como <strong>jogo de recompensa</strong> nas
                  configurações. Fora isso, nada interrompe você - quem decide
                  quando jogar é você.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Quando você ganha uma <strong>tecla nova</strong>, as Placas de
                  gelo esperam por você para comemorar: ajude o pinguim a
                  atravessar a água - pressione sempre a tecla da próxima placa!
                  Às vezes, depois, você ainda sobe o{" "}
                  <strong>paredão de letras</strong> e desce escorregando de
                  barriga. A tecla nova já é sua antes do jogo - o jogo é um
                  prêmio, não uma obrigação.
                </p>
                <p className="m-0">
                  Você também pode <strong>começar o jogo quando
                  quiser</strong> - com o botão <strong>Jogar</strong> lá em cima
                  no seu cartão de prática, bem ao lado do círculo. É a grande{" "}
                  <strong>aventura</strong>: ela muda um pouco a cada dia, no
                  caminho pulam <strong>peixes bônus</strong> (pressione rápido a
                  tecla deles para pegá-los), e na <strong>Caverna do
                  eco</strong> não aparece nenhuma letra -{" "}
                  {hoehleMitWesen ? (
                    <>
                      a caverna <strong>diz</strong> cada tecla.
                    </>
                  ) : (
                    <>
                      cada tecla toca um som, e o leitor de tela ou a linha
                      braille <strong>diz</strong> qual é.
                    </>
                  )}{" "}
                  É só por diversão e <strong>não conta</strong> como tempo de
                  prática - mas tem medalhas para ganhar!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Não se preocupe: se uma placa afundar ou você escorregar no
                    paredão, o pinguim simplesmente volta nadando - dá para
                    tentar de novo na hora, quantas vezes quiser. E quem
                    atravessa a aventura inteira sem cair na água nenhuma vez vê
                    a <strong>aurora polar</strong> dançar sobre o iglu!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="O que significa o círculo com o número?">
          <p className="m-0">
            O número no círculo é o seu <strong>{ringWort}</strong>.{" "}
            <strong>Os pontos são o que você ganha praticando:</strong> a cada
            rodada vêm alguns, e o círculo vai se enchendo. Quando ele fica
            cheio (100 pontos), você sobe um {ringWort}. Serve só para
            colecionar e <strong>não</strong> deixa a prática mais difícil -
            como os pontos de um jogo.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Não confunda com o <strong>nível de dificuldade (1-50)</strong>:
              ele diz em que velocidade você deveria digitar e se ajusta a você{" "}
              <strong>automaticamente</strong> - sobe quando vai bem e desce quando fica
              difícil demais.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              E a <strong>faixa de idade dos textos</strong> só decide o quanto
              as palavras e as frases são difíceis - para combinar com a sua
              idade. Numa turma, isso é definido por quem dá aula, para todo o
              grupo; sem turma, você encontra a opção lá em cima nas
              configurações ⚙. São três coisas diferentes: o{" "}
              <em>{ringWort}</em> = os pontos, o <em>nível de dificuldade</em> =
              a velocidade esperada, a <em>faixa de idade dos textos</em> = a sua
              idade.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Com que frequência praticar?" : "Tempo de prática e meta semanal"}>
          {detail === 1 ? (
            <p className="m-0">
              É melhor praticar <strong>pouco e com frequência</strong> do que
              uma vez só por muito tempo - por exemplo, alguns minutos em vários
              dias seguidos. Na linha embaixo do campo de digitação, um relógio
              conta quanto você já digitou hoje; esse mesmo tempo também enche o{" "}
              <strong>círculo</strong> que fica ali - a sua meta semanal.
            </p>
          ) : (
            <p className="m-0">
              Com uma conta você pode ter uma <strong>meta semanal</strong>: um
              número de <strong>minutos por semana</strong>. Numa turma, quem
              define a meta é quem dá aula; sem turma, quem define é você, nas
              configurações ⚙, em Minha meta semanal - uma meta nova vale a
              partir da segunda-feira seguinte. A semana começa{" "}
              <strong>na segunda-feira às 8:00</strong> e termina na
              segunda-feira seguinte às 8:00. Na linha embaixo do campo de
              digitação, o seu avanço aparece como um <strong>círculo</strong>,
              por exemplo "25 de 60 min" - quando a meta é cumprida, ele fica
              cheio e com um sinal de confirmação. Às vezes também há minutos de
              uma semana anterior para <strong>recuperar</strong>; então o
              número aparece ao lado. Quando você cumpre a sua meta semanal,
              abre uma janela curta para comemorar - depois você pode continuar
              praticando quando quiser.
            </p>
          )}
        </Section>

        <Section title="Configurações: a engrenagem ⚙ no alto da tela">
          <p className="m-0">
            Todas as opções ficam atrás do botão{" "}
            <strong>⚙ Configurações</strong>, lá no alto, logo à esquerda do
            botão redondo com a sua inicial:{" "}
            <strong>O que você está praticando?</strong>, <strong>Textos</strong>{" "}
            (idade e idioma), <strong>Teclado</strong>, <strong>Som</strong> e{" "}
            <strong>Leitura em voz alta</strong>. Pressione uma vez para abrir e
            outra vez para fechar - ou use <Kbd>Alt</Kbd> + <Kbd>O</Kbd>, que
            funciona até no meio da digitação. Ao abrir, o cursor vai direto para
            as configurações; ao fechar, volta para o campo de digitação.
          </p>
          <p className="m-0">
            No topo das configurações está{" "}
            <strong>O que você está praticando?</strong>: os três caminhos,{" "}
            <strong>Meu treino</strong>, <strong>Histórias</strong> e{" "}
            <strong>Jogos de palavras</strong>. <Kbd>Alt</Kbd> + <Kbd>B</Kbd>{" "}
            passa para o próximo, e o novo caminho é anunciado.
          </p>
          <p className="m-0">
            O botão redondo com o globo, no alto da tela, muda o idioma do
            Tastenflow - botões, menus e também os seus textos de prática;
            depois você pode mudar só o idioma dos textos, em{" "}
            <strong>Textos</strong>, a não ser que a sua turma já tenha um idioma
            definido.
          </p>
          <p className="m-0">
            Em <strong>Teclado</strong> você escolhe o teclado que está de fato
            na sua frente. No Brasil, normalmente é o{" "}
            <strong>Português (Brasil ABNT2)</strong> - o ABNT, mais antigo, tem
            as mesmas teclas. Depois disso, o teclado na tela e as dicas dos
            dedos combinam com ele - e só aparecem caracteres que existem nesse
            teclado. O mais importante sobre o teclado brasileiro:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              O <strong>ç</strong> tem uma tecla própria, à direita do L. Ela faz
              parte das oito teclas da fileira central: é a tecla do dedo mínimo
              direito.
            </li>
            <li>
              A <strong>tecla do acento agudo</strong> <Kbd>´</Kbd> fica à
              direita do P; com <Kbd>Shift</Kbd>, ela dá o acento grave (`). É
              uma tecla de acento: primeiro a tecla de acento - na tela ainda não
              aparece nada -, depois a vogal. Acento agudo e a dá{" "}
              <strong>á</strong>, acento agudo e e dá <strong>é</strong>; acento
              grave e a dá <strong>à</strong>.
            </li>
            <li>
              A <strong>tecla do til</strong> <Kbd>~</Kbd> fica à direita do Ç;
              com <Kbd>Shift</Kbd>, ela dá o acento circunflexo (^). Til e a dá{" "}
              <strong>ã</strong>, til e o dá <strong>õ</strong>; circunflexo e e
              dá <strong>ê</strong>.
            </li>
            <li>
              <Kbd>Shift</Kbd> + <Kbd>6</Kbd> é uma tecla de acento (trema):
              por si só ela não escreve nada.
            </li>
            <li>
              <strong>e</strong>, <strong>é</strong> e <strong>ê</strong> são
              letras diferentes - por isso o programa espera exatamente a que
              está no texto. O mesmo vale, por exemplo, para a, á e ã.
            </li>
            <li>
              A <strong>/</strong> e o <strong>?</strong> ficam numa tecla extra
              ao lado do Shift direito. Se o seu teclado não tiver essa tecla:{" "}
              <Kbd>Alt Gr</Kbd> + <Kbd>Q</Kbd> dá a /, e <Kbd>Alt Gr</Kbd> +{" "}
              <Kbd>W</Kbd> dá o ?.
            </li>
            <li>
              O teclado brasileiro não tem o símbolo do{" "}
              <strong>euro (€)</strong>.
            </li>
          </ul>
          <p className="m-0">
            Ali também está <strong>Digitar com uma mão</strong> - para quem
            digita com uma mão só: as letras maiúsculas e os símbolos passam a
            valer com qualquer tecla Shift. Numa turma, essa opção é definida por
            quem dá aula.
          </p>
          <p className="m-0">
            Com <strong>Espaço maior entre letras (DVC)</strong>, durante a
            digitação tudo fica escuro, menos o campo em que você está digitando
            (a linha de prática ou a área do jogo); depois de 5 segundos sem
            digitar, tudo volta a ficar claro. A linha de prática desliza no
            ritmo da sua digitação, em vez de pular. O espaço entre as letras
            pode ser ajustado por você nas configurações ⚙ quando quiser - numa turma,
            quem dá aula também pode ajustar; vale o que foi escolhido por
            último.
          </p>
          <p className="m-0">
            Com o <strong>Treino direcionado</strong> você pode escolher até 8 teclas ou caracteres que aparecem com mais frequência nas rodadas - nas configurações, em <strong>O que você está praticando?</strong>, ou com <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. Em uma turma, quem define isso é quem dá aula.
          </p>
        </Section>

        <Section title="Leitura em voz alta - o programa lê para você">
          <p className="m-0">
            Com <strong>🗣 Leitura em voz alta</strong> (ou <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>), o programa lê para você - para quem (ainda) não usa um
            leitor de tela. Lá em cima nas configurações ⚙ você escolhe se são
            lidas as <strong>letras</strong> (tecla por tecla), as{" "}
            <strong>palavras</strong> e/ou as <strong>frases</strong>, e em que
            velocidade.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Em <strong>Voz</strong> você pode escolher outra voz. Quando o
              idioma é o <strong>português do Brasil</strong>, o programa procura
              só uma voz em português do Brasil; se não houver nenhuma
              instalada, um guia curto mostra como adicionar uma.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Não se preocupe com a sua velocidade: o{" "}
              <strong>tempo da leitura é descontado</strong> - esperar um aviso
              terminar não baixa a sua velocidade.
            </p>
          )}
        </Section>

        <Section title="Melodia ao digitar 🎵">
          <p className="m-0">
            A <strong>melodia ao digitar</strong> ajuda a treinar um{" "}
            <strong>ritmo de digitação regular</strong> e, acima de tudo, deve
            ser <strong>divertida</strong>. Cada tecla certa toca a próxima nota
            de uma música; quem mantém o ritmo ganha até o acompanhamento de uma
            banda.
          </p>
          <p className="m-0">
            Quem digita com regularidade também fica mais fluente nas teclas
            mais difíceis: o ritmo leva você pelos trechos em que antes haveria
            uma pausa.
          </p>
          <p className="m-0">
            Ative com <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, nas configurações ⚙ ou no
            menu do botão redondo do alto-falante, onde você também ajusta o
            volume de cada som com controles deslizantes. Troque o som com{" "}
            <Kbd>Alt</Kbd> + <Kbd>7</Kbd> e <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Letras maiúsculas e pontuação">
          <p className="m-0">
            Os textos precisam de <strong>letras maiúsculas</strong> - no começo
            de uma frase e em todo nome próprio. O Tastenflow sempre as coloca{" "}
            <strong>do jeito certo</strong>, então você nunca vê uma palavra
            escrita errado.
          </p>
          <p className="m-0">
            <strong>Bem fácil no começo:</strong> digite a letra{" "}
            <strong>minúscula</strong> - a <strong>maiúscula</strong> aparece
            automaticamente. Para isso, você <strong>ainda não</strong> precisa conhecer
            a tecla <Kbd>Shift</Kbd>.
          </p>
          <p className="m-0">
            <strong>Logo</strong>, depois das primeiras letras, você aprende a
            usar a tecla <Kbd>Shift</Kbd> "de verdade": mantenha a tecla
            pressionada com <strong>uma</strong> mão e digite a letra com a{" "}
            <strong>outra</strong> - como em qualquer teclado. Assim, em pouco
            tempo, as maiúsculas vêm de <strong>você</strong>, sem a ajuda
            automática.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Importante - sempre o Shift da OUTRA mão:</strong> existem
              duas teclas Shift, uma à esquerda e uma à direita. Digite a letra
              com uma mão e segure <Kbd>Shift</Kbd> com a{" "}
              <strong>outra</strong>. Assim uma mão nunca precisa pressionar as
              duas teclas.
            </p>
            <p className="m-0 mt-2">
              Exemplo: <strong>A</strong> maiúsculo (mão esquerda) →{" "}
              <strong>Shift da direita</strong>. <strong>K</strong> maiúsculo (mão
              direita) → <strong>Shift da esquerda</strong>.
            </p>
            <p className="m-0 mt-2">
              O Tastenflow <strong>só aceita o Shift certo</strong>. Com o Shift{" "}
              <strong>errado</strong> ou com <Kbd>Caps Lock</Kbd>, sai a letra{" "}
              <strong>minúscula</strong> - e isso conta como{" "}
              <strong>tecla errada</strong>, para você treinar desde o começo com
              a mão certa.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Uma dica: pressione <Kbd>Shift</Kbd>{" "}
              <strong>duas vezes rápido</strong> para ouvir com qual dedo
              segurar a tecla.
            </p>
          )}
          <p className="m-0">
            <strong>O ponto, a vírgula e o ponto de interrogação</strong> só
            aparecem quando você já os aprendeu. Até lá, você lê a frase{" "}
            <strong>sem eles</strong> - é de propósito, não é um erro.
          </p>
        </Section>

        <Section title="Em que ordem as letras chegam?">
          <p className="m-0">
            As teclas novas chegam sempre na mesma ordem: primeiro a{" "}
            <strong>fileira central</strong> (com o <Kbd>ç</Kbd>), depois as
            outras letras, das mais frequentes para as menos frequentes. Qual
            tecla vem agora você vê sempre bem à direita, na linha embaixo do
            campo de digitação: <strong>Próxima tecla</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            <strong>Depois das primeiras letras</strong> chegam as{" "}
            <strong>maiúsculas</strong> (a tecla Shift) e, logo em seguida, o{" "}
            <strong>ponto e a vírgula</strong>: uma frase começa com maiúscula e
            termina com ponto. Depois vêm as <strong>teclas de acento</strong> -
            primeiro a tecla de acento, depois a letra; a primeira tecla ainda
            não escreve nada - e as letras que faltam. Por último chegam os
            outros <strong>sinais de pontuação</strong>, os{" "}
            <strong>números</strong> e os <strong>símbolos</strong>.
          </p>
        </Section>

        {detail >= 2 && (
          <Section title="Como funciona o Meu treino">
            <p className="m-0">
              <strong>Ele se adapta a você.</strong> O programa lembra quais
              teclas ainda dão trabalho e pratica justamente essas. Uma tecla
              nova só chega quando as outras estão seguras. As letras{" "}
              <strong>mais frequentes</strong> chegam primeiro - assim, com
              poucas teclas, você já digita <strong>palavras e frases de
              verdade</strong>, e as primeiras <strong>histórias</strong> são
              desbloqueadas logo.
            </p>
          </Section>
        )}

        <Section title="A barra embaixo do campo de digitação">
          <p className="m-0">
            Embaixo do campo de digitação há uma barra estreita com quatro
            informações: o seu <strong>{ringWort}</strong>, o{" "}
            <strong>tempo</strong> praticado hoje, a sua{" "}
            <strong>meta semanal</strong> e a <strong>próxima tecla</strong>. Na
            meta semanal, o círculo mostra quantos <strong>minutos</strong> você
            praticou nesta semana - por exemplo "25 de 60 min"; um{" "}
            <strong>sinal de confirmação</strong> quer dizer que a meta foi
            cumprida. A próxima tecla é desbloqueada{" "}
            <strong>automaticamente</strong> assim que as anteriores estiverem
            seguras - basta continuar.
          </p>
          <p className="m-0">
            A barra fica ali <strong>o tempo todo</strong> - também enquanto você
            digita. Assim nada pula, e você vê a qualquer momento há quanto tempo
            está praticando.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> anuncia o seu tempo de prática e a sua
            meta semanal. As teclas seguras, as que ainda não chegaram e a que
            vem agora aparecem em <strong>Meu progresso</strong>, em{" "}
            <strong>Situação das teclas</strong> (<Kbd>Alt</Kbd> +{" "}
            <Kbd>S</Kbd>, com uma conta).
          </p>
        </Section>

        <Section title="A biblioteca: Histórias e curiosidades 📖">
          <p className="m-0">
            Além do Meu treino, existe outro jeito de praticar: as{" "}
            <strong>Histórias</strong> - nas configurações ⚙, em{" "}
            <strong>O que você está praticando?</strong>. Lá você encontra
            histórias inteiras e coleções de curiosidades - não frases soltas,
            mas <strong>uma história ao longo de várias rodadas</strong>. Cada
            parte tem doze linhas; na vez seguinte, você continua exatamente de
            onde parou.
          </p>
          <p className="m-0">
            Só aparece o que você consegue mesmo digitar com as teclas que já
            aprendeu - por isso, no começo, ainda há cadeados. Eles se abrem
            automaticamente assim que teclas suficientes estiverem seguras. Cada linha
            vem <strong>uma vez só</strong>: o que você já digitou não volta para
            ser repetido.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>O fio da meada:</strong> o que você leu numa coleção de
              curiosidades volta mais tarde no seu treino - como uma{" "}
              <strong>pergunta feita de outro jeito</strong>, depois como mais um
              pequeno detalhe e, no fim, como uma piada sobre o assunto. Assim o
              que foi aprendido fica, sem parecer prova.
            </p>
          )}
        </Section>

        <Section title="De onde vêm os textos? 🤖">
          <p className="m-0">
            Os textos do próprio programa - frases de prática, piadas e
            histórias - foram escritos por Johannes{" "}
            <strong>com a ajuda de inteligência artificial (IA)</strong>. Os
            textos de outras fontes levam o nome delas em Fontes e
            agradecimentos.
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                O peixe que canta e a criatura que sussurra na Expedição polar
                também são <strong>vozes sintéticas</strong>, não pessoas de
                verdade.
              </>
            ) : (
              <>
                O peixe que canta na Expedição polar também é uma{" "}
                <strong>voz sintética</strong>, não uma pessoa de verdade.
              </>
            )}{" "}
            A leitura em voz alta (🗣) usa a voz de leitura do seu aparelho.
          </p>
        </Section>

        <Section title={`O ${DESAFIO}`}>
          <p className="m-0">
            Às vezes quem dá aula inicia um <strong>{DESAFIO}</strong> - para a
            turma inteira. <strong>Todo mundo recebe o mesmo texto</strong> e
            todo mundo tem o mesmo tempo.
          </p>
          <p className="m-0">
            <strong>O tempo só começa com o seu primeiro toque</strong> - não no
            momento em que o {DESAFIO} é iniciado. A partir do início, você tem{" "}
            <strong>{einstiegsMinuten}</strong> para começar.
          </p>
          <p className="m-0">
            <strong>Como reconhecer:</strong> acima do campo de digitação está
            escrito <strong>{DESAFIO}</strong>, com o tempo ao lado, e toda a
            área ganha uma <strong>borda pontilhada</strong> diferente. Quando o
            tempo acaba, as duas coisas desaparecem.
          </p>
          <p className="m-0">
            <strong>Quanto tempo falta, sem olhar:</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>X</Kbd> diz para você. O relógio só avisa por conta própria poucas vezes;
            no resto do tempo, fica em silêncio.
          </p>
          <p className="m-0">
            <strong>A linha braille fica tranquila.</strong> O tempo{" "}
            <strong>não</strong> corre na linha braille: ele avança lá em cima,
            mas nunca entra no meio do que você está lendo.
          </p>
          <p className="m-0">
            <strong>Às vezes o {DESAFIO} é de Escrita livre.</strong> Nesse caso,
            um erro fica onde foi digitado - nada é marcado, nenhum som avisa.
            Backspace só corrige dentro da linha atual; uma linha terminada fica
            como está. No fim de uma linha, pressione a barra de espaço depois
            da última palavra - ou, se a turma ativou Fim de linha com Enter,
            pressione Enter. O que ainda estiver errado no final só aparece
            depois, nos resultados, como uma lista para ler.
          </p>
          <p className="m-0">
            <strong>Parar antes da hora:</strong> <Kbd>Esc</Kbd> primeiro pede
            confirmação. <strong>Continuar digitando</strong> (ou{" "}
            <Kbd>Esc</Kbd>) leva você de volta à linha; <strong>Entregar</strong>{" "}
            entrega o que você digitou - vale o que foi digitado até ali. O botão{" "}
            <strong>Concluir e entregar</strong> embaixo do campo faz o mesmo, sem
            perguntar.
          </p>
          <p className="m-0">
            <strong>Quando o tempo acaba,</strong> os seus resultados aparecem na
            hora: toques por minuto, precisão, caracteres, erros, linhas e as
            teclas que ainda não estão seguras. Depois, cada {DESAFIO} fica em{" "}
            <strong>Meu progresso</strong>, em <strong>{DESAFIOS}</strong> - você
            pode ver de novo quando quiser.
          </p>
        </Section>

        <Section title="Competição da turma ⚔️">
          <p className="m-0">
            Na Competição da turma, você faz uma <strong>corrida de digitação de
            cinco minutos</strong> com as outras pessoas da sua turma. A
            Competição da turma só existe dentro de uma turma, e só se quem dá
            aula tiver permitido.
          </p>
          <p className="m-0">
            <strong>Convidar:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>, ou o botão{" "}
            <strong>⚔️ Competição da turma</strong> na linha acima do campo de
            digitação - bem ao lado de <strong>🐧 Jogar</strong>. Para todas as
            outras pessoas abre então uma janela: <strong>Estou dentro!</strong>{" "}
            ou <strong>Agora não</strong>. <Kbd>Esc</Kbd> leva de volta à
            prática, e o mesmo convite não volta por conta própria.
          </p>
          <p className="m-0">
            <strong>Se alguém já está convidando,</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> traz esse convite de volta - uma segunda competição só
            pode começar quando a primeira já está em andamento. Se duas pessoas
            convidam quase ao mesmo tempo, vale o convite que chegou primeiro.
          </p>
          <p className="m-0">
            <strong>Quando não dá agora:</strong> se você já está numa
            competição, o botão diz{" "}
            <strong>⚔️ Competição da turma em andamento</strong> - e{" "}
            <Kbd>Alt</Kbd> + <Kbd>M</Kbd> diz a mesma coisa. Outras competições
            da turma não atrapalham: várias podem acontecer ao mesmo tempo.
          </p>
          <p className="m-0">
            <strong>Cada pessoa digita com as teclas que já aprendeu.</strong>{" "}
            Quem já aprendeu os números recebe números; quem está na fileira
            central recebe a fileira central. Tecla errada custa caro - cada
            tecla errada pesa como cinco caracteres.
          </p>
          <p className="m-0">
            <strong>Como está a competição, sem olhar:</strong> bem à esquerda na
            linha de digitação há sempre oito células: <strong>P2</strong> é a
            posição, ao lado vem o tempo que falta. <Kbd>Alt</Kbd> +{" "}
            <Kbd>X</Kbd> diz a posição, o tempo e os três primeiros lugares.
            Nada é anunciado por conta própria - a linha braille fica tranquila.
          </p>
          <p className="m-0">
            <strong>Parar antes da hora:</strong> <Kbd>Esc</Kbd> ou o botão{" "}
            <strong>Sair</strong> primeiro pedem confirmação.{" "}
            <strong>Continuar digitando</strong> (ou <Kbd>Esc</Kbd>) leva de
            volta à linha. <strong>Sair</strong> encerra a competição só para
            você - as outras pessoas continuam digitando e veem o que você
            digitou.
          </p>
          <p className="m-0">
            <strong>A competição conta como tempo de prática</strong> e pode
            desbloquear uma tecla nova - igual a uma rodada de prática comum.{" "}
            <strong>Nenhuma posição é salva.</strong> No fim aparece a lista:
            Troféu, Prata e Bronze para os três primeiros lugares, e todas as
            outras posições com o seu número. Depois,{" "}
            <strong>Continuar praticando</strong> ou <Kbd>Esc</Kbd> levam você
            de volta.
          </p>
        </Section>

        <Section title="Teclas importantes">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              No Mac, <Kbd>Alt</Kbd> é a tecla <Kbd>⌥</Kbd> (Option).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>A tecla mais importante:</strong> fecha qualquer janela,
                e depois o cursor fica{" "}
                <strong>sempre no campo de digitação</strong>. Mesmo sem nada
                aberto, <Kbd>Esc</Kbd> leva você até lá. A única exceção é
                Explorar teclas: lá, <Kbd>Esc</Kbd> é só mais uma tecla para
                explorar, e só o segundo toque faz você sair.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>Dois toques rápidos: o dedo certo é anunciado.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Vai para o campo de digitação.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Vai para a prática.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Abre Meu progresso (docentes: Minhas turmas). Só depois de
                entrar na conta. Pressione de novo para voltar ao campo de
                digitação.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Anuncia em que linha você está.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Diz o seu tempo de prática - na linha braille e (com a leitura em
                voz alta ligada) como aviso falado.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Anuncia em que {ringWort} você está.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Explorar teclas:</strong> cada tecla que você pressiona é
                anunciada e aparece em tamanho grande - primeiro o nome curto,
                depois o nome completo e depois para que ela serve. Funciona com
                todas as teclas especiais e sinais de pontuação, com os
                caracteres de Alt Gr (no Mac: Option), dizendo como chegar até
                eles, e com combinações como Ctrl + C. Os atalhos do próprio
                Tastenflow (<AltText>Alt + H, Alt + V …</AltText>) continuam
                funcionando. O teclado na tela mostra qual tecla foi pressionada.
                Com a leitura em voz alta desligada, a voz fica em silêncio. Na
                linha braille, a explicação fica até a próxima tecla, e você pode
                ler tudo com as teclas de rolagem; na tela, ela aparece numa
                janela. Nada é digitado e nada se perde.{" "}
                <strong>Para sair:</strong> <Kbd>Alt</Kbd> + <Kbd>3</Kbd> de
                novo, <Kbd>Esc</Kbd> duas vezes - ou simplesmente recarregar a
                página.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Encontrar teclas:</strong> uma tecla é dita, e você
                procura por ela. Na primeira vez que a encontra, você ouve
                "Achou! Pressione outra tecla e depois esta de novo …" - só conta
                o segundo toque, e só com outra tecla no meio. Depois vem a
                próxima tecla. Qualquer outra tecla só é dita. Na janela,{" "}
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd> alterna entre explorar e encontrar.{" "}
                <strong>Para sair:</strong> do mesmo jeito que em Explorar teclas.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Cores e contraste:</strong> sete combinações de cores -
                claro, escuro, preto no amarelo, amarelo no azul e outras. Cada
                uma já aparece na lista com as suas próprias cores, para você ver
                como fica antes de escolher.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Abre ou fecha a lista de atalhos de teclado.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Abre ou fecha as mensagens da sua turma.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Aumenta / diminui o campo de digitação.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Liga ou desliga a leitura em voz alta.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Abre ou fecha esta ajuda.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Como o programa ajuda você a avançar">
            <p className="m-0">
              O programa mede cada letra separadamente - com que precisão e em
              que velocidade você a digita. Ele pratica automaticamente as mais
              difíceis e só desbloqueia uma letra nova quando as anteriores
              estão seguras. Assim surge uma trilha de aprendizagem só sua.
            </p>
            <p className="m-0">
              O nível de dificuldade (1-50) faz com que tudo continue{" "}
              <strong>desafiador, mas possível</strong>: se vai bem, ele sobe; se
              fica difícil demais, ele desce. Em <strong>Meu progresso</strong>{" "}
              você vê tudo sobre o seu avanço - e como você está evoluindo.
            </p>
          </Section>
        )}

        <Section title="Praticar sem turma - uma conta pessoal 🙋">
          <p className="m-0">
            Se você não faz parte de nenhuma turma, pode criar uma conta: abra o
            botão redondo <strong>Conta</strong> e marque{" "}
            <strong>Pratico sem turma</strong>. Para isso é preciso um endereço
            de e-mail: é para lá que vai o resumo semanal às segundas-feiras -
            mas só depois de uma semana com prática. Se o Tastenflow não for
            aberto durante um ano inteiro, chega um aviso por e-mail; se
            ninguém entrar na conta nas três semanas seguintes, a conta é
            excluída com todo o progresso.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Cartaz para pendurar, em português do Brasil (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "br");
  return (
    <Section title="Um cartaz para pendurar">
      <p className="m-0">
        Quer mostrar o Tastenflow na sua escola ou instituição? Aqui há um{" "}
        <strong>cartaz para imprimir e pendurar</strong>: A3 na vertical, com o
        que o Tastenflow oferece num relance e um código QR para tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Baixar o cartaz (PDF, A3, {groesse(plakat.bytes, "br")})
        </a>
      </p>
    </Section>
  );
}
