/**
 * Buchstaben-Karte: zeigt für jedes Kind auf einen Blick, welche Buchstaben
 * schon „sitzen" und wo es noch „hakt" — die sichtbare Auswertung der
 * individuellen Lernumgebung. Grün = sitzt, gelb = wackelig, rot = hakt,
 * grau = noch zu wenig geübt. Genutzt im Training (Kind) und im
 * Lehrer-Dashboard (read-only). Siehe [[project_zehnfinger_trainer]],
 * [[feedback_data_transparency]].
 */
import { useEffect, useId, useRef, useState } from "react";
import {
  LetterStat,
  Mastery,
  SHIFT_UNIT,
  fmtPercent,
  letterAccuracy,
  letterLevel,
  letterMs,
  letterSamples,
  focusPracticeField,
  masteredCount,
  nextLetter,
  personalBaseMs,
  unitGlyph,
  unitLabel,
  unitLabelEn,
  unitLabelFr,
  unitLabelEs,
} from "@/lib/typing";
import { dezimal, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { unitLabelIt } from "@/lib/typing/tastenErklaerungIt";
import { unitLabelPl } from "@/lib/typing/tastenErklaerungPl";
import { unitLabelTr } from "@/lib/typing/tastenErklaerungTr";
import { unitLabelCs } from "@/lib/typing/tastenErklaerungCs";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Sprachen aus ihrer eigenen Datei (heute die englischen Namen).
import { unitLabelBg } from "@/lib/typing/tastenErklaerungBg";
import { unitLabelEl } from "@/lib/typing/tastenErklaerungEl";
import { unitLabelHu } from "@/lib/typing/tastenErklaerungHu";
import { unitLabelNl } from "@/lib/typing/tastenErklaerungNl";
import { unitLabelPt } from "@/lib/typing/tastenErklaerungPt";
import { unitLabelBr } from "@/lib/typing/tastenErklaerungBr";
import { unitLabelRo } from "@/lib/typing/tastenErklaerungRo";
import { unitLabelSv } from "@/lib/typing/tastenErklaerungSv";
import { unitLabelUk } from "@/lib/typing/tastenErklaerungUk";
import { Aufklappen } from "@/components/Aufklappen";
import { AutoCapHint } from "./TypingSession";
import { Hinweisflaeche } from "./Zeigerhinweis";
import type { Lernweg } from "@/lib/typing/lernweg";

/**
 * ★ Die Tastenkarte in beiden Bedienungssprachen (EN3, 19.09.2026). Deutsch
 * wortgleich wie vorher (Teil-Listen, wo JSX mehrere Textknoten hatte).
 *
 * Die vier Stände nach Glossar §3.2: sitzt ⇒ *mastered* (wie *keys mastered*),
 * wackelig ⇒ *wobbly* (§5 Nr. 10), hakt noch ⇒ *not there yet* (nie *weak* oder
 * *problem*, §1.4 - und ohne *still*: der Deutsch-Fänger kennt es als deutsches
 * Wort, Glossar §7), neu ⇒ *new*. Der Name einer Taste ist Beschriftung, kein
 * Übungsinhalt - er folgt der Bedienung (`unitLabelEn`), die Taste selbst
 * bleibt die der geübten Tastatur.
 */
const KARTE_TEXTE = texte({
  de: {
    naechsteTaste: "nächste Taste",
    naechsteName: (taste: string) => `Nächste Taste ${taste}: Erklärung anzeigen`,
    kommtVor: "Diese Taste kommt",
    kommtFett: "automatisch dazu",
    kommtNach:
      ", sobald die anderen sitzen - einfach weiter üben. Je besser die bisherigen Tasten sitzen, desto schneller öffnet sich die nächste.",
    sitzt: "sitzt",
    wackelig: "wackelig",
    hakt: "hakt noch",
    neu: "neu",
    nichtGeuebt: (taste: string) => `${taste}: noch nicht geübt`,
    tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} Sekunden pro Anschlag`,
    beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
      `${taste}: ${stand}, ${prozent} Treffer${tempo}`,
    deineTasten: "Deine Tasten",
    stand: (sitzen: number, gesamt: number, alles: boolean) => [
      sitzen,
      " von ",
      gesamt,
      " sitzen",
      alles ? ", alles gelernt!" : "",
    ],
    klappName: (titel: string, probleme: string, offen: boolean) =>
      `${titel}. ` +
      (probleme ? `Macht gerade Probleme: ${probleme}. ` : "") +
      (offen ? "Zuklappen." : "Aufklappen."),
    listeName: "Tasten-Stand",
    alsNaechstes: (taste: string) =>
      `Als Nächstes: ${taste} (wird freigeschaltet, sobald die anderen sitzen)`,
    naechsteGesperrt: (taste: string) => `Nächste Einheit ${taste}: noch gesperrt`,
  },
  en: {
    naechsteTaste: "next key",
    naechsteName: (taste: string) => `Next key ${taste}: show explanation`,
    kommtVor: "This key is added",
    kommtFett: "automatically",
    kommtNach:
      " as soon as the others are mastered - just keep practising. The better you know the keys you already have, the sooner the next one unlocks.",
    sitzt: "mastered",
    wackelig: "wobbly",
    hakt: "not there yet",
    neu: "new",
    nichtGeuebt: (taste: string) => `${taste}: not practised yet`,
    tempo: (sekunden: number) => `, ${sekunden.toFixed(1)} seconds per keystroke`,
    beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
      `${taste}: ${stand}, ${prozent} correct${tempo}`,
    deineTasten: "Your keys",
    stand: (sitzen: number, gesamt: number, alles: boolean) => [
      sitzen,
      " of ",
      gesamt,
      " mastered",
      alles ? ", all learnt!" : "",
    ],
    klappName: (titel: string, probleme: string, offen: boolean) =>
      `${titel}. ` +
      (probleme ? `Tricky right now: ${probleme}. ` : "") +
      (offen ? "Collapse." : "Expand."),
    listeName: "Key progress",
    alsNaechstes: (taste: string) => `Next: ${taste} (unlocks as soon as the others are mastered)`,
    naechsteGesperrt: (taste: string) => `Next key ${taste}: not unlocked yet`,
  },
  fr: {
    naechsteTaste: "prochaine touche",
    naechsteName: (taste: string) => `Prochaine touche ${taste} : afficher l'explication`,
    kommtVor: "Cette touche s'ajoute",
    kommtFett: "automatiquement",
    kommtNach:
      ", dès que les autres sont acquises - continue simplement à t'exercer. Plus les touches actuelles sont sûres, plus vite la suivante arrive.",
    sitzt: "acquise",
    wackelig: "instable",
    hakt: "pas encore",
    neu: "nouvelle",
    nichtGeuebt: (taste: string) => `${taste} : pas encore exercée`,
    tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} secondes par frappe`,
    beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
      `${taste} : ${stand}, ${prozent} réussi${tempo}`,
    deineTasten: "Tes touches",
    stand: (sitzen: number, gesamt: number, alles: boolean) => [
      sitzen,
      " sur ",
      gesamt,
      " acquises",
      alles ? ", tout est appris !" : "",
    ],
    klappName: (titel: string, probleme: string, offen: boolean) =>
      `${titel}. ` +
      (probleme ? `Pose problème en ce moment : ${probleme}. ` : "") +
      (offen ? "Replier." : "Déplier."),
    listeName: "État des touches",
    alsNaechstes: (taste: string) => `Ensuite : ${taste} (se débloque dès que les autres sont acquises)`,
    naechsteGesperrt: (taste: string) => `Prochaine touche ${taste} : pas encore débloquée`,
  },
  // ★ ES-O (27.09.2026): tú (die lernende Person).
  es: {
    naechsteTaste: "tecla siguiente",
    naechsteName: (taste: string) => `Tecla siguiente ${taste}: mostrar la explicación`,
    kommtVor: "Esta tecla se añade",
    kommtFett: "automáticamente",
    kommtNach:
      " en cuanto las demás te salgan seguras - sigue practicando sin más. Cuanto más seguras sean las teclas de ahora, antes llega la siguiente.",
    sitzt: "aprendida",
    wackelig: "insegura",
    hakt: "todavía no",
    neu: "nueva",
    nichtGeuebt: (taste: string) => `${taste}: todavía sin practicar`,
    // ★ D1 (28.09.2026, Nr. 15): Dezimalzeichen nach dem Land der Browsersprache
    // (Mexiko „1.2", Argentinien „1,2", ohne Land das Komma) - `dezimal`.
    tempo: (sekunden: number) =>
      `, ${dezimal("es") === "," ? sekunden.toFixed(1).replace(".", ",") : sekunden.toFixed(1)} segundos por pulsación`,
    beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
      `${taste}: ${stand}, ${prozent} acertado${tempo}`,
    deineTasten: "Tus teclas",
    stand: (sitzen: number, gesamt: number, alles: boolean) => [
      sitzen,
      " de ",
      gesamt,
      " aprendidas",
      alles ? ", ¡lo has aprendido todo!" : "",
    ],
    klappName: (titel: string, probleme: string, offen: boolean) =>
      `${titel}. ` +
      (probleme ? `Ahora cuesta: ${probleme}. ` : "") +
      (offen ? "Plegar." : "Desplegar."),
    listeName: "Estado de las teclas",
    alsNaechstes: (taste: string) => `Después: ${taste} (se desbloquea en cuanto las demás te salgan seguras)`,
    naechsteGesperrt: (taste: string) => `Tecla siguiente ${taste}: todavía no desbloqueada`,
  },
  // ★ O-IT (02.10.2026): das Kind liest „tu"; Dezimalkomma (Glossar Regel 5).
  it: {
    naechsteTaste: "prossimo tasto",
    naechsteName: (taste: string) => `Prossimo tasto ${taste}: mostra la spiegazione`,
    kommtVor: "Questo tasto arriva",
    kommtFett: "da solo",
    kommtNach:
      " appena gli altri ti vengono sicuri - continua semplicemente a esercitarti. Più sono sicuri i tasti di adesso, prima arriva il prossimo.",
    sitzt: "imparato",
    wackelig: "incerto",
    hakt: "non ancora",
    neu: "nuovo",
    nichtGeuebt: (taste: string) => `${taste}: non ancora esercitato`,
    tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} secondi per battuta`,
    beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
      `${taste}: ${stand}, ${prozent} di battute giuste${tempo}`,
    deineTasten: "I tuoi tasti",
    stand: (sitzen: number, gesamt: number, alles: boolean) => [
      sitzen,
      " di ",
      gesamt,
      " imparati",
      alles ? ", hai imparato tutto!" : "",
    ],
    klappName: (titel: string, probleme: string, offen: boolean) =>
      `${titel}. ` +
      (probleme ? `Adesso è difficile: ${probleme}. ` : "") +
      (offen ? "Chiudi." : "Apri."),
    listeName: "Stato dei tasti",
    alsNaechstes: (taste: string) => `Poi: ${taste} (si sblocca appena gli altri ti vengono sicuri)`,
    naechsteGesperrt: (taste: string) => `Prossimo tasto ${taste}: non ancora sbloccato`,
  },
  // ★ O-PL (02.10.2026): ty; die Stände „pewny · niepewny · jeszcze nie · nowy"
  // (Glossar §2.2, sie gehören zu „klawisz"), Dezimalkomma, Zahlen nach dem
  // Doppelpunkt (Regel 11), „raz/razy" mit allen vier Formen (§2.10a).
  pl: {
    naechsteTaste: "następny klawisz",
    naechsteName: (taste: string) => `Następny klawisz ${taste}: pokaż wyjaśnienie`,
    kommtVor: "Ten klawisz dojdzie",
    kommtFett: "automatycznie",
    kommtNach:
      ", gdy pozostałe będą pewne - po prostu ćwicz dalej. Im pewniejsze są obecne klawisze, tym szybciej odblokuje się następny.",
    sitzt: "pewny",
    wackelig: "niepewny",
    hakt: "jeszcze nie",
    neu: "nowy",
    nichtGeuebt: (taste: string) => `${taste}: jeszcze nie ćwiczony`,
    // `toFixed(1)` ist immer eine Bruchzahl („1,0") - darum die Form `other` „sekundy".
    tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} sekundy na uderzenie`,
    beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
      `${taste}: ${stand}, dokładność: ${prozent}${tempo}`,
    deineTasten: "Twoje klawisze",
    stand: (sitzen: number, gesamt: number, alles: boolean) => [
      "Pewne klawisze: ",
      sitzen,
      " z ",
      gesamt,
      alles ? " - wszystko opanowane!" : "",
    ],
    klappName: (titel: string, probleme: string, offen: boolean) =>
      `${titel}. ` +
      (probleme ? `Teraz sprawiają trudność: ${probleme}. ` : "") +
      (offen ? "Zwiń." : "Rozwiń."),
    listeName: "Stan klawiszy",
    alsNaechstes: (taste: string) => `Następny: ${taste} (odblokuje się, gdy pozostałe będą pewne)`,
    naechsteGesperrt: (taste: string) => `Następny klawisz ${taste}: jeszcze zablokowany`,
  },
  // ★ O-TR (02.10.2026): sen; die Stände „oturdu · henüz oturmadı · biraz daha ·
  // yeni" (Glossar §2.2 Tastenkarte), Dezimalkomma, Prozent „%95" (`fmtPercent`),
  // Zahlen ohne Endung („Oturan tuşlar: 12, toplam 20", „3 kez").
  tr: {
    naechsteTaste: "sıradaki tuş",
    naechsteName: (taste: string) => `Sıradaki tuş: ${taste}. Açıklamayı göster`,
    kommtVor: "Diğerleri oturunca bu tuş",
    kommtFett: "kendiliğinden",
    kommtNach:
      " eklenir - sen çalışmaya devam et, yeter. Şimdiki tuşlar ne kadar iyi oturursa sıradaki tuşun kilidi o kadar çabuk açılır.",
    sitzt: "oturdu",
    wackelig: "henüz oturmadı",
    hakt: "biraz daha",
    neu: "yeni",
    nichtGeuebt: (taste: string) => `${taste}: henüz çalışılmadı`,
    tempo: (sekunden: number) => `, vuruş başına ${sekunden.toFixed(1).replace(".", ",")} saniye`,
    beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
      `${taste}: ${stand}, doğruluk: ${prozent}${tempo}`,
    deineTasten: "Tuşların",
    stand: (sitzen: number, gesamt: number, alles: boolean) => [
      "Oturan tuşlar: ",
      sitzen,
      ", toplam ",
      gesamt,
      alles ? " - hepsini öğrendin!" : "",
    ],
    klappName: (titel: string, probleme: string, offen: boolean) =>
      `${titel}. ` +
      (probleme ? `Şu an zor gelen tuşlar: ${probleme}. ` : "") +
      (offen ? "Daralt." : "Genişlet."),
    listeName: "Tuş durumu",
    alsNaechstes: (taste: string) => `Sıradaki: ${taste} (diğerleri oturunca kilidi açılır)`,
    naechsteGesperrt: (taste: string) => `Sıradaki tuş: ${taste}. Kilidi henüz açılmadı`,
  },
  // ★ O-CS (03.10.2026): ty; die Stände „jistá · nejistá · ještě ne · nová"
  // (Glossar §2.2 - Adjektiv an der KLÁVESA, nie am Kind), Dezimalkomma, Zahlen
  // nach dem Doppelpunkt mit Schrägstrich („Jisté klávesy: 12/20", Regel 13),
  // Dauer abgekürzt („1,5 s na úhoz", §2.10) und „3krát" (unveränderlich).
  cs: {
    naechsteTaste: "další klávesa",
    naechsteName: (taste: string) => `Další klávesa ${taste}: zobrazit vysvětlení`,
    kommtVor: "Tato klávesa přibude",
    kommtFett: "automaticky",
    kommtNach:
      ", jakmile ti ostatní půjdou jistě - prostě cvič dál. Čím jistější jsou dosavadní klávesy, tím dřív se odemkne další.",
    sitzt: "jistá",
    wackelig: "nejistá",
    hakt: "ještě ne",
    neu: "nová",
    nichtGeuebt: (taste: string) => `${taste}: zatím bez cvičení`,
    tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} s na úhoz`,
    beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
      `${taste}: ${stand}, přesnost: ${prozent}${tempo}`,
    deineTasten: "Tvoje klávesy",
    stand: (sitzen: number, gesamt: number, alles: boolean) => [
      "Jisté klávesy: ",
      sitzen,
      "/",
      gesamt,
      alles ? " - všechno umíš!" : "",
    ],
    klappName: (titel: string, probleme: string, offen: boolean) =>
      `${titel}. ` +
      (probleme ? `Teď dělají potíže: ${probleme}. ` : "") +
      (offen ? "Sbalit." : "Rozbalit."),
    listeName: "Stav kláves",
    alsNaechstes: (taste: string) => `Jako další: ${taste} (odemkne se, jakmile ti ostatní půjdou jistě)`,
    naechsteGesperrt: (taste: string) => `Další klávesa ${taste}: zatím zamčená`,
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      naechsteTaste: "следващ клавиш",
      naechsteName: (taste: string) => `Следващ клавиш ${taste}: покажи обяснението`,
      kommtVor: "Този клавиш се добавя",
      kommtFett: "автоматично",
      kommtNach:
        ", щом другите станат сигурни - просто продължавай да се упражняваш. Колкото по-сигурни са досегашните клавиши, толкова по-бързо се отключва следващият.",
      sitzt: "сигурен",
      wackelig: "несигурен",
      hakt: "още не",
      neu: "нов",
      nichtGeuebt: (taste: string) => `${taste}: още не е упражняван`,
      tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} секунди на знак`,
      beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
        `${taste}: ${stand}, точност ${prozent}${tempo}`,
      deineTasten: "Твоите клавиши",
      stand: (sitzen: number, gesamt: number, alles: boolean) => [
        "Сигурни: ",
        sitzen,
        "/",
        gesamt,
        alles ? " - всичко е научено!" : "",
      ],
      klappName: (titel: string, probleme: string, offen: boolean) =>
        `${titel}. ` +
        (probleme ? `В момента затрудняват: ${probleme}. ` : "") +
        (offen ? "Свий." : "Разгъни."),
      listeName: "Състояние на клавишите",
      alsNaechstes: (taste: string) => `Следва: ${taste} (отключва се, щом другите станат сигурни)`,
      naechsteGesperrt: (taste: string) => `Следващ клавиш ${taste}: още не е отключен`,
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      naechsteTaste: "επόμενο πλήκτρο",
      naechsteName: (taste: string) => `Επόμενο πλήκτρο ${taste}: εμφάνιση εξήγησης`,
      kommtVor: "Αυτό το πλήκτρο προστίθεται",
      kommtFett: "αυτόματα",
      kommtNach:
        " μόλις γίνουν σίγουρα τα άλλα - απλώς συνέχισε την εξάσκηση. Όσο πιο σίγουρα είναι τα πλήκτρα που ήδη έχεις, τόσο πιο γρήγορα ξεκλειδώνει το επόμενο.",
      sitzt: "σίγουρο",
      wackelig: "αβέβαιο",
      hakt: "όχι ακόμα",
      neu: "νέο",
      nichtGeuebt: (taste: string) => `${taste}: χωρίς εξάσκηση ακόμα`,
      tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} δευτερόλεπτα ανά πάτημα`,
      beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
        `${taste}: ${stand}, ακρίβεια ${prozent}${tempo}`,
      deineTasten: "Τα πλήκτρα σου",
      stand: (sitzen: number, gesamt: number, alles: boolean) => [
        sitzen,
        " από ",
        gesamt,
        " σίγουρα",
        alles ? ", τα έμαθες όλα!" : "",
      ],
      klappName: (titel: string, probleme: string, offen: boolean) =>
        `${titel}. ` +
        (probleme ? `Δυσκολεύουν τώρα: ${probleme}. ` : "") +
        (offen ? "Σύμπτυξη." : "Ανάπτυξη."),
      listeName: "Κατάσταση πλήκτρων",
      alsNaechstes: (taste: string) => `Επόμενο: ${taste} (ξεκλειδώνει μόλις γίνουν σίγουρα τα άλλα)`,
      naechsteGesperrt: (taste: string) => `Επόμενο πλήκτρο ${taste}: δεν ξεκλειδώθηκε ακόμα`,
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      naechsteTaste: "következő billentyű",
      naechsteName: (taste: string) => `Következő billentyű: ${taste} - magyarázat megjelenítése`,
      kommtVor: "Ez a billentyű",
      kommtFett: "automatikusan",
      kommtNach:
        " hozzájön, amint a többi biztos - csak gyakorolj tovább. Minél biztosabbak az eddigi billentyűk, annál hamarabb nyílik meg a következő.",
      sitzt: "biztos",
      wackelig: "bizonytalan",
      hakt: "még nem megy",
      neu: "új",
      nichtGeuebt: (taste: string) => `${taste}: még nem gyakoroltad`,
      tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} másodperc leütésenként`,
      beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
        `${taste}: ${stand}, pontosság: ${prozent}${tempo}`,
      deineTasten: "A billentyűid",
      stand: (sitzen: number, gesamt: number, alles: boolean) => [
        "Biztos: ",
        sitzen,
        "/",
        gesamt,
        alles ? ", mindent megtanultál!" : "",
      ],
      klappName: (titel: string, probleme: string, offen: boolean) =>
        `${titel}. ` +
        (probleme ? `Most nehezebben megy: ${probleme}. ` : "") +
        (offen ? "Becsukás." : "Kinyitás."),
      listeName: "Billentyűk állapota",
      alsNaechstes: (taste: string) => `Következik: ${taste} (feloldódik, amint a többi biztos)`,
      naechsteGesperrt: (taste: string) => `Következő billentyű: ${taste} - még nincs feloldva`,
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      naechsteTaste: "volgende toets",
      naechsteName: (taste: string) => `Volgende toets ${taste}: uitleg tonen`,
      kommtVor: "Deze toets komt er",
      kommtFett: "vanzelf bij",
      kommtNach:
        ", zodra de andere zeker zijn - gewoon verder oefenen. Hoe zekerder je de toetsen tot nu toe kent, hoe sneller de volgende vrijgespeeld wordt.",
      sitzt: "zeker",
      wackelig: "onzeker",
      hakt: "nog niet",
      neu: "nieuw",
      nichtGeuebt: (taste: string) => `${taste}: nog niet geoefend`,
      tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} seconden per aanslag`,
      beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
        `${taste}: ${stand}, ${prozent} goed${tempo}`,
      deineTasten: "Jouw toetsen",
      stand: (sitzen: number, gesamt: number, alles: boolean) => [
        sitzen,
        " van ",
        gesamt,
        " zeker",
        alles ? ", alles geleerd!" : "",
      ],
      klappName: (titel: string, probleme: string, offen: boolean) =>
        `${titel}. ` +
        (probleme ? `Nu nog lastig: ${probleme}. ` : "") +
        (offen ? "Inklappen." : "Uitklappen."),
      listeName: "Stand van de toetsen",
      alsNaechstes: (taste: string) => `Hierna: ${taste} (wordt vrijgespeeld zodra de andere zeker zijn)`,
      naechsteGesperrt: (taste: string) => `Volgende toets ${taste}: nog niet vrijgespeeld`,
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      naechsteTaste: "próxima tecla",
      naechsteName: (taste: string) => `Próxima tecla ${taste}: mostrar explicação`,
      kommtVor: "Esta tecla junta-se",
      kommtFett: "automaticamente",
      kommtNach:
        " assim que as outras estiverem dominadas - é só continuar a praticar. Quanto melhor dominares as teclas que já tens, mais depressa se desbloqueia a seguinte.",
      sitzt: "dominada",
      wackelig: "em consolidação",
      hakt: "difícil",
      neu: "nova",
      nichtGeuebt: (taste: string) => `${taste}: ainda não praticada`,
      tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} segundos por toque`,
      beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
        `${taste}: ${stand}, ${prozent} de acertos${tempo}`,
      deineTasten: "As tuas teclas",
      stand: (sitzen: number, gesamt: number, alles: boolean) => [
        sitzen,
        " de ",
        gesamt,
        " dominadas",
        alles ? ", tudo aprendido!" : "",
      ],
      klappName: (titel: string, probleme: string, offen: boolean) =>
        `${titel}. ` +
        (probleme ? `Difíceis neste momento: ${probleme}. ` : "") +
        (offen ? "Recolher." : "Expandir."),
      listeName: "Estado das teclas",
      alsNaechstes: (taste: string) =>
        `A seguir: ${taste} (é desbloqueada assim que as outras estiverem dominadas)`,
      naechsteGesperrt: (taste: string) => `Próxima tecla ${taste}: ainda não desbloqueada`,
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      naechsteTaste: "próxima tecla",
      naechsteName: (taste: string) => `Próxima tecla ${taste}: mostrar explicação`,
      kommtVor: "Esta tecla entra",
      kommtFett: "automaticamente",
      kommtNach:
        " assim que as outras estiverem seguras - é só continuar praticando. Quanto mais seguras estiverem as teclas que você já tem, mais rápido a próxima é desbloqueada.",
      sitzt: "segura",
      wackelig: "insegura",
      hakt: "ainda não",
      neu: "nova",
      nichtGeuebt: (taste: string) => `${taste}: ainda não praticada`,
      tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} segundos por toque`,
      beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
        `${taste}: ${stand}, ${prozent} de acertos${tempo}`,
      deineTasten: "Suas teclas",
      stand: (sitzen: number, gesamt: number, alles: boolean) => [
        sitzen,
        " de ",
        gesamt,
        " seguras",
        alles ? ", tudo aprendido!" : "",
      ],
      klappName: (titel: string, probleme: string, offen: boolean) =>
        `${titel}. ` +
        (probleme ? `Dando trabalho agora: ${probleme}. ` : "") +
        (offen ? "Recolher." : "Expandir."),
      listeName: "Situação das teclas",
      alsNaechstes: (taste: string) => `A seguir: ${taste} (é desbloqueada assim que as outras estiverem seguras)`,
      naechsteGesperrt: (taste: string) => `Próxima tecla ${taste}: ainda bloqueada`,
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      naechsteTaste: "tasta următoare",
      naechsteName: (taste: string) => `Tasta următoare ${taste}: arată explicația`,
      kommtVor: "Această tastă se adaugă",
      kommtFett: "automat",
      kommtNach:
        " imediat ce celelalte sunt sigure - exersează mai departe. Cu cât știi mai bine tastele de până acum, cu atât se deblochează mai repede următoarea.",
      sitzt: "sigură",
      wackelig: "nesigură",
      hakt: "încă nu",
      neu: "nouă",
      nichtGeuebt: (taste: string) => `${taste}: încă neexersată`,
      // Zehntel sind im Rumänischen immer „few" (ohne „de"): „1,5 secunde", „2,0 secunde".
      tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} secunde pe apăsare`,
      beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
        `${taste}: ${stand}, precizie ${prozent}${tempo}`,
      deineTasten: "Tastele tale",
      stand: (sitzen: number, gesamt: number, alles: boolean) => [
        sitzen,
        " din ",
        gesamt,
        " sigure",
        alles ? ", toate învățate!" : "",
      ],
      klappName: (titel: string, probleme: string, offen: boolean) =>
        `${titel}. ` +
        (probleme ? `Dificile acum: ${probleme}. ` : "") +
        (offen ? "Restrângeți." : "Extindeți."),
      listeName: "Starea tastelor",
      alsNaechstes: (taste: string) => `Urmează: ${taste} (se deblochează imediat ce celelalte sunt sigure)`,
      naechsteGesperrt: (taste: string) => `Tasta următoare ${taste}: încă blocată`,
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      naechsteTaste: "nästa tangent",
      naechsteName: (taste: string) => `Nästa tangent ${taste}: visa förklaring`,
      kommtVor: "Den här tangenten läggs till",
      kommtFett: "automatiskt",
      kommtNach:
        " så snart de andra är säkra - fortsätt bara att öva. Ju säkrare du är på tangenterna du redan har, desto snabbare låses nästa upp.",
      sitzt: "säker",
      wackelig: "osäker",
      hakt: "inte än",
      neu: "ny",
      nichtGeuebt: (taste: string) => `${taste}: inte övad än`,
      tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} sekunder per anslag`,
      beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
        `${taste}: ${stand}, ${prozent} rätt${tempo}`,
      deineTasten: "Dina tangenter",
      stand: (sitzen: number, gesamt: number, alles: boolean) => [
        sitzen,
        " av ",
        gesamt,
        " säkra",
        alles ? ", allt inlärt!" : "",
      ],
      klappName: (titel: string, probleme: string, offen: boolean) =>
        `${titel}. ` +
        (probleme ? `Svårt just nu: ${probleme}. ` : "") +
        (offen ? "Fäll ihop." : "Fäll ut."),
      listeName: "Läget för tangenterna",
      alsNaechstes: (taste: string) => `Nästa: ${taste} (låses upp så snart de andra är säkra)`,
      naechsteGesperrt: (taste: string) => `Nästa tangent ${taste}: inte upplåst än`,
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      naechsteTaste: "наступна клавіша",
      naechsteName: (taste: string) => `Наступна клавіша ${taste}: показати пояснення`,
      kommtVor: "Ця клавіша додається",
      kommtFett: "автоматично",
      kommtNach:
        ", щойно інші стануть впевненими - просто тренуйся далі. Чим упевненіші твої клавіші, тим швидше відкриється наступна.",
      sitzt: "впевнена",
      wackelig: "непевна",
      hakt: "ще ні",
      neu: "нова",
      nichtGeuebt: (taste: string) => `${taste}: ще не тренована`,
      // Dezimalzahl ⇒ immer die Bruchzahl-Form „секунди" (Glossar §2.11).
      tempo: (sekunden: number) => `, ${sekunden.toFixed(1).replace(".", ",")} секунди на натискання`,
      beschreibung: (taste: string, stand: string, prozent: string, tempo: string) =>
        `${taste}: ${stand}, точність ${prozent}${tempo}`,
      deineTasten: "Твої клавіші",
      stand: (sitzen: number, gesamt: number, alles: boolean) => [
        "Впевнені: ",
        sitzen,
        "/",
        gesamt,
        alles ? " - усе вивчено!" : "",
      ],
      klappName: (titel: string, probleme: string, offen: boolean) =>
        `${titel}. ` +
        (probleme ? `Зараз складно: ${probleme}. ` : "") +
        (offen ? "Згорнути." : "Розгорнути."),
      listeName: "Стан клавіш",
      alsNaechstes: (taste: string) => `Далі: ${taste} (відкриється, щойно інші стануть впевненими)`,
      naechsteGesperrt: (taste: string) => `Наступна клавіша ${taste}: ще не відкрита`,
    },
});

type KartenTexte = (typeof KARTE_TEXTE)["de"];

/**
 * „12 von 20 sitzen" - der Stand der Tastenkarte in einem Satz.
 *
 * ★ 19.09.2026: Auch die `<summary>` von „Tasten-Stand" in „Meine Statistik"
 * (`PupilStatsPanel`) nennt ihn, zugeklappt lesbar. Er steht darum HIER als
 * EINE Stelle - zwei Fassungen desselben Satzes liefen beim ersten Nachbessern
 * auseinander ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export function tastenStandSatz(
  sitzen: number,
  gesamt: number,
  alles: boolean,
  sprache: BedienSprache = "de",
) {
  return KARTE_TEXTE[sprache].stand(sitzen, gesamt, alles);
}

/** Der Name einer Taste in der Bedienungssprache. */
const TASTE_NAME_JE_SPRACHE: Record<BedienSprache, (unit: string) => string> = {
  de: unitLabel,
  en: unitLabelEn,
  fr: unitLabelFr,
  es: unitLabelEs,
  it: unitLabelIt,
  pl: unitLabelPl, // ★ O-PL (02.10.2026)
  tr: unitLabelTr, // ★ O-TR (02.10.2026)
  cs: unitLabelCs, // ★ O-CS (03.10.2026)
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: unitLabelBg,
  el: unitLabelEl,
  hu: unitLabelHu,
  nl: unitLabelNl,
  pt: unitLabelPt,
  br: unitLabelBr,
  ro: unitLabelRo,
  sv: unitLabelSv,
  uk: unitLabelUk,
};
function tasteName(unit: string, sprache: BedienSprache): string {
  return TASTE_NAME_JE_SPRACHE[sprache](unit);
}

/**
 * Der kleine Erklärkasten zur nächsten Taste.
 *
 * ★ Nr 13 der Fokusziele (22.08.2026): Er ist KEIN DIALOG MEHR.
 *
 * Er trug `role="dialog"` samt `aria-modal="true"`, hatte aber weder eine
 * Fokus-Falle noch überhaupt ein Bedienelement darin - eine Sprachausgabe
 * meldete also einen modalen Dialog, in den man mit Tab nie hineinkam, und
 * meldete zugleich die ganze Seite dahinter als verdeckt. Jetzt ist er das,
 * was er ist: ein Aufklapp-Text, der über `aria-describedby` am Knopf hängt.
 * Damit liest die Sprachausgabe ihn beim Aufklappen vor, ohne dass irgendwo
 * ein Fokus wandern müsste, und `aria-expanded` sagt den Zustand an.
 *
 * ★ R6 (Johannes, 22.08.2026): Escape schließt und holt die EINGABEZEILE -
 * auch hier, wie überall. Die frühere Fassung schloss den Kasten und ließ den
 * Fokus stehen, wo er gerade war.
 */
function NextKeyHint({ next, shiftLearned }: { next: string; shiftLearned: boolean }) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = KARTE_TEXTE[sprache];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const kastenId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      focusPracticeField();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative inline-flex items-center gap-1.5">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-sunken px-3 py-1 text-sm font-medium text-ink-soft hover:text-ink"
        aria-expanded={open}
        aria-controls={open ? kastenId : undefined}
        aria-describedby={open ? kastenId : undefined}
        aria-label={t.naechsteName(tasteName(next, sprache))}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {t.naechsteTaste}
        <span aria-hidden="true" className="text-ink-muted">
          ⓘ
        </span>
      </button>
      <span
        aria-hidden="true"
        className="flex h-6 w-6 items-center justify-center rounded-md border border-dashed border-hairline bg-surface font-legible text-sm font-semibold text-ink-muted"
      >
        {unitGlyph(next, shiftLearned)}
      </span>
      {open && (
        <div
          id={kastenId}
          className="absolute left-1/2 top-full z-40 mt-2 w-72 max-w-[80vw] -translate-x-1/2 rounded-xl border border-hairline bg-surface-raised p-3 text-left text-sm font-normal text-ink-soft shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {t.kommtVor}{" "}
          <strong className="text-ink">{t.kommtFett}</strong>
          {t.kommtNach}
        </div>
      )}
    </div>
  );
}

const LEVEL_CLASS: Record<string, string> = {
  sitzt: "bg-success-soft border-success text-ink",
  wackelig: "bg-warning-soft border-warning text-ink",
  hakt: "bg-danger-soft border-danger text-ink",
  neu: "bg-surface-sunken border-hairline text-ink-muted",
};

/** Die Beschriftung eines Standes - dieselben vier Wörter wie die Legende. */
function levelLabel(t: KartenTexte, lvl: string): string {
  return lvl === "sitzt" ? t.sitzt : lvl === "wackelig" ? t.wackelig : lvl === "hakt" ? t.hakt : t.neu;
}

function describe(
  ch: string,
  s: LetterStat | undefined,
  m: Mastery | undefined,
  lernweg: Lernweg,
  baseMs: number | undefined,
  sprache: BedienSprache = "de",
): string {
  const t = KARTE_TEXTE[sprache];
  const lvl = letterLevel(s, m, lernweg, ch, baseMs);
  const name = tasteName(ch, sprache);
  if (letterSamples(s) === 0) return t.nichtGeuebt(name);
  const ms = letterMs(s);
  const tempo = ms !== null ? t.tempo(ms / 1000) : "";
  return t.beschreibung(name, levelLabel(t, lvl), fmtPercent(letterAccuracy(s), sprache), tempo);
}

export interface LetterMapProps {
  letters: Record<string, LetterStat>;
  introduced: string[];
  /** ★ E1 (24.09.2026): der Lernweg DES KINDES - er bestimmt die nächste Taste. */
  lernweg: Lernweg;
  /** Einheiten, die gerade besonders geübt werden (Hervorhebung). */
  focus?: string[];
  /** Die nächste, noch gesperrte Einheit mit anzeigen. */
  showNext?: boolean;
  /** Kompakte Darstellung (Lehrer-Dashboard). */
  compact?: boolean;
  /** Anforderungs-Stufe (Schwellen für „sitzt"). */
  mastery?: Mastery;
  title?: string;
  /** Einklappbar machen (Kopf wird Schalter). Status wird von außen gesteuert. */
  collapsible?: boolean;
  /** Bei `collapsible`: ist die Karte aufgeklappt? */
  open?: boolean;
  /** Bei `collapsible`: Auf-/Zuklappen. */
  onToggleOpen?: () => void;
  /**
   * Den „Groß ohne Umschalt"-Hinweis im Header anzeigen — wird von AdaptiveTrainer
   * gesetzt, wenn der Hinweis aus dem Tippfeld hierher verschoben wurde.
   */
  showAutoCapHint?: boolean;
  /**
   * ★ 19.09.2026: Die Karte steht IN einem Abschnitt, der Überschrift und
   * Stand schon trägt - „Tasten-Stand" in „Meine Statistik" ist seither eine
   * Ausklappzeile (`<details>`), deren `h3` in der `<summary>` steht
   * (`PupilStatsPanel`). Dann hat die Karte KEINEN eigenen Kopf (keine zweite
   * Überschrift „Tasten-Stand", kein zweiter Stand-Satz) und keine eigene
   * Karte (kein Kasten im Kasten); die Tasten-Liste hängt per
   * `aria-labelledby` an der Überschrift draussen - der Wert ist deren `id`.
   *
   * (Bis 19.09.2026 stand hier `flach` für die Lehrkraft-Zeile - die zeigt die
   * Karte seit E4, 18.09.2026, nicht mehr; der einzige Aufrufer ist jetzt die
   * eingebettete Fassung.)
   */
  beschriftetVon?: string;
}

export function LetterMap({
  letters,
  introduced,
  lernweg,
  focus = [],
  showNext = true,
  compact = false,
  mastery,
  title,
  collapsible = false,
  open = true,
  onToggleOpen,
  showAutoCapHint = false,
  beschriftetVon,
}: LetterMapProps) {
  // Kennung der Überschrift, an der die Tasten-Liste hängt (nur im
  // aufgeklappten Betrieb, siehe unten). `useId` statt einer festen Zeichenkette:
  // Die Karte steht im Lehrer-Dashboard mehrfach nebeneinander.
  const titelId = useId();
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = KARTE_TEXTE[sprache];
  // Vorgabe „Deine Tasten" - in der Bedienungssprache (EN3).
  const titel = title ?? t.deineTasten;
  const focusSet = new Set(focus);
  const done = masteredCount(introduced, letters, lernweg, mastery);
  // Eigen-Tempo des Kindes als Referenz für die faire, zeichenabhängige Bewertung
  // (Sonderzeichen dürfen langsamer „sitzen" als Grundreihen-Buchstaben).
  const baseMs = personalBaseMs(introduced, letters, lernweg, mastery);
  const next = nextLetter(introduced, lernweg);
  const size = compact ? "h-7 w-7 text-sm" : "h-10 w-10 text-lg";
  const showBody = !collapsible || open;
  // Buchstaben groß anzeigen sobald die Umschalttaste gelernt wurde; vorher
  // Kleinbuchstaben — sonst verwirrend, weil Shift noch nicht da ist.
  const shiftLearned = introduced.includes(SHIFT_UNIT);

  // Die Tasten, die gerade die meisten Probleme machen — für den schlanken Balken,
  // wenn die Karte eingeklappt ist: „hakt" vor „wackelig", die schwächste zuerst.
  // Höchstens ein paar, damit die Kopfzeile nicht überläuft.
  const problemKeys = introduced
    .filter((ch) => {
      const lvl = letterLevel(letters[ch], mastery, lernweg, ch, baseMs);
      return lvl === "hakt" || lvl === "wackelig";
    })
    .sort((a, b) => letterAccuracy(letters[a]) - letterAccuracy(letters[b]))
    .slice(0, 6);

  const summary = (
    <span className="text-sm text-ink-muted">
      {tastenStandSatz(done, introduced.length, !next, sprache)}
    </span>
  );

  // Der NÄCHSTE freizuschaltende Buchstabe — rechts im Header als Label + Kachel,
  // damit man immer sieht, was als Nächstes kommt. Kachel zeigt das Zeichen
  // in der jeweiligen Groß-/Kleinschreibung (Wunsch Johannes).
  const nextElement =
    showNext && next ? (
      <NextKeyHint next={next} shiftLearned={shiftLearned} />
    ) : null;

  return (
    // ★ `beschriftetVon` - ohne Karte und ohne Kopf, siehe die Eigenschaft.
    <div className={compact ? "space-y-1.5" : beschriftetVon ? "space-y-2" : "card space-y-2 p-4"}>
      {beschriftetVon ? null : collapsible ? (
        /* Linke Seite (Toggle-Button) und rechte Seite (Info-Elemente) sind
           bewusst GETRENNT: AutoCapHint ist selbst ein Button und darf laut
           HTML-Spec nicht in einem anderen Button stecken. */
        <div className="flex w-full flex-wrap items-center justify-between gap-x-3">
          <button
            type="button"
            onClick={onToggleOpen}
            aria-expanded={open}
            aria-label={t.klappName(
              titel,
              !open && problemKeys.length
                ? problemKeys.map((ch) => tasteName(ch, sprache)).join(", ")
                : "",
              open,
            )}
            className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-left"
          >
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="text-ink-muted">
                {open ? "▾" : "▸"}
              </span>
              <span className="text-sm font-semibold text-ink">{titel}</span>
            </span>
            {/* Eingeklappt: die Tasten mit den meisten Problemen direkt im Balken
               (statt eines großen leeren Bereichs). Aufgeklappt zeigt der Körper
               ohnehin alle Tasten. */}
            {!open && problemKeys.length > 0 && (
              <span aria-hidden className="flex flex-wrap items-center gap-1">
                {problemKeys.map((ch) => (
                  <span
                    key={ch}
                    className={
                      "flex h-6 w-6 items-center justify-center rounded-md border font-legible text-sm font-semibold " +
                      LEVEL_CLASS[letterLevel(letters[ch], mastery, lernweg, ch, baseMs)]
                    }
                  >
                    {unitGlyph(ch, shiftLearned)}
                  </span>
                ))}
              </span>
            )}
          </button>
          {/* `shrink-0` ist bewusst weg und `flex-wrap` dazu: Bei 320 px
             passen Hinweis-Kachel + Zusammenfassung nicht mehr in eine Zeile,
             und `shrink-0` hätte das verhindert, statt umzubrechen (Prüfpunkt
             8.2, gemessen 25./26.08. — grösster Einzelanteil, ~50 px). */}
          <span className="flex flex-wrap items-center gap-2">
            {nextElement}
            {showAutoCapHint && !shiftLearned && <AutoCapHint />}
            {summary}
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          {/* ★ 28.08.2026 (§0.5): Diese Überschrift gibt es hier seit jeher -
             sie ist die Sprungmarke der Karte für die Screenreader-Taste „h".
             Neu ist nur, dass die Tasten-Liste unten per `aria-labelledby` an
             ihr hängt statt ein gleichlautendes `aria-label` daneben zu
             führen; doppelte Auskunft kostet auf der Braillezeile Platz. Im
             EINGEKLAPPTEN Betrieb (Trainer-Kopf) gibt es keine Überschrift,
             sondern einen Schalter - dort bleibt das `aria-label`. */}
          <h3 id={titelId} className="m-0 text-sm font-semibold text-ink">
            {titel}
          </h3>
          {/* `shrink-0` ist bewusst weg und `flex-wrap` dazu: Bei 320 px
             passen Hinweis-Kachel + Zusammenfassung nicht mehr in eine Zeile,
             und `shrink-0` hätte das verhindert, statt umzubrechen (Prüfpunkt
             8.2, gemessen 25./26.08. — grösster Einzelanteil, ~50 px). */}
          <span className="flex flex-wrap items-center gap-2">
            {nextElement}
            {showAutoCapHint && !shiftLearned && <AutoCapHint />}
            {summary}
          </span>
        </div>
      )}

      {/* ★ Bewegung beim Aufklappen (Johannes 19.09.2026: „der Rest rutscht
          nach unten und der andere kommt nach"): Im einklappbaren Betrieb
          wächst der Körper sichtbar auf, statt auf einen Schlag dazustehen.
          Ohne Schalter (`collapsible` aus) ist er von Anfang an offen - dann
          bewegt sich nichts. */}
      <Aufklappen offen={showBody}>
        <div className={compact ? "space-y-1.5" : "space-y-2"}>
          <div
            className="flex flex-wrap gap-1.5"
            role="list"
            aria-label={collapsible && !beschriftetVon ? t.listeName : undefined}
            aria-labelledby={beschriftetVon ?? (collapsible ? undefined : titelId)}
          >
            {introduced.map((ch) => {
              const lvl = letterLevel(letters[ch], mastery, lernweg, ch, baseMs);
              const isFocus = focusSet.has(ch);
              const desc = describe(ch, letters[ch], mastery, lernweg, baseMs, sprache);
              return (
                // Auf der Braillezeile soll der VOLLE Text (z. B. „T: wackelig, 44 %
                // …") erscheinen, nicht nur das Zeichen. Ein aria-label auf einem
                // Listeneintrag zeigt NVDA im Browse-Modus oft nicht auf der
                // Braillezeile — daher steht die Info als echter (sr-only) Textinhalt
                // im Element; das große Zeichen ist für Screenreader ausgeblendet.
                // ★ `Hinweisflaeche` statt `title` (10.09.2026): groß und sofort.
                <Hinweisflaeche
                  key={ch}
                  role="listitem"
                  hilfe={desc}
                  className={
                    `flex items-center justify-center rounded-lg border font-legible font-semibold ${size} ${LEVEL_CLASS[lvl]} ` +
                    (isFocus ? "ring-2 ring-accent" : "")
                  }
                >
                  <span aria-hidden="true">{unitGlyph(ch, shiftLearned)}</span>
                  <span className="sr-only">{desc}</span>
                </Hinweisflaeche>
              );
            })}
            {showNext && next && (
              <Hinweisflaeche
                role="listitem"
                hilfe={t.alsNaechstes(tasteName(next, sprache))}
                className={`flex items-center justify-center rounded-lg border border-dashed border-hairline bg-surface font-legible font-semibold text-ink-muted ${size}`}
              >
                <span aria-hidden="true">{unitGlyph(next, shiftLearned)}</span>
                <span className="sr-only">{t.naechsteGesperrt(tasteName(next, sprache))}</span>
              </Hinweisflaeche>
            )}
          </div>

          {!compact && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-muted">
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-success align-middle" />
                {t.sitzt}
              </span>
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-warning align-middle" />
                {t.wackelig}
              </span>
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-danger align-middle" />
                {t.hakt}
              </span>
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-surface-sunken align-middle ring-1 ring-hairline" />
                {t.neu}
              </span>
            </div>
          )}
        </div>
      </Aufklappen>
    </div>
  );
}
