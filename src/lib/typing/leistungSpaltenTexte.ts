/**
 * ★★★ DIE HINWEISE AN DEN SPALTENKÖPFEN DER LEISTUNGSTABELLE - an EINER Stelle
 * (13.09.2026).
 *
 * Bis zu diesem Tag standen fünf dieser Sätze inline in `TastenflowReiter.tsx`
 * (am `Spaltenkopf`, Attribut `hilfe`). Seit der Excel-Datei stehen sie an ZWEI
 * Orten: als Hinweis an der Tabelle in „Meine Klassen" und in der Legende des
 * Blattes „Übersicht" der Leistungstabelle.
 *
 * Johannes, 13.09.2026: *„mit einem Startblatt, mit Links zu den drei
 * Zeiträumen und unterhalb einer Legende, in der die Spaltenüberschriften
 * genau beschrieben sind: was ist eine Leistungsstufe, wie wird ein Score
 * berechnet …"*
 *
 * ⚠️ Zwei Abschriften desselben Satzes laufen beim nächsten Nachbessern
 * auseinander ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]) - dann
 * erklärte die Datei eine Spalte anders als der Schirm. Darum holen sich
 * beide die Sätze von hier. Der Schirm zeigt Wort für Wort dasselbe wie vor
 * dem Umzug.
 *
 * Die übrigen Spalten haben ihre Sätze schon länger an eigener Stelle:
 * Treffsicherheit, Tempo und Score in `veraenderung.ts` (`spaltenHilfe`), das
 * Wochenziel in `wochenzielZeitraum.ts` (`wochenzielHilfe`), die Tippchallenge
 * in `schreibprobeHinweise.ts` (`HINWEIS_CHALLENGE.spalte`).
 *
 * ⚠️ Backticks, wo ein deutsches Anführungszeichen vorkommt: Das Schlusszeichen
 * ist ein ASCII-`"` und bräche einen doppelt gequoteten String auf.
 */
import {
  SCORE_ERKLAERUNG_SIE,
  SCORE_ERKLAERUNG_SIE_EN,
  SCORE_ERKLAERUNG_VOUS_FR,
  SCORE_ERKLAERUNG_USTED_ES,
  SCORE_ERKLAERUNG_IT_INSEGNANTE,
  SCORE_ERKLAERUNG_PL_NAUCZYCIELE,
  SCORE_ERKLAERUNG_TR_OGRETMEN,
  SCORE_ERKLAERUNG_CS_VYUCUJICI,
} from "./score";
import {
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_EN,
  PRUEFUNG_WORT_FR,
  PRUEFUNG_WORT_ES,
  PRUEFUNG_WORT_IT,
  PRUEFUNG_WORT_PL,
  PRUEFUNG_WORT_TR,
  PRUEFUNG_WORT_CS,
} from "./schreibprobe";
import type { BedienSprache } from "@/lib/bedienSprache";

/**
 * Spaltenkopf „Name" (K2, 19.09.2026) - der einzige Kopf der Tabelle, der bis
 * dahin ohne `hilfe` war (Johannes fand die Lücke beim Suchen nach fehlenden
 * Mouseover-Hinweisen). Die Spalte selbst braucht keine Erklärung - ein Name
 * ist ein Name -, aber das SORTIEREN dahinter ist ein Dreier-Kreislauf, den
 * kein anderer Kopf hat: erster Druck ⇒ auf, zweiter ⇒ ab, dritter ⇒ zurück
 * zur Anlage-Reihenfolge (`sortiereNach` in `TastenflowReiter.tsx`).
 */
export const NAME_HILFE =
  "Sortiert die Tabelle nach Vorname. Ein zweiter Druck dreht die Richtung um, ein dritter hebt die Sortierung wieder auf - zurück zur Reihenfolge, in der die Kinder angelegt wurden.";

/** Spaltenkopf „Leistungsstufe". */
export const LEISTUNGSSTUFE_HILFE =
  "Die Leistungsstufe 1 bis 50. Sie steigt von selbst, sobald jemand eine Weile sicher und flüssig schreibt, und sinkt wieder, wenn es nicht mehr trägt. Sie ist keine Note - sie sagt, wie schwer die Übungen gerade sein dürfen.";

/** Spaltenkopf „Tasten" („12/31"). */
export const TASTEN_HILFE =
  `Wie viele der bisher freigeschalteten Tasten sicher sitzen - ` +
  `„12 von 31" heisst: von den 31 Tasten, die dieses Kind schon ` +
  `kennt, sitzen 12. Der Nenner wächst mit; er ist nicht die ` +
  `Zahl der Tasten auf der Tastatur.`;

/**
 * Spaltenkopf „Nächste Tasten" (25.09.2026, Testerin: für Kinder mit Autismus ist
 * wichtig zu wissen, was als Nächstes kommt).
 */
export const NAECHSTE_HILFE =
  `Die zwei Tasten, die dieses Kind als Nächstes lernt, in dieser ` +
  `Reihenfolge. Sie kommen von selbst, sobald die anderen sitzen. ` +
  `Die Tastatur ist die dieses Geräts - ein Kind mit anderer Tastatur ` +
  `kann andere sehen.`;

/** Spaltenkopf „Übezeit". */
export const UEBEZEIT_HILFE =
  "Wie lange in diesem Zeitraum wirklich geübt wurde. Gezählt wird die Zeit am Text, nicht die Zeit mit offenem Programm - lange Pausen zählen nicht mit.";

/** Die Gruppen-Überschrift „Üben" über Treffsicherheit, Anschläge und Score. */
export const UEBEN_GRUPPE_HILFE =
  `Diese drei Spalten kommen aus demselben: dem ÜBEN im ` +
  `gewählten Zeitraum. Der Score fasst die beiden davor in ` +
  `einer Zahl zusammen. ${SCORE_ERKLAERUNG_SIE} Die Spalte ` +
  `„${PRUEFUNG_WORT}" daneben gehört nicht dazu - sie ist eine ` +
  `Prüfung an einem bestimmten Tag.`;

/** Die Gruppen-Überschrift „Prüfung" über der Tippchallenge. */
export const PRUEFUNG_GRUPPE_HILFE =
  `Eine Prüfung an einem bestimmten Tag, für die ganze Klasse ` +
  `zur selben Zeit - nicht das tägliche Üben. Darum steht sie ` +
  `ausserhalb der Gruppe „Üben".`;

/**
 * ★★ EN6a (19.09.2026): DIESELBEN SÄTZE ENGLISCH - für den Spaltenkopf in der
 * englischen Bedienung UND die Legende der englischen Excel-Datei (dieselbe
 * Regel wie oben: eine Stelle für beide). Glossar §3.2/§3.8: Leistungsstufe ⇒
 * *difficulty level*, Tasten sitzen ⇒ *mastered*, Übezeit ⇒ *practice time*,
 * Kind ⇒ *pupil*, Prüfung ⇒ *challenge* (nie *exam*), Note ⇒ *mark*.
 */
export const NAME_HILFE_EN =
  "Sorts the table by first name. A second press reverses the order, a third removes the sorting - back to the order in which the pupils were added.";

export const LEISTUNGSSTUFE_HILFE_EN =
  "The difficulty level, 1 to 50. It goes up by itself once someone has been typing securely and fluently for a while, and comes down again when that no longer holds. It is not a mark - it says how hard the exercises may be at the moment.";

export const TASTEN_HILFE_EN =
  `How many of the keys unlocked so far are mastered - ` +
  `“12 of 31” means: of the 31 keys this pupil already knows, ` +
  `12 are mastered. The second number grows with the pupil; it is not the ` +
  `number of keys on the keyboard.`;

export const NAECHSTE_HILFE_EN =
  `The two keys this pupil learns next, in that order. They unlock ` +
  `by themselves once the others are mastered. The keyboard is the one of ` +
  `this device - a pupil with a different keyboard may see other keys.`;

export const UEBEZEIT_HILFE_EN =
  "How long someone actually practised in this period. What counts is the time spent on the text, not the time the app was open - long pauses don't count.";

export const UEBEN_GRUPPE_HILFE_EN =
  `These three columns come from the same source: PRACTICE in the ` +
  `chosen period. The score puts the two before it into one ` +
  `number. ${SCORE_ERKLAERUNG_SIE_EN} The column ` +
  `“${PRUEFUNG_WORT_EN}” next to them is not part of this group - it is a ` +
  `challenge on one particular day.`;

export const PRUEFUNG_GRUPPE_HILFE_EN =
  `A challenge on one particular day, for the whole class at the same ` +
  `time - not everyday practice. That is why it sits outside the ` +
  `“Practice” group.`;

/**
 * ★ E11a-3 (26.09.2026): dieselben sieben Sätze französisch - Glossar §9.2
 * (Leistungsstufe ⇒ niveau de difficulté, Tasten sitzen ⇒ acquises, Übezeit
 * ⇒ temps d'exercice, Kind ⇒ élève, Défi statt Prüfung), Fehlgriff ⇒ erreur
 * de frappe wie überall (nie *faute*).
 */
export const NAME_HILFE_FR =
  "Trie le tableau par prénom. Un deuxième appui inverse l'ordre, un troisième annule le tri - retour à l'ordre dans lequel les élèves ont été ajoutés.";

export const LEISTUNGSSTUFE_HILFE_FR =
  "Le niveau de difficulté, de 1 à 50. Il monte tout seul dès que quelqu'un tape de façon sûre et fluide pendant un moment, et redescend quand ce n'est plus le cas. Ce n'est pas une note - il indique à quel point les exercices peuvent être difficiles en ce moment.";

export const TASTEN_HILFE_FR =
  `Combien des touches déjà débloquées sont acquises - ` +
  `"12 sur 31" veut dire : sur les 31 touches que cet élève ` +
  `connait déjà, 12 sont acquises. Le deuxième nombre grandit avec ` +
  `l'élève ; ce n'est pas le nombre de touches du clavier.`;

export const NAECHSTE_HILFE_FR =
  `Les deux touches que cet élève apprend ensuite, dans cet ordre. ` +
  `Elles se débloquent d'elles-mêmes dès que les autres sont acquises. ` +
  `Le clavier est celui de cet appareil - un élève avec un autre clavier ` +
  `peut en voir d'autres.`;

export const UEBEZEIT_HILFE_FR =
  "Le temps réellement exercé pendant cette période. Ce qui compte, c'est le temps passé sur le texte, pas le temps où le programme était ouvert - les longues pauses ne comptent pas.";

export const UEBEN_GRUPPE_HILFE_FR =
  `Ces trois colonnes viennent de la même chose : l'exercice pendant ` +
  `la période choisie. Le score réunit les deux précédentes en un ` +
  `seul nombre. ${SCORE_ERKLAERUNG_VOUS_FR} La colonne ` +
  `"${PRUEFUNG_WORT_FR}" à côté n'en fait pas partie - c'est une ` +
  `évaluation à une date précise.`;

export const PRUEFUNG_GRUPPE_HILFE_FR =
  `Une évaluation à une date précise, pour toute la classe en même ` +
  `temps - pas l'exercice quotidien. C'est pour cela qu'elle est en ` +
  `dehors du groupe "Exercice".`;

// ── ES-O (27.09.2026): dieselben Sätze spanisch - liest nur die Lehrkraft (usted).
export const NAME_HILFE_ES =
  "Ordena la tabla por nombre. Una segunda pulsación invierte el orden y una tercera quita la ordenación - vuelve al orden en que se añadió al alumnado.";

export const LEISTUNGSSTUFE_HILFE_ES =
  "El nivel de dificultad, del 1 al 50. Sube solo en cuanto alguien escribe un rato de forma segura y fluida, y vuelve a bajar cuando ya no es así. No es una nota - indica lo difíciles que pueden ser ahora los ejercicios.";

export const TASTEN_HILFE_ES =
  `Cuántas de las teclas ya desbloqueadas están aprendidas - ` +
  `"12 de 31" quiere decir: de las 31 teclas que esta persona ` +
  `ya tiene desbloqueadas, 12 ya son seguras. El segundo número crece con ` +
  `ella; no es el número de teclas del teclado.`;

export const NAECHSTE_HILFE_ES =
  `Las dos teclas que esta persona aprende después, en este orden. ` +
  `Se desbloquean solas en cuanto las demás están aprendidas. ` +
  `El teclado es el de este dispositivo - quien tenga otro teclado ` +
  `puede ver otras.`;

export const UEBEZEIT_HILFE_ES =
  "El tiempo realmente practicado en este periodo. Cuenta el tiempo dedicado al texto, no el tiempo con el programa abierto - las pausas largas no cuentan.";

export const UEBEN_GRUPPE_HILFE_ES =
  `Estas tres columnas vienen de lo mismo: la práctica en el ` +
  `periodo elegido. La puntuación combina las dos anteriores en un ` +
  `solo número. ${SCORE_ERKLAERUNG_USTED_ES} La columna ` +
  `"${PRUEFUNG_WORT_ES}" de al lado no forma parte - es una ` +
  `valoración en una fecha concreta.`;

export const PRUEFUNG_GRUPPE_HILFE_ES =
  `Una valoración en una fecha concreta, para toda la clase a la vez - ` +
  `no la práctica de cada día. Por eso está fuera del grupo "Práctica".`;

/**
 * ★ O-IT (02.10.2026): dieselben Sätze italienisch - an die Lehrkraft, neutral
 * (Glossar Regel 1); „livello di difficoltà" (§2.2), „tasti sicuri", „la Sfida"
 * ist keine „prova/verifica" (§2.3).
 */
export const NAME_HILFE_IT =
  "Ordina la tabella per nome. Una seconda pressione inverte l'ordine, una terza toglie l'ordinamento - si torna all'ordine in cui sono stati aggiunti gli alunni.";

export const LEISTUNGSSTUFE_HILFE_IT =
  "Il livello di difficoltà, da 1 a 50. Sale da solo appena qualcuno scrive per un po' in modo sicuro e scorrevole, e riscende quando non regge più. Non è un voto - dice quanto possono essere difficili gli esercizi in questo momento.";

export const TASTEN_HILFE_IT =
  `Quanti dei tasti già sbloccati sono sicuri - ` +
  `"12 di 31" significa: dei 31 tasti che questa persona conosce già, ` +
  `12 sono sicuri. Il secondo numero cresce con lei; non è il numero ` +
  `dei tasti della tastiera.`;

export const NAECHSTE_HILFE_IT =
  `I due tasti che questa persona impara dopo, in quest'ordine. ` +
  `Arrivano da soli appena gli altri sono sicuri. La tastiera è quella ` +
  `di questo dispositivo - con un'altra tastiera se ne possono vedere altri.`;

export const UEBEZEIT_HILFE_IT =
  "Il tempo davvero dedicato all'esercizio in questo periodo. Conta il tempo sul testo, non il tempo con il programma aperto - le pause lunghe non contano.";

export const UEBEN_GRUPPE_HILFE_IT =
  `Queste tre colonne vengono dalla stessa cosa: l'ESERCIZIO nel periodo ` +
  `scelto. Il punteggio riunisce le due precedenti in un solo numero. ` +
  `${SCORE_ERKLAERUNG_IT_INSEGNANTE} La colonna "${PRUEFUNG_WORT_IT}" ` +
  `accanto non ne fa parte - è una sfida in un giorno preciso.`;

export const PRUEFUNG_GRUPPE_HILFE_IT =
  `Una sfida in un giorno preciso, per tutta la classe nello stesso ` +
  `momento - non l'esercizio di ogni giorno. Per questo sta fuori dal ` +
  `gruppo "Esercizio".`;

/**
 * ★ O-PL (02.10.2026): dieselben Sätze polnisch - an die Lehrkraft, ty-Form
 * und unpersönlich (Glossar Regel 1); „poziom trudności" (§2.2), „opanowane
 * klawisze", das Wyzwanie ist keine „ocena" (Falle 9).
 */
export const NAME_HILFE_PL =
  "Sortuje tabelę według imion. Drugie naciśnięcie odwraca kolejność, trzecie usuwa sortowanie - wraca kolejność, w jakiej uczniowie zostali dodani.";

export const LEISTUNGSSTUFE_HILFE_PL =
  "Poziom trudności od 1 do 50. Rośnie sam, gdy ktoś przez pewien czas pisze pewnie i płynnie, i znów spada, gdy to już nie wychodzi. To nie jest ocena - mówi, jak trudne mogą być teraz ćwiczenia.";

export const TASTEN_HILFE_PL =
  `Ile z dotąd odblokowanych klawiszy jest już opanowanych - ` +
  `„12 z 31” oznacza: z 31 klawiszy, które ta osoba już zna, ` +
  `opanowanych jest 12. Druga liczba rośnie razem z osobą; to nie jest ` +
  `liczba klawiszy na klawiaturze.`;

export const NAECHSTE_HILFE_PL =
  `Dwa klawisze, których ta osoba nauczy się jako następnych, w tej ` +
  `kolejności. Pojawiają się same, gdy pozostałe są opanowane. Klawiatura ` +
  `jest klawiaturą tego urządzenia - przy innej klawiaturze mogą być widoczne inne.`;

export const UEBEZEIT_HILFE_PL =
  "Ile czasu naprawdę ćwiczono w tym okresie. Liczy się czas przy tekście, a nie czas z otwartym programem - długie przerwy się nie liczą.";

export const UEBEN_GRUPPE_HILFE_PL =
  `Te trzy kolumny pochodzą z tego samego: z ĆWICZEŃ w wybranym okresie. ` +
  `Wynik łączy dwie poprzednie w jedną liczbę. ` +
  `${SCORE_ERKLAERUNG_PL_NAUCZYCIELE} Kolumna „${PRUEFUNG_WORT_PL}” ` +
  `obok do nich nie należy - to wyzwanie jednego konkretnego dnia.`;

export const PRUEFUNG_GRUPPE_HILFE_PL =
  `Wyzwanie jednego konkretnego dnia, dla całej klasy w tym samym ` +
  `czasie - nie codzienne ćwiczenia. Dlatego jest poza grupą „Ćwiczenia”.`;

/**
 * ★ O-TR (02.10.2026): dieselben Sätze türkisch - an die Lehrkraft, siz und
 * unpersönlich (Glossar Regel 1); "zorluk seviyesi", "oturmuş tuşlar" (§2.2),
 * die Yarışma ist keine "not"; Zahlen ohne Endung, nie "12 / 31" (Regel 6).
 */
export const NAME_HILFE_TR =
  "Tabloyu ada göre sıralar. İkinci basış sırayı tersine çevirir, üçüncü basış sıralamayı kaldırır - öğrencilerin eklendiği sıraya geri döner.";

export const LEISTUNGSSTUFE_HILFE_TR =
  "Zorluk seviyesi 1 ile 50 arasındadır. Biri bir süre güvenli ve akıcı yazınca kendiliğinden yükselir, bu artık tutmayınca yeniden düşer. Bir not değildir - alıştırmaların şu an ne kadar zor olabileceğini söyler.";

export const TASTEN_HILFE_TR =
  `Şimdiye kadar kilidi açılan tuşlardan kaçının oturduğunu gösterir. ` +
  `Örnek: öğrencinin bildiği 31 tuştan 12 tanesi oturduysa sütunda 12 ve 31 ` +
  `görünür. İkinci sayı öğrenciyle birlikte büyür; klavyedeki tuş sayısı ` +
  `değildir.`;

export const NAECHSTE_HILFE_TR =
  `Öğrencinin sıradaki iki tuşu, bu sırayla. Diğer tuşlar oturunca ` +
  `kendiliğinden gelirler. Klavye bu cihazın klavyesidir - başka klavyesi ` +
  `olan bir öğrenci başka tuşlar görebilir.`;

export const UEBEZEIT_HILFE_TR =
  "Bu dönemde gerçekten ne kadar çalışıldığı. Programın açık kaldığı süre değil, metin başında geçen süre sayılır - uzun aralar sayılmaz.";

export const UEBEN_GRUPPE_HILFE_TR =
  `Bu üç sütun aynı kaynaktan gelir: seçilen dönemdeki ALIŞTIRMALARDAN. ` +
  `Puan, önceki iki sütunu tek bir sayıda birleştirir. ` +
  `${SCORE_ERKLAERUNG_TR_OGRETMEN} Yanındaki "${PRUEFUNG_WORT_TR}" sütunu ` +
  `bunlara dahil değildir - belirli bir günde yapılan bir yarışmadır.`;

export const PRUEFUNG_GRUPPE_HILFE_TR =
  `Belirli bir günde, tüm sınıf için aynı anda yapılan bir yarışma - günlük ` +
  `alıştırma değil. Bu yüzden "Alıştırma" grubunun dışındadır.`;

/**
 * ★ O-CS (03.10.2026): dieselben Sätze tschechisch - an die Lehrkraft, vy und
 * „se"-Sätze (Glossar Regel 1); „úroveň obtížnosti", „jisté klávesy" (§2.2),
 * Kinder als „osoba" (Regel 2), die Výzva ist keine „známka"; „12/31" mit
 * Schrägstrich (Regel 13).
 */
export const NAME_HILFE_CS =
  "Seřadí tabulku podle jmen. Druhé stisknutí pořadí obrátí, třetí řazení zruší - vrátí se pořadí, v jakém žáci přibyli.";

export const LEISTUNGSSTUFE_HILFE_CS =
  "Úroveň obtížnosti (od 1 do 50). Sama stoupá, když někdo nějakou dobu píše jistě a plynule, a zase klesá, když se to už nedaří. Není to známka - říká, jak těžká mohou být cvičení právě teď.";

export const TASTEN_HILFE_CS =
  `Kolik z dosud odemčených kláves je už jistých - údaj 12/31 znamená: ` +
  `ze 31 kláves, které tato osoba už zná, je 12 jistých. Druhé číslo roste ` +
  `spolu s osobou; není to počet kláves na klávesnici.`;

export const NAECHSTE_HILFE_CS =
  `Dvě klávesy, které tato osoba dostane jako další, v tomto pořadí. ` +
  `Přijdou samy, jakmile budou ostatní jisté. Klávesnice je klávesnice ` +
  `tohoto zařízení - u jiné klávesnice se mohou ukázat jiné klávesy.`;

export const UEBEZEIT_HILFE_CS =
  "Kolik času se v tomto období opravdu cvičilo. Počítá se čas u textu, ne čas s otevřeným programem - dlouhé přestávky se nepočítají.";

export const UEBEN_GRUPPE_HILFE_CS =
  `Tyto tři sloupce vycházejí ze stejného zdroje: ze CVIČENÍ ve vybraném období. ` +
  `Skóre spojuje oba předchozí sloupce do jednoho čísla. ` +
  `${SCORE_ERKLAERUNG_CS_VYUCUJICI} Sloupec ${PRUEFUNG_WORT_CS} ` +
  `vedle k nim nepatří - je to Výzva jednoho určitého dne.`;

export const PRUEFUNG_GRUPPE_HILFE_CS =
  `Výzva jednoho určitého dne, pro celou třídu ve stejnou chvíli - ` +
  `ne každodenní cvičení. Proto stojí mimo skupinu Cvičení.`;

/**
 * ★ O2-LIB (30.10.2026): dieselben Sätze bulgarisch - an die Lehrkraft, Вие-Ebene ohne Anrede;
 * „ниво на трудност", „сигурни клавиши" (Glossar §2.2), Kinder als „ученици", die Предизвикателство
 * ist keine „оценка"; „12/31" mit Schrägstrich.
 */
export const NAME_HILFE_BG =
  "Подрежда таблицата по име. Второто натискане обръща реда, третото премахва подреждането - връща се редът, в който са добавени учениците.";

export const LEISTUNGSSTUFE_HILFE_BG =
  "Нивото на трудност (от 1 до 50). То се покачва само, когато някой известно време пише сигурно и плавно, и пада, когато това вече не е така. Не е оценка - показва колко трудни могат да бъдат упражненията в момента.";

export const TASTEN_HILFE_BG =
  `Колко от досега отключените клавиши са вече сигурни - „12/31“ означава: ` +
  `от 31-те клавиша, които този ученик вече познава, 12 са сигурни. Второто число расте ` +
  `заедно с ученика; не е броят на клавишите на клавиатурата.`;

export const NAECHSTE_HILFE_BG =
  `Двата клавиша, които този ученик ще получи следващи, в този ред. ` +
  `Отключват се сами, щом останалите станат сигурни. Клавиатурата е тази на ` +
  `устройството - ученик с друга клавиатура може да види други клавиши.`;

export const UEBEZEIT_HILFE_BG =
  "Колко време наистина е било упражнявано през този период. Брои се времето върху текста, не времето с отворена програма - дългите паузи не се броят.";

export const UEBEN_GRUPPE_HILFE_BG =
  `Тези три колони идват от един и същ източник: от УПРАЖНЕНИЯТА през избрания период. ` +
  `Резултатът обединява двете предходни колони в едно число от 0 до 100: погрешният клавиш тежи ` +
  `като 5 знака, а двойна скорост се брои само 1,4 пъти - точността е по-важна от скоростта. ` +
  `Колоната „Предизвикателство“ до тях не е част от тази група - това е Предизвикателство в един определен ден.`;

export const PRUEFUNG_GRUPPE_HILFE_BG =
  `Предизвикателство в един определен ден, за целия клас едновременно - ` +
  `не ежедневно упражнение. Затова стои извън групата „Упражнения“.`;

/**
 * ★ O-EL-LIB (30.10.2026): dieselben Sätze griechisch - an die Lehrkraft (εσείς), über das Schreiben und
 * das Ding, nicht über eine Person (Glossar Regel 2); «ξεκλειδωμένα», «σίγουρα πλήκτρα» (§2.2), die
 * Πρόκληση ist kein Βαθμός; «12/31» mit Schrägstrich.
 */
export const NAME_HILFE_EL =
  "Ταξινομεί τον πίνακα με βάση το όνομα. Με δεύτερο πάτημα η σειρά αντιστρέφεται, με τρίτο η ταξινόμηση αφαιρείται - επιστρέφει η σειρά με την οποία προστέθηκαν τα παιδιά.";

export const LEISTUNGSSTUFE_HILFE_EL =
  "Το επίπεδο δυσκολίας, από 1 έως 50. Ανεβαίνει μόνο του όταν η γραφή είναι για αρκετό διάστημα σίγουρη και ρέουσα, και κατεβαίνει ξανά όταν αυτό δεν ισχύει πια. Δεν είναι βαθμός - δείχνει πόσο δύσκολες μπορούν να είναι οι ασκήσεις αυτή τη στιγμή.";

export const TASTEN_HILFE_EL =
  `Πόσα από τα πλήκτρα που έχουν ξεκλειδωθεί μέχρι τώρα είναι σίγουρα - το 12/31 σημαίνει: ` +
  `από τα 31 πλήκτρα που γνωρίζει ήδη αυτό το άτομο, τα 12 είναι σίγουρα. Ο δεύτερος αριθμός ` +
  `μεγαλώνει μαζί με το άτομο και δεν είναι ο αριθμός των πλήκτρων του πληκτρολογίου.`;

export const NAECHSTE_HILFE_EL =
  `Τα δύο πλήκτρα που μαθαίνει στη συνέχεια αυτό το άτομο, με αυτή τη σειρά. ` +
  `Ξεκλειδώνουν μόνα τους μόλις τα υπόλοιπα γίνουν σίγουρα. Το πληκτρολόγιο είναι αυτό ` +
  `της συσκευής - με άλλο πληκτρολόγιο μπορεί να εμφανιστούν άλλα πλήκτρα.`;

export const UEBEZEIT_HILFE_EL =
  "Πόση ώρα έγινε πραγματικά εξάσκηση σε αυτή την περίοδο. Μετράει ο χρόνος πάνω στο κείμενο, όχι ο χρόνος που το πρόγραμμα ήταν ανοιχτό - οι μεγάλες παύσεις δεν μετρούν.";

export const UEBEN_GRUPPE_HILFE_EL =
  `Αυτές οι τρεις στήλες προέρχονται από την ίδια πηγή: την εξάσκηση στην επιλεγμένη περίοδο. ` +
  `Το σκορ συνδυάζει τις δύο προηγούμενες στήλες σε έναν αριθμό από 0 έως 100. ` +
  `Ένα λάθος πλήκτρο μετράει όσο 5 χαρακτήρες και η διπλάσια ταχύτητα μετράει μόνο 1,4 φορές - ` +
  `η ακρίβεια προηγείται της ταχύτητας. Η στήλη «Προκλήσεις» δίπλα δεν ανήκει σε αυτή την ομάδα - ` +
  `είναι μια Πρόκληση μιας συγκεκριμένης ημέρας.`;

export const PRUEFUNG_GRUPPE_HILFE_EL =
  `Μια Πρόκληση μιας συγκεκριμένης ημέρας, για όλο το τμήμα την ίδια στιγμή - ` +
  `όχι η καθημερινή εξάσκηση. Για αυτό βρίσκεται έξω από την ομάδα «Εξάσκηση».`;

/**
 * ★ O2-LIB (30.10.2026): dieselben Sätze ungarisch - an die Lehrkraft ohne Anrede
 * (Glossar Regel 1), „nehézségi szint", „biztos billentyűk" (§2.2/§2.13), das Kind als
 * „tanuló", die Kihívás ist keine „érdemjegy".
 */
export const NAME_HILFE_HU =
  "A táblázat rendezése keresztnév szerint. Második megnyomásra a sorrend megfordul, harmadikra megszűnik a rendezés - visszaáll a tanulók felvételének sorrendje.";

export const LEISTUNGSSTUFE_HILFE_HU =
  "A nehézségi szint, 1-től 50-ig. Magától emelkedik, ha valaki egy ideje biztosan és folyamatosan gépel, és csökken, ha ez már nem áll fenn. Nem érdemjegy - azt mutatja, mennyire nehezek lehetnek jelenleg a gyakorlatok.";

export const TASTEN_HILFE_HU =
  `Hány billentyű biztos az eddig feloldottak közül - a 12/31 azt jelenti: ` +
  `a 31 billentyűből, amelyet ez a tanuló már ismer, 12 biztos. A második szám ` +
  `a tanulóval együtt nő; nem a billentyűzet billentyűinek a száma.`;

export const NAECHSTE_HILFE_HU =
  `Az a két billentyű, amelyet ez a tanuló legközelebb tanul meg, ebben a sorrendben. ` +
  `Maguktól feloldódnak, amint a többi biztos. A billentyűzet az eszköz billentyűzete - ` +
  `más billentyűzetű tanuló más billentyűket láthat.`;

export const UEBEZEIT_HILFE_HU =
  "Mennyi ideig gyakorolt valaki valójában ebben az időszakban. A szöveggel töltött idő számít, nem az, ameddig a program nyitva volt - a hosszú szünetek nem számítanak.";

const SCORE_ERKLAERUNG_HU_A2 =
  "A pontszám a pontosságot és a sebességet egyetlen, 0 és 100 közötti számba foglalja; " +
  "egy elütés 5 karakternek számít, a dupla sebesség pedig csak 1,4-szeres értéket ér - " +
  "a pontosság erősebb a sebességnél.";

export const UEBEN_GRUPPE_HILFE_HU =
  `Ez a három oszlop ugyanabból a forrásból származik: a kiválasztott időszak ` +
  `GYAKORLÁSÁBÓL. A pontszám az előző kettőt egyetlen számba foglalja. ` +
  `${SCORE_ERKLAERUNG_HU_A2} A mellettük álló „Kihívások” oszlop ` +
  `nem tartozik ide - az egy meghatározott nap Kihívása.`;

export const PRUEFUNG_GRUPPE_HILFE_HU =
  `Egy meghatározott nap Kihívása, az egész osztálynak egyszerre - ` +
  `nem mindennapi gyakorlás. Ezért áll a „Gyakorlás” csoporton kívül.`;

/**
 * ★ O2-LIB (29.10.2026): dieselben Sätze niederländisch - an die Lehrkraft, ohne Anrede-Wechsel (Glossar nl
 * Regel 1); "moeilijkheidsniveau", "zeker" (§2.2), Kinder als "leerling", die Uitdaging ist keine Note.
 */
const SCORE_ERKLAERUNG_NL_LEERKRACHT =
  "De score voegt nauwkeurigheid en snelheid samen in één getal van 0 tot 100; " +
  "een verkeerde toets telt als 5 tekens en twee keer zo snel typen telt maar " +
  "1,4 keer - nauwkeurigheid gaat voor snelheid.";

export const NAME_HILFE_NL =
  "Sorteert de tabel op voornaam. Een tweede keer drukken keert de volgorde om, een derde keer heft het sorteren op - dan staat alles weer in de volgorde waarin de leerlingen zijn toegevoegd.";

export const LEISTUNGSSTUFE_HILFE_NL =
  "Het moeilijkheidsniveau, van 1 tot 50. Het gaat vanzelf omhoog als iemand een tijd lang zeker en vlot typt, en weer omlaag als dat niet meer lukt. Het is geen beoordeling - het zegt hoe moeilijk de oefeningen op dit moment mogen zijn.";

export const TASTEN_HILFE_NL =
  `Hoeveel van de tot nu toe vrijgespeelde toetsen al zeker zijn - "12 van 31" betekent: ` +
  `van de 31 toetsen die deze leerling al kent, zijn er 12 zeker. Het tweede getal groeit ` +
  `met de leerling mee; het is niet het aantal toetsen op het toetsenbord.`;

export const NAECHSTE_HILFE_NL =
  `De twee toetsen die deze leerling hierna leert, in die volgorde. Ze komen vanzelf ` +
  `vrij zodra de andere toetsen zeker zijn. Het toetsenbord is dat van dit apparaat - ` +
  `een leerling met een ander toetsenbord ziet misschien andere toetsen.`;

export const UEBEZEIT_HILFE_NL =
  "Hoe lang er in deze periode echt is geoefend. Wat telt is de tijd die aan de tekst is besteed, niet de tijd dat de app openstond - lange pauzes tellen niet mee.";

export const UEBEN_GRUPPE_HILFE_NL =
  `Deze drie kolommen komen uit dezelfde bron: OEFENEN in de gekozen periode. ` +
  `De score voegt de twee kolommen ervoor samen in één getal. ` +
  `${SCORE_ERKLAERUNG_NL_LEERKRACHT} De kolom "Uitdaging" ` +
  `hoort er niet bij - dat is een Uitdaging op één bepaalde dag.`;

export const PRUEFUNG_GRUPPE_HILFE_NL =
  `Een Uitdaging op één bepaalde dag, voor de hele klas tegelijk - ` +
  `geen dagelijks oefenen. Daarom staat deze kolom buiten de groep "Oefenen".`;

/**
 * ★ O-LIB (30.10.2026): as mesmas frases em português (Portugal) - para quem ensina, sem pronome
 * (Glossar Regel 1); "nível de dificuldade", "teclas dominadas" (§2.2), as crianças como "pessoa"
 * (Regel 2), o Desafio não é uma "nota"; "12 de 31" com "de" (Regel 13).
 */
const SCORE_ERKLAERUNG_PT_DOCENTES =
  "A pontuação junta a precisão e a velocidade da pessoa num só número de 0 a 100; " +
  "uma tecla errada conta como 5 carateres e o dobro da velocidade conta apenas " +
  "1,4 vezes - a precisão vale mais do que a velocidade.";

export const NAME_HILFE_PT =
  "Ordena a tabela pelo nome. Premir uma segunda vez inverte a ordem, uma terceira remove a ordenação - volta a ordem em que os estudantes foram adicionados.";

export const LEISTUNGSSTUFE_HILFE_PT =
  "O nível de dificuldade, de 1 a 50. Sobe por si quando alguém escreve com segurança e fluidez durante algum tempo, e volta a descer quando isso deixa de acontecer. Não é uma nota - indica o grau de dificuldade que os exercícios podem ter neste momento.";

export const TASTEN_HILFE_PT =
  `Quantas das teclas desbloqueadas até agora estão dominadas - ` +
  `"12 de 31" significa: das 31 teclas que esta pessoa já conhece, 12 estão ` +
  `dominadas. O segundo número cresce com a pessoa; não é o número de teclas do teclado.`;

export const NAECHSTE_HILFE_PT =
  `As duas teclas que esta pessoa aprende a seguir, por esta ordem. ` +
  `Desbloqueiam-se sozinhas quando as outras estiverem dominadas. O teclado é o ` +
  `deste dispositivo - quem tiver outro teclado pode ver outras teclas.`;

export const UEBEZEIT_HILFE_PT =
  "Quanto tempo se praticou realmente neste período. Conta o tempo passado no texto, não o tempo com o programa aberto - as pausas longas não contam.";

export const UEBEN_GRUPPE_HILFE_PT =
  `Estas três colunas vêm da mesma fonte: a PRÁTICA no período escolhido. ` +
  `A pontuação junta as duas anteriores num só número. ` +
  `${SCORE_ERKLAERUNG_PT_DOCENTES} A coluna Desafios, ao lado, não faz parte deste grupo - é um Desafio num dia concreto.`;

export const PRUEFUNG_GRUPPE_HILFE_PT =
  `Um Desafio num dia concreto, para toda a turma ao mesmo tempo - ` +
  `não é a prática de todos os dias. Por isso fica fora do grupo Prática.`;

/**
 * ★ O2-LIB (29.10.2026): dieselben Sätze, Portugiesisch (Brasilien) - an die Lehrkraft, você
 * (Sätze über die Sache), "nível de dificuldade", "teclas seguras", Kinder als "pessoa";
 * "Desafio" ist keine "nota"; "12/31" mit Schrägstrich (Glossar Regel 13).
 */
export const NAME_HILFE_BR =
  "Ordena a tabela pelo primeiro nome. Pressionar uma segunda vez inverte a ordem, e uma terceira remove a ordenação - volta a ordem em que as pessoas foram adicionadas.";

export const LEISTUNGSSTUFE_HILFE_BR =
  "O nível de dificuldade, de 1 a 50. Ele sobe sozinho quando alguém digita com segurança e fluência por um tempo, e desce de novo quando isso deixa de valer. Não é uma nota - mostra quão difíceis os exercícios podem ser neste momento.";

export const TASTEN_HILFE_BR =
  `Quantas das teclas desbloqueadas até agora já estão seguras - 12/31 significa: ` +
  `das 31 teclas que esta pessoa já conhece, 12 estão seguras. O segundo número cresce ` +
  `junto com a pessoa; não é a quantidade de teclas do teclado.`;

export const NAECHSTE_HILFE_BR =
  `As duas teclas que esta pessoa aprende em seguida, nessa ordem. Elas são ` +
  `desbloqueadas sozinhas quando as outras estiverem seguras. O teclado é o deste ` +
  `dispositivo - uma pessoa com outro teclado pode ver outras teclas.`;

export const UEBEZEIT_HILFE_BR =
  "Quanto tempo alguém realmente praticou neste período. Conta o tempo dedicado ao texto, não o tempo com o programa aberto - pausas longas não contam.";

const SCORE_ERKLAERUNG_DOCENTE_BR =
  "A pontuação reúne a precisão e a velocidade da digitação em um só número, de 0 a 100; " +
  "cada erro conta como 5 toques e uma velocidade duas vezes maior conta só 1,4 vez - " +
  "a precisão vale mais que a velocidade.";

export const UEBEN_GRUPPE_HILFE_BR =
  `Estas três colunas vêm da mesma fonte: a PRÁTICA no período escolhido. ` +
  `A pontuação reúne as duas colunas anteriores em um só número. ` +
  `${SCORE_ERKLAERUNG_DOCENTE_BR} A coluna Desafio ao lado não faz parte deste grupo - ` +
  `é um desafio de um dia específico.`;

export const PRUEFUNG_GRUPPE_HILFE_BR =
  `Um desafio de um dia específico, para a turma toda ao mesmo tempo - ` +
  `não é a prática do dia a dia. Por isso fica fora do grupo Prática.`;

/**
 * ★ O2-LIB (29.10.2026): die Score-Erklärung für die Lehrkraft rumänisch - über das Schreiben,
 * nicht über eine Person (Glossar Regel 2); Dezimalkomma.
 */
const SCORE_ERKLAERUNG_CADRE_RO_O2 =
  "Scorul reunește precizia și viteza de scriere într-un singur număr de la 0 la 100; " +
  "o greșeală se numără ca 5 caractere, iar o viteză dublă se numără doar de " +
  "1,4 ori - precizia are prioritate față de viteză.";

/**
 * ★ O2-LIB (29.10.2026): dieselben Sätze rumänisch - an die Lehrkraft, Mehrzahl und
 * unpersönliche Sätze (Glossar Regel 1); „nivel de dificultate“, „taste sigure“ (§2.2),
 * Kinder als „persoană“ (Regel 2), die Provocare ist keine „notă“; „12/31“ mit Schrägstrich.
 */
export const NAME_HILFE_RO =
  "Sortează tabelul după nume. A doua apăsare inversează ordinea, a treia elimină sortarea - revine ordinea în care au fost adăugate persoanele.";

export const LEISTUNGSSTUFE_HILFE_RO =
  "Nivelul de dificultate (de la 1 la 50). Crește singur când cineva scrie o vreme sigur și fluent și scade din nou când nu mai este așa. Nu este o notă - arată cât de grele pot fi exercițiile chiar acum.";

export const TASTEN_HILFE_RO =
  `Câte dintre tastele deblocate până acum sunt sigure - valoarea 12/31 înseamnă: ` +
  `din cele 31 de taste pe care persoana le cunoaște deja, 12 sunt sigure. Al doilea număr crește ` +
  `odată cu persoana; nu este numărul de taste de pe tastatură.`;

export const NAECHSTE_HILFE_RO =
  `Cele două taste pe care persoana le primește în continuare, în această ordine. ` +
  `Vin singure, imediat ce celelalte sunt sigure. Tastatura este cea a acestui dispozitiv - ` +
  `cu o altă tastatură pot apărea alte taste.`;

export const UEBEZEIT_HILFE_RO =
  "Cât s-a exersat cu adevărat în această perioadă. Se numără timpul petrecut la text, nu timpul cu programul deschis - pauzele lungi nu se numără.";

export const UEBEN_GRUPPE_HILFE_RO =
  `Aceste trei coloane provin din aceeași sursă: din EXERSARE în perioada aleasă. ` +
  `Scorul reunește cele două coloane dinaintea lui într-un singur număr. ` +
  `${SCORE_ERKLAERUNG_CADRE_RO_O2} Coloana „Provocare” de alături nu aparține acestui grup - ` +
  `este o Provocare dintr-o anumită zi.`;

export const PRUEFUNG_GRUPPE_HILFE_RO =
  `O Provocare dintr-o anumită zi, pentru toată clasa în același timp - ` +
  `nu exersarea de zi cu zi. De aceea se află în afara grupului Exersare.`;

/**
 * ★ O2-LIB (30.10.2026): dieselben Sätze schwedisch - an die Lehrkraft, du ohne Anrede-Wechsel (Glossar sv
 * Regel 1); "svårighetsnivå", "säkra tangenter" (§2.2), Kinder als "elev", die Utmaning ist kein Betyg.
 */
const SCORE_ERKLAERUNG_SV_LARARE =
  "Poängen sammanfattar träffsäkerhet och hastighet i ett tal från 0 till 100; " +
  "ett felslag räknas som 5 tecken, och dubbel hastighet räknas bara 1,4 gånger - " +
  "träffsäkerhet går före hastighet.";

export const NAME_HILFE_SV =
  "Sorterar tabellen efter förnamn. Ett andra tryck vänder ordningen, ett tredje tar bort sorteringen - då står eleverna i den ordning de lades till.";

export const LEISTUNGSSTUFE_HILFE_SV =
  "Svårighetsnivån, från 1 till 50. Den stiger av sig själv när någon en tid skriver säkert och flytande, och sjunker igen när det inte längre fungerar. Det är inget betyg - den säger hur svåra övningarna får vara just nu.";

export const TASTEN_HILFE_SV =
  `Hur många av de hittills upplåsta tangenterna som redan är säkra - 12/31 betyder: ` +
  `av de 31 tangenter som eleven redan kan är 12 säkra. Det andra talet växer ` +
  `med eleven; det är inte antalet tangenter på tangentbordet.`;

export const NAECHSTE_HILFE_SV =
  `De två tangenter som eleven får härnäst, i den ordningen. De kommer av sig själva ` +
  `så snart de andra är säkra. Tangentbordet är det på den här enheten - ` +
  `en elev med ett annat tangentbord kan se andra tangenter.`;

export const UEBEZEIT_HILFE_SV =
  "Hur länge det verkligen har övats under perioden. Det som räknas är tiden vid texten, inte tiden som appen varit öppen - långa pauser räknas inte.";

export const UEBEN_GRUPPE_HILFE_SV =
  `De här tre kolumnerna kommer från samma källa: ÖVNING under den valda perioden. ` +
  `Poängen sammanfattar de två kolumnerna före den i ett tal. ` +
  `${SCORE_ERKLAERUNG_SV_LARARE} Kolumnen Utmaningar bredvid ` +
  `hör inte till dem - det är en Utmaning en viss dag.`;

export const PRUEFUNG_GRUPPE_HILFE_SV =
  `En Utmaning en viss dag, för hela klassen samtidigt - ` +
  `inte vardaglig övning. Därför står den utanför gruppen Övning.`;

/**
 * ★ O2-LIB (30.10.2026): dieselben Sätze ukrainisch - an die Lehrkraft, ви (Glossar Regel 1); „рівень складності",
 * „впевнені клавіші" (§2.2), Kinder als „особа" (Regel 2), das Виклик ist keine „оцінка"; „12/31" mit Schrägstrich
 * (Regel 13). Die Erklärung der Bali steht hier selbst (keine Zeichenfolge mit Zahl am Satzende, Falle 4).
 */
const SCORE_VYKLAD_VY_UK =
  "Бали поєднують точність і швидкість друку в одне число від 0 до 100; " +
  "одне хибне натискання враховується як 5 знаків, а вдвічі вища швидкість - " +
  "лише як 1,4 раза: точність важливіша за швидкість.";

export const NAME_HILFE_UK =
  "Сортує таблицю за іменами. Друге натискання змінює порядок на протилежний, третє скасовує сортування - повертається порядок, у якому діти були додані.";

export const LEISTUNGSSTUFE_HILFE_UK =
  "Рівень складності (від 1 до 50). Він зростає сам, коли хтось певний час друкує впевнено й плавно, і знову знижується, коли це вже не виходить. Це не оцінка - він показує, наскільки складними можуть бути вправи просто зараз.";

export const TASTEN_HILFE_UK =
  `Скільки з досі відкритих клавіш уже впевнені - значення 12/31 означає: ` +
  `із 31 клавіші, які ця особа вже знає, 12 впевнені. Друге число зростає ` +
  `разом з особою; це не кількість клавіш на клавіатурі.`;

export const NAECHSTE_HILFE_UK =
  `Дві клавіші, які ця особа отримає наступними, у такому порядку. ` +
  `Вони відкриються самі, щойно інші стануть впевненими. Клавіатура - це ` +
  `клавіатура цього пристрою; на іншій клавіатурі можуть з'явитися інші клавіші.`;

export const UEBEZEIT_HILFE_UK =
  "Скільки насправді тренувалися за цей період. Враховується час, проведений за текстом, а не час із відкритою програмою - довгі перерви не рахуються.";

export const UEBEN_GRUPPE_HILFE_UK =
  `Ці три стовпці мають одне джерело: ТРЕНУВАННЯ за вибраний період. ` +
  `Бали поєднують два попередні стовпці в одне число. ` +
  `${SCORE_VYKLAD_VY_UK} Стовпець «Виклики» поряд із ними ` +
  `до цієї групи не належить - це Виклик одного певного дня.`;

export const PRUEFUNG_GRUPPE_HILFE_UK =
  `Виклик одного певного дня, для всього класу одночасно - ` +
  `не щоденне тренування. Тому він стоїть поза групою «Тренування».`;

const SPALTEN_HILFEN_JE_SPRACHE: Record<
  BedienSprache,
  {
    name: string;
    leistungsstufe: string;
    tasten: string;
    naechste: string;
    uebezeit: string;
    uebenGruppe: string;
    pruefungGruppe: string;
  }
> = {
  de: {
    name: NAME_HILFE,
    leistungsstufe: LEISTUNGSSTUFE_HILFE,
    tasten: TASTEN_HILFE,
    naechste: NAECHSTE_HILFE,
    uebezeit: UEBEZEIT_HILFE,
    uebenGruppe: UEBEN_GRUPPE_HILFE,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE,
  },
  en: {
    name: NAME_HILFE_EN,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_EN,
    tasten: TASTEN_HILFE_EN,
    naechste: NAECHSTE_HILFE_EN,
    uebezeit: UEBEZEIT_HILFE_EN,
    uebenGruppe: UEBEN_GRUPPE_HILFE_EN,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_EN,
  },
  fr: {
    name: NAME_HILFE_FR,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_FR,
    tasten: TASTEN_HILFE_FR,
    naechste: NAECHSTE_HILFE_FR,
    uebezeit: UEBEZEIT_HILFE_FR,
    uebenGruppe: UEBEN_GRUPPE_HILFE_FR,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_FR,
  },
  es: {
    name: NAME_HILFE_ES,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_ES,
    tasten: TASTEN_HILFE_ES,
    naechste: NAECHSTE_HILFE_ES,
    uebezeit: UEBEZEIT_HILFE_ES,
    uebenGruppe: UEBEN_GRUPPE_HILFE_ES,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_ES,
  },
  it: {
    name: NAME_HILFE_IT,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_IT,
    tasten: TASTEN_HILFE_IT,
    naechste: NAECHSTE_HILFE_IT,
    uebezeit: UEBEZEIT_HILFE_IT,
    uebenGruppe: UEBEN_GRUPPE_HILFE_IT,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_IT,
  },
  pl: {
    name: NAME_HILFE_PL,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_PL,
    tasten: TASTEN_HILFE_PL,
    naechste: NAECHSTE_HILFE_PL,
    uebezeit: UEBEZEIT_HILFE_PL,
    uebenGruppe: UEBEN_GRUPPE_HILFE_PL,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_PL,
  },
  tr: {
    name: NAME_HILFE_TR,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_TR,
    tasten: TASTEN_HILFE_TR,
    naechste: NAECHSTE_HILFE_TR,
    uebezeit: UEBEZEIT_HILFE_TR,
    uebenGruppe: UEBEN_GRUPPE_HILFE_TR,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_TR,
  },
  cs: {
    name: NAME_HILFE_CS,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_CS,
    tasten: TASTEN_HILFE_CS,
    naechste: NAECHSTE_HILFE_CS,
    uebezeit: UEBEZEIT_HILFE_CS,
    uebenGruppe: UEBEN_GRUPPE_HILFE_CS,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_CS,
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    name: NAME_HILFE_BG,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_BG,
    tasten: TASTEN_HILFE_BG,
    naechste: NAECHSTE_HILFE_BG,
    uebezeit: UEBEZEIT_HILFE_BG,
    uebenGruppe: UEBEN_GRUPPE_HILFE_BG,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_BG,
  },
  el: {
    name: NAME_HILFE_EL,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_EL,
    tasten: TASTEN_HILFE_EL,
    naechste: NAECHSTE_HILFE_EL,
    uebezeit: UEBEZEIT_HILFE_EL,
    uebenGruppe: UEBEN_GRUPPE_HILFE_EL,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_EL,
  },
  hu: {
    name: NAME_HILFE_HU,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_HU,
    tasten: TASTEN_HILFE_HU,
    naechste: NAECHSTE_HILFE_HU,
    uebezeit: UEBEZEIT_HILFE_HU,
    uebenGruppe: UEBEN_GRUPPE_HILFE_HU,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_HU,
  },
  nl: {
    name: NAME_HILFE_NL,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_NL,
    tasten: TASTEN_HILFE_NL,
    naechste: NAECHSTE_HILFE_NL,
    uebezeit: UEBEZEIT_HILFE_NL,
    uebenGruppe: UEBEN_GRUPPE_HILFE_NL,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_NL,
  },
  pt: {
    name: NAME_HILFE_PT,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_PT,
    tasten: TASTEN_HILFE_PT,
    naechste: NAECHSTE_HILFE_PT,
    uebezeit: UEBEZEIT_HILFE_PT,
    uebenGruppe: UEBEN_GRUPPE_HILFE_PT,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_PT,
  },
  br: {
    name: NAME_HILFE_BR,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_BR,
    tasten: TASTEN_HILFE_BR,
    naechste: NAECHSTE_HILFE_BR,
    uebezeit: UEBEZEIT_HILFE_BR,
    uebenGruppe: UEBEN_GRUPPE_HILFE_BR,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_BR,
  },
  ro: {
    name: NAME_HILFE_RO,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_RO,
    tasten: TASTEN_HILFE_RO,
    naechste: NAECHSTE_HILFE_RO,
    uebezeit: UEBEZEIT_HILFE_RO,
    uebenGruppe: UEBEN_GRUPPE_HILFE_RO,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_RO,
  },
  sv: {
    name: NAME_HILFE_SV,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_SV,
    tasten: TASTEN_HILFE_SV,
    naechste: NAECHSTE_HILFE_SV,
    uebezeit: UEBEZEIT_HILFE_SV,
    uebenGruppe: UEBEN_GRUPPE_HILFE_SV,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_SV,
  },
  uk: {
    name: NAME_HILFE_UK,
    leistungsstufe: LEISTUNGSSTUFE_HILFE_UK,
    tasten: TASTEN_HILFE_UK,
    naechste: NAECHSTE_HILFE_UK,
    uebezeit: UEBEZEIT_HILFE_UK,
    uebenGruppe: UEBEN_GRUPPE_HILFE_UK,
    pruefungGruppe: PRUEFUNG_GRUPPE_HILFE_UK,
  },
};

/**
 * Die sieben Sätze in der Bedienungssprache - ohne Angabe Deutsch, also genau
 * die Konstanten oben.
 */
export function leistungSpaltenHilfen(sprache: BedienSprache = "de") {
  return SPALTEN_HILFEN_JE_SPRACHE[sprache];
}
