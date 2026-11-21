/**
 * ★★★ O-PT (25.10.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE, PORTUGIESISCH (PORTUGAL).
 * ===========================================================================
 * In derselben Reihenfolge wie die deutsche und die tschechische Fassung (1 bis
 * 12, samt 4a, 4b, 8a, 8b) - wer eine Stelle prüft, findet sie in allen. Sichtbar
 * nur mit `spracheGewaehlt === "pt"` (`LehrerHilfe.tsx`). Titel nach Glossar
 * §2.5/§2.6: „Ajuda para docentes" (Lehrkraft = docente, Mehrzahl docentes).
 *
 * ── ANREDE (Glossar `recherche-portugiesisch-2026-10-25/GLOSSAR-pt.md`, Regel 1/2) ──
 * Höflichkeitsform OHNE Pronomen: Imperativ der 3. Person („Selecione",
 * „Prima", „Abra"), nie „você" (Microsoft pt-PT §4.1.12). Knöpfe im Infinitiv
 * oder als Hauptwort („Criar turma", „Começar agora"), in geraden
 * Anführungszeichen nur um Bereichs- und Optionsnamen. Kinder heissen
 * „estudantes" (Mehrzahl) oder „a pessoa" (Einzahl) - nie „o aluno". Kein
 * Adjektiv an der Lehrkraft. Keine Ausrufezeichen.
 *
 * ── WAS PORTUGIESISCH ANDERS IST ─────────────────────────────────────────────
 *  · Zahlen mit Nomen über `mehrzahl(n, "pt", formen)` (one/many/other, Glossar
 *    §2.11; 0 ist Mehrzahl). Prozent ohne Leerzeichen („96%", gemessen).
 *  · Abschnitt 4: die Reihenfolge des Weges „pt" (F4) entsteht parallel - hier
 *    steht nur die Vorgabe des Bauplans I1 (Grundreihe f j d k s l a ç, dann
 *    nach Häufigkeit, Akzente nach Shift und Satzzeichen), ohne volle Liste.
 *  · Abschnitt 4: Vorlagen (Lektionen, Programmcode) gibt es heute nur für die
 *    Übungssprachen de/en (`SPRACHEN_MIT_LEKTIONSVORLAGEN`), Wurzel-Vorlagen
 *    für „pt" noch keine (`GERUEST_WURZELN` leer) - der Text sagt das.
 *  · Abschnitt 8b: die Tippchallenge-Bank „pt" ist noch leer (`bankPt.ts`) -
 *    die Texte sind vorerst englisch, und der Text sagt das.
 *  · Tastatur: Portuguesa (Portugal) (`layouts.ts`, `pt`, nur gelesen): ç
 *    eigene Taste, Akut/Gravis und Tilde/Zirkumflex als Totasten, « » eigene
 *    Taste; kein Ersatzbuchstabe. Mac ungemessen - kein Mac-Name.
 *  · Schuljahr: im Programm ab 1. August, in Portugal beginnt es im September.
 *  · Abschnitt 12: eigenes Handbuch; das Plakat hat eine eigene Fassung in der Sprache (`tastenflowPlakat`).
 *
 * Fliesstext mit geraden Anführungszeichen, nur Bindestrich, keine Maus-Wörter,
 * Person zuerst („estudantes com deficiência visual", „estudantes com cegueira").
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, MIND_ZEICHEN, PROBEN_JE_NIVEAU } from "@/lib/typing/schreibprobe";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { mehrzahl } from "@/lib/bedienSprache";
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

/** ★ O-PT (25.10.2026): Prozent ohne Leerzeichen (Glossar Regel 5, gemessen `Intl` „pt-PT"). */
const prozent = (p: number) => `${p}%`;

export function LehrerHilfePortugiesisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  // Mehrzahl nach `Intl` „pt-PT" (Glossar §2.11): 1 = one, sonst other; many mit „de".
  const einstieg = mehrzahl(EINSTIEGSFENSTER_MIN, "pt", {
    one: (z) => `${z} minuto`,
    many: (z) => `${z} de minutos`,
    other: (z) => `${z} minutos`,
  });
  const zeichen = (n: number) =>
    mehrzahl(n, "pt", {
      one: (z) => `${z} caráter`,
      many: (z) => `${z} de carateres`,
      other: (z) => `${z} carateres`,
    });
  const probenSatz = mehrzahl(PROBEN_JE_NIVEAU, "pt", {
    one: (z) => `há ${z} texto de Desafio`,
    many: (z) => `há ${z} de textos de Desafio`,
    other: (z) => `há ${z} textos de Desafio`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ajuda do Tastenflow para docentes"
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
          O Tastenflow tem um <strong>sistema de contas próprio</strong>, totalmente
          separado do início de sessão na plataforma de aprendizagem. Iniciar sessão
          aqui não altera a sessão na plataforma - e vice-versa.
        </p>

        <Section title="1 · Criar turmas e contas">
          <p className="m-0">
            Ao abrir o Tastenflow com uma conta docente, entra sempre em{" "}
            <strong>As minhas turmas</strong>; para praticar, use o botão Praticar
            (<Kbd>Alt</Kbd> + <Kbd>U</Kbd>). Para criar uma turma, abra{" "}
            <strong>Estudantes e acessos</strong>, em cima à direita - na secção que
            se abre, <strong>Criar uma turma nova</strong>. O{" "}
            <strong>código da turma</strong> é obrigatório: enquanto escreve o nome,
            o programa propõe um código adequado (de "4B Sintra" resulta
            "4BSINTRA"); pode alterá-lo, por exemplo para <code>4B-EB1</code>. O
            código vale para a turma toda. Na mesma secção, escolha o{" "}
            <strong>ano de escolaridade</strong> e o{" "}
            <strong>ponto de partida</strong> e verifique a língua (com cadeado) e a
            Corrida da turma - são os mesmos campos que em "Definições da turma". O
            botão <strong>Criar turma</strong> só funciona quando está tudo
            preenchido; caso contrário, uma frase diz o que falta, e o foco fica no
            primeiro campo em falta.
          </p>
          <p className="m-0">
            Depois, com o botão <strong>Adicionar pessoa</strong>, adicione as e os
            estudantes com <strong>nome e palavra-passe</strong>. A partir daí podem
            iniciar sessão em <strong>qualquer dispositivo</strong> com{" "}
            <em>código da turma, nome e palavra-passe</em>. O dispositivo memoriza o
            código da turma, por isso depois basta introduzir o nome e a
            palavra-passe.
          </p>
          <p className="m-0">
            O nome e o código da turma podem ser alterados mais tarde com o botão{" "}
            <strong>✏️ Editar</strong> - o novo código passa então a valer para
            todas as pessoas da turma (a partir desse momento, iniciam sessão com o
            novo código).
          </p>
          <p className="m-0">
            <strong>Outra possibilidade:</strong> quem não pertence a nenhuma turma
            também pode criar uma <strong>conta pessoal</strong> - na janela de início
            de sessão, marcando "Pratico por conta própria, sem turma" e indicando
            um endereço de e-mail. Para si, nada muda: estas contas não pertencem a
            nenhuma turma, não aparecem em nenhuma das suas listas, e o resumo
            semanal é enviado diretamente para o endereço de e-mail delas. Na sua
            turma fica tudo como estava - as contas das e dos estudantes são criadas
            por si.
          </p>
        </Section>

        <Section title="2 · Definições da turma e de cada pessoa">
          <p className="m-0">
            <strong>Para a turma toda</strong> (botão "Definições da turma" na linha
            de tarefas por cima da tabela, ao lado dos botões Desafio, Exercício
            personalizado, Objetivo semanal e Suspender 1 hora - mesmo fechada, a
            linha mostra o ano de escolaridade, a língua e a Corrida da turma):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Ano de escolaridade:</strong> a partir dele, o programa define
              o nível dos textos - vocabulário, tipo de piadas e tom dos textos de
              prática. O 7.º ano corresponde a cerca de 12 anos de idade, ou seja,
              textos para 11-15 anos.{" "}
              <strong>Acompanha a turma:</strong> o programa memoriza o ano letivo da
              inscrição e, a cada ano, conta automaticamente um ano de escolaridade a mais,
              sem nada para definir. No programa,{" "}
              <strong>o ano letivo começa a 1 de agosto</strong> e acaba a 31 de
              julho, a não ser que esteja escolhido outro mês de início em
              "Definições da turma" (em Portugal, o ano letivo começa em setembro):
              com o início do ano, a turma passa para o ano de escolaridade seguinte,
              e as estatísticas do ano letivo seguem o mesmo calendário. Para grupos
              de pessoas adultas existe o nível <strong>Pessoas adultas</strong> -
              esse não muda. O ano de nascimento das e dos estudantes de uma turma não
              é pedido.
            </li>
            <li>
              <strong>Língua e cadeado:</strong> a língua das palavras e dos textos de
              prática da turma toda; com o cadeado ao lado, garante que as e os
              estudantes já não a mudam. O botão redondo da língua (com o globo), em
              cima, existe para cada pessoa: muda os botões e os menus e, ao mesmo
              tempo, os textos de prática - com o cadeado, só os botões e os menus.
            </li>
            <li>
              <strong>Ponto de partida da turma:</strong> a resposta a "Por onde
              começar?" para a turma toda - vale também para cada pessoa que entre
              mais tarde, e só acrescenta teclas: quem já está mais adiante não perde
              nada. Ao escolher, o programa regista este ponto também nas pessoas que
              já estão na turma; se alguém já estiver mais adiante, pergunta primeiro
              e oferece três caminhos: colocar todas as pessoas nesse ponto, só quem
              ainda não chegou lá, ou cancelar. A alteração vale assim que a pessoa
              voltar a abrir o Tastenflow; as estatísticas e as medalhas ficam
              sempre.
            </li>
            <li>
              <strong>Permitir a Corrida da turma:</strong> as e os estudantes podem
              convidar-se uns aos outros para uma corrida de cinco minutos. Em
              "Tempos de prática", na linha aberta, vê quantas vezes a pessoa
              participou em cada semana - sem classificação e sem tempos.
            </li>
            <li>
              <strong>Fim de linha com Enter:</strong> se estiver marcado, cada
              pessoa da turma acaba cada linha de prática com a tecla Enter - como ao
              escrever num escritório. Vale para O meu treino, Histórias, Exercício
              personalizado, jogos de palavras com linhas, o Desafio e a Corrida da
              turma; não vale para as adivinhas, Letras baralhadas, Ditado dos
              dedos, a Expedição polar e Explorar as teclas. Predefinição:
              desligado.
            </li>
          </ul>
          <p className="m-0">
            <strong>Para cada pessoa</strong> (atrás da seta na sua linha):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Teclado:</strong> escolhe-se nas Definições (a roda dentada),
              em "Teclado" - em Portugal, normalmente Portuguesa (Portugal),
              conforme o esquema do teclado definido no computador. A definição vale
              para este dispositivo (não para a conta) e comanda o teclado no ecrã,
              o anúncio dos dedos e os carateres que se praticam. No teclado
              português: (1) o <strong>ç tem uma tecla própria</strong>, à direita do
              L, e é a oitava tecla da posição inicial (mindinho direito); (2) o{" "}
              <strong>acento agudo</strong> é uma tecla de acento à direita da tecla
              +, com a tecla Shift dá o acento grave; o <strong>til</strong> é uma
              tecla de acento à direita da tecla º, com a tecla Shift dá o acento
              circunflexo - primeiro a tecla de acento, depois a vogal (á, ã, ê, à);
              (3) as maiúsculas com acento escrevem-se com a tecla de acento e depois
              a tecla Shift com a vogal; (4) as aspas « » têm uma tecla própria, à
              direita do apóstrofo; (5) uma letra sem acento não substitui a letra
              com acento - "esta" e "está" são palavras diferentes, por isso o
              programa espera sempre a letra que está no texto.
            </li>
            <li>
              <strong>Por onde começar?</strong> a mesma lista de níveis que o ponto
              de partida da turma (ver acima) - aqui para uma pessoa que precisa de
              uma exceção. Quem tem mais experiência salta assim o início e começa
              mais adiante (por exemplo, só a partir dos algarismos); antes de
              recuar uma pessoa, o programa pergunta.
            </li>
            <li>
              <strong>Escrever com uma mão:</strong> desliga para esta pessoa a regra
              da tecla Shift com a outra mão - as maiúsculas e os símbolos valem
              então com qualquer uma das teclas Shift.
            </li>
            <li>
              <strong>Com calma:</strong> a velocidade desta pessoa não é avaliada em
              lado nenhum - sem limite de tempo no jogo, sem meta de velocidade nas
              estrelas, sem subida nem descida do nível de dificuldade pela
              velocidade. Para quem escreve com cuidado, mas muito devagar.
            </li>
            <li>
              <strong>Espaçamento largo (CVI):</strong> mais espaço entre os
              carateres ao copiar, em três graus (duplo, triplo, quádruplo) - para
              pessoas com deficiência visual cerebral (CVI), para quem os carateres
              muito juntos se confundem. A própria pessoa também pode mudar o
              espaçamento nas suas Definições (a roda dentada, <AltText>Alt + O</AltText>) - e, aqui, pode voltar a mudá-lo a qualquer momento. Vale o que foi escolhido por último.
            </li>
          </ul>
          <p className="m-0">
            Tudo pode ser alterado a qualquer momento - os valores da turma em
            "Definições da turma", por cima da tabela, e os valores de cada pessoa
            na sua linha aberta.
          </p>
        </Section>

        <Section title="3 · O nível de dificuldade (1-50): o coração do programa">
          <LeistungsstufeHilfe />
          <p className="m-0">
            O <strong>nível atual</strong> está na tabela (coluna{" "}
            <strong>Nível de dificuldade</strong>) e em cima, no ecrã de prática.
            Não precisa de definir nada - só, se for necessário, ligar "Com calma".
          </p>
        </Section>

        <Section title={'4 · "O meu treino": adaptativo, pela frequência das letras'}>
          <p className="m-0">
            O Tastenflow tem <strong>um</strong> percurso de prática, que cada pessoa
            faz ao seu ritmo - e que se <strong>adapta</strong>: o programa mede cada
            tecla à parte, pratica automaticamente as mais fracas e só desbloqueia
            uma tecla nova quando as anteriores estão dominadas.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">A ordem pela frequência das letras</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Depois da posição inicial chegam primeiro as letras{" "}
                <strong>mais frequentes</strong> - assim, ao fim de poucas teclas já
                se formam <strong>palavras a sério</strong>.
              </li>
              <li>
                <strong>Cada percurso é diferente</strong> - a tecla que vem a seguir
                depende da pessoa, não de uma lista fixa.
              </li>
              <li>
                <strong>Sem fim fixo</strong> - ideal para a prática autónoma de
                todos os dias.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>Para o seu planeamento:</strong> o percurso português tem uma{" "}
            <strong>ordem das teclas própria</strong>, segundo a frequência das
            letras em português, para o teclado Portuguesa (Portugal). Começa pela
            fila de base f j d k s l a ç - o ç é a oitava tecla da posição inicial.
            Seguem-se as letras mais frequentes em português; g e h, embora estejam
            na fila de base, só chegam mais tarde, por serem menos frequentes. A
            tecla Shift, o ponto, a vírgula e o ponto de interrogação vêm cedo -
            assim escrevem-se depressa palavras e frases a sério. As{" "}
            <strong>teclas de acento</strong> chegam a seguir, uma de cada vez
            (primeiro o til, depois o acento agudo, mais tarde o acento circunflexo
            e o acento grave); as maiúsculas com acento só depois das minúsculas. A
            restante pontuação, os algarismos e os símbolos chegam no fim.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>A ordem depende da língua da primeira prática:</strong> o
            percurso que a turma faz é definido pela língua dos botões e menus na
            primeira prática. Uma turma que começou, por exemplo, em alemão ou em
            inglês mantém essa ordem, mesmo que a língua dos botões e menus mude: a
            ordem é definida uma vez e depois já não muda.
          </p>
          <p className="m-0">
            <strong>O mesmo texto para a turma toda:</strong> os textos do curso
            (fila de base, filas de letras, pontuação, algarismos, símbolos, textos
            inteiros) estão disponíveis como <strong>modelos</strong> em{" "}
            <strong>Exercício personalizado</strong> (As minhas turmas) - escolha
            um, e a turma toda pratica o mesmo texto, seja qual for o ponto em que
            cada pessoa está (tal como num ficheiro carregado, conta para o tempo de
            prática, e as teclas novas não são desbloqueadas por isso).
          </p>
          <p className="m-0">
            <strong>Código de programação:</strong> há também{" "}
            <strong>código de programação</strong> para copiar (dez linguagens de
            programação, código-fonte real de projetos abertos, excertos diferentes
            dos do Desafio) - só em Exercício personalizado. Por enquanto, estes
            modelos só existem para turmas que praticam em alemão ou em inglês;
            para o percurso português ainda não há modelos próprios.
          </p>
        </Section>

        <Section title={'4a · "Exercício personalizado": um texto para a turma toda'}>
          <p className="m-0">
            Com o botão <strong>Exercício personalizado</strong>, na linha de tarefas
            das estatísticas da turma, define o texto que a turma toda pratica -
            seja qual for o ponto em que cada pessoa está. Há três caminhos para o
            texto: <strong>carregar um ficheiro</strong> (.txt ou .docx), escolher um
            texto guardado antes na pasta <strong>Os meus textos</strong>, ou usar um
            dos <strong>modelos</strong> do curso (ver ponto 4).
          </p>
          <p className="m-0">
            A pasta <strong>Os meus textos</strong> é a sua coleção pessoal e
            permanente - pertence à sua conta, não à turma, e só a vê quem a criou.
            Ao carregar, a caixa de verificação{" "}
            <strong>Guardar em Os meus textos</strong> (marcada por predefinição)
            guarda automaticamente uma cópia lá, para que o mesmo texto possa ser
            usado mais tarde sem voltar a carregar o ficheiro.
          </p>
          <p className="m-0">
            Se o ficheiro tiver carateres que não se conseguem escrever, a secção
            mostra-os numa lista antes de começar - decida se corrige o ficheiro ou
            se começa mesmo assim (os carateres restantes saem então das linhas,
            nunca são um toque obrigatório).
          </p>
          <p className="m-0">
            <strong>Começar o exercício:</strong> cada pessoa recebe logo uma janela
            que anuncia o exercício da escola - só pode premir{" "}
            <strong>Seguinte</strong>, não pode recusar. Para cada pessoa, o
            exercício acaba automaticamente assim que tiver escrito o texto uma vez;
            depois continua a praticar normalmente. O botão{" "}
            <strong>Terminar o exercício</strong> acaba-o mais cedo para a turma
            toda.
          </p>
          <p className="m-0">
            O exercício conta para o tempo de prática e é medido como qualquer outra
            ronda, incluindo as teclas em consolidação -{" "}
            <strong>mas não desbloqueia nenhuma tecla nova</strong>: as teclas que
            aparecem são definidas apenas pelo ficheiro.
          </p>
        </Section>

        <Section title={didaktikAbschnittTitel("pt")}>
          <DidaktikInhalt lang="pt" />
        </Section>

        <Section title="5 · Textos com sentido desde o início">
          <p className="m-0">
            O programa mostra <strong>o mais cedo possível</strong> textos a sério,
            adequados à idade - piadas, provérbios, expressões, textos informativos e
            curiosidades, trava-línguas, jogos de palavras e frases inteiras. Um
            texto aparece assim que as suas <strong>letras</strong> estão aprendidas;
            uma simples "salada de palavras" é a exceção (só para praticar de forma
            dirigida uma tecla completamente nova).
          </p>
          <p className="m-0">
            <strong>Maiúsculas:</strong>{" "}
            <strong>a ortografia está sempre certa</strong> (maiúscula no início da
            frase e nos nomes próprios) - as e os estudantes nunca veem uma palavra
            mal escrita. No início, basta escrever a letra{" "}
            <strong>minúscula</strong>; a maiúscula aparece automaticamente
            (maiúsculas automáticas, para <strong>todas as idades</strong>, porque a
            ortografia certa conta em qualquer idade).
          </p>
          <p className="m-0">
            Em "O meu treino", porém,{" "}
            <strong>a verdadeira tecla Shift chega cedo</strong> - logo depois das
            primeiras letras frequentes, assim que há palavras a sério suficientes
            para praticar (e não só depois do alfabeto inteiro). A partir daí, as
            maiúsculas escrevem-se "a sério", com a tecla Shift. No teclado
            português isto vale primeiro para as letras sem acento; as maiúsculas
            com acento (Á, Ã, Ê ...) só chegam depois das teclas de acento. Assim, as
            e os estudantes aprendem cedo a escrever as maiúsculas{" "}
            <strong>por conta própria</strong>, em vez de dependerem muito tempo da
            ajuda automática.
          </p>
          <p className="m-0">
            A <strong>pontuação</strong> (ponto, vírgula, ponto de interrogação ...)
            só aparece quando está aprendida - antes disso, a frase fica "sem ponto
            nem vírgula". Uma tecla ainda não aprendida com uma <em>letra</em> ou um{" "}
            <em>algarismo</em>, pelo contrário, <strong>nunca</strong> é pedida.
          </p>
        </Section>

        <Section title="6 · Estrelas, medalhas e sons (importante para estudantes com deficiência visual)">
          <p className="m-0">
            Cada ronda dá <strong>1-3 estrelas</strong> pela precisão e pela
            velocidade - <strong>a precisão conta a triplicar</strong>: 3 estrelas
            pressupõem sempre cerca de {prozent(96)} de toques certos (escrever
            depressa e sem cuidado não é premiado); uma ronda sem erros, pelo
            contrário, tem 2 estrelas garantidas mesmo ao ritmo mais lento. Cada
            número de estrelas tem o seu <strong>próprio som</strong>; ao{" "}
            <strong>subir de nível</strong> ouve-se um som especial de alegria. Estes
            sons são o principal retorno para estudantes com deficiência visual.
            Com o botão <strong>🔇</strong>, o som pode ser desligado numa sala
            silenciosa.
          </p>
          <p className="m-0">
            A isto juntam-se as <strong>medalhas</strong>, com nomes para crianças -
            em famílias com graus e com uma "próxima meta", que pode ser lida em voz
            alta a qualquer momento. Os nomes com animais só aparecem a crianças de
            7-10 anos; a partir dos textos para 11-15 anos, o nome é neutro em todo
            o lado. As medalhas são as mesmas - uma medalha conquistada fica, mesmo
            que o nível dos textos mude. Quase todas premeiam a{" "}
            <strong>precisão e a persistência</strong>; a única medalha de
            velocidade exige {prozent(95)} de precisão. Uma medalha nova traz o seu
            próprio som "ta-dã" com anúncio e fica depois no topo das estatísticas
            (na vista da própria pessoa e na sua - é a mesma vista). Cada medalha
            pode ser <strong>selecionada</strong> - aparece então em grande e com um
            efeito.
          </p>
          <p className="m-0">
            O jogo <strong>Blocos de gelo 🐧</strong> é o prémio depois de uma tecla
            nova em "O meu treino": o pinguim percorre um caminho feito com os{" "}
            <strong>carateres menos dominados</strong> da pessoa (umas vezes pelos
            blocos de gelo sobre a água, outras vezes também por uma montanha de
            letras com escorrega de barriga).{" "}
            <strong>A tecla já está desbloqueada antes</strong> - o progresso na
            aprendizagem não depende de nenhum jogo. Tentativas sem limite, sem fim
            de jogo; com a exigência "só precisão" (e no nível de dificuldade 1) não
            há <strong>nenhuma pressão de tempo</strong> (um limite de tempo que se
            pode desligar, conforme as WCAG). Além disso, as pessoas dos grupos de
            textos <strong>7-10 e 11-15 anos</strong> podem começar o jogo quando
            quiserem, com o botão <strong>Jogar</strong> - como "aventura do dia",
            com <strong>peixes bónus</strong> (som de peixe e anúncio do caráter; um
            peixe perdido não é um erro) e com a <strong>Gruta do Eco</strong>, onde
            cada tecla é apenas anunciada (aí o programa fala mesmo com a leitura em
            voz alta desligada - estudantes com cegueira jogam exatamente da mesma
            forma, com ou sem ela; a gruta, de propósito, NUNCA aparece na ronda de
            prémio). Um percurso sem erros acaba com uma aurora polar; as aventuras
            completas, os peixes e os percursos sem erros dão a família de medalhas{" "}
            <strong>Aventuras</strong>. Importante para a sua avaliação: o jogo{" "}
            <strong>não conta para o tempo de prática</strong> nem para o objetivo
            semanal - é pura motivação.
          </p>
          <p className="m-0">
            <strong>Dois caminhos diferentes para o jogo - por favor, não os
            confunda:</strong> o botão <strong>Jogar</strong> é a entrada livre, que
            as e os estudantes premem por iniciativa própria; existe nos grupos{" "}
            <strong>7-10 e 11-15 anos</strong>, a partir dos 16 anos não. A ronda{" "}
            <strong>depois de uma tecla nova</strong>, pelo contrário, chega
            automaticamente: nos 7-10 anos sempre, a partir dos 16 anos nunca, e nos
            11-15 anos só quando, nas Definições, em <strong>Jogo-prémio</strong>,
            estiver escolhido o jogo Blocos de gelo em vez de{" "}
            <strong>Nenhum</strong> (predefinição). Esta definição pertence ao{" "}
            <strong>dispositivo</strong>, não à conta - tal como o esquema do
            teclado. Num computador da escola, vale portanto para todas as pessoas
            que lá praticam.
          </p>
        </Section>

        <Section title="7 · O objetivo semanal">
          <p className="m-0">
            Para cada pessoa, define os <strong>minutos por semana</strong> - sem as
            aulas. O botão <strong>Aplicar à turma toda</strong> regista o mesmo
            valor em todas as pessoas da turma de uma só vez e vale também para quem
            entrar mais tarde.
          </p>
          <p className="m-0">
            A alteração vale sempre{" "}
            <strong>a partir da segunda-feira seguinte, às 08:00</strong> - a semana
            em curso mantém o objetivo anterior. Antes de guardar, uma janela indica
            a data exata.
          </p>
          <p className="m-0">
            <strong>Recuperar:</strong> se a caixa de verificação "Recuperar os
            minutos das semanas anteriores" estiver marcada, os minutos em falta de
            semanas anteriores podem ser recuperados todos de uma vez.
          </p>
          <p className="m-0">
            <strong>Dispensar a semana</strong> (por exemplo, em caso de doença) e{" "}
            <strong>Repor a zero os minutos em atraso</strong> funcionam como até
            agora - para cada pessoa à parte, sem alterar o tempo já praticado.
          </p>
          <p className="m-0">
            <strong>Suspender o objetivo durante 1 hora:</strong> um botão próprio
            para a turma toda, durante 60 minutos. A prática continua - o tempo de
            prática e as estatísticas continuam a contar, só o objetivo semanal
            não conta nessa hora. Premindo outra vez o mesmo botão (Retomar o
            objetivo), o objetivo volta a valer ainda antes do fim da hora.
          </p>
        </Section>

        <Section title="8 · Estatísticas e progressos (para abrir em cada pessoa)">
          <p className="m-0">
            Com o botão redondo da seta<span aria-hidden="true"> ▸</span> antes do
            nome, abre seis linhas, cada uma para fechar à parte, de cima para
            baixo: <strong>Definições</strong> (os valores do ponto 2 para esta
            pessoa), <strong>Desafios</strong> (só quando foi escrito pelo menos
            um), <strong>Tempos de prática</strong> (por semanas, com o estado do
            objetivo semanal e - se se jogou - com o número de Corridas da turma,
            além de um mapa do ano letivo inteiro),{" "}
            <strong>Teclas em consolidação</strong>, <strong>Medalhas</strong> e -
            só com um valor que chama a atenção - <strong>Trabalho autónomo</strong>{" "}
            (ver ponto 9).
          </p>
          <p className="m-0">
            Em "Tempos de prática" está, em cima, em quantas Corridas da turma a
            pessoa participou (contadas nesta turma; até onde vai a contagem, diz a
            dica ao lado do contador); a tecla Enter numa semana abre os tempos de
            prática um a um - dia, hora de início e de fim, tempo líquido de escrita
            e o que se praticou.
          </p>
          <p className="m-0">
            O que aqui já não aparece à parte - os valores em resumo, a evolução ao
            longo do tempo, o estado das teclas, Histórias e curiosidades - não se
            perde: está tudo completo em <strong>Os meus progressos</strong> da
            pessoa, e lá vê exatamente a mesma vista que a própria pessoa.
          </p>
          <p className="m-0">
            <strong>Pontuação:</strong> junta a precisão e a velocidade de escrita
            num só número de 0 a 100; um erro conta como 5 carateres, e o dobro da
            velocidade conta só 1,4 vezes mais - a precisão tem prioridade sobre a
            velocidade.
          </p>
          <p className="m-0">
            <strong>Na tabela da turma</strong>, três colunas estão juntas no título{" "}
            <strong>Prática</strong>: Precisão, Toques/min e Pontuação. As três vêm
            da prática no período escolhido, e a pontuação junta as outras duas. Por
            isso têm um fundo ligeiramente colorido e uma linha fina à volta; o
            leitor de ecrã anuncia "Prática" antes do título da coluna. A coluna{" "}
            <strong>Desafio</strong>, lá à direita, fica de propósito fora deste
            grupo, com um título próprio: é um Desafio num dia concreto, não a
            prática de todos os dias.
          </p>
          <p className="m-0">
            Na coluna <strong>Pontuação</strong> vale o seguinte: uma pessoa que, no
            período escolhido, escreveu menos de 200 carateres não recebe
            pontuação, mas um hífen - abaixo deste limite, um único erro decidiria
            vários pontos.
          </p>
          <p className="m-0">
            O botão <strong>Transferir em Excel</strong> está por cima da tabela, à
            direita, ao lado da opção "Desde o início". Transfere a tabela como
            ficheiro <strong>nomedaturma_data.xlsx</strong> (por exemplo,
            "4B_2026-09-14.xlsx") - seja qual for o período escolhido nesse
            momento. No início há um resumo com ligações para os quatro períodos e
            uma legenda que explica cada coluna e mostra como se calcula a
            pontuação. Seguem-se quatro folhas: o ano letivo em curso, Desde o
            início, o mês (as últimas 4 semanas) e esta semana. Os valores estão no
            ficheiro como números, para se poder continuar a calcular com eles no
            Excel; onde a tabela mostra um hífen, o ficheiro também tem um hífen.
          </p>
          <p className="m-0">
            A <strong>Visão geral da turma</strong>, por cima da tabela, mostra a
            turma como um todo. Vem escolhido o Mês (as últimas 4 semanas); ao lado
            está o Ano letivo. Uma linha indica os toques por minuto, a precisão e
            os objetivos semanais, cada valor com uma pequena tendência - no mês, em
            comparação com as 4 semanas anteriores; no ano letivo, as primeiras
            semanas de prática em comparação com as últimas. Uma dica mostra a frase
            completa; o leitor de ecrã lê-a junto ao número, incluindo as e os
            estudantes que não praticaram nesse período.
          </p>
          <p className="m-0">
            A <strong>barra de pontuação "Pontuação na turma"</strong> mostra um ponto
            por pessoa. Com a tecla de tabulação chega à barra, e com as teclas de
            seta passa de pessoa em pessoa - cada paragem é anunciada ("Ema, 78
            pontos"). Quantas pessoas têm menos de 50, entre 50 e 70, entre 70 e 85
            e mais de 85 pontos, e quem escreveu texto a menos, diz a dica junto ao
            título.
          </p>
          <p className="m-0">
            O <strong>gráfico de linhas "Pontuação da turma no ano letivo"</strong>{" "}
            mostra, para cada semana, a média das pessoas que escreveram pelo menos 5
            linhas; uma falha na linha quer dizer que nessa semana houve pouca
            prática. Com a tecla de tabulação chega ao gráfico, e com as teclas de
            seta passa de semana em semana; para o leitor de ecrã, todas as semanas
            estão também numa tabela. Quando chegam de novo a tecla Shift, os
            algarismos ou os símbolos, a linha desce durante pouco tempo - é de
            esperar e não é motivo de preocupação.
          </p>
          <p className="m-0">
            <strong>A curva:</strong> é normal que a curva não suba sempre. Quando
            chegam teclas novas, costuma descer primeiro - sobretudo com a tecla
            Shift e com os algarismos.
          </p>
          <p className="m-0">
            <strong>Transparência dos dados:</strong> cada pessoa vê, em "Os meus
            progressos", exatamente os mesmos valores sobre si - nunca vê mais do
            que a própria pessoa.
          </p>
        </Section>

        <Section title="8a · Os valores em que pode basear uma nota">
          <DreiWerteHilfe />
        </Section>

        <Section title="8b · O Desafio: uma tarefa para a turma toda">
          <p className="m-0">
            Na área para docentes <strong>As minhas turmas</strong>, lá em cima, nas{" "}
            <strong>estatísticas da turma</strong> do Tastenflow, na linha de
            tarefas, está o botão <strong>Desafio</strong>. Abre um formulário com o
            qual começa um Desafio para a turma toda -{" "}
            <strong>todas as pessoas recebem o mesmo texto</strong>, seja qual for o
            ponto do curso em que estão.
          </p>
          <p className="m-0">
            <strong>Definem-se três coisas:</strong> as{" "}
            <strong>teclas usadas</strong> (de Fila de base a Todas as teclas), logo
            ao lado o <strong>tipo</strong> e a <strong>duração do Desafio</strong>{" "}
            em minutos. O botão <strong>Começar agora</strong> inicia-o de imediato.
          </p>
          <p className="m-0">
            <strong>Rigoroso</strong> (predefinição) funciona como até agora: uma
            tecla errada não avança, e cada erro conta - mesmo que seja logo
            corrigido. <strong>Escrita livre</strong> é adequado para uma cópia como
            a que as pessoas jovens conhecem dos testes de escrita cronometrados: os
            erros ficam onde estão e não são marcados, e a tecla de retrocesso só
            corrige na linha atual. Só no fim é avaliado o que ainda está errado - no
            máximo um erro por palavra, a última palavra incompleta não conta e as
            partes corrigidas não contam de todo. Como um erro deixado ficar não
            custou tempo, pesa mais: {zeichen(FEHLER_GEWICHT_FREI)} em vez de{" "}
            {zeichen(FEHLER_GEWICHT)} (8a). Escolha Escrita livre quando a turma deve
            praticar a cópia e um erro não deve travar o resto da escrita; Rigoroso
            para verificar os próprios caminhos dos dedos.
          </p>
          <p className="m-0">
            <strong>Três indicações de tempo que convém distinguir:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>O momento de início</strong> - o instante em que prime
              "Começar agora". A partir dele, a turma pode começar.
            </li>
            <li>
              <strong>A janela de entrada</strong>: {einstieg} a partir do momento de
              início. Durante esse tempo, uma pessoa ainda pode entrar; mais tarde,
              já não.
            </li>
            <li>
              <strong>A duração do Desafio</strong> corre{" "}
              <strong>para cada pessoa à parte</strong>, e só a partir do seu{" "}
              <strong>primeiro toque</strong>. Por isso, duas pessoas da mesma turma
              acabam a horas diferentes - é de propósito: quem primeiro procura o
              seu lugar não perde tempo do Desafio.
            </li>
          </ul>
          <p className="m-0">
            <strong>Os textos:</strong> para cada nível <strong>{probenSatz}</strong>,
            cada um com pelo menos {zeichen(MIND_ZEICHEN)} - tão longo que o texto não
            acaba nem a grande velocidade. <strong>Não aparecem no curso</strong>,
            por isso não podem ser treinados antes. O Desafio seguinte do mesmo nível
            começa onde, no anterior, parou a pessoa que chegou mais longe: na linha
            seguinte e, nos textos com frases, no início da frase seguinte. Se um
            texto acabar durante o Desafio, as e os estudantes continuam a escrever
            no seguinte, sem pausa. No percurso português, os textos do Desafio
            estão, por enquanto, em inglês - ainda não há uma coleção portuguesa
            própria. Um texto próprio escolhe-se como "Ficheiro próprio" (a última
            opção na lista das teclas usadas).
          </p>
          <p className="m-0">
            <strong>Estudantes com cegueira</strong> fazem o Desafio com a{" "}
            <strong>leitura em voz alta do programa</strong> (<Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) - tal como na prática, sem nenhuma caixa de verificação
            especial para docentes. O tempo que a pessoa espera pela voz é
            descontado automaticamente da duração do Desafio; a uma pessoa que vê o
            texto e, mesmo assim, o manda ler em voz alta, é descontado o mesmo
            tempo. O tempo da leitura em voz alta fica assim compensado; sobre
            outras medidas de apoio decidem as e os docentes, segundo as regras da
            sua escola.
          </p>
          <p className="m-0">
            Os <strong>resultados</strong> estão na secção aberta em "Desafios
            anteriores" - abre-a o botão Desafio no início da linha: para cada pessoa,
            a classificação, a <strong>pontuação do Desafio</strong>, se a leitura
            em voz alta estava ligada, a velocidade, a precisão e as teclas em
            consolidação. Como se forma a pontuação do Desafio, descreve o ponto
            8a. Assim que o Desafio acaba para a <strong>turma toda</strong>, chega
            também um <strong>e-mail de resumo</strong> com os mesmos valores. Só
            nessa altura - um e-mail enquanto alguém ainda está a escrever estaria
            incompleto, e um segundo "agora sim, todas as pessoas" ninguém quer.
          </p>
          <p className="m-0">
            Uma pessoa pode escolher <strong>Desta vez não participo</strong>. Continua
            então a praticar normalmente e aparece na avaliação como{" "}
            <strong>sem participação</strong>. Mais tarde, cada pessoa vê os seus
            Desafios em <strong>Os meus progressos</strong> - os mesmos valores que
            vê na sua vista.
          </p>
        </Section>

        <Section title="9 · Trabalho autónomo e verificação de IA (só para docentes)">
          <p className="m-0">
            A coluna <strong>Trabalho autónomo</strong> mostra um indicador com um
            valor <strong>de 1 a 10</strong>: sobe quando há sinais de texto que a
            pessoa não escreveu por si: <em>colar</em> da área de transferência,
            mudanças frequentes de janela ou de foco, uma velocidade improvavelmente
            alta ou uma precisão sem erros sem evolução na aprendizagem. Este valor
            só é visto <strong>por docentes</strong>, não pelas e pelos estudantes. É
            um convite a olhar com calma - nunca uma avaliação da pessoa.
          </p>
        </Section>

        <Section title="10 · Acessibilidade">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Contraste e tamanho da letra:</strong> na barra de cima (claro,
              escuro, contraste elevado); <Kbd>Alt</Kbd> + <Kbd>+</Kbd> /{" "}
              <Kbd>-</Kbd> aumenta ou diminui o campo de escrita.
            </li>
            <li>
              <strong>Leitura em voz alta</strong> (a voz própria do programa) com{" "}
              <Kbd>Alt</Kbd> + <Kbd>V</Kbd> - para estudantes sem leitor de ecrã
              configurado (com NVDA, JAWS ou VoiceOver, é melhor deixá-la
              desligada). Pode escolher se são lidas <em>letras, palavras ou frases</em>,
              a velocidade da voz e a <strong>voz</strong>. Com o português, o
              programa procura automaticamente uma voz portuguesa; se faltar, aparece
              uma explicação de como a instalar.{" "}
              <strong>O tempo da leitura em voz alta é descontado na velocidade</strong>{" "}
              - estudantes que estão a aprender braille e precisam da leitura em voz
              alta não ficam assim prejudicados nos toques nem nas estatísticas.
            </li>
            <BrailleTabellenPunkte weg="pt" />
            <li>
              <strong>Anúncio do dedo:</strong> premir duas vezes rapidamente a tecla{" "}
              <Kbd>Shift</Kbd> anuncia o dedo certo.
            </li>
            <li>
              <strong>Condução do foco:</strong> cada botão tem um destino fixo -
              quem o prime sabe depois onde está o cursor. Para estudantes que
              trabalham com linha braille, é a diferença entre continuar a trabalhar
              e andar à procura. Três regras que vai notar nas aulas:{" "}
              <Kbd>Esc</Kbd> fecha qualquer janela e leva{" "}
              <strong>sempre de volta ao campo de escrita</strong>; uma mudança de
              vista (estatísticas, biblioteca, início de sessão) acaba no{" "}
              <strong>título da nova vista</strong> e anuncia-o; e{" "}
              <strong>nada desaparece por si</strong> - até a festa de uma tecla
              desbloqueada espera que a pessoa prima "Seguinte".
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> salta para o campo de escrita,{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> abre a ajuda.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> muda para a prática, <Kbd>Alt</Kbd> +{" "}
              <Kbd>S</Kbd> para <strong>As minhas turmas</strong> (durante a prática:
              para as estatísticas próprias); <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> anuncia
              em que linha se está.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> diz o tempo de prática - na linha braille
              e (com a leitura em voz alta) como anúncio.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> abre ou fecha a{" "}
              <strong>lista dos atalhos de teclado</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Eliminar">
          <p className="m-0">
            Pessoas individuais ou a turma toda podem ser eliminadas de forma
            definitiva (com a conta, o estado do jogo e a avaliação). Não é possível
            desfazer - o programa pergunta antes.
          </p>
        </Section>

        <Section title="12 · Transferências: guia e cartaz (PDF)">
          <p className="m-0">
            Tudo o que está nesta ajuda, e muito mais, encontra no{" "}
            <strong>guia para docentes</strong>: o percurso de aprendizagem com todos
            os passos, os teclados, a área da turma, o Desafio passo a passo, a
            pontuação e os valores em que se pode basear uma nota.
          </p>
          <HandbuchLaden />
          <p className="m-0">
            Para a parede da sala de aula ou da sala de docentes há também o{" "}
            <strong>cartaz do Tastenflow para afixar na escola</strong>: A3 ao alto,
            para imprimir - mostra de relance o que o Tastenflow consegue fazer, com
            um código QR para tastenflow.org. O cartaz está em português
            (tastenflow.org/tastenflow-plakat-pt.pdf). Ao contrário do guia, está livre para todas as pessoas, mesmo sem início
            de sessão.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Os dois estão também em As minhas turmas, no botão Transferências.
          </p>
        </Section>
      </div>
    </div>
  );
}
