/**
 * ════════════════════════════════════════════════════════════════════════════
 * DIE JAHRESKARTE EINES KINDES
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ★★★ Johannes am 31.08.2026, wörtlich: *„das sind Werte, auf die ein Lehrer
 * dann seine Note bauen kann, nicht die App!"* Hier steht darum keine Note,
 * keine Punktzahl und keine Einstufung - drei Werte, ihre Steigerung und die
 * Zeile, die offenlegt, woraus sie entstanden sind.
 *
 * Vorschlag Ü4 (§4.3) gab der KLASSE bis K3 (19.09.2026) dieselbe Bauform.
 * Seither hat die Klasse ihren eigenen, schlanken Überblick über der Tabelle
 * (`Klassenueberblick.tsx`, Monat | Schuljahr, Liniendiagramm); diese Karte
 * steht nur noch in der aufgeklappten Zeile eines Kindes. Von der Klassen-
 * Fassung geblieben sind die vier Topf-Zahlen ({@link TopfZahlen}) - der
 * Überblick liest sie als unsichtbare Beschriftung seiner Score-Leiste.
 *
 * ── ⚠️ JEDE ANGABE STEHT ALS TEXT DA, NICHT ALS BILD ───────────────────────
 * Diese Plattform hat Lehrkräfte mit Blindheit. Eine Zusammenfassung, die man
 * ansehen muss, ist für sie keine. Deshalb:
 *  • Die drei Werte sind eine Beschreibungsliste (`<dl>`), keine Grafik.
 *  • Die Punktleiste der Klasse trägt die vier Topf-Zahlen als Text; sie
 *    ersetzen das Bild vollständig.
 *  • Farbe ist nie der einzige Träger einer Aussage.
 */
import { useId } from "react";
import { Tipp } from "@/components/Tipp";
import {
  SCORE_TOEPFE,
  topfLabel,
  type Bezug,
  type Jahreskarte as JahreskarteWerte,
} from "@/lib/typing/jahreskarte";
import { prozentAnzeige } from "@/lib/typing/wochenziel";
import { fmtTagMonat } from "@/lib/typing/datum";
import { schuljahrLabelCs } from "@/lib/typing/zeitraum";
import { GEBIET, mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { istGeruestSprache } from "@/lib/typing/sprachRegister";

/**
 * Die Jahreskarte in beiden Bedienungssprachen (EN3, 19.09.2026). Deutsch
 * wortgleich wie vorher. Glossar §3.2: Vorwoche ⇒ *previous week*, Schuljahr
 * ⇒ *school year*, Anschläge ⇒ *keystrokes*, „um 3 Prozent gesunken" meint
 * Prozentpunkte ⇒ *percentage points*; Wochenaufgaben ⇒ *weekly goals*
 * (§3.3). Die Karte liest die Lehrkraft - sachlich, ohne Wertung (*up* /
 * *down*, nie *better* / *worse*).
 */
const KARTE_TEXTE = texte({
  de: {
    unveraendert: (einheit: string) => `unverändert (${einheit})`,
    gesteigert: (n: number, einheit: string) => `um ${n} ${einheit} gesteigert`,
    gesunken: (n: number, einheit: string) => `um ${n} ${einheit} gesunken`,
    anschlaege: (_n: number) => "Anschläge",
    prozent: (_n: number) => "Prozent",
    personen: (n: number) => [n, " ", n === 1 ? "Person" : "Personen"],
    bezugStart: "gegenüber dem Schuljahresbeginn",
    bezugVorwoche: "gegenüber der Vorwoche",
    kopf: (titel: string, schuljahr: string) => [titel, " · Schuljahr ", schuljahr, " "],
    seit: "(seit",
    vergleichGruppe: "Womit wird verglichen?",
    knopfVorwoche: "gegenüber Vorwoche",
    knopfStart: "gegenüber Schuljahresbeginn",
    // ★ K2 (19.09.2026): der Umschalter selbst war ohne Hinweis.
    knopfVorwocheHinweis: "Vergleicht die Werte unten mit der Woche direkt davor.",
    knopfStartHinweis:
      "Vergleicht die Werte unten mit dem Stand am Schuljahresbeginn - so viel kam insgesamt dazu.",
    geschwindigkeit: "Geschwindigkeit",
    anschlaegeProMin: (wert: string) => `${wert} Anschläge/Min`,
    treffsicherheit: "Treffsicherheit",
    prozentWert: (n: number) => `${n} %`,
    wochenaufgaben: "Wochenaufgaben",
    keinZiel: "kein Wochenziel gesetzt",
    aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
      `${erf} von ` + `${ziel} Minuten - in ` + `${ganz} von ${gesamt} Wochen ganz erfüllt`,
    nochKeineWoche: "noch keine abgeschlossene Ziel-Woche",
  },
  en: {
    // ★ EN10 (19.09.2026, im Browser gelesen): „unchanged (percentage points)"
    // sagt niemand - die Einheit steht schon in der Zeile darüber.
    unveraendert: (_einheit: string) => "unchanged",
    gesteigert: (n: number, einheit: string) => `up ${n} ${einheit}`,
    gesunken: (n: number, einheit: string) => `down ${n} ${einheit}`,
    anschlaege: (n: number) => (n === 1 ? "keystroke" : "keystrokes"),
    prozent: (n: number) => (n === 1 ? "percentage point" : "percentage points"),
    personen: (n: number) => [mehrzahl(n, "en", { one: (z) => `${z} person`, other: (z) => `${z} people` })],
    bezugStart: "compared with the start of the school year",
    bezugVorwoche: "compared with the previous week",
    kopf: (titel: string, schuljahr: string) => [titel, " · School year ", schuljahr, " "],
    seit: "(since",
    vergleichGruppe: "What to compare with",
    knopfVorwoche: "vs previous week",
    knopfStart: "vs start of school year",
    knopfVorwocheHinweis: "Compares the values below with the week right before.",
    knopfStartHinweis:
      "Compares the values below with where things stood at the start of the school year - the total gain so far.",
    geschwindigkeit: "Speed",
    anschlaegeProMin: (wert: string) => `${wert} keystrokes/min`,
    treffsicherheit: "Accuracy",
    prozentWert: (n: number) => `${n}%`,
    wochenaufgaben: "Weekly goals",
    keinZiel: "no weekly goal set",
    aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
      `${erf} of ${ziel} minutes - met in full in ${ganz} of ${gesamt} weeks`,
    nochKeineWoche: "no goal week finished yet",
  },
  fr: {
    unveraendert: (_einheit: string) => "inchangé",
    gesteigert: (n: number, einheit: string) => `augmenté de ${n} ${einheit}`,
    gesunken: (n: number, einheit: string) => `diminué de ${n} ${einheit}`,
    anschlaege: (_n: number) => "frappes",
    prozent: (_n: number) => "points de pourcentage",
    personen: (n: number) => [
      mehrzahl(n, "fr", { one: (z) => `${z} personne`, other: (z) => `${z} personnes` }),
    ],
    bezugStart: "par rapport au début de l'année scolaire",
    bezugVorwoche: "par rapport à la semaine précédente",
    kopf: (titel: string, schuljahr: string) => [titel, " - Année scolaire ", schuljahr, " "],
    seit: "(depuis",
    vergleichGruppe: "Avec quoi comparer ?",
    knopfVorwoche: "Semaine précédente",
    knopfStart: "Début de l'année scolaire",
    knopfVorwocheHinweis: "Compare les valeurs ci-dessous avec la semaine juste avant.",
    knopfStartHinweis:
      "Compare les valeurs ci-dessous avec le niveau au début de l'année scolaire - le progrès total jusqu'ici.",
    geschwindigkeit: "Vitesse",
    anschlaegeProMin: (wert: string) => `${wert} frappes/min`,
    treffsicherheit: "Précision",
    prozentWert: (n: number) => `${n} %`,
    wochenaufgaben: "Objectifs de la semaine",
    keinZiel: "aucun objectif de la semaine réglé",
    aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
      `${erf} sur ` + `${ziel} minutes - entièrement atteint ${ganz} semaine${ganz === 1 ? "" : "s"} sur ${gesamt}`,
    nochKeineWoche: "pas encore de semaine-objectif terminée",
  },
  // ★ ES-O (27.09.2026): liest die Lehrkraft - ohne Anrede.
  es: {
    unveraendert: (_einheit: string) => "sin cambios",
    gesteigert: (n: number, einheit: string) => `ha subido ${n} ${einheit}`,
    gesunken: (n: number, einheit: string) => `ha bajado ${n} ${einheit}`,
    anschlaege: (_n: number) => "pulsaciones",
    prozent: (_n: number) => "puntos porcentuales",
    personen: (n: number) => [
      mehrzahl(n, "es", { one: (z) => `${z} persona`, other: (z) => `${z} personas` }),
    ],
    bezugStart: "respecto al comienzo del curso escolar",
    bezugVorwoche: "respecto a la semana anterior",
    kopf: (titel: string, schuljahr: string) => [titel, " - Curso escolar ", schuljahr, " "],
    seit: "(desde el",
    vergleichGruppe: "¿Con qué comparar?",
    knopfVorwoche: "Semana anterior",
    knopfStart: "Comienzo del curso escolar",
    knopfVorwocheHinweis: "Compara los valores de abajo con la semana justo anterior.",
    knopfStartHinweis:
      "Compara los valores de abajo con el nivel al comienzo del curso escolar - el progreso total hasta ahora.",
    geschwindigkeit: "Velocidad",
    anschlaegeProMin: (wert: string) => `${wert} pulsaciones por minuto`,
    treffsicherheit: "Precisión",
    prozentWert: (n: number) => `${n} %`,
    wochenaufgaben: "Objetivos semanales",
    keinZiel: "ningún objetivo semanal fijado",
    aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
      `${erf} de ` + `${ziel} minutos - objetivo cumplido del todo en ${ganz} de ${gesamt} ${gesamt === 1 ? "semana" : "semanas"}`,
    nochKeineWoche: "todavía ninguna semana del objetivo terminada",
  },
  // ★ O-IT (02.10.2026): „battute", „punti percentuali", „anno scolastico" (Glossar §2.6).
  it: {
    unveraendert: (_einheit: string) => "invariato",
    gesteigert: (n: number, einheit: string) => `salito di ${n} ${einheit}`,
    gesunken: (n: number, einheit: string) => `sceso di ${n} ${einheit}`,
    anschlaege: (_n: number) => "battute",
    prozent: (_n: number) => "punti percentuali",
    personen: (n: number) => [
      mehrzahl(n, "it", { one: (z) => `${z} persona`, other: (z) => `${z} persone` }),
    ],
    bezugStart: "rispetto all'inizio dell'anno scolastico",
    bezugVorwoche: "rispetto alla settimana precedente",
    kopf: (titel: string, schuljahr: string) => [titel, " - Anno scolastico ", schuljahr, " "],
    seit: "(inizio:",
    vergleichGruppe: "Con che cosa confrontare?",
    knopfVorwoche: "Settimana precedente",
    knopfStart: "Inizio dell'anno scolastico",
    knopfVorwocheHinweis: "Confronta i valori qui sotto con la settimana appena precedente.",
    knopfStartHinweis:
      "Confronta i valori qui sotto con il livello all'inizio dell'anno scolastico - tutti i progressi finora.",
    geschwindigkeit: "Velocità",
    anschlaegeProMin: (wert: string) => `${wert} battute al minuto`,
    treffsicherheit: "Precisione",
    prozentWert: (n: number) => `${n}%`,
    wochenaufgaben: "Obiettivi settimanali",
    keinZiel: "nessun obiettivo settimanale impostato",
    aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
      `${erf} su ` + `${ziel} minuti - obiettivo raggiunto del tutto in ${ganz} su ${gesamt} ${gesamt === 1 ? "settimana" : "settimane"}`,
    nochKeineWoche: "ancora nessuna settimana con obiettivo conclusa",
  },
  // ★ O-PL (02.10.2026): „wzrost o 4 uderzenia" / „spadek o 3 punkty
  // procentowe" - nach „o" der Akkusativ (= Nominativ bei „uderzenie" und
  // „punkt"), alle vier Formen (Glossar §2.10a); liest die Lehrkraft, sachlich.
  pl: {
    unveraendert: (_einheit: string) => "bez zmian",
    gesteigert: (n: number, einheit: string) => `wzrost o ${n} ${einheit}`,
    gesunken: (n: number, einheit: string) => `spadek o ${n} ${einheit}`,
    anschlaege: (n: number) =>
      mehrzahl(n, "pl", {
        one: () => "uderzenie",
        few: () => "uderzenia",
        many: () => "uderzeń",
        other: () => "uderzenia",
      }),
    prozent: (n: number) =>
      mehrzahl(n, "pl", {
        one: () => "punkt procentowy",
        few: () => "punkty procentowe",
        many: () => "punktów procentowych",
        other: () => "punktu procentowego",
      }),
    personen: (n: number) => [
      mehrzahl(n, "pl", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osób`,
        other: (z) => `${z} osoby`,
      }),
    ],
    bezugStart: "w porównaniu z początkiem roku szkolnego",
    bezugVorwoche: "w porównaniu z poprzednim tygodniem",
    kopf: (titel: string, schuljahr: string) => [titel, " - Rok szkolny ", schuljahr, " "],
    seit: "(od",
    vergleichGruppe: "Z czym porównać?",
    knopfVorwoche: "Poprzedni tydzień",
    knopfStart: "Początek roku szkolnego",
    knopfVorwocheHinweis: "Porównuje wartości poniżej z poprzednim tygodniem.",
    knopfStartHinweis:
      "Porównuje wartości poniżej ze stanem na początku roku szkolnego - cały dotychczasowy postęp.",
    geschwindigkeit: "Tempo",
    anschlaegeProMin: (wert: string) =>
      mehrzahl(Number(wert), "pl", {
        one: (z) => `${z} uderzenie na minutę`,
        few: (z) => `${z} uderzenia na minutę`,
        many: (z) => `${z} uderzeń na minutę`,
        other: (z) => `${z} uderzenia na minutę`,
      }),
    treffsicherheit: "Dokładność",
    prozentWert: (n: number) => `${n}%`,
    wochenaufgaben: "Cele tygodniowe",
    keinZiel: "brak celu tygodniowego",
    aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
      `${erf} z ` + `${ziel} min - cel w pełni osiągnięty w tygodniach: ${ganz} z ${gesamt}`,
    nochKeineWoche: "na razie brak zakończonego tygodnia z celem",
  },
  // ★ O-TR (02.10.2026): liest die Lehrkraft, sachlich - "4 vuruş artış
  // (önceki haftaya göre)": der Bezug in Klammern HINTER der Zahl, weil der
  // Satz als "Veränderung + Bezug" zusammengesetzt wird; Einzahl nach der Zahl,
  // "%95" (Glossar Regel 5), keine Endung an Zahl oder Datum (Regel 6).
  tr: {
    unveraendert: (_einheit: string) => "değişiklik yok",
    gesteigert: (n: number, einheit: string) => `${n} ${einheit} artış`,
    gesunken: (n: number, einheit: string) => `${n} ${einheit} düşüş`,
    anschlaege: (_n: number) => "vuruş",
    prozent: (_n: number) => "yüzde puan",
    personen: (n: number) => [n, " öğrenci"],
    bezugStart: "(öğretim yılı başına göre)",
    bezugVorwoche: "(önceki haftaya göre)",
    kopf: (titel: string, schuljahr: string) => [titel, " - Öğretim yılı ", schuljahr, " "],
    seit: "(başlangıç:",
    vergleichGruppe: "Neyle karşılaştırılsın?",
    knopfVorwoche: "Önceki hafta",
    knopfStart: "Öğretim yılı başı",
    knopfVorwocheHinweis: "Aşağıdaki değerleri bir önceki haftayla karşılaştırır.",
    knopfStartHinweis:
      "Aşağıdaki değerleri öğretim yılı başındaki durumla karşılaştırır - toplam ilerlemeyi gösterir.",
    geschwindigkeit: "Hız",
    anschlaegeProMin: (wert: string) => `dakikada ${wert} vuruş`,
    treffsicherheit: "Doğruluk",
    prozentWert: (n: number) => `%${n}`,
    wochenaufgaben: "Haftalık hedefler",
    keinZiel: "haftalık hedef yok",
    aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
      `${erf} dk. (hedef: ${ziel} dk.) - hedefe tam ulaşılan hafta: ${ganz}, toplam ${gesamt}`,
    nochKeineWoche: "henüz tamamlanmış hedefli hafta yok",
  },
  // ★ O-CS (03.10.2026): liest die Lehrkraft, sachlich - „nárůst o 4 úhozy
  // oproti předchozímu týdnu" (nach „o" der 4. Fall, bei bod/úhoz gleich dem
  // 1.; die Einheit mit allen vier Formen, Glossar §2.11), nárůst / pokles,
  // nie lepší / horší. „95 %" mit geschütztem Leerzeichen (Regel 5), Minuten
  // und Wochen mit Schrägstrich (Regel 13), Schuljahr „2025/2026".
  cs: {
    unveraendert: (_einheit: string) => "beze změny",
    gesteigert: (n: number, einheit: string) => `nárůst o ${n} ${einheit}`,
    gesunken: (n: number, einheit: string) => `pokles o ${n} ${einheit}`,
    anschlaege: (n: number) =>
      mehrzahl(n, "cs", { one: () => "úhoz", few: () => "úhozy", many: () => "úhozu", other: () => "úhozů" }),
    prozent: (n: number) =>
      mehrzahl(n, "cs", {
        one: () => "procentní bod",
        few: () => "procentní body",
        many: () => "procentního bodu",
        other: () => "procentních bodů",
      }),
    personen: (n: number) => [
      mehrzahl(n, "cs", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osoby`,
        other: (z) => `${z} osob`,
      }),
    ],
    bezugStart: "oproti začátku školního roku",
    bezugVorwoche: "oproti předchozímu týdnu",
    kopf: (titel: string, schuljahr: string) => [titel, " - Školní rok ", schuljahrLabelCs(schuljahr), " "],
    seit: "(od",
    vergleichGruppe: "S čím porovnat?",
    knopfVorwoche: "Předchozí týden",
    knopfStart: "Začátek školního roku",
    knopfVorwocheHinweis: "Porovná hodnoty níže s předchozím týdnem.",
    knopfStartHinweis:
      "Porovná hodnoty níže se stavem na začátku školního roku - celkový dosavadní pokrok.",
    geschwindigkeit: "Rychlost",
    anschlaegeProMin: (wert: string) => `${wert} úhozů/min`,
    treffsicherheit: "Přesnost",
    prozentWert: (n: number) => `${n}\u00A0%`,
    wochenaufgaben: "Týdenní cíle",
    keinZiel: "bez týdenního cíle",
    aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
      `${erf}/${ziel} min - celý cíl splněn v týdnech: ${ganz}/${gesamt}`,
    nochKeineWoche: "zatím žádný ukončený týden s cílem",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      unveraendert: (_einheit: string) => "без промяна",
      // „4 знака повече" - kein „с ${n}" (Glossar Falle 9).
      gesteigert: (n: number, einheit: string) => `${n} ${einheit} повече`,
      gesunken: (n: number, einheit: string) => `${n} ${einheit} по-малко`,
      // Zählform: 1 знак · 2 знака (Glossar §2.11)
      anschlaege: (n: number) => (n === 1 ? "знак" : "знака"),
      prozent: (n: number) => (n === 1 ? "процентен пункт" : "процентни пункта"),
      personen: (n: number) => [mehrzahl(n, "bg", { one: (z) => `${z} човек`, other: (z) => `${z} души` })],
      bezugStart: "спрямо началото на учебната година",
      bezugVorwoche: "спрямо предходната седмица",
      kopf: (titel: string, schuljahr: string) => [titel, " · Учебна година ", schuljahr, " "],
      seit: "(от",
      vergleichGruppe: "С какво да се сравнява?",
      knopfVorwoche: "спрямо предходната седмица",
      knopfStart: "спрямо началото на учебната година",
      knopfVorwocheHinweis: "Сравнява стойностите по-долу със седмицата точно преди това.",
      knopfStartHinweis:
        "Сравнява стойностите по-долу със състоянието в началото на учебната година - толкова е добавено общо.",
      geschwindigkeit: "Скорост",
      anschlaegeProMin: (wert: string) => `${wert} знака в минута`,
      treffsicherheit: "Точност",
      prozentWert: (n: number) => `${n}%`,
      wochenaufgaben: "Седмични цели",
      keinZiel: "няма зададена седмична цел",
      aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
        `${erf} от ${ziel} минути - целта е изпълнена изцяло в ${ganz} от ${gesamt} седмици`,
      nochKeineWoche: "още няма завършена седмица с цел",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      unveraendert: (_einheit: string) => "χωρίς αλλαγή",
      gesteigert: (n: number, einheit: string) => `αύξηση κατά ${n} ${einheit}`,
      gesunken: (n: number, einheit: string) => `μείωση κατά ${n} ${einheit}`,
      anschlaege: (n: number) => (n === 1 ? "πάτημα" : "πατήματα"),
      prozent: (n: number) => (n === 1 ? "ποσοστιαία μονάδα" : "ποσοστιαίες μονάδες"),
      personen: (n: number) => [mehrzahl(n, "el", { one: (z) => `${z} άτομο`, other: (z) => `${z} άτομα` })],
      bezugStart: "σε σύγκριση με την αρχή του σχολικού έτους",
      bezugVorwoche: "σε σύγκριση με την προηγούμενη εβδομάδα",
      kopf: (titel: string, schuljahr: string) => [titel, " - Σχολικό έτος ", schuljahr, " "],
      seit: "(από",
      vergleichGruppe: "Σύγκριση με",
      knopfVorwoche: "με την προηγούμενη εβδομάδα",
      knopfStart: "με την αρχή του σχολικού έτους",
      knopfVorwocheHinweis: "Συγκρίνει τις παρακάτω τιμές με την αμέσως προηγούμενη εβδομάδα.",
      knopfStartHinweis:
        "Συγκρίνει τις παρακάτω τιμές με την κατάσταση στην αρχή του σχολικού έτους - πόσο προστέθηκε συνολικά.",
      geschwindigkeit: "Ταχύτητα",
      anschlaegeProMin: (wert: string) => `${wert} πατήματα/λεπτό`,
      treffsicherheit: "Ακρίβεια",
      prozentWert: (n: number) => `${n}%`,
      wochenaufgaben: "Εβδομαδιαίοι στόχοι",
      keinZiel: "δεν έχει οριστεί εβδομαδιαίος στόχος",
      aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
        `${erf} από ${ziel} λεπτά - πλήρης στόχος: ${ganz} από ${gesamt} εβδομάδες`,
      nochKeineWoche: "δεν έχει ολοκληρωθεί ακόμα καμία εβδομάδα με στόχο",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      // Lehrkraft-Sicht, ohne Anrede (Glossar hu Regel 1); nach einer Zahl Einzahl (Regel 13).
      unveraendert: (_einheit: string) => "változatlan",
      gesteigert: (n: number, einheit: string) => `javulás: ${n} ${einheit}`,
      gesunken: (n: number, einheit: string) => `csökkenés: ${n} ${einheit}`,
      anschlaege: (n: number) => mehrzahl(n, "hu", { one: () => "leütés", other: () => "leütés" }),
      prozent: (n: number) => mehrzahl(n, "hu", { one: () => "százalékpont", other: () => "százalékpont" }),
      personen: (n: number) => [mehrzahl(n, "hu", { one: (z) => `${z} fő`, other: (z) => `${z} fő` })],
      bezugStart: "a tanév kezdetéhez képest",
      bezugVorwoche: "az előző héthez képest",
      kopf: (titel: string, schuljahr: string) => [titel, " · Tanév: ", schuljahr, " "],
      seit: "(kezdete:",
      vergleichGruppe: "Mihez képest?",
      knopfVorwoche: "az előző héthez",
      knopfStart: "a tanév kezdetéhez",
      knopfVorwocheHinweis: "Az alábbi értékeket a közvetlenül előtte lévő héttel veti össze.",
      knopfStartHinweis:
        "Az alábbi értékeket a tanév eleji állapottal veti össze - ennyi a teljes fejlődés eddig.",
      geschwindigkeit: "Sebesség",
      anschlaegeProMin: (wert: string) => `${wert} leütés/perc`,
      treffsicherheit: "Pontosság",
      prozentWert: (n: number) => `${n}%`,
      wochenaufgaben: "Heti célok",
      keinZiel: "nincs heti cél beállítva",
      aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
        `${erf}/${ziel} perc - maradéktalanul teljesült hetek: ${ganz}/${gesamt}`,
      nochKeineWoche: "még nincs lezárt hét heti céllal",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      unveraendert: (_einheit: string) => "onveranderd",
      gesteigert: (n: number, einheit: string) => `gestegen met ${n} ${einheit}`,
      gesunken: (n: number, einheit: string) => `gedaald met ${n} ${einheit}`,
      anschlaege: (n: number) => (n === 1 ? "aanslag" : "aanslagen"),
      prozent: (n: number) => (n === 1 ? "procentpunt" : "procentpunten"),
      personen: (n: number) => [mehrzahl(n, "nl", { one: (z) => `${z} persoon`, other: (z) => `${z} personen` })],
      bezugStart: "vergeleken met het begin van het schooljaar",
      bezugVorwoche: "vergeleken met vorige week",
      kopf: (titel: string, schuljahr: string) => [titel, " · Schooljaar ", schuljahr, " "],
      seit: "(sinds",
      vergleichGruppe: "Waarmee vergelijken?",
      knopfVorwoche: "met vorige week",
      knopfStart: "met begin schooljaar",
      knopfVorwocheHinweis: "Vergelijkt de waarden hieronder met de week direct daarvoor.",
      knopfStartHinweis:
        "Vergelijkt de waarden hieronder met de stand aan het begin van het schooljaar - zoveel is er in totaal bij gekomen.",
      geschwindigkeit: "Snelheid",
      anschlaegeProMin: (wert: string) => `${wert} aanslagen/min`,
      treffsicherheit: "Nauwkeurigheid",
      prozentWert: (n: number) => `${n}%`,
      wochenaufgaben: "Weekdoelen",
      keinZiel: "geen weekdoel ingesteld",
      aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
        `${erf} van ${ziel} minuten - in ${ganz} van ${gesamt} weken helemaal gehaald`,
      nochKeineWoche: "nog geen afgesloten week met een weekdoel",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      unveraendert: (_einheit: string) => "sem alteração",
      gesteigert: (n: number, einheit: string) => `mais ${n} ${einheit}`,
      gesunken: (n: number, einheit: string) => `menos ${n} ${einheit}`,
      anschlaege: (n: number) =>
        mehrzahl(n, "pt", { one: () => "toque", other: () => "toques", many: () => "de toques" }),
      prozent: (n: number) =>
        mehrzahl(n, "pt", { one: () => "ponto percentual", other: () => "pontos percentuais" }),
      personen: (n: number) => [
        mehrzahl(n, "pt", { one: (z) => `${z} pessoa`, other: (z) => `${z} pessoas`, many: (z) => `${z} de pessoas` }),
      ],
      bezugStart: "em relação ao início do ano letivo",
      bezugVorwoche: "em relação à semana anterior",
      kopf: (titel: string, schuljahr: string) => [titel, " · Ano letivo ", schuljahr, " "],
      seit: "(desde",
      vergleichGruppe: "Comparar com quê?",
      knopfVorwoche: "face à semana anterior",
      knopfStart: "face ao início do ano letivo",
      knopfVorwocheHinweis: "Compara os valores abaixo com a semana imediatamente anterior.",
      knopfStartHinweis:
        "Compara os valores abaixo com o ponto de partida no início do ano letivo - o total ganho até agora.",
      geschwindigkeit: "Velocidade",
      anschlaegeProMin: (wert: string) => `${wert} toques/min`,
      treffsicherheit: "Precisão",
      prozentWert: (n: number) => `${n}%`,
      wochenaufgaben: "Objetivos semanais",
      keinZiel: "sem objetivo semanal definido",
      aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
        `${erf} de ${ziel} minutos - cumprido por inteiro em ${ganz} de ${gesamt} semanas`,
      nochKeineWoche: "ainda nenhuma semana com objetivo concluída",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      unveraendert: (_einheit: string) => "sem mudança",
      gesteigert: (n: number, einheit: string) => `subiu ${n} ${einheit}`,
      gesunken: (n: number, einheit: string) => `desceu ${n} ${einheit}`,
      anschlaege: (n: number) => (n === 1 ? "toque" : "toques"),
      prozent: (n: number) => (n === 1 ? "ponto percentual" : "pontos percentuais"),
      // Null nie über mehrzahl() (Glossar Regel 13: „0 pessoa" wäre falsch).
      personen: (n: number) => [n, " ", n === 1 ? "pessoa" : "pessoas"],
      bezugStart: "em relação ao início do ano letivo",
      bezugVorwoche: "em relação à semana anterior",
      kopf: (titel: string, schuljahr: string) => [titel, " · Ano letivo ", schuljahr, " "],
      seit: "(desde",
      vergleichGruppe: "Comparar com",
      knopfVorwoche: "Semana anterior",
      knopfStart: "Início do ano letivo",
      knopfVorwocheHinweis: "Compara os valores abaixo com a semana imediatamente anterior.",
      knopfStartHinweis:
        "Compara os valores abaixo com a situação no início do ano letivo - o ganho total até agora.",
      geschwindigkeit: "Velocidade",
      anschlaegeProMin: (wert: string) => `${wert} toques/min`,
      treffsicherheit: "Precisão",
      prozentWert: (n: number) => `${n}%`,
      wochenaufgaben: "Metas semanais",
      keinZiel: "nenhuma meta semanal definida",
      aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
        `${erf} de ${ziel} minutos - cumprida por completo em ${ganz} de ${gesamt} semanas`,
      nochKeineWoche: "ainda nenhuma semana de meta concluída",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      // Unitatea stă deja în rândul de deasupra (ca la en).
      unveraendert: (_einheit: string) => "neschimbat",
      gesteigert: (n: number, einheit: string) => `în creștere cu ${n} ${einheit}`,
      gesunken: (n: number, einheit: string) => `în scădere cu ${n} ${einheit}`,
      // „de” de la 20 în sus (Glosar §2.11) - stă în unitate, pentru că unitatea urmează direct după număr.
      anschlaege: (n: number) =>
        mehrzahl(n, "ro", { one: () => "apăsare", few: () => "apăsări", other: () => "de apăsări" }),
      prozent: (n: number) =>
        mehrzahl(n, "ro", {
          one: () => "punct procentual",
          few: () => "puncte procentuale",
          other: () => "de puncte procentuale",
        }),
      personen: (n: number) => [
        mehrzahl(n, "ro", {
          one: (z) => `${z} persoană`,
          few: (z) => `${z} persoane`,
          other: (z) => `${z} de persoane`,
        }),
      ],
      bezugStart: "față de începutul anului școlar",
      bezugVorwoche: "față de săptămâna trecută",
      kopf: (titel: string, schuljahr: string) => [titel, " · Anul școlar ", schuljahr, " "],
      seit: "(din",
      vergleichGruppe: "Cu ce se compară?",
      knopfVorwoche: "față de săptămâna trecută",
      knopfStart: "față de începutul anului școlar",
      knopfVorwocheHinweis: "Compară valorile de mai jos cu săptămâna imediat dinainte.",
      knopfStartHinweis:
        "Compară valorile de mai jos cu situația de la începutul anului școlar - cât s-a adăugat în total.",
      geschwindigkeit: "Viteză",
      anschlaegeProMin: (wert: string) => `${wert} car./min`,
      treffsicherheit: "Precizie",
      prozentWert: (n: number) => `${n} %`,
      wochenaufgaben: "Obiective săptămânale",
      keinZiel: "niciun obiectiv săptămânal stabilit",
      aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
        `${erf} din ${mehrzahl(ziel, "ro", {
          one: (z) => `${z} minut`,
          few: (z) => `${z} minute`,
          other: (z) => `${z} de minute`,
        })} - atins complet în ${ganz} din ${mehrzahl(gesamt, "ro", {
          one: (z) => `${z} săptămână`,
          few: (z) => `${z} săptămâni`,
          other: (z) => `${z} de săptămâni`,
        })}`,
      nochKeineWoche: "încă nicio săptămână cu obiectiv încheiată",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      unveraendert: (_einheit: string) => "oförändrat",
      gesteigert: (n: number, einheit: string) => `ökat med ${n} ${einheit}`,
      gesunken: (n: number, einheit: string) => `minskat med ${n} ${einheit}`,
      anschlaege: (n: number) => mehrzahl(n, "sv", { one: () => "anslag", other: () => "anslag" }),
      prozent: (n: number) =>
        mehrzahl(n, "sv", { one: () => "procentenhet", other: () => "procentenheter" }),
      personen: (n: number) => [mehrzahl(n, "sv", { one: (z) => `${z} person`, other: (z) => `${z} personer` })],
      bezugStart: "jämfört med läsårets början",
      bezugVorwoche: "jämfört med förra veckan",
      kopf: (titel: string, schuljahr: string) => [titel, " · Läsår ", schuljahr, " "],
      seit: "(sedan",
      vergleichGruppe: "Vad ska jämföras med?",
      knopfVorwoche: "mot förra veckan",
      knopfStart: "mot läsårets början",
      knopfVorwocheHinweis: "Jämför värdena nedan med veckan direkt innan.",
      knopfStartHinweis:
        "Jämför värdena nedan med läget vid läsårets början - så mycket har tillkommit totalt.",
      geschwindigkeit: "Hastighet",
      anschlaegeProMin: (wert: string) => `${wert} anslag/min`,
      treffsicherheit: "Träffsäkerhet",
      prozentWert: (n: number) => `${n} %`,
      wochenaufgaben: "Veckomål",
      keinZiel: "inget veckomål inställt",
      aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
        `${erf} av ${ziel} minuter - helt uppnått under ${ganz} av ${gesamt} veckor`,
      nochKeineWoche: "ingen avslutad vecka med mål än",
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      unveraendert: (_einheit: string) => "без змін",
      gesteigert: (n: number, einheit: string) => `більше на ${n} ${einheit}`,
      gesunken: (n: number, einheit: string) => `менше на ${n} ${einheit}`,
      anschlaege: (n: number) =>
        mehrzahl(n, "uk", {
          one: () => "натискання",
          few: () => "натискання",
          many: () => "натискань",
          other: () => "натискання",
        }),
      prozent: (n: number) =>
        mehrzahl(n, "uk", {
          one: () => "відсотковий пункт",
          few: () => "відсоткові пункти",
          many: () => "відсоткових пунктів",
          other: () => "відсоткового пункту",
        }),
      personen: (n: number) => [
        mehrzahl(n, "uk", {
          one: (z) => `${z} особа`,
          few: (z) => `${z} особи`,
          many: (z) => `${z} осіб`,
          other: (z) => `${z} особи`,
        }),
      ],
      bezugStart: "порівняно з початком навчального року",
      bezugVorwoche: "порівняно з попереднім тижнем",
      kopf: (titel: string, schuljahr: string) => [titel, " · Навчальний рік ", schuljahr, " "],
      seit: "(від",
      vergleichGruppe: "З чим порівнювати",
      knopfVorwoche: "з попереднім тижнем",
      knopfStart: "з початком навчального року",
      knopfVorwocheHinweis: "Порівнює значення нижче з тижнем безпосередньо перед ним.",
      knopfStartHinweis:
        "Порівнює значення нижче зі станом на початку навчального року - скільки додалося загалом.",
      geschwindigkeit: "Швидкість",
      anschlaegeProMin: (wert: string) => `${wert} знаків/хв`,
      treffsicherheit: "Точність",
      prozentWert: (n: number) => `${n}%`,
      wochenaufgaben: "Тижнева мета",
      keinZiel: "тижневу мету не встановлено",
      aufgabenZusatz: (erf: number, ziel: number, ganz: number, gesamt: number) =>
        `${erf} з ${ziel} хв - тижні з повністю досягнутою метою: ${ganz}/${gesamt}`,
      nochKeineWoche: "ще немає завершеного тижня з метою",
    },
});

type KartenTexte = (typeof KARTE_TEXTE)["de"];

/** „um 4 gesteigert" · „um 3 gesunken" · „unverändert". */
function fmtSteigerung(t: KartenTexte, n: number, einheit: (n: number) => string): string {
  if (n === 0) return t.unveraendert(einheit(0));
  return n > 0 ? t.gesteigert(n, einheit(n)) : t.gesunken(-n, einheit(-n));
}

function Zeile({
  name,
  stand,
  zusatz,
}: {
  name: string;
  stand: string;
  zusatz?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-t border-hairline/60 py-1.5 first:border-t-0">
      <dt className="min-w-[9rem] text-sm text-ink-muted">{name}</dt>
      <dd className="m-0 font-semibold text-ink">{stand}</dd>
      {zusatz && <dd className="m-0 text-sm text-ink-muted">{zusatz}</dd>}
    </div>
  );
}

/**
 * Der Verteilungsbalken (§4.3, F20: die Werte UND der Balken).
 *
 * ⚠️ HIER STAND BIS ZUM 01.09.2026 EIN BALKEN. Er ist der Punktleiste
 * gewichen ([[Punktleiste]], Johannes: „statt dem boxplot mach die punkte der
 * schüler auf der leiste"). Geblieben sind die vier ZAHLEN - und die waren
 * ohnehin die Hauptsache: Sie sind nicht die Beschriftung eines Bildes,
 * sondern die vollständige Auskunft für jemanden, der das Bild nicht sieht.
 *
 * ★ Warum sie neben der Punktleiste bleiben: Die Punkte lösen fein auf („wer
 * genau"), die vier Zahlen grob („wie steht die Klasse"). Ohne sie bekäme
 * eine Lehrkraft mit Blindheit den Überblick erst nach 24
 * Pfeiltasten-Anschlägen - bedienbar, aber nicht gleichwertig.
 */
/*
 * ★ B1 (11.09.2026): Die Töpfe sind seit diesem Umbau SCORE-Töpfe (unter 50 ·
 * 50-70 · 70-85 · über 85, Herleitung an `SCORE_TOEPFE`). Die Beschriftungen
 * kommen weiter aus der Definition und werden hier nicht zweitgeschrieben -
 * sonst stünde über einer Zahl ein Wort, das sie nicht meint.
 */
export function TopfZahlen({
  toepfe,
  gesamt,
}: {
  toepfe: readonly number[];
  gesamt: number;
}) {
  const { sprache } = useBedienSprache();
  const t = KARTE_TEXTE[sprache];
  if (gesamt === 0) return null;
  return (
    <div className="space-y-1">
      <dl className="m-0 grid grid-cols-2 gap-x-3 text-sm sm:grid-cols-4">
        {toepfe.map((n, i) => (
          <div key={SCORE_TOEPFE[i].label}>
            <dt className="text-ink-muted">{topfLabel(i, sprache)}</dt>
            <dd className="m-0 font-semibold text-ink">{t.personen(n)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Jahreskarte({
  titel,
  werte,
  bezug,
  onBezug,
}: {
  titel: string;
  werte: JahreskarteWerte;
  bezug: Bezug;
  onBezug: (b: Bezug) => void;
}) {
  const titelId = useId();
  const { sprache } = useBedienSprache();
  const t = KARTE_TEXTE[sprache];
  const bezugstext = bezug === "start" ? t.bezugStart : t.bezugVorwoche;

  const ueberschrift = (
    <h3 id={titelId} className="m-0 text-base font-semibold text-ink">
      {t.kopf(titel, werte.schuljahr.label)}
      <span className="font-normal text-ink-muted">
        {t.seit}{" "}
        {/* ★ E11a-5: französisch über `fmtTagMonat(…, "fr")` („1 sept.") -
            vorher fiel „fr" still auf „01.09." (Falle 30). */}
        {/* ★ O2-COMP (30.10.2026): die neun Sprachen nach ihrem Gebiet („1 септ.", „1 Σεπ"). */}
        {istGeruestSprache(sprache)
          ? new Date(werte.schuljahr.vonMs).toLocaleDateString(GEBIET[sprache], {
              day: "numeric",
              month: "short",
            })
          : (sprache as BedienSprache) === "fr" ||
        (sprache as BedienSprache) === "es" ||
        (sprache as BedienSprache) === "it" ||
        // ★ O-PL (02.10.2026): „(od 1 wrz)".
        (sprache as BedienSprache) === "pl" ||
        // ★ O-TR (02.10.2026): "(başlangıç: 1 Eyl)".
        (sprache as BedienSprache) === "tr" ||
        // ★ O-CS (03.10.2026): „(od 1. 9.)".
        (sprache as BedienSprache) === "cs"
          ? fmtTagMonat(werte.schuljahr.vonMs, sprache as BedienSprache)
          : sprache === "en"
          ? new Date(werte.schuljahr.vonMs).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })
          : new Date(werte.schuljahr.vonMs).toLocaleDateString("de-AT", {
              day: "2-digit",
              month: "2-digit",
            })}
        )
      </span>
    </h3>
  );

  return (
    /*
      ★ R6 (11.09.2026, `BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md`): ohne
      eigenen Rahmen - erster Unterbereich der aufgeklappten Zeile eines
      Kindes. Die Zeile ist dort schon der Abschnitt; ein Kasten darin wäre
      Kasten in Kasten.
    */
    <section aria-labelledby={titelId} className="space-y-2">
      {ueberschrift}

      {/*
        ★ F13: Der Umschalter steht NEBEN der Zahl und sagt, worauf sich die
        Angabe bezieht. Eine Steigerung ohne Bezugspunkt ist keine Auskunft.
        Grundstellung: Vorwoche.
      */}
      <div role="group" aria-label={t.vergleichGruppe} className="flex flex-wrap gap-1">
        {(["vorwoche", "start"] as const).map((b) => (
          <Tipp key={b} text={b === "vorwoche" ? t.knopfVorwocheHinweis : t.knopfStartHinweis}>
            {(hinweisId) => (
              <button
                type="button"
                aria-pressed={bezug === b}
                aria-describedby={hinweisId}
                onClick={() => onBezug(b)}
                className={
                  // ⚠️ `whitespace-nowrap`: „gegenüber Schuljahresbeginn" brach sonst
                  // auf zwei Zeilen und stand mit 52 px neben den 32-px-Schaltern
                  // der Zeitraum-Leiste (gemessen 01.09.2026). Umschalter im Haus
                  // sind ~32 px hoch - alle.
                  (bezug === b ? "btn-primary" : "btn-secondary") +
                  " btn-toggle btn-umriss whitespace-nowrap text-sm"
                }
              >
                {b === "vorwoche" ? t.knopfVorwoche : t.knopfStart}
              </button>
            )}
          </Tipp>
        ))}
      </div>

      <dl className="m-0">
        <Zeile
          name={t.geschwindigkeit}
          stand={t.anschlaegeProMin(String(werte.geschwindigkeit.jetzt))}
          zusatz={
            werte.geschwindigkeit.steigerung === null
              ? undefined
              : // ★ F18: ANSCHLÄGE, keine Prozent.
                `${fmtSteigerung(t, werte.geschwindigkeit.steigerung, t.anschlaege)} ${bezugstext}`
          }
        />
        <Zeile
          name={t.treffsicherheit}
          stand={t.prozentWert(Math.round(werte.treffsicherheit.jetzt * 100))}
          zusatz={
            werte.treffsicherheit.steigerung === null
              ? undefined
              : `${fmtSteigerung(t, werte.treffsicherheit.steigerung, t.prozent)} ${bezugstext}`
          }
        />
        {/*
          ★ W3a (18.09.2026): Prozent statt Einheiten (Bauplan §7g, Johannes:
          „es kann dann ja in % ausgegeben werden: Kind A hat 87 % der
          Wochenaufgaben erledigt") - über alle ABGESCHLOSSENEN Ziel-Wochen,
          die laufende zählt noch nicht mit. (Die Klasse summiert seit K3 in
          `klassenueberblick.ts` - minutengewichtet, nicht kopfgewichtet.)
        */}
        <Zeile
          name={t.wochenaufgaben}
          stand={
            !werte.aufgaben.aktiv
              ? t.keinZiel
              : prozentAnzeige(werte.aufgaben.anteil, sprache)
          }
          zusatz={
            werte.aufgaben.anteil !== null
              ? t.aufgabenZusatz(
                  Math.round(werte.aufgaben.minutenErfuellt),
                  Math.round(werte.aufgaben.minutenZiel),
                  werte.aufgaben.wochenGanz,
                  werte.aufgaben.wochenGesamt,
                )
              : werte.aufgaben.aktiv
                ? t.nochKeineWoche
                : undefined
          }
        />
      </dl>

      {/*
        ★ Johannes, 01.09.2026: *„auch ausgangspunkt, grundlage und 7 einheiten
        zählen nicht sind infos die nicht nötig sind raus damit."*

        Hier standen drei Fußzeilen: der Ausgangspunkt der Steigerung, die
        Grundlage (Blöcke, Tage, geübte Zeit) und der Hinweis auf Einheiten, die
        zu früh in der Woche lagen. Sie waren als Beleg gedacht - gelesen wurden
        sie als Kleingedrucktes unter jeder einzelnen Karte, und bei 25 Kindern
        stand dasselbe Kleingedruckte 25-mal da.

        ⚠️ Die Zahlen sind nicht weg, nur nicht mehr hier: Blöcke, Tage und
        geübte Zeit stehen im aufgeklappten Bereich (`PupilStatsPanel`), die
        Übezeit zusätzlich als eigene Spalte der Tabelle. Was verschwunden ist,
        ist die Erklärung, die niemand an dieser Stelle bestellt hat.
      */}
    </section>
  );
}
