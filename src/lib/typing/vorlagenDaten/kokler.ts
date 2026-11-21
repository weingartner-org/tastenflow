/**
 * „Kökler ve alıntılar" - das türkische Gegenstück zu `radiciIt.ts` (Italienisch), `raices.ts` (Spanisch), `racines.ts`
 * (Französisch), `wordRoots.ts` (Englisch) und `fremdwoerter.ts` (Deutsch): eine ÜBUNGSVORLAGE zum Abschreiben für den Lernweg
 * „tr". Jede Zeile lautet `<ipucu> - <kelime>`; wer abschreibt, lernt nebenbei, woher ein Wort kommt oder aus welchem Stamm
 * es wächst.
 *
 * ★ TR-S (09.10.2026): Aufbau wie `RADICI` (drei Altersstufen, 80 Paare je Stufe, 240 zusammen, fünf Themen), aber die
 * Themen sind die des Türkischen: Es hat einen riesigen Bestand an Lehnwörtern (Arabisch, Persisch, Französisch, Italienisch …)
 * UND eine Wortbildung über Suffixe, die jedes Kind täglich benutzt. Inhalt neu auf Türkisch geschrieben - nichts übersetzt
 * (Johannes: *„keine texte werden übersetzt"*).
 *
 * ── Themen (je Stufe) ─────────────────────────────────────────────────────
 *  • „Yunanca ve Latince kökler" (20) - der Schulwortschatz der Fächer (telefon, coğrafya, biyoloji …), meist über das
 *    Französische ins Türkische gekommen; gemeint ist der ältere Ursprung.
 *  • „Arapçadan gelen kelimeler" (15) - kitap, kalem, sınıf, harf …
 *  • „Farsçadan gelen kelimeler" (15) - gül, bahçe, pencere, çorba, pazar, kilim …
 *  • „Batı dillerinden gelen kelimeler" (15) - Französisch, Italienisch, Englisch: pantolon, bilet, banka, fabrika …
 *  • „Kelime aileleri" (15) - ein türkischer Stamm und seine Suffixe: göz → gözlük → gözlükçü.
 *
 * ── Belege (ehrlich) ──────────────────────────────────────────────────────
 * ⚠️ Gebaut ohne Netz. Jede Herkunft stammt aus EIGENEM SPRACHWISSEN [G] und ist NICHT an einer Seite gelesen; `beleg` ist
 * die Nachschlage-Adresse (tr.wiktionary.org), keine bestätigte Quelle. Gewählt wurden nur Wörter, deren Herkunft in jedem
 * etymologischen Wörterbuch gleich lautet; bei Zweifel fielen sie heraus (*kütüphane* - Arabisch + Persisch gemischt,
 * *defter*, *kebap*, *pamuk*, *ceylan*, *bayram* …). Vor dem Einschalten des Weges von einer Person mit Türkisch als
 * Erstsprache gegenlesen (Befund, Offenes).
 * `origine` nennt den ältesten sicheren Ursprung (*telefon*: Yunanca, obwohl über Französisch gekommen).
 *
 * ── Zeilenregeln (Wächter: `tests/tastenflow-vorlage-kokler-tr.test.ts`) ───────────────────────────
 * - höchstens 40 Zeichen (Braillezeile), genau ein Trenner ` - `;
 * - `kelime` ein Einzelwort, klein; `ipucu` enthält es nicht;
 * - kein Wort doppelt, in keiner Stufe und über die Stufen hinweg;
 * - kein Wort der Wortlisten-Sperre `fuerWortlisteUngeeignetTr`, weder in `kelime` noch in `ipucu`;
 * - nur Zeichen der Türkçe-Q-Tastatur, kein Zirkumflex (Totaste), ASCII-Apostroph, keine Namen und Staatssymbole.
 */

export type KokStufe = "kids" | "teens" | "erwachsen";

/** Nur ein Hinweis für die Lehrkraft - wird beim Abtippen nicht gezeigt. */
export type KokOrigine =
  | "yunanca" | "latince" | "arapca" | "farsca" | "fransizca" | "italyanca" | "ingilizce" | "turkce-ek";

export interface KokPaar {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  ipucu: string;
  /** Das Wort selbst - ein Einzelwort. */
  kelime: string;
  origine: KokOrigine;
  /** Nachschlage-Adresse (tr.wiktionary.org) - NICHT gelesen, siehe Kopf. */
  beleg: string;
}

export interface KokTema {
  id: string;
  titel: string;
  paare: KokPaar[];
}

export const KOKLER_TEMALAR: readonly { id: string; titel: string }[] = [
  { id: "yunanca-latince", titel: "Yunanca ve Latince kökler" },
  { id: "arapca", titel: "Arapçadan gelen kelimeler" },
  { id: "farsca", titel: "Farsçadan gelen kelimeler" },
  { id: "bati", titel: "Batı dillerinden gelen kelimeler" },
  { id: "aile", titel: "Kelime aileleri" },
];

function p(ipucu: string, kelime: string, origine: KokOrigine): KokPaar {
  return { ipucu, kelime, origine, beleg: `https://tr.wiktionary.org/wiki/${kelime}` };
}
const yu = (i: string, k: string) => p(i, k, "yunanca");
const la = (i: string, k: string) => p(i, k, "latince");
const ar = (i: string, k: string) => p(i, k, "arapca");
const fa = (i: string, k: string) => p(i, k, "farsca");
const fr = (i: string, k: string) => p(i, k, "fransizca");
const it = (i: string, k: string) => p(i, k, "italyanca");
const en = (i: string, k: string) => p(i, k, "ingilizce");
const ek = (i: string, k: string) => p(i, k, "turkce-ek");

export const KOKLER: Record<KokStufe, KokTema[]> = {
  // ------------------------------------------------------------ kids (8-11)
  kids: [
    { id: "yunanca-latince", titel: "Yunanca ve Latince kökler", paare: [
      yu("uzaktaki kişiyle konuşursun", "telefon"),
      yu("küçük şeyleri büyük gösterir", "mikroskop"),
      yu("yıldızlara bakmaya yarar", "teleskop"),
      yu("ışıkla çekilen resim", "fotoğraf"),
      yu("dağları ve nehirleri öğretir", "coğrafya"),
      yu("denizlerden de büyük su", "okyanus"),
      yu("çok eskiden yaşamış dev", "dinozor"),
      yu("nehirde yaşayan iri hayvan", "hipopotam"),
      yu("birlikte çalan çok çalgıcı", "orkestra"),
      la("maçın oynandığı büyük yer", "stadyum"),
      yu("sayılarla uğraşan ders", "matematik"),
      yu("sahnede oynanan oyun", "tiyatro"),
      la("balıkların cam evi", "akvaryum"),
      yu("havada takla atan sanatçı", "akrobat"),
      yu("lambayı yakan güç", "elektrik"),
      yu("pervaneyle havalanır", "helikopter"),
      yu("takla ve denge sporu", "jimnastik"),
      la("palyaçoların gösterisi", "sirk"),
      la("bisikleti ayakla döndürür", "pedal"),
      la("durakta binilen büyük araç", "otobüs"),
    ] },
    { id: "arapca", titel: "Arapçadan gelen kelimeler", paare: [
      ar("sayfalarını çevirerek okursun", "kitap"),
      ar("yazı yazmaya yarar", "kalem"),
      ar("dersin yapıldığı oda", "sınıf"),
      ar("harflerden oluşan söz", "kelime"),
      ar("alfabenin tek bir işareti", "harf"),
      ar("sayıyı yazdığımız işaret", "rakam"),
      ar("boyayla çizilen görüntü", "resim"),
      ar("kedi ve köpek gibi canlı", "hayvan"),
      ar("sorunun karşılığı", "cevap"),
      ar("zamanı gösterir", "saat"),
      ar("günün ilk saatleri", "sabah"),
      ar("güneş batınca başlar", "akşam"),
      ar("içine eşya konan mobilya", "dolap"),
      ar("sevdiğine verdiğin armağan", "hediye"),
      ar("evine gelen konuk", "misafir"),
    ] },
    { id: "farsca", titel: "Farsçadan gelen kelimeler", paare: [
      fa("dikenli, güzel kokulu çiçek", "gül"),
      fa("ağaç ve çiçek yetişen yer", "bahçe"),
      fa("dışarıyı gösteren cam", "pencere"),
      fa("yakın arkadaş", "dost"),
      fa("kaşıkla içilen sıcak yemek", "çorba"),
      fa("sebze ve meyve satılan yer", "pazar"),
      fa("alışveriş sokağı", "çarşı"),
      fa("doktora giden kişi", "hasta"),
      fa("pencerenin önünden sarkar", "perde"),
      fa("musluğu olan su kaynağı", "çeşme"),
      fa("kampta kurulan bez ev", "çadır"),
      fa("çiçeklerin açtığı mevsim", "bahar"),
      fa("içi kırmızı tanelerle dolu", "nar"),
      fa("kendini gördüğün cam", "ayna"),
      fa("yerde serilen dokuma", "kilim"),
    ] },
    { id: "bati", titel: "Batı dillerinden gelen kelimeler", paare: [
      fr("bacaklara giyilen giysi", "pantolon"),
      fr("gömleğin yakasına bağlanır", "kravat"),
      fr("pedalla giden iki tekerlek", "bisiklet"),
      fr("katlar arasında seni taşır", "asansör"),
      fr("arabayı kullanan kişi", "şoför"),
      fr("otobüse binmek için alınır", "bilet"),
      it("evin dışa açılan küçük yeri", "balkon"),
      it("odaları birbirine bağlayan yol", "koridor"),
      en("iki dilim ekmeğin arası", "sandviç"),
      en("raylarda giden şehir aracı", "tramvay"),
      fr("başa takılır", "şapka"),
      fr("kışın giyilen kalın giysi", "palto"),
      fr("yük taşıyan büyük araç", "kamyon"),
      fr("para verip bindiğin araba", "taksi"),
      fr("raylarda giden uzun araç", "tren"),
    ] },
    { id: "aile", titel: "Kelime aileleri", paare: [
      ek("gözün önüne takılır", "gözlük"),
      ek("gözlük satan kişi", "gözlükçü"),
      ek("süt satan kişi", "sütçü"),
      ek("kitapların dizildiği raf", "kitaplık"),
      ek("kitap satan kişi", "kitapçı"),
      ek("balık tutan kişi", "balıkçı"),
      ek("çiçek satan kişi", "çiçekçi"),
      ek("dişleri tedavi eden kişi", "dişçi"),
      ek("tuzun konulduğu kap", "tuzluk"),
      ek("ayağa giyilir", "ayakkabı"),
      ek("ayakkabı tamir eden kişi", "ayakkabıcı"),
      ek("gökte uçan araç", "uçak"),
      ek("ipiyle gökte tutulur", "uçurtma"),
      ek("yarışta koşan kişi", "koşucu"),
      ek("okulda öğrenen kişi", "öğrenci"),
    ] },
  ],
  // ------------------------------------------------------------ teens (12-15)
  teens: [
    { id: "yunanca-latince", titel: "Yunanca ve Latince kökler", paare: [
      yu("canlıları inceleyen bilim", "biyoloji"),
      yu("yerin taşlarını inceler", "jeoloji"),
      yu("dünyayı saran hava tabakası", "atmosfer"),
      yu("sıcaklığı ölçer", "termometre"),
      yu("harflerin sıralı dizisi", "alfabe"),
      yu("şekilleri inceleyen bilim", "geometri"),
      yu("iki yanı birbirine benzer", "simetri"),
      yu("eski çağların efsaneleri", "mitoloji"),
      yu("eski kalıntıları kazıp arar", "arkeoloji"),
      yu("yıldızları inceleyen bilim", "astronomi"),
      yu("maddenin en küçük yapı taşı", "atom"),
      yu("canlı ve çevre ilişkisi", "ekoloji"),
      yu("iş yapabilme gücü", "enerji"),
      yu("gözle görülmeyen canlı", "mikrop"),
      la("taşlaşmış eski canlı izi", "fosil"),
      yu("en hafif gaz", "hidrojen"),
      yu("nefes almak için gereken gaz", "oksijen"),
      yu("bitkinin besin yapması", "fotosentez"),
      yu("sesi kaydeden alet", "mikrofon"),
      yu("iki kişinin konuşması", "diyalog"),
    ] },
    { id: "arapca", titel: "Arapçadan gelen kelimeler", paare: [
      ar("aklında kurduğun görüntü", "hayal"),
      ar("aklına gelen düşünce", "fikir"),
      ar("yılın dört bölümünden biri", "mevsim"),
      ar("saatle ölçülen süre", "zaman"),
      ar("komşuların yaşadığı bölge", "mahalle"),
      ar("geniş şehir yolu", "cadde"),
      ar("zarfla gönderilen yazı", "mektup"),
      ar("yemeği içine koyarız", "tabak"),
      ar("kapaklı büyük kutu", "sandık"),
      ar("doğanın başka adı", "tabiat"),
      ar("yerleri gösteren çizim", "harita"),
      ar("şehrin geniş açık alanı", "meydan"),
      ar("dağdan denize akan su", "nehir"),
      ar("denizin kıyı şeridi", "sahil"),
      ar("anlamı tamamlayan söz dizisi", "cümle"),
    ] },
    { id: "farsca", titel: "Farsçadan gelen kelimeler", paare: [
      fa("çölde yürüyen deve dizisi", "kervan"),
      fa("renkli desenli seramik", "çini"),
      fa("büyük yerleşim yeri", "şehir"),
      fa("henüz açılmamış çiçek", "gonca"),
      fa("baharda açan soğanlı çiçek", "lale"),
      fa("masaya getirilen su kabı", "sürahi"),
      fa("sütten yapılan kahvaltılık", "peynir"),
      fa("kırmızı ile beyazın karışımı", "pembe"),
      fa("koyu mavi renk", "lacivert"),
      fa("portakal rengi", "turuncu"),
      fa("sebze ekilen tarla", "bostan"),
      fa("omuza atılan kumaş", "şal"),
      fa("hamamda belden sarılan bez", "peştamal"),
      fa("dönen kanatlı parça", "pervane"),
      fa("asmaya yarayan kıvrık kanca", "çengel"),
    ] },
    { id: "bati", titel: "Batı dillerinden gelen kelimeler", paare: [
      it("yıkandığın oda", "banyo"),
      it("paranın saklandığı kurum", "banka"),
      en("fırında pişen kabaran tatlı", "kek"),
      fr("yüze sürülen boya", "makyaj"),
      fr("iki sokağı bağlayan kapalı yol", "pasaj"),
      fr("mağazanın camlı ön yüzü", "vitrin"),
      it("yolculukta eşya konan çanta", "bavul"),
      fr("saçı kesen kişi", "kuaför"),
      fr("serinleten güzel kokulu sıvı", "kolonya"),
      fr("beklenmedik güzel şey", "sürpriz"),
      fr("masaya yemek getiren kişi", "garson"),
      fr("ayakta bir şeyler alınan yer", "büfe"),
      fr("kollu, hafif bir üst giysi", "bluz"),
      fr("gömleğin üstüne giyilir", "ceket"),
      fr("biletin satıldığı küçük pencere", "gişe"),
    ] },
    { id: "aile", titel: "Kelime aileleri", paare: [
      ek("kitap okuyan kişi", "okuyucu"),
      ek("kitap yazan kişi", "yazar"),
      ek("sayfaya basan makine", "yazıcı"),
      ek("öğrenilmiş şeylerin tümü", "bilgi"),
      ek("araştırarak edinilen bilgi", "bilim"),
      ek("bilgiyi işleyen makine", "bilgisayar"),
      ek("bilmeni isteyen kısa soru", "bilmece"),
      ek("sevmekten doğan duygu", "sevgi"),
      ek("sevinince duyulan mutluluk", "sevinç"),
      ek("okulda öğreten kişi", "öğretmen"),
      ek("konuşmayı dinleyen kişi", "dinleyici"),
      ek("suda yüzen sporcu", "yüzücü"),
      ek("çiçek konulan kap", "çiçeklik"),
      ek("ağaçların çok olduğu yer", "ağaçlık"),
      ek("başa takılan şey", "başlık"),
    ] },
  ],
  // ------------------------------------------------------------ erwachsen (16+)
  erwachsen: [
    { id: "yunanca-latince", titel: "Yunanca ve Latince kökler", paare: [
      yu("kelimelerin kökenini inceler", "etimoloji"),
      yu("insanı ve kültürü inceler", "antropoloji"),
      yu("davranış ve zihin bilimi", "psikoloji"),
      yu("dil ve edebiyat bilimi", "filoloji"),
      yu("olayların zaman sırası", "kronoloji"),
      yu("benzetmeyle kurulan anlatım", "metafor"),
      yu("parçalarına ayırarak inceleme", "analiz"),
      yu("parçaları birleştirme", "sentez"),
      yu("denenmemiş ön varsayım", "hipotez"),
      yu("çelişkili görünen gerçek", "paradoks"),
      yu("orkestra için büyük eser", "senfoni"),
      yu("ürünlerin resimli listesi", "katalog"),
      yu("her konuda bilgi kitabı", "ansiklopedi"),
      yu("ilişkiyi gösteren çizim", "diyagram"),
      yu("seslerin bilimi", "fonetik"),
      yu("birbirine bağlı düzen", "sistem"),
      yu("karar için ölçüt", "kriter"),
      yu("evrenin düzeni", "kozmos"),
      yu("eski belgelerin saklandığı yer", "arşiv"),
      yu("bir eserin ana konusu", "tema"),
    ] },
    { id: "arapca", titel: "Arapçadan gelen kelimeler", paare: [
      ar("içinde yaşadığımız gezegen", "dünya"),
      ar("çözüm bekleyen konu", "mesele"),
      ar("gerekli olan şey", "ihtiyaç"),
      ar("bir işten gelen yarar", "fayda"),
      ar("giyilen şeylerin tümü", "kıyafet"),
      ar("rahat ve uzun konuşma", "sohbet"),
      ar("saklanmış değerli şeyler", "hazine"),
      ar("minnet gösteren söz", "teşekkür"),
      ar("korkuya rağmen girişme gücü", "cesaret"),
      ar("sayılarla yapılan işlem", "hesap"),
      ar("yaşayarak edinilen bilgi", "tecrübe"),
      ar("yeni bir şeyin bulunması", "keşif"),
      ar("geçmişi inceleyen bilim", "tarih"),
      ar("yapı ve makine tasarlar", "mühendis"),
      ar("binaların planını çizer", "mimar"),
    ] },
    { id: "farsca", titel: "Farsçadan gelen kelimeler", paare: [
      fa("uzun yastıklı kanepe", "divan"),
      fa("ustalıkla gösterilen beceri", "hüner"),
      fa("bütün dünya, eski söyleyişle", "cihan"),
      fa("kahramanlıkları anlatan şiir", "destan"),
      fa("kök sebze, suyu da içilir", "şalgam"),
      fa("parası hemen verilen", "peşin"),
      fa("yapmamak için öne sürülen söz", "bahane"),
      fa("iz, işaret, belirti", "nişan"),
      fa("meyveden yapılan tatlı sürme", "reçel"),
      fa("iş kurmak için gereken para", "sermaye"),
      fa("yağlı güreşçi", "pehlivan"),
      fa("neşeli, gürültülü eğlence", "cümbüş"),
      fa("masallarda kanatlı büyülü varlık", "peri"),
      fa("belde pantolonu tutar", "kemer"),
      fa("yatağın üstüne serilir", "çarşaf"),
    ] },
    { id: "bati", titel: "Batı dillerinden gelen kelimeler", paare: [
      fr("dışarıda yemek yenen yer", "restoran"),
      fr("büyük perdede film izlenir", "sinema"),
      fr("görüntü kaydeden alet", "kamera"),
      fr("küçük kapalı bölme", "kabin"),
      fr("boyuna veya başa sarılan kumaş", "eşarp"),
      fr("işi insan yerine yapan düzen", "makine"),
      fr("aracı hareket ettiren parça", "motor"),
      fr("arabanın yakıtı", "benzin"),
      fr("tekerleğin kauçuk kaplaması", "lastik"),
      en("trenin yolcu bölümü", "vagon"),
      fr("yolcuların tren beklediği yer", "peron"),
      fr("trenlerin durduğu yer", "istasyon"),
      it("çok ürünün yapıldığı yer", "fabrika"),
      it("kazanç ve borcun tablosu", "bilanço"),
      it("satın alınanın yazılı belgesi", "fatura"),
    ] },
    { id: "aile", titel: "Kelime aileleri", paare: [
      ek("bilimle ilgili olan", "bilimsel"),
      ek("farkında olma durumu", "bilinç"),
      ek("filmi yöneten kişi", "yönetmen"),
      ek("bir işte izlenen yol", "yöntem"),
      ek("aklında kurduğun fikir", "düşünce"),
      ek("derin düşünen kişi", "düşünür"),
      ek("bir şeyi kullanan kişi", "kullanıcı"),
      ek("çok çalışmayı seven", "çalışkan"),
      ek("sorunun giderilme yolu", "çözüm"),
      ek("bilgisayara yazılmış program", "yazılım"),
      ek("bilgisayarın somut parçaları", "donanım"),
      ek("gözle ilgili, resimli", "görsel"),
      ek("araştırma yapan kişi", "araştırmacı"),
      ek("yeni şeyler üreten kişi", "yaratıcı"),
      ek("telefondaki program", "uygulama"),
    ] },
  ],
};

/** Die Zeile eines Paares: zuerst die Umschreibung, dann das Wort. */
export function kokZeile(x: KokPaar): string {
  return `${x.ipucu} - ${x.kelime}`;
}

/**
 * Dieselben Wörter, alphabetisch nach `ipucu` (türkische Sortierung) - für die Tippchallenge, wie `RADICI_ALFABETICO`.
 */
export const KOKLER_ALFABETIK: Record<KokStufe, string[]> = Object.fromEntries(
  (Object.keys(KOKLER) as KokStufe[]).map((stufe) => [
    stufe,
    KOKLER[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.ipucu.localeCompare(b.ipucu, "tr"))
      .map(kokZeile),
  ]),
) as Record<KokStufe, string[]>;
