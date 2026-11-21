/**
 * ★ G3c-VERTEILER (25.10.2026): DER RATE-WORTSCHATZ DER EXPEDITION (Polarstation) AUF WEG „br" (Portugiesisch (Brasilien)) - Einhängepunkt.
 *
 * ★ O-INHALT-BR (29.10.2026): gefüllt nach Vorbild `WORDS_CS_EXPEDITION` (`expedition/words.ts`). Je Sprosse der Reihenfolge
 * des Weges (Rate-Buchstaben: a-z und ç - eigene Taste ohne Umschalt; Buchstaben mit Akzent kommen über eine Totaste und bleiben draussen) die Wörter, die mit der neuen Taste erst tippbar werden - ausgewählt
 * aus dem eigenen Übungswortschatz (`wordsBr.ts`: `WORDS_BR` und `STUFE_VOCAB_BR`, aus `tf-fest` `stufenWoerter`/`wortschatz`),
 * bevorzugt Dinge, Tiere, Wetter und Orte, die zur Szene passen.
 * Regeln (Wächter `tests/tastenflow-expedition-pt-br-sv.test.ts`): klein, 2 bis 6 Buchstaben, nur a-z und ç; jedes Wort steht im
 * Übungswortschatz des Weges (das Vorlese-Lexikon kennt die neun Wege noch nicht - F8); nichts aus der Sperrliste, kein Tier als
 * Schimpfwort, nichts über Tod, Waffen, Rausch, Glaube; keine zwei Wörter aus denselben Buchstaben.
 * ⚠️ Gegen das Sprachwissen des Baus gewählt; die Lese-Abnahme durch eine Person mit der Sprache als Erstsprache steht aus.
 * Verteiler: `expedition/words.ts` (`RATE_VORRAT`, Wörter UND Stimme `"br"`).
 */

export const WORDS_BR_EXPEDITION: readonly string[] = [
  // nach e
  "seda", "sela", "sede", "fase", "defesa", "leal",
  // nach o
  "sol", "loja", "dedo", "solo", "selo", "soda", "laço", "aço", "osso", "fofo", "dado", "lado", "dose",
  // nach r
  "rosa", "flor", "rede", "ferro", "raça", "frase", "roda", "solar", "arara", "lar", "real",
  // nach i
  "dia", "rio", "fio", "frio", "fila", "areia", "ideia", "feira", "aldeia", "rei", "raio", "ideal",
  // nach m
  "mar", "mesa", "mil", "filme", "alma", "som", "modo", "meia", "amor", "forma",
  // nach t
  "tio", "tia", "foto", "sete", "teatro", "skate", "estojo", "festa", "arte", "trem", "time", "teste", "terra",
  // nach n
  "noite", "nome", "janela", "onda", "nota", "jornal", "sinal", "ano", "final", "menina", "menino", "onça", "monte", "norte",
  // nach u
  "lua", "rua", "sul", "tatu", "funk", "surfe", "museu", "aula", "turma", "lousa", "futuro", "fundo",
  // nach c
  "casa", "cama", "carro", "carta", "caneta", "cinema", "doce", "cocada", "tucano", "caju", "suco", "clima", "escola", "cinco", "centro",
  // nach p
  "pai", "papel", "pipa", "sapo", "pipoca", "peteca", "paçoca", "praia", "primo", "prima", "porta", "ponto", "campo", "plano", "roupa",
  // nach v
  "vento", "vela", "vacina", "nuvem", "cavalo", "frevo", "povo", "livro", "jovem", "vida", "novo",
  // nach q
  "quadra", "quarto", "quente", "equipe", "quase",
  // nach h
  "chuva", "chave", "folha", "ilha", "joelho", "julho", "junho", "milho", "rainha", "coelho", "concha", "hotel", "sonho",
  // nach g
  "gato", "gata", "gelo", "grama", "tigre", "manga", "fogo", "jogo", "grupo", "viagem", "amigo", "amiga",
  // nach b
  "bola", "bolo", "banana", "goiaba", "samba", "boto", "jabuti", "abelha", "boneca", "barco", "banco", "branco", "braço", "bolsa", "cabelo",
  // nach z
  "pizza", "zero", "zona", "cruz", "arroz", "atriz", "doze", "luz", "voz", "paz", "azul", "nariz", "beleza",
  // nach x
  "lixo", "peixe", "caixa", "mexer", "exame", "extra", "baixo", "sexta", "exato",
  // nach y
  "yoga", "hobby", "byte",
  // nach w
  "kiwi", "web", "watt", "show",
];
