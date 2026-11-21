/**
 * Die Regeln für JEDE türkische Textzeile (F5-tr, 03.10.2026) - eine Funktion, die der Wächter
 * `tests/tastenflow-tr-texte-regeln.test.ts` und jeder Wächter einer Text-Charge (Etappe T) gemeinsam benutzt.
 *
 * Quellen: Glossar `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md` §1 (Regeln 5-9), §4 (Fallen), Bauplan vier Sprachen (Q), Befund F4-tr §6.4
 * (Apostroph an Platz 30), `recherche-tuerkisch-2026-10-02/texte-quellen.md` §2.4/§3.
 */
import { istKernGesperrtTr } from "../../src/lib/typing/sperrlisteTr";

/** Zeichen, die auf `tr-q` nicht tippbar sind oder gegen die Hausregeln verstossen (typografisch, Gedankenstrich, º ª °, Leerzeichen-Varianten). */
const VERBOTENE_ZEICHEN = /[’‘“”«»–—…º°ª ​]/u;

/** Buchstaben der türkischen Schrift auf `tr-q` (ASCII, ç ğ ı ö ş ü, dazu â î û über die Totaste `^`, gross und klein). */
const ERLAUBTER_BUCHSTABE = /^[a-zA-ZçÇğĞıİöÖşŞüÜâÂîÎûÛ]$/u;

/**
 * ⚠️ `\b` kennt nur ASCII-Wortzeichen - vor `ş`, `ç`, `İ` gibt es für JavaScript keine Wortgrenze (gemessen: `/\bşehit/u` findet „Şehit" nicht).
 * Jede Wortgrenze dieser Datei ist darum ein Blick auf `\p{L}`.
 */
const A = "(?<![\\p{L}])";
const E = "(?![\\p{L}])";
const wort = (muster: string, flags = "u"): RegExp => new RegExp(`${A}(?:${muster})${E}`, flags);

/** Monats- und Tagesnamen: an ihnen steht KEIN Apostroph (TDK, „Ay ve gün adlarına gelen ekler kesmeyle ayrılmaz"). */
const MONAT_TAG = new RegExp(`${A}(?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık|Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar)'`, "u");

/** Häufige Wörter, die ohne türkische Sonderbuchstaben geschrieben wurden (ASCII-Ersatz: `cocuk` für `çocuk`, `icin` für `için`). */
const ASCII_ERSATZ = wort("cocuk|cocuklar|guzel|icin|yarin|bugun|sagol|turkce|turkiye|ogretmen|ogrenci|gunaydin|tesekkur|gozluk|kucuk|buyuk|isik", "iu");

/**
 * Ein Wort, das mit `I` (ı gross) beginnt und danach einen VORDEREN Vokal trägt (`Iki`, `Iyi`, `Icin`, `Isim`, `Internet`): dort stand ein
 * `toUpperCase()` ohne Sprache - es hätte `İ` heissen müssen. Die Vokalharmonie macht aus dem Satz eine Prüfung: auf `I` (hinterer Vokal)
 * folgt in einem türkischen Wort kein vorderer Vokal. (Lehnwörter wie `Irak`, `Işık`, `Irmak` bestehen: a, ı.)
 */
const I_OHNE_PUNKT_VOR_VORDEREM_VOKAL = /(?<![\p{L}'])I[^aıouAIOUeiöüEİÖÜ\s.,;:!?"'()-]*[eiöü]/u;

/** Staatssymbole: Atatürk, Flagge, Marsch - Johannes entscheidet, ob und wie sie in Übungstexte kommen (Glossar §4 Nr. 6, Gesetz 5816). */
const STAATSSYMBOL = new RegExp(`atatürk|ataturk|mustafa kemal|${A}bayrak|${A}bayrağ|istiklal marşı|andımız`, "iu");

/**
 * Religiöse und militärische Wendungen (Glossar §4 Nr. 7). ⚠️ `İ` (U+0130) faltet JavaScript auch mit dem Schalter `i` NICHT zu `i` -
 * ein Wort, das mit `i` beginnt, steht als `[iİ]` (gemessen: `/inşallah/iu` findet „İnşallah" nicht).
 */
const RELIGION_MILITAER = wort("maşallah|[iİ]nşallah|vallahi|billahi|allah|tanrı|şehit|gazi|peygamber|kur'an|cennet|cehennem", "iu");

/** Maus-Wörter (Glossar §1 Regel 8) und Anredewörter, die Geschlecht oder Rolle tragen (Regel 2). */
const MAUS = wort("tıkla\\p{L}*|dokun\\p{L}*|sürükle\\p{L}*", "iu");
const ANREDE = wort("Bey|Hanım|[Aa]bla|[Aa]bi|[Hh]ocam", "u");

/** Person zuerst (Regel 3): nie `kör çocuk`, `özürlü`, `sakat`. */
const ETIKETT = new RegExp(`${A}kör (?:çocuk|öğrenci|insan|kız|adam)|özürlü|${A}sakat${E}`, "iu");

/**
 * Alle Verstösse einer Zeile gegen die Regeln des Weges „tr" - leere Liste = in Ordnung.
 * (Jede Regel mit ihrer Quelle; die Meldung nennt sie, damit der Autor weiss, was er ändern soll.)
 */
export function zeilenFehler(zeile: string): string[] {
  const fehler: string[] = [];
  const m = VERBOTENE_ZEICHEN.exec(zeile);
  if (m) fehler.push(`Zeichen „${m[0]}“ (nur gerade Anführung/Apostroph, nur Bindestrich, \`...\` statt \`…\`, keine º ª °)`);
  for (const z of zeile) {
    if (/\p{L}/u.test(z) && !ERLAUBTER_BUCHSTABE.test(z)) {
      fehler.push(`Buchstabe „${z}“ steht auf keiner türkischen Q-Tastatur (nur a-z, ç ğ ı ö ş ü, â î û)`);
      break;
    }
  }
  if (/^\s*[-–—]\s/.test(zeile)) fehler.push("Dialogstrich am Anfang (wörtliche Rede mit \"…\")");
  if (/\s[?!:;]/.test(zeile)) fehler.push("Leerzeichen vor ? ! : ; (im Türkischen kein Leerzeichen, GLOSSAR §1 Regel 7)");
  if (I_OHNE_PUNKT_VOR_VORDEREM_VOKAL.test(zeile)) fehler.push("„I“ vor einem vorderen Vokal (Iki, Iyi): ein `toUpperCase()` ohne Sprache - es heisst „İ“ (GLOSSAR §1 Regel 9)");
  if (/\p{Ll}̇/u.test(zeile) || /i̇/u.test(zeile)) fehler.push("Kombinationspunkt U+0307 im Text (`İ.toLowerCase()` ohne Sprache)");
  if (ASCII_ERSATZ.test(zeile)) fehler.push("ASCII-Ersatz für ç ğ ı ö ş ü (cocuk, guzel, icin ...): ein anderes oder falsch geschriebenes Wort (GLOSSAR §4 Nr. 2)");
  // Apostroph: nur an Eigennamen (gross geschrieben, Buchstaben auf beiden Seiten), nie an Monats-/Tagesnamen, nie an Zahlen.
  if (/(?<!\p{L})'|'(?!\p{L})/u.test(zeile)) fehler.push("Apostroph ohne Buchstaben auf beiden Seiten (Kesme steht zwischen Name und Endung: Ankara'da; Anführung: \"…\")");
  if (/\p{Ll}[\p{L}]*'\p{L}/u.test(zeile.replace(/(^|[^\p{L}'])(\p{Lu}[\p{L}]*'\p{L}[\p{L}]*)/gu, "$1"))) fehler.push("Apostroph an einem klein geschriebenen Wort (die Kesme steht nur an Eigennamen: Ankara'da, Ali'nin)");
  if (MONAT_TAG.test(zeile)) fehler.push("Apostroph an einem Monats- oder Tagesnamen (TDK: kein Kesme - `Mart'ta` ⇒ `Martta`)");
  if (/\d'/.test(zeile)) fehler.push("Apostroph an einer Zahl (`3'ü` hängt von der Aussprache ab, Glossar Regel 6) - die Endung an ein festes Wort");
  // Zahlen: Prozent und Währung VOR der Zahl, Tausenderpunkt ab fünf Stellen, Einzahl nach einer Zahl.
  if (/\d\s?%/.test(zeile)) fehler.push("Prozentzeichen hinter der Zahl (türkisch `%95`, TDK)");
  if (/\d\s?(₺|€|\$|TL\b|TRY\b)/u.test(zeile)) fehler.push("Währung hinter der Zahl (türkisch `₺150`, `€5`)");
  if (/\b\d{5,}\b/.test(zeile)) fehler.push("Zahl mit fünf Stellen oder mehr ohne Tausenderpunkt (`12.345`)");
  if (/(?<![\d.,])\b\d+\s+\p{L}+(lar|ler)(?![\p{L}])/u.test(zeile)) fehler.push("Mehrzahl nach einer Zahl (`5 hatalar` ⇒ `5 hata`, Glossar Regel 5)");
  if (STAATSSYMBOL.test(zeile)) fehler.push("Staatssymbol (Atatürk, Bayrak, İstiklal): Johannes entscheidet (Glossar §4 Nr. 6, Gesetz 5816)");
  if (RELIGION_MILITAER.test(zeile)) fehler.push("religiöse oder militärische Wendung (Glossar §4 Nr. 7)");
  if (MAUS.test(zeile)) fehler.push("Maus-Wort (tıkla, dokun, sürükle) - Tastenwege beschreiben (GLOSSAR §1 Regel 8)");
  if (ANREDE.test(zeile)) fehler.push("Anredewort mit Geschlecht oder Rolle (Bey, Hanım, abla, abi, hocam; GLOSSAR §1 Regel 2)");
  if (ETIKETT.test(zeile)) fehler.push("Etikett statt „Person zuerst“ (kör çocuk, özürlü, sakat; Glossar Regel 3)");
  for (const wort of zeile.split(/[\s,.;:!?"()]+/)) {
    if (wort && istKernGesperrtTr(wort)) fehler.push(`Sperrwort „${wort}“ (sperrlisteTr.ts)`);
  }
  if (/\s{2,}/.test(zeile) || zeile !== zeile.trim()) fehler.push("doppelte oder umgebende Leerzeichen");
  return fehler;
}
