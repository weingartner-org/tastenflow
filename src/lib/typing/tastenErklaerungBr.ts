/**
 * Tastenflow - „Explorar teclas" / „Encontrar teclas" in der BRASILIANISCHEN
 * Bedienung (★ O-INHALT-BR, 29.10.2026, Glossar
 * `recherche-portugiesisch-brasilien-2026-10-25/GLOSSAR-pt-BR.md` §1, §2.1,
 * §2.8, §2.9, §2.12, §4; Tastenlage nach `layouts.ts` `BR_ABNT2`).
 *
 * Dieselbe Logik wie bei den anderen Sprachen: `erkundeTaste` in
 * `tastenErklaerung.ts` entscheidet weiter, WAS eine Taste ist (Sondertaste,
 * Zeichen, Kombination, dritter Layer, Totaste) und ob sie geschluckt wird.
 * Hier stehen nur die WÖRTER - dieselben Fächer wie in `tastenErklaerungCs.ts`,
 * Eintrag für Eintrag, NEU auf brasilianischem Portugiesisch geschrieben
 * (nicht übersetzt). Was der Verteiler liest, steht in {@link TASTEN_SATZ_BR}
 * (Form: `tastenErklaerungSatz.ts`).
 *
 * ── Glossar (§2.9) ──────────────────────────────────────────────────────────
 *  Brasilianische ABNT2-Tastaturen tragen die ENGLISCHEN Namen; übersetzt
 *  sind nur barra de espaço, seta para a esquerda / direita / cima / baixo,
 *  tecla Windows, tecla Menu (Regel 11). Im Satz mit Kopfwort „a tecla"
 *  („a tecla Shift"), in Kombinationen ohne („Ctrl + C"). Windows: Shift ·
 *  Caps Lock · Enter · Backspace · Delete · Tab · Ctrl · Alt · Alt Gr (mit
 *  Leerzeichen) · Esc · Home · End · Page Up · Page Down · Insert. Mac: Return
 *  · Delete (Rücktaste) · Fn + Delete · Control · Option · Command · Fn.
 *  Die deutsche Kappe („Strg", „Entf", „Pos 1") bleibt auf der
 *  Bildschirm-Tastatur - die Erklärung sagt dazu, was dort steht.
 *
 * ── Die Regeln der Sätze ────────────────────────────────────────────────────
 *  · Anrede **você**, Imperativ der 3. Person („Pressione", „Encontre"), nie
 *    tu-Formen, nie „te/teu" (Regel 1, Falle 16). Keine Maus-Wörter (nie
 *    „clique", „toque", „arraste").
 *  · Geschlecht nie raten (Regel 2): kein Adjektiv, kein Partizip über das
 *    Kind; Partizipien nur an der Sache („Pressionada sozinha" = die Taste).
 *  · Der erste Satz von `was` beginnt klein - die Taste ist sein Subjekt
 *    („vai para o próximo elemento").
 *  · Nur Bindestrich `-`; höchstens ein „!" je Meldung; kein Satz endet mit
 *    Zahl + Punkt (die Stimme könnte eine Ordnungszahl lesen).
 *  · ★★★ Auf `br-abnt2` (Glossar §2.9, Falle 10, 15): ç hat eine eigene Taste
 *    rechts vom L; Akut ´ ist eine Totaste rechts vom P (mit Shift der Gravis
 *    `), Tilde ~ rechts vom Ç (mit Shift der Zirkumflex ^); **Shift + 6 ist
 *    die Totaste Trema ¨**, kein Zeichen. Diese Hinweise stehen NUR, wenn die
 *    Tastatur `br-abnt2` ist ({@link brasileiro}).
 *  · Zeichennamen aus der EIGENEN Tabelle {@link NOMES_BR} (Glossar §2.8) -
 *    `spokenLabel(…, "br")` liefert heute noch Englisch.
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { unitKind } from "./letters";
import { BRASILIANISCHE_LAYOUT_IDS, layoutById, type LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";
import type { TastenErklaerungSatz } from "./tastenErklaerungSatz";

/* ══ Zeichennamen (Glossar §2.8) ════════════════════════════════════════════ */

/**
 * Die Namen der Zeichen, wie die Sprachausgabe sie sagt (Glossar §2.8,
 * Grundlage NVDA pt_BR `symbols.dic`, eigene Abweichungen [G] - am Gerät
 * ungemessen). Buchstaben mit Zeichen: „a com acento agudo" usw.
 */
const NOMES_BR: Readonly<Record<string, string>> = {
  " ": "espaço",
  ".": "ponto",
  ",": "vírgula",
  "-": "hífen",
  ":": "dois pontos",
  ";": "ponto e vírgula",
  "?": "ponto de interrogação",
  "!": "ponto de exclamação",
  "'": "apóstrofo",
  '"': "aspas",
  "“": "abre aspas",
  "”": "fecha aspas",
  "«": "abre aspas angulares",
  "»": "fecha aspas angulares",
  "(": "abre parênteses",
  ")": "fecha parênteses",
  "[": "abre colchetes",
  "]": "fecha colchetes",
  "{": "abre chaves",
  "}": "fecha chaves",
  "/": "barra",
  "\\": "barra invertida",
  "|": "barra vertical",
  "@": "arroba",
  "#": "cerquilha",
  "&": "e comercial",
  "%": "por cento",
  _: "sublinhado",
  "<": "menor que",
  ">": "maior que",
  "=": "igual",
  "+": "mais",
  "*": "asterisco",
  $: "cifrão",
  "€": "euro",
  "£": "libra",
  "§": "parágrafo",
  "°": "grau",
  "º": "ordinal masculino",
  "ª": "ordinal feminino",
  "²": "dois sobrescrito",
  "³": "três sobrescrito",
  "~": "til",
  "^": "circunflexo",
  "`": "acento grave",
  "´": "acento agudo",
  "¨": "trema",
  ˇ: "háček",
  ç: "cê-cedilha",
  á: "a com acento agudo",
  à: "a com acento grave",
  â: "a com circunflexo",
  ã: "a com til",
  ä: "a com trema",
  é: "e com acento agudo",
  è: "e com acento grave",
  ê: "e com circunflexo",
  ë: "e com trema",
  í: "i com acento agudo",
  ì: "i com acento grave",
  î: "i com circunflexo",
  ï: "i com trema",
  ó: "o com acento agudo",
  ò: "o com acento grave",
  ô: "o com circunflexo",
  õ: "o com til",
  ö: "o com trema",
  ú: "u com acento agudo",
  ù: "u com acento grave",
  û: "u com circunflexo",
  ü: "u com trema",
  ñ: "n com til",
  ß: "s alemão",
  ý: "y com acento agudo",
  ě: "e com háček",
  š: "s com háček",
  č: "c com háček",
  ř: "r com háček",
  ž: "z com háček",
  ď: "d com háček",
  ť: "t com háček",
  ň: "n com háček",
  ů: "u com anel",
};

/**
 * Der Name eines Zeichens ohne die Tabelle der Erklärungen: aus
 * {@link NOMES_BR}; ein Grossbuchstabe als „A maiúsculo" bzw. „e maiúsculo
 * com acento agudo" (Glossar §2.8: der Buchstabe zuerst); sonst das Zeichen
 * selbst (Ziffern, Buchstaben ohne Zeichen).
 */
function nomeBr(ch: string): string {
  const eigen = NOMES_BR[ch];
  if (eigen) return eigen;
  const klein = ch.toLocaleLowerCase("pt-BR");
  if (klein !== ch && ch === ch.toLocaleUpperCase("pt-BR")) {
    const nomeKlein = NOMES_BR[klein] ?? klein;
    const com = nomeKlein.indexOf(" com ");
    return com > 0 ? `${nomeKlein.slice(0, com)} maiúsculo${nomeKlein.slice(com)}` : `${nomeKlein} maiúsculo`;
  }
  return ch;
}

/**
 * ★ O-INHALT-BR (29.10.2026): der lesbare brasilianische Name einer
 * Lern-Einheit - für die Lehrkraft-Statistik, die Stand-Zeile und die
 * Tastenkarte, wie `unitLabelCs`. Buchstaben gross wie auf der Kappe („R",
 * „Ç"), Zeichen und Totasten über die eigene Tabelle {@link NOMES_BR}.
 */
export function unitLabelBr(unit: string): string {
  switch (unitKind(unit)) {
    case "shift":
      return "letras maiúsculas";
    case "ziffer":
      return `algarismo ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return zeichenNameBr(unit);
    default:
      // „ß".toUpperCase() ist „SS" - die Taste heisst dann nach dem Namen.
      if (unit === "ß") return "s alemão (ß)";
      return unit.toLocaleUpperCase("pt-BR") !== unit.toLocaleLowerCase("pt-BR")
        ? unit.toLocaleUpperCase("pt-BR")
        : zeichenNameBr(unit);
  }
}

/** Liegt diese Tastatur unter den brasilianischen (`br-abnt2`)? */
function brasileiro(layout: LayoutId): boolean {
  return BRASILIANISCHE_LAYOUT_IDS.has(layout);
}

/** Der Name einer Kappe nach „Alt Gr +" - lateinische Buchstaben gross, sonst wie auf der Kappe. */
function kappe(key: string): string {
  return /^[a-zç]$/.test(key) ? key.toLocaleUpperCase("pt-BR") : key;
}

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/**
 * Glossar §2.9: die deutsche Kappe („Strg", „Entf", „Pos 1") bleibt auf der
 * Bildschirm-Tastatur; „Explorar teclas" sagt dazu, was darauf steht.
 */
const KAPPE_ALEMA = (aufdruck: string) => `No teclado alemão, está escrito ${aufdruck} na tecla.`;

/**
 * Die häufigsten Zeichen des dritten Layers, gelesen aus der Tastatur selbst:
 * Arroba und Euro, wo beide auf Alt Gr liegen (deutsche Tastatur: Q und E);
 * auf der brasilianischen ABNT2 gibt es kein € und @ ist Shift + 2 - dort die
 * Barra (Alt Gr + Q, Glossar §2.9) und das Grad-Zeichen aus der Tabelle.
 */
function altGrBeispiele(layout: LayoutId, taste: string): string[] {
  const access = layoutById(layout).access;
  const at = access["@"];
  const euro = access["€"];
  if (at?.mod === "altgr" && euro?.mod === "altgr") {
    return [`Arroba: ${taste} + ${kappe(at.base)}. Euro: ${taste} + ${kappe(euro.base)}.`];
  }
  if (brasileiro(layout)) {
    const grau = access["°"];
    return [
      grau?.mod === "altgr"
        ? `Barra: ${taste} + Q. Grau: ${taste} + ${kappe(grau.base)}.`
        : `Barra: ${taste} + Q.`,
    ];
  }
  return [];
}

/** Brasilianische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteBr(
  id: string,
  plattform: Plattform,
  layout: LayoutId = "br-abnt2",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Option" : "Ctrl";
  const br = brasileiro(layout);
  switch (id) {
    case "tabulator":
      return {
        kurz: "Tab",
        name: "tecla Tab",
        was: [
          "vai para o próximo elemento, por exemplo um link, um campo ou um botão.",
          "Com a tecla Shift, volta para o anterior.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: "Return",
            name: "tecla Return",
            was: ["confirma e envia.", "Abre links e, no texto, começa uma nova linha."],
          }
        : {
            kurz: "Enter",
            name: "tecla Enter",
            was: ["confirma e envia.", "Abre links, aciona botões e, no texto, começa uma nova linha."],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "barra de espaço",
        was: ["coloca um espaço entre duas palavras.", "Também aciona botões e marca caixas de seleção."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: mac ? "tecla Delete" : "tecla Backspace",
        was: ["apaga o caractere à esquerda do cursor.", "Assim você corrige um erro de digitação."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "tecla Delete",
            was: [
              "apaga o caractere à direita do cursor.",
              "Se o seu teclado não tem essa tecla, pressione Fn e Delete juntas.",
            ],
          }
        : {
            kurz: "Delete",
            name: "tecla Delete",
            was: ["apaga o caractere à direita do cursor.", "Também exclui os arquivos selecionados.", KAPPE_ALEMA("Entf")],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "tecla Esc",
        was: [
          "cancela o que está acontecendo.",
          "Fecha menus, janelas e avisos.",
          "No Tastenflow, leva você de volta ao campo de digitação.",
        ],
      };
    case "umschalt":
      return {
        kurz: "Shift",
        name: "tecla Shift",
        was: br
          ? [
              "enquanto você segura a tecla, saem letras maiúsculas.",
              "Também dá o sinal de cima de uma tecla, por exemplo o ponto de exclamação.",
              // ★★★ Glossar §2.9 (Bauplan I9), Falle 10: Shift + 6 ist auf ABNT2 eine Totaste.
              "Shift + 6 é uma tecla de acento (trema): sozinha ela não escreve nada.",
            ]
          : [
              "enquanto você segura a tecla, saem letras maiúsculas.",
              "Também dá o sinal de cima de uma tecla, por exemplo o ponto de exclamação.",
            ],
      };
    case "feststell":
      return {
        kurz: "Caps Lock",
        name: "tecla Caps Lock",
        was: ["escreve tudo em letras maiúsculas, até você pressionar a tecla de novo."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "seta para a esquerda",
        was: ["move o cursor um caractere para a esquerda.", `Com a tecla ${pfeilWort}, pula uma palavra inteira.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "seta para a direita",
        was: ["move o cursor um caractere para a direita.", `Com a tecla ${pfeilWort}, pula uma palavra inteira.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "seta para cima",
        was: ["move o cursor uma linha para cima.", "Em listas e menus, vai para o item de cima.", `Com a tecla ${pfeilWort}, pula um parágrafo inteiro para cima.`],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "seta para baixo",
        was: ["move o cursor uma linha para baixo.", "Em listas e menus, vai para o item de baixo.", `Com a tecla ${pfeilWort}, pula um parágrafo inteiro para baixo.`],
      };
    case "pos1":
      return {
        kurz: "Home",
        name: "tecla Home",
        was: ["vai para o começo da linha.", "Numa página da internet, vai para o topo.", "Com a tecla Ctrl, vai para o começo do texto inteiro.", KAPPE_ALEMA("Pos 1")],
      };
    case "ende":
      return {
        kurz: "End",
        name: "tecla End",
        was: ["vai para o fim da linha.", "Numa página da internet, vai para o final.", "Com a tecla Ctrl, vai para o fim do texto inteiro."],
      };
    case "bild-auf":
      return {
        kurz: "Page Up",
        name: "tecla Page Up",
        was: ["sobe uma tela inteira."],
      };
    case "bild-ab":
      return {
        kurz: "Page Down",
        name: "tecla Page Down",
        was: ["desce uma tela inteira."],
      };
    case "einfg":
      return {
        kurz: "Insert",
        name: "tecla Insert",
        was: [
          "é a tecla do leitor de tela no NVDA e no JAWS.",
          "Muitos comandos do leitor de tela começam com ela.",
          KAPPE_ALEMA("Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "tecla Ctrl",
        was: [
          "serve para atalhos de teclado.",
          "Ctrl + C copia, Ctrl + V cola, Ctrl + Z desfaz.",
          "Pressionada sozinha, faz a voz parar na hora.",
          KAPPE_ALEMA("Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "tecla Alt",
        was: [
          "serve para atalhos de teclado.",
          "Alt + Tab troca de janela.",
          "No Tastenflow, Alt + H abre a ajuda.",
        ],
      };
    case "altgr":
      // Ohne Kurzform: „Alt Gr, tecla Alt Gr" sagte dasselbe zweimal.
      return {
        kurz: null,
        name: "tecla Alt Gr",
        was: [
          br
            ? "escreve o terceiro sinal de uma tecla, por exemplo a barra ou o grau."
            : "escreve o terceiro sinal de uma tecla, por exemplo a arroba ou o euro.",
          ...altGrBeispiele(layout, "Alt Gr"),
        ],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "tecla Windows",
        was: [
          "abre o menu Iniciar.",
          "Pressione de novo e o menu fecha.",
          "Com outras teclas, faz outras coisas, por exemplo Win + D mostra a área de trabalho.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "Cmd",
        name: "tecla Command",
        was: ["serve para atalhos de teclado.", "Cmd + C copia, Cmd + V cola, Cmd + Z desfaz."],
      };
    case "wahltaste":
      return {
        kurz: "Option",
        name: "tecla Option",
        was: ["escreve outros sinais, por exemplo símbolos que não estão nas teclas.", "Com as setas, pula palavras inteiras."],
      };
    case "ctrl":
      return {
        kurz: "Control",
        name: "tecla Control",
        was: ["serve, no Mac, para atalhos de teclado.", "Pressionada sozinha, faz o VoiceOver parar de falar."],
      };
    case "fn":
      return {
        kurz: "Fn",
        name: "tecla Fn",
        was: ["dá uma segunda função a outras teclas, por exemplo mudar o volume."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz,
 * wie sie auf der Kappe steht („Ctrl + Home", „Shift + Tab").
 */
export const TASTE_KURZ_BR: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Return",
  leertaste: "Barra de espaço",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "Seta para a esquerda",
  "pfeil-rechts": "Seta para a direita",
  "pfeil-auf": "Seta para cima",
  "pfeil-ab": "Seta para baixo",
  pos1: "Home",
  ende: "End",
  "bild-auf": "Page Up",
  "bild-ab": "Page Down",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "Alt Gr",
  "windows-taste": "Win",
  befehlstaste: "Cmd",
  wahltaste: "Option",
  ctrl: "Control",
  fn: "Fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_BR: Readonly<Record<string, readonly string[]>> = {
  F1: ["em muitos programas, abre a ajuda."],
  F2: ["renomeia o arquivo selecionado."],
  F3: ["abre a pesquisa."],
  F4: ["junto com a tecla Alt, fecha a janela."],
  F5: ["atualiza a página da internet.", "Aqui não acontece nada, pode continuar explorando."],
  F6: ["vai para a barra de endereços do navegador."],
  F7: ["no Word, verifica a ortografia."],
  F10: ["em muitos programas, vai para a barra de menus."],
  F11: ["liga e desliga a tela cheia no navegador.", "No notebook, muitas vezes junto com a tecla Fn."],
  F12: ["no Word, abre a janela Salvar como."],
};

const APARECE_BR = "O sinal só aparece com a próxima letra.";

/** Brasilianisch zu `nachKey` - F-Tasten, Num Lock, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyBr(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "br-abnt2",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? [
            "tem uma tarefa própria em alguns programas.",
            "No Mac, essas teclas muitas vezes mudam o brilho e o volume.",
          ]
        : (F_TASTEN_WINDOWS_BR[key] ?? ["tem uma tarefa própria em alguns programas."]);
    return { kurz: key, name: "tecla de função", was };
  }
  switch (key) {
    case "Home":
      return sondertasteBr("pos1", "windows", layout);
    case "End":
      return sondertasteBr("ende", "windows", layout);
    case "PageUp":
      return sondertasteBr("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteBr("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteBr("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "tecla Num Lock",
        was: ["liga e desliga os números do teclado numérico."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "tecla 5 do teclado numérico",
        was: ["escreve 5 quando o Num Lock está ligado.", "Agora o Num Lock está desligado, por isso ela não faz nada."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "tecla Menu",
        was: ["abre um menu com comandos para o lugar onde você está.", "Shift + F10 faz o mesmo."],
      };
    case "PrintScreen":
      return { kurz: null, name: "tecla Print Screen", was: ["tira uma foto da tela.", "No Windows, muitas vezes abre a ferramenta de captura.", "Esc fecha a ferramenta."] };
    case "ScrollLock":
      return { kurz: null, name: "tecla Scroll Lock", was: ["hoje em dia quase não se usa."] };
    case "Pause":
      return { kurz: null, name: "tecla Pause", was: ["hoje em dia quase não se usa."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "tecla de aumentar o volume", was: ["deixa o som mais alto."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "tecla de diminuir o volume", was: ["deixa o som mais baixo."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "tecla de silenciar", was: ["desliga o som e liga de novo."] };
    case "Fn":
      return sondertasteBr("fn", plattform, layout);
    case "Dead":
      // ★ Glossar §2.9: auf `br-abnt2` sind Akut (rechts vom P, mit Shift Gravis), Tilde (rechts vom Ç, mit Shift
      // Zirkumflex) und Shift + 6 (Trema) Totasten. `TOTASTEN` in `tastenErklaerung.ts` kennt `br-abnt2` (noch)
      // nicht - darum kommt jede brasilianische Totaste hierher und der Satz nennt alle drei Tasten.
      return {
        kurz: null,
        name: "tecla de acento",
        was: brasileiro(layout)
          ? [
              "coloca um acento na próxima letra: primeiro o acento agudo, depois o a, e aparece á.",
              "No teclado brasileiro, o acento agudo fica à direita do P, o til à direita do Ç, e Shift + 6 é o trema.",
              APARECE_BR,
            ]
          : ["coloca um acento na próxima letra, por exemplo o acento agudo no e: é.", APARECE_BR],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

/**
 * Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle.
 * Namen wie Glossar §2.1/§2.8; der Gravis einmal mit der Crase erklärt
 * (Glossar §2.1: Kinder kennen „crase" für `à` aus der Schule).
 */
export const AKZENTE_BR: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "acento circunflexo",
    was: ["coloca um acento circunflexo na próxima letra, por exemplo ê.", APARECE_BR],
  },
  akut: {
    name: "acento agudo",
    was: ["coloca um acento agudo na próxima letra, por exemplo á.", APARECE_BR],
  },
  gravis: {
    name: "acento grave",
    was: ["coloca um acento grave na próxima letra, por exemplo à - é o acento da crase.", APARECE_BR],
  },
  trema: {
    name: "trema",
    was: ["coloca dois pontinhos na próxima letra, por exemplo ü.", APARECE_BR],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMACAO_BR = ["serve para programar."] as const;

/** Wie ein Buchstabe mit Akzent entsteht - „Digite primeiro o acento agudo e depois o a." */
const DIGITE = (acento: string, letra: string) => `Digite primeiro ${acento} e depois o ${letra}.`;

/** Für die tschechischen Buchstaben (dieselben Schlüssel wie `ZEICHEN_CS`) - ohne Tastenweg, den gibt es auf ABNT2 nicht. */
const TCHECO = (palavra: string) => `é uma letra do tcheco, por exemplo na palavra ${palavra}.`;

/**
 * Dieselben Zeichen wie `ZEICHEN_CS` (Satz- und Sonderzeichen, die Ziffern,
 * die tschechischen Buchstaben), dazu die portugiesischen Buchstaben mit
 * Zeichen: ein Beispielwort, wie sie entstehen, und - wo es eins gibt - das
 * Wortpaar, das ohne Zeichen ein ANDERES Wort ergibt (ohne zu werten). Der
 * Name kommt aus {@link NOMES_BR}; `name` steht nur bei den Ziffern.
 */
export const ZEICHEN_BR: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["termina uma frase."] },
  ",": { was: ["separa as partes de uma frase."] },
  "?": { was: ["termina uma pergunta."] },
  "!": { was: ["termina uma exclamação."] },
  ":": { was: ["anuncia alguma coisa, por exemplo uma lista."] },
  ";": { was: ["separa duas partes de uma frase com mais força que a vírgula."] },
  "-": { was: ["liga palavras, por exemplo em guarda-chuva.", "Na conta, quer dizer menos."] },
  "@": { was: ["aparece em todo endereço de e-mail."] },
  "+": { was: ["na conta, quer dizer mais.", "Num atalho de teclado, quer dizer: pressione junto."] },
  "*": { was: ["no computador, quer dizer vezes."] },
  "/": { was: ["no computador, quer dizer dividido por.", "Também aparece em endereços da internet."] },
  "=": { was: ["vem antes do resultado de uma conta."] },
  "'": { was: ["aparece em poucas palavras do português, por exemplo em copo-d'água."] },
  '"': { was: ["fica antes e depois de uma citação, por exemplo do que alguém disse."] },
  "«": { was: ["abrem uma citação em textos de Portugal e de outros países."] },
  "»": { was: ["fecham uma citação em textos de Portugal e de outros países."] },
  "(": { was: ["abre uma explicação no meio da frase."] },
  ")": { was: ["fecha uma explicação no meio da frase."] },
  "%": { was: ["quer dizer por cem, por exemplo 50%."] },
  "&": { was: ["quer dizer e."] },
  "#": { was: ["marca um número, por exemplo #1, e serve para hashtags."] },
  "€": { was: ["é o símbolo da moeda euro."] },
  $: { was: ["é o símbolo do dólar e também aparece no real: R$."] },
  "£": { was: ["é o símbolo da libra."] },
  "§": { was: ["com um número, marca um parágrafo de uma lei."] },
  "°": { was: ["marca graus, por exemplo na temperatura."] },
  "º": { was: ["marca os números ordinais, por exemplo em 3º ano."] },
  "ª": { was: ["marca os números ordinais, por exemplo em 2ª chamada."] },
  "<": { was: ["compara dois números: o da esquerda é menor."] },
  ">": { was: ["compara dois números: o da esquerda é maior."] },
  _: { was: ["aparece muito em endereços de e-mail e em nomes de arquivos."] },
  "^": { was: ["coloca um acento circunflexo numa vogal, por exemplo ê.", "Na conta, quer dizer elevado a, por exemplo dois elevado ao cubo."] },
  "²": { was: ["serve para áreas, por exemplo metros quadrados."] },
  "³": { was: ["serve para volumes, por exemplo metros cúbicos."] },
  "[": { was: PROGRAMACAO_BR },
  "]": { was: PROGRAMACAO_BR },
  "{": { was: PROGRAMACAO_BR },
  "}": { was: PROGRAMACAO_BR },
  "\\": { was: PROGRAMACAO_BR },
  "|": { was: PROGRAMACAO_BR },
  "~": { was: ["coloca um til numa vogal, por exemplo ã.", "Sozinho, serve para programar."] },
  "´": { was: ["coloca um acento agudo numa vogal, por exemplo á."] },
  ˇ: { was: ["coloca um háček numa letra, por exemplo nas letras do tcheco."] },
  "`": { was: ["coloca um acento grave numa letra, por exemplo à."] },
  "¨": { was: ["coloca um trema numa letra, por exemplo ü."] },
  // ★ die Ziffern: ohne Eintrag sagte „Explorar teclas" nur „2." - mit Namen („algarismo 2") und dem Ort.
  ...Object.fromEntries(
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((d) => [
      d,
      {
        name: `algarismo ${d}`,
        was:
          d === "6"
            ? [
                "fica na fileira dos números.",
                // ★★★ Glossar §2.9 (Bauplan I9): auf ABNT2 gibt Shift + 6 das Trema, kein Zeichen.
                "No teclado brasileiro, Shift + 6 é uma tecla de acento (trema): sozinha ela não escreve nada.",
              ]
            : ["fica na fileira dos números."],
      },
    ]),
  ),
  // ★★★ die portugiesischen Buchstaben mit Zeichen (Glossar §2.1, §2.8, §2.9).
  ç: { was: ["é o cê-cedilha, por exemplo em maçã e criança.", "No teclado brasileiro, tem uma tecla própria à direita do L."] },
  á: { was: ["é uma letra do português, por exemplo em já e água.", DIGITE("o acento agudo", "a"), "Sem o acento, vira outra palavra: sábia e sabia."] },
  é: { was: ["é uma letra do português, por exemplo em café e pé.", DIGITE("o acento agudo", "e")] },
  í: { was: ["é uma letra do português, por exemplo em país e aí.", DIGITE("o acento agudo", "i"), "Sem o acento, vira outra palavra: país e pais."] },
  ó: { was: ["é uma letra do português, por exemplo em avó e só.", DIGITE("o acento agudo", "o"), "Com o circunflexo, vira outra palavra: avó e avô."] },
  ú: { was: ["é uma letra do português, por exemplo em baú e saúde.", DIGITE("o acento agudo", "u")] },
  ã: { was: ["é uma letra do português, por exemplo em mão e maçã.", DIGITE("o til", "a")] },
  õ: { was: ["é uma letra do português, por exemplo em limões e põe.", DIGITE("o til", "o")] },
  â: { was: ["é uma letra do português, por exemplo em câmera e lâmpada.", DIGITE("o acento circunflexo", "a")] },
  ê: { was: ["é uma letra do português, por exemplo em você e três.", DIGITE("o acento circunflexo", "e")] },
  ô: { was: ["é uma letra do português, por exemplo em ônibus e avô.", DIGITE("o acento circunflexo", "o")] },
  à: { was: ["é a crase, por exemplo em vou à escola.", DIGITE("o acento grave", "a")] },
  ü: { was: ["aparece em nomes de outros países, por exemplo Müller.", DIGITE("o trema", "u")] },
  // Die tschechischen Buchstaben (dieselben Schlüssel wie `ZEICHEN_CS`).
  ě: { was: [TCHECO("pět")] },
  š: { was: [TCHECO("škola")] },
  č: { was: [TCHECO("čaj")] },
  ř: { was: [TCHECO("řeka")] },
  ž: { was: [TCHECO("žába")] },
  ý: { was: [TCHECO("mýdlo")] },
  ů: { was: [TCHECO("dům")] },
  ď: { was: [TCHECO("loď")] },
  ť: { was: [TCHECO("chuť")] },
  ň: { was: [TCHECO("píseň")] },
};

/** Der brasilianische Name eines Zeichens - aus der Tabelle der Erklärungen oder aus {@link NOMES_BR}. */
export function zeichenNameBr(ch: string): string {
  return ZEICHEN_BR[ch]?.name ?? nomeBr(ch);
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - brasilianisch, Programmnamen wie bei Microsoft pt-BR. */
export const ORT_BR: Readonly<Record<string, string>> = {
  explorer: "no Explorador de Arquivos",
  finder: "no Finder",
  word: "no Word",
  excel: "no Excel",
  browser: "no navegador",
  teams: "no Teams",
  powerpoint: "no PowerPoint",
  outlook: "no Outlook",
  bedienungshilfen: "no leitor de tela",
};

/** Die kleine eigene Liste der deutschen Datei, brasilianisch. */
export const EIGENE_KOMBINATIONEN_BR: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "volta para o elemento anterior." },
    { keys: "Strg+P", was: "abre a janela de impressão." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "volta para o elemento anterior." },
    { keys: "Cmd+P", was: "abre a janela de impressão." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - brasilianisch, nach der Kennung der Wirkung im
 * Kürzel-Katalog von »Im Griff« (`lib/computer/kuerzelWirkung.ts`, dort nur
 * gelesen). Infinitiv wie in den Menüs von Windows und Office pt-BR
 * („Copiar", „Colar", „Salvar como", Glossar Regel 1). Keine Wirkung endet
 * mit einer Zahl.
 */
export function wirkungBr(id: string, _plattform: Plattform): string | null {
  return WIRKUNG_BR[id] ?? null;
}

const WIRKUNG_BR: Readonly<Record<string, string>> = {
  kopieren: "Copiar",
  einfuegen: "Colar",
  ausschneiden: "Recortar",
  rueckgaengig: "Desfazer",
  wiederherstellen: "Refazer o que foi desfeito",
  "alles-markieren": "Selecionar tudo",
  "markieren-zeichen": "Selecionar caractere por caractere",
  "markieren-wort": "Selecionar palavra por palavra",
  "spalte-markieren": "Selecionar a coluna inteira",
  "zeile-markieren": "Selecionar a linha inteira",
  oeffnen: "Abrir",
  umbenennen: "Renomear",
  "neuer-ordner": "Criar uma pasta nova",
  papierkorb: "Mover para a Lixeira",
  duplizieren: "Criar uma segunda cópia do mesmo arquivo",
  "ebene-hoeher": "Subir um nível",
  adressleiste: "Ir para a barra de endereços",
  eigenschaften: "Mostrar as propriedades",
  uebersicht: "Mostrar a visualização, ou seja, ver o arquivo sem abrir",
  bewegen: "Mover o arquivo para onde ele deve ficar (ele sai do lugar antigo)",
  "ansicht-details": "Mudar para o modo de exibição Detalhes",
  speichern: "Salvar",
  "speichern-unter": "Salvar como, com outro nome ou em outro lugar",
  fett: "Negrito",
  kursiv: "Itálico",
  unterstreichen: "Sublinhado",
  ueberschrift1: "Aplicar o estilo Título 1 ao título principal",
  ueberschrift2: "Aplicar o estilo Título 2 a um subtítulo",
  "standard-format": "Aplicar o estilo Normal",
  links: "Alinhar à esquerda",
  zentriert: "Centralizar",
  zeilenumbruch: "Começar uma nova linha no mesmo parágrafo",
  rechtschreibung: "Verificar a ortografia",
  fensterbereiche: "Passar pelas partes da janela",
  suchen: "Localizar",
  ersetzen: "Localizar e substituir",
  "gehe-zu-zelle": "Ir para a célula escolhida",
  "zelle-bearbeiten": "Continuar digitando na célula",
  "zelle-formatieren": "Abrir a janela Formatar Células",
  "zum-rand": "Ir até a borda dos dados",
  autosumme: "Inserir a AutoSoma",
  "ausfuellen-unten": "Preencher para baixo",
  "ausfuellen-rechts": "Preencher à direita",
  "absoluter-bezug": "Fixar a referência (referência absoluta com cifrão)",
  datum: "Inserir a data de hoje",
  uhrzeit: "Inserir a hora atual",
  kommentar: "Inserir um comentário",
  autofilter: "Ligar ou desligar o filtro automático",
  blattwechsel: "Ir para outra planilha",
  "neues-blatt": "Inserir uma planilha nova",
  "neu-laden": "Atualizar a página",
  lesezeichen: "Adicionar aos favoritos",
  verlauf: "Abrir o histórico",
  senden: "Enviar a mensagem",
  "nachricht-loeschen": "Excluir a mensagem",
  "sr-stopp": "Parar a leitura",
};

/** „a, b e c" - die brasilianische Aufzählung (kein Komma vor „e", Glossar §2.10, gemessen `ListFormat`). */
export function aufzaehlungBr(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} e ${teile[teile.length - 1]}`;
}

/**
 * Die festen Wörter des Erkundens, brasilianisch. `mit` steht vor dem Weg
 * über den dritten Layer („Com Alt Gr + Q.").
 */
export const ERKUNDEN_WOERTER_BR = {
  kombination: "atalho de teclado",
  kombiUnbekannt: "o que ele faz depende do programa.",
  mit: "Com",
  akzentTaste: "tecla de acento",
  unbekannt: "Não reconheço esta tecla.",
  taste: (key: string) => `Tecla ${key}`,
} as const;

/* ══ „Encontrar teclas" ═════════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) brasilianisch - WAS
 * geschieht, entscheidet weiter `suchSchritt`; hier wird nur gesagt.
 * Portugiesisch beugt die Tastennamen nicht; die Taste steht immer mit
 * Artikel („a tecla Tab", „a seta para a esquerda", „a barra de espaço").
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TasteBr {
  /** Im Satz, mit Artikel - „a tecla Tab", „a seta para a esquerda". */
  nome: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur Caps Lock). */
  achtung?: string;
}

/** Eine Taste mit ihrer Kappe - „a tecla" davor (Glossar Regel 11). */
function tecla(kappeName: string, lage: string, achtung?: string): TasteBr {
  const e = { nome: `a tecla ${kappeName}`, lage };
  return achtung ? { ...e, achtung } : e;
}

const SEIS_TECLAS_BR = "No bloco de seis teclas acima das setas";
const SETAS_BR = "Embaixo, à direita, entre as teclas de seta";
const NOTEBOOK_FN_BR = "No notebook, muitas vezes com a tecla Fn.";

/** Die Tasten der Suchrunde, brasilianisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_BR: Readonly<Record<string, TasteBr | ((plattform: Plattform) => TasteBr)>> = {
  tabulator: tecla("Tab", "Dedo mínimo esquerdo: uma fileira acima, na borda."),
  "pfeil-links": { nome: "a seta para a esquerda", lage: `${SETAS_BR}: a da esquerda.` },
  "pfeil-rechts": { nome: "a seta para a direita", lage: `${SETAS_BR}: a da direita.` },
  "pfeil-auf": { nome: "a seta para cima", lage: `${SETAS_BR}: a de cima.` },
  "pfeil-ab": { nome: "a seta para baixo", lage: `${SETAS_BR}: embaixo da seta para cima.` },
  pos1: tecla("Home", `${SEIS_TECLAS_BR}, em cima, no meio. ${NOTEBOOK_FN_BR}`),
  ende: tecla("End", `${SEIS_TECLAS_BR}, embaixo, no meio. ${NOTEBOOK_FN_BR}`),
  "bild-auf": tecla("Page Up", `${SEIS_TECLAS_BR}, em cima, à direita. ${NOTEBOOK_FN_BR}`),
  "bild-ab": tecla("Page Down", `${SEIS_TECLAS_BR}, embaixo, à direita. ${NOTEBOOK_FN_BR}`),
  leertaste: { nome: "a barra de espaço", lage: "A tecla comprida embaixo dos seus polegares." },
  eingabe: tecla("Enter", "Mão direita, na borda: a tecla grande."),
  zeilenschalter: tecla("Return", "Mão direita, na borda: a tecla grande."),
  loeschtaste: (plattform) =>
    tecla(plattform === "macos" ? "Delete" : "Backspace", "Mão direita, na borda, duas fileiras acima."),
  entf: (plattform) =>
    plattform === "macos"
      ? tecla("Delete", "Só nos teclados grandes, ao lado da tecla Return. Nos outros, Fn e Delete.")
      : tecla("Delete", `${SEIS_TECLAS_BR}, embaixo, à esquerda. No notebook, em cima, à direita.`),
  esc: tecla("Esc", "No canto superior esquerdo."),
  umschalt: tecla("Shift", "São duas: à esquerda e à direita, na fileira de baixo."),
  feststell: tecla(
    "Caps Lock",
    "Dedo mínimo esquerdo: um passo para a esquerda.",
    "Agora só saem letras maiúsculas? Pressione a tecla de novo.",
  ),
  strg: tecla("Ctrl", "No canto inferior esquerdo."),
  alt: tecla("Alt", "Embaixo, à esquerda da barra de espaço."),
  altgr: tecla("Alt Gr", "Embaixo, à direita da barra de espaço."),
  "windows-taste": tecla("Windows", "Embaixo, à esquerda, entre as teclas Ctrl e Alt."),
  einfg: tecla(
    "Insert",
    `${SEIS_TECLAS_BR}, em cima, à esquerda, acima da tecla Delete. Muitos notebooks não têm essa tecla.`,
  ),
  befehlstaste: tecla("Command", "Embaixo, à esquerda, logo ao lado da barra de espaço."),
  wahltaste: tecla("Option", "Embaixo, à esquerda, a terceira tecla a partir da borda."),
  ctrl: tecla("Control", "Embaixo, à esquerda, a segunda tecla a partir da borda."),
  fn: tecla("Fn", "Embaixo, à esquerda, a primeira tecla do canto. No MacBook, está escrito fn nela."),
};

function tasteBr(t: TastenName, plattform: Plattform): TasteBr {
  const e = TASTEN_BR[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne brasilianischen Eintrag - „a tecla" davor.
  return e ?? tecla(t.kurz ?? t.name, "");
}

/** „a tecla Tab", „a seta para a esquerda" - wie eine Taste im Satz heisst (Portugiesisch beugt nicht). */
export function tastenNennungBr(t: TastenName, plattform: Plattform): string {
  return tasteBr(t, plattform).nome;
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLageBr(t: TastenName, plattform: Plattform): string {
  return tasteBr(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Encontre a tecla Tab. Dedo mínimo esquerdo: ..." */
export function ansageSuchauftragBr(t: TastenName, plattform: Plattform): string {
  const e = tasteBr(t, plattform);
  return e.lage ? `Encontre ${e.nome}. ${e.lage}` : `Encontre ${e.nome}.`;
}

/** Erster Treffer - erst die Wiederholung zählt („Achou!" ist ungegendert, Glossar §2.12). */
export function ansageGefundenBr(t: TastenName, plattform: Plattform): string {
  return `Achou! Pressione outra tecla e depois ${tastenNennungBr(t, plattform)} de novo.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Caps Lock). */
export function ansageBestaetigtBr(t: TastenName, plattform: Plattform): string {
  const e = tasteBr(t, plattform);
  return e.achtung ? `Certo! ${e.achtung}` : "Certo!";
}

/** Eine Taste, die hier nicht geübt wird. */
export const ANSAGE_UNBEKANNT_BR = "Esta tecla não faz parte deste exercício.";

/** „Teclas encontradas: 20/20. Muito bem." - die Zahl nach dem Doppelpunkt, nie am Satzende; ohne „!" (das „Certo!" davor hat es schon). */
export function alleGefundenBr(anzahl: number): string {
  return `Teclas encontradas: ${anzahl}/${anzahl}. Muito bem.`;
}

/**
 * Der Satz zu einem Schritt der Suchrunde - brasilianisch. `art` und
 * `naechste` kommen unverändert aus `suchSchritt`; nur die Wörter sind neu.
 */
export function suchSatzBr(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteBr(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_BR} Encontre ${g.nome}.`;
      return `Esta foi ${tastenNennungBr(taste, plattform)}. Encontre ${g.nome}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenBr(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtBr(gesucht, plattform)} ${alleGefundenBr(suchbar.length)}`;
    case "weiter":
      return `${ansageBestaetigtBr(gesucht, plattform)} ${ansageSuchauftragBr(suchbar[index + 1]!, plattform)}`;
  }
}

/* ══ Für den Verteiler ══════════════════════════════════════════════════════ */

/** Alles, was „Explorar teclas" in dieser Sprache sagt (Form: `tastenErklaerungSatz.ts`). */
export const TASTEN_SATZ_BR: TastenErklaerungSatz = {
  sondertaste: sondertasteBr,
  nachKey: nachKeyBr,
  tasteKurz: TASTE_KURZ_BR,
  zeichen: ZEICHEN_BR,
  zeichenName: zeichenNameBr,
  akzente: AKZENTE_BR,
  erkundenWoerter: ERKUNDEN_WOERTER_BR,
  eigeneKombinationen: EIGENE_KOMBINATIONEN_BR,
  wirkung: wirkungBr,
  ort: ORT_BR,
  aufzaehlung: aufzaehlungBr,
  aufdruckGross: (key) => key.toLocaleUpperCase("pt-BR"),
};
