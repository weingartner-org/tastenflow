/**
 * ★★★★★ WÄCHTER F5-tr (03.10.2026): DIE REGELN FÜR JEDE TÜRKISCHE TEXTZEILE - schon heute scharf, obwohl der Korpus noch leer ist.
 *
 * Die Text-Chargen der Etappe T schreiben die eigentlichen Zeilen; dieser Wächter steht VORHER da (Falle 58/59: der Fehlerkatalog gehört
 * in den Auftrag UND als Wächter in den Bau). Er prüft jede Zeile von `CORPUS_TR` und jeder türkischen Serie gegen die Regeln aus dem
 * Glossar (§1 Regeln 5-9, §4 Fallen) und dem Befund F4-tr (Apostroph an Platz 30), und hat seine Gegenproben: ein Wächter, der nichts
 * findet, beweist nichts. Vorbild: `tests/tastenflow-it-texte-regeln.test.ts`.
 *
 * Solange es keine Zeilen gibt, prüft er nur die Funktion {@link zeilenFehler} an Beispielen - sobald die erste Charge gemergt ist, greift er
 * ohne Änderung. Eine Regel kommt HIER hinein, wenn eine Charge gegen sie verstösst, nicht erst im Prüfbericht.
 */
import { describe, expect, it } from "vitest";
import { korpusFuer } from "../src/lib/typing/corpus";
import { SERIEN } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import { zeilenFehler } from "./helfer/trTextRegeln";

describe("zeilenFehler: die Regeln, an Beispielen mit Gegenprobe", () => {
  it("richtige Zeilen bestehen (Namen mit Endung, İ und I, Zahlen, Anführung, Zirkumflex)", () => {
    for (const z of [
      "Ali'nin kardeşi İstanbul'da yaşıyor.",
      "İki arkadaş Ankara'dan geldi.",
      "Işık yanınca kuşlar uçtu.",
      "Irmak kenarında üç çocuk oynuyor.",
      "\"Merhaba!\", dedi Ayşe, ve koşarak gitti.",
      "Tren saat 08:15 olunca kalkıyor mu?",
      "Dükkân hâlâ açık, kâğıt bitti.",
      "Sınıfta 25 öğrenci var, %95 doğru yazdı.",
      "Kitap ₺150, çanta €12 ve defter 12.345 kelime tutuyor.",
      "Okulda 5 hata yaptım.",
      "Türkiye'ye hoş geldin.",
    ]) {
      expect(zeilenFehler(z), z).toEqual([]);
    }
  });

  it("jede Regel findet ihren Fehler (Gegenprobe - sonst bewiese der Wächter nichts)", () => {
    const FALSCH: readonly (readonly [string, RegExp])[] = [
      ["Ali’nin evi büyük.", /Zeichen/],
      ["O « merhaba » dedi.", /Zeichen/],
      ["Ders bitti…", /Zeichen/],
      ["Sıcaklık 20° oldu.", /Zeichen/],
      ["Zeile mit ä in der Mitte.", /Buchstabe/],
      ["Ein Satz mit ñ.", /Buchstabe/],
      ["- Nereye gidiyorsun? dedi.", /Dialogstrich/],
      ["Nereye gidiyorsun ?", /Leerzeichen vor/],
      ["Iki arkadaş geldi.", /„I“ vor einem vorderen Vokal/],
      ["Iyi günler diledi.", /„I“ vor einem vorderen Vokal/],
      ["Internet bağlantısı yok.", /„I“ vor einem vorderen Vokal/],
      ["Cocuk okula gitti.", /ASCII-Ersatz/],
      ["Bu guzel bir gun.", /ASCII-Ersatz/],
      ["Icin cok yorgunum.", /ASCII-Ersatz/],
      ["Ankara 'da yaşıyor.", /Apostroph ohne Buchstaben/],
      ["Evde 'merhaba' dedi.", /Apostroph/],
      ["kitap'ı okudu.", /Apostroph an einem klein/],
      ["Mart'ta okul başlıyor.", /Monats- oder Tagesnamen/],
      ["Pazartesi'ye kadar bekle.", /Monats- oder Tagesnamen/],
      ["3'ü ve 6'yı topla.", /Apostroph an einer Zahl/],
      ["Başarı 95 % oldu.", /Prozentzeichen hinter/],
      ["Başarı 95% oldu.", /Prozentzeichen hinter/],
      ["Defter 150 ₺ tutuyor.", /Währung hinter/],
      ["Bilet 5 € ve su 2 $.", /Währung hinter/],
      ["Şehirde 12345 kişi yaşıyor.", /fünf Stellen/],
      ["Sınıfta 5 öğrenciler var.", /Mehrzahl nach einer Zahl/],
      ["Bugün 3 hatalar yaptım.", /Mehrzahl nach einer Zahl/],
      ["Atatürk'ün resmi duvarda.", /Staatssymbol/],
      ["Okulun bayrağı direkte.", /Staatssymbol/],
      ["İnşallah yarın gelirim.", /religiös/],
      ["Şehit olmuş.", /religiös/],
      ["Düğmeye tıkla ve bekle.", /Maus-Wort/],
      ["Kutuyu sürükle.", /Maus-Wort/],
      ["Abla bana yardım etti.", /Anredewort/],
      ["Hanım Teyze geldi.", /Anredewort/],
      ["Kör çocuk okula gitti.", /Etikett/],
      ["O bir özürlü çocuk.", /Etikett/],
      ["Orospu dedi.", /Sperrwort/],
      ["Bu sikik şey.", /Sperrwort/],
      ["Çok  boşluk var.", /Leerzeichen/],
      ["İ".toLowerCase() + " noktası", /Kombinationspunkt/],
    ];
    for (const [zeile, regel] of FALSCH) {
      expect(zeilenFehler(zeile).join(" | "), zeile).toMatch(regel);
    }
  });

  it("Namen mit Endung sind KEIN Fehler, ein loser oder klein stehender Apostroph schon; Zirkumflex-Wörter und Zahlen mit Punkt sind in Ordnung", () => {
    expect(zeilenFehler("Zeynep'in annesi Kıbrıs'tan geldi.")).toEqual([]);
    expect(zeilenFehler("Ev ' büyük.")).not.toEqual([]);
    expect(zeilenFehler("O, hâlâ kâr eder mi?")).toEqual([]);
    expect(zeilenFehler("Dünyada 1.234.567 insan var.")).toEqual([]);
    expect(zeilenFehler("Yıl 1985 idi.")).toEqual([]);
  });

  it("Harmlose Wörter mit Teilen der Sperrliste bestehen (klasik, küçük, götürmek, amca, tamına varmak)", () => {
    for (const z of ["Klasik müzik dinledik.", "Küçük kedi uyudu.", "Çantayı eve götürmek istiyor.", "Amcam bize geldi.", "Çocuklar boks izledi."]) {
      expect(zeilenFehler(z), z).toEqual([]);
    }
  });
});

describe("jede Zeile des türkischen Korpus und der türkischen Serien besteht diese Regeln", () => {
  const korpus = korpusFuer("tr").map((i) => i.text);
  const serien = SERIEN.filter((s) => s.lang === "tr").flatMap((s) => serieLines(s));

  it("Korpus (heute leer - sobald die erste Charge gemergt ist, greift der Wächter ohne Änderung)", () => {
    const verstoesse = korpus.flatMap((z) => zeilenFehler(z).map((f) => `„${z}“: ${f}`));
    expect(verstoesse.slice(0, 20)).toEqual([]);
  });

  it("Serien mit lang tr", () => {
    const verstoesse = serien.flatMap((z) => zeilenFehler(z).map((f) => `„${z}“: ${f}`));
    expect(verstoesse.slice(0, 20)).toEqual([]);
  });

  it("der türkische Korpus trägt NUR eigene Zeilen (nurWeg tr) - nie fremde Sätze", () => {
    expect(korpusFuer("tr").filter((i) => i.nurWeg !== "tr")).toEqual([]);
  });
});
