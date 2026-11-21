/**
 * ★ D-LERNDATEN (25.10.2026): DIE KORREKTURLESE-FÄLLE des Weges „br" (Portugiesisch (Brasilien)) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/pt-BR/tf-fest-pt-BR.json`, Schlüssel `unsinnSaetze` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - sprachlich sauber, strikt brasilianisch, tippbar (0 Fehler), Reihenfolge 0 Verstöße, Sperrliste 0 Treffer.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `korrekturlesenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Portugiesisch (Brasilien) als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * In jedem Satz steht ein falsches, echtes Wort (`falsch`), das im Satz offensichtlich nicht stimmt; `richtig` ist das gemeinte.
 * Ob der Unterschied für eine Sprachausgabe HÖRBAR ist (Johannes 02.09.2026), prüft erst ein Lautschlüssel je Sprache (F8, offen).
 *
 * Verteiler: `korrekturlesen.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?brasilianisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-br.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_BR: readonly Korrekturfall[] = [
  { satz: "O gato correu atrás de um prato.", falsch: "prato", richtig: "rato" },
  { satz: "Na praia, eu fiz um castelo de aveia.", falsch: "aveia", richtig: "areia" },
  { satz: "As abelhas fazem um mal delicioso.", falsch: "mal", richtig: "mel" },
  { satz: "A vovó fez um bolo de censura.", falsch: "censura", richtig: "cenoura" },
  { satz: "Minha avó me deu um casaco de rã.", falsch: "rã", richtig: "lã" },
  { satz: "O sal nasce todas as manhãs.", falsch: "sal", richtig: "sol" },
  { satz: "Eu escovo os pentes antes de dormir.", falsch: "pentes", richtig: "dentes" },
  { satz: "Um ano tem doze mesas.", falsch: "mesas", richtig: "meses" },
  { satz: "O peixe nada no riso.", falsch: "riso", richtig: "rio" },
  { satz: "Coloquei a sopa no pato.", falsch: "pato", richtig: "prato" },
  { satz: "O avião voa alto no véu.", falsch: "véu", richtig: "céu" },
  { satz: "Bebi um corpo de suco de laranja.", falsch: "corpo", richtig: "copo" },
  { satz: "O jogador chutou a bala no gol.", falsch: "bala", richtig: "bola" },
  { satz: "A girafa tem o pescoço comprimido.", falsch: "comprimido", richtig: "comprido" },
  { satz: "O pão de beijo saiu quentinho do forno.", falsch: "beijo", richtig: "queijo" },
  { satz: "O Brasil é um pais muito grande.", falsch: "pais", richtig: "país" },
  { satz: "Levei uma maca na lancheira.", falsch: "maca", richtig: "maçã" },
  { satz: "Choveu muito e a lua ficou molhada.", falsch: "lua", richtig: "rua" },
  { satz: "À noite eu durmo na minha lama.", falsch: "lama", richtig: "cama" },
  { satz: "A professora escreveu a lição no quarto.", falsch: "quarto", richtig: "quadro" },
  { satz: "A onça-pintada dança à noite na mata.", falsch: "dança", richtig: "caça" },
  { satz: "Vou ao mercado comprar arroto e feijão.", falsch: "arroto", richtig: "arroz" },
  { satz: "No inverno, uso um morro de lã na cabeça.", falsch: "morro", richtig: "gorro" },
  { satz: "Escrevi uma cabra para minha tia.", falsch: "cabra", richtig: "carta" },
  { satz: "O bebê toma leite na madeira.", falsch: "madeira", richtig: "mamadeira" },
  { satz: "O palhaço usa um sapo enorme no pé.", falsch: "sapo", richtig: "sapato" },
  { satz: "Uma semana tem sete tias.", falsch: "tias", richtig: "dias" },
  { satz: "Para ver, usamos os alhos.", falsch: "alhos", richtig: "olhos" },
  { satz: "O barco navega no bar.", falsch: "bar", richtig: "mar" },
  { satz: "A chave abre a torta da casa.", falsch: "torta", richtig: "porta" },
  { satz: "Vou dormir, estou com muito sino.", falsch: "sino", richtig: "sono" },
  { satz: "Estou com fama, quero um sanduíche.", falsch: "fama", richtig: "fome" },
  { satz: "O sapo pula na lagosta.", falsch: "lagosta", richtig: "lagoa" },
  { satz: "O pirata enterrou o besouro na ilha.", falsch: "besouro", richtig: "tesouro" },
  { satz: "Ganhei um parente de aniversário.", falsch: "parente", richtig: "presente" },
  { satz: "No verão, adoro tomar banho de mel.", falsch: "mel", richtig: "mar" },
  { satz: "Cortei a carne com a fada.", falsch: "fada", richtig: "faca" },
  { satz: "O pássaro fez um vinho na árvore.", falsch: "vinho", richtig: "ninho" },
  { satz: "Comprei pão fresquinho na pradaria.", falsch: "pradaria", richtig: "padaria" },
  { satz: "O bombeiro apagou o jogo.", falsch: "jogo", richtig: "fogo" },
  { satz: "O médico mediu a minha lebre.", falsch: "lebre", richtig: "febre" },
];
