/**
 * ★★★ O-PT (25.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, PORTUGIESISCH
 * (PORTUGAL, europäisches Portugiesisch - nie Brasilien, dafür gibt es `.br.tsx`).
 * ===========================================================================
 * Nach dem Aufbau von `TippenHilfe.cs.tsx` (dieselben Abschnitte, `detail`-
 * Stufen, `isAdult`/`jugend`-Fälle), den Inhalt nach der deutschen
 * `TippenHilfeDeutsch` - nicht Satz für Satz übertragen. Wie die anderen
 * Übersetzungen ohne den Einführungs-Podcast (die portugiesische Bedienung hat
 * keinen).
 *
 * ── ANREDE UND GESCHLECHT (Glossar `recherche-portugiesisch-2026-10-25/GLOSSAR-pt.md`) ──
 * Immer **tu** - Kinder, Jugendliche UND Selbstlernende (Regel 1), verneint mit
 * Konjunktiv („Não te preocupes"). Nie das Geschlecht verraten (Regel 2): kein
 * Adjektiv und kein Partizip an „tu" („pronto", „bem-vindo", „sozinho"), kein
 * Personenwort für das Kind („o aluno", „o vencedor"). Die Lehrkraft heisst im
 * Kindertext „quem ensina" oder „a escola" (Regel 2, §2.5) - nie „o professor".
 * Tasten mit „prime" (Regel 8), Tastennamen wie auf der Kappe, im Satz mit
 * Kopfwort „a tecla …" (Regel 11), die Leertaste ist „a barra de espaço".
 * Knopfnamen in geraden Anführungszeichen (Regel 7). Ausrufezeichen nur in
 * Sätzen, die allein Kinder sehen (`kind`), höchstens eines je Absatz.
 *
 * ── WAS PORTUGIESISCH ANDERS IST ───────────────────────────────────────────
 *  · Die Tastatur: Portuguesa (Portugal) (`layouts.ts`, `pt`, nur gelesen;
 *    Windows „Português"). ç hat eine eigene Taste rechts neben l (achte
 *    Grundtaste), « » eine eigene Taste rechts neben dem Apostroph. Totasten:
 *    Akut ´ rechts neben + (mit Shift Gravis `), Tilde ~ rechts neben º (mit
 *    Shift Zirkumflex ^). Die Mac-Belegung ist ungemessen - die Hilfe nennt
 *    darum keinen Mac-Namen (G3b: kein `accessMac`).
 *  · Shift + 6 ist in Portugal `&` - der brasilianische Hinweis „Shift + 6 ist
 *    eine Akzent-Taste" darf hier nie stehen (Glossar §2.9, §4 Nr. 9).
 *  · Die Reihenfolge des Weges „pt" (F4) entsteht parallel: die Hilfe zeigt
 *    die Buchstaben des Weges, auf dem das Kind wirklich übt
 *    (`layoutLetterOrder`), und nennt nur die Grobfolge aus dem Bauplan I1
 *    (Grundreihe mit ç, dann nach Häufigkeit; Akzente nach Shift und Satzzeichen).
 *  · Das Plakat gibt es seit 06.11.2026 auf Portugiesisch (`handbuchInSprache`).
 *  · Die Zeile unter dem Übungsfeld heisst „barra de estado" (nicht „linha" -
 *    das ist die Übungszeile), der Ring „círculo", das Feld „campo de escrita".
 *  · Zahlen mit Komma, keine Ordnungszahl mit º (NVDA liest „ordinal masculino").
 *
 * Fliesstext mit geraden Anführungszeichen, nur Bindestrich, keine Maus-Wörter.
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

// ★ O-PT (25.10.2026): das Wort der Tippchallenge (Glossar §2.3, „Desafio",
// gross wie ein Name). Steht hier, solange `schreibprobe.ts` kein
// `PRUEFUNG_WORT_PT` hat; danach von dort holen.
const DESAFIO = "Desafio";
const DESAFIOS = "Desafios";

export function TippenHilfePortugiesisch({ open, onClose, stufe, lernweg = "pt" }: TippenHilfeProps) {
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
  // Dasselbe Wort wie der Ring (Glossar §2.2: „nível de jogo" für Kinder, sonst
  // „nível"; nie zwei „nível" ohne Zusatz nebeneinander - darum heisst die
  // Leistungsstufe hier immer „nível de dificuldade").
  const ringWort = kind ? "nível de jogo" : "nível";
  // Mehrzahl nach `Intl` „pt-PT": 1 = one, 0 und 2+ = other (Glossar §2.11).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "pt", {
    one: (z) => `${z} minuto`,
    many: (z) => `${z} de minutos`,
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
          <h2 className="m-0 text-xl font-semibold text-ink">Ajuda - como funciona o Tastenflow</h2>
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

        <Section title="Começa simplesmente a escrever">
          <p className="m-0">
            Não precisas de selecionar primeiro o campo de escrita. Começa
            simplesmente a escrever - a primeira letra aparece logo no campo. Se o
            cursor estiver noutro sítio, prime <Kbd>Alt</Kbd> + <Kbd>E</Kbd> e
            voltas logo ao campo de escrita.
          </p>
          <JawsRueckweg weg="pt" />
          {detail === 1 && (
            <p className="m-0">
              Escreve sempre com o dedo certo - o teclado em baixo mostra-te qual é
              a tecla que vem a seguir. Se premires duas vezes rapidamente a tecla{" "}
              <Kbd>Shift</Kbd>, ouves com que dedo deves escrever.
            </p>
          )}
        </Section>

        <Section title="Estes sinais aparecem no texto">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "separa duas informações que vão juntas - como uma vírgula numa frase." },
              { zeichen: "→", bedeutung: "depois, ou: daqui resulta isto." },
              { zeichen: "⏱", bedeutung: "o teu tempo de prática." },
              {
                zeichen: "↵",
                bedeutung:
                  "aparece no fim da linha quando a tua turma o definiu - nesse caso, terminas a linha com a tecla Enter.",
              },
            ]}
          />
        </Section>

        <Section title="Junta estrelas 🌟">
          <p className="m-0">
            Depois de cada ronda recebes <strong>1 a 3 estrelas</strong> - e um som
            só para elas.{" "}
            <strong>Poucos erros contam muito mais do que a velocidade:</strong>{" "}
            escrever com calma e com precisão dá estrelas seguras - à pressa e com
            muitos erros, não.
            {kind ? " Todas as crianças podem ganhar estrelas!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              3 estrelas são para uma ronda mesmo boa - escrita com precisão e a uma
              velocidade razoável, e a <strong>precisão</strong> conta sempre mais
              do que a <strong>velocidade</strong>. Quando as rondas correm bem
              durante algum tempo, sobes um <strong>nível de dificuldade</strong> -
              e o prémio soa um pouco diferente.
            </p>
          )}
        </Section>

        <Section title="Junta medalhas 🏅">
          <p className="m-0">
            Por conquistas especiais recebes <strong>medalhas</strong> - por exemplo,
            por uma ronda sem nenhum erro ou por três rondas perfeitas seguidas.
            Cada medalha nova tem o seu próprio <strong>"ta-dã"</strong> e o seu
            nome é anunciado.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Todas as medalhas estão em <strong>"Os meus progressos"</strong>, logo a
              seguir aos objetivos semanais e aos teus valores - lá vês também
              sempre a <strong>próxima meta</strong> (por exemplo: mais 2 rondas sem
              erros até à próxima medalha). A maior parte das medalhas é para quem
              escreve com <strong>precisão</strong> e com{" "}
              <strong>persistência</strong> - não à pressa. E algumas são{" "}
              <strong>secretas</strong>: a condição não está escrita em lado nenhum,
              um dia simplesmente aparecem.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Lá está também a tua <strong>pontuação</strong>: junta a precisão e a
              velocidade num só número entre 0 e 100 - um erro conta como 5
              carateres, e o dobro da velocidade conta só 1,4 vezes mais. Por isso,
              a precisão ganha à velocidade.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Mais abaixo, "Evolução ao longo do tempo" (uma linha que se abre)
              mostra uma pequena curva. É normal que a curva não suba sempre. Quando
              chegam teclas novas, costuma descer primeiro - sobretudo com a tecla
              Shift e com os algarismos.
            </p>
          )}
          <p className="m-0">
            Dica: seleciona uma medalha em "Os meus progressos" e prime{" "}
            <Kbd>Enter</Kbd> - a medalha aparece <strong>em grande</strong>, com
            brilho e confetes.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Depois de uma tecla nova">
            <p className="m-0">
              Uma <strong>tecla nova</strong> é tua assim que as anteriores estão
              dominadas - não tens de ganhar nada. Há uma pequena festa e depois a
              prática continua. Mais nada.
            </p>
            <p className="m-0">
              Se quiseres, pode vir a seguir um jogo curto: <strong>Blocos de gelo</strong>.
              Quem decide és tu - nas <strong>Definições</strong> (<AltText>Alt + O</AltText>), em{" "}
              <strong>Jogo-prémio</strong>. A opção predefinida é <strong>Nenhum</strong>.
              Esta definição vale para este dispositivo.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Blocos de gelo 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Podes <strong>começar o jogo quando quiseres</strong> - com o botão{" "}
                  <strong>🐧 Jogar</strong> na barra por baixo do campo de escrita. O
                  pinguim salta de bloco em bloco, sobe a montanha de letras e
                  escorrega de barriga para baixo - sempre com as teclas que agora te
                  custam mais. Pelo caminho aparecem <strong>peixes bónus</strong>{" "}
                  (tecla premida a tempo = peixe apanhado; um peixe que foge nunca é
                  um erro) e, na <strong>Gruta do Eco</strong>, cada tecla é apenas
                  anunciada. O jogo <strong>não conta</strong> para o tempo de prática
                  e não é condição para letras novas - mas tem medalhas próprias.
                </p>
                <p className="m-0">
                  Depois de uma tecla nova, só começa automaticamente{" "}
                  <strong>se</strong> estiver escolhido nas Definições como{" "}
                  <strong>Jogo-prémio</strong>. Caso contrário, nada te interrompe -
                  quando se joga, decides tu.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Quando conseguires uma <strong>tecla nova</strong>, para festejar
                  espera-te o jogo Blocos de gelo: ajuda o pinguim a atravessar a
                  água - prime sempre a tecla que está no bloco de gelo seguinte! Às
                  vezes, o caminho sobe depois a uma{" "}
                  <strong>montanha de letras</strong>, e o pinguim desce outra vez de
                  barriga. A tecla nova já é tua antes disso - o jogo é um prémio, não uma
                  obrigação.
                </p>
                <p className="m-0">
                  Também podes <strong>começar o jogo quando quiseres</strong> - com
                  o botão <strong>🐧 Jogar</strong> em cima, no teu cartão de prática,
                  logo ao lado do círculo. É uma grande <strong>aventura</strong>:
                  cada dia é um pouco diferente, pelo caminho aparecem{" "}
                  <strong>peixes bónus</strong> (prime depressa a tecla deles e são
                  teus) e na <strong>Gruta do Eco</strong> não vês letras nenhumas -{" "}
                  {hoehleMitWesen ? (
                    <>
                      a gruta <strong>diz-te</strong> cada tecla.
                    </>
                  ) : (
                    <>
                      cada tecla soa como um tom, e o leitor de ecrã ou a linha
                      braille <strong>diz-te</strong> qual é.
                    </>
                  )}{" "}
                  O jogo é só para te divertires e <strong>não conta</strong> para o
                  tempo de prática - mas tem medalhas próprias!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Não te preocupes: se um bloco de gelo se afundar ou se
                    escorregares na montanha, o pinguim volta simplesmente a nadar
                    para trás - podes tentar outra vez logo, quantas vezes quiseres.
                    E quem fizer a aventura toda sem cair uma única vez na água vê uma{" "}
                    <strong>aurora polar</strong> a dançar por cima do iglu!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="O que quer dizer o círculo com o número?">
          <p className="m-0">
            O número no círculo é o teu <strong>{ringWort}</strong>.{" "}
            <strong>{kind ? "Os XP são pontos de prática:" : "Os pontos vêm da prática:"}</strong>{" "}
            em cada ronda recebes alguns e o círculo vai enchendo. Quando está cheio
            (100 pontos), passas para o {ringWort} seguinte. Serve só para juntar
            pontos e <strong>não torna</strong> a prática mais difícil - como os
            pontos num jogo.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Não confundas com o <strong>nível de dificuldade (1-50)</strong>: esse
              diz a que velocidade deves escrever e ajusta-se a ti{" "}
              <strong>automaticamente</strong> - sobe quando corre bem e desce quando
              está difícil.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              E a definição <strong>"Textos para"</strong> (a idade) decide apenas
              quão difíceis são as palavras e as frases - para condizerem com a
              idade. Numa turma, quem ensina define-a para todas as pessoas; sem
              turma, encontras a definição em cima, nas Definições ⚙. São, portanto,
              três coisas diferentes: <em>{ringWort}</em> = pontos,{" "}
              <em>nível de dificuldade</em> = velocidade esperada,{" "}
              <em>Textos para</em> = idade.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Com que frequência praticar?" : "Tempo de prática e objetivo semanal"}>
          {detail === 1 ? (
            <p className="m-0">
              É melhor praticar <strong>muitas vezes e pouco tempo</strong> do que uma
              vez durante muito tempo - por exemplo, uns minutos em vários dias. Na
              barra por baixo do campo de escrita, um relógio conta há quanto tempo
              já escreves hoje; o mesmo tempo enche também o{" "}
              <strong>círculo</strong> - o teu objetivo semanal.
            </p>
          ) : (
            <p className="m-0">
              Com uma conta podes ter um <strong>objetivo semanal</strong>: um certo
              número de <strong>minutos por semana</strong>. Numa turma, quem ensina
              define-o; sem turma, podes defini-lo nas Definições ⚙, em "O meu
              objetivo semanal" - o novo objetivo vale a partir da segunda-feira
              seguinte. A semana começa <strong>à segunda-feira, às 08:00</strong>, e
              dura até à segunda-feira seguinte, à mesma hora. Na barra por baixo do
              campo de escrita vês o teu estado como um <strong>círculo</strong>, por
              exemplo "25 de 60 min" - quando a semana está cumprida, o círculo fica
              cheio e aparece um visto. Às vezes há também minutos de uma semana
              anterior <strong>por recuperar</strong>; nesse caso, ao lado está
              escrito quantos são. Quando o objetivo semanal está cumprido, aparece
              uma pequena janela de parabéns - depois podes continuar a praticar
              quando quiseres.
            </p>
          )}
        </Section>

        <Section title="Definições: a roda dentada ⚙ em cima">
          <p className="m-0">
            Todas as definições estão atrás do botão <strong>⚙ Definições</strong>,
            lá em cima, logo à esquerda do sinal redondo com a primeira letra do teu
            nome: <strong>O que estás a praticar?</strong>, <strong>Textos</strong>{" "}
            (idade e língua), <strong>Teclado</strong>, <strong>Som</strong> e{" "}
            <strong>Leitura em voz alta</strong>. Premir uma vez abre-as, premir
            outra vez fecha-as - ou <Kbd>Alt</Kbd> + <Kbd>O</Kbd>, que também
            funciona a meio da escrita. Ao abrir, o cursor salta logo para as
            definições; ao fechar, volta ao campo de escrita.
          </p>
          <p className="m-0">
            Lá em cima nas Definições está <strong>"O que estás a praticar?"</strong>:
            três percursos, <strong>O meu treino</strong>, <strong>Histórias</strong>{" "}
            e <strong>Jogos de palavras</strong>. <Kbd>Alt</Kbd> + <Kbd>B</Kbd> passa
            para o percurso seguinte, e o novo percurso é anunciado.
          </p>
          <p className="m-0">
            O botão redondo com o globo, em cima, muda a língua do Tastenflow - os
            botões, os menus e logo também os textos para praticar. A língua dos
            próprios textos pode depois ser mudada à parte em{" "}
            <strong>Textos</strong>, se não estiver fixada para a turma.
          </p>
          <p className="m-0">
            Em <strong>Teclado</strong> escolhes o teclado que tens mesmo à tua
            frente. Em Portugal, a opção certa é normalmente{" "}
            <strong>Portuguesa (Portugal)</strong>.
            Assim, o teclado no ecrã e as dicas para os dedos condizem - e só
            aparecem carateres que existem nesse teclado. O mais importante sobre o
            teclado português:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              O <strong>ç</strong> tem uma tecla própria, à direita do L. É uma das
              teclas da posição inicial: o mindinho direito descansa nela.
            </li>
            <li>
              O <strong>acento agudo</strong> (´) é uma tecla de acento à direita da
              tecla <Kbd>+</Kbd>; com a tecla Shift dá o acento grave (`). O{" "}
              <strong>til</strong> (~) é uma tecla de acento à direita da tecla{" "}
              <Kbd>º</Kbd>; com a tecla Shift dá o acento circunflexo (^). Prime a
              tecla de acento - no ecrã ainda não aparece nada - e depois a vogal:
              acento agudo e a dá <strong>á</strong>, til e a dá <strong>ã</strong>,
              acento circunflexo e e dá <strong>ê</strong>, acento grave e a dá{" "}
              <strong>à</strong>.
            </li>
            <li>
              <strong>Maiúsculas com acento</strong> (Á, Ã, Ê, À): primeiro a tecla
              de acento, depois a tecla <Kbd>Shift</Kbd> com a vogal - por exemplo,
              acento agudo e depois <Kbd>Shift</Kbd> + <Kbd>E</Kbd> dá{" "}
              <strong>É</strong>. O <strong>Ç</strong> maiúsculo é a tecla Shift com
              o ç.
            </li>
            <li>
              <strong>e</strong>, <strong>é</strong> e <strong>ê</strong> são letras
              diferentes - por isso, o Tastenflow espera exatamente a que está no
              texto. O mesmo vale, por exemplo, para a e ã ou para o e ó.
            </li>
            <li>
              As <strong>aspas « »</strong> têm uma tecla própria, à direita da tecla
              do apóstrofo: sem a tecla Shift dá «, com a tecla Shift dá ».
            </li>
            <li>
              Carateres como @ € {"{"} [ escreves com a tecla <Kbd>Alt Gr</Kbd> (o Alt
              da direita) - por exemplo, <Kbd>Alt Gr</Kbd> + <Kbd>2</Kbd> dá @ e{" "}
              <Kbd>Alt Gr</Kbd> + <Kbd>E</Kbd> dá €.
            </li>
          </ul>
          <p className="m-0">
            Há também <strong>"Escrever com uma mão"</strong> - para quem escreve só
            com uma mão: as maiúsculas e os símbolos valem então com qualquer uma
            das teclas Shift. Numa turma, quem ensina define esta opção.
          </p>
          <p className="m-0">
            Quando a definição <strong>"Espaçamento largo (CVI)"</strong> está
            ligada, durante a escrita fica escuro tudo menos o campo onde se está a
            escrever (a linha de prática ou a área do jogo); depois de 5 segundos
            sem escrever, volta a ficar claro. A linha de prática desliza
            suavemente ao ritmo da tua escrita, em vez de saltar. O espaçamento
            entre os carateres pode ser definido nas Definições ⚙ a qualquer
            momento - numa turma, quem ensina também o pode definir; vale o que foi
            escolhido por último.
          </p>
          <p className="m-0">
            Com o <strong>Treino dirigido</strong> podes escolher até 8 teclas ou carateres que aparecem com especial frequência nas rondas - nas definições, em <strong>O que estás a praticar?</strong>, ou com <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. Numa turma, quem o define é o teu professor.
          </p>
        </Section>

        <Section title="Leitura em voz alta - o programa lê para ti">
          <p className="m-0">
            Com o botão <strong>🗣 Leitura em voz alta</strong> (ou <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>), o programa lê em voz alta - para todas as pessoas que
            (ainda) não usam um leitor de ecrã. Em cima, nas Definições ⚙, escolhes
            o que deve ser lido: <strong>teclas</strong> (Tecla a tecla),{" "}
            <strong>palavras</strong>, <strong>frases</strong> - uma coisa, várias ou
            tudo - e a que velocidade.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Em <strong>"Voz"</strong> podes escolher outra voz. Quando a língua é
              o <strong>português</strong>, o programa procura automaticamente uma voz
              portuguesa; se não houver nenhuma instalada, aparece uma pequena
              explicação de como a adicionar.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Não te preocupes com a velocidade:{" "}
              <strong>o tempo da leitura em voz alta é descontado</strong> - esperar
              pelo anúncio não torna a tua velocidade mais lenta.
            </p>
          )}
        </Section>

        <Section title="Melodia ao escrever 🎵">
          <p className="m-0">
            A <strong>melodia ao escrever</strong> serve para treinar um{" "}
            <strong>ritmo de escrita regular</strong> e, sobretudo, para ser{" "}
            <strong>divertida</strong>. Cada tecla certa toca a nota seguinte de uma
            canção; quando manténs o ritmo, junta-se também uma banda.
          </p>
          <p className="m-0">
            Quem escreve de forma regular escreve também com mais fluidez nas teclas
            mais difíceis: o ritmo ajuda a passar os sítios onde, de outra forma, se
            hesita.
          </p>
          <p className="m-0">
            Ligas a melodia com <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, nas definições ⚙ ou no
            menu do botão redondo do altifalante, em cima - lá também acertas o
            volume de cada som com os controlos deslizantes. Mudas o som com{" "}
            <Kbd>Alt</Kbd> + <Kbd>7</Kbd> e <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Maiúsculas e pontuação">
          <p className="m-0">
            O português precisa de <strong>maiúsculas</strong> - no início da frase
            e nos nomes próprios (Lisboa, Tejo, Madeira). O Tastenflow escreve-as{" "}
            <strong>sempre bem</strong>, por isso nunca vês uma palavra mal escrita.
          </p>
          <p className="m-0">
            <strong>No início, é muito fácil:</strong> escreve simplesmente a letra{" "}
            <strong>minúscula</strong> - a <strong>maiúscula</strong> aparece
            automaticamente. Ainda <strong>não precisas</strong> de saber usar a tecla{" "}
            <Kbd>Shift</Kbd> para isso.
          </p>
          <p className="m-0">
            <strong>Pouco depois</strong>, a seguir às primeiras letras, aprendes a
            tecla <Kbd>Shift</Kbd> "a sério": seguras nela com{" "}
            <strong>uma</strong> mão e escreves a letra com a{" "}
            <strong>outra</strong> - como em qualquer teclado. Assim, depressa
            escreves as maiúsculas <strong>com os teus próprios dedos</strong>, e
            não só com a ajuda automática.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Importante - a tecla Shift sempre com a OUTRA mão:</strong> há
              duas teclas Shift, uma à esquerda e uma à direita. Escreves a letra com
              uma mão e seguras na tecla <Kbd>Shift</Kbd> com a{" "}
              <strong>outra</strong>. Assim, nenhuma mão tem de premir duas teclas ao
              mesmo tempo.
            </p>
            <p className="m-0 mt-2">
              Exemplo: <strong>A</strong> maiúsculo (mão esquerda) → a tecla{" "}
              <Kbd>Shift</Kbd> da <strong>direita</strong>. <strong>K</strong>{" "}
              maiúsculo (mão direita) → a tecla <Kbd>Shift</Kbd> da{" "}
              <strong>esquerda</strong>.
            </p>
            <p className="m-0 mt-2">
              Se usares a tecla Shift da <strong>mesma</strong> mão ou a tecla{" "}
              <Kbd>Caps Lock</Kbd>, a letra conta na mesma - afinal, está certa. O
              Tastenflow dá-te então, de vez em quando, uma <strong>dica</strong>{" "}
              sobre qual é a tecla Shift mais cómoda. Quem ensina vê nas estatísticas
              com que frequência isso acontece; não é um erro.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Dica: prime a tecla <Kbd>Shift</Kbd>{" "}
              <strong>duas vezes rapidamente</strong> - é anunciado com que dedo deves
              segurar nela.
            </p>
          )}
          <p className="m-0">
            O <strong>ponto, a vírgula e o ponto de interrogação</strong> só aparecem
            quando os aprenderes. Antes disso, lês a frase simplesmente{" "}
            <strong>sem eles</strong> - é de propósito, não é um erro.
          </p>
        </Section>

        <Section title="Por que ordem chegam as letras?">
          <p className="m-0">
            As teclas novas chegam sempre pela mesma ordem: primeiro a{" "}
            <strong>fila de base</strong>, com o ç, e depois as outras letras - as
            mais frequentes primeiro. Qual é a tecla que vem a seguir, vês sempre à
            direita, na barra por baixo do campo de escrita:{" "}
            <strong>"Próxima tecla"</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Logo <strong>depois das primeiras letras</strong> chegam as{" "}
            <strong>maiúsculas</strong> (a tecla Shift) e a seguir o{" "}
            <strong>ponto, a vírgula e o ponto de interrogação</strong> - a frase
            começa com maiúscula e acaba com ponto. Depois vêm as{" "}
            <strong>teclas de acento</strong>, uma de cada vez - primeiro o til
            (ã), depois o acento agudo (á, é) e mais tarde o acento circunflexo e o
            acento grave. As maiúsculas com acento só vêm depois das minúsculas. No
            fim chegam os outros <strong>sinais de pontuação</strong> (! : ; - e
            outros), os <strong>algarismos</strong> e os{" "}
            <strong>símbolos</strong>.
          </p>
        </Section>

        {detail >= 2 && (
          <Section title={'Como funciona "O meu treino"'}>
            <p className="m-0">
              <strong>Adapta-se a ti.</strong> O programa lembra-se de quais são as
              teclas que ainda estão em consolidação e pratica precisamente essas.
              Uma tecla nova só chega quando as outras estão dominadas. As letras{" "}
              <strong>mais frequentes</strong> chegam primeiro - assim, depois de
              poucas teclas já escreves <strong>palavras e frases a sério</strong>, e
              as primeiras <strong>histórias</strong> abrem-se cedo.
            </p>
          </Section>
        )}

        <Section title="A barra por baixo do campo de escrita">
          <p className="m-0">
            Por baixo do campo de escrita há uma barra estreita com quatro
            informações: o teu <strong>{ringWort}</strong>, o{" "}
            <strong>tempo</strong> de prática de hoje, o{" "}
            <strong>objetivo semanal</strong> e a <strong>próxima tecla</strong>. No
            objetivo semanal, o círculo mostra quantos <strong>minutos</strong> de
            prática já estão feitos nesta semana - por exemplo, "25 de 60 min"; um{" "}
            <strong>visto</strong> quer dizer: a semana está cumprida. A próxima
            tecla desbloqueia-se <strong>automaticamente</strong> assim que as anteriores
            estão dominadas - continua simplesmente a praticar.
          </p>
          <p className="m-0">
            A barra vê-se <strong>sempre</strong> - também durante a escrita. Por
            isso, nada salta, e vês a qualquer momento há quanto tempo já praticas.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> anuncia o tempo de prática e o objetivo
            semanal. Quais são as teclas já dominadas, quais ainda não e qual vem a
            seguir, encontras em <strong>"Os meus progressos"</strong>, no título{" "}
            <strong>"Estado das teclas"</strong> (<Kbd>Alt</Kbd> + <Kbd>S</Kbd>, com
            conta).
          </p>
        </Section>

        <Section title={'A biblioteca: "Histórias e curiosidades" 📖'}>
          <p className="m-0">
            Além do percurso O meu treino, há outro: <strong>Histórias</strong> - nas
            Definições ⚙, em <strong>"O que estás a praticar?"</strong>. Lá esperam-te
            histórias inteiras e séries de curiosidades - não frases soltas, mas{" "}
            <strong>uma história para muitas rondas</strong>. Cada parte tem doze
            linhas; da próxima vez, continuas a ler exatamente onde paraste.
          </p>
          <p className="m-0">
            Só aparece o que se consegue mesmo escrever com as teclas aprendidas - por
            isso, no início ainda se veem cadeados. Abrem-se automaticamente assim que há
            teclas dominadas suficientes. Cada linha aparece <strong>só uma vez</strong>:
            o que já está escrito não volta como repetição.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Um fio condutor:</strong> o que lês numa série de curiosidades
              volta mais tarde no treino - como uma{" "}
              <strong>pergunta com outras palavras</strong>, depois como um pequeno
              aprofundamento e, no fim, como uma piada sobre o tema. Assim, o que
              aprendeste fica na cabeça, e não parece nada um teste.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Por baixo da lista está a parte "Fontes e agradecimentos": lá vês de
              onde vêm os textos. Alguns foram escritos de propósito para este
              programa, outros vêm de fontes livres - essas estão indicadas pelo
              nome, como deve ser.
            </p>
          )}
        </Section>

        <Section title="De onde vêm os textos? 🤖">
          <p className="m-0">
            Os textos próprios deste programa, ou seja, as frases para praticar, as
            piadas e as histórias, foram escritos por Johannes{" "}
            <strong>com a ajuda de inteligência artificial (IA)</strong> e depois
            lidos e verificados por ele pessoalmente. Os textos de outras fontes (por
            exemplo, da Wikipédia) estão indicados com o nome da fonte em "Fontes e
            agradecimentos".
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Também o peixe que canta e a criatura da gruta que murmura, no jogo
                Expedição polar, são <strong>vozes de computador</strong>, não pessoas
                a sério.
              </>
            ) : (
              <>
                Também o peixe que canta no jogo Expedição polar é uma{" "}
                <strong>voz de computador</strong>, não uma pessoa a sério.
              </>
            )}{" "}
            A leitura em voz alta (🗣) usa a voz do teu dispositivo.
          </p>
        </Section>

        <Section title={`O ${DESAFIO}`}>
          <p className="m-0">
            Às vezes, quem ensina começa um <strong>{DESAFIO}</strong> - para a
            turma toda. <strong>Todas as pessoas recebem o mesmo texto</strong> e têm
            o mesmo tempo.
          </p>
          <p className="m-0">
            <strong>O tempo só começa a contar no teu primeiro toque</strong> - e não
            no momento em que o {DESAFIO} começa. Para começar, tens{" "}
            <strong>{einstiegsMinuten}</strong> a partir do início.
          </p>
          <p className="m-0">
            <strong>Como o reconheces:</strong> por cima do campo de escrita está a
            palavra <strong>{DESAFIO}</strong>, ao lado está o tempo, e à volta da
            área toda há uma <strong>moldura tracejada</strong> diferente. Assim que o
            tempo acaba, as duas coisas desaparecem.
          </p>
          <p className="m-0">
            <strong>Quanto tempo falta, sem olhar para o ecrã:</strong>{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> diz-te. Por iniciativa própria, o relógio
            só fala poucas vezes; no resto do tempo, fica calado.
          </p>
          <p className="m-0">
            <strong>A linha braille fica sossegada.</strong> O tempo na linha{" "}
            <strong>não salta</strong>: corre em cima, mas nunca se mete no meio do
            que estás a ler.
          </p>
          <p className="m-0">
            <strong>Às vezes, o {DESAFIO} é de "Escrita livre".</strong> Nesse caso,
            um erro fica simplesmente onde está - nada é marcado e nenhum som o
            anuncia. A tecla de retrocesso (<Kbd>Backspace</Kbd>) só corrige na linha
            atual; uma linha acabada fica como está. No fim da linha, depois da
            última palavra, premes a barra de espaço - ou, se a turma tiver ligado
            "Fim de linha com Enter", a tecla <Kbd>Enter</Kbd>. O que ainda estiver
            errado no fim só aparece no resumo, depois, como uma lista para ler.
          </p>
          <p className="m-0">
            <strong>Acabar mais cedo:</strong> <Kbd>Esc</Kbd> pergunta se queres
            mesmo. O botão <strong>Continuar a escrever</strong> (também{" "}
            <Kbd>Esc</Kbd>) leva-te de volta à linha; o botão{" "}
            <strong>Entregar</strong> entrega o {DESAFIO} - conta o que estiver
            escrito até esse momento. O botão <strong>Concluído - entregar</strong>,
            por baixo do campo, faz o mesmo, sem perguntar.
          </p>
          <p className="m-0">
            <strong>Quando o tempo acaba,</strong> vês logo o teu resumo: toques por
            minuto, precisão, carateres, erros, linhas e as teclas que ainda
            estavam em consolidação. Cada {DESAFIO} fica depois em{" "}
            <strong>"Os meus progressos"</strong>, no título{" "}
            <strong>{DESAFIOS}</strong> - lá podes voltar a lê-lo quando quiseres.
          </p>
        </Section>

        <Section title="A Corrida da turma ⚔️">
          <p className="m-0">
            Na Corrida da turma escreves <strong>cinco minutos em corrida</strong> com
            as outras crianças da tua turma. A corrida só existe numa turma, e só se
            quem ensina a permitir.
          </p>
          <p className="m-0">
            <strong>Lançar uma corrida:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd> ou o
            botão <strong>⚔️ Corrida da turma</strong> na barra por cima do campo de
            escrita - logo ao lado do botão <strong>🐧 Jogar</strong>. Para todas as
            outras pessoas abre-se então uma janela com os botões{" "}
            <strong>Conta comigo!</strong> e <strong>Agora não</strong>.{" "}
            <Kbd>Esc</Kbd> leva de volta à prática, e o mesmo convite não volta a
            aparecer.
          </p>
          <p className="m-0">
            <strong>Se alguém já estiver a convidar,</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> volta a mostrar esse convite - uma segunda corrida só pode
            começar quando a primeira já estiver a decorrer. Se duas pessoas
            convidarem quase ao mesmo tempo, vale o convite que chegou primeiro.
          </p>
          <p className="m-0">
            <strong>Quando não dá:</strong> se já estiveres numa corrida, o botão
            chama-se <strong>⚔️ Corrida da turma a decorrer</strong> - e{" "}
            <Kbd>Alt</Kbd> + <Kbd>M</Kbd> diz-te o mesmo. Outras corridas na turma
            não fazem mal: podem decorrer quantas forem ao mesmo tempo.
          </p>
          <p className="m-0">
            <strong>Cada pessoa escreve ao seu próprio nível.</strong> Quem já sabe os
            algarismos recebe algarismos; quem está na fila de base recebe a fila de
            base. Os erros custam alguma coisa - um erro pesa tanto como cinco
            carateres.
          </p>
          <p className="m-0">
            <strong>Como está a corrida, sem olhar para o ecrã:</strong> lá à
            esquerda, na linha de escrita, há sempre oito células -{" "}
            <strong>P2</strong> é o lugar, e ao lado está o tempo que falta.{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> diz-te o lugar, o tempo e os três
            primeiros. Por iniciativa própria, nada fala - a linha braille fica sossegada.
          </p>
          <p className="m-0">
            <strong>Acabar mais cedo:</strong> <Kbd>Esc</Kbd> ou o botão{" "}
            <strong>Sair</strong> pergunta se queres mesmo. O botão{" "}
            <strong>Continuar a escrever</strong> (também <Kbd>Esc</Kbd>) leva-te de
            volta à linha. O botão <strong>Sair</strong> acaba a corrida só para ti -
            as outras pessoas continuam a escrever e veem o que estiver escrito até
            esse momento.
          </p>
          <p className="m-0">
            <strong>A corrida conta para o teu tempo de prática</strong> e pode
            desbloquear uma tecla nova - tal como uma ronda normal.{" "}
            <strong>O lugar não fica guardado.</strong> No fim aparece uma lista:
            Taça, Prata e Bronze para os três primeiros lugares, os outros com o seu
            número. Depois, o botão <strong>Continuar a praticar</strong> ou{" "}
            <Kbd>Esc</Kbd> leva-te de volta.
          </p>
        </Section>

        <Section title="Teclas importantes">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              No Mac, em vez da tecla <Kbd>Alt</Kbd>, usa-se a tecla <Kbd>⌥</Kbd> (Opção).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>A tecla mais importante:</strong> fecha qualquer janela, e o
                cursor fica depois <strong>sempre no campo de escrita</strong>.
                Mesmo quando não há nada aberto, <Kbd>Esc</Kbd> leva-o para lá. A
                única exceção é Explorar as teclas: aí, também a tecla{" "}
                <Kbd>Esc</Kbd> é uma tecla para explorar, e só sais ao premi-la
                pela segunda vez.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>Duas vezes rapidamente: é anunciado o dedo certo.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Salta para o campo de escrita.</span>
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
                Abre Os meus progressos (para docentes: As minhas turmas). Só
                funciona com sessão iniciada. Premir outra vez leva de volta ao campo
                de escrita.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Anuncia em que linha estás.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Diz o tempo de prática - na linha braille e (com a leitura em voz
                alta) como anúncio.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Anuncia em que {ringWort} estás.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Explorar as teclas:</strong> cada tecla que premes é
                anunciada e aparece em grande - primeiro a abreviatura, depois o
                nome, depois o que faz (por exemplo, "Tab - tecla de tabulação -
                salta para o elemento seguinte"). Isto vale também para todas as
                teclas especiais e sinais de pontuação, para os carateres com Alt Gr
                (no Mac, Opção), com o caminho até eles, e para atalhos de teclado
                como Ctrl + C - com o que fazem. Os atalhos do Tastenflow (<AltText>Alt + H, Alt + V ...</AltText>) continuam a funcionar. O teclado no ecrã mostra a
                tecla que foi premida. Quando a leitura em voz alta está desligada, a
                voz fica calada. Na linha braille, a explicação fica até à tecla
                seguinte e pode ser lida toda com as teclas de deslocamento; no ecrã,
                aparece numa janela. Nada é escrito, nada se perde.{" "}
                <strong>Para sair:</strong> outra vez <Kbd>Alt</Kbd> + <Kbd>3</Kbd>,
                duas vezes <Kbd>Esc</Kbd> - ou recarrega simplesmente a página.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Encontrar as teclas:</strong> o programa diz o nome de uma
                tecla e tu procura-la. Quando acertas pela primeira vez, o programa
                dá-te os parabéns e pede-te outra tecla e depois mais um toque - só
                conta o segundo, e só depois de outra tecla pelo meio. Depois vem a
                tecla seguinte. Outra tecla é apenas nomeada. Na janela,{" "}
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd> muda entre explorar e encontrar.{" "}
                <strong>Para sair:</strong> como em Explorar as teclas.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Cores e contraste:</strong> sete temas de cores - claro,
                escuro, preto sobre amarelo, amarelo sobre azul e outros. Cada um já
                aparece na lista com as suas próprias cores, por isso vês antes como
                fica.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Abre ou fecha a lista dos atalhos de teclado.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Abre ou fecha as mensagens da escola.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Aumenta ou diminui o campo de escrita.</span>
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
          <Section title="Como o programa te ajuda">
            <p className="m-0">
              O programa mede cada letra à parte - com que precisão e a que
              velocidade a escreves. Pratica automaticamente as mais fracas e só desbloqueia
              uma letra nova quando as anteriores estão dominadas. Assim nasce o teu
              próprio percurso.
            </p>
            <p className="m-0">
              O nível de dificuldade (1-50) faz com que seja sempre{" "}
              <strong>exigente, mas possível</strong>: quando corre bem, sobe; quando
              fica difícil demais, volta a descer. Em{" "}
              <strong>"Os meus progressos"</strong> vês tudo sobre os teus progressos
              - também como estás a melhorar.
            </p>
          </Section>
        )}

        <Section title="Praticar sem turma - uma conta pessoal 🙋">
          <p className="m-0">
            Se não pertences a nenhuma turma, podes criar uma conta pessoal: prime o
            botão redondo <strong>Conta</strong> e marca{" "}
            <strong>"Pratico por conta própria, sem turma"</strong>. Para isso
            precisas de um endereço de e-mail: para lá vai, às segundas-feiras, o
            resumo semanal - mas só nas semanas em que se praticou mesmo. Se durante
            um ano inteiro ninguém abrir nenhum dos quatro programas, chega primeiro
            um aviso por e-mail; se depois disso ninguém iniciar sessão durante três
            semanas, a conta é eliminada, com todos os progressos.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Cartaz para afixar, em português (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "pt");
  return (
    <Section title="Um cartaz para afixar">
      <p className="m-0">
        Queres mostrar o Tastenflow na tua escola ou instituição? Aqui tens um{" "}
        <strong>cartaz para imprimir e afixar</strong>: A3 ao alto, mostra de
        relance o que o Tastenflow consegue fazer, com um código QR para
        tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Transferir o cartaz (PDF, A3, {groesse(plakat.bytes, "pt")})
        </a>
      </p>
    </Section>
  );
}
