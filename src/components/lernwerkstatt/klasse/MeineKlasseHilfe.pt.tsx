/**
 * ★★★ O-PT (25.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF PORTUGIESISCH (PORTUGAL).
 * ===========================================================================
 * Massgeblich ist die deutsche Fassung (`MeineKlasseHilfe.tsx`): dieselben
 * Abschnitte, dieselben Tatsachen; der Aufbau folgt `MeineKlasseHilfe.cs.tsx`.
 * Sichtbar nur mit `spracheGewaehlt === "pt"`; jedes Programm ohne
 * Sprach-Anbieter zeigt weiter die deutsche Fassung.
 *
 * Anrede (Glossar `recherche-portugiesisch-2026-10-25/GLOSSAR-pt.md`, Regel 1
 * und 2): die Lehrkraft in der Höflichkeitsform ohne Pronomen („Escolha",
 * „Introduza", „Prima"), nie „você". Kinder heissen in dieser Sicht
 * „estudantes" (Mehrzahl) bzw. „a pessoa"; was die Lehrkraft der Klasse sagt,
 * steht in der Mehrzahl ohne Pronomen („O tempo só começa quando premirem a
 * primeira tecla."). Namen ohne Artikel (Regel 12), Zähler mit „de"
 * („Prontos: 12 de 14", Glossar §2.12). Die Startpunkte werden nur über die
 * Grundreihe beschrieben (f j d k s l a ç) - die Folge danach baut F4 parallel.
 */
import { Modal } from "@/components/Modal";
import { RundgangMeineKlassenKnopf } from "@/components/typing/Rundgang";
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import { EINSTIEGSFENSTER_MIN } from "@/lib/typing/schreibprobe";
import { mehrzahl } from "@/lib/bedienSprache";

function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="m-0 text-base font-semibold text-ink">{titel}</h3>
      <div className="space-y-1.5 text-sm leading-relaxed text-ink">{children}</div>
    </section>
  );
}

function Taste({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-hairline bg-surface-sunken px-1.5 py-0.5 text-sm text-ink">
      {children}
    </kbd>
  );
}

export function MeineKlasseHilfePortugiesisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  // Mehrzahl nach `Intl` „pt-PT" (Glossar §2.11).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "pt", {
    one: (z) => `${z} minuto`,
    many: (z) => `${z} de minutos`,
    other: (z) => `${z} minutos`,
  });
  return (
    <Modal title="Ajuda: As minhas turmas" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Aqui trabalha com a sua turma. As turmas e as contas são criadas{" "}
          <strong>uma só vez</strong> - valem em todos os programas de
          aprendizagem, com o mesmo código da turma e a mesma palavra-passe.
          {tastenflow && (
            <>
              {" "}
              Ao abrir o Tastenflow com uma conta docente, entra sempre aqui. Para
              praticar, use o botão Praticar (
              <Taste>Alt</Taste> + <Taste>U</Taste>).
            </>
          )}
        </p>

        <Abschnitt titel="Como está organizada a página">
          <p className="m-0">
            <strong>No cabeçalho da turma</strong> está o nome dela - com várias
            turmas, numa lista Turma, com a qual muda de turma -, o número de
            estudantes e o código da turma. À direita, nesta linha, antes do botão
            Transferências, está o seletor{" "}
            <strong>Progressos | Estudantes e acessos</strong> - no mesmo sítio nos
            dois ecrãs para onde leva.
          </p>
          <p className="m-0">
            Em <strong>Estudantes e acessos</strong> cria uma turma nova, adiciona
            estudantes e muda-os para outra turma, vê as palavras-passe e os dados
            de acesso, o código da turma e os programas que a turma usa. Para
            adicionar várias pessoas de uma vez, use, no mesmo sítio, em
            Estudantes, o botão{" "}
            <strong>Adicionar estudantes a partir de um ficheiro Excel</strong>:
            primeiro Transferir modelo (Excel), depois uma linha por pessoa com o
            nome, a palavra-passe e - para o Tastenflow - o ponto de partida. Uma
            palavra-passe vazia é criada pelo programa; a pré-visualização mostra o
            que vai ser adicionado, e todas as pessoas importadas aparecem depois em
            Imprimir dados de acesso. Com o botão{" "}
            <strong>Transferir lista da turma</strong>, ao lado, transfere a
            qualquer momento um ficheiro Word com o nome, a palavra-passe e o código
            da turma de TODAS as pessoas desta turma - para imprimir.
            {!tastenflow && (
              <>
                {" "}
                Uma mensagem para todas as pessoas escreve-se lá, com o botão
                Mensagem para a turma.
              </>
            )}
          </p>
          <p className="m-0">
            Em <strong>Progressos</strong> - é aqui que se entra ao abrir a página
            - estão os programas de aprendizagem desta turma, as Transferências e,
            por baixo, as estatísticas da turma: até onde chegou cada pessoa.
            {tastenflow && (
              <>
                {" "}
                Lá em cima há uma linha de botões: <strong>Desafio</strong>,{" "}
                <strong>Exercício personalizado</strong>,{" "}
                <strong>Objetivo semanal</strong>,{" "}
                <strong>Definições da turma</strong> e{" "}
                <strong>Suspender 1 hora</strong>. Cada botão abre por baixo de si
                uma secção própria - sempre só uma de cada vez, e a tecla{" "}
                <Taste>Esc</Taste> volta a fechá-la. O botão Desafio abre um
                formulário com os campos Teclas usadas e Min e com o botão Começar
                agora, além dos Desafios anteriores; Exercício personalizado define
                o texto para a turma toda (um ficheiro carregado, um texto da pasta
                Os meus textos ou um modelo do curso - as e os estudantes recebem
                uma janela só com o botão Seguinte); Objetivo semanal define os
                minutos por semana; Suspender 1 hora começa 60 minutos em que a
                turma continua a praticar, mas nada conta para o objetivo semanal.
                Por baixo está a Visão geral da turma (mês ou ano letivo, com a
                barra de pontuação e o gráfico de linhas); à direita, no seu
                cabeçalho, está o botão Mensagem para a turma - uma mensagem para
                todas as pessoas, e cada uma a recebe na sua própria conversa.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              O botão <strong>Definições da turma</strong>, nesta linha, abre: o
              ano de escolaridade (a partir dele, o programa escolhe os tipos de
              texto e, a cada ano letivo, conta um ano de escolaridade a mais; o
              nível Pessoas adultas não muda), a língua com o cadeado, o ponto de
              partida da turma (vale também para as pessoas que entrarem mais
              tarde na turma) e a Corrida da turma. Estas quatro definições valem
              para a turma toda, e o programa já as pergunta ao criar a turma; em
              cada pessoa ficam, na sua linha aberta, "Por onde começar?",
              "Escrever com uma mão" e "Com calma".
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Os níveis do menu <strong>"Por onde começar?"</strong> estão
              ordenados pelas teclas: o primeiro é só F e J, o segundo a fila de
              base completa (f j d k s l a ç). O terceiro acrescenta as letras
              mais frequentes a seguir e a tecla Shift. Os níveis seguintes -
              todas as letras, pontuação, algarismos e todas as teclas -
              desbloqueiam o resto, passo a passo.
            </p>
          )}
          <p className="m-0">
            Cada botão explica-se a si próprio: aparece uma dica assim que o foco
            lá chega com a tecla de tabulação. A tecla <Taste>Esc</Taste> fecha a
            dica.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel="O Desafio passo a passo">
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Lá em cima, nas estatísticas da turma, na linha de tarefas, o botão
                Desafio abre o formulário.
              </li>
              <li>
                Escolha as <strong>teclas usadas</strong> - todas as pessoas recebem
                o mesmo texto neste nível.
              </li>
              <li>
                Introduza a <strong>duração do Desafio</strong> em minutos - o
                campo está logo ao lado.
              </li>
              <li>
                Diga à turma: <em>O tempo só começa quando premirem a primeira
                tecla.</em> A partir do início, as e os estudantes têm{" "}
                {einstiegsMinuten} para começar; a duração do Desafio corre para
                cada pessoa à parte.
              </li>
              <li>
                Prima <strong>Começar agora</strong> - o Desafio começa logo para a
                turma toda.
              </li>
              <li>
                Logo a seguir vê, por exemplo,{" "}
                <strong>Prontos: 12 de 14 - ainda não: Said, Jano</strong>: em 12
                estudantes, o Desafio já chegou ao dispositivo. A linha aparece ao
                fim de cerca de um segundo. Se alguém ficar mais tempo em "ainda
                não", normalmente ajuda recarregar a página uma vez.
              </li>
              <li>
                Enquanto o Desafio decorre, vê a linha Entregues: 3 de 18, com os
                nomes.
              </li>
              <li>
                Depois, os resultados aparecem por baixo do formulário: para cada
                pessoa, a classificação, a <strong>pontuação do Desafio</strong>,
                se a leitura em voz alta estava ligada, os toques por minuto, a
                precisão, os carateres, os erros e as teclas em consolidação. Chega
                também um e-mail de resumo.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="O que querem dizer as colunas da tabela">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="O que quer dizer o nível de dificuldade">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Os valores em que pode basear uma nota">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="O código da turma">
          <p className="m-0">
            Está em cima, ao lado do nome da turma, e vale para todos os programas.
            Ao iniciar sessão, introduz-se o código da turma, o nome e a
            palavra-passe; o dispositivo memoriza o código, e depois basta o nome e
            a palavra-passe.
          </p>
          <p className="m-0">
            Ao criar a turma, é <strong>obrigatório</strong>. Enquanto escreve o
            nome, o programa propõe um código adequado - de "4B Sintra" resulta
            "4BSINTRA". Pode alterá-lo, mas não pode ficar vazio. Mais tarde,
            altera-o em Estudantes e acessos, com o botão Editar.
          </p>
          <p className="m-0">
            ⚠️ Se alterar o código, todas as pessoas da turma passam a iniciar
            sessão com o novo código a partir desse momento.
          </p>
        </Abschnitt>

        <Abschnitt titel="Mudar uma pessoa para outra turma">
          <p className="m-0">
            Em Estudantes e acessos, cada pessoa tem o botão{" "}
            <strong>Mover para outra turma</strong>. Abre o campo Código da nova
            turma. Funciona com qualquer turma cujo código conheça - também com
            turmas de outras e outros docentes. Antes de mudar, o programa pergunta
            mais uma vez.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>A pessoa passa a iniciar sessão com o novo código da turma.</li>
            <li>As e os docentes da nova turma veem esta pessoa e os seus progressos.</li>
            <li>
              {tastenflow
                ? "Os resultados dos Desafios e as mensagens ficam na turma anterior."
                : "As mensagens ficam na turma anterior."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Atalhos de teclado nesta área">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> abre e fecha esta ajuda.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> mostra a lista de todos os
            atalhos de teclado. <Taste>Alt</Taste> + <Taste>U</Taste> leva à
            prática. <Taste>Alt</Taste> + <Taste>N</Taste> abre as mensagens,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> a escolha de cores e contraste e{" "}
            <Taste>Alt</Taste> + <Taste>J</Taste> o menu da conta.
          </p>
          <p className="m-0">
            Com a tecla de tabulação passa pelos separadores; a tecla Enter muda de
            separador. Depois de mudar, o foco está na nova área - o leitor de ecrã
            continua a ler a partir daí.
          </p>
        </Abschnitt>

        <Abschnitt titel="Mais informações">
          <p className="m-0">
            O guia para docentes (em inglês) abre-se em cima, no botão
            Transferências - lá está também o cartaz do Tastenflow para imprimir e
            afixar (A3, em inglês), livre para todas as pessoas, mesmo sem início de
            sessão.
            {tastenflow && (
              <>
                {" "}
                A ajuda do próprio programa abre-se lá com{" "}
                <Taste>Alt</Taste> + <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
