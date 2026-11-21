/**
 * Der RÄTSEL-BILDSCHIRM - für alle Übungsformen, bei denen ein Kind nicht
 * abschreibt, sondern antwortet: das Fingerdiktat („rechter Mittelfinger" →
 * `k`) und die Lückentext-Rätsel („Giraffen haben einen langen ..." → `Hals`).
 *
 * ★★★ Warum es ihn überhaupt gibt: In der gewohnten Tippzeile steht immer der
 * Text, der zu tippen ist. Bei diesen beiden Formen DARF die Lösung nicht
 * dastehen - sonst ist es Abschreiben statt Können. Frage und Antwort müssen
 * also auseinanderfallen. Zwei Formen teilen sich einen Bildschirm, statt
 * zweimal dasselbe zu bauen.
 *
 * Für ein Kind mit Blindheit ist die ANSAGE die Aufgabe: Die Frage wird bei
 * jedem Wechsel gesprochen, und die Auflösung danach ebenso. Sehende lesen
 * dieselbe Frage gross auf der Karte - niemand hat etwas voraus.
 *
 * ★ Nie etwas gegen ein Kind: Eine falsche Antwort heisst hier nicht „falsch".
 * Nach dem zweiten Fehlversuch nennt die App die Lösung selbst und geht weiter -
 * eine Aufgabe, an der ein Kind hängen bleibt, übt nichts mehr.
 *
 * Fokus-Führung (R1-R6, Pflicht in jeder App): Beim Aufbau und nach jedem
 * Aufgabenwechsel geht der Fokus in das Antwortfeld, ausdrücklich per
 * `setTimeout(0)` - nicht in der Hoffnung, das neue Feld hole ihn sich selbst.
 * ESC führt ebenfalls dorthin. Nichts ist je `disabled`.
 */
import { feinesLangAttribut } from "@/lib/typing/schreibweise";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ansageAufgabenstand,
  needsShift,
  speakChar,
  notePracticeActivity,
  shiftHandFor,
  speakUi,
  takePracticeDelta,
  type Lang,
  type TaskEvent,
} from "@/lib/typing";
import type { RaetselAufgabe } from "@/lib/typing/uebungsformen/typen";
import { formNameZuTitel } from "@/lib/typing/uebungsformen/namen";
import {
  ausTeilen,
  inTeile,
  inhalt,
  type TextTeil,
} from "@/lib/typing/uebungsformen/bedienung";
import {
  fehlerAnsage,
  fehlerSatz,
  findeFehlerstelle,
} from "@/lib/typing/fehlerstelle";
import { texte } from "@/lib/bedienSprache";
import {
  laufweiteFeld,
  laufweiteText,
  type ZeichenabstandFaktor,
} from "@/lib/typing/zeichenabstand";
import {
  TeileText,
  sprechStuecke,
  useNacheinanderSprechen,
  useWortspielSprache,
} from "./wortspielSprache";
import { CviAbdunkeln } from "./CviAbdunkeln";
import {
  CviLesezeileAbdunkeln,
  useLeseZeile,
} from "./CviLesezeile";
import { istEinzeiligesTextfeld } from "@/lib/typing/leseZeile";
import { playErrorSound, playSuccessSound } from "@/lib/typing/sound";
import { useFeststelltasteWarnung } from "./FeststelltasteWarnung";
import { Merkfenster } from "./Merkfenster";
import { lesezeileFenster } from "@/lib/typing/merkfensterTexte";
import { lesezeileGesehen, merkeLesezeileGesehen } from "@/lib/typing/merkfenster";
import { useAnrede } from "./useAnrede";

/**
 * Die Texte des Rätsel-Bildschirms in beiden Bedienungssprachen (EN4,
 * 18.09.2026). Deutsch wortgleich wie vorher.
 *
 * ⚠️ Vor EN4 stand hier `lang === "en" ? … : …` - die ÜBUNGSSPRACHE wählte die
 * Sprache der Knöpfe. Ohne aktiven Sprachbereich bleibt das so
 * (`useWortspielSprache`), in Tastenflow entscheidet die Bedienung.
 */
const RAETSEL_TEXTE = texte({
  de: {
    aufgabeVon: (nr: number, gesamt: number) => `Aufgabe ${nr} von ${gesamt}`,
    deineAntwort: "Deine Antwort",
    pruefen: "Prüfen",
    zurueck: "Zurück zum Üben",
    richtig: "Richtig.",
    umschaltLinks:
      "Das Wort stimmt - nimm für den großen Buchstaben die LINKE Umschalttaste.",
    umschaltRechts:
      "Das Wort stimmt - nimm für den großen Buchstaben die RECHTE Umschalttaste.",
    fastSchreibung: "Fast - achte auf die Großschreibung.",
    antwortIst: (antwort: string) => `Die Antwort ist: ${antwort}.`,
    nochNicht: "Noch nicht. Versuch es nochmal.",
  },
  en: {
    aufgabeVon: (nr: number, gesamt: number) => `Question ${nr} of ${gesamt}`,
    deineAntwort: "Your answer",
    pruefen: "Check",
    zurueck: "Back to practice",
    richtig: "That's right.",
    umschaltLinks: "The word is right - use the LEFT Shift key for the capital letter.",
    umschaltRechts: "The word is right - use the RIGHT Shift key for the capital letter.",
    fastSchreibung: "Almost - check the capital letters.",
    antwortIst: (antwort: string) => `The answer is: ${antwort}.`,
    nochNicht: "Not yet. Have another go.",
  },
  fr: {
    aufgabeVon: (nr: number, gesamt: number) => `Question ${nr} sur ${gesamt}`,
    deineAntwort: "Ta réponse",
    pruefen: "Vérifier",
    zurueck: "Retour à l'exercice",
    richtig: "Exact.",
    umschaltLinks:
      "Le mot est bon - utilise la touche Maj GAUCHE pour la lettre en majuscule.",
    umschaltRechts:
      "Le mot est bon - utilise la touche Maj DROITE pour la lettre en majuscule.",
    fastSchreibung: "Presque - fais attention aux majuscules.",
    antwortIst: (antwort: string) => `La réponse est : ${antwort}.`,
    nochNicht: "Pas encore. Réessaie.",
  },
  es: {
    aufgabeVon: (nr: number, gesamt: number) => `Pregunta ${nr} de ${gesamt}`,
    deineAntwort: "Tu respuesta",
    pruefen: "Comprobar",
    zurueck: "Volver a practicar",
    richtig: "Correcto.",
    umschaltLinks:
      "La palabra está bien - usa la tecla Mayús IZQUIERDA para la letra mayúscula.",
    umschaltRechts:
      "La palabra está bien - usa la tecla Mayús DERECHA para la letra mayúscula.",
    fastSchreibung: "Casi - fíjate en las mayúsculas.",
    antwortIst: (antwort: string) => `La respuesta es: ${antwort}.`,
    nochNicht: "Todavía no. Vuelve a intentarlo.",
  },
  it: {
    aufgabeVon: (nr: number, gesamt: number) => `Domanda ${nr} di ${gesamt}`,
    deineAntwort: "La tua risposta",
    pruefen: "Controlla",
    zurueck: "Torna all'esercizio",
    richtig: "Giusto.",
    umschaltLinks: "La parola è giusta - usa il tasto Maiusc SINISTRO per la lettera maiuscola.",
    umschaltRechts: "La parola è giusta - usa il tasto Maiusc DESTRO per la lettera maiuscola.",
    fastSchreibung: "Quasi - fai attenzione alle maiuscole.",
    antwortIst: (antwort: string) => `La risposta è: ${antwort}.`,
    nochNicht: "Non ancora. Riprova.",
  },
  // ★ O-PL (02.10.2026): „Zadanie 3 z 6", „Sprawdź", „Twoja odpowiedź", „Dobrze." /
  // „Jeszcze nie. Spróbuj ponownie." (Glossar §2.2); „Shift drugą ręką" §2.1.
  pl: {
    aufgabeVon: (nr: number, gesamt: number) => `Zadanie ${nr} z ${gesamt}`,
    deineAntwort: "Twoja odpowiedź",
    pruefen: "Sprawdź",
    zurueck: "Wróć do ćwiczeń",
    richtig: "Dobrze.",
    umschaltLinks: "Słowo jest dobre - użyj LEWEGO klawisza Shift dla wielkiej litery.",
    umschaltRechts: "Słowo jest dobre - użyj PRAWEGO klawisza Shift dla wielkiej litery.",
    fastSchreibung: "Prawie - zwróć uwagę na wielkie litery.",
    antwortIst: (antwort: string) => `Odpowiedź: ${antwort}.`,
    nochNicht: "Jeszcze nie. Spróbuj ponownie.",
  },
  // ★ O-TR (02.10.2026): "Soru 3, toplam 6", "Kontrol et", "Cevabın", "Doğru." /
  // "Henüz değil. Tekrar dene." (Glossar §2.2, nie "Yanlış!"); "Shift tuşu" §2.9.
  tr: {
    aufgabeVon: (nr: number, gesamt: number) => `Soru ${nr}, toplam ${gesamt}`,
    deineAntwort: "Cevabın",
    pruefen: "Kontrol et",
    zurueck: "Alıştırmaya dön",
    richtig: "Doğru.",
    umschaltLinks: "Kelime doğru - büyük harf için SOL Shift tuşunu kullan.",
    umschaltRechts: "Kelime doğru - büyük harf için SAĞ Shift tuşunu kullan.",
    fastSchreibung: "Neredeyse - büyük ve küçük harflere dikkat et.",
    antwortIst: (antwort: string) => `Cevap: ${antwort}.`,
    nochNicht: "Henüz değil. Tekrar dene.",
  },
  // ★ O-CS (03.10.2026): „Úloha 3/6", „Zkontrolovat", „Tvoje odpověď", „Správně." /
  // „Ještě ne. Zkus to znovu." (Glossar §2.2); „s klávesou Shift" (Regel 11). Nach der
  // Antwort kein Punkt - sie kann eine Zahl sein (Falle 4).
  cs: {
    aufgabeVon: (nr: number, gesamt: number) => `Úloha ${nr}/${gesamt}`,
    deineAntwort: "Tvoje odpověď",
    pruefen: "Zkontrolovat",
    zurueck: "Zpět ke cvičení",
    richtig: "Správně.",
    umschaltLinks: "Slovo je správně - na velké písmeno použij LEVOU klávesu Shift.",
    umschaltRechts: "Slovo je správně - na velké písmeno použij PRAVOU klávesu Shift.",
    fastSchreibung: "Skoro - dávej pozor na velká písmena.",
    antwortIst: (antwort: string) => `Odpověď je: ${antwort}`,
    nochNicht: "Ještě ne. Zkus to znovu.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      aufgabeVon: (nr: number, gesamt: number) => `Задача ${nr}/${gesamt}`,
      deineAntwort: "Твоят отговор",
      pruefen: "Провери",
      zurueck: "Обратно към упражненията",
      richtig: "Вярно.",
      umschaltLinks: "Думата е вярна - за главната буква използвай ЛЕВИЯ Shift.",
      umschaltRechts: "Думата е вярна - за главната буква използвай ДЕСНИЯ Shift.",
      fastSchreibung: "Почти - внимавай с главните букви.",
      antwortIst: (antwort: string) => `Отговорът е: ${antwort}.`,
      nochNicht: "Още не. Опитай пак.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      aufgabeVon: (nr: number, gesamt: number) => `Ερώτηση ${nr} από ${gesamt}`,
      deineAntwort: "Η απάντησή σου",
      pruefen: "Έλεγχος",
      zurueck: "Πίσω στην εξάσκηση",
      richtig: "Σωστά.",
      umschaltLinks: "Η λέξη είναι σωστή - για το κεφαλαίο γράμμα πάτησε το ΑΡΙΣΤΕΡΟ Shift.",
      umschaltRechts: "Η λέξη είναι σωστή - για το κεφαλαίο γράμμα πάτησε το ΔΕΞΙ Shift.",
      fastSchreibung: "Σχεδόν - πρόσεξε τα κεφαλαία.",
      antwortIst: (antwort: string) => `Η απάντηση είναι: ${antwort}.`,
      nochNicht: "Όχι ακόμα. Δοκίμασε ξανά.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      aufgabeVon: (nr: number, gesamt: number) => `Feladat: ${nr}/${gesamt}`,
      deineAntwort: "A válaszod",
      pruefen: "Ellenőrzés",
      zurueck: "Vissza a gyakorláshoz",
      richtig: "Helyes.",
      umschaltLinks: "A szó jó - a nagybetűhöz a BAL Shift billentyűt használd.",
      umschaltRechts: "A szó jó - a nagybetűhöz a JOBB Shift billentyűt használd.",
      fastSchreibung: "Majdnem - figyelj a nagybetűkre.",
      antwortIst: (antwort: string) => `A válasz: ${antwort}.`,
      nochNicht: "Még nem. Próbáld újra.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      aufgabeVon: (nr: number, gesamt: number) => `Vraag ${nr} van ${gesamt}`,
      deineAntwort: "Jouw antwoord",
      pruefen: "Controleren",
      zurueck: "Terug naar het oefenen",
      richtig: "Goed.",
      umschaltLinks: "Het woord klopt - gebruik voor de hoofdletter de LINKER Shift-toets.",
      umschaltRechts: "Het woord klopt - gebruik voor de hoofdletter de RECHTER Shift-toets.",
      fastSchreibung: "Bijna - let op de hoofdletters.",
      antwortIst: (antwort: string) => `Het antwoord is: ${antwort}.`,
      nochNicht: "Nog niet. Probeer het nog eens.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      aufgabeVon: (nr: number, gesamt: number) => `Pergunta ${nr} de ${gesamt}`,
      deineAntwort: "A tua resposta",
      pruefen: "Verificar",
      zurueck: "Voltar a praticar",
      richtig: "Certo.",
      umschaltLinks: "A palavra está certa - para a maiúscula, usa a tecla Shift da ESQUERDA.",
      umschaltRechts: "A palavra está certa - para a maiúscula, usa a tecla Shift da DIREITA.",
      fastSchreibung: "Quase - atenção às maiúsculas.",
      antwortIst: (antwort: string) => `A resposta é: ${antwort}.`,
      nochNicht: "Ainda não. Tenta outra vez.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      aufgabeVon: (nr: number, gesamt: number) => `Questão ${nr} de ${gesamt}`,
      deineAntwort: "Sua resposta",
      pruefen: "Verificar",
      zurueck: "Voltar a praticar",
      richtig: "Certo.",
      umschaltLinks: "A palavra está certa - para a letra maiúscula, use a tecla Shift da ESQUERDA.",
      umschaltRechts: "A palavra está certa - para a letra maiúscula, use a tecla Shift da DIREITA.",
      fastSchreibung: "Quase - preste atenção nas letras maiúsculas.",
      antwortIst: (antwort: string) => `A resposta é: ${antwort}.`,
      nochNicht: "Ainda não. Tente de novo.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      aufgabeVon: (nr: number, gesamt: number) => `Întrebarea ${nr} din ${gesamt}`,
      deineAntwort: "Răspunsul tău",
      pruefen: "Verificați",
      zurueck: "Înapoi la exersare",
      richtig: "Corect.",
      umschaltLinks: "Cuvântul este corect - pentru litera mare folosește tasta Shift din STÂNGA.",
      umschaltRechts: "Cuvântul este corect - pentru litera mare folosește tasta Shift din DREAPTA.",
      fastSchreibung: "Aproape - atenție la literele mari.",
      antwortIst: (antwort: string) => `Răspunsul este: ${antwort}.`,
      nochNicht: "Încă nu. Mai încearcă o dată.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      aufgabeVon: (nr: number, gesamt: number) => `Uppgift ${nr}/${gesamt}`,
      deineAntwort: "Ditt svar",
      pruefen: "Kontrollera",
      zurueck: "Tillbaka till övningen",
      richtig: "Rätt.",
      umschaltLinks: "Ordet är rätt - använd Skift till vänster för den stora bokstaven.",
      umschaltRechts: "Ordet är rätt - använd Skift till höger för den stora bokstaven.",
      fastSchreibung: "Nästan - tänk på stora och små bokstäver.",
      antwortIst: (antwort: string) => `Svaret är: ${antwort}.`,
      nochNicht: "Inte riktigt än. Försök igen.",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      aufgabeVon: (nr: number, gesamt: number) => `Завдання ${nr}/${gesamt}`,
      deineAntwort: "Твоя відповідь",
      pruefen: "Перевірити",
      zurueck: "Назад до тренування",
      richtig: "Правильно.",
      umschaltLinks: "Слово правильне - для великої літери використай ЛІВУ клавішу Shift.",
      umschaltRechts: "Слово правильне - для великої літери використай ПРАВУ клавішу Shift.",
      fastSchreibung: "Майже - зверни увагу на великі літери.",
      antwortIst: (antwort: string) => `Відповідь: ${antwort}.`,
      nochNicht: "Ще ні. Спробуй ще раз.",
    },
});

/** Die Auflösung einer Aufgabe in Teilen - ohne eigene Teile ist sie ganz Bedienung. */
function aufloesungAlsTeile(aufgabe: RaetselAufgabe): readonly TextTeil[] {
  return aufgabe.aufloesungTeile ?? [{ text: aufgabe.aufloesung ?? "" }];
}

/** So viele Fehlversuche, dann nennt die App die Lösung und geht weiter. */
export const RAETSEL_VERSUCHE = 2;

/**
 * Passt die Antwort? Leerraum ist immer egal, die Groß- und Kleinschreibung
 * nur dann, wenn die Form es so will (`grossKleinZaehlt`).
 *
 * Drei Ausgänge statt zwei: `nur-schreibung` ist der Fall, in dem alles
 * stimmt außer der Umschalttaste. Ein blosses „Noch nicht" wäre dort die
 * schlechteste aller Rückmeldungen - das Kind sucht den Fehler dann im Wort
 * und findet keinen. Es hört stattdessen, WORAN es liegt.
 */
export type Urteil = "richtig" | "nur-schreibung" | "nur-umschalthand" | "falsch";

/**
 * ★ Herausgereicht (exportiert) seit dem Prüfdurchgang vom 11.09.2026: Das URTEIL
 * ist die Stelle, an der eine Übung „falsch" sagt - und genau dort muss ein
 * Wächter über ALLE Formen und ALLE Tastenstände hineinsehen können, ohne
 * dreizehn Bildschirme zu bauen (`tests/typing-wortspiele-lernstand.test.ts`).
 * Die Funktion ist rein; sie bleibt die einzige Stelle, die vergleicht.
 */
export function trifft(
  eingabe: string,
  antworten: readonly string[],
  grossKleinZaehlt: boolean,
  /**
   * Wurde mindestens ein Großbuchstabe mit der FALSCHEN Umschalttaste gemacht?
   * Nur ausgewertet, wenn das Wort sonst genau stimmt - wer das falsche Wort
   * schreibt, hat ein Wort-Problem, kein Hand-Problem.
   */
  falscheHand = false,
): Urteil {
  const roh = eingabe.trim();
  if (!roh) return "falsch";
  const genau = antworten.some((a) => a.trim() === roh);
  const lose = antworten.some((a) => a.trim().toLowerCase() === roh.toLowerCase());
  if (!genau && !lose) return "falsch";
  /*
   * Die Schreibung schlägt die Hand: Erst muss das Wort stimmen, dann die Hand.
   * Sonst kämen zwei Hinweise auf einmal, und das Kind weiss nicht, welchem es
   * folgen soll - dieselbe Überlegung, aus der es `nur-schreibung` überhaupt
   * gibt (siehe oben).
   */
  if (!genau) return grossKleinZaehlt ? "nur-schreibung" : "richtig";
  return falscheHand ? "nur-umschalthand" : "richtig";
}

export function RaetselLauf({
  titel,
  ankuendigung,
  aufgaben,
  grossKleinZaehlt = false,
  eingabeAnsagen = false,
  einzeichigeAntwort = false,
  enforceShiftHand = true,
  shiftLearned = true,
  contextId,
  onAufgabeFertig,
  lang = "de",
  zeichenabstand = 1,
  onFertig,
  onAbbruch,
}: {
  /** Der Name der Form - die Überschrift der Karte („Fingerdiktat"). */
  titel: string;
  /** Der Ankündigungssatz der Form, einmal am Anfang. */
  ankuendigung: string;
  aufgaben: RaetselAufgabe[];
  /** Zählt die Umschalttaste mit? Siehe `Uebungsform.grossKleinZaehlt`. */
  grossKleinZaehlt?: boolean;
  /** Jeden getippten Buchstaben mitsprechen? Siehe `Uebungsform.eingabeAnsagen`. */
  eingabeAnsagen?: boolean;
  /**
   * ★★★★★ KEIN „PRÜFEN"-KNOPF (Punkt 15, 20.09.2026) - siehe
   * `Uebungsform.einzeichigeAntwort`. Sobald das eine Zeichen im Feld steht,
   * wertet dieser Bildschirm sofort: richtig → Klang + weiter, falsch →
   * Klang + dieselbe Aufgabe noch einmal. Der Prüfen-Knopf entfällt; Enter
   * bleibt zusätzlich möglich (manche Kinder drücken es aus Gewohnheit),
   * verarbeitet aber wegen `geloestRef` nie dieselbe Antwort zweimal.
   */
  einzeichigeAntwort?: boolean;
  /**
   * ★★★★★ DIE GEGENHAND-REGEL GILT AUCH HIER (04.09.2026).
   *
   * Testerin am 03.09.2026: *„Im Lückentext ist es egal, welchen Umschalter man
   * nutzt. Da bin ich ein guter Tester, weil ich da einige schlechte
   * Angewohnheiten habe. Es wäre konsequent, wenn das in allen Übungen wichtig
   * ist."* Und über das Korrekturlesen: *„Da war die Umschalttaste auch egal."*
   *
   * Sie hat recht: Im Trainer muss ein Kind für ein großes X die Umschalttaste
   * der GEGENHAND halten; auf diesem Bildschirm war das gleichgültig. Ein Kind
   * lernt daraus nicht die Regel, sondern dass es darauf ankommt, wo man
   * gerade ist.
   *
   * ⚠️ AN DERSELBEN ACHSE WIE DIE GROSSSCHREIBUNG, nicht an einer neuen. Die
   * Regel greift nur, wo `grossKleinZaehlt` gilt - also im Lückentext, im
   * Korrekturlesen und bei „Was fehlt", nicht im Zahlendiktat (ein Zahlwort
   * schreibt man klein). Damit folgt sie der Entscheidung vom 02.09. statt eine
   * zweite Aufteilung zu erfinden, die niemand kennt.
   *
   * `false` bei „Einhand schreiben" (Lehrkraft-Häkchen am Kind) - dann ist
   * jede Umschalttaste richtig, hier wie im Trainer.
   */
  enforceShiftHand?: boolean;
  /** Erst wenn die Umschalttaste gelernt ist, wird ihre Hand verlangt. */
  shiftLearned?: boolean;
  /**
   * Kennung für die Telemetrie - dieselbe Rolle wie `contextId` in der
   * Übungssitzung (`form:<id>`).
   */
  contextId: string;
  /**
   * ★★★★ Eine gelöste Aufgabe melden - genau wie eine getippte Zeile.
   *
   * ⚠️ Ohne das ginge Übezeit VERLOREN. Der Zuwachs der Übezeit-Uhr wird nur
   * dort abgeholt, wo ein Ereignis geschrieben wird (`takePracticeDelta`);
   * dieser Bildschirm schreibt keine Zeilen. Wer ein Fingerdiktat macht und
   * danach aufhört, hätte seine Minuten nie gespeichert - und Kind- und
   * Lehrkraft-Ansicht zeigten verschiedene Übezeiten. Am 01.09. ist genau
   * diese Zahl repariert worden; sie darf hier nicht wieder auslaufen.
   */
  onAufgabeFertig?: (e: Omit<TaskEvent, "ts">) => void;
  lang?: Lang;
  /**
   * „Zeichenabstand groß (CVI)" - DERSELBE Wert wie in `TypingSession`
   * (19.09.2026, „überall"): die Frage und das Antwortfeld bekommen die
   * Laufweite, und beim Schreiben dunkelt alles ausser dieser Karte ab.
   * Siehe `laufweiteText` in `zeichenabstand.ts`.
   */
  zeichenabstand?: ZeichenabstandFaktor;
  /** Alle Aufgaben durch - mit der Zahl der auf Anhieb richtigen. */
  onFertig: (richtig: number, gesamt: number) => void;
  /** Vorzeitig zurück ins Üben. */
  onAbbruch: () => void;
}) {
  /*
   * ★★★★★ WELCHE UMSCHALTTASTE WURDE GEHALTEN? (04.09.2026, Testerin Meldung)
   *
   * Der Trainer weiss das, weil er jeden Anschlag selbst prüft. Dieser
   * Bildschirm hat ein gewöhnliches Eingabefeld - er muss es beim Tippen
   * mitschreiben.
   *
   * Gemerkt wird nur EINS: ob mindestens ein Zeichen, das die Umschalttaste
   * braucht, mit der Umschalttaste der FALSCHEN Hand gemacht wurde.
   * `KeyboardEvent.location` sagt, welche es war (1 = links, 2 = rechts);
   * `shiftHandFor` sagt, welche es hätte sein müssen.
   *
   * ⚠️ Die FESTSTELLTASTE zählt wie eine falsche Hand - im Trainer ist es
   * genauso (`correctShiftHeld` prüft `heldShift`, und CapsLock steht dort
   * nicht drin). Testerin hat ausdrücklich gesagt, dass sie „einige schlechte
   * Angewohnheiten" hat; eine davon ist genau die.
   *
   * ⚠️ Zurückgesetzt bei jeder neuen Aufgabe UND nach jedem Fehlversuch -
   * sonst hinge eine alte Hand an einer neuen Antwort.
   */
  /*
   * ★★★ A1 (11.09.2026): DIE REGEL STEHT AN EINER STELLE.
   *
   * „Die Grossschreibung zählt nur, wenn die Form es will UND die
   * Umschalttaste im Tastenstand des Kindes eingeführt ist." Sie wird an zwei
   * Orten gebraucht - beim Vergleich der Antwort (`trifft`) und beim Merken
   * der Umschalt-Hand (`merkeUmschaltHand`). Zweimal ausgeschrieben liefe sie
   * beim nächsten Eingriff auseinander, und dann verlangte der eine Ort etwas,
   * was der andere schon verziehen hat
   * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
   */
  const grossKleinZaehltJetzt = grossKleinZaehlt && shiftLearned;

  const falscheHand = useRef(false);
  const merkeUmschaltHand = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!enforceShiftHand || !grossKleinZaehltJetzt) return;
      if (e.key.length !== 1 || !needsShift(e.key)) return;
      const gebraucht = shiftHandFor(e.key);
      if (!gebraucht) return;
      // Feststelltaste: keine Umschalttaste gehalten, aber Großbuchstabe.
      if (!e.shiftKey) {
        falscheHand.current = true;
        return;
      }
      // location: 1 = links, 2 = rechts. Fehlt sie (manche Tastaturen melden 0),
      // wird NICHT beanstandet - eine Vermutung darf kein Fehler werden.
      const gedrueckt = e.location === 1 ? "links" : e.location === 2 ? "rechts" : null;
      if (gedrueckt && gedrueckt !== gebraucht) falscheHand.current = true;
    },
    [enforceShiftHand, grossKleinZaehltJetzt],
  );

  const [i, setI] = useState(0);
  const [eingabe, setEingabe] = useState("");
  const [fehlversuche, setFehlversuche] = useState(0);
  const [rueckmeldung, setRueckmeldung] = useState<TextTeil[]>([]);
  const richtigRef = useRef(0);
  /**
   * ★ Punkt 15 (20.09.2026): Ist DIESER Versuch schon ausgewertet? Ohne das
   * würde eine gewohnheitsmässige Enter-Taste dieselbe (schon als richtig
   * gezählte oder schon aufgelöste) Antwort ein zweites Mal verarbeiten - die
   * automatische Prüfung läuft ja bereits, sobald das Zeichen im Feld steht,
   * und `weiter()` kommt bei „richtig" erst 900 ms später. Zurückgesetzt in
   * `weiter()`, sobald die nächste Aufgabe beginnt.
   */
  const geloestRef = useRef(false);
  /** Wann diese Aufgabe begonnen hat - für die Dauer im Ereignis. */
  const beginnRef = useRef(Date.now());
  const feldRef = useRef<HTMLInputElement>(null);
  /** Die Karte (Frage, Antwortfeld, Rückmeldung) - beim CVI-Abdunkeln bleibt sie hell. */
  const schreibRef = useRef<HTMLDivElement>(null);
  const feldId = useId();
  const aufgabe = aufgaben[i];

  /**
   * ★ DIE LESEZEILE (E12, 20.09.2026) - siehe `lib/typing/leseZeile.ts` für
   * Anlass und Rechnung. `frageHuelleRef` umschliesst die Frage nur, damit die
   * Overlay-Kästchen `position: absolute` darin gezeichnet werden können (ein
   * `<div>` darf kein Kind von `<p>` sein); `frageRef` ist der gemessene Text
   * selbst. Bei jeder neuen Aufgabe (`aufgabe.frage` ändert sich) beginnt die
   * Lesezeile wieder bei der ersten Zeile.
   */
  const frageHuelleRef = useRef<HTMLDivElement>(null);
  const frageRef = useRef<HTMLParagraphElement>(null);
  const lesezeile = useLeseZeile({
    aktiv: zeichenabstand > 1,
    containerRef: frageHuelleRef,
    textRef: frageRef,
    zuruecksetzenWenn: aufgabe?.frage,
  });
  const anrede = useAnrede();
  /** Die Erklärung der Lesezeile - genau einmal, siehe `merkfenster.ts`. */
  const [lesezeileErklaeren, setLesezeileErklaeren] = useState(false);
  useEffect(() => {
    if (!lesezeile.mehrzeilig || lesezeileGesehen()) return;
    merkeLesezeileGesehen();
    setLesezeileErklaeren(true);
  }, [lesezeile.mehrzeilig]);

  /*
   * ★ EN4 (18.09.2026): Bedienung und Inhalt. `ui` ist die Sprache der Knöpfe
   * und Rückmeldungen - ohne aktiven Sprachbereich die Übungssprache, wie vorher.
   * Nur wenn beide verschieden sind (`gemischt`), wird ein Satz in Teilen
   * gezeigt und gesprochen; sonst läuft jede Zeile unten wie vor EN4.
   */
  const { ui, gemischt, bereichAktiv } = useWortspielSprache(lang);
  const t = RAETSEL_TEXTE[ui];
  const { pruefe: pruefeFeststelltaste, hinweis: feststelltasteHinweis } = useFeststelltasteWarnung(ui);
  const sprichTeile = useNacheinanderSprechen();
  /**
   * Eine Rückmeldung zeigen und sagen. Nicht gemischt: genau wie vorher, EIN
   * Satz, EINE `speakUi` (mit `art`, wo sie eine hatte). Gemischt: in Stücken,
   * jedes mit seiner Stimme.
   */
  const melden = useCallback(
    (teile: TextTeil[], art?: "sofort") => {
      setRueckmeldung(teile);
      if (gemischt) sprichTeile(sprechStuecke(teile, ui, lang).map((s) => ({ ...s, art })));
      // Aufruf genau in der Form von vorher - Tests prüfen die Argumente.
      else if (art) speakUi(ausTeilen(teile), undefined, art);
      else speakUi(ausTeilen(teile));
    },
    [gemischt, sprichTeile, ui, lang],
  );

  /** Den Fokus ausdrücklich ins Antwortfeld holen (R1-R6). */
  const insFeld = useCallback(() => {
    window.setTimeout(() => feldRef.current?.focus(), 0);
  }, []);

  // Ankündigung einmal beim Aufbau, danach bei jedem Aufgabenwechsel die Frage.
  const ersterAufbau = useRef(true);
  useEffect(() => {
    if (!aufgabe) return;
    const kopf = ersterAufbau.current ? `${ankuendigung} ` : "";
    ersterAufbau.current = false;
    // Der Stand ist Bedienung (`ui`) - ohne aktiven Sprachbereich dieselbe Sprache wie vorher.
    // ★ 20.09.2026: „Aufgabe 2 von 12, noch 10 Aufgaben" - hier stehen Aufgaben,
    // keine Zeilen (sichtbar steht daneben genau dasselbe Wort), und die Zahl
    // trägt keinen Punkt mehr (sonst liest die Sprachausgabe „zwölfte").
    const stand = ansageAufgabenstand(i + 1, aufgaben.length, ui);
    if (gemischt)
      sprichTeile([
        { text: `${kopf}${stand} `, lang: ui },
        ...sprechStuecke(aufgabe.frageTeile ?? [{ text: aufgabe.frage }], ui, lang),
      ]);
    else speakUi(`${kopf}${stand} ${aufgabe.frage}`);
    insFeld();
    // Die Frage hängt an `i` - mehr darf hier nicht mit hineinlaufen, sonst
    // spricht die Ansage bei jedem Tastendruck erneut.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const weiter = useCallback(() => {
    setEingabe("");
    setFehlversuche(0);
    // ★ Die gemerkte Umschalt-Hand gehört zur ALTEN Antwort. Ohne diese Zeile
    //   hinge sie an der nächsten Aufgabe, und ein Kind bekäme den Hinweis für
    //   etwas, das es gerade richtig gemacht hat.
    falscheHand.current = false;
    // ★ Punkt 15: die neue Aufgabe ist ein frischer, noch unausgewerteter Versuch.
    geloestRef.current = false;
    beginnRef.current = Date.now();
    if (i + 1 >= aufgaben.length) {
      onFertig(richtigRef.current, aufgaben.length);
      return;
    }
    setI((n) => n + 1);
  }, [i, aufgaben.length, onFertig]);

  /**
   * Die Aufgabe ist durch - als Ereignis melden, damit die Übezeit-Uhr
   * abgeholt wird (siehe `onAufgabeFertig`). `chars` ist die Länge der
   * richtigen Antwort, `errors` die Zahl der Fehlversuche.
   */
  const melde = useCallback(
    (fehler: number) => {
      if (!aufgabe) return;
      const jetzt = Date.now();
      onAufgabeFertig?.({
        lesson: contextId,
        chars: aufgabe.antworten[0].length,
        errors: fehler,
        ms: Math.max(0, jetzt - beginnRef.current),
        activeMs: Math.round(takePracticeDelta(jetzt)),
        lang,
      });
    },
    [aufgabe, contextId, lang, onAufgabeFertig],
  );

  const pruefen = useCallback(() => {
    if (!aufgabe) return;
    // ★ Punkt 15: dieser Versuch ist schon ausgewertet (die automatische
    // Prüfung ist schneller als jede gewohnheitsmässige Enter-Taste) - nicht
    // ein zweites Mal zählen oder ein zweites Mal auflösen.
    if (geloestRef.current) return;
    notePracticeActivity();
    // ★ A1 (11.09.2026): Vor der Umschalttaste wird gross/klein-unabhängig
    // verglichen - die Regel steht oben bei `grossKleinZaehltJetzt`.
    const urteil = trifft(
      eingabe,
      aufgabe.antworten,
      grossKleinZaehltJetzt,
      falscheHand.current,
    );
    // ★ Punkt 14 (20.09.2026): „und auch, dass mit dem Drücken ein Sound
    // kommt richtig/falsch" (Johannes). NUR bei einzeichiger Antwort - dort
    // ersetzt der Klang den weggefallenen Prüfen-Knopf als unmittelbare
    // Rückmeldung; die vorhandenen Klänge aus `lib/typing/sound.ts` respektieren
    // den Ton-aus-Schalter bereits selbst und übertönen die Sprachausgabe
    // nicht (kurze Earcons, keine eigene Sprachausgabe).
    if (einzeichigeAntwort) {
      if (urteil === "richtig") playSuccessSound();
      else playErrorSound();
    }
    if (urteil === "richtig") {
      geloestRef.current = true;
      if (fehlversuche === 0) richtigRef.current += 1;
      melden(
        aufgabe.aufloesung
          ? [{ text: `${t.richtig} ` }, ...aufloesungAlsTeile(aufgabe)]
          : [{ text: t.richtig }],
      );
      melde(fehlversuche);
      window.setTimeout(weiter, 900);
      return;
    }
    const n = fehlversuche + 1;
    setFehlversuche(n);
    if (urteil === "nur-umschalthand" && n < RAETSEL_VERSUCHE) {
      /*
       * ★★★★★ Nie etwas gegen ein Kind: Das Wort ist RICHTIG geschrieben, es
       * war nur die Umschalttaste derselben Hand. Genau das wird gesagt, mit
       * der Hand, die gehört hätte - dieselbe Bauart wie der Umschalt-Hinweis
       * im Trainer, damit ein Kind zweimal dasselbe hört und nicht zweierlei.
       */
      const gross = [...eingabe].find((c) => needsShift(c) && shiftHandFor(c));
      const seite = gross ? shiftHandFor(gross) : null;
      melden([{ text: seite === "links" ? t.umschaltLinks : t.umschaltRechts }], "sofort");
      falscheHand.current = false;
      setEingabe("");
      insFeld();
      return;
    }
    if (urteil === "nur-schreibung" && n < RAETSEL_VERSUCHE) {
      // Nie etwas gegen ein Kind: Das Wort STIMMT, es fehlt nur die
      // Umschalttaste. Genau das wird gesagt - und nur das.
      melden([{ text: t.fastSchreibung }]);
      setEingabe("");
      insFeld();
      return;
    }
    if (n >= RAETSEL_VERSUCHE) {
      geloestRef.current = true;
      // Auflösen und weitergehen. Ein Kind soll an einer Aufgabe nicht kleben
      // bleiben - das übt nichts mehr und nimmt nur Übezeit.
      //
      // ★ Abnahme 02.09.2026: Hier stand zuerst NUR die Auflösung - beim
      // Fingerdiktat also „Das ist f." Nach zwei Fehlversuchen klingt das wie
      // Lob und nicht wie eine Antwort. Die Antwort wird jetzt IMMER benannt;
      // die Auflösung kommt als Satz dahinter, wenn eine Form eine hat.
      //
      // ★ EN4: Die Antwort ist INHALT (Übungssprache), der Satz um sie herum
      // Bedienung.
      const kopf = inTeile(t.antwortIst(inhalt(aufgabe.antworten[0])));
      melden(
        aufgabe.aufloesung
          ? [...kopf, { text: " " }, ...aufloesungAlsTeile(aufgabe)]
          : kopf,
      );
      melde(n);
      window.setTimeout(weiter, 1600);
      return;
    }
    // ★★★★★ WO genau es hakt (02.09.2026, Johannes' Wunsch): Liegt die Eingabe
    // nah an der Lösung, nennt die Ansage die Stelle - und spricht die beiden
    // Buchstaben EINZELN, jeden mit erhöhter Stimmlage. Warum in Stücken und
    // nicht als ein Satz: Eine Äußerung hat genau eine Tonhöhe. Die Warteschlange
    // in `voice.ts` reiht Ansagen der Art „ereignis" der Reihe nach ein, ohne
    // sie zu verdrängen - genau dafür ist sie gebaut.
    //
    // ⚠️ Die Information trägt das WORT, die Tonhöhe ist die Zugabe: Wer sie
    // nicht hört (Systemstimmen setzen `pitch` verschieden stark um), versteht
    // den Satz trotzdem vollständig.
    //
    // ★ EN4: „Dritter Buchstabe: … Richtig wäre …" ist Bedienung; die beiden
    // Buchstaben (die Stücke mit eigener Tonhöhe) stammen aus dem Wort und
    // sind INHALT - wie die Antwort selbst. Gemischt stehen sie darum in
    // `lang` der Übung und sprechen mit deren Stimme (ein „ö" mit englischer
    // Stimme wäre kein „ö").
    const stelle = findeFehlerstelle(eingabe, aufgabe.antworten[0]);
    if (stelle) {
      const stuecke = fehlerAnsage(stelle, ui);
      if (gemischt) {
        setRueckmeldung(
          stuecke.flatMap((s, k): TextTeil[] => [
            ...(k ? [{ text: " " }] : []),
            s.pitch !== undefined ? { text: s.text, inhalt: true } : { text: s.text },
          ]),
        );
        sprichTeile(stuecke.map((s) => ({ ...s, lang: s.pitch !== undefined ? lang : ui })));
      } else {
        setRueckmeldung([{ text: fehlerSatz(stelle, ui) }]);
        for (const stueck of stuecke) speakUi(stueck.text, stueck.pitch);
      }
      setEingabe("");
      insFeld();
      return;
    }
    melden([{ text: t.nochNicht }]);
    setEingabe("");
    insFeld();
  }, [
    aufgabe,
    eingabe,
    einzeichigeAntwort,
    fehlversuche,
    grossKleinZaehltJetzt,
    lang,
    t,
    ui,
    gemischt,
    melden,
    sprichTeile,
    weiter,
    insFeld,
    melde,
  ]);

  /**
   * ★★★★★ SOFORT AUSWERTEN, SOBALD DAS EINE ZEICHEN STEHT (Punkt 15,
   * 20.09.2026). Johannes: *„Enter und gut oder ein Geräusch und direkt
   * weiter oder wenn falsch, dann wiederholen. Also gar nicht bestätigen."*
   *
   * Nur bei `einzeichigeAntwort` (siehe `typen.ts`) - und nur über einen
   * EFFEKT, nicht direkt im `onChange` des Feldes: `pruefen` ist eine über
   * `eingabe` gebaute `useCallback`-Funktion, im `onChange`-Handler wäre sie
   * noch die Fassung VOR dem neuen Tastendruck (React setzt State asynchron).
   * Der Effekt läuft dagegen erst NACH dem Commit, mit der frischen `eingabe`
   * und der dazu passenden `pruefen`-Fassung - kein veralteter Wert.
   */
  useEffect(() => {
    if (!einzeichigeAntwort) return;
    if (eingabe.length === 0) return;
    pruefen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eingabe, einzeichigeAntwort]);

  // ESC führt in die Eingabezeile - in JEDER App dieselbe Regel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        insFeld();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [insFeld]);

  if (!aufgabe) return null;

  return (
    <div ref={schreibRef} className="card space-y-4 p-6">
      <div className="flex items-baseline justify-between gap-3">
        {/* ★ EN4: Der Titel kommt als deutscher Name herein (`lauf.form.name`)
            - `formNameZuTitel` holt die Fassung der Bedienung. */}
        <h2 className="text-xl font-semibold text-ink">{formNameZuTitel(titel, ui)}</h2>
        <p className="text-base text-ink">{t.aufgabeVon(i + 1, aufgaben.length)}</p>
      </div>


      {/* AUSNAHME (E7, §2.7): Die Rätsel-Frage ist der Übungsinhalt, nicht
          Beschriftung - bis `text-2xl` bleibt hier erlaubt.
          ★ CVI (19.09.2026): mit der Laufweite - nur sichtbar, der Text bleibt
          Zeichen für Zeichen derselbe.
          ★ Die LESEZEILE (E12, 20.09.2026): `frageHuelleRef` ist nur die
          Umhüllung für die Overlay-Kästchen (`position: relative`) - der Text
          selbst und sein zugänglicher Name bleiben unverändert im `<p>`. */}
      <div ref={frageHuelleRef} data-cvi-lesezeile-huelle="" className="relative">
        <p
          ref={frageRef}
          className="text-2xl font-medium leading-snug text-ink"
          style={laufweiteText(zeichenabstand)}
        >
          <TeileText
            teile={aufgabe.frageTeile ?? [{ text: aufgabe.frage }]}
            lang={lang}
            gemischt={gemischt}
          />
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor={feldId} className="block text-base text-ink">
          {t.deineAntwort}
        </label>
        <input
          ref={feldRef}
          id={feldId}
          // ★ EN4: Was hier getippt wird, ist Übungssprache - wie am Übungsfeld
          //   (Probestück 12.09.) ausgezeichnet, sobald der Sprachbereich aktiv ist.
          lang={bereichAktiv ? feinesLangAttribut(lang) : undefined}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-xl text-ink"
          // ★ CVI: dieselbe Laufweite wie die Frage - der Schreibzeiger folgt
          // ihr von selbst, der Wert bleibt unverändert. OHNE Zeilenabstand
          // (20.09.2026): Das Feld hat eine Zeile, es würde davon nur höher.
          style={laufweiteFeld(zeichenabstand)}
          value={eingabe}
          onChange={(e) => {
            notePracticeActivity();
            const neuerWert = e.target.value;
            /*
             * ★★★★ DIE EINGABE MITSPRECHEN (Testerin 03.09.2026).
             *
             * Nur das, was DAZUGEKOMMEN ist, und nur ein einzelnes Zeichen -
             * beim Einfügen aus der Zwischenablage oder beim Löschen bleibt es
             * still. `speakChar` prüft den Vorlesen-Schalter selbst; wer einen
             * Screenreader hat, bekommt das Echo von ihm.
             *
             * „sofort": Das Echo gehört zum Anschlag und ist eine
             * Zehntelsekunde später veraltet - dieselbe Regel wie bei der
             * Korrektur im Trainer.
             */
            if (
              eingabeAnsagen &&
              neuerWert.length === eingabe.length + 1 &&
              neuerWert.startsWith(eingabe)
            ) {
              speakChar(neuerWert.slice(-1), shiftLearned, lang, "sofort");
            }
            setEingabe(neuerWert);
          }}
          onKeyDown={(e) => {
            merkeUmschaltHand(e);
            pruefeFeststelltaste(e);
            if (e.key === "Enter") {
              e.preventDefault();
              pruefen();
              return;
            }
            /*
             * ★ DIE LESEZEILE, PFEIL AB/AUF (E12, 20.09.2026, Pflicht Nr 3):
             * NUR wenn die Lesezeile hier überhaupt gilt (CVI an UND der Text
             * bricht wirklich um) UND der Fokus in einem echt einzeiligen
             * Textfeld steht - genau hier bewegen Pfeil auf/ab den
             * Schreibzeiger ohnehin nicht, das Tippen ist also nicht
             * berührt. `preventDefault` NUR für diese beiden Tasten, nie für
             * eine Zeichen-Taste.
             */
            if (
              (e.key === "ArrowDown" || e.key === "ArrowUp") &&
              lesezeile.mehrzeilig &&
              istEinzeiligesTextfeld(e.target)
            ) {
              e.preventDefault();
              if (e.key === "ArrowDown") lesezeile.naechste();
              else lesezeile.vorherige();
            }
          }}
        />
      </div>

      {feststelltasteHinweis}

      {/* Die Rückmeldung wird gesprochen UND gelesen - eine Braillezeile hört
          nicht mit. `aria-live` meldet sie, ohne den Fokus zu bewegen. */}
      <p aria-live="polite" className="min-h-[1.5rem] text-base text-ink">
        <TeileText teile={rueckmeldung} lang={lang} gemischt={gemischt} />
      </p>

      <div className="flex flex-wrap gap-2">
        {/* ★ Punkt 15 (20.09.2026): Bei einzeichiger Antwort gibt es keinen
            Prüfen-Knopf mehr - die Eingabe wertet sofort aus (Effekt oben).
            Enter bleibt zusätzlich möglich, siehe `onKeyDown` am Feld. */}
        {!einzeichigeAntwort && (
          <button type="button" className="btn-primary" onClick={pruefen}>
            {t.pruefen}
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={onAbbruch}>
          {t.zurueck}
        </button>
      </div>

      {/* ★ CVI (19.09.2026, „überall"): Beim Schreiben bleibt diese Karte
          hell, der Rest der Seite tritt zurück - wie die Übungskarte in
          `TypingSession`. Rein sichtbar, hört nur mit.
          ★ Punkt 7 (20.09.2026): NICHT, solange die Lesezeile gilt - die
          deckt denselben Bereich schon ab (das Feld ist eines ihrer beiden
          Löcher), zwei Verdunkelungen übereinander wären doppelt so dunkel. */}
      <CviAbdunkeln aktiv={zeichenabstand > 1 && !lesezeile.mehrzeilig} zielRef={schreibRef} />

      {/* ★ Die Korrektur vom 20.09.2026: der GANZE Bildschirm verdunkelt,
          hell bleiben die Lesezeile und das Eingabefeld - siehe
          `CviLesezeile.tsx` und `lib/typing/leseZeile.ts`. */}
      <CviLesezeileAbdunkeln
        aktiv={lesezeile.mehrzeilig}
        containerRef={frageHuelleRef}
        zeilen={lesezeile.zeilen}
        zeile={lesezeile.zeile}
        feldRef={feldRef}
      />

      {/* ★ Die Erklärung der Lesezeile (E12, 20.09.2026) - genau einmal,
          dasselbe Fenster wie der Grossschreibungs-Hinweis in TypingSession. */}
      {lesezeileErklaeren && (
        <Merkfenster
          {...lesezeileFenster(anrede, ui)}
          mitHaken={false}
          onSchliessen={() => setLesezeileErklaeren(false)}
        />
      )}
    </div>
  );
}
