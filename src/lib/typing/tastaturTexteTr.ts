/**
 * ★ O-TR (02.10.2026): NAME, KURZNAME UND ERKLÄRUNG JEDER TASTATUR TÜRKISCH.
 *
 * Bauart wie `tastaturTextePl.ts`: `layouts.ts` bleibt in Etappe O unberührt,
 * die türkische Tabelle steht HIER, und `layoutTexteIn` (`tastaturTexteIt.ts`)
 * ist der eine Weg, den die Oberfläche geht. Eine Tabelle je `LayoutId`, damit
 * `tsc` für jede Tastatur einen Eintrag verlangt.
 *
 * Namen nach dem Glossar (`recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md` §2.9):
 * "Türkçe Q", "Türkçe F" (kurz "Q klavye", "F klavye"), "Almanca (Almanya ve
 * Avusturya)", "İsviçre (Almanca)", "İngilizce (ABD)", "İngilizce (Birleşik
 * Krallık)"; die übrigen nach demselben Muster (Sprache, dann Land in
 * Klammern). Tastennamen wie auf der Kappe: Shift, Caps Lock, Alt Gr, Mac:
 * Option; "ölü tuş" für die Totaste (§2.1). Im Satz immer "... tuşu" -
 * KEINE Endung an Tastenname, Zeichen, "Windows" oder "Mac" (Regel 6:
 * "Windows sisteminde", "Mac bilgisayarlarda"). Die Erklärungen sagen
 * dasselbe wie die englischen (`layout.en.hinweis`), Satz für Satz an ihnen
 * geprüft; sie sind unpersönlich, weil Kind und Lehrkraft sie lesen.
 */
import { layoutTexteEnglisch, type LayoutId } from "./layouts";

type Texte = { label: string; kurz: string; hinweis?: string };

const INGILIZCE =
  "İngilizce klavyelerde ä, ö, ü ve ß yoktur. Bu yüzden Almanca metinler bunların yerine alışılmış " +
  "yazımları kullanır (ä → ae, ß → ss) - İngilizce için bu klavye tam uygundur.";

export const LAYOUT_TEXTE_TR: Record<LayoutId, Texte> = {
  de: { label: "Almanca (Almanya ve Avusturya)", kurz: "Alman klavyesi" },
  ch: {
    label: "İsviçre (Almanca)",
    kurz: "İsviçre klavyesi",
    hinweis:
      "İsviçre klavyesinde ß tuşu yoktur; bu yüzden Almanca kelimelerde ß yerine ss yazılır - " +
      "İsviçre'deki gibi. Büyük Ä, Ö ve Ü harflerini ¨ ölü tuşu (ü tuşunun sağında), ardından Shift " +
      "ve harf verir (ä, ö ve ü tuşlarında Shift; à, é ve è verir). Mac bilgisayarlarda Caps Lock da çalışır.",
  },
  us: { label: "İngilizce (ABD)", kurz: "ABD klavyesi", hinweis: INGILIZCE },
  uk: { label: "İngilizce (Birleşik Krallık)", kurz: "İngiliz klavyesi", hinweis: INGILIZCE },
  fr: {
    label: "Fransızca (Fransa, AZERTY)",
    kurz: "Fransız klavyesi",
    hinweis:
      "Fransız AZERTY klavyesinde (Windows) É, Ç, Œ ve Fransızca tırnak işaretleri yoktur - É ya da Ç içeren metinler " +
      "atlanır, Œ ve Fransızca tırnak işaretleri için alışılmış yazımlar kullanılır (Œ → Oe, Fransızca tırnak işaretleri → düz tırnak). À, È ve Ù harflerini " +
      "grave aksanı ölü tuşu (Alt Gr + 7), Ê, Î, Ô ve Û harflerini ^ tuşu verir - ardından Shift ve harf.",
  },
  be: {
    label: "Fransızca (Belçika, AZERTY)",
    kurz: "Belçika klavyesi",
    hinweis:
      "Belçika AZERTY klavyesinde (Windows) büyük Ç, Œ ve Fransızca tırnak işaretleri yoktur - Ç içeren metinler atlanır, " +
      "Œ ve Fransızca tırnak işaretleri için alışılmış yazımlar kullanılır. É harfini akut aksanı ölü tuşu (Alt Gr + ù), " +
      "À, È ve Ù harflerini grave aksanı ölü tuşu (Alt Gr + µ), Ê, Î, Ô ve Û harflerini ^ tuşu " +
      "verir - ardından Shift ve harf.",
  },
  "ch-fr": {
    label: "İsviçre (Fransızca; İsviçre ve Lüksemburg)",
    kurz: "İsviçre Fransızca klavyesi",
    hinweis:
      "İsviçre Fransızca klavyesinde büyük Ç, Œ ve Fransızca tırnak işaretleri yoktur - Ç içeren metinler atlanır, Œ ve Fransızca tırnak işaretleri " +
      "için alışılmış yazımlar kullanılır. É harfini akut aksanı ölü tuşu (Alt Gr + '), À, È ve Ù " +
      "harflerini grave aksanı ölü tuşu (Shift + ^) verir - ardından Shift ve harf. é, à ve è " +
      "tuşlarında Shift; ö, ä ve ü verir. Mac bilgisayarlarda É, À ve È için Caps Lock da çalışır.",
  },
  "ca-csa": {
    label: "Kanada Fransızcası (Canadien multilingue standard)",
    kurz: "Kanada çok dilli klavyesi (CSA)",
    hinweis:
      "Kanada çok dilli klavyesinde (CSA) Œ yoktur - metinler alışılmış yazımı kullanır " +
      "(Œ → Oe). É, À, È, Ç ve Ù doğrudan Shift tuşuyla yazılır; Ê, Î, Ô ve Û ^ ile (ardından " +
      "Shift ve harf), Fransızca tırnak işaretleri Alt Gr + Z ve Alt Gr + X ile, € Alt Gr + E ile.",
  },
  "ca-fr": {
    label: "Kanada Fransızcası (\"Français (Canada)\", Windows standardı)",
    kurz: "Kanada Fransızca klavyesi",
    hinweis:
      "Windows sisteminde Kanada için standart Fransızca klavye. Œ yoktur - metinler alışılmış " +
      "yazımı kullanır. É doğrudan Shift tuşuyla yazılır; ç ve Ç harflerini çengel ölü tuşu " +
      "(ardından c ya da Shift + C), à, è ve ù harflerini grave aksanı ölü tuşu, Ê, Î, Ô ve Û " +
      "harflerini ^ tuşu verir. Fransızca tırnak işaretleri için ayrı bir tuş vardır.",
  },
  es: {
    label: "İspanyolca (İspanya, ISO)",
    kurz: "İspanyol klavyesi",
    hinweis:
      "İspanyol klavyesinde akut aksan (á é í ó ú), ñ tuşunun sağındaki ölü tuştur; aynı tuşta " +
      "Shift iki nokta işaretini (ü) verir. ¡ doğrudan yazılır, ¿ için Shift gerekir - Latin " +
      "Amerika klavyesinin TAM TERSİ.",
  },
  latam: {
    label: "İspanyolca (Latin Amerika)",
    kurz: "Latin Amerika klavyesi",
    hinweis:
      "Latin Amerika klavyesinde akut aksan (á é í ó ú), p tuşunun sağındaki ölü tuştur; aynı " +
      "tuşta Shift iki nokta işaretini (ü) verir. ¿ doğrudan yazılır, ¡ için Shift gerekir - " +
      "İspanya klavyesinin TAM TERSİ. Bu düzende avro işareti doğrulanmadı.",
  },
  it: {
    label: "İtalyanca (İtalya, Windows Italiano / Mac Italiano - Pro)",
    kurz: "İtalyan klavyesi",
    hinweis:
      "İtalyan klavyesinde à, è, ì, ò ve ù harflerinin kendi tuşları vardır; é, Shift + è ile " +
      "yazılır. Büyük À È É Ì Ò Ù Windows sisteminde yoktur (yalnızca Alt koduyla), bu yüzden " +
      "orada bunları içeren metinler atlanır; Mac bilgisayarlarda Option + Shift ile yazılır.",
  },
  "it-qzerty": {
    label: "İtalyanca (Mac Italiano, QZERTY)",
    kurz: "Mac İtalyan klavyesi (QZERTY)",
    hinweis:
      "Mac \"Italiano\" klavyesi QZERTY düzenindedir: z ile w yer değiştirmiştir, m harfi l " +
      "tuşunun sağındadır ve rakamlar için Shift gerekir (sayı sırasında & \" ' ( ç è ) £ à é " +
      "görünür). à, è, é, ì, ò ve ù harflerinin kendi tuşları vardır.",
  },
  // NVDA-Falle (Alt Gr + N = Ctrl + Alt + N) wie im englischen Text; unpersönlich,
  // weil Kind und Lehrkraft den Satz lesen (sen/siz nie mischen, Regel 1).
  pl: {
    label: "Lehçe (programcı)",
    kurz: "Lehçe klavye",
    hinweis:
      "Lehçe programcı klavyesinde (Windows: \"Polski (programisty)\", Mac: \"Polski Pro\") Lehçe " +
      "harfler Alt Gr (Mac: Option) ve temel harfle yazılır: ą = a, ć = c, ę = e, ł = l, ń = n, " +
      "ó = o, ś = s, ź = x, ż = z. Büyük harf için Shift de eklenir. Tuşun üzerinde yalnızca temel " +
      "harf görünür. Windows sisteminde NVDA açıkken Alt Gr + N (ń) NVDA programını yeniden " +
      "başlatır, çünkü Ctrl + Alt + N bir NVDA kısayoludur: bu kısayol NVDA ayarlarından " +
      "kapatılabilir ya da Shift + Caps Lock + Alt Gr + N kullanılabilir.",
  },
  // Glossar §2.9: "Türkçe Q" / "Türkçe F", kurz "Q klavye" / "F klavye".
  "tr-q": {
    label: "Türkçe Q",
    kurz: "Q klavye",
    hinweis:
      "Türkçe Q klavyede ı, ğ, ş, ç, ö ve ü harflerinin kendi tuşları vardır: p, l ve m " +
      "tuşlarının sağında. Noktalı i ile noktasız ı iki ayrı tuştur: noktalı i, ş tuşunun " +
      "sağında; noktasız ı, u ile o tuşlarının arasındadır. Kesme işareti Shift + 2, tırnak " +
      "işareti 1 tuşunun solunda, ₺ ise Alt Gr + T (Mac: Option + T). â, î ve û harflerini " +
      "^ ölü tuşu (Shift + 3) ve ardından ünlü verir.",
  },
  "tr-f": {
    label: "Türkçe F",
    kurz: "F klavye",
    hinweis:
      "Türkçe F klavyede temel sıra u i e a ü t k m l y ş harflerinden oluşur (solda u i e a, " +
      "sağda k m l y). Çıkıntılı tuşlar a (solda) ve k (sağda) tuşlarıdır. ı, ğ, ş, ç, ö ve ü " +
      "harflerinin kendi tuşları vardır. Kesme işareti Shift + 7, tırnak işareti Shift + 2, ₺ ise " +
      "Alt Gr + T (Mac: Option + T). â, î ve û harflerini Windows sisteminde ^ ölü tuşu (Shift + 3) " +
      "verir; Mac bilgisayarlarda Option + a, i ya da u ile yazılır.",
  },
  cs: {
    label: "Çekçe (QWERTZ)",
    kurz: "Çek klavyesi",
    hinweis:
      "Çek klavyesinde ě š č ř ž ý á í é sayı sırasındadır; rakamları Shift verir. Bu tuşlarda " +
      "Shift her zaman rakam verir, asla büyük harf vermez: büyük Č Š Ř Ž Á É Í Ý Ě için háček ya " +
      "da čárka ölü tuşu (= tuşunun sağında; háček, Shift + aynı tuş), ardından Shift ve harf - ya da " +
      "Caps Lock. ď ť ň, háček + d, t ya da n ile; ó, čárka + o ile yazılır. ú ve ů harflerinin " +
      "kendi tuşları vardır. Büyük Ů yalnızca Caps Lock ile çalışır.",
  },
  "cs-qwerty": {
    label: "Çekçe (QWERTY)",
    kurz: "Çek QWERTY klavyesi",
    hinweis:
      "Çek QWERTY klavyesinde y ve z, İngilizce klavyedeki yerlerindedir; bunun dışında Çek " +
      "klavyesiyle aynıdır: ě š č ř ž ý á í é sayı sırasındadır, rakamları Shift verir ve bu " +
      "tuşlarda Shift asla büyük harf vermez. Büyük Č Š Ř Ž Á É Í Ý Ě için háček ya da čárka ölü " +
      "tuşu (= tuşunun sağında; háček, Shift + aynı tuş), ardından Shift ve harf - ya da Caps Lock. " +
      "ď ť ň, háček + d, t ya da n ile; ó, čárka + o ile yazılır. Büyük Ů yalnızca Caps Lock ile çalışır.",
  },
  // RÜCKFALL-EN (G3b): die bg-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "bg": layoutTexteEnglisch("bg"),
  "bg-schreibm": layoutTexteEnglisch("bg-schreibm"),
  "bg-phon": layoutTexteEnglisch("bg-phon"),
  "bg-phon-trad": layoutTexteEnglisch("bg-phon-trad"),
  // RÜCKFALL-EN (G3b): die el-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "el": layoutTexteEnglisch("el"),
  "el-220": layoutTexteEnglisch("el-220"),
  "el-319": layoutTexteEnglisch("el-319"),
  // RÜCKFALL-EN (G3b): die hu-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "hu": layoutTexteEnglisch("hu"),
  "hu-101": layoutTexteEnglisch("hu-101"),
  // RÜCKFALL-EN (G3b): die nl-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "nl-intl": layoutTexteEnglisch("nl-intl"),
  "nl-dutch": layoutTexteEnglisch("nl-dutch"),
  // RÜCKFALL-EN (G3b): die pt-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "pt": layoutTexteEnglisch("pt"),
  // RÜCKFALL-EN (G3b): die br-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "br-abnt2": layoutTexteEnglisch("br-abnt2"),
  // RÜCKFALL-EN (G3b): die ro-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "ro": layoutTexteEnglisch("ro"),
  "ro-prog": layoutTexteEnglisch("ro-prog"),
  // RÜCKFALL-EN (G3b): die sv-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "sv": layoutTexteEnglisch("sv"),
  // RÜCKFALL-EN (G3b): die uk-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "ua": layoutTexteEnglisch("ua"),
  "ua-std": layoutTexteEnglisch("ua-std"),
};
