/**
 * ★★★ O-HILFE-BR (25.10.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE,
 * PORTUGIESISCH (BRASILIEN, `pt-BR`).
 * ===========================================================================
 * Aus der Funktion geschrieben, in derselben Reihenfolge wie die deutsche
 * Fassung und alle Übersetzungen (1 bis 12, samt 4a, 4b, 8a, 8b) - wer eine
 * Stelle prüft, findet sie in allen. Sichtbar nur mit
 * `spracheGewaehlt === "br"` (`LehrerHilfe.tsx`). Eigenständig neben der
 * Fassung für Portugal (`.pt.tsx`).
 *
 * ── ANREDE (Glossar `recherche-portugiesisch-brasilien-2026-10-25/GLOSSAR-pt-BR.md`, Regel 1/2) ──
 * **você** auch für Lehrkräfte (Microsoft pt-BR), Imperativ der 3. Person
 * („Escolha", „Pressione"); Knöpfe im Infinitiv ohne Anführung
 * („Criar turma", „Começar agora"). Kein Adjektiv/Partizip über eine Person,
 * keine Personenwörter mit Geschlecht: „docente(s)", „estudantes", „pessoa",
 * „quem aprende", nie „professor/aluno". Keine Ausrufezeichen.
 *
 * ── WAS BRASILIEN ANDERS IST ─────────────────────────────────────────────────
 *  · Zahlen über `zahl(n, "br")` (1.234, Tausenderpunkt auch vierstellig),
 *    Prozent ohne Leerzeichen („96%"). Null nie über `mehrzahl()` (Regel 13).
 *  · Das Wort der Tippchallenge („Desafio") steht hier, solange
 *    `schreibprobe.ts` kein `PRUEFUNG_WORT_BR` hat.
 *  · Score-Erklärung und Kurven-Hinweis stehen hier ausgeschrieben (wie in der
 *    tschechischen Fassung) - `score.ts` hat noch keine pt-BR-Konstanten.
 *  · Abschnitt 4: der Weg „br" bekommt seine Reihenfolge in F4 (parallel) -
 *    die Grundreihe und was ihr folgt kommen darum aus `LERNWEGE.br` (heute
 *    noch die englische Vorgabe, nach F4 die eigene). Fest steht nur, was aus
 *    der Tastatur und dem Bauplan folgt (Ç in der Grundreihe, Akzent-Tasten).
 *  · Tastatur: Português (Brasil ABNT2) (`layouts.ts`, `br-abnt2`, nur gelesen).
 *  · Schuljahr: im Programm ab dem Monat aus „Configurações da turma"; für
 *    Brasilien schlägt das Programm Februar vor (`schuljahrBeginn.ts`).
 *  · Abschnitt 12: eigenes Handbuch; das Plakat hat eine eigene Fassung in der Sprache (`tastenflowPlakat`).
 *  · `LeistungsstufeHilfe` und `DreiWerteHilfe` sind seit O2-COMP eigen; ⚠️ `DidaktikInhalt` ist ein
 *    gemeinsamer Baustein und zeigt für „br" bis zu seiner eigenen Etappe
 *    Englisch (RÜCKFALL-EN G2-NEUN) - nicht Teil von O-HILFE-BR.
 *
 * Gerade Anführungszeichen nur um Beispiele, nur Bindestrich, keine
 * Maus-Wörter, Person zuerst („estudantes com deficiência visual").
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, MIND_ZEICHEN, PROBEN_JE_NIVEAU } from "@/lib/typing/schreibprobe";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { mehrzahl, zahl } from "@/lib/bedienSprache";
import { LERNWEGE } from "@/lib/typing/lernweg";
import { useFocusTrap } from "./useFocusTrap";
import { DidaktikInhalt, didaktikAbschnittTitel } from "./DidaktikHinweise";
import { DreiWerteHilfe, LeistungsstufeHilfe } from "./TastenflowZahlenHilfe";
import { RundgangLehrkraftKnoepfe } from "./Rundgang";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { handbuecherFuer, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

/** Das Handbuch - derselbe Knopf wie in den anderen Fassungen. */
function HandbuchLaden() {
  const h = handbuecherFuer("tippen")[0];
  if (!h) throw new Error("Kein Tastenflow-Handbuch in HANDBUECHER");
  return (
    <p className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </p>
  );
}

/** Das Plakat - `div` statt `p` (der Knopf kann einen Fehler-Absatz zeigen). */
function PlakatLaden() {
  return (
    <div className="m-0">
      <HandbuchKnopf alsLink handbuch={tastenflowPlakat()} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

// Glossar §2.3: „Desafio", Mz. „Desafios".
const W = "Desafio";
const WM = "Desafios";

export function LehrerHilfeBrasilianisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  // Glossar §2.11: one/other; die Zahlen hier sind nie 0.
  const einstieg = mehrzahl(EINSTIEGSFENSTER_MIN, "br", {
    one: (z) => `${z} minuto`,
    other: (z) => `${z} minutos`,
  });
  // ★ Die Grundreihe des Weges „br" und was bis Shift folgt (nur Buchstaben) - nach F4 die eigene Folge.
  const brWeg = LERNWEGE.br;
  const brGrundreihe = brWeg.letterOrder.slice(0, 8).map((c) => c.toUpperCase()).join(" ");
  const brNachGrundreihe = brWeg.letterOrder
    .slice(8, brWeg.lettersBeforeShift)
    .filter((c) => /^\p{L}$/u.test(c))
    .map((c) => c.toUpperCase())
    .join(" ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ajuda para docentes do Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Ajuda para docentes: todas as funções do Tastenflow
          </h2>
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
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          O Tastenflow tem o seu <strong>próprio sistema de contas</strong>,
          totalmente separado do login da plataforma. Entrar aqui não muda nada
          no login da plataforma - e vice-versa.
        </p>

        <Section title="1 · Criar turmas e contas">
          <p className="m-0">
            Como docente, ao abrir o Tastenflow você sempre chega a{" "}
            <strong>Minhas turmas</strong>; <strong>Praticar</strong> (
            <Kbd>Alt</Kbd> + <Kbd>U</Kbd>) leva à sua própria prática. Em{" "}
            <strong>Estudantes e acessos</strong>, no alto à direita, você cria
            uma turma - na área que se abre,{" "}
            <strong>Criar uma turma nova</strong>. O{" "}
            <strong>código da turma</strong> é obrigatório: enquanto você digita
            o nome, o programa sugere um código adequado ("5B Silva" vira
            "5BSILVA"); você pode alterá-lo, por exemplo para <code>5B-2</code>.
            O código vale para a turma inteira. Na mesma área você escolhe o{" "}
            <strong>ano escolar</strong> e o <strong>ponto de partida</strong> e
            confere o idioma (com o bloqueio) e a Competição da turma - os mesmos
            campos de Configurações da turma. <strong>Criar turma</strong> só
            funciona quando tudo está preenchido; caso contrário, uma frase diz o
            que falta, e o foco vai para o primeiro campo que falta.
          </p>
          <p className="m-0">
            Depois, adicione estudantes com <strong>nome e senha</strong>. Assim
            cada pessoa pode entrar em <strong>qualquer aparelho</strong> com{" "}
            <em>código da turma + nome + senha</em>. O aparelho guarda o código
            da turma, então depois basta digitar o nome e a senha.
          </p>
          <p className="m-0">
            Mais tarde, você pode mudar o nome e o código da turma com{" "}
            <strong>✏️ Editar</strong> - um código novo vale então para todas as
            pessoas da turma (a partir daí, elas entram com o código novo).
          </p>
          <p className="m-0">
            <strong>Outra possibilidade:</strong> quem não faz parte de nenhuma
            turma também pode <strong>criar uma conta pessoal</strong> - na
            janela de login, com a opção Pratico sem turma e um endereço de
            e-mail. Para você, nada muda: essas contas não pertencem a nenhuma
            turma, não aparecem em nenhuma das suas listas e recebem um resumo
            semanal próprio. Na sua turma tudo continua igual - quem adiciona as
            pessoas é você.
          </p>
        </Section>

        <Section title="2 · Configurações da turma e de cada pessoa">
          <p className="m-0">
            <strong>Para a turma inteira</strong> (o botão Configurações da turma
            na linha de atividades acima da tabela, ao lado de {W}, Exercício
            personalizado, Meta semanal e Pausar por 1 hora - mesmo fechado, o
            botão já mostra o ano escolar, o idioma e a Competição da turma):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Ano escolar:</strong> a partir dele, o programa calcula a
              faixa de idade dos textos - o vocabulário, o tipo de humor e o tom
              dos textos de prática. O 7º ano do ensino fundamental corresponde a
              cerca de 12 a 13 anos, ou seja, textos para 11-15 anos.{" "}
              <strong>Ele avança com a turma:</strong> o programa guarda o ano
              letivo do registro e sobe um ano a cada ano letivo, sem que você
              precise ajustar nada. No programa, o <strong>ano letivo começa no
              primeiro dia do mês</strong> escolhido em Configurações da turma;
              para turmas no Brasil, o programa sugere <strong>fevereiro</strong>{" "}
              (o ano letivo brasileiro vai de fevereiro a dezembro). Nessa data, a
              turma passa para o ano seguinte, e as estatísticas do ano letivo
              seguem o mesmo calendário. Para grupos de pessoas adultas existe o
              nível <strong>Pessoas adultas</strong> - esse não avança. O ano de
              nascimento não é pedido às pessoas de uma turma.
            </li>
            <li>
              <strong>Idioma e bloqueio:</strong> português do Brasil ou inglês
              para as palavras e os textos de prática da turma inteira; com o
              cadeado ao lado, as pessoas da turma não podem mais mudar o idioma
              por conta própria. Todo mundo tem, no alto da tela, o botão redondo
              de idioma (com o globo): ele muda os botões e os menus e, junto, os
              textos de prática - com o cadeado, só os botões e os menus.
            </li>
            <li>
              <strong>Ponto de partida da turma:</strong> a resposta a "Por onde
              começar?" para a turma inteira - vale também para quem entrar
              depois e só acrescenta teclas: quem já está mais adiante não perde
              nada. Ao escolher, o programa registra o ponto ao mesmo tempo para
              as pessoas que já estão na turma; se alguém já estiver mais
              adiante, ele pergunta antes e oferece três caminhos: ajustar todo
              mundo, só quem ainda não chegou lá, ou cancelar. Vale assim que a
              pessoa abrir o Tastenflow de novo; as estatísticas e as medalhas
              são sempre mantidas.
            </li>
            <li>
              <strong>Permitir a Competição da turma:</strong> as pessoas da
              turma podem se convidar para uma competição de 5 minutos. Em Tempos
              de prática, na linha aberta, você vê quantas vezes cada pessoa
              participou por semana - sem classificação e sem tempos.
            </li>
            <li>
              <strong>Fim de linha com Enter:</strong> marcado, cada pessoa da
              turma termina cada linha de prática com a tecla Enter - como ao
              digitar num escritório. Vale para Meu treino, Histórias, Exercício
              personalizado, os jogos de palavras com linhas, o {W} e a
              Competição da turma; não vale para as charadas, Letras
              embaralhadas, Ditado dos dedos, a Expedição polar e Explorar
              teclas. Padrão: desligado.
            </li>
          </ul>
          <p className="m-0">
            <strong>Para cada pessoa</strong> (atrás da seta na linha dela):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Teclado:</strong> escolhido nas configurações (a
              engrenagem), em Teclado - no Brasil, normalmente o{" "}
              <strong>Português (Brasil ABNT2)</strong>; o ABNT, mais antigo, tem
              as mesmas teclas. A opção vale para este aparelho (não para a
              conta) e define o teclado na tela, as dicas dos dedos e os
              caracteres praticados. Pontos que vale a pena conhecer no teclado
              brasileiro: (1) o <strong>Ç</strong> tem uma tecla própria à
              direita do L e faz parte da fileira central (dedo mínimo direito);
              (2) a <strong>tecla do acento agudo</strong> <Kbd>´</Kbd> fica à
              direita do P (com Shift, o acento grave), a{" "}
              <strong>tecla do til</strong> <Kbd>~</Kbd> à direita do Ç (com
              Shift, o circunflexo) - primeiro a tecla de acento, depois a vogal;
              (3) <Kbd>Shift</Kbd> + <Kbd>6</Kbd> é uma tecla de acento (trema),
              por isso o Tastenflow nunca a pede como símbolo; (4) a{" "}
              <strong>/</strong> e o <strong>?</strong> ficam numa tecla extra ao
              lado do Shift direito - sem essa tecla, <Kbd>Alt Gr</Kbd> +{" "}
              <Kbd>Q</Kbd> e <Kbd>Alt Gr</Kbd> + <Kbd>W</Kbd>; (5) o teclado
              brasileiro não tem o símbolo do <strong>euro (€)</strong>, por isso
              o Tastenflow não o pede nele. Letras com e sem acento (e, é, ê) são
              letras diferentes: o programa espera exatamente a que está no texto.
            </li>
            <li>
              <strong>Por onde começar?:</strong> a mesma lista de pontos de
              partida da turma (veja acima) - aqui para uma pessoa que precisa de
              uma exceção. Quem já tem prática pula o básico e começa mais
              adiante (por exemplo, só a partir dos números); para voltar alguém
              a um ponto anterior, o programa pede confirmação antes.
            </li>
            <li>
              <strong>Digitar com uma mão:</strong> tira, para esta pessoa, a
              regra do Shift com a outra mão - as letras maiúsculas e os símbolos
              passam a valer com qualquer tecla Shift.
            </li>
            <li>
              <strong>Com calma:</strong> a velocidade não é avaliada em lugar
              nenhum para esta pessoa - sem limite de tempo no jogo, sem meta de
              velocidade nas estrelas, sem subir ou descer de nível de
              dificuldade pela velocidade. Para quem digita com cuidado, mas
              muito devagar.
            </li>
            <li>
              <strong>Espaço maior entre letras (DVC):</strong> mais espaço entre
              cada caractere ao copiar, em três graus (duplo, triplo, quádruplo) -
              para estudantes com deficiência visual cortical (DVC, em inglês
              CVI), para quem caracteres muito próximos se misturam. A própria
              pessoa também pode mudar o espaço nas configurações dela (a
              engrenagem, <AltText>Alt + O</AltText>) - e você pode mudar de novo
              aqui a qualquer momento. Vale o que foi escolhido por último.
            </li>
          </ul>
          <p className="m-0">
            Tudo pode ser mudado a qualquer momento - os valores da turma no
            painel Configurações da turma acima da tabela, os valores de cada
            pessoa na linha aberta dela.
          </p>
        </Section>

        <Section title="3 · O nível de dificuldade (1-50): o coração do sistema">
          <LeistungsstufeHilfe />
          <p className="m-0">
            O <strong>nível atual</strong> aparece na tabela (coluna{" "}
            <strong>Nível</strong>) e no alto da tela de prática. Você não
            precisa ajustar nada - só ligar Com calma, se for preciso.
          </p>
        </Section>

        <Section title="4 · Meu treino: adaptativo, pela frequência das letras">
          <p className="m-0">
            O Tastenflow tem <strong>um único</strong> caminho de prática, que
            cada pessoa percorre no seu ritmo - e ele se{" "}
            <strong>adapta</strong>: o programa mede cada tecla separadamente,
            pratica automaticamente as mais difíceis e só desbloqueia uma tecla
            nova quando as anteriores estão seguras.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Ordem pela frequência das letras</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Depois da posição inicial chegam primeiro as letras{" "}
                <strong>mais frequentes</strong> - assim, já depois de poucas
                teclas, surgem <strong>palavras de verdade</strong>.
              </li>
              <li>
                <strong>Cada trilha é diferente</strong> - qual tecla vem a seguir
                depende da pessoa, não de uma lista fixa.
              </li>
              <li>
                <strong>Sem fim fixo</strong> - ideal para a prática diária e
                autônoma.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>Para o seu planejamento:</strong> a trilha brasileira tem uma{" "}
            <strong>ordem própria de teclas</strong>, pensada para o teclado
            ABNT2 e para a frequência das letras no português do Brasil. No
            teclado brasileiro, a <strong>fileira central já tem uma vogal (A)
            e o Ç</strong> ({brGrundreihe}). Depois vêm {brNachGrundreihe}, em
            seguida a tecla Shift com o ponto e a vírgula - assim aparecem cedo
            palavras e frases de verdade. As <strong>teclas de acento</strong>{" "}
            (til, acento agudo, circunflexo, acento grave) chegam depois disso,
            cada uma como um passo próprio: primeiro a tecla de acento, depois a
            letra. Por último vêm os outros sinais de pontuação, os números e os
            símbolos.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>A ordem depende do idioma da primeira prática:</strong> a
            trilha que uma turma segue depende do idioma dos botões e menus na
            primeira vez em que ela praticou. Uma turma que começou, por exemplo,
            em alemão ou em inglês mantém essa ordem mesmo que o idioma mude
            depois: a ordem é decidida uma vez e não muda mais.
          </p>
          <p className="m-0">
            <strong>O mesmo texto para a turma inteira:</strong> os textos do
            curso (fileira central, fileiras de letras, acentos, pontuação,
            números, símbolos, textos inteiros) estão disponíveis como{" "}
            <strong>modelos</strong> na área <strong>Exercício
            personalizado</strong> de Minhas turmas - escolha um, e a turma
            inteira pratica o mesmo texto, não importa em que ponto cada pessoa
            esteja (como com um arquivo carregado, isso conta como tempo de
            prática, e nenhuma tecla nova é desbloqueada por isso).
          </p>
          <p className="m-0">
            <strong>Radicais das palavras e código de programação:</strong> para
            a trilha brasileira, os modelos também trazem o grupo{" "}
            <strong>Radicais das palavras</strong>: palavras para copiar, cada
            uma com uma breve explicação da sua origem, organizadas por temas; as
            pessoas da turma só copiam as duas coisas. Há ainda{" "}
            <strong>código de programação</strong> para copiar (dez linguagens,
            código-fonte real de projetos abertos, trechos diferentes dos do{" "}
            {W}) - só no Exercício personalizado.
          </p>
        </Section>

        <Section title="4a · Exercício personalizado: um texto para a turma inteira">
          <p className="m-0">
            Com o botão <strong>Exercício personalizado</strong> na linha de
            atividades das estatísticas da turma, você define um texto que a
            turma inteira pratica - não importa em que ponto cada pessoa esteja.
            Há três caminhos: <strong>carregar um arquivo</strong> (.txt ou
            .docx), escolher um texto já salvo em <strong>Meus textos</strong>{" "}
            ou usar um dos <strong>modelos</strong> do curso (veja o item 4).
          </p>
          <p className="m-0">
            <strong>Meus textos</strong> é o seu acervo pessoal - pertence à sua
            conta, não à turma, e só você o vê. Ao carregar um arquivo, a opção{" "}
            <strong>Salvar em Meus textos</strong> (ligada no começo) guarda uma
            cópia automaticamente, para você usar o mesmo texto mais tarde sem
            carregá-lo de novo.
          </p>
          <p className="m-0">
            Se o arquivo tiver caracteres que não podem ser digitados, o painel
            os mostra antes de começar - você decide se corrige o arquivo ou se
            começa assim mesmo (então esses caracteres são tirados das linhas e
            nunca contam como toque obrigatório).
          </p>
          <p className="m-0">
            <strong>Começar o exercício:</strong> cada pessoa da turma recebe na
            hora uma janela que anuncia o Exercício da escola - só dá para
            pressionar <strong>Continuar</strong>, não para recusar. Para cada
            pessoa, o exercício termina automaticamente assim que o texto foi
            digitado uma vez; depois, a prática normal continua.{" "}
            <strong>Concluir</strong> encerra o exercício antes, para a turma
            inteira.
          </p>
          <p className="m-0">
            O exercício conta como tempo de prática e é medido como qualquer
            rodada, teclas inseguras incluídas - mas{" "}
            <strong>não desbloqueia nenhuma tecla nova</strong>: só contam as
            teclas do arquivo.
          </p>
        </Section>

        {/* ★ D-9 (28.09.2026): Didaktik - Sätze aus `lib/typing/didaktikHinweise.ts` (für „br" noch Englisch, RÜCKFALL-EN). */}
        <Section title={didaktikAbschnittTitel("br")}>
          <DidaktikInhalt lang="br" />
        </Section>

        <Section title="5 · Textos com sentido desde o começo">
          <p className="m-0">
            O Tastenflow mostra textos de verdade, adequados à idade,{" "}
            <strong>o mais cedo possível</strong> - piadas, provérbios, ditados,
            textos de curiosidades, trava-línguas, jogos de palavras e frases
            inteiras. Um texto aparece assim que as suas{" "}
            <strong>letras</strong> foram aprendidas; uma simples sequência de
            letras é a exceção (só para praticar de propósito uma tecla que
            acabou de chegar).
          </p>
          <p className="m-0">
            <strong>Letras maiúsculas:</strong> a ortografia está{" "}
            <strong>sempre correta</strong> (maiúscula no começo da frase e nos
            nomes próprios) - ninguém na turma vê uma palavra escrita errado. No
            começo basta a letra <strong>minúscula</strong>; a maiúscula aparece
            automaticamente (para <strong>todas as idades</strong>, porque a
            ortografia correta conta em qualquer idade).
          </p>
          <p className="m-0">
            No Meu treino, porém, a{" "}
            <strong>tecla Shift de verdade chega cedo</strong> - logo depois das
            primeiras letras frequentes, assim que há palavras de verdade
            suficientes para praticar (não só depois do alfabeto inteiro). A
            partir daí, as maiúsculas são digitadas "de verdade", com Shift.
            Assim as pessoas da turma aprendem cedo a escrever as maiúsculas por
            conta própria, em vez de depender por muito tempo da ajuda
            automática.
          </p>
          <p className="m-0">
            <strong>A pontuação</strong> (ponto, vírgula, ponto de interrogação
            …) só aparece quando já foi aprendida - antes disso, a frase aparece
            "sem ponto nem vírgula". Já uma tecla de <em>letra</em> ou de{" "}
            <em>número</em> que ainda não foi aprendida <strong>nunca</strong> é
            exigida.
          </p>
        </Section>

        <Section title="6 · Estrelas, medalhas e sons (importantes para estudantes com deficiência visual)">
          <p className="m-0">
            Cada rodada dá <strong>de 1 a 3 estrelas</strong> conforme a
            precisão e a velocidade - <strong>a precisão vale o triplo</strong>:
            3 estrelas pedem sempre cerca de 96% de acertos (digitar rápido e
            errado não é premiado); por outro lado, uma rodada sem nenhum erro
            garante 2 estrelas, mesmo na velocidade mais lenta. Cada número de
            estrelas tem um <strong>som próprio</strong>; quando alguém{" "}
            <strong>sobe de nível</strong>, toca uma comemoração especial. Esses
            sons são a principal resposta para estudantes com deficiência
            visual. O botão <strong>🔇</strong> tira o som numa aula silenciosa.
          </p>
          <p className="m-0">
            Além disso há <strong>medalhas</strong> com nomes pensados para
            crianças - em famílias, com graus crescentes e um próximo objetivo
            que sempre pode ser anunciado. Só quem tem textos para 7-10 anos vê
            os nomes com mascotes; a partir dos textos para 11-15 anos aparece em
            todo lugar o nome neutro. As medalhas são as mesmas - o que foi
            conquistado fica, mesmo que a faixa de idade dos textos mude. Quase
            todas premiam a <strong>precisão</strong> e a{" "}
            <strong>persistência</strong>; a única medalha de velocidade pede 95%
            de precisão. Uma medalha nova traz o seu próprio som "tcharam" com
            um aviso falado e depois aparece no topo das estatísticas (para a
            pessoa e para você - a mesma visão). Cada medalha pode ser{" "}
            <strong>selecionada</strong> para abrir em tamanho grande, com um
            efeito.
          </p>
          <p className="m-0">
            <strong>Placas de gelo 🐧</strong> é o prêmio depois de uma tecla
            nova no Meu treino: o pinguim atravessa um percurso feito com os{" "}
            <strong>caracteres mais inseguros</strong> de cada pessoa.{" "}
            <strong>A tecla já está desbloqueada antes</strong> - o avanço não
            depende de nenhum jogo. Tentativas ilimitadas, sem fim de jogo; onde
            só se pede precisão, não há <strong>nenhuma pressão de
            tempo</strong> (um limite de tempo que pode ser desligado, como
            exigem as WCAG). Além disso, quem tem 7 a 15 anos pode começar o jogo
            quando quiser com o botão <strong>Jogar</strong> - como uma aventura
            do dia com <strong>peixes bônus</strong> e a{" "}
            <strong>Caverna do eco</strong>, onde cada tecla é apenas anunciada
            (ali o programa fala mesmo com a leitura em voz alta desligada -
            estudantes com e sem deficiência visual jogam exatamente do mesmo
            jeito). Uma rodada sem erros termina com a aurora polar. Importante
            para a sua avaliação: o jogo <strong>não conta</strong> como tempo de
            prática nem para a meta semanal - é só motivação.
          </p>
          <p className="m-0">
            <strong>Duas entradas diferentes no jogo - vale não
            confundir:</strong> o botão <strong>Jogar</strong> é o caminho livre
            que cada pessoa abre por conta própria; ele existe para a faixa de{" "}
            <strong>7 a 15 anos</strong>, não a partir de 16. Já a partida{" "}
            <strong>depois de uma tecla nova</strong> vem automaticamente: sempre
            de 7 a 10 anos, nunca a partir de 16, e de 11 a 15 anos só se Placas
            de gelo estiver escolhido nas configurações, em{" "}
            <strong>Jogo de recompensa</strong>, em vez de{" "}
            <strong>Nenhum</strong> (o padrão). Essa opção pertence ao{" "}
            <strong>aparelho</strong>, não à conta - como o layout do teclado.
            Num computador da escola, ela vale, portanto, para todas as pessoas
            que praticam nele.
          </p>
        </Section>

        <Section title="7 · Meta semanal">
          <p className="m-0">
            Para cada pessoa, você define <strong>minutos por semana</strong> -
            um número simples, sem aulas para indicar. Aplicar a todos grava o
            mesmo valor para a turma inteira de uma vez e vale também para quem
            entrar depois.
          </p>
          <p className="m-0">
            Uma mudança vale sempre <strong>a partir da segunda-feira seguinte
            às 8:00</strong> - a semana em andamento mantém a meta anterior. Uma
            janela mostra a data exata antes de salvar.
          </p>
          <p className="m-0">
            <strong>Recuperar:</strong> com Recuperar os minutos das semanas
            anteriores marcado, todos os minutos que faltam podem ser recuperados
            de uma vez.
          </p>
          <p className="m-0">
            <strong>Dispensar a semana</strong> (por exemplo, por doença) e{" "}
            <strong>Zerar os minutos atrasados</strong> são definidos para cada
            pessoa, sem mudar o tempo praticado.
          </p>
          <p className="m-0">
            <strong>Pausar por 1 hora:</strong> um botão separado para a turma
            inteira, por 60 minutos. As pessoas continuam praticando - o tempo de
            prática e as estatísticas continuam contando, só não para a meta
            semanal durante essa hora. Pressionar o mesmo botão de novo retoma a
            meta antes.
          </p>
        </Section>

        <Section title="8 · Estatísticas e evolução (para cada pessoa, numa linha que se abre)">
          <p className="m-0">
            Com o botão redondo com seta<span aria-hidden="true"> ▸</span> antes
            do nome, você abre seis linhas, cada uma também fechável, de cima
            para baixo: <strong>Configurações</strong> (as opções do item 2, para
            essa pessoa), <strong>{WM}</strong> (só se houver pelo menos um),{" "}
            <strong>Tempos de prática</strong> (por semana, com a situação da
            meta dessa semana e - se houve participação - o número de
            Competições da turma, mais o resumo de todo o ano letivo),{" "}
            <strong>Teclas inseguras</strong>, <strong>Medalhas</strong> e - só
            se algum valor chamar a atenção - <strong>Trabalho autônomo</strong>{" "}
            (veja o item 9).
          </p>
          <p className="m-0">
            No alto de Tempos de prática, você vê de quantas Competições da turma
            a pessoa participou (contadas nesta turma); Enter numa semana abre o
            detalhe de cada sessão - dia, hora de início e de fim, tempo líquido
            de digitação e o que foi praticado.
          </p>
          <p className="m-0">
            Os números num relance, a evolução ao longo do tempo, a situação das
            teclas, as histórias e as curiosidades ficam em{" "}
            <strong>Meu progresso</strong> de cada pessoa, onde você vê
            exatamente a mesma visão.
          </p>
          <p className="m-0">
            <strong>A pontuação:</strong> a pontuação reúne a precisão e a
            velocidade de cada pessoa num só número de 0 a 100; uma tecla errada
            conta como 5 caracteres, e o dobro da velocidade conta só cerca de
            1,4 vez - a precisão vence a velocidade.
          </p>
          <p className="m-0">
            <strong>Na tabela da turma</strong>, três colunas ficam agrupadas sob
            o título <strong>Prática</strong>: precisão, toques por minuto e
            pontuação. As três vêm da prática no período escolhido, e a
            pontuação combina as outras duas. Por isso elas têm um fundo um pouco
            mais cinza e uma borda fina; o leitor de tela anuncia Prática antes
            do título da coluna. A coluna <strong>{W}</strong>, bem à direita,
            fica de propósito fora desse grupo - sob o seu próprio título {W}:
            ela é uma prova num dia determinado, não a prática do dia a dia.
          </p>
          <p className="m-0">
            Na coluna <strong>Pontuação</strong>: quem digitou menos de 200
            caracteres no período escolhido não tem pontuação, só um traço -
            abaixo disso, um único erro faria perder vários pontos.
          </p>
          <p className="m-0">
            <strong>Baixar em Excel</strong> fica acima da tabela, à direita de
            Total. O botão baixa a tabela com o nome{" "}
            <strong>nomedaturma_data.xlsx</strong> (por exemplo
            "3A_2026-09-12.xlsx") - para o período escolhido naquele momento. No
            começo há um resumo com links para os quatro períodos e uma legenda
            que explica cada coluna e mostra como a pontuação é calculada. Em
            seguida vêm quatro planilhas: o ano letivo atual, o total, o mês (as
            últimas 4 semanas) e esta semana. Os valores são guardados como
            números, para você poder continuar calculando no Excel; onde a
            tabela mostra um traço, o arquivo também mostra.
          </p>
          <p className="m-0">
            <strong>A visão geral da turma</strong> acima da tabela mostra a
            turma como um todo. Mês (as últimas 4 semanas) vem pré-selecionado;
            Ano letivo fica logo ao lado. Uma linha traz os toques por minuto, a
            precisão e as metas semanais, cada um com uma pequena tendência -
            para o mês em comparação com as 4 semanas anteriores, para o ano
            letivo as primeiras semanas de prática em comparação com as últimas.
          </p>
          <p className="m-0">
            <strong>A barra de pontuação Pontuações na turma</strong> mostra um
            ponto por pessoa. A tecla Tab leva até a barra, e as teclas de seta
            passam de uma pessoa para outra - cada parada é anunciada ("Ana, 78
            pontos"). Quantas pessoas estão abaixo de 50, entre 50 e 70, entre
            70 e 85 e acima de 85 pontos, e quem digitou pouco demais, é dito na
            dica do título dela.
          </p>
          <p className="m-0">
            <strong>O gráfico Pontuação da turma no ano letivo</strong> mostra,
            por semana, a média de quem digitou pelo menos 5 linhas; um espaço
            vazio significa que nessa semana houve pouca prática. A tecla Tab
            leva até o gráfico, e as teclas de seta passam de uma semana para
            outra; para o leitor de tela, todas as semanas também estão numa
            tabela. Quando chegam a tecla Shift, os números ou os símbolos, a
            curva cai por um tempo - isso é normal e não é motivo de
            preocupação.
          </p>
          <p className="m-0">
            <strong>A curva:</strong> é normal que a curva não só suba. Quando
            chegam teclas novas, ela quase sempre cai primeiro - principalmente
            com a tecla Shift e com os números.
          </p>
          <p className="m-0">
            <strong>Transparência:</strong> cada pessoa vê exatamente os mesmos
            números sobre si em Meu progresso - você nunca vê mais do que a
            própria pessoa.
          </p>
        </Section>

        <Section title="8a · Os valores com que você pode compor uma nota">
          <DreiWerteHilfe />
        </Section>

        <Section title={`8b · O ${W}: uma prova para a turma inteira`}>
          <p className="m-0">
            Na área docente <strong>Minhas turmas</strong>, bem no alto das{" "}
            <strong>estatísticas da turma</strong> do Tastenflow, na linha de
            atividades, está o botão <strong>{W}</strong>. Ele abre o formulário
            com que você inicia uma prova para a turma inteira -{" "}
            <strong>todo mundo recebe o mesmo texto</strong>, não importa em que
            ponto da trilha cada pessoa esteja.
          </p>
          <p className="m-0">
            <strong>Três coisas para ajustar:</strong> as{" "}
            <strong>teclas usadas</strong> (de Fileira central a Todas as
            teclas), logo ao lado o <strong>tipo</strong> e a{" "}
            <strong>duração</strong> em minutos. <strong>Começar agora</strong>{" "}
            inicia na hora.
          </p>
          <p className="m-0">
            <strong>Rigoroso</strong> (padrão): uma tecla errada não faz avançar,
            cada tecla errada conta - mesmo que seja corrigida na hora.{" "}
            <strong>Escrita livre</strong> lembra uma cópia clássica: os erros
            ficam como foram digitados e não são marcados, e Backspace só corrige
            dentro da linha atual. O que é avaliado só é calculado no final, a
            partir do que continua errado - no máximo um erro por palavra, a
            última palavra incompleta não conta, e o que foi corrigido não conta
            de jeito nenhum. Como um erro que fica não custou tempo de digitação,
            ele pesa mais: {FEHLER_GEWICHT_FREI} caracteres em vez de{" "}
            {FEHLER_GEWICHT} (8a). Escolha Escrita livre quando a turma deve
            praticar uma cópia sem que um erro trave a digitação; escolha
            Rigoroso para pôr à prova a digitação em si.
          </p>
          <p className="m-0">
            <strong>Três relógios que vale a pena distinguir:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              O <strong>início</strong> - o momento em que você pressiona
              Começar agora. A partir dele, a turma pode começar.
            </li>
            <li>
              A <strong>janela de entrada</strong>: {einstieg} depois do início.
              Até lá, cada pessoa ainda pode começar; depois, é tarde.
            </li>
            <li>
              A <strong>duração</strong> corre{" "}
              <strong>separadamente para cada pessoa</strong>, e só a partir do{" "}
              <strong>primeiro toque</strong> dela. Duas pessoas da mesma turma
              terminam, portanto, em momentos diferentes - é de propósito: quem
              precisa primeiro se orientar não perde tempo.
            </li>
          </ul>
          <p className="m-0">
            <strong>Os textos:</strong> para cada conjunto de teclas usadas há{" "}
            <strong>{PROBEN_JE_NIVEAU} textos de {W}</strong> com pelo menos{" "}
            {zahl(MIND_ZEICHEN, "br")} caracteres cada - longos o bastante para
            nunca acabarem, mesmo em alta velocidade. Esses textos{" "}
            <strong>não aparecem na trilha</strong>, então ninguém pôde
            praticá-los antes. O próximo {W} com as mesmas teclas usadas continua
            a partir do ponto mais distante alcançado na vez anterior: na linha
            seguinte ou, nos textos com frases, no começo da frase seguinte. Se
            um texto acabar durante o {W}, as pessoas seguem com o próximo sem
            interrupção.
          </p>
          <p className="m-0">
            <strong>Estudantes com deficiência visual</strong> fazem o {W} com a{" "}
            <strong>leitura em voz alta</strong> do programa (<Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) - como na prática, sem uma opção separada para você. O
            tempo que cada pessoa passa esperando a voz é descontado pelo próprio
            relógio do {W}; de quem enxerga e também ouve a leitura em voz alta,
            é descontado do mesmo jeito. Assim, o tempo da leitura em voz alta já
            está compensado; outras adaptações razoáveis que valham na sua
            escola são decididas por você.
          </p>
          <p className="m-0">
            <strong>Os resultados</strong> ficam no painel aberto em {WM}{" "}
            anteriores - o botão {W} no começo da linha o abre: para cada pessoa,
            a posição, a <strong>pontuação</strong>, se a leitura em voz alta
            estava ligada, a velocidade, a precisão e as teclas inseguras. Como a
            pontuação é calculada está explicado no item 8a. Assim que o {W}{" "}
            termina para <strong>a turma inteira</strong>, chega também um{" "}
            <strong>e-mail com o resumo</strong> e os mesmos números.
          </p>
          <p className="m-0">
            Cada pessoa pode escolher{" "}
            <strong>Desta vez não vou participar</strong>. Ela continua
            praticando normalmente e aparece nos resultados como{" "}
            <strong>sem participação</strong>. Depois, cada pessoa vê os seus
            próprios {WM} em <strong>Meu progresso</strong> - os mesmos números
            que você.
          </p>
        </Section>

        <Section title="9 · Trabalho autônomo e verificação por IA (só para você)">
          <p className="m-0">
            A coluna <strong>Trabalho autônomo</strong> mostra um valor de{" "}
            <strong>1 a 10</strong>. Ele sobe com indícios de que algo não foi
            digitado pela própria pessoa: <em>colar texto</em>, trocas frequentes
            de janela ou de foco, uma velocidade pouco plausível ou uma precisão
            perfeita sem histórico de aprendizagem. Só <strong>você</strong> vê
            esse valor, não as pessoas da turma.
          </p>
        </Section>

        <Section title="10 · Acessibilidade">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Contraste e tamanho do texto:</strong> na barra do alto
              (claro, escuro, alto contraste); <Kbd>Alt</Kbd> + <Kbd>+</Kbd> /{" "}
              <Kbd>-</Kbd> aumenta ou diminui o campo de digitação.
            </li>
            <li>
              <strong>Leitura em voz alta</strong> com <Kbd>Alt</Kbd> +{" "}
              <Kbd>V</Kbd> - para estudantes sem leitor de tela configurado (com
              NVDA, JAWS ou VoiceOver, é melhor deixar desligada). Você pode
              escolher se são lidas <em>letras / palavras / frases</em>, a
              velocidade e <strong>qual voz</strong>. O{" "}
              <strong>tempo da leitura é descontado do cálculo da
              velocidade</strong> - assim quem precisa da leitura em voz alta não
              sai perdendo nas estatísticas.
            </li>
            <BrailleTabellenPunkte weg="br" />
            <li>
              <strong>Aviso do dedo:</strong> pressionar duas vezes rápido a
              tecla <Kbd>Shift</Kbd> anuncia o dedo certo.
            </li>
            <li>
              <strong>Gestão do foco:</strong> cada botão tem um destino definido
              - quem o pressiona sabe depois onde está o cursor. Para estudantes
              que trabalham com linha braille, essa é a diferença entre continuar
              e procurar. Três regras que vale conhecer na aula: <Kbd>Esc</Kbd>{" "}
              fecha qualquer janela e leva sempre{" "}
              <strong>ao campo de digitação</strong>; uma troca de visão
              (estatísticas, biblioteca, login) chega ao{" "}
              <strong>título da nova visão</strong> e o anuncia; e{" "}
              <strong>nada desaparece por conta própria</strong> - até a
              comemoração de um desbloqueio espera a pessoa pressionar
              Continuar.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> vai para o campo de digitação,{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> abre a ajuda.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> muda para a prática,{" "}
              <Kbd>Alt</Kbd> + <Kbd>S</Kbd> para <strong>Minhas turmas</strong>;{" "}
              <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> anuncia a linha em que você está.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> diz o tempo de prática - na linha
              braille e (com a leitura em voz alta) como aviso falado.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> abre ou fecha a{" "}
              <strong>lista de atalhos de teclado</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Excluir">
          <p className="m-0">
            Uma pessoa ou uma turma inteira podem ser excluídas definitivamente
            (com a conta, o progresso e os resultados). Isso não pode ser
            desfeito - antes, o programa pede confirmação.
          </p>
        </Section>

        <Section title="12 · Downloads: o manual e o cartaz (PDF)">
          <p className="m-0">
            Tudo o que esta ajuda diz, e muito mais, está no{" "}
            <strong>manual para docentes</strong>: a trilha com todas as etapas,
            o painel da turma, o {W} passo a passo, a pontuação e os valores
            para uma avaliação.
          </p>
          <HandbuchLaden />
          <p className="m-0">
            Para a parede de uma sala de aula ou da sala dos docentes, existe
            também o <strong>cartaz do Tastenflow</strong> em A3, com um código
            QR para tastenflow.org/pt-br. Diferente do manual, ele é livre
            para todo mundo, sem login (tastenflow.org/tastenflow-plakat-br.pdf).
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Os dois também estão em Minhas turmas, em Downloads.
          </p>
        </Section>
      </div>
    </div>
  );
}
