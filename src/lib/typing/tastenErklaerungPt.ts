/**
 * Tastenflow - „Explorar as teclas" / „Encontrar as teclas" in der PORTUGIESISCHEN Bedienung (Portugal, Weg und Bedienung „pt")
 * (★ O-INHALT-PT, 29.10.2026, Glossar `recherche-portugiesisch-2026-10-25/GLOSSAR-pt.md` §1, §2.1, §2.8, §2.9, §2.10, §4;
 * Tastenlage nach `layouts.ts` `PT`).
 *
 * Bis 29.10.2026 ein Einhängepunkt (G3c-VERTEILER, 25.10.2026), der die ENGLISCHEN Teile weiterreichte. Jetzt eine eigene Fassung
 * nach dem Vorbild `tastenErklaerungCs.ts`: dieselbe Logik, dieselben Fächer Eintrag für Eintrag, die Wörter NEU auf
 * europäischem Portugiesisch geschrieben (nicht übersetzt). Was eine Taste IST (Sondertaste, Zeichen, Kombination, dritter Layer,
 * Totaste) und ob sie geschluckt wird, entscheidet weiter `erkundeTaste` in `tastenErklaerung.ts`; der Verteiler liest diese Datei
 * über {@link TASTEN_SATZ_PT} (Form: `tastenErklaerungSatz.ts`), die Bauteile `LetterMap.tsx`, `PupilStatsPanel.tsx`,
 * `TastenflowReiter.tsx` über {@link unitLabelPt} und `TastenErkunden.tsx` über {@link suchSatzPt}.
 *
 * ── Glossar (§2.9) ──────────────────────────────────────────────────────────
 *  Portugiesische Tastaturen tragen ENGLISCHE Namen; übersetzt sind nur die barra de espaço, die tecla de retrocesso
 *  (Kappe Backspace), die tecla de tabulação (Kappe Tab), die setas und die tecla Windows. Im Satz immer mit dem Kopfwort
 *  „tecla" (Regel 11): „a tecla Shift", „com a tecla Ctrl"; die Leertaste ist „a barra de espaço" (weiblich, ohne „tecla").
 *  Windows: Shift · Caps Lock · Enter · Backspace · Delete · Tab · Ctrl · Alt · Alt Gr · Esc · Home · End · Page Up · Page Down
 *  · Insert · tecla Windows · tecla de menu. Mac (Apple pt-PT): Enter · Apagar (Rücktaste) · Fn + Apagar (Entf) · Controlo ·
 *  Opção · Comando · Fn. Pfeile: seta para a esquerda / para a direita / para cima / para baixo.
 *  Die deutsche Kappe („Strg", „Entf", „Pos 1", „Einfg") bleibt auf der Bildschirm-Tastatur - die Erklärung sagt dazu, was
 *  dort steht: „No teclado alemão, está escrito Strg."
 *
 * ── Die Regeln der Sätze ────────────────────────────────────────────────────
 *  · Ein Kind ist gemeint: **tu** mit Verb der 2. Person („Prime", „Procura"), Pronomen hinter dem Verb („fecha-se"),
 *    „estar a + Infinitiv", nie Gerundium, nie „você", die Wörter Portugals (ecrã, ficheiro, portátil - nie tela, arquivo, notebook).
 *  · Keine Maus-Wörter (nie „clica", „toca", „arrasta") - „prime", „seleciona", „escolhe".
 *  · Geschlecht nie raten: kein Adjektiv und kein Partizip am Kind; Verben sind ohne Geschlecht („Premiste a tecla Alt").
 *  · Nur Bindestrich `-`; höchstens ein „!" je Meldung; „de" statt Schrägstrich („Teclas encontradas: 20 de 20").
 *  · Der erste Satz von `was` beginnt klein - die Taste ist sein Subjekt („passa para o elemento seguinte").
 *  · ★★★ Landesform: Die Hinweise auf die Lage der Totasten (Akut ´ rechts neben +, Tilde ~ rechts neben º, Zirkumflex =
 *    Shift + Tilde, Gravis = Shift + Akut) und „Shift + 6 ist &" stehen in den Sondertasten NUR für die Tastatur `pt`
 *    (Glossar §2.9, §4 Falle 9); in der festen Zeichentabelle mit „No teclado português," davor - so stimmt der Satz auch
 *    auf jeder anderen Tastatur. Nie der brasilianische Hinweis („Shift + 6 ist eine Akzent-Taste").
 *  · Zeichennamen NICHT über `spokenLabel(…, "pt")` (das nannte bis hierher die englischen), sondern über die eigene
 *    Tabelle {@link NOMES_PT} (Glossar §2.8, so weit es geht wie NVDA pt_PT `symbols.dic`).
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { unitKind } from "./letters";
import type { Lernweg } from "./lernweg";
import { PORTUGIESISCHE_LAYOUT_IDS, layoutById, type LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";
import type { TastenErklaerungSatz } from "./tastenErklaerungSatz";

/* ══ Zeichennamen ═══════════════════════════════════════════════════════════ */

/**
 * Die portugiesischen Namen der Zeichen (Glossar §2.8) - für „Explorar as teclas", die Statistik ({@link unitLabelPt}) und
 * {@link zeichenNamePt}. Die Totasten heissen wie beim Drücken („acento agudo", „til"), weil sie auf der Tastatur `pt` genau
 * das sind. Buchstaben mit Zeichen wie im Glossar („a com til", „c com cedilha"); die der anderen Tastaturen dazu.
 */
const NOMES_PT: Readonly<Record<string, string>> = {
  " ": "espaço",
  "\n": "Enter",
  "\t": "tabulação",
  ".": "ponto", ",": "vírgula", ";": "ponto e vírgula", ":": "dois pontos",
  "?": "ponto de interrogação", "!": "ponto de exclamação", "-": "hífen", "'": "apóstrofo",
  "\"": "aspas", "„": "aspas baixas", "“": "abrir aspas", "”": "fechar aspas", "‘": "abrir aspas simples", "’": "fechar aspas simples",
  "«": "abrir aspas duplas", "»": "fechar aspas duplas",
  "(": "abrir parêntesis", ")": "fechar parêntesis",
  "[": "abrir parênteses retos", "]": "fechar parênteses retos",
  "{": "abrir chavetas", "}": "fechar chavetas",
  "/": "barra", "\\": "barra invertida", "|": "barra vertical",
  "@": "arroba", "#": "cardinal", "&": "e comercial", "%": "por cento", "_": "sublinhado",
  "<": "menor que", ">": "maior que", "=": "igual", "+": "mais", "*": "asterisco",
  "€": "euro", $: "cifrão", "£": "libra", "§": "parágrafo", "°": "graus",
  "º": "ordinal masculino", "ª": "ordinal feminino",
  // Die Totasten (Glossar §2.8: Ansage beim Drücken).
  "^": "acento circunflexo", "~": "til", "`": "acento grave", "´": "acento agudo", "¨": "trema", "¸": "cedilha", "ˇ": "caron",
  "÷": "a dividir por", "×": "vezes", "¤": "sinal de moeda", "½": "um meio", "²": "ao quadrado", "³": "ao cubo",
  "µ": "micro", "¿": "ponto de interrogação invertido", "¡": "ponto de exclamação invertido", "·": "ponto central",
  "₺": "lira turca", "…": "reticências",
  // ★★★ die portugiesischen Buchstaben mit Zeichen (Glossar §2.8): das Kind muss e, é und ê unterscheiden.
  á: "a com acento agudo", à: "a com acento grave", â: "a com acento circunflexo", ã: "a com til",
  é: "e com acento agudo", ê: "e com acento circunflexo", í: "i com acento agudo",
  ó: "o com acento agudo", ô: "o com acento circunflexo", õ: "o com til", ú: "u com acento agudo", ç: "c com cedilha",
  // Buchstaben anderer Tastaturen (Deutschland, Schweiz, Frankreich, Spanien, Italien, Polen, Türkei, Tschechien).
  è: "e com acento grave", ì: "i com acento grave", ò: "o com acento grave", ù: "u com acento grave",
  î: "i com acento circunflexo", û: "u com acento circunflexo",
  ä: "a com trema", ë: "e com trema", ï: "i com trema", ö: "o com trema", ü: "u com trema",
  ß: "s duplo alemão", ñ: "n com til",
  ą: "a com cauda", ę: "e com cauda", ł: "l cortado", ć: "c com acento agudo", ń: "n com acento agudo",
  ś: "s com acento agudo", ź: "z com acento agudo", ż: "z com ponto",
  ğ: "g com braquia", ş: "s com cedilha", ı: "i sem ponto",
  ě: "e com caron", š: "s com caron", č: "c com caron", ř: "r com caron", ž: "z com caron", ý: "y com acento agudo",
  ů: "u com anel", ď: "d com caron", ť: "t com caron", ň: "n com caron",
};

/** Der Name aus {@link NOMES_PT} - Grossbuchstaben „maiúscula A", „maiúscula c com cedilha" (NVDA pt_PT „maiúscula %s"). */
function nomePt(ch: string): string {
  const treffer = NOMES_PT[ch];
  if (treffer) return treffer;
  if (ch >= "0" && ch <= "9") return ch;
  const klein = ch.toLocaleLowerCase("pt-PT");
  if (ch.length === 1 && klein.length === 1 && klein !== ch) return `maiúscula ${NOMES_PT[klein] ?? ch}`;
  return ch;
}

/**
 * ★ O-INHALT-PT (29.10.2026): der lesbare portugiesische Name einer Lern-Einheit - für die Lehrkraft-Statistik, die
 * Stand-Zeile und die Tastenkarte, wie `unitLabelCs`. Buchstaben gross wie auf der Kappe („R", „Ç"); Zeichen und Totasten über
 * dieselbe Tabelle wie „Explorar as teclas" ({@link NOMES_PT}), nicht über `spokenLabel`.
 */
export function unitLabelPt(unit: string, _lernweg?: Lernweg): string {
  switch (unitKind(unit)) {
    case "shift":
      return "maiúsculas";
    case "ziffer":
      return `algarismo ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return nomePt(unit);
    default: {
      // „ß".toUpperCase() ist „SS" - dort der Name.
      const gross = unit.toLocaleUpperCase("pt-PT");
      if (unit.length === 1 && gross.length === 1 && gross !== unit) return gross;
      return nomePt(unit);
    }
  }
}

/** Liegt diese Tastatur unter den portugiesischen (heute nur `pt`; nie `br-abnt2`)? */
function portuguesa(layout: LayoutId): boolean {
  return PORTUGIESISCHE_LAYOUT_IDS.has(layout);
}

/** Der Name einer Kappe nach „Alt Gr +" - lateinische Buchstaben gross, sonst wie auf der Kappe. */
function kappe(key: string): string {
  return /^[a-z]$/.test(key) ? key.toUpperCase() : key;
}

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/** Glossar §2.9: die deutsche Kappe bleibt auf der Bildschirm-Tastatur; „Explorar as teclas" sagt dazu, was darauf steht. */
const KAPPE_ALEMA = (aufdruck: string) => `No teclado alemão, está escrito ${aufdruck}.`;

/**
 * „Alt Gr + 2 dá a arroba, Alt Gr + E dá o euro." - die zwei häufigsten Zeichen des dritten Layers, gelesen aus der Tastatur
 * selbst (`pt`: 2 und E). Leer, wenn die Tastatur sie nicht über AltGr hat. Der Satz endet nicht mit einer Zahl.
 */
function altGrBeispiele(layout: LayoutId, taste: string): string[] {
  const at = layoutById(layout).access["@"];
  const euro = layoutById(layout).access["€"];
  if (at?.mod !== "altgr" || euro?.mod !== "altgr") return [];
  return [`${taste} + ${kappe(at.base)} dá a arroba, ${taste} + ${kappe(euro.base)} dá o euro.`];
}

/** Portugiesische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertastePt(
  id: string,
  plattform: Plattform,
  layout: LayoutId = "pt",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Opção" : "Ctrl";
  const pt = portuguesa(layout);
  switch (id) {
    case "tabulator":
      return {
        kurz: "Tab",
        name: "tecla de tabulação",
        was: [
          "passa para o elemento seguinte, por exemplo uma ligação, um campo ou um botão.",
          "Com a tecla Shift, volta ao elemento anterior.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      // Apple pt-PT nennt die Taste auch am Mac „Enter" (Glossar §2.9).
      return mac
        ? {
            kurz: "Enter",
            name: "tecla Enter",
            was: ["confirma e envia.", "Abre ligações e, num texto, começa uma linha nova."],
          }
        : {
            kurz: "Enter",
            name: "tecla Enter",
            was: ["confirma e envia.", "Abre ligações, ativa botões e, num texto, começa uma linha nova."],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "barra de espaço",
        was: ["põe um espaço entre duas palavras.", "Também ativa botões e marca caixas de verificação."],
      };
    case "loeschtaste":
      return mac
        ? {
            kurz: null,
            name: "tecla Apagar",
            was: ["apaga o caráter à esquerda do cursor.", "Assim corriges um erro de escrita."],
          }
        : {
            kurz: null,
            name: "tecla de retrocesso",
            was: [
              "apaga o caráter à esquerda do cursor.",
              "Assim corriges um erro de escrita.",
              "Na tecla está escrito Backspace, ou só uma seta para a esquerda.",
            ],
          };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "tecla Delete",
            was: [
              "apaga o caráter à direita do cursor.",
              "Se o teu teclado não a tiver, prime ao mesmo tempo as teclas Fn e Apagar.",
            ],
          }
        : {
            kurz: "Delete",
            name: "tecla Delete",
            was: ["apaga o caráter à direita do cursor.", "Também elimina os ficheiros selecionados.", KAPPE_ALEMA("Entf")],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "tecla Esc",
        was: [
          "cancela o que está a acontecer.",
          "Fecha menus, janelas e mensagens.",
          "No Tastenflow, leva-te de volta ao campo de escrita.",
        ],
      };
    case "umschalt":
      return {
        kurz: "Shift",
        name: "tecla Shift",
        was: pt
          ? [
              "enquanto a seguras, escreves maiúsculas.",
              "Dá também o sinal de cima da tecla, por exemplo o ponto de interrogação.",
              // ★★★ Glossar §2.9: in Portugal ist Shift + 6 das „&" - nie eine Akzent-Taste (das ist Brasilien).
              "No teclado português, Shift e a tecla 6 dão o e comercial.",
              "Com a tecla do acento agudo dá o acento grave, com a tecla do til dá o acento circunflexo.",
            ]
          : [
              "enquanto a seguras, escreves maiúsculas.",
              "Dá também o sinal de cima da tecla, por exemplo o ponto de interrogação.",
            ],
      };
    case "feststell":
      return {
        kurz: "Caps Lock",
        name: "tecla Caps Lock",
        was: ["escreve tudo em maiúsculas, até a premires outra vez."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "seta para a esquerda",
        was: ["move o cursor um caráter para a esquerda.", `Com a tecla ${pfeilWort}, salta uma palavra inteira.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "seta para a direita",
        was: ["move o cursor um caráter para a direita.", `Com a tecla ${pfeilWort}, salta uma palavra inteira.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "seta para cima",
        was: [
          "move o cursor uma linha para cima.",
          "Em listas e menus, passa para o item de cima.",
          `Com a tecla ${pfeilWort}, salta um parágrafo inteiro para cima.`,
        ],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "seta para baixo",
        was: [
          "move o cursor uma linha para baixo.",
          "Em listas e menus, passa para o item de baixo.",
          `Com a tecla ${pfeilWort}, salta um parágrafo inteiro para baixo.`,
        ],
      };
    case "pos1":
      return {
        kurz: "Home",
        name: "tecla Home",
        was: [
          "salta para o início da linha.",
          "Numa página web, salta para o topo.",
          "Com a tecla Ctrl, salta para o início do texto todo.",
          KAPPE_ALEMA("Pos 1"),
        ],
      };
    case "ende":
      return {
        kurz: "End",
        name: "tecla End",
        was: ["salta para o fim da linha.", "Numa página web, salta para o fundo.", "Com a tecla Ctrl, salta para o fim do texto todo."],
      };
    case "bild-auf":
      return {
        kurz: "Page Up",
        name: "tecla Page Up",
        was: ["sobe um ecrã de cada vez."],
      };
    case "bild-ab":
      return {
        kurz: "Page Down",
        name: "tecla Page Down",
        was: ["desce um ecrã de cada vez."],
      };
    case "einfg":
      return {
        kurz: "Insert",
        name: "tecla Insert",
        was: [
          "é a tecla do leitor de ecrã no NVDA e no JAWS.",
          "Muitos comandos do leitor de ecrã começam com ela.",
          KAPPE_ALEMA("Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "tecla Ctrl",
        was: [
          "serve para os atalhos de teclado.",
          "Ctrl + C copia, Ctrl + V cola, Ctrl + Z anula.",
          "Se a premires sozinha, a voz cala-se logo.",
          KAPPE_ALEMA("Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "tecla Alt",
        was: [
          "serve para os atalhos de teclado.",
          "Alt + Tab muda de janela.",
          "No Tastenflow, Alt + H abre a ajuda.",
        ],
      };
    case "altgr":
      // Ohne Kurzform: „Alt Gr, tecla Alt Gr" sagte dasselbe zweimal.
      return {
        kurz: null,
        name: "tecla Alt Gr",
        was: ["escreve o terceiro sinal de uma tecla, por exemplo a arroba ou o euro.", ...altGrBeispiele(layout, "Alt Gr")],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "tecla Windows",
        was: [
          "abre o menu Iniciar.",
          "Se a premires outra vez, o menu fecha-se.",
          "Com outras teclas faz outras coisas, por exemplo Win + D mostra o ambiente de trabalho.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "Comando",
        name: "tecla Comando",
        was: ["serve para os atalhos de teclado.", "Comando + C copia, Comando + V cola, Comando + Z anula."],
      };
    case "wahltaste":
      return {
        kurz: "Opção",
        name: "tecla Opção",
        was: ["escreve mais sinais, por exemplo a arroba ou o euro.", "Com as setas, salta palavras inteiras."],
      };
    case "ctrl":
      return {
        kurz: "Controlo",
        name: "tecla Controlo",
        was: ["serve no Mac para os atalhos de teclado.", "Se a premires sozinha, o VoiceOver cala-se."],
      };
    case "fn":
      return {
        kurz: "Fn",
        name: "tecla Fn",
        was: ["dá a outras teclas uma segunda função, por exemplo mudar o volume."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz, wie sie auf der Kappe steht („Ctrl + Home",
 * „Shift + Tab"); am Mac die Namen der Apple-Hilfe pt-PT (Comando, Opção, Controlo).
 */
export const TASTE_KURZ_PT: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Enter",
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
  befehlstaste: "Comando",
  wahltaste: "Opção",
  ctrl: "Controlo",
  fn: "Fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TECLAS_WINDOWS_PT: Readonly<Record<string, readonly string[]>> = {
  F1: ["em muitos programas, abre a ajuda."],
  F2: ["muda o nome do ficheiro selecionado."],
  F3: ["começa uma pesquisa."],
  F4: ["com a tecla Alt, fecha a janela."],
  F5: ["atualiza a página web.", "Aqui não acontece nada, podes continuar a explorar."],
  F6: ["passa para a barra de endereço do navegador."],
  F7: ["no Word, verifica a ortografia."],
  F10: ["em muitos programas, passa para a barra de menus."],
  F11: ["no navegador, liga e desliga o ecrã inteiro.", "No portátil, muitas vezes com a tecla Fn."],
  F12: ["no Word, abre a janela Guardar como."],
};

const APARECE_PT = "O acento só aparece com a letra seguinte.";

/** Portugiesisch zu `nachKey` - F-Tasten, Num Lock, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyPt(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "pt",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? ["tem uma função própria em alguns programas.", "No Mac, estas teclas muitas vezes mudam o brilho e o volume."]
        : (F_TECLAS_WINDOWS_PT[key] ?? ["tem uma função própria em alguns programas."]);
    return { kurz: key, name: "tecla de função", was };
  }
  switch (key) {
    case "Home":
      return sondertastePt("pos1", "windows", layout);
    case "End":
      return sondertastePt("ende", "windows", layout);
    case "PageUp":
      return sondertastePt("bild-auf", "windows", layout);
    case "PageDown":
      return sondertastePt("bild-ab", "windows", layout);
    case "Insert":
      return sondertastePt("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "tecla Num Lock",
        was: ["liga e desliga os algarismos do bloco numérico."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "tecla 5 do bloco numérico",
        was: ["escreve 5 quando o Num Lock está ligado.", "Agora o Num Lock está desligado, por isso não faz nada."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "tecla de menu",
        was: ["abre um menu com comandos para o sítio onde estás.", "Shift + F10 faz o mesmo."],
      };
    case "PrintScreen":
      return {
        kurz: null,
        name: "tecla Print Screen",
        was: ["tira uma fotografia ao ecrã.", "No Windows, muitas vezes abre a ferramenta de captura.", "A tecla Esc fecha-a."],
      };
    case "ScrollLock":
      return { kurz: null, name: "tecla Scroll Lock", was: ["hoje quase não se usa."] };
    case "Pause":
      return { kurz: null, name: "tecla Pause", was: ["hoje quase não se usa."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "tecla de aumentar o volume", was: ["põe o som mais alto."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "tecla de baixar o volume", was: ["põe o som mais baixo."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "tecla de silêncio", was: ["desliga o som e volta a ligá-lo."] };
    case "Fn":
      return sondertastePt("fn", plattform, layout);
    case "Dead":
      // ★ `layouts.ts` PT: Akut ´ rechts neben +, Tilde ~ rechts neben º, mit Shift Gravis ` und Zirkumflex ^, Trema ¨ = Alt Gr
      // + +. `TOTASTEN` in `tastenErklaerung.ts` kennt `pt` nicht - darum kommen hier ALLE her; der Satz nennt sie alle, ohne zu
      // raten, welche gedrückt wurde. Der Weg mit dem Til nur für die Tastatur `pt` (Glossar §2.9, nie der BR-Hinweis).
      return {
        kurz: null,
        name: "tecla de acento",
        was: portuguesa(layout)
          ? [
              "põe um acento na letra seguinte: acento agudo, acento grave, til, acento circunflexo ou trema.",
              "Primeiro a tecla do acento, depois a vogal: o til e depois o a dão ã.",
              APARECE_PT,
            ]
          : ["põe um acento na letra seguinte, por exemplo o acento agudo no e.", APARECE_PT],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

/**
 * Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle (Namen Glossar §2.8: „Ansage beim Drücken").
 * Gilt für die Tastaturen, deren Totasten `TOTASTEN` in `tastenErklaerung.ts` kennt (Deutschland, Schweiz, Frankreich …).
 */
export const AKZENTE_PT: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "acento circunflexo",
    was: ["põe um acento circunflexo na letra seguinte, por exemplo ê.", APARECE_PT],
  },
  akut: {
    name: "acento agudo",
    was: ["põe um acento agudo na letra seguinte, por exemplo é.", APARECE_PT],
  },
  gravis: {
    name: "acento grave",
    was: ["põe um acento grave na letra seguinte, por exemplo à.", APARECE_PT],
  },
  trema: {
    name: "trema",
    was: ["põe dois pontos em cima da letra seguinte, por exemplo ü.", APARECE_PT],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMAR_PT = ["serve para programar."] as const;

/** Die Lage der Totasten auf der Tastatur `pt` - mit „No teclado português" davor, damit der Satz überall stimmt. */
const AGUDO_PT = "No teclado português, o acento agudo está na tecla à direita do +. Primeiro a tecla do acento, depois a vogal.";
const TIL_PT = "No teclado português, o til está na tecla à direita do º. Primeiro o til, depois a vogal.";
const CIRCUNFLEXO_PT = "No teclado português, o acento circunflexo é Shift e a tecla do til. Primeiro o acento, depois a vogal.";
const GRAVE_PT = "No teclado português, o acento grave é Shift e a tecla do acento agudo. Primeiro o acento, depois o a.";

/** Die Buchstaben der tschechischen Tastatur - ein Satz ohne Wertung, damit „Explorar as teclas" dort nicht schweigt. */
const LETRA_CHECA_PT = ["é uma letra do checo, a língua da República Checa."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN_CS` (jeder Schlüssel dort steht auch hier) und dazu die portugiesischen Buchstaben mit Zeichen.
 * Der Name kommt aus {@link NOMES_PT}; `name` steht nur bei den Ziffern („algarismo 2"). Wo ein Akzent ein ANDERES Wort macht,
 * steht das Wortpaar da (Bauplan I4: é/e, está/esta, avó/avô), ohne zu werten.
 */
export const ZEICHEN_PT: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["termina uma frase."] },
  ",": { was: ["separa partes de uma frase."] },
  "?": { was: ["termina uma pergunta."] },
  "!": { was: ["termina uma exclamação."] },
  ":": { was: ["anuncia alguma coisa, por exemplo uma lista."] },
  ";": { was: ["separa duas partes de uma frase com mais força do que a vírgula."] },
  "-": { was: ["liga palavras, por exemplo em guarda-chuva e dá-me.", "Nas contas, quer dizer menos."] },
  "@": { was: ["está em todos os endereços de e-mail."] },
  "+": { was: ["nas contas, quer dizer mais.", "Num atalho de teclado, quer dizer: prime as teclas ao mesmo tempo."] },
  "*": { was: ["no computador, quer dizer vezes."] },
  "/": { was: ["no computador, quer dizer a dividir por.", "Também aparece nos endereços da internet."] },
  "=": { was: ["vem antes do resultado de uma conta."] },
  "'": { was: ["em português quase não se usa, aparece em nomes como Sant'Ana."] },
  '"': { was: ["vem antes e depois do que alguém diz.", "Nos textos portugueses usam-se mais as aspas « e »."] },
  "«": { was: ["abre uma fala ou uma citação nos textos portugueses.", "No teclado português, tem uma tecla própria à direita do apóstrofo."] },
  "»": { was: ["fecha uma fala ou uma citação.", "No teclado português, escreve-se com Shift e a tecla das aspas «."] },
  "(": { was: ["abre uma explicação extra no meio da frase."] },
  ")": { was: ["fecha a explicação extra."] },
  "%": { was: ["quer dizer em cada cem, por exemplo 50%."] },
  "&": { was: ["quer dizer e.", "No teclado português, escreve-se com Shift e a tecla 6."] },
  "#": { was: ["chama-se cardinal e serve para números e para hashtags."] },
  "€": { was: ["é o sinal da moeda euro.", "No teclado português, escreve-se com Alt Gr e a tecla E."] },
  $: { was: ["é o sinal do dólar."] },
  "£": { was: ["é o sinal da libra."] },
  "§": { was: ["com um número, indica um parágrafo de uma lei."] },
  "°": { was: ["indica graus, por exemplo da temperatura."] },
  "<": { was: ["compara dois números: o da esquerda é menor."] },
  ">": { was: ["compara dois números: o da esquerda é maior."] },
  _: { was: ["aparece muitas vezes em endereços de e-mail e em nomes de ficheiros."] },
  "^": { was: ["nas contas, quer dizer elevado a, por exemplo dois elevado a três."] },
  "²": { was: ["serve para áreas, por exemplo metros quadrados."] },
  "³": { was: ["serve para volumes, por exemplo metros cúbicos."] },
  "[": { was: PROGRAMAR_PT },
  "]": { was: PROGRAMAR_PT },
  "{": { was: PROGRAMAR_PT },
  "}": { was: PROGRAMAR_PT },
  "\\": { was: PROGRAMAR_PT },
  "|": { was: PROGRAMAR_PT },
  "~": { was: ["põe o til em cima do a e do o, por exemplo em mãe e põe."] },
  "´": { was: ["põe um acento agudo numa vogal, por exemplo á."] },
  "ˇ": { was: ["põe um sinal em forma de v por cima de uma letra, por exemplo no checo."] },
  "`": { was: ["põe um acento grave numa vogal, por exemplo à."] },
  "¨": { was: ["põe dois pontos em cima de uma letra, por exemplo ü."] },
  // Die Ziffern: ohne Eintrag sagte „Explorar as teclas" nur „2." - mit Namen und Lage. Der Satz endet nicht mit der Zahl.
  ...Object.fromEntries(
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((d) => [
      d,
      { name: `algarismo ${d}`, was: ["está na fila dos números, por cima das letras."] },
    ]),
  ),
  // ★★★ die portugiesischen Buchstaben mit Zeichen (Glossar §2.8, Bauplan I2/I4).
  á: { was: ["é uma letra com acento, por exemplo em já e água.", "Sem o acento é outra palavra: está e esta.", AGUDO_PT] },
  é: { was: ["é uma letra com acento, por exemplo em café e pé.", "Sem o acento é outra palavra: é e e.", AGUDO_PT] },
  í: { was: ["é uma letra com acento, por exemplo em país e saída.", AGUDO_PT] },
  ó: { was: ["é uma letra com acento, por exemplo em só e avó.", "Com outro acento é outra palavra: avó e avô.", AGUDO_PT] },
  ú: { was: ["é uma letra com acento, por exemplo em último e saúde.", AGUDO_PT] },
  ç: { was: ["é o c com cedilha, por exemplo em coração e açúcar.", "No teclado português, tem uma tecla própria à direita do L."] },
  ã: { was: ["é o a com til, por exemplo em mãe e pão.", TIL_PT] },
  õ: { was: ["é o o com til, por exemplo em põe e limões.", TIL_PT] },
  â: { was: ["é uma letra com acento, por exemplo em lâmpada e câmara.", CIRCUNFLEXO_PT] },
  ê: { was: ["é uma letra com acento, por exemplo em pêssego e português.", CIRCUNFLEXO_PT] },
  ô: { was: ["é uma letra com acento, por exemplo em avô e pôr.", "Com outro acento é outra palavra: avô e avó.", CIRCUNFLEXO_PT] },
  à: { was: ["junta a e a numa só palavra, por exemplo em vou à escola.", GRAVE_PT] },
  // Die Buchstaben der tschechischen Tastatur (dieselben Schlüssel wie `ZEICHEN_CS`).
  ě: { was: LETRA_CHECA_PT },
  š: { was: LETRA_CHECA_PT },
  č: { was: LETRA_CHECA_PT },
  ř: { was: LETRA_CHECA_PT },
  ž: { was: LETRA_CHECA_PT },
  ý: { was: LETRA_CHECA_PT },
  ů: { was: LETRA_CHECA_PT },
  ď: { was: LETRA_CHECA_PT },
  ť: { was: LETRA_CHECA_PT },
  ň: { was: LETRA_CHECA_PT },
};

/** Der portugiesische Name eines Zeichens - aus der Tabelle oder {@link NOMES_PT}. */
export function zeichenNamePt(ch: string): string {
  return ZEICHEN_PT[ch]?.name ?? nomePt(ch);
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - Produktnamen mit dem Artikel „o" (Microsoft pt-PT, Glossar §3). */
export const ORT_PT: Readonly<Record<string, string>> = {
  explorer: "no Explorador de Ficheiros",
  finder: "no Finder",
  word: "no Word",
  excel: "no Excel",
  browser: "no navegador",
  teams: "no Teams",
  powerpoint: "no PowerPoint",
  outlook: "no Outlook",
  bedienungshilfen: "no leitor de ecrã",
};

/** Die kleine eigene Liste der deutschen Datei, portugiesisch. */
export const EIGENE_KOMBINATIONEN_PT: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "volta ao elemento anterior." },
    { keys: "Strg+P", was: "abre a janela de impressão." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "volta ao elemento anterior." },
    { keys: "Cmd+P", was: "abre a janela de impressão." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - portugiesisch, nach der Kennung der Wirkung im Kürzel-Katalog von »Im Griff«
 * (`lib/computer/kuerzelWirkung.ts`, dort nur gelesen). Infinitiv wie in den Menüs von Windows und Office pt-PT („Copiar",
 * „Colar", „Anular", „Guardar como", Glossar Regel 1 und 10). Der Papierkorb heisst unter Windows „Reciclagem", am Mac „Lixo".
 */
export function wirkungPt(id: string, plattform: Plattform): string | null {
  if (id === "papierkorb") return plattform === "macos" ? "Mover para o Lixo" : "Mover para a Reciclagem";
  return WIRKUNG_PT[id] ?? null;
}

const WIRKUNG_PT: Readonly<Record<string, string>> = {
  kopieren: "Copiar",
  einfuegen: "Colar",
  ausschneiden: "Cortar",
  rueckgaengig: "Anular",
  wiederherstellen: "Refazer o que foi anulado",
  "alles-markieren": "Selecionar tudo",
  "markieren-zeichen": "Selecionar caráter a caráter",
  "markieren-wort": "Selecionar palavra a palavra",
  "spalte-markieren": "Selecionar a coluna inteira",
  "zeile-markieren": "Selecionar a linha inteira",
  oeffnen: "Abrir",
  umbenennen: "Mudar o nome",
  "neuer-ordner": "Criar uma pasta nova",
  papierkorb: "Mover para a Reciclagem",
  duplizieren: "Fazer uma segunda cópia do mesmo ficheiro",
  "ebene-hoeher": "Subir um nível",
  adressleiste: "Ir para a barra de endereço",
  eigenschaften: "Mostrar as propriedades",
  uebersicht: "Abrir a pré-visualização, para ver o ficheiro sem o abrir",
  bewegen: "Mover o ficheiro para o sítio certo (sai do sítio antigo)",
  "ansicht-details": "Mudar para a vista Detalhes",
  speichern: "Guardar",
  "speichern-unter": "Guardar como, com outro nome ou noutro sítio",
  fett: "Negrito",
  kursiv: "Itálico",
  unterstreichen: "Sublinhado",
  ueberschrift1: "Aplicar o estilo Título 1 ao título principal",
  ueberschrift2: "Aplicar o estilo Título 2 a um subtítulo",
  "standard-format": "Aplicar o estilo Normal",
  links: "Alinhar à esquerda",
  zentriert: "Centrar",
  zeilenumbruch: "Mudar de linha no mesmo parágrafo",
  rechtschreibung: "Verificar a ortografia",
  fensterbereiche: "Passar de uma parte da janela para outra",
  suchen: "Localizar",
  ersetzen: "Localizar e substituir",
  "gehe-zu-zelle": "Ir para uma célula",
  "zelle-bearbeiten": "Continuar a escrever na célula",
  "zelle-formatieren": "Abrir a janela Formatar Células",
  "zum-rand": "Saltar para o limite dos dados",
  autosumme: "Inserir a Soma Automática",
  "ausfuellen-unten": "Preencher para baixo",
  "ausfuellen-rechts": "Preencher para a direita",
  "absoluter-bezug": "Fixar uma referência (referência absoluta com cifrões)",
  datum: "Inserir a data de hoje",
  uhrzeit: "Inserir a hora atual",
  kommentar: "Inserir um comentário",
  autofilter: "Ligar e desligar o Filtro Automático",
  blattwechsel: "Passar para outra folha",
  "neues-blatt": "Inserir uma folha nova",
  "neu-laden": "Atualizar a página",
  lesezeichen: "Adicionar um marcador",
  verlauf: "Abrir o histórico",
  senden: "Enviar a mensagem",
  "nachricht-loeschen": "Eliminar a mensagem",
  "sr-stopp": "Parar a leitura",
};

/** „a, b e c" - die portugiesische Aufzählung (kein Komma vor „e", Glossar §2.10, gemessen `Intl.ListFormat`). */
export function aufzaehlungPt(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} e ${teile[teile.length - 1]}`;
}

/**
 * Die festen Wörter des Erkundens, portugiesisch. `mit` steht vor dem Weg über den dritten Layer („Com Alt Gr + 2.") -
 * Portugiesisch beugt den Tastennamen nicht.
 */
export const ERKUNDEN_WOERTER_PT = {
  kombination: "combinação de teclas",
  kombiUnbekannt: "o que faz depende do programa.",
  mit: "Com",
  akzentTaste: "tecla de acento",
  unbekannt: "Não conheço esta tecla.",
  taste: (key: string) => `Tecla ${key}`,
} as const;

/* ══ „Encontrar as teclas" ══════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) portugiesisch - WAS geschieht, entscheidet weiter `suchSchritt`;
 * hier wird nur gesagt.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TeclaPt {
  /** Im Satz, mit Artikel: „a tecla de tabulação", „a barra de espaço", „a seta para a esquerda". */
  nennung: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur Caps Lock). */
  achtung?: string;
}

const BLOCO_SEIS_PT = "No bloco de seis teclas por cima das setas";
const SETAS_PT = "Em baixo, à direita, nas setas";
const PORTATIL_FN_PT = "No portátil, muitas vezes com a tecla Fn.";

/** Die Tasten der Suchrunde, portugiesisch - nach derselben Kennung wie das Wörterbuch. */
const TECLAS_PT: Readonly<Record<string, TeclaPt | ((plattform: Plattform) => TeclaPt)>> = {
  tabulator: { nennung: "a tecla de tabulação", lage: "Mindinho esquerdo: uma fila acima, junto à borda." },
  "pfeil-links": { nennung: "a seta para a esquerda", lage: `${SETAS_PT}: a da esquerda.` },
  "pfeil-rechts": { nennung: "a seta para a direita", lage: `${SETAS_PT}: a da direita.` },
  "pfeil-auf": { nennung: "a seta para cima", lage: `${SETAS_PT}: a de cima.` },
  "pfeil-ab": { nennung: "a seta para baixo", lage: `${SETAS_PT}: por baixo da seta para cima.` },
  pos1: { nennung: "a tecla Home", lage: `${BLOCO_SEIS_PT}, em cima ao meio. ${PORTATIL_FN_PT}` },
  ende: { nennung: "a tecla End", lage: `${BLOCO_SEIS_PT}, em baixo ao meio. ${PORTATIL_FN_PT}` },
  "bild-auf": { nennung: "a tecla Page Up", lage: `${BLOCO_SEIS_PT}, em cima à direita. ${PORTATIL_FN_PT}` },
  "bild-ab": { nennung: "a tecla Page Down", lage: `${BLOCO_SEIS_PT}, em baixo à direita. ${PORTATIL_FN_PT}` },
  leertaste: { nennung: "a barra de espaço", lage: "A tecla comprida por baixo dos teus polegares." },
  eingabe: { nennung: "a tecla Enter", lage: "Mão direita, junto à borda: a tecla grande." },
  zeilenschalter: { nennung: "a tecla Enter", lage: "Mão direita, junto à borda: a tecla grande." },
  loeschtaste: (plattform) => ({
    nennung: plattform === "macos" ? "a tecla Apagar" : "a tecla de retrocesso",
    lage: "Mão direita, junto à borda, duas filas acima.",
  }),
  entf: (plattform) =>
    plattform === "macos"
      ? { nennung: "a tecla Delete", lage: "Só nos teclados grandes, ao lado da tecla Enter. Senão, Fn e Apagar." }
      : { nennung: "a tecla Delete", lage: `${BLOCO_SEIS_PT}, em baixo à esquerda. No portátil, em cima à direita.` },
  esc: { nennung: "a tecla Esc", lage: "No canto de cima, à esquerda." },
  umschalt: { nennung: "a tecla Shift", lage: "Há duas: à esquerda e à direita, na fila de baixo." },
  feststell: {
    nennung: "a tecla Caps Lock",
    lage: "Mindinho esquerdo: um passo para a esquerda.",
    achtung: "Agora só saem maiúsculas? Prime-a outra vez.",
  },
  strg: { nennung: "a tecla Ctrl", lage: "No canto de baixo, à esquerda." },
  alt: { nennung: "a tecla Alt", lage: "Em baixo, à esquerda da barra de espaço." },
  altgr: { nennung: "a tecla Alt Gr", lage: "Em baixo, à direita da barra de espaço." },
  "windows-taste": { nennung: "a tecla Windows", lage: "Em baixo à esquerda, entre as teclas Ctrl e Alt." },
  einfg: {
    nennung: "a tecla Insert",
    lage: `${BLOCO_SEIS_PT}, em cima à esquerda, por cima da tecla Delete. Muitas vezes falta nos portáteis.`,
  },
  befehlstaste: { nennung: "a tecla Comando", lage: "Em baixo à esquerda, mesmo ao lado da barra de espaço." },
  wahltaste: { nennung: "a tecla Opção", lage: "Em baixo à esquerda, a terceira tecla a contar da borda." },
  ctrl: { nennung: "a tecla Controlo", lage: "Em baixo à esquerda, a segunda tecla a contar da borda." },
  fn: { nennung: "a tecla Fn", lage: "Em baixo à esquerda, a primeira tecla, no canto. No MacBook, está escrito fn." },
};

function teclaPt(t: TastenName, plattform: Plattform): TeclaPt {
  const e = TECLAS_PT[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne portugiesischen Eintrag - „a tecla" davor (Regel 11).
  return e ?? { nennung: `a tecla ${t.kurz ?? t.name}`, lage: "" };
}

/** „a tecla de tabulação" - wie eine Taste im Satz heisst. */
export function tastenNennungPt(t: TastenName, plattform: Plattform): string {
  return teclaPt(t, plattform).nennung;
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLagePt(t: TastenName, plattform: Plattform): string {
  return teclaPt(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Procura a tecla de tabulação. Mindinho esquerdo: ..." */
export function ansageSuchauftragPt(t: TastenName, plattform: Plattform): string {
  const e = teclaPt(t, plattform);
  return e.lage ? `Procura ${e.nennung}. ${e.lage}` : `Procura ${e.nennung}.`;
}

/** Erster Treffer - erst die Wiederholung zählt („Está aqui!" passt zu jeder Taste und jedem Kind). */
export function ansageGefundenPt(t: TastenName, plattform: Plattform): string {
  return `Está aqui! Prime outra tecla e depois, outra vez, ${tastenNennungPt(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Caps Lock). */
export function ansageBestaetigtPt(t: TastenName, plattform: Plattform): string {
  const e = teclaPt(t, plattform);
  return e.achtung ? `Certo! ${e.achtung}` : "Certo!";
}

/** Eine Taste, die hier nicht geübt wird. */
export const ANSAGE_UNBEKANNT_PT = "Esta tecla não se pratica aqui.";

/** „Teclas encontradas: 20 de 20. Muito bem." - „de" statt Schrägstrich (Glossar §2.12), die Zahl nicht am Satzende. */
export function alleGefundenPt(anzahl: number): string {
  return `Teclas encontradas: ${anzahl} de ${anzahl}. Muito bem.`;
}

/**
 * Der Satz zu einem Schritt der Suchrunde - portugiesisch. `art` und `naechste` kommen unverändert aus `suchSchritt`; nur die
 * Wörter sind neu. „Premiste ..." ist ein Verb - ohne Geschlecht (Glossar Regel 2).
 */
export function suchSatzPt(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = teclaPt(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_PT} Procura ${g.nennung}.`;
      return `Premiste ${tastenNennungPt(taste, plattform)}. Procura ${g.nennung}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenPt(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtPt(gesucht, plattform)} ${alleGefundenPt(suchbar.length)}`;
    case "weiter":
      return `${ansageBestaetigtPt(gesucht, plattform)} ${ansageSuchauftragPt(suchbar[index + 1]!, plattform)}`;
  }
}

/* ══ Das Paket für den Verteiler ═══════════════════════════════════════════ */

/** Alles, was „Explorar as teclas" auf Portugiesisch (Portugal) sagt. */
export const TASTEN_SATZ_PT: TastenErklaerungSatz = {
  sondertaste: sondertastePt,
  nachKey: nachKeyPt,
  tasteKurz: TASTE_KURZ_PT,
  zeichen: ZEICHEN_PT,
  zeichenName: zeichenNamePt,
  akzente: AKZENTE_PT,
  erkundenWoerter: ERKUNDEN_WOERTER_PT,
  eigeneKombinationen: EIGENE_KOMBINATIONEN_PT,
  wirkung: wirkungPt,
  ort: ORT_PT,
  aufzaehlung: aufzaehlungPt,
  aufdruckGross: (key) => {
    const gross = key.toLocaleUpperCase("pt-PT");
    return gross.length === key.length ? gross : key;
  },
};
