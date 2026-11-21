/**
 * ★ O2-TASTATUR (30.10.2026): ZEICHEN, DIE KEINE TASTATUR DES EIGENEN WEGES TRÄGT - aber eine, die ein Kind trotzdem einstellen
 * kann (das Zahnrad bietet in „Alle" jede Tastatur). `zeichenNamen<Xx>.ts` nennt, was Weg und Korpus brauchen; alles andere fiel in
 * `spokenLabel` auf den ENGLISCHEN Namen zurück („acute accent", „diaeresis", „inverted question mark" - gemessen über alle 36
 * Tastaturen). Der eigene Eintrag in `zeichenNamen<Xx>.ts` gewinnt, dies hier kommt danach. Fremde Buchstaben bleiben, wie sie sind.
 * Halb- und Geviertstrich als Zeichencode: das Zeichen ist hier die Sache selbst, kein vorgelesener Text (Strich-Wächter).
 * ⚠️ Ohne Muttersprachler-Lesung ([G]).
 */
import type { GeruestSprache } from "./sprachRegister";

const HALB = String.fromCharCode(0x2013);
const GEVIERT = String.fromCharCode(0x2015);
const GR_FRAGE = String.fromCharCode(0x037e);

export const ZEICHEN_ERGAENZUNG: Readonly<Record<GeruestSprache, Readonly<Record<string, string>>>> = {
  bg: {
    "´": "остро ударение", "¨": "две точки", "¸": "седила", "ˇ": "карон", "΄": "тонос", "΅": "диалитика с тонос",
    "²": "на квадрат", "³": "на куб", "µ": "микро", "º": "пореден знак мъжки род", "ª": "пореден знак женски род",
    "¡": "обърнат удивителен знак", "¿": "обърнат въпросителен знак", "·": "средна точка", "±": "плюс минус", "¬": "знак за отрицание",
    [GEVIERT]: "дълга черта", "¦": "прекъсната черта", "©": "знак за авторско право", "¤": "знак за валута", "½": "една втора",
    "«": "отварящи ъглови кавички", "»": "затварящи ъглови кавички", "„": "долни кавички", "“": "горни кавички", "”": "затварящи кавички",
    "‘": "единична отваряща кавичка", "’": "единична затваряща кавичка", [HALB]: "средно тире", "№": "знак за номер", "₴": "гривна", "₺": "турска лира",
    "ß": "есцет", "ü": "у с две точки", "ö": "о с две точки", "ä": "а с две точки", [GR_FRAGE]: "гръцки въпросителен знак",
  },
  el: {
    "´": "οξεία", "¨": "διαλυτικά", "¸": "υπογεγραμμένη", "ˇ": "ανάποδο καπελάκι", "΄": "τόνος", "΅": "διαλυτικά και τόνος",
    "²": "στο τετράγωνο", "³": "στον κύβο", "µ": "μικρό", "º": "τακτικός αρσενικού", "ª": "τακτικός θηλυκού",
    "¡": "ανάποδο θαυμαστικό", "¿": "ανάποδο ερωτηματικό", "·": "άνω τελεία", "±": "συν πλην", "¬": "σύμβολο άρνησης",
    [GEVIERT]: "μακριά παύλα", "¦": "διακεκομμένη κάθετη", "©": "σύμβολο πνευματικών δικαιωμάτων", "¤": "σύμβολο νομίσματος", "½": "ένα δεύτερο",
    "«": "άνοιγμα εισαγωγικών", "»": "κλείσιμο εισαγωγικών", "„": "κάτω εισαγωγικά", "“": "πάνω εισαγωγικά", "”": "κλείσιμο πάνω εισαγωγικών",
    "‘": "μονό άνοιγμα εισαγωγικών", "’": "μονό κλείσιμο εισαγωγικών", [HALB]: "μεσαία παύλα", "№": "σύμβολο αριθμού", "₴": "γρίβνα", "₺": "τουρκική λίρα",
    "ß": "γερμανικό διπλό σ", "ü": "u με διαλυτικά", "ö": "o με διαλυτικά", "ä": "a με διαλυτικά", [GR_FRAGE]: "ερωτηματικό",
  },
  hu: {
    "´": "éles ékezet", "¨": "két pont", "¸": "cedille", "ˇ": "hacsek", "΄": "tonosz", "΅": "dialütika tonosszal",
    "²": "négyzet", "³": "köb", "µ": "mikro", "º": "hímnemű sorszámjel", "ª": "nőnemű sorszámjel",
    "¡": "fordított felkiáltójel", "¿": "fordított kérdőjel", "·": "középső pont", "±": "plusz-mínusz", "¬": "tagadásjel",
    [GEVIERT]: "hosszú vonal", "¦": "szaggatott függőleges vonal", "©": "szerzői jog jele", "¤": "pénznemjel", "½": "egy ketted",
    "«": "nyitó francia idézőjel", "»": "záró francia idézőjel", "„": "alsó idézőjel", "“": "felső idézőjel", "”": "záró idézőjel",
    "‘": "nyitó szimpla idézőjel", "’": "záró szimpla idézőjel", [HALB]: "félkvirtmínusz", "№": "számjel", "₴": "hrivnya", "₺": "török líra",
    "ß": "német scharfes s", "ü": "ü", "ö": "ö", "ä": "a két ponttal", [GR_FRAGE]: "görög kérdőjel",
  },
  nl: {
    "´": "accent aigu", "¨": "trema", "¸": "cedille", "ˇ": "haček", "΄": "tonos", "΅": "dialytika met tonos",
    "²": "kwadraat", "³": "derde macht", "µ": "micro", "º": "mannelijk rangteken", "ª": "vrouwelijk rangteken",
    "¡": "omgekeerd uitroepteken", "¿": "omgekeerd vraagteken", "·": "middenpunt", "±": "plusminus", "¬": "ontkenningsteken",
    [GEVIERT]: "lange streep", "¦": "onderbroken streep", "©": "copyrightteken", "¤": "valutateken", "½": "een half",
    "«": "openend punthaakje", "»": "sluitend punthaakje", "„": "aanhalingsteken onder", "“": "aanhalingsteken boven", "”": "sluitend aanhalingsteken",
    "‘": "enkel aanhalingsteken openen", "’": "enkel aanhalingsteken sluiten", [HALB]: "halve kastlijn", "№": "nummerteken", "₴": "hryvnia", "₺": "Turkse lira",
    "ß": "ringel-s", "ü": "u met trema", "ö": "o met trema", "ä": "a met trema", [GR_FRAGE]: "Grieks vraagteken",
  },
  pt: {
    "´": "acento agudo", "¨": "trema", "¸": "cedilha", "ˇ": "caron", "΄": "tonos", "΅": "dialitika com tonos",
    "²": "ao quadrado", "³": "ao cubo", "µ": "micro", "º": "ordinal masculino", "ª": "ordinal feminino",
    "¡": "ponto de exclamação invertido", "¿": "ponto de interrogação invertido", "·": "ponto central", "±": "mais ou menos", "¬": "sinal de negação",
    [GEVIERT]: "barra horizontal", "¦": "barra interrompida", "©": "sinal de direitos de autor", "¤": "sinal de moeda", "½": "um meio",
    "«": "aspas angulares a abrir", "»": "aspas angulares a fechar", "„": "aspas baixas", "“": "aspas altas", "”": "aspas a fechar",
    "‘": "aspa simples a abrir", "’": "aspa simples a fechar", [HALB]: "travessão meio", "№": "sinal de número", "₴": "hryvnia", "₺": "lira turca",
    "ß": "s duplo alemão", "ü": "u com trema", "ö": "o com trema", "ä": "a com trema", [GR_FRAGE]: "ponto de interrogação grego",
  },
  br: {
    "´": "acento agudo", "¨": "trema", "¸": "cedilha", "ˇ": "caron", "΄": "tonos", "΅": "dialitika com tonos",
    "²": "ao quadrado", "³": "ao cubo", "µ": "micro", "º": "ordinal masculino", "ª": "ordinal feminino",
    "¡": "ponto de exclamação invertido", "¿": "ponto de interrogação invertido", "·": "ponto central", "±": "mais ou menos", "¬": "sinal de negação",
    [GEVIERT]: "barra horizontal", "¦": "barra interrompida", "©": "sinal de direitos autorais", "¤": "sinal de moeda", "½": "um meio",
    "«": "aspas angulares de abertura", "»": "aspas angulares de fechamento", "„": "aspas baixas", "“": "aspas altas", "”": "aspas de fechamento",
    "‘": "aspa simples de abertura", "’": "aspa simples de fechamento", [HALB]: "meio travessão", "№": "sinal de número", "₴": "hryvnia", "₺": "lira turca",
    "ß": "s duplo alemão", "ü": "u com trema", "ö": "o com trema", "ä": "a com trema", [GR_FRAGE]: "ponto de interrogação grego",
  },
  ro: {
    "´": "accent ascuțit", "¨": "două puncte deasupra", "¸": "sedilă", "ˇ": "caron", "΄": "tonos", "΅": "dialitika cu tonos",
    "²": "la pătrat", "³": "la cub", "µ": "micro", "º": "ordinal masculin", "ª": "ordinal feminin",
    "¡": "semn de exclamare inversat", "¿": "semn de întrebare inversat", "·": "punct median", "±": "plus minus", "¬": "semn de negație",
    [GEVIERT]: "linie lungă", "¦": "bară întreruptă", "©": "semn de drepturi de autor", "¤": "semn monetar", "½": "o doime",
    "«": "ghilimele unghiulare deschise", "»": "ghilimele unghiulare închise", "„": "ghilimele jos", "“": "ghilimele sus", "”": "ghilimele închise",
    "‘": "ghilimea simplă deschisă", "’": "ghilimea simplă închisă", [HALB]: "linie medie", "№": "semn de număr", "₴": "grivnă", "₺": "liră turcească",
    "ß": "s dublu german", "ü": "u cu două puncte", "ö": "o cu două puncte", "ä": "a cu două puncte", [GR_FRAGE]: "semn de întrebare grecesc",
  },
  sv: {
    "´": "akut accent", "¨": "trema", "¸": "cedilj", "ˇ": "hake", "΄": "tonos", "΅": "dialytika med tonos",
    "²": "upphöjt till två", "³": "upphöjt till tre", "µ": "mikro", "º": "maskulint ordningstecken", "ª": "feminint ordningstecken",
    "¡": "omvänt utropstecken", "¿": "omvänt frågetecken", "·": "mittpunkt", "±": "plus minus", "¬": "negationstecken",
    [GEVIERT]: "långt streck", "¦": "brutet lodstreck", "©": "copyrighttecken", "¤": "valutatecken", "½": "en halv",
    "«": "gåsögon öppnar", "»": "gåsögon stänger", "„": "citattecken nere", "“": "citattecken uppe", "”": "citattecken stänger",
    "‘": "enkelt citattecken öppnar", "’": "enkelt citattecken stänger", [HALB]: "kort tankstreck", "№": "nummertecken", "₴": "hryvnia", "₺": "turkisk lira",
    "ß": "tyskt dubbel-s", "ü": "u med trema", "ö": "ö", "ä": "ä", [GR_FRAGE]: "grekiskt frågetecken",
  },
  uk: {
    "´": "акут", "¨": "дві крапки", "¸": "седиль", "ˇ": "гачек", "΄": "тонос", "΅": "діалітика з тоносом",
    "²": "у квадраті", "³": "у кубі", "µ": "мікро", "º": "порядковий знак чоловічого роду", "ª": "порядковий знак жіночого роду",
    "¡": "перевернутий знак оклику", "¿": "перевернутий знак питання", "·": "середня крапка", "±": "плюс мінус", "¬": "знак заперечення",
    [GEVIERT]: "довга риска", "¦": "переривчаста риска", "©": "знак авторського права", "¤": "знак валюти", "½": "одна друга",
    "«": "відкривні лапки", "»": "закривні лапки", "„": "нижні лапки", "“": "верхні лапки", "”": "закривні лапки вгорі",
    "‘": "одинарна відкривна лапка", "’": "одинарна закривна лапка", [HALB]: "середня риска", "№": "знак номера", "₴": "гривня", "₺": "турецька ліра",
    "ß": "есцет", "ü": "u з двома крапками", "ö": "o з двома крапками", "ä": "a з двома крапками", [GR_FRAGE]: "грецький знак питання",
    "§": "параграф", "°": "градус", "£": "фунт",
  },
};
