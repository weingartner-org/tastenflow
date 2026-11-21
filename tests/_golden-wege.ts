/**
 * ★★★★★ G1-GOLDEN (25.10.2026): die Einstellungen der vier fertigen Wege für {@link ./_golden-weg-helfer.ts}.
 * Nur Stichproben-Eingaben (Beispielzeilen, Fokus-Zeichen, Merkmale der späten Zeilen) - keine erwarteten Werte;
 * die stehen in den Fixtures `tests/fixtures/tastenflow-{lernweg,lernweg-inhalt,generator}-{it,pl,tr,cs}-golden.json`.
 */
import type { WegEinstellung } from "./_golden-weg-helfer";

/** Italienisch: vier Tastaturen (it, it-qzerty, Tessin ch-fr und ch), Akzente, Elision mit Apostroph. */
export const WEG_IT: WegEinstellung = {
  W: "it",
  layouts: ["it", "it-qzerty", "ch-fr", "ch"],
  texte: ["fjdk", "ciao", "Perché no?", "L'amico è qui.", "città e però", "Via Roma 12", "Costo: 3 € (circa)", "x = [1, 2]", "àèéìòù ÀÈÉÌÒÙ", "un'ora", "{a} & b", ""],
  zusatzZeichen: ["A", "À", "È", "É", "Ì", "Ò", "Ù"],
  eigeneZeichen: ["ò", "è", "à", "'", "é", "ì", "ù"],
  spaeteMerkmale: ["'", "è", "à", "ò"],
};

/** Polnisch: eine Tastatur (Programmierer), Buchstaben mit AltGr. */
export const WEG_PL: WegEinstellung = {
  W: "pl",
  layouts: ["pl"],
  texte: ["fjdk", "żółw", "Zażółć gęślą jaźń.", "Ćma i Łódź", "Czy to prawda?", "ul. Długa 12", "Cena: 3 € (ok.)", "x = [1, 2]", "ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ", "a\b ^ c", "{a} & b", ""],
  zusatzZeichen: ["A", "Ą", "Ć", "Ę", "Ł", "Ń", "Ó", "Ś", "Ź", "Ż"],
  eigeneZeichen: ["ę", "ł", "ż", "ą", "ś", "ć", "ó", "ń", "ź"],
  spaeteMerkmale: ["ł", "ż", "ą", "ę"],
};

/** Türkisch: Q-Tastatur (Weg) und F-Tastatur (erkannt), ı/İ, Totaste ^ (â î û), Apostroph vor Endungen. */
export const WEG_TR: WegEinstellung = {
  W: "tr",
  layouts: ["tr-q", "tr-f"],
  texte: ["fjdk", "ışık", "İstanbul'a gidiyoruz.", "Ağaç ve çiçek", "Ne zaman?", "Sokak 12", "Fiyat: 3 ₺ (yaklaşık)", "x = [1, 2]", "çğıöşü ÇĞIİÖŞÜ", "kâğıt ve hâlâ", "{a} & b ½", ""],
  zusatzZeichen: ["I", "İ", "i", "ı", "Ç", "Ğ", "Ö", "Ş", "Ü", "â", "î", "û", "Â"],
  eigeneZeichen: ["ş", "ı", "ç", "ğ", "ü", "ö", "'", "^"],
  spaeteMerkmale: ["ı", "ş", "ğ", "'"],
};

/** Tschechisch: QWERTZ und QWERTY, Háček/Čárka als eigene Tasten und als Totasten (ˇ ´ ¨). */
export const WEG_CS: WegEinstellung = {
  W: "cs",
  layouts: ["cs", "cs-qwerty"],
  texte: ["fjdk", "žluťoučký kůň", "Příliš žluťoučký kůň úpěl ďábelské ódy.", "Čau, jak se máš?", "ulice 12", "Cena: 3 € (asi)", "x = [1, 2]", "áčďéěíňóřšťúůýž ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ", "ďobek ťuk", "{a} & b", ""],
  zusatzZeichen: ["A", "Á", "Č", "Ď", "É", "Ě", "Í", "Ň", "Ó", "Ř", "Š", "Ť", "Ú", "Ů", "Ý", "Ž", "ď", "ť", "ň", "ó", "ü"],
  eigeneZeichen: ["ů", "ě", "í", "á", "ž", "š", "ř", "č", "é", "ý", "ˇ", "ú", "´", "¨"],
  spaeteMerkmale: ["ř", "ě", "ů", "ž"],
};
