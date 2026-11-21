/**
 * ★★★ DER ABZEICHEN-KATALOG TÜRKISCH (O-TR, 02.10.2026).
 *
 * Gegenstück zu `badgesPl.ts`/`badgesIt.ts` - dieselbe Bauart, dieselben
 * Schlüssel, NEU AUF TÜRKISCH GESCHRIEBEN, nicht übersetzt (Glossar Türkisch
 * §2.4): übertragen ist die IDEE des Namens. Wo das Türkische eine eigene
 * Wendung zum Motiv hat, steht sie da ("Tam on ikiden" zur Zielscheibe, "Saat
 * gibi", "Taş gibi sağlam", "Kitap kurdu", "Gece kuşu", "Erkenci kuş", "Fil
 * hafızası", "Bin bir tur", "Hepsi yerli yerinde", "Sağlama alındı", "Bir
 * oturuşta", "Kara tren", "Pırıl pırıl"); sonst ein Stabreim wie im Deutschen
 * ("Pürdikkat penguen", "Lazer lama", "Kıvrak kunduz", "Kararlı kaplumbağa").
 * KEINE Wendung mit Religion, Militär, Fussballvereinen oder Atatürk (Glossar
 * §2.4, §4 Nr. 6/7).
 *
 * ★ Türkisch hat kein grammatisches Geschlecht (Glossar Regel 2) - die Namen
 * dürfen Personen-Wörter tragen ("Kurs ustası"). Die Beschreibungen sind
 * Sätze über die Sache (Hauptwort mit Partizip: "Tamamlanan 5 ders",
 * Passiv: "... kilidi açıldı") - sie gelten für das Kind UND für die
 * Lehrkraft, die das Regal eines Kindes sieht; darum keine Anrede, ausser in
 * den zwei Sätzen, die nur das Kind betreffen (sen).
 *
 * ★ Regel 6 (die grosse Falle): an eine Zahl, ein Zeichen, eine Uhrzeit
 * kommt NIE eine Endung - "Saat 21:00 geçtikten sonra", "Puan halkasında
 * ulaşılan seviye: 5", "toplam: 30". Nach einer Zahl Einzahl ("5 tur",
 * "100 vuruş", Regel 5); Tausenderpunkt ("1.000"), Prozent VOR der Zahl
 * ("%95", "%0,5").
 *
 * Grossschreibung wie im Türkischen: nur das erste Wort und Eigennamen
 * ("Yankı Mağarası", "Kar Fırtınası", "Kutup İstasyonu", "Kutup Keşfi").
 * Die trockenen Zweitnamen (`nameNeutral`, ab 11 Jahren) genau dort, wo das
 * Deutsche einen hat. Glossar: rozet, tur, vuruş, doğruluk, hata, temel
 * konum, temel sıra, bölüm, puan halkası, zorluk seviyesi, başlangıç
 * noktası, öykü, Kutup Keşfi, buz kütlesi; "hedef" bleibt dem Wochenziel und
 * "Sıradaki hedef".
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - jede ID braucht einen
 * türkischen Eintrag und einen Zweitnamen genau dort, wo es ihn im Deutschen
 * gibt.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextTr = AbzeichenTextEn;

/** Zahl mit Tausenderpunkt wie `Intl` "tr-TR" (Glossar Regel 5: "1.000"). */
function zahl(n: number): string {
  return n.toLocaleString("tr-TR");
}

/** Die Zeichen von "alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesPl.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} ve ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_TR: Readonly<Record<string, string>> = {
  Fehlerfrei: "Hatasız",
  "Saubere Serie": "Kusursuz turlar",
  Fleiß: "Emek",
  Anschläge: "Vuruşlar",
  Dranbleiben: "Azim",
  Übungswochen: "Çalışma haftaları",
  Sterne: "Yıldızlar",
  Lektionen: "Dersler",
  Stufen: "Seviyeler",
  Tastenwelt: "Tuş dünyası",
  "Sitzt!": "Yerine oturdu!",
  Tempo: "Hız",
  "Am Stück": "Bir solukta",
  Meisterprüfung: "Ustalık",
  Abenteuer: "Maceralar",
  "Abenteuer-Kunststücke": "Macera ustalıkları",
  Expedition: "Keşif",
  Geschichten: "Öyküler",
  Lesestunde: "Okuma saati",
  "Lese-Kunststücke": "Okuma ustalıkları",
  Geheim: "Gizliler",
};

/** Der ganze Katalog türkisch, je Abzeichen-ID. */
export const ABZEICHEN_TR: Readonly<Record<string, AbzeichenTextTr>> = {
  // ── Hatasız ──────────────────────────────────────────────────────────────
  // "On ikiden vurmak" = ins Schwarze treffen (die Zwölf ist die Mitte der Scheibe).
  volltreffer: { name: "Tam on ikiden", description: "Tek bir hata bile olmadan bütün bir tur.", bildbeschreibung: "tam ortasında ok olan bir hedef tahtası" },
  "null-fehler-ninja": { name: "Sıfır hata ninjası", description: "Hiç hata olmadan 5 tur.", bildbeschreibung: "ninja" },
  "makellos-meister": { name: "Kusursuz yıldızlar", description: "Hiç hata olmadan 15 tur.", bildbeschreibung: "parlayan üç yıldız" },
  "diamant-finger": { name: "Elmas parmaklar", description: "Hiç hata olmadan 40 tur.", bildbeschreibung: "mavi bir değerli taş" },
  // "Weiße Weste" ⇒ "alnının akıyla" (mit weisser Stirn = mit sauberem Ruf).
  "weisse-weste": { name: "Alnının akıyla", description: "Hiç hata olmadan 80 tur.", bildbeschreibung: "beyaz bir güvercin" },
  "einhorn-finger": { name: "Tek boynuzlu at parmakları", nameNeutral: "150 hatasız tur", description: "Hiç hata olmadan 150 tur.", bildbeschreibung: "tek boynuzlu at" },
  // ── Kusursuz turlar ──────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Pürdikkat penguen", nameNeutral: "Üç kez kusursuz", description: "Arka arkaya 3 kusursuz tur (doğruluk en az %95).", bildbeschreibung: "penguen" },
  adlerauge: { name: "Kartal gözü", description: "Arka arkaya 7 kusursuz tur (doğruluk en az %95).", bildbeschreibung: "kartal" },
  "laser-lama": { name: "Lazer lama", nameNeutral: "Lazer modu", description: "Arka arkaya 15 kusursuz tur (doğruluk en az %95).", bildbeschreibung: "lama" },
  "eiskalte-serie": { name: "Buz gibi soğukkanlı", description: "Arka arkaya 25 kusursuz tur (doğruluk en az %95).", bildbeschreibung: "buz küpü" },
  // ── Emek ─────────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Klavye civcivi", nameNeutral: "İlk tur", description: "Tamamlanan ilk tur.", bildbeschreibung: "yumurtadan çıkan bir civciv" },
  "ausdauer-ameise": { name: "Çalışkan karınca", nameNeutral: "Isınma bitti", description: "25 alıştırma turu.", bildbeschreibung: "karınca" },
  "marathon-maus": { name: "Maratoncu fare", nameNeutral: "Yüz tur", description: "100 alıştırma turu.", bildbeschreibung: "fare başı" },
  "munteres-murmeltier": { name: "Kıvrak kunduz", nameNeutral: "Maraton", description: "250 alıştırma turu.", bildbeschreibung: "kunduz" },
  dauerlaeufer: { name: "Uzun mesafe", description: "500 alıştırma turu.", bildbeschreibung: "koşan bir kişi" },
  // "Tausendsassa" ⇒ "Bin bir tur" (wie "Binbir Gece"), zum Wal mit der Fontäne.
  tausendsassa: { name: "Bin bir tur", nameNeutral: "Bin tur", description: `${zahl(1000)} alıştırma turu.`, bildbeschreibung: "su fışkırtan bir balina" },
  // ── Vuruşlar ─────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Bin tuşun kaplanı", nameNeutral: "Bin doğru vuruş", description: `${zahl(1000)} doğru vuruş.`, bildbeschreibung: "kaplan başı" },
  "tasten-t-rex": { name: "Klavye dinozoru", nameNeutral: "On bin doğru vuruş", description: `${zahl(10000)} doğru vuruş.`, bildbeschreibung: "tiranozor" },
  "galaktische-fingerspitzen": { name: "Galaktik parmaklar", description: `${zahl(50000)} doğru vuruş.`, bildbeschreibung: "havalanan bir roket" },
  "hunderttausend-held": { name: "Yüz bin şimşek", nameNeutral: "Yüz bin doğru vuruş", description: `${zahl(100000)} doğru vuruş.`, bildbeschreibung: "sarı bir şimşek" },
  viertelmillion: { name: "Çeyrek milyon", description: `${zahl(250000)} doğru vuruş - bütün bir kitaptaki harf kadar.`, bildbeschreibung: "uydu" },
  // ── Azim ─────────────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Azimli porsuk", nameNeutral: "Azim", description: "3 ayrı çalışma günü.", bildbeschreibung: "porsuk" },
  gewohnheitstier: { name: "Kararlı kaplumbağa", description: "7 ayrı çalışma günü.", bildbeschreibung: "kaplumbağa" },
  // "saat gibi işlemek" = laufen wie ein Uhrwerk.
  "wie-ein-uhrwerk": { name: "Saat gibi", description: "20 ayrı çalışma günü.", bildbeschreibung: "kırmızı bir çalar saat" },
  unaufhaltsam: { name: "Durdurulamaz", description: "50 ayrı çalışma günü.", bildbeschreibung: "karlı zirveli bir dağ" },
  "tief-verwurzelt": { name: "Kökleri derinde", description: "100 ayrı çalışma günü.", bildbeschreibung: "büyük, yeşil, gür bir ağaç" },
  "fels-in-der-brandung": { name: "Taş gibi sağlam", description: "200 ayrı çalışma günü - bir öğretim yılındaki bütün okul günlerinden fazla.", bildbeschreibung: "Paskalya Adası'ndan bir taş heykel" },
  // ── Çalışma haftaları ────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Üç ay oldu", description: "12 ayrı çalışma haftası.", bildbeschreibung: "kahverengi bir sonbahar yaprağı" },
  "halbes-jahr-dabei": { name: "Altı ay oldu", description: "26 ayrı çalışma haftası.", bildbeschreibung: "kar yağan bir bulut" },
  "ganzes-jahr-dabei": { name: "Koca bir yıl", description: "52 ayrı çalışma haftası.", bildbeschreibung: "mumlu bir doğum günü pastası" },
  // ── Yıldızlar ────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Kayan yıldız", description: "3 yıldızlı ilk tur.", bildbeschreibung: "gece gökyüzünde kayan bir yıldız" },
  "sternen-sammler": { name: "Bir avuç yıldız", description: "3 yıldızlı 10 tur.", bildbeschreibung: "parlayan sarı bir yıldız" },
  sternenhimmel: { name: "Yıldızlı gökyüzü", description: "3 yıldızlı 30 tur.", bildbeschreibung: "gece gökyüzünde Samanyolu" },
  sternenmeer: { name: "Yıldız denizi", description: "3 yıldızlı 75 tur.", bildbeschreibung: "sekiz kollu turuncu bir yıldız" },
  // ── Dersler ──────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Derslerin aslanı", nameNeutral: "Beş ders", description: "Tamamlanan 5 ders.", bildbeschreibung: "aslan" },
  "kapitel-kaeptn": { name: "Tam yol ileri!", description: "Tamamlanan 15 ders.", bildbeschreibung: "çapa" },
  // Die Lektionszahl DES WEGES - nach Doppelpunkt, ohne Endung (Regel 6).
  "lehrgangs-legende": { name: "Kursun efsanesi", description: (z) => `Kursun bütün dersleri tamamlandı - toplam: ${lektionenFuer(z.lernweg).length}.`, bildbeschreibung: "altın bir kupa" },
  // ── Seviyeler (puan halkası) ─────────────────────────────────────────────
  "kletter-koala": { name: "Tırmanan koala", nameNeutral: "Seviye 5", description: "Puan halkasında ulaşılan seviye: 5.", bildbeschreibung: "koala" },
  "punkte-rakete": { name: "Puan roketi", description: "Puan halkasında ulaşılan seviye: 10.", bildbeschreibung: "kırmızı bir balon" },
  "gipfel-gaemse": { name: "Zirvedeki dağ keçisi", nameNeutral: "Seviye 20", description: "Puan halkasında ulaşılan seviye: 20.", bildbeschreibung: "keçi" },
  hoehenflug: { name: "Yüksek uçuş", nameNeutral: "Seviye 50", description: "Puan halkasında ulaşılan seviye: 50.", bildbeschreibung: "helikopter" },
  "ueber-den-wolken": { name: "Bulutların üstünde", nameNeutral: "Seviye 100", description: "Puan halkasında ulaşılan seviye: 100.", bildbeschreibung: "uçan daire" },
  sternenreise: { name: "Yıldızlara yolculuk", nameNeutral: "Seviye 200", description: "Puan halkasında ulaşılan seviye: 200.", bildbeschreibung: "uzun kuyruklu bir kuyruklu yıldız" },
  // ── Tuş dünyası ──────────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg "tr" a s d f j k l ş.
  "grundstellungs-gorilla": {
    name: "Temel sıra gorili",
    nameNeutral: "Temel sıra yerinde",
    description: (z) =>
      `Temel konumun sekiz tuşunun kilidi açıldı: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "goril",
  },
  "gross-baumeister": { name: "Büyük harf ustası", nameNeutral: "Büyük harfler", description: "Shift tuşu öğrenildi - gerçek büyük harfler, kendi elinle yazılmış.", bildbeschreibung: "mavi tuşlarda dört büyük harf" },
  // ⚠️ "puenktchen-panda" und "schlangen-s" gibt es auf Weg "tr" nicht zu
  // verdienen (kein ä, kein ß) - der Eintrag steht trotzdem da, weil das Regal jedes beschreibt.
  "puenktchen-panda": { name: "Benekli panda", nameNeutral: "Almanca noktalı harfler", description: "ä, ö ve ü harflerinin kilidi açıldı - Almancanın noktalı harfleri.", bildbeschreibung: "panda" },
  "schlangen-s": { name: "Yılan S", nameNeutral: "Almanca keskin s", description: "ß harfinin kilidi açıldı - Alman klavyesinin son harfi.", bildbeschreibung: "yılan" },
  "alphabet-as": { name: "Bütün alfabe", description: "A ile Z arasındaki bütün harflerin kilidi açıldı.", bildbeschreibung: "mavi tuşlarda küçük harfler" },
  "punkt-und-komma": { name: "Nokta ve virgül", description: "Nokta ile virgülün kilidi açıldı - ilk gerçek noktalama işaretleri.", bildbeschreibung: "siyah bir dolma kalem" },
  "satzzeichen-sammler": { name: "İşaret koleksiyoncusu", nameNeutral: "Bütün noktalama", description: "Noktalama işaretlerinin kilidi açıldı: . , - ? ! : ;", bildbeschreibung: "büyük kırmızı bir ünlem işareti" },
  "zahlen-zebra": { name: "Rakam zebrası", nameNeutral: "Rakamların yarısı", description: "Sayı sırasında beş rakamın kilidi açıldı.", bildbeschreibung: "zebra" },
  "zahlen-zauberer": { name: "Rakam sihirbazı", nameNeutral: "Bütün sayı sırası", description: "Bütün sayı sırasının kilidi açıldı: 1 2 3 4 5 6 7 8 9 0.", bildbeschreibung: "üzerinde 10 sayısı olan mavi bir tuş" },
  "klammer-krokodil": { name: "Parantez timsahı", nameNeutral: "Parantez aç, parantez kapat", description: "Parantezlerin kilidi açıldı: ( ) - ilk simgeler.", bildbeschreibung: "timsah" },
  "alltags-ass": { name: "Her güne lazım", nameNeutral: "Gündelik işaretler", description: (z) => `Kilidi açılan işaretler: ${alltagsZeichen(z)} - e-postalardan ve para dünyasından tanıdık.`, bildbeschreibung: "zarf" },
  "tastatur-krone": { name: "Klavyenin tacı", nameNeutral: "Bütün klavye", description: "Klavyedeki BÜTÜN tuşların kilidi açıldı - son simgeye kadar.", bildbeschreibung: "altın bir taç" },
  // ── Yerine oturdu! ───────────────────────────────────────────────────────
  "feste-burg": { name: "Sağlam yuva", nameNeutral: "Temel sıra oturdu", description: "Temel konumun bütün tuşları yerine oturdu.", bildbeschreibung: "ev" },
  "buchstaben-baendiger": { name: "Harf terbiyecisi", nameNeutral: "Bütün harfler oturdu", description: "Her harf yerine oturdu - henüz oturmamış harf kalmadı.", bildbeschreibung: "büyük bir A harfi olan kırmızı bir kare" },
  "zahlen-fels": { name: "Kaya gibi rakamlar", nameNeutral: "Bütün rakamlar oturdu", description: "Bütün sayı sırası yerine oturdu.", bildbeschreibung: "renkli boncuklu bir abaküs" },
  "nichts-wackelt": { name: "Hepsi yerli yerinde", description: "Klavyedeki her tuş yerine oturdu - yalnızca kilidi açılanlar değil, bütün klavye.", bildbeschreibung: "ortasında nokta olan mavi bir eşkenar dörtgen" },
  // ── Hız ──────────────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Çevik tilki", nameNeutral: "Hızlı ve doğru", description: "İstenen hıza ulaşıldı VE doğruluk en az %95 - hız ancak doğru yazınca sayılır.", bildbeschreibung: "tilki" },
  "tempo-60": { name: "Zıpzıp tavşan", nameNeutral: "Dakikada 60, doğru", description: "Dakikada 60 vuruş hızında, en az %95 doğrulukla bir tur.", bildbeschreibung: "tavşan" },
  "tempo-90": { name: "Seken geyik", nameNeutral: "Dakikada 90, doğru", description: "Dakikada 90 vuruş hızında, en az %95 doğrulukla bir tur.", bildbeschreibung: "geyik" },
  "tempo-120": { name: "Dörtnala at", nameNeutral: "Dakikada 120, doğru", description: "Dakikada 120 vuruş hızında, en az %98 doğrulukla bir tur.", bildbeschreibung: "dörtnala koşan bir at" },
  // "Kara tren" - die Dampflok aus dem bekannten Volkslied.
  "tempo-160": { name: "Kara tren", nameNeutral: "Dakikada 160, doğru", description: "Dakikada 160 vuruş hızında, en az %98 doğrulukla bir tur.", bildbeschreibung: "buharlı lokomotif" },
  "tempo-200": { name: "Hızlı tren", nameNeutral: "Dakikada 200, doğru", description: "Dakikada 200 vuruş hızında, en az %98 doğrulukla bir tur.", bildbeschreibung: "hızlı bir tren" },
  "tempo-300": { name: "Jet uçağı", nameNeutral: "Dakikada 300, doğru", description: "Dakikada 300 vuruş hızında, en az %99 doğrulukla bir tur - profesyonel düzey.", bildbeschreibung: "küçük bir uçak" },
  // ── Bir solukta ──────────────────────────────────────────────────────────
  "kette-100": { name: "Zincirleme tepki", nameNeutral: "Arka arkaya 100", description: "Arka arkaya 100 doğru vuruş, tek bir hata bile olmadan.", bildbeschreibung: "iki zincir halkası" },
  "kette-250": { name: "Tökezlemeden", description: "Arka arkaya 250 doğru vuruş.", bildbeschreibung: "birkaç halkalı bir zincir" },
  "kette-500": { name: "Kopmayan ip", nameNeutral: "Arka arkaya 500", description: "Arka arkaya 500 doğru vuruş - bütün bir turdan fazla.", bildbeschreibung: "bir makara iplik" },
  "kette-1000": { name: "Bin vuruş, sıfır hata", description: `Arka arkaya ${zahl(1000)} doğru vuruş.`, bildbeschreibung: "karlı zirveli Fuji Dağı" },
  "kette-2000": { name: "Demir zincir", nameNeutral: `Arka arkaya ${zahl(2000)}`, description: `Arka arkaya ${zahl(2000)} doğru vuruş - en ufak bir tökezleme olmadan dört beş tur.`, bildbeschreibung: "lav akan bir yanardağ" },
  // ── Maceralar (Buz Kütlesi Oyunu, Glossar §2.3) ─────────────────────────
  "erste-expedition": { name: "İlk keşif yolculuğu", description: "Serbest oyunda ilk buz kütlesi macerası - igloya kadar.", bildbeschreibung: "pusula" },
  polarforscher: { name: "Kutup araştırmacısı", description: "Serbest oyunda tamamlanan 10 buz kütlesi macerası.", bildbeschreibung: "kar tanesi" },
  "eismeer-legende": { name: "Buz denizinin efsanesi", description: "Serbest oyunda tamamlanan 30 buz kütlesi macerası.", bildbeschreibung: "yüksek mavi bir dalga" },
  "packeis-profi": { name: "Buz Tabakası ustası", nameNeutral: "60 macera", description: "Serbest oyunda tamamlanan 60 buz kütlesi macerası.", bildbeschreibung: "bavul" },
  // ── Macera ustalıkları ───────────────────────────────────────────────────
  // "Trockener Frack": Der Frack ist der Pinguin selbst - türkisch "frak".
  "trockener-frack": { name: "Kuru frak", description: "Bir kez bile suya ya da kar yığınına düşmeden bütün bir macera.", bildbeschreibung: "siyah bir silindir şapka" },
  "immer-trocken": { name: "Hep kuru", description: (z) => `${z.trockeneAbenteuer} macera, bir kez bile suya düşmeden.`, bildbeschreibung: "kapalı bir şemsiye" },
  fischfaenger: { name: "Bereketli av", description: (z) => `Buz kütlesi maceralarında yakalanan ödül balığı: ${z.fische}.`, bildbeschreibung: "mavi bir balık" },
  // ── Keşif ────────────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (Glossar §2.3): Yankı Mağarası, Kar Fırtınası,
  // Kutup İstasyonu - ohne Endung (Regel 6: Doppelpunkt statt "İstasyonu'na").
  "hoehlen-lauscher": { name: "Yarasa kulağı", description: "Yankı Mağarası çıkışa kadar geçildi - karanlıkta, yalnızca kulakla.", bildbeschreibung: "yarasa" },
  "sturm-trotzer": { name: "Fırtınaya meydan okuyan", description: "Kar Fırtınası geçildi - karakter dizileri ezberden yazıldı.", bildbeschreibung: "üfleyen bir yüz" },
  "funker-freund": { name: "Telsiz dostluğu", description: "Bütün telsiz mesajı okundu ve gönderildi - alıcı: Kutup İstasyonu.", bildbeschreibung: "radyo" },
  "polarlicht-entdecker": { name: "Kutup ışıkları altında", description: "Kutup Keşfi baştan sona tek hata olmadan - kutup ışıkları dans ediyor.", bildbeschreibung: "kıvılcım izi bırakan bir yıldız" },
  // ── Öyküler ──────────────────────────────────────────────────────────────
  "lese-luchs": { name: "Kitapsever leopar", nameNeutral: "İlk öykü", description: "İlk öykü sonuna kadar okundu ve yazıldı.", bildbeschreibung: "leopar" },
  buecherwurm: { name: "Kitap kurdu", description: "Sonuna kadar okunan 3 öykü.", bildbeschreibung: "yeşil bir tırtıl" },
  "buecherei-baer": { name: "Kitaplık ayısı", nameNeutral: "Sekiz öykü", description: "Sonuna kadar okunan 8 öykü.", bildbeschreibung: "ayı" },
  vielleser: { name: "Kitap dağı", description: "Sonuna kadar okunan 15 öykü.", bildbeschreibung: "renkli bir kitap yığını" },
  // ── Okuma saati ──────────────────────────────────────────────────────────
  "seiten-spatz": { name: "İlk sayfa serçesi", nameNeutral: "İlk sayfa", description: "Bir öykünün ilk bölümü yazıldı.", bildbeschreibung: "mavi bir kuş" },
  "kapitel-krake": { name: "Okumaya doymayan ahtapot", nameNeutral: "On bölüm", description: "Okunup yazılan 10 bölüm.", bildbeschreibung: "ahtapot" },
  // "Fil hafızası" (Elefantengedächtnis) - zum Elefanten auf der Medaille.
  "geschichten-gigant": { name: "Fil hafızası", description: "Okunup yazılan 30 bölüm.", bildbeschreibung: "fil" },
  leseratte: { name: "Bitmeyen okuma", nameNeutral: "75 bölüm", description: "Okunup yazılan 75 bölüm.", bildbeschreibung: "parşömen rulosu" },
  // ── Okuma ustalıkları ────────────────────────────────────────────────────
  federleicht: { name: "Tüy gibi hafif", description: "Tek hata olmadan yazılan bütün bir bölüm.", bildbeschreibung: "beyaz bir tüy" },
  // "Bir oturuşta" (in einer Sitzung) - "Bir solukta" ist schon der Name der Familie "Am Stück".
  "in-einem-rutsch": { name: "Bir oturuşta", description: "Bütün bir öykü tek bir günde sonuna kadar okundu.", bildbeschreibung: "mavi bir sarmal" },
  "lesezeichen-held": { name: "Ayraç yerinde", description: "Okumaya başka bir gün, tam kalınan yerden devam edildi.", bildbeschreibung: "kitap ayracı" },
  // ── Ustalık (Glossar §2.4: "Ustalık", nie "sınav") ──────────────────────
  "zehn-minuten-abschrift": { name: "On dakika yazı", description: "On dakika ara vermeden metin yazmak, en çok %0,5 hatayla - gerçek klavye yarışmalarındaki gibi.", bildbeschreibung: "kronometre" },
  "lehrgangs-meister": { name: "Kurs ustası", description: (z) => `Kursun bütün dersleri üç yıldızla tamamlandı - toplam: ${lektionenFuer(z.lernweg).length}.`, bildbeschreibung: "siyah bir mezuniyet kepi" },
  "goldene-tastatur": { name: "Altın klavye", description: "Bütün tuşların kilidi açıldı ve hepsi yerine oturdu - üstelik bir kez dakikada 160 vuruş, %98 doğrulukla. Son rozet.", bildbeschreibung: "kurdeleli bir spor madalyası" },
  // ── Gizliler ─────────────────────────────────────────────────────────────
  // "Yavaş ama emin" statt "tembel" im Namen - nie etwas gegen das Kind.
  "gemuetliches-faultier": { name: "Yavaş ama emin", description: "Çok yavaş ama tek hata olmadan - doğruluk hızdan önemli!", bildbeschreibung: "tembel hayvan" },
  "comeback-kaenguru": { name: "Kanguru sıçrayışı", description: "1 yıldızlı bir turun hemen ardından 3 yıldızlı bir tur.", bildbeschreibung: "kanguru" },
  nachteule: { name: "Gece kuşu", description: "Saat 21:00 geçtikten sonra bitirilen bir tur.", bildbeschreibung: "baykuş" },
  "frueher-vogel": { name: "Erkenci kuş", description: "Sabah saat 7:00 olmadan bitirilen bir tur.", bildbeschreibung: "horoz" },
  nimmersatt: { name: "Okumaya doymayan", description: "Bir günde okunan 3 bölüm.", bildbeschreibung: "yeşil bir elma" },
  "ferien-held": { name: "Tatilde klavye", description: "Yaz tatilinin ortasında çalışmak - temmuzda ya da ağustosta.", bildbeschreibung: "şemsiyeli bir plaj" },
  "wochenend-schreiber": { name: "Hafta sonu yazarı", description: "Cumartesi ve pazar günü çalışmak.", bildbeschreibung: "takvim yaprağı" },
  // Die Endung gehört an "gün", nie an die Zahl (Regel 6).
  "zurueck-im-sattel": { name: "Yeniden yolda", description: (z) => `${z.pauseTage} günden uzun bir aradan sonra yeniden çalışmak - geri dönmek de sayılır.`, bildbeschreibung: "daire çizen iki ok" },
  // "Doppelt genäht hält besser" ⇒ "sağlama almak".
  "doppelt-genaeht": { name: "Sağlama alındı", description: "Arka arkaya iki hatasız tur.", bildbeschreibung: "iplikli bir iğne" },
  winterkind: { name: "Kış tuşları", description: "Aralıkta ya da ocakta çalışmak.", bildbeschreibung: "kardan adam" },
  jahreswechsel: { name: "Yılbaşı", description: "Yılın son gününde ya da yeni yılın ilk gününde çalışmak.", bildbeschreibung: "gece gökyüzünde havai fişekler" },
  "tages-marathon": { name: "Bir günlük maraton", description: "Bir günde on tur.", bildbeschreibung: "yarış atının üstünde bir jokey" },
  sternentag: { name: "Yıldızlı gün", description: "Bir günde üç yıldızlı üç tur.", bildbeschreibung: "yüzü olan bir güneş" },
  blitzsauber: { name: "Pırıl pırıl", description: "Bir günde üç hatasız tur.", bildbeschreibung: "köpüklü bir sabun" },
  "volle-woche": { name: "Dolu dolu hafta", description: "BİR haftada beş ayrı çalışma günü.", bildbeschreibung: "yeşil bir kitap" },
  // "Blindflug" ⇒ "Gözü kapalı" (etwas mit geschlossenen Augen können) - zum Affen,
  // der sich die Augen zuhält. Glossar Regel 4: "klavyeye bakmadan", nie "kör yazım".
  blindflug: { name: "Gözü kapalı", description: "Ekran klavyesi gizliyken bütün bir tur, hiç hata olmadan. On parmak klavyenin bütün sırrı bu: klavyeye bakmadan yazmak.", bildbeschreibung: "elleriyle gözlerini kapatan bir maymun" },
  sprachwechsler: { name: "Diller arası yolculuk", description: "İki dilde çalışmak - örneğin Türkçe ve İngilizce.", bildbeschreibung: "Avrupa ve Afrika'yı gösteren bir dünya küresi" },
  lesenacht: { name: "Gece okuması", description: "Saat 20:00 geçtikten sonra okunan bir öykü bölümü.", bildbeschreibung: "yüzü olan bir ay" },
  "zaehe-taste": { name: "İnatçı tuş", description: "Uzun süre zorlayan bir tuş artık yerine oturdu.", bildbeschreibung: "salyangoz" },
  aufsteiger: { name: "Yokuş yukarı", description: "Başlangıç noktasından beş zorluk seviyesi yukarıda.", bildbeschreibung: "yukarı doğru çıkan bir çizgi grafiği" },
  // ── Nur auf Weg "fr" (`badgesNurFr.ts`) - für eine türkische Bedienung auf
  // diesem Weg; dieselben Gedanken wie dort.
  "akzente-ziffernreihe": { name: "Aksan cambazları", nameNeutral: "é, è, ç ve à", description: "é, è, ç ve à harflerinin kilidi açıldı - sayı sırasında yaşayan harfler.", bildbeschreibung: "mavi bir tuşta 1 2 3 4 rakamları" },
  "accent-circonflexe": { name: "Şapka", nameNeutral: "Fransızca şapka işareti", description: "Ölü tuş ^ oturdu: ê, â, î, ô ve û.", bildbeschreibung: "kurdeleli bir hasır şapka" },
  trema: { name: "İki benekli uğur böceği", nameNeutral: "Fransızca iki nokta işareti", description: "Ölü tuş ¨ oturdu: ë, ï ve ü.", bildbeschreibung: "uğur böceği" },
};
