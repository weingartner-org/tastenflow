/**
 * ★★★ Die eigenen SCHREIBPROBEN in „Meine Statistik" (09.09.2026).
 *
 * Auftrag Johannes, 09.09.2026 (wörtlich): *„wenn die zeit abgelaufen ist
 * bekommen die schüler sofort eine detaillierte auflistung ihrer leistung und
 * **sie sehen eine liste ihrer prüfungen in ihrer eigenen statistik**"*.
 *
 * Die Auflistung gleich nach dem Abgeben ist das eine; das hier ist das andere:
 * dieselben Zahlen, dauerhaft, in der eigenen Statistik - damit ein Kind seine
 * Schreibproben auch in vier Wochen noch nachlesen kann, ohne jemanden fragen
 * zu müssen ([[feedback_data_transparency]]).
 *
 * ── Diese Datei ist die LISTE, nicht die grosse Auflistung ──────────────────
 * ★★★ 11.09.2026 (C4, Umbauplan §2.4): Beim Ausklappen stand hier bis dahin
 * {@link SchreibprobeErgebnis} - dieselbe Karte, die ein Kind unmittelbar
 * nach dem Abgeben liest, mit ihren `text-4xl`-Kacheln. In dieser Liste, in
 * der mehrere Einträge untereinanderstehen, war das zu viel: Die Kennzahlen
 * stehen schon in der `<summary>` (Datum, Niveau, Anschläge/Min,
 * Treffsicherheit, Leistungswert) - beim Ausklappen kommt jetzt nur noch
 * hinzu, was dort NICHT steht: die wackligen Tasten. `SchreibprobeErgebnis`
 * selbst bleibt unverändert; sie wird weiterhin direkt nach dem Abgeben
 * gebraucht (`SchreibprobeLauf`).
 *
 * Hier steht deshalb nur, was die Zusammenfassung allein nicht sagen kann:
 *  • WELCHE Schreibproben es gibt und in welcher Reihenfolge,
 *  • die Zeile zum Aufklappen (Datum, Niveau, Titel, die drei Zahlen),
 *  • der VERLAUF - der Vergleich mit der vorigen Probe desselben Niveaus,
 *    seit dem 10.09.2026 am LEISTUNGSWERT gemessen (siehe `verlaufSatz`),
 *  • und, aufgeklappt, die wackligen Tasten mit ihrem Satz.
 *
 * ── Warum die Liste bei den meisten Kindern GAR NICHT erscheint ─────────────
 * Ohne Ergebnis gibt die Komponente `null` zurück - kein leerer Kasten, kein
 * „Du hast noch keine Schreibprobe geschrieben". Eine Schreibprobe setzt die
 * Lehrkraft an, und die allermeisten Kinder werden nie eine schreiben. Ein
 * Kasten, der bei ihnen für immer leer danebensteht, ist kein Angebot, sondern
 * Lärm - und auf einer Braillezeile kostet er echte Zeilen.
 *
 * ── Was hier bewusst NICHT steht ────────────────────────────────────────────
 *  • **Kein Lob und kein Tadel.** Auch nicht beim Verlauf: Wird ein Kind
 *    langsamer, steht die Zahl da und sonst nichts
 *    ([[feedback_nie_gegen_das_kind]]). Ein „schade" wäre eine Wertung, ein
 *    „macht nichts" auch - beide sagen dem Kind, wie es sich zu fühlen hat.
 *  • **Keine Note.** Aus den Werten baut die Lehrkraft eine Note, nicht die
 *    App (Johannes, 31.08.2026).
 *  • **Keine `aria-live`-Region.** Was hier steht, ändert sich nicht von
 *    selbst; eine Live-Meldung würde die Braillezeile nur verdrängen
 *    ([[reference_live_region_ist_braille_blitzmeldung]]).
 */
import { useEffect, useState } from "react";
import {
  WACKLIG_MIND_DRAN,
  WACKLIG_QUOTE,
  niveauDef,
  niveauTexte,
  probenUebersicht,
  pruefungWort,
  pruefungWortMehrzahl,
  startGeschrieben,
  tastenName,
  textBezeichnung,
  typingBackend,
  type Probenergebnis,
} from "@/lib/typing";
import { mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { eineStelle, wertungVon } from "./SchreibprobeErgebnis";
import { SchreibprobenTabelle } from "./SchreibprobenTabelle";
// ★ E1 (24.09.2026): das Niveau im Weg, aus dem die Challenge stammt.
import { lernwegVon } from "@/lib/typing/lernweg";

/**
 * ★ Die Liste der eigenen Tippchallenges in beiden Bedienungssprachen (EN3,
 * 19.09.2026). Deutsch wortgleich wie vorher. Glossar §3.7: *Typing
 * Challenge* ★, *key range* (Niveau), Leistungswert ⇒ *score* (hier stehen nur
 * Challenge-Zahlen, §3.2), *wobbly* (§5 Nr. 10). Das Kind liest über sich
 * selbst - *you*. Der Titel eines Textes ist INHALT und bleibt in seiner
 * Sprache (`lang="de"` in der englischen Bedienung).
 */
const LISTE_TEXTE = texte({
  de: {
    bezug: (wort: string) => `bei deiner ${wort} davor auf diesem Niveau`,
    gleich: (bezug: string) => `Derselbe Leistungswert wie ${bezug}.`,
    hoeher: (d: string, bezug: string) => `Leistungswert um ${d} höher als ${bezug}.`,
    niedriger: (d: string, bezug: string) => `Leistungswert um ${d} niedriger als ${bezug}.`,
    zeileWerte: (anschlaege: number, prozent: number) => [
      " ·",
      " ",
      anschlaege,
      " Anschläge je Minute ·",
      " ",
      prozent,
      " % Treffsicherheit ·",
      " ",
    ],
    leistungswert: (wert: string) => `Leistungswert ${wert}`,
    ohneWertung: "ohne Wertung",
    richtig: (richtige: number, dran: number) => [richtige, " von ", dran, " richtig"],
    keineWacklig: "Keine einzelne Taste ist aufgefallen.",
    wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
      "Wacklig heißt: Diese Taste war in dieser ",
      wort,
      " mindestens",
      " ",
      mindestens,
      " mal dran und blieb dabei unter",
      " ",
      prozent,
      " % Treffsicherheit. Das sagt etwas über diese ",
      wort,
      ", nicht über deinen Lernstand.",
    ],
    // ★ 19.09.2026: der Stand in der `<summary>` der Ausklappzeile - das Wort
    // „Tippchallenges" steht schon in der Überschrift davor.
    stand: (anzahl: number, schnitt: number | null) =>
      `· ${anzahl} geschrieben` + (schnitt === null ? "" : `, Leistungswert im Schnitt ${schnitt}`),
    beschriftung: (mehrzahl: string) => `Deine ${mehrzahl}`,
    einzeln: (wort: string) => ["Jede ", wort, " einzeln"],
    reihenfolge: "Die jüngste zuerst. Aufklappen zeigt die wackligen Tasten.",
  },
  en: {
    bezug: (wort: string) => `in your previous ${wort} with this key range`,
    gleich: (bezug: string) => `The same score as ${bezug}.`,
    hoeher: (d: string, bezug: string) => `Score ${d} higher than ${bezug}.`,
    niedriger: (d: string, bezug: string) => `Score ${d} lower than ${bezug}.`,
    zeileWerte: (anschlaege: number, prozent: number) => [
      " ·",
      " ",
      anschlaege,
      " keystrokes per minute ·",
      " ",
      prozent,
      "% accuracy ·",
      " ",
    ],
    leistungswert: (wert: string) => `score ${wert}`,
    ohneWertung: "not scored",
    richtig: (richtige: number, dran: number) => [richtige, " of ", dran, " correct"],
    keineWacklig: "No single key stood out.",
    wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
      "Wobbly means: this key came up at least ",
      mindestens,
      " times in this ",
      wort,
      " and was typed correctly less than ",
      prozent,
      "% of the time. That tells you something about this ",
      wort,
      ", not about your progress.",
    ],
    stand: (anzahl: number, schnitt: number | null) =>
      `· ${anzahl} done` + (schnitt === null ? "" : `, average score ${schnitt}`),
    beschriftung: (mehrzahl: string) => `Your ${mehrzahl}`,
    einzeln: (wort: string) => ["Each ", wort, " on its own"],
    reihenfolge: "Most recent first. Expand one to see the wobbly keys.",
  },
  fr: {
    bezug: (wort: string) => `à ton ${wort} précédent à ce niveau`,
    gleich: (bezug: string) => `Même score qu'${bezug}.`,
    hoeher: (d: string, bezug: string) => `Score supérieur de ${d} à ${bezug}.`,
    niedriger: (d: string, bezug: string) => `Score inférieur de ${d} à ${bezug}.`,
    zeileWerte: (anschlaege: number, prozent: number) => [
      " -",
      " ",
      anschlaege,
      " frappes par minute -",
      " ",
      prozent,
      " % de précision -",
      " ",
    ],
    leistungswert: (wert: string) => `score ${wert}`,
    ohneWertung: "sans score",
    richtig: (richtige: number, dran: number) => [richtige, " sur ", dran, " correctes"],
    keineWacklig: "Aucune touche particulière ne s'est démarquée.",
    wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
      "Instable signifie : cette touche est venue au moins ",
      mindestens,
      " fois dans ce ",
      wort,
      " et a été réussie dans moins de",
      " ",
      prozent,
      " % des cas. Cela dit quelque chose sur ce ",
      wort,
      ", pas sur tes progrès.",
    ],
    stand: (anzahl: number, schnitt: number | null) =>
      `- ${anzahl} fait${anzahl === 1 ? "" : "s"}` + (schnitt === null ? "" : `, score moyen ${schnitt}`),
    beschriftung: (mehrzahl: string) => `Tes ${mehrzahl}`,
    einzeln: (wort: string) => ["Chaque ", wort, " séparément"],
    reihenfolge: "Le plus récent en premier. Déplier montre les touches instables.",
  },
  // ★ ES-O (27.09.2026): tú. „Reto" ist männlich: „tu Reto anterior".
  es: {
    bezug: (wort: string) => `tu ${wort} anterior en este nivel`,
    gleich: (bezug: string) => `La misma puntuación que ${bezug}.`,
    hoeher: (d: string, bezug: string) => `Puntuación ${d} más alta que ${bezug}.`,
    niedriger: (d: string, bezug: string) => `Puntuación ${d} más baja que ${bezug}.`,
    zeileWerte: (anschlaege: number, prozent: number) => [
      " -",
      " ",
      anschlaege,
      " pulsaciones por minuto -",
      " ",
      prozent,
      " % de precisión -",
      " ",
    ],
    leistungswert: (wert: string) => `puntuación ${wert}`,
    ohneWertung: "sin puntuación",
    richtig: (richtige: number, dran: number) => [richtige, " de ", dran, " correctas"],
    keineWacklig: "No destacó ninguna tecla en especial.",
    wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
      "Insegura significa: esta tecla salió al menos ",
      mindestens,
      " veces en este ",
      wort,
      " y se acertó en menos del",
      " ",
      prozent,
      " % de los casos. Eso dice algo sobre este ",
      wort,
      ", no sobre tu progreso.",
    ],
    stand: (anzahl: number, schnitt: number | null) =>
      `- ${anzahl} ${anzahl === 1 ? "hecho" : "hechos"}` + (schnitt === null ? "" : `, puntuación media ${schnitt}`),
    beschriftung: (mehrzahl: string) => `Tus ${mehrzahl}`,
    einzeln: (wort: string) => ["Cada ", wort, " por separado"],
    reihenfolge: "El más reciente primero. Al desplegar se ven las teclas inseguras.",
  },
  // ★ O-IT (02.10.2026): `bezug` ohne Artikel - die Sätze sagen „della"/„alla".
  it: {
    bezug: (wort: string) => `tua ${wort} precedente a questo livello`,
    gleich: (bezug: string) => `Lo stesso punteggio della ${bezug}.`,
    hoeher: (d: string, bezug: string) => `Punteggio più alto di ${d} rispetto alla ${bezug}.`,
    niedriger: (d: string, bezug: string) => `Punteggio più basso di ${d} rispetto alla ${bezug}.`,
    zeileWerte: (anschlaege: number, prozent: number) => [
      " -",
      " ",
      anschlaege,
      " battute al minuto -",
      " ",
      prozent,
      "% di precisione -",
      " ",
    ],
    leistungswert: (wert: string) => `punteggio ${wert}`,
    ohneWertung: "senza punteggio",
    richtig: (richtige: number, dran: number) => [richtige, " di ", dran, " giuste"],
    keineWacklig: "Nessun tasto si è notato in modo particolare.",
    wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
      "Incerto significa: questo tasto è comparso almeno ",
      mindestens,
      " volte in questa ",
      wort,
      " ed è stato preso giusto in meno del",
      " ",
      prozent,
      "% dei casi. Questo dice qualcosa su questa ",
      wort,
      ", non sui tuoi progressi.",
    ],
    stand: (anzahl: number, schnitt: number | null) =>
      `- ${anzahl} ${anzahl === 1 ? "fatta" : "fatte"}` + (schnitt === null ? "" : `, punteggio medio ${schnitt}`),
    beschriftung: (mehrzahl: string) => `Le tue ${mehrzahl}`,
    einzeln: (wort: string) => ["Ogni ", wort, " singolarmente"],
    reihenfolge: "La più recente per prima. Aprendo si vedono i tasti incerti.",
  },
  // ★ O-PL (02.10.2026): ty; „Wyzwanie" gebeugt ausgeschrieben, wo der Satz
  // einen anderen Fall braucht („w tym Wyzwaniu") - `wort` ist der Nominativ.
  // Zahl + Hauptwort über `mehrzahl` oder nach Doppelpunkt (Glossar §2.10a).
  pl: {
    bezug: () => `w twoim poprzednim Wyzwaniu z tymi klawiszami`,
    gleich: (bezug: string) => `Taki sam wynik jak ${bezug}.`,
    hoeher: (d: string, bezug: string) => `Wynik wyższy o ${d} niż ${bezug}.`,
    niedriger: (d: string, bezug: string) => `Wynik niższy o ${d} niż ${bezug}.`,
    zeileWerte: (anschlaege: number, prozent: number) => [
      " -",
      " ",
      anschlaege,
      mehrzahl(anschlaege, "pl", {
        one: () => " uderzenie na minutę -",
        few: () => " uderzenia na minutę -",
        many: () => " uderzeń na minutę -",
        other: () => " uderzenia na minutę -",
      }),
      " ",
      prozent,
      "% dokładności -",
      " ",
    ],
    leistungswert: (wert: string) => `wynik ${wert}`,
    ohneWertung: "bez wyniku",
    richtig: (richtige: number, dran: number) => [richtige, " z ", dran, " poprawnie"],
    keineWacklig: "Żaden klawisz się nie wyróżnił.",
    wackligErklaerung: (_wort: string, mindestens: number, prozent: number) => [
      "Niepewny oznacza: ten klawisz pojawił się w tym Wyzwaniu co najmniej ",
      mindestens,
      mehrzahl(mindestens, "pl", { one: () => " raz", few: () => " razy", many: () => " razy", other: () => " raza" }),
      " i był trafiany rzadziej niż w",
      " ",
      prozent,
      "% przypadków. To mówi coś o tym Wyzwaniu, a nie o twoich postępach.",
    ],
    stand: (anzahl: number, schnitt: number | null) =>
      `- napisane: ${anzahl}` + (schnitt === null ? "" : `, średni wynik: ${schnitt}`),
    beschriftung: (mehrzahl: string) => `Twoje ${mehrzahl}`,
    einzeln: (wort: string) => ["Każde ", wort, " osobno"],
    reihenfolge: "Najnowsze na początku. Po rozwinięciu widać niepewne klawisze.",
  },
  // ★ O-TR (02.10.2026): sen; "yarışma" ausgeschrieben, wo eine Endung nötig
  // ist - `wort` bleibt ohne Endung; Zahlen nach Doppelpunkt oder vor einem
  // Hauptwort in der Einzahl, "7 doğru, toplam 12", "%95" (Glossar §1).
  tr: {
    bezug: () => `bu tuşlarla yaptığın bir önceki yarışma`,
    gleich: (bezug: string) => `Puan aynı - karşılaştırma: ${bezug}.`,
    hoeher: (d: string, bezug: string) => `Puan ${d} daha yüksek - karşılaştırma: ${bezug}.`,
    niedriger: (d: string, bezug: string) => `Puan ${d} daha düşük - karşılaştırma: ${bezug}.`,
    zeileWerte: (anschlaege: number, prozent: number) => [
      " ·",
      " ",
      anschlaege,
      " dakikada vuruş ·",
      " ",
      "doğruluk %",
      prozent,
      " ·",
      " ",
    ],
    leistungswert: (wert: string) => `puan: ${wert}`,
    ohneWertung: "puan yok",
    richtig: (richtige: number, dran: number) => [richtige, " doğru, toplam ", dran],
    keineWacklig: "Hiçbir tuş ayrıca göze çarpmadı.",
    wackligErklaerung: (_wort: string, mindestens: number, prozent: number) => [
      "Henüz oturmamış demek: bu tuş bu yarışmada en az ",
      mindestens,
      " kez geldi ve doğru basılma oranı %",
      prozent,
      " değerinin altında kaldı. Bu, senin ilerlemeni değil, bu yarışmayı anlatır.",
    ],
    stand: (anzahl: number, schnitt: number | null) =>
      `· yazılan: ${anzahl}` + (schnitt === null ? "" : `, ortalama puan: ${schnitt}`),
    beschriftung: () => "Yarışmaların",
    einzeln: () => ["Her yarışma ayrı ayrı"],
    reihenfolge: "En yenisi en üstte. Açınca henüz oturmamış tuşlar görünür.",
  },
  // ★ O-CS (03.10.2026): ty, ohne Vergangenheit; „Výzva" gross, in anderen
  // Fällen ausgeschrieben („v tvé předchozí Výzvě"); Zahlen nach Doppelpunkt
  // oder mit Schrägstrich („správně: 7/12"), „95 %" mit geschütztem Leerzeichen.
  cs: {
    bezug: () => `v tvé předchozí Výzvě se stejnými klávesami`,
    gleich: (bezug: string) => `Stejné skóre jako ${bezug}.`,
    hoeher: (d: string, bezug: string) => `Skóre o ${d} vyšší než ${bezug}.`,
    niedriger: (d: string, bezug: string) => `Skóre o ${d} nižší než ${bezug}.`,
    zeileWerte: (anschlaege: number, prozent: number) => [
      " ·",
      " ",
      anschlaege,
      " úhozů/min ·",
      " ",
      "přesnost: ",
      prozent,
      "\u00A0% ·",
      " ",
    ],
    leistungswert: (wert: string) => `skóre: ${wert}`,
    ohneWertung: "bez skóre",
    richtig: (richtige: number, dran: number) => ["správně: ", richtige, "/", dran],
    keineWacklig: "Žádná klávesa zvlášť nevybočila.",
    wackligErklaerung: (_wort: string, mindestens: number, prozent: number) => [
      "Nejistá znamená: tato klávesa se v této Výzvě objevila aspoň ",
      mindestens,
      "krát a její přesnost byla nižší než ",
      prozent,
      "\u00A0%. Říká to něco o této Výzvě, ne o tvém pokroku.",
    ],
    stand: (anzahl: number, schnitt: number | null) =>
      `· napsáno: ${anzahl}` + (schnitt === null ? "" : `, průměrné skóre: ${schnitt}`),
    beschriftung: () => "Tvoje Výzvy",
    einzeln: () => ["Každá Výzva zvlášť"],
    reihenfolge: "Nejnovější nahoře. Po rozbalení jsou vidět nejisté klávesy.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      bezug: (wort: string) => `при предишното ти ${wort} със същите клавиши`,
      gleich: (bezug: string) => `Същият резултат като ${bezug}.`,
      // „с ${d}" vermieden (Glossar Regel 14: с/със vor Zahlen).
      hoeher: (d: string, bezug: string) => `Резултатът е по-висок (разлика ${d}), отколкото ${bezug}.`,
      niedriger: (d: string, bezug: string) => `Резултатът е по-нисък (разлика ${d}), отколкото ${bezug}.`,
      zeileWerte: (anschlaege: number, prozent: number) => [
        " ·",
        " ",
        anschlaege,
        " знака в минута ·",
        " ",
        prozent,
        "% точност ·",
        " ",
      ],
      leistungswert: (wert: string) => `резултат ${wert}`,
      ohneWertung: "без резултат",
      richtig: (richtige: number, dran: number) => [richtige, " от ", dran, " верни"],
      keineWacklig: "Нито един клавиш не се открои.",
      wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
        "Несигурен означава: в това ",
        wort,
        " клавишът се е появил поне ",
        mindestens,
        " пъти и точността при него е била под ",
        prozent,
        "%. Това казва нещо за това ",
        wort,
        ", не за твоя напредък.",
      ],
      stand: (anzahl: number, schnitt: number | null) =>
        `· написани: ${anzahl}` + (schnitt === null ? "" : `, среден резултат ${schnitt}`),
      beschriftung: (mehrzahl: string) => `Твоите ${mehrzahl}`,
      einzeln: (wort: string) => ["Всяко ", wort, " поотделно"],
      reihenfolge: "Най-новото първо. Като го разгънеш, виждаш несигурните клавиши.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      bezug: (wort: string) => `στην προηγούμενη ${wort} με αυτά τα πλήκτρα`,
      gleich: (bezug: string) => `Το ίδιο σκορ όπως ${bezug}.`,
      hoeher: (d: string, bezug: string) => `Σκορ κατά ${d} υψηλότερο από ό,τι ${bezug}.`,
      niedriger: (d: string, bezug: string) => `Σκορ κατά ${d} χαμηλότερο από ό,τι ${bezug}.`,
      zeileWerte: (anschlaege: number, prozent: number) => [
        " ·",
        " ",
        anschlaege,
        " πατήματα ανά λεπτό ·",
        " ",
        prozent,
        "% ακρίβεια ·",
        " ",
      ],
      leistungswert: (wert: string) => `σκορ ${wert}`,
      ohneWertung: "χωρίς σκορ",
      richtig: (richtige: number, dran: number) => [richtige, " από ", dran, " σωστά"],
      keineWacklig: "Κανένα πλήκτρο δεν ξεχώρισε.",
      wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
        "Αβέβαιο σημαίνει: αυτό το πλήκτρο εμφανίστηκε τουλάχιστον ",
        mindestens,
        " φορές σε αυτή την ",
        wort,
        " και η ακρίβεια έμεινε κάτω από ",
        prozent,
        "%. Αυτό λέει κάτι για αυτή την ",
        wort,
        ", όχι για την πρόοδό σου.",
      ],
      stand: (anzahl: number, schnitt: number | null) =>
        `· γραμμένες: ${anzahl}` + (schnitt === null ? "" : `, μέσο σκορ ${schnitt}`),
      beschriftung: (mehrzahl: string) => `Οι ${mehrzahl} σου`,
      einzeln: (wort: string) => ["Κάθε ", wort, " χωριστά"],
      reihenfolge: "Η πιο πρόσφατη πρώτη. Με ανάπτυξη βλέπεις τα αβέβαια πλήκτρα.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      // Glossar Regel 12: keine Endung an ${wort} - darum in Klammern.
      bezug: (wort: string) => `az előző eredmény (${wort}, ugyanezekkel a billentyűkkel)`,
      gleich: (bezug: string) => `Ugyanaz a pontszám, mint ${bezug}.`,
      hoeher: (d: string, bezug: string) => `A pontszám ${d} ponttal több, mint ${bezug}.`,
      niedriger: (d: string, bezug: string) => `A pontszám ${d} ponttal kevesebb, mint ${bezug}.`,
      zeileWerte: (anschlaege: number, prozent: number) => [
        " ·",
        " ",
        anschlaege,
        " leütés percenként ·",
        " ",
        prozent,
        "% pontosság ·",
        " ",
      ],
      leistungswert: (wert: string) => `pontszám: ${wert}`,
      ohneWertung: "értékelés nélkül",
      richtig: (richtige: number, dran: number) => [richtige, "/", dran, " helyes"],
      keineWacklig: "Egyik billentyű sem tűnt ki.",
      wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
        "Bizonytalan azt jelenti: ez a billentyű ebben a feladatban (",
        wort,
        ") legalább ",
        mindestens,
        " alkalommal szerepelt, és a pontossága ",
        prozent,
        "% alatt maradt. Ez erről a feladatról (",
        wort,
        ") mond valamit, nem a tudásodról.",
      ],
      stand: (anzahl: number, schnitt: number | null) =>
        `· megírva: ${anzahl}` + (schnitt === null ? "" : `, átlagos pontszám: ${schnitt}`),
      beschriftung: (mehrzahl: string) => `Saját ${mehrzahl}`,
      einzeln: (wort: string) => ["Minden ", wort, " külön"],
      reihenfolge: "A legutóbbi elöl. Kinyitva látod a bizonytalan billentyűket.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      bezug: (wort: string) => `bij je vorige ${wort} met deze toetsen`,
      gleich: (bezug: string) => `Dezelfde score als ${bezug}.`,
      hoeher: (d: string, bezug: string) => `Score ${d} hoger dan ${bezug}.`,
      niedriger: (d: string, bezug: string) => `Score ${d} lager dan ${bezug}.`,
      zeileWerte: (anschlaege: number, prozent: number) => [
        " ·",
        " ",
        anschlaege,
        " aanslagen per minuut ·",
        " ",
        prozent,
        "% nauwkeurigheid ·",
        " ",
      ],
      leistungswert: (wert: string) => `score ${wert}`,
      ohneWertung: "zonder score",
      richtig: (richtige: number, dran: number) => [richtige, " van ", dran, " goed"],
      keineWacklig: "Er viel geen enkele toets op.",
      wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
        "Onzeker betekent: deze toets kwam in deze ",
        wort,
        " minstens ",
        mindestens,
        " keer voor en werd daarbij minder dan ",
        prozent,
        "% van de keren goed getypt. Dat zegt iets over deze ",
        wort,
        ", niet over hoe ver je bent.",
      ],
      stand: (anzahl: number, schnitt: number | null) =>
        `· ${anzahl} gedaan` + (schnitt === null ? "" : `, gemiddelde score ${schnitt}`),
      beschriftung: (mehrzahl: string) => `Jouw ${mehrzahl}`,
      einzeln: (wort: string) => ["Elke ", wort, " apart"],
      reihenfolge: "De nieuwste eerst. Klap er een uit om de onzekere toetsen te zien.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      bezug: (wort: string) => `no teu ${wort} anterior com estas teclas`,
      gleich: (bezug: string) => `A mesma pontuação que ${bezug}.`,
      hoeher: (d: string, bezug: string) => `Pontuação ${d} acima da obtida ${bezug}.`,
      niedriger: (d: string, bezug: string) => `Pontuação ${d} abaixo da obtida ${bezug}.`,
      zeileWerte: (anschlaege: number, prozent: number) => [
        " ·",
        " ",
        anschlaege,
        " toques por minuto ·",
        " ",
        prozent,
        "% de precisão ·",
        " ",
      ],
      leistungswert: (wert: string) => `pontuação ${wert}`,
      ohneWertung: "sem pontuação",
      richtig: (richtige: number, dran: number) => [richtige, " de ", dran, " certas"],
      keineWacklig: "Nenhuma tecla se destacou.",
      wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
        "Em consolidação quer dizer: esta tecla apareceu pelo menos ",
        mindestens,
        " vezes neste ",
        wort,
        " e foi escrita corretamente menos de ",
        prozent,
        "% das vezes. Isto diz algo sobre este ",
        wort,
        ", não sobre a tua aprendizagem.",
      ],
      stand: (anzahl: number, schnitt: number | null) =>
        `· ${anzahl} ${anzahl === 1 ? "realizado" : "realizados"}` +
        (schnitt === null ? "" : `, pontuação média ${schnitt}`),
      beschriftung: (mehrzahl: string) => `Os teus ${mehrzahl}`,
      einzeln: (wort: string) => ["Cada ", wort, " em separado"],
      reihenfolge: "O mais recente primeiro. Expande um para ver as teclas em consolidação.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      bezug: (wort: string) => `no seu ${wort} anterior com estas teclas`,
      gleich: (bezug: string) => `A mesma pontuação obtida ${bezug}.`,
      hoeher: (d: string, bezug: string) => `Pontuação ${d} acima da obtida ${bezug}.`,
      niedriger: (d: string, bezug: string) => `Pontuação ${d} abaixo da obtida ${bezug}.`,
      zeileWerte: (anschlaege: number, prozent: number) => [
        " ·",
        " ",
        anschlaege,
        " toques por minuto ·",
        " ",
        prozent,
        "% de precisão ·",
        " ",
      ],
      leistungswert: (wert: string) => `pontuação ${wert}`,
      ohneWertung: "sem pontuação",
      richtig: (richtige: number, dran: number) => [richtige, " de ", dran, " certas"],
      keineWacklig: "Nenhuma tecla chamou atenção.",
      wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
        "Insegura quer dizer: esta tecla apareceu pelo menos ",
        mindestens,
        " vezes neste ",
        wort,
        " e ficou abaixo de ",
        prozent,
        "% de precisão. Isso diz algo sobre este ",
        wort,
        ", não sobre o seu progresso.",
      ],
      // Zahl hinter Doppelpunkt (Glossar §2.11) - so bleibt „concluídos" auch bei 1 richtig.
      stand: (anzahl: number, schnitt: number | null) =>
        `· concluídos: ${anzahl}` + (schnitt === null ? "" : `, pontuação média ${schnitt}`),
      beschriftung: (mehrzahl: string) => `Seus ${mehrzahl}`,
      einzeln: (wort: string) => ["Cada ", wort, " separadamente"],
      reihenfolge: "Os mais recentes primeiro. Expanda um para ver as teclas inseguras.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      // „ultima" steht ohne Artikel vor dem Wort - so muss „${wort}" nicht gebeugt werden.
      bezug: (wort: string) => `la ultima ${wort} cu aceleași taste`,
      gleich: (bezug: string) => `Același scor ca ${bezug}.`,
      hoeher: (d: string, bezug: string) => `Scor mai mare cu ${d} decât ${bezug}.`,
      niedriger: (d: string, bezug: string) => `Scor mai mic cu ${d} decât ${bezug}.`,
      zeileWerte: (anschlaege: number, prozent: number) => [
        " ·",
        " ",
        anschlaege,
        " car./min ·",
        " precizie ",
        prozent,
        " % ·",
        " ",
      ],
      leistungswert: (wert: string) => `scor ${wert}`,
      ohneWertung: "fără scor",
      richtig: (richtige: number, dran: number) => [richtige, " din ", dran, " corecte"],
      keineWacklig: "Nicio tastă nu a ieșit în evidență.",
      wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
        "Nesigură înseamnă: tasta aceasta a apărut în această ",
        wort,
        " de mai multe ori (cel puțin: ",
        mindestens,
        ") și a avut o precizie sub ",
        prozent,
        " %. Asta spune ceva despre această ",
        wort,
        ", nu despre progresul tău.",
      ],
      stand: (anzahl: number, schnitt: number | null) =>
        `· scrise: ${anzahl}` + (schnitt === null ? "" : `, scor mediu ${schnitt}`),
      beschriftung: (mehrzahl: string) => `Lista ta: ${mehrzahl}`,
      einzeln: (wort: string) => ["Fiecare ", wort, " în parte"],
      reihenfolge: "Cele mai recente primele. Extinde una ca să vezi tastele nesigure.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      bezug: (wort: string) => `i din förra ${wort} med samma tangenter`,
      gleich: (bezug: string) => `Samma poäng som ${bezug}.`,
      hoeher: (d: string, bezug: string) => `Poängen är ${d} högre än ${bezug}.`,
      niedriger: (d: string, bezug: string) => `Poängen är ${d} lägre än ${bezug}.`,
      zeileWerte: (anschlaege: number, prozent: number) => [
        " ·",
        " ",
        anschlaege,
        " anslag per minut ·",
        " ",
        prozent,
        " % träffsäkerhet ·",
        " ",
      ],
      leistungswert: (wert: string) => `poäng ${wert}`,
      ohneWertung: "utan poäng",
      richtig: (richtige: number, dran: number) => [richtige, " av ", dran, " rätt"],
      keineWacklig: "Ingen enskild tangent stack ut.",
      wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
        "Osäker betyder: den här tangenten kom minst ",
        mindestens,
        " gånger i denna ",
        wort,
        " och blev rätt mindre än ",
        prozent,
        " % av gångerna. Det säger något om denna ",
        wort,
        ", inte om hur långt du har kommit.",
      ],
      stand: (anzahl: number, schnitt: number | null) =>
        `· ${anzahl} skrivna` + (schnitt === null ? "" : `, genomsnittlig poäng ${schnitt}`),
      beschriftung: (mehrzahl: string) => `Dina ${mehrzahl}`,
      einzeln: (wort: string) => ["Varje ", wort, " för sig"],
      reihenfolge: "Den senaste först. Fäll ut en för att se de osäkra tangenterna.",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      // ${wort} bleibt im Nominativ: darum in Klammern (Glossar Regel 12), „минулого разу" trägt den Vergleich.
      bezug: (wort: string) => `минулого разу (${wort} із цими клавішами)`,
      gleich: (bezug: string) => `Бали такі самі, як ${bezug}.`,
      hoeher: (d: string, bezug: string) => `Балів більше на ${d}, ніж ${bezug}.`,
      niedriger: (d: string, bezug: string) => `Балів менше на ${d}, ніж ${bezug}.`,
      zeileWerte: (anschlaege: number, prozent: number) => [
        " ·",
        " ",
        anschlaege,
        " знаків/хв ·",
        " ",
        prozent,
        "% точності ·",
        " ",
      ],
      leistungswert: (wert: string) => `бали: ${wert}`,
      ohneWertung: "без балів",
      richtig: (richtige: number, dran: number) => [richtige, " з ", dran, " правильно"],
      keineWacklig: "Жодна окрема клавіша не вирізнилася.",
      // „за цей ${wort}": Akkusativ = Nominativ, so bleibt der Platzhalter ungebeugt.
      wackligErklaerung: (wort: string, mindestens: number, prozent: number) => [
        "Непевна означає: за цей ",
        wort,
        " ця клавіша трапилася щонайменше ",
        mehrzahl(mindestens, "uk", {
          one: (z) => `${z} раз`,
          few: (z) => `${z} рази`,
          many: (z) => `${z} разів`,
          other: (z) => `${z} раза`,
        }),
        ", і точність на ній була нижча за ",
        prozent,
        "%. Це говорить про цей ",
        wort,
        ", а не про твій поступ.",
      ],
      stand: (anzahl: number, schnitt: number | null) =>
        `· надруковано: ${anzahl}` + (schnitt === null ? "" : `, середні бали: ${schnitt}`),
      beschriftung: (mehrzahl: string) => `Твої ${mehrzahl}`,
      einzeln: (wort: string) => ["Кожен ", wort, " окремо"],
      reihenfolge: "Найновіший спочатку. Якщо розгорнути рядок, буде видно непевні клавіші.",
    },
});

/** Treffsicherheit 0..1 als ganze Prozent - dieselbe Rundung wie in der Karte. */
function prozent(anteil: number): number {
  return Math.round(Math.max(0, Math.min(1, anteil)) * 100);
}

/**
 * Der Titel des Textes, wie ihn das Kind in der Zeile liest.
 *
 * Ein Ergebnis ohne Titel ist möglich (das Feld wird beim Abgeben
 * mitgeschrieben, und ein alter Datensatz kann es nicht haben). Dann steht
 * „Text 4 von 15" da - das ist mager, aber es ist wahr, und es lässt die Zeile
 * nicht abreissen.
 */
function titelVon(e: Probenergebnis, sprache: BedienSprache = "de"): string {
  return e.textTitel.trim() || textBezeichnung(e.textNr, sprache);
}

/**
 * Der Verlauf: dieselbe Zahl, verglichen mit der vorigen Probe DESSELBEN
 * Niveaus.
 *
 * ★★★ Seit dem 10.09.2026 ist diese Zahl der LEISTUNGSWERT, nicht mehr die
 * Anschlagszahl. Grund: Die Anschläge allein können steigen, während ein Kind
 * ungenauer wird - der Satz hätte dann einen Fortschritt gemeldet, den es
 * nicht gab. Der Leistungswert fasst beides zusammen, und er ist die Zahl, die
 * auch die Wertung meint (`schreibprobeWertung.ts`).
 *
 * ⚠️ Nur dasselbe Niveau. „Grundreihe" und „Alles" sind verschiedene
 * Prüfungen; sie miteinander zu verrechnen ergäbe eine Zahl, die nichts
 * bedeutet - und sie sähe so aus, als hätte ein Kind nachgelassen, das in
 * Wahrheit gerade etwas Schwereres geschrieben hat.
 *
 * ⚠️ Und nur, wenn BEIDE Proben gewertet sind. Eine zu kurze Arbeit hat keinen
 * belastbaren Wert; sie mit einer vollen zu vergleichen ergäbe einen Rückgang,
 * der nichts über das Kind sagt. Dann steht hier lieber gar nichts.
 *
 * ⚠️ Und in keiner Richtung ein Wort dazu. „Niedriger" ist eine Tatsache;
 * „leider niedriger" wäre ein Urteil über das Kind
 * ([[feedback_nie_gegen_das_kind]]).
 */
function verlaufSatz(
  e: Probenergebnis,
  davor: Probenergebnis | null,
  sprache: BedienSprache = "de",
): string | null {
  if (!davor) return null;
  const jetzt = wertungVon(e);
  const vorher = wertungVon(davor);
  if (!jetzt.gewertet || !vorher.gewertet) return null;
  // Beide Werte sind schon auf eine Stelle gerundet; die Differenz noch einmal
  // zu runden hält das Rechenrauschen der Gleitkommazahlen aus dem Satz heraus.
  const d = Math.round((jetzt.wert - vorher.wert) * 10) / 10;
  const t = LISTE_TEXTE[sprache];
  const bezug = t.bezug(pruefungWort(sprache));
  if (d === 0) return t.gleich(bezug);
  if (d > 0) return t.hoeher(eineStelle(d, sprache), bezug);
  return t.niedriger(eineStelle(-d, sprache), bezug);
}

function ProbenZeile({
  ergebnis,
  davor,
}: {
  ergebnis: Probenergebnis;
  davor: Probenergebnis | null;
}) {
  const { sprache } = useBedienSprache();
  const t = LISTE_TEXTE[sprache];
  const niveau = niveauDef(ergebnis.niveau, lernwegVon(ergebnis));
  const verlauf = verlaufSatz(ergebnis, davor, sprache);
  const wertung = wertungVon(ergebnis);
  const richtige = (t: { dran: number; fehler: number }) => t.dran - t.fehler;

  return (
    <li className="rounded-xl border border-hairline bg-surface-sunken px-3 py-2">
      {/*
        ⚠️ Ein `<details>`, kein selbstgebauter Aufklapper: Der Kopf ist von
        sich aus mit der Tabulatortaste erreichbar, reagiert auf Leertaste und
        Eingabetaste, und Sprachausgaben sagen „zugeklappt"/„aufgeklappt" von
        selbst an. Nichts daran wird je `disabled` - es gibt hier auch nichts
        zu sperren.

        ★ Die Zusammenfassung nennt den STAND, nicht nur einen Titel: Datum,
        Niveau, Text und die zwei Zahlen stehen schon zugeklappt da. Ein
        zugeklappter Eintrag, der seinen Inhalt verschweigt, zwingt zum Öffnen
        von allem - auf einer Braillezeile ist das teuer.
      */}
      <details className="group">
        <summary className="flex cursor-pointer list-none flex-wrap items-baseline gap-x-2 gap-y-1 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
          <span aria-hidden="true" className="text-ink-muted transition group-open:rotate-90">
            ▸
          </span>
          <span>{startGeschrieben(ergebnis.beginnMs, sprache)}</span>
          {/* ★ Der Leistungswert steht in der Zeile mit - er ist die Zahl, die
              Tempo und Treffsicherheit zusammenfasst, und der Verlaufssatz
              darunter vergleicht genau sie. Ohne ihn hier stünde unten eine
              Zahl, die oben nirgends vorkommt. */}
          <span className="font-normal text-ink-soft">
            · {niveau ? niveauTexte(niveau, sprache).kurz : ergebnis.niveau} · {ergebnis.textTitel.trim() &&
            // ★ E11a-5: auch in der französischen Bedienung - dort nur, wenn der
            // Text wirklich zum Weg „de" gehört (siehe `SchreibprobeErgebnis`).
            {
              de: false,
              en: lernwegVon(ergebnis) !== "en",
              fr: lernwegVon(ergebnis) === "de",
              // es: wie "en" (ES-F2: Weg "es" ist mechanisch ein Alias von "en").
              es: lernwegVon(ergebnis) !== "es",
              // ★ O-IT (02.10.2026): wie „fr" - deutsch ist der Titel nur auf Weg „de".
              it: lernwegVon(ergebnis) === "de",
              // ★ O-PL (02.10.2026): wie „it".
              pl: lernwegVon(ergebnis) === "de",
              // ★ O-TR (02.10.2026): wie "it".
              tr: lernwegVon(ergebnis) === "de",
              // ★ O-CS (03.10.2026): wie "it" - deutsch ist der Titel nur auf Weg "de".
              cs: lernwegVon(ergebnis) === "de",
              // ★ G2-NEUN (25.10.2026): wie „cs" (die neun Wege haben noch keine eigene Bank).
              bg: lernwegVon(ergebnis) === "de",
              el: lernwegVon(ergebnis) === "de",
              hu: lernwegVon(ergebnis) === "de",
              nl: lernwegVon(ergebnis) === "de",
              pt: lernwegVon(ergebnis) === "de",
              br: lernwegVon(ergebnis) === "de",
              ro: lernwegVon(ergebnis) === "de",
              sv: lernwegVon(ergebnis) === "de",
              uk: lernwegVon(ergebnis) === "de",
            }[sprache] ? (
              // ★ EN3: Der Titel ist deutscher INHALT - für die Sprachausgabe
              // ausgezeichnet. ★ E10 (24.09.2026): NUR, wenn der Text wirklich
              // zum Lernweg „de" gehört - der englische Lehrgang hat eigene,
              // englische Titel (lernweg „en"), die keine Auszeichnung brauchen.
              <span lang="de">{titelVon(ergebnis, sprache)}</span>
            ) : (
              titelVon(ergebnis, sprache)
            )}
            {t.zeileWerte(ergebnis.anschlaege, prozent(ergebnis.genauigkeit))}
            {wertung.gewertet
              ? t.leistungswert(eineStelle(wertung.wert, sprache))
              : t.ohneWertung}
          </span>
        </summary>

        <div className="mt-2 space-y-2">
          {/*
            ★ C4 (11.09.2026): Beim Ausklappen NUR noch die wackligen Tasten -
            die Kennzahl-Zeile steht schon in der `<summary>` oben. Die volle
            `SchreibprobeErgebnis`-Karte mit ihren grossen Kacheln bleibt dem
            Abgeben selbst vorbehalten (`SchreibprobeLauf`).
          */}
          {ergebnis.wacklig.length > 0 ? (
            <ul className="m-0 list-none space-y-1 p-0 text-sm">
              {ergebnis.wacklig.map((z) => (
                <li
                  key={z.zeichen}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-hairline/60 py-1 last:border-b-0"
                >
                  <span className="font-medium text-ink">{tastenName(z.zeichen, sprache)}</span>
                  <span className="tabular-nums text-ink-soft">{t.richtig(richtige(z), z.dran)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-sm text-ink-soft">{t.keineWacklig}</p>
          )}
          <p className="m-0 text-sm text-ink-muted">
            {t.wackligErklaerung(
              pruefungWort(sprache),
              WACKLIG_MIND_DRAN,
              Math.round(WACKLIG_QUOTE * 100),
            )}
          </p>
        </div>
      </details>

      {/* Der Verlauf steht AUSSERHALB des Aufklappers - er ist der Grund, aus
          dem ein Kind diese Liste überhaupt anschaut, und hinter einer Falte
          würde er niemanden erreichen. In der Zeile oben steht er nicht: Die
          soll auf eine Braillezeile passen. */}
      {verlauf && <p className="m-0 mt-1 text-sm text-ink-muted">{verlauf}</p>}
    </li>
  );
}

/**
 * Die Liste der eigenen Schreibproben - jüngste zuerst.
 *
 * Sie lädt selbst: Sie hängt in „Meine Statistik", und die holt heute
 * Fortschritt und Ereignisse. Die Schreibproben liegen in einer eigenen
 * Sammlung; sie durch die Statistik hindurchzureichen hiesse, jedem Kind eine
 * Abfrage aufzubürden, die fast nie etwas findet.
 */
export function SchreibprobenListe({ accountId }: { accountId: string }) {
  const { sprache } = useBedienSprache();
  const t = LISTE_TEXTE[sprache];
  const [liste, setListe] = useState<Probenergebnis[] | null>(null);

  useEffect(() => {
    if (!accountId) {
      setListe([]);
      return;
    }
    let lebt = true;
    setListe(null);
    void typingBackend()
      .leseProbenergebnisse(accountId)
      .then((roh) => {
        if (!lebt) return;
        // Jüngste zuerst. Beide Backends liefern das schon so; die Reihenfolge
        // trägt hier aber den ganzen Verlauf, und eine Sortierung, die man
        // annimmt statt sie herzustellen, wird still falsch, sobald jemand die
        // Abfrage anfasst.
        setListe([...roh].sort((a, b) => b.beginnMs - a.beginnMs));
      })
      .catch(() => {
        // Kein Netz oder abgewiesen: nichts anzeigen. Eine Fehlermeldung in der
        // Statistik eines Kindes, das noch nie eine Schreibprobe geschrieben
        // hat, wäre eine Sorge über ein Nichts.
        if (lebt) setListe([]);
      });
    return () => {
      lebt = false;
    };
  }, [accountId]);

  // Noch nicht geladen oder nichts da: gar nichts. Siehe Kopf der Datei.
  if (!liste || liste.length === 0) return null;

  const uebersicht = probenUebersicht(liste);

  return (
    /*
      ★ 11.09.2026 (C4): `h3`/`h4` statt `h2`/`h3` - diese Liste steckt seither
      im `tippchallenges`-Slot von `PupilStatsPanel`, also UNTER dessen eigener
      Überschrift („Meine Statistik", h2) - genau eine Ebene tiefer wie ihre
      Geschwister (Werte im Überblick, Abzeichen, Tasten-Stand, …), siehe
      `PupilStatsPanel.tsx`.

      ★★ 19.09.2026: EINE Ausklappzeile, zu Beginn zu (Johannes: *„mach die
      Tippchallenges auch als Ausklappzeile und zu Beginn eingeklappt"*) -
      dieselbe Bauart wie Wochenziele und Steigerung im Verlauf: Die `h3`
      steht IN der `<summary>` und bleibt Sprungmarke für „h", daneben der
      Stand (wie viele, Leistungswert im Schnitt - dieselbe Rechnung wie die
      Tabelle, `probenUebersicht`). Die einzelnen Challenges darin bleiben
      eigene `<details>`.

      ⚠️ Eigene Gruppe `group/challenges`: Ein blosses `group-open:` am Pfeil
      drehte sonst mit dem Öffnen dieser Zeile auch die Pfeile aller
      einzelnen Challenges darin, obwohl die noch zu sind.
    */
    <details className="group/challenges rounded-xl border border-hairline bg-surface-raised p-3">
      <summary className="flex cursor-pointer list-none flex-wrap items-baseline gap-2 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
        <span
          aria-hidden="true"
          className="text-ink-muted transition group-open/challenges:rotate-90"
        >
          ▸
        </span>
        <h3 className="m-0 text-sm font-semibold text-ink">{pruefungWortMehrzahl(sprache)}</h3>
        <span className="font-normal text-ink-muted">
          {t.stand(uebersicht.anzahl, uebersicht.schnitt)}
        </span>
      </summary>
      <div className="mt-2 space-y-2">
        {/*
          ★ Die Übersicht (10.09.2026): dieselbe Tabelle, die die Lehrkraft beim
          Aufklappen sieht - Johannes: „das gleiche sehen auch die schüler in
          ihrer Statistik". Darunter bleibt die Liste mit der schlanken
          Auflistung und dem Verlauf.
        */}
        <SchreibprobenTabelle
          ergebnisse={liste}
          beschriftung={t.beschriftung(pruefungWortMehrzahl(sprache))}
          // ★ Das Kind liest über sich selbst - die Hinweise sagen „du".
          anrede="du"
        />
        <h4 className="m-0 pt-2 text-sm font-semibold text-ink">
          {t.einzeln(pruefungWort(sprache))}
        </h4>
        <p className="m-0 text-sm text-ink-muted">{t.reihenfolge}</p>
        <ul className="m-0 list-none space-y-2 p-0">
          {liste.map((e, i) => (
            <ProbenZeile
              key={`${e.probeId}#${e.beginnMs}`}
              ergebnis={e}
              // Die vorige Probe DESSELBEN Niveaus - die Liste ist absteigend
              // sortiert, also liegt sie weiter hinten.
              davor={liste.slice(i + 1).find((v) => v.niveau === e.niveau) ?? null}
            />
          ))}
        </ul>
      </div>
    </details>
  );
}
