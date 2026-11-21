/**
 * ★★★ DIE LEKTIONEN DES WEGES „tr" (TR-S, 09.10.2026).
 *
 * Vorbild: `curriculumIt.ts` (Bauart, Griffe aus den Daten, je Tastatur gebaut). Neu auf Türkisch geschrieben, nichts
 * übersetzt (Johannes: *„keine texte werden übersetzt, Texte aus den regionen, altersgemäß und zeitgemäß"*). Kinder und
 * Selbstlernende werden geduzt (Glossar `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md` §1 Regel 1: „sen", kurze
 * Befehlsform); Begriffe aus dem Glossar §2.1 und §2.9 (temel sıra, temel konum, serçe parmak, yüzük parmağı, orta
 * parmak, işaret parmağı, başparmak, boşluk çubuğu, Shift, Alt Gr, ölü tuş, noktalı i, noktasız ı); Tastenwege statt
 * Maus („bas", nie „tıkla"); Beispielwörter in geraden Anführungszeichen (Regel 7).
 *
 * ── DIE REGEL, AN DER ALLES HÄNGT (wie `curriculumIt.ts`) ───────────────────────────────────────
 * Jede Lektion führt NUR Tasten ein, die in der Reihenfolge des Weges (`lernweg.ts#TR_LETTER_ORDER`, Befund F4-tr) bis
 * dahin dran sind: Die Tasten aller Lektionen hintereinander SIND `introOrder("tr")`. Wächter:
 * `tests/tastenflow-lektionen-tr.test.ts`.
 *
 * ── DIE FALLE DES TÜRKISCHEN ─────────────────────────────────────────────────────────────────────
 * i und ı sind ZWEI Buchstaben auf ZWEI Tasten (Glossar §4 Nr. 1). Nie `toUpperCase()`: die Kappe der i-Taste heisst `İ`,
 * die der ı-Taste `I` - gerechnet wird über `grossFuer/kleinFuer(…, "tr")`. Wo ein Kind sie verwechseln könnte, steht der
 * Zusatz: „noktalı i (İ)", „noktasız ı (I)".
 * Endungen stehen nur an FESTEN Wörtern (`tuşu`, `tuşuna`), nie an einem Platzhalter (Regel 6): die Tastennamen sind
 * Konstanten der Tastatur und bekommen ihre Endung am Wort „tuş".
 *
 * ── JE TASTATUR EINE EIGENE LISTE ────────────────────────────────────────────────────────────────
 * Hauptweg ist `tr-q` (Windows „Türkçe Q" und Mac „Turkish - QWERTY - PC"). Die Lektionen werden wie bei „it" mit
 * der eingestellten Tastatur gerechnet (`tr-f` und jede andere), die IDs bleiben gleich (der Fortschritt hängt an der ID).
 * Die Griffe - Finger, Lage zur Grundstellung, Shift/Alt Gr - kommen aus den Daten der Tastatur (`layouts.ts`),
 * nicht aus dem Kopf. Ein Griff, den die Tastatur nicht kennt, wird nicht geraten.
 *
 * ⚠️ Grosse Akzentbuchstaben gibt es auf `tr-q` nicht als Problem (alle sechs türkischen Buchstaben haben Grossformen
 * mit Shift); die Schlusslektion sagt, wie die Tastatur â î û liefert (Totaste `^`, Umschalt + 3).
 */
import type { Lesson, LessonKind } from "./curriculum";
import { SHIFT_UNIT, achteGrundtasteFuerLayout } from "./letters";
import { lernwegDef } from "./lernweg";
import { layoutById, layoutIndex, type KeyboardLayout, type LayoutId } from "./layouts";
import { FINGERS, fingerName, type FingerId } from "./fingers";
// ★ G2b-1: Gross-/Klein ausdrücklich in der Sprache dieser Lektionen ("tr") - i/İ und ı/I sind zwei Paare.
import { grossFuer, kleinFuer } from "./sprachRegister";

interface TrLektionsBauplan {
  id: string;
  kind: LessonKind;
  /** Die neuen Einheiten in der Folge der Bezugstastatur `tr-q`, genau in der Reihenfolge des Weges. */
  einheiten: readonly string[];
  enablesShift?: boolean;
  corpusKinds?: Lesson["corpusKinds"];
  /** Der Titel aus den Tasten, die auf DIESER Tastatur ankommen. */
  titel: (tasten: readonly string[], layout: KeyboardLayout) => string;
  /** Der geschriebene erste Absatz - aus den Tasten, die auf DIESER Tastatur ankommen. */
  vorspann: (tasten: readonly string[]) => string;
  /** Statt der gerechneten Griffe ein eigener Teil (Shift, Ziffern, Schluss). */
  griffe?: (tasten: readonly string[], layout: KeyboardLayout) => string;
}

// ── Tastennamen ───────────────────────────────────────────────────────────────

/** Die Umschalttaste heisst auf Windows und Mac „Shift"; die dritte Ebene unter Windows „Alt Gr", am Mac „Option" (Glossar §2.9). */
const SHIFT = "Shift";
const DRITTE_EBENE = "Alt Gr (Mac'te: Option)";

/** Der Buchstabe wie auf der Kappe: `i` ⇒ `İ`, `ı` ⇒ `I`, `ş` ⇒ `Ş` - nur über das Gebietsschema `tr`. */
function kappe(k: string): string {
  return /^\p{L}$/u.test(k) ? grossFuer(k, "tr") : k;
}

/** i und ı tragen IMMER ihren Zusatz (Glossar §4 Nr. 1); alle anderen Buchstaben die Kappe. */
function tasteName(k: string): string {
  if (k === "i") return "noktalı i (İ)";
  if (k === "ı") return "noktasız ı (I)";
  return kappe(k);
}

/** Satz- und Sonderzeichen haben im Satz einen NAMEN vor dem Zeichen (Glossar §2.8, `SPOKEN_TR`). */
const ZEICHEN_NAMEN_TR: Readonly<Record<string, string>> = {
  ".": "nokta", ",": "virgül", ";": "noktalı virgül", ":": "iki nokta",
  "?": "soru işareti", "!": "ünlem işareti", "'": "kesme işareti", '"': "tırnak işareti",
  "-": "kısa çizgi", "(": "parantez aç", ")": "parantez kapat",
  "[": "köşeli parantez aç", "]": "köşeli parantez kapat",
  "{": "süslü parantez aç", "}": "süslü parantez kapat",
  "%": "yüzde işareti", "&": "ve işareti", "/": "eğik çizgi", "+": "artı", "*": "yıldız",
  "=": "eşittir", _: "alt çizgi", "<": "küçüktür", ">": "büyüktür", $: "dolar", "|": "dikey çizgi",
  "\\": "ters eğik çizgi", "€": "avro", "₺": "Türk lirası", "½": "yarım", "@": "et işareti", "#": "diyez",
  "^": "şapka",
};

/** Das Zeichen im Satz: in geraden Anführungszeichen, das Anführungszeichen selbst in Klammern. */
function zeichenZeigen(u: string): string {
  return u === '"' ? `(")` : `"${u}"`;
}

/** Der Anfang eines Griff-Satzes: „A tuşu", „Noktalı i (İ) tuşu", „Nokta ".“". */
function satzAnfang(u: string): string {
  if (/^[\p{L}\p{Nd}]$/u.test(u)) {
    const n = tasteName(u);
    // „Noktalı i (İ) tuşu" am Satzanfang gross - türkisch (n ⇒ N), nie `toUpperCase()` ohne Sprache.
    return `${grossFuer(n.charAt(0), "tr")}${n.slice(1)} tuşu`;
  }
  const name = ZEICHEN_NAMEN_TR[u];
  if (!name) return `${zeichenZeigen(u)} tuşu`;
  return `${grossFuer(name.charAt(0), "tr")}${name.slice(1)} ${zeichenZeigen(u)}`;
}

/** Eine Taste im Dativ („... tuşuna bas"): Buchstaben und Ziffern für sich, Zeichen gezeigt. Die Endung hängt an „tuş". */
function tusDativ(k: string): string {
  return /^[\p{L}\p{Nd}]$/u.test(k) ? `${tasteName(k)} tuşuna` : `${zeichenZeigen(k)} tuşuna`;
}

/** „F ve J", „Z, Ç ve H", „Ü ve V" (türkisch: das letzte Glied mit „ve"). */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} ve ${teile[teile.length - 1]}`;
}

function kappen(tasten: readonly string[]): string {
  return aufzaehlen(tasten.map(kappe));
}

// ── Die Folge des Weges auf einer Tastatur ───────────────────────────────────

/** Die Reihenfolge des Weges „tr" auf dieser Tastatur (wie `introOrder`, aber für ein beliebiges Layout). */
function reihenfolgeAuf(layout: KeyboardLayout): string[] {
  const fehlt = layoutIndex(layout).missing;
  const vorhanden = lernwegDef("tr").introOrder.filter((u) => !fehlt.has(kleinFuer(u, "tr")));
  return achteGrundtasteFuerLayout(vorhanden, "tr", layout.id);
}

// ── Griffe aus den Daten der Tastatur ────────────────────────────────────────

const SIRALAR = ["sayı sırasında", "üst sırada", "temel sırada", "alt sırada"];

function platz(layout: KeyboardLayout, taste: string): { reihe: number; spalte: number } | null {
  for (let r = 0; r < layout.rows.length; r++) {
    const s = layout.rows[r].keys.indexOf(taste);
    if (s >= 0) return { reihe: r, spalte: s };
  }
  return null;
}

/**
 * Finger → seine Taste in der Grundstellung auf DIESER Tastatur: die Heimtasten, die die Tastatur selbst festlegt
 * (`KeyboardLayout.heimtasten`, F3-tr), sonst die des Weges; nur solche der Grundreihe.
 */
function heimTasten(layout: KeyboardLayout): ReadonlyMap<FingerId, string> {
  const m = new Map<FingerId, string>();
  const eigene = layout.heimtasten ?? [...lernwegDef("tr").homeKeys];
  for (const k of eigene) {
    const f = layoutIndex(layout).finger.get(k);
    const p = platz(layout, k);
    if (f && p && p.reihe === 2) m.set(f, k);
  }
  return m;
}

/** Die Spalte in der Zählung der Grundreihe (Ziffernreihe und die untere Reihe mit 11 Tasten beginnen eine Taste weiter links). */
function grundreihenSpalte(layout: KeyboardLayout, reihe: number, spalte: number): number {
  if (reihe === 0) return spalte - 1;
  if (reihe === 3 && layout.rows[3].keys.length === 11) return spalte - 1;
  return spalte;
}

/** „sol işaret parmağı, F tuşunun hemen üstünde" - Finger und Lage einer Taste (die Endung hängt an „tuş"). */
function lage(layout: KeyboardLayout, taste: string): string | null {
  const p = platz(layout, taste);
  const fingerId = layoutIndex(layout).finger.get(taste);
  if (!p || !fingerId || fingerId === "daumen") return null;
  const finger = fingerName(FINGERS[fingerId], "tr");
  const h = heimTasten(layout).get(fingerId);
  const hp = h ? platz(layout, h) : null;
  if (!h || !hp) return `${finger}, ${SIRALAR[p.reihe]}`;
  const H = tasteName(h);
  const s = grundreihenSpalte(layout, p.reihe, p.spalte);
  const abstand = Math.abs(s - hp.spalte);
  const richtung = s < hp.spalte ? "solunda" : "sağında";
  const weit = abstand >= 3 ? "üç tuş " : abstand === 2 ? "iki tuş " : "";
  if (p.reihe === 2) return taste === h ? `${finger}, temel konumda` : `${finger}, ${H} tuşunun ${weit}${richtung}`;
  const vorne = p.reihe === 0 ? "sayı sırasında, " : "";
  if (abstand === 0) return `${finger}, ${vorne}${H} tuşunun hemen ${p.reihe === 3 ? "altında" : "üstünde"}`;
  // In der Ziffernreihe sagt die Reihe schon „oben".
  if (vorne) return `${finger}, ${vorne}${H} tuşunun ${weit}${richtung}`;
  return `${finger}, ${p.reihe === 3 ? "alt sırada" : "üst sırada"}, ${H} tuşunun ${weit}${richtung}`;
}

/** Ein Satz: wie wird diese Einheit auf dieser Tastatur getippt? */
function griffSatz(layout: KeyboardLayout, u: string): string {
  const zugang = layout.access[u];
  const anfang = satzAnfang(u);
  if (zugang?.dead) {
    const wo = lage(layout, zugang.base);
    const oelue =
      "Bu bir ölü tuştur: tek başına bir şey yazmaz, ardından bastığın ünlünün üstüne kendi işaretini koyar.";
    if (zugang.base === u && !zugang.mod) return `${anfang}: ${wo ?? "kendi tuşu"}. ${oelue}`;
    const mod =
      zugang.mod === "shift"
        ? `karşı elindeki ${SHIFT} tuşunu basılı tut ve `
        : zugang.mod === "altgr"
          ? `${DRITTE_EBENE} tuşunu basılı tut ve `
          : "";
    return `${anfang}: ${mod}${tusDativ(zugang.base)} bas${wo ? ` (${wo})` : ""}. ${oelue}`;
  }
  if (zugang?.mod) {
    const wo = lage(layout, zugang.base);
    const mod = zugang.mod === "shift" ? `karşı elindeki ${SHIFT} tuşunu` : `${DRITTE_EBENE} tuşunu`;
    return `${anfang}: ${mod} basılı tut ve ${tusDativ(zugang.base)} bas${wo ? ` (${wo})` : ""}.`;
  }
  const wo = lage(layout, u);
  if (wo) return `${anfang}: ${wo}.`;
  // Nicht geraten: Die Daten dieser Tastatur zeigen keinen Griff.
  return `${anfang}: bu klavyedeki yeri burada henüz anlatılmıyor.`;
}

function griffeGerechnet(tasten: readonly string[], layout: KeyboardLayout): string {
  return tasten.map((u) => griffSatz(layout, u)).join(" ");
}

// ── Die Sonderteile ──────────────────────────────────────────────────────────

function shiftTeil(): string {
  return (
    `Büyük harf için karşı elinle ${SHIFT} tuşuna bas: sol yarıdaki bir harf sağ ${SHIFT} tuşunu, sağ yarıdaki bir harf ` +
    `sol ${SHIFT} tuşunu ister. Bunu iki serçe parmak yapar. Önemli olan yalnızca karşı eldeki ${SHIFT} tuşudur.`
  );
}

function sayilarTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const rakamlar = "1234567890".split("");
  if (rakamlar.every((z) => layout.access[z]?.mod === "shift")) {
    const cift = rakamlar.map((z) => `${z} = ${SHIFT} + ${layout.access[z].base}`).join(", ");
    return (
      `Klavyende sayılar sayı sırasındadır ama ${SHIFT} tuşuyla birlikte yazılır: ${SHIFT} olmadan o tuşlar başka ` +
      `işaretler yazar. ${cift}. Her parmak kendi sütununda kalır.`
    );
  }
  const bir = lage(layout, "1");
  return (
    `Klavyende sayılar ${SHIFT} tuşu olmadan yazılır. Her parmak kendi sütununda sayı sırasına uzanır: sol elle 1 2 3 4 5, ` +
    `sağ elle 6 7 8 9 0${bir ? ` (1: ${bir})` : ""}.`
  );
}

/**
 * Die Schlusslektion: was DIESE Tastatur kann (Bauplan; Glossar §2.1): auf `tr-q` hat jeder türkische Buchstabe seine Taste,
 * `â î û` kommen über die Totaste `^`. Eine andere Tastatur: nur die Regel für i und ı.
 */
function schlussTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const regel =
    "Büyük harf yazarken dikkat: noktalı i büyüyünce İ, noktasız ı büyüyünce I olur.";
  if (layout.id === "tr-q") {
    return (
      "Türkçe Q klavyede ç, ğ, ı, ö, ş ve ü kendi tuşlarındadır. Şapkalı harfler â, î ve û için önce " +
      `${SHIFT} + 3 ile ölü tuş ^ tuşuna, sonra ünlüye bas. ${regel}`
    );
  }
  return regel;
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const TEMEL = (t: readonly string[]) => `Temel sıra: ${kappen(t)}`;
const SIK = (t: readonly string[]) => `Sık kullanılan harfler: ${kappen(t)}`;
const fisso = (testo: string) => () => testo;

const BAUPLAENE: readonly TrLektionsBauplan[] = [
  {
    id: "tr-temel-1", kind: "home", einheiten: ["f", "j"], titel: TEMEL,
    vorspann: fisso(
      "Parmaklarını temel sıraya yerleştir: buna temel konum denir. F ve J tuşlarındaki küçük çıkıntılar, klavyeye " +
        "bakmadan temel konumu bulmana yardım eder. İki işaret parmağınla bu iki tuştan başla. Her parmak buradan " +
        "yola çıkar ve her tuştan sonra buraya döner.",
    ),
  },
  {
    id: "tr-temel-2", kind: "home", einheiten: ["d", "k"], titel: TEMEL,
    vorspann: fisso("Orta parmaklar işaret parmaklarına katılır: solda D, sağda K. İşaret parmakların yerinde kalır."),
  },
  {
    id: "tr-temel-3", kind: "home", einheiten: ["s", "l"], titel: TEMEL,
    vorspann: fisso("Sıra yüzük parmaklarında: solda S, sağda L. Parmakların rahat ve hafif dursun."),
  },
  {
    id: "tr-temel-4", kind: "home", einheiten: ["a", "ş"],
    titel: (t) => `Temel sıra tamam: ${kappen(t)}`,
    vorspann: fisso(
      "Sol serçe parmak A tuşuna, sağ serçe parmak Ş tuşuna yerleşir. Temel sıra tamam: sekiz parmak sekiz tuşta, iki " +
        'başparmak da boşluk çubuğunda. İlk kelimeler geliyor: "ada", "dal", "kafa", "kasa", "sakal", "şal", "şaka" ve "şafak".',
    ),
  },
  {
    id: "tr-sik-1", kind: "letters", einheiten: ["e", "i"], titel: SIK,
    vorspann: fisso(
      "E ve noktalı i (İ) Türkçede en sık kullanılan harflerdendir. Onlarla kısa kelimeler çoğalır: \"el\", \"ses\", \"sel\", " +
        '"kedi", "fil", "dil", "eski", "sade", "lale", "dikiş", "şişe" ve "dilek". Dikkat: noktalı i ile noktasız ı iki ayrı ' +
        "harftir; noktasız ı biraz sonra gelecek.",
    ),
  },
  {
    id: "tr-sik-2", kind: "letters", einheiten: ["n", "m"], titel: SIK,
    vorspann: fisso(
      'N ve M ile "ana", "nane", "inek", "elma", "masal", "damla", "kemik", "ekmek", "nem" ve "mide" yazarsın.',
    ),
  },
  {
    id: "tr-sik-3", kind: "letters", einheiten: ["b", "r"], titel: SIK,
    vorspann: fisso(
      'B ve R ile "baba", "bal", "bebek", "bina", "kabak", "kar", "dere", "şeker", "kare" ve "bere" geliyor.',
    ),
  },
  {
    id: "tr-sik-4", kind: "letters", einheiten: ["ı", "t"],
    titel: () => "Noktasız ı ve T",
    vorspann: fisso(
      'Noktasız ı (I) ile noktalı i (İ) iki ayrı harftir ve klavyede iki ayrı tuştadır: "ılık" ile "ilik" iki ayrı ' +
        'kelimedir. T ile de "tane", "tatlı", "tren", "saat", "kış", "sıra", "ışık" ve "balık" yazarsın.',
    ),
  },
  {
    id: "tr-sik-5", kind: "letters", einheiten: ["y", "o", "u"], titel: SIK,
    vorspann: fisso(
      'Y, O ve U ile çok sayıda kelime açılır: "yol", "oda", "okul", "uyku", "kuş", "su", "yemek", "yatak", "balon", ' +
        '"orman", "bulut" ve "kayık".',
    ),
  },
  {
    id: "tr-buyuk", kind: "shift", einheiten: [], enablesShift: true,
    titel: () => `Büyük harfler ve ${SHIFT} tuşu`,
    vorspann: fisso(
      "Şimdiye kadar büyük harfleri Tastenflow senin yerine yazıyordu. Bundan sonra onları kendi elin yazacak: " +
        '"Ali", "Ayşe", "Elif", "Emre", "Ankara", "Adana", "Bursa", "Konya", "Mersin" ve "Tokat". Noktalı i büyüyünce ' +
        'İ, noktasız ı büyüyünce I olur: "İlker" ve "Işıl".',
    ),
    griffe: shiftTeil,
  },
  // ★ D-1 (Didaktik-Synthese 28.09.2026, gilt für jeden Weg): Punkt und Komma direkt nach Shift.
  {
    id: "tr-nokta-virgul", kind: "punctuation", einheiten: [".", ","],
    titel: () => "Nokta ve virgül: . ,",
    vorspann: fisso(
      "Bir cümle büyük harfle başlar, noktayla biter. Virgül cümleyi parçalara ayırır. Noktadan ve virgülden sonra bir " +
        "boşluk gelir.",
    ),
  },
  {
    id: "tr-zch", kind: "letters", einheiten: ["z", "ç", "h"],
    titel: (t) => `Yeni harfler: ${kappen(t)}`,
    vorspann: fisso(
      'Z, Ç ve H ile yeni kelimeler geliyor: "yaz", "buz", "zil", "uzak", "deniz", "çay", "çam", "saç", "uçak", ' +
        '"hasta", "sabah" ve "halı".',
    ),
  },
  {
    id: "tr-gg", kind: "letters", einheiten: ["g", "ğ"],
    titel: (t) => `Yumuşak g: ${kappen(t)}`,
    vorspann: fisso(
      "Ğ harfinin adı yumuşak ge. Hiçbir kelime ğ ile başlamaz, ama kelimenin ortasında ve sonunda çok sık " +
        'görünür: "dağ", "ağaç", "yağ", "doğa", "bağ" ve "sağ". G ile de "gemi", "gezi", "gol", "dergi" ve "genç" yazarsın.',
    ),
  },
  {
    id: "tr-uv", kind: "letters", einheiten: ["ü", "v"],
    titel: (t) => `Yeni harfler: ${kappen(t)}`,
    vorspann: fisso(
      'Ü ve V ile "gül", "süt", "gün", "üzüm", "güneş", "dünya", "küçük", "ev", "vadi", "kavun", "kahve" ve "deve" ' +
        "yazarsın.",
    ),
  },
  {
    id: "tr-pco", kind: "letters", einheiten: ["p", "c", "ö"],
    titel: (t) => `Kalan harfler: ${kappen(t)}`,
    vorspann: fisso(
      'P, C ve Ö ile "kapı", "kitap", "tepe", "pamuk", "cam", "gece", "ceviz", "bacak", "göz", "göl", "köpek" ve ' +
        '"öykü" geliyor.',
    ),
  },
  {
    id: "tr-kesme", kind: "letters", einheiten: ["'"],
    titel: () => "Kesme işareti: '",
    vorspann: fisso(
      "Kesme işareti, özel isimleri sonlarına gelen eklerden ayırır: \"Ankara'da\", \"Konya'dan\", \"Bursa'ya\", \"Ali'nin\", " +
        '"Ayşe\'ye" ve "İzmir\'de".',
    ),
  },
  {
    id: "tr-sapka", kind: "letters", einheiten: ["^"],
    titel: () => "Şapka işareti: ^",
    vorspann: fisso(
      'Şapka, bazı kelimelerde ünlüyü uzatır ya da ince okutur: "kâğıt", "hâlâ", "dükkân" ve "rüzgâr". Şapkalı ' +
        "harfler â, î ve û kendi tuşlarında değildir; ölü tuşla yazılırlar.",
    ),
  },
  {
    id: "tr-wxq", kind: "letters", einheiten: ["w", "x", "q"],
    titel: (t) => `Başka dillerden gelen harfler: ${kappen(t)}`,
    vorspann: fisso(
      'W, X ve Q Türk alfabesinde yoktur; yalnızca başka dillerden gelen kelimelerde ve özel adlarda görünür: "web", ' +
        '"wifi", "expo" ve "quiz". Böylece klavyenin bütün harfleri tamam.',
    ),
  },
  {
    id: "tr-soru", kind: "punctuation", einheiten: ["?", "!"],
    titel: () => "Soru ve ünlem: ? !",
    vorspann: fisso(
      'Soru işareti bir sorunun sonuna, ünlem işareti coşkulu bir cümlenin sonuna gelir: "Nasılsın?", "Neredesin?", ' +
        '"Ne güzel!", "Harika!". Bu işaretlerden önce boşluk bırakılmaz.',
    ),
  },
  {
    id: "tr-noktalama", kind: "punctuation", einheiten: ['"', ":", ";", "-", "(", ")"],
    titel: (t) => `Diğer işaretler: ${t.join(" ")}`,
    vorspann: fisso(
      "Tırnak işareti birinin söylediği sözleri, iki nokta ve noktalı virgül sıralamaları ve açıklamaları gösterir. " +
        'Kısa çizgi iki kelimeyi bağlar, "Bursa-Ankara" gibi. Parantez de ek bir bilgiyi ayırır.',
    ),
  },
  {
    id: "tr-sayilar", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Sayı sırası",
    vorspann: fisso(
      "Tarihler, saatler, fiyatlar ve sonuçlar: şimdi sayılar geliyor. Türkçede binler noktayla, ondalıklar virgülle " +
        "ayrılır: 1.250 ve 2,50. Yüzde işareti sayıdan önce yazılır: %95.",
    ),
    griffe: sayilarTeil,
  },
  {
    id: "tr-simge-1", kind: "symbols", einheiten: ["%", "&", "/", "+", "*", "=", "_", ">", "<", "$"],
    titel: (t) => `Simgeler: ${t.join(" ")}`,
    vorspann: fisso(
      "Bu simgeler hesaplamalarda, yüzdelerde ve bilgisayarda kullanılır. Acele etme: burada hızdan çok doğruluk önemli.",
    ),
  },
  {
    id: "tr-simge-2", kind: "symbols", einheiten: ["@", "#", "[", "]", "{", "}", "\\", "|", "€", "₺", "½"],
    titel: (t) => `Başka simgeler: ${t.join(" ")}`,
    vorspann: fisso(
      "E-posta adreslerinin, fiyatların ve kodun simgeleri. Klavyenin en zor tuşları bunlar, bu yüzden en sona kaldılar. " +
        "Hepsi Alt Gr tuşuyla yazılır; Mac'te bu tuşa Option denir. Fiyatlarda Türk lirası ve avro simgesi sayıdan önce " +
        "yazılır: ₺150 ve €5.",
    ),
  },
  {
    id: "tr-metin", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Bütün klavye ve metinler",
    vorspann: fisso(
      "Artık bütün klavye senin: tam cümleler ve metinler yazıyorsun. Edirne'den Kars'a, Karadeniz'den Akdeniz'e; okul, spor, " +
        "hayvanlar ve gündelik hayat üzerine öyküler.",
    ),
    griffe: schlussTeil,
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const TR_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/**
 * Der GESCHRIEBENE erste Absatz einer Lektion, wie er auf einer Tastatur mit DIESEN Tasten der
 * Lektion erscheint - für den Beispielwort-Wächter je Tastatur.
 */
export function trLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return BAUPLAENE.find((b) => b.id === id)?.vorspann(tasten) ?? "";
}

/**
 * Die Tasten jeder Lektion auf dieser Tastatur: die Folge der Tastatur durchgehen (wie `curriculumIt.ts#tastenJeLektion`) -
 *  · eine Einheit kommt in ihre geplante Lektion;
 *  · ist deren Lektion schon VORBEI, in die laufende;
 *  · kommt sie FRÜHER als geplant, ebenso;
 *  · kennt der Plan sie gar nicht, ebenso.
 * „⇧" ist der feste Anker seiner Lektion.
 */
function tastenJeLektion(layout: KeyboardLayout): Map<string, string[]> {
  const reihenfolge = reihenfolgeAuf(layout);
  const geplant = new Map<string, number>();
  BAUPLAENE.forEach((b, i) => {
    for (const u of b.einheiten) geplant.set(u, i);
    if (b.enablesShift) geplant.set(SHIFT_UNIT, i);
  });
  const neu = new Map<string, string[]>(BAUPLAENE.map((b) => [b.id, []]));
  let jetzt = 0;
  /** Die geplante Lektion der nächsten Einheit, die REGULÄR kommt - Nachzügler und Einheiten ohne Plan zählen dafür nicht. */
  const naechsteRegulaer = (k: number): number => {
    for (let j = k + 1; j < reihenfolge.length; j++) {
      const q = geplant.get(reihenfolge[j]);
      if (q !== undefined && q >= jetzt) return q;
    }
    return Infinity;
  };
  reihenfolge.forEach((u, k) => {
    const p = geplant.get(u);
    const naechste = naechsteRegulaer(k);
    let l: number;
    if (p === undefined) l = jetzt;
    else if (p < jetzt) l = jetzt;
    else if (u !== SHIFT_UNIT && p > jetzt && naechste < p) l = jetzt;
    else l = p;
    jetzt = l;
    if (u !== SHIFT_UNIT) neu.get(BAUPLAENE[l].id)!.push(u);
  });
  return neu;
}

function baueLektionen(layout: KeyboardLayout): Lesson[] {
  const tastenJe = tastenJeLektion(layout);
  return BAUPLAENE.map((b) => {
    const tasten = tastenJe.get(b.id) ?? [];
    const griffe = b.griffe ? b.griffe(tasten, layout) : griffeGerechnet(tasten, layout);
    const vorspann = b.vorspann(tasten);
    const lektion: Lesson = {
      id: b.id,
      title: b.titel(tasten, layout),
      kind: b.kind,
      newKeys: tasten,
      intro: griffe ? `${vorspann} ${griffe}` : vorspann,
    };
    if (b.enablesShift) lektion.enablesShift = true;
    if (b.corpusKinds) lektion.corpusKinds = b.corpusKinds;
    return lektion;
  });
}

/** Die türkischen Tastaturen des Weges: `tr-q` (Pflicht, Windows und Mac) und `tr-f` (nur mit Schalter). */
const TR_LAYOUTS: readonly LayoutId[] = ["tr-q", "tr-f"];

const CACHE = new Map<LayoutId, readonly Lesson[]>();

/**
 * Die Lektionen des Weges „tr" auf dieser Tastatur - gecacht, damit `lektionenFuer("tr")` bei gleicher
 * Tastatur immer DIESELBE Liste liefert. Jede Lektion trägt in {@link Lesson.introByLayout} die Einführung der anderen
 * türkischen Tastatur, wo sie abweicht.
 */
export function trLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  const cached = CACHE.get(layoutId);
  if (cached) return cached;
  const eigene = baueLektionen(layoutById(layoutId));
  const andere = TR_LAYOUTS.filter((id) => id !== layoutId).map(
    (id) => [id, new Map(baueLektionen(layoutById(id)).map((l) => [l.id, l.intro]))] as const,
  );
  for (const l of eigene) {
    const je: Partial<Record<LayoutId, string>> = {};
    for (const [id, intros] of andere) {
      const text = intros.get(l.id);
      if (text !== undefined && text !== l.intro) je[id] = text;
    }
    if (Object.keys(je).length > 0) l.introByLayout = je;
  }
  const fertig = Object.freeze(eigene);
  CACHE.set(layoutId, fertig);
  return fertig;
}
