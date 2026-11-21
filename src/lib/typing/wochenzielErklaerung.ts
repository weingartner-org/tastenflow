/**
 * Wie das Wochenziel zählt - die Erklärung an EINER Stelle (31.08.2026,
 * vereinfacht 16.09.2026, auf das Minuten-Modell umgeschrieben 19.09.2026).
 *
 * Auftrag Johannes: *„jetzt ist die Frage, ob wir dieses System auch in die
 * Hilfe bekommen, dass das wer versteht?"*
 *
 * ★ WARUM ALS DATEN UND NICHT ALS TEXT AN JEDER STELLE: Wer dieselbe Regel an
 * mehreren Stellen von Hand ausschreibt, lässt sie beim nächsten Umbau
 * auseinanderlaufen - genau die Fehlerklasse „zwei Stellen, die voneinander
 * nichts wissen" ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 * Einziger Verbraucher ist zurzeit das Handbuch
 * (`scripts/erzeuge-tastenflow-handbuch.mts`, Kapitel 2.6) - die Lehrkraft-
 * und Kinder-Hilfe schreiben ihre kurze Fassung seit W3b (18.09.2026) selbst
 * (`LehrerHilfe.tsx` Abschnitt 7, `TastenflowZahlenHilfe.tsx`), weil dort
 * ohnehin nur noch ein bis zwei knappe Sätze stehen („Halte die Seite extrem
 * schlank", Johannes).
 *
 * ★★★ W1/W3b (Bauplan §„W · Wochenziel neu"): Das Ziel ist seither eine
 * MINUTENZAHL JE WOCHE, ohne Einheiten und ohne Tageslimit - der frühere
 * Tages-Deckel („am Anfang der Woche zählt nur eine Einheit pro Tag", schon
 * am 16.09.2026 abgeschafft) und die Einheiten-Rechnung selbst (Minuten je
 * Einheit × Einheiten je Woche) sind beide ersatzlos weg (`wochenziel.ts`).
 */

import type { BedienSprache } from "../bedienSprache/sprache";

export interface Erklaerungsschritt {
  /** Die Überschrift des Schrittes, kurz. */
  kopf: string;
  /** Die Erklärung fürs Sie (Lehrkraft). */
  sie: string;
  /** Dieselbe Erklärung fürs Du (Kind). */
  du: string;
}

/**
 * Die zwei Sätze, aus denen das System besteht - in dieser Reihenfolge.
 *
 * ★ EN7 (19.09.2026): `sprache = "en"` für das englische Handbuch (Kapitel
 * 2.6). Ohne Angabe Deutsch - genau die Sätze von vorher. Glossar §3.3:
 * *weekly goal*, *minutes per week*, Wochengrenze *8am on Monday*, *pupil*
 * (§3.8). „ohne Einheiten" sagt einer deutschen Lehrkraft, dass das alte
 * Einheiten-Modell weg ist - eine englische hat es nie gekannt; der Kopf sagt
 * darum nur, dass es bei den Minuten bleibt.
 */
export function wochenzielSchritte(sprache: BedienSprache = "de"): Erklaerungsschritt[] {
  // ★ O-CS (03.10.2026): tschechisch - Lehrkraft vy bzw. unpersönlich („cvičí se"),
  // Kind ty; kein Satz endet auf einer Zahl mit Punkt (Einheit dahinter, Glossar
  // §4 Falle 4); „v pondělí v 8:00" fest (8 Uhr ⇒ „v", Glossar §2.10). Wer den
  // Cíl ändert, bleibt ungenannt (kein „vyučující" im 3. Fall, Glossar Regel 2).
  if (sprache === "cs")
    return [
      {
        kopf: "Jen minuty za týden",
        sie:
          "Týdenní cíl je počet minut na celý týden - nic víc. Když je cíl 60 minut " +
          "a za týden se nacvičí 45 minut, zbývá ještě 15 minut.",
        du:
          "Tvůj týdenní cíl je počet minut na celý týden. Když je tvůj cíl 60 minut " +
          "a nacvičíš 45 minut, zbývá ti ještě 15 minut.",
      },
      {
        kopf: "Od kdy platí změna",
        sie:
          "Změněný cíl platí od začátku příštího týdne (v pondělí v 8:00) - " +
          "probíhající týden si ponechá dosavadní cíl. Přesné datum vám předem " +
          "ukáže okno se zprávou.",
        du:
          "Když se tvůj týdenní cíl změní, nový cíl platí od začátku příštího " +
          "týdne (v pondělí v 8:00). Do té doby platí starý cíl.",
      },
    ];
  // ★ O-TR (02.10.2026): türkisch - Lehrkraft siz (beschreibend), Kind sen;
  // keine Endung an einer Zahl oder Uhrzeit ("Pazartesi, 08:00" in Klammern,
  // Glossar Regel 6), nach der Zahl Einzahl ("15 dakika").
  if (sprache === "tr")
    return [
      {
        kopf: "Sadece haftalık dakika sayısı",
        sie:
          "Haftalık hedef, bütün hafta için bir dakika sayısıdır - o kadar. Hedef " +
          "60 dakikaysa ve öğrenci 45 dakika çalıştıysa, geriye 15 dakika kalır.",
        du:
          "Haftalık hedefin, bütün hafta için bir dakika sayısıdır. Hedefin 60 " +
          "dakikaysa ve 45 dakika çalıştıysan, geriye 15 dakika kalır.",
      },
      {
        kopf: "Değişiklik ne zaman geçerli olur",
        sie:
          "Değiştirilen hedef bir sonraki hafta başından geçerli olur (Pazartesi, 08:00) - " +
          "içinde bulunulan hafta önceki hedefini korur. Bir pencere size kesin tarihi " +
          "önceden gösterir.",
        du:
          "Öğretmenin haftalık hedefini değiştirirse, yeni hedef bir sonraki hafta " +
          "başından geçerli olur (Pazartesi, 08:00). O zamana kadar eski hedef geçerlidir.",
      },
    ];
  // ★ O-PL (02.10.2026): polnisch - Lehrkraft unpersönlich, Kind „ty"; die
  // Zahl steht nur in festen Wendungen („45 z 60"), Partizip an „cel" (m.),
  // nie an der Person (Glossar Regel 2); „w następny poniedziałek" (§2.10).
  if (sprache === "pl")
    return [
      {
        kopf: "Po prostu minuty w tygodniu",
        sie:
          "Cel tygodniowy to liczba minut na cały tydzień - nic więcej. Jeśli ktoś " +
          "ćwiczy 45 z 60 zaplanowanych minut, brakuje jeszcze 15 minut.",
        du:
          "Twój cel tygodniowy to liczba minut na cały tydzień. Jeśli ćwiczysz " +
          "45 z 60 minut, brakuje ci jeszcze 15.",
      },
      {
        kopf: "Od kiedy obowiązuje zmiana",
        sie:
          "Zmieniony cel obowiązuje od 8:00 w następny poniedziałek - bieżący tydzień " +
          "zachowuje dotychczasowy cel. Okno z komunikatem podaje wcześniej dokładną datę.",
        du:
          "Gdy twój cel tygodniowy zostanie zmieniony, nowy cel obowiązuje od 8:00 " +
          "w następny poniedziałek. Do tego czasu obowiązuje stary cel.",
      },
    ];
  // ★ O-IT (02.10.2026): italienisch - Lehrkraft neutral, Kind „tu"; „l'insegnante"
  // ohne Possessiv (Glossar Regel 2).
  if (sprache === "it")
    return [
      {
        kopf: "Semplicemente minuti alla settimana",
        sie:
          "L'obiettivo settimanale è un numero di minuti per tutta la settimana - " +
          "nient'altro. Se una persona si esercita per 45 dei 60 minuti previsti, " +
          "mancano ancora 15 minuti.",
        du:
          "Il tuo obiettivo settimanale è un numero di minuti per tutta la settimana. " +
          "Se ti eserciti per 45 minuti su 60, ne mancano ancora 15.",
      },
      {
        kopf: "Quando vale una modifica",
        sie:
          "Se l'obiettivo viene cambiato, il nuovo obiettivo vale a partire dal lunedì " +
          "successivo alle 8:00 - la settimana in corso mantiene l'obiettivo attuale. " +
          "Una finestra indica prima la data esatta.",
        du:
          "Se l'insegnante cambia il tuo obiettivo settimanale, il nuovo obiettivo vale " +
          "a partire dal lunedì successivo alle 8:00. Fino ad allora resta quello vecchio.",
      },
    ];
  // ★ E11a-5 (26.09.2026): französisch eigene Fassung - die Lehrkraft liest
  // « vous », das Kind « tu » (Bauplan F9). Vorher kannte die Funktion nur
  // „de"/„en".
  if (sprache === "fr")
    return [
      {
        kopf: "Simplement des minutes par semaine",
        sie:
          "L'objectif de la semaine est un nombre de minutes pour toute la semaine - " +
          "rien de plus. Si un ou une élève s'exerce 45 des 60 minutes prévues, il " +
          "reste 15 minutes.",
        du:
          "Ton objectif de la semaine est un nombre de minutes pour toute la semaine. " +
          "Si tu t'exerces 45 minutes sur 60, il t'en reste 15.",
      },
      {
        kopf: "Quand un changement s'applique",
        sie:
          "Si vous changez l'objectif, le nouvel objectif s'applique à partir du lundi " +
          "suivant à 8 h - la semaine en cours garde son objectif actuel. Une fenêtre " +
          "vous indique la date exacte à l'avance.",
        du:
          "Si ton enseignant ou ton enseignante change ton objectif de la semaine, le " +
          "nouvel objectif s'applique à partir du lundi suivant à 8 h. D'ici là, " +
          "l'ancien objectif reste valable.",
      },
    ];
  // ★ ES-O (27.09.2026): spanisch - Lehrkraft usted, Kind tú.
  if (sprache === "es")
    return [
      {
        kopf: "Simplemente minutos por semana",
        sie:
          "El objetivo semanal es un número de minutos para toda la semana - " +
          "nada más. Si alguien practica 45 de los 60 minutos previstos, le " +
          "quedan 15 minutos.",
        du:
          "Tu objetivo semanal es un número de minutos para toda la semana. " +
          "Si practicas 45 de 60 minutos, te quedan 15.",
      },
      {
        kopf: "Cuándo se aplica un cambio",
        sie:
          "Si cambia el objetivo, el nuevo se aplica a partir del lunes siguiente a " +
          "las 8 - la semana en curso conserva su objetivo. Una ventana le " +
          "indica antes la fecha exacta.",
        du:
          "Si tu docente cambia tu objetivo semanal, el nuevo se aplica a partir del " +
          "lunes siguiente a las 8. Hasta entonces sigue el objetivo anterior.",
      },
    ];
  if (sprache === "en")
    return [
      {
        kopf: "Simply minutes per week",
        sie:
          "The weekly goal is a number of minutes for the whole week - nothing " +
          "more. If a pupil practises 45 of the 60 minutes set, 15 minutes are " +
          "still to go.",
        du:
          "Your weekly goal is a number of minutes for the whole week. If you " +
          "practise 45 of 60 minutes, you still have 15 to go.",
      },
      {
        kopf: "When a change takes effect",
        sie:
          "If you change the goal, the new goal applies from 8am next Monday - " +
          "the current week keeps its previous goal. A pop-up tells you the exact " +
          "date beforehand.",
        du:
          "If your teacher changes your weekly goal, the new goal applies from " +
          "8am next Monday. Until then, the old goal stays.",
      },
    ];
  return [
    {
      kopf: "Minuten pro Woche, ohne Einheiten",
      sie:
        "Das Wochenziel ist eine Minutenzahl für die ganze Woche - ohne " +
        "Einheiten. Übt ein Kind 45 von 60 geforderten Minuten, fehlen ihm " +
        "noch 15 Minuten.",
      du:
        "Dein Wochenziel ist eine Minutenzahl für die ganze Woche. Übst du " +
        "45 von 60 Minuten, fehlen dir noch 15.",
    },
    {
      kopf: "Ab wann eine Änderung gilt",
      sie:
        "Ändern Sie das Ziel, gilt es ab dem nächsten Montag, 8:00 Uhr - die " +
        "laufende Woche behält ihr bisheriges Ziel. Ein Popup nennt vorher " +
        "das genaue Datum.",
      du:
        "Ändert deine Lehrkraft dein Wochenziel, gilt es ab dem nächsten " +
        "Montag um 8 Uhr. Bis dahin bleibt es beim alten Ziel.",
    },
  ];
}
