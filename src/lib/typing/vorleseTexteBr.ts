/**
 * ★ F58 (29.10.2026): die Ansagen der Sprachausgabe auf Portugiesisch (Brasilien, Weg „br") - nach Glossar
 * `recherche-portugiesisch-brasilien-2026-10-25/GLOSSAR-pt-BR.md`; ⚠️ Lese-Abnahme durch eine Person mit brasilianischem
 * Portugiesisch als Erstsprache steht aus.
 *
 * Ton: „você" (Glossar §1 Regel 1), kurze Sätze für Stimme UND Braillezeile, kein Geschlecht des Kindes (Regel 2: Adjektive nur am
 * Ding - „leitura ativada", „medalha"), nur Bindestrich, nie ein Punkt direkt hinter einer Zahl (Ordnungszahl).
 */
import type { VorleseTexteNeun } from "./vorleseTexteNeun";

export const VORLESE_TEXTE_BR: VorleseTexteNeun = {
  ansagen: {
    // --- Vorlesen selbst ---
    // Glossar §2.8: Schalter „Leitura em voz alta"; Zustand als Adjektiv am Ding (f.): ativada / desativada.
    vorlesenAn: "Leitura em voz alta ativada.",
    vorlesenAnMitFeldern:
      "Leitura em voz alta ativada: letras, palavras, frases, velocidade e voz logo abaixo.",
    vorlesenAus: "Leitura em voz alta desativada. As configurações abaixo sumiram.",
    woerterAn: "Leitura das palavras: ativada.",
    woerterAus: "Leitura das palavras: desativada.",
    saetzeAn: "Leitura das frases: ativada.",
    saetzeAus: "Leitura das frases: desativada.",
    tempoProbe: "Assim é a velocidade da minha leitura agora.",
    stimmeProbe: "Olá! É assim que esta voz soa.",

    // --- Inhaltswechsel mitten in der Runde ---
    // „palavras inventadas" = Unsinnwörter (wie ES „palabras inventadas").
    jetztEchteWoerter: "Atenção, agora palavras de verdade.",
    jetztUnsinnwoerter: "Atenção, agora palavras inventadas.",
    jetztZahlen: "Atenção, agora números.",

    // --- Ton und Anzeige ---
    tonAn: "Som ativado.",
    tonAus: "Som desativado.",
    // Glossar §2.8: „clique das teclas" als Geräusch erlaubt.
    tippKlickAn: "Clique das teclas ativado.",
    tippKlickAus: "Clique das teclas desativado.",
    melodieAn: "Melodia ativada. Ela toca no ouvido direito.",
    melodieAus: "Melodia desativada.",
    // Glossar §2.8: „cores dos dedos".
    fingerFarbenAn: "Cores dos dedos: ativadas.",
    fingerFarbenAus: "Cores dos dedos: desativadas.",
    kleinsteGroesse: "Tamanho mínimo alcançado.",
    groessteGroesse: "Tamanho máximo alcançado.",
    // Glossar §2.2: „Com calma" (Zeit lassen).
    zeitLassenAn: "Com calma: ativado.",
    zeitLassenAus: "Com calma: desativado.",
    // Glossar §2.1: „Digitar com uma mão".
    einhandAn: "Digitar com uma mão: ativado.",
    einhandAus: "Digitar com uma mão: desativado.",

    // --- Bereiche und Wege ---
    // Wie der Knopf in der Kopfzeile (Glossar §2.5/§2.6: „Configurações", „Meu progresso").
    einstellungenGeoeffnet: "Configurações abertas.",
    einstellungenGeschlossen: "Configurações fechadas.",
    // Glossar §2.4: Abzeichen = „medalha".
    statistik: "Meu progresso. Suas medalhas.",
    podcastGeoeffnet: "Podcast de introdução aberto.",
    // Glossar §2.3: „Placas de gelo".
    eisschollenSpiel: "Placas de gelo.",
    // Glossar §2.5: „Sessão encerrada." (nie „desconectado" - gegendert).
    abgemeldet: "Sessão encerrada.",
    passwortGeaendert: "Senha alterada.",
    wirdGesendet: "Enviando...",
    kontoErstellen: "Criar conta: nome, e-mail, senha, repetir a senha.",
    anmelden: "Entrar: e-mail, senha.",
    belohnungKeins: "Jogo de recompensa: nenhum.",

    // --- Übungsarten ---
    modusAdaptiv: "Meu treino.",
    modusBuecherei: "Histórias e curiosidades.",
    modusWortspiele: "Jogos de palavras.",

    // --- Zeit und Fortschritt ---
    letzteZeile: "Última linha.",
  },

  // Doppelpunkt statt Punkt: „5." wäre die Ordnungszahl (Glossar §4).
  schritt: (nummer, gesamt, titel) => `Passo ${nummer} de ${gesamt}: ${titel}`,

  tastatur: (kurz) => `Teclado: ${kurz}.`,

  // Glossar §2.2: „ponto de partida".
  start: (label) => `Ponto de partida: ${label}.`,

  // Glossar §2.5/§1 Regel 12: „Conta conectada: …" - Name nach Doppelpunkt, ohne Artikel, nie gebeugt.
  angemeldet: (name) => `Conta conectada: ${name}.`,

  // Glossar §2.3: „jogo de recompensa".
  belohnungsspiel: (label) => `Jogo de recompensa: ${label}.`,

  // „Linha 3 de 12, faltam 9 linhas." - Komma hinter der Gesamtzahl. Glossar §1 Regel 13: Null nicht über Mehrzahl-Regel,
  // darum steht „letzte" ausdrücklich (rest <= 0). Aufgaben heißen „questão" (Glossar §2.2 „Questão 3 de 6").
  stand: (aktuell, gesamt, art) => {
    const [eins, viele] = art === "zeile" ? ["linha", "linhas"] : ["questão", "questões"];
    const kopf = `${eins[0].toUpperCase()}${eins.slice(1)}`;
    const rest = Math.max(0, gesamt - aktuell);
    const schwanz =
      rest > 1
        ? `faltam ${rest} ${viele}.`
        : rest === 1
          ? `falta ${rest} ${eins}.`
          : `última ${eins}.`;
    return `${kopf} ${aktuell} de ${gesamt}, ${schwanz}`;
  },

  // Glossar §2.2: „tempo de prática".
  uebezeit: (zeit) => `Tempo de prática: ${zeit}`,

  // Glossar §2.2: „nível"; „Você está melhorando" verrät kein Geschlecht (Gerundium = BR, Regel 1).
  aufstieg: (sober) =>
    sober
      ? "Nível novo: próximo nível de prática. "
      : "Nível novo! Você está melhorando cada vez mais. ",

  // Glossar §2.4: „medalha"; Name nach Doppelpunkt; kein Komma vor „e" (Regel 7).
  neueAbzeichen: (namen, gesamt, rest, ende) => {
    const kopf = gesamt === 1 ? "Nova medalha: " : "Novas medalhas: ";
    // F58-Abnahme: ein Hauptwort hinter der Zahl - „… 3." am Ende wäre eine Ordnungszahl (Wächter F58 §7).
    const mehr = rest > 0 ? ` e mais ${rest} ${rest === 1 ? "medalha" : "medalhas"}` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  },

  // Glossar §2.2: „precisão", „toques por minuto" (Regel 6). Komma hinter dem Prozentwert, am Ende „minuto", nie die Zahl.
  werte: (treffsicherheit, tempo) =>
    ` Precisão ${treffsicherheit}, ${tempo} ${tempo === 1 ? "toque" : "toques"} por minuto.`,

  // Glossar §2.9: Tastenname „Shift"/„Caps Lock" wie auf der Kappe, mit Kopfwort „a tecla" (beim Erklären).
  umschaltSeite: (zeichenName, seiteLinks) =>
    `Quase! ${zeichenName} precisa da tecla Shift ${seiteLinks ? "esquerda" : "direita"}, ` +
    "não da outra e não da tecla Caps Lock.",
};
