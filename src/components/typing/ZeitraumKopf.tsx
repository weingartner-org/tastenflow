/**
 * ★★ Der Zeitraum-Kopf über der Lernenden-Tabelle (01.09.2026, Kopf
 * neu geordnet 18.09.2026, Bauplan „Meine Klassen" E1).
 *
 * Johannes: *„die Wochenpfeiltasten sind gut, aber vielleicht links, und mittig
 * ein schalter, schuljahr, und rechts ein schalter gesamt"* - und: *„dieser
 * kopf soll bei der schülerstatistik-Tabelle sein, nicht beim streifen."*
 * Und am 18.09.: *„Überschrift der Leistungstabelle: Links nur die Klasse
 * (nicht Lernende), rechts daneben die Schalter Woche; Schuljahr; …"*
 *
 *     Klasse 3b     ◀ vorige Woche  Woche 15.-21.09.  Schuljahr 2026/27  Gesamt  nächste Woche ▶  [Excel]
 *     └── links ──┘ └──────────────────────────────── rechts, EINE Gruppe ─────────────────────────────┘
 *
 * Links steht seit E1 nur noch der Klassenname - er ändert sich innerhalb
 * einer Sitzung nicht. Der Zeitraum wandert an die rechten Schalter: Der
 * gedrückte „Woche"-Schalter trägt sein eigenes Datum, „Schuljahr" seine
 * Jahreszahl, „Gesamt" braucht keine. Für die Sprachausgabe bleibt der volle
 * Satz („Diese Woche, 15.09. bis 21.09.") unsichtbar erhalten (`titel`,
 * `${titelId}-periode`) - siehe die Komponente unten.
 *
 * ── ⚠️ NICHTS WIRD `disabled` (Hausregel R10) ──────────────────────────────
 * Steht die Tabelle auf „Schuljahr", wären die Pfeiltasten für ein Wochen-
 * Blättern zunächst sinnlos. Ausgrauen wäre die falsche Antwort: Ein
 * abgeschalteter Schalter ist für eine Sprachausgabe eine Sackgasse ohne
 * Begründung. Stattdessen **führen die Pfeile zurück in die Wochenansicht** -
 * sie tun also immer etwas, und zwar das Naheliegende.
 *
 * ── ⚠️ Warum am Schalter ein Datum steht und nicht nur „Woche" ─────────────
 * Wer zweimal blättert, muss sehen, wo er ist. „Vorige Woche" ist nach dem
 * zweiten Druck gelogen; das Datum stimmt immer.
 *
 * ★ Die Pfeiltasten des WOCHENSTREIFENS bleiben davon unberührt - der Streifen
 * behält seine eigenen (Johannes: „der streifen bleibt immer beim schuljahr").
 * Diese hier sind Schalter, keine Tastenbelegung: Sie hören nicht auf
 * `keydown` am Bereich und können dem Streifen darum nichts wegnehmen.
 */
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import type { Zeitraum, ZeitraumArt } from "@/lib/typing/zeitraum";
import { schuljahrLabelCs, schuljahrLabelTr } from "@/lib/typing/zeitraum";
import { Tipp } from "@/components/Tipp";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { wahlTexte } from "@/lib/typing/wahltaste";

/**
 * ★ EN6a (19.09.2026): die Texte des Kopfes in beiden Bedienungssprachen -
 * GEMEINSAMER TEIL (auch Punktgenau): englisch nur über den Provider, ohne
 * ihn bleibt alles Zeichen für Zeichen deutsch. Glossar §3.2: *Week · Month ·
 * School year · All time*; „Monat" meint die letzten 4 Wochen, nicht den
 * Kalendermonat. Ohne Maus-Wörter (§1.3).
 */
const KOPF_TEXTE = texte({
  de: {
    vorigesSchuljahr: "voriges Schuljahr",
    naechstesSchuljahr: "nächstes Schuljahr",
    vorigerMonat: "voriger Monat",
    naechsterMonat: "nächster Monat",
    vorigeWoche: "vorige Woche",
    naechsteWoche: "nächste Woche",
    inDerTabelle: (wort: string) => `${wort} in der Tabelle`,
    woche: "Woche",
    wocheMit: (bereich: string) => `Woche ${bereich}`,
    monat: "Monat",
    monatMit: (bereich: string) => `Monat ${bereich}`,
    schuljahrTipp: (label: string) => `Zeigt die Tabelle für das ganze Schuljahr ${label}.`,
    schuljahr: (label: string) => ["Schuljahr ", label],
    gesamt: "Gesamt",
    blaetternTipp:
      "Alt + ← und Alt + → blättern überall in dieser Ansicht. Die Pfeiltasten allein bewegen in der Tabelle von Zelle zu Zelle.",
    wocheTipp:
      "Zeigt die Tabelle für eine einzelne Woche. Blättern (Alt + ← / Alt + →) kehrt automatisch wieder hierher zurück.",
    monatTipp: `„Monat" sind die letzten 4 Wochen bis einschliesslich der laufenden Woche (immer ab Montag, 8:00 Uhr) - nicht der Kalendermonat.`,
    gleichTipp: (label: string) =>
      `„Schuljahr" und „Gesamt" zeigen in dieser Klasse dieselben Zahlen - vor dem Schuljahr ${label} wurde noch nichts geübt.`,
  },
  en: {
    vorigesSchuljahr: "previous school year",
    naechstesSchuljahr: "next school year",
    vorigerMonat: "previous month",
    naechsterMonat: "next month",
    vorigeWoche: "previous week",
    naechsteWoche: "next week",
    inDerTabelle: (wort: string) => `${wort} in the table`,
    woche: "Week",
    wocheMit: (bereich: string) => `Week ${bereich}`,
    monat: "Month",
    monatMit: (bereich: string) => `Month ${bereich}`,
    schuljahrTipp: (label: string) => `Shows the table for the whole school year ${label}.`,
    schuljahr: (label: string) => ["School year ", label],
    gesamt: "All time",
    blaetternTipp:
      "Alt + ← and Alt + → move back and forth from anywhere in this view. The arrow keys on their own move from cell to cell in the table.",
    wocheTipp:
      "Shows the table for a single week. Moving back or forth with Alt + ← / Alt + → brings you back here automatically.",
    monatTipp:
      "“Month” means the last 4 weeks up to and including the current week (always from 8am on Monday) - not the calendar month.",
    gleichTipp: (label: string) =>
      `“School year” and “All time” show the same figures for this class - nothing was practised before the school year ${label}.`,
  },
  fr: {
    vorigesSchuljahr: "année scolaire précédente",
    naechstesSchuljahr: "année scolaire suivante",
    vorigerMonat: "mois précédent",
    naechsterMonat: "mois suivant",
    vorigeWoche: "semaine précédente",
    naechsteWoche: "semaine suivante",
    inDerTabelle: (wort: string) => `${wort} dans le tableau`,
    woche: "Semaine",
    wocheMit: (bereich: string) => `Semaine ${bereich}`,
    monat: "Mois",
    monatMit: (bereich: string) => `Mois ${bereich}`,
    schuljahrTipp: (label: string) => `Affiche le tableau pour toute l'année scolaire ${label}.`,
    schuljahr: (label: string) => ["Année scolaire ", label],
    gesamt: "Total",
    blaetternTipp:
      "Alt + ← et Alt + → naviguent partout dans cette vue. Les flèches seules déplacent de cellule en cellule dans le tableau.",
    wocheTipp:
      "Affiche le tableau pour une seule semaine. En naviguant avec Alt + ← ou Alt + →, on revient ici automatiquement.",
    monatTipp:
      '"Mois" désigne les 4 dernières semaines jusqu\'à la semaine en cours incluse (toujours à partir du lundi 8 h) - pas le mois calendaire.',
    gleichTipp: (label: string) =>
      `"Année scolaire" et "Total" affichent les mêmes chiffres pour cette classe - rien n'a été exercé avant l'année scolaire ${label}.`,
  },
  // ★ ES-O (27.09.2026): liest die Lehrkraft - usted, wo es eine Anrede braucht.
  es: {
    vorigesSchuljahr: "curso escolar anterior",
    naechstesSchuljahr: "curso escolar siguiente",
    vorigerMonat: "mes anterior",
    naechsterMonat: "mes siguiente",
    vorigeWoche: "semana anterior",
    naechsteWoche: "semana siguiente",
    inDerTabelle: (wort: string) => `${wort} en la tabla`,
    woche: "Semana",
    wocheMit: (bereich: string) => `Semana ${bereich}`,
    monat: "Mes",
    monatMit: (bereich: string) => `Mes ${bereich}`,
    schuljahrTipp: (label: string) => `Muestra la tabla de todo el curso escolar ${label}.`,
    schuljahr: (label: string) => ["Curso escolar ", label],
    gesamt: "Total",
    blaetternTipp:
      "Alt + ← y Alt + → pasan de periodo en toda esta vista. Las flechas solas se mueven de celda en celda dentro de la tabla.",
    wocheTipp:
      "Muestra la tabla de una sola semana. Al pasar de periodo con Alt + ← o Alt + → se vuelve aquí automáticamente.",
    monatTipp:
      '"Mes" son las últimas 4 semanas hasta la semana en curso incluida (siempre desde el lunes a las 8) - no el mes del calendario.',
    gleichTipp: (label: string) =>
      `"Curso escolar" y "Total" muestran las mismas cifras en esta clase - antes del curso escolar ${label} no se practicó nada.`,
  },
  // ★ O-IT (02.10.2026): „Settimana · Mese · Anno scolastico · Dall'inizio" (Glossar §2.6).
  it: {
    vorigesSchuljahr: "anno scolastico precedente",
    naechstesSchuljahr: "anno scolastico successivo",
    vorigerMonat: "mese precedente",
    naechsterMonat: "mese successivo",
    vorigeWoche: "settimana precedente",
    naechsteWoche: "settimana successiva",
    inDerTabelle: (wort: string) => `${wort} nella tabella`,
    woche: "Settimana",
    wocheMit: (bereich: string) => `Settimana ${bereich}`,
    monat: "Mese",
    monatMit: (bereich: string) => `Mese ${bereich}`,
    schuljahrTipp: (label: string) => `Mostra la tabella di tutto l'anno scolastico ${label}.`,
    schuljahr: (label: string) => ["Anno scolastico ", label],
    gesamt: "Dall'inizio",
    blaetternTipp:
      "Alt + ← e Alt + → passano da un periodo all'altro in tutta questa vista. Le frecce da sole si spostano da una cella all'altra nella tabella.",
    wocheTipp:
      "Mostra la tabella di una sola settimana. Passando da un periodo all'altro con Alt + ← o Alt + → si torna qui da soli.",
    monatTipp:
      `"Mese" sono le ultime 4 settimane fino alla settimana in corso compresa (sempre dal lunedì alle 8:00) - non il mese del calendario.`,
    gleichTipp: (label: string) =>
      `"Anno scolastico" e "Dall'inizio" mostrano gli stessi numeri in questa classe - prima dell'anno scolastico ${label} non ci sono stati esercizi.`,
  },
  // ★ O-PL (02.10.2026): „Tydzień · Miesiąc · Rok szkolny · Od początku" (Glossar
  // §2.6); liest die Lehrkraft - Beschreibungen unpersönlich (Regel 1).
  pl: {
    vorigesSchuljahr: "poprzedni rok szkolny",
    naechstesSchuljahr: "następny rok szkolny",
    vorigerMonat: "poprzedni miesiąc",
    naechsterMonat: "następny miesiąc",
    vorigeWoche: "poprzedni tydzień",
    naechsteWoche: "następny tydzień",
    inDerTabelle: (wort: string) => `${wort} w tabeli`,
    woche: "Tydzień",
    wocheMit: (bereich: string) => `Tydzień ${bereich}`,
    monat: "Miesiąc",
    monatMit: (bereich: string) => `Miesiąc ${bereich}`,
    schuljahrTipp: (label: string) => `Pokazuje tabelę za cały rok szkolny ${label}.`,
    schuljahr: (label: string) => ["Rok szkolny ", label],
    gesamt: "Od początku",
    blaetternTipp:
      "Alt + ← i Alt + → zmieniają okres w całym tym widoku. Same strzałki przenoszą w tabeli z komórki do komórki.",
    wocheTipp:
      "Pokazuje tabelę za jeden tydzień. Po zmianie okresu za pomocą Alt + ← lub Alt + → widok sam wraca tutaj.",
    monatTipp:
      "„Miesiąc” to ostatnie 4 tygodnie łącznie z bieżącym tygodniem (zawsze od poniedziałku, 8:00) - nie miesiąc kalendarzowy.",
    gleichTipp: (label: string) =>
      `„Rok szkolny” i „Od początku” pokazują w tej klasie te same liczby - przed rokiem szkolnym ${label} nie było jeszcze ćwiczeń.`,
  },
  // ★ O-TR (02.10.2026): "Hafta · Ay · Öğretim yılı · Başından beri" (Glossar
  // §2.6); liest die Lehrkraft - Beschreibungen ohne Befehlsform (Regel 1).
  // Woche als "14-20 Eyl haftası" (Endung an "hafta"), Wochenbeginn
  // "Hafta başlangıcı: Pazartesi, 08:00" (§2.10), keine Endung an Jahr/Zahl.
  tr: {
    vorigesSchuljahr: "önceki öğretim yılı",
    naechstesSchuljahr: "sonraki öğretim yılı",
    vorigerMonat: "önceki ay",
    naechsterMonat: "sonraki ay",
    vorigeWoche: "önceki hafta",
    naechsteWoche: "sonraki hafta",
    inDerTabelle: (wort: string) => `Tabloda: ${wort}`,
    woche: "Hafta",
    wocheMit: (bereich: string) => `${bereich} haftası`,
    monat: "Ay",
    monatMit: (bereich: string) => `Ay: ${bereich}`,
    schuljahrTipp: (label: string) => `Tabloyu ${schuljahrLabelTr(label)} öğretim yılının tamamı için gösterir.`,
    schuljahr: (label: string) => ["Öğretim yılı ", schuljahrLabelTr(label)],
    gesamt: "Başından beri",
    blaetternTipp:
      "Alt + ← ve Alt + → bu görünümün her yerinde dönemi değiştirir. Ok tuşları tek başına tabloda hücreden hücreye geçer.",
    wocheTipp:
      "Tabloyu tek bir hafta için gösterir. Alt + ← veya Alt + → ile dönem değiştirildiğinde görünüm kendiliğinden buraya döner.",
    monatTipp:
      '"Ay", içinde bulunulan hafta dahil son 4 haftadır - takvim ayı değildir. Hafta başlangıcı: Pazartesi, 08:00.',
    gleichTipp: (label: string) =>
      `Bu sınıfta "Öğretim yılı" ve "Başından beri" aynı sayıları gösterir - ${schuljahrLabelTr(label)} öğretim yılından önce henüz alıştırma yapılmadı.`,
  },
  // ★ O-CS (03.10.2026): „Týden · Měsíc · Školní rok · Od začátku" (Glossar
  // §2.6); liest die Lehrkraft - Beschreibungen in der dritten Person (Regel
  // 1). Woche „Týden 14.-20. 9." (ohne Nummer), Schuljahr „2025/2026"
  // (`schuljahrLabelCs`); kein Satz endet auf einer Jahreszahl mit Punkt
  // (Glossar §4 Falle 4); Ansichtsnamen ohne Anführung, mit „zobrazení" davor.
  cs: {
    vorigesSchuljahr: "předchozí školní rok",
    naechstesSchuljahr: "příští školní rok",
    vorigerMonat: "předchozí měsíc",
    naechsterMonat: "příští měsíc",
    vorigeWoche: "předchozí týden",
    naechsteWoche: "příští týden",
    inDerTabelle: (wort: string) => `V tabulce: ${wort}`,
    woche: "Týden",
    wocheMit: (bereich: string) => `Týden ${bereich}`,
    monat: "Měsíc",
    monatMit: (bereich: string) => `Měsíc ${bereich}`,
    schuljahrTipp: (label: string) =>
      `Zobrazí tabulku za celý školní rok ${schuljahrLabelCs(label)} - od začátku do konce.`,
    schuljahr: (label: string) => ["Školní rok ", schuljahrLabelCs(label)],
    gesamt: "Od začátku",
    blaetternTipp:
      "Alt + ← a Alt + → mění období v celém tomto zobrazení. Samotné šipky přecházejí v tabulce z buňky do buňky.",
    wocheTipp:
      "Zobrazí tabulku za jeden týden. Po změně období pomocí Alt + ← nebo Alt + → se zobrazení samo vrátí sem.",
    monatTipp:
      "Zobrazení Měsíc jsou poslední 4 týdny včetně probíhajícího týdne (týden vždy začíná v pondělí v 8:00) - ne kalendářní měsíc.",
    gleichTipp: (label: string) =>
      `Zobrazení Školní rok a Od začátku ukazují v této třídě stejná čísla - před školním rokem ${schuljahrLabelCs(label)} se ještě necvičilo.`,
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      vorigesSchuljahr: "предходната учебна година",
      naechstesSchuljahr: "следващата учебна година",
      vorigerMonat: "предходният месец",
      naechsterMonat: "следващият месец",
      vorigeWoche: "предходната седмица",
      naechsteWoche: "следващата седмица",
      inDerTabelle: (wort: string) => `${wort} в таблицата`,
      woche: "Седмица",
      wocheMit: (bereich: string) => `Седмица ${bereich}`,
      monat: "Месец",
      monatMit: (bereich: string) => `Месец ${bereich}`,
      schuljahrTipp: (label: string) => `Показва таблицата за цялата учебна година ${label}.`,
      schuljahr: (label: string) => ["Учебна година ", label],
      gesamt: "От началото",
      blaetternTipp:
        "Alt + ← и Alt + → прелистват навсякъде в този изглед. Само стрелките местят от клетка на клетка в таблицата.",
      wocheTipp:
        "Показва таблицата за една седмица. Прелистването (Alt + ← / Alt + →) автоматично се връща тук.",
      monatTipp:
        "„Месец“ са последните 4 седмици до текущата включително (винаги от понеделник в 8:00) - не календарният месец.",
      gleichTipp: (label: string) =>
        `„Учебна година“ и „От началото“ показват в този клас едни и същи числа - преди учебната година ${label} още не е имало упражнения.`,
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      vorigesSchuljahr: "προηγούμενο σχολικό έτος",
      naechstesSchuljahr: "επόμενο σχολικό έτος",
      vorigerMonat: "προηγούμενος μήνας",
      naechsterMonat: "επόμενος μήνας",
      vorigeWoche: "προηγούμενη εβδομάδα",
      naechsteWoche: "επόμενη εβδομάδα",
      inDerTabelle: (wort: string) => `${wort} στον πίνακα`,
      woche: "Εβδομάδα",
      wocheMit: (bereich: string) => `Εβδομάδα ${bereich}`,
      monat: "Μήνας",
      monatMit: (bereich: string) => `Μήνας ${bereich}`,
      schuljahrTipp: (label: string) => `Εμφανίζει τον πίνακα για όλο το σχολικό έτος ${label}.`,
      schuljahr: (label: string) => ["Σχολικό έτος ", label],
      gesamt: "Από την αρχή",
      blaetternTipp:
        "Με Alt + ← και Alt + → μετακινείστε μπρος και πίσω από οπουδήποτε σε αυτή την προβολή. Τα πλήκτρα βέλους μόνα τους μετακινούν από κελί σε κελί στον πίνακα.",
      wocheTipp:
        "Εμφανίζει τον πίνακα για μία μόνο εβδομάδα. Με Alt + ← / Alt + → επιστρέφετε αυτόματα εδώ.",
      monatTipp:
        "Ο «Μήνας» είναι οι τελευταίες 4 εβδομάδες μέχρι και την τρέχουσα εβδομάδα (πάντα από Δευτέρα, 8:00) - όχι ο ημερολογιακός μήνας.",
      gleichTipp: (label: string) =>
        `Το «Σχολικό έτος» και το «Από την αρχή» δείχνουν τους ίδιους αριθμούς για αυτό το τμήμα - πριν από το σχολικό έτος ${label} δεν έγινε εξάσκηση.`,
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      vorigesSchuljahr: "előző tanév",
      naechstesSchuljahr: "következő tanév",
      vorigerMonat: "előző hónap",
      naechsterMonat: "következő hónap",
      vorigeWoche: "előző hét",
      naechsteWoche: "következő hét",
      inDerTabelle: (wort: string) => `${wort} a táblázatban`,
      woche: "Hét",
      wocheMit: (bereich: string) => `Hét: ${bereich}`,
      monat: "Hónap",
      monatMit: (bereich: string) => `Hónap: ${bereich}`,
      schuljahrTipp: (label: string) => `A teljes tanév táblázatát mutatja: ${label}.`,
      schuljahr: (label: string) => ["Tanév ", label],
      gesamt: "Kezdettől",
      blaetternTipp:
        "Az Alt + ← és az Alt + → ebben a nézetben mindenhol lapoz. A nyílbillentyűk önmagukban a táblázatban cellánként mozognak.",
      wocheTipp:
        "Egyetlen hét táblázatát mutatja. Lapozás után (Alt + ← / Alt + →) automatikusan ide tér vissza.",
      monatTipp:
        "A „Hónap” az utolsó 4 hét, az aktuális héttel együtt (mindig hétfő 8:00-tól) - nem a naptári hónap.",
      gleichTipp: (label: string) =>
        `A „Tanév” és a „Kezdettől” ebben az osztályban ugyanazokat a számokat mutatja - a tanév előtt (${label}) még nem volt gyakorlás.`,
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      vorigesSchuljahr: "vorig schooljaar",
      naechstesSchuljahr: "volgend schooljaar",
      vorigerMonat: "vorige maand",
      naechsterMonat: "volgende maand",
      vorigeWoche: "vorige week",
      naechsteWoche: "volgende week",
      inDerTabelle: (wort: string) => `${wort} in de tabel`,
      woche: "Week",
      wocheMit: (bereich: string) => `Week ${bereich}`,
      monat: "Maand",
      monatMit: (bereich: string) => `Maand ${bereich}`,
      schuljahrTipp: (label: string) => `Toont de tabel voor het hele schooljaar ${label}.`,
      schuljahr: (label: string) => ["Schooljaar ", label],
      gesamt: "Vanaf het begin",
      blaetternTipp:
        "Met Alt + ← en Alt + → blader je overal in deze weergave. De pijltoetsen alleen gaan in de tabel van cel naar cel.",
      wocheTipp:
        "Toont de tabel voor één week. Bladeren (Alt + ← / Alt + →) brengt je vanzelf weer hier terug.",
      monatTipp:
        "\"Maand\" zijn de laatste 4 weken tot en met de lopende week (altijd vanaf maandag 8.00 uur) - niet de kalendermaand.",
      gleichTipp: (label: string) =>
        `"Schooljaar" en "Vanaf het begin" tonen in deze klas dezelfde getallen - voor het schooljaar ${label} is er nog niet geoefend.`,
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      vorigesSchuljahr: "ano letivo anterior",
      naechstesSchuljahr: "ano letivo seguinte",
      vorigerMonat: "mês anterior",
      naechsterMonat: "mês seguinte",
      vorigeWoche: "semana anterior",
      naechsteWoche: "semana seguinte",
      inDerTabelle: (wort: string) => `${wort} na tabela`,
      woche: "Semana",
      wocheMit: (bereich: string) => `Semana ${bereich}`,
      monat: "Mês",
      monatMit: (bereich: string) => `Mês ${bereich}`,
      schuljahrTipp: (label: string) => `Mostra a tabela de todo o ano letivo ${label}.`,
      schuljahr: (label: string) => ["Ano letivo ", label],
      gesamt: "Desde o início",
      blaetternTipp:
        "Alt + ← e Alt + → permitem andar para trás e para a frente em qualquer ponto desta vista. As teclas de seta sozinhas passam de célula em célula na tabela.",
      wocheTipp:
        "Mostra a tabela de uma única semana. Ao andar para trás ou para a frente com Alt + ← / Alt + →, volta automaticamente para aqui.",
      monatTipp:
        "\"Mês\" são as últimas 4 semanas até à semana atual, inclusive (sempre a partir de segunda-feira às 08:00) - não o mês do calendário.",
      gleichTipp: (label: string) =>
        `"Ano letivo" e "Desde o início" mostram os mesmos números nesta turma - antes do ano letivo ${label} ainda não se tinha praticado nada.`,
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      vorigesSchuljahr: "ano letivo anterior",
      naechstesSchuljahr: "próximo ano letivo",
      vorigerMonat: "mês anterior",
      naechsterMonat: "próximo mês",
      vorigeWoche: "semana anterior",
      naechsteWoche: "próxima semana",
      inDerTabelle: (wort: string) => `${wort} na tabela`,
      woche: "Semana",
      wocheMit: (bereich: string) => `Semana ${bereich}`,
      monat: "Mês",
      monatMit: (bereich: string) => `Mês ${bereich}`,
      schuljahrTipp: (label: string) => `Mostra a tabela do ano letivo ${label} inteiro.`,
      schuljahr: (label: string) => ["Ano letivo ", label],
      gesamt: "Desde o início",
      blaetternTipp:
        "Alt + ← e Alt + → avançam e voltam de qualquer lugar desta visualização. Só as teclas de seta movem de célula em célula na tabela.",
      wocheTipp:
        "Mostra a tabela de uma única semana. Avançar ou voltar com Alt + ← / Alt + → traz você de volta aqui automaticamente.",
      monatTipp: `"Mês" são as últimas 4 semanas até a semana atual, inclusive (sempre a partir de segunda-feira às 8:00) - não o mês do calendário.`,
      gleichTipp: (label: string) =>
        `"Ano letivo" e "Desde o início" mostram os mesmos números nesta turma - nada foi praticado antes do ano letivo ${label}.`,
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      vorigesSchuljahr: "anul școlar anterior",
      naechstesSchuljahr: "anul școlar următor",
      vorigerMonat: "luna anterioară",
      naechsterMonat: "luna următoare",
      vorigeWoche: "săptămâna anterioară",
      naechsteWoche: "săptămâna următoare",
      inDerTabelle: (wort: string) => `${wort} în tabel`,
      woche: "Săptămână",
      wocheMit: (bereich: string) => `Săptămâna ${bereich}`,
      monat: "Lună",
      monatMit: (bereich: string) => `Luna ${bereich}`,
      schuljahrTipp: (label: string) => `Arată tabelul pentru tot anul școlar ${label}.`,
      schuljahr: (label: string) => ["An școlar ", label],
      gesamt: "De la început",
      blaetternTipp:
        "Alt + ← și Alt + → răsfoiesc de oriunde din această vizualizare. Săgețile singure mută de la o celulă la alta în tabel.",
      wocheTipp:
        "Arată tabelul pentru o singură săptămână. Răsfoirea (Alt + ← / Alt + →) revine automat aici.",
      monatTipp:
        "„Lună” înseamnă ultimele 4 săptămâni, inclusiv săptămâna curentă (mereu de luni de la ora 8:00) - nu luna calendaristică.",
      gleichTipp: (label: string) =>
        `„An școlar” și „De la început” arată aceleași cifre pentru această clasă - înainte de anul școlar ${label} nu s-a exersat nimic.`,
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      vorigesSchuljahr: "förra läsåret",
      naechstesSchuljahr: "nästa läsår",
      vorigerMonat: "förra månaden",
      naechsterMonat: "nästa månad",
      vorigeWoche: "förra veckan",
      naechsteWoche: "nästa vecka",
      inDerTabelle: (wort: string) => `${wort} i tabellen`,
      woche: "Vecka",
      wocheMit: (bereich: string) => `Vecka ${bereich}`,
      monat: "Månad",
      monatMit: (bereich: string) => `Månad ${bereich}`,
      schuljahrTipp: (label: string) => `Visar tabellen för hela läsåret ${label}.`,
      schuljahr: (label: string) => ["Läsår ", label],
      gesamt: "Från början",
      blaetternTipp:
        "Alt + ← och Alt + → bläddrar var som helst i den här vyn. Piltangenterna ensamma flyttar från cell till cell i tabellen.",
      wocheTipp:
        "Visar tabellen för en enskild vecka. Bläddrar du (Alt + ← / Alt + →) kommer du automatiskt tillbaka hit.",
      monatTipp: `"Månad" är de senaste 4 veckorna till och med den pågående veckan (alltid från måndag klockan 08:00) - inte kalendermånaden.`,
      gleichTipp: (label: string) =>
        `"Läsår" och "Från början" visar samma siffror i den här klassen - före läsåret ${label} övades det inte.`,
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      vorigesSchuljahr: "попередній навчальний рік",
      naechstesSchuljahr: "наступний навчальний рік",
      vorigerMonat: "попередній місяць",
      naechsterMonat: "наступний місяць",
      vorigeWoche: "попередній тиждень",
      naechsteWoche: "наступний тиждень",
      inDerTabelle: (wort: string) => `${wort} у таблиці`,
      woche: "Тиждень",
      wocheMit: (bereich: string) => `Тиждень ${bereich}`,
      monat: "Місяць",
      monatMit: (bereich: string) => `Місяць ${bereich}`,
      // Das Jahr nicht vor den Satzpunkt: die Stimme läse sonst eine Ordnungszahl.
      schuljahrTipp: (label: string) => `Навчальний рік ${label}: показує таблицю за весь рік.`,
      schuljahr: (label: string) => ["Навчальний рік ", label],
      gesamt: "Від початку",
      blaetternTipp:
        "Alt + ← і Alt + → гортають будь-де в цьому поданні. Самі лише клавіші зі стрілками переходять у таблиці від клітинки до клітинки.",
      wocheTipp:
        "Показує таблицю за один тиждень. Гортання (Alt + ← / Alt + →) автоматично повертає сюди.",
      monatTipp:
        "«Місяць» - це останні 4 тижні до поточного тижня включно (завжди від понеділка 8:00), а не календарний місяць.",
      gleichTipp: (label: string) =>
        `«Навчальний рік» і «Від початку» показують у цьому класі однакові числа - до навчального року ${label} тренувань ще не було.`,
    },
});

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ ALT + ← / ALT + → BLÄTTERT DIE WOCHEN (Johannes, 01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Wörtlich: *„wir brauchen keine eigenen kürzel für die reiter der tabelle, mit
 * zeile soll man in der tabelle navigieren können wie in jeder anderen … mit
 * alt pfeil links und rechts schaltet man die wochen vor und rückwärts."*
 *
 * ── ⚠️ WARUM DIE BLANKEN PFEILE NICHT MEHR GEHEN DÜRFEN ────────────────────
 * Bis heute hörte dieser Kasten auf `←` und `→` ohne Zusatztaste. Das war
 * genau ein Kasten breit gedacht - aber die Tabelle darunter ist eine TABELLE,
 * und in einer Tabelle gehören die Pfeiltasten der Tabelle: JAWS, NVDA und
 * VoiceOver bewegen damit Zelle für Zelle, und die Spaltenüberschrift wird bei
 * jedem Schritt mitgelesen. Ein Kürzel auf der blanken Pfeiltaste nimmt genau
 * diese Bewegung weg, sobald es einen Schritt weiter greift als bis heute.
 *
 * Mit Alt sind beide Wege frei: die Pfeile für die Tabelle, Alt + Pfeil für die
 * Wochen. Und weil Alt + Pfeil in keiner Tabelle etwas bedeutet, darf der
 * Horcher jetzt über der GANZEN Ansicht hängen - man muss also nicht mehr erst
 * in den Zeitraum-Kasten zurückwandern, um weiterzublättern.
 *
 * ── ⚠️ WAS ES KOSTET (gemessen, nicht geschätzt) ───────────────────────────
 * Alt + ← ist in Chrome und Firefox unter Windows und Linux „eine Seite
 * zurück". `preventDefault()` nimmt dem Browser die Taste ab, solange der
 * Lesepunkt in dieser Ansicht steht. Das ist eine bewusste Übernahme, kein
 * Versehen - sie steht im Verzeichnis der Entscheidungen (`src/lib/shortcuts.ts`).
 * Auf dem Mac gibt es den Zusammenstoß nicht (dort ist es Cmd + [).
 *
 * ── ⚠️ In einem Eingabefeld gehören die Pfeiltasten dem Feld ───────────────
 * Auch mit Alt: Auf dem Mac springt Alt + ← im Text wortweise. Ein Feld unter
 * dem Fokus behält seine Tasten.
 */
export function wochenBlaetternTaste(
  blaettere: (schritt: number) => void,
): (e: ReactKeyboardEvent) => void {
  return (e) => {
    /*
      ⚠️ GEMESSEN AM 01.09.2026: Der Horcher hängt an ZWEI Stellen - am
      Zeitraum-Kopf und über der ganzen Ansicht. React reicht dasselbe Ereignis
      durch beide, und ohne diese Zeile blätterte ein Druck ZWEI Wochen weiter.
      Aufgefallen ist es erst am Wächter („Woche, 17.08. bis 23.08." statt
      „Vorige Woche"); im Browser hätte man es für ein Zittern gehalten.
    */
    if (e.defaultPrevented) return;
    if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName)) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      blaettere(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      blaettere(1);
    }
  };
}

/**
 * Blättern schaltet IMMER auf die Woche - auch aus „Schuljahr" oder „Gesamt"
 * heraus. Genau das macht das Ausgrauen entbehrlich (siehe unten).
 */
export function blaettereZeitraum(
  zeitraum: Zeitraum,
  schritt: number,
): Zeitraum {
  /*
    ★★ Die Pfeile blättern das, was gerade gewählt ist (Johannes 01.09.2026:
    „Wenn Schuljahr aktiv ist … muss bei den Pfeilen voriges Schuljahr und
    nächstes Schuljahr erscheinen"). Sie schalten die Ansicht also nicht mehr
    um - dafür gibt es seit heute den Schalter „Woche".
  */
  if (zeitraum.art === "schuljahr")
    return { ...zeitraum, jahrVersatz: (zeitraum.jahrVersatz ?? 0) + schritt };
  /*
    ★ K4 (19.09.2026): „Monat" blättert genauso in SICH SELBST weiter - vier
    Wochen je Schritt, siehe `zeitraum.ts`. Ohne diesen Fall fiele „Monat" in
    den Wochen-Fallback unten und würde bei jedem Blättern in die Wochenansicht
    zurückgeschaltet, obwohl es Eigenes zu blättern hat.
  */
  if (zeitraum.art === "monat")
    return { ...zeitraum, monatVersatz: (zeitraum.monatVersatz ?? 0) + schritt };
  /*
    ⚠️ Aus „Gesamt" heraus führen die Pfeile in die Wochenansicht zurück.
    „Gesamt" hat nichts zu blättern, und ein Schalter, der nichts tut, ist für
    eine Sprachausgabe eine Sackgasse ohne Begründung (Hausregel R10).
  */
  return {
    ...zeitraum,
    art: "woche",
    wochenVersatz:
      zeitraum.art === "woche" ? zeitraum.wochenVersatz + schritt : schritt,
  };
}

/** Wie die Blätter-Schalter heissen - das hängt daran, was gewählt ist. */
export function blaetterWort(
  zeitraum: Zeitraum,
  /** ★ EN6a: ohne Angabe Deutsch, genau wie vorher. */
  sprache: BedienSprache = "de",
): { vor: string; zurueck: string } {
  // ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): am Mac „Wahl" statt „Alt" im Text (`wahlTexte`).
  const t = wahlTexte(KOPF_TEXTE[sprache], sprache);
  if (zeitraum.art === "schuljahr")
    return { zurueck: t.vorigesSchuljahr, vor: t.naechstesSchuljahr };
  if (zeitraum.art === "monat") return { zurueck: t.vorigerMonat, vor: t.naechsterMonat };
  return { zurueck: t.vorigeWoche, vor: t.naechsteWoche };
}

export function ZeitraumKopf({
  zeitraum,
  onZeitraum,
  klasse,
  titel,
  wocheKompakt,
  monatKompakt,
  schuljahrLabel,
  /** Zeigen „Schuljahr" und „Gesamt" dasselbe? Dann steht ein Satz dabei. */
  gleichbedeutend = false,
  /** Verbindet die Überschrift mit der Tabelle darunter. */
  titelId,
  aktion,
}: {
  zeitraum: Zeitraum;
  onZeitraum: (z: Zeitraum) => void;
  /**
   * ★★ 18.09.2026 (Bauplan „Meine Klassen" E1): die einzige sichtbare
   * Überschrift links - „Klasse 3b". Fertig beschriftet von der aufrufenden
   * Stelle (`klassenBezeichnung`, `excelMarke.ts`), damit „Klasse" nicht
   * doppelt dasteht, wenn der Klassenname selbst schon so anfängt.
   */
  klasse: string;
  /**
   * Der volle Satz („Diese Woche, 15.09. bis 21.09." / „Schuljahr 2026/27" /
   * „Gesamt") - steht seit E1 nicht mehr sichtbar in der Überschrift, sondern
   * nur noch unsichtbar für die Sprachausgabe (unten, `${titelId}-periode`)
   * und als Beschreibung der Tabelle. Die Woche selbst trägt ihr Datum jetzt
   * am eigenen Schalter, siehe `wocheKompakt`.
   */
  titel: string;
  /**
   * ★ 18.09.2026: der KURZE Datumsbereich am „Woche"-Schalter, wenn er
   * gedrückt ist - z. B. „15.-21.09." (`wochenBereichKompakt`,
   * `lib/typing/zeitraum.ts`). Ungedrückt heisst der Schalter schlicht
   * „Woche".
   */
  wocheKompakt: string;
  /**
   * ★ K4 (19.09.2026): derselbe kurze Datumsbereich für den „Monat"-Schalter,
   * gedrückt - z. B. „24.08.-20.09." (`monatBereichKompakt`,
   * `lib/typing/zeitraum.ts`). Ungedrückt heisst der Schalter schlicht
   * „Monat".
   */
  monatKompakt: string;
  schuljahrLabel: string;
  gleichbedeutend?: boolean;
  titelId?: string;
  /**
   * ★ 12.09.2026: Ein Schalter, der rechts nach „Gesamt" steht - in Tastenflow
   * „Als Excel herunterladen". Optional: Wer nichts hineinreicht (Punktgenau),
   * bekommt den Kopf unverändert.
   */
  aktion?: ReactNode;
}) {
  const setzeArt = (art: ZeitraumArt) =>
    onZeitraum({ ...zeitraum, art });

  const blaettere = (schritt: number) =>
    onZeitraum(blaettereZeitraum(zeitraum, schritt));
  const { sprache } = useBedienSprache();
  // ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): am Mac „Wahl" statt „Alt" im Text (`wahlTexte`).
  const t = wahlTexte(KOPF_TEXTE[sprache], sprache);
  const wort = blaetterWort(zeitraum, sprache);

  /*
    ★ Die Hausform für Umschalter: `btn-toggle` ist der schlanke Segment-
    Schalter (~32 px), nicht der 44-px-Aktionsknopf. Genau so sieht der
    Bezug-Umschalter der Jahreskarte und das Blättern des Wochenstreifens aus -
    drei Umschalter auf einer Seite dürfen nicht drei Formen haben.
  */
  /*
    ⚠️ `whitespace-nowrap` ist hier kein Schmuck: Ohne es bricht „Schuljahr
    2026/27" auf zwei Zeilen um, und der Schalter steht dann mit 52 px neben
    „Woche" und „Gesamt" mit 32 px - drei Höhen in einer Leiste (gemessen im
    Browser am 01.09.2026, Johannes: „mach die Schalter und Ausklapplisten alle
    gleich hoch"). Eine Klassenangabe wie `h-8` wäre die falsche Antwort: Sie
    schnitte den Text ab, statt ihn nebeneinander zu lassen.
  */
  const schalter = (aktiv: boolean) =>
    (aktiv ? "btn-primary" : "btn-secondary") +
    " btn-toggle btn-umriss whitespace-nowrap text-sm";

  // ★ 18.09.2026: unsichtbare Beschreibung für die Tabelle - siehe unten.
  const periodeId = titelId ? `${titelId}-periode` : undefined;

  return (
    <div
      /*
        ★ R2 (11.09.2026, `BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md`):
        `rounded-xl` wie jeder Abschnitt der Karte - mit `rounded-lg` stand diese
        Leiste mit spitzeren Ecken zwischen „Wochenziel - Aufgabe" und der Tabelle.

        ★★ 18.09.2026, Bauplan E1: `zeitraum-kopf` benennt die Zeile als
        Behälter für den Excel-Schalter (`index.css`, `@container
        zeitraum-kopf`) - dieselbe Bauart wie `.standzeile-leiste` bei
        „Spielen"/„Klassenmatch". Die Abfrage hängt an DIESER Leiste, nicht am
        Bildschirm, weil der Kopf auch in schmäleren Karten steht.
      */
      className="zeitraum-kopf flex flex-wrap items-center justify-between gap-2 rounded-xl border border-hairline bg-surface-sunken px-3 py-2"
      /*
        ★★ DER HORCHER SITZT NICHT MEHR NUR HIER (01.09.2026).

        Alt + ← / Alt + → wird von der ganzen Lehrkraft-Ansicht behandelt
        (`wochenBlaetternTaste`, oben in dieser Datei) - man muss also nicht
        erst in diesen Kasten zurückwandern, um weiterzublättern. Dieser
        zweite Horcher hier bleibt trotzdem stehen: Der Kopf wird auch
        anderswo eingesetzt, und dort soll die Taste ebenfalls wirken.

        ⚠️ Zweimal behandelt wird sie deswegen nicht - `preventDefault()` im
        inneren Horcher hält das Ereignis nicht auf, aber React ruft den
        äusseren mit demselben Ereignis auf, und der prüft `defaultPrevented`.
      */
      onKeyDown={wochenBlaetternTaste(blaettere)}
    >
      {/*
        ── links: nur der Klassenname ───────────────────────────────────

        ★★ 18.09.2026 (Bauplan E1). Johannes: *„Überschrift der
        Leistungstabelle: Links nur die Klasse (nicht Lernende), rechts
        daneben die Schalter Woche; Schuljahr; …"* Der Zeitraum selbst steht
        seither an den Schaltern rechts (gedrückter „Woche"-Schalter trägt das
        Datum) - hier bleibt nur, was sich über eine ganze Sitzung nicht
        ändert.

        `titelId` bleibt (verbindet die Tabelle mit „welche Klasse"); die
        Beschreibung „welcher Zeitraum" übernimmt jetzt der unsichtbare Satz
        weiter unten (`periodeId`).
      */}
      <h3 id={titelId} className="m-0 min-w-0 whitespace-nowrap text-sm font-semibold text-ink">
        {klasse}
      </h3>

      {/*
        ── rechts: EINE Gruppe, die als Ganzes umbricht ──────────────────

        ★★★ 18.09.2026 (Bauplan E1): Blättern und Zeitraum stehen jetzt in
        derselben Gruppe - vorher links (Blättern) und rechts (Woche/
        Schuljahr/Gesamt) getrennt. Der Entwurf (ENTWURF-2026-09-18-MEINE-
        KLASSEN-UMBAU.html, `tabellenkopf-zeile`) zeigt sie so: ◀ Woche
        Schuljahr Gesamt ▶ Excel - EIN Fluss, der bei wenig Platz umbricht,
        statt zwei Flüsse, die unabhängig umbrechen und dabei aneinander
        vorbeirutschen können.

        ⚠️⚠️ GEMESSEN AM 01.09.2026 (gilt unverändert): Auf dieser Seite steht
        der WOCHENSTREIFEN mit Schaltern, die genauso heissen. Wer mit einer
        Sprachausgabe durchtabbt, hörte zweimal „vorige Woche, Schalter" und
        konnte nicht wissen, welcher den Streifen und welcher die Tabelle
        blättert. Darum tragen diese hier den Zusatz „in der Tabelle" im
        `aria-label`. ★ Der sichtbare Text steckt WÖRTLICH darin - sonst wäre
        es ein Verstoss gegen WCAG 2.5.3 („Label in Name"), und wer per
        Sprachbefehl „vorige Woche" sagt, träfe den Schalter nicht mehr.

        ★★★ „WOCHE" IST SEIT DEM 01.09.2026 EIN EIGENER SCHALTER. Johannes:
        *„in der Leiste über der Tabelle muss rechts auch ein Schalter mit
        „Woche" (links neben Schuljahr) erscheinen und der ist standardmäßig
        ausgewählt. Sonst weiß man nicht wie man auf Woche kommt wenn man in
        der Schuljahr-Auswahl ist."* Drei Schalter, von denen einer gedrückt
        ist, sagen von selbst, wo man ist und wohin man kann.
      */}
      <div className="flex flex-wrap items-center gap-2">
        {/*
          ★ 18.09.2026 (Johannes: „halte die Seite extrem schlank und mach
          keine dauerhaften Erklärungen unter den Schaltern, das geht mit
          Mouseover"): Der Satz zu Alt + Pfeil stand bis dahin als Absatz unter
          der Leiste - jetzt steht er im Hinweis der beiden Blätter-Schalter.
        */}
        <Tipp text={t.blaetternTipp} ausrichtung="links">
          {(hinweisId) => (
            <button
              type="button"
              aria-label={t.inDerTabelle(wort.zurueck)}
              aria-describedby={hinweisId}
              className="btn-secondary btn-toggle btn-umriss whitespace-nowrap text-sm"
              onClick={() => blaettere(-1)}
            >
              <span aria-hidden="true">◀</span> {wort.zurueck}
            </button>
          )}
        </Tipp>
        <Tipp text={t.wocheTipp}>
          {(hinweisId) => (
            <button
              type="button"
              aria-pressed={zeitraum.art === "woche"}
              aria-describedby={hinweisId}
              className={schalter(zeitraum.art === "woche")}
              onClick={() => setzeArt("woche")}
            >
              {/*
                ★ 18.09.2026: Gedrückt trägt der Schalter sein Datum - so weiss
                eine Lehrkraft, DIE Woche ist es, ohne dass eine eigene
                Überschrift danebenstehen muss. Ungedrückt reicht das Wort, das
                Blättern führt ohnehin sofort in die Wochenansicht zurück.
              */}
              {zeitraum.art === "woche" ? t.wocheMit(wocheKompakt) : t.woche}
            </button>
          )}
        </Tipp>
        {/*
          ★★ K4 (19.09.2026), Johannes: *„das Monat ist ein wichtiger Wert und
          wir brauchen ihn auch in der Tabelle."* Zwischen „Woche" und
          „Schuljahr" - wichtiger als die Woche, aber kein Ersatz für den
          Jahresüberblick. Der Tipp sagt, WAS „Monat" hier meint: die letzten
          4 Ziel-Wochen, nicht der Kalendermonat - sonst läse jemand „Monat"
          und suchte den 1. bis 30./31.
        */}
        <Tipp text={t.monatTipp}>
          {(hinweisId) => (
            <button
              type="button"
              aria-pressed={zeitraum.art === "monat"}
              aria-describedby={hinweisId}
              className={schalter(zeitraum.art === "monat")}
              onClick={() => setzeArt("monat")}
            >
              {zeitraum.art === "monat" ? t.monatMit(monatKompakt) : t.monat}
            </button>
          )}
        </Tipp>
        <Tipp text={t.schuljahrTipp(schuljahrLabel)}>
          {(hinweisId) => (
            <button
              type="button"
              aria-pressed={zeitraum.art === "schuljahr"}
              aria-describedby={hinweisId}
              className={schalter(zeitraum.art === "schuljahr")}
              onClick={() => setzeArt("schuljahr")}
            >
              {t.schuljahr(schuljahrLabel)}
            </button>
          )}
        </Tipp>
        {gleichbedeutend ? (
          <Tipp text={t.gleichTipp(schuljahrLabel)}>
            {(hinweisId) => (
              <button
                type="button"
                aria-pressed={zeitraum.art === "gesamt"}
                aria-describedby={hinweisId}
                className={schalter(zeitraum.art === "gesamt")}
                onClick={() => setzeArt("gesamt")}
              >
                {t.gesamt}
              </button>
            )}
          </Tipp>
        ) : (
          <button
            type="button"
            aria-pressed={zeitraum.art === "gesamt"}
            className={schalter(zeitraum.art === "gesamt")}
            onClick={() => setzeArt("gesamt")}
          >
            {t.gesamt}
          </button>
        )}
        <Tipp text={t.blaetternTipp}>
          {(hinweisId) => (
            <button
              type="button"
              aria-label={t.inDerTabelle(wort.vor)}
              aria-describedby={hinweisId}
              className="btn-secondary btn-toggle btn-umriss whitespace-nowrap text-sm"
              onClick={() => blaettere(1)}
            >
              {wort.vor} <span aria-hidden="true">▶</span>
            </button>
          )}
        </Tipp>
        {aktion}
      </div>

      {/*
        ★★ 18.09.2026: Der Zeitraum bleibt für die Sprachausgabe an der
        Tabelle - nur nicht mehr sichtbar. Die aufrufende Stelle verbindet die
        Tabelle über `aria-describedby` mit `titelId` (Klasse) UND dieser Id
        (Zeitraum) - siehe `TastenflowReiter.tsx`/`PunktgenauReiter.tsx`.
        `sr-only`, nicht `display:none`: Der Satz bleibt damit für jede
        Sprachausgabe und Braillezeile lesbar (Hausform wie beim `<caption>`).
      */}
      {periodeId && (
        <span id={periodeId} className="sr-only">
          {titel}
        </span>
      )}

    </div>
  );
}

/*
 * Die Hinweise des Kopfes stehen seit EN6a (19.09.2026) in `KOPF_TEXTE` oben:
 *  · `blaetternTipp` - an ◀ und ▶ (vorher ein Absatz unter der Leiste, 18.09.2026);
 *  · `wocheTipp` - ★ K2 (19.09.2026): „Woche" und „Schuljahr" waren die
 *    einzigen zwei Schalter dieser Reihe ohne eigenen Hinweis - „Monat" (K4)
 *    und „Gesamt" hatten schon einen. Gemessen im Browser, nicht geraten;
 *  · `monatTipp` - ★ K4 (19.09.2026): was „Monat" hier bedeutet - entschieden
 *    (im Chat gesagt): die letzten 4 Wochen, nicht der Kalendermonat;
 *  · `gleichTipp` - ⚠️ Zwei Schalter, die dasselbe zeigen, sehen aus wie ein
 *    Fehler. Im ersten Jahr ist das der Normalfall - also wird es gesagt (im
 *    Hinweis an „Gesamt", seit 18.09.2026 nicht mehr als Absatz), statt einen
 *    der beiden zu verstecken.
 */
