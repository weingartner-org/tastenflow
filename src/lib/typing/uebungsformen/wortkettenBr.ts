/**
 * ★ D-LERNDATEN (25.10.2026): DIE WORTKETTEN (Themen-Wortfelder) des Weges „br" (Portugiesisch (Brasilien)) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/pt-BR/tf-fest-pt-BR.json`, Schlüssel `themenWortfelder` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - sprachlich sauber, strikt brasilianisch, tippbar (0 Fehler), Reihenfolge 0 Verstöße, Sperrliste 0 Treffer.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wortkettenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Portugiesisch (Brasilien) als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Wie viele Wörter je Hand einhändig sind, hängt an der Tastatur des Weges (G3b, `fingerForChar`) - gemessen wird es erst, wenn
 * die Tastaturen der Sprache stehen.
 *
 * Verteiler: `handschwerpunkte.ts` (filtert die Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?brasilianisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-br.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_BR: Wortkette[] = [
  {
    thema: "Os animais do Brasil",
    woerter: ["capivara", "onça", "tatu", "tamanduá", "tucano", "arara", "jacaré", "tuiuiú", "sabiá", "papagaio", "seriema", "tartaruga", "golfinho", "boto", "anta", "ararinha", "lontra", "preguiça", "jabuti", "quati", "gavião", "bem-te-vi", "beija-flor"],
    stufen: ALLE,
  },
  {
    thema: "A casa",
    woerter: ["casa", "sala", "quarto", "cozinha", "banheiro", "varanda", "quintal", "janela", "porta", "telhado", "escada", "cadeira", "mesa", "sofá", "cama", "geladeira", "fogão", "rede", "armário", "tapete", "garagem"],
    stufen: ALLE,
  },
  {
    thema: "A escola",
    woerter: ["escola", "aula", "professor", "professora", "aluno", "aluna", "caderno", "lápis", "borracha", "caneta", "mochila", "estojo", "régua", "lousa", "recreio", "merenda", "quadra", "turma", "livro", "biblioteca", "apontador"],
    stufen: ALLE,
  },
  {
    thema: "À mesa",
    woerter: ["arroz", "feijão", "farofa", "pão", "queijo", "tapioca", "cuscuz", "mandioca", "macarrão", "salada", "ovo", "frango", "peixe", "suco", "leite", "café", "bolo", "brigadeiro", "pamonha", "canjica"],
    stufen: ALLE,
  },
  {
    thema: "As frutas",
    woerter: ["banana", "manga", "caju", "goiaba", "maracujá", "abacaxi", "melancia", "mamão", "laranja", "acerola", "açaí", "pitanga", "jabuticaba", "cajá", "graviola", "uva", "limão", "coco", "tangerina", "pera", "maçã"],
    stufen: ALLE,
  },
  {
    thema: "A praia e o mar",
    woerter: ["praia", "mar", "onda", "areia", "coqueiro", "concha", "barco", "jangada", "pescador", "rede", "peixe", "sol", "guarda-sol", "chinelo", "boia", "caranguejo", "farol", "ilha", "maré", "baía"],
    stufen: ALLE,
  },
  {
    thema: "A floresta e o rio",
    woerter: ["floresta", "rio", "árvore", "folha", "raiz", "cipó", "cachoeira", "canoa", "margem", "chuva", "sombra", "trilha", "mata", "ninho", "pântano", "lagoa", "ipê", "castanha", "vitória-régia"],
    stufen: ALLE,
  },
  {
    thema: "A cidade",
    woerter: ["cidade", "rua", "praça", "calçada", "ônibus", "metrô", "ponto", "prédio", "padaria", "mercado", "feira", "farmácia", "banco", "hospital", "escola", "parque", "semáforo", "bicicleta", "prefeitura", "bairro"],
    stufen: ALLE,
  },
  {
    thema: "O tempo e as estações",
    woerter: ["sol", "chuva", "vento", "nuvem", "calor", "frio", "trovão", "relâmpago", "garoa", "arco-íris", "primavera", "verão", "outono", "inverno", "manhã", "tarde", "noite", "seca", "temporal", "neblina"],
    stufen: ALLE,
  },
  {
    thema: "A família",
    woerter: ["família", "mãe", "pai", "irmão", "irmã", "avó", "avô", "filho", "filha", "tio", "tia", "primo", "prima", "neto", "neta", "bebê", "madrinha", "padrinho", "sobrinho", "sobrinha", "enteado"],
    stufen: ALLE,
  },
  {
    thema: "O corpo",
    woerter: ["cabeça", "cabelo", "olho", "nariz", "boca", "orelha", "dente", "língua", "pescoço", "ombro", "braço", "mão", "dedo", "barriga", "perna", "joelho", "pé", "coração", "pulmão", "costas"],
    stufen: ALLE,
  },
  {
    thema: "Os esportes",
    woerter: ["futebol", "vôlei", "basquete", "natação", "capoeira", "skate", "surfe", "corrida", "judô", "tênis", "ginástica", "bola", "gol", "goleiro", "time", "torcida", "campeonato", "medalha", "quadra", "árbitro"],
    stufen: ALLE,
  },
  {
    thema: "As festas",
    woerter: ["carnaval", "arraial", "quadrilha", "fogueira", "bandeirinha", "pipoca", "quentão", "ceia", "presente", "panetone", "ovo", "aniversário", "bolo", "vela", "frevo", "samba", "maracatu", "bumba-meu-boi", "desfile", "fantasia"],
    stufen: ALLE,
  },
  {
    thema: "As profissões",
    woerter: ["professor", "professora", "médica", "médico", "enfermeira", "enfermeiro", "bombeiro", "bombeira", "motorista", "cozinheira", "cozinheiro", "agricultora", "pescador", "costureira", "engenheira", "advogado", "jornalista", "dentista", "vendedor", "carteiro"],
    stufen: ALLE,
  },
  {
    thema: "As roupas",
    woerter: ["camiseta", "bermuda", "calça", "vestido", "saia", "blusa", "casaco", "jaqueta", "meia", "tênis", "chinelo", "sandália", "boné", "chapéu", "pijama", "uniforme", "maiô", "sunga", "cachecol", "luva"],
    stufen: ALLE,
  },
];
