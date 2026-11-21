/**
 * ★★★ O-HILFE-BR (25.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF PORTUGIESISCH
 * (BRASILIEN, `pt-BR`).
 * ===========================================================================
 * Aus der Funktion geschrieben, nach dem Muster der deutschen Fassung und von
 * `MeineKlasseHilfe.es.tsx`/`.cs.tsx` (dieselben Abschnitte, dieselben
 * Tatsachen) - nicht Satz für Satz übertragen. Sichtbar nur mit
 * `spracheGewaehlt === "br"` (`MeineKlasseHilfe.tsx`).
 *
 * Anrede **você** (Glossar `recherche-portugiesisch-brasilien-2026-10-25/GLOSSAR-pt-BR.md`,
 * Regel 1), Knöpfe im Infinitiv ohne Anführung. Keine Personenwörter mit
 * Geschlecht: „estudantes", „pessoa", „pessoa docente", nie „aluno/professor"
 * (Regel 2). Namen der Oberfläche nach Glossar §2.5/§2.6/§2.12: *Minhas
 * turmas*, *código da turma*, *Desafio*, *Exercício personalizado*, *Meta
 * semanal*, *Configurações da turma*, *Pausar por 1 hora*, *Progresso |
 * Estudantes e acessos*. Tastenwege als Tastenwege, nie Maus-Wörter.
 * ⚠️ `SpaltenHilfe`, `LeistungsstufeHilfe`, `DreiWerteHilfe` sind gemeinsame
 * Bausteine und zeigen für „br" bis zu ihrer Etappe Englisch (RÜCKFALL-EN).
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

// Glossar §2.3: „Desafio", Mz. „Desafios".
const W = "Desafio";
const WM = "Desafios";

export function MeineKlasseHilfeBrasilianisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  // Glossar §2.11: one/other; die Zahl ist nie 0.
  const einstieg = mehrzahl(EINSTIEGSFENSTER_MIN, "br", {
    one: (z) => `${z} minuto`,
    other: (z) => `${z} minutos`,
  });
  return (
    <Modal title="Ajuda - Minhas turmas" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Aqui você trabalha com a sua turma. Turmas e contas são criadas{" "}
          <strong>uma vez só</strong> - elas valem em todos os programas, com o
          mesmo código da turma e a mesma senha.
          {tastenflow && (
            <>
              {" "}
              Como docente, ao abrir o Tastenflow você sempre chega aqui.
              Praticar (<Taste>Alt</Taste> + <Taste>U</Taste>) leva à sua
              própria prática.
            </>
          )}
        </p>

        <Abschnitt titel="Como a página está organizada">
          <p className="m-0">
            <strong>No alto, na turma,</strong> aparecem o nome dela - se você
            tem várias turmas, na lista de opções Turma, para trocar de uma para
            outra -, o número de estudantes e o código da turma. À direita dessa
            linha, logo antes de Downloads, fica o seletor{" "}
            <strong>Progresso | Estudantes e acessos</strong> - no mesmo lugar
            nas duas telas a que ele leva.
          </p>
          <p className="m-0">
            Em <strong>Estudantes e acessos</strong> você cria uma turma nova,
            adiciona estudantes e os move de turma, consulta as senhas e os
            dados de acesso, o código da turma e os programas da turma. Para
            adicionar muitas pessoas de uma vez, use, em Estudantes,{" "}
            <strong>Adicionar estudantes de um arquivo Excel</strong>: primeiro
            Baixar modelo (Excel), depois uma linha por pessoa com o nome, a
            senha e - para o Tastenflow - o ponto de partida. Uma senha deixada
            em branco é gerada automaticamente; uma prévia mostra o que vai ser
            adicionado, e depois todas as pessoas adicionadas aparecem em
            Imprimir dados de acesso. Com <strong>Baixar lista da turma</strong>,
            logo ao lado, você baixa a qualquer momento um arquivo do Word com o
            nome, a senha e o código da turma de TODAS as pessoas desta turma -
            para imprimir na hora.
            {!tastenflow && (
              <>
                {" "}
                Uma mensagem para todas as pessoas da turma é escrita ali, em
                Mensagem para a turma.
              </>
            )}
          </p>
          <p className="m-0">
            Em <strong>Progresso</strong> - onde você chega ao abrir a página -
            aparecem os programas desta turma, os Downloads e, mais abaixo, as
            estatísticas da turma: em que ponto cada pessoa está.
            {tastenflow && (
              <>
                {" "}
                Bem no alto há uma linha de botões: <strong>{W}</strong>,{" "}
                <strong>Exercício personalizado</strong>,{" "}
                <strong>Meta semanal</strong>,{" "}
                <strong>Configurações da turma</strong> e{" "}
                <strong>Pausar por 1 hora</strong>. Cada botão abre a sua própria
                área logo abaixo - só uma de cada vez, e <Taste>Esc</Taste> a
                fecha de novo. {W} abre o formulário com as teclas usadas, a
                duração em minutos e Começar agora, além dos {WM} anteriores;
                Exercício personalizado define um texto para a turma inteira (um
                arquivo carregado, um texto de Meus textos ou um modelo do curso
                - as pessoas da turma recebem então uma janela só com
                Continuar); Meta semanal define os minutos por semana; Pausar
                por 1 hora marca 60 minutos em que a turma continua praticando,
                mas nada conta para a meta semanal. Mais abaixo fica a Visão
                geral da turma (mês ou ano letivo, com a barra de pontuação e o
                gráfico); à direita do título dela, Mensagem para a turma - uma
                mensagem para todas as pessoas da turma, que cada uma recebe na
                sua própria conversa.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              O botão <strong>Configurações da turma</strong> dessa linha abre:
              o ano escolar (dele o programa deduz o tipo de texto, e ele avança
              a cada ano letivo, que no programa começa no primeiro dia do mês
              escolhido ali - para turmas no Brasil, o programa sugere
              fevereiro; Pessoas adultas não avança), o idioma com o bloqueio, o
              ponto de partida da turma (vale também para quem entrar depois), a
              Competição da turma e Fim de linha com Enter. Esses valores valem
              para a turma inteira e já são pedidos ao criar uma turma; para
              cada pessoa ficam, na linha aberta dela, Por onde começar?,
              Digitar com uma mão, Com calma e Espaço maior entre letras (DVC).
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Os níveis de <strong>Por onde começar?</strong> levam o nome das
              teclas: Começo são só F e J, Posição inicial é toda a fileira
              central. Com <strong>Primeiras letras + maiúsculas</strong> entram
              as letras mais frequentes seguintes e a tecla Shift. Todas as
              letras, + pontuação, + números e Tudo desbloqueiam depois o resto,
              um passo de cada vez.
            </p>
          )}
          <p className="m-0">
            Cada botão se explica: a dica aparece assim que o foco chega até ele
            com a tecla Tab. <Taste>Esc</Taste> faz a dica sumir.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel={`O ${W}, passo a passo`}>
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Bem no alto das estatísticas da turma, na linha de atividades, o
                botão {W} abre o formulário.
              </li>
              <li>
                Escolher as <strong>teclas usadas</strong> - todas as pessoas da
                turma recebem o mesmo texto desse conjunto de teclas.
              </li>
              <li>
                Informar a <strong>duração</strong> em minutos - o campo fica
                logo ao lado das teclas usadas.
              </li>
              <li>
                Dizer à turma: <em>O tempo começa a contar no primeiro toque de
                cada pessoa.</em> A partir do início, todo mundo tem {einstieg}{" "}
                para começar; depois, o tempo corre separadamente para cada
                pessoa.
              </li>
              <li>
                <strong>Começar agora</strong> - o {W} começa na hora para a
                turma inteira.
              </li>
              <li>
                Logo depois aparece, por exemplo,{" "}
                <strong>Já entraram: 12/14 - ainda não: Ana, Davi</strong>: em 12
                aparelhos o {W} já chegou. Ele chega em mais ou menos um segundo.
                Se alguém ficar muito tempo em ainda não, recarregar a página uma
                vez costuma resolver.
              </li>
              <li>
                Enquanto ele dura, você vê Entregues: 3/14, com os nomes.
              </li>
              <li>
                Depois, os resultados aparecem embaixo do formulário: para cada
                pessoa, a posição, a <strong>pontuação</strong>, se a leitura em
                voz alta estava ligada, os toques por minuto, a precisão, os
                caracteres, os erros e as teclas que ainda não estão seguras.
                Chega também um e-mail com o resumo.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="O que significam as colunas da tabela">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="O que significa o nível de dificuldade">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Os valores com que você pode compor uma nota">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="O código da turma">
          <p className="m-0">
            Ele aparece no alto, ao lado do nome da turma, e vale para todos os
            programas. Para entrar, digita-se o código da turma, o nome e a
            senha; o aparelho guarda o código, e depois bastam o nome e a senha.
          </p>
          <p className="m-0">
            Ele é <strong>obrigatório</strong> ao criar uma turma. Enquanto você
            digita o nome, o programa sugere um código adequado - "5B Silva"
            vira "5BSILVA". Você pode alterá-lo, mas não deixá-lo em branco. Mais
            tarde, ele é alterado em Estudantes e acessos, com Editar turma.
          </p>
          <p className="m-0">
            ⚠️ Se você mudar o código, todas as pessoas da turma passam a entrar
            com o código novo.
          </p>
        </Abschnitt>

        <Abschnitt titel="Mover uma pessoa para outra turma">
          <p className="m-0">
            Em Estudantes e acessos, cada pessoa tem{" "}
            <strong>Mover para outra turma</strong>. Isso abre o campo Código da
            nova turma. Funciona com qualquer turma cujo código você conheça -
            também com a turma de outra pessoa docente. Antes de mover, o
            programa pede confirmação.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Depois, a pessoa entra com o novo código da turma.</li>
            <li>As pessoas docentes da nova turma veem a pessoa e o progresso dela.</li>
            <li>
              {tastenflow
                ? `Os resultados dos ${WM} anteriores e as mensagens ficam na turma anterior.`
                : "As mensagens ficam na turma anterior."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Atalhos de teclado desta área">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> abre e fecha esta ajuda.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> mostra a lista de todos os
            atalhos. <Taste>Alt</Taste> + <Taste>U</Taste> leva à sua própria
            prática. <Taste>Alt</Taste> + <Taste>N</Taste> abre as mensagens,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> o menu de cores e contraste, e{" "}
            <Taste>Alt</Taste> + <Taste>J</Taste> o menu da conta.
          </p>
          <p className="m-0">
            A tecla Tab percorre as guias; Enter troca de guia. Depois da troca,
            o foco está na área nova - um leitor de tela continua a leitura a
            partir dali.
          </p>
        </Abschnitt>

        <Abschnitt titel="Para saber mais">
          <p className="m-0">
            O manual para docentes (por enquanto em inglês) abre no alto, em
            Downloads - ali também está o cartaz do Tastenflow para imprimir e
            pendurar (A3), disponível para todo mundo, mesmo sem login.
            {tastenflow && (
              <>
                {" "}
                A ajuda dentro do próprio programa abre ali com{" "}
                <Taste>Alt</Taste> + <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
