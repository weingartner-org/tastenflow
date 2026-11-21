/**
 * Tastenflow - „Tuşları Keşfet" / „Tuşları Bul" in der TÜRKISCHEN Bedienung
 * (★ O-TR, 02.10.2026, Glossar `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md`
 * §2.1, §2.8, §2.9, §2.11, §4 Nr. 1/8/12; Tastenlage nach `layouts.ts` `TR_Q`).
 *
 * Dieselbe Logik wie bei den anderen Sprachen: `erkundeTaste` in
 * `tastenErklaerung.ts` entscheidet weiter, WAS eine Taste ist (Sondertaste,
 * Zeichen, Kombination, dritter Layer, Totaste) und ob sie geschluckt wird.
 * Hier stehen nur die WÖRTER - dieselben Fächer wie in `tastenErklaerungPl.ts`,
 * Eintrag für Eintrag, NEU auf Türkisch geschrieben (nicht übersetzt).
 *
 * ── Glossar (§2.9) ──────────────────────────────────────────────────────────
 *  Türkische Tastaturen tragen englische Kappen; die Taste heisst wie auf der
 *  Kappe, im Satz IMMER mit „tuş" dahinter - die Endung hängt an „tuş", nie an
 *  den Namen (Regel 6): „Enter tuşuna bas", „Shift tuşunu basılı tut".
 *  Windows: Shift · Caps Lock · Enter · Backspace · Delete · Tab · Ctrl · Alt ·
 *  Alt Gr · Esc · boşluk çubuğu · Home · End · Page Up · Page Down · Insert ·
 *  Windows tuşu · menü tuşu. Mac: Return · Delete (Rücktaste) · İleri Sil (Entf)
 *  · Kontrol · Option · Komut · Fn. Pfeile: sol ok · sağ ok · yukarı ok ·
 *  aşağı ok. Finger in `fingers.ts` (`FINGER_TR`).
 *
 * ── Die Regeln der Sätze ────────────────────────────────────────────────────
 *  · Ein Kind ist gemeint: **sen**, kurze Befehlsform („bas", „bul"), keine
 *    Maus-Wörter (nie „tıkla").
 *  · Keine Endung an Platzhalter, Zahl, Tastenname, Produktname: „Tab tuşunu
 *    bul", „Word programında", „Tastenflow içinde", „Mac bilgisayarda".
 *  · Höchstens ein „!" je Meldung; gerade Anführungszeichen; nur Bindestrich.
 *  · Der erste Satz von `was` beginnt klein - die Taste ist sein Subjekt.
 *    ⚠️ Er beginnt NIE mit i/ı: `gross1`/`klein1` in `tastenErklaerung.ts`
 *    rechnen mit `toUpperCase()` („imleç" würde „Imleç"). Darum „yazı
 *    imlecini …", und keine Wirkung in {@link WIRKUNG_TR} beginnt mit İ/I.
 *  · ı und i sind ZWEI Buchstaben (Glossar §4 Nr. 1): ihr Name sagt es immer
 *    („noktasız ı", „noktalı i"), siehe `SPOKEN_TR` in `fingers.ts`.
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { spokenLabel } from "./fingers";
import { unitKind } from "./letters";
import type { LayoutId } from "./layouts";
import { grossFuer, kleinFuer } from "./sprachRegister";
import type { TastenErklaerung } from "./tastenErklaerung";

/** Satzanfang gross - türkisch („i" ⇒ „İ", nie „I"; Glossar §1 Regel 9). */
export function grossAnfangTr(s: string): string {
  return s ? `${grossFuer(s[0], "tr")}${s.slice(1)}` : s;
}

/**
 * ★ O-TR (02.10.2026, Glossar §4 Nr. 1/12, §6 Nr. 8): die GESPROCHENE Form
 * der englischen Kappen, die eine türkische Stimme sonst buchstabieren kann -
 * „Shift" ⇒ „şift" (so schreibt NVDA tr), „Ctrl" ⇒ „kontrol" (MEGEP). Nur
 * für Sätze, die AUSSCHLIESSLICH gesprochen werden (`erkundeTaste().ansage`,
 * die Freischalt-Ansage) - auf Schirm und Braillezeile bleibt die Kappe.
 * ⚠️ Vorgabe, am Gerät NICHT gemessen (Windows-Messliste).
 */
export function sprechformTr(satz: string): string {
  // Am Satzanfang gross („Şift tuşunu …"), sonst klein („… şift tuşuyla").
  const form = (klein: string) => (_wort: string, stelle: number, ganz: string) =>
    stelle === 0 || /[.!?]\s$/.test(ganz.slice(Math.max(0, stelle - 2), stelle)) ? grossAnfangTr(klein) : klein;
  return satz.replace(/\bShift\b/g, form("şift")).replace(/\bCtrl\b/g, form("kontrol"));
}

/**
 * ★ O-TR (02.10.2026): der lesbare türkische Name einer Lern-Einheit - für
 * die Lehrkraft-Statistik, die Stand-Zeile und die Tastenkarte, wie
 * `unitLabelPl` (`letters.ts` bleibt in dieser Etappe unberührt). Buchstaben
 * gross wie auf der Kappe, türkisch gerechnet („ş" ⇒ „Ş"); i und ı mit ihrem
 * Namen („noktalı i", „noktasız ı"), damit „İ" und „I" nie verwechselt werden
 * (Glossar §4 Nr. 1). Zeichen über dieselbe Tabelle wie die Sprachausgabe.
 */
export function unitLabelTr(unit: string): string {
  switch (unitKind(unit)) {
    case "shift":
      return "büyük harfler";
    case "ziffer":
      return `${unit} rakamı`;
    case "satzzeichen":
    case "sonderzeichen":
      return spokenLabel(unit, "tr");
    default:
      if (unit === "ß") return "ß";
      if (I_HARFLERI.has(unit)) return spokenLabel(kleinFuer(unit, "tr"), "tr");
      return grossFuer(unit, "tr") !== kleinFuer(unit, "tr") ? grossFuer(unit, "tr") : spokenLabel(unit, "tr");
  }
}

/* ══ i und ı ═══════════════════════════════════════════════════════════════ */

/** Die vier i-Buchstaben des Türkischen (zwei Paare: i/İ, ı/I). */
const I_HARFLERI: ReadonlySet<string> = new Set(["i", "İ", "ı", "I"]);
const MIT_PUNKT: ReadonlySet<string> = new Set(["i", "İ"]);

/**
 * ★ O-TR (Glossar §4 Nr. 1): „ı" für „i" ist ein Fehler (ein anderes Wort:
 * ılık/ilik) - die Rückmeldung nennt beide, ohne zu werten: „Bu noktasız ı.
 * Aranan: noktalı i." `null`, wenn es nicht genau diese Verwechslung ist (nur
 * gross/klein vertauscht ist KEINE). Bereitgestellt, nicht eingehängt - wie
 * `hinweisPolskaLiteraPl`.
 */
export function hinweisIHarfiTr(soll: string, ist: string): string | null {
  if (!I_HARFLERI.has(soll) || !I_HARFLERI.has(ist) || soll === ist) return null;
  if (MIT_PUNKT.has(soll) === MIT_PUNKT.has(ist)) return null;
  return `Bu ${spokenLabel(ist, "tr")}. Aranan: ${spokenLabel(soll, "tr")}.`;
}

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/**
 * Glossar §2.9: die deutsche Kappe („Strg", „Entf", „Pos 1") bleibt auf der
 * Bildschirm-Tastatur; „Tuşları Keşfet" sagt dazu, was darauf steht.
 */
const ALMAN_KAPPE = (aufdruck: string) => `Alman klavyesinde bu tuşun üzerinde "${aufdruck}" yazar.`;

/** Türkische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteTr(
  id: string,
  plattform: Plattform,
  layout: LayoutId = "tr-q",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Option" : "Ctrl";
  // Auf den türkischen Tastaturen schreibt Alt Gr (Mac: Option) @, € und ₺.
  const turk = layout === "tr-q" || layout === "tr-f";
  switch (id) {
    case "tabulator":
      return {
        kurz: "Tab",
        name: "Tab tuşu",
        was: [
          "bir sonraki öğeye geçer, örneğin bir bağlantıya, bir alana ya da bir düğmeye.",
          "Shift tuşuyla birlikte bir öncekine döner.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: "Return",
            name: "Return tuşu",
            was: ["onaylar ve gönderir.", "Bağlantıları açar, metinde yeni bir satır başlatır."],
          }
        : {
            kurz: "Enter",
            name: "Enter tuşu",
            was: [
              "onaylar ve gönderir.",
              "Bağlantıları açar, düğmeleri çalıştırır, metinde yeni bir satır başlatır.",
            ],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "boşluk çubuğu",
        was: ["kelimelerin arasına boşluk koyar.", "Düğmeleri de çalıştırır ve onay kutularını işaretler."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: mac ? "Delete tuşu" : "Backspace tuşu",
        was: ["yazı imlecinin solundaki karakteri siler.", "Bir harfi böyle düzeltirsin."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "İleri Sil tuşu",
            was: [
              "yazı imlecinin sağındaki karakteri siler.",
              "Klavyende bu tuş yoksa Fn ve Delete tuşlarına birlikte bas.",
            ],
          }
        : {
            kurz: "Delete",
            name: "Delete tuşu",
            was: ["yazı imlecinin sağındaki karakteri siler.", "Seçili dosyaları da siler.", ALMAN_KAPPE("Entf")],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "Esc tuşu",
        was: [
          "vazgeçer.",
          "Menüleri, pencereleri ve uyarıları kapatır.",
          "Tastenflow içinde seni yazma alanına geri götürür.",
        ],
      };
    case "umschalt":
      return {
        kurz: "Shift",
        name: "Shift tuşu",
        was: [
          "basılı tuttuğun sürece büyük harf yazar.",
          "Bir tuşun üstteki işaretini de verir, örneğin soru işaretini.",
        ],
      };
    case "feststell":
      return {
        kurz: "Caps Lock",
        name: "Caps Lock tuşu",
        was: ["sen bir kez daha basana kadar her şeyi büyük harfle yazar."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "sol ok tuşu",
        was: ["yazı imlecini bir karakter sola taşır.", `${pfeilWort} tuşuyla birlikte bütün bir kelime atlar.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "sağ ok tuşu",
        was: ["yazı imlecini bir karakter sağa taşır.", `${pfeilWort} tuşuyla birlikte bütün bir kelime atlar.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "yukarı ok tuşu",
        was: ["yazı imlecini bir satır yukarı taşır.", "Listelerde ve menülerde bir üstteki öğeye geçer.", `${pfeilWort} tuşuyla birlikte bir paragraf yukarı atlar.`],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "aşağı ok tuşu",
        was: ["yazı imlecini bir satır aşağı taşır.", "Listelerde ve menülerde bir alttaki öğeye geçer.", `${pfeilWort} tuşuyla birlikte bir paragraf aşağı atlar.`],
      };
    case "pos1":
      return {
        kurz: "Home",
        name: "Home tuşu",
        was: ["satırın başına gider.", "Bir web sayfasında en üste gider.", "Ctrl tuşuyla birlikte bütün metnin başına gider.", ALMAN_KAPPE("Pos 1")],
      };
    case "ende":
      return {
        kurz: "End",
        name: "End tuşu",
        was: ["satırın sonuna gider.", "Bir web sayfasında en alta gider.", "Ctrl tuşuyla birlikte bütün metnin sonuna gider."],
      };
    case "bild-auf":
      return {
        kurz: "Page Up",
        name: "Page Up tuşu",
        was: ["bir ekran yukarı kaydırır."],
      };
    case "bild-ab":
      return {
        kurz: "Page Down",
        name: "Page Down tuşu",
        was: ["bir ekran aşağı kaydırır."],
      };
    case "einfg":
      return {
        kurz: "Insert",
        name: "Insert tuşu",
        was: [
          "NVDA ve JAWS ekran okuyucularının tuşudur.",
          "Ekran okuyucunun birçok komutu bu tuşla başlar.",
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "Ctrl tuşu",
        was: [
          "klavye kısayolları için kullanılır.",
          "Ctrl + C kopyalar, Ctrl + V yapıştırır, Ctrl + Z geri alır.",
          "Tek başına basınca okuma sesini hemen susturur.",
          ALMAN_KAPPE("Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "Alt tuşu",
        was: [
          "klavye kısayolları için kullanılır.",
          "Alt + Tab pencereler arasında geçiş yapar.",
          "Tastenflow içinde Alt + H yardımı açar.",
        ],
      };
    case "altgr":
      // Ohne Kurzform: „Alt Gr, Alt Gr tuşu" sagte dasselbe zweimal.
      return {
        kurz: null,
        name: "Alt Gr tuşu",
        was: turk
          ? [
              "tuşların üçüncü işaretini yazar.",
              "Örneğin et işaretini (@), avro işaretini (€) ve lira işaretini (₺).",
            ]
          : ["tuşların üçüncü işaretini yazar, örneğin et işaretini ya da avro işaretini."],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "Windows tuşu",
        was: [
          "Başlat menüsünü açar.",
          "Kapatmak için bir kez daha bas.",
          "Başka tuşlarla başka işler yapar, örneğin Win + D masaüstünü gösterir.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "Komut",
        name: "Komut tuşu",
        was: ["klavye kısayolları için kullanılır.", "Komut + C kopyalar, Komut + V yapıştırır, Komut + Z geri alır."],
      };
    case "wahltaste":
      return {
        kurz: "Option",
        name: "Option tuşu",
        was: turk
          ? [
              "tuşların üçüncü işaretini yazar, örneğin et işaretini (@) ya da lira işaretini (₺).",
              "Ok tuşlarıyla birlikte bütün bir kelime atlar.",
            ]
          : ["ek işaretler yazar, örneğin avro işaretini.", "Ok tuşlarıyla birlikte bütün bir kelime atlar."],
      };
    case "ctrl":
      return {
        kurz: "Kontrol",
        name: "Kontrol tuşu",
        was: ["Mac bilgisayarda klavye kısayolları için kullanılır.", "Tek başına basınca VoiceOver konuşmasını susturur."],
      };
    case "fn":
      return {
        kurz: "Fn",
        name: "Fn tuşu",
        was: ["başka tuşlara ikinci bir görev verir, örneğin ses düzeyini değiştirmek."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz,
 * wie sie auf der Kappe steht („Ctrl + Home", „Shift + Tab").
 */
export const TASTE_KURZ_TR: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Return",
  leertaste: "Boşluk",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "Sol ok",
  "pfeil-rechts": "Sağ ok",
  "pfeil-auf": "Yukarı ok",
  "pfeil-ab": "Aşağı ok",
  pos1: "Home",
  ende: "End",
  "bild-auf": "Page Up",
  "bild-ab": "Page Down",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "Alt Gr",
  "windows-taste": "Win",
  befehlstaste: "Komut",
  wahltaste: "Option",
  ctrl: "Kontrol",
  fn: "Fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_TR: Readonly<Record<string, readonly string[]>> = {
  F1: ["birçok programda yardımı açar."],
  F2: ["seçili dosyanın adını değiştirir."],
  F3: ["aramayı başlatır."],
  F4: ["Alt tuşuyla birlikte basınca pencereyi kapatır."],
  F5: ["web sayfasını yeniler.", "Burada bir şey olmaz, keşfetmeye devam edebilirsin."],
  F6: ["tarayıcının adres çubuğuna gider."],
  F7: ["Word programında yazım denetimi yapar."],
  F10: ["birçok programda menü çubuğuna gider."],
  F11: ["tarayıcıda tam ekranı açar ve kapatır.", "Dizüstü bilgisayarda çoğu zaman Fn tuşuyla birlikte."],
  F12: [`Word programında "Farklı Kaydet" penceresini açar.`],
};

/** Türkisch zu `nachKey` - F-Tasten, Num Lock, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyTr(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "tr-q",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? [
            "bazı programlarda kendi görevi vardır.",
            "Mac bilgisayarda bu tuşlar çoğu zaman parlaklığı ve ses düzeyini değiştirir.",
          ]
        : (F_TASTEN_WINDOWS_TR[key] ?? ["bazı programlarda kendi görevi vardır."]);
    return { kurz: key, name: "işlev tuşu", was };
  }
  switch (key) {
    case "Home":
      return sondertasteTr("pos1", "windows", layout);
    case "End":
      return sondertasteTr("ende", "windows", layout);
    case "PageUp":
      return sondertasteTr("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteTr("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteTr("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "Num Lock tuşu",
        was: ["numaratördeki rakamları açar ve kapatır."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "numaratördeki 5 tuşu",
        was: ["Num Lock açıkken 5 yazar.", "Şu an Num Lock kapalı, bu yüzden bir şey yapmaz."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "menü tuşu",
        was: ["bulunduğun yer için komutların olduğu bir menü açar.", "Shift + F10 da aynı işi yapar."],
      };
    case "PrintScreen":
      return { kurz: null, name: "Print Screen tuşu", was: ["ekranın resmini çeker.", "Windows bilgisayarlarda çoğu zaman bir ekran görüntüsü aracını açar.", "Esc ile kapanır."] };
    case "ScrollLock":
      return { kurz: null, name: "Scroll Lock tuşu", was: ["bugün neredeyse hiç kullanılmaz."] };
    case "Pause":
      return { kurz: null, name: "Pause tuşu", was: ["bugün neredeyse hiç kullanılmaz."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "ses açma tuşu", was: ["ses düzeyini artırır."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "ses kısma tuşu", was: ["ses düzeyini azaltır."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "sessiz tuşu", was: ["sesi kapatır ve yeniden açar."] };
    case "Fn":
      return sondertasteTr("fn", plattform, layout);
    case "Dead":
      // ★ `layouts.ts` TR_Q/TR_F: unter Windows ist Shift + 3 die Totaste ^ (â î û).
      return {
        kurz: null,
        name: "ölü tuş",
        was:
          (layout === "tr-q" || layout === "tr-f") && plattform !== "macos"
            ? [
                "bir sonraki harfe bir işaret ekler.",
                "Türk klavyelerinde şapka (^) böyle bir tuştur: önce ^, sonra a harfi. Böylece â çıkar.",
              ]
            : [
                "bir sonraki harfe bir işaret ekler, örneğin e harfinin üstüne bir aksan.",
                "İşaret ancak bir sonraki harfle birlikte görünür.",
              ],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

const SONRA_GORUNUR_TR = "İşaret ancak bir sonraki harfle birlikte görünür.";

/**
 * Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle.
 * Auf den türkischen Tastaturen ist ^ (Shift + 3) die Totaste des Lehrgangs
 * (â î û); die übrigen kommen auf Tastaturen anderer Länder vor.
 */
export const AKZENTE_TR: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "şapka",
    was: ["bir sonraki harfin üstüne şapka koyar, örneğin â.", SONRA_GORUNUR_TR],
  },
  akut: {
    name: "akut aksan",
    was: ["bir sonraki harfin üstüne sağa eğik bir çizgi koyar, örneğin é.", SONRA_GORUNUR_TR],
  },
  gravis: {
    name: "ters kesme",
    was: ["bir sonraki harfin üstüne sola eğik bir çizgi koyar, örneğin à.", SONRA_GORUNUR_TR],
  },
  trema: {
    name: "umlaut",
    was: ["bir sonraki harfin üstüne iki nokta koyar, örneğin ä.", SONRA_GORUNUR_TR],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMLAMA_TR = ["programlamada kullanılır."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`. Der Name kommt
 * aus `spokenLabel(ch, "tr")` (`SPOKEN_TR`, Glossar §2.8); `name` steht nur, wo
 * er anders heissen soll. Dazu die türkischen Buchstaben: wo man sie braucht,
 * und dass ohne Punkt, Çengel oder Şapka ein ANDERES Wort entsteht (Glossar
 * §4 Nr. 2) - gesagt, ohne zu werten. Keine Wortpaare, die ein vulgäres Wort
 * ergeben (Glossar §4 Nr. 2/5).
 */
export const ZEICHEN_TR: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["cümleyi bitirir."] },
  ",": { was: ["cümlenin parçalarını ayırır."] },
  "?": { was: ["soruyu bitirir."] },
  "!": { was: ["ünlem cümlesini bitirir."] },
  ":": { was: ["bir açıklama ya da sıralama başlatır."] },
  ";": { was: ["cümlenin iki parçasını virgülden daha güçlü ayırır."] },
  "-": { was: ["kelimeleri ya da sayıları birleştirir, örneğin 7-10 yaş.", "Hesapta çıkarma demektir."] },
  "@": { was: ["her e-posta adresinde vardır."] },
  "+": { was: ["hesapta toplama demektir.", `Klavye kısayolunda "birlikte bas" demektir.`] },
  "*": { was: ["bilgisayarda çarpma demektir."] },
  "/": { was: ["bilgisayarda bölme demektir.", "Web adreslerinde de vardır."] },
  "=": { was: ["bir hesabın sonucundan önce gelir."] },
  "'": { was: ["özel adlara gelen ekleri ayırır, örneğin Türkiye'de."] },
  '"': { was: ["birinin söylediği sözün başına ve sonuna gelir."] },
  "«": { was: ["başka ülkelerin metinlerinde söylenen sözü açar."] },
  "»": { was: ["başka ülkelerin metinlerinde söylenen sözü kapatır."] },
  "(": { was: ["bir ek açıklamayı açar."] },
  ")": { was: ["bir ek açıklamayı kapatır."] },
  "%": { was: ["yüzde demektir, örneğin %50."] },
  "&": { was: ["ve demektir."] },
  "#": { was: ["numara demektir, örneğin #1.", "Etiketlerde de kullanılır."] },
  "€": { was: ["avro işaretidir."] },
  "₺": { was: ["Türk lirasının işaretidir."] },
  $: { was: ["dolar işaretidir."] },
  "£": { was: ["sterlin işaretidir."] },
  "§": { was: ["bir sayıyla birlikte paragraf demektir, örneğin § 3."] },
  "°": { was: ["derece demektir, örneğin sıcaklıkta."] },
  "<": { was: ["iki sayıyı karşılaştırır: soldaki daha küçüktür."] },
  ">": { was: ["iki sayıyı karşılaştırır: soldaki daha büyüktür."] },
  _: { was: ["e-posta adreslerinde ve dosya adlarında sık geçer."] },
  "^": { was: ["hesapta üs demektir, örneğin 2 üssü 3."] },
  "½": { was: ["yarım demektir."] },
  "²": { was: ["alan için kullanılır, örneğin metrekare."] },
  "³": { was: ["hacim için kullanılır, örneğin metreküp."] },
  "[": { was: PROGRAMLAMA_TR },
  "]": { was: PROGRAMLAMA_TR },
  "{": { was: PROGRAMLAMA_TR },
  "}": { was: PROGRAMLAMA_TR },
  "\\": { was: PROGRAMLAMA_TR },
  "|": { was: PROGRAMLAMA_TR },
  "~": { was: PROGRAMLAMA_TR },
  "´": { was: ["ünlü harfin üstüne sağa eğik bir çizgi koyar."] },
  "`": { was: ["harfin üstüne sola eğik bir çizgi koyar."] },
  "¨": { was: ["harfin üstüne iki nokta koyar."] },
  é: { was: ["Türkçede pek kullanılmaz; bazı yabancı adlarda geçer."] },
  // ★★★ die türkischen Buchstaben (Glossar §2.1, §2.8, §4 Nr. 1/2).
  ı: { was: ["Türkçe bir harftir, örneğin ılık ve kapı kelimelerinde.", "Noktalı i ile başka bir kelime olur: kıl ve kil."] },
  i: { was: ["Türkçe bir harftir, örneğin iki ve bilgi kelimelerinde.", "Büyük harfi de noktalıdır: İ."] },
  ğ: { was: ["Türkçe bir harftir, örneğin dağ ve yağmur kelimelerinde.", "Hiçbir kelime bu harfle başlamaz."] },
  ş: { was: ["Türkçe bir harftir, örneğin şeker ve kuş kelimelerinde.", "Çengeli olmadan başka bir kelime olur: baş ve bas."] },
  ç: { was: ["Türkçe bir harftir, örneğin çiçek ve üç kelimelerinde.", "Çengeli olmadan başka bir kelime olur: çam ve cam."] },
  ö: { was: ["Türkçe bir harftir, örneğin göz ve köpek kelimelerinde.", "Noktaları olmadan başka bir kelime olur: ön ve on."] },
  ü: { was: ["Türkçe bir harftir, örneğin üzüm ve gül kelimelerinde.", "Noktaları olmadan başka bir kelime olur: üç ve uç."] },
  â: { was: ["bazı kelimelerde okunuşu gösterir, örneğin kâğıt ve hâlâ.", "Şapkası olmadan başka bir kelime olur: kâr ve kar."] },
  î: { was: ["bazı kelimelerde okunuşu gösterir, örneğin resmî."] },
  û: { was: ["bazı kelimelerde okunuşu gösterir."] },
};

/** Der türkische Name eines Zeichens - aus der Tabelle oder `spokenLabel`. */
export function zeichenNameTr(ch: string): string {
  return ZEICHEN_TR[ch]?.name ?? spokenLabel(ch, "tr");
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/**
 * Wo eine Wirkung gilt - türkisch. Die Endung hängt an ein festes Wort
 * („programında", „penceresinde"), nie an den Programmnamen (Regel 6).
 */
export const ORT_TR: Readonly<Record<string, string>> = {
  explorer: "Dosya Gezgini penceresinde",
  finder: "Finder programında",
  word: "Word programında",
  excel: "Excel programında",
  browser: "tarayıcıda",
  teams: "Teams programında",
  powerpoint: "PowerPoint programında",
  outlook: "Outlook programında",
  bedienungshilfen: "ekran okuyucuda",
};

/** Die kleine eigene Liste der deutschen Datei, türkisch. */
export const EIGENE_KOMBINATIONEN_TR: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "bir önceki öğeye döner." },
    { keys: "Strg+P", was: "yazdırma penceresini açar." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "bir önceki öğeye döner." },
    { keys: "Cmd+P", was: "yazdırma penceresini açar." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - türkisch, nach der Kennung der Wirkung im
 * Kürzel-Katalog von »Im Griff« (`lib/computer/kuerzelWirkung.ts`, dort nur
 * gelesen). Befehlsform wie in den Menüs von Windows und Office („Kopyala",
 * „Yapıştır", „Farklı kaydet"). ⚠️ Keine beginnt mit İ/I (`klein1`/`gross1`).
 */
export function wirkungTr(id: string, _plattform: Plattform): string | null {
  return WIRKUNG_TR[id] ?? null;
}

const WIRKUNG_TR: Readonly<Record<string, string>> = {
  kopieren: "Kopyala",
  einfuegen: "Yapıştır",
  ausschneiden: "Kes",
  rueckgaengig: "Geri al",
  wiederherstellen: "Yinele, yani geri alınanı geri getir",
  "alles-markieren": "Tümünü seç",
  "markieren-zeichen": "Karakter karakter seç",
  "markieren-wort": "Kelime kelime seç",
  "spalte-markieren": "Tüm sütunu seç",
  "zeile-markieren": "Tüm satırı seç",
  oeffnen: "Aç",
  umbenennen: "Yeniden adlandır",
  "neuer-ordner": "Yeni klasör oluştur",
  papierkorb: "Geri dönüşüm kutusuna taşı",
  duplizieren: "Aynı dosyanın ikinci bir kopyasını oluştur",
  "ebene-hoeher": "Bir üst klasöre git",
  adressleiste: "Adres çubuğuna git",
  eigenschaften: "Özellikleri göster",
  uebersicht: "Dosyayı açmadan önizlemesini göster",
  bewegen: "Dosyayı gitmesi gereken yere taşı (önceki yerinden kalkar)",
  "ansicht-details": `"Ayrıntılar" görünümüne geç`,
  speichern: "Kaydet",
  "speichern-unter": "Farklı kaydet: başka bir adla ya da başka bir yere",
  fett: "Kalın yap",
  kursiv: "Eğik yaz",
  unterstreichen: "Altını çiz",
  ueberschrift1: `"Başlık 1" stilini uygula`,
  ueberschrift2: `"Başlık 2" stilini uygula`,
  "standard-format": `"Normal" stilini uygula`,
  links: "Sola hizala",
  zentriert: "Ortala",
  zeilenumbruch: "Aynı paragrafta yeni satıra geç",
  rechtschreibung: "Yazım denetimi yap",
  fensterbereiche: "Pencerenin bölümleri arasında geç",
  suchen: "Bul",
  ersetzen: "Bul ve değiştir",
  "gehe-zu-zelle": "Seçilen hücreye git",
  "zelle-bearbeiten": "Hücrede yazmaya devam et",
  "zelle-formatieren": `"Hücreleri Biçimlendir" penceresini aç`,
  "zum-rand": "Verilerin kenarına git",
  autosumme: "Otomatik toplam ekle",
  "ausfuellen-unten": "Aşağı doldur",
  "ausfuellen-rechts": "Sağa doldur",
  "absoluter-bezug": "Başvuruyu sabitle (dolar işaretiyle mutlak başvuru)",
  datum: "Bugünün tarihini ekle",
  uhrzeit: "Şu anki saati ekle",
  kommentar: "Açıklama ekle",
  autofilter: "Otomatik filtreyi aç ya da kapat",
  blattwechsel: "Başka bir sayfaya geç",
  "neues-blatt": "Yeni sayfa ekle",
  "neu-laden": "Sayfayı yenile",
  lesezeichen: "Yer işareti ekle",
  verlauf: "Geçmişi aç",
  senden: "Mesajı gönder",
  "nachricht-loeschen": "Mesajı sil",
  "sr-stopp": "Okumayı durdur",
};

/** „a, b ve c" - die türkische Aufzählung (Glossar §2.10). */
export function aufzaehlungTr(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} ve ${teile[teile.length - 1]}`;
}

/**
 * Die festen Wörter des Erkundens, türkisch. `mit` steht vor dem Weg über den
 * dritten Layer - mit Doppelpunkt, damit kein Tastenname eine Endung braucht
 * („Tuşlar: Alt Gr + Q.").
 */
export const ERKUNDEN_WOERTER_TR = {
  kombination: "tuş birleşimi",
  kombiUnbekannt: "ne yaptığı programa bağlıdır.",
  mit: "Tuşlar:",
  akzentTaste: "ölü tuş",
  unbekannt: "Bu tuşu tanıyamıyorum.",
  taste: (key: string) => `${key} tuşu`,
} as const;

/* ══ „Tuşları Bul" ══════════════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) türkisch - WAS
 * geschieht, entscheidet weiter `suchSchritt`; hier wird nur gesagt.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Der Fall, in dem eine Taste im Satz steht. */
export type FallTr = "nom" | "akk" | "dat";

interface TasteTr {
  /** Als Subjekt oder nach „Bu," - „Tab tuşu", „boşluk çubuğu". */
  nom: string;
  /** Nach „… bul" - „Tab tuşunu". */
  akk: string;
  /** Nach „… bas" - „Tab tuşuna". */
  dat: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur Caps Lock). */
  achtung?: string;
}

/** Eine Taste mit ihrer Kappe - die Endung hängt an „tuş" (Regel 6). */
function tus(kappe: string, lage: string, achtung?: string): TasteTr {
  const e = { nom: `${kappe} tuşu`, akk: `${kappe} tuşunu`, dat: `${kappe} tuşuna`, lage };
  return achtung ? { ...e, achtung } : e;
}

const ALTI_TUS_TR = "Ok tuşlarının üstündeki altı tuşluk blokta";
const OKLAR_TR = "Sağ altta, ok tuşlarının arasında";
const DIZUSTU_FN_TR = "Dizüstü bilgisayarda çoğu zaman Fn tuşuyla birlikte.";

/** Die Tasten der Suchrunde, türkisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_TR: Readonly<Record<string, TasteTr | ((plattform: Plattform) => TasteTr)>> = {
  tabulator: tus("Tab", "Sol serçe parmak: bir sıra yukarıda, kenarda."),
  "pfeil-links": tus("sol ok", `${OKLAR_TR}: soldaki.`),
  "pfeil-rechts": tus("sağ ok", `${OKLAR_TR}: sağdaki.`),
  "pfeil-auf": tus("yukarı ok", `${OKLAR_TR}: üstteki.`),
  "pfeil-ab": tus("aşağı ok", `${OKLAR_TR}: yukarı ok tuşunun altındaki.`),
  pos1: tus("Home", `${ALTI_TUS_TR}, üstte ortada. ${DIZUSTU_FN_TR}`),
  ende: tus("End", `${ALTI_TUS_TR}, altta ortada. ${DIZUSTU_FN_TR}`),
  "bild-auf": tus("Page Up", `${ALTI_TUS_TR}, üstte sağda. ${DIZUSTU_FN_TR}`),
  "bild-ab": tus("Page Down", `${ALTI_TUS_TR}, altta sağda. ${DIZUSTU_FN_TR}`),
  leertaste: {
    nom: "boşluk çubuğu",
    akk: "boşluk çubuğunu",
    dat: "boşluk çubuğuna",
    lage: "Başparmaklarının altındaki uzun tuş.",
  },
  eingabe: tus("Enter", "Sağ el, kenarda: büyük tuş."),
  zeilenschalter: tus("Return", "Sağ el, kenarda: büyük tuş."),
  loeschtaste: (plattform) =>
    tus(plattform === "macos" ? "Delete" : "Backspace", "Sağ el, kenarda, iki sıra yukarıda."),
  entf: (plattform) =>
    plattform === "macos"
      ? tus("İleri Sil", "Sadece büyük klavyelerde, Return tuşunun yanında. Yoksa Fn ve Delete tuşları.")
      : tus("Delete", `${ALTI_TUS_TR}, altta solda. Dizüstü bilgisayarda sağ üstte.`),
  esc: tus("Esc", "Sol üst köşede."),
  umschalt: tus("Shift", "İki tane var: harflerin en alt sırasında, solda ve sağda."),
  feststell: tus(
    "Caps Lock",
    "Sol serçe parmak: bir adım sola.",
    "Şimdi hep büyük harf mi çıkıyor? O zaman Caps Lock tuşuna bir kez daha bas.",
  ),
  strg: tus("Ctrl", "Sol alt köşede."),
  alt: tus("Alt", "Altta, boşluk çubuğunun solunda."),
  altgr: tus("Alt Gr", "Altta, boşluk çubuğunun sağında."),
  "windows-taste": tus("Windows", "Altta solda, Ctrl ile Alt tuşlarının arasında."),
  einfg: tus("Insert", `${ALTI_TUS_TR}, üstte solda, Delete tuşunun üstünde. Dizüstü bilgisayarlarda çoğu zaman yoktur.`),
  befehlstaste: tus("Komut", "Altta solda, boşluk çubuğunun hemen yanında."),
  wahltaste: tus("Option", "Altta solda, kenardan üçüncü tuş."),
  ctrl: tus("Kontrol", "Altta solda, kenardan ikinci tuş."),
  fn: tus("Fn", `Altta solda, köşedeki ilk tuş. MacBook klavyesinde üzerinde "fn" yazar.`),
};

function tasteTr(t: TastenName, plattform: Plattform): TasteTr {
  const e = TASTEN_TR[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne türkischen Eintrag -
  // „tuş" dahinter, damit der Name in keinem Fall eine Endung braucht.
  return e ?? tus(t.kurz ?? t.name, "");
}

/**
 * „Tab tuşunu", „boşluk çubuğuna" - wie eine Taste im Satz heisst. Vorgabe
 * Akkusativ (vor „bul"); „dat" vor „bas", „nom" nach „Bu,".
 */
export function tastenNennungTr(t: TastenName, plattform: Plattform, fall: FallTr = "akk"): string {
  return tasteTr(t, plattform)[fall];
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLageTr(t: TastenName, plattform: Plattform): string {
  return tasteTr(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Tab tuşunu bul. Sol serçe parmak: …" */
export function ansageSuchauftragTr(t: TastenName, plattform: Plattform): string {
  const e = tasteTr(t, plattform);
  const kopf = `${grossAnfangTr(e.akk)} bul.`;
  return e.lage ? `${kopf} ${e.lage}` : kopf;
}

/** Erster Treffer - erst die Wiederholung zählt (Glossar §2.11: „Buldun!"). */
export function ansageGefundenTr(t: TastenName, plattform: Plattform): string {
  return `Buldun! Başka bir tuşa bas, sonra ${tastenNennungTr(t, plattform, "dat")} bir kez daha bas.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Caps Lock). */
export function ansageBestaetigtTr(t: TastenName, plattform: Plattform): string {
  const e = tasteTr(t, plattform);
  return e.achtung ? `Doğru! ${e.achtung}` : "Doğru!";
}

/** Eine Taste, die hier nicht unterrichtet wird. */
export const ANSAGE_UNBEKANNT_TR = "Bu tuş burada çalışılmıyor.";

/** „Tüm tuşları buldun: 20 tuş." - die Zahl ohne Endung (Glossar Regel 6). */
export function alleGefundenTr(anzahl: number): string {
  return `Tüm tuşları buldun: ${anzahl} tuş. Çok iyi.`;
}

/**
 * Der Satz zu einem Schritt der Suchrunde - türkisch. `art` und `naechste`
 * kommen unverändert aus `suchSchritt`; nur die Wörter sind neu.
 */
export function suchSatzTr(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteTr(gesucht, plattform);
      const finde = `${grossAnfangTr(g.akk)} bul.`;
      if (!taste) return `${ANSAGE_UNBEKANNT_TR} ${finde}`;
      return `Bu, ${tastenNennungTr(taste, plattform, "nom")}. ${finde}${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenTr(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtTr(gesucht, plattform)} ${alleGefundenTr(suchbar.length)}`;
    case "weiter":
      return `${ansageBestaetigtTr(gesucht, plattform)} ${ansageSuchauftragTr(suchbar[index + 1]!, plattform)}`;
  }
}
