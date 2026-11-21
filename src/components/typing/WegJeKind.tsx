/**
 * ★★★ DER LERNWEG JE KIND - DAS FELD FÜR DIE LEHRKRAFT (W2b, 28.09.2026).
 *
 * Johannes (27.09.2026): gemischte Klassen - „2 verschiedene Erstsprachen in
 * einer Klasse". Der Weg gehört schon seit E1 dem KIND (`tt_pupils.lernweg`),
 * die Klasse gibt nur die Vorgabe für neue Kinder. Hier stellt ihn die
 * Lehrkraft je Kind ein - in „Meine Klassen" › Tastenflow › „Einstellungen
 * für …", neben „Womit anfangen?".
 *
 *  · Angeboten: Deutsch, Englisch, Französisch; Spanisch nur mit dem Schalter
 *    des spanischen Lehrgangs (`?spanisch-lehrgang=1`), solange `/es` nicht
 *    öffentlich ist - dieselbe Prüfung wie überall (`spanischLehrgangProbeAn`).
 *    Steht ein Kind schon auf Spanisch, bleibt die Wahl sichtbar.
 *  · Jede Änderung mit Rückfrage (`TastaturRueckfrage`): auf Französisch und
 *    Spanisch Johannes' Tastatur-Frage, immer der Satz, was mit dem bisherigen
 *    Stand geschieht (er bleibt gespeichert, `wegWechsel.ts`).
 *  · „Nein" lässt das Feld auf dem alten Weg stehen; der Fokus geht zurück
 *    auf das Auswahlfeld (das `Modal` gibt ihn dem Auslöser zurück).
 *  · Am Server darf das nur die Lehrkraft dieser Klasse
 *    (`tt_pupils_field_guard.pb.js`).
 */
import { useState } from "react";
import { Tipp } from "@/components/Tipp";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { GERUEST_LEHRGAENGE, istLernweg, neueLehrgangProben, spanischLehrgangProbeAn, type GeruestLehrgang, type Lernweg } from "@/lib/typing/lernweg";
import { tastaturenDesWeges } from "@/lib/typing/wegTastaturen";
import type { TypingAccount } from "@/lib/typing/account";
import { TastaturRueckfrage } from "./TastaturRueckfrage";

/** Die Namen der Wege, wie sie im Auswahlfeld stehen - je Sprache der Bedienung. */
const WEG_NAMEN_EN: Record<Lernweg, string> = {
  de: "German",
  en: "English",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  pl: "Polish",
  tr: "Turkish",
  cs: "Czech",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "Bulgarian",
  el: "Greek",
  hu: "Hungarian",
  nl: "Dutch",
  pt: "Portuguese (Portugal)",
  br: "Portuguese (Brazil)",
  ro: "Romanian",
  sv: "Swedish",
  uk: "Ukrainian",
};
const WEG_NAMEN: Readonly<Record<BedienSprache, Record<Lernweg, string>>> = {
  de: { de: "Deutsch", en: "Englisch", fr: "Französisch", es: "Spanisch", it: "Italienisch", pl: "Polnisch", tr: "Türkisch", cs: "Tschechisch", bg: "Bulgarisch", el: "Griechisch", hu: "Ungarisch", nl: "Niederländisch", pt: "Portugiesisch (Portugal)", br: "Portugiesisch (Brasilien)", ro: "Rumänisch", sv: "Schwedisch", uk: "Ukrainisch" },
  en: WEG_NAMEN_EN,
  fr: { de: "allemand", en: "anglais", fr: "français", es: "espagnol", it: "italien", pl: "polonais", tr: "turc", cs: "tchèque", bg: "bulgare", el: "grec", hu: "hongrois", nl: "néerlandais", pt: "portugais (Portugal)", br: "portugais (Brésil)", ro: "roumain", sv: "suédois", uk: "ukrainien" },
  es: { de: "alemán", en: "inglés", fr: "francés", es: "español", it: "italiano", pl: "polaco", tr: "turco", cs: "checo", bg: "búlgaro", el: "griego", hu: "húngaro", nl: "neerlandés", pt: "portugués (Portugal)", br: "portugués (Brasil)", ro: "rumano", sv: "sueco", uk: "ucraniano" },
  // ★ O-IT (02.10.2026): klein, im Satz („il percorso di tedesco").
  it: { de: "tedesco", en: "inglese", fr: "francese", es: "spagnolo", it: "italiano", pl: "polacco", tr: "turco", cs: "ceco", bg: "bulgaro", el: "greco", hu: "ungherese", nl: "olandese", pt: "portoghese (Portogallo)", br: "portoghese (Brasile)", ro: "rumeno", sv: "svedese", uk: "ucraino" },
  // ★ O-PL (02.10.2026): klein wie „język polski" (Glossar Regel 10), im Satz
  // nur in „…” (Nominativ, Regel 11): „kurs „polski”".
  pl: { de: "niemiecki", en: "angielski", fr: "francuski", es: "hiszpański", it: "włoski", pl: "polski", tr: "turecki", cs: "czeski", bg: "bułgarski", el: "grecki", hu: "węgierski", nl: "niderlandzki", pt: "portugalski (Portugalia)", br: "portugalski (Brazylia)", ro: "rumuński", sv: "szwedzki", uk: "ukraiński" },
  // ★ O-TR (02.10.2026): Sprachnamen gross wie im Türkischen ("Türkçe"); im Satz
  // nur in geraden Anführungszeichen vor "kursu", ohne Endung (Glossar Regel 6).
  tr: { de: "Almanca", en: "İngilizce", fr: "Fransızca", es: "İspanyolca", it: "İtalyanca", pl: "Lehçe", tr: "Türkçe", cs: "Çekçe", bg: "Bulgarca", el: "Yunanca", hu: "Macarca", nl: "Felemenkçe", pt: "Portekizce (Portekiz)", br: "Portekizce (Brezilya)", ro: "Rumence", sv: "İsveççe", uk: "Ukraynaca" },
  // ★ O-CS (03.10.2026): Hauptwort klein wie im Tschechischen („čeština", Glossar
  // Regel 9); im Satz nur in Klammern nach „kurz" (Nominativ, Regel 12): „kurz (čeština)".
  cs: { de: "němčina", en: "angličtina", fr: "francouzština", es: "španělština", it: "italština", pl: "polština", tr: "turečtina", cs: "čeština", bg: "bulharština", el: "řečtina", hu: "maďarština", nl: "nizozemština", pt: "portugalština (Portugalsko)", br: "portugalština (Brazílie)", ro: "rumunština", sv: "švédština", uk: "ukrajinština" },
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: { de: "немски", en: "английски", fr: "френски", es: "испански", it: "италиански", pl: "полски", tr: "турски", cs: "чешки", bg: "български", el: "гръцки", hu: "унгарски", nl: "нидерландски", pt: "португалски (Португалия)", br: "португалски (Бразилия)", ro: "румънски", sv: "шведски", uk: "украински" },
  el: { de: "Γερμανικά", en: "Αγγλικά", fr: "Γαλλικά", es: "Ισπανικά", it: "Ιταλικά", pl: "Πολωνικά", tr: "Τουρκικά", cs: "Τσεχικά", bg: "Βουλγαρικά", el: "Ελληνικά", hu: "Ουγγρικά", nl: "Ολλανδικά", pt: "Πορτογαλικά (Πορτογαλία)", br: "Πορτογαλικά (Βραζιλία)", ro: "Ρουμανικά", sv: "Σουηδικά", uk: "Ουκρανικά" },
  hu: { de: "német", en: "angol", fr: "francia", es: "spanyol", it: "olasz", pl: "lengyel", tr: "török", cs: "cseh", bg: "bolgár", el: "görög", hu: "magyar", nl: "holland", pt: "portugál (Portugália)", br: "portugál (Brazília)", ro: "román", sv: "svéd", uk: "ukrán" },
  nl: { de: "Duits", en: "Engels", fr: "Frans", es: "Spaans", it: "Italiaans", pl: "Pools", tr: "Turks", cs: "Tsjechisch", bg: "Bulgaars", el: "Grieks", hu: "Hongaars", nl: "Nederlands", pt: "Portugees (Portugal)", br: "Portugees (Brazilië)", ro: "Roemeens", sv: "Zweeds", uk: "Oekraïens" },
  pt: { de: "alemão", en: "inglês", fr: "francês", es: "espanhol", it: "italiano", pl: "polaco", tr: "turco", cs: "checo", bg: "búlgaro", el: "grego", hu: "húngaro", nl: "neerlandês", pt: "português europeu", br: "português do Brasil", ro: "romeno", sv: "sueco", uk: "ucraniano" },
  br: { de: "alemão", en: "inglês", fr: "francês", es: "espanhol", it: "italiano", pl: "polonês", tr: "turco", cs: "tcheco", bg: "búlgaro", el: "grego", hu: "húngaro", nl: "holandês", pt: "português (Portugal)", br: "português (Brasil)", ro: "romeno", sv: "sueco", uk: "ucraniano" },
  ro: { de: "germană", en: "engleză", fr: "franceză", es: "spaniolă", it: "italiană", pl: "poloneză", tr: "turcă", cs: "cehă", bg: "bulgară", el: "greacă", hu: "maghiară", nl: "neerlandeză", pt: "portugheză (Portugalia)", br: "portugheză (Brazilia)", ro: "română", sv: "suedeză", uk: "ucraineană" },
  sv: { de: "tyska", en: "engelska", fr: "franska", es: "spanska", it: "italienska", pl: "polska", tr: "turkiska", cs: "tjeckiska", bg: "bulgariska", el: "grekiska", hu: "ungerska", nl: "nederländska", pt: "portugisiska (Portugal)", br: "portugisiska (Brasilien)", ro: "rumänska", sv: "svenska", uk: "ukrainska" },
  uk: { de: "німецька", en: "англійська", fr: "французька", es: "іспанська", it: "італійська", pl: "польська", tr: "турецька", cs: "чеська", bg: "болгарська", el: "грецька", hu: "угорська", nl: "нідерландська", pt: "португальська (Португалія)", br: "португальська (Бразилія)", ro: "румунська", sv: "шведська", uk: "українська" },
};

/** Die Tastatur, nach der gefragt wird - nur für Wege mit Landestastaturen (fr, es, it, pl, tr, cs). */
const TASTATUR_FRAGE: Readonly<Record<BedienSprache, Record<"fr" | "es" | "it" | "pl" | "tr" | "cs", string>>> = {
  de: {
    fr: "eine französische Tastatur (Frankreich, Belgien, Schweiz oder Kanada)",
    es: "eine spanische Tastatur (Spanien oder Lateinamerika)",
    it: "eine italienische Tastatur (Italien, Schweiz oder San Marino)",
    // ★ F5-F8-tr (03.10.2026): nur die Q-Tastatur gehört zum Weg (`tr-f` bekommt später einen eigenen).
    tr: "eine türkische Q-Tastatur (Türkei oder Zypern)",
    pl: "eine polnische Tastatur (Polen)",
    cs: "eine tschechische Tastatur (QWERTZ oder QWERTY)",
  },
  en: {
    fr: "a French keyboard (France, Belgium, Switzerland or Canada)",
    es: "a Spanish keyboard (Spain or Latin America)",
    it: "an Italian keyboard (Italy, Switzerland or San Marino)",
    tr: "a Turkish Q keyboard (Turkey or Cyprus)",
    pl: "a Polish keyboard (Poland)",
    cs: "a Czech keyboard (QWERTZ or QWERTY)",
  },
  fr: {
    fr: "un clavier français (France, Belgique, Suisse ou Canada)",
    es: "un clavier espagnol (Espagne ou Amérique latine)",
    it: "un clavier italien (Italie, Suisse ou Saint-Marin)",
    tr: "un clavier turc Q (Turquie ou Chypre)",
    pl: "un clavier polonais (Pologne)",
    cs: "un clavier tchèque (QWERTZ ou QWERTY)",
  },
  es: {
    fr: "un teclado francés (Francia, Bélgica, Suiza o Canadá)",
    es: "un teclado español (España o Latinoamérica)",
    it: "un teclado italiano (Italia, Suiza o San Marino)",
    tr: "un teclado turco Q (Turquía o Chipre)",
    pl: "un teclado polaco (Polonia)",
    cs: "un teclado checo (QWERTZ o QWERTY)",
  },
  it: {
    fr: "una tastiera francese (Francia, Belgio, Svizzera o Canada)",
    es: "una tastiera spagnola (Spagna o America Latina)",
    // ★ F5-F8-it (02.10.2026): „it" hat seit der Hauptsprache Landestastaturen - sonst stünde in der Rückfrage „undefined".
    it: "una tastiera italiana (Italia, Svizzera o San Marino)",
    tr: "una tastiera turca Q (Turchia o Cipro)",
    pl: "una tastiera polacca (Polonia)",
    cs: "una tastiera ceca (QWERTZ o QWERTY)",
  },
  // ★ O-PL (02.10.2026): Genitiv - „Czy Ania używa francuskiej klawiatury …?".
  pl: {
    fr: "francuskiej klawiatury (Francja, Belgia, Szwajcaria lub Kanada)",
    es: "hiszpańskiej klawiatury (Hiszpania lub Ameryka Łacińska)",
    it: "włoskiej klawiatury (Włochy, Szwajcaria lub San Marino)",
    tr: "tureckiej klawiatury Q (Turcja lub Cypr)",
    // ★ F5-F8-pl: der eigene Weg - Genitiv wie die anderen Einträge; die Namen der Belegungen („Polski (programisty)", „Polski Pro")
    // stehen in der Tastaturwahl selbst (Falle 62: keine Namen aus dem Gedächtnis in fremde Sprachen schreiben).
    pl: "polskiej klawiatury (Polska, układ programisty)",
    cs: "czeskiej klawiatury (QWERTZ lub QWERTY)",
  },
  // ★ O-TR (02.10.2026): Objekt vor "kullanıyor mu?" - "... Fransız klavyesi (...) kullanıyor mu?".
  tr: {
    fr: "Fransız klavyesi (Fransa, Belçika, İsviçre ya da Kanada)",
    es: "İspanyol klavyesi (İspanya ya da Latin Amerika)",
    it: "İtalyan klavyesi (İtalya, İsviçre ya da San Marino)",
    tr: "Türkçe Q klavyesi (Türkiye ya da Kıbrıs)",
    pl: "Polonya klavyesi (Polonya)",
    cs: "Çek klavyesi (QWERTZ ya da QWERTY)",
  },
  // ★ O-CS (03.10.2026): Akkusativ - „Používá Honza francouzskou klávesnici (...)?".
  cs: {
    fr: "francouzskou klávesnici (Francie, Belgie, Švýcarsko nebo Kanada)",
    es: "španělskou klávesnici (Španělsko nebo Latinská Amerika)",
    it: "italskou klávesnici (Itálie, Švýcarsko nebo San Marino)",
    // ★ F5-F8-tr (Merge): der Eintrag für den türkischen Weg fehlte hier (cs entstand vor `tr` in der Tabelle); Akkusativ wie die anderen.
    tr: "tureckou klávesnici Q (Turecko nebo Kypr)",
    pl: "polskou klávesnici (Polsko)",
    cs: "českou klávesnici (QWERTZ nebo QWERTY)",
  },
  // ★ O2-COMP (30.10.2026): bg eigene Fassung.
  bg: {
      fr: "френска клавиатура (Франция, Белгия, Швейцария или Канада)",
      es: "испанска клавиатура (Испания или Латинска Америка)",
      it: "италианска клавиатура (Италия, Швейцария или Сан Марино)",
      tr: "турска клавиатура Q (Турция или Кипър)",
      pl: "полска клавиатура (Полша)",
      cs: "чешка клавиатура (QWERTZ или QWERTY)",
    },
  // ★ O2-COMP (30.10.2026): el eigene Fassung.
  el: {
      fr: "γαλλικό πληκτρολόγιο (Γαλλία, Βέλγιο, Ελβετία ή Καναδάς)",
      es: "ισπανικό πληκτρολόγιο (Ισπανία ή Λατινική Αμερική)",
      it: "ιταλικό πληκτρολόγιο (Ιταλία, Ελβετία ή Άγιος Μαρίνος)",
      tr: "τουρκικό πληκτρολόγιο Q (Τουρκία ή Κύπρος)",
      pl: "πολωνικό πληκτρολόγιο (Πολωνία)",
      cs: "τσεχικό πληκτρολόγιο (QWERTZ ή QWERTY)",
    },
  // ★ O2-COMP (30.10.2026): hu eigene Fassung.
  hu: {
      // Ohne Artikel: steht in „Ezt használja ${name}: ${tastatur}?" nach dem Doppelpunkt.
      fr: "francia billentyűzet (Franciaország, Belgium, Svájc vagy Kanada)",
      es: "spanyol billentyűzet (Spanyolország vagy Latin-Amerika)",
      it: "olasz billentyűzet (Olaszország, Svájc vagy San Marino)",
      tr: "török Q billentyűzet (Törökország vagy Ciprus)",
      pl: "lengyel billentyűzet (Lengyelország)",
      cs: "cseh billentyűzet (QWERTZ vagy QWERTY)",
    },
  // ★ O2-COMP (30.10.2026): nl eigene Fassung.
  nl: {
      fr: "een Frans toetsenbord (Frankrijk, België, Zwitserland of Canada)",
      es: "een Spaans toetsenbord (Spanje of Latijns-Amerika)",
      it: "een Italiaans toetsenbord (Italië, Zwitserland of San Marino)",
      tr: "een Turks Q-toetsenbord (Turkije of Cyprus)",
      pl: "een Pools toetsenbord (Polen)",
      cs: "een Tsjechisch toetsenbord (QWERTZ of QWERTY)",
    },
  // ★ O2-COMP (30.10.2026): pt eigene Fassung.
  pt: {
      fr: "um teclado francês (França, Bélgica, Suíça ou Canadá)",
      es: "um teclado espanhol (Espanha ou América Latina)",
      it: "um teclado italiano (Itália, Suíça ou São Marinho)",
      tr: "um teclado turco Q (Turquia ou Chipre)",
      pl: "um teclado polaco (Polónia)",
      cs: "um teclado checo (QWERTZ ou QWERTY)",
    },
  // ★ O2-COMP (30.10.2026): br eigene Fassung.
  br: {
      fr: "um teclado francês (França, Bélgica, Suíça ou Canadá)",
      es: "um teclado espanhol (Espanha ou América Latina)",
      it: "um teclado italiano (Itália, Suíça ou San Marino)",
      tr: "um teclado turco Q (Turquia ou Chipre)",
      pl: "um teclado polonês (Polônia)",
      cs: "um teclado tcheco (QWERTZ ou QWERTY)",
    },
  // ★ O2-COMP (30.10.2026): ro eigene Fassung.
  ro: {
      fr: "o tastatură franceză (Franța, Belgia, Elveția sau Canada)",
      es: "o tastatură spaniolă (Spania sau America Latină)",
      it: "o tastatură italiană (Italia, Elveția sau San Marino)",
      tr: "o tastatură turcă Q (Turcia sau Cipru)",
      pl: "o tastatură poloneză (Polonia)",
      cs: "o tastatură cehă (QWERTZ sau QWERTY)",
    },
  // ★ O2-COMP (30.10.2026): sv eigene Fassung.
  sv: {
      fr: "ett franskt tangentbord (Frankrike, Belgien, Schweiz eller Kanada)",
      es: "ett spanskt tangentbord (Spanien eller Latinamerika)",
      it: "ett italienskt tangentbord (Italien, Schweiz eller San Marino)",
      tr: "ett turkiskt Q-tangentbord (Turkiet eller Cypern)",
      pl: "ett polskt tangentbord (Polen)",
      cs: "ett tjeckiskt tangentbord (QWERTZ eller QWERTY)",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      // Akkusativ wie cs: steht nur in frageTastatur („${name} використовує ${tastatur}?").
      fr: "французьку клавіатуру (Франція, Бельгія, Швейцарія або Канада)",
      es: "іспанську клавіатуру (Іспанія або Латинська Америка)",
      it: "італійську клавіатуру (Італія, Швейцарія або Сан-Марино)",
      tr: "турецьку клавіатуру Q (Туреччина або Кіпр)",
      pl: "польську клавіатуру (Польща)",
      cs: "чеську клавіатуру (QWERTZ або QWERTY)",
    },
};

export const WEG_TEXTE = texte({
  de: {
    feld: "Lehrgang (Sprache)",
    feldName: (name: string) => `Lehrgang von ${name}`,
    nochOffen: "noch offen - beim ersten Üben",
    tipp:
      "In welcher Sprache dieses Kind Tastschreiben lernt: Reihenfolge der Tasten, Texte und Tastatur. Für ein Kind mit einer anderen Erstsprache als die Klasse. Eine Änderung fragt vorher nach; der bisherige Stand bleibt gespeichert.",
    titel: (name: string) => `Lehrgang von ${name} umstellen`,
    achtung: (sprache: string) => `Achtung: ${sprache} ist nur mit der passenden Tastatur möglich.`,
    ohneLandestastatur: (name: string, sprache: string) =>
      `${name} lernt die Tasten dann in der Reihenfolge des Lehrgangs ${sprache}, mit Texten auf ${sprache}.`,
    stand: (name: string, alt: string) =>
      `Der bisherige Stand bleibt gespeichert: Stellen Sie später wieder auf ${alt}, geht es für ${name} genau dort weiter. Im neuen Lehrgang beginnt ${name} am Anfang - oder dort, wo der Stand in ihm zuletzt war. Übezeit, Wochenziel und Abzeichen laufen weiter.`,
    wirksam: (name: string) => `Wirksam, sobald ${name} Tastenflow das nächste Mal öffnet.`,
    frageTastatur: (name: string, tastatur: string) => `Verwendet ${name} ${tastatur}?`,
    frageUmstellen: "Jetzt umstellen?",
    ja: "Ja",
    nein: "Nein",
    gesetzt: (name: string, sprache: string) =>
      `${name} lernt jetzt im Lehrgang ${sprache} - wirksam beim nächsten Öffnen von Tastenflow.`,
    nichtGesetzt: (name: string) =>
      `Der Lehrgang von ${name} wurde nicht umgestellt - der Server hat es abgelehnt oder war nicht erreichbar.`,
  },
  en: {
    feld: "Course (language)",
    feldName: (name: string) => `Course for ${name}`,
    nochOffen: "not set yet - at first practice",
    tipp:
      "The language in which this pupil learns touch typing: order of the keys, texts and keyboard. For a pupil whose first language differs from the class. Changing it asks first; the progress so far is kept.",
    titel: (name: string) => `Change the course for ${name}`,
    achtung: (sprache: string) => `Please note: ${sprache} only works with the matching keyboard.`,
    ohneLandestastatur: (name: string, sprache: string) =>
      `${name} will then learn the keys in the order of the ${sprache} course, with ${sprache} texts.`,
    stand: (name: string, alt: string) =>
      `The progress so far is kept: if you switch back to ${alt} later, ${name} carries on exactly where they left off. In the new course ${name} starts at the beginning - or where they last were in it. Practice time, weekly goal and badges carry on.`,
    wirksam: (name: string) => `This takes effect the next time ${name} opens Tastenflow.`,
    frageTastatur: (name: string, tastatur: string) => `Does ${name} use ${tastatur}?`,
    frageUmstellen: "Change it now?",
    ja: "Yes",
    nein: "No",
    gesetzt: (name: string, sprache: string) =>
      `${name} now learns in the ${sprache} course - from the next time they open Tastenflow.`,
    nichtGesetzt: (name: string) =>
      `The course for ${name} was not changed - the server refused it or could not be reached.`,
  },
  fr: {
    feld: "Parcours (langue)",
    feldName: (name: string) => `Parcours de ${name}`,
    nochOffen: "pas encore fixé - au premier exercice",
    tipp:
      "La langue dans laquelle cet élève apprend la frappe : ordre des touches, textes et clavier. Pour un élève dont la langue première n'est pas celle de la classe. Tout changement demande d'abord une confirmation ; la progression acquise est conservée.",
    titel: (name: string) => `Changer le parcours de ${name}`,
    achtung: (sprache: string) =>
      `Attention : le parcours ${sprache} n'est possible qu'avec le clavier adapté.`,
    ohneLandestastatur: (name: string, sprache: string) =>
      `${name} apprendra alors les touches dans l'ordre du parcours ${sprache}, avec des textes en ${sprache}.`,
    stand: (name: string, alt: string) =>
      `La progression acquise est conservée : si vous revenez plus tard au parcours ${alt}, ${name} reprend exactement au même endroit. Dans le nouveau parcours, ${name} commence au début - ou là où en était sa progression la dernière fois. Le temps d'entrainement, l'objectif de la semaine et les badges continuent.`,
    wirksam: (name: string) => `Effectif dès que ${name} ouvre Tastenflow la prochaine fois.`,
    frageTastatur: (name: string, tastatur: string) => `Est-ce que ${name} utilise ${tastatur} ?`,
    frageUmstellen: "Changer maintenant ?",
    ja: "Oui",
    nein: "Non",
    gesetzt: (name: string, sprache: string) =>
      `${name} apprend maintenant dans le parcours ${sprache} - dès sa prochaine ouverture de Tastenflow.`,
    nichtGesetzt: (name: string) =>
      `Le parcours de ${name} n'a pas été changé - le serveur l'a refusé ou n'a pas pu être joint.`,
  },
  es: {
    feld: "Recorrido (idioma)",
    feldName: (name: string) => `Recorrido de ${name}`,
    nochOffen: "aún sin fijar - en la primera práctica",
    tipp:
      "El idioma en el que este estudiante aprende mecanografía: orden de las teclas, textos y teclado. Para un estudiante cuya lengua materna no es la de la clase. Antes de cambiarlo se pide confirmación; el progreso logrado se conserva.",
    titel: (name: string) => `Cambiar el recorrido de ${name}`,
    achtung: (sprache: string) =>
      `Atención: el recorrido de ${sprache} solo es posible con el teclado adecuado.`,
    ohneLandestastatur: (name: string, sprache: string) =>
      `${name} aprenderá entonces las teclas en el orden del recorrido de ${sprache}, con textos en ${sprache}.`,
    stand: (name: string, alt: string) =>
      `El progreso logrado se conserva: si más adelante vuelve a ${alt}, ${name} sigue donde lo dejó. En el nuevo recorrido, ${name} empieza desde el principio - o donde estaba la última vez. El tiempo de práctica, el objetivo semanal y las insignias continúan.`,
    wirksam: (name: string) => `Se aplica en cuanto ${name} abra Tastenflow la próxima vez.`,
    frageTastatur: (name: string, tastatur: string) => `¿Usa ${name} ${tastatur}?`,
    frageUmstellen: "¿Cambiarlo ahora?",
    ja: "Sí",
    nein: "No",
    gesetzt: (name: string, sprache: string) =>
      `${name} aprende ahora en el recorrido de ${sprache} - a partir de la próxima vez que abra Tastenflow.`,
    nichtGesetzt: (name: string) =>
      `El recorrido de ${name} no se ha cambiado - el servidor lo rechazó o no respondió.`,
  },
  // ★ O-IT (02.10.2026): Lehrkraft neutral; „la persona", ohne Partizip mit Geschlecht.
  it: {
    feld: "Percorso (lingua)",
    feldName: (name: string) => `Percorso di ${name}`,
    nochOffen: "non ancora impostato - al primo esercizio",
    tipp:
      "La lingua in cui questa persona impara a scrivere con dieci dita: ordine dei tasti, testi e tastiera. Per chi ha una lingua madre diversa da quella della classe. Prima di cambiarlo si chiede una conferma; i progressi raggiunti restano.",
    titel: (name: string) => `Cambiare il percorso di ${name}`,
    achtung: (sprache: string) =>
      `Attenzione: il percorso di ${sprache} è possibile solo con la tastiera adatta.`,
    ohneLandestastatur: (name: string, sprache: string) =>
      `${name} imparerà allora i tasti nell'ordine del percorso di ${sprache}, con testi in ${sprache}.`,
    stand: (name: string, alt: string) =>
      `I progressi raggiunti restano: se più avanti torna al percorso di ${alt}, ${name} riprende dallo stesso punto. Nel nuovo percorso, ${name} parte dall'inizio - o dal punto dell'ultima volta. Tempo di esercizio, obiettivo settimanale e medaglie continuano.`,
    wirksam: (name: string) => `Vale dalla prossima volta che ${name} apre Tastenflow.`,
    frageTastatur: (name: string, tastatur: string) => `${name} usa ${tastatur}?`,
    frageUmstellen: "Cambiarlo adesso?",
    ja: "Sì",
    nein: "No",
    gesetzt: (name: string, sprache: string) =>
      `${name} ora impara nel percorso di ${sprache} - dalla prossima volta che apre Tastenflow.`,
    nichtGesetzt: (name: string) =>
      `Il percorso di ${name} non è stato cambiato - il server l'ha rifiutato o non ha risposto.`,
  },
  // ★ O-PL (02.10.2026): Lehrkraft unpersönlich (Glossar Regel 1); der Name des
  // Kindes nur im Nominativ - als Subjekt im Präsens/Futur mit Infinitiv oder
  // nach Doppelpunkt (Regel 11); der Kursname in „…”.
  pl: {
    feld: "Kurs (język)",
    feldName: (name: string) => `Kurs dla: ${name}`,
    nochOffen: "jeszcze nieustalony - przy pierwszym ćwiczeniu",
    tipp:
      "W jakim języku ta osoba uczy się pisać dziesięcioma palcami: kolejność klawiszy, teksty i klawiatura. Dla osób, których pierwszy język jest inny niż język klasy. Zmiana wymaga potwierdzenia; dotychczasowe postępy zostają zapisane.",
    titel: (name: string) => `Zmiana kursu dla: ${name}`,
    achtung: (sprache: string) => `Uwaga: kurs „${sprache}” działa tylko z pasującą klawiaturą.`,
    ohneLandestastatur: (name: string, sprache: string) =>
      `${name} będzie wtedy poznawać klawisze w kolejności kursu „${sprache}”, z tekstami w tym języku.`,
    stand: (name: string, alt: string) =>
      `Dotychczasowe postępy zostają zapisane: jeśli później kurs zostanie przełączony z powrotem na „${alt}”, ${name} będzie ćwiczyć dalej od tego samego miejsca. W nowym kursie ${name} zaczyna od początku - albo od miejsca, w którym ostatnio skończono w tym kursie. Czas ćwiczeń, cel tygodniowy i odznaki liczą się dalej.`,
    wirksam: (name: string) => `Zmiana zacznie działać, gdy ${name} następnym razem otworzy program Tastenflow.`,
    frageTastatur: (name: string, tastatur: string) => `Czy ${name} używa ${tastatur}?`,
    frageUmstellen: "Zmienić teraz?",
    ja: "Tak",
    nein: "Nie",
    gesetzt: (name: string, sprache: string) =>
      `${name} uczy się teraz w kursie „${sprache}” - od następnego otwarcia programu Tastenflow.`,
    nichtGesetzt: (name: string) =>
      `Kurs dla: ${name} - bez zmian. Serwer odmówił albo nie był dostępny.`,
  },
  // ★ O-TR (02.10.2026): Lehrkraft siz mit -(y)In, nie -InIz (Glossar Regel 1);
  // der Name des Kindes nie mit Endung - "${name} adlı öğrenci" oder nach einem
  // Doppelpunkt (Regel 6); der Kursname in geraden Anführungszeichen vor "kursu".
  tr: {
    feld: "Kurs (dil)",
    feldName: (name: string) => `Öğrencinin kursu: ${name}`,
    nochOffen: "henüz belirlenmedi - ilk alıştırmada",
    tipp:
      "Bu öğrencinin on parmak klavyeyi hangi dilde öğrendiği: tuşların sırası, metinler ve klavye. Ana dili sınıfın dilinden farklı olan öğrenciler için. Değişiklikten önce onay istenir; şimdiye kadarki ilerleme kayıtlı kalır.",
    titel: (name: string) => `Kursu değiştir: ${name}`,
    achtung: (sprache: string) => `Dikkat: "${sprache}" kursu yalnızca uygun klavyeyle kullanılabilir.`,
    ohneLandestastatur: (name: string, sprache: string) =>
      `${name} adlı öğrenci tuşları o zaman "${sprache}" kursunun sırasıyla, bu dildeki metinlerle öğrenir.`,
    stand: (name: string, alt: string) =>
      `Şimdiye kadarki ilerleme kayıtlı kalır: daha sonra yeniden "${alt}" kursuna geçerseniz, ${name} adlı öğrenci tam kaldığı yerden devam eder. Yeni kursta en baştan başlar - ya da bu kursta en son kaldığı yerden. Çalışma süresi, haftalık hedef ve rozetler sayılmaya devam eder.`,
    wirksam: (name: string) =>
      `Değişiklik, ${name} adlı öğrenci Tastenflow programını bir sonraki açtığında geçerli olur.`,
    frageTastatur: (name: string, tastatur: string) => `${name} adlı öğrenci ${tastatur} kullanıyor mu?`,
    frageUmstellen: "Şimdi değiştirilsin mi?",
    ja: "Evet",
    nein: "Hayır",
    gesetzt: (name: string, sprache: string) =>
      `${name} adlı öğrenci artık "${sprache}" kursunda çalışıyor - Tastenflow programını bir sonraki açtığında geçerli.`,
    nichtGesetzt: (name: string) =>
      `Öğrencinin kursu değişmedi: ${name}. Sunucu reddetti ya da yanıt vermedi.`,
  },
  // ★ O-CS (03.10.2026): Lehrkraft vy-Mehrzahl bzw. unpersönlich (Glossar Regel 1);
  // der Name des Kindes ungebeugt - als Subjekt im Präsens oder in Klammern
  // (Regel 12), nie Vergangenheit („přestal"); der Kursname in Klammern nach „kurz".
  cs: {
    feld: "Kurz (jazyk)",
    feldName: (name: string) => `Kurz (${name})`,
    nochOffen: "zatím neurčený - při prvním cvičení",
    tipp:
      "V jakém jazyce se tato osoba učí psát všemi deseti: pořadí kláves, texty a klávesnice. Pro děti, jejichž mateřský jazyk je jiný než jazyk třídy. Změna se nejdřív potvrzuje; dosavadní pokrok zůstane uložený.",
    titel: (name: string) => `Změnit kurz (${name})`,
    achtung: (sprache: string) => `Pozor: kurz (${sprache}) je možný jen s odpovídající klávesnicí.`,
    ohneLandestastatur: (name: string, sprache: string) =>
      `${name} se pak učí klávesy v pořadí kurzu (${sprache}) a s texty v tomto jazyce.`,
    stand: (name: string, alt: string) =>
      `Dosavadní pokrok zůstane uložený: když se kurz později přepne zpátky (${alt}), ${name} pokračuje ze stejného místa. V novém kurzu začíná ${name} od začátku - nebo od místa, kde v tomto kurzu skončilo poslední cvičení. Čas procvičování, týdenní cíl a odznaky se počítají dál.`,
    wirksam: (name: string) =>
      `Změna platí od chvíle, kdy ${name} příště otevře aplikaci Tastenflow.`,
    frageTastatur: (name: string, tastatur: string) => `Používá ${name} ${tastatur}?`,
    frageUmstellen: "Změnit teď?",
    ja: "Ano",
    nein: "Ne",
    gesetzt: (name: string, sprache: string) =>
      `${name} se teď učí v kurzu (${sprache}) - platí od příštího otevření aplikace Tastenflow.`,
    nichtGesetzt: (name: string) =>
      `Kurz se nezměnil (${name}): server změnu odmítl nebo neodpověděl.`,
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      feld: "Курс (език)",
      feldName: (name: string) => `Курс за ${name}`,
      nochOffen: "още не е избран - при първото упражнение",
      tipp:
        "На какъв език детето учи писане с десет пръста: ред на клавишите, текстове и клавиатура. За дете, чийто първи език е различен от езика на класа. Преди промяна програмата пита, досегашният напредък се запазва.",
      titel: (name: string) => `Смяна на курса за ${name}`,
      achtung: (sprache: string) => `Внимание: курсът по ${sprache} е възможен само с подходящата клавиатура.`,
      ohneLandestastatur: (name: string, sprache: string) =>
        `Тогава ${name} ще учи клавишите в реда на курса по ${sprache}, с текстове на ${sprache}.`,
      // Ohne l-Partizip („стигнал/стигнала") - Glossar Regel 2/12.
      stand: (name: string, alt: string) =>
        `Досегашният напредък се запазва: ако по-късно превключите обратно на ${alt}, ${name} продължава точно оттам. В новия курс ${name} започва от началото - или от последното си място в него. Времето за упражнения, седмичната цел и значките продължават.`,
      wirksam: (name: string) => `Важи от следващия път, когато ${name} отвори Tastenflow.`,
      frageTastatur: (name: string, tastatur: string) => `Използва ли ${name} ${tastatur}?`,
      frageUmstellen: "Да се смени ли сега?",
      ja: "Да",
      nein: "Не",
      gesetzt: (name: string, sprache: string) =>
        `${name} вече учи в курса по ${sprache} - важи от следващото отваряне на Tastenflow.`,
      nichtGesetzt: (name: string) =>
        `Курсът за ${name} не е сменен - сървърът го отказа или не беше достъпен.`,
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      // Lehrkraft-Text (εσείς). Name nur nach Doppelpunkt bzw. in Klammern, nie mit Artikel (Glossar Regel 12);
      // Lernweg im Satz „πρόγραμμα (Ελληνικά)" (Glossar §2.2).
      feld: "Πρόγραμμα (γλώσσα)",
      feldName: (name: string) => `Πρόγραμμα - παιδί: ${name}`,
      nochOffen: "δεν ορίστηκε ακόμα - στην πρώτη εξάσκηση",
      tipp:
        "Σε ποια γλώσσα μαθαίνει αυτό το παιδί δακτυλογράφηση με δέκα δάχτυλα: σειρά των πλήκτρων, κείμενα και πληκτρολόγιο. Για παιδί με άλλη πρώτη γλώσσα από το τμήμα. Πριν από κάθε αλλαγή γίνεται ερώτηση. Η πρόοδος μέχρι τώρα μένει αποθηκευμένη.",
      titel: (name: string) => `Αλλαγή προγράμματος - παιδί: ${name}`,
      achtung: (sprache: string) => `Προσοχή: το πρόγραμμα (${sprache}) λειτουργεί μόνο με το κατάλληλο πληκτρολόγιο.`,
      ohneLandestastatur: (name: string, sprache: string) =>
        `Παιδί: ${name}. Θα μαθαίνει τα πλήκτρα με τη σειρά του προγράμματος (${sprache}), με κείμενα στα ${sprache}.`,
      stand: (name: string, alt: string) =>
        `Παιδί: ${name}. Η πρόοδος μέχρι τώρα μένει αποθηκευμένη: αν αργότερα επιλέξετε ξανά το πρόγραμμα (${alt}), συνεχίζει ακριβώς από εκεί. Στο νέο πρόγραμμα ξεκινά από την αρχή - ή από εκεί που ήταν την τελευταία φορά. Ο χρόνος εξάσκησης, ο εβδομαδιαίος στόχος και τα μετάλλια συνεχίζουν.`,
      wirksam: (name: string) => `Παιδί: ${name}. Ισχύει από την επόμενη φορά που θα ανοίξει το Tastenflow.`,
      frageTastatur: (name: string, tastatur: string) => `Παιδί: ${name}. Χρησιμοποιεί ${tastatur};`,
      frageUmstellen: "Αλλαγή τώρα;",
      ja: "Ναι",
      nein: "Όχι",
      gesetzt: (name: string, sprache: string) =>
        `Παιδί: ${name}. Μαθαίνει τώρα στο πρόγραμμα (${sprache}) - ισχύει από το επόμενο άνοιγμα του Tastenflow.`,
      nichtGesetzt: (name: string) =>
        `Παιδί: ${name}. Το πρόγραμμα δεν άλλαξε - ο διακομιστής το απέρριψε ή δεν ήταν διαθέσιμος.`,
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      feld: "Tanfolyam (nyelv)",
      feldName: (name: string) => `Tanfolyam - ${name}`,
      nochOffen: "még nincs megadva - az első gyakorlásnál",
      tipp:
        "Melyik nyelven tanul a tanuló tízujjas gépelést: a billentyűk sorrendje, a szövegek és a billentyűzet. Olyan tanulónak, akinek az anyanyelve eltér az osztályétól. Módosítás előtt a program rákérdez; az eddigi haladás megmarad.",
      titel: (name: string) => `Tanfolyam módosítása - ${name}`,
      achtung: (sprache: string) => `Figyelem: ez a tanfolyam (${sprache}) csak a megfelelő billentyűzettel használható.`,
      ohneLandestastatur: (name: string, sprache: string) =>
        `${name} ekkor a tanfolyam sorrendjében tanulja a billentyűket (${sprache}), ${sprache} nyelvű szövegekkel.`,
      stand: (name: string, alt: string) =>
        `Az eddigi haladás megmarad: ha később visszaállítja (${alt}), ${name} pontosan ott folytatja. Az új tanfolyamban ${name} az elejéről kezd - vagy onnan, ahol legutóbb tartott benne. A gyakorlási idő, a heti cél és a jelvények megmaradnak.`,
      wirksam: (name: string) => `Akkor lép életbe, amikor ${name} legközelebb megnyitja a Tastenflow programot.`,
      frageTastatur: (name: string, tastatur: string) => `Ezt használja ${name}: ${tastatur}?`,
      frageUmstellen: "Módosítja most?",
      ja: "Igen",
      nein: "Nem",
      gesetzt: (name: string, sprache: string) =>
        `${name} mostantól ebben a tanfolyamban tanul: ${sprache} - a Tastenflow következő megnyitásától.`,
      nichtGesetzt: (name: string) =>
        `A tanfolyam nem változott (${name}) - a szerver elutasította, vagy nem volt elérhető.`,
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      feld: "Cursus (taal)",
      feldName: (name: string) => `Cursus van ${name}`,
      nochOffen: "nog open - bij het eerste oefenen",
      tipp:
        "In welke taal deze leerling met tien vingers leert typen: volgorde van de toetsen, teksten en toetsenbord. Voor een leerling met een andere eerste taal dan de klas. Bij een wijziging wordt eerst gevraagd; de voortgang tot nu toe blijft bewaard.",
      titel: (name: string) => `Cursus van ${name} wijzigen`,
      achtung: (sprache: string) => `Let op: ${sprache} kan alleen met het passende toetsenbord.`,
      ohneLandestastatur: (name: string, sprache: string) =>
        `${name} leert de toetsen dan in de volgorde van de cursus ${sprache}, met teksten in het ${sprache}.`,
      stand: (name: string, alt: string) =>
        `De voortgang tot nu toe blijft bewaard: zet je later weer terug naar ${alt}, dan gaat ${name} precies daar verder. In de nieuwe cursus begint ${name} bij het begin - of daar waar de voortgang in die cursus het laatst was. Oefentijd, weekdoel en medailles lopen door.`,
      wirksam: (name: string) => `Dit werkt zodra ${name} Tastenflow de volgende keer opent.`,
      frageTastatur: (name: string, tastatur: string) => `Gebruikt ${name} ${tastatur}?`,
      frageUmstellen: "Nu wijzigen?",
      ja: "Ja",
      nein: "Nee",
      gesetzt: (name: string, sprache: string) =>
        `${name} leert nu in de cursus ${sprache} - vanaf de volgende keer dat Tastenflow wordt geopend.`,
      nichtGesetzt: (name: string) =>
        `De cursus van ${name} is niet gewijzigd - de server heeft het geweigerd of was niet bereikbaar.`,
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      feld: "Curso (língua)",
      feldName: (name: string) => `Curso: ${name}`,
      nochOffen: "ainda por definir - na primeira prática",
      tipp:
        "A língua em que esta pessoa aprende a escrever com os dez dedos: ordem das teclas, textos e teclado. Para estudantes cuja língua materna é diferente da da turma. Uma alteração pede confirmação antes; o progresso até aqui fica guardado.",
      titel: (name: string) => `Mudar o curso: ${name}`,
      achtung: (sprache: string) => `Atenção: o curso (${sprache}) só funciona com o teclado correspondente.`,
      ohneLandestastatur: (name: string, sprache: string) =>
        `${name} passa então a aprender as teclas pela ordem do curso (${sprache}), com textos em ${sprache}.`,
      stand: (name: string, alt: string) =>
        `O progresso até aqui fica guardado: se mais tarde voltar a escolher ${alt}, ${name} continua exatamente onde estava. No novo curso, ${name} começa do início - ou onde estava da última vez nesse curso. O tempo de prática, o objetivo semanal e as medalhas continuam.`,
      wirksam: (name: string) => `Entra em vigor na próxima vez que ${name} abrir o Tastenflow.`,
      frageTastatur: (name: string, tastatur: string) => `${name} usa ${tastatur}?`,
      frageUmstellen: "Mudar agora?",
      ja: "Sim",
      nein: "Não",
      gesetzt: (name: string, sprache: string) =>
        `${name} aprende agora no curso (${sprache}) - a partir da próxima vez que abrir o Tastenflow.`,
      nichtGesetzt: (name: string) =>
        `Curso não alterado para ${name} - o servidor recusou ou não estava acessível.`,
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      feld: "Curso (idioma)",
      feldName: (name: string) => `Curso: ${name}`,
      nochOffen: "ainda não definido - na primeira prática",
      tipp:
        "Em qual idioma esta pessoa aprende digitação com os dez dedos: ordem das teclas, textos e teclado. Para estudantes cuja primeira língua é diferente da turma. Antes de mudar, o programa pergunta; o progresso até agora fica salvo.",
      titel: (name: string) => `Mudar o curso: ${name}`,
      achtung: (sprache: string) => `Atenção: ${sprache} só funciona com o teclado correspondente.`,
      ohneLandestastatur: (name: string, sprache: string) =>
        `${name} vai aprender as teclas na ordem do curso ${sprache}, com textos em ${sprache}.`,
      stand: (name: string, alt: string) =>
        `O progresso até agora fica salvo: se você voltar para ${alt} mais tarde, ${name} continua exatamente de onde parou. No curso novo, ${name} começa do início - ou de onde estava da última vez nele. Tempo de prática, meta semanal e medalhas continuam.`,
      wirksam: (name: string) => `Vale a partir da próxima vez que ${name} abrir o Tastenflow.`,
      frageTastatur: (name: string, tastatur: string) => `${name} usa ${tastatur}?`,
      frageUmstellen: "Mudar agora?",
      ja: "Sim",
      nein: "Não",
      gesetzt: (name: string, sprache: string) =>
        `${name} agora aprende no curso ${sprache} - a partir da próxima vez que abrir o Tastenflow.`,
      nichtGesetzt: (name: string) =>
        `O curso de ${name} não foi mudado - o servidor recusou ou não pôde ser acessado.`,
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      feld: "Parcurs (limbă)",
      feldName: (name: string) => `Parcurs: ${name}`,
      nochOffen: "încă nestabilit - la primul exercițiu",
      tipp:
        "Limba în care această persoană învață scrierea cu zece degete: ordinea tastelor, textele și tastatura. Pentru elevii a căror primă limbă diferă de cea a clasei. O modificare cere mai întâi confirmarea; progresul de până acum se păstrează.",
      titel: (name: string) => `Schimbați parcursul: ${name}`,
      achtung: (sprache: string) => `Atenție: parcursul (${sprache}) funcționează doar cu tastatura potrivită.`,
      ohneLandestastatur: (name: string, sprache: string) =>
        `${name} învață atunci tastele în ordinea parcursului (${sprache}), cu texte în limba ${sprache}.`,
      stand: (name: string, alt: string) =>
        `Progresul de până acum se păstrează: dacă reveniți mai târziu la parcursul (${alt}), ${name} continuă exact de acolo. În parcursul nou, ${name} începe de la început - sau de unde a rămas ultima dată în el. Timpul de exersare, obiectivul săptămânal și medaliile continuă.`,
      wirksam: (name: string) => `Se aplică data viitoare când ${name} deschide Tastenflow.`,
      frageTastatur: (name: string, tastatur: string) => `${name} folosește ${tastatur}?`,
      frageUmstellen: "Schimbați acum?",
      ja: "Da",
      nein: "Nu",
      gesetzt: (name: string, sprache: string) =>
        `${name} învață acum în parcursul (${sprache}) - de la următoarea deschidere a Tastenflow.`,
      nichtGesetzt: (name: string) =>
        `${name}: parcursul nu a fost schimbat - serverul a refuzat sau nu a putut fi accesat.`,
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      feld: "Kurs (språk)",
      feldName: (name: string) => `Kurs: ${name}`,
      nochOffen: "inte valt än - vid första övningen",
      tipp:
        "Det språk som eleven lär sig skriva med alla tio fingrar på: tangenternas ordning, texter och tangentbord. För en elev med ett annat förstaspråk än klassens. En ändring frågar först; det som är gjort hittills sparas.",
      titel: (name: string) => `Byt kurs: ${name}`,
      achtung: (sprache: string) => `Obs: kursen (${sprache}) fungerar bara med rätt tangentbord.`,
      ohneLandestastatur: (name: string, sprache: string) =>
        `${name} lär sig då tangenterna i kursens ordning (${sprache}), med texter på ${sprache}.`,
      stand: (name: string, alt: string) =>
        `Det som är gjort hittills sparas: byter du senare tillbaka till ${alt}, fortsätter ${name} precis där. I den nya kursen börjar ${name} från början - eller där ${name} senast var i den. Övningstid, veckomål och märken fortsätter.`,
      wirksam: (name: string) => `Gäller nästa gång ${name} öppnar Tastenflow.`,
      frageTastatur: (name: string, tastatur: string) => `Använder ${name} ${tastatur}?`,
      frageUmstellen: "Byta nu?",
      ja: "Ja",
      nein: "Nej",
      gesetzt: (name: string, sprache: string) =>
        `${name} övar nu i kursen (${sprache}) - från nästa gång Tastenflow öppnas.`,
      nichtGesetzt: (name: string) =>
        `Kursen för ${name} byttes inte - servern nekade eller gick inte att nå.`,
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      // Glossar Regel 12: ${name} ungebeugt - nach Doppelpunkt oder als Subjekt (Präsens/Futur, ohne Geschlecht).
      feld: "Курс (мова)",
      feldName: (name: string) => `Курс: ${name}`,
      nochOffen: "ще не визначено - під час першого тренування",
      tipp:
        "Якою мовою ця дитина вчиться десятипальцевого методу: порядок клавіш, тексти й клавіатура. Для дитини, чия перша мова відрізняється від мови класу. Перед зміною програма запитає; досягнутий поступ збережеться.",
      titel: (name: string) => `Змінити курс: ${name}`,
      achtung: (sprache: string) => `Увага: курс (${sprache}) можливий лише з відповідною клавіатурою.`,
      ohneLandestastatur: (name: string, sprache: string) =>
        `Тоді ${name} вивчатиме клавіші в порядку курсу (${sprache}), мова текстів: ${sprache}.`,
      stand: (name: string, alt: string) =>
        `Досягнутий поступ зберігається: якщо ви згодом повернете курс (${alt}), ${name} продовжить точно з того самого місця. У новому курсі ${name} починає спочатку - або з місця, на якому в цьому курсі востаннє було тренування. Час тренування, тижнева мета й медалі залишаються.`,
      wirksam: (name: string) => `Діє відтоді, як ${name} наступного разу відкриє Tastenflow.`,
      frageTastatur: (name: string, tastatur: string) => `${name} використовує ${tastatur}?`,
      frageUmstellen: "Змінити зараз?",
      ja: "Так",
      nein: "Ні",
      gesetzt: (name: string, sprache: string) =>
        `${name} тепер навчається в курсі (${sprache}) - діє з наступного відкриття Tastenflow.`,
      nichtGesetzt: (name: string) =>
        `Курс не змінено (${name}) - сервер відхилив зміну або був недоступний.`,
    },
});

/** Der Name eines Weges in der Sprache der Bedienung („Französisch", „French" …). */
export function wegName(weg: Lernweg, sprache: BedienSprache): string {
  return WEG_NAMEN[sprache][weg];
}

/**
 * Welche Wege im Feld stehen: Deutsch, Englisch, Französisch - Spanisch nur
 * mit dem Schalter des spanischen Lehrgangs oder wenn das Kind schon dort
 * steht (sonst zeigte das Feld still einen anderen Weg).
 */
export function angeboteneWege(
  aktuell: Lernweg | null,
  spanischAn: boolean,
  /**
   * ★ G2a (02.10.2026): die Schalter der vier neuen Lehrgänge (Vorgabe: alle
   * aus). Ein neuer Weg steht nur im Feld, wenn sein Schalter an ist oder das
   * Kind schon dort steht - dieselbe Regel wie bei Spanisch.
   */
  // ★ G2-NEUN (25.10.2026): dazu die neun Wege des Gerüsts (Vorgabe aus) - dieselbe Regel.
  neueAn: Partial<Record<"it" | "pl" | "tr" | "cs" | GeruestLehrgang, boolean>> = {},
): Lernweg[] {
  const wege: Lernweg[] = ["de", "en", "fr"];
  if (spanischAn || aktuell === "es") wege.push("es");
  for (const w of ["it", "pl", "tr", "cs", ...GERUEST_LEHRGAENGE] as const) {
    if (neueAn[w] || aktuell === w) wege.push(w);
  }
  return wege;
}

export function WegJeKind({
  pupil,
  onSetLernweg,
}: {
  pupil: TypingAccount;
  /** Nach dem „Ja" - schreibt den Weg (Lehrkraft-Weg am Server). */
  onSetLernweg: (id: string, name: string, weg: Lernweg) => void;
}) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = WEG_TEXTE[sprache];
  const aktuell: Lernweg | null = istLernweg(pupil.lernweg) ? pupil.lernweg : null;
  const [frage, setFrage] = useState<Lernweg | null>(null);
  const neue = neueLehrgangProben();
  const wege = angeboteneWege(aktuell, spanischLehrgangProbeAn(), {
    it: neue.italienischLehrgangProbeAn,
    pl: neue.polnischLehrgangProbeAn,
    tr: neue.tuerkischLehrgangProbeAn,
    cs: neue.tschechischLehrgangProbeAn,
    ...neue.geruestLehrgangAn,
  });

  const rueckfrage = (() => {
    if (!frage) return null;
    const neuName = wegName(frage, sprache);
    const altName = wegName(aktuell ?? "de", sprache);
    const land = tastaturenDesWeges(frage) ? (frage as "fr" | "es" | "it" | "pl" | "tr" | "cs") : null;
    const saetze = [
      land
        ? t.achtung(neuName)
        : t.ohneLandestastatur(pupil.name, neuName),
      // Wer noch keinen Weg hat, hat auch keinen Stand, der geparkt würde.
      ...(aktuell ? [t.stand(pupil.name, altName)] : []),
      t.wirksam(pupil.name),
    ];
    return (
      <TastaturRueckfrage
        titel={t.titel(pupil.name)}
        saetze={saetze}
        frage={land ? t.frageTastatur(pupil.name, TASTATUR_FRAGE[sprache][land]) : t.frageUmstellen}
        ja={t.ja}
        nein={t.nein}
        onJa={() => {
          setFrage(null);
          onSetLernweg(pupil.id, pupil.name, frage);
        }}
        onNein={() => setFrage(null)}
      />
    );
  })();

  return (
    <>
      <Tipp text={t.tipp}>
        {(hinweisId) => (
          <select
            className="field-input feld-schlank"
            value={aktuell ?? ""}
            onChange={(e) => {
              const neu = e.target.value;
              if (istLernweg(neu) && neu !== aktuell) setFrage(neu);
            }}
            aria-label={t.feldName(pupil.name)}
            aria-describedby={hinweisId}
          >
            {!aktuell && <option value="">{t.nochOffen}</option>}
            {wege.map((w) => (
              <option key={w} value={w}>
                {wegName(w, sprache)}
              </option>
            ))}
          </select>
        )}
      </Tipp>
      {rueckfrage}
    </>
  );
}
