/**
 * ★★★ DIE LEKTIONEN DES WEGES „br" (Portugiesisch, Brasilien) - F4-BR (29.10.2026), vorher leerer Einhängepunkt (G3c-VERTEILER).
 *
 * Die Mechanik steht in `lektionenBaukasten.ts` (seit GEN-HAUPTSPRACHE, 29.10.2026 - vorher `lektionenAusFolge.ts`); hier stehen nur die Texte. Neu auf brasilianischem Portugiesisch geschrieben, nicht aus
 * pt-PT umgeschrieben. Begriffe nach dem Glossar (`glossar/GLOSSAR-pt-BR.md` §1, §2.1, §2.8, §2.9): *fileira central* (nie „fila" - in
 * Brasilien die Warteschlange - und nie „linha", das ist die Übungszeile), *posição inicial*, *fileira dos números / de cima / de baixo*,
 * *dedo mínimo · anelar · médio · indicador · polegar*, *marcas em relevo no F e no J*, *tecla de acento*, *a tecla Shift*, *Alt Gr*,
 * *barra de espaço*, *lição*. Anrede **você** in der Imperativform der 3. Person (*Pressione*, *Digite*, *Experimente*, Regel 1), nie
 * tu-Formen; keine Adjektive am Kind (Regel 2); Tastenwege statt Maus (Regel 8); nur der Bindestrich `-`; gerade Anführungszeichen.
 *
 * ── DIE REGEL (wie cs) ───────────────────────────────────────────────────────────────────────────────────────────────
 * Die Tasten aller Lektionen hintereinander SIND `introOrder("br")` (`lernweg.ts#BR_LETTER_ORDER`, ABNT2): Akut und Zirkumflex kommen
 * hier direkt nacheinander (anders als „pt"). Wächter: `tests/tastenflow-lektionen-br.test.ts`.
 */
import type { Lesson } from "./curriculum";
import type { FingerId } from "./fingers";
import { heimZeichenDesWeges } from "./heimtasten";
import type { LayoutId } from "./layouts";
import { griffSaetzeAusInfo, lektionenJeTastatur, type GriffInfo, type Lage, type LektionsBauplan } from "./lektionenBaukasten";
import { lernwegDef } from "./lernweg";
import { kappeFuer } from "./sprachRegister";

// ── Namen ────────────────────────────────────────────────────────────────────

const kappe = (k: string): string => kappeFuer(k, "br");

/** „F e J", „A, B e C" (sem vírgula antes de „e", Glossar Regel 7). */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} e ${teile[teile.length - 1]}`;
}
const kappen = (t: readonly string[]): string => aufzaehlen(t.map(kappe));

const DEDO: Readonly<Record<string, string>> = { kleiner: "mínimo", ring: "anelar", mittel: "médio", zeige: "indicador", daumen: "polegar" };
function dedo(f: FingerId): string {
  if (f === "daumen") return DEDO.daumen;
  const [art, hand] = f.split("-");
  return `${DEDO[art]} ${hand === "links" ? "esquerdo" : "direito"}`;
}

const FILEIRAS = ["fileira dos números", "fileira de cima", "fileira central", "fileira de baixo"];

function aoLado(l: Lage): string {
  const lado = l.richtung === "links" ? "à esquerda" : "à direita";
  const longe = l.abstand >= 3 ? "três teclas " : l.abstand === 2 ? "duas teclas " : "";
  return `${longe}${lado} da tecla ${kappe(l.heim ?? "")}`;
}

/** Dedo e lugar: „indicador esquerdo, fileira de cima, à direita da tecla F". */
function lugar(l: Lage, basis: string): string {
  const d = dedo(l.finger);
  if (l.reihe === 2 && l.heim === basis) return `${d}, posição inicial`;
  if (!l.heim) return `${d}, ${FILEIRAS[l.reihe]}`;
  if (l.reihe === 2) return `${d}, ${aoLado(l)}`;
  if (l.abstand === 0) return `${d}, ${FILEIRAS[l.reihe]}, logo ${l.reihe === 3 ? "abaixo" : "acima"} da tecla ${kappe(l.heim)}`;
  return `${d}, ${FILEIRAS[l.reihe]}, ${aoLado(l)}`;
}

/** Nomes dos sinais (Glossar §2.8, `SPOKEN_PT_BR`): o nome vem antes do sinal. */
const SINAIS: Readonly<Record<string, string>> = {
  ".": "ponto", ",": "vírgula", "?": "ponto de interrogação", "!": "ponto de exclamação", "-": "hífen", ";": "ponto e vírgula",
  ":": "dois pontos", "\"": "aspas", "'": "apóstrofo", "(": "abre parênteses", ")": "fecha parênteses", "%": "por cento",
  "/": "barra", "+": "mais", "=": "igual", "_": "sublinhado", "*": "asterisco", "&": "e comercial", "<": "menor que",
  ">": "maior que", "$": "cifrão", "@": "arroba", "#": "cerquilha", "[": "abre colchetes", "]": "fecha colchetes",
  "{": "abre chaves", "}": "fecha chaves", "|": "barra vertical", "\\": "barra invertida", "€": "euro",
  "~": "til", "´": "acento agudo", "^": "acento circunflexo", "`": "acento grave",
};

function nome(u: string): string {
  if (u === "ç") return "Ç (cê-cedilha)";
  if (/^\p{L}$/u.test(u) || /^\d$/.test(u)) return kappe(u);
  return SINAIS[u] ? `${SINAIS[u]} (${u})` : u;
}

function griffSatz(g: GriffInfo): string {
  const n = nome(g.einheit);
  const onde = g.lage ? lugar(g.lage, g.basis) : null;
  let satz: string;
  if (g.mod) {
    const segure = g.mod === "shift" ? "segure a tecla Shift com a outra mão" : "segure a tecla Alt Gr";
    satz = `${n}: ${segure} e pressione a tecla ${kappe(g.basis)}${onde ? ` (${onde})` : ""}.`;
  } else if (onde) {
    satz = `${n}: ${onde}.`;
  } else {
    return `${n}: o lugar neste teclado ainda não está descrito.`;
  }
  if (g.tot) {
    const alvos = lernwegDef("br").totastenZiele?.[g.einheit] ?? [];
    satz += ` É uma tecla de acento: sozinha, ela ainda não escreve nada. Primeiro o acento, depois a vogal${alvos.length ? ` (${alvos.join(" ")})` : ""}.`;
  }
  return satz;
}

// ── Partes especiais ─────────────────────────────────────────────────────────

function shiftTeil(): string {
  return (
    "Para escrever uma maiúscula, segure a tecla Shift com a outra mão: para uma letra do lado esquerdo do teclado, o Shift da " +
    "direita; para uma letra do lado direito, o Shift da esquerda. Os dois Shift ficam com o dedo mínimo."
  );
}

// ── A sequência ──────────────────────────────────────────────────────────────

const fixo = (texto: string) => () => texto;
const FILEIRA = (t: readonly string[]) => `Fileira central: ${kappen(t)}`;
const LETRAS = (t: readonly string[]) => `Mais letras: ${kappen(t)}`;

const PLANOS: readonly LektionsBauplan[] = [
  {
    id: "br-base-1", kind: "home",
    // Falle 41: as teclas em KeyF/KeyJ do teclado principal - lidas só na construção.
    get einheiten() {
      return [...heimZeichenDesWeges("br")];
    },
    titel: FILEIRA,
    vorspann: fixo(
      "Coloque os dedos na fileira central - essa é a posição inicial. Nas teclas F e J há pequenas marcas em relevo: com elas " +
        "você encontra a posição sem olhar para o teclado. Você começa com essas duas teclas, com os dois indicadores. Cada dedo " +
        "sai daqui e volta para cá.",
    ),
  },
  {
    id: "br-base-2", kind: "home", einheiten: ["d", "k"], titel: FILEIRA,
    vorspann: fixo("Ao lado dos indicadores vêm os dedos médios: o D à esquerda, o K à direita. Os indicadores continuam nas marcas em relevo."),
  },
  {
    id: "br-base-3", kind: "home", einheiten: ["s", "l"], titel: FILEIRA,
    vorspann: fixo("Agora vêm os anelares: o S à esquerda, o L à direita. Os dedos ficam soltos e leves."),
  },
  {
    id: "br-base-4", kind: "home", einheiten: ["a", "ç"],
    titel: (t) => `A fileira central inteira: ${kappen(t)}`,
    vorspann: fixo(
      'O mínimo esquerdo vai para o A, o mínimo direito para o Ç, à direita do L - o ç tem uma tecla só dele. Agora a fileira ' +
        'central está completa: oito dedos em oito teclas, os polegares na barra de espaço. As primeiras palavras: "sala", ' +
        '"fala", "salsa" e "faça".',
    ),
  },
  {
    id: "br-frequentes-1", kind: "letters", einheiten: ["e", "o"],
    titel: (t) => `Letras frequentes: ${kappen(t)}`,
    vorspann: fixo('O E e o O estão entre as letras mais usadas do português. Com eles você já digita: "lado", "dedo", "sede", "solo" e "selo".'),
  },
  {
    id: "br-frequentes-2", kind: "letters", einheiten: ["r", "i"],
    titel: (t) => `Letras frequentes: ${kappen(t)}`,
    vorspann: fixo('Com o R e o I: "rio", "dia", "frio", "ler" e "disse".'),
  },
  {
    id: "br-frequentes-3", kind: "letters", einheiten: ["m", "t"],
    titel: (t) => `Letras frequentes: ${kappen(t)}`,
    vorspann: fixo('Com o M e o T: "mar", "tio", "mesa", "tarde", "metro" e "tomate".'),
  },
  {
    id: "br-frequentes-4", kind: "letters", einheiten: ["n", "u"],
    titel: (t) => `Letras frequentes: ${kappen(t)}`,
    vorspann: fixo('Com o N e o U: "nome", "uma", "neto", "lua", "muito" e "sul".'),
  },
  {
    id: "br-maiusculas", kind: "shift", einheiten: [], enablesShift: true,
    titel: () => "Maiúsculas com a tecla Shift",
    vorspann: fixo(
      'Até agora, o Tastenflow digitou as maiúsculas por você. A partir de agora, é a sua mão que digita: "Ana", "Rui", ' +
        '"Rita", "Natal", "Manaus" e "Santos". Com uma maiúscula no começo, você já digita uma frase inteira: "Rita mora em Santos".',
    ),
    griffe: shiftTeil,
  },
  {
    id: "br-pontuacao-1", kind: "punctuation", einheiten: [".", ","],
    titel: () => "Ponto e vírgula: . ,",
    vorspann: fixo(
      'A frase começa com maiúscula e termina com ponto. A vírgula divide a frase em partes. Antes desses sinais não vai ' +
        'espaço, depois vai. Experimente: "Sim, Rita." e "Rui tem um tio."',
    ),
  },
  {
    id: "br-til", kind: "letters", einheiten: ["~"],
    titel: () => "O til: ~",
    vorspann: fixo(
      'O til fica em uma tecla de acento: sozinha, ela ainda não escreve nada. Primeiro a tecla do til, depois a vogal - assim ' +
        'aparecem o ã e o õ: "mãe", "mão", "não", "irmã" e "limões".',
    ),
  },
  {
    id: "br-letras-1", kind: "letters", einheiten: ["c", "p", "v"], titel: LETRAS,
    vorspann: fixo('Com o C, o P e o V: "casa", "pai", "vida", "porta", "caneta" e "vaca".'),
  },
  {
    id: "br-agudo", kind: "letters", einheiten: ["´"],
    titel: () => "O acento agudo: ´",
    vorspann: fixo(
      'O acento agudo também fica em uma tecla de acento: primeiro o acento, depois a vogal. Assim você digita á, é, í, ó e ú: ' +
        '"café", "avó", "está", "país" e "útil".',
    ),
  },
  {
    id: "br-circunflexo", kind: "letters", einheiten: ["^"],
    titel: () => "O acento circunflexo: ^",
    vorspann: fixo(
      'O acento circunflexo fica na mesma tecla do til, com Shift. Primeiro o acento, depois a vogal: â, ê e ô - "você", ' +
        '"três", "avô" e "câmera".',
    ),
  },
  {
    id: "br-letras-2", kind: "letters", einheiten: ["q", "h", "g"], titel: LETRAS,
    vorspann: fixo('Com o Q, o H e o G: "que", "quero", "hoje", "filho", "gato" e "água".'),
  },
  {
    id: "br-letras-3", kind: "letters", einheiten: ["b", "z", "x"], titel: LETRAS,
    vorspann: fixo('Com o B, o Z e o X: "bola", "zero", "luz", "azul", "xícara" e "caixa".'),
  },
  {
    id: "br-grave", kind: "letters", einheiten: ["`", "y", "w"],
    titel: (t) => `O acento grave e letras raras: ${t.map(kappe).join(" ")}`,
    vorspann: fixo(
      'O acento grave aparece quase só na crase: "à" e "àquela". O Y e o W aparecem em nomes e em palavras de outras línguas: ' +
        '"yoga", "kiwi" e "web".',
    ),
  },
  {
    id: "br-pontuacao-2", kind: "punctuation", einheiten: ["?", "!", "-", "\"", ":", ";", "'", "(", ")"],
    titel: (t) => `Mais pontuação: ${t.join(" ")}`,
    vorspann: fixo(
      'O ponto de interrogação fecha uma pergunta, o de exclamação uma exclamação. O hífen liga palavras: "guarda-chuva". Os ' +
        'parênteses fecham uma observação. Experimente: "Tudo bem?", "Que legal!" e "(nota)".',
    ),
  },
  {
    id: "br-numeros", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Fileira dos números",
    vorspann: fixo("Datas, horários, preços e resultados: agora vêm os números. Cada dedo sobe na sua coluna."),
  },
  {
    id: "br-simbolos-1", kind: "symbols", einheiten: ["%", "&", "/", "+", "*", "=", "_", "<", ">", "$"],
    titel: (t) => `Símbolos: ${t.join(" ")}`,
    vorspann: fixo("Esses sinais servem para contas, porcentagens e trabalho no computador. Aqui a precisão vale mais do que a velocidade."),
  },
  {
    id: "br-simbolos-2", kind: "symbols", einheiten: ["@", "#", "[", "]", "{", "}", "\\", "|"],
    titel: (t) => `Mais símbolos: ${t.join(" ")}`,
    vorspann: fixo("Sinais para endereços de e-mail, redes sociais e código de programação. São os mais difíceis, por isso vêm no fim."),
  },
  {
    id: "br-textos", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Textos",
    vorspann: fixo(
      "Agora o teclado inteiro é seu e você digita textos inteiros: do Amazonas ao Rio Grande do Sul, de Recife a São Paulo, " +
        "histórias sobre a escola, o esporte, os animais e um dia comum.",
    ),
  },
];

// ── Construir por teclado ────────────────────────────────────────────────────

/** Die Folge der Lektions-IDs (für Wächter und Handbuch). */
export const BR_LEKTIONS_IDS: readonly string[] = PLANOS.map((p) => p.id);

/** Der GESCHRIEBENE erste Absatz einer Lektion (für den Beispielwort-Wächter). */
export function brLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return PLANOS.find((p) => p.id === id)?.vorspann(tasten) ?? "";
}

const bauen = lektionenJeTastatur("br", ["br-abnt2"], PLANOS, griffSaetzeAusInfo((g: GriffInfo) => griffSatz(g)));

/** Die Lektionen des Weges „br" auf dieser Tastatur (gecacht). */
export function brLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  return bauen(layoutId);
}
