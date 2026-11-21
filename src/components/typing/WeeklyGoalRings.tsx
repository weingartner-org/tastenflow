/**
 * „Dein Wochenziel" - EIN Ring (Bauplan `BAUPLAN-2026-09-18-MEINE-KLASSEN-UMBAU.md`
 * §„W4 Kind", 19.09.2026): Minuten je Woche, OHNE Einheiten. Ersetzt die
 * frühere Ring-REIHE (ein Ring je Übungseinheit, `MAX_RINGS`, Striche je
 * Einheit) - seit `wochenziel.ts` (W1/W2/W3a) gibt es „Einheiten" als
 * Rechengrösse gar nicht mehr, nur noch geübte/erfüllte/offene MINUTEN einer
 * Kalenderwoche (Montag 08:00 bis zum nächsten Montag 08:00).
 *
 * Nutzt denselben [[RingGauge]] wie die Spielstufe ([[PlayerLevelRing]]),
 * damit beide GENAU gleich aussehen. Sitzt im Kopf von „Mein Training" (Vollformat)
 * UND in der Stand-Zeile unter dem Übungsfeld (`kompakt`).
 *
 * ★ Der Ring folgt der ÜBEZEIT-UHR (wie zuvor): Er füllt sich mit der diese
 * Woche geübten Zeit PLUS der laufenden, noch nicht gespeicherten Zeile
 * ({@link pendingPracticeMs}) - Ring und Uhr können damit nicht auseinanderlaufen.
 * „Geschafft" (voller Ring + Haken) meldet er erst, wenn das an GESPEICHERTEN
 * Ereignissen auch wirklich zutrifft - die geschätzte laufende Zeile darf den
 * Haken nicht vorschnell zeigen und beim Speichern wieder zurücknehmen.
 *
 * ★ Nachholen (nur wenn `wochenzielVerlauf.nachholen` gesetzt ist): eine kurze
 * ZWEITE Zahl „+15 Min. nachholen" für offene Minuten früherer Wochen -
 * dieselbe Rechnung wie `offenGesamt` in [[WeeklyGoalStats]] (Wochen VOR der
 * laufenden, `zielwoche`, `offen` aufsummiert), absichtlich OHNE
 * Warnfarbe/-zeichen ([[feedback_nie_gegen_das_kind]]). Eine anstehende
 * Zieländerung zeigt hier bewusst NICHTS zusätzlich - das laufende Wochenziel
 * ist, was zählt (Bauplan §W4: „keep it simple").
 *
 * Lädt die Übungs-Ereignisse und die gesperrten Zeiten der eigenen Klasse
 * selbst. Nur für Lernende mit einem Wochenziel > 0 in der LAUFENDEN Woche;
 * sonst nichts (auch keine leere Hülle - Rückfall auf „Ohne Ziel" ist bewusst
 * ein Leerzustand, wie zuvor).
 * Siehe [[project_zehnfinger_trainer]].
 */
import { useEffect, useState } from "react";
import {
  TypingAccount,
  TaskEvent,
  aktuelleWoche,
  anredeFuer,
  isFormal,
  kindWochenzielAusFeldern,
  pendingPracticeMs,
  setzeWochenzielAnsage,
  skinForStufe,
  stufeFuer,
  typingBackend,
  wochenStart,
  wochenzielGeschichte,
  WOCHENZIEL_GRENZE,
  type KindWochenziel,
} from "@/lib/typing";
import { RingGauge } from "./RingGauge";
import { useGesperrteZeiten } from "@/lib/typing/useGesperrteZeiten";
import {
  EREIGNISSE_GESPEICHERT,
  leseEreignisseGespeichert,
} from "@/lib/typing/ereignisseGespeichert";
import type { GesperrteZeit } from "@/lib/typing/wochenziel";
import { Tipp } from "@/components/Tipp";
import { zZe } from "@/lib/bedienSprache/predlozkyCs";
import { mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";

function minutenWort(n: number): string {
  return n === 1 ? "Minute" : "Minuten";
}

/**
 * ★ DIE TEXTE DES RINGS in beiden Bedienungssprachen (EN1, 19.09.2026).
 * Deutsch Zeichen für Zeichen wie vorher; wo das JSX mehrere Textknoten
 * erzeugte („von {zielMin} Min."), stehen TEILE (`Teil[]`), damit die Zahl der
 * Knoten gleich bleibt. Englisch nach Glossar §3.3: *weekly goal*, *25 of 60
 * min*, *catch up*, Wochengrenze *8am on Monday*.
 */
const RING_TEXTE = texte({
  de: {
    wochenziel: "Wochenziel",
    von: (ziel: number) => ["von ", ziel, " Min."],
    nachholen: (n: number) => ["+", n, " Min. nachholen"],
    aria: (formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
      `${formal ? "Ihr" : "Dein"} Wochenziel: ${geuebt} von ${ziel} ${minutenWort(ziel)}` +
      (reached ? ", geschafft!" : "") +
      (nachhol > 0 ? `. Dazu ${nachhol} ${minutenWort(nachhol)} zum Nachholen.` : ""),
    satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
      (reached
        ? `Wochenziel geschafft: ${ziel} von ${ziel} Minuten.`
        : `Wochenziel: ${geuebt} von ${ziel} Minuten. ` +
          `Noch ${rest} ${minutenWort(rest)} bis Montag, 8 Uhr.`) +
      (nachhol > 0 ? ` Dazu ${nachhol} ${minutenWort(nachhol)} zum Nachholen.` : ""),
  },
  en: {
    wochenziel: "Weekly goal",
    von: (ziel: number) => ["of ", ziel, " min"],
    nachholen: (n: number) => ["+", n, " min to catch up"],
    aria: (_formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
      `Your weekly goal: ${geuebt} of ${minutenEn(ziel)}` +
      (reached ? " - goal reached!" : "") +
      (nachhol > 0 ? `. Plus ${minutenEn(nachhol)} to catch up.` : ""),
    satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
      (reached
        ? `Weekly goal reached: ${ziel} of ${ziel} minutes.`
        : `Weekly goal: ${geuebt} of ${minutenEn(ziel)}. ${minutenEn(rest)} more by 8am on Monday.`) +
      (nachhol > 0 ? ` Plus ${minutenEn(nachhol)} to catch up.` : ""),
  },
  // ★ E11a: „formal" unterscheidet vous/tu (F9) - genau wie Ihr/Dein im Deutschen.
  fr: {
    wochenziel: "Objectif de la semaine",
    von: (ziel: number) => ["sur ", ziel, " min"],
    nachholen: (n: number) => ["+", n, " min à rattraper"],
    aria: (formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
      `${formal ? "Votre" : "Ton"} objectif de la semaine : ${geuebt} sur ${minutenFr(ziel)}` +
      (reached ? ", atteint !" : "") +
      (nachhol > 0 ? `. Plus ${minutenFr(nachhol)} à rattraper.` : ""),
    satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
      (reached
        ? `Objectif de la semaine atteint : ${ziel} sur ${ziel} minutes.`
        : `Objectif de la semaine : ${geuebt} sur ${minutenFr(ziel)}. ` +
          `Encore ${minutenFr(rest)} avant lundi, 8 h.`) +
      (nachhol > 0 ? ` Plus ${minutenFr(nachhol)} à rattraper.` : ""),
  },
  // ★ ES-O (27.09.2026): Kind tú, Lehrkraft (`formal`) usted.
  es: {
    wochenziel: "Objetivo semanal",
    von: (ziel: number) => ["de ", ziel, " min"],
    nachholen: (n: number) => ["+", n, " min por recuperar"],
    aria: (formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
      `${formal ? "Su" : "Tu"} objetivo semanal: ${geuebt} de ${minutenEs(ziel)}` +
      (reached ? ", ¡alcanzado!" : "") +
      (nachhol > 0 ? `. Además, ${minutenEs(nachhol)} por recuperar.` : ""),
    satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
      (reached
        ? `Objetivo semanal alcanzado: ${ziel} de ${ziel} minutos.`
        : `Objetivo semanal: ${geuebt} de ${minutenEs(ziel)}. ` +
          `Faltan ${minutenEs(rest)} hasta el lunes a las 8.`) +
      (nachhol > 0 ? ` Además, ${minutenEs(nachhol)} por recuperar.` : ""),
  },
  // ★ O-IT (02.10.2026): `formal` (Lehrkraft, Erwachsene) neutral ohne „Lei" (Regel 1).
  it: {
    wochenziel: "Obiettivo settimanale",
    von: (ziel: number) => ["di ", ziel, " min"],
    nachholen: (n: number) => ["+", n, " min da recuperare"],
    aria: (formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
      `${formal ? "Obiettivo settimanale" : "Il tuo obiettivo settimanale"}: ${geuebt} di ${minutenIt(ziel)}` +
      (reached ? ", raggiunto" : "") +
      (nachhol > 0 ? `. Inoltre ${minutenIt(nachhol)} da recuperare.` : ""),
    satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
      (reached
        ? `Obiettivo settimanale raggiunto: ${ziel} di ${ziel} minuti.`
        : `Obiettivo settimanale: ${geuebt} di ${minutenIt(ziel)}. ` +
          `${rest === 1 ? "Manca" : "Mancano"} ${minutenIt(rest)} fino a lunedì alle 8:00.`) +
      (nachhol > 0 ? ` Inoltre ${minutenIt(nachhol)} da recuperare.` : ""),
  },
  // ★ O-PL (02.10.2026): am Ring kurz „Cel" (Glossar §2.6); `formal` ohne
  // Pan/Pani (Regel 1). Gezählte Minuten nur nach Doppelpunkt im Nominativ
  // („Zostało: 20 minut do poniedziałku, 8:00", §2.10) oder nach „z" im Genitiv.
  pl: {
    wochenziel: "Cel",
    von: (ziel: number) => ["z ", ziel, " min"],
    nachholen: (n: number) => ["+", n, " min do nadrobienia"],
    aria: (formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
      `${formal ? "Cel tygodniowy" : "Twój cel tygodniowy"}: ${geuebt} z ${minutenPlZ(ziel)}` +
      (reached ? ", cel osiągnięty" : "") +
      (nachhol > 0 ? `. Do nadrobienia: ${minutenPl(nachhol)}.` : ""),
    satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
      (reached
        ? `Cel osiągnięty: ${ziel} z ${minutenPlZ(ziel)}.`
        : `Cel tygodniowy: ${geuebt} z ${minutenPlZ(ziel)}. ` +
          `Zostało: ${minutenPl(rest)} do poniedziałku, 8:00.`) +
      (nachhol > 0 ? ` Do nadrobienia: ${minutenPl(nachhol)}.` : ""),
  },
  // ★ O-TR (02.10.2026): am Ring kurz "Hedef" (Glossar §2.6); `formal` = siz
  // ("hedefiniz"), sonst sen. "25 dk. (hedef: 60 dk.)", "Kalan süre: 20 dakika.
  // Bitiş: Pazartesi, 08:00.", "Telafi: 15 dk." (§2.10) - keine Endung an Zahl
  // oder Uhrzeit, Einzahl nach der Zahl.
  tr: {
    wochenziel: "Hedef",
    von: (ziel: number) => ["hedef: ", ziel, " dk."],
    nachholen: (n: number) => ["Telafi: ", n, " dk."],
    aria: (formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
      `${formal ? "Haftalık hedefiniz" : "Haftalık hedefin"}: ${ziel} dakika, çalışılan: ${geuebt} dakika` +
      (reached ? ", hedefe ulaşıldı" : "") +
      (nachhol > 0 ? `. Telafi: ${nachhol} dakika.` : ""),
    satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
      (reached
        ? `Haftalık hedefe ulaşıldı: ${ziel} dakika.`
        : `Haftalık hedef: ${ziel} dakika, çalışılan: ${geuebt} dakika. ` +
          `Kalan süre: ${rest} dakika. Bitiş: Pazartesi, 08:00.`) +
      (nachhol > 0 ? ` Telafi: ${nachhol} dakika.` : ""),
  },
  // ★ O-CS (03.10.2026): am Ring kurz „Cíl" (Glossar §2.6); `formal` (Lehrkraft,
  // Erwachsene) neutral ohne Anrede, sonst ty. „25 ze 60 min" mit `zZe` (Regel
  // 13), „+15 min k dohnání", Minuten als Abkürzung ohne Punkt (§2.10); der
  // Satz mit der Restzeit ist ganz, das Verb zieht mit (§2.11: „zbývá 5 minut",
  // „zbývají 2 minuty"). Status als Neutrum „splněno" - nie am Kind (Regel 2).
  cs: {
    wochenziel: "Cíl",
    von: (ziel: number) => [`${zZe(ziel)} `, ziel, " min"],
    nachholen: (n: number) => ["+", n, " min k dohnání"],
    aria: (formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
      `${formal ? "Týdenní cíl" : "Tvůj týdenní cíl"}: ${ziel} min, nacvičeno: ${geuebt} min` +
      (reached ? ", splněno" : "") +
      (nachhol > 0 ? `. K dohnání: ${nachhol} min.` : ""),
    satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
      (reached
        ? `Týdenní cíl: splněno (${ziel} min).`
        : `Týdenní cíl: ${ziel} min, nacvičeno: ${geuebt} min. ` +
          mehrzahl(rest, "cs", {
            one: (z) => `Do pondělí 8:00 zbývá ${z} minuta.`,
            few: (z) => `Do pondělí 8:00 zbývají ${z} minuty.`,
            many: (z) => `Do pondělí 8:00 zbývá ${z} minuty.`,
            other: (z) => `Do pondělí 8:00 zbývá ${z} minut.`,
          })) +
      (nachhol > 0 ? ` K dohnání: ${nachhol} min.` : ""),
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      wochenziel: "Седмична цел",
      von: (ziel: number) => ["от ", ziel, " мин"],
      nachholen: (n: number) => ["+", n, " мин за наваксване"],
      // Ohne Besitzwort - so passt der Satz für Kind und Lehrkraft (Glossar Regel 1).
      aria: (_formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
        `Седмична цел: ${geuebt} от ${mehrzahl(ziel, "bg", { one: (z) => `${z} минута`, other: (z) => `${z} минути` })}` +
        (reached ? " - целта е изпълнена!" : "") +
        (nachhol > 0
          ? `. Плюс ${mehrzahl(nachhol, "bg", { one: (z) => `${z} минута`, other: (z) => `${z} минути` })} за наваксване.`
          : ""),
      satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
        (reached
          ? `Седмичната цел е изпълнена: ${ziel} от ${mehrzahl(ziel, "bg", { one: (z) => `${z} минута`, other: (z) => `${z} минути` })}.`
          : `Седмична цел: ${geuebt} от ${mehrzahl(ziel, "bg", { one: (z) => `${z} минута`, other: (z) => `${z} минути` })}. ` +
            mehrzahl(rest, "bg", {
              one: (z) => `До понеделник в 8:00 остава ${z} минута.`,
              other: (z) => `До понеделник в 8:00 остават ${z} минути.`,
            })) +
        (nachhol > 0
          ? ` Плюс ${mehrzahl(nachhol, "bg", { one: (z) => `${z} минута`, other: (z) => `${z} минути` })} за наваксване.`
          : ""),
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      wochenziel: "Εβδομαδιαίος στόχος",
      von: (ziel: number) => ["από ", ziel, " λεπτά"],
      nachholen: (n: number) => ["+", n, " λεπτά για αναπλήρωση"],
      aria: (_formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
        `Εβδομαδιαίος στόχος: ${geuebt} από ${mehrzahl(ziel, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` })}` +
        (reached ? " - ολοκληρώθηκε!" : "") +
        (nachhol > 0
          ? `. Επιπλέον ${mehrzahl(nachhol, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` })} για αναπλήρωση.`
          : ""),
      satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
        (reached
          ? `Ο εβδομαδιαίος στόχος ολοκληρώθηκε: ${ziel} από ${mehrzahl(ziel, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` })}.`
          : `Εβδομαδιαίος στόχος: ${geuebt} από ${mehrzahl(ziel, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` })}. ` +
            `${mehrzahl(rest, "el", { one: (z) => `Απομένει ${z} λεπτό`, other: (z) => `Απομένουν ${z} λεπτά` })} ως τη Δευτέρα, 8:00.`) +
        (nachhol > 0
          ? ` Επιπλέον ${mehrzahl(nachhol, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` })} για αναπλήρωση.`
          : ""),
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      wochenziel: "Heti cél",
      von: (ziel: number) => ["cél: ", ziel, " perc"],
      nachholen: (n: number) => ["+", n, " perc pótlandó"],
      aria: (_formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
        `Heti cél: ${geuebt}/${ziel} perc` +
        (reached ? " - teljesítve!" : "") +
        (nachhol > 0 ? `. Pótlandó még: ${nachhol} perc.` : ""),
      satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
        (reached
          ? `Heti cél teljesítve: ${ziel}/${ziel} perc.`
          : `Heti cél: ${geuebt}/${ziel} perc. Hétfő 8:00-ig még ${rest} perc.`) +
        (nachhol > 0 ? ` Pótlandó még: ${nachhol} perc.` : ""),
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      wochenziel: "Weekdoel",
      von: (ziel: number) => ["van ", ziel, " min"],
      nachholen: (n: number) => ["+", n, " min in te halen"],
      // minutenEn gibt es nur englisch - darum mehrzahl(…, "nl", …) direkt (Glossar §2.11).
      aria: (_formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
        `Je weekdoel: ${geuebt} van ${mehrzahl(ziel, "nl", { one: (z) => `${z} minuut`, other: (z) => `${z} minuten` })}` +
        (reached ? " - doel gehaald!" : "") +
        (nachhol > 0
          ? `. En nog ${mehrzahl(nachhol, "nl", { one: (z) => `${z} minuut`, other: (z) => `${z} minuten` })} om in te halen.`
          : ""),
      satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
        (reached
          ? `Weekdoel gehaald: ${ziel} van ${ziel} minuten.`
          : `Weekdoel: ${geuebt} van ${mehrzahl(ziel, "nl", { one: (z) => `${z} minuut`, other: (z) => `${z} minuten` })}. ` +
            `Nog ${mehrzahl(rest, "nl", { one: (z) => `${z} minuut`, other: (z) => `${z} minuten` })} tot maandag 8.00 uur.`) +
        (nachhol > 0
          ? ` En nog ${mehrzahl(nachhol, "nl", { one: (z) => `${z} minuut`, other: (z) => `${z} minuten` })} om in te halen.`
          : ""),
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      wochenziel: "Objetivo semanal",
      von: (ziel: number) => ["de ", ziel, " min"],
      nachholen: (n: number) => ["+", n, " min por recuperar"],
      aria: (_formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
        `${_formal ? "O seu" : "O teu"} objetivo semanal: ${geuebt} de ` +
        mehrzahl(ziel, "pt", {
          one: (z) => `${z} minuto`,
          other: (z) => `${z} minutos`,
          many: (z) => `${z} de minutos`,
        }) +
        (reached ? " - objetivo cumprido!" : "") +
        (nachhol > 0
          ? ". E ainda " +
            mehrzahl(nachhol, "pt", {
              one: (z) => `${z} minuto`,
              other: (z) => `${z} minutos`,
              many: (z) => `${z} de minutos`,
            }) +
            " por recuperar."
          : ""),
      satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
        (reached
          ? `Objetivo semanal cumprido: ${ziel} de ${ziel} minutos.`
          : `Objetivo semanal: ${geuebt} de ` +
            mehrzahl(ziel, "pt", {
              one: (z) => `${z} minuto`,
              other: (z) => `${z} minutos`,
              many: (z) => `${z} de minutos`,
            }) +
            ". " +
            mehrzahl(rest, "pt", {
              one: (z) => `Falta ${z} minuto`,
              other: (z) => `Faltam ${z} minutos`,
              many: (z) => `Faltam ${z} de minutos`,
            }) +
            " até segunda-feira às 08:00.") +
        (nachhol > 0
          ? " E ainda " +
            mehrzahl(nachhol, "pt", {
              one: (z) => `${z} minuto`,
              other: (z) => `${z} minutos`,
              many: (z) => `${z} de minutos`,
            }) +
            " por recuperar."
          : ""),
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      wochenziel: "Meta semanal",
      von: (ziel: number) => ["de ", ziel, " min"],
      nachholen: (n: number) => ["+", n, " min para recuperar"],
      // Das Verb zieht mit der Zahl (Glossar §2.11): „Falta 1 minuto" / „Faltam 5 minutos".
      aria: (_formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
        `Sua meta semanal: ${geuebt} de ${mehrzahl(ziel, "br", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` })}` +
        (reached ? " - meta cumprida!" : "") +
        (nachhol > 0
          ? `. Mais ${mehrzahl(nachhol, "br", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` })} para recuperar.`
          : ""),
      satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
        (reached
          ? `Meta semanal cumprida: ${ziel} de ${mehrzahl(ziel, "br", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` })}.`
          : `Meta semanal: ${geuebt} de ${mehrzahl(ziel, "br", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` })}. ` +
            mehrzahl(rest, "br", {
              one: (z) => `Falta ${z} minuto até segunda-feira às 8:00.`,
              other: (z) => `Faltam ${z} minutos até segunda-feira às 8:00.`,
            })) +
        (nachhol > 0
          ? ` Mais ${mehrzahl(nachhol, "br", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` })} para recuperar.`
          : ""),
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      wochenziel: "Obiectiv",
      von: (ziel: number) => ["din ", ziel, " min"],
      nachholen: (n: number) => ["+", n, " min de recuperat"],
      // „min" als Kurzform: so braucht keine Zahl ein „de" (Glossar §2.10).
      aria: (_formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
        `Obiectivul săptămânal: ${geuebt} din ${ziel} min` +
        (reached ? " - atins!" : "") +
        (nachhol > 0 ? `. În plus, de recuperat: ${nachhol} min.` : ""),
      satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
        (reached
          ? `Obiectiv săptămânal atins: ${ziel} din ${ziel} min.`
          : `Obiectiv săptămânal: ${geuebt} din ${ziel} min. ` +
            mehrzahl(rest, "ro", {
              one: () => "Mai este un minut până luni la ora 8:00.",
              few: (z) => `Mai sunt ${z} minute până luni la ora 8:00.`,
              other: (z) => `Mai sunt ${z} de minute până luni la ora 8:00.`,
            })) +
        (nachhol > 0 ? ` În plus, de recuperat: ${nachhol} min.` : ""),
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      wochenziel: "Veckomål",
      von: (ziel: number) => ["av ", ziel, " min"],
      nachholen: (n: number) => ["+", n, " min att ta igen"],
      aria: (_formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
        `Ditt veckomål: ${geuebt} av ${mehrzahl(ziel, "sv", { one: (z) => `${z} minut`, other: (z) => `${z} minuter` })}` +
        (reached ? " - målet uppnått!" : "") +
        (nachhol > 0
          ? `. Dessutom ${mehrzahl(nachhol, "sv", { one: (z) => `${z} minut`, other: (z) => `${z} minuter` })} att ta igen.`
          : ""),
      satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
        (reached
          ? `Veckomålet uppnått: ${ziel} av ${ziel} minuter.`
          : `Veckomål: ${geuebt} av ${mehrzahl(ziel, "sv", { one: (z) => `${z} minut`, other: (z) => `${z} minuter` })}. ` +
            `${mehrzahl(rest, "sv", { one: (z) => `${z} minut`, other: (z) => `${z} minuter` })} kvar till måndag klockan 08:00.`) +
        (nachhol > 0
          ? ` Dessutom ${mehrzahl(nachhol, "sv", { one: (z) => `${z} minut`, other: (z) => `${z} minuter` })} att ta igen.`
          : ""),
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      wochenziel: "Тижнева мета",
      von: (ziel: number) => ["з ", ziel, " хв"],
      nachholen: (n: number) => ["+", n, " хв надолужити"],
      // Ohne Besitzwort - so passt der Satz für Kind und Lehrkraft (Glossar Regel 1). „з ${ziel} хв":
      // die Abkürzung beugt sich nicht, nach „з" wäre sonst der Genitiv nötig (Glossar §2.10).
      aria: (_formal: boolean, geuebt: number, ziel: number, reached: boolean, nachhol: number) =>
        `Тижнева мета: ${geuebt} з ${ziel} хв` +
        (reached ? " - мету досягнуто" : "") +
        (nachhol > 0
          ? `. Плюс ${mehrzahl(nachhol, "uk", {
              one: (z) => `${z} хвилина`,
              few: (z) => `${z} хвилини`,
              many: (z) => `${z} хвилин`,
              other: (z) => `${z} хвилини`,
            })} для надолуження.`
          : ""),
      satz: (geuebt: number, ziel: number, rest: number, reached: boolean, nachhol: number) =>
        (reached
          ? `Тижневу мету досягнуто: ${ziel} з ${ziel} хв.`
          : `Тижнева мета: ${geuebt} з ${ziel} хв. ` +
            mehrzahl(rest, "uk", {
              one: (z) => `До понеділка 8:00 залишилася ${z} хвилина.`,
              few: (z) => `До понеділка 8:00 залишилися ${z} хвилини.`,
              many: (z) => `До понеділка 8:00 залишилося ${z} хвилин.`,
              other: (z) => `До понеділка 8:00 залишилося ${z} хвилини.`,
            })) +
        (nachhol > 0
          ? ` Плюс ${mehrzahl(nachhol, "uk", {
              one: (z) => `${z} хвилина`,
              few: (z) => `${z} хвилини`,
              many: (z) => `${z} хвилин`,
              other: (z) => `${z} хвилини`,
            })} для надолуження.`
          : ""),
    },
});

/** ★ O-PL (02.10.2026): „1 minuta · 2 minuty · 5 minut · 1,5 minuty" - Nominativ, nach Doppelpunkt (Glossar §2.10a). */
function minutenPl(n: number): string {
  return mehrzahl(n, "pl", {
    one: (z) => `${z} minuta`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minut`,
    other: (z) => `${z} minuty`,
  });
}

/** ★ O-PL (02.10.2026): nach „z" (Genitiv): „z 1 minuty", „z 2 minut", „z 60 minut", „z 1,5 minuty". */
function minutenPlZ(n: number): string {
  return mehrzahl(n, "pl", {
    one: (z) => `${z} minuty`,
    few: (z) => `${z} minut`,
    many: (z) => `${z} minut`,
    other: (z) => `${z} minuty`,
  });
}

/** „1 minute" / „25 minutes" - englische Einzahl und Mehrzahl über `Intl.PluralRules`. */
function minutenEn(n: number): string {
  return mehrzahl(n, "en", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` });
}

/** „1 minute" / „25 minutes" - Einzahl und Mehrzahl auf Französisch. */
/** ★ ES-O (27.09.2026): „60 minutos" / „1 minuto". */
function minutenEs(n: number): string {
  return mehrzahl(n, "es", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` });
}

/** ★ O-IT (02.10.2026): „60 minuti" / „1 minuto". */
function minutenIt(n: number): string {
  return mehrzahl(n, "it", { one: (z) => `${z} minuto`, other: (z) => `${z} minuti` });
}

function minutenFr(n: number): string {
  return mehrzahl(n, "fr", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` });
}

/**
 * Alle abgeleiteten Werte - EINMAL gerechnet, von Bild UND Ansage benutzt
 * (siehe [[ableiten]] der Vorgängerfassung: getrennt gerechnet laufen Bild und
 * Alt + D-Ansage irgendwann auseinander). `null`, wenn diese Woche kein
 * (aktives) Wochenziel hat - dann gibt es nichts zu zeigen.
 */
function ableiten(
  events: readonly TaskEvent[],
  ziel: KindWochenziel,
  gesperrt: readonly GesperrteZeit[],
  /** „Ihr Wochenziel" nur, wo `isFormal` es verlangt (Lehrkraft, Erwachsenen-Ton). */
  formal: boolean,
  jetztMs: number,
  sprache: BedienSprache = "de",
) {
  const w = aktuelleWoche(events, ziel, jetztMs, gesperrt);
  if (w.zielMin <= 0) return null;

  // Live: die laufende, noch nicht gespeicherte Zeile zählt SOFORT mit (wie
  // die Übezeit-Uhr) - „geschafft" dagegen erst an gespeicherten Ereignissen
  // (w.rest), damit der Haken nicht vor- und wieder zurückspringt.
  const liveMin = w.geuebtMin + pendingPracticeMs() / 60000;
  const reached = w.rest <= 0;
  const frac = reached ? 1 : Math.min(1, liveMin / w.zielMin);
  // Lieber zu wenig zeigen als zu früh „fertig" behaupten (Floor), aber beim
  // Rest lieber zu viel als „gleich 0" (Ceil) - dieselbe Asymmetrie wie vorher.
  const geuebtAnzeige = Math.min(w.zielMin, Math.floor(liveMin));
  const restMin = Math.max(0, Math.ceil(w.zielMin - liveMin));

  // Nachholen: offene Minuten früherer ZIEL-Wochen, dieselbe Rechnung wie
  // `offenGesamt` in WeeklyGoalStats.tsx - EINE Definition, zwei Stellen, die
  // absichtlich beide von `wochenzielGeschichte` ausgehen statt selbst zu zählen.
  let nachholMin = 0;
  if (ziel.nachholen) {
    const laufendeWoche = wochenStart(jetztMs, WOCHENZIEL_GRENZE);
    nachholMin = Math.round(
      wochenzielGeschichte(events, ziel, jetztMs, gesperrt)
        .filter((x) => x.zielwoche && x.startMs < laufendeWoche)
        .reduce((summe, x) => summe + x.offen, 0),
    );
  }

  // ★ EN1: Bild-Name und Alt + D-Satz in der Bedienungssprache - auch der
  // Satz, weil Alt + D ihn in Tastenflow in dieser Sprache spricht
  // (`TypingSession`, „tippen-announce-time").
  const t = RING_TEXTE[sprache];
  const aria = t.aria(formal, geuebtAnzeige, w.zielMin, reached, nachholMin);
  const satz = t.satz(geuebtAnzeige, w.zielMin, restMin, reached, nachholMin);

  return { zielMin: w.zielMin, geuebtAnzeige, frac, reached, nachholMin, aria, satz };
}

export function WeeklyGoalRings({
  account,
  size = 44,
  poll = false,
  kompakt = false,
}: {
  account: TypingAccount;
  /** Ring-Durchmesser - gleich dem Spielstand-Ring. */
  size?: number;
  /** Während des Übens alle ~45 s neu laden, damit der Stand mitwächst. */
  poll?: boolean;
  /** Schlanke Fassung für die Stand-Zeile - derselbe EINE Ring, nur kleiner. */
  kompakt?: boolean;
}) {
  const backend = typingBackend();
  const { sprache } = useBedienSprache();
  const t = RING_TEXTE[sprache];
  const gesperrt = useGesperrteZeiten(account.classCode);
  const [events, setEvents] = useState<readonly TaskEvent[] | null>(null);
  // Sekunden-Takt: Der Ring soll im selben Rhythmus wachsen wie die
  // Übezeit-Uhr, nicht erst beim Speichern der Zeile (siehe pendingPracticeMs).
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  /*
   * ★★ SERVERLAST (28.09.2026, gemessen: 65.764 Lesungen von `lw_events` in
   *    fünf Tagen, Mittel 6,4 KB je Antwort). Der Ring liest jetzt nur noch,
   *    wo er etwas NICHT wissen kann:
   *     • beim Einbau und bei einem ANDEREN Konto - die Abhängigkeit ist die
   *       Kennung, nicht das Konto-Objekt: das wechselt beim Start drei- bis
   *       viermal (Klasse nachgezogen, Konto aufgefrischt) und löste jedes
   *       Mal eine volle Lesung aus;
   *     • im 45-s-Takt NUR bei sichtbarem Fenster - er ist für Übung an einem
   *       ANDEREN Gerät da; ein verborgener Tab zeigt niemandem etwas. Beim
   *       Zurückkommen wird einmal gelesen, dann läuft der Takt wieder;
   *     • nach einer gespeicherten Zeile NICHT: der Schreibweg reicht die
   *       geschriebene Liste im Signal mit (`ereignisseGespeichert.ts`). Nur
   *       ein Signal ohne Liste führt noch zu einer Lesung.
   */
  const kontoId = account.id;
  useEffect(() => {
    let alive = true;
    // Eine Lesung, die VOR einem Signal mit Liste losging, darf dessen
    // neueren Stand nicht mit einem älteren überschreiben.
    let signalNr = 0;
    const reload = () => {
      const nr = signalNr;
      void backend.getEvents(kontoId).then((ev) => {
        if (alive && nr === signalNr) setEvents(ev);
      });
    };
    reload();
    const sichtbar = () => document.visibilityState !== "hidden";
    let takt: number | undefined;
    const taktStarten = () => {
      if (!poll || takt !== undefined || !sichtbar()) return;
      takt = window.setInterval(reload, 45000);
    };
    const taktAnhalten = () => {
      if (takt !== undefined) window.clearInterval(takt);
      takt = undefined;
    };
    taktStarten();
    const beiSichtwechsel = () => {
      if (!poll) return;
      if (!sichtbar()) {
        taktAnhalten();
        return;
      }
      // Wieder vorne: einmal nachfragen (Übung an einem anderen Gerät), dann
      // den Takt neu beginnen - nicht zwei Lesungen kurz hintereinander.
      if (takt !== undefined) return;
      reload();
      taktStarten();
    };
    document.addEventListener("visibilitychange", beiSichtwechsel);
    // Nach jeder gespeicherten Übungszeile sofort nachziehen (Signal aus der
    // Warteschlange, `useNachsenden.ts`) - der Ring wächst im Takt der
    // Übezeit-Uhr.
    const beiGespeichert = (ev: Event) => {
      const signal = leseEreignisseGespeichert(ev);
      if (signal && signal.accountId !== kontoId) return; // fremdes Konto
      if (signal?.ereignisse) {
        signalNr += 1;
        if (alive) setEvents(signal.ereignisse);
        return;
      }
      reload(); // Liste unbekannt - wie früher selbst lesen
    };
    window.addEventListener(EREIGNISSE_GESPEICHERT, beiGespeichert);
    return () => {
      alive = false;
      taktAnhalten();
      document.removeEventListener("visibilitychange", beiSichtwechsel);
      window.removeEventListener(EREIGNISSE_GESPEICHERT, beiGespeichert);
    };
  }, [backend, kontoId, poll]);

  const ziel = kindWochenzielAusFeldern(account);
  // ★ 19.09.2026: Die Anrede hängt an der Rolle, nicht am Alter - ein Kind
  // ab 16 liest „Dein Wochenziel" (`anredeFuer`, skin.ts).
  const formal = isFormal(skinForStufe(stufeFuer(account)), anredeFuer(account));
  const stand = events ? ableiten(events, ziel, gesperrt, formal, Date.now(), sprache) : null;

  // Ansage-Satz für Alt + D fortschreiben (siehe goalAnsage.ts). Ohne
  // Abhängigkeitsliste: Die Anzeige rechnet ohnehin im Sekundentakt neu, und
  // die Ansage soll denselben Stand haben wie das Bild.
  useEffect(() => {
    setzeWochenzielAnsage(stand ? stand.satz : null);
  });

  // Noch am Laden oder kein Wochenziel diese Woche → nichts anzeigen.
  if (!stand) return null;
  const { zielMin, geuebtAnzeige, frac, reached, nachholMin, aria } = stand;

  if (kompakt)
    return (
      // ★ 30.08.2026: Hinweis aus dem Tipp-Baustein statt aus `title`
      //   (Johannes: der native kam „sehr verzögert und viel kleiner"). Die
      //   Id wird nicht angehängt: `aria-label` sagt dasselbe schon.
      <Tipp text={aria}>
        {() => (
          <div className="flex min-w-0 items-center gap-1.5" role="img" aria-label={aria}>
            <span className="shrink-0 text-ink-soft" aria-hidden="true">
              {t.wochenziel}
            </span>
            <RingGauge size={size} frac={frac}>
              {reached ? "✓" : geuebtAnzeige}
            </RingGauge>
            <span className="shrink-0 text-ink-soft" aria-hidden="true">
              {t.von(zielMin)}
            </span>
            {nachholMin > 0 && (
              <span className="shrink-0 text-ink-soft" aria-hidden="true">
                {t.nachholen(nachholMin)}
              </span>
            )}
          </div>
        )}
      </Tipp>
    );

  return (
    // ★ Wie kompakt: Hinweis über Tipp statt über ein natives `title` (das
    //   hier vor dem Umbau noch direkt am Wrapper stand).
    <Tipp text={aria}>
      {() => (
        <div className="flex min-w-0 items-center gap-2" role="img" aria-label={aria}>
          <p
            className="m-0 shrink-0 text-sm font-semibold leading-tight text-ink"
            aria-hidden="true"
          >
            {t.wochenziel}
          </p>
          <RingGauge size={size} frac={frac}>
            {reached ? "✓" : geuebtAnzeige}
          </RingGauge>
          <span className="shrink-0 text-sm text-ink-soft" aria-hidden="true">
            {t.von(zielMin)}
          </span>
          {nachholMin > 0 && (
            <span className="shrink-0 text-sm text-ink-soft" aria-hidden="true">
              {t.nachholen(nachholMin)}
            </span>
          )}
        </div>
      )}
    </Tipp>
  );
}
