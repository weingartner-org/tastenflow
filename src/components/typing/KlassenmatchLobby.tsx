/**
 * ★★★ DAS WARTEFENSTER - „wer ist dabei" und der Countdown (F3, F4, F5).
 *
 * Es zeigt zwei Zustände:
 *  • **Einladung.** Beim Gastgeber die Teilnehmerzahl, die Namen, „Starten" und
 *    „Absagen"; bei allen anderen dieselbe Zeile und „Doch nicht".
 *  • **Countdown.** Bei ALLEN dieselben zehn Sekunden, gerechnet aus `startMs`
 *    des Servers - nicht jedes Gerät für sich.
 *
 * ── ⚠️ HIER DARF DIE LIVE-REGION BENUTZT WERDEN, und nur hier ───────────────
 * Die Hausregel lautet: **während des Tippens geht nichts in die Live-Region**
 * ([[reference_live_region_ist_braille_blitzmeldung]] - jede Meldung verdrängt
 * die Braillezeile vier Sekunden lang). In diesem Fenster tippt niemand: Es
 * gibt kein Eingabefeld, es gibt nichts zu lesen ausser dieser einen Zeile, und
 * genau sie ist die Auskunft, auf die gewartet wird.
 *
 * Zwei Riegel bleiben trotzdem:
 *  1. `aria-live="polite"`, nicht `assertive` - sie drängelt sich nicht vor.
 *  2. **Höchstens eine Ansage je Beitritt.** Die Zeile ändert sich nur, wenn
 *     wirklich jemand dazukommt; die Sekunden des Countdowns stehen NICHT
 *     darin (sonst wären es zehn Blitzmeldungen in zehn Sekunden). Der
 *     Countdown wird gesprochen (3, 2, 1, los), nicht gemeldet.
 *
 * ── Die Reihenfolge der Namen ist der Auftrag ───────────────────────────────
 * *„auf der Braillezeile links die Teilnehmerzahl, daneben die Beitretenden,
 * die neuesten immer gleich neben der Zahl"* - also „3 dabei: Tester,
 * Sebastian, Tester" mit Tester als dem eben Dazugekommenen. Gerechnet in
 * {@link dabeiSatz}/{@link dabeiNamen}, hier nur angezeigt.
 */
import { htmlLang } from "./htmlLang";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  MATCH_DAUER_MIN,
  countdownAnsage,
  dabeiNamen,
  dabeiSatz,
  speakUi,
  speakUiAlways,
  type Match,
  type MatchStand,
} from "@/lib/typing";
import { focusPracticeField } from "@/lib/typing/focusField";
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★ Die Texte des Wartefensters in beiden Bedienungssprachen (EN5,
 * 19.09.2026). Deutsch wortgleich wie vorher, in TEILEN, wo das JSX mehrere
 * Textknoten erzeugte. Englisch nach dem Glossar (§1.6, §3.7): *Start*,
 * absagen ⇒ *Call off*, Verlassen ⇒ *Leave*; „Doch nicht" ⇒ *Count me out*
 * (das Gegenstück zu *I'm in* aus der Einladung).
 */
export const LOBBY_TEXTE = texte({
  de: {
    titel: "Klassenmatch",
    duHastEingeladen: "Du hast eingeladen.",
    hatEingeladen: (host: string) => `${host} hat eingeladen.`,
    dauerMinuten: (min: number) => `${min} Minuten`,
    dauerSekunden: (sek: number) => `${sek} Sekunden`,
    kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", jede und jeder mit den eigenen Tasten."],
    losIn: (sek: number) => ["Es geht los in ", sek, " ", sek === 1 ? "Sekunde" : "Sekunden", "."],
    verlassen: "Verlassen",
    warte: "Warte, bis mindestens ein Kind dabei ist.",
    starten: "Starten",
    absagen: "Absagen",
    dochNicht: "Doch nicht",
    startenGeht: "„Starten\" geht, sobald jemand dabei ist.",
    // ★ 02.10.2026: die Rückfrage vor dem Start (Johannes: „3 Kinder haben
    // noch nicht entschieden! Trotzdem starten.").
    unentschieden: (n: number) =>
      n === 1
        ? "1 Kind hat sich noch nicht entschieden. Trotzdem starten?"
        : `${n} Kinder haben sich noch nicht entschieden. Trotzdem starten?`,
    alleEntschieden: "Jetzt haben sich alle entschieden. Starten?",
    trotzdemStarten: "Trotzdem starten",
    warten: "Warten",
  },
  en: {
    titel: "Class Match",
    duHastEingeladen: "You sent the invitation.",
    hatEingeladen: (host: string) => `${host} sent the invitation.`,
    dauerMinuten: (min: number) =>
      mehrzahl(min, "en", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` }),
    dauerSekunden: (sek: number) =>
      mehrzahl(sek, "en", { one: (z) => `${z} second`, other: (z) => `${z} seconds` }),
    kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", everyone with the keys they already know."],
    losIn: (sek: number) => ["Starting in ", sek, " ", sek === 1 ? "second" : "seconds", "."],
    verlassen: "Leave",
    warte: "Wait until someone else has joined.",
    starten: "Start",
    absagen: "Call off",
    dochNicht: "Count me out",
    startenGeht: "“Start” works as soon as someone has joined.",
    unentschieden: (n: number) =>
      mehrzahl(n, "en", {
        one: (z) => `${z} classmate hasn't decided yet. Start anyway?`,
        other: (z) => `${z} classmates haven't decided yet. Start anyway?`,
      }),
    alleEntschieden: "Everyone has decided now. Start?",
    trotzdemStarten: "Start anyway",
    warten: "Wait",
  },
  fr: {
    titel: "Match de la classe",
    duHastEingeladen: "Tu as lancé l'invitation.",
    hatEingeladen: (host: string) => `${host} a lancé l'invitation.`,
    dauerMinuten: (min: number) =>
      mehrzahl(min, "fr", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` }),
    dauerSekunden: (sek: number) =>
      mehrzahl(sek, "fr", { one: (z) => `${z} seconde`, other: (z) => `${z} secondes` }),
    kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", chacune et chacun avec ses propres touches."],
    losIn: (sek: number) => ["Ça commence dans ", sek, " ", sek === 1 ? "seconde" : "secondes", "."],
    verlassen: "Quitter",
    warte: "Attends qu'au moins un élève soit là.",
    starten: "Démarrer",
    absagen: "Annuler",
    dochNicht: "Finalement non",
    startenGeht: '"Démarrer" fonctionne dès que quelqu\'un est là.',
    unentschieden: (n: number) =>
      mehrzahl(n, "fr", {
        one: (z) => `${z} élève n'a pas encore décidé. Démarrer quand même ?`,
        other: (z) => `${z} élèves n'ont pas encore décidé. Démarrer quand même ?`,
      }),
    alleEntschieden: "Tout le monde a décidé maintenant. Démarrer ?",
    trotzdemStarten: "Démarrer quand même",
    warten: "Attendre",
  },
  es: {
    titel: "Competición de la clase",
    duHastEingeladen: "Has enviado la invitación.",
    hatEingeladen: (host: string) => `${host} ha enviado la invitación.`,
    dauerMinuten: (min: number) =>
      mehrzahl(min, "es", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` }),
    dauerSekunden: (sek: number) =>
      mehrzahl(sek, "es", { one: (z) => `${z} segundo`, other: (z) => `${z} segundos` }),
    kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", cada persona con sus propias teclas."],
    losIn: (sek: number) => ["Empieza en ", sek, " ", sek === 1 ? "segundo" : "segundos", "."],
    verlassen: "Salir",
    warte: "Espera a que haya al menos otra persona.",
    starten: "Empezar",
    absagen: "Cancelar",
    dochNicht: "Mejor no",
    startenGeht: '"Empezar" funciona en cuanto haya alguien.',
    unentschieden: (n: number) =>
      mehrzahl(n, "es", {
        one: (z) => `${z} persona aún no ha decidido. ¿Empezar de todos modos?`,
        other: (z) => `${z} personas aún no han decidido. ¿Empezar de todos modos?`,
      }),
    alleEntschieden: "Ya ha decidido todo el mundo. ¿Empezar?",
    trotzdemStarten: "Empezar de todos modos",
    warten: "Esperar",
  },
  it: {
    titel: "Gara di classe",
    duHastEingeladen: "Hai mandato l'invito.",
    hatEingeladen: (host: string) => `${host} ha mandato l'invito.`,
    dauerMinuten: (min: number) =>
      mehrzahl(min, "it", { one: (z) => `${z} minuto`, other: (z) => `${z} minuti` }),
    dauerSekunden: (sek: number) =>
      mehrzahl(sek, "it", { one: (z) => `${z} secondo`, other: (z) => `${z} secondi` }),
    kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", ogni persona con i propri tasti."],
    losIn: (sek: number) => ["Si comincia tra ", sek, " ", sek === 1 ? "secondo" : "secondi", "."],
    verlassen: "Esci",
    warte: "Aspetta che ci sia almeno un'altra persona.",
    starten: "Inizia",
    absagen: "Annulla",
    dochNicht: "Non partecipo più",
    startenGeht: `"Inizia" funziona appena c'è qualcuno.`,
    unentschieden: (n: number) =>
      mehrzahl(n, "it", {
        one: (z) => `${z} persona non ha ancora deciso. Iniziare lo stesso?`,
        other: (z) => `${z} persone non hanno ancora deciso. Iniziare lo stesso?`,
      }),
    alleEntschieden: "Ora hanno deciso tutti. Iniziare?",
    trotzdemStarten: "Inizia lo stesso",
    warten: "Aspetta",
  },
  // ★ O-PL (02.10.2026): ohne gegenderte Vergangenheit („Zaproszenie od
  // ciebie.", „Zaproszenie od: Ania."), Knopf „Zacznij" statt „Start"
  // (Regel 12), „Jednak nie biorę udziału" (Glossar §2.3); Zahl + Hauptwort mit
  // vier Formen, „za 1 sekundę" im Akkusativ.
  pl: {
    titel: "Wyścig klasowy",
    duHastEingeladen: "Zaproszenie od ciebie.",
    hatEingeladen: (host: string) => `Zaproszenie od: ${host}.`,
    dauerMinuten: (min: number) =>
      mehrzahl(min, "pl", {
        one: (z) => `${z} minuta`,
        few: (z) => `${z} minuty`,
        many: (z) => `${z} minut`,
        other: (z) => `${z} minuty`,
      }),
    dauerSekunden: (sek: number) =>
      mehrzahl(sek, "pl", {
        one: (z) => `${z} sekunda`,
        few: (z) => `${z} sekundy`,
        many: (z) => `${z} sekund`,
        other: (z) => `${z} sekundy`,
      }),
    kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", każda osoba swoimi klawiszami."],
    losIn: (sek: number) => [
      "Start za ",
      sek,
      " ",
      mehrzahl(sek, "pl", { one: () => "sekundę", few: () => "sekundy", many: () => "sekund", other: () => "sekundy" }),
      ".",
    ],
    verlassen: "Wyjdź",
    warte: "Poczekaj, aż dołączy co najmniej jedna osoba.",
    starten: "Zacznij",
    absagen: "Odwołaj",
    dochNicht: "Jednak nie biorę udziału",
    startenGeht: "Przycisk Zacznij działa, gdy tylko ktoś dołączy.",
    unentschieden: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} osoba jeszcze się nie zdecydowała. Zacząć mimo to?`,
        few: (z) => `${z} osoby jeszcze się nie zdecydowały. Zacząć mimo to?`,
        many: (z) => `${z} osób jeszcze się nie zdecydowało. Zacząć mimo to?`,
        other: (z) => `${z} osoby jeszcze się nie zdecydowało. Zacząć mimo to?`,
      }),
    alleEntschieden: "Wszystkie osoby już się zdecydowały. Zacząć?",
    trotzdemStarten: "Zacznij mimo to",
    warten: "Poczekaj",
  },
  // ★ O-TR (02.10.2026): sen; Name ohne Endung ("Davet eden: Ali."), Knopf
  // "Başla", "Vazgeçtim" (Glossar §2.3); nach der Zahl die Einzahl ("3 kişi").
  tr: {
    titel: "Sınıf Maçı",
    duHastEingeladen: "Daveti sen gönderdin.",
    hatEingeladen: (host: string) => `Davet eden: ${host}.`,
    dauerMinuten: (min: number) => `${min} dakika`,
    dauerSekunden: (sek: number) => `${sek} saniye`,
    kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", herkes kendi tuşlarıyla."],
    losIn: (sek: number) => ["Başlamasına ", sek, " ", "saniye kaldı."],
    verlassen: "Ayrıl",
    warte: "En az bir kişi katılana kadar bekle.",
    starten: "Başla",
    absagen: "İptal et",
    dochNicht: "Vazgeçtim",
    startenGeht: `"Başla" düğmesi, biri katılır katılmaz çalışır.`,
    unentschieden: (n: number) => `${n} kişi henüz karar vermedi. Yine de başlasın mı?`,
    alleEntschieden: "Artık herkes karar verdi. Başlasın mı?",
    trotzdemStarten: "Yine de başla",
    warten: "Bekle",
  },
  // ★ O-CS (03.10.2026): ty ohne Vergangenheit („Pozvánka je od tebe."), Name
  // nach Doppelpunkt („Zve: Honza."), Knopf „Začít", „Přece jen ne" (Glossar
  // §2.3); Zahl + Hauptwort mit vier Formen, „za" + Akkusativ („za 5 sekund").
  cs: {
    titel: "Třídní závod",
    duHastEingeladen: "Pozvánka je od tebe.",
    hatEingeladen: (host: string) => `Zve: ${host}.`,
    dauerMinuten: (min: number) =>
      mehrzahl(min, "cs", {
        one: (z) => `${z} minuta`,
        few: (z) => `${z} minuty`,
        many: (z) => `${z} minuty`,
        other: (z) => `${z} minut`,
      }),
    dauerSekunden: (sek: number) =>
      mehrzahl(sek, "cs", {
        one: (z) => `${z} sekunda`,
        few: (z) => `${z} sekundy`,
        many: (z) => `${z} sekundy`,
        other: (z) => `${z} sekund`,
      }),
    kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", všichni se svými klávesami."],
    losIn: (sek: number) => [
      "Start za ",
      sek,
      " ",
      mehrzahl(sek, "cs", { one: () => "sekundu", few: () => "sekundy", many: () => "sekundy", other: () => "sekund" }),
      ".",
    ],
    verlassen: "Odejít",
    warte: "Počkej, až se přidá aspoň jedna osoba.",
    starten: "Začít",
    absagen: "Zrušit",
    dochNicht: "Přece jen ne",
    startenGeht: "Tlačítko Začít funguje, jakmile se někdo přidá.",
    unentschieden: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `${z} osoba se ještě nerozhodla. Přesto začít?`,
        few: (z) => `${z} osoby se ještě nerozhodly. Přesto začít?`,
        many: (z) => `${z} osoby se ještě nerozhodlo. Přesto začít?`,
        other: (z) => `${z} osob se ještě nerozhodlo. Přesto začít?`,
      }),
    alleEntschieden: "Teď už je rozhodnuto. Začít?",
    trotzdemStarten: "Přesto začít",
    warten: "Počkat",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: "Състезание в класа",
      duHastEingeladen: "Ти изпрати поканата.",
      hatEingeladen: (host: string) => `${host} изпрати поканата.`,
      dauerMinuten: (min: number) =>
        mehrzahl(min, "bg", { one: (z) => `${z} минута`, other: (z) => `${z} минути` }),
      dauerSekunden: (sek: number) =>
        mehrzahl(sek, "bg", { one: (z) => `${z} секунда`, other: (z) => `${z} секунди` }),
      kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", всеки със своите клавиши."],
      losIn: (sek: number) => ["Започваме след ", sek, " ", sek === 1 ? "секунда" : "секунди", "."],
      verlassen: "Напусни",
      warte: "Изчакай да се включи още някой.",
      starten: "Започни",
      absagen: "Отмени",
      dochNicht: "Все пак не",
      startenGeht: "„Започни“ става, щом някой се включи.",
      // „дете … решило" - Partizip am Hauptwort дете (n.), nicht an der Anrede.
      unentschieden: (n: number) =>
        mehrzahl(n, "bg", {
          one: (z) => `${z} дете още не е решило. Да започнем ли все пак?`,
          other: (z) => `${z} деца още не са решили. Да започнем ли все пак?`,
        }),
      alleEntschieden: "Вече всички решиха. Да започнем ли?",
      trotzdemStarten: "Започни все пак",
      warten: "Изчакай",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titel: "Αγώνας τμήματος",
      duHastEingeladen: "Έστειλες την πρόσκληση.",
      // Name nur nach Doppelpunkt (Glossar Regel 12).
      hatEingeladen: (host: string) => `Πρόσκληση από: ${host}.`,
      dauerMinuten: (min: number) =>
        mehrzahl(min, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` }),
      dauerSekunden: (sek: number) =>
        mehrzahl(sek, "el", { one: (z) => `${z} δευτερόλεπτο`, other: (z) => `${z} δευτερόλεπτα` }),
      kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", κάθε παιδί με τα πλήκτρα που ήδη ξέρει."],
      losIn: (sek: number) => ["Ξεκινάμε σε ", sek, " ", sek === 1 ? "δευτερόλεπτο" : "δευτερόλεπτα", "."],
      verlassen: "Έξοδος",
      warte: "Περίμενε μέχρι να μπει τουλάχιστον ένα παιδί.",
      starten: "Έναρξη",
      absagen: "Ακύρωση",
      dochNicht: "Τελικά όχι",
      startenGeht: "Η «Έναρξη» λειτουργεί μόλις μπει κάποιο παιδί.",
      unentschieden: (n: number) =>
        mehrzahl(n, "el", {
          one: (z) => `${z} παιδί δεν έχει αποφασίσει ακόμα. Ξεκινάμε παρόλα αυτά;`,
          other: (z) => `${z} παιδιά δεν έχουν αποφασίσει ακόμα. Ξεκινάμε παρόλα αυτά;`,
        }),
      alleEntschieden: "Τώρα αποφάσισαν όλοι. Ξεκινάμε;",
      trotzdemStarten: "Έναρξη παρόλα αυτά",
      warten: "Αναμονή",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titel: "Osztályverseny",
      duHastEingeladen: "Te küldted a meghívót.",
      hatEingeladen: (host: string) => `${host} küldte a meghívót.`,
      dauerMinuten: (min: number) =>
        mehrzahl(min, "hu", { one: (z) => `${z} perc`, other: (z) => `${z} perc` }),
      dauerSekunden: (sek: number) =>
        mehrzahl(sek, "hu", { one: (z) => `${z} másodperc`, other: (z) => `${z} másodperc` }),
      kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", mindenki a saját billentyűivel."],
      losIn: (sek: number) => ["Kezdés ", sek, " ", "másodperc múlva."],
      verlassen: "Kilépés",
      warte: "Várj, amíg valaki csatlakozik.",
      starten: "Kezdés",
      absagen: "Lemondás",
      dochNicht: "Mégsem",
      startenGeht: "A „Kezdés” akkor működik, ha már valaki csatlakozott.",
      unentschieden: (n: number) =>
        mehrzahl(n, "hu", {
          one: (z) => `${z} osztálytárs még nem döntött. Mégis kezded?`,
          other: (z) => `${z} osztálytárs még nem döntött. Mégis kezded?`,
        }),
      alleEntschieden: "Most már mindenki döntött. Kezded?",
      trotzdemStarten: "Kezdés mégis",
      warten: "Várakozás",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: "Klassenwedstrijd",
      duHastEingeladen: "Jij hebt uitgenodigd.",
      hatEingeladen: (host: string) => `${host} heeft uitgenodigd.`,
      dauerMinuten: (min: number) =>
        mehrzahl(min, "nl", { one: (z) => `${z} minuut`, other: (z) => `${z} minuten` }),
      dauerSekunden: (sek: number) =>
        mehrzahl(sek, "nl", { one: (z) => `${z} seconde`, other: (z) => `${z} seconden` }),
      kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", iedereen met de eigen toetsen."],
      losIn: (sek: number) => ["Het begint over ", sek, " ", sek === 1 ? "seconde" : "seconden", "."],
      verlassen: "Verlaten",
      warte: "Wacht tot er nog iemand meedoet.",
      starten: "Beginnen",
      absagen: "Afgelasten",
      dochNicht: "Toch niet",
      startenGeht: "\"Beginnen\" kan zodra er iemand meedoet.",
      unentschieden: (n: number) =>
        mehrzahl(n, "nl", {
          one: (z) => `${z} klasgenoot heeft nog niet gekozen. Toch beginnen?`,
          other: (z) => `${z} klasgenoten hebben nog niet gekozen. Toch beginnen?`,
        }),
      alleEntschieden: "Iedereen heeft nu gekozen. Beginnen?",
      trotzdemStarten: "Toch beginnen",
      warten: "Wachten",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: "Corrida da turma",
      duHastEingeladen: "Enviaste o convite.",
      hatEingeladen: (host: string) => `${host} enviou o convite.`,
      dauerMinuten: (min: number) =>
        mehrzahl(min, "pt", {
          one: (z) => `${z} minuto`,
          other: (z) => `${z} minutos`,
          many: (z) => `${z} de minutos`,
        }),
      dauerSekunden: (sek: number) =>
        mehrzahl(sek, "pt", {
          one: (z) => `${z} segundo`,
          other: (z) => `${z} segundos`,
          many: (z) => `${z} de segundos`,
        }),
      kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", cada pessoa com as teclas que já conhece."],
      losIn: (sek: number) => ["Começa dentro de ", sek, " ", sek === 1 ? "segundo" : "segundos", "."],
      verlassen: "Sair",
      warte: "Espera até mais alguém se juntar.",
      starten: "Começar",
      absagen: "Cancelar",
      dochNicht: "Afinal não",
      startenGeht: "\"Começar\" funciona assim que alguém se juntar.",
      unentschieden: (n: number) =>
        mehrzahl(n, "pt", {
          one: (z) => `${z} pessoa ainda não decidiu. Começar mesmo assim?`,
          other: (z) => `${z} pessoas ainda não decidiram. Começar mesmo assim?`,
          many: (z) => `${z} de pessoas ainda não decidiram. Começar mesmo assim?`,
        }),
      alleEntschieden: "Agora já todas as pessoas decidiram. Começar?",
      trotzdemStarten: "Começar mesmo assim",
      warten: "Esperar",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titel: "Competição da turma",
      duHastEingeladen: "Você enviou o convite.",
      hatEingeladen: (host: string) => `${host} enviou o convite.`,
      dauerMinuten: (min: number) =>
        mehrzahl(min, "br", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` }),
      dauerSekunden: (sek: number) =>
        mehrzahl(sek, "br", { one: (z) => `${z} segundo`, other: (z) => `${z} segundos` }),
      kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", cada pessoa com as teclas que já conhece."],
      losIn: (sek: number) => ["Começa em ", sek, " ", sek === 1 ? "segundo" : "segundos", "."],
      verlassen: "Sair",
      warte: "Espere até que mais alguém entre.",
      starten: "Começar",
      absagen: "Cancelar",
      dochNicht: "Melhor não",
      startenGeht: "O botão Começar funciona assim que alguém entrar.",
      // Glossar Regel 13: n ist hier mindestens 1 - „0 pessoa" kommt nicht vor.
      unentschieden: (n: number) =>
        mehrzahl(n, "br", {
          one: (z) => `${z} pessoa ainda não decidiu. Começar mesmo assim?`,
          other: (z) => `${z} pessoas ainda não decidiram. Começar mesmo assim?`,
        }),
      alleEntschieden: "Agora todo mundo decidiu. Começar?",
      trotzdemStarten: "Começar mesmo assim",
      warten: "Esperar",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titel: "Întrecerea clasei",
      duHastEingeladen: "Ai trimis invitația.",
      hatEingeladen: (host: string) => `${host} a trimis o invitație.`,
      dauerMinuten: (min: number) =>
        mehrzahl(min, "ro", { one: () => "un minut", few: (z) => `${z} minute`, other: (z) => `${z} de minute` }),
      dauerSekunden: (sek: number) =>
        mehrzahl(sek, "ro", { one: () => "o secundă", few: (z) => `${z} secunde`, other: (z) => `${z} de secunde` }),
      kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", fiecare cu tastele proprii."],
      losIn: (sek: number) => [
        mehrzahl(sek, "ro", {
          one: () => "Începe într-o secundă.",
          few: (z) => `Începe în ${z} secunde.`,
          other: (z) => `Începe în ${z} de secunde.`,
        }),
      ],
      verlassen: "Ieșiți",
      warte: "Așteaptă până se alătură cineva.",
      starten: "Începeți",
      absagen: "Anulați",
      dochNicht: "Totuși nu",
      startenGeht: "Butonul Începeți funcționează imediat ce se alătură cineva.",
      unentschieden: (n: number) =>
        mehrzahl(n, "ro", {
          one: () => "O persoană nu s-a hotărât încă. Începi totuși?",
          few: (z) => `${z} persoane nu s-au hotărât încă. Începi totuși?`,
          other: (z) => `${z} de persoane nu s-au hotărât încă. Începi totuși?`,
        }),
      alleEntschieden: "Acum s-au hotărât toți. Începi?",
      trotzdemStarten: "Începeți totuși",
      warten: "Așteptați",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: "Klasstävlingen",
      duHastEingeladen: "Du har bjudit in.",
      hatEingeladen: (host: string) => `${host} har bjudit in.`,
      dauerMinuten: (min: number) =>
        mehrzahl(min, "sv", { one: (z) => `${z} minut`, other: (z) => `${z} minuter` }),
      dauerSekunden: (sek: number) =>
        mehrzahl(sek, "sv", { one: (z) => `${z} sekund`, other: (z) => `${z} sekunder` }),
      kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", var och en med sina egna tangenter."],
      losIn: (sek: number) => ["Det börjar om ", sek, " ", sek === 1 ? "sekund" : "sekunder", "."],
      verlassen: "Lämna",
      warte: "Vänta tills någon mer är med.",
      starten: "Börja",
      absagen: "Ställ in",
      dochNicht: "Jag ångrar mig",
      startenGeht: "Knappen Börja fungerar så snart någon är med.",
      unentschieden: (n: number) =>
        mehrzahl(n, "sv", {
          one: (z) => `${z} klasskamrat har inte bestämt sig än. Börja ändå?`,
          other: (z) => `${z} klasskamrater har inte bestämt sig än. Börja ändå?`,
        }),
      alleEntschieden: "Nu har alla bestämt sig. Börja?",
      trotzdemStarten: "Börja ändå",
      warten: "Vänta",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titel: "Перегони класу",
      // Präsens statt Vergangenheit: „запросив/запросила" wäre gegendert (Glossar Regel 2, 12).
      duHastEingeladen: "Ти запрошуєш.",
      hatEingeladen: (host: string) => `${host} запрошує.`,
      dauerMinuten: (min: number) =>
        mehrzahl(min, "uk", {
          one: (z) => `${z} хвилина`,
          few: (z) => `${z} хвилини`,
          many: (z) => `${z} хвилин`,
          other: (z) => `${z} хвилини`,
        }),
      dauerSekunden: (sek: number) =>
        mehrzahl(sek, "uk", {
          one: (z) => `${z} секунда`,
          few: (z) => `${z} секунди`,
          many: (z) => `${z} секунд`,
          other: (z) => `${z} секунди`,
        }),
      kopf: (wer: string, dauer: string) => [wer, " ", dauer, ", кожна дитина своїми клавішами."],
      losIn: (sek: number) => [
        "Починаємо за ",
        sek,
        " ",
        mehrzahl(sek, "uk", {
          one: () => "секунду",
          few: () => "секунди",
          many: () => "секунд",
          other: () => "секунди",
        }),
        ".",
      ],
      verlassen: "Вийти",
      warte: "Зачекай, поки приєднається ще хтось.",
      starten: "Почати",
      absagen: "Скасувати",
      dochNicht: "Усе ж ні",
      startenGeht: "«Почати» спрацює, щойно хтось приєднається.",
      unentschieden: (n: number) =>
        mehrzahl(n, "uk", {
          one: (z) => `${z} дитина ще не вирішила. Усе одно почати?`,
          few: (z) => `${z} дитини ще не вирішили. Усе одно почати?`,
          many: (z) => `${z} дітей ще не вирішили. Усе одно почати?`,
          other: (z) => `${z} дитини ще не вирішили. Усе одно почати?`,
        }),
      alleEntschieden: "Тепер усі вирішили. Почати?",
      trotzdemStarten: "Усе одно почати",
      warten: "Зачекати",
    },
});

export interface KlassenmatchLobbyProps {
  match: Match;
  staende: readonly MatchStand[];
  /** Bin ich der Gastgeber? Dann gibt es „Starten" und „Absagen". */
  binGastgeber: boolean;
  /** Läuft schon der Countdown? Dann verschwinden die Knöpfe. */
  imCountdown: boolean;
  /** Wie viele ms noch bis zum Start (nur im Countdown). */
  restMs: number;
  /** Geht „Starten" schon? (F4: erst ab einem weiteren Kind.) */
  kannStarten: boolean;
  /**
   * ★★★ Wie viele Kinder haben die Einladung bekommen und sich noch nicht
   * entschieden (02.10.2026)? Steht hier mehr als null, fragt „Starten" erst
   * nach. Ohne Angabe 0 - dann startet „Starten" sofort wie bisher.
   */
  unentschieden?: number;
  onStarten: () => void;
  /**
   * „Absagen" beim Gastgeber, „Doch nicht" bei allen anderen - und im
   * Countdown „Verlassen": Dort sagt der Knopf nichts ab, sondern öffnet im
   * Lauf die Rückfrage (`KlassenmatchLauf`, 11.09.2026 abends).
   */
  onAbbrechen: () => void;
}

export function KlassenmatchLobby({
  match,
  staende,
  binGastgeber,
  imCountdown,
  restMs,
  kannStarten,
  unentschieden = 0,
  onStarten,
  onAbbrechen,
}: KlassenmatchLobbyProps) {
  const titelRef = useRef<HTMLHeadingElement>(null);
  // ★ E11a-2 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` - `LOBBY_TEXTE`, `dabeiSatz` und `countdownAnsage` kennen seit
  // E11a echtes Französisch, diese Stelle darf es zeigen, sobald „fr"
  // wirklich gewählt ist (siehe `KlassenmatchEinladung.tsx`).
  const { spracheGewaehlt: sprache, bereichAktiv } = useBedienSprache();
  const t = LOBBY_TEXTE[sprache];
  const namen = dabeiNamen(staende, match.hostUid);
  const satz = dabeiSatz(namen, sprache);
  /** Was zuletzt in der Live-Region stand - siehe Riegel 2 im Dateikopf. */
  const [meldung, setMeldung] = useState("");
  const gesagt = useRef("");
  const countdownGesagt = useRef(new Set<number>());
  /** Der Hinweis, warum „Starten" noch nicht geht - nie `disabled`. */
  const [hinweis, setHinweis] = useState("");
  /*
    ★★★★ DIE RÜCKFRAGE VOR DEM START (02.10.2026, Klasse CSS6: Kinder
    starteten, bevor alle beigetreten waren - drei Anläufe).

    Johannes: *„wenn Kind 1 einlädt und 3 Kinder zusagen und 2 absagen aber 3
    Kinder sich noch nicht entschieden haben, jetzt klickt Kind 1 auf Starten
    und sollte die Meldung bekommen: 3 Kinder haben noch nicht entschieden!
    Trotzdem starten."* KEINE Wartezeit - nur diese eine Frage, und nur, wenn
    wirklich jemand überlegt. Die Zahl lebt mit, solange die Frage steht.
    Fokus auf „Warten" (wer schnell Enter drückt, startet nicht aus Versehen),
    Escape heisst „Warten".
  */
  const [frageOffen, setFrageOffen] = useState(false);
  const frageId = useId();
  const wartenRef = useRef<HTMLButtonElement>(null);
  const startenRef = useRef<HTMLButtonElement>(null);
  const frageSatz = unentschieden > 0 ? t.unentschieden(unentschieden) : t.alleEntschieden;
  useEffect(() => {
    if (frageOffen) wartenRef.current?.focus();
  }, [frageOffen]);
  const warten = useCallback(() => {
    setFrageOffen(false);
    // Fokusziel: „Starten" - dort war das Kind, und dort geht es weiter.
    window.setTimeout(() => startenRef.current?.focus(), 0);
  }, []);

  // Der Fokus geht auf die Überschrift: Sie sagt, wo man ist. Von dort führt
  // die Tabulatortaste zu „Starten".
  useEffect(() => {
    titelRef.current?.focus();
  }, []);

  /*
    ★ Escape führt zurück ins Üben (Hausregel) - und das heisst hier: aus dem
    Match heraus. Im Countdown NICHT HIER: Dort ist nichts mehr abzusagen, die
    Zeiten stehen am Server, und ein versehentliches Escape drei Sekunden vor
    dem Start nähme einem Kind das Spiel weg, auf das die ganze Klasse wartet.

    ★★ Seit 11.09.2026 abends fragt Escape im Countdown nach („Klassenmatch
    verlassen?") - das macht `KlassenmatchLauf`, nicht dieses Fenster. In der
    Einladung bleibt Escape ohne Rückfrage: Johannes fragte nur nach dem
    Durchgang, und wer noch wartet, verpasst nichts.
  */
  useEffect(() => {
    if (imCountdown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // ★ Steht die Rückfrage, heisst Escape „Warten" - nicht „Absagen".
        if (frageOffen) {
          warten();
          return;
        }
        onAbbrechen();
        focusPracticeField();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imCountdown, onAbbrechen, frageOffen, warten]);

  // ★ Genau EINE Meldung je Änderung der Zeile - nicht je Rendern.
  useEffect(() => {
    if (gesagt.current === satz) return;
    gesagt.current = satz;
    setMeldung(satz);
  }, [satz]);

  /*
    Der Countdown wird GESPROCHEN, nicht gemeldet (Riegel 2). `speakUiAlways`,
    weil es die eine Auskunft ist, ohne die niemand weiss, wann es losgeht -
    auch wer das App-Vorlesen aus hat, soll „los" hören.
  */
  useEffect(() => {
    if (!imCountdown) return;
    const sek = Math.max(0, Math.round(restMs / 1000));
    if (countdownGesagt.current.has(sek)) return;
    countdownGesagt.current.add(sek);
    const text = countdownAnsage(sek, sprache);
    // ★ EN5: in Tastenflow in der Bedienungssprache und mit ihrer Stimme
    // („Go!"); ohne aktiven Sprachbereich genau der Aufruf von vorher.
    if (text) {
      if (bereichAktiv) speakUiAlways(text, undefined, sprache);
      else speakUiAlways(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imCountdown, restMs]);

  const sekunden = Math.max(0, Math.ceil(restMs / 1000));
  const dauerMin = match.dauerMin > 0 ? match.dauerMin : MATCH_DAUER_MIN;
  const dauerSatz =
    dauerMin >= 1
      ? t.dauerMinuten(Math.round(dauerMin))
      : t.dauerSekunden(Math.round(dauerMin * 60));

  return (
    // ★ E11a-2 (26.09.2026): `lang` folgt der wirklich gewählten Sprache
    // (`sprache` = `spracheGewaehlt`, siehe oben) - dieses Fenster trägt
    // keinen fremden `Modal`-Rahmen, der ganze sichtbare Text steht darunter.
    <div className="card mx-auto w-full max-w-prose p-5 sm:p-6" lang={htmlLang(sprache)}>
      {/* ★ Die eine erlaubte Live-Region - Begründung im Dateikopf. */}
      <div className="sr-only" role="status" aria-live="polite">
        {meldung}
      </div>
      <h2
        ref={titelRef}
        tabIndex={-1}
        className="m-0 text-xl font-semibold text-ink outline-none"
      >
        <span aria-hidden="true">⚔️ </span>
        {t.titel}
      </h2>
      {/*
        ★ Die Dauer kommt aus dem MATCH, nicht aus der Konstanten: Sie steht so
        am Server, und im Mock lässt sie sich für die Abnahme verkürzen
        (`?matchMinuten=0.5`). Ein Satz, der „5 Minuten" sagt, während 30
        Sekunden laufen, wäre eine Anzeige, die nicht stimmt. Fehlt sie (alter
        Datensatz), gilt {@link MATCH_DAUER_MIN}.
      */}
      <p className="mb-0 mt-1 text-lg text-ink">
        {t.kopf(binGastgeber ? t.duHastEingeladen : t.hatEingeladen(match.hostName), dauerSatz)}
      </p>

      {/* ★★★ DIE EINE ZEILE (F3): links die Zahl, daneben die Namen, die
          neuesten zuerst. Sie steht als gewöhnlicher Text da und ist damit
          auch ohne jede Meldung mit dem Finger lesbar. */}
      <p className="mb-0 mt-4 text-lg font-semibold text-ink">{satz}</p>

      {imCountdown ? (
        <>
          <p className="mb-0 mt-4 text-xl font-semibold text-ink">
            {t.losIn(sekunden)}
          </p>
          {/* ★ Sichtbar, weil nicht jeder Escape kennt - und am Tablet gibt es
              sie nicht. Er öffnet dieselbe Rückfrage wie Escape; das Fenster
              bekommt den Fokus, und „Weiterschreiben" führt zurück. */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-secondary btn-umriss" onClick={onAbbrechen}>
              {t.verlassen}
            </button>
          </div>
        </>
      ) : frageOffen && binGastgeber ? (
        /*
          ★ Die Rückfrage steht AN DER STELLE der Knöpfe - eine Gruppe,
          beschriftet mit der Frage selbst: Wer mit dem Fokus hineinkommt,
          hört sie, und auf der Braillezeile steht sie neben dem Knopf.
        */
        <div className="mt-5" role="group" aria-labelledby={frageId} data-match-startfrage>
          <p id={frageId} className="m-0 text-lg font-semibold text-ink">
            {frageSatz}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setFrageOffen(false);
                onStarten();
              }}
            >
              {unentschieden > 0 ? t.trotzdemStarten : t.starten}
            </button>
            <button type="button" ref={wartenRef} className="btn-secondary btn-umriss" onClick={warten}>
              {t.warten}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {binGastgeber && (
            <button
              type="button"
              ref={startenRef}
              className="btn-primary"
              /*
                ⚠️ NIE `disabled` (Hausregel): Ein toter Schalter sagt nicht,
                warum er tot ist - auf der Braillezeile steht dann „Schalter
                nicht verfügbar" und sonst nichts. `aria-disabled` sagt „geht
                gerade nicht", der Handler sagt WARUM, und der Fokus bleibt.
              */
              aria-disabled={!kannStarten || undefined}
              onClick={() => {
                if (!kannStarten) {
                  setHinweis(t.warte);
                  if (bereichAktiv) speakUi(t.warte, undefined, undefined, sprache);
                  else speakUi(t.warte);
                  return;
                }
                if (unentschieden > 0) {
                  setHinweis("");
                  setFrageOffen(true);
                  const frage = t.unentschieden(unentschieden);
                  if (bereichAktiv) speakUi(frage, undefined, undefined, sprache);
                  else speakUi(frage);
                  return;
                }
                onStarten();
              }}
            >
              {t.starten}
            </button>
          )}
          <button
            type="button"
            className="btn-secondary btn-umriss"
            onClick={() => {
              onAbbrechen();
              focusPracticeField();
            }}
          >
            {binGastgeber ? t.absagen : t.dochNicht}
          </button>
        </div>
      )}

      {hinweis && !imCountdown ? (
        <p className="mb-0 mt-2 text-base text-ink">{hinweis}</p>
      ) : null}
      {!imCountdown && binGastgeber && !kannStarten ? (
        <p className="mb-0 mt-2 text-base text-ink">{t.startenGeht}</p>
      ) : null}
    </div>
  );
}
