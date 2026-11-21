/**
 * ★ D-LERNDATEN (25.10.2026): DIE KORREKTURLESE-FÄLLE des Weges „pt" (Portugiesisch (Portugal)) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/pt-PT/tf-fest-pt-PT.json`, Schlüssel `unsinnSaetze` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja (für den Bau) - Vorbehalt: Lese-Abnahme durch eine Person aus Portugal; Wurzeln und Buchstabenfolgen liegen mengenmäßig unter der Vorlage.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `korrekturlesenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Portugiesisch (Portugal) als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * In jedem Satz steht ein falsches, echtes Wort (`falsch`), das im Satz offensichtlich nicht stimmt; `richtig` ist das gemeinte.
 * Ob der Unterschied für eine Sprachausgabe HÖRBAR ist (Johannes 02.09.2026), prüft erst ein Lautschlüssel je Sprache (F8, offen).
 *
 * Verteiler: `korrekturlesen.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?portugiesisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-pt.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_PT: readonly Korrekturfall[] = [
  { satz: "As abelhas fazem um mal muito doce.", falsch: "mal", richtig: "mel" },
  { satz: "Na praia, construí um castelo de aveia.", falsch: "aveia", richtig: "areia" },
  { satz: "O gato corre atrás de um prato.", falsch: "prato", richtig: "rato" },
  { satz: "O rei e a rainha vivem num enorme casulo.", falsch: "casulo", richtig: "castelo" },
  { satz: "O esquilo esconde vozes para o inverno.", falsch: "vozes", richtig: "nozes" },
  { satz: "Um ano tem doze mesas.", falsch: "mesas", richtig: "meses" },
  { satz: "Uma semana tem sete tias.", falsch: "tias", richtig: "dias" },
  { satz: "Para ver, usamos os alhos.", falsch: "alhos", richtig: "olhos" },
  { satz: "O bebé dorme tranquilo no berro.", falsch: "berro", richtig: "berço" },
  { satz: "O Sol nasce todas as manhas.", falsch: "manhas", richtig: "manhãs" },
  { satz: "Pus duas colheres de açúcar no chão.", falsch: "chão", richtig: "chá" },
  { satz: "A pata nada no lago com os seus patins.", falsch: "patins", richtig: "patinhos" },
  { satz: "O pastor leva as orelhas para o monte.", falsch: "orelhas", richtig: "ovelhas" },
  { satz: "Vou ao médico porque tenho dores de cabaça.", falsch: "cabaça", richtig: "cabeça" },
  { satz: "O pai serviu a sopa num pato fundo.", falsch: "pato", richtig: "prato" },
  { satz: "O peixinho nada na égua do aquário.", falsch: "égua", richtig: "água" },
  { satz: "Ao lanche, bebo um corpo de leite.", falsch: "corpo", richtig: "copo" },
  { satz: "Lavo os dentes com escova e pasto.", falsch: "pasto", richtig: "pasta" },
  { satz: "No inverno, uso uvas de lã nas mãos.", falsch: "uvas", richtig: "luvas" },
  { satz: "Todas as manhãs, o gelo canta no quintal.", falsch: "gelo", richtig: "galo" },
  { satz: "O cão ladra ao canteiro quando ele traz as cartas.", falsch: "canteiro", richtig: "carteiro" },
  { satz: "Fecha a panela, que entra frio pela casa!", falsch: "panela", richtig: "janela" },
  { satz: "A avó fez um bolso de chocolate para a festa.", falsch: "bolso", richtig: "bolo" },
  { satz: "Os bombeiros apagaram o jogo na serra.", falsch: "jogo", richtig: "fogo" },
  { satz: "O barco navega em alto bar.", falsch: "bar", richtig: "mar" },
  { satz: "O João e muito simpático.", falsch: "e", richtig: "é" },
  { satz: "O gato saltou para cima do sofa.", falsch: "sofa", richtig: "sofá" },
  { satz: "Agosto é o mes mais quente do ano.", falsch: "mes", richtig: "mês" },
  { satz: "Ao pequeno-almoço há pao com manteiga.", falsch: "pao", richtig: "pão" },
  { satz: "Levo uma maca na mochila para o lanche.", falsch: "maca", richtig: "maçã" },
  { satz: "Por favor, passa-me o sol para temperar a salada.", falsch: "sol", richtig: "sal" },
  { satz: "O caracol é um animal muito lenço.", falsch: "lenço", richtig: "lento" },
  { satz: "As trutas nadam no riso.", falsch: "riso", richtig: "rio" },
  { satz: "O sapateiro conserta sapos.", falsch: "sapos", richtig: "sapatos" },
  { satz: "A professora escreve a data no quarto.", falsch: "quarto", richtig: "quadro" },
  { satz: "Na Serra da Estrela, as crianças fazem bonecos de neve com a nave.", falsch: "nave", richtig: "neve" },
  { satz: "Na escola, a Leonor escreve a lápis e apaga os erros com a borrega.", falsch: "borrega", richtig: "borracha" },
  { satz: "O comboio parou na estação e os passageiros saíram pela porca.", falsch: "porca", richtig: "porta" },
  { satz: "À noite, no céu, vemos a lua e muitas estreias.", falsch: "estreias", richtig: "estrelas" },
  { satz: "O barqueiro atravessa o rio com dois ramos.", falsch: "ramos", richtig: "remos" },
  { satz: "No supermercado, ponho as compras num taco.", falsch: "taco", richtig: "saco" },
  { satz: "A minha tia vive numa ilha dos Açores, no meio do oceano Atlético.", falsch: "Atlético", richtig: "Atlântico" },
  { satz: "Quando faz frio, a avó tricota cachecóis com novelas de lã.", falsch: "novelas", richtig: "novelos" },
];
