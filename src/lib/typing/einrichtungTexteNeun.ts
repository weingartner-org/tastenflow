/**
 * ★ NVDA-Lauf 31.10.2026: die Einrichtung der neun neuen Sprachen. `einrichtungTexte()` kannte sie
 * nicht und fiel still auf Deutsch zurück - alle Überschriften, „Weiter", „Einrichtung überspringen"
 * und der Satz zum Geburtsjahr; NVDA las das Deutsche zudem mit fremder Sprache. Die übrigen Texte der
 * Einrichtung (`T` in `Einrichtung.tsx`) waren schon übersetzt.
 *
 * Wörter nach den Glossaren (`recherche-*-2026-10-25/GLOSSAR-*.md`): Einrichtung, Überspringen,
 * Geburtsjahr, Runde, Einstellungen. Der Name „Einstellungen" steht ohne Anführungszeichen (wie cs).
 * Kein Satz verrät ein Geschlecht („Damos-te as boas-vindas", „Boas-vindas", „Вітаємо").
 */
import type { BedienSprache } from "../bedienSprache/sprache";
import type { EinrichtungStepId, EinrichtungTexte } from "./einrichtung";

/** Der Weiter-Knopf: Anfang, alle mittleren Schritte, Ende. */
function weiterKnopf(anfang: string, weiter: string, ende: string): Record<EinrichtungStepId, string> {
  return {
    willkommen: anfang,
    alter: weiter,
    sprache: weiter,
    tastatur: weiter,
    start: weiter,
    ton: weiter,
    podcast: weiter,
    fertig: ende,
  };
}

export const EINRICHTUNG_TEXTE_NEUN: Partial<Record<BedienSprache, EinrichtungTexte>> = {
  bg: {
    titel: {
      willkommen: "Добре дошли в Tastenflow",
      alter: "За кого са текстовете?",
      sprache: "На какъв език искаш да се упражняваш?",
      tastatur: "Каква клавиатура имаш пред себе си?",
      start: "Откъде искаш да започнеш?",
      ton: "Звук и четене на глас",
      podcast: "Накратко: подкаст за начало",
      fertig: "Готово: всичко е настроено",
    },
    weiter: weiterKnopf("Да започваме", "Напред", "Към първия кръг"),
    skipLabel: "Пропусни първоначалната настройка",
    skipAnsage: "Първоначалната настройка е пропусната. Можеш да я стартираш отново по всяко време с Alt + R.",
    fussnote: "Всичко може да се промени по-късно по всяко време - в Настройки.",
    geburtsjahrLabel: "Година на раждане",
    geburtsjahrErklaerung:
      "Текстовете се нагаждат към възрастта ти и растат заедно с теб. Без годината ти на раждане " +
      "програмата не може да го прави: не знае на колко години си и текстовете остават завинаги " +
      "такива, каквито бяха в първия ден.",
  },
  el: {
    titel: {
      willkommen: "Καλώς ήρθες στο Tastenflow",
      alter: "Για ποια ηλικία είναι τα κείμενα;",
      sprache: "Σε ποια γλώσσα θέλεις να εξασκηθείς;",
      tastatur: "Ποιο πληκτρολόγιο έχεις μπροστά σου;",
      start: "Από πού θέλεις να ξεκινήσεις;",
      ton: "Ήχος και εκφώνηση",
      podcast: "Με λίγα λόγια: το podcast για την αρχή",
      fertig: "Τέλος: όλα είναι έτοιμα",
    },
    // Knöpfe als Hauptwort (Glossar Regel 1).
    weiter: weiterKnopf("Έναρξη", "Επόμενο", "Στον πρώτο γύρο"),
    skipLabel: "Παράλειψη αρχικών ρυθμίσεων",
    skipAnsage: "Οι αρχικές ρυθμίσεις παραλείφθηκαν. Μπορείς να τις ξεκινήσεις ξανά όποτε θέλεις με Alt + R.",
    fussnote: "Μπορείς να αλλάξεις τα πάντα αργότερα, όποτε θέλεις - στις Ρυθμίσεις.",
    geburtsjahrLabel: "Έτος γέννησης",
    geburtsjahrErklaerung:
      "Τα κείμενα προσαρμόζονται στην ηλικία σου και μεγαλώνουν μαζί σου. Χωρίς το έτος γέννησής σου " +
      "το πρόγραμμα δεν μπορεί να το κάνει αυτό: δεν ξέρει πόσο χρονών είσαι, και τα κείμενα μένουν " +
      "για πάντα όπως την πρώτη μέρα.",
  },
  hu: {
    titel: {
      willkommen: "Üdvözlünk a Tastenflow programban",
      alter: "Kinek szólnak a szövegek?",
      sprache: "Milyen nyelven szeretnél gyakorolni?",
      tastatur: "Milyen billentyűzet van előtted?",
      start: "Honnan szeretnéd kezdeni?",
      ton: "Hang és felolvasás",
      podcast: "Röviden: podcast kezdésként",
      fertig: "Kész: minden be van állítva",
    },
    // Knöpfe als Hauptwort auf -ás (Glossar).
    weiter: weiterKnopf("Kezdés", "Tovább", "Irány az első kör"),
    skipLabel: "Az első beállítás kihagyása",
    skipAnsage: "Az első beállítás kimaradt. Bármikor újraindíthatod ezzel: Alt + R.",
    fussnote: "Később bármikor mindent megváltoztathatsz - a Beállítások között.",
    geburtsjahrLabel: "Születési év",
    geburtsjahrErklaerung:
      "A szövegek igazodnak az életkorodhoz, és veled együtt nőnek. Születési év nélkül a program erre " +
      "nem képes: nem tudja, hány éves vagy, és a szövegek örökre olyanok maradnak, mint az első napon.",
  },
  nl: {
    titel: {
      willkommen: "Welkom bij Tastenflow",
      alter: "Voor wie zijn de teksten?",
      sprache: "In welke taal wil je oefenen?",
      tastatur: "Welk toetsenbord heb je voor je?",
      start: "Waar wil je beginnen?",
      ton: "Geluid en voorlezen",
      podcast: "Kort uitgelegd: je introductiepodcast",
      fertig: "Klaar: alles is ingesteld",
    },
    weiter: weiterKnopf("Beginnen", "Verder", "Naar de eerste ronde"),
    skipLabel: "Eerste stappen overslaan",
    skipAnsage: "Eerste stappen overgeslagen. Je kunt ze altijd opnieuw starten met Alt + R.",
    fussnote: "Je kunt later altijd alles wijzigen - bij Instellingen.",
    geburtsjahrLabel: "Geboortejaar",
    geburtsjahrErklaerung:
      "De teksten passen zich aan je leeftijd aan en groeien met je mee. Zonder je geboortejaar kan de " +
      "app dat niet: die weet dan niet hoe oud je bent, en de teksten blijven voor altijd zoals ze op " +
      "de eerste dag waren.",
  },
  pt: {
    titel: {
      willkommen: "Damos-te as boas-vindas ao Tastenflow",
      alter: "Para quem são os textos?",
      sprache: "Em que língua queres praticar?",
      tastatur: "Que teclado tens à tua frente?",
      start: "Por onde queres começar?",
      ton: "Som e leitura em voz alta",
      podcast: "Em resumo: o podcast de introdução",
      fertig: "Concluído: está tudo definido",
    },
    weiter: weiterKnopf("Começar", "Seguinte", "Ir para a primeira ronda"),
    skipLabel: "Saltar a configuração inicial",
    skipAnsage: "Configuração inicial saltada. Podes recomeçá-la quando quiseres com Alt + R.",
    fussnote: "Podes alterar tudo mais tarde, a qualquer momento - nas Definições.",
    geburtsjahrLabel: "Ano de nascimento",
    geburtsjahrErklaerung:
      "Os textos adaptam-se à tua idade e crescem contigo. Sem o teu ano de nascimento, o programa não " +
      "consegue fazê-lo: não sabe quantos anos tens e os textos ficam para sempre como no primeiro dia.",
  },
  br: {
    titel: {
      willkommen: "Boas-vindas ao Tastenflow",
      alter: "Para quem são os textos?",
      sprache: "Em que idioma você quer praticar?",
      tastatur: "Qual teclado está na sua frente?",
      start: "Por onde você quer começar?",
      ton: "Som e leitura em voz alta",
      podcast: "Em resumo: o podcast de introdução",
      fertig: "Pronto: tudo configurado",
    },
    weiter: weiterKnopf("Começar", "Avançar", "Ir para a primeira rodada"),
    skipLabel: "Pular a configuração inicial",
    skipAnsage: "Configuração inicial pulada. Você pode recomeçar quando quiser com Alt + R.",
    fussnote: "Você pode mudar tudo depois, a qualquer momento - em Configurações.",
    geburtsjahrLabel: "Ano de nascimento",
    geburtsjahrErklaerung:
      "Os textos se adaptam à sua idade e crescem com você. Sem o seu ano de nascimento, o programa não " +
      "consegue fazer isso: ele não sabe quantos anos você tem, e os textos ficam para sempre como no " +
      "primeiro dia.",
  },
  ro: {
    titel: {
      willkommen: "Bun venit în Tastenflow",
      alter: "Pentru cine sunt textele?",
      sprache: "În ce limbă vrei să exersezi?",
      tastatur: "Ce tastatură ai în față?",
      start: "De unde vrei să începi?",
      ton: "Sunet și citire cu voce tare",
      podcast: "Pe scurt: podcastul de început",
      fertig: "Gata: totul este setat",
    },
    // Knöpfe im Imperativ Mehrzahl, Sätze mit „tu" (Glossar Regel 1).
    weiter: weiterKnopf("Începeți", "Continuați", "Spre prima rundă"),
    skipLabel: "Omiteți configurarea",
    skipAnsage: "Configurarea a fost omisă. O poți relua oricând cu Alt + R.",
    fussnote: "Poți schimba totul mai târziu, oricând - în Setări.",
    geburtsjahrLabel: "Anul nașterii",
    geburtsjahrErklaerung:
      "Textele se potrivesc vârstei tale și cresc odată cu tine. Fără anul nașterii, aplicația nu poate " +
      "face asta: nu știe câți ani ai, iar textele rămân pentru totdeauna ca în prima zi.",
  },
  sv: {
    titel: {
      willkommen: "Välkommen till Tastenflow",
      alter: "Vem är texterna för?",
      sprache: "Vilket språk vill du öva på?",
      tastatur: "Vilket tangentbord har du framför dig?",
      start: "Var vill du börja?",
      ton: "Ljud och uppläsning",
      podcast: "Kort sagt: din introduktionspodcast",
      fertig: "Klart: allt är inställt",
    },
    weiter: weiterKnopf("Sätt igång", "Nästa", "Till första omgången"),
    skipLabel: "Hoppa över kom igång",
    skipAnsage: "Kom igång hoppades över. Du kan starta det igen när som helst med Alt + R.",
    fussnote: "Du kan ändra allt senare, när som helst - under Inställningar.",
    geburtsjahrLabel: "Födelseår",
    geburtsjahrErklaerung:
      "Texterna anpassas efter din ålder och växer med dig. Utan ditt födelseår kan programmet inte göra " +
      "det: det vet inte hur gammal du är, och texterna förblir för alltid som de var första dagen.",
  },
  uk: {
    titel: {
      willkommen: "Вітаємо в Tastenflow",
      alter: "Для кого ці тексти?",
      sprache: "Якою мовою хочеш тренуватися?",
      tastatur: "Яка клавіатура перед тобою?",
      start: "З чого хочеш почати?",
      ton: "Звук і читання вголос",
      podcast: "Коротко: подкаст для початку",
      fertig: "Готово: усе налаштовано",
    },
    weiter: weiterKnopf("Почати", "Далі", "До першого раунду"),
    skipLabel: "Пропустити початкове налаштування",
    skipAnsage: "Початкове налаштування пропущено. Можеш запустити його знову будь-коли клавішами Alt + R.",
    fussnote: "Усе можна змінити пізніше будь-коли - у Налаштуваннях.",
    geburtsjahrLabel: "Рік народження",
    geburtsjahrErklaerung:
      "Тексти підлаштовуються під твій вік і ростуть разом із тобою. Без року народження програма цього " +
      "не вміє: не знає, скільки тобі років, і тексти назавжди залишаються такими, як у перший день.",
  },
};
