/**
 * ★ F5-F8 Türkisch (03.10.2026): die häufigen Buchstabenverbindungen des Türkischen für das Geläufigkeitsschreiben
 * (`gelaeufigkeit.ts`) - neu gewählt, nicht übertragen. Bis hierher stand für `tr` das ENGLISCHE `VERBINDUNGEN_EN`
 * (RÜCKFALL-EN, G2a): jede adaptive Runde („Mein Training") hängt eine Geläufigkeits-Zeile an, ein Kind auf Weg „tr" hätte
 * darin „education station action nation" geschrieben.
 *
 * Gewählt nach dem, was das Türkische über seine Schreibung ausmacht und was Zehnfingerschreiben automatisiert:
 *  · die ENDUNGEN, die jedes zweite Wort trägt (*-lar -ler*, *-mak -mek*, *-yor*, *-lık -lik -luk*, *-cı -ci -çı -çi*, *-sız -siz*,
 *    *-lı -li -lu*) - die Vokalharmonie macht aus einer Endung zwei bis vier Fingerfolgen, jede bekommt ihre eigene Zeile;
 *  · die Buchstaben, die es im Deutschen nicht gibt (*ç ş ğ ı*) in ihrer häufigsten Nachbarschaft (*çı ça çi ço*, *şe şa şi*,
 *    *ağ oğ eğ*, *-ş am Wortende*) - ein Kind übt `ğ` nie allein, es steht zwischen Vokalen;
 *  · die Umlaut-Anfänge (*öğ gü dü kü yü*: öğrenci, güneş, dünya, küçük, yüz) und zwei Anfänge mit `ay`, `ay` und die
 *    Doppelung `tt` (gitti, bitti).
 *
 * Alle Wörter klein (türkische Nomen werden nicht grossgeschrieben), echte Alltagswörter in TDK-Schreibung, bestehen das macOS-
 * Wörterbuch für Türkisch (`scripts/woerterbuch-macos.js`, Vorsilbe `tr:`, kleine UND türkisch grosse Form) und die Sperrliste
 * (`sperrlisteTr.ts`, auch gefaltet; darum kein *sık*, *şık*, *sikke*). Wächter: `tests/tastenflow-tr-woerter.test.ts`
 * (jede Verbindung steht am angegebenen Ort in jedem Wort, kein Wort gesperrt, mindestens sechs Wörter).
 * ★ TR-W (09.10.2026): fünf Wörter ersetzt - `ayı ⇒ aynı`, `keçi ⇒ kek` (Tiernamen, die im Türkischen auch Schimpfwörter gegen
 * Menschen sind: in einer Wortreihe ohne Zusammenhang ein Witz auf Kosten des Kindes), `şarap ⇒ şampuan` (Alkohol), `çıplak` (nackt)
 * ⇒ `çıkmaz`, `göğüs ⇒ gölge` (Doppelsinn). Dieselbe Regel wie in `wortkettenTr.ts`; Wächter `tests/tastenflow-wortspiele-tr.test.ts`.
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_TR: Verbindung[] = [
  { folge: "lar", stelle: "ende", woerter: ["kitaplar", "kuşlar", "balıklar", "arabalar", "çocuklar", "ağaçlar", "yıldızlar", "masalar", "kapılar", "tavşanlar", "kartallar"] },
  { folge: "ler", stelle: "ende", woerter: ["çiçekler", "kediler", "evler", "gözler", "dişler", "günler", "kalemler", "eller", "defterler", "köpekler", "meyveler", "öğrenciler"] },
  { folge: "mak", stelle: "ende", woerter: ["yapmak", "okumak", "yazmak", "oynamak", "bakmak", "almak", "bulmak", "durmak", "koşmak", "kapatmak", "uyumak", "çalışmak"] },
  { folge: "mek", stelle: "ende", woerter: ["gelmek", "gitmek", "görmek", "sevmek", "vermek", "bilmek", "gülmek", "yemek", "ekmek", "demek", "beklemek", "düşünmek"] },
  { folge: "yor", stelle: "ende", woerter: ["geliyor", "yapıyor", "okuyor", "biliyor", "gidiyor", "oynuyor", "yazıyor", "bakıyor", "görüyor", "koşuyor", "bekliyor", "çalışıyor"] },
  { folge: "lık", stelle: "ende", woerter: ["kitaplık", "karanlık", "aydınlık", "arkadaşlık", "kahvaltılık", "sıcaklık", "hastalık", "yalnızlık", "yaşlılık"] },
  { folge: "luk", stelle: "ende", woerter: ["tuzluk", "dostluk", "mutluluk", "çocukluk", "kuşluk", "yolluk", "boyunluk"] },
  { folge: "lik", stelle: "ende", woerter: ["kalemlik", "güzellik", "birlik", "temizlik", "iyilik", "çiçeklik", "dişlik"] },
  { folge: "siz", stelle: "ende", woerter: ["sessiz", "evsiz", "çaresiz", "şekersiz", "işsiz", "kedisiz", "dişsiz"] },
  { folge: "suz", stelle: "ende", woerter: ["uykusuz", "tuzsuz", "yolsuz", "korkusuz", "sorunsuz", "sonsuz"] },
  { folge: "çı", stelle: "anfang", woerter: ["çıktı", "çıkmak", "çıkar", "çınar", "çırak", "çıngırak", "çıkış", "çıkmaz"] },
  { folge: "ça", stelle: "anfang", woerter: ["çanta", "çay", "çatı", "çabuk", "çalışmak", "çarşı", "çaydanlık", "çalı", "çağ"] },
  { folge: "çi", stelle: "anfang", woerter: ["çiçek", "çilek", "çizgi", "çift", "çiftçi", "çivi", "çizmek", "çimen"] },
  { folge: "ço", stelle: "anfang", woerter: ["çocuk", "çorba", "çorap", "çok", "çocuklar", "çoban", "çorapları"] },
  { folge: "çe", stelle: "anfang", woerter: ["çember", "çeşit", "çerçeve", "çelik", "çeyrek", "çekmek", "çene", "çeviri"] },
  { folge: "şe", stelle: "anfang", woerter: ["şeker", "şehir", "şekil", "şemsiye", "şeftali", "şeref", "şenlik", "şerit"] },
  { folge: "şa", stelle: "anfang", woerter: ["şaka", "şal", "şarkı", "şapka", "şampuan", "şafak", "şaşkın", "şahin"] },
  { folge: "ş", stelle: "ende", woerter: ["kaş", "baş", "diş", "kuş", "taş", "yaş", "ateş", "güneş", "arkadaş", "kardeş"] },
  { folge: "ağ", stelle: "mitte", woerter: ["ağaç", "ağız", "ağır", "ağlamak", "dağ", "bağ", "sağ", "yağmur", "kurbağa", "ayağa"] },
  { folge: "oğ", stelle: "mitte", woerter: ["doğru", "doğum", "oğlu", "soğuk", "soğan", "yoğurt", "boğaz", "doğa"] },
  { folge: "eğ", stelle: "mitte", woerter: ["değil", "eğer", "eğitim", "değer", "beğen", "eğlence", "değişik", "eğlenmek"] },
  { folge: "öğ", stelle: "anfang", woerter: ["öğrenci", "öğretmen", "öğle", "öğrenmek", "öğün", "öğretmek", "öğrendi", "öğrenciler"] },
  { folge: "gü", stelle: "anfang", woerter: ["güneş", "güzel", "gün", "güç", "gül", "güven", "gülmek", "güvercin", "güney"] },
  { folge: "dü", stelle: "anfang", woerter: ["dün", "dünya", "düğün", "düz", "düşünmek", "düzgün", "düğme", "düşmek"] },
  { folge: "kü", stelle: "anfang", woerter: ["küçük", "kütüphane", "kürek", "küp", "kül", "külah", "küre", "küçüklük"] },
  { folge: "yü", stelle: "anfang", woerter: ["yüz", "yüzmek", "yürümek", "yürek", "yük", "yüzük", "yüksek", "yüzme"] },
  { folge: "ay", stelle: "anfang", woerter: ["ayak", "ayna", "ayran", "aynı", "aylık", "ayakkabı", "aydınlık", "ayva"] },
  { folge: "tt", stelle: "mitte", woerter: ["gitti", "bitti", "attı", "ettik", "yattı", "sattı", "ettim", "ettin", "kattı"] },
  { folge: "ar", stelle: "mitte", woerter: ["kardeş", "araba", "karanlık", "arkadaş", "bardak", "tarak", "yarım", "karpuz", "kartal", "tarla", "marul"] },
  { folge: "ey", stelle: "mitte", woerter: ["şey", "meyve", "deyim", "keyif", "teyze", "beyaz", "ceylan"] },
  { folge: "ka", stelle: "anfang", woerter: ["kalem", "kasa", "kapı", "kaşık", "kar", "kardeş", "kahve", "kaplan"] },
  { folge: "ke", stelle: "anfang", woerter: ["kedi", "kese", "kelime", "kelebek", "kek", "kemer", "kerpiç"] },
  { folge: "ba", stelle: "anfang", woerter: ["baba", "bal", "balık", "bardak", "bahçe", "bacak", "baş", "bakkal"] },
  { folge: "gö", stelle: "anfang", woerter: ["göz", "göl", "gökyüzü", "gömlek", "görmek", "gölge", "göç", "gözlük"] },
];
