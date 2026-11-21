/**
 * ★★★ O-TR (02.10.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE, TÜRKISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, in derselben Reihenfolge wie die deutsche,
 * englische, französische, spanische, italienische und polnische Fassung (1
 * bis 12, samt 4a, 4b, 8a, 8b) - wer eine Stelle prüft, findet sie in allen
 * sieben. Sichtbar nur mit `spracheGewaehlt === "tr"` (`LehrerHilfe.tsx`).
 * Titel nach Glossar §2.5/§2.6: "Öğretmenler için yardım" (Hilfe = Yardım,
 * Lehrkräfte = öğretmenler; "için" ist ein eigenes Wort, keine Endung).
 *
 * ── ANREDE (Glossar `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md`, Regel 1) ──
 * siz mit der Befehlsform auf -(y)In ("seçin", "basın", "açın"), nie die
 * Amtsform auf -(y)InIz; Knöpfe im blossen Stamm ("Sınıf oluştur", "Şimdi
 * başlat"). Kinder heissen "öğrenci", Lehrkräfte "öğretmen". Keine
 * Ausrufezeichen.
 *
 * ── WAS TÜRKISCH ANDERS IST ─────────────────────────────────────────────────
 *  · KEINE Endung an Platzhalter, Zahlen, Tastennamen, Produktnamen oder
 *    "Tastenflow" (Glossar Regel 6): die Endung hängt an "tuş", "düğme",
 *    "program", "madde", "dakika"; nach einer Zahl steht die Einzahl - darum
 *    braucht diese Fassung kein `mehrzahl`. Das Wort der Tippchallenge steht
 *    ausgeschrieben ("Yarışma"), damit keine Endung an einen Platzhalter muss.
 *  · Score-Erklärung und Kurven-Hinweis stehen hier ausgeschrieben - es gibt
 *    (noch) keine türkischen Konstanten wie `SCORE_ERKLAERUNG_IT_INSEGNANTE`.
 *  · Abschnitt 4: der Weg "tr" hat seit F4 eine eigene, gemessene Reihenfolge
 *    für Türkçe Q (`lernweg.ts`, `TR_LETTER_ORDER`, nur gelesen); Türkçe F hat
 *    noch keinen Weg (`TUERKISCHE_WEG_LAYOUT_IDS`).
 *  · Tastatur: i/ı auf zwei Tasten, ğ ü ş i ö ç rechts von p, l, m, Totaste
 *    `^` (Umschalt + 3) für â î û, Apostroph Umschalt + 2 (`layouts.ts`,
 *    `TR_Q`, nur gelesen). Kein Ersatzbuchstabe.
 *  · Schuljahr: im Programm ab 1. August (in der Türkei beginnt der
 *    Unterricht im September; `schuljahrBeginn.ts`).
 *  · Abschnitt 12: ★ TR-H (10.10.2026) das Handbuch gibt es auf Türkisch
 *    (`tastenflow-handbuch-tr.pdf`, `HandbuchKnopf` lädt es für „tr"); das
 *    Plakat noch nicht (Bild der Oberfläche fehlt) - der Knopf lädt das
 *    englische, und der Text sagt das.
 *
 * Gerade Anführungszeichen, nur Bindestrich, keine Maus-Wörter, Person zuerst
 * ("görme yetersizliği olan öğrenciler").
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, MIND_ZEICHEN, PROBEN_JE_NIVEAU } from "@/lib/typing/schreibprobe";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { useFocusTrap } from "./useFocusTrap";
import { DidaktikInhalt, didaktikAbschnittTitel } from "./DidaktikHinweise";
import { DreiWerteHilfe, LeistungsstufeHilfe } from "./TastenflowZahlenHilfe";
import { RundgangLehrkraftKnoepfe } from "./Rundgang";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { handbuecherFuer, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

/** Das Handbuch - derselbe Knopf wie in den anderen Fassungen. */
function HandbuchLaden() {
  const h = handbuecherFuer("tippen")[0];
  if (!h) throw new Error("Kein Tastenflow-Handbuch in HANDBUECHER");
  return (
    <p className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </p>
  );
}

/** Das Plakat - `div` statt `p` (der Knopf kann einen Fehler-Absatz zeigen). */
function PlakatLaden() {
  return (
    <div className="m-0">
      <HandbuchKnopf alsLink handbuch={tastenflowPlakat()} />
    </div>
  );
}

// ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): `Kbd` und `AltText` aus
//   der Kinder-Hilfe - am Mac heißt die Taste „Wahl" (Option, Opción …), im
//   Kästchen wie im Satz. Vorher stand hier ein eigenes `Kbd`, das immer „Alt" zeigte.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

export function LehrerHilfeTuerkisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Tastenflow - öğretmenler için yardım"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Öğretmenler için yardım: Tastenflow - tüm özellikler
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Yardımı kapat"
          >
            ✕ Kapat
          </button>
        </div>
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          Tastenflow programının <strong>kendi hesap sistemi</strong> vardır;
          öğrenme platformundaki girişten tamamen ayrıdır. Burada giriş yapmak
          platformdaki oturumu etkilemez - tersi de geçerlidir.
        </p>

        <Section title="1 · Sınıf ve hesap oluşturma">
          <p className="m-0">
            Öğretmen olarak Tastenflow programını açtığınızda her zaman{" "}
            <strong>"Sınıflarım"</strong> bölümüne gelirsiniz; kendi
            alıştırmanıza "Alıştırma yap" düğmesi (<Kbd>Alt</Kbd> +{" "}
            <Kbd>U</Kbd>) götürür. Sınıfı sağ üstteki{" "}
            <strong>"Öğrenciler ve girişler"</strong> bölümünde, açılır{" "}
            <strong>"Yeni sınıf oluştur"</strong> alanında oluşturursunuz.{" "}
            <strong>Sınıf kodu</strong> zorunludur: siz adı yazarken program
            uygun bir kod önerir ("5A Ankara" adından "5AANKARA" olur); kodu
            örneğin <code>5A-ANK</code> olarak değiştirebilirsiniz. Kod tüm sınıf
            için geçerlidir. Aynı alanda <strong>sınıf düzeyini</strong> ve{" "}
            <strong>başlangıç noktasını</strong> seçin, dili (kilidiyle) ve Sınıf
            Maçı ayarını kontrol edin - bunlar "Sınıf ayarları" bölümündeki
            alanların aynısıdır. <strong>"Sınıf oluştur"</strong> düğmesi ancak
            her şey doldurulduğunda çalışır; aksi halde bir cümle neyin eksik
            olduğunu söyler ve odak ilk eksik alana gider.
          </p>
          <p className="m-0">
            Ardından <strong>"Öğrenci ekle"</strong> ile öğrencileri{" "}
            <strong>ad ve şifreyle</strong> eklersiniz. Öğrenciler sonra{" "}
            <strong>her cihazdan</strong> <em>sınıf kodu, ad ve şifre</em> ile
            giriş yapabilir. Cihaz sınıf kodunu hatırlar; böylece öğrenciler
            yalnızca ad ve şifre girer.
          </p>
          <p className="m-0">
            Sınıf adını ve sınıf kodunu daha sonra <strong>"✏️ Düzenle"</strong>{" "}
            ile değiştirebilirsiniz - yeni kod sınıftaki tüm öğrenciler için
            geçerli olur (o andan itibaren yeni kodla giriş yaparlar).
          </p>
          <p className="m-0">
            <strong>Başka bir yol:</strong> hiçbir sınıfa ait olmayan kişiler{" "}
            <strong>kendileri de hesap oluşturabilir</strong> - giriş
            penceresinde "Tek başıma, sınıfsız çalışıyorum" kutusunu işaretleyip
            bir e-posta adresi girerek. Sizin için bir şey değişmez: bu hesaplar
            hiçbir sınıfa ait değildir, listelerinizin hiçbirinde görünmez ve
            haftalık raporlarını kendileri alır. Sınıfınızda her şey eskisi gibi
            kalır - öğrenci hesaplarını siz oluşturursunuz.
          </p>
        </Section>

        <Section title="2 · Sınıf ayarları ve öğrenci ayarları">
          <p className="m-0">
            <strong>Tüm sınıf için</strong> (tablonun üstündeki görev satırında,
            Yarışma, Kişisel alıştırma, Haftalık hedef ve Hedefi 1 saat durdur
            düğmelerinin yanındaki "Sınıf ayarları" düğmesi - kapalıyken bile
            sınıf düzeyini, dili ve Sınıf Maçı ayarını gösterir):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Sınıf düzeyi:</strong> program metin düzeyini buradan
              hesaplar - alıştırma metinlerinin kelime dağarcığı, şakaların türü
              ve üslubu. Ortaokul 7. sınıf yaklaşık 13 yaş demektir, yani 11-15
              yaş metinleri. <strong>Sınıfla birlikte büyür:</strong> program
              kaydın yapıldığı öğretim yılını hatırlar ve siz hiçbir şey
              ayarlamadan her yıl bir düzey ilerletir. Programda{" "}
              <strong>öğretim yılı 1 Ağustos tarihinde başlar</strong> ve 31 Temmuz
              tarihinde biter - "Sınıf ayarları" içinde başka bir başlangıç ayı
              seçilmediyse (Türkiye'de dersler Eylül ayında başlar; 1 Ağustos
              henüz yaz tatilindedir). Yılın başında sınıf bir sonraki düzeye
              geçer; öğretim yılı istatistikleri de aynı takvime uyar. Yetişkin
              grupları için <strong>"Yetişkin"</strong> düzeyi vardır - bu düzey
              ilerlemez. Sınıftaki öğrencilerin doğum yılı sorulmaz.
            </li>
            <li>
              <strong>Dil ve kilit:</strong> tüm sınıfın alıştırma kelimeleri ve
              metinleri için dil - sınıfın ana dili (örneğin Türkçe) veya
              İngilizce; yanındaki kilitle öğrenciler dili artık kendileri
              değiştiremez. Üstteki yuvarlak dil düğmesi (dünya simgeli) her
              öğrencide vardır: düğmeleri ve menüleri, aynı anda alıştırma
              metinlerini de değiştirir - kilit varsa yalnızca düğmeleri ve
              menüleri.
            </li>
            <li>
              <strong>Sınıfın başlangıç noktası:</strong> "Nereden başlansın?"
              sorusunun tüm sınıf için yanıtı - sonradan katılan her öğrenci için
              de geçerlidir ve yalnızca tuş ekler: daha ileride olan bir öğrenci
              hiçbir şey kaybetmez. Seçtiğiniz anda program bu noktayı mevcut
              öğrencilere de işler; daha ileride olan öğrenciler varsa önce sorar
              ve üç yol sunar: herkesi bu noktaya ayarlamak, yalnızca henüz o kadar
              ilerlememiş olanları ayarlamak ya da iptal etmek. Değişiklik,
              öğrenci Tastenflow programını bir sonraki açışında geçerli olur;
              istatistikler ve rozetler her durumda korunur.
            </li>
            <li>
              <strong>Sınıf Maçına izin ver:</strong> öğrenciler birbirini beş
              dakikalık bir maça davet edebilir. Açılan satırdaki "Çalışma
              süreleri" bölümünde bir öğrencinin haftada kaç kez katıldığını
              görürsünüz - sıralama yok, süre yok.
            </li>
            <li>
              <strong>Satırı Enter tuşuyla bitir:</strong> işaretliyse sınıftaki
              her öğrenci her alıştırma satırını Enter tuşuyla bitirir - ofiste
              yazarken olduğu gibi. "Antrenmanım", "Öyküler", "Kişisel
              alıştırma", satırlı kelime oyunları, Yarışma ve Sınıf Maçı için
              geçerlidir; bilmeceler, "Karışık harfler", "Parmak dikte", "Kutup
              Keşfi" ve "Tuşları Keşfet" için geçerli değildir. Varsayılan:
              kapalı.
            </li>
          </ul>
          <p className="m-0">
            <strong>Her öğrenci için</strong> (satırındaki okla açılır):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Klavye:</strong> Ayarlar (dişli simgesi) içindeki "Klavye"
              bölümünden seçilir - Türkiye'de genellikle Türkçe Q klavye
              (Windows: "Türkçe Q", Mac: "Turkish - QWERTY - PC"). Bu ayar hesap
              için değil, bu cihaz için geçerlidir ve ekran klavyesini, parmak
              ipuçlarını ve hangi karakterlerin çalışılacağını belirler. Türkçe Q
              klavyede: (1) ğ ve ü p harfinin, ş ve i l harfinin, ö ve ç m
              harfinin sağında kendi tuşlarında durur; (2){" "}
              <strong>noktalı i ile noktasız ı iki ayrı tuştur</strong>: ı,
              Almanca klavyede i harfinin bulunduğu yerdedir; büyük harfleri İ ve
              I olur; (3) bir harfin yerine başka bir harf geçmez - ş yerine s, ı
              yerine i yazmak yanlış tuştur, çünkü başka bir kelime ortaya çıkar;
              (4) â, î ve û şapka tuşuyla (^, Shift + 3) ve ardından ünlüyle
              yazılır; kesme işareti Shift + 2 ile yazılır. Türkçe F klavye
              tanınır, ama onun için ayrı bir yol henüz yoktur.
            </li>
            <li>
              <strong>Nereden başlansın?</strong> sınıfın başlangıç noktasıyla
              aynı düzey listesi (yukarıya bakın) - burada istisnaya ihtiyacı olan
              tek bir öğrenci için. Daha deneyimli öğrenciler böylece temel
              adımları atlayıp daha ileriden başlar (örneğin ancak rakamlardan
              itibaren); bir öğrenciyi daha geri bir düzeye almadan önce program
              onay ister.
            </li>
            <li>
              <strong>Tek elle yazma:</strong> bu öğrenci için Shift tuşunu diğer
              elle kullanma kuralını kaldırır - büyük harfler ve simgeler o zaman
              her iki Shift tuşuyla da geçerlidir.
            </li>
            <li>
              <strong>Acele yok:</strong> bu öğrencinin hızı hiçbir yerde
              değerlendirilmez - oyunda süre sınırı yok, yıldızlarda hız hedefi
              yok, hıza göre zorluk seviyesinde yükselme ya da düşme yok. Özenli
              ama çok yavaş yazan öğrenciler için.
            </li>
            <li>
              <strong>Geniş harf aralığı (CVI):</strong> bakarak yazarken
              karakterler arasında daha geniş aralık, üç kademede (iki kat, üç
              kat, dört kat) - serebral görme bozukluğu (CVI) olan öğrenciler
              için; birbirine yakın duran karakterler onlarda birbirine karışır.
              Öğrenci aralığı kendi ayarlarından da (dişli simgesi, <AltText>Alt + O</AltText>)
              değiştirebilir - siz de burada istediğiniz zaman. En son seçilen
              geçerlidir.
            </li>
          </ul>
          <p className="m-0">
            Her şey istediğiniz zaman değiştirilebilir - sınıfın değerleri
            tablonun üstündeki "Sınıf ayarları" bölümünde, her öğrencinin
            değerleri onun açılan satırında.
          </p>
        </Section>

        <Section title="3 · Zorluk seviyesi (1-50): programın kalbi">
          <LeistungsstufeHilfe />
          <p className="m-0">
            <strong>Güncel seviye</strong> tabloda (
            <strong>"Zorluk seviyesi"</strong> sütunu) ve alıştırma ekranının
            üstünde görünür. Hiçbir şey ayarlamanız gerekmez - gerekirse yalnızca
            "Acele yok" seçeneğini açın.
          </p>
        </Section>

        <Section title='4 · "Antrenmanım": uyarlanabilir, harf sıklığına göre'>
          <p className="m-0">
            Tastenflow programında her öğrencinin kendi hızıyla ilerlediği{" "}
            <strong>tek</strong> bir alıştırma yolu vardır - ve bu yol{" "}
            <strong>öğrenciye uyum sağlar</strong>: program her tuşu ayrı ölçer,
            en zayıf tuşları kendiliğinden çalıştırır ve öncekiler oturmadan yeni
            bir tuşun kilidini açmaz.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Harf sıklığına göre sıra</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Temel konumdan sonra önce <strong>en sık</strong> kullanılan
                harfler gelir - böylece birkaç tuştan sonra{" "}
                <strong>gerçek kelimeler</strong> oluşur.
              </li>
              <li>
                <strong>Her yol farklıdır</strong> - sıradaki tuş sabit bir
                listeye değil, öğrenciye bağlıdır.
              </li>
              <li>
                <strong>Sabit bir sonu yoktur</strong> - günlük, bağımsız çalışma
                için ideal.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>Planlamanız için:</strong> Türkçe yolun, Türkçe Q klavye için
            Türkçe metinlerde ölçülmüş <strong>kendi tuş sırası</strong> vardır.
            Temel sıra f j d k s l a ş harfleriyle başlar; ardından e, i, n, m, b,
            r, ı, t, y, o ve u gelir, sonra Shift tuşu, nokta ve virgül - böylece
            erkenden gerçek kelimeler yazılır. Ardından z ç h g ğ ü v, en sonda p
            c ö, kesme işareti, şapka tuşu (â î û için) ve yabancı kelimelerdeki w
            x q gelir. Noktalı i ve noktasız ı iki ayrı tuştur ve ayrı ayrı
            öğretilir. Türkçe F klavye için <strong>ayrı bir yol henüz
            yoktur</strong>.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>Sıra, ilk alıştırmadaki dile bağlıdır:</strong> sınıfın hangi
            yolda ilerlediği, ilk alıştırmadaki menü dilinden gelir. Örneğin
            Almanca veya İngilizce başlamış bir sınıf, menü dili değişse de bu
            sırayı korur: sıra bir kez belirlenir ve sonra değişmez.
          </p>
          <p className="m-0">
            <strong>Tüm sınıf için aynı metin:</strong> kursun metinleri (temel
            sıra, harf sıraları, noktalama işaretleri, rakamlar, simgeler, uzun
            metinler) "Sınıflarım" içindeki <strong>"Kişisel alıştırma"</strong>{" "}
            bölümünde <strong>şablon</strong> olarak hazırdır - birini seçin, tüm
            sınıf her öğrencinin kendi düzeyinden bağımsız olarak aynı metni
            çalışır (yüklenen bir dosyada olduğu gibi çalışma süresine sayılır ve
            bu sırada yeni tuşların kilidi açılmaz). Türkçe yol için şablonlar
            arasında ayrıca <strong>"Kelime kökleri"</strong> grubu vardır: her
            kelimenin kökenini anlatan kısa bir ipucu ile.
          </p>
        </Section>

        <Section title='4a · "Kişisel alıştırma": tüm sınıf için tek metin'>
          <p className="m-0">
            Sınıf istatistiklerinin görev satırındaki{" "}
            <strong>"Kişisel alıştırma"</strong> düğmesiyle tüm sınıfın
            çalışacağı bir metin belirlersiniz - öğrencilerin kendi düzeyinden
            bağımsız olarak. Metne üç yol götürür: <strong>dosya yükleyin</strong>{" "}
            (.txt veya .docx), daha önce <strong>"Metinlerim"</strong> içine
            kaydettiğiniz bir metni seçin ya da kursun{" "}
            <strong>şablonlarından</strong> birini alın (4. maddeye bakın).
          </p>
          <p className="m-0">
            <strong>"Metinlerim"</strong> sizin kalıcı arşivinizdir - sınıfa değil
            hesabınıza aittir ve yalnızca siz görürsünüz. Dosya yüklerken{" "}
            <strong>"Metinlerime kaydet"</strong> (varsayılan olarak işaretli)
            oraya otomatik olarak bir kopya kaydeder; böylece aynı metni daha sonra
            dosyayı yeniden yüklemeden kullanabilirsiniz.
          </p>
          <p className="m-0">
            Dosyada yazılamayan karakterler varsa bölüm bunları başlatmadan önce
            liste olarak gösterir - dosyayı düzeltmeye mi yoksa yine de başlatmaya
            mı karar verirsiniz (bu karakterler o zaman satırlardan çıkarılır,
            hiçbir zaman zorunlu vuruş olmaz).
          </p>
          <p className="m-0">
            <strong>"Kişisel alıştırmayı başlat":</strong> her öğrenci hemen,
            öğretmeninden gelen alıştırmayı duyuran bir pencere alır - yalnızca{" "}
            <strong>"Devam et"</strong> düğmesine basabilir, reddedemez.
            Alıştırma her öğrenci için, metni bir kez yazdığı anda kendiliğinden
            biter; ardından öğrenci normal şekilde çalışmaya devam eder.{" "}
            <strong>"Alıştırmayı bitir"</strong> alıştırmayı tüm sınıf için erken
            bitirir.
          </p>
          <p className="m-0">
            Alıştırma çalışma süresine sayılır ve henüz oturmamış tuşlar da dahil
            diğer turlar gibi ölçülür - ama{" "}
            <strong>yeni bir tuşun kilidini açmaz</strong>: hangi tuşların
            geleceğini yalnızca dosya belirler.
          </p>
        </Section>

        <Section title={didaktikAbschnittTitel("tr")}>
          <DidaktikInhalt lang="tr" />
        </Section>

        <Section title="5 · Baştan itibaren anlamlı metinler">
          <p className="m-0">
            Program <strong>olabildiğince erken</strong> gerçek, yaşa uygun
            metinler gösterir - fıkralar, atasözleri, deyimler, bilgi metinleri,
            tekerlemeler, kelime oyunları ve tam cümleler. Bir metin,{" "}
            <strong>harfleri</strong> öğrenilir öğrenilmez görünür; anlamsız
            "harf karışımı" bir istisnadır (yalnızca yepyeni bir tuşu bilinçli
            olarak çalışmak için).
          </p>
          <p className="m-0">
            <strong>Büyük harfler:</strong>{" "}
            <strong>yazım her zaman doğrudur</strong> (cümle başında ve özel
            adlarda büyük harf) - öğrenciler yanlış yazılmış bir kelimeyi hiç
            görmez. Başlangıçta <strong>küçük</strong> harf yeterlidir; büyük harf
            kendiliğinden görünür (<strong>tüm yaş grupları</strong> için, çünkü
            doğru yazım her yaşta önemlidir).
          </p>
          <p className="m-0">
            <strong>
              "Antrenmanım" bölümünde gerçek Shift tuşu ise erken gelir
            </strong>{" "}
            - ilk sık harflerden hemen sonra, çalışmak için yeterince gerçek kelime
            olduğunda (tüm alfabeden sonra değil). Bundan sonra büyük harfler
            Shift tuşuyla "gerçekten" yazılır; Türkçe Q klavyede Shift ile i tuşu
            İ, ı tuşu I verir. Böylece öğrenciler büyük harfi kısa sürede{" "}
            <strong>kendileri</strong> yazmayı öğrenir, uzun süre otomatik yardıma
            dayanmazlar.
          </p>
          <p className="m-0">
            <strong>Noktalama işaretleri</strong> (nokta, virgül, soru işareti
            ...) ancak öğrenildiklerinde görünür - öncesinde cümle "noktasız,
            virgülsüz" durur. Henüz öğrenilmemiş bir <em>harf</em> ya da{" "}
            <em>rakam</em> tuşu ise <strong>hiçbir zaman</strong> istenmez.
          </p>
        </Section>

        <Section title="6 · Yıldızlar, rozetler ve sesler (görme yetersizliği olan öğrenciler için önemli)">
          <p className="m-0">
            Her tur doğruluk ve hızdan <strong>1-3 yıldız</strong> verir -{" "}
            <strong>doğruluk üç kat sayılır</strong>: 3 yıldız her zaman yaklaşık
            %96 doğru vuruş gerektirir (hızlı ama özensiz yazma ödüllendirilmez);
            hatasız bir tur ise en yavaş hızda bile kesin 2 yıldız alır. Her
            yıldız sayısının <strong>kendi sesi</strong> vardır;{" "}
            <strong>seviye atlamada</strong> özel bir sevinç sesi çalar. Bu
            sesler, görme yetersizliği olan öğrenciler için temel geri
            bildirimdir. <strong>🔇</strong> düğmesiyle sessiz bir sınıfta ses
            efektleri kapatılabilir.
          </p>
          <p className="m-0">
            Bunlara çocuklara uygun adlar taşıyan <strong>rozetler</strong>{" "}
            eklenir - kademeli rozet aileleri ve her zaman sesli okunabilen bir
            "sıradaki hedef" ile. Maskot adlarını yalnızca 7-10 yaş grubu görür;
            11-15 yaş metinlerinden itibaren her yerde nötr bir ad yer alır.
            Rozetler aynıdır - kazanılan rozet, metin düzeyi değişse de kalır.
            Neredeyse hepsi <strong>doğruluğu ve azmi</strong> ödüllendirir; hızla
            ilgili tek rozet %95 doğruluk gerektirir. Yeni bir rozet kendi "ta-da"
            sesini ve duyurusunu getirir, ardından istatistiklerde en üstte yer
            alır (öğrencide ve sizde - aynı görünüm). Her rozet{" "}
            <strong>seçilebilir</strong> - o zaman büyük ve efektli görünür.
          </p>
          <p className="m-0">
            <strong>Buz Kütlesi Oyunu 🐧</strong>, "Antrenmanım" bölümünde yeni
            bir tuştan sonra gelen ödüldür: penguen, öğrencinin{" "}
            <strong>henüz en az oturmuş karakterlerinden</strong> oluşan bir
            parkuru geçer (bazen sudaki buz kütleleri, bazen ek olarak karın
            üstünde kayılan bir harf dağı).{" "}
            <strong>Tuşun kilidi daha önce açılmıştır</strong> - öğrenmedeki
            ilerleme hiçbir oyuna bağlı değildir. Sınırsız deneme, oyun sonu yok;
            "yalnızca doğruluk" koşulunda (ve zorluk seviyesi 1 iken){" "}
            <strong>zaman baskısı</strong> yoktur (WCAG ile uyumlu, kapatılabilir
            süre sınırı). Ayrıca <strong>7-10 ve 11-15 yaş</strong> metin
            gruplarındaki öğrenciler oyunu <strong>Oyna</strong> düğmesiyle
            istedikleri zaman başlatabilir - <strong>ödül balıkları</strong> (balık
            sesi ve karakterin duyurusu; kaçırılan balık hata değildir) ve her
            tuşun yalnızca duyurulduğu <strong>Yankı Mağarası</strong> ile bir
            "günün macerası" olarak (orada program sesli okuma kapalıyken bile
            konuşur - görme yetersizliği olan ve olmayan öğrenciler tam olarak aynı
            şekilde oynar; mağara bilinçli olarak ödül turunda HİÇBİR ZAMAN
            çıkmaz). Hatasız bir koşu kutup ışıklarıyla biter; tamamlanan
            maceralar, balıklar ve hatasız koşular{" "}
            <strong>"Maceralar"</strong> rozet ailesini getirir. Değerlendirmeniz
            için önemli: oyun <strong>çalışma süresine</strong> ve haftalık hedefe{" "}
            <strong>sayılmaz</strong> - yalnızca motivasyondur.
          </p>
          <p className="m-0">
            <strong>Oyuna iki farklı yol - lütfen karıştırmayın:</strong>{" "}
            <strong>Oyna</strong> düğmesi, öğrencilerin kendilerinin bastığı
            serbest giriştir; <strong>7-10 ve 11-15 yaş</strong> gruplarında
            vardır, 16 yaş ve üstünde yoktur. <strong>Yeni bir tuştan sonraki</strong>{" "}
            tur ise kendiliğinden gelir: 7-10 yaşta her zaman, 16 yaş ve üstünde
            hiçbir zaman, 11-15 yaşta ise yalnızca Ayarlar içindeki{" "}
            <strong>"Ödül oyunu"</strong> bölümünde <strong>"Oyun yok"</strong>{" "}
            (varsayılan) yerine Buz Kütlesi Oyunu seçildiyse. Bu ayar hesaba
            değil, <strong>cihaza</strong> aittir - klavye düzeni gibi. Sınıf
            bilgisayarında, orada çalışan herkes için geçerlidir.
          </p>
        </Section>

        <Section title="7 · Haftalık hedef">
          <p className="m-0">
            Her öğrenci için <strong>haftalık dakika</strong> ayarlarsınız - ders
            saati birimi olmadan. "Tüm sınıfa uygula" aynı değeri sınıftaki tüm
            öğrencilere bir kerede yazar ve sonradan katılan öğrenciler için de
            geçerlidir.
          </p>
          <p className="m-0">
            Bir değişiklik her zaman{" "}
            <strong>bir sonraki haftanın başından</strong> (Pazartesi, 08:00)
            geçerli olur - içinde bulunulan hafta önceki hedefini korur.
            Kaydetmeden önce bir pencere tam tarihi gösterir.
          </p>
          <p className="m-0">
            <strong>Telafi:</strong> "Önceki haftalarda kaçırılan dakikaları
            telafi et" işaretliyse, önceki haftalardan eksik kalan dakikaların
            hepsi bir kerede telafi edilebilir.
          </p>
          <p className="m-0">
            <strong>Haftayı muaf tut</strong> (örneğin hastalıkta) ve{" "}
            <strong>Biriken dakikaları sıfırla</strong> eskisi gibi kalır - her
            öğrenci için ayrı, çalışılan süreyi değiştirmeden.
          </p>
          <p className="m-0">
            <strong>Hedefi 1 saat durdur:</strong> tüm sınıf için ayrı bir düğme,
            60 dakika boyunca. Çalışma sürer - çalışma süresi ve istatistikler
            sayılmaya devam eder, yalnızca o saatteki haftalık hedef sayılmaz. Aynı
            düğmeye ikinci kez basmak hedefi erken yeniden başlatır.
          </p>
        </Section>

        <Section title="8 · İstatistikler ve ilerleme (her öğrenci için açılır)">
          <p className="m-0">
            Adın önündeki yuvarlak ok düğmesi<span aria-hidden="true"> ▸</span>{" "}
            ile tek tek kapatılabilen altı satır açarsınız, yukarıdan aşağıya:{" "}
            <strong>Ayarlar</strong> (2. maddedeki değerler, bu tek öğrenci için),{" "}
            <strong>Yarışmalar</strong> (yalnızca en az bir yarışma yazıldıysa),{" "}
            <strong>Çalışma süreleri</strong> (hafta hafta, haftalık hedefin
            durumuyla ve - oynandıysa - Sınıf Maçı sayısıyla, ayrıca tüm öğretim
            yılının yıllık haritası), <strong>Henüz oturmamış tuşlar</strong>,{" "}
            <strong>Rozetler</strong> ve - yalnızca dikkat çeken bir değerde -{" "}
            <strong>Bağımsız çalışma</strong> (9. maddeye bakın).
          </p>
          <p className="m-0">
            "Çalışma süreleri" bölümünün üstünde, öğrencinin kaç Sınıf Maçına
            katıldığı görünür (bu sınıfta sayılır; sayımın ne kadar geriye
            gittiğini sayacın yanındaki ipucu söyler); bir haftanın üzerinde Enter
            tuşu o haftanın tek tek çalışma oturumlarını açar - gün, başlangıç ve
            bitiş saati, salt yazma süresi ve neyin çalışıldığı.
          </p>
          <p className="m-0">
            Burada artık ayrı durmayan şeyler - genel bakıştaki değerler, zaman
            içindeki ilerleme, tuşların durumu, öyküler ve bilgiler - kaybolmaz:
            hepsi öğrencinin <strong>"İlerlemem"</strong> bölümünde eksiksiz yer
            alır ve siz orada öğrencinin kendisiyle tamamen aynı görünümü
            görürsünüz.
          </p>
          <p className="m-0">
            <strong>Puan:</strong> öğrencinin doğruluğunu ve hızını 0 ile 100
            arasında tek bir sayıda birleştirir; bir yanlış tuş 5 karakter gibi
            sayılır, iki kat hız ise yalnızca 1,4 kat sayılır - doğruluk hızdan
            önce gelir.
          </p>
          <p className="m-0">
            <strong>Sınıf tablosunda</strong> üç sütun{" "}
            <strong>"Alıştırma"</strong> başlığı altında birlikte durur:
            Doğruluk, Vuruş/dk ve Puan. Üçü de seçilen dönemdeki alıştırmalardan
            gelir; puan diğer ikisini birleştirir. Bu yüzden hafif renklidir ve
            ince bir çizgiyle çevrilidir; ekran okuyucu sütun başlığından önce
            "Alıştırma" diye okur. En sağdaki <strong>"Yarışma"</strong> sütunu bilinçli
            olarak bu grubun dışında, kendi başlığı altındadır: belirli bir günde
            yapılan bir yarışmadır, günlük alıştırma değildir.
          </p>
          <p className="m-0">
            <strong>"Puan"</strong> sütununda: seçilen dönemde 200 karakterden az
            yazan öğrenci puan yerine bir çizgi alır - bu sınırın altında tek bir
            yanlış tuş birkaç puanı belirlerdi.
          </p>
          <p className="m-0">
            <strong>"Excel olarak indir"</strong> düğmesi tablonun üstünde,
            "Başından beri" seçeneğinin sağındadır. Tabloyu{" "}
            <strong>sınıfadı_tarih.xlsx</strong> dosyası olarak indirir (örneğin
            "5a_2026-09-14.xlsx") - o anda hangi dönem seçili olursa olsun. Başta
            dört döneme bağlantılar içeren bir genel bakış ve her sütunu açıklayan,
            puanın nasıl hesaplandığını gösteren bir açıklama bulunur. Ardından
            dört sayfa gelir: içinde bulunulan öğretim yılı, başından beri, ay
            (son 4 hafta) ve bu hafta. Değerler sayı olarak durur, böylece Excel
            içinde hesaplamaya devam edebilirsiniz; tablonun çizgi gösterdiği
            yerde dosyada da çizgi vardır.
          </p>
          <p className="m-0">
            <strong>Sınıfa genel bakış</strong> tablonun üstünde sınıfı bir bütün
            olarak gösterir. "Ay" (son 4 hafta) önceden seçilidir, yanında "Öğretim
            yılı" vardır. Bir satır dakikada vuruşu, doğruluğu ve haftalık
            hedefleri gösterir, her biri küçük bir eğilimle - ayda önceki 4 haftaya
            göre, öğretim yılında ilk çalışma haftalarına karşı son haftalar. Tam
            cümle ipucunda yer alır; ekran okuyucu onu sayıyla birlikte okur, dönem
            içinde çalışmamış öğrenciler de dahil.
          </p>
          <p className="m-0">
            <strong>"Sınıfta puanlar" nokta çubuğu</strong> her öğrenci için bir
            nokta gösterir. Tab tuşuyla çubuğa geçersiniz, ok tuşlarıyla
            öğrenciden öğrenciye - her durak okunur ("Elif, 78 puan"). Kaç
            öğrencinin 50 puanın altında, 50 ile 70 arasında, 70 ile 85 arasında ve
            85 puanın üstünde olduğunu ve kimin çok az yazdığını başlığının ipucu
            söyler.
          </p>
          <p className="m-0">
            <strong>"Öğretim yılında sınıfın puanı" çizgi grafiği</strong> her
            hafta için en az 5 satır yazmış öğrencilerin ortalamasını gösterir;
            çizgideki bir kesinti, o hafta yeterince çalışılmadığı anlamına gelir.
            Tab tuşuyla grafiğe geçersiniz, ok tuşlarıyla haftadan haftaya; ekran
            okuyucu için tüm haftalar ayrıca bir tabloda yer alır. Shift tuşu,
            rakamlar veya simgeler yeni eklendiğinde çizgi kısa bir süre düşer - bu
            beklenen bir durumdur ve endişe nedeni değildir.
          </p>
          <p className="m-0">
            <strong>Eğri:</strong> eğrinin yalnızca yükselmemesi normaldir. Yeni
            tuşlar eklendiğinde çoğu zaman önce düşer - özellikle Shift tuşunda ve
            rakamlarda.
          </p>
          <p className="m-0">
            <strong>Veri şeffaflığı:</strong> her öğrenci "İlerlemem" bölümünde
            kendisi hakkında tamamen aynı değerleri görür - siz hiçbir zaman
            öğrencinin kendisinden fazlasını görmezsiniz.
          </p>
        </Section>

        <Section title="8a · Not verirken dayanabileceğiniz değerler">
          <DreiWerteHilfe />
        </Section>

        <Section title="8b · Yarışma: tüm sınıf için ortak bir görev">
          <p className="m-0">
            Öğretmen bölümü <strong>"Sınıflarım"</strong> içinde, Tastenflow{" "}
            <strong>sınıf istatistiklerinin</strong> en üstünde, görev satırında{" "}
            <strong>"Yarışma"</strong> düğmesi vardır. Bu düğme, tüm sınıf için
            bir yarışma başlattığınız formu açar - kursta ne kadar ilerlemiş
            olurlarsa olsunlar <strong>tüm öğrenciler aynı metni alır</strong>.
          </p>
          <p className="m-0">
            <strong>Üç şey ayarlanır:</strong> <strong>kullanılan tuşlar</strong>{" "}
            ("Temel sıra" düzeyinden "Tüm tuşlar" düzeyine kadar), hemen yanında{" "}
            <strong>tür</strong> ve dakika olarak <strong>yarışma süresi</strong>.{" "}
            <strong>"Şimdi başlat"</strong> yarışmayı hemen başlatır.
          </p>
          <p className="m-0">
            <strong>Sıkı</strong> (varsayılan) eskisi gibidir: yanlış tuş
            ilerletmez, her yanlış tuş sayılır - hemen düzeltilen de.{" "}
            <strong>Serbest yazma</strong>, gençlerin zamanlı yazma testlerinden
            tanıdığı bakarak yazmaya uyar: bir hata yazarken yerinde kalır ve
            işaretlenmez, Backspace tuşu yalnızca o anki satırda düzeltir.
            Değerlendirme sonda, yanlış kalan yerler üzerinden yapılır - kelime
            başına en çok bir hata, yarım kalan son kelime sayılmaz, düzeltilen
            yerler hiç sayılmaz. Yerinde kalan bir hata kendi başına zaman
            kaybettirmediği için daha ağır sayılır: {FEHLER_GEWICHT} yerine{" "}
            {FEHLER_GEWICHT_FREI} karakter (8a). Sınıf metni bakarak yazmayı
            çalışacaksa ve bir yanlış tuş yazmayı durdurmamalıysa "Serbest yazma"
            seçeneğini seçin; tuş yollarının kendisini sınamak için "Sıkı"
            seçeneğini seçin.
          </p>
          <p className="m-0">
            <strong>Ayırt edilmesi gereken üç saat:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Başlangıç anı</strong> - "Şimdi başlat" düğmesine bastığınız
              an. Sınıf bu andan itibaren başlayabilir.
            </li>
            <li>
              <strong>Katılım süresi</strong>: başlangıç anından itibaren{" "}
              {EINSTIEGSFENSTER_MIN} dakika. Bir öğrenci bu süre boyunca
              katılabilir; daha sonra gelen geç kalmıştır.
            </li>
            <li>
              <strong>Yarışma süresi</strong>{" "}
              <strong>her öğrenci için ayrı</strong> işler, üstelik ancak
              öğrencinin <strong>ilk tuş vuruşundan</strong> itibaren. Aynı
              sınıftan iki öğrenci bu yüzden farklı zamanlarda bitirir - bu
              bilinçlidir: önce yerini bulan öğrenci yarışma süresinden kaybetmez.
            </li>
          </ul>
          <p className="m-0">
            <strong>Metinler:</strong> her tuş düzeyi için{" "}
            <strong>{PROBEN_JE_NIVEAU} yarışma metni</strong> vardır, her biri en
            az {MIND_ZEICHEN} karakter - yüksek hızda bile metin hiç bitmeyecek
            kadar uzun. <strong>Kursta yer almazlar</strong>, yani hiçbir öğrenci
            onları önceden çalışmış olamaz. Bir düzeyin bir sonraki yarışması, bir
            öncekinde en uzağa giden öğrencinin kaldığı yerden başlar: bir sonraki
            satırda, cümleli metinlerde bir sonraki cümlenin başında. Yarışma
            sırasında bir metin biterse öğrenciler ara vermeden bir sonrakinde
            yazmaya devam eder. Türkçe yolda yarışma metinleri Türkçedir: yedi düzeyin
            her birinin kendi Türkçe havuzu vardır (düzey başına {PROBEN_JE_NIVEAU} metin). Kendi
            metninizi seçmek için Kendi dosyanız seçeneğini kullanın (kullanılan
            tuşlar listesinin son seçeneği).
          </p>
          <p className="m-0">
            <strong>Görme yetersizliği olan öğrenciler</strong> yarışmayı
            programın <strong>sesli okumasıyla</strong> (<Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) yazar - alıştırmada olduğu gibi, öğretmenin ayrıca
            işaretlemesi gereken bir kutu olmadan. Öğrencinin sesi beklediği
            süreyi yarışma saati kendiliğinden düşer; metni görebildiği halde
            sesli okumayı açan öğrenciden de aynı süre düşülür. Böylece sesli okuma
            süresi zaten dengelenmiş olur; diğer makul düzenlemelere öğretmenler
            okullarının kurallarına göre karar verir.
          </p>
          <p className="m-0">
            <strong>Sonuçlar</strong> "Geçmiş yarışmalar" altındaki açılır
            bölümde yer alır - satırın başındaki "Yarışma" düğmesi onu açar: her
            öğrenci için sıra, <strong>yarışma puanı</strong>, sesli okuma
            kullanılıp kullanılmadığı, hız, doğruluk ve henüz oturmamış tuşlar.
            Yarışma puanının nasıl oluştuğu 8a maddesinde anlatılır. Yarışma{" "}
            <strong>tüm sınıf</strong> için bittiğinde aynı değerleri içeren{" "}
            <strong>toplu bir e-posta</strong> da gelir. Ancak o zaman - henüz
            yazan biri varken gönderilen e-posta eksik olurdu, ikinci bir "bu sefer
            gerçekten herkes" e-postasını da kimse istemez.
          </p>
          <p className="m-0">
            Bir öğrenci <strong>"Bu sefer katılmıyorum"</strong> seçeneğini
            seçebilir. O zaman normal şekilde çalışmaya devam eder ve
            değerlendirmede <strong>"katılmadı"</strong> olarak görünür. Her
            öğrenci kendi yarışmalarını daha sonra <strong>"İlerlemem"</strong>{" "}
            bölümünde görür - sizin gördüğünüz değerlerin aynısını.
          </p>
        </Section>

        <Section title="9 · Bağımsız çalışma ve yapay zeka denetimi (yalnızca öğretmenler için)">
          <p className="m-0">
            <strong>"Bağımsız çalışma"</strong> sütunu <strong>1-10</strong>{" "}
            arasında bir gösterge gösterir. Metnin öğrencinin kendisi tarafından
            yazılmadığına dair işaretlerde yükselir: <em>yapıştırma</em>, sık
            pencere ya da odak değişimi, inanılmayacak kadar yüksek hız veya
            öğrenme süreci olmadan kusursuz doğruluk. Bu değeri öğrenciler değil,{" "}
            <strong>yalnızca siz</strong> görürsünüz. Sakince bakmak için bir
            işarettir - asla öğrenci hakkında bir yargı değildir.
          </p>
        </Section>

        <Section title="10 · Erişilebilirlik">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Renkler ve yazı boyutu:</strong> üstteki çubuktan (açık,
              koyu, yüksek karşıtlık); <Kbd>Alt</Kbd> + <Kbd>+</Kbd> /{" "}
              <Kbd>-</Kbd> yazma alanını büyütür veya küçültür.
            </li>
            <li>
              <strong>Sesli okuma</strong> (programın kendi sesi){" "}
              <Kbd>Alt</Kbd> + <Kbd>V</Kbd> ile - ekran okuyucusu kurulu olmayan
              öğrenciler için (NVDA, JAWS veya VoiceOver kullanılıyorsa kapalı
              kalması daha iyidir). <em>Harflerin, kelimelerin veya cümlelerin</em>{" "}
              okunması, konuşma hızı ve <strong>okuma sesi</strong> seçilebilir.
              Dil Türkçe olduğunda program kendiliğinden Türkçe bir okuma sesi
              arar; yoksa bir kurulum kılavuzu görünür.{" "}
              <strong>Okuma süresi hızdan düşülür</strong> - sesli okumaya
              ihtiyaç duyan, Braille öğrenen öğrenciler böylece vuruş sayısında ve
              istatistiklerde dezavantajlı olmaz.
            </li>
            <BrailleTabellenPunkte weg="tr" />
            <li>
              <strong>Parmak duyurusu:</strong> <Kbd>Shift</Kbd> tuşuna iki kez
              kısa basmak doğru parmağı söyler.
            </li>
            <li>
              <strong>Odak yönetimi:</strong> her düğmenin belirlenmiş bir hedefi
              vardır - düğmeye basan kişi ardından imlecin nerede olduğunu bilir.
              Braille ekranla çalışan öğrenciler için bu, çalışmaya devam etmekle
              aramak arasındaki farktır. Derste fark edilen üç kural:{" "}
              <Kbd>Esc</Kbd> tuşu her pencereyi kapatır ve{" "}
              <strong>her zaman yazma alanına</strong> döndürür; görünüm
              değişikliği (istatistikler, kitaplık, giriş){" "}
              <strong>yeni görünümün başlığına</strong> gider ve onu okur; ve{" "}
              <strong>hiçbir şey kendiliğinden kaybolmaz</strong> - kilit açma
              kutlaması bile öğrenci "Devam et" düğmesine basana kadar bekler.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> yazma alanına geçer, <Kbd>Alt</Kbd> +{" "}
              <Kbd>H</Kbd> yardımı açar.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> alıştırmaya geçer, <Kbd>Alt</Kbd> +{" "}
              <Kbd>S</Kbd> <strong>"Sınıflarım"</strong> bölümüne (alıştırmadayken:
              kendi istatistiklerinize); <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> şu an kaçıncı
              satırda olunduğunu söyler.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> çalışma süresini verir - Braille
              ekranda ve (sesli okuma açıksa) duyuru olarak.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd>{" "}
              <strong>klavye kısayolları listesini</strong> açar veya kapatır.
            </li>
          </ul>
        </Section>

        <Section title="11 · Silme">
          <p className="m-0">
            Tek tek öğrenciler veya bütün bir sınıf kalıcı olarak silinebilir
            (hesap, ilerleme ve sonuçlarla birlikte). Bu geri alınamaz - program
            önce onay ister.
          </p>
        </Section>

        <Section title="12 · İndirmeler: öğretmen kılavuzu ve afiş (PDF)">
          <p className="m-0">
            Bu yardımdaki her şey ve çok daha fazlası{" "}
            <strong>Öğretmen kılavuzunda</strong> yer alır: tüm adımlarıyla
            öğrenme yolu, Türkçe Q klavye ve Türkçe harfler, sınıf paneli, adım adım
            Yarışma, puan ve not için değerler.
          </p>
          <HandbuchLaden />
          <p className="m-0">
            Okulda sınıf duvarı ya da öğretmenler odası için A3 boyutunda,
            tastenflow.org adresine giden QR kodlu bir{" "}
            <strong>Tastenflow afişi</strong> de vardır.
            Kılavuzun aksine herkese açıktır, giriş yapmadan da indirilebilir.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            İkisi de "Sınıflarım" içinde, "İndirmeler" altında da bulunur.
          </p>
        </Section>
      </div>
    </div>
  );
}
