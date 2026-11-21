/**
 * ★★★ O-TR (02.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, TÜRKISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, nach dem Aufbau von `TippenHilfe.pl.tsx`
 * (dieselben Abschnitte, `detail`-Stufen, `isAdult`/`jugend`-Fälle), den
 * Inhalt nach der deutschen `TippenHilfeDeutsch` - nicht Satz für Satz
 * übertragen. Wie Englisch, Französisch, Spanisch, Italienisch und Polnisch
 * ohne den Einführungs-Podcast (die türkische Bedienung hat keinen).
 *
 * ── ANREDE (Glossar `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md`) ────────
 * Immer **sen** - Kinder, Jugendliche UND Selbstlernende (Regel 1), kurze
 * Befehlsform ("bas", "seç", "yaz"). Knopfnamen in geraden Anführungszeichen
 * mit "düğmesi" dahinter (Regel 7). Ausrufezeichen nur in Sätzen, die allein
 * Kinder sehen (`kind`), höchstens eines je Absatz; Jugendliche und
 * Erwachsene bekommen keines (Regel 1) - ausgenommen wörtlich zitierte
 * Oberflächentexte ("Varım!", "Buldun!").
 *
 * ── KEINE ENDUNG AN PLATZHALTERN (Glossar Regel 6) ─────────────────────────
 * Weder an `{YARISMA}` noch an Zahlen, Tastennamen, "Tastenflow", "Mac",
 * "Windows": die Endung hängt an einem festen Wort daneben ("Yarışma kelimesi",
 * "Enter tuşuna", "Tastenflow programını", "Mac bilgisayarda"). Der Ring heisst
 * für Kinder "oyun seviyesi", sonst "seviye" - jede gebeugte Form steht darum
 * ausgeschrieben (`seviyen`, `seviyeye` ...), nicht als Platzhalter mit Endung.
 *
 * ── WAS TÜRKISCH ANDERS IST ────────────────────────────────────────────────
 *  · Die Tastatur: Windows "Türkçe Q" (`layouts.ts`, `tr-q`, nur gelesen).
 *    ğ ü ş i ö ç auf eigenen Tasten rechts von P, L und M; noktasız ı auf der
 *    Taste zwischen U und O (Kappe "I"), noktalı i rechts von Ş. Shift + ı = I,
 *    Shift + i = İ. Zirkumflex â î û über die Totaste ^ (Shift + 3), dann der
 *    Vokal. ₺ = Alt Gr + T, am Mac Option.
 *  · Tastennamen wie auf der Kappe (Glossar §2.9): Shift, Caps Lock, Enter,
 *    Backspace, Esc, Ctrl, Alt Gr, boşluk çubuğu; Mac: Option.
 *  · Die Reihenfolge des Weges "tr" ist gemessen (`lernweg.ts`, F4-tr): die
 *    Hilfe zeigt die Buchstaben des Weges, auf dem das Kind wirklich übt
 *    (`layoutLetterOrder`), und nennt nur die Grobfolge - kein Absatz über die
 *    deutschen Lektionen.
 *  · Das Plakat gibt es auf Türkisch noch nicht - der Abschnitt bietet das
 *    englische an (`handbuchInSprache`, "İngilizce").
 *  · Die Zeile unter dem Übungsfeld heisst "şerit" (nicht "satır" - das ist
 *    die Übungszeile), der Ring "halka".
 *
 * Nur Bindestrich, gerade Anführungszeichen, ASCII-Apostroph nur in festen
 * Wörtern ("Türkiye'de"), keine Maus-Wörter.
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, layoutLetterOrder, skinForStufe, unitGlyph } from "@/lib/typing";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
import { RundgangNochmalKnopf } from "./Rundgang";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";
import { downloadAdresse, groesse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

// ★ O-TR (02.10.2026): das Wort der Tippchallenge (Glossar §2.3) - wie
// `WYZWANIE` in der polnischen Hilfe. `schreibprobe.ts` führt es seit O-TR ebenso
// (`PRUEFUNG_WORT_TR`); hier bleibt die eigene Konstante mit Mehrzahl.
// ⚠️ Nie mit Endung verwenden (Glossar Regel 6).
const YARISMA = "Yarışma";
const YARISMALAR = "Yarışmalar";

export function TippenHilfeTuerkisch({ open, onClose, stufe, lernweg = "en" }: TippenHilfeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";
  const kind = skin === "kind";
  const detail = detailFor(stufe);
  const letters = layoutLetterOrder(lernweg);
  // Das Höhlenwesen (deutsche Aufnahmen) gibt es nur auf Weg "de".
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  // Der Ring: Kinder "oyun seviyesi", sonst "seviye" (Glossar §2.2). Jede
  // gebeugte Form ausgeschrieben - keine Endung an einem Platzhalter.
  const seviyeAdi = kind ? "Oyun seviyesi" : "Seviye";
  const seviyen = kind ? "oyun seviyen" : "seviyen";
  const seviyeye = kind ? "oyun seviyesine" : "seviyeye";
  const seviyede = kind ? "oyun seviyesinde" : "seviyede";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Tastenflow için yardım"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Yardım - Tastenflow nasıl çalışır?</h2>
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

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Hemen yazmaya başla">
          <p className="m-0">
            Önce alanı seçmen gerekmez. Hemen yazmaya başla - ilk harf doğrudan
            alana gelir. İmleç başka bir yerdeyse <Kbd>Alt</Kbd> + <Kbd>E</Kbd>{" "}
            seni hemen yazma alanına geri götürür.
          </p>
          <JawsRueckweg weg="tr" />
          {detail === 1 && (
            <p className="m-0">
              Her tuşa doğru parmakla bas - alttaki klavye sıradaki tuşu sana
              gösterir. <Kbd>Shift</Kbd> tuşuna iki kez hızlıca basarsan hangi
              parmakla yazacağını duyarsın.
            </p>
          )}
        </Section>

        <Section title="Metindeki işaretler">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "birbirine ait iki bilgiyi ayırır - virgül gibi." },
              { zeichen: "→", bedeutung: "sonra, ya da: bundan bu olur." },
              { zeichen: "⏱", bedeutung: "çalıştığın süre." },
              {
                zeichen: "↵",
                bedeutung:
                  "sınıfında bu ayar açıksa satırın sonunda durur - o zaman satırı Enter tuşuyla bitirirsin.",
              },
            ]}
          />
        </Section>

        <Section title="Yıldız topla 🌟">
          <p className="m-0">
            Her turdan sonra <strong>1 ile 3 arasında yıldız</strong> alırsın - bir
            de ona özel bir ses.{" "}
            <strong>Az hata, hızdan çok daha önemlidir:</strong> sakin ve dikkatli
            yazınca yıldızlar kesin gelir; acele edip sık sık yanlış tuşa basınca
            yıldız almak zorlaşır.
            {kind ? " Her çocuk yıldız toplayabilir!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              3 yıldız gerçekten iyi bir tur içindir - dikkatli yazılmış ve hızı da
              yerinde. Ama <strong>dikkatli</strong> yazmak her zaman{" "}
              <strong>hızlı</strong> yazmaktan önemlidir. Bir süre iyi turlar
              yaparsan bir <strong>zorluk seviyesi</strong> yükselirsin - o zaman
              ödül sesi de biraz farklı çalar.
            </p>
          )}
        </Section>

        <Section title="Rozet topla 🏅">
          <p className="m-0">
            Özel başarılar için <strong>rozet</strong> kazanırsın - örneğin hiç
            hatasız bir tur için ya da art arda üç temiz tur için. Yeni bir rozette
            ayrı bir <strong>"ta-da"</strong> sesi çalar ve rozetin adı okunur.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Bütün rozetler <strong>"İlerlemem"</strong> bölümünde, haftalık
              hedeflerin ve değerlerinin hemen arkasındadır. Orada her zaman{" "}
              <strong>sıradaki hedef</strong> de yazar (örneğin: bir sonraki rozete
              2 hatasız tur kaldı). Rozetlerin çoğu <strong>dikkatli yazmak</strong>{" "}
              ve <strong>azim</strong> içindir - acele için değil. Bazı rozetler de{" "}
              <strong>gizlidir</strong>: koşulları hiçbir yerde yazmaz, bir gün
              birden ortaya çıkarlar.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Orada <strong>puanın</strong> da yazar: doğruluğu ve hızı 0 ile 100
              arasında tek bir sayıda birleştirir. Bir yanlış tuş 5 karakter gibi
              sayılır, iki kat hız ise sadece 1,4 kat - doğruluk hızdan önemlidir.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Daha aşağıda "Zaman içinde ilerleme" (açılıp kapanan bir bölüm) küçük
              bir eğri gösterir. Eğrinin hep yukarı gitmemesi normaldir. Yeni
              tuşlar gelince eğri çoğu zaman önce biraz düşer - özellikle Shift
              tuşunda ve rakamlarda.
            </p>
          )}
          <p className="m-0">
            İpucu: İlerlemem bölümünde bir rozet seç ve <Kbd>Enter</Kbd> tuşuna bas -
            rozet parıltı ve konfetiyle <strong>büyük</strong> görünür.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Yeni bir tuştan sonra">
            <p className="m-0">
              <strong>Yeni bir tuş</strong>, öncekiler oturur oturmaz senindir -
              bunun için bir şey kazanman gerekmez. Kısa bir kutlama olur, sonra
              çalışmaya devam edersin. Başka bir şey olmaz.
            </p>
            <p className="m-0">
              İstersen ardından kısa bir oyun gelebilir:{" "}
              <strong>Buz Kütlesi Oyunu</strong>. Buna sen karar verirsin -{" "}
              <strong>Ayarlar</strong> (<AltText>Alt + O</AltText>) içinde, <strong>Ödül oyunu</strong>{" "}
              bölümünde. Başta <strong>Oyun yok</strong> seçilidir. Bu ayar bu
              cihazda geçerlidir.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Buz Kütlesi Oyunu 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Oyunu <strong>istediğin zaman başlatabilirsin</strong> - yazma
                  alanının altındaki şeritte bulunan <strong>"🐧 Oyna"</strong>{" "}
                  düğmesiyle. Penguen buz kütlelerinin üstünden atlar, harf dağına
                  tırmanır ve karnının üstünde kayarak iner - hep sana şu an en zor
                  gelen tuşlarla. Yolda <strong>ödül balıkları</strong> sıçrar
                  (tuşuna zamanında basarsan balık senin, kaçırmak asla hata
                  sayılmaz), <strong>Yankı Mağarası</strong> bölümünde ise her tuş
                  yalnızca söylenir. Oyun çalışma süresine <strong>sayılmaz</strong>{" "}
                  ve yeni karakterler için bir koşul değildir - ama kendi rozetleri
                  vardır.
                </p>
                <p className="m-0">
                  Yeni bir tuştan sonra oyun <strong>yalnızca</strong> Ayarlar
                  içinde <strong>Ödül oyunu</strong> olarak seçiliyse kendiliğinden
                  başlar. Yoksa hiçbir şey seni bölmez - ne zaman oynayacağına sen
                  karar verirsin.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Yeni bir tuşu başarınca kutlama için Buz Kütlesi Oyunu seni
                  bekler: pengueni suyun üstünden geçir - hep bir sonraki buz
                  kütlesinde yazan tuşa bas! Bazen yol sonra{" "}
                  <strong>harf dağına</strong> bile çıkar ve penguen karnının
                  üstünde kayarak aşağı iner. Yeni tuş zaten senindir - oyun bir
                  ödüldür, zorunlu değildir.
                </p>
                <p className="m-0">
                  Oyunu <strong>istediğin zaman</strong> kendin de başlatabilirsin -
                  alıştırma kartının üstünde, halkanın hemen yanındaki{" "}
                  <strong>"🐧 Oyna"</strong> düğmesiyle. İşte büyük{" "}
                  <strong>macera</strong>: her gün biraz farklıdır, yolda{" "}
                  <strong>ödül balıkları</strong> sıçrar (tuşuna hızlıca bas, balık
                  senin), <strong>Yankı Mağarası</strong> bölümünde ise harfleri
                  görmezsin -{" "}
                  {hoehleMitWesen ? (
                    <>
                      mağara her tuşu sana <strong>söyler</strong>.
                    </>
                  ) : (
                    <>
                      her tuş bir ses olarak çalar, ekran okuyucu ya da Braille ekran
                      hangisi olduğunu sana <strong>söyler</strong>.
                    </>
                  )}{" "}
                  Oyun sadece eğlence içindir ve çalışma süresine{" "}
                  <strong>sayılmaz</strong> - ama kendi rozetlerini kazandırır!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Merak etme: bir buz kütlesi batarsa ya da dağda kayarsan penguen
                    yüzerek geri döner - hemen, istediğin kadar tekrar deneyebilirsin.
                    Bütün macerayı bir kez bile suya düşmeden bitiren, iglonun
                    üstünde dans eden <strong>kutup ışıklarını</strong> görür!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Halkadaki sayı ne demek?">
          <p className="m-0">
            Halkadaki sayı senin <strong>{seviyen}</strong>.{" "}
            <strong>{kind ? "XP, çalışma puanlarıdır:" : "Puanları çalışarak kazanırsın:"}</strong>{" "}
            her tur için birkaç tane alırsın ve halka dolar. Halka dolunca (100
            puan) bir sonraki {seviyeye} geçersin. Bu sadece toplamak içindir ve
            çalışmayı <strong>zorlaştırmaz</strong> - bir oyundaki puanlar gibi.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Bunu <strong>zorluk seviyesi (1-50)</strong> ile karıştırma: o, ne
              kadar hızlı yazman gerektiğini söyler ve <strong>kendiliğinden</strong>{" "}
              sana uyar - iyi gidince yükselir, fazla zor gelince düşer.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              <strong>"Metinler"</strong> ayarı ise sadece kelimelerin ve
              cümlelerin ne kadar zor olduğunu belirler - yaşına uygun olsun diye.
              Sınıftaysan bunu öğretmenin herkes için ayarlar; sınıfın yoksa en
              üstteki Ayarlar ⚙ içinde bulursun. Yani üç ayrı şey:{" "}
              <em>{seviyeAdi}</em> = puanlar, <em>zorluk seviyesi</em> = beklenen
              hız, <em>Metinler</em> = yaş.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Ne sıklıkla çalışmalı?" : "Çalışma süresi ve haftalık hedef"}>
          {detail === 1 ? (
            <p className="m-0">
              Bir kere çok uzun çalışmak yerine <strong>sık sık ve kısa</strong>{" "}
              çalış - örneğin birkaç gün, her gün birkaç dakika. Yazma alanının
              altındaki şeritte bir saat, bugün ne kadar çalıştığını sayar; aynı
              süre orada <strong>halkayı</strong> da doldurur - bu senin haftalık
              hedefin.
            </p>
          ) : (
            <p className="m-0">
              Hesabın varsa bir <strong>haftalık hedefin</strong> olabilir: haftada
              belirli sayıda <strong>dakika</strong>. Sınıftaysan bunu öğretmenin
              belirler; sınıfın yoksa Ayarlar ⚙ içinde "Haftalık hedefim"
              bölümünde kendin seçersin - yeni hedef bir sonraki pazartesiden
              itibaren geçerli olur. <strong>Hafta başlangıcı: Pazartesi, 08:00</strong>;
              hafta bir sonraki pazartesi aynı saatte biter. Yazma alanının
              altındaki şeritte durumun bir <strong>halka</strong> olarak görünür,
              örneğin "25 dk. (hedef: 60 dk.)" - hedefe ulaşınca halka dolar ve bir
              onay işareti çıkar. Bazen önceki bir haftadan{" "}
              <strong>telafi</strong> edilecek dakikalar da olur; o zaman yanında
              kaç dakika olduğu yazar. Haftalık hedefe ulaşınca kısa bir tebrik
              penceresi açılır - sonra istediğin zaman çalışmaya devam edebilirsin.
            </p>
          )}
        </Section>

        <Section title="Ayarlar: en üstteki dişli ⚙">
          <p className="m-0">
            Bütün ayarlar en üstteki <strong>"⚙ Ayarlar"</strong> düğmesinin
            arkasındadır - adının ilk harfinin yazdığı yuvarlak işaretin hemen
            solunda: <strong>Ne çalışıyorsun?</strong>, <strong>Metinler</strong>{" "}
            (yaş ve dil), <strong>Klavye</strong>, <strong>Ses efektleri</strong>{" "}
            ve <strong>Sesli okuma</strong>. Bir kez basınca açılır, bir kez daha
            basınca kapanır - ya da <Kbd>Alt</Kbd> + <Kbd>O</Kbd> tuşlarına bas;
            bu, yazarken de çalışır. Açınca imleç hemen ayarlara atlar, kapatınca
            yazma alanına döner.
          </p>
          <p className="m-0">
            Ayarların en üstünde <strong>"Ne çalışıyorsun?"</strong> vardır: üç
            yol, <strong>Antrenmanım</strong>, <strong>Öyküler</strong> ve{" "}
            <strong>Kelime oyunları</strong>. <Kbd>Alt</Kbd> + <Kbd>B</Kbd> sırayla
            bir sonraki yola geçer ve yeni yol okunur.
          </p>
          <p className="m-0">
            Üstteki yuvarlak dünya düğmesi menülerin ve düğmelerin dilini
            değiştirir - alıştırma metinlerinin dilini de hemen onunla birlikte.
            Sonra metinlerin dilini <strong>Metinler</strong> bölümünde ayrıca
            değiştirebilirsin; öğretmenin bu dili sabitlediyse değiştiremezsin.
          </p>
          <p className="m-0">
            <strong>Klavye</strong> bölümünde önünde gerçekten duran klavyeyi
            seçersin. Türkiye'de bu çoğunlukla <strong>Türkçe Q</strong> klavyedir
            (Windows ayarlarında adı da "Türkçe Q"). O zaman ekran klavyesi ve
            parmak ipuçları doğru olur - ve sadece bu klavyede bulunan karakterler
            gelir. Türkçe Q klavye hakkında en önemli bilgiler:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>ğ, ü, ş, i, ö</strong> ve <strong>ç</strong> harflerinin kendi
              tuşları vardır: ğ ve ü, <Kbd>P</Kbd> tuşunun sağında; ş ve i,{" "}
              <Kbd>L</Kbd> tuşunun sağında; ö ve ç, <Kbd>M</Kbd> tuşunun sağında.
            </li>
            <li>
              <strong>Noktasız ı</strong> ve <strong>noktalı i</strong> iki ayrı
              tuştur: noktasız ı, U ile O arasındaki tuştadır (üstünde büyük I
              yazar); noktalı i, Ş tuşunun hemen sağındadır. Büyük halleri de
              farklıdır: <Kbd>Shift</Kbd> + ı = I, <Kbd>Shift</Kbd> + i = İ.
            </li>
            <li>
              ı ile i iki ayrı harftir: birinin yerine öbürünü yazınca başka bir
              kelime çıkar (ılık - ilik). Bu yüzden program tam olarak beklediği
              harfi ister: noktasız ı bekliyorsa noktasız ı, noktalı i bekliyorsa
              noktalı i. Aynısı ş - s, ğ - g, ç - c, ö - o ve ü - u için de
              geçerlidir.
            </li>
            <li>
              <strong>Şapkalı harfler</strong> (â, î, û) iki adımda yazılır: önce{" "}
              <Kbd>Shift</Kbd> + <Kbd>3</Kbd> tuşlarına bas (şapka, ^) - ekranda
              henüz bir şey görünmez - sonra harfi yaz. Böylece ^ ile a birlikte â
              olur.
            </li>
            <li>
              Kesme işareti (') <Kbd>Shift</Kbd> + <Kbd>2</Kbd> ile yazılır; tırnak
              işareti (") 1 tuşunun solundaki tuştadır. ₺ için{" "}
              <Kbd>Alt Gr</Kbd> + <Kbd>T</Kbd> tuşlarına bas.
            </li>
            <li>
              Mac bilgisayarda Alt Gr yerine <Kbd>Option</Kbd> tuşuna basarsın.
            </li>
          </ul>
          <p className="m-0">
            Orada <strong>"Tek elle yazma"</strong> da vardır - tek elle yazan
            herkes için: o zaman büyük harfler ve simgeler iki Shift tuşunun
            hangisiyle yazılırsa yazılsın sayılır. Sınıftaysan bunu öğretmenin
            ayarlar.
          </p>
          <p className="m-0">
            <strong>"Geniş harf aralığı (CVI)"</strong> açıkken, yazarken o an
            yazdığın alanın (alıştırma satırı ya da oyun alanı) dışındaki her şey
            karartılır; 5 saniye yazmayınca ekran yeniden aydınlanır. Alıştırma
            satırı da zıplamak yerine senin yazma hızınla yumuşakça kayar. Harf
            aralığını Ayarlar ⚙ içinde istediğin zaman kendin değiştirebilirsin -
            sınıfta öğretmenin de ayarlayabilir; en son seçilen geçerlidir.
          </p>
          <p className="m-0">
            <strong>Hedefli çalışma</strong> ile turlarda özellikle sık çıkacak en fazla 8 tuş veya karakter seçebilirsin - ayarlarda <strong>Ne çalışıyorsun?</strong> grubunda ya da <Kbd>Alt</Kbd> + <Kbd>2</Kbd> ile. Sınıfta bunu öğretmenin ayarlar.
          </p>
        </Section>

        <Section title="Sesli okuma - program sana okur">
          <p className="m-0">
            <strong>"🗣 Sesli okuma"</strong> düğmesiyle (ya da <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd> ile) program sesli okur - (henüz) ekran okuyucu
            kullanmayan herkes için. Üstteki Ayarlar ⚙ içinde nelerin okunacağını
            seçersin: <strong>tuşlar</strong> (Harf harf),{" "}
            <strong>kelimeler</strong>, <strong>cümleler</strong> - biri, birkaçı ya
            da hepsi - ve ne hızda okunacağını.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>"Okuma sesi"</strong> bölümünde başka bir ses seçebilirsin.
              Dil <strong>Türkçe</strong> olunca program kendiliğinden Türkçe bir
              okuma sesi arar; hiç yüklü değilse nasıl ekleneceğini anlatan kısa
              bir açıklama çıkar.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Hız konusunda merak etme: <strong>okuma süresi hesaptan
              çıkarılır</strong> - duyuruyu beklemek hızını düşürmez.
            </p>
          )}
        </Section>

        <Section title="Yazarken melodi 🎵">
          <p className="m-0">
            <strong>Yazarken melodi</strong>, <strong>düzenli bir yazma ritmi</strong> çalışmana yardım eder ve her şeyden önce <strong>eğlenceli</strong> olmalıdır. Her doğru tuş bir şarkının sonraki notasını çalar; ritimde kalırsan bir grup bile sana eşlik eder.
          </p>
          <p className="m-0">
            Düzenli yazan kişi, zayıf tuşlarda da akıcı olur: ritim, normalde duraksayacağın yerlerden seni geçirir.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>6</Kbd> ile, ⚙ ayarlarından ya da üstteki yuvarlak hoparlör düğmesinin altındaki menüden açarsın; orada her sesin düzeyini sürgülerle de ayarlarsın. Sesi <Kbd>Alt</Kbd> + <Kbd>7</Kbd> ve <Kbd>Alt</Kbd> + <Kbd>8</Kbd> ile değiştirirsin.
          </p>
        </Section>

        <Section title="Büyük harfler ve noktalama işaretleri">
          <p className="m-0">
            Türkçede <strong>büyük harf</strong> gerekir - cümle başında ve özel
            adlarda (Ayşe, İzmir, Karadeniz). Tastenflow büyük harfleri{" "}
            <strong>her zaman doğru</strong> yazar; yani hiçbir zaman yanlış
            yazılmış bir kelime görmezsin.
          </p>
          <p className="m-0">
            <strong>Başta çok kolay:</strong> sadece <strong>küçük</strong> harfi yaz
            - <strong>büyük</strong> harf kendiliğinden çıkar. Bunun için{" "}
            <Kbd>Shift</Kbd> tuşunu henüz bilmen <strong>gerekmez</strong>.
          </p>
          <p className="m-0">
            <strong>Çok yakında</strong>, ilk harflerden sonra <Kbd>Shift</Kbd>{" "}
            tuşunu "gerçekten" öğrenirsin: onu <strong>bir</strong> elinle basılı
            tutar, harfi <strong>diğer</strong> elinle yazarsın - her klavyede olduğu
            gibi. Böylece büyük harfleri yakında sadece otomatik yardımla değil,{" "}
            <strong>kendin</strong> yazarsın.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Önemli - Shift tuşuna hep diğer elinle bas:</strong> solda ve
              sağda iki Shift tuşu vardır. Harfi bir elinle yazarsın,{" "}
              <Kbd>Shift</Kbd> tuşunu <strong>diğer</strong> elinle basılı tutarsın.
              Böylece hiçbir el iki tuşa birden basmak zorunda kalmaz.
            </p>
            <p className="m-0 mt-2">
              Örnek: büyük <strong>A</strong> (sol el) → <strong>sağ</strong>{" "}
              <Kbd>Shift</Kbd>. Büyük <strong>K</strong> (sağ el) →{" "}
              <strong>sol</strong> <Kbd>Shift</Kbd>.
            </p>
            <p className="m-0 mt-2">
              <strong>Aynı</strong> elin Shift tuşunu ya da <Kbd>Caps Lock</Kbd>{" "}
              tuşunu kullanırsan harf yine de sayılır - sonuçta doğru. Tastenflow o
              zaman arada bir hangi Shift tuşunun daha rahat olduğunu söyleyen bir{" "}
              <strong>ipucu</strong> verir. Öğretmenler bunun ne sıklıkla olduğunu
              istatistiklerde görür; bu bir hata değildir.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              İpucu: <Kbd>Shift</Kbd> tuşuna <strong>iki kez hızlıca</strong> bas -
              onu hangi parmakla tutacağını duyarsın.
            </p>
          )}
          <p className="m-0">
            <strong>Nokta, virgül ve soru işareti</strong> ancak onları öğrenince
            görünür. Ondan önce cümleyi onlar <strong>olmadan</strong> okursun - bu
            bilerek böyledir, hata değildir.
          </p>
        </Section>

        <Section title="Harfler hangi sırayla gelir?">
          <p className="m-0">
            Yeni tuşlar hep aynı sırayla gelir: önce <strong>temel sıra</strong>,
            sonra öteki harfler - en sık kullanılanlar önce. Sıradaki tuşu her
            zaman yazma alanının altındaki şeridin sağında görürsün:{" "}
            <strong>"Sıradaki tuş"</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            <strong>İlk harflerden sonra</strong> <strong>büyük harfler</strong>{" "}
            (Shift tuşu) gelir, hemen ardından <strong>nokta ve virgül</strong> -
            cümle büyük harfle başlar ve noktayla biter. Sonra öteki harfler;
            kesme işareti (') ve şapka (^) sona doğru gelir. En sonda öteki{" "}
            <strong>noktalama işaretleri</strong> (? ! : ; -),{" "}
            <strong>rakamlar</strong> ve <strong>simgeler</strong> gelir.
          </p>
        </Section>

        {detail >= 2 && (
          <Section title={'"Antrenmanım" nasıl ilerler?'}>
            <p className="m-0">
              <strong>Sana uyum sağlar.</strong> Program hangi tuşların henüz
              oturmadığını hatırlar ve tam olarak onları çalıştırır. Yeni bir tuş
              ancak ötekiler oturunca gelir. <strong>En sık kullanılan</strong>{" "}
              harfler önce gelir - böylece birkaç tuştan sonra bile{" "}
              <strong>gerçek kelimeler ve cümleler</strong> yazarsın, ilk{" "}
              <strong>öyküler</strong> de erkenden açılır.
            </p>
          </Section>
        )}

        <Section title="Yazma alanının altındaki şerit">
          <p className="m-0">
            Yazma alanının altında dört şey gösteren ince bir şerit vardır:{" "}
            <strong>{seviyen}</strong>, bugünkü çalışma <strong>süren</strong>,{" "}
            <strong>haftalık hedefin</strong> ve <strong>sıradaki tuş</strong>.
            Haftalık hedefteki halka bu hafta kaç <strong>dakika</strong>{" "}
            çalıştığını gösterir - örneğin "25 dk. (hedef: 60 dk.)"; bir{" "}
            <strong>onay işareti</strong> şu demektir: bu haftanın hedefine
            ulaştın. Sıradaki tuş, öncekiler oturunca <strong>kendiliğinden</strong>{" "}
            açılır - sen sadece çalışmaya devam et.
          </p>
          <p className="m-0">
            Şerit <strong>her zaman</strong> görünür - yazarken de. Böylece hiçbir
            şey zıplamaz ve ne kadar çalıştığını her an görürsün.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> çalışma süresini ve haftalık hedefi
            söyler. Hangi tuşların oturduğunu, hangilerinin henüz oturmadığını ve
            sıradaki tuşu <strong>"İlerlemem"</strong> bölümünde,{" "}
            <strong>"Tuşların durumu"</strong> başlığı altında görürsün (
            <Kbd>Alt</Kbd> + <Kbd>S</Kbd>, hesabın varsa).
          </p>
        </Section>

        <Section title={'Kitaplık: "Öyküler ve bilgiler" 📖'}>
          <p className="m-0">
            Antrenmanım dışında bir yol daha var: <strong>Öyküler</strong> -
            Ayarlar ⚙ içinde, <strong>"Ne çalışıyorsun?"</strong> bölümünde. Orada
            tek tek cümleler değil, bütün öyküler ve bilgi dizileri bekler:{" "}
            <strong>birçok tura yayılan tek bir öykü</strong>. Her bölüm on iki
            satırdır; bir dahaki sefere tam kaldığın yerden okumaya devam edersin.
          </p>
          <p className="m-0">
            Sadece öğrendiğin tuşlarla gerçekten yazabileceğin metinler görünür -
            bu yüzden başta kilitler görürsün. Yeterince tuş oturunca kilitler
            kendiliğinden açılır. Her satır <strong>sadece bir kez</strong> gelir:
            yazdığın bir satır tekrar olarak geri dönmez.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Bağlantılar:</strong> bir bilgi dizisinde okuduğun şey daha
              sonra antrenmanda yeniden karşına çıkar - önce{" "}
              <strong>başka kelimelerle sorulan bir soru</strong> olarak, sonra küçük
              bir ek bilgi olarak, en sonda da uygun bir fıkra olarak. Böylece
              öğrendiğin akılda kalır, ama hiç yoklama gibi gelmez.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Listenin altında "Kaynaklar ve teşekkürler" bölümü vardır: orada
              metinlerin nereden geldiğini görürsün. Bazıları bu program için
              yazıldı, bazıları serbestçe kullanılabilen kaynaklardan geliyor -
              onların adı orada yazılıdır, çünkü doğrusu budur.
            </p>
          )}
        </Section>

        <Section title="Metinler nereden geliyor? 🤖">
          <p className="m-0">
            Bu programın kendi metinlerini, yani alıştırma cümlelerini, fıkraları
            ve öyküleri, Johannes <strong>yapay zeka (YZ) yardımıyla</strong>{" "}
            yazdı, sonra kendisi okudu ve kontrol etti. Başka kaynaklardan gelen
            metinler (örneğin Vikipedi) "Kaynaklar ve teşekkürler" bölümünde
            kaynağın adıyla birlikte yazılıdır.
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Kutup Keşfi oyunundaki şarkı söyleyen balık ve mağaradaki
                mırıldanan yaratık da <strong>bilgisayar sesleridir</strong>, gerçek
                insanlar değil.
              </>
            ) : (
              <>
                Kutup Keşfi oyunundaki şarkı söyleyen balık da bir{" "}
                <strong>bilgisayar sesidir</strong>, gerçek bir insan değil.
              </>
            )}{" "}
            Sesli okuma (🗣) cihazının okuma sesini kullanır.
          </p>
        </Section>

        <Section title={YARISMA}>
          <p className="m-0">
            Bazen öğretmenin bütün sınıf için bir <strong>{YARISMA}</strong>{" "}
            başlatır. <strong>Herkes aynı metni alır</strong> ve herkesin süresi
            aynıdır.
          </p>
          <p className="m-0">
            <strong>Süre, senin ilk tuş vuruşunla başlar</strong> - öğretmenin
            başlattığı anda değil. Başlatıldıktan sonra yazmaya başlamak için{" "}
            <strong>{EINSTIEGSFENSTER_MIN} dakikan</strong> var.
          </p>
          <p className="m-0">
            <strong>Nasıl anlarsın:</strong> yazma alanının üstünde{" "}
            <strong>{YARISMA}</strong> kelimesi yazar, yanında süre görünür, bütün
            alanın çevresinde de farklı, <strong>kesik çizgili bir çerçeve</strong>{" "}
            vardır. Süre bitince ikisi de kaybolur.
          </p>
          <p className="m-0">
            <strong>Bakmadan ne kadar süre kaldığını öğrenmek için:</strong>{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> tuşlarına bas. Saat kendiliğinden
            yalnızca birkaç kez konuşur, onun dışında sessizdir.
          </p>
          <p className="m-0">
            <strong>Braille ekran sakin kalır.</strong> Süre Braille ekranda{" "}
            <strong>akmaz</strong>: üstte işler, ama o an okuduğun yere hiç girmez.
          </p>
          <p className="m-0">
            <strong>Bazen bir {YARISMA}, "Serbest yazma" türündedir.</strong> O
            zaman yanlış yazdığın bir şey olduğu gibi kalır - hiçbir şey
            işaretlenmez, hiçbir ses onu bildirmez. <Kbd>Backspace</Kbd> tuşu
            sadece o anki satırda düzeltir; biten satır olduğu gibi kalır.
            Satırın sonunda, son kelimeden sonra boşluk çubuğuna basarsın - ya da
            sınıfında "Satır sonunda Enter" ayarı açıksa <Kbd>Enter</Kbd> tuşuna.
            Sonunda yanlış kalanları ancak ardından gelen özet, okunacak bir liste
            olarak gösterir.
          </p>
          <p className="m-0">
            <strong>Erken bitirmek:</strong> <Kbd>Esc</Kbd> emin olup olmadığını
            sorar. <strong>"Yazmaya devam et"</strong> düğmesi (ya da{" "}
            <Kbd>Esc</Kbd>) satıra geri götürür, <strong>"Teslim et"</strong>{" "}
            düğmesi çalışmayı teslim eder - o ana kadar yazdığın değerlendirilir.
            Alanın altındaki <strong>"Bitti - teslim et"</strong> düğmesi de
            aynısını sormadan yapar.
          </p>
          <p className="m-0">
            <strong>Süre bitince</strong> özetin hemen görünür: dakikada vuruş,
            doğruluk, karakter sayısı, hata sayısı, satır sayısı ve henüz oturmamış
            tuşlar. Her {YARISMA} daha sonra <strong>"İlerlemem"</strong>{" "}
            bölümünde, <strong>{YARISMALAR}</strong> başlığı altında kalır - orada
            istediğin zaman yeniden okuyabilirsin.
          </p>
        </Section>

        <Section title="Sınıf Maçı ⚔️">
          <p className="m-0">
            Sınıf Maçı, sınıfındaki öteki çocuklarla{" "}
            <strong>beş dakika boyunca yarışarak yazdığın</strong> bir oyundur.
            Sadece bir sınıfta ve öğretmenin izin verdiyse oynanır.
          </p>
          <p className="m-0">
            <strong>Maçı başlatmak:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>{" "}
            tuşlarına bas ya da alıştırma alanının üstündeki şeritte,{" "}
            <strong>"🐧 Oyna"</strong> düğmesinin hemen yanındaki{" "}
            <strong>"⚔️ Sınıf Maçı"</strong> düğmesini seç. Öteki herkeste bir
            pencere açılır: <strong>"Varım!"</strong> ya da{" "}
            <strong>"Şimdi değil"</strong>. <Kbd>Esc</Kbd> çalışmaya geri götürür;
            aynı davet kendiliğinden tekrar gelmez.
          </p>
          <p className="m-0">
            <strong>Biri zaten davet ediyorsa,</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> bu daveti yeniden açar - ikinci bir maç ancak ilki
            başladıktan sonra başlatılabilir. İki kişi neredeyse aynı anda davet
            ederse önce gelen davet geçerlidir.
          </p>
          <p className="m-0">
            <strong>Şu an olmuyorsa:</strong> zaten bir maçtaysan düğmenin adı{" "}
            <strong>"⚔️ Sınıf Maçı sürüyor"</strong> olur - <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> de sana aynısını söyler. Sınıftaki başka maçlar seni
            etkilemez: aynı anda istenildiği kadar maç oynanabilir.
          </p>
          <p className="m-0">
            <strong>Herkes kendi seviyesinde yazar.</strong> Rakamları öğrenmiş
            olan rakam yazar, temel sırada olan temel sıra yazar. Yanlış tuşlar
            puan kaybettirir - bir yanlış tuş beş karakter kadar sayılır.
          </p>
          <p className="m-0">
            <strong>Bakmadan durumu öğrenmek:</strong> yazma satırının en solunda
            hep sekiz hücre vardır: <strong>P2</strong> sıralamadaki yerin, yanında
            kalan süre. <Kbd>Alt</Kbd> + <Kbd>X</Kbd> sana yerini, kalan süreyi ve
            ilk üçü söyler. Hiçbir şey kendiliğinden konuşmaz - Braille ekran
            sakin kalır.
          </p>
          <p className="m-0">
            <strong>Erken bitirmek:</strong> <Kbd>Esc</Kbd> ya da{" "}
            <strong>"Çık"</strong> düğmesi emin olup olmadığını sorar.{" "}
            <strong>"Yazmaya devam et"</strong> düğmesi (ya da <Kbd>Esc</Kbd>)
            satıra geri götürür. <strong>"Çık"</strong> düğmesi maçı sadece senin
            için bitirir - ötekiler yazmaya devam eder ve o ana kadar yazdığını
            görür.
          </p>
          <p className="m-0">
            <strong>Maç çalışma süresine sayılır</strong> ve yeni bir tuşun kilidini
            açabilir - tıpkı normal bir alıştırma turu gibi.{" "}
            <strong>Sıralamadaki yer kaydedilmez.</strong> Sonunda liste görünür:
            ilk üç için Kupa, Gümüş ve Bronz, ötekiler kendi sayılarıyla. Sonra{" "}
            <strong>"Çalışmaya devam et"</strong> düğmesi ya da <Kbd>Esc</Kbd> geri
            götürür.
          </p>
        </Section>

        <Section title="Önemli tuşlar">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              Mac bilgisayarda <Kbd>Alt</Kbd> tuşunun yerinde <Kbd>⌥</Kbd> (Option)
              tuşu vardır.
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>En önemli tuş:</strong> her pencereyi kapatır ve imleç
                sonra <strong>hep yazma alanında</strong> durur. Hiçbir şey açık
                değilken bile <Kbd>Esc</Kbd> imleci oraya geri getirir. Tek istisna
                "Tuşları Keşfet": orada <Kbd>Esc</Kbd> de keşfedilecek bir tuştur,
                çıkmak için ona ikinci kez basman gerekir.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>İki kez hızlıca bas: doğru parmak söylenir.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Yazma alanına gider.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Alıştırmaya geçer.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                İlerlemem bölümünü açar (öğretmenler için: Sınıflarım). Bunun için
                giriş yapmış olman gerekir. Bir kez daha basınca yazma alanına döner.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Şu an kaçıncı satırda olduğunu söyler.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Çalışma süresini verir - Braille ekranda ve (sesli okuma açıksa)
                duyuru olarak.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Hangi {seviyede} olduğunu söyler.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Tuşları Keşfet:</strong> bastığın her tuş okunur ve büyük
                gösterilir - önce kısaltması, sonra adı, sonra ne işe yaradığı
                (örneğin "Tab - Tab tuşu - bir sonraki öğeye geçer"). Bu; bütün
                özel tuşlar ve noktalama işaretleri, Alt Gr ile yazılan karakterler
                (Mac bilgisayarda: Option) ve onlara nasıl ulaşıldığı, Ctrl + C
                gibi tuş birleşimleri ve ne işe yaradıkları için de geçerlidir.
                Tastenflow kısayolları (<AltText>Alt + H, Alt + V ...</AltText>) çalışmaya devam eder.
                Ekran klavyesi hangi tuşa basıldığını gösterir. Sesli okuma
                kapalıysa okuma sesi susar. Braille ekranda açıklama bir sonraki
                tuşa kadar durur ve kaydırma tuşlarıyla baştan sona okunabilir;
                ekranda bir pencerede görünür. Hiçbir şey yazılmaz, hiçbir şey
                kaybolmaz. <Kbd>Shift</Kbd> bir tuşun üstteki işaretini, <Kbd>AltGr</Kbd> (Mac'te: <Kbd>Option</Kbd>) üçüncüsünü verir; böylece bütün işaretleri tek tek deneyebilirsin.{" "}<strong>Çıkmak için:</strong> bir kez daha{" "}
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>, iki kez <Kbd>Esc</Kbd> - ya da
                sayfayı yenile.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Tuşları Bul:</strong> program bir tuşun adını söyler, sen
                onu ararsın. İlk bulduğunda "Buldun! Başka bir tuşa bas, sonra bir kez daha bas ..." duyarsın
                - ancak ikinci basış sayılır, o da arada başka bir tuşa basılırsa.
                Sonra sıradaki tuş gelir. Başka bir
                tuşa basarsan sadece onun adı söylenir. Pencerede <Kbd>Alt</Kbd> +{" "}
                <Kbd>4</Kbd> keşfetmekle bulmak arasında geçiş yapar.{" "}
                <strong>Çıkmak için:</strong> Tuşları Keşfet ile aynı.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Renkler ve karşıtlık:</strong> yedi renk seti - açık, koyu,
                sarı üzerinde siyah, mavi üzerinde sarı ve diğerleri. Her biri
                listede kendi renkleriyle görünür; yani nasıl göründüğünü önceden
                görürsün.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Klavye kısayolları listesini açar ya da kapatır.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Öğretmenlerden gelen mesajları açar ya da kapatır.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Yazma alanını büyütür ya da küçültür.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Sesli okumayı açar ya da kapatır.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Bu yardımı açar ya da kapatır.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Program sana nasıl destek olur?">
            <p className="m-0">
              Program her harfi ayrı ayrı ölçer - ne kadar doğru ve ne kadar hızlı
              yazdığını. En zayıf harfleri kendiliğinden çalıştırır ve yeni bir
              harfin kilidini ancak öncekiler oturunca açar. Böylece sana özel bir
              öğrenme yolu oluşur.
            </p>
            <p className="m-0">
              Zorluk seviyesi (1-50), çalışmanın hep{" "}
              <strong>zorlayıcı ama yapılabilir</strong> kalmasını sağlar: iyi
              gidince yükselir, fazla zor gelince yeniden düşer.{" "}
              <strong>"İlerlemem"</strong> bölümünde ilerlemenle ilgili her şeyi -
              ve nasıl geliştiğini - görürsün.
            </p>
          </Section>
        )}

        <Section title="Sınıfsız çalışmak - kişisel hesap 🙋">
          <p className="m-0">
            Bir sınıfa bağlı değilsen hesabını kendin açarsın: yuvarlak{" "}
            <strong>"Hesabım"</strong> düğmesine bas ve{" "}
            <strong>"Sınıfsız, kendi başıma çalışıyorum"</strong> seçeneğini
            işaretle. Bunun için bir e-posta adresi gerekir: her pazartesi oraya
            haftanın özeti gelir - ama sadece gerçekten çalışılan haftalarda. Bir
            yıl boyunca kimse Tastenflow programını açmazsa bir uyarı e-postası
            gelir; ardından üç hafta içinde kimse giriş yapmazsa hesap bütün
            ilerlemeyle birlikte silinir.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Asılacak afiş (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "tr");
  return (
    <Section title="Asılacak bir afiş">
      <p className="m-0">
        Tastenflow programını okulunda ya da kurumunda tanıtmak istiyor musun?
        Burada <strong>yazdırıp asabileceğin bir afiş</strong> var: A3 dikey;
        Tastenflow neler yapabiliyor, bir bakışta görünür; bir de tastenflow.org
        adresine giden bir QR kodu.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Afişi indir (PDF, A3, {groesse(plakat.bytes, "tr")})
        </a>
      </p>
    </Section>
  );
}
