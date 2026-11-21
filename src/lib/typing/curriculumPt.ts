/**
 * ★★★ DIE LEKTIONEN DES WEGES „pt" (Portugiesisch, Portugal) - F4-PT (29.10.2026), vorher leerer Einhängepunkt (G3c-VERTEILER).
 *
 * Die Mechanik (Tasten je Lektion aus der Folge der eingestellten Tastatur, Griffe aus ihren Daten, `introByLayout`) steht in
 * `lektionenBaukasten.ts` (seit GEN-HAUPTSPRACHE, 29.10.2026 - vorher `lektionenAusFolge.ts`); hier stehen nur die Texte. Neu auf Portugiesisch (Portugal, AO90) geschrieben, nichts übersetzt. Begriffe nach
 * dem Glossar (`glossar/GLOSSAR-pt-PT.md` §1, §2.1, §2.8, §2.9): *fila de base* (nie „linha" - das ist die Übungszeile), *posição
 * inicial*, *fila dos números / de cima / de baixo*, *mindinho · anelar · médio · indicador · polegar*, *os relevos no F e no J*,
 * *tecla de acento* (Totaste), *a tecla Shift*, *Alt Gr*, *barra de espaço*, *lição*. Kinder werden geduzt (*tu*: „Prime", „Experimenta",
 * Regel 1); keine Adjektive am Kind (Regel 2); Tastenwege statt Maus (Regel 8: *prime*, nie „clica"); nur der Bindestrich `-`; gerade
 * Anführungszeichen um Beispielwörter (Regel 7: `« »` nur in den Übungstexten).
 *
 * ── DIE REGEL (wie cs) ───────────────────────────────────────────────────────────────────────────────────────────────
 * Die Tasten aller Lektionen hintereinander SIND `introOrder("pt")` (`lernweg.ts#PT_LETTER_ORDER`). Die vier Totasten (`~ ´ ^ \``) sind
 * eigene Einheiten (Bauplan I2/I3): ihre Lektion erklärt „primeiro o acento, depois a vogal". Wächter: `tests/tastenflow-lektionen-pt.test.ts`.
 */
import type { Lesson } from "./curriculum";
import type { FingerId } from "./fingers";
import { heimZeichenDesWeges } from "./heimtasten";
import type { LayoutId } from "./layouts";
import { griffSaetzeAusInfo, lektionenJeTastatur, type GriffInfo, type Lage, type LektionsBauplan } from "./lektionenBaukasten";
import { lernwegDef } from "./lernweg";
import { kappeFuer } from "./sprachRegister";

// ── Namen ────────────────────────────────────────────────────────────────────

const kappe = (k: string): string => kappeFuer(k, "pt");

/** „F e J", „A, B e C". */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} e ${teile[teile.length - 1]}`;
}
const kappen = (t: readonly string[]): string => aufzaehlen(t.map(kappe));

const DEDO: Readonly<Record<string, string>> = { kleiner: "mindinho", ring: "anelar", mittel: "médio", zeige: "indicador", daumen: "polegar" };
function dedo(f: FingerId): string {
  if (f === "daumen") return DEDO.daumen;
  const [art, hand] = f.split("-");
  return `${DEDO[art]} ${hand === "links" ? "esquerdo" : "direito"}`;
}

const FILAS = ["fila dos números", "fila de cima", "fila de base", "fila de baixo"];

function aoLado(l: Lage): string {
  const lado = l.richtung === "links" ? "à esquerda" : "à direita";
  const longe = l.abstand >= 3 ? "três teclas " : l.abstand === 2 ? "duas teclas " : "";
  return `${longe}${lado} da tecla ${kappe(l.heim ?? "")}`;
}

/** Dedo e lugar: „indicador esquerdo, fila de cima, à direita da tecla F". */
function lugar(l: Lage, basis: string): string {
  const d = dedo(l.finger);
  if (l.reihe === 2 && l.heim === basis) return `${d}, posição inicial`;
  if (!l.heim) return `${d}, ${FILAS[l.reihe]}`;
  if (l.reihe === 2) return `${d}, ${aoLado(l)}`;
  if (l.abstand === 0) return `${d}, ${FILAS[l.reihe]}, mesmo ${l.reihe === 3 ? "por baixo" : "por cima"} da tecla ${kappe(l.heim)}`;
  return `${d}, ${FILAS[l.reihe]}, ${aoLado(l)}`;
}

/** Nomes dos sinais (Glossar §2.8, `SPOKEN_PT`): o nome vem antes do sinal. */
const SINAIS: Readonly<Record<string, string>> = {
  ".": "ponto", ",": "vírgula", "?": "ponto de interrogação", "!": "ponto de exclamação", "-": "hífen", ";": "ponto e vírgula",
  ":": "dois pontos", "\"": "aspas", "'": "apóstrofo", "«": "abrir aspas duplas", "»": "fechar aspas duplas",
  "(": "abrir parêntesis", ")": "fechar parêntesis", "%": "por cento", "/": "barra", "+": "mais", "=": "igual", "_": "sublinhado",
  "*": "asterisco", "&": "e comercial", "<": "menor que", ">": "maior que", "$": "cifrão", "@": "arroba", "#": "cardinal",
  "[": "abrir parênteses retos", "]": "fechar parênteses retos", "{": "abrir chavetas", "}": "fechar chavetas",
  "|": "barra vertical", "\\": "barra invertida", "€": "euro",
  "~": "til", "´": "acento agudo", "^": "acento circunflexo", "`": "acento grave",
};

function nome(u: string): string {
  if (u === "ç") return "Ç (c com cedilha)";
  if (/^\p{L}$/u.test(u) || /^\d$/.test(u)) return kappe(u);
  return SINAIS[u] ? `${SINAIS[u]} (${u})` : u;
}

function griffSatz(g: GriffInfo): string {
  const n = nome(g.einheit);
  const onde = g.lage ? lugar(g.lage, g.basis) : null;
  let satz: string;
  if (g.mod) {
    const segura = g.mod === "shift" ? "segura a tecla Shift com a outra mão" : "segura a tecla Alt Gr";
    satz = `${n}: ${segura} e prime a tecla ${kappe(g.basis)}${onde ? ` (${onde})` : ""}.`;
  } else if (onde) {
    satz = `${n}: ${onde}.`;
  } else {
    return `${n}: o lugar neste teclado ainda não está descrito.`;
  }
  if (g.tot) {
    const alvos = lernwegDef("pt").totastenZiele?.[g.einheit] ?? [];
    satz += ` É uma tecla de acento: sozinha, ainda não escreve nada. Primeiro o acento, depois a vogal${alvos.length ? ` (${alvos.join(" ")})` : ""}.`;
  }
  return satz;
}

// ── Partes especiais ─────────────────────────────────────────────────────────

function shiftTeil(): string {
  return (
    "Escreves uma maiúscula segurando a tecla Shift com a outra mão: para uma letra do lado esquerdo do teclado, o Shift da " +
    "direita; para uma letra do lado direito, o Shift da esquerda. Os dois Shift são premidos pelo mindinho."
  );
}

// ── A sequência ──────────────────────────────────────────────────────────────

const fixo = (texto: string) => () => texto;
const FILA = (t: readonly string[]) => `Fila de base: ${kappen(t)}`;
const LETRAS = (t: readonly string[]) => `Mais letras: ${kappen(t)}`;

const PLANOS: readonly LektionsBauplan[] = [
  {
    id: "pt-base-1", kind: "home",
    // Falle 41: as teclas em KeyF/KeyJ do teclado principal - lidas só ao construir.
    get einheiten() {
      return [...heimZeichenDesWeges("pt")];
    },
    titel: FILA,
    vorspann: fixo(
      "Põe os dedos na fila de base - é a posição inicial. Nas teclas F e J sentes uns pequenos relevos: assim encontras a " +
        "posição sem olhar para o teclado. Começas com estas duas teclas, com os dois indicadores. Cada dedo parte daqui e " +
        "volta para aqui.",
    ),
  },
  {
    id: "pt-base-2", kind: "home", einheiten: ["d", "k"], titel: FILA,
    vorspann: fixo("Ao lado dos indicadores vêm os dedos médios: o D à esquerda, o K à direita. Os indicadores ficam nos relevos."),
  },
  {
    id: "pt-base-3", kind: "home", einheiten: ["s", "l"], titel: FILA,
    vorspann: fixo("Agora vêm os anelares: o S à esquerda, o L à direita. Os dedos ficam soltos e leves."),
  },
  {
    id: "pt-base-4", kind: "home", einheiten: ["a", "ç"],
    titel: (t) => `Toda a fila de base: ${kappen(t)}`,
    vorspann: fixo(
      'O mindinho esquerdo vai para o A, o mindinho direito para o Ç, à direita do L - o ç tem a sua própria tecla. Agora a ' +
        'fila de base está completa: oito dedos em oito teclas, os polegares na barra de espaço. As primeiras palavras: "sala", ' +
        '"fala", "salsa" e "faça".',
    ),
  },
  {
    id: "pt-frequentes-1", kind: "letters", einheiten: ["e", "o"],
    titel: (t) => `Letras frequentes: ${kappen(t)}`,
    vorspann: fixo('O E e o O estão entre as letras mais frequentes do português. Com eles já escreves: "lado", "dedo", "sede", "solo" e "selo".'),
  },
  {
    id: "pt-frequentes-2", kind: "letters", einheiten: ["r", "i"],
    titel: (t) => `Letras frequentes: ${kappen(t)}`,
    vorspann: fixo('Com o R e o I: "rio", "dia", "frio", "ler" e "disse".'),
  },
  {
    id: "pt-frequentes-3", kind: "letters", einheiten: ["m", "t"],
    titel: (t) => `Letras frequentes: ${kappen(t)}`,
    vorspann: fixo('Com o M e o T: "mar", "tio", "mesa", "tarde", "metro" e "tomate".'),
  },
  {
    id: "pt-frequentes-4", kind: "letters", einheiten: ["n", "u"],
    titel: (t) => `Letras frequentes: ${kappen(t)}`,
    vorspann: fixo('Com o N e o U: "nome", "uma", "neto", "lua", "muito" e "sul".'),
  },
  {
    id: "pt-maiusculas", kind: "shift", einheiten: [], enablesShift: true,
    titel: () => "Maiúsculas com a tecla Shift",
    vorspann: fixo(
      'Até agora, o Tastenflow escreveu as maiúsculas por ti. A partir de agora é a tua mão que as escreve: "Ana", "Rui", ' +
        '"Rita", "Faro", "Leiria" e "Mafra". Com uma maiúscula no início já escreves uma frase inteira: "Rita mora em Faro".',
    ),
    griffe: shiftTeil,
  },
  {
    id: "pt-pontuacao-1", kind: "punctuation", einheiten: [".", ","],
    titel: () => "Ponto e vírgula: . ,",
    vorspann: fixo(
      'A frase começa com maiúscula e acaba com ponto. A vírgula divide-a em partes. Antes destes sinais não há espaço, ' +
        'depois há. Experimenta: "Sim, Rita." e "Rui tem um tio."',
    ),
  },
  {
    id: "pt-til", kind: "letters", einheiten: ["~"],
    titel: () => "O til: ~",
    vorspann: fixo(
      'O til está numa tecla de acento: sozinha, ainda não escreve nada. Primeiro a tecla do til, depois a vogal - assim nascem ' +
        'o ã e o õ: "mãe", "mão", "não", "irmã" e "limões".',
    ),
  },
  {
    id: "pt-letras-1", kind: "letters", einheiten: ["c", "p", "v"], titel: LETRAS,
    vorspann: fixo('Com o C, o P e o V: "casa", "pai", "vida", "porta", "caneta" e "vaca".'),
  },
  {
    id: "pt-agudo", kind: "letters", einheiten: ["´"],
    titel: () => "O acento agudo: ´",
    vorspann: fixo(
      'O acento agudo também está numa tecla de acento: primeiro o acento, depois a vogal. Assim escreves á, é, í, ó e ú: ' +
        '"café", "avó", "está", "país" e "útil".',
    ),
  },
  {
    id: "pt-letras-2", kind: "letters", einheiten: ["q", "h", "g"], titel: LETRAS,
    vorspann: fixo('Com o Q, o H e o G: "que", "quero", "hoje", "filho", "gato" e "água".'),
  },
  {
    id: "pt-letras-3", kind: "letters", einheiten: ["b", "z"], titel: LETRAS,
    vorspann: fixo('Com o B e o Z: "bola", "bom", "zero", "luz", "azul" e "bebé".'),
  },
  {
    id: "pt-circunflexo", kind: "letters", einheiten: ["^", "x"],
    titel: (t) => `O acento circunflexo e mais letras: ${t.map(kappe).join(" ")}`,
    vorspann: fixo(
      'O acento circunflexo está na mesma tecla que o til, com Shift. Primeiro o acento, depois a vogal: â, ê e ô - "três", ' +
        '"avô", "pêssego" e "câmara". Com o X: "xadrez", "caixa" e "peixe".',
    ),
  },
  {
    id: "pt-grave", kind: "letters", einheiten: ["`", "y", "w"],
    titel: (t) => `O acento grave e letras raras: ${t.map(kappe).join(" ")}`,
    vorspann: fixo(
      'O acento grave aparece quase só no à: "à" e "àquele". O Y e o W aparecem em nomes e em palavras de outras línguas: ' +
        '"yoga", "kiwi" e "web".',
    ),
  },
  {
    id: "pt-pontuacao-2", kind: "punctuation", einheiten: ["?", "!", "-", "«", "»", ":", ";", "\"", "'", "(", ")"],
    titel: (t) => `Mais pontuação: ${t.join(" ")}`,
    vorspann: fixo(
      'O ponto de interrogação fecha uma pergunta, o de exclamação uma exclamação. O hífen liga palavras: "guarda-chuva". Em ' +
        'Portugal, as falas e citações vão entre « e ». Os parêntesis fecham uma nota. Experimenta: "Estás bem?", "Que bom!" e "(nota)".',
    ),
  },
  {
    id: "pt-numeros", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Fila dos números",
    vorspann: fixo("Datas, horas, preços e resultados: agora vêm os números. Cada dedo sobe na sua coluna."),
  },
  {
    id: "pt-simbolos-1", kind: "symbols", einheiten: ["%", "&", "/", "+", "*", "=", "_", "<", ">", "$"],
    titel: (t) => `Símbolos: ${t.join(" ")}`,
    vorspann: fixo("Estes sinais servem para contas, percentagens e trabalho no computador. Aqui a precisão conta mais do que a velocidade."),
  },
  {
    id: "pt-simbolos-2", kind: "symbols", einheiten: ["#", "|", "\\", "@", "[", "]", "{", "}", "€"],
    titel: (t) => `Mais símbolos: ${t.join(" ")}`,
    vorspann: fixo("Sinais para endereços de e-mail, preços e código de programação. São os mais difíceis, por isso vêm no fim."),
  },
  {
    id: "pt-textos", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Textos",
    vorspann: fixo(
      "Agora o teclado inteiro é teu e escreves textos inteiros: do Minho ao Algarve, dos Açores à Madeira, histórias sobre a " +
        "escola, o desporto, os animais e um dia como os outros.",
    ),
  },
];

// ── Construir por teclado ────────────────────────────────────────────────────

/** Die Folge der Lektions-IDs (für Wächter und Handbuch). */
export const PT_LEKTIONS_IDS: readonly string[] = PLANOS.map((p) => p.id);

/** Der GESCHRIEBENE erste Absatz einer Lektion (für den Beispielwort-Wächter). */
export function ptLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return PLANOS.find((p) => p.id === id)?.vorspann(tasten) ?? "";
}

const bauen = lektionenJeTastatur("pt", ["pt"], PLANOS, griffSaetzeAusInfo((g: GriffInfo) => griffSatz(g)));

/** Die Lektionen des Weges „pt" auf dieser Tastatur (gecacht). */
export function ptLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  return bauen(layoutId);
}
