import type { InhaltsStufe } from "./account";

/**
 * Türkische Wortliste (Kleinschreibung, TDK-Schreibung) - das Gegenstück zu `WORDS` (`words.ts`), `WORDS_EN` (`corpusEn.ts`),
 * `WORDS_FR` (`wordsFr.ts`), `WORDS_ES` (`wordsEs.ts`) und `WORDS_IT` (`wordsIt.ts`) für den Generator (Wort-Drill,
 * Zeichen-Zeilen) und für die Übungsformen, die ihren Vorrat über `wortquelle()`/`wortpool()` (`uebungsformen/hilfen.ts`) ziehen.
 *
 * ★ F5-F8 Türkisch (03.10.2026, Bauplan vier Sprachen, Etappe F6): bis hierher gab `wortquelle("tr")` und `WORD_BASE.tr` das
 * ENGLISCHE `WORDS_EN` (Marke `RÜCKFALL-EN (G2a)`) - eine türkische Übungszeile bestand dann aus englischen Wörtern. Diese Liste
 * ersetzt sie.
 *
 * ── Herkunft (GEMESSEN und ausgewählt, nichts roh übernommen) ─────────────────────────────────────────────────────
 * 1. `scripts/messe-worthaeufigkeit-tr.mts` zählt die Wortformen der türkischen Tatoeba-ORIGINALSÄTZE
 *    (`tur_sentences_base.tsv.bz2`: Spalte 2 = „0" ⇒ Original, 47.104 Sätze, 48.187 Wortformen - Übersetzungen zählen NICHT,
 *    Johannes' Regel „nichts wird übersetzt"; keine zusätzliche Wortliste geladen). Klein wird mit dem Gebietsschema `tr`
 *    geschrieben (`İ ⇒ i`, `I ⇒ ı`); Endungen hinter einem Apostroph (`Ali'nin`) zählen nicht als Wörter (sonst stünden `nin`,
 *    `yı`, `yi` unter den häufigsten „Wörtern"). Tatoeba ist kein Kinderkorpus: Serien einzelner Beitragender stehen weit oben
 *    (`ziyaret`, `ilçesi`, `bağlıdır`, `anadoluspor`) - die Zählung dient als BELEG, dass ein Wort in Gebrauch ist.
 * 2. Die Liste besteht aus 604 von Hand gewählten Alltags- und Kinderwörtern (Familie, Körper, Haus, Schule, Tiere, Natur,
 *    Essen, Verkehr, Zahlen, Farben, Verben, Adjektive) PLUS 603 Wortformen aus der Messung (Mindesthäufigkeit 2, höchstens drei
 *    Formen je Wortanfang, Kontingent je Sprosse von `TR_LETTER_ORDER` - sonst füllen die häufigen Buchstaben `e i n a r` allein
 *    die ganze Liste und `ğ v p c ö` blieben ohne Wort), dazu 73 Namen mit Endung (Sprosse `'`). Ergebnis: 1.280 Wörter, geordnet
 *    nach der Sprosse, an der sie vollständig tippbar werden (Zahl in Klammern = Wörter der Gruppe).
 * 3. JEDES Wort besteht das macOS-Wörterbuch für Türkisch (`NSSpellChecker`, `scripts/woerterbuch-macos.js` mit der Vorsilbe `tr:`)
 *    in kleiner UND türkisch grossgeschriebener Form (`iyi ⇒ İyi`) - ⚠️ ein HALBES Wörterbuch (gemessen: es nimmt `dfdf`, `ıyı` und
 *    ASCII-Formen wie `cocuk`/`yarin`/`icin` an, lehnt `sagol`, `guzel`, `agac` und Tastenbrei in Grossschreibung ab): als Beleg
 *    taugt nur eine ABLEHNUNG. Darum zusätzlich: keine reine ASCII-Form, wenn es eine häufigere Form mit Sonderbuchstaben gibt
 *    (`sagol` gegen `sağol`), und nichts auf der Sperrliste (`sperrlisteTr.ts`: Kern UND Wortbasis, auch im gefalteten Text
 *    `ı→i ş→s …`) oder unter den unerwünschten Themenwörtern (`TR_WORTLISTE_UNERWUENSCHT`: Gewalt, Strafe, Streit, Militär).
 *    Wächter: `tests/tastenflow-tr-woerter.test.ts`.
 *
 * ── Eigenschaften, die der Generator braucht ─────────────────────────────────────────────────────────────────────
 *  · `ı` und `i` sind ZWEI Einheiten auf zwei Tasten (Sprosse 15 und 10): ein Wort mit `ı` kommt erst mit dieser Einheit, es gibt
 *    keinen Ersatz (`ılık/ilik`, `sık/sik`, `kır/kir` sind andere Wörter). Dasselbe für `ş ğ ç ö ü`.
 *  · Wörter mit `â î û` (nur eine kleine, TDK-geschriebene Gruppe: `hâlâ`, `kâğıt`, `rüzgâr`) kommen erst, wenn die Totaste `^` UND
 *    der Vokal gelernt sind (Sprosse 31, `totastenZiele`).
 *  · Der Apostroph `'` ist Einheit Nr. 30 (nur mit Umschalt + 2 tippbar). Er steht NUR an Eigennamen (`Ankara'da`, `Ali'nin`); die
 *    Liste führt sie in Kleinschreibung, der Generator setzt den Anfangsbuchstaben gross (türkisch gerechnet: `istanbul'a ⇒
 *    İstanbul'a`). Keine Monatsnamen mit Apostroph (TDK: an Monats- und Tagesnamen steht kein Kesme).
 *  · Keine Eigennamen ohne Endung, keine Wörter mit `ä ß` (auf `tr-q` nicht tippbar), nichts, was die Sperrliste trifft - weder in
 *    richtiger noch in gefalteter Schreibung. Kein Wort mit Atatürk, Bayrak oder Religion; keine Wörter, die gegen ein Kind lesen.
 *  · Kleinschreibung durchgehend; die Grossschreibung am Zeilenanfang setzt der Generator (`SENTENCE_CAP`).
 *
 * Grob geordnet nach der Sprosse, an der ein Wort vollständig tippbar wird.
 */
export const WORDS_TR: string[] = [
  // Grundreihe f j d k s l a (31)
  "kal", "sal", "saf", "fal", "ala", "kasa", "sakal", "dal",
  "kafa", "ada", "da", "asla", "laf", "al", "akla", "ak",
  "la", "as", "kala", "kalk", "lak", "kask", "dala", "kasada",
  "fa", "kalsa", "alaka", "kafada", "klas", "aksak", "kalka",
  // ş (7)
  "kaş", "şal", "şaka", "şafak", "aşk", "aşka", "flaş",
  // e (28)
  "sade", "kale", "kese", "sedef", "lale", "eşek", "sel", "dede",
  "el", "de", "keşke", "ses", "defa", "ele", "elde", "dek",
  "elle", "kes", "ek", "le", "kalede", "esas", "kafede", "eş",
  "sesle", "leke", "sadede", "dese",
  // i (41)
  "eski", "kedi", "kil", "sesli", "dikiş", "diş", "dil", "fil",
  "kesik", "aile", "iki", "elli", "dakika", "ekşi", "ile", "ki",
  "ilk", "iş", "ise", "kişi", "işi", "şekilde", "işe", "edildi",
  "dili", "ifade", "dedi", "idi", "eksik", "ikisi", "sesi", "eli",
  "dile", "eşi", "dakikada", "kesildi", "şişe", "lise", "ikili", "lisede",
  "eskisi",
  // n (44)
  "sinek", "nane", "ilan", "anne", "nine", "seksen", "nisan", "aslan",
  "inek", "fidan", "anneanne", "ne", "en", "sen", "neden", "sana",
  "seni", "senin", "insan", "kendi", "kendini", "seninle", "kendine", "an",
  "senden", "işin", "anda", "eskiden", "eden", "ana", "edin", "sensin",
  "kalan", "eline", "alan", "kan", "kesin", "annesi", "elinden", "işini",
  "sene", "nedeni", "kesinlikle", "sende",
  // m (45)
  "elma", "ekmek", "sinema", "selam", "kelime", "kalem", "kalemlik", "masa",
  "mendil", "minik", "ekim", "akşam", "almak", "dinlemek", "kesmek", "masal",
  "ama", "misin", "kim", "şimdi", "adam", "kimse", "demek", "film",
  "kimin", "emin", "kime", "maalesef", "annem", "anlamak", "mesaj", "demiş",
  "kalmak", "kimi", "madem", "mesele", "şimdilik", "kalma", "filmi", "dedim",
  "elimden", "filmin", "eminim", "kimden", "adama",
  // b (46)
  "elbise", "lamba", "baba", "bebek", "bina", "bal",
  "banka", "beş", "bin", "kelebek", "balina", "kabak", "babaanne", "baş",
  "bilmek", "bakmak", "başlamak", "beklemek", "bakkal", "ben", "bana", "beni",
  "benim", "bile", "başka", "benden", "benimle", "belli", "belki", "bak",
  "babam", "bende", "bilen", "sebebi", "be", "başa", "kalbimi", "bilmem",
  "baban", "kalbini", "bekledim", "bakan", "bakma", "bil",
  // r (52)
  "kardeş", "biber", "mermer", "misafir", "resim", "renk", "rakam", "rafa",
  "raf", "bir", "fare", "kar", "dere", "makarna", "şeker", "nar",
  "erik", "ders", "ekran", "arkadaş", "bardak", "araba", "aramak", "kamera",
  "berber", "kadar", "biri", "insanlar", "nedir", "nerede", "karar", "eder",
  "neler", "merak", "fark", "beri", "nereden", "işler", "erken", "birini",
  "ederim", "ara", "kara", "erkek", "arada", "dilerim", "edebilir", "beraber",
  "kere", "aralar", "lira", "birisi",
  // ı (52)
  "sandık", "ıslak", "ışık", "ırmak", "sarı", "sıra", "sınıf", "sır",
  "kırk", "salı", "kasım", "aralık", "balık", "arı", "karın", "kaşık",
  "kısa", "akıllı", "karanlık", "fırın", "barış", "şarkı", "mı", "nasıl",
  "aldı", "karşı", "kaldı", "başladı", "mısın", "kadın", "aldım", "aslında",
  "insanların", "farklı", "başına", "arasında", "lafı", "adamı", "bırak", "alır",
  "ardından", "sakın", "asıl", "adı", "sanırım", "dışarı", "adını", "kalmadı",
  "adım", "dışında", "sırada", "anlamı",
  // t (61)
  "defter", "bisiklet", "bilet", "sırt", "tarla", "tarak", "tabak", "tatlı",
  "tatil", "tilki", "tren", "altı", "altmış", "mart", "saat", "at",
  "kartal", "martı", "taş", "simit", "salatalık", "şeftali", "taksi", "bitirmek",
  "atlamak", "tırmanmak", "sert", "atkı", "etek", "market", "tamam", "artık",
  "tek", "fakat", "etti", "ettin", "etmek", "ettiler", "tam", "etmedin",
  "etmediler", "attı", "et", "tekrar", "takım", "işte", "birlikte", "ister",
  "dikkat", "altında", "temel", "katıldı", "satın", "terk", "kitabı", "kart",
  "bitti", "etsin", "destek", "tane", "basit",
  // y (63)
  "ray", "yarım", "yastık", "yatak", "yelek", "yemek", "yıl", "yelken",
  "yedi", "yirmi", "yetmiş", "mayıs", "yeşil", "yarın", "saniye", "ayı",
  "yarasa", "leylek", "yılan", "ay", "ayran", "kayısı", "sayfa", "sayı",
  "dayı", "ayak", "sandalye", "battaniye", "ayna", "kaybetmek", "iyi", "yeni",
  "aydınlık", "şemsiye", "ayakkabı", "bayram", "itfaiye", "şey", "ya", "yardım",
  "diye", "yine", "şeyi", "yer", "şeyler", "aynı", "miyim", "yanlış",
  "niye", "yere", "yerde", "yerine", "kimseye", "yaklaşık", "kimseyi", "yaşamak",
  "şeye", "yakın", "yarı", "şeyin", "nereye", "yılında", "yanında",
  // o (62)
  "salon", "radyo", "robot", "rota", "yol", "oda", "orman", "ot",
  "ok", "olta", "on", "doksan", "mor", "domates", "limon", "basketbol",
  "kol", "banyo", "motosiklet", "kamyon", "metro", "istasyon", "olmak", "oynamak",
  "koşmak", "sormak", "boyamak", "kolay", "komik", "boş", "telefon", "balon",
  "lokanta", "doktor", "yok", "olan", "sonra", "olarak", "son", "ona",
  "onlar", "yoksa", "ediyor", "olsa", "biliyor", "olabilir", "milyon", "istiyor",
  "orada", "ondan", "sona", "olmadı", "yolda", "ol", "yaşıyor", "onlara",
  "onları", "bekliyor", "alıyor", "orta", "bekleniyor", "olay",
  // u (⇧ folgt) (75)
  "fasulye", "mutfak", "mutlu", "tuş", "yumurta", "okul", "okumak", "oyun",
  "uyku", "uyumak", "unutmak", "un", "ufak", "umut", "şubat", "kuş",
  "maymun", "yunus", "koyun", "kurt", "baykuş", "bulut", "kum", "su",
  "lokum", "dondurma", "armut", "futbol", "koşu", "komşu", "kulak", "burun",
  "boyun", "koltuk", "durak", "konuşmak", "bulmak", "dolu", "yumuşak", "kuru",
  "mum", "dostluk", "mutluluk", "bu", "mu", "onu", "bunu", "oldu",
  "olur", "istiyorum", "onun", "burada", "musun", "olsun", "şu", "bunun",
  "istemiyorum", "biliyorum", "onunla", "kabul", "buna", "durum", "ediyorum", "buraya",
  "konuda", "oluyor", "sorun", "bunlar", "bilmiyorum", "bundan", "durumda", "yoktu",
  "sonunda", "olmuş", "biliyorsun",
  // z (59)
  "deniz", "kırmızı", "kızıl", "tuz", "yazı", "yazmak", "yıldız", "uzak",
  "uzun", "zaman", "zafer", "zarf", "zeytin", "zebra", "zil", "zemin",
  "sekiz", "dokuz", "otuz", "temmuz", "beyaz", "kiraz", "muz", "teyze",
  "kuzen", "omuz", "diz", "kazanmak", "zor", "tuzlu", "temiz", "kazak",
  "terzi", "siz", "fazla", "biraz", "size", "biz", "lazım", "bazı",
  "az", "olmaz", "bize", "sizin", "bazen", "sizi", "izin", "misiniz",
  "bizi", "bizim", "musunuz", "kız", "kez", "zaten", "yalnız", "zorunda",
  "mısınız", "miyiz", "kazandı",
  // ç (63)
  "salça", "ilaç", "uçak", "uçmak", "uçurtma", "çanta", "çatı", "çay",
  "çaydanlık", "çiçek", "çilek", "çorba", "çatal", "çizmek", "çalışmak", "çim",
  "çukur", "çember", "çanak", "çarşamba", "keçi", "serçe", "çayır", "çikolata",
  "reçel", "saç", "bıçak", "içmek", "açmak", "çiftçi", "aşçı", "çok",
  "için", "kaç", "maç", "çıktı", "içinde", "açık", "içti", "birkaç",
  "çalışıyor", "birçok", "çekti", "maçı", "çıkar", "açtı", "maçın", "iç",
  "maçta", "aç", "seçim", "kaçtı", "çabuk", "araç", "sonuç", "maça",
  "çalıştı", "çek", "çayı", "içine", "içeri", "açıdan", "çıkardı",
  // h (58)
  "rahat", "tahta", "haber", "hafta", "harita", "harf", "hasta", "hamur",
  "hamam", "hediye", "hırka", "hızlı", "horoz", "hurma", "huzur", "haziran",
  "siyah", "sabah", "timsah", "nehir", "tohum", "nohut", "bahçe", "hala",
  "halı", "hafif", "anahtar", "hastane", "hemşire", "hayal", "merhaba", "hayır",
  "daha", "her", "hiç", "hiçbir", "herkes", "hayat", "hakkında", "hem",
  "hemen", "hata", "hakem", "hak", "hoş", "herkesin", "herkese", "hazır",
  "hayatta", "sahibi", "tahmin", "hadi", "hakkı", "harika", "rahatsız", "haklı",
  "halk", "hissediyorum",
  // g (47)
  "silgi", "bilgi", "çizgi", "gazete", "gemi", "gezi", "gitar", "gurur",
  "gurbet", "gri", "salyangoz", "geyik", "bilgisayar", "gelmek", "gitmek", "saygı",
  "hangi", "gibi", "geldi", "gerek", "gerçekten", "geri", "gitti", "geliyor",
  "gelir", "geç", "gerekiyor", "geçti", "gelen", "gol", "geçen", "ilgili",
  "gel", "gerçek", "genelde", "gidiyor", "girdi", "galiba", "gereken", "git",
  "geldim", "hangisi", "gider", "gelmiş", "engel", "genç", "geldin",
  // ğ (48)
  "ağaç", "ağız", "ağlamak", "ağabey", "ağır", "dağ", "bağ", "bağış",
  "çağ", "doğa", "doğru", "yağmur", "sağlık", "sağ", "soğuk", "yoğurt",
  "ağustos", "kurbağa", "tereyağı", "soğan", "fotoğraf", "değil", "olduğunu", "olduğu",
  "değilim", "değiller", "eğer", "diğer", "doğum", "çoğu", "yemeği", "rağmen",
  "istediğim", "gerçeği", "dediğin", "ekmeği", "değeri", "attığı", "değer", "doğruyu",
  "eğitim", "kırıklığına", "ayağına", "eğlenmeye", "bağlı", "ayağa", "aldığı", "oğlu",
  // ü (59)
  "müzik", "rüya", "yüzmek", "yürümek", "otobüs", "zürafa", "gül", "gülmek",
  "gün", "güneş", "güzel", "ürün", "üzüm", "üç", "ütü", "ülke",
  "üst", "ün", "üye", "üretmek", "yüz", "eylül", "bugün", "dün",
  "süt", "teneffüs", "müdür", "yüzme", "düşünmek", "büyük", "küçük", "üzgün",
  "güçlü", "günaydın", "teşekkürler", "lütfen", "tüm", "bütün", "dünya", "günü",
  "çünkü", "mü", "henüz", "yüksek", "yüzden", "yüzde", "yüzünden", "dünyada",
  "düştü", "üzerinde", "ülkede", "teşekkür", "üstüne", "dünyanın", "mümkün", "düşünüyorum",
  "sürekli", "süre", "üzerine",
  // v (63)
  "merdiven", "meyve", "mevsim", "mavi", "takvim", "tavuk", "tavşan", "ova",
  "zirve", "çuval", "hava", "hayvan", "vazo", "vadi", "vatan", "vakit",
  "varmak", "vermek", "ev", "eve", "evet", "evrak", "kahverengi", "deve",
  "baklava", "havuç", "kavun", "vişne", "kahve", "kahvaltı", "klavye", "voleybol",
  "duvar", "sevmek", "yavaş", "eldiven", "televizyon", "sevgi", "ve", "var",
  "devam", "verdi", "vardı", "seviyorum", "evde", "versin", "varsa", "sever",
  "avro", "veya", "verir", "ver", "sevdiğim", "severim", "veriyor", "devlet",
  "verdim", "seviyor", "varmış", "veren", "vurdu", "güven",
  // p (78)
  "mektup", "tepe", "top", "toprak", "yaprak", "çorap", "vapur", "pamuk",
  "pasta", "patates", "peynir", "pembe", "pilav", "pirinç", "portakal", "pul",
  "pazar", "park", "plaj", "pantolon", "papatya", "papağan", "parmak", "pastane",
  "penguen", "piyano", "pazartesi", "perşembe", "kaplan", "kaplumbağa", "kirpi", "kebap",
  "pide", "ıspanak", "karpuz", "kitap", "kütüphane", "spor", "kalp", "kapı",
  "dolap", "yapmak", "kapatmak", "yapıştırmak", "paylaşmak", "parlak", "para", "şapka",
  "posta", "polis", "pilot", "hep", "pek", "yaptı", "yapıyor", "peki",
  "topu", "rakip", "sahip", "yaptığı", "yapar", "yapma", "yaptım", "kapıyı",
  "yapmaya", "toplam", "yapan", "tepki", "olup", "hepsi", "hepimiz", "takip",
  "gidip", "yap", "proje", "parayı", "yapıyorsun", "garip",
  // c (59)
  "oyuncak", "ocak", "çocuk", "heyecan", "gece", "güvercin", "vücut", "pencere",
  "cam", "cadde", "cevap", "cüzdan", "cesur", "cumartesi", "cuma", "cep",
  "cetvel", "cımbız", "turuncu", "karınca", "sincap", "lahmacun", "patlıcan", "mercimek",
  "incir", "cümle", "amca", "bacak", "fincan", "tencere", "sıcak", "acı",
  "ceket", "eczane", "macera", "ancak", "sadece", "olacak", "sence", "ikinci",
  "bence", "gelecek", "oyuncu", "sizce", "edecek", "tercih", "yabancı", "iyice",
  "boyunca", "acaba", "yardımcı", "çocuklar", "ciddi", "canım", "yapacak", "can",
  "gelince", "yapılacak", "çocuğu",
  // ö (53)
  "dikdörtgen", "çöp", "göl", "gökyüzü", "gözlük", "öğle", "öğretmen", "öğrenci",
  "öğrenmek", "ördek", "ön", "örgü", "ödev", "ödül", "önlük", "öpmek",
  "örnek", "ölçü", "dört", "köpek", "örümcek", "gökkuşağı", "köfte", "börek",
  "göz", "köprü", "görmek", "öğretmek", "kötü", "gömlek", "şoför", "öykü",
  "özür", "önce", "böyle", "öyle", "önemli", "göre", "söyledi", "söz",
  "gördüm", "söylüyor", "söyle", "döndü", "özel", "görünüyor", "gördü", "görünce",
  "önünde", "öğrendim", "çözüm", "önceden", "sözleri",
  // Apostroph ' (Namen mit Endung) (73)
  "türkiye'de", "türkiye'nin", "türkiye'ye", "türkiye'den", "istanbul'da", "istanbul'a", "istanbul'dan", "istanbul'un",
  "ankara'da", "ankara'ya", "ankara'dan", "ankara'nın", "izmir'de", "izmir'den", "konya'da", "adana'da",
  "mersin'e", "bursa'da", "antalya'da", "trabzon'da", "samsun'da", "van'da", "diyarbakır'da", "kadıköy'e",
  "almanya'da", "almanya'ya", "almanya'nın", "avusturya'da", "isviçre'de", "isviçre'yi", "fransa'da", "fransa'dan",
  "italya'ya", "ispanya'da", "hollanda'da", "rusya'da", "japonya'da", "çin'de", "amerika'da", "avrupa'da",
  "afrika'da", "kıbrıs'ta", "kıbrıs'a", "paris'te", "berlin'de", "londra'da", "viyana'da", "zürih'te",
  "bern'de", "ali'nin", "ali'ye", "ali'yi", "ali'den", "ayşe'nin", "ayşe'ye", "ahmet'in",
  "ahmet'e", "mehmet'in", "mehmet'e", "mustafa'nın", "hasan'ın", "ömer'in", "leyla'nın", "can'a",
  "gül'ün", "süleyman'a", "fadime'ye", "sami'nin", "deniz'in", "elif'in", "zeynep'in", "emre'nin",
  "selin'in",
  // ^ (Zirkumflex: â î û) (14)
  "rüzgâr", "hâlâ", "hâline", "hâle", "hâl", "hâli", "âşık", "kâğıt",
  "hâlde", "hâlinde", "hâkim", "imkânın", "hikâye", "dükkân",
  // w x q (Fremdwörter) (2)
  "web", "wifi",
];

/**
 * Alters-gestufter Bonus-Wortschatz (Türkçe) - das Gegenstück zu `STUFE_VOCAB_FR`/`STUFE_VOCAB_ES`/`STUFE_VOCAB_IT` für
 * `stufeVocab()` (`generator.ts`).
 *
 * ★ F6-tr (03.10.2026, Bauplan §3 „Texte"): von Hand NEU auf Türkisch zusammengestellt (nicht aus `STUFE_VOCAB`/`STUFE_VOCAB_EN`
 * übersetzt), nach den Themen des Bauplans - Kinder: Schule, Tiere (vom Bauernhof bis zum Meer), Natur und Wetter, Essen (mantı,
 * poğaça, helva, sütlaç), Feste und Sommer (piknik, kamp, mangal, Musikinstrumente), Orte (köy, çarşı, kale, saray), Spielplatz;
 * Jugend: Freundschaft, Schule und Fächer, Technik, Musik, Sport (auch Paralympics-Sportarten), Umwelt, Berufswahl, Reisen;
 * Erwachsene: Arbeit, Behörden, Wohnen, Gesundheit, Zusammenleben, Kultur, Verkehr. Variantenneutral (keine Wörter, die nur in einer
 * Region der Türkei, in Nordzypern oder in der Gemeinde in Deutschland/Österreich/der Schweiz gelten), alle Wörter bestehen das
 * macOS-Wörterbuch (in kleiner und türkisch grosser Form) und die Sperrliste (`sperrlisteTr.ts`); Staatssymbole, Religion und
 * Militär kommen nicht vor. Wächter: `tests/tastenflow-tr-woerter.test.ts`.
 */
export const STUFE_VOCAB_TR: Record<InhaltsStufe, string[]> = {
  kids: [
    "tebeşir", "karne", "pastel", "boya", "makas", "yapıştırıcı", "kitaplık", "resimli",
    "bilmece", "tekerleme", "şiir", "dans", "tiyatro", "kukla", "palyaço", "sirk",
    "çiftlik", "kümes", "ahır", "kuzu", "buzağı", "civciv", "yavru", "pelikan",
    "flamingo", "panda", "koala", "kanguru", "kuğu", "karga", "bülbül", "kumru",
    "ahtapot", "yengeç", "karides", "ıstakoz", "şimşek", "sis", "buz",
    "fırtına", "sağanak", "mağara", "şelale", "yamaç", "kıyı", "dalga", "sahil",
    "kumsal", "çöl", "kutup", "gezegen", "uzay", "roket", "uydu", "teleskop",
    "mantı", "gözleme", "poğaça", "açma", "fındık", "ceviz", "badem", "fıstık",
    "kestane", "kek", "kurabiye", "bisküvi", "puding", "sütlaç", "helva", "şerbet",
    "limonata", "tost", "sandviç", "kutlama", "konfeti", "maske", "kostüm", "gösteri",
    "şenlik", "piknik", "kamp", "çadır", "mangal", "saz", "davul", "zurna",
    "def", "kaval", "köy", "kasaba", "şehir", "meydan", "çarşı", "saray",
    "müze", "stadyum", "havuz", "salıncak", "kaydırak", "tahterevalli", "helikopter", "tramvay",
    "feribot", "tekne", "kayık", "yelkenli", "bulmaca", "blok", "boncuk", "çıngırak",
    "ayıcık", "sabun", "havlu", "fırça", "şampuan", "pijama", "terlik", "çizme",
    "mont", "bere", "davetiye", "manav", "kasap", "fırıncı", "kanat", "gaga",
    "tüy", "pati", "kuyruk", "boynuz", "pençe", "yuva", "kovan", "petek",
    "böcek", "sivrisinek", "cırcır",
  ],
  teens: [
    "arkadaşlık", "kulüp", "deney", "bilim", "fizik", "kimya", "biyoloji", "matematik",
    "tarih", "coğrafya", "edebiyat", "internet", "uygulama", "kulaklık", "dosya",
    "şifre", "sosyal", "konser", "şarkıcı", "grup", "albüm", "sahne", "antrenman",
    "şampiyona", "kupa", "madalya", "atletizm", "jimnastik", "tenis", "okçuluk", "yüzücü",
    "iklim", "çevre", "dönüşüm", "enerji", "plastik", "kirlilik", "kuraklık", "meslek",
    "staj", "üniversite", "burs", "peron", "otogar", "yolculuk", "valiz", "rehber",
    "otel", "sunum", "rapor", "not", "yardımlaşma", "cesaret", "hayranlık", "özgüven",
    "futbolcu", "basketbolcu", "koşucu", "kaleci", "tasarım", "robotik", "yazılım", "program",
    "dizi", "belgesel", "yarışma",
  ],
  erwachsen: [
    "ofis", "toplantı", "şirket", "müşteri", "maaş", "fatura", "vergi", "ekonomi",
    "belediye", "muhtar", "nüfus", "kimlik", "pasaport", "vize", "dilekçe", "başvuru",
    "form", "sözleşme", "kira", "apartman", "mahalle", "elektrik", "doğalgaz", "randevu",
    "reçete", "tedavi", "emeklilik", "sigorta", "sendika", "vatandaşlık", "eşitlik", "dayanışma",
    "demokrasi", "göç", "uyum", "kültür", "miras", "röportaj", "diploma", "ulaşım",
    "trafik", "demiryolu", "otoyol", "tarım", "zanaat", "ticaret", "turizm", "adres",
    "özgeçmiş", "çalışan", "işveren", "hukuk", "avukat", "noter", "anlaşma", "yönetmelik",
    "yasa", "sorumluluk", "öğretim", "okuryazar", "arşiv", "yazıcı",
  ],
};
