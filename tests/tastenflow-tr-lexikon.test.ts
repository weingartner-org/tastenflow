/**
 * ★★★★★ WÄCHTER F8 Türkisch (03.10.2026): das Vorlese-Lexikon - ein echtes türkisches Wort wird GANZ gesprochen, nicht buchstabiert
 * (Leitfaden Falle 58: Lexikon VOR den Texten).
 *
 * Vorbild: `tests/tastenflow-it-lexikon.test.ts`. Dazu der Apostroph, der im Türkischen NUR an Eigennamen steht (`Ankara'da`):
 * `normalizeWord` behält ihn im Wort, `isRealWord` erkennt Name + Apostroph + eine türkische Endung (`istApostrofFormTr`).
 * Und die Türkische Falle i/İ/ı/I: `normalizeWord` rechnet mit dem Gebietsschema.
 */
import { describe, expect, it } from "vitest";
import { isRealWord, istApostrofFormTr, lexikonGroesse, lexikonWoerter, normalizeWord } from "../src/lib/typing/lexicon";
import { readPlanAt } from "../src/lib/typing/voice";
import { NACHTRAG_TR } from "../src/lib/typing/lexikonNachtragTr";
import { sprachDaten } from "../src/lib/typing/sprachpakete";
import { gesperrtTr, istKernGesperrtTr } from "../src/lib/typing/sperrlisteTr";
import { STUFE_VOCAB_TR, WORDS_TR } from "../src/lib/typing/wordsTr";

const echt = (w: string) => isRealWord(w, "tr");

describe("1 · normalizeWord(\"tr\"): Sonderbuchstaben und Apostroph bleiben, gross/klein türkisch (Falle 7)", () => {
  it("klein TÜRKISCH, Satzzeichen und Ziffern fallen weg, ç ğ ı ö ş ü â und der Apostroph im Wort bleiben", () => {
    expect(normalizeWord("Çocuk,", "tr")).toBe("çocuk");
    expect(normalizeWord("«Ağaç»!", "tr")).toBe("ağaç");
    expect(normalizeWord("Ali'nin.", "tr")).toBe("ali'nin");
    expect(normalizeWord("Türkiye'de", "tr")).toBe("türkiye'de");
    expect(normalizeWord("2026", "tr")).toBe("");
    for (const k of ["ç", "ğ", "ı", "ö", "ş", "ü", "â", "î", "û"]) expect(normalizeWord(`x${k}y`, "tr")).toBe(`x${k}y`);
  });

  it("★ i und ı sind zwei Buchstaben: IŞIK ⇒ ışık (nie işik), İSTANBUL ⇒ istanbul (ein Zeichen für İ), ILIK ⇒ ılık, İLİK ⇒ ilik", () => {
    expect(normalizeWord("IŞIK", "tr")).toBe("ışık");
    expect(normalizeWord("İSTANBUL", "tr")).toBe("istanbul");
    expect(normalizeWord("ILIK", "tr")).toBe("ılık");
    expect(normalizeWord("İLİK", "tr")).toBe("ilik");
    // die Falle: ohne Sprache wird aus İ ein i mit Kombinationspunkt, und ş fiele als Nicht-Buchstabe weg: „İŞ" wäre „i"
    expect(normalizeWord("İŞ")).toBe("i");
    expect(normalizeWord("İŞ", "tr")).toBe("iş");
    expect(echt("IŞIK")).toBe(true);
    expect(echt("İŞ")).toBe(true);
  });

  it("ohne Sprache und für de/en/fr/es/it: dieselbe Antwort wie vorher (Café bleibt auf de/en „caf“, Apostroph fällt weg)", () => {
    expect(normalizeWord("Café")).toBe("caf");
    expect(normalizeWord("l'ami", "de")).toBe("lami");
    expect(normalizeWord("l'ami", "en")).toBe("lami");
    expect(normalizeWord("año", "es")).toBe("año");
    expect(normalizeWord("l'amico", "it")).toBe("l'amico");
  });
});

describe("2 · das türkische Fach: eigenes Fach, kein Rückfall auf de/en", () => {
  it("das Fach ist gross (Übungswortschatz + Nachtrag aus Tatoeba-Originalen), lexikonWoerter(\"tr\") ist es selbst", () => {
    expect(lexikonGroesse().tr).toBeGreaterThan(15000);
    expect(lexikonWoerter("tr").length).toBe(lexikonGroesse().tr);
    // aus dem Sprachpaket (nur über `import()` geladen, nicht im Hauptbündel)
    expect(sprachDaten("tr")?.lexikon[0]).toBe(NACHTRAG_TR);
  });

  it("gewöhnliche Wörter, Wörter mit ç ğ ı ö ş ü, Zirkumflex und Zahlwörter sind echt", () => {
    for (const w of ["kitap", "çocuk", "ağaç", "ışık", "gözlük", "şeker", "güzel", "yürümek", "hâlâ", "kâğıt", "rüzgâr", "merhaba", "teşekkürler", "bugün", "yarın", "için", "sıfır", "dört", "altmış", "milyon", "mi", "mı", "mu", "mü"]) {
      expect(echt(w), w).toBe(true);
    }
  });

  it("Unsinn, Tastenbrei, ASCII-Ersatzformen und Wörter anderer Sprachen sind es nicht - kein Rückfall auf Deutsch oder Englisch", () => {
    for (const w of ["qwxz", "kjhkjh", "dfdf", "kalsaşe", "sagol", "guzel", "agac", "gozluk", "cocuk", "icin", "yarin", "bugun", "house", "haus", "maison", "hello", "danke", "merci"]) {
      expect(echt(w), w).toBe(false);
    }
  });

  it("jedes Wort der Übungswortlisten ist echt (Namen mit Endung über die Regel, einbuchstabige ausgenommen)", () => {
    const alle = [...WORDS_TR, ...Object.values(STUFE_VOCAB_TR).flat()];
    expect(alle.filter((w) => w.length >= 2 && !echt(w))).toEqual([]);
  });

  it("★ gesperrte Wörter stehen NICHT im Fach - die Stimme buchstabiert sie, statt sie ganz zu sprechen; `sık` (gewöhnlich) bleibt ganz", () => {
    for (const w of ["siktir", "sikiş", "orospu", "amcık", "yarrak", "göt", "piç", "bok", "çük", "salak", "aptal", "kör", "özürlü", "atatürk", "bayrak", "allah"]) {
      expect(echt(w), w).toBe(false);
    }
    expect(lexikonWoerter("tr").filter((w) => gesperrtTr(w))).toEqual([]);
    // die Sperre des Lexikons rechnet in RICHTIGER Schreibung (nicht gefaltet): `sık`, `sıkı`, `klasik`, `küçük` werden ganz gelesen
    for (const w of ["sık", "sıkıntı", "klasik", "küçük", "götürmek", "boks", "amca"]) expect(istKernGesperrtTr(w), w).toBe(false);
    for (const w of ["sık", "sıkıntı", "klasik", "küçük", "amca"]) expect(echt(w), w).toBe(true);
  });

  it("★ keine Vornamen im Fach (Tom, Ali, Mehmet: Platzhalter-Namen von Tatoeba) und keine Abkürzungen (km, usb, tv)", () => {
    for (const w of ["tom", "ali", "mehmet", "ahmet", "mustafa", "mary", "km", "usb", "tv", "gb"]) expect(echt(w), w).toBe(false);
  });

  it("de, en, fr, es, it kennen die türkischen Wörter nicht als ihre (jedes Fach ist ein eigenes)", () => {
    for (const l of ["de", "en", "fr", "es", "it"] as const) expect(isRealWord("çocuk", l), l).toBe(false);
    expect(isRealWord("çocuk", "tr")).toBe(true);
  });
});

describe("3 · Namen mit Endung: Ankara'da, Ali'nin, Türkiye'ye sind GANZE Wörter", () => {
  it("Name + Apostroph + eine türkische Endung (Fall, Besitz, Mehrzahl, Hilfswort)", () => {
    for (const w of [
      "Ankara'da", "Ali'nin", "Türkiye'ye", "İstanbul'dan", "Mary'yi", "Anadoluspor'un", "Tom'un", "Almanya'daki", "Kıbrıs'ta", "Ayşe'ye", "Ahmet'in",
      "Berlin'de", "Paris'te", "Rusya'yı", "Fransa'nın", "Zeynep'le", "Elif'in", "Mustafa'dır", "Ankara'ya", "Viyana'da", "Atatürk'ün", "Balkanlar'da",
    ]) {
      expect(echt(w), w).toBe(true);
    }
  });

  it("★ Kopula und Ableitung hinter der Endung (gemessen an Tatoeba: 1,9 % fehlten): Tom'du, Berlin'deydi, İstanbul'dayım, Kanada'lı", () => {
    for (const w of ["Tom'du", "Berlin'deydi", "İstanbul'dayım", "Kanada'lı", "Ankara'dasın", "Almanya'lılar", "Mary'ydi", "Ali'ydi", "Tom'dum"]) {
      expect(echt(w), w).toBe(true);
    }
    for (const w of ["Ali'dxz", "Tom'duzz", "Berlin'deyxz", "Ali'lıx"]) expect(echt(w), w).toBe(false);
  });

  it("die Gegenprobe: ein Unwort hinter dem Apostroph oder ein zu kurzer Name ist kein Name mit Endung", () => {
    for (const w of ["xyz'qwe", "Ali'qwxz", "n'olur", "''", "'", "a'da", "Ali'zzz"]) expect(echt(w), w).toBe(false);
  });

  it("ein als Anführungszeichen benutzter Apostroph stört nicht ('merhaba' ⇒ merhaba)", () => {
    expect(echt("'merhaba'")).toBe(true);
    expect(echt("merhaba'")).toBe(true);
    expect(echt("'xyzq'")).toBe(false);
  });

  it("istApostrofFormTr ist rein: Menge hinein, Antwort heraus", () => {
    const fach = new Set(["merhaba"]);
    expect(istApostrofFormTr("ali'nin", fach)).toBe(true);
    expect(istApostrofFormTr("ankara'da", fach)).toBe(true);
    expect(istApostrofFormTr("istanbul'dan", fach)).toBe(true);
    expect(istApostrofFormTr("ali'xyz", fach)).toBe(false);
    expect(istApostrofFormTr("a'da", fach)).toBe(false); // der Name hat mindestens zwei Buchstaben
    expect(istApostrofFormTr("ali", fach)).toBe(false); // kein Apostroph
    expect(istApostrofFormTr("'merhaba'", fach)).toBe(true); // Anführung
  });
});

describe("4 · Vorlesen: der Plan spricht das ganze Wort an seinem Anfang", () => {
  const m = { letters: false, words: true, sentences: false, lang: "tr" as const };
  const ganz = (zeile: string, index: number) => readPlanAt(zeile, index, m, (t) => isRealWord(t, "tr"));

  it("Wörter mit Sonderbuchstaben am Wortanfang: ganz gesprochen (nicht „ç, o, c, u, k“)", () => {
    expect(ganz("çocuk geldi", 0)).toEqual(["çocuk"]);
    expect(ganz("ağaç yeşil", 0)).toEqual(["ağaç"]);
    expect(ganz("ışık yandı", 0)).toEqual(["ışık"]);
    expect(ganz("bugün hava güzel", 6)).toEqual(["hava"]);
  });

  it("Namen mit Endung: das ganze Wort „Ankara'da“ am Anfang, der Apostroph in der Mitte beim Namen", () => {
    expect(ganz("Ankara'da yaşıyor", 0)).toEqual(["Ankara'da"]);
    expect(ganz("Ankara'da yaşıyor", 6)).toEqual(["kesme işareti"]);
    expect(ganz("Ali'nin evi", 0)).toEqual(["Ali'nin"]);
  });

  it("★ ein Pseudowort wird Buchstabe für Buchstabe gesprochen - mit i und ı als „noktalı i“ und „noktasız ı“", () => {
    expect(ganz("kalşa zede", 0)).toEqual(["k"]);
    expect(ganz("ıkşe zede", 0)).toEqual(["noktasız ı"]);
    expect(ganz("ikşe zede", 0)).toEqual(["noktalı i"]);
    expect(ganz("zeğa", 2)).toEqual(["yumuşak ge"]);
  });
});

describe("5 · Abdeckung: typische Sätze sind weitgehend im Fach (Falle 58 - Lexikon vor den Texten)", () => {
  const SAETZE = [
    "Bugün hava çok güzel ve çocuklar parkta oynuyor.",
    "Annem akşam yemeği için çorba pişirdi.",
    "Öğretmen bize yeni bir hikâye okudu.",
    "Kitapları masanın üzerine koydum.",
    "Yarın sabah erkenden kalkıp denize gideceğiz.",
    "Babam bana yeni bir bisiklet aldı.",
    "Okulumuzun bahçesinde çok güzel çiçekler var.",
    "Kedim sütü çok seviyor ve bütün gün uyuyor.",
    "Arkadaşlarımla birlikte futbol oynamak istiyorum.",
    "Dün akşam televizyonda güzel bir film izledik.",
    "Çantamı evde unuttum, lütfen bana yardım eder misin?",
    "Sınıfımızda yirmi beş öğrenci var.",
    "Hafta sonu ailemle birlikte kampa gideceğiz.",
    "Bu kitabı okumayı çok seviyorum.",
    "Kuşlar sabahları ağaçların üzerinde şarkı söylüyor.",
    "Bahçemizde elma, armut ve kiraz ağaçları yetişiyor.",
    "Doktor bana bol su içmemi söyledi.",
    "Tren saat sekizde istasyondan hareket ediyor.",
    "Komşumuzun köpeği her gün bizim bahçeye geliyor.",
    "Yeni telefonumun ekranı çok büyük.",
  ];

  const woerter = SAETZE.flatMap((satz) => satz.split(/\s+/)).filter((t) => normalizeWord(t, "tr").length >= 2);

  it("Messwert: mindestens 80 % aller Wörter der Beispielsätze stehen im Fach (Wortformen mit mindestens zwei Tatoeba-Belegen, Wörterbuch bestätigt)", () => {
    const gedeckt = woerter.filter((t) => echt(t)).length;
    expect(woerter.length).toBeGreaterThan(100);
    expect(gedeckt / woerter.length).toBeGreaterThan(0.8);
  });

  it("die Grundwörter (ohne seltene Beugungen) sind alle echt: die häufigsten Formen eines türkischen Satzes fehlen nie", () => {
    for (const w of ["bugün", "hava", "çok", "güzel", "ve", "parkta", "annem", "için", "çorba", "bir", "yeni", "var", "bana", "çok", "bütün", "gün", "bu", "her", "bizim", "saat", "ekran", "doktor", "su", "film", "futbol", "elma", "armut", "kiraz", "tren", "köpek"]) {
      expect(echt(w), w).toBe(true);
    }
  });

  it("die Prüfung findet etwas: ein Satz mit einem Unwort wird gemeldet", () => {
    const ws = "Kedi qwxzk uyuyor ve çok güzel".split(" ");
    expect(ws.filter((w) => !isRealWord(w, "tr"))).toEqual(["qwxzk"]);
  });
});
