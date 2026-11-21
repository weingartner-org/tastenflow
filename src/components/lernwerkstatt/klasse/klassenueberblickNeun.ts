/**
 * ★ O5 (30.10.2026): die Sätze des Klassenüberblicks für bg el hu nl pt br ro sv uk.
 *
 * Bis dahin steuerten dort die Merker `cs`, `pl`, `tr`, `it`, `fr`, `es`, `en` Ternär-Ketten, und jede der neun
 * Sprachen fiel am Ende auf den deutschen Satz (Falle 30): die Zahlen waren übersetzt, der Satz im Hinweis nicht.
 * Eine Tabelle je Sprache, dieselbe Rechnung für alle; die Sätze zum Vergleich kommen aus `KETTEN_NEUN`
 * (`satzHoch` usw., `einheit`), damit Tabelle und Überblick dieselben Wörter benutzen.
 *
 * Zahlen stehen möglichst in Klammern oder hinter einem Doppelpunkt: dort beugt sich nichts mit, und kein Satz endet
 * auf einer Zahl mit Punkt (die Stimme läse sonst eine Ordnungszahl).
 */
import { mehrzahl } from "@/lib/bedienSprache";
import { topfLabel } from "@/lib/typing/jahreskarte";
import { KETTEN_NEUN } from "@/lib/typing/kettenNeun";
import type { Aufgabenkennzahl, Kennzahl, UeberblickArt } from "@/lib/typing/klassenueberblick";
import type { GeruestSprache } from "@/lib/typing/sprachRegister";
import { veraenderungSatz, MINDESTZEILEN, type Veraenderung } from "@/lib/typing/veraenderung";

export interface UeberblickSaetze {
  /** „in den letzten 4 Wochen (…)" - steht mitten im Satz. */
  phraseMonat: (bereich: string) => string;
  /** „im Schuljahr 2026/2027" - `label` schon in der Schreibweise der Sprache. */
  phraseSchuljahr: (label: string) => string;
  /** Passt in die Sätze `satzHoch` usw. aus `ketten<Xx>.ts`. */
  vergleichSchuljahr: string;
  /** Mit Leerzeichen vorn, hängt hinter dem Satz. */
  ohneUebung: (namen: string) => string;
  personen: (n: number) => string;
  /** `p` ist fertig formatiert („92 %"). */
  treffer: (p: string) => string;
  keineUebung: (p: string) => string;
  basis: (wert: string, p: string, gezaehlt: number, personen: string) => string;
  monatVergleich: (n: number) => string;
  monatOhne: string;
  jahrRegel: (personen: string) => string;
  jahrOhne: (mindestzeilen: number) => string;
  /** Das Hauptwort für `satzHoch` usw.: „Der Anteil". */
  anteilWas: string;
  zielKeines: string;
  zielKeineWoche: (p: string) => string;
  zielAnteil: (prozent: string, p: string) => string;
  zielVergleichJahr: string;
  zielJahrRegel: string;
  zielMonatOhne: string;
  zielEineWoche: string;
  /** Mit Strichpunkt vorn, hängt hinter der Zahl der Lernenden. */
  ohneScore: (mindZeichen: number, namen: string) => string;
  ohneUebungListe: (namen: string) => string;
  leiste: (p: string) => string;
  verteilung: string;
}

export const UEBERBLICK_SAETZE_NEUN: Readonly<Record<GeruestSprache, UeberblickSaetze>> = {
  bg: {
    phraseMonat: (b) => `през последните 4 седмици (${b})`,
    phraseSchuljahr: (l) => `през учебната година ${l}`,
    vergleichSchuljahr: "първите седмици с упражнения през учебната година",
    ohneUebung: (n) => ` Без упражнения: ${n}.`,
    personen: (n) => mehrzahl(n, "bg", { one: (z) => `${z} ученик`, other: (z) => `${z} ученици` }),
    treffer: (p) => `точност ${p}`,
    keineUebung: (p) => `Все още няма упражнения ${p}.`,
    basis: (w, p, g, pers) => `Средно ${w} ${p}, изчислено за ${g} от ${pers}.`,
    monatVergleich: (n) => `Сравняват се учениците, които са упражнявали и в двата периода (${n}).`,
    monatOhne: "Нито един ученик не е упражнявал и през тези 4 седмици, и през предходните 4 - няма с какво да се сравни.",
    jahrRegel: (pers) =>
      `За всеки ученик първите 4 седмици с упражнения се сравняват с последните 4 (при по-малко от 5 седмици с упражнения - първата с последната); средно за ${pers}.`,
    jahrOhne: (m) =>
      `Все още нито един ученик няма две седмици с упражнения през учебната година (поне ${m} реда на седмица) - няма с какво да се сравни.`,
    anteilWas: "Делът",
    zielKeines: "В този клас не е зададена седмична цел.",
    zielKeineWoche: (p) => `Все още няма завършена седмица с цел ${p} - текущата седмица се брои едва когато приключи.`,
    zielAnteil: (pr, p) =>
      `Изпълнени са ${pr} от зададените минути за седмичната цел ${p} - всички ученици заедно, само завършени седмици с цел.`,
    zielVergleichJahr: "първите седмици с цел през учебната година",
    zielJahrRegel: "Първите 4 седмици с цел се сравняват с последните 4 (при по-малко от 5 - първата с последната).",
    zielMonatOhne: "През предходните 4 седмици няма завършена седмица с цел - няма с какво да се сравни.",
    zielEineWoche: "Засега има само една завършена седмица с цел - за сравнение са нужни две.",
    ohneScore: (m, n) => `; без резултат, защото има по-малко от ${m} знака: ${n}`,
    ohneUebungListe: (n) => `; без упражнения: ${n}`,
    leiste: (p) => `По една точка за всеки ученик, изчислена от упражненията ${p}.`,
    verteilung: "Разпределение",
  },
  el: {
    phraseMonat: (b) => `τις τελευταίες 4 εβδομάδες (${b})`,
    phraseSchuljahr: (l) => `στο σχολικό έτος ${l}`,
    vergleichSchuljahr: "τις πρώτες εβδομάδες εξάσκησης του σχολικού έτους",
    ohneUebung: (n) => ` Χωρίς εξάσκηση: ${n}.`,
    personen: (n) => mehrzahl(n, "el", { one: (z) => `${z} παιδί`, other: (z) => `${z} παιδιά` }),
    treffer: (p) => `ακρίβεια ${p}`,
    keineUebung: (p) => `Δεν υπάρχει ακόμη εξάσκηση ${p}.`,
    basis: (w, p, g, pers) => `Κατά μέσο όρο ${w} ${p} (υπολογίστηκαν: ${g}, σύνολο: ${pers}).`,
    monatVergleich: (n) => `Συγκρίνονται τα παιδιά που έκαναν εξάσκηση και στις δύο περιόδους (${n}).`,
    monatOhne: "Κανένα παιδί δεν έκανε εξάσκηση και σε αυτές τις 4 εβδομάδες και στις 4 προηγούμενες - δεν υπάρχει τίποτα για σύγκριση.",
    jahrRegel: (pers) =>
      `Για κάθε παιδί συγκρίνονται οι πρώτες 4 εβδομάδες εξάσκησης με τις τελευταίες 4 (με λιγότερες από 5 εβδομάδες εξάσκησης, η πρώτη με την τελευταία), μέσος όρος: ${pers}.`,
    jahrOhne: (m) =>
      `Κανένα παιδί δεν έχει ακόμη δύο εβδομάδες εξάσκησης στο σχολικό έτος (τουλάχιστον ${m} γραμμές την εβδομάδα) - δεν υπάρχει τίποτα για σύγκριση.`,
    anteilWas: "Το ποσοστό",
    zielKeines: "Σε αυτό το τμήμα δεν έχει οριστεί εβδομαδιαίος στόχος.",
    zielKeineWoche: (p) => `Δεν έχει ολοκληρωθεί ακόμη καμία εβδομάδα με στόχο ${p} - η τρέχουσα εβδομάδα μετράει μόνο όταν τελειώσει.`,
    zielAnteil: (pr, p) =>
      `Έγινε το ${pr} των λεπτών του εβδομαδιαίου στόχου ${p} - όλα τα παιδιά μαζί, μόνο ολοκληρωμένες εβδομάδες με στόχο.`,
    zielVergleichJahr: "τις πρώτες εβδομάδες με στόχο του σχολικού έτους",
    zielJahrRegel: "Οι πρώτες 4 εβδομάδες με στόχο συγκρίνονται με τις τελευταίες 4 (με λιγότερες από 5, η πρώτη με την τελευταία).",
    zielMonatOhne: "Στις 4 προηγούμενες εβδομάδες δεν υπήρξε ολοκληρωμένη εβδομάδα με στόχο - δεν υπάρχει τίποτα για σύγκριση.",
    zielEineWoche: "Μέχρι τώρα μόνο μία ολοκληρωμένη εβδομάδα με στόχο - για σύγκριση χρειάζονται δύο.",
    ohneScore: (m, n) => `; χωρίς σκορ, επειδή έχουν λιγότερους από ${m} χαρακτήρες: ${n}`,
    ohneUebungListe: (n) => `; χωρίς εξάσκηση: ${n}`,
    leiste: (p) => `Μία κουκκίδα για κάθε παιδί, από την εξάσκηση ${p}.`,
    verteilung: "Κατανομή",
  },
  hu: {
    phraseMonat: (b) => `az utolsó 4 hétben (${b})`,
    phraseSchuljahr: (l) => `a tanévben (${l})`,
    vergleichSchuljahr: "a tanév első gyakorlóhetei",
    ohneUebung: (n) => ` Nem gyakorolt: ${n}.`,
    personen: (n) => mehrzahl(n, "hu", { one: (z) => `${z} tanuló`, other: (z) => `${z} tanuló` }),
    treffer: (p) => `${p} pontosság`,
    keineUebung: (p) => `Még nem volt gyakorlás ${p}.`,
    basis: (w, p, g, pers) => `Átlagosan ${w} ${p} (beszámítva: ${g}, összesen: ${pers}).`,
    monatVergleich: (n) => `Az összehasonlításban azok a tanulók vannak, akik mindkét időszakban gyakoroltak (${n}).`,
    monatOhne: "Egy tanuló sem gyakorolt ebben a 4 hétben és az azt megelőző 4 hétben is - nincs mivel összehasonlítani.",
    jahrRegel: (pers) =>
      `Minden tanulónál az első 4 gyakorlóhetet vetjük össze az utolsó 4 héttel (ha nincs legalább 5 gyakorlóhét, az elsőt az utolsóval); átlag: ${pers}.`,
    jahrOhne: (m) =>
      `Egy tanulónak sincs még két gyakorlóhete a tanévben (hetente legalább ${m} sor) - nincs mivel összehasonlítani.`,
    anteilWas: "Az arány",
    zielKeines: "Ebben az osztályban nincs heti cél beállítva.",
    zielKeineWoche: (p) => `Még nincs lezárt célhét ${p} - az aktuális hét csak akkor számít, ha véget ért.`,
    zielAnteil: (pr, p) => `A kitűzött heti célpercekből ${pr} teljesült ${p} - minden tanuló együtt, csak lezárt célhetek.`,
    zielVergleichJahr: "a tanév első célhetei",
    zielJahrRegel: "Az első 4 célhetet vetjük össze az utolsó 4-gyel (ha kevesebb mint 5 van, az elsőt az utolsóval).",
    zielMonatOhne: "Az előző 4 hétben nem volt lezárt célhét - nincs mivel összehasonlítani.",
    zielEineWoche: "Eddig csak egy lezárt célhét van - az összehasonlításhoz kettő kell.",
    ohneScore: (m, n) => `; nincs pontszám, mert kevesebb mint ${m} karakter: ${n}`,
    ohneUebungListe: (n) => `; nem gyakorolt: ${n}`,
    leiste: (p) => `Tanulónként egy pont, a gyakorlásból számolva (${p}).`,
    verteilung: "Eloszlás",
  },
  nl: {
    phraseMonat: (b) => `in de laatste 4 weken (${b})`,
    phraseSchuljahr: (l) => `in schooljaar ${l}`,
    vergleichSchuljahr: "de eerste oefenweken van het schooljaar",
    ohneUebung: (n) => ` Niet geoefend: ${n}.`,
    personen: (n) => mehrzahl(n, "nl", { one: (z) => `${z} leerling`, other: (z) => `${z} leerlingen` }),
    treffer: (p) => `${p} nauwkeurigheid`,
    keineUebung: (p) => `Nog geen oefening ${p}.`,
    basis: (w, p, g, pers) => `Gemiddeld ${w} ${p}, berekend over ${g} van ${pers}.`,
    monatVergleich: (n) => `Vergeleken worden de leerlingen die in beide periodes hebben geoefend (${n}).`,
    monatOhne: "Geen enkele leerling heeft zowel in deze 4 weken als in de 4 weken daarvoor geoefend - er valt niets te vergelijken.",
    jahrRegel: (pers) =>
      `Per leerling de eerste 4 oefenweken tegenover de laatste 4 (bij minder dan 5 oefenweken de eerste tegenover de laatste), gemiddeld over ${pers}.`,
    jahrOhne: (m) =>
      `Nog geen enkele leerling heeft twee oefenweken met minstens ${m} regels in het schooljaar - er valt niets te vergelijken.`,
    anteilWas: "Het aandeel",
    zielKeines: "In deze klas is geen weekdoel ingesteld.",
    zielKeineWoche: (p) => `Er is ${p} nog geen doelweek afgesloten - de lopende week telt pas als die voorbij is.`,
    zielAnteil: (pr, p) => `${pr} van de ingestelde doelminuten ${p} is gedaan - alle leerlingen samen, alleen afgesloten doelweken.`,
    zielVergleichJahr: "de eerste doelweken van het schooljaar",
    zielJahrRegel: "De eerste 4 doelweken tegenover de laatste 4 (bij minder dan 5 de eerste tegenover de laatste).",
    zielMonatOhne: "In de 4 weken daarvoor was er geen afgesloten doelweek - er valt niets te vergelijken.",
    zielEineWoche: "Nog maar één afgesloten doelweek - voor een vergelijking zijn er twee nodig.",
    ohneScore: (m, n) => `; geen score, omdat er minder dan ${m} tekens zijn: ${n}`,
    ohneUebungListe: (n) => `; niet geoefend: ${n}`,
    leiste: (p) => `Eén punt per leerling, berekend uit het oefenen ${p}.`,
    verteilung: "Verdeling",
  },
  pt: {
    phraseMonat: (b) => `nas últimas 4 semanas (${b})`,
    phraseSchuljahr: (l) => `no ano letivo ${l}`,
    vergleichSchuljahr: "as primeiras semanas de prática do ano letivo",
    ohneUebung: (n) => ` Sem prática: ${n}.`,
    personen: (n) => mehrzahl(n, "pt", { one: (z) => `${z} pessoa`, other: (z) => `${z} pessoas` }),
    treffer: (p) => `${p} de precisão`,
    keineUebung: (p) => `Ainda não há prática ${p}.`,
    basis: (w, p, g, pers) => `Em média ${w} ${p}, calculado sobre ${g} de ${pers}.`,
    monatVergleich: (n) => `São comparadas as pessoas que praticaram nos dois períodos (${n}).`,
    monatOhne: "Nenhuma pessoa praticou nestas 4 semanas e também nas 4 anteriores - não há nada para comparar.",
    jahrRegel: (pers) =>
      `Para cada pessoa, as primeiras 4 semanas de prática em comparação com as últimas 4 (com menos de 5 semanas de prática, a primeira com a última), em média sobre ${pers}.`,
    jahrOhne: (m) =>
      `Ainda nenhuma pessoa tem duas semanas de prática com pelo menos ${m} linhas no ano letivo - não há nada para comparar.`,
    anteilWas: "A percentagem",
    zielKeines: "Nesta turma não há nenhum objetivo semanal definido.",
    zielKeineWoche: (p) => `Ainda não terminou nenhuma semana com objetivo ${p} - a semana em curso só conta quando terminar.`,
    zielAnteil: (pr, p) => `Foi cumprido ${pr} dos minutos do objetivo ${p} - todas as pessoas em conjunto, só semanas com objetivo já concluídas.`,
    zielVergleichJahr: "as primeiras semanas com objetivo do ano letivo",
    zielJahrRegel: "As primeiras 4 semanas com objetivo em comparação com as últimas 4 (com menos de 5, a primeira com a última).",
    zielMonatOhne: "Nas 4 semanas anteriores não houve nenhuma semana com objetivo concluída - não há nada para comparar.",
    zielEineWoche: "Por enquanto há só uma semana com objetivo concluída - para comparar são precisas duas.",
    ohneScore: (m, n) => `; sem pontuação, por ter menos de ${m} carateres: ${n}`,
    ohneUebungListe: (n) => `; sem prática: ${n}`,
    leiste: (p) => `Um ponto por pessoa, calculado a partir da prática ${p}.`,
    verteilung: "Distribuição",
  },
  br: {
    phraseMonat: (b) => `nas últimas 4 semanas (${b})`,
    phraseSchuljahr: (l) => `no ano letivo ${l}`,
    vergleichSchuljahr: "as primeiras semanas de prática do ano letivo",
    ohneUebung: (n) => ` Sem prática: ${n}.`,
    personen: (n) => mehrzahl(n, "br", { one: (z) => `${z} pessoa`, other: (z) => `${z} pessoas` }),
    treffer: (p) => `${p} de precisão`,
    keineUebung: (p) => `Ainda não há prática ${p}.`,
    basis: (w, p, g, pers) => `Em média ${w} ${p}, calculado sobre ${g} de ${pers}.`,
    monatVergleich: (n) => `São comparadas as pessoas que praticaram nos dois períodos (${n}).`,
    monatOhne: "Nenhuma pessoa praticou nestas 4 semanas e também nas 4 anteriores - não há nada para comparar.",
    jahrRegel: (pers) =>
      `Para cada pessoa, as 4 primeiras semanas de prática em comparação com as 4 últimas (com menos de 5 semanas de prática, a primeira com a última), em média sobre ${pers}.`,
    jahrOhne: (m) =>
      `Ainda nenhuma pessoa tem duas semanas de prática com pelo menos ${m} linhas no ano letivo - não há nada para comparar.`,
    anteilWas: "A porcentagem",
    zielKeines: "Nesta turma não há nenhuma meta semanal definida.",
    zielKeineWoche: (p) => `Ainda não terminou nenhuma semana com meta ${p} - a semana atual só conta quando terminar.`,
    zielAnteil: (pr, p) => `Foi cumprido ${pr} dos minutos da meta ${p} - todas as pessoas juntas, só semanas com meta já encerradas.`,
    zielVergleichJahr: "as primeiras semanas com meta do ano letivo",
    zielJahrRegel: "As 4 primeiras semanas com meta em comparação com as 4 últimas (com menos de 5, a primeira com a última).",
    zielMonatOhne: "Nas 4 semanas anteriores não houve nenhuma semana com meta encerrada - não há nada para comparar.",
    zielEineWoche: "Por enquanto há só uma semana com meta encerrada - para comparar são necessárias duas.",
    ohneScore: (m, n) => `; sem pontuação, por ter menos de ${m} caracteres: ${n}`,
    ohneUebungListe: (n) => `; sem prática: ${n}`,
    leiste: (p) => `Um ponto por pessoa, calculado a partir da prática ${p}.`,
    verteilung: "Distribuição",
  },
  ro: {
    phraseMonat: (b) => `în ultimele 4 săptămâni (${b})`,
    phraseSchuljahr: (l) => `în anul școlar ${l}`,
    vergleichSchuljahr: "primele săptămâni de exersare din anul școlar",
    ohneUebung: (n) => ` Fără exersare: ${n}.`,
    personen: (n) => mehrzahl(n, "ro", { one: (z) => `${z} persoană`, few: (z) => `${z} persoane`, other: (z) => `${z} de persoane` }),
    treffer: (p) => `precizie ${p}`,
    keineUebung: (p) => `Încă nu există exersare ${p}.`,
    basis: (w, p, g, pers) => `În medie ${w} ${p}, calculat pentru ${g} din ${pers}.`,
    monatVergleich: (n) => `Se compară persoanele care au exersat în ambele perioade (${n}).`,
    monatOhne: "Nicio persoană nu a exersat atât în aceste 4 săptămâni, cât și în cele 4 dinainte - nu este nimic de comparat.",
    jahrRegel: (pers) =>
      `Pentru fiecare persoană, primele 4 săptămâni de exersare față de ultimele 4 (la mai puțin de 5 săptămâni de exersare, prima față de ultima), în medie pentru ${pers}.`,
    jahrOhne: (m) =>
      `Încă nicio persoană nu are două săptămâni de exersare în anul școlar (cel puțin ${m} rânduri pe săptămână) - nu este nimic de comparat.`,
    anteilWas: "Ponderea",
    zielKeines: "În această clasă nu este stabilit niciun obiectiv săptămânal.",
    zielKeineWoche: (p) => `Încă nu s-a încheiat nicio săptămână cu obiectiv ${p} - săptămâna în curs contează abia când s-a terminat.`,
    zielAnteil: (pr, p) => `S-a realizat ${pr} din minutele stabilite ${p} - toate persoanele la un loc, doar săptămâni cu obiectiv încheiate.`,
    zielVergleichJahr: "primele săptămâni cu obiectiv din anul școlar",
    zielJahrRegel: "Primele 4 săptămâni cu obiectiv față de ultimele 4 (la mai puțin de 5, prima față de ultima).",
    zielMonatOhne: "În cele 4 săptămâni dinainte nu a existat nicio săptămână cu obiectiv încheiată - nu este nimic de comparat.",
    zielEineWoche: "Deocamdată există o singură săptămână cu obiectiv încheiată - pentru comparație sunt necesare două.",
    ohneScore: (m, n) => `; fără scor, pentru că au mai puțin de ${m} de caractere: ${n}`,
    ohneUebungListe: (n) => `; fără exersare: ${n}`,
    leiste: (p) => `Un punct pentru fiecare persoană, calculat din exersarea ${p}.`,
    verteilung: "Distribuție",
  },
  sv: {
    phraseMonat: (b) => `under de senaste 4 veckorna (${b})`,
    phraseSchuljahr: (l) => `under läsåret ${l}`,
    vergleichSchuljahr: "läsårets första övningsveckor",
    ohneUebung: (n) => ` Inte övat: ${n}.`,
    personen: (n) => mehrzahl(n, "sv", { one: (z) => `${z} elev`, other: (z) => `${z} elever` }),
    treffer: (p) => `${p} träffsäkerhet`,
    keineUebung: (p) => `Ingen övning ${p} än.`,
    basis: (w, p, g, pers) => `I genomsnitt ${w} ${p}, beräknat på ${g} av ${pers}.`,
    monatVergleich: (n) => `Jämförelsen gäller elever som har övat under båda perioderna (${n}).`,
    monatOhne: "Ingen elev har övat både under de här 4 veckorna och under de 4 veckorna före - det finns inget att jämföra.",
    jahrRegel: (pers) =>
      `För varje elev jämförs de första 4 övningsveckorna med de senaste 4 (vid färre än 5 övningsveckor den första med den senaste), i genomsnitt för ${pers}.`,
    jahrOhne: (m) =>
      `Ingen elev har ännu två övningsveckor under läsåret (minst ${m} rader per vecka) - det finns inget att jämföra.`,
    anteilWas: "Andelen",
    zielKeines: "Inget veckomål är inställt i den här klassen.",
    zielKeineWoche: (p) => `Ingen målvecka är avslutad ${p} än - den pågående veckan räknas först när den är över.`,
    zielAnteil: (pr, p) => `${pr} av de inställda målminuterna ${p} har gjorts - alla elever tillsammans, bara avslutade målveckor.`,
    zielVergleichJahr: "läsårets första målveckor",
    zielJahrRegel: "De första 4 målveckorna jämförs med de senaste 4 (vid färre än 5 den första med den senaste).",
    zielMonatOhne: "Under de 4 föregående veckorna fanns ingen avslutad målvecka - det finns inget att jämföra.",
    zielEineWoche: "Hittills finns bara en avslutad målvecka - en jämförelse kräver två.",
    ohneScore: (m, n) => `; ingen poäng, eftersom det är färre än ${m} tecken: ${n}`,
    ohneUebungListe: (n) => `; inte övat: ${n}`,
    leiste: (p) => `En punkt per elev, beräknad på övningen ${p}.`,
    verteilung: "Fördelning",
  },
  uk: {
    phraseMonat: (b) => `за останні 4 тижні (${b})`,
    phraseSchuljahr: (l) => `у навчальному році ${l}`,
    vergleichSchuljahr: "перших тижнів тренувань навчального року",
    ohneUebung: (n) => ` Без тренувань: ${n}.`,
    personen: (n) =>
      mehrzahl(n, "uk", {
        one: (z) => `${z} дитина`,
        few: (z) => `${z} дитини`,
        many: (z) => `${z} дітей`,
        other: (z) => `${z} дитини`,
      }),
    treffer: (p) => `точність ${p}`,
    keineUebung: (p) => `Поки що немає тренувань ${p}.`,
    basis: (w, p, g, pers) => `У середньому ${w} ${p} (ураховано: ${g}, усього: ${pers}).`,
    monatVergleich: (n) => `Порівнюються діти, які тренувалися в обох періодах (${n}).`,
    monatOhne: "Жодна дитина не тренувалася і за ці 4 тижні, і за 4 попередні - порівнювати нема з чим.",
    jahrRegel: (pers) =>
      `Для кожної дитини порівнюються перші 4 тижні тренувань з останніми 4 (якщо тижнів тренувань менше ніж 5 - перший з останнім), у середньому: ${pers}.`,
    jahrOhne: (m) =>
      `Поки що жодна дитина не має двох тижнів тренувань у навчальному році (щонайменше рядків за тиждень: ${m}) - порівнювати нема з чим.`,
    anteilWas: "Частка",
    zielKeines: "У цьому класі не задано тижневої мети.",
    zielKeineWoche: (p) => `Поки що не завершено жодного тижня з метою ${p} - поточний тиждень рахується лише після завершення.`,
    zielAnteil: (pr, p) => `Виконано ${pr} заданих хвилин тижневої мети ${p} - усі діти разом, лише завершені тижні з метою.`,
    zielVergleichJahr: "перших тижнів з метою навчального року",
    zielJahrRegel: "Перші 4 тижні з метою порівнюються з останніми 4 (якщо їх менше ніж 5 - перший з останнім).",
    zielMonatOhne: "За 4 попередні тижні не було завершеного тижня з метою - порівнювати нема з чим.",
    zielEineWoche: "Поки що лише один завершений тиждень з метою - для порівняння потрібно два.",
    ohneScore: (m, n) => `; без балів, бо менше ніж ${m} знаків: ${n}`,
    ohneUebungListe: (n) => `; без тренувань: ${n}`,
    leiste: (p) => `Одна точка на кожну дитину, за тренуваннями ${p}.`,
    verteilung: "Розподіл",
  },
};

/** „Der Anteil ist um 3 Prozentpunkte höher als …" - mit den Sätzen der Lehrkraft-Tabelle. */
function anteilSatzNeun(s: GeruestSprache, v: Veraenderung, name: string): string {
  const k = KETTEN_NEUN[s];
  const zahl = Math.round(Math.abs(v.differenz));
  const was = UEBERBLICK_SAETZE_NEUN[s].anteilWas;
  const mitEinheit = `${zahl} ${k.einheit("treffer", zahl)}`;
  if (v.richtung === "gleich") return k.satzGleich(was, mitEinheit, name);
  return v.richtung === "hoch" ? k.satzHoch(was, mitEinheit, name) : k.satzNiedrig(was, mitEinheit, name);
}

/** Der Satz zu Tempo bzw. Treffsicherheit. */
export function kennSatzNeun(
  s: GeruestSprache,
  o: {
    k: Kennzahl;
    groesse: "tempo" | "treffer";
    wertText: string;
    art: UeberblickArt;
    phrase: string;
    vergleich: string;
    alle: number;
    nichtGeuebt: string;
  },
): string {
  const t = UEBERBLICK_SAETZE_NEUN[s];
  if (o.k.wert === null) return t.keineUebung(o.phrase);
  const basis = t.basis(o.wertText, o.phrase, o.k.gezaehlt, t.personen(o.alle)) + o.nichtGeuebt;
  const satz = o.k.veraenderung ? veraenderungSatz(o.k.veraenderung, o.groesse, o.vergleich, s) : null;
  const trend =
    o.art === "monat"
      ? satz
        ? `${satz} ${t.monatVergleich(o.k.verglichen)}`
        : t.monatOhne
      : satz
        ? `${satz} ${t.jahrRegel(t.personen(o.k.verglichen))}`
        : t.jahrOhne(MINDESTZEILEN);
  return `${basis} ${trend}`;
}

/** Der Satz zu den Wochenzielen. */
export function aufgabenSatzNeun(
  s: GeruestSprache,
  o: {
    a: Pick<Aufgabenkennzahl, "aktiv" | "anteil" | "veraenderung">;
    art: UeberblickArt;
    phrase: string;
    vergleich: string;
    prozent: string;
  },
): string {
  const t = UEBERBLICK_SAETZE_NEUN[s];
  if (!o.a.aktiv) return t.zielKeines;
  if (o.a.anteil === null) return t.zielKeineWoche(o.phrase);
  const trend = o.a.veraenderung
    ? o.art === "monat"
      ? anteilSatzNeun(s, o.a.veraenderung, o.vergleich)
      : `${anteilSatzNeun(s, o.a.veraenderung, t.zielVergleichJahr)} ${t.zielJahrRegel}`
    : o.art === "monat"
      ? t.zielMonatOhne
      : t.zielEineWoche;
  return `${t.zielAnteil(o.prozent, o.phrase)} ${trend}`;
}

/** Die vier Töpfe der Score-Leiste. */
export function topfTextNeun(s: GeruestSprache, toepfe: readonly number[]): string {
  const t = UEBERBLICK_SAETZE_NEUN[s];
  return toepfe.map((n, i) => `${topfLabel(i, s)}: ${t.personen(n)}`).join(" · ");
}

/** Wie viele Lernende, wer ohne Score, wer ohne Übung. */
export function lernendeTextNeun(
  s: GeruestSprache,
  o: { alle: number; mindZeichen: number; ohneScore: readonly string[]; ohneUebung: readonly string[] },
): string {
  const t = UEBERBLICK_SAETZE_NEUN[s];
  return (
    t.personen(o.alle) +
    (o.ohneScore.length > 0 ? t.ohneScore(o.mindZeichen, o.ohneScore.join(", ")) : "") +
    (o.ohneUebung.length > 0 ? t.ohneUebungListe(o.ohneUebung.join(", ")) : "") +
    "."
  );
}

/** Der Hinweis der Score-Leiste. */
export function leisteHilfeNeun(s: GeruestSprache, phrase: string, topfText: string, lernendeText: string): string {
  const t = UEBERBLICK_SAETZE_NEUN[s];
  return `${KETTEN_NEUN[s].scoreLehrkraft} ${t.leiste(phrase)} ${t.verteilung}: ${topfText}. ${lernendeText}`;
}
