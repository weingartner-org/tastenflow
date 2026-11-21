/**
 * ★ F58 (29.10.2026): die Ansagen der Sprachausgabe auf Portugiesisch (Portugal, Weg „pt") - nach Glossar
 * `recherche-portugiesisch-2026-10-25/GLOSSAR-pt.md`; ⚠️ Lese-Abnahme durch eine Person mit Portugiesisch als Erstsprache steht aus.
 *
 * Regeln in Kürze: Kinder werden geduzt (tu, Glossar §1.1); kein Adjektiv/Partizip am Kind (§1.2) - Schalter stehen als „Name: ligado/
 * desligado" (Adjektiv am Ding, nach Doppelpunkt); nur Bindestrich; nie ein Punkt direkt hinter einer Zahl (Ordnungszahl) - darum
 * „Passo 2 de 5: Titel" und in `stand` ein KOMMA hinter der Gesamtzahl; Tastennamen wie auf der Kappe mit Kopfwort „tecla" (§1.11, §2.9).
 */
import type { VorleseTexteNeun } from "./vorleseTexteNeun";

/** Erster Buchstabe groß (Satzanfang), der Rest bleibt. */
function gross(s: string): string {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

export const VORLESE_TEXTE_PT: VorleseTexteNeun = {
  ansagen: {
    // --- Vorlesen selbst --- (Glossar §2.8 „Leitura em voz alta")
    vorlesenAn: "Leitura em voz alta ligada.",
    vorlesenAnMitFeldern:
      "Leitura em voz alta ligada. Abaixo: palavras, frases, tecla a tecla, velocidade da voz e voz.",
    vorlesenAus: "Leitura em voz alta desligada. As definições abaixo desapareceram.",
    woerterAn: "Leitura das palavras: ligada.",
    woerterAus: "Leitura das palavras: desligada.",
    saetzeAn: "Leitura das frases: ligada.",
    saetzeAus: "Leitura das frases: desligada.",
    tempoProbe: "É assim a velocidade a que leio agora.",
    stimmeProbe: "Olá! Assim soa esta voz.",

    // --- Inhaltswechsel mitten in der Runde ---
    jetztEchteWoerter: "Atenção, agora palavras verdadeiras.",
    jetztUnsinnwoerter: "Atenção, agora palavras inventadas.",
    jetztZahlen: "Atenção, agora números.",

    // --- Ton und Anzeige ---
    tonAn: "Som: ligado.",
    tonAus: "Som: desligado.",
    tippKlickAn: "Som das teclas: ligado.",
    tippKlickAus: "Som das teclas: desligado.",
    melodieAn: "Melodia: ligada. Toca no ouvido direito.",
    melodieAus: "Melodia: desligada.",
    fingerFarbenAn: "Cores dos dedos: ligadas.",
    fingerFarbenAus: "Cores dos dedos: desligadas.",
    kleinsteGroesse: "Tamanho mínimo atingido.",
    groessteGroesse: "Tamanho máximo atingido.",
    // „Zeit lassen" = „Com calma" (Glossar §2.2)
    zeitLassenAn: "Com calma: ligado.",
    zeitLassenAus: "Com calma: desligado.",
    einhandAn: "Escrever com uma mão: ligado.",
    einhandAus: "Escrever com uma mão: desligado.",

    // --- Bereiche und Wege ---
    einstellungenGeoeffnet: "Definições abertas.",
    einstellungenGeschlossen: "Definições fechadas.",
    statistik: "Os meus progressos. As tuas medalhas.",
    podcastGeoeffnet: "Podcast de introdução aberto.",
    eisschollenSpiel: "Blocos de gelo.",
    // „Sessão terminada." - kein Partizip am Kind (Glossar §1.2, §2.5)
    abgemeldet: "Sessão terminada.",
    passwortGeaendert: "Palavra-passe alterada.",
    wirdGesendet: "A enviar...",
    kontoErstellen: "Criar conta: nome, endereço de e-mail, palavra-passe, repetição da palavra-passe.",
    anmelden: "Iniciar sessão: endereço de e-mail, palavra-passe.",
    belohnungKeins: "Jogo-prémio: nenhum.",

    // --- Übungsarten ---
    modusAdaptiv: "O meu treino.",
    modusBuecherei: "Histórias e curiosidades.",
    modusWortspiele: "Jogos de palavras.",

    // --- Zeit und Fortschritt ---
    letzteZeile: "Última linha.",
  },

  // „Passo 2 de 5: Título" - Doppelpunkt statt Punkt, sonst wird „5." zur Ordnungszahl.
  schritt: (nummer, gesamt, titel) => `Passo ${nummer} de ${gesamt}: ${titel}`,

  tastatur: (kurz) => `Teclado: ${kurz}.`,

  // Glossar §2.2: Startpunkt = „ponto de partida"
  start: (label) => `Ponto de partida: ${label}.`,

  // Glossar §2.12 „Sessão iniciada: …" - Name nach Doppelpunkt, ohne Artikel (§1.12)
  angemeldet: (name) => `Sessão iniciada: ${name}.`,

  belohnungsspiel: (label) => `Jogo-prémio: ${label}.`,

  // „Linha 3 de 12, faltam 9 linhas." - Verb zieht mit der Zahl mit (Glossar §2.11/§2.12); KOMMA hinter der Gesamtzahl.
  stand: (aktuell, gesamt, art) => {
    const eins = art === "zeile" ? "linha" : "pergunta"; // Glossar §2.2: „Pergunta 3 de 6" (nie „tarefa")
    const viele = art === "zeile" ? "linhas" : "perguntas";
    const rest = Math.max(0, gesamt - aktuell);
    const schwanz =
      rest > 0
        ? rest === 1
          ? `falta ${rest} ${eins}.`
          : `faltam ${rest} ${viele}.`
        : `última ${eins}.`;
    return `${gross(eins)} ${aktuell} de ${gesamt}, ${schwanz}`;
  },

  uebezeit: (zeit) => `Tempo de prática: ${zeit}`,

  aufstieg: (sober) =>
    sober
      ? "Subida de nível: nível seguinte. "
      : "Subida de nível! Estás a melhorar cada vez mais. ",

  // Glossar §2.4: „medalha"; „Nova medalha: Rato de biblioteca" - Name nach Doppelpunkt
  neueAbzeichen: (namen, gesamt, rest, ende) => {
    const kopf = gesamt === 1 ? "Nova medalha: " : "Novas medalhas: ";
    // F58-Abnahme: ein Hauptwort hinter der Zahl - „… 3." am Ende wäre eine Ordnungszahl (Wächter F58 §7).
    const mehr = rest > 0 ? ` e mais ${rest} ${rest === 1 ? "medalha" : "medalhas"}` : "";
    return " " + kopf + namen.join(", ") + mehr + ende;
  },

  // Glossar §2.2: „precisão", „toques por minuto" (nie PPM); der Wert kommt fertig („95%")
  werte: (treffsicherheit, tempo) =>
    ` Precisão: ${treffsicherheit}, velocidade: ${tempo} ${tempo === 1 ? "toque" : "toques"} por minuto.`,

  // Glossar §1.11/§2.9: Tastenname nie gebeugt, mit Kopfwort „tecla"; Shift, Caps Lock wie auf der Kappe.
  umschaltSeite: (zeichenName, seiteLinks) =>
    `Quase! ${gross(zeichenName)} precisa da tecla Shift ${seiteLinks ? "esquerda" : "direita"}, ` +
    "não da outra e não da tecla Caps Lock.",
};
