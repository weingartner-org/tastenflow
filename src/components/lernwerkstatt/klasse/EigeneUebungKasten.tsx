/**
 * ★★★★★ „EIGENE ÜBUNG" AUS DER SICHT DER LEHRKRAFT - ein Bereich in „Meine
 * Klassen", direkt unter der Tippchallenge (17.09.2026).
 *
 * Auftrag Johannes, 17.09.2026 (wörtlich):
 * *„unterhalb von Tastenchallenge brauchen wir einen weiteren ausklappbaren
 * Bereich 'Eigene Übung' - wo Lehrkräfte eigene Dateien hochladen können und
 * sagen 'Übung starten' und dann bekommt die ganze Klasse den Übungstext der
 * hochgeladen wurde, egal auf welchem Stand die einzelnen Teilnehmer sind.
 * Das zählt zur Übezeit und die Tasten werden gemessen. Neue Tasten werden in
 * der Übung nicht freigeschaltet, weil welche Tasten verwendet werden
 * bestimmt ja die hochgeladene Datei."*
 *
 * ── Was dieser Kasten ist und was er NICHT ist ─────────────────────────────
 * Er ist die BEDIENUNG - Datei hochladen, Vorschau, „Eigene Übung starten"
 * (Schalter am 19.09.2026 umbenannt, E6/Entwurf §7b - „Übung starten" hätte
 * für eine Sprachausgabe nicht mehr verraten, WELCHE Übung), dazu die Liste
 * der laufenden Übungen mit „Beenden" je Übung (Z1).
 * Was mit dem Text passiert (glätten, Zeichen-Bericht, Umbrechen), steht
 * vollständig in `lib/typing/eigenerText.ts`; hier wird nichts davon
 * nachgerechnet.
 *
 * ── Format und Zeichen: die Entscheidungen vom 17.09.2026 ───────────────────
 *  • .txt und .docx (kein PDF - Extraktion zu unzuverlässig für einen Tipptext).
 *  • Typografische Zeichen (Gedankenstrich, „schöne" Anführungszeichen, …)
 *    werden automatisch geglättet. Was danach noch übrig bleibt, zeigt DIESER
 *    Kasten VOR dem Start als Liste - die Lehrkraft entscheidet, ob sie die
 *    Datei korrigiert oder trotzdem startet. Startet sie trotzdem, werden die
 *    restlichen Zeichen aus den Zeilen entfernt (nie als Pflicht-Anschlag).
 *  • Anders als bei der Tippchallenge bleibt ß hier ERLAUBT - keine
 *    Rangliste, keine Fairness-Pflicht zwischen DE-/CH-Tastatur.
 *
 * ── Pflichten dieses Repositories ────────────────────────────────────────
 *  • Anrede „Sie" (K21) - reine Lehrkraft-Oberfläche.
 *  • **Nichts wird je `disabled`** (R5) - `aria-disabled` plus Sperre im
 *    Handler, der sagt, warum nichts passiert ist.
 *
 * ── E7/E8 (19.09.2026, „Meine Klassen"-Umbau) ───────────────────────────────
 * Der Text kommt jetzt auf DREI Wegen: Datei hochladen (wie bisher) · „Meine
 * Texte" (die eigene Ablage der Lehrkraft, `tt_meine_texte` - siehe
 * `meineTexte.ts`) · „Vorlagen" (die sechs Text-Lektionen des Lehrgangs,
 * `vorlagen.ts` - die Übungsart „Lektionen" selbst ist entfallen, siehe
 * `trainerMode.ts`). Die Weiche dafür steht in `EigenerTextQuelle.tsx`, EINMAL
 * für diesen Kasten UND `SchreibprobeKasten.tsx`; hier bleibt nur noch das
 * eigentliche STARTEN (Klassen-Kopie anlegen, optional in „Meine Texte"
 * sichern).
 *
 * ── Z1 (19.09.2026): eine REIHE statt eines Zeigers ────────────────────────
 * Johannes: „Wenn der Lehrer in der Zwischenzeit schon eine neue Übung
 * gestartet hat, dann kommt zuerst die alte und dann die neue." „Eigene Übung
 * starten" hängt darum HINTEN an (`starteEigeneUebung`, bis dahin ersetzte es
 * die laufende Übung); der Kasten zeigt alle laufenden der Reihe nach, jede
 * mit „Beenden" (Rückfrage über `Modal`). Die Regeln der Reihe stehen in
 * `lib/typing/eigeneUebungReihe.ts`, hier wird nichts davon nachgerechnet.
 * „n von m Kindern fertig" steht nur da, wenn die Seite die Fortschritte der
 * Kinder hereinreicht (`kinderFortschritt`) - eine eigene Abfrage je Kind
 * macht dieser Kasten nicht.
 *
 * ── L4 (19.09.2026): die drei Wege in der ERSTEN Zeile ──────────────────────
 * Johannes: *„wenn man auf Eigene Übung klickt, sollen die drei Schalter in
 * die obere Zeile, also: ‚Eigene Übung:' |Datei hochladen|...|..."*. Die
 * erste Zeile des aufgeklappten Bereichs heisst darum „Eigene Übung:" und
 * trägt gleich daneben die drei Wege (`EigenerTextQuelle`, `titel`); darunter
 * steht, was der gewählte Weg zeigt, samt Vorschau und „Eigene Übung
 * starten"; die Reihe der laufenden Übungen steht erst DARUNTER (bis dahin
 * ganz oben). Beim Umbruch (375 px) rutschen die Schalter als Ganzes in die
 * nächste Zeile, der Titel bleibt vorn.
 *
 * ── EN6b (19.09.2026): beide Bedienungssprachen ────────────────────────────
 * Texte unten in `T`, Deutsch wortgleich wie vorher. Glossar §3.8: Eigene
 * Übung ⇒ *Custom exercise* (`EIGENE_UEBUNG_WORT_EN`), Kind ⇒ *pupil*;
 * „Beenden" einer Übung ⇒ *End* (§1.6).
 */
import { useRef, useState } from "react";
import { klassenUebungsSprache, type TypingClass } from "@/lib/typing/account";
import { typingBackend } from "@/lib/typing/backend";
import {
  EIGENE_UEBUNG_WORT,
  EIGENE_UEBUNG_WORT_EN,
  EIGENE_UEBUNG_WORT_FR,
  EIGENE_UEBUNG_WORT_ES,
  EIGENE_UEBUNG_WORT_IT,
  EIGENE_UEBUNG_WORT_PL,
  EIGENE_UEBUNG_WORT_TR,
  EIGENE_UEBUNG_WORT_CS,
  entferneUntippbareZeichen,
} from "@/lib/typing/eigenerText";
import {
  eigeneUebungKurzstand,
  eigeneUebungReihe,
  fertigeKinder,
  vonAllenFertig,
  type EigeneUebungEintrag,
} from "@/lib/typing/eigeneUebungReihe";
import { klassenStufe } from "@/lib/typing/klassenEinstellungen";
import { lernwegVon } from "@/lib/typing/lernweg";
import type { TypingProgress } from "@/lib/typing/progress";
import { startGeschrieben } from "@/lib/typing/schreibprobe";
import { useEigenerTextUpload } from "@/lib/typing/useEigenerTextUpload";
import { Modal } from "@/components/Modal";
import { Tipp } from "@/components/Tipp";
import { Aufklappen } from "@/components/Aufklappen";
import { EigenerTextQuelle } from "./EigenerTextQuelle";
import { AnsehenKnopf, zeilenAlsTextdatei } from "./AnsehenKnopf";
import { EigenerTextVorschauAnzeige } from "./EigenerTextVorschauAnzeige";
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";
import type { Teil } from "@/lib/bedienSprache/texte";

// Glossar §2.6: Eigene Übung (Lehrkraft) = „Собствено упражнение"
const EIGENE_UEBUNG_WORT_BG = "Собствено упражнение";

// Name der eigenen Übung für Lehrkräfte - Glossar §2.6 „Προσαρμοσμένη άσκηση".
const EIGENE_UEBUNG_WORT_EL = "Προσαρμοσμένη άσκηση";

// Glossar-hu §2.6: Eigene Übung (Lehrkraft-Sicht)
const EIGENE_UEBUNG_WORT_HU = "Saját gyakorlat";

const EIGENE_UEBUNG_WORT_NL = "Eigen oefening";

const EIGENE_UEBUNG_WORT_PT = "Exercício personalizado";

const EIGENE_UEBUNG_WORT_BR = "Exercício personalizado";

const EIGENE_UEBUNG_WORT_RO = "Exercițiu propriu";

// Eigene Übung in der Lehrkraft-Sicht (Glossar §2.6).
const EIGENE_UEBUNG_WORT_SV = "Egna övningar";

// Glossar §2.6: Eigene Übung aus Sicht der Lehrkraft.
const EIGENE_UEBUNG_WORT_UK = "Власна вправа";

const T = texte({
  de: {
    wort: EIGENE_UEBUNG_WORT,
    nichtGespeichert: "Nicht gespeichert. Bitte noch einmal versuchen.",
    gestartetNachReihe: "Gestartet - die Kinder bekommen sie nach den laufenden Übungen, mit einem Fenster.",
    gestartet: "Gestartet - die Kinder bekommen jetzt ein Fenster.",
    nichtBeendet: "Nicht beendet. Bitte noch einmal versuchen.",
    beendetAlle: "Beendet - die Klasse übt wieder normal.",
    beendetEine: (name: string) => `„${name}" beendet - die übrigen Übungen laufen weiter.`,
    laufendeEine: "Laufende Übung",
    laufendeMehrere: "Laufende Übungen, der Reihe nach",
    zitat: (name: string): readonly Teil[] => ["„", name, '"'],
    gestartetAm: (wann: string) => `gestartet ${wann}`,
    gestartetOhne: "gestartet",
    fertig: (fertig: number, gesamt: number) =>
      ` · ${fertig} von ${gesamt} ${gesamt === 1 ? "Kind" : "Kindern"} fertig`,
    beendenTipp:
      "Nimmt diese Übung aus der Reihe. Wer gerade darin schreibt, darf sie fertig schreiben; alle anderen bekommen sie nicht mehr.",
    beenden: "Beenden",
    beendenFuer: (name: string): readonly Teil[] => [" „", name, '"'],
    startenTipp:
      "Weist diesen Text der ganzen Klasse zu. Laufen schon eigene Übungen, kommt er danach dran - jedes Kind bekommt sie der Reihe nach, jede mit einem Fenster, und übt im eigenen Tempo; wer ihn einmal ganz durchgeschrieben hat, kehrt automatisch ins normale Training zurück, sobald keine weitere Übung wartet. Neue Tasten schaltet die Übung nicht frei - das bestimmt allein die Datei. Zählt zur Übezeit, die Tasten werden gemessen.",
    starten: "Eigene Übung starten",
    beendenTitel: "Übung beenden",
    beendenFrage: (name: string): readonly Teil[] => [
      "„",
      name,
      '" beenden? Wer gerade darin schreibt, darf sie fertig schreiben; alle anderen bekommen sie nicht mehr.',
    ],
    abbrechen: "Abbrechen",
  },
  en: {
    wort: EIGENE_UEBUNG_WORT_EN,
    nichtGespeichert: "Not saved. Please try again.",
    gestartetNachReihe:
      "Started - the pupils get it after the exercises that are already running, with a window.",
    gestartet: "Started - the pupils now get a window.",
    nichtBeendet: "Not ended. Please try again.",
    beendetAlle: "Ended - the class is back to normal practice.",
    beendetEine: (name: string) => `“${name}” ended - the other exercises carry on.`,
    laufendeEine: "Running exercise",
    laufendeMehrere: "Running exercises, in order",
    zitat: (name: string): readonly Teil[] => ["“", name, "”"],
    gestartetAm: (wann: string) => `started ${wann}`,
    gestartetOhne: "started",
    fertig: (fertig: number, gesamt: number) =>
      ` · ${fertig} of ${mehrzahl(gesamt, "en", { one: (z) => `${z} pupil`, other: (z) => `${z} pupils` })} done`,
    beendenTipp:
      "Takes this exercise out of the queue. Anyone typing it right now may finish it; nobody else will get it.",
    beenden: "End",
    beendenFuer: (name: string): readonly Teil[] => [` “${name}”`],
    startenTipp:
      "Assigns this text to the whole class. If custom exercises are already running, it comes after them - each pupil gets them in order, each with a window, and practises at their own pace; anyone who has typed it all the way through goes back to normal training automatically, as soon as no other exercise is waiting. The exercise doesn't unlock new keys - that is decided by the file alone. It counts as practice time, and the keys are measured.",
    // Glossar §3.8 / Handbuch (`L.eigeneUebungStarten`).
    starten: "Start the custom exercise",
    beendenTitel: "End the exercise",
    beendenFrage: (name: string): readonly Teil[] => [
      `End “${name}”? Anyone typing it right now may finish it; nobody else will get it.`,
    ],
    abbrechen: "Cancel",
  },
  fr: {
    wort: EIGENE_UEBUNG_WORT_FR,
    nichtGespeichert: "Pas enregistré. Merci de réessayer.",
    gestartetNachReihe:
      "Lancé - les élèves le recevront après les exercices en cours ; une fenêtre le leur annoncera.",
    gestartet: "Lancé - une fenêtre l'annonce maintenant aux élèves.",
    nichtBeendet: "Pas terminé. Merci de réessayer.",
    beendetAlle: "Terminé - la classe reprend l'entrainement normal.",
    beendetEine: (name: string) => `"${name}" terminé - les autres exercices continuent.`,
    laufendeEine: "Exercice en cours",
    laufendeMehrere: "Exercices en cours, l'un après l'autre",
    zitat: (name: string): readonly Teil[] => ['"', name, '"'],
    gestartetAm: (wann: string) => `lancé ${wann}`,
    gestartetOhne: "lancé",
    fertig: (fertig: number, gesamt: number) =>
      ` - ${fertig} sur ${mehrzahl(gesamt, "fr", { one: (z) => `${z} élève`, other: (z) => `${z} élèves` })} ont terminé`,
    beendenTipp:
      "Retire cet exercice de la file. Qui est en train de le taper peut le finir ; personne d'autre ne le recevra plus.",
    beenden: "Terminer",
    beendenFuer: (name: string): readonly Teil[] => [` "${name}"`],
    startenTipp:
      "Attribue ce texte à toute la classe. Si des textes de la classe sont déjà en cours, il vient après - chaque élève les reçoit l'un après l'autre, chacun annoncé par une fenêtre, et s'exerce à son rythme ; qui l'a tapé en entier revient automatiquement à l'entrainement normal, dès qu'aucun autre exercice n'attend. Le texte ne débloque aucune nouvelle touche : son contenu vient uniquement du fichier. Il compte dans le temps d'exercice, les touches sont mesurées.",
    starten: "Lancer le texte de la classe",
    beendenTitel: "Terminer l'exercice",
    beendenFrage: (name: string): readonly Teil[] => [
      'Terminer "',
      name,
      '" ? Qui est en train de le taper peut le finir ; personne d\'autre ne le recevra plus.',
    ],
    abbrechen: "Annuler",
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft - usted.
  es: {
    wort: EIGENE_UEBUNG_WORT_ES,
    nichtGespeichert: "No se ha guardado. Vuelva a intentarlo, por favor.",
    gestartetNachReihe:
      "Iniciado - el alumnado lo recibirá después de los ejercicios en curso; una ventana se lo anunciará.",
    gestartet: "Iniciado - una ventana se lo anuncia ahora al alumnado.",
    nichtBeendet: "No se ha terminado. Vuelva a intentarlo, por favor.",
    beendetAlle: "Terminado - la clase vuelve al entrenamiento normal.",
    beendetEine: (name: string) => `"${name}" terminado - los demás ejercicios siguen.`,
    laufendeEine: "Ejercicio en curso",
    laufendeMehrere: "Ejercicios en curso, uno detrás de otro",
    zitat: (name: string): readonly Teil[] => ['"', name, '"'],
    gestartetAm: (wann: string) => `iniciado ${wann}`,
    gestartetOhne: "iniciado",
    fertig: (fertig: number, gesamt: number) =>
      ` - ${fertig} de ${mehrzahl(gesamt, "es", { one: (z) => `${z} estudiante`, other: (z) => `${z} estudiantes` })} han terminado`,
    beendenTipp:
      "Quita este ejercicio de la cola. Quien lo está escribiendo puede terminarlo; nadie más lo recibirá.",
    beenden: "Terminar",
    beendenFuer: (name: string): readonly Teil[] => [` "${name}"`],
    startenTipp:
      "Asigna este texto a toda la clase. Si ya hay textos de la clase en curso, va detrás - cada estudiante los recibe uno tras otro, cada uno anunciado con una ventana, y practica a su ritmo; quien lo ha escrito entero vuelve automáticamente al entrenamiento normal en cuanto no le quede ningún otro ejercicio. El texto no desbloquea ninguna tecla nueva: su contenido viene solo del archivo. Cuenta como tiempo de práctica y las teclas se miden.",
    starten: "Iniciar el texto de la clase",
    beendenTitel: "Terminar el ejercicio",
    beendenFrage: (name: string): readonly Teil[] => [
      '¿Terminar "',
      name,
      '"? Quien lo está escribiendo puede terminarlo; nadie más lo recibirá.',
    ],
    abbrechen: "Cancelar",
  },
  // ★ O-IT (02.10.2026): Glossar §2.6 *Esercizio personalizzato*, Lehrkraft neutral.
  it: {
    wort: EIGENE_UEBUNG_WORT_IT,
    nichtGespeichert: "Non è stato salvato. Riprovare, per favore.",
    gestartetNachReihe:
      "Avviato - gli alunni lo ricevono dopo gli esercizi in corso; una finestra lo annuncia.",
    gestartet: "Avviato - ora una finestra lo annuncia agli alunni.",
    nichtBeendet: "Non è stato concluso. Riprovare, per favore.",
    beendetAlle: "Concluso - la classe torna all'allenamento normale.",
    beendetEine: (name: string) => `"${name}" concluso - gli altri esercizi continuano.`,
    laufendeEine: "Esercizio in corso",
    laufendeMehrere: "Esercizi in corso, uno dopo l'altro",
    zitat: (name: string): readonly Teil[] => ['"', name, '"'],
    gestartetAm: (wann: string) => `avviato ${wann}`,
    gestartetOhne: "avviato",
    fertig: (fertig: number, gesamt: number) =>
      ` - ${fertig} su ${mehrzahl(gesamt, "it", { one: (z) => `${z} persona`, other: (z) => `${z} alunni` })} hanno finito`,
    beendenTipp:
      "Toglie questo esercizio dalla coda. Chi lo sta scrivendo può finirlo; nessun altro lo riceve più.",
    beenden: "Concludi",
    beendenFuer: (name: string): readonly Teil[] => [` "${name}"`],
    startenTipp:
      "Assegna questo testo a tutta la classe. Se ci sono già esercizi in corso, viene dopo - ogni persona li riceve uno dopo l'altro, ognuno annunciato da una finestra, e si esercita al proprio ritmo; chi l'ha scritto tutto torna da solo all'allenamento normale appena non ci sono altri esercizi. Il testo non sblocca nessun tasto nuovo: il contenuto viene solo dal file. Conta come tempo di esercizio e i tasti vengono misurati.",
    starten: "Avvia l'esercizio personalizzato",
    beendenTitel: "Concludere l'esercizio",
    beendenFrage: (name: string): readonly Teil[] => [
      'Concludere "',
      name,
      '"? Chi lo sta scrivendo può finirlo; nessun altro lo riceve più.',
    ],
    abbrechen: "Annulla",
  },
  // ★ O-PL (02.10.2026): „Własne ćwiczenie" (Glossar §2.6), Lehrkraft ty-Form und
  // -no-Form („Uruchomiono"), polnische Anführungszeichen (Regel 8).
  pl: {
    wort: EIGENE_UEBUNG_WORT_PL,
    nichtGespeichert: "Nie zapisano. Spróbuj jeszcze raz.",
    gestartetNachReihe:
      "Uruchomiono - uczniowie dostaną je po bieżących ćwiczeniach; zapowie je okno.",
    gestartet: "Uruchomiono - uczniowie dostają teraz okno z zapowiedzią.",
    nichtBeendet: "Nie zakończono. Spróbuj jeszcze raz.",
    beendetAlle: "Zakończono - klasa wraca do zwykłego treningu.",
    beendetEine: (name: string) => `Zakończono: „${name}” - pozostałe ćwiczenia trwają dalej.`,
    laufendeEine: "Bieżące ćwiczenie",
    laufendeMehrere: "Bieżące ćwiczenia, po kolei",
    zitat: (name: string): readonly Teil[] => ["„", name, "”"],
    gestartetAm: (wann: string) => `uruchomione: ${wann}`,
    gestartetOhne: "uruchomione",
    fertig: (fertig: number, gesamt: number) => ` - ukończono: ${fertig} z ${gesamt}`,
    beendenTipp:
      "Usuwa to ćwiczenie z kolejki. Kto właśnie je pisze, może je dokończyć; nikt inny już go nie dostanie.",
    beenden: "Zakończ",
    beendenFuer: (name: string): readonly Teil[] => [" „", name, "”"],
    startenTipp:
      "Przydziela ten tekst całej klasie. Jeśli trwają już inne własne ćwiczenia, przychodzi po nich - każda osoba dostaje je po kolei, każde z zapowiedzią w oknie, i ćwiczy we własnym tempie; kto przepisze cały tekst, wraca automatycznie do zwykłego treningu, gdy nie czeka już żadne inne ćwiczenie. Ćwiczenie nie odblokowuje nowych klawiszy - o treści decyduje tylko plik. Liczy się do czasu ćwiczeń, a klawisze są mierzone.",
    starten: "Uruchom własne ćwiczenie",
    beendenTitel: "Zakończ ćwiczenie",
    beendenFrage: (name: string): readonly Teil[] => [
      "Zakończyć „",
      name,
      "”? Kto właśnie je pisze, może je dokończyć; nikt inny już go nie dostanie.",
    ],
    abbrechen: "Anuluj",
  },
  // ★ O-TR (02.10.2026): Lehrkraft "siz" mit -(y)In (Glossar Regel 1); "Kişisel
  // alıştırma" (§2.6); Kind = "öğrenci"; "bitiren öğrenci: 3, toplam 12" statt
  // einer Endung an der Zahl (Regel 6).
  tr: {
    wort: EIGENE_UEBUNG_WORT_TR,
    nichtGespeichert: "Kaydedilmedi. Lütfen tekrar deneyin.",
    gestartetNachReihe:
      "Başlatıldı - öğrenciler bu alıştırmayı süren alıştırmalardan sonra, bir pencereyle alır.",
    gestartet: "Başlatıldı - öğrenciler şimdi bir pencere görür.",
    nichtBeendet: "Bitirilemedi. Lütfen tekrar deneyin.",
    beendetAlle: "Bitirildi - sınıf yeniden normal çalışıyor.",
    beendetEine: (name: string) => `Bitirildi: "${name}" - diğer alıştırmalar sürüyor.`,
    laufendeEine: "Süren alıştırma",
    laufendeMehrere: "Süren alıştırmalar, sırayla",
    zitat: (name: string): readonly Teil[] => ['"', name, '"'],
    gestartetAm: (wann: string) => `başlangıç: ${wann}`,
    gestartetOhne: "başlatıldı",
    fertig: (fertig: number, gesamt: number) => ` · bitiren öğrenci: ${fertig}, toplam ${gesamt}`,
    beendenTipp:
      "Bu alıştırmayı sıradan çıkarır. Şu anda yazan öğrenci bitirebilir; diğerleri artık almaz.",
    beenden: "Bitir",
    beendenFuer: (name: string): readonly Teil[] => [' "', name, '"'],
    startenTipp:
      "Bu metni tüm sınıfa atar. Başka kişisel alıştırmalar sürüyorsa bu metin onlardan sonra gelir - her öğrenci alıştırmaları sırayla, her birini bir pencereyle alır ve kendi hızında çalışır; metni bir kez baştan sona yazan öğrenci, bekleyen başka alıştırma yoksa otomatik olarak normal antrenmana döner. Alıştırma yeni tuşların kilidini açmaz - içeriği yalnızca dosya belirler. Çalışma süresine sayılır, tuşlar ölçülür.",
    starten: "Kişisel alıştırmayı başlat",
    beendenTitel: "Alıştırmayı bitir",
    beendenFrage: (name: string): readonly Teil[] => [
      'Bitirilsin mi? Alıştırma: "',
      name,
      '". Şu anda yazan öğrenci bitirebilir; diğerleri artık almaz.',
    ],
    abbrechen: "İptal",
  },
  // ★ O-CS (03.10.2026): Lehrkraft "vy" in der Mehrzahlform (Glossar Regel 1);
  // "Vlastní cvičení" (§2.6), die Kinder = "žáci", eine Person = "osoba"; "hotovo:
  // 3/12" statt eines Satzes mit Zahl (Regel 13); Statuszeilen ohne Anführung
  // (Glossar Regel 7), der Name nach dem Doppelpunkt (Regel 12).
  cs: {
    wort: EIGENE_UEBUNG_WORT_CS,
    nichtGespeichert: "Neuloženo. Zkuste to prosím znovu.",
    gestartetNachReihe:
      "Spuštěno - žáci ho dostanou po probíhajících cvičeních, v okně.",
    gestartet: "Spuštěno - žáci teď uvidí okno.",
    nichtBeendet: "Neukončeno. Zkuste to prosím znovu.",
    beendetAlle: "Ukončeno - třída zase cvičí normálně.",
    beendetEine: (name: string) => `Ukončeno: ${name} - ostatní cvičení běží dál.`,
    laufendeEine: "Probíhající cvičení",
    laufendeMehrere: "Probíhající cvičení, postupně",
    zitat: (name: string): readonly Teil[] => ["„", name, "“"],
    gestartetAm: (wann: string) => `spuštěno: ${wann}`,
    gestartetOhne: "spuštěno",
    fertig: (fertig: number, gesamt: number) => ` · hotovo: ${fertig}/${gesamt}`,
    beendenTipp:
      "Vyřadí toto cvičení z pořadí. Kdo v něm právě píše, smí ho dopsat; ostatní ho už nedostanou.",
    beenden: "Ukončit",
    beendenFuer: (name: string): readonly Teil[] => [" „", name, "“"],
    startenTipp:
      "Přidělí tento text celé třídě. Pokud už běží jiná vlastní cvičení, přijde na řadu po nich - každá osoba je dostává postupně, každé s oknem, a cvičí vlastním tempem; kdo text jednou celý dopíše, vrátí se automaticky do běžného tréninku, jakmile nečeká žádné další cvičení. Nové klávesy cvičení neodemyká - to určuje jen soubor. Počítá se do času procvičování, klávesy se měří.",
    starten: "Spustit vlastní cvičení",
    beendenTitel: "Ukončit cvičení",
    beendenFrage: (name: string): readonly Teil[] => [
      "Ukončit? Cvičení: ",
      name,
      ". Kdo v něm právě píše, smí ho dopsat; ostatní ho už nedostanou.",
    ],
    abbrechen: "Zrušit",
  },
  bg: {
    wort: EIGENE_UEBUNG_WORT_BG,
    nichtGespeichert: "Не е записано. Опитайте отново.",
    gestartetNachReihe:
      "Започнато - учениците ще го получат след упражненията, които вече текат, в прозорец.",
    gestartet: "Започнато - учениците сега ще видят прозорец.",
    nichtBeendet: "Не е прекратено. Опитайте отново.",
    beendetAlle: "Прекратено - класът отново се упражнява нормално.",
    beendetEine: (name: string) => `Прекратено: ${name} - другите упражнения продължават.`,
    laufendeEine: "Текущо упражнение",
    laufendeMehrere: "Текущи упражнения, едно след друго",
    zitat: (name: string): readonly Teil[] => ["„", name, "“"],
    gestartetAm: (wann: string) => `започнато: ${wann}`,
    gestartetOhne: "започнато",
    fertig: (fertig: number, gesamt: number) => ` · готови: ${fertig}/${gesamt}`,
    beendenTipp:
      "Изважда това упражнение от поредицата. Който пише в него в момента, може да го довърши. Другите вече няма да го получат.",
    beenden: "Прекрати",
    beendenFuer: (name: string): readonly Teil[] => [" „", name, "“"],
    startenTipp:
      "Задава този текст на целия клас. Ако вече текат други собствени упражнения, той идва след тях - всеки ученик ги получава едно след друго, всяко с прозорец, и се упражнява в свой ритъм. Който веднъж напише целия текст, се връща автоматично към обикновената тренировка, щом не чака друго упражнение. Упражнението не отключва нови клавиши - това зависи само от файла. То се брои във времето за упражнения, а клавишите се измерват.",
    starten: "Започни собствено упражнение",
    beendenTitel: "Прекрати упражнението",
    beendenFrage: (name: string): readonly Teil[] => [
      "Да се прекрати ли? Упражнение: ",
      name,
      ". Който пише в него в момента, може да го довърши. Другите вече няма да го получат.",
    ],
    abbrechen: "Отказ",
  },
  el: {
    wort: EIGENE_UEBUNG_WORT_EL,
    nichtGespeichert: "Δεν αποθηκεύτηκε. Δοκιμάστε ξανά.",
    gestartetNachReihe:
      "Ξεκίνησε - τα παιδιά θα την πάρουν μετά τις ασκήσεις σε εξέλιξη, σε ένα παράθυρο.",
    gestartet: "Ξεκίνησε - τα παιδιά βλέπουν τώρα ένα παράθυρο.",
    nichtBeendet: "Δεν τερματίστηκε. Δοκιμάστε ξανά.",
    beendetAlle: "Τερματίστηκε - το τμήμα κάνει πάλι κανονική εξάσκηση.",
    beendetEine: (name: string) => `Τερματίστηκε: ${name} - οι υπόλοιπες ασκήσεις συνεχίζονται.`,
    laufendeEine: "Άσκηση σε εξέλιξη",
    laufendeMehrere: "Ασκήσεις σε εξέλιξη, η μία μετά την άλλη",
    zitat: (name: string): readonly Teil[] => ["«", name, "»"],
    gestartetAm: (wann: string) => `ξεκίνησε: ${wann}`,
    gestartetOhne: "ξεκίνησε",
    fertig: (fertig: number, gesamt: number) => ` · ολοκλήρωσαν: ${fertig} από ${gesamt}`,
    beendenTipp:
      "Βγάζει αυτή την άσκηση από τη σειρά. Όσα παιδιά τη γράφουν αυτή τη στιγμή μπορούν να την τελειώσουν. Τα άλλα δεν την παίρνουν πια.",
    beenden: "Τερματισμός",
    beendenFuer: (name: string): readonly Teil[] => [" «", name, "»"],
    startenTipp:
      "Αναθέτει αυτό το κείμενο σε όλο το τμήμα. Αν τρέχουν ήδη άλλες προσαρμοσμένες ασκήσεις, έρχεται μετά από αυτές - κάθε παιδί τις παίρνει με τη σειρά, την καθεμία με ένα παράθυρο, και κάνει εξάσκηση με τη δική του ταχύτητα. Όταν ένα παιδί γράψει μία φορά ολόκληρο το κείμενο, γυρίζει αυτόματα στην κανονική εξάσκηση, μόλις δεν περιμένει άλλη άσκηση. Η άσκηση δεν ξεκλειδώνει νέα πλήκτρα - αυτό το ορίζει μόνο το αρχείο. Μετράει στον χρόνο εξάσκησης, τα πλήκτρα μετριούνται.",
    starten: "Έναρξη προσαρμοσμένης άσκησης",
    beendenTitel: "Τερματισμός άσκησης",
    beendenFrage: (name: string): readonly Teil[] => [
      "Θέλετε να τερματίσετε την άσκηση «",
      name,
      "»; Όσα παιδιά τη γράφουν αυτή τη στιγμή μπορούν να την τελειώσουν. Τα άλλα δεν την παίρνουν πια.",
    ],
    abbrechen: "Άκυρο",
  },
  hu: {
    wort: EIGENE_UEBUNG_WORT_HU,
    nichtGespeichert: "Nincs mentve. Próbálja meg újra.",
    gestartetNachReihe:
      "Elindítva - a tanulók a folyamatban lévő gyakorlatok után kapják meg, egy ablakban.",
    gestartet: "Elindítva - a tanulók most egy ablakot látnak.",
    nichtBeendet: "Nincs befejezve. Próbálja meg újra.",
    beendetAlle: "Befejezve - az osztály ismét a szokásos módon gyakorol.",
    beendetEine: (name: string) => `Befejezve: ${name} - a többi gyakorlat folytatódik.`,
    laufendeEine: "Folyamatban lévő gyakorlat",
    laufendeMehrere: "Folyamatban lévő gyakorlatok, sorban egymás után",
    zitat: (name: string): readonly Teil[] => ["„", name, "”"],
    gestartetAm: (wann: string) => `elindítva: ${wann}`,
    gestartetOhne: "elindítva",
    fertig: (fertig: number, gesamt: number) => ` · kész: ${fertig}/${gesamt}`,
    beendenTipp:
      "Kiveszi ezt a gyakorlatot a sorból. Aki éppen gépeli, befejezheti; a többiek már nem kapják meg.",
    beenden: "Befejezés",
    beendenFuer: (name: string): readonly Teil[] => [" „", name, "”"],
    startenTipp:
      "Ezt a szöveget az egész osztálynak adja ki. Ha már futnak saját gyakorlatok, utánuk következik - minden tanuló sorban kapja meg őket, mindegyiket egy ablakban, és a saját ütemében gyakorol; aki egyszer végiggépelte a szöveget, automatikusan visszatér a szokásos gyakorláshoz, amint nem vár rá több gyakorlat. Új billentyűt a gyakorlat nem old fel - ezt egyedül a fájl határozza meg. Beleszámít a gyakorlási időbe, és a program a billentyűket is méri.",
    starten: "Saját gyakorlat indítása",
    beendenTitel: "Gyakorlat befejezése",
    beendenFrage: (name: string): readonly Teil[] => [
      "Biztosan befejezi? Gyakorlat: ",
      name,
      ". Aki éppen gépeli, befejezheti; a többiek már nem kapják meg.",
    ],
    abbrechen: "Mégse",
  },
  nl: {
    wort: EIGENE_UEBUNG_WORT_NL,
    nichtGespeichert: "Niet opgeslagen. Probeer het nog eens.",
    gestartetNachReihe:
      "Gestart - de leerlingen krijgen deze oefening na de lopende oefeningen, in een venster.",
    gestartet: "Gestart - de leerlingen krijgen nu een venster.",
    nichtBeendet: "Niet gestopt. Probeer het nog eens.",
    beendetAlle: "Gestopt - de klas oefent weer gewoon.",
    beendetEine: (name: string) => `"${name}" gestopt - de andere oefeningen gaan door.`,
    laufendeEine: "Lopende oefening",
    laufendeMehrere: "Lopende oefeningen, na elkaar",
    zitat: (name: string): readonly Teil[] => ["\"", name, "\""],
    gestartetAm: (wann: string) => `gestart: ${wann}`,
    gestartetOhne: "gestart",
    fertig: (fertig: number, gesamt: number) =>
      ` · ${fertig} van ${mehrzahl(gesamt, "nl", { one: (z) => `${z} leerling`, other: (z) => `${z} leerlingen` })} klaar`,
    beendenTipp:
      "Haalt deze oefening uit de wachtrij. Wie deze oefening nu typt, mag ze afmaken; de anderen krijgen ze niet meer.",
    beenden: "Stoppen",
    beendenFuer: (name: string): readonly Teil[] => [" \"", name, "\""],
    startenTipp:
      "Wijst deze tekst toe aan de hele klas. Lopen er al eigen oefeningen, dan komt hij daarna - elke leerling krijgt ze na elkaar, elk met een venster, en oefent in het eigen tempo; wie de tekst een keer helemaal heeft getypt, gaat automatisch terug naar de gewone training zodra er geen andere oefening wacht. De oefening speelt geen nieuwe toetsen vrij - dat bepaalt alleen het bestand. Telt mee als oefentijd; de toetsen worden gemeten.",
    starten: "Eigen oefening starten",
    beendenTitel: "Oefening stoppen",
    beendenFrage: (name: string): readonly Teil[] => [
      "\"",
      name,
      "\" stoppen? Wie deze oefening nu typt, mag ze afmaken; de anderen krijgen ze niet meer.",
    ],
    abbrechen: "Annuleren",
  },
  pt: {
    wort: EIGENE_UEBUNG_WORT_PT,
    nichtGespeichert: "Não foi guardado. Tente outra vez.",
    gestartetNachReihe:
      "Já começou - a turma recebe-o depois dos exercícios em curso, numa janela.",
    gestartet: "Já começou - a turma vê agora uma janela.",
    nichtBeendet: "Não foi terminado. Tente outra vez.",
    beendetAlle: "Terminado - a turma volta a praticar normalmente.",
    beendetEine: (name: string) => `Terminado: ${name} - os outros exercícios continuam.`,
    laufendeEine: "Exercício em curso",
    laufendeMehrere: "Exercícios em curso, por ordem",
    zitat: (name: string): readonly Teil[] => ["\"", name, "\""],
    gestartetAm: (wann: string) => `começou: ${wann}`,
    gestartetOhne: "começou",
    fertig: (fertig: number, gesamt: number) => ` · concluído: ${fertig} de ${gesamt}`,
    beendenTipp:
      "Retira este exercício da sequência. Quem o estiver a escrever pode terminá-lo; as outras pessoas já não o recebem.",
    beenden: "Terminar",
    beendenFuer: (name: string): readonly Teil[] => [" \"", name, "\""],
    startenTipp:
      "Atribui este texto a toda a turma. Se já houver outros exercícios personalizados em curso, vem depois deles - cada pessoa recebe-os por ordem, cada um com uma janela, e pratica ao seu ritmo; quem escrever o texto completo uma vez volta automaticamente ao treino normal, assim que não houver mais nenhum exercício à espera. O exercício não desbloqueia teclas novas - isso depende apenas do ficheiro. Conta para o tempo de prática e as teclas são medidas.",
    starten: "Começar o exercício personalizado",
    beendenTitel: "Terminar o exercício",
    beendenFrage: (name: string): readonly Teil[] => [
      "Terminar \"",
      name,
      "\"? Quem o estiver a escrever pode terminá-lo; as outras pessoas já não o recebem.",
    ],
    abbrechen: "Cancelar",
  },
  br: {
    wort: EIGENE_UEBUNG_WORT_BR,
    nichtGespeichert: "Não foi salvo. Tente de novo.",
    gestartetNachReihe:
      "Exercício iniciado - estudantes o recebem depois dos exercícios em andamento, em uma janela.",
    gestartet: "Exercício iniciado - estudantes veem agora uma janela.",
    nichtBeendet: "Não foi encerrado. Tente de novo.",
    beendetAlle: "Encerrado - a turma volta a praticar normalmente.",
    beendetEine: (name: string) => `Encerrado: ${name} - os outros exercícios continuam.`,
    laufendeEine: "Exercício em andamento",
    laufendeMehrere: "Exercícios em andamento, em sequência",
    zitat: (name: string): readonly Teil[] => ['"', name, '"'],
    gestartetAm: (wann: string) => `iniciado: ${wann}`,
    gestartetOhne: "iniciado",
    fertig: (fertig: number, gesamt: number) => ` · concluído: ${fertig}/${gesamt}`,
    beendenTipp:
      "Retira este exercício da sequência. Quem está digitando nele agora pode terminar; as outras pessoas não o recebem mais.",
    beenden: "Encerrar",
    beendenFuer: (name: string): readonly Teil[] => [' "', name, '"'],
    startenTipp:
      "Atribui este texto à turma inteira. Se já houver outros exercícios personalizados em andamento, ele vem depois deles - cada pessoa os recebe em sequência, cada um com uma janela, e pratica no próprio ritmo; quem digitar o texto inteiro uma vez volta automaticamente ao treino normal, assim que não houver outro exercício esperando. O exercício não desbloqueia teclas novas - isso depende só do arquivo. Conta como tempo de prática, e as teclas são medidas.",
    starten: "Começar exercício personalizado",
    beendenTitel: "Encerrar o exercício",
    beendenFrage: (name: string): readonly Teil[] => [
      "Encerrar? Exercício: ",
      name,
      ". Quem está digitando nele agora pode terminar; as outras pessoas não o recebem mais.",
    ],
    abbrechen: "Cancelar",
  },
  ro: {
    wort: EIGENE_UEBUNG_WORT_RO,
    nichtGespeichert: "Nu s-a salvat. Încercați din nou.",
    gestartetNachReihe:
      "Pornit - elevii îl primesc după exercițiile în curs, într-o fereastră.",
    gestartet: "Pornit - elevii văd acum o fereastră.",
    nichtBeendet: "Nu s-a încheiat. Încercați din nou.",
    beendetAlle: "Încheiat - clasa exersează din nou normal.",
    beendetEine: (name: string) => `Încheiat: ${name} - celelalte exerciții continuă.`,
    laufendeEine: "Exercițiu în curs",
    laufendeMehrere: "Exerciții în curs, unul după altul",
    zitat: (name: string): readonly Teil[] => ["„", name, "”"],
    gestartetAm: (wann: string) => `pornit: ${wann}`,
    gestartetOhne: "pornit",
    fertig: (fertig: number, gesamt: number) => ` · gata: ${fertig}/${gesamt}`,
    beendenTipp:
      "Scoate acest exercițiu din listă. Cine scrie chiar acum în el îl poate termina; ceilalți nu îl mai primesc.",
    beenden: "Încheiați",
    beendenFuer: (name: string): readonly Teil[] => [" „", name, "”"],
    startenTipp:
      "Atribuie acest text întregii clase. Dacă sunt deja în curs alte exerciții proprii, urmează după ele - fiecare persoană le primește unul după altul, fiecare cu o fereastră, și exersează în ritm propriu; cine a scris textul o dată în întregime revine automat la antrenamentul obișnuit, imediat ce nu mai așteaptă alt exercițiu. Exercițiul nu deblochează taste noi - asta stabilește doar fișierul. Se numără la timpul de exersare, tastele sunt măsurate.",
    starten: "Începeți exercițiul propriu",
    beendenTitel: "Încheiați exercițiul",
    beendenFrage: (name: string): readonly Teil[] => [
      "Încheiați? Exercițiu: ",
      name,
      ". Cine scrie chiar acum în el îl poate termina; ceilalți nu îl mai primesc.",
    ],
    abbrechen: "Anulați",
  },
  sv: {
    wort: EIGENE_UEBUNG_WORT_SV,
    nichtGespeichert: "Det gick inte att spara. Försök igen.",
    gestartetNachReihe:
      "Övningen har börjat - eleverna får den efter de pågående övningarna, i ett fönster.",
    gestartet: "Övningen har börjat - eleverna får nu ett fönster.",
    nichtBeendet: "Det gick inte att avsluta. Försök igen.",
    beendetAlle: "Avslutat - klassen övar som vanligt igen.",
    beendetEine: (name: string) => `Avslutat: ${name} - de andra övningarna fortsätter.`,
    laufendeEine: "Pågående övning",
    laufendeMehrere: "Pågående övningar, i tur och ordning",
    zitat: (name: string): readonly Teil[] => ["\"", name, "\""],
    gestartetAm: (wann: string) => `började ${wann}`,
    gestartetOhne: "har börjat",
    fertig: (fertig: number, gesamt: number) => ` · klara: ${fertig}/${gesamt}`,
    beendenTipp:
      "Tar bort övningen ur turordningen. Den som skriver i den just nu får skriva klart; alla andra får den inte längre.",
    beenden: "Avsluta",
    beendenFuer: (name: string): readonly Teil[] => [" \"", name, "\""],
    startenTipp:
      "Ger hela klassen den här texten. Om egna övningar redan pågår kommer den efter dem - varje elev får dem i tur och ordning, var och en i ett fönster, och övar i sin egen takt; den som har skrivit hela texten en gång går automatiskt tillbaka till den vanliga träningen, så snart ingen annan övning väntar. Övningen låser inte upp nya tangenter - det bestämmer bara filen. Den räknas som övningstid, och tangenterna mäts.",
    starten: "Börja egen övning",
    beendenTitel: "Avsluta övningen",
    beendenFrage: (name: string): readonly Teil[] => [
      "Avsluta \"",
      name,
      "\"? Den som skriver i den just nu får skriva klart; alla andra får den inte längre.",
    ],
    abbrechen: "Avbryt",
  },
  uk: {
    wort: EIGENE_UEBUNG_WORT_UK,
    nichtGespeichert: "Не збережено. Спробуйте ще раз.",
    gestartetNachReihe:
      "Розпочато - учні отримають її після поточних вправ, у вікні.",
    gestartet: "Розпочато - учні зараз побачать вікно.",
    nichtBeendet: "Не завершено. Спробуйте ще раз.",
    beendetAlle: "Завершено - клас знову тренується як звичайно.",
    beendetEine: (name: string) => `Завершено: ${name} - інші вправи тривають далі.`,
    laufendeEine: "Поточна вправа",
    laufendeMehrere: "Поточні вправи, по черзі",
    zitat: (name: string): readonly Teil[] => ["«", name, "»"],
    gestartetAm: (wann: string) => `розпочато: ${wann}`,
    gestartetOhne: "розпочато",
    fertig: (fertig: number, gesamt: number) => ` · готово: ${fertig}/${gesamt}`,
    beendenTipp:
      "Прибирає цю вправу з черги. Хто зараз її друкує, може надрукувати до кінця; інші її вже не отримають.",
    beenden: "Завершити",
    beendenFuer: (name: string): readonly Teil[] => [" «", name, "»"],
    startenTipp:
      "Призначає цей текст усьому класу. Якщо вже тривають інші власні вправи, він буде після них - кожна дитина отримує їх по черзі, кожну у вікні, і тренується зі своєю швидкістю; хто надрукує текст один раз до кінця, автоматично повертається до звичайного тренування, щойно не чекає жодна інша вправа. Нових клавіш вправа не відкриває - це визначає лише файл. Зараховується до часу тренування, клавіші вимірюються.",
    starten: "Почати власну вправу",
    beendenTitel: "Завершити вправу",
    beendenFrage: (name: string): readonly Teil[] => [
      "Завершити? Вправа: ",
      name,
      ". Хто зараз її друкує, може надрукувати до кінця; інші її вже не отримають.",
    ],
    abbrechen: "Скасувати",
  },
});

export interface EigeneUebungKastenProps {
  cls: TypingClass;
  onClassChange: (cls: TypingClass) => void;
  /**
   * ★★★★★ E3 (18.09.2026, „Meine Klassen" - Aufgaben-Zeile): Der Kasten steht
   * jetzt im Panel des Aussen-Schalters „Eigene Übung" - der öffnet und
   * schliesst, nicht mehr das eigene `<details>` hier. `eingebettet` lässt
   * darum `<details>`/`<summary>` weg und zeigt den Inhalt unverändert als
   * einfachen Bereich; den Stand neben dem Schalter rechnet
   * `eigeneUebungKurzstand` - dieselbe reine Funktion wie hier, keine zweite
   * Rechnung ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
   */
  eingebettet?: boolean;
  /**
   * Z1 (19.09.2026): die Fortschritte der Kinder dieser Klasse, wie die Seite
   * sie ohnehin geladen hat (`TastenflowReiter`, `datas[].progress`) - daraus
   * „n von m Kindern fertig" je Übung, und welche Übung schon ALLE fertig
   * haben (die fällt zuerst, wenn die Reihe voll ist). Fehlt es, steht keine
   * Zahl da.
   */
  kinderFortschritt?: readonly Pick<TypingProgress, "customTextProgress">[];
  /**
   * ★ L4 (19.09.2026): Was VORN in der ersten Zeile steht, vor den drei Wegen
   * (Datei hochladen · Meine Texte · Vorlagen). Die Aufgaben-Zeile reicht
   * hier die Überschrift ihres Panels herein („Eigene Übung:", samt
   * Fokus-Ziel) - so steht sie nicht als eigene Zeile darüber.
   */
  titel?: React.ReactNode;
}

export function EigeneUebungKasten({
  cls,
  onClassChange,
  eingebettet = false,
  kinderFortschritt,
  titel,
}: EigeneUebungKastenProps) {
  const reihe = eigeneUebungReihe(cls);
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  // ß bleibt hier erlaubt (kein `verbietenSs`) - siehe Dateikopf.
  const upload = useEigenerTextUpload(false, lernwegVon(cls));
  const { dateiname, vorschau, ladeFehler, zuruecksetzen } = upload;
  const [speichert, setSpeichert] = useState(false);
  const [meldung, setMeldung] = useState("");
  // E8 (19.09.2026): „In Meine Texte speichern" - nur wirksam, wenn die
  // aktuelle Vorschau wirklich aus einem UPLOAD stammt (siehe
  // `EigenerTextQuelle.tsx`, `onQuelleChange`).
  const [inPoolSpeichern, setInPoolSpeichern] = useState(true);
  const [quelleIstUpload, setQuelleIstUpload] = useState(true);
  // Z1: Rückfrage vor „Beenden" - `Modal`, nie `window.confirm` (E12).
  const [beendenFrage, setBeendenFrage] = useState<EigeneUebungEintrag | null>(null);
  // Fokus-Ziele nach dem Beenden: der verschwundene Schalter hinterliesse sonst
  // einen Fokus im Nichts.
  const reiheUeberschriftRef = useRef<HTMLHeadingElement>(null);
  const meldungRef = useRef<HTMLParagraphElement>(null);

  async function starten() {
    if (speichert || !vorschau) return;
    setSpeichert(true);
    const zeilen =
      vorschau.unbekannt.length === 0
        ? vorschau.zeilen
        : entferneUntippbareZeichen(vorschau.zeilen, new Set(vorschau.unbekannt));
    const textId = await typingBackend().speichereEigenenText(
      cls.code,
      cls.teacherId,
      dateiname,
      zeilen,
    );
    if (!textId) {
      setSpeichert(false);
      setMeldung(t.nichtGespeichert);
      return;
    }
    const liefSchon = reihe.length > 0;
    const neu = await typingBackend().starteEigeneUebung(
      cls.code,
      cls.teacherId,
      { textId, dateiname },
      vonAllenFertig(reihe, kinderFortschritt),
    );
    setSpeichert(false);
    if (!neu) {
      setMeldung(t.nichtGespeichert);
      return;
    }
    onClassChange(neu);
    // Nebenbei in „Meine Texte" ablegen - fehlschlagen darf das, ohne den
    // Start selbst zu gefährden (die Klasse übt in jedem Fall schon damit).
    if (inPoolSpeichern && quelleIstUpload) {
      void typingBackend().speichereMeinenText(cls.teacherId, dateiname, zeilen);
    }
    // E6 (19.09.2026): Jedes Kind bekommt ein Fenster
    // (`EigeneUebungAnkuendigung.tsx`) - seit Z1 vor JEDER Übung der Reihe.
    setMeldung(liefSchon ? t.gestartetNachReihe : t.gestartet);
    zuruecksetzen();
  }

  async function beendenBestaetigt() {
    const eintrag = beendenFrage;
    if (!eintrag || speichert) return;
    setBeendenFrage(null);
    setSpeichert(true);
    const neu = await typingBackend().beendeEigeneUebung(cls.code, cls.teacherId, eintrag.textId);
    setSpeichert(false);
    if (!neu) {
      setMeldung(t.nichtBeendet);
      return;
    }
    onClassChange(neu);
    const bleiben = eigeneUebungReihe(neu).length;
    setMeldung(bleiben === 0 ? t.beendetAlle : t.beendetEine(eintrag.dateiname));
    // Der Schalter „Beenden" dieser Übung ist weg - der Fokus geht an die
    // Liste, oder (leer) an die Meldung.
    window.setTimeout(() => (reiheUeberschriftRef.current ?? meldungRef.current)?.focus(), 0);
  }

  /*
   * ★ L4 (19.09.2026): Reihenfolge - erste Zeile „Eigene Übung:" mit den drei
   * Wegen, darunter was der Weg zeigt (Vorschau, „Eigene Übung starten",
   * Meldung), ganz unten die Reihe der laufenden Übungen (Dateikopf).
   */
  const reiheListe = reihe.length > 0 && (
    <div className="space-y-1">
      <h4
        ref={reiheUeberschriftRef}
        tabIndex={-1}
        className="m-0 text-sm font-semibold text-ink outline-none"
      >
        {reihe.length === 1 ? t.laufendeEine : t.laufendeMehrere}
      </h4>
      <ol className="m-0 list-decimal space-y-1 pl-5">
        {reihe.map((e) => {
          const zahl = kinderFortschritt ? fertigeKinder(e.textId, kinderFortschritt) : null;
          return (
            <li key={e.textId} className="text-sm text-ink">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex-auto">
                  <strong>{t.zitat(e.dateiname)}</strong>
                  <span className="block text-ink-muted">
                    {e.gestartetAm > 0
                      ? t.gestartetAm(startGeschrieben(e.gestartetAm, sprache))
                      : t.gestartetOhne}
                    {zahl && zahl.gesamt > 0 ? t.fertig(zahl.fertig, zahl.gesamt) : ""}
                  </span>
                </span>
                {/* 08.11.2026: was die Klasse gerade übt, im großen Fenster. */}
                <AnsehenKnopf
                  name={e.dateiname}
                  ausrichtung="rechts"
                  hole={async () => {
                    const g = await typingBackend().leseEigenenText(e.textId);
                    if (!g || g.zeilen.length === 0) throw new Error("leer");
                    return zeilenAlsTextdatei(g.dateiname || e.dateiname, g.zeilen);
                  }}
                />
                <Tipp text={t.beendenTipp} ausrichtung="rechts">
                  {(hinweisId) => (
                    <button
                      type="button"
                      className="btn-secondary min-h-9"
                      aria-disabled={speichert}
                      aria-describedby={hinweisId}
                      onClick={() => {
                        if (speichert) return;
                        setBeendenFrage(e);
                      }}
                    >
                      {/* Der Name der Übung nur für die Sprachausgabe - sonst
                          hiessen alle Schalter der Liste gleich. Mit
                          führendem Leerzeichen: dieselbe Ansage, ob die
                          Engine vor dem `span` eine Lücke setzt oder nicht. */}
                      {t.beenden}
                      <span className="sr-only">{t.beendenFuer(e.dateiname)}</span>
                    </button>
                  )}
                </Tipp>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );

  const inhalt = (
    <>
      <EigenerTextQuelle
        teacherId={cls.teacherId}
        stufe={klassenStufe(cls)}
        lang={klassenUebungsSprache(cls)}
        lernweg={lernwegVon(cls)}
        verbietenSs={false}
        fuer="uebung"
        upload={upload}
        inPoolSpeichern={inPoolSpeichern}
        onInPoolSpeichernChange={setInPoolSpeichern}
        onQuelleChange={(q) => setQuelleIstUpload(q === "upload")}
        // ★ L4: „Eigene Übung:" vorn in der Zeile der drei Wege. Im Panel der
        // Aufgaben-Zeile reicht `TastenflowReiter` seine Überschrift herein;
        // eingebettet OHNE sie steht der Name hier als Text. Zugeklappt als
        // `<details>` nennt die Kopfzeile den Namen schon.
        titel={
          titel ??
          (eingebettet ? <span className="text-sm font-semibold text-ink">{t.wort}:</span> : undefined)
        }
      />

      {ladeFehler && (
        <p role="alert" className="text-sm text-danger">
          {ladeFehler}
        </p>
      )}

      {/* ★ 19.09.2026: Vorschau und „Eigene Übung starten" wachsen sichtbar
          auf, die Reihe der laufenden Übungen darunter gleitet mit
          (`Aufklappen`, Johannes: „der Rest rutscht nach unten und der andere
          kommt nach"). */}
      <Aufklappen offen={!!vorschau}>
        {vorschau && (
          <div className="space-y-2">
            <EigenerTextVorschauAnzeige
              dateiname={dateiname}
              vorschau={vorschau}
              textLang={klassenUebungsSprache(cls)}
              datei={upload.datei}
            />
            {/* ★ E12, Browser-Messung (700 px): der Knopf steht allein, ganz
                links - „rechts" (Vorgabe) lief über den Fensterrand hinaus. */}
            <Tipp text={t.startenTipp} ausrichtung="links">
              {(hinweisId) => (
                <button
                  type="button"
                  className="btn-primary"
                  aria-disabled={speichert}
                  aria-describedby={hinweisId}
                  onClick={() => {
                    if (speichert) return;
                    void starten();
                  }}
                >
                  {/* E6 (19.09.2026, Johannes): „unten stehen 'Eigene Übung starten'". */}
                  {t.starten}
                </button>
              )}
            </Tipp>
          </div>
        )}
      </Aufklappen>

      {meldung && (
        <p ref={meldungRef} tabIndex={-1} role="status" className="text-sm text-ink outline-none">
          {meldung}
        </p>
      )}

      {reiheListe}

      {beendenFrage && (
        <Modal title={t.beendenTitel} onClose={() => setBeendenFrage(null)}>
          <div className="space-y-3 text-sm text-ink">
            <p className="m-0">{t.beendenFrage(beendenFrage.dateiname)}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary text-danger"
                onClick={() => void beendenBestaetigt()}
              >
                {t.beenden}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setBeendenFrage(null)}
              >
                {t.abbrechen}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );

  if (eingebettet) return <div className="space-y-3">{inhalt}</div>;

  return (
    <details className="group rounded-xl border border-hairline bg-surface-sunken px-3 py-1">
      <summary className="flex min-h-9 cursor-pointer list-none flex-wrap content-center items-center gap-x-2 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
        <span aria-hidden="true" className="text-ink-muted transition group-open:rotate-90">
          ▸
        </span>
        {t.wort}
        <span className="font-normal text-ink-muted">· {eigeneUebungKurzstand(cls, sprache)}</span>
      </summary>
      <div className="mt-2 space-y-3">{inhalt}</div>
    </details>
  );
}
