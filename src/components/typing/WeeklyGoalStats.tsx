/**
 * ★★★ W3a (18.09.2026): Genaue Wochenziel-Statistik für „Tastenflow" auf dem
 * NEUEN Minuten-Modell (`wochenziel.ts`) - je Kalenderwoche Ziel-Minuten,
 * geübte Minuten, erfüllte Minuten (nach Nachholen) und erlassen/nicht, dazu
 * eine Zeile in Prozent für die ganze Geschichte und die anstehende
 * Zieländerung. Wird im Lehrer-Dashboard UND in „Meine Statistik" gezeigt
 * (Datentransparenz: das Kind sieht dasselbe) - darum PLAIN WORDS: „Ziel",
 * nie „Soll".
 *
 * ⚠️ „Insgesamt", nicht „im Schuljahr": Die Prozentzahl zählt über die GANZE
 * Geschichte des Kindes, dieselbe Rechnung wie die Spalte „Gesamt" der
 * Lehrkraft-Tabelle und die Jahreskarte (`jahreskarte.ts`) - EINE Definition
 * von „Wochenaufgaben insgesamt" im ganzen Haus statt einer dritten, nur
 * hier gültigen ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
import { mehrzahl } from "@/lib/bedienSprache";
import {
  GoalSession,
  TaskEvent,
  buildSessions,
} from "@/lib/typing";
import {
  WOCHENZIEL_GRENZE,
  anstehendeAenderung,
  kindWochenzielAusFeldern,
  wochenzielGeschichte,
  wochenStartFuerSchluessel,
  prozentAnzeige,
  type GesperrteZeit,
  type KindWochenzielFelder,
  type WochenErgebnis,
} from "@/lib/typing/wochenziel";
import { wochenzielImZeitraum } from "@/lib/typing/wochenzielZeitraum";
import { isoWeekNo, weekLabelJeSprache } from "@/lib/typing/goals";
import { wochenStart } from "@/lib/typing/wochenrhythmus";
import { GEBIET, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { istGeruestSprache } from "@/lib/typing/sprachRegister";

/**
 * ★ Die Texte der Wochenziel-Statistik in beiden Bedienungssprachen (EN3,
 * 19.09.2026). Deutsch wortgleich wie vorher; Teil-Listen, wo JSX mehrere
 * Textknoten hatte.
 *
 * Englisch nach Glossar §3.3: *weekly goal*, *goal weeks*, *catch up*,
 * *excused* (Woche erlassen), Wochen mit Datum statt Nummer allein
 * („Week 38 (w/c 14 Sept)"). „verpasst" ⇒ *not reached*: Die Tabelle sieht
 * auch das Kind ([[feedback_nie_gegen_das_kind]]) - *not reached* sagt
 * dasselbe ohne den Beiklang von „versäumt". „Einzelne Übezeiten" ⇒ *practice
 * times*: *session* ist die Unterrichtsstunde (§3.11).
 */
const WOCHEN_TEXTE = texte({
  de: {
    titel: "Wochenziele",
    keinZiel: "· kein Wochenziel gesetzt",
    erledigt: (prozent: string, ganz: number, gesamt: number) =>
      `· ${prozent} der Wochenaufgaben erledigt ` + `(in ${ganz} von ${gesamt} Wochen ganz)`,
    nochKeineWoche: "· noch keine abgeschlossene Ziel-Woche",
    neuesZiel: (text: string) => ` · Neues Ziel ${text}`,
    abMontag: (tag: string, monat: string, minuten: number) =>
      `ab Montag, ${tag}.${monat}.: ${minuten} Minuten`,
    nachholen: (minuten: number) => [
      "Zum Nachholen: ",
      minuten,
      " Minute",
      minuten === 1 ? "" : "n",
      " aus früheren Wochen.",
    ],
    tabelle: "Wochenziele je Kalenderwoche, in Minuten",
    spalteWoche: "Kalenderwoche",
    spalteStatus: "Status",
    spalteZiel: "Ziel",
    spalteGeuebt: "Geübt",
    spalteErfuellt: "Erfüllt",
    erlassen: "erlassen",
    erlassenLang: "diese Woche wurde erlassen",
    keineZielwoche: "keine Ziel-Woche",
    kommtNoch: "kommt noch",
    erreicht: "✓ erreicht",
    erreichtLang: "erreicht",
    laeuft: "läuft",
    laeuftLang: "läuft",
    verpasst: "✗ verpasst",
    verpasstLang: "verpasst",
    diese: "(diese)",
    einzelne: (n: number) => ["Einzelne Übezeiten (", n, ")"],
    keineUebungen: "Noch keine Übungen.",
    nurJuengste: (n: number) => ["(nur die ", n, " jüngsten gezeigt)"],
  },
  en: {
    titel: "Weekly goals",
    keinZiel: "· no weekly goal set",
    erledigt: (prozent: string, ganz: number, gesamt: number) =>
      `· ${prozent} of weekly goals done ` + `(met in full in ${ganz} of ${gesamt} weeks)`,
    nochKeineWoche: "· no goal week finished yet",
    neuesZiel: (text: string) => ` · New goal ${text}`,
    abMontag: (tag: string, monat: string, minuten: number) =>
      `from Monday ${tag} ${monat}: ${minuten} minutes`,
    nachholen: (minuten: number) => [
      "To catch up: ",
      minuten,
      minuten === 1 ? " minute from earlier weeks." : " minutes from earlier weeks.",
    ],
    tabelle: "Weekly goals by week, in minutes",
    spalteWoche: "Week",
    spalteStatus: "Status",
    spalteZiel: "Goal",
    spalteGeuebt: "Practised",
    spalteErfuellt: "Met",
    erlassen: "excused",
    erlassenLang: "this week was excused",
    keineZielwoche: "not a goal week",
    kommtNoch: "coming up",
    erreicht: "✓ reached",
    erreichtLang: "reached",
    laeuft: "in progress",
    laeuftLang: "in progress",
    verpasst: "✗ not reached",
    verpasstLang: "not reached",
    diese: "(this week)",
    einzelne: (n: number) => ["Individual practice times (", n, ")"],
    keineUebungen: "No practice yet.",
    nurJuengste: (n: number) => ["(only the ", n, " most recent shown)"],
  },
  fr: {
    titel: "Objectifs de la semaine",
    keinZiel: "- aucun objectif de la semaine réglé",
    erledigt: (prozent: string, ganz: number, gesamt: number) =>
      `- ${prozent} des objectifs de la semaine atteints ` + `(entièrement ${ganz} semaine${ganz === 1 ? "" : "s"} sur ${gesamt})`,
    nochKeineWoche: "- pas encore de semaine-objectif terminée",
    neuesZiel: (text: string) => ` - Nouvel objectif ${text}`,
    abMontag: (tag: string, monat: string, minuten: number) =>
      `à partir du lundi ${tag} ${monat} : ${minuten} minutes`,
    nachholen: (minuten: number) => [
      "À rattraper : ",
      minuten,
      " minute",
      minuten === 1 ? "" : "s",
      " des semaines précédentes.",
    ],
    tabelle: "Objectifs de la semaine par semaine calendaire, en minutes",
    spalteWoche: "Semaine calendaire",
    spalteStatus: "Statut",
    spalteZiel: "Objectif",
    // ★ E11a-5: „Temps d'exercice" - die Spalte trägt Minuten, kein Partizip.
    spalteGeuebt: "Temps d'exercice",
    spalteErfuellt: "Atteint",
    erlassen: "dispensée",
    erlassenLang: "cette semaine a été dispensée",
    keineZielwoche: "pas de semaine-objectif",
    kommtNoch: "à venir",
    erreicht: "✓ atteint",
    erreichtLang: "atteint",
    laeuft: "en cours",
    laeuftLang: "en cours",
    verpasst: "✗ manqué",
    verpasstLang: "manqué",
    diese: "(cette semaine)",
    einzelne: (n: number) => ["Temps d'exercice individuels (", n, ")"],
    keineUebungen: "Pas encore d'exercice.",
    nurJuengste: (n: number) => ["(seulement les ", n, " plus récents affichés)"],
  },
  // ★ ES-O (27.09.2026): liest Lehrkraft UND Kind - ohne Anrede.
  es: {
    titel: "Objetivos semanales",
    keinZiel: "- ningún objetivo semanal fijado",
    erledigt: (prozent: string, ganz: number, gesamt: number) =>
      `- ${prozent} de los objetivos semanales alcanzados ` +
      `(del todo en ${ganz} ${ganz === 1 ? "semana" : "semanas"} de ${gesamt})`,
    nochKeineWoche: "- todavía ninguna semana del objetivo terminada",
    neuesZiel: (text: string) => ` - Objetivo nuevo ${text}`,
    abMontag: (tag: string, monat: string, minuten: number) =>
      `a partir del lunes ${tag} de ${monat}: ${minuten} minutos`,
    nachholen: (minuten: number) => [
      "Por recuperar: ",
      minuten,
      minuten === 1 ? " minuto" : " minutos",
      "",
      " de semanas anteriores.",
    ],
    tabelle: "Objetivos semanales por semana, en minutos",
    spalteWoche: "Semana",
    spalteStatus: "Estado",
    spalteZiel: "Objetivo",
    spalteGeuebt: "Tiempo de práctica",
    spalteErfuellt: "Cumplido",
    erlassen: "eximida",
    erlassenLang: "esta semana se eximió",
    keineZielwoche: "no es semana del objetivo",
    kommtNoch: "por venir",
    erreicht: "✓ alcanzado",
    erreichtLang: "alcanzado",
    laeuft: "en curso",
    laeuftLang: "en curso",
    verpasst: "✗ no alcanzado",
    verpasstLang: "no alcanzado",
    diese: "(esta semana)",
    einzelne: (n: number) => ["Tiempos de práctica uno por uno (", n, ")"],
    keineUebungen: "Todavía no hay práctica.",
    nurJuengste: (n: number) => ["(solo se muestran los ", n, " más recientes)"],
  },
  // ★ O-IT (02.10.2026): „raggiunto · in corso · non raggiunto · esonerata · in arrivo" (Glossar §2.6).
  it: {
    titel: "Obiettivi settimanali",
    keinZiel: "- nessun obiettivo settimanale impostato",
    erledigt: (prozent: string, ganz: number, gesamt: number) =>
      `- ${prozent} degli obiettivi settimanali raggiunti ` +
      `(del tutto in ${ganz} ${ganz === 1 ? "settimana" : "settimane"} su ${gesamt})`,
    nochKeineWoche: "- ancora nessuna settimana con obiettivo conclusa",
    neuesZiel: (text: string) => ` - Nuovo obiettivo ${text}`,
    abMontag: (tag: string, monat: string, minuten: number) =>
      `da lunedì ${tag} ${monat}: ${minuten} minuti`,
    nachholen: (minuten: number) => [
      "Da recuperare: ",
      minuten,
      minuten === 1 ? " minuto" : " minuti",
      "",
      " delle settimane precedenti.",
    ],
    tabelle: "Obiettivi settimanali per settimana, in minuti",
    spalteWoche: "Settimana",
    spalteStatus: "Stato",
    spalteZiel: "Obiettivo",
    spalteGeuebt: "Tempo di esercizio",
    spalteErfuellt: "Raggiunto",
    erlassen: "esonerata",
    erlassenLang: "questa settimana è esonerata",
    keineZielwoche: "non è una settimana con obiettivo",
    kommtNoch: "in arrivo",
    erreicht: "✓ raggiunto",
    erreichtLang: "raggiunto",
    laeuft: "in corso",
    laeuftLang: "in corso",
    verpasst: "✗ non raggiunto",
    verpasstLang: "non raggiunto",
    diese: "(questa settimana)",
    einzelne: (n: number) => ["Tempi di esercizio uno per uno (", n, ")"],
    keineUebungen: "Ancora nessun esercizio.",
    nurJuengste: (n: number) => ["(si vedono solo i ", n, " più recenti)"],
  },
  // ★ O-PL (02.10.2026): „osiągnięty · w toku · nieosiągnięty · zwolniony ·
  // wkrótce" (Glossar §2.6) - die Adjektive gehören zu „cel"/„tydzień", nie zum
  // Kind; liest Lehrkraft UND Kind, darum ohne Anrede. Minuten als „min"
  // (beugt sich nicht), Zahlen nach Doppelpunkt (§2.10a).
  pl: {
    titel: "Cele tygodniowe",
    keinZiel: "- brak celu tygodniowego",
    erledigt: (prozent: string, ganz: number, gesamt: number) =>
      `- osiągnięto ${prozent} celów tygodniowych ` + `(cel w pełni: ${ganz} z ${gesamt} tyg.)`,
    nochKeineWoche: "- na razie brak zakończonego tygodnia z celem",
    neuesZiel: (text: string) => ` - Nowy cel ${text}`,
    abMontag: (tag: string, monat: string, minuten: number) =>
      `od poniedziałku, ${tag} ${monat}: ${minuten} min`,
    nachholen: (minuten: number) => ["Do nadrobienia z wcześniejszych tygodni: ", minuten, " min."],
    tabelle: "Cele tygodniowe według tygodni, w minutach",
    spalteWoche: "Tydzień",
    spalteStatus: "Stan",
    spalteZiel: "Cel",
    spalteGeuebt: "Czas ćwiczeń",
    spalteErfuellt: "Osiągnięte",
    erlassen: "zwolniony",
    erlassenLang: "ten tydzień jest zwolniony z celu",
    keineZielwoche: "tydzień bez celu",
    kommtNoch: "wkrótce",
    erreicht: "✓ osiągnięty",
    erreichtLang: "cel osiągnięty",
    laeuft: "w toku",
    laeuftLang: "w toku",
    verpasst: "✗ nieosiągnięty",
    verpasstLang: "cel nieosiągnięty",
    diese: "(ten tydzień)",
    einzelne: (n: number) => ["Lista ćwiczeń (", n, ")"],
    keineUebungen: "Na razie brak ćwiczeń.",
    nurJuengste: (n: number) => ["(widoczne tylko najnowsze: ", n, ")"],
  },
  // ★ O-TR (02.10.2026): ulaşıldı · sürüyor · ulaşılmadı · muaf · sırada
  // (Glossar §2.6, nie ein Wort für "gescheitert"); liest Lehrkraft UND Kind,
  // darum ohne Anrede. "Telafi: 15 dk.", "14-20 Eylül haftası" (weekLabelTr),
  // Zahlen hinter Doppelpunkt oder "toplam", keine Endung an Zahl (Regel 6).
  tr: {
    titel: "Haftalık hedefler",
    keinZiel: "- haftalık hedef yok",
    erledigt: (prozent: string, ganz: number, gesamt: number) =>
      `- tamamlanan: ${prozent} ` + `(hedefe tam ulaşılan hafta: ${ganz}, toplam ${gesamt})`,
    nochKeineWoche: "- henüz tamamlanmış hedefli hafta yok",
    neuesZiel: (text: string) => ` - Yeni hedef: ${text}`,
    abMontag: (tag: string, monat: string, minuten: number) =>
      `${tag} ${monat} Pazartesi itibarıyla ${minuten} dakika`,
    nachholen: (minuten: number) => ["Telafi: ", minuten, " dk. (önceki haftalardan)"],
    tabelle: "Haftalara göre haftalık hedefler, dakika olarak",
    spalteWoche: "Hafta",
    spalteStatus: "Durum",
    spalteZiel: "Hedef",
    spalteGeuebt: "Çalışılan",
    spalteErfuellt: "Tamamlanan",
    erlassen: "muaf",
    erlassenLang: "bu hafta muaf tutuldu",
    keineZielwoche: "hedefsiz hafta",
    kommtNoch: "sırada",
    erreicht: "✓ ulaşıldı",
    erreichtLang: "hedefe ulaşıldı",
    laeuft: "sürüyor",
    laeuftLang: "sürüyor",
    verpasst: "✗ ulaşılmadı",
    verpasstLang: "hedefe ulaşılmadı",
    diese: "(bu hafta)",
    einzelne: (n: number) => ["Tek tek çalışma süreleri (", n, ")"],
    keineUebungen: "Henüz alıştırma yok.",
    nurJuengste: (n: number) => ["(yalnızca en yeni ", n, " tanesi görünüyor)"],
  },
  // ★ O-CS (03.10.2026): splněno · probíhá · nesplněno · prominuto · teprve
  // přijde (Glossar §2.6) - Neutrum, nie am Kind; liest Lehrkraft UND Kind,
  // darum ohne Anrede. „K dohnání: 15 min", „Týden 14.-20. září" (`weekLabelCs`),
  // Zahlen nach Doppelpunkt oder mit Schrägstrich - nichts zu beugen (§2.11).
  cs: {
    titel: "Týdenní cíle",
    keinZiel: "- bez týdenního cíle",
    erledigt: (prozent: string, ganz: number, gesamt: number) =>
      `- splněno ${prozent} týdenních cílů ` + `(celý cíl splněn v týdnech: ${ganz}/${gesamt})`,
    nochKeineWoche: "- zatím žádný ukončený týden s cílem",
    neuesZiel: (text: string) => ` - Nový cíl: ${text}`,
    abMontag: (tag: string, monat: string, minuten: number) =>
      `od pondělí ${tag}. ${monat}: ${minuten} min`,
    nachholen: (minuten: number) => ["K dohnání z minulých týdnů: ", minuten, " min"],
    tabelle: "Týdenní cíle po týdnech, v minutách",
    spalteWoche: "Týden",
    spalteStatus: "Stav",
    spalteZiel: "Cíl",
    spalteGeuebt: "Nacvičeno",
    spalteErfuellt: "Splněno",
    erlassen: "prominuto",
    erlassenLang: "tento týden je prominutý",
    keineZielwoche: "týden bez cíle",
    kommtNoch: "teprve přijde",
    erreicht: "✓ splněno",
    erreichtLang: "splněno",
    laeuft: "probíhá",
    laeuftLang: "probíhá",
    verpasst: "✗ nesplněno",
    verpasstLang: "nesplněno",
    diese: "(tento týden)",
    einzelne: (n: number) => ["Jednotlivé časy cvičení (", n, ")"],
    keineUebungen: "Zatím žádné cvičení.",
    nurJuengste: (n: number) => ["(zobrazeny jen nejnovější: ", n, ")"],
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: "Седмични цели",
      keinZiel: "· няма зададена седмична цел",
      erledigt: (prozent: string, ganz: number, gesamt: number) =>
        `· изпълнени ${prozent} от седмичните цели ` + `(изцяло в ${ganz} от ${gesamt} седмици)`,
      nochKeineWoche: "· още няма завършена седмица с цел",
      neuesZiel: (text: string) => ` · Нова цел ${text}`,
      // monat kommt ohne Zahl („септември"); Glossar §2.10: „25 мин" (Abkürzung ohne Zählform).
      abMontag: (tag: string, monat: string, minuten: number) =>
        `от понеделник, ${tag} ${monat}: ${minuten} мин`,
      nachholen: (minuten: number) => [
        "За наваксване: ",
        minuten,
        minuten === 1 ? " минута от минали седмици." : " минути от минали седмици.",
      ],
      tabelle: "Седмични цели по седмици, в минути",
      spalteWoche: "Седмица",
      spalteStatus: "Състояние",
      spalteZiel: "Цел",
      spalteGeuebt: "Упражнения",
      spalteErfuellt: "Изпълнена",
      erlassen: "освободена",
      erlassenLang: "тази седмица е освободена",
      keineZielwoche: "не е седмица с цел",
      kommtNoch: "предстои",
      erreicht: "✓ изпълнена",
      erreichtLang: "изпълнена",
      laeuft: "тече",
      laeuftLang: "тече",
      verpasst: "✗ неизпълнена",
      verpasstLang: "неизпълнена",
      diese: "(тази)",
      einzelne: (n: number) => ["Отделни упражнения (", n, ")"],
      keineUebungen: "Още няма упражнения.",
      nurJuengste: (n: number) => ["(показани са само последните ", n, ")"],
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titel: "Εβδομαδιαίοι στόχοι",
      keinZiel: "· δεν έχει οριστεί εβδομαδιαίος στόχος",
      erledigt: (prozent: string, ganz: number, gesamt: number) =>
        `· ολοκληρώθηκε το ${prozent} των εβδομαδιαίων στόχων ` + `(πλήρως σε ${ganz} από ${gesamt} εβδομάδες)`,
      nochKeineWoche: "· δεν έχει ολοκληρωθεί ακόμα καμία εβδομάδα με στόχο",
      neuesZiel: (text: string) => ` · Νέος στόχος ${text}`,
      // monat kommt im Genitiv („Σεπτεμβρίου"), Wochentag groß (Glossar Regel 9).
      abMontag: (tag: string, monat: string, minuten: number) =>
        `από τη Δευτέρα ${tag} ${monat}: ${mehrzahl(minuten, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` })}`,
      nachholen: (minuten: number) => [
        "Για αναπλήρωση: ",
        minuten,
        minuten === 1 ? " λεπτό από προηγούμενες εβδομάδες." : " λεπτά από προηγούμενες εβδομάδες.",
      ],
      tabelle: "Εβδομαδιαίοι στόχοι ανά εβδομάδα, σε λεπτά",
      spalteWoche: "Εβδομάδα",
      spalteStatus: "Κατάσταση",
      spalteZiel: "Στόχος",
      spalteGeuebt: "Εξάσκηση",
      spalteErfuellt: "Ολοκληρώθηκε",
      erlassen: "απαλλαγή",
      erlassenLang: "απαλλαγή για αυτή την εβδομάδα",
      keineZielwoche: "εβδομάδα χωρίς στόχο",
      kommtNoch: "έρχεται",
      erreicht: "✓ ολοκληρώθηκε",
      erreichtLang: "ολοκληρώθηκε",
      laeuft: "σε εξέλιξη",
      laeuftLang: "σε εξέλιξη",
      verpasst: "✗ δεν ολοκληρώθηκε",
      verpasstLang: "δεν ολοκληρώθηκε",
      diese: "(αυτή η εβδομάδα)",
      einzelne: (n: number) => ["Μεμονωμένοι χρόνοι εξάσκησης (", n, ")"],
      keineUebungen: "Δεν υπάρχει ακόμα εξάσκηση.",
      nurJuengste: (n: number) => ["(εμφανίζονται μόνο οι ", n, " πιο πρόσφατοι)"],
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titel: "Heti célok",
      keinZiel: "· nincs heti cél beállítva",
      erledigt: (prozent: string, ganz: number, gesamt: number) =>
        `· teljesítés: ${prozent} ` + `(teljesen teljesített hetek: ${ganz}/${gesamt})`,
      nochKeineWoche: "· még nincs lezárt hét heti céllal",
      neuesZiel: (text: string) => ` · Új cél: ${text}`,
      abMontag: (tag: string, monat: string, minuten: number) =>
        `${minuten} perc, hétfőtől (${monat} ${tag}.)`,
      nachholen: (minuten: number) => [
        "Pótlandó: ",
        minuten,
        " perc a korábbi hetekből.",
      ],
      tabelle: "Heti célok hetenként, percben",
      spalteWoche: "Hét",
      spalteStatus: "Állapot",
      spalteZiel: "Cél",
      spalteGeuebt: "Gyakorolva",
      spalteErfuellt: "Teljesítve",
      erlassen: "elengedve",
      erlassenLang: "ez a hét elengedve",
      keineZielwoche: "nincs heti cél",
      kommtNoch: "még hátravan",
      erreicht: "✓ teljesítve",
      erreichtLang: "teljesítve",
      laeuft: "folyamatban",
      laeuftLang: "folyamatban",
      verpasst: "✗ nem teljesült",
      verpasstLang: "nem teljesült",
      diese: "(ez a hét)",
      einzelne: (n: number) => ["Egyes gyakorlási idők (", n, ")"],
      keineUebungen: "Még nincs gyakorlás.",
      nurJuengste: (n: number) => ["(csak a legutóbbi ", n, " látható)"],
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: "Weekdoelen",
      keinZiel: "· geen weekdoel ingesteld",
      erledigt: (prozent: string, ganz: number, gesamt: number) =>
        `· ${prozent} van de weekdoelen gehaald ` + `(helemaal in ${ganz} van ${gesamt} weken)`,
      nochKeineWoche: "· nog geen afgesloten week met een weekdoel",
      neuesZiel: (text: string) => ` · Nieuw doel ${text}`,
      // monat wie Intl „nl" ihn liefert („september"), ohne Punkt nach dem Tag: „maandag 21 september".
      abMontag: (tag: string, monat: string, minuten: number) =>
        `vanaf maandag ${tag} ${monat}: ${mehrzahl(minuten, "nl", { one: (z) => `${z} minuut`, other: (z) => `${z} minuten` })}`,
      nachholen: (minuten: number) => [
        "In te halen: ",
        minuten,
        minuten === 1 ? " minuut uit eerdere weken." : " minuten uit eerdere weken.",
      ],
      tabelle: "Weekdoelen per week, in minuten",
      spalteWoche: "Week",
      spalteStatus: "Status",
      spalteZiel: "Doel",
      spalteGeuebt: "Geoefend",
      spalteErfuellt: "Gehaald",
      erlassen: "vrijgesteld",
      erlassenLang: "deze week was vrijgesteld",
      keineZielwoche: "geen week met een weekdoel",
      kommtNoch: "volgt nog",
      erreicht: "✓ gehaald",
      erreichtLang: "gehaald",
      laeuft: "bezig",
      laeuftLang: "bezig",
      verpasst: "✗ niet gehaald",
      verpasstLang: "niet gehaald",
      diese: "(deze week)",
      einzelne: (n: number) => ["Afzonderlijke oefentijden (", n, ")"],
      keineUebungen: "Nog niet geoefend.",
      nurJuengste: (n: number) => ["(alleen de ", n, " nieuwste getoond)"],
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: "Objetivos semanais",
      keinZiel: "· nenhum objetivo semanal definido",
      erledigt: (prozent: string, ganz: number, gesamt: number) =>
        `· ${prozent} dos objetivos semanais cumpridos ` + `(totalmente em ${ganz} de ${gesamt} semanas)`,
      nochKeineWoche: "· ainda nenhuma semana com objetivo concluída",
      neuesZiel: (text: string) => ` · Novo objetivo ${text}`,
      abMontag: (tag: string, monat: string, minuten: number) =>
        `a partir de segunda-feira, ${tag} de ${monat}: ` +
        mehrzahl(minuten, "pt", {
          one: (z) => `${z} minuto`,
          other: (z) => `${z} minutos`,
          many: (z) => `${z} de minutos`,
        }),
      nachholen: (minuten: number) => [
        "Por recuperar: ",
        minuten,
        minuten === 1 ? " minuto de semanas anteriores." : " minutos de semanas anteriores.",
      ],
      tabelle: "Objetivos semanais por semana, em minutos",
      spalteWoche: "Semana",
      spalteStatus: "Estado",
      spalteZiel: "Objetivo",
      spalteGeuebt: "Praticado",
      spalteErfuellt: "Cumprido",
      erlassen: "dispensada",
      erlassenLang: "esta semana foi dispensada",
      keineZielwoche: "semana sem objetivo",
      kommtNoch: "ainda por vir",
      erreicht: "✓ cumprido",
      erreichtLang: "cumprido",
      laeuft: "em curso",
      laeuftLang: "em curso",
      verpasst: "✗ não cumprido",
      verpasstLang: "não cumprido",
      diese: "(esta semana)",
      einzelne: (n: number) => ["Tempos de prática individuais (", n, ")"],
      keineUebungen: "Ainda não há prática.",
      nurJuengste: (n: number) => ["(só são mostrados os ", n, " mais recentes)"],
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titel: "Metas semanais",
      keinZiel: "· nenhuma meta semanal definida",
      erledigt: (prozent: string, ganz: number, gesamt: number) =>
        `· ${prozent} das metas semanais cumpridas ` + `(cumpridas por inteiro em ${ganz} de ${gesamt} semanas)`,
      nochKeineWoche: "· nenhuma semana com meta concluída ainda",
      neuesZiel: (text: string) => ` · Nova meta ${text}`,
      // monat kommt ohne Zahl und ohne „de" („setembro"); Kurzform „min" (Glossar §2.10) - kein Mehrzahl-Problem bei 1.
      abMontag: (tag: string, monat: string, minuten: number) =>
        `a partir de segunda-feira, ${tag} de ${monat}: ${minuten} min`,
      nachholen: (minuten: number) => [
        "Para recuperar: ",
        minuten,
        minuten === 1 ? " minuto das semanas anteriores." : " minutos das semanas anteriores.",
      ],
      tabelle: "Metas semanais por semana, em minutos",
      spalteWoche: "Semana",
      spalteStatus: "Situação",
      spalteZiel: "Meta",
      spalteGeuebt: "Praticado",
      spalteErfuellt: "Cumprida",
      erlassen: "dispensada",
      erlassenLang: "esta semana foi dispensada",
      keineZielwoche: "semana sem meta",
      kommtNoch: "a seguir",
      erreicht: "✓ cumprida",
      erreichtLang: "cumprida",
      laeuft: "em andamento",
      laeuftLang: "em andamento",
      verpasst: "✗ não cumprida",
      verpasstLang: "não cumprida",
      diese: "(esta semana)",
      einzelne: (n: number) => ["Tempos de prática individuais (", n, ")"],
      keineUebungen: "Nenhuma prática ainda.",
      nurJuengste: (n: number) => ["(só as ", n, " mais recentes)"],
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titel: "Obiective săptămânale",
      keinZiel: "· niciun obiectiv săptămânal stabilit",
      erledigt: (prozent: string, ganz: number, gesamt: number) =>
        `· ${prozent} din sarcinile săptămânale îndeplinite ` + `(săptămâni complete: ${ganz} din ${gesamt})`,
      nochKeineWoche: "· încă nicio săptămână cu obiectiv încheiată",
      neuesZiel: (text: string) => ` · Obiectiv nou ${text}`,
      abMontag: (tag: string, monat: string, minuten: number) =>
        `de luni, ${tag} ${monat}: ${minuten} min`,
      nachholen: (minuten: number) => [
        "De recuperat: ",
        minuten,
        " min din săptămânile anterioare.",
      ],
      tabelle: "Obiective săptămânale pe săptămâni, în minute",
      spalteWoche: "Săptămâna",
      spalteStatus: "Stare",
      spalteZiel: "Obiectiv",
      spalteGeuebt: "Exersat",
      spalteErfuellt: "Îndeplinit",
      erlassen: "scutit",
      erlassenLang: "această săptămână a fost scutită",
      keineZielwoche: "nu e săptămână cu obiectiv",
      kommtNoch: "urmează",
      erreicht: "✓ atins",
      erreichtLang: "atins",
      laeuft: "în curs",
      laeuftLang: "în curs",
      verpasst: "✗ neatins",
      verpasstLang: "neatins",
      diese: "(săptămâna aceasta)",
      einzelne: (n: number) => ["Timpi de exersare individuali (", n, ")"],
      keineUebungen: "Încă niciun exercițiu.",
      nurJuengste: (n: number) => ["(se văd doar cele mai recente: ", n, ")"],
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: "Veckomål",
      keinZiel: "· inget veckomål satt",
      erledigt: (prozent: string, ganz: number, gesamt: number) =>
        `· ${prozent} av veckomålen uppnått ` + `(helt uppnått under ${ganz} av ${gesamt} veckor)`,
      nochKeineWoche: "· ingen avslutad vecka med mål än",
      neuesZiel: (text: string) => ` · Nytt mål ${text}`,
      abMontag: (tag: string, monat: string, minuten: number) =>
        `från måndag ${tag} ${monat}: ${minuten} minuter`,
      nachholen: (minuten: number) => [
        "Att ta igen: ",
        minuten,
        minuten === 1 ? " minut från tidigare veckor." : " minuter från tidigare veckor.",
      ],
      tabelle: "Veckomål per vecka, i minuter",
      spalteWoche: "Vecka",
      spalteStatus: "Status",
      spalteZiel: "Mål",
      spalteGeuebt: "Övat",
      spalteErfuellt: "Uppnått",
      erlassen: "undantagen",
      erlassenLang: "den här veckan var undantagen",
      keineZielwoche: "ingen vecka med mål",
      kommtNoch: "kommer senare",
      erreicht: "✓ uppnått",
      erreichtLang: "uppnått",
      laeuft: "pågår",
      laeuftLang: "pågår",
      verpasst: "✗ inte uppnått",
      verpasstLang: "inte uppnått",
      diese: "(den här veckan)",
      einzelne: (n: number) => ["Enskilda övningstider (", n, ")"],
      keineUebungen: "Inga övningar än.",
      nurJuengste: (n: number) => ["(bara de ", n, " senaste visas)"],
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titel: "Тижневі мети",
      keinZiel: "· тижневу мету не встановлено",
      erledigt: (prozent: string, ganz: number, gesamt: number) =>
        `· виконано ${prozent} тижневої мети ` + `(тижні з повністю досягнутою метою: ${ganz}/${gesamt})`,
      nochKeineWoche: "· ще немає завершеного тижня з метою",
      neuesZiel: (text: string) => ` · Нова мета ${text}`,
      // monat kommt ohne Zahl im Genitiv („вересня"); „хв" beugt sich nicht (Glossar §2.10).
      abMontag: (tag: string, monat: string, minuten: number) =>
        `з понеділка, ${tag} ${monat}: ${minuten} хв`,
      nachholen: (minuten: number) => [
        "Для надолуження: ",
        mehrzahl(minuten, "uk", {
          one: (z) => `${z} хвилина`,
          few: (z) => `${z} хвилини`,
          many: (z) => `${z} хвилин`,
          other: (z) => `${z} хвилини`,
        }),
        " із попередніх тижнів.",
      ],
      tabelle: "Тижневі мети по тижнях, у хвилинах",
      spalteWoche: "Тиждень",
      spalteStatus: "Стан",
      spalteZiel: "Мета",
      spalteGeuebt: "Тренування",
      spalteErfuellt: "Виконано",
      erlassen: "звільнено",
      erlassenLang: "цього тижня звільнено від мети",
      keineZielwoche: "тиждень без мети",
      kommtNoch: "попереду",
      erreicht: "✓ досягнуто",
      erreichtLang: "досягнуто",
      laeuft: "триває",
      laeuftLang: "триває",
      verpasst: "✗ не досягнуто",
      verpasstLang: "не досягнуто",
      diese: "(цей)",
      einzelne: (n: number) => ["Окремі тренування (", n, ")"],
      keineUebungen: "Вправ ще немає.",
      nurJuengste: (n: number) => ["(показано лише останні: ", n, ")"],
    },
});

// ★ O2-COMP (30.10.2026): bg eigene Fassung.
// ★ O2-COMP (29.10.2026): bulgarisch „25 мин", „1 ч 5 мин" - Abkürzungen ohne Punkt,
// Zahl und Einheit mit geschütztem Leerzeichen U+00A0 (Glossar Regel 5, §2.10).
function fmtMinBg(m: number): string {
  return m < 60 ? `${m} мин` : `${Math.floor(m / 60)} ч ${m % 60} мин`;
}

// ★ O2-COMP (30.10.2026): el eigene Fassung.
/**
 * ★ O2-COMP el: „25 λεπτά", „1 ώρα 5 λεπτά" - ausgeschrieben, nicht „λεπ."/„ώρ."
 * (Glossar §2.10 Dauer: die Sprachausgabe liest die Abkürzungen schlecht).
 */
function fmtMinEl(m: number): string {
  const lepta = (n: number) => (n === 1 ? `${n} λεπτό` : `${n} λεπτά`);
  if (m < 60) return lepta(m);
  const h = Math.floor(m / 60);
  return `${h} ${h === 1 ? "ώρα" : "ώρες"} ${lepta(m % 60)}`;
}

// ★ O2-COMP (30.10.2026): hu eigene Fassung.
// ★ O2-COMP hu: „25 min", „1 ó 5 min" (Glossar §2.10 Dauer, Kurzform; ó = óra).
function fmtMinHu(m: number): string {
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} ó ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): nl eigene Fassung.
// Glossar §2.10: „25 min", „1 u 5 min" („u" für Stunde in Tabellen, ohne Punkt).
function fmtMinNl(m: number): string {
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} u ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): pt eigene Fassung.
function fmtMinPt(m: number): string {
  // ★ pt-PT: „25 min", „1 h 5 min" - Abkürzungen ohne Punkt (Glossar §2.10).
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): br eigene Fassung.
function fmtMinBr(m: number): string {
  // ★ O2-COMP (29.10.2026): „25 min", „1 h 5 min" - Einheiten ohne Punkt, ohne Mehrzahl-s (Glossar §2.10).
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): ro eigene Fassung.
function fmtMinRo(m: number): string {
  // ★ O2-COMP-RO: „25 min", „1 h 5 min" - Abkürzungen ohne Punkt (Glossar §2.10).
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): sv eigene Fassung.
function fmtMinSv(m: number): string {
  // O2-COMP sv: „25 min", „1 h 5 min" - Zeichen ohne Punkt (Glossar §2.10 Dauer).
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): uk eigene Fassung.
// ★ O2-COMP (30.10.2026): ukrainisch „25 хв", „1 год 5 хв" - Abkürzungen ohne Punkt
// beugen sich nicht (Glossar uk §2.10, wie fmtDauerUk).
function fmtMinUk(m: number): string {
  return m < 60 ? `${m} хв` : `${Math.floor(m / 60)} год ${m % 60} хв`;
}

function fmtMin(min: number, sprache: BedienSprache = "de"): string {
  const m = Math.round(min);
  // ★ O-CS (03.10.2026): „25 min", „1 h 5 min" - Abkürzungen ohne Punkt (Glossar §2.10).
  if (sprache === "bg") return fmtMinBg(m);
  if (sprache === "el") return fmtMinEl(m);
  if (sprache === "hu") return fmtMinHu(m);
  if (sprache === "nl") return fmtMinNl(m);
  if (sprache === "pt") return fmtMinPt(m);
  if (sprache === "br") return fmtMinBr(m);
  if (sprache === "ro") return fmtMinRo(m);
  if (sprache === "sv") return fmtMinSv(m);
  if (sprache === "uk") return fmtMinUk(m);
  if (sprache === "cs") return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
  // ★ O-TR (02.10.2026): "25 dk.", "1 sa. 5 dk." (Glossar §2.10).
  if (sprache === "tr") return m < 60 ? `${m} dk.` : `${Math.floor(m / 60)} sa. ${m % 60} dk.`;
  // ★ O-PL (02.10.2026): „25 min", „1 godz. 5 min" (Glossar §2.10).
  if (sprache === "pl") return m < 60 ? `${m} min` : `${Math.floor(m / 60)} godz. ${m % 60} min`;
  // ★ EN3: englisch „25 min" / „1 h 5 min" (Glossar §1.2).
  // ★ E11a-5: französisch dieselbe Kurzform („25 min", „1 h 5 min").
  // ★ O-IT (02.10.2026): italienisch dieselbe Kurzform.
  if (sprache === "en" || sprache === "fr" || sprache === "es" || sprache === "it")
    return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
  if (m < 60) return `${m} Min.`;
  return `${Math.floor(m / 60)} Std. ${m % 60} Min.`;
}

/**
 * ★ O2-COMP (30.10.2026): die Woche einer Tabellenzeile. Für die neun Sprachen hier, nach dem Wort der eigenen Spalte und
 * dem Gebiet der Sprache („Седмица 38 (14 септ.)"): `weekLabelJeSprache` (goals.ts) führt sie noch nicht und schriebe
 * „Week 38 (w/c 14 Sept)".
 */
function wochenName(montagMs: number, sprache: BedienSprache): string {
  if (!istGeruestSprache(sprache)) return weekLabelJeSprache(montagMs, sprache);
  const tag = new Date(montagMs).toLocaleDateString(GEBIET[sprache], { day: "numeric", month: "short" });
  return `${WOCHEN_TEXTE[sprache].spalteWoche} ${isoWeekNo(montagMs)} (${tag})`;
}

function fmtSessionDate(ms: number, sprache: BedienSprache = "de"): string {
  // ★ O2-COMP (30.10.2026): die neun Sprachen nach ihrem Gebiet, immer 24 Stunden
  // (el schriebe sonst „π.μ."/„μ.μ.").
  if (istGeruestSprache(sprache))
    return new Date(ms).toLocaleString(GEBIET[sprache], {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  // ★ O-CS (03.10.2026): „po 14. 9. 8:05" (Intl cs-CZ, gemessen; Wochentag klein,
  // Datum in Ziffern, 24 Stunden ohne führende Null - Glossar §2.10).
  if (sprache === "cs")
    return new Date(ms).toLocaleString("cs-CZ", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  // ★ O-TR (02.10.2026): "14 Eyl Pzt, 08:05" - Wochentag NACH dem Datum (Intl
  // tr-TR), Uhrzeit 24 Stunden von Hand dahinter (Glossar §2.10).
  if (sprache === "tr") {
    const d = new Date(ms);
    const tag = d.toLocaleDateString("tr-TR", { day: "numeric", month: "short", weekday: "short" });
    return `${tag}, ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
  // ★ O-PL (02.10.2026): „pon., 14 wrz, 08:05" (Intl pl-PL, 24 Stunden).
  if (sprache === "pl")
    return new Date(ms).toLocaleString("pl-PL", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  // ★ O-IT (02.10.2026): „lun 14 set, 08:05".
  if (sprache === "it")
    return new Date(ms).toLocaleString("it-IT", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  // ★ E11a-5: französisch „lun. 14 sept., 8 h 05" - Datum mit Monatsnamen,
  // Uhrzeit von Hand (Bauplan §9.1: „14 h 30", nie „14:30").
  if (sprache === "fr") {
    const d = new Date(ms);
    const tag = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
    return `${tag}, ${d.getHours()} h ${pad2(d.getMinutes())}`;
  }
  // ★ ES-O (27.09.2026): „lun, 14 sept, 08:05" - vorher still Deutsch.
  if (sprache === "es")
    return new Date(ms).toLocaleString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  // ★ EN3: englisch „Mon 14 Sept, 08:05" (Glossar §1.2, 24 Stunden).
  if (sprache === "en")
    return new Date(ms).toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  return new Date(ms).toLocaleString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * „ab Montag, 21.09.: 60 Minuten" - die anstehende Zieländerung, kurz (nicht
 * die lange Popup-Erklärung aus `zielAenderungsText`, die gehört auf den
 * Knopf, der sie AUSLÖST, nicht in diese stille Zusammenfassung).
 */
function anstehendeAenderungText(
  abschnitt: { ab: string; minuten: number },
  sprache: BedienSprache = "de",
): string | null {
  const montag = wochenStartFuerSchluessel(abschnitt.ab);
  if (montag === undefined) return null;
  const d = new Date(montag);
  // ★ O2-COMP (30.10.2026): der Monat so, wie Intl ihn NACH einem Tag schreibt (el, uk im Genitiv),
  // ohne die Zahl - darum aus den Teilen, nicht geschnitten.
  if (istGeruestSprache(sprache)) {
    const monat = new Intl.DateTimeFormat(GEBIET[sprache], { day: "numeric", month: "long" })
      .formatToParts(d)
      .find((teil) => teil.type === "month")?.value;
    return WOCHEN_TEXTE[sprache].abMontag(String(d.getDate()), monat ?? "", Math.round(abschnitt.minuten));
  }
  // ★ O-CS (03.10.2026): „od pondělí 21. září: 60 min" - der Monat im GENITIV,
  // darum aus dem Datum mit Tag geschnitten (Intl allein liefert „září"/„říjen",
  // Glossar §4 Falle 7).
  if (sprache === "cs")
    return WOCHEN_TEXTE.cs.abMontag(
      String(d.getDate()),
      d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long" }).replace(/^\d+\.\s/, ""),
      Math.round(abschnitt.minuten),
    );
  // ★ O-TR (02.10.2026): "21 Eylül Pazartesi itibarıyla 60 dakika" - Wochentag
  // NACH dem Datum, die Endung an "itibar", nie an der Zahl (Glossar §2.10, Regel 6).
  if (sprache === "tr")
    return WOCHEN_TEXTE.tr.abMontag(
      String(d.getDate()),
      d.toLocaleDateString("tr-TR", { month: "long" }),
      Math.round(abschnitt.minuten),
    );
  // ★ O-PL (02.10.2026): „od poniedziałku, 21 września: 60 min" - der Monat im
  // GENITIV, darum aus dem Datum mit Tag geschnitten (Intl allein liefert
  // „wrzesień", Glossar §2.10).
  if (sprache === "pl")
    return WOCHEN_TEXTE.pl.abMontag(
      String(d.getDate()),
      d.toLocaleDateString("pl-PL", { day: "numeric", month: "long" }).replace(/^\d+\s/, ""),
      Math.round(abschnitt.minuten),
    );
  // ★ EN3: englisch „from Monday 21 September: 60 minutes" (Glossar §1.2/§3.3).
  // ★ E11a-5: französisch „à partir du lundi 21 septembre : 60 minutes" -
  // vorher fiel „fr" still auf die deutsche Tabelle (Falle 30).
  if (sprache === "fr")
    return WOCHEN_TEXTE.fr.abMontag(
      String(d.getDate()),
      d.toLocaleDateString("fr-FR", { month: "long" }),
      Math.round(abschnitt.minuten),
    );
  // ★ O-IT (02.10.2026): „da lunedì 21 settembre: 60 minuti".
  if (sprache === "it")
    return WOCHEN_TEXTE.it.abMontag(
      String(d.getDate()),
      d.toLocaleDateString("it-IT", { month: "long" }),
      Math.round(abschnitt.minuten),
    );
  if (sprache === "es")
    return WOCHEN_TEXTE.es.abMontag(
      String(d.getDate()),
      d.toLocaleDateString("es-ES", { month: "long" }),
      Math.round(abschnitt.minuten),
    );
  if (sprache === "en")
    return WOCHEN_TEXTE.en.abMontag(
      String(d.getDate()),
      d.toLocaleDateString("en-GB", { month: "long" }),
      Math.round(abschnitt.minuten),
    );
  return WOCHEN_TEXTE.de.abMontag(
    pad2(d.getDate()),
    pad2(d.getMonth() + 1),
    Math.round(abschnitt.minuten),
  );
}

export function WeeklyGoalStats({
  events,
  pupil,
  gesperrt = [],
  flach = false,
}: {
  events: TaskEvent[];
  /** Die Rohfelder des Kindes, aus denen {@link kindWochenzielAusFeldern} das Wochenziel liest. */
  pupil: KindWochenzielFelder;
  /** ★ Die gesperrten Zeiten der Klasse - siehe `wochenziel.ts` „Eine Stunde sperren". */
  gesperrt?: readonly GesperrteZeit[];
  /**
   * ★ R6 (11.09.2026, `BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md`): OHNE
   * eigenen Rahmen - in der aufgeklappten Zeile eines Kindes bei der Lehrkraft.
   * Dort ist die Zeile selbst schon der Abschnitt; ein Kasten darin war die
   * vierte Ebene Kasten in Kasten. Statt des Rahmens trennt eine Haarlinie, und
   * die Aufklapp-Zeile ist mindestens 36 px hoch wie jede andere der Seite (R7).
   * Johannes: *„bitte gestalte diese wichtige seite richtig ansprechend
   * übersichtlich und schlank"*. Die eigene Statistik des Kindes behält den Kasten.
   */
  flach?: boolean;
}) {
  const { sprache } = useBedienSprache();
  const t = WOCHEN_TEXTE[sprache];
  const jetztMs = Date.now();
  const ziel = kindWochenzielAusFeldern(pupil);
  const goalSet = ziel.verlauf.length > 0;

  // Alle Sitzungen chronologisch (einzelne Übezeiten) - unabhängig vom Ziel.
  const alleSitzungen: GoalSession[] = buildSessions(events);
  const sessions = [...alleSitzungen].reverse().slice(0, 30);

  // Der volle Wochen-Bericht - Grundlage für die Tabelle UND die anstehende Änderung.
  const bericht: WochenErgebnis[] = goalSet
    ? wochenzielGeschichte(events, ziel, jetztMs, gesperrt)
    : [];
  const laufendeWoche = wochenStart(jetztMs, WOCHENZIEL_GRENZE);
  // Nur Wochen mit Bezug zeigen: Ziel-Wochen + Wochen mit Übung.
  const rows = bericht.filter((w) => w.zielwoche || w.geuebt > 0);

  // ★ Dieselbe Rechnung wie die Spalte „Gesamt" der Lehrkraft-Tabelle
  // (`wochenzielImZeitraum`) - EINE Definition von „insgesamt", siehe Kopf-Kommentar.
  const gesamtstand = goalSet
    ? wochenzielImZeitraum(events, ziel, gesperrt, { art: "gesamt", wochenVersatz: 0 }, jetztMs)
    : null;

  // Nachholen - offene Minuten aus FRÜHEREN Ziel-Wochen (Abnahme 18.09.2026:
  // die laufende Woche ist noch nicht versäumt, sie zählte hier nicht mit -
  // dieselbe Grenze wie die Zahl „Min. Vorwochen" in der Lehrkraft-Tabelle).
  const offenGesamt = bericht
    .filter((w) => w.zielwoche && w.startMs < laufendeWoche)
    .reduce((sum, w) => sum + w.offen, 0);

  const anstehend = goalSet ? anstehendeAenderung(ziel.verlauf, jetztMs) : null;
  const anstehendText = anstehend ? anstehendeAenderungText(anstehend, sprache) : null;

  return (
    /*
      ⚠️ Ein `<details>`, kein selbstgebauter Aufklapper (C1, 11.09.2026,
      Vorbild: der Wochenziel-Kasten der Klasse in `TastenflowReiter.tsx`).
      Zugeklappt, weil ein Wochenziel selten geändert wird - genau wie dort.

      ★ Die Zusammenfassung nennt den STAND, nicht nur den Titel: Wer sie
      liest, weiss ohne Aufklappen, ob überhaupt ein Ziel gesetzt ist und ob es
      erreicht wird.
    */
    <details
      className={
        // ★ R6 (11.09.2026): `flach` - Haarlinie statt Rahmen, siehe Eigenschaft.
        // `pt-1` und nicht `pt-3`: Die 36 px hohe Zeile zentriert ihren Text
        // selbst - so steht er wie jede Überschrift 12 px unter der Linie.
        flach
          ? "group border-t border-hairline pt-1"
          : "group rounded-xl border border-hairline bg-surface-raised p-3"
      }
    >
      <summary
        className={
          "flex cursor-pointer list-none flex-wrap gap-2 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent " +
          (flach ? "min-h-9 content-center items-center" : "items-baseline")
        }
      >
        <span aria-hidden="true" className="text-ink-muted transition group-open:rotate-90">
          ▸
        </span>
        {/*
          ★★★ DIE ÜBERSCHRIFT BLEIBT (Prüfung E4, 11.09.2026). Der Kasten ist
          seit C1 ein `<details>` - der Titel darf deshalb NICHT zu blossem
          Text werden: Wer mit der Screenreader-Taste „h" durch die Statistik
          springt, käme an „Wochenziele" sonst gar nicht mehr vorbei
          ([[feedback_fokus_pflicht_alle_apps]], §0.5 der Fokusziele). Eine
          Überschrift IN der `<summary>` ist erlaubt (HTML: „phrasing content,
          optionally intermixed with heading content") und lässt der
          Zusammenfassung ihre Schaltfläche samt „zu"/„auf"-Ansage.
        */}
        <h3 className="m-0 text-sm font-semibold text-ink">{t.titel}</h3>
        {/*
          ★ W3a: Prozent statt Einheiten - „87 % der Wochenaufgaben erledigt
          (in 5 von 7 Wochen ganz)" statt „erledigt 78 / 90 Aufgaben". Plain
          words: „Ziel", nie „Soll".
        */}
        <span className="font-normal text-ink-muted">
          {!goalSet
            ? t.keinZiel
            : gesamtstand?.art === "prozent" && gesamtstand.anteil !== null
              ? t.erledigt(
                  prozentAnzeige(gesamtstand.anteil, sprache),
                  gesamtstand.wochenGanz,
                  gesamtstand.wochenGesamt,
                )
              : t.nochKeineWoche}
          {anstehendText ? t.neuesZiel(anstehendText) : ""}
        </span>
      </summary>

      <div className="mt-2 space-y-2">

      {goalSet && ziel.nachholen && offenGesamt > 0 && (
        // ★ Abnahme 18.09.2026: ohne Warnzeichen und ohne Warnfarbe - dieses
        // Bauteil sieht auch das KIND ([[feedback_nie_gegen_das_kind]]).
        <p className="m-0 mb-2 text-sm text-ink">{t.nachholen(Math.round(offenGesamt))}</p>
      )}

      {goalSet && rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">{t.tabelle}</caption>
            <thead>
              <tr className="text-center text-ink-muted">
                <th scope="col" className="py-1 pr-3">
                  {t.spalteWoche}
                </th>
                <th scope="col" className="pr-3">
                  {t.spalteStatus}
                </th>
                <th scope="col" className="pr-3">
                  {t.spalteZiel}
                </th>
                <th scope="col" className="pr-3">
                  {t.spalteGeuebt}
                </th>
                <th scope="col">{t.spalteErfuellt}</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {rows.map((w) => {
                const isCurrent = w.startMs === laufendeWoche;
                const isFuture = w.startMs > laufendeWoche;
                const status = w.erlassen
                  ? { t: t.erlassen, c: "text-ink-muted", l: t.erlassenLang }
                  : !w.zielwoche
                    ? { t: "-", c: "text-ink-muted", l: t.keineZielwoche }
                    : isFuture
                      ? { t: "·", c: "text-ink-muted", l: t.kommtNoch }
                      : w.offen === 0
                        ? { t: t.erreicht, c: "text-success", l: t.erreichtLang }
                        : isCurrent
                          ? { t: t.laeuft, c: "text-warning", l: t.laeuftLang }
                          : { t: t.verpasst, c: "text-danger", l: t.verpasstLang };
                return (
                  <tr
                    key={w.woche}
                    className={
                      "border-t border-hairline/60 " +
                      (isCurrent ? "bg-accent-soft/40" : "")
                    }
                  >
                    <th scope="row" className="py-1 pr-3 font-normal text-ink">
                      {wochenName(w.startMs, sprache)}
                      {isCurrent && <span className="ml-1 text-sm text-accent">{t.diese}</span>}
                    </th>
                    <td className={"pr-3 font-medium " + status.c}>
                      <span aria-hidden="true">{status.t}</span>
                      <span className="sr-only">{status.l}</span>
                    </td>
                    <td className="pr-3 text-ink">{w.zielwoche ? fmtMin(w.ziel, sprache) : "-"}</td>
                    <td className="pr-3 text-ink-soft">{fmtMin(w.geuebt, sprache)}</td>
                    <td className="text-ink-soft">{w.zielwoche ? fmtMin(w.erfuellt, sprache) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Einzelne Übezeiten (Sitzungen).
          ★ `min-h-9` (11.09.2026, Bauplan „Klassenseite einheitlich" R7): Die
          Aufklappzeile war 20 px hoch - die einzige Bedienzeile im aufgeklappten
          Kind, die aus der 36-px-Reihe fiel (im Browser gemessen). */}
      <details className="mt-2">
        <summary className="flex min-h-9 cursor-pointer items-center text-sm text-ink-soft">
          {t.einzelne(alleSitzungen.length)}
        </summary>
        {sessions.length === 0 ? (
          <p className="m-0 mt-1 text-sm text-ink-muted">{t.keineUebungen}</p>
        ) : (
          <ul className="m-0 mt-1 list-none space-y-1 p-0 text-sm">
            {sessions.map((s, i) => (
              <li
                key={i}
                className="flex justify-between gap-2 border-b border-hairline/50 pb-1"
              >
                <span className="text-ink">{fmtSessionDate(s.startMs, sprache)}</span>
                <span className="text-ink-soft">{fmtMin(s.minutes, sprache)}</span>
              </li>
            ))}
          </ul>
        )}
        {alleSitzungen.length > sessions.length && (
          <p className="m-0 mt-1 text-sm text-ink-muted">{t.nurJuengste(sessions.length)}</p>
        )}
      </details>
      </div>
    </details>
  );
}
