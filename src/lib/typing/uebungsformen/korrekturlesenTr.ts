/**
 * ★ TR-W (09.10.2026): „Korrekturlesen" auf Weg „tr" (*Okuyup düzelt*, Glossar §2.2) - in jedem Satz steht ein falsches, ECHTES
 * türkisches Wort, das man deutlich anders hört (Johannes 02.09.2026: der Fehler muss hörbar sein) und das im Satz offensichtlich
 * nicht stimmt. Neu auf Türkisch geschrieben, nicht übersetzt.
 *
 * Türkisch wird fast so gesprochen, wie es geschrieben wird - unhörbar sind nur wenige Paare: das weiche `ğ` (es dehnt den Vokal
 * davor, *dağ* klingt wie „daa"), die Zirkumflex-Vokale (*kâr/kar*, *hâlâ/hala*) und Doppelvokale. Der Wächter rechnet dafür einen
 * Lautschlüssel (`ğ` fällt weg, `â î û` werden `a i u`) - ein Paar, das sich nur darin unterscheidet, wäre eine Aufgabe gegen das Kind.
 *
 * ★ Hörbar sind dagegen die Buchstaben, die einen ANDEREN LAUT tragen: `ç` (tsch) gegen `c` (dsch), `ş` gegen `s`, `ı` gegen `i`,
 * `ö` gegen `o`, `ü` gegen `u`. Fünfzehn Fälle üben genau das - ohne den türkischen Buchstaben ist es ein anderes Wort: *çam/cam*,
 * *gol/göl*, *şişe/sise*, *ön/on*, *saçımı/sacımı*, *ılık/ilik*, *kaş/kas*, *açısı/acısı*, *taşları/tasları*, *kili/kılı*,
 * *gece/geçe*, *su/şu*, *başıma/basıma*, *ucu/üçü*; dazu *kıra/kire* (dort trägt die Endung die Vokalharmonie mit).
 *
 * Kein Geschlecht (Türkisch hat keines), keine Anredewörter. Keine Feiertage, keine Religion, keine Politik. Nichts aus der Sperrliste
 * (`sperrlisteTr.ts`, Kern UND Wortbasis, auch gefaltet) - darum keine Paare mit *sık/şık*, *kus/kuş*, *öl*.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_TR: readonly Korrekturfall[] = [
  { satz: "Yemekten önce tabakları kasaya koydum.", falsch: "kasaya", richtig: "masaya" },
  { satz: "Ağaçtan sulu bir alma kopardım.", falsch: "alma", richtig: "elma" },
  { satz: "Balıkçı denizden kocaman bir bal tuttu.", falsch: "bal", richtig: "balık" },
  { satz: "Kışın ayağıma kalın bir çorba giyerim.", falsch: "çorba", richtig: "çorap" },
  { satz: "Ekmeği fırtınadan sıcak sıcak aldık.", falsch: "fırtınadan", richtig: "fırından" },
  { satz: "Arılar çiçeklerden dal yapar.", falsch: "dal", richtig: "bal" },
  { satz: "Bir haftada yedi gül vardır.", falsch: "gül", richtig: "gün" },
  { satz: "Bir yılda on iki saat vardır.", falsch: "saat", richtig: "ay" },
  { satz: "Bir saatte altmış dalga vardır.", falsch: "dalga", richtig: "dakika" },
  { satz: "Kar yağınca kardan adam yazarız.", falsch: "yazarız", richtig: "yaparız" },
  { satz: "Çorbamı kaşla içerim.", falsch: "kaşla", richtig: "kaşıkla" },
  { satz: "Kediler kare yakalamayı sever.", falsch: "kare", richtig: "fare" },
  { satz: "Öğretmenimiz sınıfta bize dert anlatır.", falsch: "dert", richtig: "ders" },
  { satz: "Pilot büyük uçağı uyutur.", falsch: "uyutur", richtig: "uçurur" },
  { satz: "Tren demir paylar üstünde gider.", falsch: "paylar", richtig: "raylar" },
  { satz: "Gece gökyüzünde yıllar parlar.", falsch: "yıllar", richtig: "yıldızlar" },
  { satz: "Kışın havalar çok sıcak olur.", falsch: "sıcak", richtig: "soğuk" },
  { satz: "Sonbaharda ağaçların bardakları dökülür.", falsch: "bardakları", richtig: "yaprakları" },
  { satz: "Balıklar dağda yaşar.", falsch: "dağda", richtig: "suda" },
  { satz: "Yağmur yağınca şeftalimi açarım.", falsch: "şeftalimi", richtig: "şemsiyemi" },
  { satz: "Kitabı okurken sayfaları tek tek çiğnerim.", falsch: "çiğnerim", richtig: "çeviririm" },
  { satz: "Dişlerimi diş fırçasıyla fırlatırım.", falsch: "fırlatırım", richtig: "fırçalarım" },
  { satz: "İstanbul'da Boğaz'ı çamurla geçeriz.", falsch: "çamurla", richtig: "vapurla" },
  { satz: "Tavşanın uzun kulpları vardır.", falsch: "kulpları", richtig: "kulakları" },
  { satz: "Arabada emniyet kemanı takarız.", falsch: "kemanı", richtig: "kemeri" },
  { satz: "Örümcek ince iplerden bir ağaç örer.", falsch: "ağaç", richtig: "ağ" },
  { satz: "Kışın gölün üstü bez tutar.", falsch: "bez", richtig: "buz" },
  // --- Türk harfleri: onlarsız başka bir kelime (ve başka bir ses) ---
  { satz: "Ormandaki cam ağaçları kışın da yeşil kalır.", falsch: "cam", richtig: "çam" },
  { satz: "Futbolcu son dakikada harika bir göl attı.", falsch: "göl", richtig: "gol" },
  { satz: "Pazar günü kire pikniğe gittik.", falsch: "kire", richtig: "kıra" },
  { satz: "Kebap için eti sise takarız.", falsch: "sise", richtig: "şişe" },
  { satz: "Arabanın on koltuğunda annem oturuyor.", falsch: "on", richtig: "ön" },
  { satz: "Berber sacımı kısa kesti.", falsch: "sacımı", richtig: "saçımı" },
  { satz: "Bebeğin banyo suyu ilik olmalı, ne sıcak ne soğuk.", falsch: "ilik", richtig: "ılık" },
  { satz: "Gözlerimin üstünde iki kas var.", falsch: "kas", richtig: "kaş" },
  { satz: "Üçgenin üç acısı vardır.", falsch: "acısı", richtig: "açısı" },
  { satz: "Dere kenarında yassı tasları suya attık.", falsch: "tasları", richtig: "taşları" },
  { satz: "Çömlekçi yumuşak kılı yoğurup bir vazo yaptı.", falsch: "kılı", richtig: "kili" },
  { satz: "Baykuş gündüz uyur, geçe avlanır.", falsch: "geçe", richtig: "gece" },
  { satz: "Bitkiler büyümek için şu ister.", falsch: "şu", richtig: "su" },
  { satz: "Güneşte şapkamı basıma taktım.", falsch: "basıma", richtig: "başıma" },
  { satz: "Kalemimin üçü kırıldı, onu yeniden açtım.", falsch: "üçü", richtig: "ucu" },
];
