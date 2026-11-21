/**
 * ★ D-LERNDATEN (25.10.2026): DIE WORTKETTEN (Themen-Wortfelder) des Weges „pt" (Portugiesisch (Portugal)) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/pt-PT/tf-fest-pt-PT.json`, Schlüssel `themenWortfelder` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja (für den Bau) - Vorbehalt: Lese-Abnahme durch eine Person aus Portugal; Wurzeln und Buchstabenfolgen liegen mengenmäßig unter der Vorlage.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wortkettenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Portugiesisch (Portugal) als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Wie viele Wörter je Hand einhändig sind, hängt an der Tastatur des Weges (G3b, `fingerForChar`) - gemessen wird es erst, wenn
 * die Tastaturen der Sprache stehen.
 *
 * Verteiler: `handschwerpunkte.ts` (filtert die Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?portugiesisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-pt.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_PT: Wortkette[] = [
  {
    thema: "Os animais",
    woerter: ["gato", "cão", "coelho", "golfinho", "baleia", "gaivota", "cegonha", "lince", "lobo", "raposa", "ouriço", "ovelha", "cavalo", "pato", "peixe", "polvo", "sardinha", "abelha", "borboleta", "javali", "coruja", "esquilo", "tartaruga"],
    stufen: ALLE,
  },
  {
    thema: "A casa",
    woerter: ["casa", "sala", "quarto", "cozinha", "janela", "porta", "telhado", "varanda", "cadeira", "mesa", "sofá", "cama", "armário", "frigorífico", "chaminé", "escada", "jardim", "azulejo", "lareira", "tapete", "candeeiro", "estante", "banheira"],
    stufen: ALLE,
  },
  {
    thema: "A escola",
    woerter: ["escola", "turma", "professora", "professor", "aluno", "aluna", "caderno", "caneta", "lápis", "borracha", "mochila", "estojo", "régua", "quadro", "recreio", "cantina", "biblioteca", "intervalo", "sumário", "teste", "ficha", "manual", "afia", "cola", "tesoura"],
    stufen: ALLE,
  },
  {
    thema: "À mesa",
    woerter: ["pão", "queijo", "sopa", "caldo", "bacalhau", "sardinha", "arroz", "batata", "azeite", "azeitona", "presunto", "pastel", "bolo", "sumo", "leite", "água", "café", "chávena", "prato", "garfo", "faca", "colher", "guardanapo", "almoço", "jantar"],
    stufen: ALLE,
  },
  {
    thema: "O mar e a costa",
    woerter: ["mar", "praia", "onda", "areia", "concha", "farol", "barco", "pescador", "rede", "gaivota", "maré", "falésia", "rocha", "porto", "caravela", "moliceiro", "ilha", "baía", "ria", "prancha", "surf"],
    stufen: ALLE,
  },
  {
    thema: "Serra e campo",
    woerter: ["serra", "montanha", "neve", "rio", "vale", "sobreiro", "cortiça", "oliveira", "vinha", "pastor", "rebanho", "aldeia", "moinho", "ponte", "socalco", "castanha", "pinheiro", "monte", "levada", "lagoa", "vulcão"],
    stufen: ALLE,
  },
  {
    thema: "A cidade e a vila",
    woerter: ["cidade", "vila", "rua", "praça", "elétrico", "autocarro", "metro", "comboio", "estação", "câmara", "mercado", "pastelaria", "padaria", "quiosque", "farmácia", "correios", "semáforo", "passeio", "calçada", "museu", "castelo", "bairro", "miradouro"],
    stufen: ALLE,
  },
  {
    thema: "O tempo e as estações",
    woerter: ["sol", "chuva", "vento", "nuvem", "nevoeiro", "trovoada", "relâmpago", "frio", "calor", "neve", "geada", "primavera", "verão", "outono", "inverno", "céu", "temperatura", "granizo", "humidade", "seca", "previsão"],
    stufen: ALLE,
  },
  {
    thema: "A família",
    woerter: ["mãe", "pai", "avó", "avô", "irmão", "irmã", "filho", "filha", "tio", "tia", "primo", "prima", "neto", "neta", "bisavó", "bisavô", "sobrinho", "sobrinha", "madrinha", "padrinho", "família", "bebé", "gémeos"],
    stufen: ALLE,
  },
  {
    thema: "O corpo",
    woerter: ["cabeça", "cabelo", "olho", "nariz", "boca", "dente", "língua", "orelha", "pescoço", "ombro", "braço", "mão", "dedo", "perna", "joelho", "pé", "barriga", "costas", "coração", "testa", "cotovelo", "unha", "pele"],
    stufen: ALLE,
  },
  {
    thema: "O desporto",
    woerter: ["futebol", "golo", "bola", "equipa", "árbitro", "estádio", "treinador", "natação", "ciclismo", "surf", "atletismo", "corrida", "ténis", "andebol", "basquetebol", "voleibol", "judo", "canoagem", "ginástica", "campeão", "medalha", "maratona", "adepto"],
    stufen: ALLE,
  },
  {
    thema: "As festas",
    woerter: ["arraial", "manjerico", "sardinhada", "marchas", "balão", "fogueira", "consoada", "presépio", "presente", "rabanadas", "filhós", "folar", "amêndoas", "carnaval", "máscara", "desfile", "aniversário", "vela", "bolo", "foguetes", "romaria", "feira", "festa", "convite"],
    stufen: ALLE,
  },
  {
    thema: "As profissões",
    woerter: ["professor", "professora", "médica", "médico", "enfermeira", "enfermeiro", "pescador", "pescadora", "agricultor", "agricultora", "bombeiro", "bombeira", "padeiro", "padeira", "cozinheira", "cozinheiro", "carteiro", "engenheira", "motorista", "canalizador", "eletricista", "advogada", "juíza", "programadora"],
    stufen: ALLE,
  },
  {
    thema: "A natureza",
    woerter: ["árvore", "flor", "folha", "ramo", "raiz", "semente", "erva", "relva", "floresta", "bosque", "lago", "rio", "cascata", "pedra", "rocha", "terra", "montanha", "gruta", "musgo", "cogumelo", "papoila", "girassol", "sobreiro", "oliveira", "amendoeira"],
    stufen: ALLE,
  },
  {
    thema: "A roupa",
    woerter: ["camisola", "camisa", "calças", "saia", "vestido", "casaco", "sapatos", "sapatilhas", "botas", "meias", "chapéu", "gorro", "cachecol", "luvas", "pijama", "fato", "gravata", "cinto", "boné", "calções", "biquíni", "impermeável", "chinelos"],
    stufen: ALLE,
  },
];
