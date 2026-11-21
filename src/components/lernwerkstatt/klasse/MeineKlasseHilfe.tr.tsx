/**
 * ★★★ O-TR (02.10.2026): DIE HILFE ZU "MEINE KLASSEN" AUF TÜRKISCH.
 * ===========================================================================
 * Massgeblich ist die deutsche Fassung (`MeineKlasseHilfe.tsx`): dieselben
 * Abschnitte, dieselben Tatsachen; der Aufbau folgt `MeineKlasseHilfe.pl.tsx`.
 * Sichtbar nur mit `spracheGewaehlt === "tr"`; jedes Programm ohne
 * Sprach-Anbieter zeigt weiter die deutsche Fassung.
 *
 * Anrede (Glossar `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md`, Regel 1):
 * die Lehrkraft mit siz und der Befehlsform auf -(y)In ("seçin", "girin",
 * "basın"), nie die Amtsform auf -(y)InIz; Knöpfe im blossen Stamm. Kinder
 * heissen in dieser Sicht "öğrenci". Was die Lehrkraft der Klasse sagt, steht
 * in der Mehrzahl (siz), damit auf dem Bildschirm sen und siz nie gemischt
 * werden. Keine Endung an Platzhalter, Zahlen, Tastennamen oder "Tastenflow"
 * (Regel 6): die Endung hängt an "tuş", "düğme", "program". Tastenwege, nie
 * Maus-Wörter. Die Startpunkte werden - wie in der polnischen Fassung - über
 * ihre Tasten beschrieben (Weg "tr", `lernweg.ts`, nur gelesen).
 */
import { Modal } from "@/components/Modal";
import { RundgangMeineKlassenKnopf } from "@/components/typing/Rundgang";
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import { EINSTIEGSFENSTER_MIN } from "@/lib/typing/schreibprobe";

function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="m-0 text-base font-semibold text-ink">{titel}</h3>
      <div className="space-y-1.5 text-sm leading-relaxed text-ink">{children}</div>
    </section>
  );
}

function Taste({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-hairline bg-surface-sunken px-1.5 py-0.5 text-sm text-ink">
      {children}
    </kbd>
  );
}

// ★ O-TR (02.10.2026): "Yarışma" (Glossar §2.3) steht ausgeschrieben im Text -
// eine Konstante wäre ein Platzhalter, an den keine Endung darf.
export function MeineKlasseHilfeTuerkisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  return (
    <Modal title='Yardım - "Sınıflarım"' onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Burada sınıfınızla çalışırsınız. Sınıfları ve hesapları{" "}
          <strong>bir kez</strong> oluşturursunuz - aynı sınıf kodu ve aynı
          şifreyle her programda geçerlidir.
          {tastenflow && (
            <>
              {" "}
              Öğretmen olarak Tastenflow programını açtığınızda her zaman buraya
              gelirsiniz. Kendi alıştırmanıza "Alıştırma yap" düğmesi (
              <Taste>Alt</Taste> + <Taste>U</Taste>) götürür.
            </>
          )}
        </p>

        <Abschnitt titel="Sayfanın düzeni">
          <p className="m-0">
            <strong>Sınıfın başlık satırında</strong> sınıfın adı - birden fazla
            sınıfınız varsa sınıf değiştirdiğiniz "Sınıf" seçim listesinde -,
            öğrenci sayısı ve sınıf kodu bulunur. Bu satırın sağında, "İndirmeler"
            düğmesinin önünde <strong>"İlerleme | Öğrenciler ve girişler"</strong>{" "}
            geçiş düğmesi vardır - götürdüğü iki ekranda da aynı yerde.
          </p>
          <p className="m-0">
            <strong>"Öğrenciler ve girişler"</strong> bölümünde yeni bir sınıf
            oluşturur, öğrenci ekler ve başka sınıfa taşırsınız; şifreleri, giriş
            bilgilerini, sınıf kodunu ve sınıfın hangi programları kullandığını
            görürsünüz. Çok sayıda öğrenciyi bir kerede orada, "Öğrenciler"
            bölümünde <strong>"Excel dosyasından öğrenci ekle"</strong> ile
            eklersiniz: önce "Şablonu indir (Excel)", sonra her öğrenci için ad,
            şifre ve - Tastenflow için - başlangıç noktası içeren bir satır. Boş
            bırakılan şifreyi program kendisi oluşturur; bir önizleme neyin
            aktarılacağını gösterir, aktarılan tüm öğrenciler ardından "Giriş
            bilgilerini yazdır" altında yer alır. Yanındaki{" "}
            <strong>"Sınıf listesini indir"</strong> ile bu sınıftaki TÜM
            öğrencilerin adını, şifresini ve sınıf kodunu içeren bir Word
            dosyasını istediğiniz zaman indirebilirsiniz - yazdırmak için.
            {!tastenflow && (
              <>
                {" "}
                Tüm öğrencilere bir mesajı orada "Sınıfa mesaj" ile yazarsınız.
              </>
            )}
          </p>
          <p className="m-0">
            <strong>"İlerleme"</strong> bölümünde - sayfayı açtığınızda buraya
            gelirsiniz - bu sınıfın programları, "İndirmeler" ve altında sınıf
            istatistikleri bulunur: her öğrencinin ne kadar ilerlediği.
            {tastenflow && (
              <>
                {" "}
                En üstte bir düğme satırı vardır: <strong>Yarışma</strong>,{" "}
                <strong>Kişisel alıştırma</strong>,{" "}
                <strong>Haftalık hedef</strong>, <strong>Sınıf ayarları</strong>{" "}
                ve <strong>Hedefi 1 saat durdur</strong>. Her düğme altında kendi
                bölümünü açar - aynı anda yalnızca biri açık olur ve{" "}
                <Taste>Esc</Taste> tuşu onu yeniden kapatır. "Yarışma" düğmesi,
                "Kullanılan tuşlar" ve "Dakika" alanlarıyla "Şimdi başlat"
                düğmesini içeren formu ve geçmiş yarışmaları açar; "Kişisel
                alıştırma" tüm sınıf için bir metin belirler (dosya yükleyerek,
                "Metinlerim" içinden ya da kurstaki bir şablondan - öğrenciler
                bunun için yalnızca "Devam et" düğmesi olan bir pencere görür);
                "Haftalık hedef" haftalık dakikayı ayarlar; "Hedefi 1 saat
                durdur", sınıfın çalışmaya devam ettiği ama haftalık hedefe hiçbir
                şeyin sayılmadığı 60 dakikalık bir süre başlatır. Bunun altında
                "Sınıfa genel bakış" yer alır (ay veya öğretim yılı, puan çubuğu
                ve çizgi grafikle); onun başlık satırının sağında "Sınıfa mesaj"
                bulunur - tüm öğrencilere tek bir mesaj, her öğrenci onu kendi
                konuşmasında alır.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              Bu satırdaki <strong>"Sınıf ayarları"</strong> düğmesi şunları açar:
              sınıf düzeyi (program metin türlerini buna göre seçer ve her öğretim
              yılında bir düzey ilerletir; "Yetişkin" ilerlemez), kilidiyle
              birlikte dil, sınıfın başlangıç noktası (sonradan katılan
              öğrenciler için de geçerlidir) ve Sınıf Maçı. Bu dördü tüm sınıf
              için geçerlidir ve sınıf oluşturulurken sorulur; her öğrencinin
              açılan satırında "Nereden başlansın?", "Tek elle yazma" ve "Acele
              yok" kalır.
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              <strong>"Nereden başlansın?"</strong> seçeneğindeki düzeyler
              tuşlara göre sıralanır: ilki yalnızca F ve J, ikincisi temel sıranın
              tamamı (f j d k s l a ş). Üçüncüsü en sık kullanılan sonraki
              harfleri - e i n m b r ı t y o u - ve Shift tuşunu ekler.
              Sonrakiler - tüm harfler, noktalama işaretleri, rakamlar ve tüm
              tuşlar - geri kalanını sırayla açar.
            </p>
          )}
          <p className="m-0">
            Her düğme kendini açıklar: odak Tab tuşuyla düğmeye geldiğinde bir
            ipucu görünür. <Taste>Esc</Taste> tuşu ipucunu kapatır.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel="Adım adım Yarışma">
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Sınıf istatistiklerinin en üstünde, görev satırında "Yarışma"
                düğmesi formu açar.
              </li>
              <li>
                <strong>Kullanılan tuşları</strong> seçin - tüm öğrenciler bu
                düzeyde aynı metni alır.
              </li>
              <li>
                <strong>Yarışma süresini</strong> dakika olarak girin - alan hemen
                yanındadır.
              </li>
              <li>
                Öğrencilere şunu söyleyin: <em>Süre, ilk tuşa bastığınız anda
                başlar.</em> Başlatmadan sonra öğrencilerin başlamak için{" "}
                {EINSTIEGSFENSTER_MIN} dakikası vardır; yarışma süresi her öğrenci
                için ayrı işler.
              </li>
              <li>
                <strong>"Şimdi başlat"</strong> düğmesine basın - Yarışma tüm
                sınıf için hemen başlar.
              </li>
              <li>
                Hemen ardından orada örneğin{" "}
                <strong>"Hazır: 12 kişi, toplam 14 - henüz değil: Said, Jano"</strong>{" "}
                görünür: Yarışma 12 öğrencinin cihazına ulaşmıştır. Bu satır
                yaklaşık bir saniye sonra görünür. Bir öğrenci uzun süre "henüz
                değil" altında kalırsa, sayfayı bir kez yenilemek genellikle yeter.
              </li>
              <li>
                Yarışma sürerken "Teslim eden: 3 kişi, toplam 18" satırını ve adları
                görürsünüz.
              </li>
              <li>
                Ardından sonuçlar formun altında görünür: her öğrenci için sıra,{" "}
                <strong>yarışma puanı</strong>, sesli okuma kullanılıp
                kullanılmadığı, dakikada vuruş, doğruluk, karakter sayısı, hata
                sayısı ve henüz oturmamış tuşlar. Ayrıca toplu bir e-posta gelir.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Tablonun sütunları ne anlama gelir">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Zorluk seviyesi ne anlama gelir">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Not verirken dayanabileceğiniz değerler">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Sınıf kodu">
          <p className="m-0">
            Üstte sınıf adının yanında görünür ve tüm programlarda geçerlidir.
            Giriş yaparken sınıf kodu, ad ve şifre girilir; cihaz kodu hatırlar,
            sonrasında ad ve şifre yeterlidir.
          </p>
          <p className="m-0">
            Sınıf oluştururken <strong>zorunludur</strong>. Siz adı yazarken
            program uygun bir kod önerir - "4B Kaya" adından "4BKAYA" kodu olur.
            Kodu değiştirebilirsiniz ama boş bırakamazsınız. Daha sonra
            "Öğrenciler ve girişler" bölümünde "Düzenle" düğmesiyle
            değiştirilir.
          </p>
          <p className="m-0">
            ⚠️ Kodu değiştirirseniz sınıftaki tüm öğrenciler o andan itibaren
            yeni kodla giriş yapar.
          </p>
        </Abschnitt>

        <Abschnitt titel="Bir öğrenciyi başka sınıfa taşımak">
          <p className="m-0">
            "Öğrenciler ve girişler" bölümünde her öğrencinin yanında{" "}
            <strong>"Başka sınıfa taşı"</strong> düğmesi vardır. Bu düğme "Yeni
            sınıfın kodu" alanını açar. Kodunu bildiğiniz her sınıfa
            taşıyabilirsiniz - başka bir öğretmenin sınıfına da. Taşımadan önce
            program bir kez daha onay ister.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Öğrenci bundan sonra yeni sınıf koduyla giriş yapar.</li>
            <li>Yeni sınıfın öğretmenleri öğrenciyi ve ilerlemesini görür.</li>
            <li>
              {tastenflow
                ? "Yarışma sonuçları ve mesajlar önceki sınıfta kalır."
                : "Mesajlar önceki sınıfta kalır."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Bu bölümdeki klavye kısayolları">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> bu yardımı açar ve kapatır.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> tüm klavye kısayollarının
            listesini gösterir. <Taste>Alt</Taste> + <Taste>U</Taste> kendi
            alıştırmanıza götürür. <Taste>Alt</Taste> + <Taste>N</Taste>{" "}
            mesajları, <Taste>Alt</Taste> + <Taste>K</Taste> renk ve karşıtlık
            seçimini, <Taste>Alt</Taste> + <Taste>J</Taste> ise hesap menüsünü
            açar.
          </p>
          <p className="m-0">
            Sekmeler arasında Tab tuşuyla gezersiniz; Enter tuşu sekmeyi
            değiştirir. Değişiklikten sonra odak yeni bölümdedir - ekran okuyucu
            oradan okumaya devam eder.
          </p>
        </Abschnitt>

        <Abschnitt titel="Daha ayrıntılı bilgi">
          <p className="m-0">
            Öğretmen kılavuzunu üstte "İndirmeler" altında açarsınız - orada
            yazdırıp asmak için Tastenflow afişi (A3) de vardır; afiş herkese
            açıktır, giriş yapmadan da indirilebilir. Kılavuz ve afiş şimdilik
            İngilizcedir.
            {tastenflow && (
              <>
                {" "}
                Programın kendi yardımını orada <Taste>Alt</Taste> +{" "}
                <Taste>H</Taste> ile açarsınız.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
