/**
 * ★★★ Welche Brailletabelle gehört zu welcher Sprache, und der Rückweg bei JAWS (31.10.2026).
 *
 * Tastenflow enthält keine eigenen Punkte: Die kommen vom Screenreader, aus der
 * Tabelle, die dort eingestellt ist. Die Hilfen und Handbücher nennen darum die
 * passende Tabelle. Belege und Punkte je Zeichen:
 * `BEFUND-2026-10-31-BRAILLEALPHABETE.md`.
 *
 * `nvda` ist der Name in NVDAs eigener Sprachdatei, `jaws` der Name in JAWS'
 * Tabellenliste (`LiblouisTrans.xml`), `datei` die Tabelle in liblouis. Wächter:
 * `tests/tastenflow-screenreader-hinweise.test.ts`.
 */
import type { Lernweg } from "./lernweg";

export interface BrailleTabelle {
  /** Datei in `NVDA\louis\tables`. */
  datei: string;
  nvda: string;
  jaws: string;
  /** NVDAs Automatik nimmt für diese Bedienungssprache 8-Punkt-Computerbraille. */
  automatikFalsch?: true;
  /** JAWS listet hier nur eine Tabelle, die sich selbst als Computerbraille ausweist. */
  jawsNurComputer?: true;
}

export const BRAILLE_TABELLEN: Readonly<Record<Lernweg, BrailleTabelle>> = {
  de: { datei: "de-g1.ctb", nvda: "Deutsche Vollschrift", jaws: "German Grade 1" },
  en: { datei: "en-ueb-g1.ctb", nvda: "Unified English Braille Code grade 1", jaws: "Unified English Braille Grade 1" },
  fr: { datei: "fr-bfu-comp6.utb", nvda: "Français (unifié) Braille littéraire 6 points", jaws: "Unified French Grade 1", automatikFalsch: true },
  es: { datei: "es-g1.ctb", nvda: "Español grado 1", jaws: "Spanish Grade 1", automatikFalsch: true },
  it: { datei: "it-it-comp6.utb", nvda: "Italiano 6 punti", jaws: "Italian 6 dot" },
  pl: { datei: "Pl-Pl-g1.utb", nvda: "Polski brajl literacki", jaws: "Polish literary", automatikFalsch: true },
  tr: { datei: "tr-g1.ctb", nvda: "Türkçe derece1", jaws: "Türkçe kısaltmasız", jawsNurComputer: true },
  cs: { datei: "cs-g1.ctb", nvda: "Čeština plnopis", jaws: "Czech Grade 1" },
  bg: { datei: "bg.utb", nvda: "Български, ниво 1", jaws: "Bulgarian Literary Braille" },
  el: { datei: "el.ctb", nvda: "Ελληνικά (Ελλάδα)", jaws: "Greek" },
  hu: { datei: "hu-hu-g1.ctb", nvda: "Magyar irodalmi braille", jaws: "Hungarian Grade 1" },
  nl: { datei: "nl-NL-g0.utb", nvda: "Nederlands 6 punt", jaws: "Netherlands 6-dots", automatikFalsch: true },
  pt: { datei: "Pt-Pt-g1.utb", nvda: "Português grau 1", jaws: "Portuguese Grade 1" },
  br: { datei: "Pt-Pt-g1.utb", nvda: "Português, grau 1", jaws: "Portuguese Grade 1" },
  ro: { datei: "ro-g0.utb", nvda: "Română 6 puncte", jaws: "Romanian", jawsNurComputer: true },
  sv: { datei: "sv-g0.utb", nvda: "Svensk icke sammandragen punktskrift", jaws: "Swedish Uncontracted Braille" },
  uk: { datei: "uk.utb", nvda: "Український літературний брайль", jaws: "Ukrainian Grade 1" },
};

interface HinweisTexte {
  /** Für Kinder und Lehrkräfte; ohne Anrede, gilt in beiden Hilfen. */
  jawsRueckweg: string;
  /** Mit Platzhaltern {nvda} und {jaws}. */
  tabelle: string;
  automatikFalsch: string;
  jawsNurComputer: string;
}

/** ⚠️ Nicht muttersprachlich gelesen (ausser de). Ohne Anrede, damit keine Anredeform einer Sprache verletzt wird. */
export const SCREENREADER_HINWEISE: Readonly<Record<Lernweg, HinweisTexte>> = {
  de: {
    jawsRueckweg: "Mit JAWS: Nach Esc in der Schreibzeile kommen die Tasten nicht mehr an. Alt + E führt zurück.",
    tabelle: "Passende Brailletabelle: in NVDA „{nvda}“, in JAWS „{jaws}“.",
    automatikFalsch: "Die Automatik von NVDA nimmt hier 8-Punkt-Computerbraille, darum von Hand einstellen.",
    jawsNurComputer: "JAWS bietet für diese Sprache nur Computerbraille an.",
  },
  en: {
    jawsRueckweg: "With JAWS: After Esc in the typing line, keys no longer arrive. Alt + E leads back.",
    tabelle: "Matching braille table: in NVDA \"{nvda}\", in JAWS \"{jaws}\".",
    automatikFalsch: "NVDA's automatic choice is 8-dot computer braille here, so set it by hand.",
    jawsNurComputer: "JAWS only offers computer braille for this language.",
  },
  fr: {
    jawsRueckweg: "Avec JAWS : après Échap dans la ligne de saisie, les touches n'arrivent plus. Alt + E permet de revenir.",
    tabelle: "Table braille adaptée : dans NVDA “{nvda}”, dans JAWS “{jaws}”.",
    automatikFalsch: "Le choix automatique de NVDA est ici le braille informatique 8 points : à régler à la main.",
    jawsNurComputer: "Pour cette langue, JAWS ne propose que le braille informatique.",
  },
  es: {
    jawsRueckweg: "Con JAWS: tras Esc en la línea de escritura, las teclas dejan de llegar. Alt + E lleva de vuelta.",
    tabelle: "Tabla braille adecuada: en NVDA «{nvda}», en JAWS «{jaws}».",
    automatikFalsch: "La opción automática de NVDA es aquí braille informático de 8 puntos: hay que ajustarla a mano.",
    jawsNurComputer: "Para este idioma, JAWS solo ofrece braille informático.",
  },
  it: {
    jawsRueckweg: "Con JAWS: dopo Esc nella riga di scrittura i tasti non arrivano più. Alt + E riporta indietro.",
    tabelle: "Tabella braille adatta: in NVDA «{nvda}», in JAWS «{jaws}».",
    automatikFalsch: "La scelta automatica di NVDA è qui il braille informatico a 8 punti: va impostata a mano.",
    jawsNurComputer: "Per questa lingua JAWS offre solo il braille informatico.",
  },
  pl: {
    jawsRueckweg: "Z JAWS: po naciśnięciu Esc w wierszu pisania klawisze przestają docierać. Alt + E prowadzi z powrotem.",
    tabelle: "Odpowiednia tablica brajlowska: w NVDA „{nvda}”, w JAWS „{jaws}”.",
    automatikFalsch: "Automatyczny wybór NVDA to tutaj 8-punktowy brajl komputerowy, dlatego trzeba ustawić ręcznie.",
    jawsNurComputer: "Dla tego języka JAWS oferuje tylko brajl komputerowy.",
  },
  tr: {
    jawsRueckweg: "JAWS ile: Yazma satırında Esc tuşuna basınca tuşlar artık ulaşmaz. Alt + E geri götürür.",
    tabelle: "Uygun Braille tablosu: NVDA içinde \"{nvda}\", JAWS içinde \"{jaws}\".",
    automatikFalsch: "NVDA burada otomatik olarak 8 noktalı bilgisayar Braille seçer, bu yüzden elle ayarlanmalıdır.",
    jawsNurComputer: "JAWS bu dil için yalnızca bilgisayar Braille sunar.",
  },
  cs: {
    jawsRueckweg: "S JAWS: Po Esc v řádku pro psaní už klávesy nedorazí. Alt + E vede zpět.",
    tabelle: "Vhodná braillská tabulka: v NVDA „{nvda}“, v JAWS „{jaws}“.",
    automatikFalsch: "Automatická volba NVDA je zde osmibodové počítačové písmo, proto je třeba nastavit ručně.",
    jawsNurComputer: "JAWS pro tento jazyk nabízí jen počítačové braillovo písmo.",
  },
  bg: {
    jawsRueckweg: "С JAWS: след Esc в реда за писане клавишите вече не пристигат. Alt + E връща обратно.",
    tabelle: "Подходяща брайлова таблица: в NVDA „{nvda}“, в JAWS „{jaws}“.",
    automatikFalsch: "Автоматичният избор на NVDA тук е 8-точков компютърен брайл, затова се настройва ръчно.",
    jawsNurComputer: "За този език JAWS предлага само компютърен брайл.",
  },
  el: {
    jawsRueckweg: "Με το JAWS: μετά το Esc στη γραμμή γραφής τα πλήκτρα δεν φτάνουν πια. Το Alt + E οδηγεί πίσω.",
    tabelle: "Κατάλληλος πίνακας Braille: στο NVDA «{nvda}», στο JAWS «{jaws}».",
    automatikFalsch: "Η αυτόματη επιλογή του NVDA εδώ είναι Braille υπολογιστή 8 κουκκίδων, γι' αυτό ρυθμίζεται χειροκίνητα.",
    jawsNurComputer: "Για αυτή τη γλώσσα το JAWS προσφέρει μόνο Braille υπολογιστή.",
  },
  hu: {
    jawsRueckweg: "JAWS-szal: az írássorban az Esc után a billentyűk már nem érkeznek meg. Az Alt + E visszavezet.",
    tabelle: "Megfelelő Braille-tábla: az NVDA-ban „{nvda}”, a JAWS-ban „{jaws}”.",
    automatikFalsch: "Az NVDA automatikus választása itt a 8 pontos számítógépes Braille, ezért kézzel kell beállítani.",
    jawsNurComputer: "A JAWS ehhez a nyelvhez csak számítógépes Braille-t kínál.",
  },
  nl: {
    jawsRueckweg: "Met JAWS: na Esc in de typregel komen de toetsen niet meer aan. Alt + E leidt terug.",
    tabelle: "Passende brailletabel: in NVDA \"{nvda}\", in JAWS \"{jaws}\".",
    automatikFalsch: "De automatische keuze van NVDA is hier 8-punts computerbraille, dus met de hand instellen.",
    jawsNurComputer: "JAWS biedt voor deze taal alleen computerbraille aan.",
  },
  pt: {
    jawsRueckweg: "Com o JAWS: depois de Esc na linha de escrita, as teclas deixam de chegar. Alt + E leva de volta.",
    tabelle: "Tabela braille adequada: no NVDA «{nvda}», no JAWS «{jaws}».",
    automatikFalsch: "A escolha automática do NVDA é aqui o braille informático de 8 pontos, por isso deve ser ajustada à mão.",
    jawsNurComputer: "Para esta língua, o JAWS só oferece braille informático.",
  },
  br: {
    jawsRueckweg: "Com o JAWS: depois de Esc na linha de digitação, as teclas deixam de chegar. Alt + E leva de volta.",
    tabelle: "Tabela braille adequada: no NVDA \"{nvda}\", no JAWS \"{jaws}\".",
    automatikFalsch: "A escolha automática do NVDA aqui é o braille de computador de 8 pontos, por isso deve ser ajustada à mão.",
    jawsNurComputer: "Para este idioma, o JAWS só oferece braille de computador.",
  },
  ro: {
    jawsRueckweg: "Cu JAWS: după Esc în rândul de scris, tastele nu mai ajung. Alt + E duce înapoi.",
    tabelle: "Tabel braille potrivit: în NVDA „{nvda}”, în JAWS „{jaws}”.",
    automatikFalsch: "Alegerea automată a NVDA este aici braille de calculator cu 8 puncte, deci se reglează manual.",
    jawsNurComputer: "Pentru această limbă, JAWS oferă numai braille de calculator.",
  },
  sv: {
    jawsRueckweg: "Med JAWS: Efter Esc i skrivraden kommer tangenterna inte längre fram. Alt + E leder tillbaka.",
    tabelle: "Passande punktskriftstabell: i NVDA ”{nvda}”, i JAWS ”{jaws}”.",
    automatikFalsch: "NVDA:s automatiska val är här 8-punkts datorpunktskrift, så den ställs in för hand.",
    jawsNurComputer: "JAWS erbjuder bara datorpunktskrift för det här språket.",
  },
  uk: {
    jawsRueckweg: "З JAWS: після Esc у рядку для друку клавіші більше не доходять. Alt + E веде назад.",
    tabelle: "Відповідна таблиця Брайля: у NVDA «{nvda}», у JAWS «{jaws}».",
    automatikFalsch: "Автоматичний вибір NVDA тут: 8-точковий комп'ютерний Брайль, тому його налаштовують вручну.",
    jawsNurComputer: "Для цієї мови JAWS пропонує лише комп'ютерний Брайль.",
  },
};

/** Der Satz zur Tabelle einer Sprache, samt Warnungen. */
export function brailleTabellenSatz(weg: Lernweg): string {
  const t = BRAILLE_TABELLEN[weg];
  const s = SCREENREADER_HINWEISE[weg];
  const teile = [s.tabelle.replace("{nvda}", t.nvda).replace("{jaws}", t.jaws)];
  if (t.automatikFalsch) teile.push(s.automatikFalsch);
  if (t.jawsNurComputer) teile.push(s.jawsNurComputer);
  return teile.join(" ");
}
