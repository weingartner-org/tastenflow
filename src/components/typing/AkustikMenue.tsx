/**
 * ★★ DAS AKUSTIK-MENÜ UNTER DEM RUNDEN LAUTSPRECHER-SCHALTER (17.10.2026).
 *
 * Johannes: „baue unter dem runden Lautsprecher-Schalter in der Kopfzeile ein
 * Menü mit allen Akustik-Einstellungen, mit Schiebereglern und Mouseover-
 * Erklärung".
 *
 * Alles, was man hören kann, an EINER Stelle:
 *   · Vorlesen  - an/aus (wie Alt + V), Sprechtempo, Lautstärke der Stimme, Stimme
 *   · Töne      - an/aus, Lautstärke
 *   · Tipp-Klick - an/aus, Lautstärke
 *   · Melodie   - an/aus, Lautstärke, Klang, Lied
 *
 * ⚠️ KEIN DRITTER ZUSTAND. Jeder Schalter, Regler und jedes Auswahlfeld
 * schreibt in denselben Speicher wie das Zahnrad (`TypingSettings.tsx`):
 * `useVoice`, `useMelodie`, `setSoundMuted`, `setKeyTickOn` - dazu neu
 * `useLautstaerke` (`lautstaerke.ts`) und `useVoice().volume`. Die Texte der
 * schon vorhandenen Einstellungen sind die des Zahnrads (`T`), nicht
 * abgeschrieben: Zwei Wortlaute für dieselbe Sache gingen beim nächsten
 * Nachbessern auseinander.
 *
 * ⚠️ DIE KOPFZEILE KENNT DIESES MENÜ NICHT. Sie steckt in fünf Apps; sie
 * bekommt es als fertigen Inhalt herein (`akustikMenue` an `AppKopfzeile`) und
 * zeichnet nur den Rahmen mit der gemeinsamen Aufklapp-Mechanik.
 *
 * ★ Die Bausteine (Schalter `role="switch"`, Regler mit `aria-valuetext`,
 * Auswahl, Erklärung beim Darüberfahren) sind die GEMEINSAMEN aus
 * `components/AkustikBausteine.tsx` - dieselben wie in Plus, Punktgenau,
 * Klangpunkte und »Im Griff«. Hier steht nur, WAS Tastenflow einstellen lässt.
 * Die Wertangabe der Regler ist „70 %" in jeder Sprache (`alsProzent`), nicht
 * das deutsche „70 Prozent" der Bausteine.
 *
 * Fokus: Escape schliesst und gibt den Fokus zurück (Kopfzeile). Tab,
 * Pfeiltasten und Enter genügen; nichts ist `disabled`.
 */
import { useState } from "react";
import {
  AkustikAuswahl,
  AkustikKarte,
  AkustikRahmen,
  AkustikRegler,
  AkustikSchalter,
} from "@/components/AkustikBausteine";
import { useBedienSprache, texte } from "@/lib/bedienSprache";
import {
  ansage,
  ansageSchalter,
  isKeyTickOn,
  isSoundMuted,
  primeSpeech,
  setKeyTickOn,
  setSoundMuted,
  speak,
  useAvailableVoices,
  useVoice,
  type Lang,
} from "@/lib/typing";
import type { Lernweg } from "@/lib/typing/lernweg";
import { LAUTSTAERKE_SCHRITT, useLautstaerke } from "@/lib/typing/lautstaerke";
import {
  KLAENGE,
  MELODIEN,
  klangName,
  melodieName,
  melodieProbe,
  melodieUmschalten,
  melodieZufallName,
  useMelodie,
  type KlangWahl,
} from "@/lib/typing/melodie";
import { playKeyTickProbe, playSuccessSound } from "@/lib/typing/sound";
import { stimmenZurAuswahl } from "@/lib/typing/stimmenAuswahl";
import { T as ZAHNRAD } from "./TypingSettings";
import { wahlTexte } from "@/lib/typing/wahltaste";
import { useBedienStimme } from "./useBedienStimme";

/**
 * Nur das, was das Zahnrad NICHT schon sagt: die Namen und Erklärungen der
 * Regler. Alles andere kommt aus `T` des Zahnrads.
 */
export const AKUSTIK_TEXTE = texte({
  de: {
    titel: "Klang und Vorlesen",
    tipp: "Klang und Vorlesen einstellen",
    toeneLaut: "Lautstärke der Töne",
    toeneLautHinweis: "Wie laut Belohnungen, Fehlertöne und Fanfaren sind. 100 % ist so laut wie bisher.",
    klickLaut: "Lautstärke des Klicks",
    klickLautHinweis: "Wie laut der Klick bei jedem richtigen Anschlag ist. Du hörst ihn nur, wenn „Tipp-Klick“ an ist.",
    melodieLaut: "Lautstärke der Melodie",
    melodieLautHinweis: "Wie laut die Melodie beim Tippen ist, samt Band. Du hörst sie nur, wenn „Melodie“ an ist.",
    tempoHinweis: "Wie schnell die Stimme spricht. 100 % ist normal, weiter rechts ist schneller.",
    sprechLaut: "Lautstärke der Stimme",
    sprechLautHinweis: "Macht die Stimme leiser. Lauter als dein Gerät kann sie nicht werden - dafür am Gerät die Lautstärke aufdrehen.",
    klangHinweis: "Wie die Töne der Melodie klingen - vom Klavier bis zur Überraschung. Beim Wählen hörst du eine Probe.",
    liedHinweis: "Welches Lied beim Tippen gespielt wird, oder „Überraschung“ für ein wechselndes. Beim Wählen hörst du eine Probe.",
    pausenName: "Pausen im Lied",
    pausenHinweis: "Die Pausen des Liedes bleiben still: Fällt eine Taste in eine Pause, kommt kein Ton. So erkennst du die Melodie besser. Aus: Pausen werden überspielt.",
  },
  en: {
    titel: "Sound and reading aloud",
    tipp: "Adjust sound and reading aloud",
    toeneLaut: "Sounds volume",
    toeneLautHinweis: "How loud rewards, error tones and fanfares are. 100% is as loud as before.",
    klickLaut: "Key click volume",
    klickLautHinweis: "How loud the click is for every correct keystroke. You only hear it when “Key click” is on.",
    melodieLaut: "Melody volume",
    melodieLautHinweis: "How loud the melody is while you type, band included. You only hear it when “Melody” is on.",
    tempoHinweis: "How fast the voice speaks. 100% is normal, further right is faster.",
    sprechLaut: "Voice volume",
    sprechLautHinweis: "Makes the voice quieter. It cannot be louder than your device - turn up the volume on the device for that.",
    klangHinweis: "What the notes of the melody sound like - from piano to surprise. You hear a sample when you choose.",
    liedHinweis: "Which tune plays while you type, or “Surprise” for a changing one. You hear a sample when you choose.",
    pausenName: "Rests in the tune",
    pausenHinweis: "The rests of the tune stay silent: a key that falls on a rest plays no note. This makes the melody easier to recognise. Off: rests are skipped over.",
  },
  fr: {
    titel: "Son et lecture à voix haute",
    tipp: "Régler le son et la lecture à voix haute",
    toeneLaut: "Volume des sons",
    toeneLautHinweis: "Le volume des récompenses, des sons d'erreur et des fanfares. 100 % est aussi fort qu'avant.",
    klickLaut: "Volume du clic",
    klickLautHinweis: "Le volume du clic à chaque frappe correcte. Tu ne l'entends que si \"Clic de frappe\" est activé.",
    melodieLaut: "Volume de la mélodie",
    melodieLautHinweis: "Le volume de la mélodie pendant que tu tapes, avec le groupe. Tu ne l'entends que si \"Mélodie\" est activée.",
    tempoHinweis: "La vitesse de la voix. 100 % est normal, plus à droite c'est plus rapide.",
    sprechLaut: "Volume de la voix",
    sprechLautHinweis: "Rend la voix plus douce. Elle ne peut pas être plus forte que ton appareil - pour cela, monte le volume de l'appareil.",
    klangHinweis: "Comment sonnent les notes de la mélodie - du piano à la surprise. Tu entends un extrait quand tu choisis.",
    liedHinweis: "Quel air est joué pendant que tu tapes, ou \"Surprise\" pour un air qui change. Tu entends un extrait quand tu choisis.",
    pausenName: "Silences de l'air",
    pausenHinweis: "Les silences de l'air restent muets : une touche qui tombe sur un silence ne joue aucune note. La mélodie est ainsi plus facile à reconnaitre. Désactivé : les silences sont sautés.",
  },
  es: {
    titel: "Sonido y lectura en voz alta",
    tipp: "Ajustar el sonido y la lectura en voz alta",
    toeneLaut: "Volumen de los sonidos",
    toeneLautHinweis: "Qué tan fuertes suenan las recompensas, los sonidos de error y las fanfarrias. 100 % es tan fuerte como antes.",
    klickLaut: "Volumen del clic",
    klickLautHinweis: "Qué tan fuerte suena el clic con cada pulsación correcta. Solo lo oyes si “Clic de tecla” está activado.",
    melodieLaut: "Volumen de la melodía",
    melodieLautHinweis: "Qué tan fuerte suena la melodía mientras escribes, con la banda. Solo la oyes si “Melodía” está activada.",
    tempoHinweis: "Con qué rapidez habla la voz. 100 % es normal, más a la derecha es más rápido.",
    sprechLaut: "Volumen de la voz",
    sprechLautHinweis: "Baja el volumen de la voz. No puede sonar más fuerte que tu dispositivo - para eso sube el volumen del dispositivo.",
    klangHinweis: "Cómo suenan las notas de la melodía - del piano a la sorpresa. Al elegir oyes una muestra.",
    liedHinweis: "Qué canción suena mientras escribes, o “Sorpresa” para una que cambia. Al elegir oyes una muestra.",
    pausenName: "Silencios de la canción",
    pausenHinweis: "Los silencios de la canción quedan mudos: una tecla que cae en un silencio no suena. Así se reconoce mejor la melodía. Desactivado: los silencios se saltan.",
  },
  it: {
    titel: "Suono e lettura ad alta voce",
    tipp: "Regolare suono e lettura ad alta voce",
    toeneLaut: "Volume dei suoni",
    toeneLautHinweis: "Quanto sono forti ricompense, suoni di errore e fanfare. 100 % è forte come prima.",
    klickLaut: "Volume del clic",
    klickLautHinweis: "Quanto è forte il clic a ogni battuta giusta. Lo senti solo se “Clic dei tasti” è attivo.",
    melodieLaut: "Volume della melodia",
    melodieLautHinweis: "Quanto è forte la melodia mentre scrivi, band compresa. La senti solo se “Melodia” è attiva.",
    tempoHinweis: "Quanto veloce parla la voce. 100 % è normale, più a destra è più veloce.",
    sprechLaut: "Volume della voce",
    sprechLautHinweis: "Abbassa la voce. Non può essere più forte del tuo dispositivo - per questo alza il volume del dispositivo.",
    klangHinweis: "Come suonano le note della melodia - dal pianoforte alla sorpresa. Quando scegli senti un assaggio.",
    liedHinweis: "Quale brano suona mentre scrivi, oppure “Sorpresa” per uno che cambia. Quando scegli senti un assaggio.",
    pausenName: "Pause della melodia",
    pausenHinweis: "Le pause della melodia restano mute: un tasto che cade su una pausa non suona. Così la melodia si riconosce meglio. Disattivato: le pause vengono saltate.",
  },
  pl: {
    titel: "Dźwięk i czytanie na głos",
    tipp: "Ustaw dźwięk i czytanie na głos",
    toeneLaut: "Głośność dźwięków",
    toeneLautHinweis: "Jak głośne są nagrody, dźwięki błędów i fanfary. 100 % to tak głośno jak dotąd.",
    klickLaut: "Głośność stukotu",
    klickLautHinweis: "Jak głośny jest stukot przy każdym dobrym uderzeniu. Słychać go tylko wtedy, gdy „Stukot klawiszy” jest włączony.",
    melodieLaut: "Głośność melodii",
    melodieLautHinweis: "Jak głośna jest melodia podczas pisania, razem z zespołem. Słychać ją tylko wtedy, gdy „Melodia” jest włączona.",
    tempoHinweis: "Jak szybko mówi głos. 100 % to normalnie, im dalej w prawo, tym szybciej.",
    sprechLaut: "Głośność głosu",
    sprechLautHinweis: "Ścisza głos. Nie może być głośniejszy niż twoje urządzenie - do tego podgłośnij urządzenie.",
    klangHinweis: "Jak brzmią dźwięki melodii - od pianina po niespodziankę. Przy wyborze usłyszysz próbkę.",
    liedHinweis: "Jaka melodia gra podczas pisania, albo „Niespodzianka” dla zmieniającej się. Przy wyborze usłyszysz próbkę.",
    pausenName: "Pauzy w melodii",
    pausenHinweis: "Pauzy melodii pozostają ciche: klawisz, który wypada na pauzie, nie wydaje dźwięku. Dzięki temu łatwiej rozpoznać melodię. Wyłączone: pauzy są pomijane.",
  },
  tr: {
    titel: "Ses ve sesli okuma",
    tipp: "Sesi ve sesli okumayı ayarla",
    toeneLaut: "Seslerin düzeyi",
    toeneLautHinweis: "Ödüllerin, hata seslerinin ve fanfarların ne kadar yüksek olduğu. %100 eskisi kadar yüksektir.",
    klickLaut: "Tuş sesinin düzeyi",
    klickLautHinweis: "Her doğru vuruştaki tık sesinin ne kadar yüksek olduğu. Yalnızca \"Tuş sesi\" açıkken duyarsın.",
    melodieLaut: "Melodinin düzeyi",
    melodieLautHinweis: "Yazarken melodinin, grubuyla birlikte, ne kadar yüksek olduğu. Yalnızca \"Melodi\" açıkken duyarsın.",
    tempoHinweis: "Sesin ne kadar hızlı konuştuğu. %100 normaldir, sağa gittikçe hızlanır.",
    sprechLaut: "Sesin düzeyi",
    sprechLautHinweis: "Sesi kısar. Cihazından daha yüksek olamaz - bunun için cihazın ses düzeyini aç.",
    klangHinweis: "Melodinin seslerinin nasıl çaldığı - piyanodan sürprize. Seçerken bir örnek dinlersin.",
    liedHinweis: "Yazarken hangi şarkının çalacağı ya da değişen bir şarkı için \"Sürpriz\". Seçerken bir örnek dinlersin.",
    pausenName: "Şarkıdaki duraklar",
    pausenHinweis: "Şarkının durakları sessiz kalır: bir durağa denk gelen tuş ses çıkarmaz. Böylece melodi daha kolay tanınır. Kapalı: duraklar atlanır.",
  },
  cs: {
    titel: "Zvuk a předčítání",
    tipp: "Nastavit zvuk a předčítání",
    toeneLaut: "Hlasitost zvuků",
    toeneLautHinweis: "Jak hlasité jsou odměny, zvuky chyb a fanfáry. 100\u00a0% je stejně hlasité jako dosud.",
    klickLaut: "Hlasitost cvaknutí",
    klickLautHinweis: "Jak hlasité je cvaknutí při každém správném úhozu. Uslyšíš ho jen při zapnutém „Cvakání kláves“.",
    melodieLaut: "Hlasitost melodie",
    melodieLautHinweis: "Jak hlasitá je melodie při psaní, včetně kapely. Uslyšíš ji jen při zapnuté „Melodii“.",
    tempoHinweis: "Jak rychle hlas mluví. 100\u00a0% je normální, víc doprava je rychleji.",
    sprechLaut: "Hlasitost hlasu",
    sprechLautHinweis: "Hlas ztiší. Hlasitější než tvé zařízení být nemůže - k tomu zesil zařízení.",
    klangHinweis: "Jak znějí tóny melodie - od klavíru po překvapení. Při výběru uslyšíš ukázku.",
    liedHinweis: "Která písnička hraje při psaní, nebo „Překvapení“ pro měnící se. Při výběru uslyšíš ukázku.",
    pausenName: "Pauzy v písničce",
    pausenHinweis: "Pauzy písničky zůstanou tiché: klávesa, která padne na pauzu, nezahraje tón. Melodii tak lépe poznáš. Vypnuto: pauzy se přeskočí.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: "Звук и четене на глас",
      tipp: "Настрой звука и четенето на глас",
      toeneLaut: "Сила на звуците",
      toeneLautHinweis: "Колко силни са наградите, звуците при грешка и фанфарите. 100% е толкова силно, колкото досега.",
      klickLaut: "Сила на тракането",
      klickLautHinweis: "Колко силно е тракането при всеки верен клавиш. Чуваш го само когато „Тракане на клавишите“ е включено.",
      melodieLaut: "Сила на мелодията",
      melodieLautHinweis: "Колко силна е мелодията при писане, заедно със съпровода. Чуваш я само когато „Мелодия“ е включена.",
      tempoHinweis: "Колко бързо говори гласът. 100% е нормално, по-надясно е по-бързо.",
      sprechLaut: "Сила на гласа",
      sprechLautHinweis: "Прави гласа по-тих. По-силен от устройството не може да стане - за това увеличи звука на самото устройство.",
      klangHinweis: "Как звучат тоновете на мелодията - от пиано до изненада. Когато избираш, чуваш проба.",
      liedHinweis: "Коя мелодия звучи при писане, или „Изненада“ за всеки път различна. Когато избираш, чуваш проба.",
      pausenName: "Паузи в мелодията",
      pausenHinweis: "Паузите в мелодията остават тихи: ако клавиш попадне на пауза, няма тон. Така по-лесно разпознаваш мелодията. Изключено: паузите се прескачат.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titel: "Ήχος και εκφώνηση",
      tipp: "Ρυθμίσεις ήχου και εκφώνησης",
      toeneLaut: "Ένταση ήχων",
      toeneLautHinweis: "Πόσο δυνατά ακούγονται οι επιβραβεύσεις, οι ήχοι λάθους και οι φανφάρες. 100% είναι όσο δυνατά ήταν μέχρι τώρα.",
      klickLaut: "Ένταση ήχου πλήκτρων",
      klickLautHinweis: "Πόσο δυνατά ακούγεται ο ήχος σε κάθε σωστό πάτημα. Τον ακούς μόνο όταν ο «Ήχος πλήκτρων» είναι ενεργός.",
      melodieLaut: "Ένταση μελωδίας",
      melodieLautHinweis: "Πόσο δυνατά ακούγεται η μελωδία όσο γράφεις, μαζί με τη μπάντα. Την ακούς μόνο όταν η «Μελωδία» είναι ενεργή.",
      tempoHinweis: "Πόσο γρήγορα μιλά η φωνή. 100% είναι κανονικά, πιο δεξιά είναι πιο γρήγορα.",
      sprechLaut: "Ένταση φωνής",
      sprechLautHinweis: "Κάνει τη φωνή πιο σιγανή. Πιο δυνατά από τη συσκευή σου δεν γίνεται - για αυτό δυνάμωσε την ένταση στη συσκευή.",
      klangHinweis: "Πώς ακούγονται οι νότες της μελωδίας - από πιάνο ως έκπληξη. Όταν επιλέγεις, ακούς ένα δείγμα.",
      liedHinweis: "Ποιο τραγούδι παίζει όσο γράφεις ή «Έκπληξη» για ένα που αλλάζει. Όταν επιλέγεις, ακούς ένα δείγμα.",
      pausenName: "Παύσεις στο τραγούδι",
      pausenHinweis: "Οι παύσεις του τραγουδιού μένουν σιωπηλές: αν ένα πλήκτρο πέσει σε παύση, δεν ακούγεται νότα. Έτσι αναγνωρίζεις πιο εύκολα τη μελωδία. Ανενεργό: οι παύσεις παραλείπονται.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titel: "Hang és felolvasás",
      tipp: "Hang és felolvasás beállítása",
      toeneLaut: "A hangjelzések hangereje",
      toeneLautHinweis: "Milyen hangosak a jutalmak, a hibahangok és a fanfárok. A 100% ugyanolyan hangos, mint eddig.",
      klickLaut: "A kattogás hangereje",
      klickLautHinweis: "Milyen hangos a kattogás minden helyes leütésnél. Csak akkor hallod, ha a „Kattogás” be van kapcsolva.",
      melodieLaut: "A dallam hangereje",
      melodieLautHinweis: "Milyen hangos a dallam gépelés közben, a zenekarral együtt. Csak akkor hallod, ha a „Dallam” be van kapcsolva.",
      tempoHinweis: "Milyen gyorsan beszél a hang. A 100% a normál, jobbra haladva gyorsabb.",
      sprechLaut: "A felolvasó hang hangereje",
      sprechLautHinweis: "Halkabbá teszi a felolvasó hangot. Hangosabb nem lehet, mint az eszközöd - ehhez az eszközön hangosítsd fel.",
      klangHinweis: "Milyen hangszínnel szól a dallam - a zongorától a meglepetésig. Választáskor hallasz egy mintát.",
      liedHinweis: "Melyik dallam szól gépelés közben, vagy „Meglepetés” a mindig változóhoz. Választáskor hallasz egy mintát.",
      pausenName: "Szünetek a dallamban",
      pausenHinweis: "A dallam szünetei csendesek maradnak: ha egy billentyű szünetre esik, nem szól hang. Így jobban felismered a dallamot. Ki: a szüneteket átugorja.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: "Geluid en voorlezen",
      tipp: "Geluid en voorlezen instellen",
      toeneLaut: "Volume van de geluiden",
      toeneLautHinweis: "Hoe luid beloningen, foutgeluiden en fanfares klinken. 100% is even luid als voorheen.",
      klickLaut: "Volume van de toetsklik",
      klickLautHinweis: "Hoe luid de klik bij elke goede aanslag is. Je hoort de klik alleen als \"Toetsklik\" aan staat.",
      melodieLaut: "Volume van de melodie",
      melodieLautHinweis: "Hoe luid de melodie tijdens het typen is, met de band erbij. Je hoort de melodie alleen als \"Melodie\" aan staat.",
      tempoHinweis: "Hoe snel de stem spreekt. 100% is normaal, verder naar rechts is sneller.",
      sprechLaut: "Volume van de stem",
      sprechLautHinweis: "Maakt de stem zachter. Luider dan je apparaat kan de stem niet worden - zet daarvoor het volume op het apparaat hoger.",
      klangHinweis: "Hoe de tonen van de melodie klinken - van piano tot verrassing. Bij het kiezen hoor je een voorbeeld.",
      liedHinweis: "Welk liedje er speelt tijdens het typen, of \"Verrassing\" voor steeds een ander liedje. Bij het kiezen hoor je een voorbeeld.",
      pausenName: "Rusten in het liedje",
      pausenHinweis: "De rusten van het liedje blijven stil: valt een toets op een rust, dan klinkt er geen toon. Zo herken je de melodie beter. Uit: rusten worden overgeslagen.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: "Som e leitura em voz alta",
      tipp: "Ajustar o som e a leitura em voz alta",
      toeneLaut: "Volume dos sons",
      toeneLautHinweis: "O volume das recompensas, dos sons de erro e das fanfarras. 100% é o volume de sempre.",
      klickLaut: "Volume do som das teclas",
      klickLautHinweis: "O volume do som a cada toque certo. Só o ouves quando \"Som das teclas\" está ligado.",
      melodieLaut: "Volume da melodia",
      melodieLautHinweis: "O volume da melodia enquanto escreves, com a banda. Só a ouves quando \"Melodia\" está ligada.",
      tempoHinweis: "A velocidade da voz. 100% é normal; mais para a direita é mais rápido.",
      sprechLaut: "Volume da voz",
      sprechLautHinweis: "Torna a voz mais baixa. Não pode ficar mais alta do que o teu dispositivo - para isso, aumenta o volume no dispositivo.",
      klangHinweis: "Como soam as notas da melodia - do piano à surpresa. Ao escolher, ouves uma amostra.",
      liedHinweis: "Que música toca enquanto escreves, ou \"Surpresa\" para uma que vai mudando. Ao escolher, ouves uma amostra.",
      pausenName: "Pausas na música",
      pausenHinweis: "As pausas da música ficam em silêncio: se uma tecla calhar numa pausa, não toca nenhuma nota. Assim reconheces melhor a melodia. Desligado: as pausas são saltadas.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titel: "Som e leitura em voz alta",
      tipp: "Ajustar som e leitura em voz alta",
      toeneLaut: "Volume dos sons",
      toeneLautHinweis: "O volume das recompensas, dos sons de erro e das fanfarras. 100% é o volume de antes.",
      klickLaut: "Volume do clique",
      klickLautHinweis: "O volume do clique a cada toque certo. Você só ouve quando Clique das teclas está ligado.",
      melodieLaut: "Volume da melodia",
      melodieLautHinweis: "O volume da melodia enquanto você digita, com a banda. Você só ouve quando Melodia está ligada.",
      tempoHinweis: "A velocidade da voz. 100% é normal, mais para a direita é mais rápido.",
      sprechLaut: "Volume da voz",
      sprechLautHinweis: "Deixa a voz mais baixa. Ela não fica mais alta que o seu aparelho - para isso, aumente o volume no aparelho.",
      klangHinweis: "Como soam as notas da melodia - do piano à surpresa. Ao escolher, você ouve uma amostra.",
      liedHinweis: "Qual música toca enquanto você digita, ou Surpresa para uma que vai mudando. Ao escolher, você ouve uma amostra.",
      pausenName: "Pausas na música",
      pausenHinweis: "As pausas da música ficam em silêncio: se uma tecla cai numa pausa, nenhuma nota toca. Assim você reconhece melhor a melodia. Desligado: as pausas são puladas.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titel: "Sunet și citire cu voce tare",
      tipp: "Reglează sunetul și citirea cu voce tare",
      toeneLaut: "Volumul sunetelor",
      toeneLautHinweis: "Cât de tare se aud recompensele, sunetele pentru greșeli și fanfarele. 100 % înseamnă la fel de tare ca până acum.",
      klickLaut: "Volumul clicului",
      klickLautHinweis: "Cât de tare se aude clicul la fiecare apăsare corectă. Îl auzi doar când „Clicul tastelor” este pornit.",
      melodieLaut: "Volumul melodiei",
      melodieLautHinweis: "Cât de tare se aude melodia când scrii, cu tot cu acompaniament. O auzi doar când „Melodie” este pornită.",
      tempoHinweis: "Cât de repede vorbește vocea. 100 % este normal, mai la dreapta este mai repede.",
      sprechLaut: "Volumul vocii",
      sprechLautHinweis: "Face vocea mai încet. Nu poate fi mai tare decât dispozitivul tău - pentru asta, mărește volumul pe dispozitiv.",
      klangHinweis: "Cum sună notele melodiei - de la pian până la surpriză. Când alegi, auzi o mostră.",
      liedHinweis: "Ce cântec se aude când scrii sau „Surpriză” pentru unul care se schimbă. Când alegi, auzi o mostră.",
      pausenName: "Pauzele din cântec",
      pausenHinweis: "Pauzele cântecului rămân fără sunet: dacă o tastă cade pe o pauză, nu se aude nicio notă. Așa recunoști mai ușor melodia. Oprit: pauzele sunt sărite.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: "Ljud och uppläsning",
      tipp: "Ställ in ljud och uppläsning",
      toeneLaut: "Volym för ljuden",
      toeneLautHinweis: "Hur höga belöningar, felljud och fanfarer är. 100 % är lika högt som förut.",
      klickLaut: "Volym för tangentklicket",
      klickLautHinweis: "Hur högt klicket är vid varje rätt anslag. Du hör det bara när Tangentklick är på.",
      melodieLaut: "Volym för melodin",
      melodieLautHinweis: "Hur hög melodin är när du skriver, med band. Du hör den bara när Melodi är på.",
      tempoHinweis: "Hur snabbt rösten talar. 100 % är normalt, längre åt höger är snabbare.",
      sprechLaut: "Volym för rösten",
      sprechLautHinweis: "Gör rösten tystare. Den kan inte bli högre än din enhet - höj volymen på enheten i stället.",
      klangHinweis: "Hur melodins toner låter - från piano till överraskning. När du väljer hör du ett prov.",
      liedHinweis: "Vilken låt som spelas när du skriver, eller Överraskning för en som växlar. När du väljer hör du ett prov.",
      pausenName: "Pauser i låten",
      pausenHinweis: "Låtens pauser är tysta: hamnar en tangent på en paus hörs ingen ton. Så känner du lättare igen melodin. Av: pauserna hoppas över.",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titel: "Звук і читання вголос",
      tipp: "Налаштувати звук і читання вголос",
      toeneLaut: "Гучність звуків",
      toeneLautHinweis: "Наскільки гучні нагороди, звуки помилок і фанфари. 100% - така сама гучність, як досі.",
      klickLaut: "Гучність клацання",
      klickLautHinweis: "Наскільки гучне клацання при кожному правильному натисканні. Його чути, лише коли ввімкнено «Клацання клавіш».",
      melodieLaut: "Гучність мелодії",
      melodieLautHinweis: "Наскільки гучна мелодія під час друку, разом із супроводом. Її чути, лише коли ввімкнено «Мелодія під час друку».",
      tempoHinweis: "Як швидко говорить голос. 100% - звичайний темп, правіше - швидше.",
      sprechLaut: "Гучність голосу",
      sprechLautHinweis: "Робить голос тихішим. Гучнішим за пристрій він не стане - для цього збільш гучність на самому пристрої.",
      klangHinweis: "Як звучать ноти мелодії - від фортепіано до сюрпризу. Під час вибору лунає зразок.",
      liedHinweis: "Яка пісня звучить під час друку, або «Сюрприз» - щоразу інша. Під час вибору лунає зразок.",
      pausenName: "Паузи в пісні",
      pausenHinweis: "Паузи пісні залишаються тихими: якщо клавіша припадає на паузу, ноти немає. Так легше впізнати мелодію. Вимкнено: паузи пропускаються.",
    },
});

/** Prozent für Anzeige und Sprachausgabe: 0,7 ⇒ „70 %". */
export function alsProzent(wert: number): string {
  return `${Math.round(wert * 100)} %`;
}

export function AkustikMenue({
  onVorlesen,
  lang,
  lernweg,
}: {
  /** Derselbe Weg wie Alt + V - samt Ansage (`vorlesenUmschalten` der Seite). */
  onVorlesen: () => void;
  /** Übungssprache und Lernweg: sie bestimmen, welche Stimmen angeboten werden. */
  lang: Lang;
  lernweg: Lernweg;
}) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  // ★ 18.10.2026: am Mac „Wahl" statt „Alt" in den Hinweisen (`wahlTexte`).
  const t = wahlTexte(ZAHNRAD[sprache], sprache);
  const a = AKUSTIK_TEXTE[sprache];
  const stimme = useBedienStimme();

  const voiceEnabled = useVoice((s) => s.enabled);
  const rate = useVoice((s) => s.rate);
  const setRate = useVoice((s) => s.setRate);
  const sprechLautstaerke = useVoice((s) => s.volume);
  const setVolume = useVoice((s) => s.setVolume);
  const voiceURI = useVoice((s) => s.voiceURI);
  const setVoiceURI = useVoice((s) => s.setVoiceURI);
  const voices = useAvailableVoices();
  const stimmenListe = stimmenZurAuswahl(voices, voiceURI, lang, lernweg);

  const [muted, setMuted] = useState(() => isSoundMuted());
  const [tick, setTick] = useState(() => isKeyTickOn());
  const toene = useLautstaerke((s) => s.toene);
  const klick = useLautstaerke((s) => s.klick);
  const melodieLaut = useLautstaerke((s) => s.melodie);
  const setze = useLautstaerke((s) => s.setze);

  const melodieAn = useMelodie((s) => s.an);
  const klang = useMelodie((s) => s.klang);
  const lied = useMelodie((s) => s.melodie);
  const setKlang = useMelodie((s) => s.setKlang);
  const setLied = useMelodie((s) => s.setMelodie);
  const pausen = useMelodie((s) => s.pausen);
  const setPausen = useMelodie((s) => s.setPausen);
  const lieder = [...MELODIEN].sort((x, y) =>
    melodieName(x, sprache).localeCompare(melodieName(y, sprache), sprache),
  );
  const probeLied = () => (lied === "zufall" ? (lieder[0]?.id ?? "") : lied);

  const prozent = { min: 0, max: 1, schritt: LAUTSTAERKE_SCHRITT } as const;
  const sprich = (schluessel: "tempoProbe" | "stimmeProbe") => {
    primeSpeech();
    speak(ansage(schluessel));
  };

  return (
    // ★ 18.10.2026: Die Breite liefert der Rahmen der Kopfzeile (`w-80`, 320 px
    // mit Rand). Ein zweites `w-80` HIER machte das Menü 16 px breiter als sein
    // Rahmen - rechts liefen Schalter und Reglerknopf aus dem Kasten (Johannes:
    // „Menü ist rechts abgeschnitten").
    <div className="max-h-[80vh] w-full overflow-y-auto">
      <AkustikRahmen titel={a.titel} titelSichtbar={false}>
        <AkustikKarte
          symbol="vorlesen"
          titel={t.vorlesenTitel}
          an={voiceEnabled}
          onWechsel={onVorlesen}
          erklaerung={t.vorlesenTitelAttr}
        >
          {voiceEnabled && (
            <>
              <AkustikRegler
                symbol="tempo"
                name={t.sprechTempoName}
                wert={rate}
                min={0.6}
                max={2}
                schritt={0.1}
                wertText={alsProzent(rate)}
                erklaerung={a.tempoHinweis}
                onWert={setRate}
                onProbe={() => sprich("tempoProbe")}
              />
              <AkustikRegler
                symbol="lautsprecherLeise"
                name={a.sprechLaut}
                wert={sprechLautstaerke}
                min={0.1}
                max={1}
                schritt={LAUTSTAERKE_SCHRITT}
                wertText={alsProzent(sprechLautstaerke)}
                erklaerung={a.sprechLautHinweis}
                onWert={setVolume}
                onProbe={() => sprich("stimmeProbe")}
              />
              <AkustikAuswahl
                symbol="stimme"
                name={t.stimme}
                wert={voiceURI}
                optionen={[
                  { wert: "", name: t.automatisch },
                  ...stimmenListe.map((v) => ({ wert: v.voiceURI, name: `${v.name} (${v.lang})` })),
                ]}
                erklaerung={t.stimmeHinweis}
                onWert={(uri) => {
                  setVoiceURI(uri);
                  sprich("stimmeProbe");
                }}
              />
            </>
          )}
        </AkustikKarte>

        <AkustikKarte
          symbol="glocke"
          titel={t.tonTitel}
          an={!muted}
          erklaerung={t.tonHinweis}
          onWechsel={() => {
            const v = !muted;
            setMuted(v);
            setSoundMuted(v);
            stimme.sprich(ansageSchalter("tonAus", "tonAn", v, stimme.lang()));
          }}
        >
          <AkustikRegler
            symbol="lautsprecher"
            gedimmt={muted}
            name={a.toeneLaut}
            wert={toene}
            {...prozent}
            wertText={alsProzent(toene)}
            erklaerung={a.toeneLautHinweis}
            onWert={(w) => setze("toene", w)}
            onProbe={playSuccessSound}
          />
        </AkustikKarte>

        <AkustikKarte
          symbol="tastatur"
          titel={t.klick}
          an={tick}
          erklaerung={t.klickTitel}
          onWechsel={() => {
            const v = !tick;
            setTick(v);
            setKeyTickOn(v);
            stimme.sprich(ansageSchalter("tippKlickAn", "tippKlickAus", v, stimme.lang()));
          }}
        >
          <AkustikRegler
            symbol="lautsprecher"
            gedimmt={!tick}
            name={a.klickLaut}
            wert={klick}
            {...prozent}
            wertText={alsProzent(klick)}
            erklaerung={a.klickLautHinweis}
            onWert={(w) => setze("klick", w)}
            onProbe={playKeyTickProbe}
          />
        </AkustikKarte>

        <AkustikKarte
          symbol="note"
          titel={t.melodie}
          an={melodieAn}
          erklaerung={t.melodieHinweis}
          onWechsel={() => {
            const jetzt = melodieUmschalten();
            // Einschalten schaltet den Ton mit ein (`melodieUmschalten`).
            setMuted(isSoundMuted());
            stimme.sprich(ansage(jetzt ? "melodieAn" : "melodieAus", stimme.lang()));
          }}
        >
          <AkustikRegler
            symbol="lautsprecher"
            gedimmt={!melodieAn}
            name={a.melodieLaut}
            wert={melodieLaut}
            {...prozent}
            wertText={alsProzent(melodieLaut)}
            erklaerung={a.melodieLautHinweis}
            onWert={(w) => setze("melodie", w)}
            onProbe={() => melodieProbe(klang, probeLied(), 3)}
          />
          {melodieAn && (
            <>
              <AkustikAuswahl
                symbol="welle"
                name={t.melodieKlang}
                wert={klang}
                optionen={(["zufall", ...KLAENGE] as KlangWahl[]).map((k) => ({
                  wert: k,
                  name: klangName(k, sprache),
                }))}
                erklaerung={a.klangHinweis}
                onWert={(w) => {
                  setKlang(w as KlangWahl);
                  melodieProbe(w as KlangWahl, probeLied());
                }}
              />
              <AkustikAuswahl
                symbol="liste"
                name={t.melodieLied}
                wert={lied}
                optionen={[
                  { wert: "zufall", name: melodieZufallName(sprache) },
                  ...lieder.map((m) => ({ wert: m.id, name: melodieName(m, sprache) })),
                ]}
                erklaerung={a.liedHinweis}
                onWert={(w) => {
                  setLied(w);
                  if (w !== "zufall") melodieProbe(klang, w);
                }}
              />
              <AkustikSchalter
                name={a.pausenName}
                an={pausen}
                erklaerung={a.pausenHinweis}
                onWechsel={() => setPausen(!pausen)}
              />
            </>
          )}
        </AkustikKarte>
      </AkustikRahmen>
    </div>
  );
}
