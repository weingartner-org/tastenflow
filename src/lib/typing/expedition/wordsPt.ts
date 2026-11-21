/**
 * ★ G3c-VERTEILER (25.10.2026): DER RATE-WORTSCHATZ DER EXPEDITION (Polarstation) AUF WEG „pt" (Portugiesisch (Portugal)) - Einhängepunkt.
 *
 * ★ O-INHALT-PT (29.10.2026): gefüllt nach Vorbild `WORDS_CS_EXPEDITION` (`expedition/words.ts`). Je Sprosse der Reihenfolge
 * des Weges (Rate-Buchstaben: a-z und ç - eigene Taste ohne Umschalt; Buchstaben mit Akzent kommen über eine Totaste und bleiben draussen) die Wörter, die mit der neuen Taste erst tippbar werden - ausgewählt
 * aus dem eigenen Übungswortschatz (`wordsPt.ts`: `WORDS_PT` und `STUFE_VOCAB_PT`, aus `tf-fest` `stufenWoerter`/`wortschatz`),
 * bevorzugt Dinge, Tiere, Wetter und Orte, die zur Szene passen.
 * Regeln (Wächter `tests/tastenflow-expedition-pt-br-sv.test.ts`): klein, 2 bis 6 Buchstaben, nur a-z und ç; jedes Wort steht im
 * Übungswortschatz des Weges (das Vorlese-Lexikon kennt die neun Wege noch nicht - F8); nichts aus der Sperrliste, kein Tier als
 * Schimpfwort, nichts über Tod, Waffen, Rausch, Glaube; keine zwei Wörter aus denselben Buchstaben.
 * ⚠️ Gegen das Sprachwissen des Baus gewählt; die Lese-Abnahme durch eine Person mit der Sprache als Erstsprache steht aus.
 * Verteiler: `expedition/words.ts` (`RATE_VORRAT`, Wörter UND Stimme `"pt"`).
 */

export const WORDS_PT_EXPEDITION: readonly string[] = [
  // nach e
  "seda", "sela", "sede", "fase", "leal", "desde",
  // nach o
  "sol", "loja", "dedo", "solo", "selo", "soda", "sola", "laço", "aço", "fofo", "fado", "dado", "lado",
  // nach r
  "rosa", "flor", "rede", "ferro", "raça", "frase", "farol", "lar", "real", "solar", "ler",
  // nach i
  "dia", "rio", "fio", "frio", "fila", "areia", "ideia", "feira", "aldeia", "rei", "raio", "ideal", "sair",
  // nach m
  "mar", "mel", "mesa", "mil", "filme", "jardim", "almoço", "amor", "forma",
  // nach t
  "tio", "tia", "rato", "tomate", "leite", "metro", "kit", "estojo", "festa", "sorte", "terra", "lista", "tarde", "alto", "teste",
  // nach n
  "noite", "nome", "janela", "dente", "onda", "nota", "jornal", "sinal", "ano", "final", "menina", "linda", "nadar", "jantar",
  // nach u
  "lua", "rua", "sul", "sumo", "fruta", "atum", "outono", "ouriço", "aluno", "aluna", "turma", "mundo", "futuro", "fundo",
  // nach c
  "casa", "cama", "carro", "carta", "caneta", "cinema", "oceano", "doce", "cereja", "lince", "coruja", "corda", "cor", "clima", "escola", "cinco",
  // nach p
  "pai", "papel", "sopa", "pato", "copo", "praia", "pera", "porto", "ponte", "raposa", "primo", "prima", "pasta", "pastel", "plano", "porta",
  // nach v
  "vento", "verde", "polvo", "voar", "vela", "cravo", "nuvem", "uva", "neve", "livro", "cavalo", "vida", "novo",
  // nach q
  "queijo", "quinta", "quente", "quatro", "parque", "equipa", "quase",
  // nach h
  "chuva", "ilha", "ovelha", "coelho", "horta", "lanche", "concha", "moinho", "chave", "hotel", "sonho",
  // nach g
  "gelo", "gato", "golo", "gelado", "fogo", "jogo", "grupo", "viagem", "amigo", "amiga", "lugar", "longe",
  // nach b
  "bola", "bolo", "banana", "batata", "boneca", "barco", "banco", "baleia", "abelha", "boca", "cabelo", "clube", "branco",
  // nach z
  "zebra", "arroz", "azeite", "cozido", "azul", "nariz", "luz", "voz", "paz", "zero", "onze", "treze", "dez", "beleza",
  // nach x
  "lixo", "peixe", "caixa", "xadrez", "xarope", "xaile", "roxo", "exame", "extra", "baixo",
  // nach y
  "yoga", "hobby", "rugby",
  // nach w
  "kiwi", "web", "watt", "show",
];
